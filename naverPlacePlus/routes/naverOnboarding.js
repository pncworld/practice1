/**
 * "동의 및 시작" 첫 화면 — 우리 서비스가 직접 만드는 랜딩/동의안내 페이지
 *
 * 아임유 가이드(PDF) 3페이지 기준 ①번 화면입니다.
 * ②(네이버 로그인) ③(네이버 서비스 약관동의)는 네이버가 제공하는 페이지라서
 * 우리가 만들 수 없지만, ①번 "동의하고 시작" 화면은 POS사가 직접 만들어서
 * 자사 브랜딩 + 개인정보 제3자 제공 안내 문구를 보여준 뒤 네이버 약관동의
 * 페이지(/naver/terms/start)로 넘겨주는 역할을 합니다.
 *
 * 실서비스에서는 로그인한 사장님 계정(storeId)을 세션에서 가져와야 합니다.
 * 데모에서는 쿼리 파라미터로 storeId를 받습니다.
 */

const express = require("express");
const router = express.Router();
const { renderLayout } = require("../ui/layout");
const {
  readNaverSession,
  rememberNaverUser,
  rememberStoreId,
  clearNaverUser,
  markConsent,
  hasConsent,
} = require("../services/npSession");
const { getAccessToken } = require("../services/naverAuth");
const {
  getAgreementSummary,
  hasAllRequiredAgreements,
  listConnectedBusinesses,
} = require("../services/placeApi");
const { renderConnectedPage } = require("./naverPlaces");
const {
  createPosSession,
  getPosSession,
  hasStalePosCookie,
  endPosSession,
  isPosOnlyMode,
} = require("../services/posSession");
const { openLinkReq, saveStep } = require("../services/pncApi");
const posFlowRouter = require("./naverPosFlow");
const { toNotice } = require("./naverPosFlow");

const COMPANY_NAME = process.env.COMPANY_NAME || "우리 회사";

// POS 연동 화면: /naver/start/status, /leave, /notice
router.use(posFlowRouter);

/**
 * P1 POS 진입: /naver/start?t={요청 ID}
 * pncWebService 로 요청 ID 를 확인(1회 사용)하고 서버 세션을 만든 뒤 P2 상태 확인으로 보낸다.
 */
async function handlePosEntry(req, res) {
  res.set("Cache-Control", "no-store");
  const reqId = String(req.query.t || "").trim();
  if (!/^[0-9a-fA-F]{32}$/.test(reqId)) return toNotice(req, res, "1005");

  let json;
  try {
    json = await openLinkReq(reqId);
  } catch (err) {
    console.error("[naver/start] 요청 ID 확인 실패:", err.message);
    return toNotice(req, res, "4009");
  }
  if (json.OK_YN !== "Y") return toNotice(req, res, json.RES_CD || "1005");

  // 이전 POS 세션·데모 쿠키는 정리하고 새 세션으로 시작
  endPosSession(req, res);
  clearNaverUser(res);
  createPosSession(res, {
    reqId,
    storeGroup: json.STORE_GROUP,
    storeCode: json.STORE_CODE,
    storeName: json.STORE_NAME || "",
    dbLinkYn: json.DB_LINK_YN || "X",
    dbUniqueId: json.NAVER_UNIQUE_ID || "",
    dbPlaceId: json.PLACE_ID || "",
    dbPlaceName: json.PLACE_NAME || "",
    dbLinkDt: json.LINK_DT || "",
    dbUnlinkDt: json.UNLINK_DT || "",
    loginUniqueId: "",
    state: "",
    check: null,
  });
  return res.redirect("/naver/start/status");
}

function withIdentity(path, storeId, naverUniqueId) {
  const params = new URLSearchParams({ storeId, naverUniqueId });
  return `${path}?${params.toString()}`;
}

router.get("/agree", async (req, res) => {
  // POS 연동: 동의 저장(CONSENT) → 이번 요청에서 로그인했으면 약관, 아니면 네이버 로그인
  const pos = getPosSession(req);
  if (pos) {
    markConsent(res);
    try {
      const saved = await saveStep(pos.reqId, "CONSENT");
      if (!saved.ok) return toNotice(req, res, saved.resCd);
    } catch (err) {
      console.error("[naver/start/agree] CONSENT 저장 실패:", err.message);
      return toNotice(req, res, "4009");
    }
    return res.redirect(pos.loginUniqueId ? "/naver/terms/start" : "/naver/login/start");
  }
  if (hasStalePosCookie(req)) return toNotice(req, res, "3001");
  if (isPosOnlyMode()) return toNotice(req, res, "1005");

  const session = readNaverSession(req);
  const storeId = req.query.storeId || session.storeId || "demo-store-1";
  const naverUniqueId = req.query.naverUniqueId || session.naverUniqueId || "";
  markConsent(res);
  if (naverUniqueId) {
    return res.redirect(withIdentity("/naver/terms/start", storeId, naverUniqueId));
  }
  return res.redirect(`/naver/login/start?storeId=${encodeURIComponent(storeId)}`);
});

router.get("/", async (req, res) => {
  // P1 POS 진입
  if (req.query.t) return handlePosEntry(req, res);

  // POS 연동 세션이 있으면 주소의 storeId·naverUniqueId 를 쓰지 않는다
  const pos = getPosSession(req);
  if (pos) {
    res.set("Cache-Control", "no-store");
    if (req.query.fromTerms === "1") {
      // 네이버 약관에서 돌아옴 → 필수 약관 재확인 후 업체 선택(업체 선택 화면이 연동 여부도 다시 확인)
      try {
        const accessToken = await getAccessToken(`${pos.storeGroup}-${pos.storeCode}`, process.env.DEMO_REFRESH_TOKEN);
        const summary = await getAgreementSummary({ accessToken, naverUniqueId: pos.loginUniqueId || pos.dbUniqueId });
        if (hasAllRequiredAgreements(summary)) {
          const saved = await saveStep(pos.reqId, "TERMS");
          if (!saved.ok) return toNotice(req, res, saved.resCd);
        }
      } catch (err) {
        console.error("[naver/start] 약관 동의 재확인 실패:", err.response?.data || err.message);
      }
      return res.redirect("/naver/places");
    }
    if (req.query.consent === "1") {
      return sendConsentPage(res, "/naver/start/agree", "/naver/start/status");
    }
    return res.redirect("/naver/start/status");
  }
  if (hasStalePosCookie(req)) return toNotice(req, res, "3001");
  if (isPosOnlyMode()) return toNotice(req, res, "1005");

  const session = readNaverSession(req);
  const storeId = req.query.storeId || session.storeId || "demo-store-1";
  const naverUniqueIdFromQuery = req.query.naverUniqueId || "";
  res.set("Cache-Control", "no-store");

  const fromTerms = req.query.fromTerms === "1";

  if (!fromTerms && !naverUniqueIdFromQuery && session.naverUniqueId) {
    clearNaverUser(res);
    rememberStoreId(res, storeId);
    return res.redirect(`/naver/login/start?storeId=${encodeURIComponent(storeId)}`);
  }

  const naverUniqueId = naverUniqueIdFromQuery || (fromTerms ? session.naverUniqueId || "" : "");

  if (!fromTerms && naverUniqueId) {
    try {
      const accessToken = await getAccessToken(storeId, process.env.DEMO_REFRESH_TOKEN);
      const connected = await listConnectedBusinesses({ accessToken, naverUniqueId });
      if (connected.length) {
        rememberNaverUser(res, storeId, naverUniqueId);
        // 이미 연동된 계정도 필수 약관(사업자 정보제공 동의 포함)이 빠져 있으면 약관 페이지로 보낸다.
        const summary = await getAgreementSummary({ accessToken, naverUniqueId });
        if (!hasAllRequiredAgreements(summary)) {
          return res.redirect(withIdentity("/naver/terms/start", storeId, naverUniqueId));
        }
        return res.send(renderConnectedPage({ storeId, naverUniqueId, connected }));
      }
      if (hasConsent(req)) {
        const summary = await getAgreementSummary({ accessToken, naverUniqueId });
        const nextPath = hasAllRequiredAgreements(summary) ? "/naver/places" : "/naver/terms/start";
        return res.redirect(withIdentity(nextPath, storeId, naverUniqueId));
      }
    } catch (err) {
      console.error(
        "[naver/start] 연동 계정 확인 실패:",
        err.response?.data || err.message
      );
    }
  } else if (!fromTerms && req.query.consent !== "1") {
    return res.redirect(`/naver/login/start?storeId=${encodeURIComponent(storeId)}`);
  }

  const agreeUrl = `/naver/start/agree?storeId=${encodeURIComponent(storeId)}${
    naverUniqueId ? `&naverUniqueId=${encodeURIComponent(naverUniqueId)}` : ""
  }`;

  return sendConsentPage(res, agreeUrl, "/naver/start?consent=1");
});

/** P3 개인(신용)정보 제3자 제공 동의 화면 (문구는 변경하지 않음) */
function sendConsentPage(res, agreeUrl, cancelUrl) {
  return res.send(
    renderLayout({
      title: "네이버 플레이스+ 연동",
      heading: "네이버 플레이스+ 연동",
      subtitle: `${COMPANY_NAME}에서 연동하여 관리하세요.`,
      wide: true,
      body: `
        <div class="notice-box">
          <div class="notice-title">개인(신용)정보 제3자 제공 동의 <span class="required">필수</span></div>
          <p class="notice-lead">
            「개인정보 보호법」 제17조 및 「신용정보의 이용 및 보호에 관한 법률」에 따라,
            네이버 플레이스+ 연동을 위해 아래와 같이 개인(신용)정보를 제3자에게 제공합니다.
            아래 내용을 확인하신 후 동의 여부를 결정해 주시기 바랍니다.
          </p>
          <dl>
            <dt>개인(신용)정보를 제공받는 자</dt>
            <dd>네이버 주식회사 (플레이스+)</dd>
            <dt>제공받는 자의 이용 목적</dt>
            <dd>
              네이버 플레이스+ 연동 서비스 제공, 매장(사업장) 확인 및 식별,
              POS와 플레이스+ 간 매장 연동·연동 유지 및 해지 처리
            </dd>
            <dt>제공하는 개인(신용)정보의 항목</dt>
            <dd>
              사업자등록번호, 상호, 대표자 성명, 사업장 주소, 업태·종목,
              매장명, 매장 연락처, 영업시간 등 매장·사업자 정보,
              네이버 아이디로 로그인 시 수집되는 식별정보(네이버 Unique ID)
            </dd>
            <dt>제공받는 자의 보유 및 이용 기간</dt>
            <dd>
              연동 목적 달성 시까지(연동 해지 시까지).
              다만 관련 법령에 따라 보존이 필요한 경우 해당 법령에서 정한 기간까지 보유합니다.
            </dd>
            <dt>제공 방법</dt>
            <dd>정보통신망을 통한 전송</dd>
            <dt>동의 거부 권리 및 거부 시 불이익</dt>
            <dd>
              귀하는 위 제3자 제공에 대한 동의를 거부할 수 있습니다.
              다만 본 동의는 네이버 플레이스+ 연동에 필수이므로,
              동의하지 않으실 경우 해당 연동 서비스를 이용하실 수 없습니다.
            </dd>
          </dl>
          <p class="notice-refuse">
            동의한 이후에도 연동을 해지하면 제공 목적이 종료되며, 이후 네이버 플레이스+에서 요구하는
            약관 및 정보 제공 동의는 다음 화면에서 별도로 진행됩니다.
          </p>
        </div>

        <label class="agree">
          <input type="checkbox" id="agreeCheckbox" />
          위 개인(신용)정보 제3자 제공에 동의합니다. (필수)
        </label>

        <div class="btn-row">
          <a class="btn btn-ghost" href="${cancelUrl}">취소</a>
          <button class="btn btn-primary is-disabled" id="agreeBtn" disabled type="button">동의하고 시작</button>
        </div>
      `,
      extraScript: `
        <script>
          const checkbox = document.getElementById("agreeCheckbox");
          const button = document.getElementById("agreeBtn");
          const startUrl = ${JSON.stringify(agreeUrl)};
          checkbox.addEventListener("change", () => {
            button.disabled = !checkbox.checked;
            button.classList.toggle("is-disabled", !checkbox.checked);
          });
          button.addEventListener("click", () => {
            if (!button.disabled) location.href = startUrl;
          });
        </script>
      `,
    })
  );
}

module.exports = router;
