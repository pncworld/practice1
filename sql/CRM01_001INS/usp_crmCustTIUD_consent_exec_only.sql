/*
 * 오류 102 수정용 — EXEC 4곳만 교체 (줄 598/657/702 근처)
 *
 * DECLARE 에 추가:
 */
/*
	, @v_intAgreeMkt  TINYINT
	, @v_intAgreeSms  TINYINT
*/

/* ========== ① MKT UPDATE (UPDATE crmCustJoin 직후, crmCCard UPDATE 전) ========== */
/*
				SET @v_intAgreeMkt = CASE WHEN @p_blnCustAgree = 1 THEN 1 ELSE 0 END
				EXEC dbo.usp_crmCustConsentLog_IUD
					 @v_lngCompany, @p_lngCustNo, 'MKT', @v_intAgreeMkt, @v_prevMkt, @p_intUserSeq, 'PAGE', N'usp_crmCustTIUD', @v_dtmMktConsent
 */

/* ========== ② MKT INSERT (INSERT crmCustJoin 직후, ELSE 안) ========== */
/*
				SET @v_intAgreeMkt = CASE WHEN @p_blnCustAgree = 1 THEN 1 ELSE 0 END
				EXEC dbo.usp_crmCustConsentLog_IUD
					 @v_lngCompany, @p_lngCustNo, 'MKT', @v_intAgreeMkt, NULL, @p_intUserSeq, 'PAGE', N'usp_crmCustTIUD', @v_dtmMktConsent
 */

/* ========== ③ SMS UPDATE (UPDATE crmSMSMail 직후, IF EXISTS 안) ========== */
/*
					SET @v_intAgreeSms = CASE WHEN @p_blnSMS = 1 THEN 1 ELSE 0 END
					EXEC dbo.usp_crmCustConsentLog_IUD
						 @v_lngCompany, @p_lngCustNo, 'SMS', @v_intAgreeSms, @v_prevSms, @p_intUserSeq, 'PAGE', N'usp_crmCustTIUD', @v_dtmSmsConsent
 */

/* ========== ④ SMS INSERT (INSERT crmSMSMail 직후, ELSE 안) ========== */
/*
					SET @v_intAgreeSms = CASE WHEN @p_blnSMS = 1 THEN 1 ELSE 0 END
					EXEC dbo.usp_crmCustConsentLog_IUD
						 @v_lngCompany, @p_lngCustNo, 'SMS', @v_intAgreeSms, NULL, @p_intUserSeq, 'PAGE', N'usp_crmCustTIUD', @v_dtmSmsConsent
 */

/* 삭제할 것 (있으면 컴파일 102):
		EXEC dbo.usp_crmCustConsentLog_IUD
			 ...
		@p_intAgree = CAST(@p_blnCustAgree AS TINYINT),
*/
