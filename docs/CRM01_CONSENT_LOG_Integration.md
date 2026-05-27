# 수신동의 로그 — 공통 SP + 연동 대상

공통 SP: **`usp_crmCustConsentLog_IUD`** — `crmCustConsentLog`(이력) + **`crmCustConsentStat`**(최종 동의/거절 시각, API용)

| 호출하는 SP | 용도 | `@p_strReqChannel` |
|-------------|------|---------------------|
| **`usp_crmCustTIUD`** | CRM01 웹 화면 (사내) | **`PAGE`** |
| **`usp_crmCustInfo_Web`** | 웹서비스 API | **`WSVC`** |

동일 값이면 로그 없음. 변경 시에만 `crmCustConsentLog` INSERT.

---

## strReqChannel

| 값 | 의미 |
|----|------|
| `PAGE` | PncOffice 화면 → `insertCustomerInfo` / `updateCustomerInfo` → TIUD |
| `WSVC` | `usp_crmCustInfo_Web` 등 웹서비스 전용 SP |

`usp_crmCustConsentLog_IUD`는 **`PAGE`/`WSVC`만 허용** (기본값 없음 — 호출 시 명시).

---

## 데이터 매핑 (두 SP 공통)

| strConsentType | 테이블 | 컬럼 | 입력 파라미터 |
|----------------|--------|------|---------------|
| `MKT` | `crmCustJoin` | `blnCustAgree` | `@p_blnCustAgree` |
| `SMS` | `crmSMSMail` | `blnSMS` | `@p_blnSMS` |

---

## 삽입 위치 (프로시저별)

**`docs/CRM01_CONSENT_LOG_InsertPoints.md`** — TIUD / Web 각 4곳(①~④), 앵커·순서·다이어그램.

## usp_crmCustTIUD

연동 상세: `docs/CRM01_CONSENT_LOG_usp_crmCustTIUD.md`  
모든 `EXEC` → **`@p_strReqChannel = 'PAGE'`**.

---

## usp_crmCustInfo_Web

상세: **`docs/CRM01_CONSENT_LOG_usp_crmCustInfo_Web.md`**  
스니펫: `sql/CRM01_001INS/usp_crmCustInfo_Web_consent_log_snippet.sql`  
모든 `EXEC` → **`'WSVC'`** (위치 인자, TIUD와 동일 4곳).

`BEGIN TRAN` 안에서 호출 → 고객 저장과 로그 동시 커밋/롤백.

---

## CRM01 Vue

- `pcond9` → `BLNSMS` → TIUD → 로그 채널 **PAGE**
- `pcond32` → `CUSTAGREE` → TIUD → 로그 채널 **PAGE**
- `pcondSmsAgreeDate` → `SMSAGREEDATE` → `@p_strSmsConsentDate` → `@p_dtmConsent` (SMS)
- `pcondMktAgreeDate` → `MKTAGREEDATE` → `@p_strMktConsentDate` → `@p_dtmConsent` (MKT)
- Vue에서 `usp_crmCustConsentLog_IUD` **직접 호출하지 않음** (TIUD/Web SP 안에서만 호출 → 중복 방지)

저장 연동 상세: `docs/CRM01_CONSENT_DATE_SAVE_API.md`
