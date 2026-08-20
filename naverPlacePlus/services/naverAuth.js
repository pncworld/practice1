/**
 * 플레이스 연동 API 인증 서비스
 *
 * 스펙 (가이드 슬라이드 15 "[공통] 연동 API 필수정보" 기준):
 * - Access Token은 Refresh Token으로 인증 API를 호출해 획득
 * - Refresh Token은 매장(가맹점)별로 별도 발급/전달됨
 * - Access Token 유효시간은 1분으로 매우 짧으므로, "모든 API 호출 시 매번 새로
 *   발급받아야 합니다" — 가이드에 명시된 문구 그대로, 캐싱/재사용하지 않습니다.
 *
 * AUTH API URL:
 *   POST {AUTH_HOST}/auth/v1/token?grant_type=agency_refresh_token&refresh_token={REFRESH_TOKEN}
 *
 * (가이드 슬라이드 15 curl 예제 기준 — HTTP Method는 POST이며, 바디 없이
 *  쿼리스트링으로 파라미터를 전달합니다.)
 */

const axios = require("axios");

const AUTH_HOST =
  process.env.PLACE_API_ENV === "production"
    ? process.env.AUTH_API_HOST_PROD
    : process.env.AUTH_API_HOST_TEST;

/**
 * Refresh Token으로 Access Token을 발급받습니다.
 * @param {string} refreshToken
 * @returns {Promise<string>} accessToken
 */
async function issueAccessToken(refreshToken) {
  const url = `${AUTH_HOST}/auth/v1/token`;

  const { data } = await axios.post(url, null, {
    params: {
      grant_type: "agency_refresh_token",
      refresh_token: refreshToken,
    },
  });

  // 가이드 Response Body 예시: { "token": "eyJ..." }
  if (!data || !data.token) {
    throw new Error("네이버 인증 API 응답에 token 필드가 없습니다.");
  }

  return data.token;
}

/**
 * storeId 기준으로 Access Token을 가져옵니다.
 *
 * 가이드 슬라이드 15: "Access Token은 유효시간(1분)이 짧으므로, 모든 API 호출 시
 * 매번 새로 발급 받아야 합니다." — 이 문구를 그대로 따라, 호출할 때마다 캐시 없이
 * 매번 새로 발급받습니다. (storeId 파라미터는 향후 매장별 refreshToken을 DB에서
 * 조회하는 지점을 명확히 하기 위해 남겨둡니다.)
 *
 * @param {string} storeId 우리 서비스 내부의 매장 식별자
 * @param {string} refreshToken 해당 매장의 Refresh Token (DB에서 조회해서 넘겨줘야 함)
 */
async function getAccessToken(storeId, refreshToken) {
  return issueAccessToken(refreshToken);
}

module.exports = {
  issueAccessToken,
  getAccessToken,
};
