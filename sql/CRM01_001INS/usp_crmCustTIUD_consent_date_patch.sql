USE [PnCInt21_New]
GO

/*
 * usp_crmCustTIUD — 동의일(SMS/MKT) 패치
 *
 * 현재 DB 본문(consent EXEC 4곳 이미 있음)에 아래 4가지만 적용 후 ALTER 실행.
 * SSMS: usp_crmCustTIUD → Script as ALTER → 찾아 바꾸기
 *
 * 배포 순서:
 *   1) usp_crmCustConsentLog_IUD.sql
 *   2) 본 패치 적용 → ALTER usp_crmCustTIUD
 *   3) usp_crmCustMod_consent_date.sql
 *   4) usp_crmCustNew_consent_date.sql
 */

/* =============================================================================
   [1] 파라미터 — @p_lngSleepStts 와 @p_retMsg OUT 사이에 추가
   =============================================================================
	, @p_lngSleepStts	INT = 0
	, @p_strSmsConsentDate VARCHAR(10) = NULL   /* yyyy-MM-dd, API: SMSAGREEDATE */
	, @p_strMktConsentDate  VARCHAR(10) = NULL   /* yyyy-MM-dd, API: MKTAGREEDATE */
	, @p_retMsg			varchar(255)	out
   ============================================================================= */

/* =============================================================================
   [2] DECLARE — @v_intAgreeSms 아래 추가
   =============================================================================
	, @v_intAgreeSms	TINYINT
	, @v_dtmSmsConsent	DATETIME
	, @v_dtmMktConsent	DATETIME
   ============================================================================= */

/* =============================================================================
   [3] SET — getCompanyCode 직후 추가
   =============================================================================
	SET @v_lngCompany = dbo.getCompanyCode(@p_lngStoreGroup)

	SET @v_dtmSmsConsent = NULL
	SET @v_dtmMktConsent = NULL

	IF ISDATE(NULLIF(LTRIM(RTRIM(@p_strSmsConsentDate)), '')) = 1
		SET @v_dtmSmsConsent = CAST(LTRIM(RTRIM(@p_strSmsConsentDate)) AS DATETIME)

	IF ISDATE(NULLIF(LTRIM(RTRIM(@p_strMktConsentDate)), '')) = 1
		SET @v_dtmMktConsent = CAST(LTRIM(RTRIM(@p_strMktConsentDate)) AS DATETIME)
   ============================================================================= */

/* =============================================================================
   [4] EXEC 4곳 — 마지막 인자 @p_dtmConsent 추가 (찾아 바꾸기)
   =============================================================================

   [4-1] MKT UPDATE (crmCustJoin UPDATE 직후)
   찾기:
		EXEC dbo.usp_crmCustConsentLog_IUD
			 @v_lngCompany, @p_lngCustNo, 'MKT', @v_intAgreeMkt, @v_prevMkt, @p_intUserSeq, 'PAGE', N'usp_crmCustTIUD'
   바꾸기:
		EXEC dbo.usp_crmCustConsentLog_IUD
			 @v_lngCompany, @p_lngCustNo, 'MKT', @v_intAgreeMkt, @v_prevMkt, @p_intUserSeq, 'PAGE', N'usp_crmCustTIUD', @v_dtmMktConsent

   [4-2] MKT INSERT (crmCustJoin INSERT 직후, ELSE 안)
   찾기:
		EXEC dbo.usp_crmCustConsentLog_IUD
			 @v_lngCompany, @p_lngCustNo, 'MKT', @v_intAgreeMkt, NULL, @p_intUserSeq, 'PAGE', N'usp_crmCustTIUD'
   바꾸기:
		EXEC dbo.usp_crmCustConsentLog_IUD
			 @v_lngCompany, @p_lngCustNo, 'MKT', @v_intAgreeMkt, NULL, @p_intUserSeq, 'PAGE', N'usp_crmCustTIUD', @v_dtmMktConsent

   [4-3] SMS UPDATE (crmSMSMail UPDATE 직후)
   찾기:
		EXEC dbo.usp_crmCustConsentLog_IUD
			 @v_lngCompany, @p_lngCustNo, 'SMS', @v_intAgreeSms, @v_prevSms, @p_intUserSeq, 'PAGE', N'usp_crmCustTIUD'
   바꾸기:
		EXEC dbo.usp_crmCustConsentLog_IUD
			 @v_lngCompany, @p_lngCustNo, 'SMS', @v_intAgreeSms, @v_prevSms, @p_intUserSeq, 'PAGE', N'usp_crmCustTIUD', @v_dtmSmsConsent

   [4-4] SMS INSERT (crmSMSMail INSERT 직후, ELSE 안)
   찾기:
		EXEC dbo.usp_crmCustConsentLog_IUD
			 @v_lngCompany, @p_lngCustNo, 'SMS', @v_intAgreeSms, NULL, @p_intUserSeq, 'PAGE', N'usp_crmCustTIUD'
   바꾸기:
		EXEC dbo.usp_crmCustConsentLog_IUD
			 @v_lngCompany, @p_lngCustNo, 'SMS', @v_intAgreeSms, NULL, @p_intUserSeq, 'PAGE', N'usp_crmCustTIUD', @v_dtmSmsConsent

   ============================================================================= */

/* 배포 후 확인 */
SELECT p.name, t.name AS type_name
  FROM sys.parameters p
  JOIN sys.types t ON p.user_type_id = t.user_type_id
 WHERE p.object_id = OBJECT_ID('dbo.usp_crmCustTIUD')
   AND p.name IN ('@p_strSmsConsentDate', '@p_strMktConsentDate')
 ORDER BY p.parameter_id;
GO
