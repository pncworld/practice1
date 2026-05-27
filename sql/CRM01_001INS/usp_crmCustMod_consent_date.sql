USE [PnCInt21_New]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/*
	고객 정보 수정 + CRM01 동의일(SMS/MKT) → usp_crmCustTIUD 전달
*/
ALTER Procedure [dbo].[usp_crmCustMod]
(
	   @p_lngStoreGroup INT						-- 필수입력 - 매장그룹코드
	 , @p_lngStoreCode	INT						-- 필수입력 - 매장코드
	 , @p_intJoinSts	SMALLINT		= 1		-- 가입상태, 1:정상 2:대기 3:탈퇴 4:삭제
	 , @p_intUserSeq	INT				= null	-- 작업자
	 , @p_lngCustNo		INT						-- 고객번호
	 , @p_strCustName	VARCHAR(50)		= null	-- 고객이름
	 , @p_strCustEName	VARCHAR(50)		= null	-- 고객이름영문
	 , @p_intCustCls	SMALLINT		= 1		-- 고객구분, 1:개인 2:법인
	 , @p_blnSex		BIT				= null	-- 성별(주민번호 없으면 꼭 입력받자), 0:여자 1:남자
	 , @p_blnMarried	BIT				= null	-- 결혼유무, 0:미혼 1:기혼
	 , @p_strResiNo1	VARCHAR(6)		= null	-- 주민번호앞자리
	 , @p_strResiNo2	VARCHAR(7)		= null	-- 주민번호뒷자리
	 , @p_blnSMS		BIT				= 0		-- SMS 수신허용여부
	 , @p_blnEmail		BIT				= 0		-- Email 수신허용 여부
	 , @p_strMobile		VARCHAR(20)		= null	-- 핸드폰번호
	 , @p_strEmail		VARCHAR(100)	= null	-- 이메일주소
	 , @p_strHomeTel	VARCHAR(13)		= null	-- 집전화
	 , @p_strHomeZip	VARCHAR(7)		= null	-- 집주소...
	 , @p_strHomeAddr1	VARCHAR(100)	= null
	 , @p_strHomeAddr2	VARCHAR(100)	= null
	 , @p_strEtcTel		VARCHAR(13)		= null	-- 기타전화
	 , @p_strEtcZip		VARCHAR(7)		= null	-- 기타주소...
	 , @p_strEtcAddr1	VARCHAR(100)	= null
	 , @p_strEtcAddr2	VARCHAR(100)	= null
	 , @p_intDMRecv		SMALLINT		= null	-- 우편받을곳, 1:집 2:기타
	 , @v_intSDayCls	SMALLINT		= null	-- 주기념일, 1:생일 2:결혼기념일
	 , @p_intJobCls		SMALLINT		= null	-- 직업구분
	 , @p_strCompany	VARCHAR(100)	= null	-- 회사명
	 , @p_strJobRank	VARCHAR(50)		= null	-- 직급
	 , @p_strDepart		VARCHAR(50)		= null	-- 부서
	 , @p_strBirthYY	CHAR(4)			= null	-- 생일
	 , @p_strBirthMM	CHAR(2)			= null
	 , @p_strBirthDD	CHAR(2)			= null
	 , @p_blnSolar		BIT				= 1		-- 음력구분, 0:음력 1:양력
	 , @p_strWeddingYY	CHAR(4)			= null	-- 결혼기념일
	 , @p_strWeddingMM	CHAR(2)			= null
	 , @p_strWeddingDD	CHAR(2)			= null
	 , @p_blnCustAgree	BIT				= 0		-- 정보활용동의여부
	 , @p_intLevel		SMALLINT		= 1		-- 고객등급
	 , @p_strRemark		VARCHAR(255)	= null	-- 비고
	 , @p_intStopRsn	SMALLINT		= null
	 , @p_retMsg		VARCHAR(255) OUT
	 , @p_dtmMania		VARCHAR(10)		= null
	 , @p_lngPrfStrCD	INT				= 0
	 , @p_strSmsConsentDate VARCHAR(10) = NULL
	 , @p_strMktConsentDate  VARCHAR(10) = NULL
)
AS

BEGIN
	DECLARE
		   @v_lngCompany	INT
		 , @v_intIssueSts	INT
		 , @v_strTIUD		CHAR(1)
		 , @v_intRet		INT
		 , @v_intCardRsn	SMALLINT
		 , @v_strMsg		VARCHAR(255)

	SET @v_strTIUD = 'u'

	IF @p_intJoinSts = 3 or @p_intJoinSts = 4
	BEGIN
		EXEC usp_crmCustStop @p_lngStoreGroup, @p_lngCustNo, null, @p_intJoinSts, @p_intStopRsn, @p_intUserSeq

		SET @v_intIssueSts = 4

		SELECT @v_intCardRsn = intCd
		  FROM mstCmmn
		 WHERE strGroupCd = 'CardRsn' and strVal = 'custStop'

		EXEC usp_crmCCardTIUD @v_strTIUD, 'all', @p_lngStoreGroup, @p_lngStoreCode, @p_lngCustNo, @v_intIssueSts, @p_intUserSeq, @v_intCardRsn, null, null, @p_dtmMania

		RETURN
	END

	SET @v_lngCompany = dbo.getCompanyCode(@p_lngStoreGroup)

	IF @p_intJoinSts = 1
	BEGIN
		UPDATE crmCCard
		   SET dtmManiaExpiry =
			   (
					CASE WHEN @p_dtmMania is null then null
						 ELSE CONVERT(date, @p_dtmMania)
					END
			   )
		 WHERE lngCompany = @v_lngCompany
		   AND lngCustNo = @p_lngCustNo
		   AND intIssueSts in (1,2)
	 END

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

	IF @v_intRet < 0
	BEGIN
		SELECT @v_strMsg
		RETURN @v_intRet
	END

	SET @p_retMsg = 'true'
	SELECT @p_retMsg
	RETURN 1
END
GO
