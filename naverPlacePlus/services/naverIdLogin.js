/**
 * 네이버 아이디 로그인(네아로) 클라이언트
 *
 * 가이드 슬라이드 16, 18 기준:
 * - 이건 스마트플레이스 API용 Access Token(services/naverAuth.js, agency_refresh_token)과
 *   완전히 다른 시스템입니다. 여기서 발급받는 access_token은 "네이버 로그인 프로필 조회"용이고,
 *   우리가 최종적으로 필요한 건 그 프로필 응답의 `response.id` 값 (= naverUniqueId,
 *   네아로 유니크 아이디)입니다.
 * - naverUniqueId를 확보해야 이후 플레이스 API 호출 시 X-Naver-Unique-Id 헤더에 넣을 수 있습니다.
 *
 * 참고 문서: https://developers.naver.com/docs/login/api/api.md
 */

const axios = require("axios");

const AUTHORIZE_URL = "https://nid.naver.com/oauth2.0/authorize";
const TOKEN_URL = "https://nid.naver.com/oauth2.0/token";
const PROFILE_URL = "https://openapi.naver.com/v1/nid/me";

function buildAuthorizeUrl({ redirectUri, state }) {
  const url = new URL(AUTHORIZE_URL);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", process.env.NAVER_CLIENT_ID);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("state", state);
  return url.toString();
}

/**
 * 인가 코드(code)를 Access Token으로 교환합니다.
 */
async function exchangeCodeForToken({ code, state }) {
  const { data } = await axios.get(TOKEN_URL, {
    params: {
      grant_type: "authorization_code",
      client_id: process.env.NAVER_CLIENT_ID,
      client_secret: process.env.NAVER_CLIENT_SECRET,
      code,
      state,
    },
  });

  if (!data || !data.access_token) {
    throw new Error(
      `네이버 로그인 토큰 발급 실패: ${JSON.stringify(data)}`
    );
  }

  return data.access_token;
}

/**
 * 로그인 프로필을 조회합니다. response.id 가 naverUniqueId 입니다.
 */
async function getProfile(accessToken) {
  const { data } = await axios.get(PROFILE_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!data || data.resultcode !== "00" || !data.response?.id) {
    throw new Error(
      `네이버 프로필 조회 실패: ${JSON.stringify(data)}`
    );
  }

  return data.response; // { id, ... } — id가 naverUniqueId
}

module.exports = { buildAuthorizeUrl, exchangeCodeForToken, getProfile };
