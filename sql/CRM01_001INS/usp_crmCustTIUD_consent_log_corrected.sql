/*
 * usp_crmCustTIUD — crmCustJoin / crmSMSMail 구간 (수신동의 로그 수정본)
 *
 * 1) DECLARE 에 추가:
 *      , @v_intAgreeMkt  TINYINT
 *      , @v_intAgreeSms  TINYINT
 *      , @v_dtmSmsConsent DATETIME
 *      , @v_dtmMktConsent DATETIME
 *
 *      SET @v_dtmSmsConsent = NULL
 *      SET @v_dtmMktConsent = NULL
 *      IF ISDATE(NULLIF(LTRIM(RTRIM(@p_strSmsConsentDate)), '')) = 1
 *          SET @v_dtmSmsConsent = CONVERT(DATETIME, LTRIM(RTRIM(@p_strSmsConsentDate)), 23)
 *      IF ISDATE(NULLIF(LTRIM(RTRIM(@p_strMktConsentDate)), '')) = 1
 *          SET @v_dtmMktConsent = CONVERT(DATETIME, LTRIM(RTRIM(@p_strMktConsentDate)), 23)
 *      (SQL Server 2008 R2 이하: TRY_CONVERT 미지원 → ISDATE + CONVERT 사용)
 *
 * 2) 아래 블록으로 "-- 회사코드가 들어가야 하는 것들" ~ crmSMSMail END 까지 교체
 *
 * 102 오류 (@p_blnCustAgree / @p_blnSMS 근처):
 *   - EXEC 안에 ... 문서 placeholder 가 남아 있거나
 *   - CAST(... AS TINYINT) 를 EXEC 인자에 직접 쓴 경우 → 아래처럼 SET 후 위치 인자 EXEC
 */

			declare @v_intOrgLevel	int
				  , @v_intLevel		int

			-- 회사코드가 들어가야 하는 것들....-------------------------------------------------------------------------------
			IF EXISTS
			(
				SELECT 1
				  FROM crmCustJoin with(nolock)
				 WHERE lngCompany = @v_lngCompany
				   AND lngCustNo = @p_lngCustNo
			)
			BEGIN
				IF @v_lngCompany=1460 and @p_intLevel=15
				BEGIN
					SELECT @v_intOrgLevel = intOrgLevel
						 , @v_intLevel = intLevel
					  FROM crmCustJoin with(nolock)
					 WHERE lngCompany = @v_lngCompany
					   AND lngCustNo = @p_lngCustNo

					IF @v_intLevel <> 15
					BEGIN
						SET @v_intOrgLevel = @v_intLevel
					END
				END
				ELSE
				BEGIN
					SET @v_intOrgLevel=@p_intLevel
				END

				SELECT @v_prevMkt = CAST(blnCustAgree AS TINYINT)
				  FROM crmCustJoin WITH (NOLOCK)
				 WHERE lngCompany = @v_lngCompany
				   AND lngCustNo  = @p_lngCustNo;

				UPDATE crmCustJoin
				   SET intJoinSts		= @p_intJoinSts
					 , blnCustAgree		= @p_blnCustAgree
					 , intLevel			= @p_intLevel
					 , strRemark		= @p_strRemark
					 , lngUpdateUser	= @p_intUserSeq
					 , dtmUpdate		= getdate()
					 , lngStoreCode		= @p_lngStoreCode
					 , intOrgLevel		= @v_intOrgLevel
					 , lngStoreGroup	= @p_lngStoreGroup
					 , lngSleepStts		= @p_lngSleepStts
				 WHERE lngCompany = @v_lngCompany
				   AND lngCustNo = @p_lngCustNo

				SET @v_intAgreeMkt = CASE WHEN @p_blnCustAgree = 1 THEN 1 ELSE 0 END
				EXEC dbo.usp_crmCustConsentLog_IUD
					 @v_lngCompany, @p_lngCustNo, 'MKT', @v_intAgreeMkt, @v_prevMkt, @p_intUserSeq, 'PAGE', N'usp_crmCustTIUD', @v_dtmMktConsent

				UPDATE crmCCard
				   SET lngStoreCode = @p_lngStoreCode
					 , lngStoreGroup = @p_lngStoreGroup
				 WHERE lngCompany = @v_lngCompany
				   AND lngCustNo = @p_lngCustNo
			END
			ELSE
			BEGIN
				IF @v_lngCompany=1460 and @p_intLevel=15
				BEGIN
					SET @v_intOrgLevel = 1
				END
				ELSE
				BEGIN
					SET @v_intOrgLevel = @p_intLevel
				END

				INSERT INTO crmCustJoin
				(
					   lngCompany
					 , lngCustNo
					 , lngStoreGroup
					 , lngStoreCode
					 , intJoinSts
					 , blnCustAgree
					 , intLevel
					 , strRemark
					 , lngInsertUser
					 , intOrgLevel
					 , lngSleepStts
				)
				VALUES
				(
					   @v_lngCompany
					 , @p_lngCustNo
					 , @p_lngStoreGroup
					 , @p_lngStoreCode
					 , @p_intJoinSts
					 , @p_blnCustAgree
					 , @p_intLevel
					 , @p_strRemark
					 , @p_intUserSeq
					 , @v_intOrgLevel
					 , @p_lngSleepStts
				)

				SET @v_intAgreeMkt = CASE WHEN @p_blnCustAgree = 1 THEN 1 ELSE 0 END
				EXEC dbo.usp_crmCustConsentLog_IUD
					 @v_lngCompany, @p_lngCustNo, 'MKT', @v_intAgreeMkt, NULL, @p_intUserSeq, 'PAGE', N'usp_crmCustTIUD', @v_dtmMktConsent
			END

			SET @v_intErr = @@ERROR

			IF @v_intErr <> 0
			BEGIN
				SET @p_retMsg = 'db error...insert crmCustJoin [custNo]' + cast(@p_lngCustNo as varchar) + '[lngCompany]' + cast(@v_lngCompany as varchar)
				rollback tran
				exec usp_zz_audit @v_intErr, @strErrPlace=@p_retMsg
				return -9
			END

			-- 회사에서 매일이나 SMS를 보내기 위한 테이블이므로.....
			IF @p_strMobile is not null or @p_blnEmail is not null
			BEGIN
				IF EXISTS
				(
					SELECT 1
					  FROM crmSMSMail with(nolock)
					 WHERE lngCompany = @v_lngCompany
					   AND lngCustNo = @p_lngCustNo
				)
				BEGIN
					SELECT @v_prevSms = CAST(blnSMS AS TINYINT)
					  FROM crmSMSMail WITH (NOLOCK)
					 WHERE lngCompany = @v_lngCompany
					   AND lngCustNo  = @p_lngCustNo;

					UPDATE crmSMSMail
					   SET blnSMS = @p_blnSMS
						 , blnEmail = @p_blnEmail
						 , strMobile = @p_strMobile
						 , strEmail = @p_strEmail
					 WHERE lngCompany = @v_lngCompany
					   AND lngCustNo = @p_lngCustNo

					SET @v_intAgreeSms = CASE WHEN @p_blnSMS = 1 THEN 1 ELSE 0 END
					EXEC dbo.usp_crmCustConsentLog_IUD
						 @v_lngCompany, @p_lngCustNo, 'SMS', @v_intAgreeSms, @v_prevSms, @p_intUserSeq, 'PAGE', N'usp_crmCustTIUD', @v_dtmSmsConsent
				END
				ELSE
				BEGIN
					INSERT INTO crmSMSMail
					(
						   lngCompany
						 , lngCustNo
						 , blnSMS
						 , blnEmail
						 , strMobile
						 , strEmail
					)
					VALUES
					(
						   @v_lngCompany
						 , @p_lngCustNo
						 , @p_blnSMS
						 , @p_blnEmail
						 , @p_strMobile
						 , @p_strEmail
					)

					SET @v_intAgreeSms = CASE WHEN @p_blnSMS = 1 THEN 1 ELSE 0 END
					EXEC dbo.usp_crmCustConsentLog_IUD
						 @v_lngCompany, @p_lngCustNo, 'SMS', @v_intAgreeSms, NULL, @p_intUserSeq, 'PAGE', N'usp_crmCustTIUD', @v_dtmSmsConsent
				END
			END

			SET @v_intErr = @@ERROR

			IF @v_intErr <> 0
			BEGIN
				set @p_retMsg = 'db error...insert crmCustJoin [custNo]'+ cast(@p_lngCustNo as varchar) +'[lngCompany]'+ cast(@v_lngCompany as varchar)
				rollback tran
				exec usp_zz_audit @v_intErr, @strErrPlace=@p_retMsg
				return -9
			END
