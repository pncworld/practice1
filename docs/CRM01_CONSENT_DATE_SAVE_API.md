# CRM01 팝업 — SMS·마케팅 동의일 저장 연동

## 흐름

```
CRM01_001INS.vue (pcondSmsAgreeDate / pcondMktAgreeDate)
  → micrm.js (SMSAGREEDATE / MKTAGREEDATE)
  → CRM01_001INS.asmx (updateCustomerInfo / insertCustomerInfo)
  → usp_crmCustMod / usp_crmCustNew (동의일 파라미터만 TIUD로 전달)
  → usp_crmCustTIUD
  → usp_crmCustConsentLog_IUD (@p_dtmConsent)
  → crmCustConsentLog + crmCustConsentStat
```

## API 파라미터 (신규)

| 필드 | 형식 | 설명 |
|------|------|------|
| `SMSAGREEDATE` | `yyyy-MM-dd` 또는 null | SMS 수신 동의일 / 미동의일 |
| `MKTAGREEDATE` | `yyyy-MM-dd` 또는 null | 마케팅 수신 동의일 / 미동의일 |

- 신규: 화면에서 오늘 날짜 기본값
- 수정: 조회값 표시 후 편집 가능
- null/빈값: SP에서 `GETDATE()` 사용 (기존과 동일)

## SP 배포 순서

1. `sql/CRM01_001INS/usp_crmCustConsentLog_IUD.sql` — `@p_dtmConsent` 추가
2. `usp_crmCustTIUD` — `usp_crmCustTIUD_consent_log_corrected.sql` + 동의일 파라미터 2개
3. `usp_crmCustMod` / `usp_crmCustNew` — TIUD 호출에 동의일 2개 **전달만** (`usp_crmCustMod_New_consent_date_snippet.sql`)
4. API `CRM01_001INS.asmx.cs` 재배포 — **SP 반영 후** `@p_strSmsConsentDate` / `@p_strMktConsentDate` 를 Mod/New 호출에 다시 연결

> **주의:** SP에 동의일 파라미터가 없는 상태에서 API만 먼저 배포하면 `usp_crmCustNew` 저장 실패  
> (`Procedure ... has no parameters named @p_strSmsConsentDate` 등).  
> SP 미배포 시 API는 Mod/New 호출에서 해당 2개 파라미터를 **보내지 않음** (프론트는 계속 전송 가능).

## Stat 갱신 규칙 (`usp_crmCustConsentLog_IUD`)

| 경우 | 동작 |
|------|------|
| 동의 값 변경 | 이력 INSERT + Stat MERGE (`@p_dtmConsent` 또는 GETDATE) |
| 동의 값 동일 + 일자만 변경 | Stat `dtmLastAgree` / `dtmLastRefuse` 만 수정 (이력 없음) |
| 동의 값 동일 + 일자 동일 | 변경 없음 |

## Vue 저장 시

```javascript
formatConsentDateDisplay(pcondSmsAgreeDate.value)  // → SMSAGREEDATE
formatConsentDateDisplay(pcondMktAgreeDate.value)  // → MKTAGREEDATE
```
