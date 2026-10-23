/**
 * 브라우저에 남겨 두는 네이버 연동 사용자.
 * POS가 웹브라우저를 다시 열었을 때, 이전에 로그인했던 네이버 계정을 알아보는 용도입니다.
 * Refresh Token은 넣지 않습니다.
 */

const STORE_COOKIE = "np_store";
const NID_COOKIE = "np_nid";
const CONSENT_COOKIE = "np_agreed";
const MONTH_SECONDS = 60 * 60 * 24 * 30;

function readCookie(req, name) {
  const raw = req?.headers?.cookie || "";
  for (const part of raw.split(";")) {
    const trimmed = part.trim();
    const eq = trimmed.indexOf("=");
    if (eq <= 0 || trimmed.slice(0, eq) !== name) continue;
    const value = trimmed.slice(eq + 1);
    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  }
  return "";
}

function cookieHeader(name, value, maxAge = MONTH_SECONDS) {
  return [
    `${name}=${encodeURIComponent(value)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAge}`,
  ].join("; ");
}

function rememberNaverUser(res, storeId, naverUniqueId) {
  if (!res || !storeId || !naverUniqueId || naverUniqueId === "DEMO_NAVER_UNIQUE_ID") {
    return;
  }
  res.append("Set-Cookie", cookieHeader(STORE_COOKIE, String(storeId)));
  res.append("Set-Cookie", cookieHeader(NID_COOKIE, String(naverUniqueId)));
}

function clearNaverUser(res) {
  res.append("Set-Cookie", cookieHeader(STORE_COOKIE, "", 0));
  res.append("Set-Cookie", cookieHeader(NID_COOKIE, "", 0));
  res.append("Set-Cookie", cookieHeader(CONSENT_COOKIE, "", 0));
}

function markConsent(res) {
  res.append("Set-Cookie", cookieHeader(CONSENT_COOKIE, "1"));
}

function hasConsent(req) {
  return readCookie(req, CONSENT_COOKIE) === "1";
}

function readNaverSession(req) {
  return {
    storeId: readCookie(req, STORE_COOKIE),
    naverUniqueId: readCookie(req, NID_COOKIE),
  };
}

module.exports = {
  rememberNaverUser,
  clearNaverUser,
  readNaverSession,
  markConsent,
  hasConsent,
};
