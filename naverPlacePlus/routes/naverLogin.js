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
 *      → naverUniqueId 확보 → 동의여부 조회
 *      → 이미 필수 약관 동의면 /naver/places, 아니면 약관동의 페이지
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
    return res
      .status(400)
      .send(`네이버 로그인이 취소되었거나 실패했습니다. (${escapeText(errorDescription || error)})`);
  }

  try {
    const loginAccessToken = await exchangeCodeForToken({ code, state });
    const profile = await getProfile(loginAccessToken);
    const naverUniqueId = profile.id;

    // 필수 약관이 없으면 약관 페이지로, 이미 다 있으면 업체 목록으로 간다.
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
      const allAgreed = hasAllRequiredAgreements(summary);
      console.log(
        "[naver/login/callback] 동의여부:",
        allAgreed,
        summary.agreedPlacePrivacyAgreementTypes
      );
      if (allAgreed) {
        nextPath = "/naver/places";
      }
    } catch (checkErr) {
      const detail = checkErr.response?.data || checkErr.message;
      console.error("[naver/login/callback] 동의여부 조회 실패:", detail);
      return res.status(502).send(
        `로그인 후 플레이스 API 호출에 실패했습니다.<br/>` +
          `${escapeText(typeof detail === "string" ? detail : JSON.stringify(detail))}<br/><br/>` +
          `test-api.pbp.naver.com 을 못 찾으면 VPN을 확인하세요.`
      );
    }

    const nextUrl = new URL(nextPath, getBaseUrl(req));
    nextUrl.searchParams.set("storeId", storeId);
    nextUrl.searchParams.set("naverUniqueId", naverUniqueId);
    return res.redirect(nextUrl.toString());
  } catch (err) {
    console.error("[naver/login/callback] 로그인 처리 실패:", err.response?.data || err.message);
    return res
      .status(502)
      .send("네이버 로그인 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
  }
});

function escapeText(value) {
  return String(value ?? "").replace(/[<>&]/g, "");
}

module.exports = router;
