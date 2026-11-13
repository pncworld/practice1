/**
 * POS 연동 세션 (서버 메모리 보관)
 *
 * POS 가 연결 링크(/naver/start?t={요청 ID})로 화면을 열면 세션을 만든다.
 * 브라우저 쿠키에는 무작위 세션 번호(np_pos)만 두고,
 * 요청 ID·매장·네이버 Unique ID 는 서버 메모리에만 보관한다.
 *
 * - 유효 시간: 60분 (pncWebService 진행 세션과 같음)
 * - 서버를 다시 시작하면 진행 중인 세션은 사라진다 → 안내 화면에서 POS [닫기] 후 다시 시작
 * - 세션이 없으면(데모·QA 접속) 기존 화면 흐름을 그대로 쓴다.
 *   운영에서 POS 접속만 허용하려면 .env 에 NAVER_POS_LINK_ONLY=1
 */

const crypto = require("crypto");

const POS_COOKIE = "np_pos";
const SESSION_MS = 60 * 60 * 1000;
const sessions = new Map();

function readCookie(req, name) {
  const raw = req?.headers?.cookie || "";
  for (const part of raw.split(";")) {
    const trimmed = part.trim();
    const eq = trimmed.indexOf("=");
    if (eq <= 0 || trimmed.slice(0, eq) !== name) continue;
    return trimmed.slice(eq + 1);
  }
  return "";
}

function cookieHeader(value, maxAgeSec) {
  return [`${POS_COOKIE}=${value}`, "Path=/", "HttpOnly", "SameSite=Lax", `Max-Age=${maxAgeSec}`].join("; ");
}

function sweep() {
  const now = Date.now();
  for (const [sid, s] of sessions) {
    if (now - s.createdAt > SESSION_MS) sessions.delete(sid);
  }
}

/** 새 POS 세션 생성 후 쿠키 설정 */
function createPosSession(res, data) {
  sweep();
  const sid = crypto.randomBytes(24).toString("hex");
  const session = { ...data, createdAt: Date.now() };
  sessions.set(sid, session);
  res.append("Set-Cookie", cookieHeader(sid, Math.floor(SESSION_MS / 1000)));
  return session;
}

/** 현재 요청의 POS 세션 (없거나 만료면 null) */
function getPosSession(req) {
  const sid = readCookie(req, POS_COOKIE);
  if (!sid) return null;
  const session = sessions.get(sid);
  if (!session) return null;
  if (Date.now() - session.createdAt > SESSION_MS) {
    sessions.delete(sid);
    return null;
  }
  return session;
}

/** 쿠키는 있는데 세션이 사라진 경우 (만료·서버 재시작) */
function hasStalePosCookie(req) {
  return !!readCookie(req, POS_COOKIE) && !getPosSession(req);
}

function endPosSession(req, res) {
  const sid = readCookie(req, POS_COOKIE);
  if (sid) sessions.delete(sid);
  if (res) res.append("Set-Cookie", cookieHeader("", 0));
}

function isPosOnlyMode() {
  return process.env.NAVER_POS_LINK_ONLY === "1";
}

/** 네이버 로그인 state 용 무작위 값 */
function newState() {
  return crypto.randomBytes(16).toString("hex");
}

module.exports = {
  createPosSession,
  getPosSession,
  hasStalePosCookie,
  endPosSession,
  isPosOnlyMode,
  newState,
};
