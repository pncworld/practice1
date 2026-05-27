/*
 * usp_crmCustMod / usp_crmCustNew — 팝업 동의일(SMS·MKT) 연동
 *
 * ★ Mod/New 본문에는 crmCustJoin·crmSMSMail 이 없음.
 *   둘 다 usp_crmCustTIUD 만 EXEC → consent 로그·동의일 처리는 TIUD 에 반영.
 *
 * API: CRM01_001INS.asmx → insertCustomerInfo / updateCustomerInfo
 *       SMSAGREEDATE, MKTAGREEDATE (yyyy-MM-dd, nullable)
 *
 * 배포 순서:
 *   1) usp_crmCustConsentLog_IUD.sql
 *   2) usp_crmCustTIUD — usp_crmCustTIUD_consent_log_corrected.sql (+ 아래 ①②)
 *   3) usp_crmCustMod / usp_crmCustNew — 아래 ③④ (TIUD 로 전달만)
 *   4) API @p_strSmsConsentDate / @p_strMktConsentDate 재연결
 */

/* ========== ① usp_crmCustTIUD — 인자 추가 (@p_retMsg 앞) ========== */
/*
    , @p_strSmsConsentDate VARCHAR(10) = NULL   /* yyyy-MM-dd */
    , @p_strMktConsentDate  VARCHAR(10) = NULL
*/

/* ========== ② usp_crmCustTIUD — DECLARE (기존 @v_intAgreeMkt 근처) + crmCustJoin/crmSMSMail EXEC 4곳
 *     → sql/CRM01_001INS/usp_crmCustTIUD_consent_log_corrected.sql 전체 사용
 *     (@v_dtmSmsConsent / @v_dtmMktConsent 변환 포함)
 */

/* ========== ③ usp_crmCustNew — 인자 추가 (@p_lngCustNoRtn 앞) ========== */
/*
    , @p_strSmsConsentDate VARCHAR(10) = NULL
    , @p_strMktConsentDate  VARCHAR(10) = NULL
*/

/* ========== ④ usp_crmCustNew — usp_crmCustTIUD EXEC 마지막 인자 2개 추가 (@p_retMsg 앞) ========== */
/*
	EXEC @v_lngCustNo = usp_crmCustTIUD
					    @v_strTIUD		, @p_lngStoreGroup		, @p_lngStoreCode	, @v_intJoinSts		, @p_intUserSeq
					  , null			, @p_strCustName		, @p_strCustEName	, @p_intCustCls		, @p_blnSex
					  , @p_blnMarried	, @p_strResiNo1			, @p_strResiNo2		, @p_blnSMS			, @p_blnEmail
					  , @p_strMobile	, @p_strEmail			, @p_strHomeTel		, @p_strHomeZip		, @p_strHomeAddr1
					  , @p_strHomeAddr2	, @p_strEtcTel			, @p_strEtcZip		, @p_strEtcAddr1	, @p_strEtcAddr2
					  , @p_intDMRecv	, @v_intSDayCls			, @p_intJobCls		, @p_strCompany		, @p_strJobRank
					  , @p_strDepart	, @p_strBirthYY			, @p_strBirthMM		, @p_strBirthDD		, @p_blnSolar
					  , @p_strWeddingYY	, @p_strWeddingMM		, @p_strWeddingDD	, @p_blnCustAgree	, @p_intLevel
					  , @p_strRemark	, @p_strBeforeAmount	, @p_lngPrfStrCD, 0, 0
					  , @p_strSmsConsentDate , @p_strMktConsentDate
					  , @p_retMsg=@v_strMsg OUT
*/

/* ========== ⑤ usp_crmCustMod — 인자 추가 (@p_lngPrfStrCD 다음, @p_retMsg OUT 앞) ========== */
/*
    , @p_strSmsConsentDate VARCHAR(10) = NULL
    , @p_strMktConsentDate  VARCHAR(10) = NULL
*/

/* ========== ⑥ usp_crmCustMod — usp_crmCustTIUD EXEC 마지막 인자 2개 추가 ========== */
/*
	 EXEC @v_intRet = usp_crmCustTIUD @v_strTIUD, @p_lngStoreGroup, @p_lngStoreCode, @p_intJoinSts, @p_intUserSeq
									, @p_lngCustNo, @p_strCustName, @p_strCustEName, @p_intCustCls, @p_blnSex
									, @p_blnMarried, @p_strResiNo1, @p_strResiNo2, @p_blnSMS, @p_blnEmail
									, @p_strMobile, @p_strEmail, @p_strHomeTel, @p_strHomeZip, @p_strHomeAddr1
									, @p_strHomeAddr2, @p_strEtcTel, @p_strEtcZip, @p_strEtcAddr1, @p_strEtcAddr2
									, @p_intDMRecv, @v_intSDayCls, @p_intJobCls, @p_strCompany, @p_strJobRank
									, @p_strDepart, @p_strBirthYY, @p_strBirthMM, @p_strBirthDD, @p_blnSolar
									, @p_strWeddingYY, @p_strWeddingMM, @p_strWeddingDD, @p_blnCustAgree, @p_intLevel
									, @p_strRemark, 'N', @p_lngPrfStrCD, 0, 0
									, @p_strSmsConsentDate, @p_strMktConsentDate
									, @p_retMsg = @v_strMsg out
*/
