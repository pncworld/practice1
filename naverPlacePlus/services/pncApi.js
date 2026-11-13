/**
 * pncWebService(PncNaverPlaceService.asmx) 호출
 *
 *   openNaverLinkReq  : 연결 링크의 요청 ID 확인 (1회 사용) → 매장·우리 DB 연동 기록
 *   saveNaverLinkStep : 진행 단계 저장 (CONSENT / LOGIN / CHECKED / CHECKFAIL / NOBIZ / LINKED / UNLINKED / FAIL)
 *
 * 주소: .env PNC_WS_URL (예: https://{pncWebService 서버})
 * 응답: { RESULT_CD, RESULT_MSG, OK_YN, RES_CD, ... }
 */

const axios = require("axios");

function wsUrl(method) {
  const base = String(process.env.PNC_WS_URL || "").replace(/\/$/, "");
  if (!base) throw new Error("PNC_WS_URL 이 .env 에 없습니다.");
  return `${base}/PncNaverPlaceService.asmx/${method}`;
}

async function callWs(method, fields) {
  const body = new URLSearchParams();
  for (const [k, v] of Object.entries(fields)) body.append(k, v == null ? "" : String(v));
  const { data } = await axios.post(wsUrl(method), body.toString(), {
    headers: { "Content-Type": "application/x-www-form-urlencoded; charset=utf-8" },
    timeout: 10000,
  });
  const json = typeof data === "string" ? JSON.parse(data) : data;
  if (!json || json.RESULT_CD !== "00") {
    throw new Error(`[pncWebService ${method}] ${json ? json.RESULT_CD + " " + json.RESULT_MSG : "응답 없음"}`);
  }
  return json;
}

/** 요청 ID 확인. 반환 json.OK_YN === "Y" 이면 진행 */
async function openLinkReq(reqId) {
  return callWs("openNaverLinkReq", { strReqId: reqId });
}

/**
 * 진행 단계 저장.
 * @returns {{ ok: boolean, resCd: string, syncYn: string }}
 *   ok = false 이면 요청이 닫혔거나 중단·시간 초과 → 안내 화면(P11)으로
 */
async function saveStep(reqId, step, extra = {}) {
  const json = await callWs("saveNaverLinkStep", {
    strReqId: reqId,
    strStep: step,
    strLinkYn: extra.linkYn || "",
    strNaverUniqueId: extra.naverUniqueId || "",
    strPlaceId: extra.placeId || "",
    strPlaceName: extra.placeName || "",
    strResCd: extra.resCd || "",
    strErrMsg: extra.errMsg ? String(extra.errMsg).slice(0, 500) : "",
  });
  return { ok: json.OK_YN === "Y", resCd: json.RES_CD || "", syncYn: json.SYNC_YN || "" };
}

module.exports = { openLinkReq, saveStep };
