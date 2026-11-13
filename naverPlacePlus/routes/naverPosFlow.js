/**
 * POS 연동 전용 화면 (naverOnboarding 라우터 안에 붙어 /naver/start/* 로 열린다)
 *
 *   GET  /naver/start/status   P2 상태 확인 — 우리 DB 기록 표시 → 네이버 실제 상태 확인 → 할 수 있는 동작만 버튼으로
 *   GET  /naver/start/leave    P9 해지 확인
 *   POST /naver/start/leave    P9 → 해지 실행 → P10 해지 완료
 *   GET  /naver/start/notice   P11 안내·오류 (?c=결과코드)
 *
 * POS 진입(P1, /naver/start?t=요청ID) 은 naverOnboarding.js 에서 처리한다.
 * 닫기는 항상 POS 버튼이다. 끝나는 화면에는 "POS의 [닫기]를 눌러 주세요" 를 둔다.
 */

const express = require("express");
const router = express.Router();

const { renderLayout, escapeHtml } = require("../ui/layout");
const { getAccessToken } = require("../services/naverAuth");
const { listConnectedBusinesses, deleteAgencyMapping } = require("../services/placeApi");
const { getPosSession, hasStalePosCookie, endPosSession } = require("../services/posSession");
const { saveStep } = require("../services/pncApi");

const CLOSE_HINT = "POS의 [닫기]를 눌러 주세요.";
const NOT_WANT_HINT = "원하지 않으면 POS의 [닫기]를 누르세요.";

// P11 안내 문구 (pncWebService RES_CD 기준)
const NOTICE = {
  "1005": ["요청 정보를 확인할 수 없습니다", "POS에서 [네이버 플레이스 연동]을 다시 눌러 주세요."],
  "1006": ["이미 사용된 연동 주소입니다", "POS에서 [네이버 플레이스 연동]을 다시 눌러 주세요."],
  "1007": ["처리 단계 값이 올바르지 않습니다", "POS에서 처음부터 다시 시작해 주세요."],
  "3000": ["진행이 중단된 요청입니다", "다시 하려면 POS에서 처음부터 시작해 주세요."],
  "3001": ["시간이 초과되었습니다", "POS에서 처음부터 다시 시작해 주세요."],
  "3002": ["다른 곳에서 새로 시작된 요청이 있습니다", "이 화면의 요청은 종료되었습니다."],
  "4001": ["연동하지 못했습니다", "선택한 업체의 주인권한이 없습니다. 네이버 스마트플레이스에서 주인권한을 확인해 주세요."],
  "4002": ["연동하지 못했습니다", "선택한 업체를 찾을 수 없습니다. POS에서 다시 시작해 주세요."],
  "4003": ["연동 해지에 실패했습니다", "잠시 후 POS에서 다시 시도해 주세요."],
  "4004": ["네이버 로그인이 완료되지 않았습니다", "POS에서 다시 시작해 주세요."],
  "4009": ["처리 중 오류가 발생했습니다", "잠시 후 POS에서 다시 시도해 주세요."],
};

function noticeUrl(code) {
  return `/naver/start/notice?c=${encodeURIComponent(code || "4009")}`;
}

/** 안내 화면으로 보낸다. 요청이 끝난 코드면 세션도 정리한다. */
function toNotice(req, res, code) {
  if (/^(1005|1006|3\d{3})$/.test(String(code))) endPosSession(req, res);
  return res.redirect(noticeUrl(code));
}

function closeHintHtml(text = CLOSE_HINT) {
  return `<p class="muted" style="margin-top:14px">${escapeHtml(text)}</p>`;
}

function dbRecordHtml(pos) {
  let text = "연동 기록이 없습니다.";
  if (pos.dbLinkYn === "Y") {
    text = `연동됨 — ${pos.dbPlaceName || "-"}${pos.dbLinkDt ? ` (연동일 ${pos.dbLinkDt.slice(0, 10)})` : ""}`;
  } else if (pos.dbLinkYn === "N") {
    text = `연동 안 됨(해지)${pos.dbUnlinkDt ? ` — 해지일 ${pos.dbUnlinkDt.slice(0, 10)}` : ""}`;
  }
  return `<div class="lookup-bar" style="margin-top:0;margin-bottom:12px">
    <strong>우리 쪽 기록</strong> · ${escapeHtml(text)}
  </div>`;
}

/** 네이버 실제 상태를 확인하고 결과를 세션·DB 에 저장 */
async function checkActualState(pos, storeId) {
  const uid = pos.loginUniqueId || pos.dbUniqueId;
  if (!uid) return null;

  try {
    const accessToken = await getAccessToken(storeId, process.env.DEMO_REFRESH_TOKEN);
    const connected = await listConnectedBusinesses({ accessToken, naverUniqueId: uid });
    const biz =
      connected.find((b) => String(b.placeId) === String(pos.dbPlaceId)) || connected[0] || null;
    const linkYn = connected.length ? "Y" : "N";
    const placeName = biz ? biz.businessName || biz.name || "" : "";

    const saved = await saveStep(pos.reqId, "CHECKED", {
      linkYn,
      naverUniqueId: uid,
      placeId: biz ? biz.placeId : "",
      placeName,
    });
    if (!saved.ok) return { blocked: saved.resCd };

    pos.check = {
      linkYn,
      uid,
      placeId: biz ? String(biz.placeId) : "",
      placeName,
      count: connected.length,
      synced: saved.syncYn === "Y",
    };
    return pos.check;
  } catch (err) {
    console.error("[naver/start/status] 실제 상태 확인 실패:", err.response?.data || err.message);
    try {
      const saved = await saveStep(pos.reqId, "CHECKFAIL", { errMsg: err.message });
      if (!saved.ok) return { blocked: saved.resCd };
    } catch (saveErr) {
      console.error("[naver/start/status] CHECKFAIL 저장 실패:", saveErr.message);
    }
    pos.check = { failed: true };
    return pos.check;
  }
}

/* ------------------------------------------------------------------ P2 상태 확인 */
router.get("/status", async (req, res) => {
  res.set("Cache-Control", "no-store");
  const pos = getPosSession(req);
  if (!pos) return toNotice(req, res, hasStalePosCookie(req) ? "3001" : "1005");

  const storeId = `${pos.storeGroup}-${pos.storeCode}`;
  const hasUid = !!(pos.loginUniqueId || pos.dbUniqueId);

  if (hasUid && (!pos.check || pos.check.failed)) {
    const result = await checkActualState(pos, storeId);
    if (result && result.blocked) return toNotice(req, res, result.blocked);
  }

  const joinUrl = "/naver/start?consent=1";
  let heading;
  let message;
  let buttons;

  if (!hasUid) {
    // C: 우리 쪽에 네이버 계정 기록이 없음 → 가입 절차로 진행
    heading = "네이버 플레이스 연동";
    message = "연동 기록이 없습니다. 연동을 진행합니다. 네이버 로그인 후 이미 연동되어 있으면 연동 정보만 가져옵니다.";
    buttons = `<a class="btn btn-accent" href="${joinUrl}">연동하기</a>`;
  } else if (pos.check && pos.check.failed) {
    // E: 확인 실패
    heading = "실제 상태를 확인하지 못했습니다";
    message = "네이버에서 연동 상태를 확인하지 못했습니다. 네이버 로그인으로 다시 확인해 주세요.";
    buttons = `<a class="btn btn-accent" href="${joinUrl}">네이버 로그인으로 확인</a>`;
  } else if (pos.check.linkYn === "Y") {
    const name = escapeHtml(pos.check.placeName || "-");
    if (pos.dbLinkYn === "Y" && !pos.check.synced) {
      heading = "정상 가입 상태입니다"; // A1
      message = `${name} 업체와 연동되어 있습니다. 해지할 수 있습니다.`;
    } else {
      heading = "이미 가입된 상태입니다"; // B2 / C1
      message = `${name} 업체와 연동되어 있습니다. (전화·메일 등으로 가입된 것으로 보입니다. 연동 정보를 갱신했습니다.) 해지할 수 있습니다.`;
    }
    if (pos.check.count > 1) {
      message += ` 이 네이버 계정에 연동된 업체가 ${pos.check.count}개 있습니다.`;
    }
    buttons = `<a class="btn btn-muted" href="/naver/start/leave">연동 해지</a>`;
  } else {
    if (pos.dbLinkYn === "Y") {
      heading = "해지된 상태입니다"; // A2
      message = "네이버에서 연동이 해지되어 있습니다. (전화·메일 등으로 해지된 것으로 보입니다. 연동 정보를 갱신했습니다.) 다시 연동할 수 있습니다.";
      buttons = `<a class="btn btn-accent" href="${joinUrl}">다시 연동하기</a>`;
    } else if (pos.dbLinkYn === "N") {
      heading = "해지된 상태입니다"; // B1
      message = "다시 연동할 수 있습니다.";
      buttons = `<a class="btn btn-accent" href="${joinUrl}">다시 연동하기</a>`;
    } else {
      heading = "가입되어 있지 않습니다"; // C2
      message = "연동할 수 있습니다.";
      buttons = `<a class="btn btn-accent" href="${joinUrl}">연동하기</a>`;
    }
  }

  return res.send(
    renderLayout({
      title: "연동 상태 확인",
      heading,
      subtitle: pos.storeName ? `${pos.storeName} 매장` : "",
      wide: true,
      body: `
        ${dbRecordHtml(pos)}
        <p class="msg">${message}</p>
        <div class="btn-row status-actions">${buttons}</div>
        ${closeHintHtml(NOT_WANT_HINT)}
      `,
    })
  );
});

/* ------------------------------------------------------------------ P9 해지 확인 */
router.get("/leave", (req, res) => {
  res.set("Cache-Control", "no-store");
  const pos = getPosSession(req);
  if (!pos) return toNotice(req, res, hasStalePosCookie(req) ? "3001" : "1005");
  if (!pos.check || pos.check.linkYn !== "Y") return res.redirect("/naver/start/status");

  return res.send(
    renderLayout({
      title: "연동 해지",
      heading: "네이버 플레이스 연동을 해지하시겠습니까?",
      subtitle: pos.storeName ? `${pos.storeName} 매장` : "",
      wide: true,
      body: `
        <div class="status-fields" style="margin-bottom:14px">
          <div class="status-field"><span>업체명</span><strong>${escapeHtml(pos.check.placeName || "-")}</strong></div>
          <div class="status-field"><span>플레이스 ID</span><strong>${escapeHtml(pos.check.placeId || "-")}</strong></div>
        </div>
        <div class="btn-row status-actions">
          <form method="post" action="/naver/start/leave" data-np-confirm>
            <button class="btn btn-muted" type="submit">해지</button>
          </form>
          <a class="btn btn-ghost" href="/naver/start/status">취소</a>
        </div>
        ${closeHintHtml(NOT_WANT_HINT)}
      `,
    })
  );
});

/* ------------------------------------------------------------------ P9 → P10 해지 실행 */
router.post("/leave", async (req, res) => {
  const pos = getPosSession(req);
  if (!pos) return toNotice(req, res, hasStalePosCookie(req) ? "3001" : "1005");
  if (!pos.check || pos.check.linkYn !== "Y" || !pos.check.placeId) return res.redirect("/naver/start/status");

  const storeId = `${pos.storeGroup}-${pos.storeCode}`;
  const { uid, placeId, placeName } = pos.check;

  try {
    const accessToken = await getAccessToken(storeId, process.env.DEMO_REFRESH_TOKEN);
    try {
      await deleteAgencyMapping({ accessToken, naverUniqueId: uid, placeId });
    } catch (delErr) {
      // 409 = 이미 해지됨 → 해지 완료로 처리
      if (delErr.response?.status !== 409) throw delErr;
    }
  } catch (err) {
    console.error("[naver/start/leave] 해지 실패:", err.response?.status, err.response?.data?.errorCode || err.message);
    try {
      const saved = await saveStep(pos.reqId, "FAIL", { resCd: "4003", errMsg: err.message });
      if (!saved.ok) return toNotice(req, res, saved.resCd);
    } catch (saveErr) {
      console.error("[naver/start/leave] FAIL 저장 실패:", saveErr.message);
    }
    return res.redirect(noticeUrl("4003"));
  }

  let saved;
  try {
    saved = await saveStep(pos.reqId, "UNLINKED");
  } catch (saveErr) {
    console.error("[naver/start/leave] UNLINKED 저장 실패:", saveErr.message);
  }
  pos.check = { ...pos.check, linkYn: "N" };
  pos.dbLinkYn = "N";

  const savedNote =
    saved && !saved.ok
      ? `<p class="msg-detail">이 요청은 이미 종료되어 POS 결과에는 반영되지 않습니다. POS에서 다시 시작하면 최신 상태로 맞춰집니다.</p>`
      : "";

  return res.send(
    renderLayout({
      title: "연동 해지 완료",
      heading: "연동이 해지되었습니다",
      wide: true,
      body: `
        <p class="msg">${escapeHtml(placeName || placeId)} 업체와의 네이버 플레이스 연동이 해지되었습니다.</p>
        ${savedNote}
        ${closeHintHtml()}
      `,
    })
  );
});

/* ------------------------------------------------------------------ P11 안내·오류 */
router.get("/notice", (req, res) => {
  res.set("Cache-Control", "no-store");
  const code = String(req.query.c || "4009");
  const [heading, detail] = NOTICE[code] || NOTICE["4009"];
  return res.send(
    renderLayout({
      title: "안내",
      heading,
      wide: true,
      body: `
        <p class="msg">${escapeHtml(detail)}</p>
        ${closeHintHtml()}
      `,
    })
  );
});

module.exports = router;
module.exports.noticeUrl = noticeUrl;
module.exports.toNotice = toNotice;
module.exports.closeHintHtml = closeHintHtml;
