/**
 * "네이버 아이디로 로그인"
 *
 * 가이드 슬라이드 16 "네이버 아이디 로그인을 사용하는 이유"에 나온 대로,
 * 이건 스마트플레이스 약관동의 페이지(/embed/terms) 안에서 뜨는 로그인과는
 * 별개로, 우리 서버가 "이 사용자가 누구인지(naverUniqueId)"를 알아내기 위해
 * 직접 붙이는 OAuth 로그인입니다. 이후 모든 플레이스 API 호출의
 * X-Naver-Unique-Id 헤더 값이 여기서 나옵니다.
 *
 * 흐름:
 *   1. GET /naver/login/start   → 네이버 로그인 인가 페이지로 리다이렉트
 *   2. (사용자가 네이버 계정으로 로그인/동의)
 *   3. GET /naver/login/callback → code를 Access Token으로 교환 → 프로필 조회
 *      → naverUniqueId 확보 → /naver/places
 *      (이미 동의한 계정을 embed/terms 로 보내면 네이버가 to 콜백을
 *       호출하지 않아 목록까지 가지 못한다)
 */

const express = require("express");
const router = express.Router();

const {
  buildAuthorizeUrl,
  exchangeCodeForToken,
  getProfile,
} = require("../services/naverIdLogin");
const { getAccessToken } = require("../services/naverAuth");
const {
  getAgreementSummary,
  hasAllRequiredAgreements,
} = require("../services/placeApi");
const { getBaseUrl } = require("../services/baseUrl");
const { renderLayout, escapeHtml } = require("../ui/layout");

function getRedirectUri() {
  // 네이버 개발자센터에 등록한 Callback URL 과 글자 하나까지 같아야 합니다.
  // Host 헤더(localhost vs localhost:80)를 쓰면 등록값과 어긋나 로그인 설정 오류가 납니다.
  const registered = process.env.NAVER_REDIRECT_URI;
  if (registered) return registered;
  return new URL(
    "/naver/login/callback",
    String(process.env.BASE_URL || "http://localhost").replace(/\/$/, "")
  ).toString();
}

function handleNaverLogout(req, res) {
  res.set("Cache-Control", "no-store");
  res.redirect("/naver/start");
}

router.get("/logout", handleNaverLogout);

/**
 * STEP 1. 네이버 로그인 시작
 * GET /naver/login/start?storeId=xxx
 */
router.get("/start", (req, res) => {
  const storeId = req.query.storeId || "demo-store-1";

  // 데모 간소화: state에 storeId를 그대로 실어 보냅니다.
  // 실서비스에서는 CSRF 방지를 위해 예측 불가능한 난수를 세션/쿠키에 저장해두고
  // 콜백에서 그 값과 일치하는지 반드시 검증해야 합니다.
  const state = storeId;

  const authorizeUrl = buildAuthorizeUrl({
    redirectUri: getRedirectUri(),
    state,
  });

  res.redirect(authorizeUrl);
});

/**
 * STEP 2. 네이버 로그인 콜백
 * GET /naver/login/callback?code=xxx&state=xxx
 */
router.get("/callback", async (req, res) => {
  const { code, state, error, error_description: errorDescription } = req.query;
  const storeId = state || "demo-store-1";

  if (error) {
    console.error("[naver/login/callback] 로그인 거부/오류:", error, errorDescription);
    return res.status(400).send(
      renderLayout({
        title: "로그인 취소",
        heading: "네이버 로그인이 취소되었습니다",
        body: `
          <p class="msg">${escapeHtml(errorDescription || error)}</p>
          <div class="actions-after"><a class="btn btn-primary" href="/naver/start">처음으로</a></div>
        `,
      })
    );
  }

  try {
    const loginAccessToken = await exchangeCodeForToken({ code, state });
    const profile = await getProfile(loginAccessToken);
    const naverUniqueId = profile.id;

    let nextPath = "/naver/terms/start";
    try {
      const placeAccessToken = await getAccessToken(
        storeId,
        process.env.DEMO_REFRESH_TOKEN
      );
      const summary = await getAgreementSummary({
        accessToken: placeAccessToken,
        naverUniqueId,
      });
      if (hasAllRequiredAgreements(summary)) {
        nextPath = "/naver/places";
      }
    } catch (checkErr) {
      console.error(
        "[naver/login/callback] 동의여부 조회 실패, 약관 페이지로 진행:",
        checkErr.response?.data || checkErr.message
      );
    }

    const nextUrl = new URL(nextPath, getBaseUrl(req));
    nextUrl.searchParams.set("storeId", storeId);
    nextUrl.searchParams.set("naverUniqueId", naverUniqueId);
    return res.redirect(nextUrl.toString());
  } catch (err) {
    console.error("[naver/login/callback] 로그인 처리 실패:", err.response?.data || err.message);
    return res.status(502).send(
      renderLayout({
        title: "로그인 실패",
        heading: "네이버 로그인 처리 중 오류가 발생했습니다",
        body: `
          <p class="msg">잠시 후 다시 시도해주세요.</p>
          <div class="actions-after"><a class="btn btn-primary" href="/naver/start">처음으로</a></div>
        `,
      })
    );
  }
});

module.exports = router;
module.exports.handleNaverLogout = handleNaverLogout;
