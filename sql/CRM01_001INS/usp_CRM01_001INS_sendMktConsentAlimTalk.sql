USE [PnCInt21_New];
GO

SET ANSI_NULLS ON;
GO
SET QUOTED_IDENTIFIER ON;
GO

/*
    CRM01 마케팅 수신동의 안내 알림톡 발송 + 동의일 Stat/Log 반영

    - mstAlimTalkInfo(lngMsgType=5) → usp_CrmSendKakaoAlimTalk
    - 발송 성공 후 @p_strConsentDate → crmCustConsentStat / crmCustConsentLog
      (usp_crmCustConsentLog_IUD Stat 갱신 + 알림톡 발송 이력 Log INSERT)

    WebMethod: sendMktConsentAlimTalk (GROUP_CD, CUST_NO, CONSENT_DATE)
*/
IF OBJECT_ID(N'dbo.usp_CRM01_001INS_sendMktConsentAlimTalk', N'P') IS NOT NULL
    DROP PROCEDURE dbo.usp_CRM01_001INS_sendMktConsentAlimTalk;
GO

CREATE PROCEDURE dbo.usp_CRM01_001INS_sendMktConsentAlimTalk
(
      @p_lngStoreGroup   INT
    , @p_lngCustNo       INT
    , @p_strConsentDate  VARCHAR(10)          /* YYYY-MM-DD (발송 창 동의일) */
    , @p_intUserSeq      INT          = NULL
    , @p_RESULT_CD       VARCHAR(2)   = NULL OUTPUT
    , @p_RESULT_NM       VARCHAR(200) = NULL OUTPUT
)
AS
BEGIN
    SET NOCOUNT ON;

    SET @p_RESULT_CD = '99';
    SET @p_RESULT_NM = N'UNKNOWN ERROR';

    DECLARE @KT_PROFILEKEY VARCHAR(100)
          , @KT_TEMPCODE   VARCHAR(30)
          , @KT_CALLBACK   VARCHAR(20)
          , @KT_BTNNAME    VARCHAR(255)
          , @KT_BTNURL     VARCHAR(255)
          , @KT_PCURL      VARCHAR(255)
          , @strNote1      VARCHAR(100)
          , @lngMsgType    INT = 5
          , @v_lngCompany  INT
          , @v_dtmConsent  DATETIME
          , @v_intPrevMkt  TINYINT
          , @v_intAgreeMkt TINYINT = 1;

    BEGIN TRY
        IF @p_lngStoreGroup IS NULL OR @p_lngStoreGroup <= 0
        BEGIN
            SET @p_RESULT_CD = '98';
            SET @p_RESULT_NM = N'브랜드코드가 올바르지 않습니다.';
            RETURN;
        END

        IF @p_lngCustNo IS NULL OR @p_lngCustNo <= 0
        BEGIN
            SET @p_RESULT_CD = '98';
            SET @p_RESULT_NM = N'고객번호가 올바르지 않습니다.';
            RETURN;
        END

        IF ISNULL(LTRIM(RTRIM(@p_strConsentDate)), '') = ''
           OR ISDATE(@p_strConsentDate) = 0
        BEGIN
            SET @p_RESULT_CD = '98';
            SET @p_RESULT_NM = N'마케팅 수신동의 일자가 올바르지 않습니다.';
            RETURN;
        END

        SET @v_lngCompany = dbo.getCompanyCode(@p_lngStoreGroup);
        IF @v_lngCompany IS NULL
            SET @v_lngCompany = @p_lngStoreGroup;

        SET @v_dtmConsent = CAST(@p_strConsentDate AS DATETIME);

        SELECT @KT_PROFILEKEY = KT_PROFILEKEY
             , @KT_TEMPCODE   = KT_TEMPCODE
             , @KT_CALLBACK   = KT_CALLBACK
             , @KT_BTNNAME    = KT_BTNNAME
             , @KT_BTNURL     = KT_BTNURL
             , @KT_PCURL      = KT_PCURL
          FROM dbo.mstAlimTalkInfo WITH (NOLOCK)
         WHERE lngStoreGroup = @p_lngStoreGroup
           AND lngMsgType    = @lngMsgType;

        IF ISNULL(@KT_TEMPCODE, '') = ''
        BEGIN
            SET @p_RESULT_CD = '97';
            SET @p_RESULT_NM = N'마케팅 수신동의 알림톡 템플릿이 등록되어 있지 않습니다.';
            RETURN;
        END

        SET @strNote1 =
              CONCAT(
                  SUBSTRING(@p_strConsentDate, 1, 4), N'년 ',
                  CAST(CAST(SUBSTRING(@p_strConsentDate, 6, 2) AS INT) AS VARCHAR(10)), N'월 ',
                  CAST(CAST(SUBSTRING(@p_strConsentDate, 9, 2) AS INT) AS VARCHAR(10)), N'일'
              );

        EXEC dbo.usp_CrmSendKakaoAlimTalk
             @lngStoreGroup  = @p_lngStoreGroup
           , @lngCustNo      = @p_lngCustNo
           , @lngMsgType     = @lngMsgType
           , @KT_PROFILEKEY  = @KT_PROFILEKEY
           , @KT_TEMPCODE    = @KT_TEMPCODE
           , @KT_CALLBACK    = @KT_CALLBACK
           , @KT_BTNNAME     = @KT_BTNNAME
           , @KT_BTNURL      = @KT_BTNURL
           , @KT_PCURL       = @KT_PCURL
           , @strNote1       = @strNote1
           , @strNote2       = NULL
           , @strNote3       = NULL
           , @strNote4       = NULL
           , @strNote5       = NULL
           , @strNote6       = NULL;

        /* 변경 전 MKT 동의 (Stat → Join) */
        SET @v_intPrevMkt = NULL;
        SELECT @v_intPrevMkt = intCurrentAgree
          FROM dbo.crmCustConsentStat WITH (NOLOCK)
         WHERE lngCompany     = @v_lngCompany
           AND lngCustNo      = @p_lngCustNo
           AND strConsentType = 'MKT';

        IF @v_intPrevMkt IS NULL
        BEGIN
            SELECT @v_intPrevMkt = CASE WHEN ISNULL(j.blnCustAgree, 0) = 1 THEN 1 ELSE 0 END
              FROM dbo.crmCustJoin j WITH (NOLOCK)
             WHERE j.lngCompany = @v_lngCompany
               AND j.lngCustNo  = @p_lngCustNo;
        END

        IF @v_intPrevMkt IS NULL
            SET @v_intPrevMkt = 1;

        /* Stat 갱신 (동의 값 동일·일자만 변경 시 Stat만 수정하는 경로 포함) */
        EXEC dbo.usp_crmCustConsentLog_IUD
             @p_lngCompany     = @v_lngCompany
           , @p_lngCustNo      = @p_lngCustNo
           , @p_strConsentType = 'MKT'
           , @p_intAgree       = @v_intAgreeMkt
           , @p_intPrevAgree   = @v_intPrevMkt
           , @p_intUserSeq     = @p_intUserSeq
           , @p_strReqChannel  = 'PAGE'
           , @p_strRemark      = N'마케팅 수신동의 알림톡 발송'
           , @p_dtmConsent     = @v_dtmConsent;

        /*
         * 동의 값 동일(1→1) 시 IUD는 Stat만 갱신하고 Log는 생략 → 알림톡 이력 INSERT
         * 동의 값 변경 시 IUD가 Log까지 적재 → 중복 INSERT 방지
         */
        IF @v_intPrevMkt = @v_intAgreeMkt
        BEGIN
            INSERT INTO dbo.crmCustConsentLog
            (
                  lngCompany
                , lngCustNo
                , strConsentType
                , intAgree
                , intPrevAgree
                , intUserSeq
                , strReqChannel
                , strRemark
                , dtmInsert
            )
            VALUES
            (
                  @v_lngCompany
                , @p_lngCustNo
                , 'MKT'
                , @v_intAgreeMkt
                , @v_intPrevMkt
                , @p_intUserSeq
                , 'PAGE'
                , N'마케팅 수신동의 알림톡 발송'
                , @v_dtmConsent
            );
        END

        SET @p_RESULT_CD = '00';
        SET @p_RESULT_NM = N'SUCCESS';
    END TRY
    BEGIN CATCH
        SET @p_RESULT_CD = '99';
        SET @p_RESULT_NM = ERROR_MESSAGE();
    END CATCH
END
GO
