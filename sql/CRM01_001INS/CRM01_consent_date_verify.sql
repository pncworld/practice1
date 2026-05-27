USE [PnCInt21_New]
GO

/*
 * CRM01 동의일 저장 — 배포 상태 점검
 * 저장 실패 시 SSMS에서 실행 후 빠진 항목 확인
 */

PRINT '=== 1. 테이블 ===';
SELECT name FROM sys.tables
 WHERE name IN ('crmCustConsentLog', 'crmCustConsentStat');

PRINT '=== 2. usp_crmCustConsentLog_IUD (@p_dtmConsent 필수) ===';
SELECT name FROM sys.parameters
 WHERE object_id = OBJECT_ID('dbo.usp_crmCustConsentLog_IUD')
 ORDER BY parameter_id;

PRINT '=== 3. usp_crmCustTIUD / Mod / New 동의일 파라미터 ===';
SELECT OBJECT_NAME(object_id) AS sp_name, name
  FROM sys.parameters
 WHERE object_id IN (
       OBJECT_ID('dbo.usp_crmCustTIUD'),
       OBJECT_ID('dbo.usp_crmCustMod'),
       OBJECT_ID('dbo.usp_crmCustNew')
   )
   AND name LIKE '%Consent%'
 ORDER BY 1, parameter_id;

GO
