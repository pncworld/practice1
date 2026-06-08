/*
 * crmCustConsentLog + crmCustConsentStat — BFIL 가입일 백필 (연도별 자동 순회)
 *
 * 대상: crmCustConsentStat 없는 고객만 (재실행 안전)
 * 채널: BFIL / 동의일: crmCustJoin.dtmJoin
 *
 * 실행:
 *   1) @DryRun = 1 → 연도별 건수만 출력 후 종료
 *   2) @DryRun = 0 → 연도별 순차 적재 (중단 후 재실행 가능)
 *
 * SSMS: 쿼리 실행 시간 제한 = 0 권장
 */
USE [PnCInt21_New];
GO

SET NOCOUNT ON;

/* ------------------------------------------------------------------ */
-- 설정
/* ------------------------------------------------------------------ */
DECLARE @BackfillBeforeDate DATE         = '2024-06-01';   -- 이 날짜 이전 가입만
DECLARE @YearFrom           INT          = 2008;          -- 시작 연도
DECLARE @YearTo             INT          = 2024;          -- 종료 연도 (2024 = 1~5월분)
DECLARE @DryRun             BIT          = 1;            -- 1=미리보기, 0=실제 적재
DECLARE @ReqChannel         VARCHAR(4)   = 'BFIL';
DECLARE @Remark             NVARCHAR(200) = N'가입일 기준 임의 등록';
DECLARE @lngStoreGroup      INT          = 1871;
DECLARE @BatchUserSeq       INT          = 9999;

DECLARE @TargetYear         INT          = @YearFrom;
DECLARE @rowCnt             INT;
DECLARE @custCnt            INT;
DECLARE @doneYear           INT          = 0;
DECLARE @errYear            INT          = 0;
DECLARE @doneTotal          INT          = 0;
DECLARE @errTotal           INT          = 0;
DECLARE @tStart             DATETIME;
DECLARE @tEnd               DATETIME;

DECLARE @lngCompany         INT;
DECLARE @lngCustNo          INT;
DECLARE @strConsentType     VARCHAR(3);
DECLARE @intAgree           TINYINT;
DECLARE @dtmConsent         DATETIME;

PRINT CONCAT(
    N'[BFIL Backfill] StoreGroup=', @lngStoreGroup
  , N' Before=', CONVERT(VARCHAR(10), @BackfillBeforeDate, 23)
  , N' Years=', @YearFrom, N'~', @YearTo
  , N' DryRun=', @DryRun
);

/* ------------------------------------------------------------------ */
-- 연도별 루프
/* ------------------------------------------------------------------ */
WHILE @TargetYear <= @YearTo
BEGIN
    SET @tStart = GETDATE();
    SET @doneYear = 0;
    SET @errYear = 0;

    IF OBJECT_ID('tempdb..#Backfill') IS NOT NULL
        DROP TABLE #Backfill;

    SELECT j.lngCompany
         , j.lngCustNo
         , j.lngStoreGroup
         , c.strConsentType
         , c.intAgree
         , CAST(j.dtmJoin AS DATETIME) AS dtmConsent
      INTO #Backfill
      FROM dbo.crmCustJoin j WITH (NOLOCK)
     CROSS APPLY (
           SELECT 'MKT' AS strConsentType
                , CASE WHEN ISNULL(j.blnCustAgree, 0) = 1 THEN 1 ELSE 0 END AS intAgree
           UNION ALL
           SELECT 'SMS'
                , CASE WHEN ISNULL(s.blnSMS, 0) = 1 THEN 1 ELSE 0 END
             FROM dbo.crmSMSMail s WITH (NOLOCK)
            WHERE s.lngCompany = j.lngCompany
              AND s.lngCustNo  = j.lngCustNo
       ) c
     WHERE j.lngStoreGroup = @lngStoreGroup
       AND j.dtmJoin IS NOT NULL
       AND CAST(j.dtmJoin AS DATE) < @BackfillBeforeDate
       AND DATEPART(YEAR, j.dtmJoin) = @TargetYear
       AND j.intJoinSts = 1
       AND ISNULL(j.lngSleepStts, 0) = 0
       AND NOT EXISTS (
             SELECT 1
               FROM dbo.crmCustConsentStat st WITH (NOLOCK)
              WHERE st.lngCompany     = j.lngCompany
                AND st.lngCustNo      = j.lngCustNo
                AND st.strConsentType = c.strConsentType
           );

    SELECT @rowCnt  = COUNT(*)
         , @custCnt = COUNT(DISTINCT lngCustNo)
      FROM #Backfill;

    IF @rowCnt = 0
    BEGIN
        PRINT CONCAT(N'[', @TargetYear, N'] skip (0 rows)');
        SET @TargetYear = @TargetYear + 1;
        CONTINUE;
    END

    PRINT CONCAT(
        N'[', @TargetYear, N'] rows=', @rowCnt
      , N' cust=', @custCnt
      , CASE WHEN @DryRun = 1 THEN N' (preview only)' ELSE N' applying...' END
    );

    IF @DryRun = 1
    BEGIN
        SELECT @TargetYear AS targetYear
             , strConsentType
             , intAgree
             , COUNT(*) AS rowCnt
          FROM #Backfill
         GROUP BY strConsentType, intAgree
         ORDER BY strConsentType, intAgree;

        DROP TABLE #Backfill;
        SET @TargetYear = @TargetYear + 1;
        CONTINUE;
    END

    /* 적재 (연도마다 커서 재생성 — SQL 2008 R2 호환) */
    IF CURSOR_STATUS('local', 'cur_bfil') >= -1
    BEGIN
        IF CURSOR_STATUS('local', 'cur_bfil') > -1 CLOSE cur_bfil;
        DEALLOCATE cur_bfil;
    END

    DECLARE cur_bfil CURSOR LOCAL FAST_FORWARD FOR
        SELECT lngCompany, lngCustNo, strConsentType, intAgree, dtmConsent
          FROM #Backfill
         ORDER BY lngCompany, lngCustNo, strConsentType;

    OPEN cur_bfil;
    FETCH NEXT FROM cur_bfil
     INTO @lngCompany, @lngCustNo, @strConsentType, @intAgree, @dtmConsent;

    WHILE @@FETCH_STATUS = 0
    BEGIN
        BEGIN TRY
            EXEC dbo.usp_crmCustConsentLog_IUD
                 @lngCompany
               , @lngCustNo
               , @strConsentType
               , @intAgree
               , NULL
               , @BatchUserSeq
               , @ReqChannel
               , @Remark
               , @dtmConsent;

            SET @doneYear = @doneYear + 1;
        END TRY
        BEGIN CATCH
            SET @errYear = @errYear + 1;
            PRINT CONCAT(
                N'[ERR ', @TargetYear, N'] company=', @lngCompany
              , N' cust=', @lngCustNo
              , N' type=', @strConsentType
              , N' ', ERROR_MESSAGE()
            );
        END CATCH

        FETCH NEXT FROM cur_bfil
         INTO @lngCompany, @lngCustNo, @strConsentType, @intAgree, @dtmConsent;
    END

    CLOSE cur_bfil;
    DEALLOCATE cur_bfil;

    DROP TABLE #Backfill;

    SET @tEnd = GETDATE();
    SET @doneTotal = @doneTotal + @doneYear;
    SET @errTotal  = @errTotal  + @errYear;

    PRINT CONCAT(
        N'[', @TargetYear, N'] done success=', @doneYear
      , N' error=', @errYear
      , N' elapsed_sec=', DATEDIFF(SECOND, @tStart, @tEnd)
    );

    SET @TargetYear = @TargetYear + 1;
END

/* ------------------------------------------------------------------ */
-- 요약
/* ------------------------------------------------------------------ */
IF @DryRun = 1
BEGIN
    PRINT N'[DRY RUN 완료] @DryRun = 0 으로 바꾼 뒤 재실행하세요.';
END
ELSE
BEGIN
    PRINT CONCAT(N'[ALL DONE] success=', @doneTotal, N' error=', @errTotal);

    SELECT strConsentType
         , intCurrentAgree
         , COUNT(*) AS statCnt
      FROM dbo.crmCustConsentStat WITH (NOLOCK)
     WHERE strLastChannel = @ReqChannel
     GROUP BY strConsentType, intCurrentAgree
     ORDER BY strConsentType, intCurrentAgree;
END
GO
