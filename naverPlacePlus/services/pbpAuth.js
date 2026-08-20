/**
 * PBP Auth API — Partner server access token 발급
 *
 * "250915_POS 기기 인증 API 가이드_V1.2.pdf" 기준. 지금까지 쓰던 agency_refresh_token
 * 인증(services/naverAuth.js)과는 완전히 별개의, 더 최신 인증 서버입니다.
 *
 * 매출(Bill) API / POS 운영시간 전달 API 등 "POS -> 네이버" 방향으로 데이터를 보내는
 * PBP POS API를 호출할 때 필요합니다. 우리처럼 개별 POS 기기가 아니라 중앙 서버에서
 * 일괄 전송하는 구조라면, 아래 "파트너 서버 액세스 토큰 발급 API" 하나만 있으면 됩니다
 * (POS 기기별 인가는 사용하지 않음).
 *
 * ⚠ 아직 PARTNER_SERVER_CLIENT_ID / PARTNER_SERVER_CLIENT_SECRET을 발급받지 못해서,
 * 이 서비스는 현재 어떤 라우트에서도 호출하지 않는 "뼈대"입니다. 자격증명을 받으면
 * .env에 값을 채우고 매출/운영시간 전달 라우트를 새로 만들 때 사용하면 됩니다.
 *
 * ⚠ PARTNER_SERVER_CLIENT_SECRET과 아래에서 발급받는 액세스 토큰은 절대 프론트엔드나
 * POS 기기로 전달하면 안 됩니다. 오직 이 서버(백엔드)에서만 사용하세요.
 */

const axios = require("axios");

const PBP_AUTH_HOST =
  process.env.PLACE_API_ENV === "production"
    ? process.env.PBP_AUTH_API_HOST_PROD
    : process.env.PBP_AUTH_API_HOST_TEST;

/**
 * 파트너 서버 액세스 토큰을 발급합니다 (client_credentials grant, Basic 인증).
 * 기본 만료 시간은 10분이며, 매번 새로 받지 말고 만료 1~5분 전에 갱신하는 것을
 * 권장한다고 가이드에 명시되어 있습니다.
 *
 * @returns {Promise<{accessToken: string, expiresInSeconds: number}>}
 */
async function issuePartnerServerAccessToken() {
  const clientId = process.env.PARTNER_SERVER_CLIENT_ID;
  const clientSecret = process.env.PARTNER_SERVER_CLIENT_SECRET;

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64url"
  );

  const { data } = await axios.post(
    `${PBP_AUTH_HOST}/oauth2/v3/token`,
    new URLSearchParams({
      grant_type: "client_credentials",
      scope: "stakeholder:agency",
    }),
    {
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return {
    accessToken: data.access_token,
    expiresInSeconds: data.expires_in,
  };
}

module.exports = { issuePartnerServerAccessToken };
