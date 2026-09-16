/**
 * 콜백 URL의 origin.
 * npm run serve(80) / naver:dev(3000) / 운영(443) 어디서 열었든
 * 실제 요청 호스트에 맞춥니다. 없으면 BASE_URL 을 씁니다.
 */
function getBaseUrl(req) {
  const host = req?.get?.("host");
  if (host) {
    const proto = req.protocol || "http";
    return `${proto}://${host}`;
  }
  return String(process.env.BASE_URL || "http://localhost").replace(/\/$/, "");
}

/** 네이버 로그아웃 후 돌아올 연동 첫 화면 */
function getNaverStartUrl(req) {
  const fromEnv = String(process.env.BASE_URL || "").replace(/\/$/, "");
  const origin = fromEnv || getBaseUrl(req);
  return `${origin}/naver/start`;
}

/** 네이버 세션을 끊고 start 로 돌아오는 로그아웃 URL */
function buildNaverLogoutUrl(req) {
  const startUrl = getNaverStartUrl(req);
  const url = new URL("https://nid.naver.com/nidlogin.logout");
  url.searchParams.set("returl", startUrl);
  url.searchParams.set("url", startUrl);
  return url.toString();
}

module.exports = { getBaseUrl, getNaverStartUrl, buildNaverLogoutUrl };
