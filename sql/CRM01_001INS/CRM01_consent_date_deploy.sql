/*
 * CRM01 동의일 저장 — DB 배포 순서
 *
 * SSMS에서 순서대로 실행:
 *   1. crmCustConsentLog_Table.sql          (테이블 없을 때)
 *   2. crmCustConsentStat_Table.sql         (테이블 없을 때)
 *   3. usp_crmCustConsentLog_IUD.sql
 *   4. usp_crmCustTIUD_consent_date_patch.sql  ← 본문 4군데 적용 후 ALTER TIUD
 *   5. usp_crmCustMod_consent_date.sql
 *   6. usp_crmCustNew_consent_date.sql
 *
 *   7. API CRM01_001INS.asmx.cs 재배포 (동의일 파라미터)
 *   8. (선택) crmCustConsentStat_Backfill.sql
 */

PRINT 'Run scripts 1-6 in order. See CRM01_consent_date_deploy.sql header.';
