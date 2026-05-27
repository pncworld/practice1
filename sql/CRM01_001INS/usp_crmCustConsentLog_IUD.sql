USE [PnCInt21_New]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/*
    SMS / 마케팅 수신동의
    1) crmCustConsentLog  — 변경 이력 (1변경 1행)
    2) crmCustConsentStat — 최종 동의/거절 시각 (외부 API용)

    strReqChannel: PAGE (usp_crmCustTIUD / Mod / New), WSVC (usp_crmCustInfo_Web)

    @p_dtmConsent: 화면 입력 동의일 (yyyy-MM-dd). NULL 이면 GETDATE().
    동의 값이 같고 @p_dtmConsent 만 바뀐 경우 Stat 일자만 갱신 (이력 없음).
*/
IF OBJECT_ID(N'dbo.usp_crmCustConsentLog_IUD', N'P') IS NULL
BEGIN
    EXEC(N'
CREATE PROCEDURE dbo.usp_crmCustConsentLog_IUD
AS
BEGIN
    SET NOCOUNT ON;
END
');
END
GO

ALTER PROCEDURE dbo.usp_crmCustConsentLog_IUD
(
      @p_lngCompany     INT
    , @p_lngCustNo      INT
    , @p_strConsentType VARCHAR(3)          /* SMS | MKT */
    , @p_intAgree       TINYINT              /* 1=동의, 0=미동의 */
    , @p_intPrevAgree   TINYINT      = NULL /* 변경 전; 신규면 NULL */
    , @p_intUserSeq     INT          = NULL
    , @p_strReqChannel  VARCHAR(4)           /* PAGE | WSVC */
    , @p_strRemark      NVARCHAR(200) = NULL
    , @p_dtmConsent     DATETIME      = NULL /* 화면 동의일; NULL=GETDATE() */
)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @v_now DATETIME = ISNULL(@p_dtmConsent, GETDATE());
    DECLARE @v_curStatDate DATETIME;

    IF @p_lngCompany IS NULL OR @p_lngCustNo IS NULL
        RETURN;

    IF @p_strConsentType NOT IN ('SMS', 'MKT')
        RETURN;

    IF @p_intAgree NOT IN (0, 1)
        RETURN;

    IF @p_strReqChannel NOT IN ('PAGE', 'WSVC')
        RETURN;

    IF @p_intPrevAgree IS NOT NULL AND @p_intPrevAgree NOT IN (0, 1)
        SET @p_intPrevAgree = NULL;

    /* 동의 값 동일 + 화면 일자만 변경 → Stat 일자만 수정 */
    IF @p_intPrevAgree IS NOT NULL AND @p_intAgree = @p_intPrevAgree
    BEGIN
        IF @p_dtmConsent IS NULL
            RETURN;

        SET @v_curStatDate = NULL;
        SELECT @v_curStatDate = CASE WHEN @p_intAgree = 1 THEN dtmLastAgree ELSE dtmLastRefuse END
          FROM dbo.crmCustConsentStat WITH (NOLOCK)
         WHERE lngCompany     = @p_lngCompany
           AND lngCustNo      = @p_lngCustNo
           AND strConsentType = @p_strConsentType;

        IF @v_curStatDate IS NOT NULL
           AND CONVERT(DATE, @v_curStatDate) = CONVERT(DATE, @v_now)
            RETURN;

        IF EXISTS (
            SELECT 1
              FROM dbo.crmCustConsentStat WITH (NOLOCK)
             WHERE lngCompany     = @p_lngCompany
               AND lngCustNo      = @p_lngCustNo
               AND strConsentType = @p_strConsentType
        )
        BEGIN
            UPDATE dbo.crmCustConsentStat
               SET dtmLastAgree    = CASE WHEN @p_intAgree = 1 THEN @v_now ELSE dtmLastAgree END
                 , dtmLastRefuse   = CASE WHEN @p_intAgree = 0 THEN @v_now ELSE dtmLastRefuse END
                 , intUserSeq      = @p_intUserSeq
                 , strLastChannel  = @p_strReqChannel
                 , dtmUpdate       = GETDATE()
             WHERE lngCompany     = @p_lngCompany
               AND lngCustNo      = @p_lngCustNo
               AND strConsentType = @p_strConsentType;
        END
        ELSE
        BEGIN
            INSERT INTO dbo.crmCustConsentStat (
                  lngCompany, lngCustNo, strConsentType
                , intCurrentAgree, dtmLastAgree, dtmLastRefuse
                , intUserSeq, strLastChannel, dtmUpdate
            )
            VALUES (
                  @p_lngCompany, @p_lngCustNo, @p_strConsentType
                , @p_intAgree
                , CASE WHEN @p_intAgree = 1 THEN @v_now ELSE NULL END
                , CASE WHEN @p_intAgree = 0 THEN @v_now ELSE NULL END
                , @p_intUserSeq, @p_strReqChannel, GETDATE()
            );
        END

        RETURN;
    END

    /* 1) 이력 */
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
          @p_lngCompany
        , @p_lngCustNo
        , @p_strConsentType
        , @p_intAgree
        , @p_intPrevAgree
        , @p_intUserSeq
        , @p_strReqChannel
        , @p_strRemark
        , @v_now
    );

    /* 2) API용 최종 동의/거절 시각 */
    IF @p_intAgree = 1
    BEGIN
        MERGE dbo.crmCustConsentStat AS t
        USING (
            SELECT @p_lngCompany     AS lngCompany
                 , @p_lngCustNo      AS lngCustNo
                 , @p_strConsentType AS strConsentType
        ) AS s
        ON  t.lngCompany     = s.lngCompany
        AND t.lngCustNo      = s.lngCustNo
        AND t.strConsentType = s.strConsentType
        WHEN MATCHED THEN
            UPDATE SET
                  intCurrentAgree = 1
                , dtmLastAgree    = @v_now
                , intUserSeq      = @p_intUserSeq
                , strLastChannel  = @p_strReqChannel
                , dtmUpdate       = GETDATE()
        WHEN NOT MATCHED THEN
            INSERT (
                  lngCompany, lngCustNo, strConsentType
                , intCurrentAgree, dtmLastAgree, dtmLastRefuse
                , intUserSeq, strLastChannel, dtmUpdate
            )
            VALUES (
                  @p_lngCompany, @p_lngCustNo, @p_strConsentType
                , 1, @v_now, NULL
                , @p_intUserSeq, @p_strReqChannel, GETDATE()
            );
    END
    ELSE
    BEGIN
        MERGE dbo.crmCustConsentStat AS t
        USING (
            SELECT @p_lngCompany     AS lngCompany
                 , @p_lngCustNo      AS lngCustNo
                 , @p_strConsentType AS strConsentType
        ) AS s
        ON  t.lngCompany     = s.lngCompany
        AND t.lngCustNo      = s.lngCustNo
        AND t.strConsentType = s.strConsentType
        WHEN MATCHED THEN
            UPDATE SET
                  intCurrentAgree = 0
                , dtmLastRefuse   = @v_now
                , intUserSeq      = @p_intUserSeq
                , strLastChannel  = @p_strReqChannel
                , dtmUpdate       = GETDATE()
        WHEN NOT MATCHED THEN
            INSERT (
                  lngCompany, lngCustNo, strConsentType
                , intCurrentAgree, dtmLastAgree, dtmLastRefuse
                , intUserSeq, strLastChannel, dtmUpdate
            )
            VALUES (
                  @p_lngCompany, @p_lngCustNo, @p_strConsentType
                , 0, NULL, @v_now
                , @p_intUserSeq, @p_strReqChannel, GETDATE()
            );
    END
END
GO
