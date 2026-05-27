USE [PnCInt21_New]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/*
	고객 신규 가입 + CRM01 동의일(SMS/MKT) → usp_crmCustTIUD 전달
	Made by Ag, 2009/11/29
*/
ALTER Procedure [dbo].[usp_crmCustNew]
(
	   @p_lngStoreGroup		INT
	 , @p_lngStoreCode		INT
	 , @p_intUserSeq		INT				= NULL
	 , @p_strCCardID		VARCHAR(16)
	 , @p_strCustName		NVARCHAR(200)	= NULL
	 , @p_strCustEName		VARCHAR(50)		= NULL
	 , @p_intCustCls		SMALLINT		= 1
	 , @p_blnSex			BIT				= NULL
	 , @p_blnMarried		BIT				= NULL
	 , @p_strResiNo1		VARCHAR(6)		= NULL
	 , @p_strResiNo2		VARCHAR(7)		= NULL
	 , @p_blnSMS			BIT				= 0
	 , @p_blnEmail			BIT				= 0
	 , @p_strMobile			VARCHAR(20)		= NULL
	 , @p_strEmail			VARCHAR(100)	= NULL
	 , @p_strHomeTel		VARCHAR(13)		= NULL
	 , @p_strHomeZip		VARCHAR(7)		= NULL
	 , @p_strHomeAddr1		NVARCHAR(200)	= NULL
	 , @p_strHomeAddr2		NVARCHAR(200)	= NULL
	 , @p_strEtcTel			VARCHAR(13)		= NULL
	 , @p_strEtcZip			VARCHAR(7)		= NULL
	 , @p_strEtcAddr1		NVARCHAR(200)	= NULL
	 , @p_strEtcAddr2		NVARCHAR(200)	= NULL
	 , @p_intDMRecv			SMALLINT		= NULL
	 , @v_intSDayCls		SMALLINT		= NULL
	 , @p_intJobCls			SMALLINT		= NULL
	 , @p_strCompany		VARCHAR(100)	= NULL
	 , @p_strJobRank		NVARCHAR(200)	= NULL
	 , @p_strDepart			NVARCHAR(200)	= NULL
	 , @p_strBirthYY		CHAR(4)			= NULL
	 , @p_strBirthMM		CHAR(2)			= NULL
	 , @p_strBirthDD		CHAR(2)			= NULL
	 , @p_blnSolar			BIT				= 1
	 , @p_strWeddingYY		CHAR(4)			= NULL
	 , @p_strWeddingMM		CHAR(2)			= NULL
	 , @p_strWeddingDD		CHAR(2)			= NULL
	 , @p_blnCustAgree		BIT				= 0
	 , @p_intLevel			SMALLINT		= 1
	 , @p_strRemark			VARCHAR(255)	= NULL
	 , @p_retMsg			VARCHAR(255) OUT
	 , @p_strBeforeAmount	VARCHAR(1)		= 'N'
	 , @p_dtmMania			VARCHAR(10)		= NULL
	 , @p_lngPrfStrCD		INT				= 0
	 , @p_strSmsConsentDate VARCHAR(10) = NULL
	 , @p_strMktConsentDate  VARCHAR(10) = NULL
	 , @p_lngCustNoRtn		VARCHAR(16)		= NULL OUT
)
AS

BEGIN
	DECLARE	@v_lngCompany	INT
		  , @v_lngCustNo	INT
		  , @v_intJoinSts	INT
		  , @v_intIssueSts	INT
		  , @v_strTIUD		CHAR(1)
		  , @v_strMsg		VARCHAR(255)
		  , @v_dtmDate		DATE
		  , @v_lngPromoCode INT				= 153

	SET @v_lngCompany = dbo.getCompanyCode(@p_lngStoreGroup)
	SET @v_strTIUD = 'i'

	IF @p_strBeforeAmount is null
	BEGIN
		SET @p_strBeforeAmount = 'N'
	END

	IF @p_lngStoreGroup = 1435
	BEGIN
		SET @p_strBeforeAmount = 'N'
    END

	IF @p_lngStoreGroup = 1640
	BEGIN
		SELECT @p_strBeforeAmount = ISNULL(strApplyType,'N')
		  FROM crmLevelInfo
		 WHERE lngStoreGroup = @p_lngStoreGroup
		   AND lngLevel = @p_intLevel
	END

	SET @v_intJoinSts = 1
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

	IF @v_lngCustNo < 0
	BEGIN
		SET @p_retMsg = @v_strMsg
		SELECT @v_strMsg
		RETURN @v_lngCustNo
	END

	IF @p_dtmMania is not null AND LTRIM(RTRIM(@p_dtmMania)) <> '' AND ISDATE(@p_dtmMania) = 1
	BEGIN
		SET @v_dtmDate = CAST(@p_dtmMania AS DATETIME)
	END

	SET @v_intIssueSts = 1
	EXEC usp_crmCCardTIUD @v_strTIUD, @p_strCCardID, @p_lngStoreGroup, @p_lngStoreCode, @v_lngCustNo, @v_intIssueSts, @p_intUserSeq, null, null, null, @v_dtmDate

	EXEC usp_crmCustNewPoint @v_lngCustNo, @p_strCCardID, @p_lngStoreGroup, @p_lngStoreCode, @p_intLevel

	IF @p_lngStoreGroup = 1871 and @p_intLevel <> 5
	BEGIN
		EXEC usp_crmPromoCouponCreate_Web @p_lngStoreGroup, @p_lngStoreCode, @v_lngCustNo, @v_lngPromoCode
	END

	SET @p_lngCustNoRtn = @v_lngCustNo
	SET @p_retMsg = 'true'
	SELECT @p_retMsg
	RETURN @v_lngCustNo
END
GO
