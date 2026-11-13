/**
 * "연동하기" 단계 — 업체 목록 조회 & 연동 추가
 *
 * 아임유 가이드(PDF) 기준 "④ 연동하기" 화면, 우리 가이드 슬라이드 23~25 기준:
 *
 *   1. 네아로 정보(Access Token + X-Naver-Unique-Id 등)로 로그인 계정이
 *      주인권한을 가진 업체 목록을 조회한다. (GET /v1/custom/pos/place-businesses)
 *      최대 10개씩 페이징된다 (X-Total-Count 헤더로 총 개수 확인).
 *
 *   2. 목록에서 업체를 선택해 [연동하기]를 누르면 연동 추가 API를 호출한다.
 *      (POST /v1/custom/pos/place-businesses/place-id/{placeId}/agency-mappings)
 *      integration API가 아니라 "파트너사 <-> 업체" 매핑만 추가하는 것이므로,
 *      로그인 계정이 해당 업체의 주인권한을 갖고 있어야 성공한다.
 *
 *   3. 목록 조회 결과가 비어있으면(주인권한 있는 업체가 없으면), 플레이스+
 *      "업체 찾기" 페이지로 보내 신규등록/주인권한 변경을 하도록 유도한다.
 *      (https://new.smartplace.naver.com/bizes/lookup?to=redirectURL)
 */

const express = require("express");
const router = express.Router();

const { getAccessToken } = require("../services/naverAuth");
const {
  getAgreementSummary,
  hasAllRequiredAgreements,
  getPlaceBusinesses,
  listConnectedBusinesses,
  addAgencyMapping,
  getAgencyMapping,
  deleteAgencyMapping,
  getPlaceBusinessDetail,
} = require("../services/placeApi");
const { getDemoStoreContext } = require("../services/demoStore");
const { hasStalePosCookie } = require("../services/posSession");
const { saveStep } = require("../services/pncApi");
const { toNotice, noticeUrl, closeHintHtml } = require("./naverPosFlow");
const { rememberNaverUser } = require("../services/npSession");
const { getBaseUrl } = require("../services/baseUrl");
const { FRONT_HOST } = require("../services/frontHost");
const { escapeHtml, renderLayout } = require("../ui/layout");
const { handleNaverLogout } = require("./naverLogin");

const PAGE_SIZE = 10; // 가이드 슬라이드 23: 디폴트 사이즈 10

function layout(req, { title, heading, subtitle, body, logoutHref = "/naver/places/logout" }) {
  return renderLayout({
    title,
    heading: heading || title,
    subtitle,
    body,
    wide: true,
    showLogout: true,
    logoutHref,
  });
}

function buildLookupUrl(callbackUrl) {
  const url = new URL("/bizes/lookup", FRONT_HOST);
  url.searchParams.set("to", callbackUrl);
  return url.toString();
}

function disconnectForm(biz, storeId, naverUniqueId) {
  const action = `/naver/places/${encodeURIComponent(biz.placeId)}/disconnect?storeId=${encodeURIComponent(storeId)}&naverUniqueId=${encodeURIComponent(naverUniqueId)}&page=0`;
  return `<form method="post" action="${action}" data-np-confirm>
    <button class="btn btn-muted" type="submit">연동 해지</button>
  </form>`;
}

function placeImageSrc(url) {
  if (!url) return "";
  try {
    const host = new URL(url).hostname;
    if (/(^|\.)phinf\.net$/i.test(host)) {
      return `/naver/image?u=${encodeURIComponent(url)}`;
    }
  } catch {
    return "";
  }
  return url;
}

function placePhoto(biz, name) {
  const image = biz.businessImage?.primary?.url || biz.businessImage?.primary?.thumbnail || "";
  const src = placeImageSrc(image);
  const initial = escapeHtml(String(name || "?").charAt(0));
  return `<div class="status-photo">
    <div class="status-photo-fallback">${initial}</div>
    ${src ? `<img src="${escapeHtml(src)}" alt="" referrerpolicy="no-referrer" onerror="this.style.display='none'" />` : ""}
  </div>`;
}

function placeFields(biz) {
  const name = biz.businessName || biz.name || "-";
  const address = biz.address || "-";
  const phone = String(biz.phone || biz.phoneNumber || biz.telephone || "").trim() || "-";
  return `<div class="status-summary">
    ${placePhoto(biz, name)}
    <div class="status-fields">
      <div class="status-field"><span>가맹점명</span><strong>${escapeHtml(name)}</strong></div>
      <div class="status-field"><span>플레이스 ID</span><strong>${escapeHtml(biz.placeId)}</strong></div>
      <div class="status-field"><span>주소</span><strong>${escapeHtml(address)}</strong></div>
      <div class="status-field"><span>전화번호</span><strong>${escapeHtml(phone)}</strong></div>
    </div>
  </div>`;
}

/**
 * 이미 연동된 업체가 있을 때 보여주는 확인 화면.
 */
function renderConnectedPage({ storeId, naverUniqueId, connected }) {
  const logoutHref = `/naver/places/logout?storeId=${encodeURIComponent(storeId)}`;
  const logoutButton = `<a class="btn btn-ghost" data-np-logout href="${logoutHref}">로그아웃</a>`;
  let body;

  if (connected.length === 1) {
    body = `
      ${placeFields(connected[0])}
      <div class="btn-row status-actions">
        ${disconnectForm(connected[0], storeId, naverUniqueId)}
        ${logoutButton}
      </div>`;
  } else {
    body = `
      ${connected
        .map(
          (biz) => `<section class="status-block">
            ${placeFields(biz)}
            ${disconnectForm(biz, storeId, naverUniqueId)}
          </section>`
        )
        .join("")}
      <div class="btn-row status-actions">${logoutButton}</div>`;
  }

  return layout(null, {
    title: "네이버 플레이스+ 연동",
    heading: "현재 '네이버 플레이스+'가 정상적으로 연동되어 있습니다.",
    body,
    logoutHref,
  });
}

/**
 * STEP 3. 업체 목록 조회
 *
 * GET /naver/places?storeId=xxx&page=0
 */
router.get("/logout", handleNaverLogout);

router.get("/", async (req, res) => {
  const { storeId, refreshToken, naverUniqueId, pos } = getDemoStoreContext(req);
  const page = Number.parseInt(req.query.page, 10) || 0;
  if (!pos && hasStalePosCookie(req)) return toNotice(req, res, "3001");

  // POS 연동: 매장·계정은 서버 세션에 있으므로 주소·폼에 붙이지 않는다
  const idQs = pos
    ? ""
    : `storeId=${encodeURIComponent(storeId)}&naverUniqueId=${encodeURIComponent(naverUniqueId)}&`;

  try {
    const accessToken = await getAccessToken(storeId, refreshToken);
    if (!pos) rememberNaverUser(res, storeId, naverUniqueId);

    const connected = await listConnectedBusinesses({ accessToken, naverUniqueId });
    if (connected.length) {
      res.set("Cache-Control", "no-store");
      if (pos) {
        // 이미 연동됨 → 실제 상태 저장 후 P2 상태 확인 화면으로
        const biz = connected[0];
        const placeName = biz.businessName || biz.name || "";
        const saved = await saveStep(pos.reqId, "CHECKED", {
          linkYn: "Y",
          naverUniqueId,
          placeId: biz.placeId,
          placeName,
        });
        if (!saved.ok) return toNotice(req, res, saved.resCd);
        pos.check = {
          linkYn: "Y",
          uid: naverUniqueId,
          placeId: String(biz.placeId),
          placeName,
          count: connected.length,
          synced: saved.syncYn === "Y",
        };
        return res.redirect("/naver/start/status");
      }
      return res.send(renderConnectedPage({ storeId, naverUniqueId, connected }));
    }

    const { items, totalCount } = await getPlaceBusinesses({
      accessToken,
      naverUniqueId,
      page,
    });

    const selfUrl = new URL(`/naver/places`, getBaseUrl(req));
    if (!pos) {
      selfUrl.searchParams.set("storeId", storeId);
      selfUrl.searchParams.set("naverUniqueId", naverUniqueId);
    }

    const pageLink = (targetPage) => `/naver/places?${idQs}page=${targetPage}`;

    if (!items || items.length === 0) {
      if (pos) {
        // 관리 중인 업체 없음 → 닫기 때 3003
        const saved = await saveStep(pos.reqId, "NOBIZ");
        if (!saved.ok) return toNotice(req, res, saved.resCd);
      }
      const lookupUrl = buildLookupUrl(selfUrl.toString());
      return res.send(
        layout(req, {
          title: "연동할 업체 찾기",
          heading: "연동할 업체를 찾을 수 없습니다",
          subtitle: "이 네이버 계정이 주인권한을 가진 업체가 없습니다.",
          body: `
            <div class="empty">
              <p>아래 버튼으로 이동해 업체를 신규 등록하거나, 이미 등록된 업체라면 주인권한을 변경해주세요.</p>
              <a class="btn btn-accent" href="${escapeHtml(lookupUrl)}">업체 찾기 / 주인권한 변경하러 가기</a>
            </div>
            ${pos ? closeHintHtml("업체 등록·주인권한 변경을 마친 뒤 POS의 [닫기]를 누르고 다시 시작해 주세요.") : ""}
          `,
        })
      );
    }

    // 각 업체별 연동 여부를 조회합니다 (연동 조회 API). 미연동이면 404/409가 나므로
    // 실패해도 페이지 전체가 죽지 않도록 Promise.allSettled로 처리합니다.
    const connectionChecks = await Promise.allSettled(
      items.map((biz) =>
        getAgencyMapping({ accessToken, naverUniqueId, placeId: biz.placeId })
      )
    );
    const connectedFlags = connectionChecks.map((r) => r.status === "fulfilled");

    const rows = items
      .map((biz, index) => {
        const image = biz.businessImage?.primary?.url || biz.businessImage?.primary?.thumbnail;
        const initial = escapeHtml(String(biz.businessName || "?").charAt(0));
        const isConnected = connectedFlags[index];
        const actionForm = isConnected
          ? `<form method="post" action="/naver/places/${encodeURIComponent(biz.placeId)}/disconnect?${idQs}page=${page}" data-np-confirm>
              <button class="btn btn-muted" type="submit">연동 해지</button>
            </form>`
          : `<form method="post" action="/naver/places/${encodeURIComponent(biz.placeId)}/connect?${idQs}page=${page}">
              <button class="btn btn-accent" type="submit">연동하기</button>
            </form>`;
        return `
          <tr>
            <td>
              <div class="biz-thumb-wrap">
                <div class="biz-thumb-fallback">${initial}</div>
                ${image ? `<img class="biz-thumb" src="${escapeHtml(image)}" alt="" referrerpolicy="no-referrer" onerror="this.style.display='none'" />` : ""}
              </div>
            </td>
            <td>
              <div class="biz-name">${escapeHtml(biz.businessName)} ${isConnected ? '<span class="badge">연동됨</span>' : ""}</div>
              <div class="muted">${escapeHtml(biz.address || "")}</div>
              ${biz.phone ? `<div class="muted">${escapeHtml(biz.phone)}</div>` : ""}
            </td>
            <td>${actionForm}</td>
          </tr>
        `;
      })
      .join("");

    const hasPrev = page > 0;
    const hasNext = (page + 1) * PAGE_SIZE < totalCount;

    return res.send(
        layout(req, {
          title: "연동할 업체 선택",
          heading: "연동할 업체를 선택하세요",
          subtitle: `전체 ${totalCount}개 업체 중 ${page * PAGE_SIZE + 1}~${page * PAGE_SIZE + items.length}번째`,
          body: `
          <table class="biz-table">
            <thead><tr><th></th><th>업체 정보</th><th></th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
          <div class="pager">
            <a href="${hasPrev ? pageLink(page - 1) : "#"}" style="visibility:${hasPrev ? "visible" : "hidden"}">← 이전 페이지</a>
            <a href="${hasNext ? pageLink(page + 1) : "#"}" style="visibility:${hasNext ? "visible" : "hidden"}">다음 페이지 →</a>
          </div>
          <div class="lookup-bar">찾는 업체가 없나요? <a href="${escapeHtml(buildLookupUrl(selfUrl.toString()))}">업체 찾기로 이동</a></div>
        `,
        })
    );
  } catch (err) {
    console.error("[naver/places] 업체 목록 조회 실패:", err.message);
    return res.status(502).send(
      layout(req, {
        title: "업체 목록 조회 실패",
        heading: "업체 목록을 불러오지 못했습니다",
        body: `
          <p class="msg">잠시 후 다시 시도해주세요.</p>
          <div class="actions-after"><a class="btn btn-primary" href="/naver/start">처음으로</a></div>
        `,
      })
    );
  }
});

/**
 * STEP 3-2. 연동 추가
 *
 * POST /naver/places/:placeId/connect?storeId=xxx
 */
router.post("/:placeId/connect", async (req, res) => {
  const { storeId, refreshToken, naverUniqueId, pos } = getDemoStoreContext(req);
  const { placeId } = req.params;
  if (!pos && hasStalePosCookie(req)) return toNotice(req, res, "3001");

  try {
    const accessToken = await getAccessToken(storeId, refreshToken);

    // 가이드 슬라이드 13: 업체 선택 후 필수 약관(사업자 정보제공 동의 포함)이 빠져 있으면
    // 약관동의를 먼저 받고 연동한다. (연동 해지 시 정보제공 동의가 철회되므로 재연동 때 필요)
    let agreedAll = true;
    try {
      const summary = await getAgreementSummary({ accessToken, naverUniqueId });
      agreedAll = hasAllRequiredAgreements(summary);
    } catch (summaryErr) {
      console.error(
        `[naver/places/${placeId}/connect] 동의여부 조회 실패, 연동 진행:`,
        summaryErr.response?.data || summaryErr.message
      );
    }
    if (!agreedAll) {
      return res.redirect(
        303,
        pos
          ? "/naver/terms/start"
          : `/naver/terms/start?storeId=${encodeURIComponent(storeId)}&naverUniqueId=${encodeURIComponent(naverUniqueId)}`
      );
    }

    const result = await addAgencyMapping({ accessToken, naverUniqueId, placeId });

    if (pos) {
      // P8 연동 완료 → LINKED 저장 (업체명은 상세 조회, 실패해도 연동은 완료)
      let placeName = "";
      try {
        const detail = await getPlaceBusinessDetail({ accessToken, naverUniqueId, placeId });
        placeName = detail?.businessName || detail?.name || "";
      } catch (detailErr) {
        console.error(`[naver/places/${placeId}/connect] 업체명 조회 실패:`, detailErr.message);
      }

      let savedNote = "";
      try {
        const saved = await saveStep(pos.reqId, "LINKED", { placeId, placeName });
        if (!saved.ok) {
          savedNote = `<p class="msg-detail">이 요청은 이미 종료되어 POS 결과에는 반영되지 않습니다. POS에서 다시 시작하면 최신 상태로 맞춰집니다.</p>`;
        }
      } catch (saveErr) {
        console.error(`[naver/places/${placeId}/connect] LINKED 저장 실패:`, saveErr.message);
      }
      pos.check = { linkYn: "Y", uid: naverUniqueId, placeId: String(placeId), placeName, count: 1, synced: false };

      return res.send(
        layout(req, {
          title: "연동 완료",
          heading: "연동이 완료되었습니다",
          body: `
          <p class="msg">${escapeHtml(placeName || placeId)} 업체와의 네이버 플레이스 연동이 등록되었습니다.</p>
          <p class="muted">연동 등록 시각: ${escapeHtml(result.regDateTime)}</p>
          ${savedNote}
          ${closeHintHtml()}
        `,
        })
      );
    }

    return res.send(
        layout(req, {
          title: "연동 완료",
          heading: "연동이 완료되었습니다",
          body: `
          <p class="msg">플레이스 ID <strong>${escapeHtml(placeId)}</strong> 업체와의 연동이 등록되었습니다.</p>
          <p class="muted">연동 등록 시각: ${escapeHtml(result.regDateTime)}</p>
          <div class="actions-after"><a class="btn btn-primary" href="/naver/start">처음으로</a></div>
        `,
        })
    );
  } catch (err) {
    const status = err.response?.status;
    const errorCode = err.response?.data?.errorCode;

    console.error(
      `[naver/places/${placeId}/connect] 연동 추가 실패:`,
      status,
      errorCode || err.message
    );

    // 가이드 슬라이드 24 기준 연동 추가 API가 명시하는 오류는 401 / 404 / 500 뿐입니다.
    // 그 외 상태 코드(예: Access Token 발급 실패)는 우리 쪽 502로 감싸서 응답합니다.
    if (pos) {
      // POS 연동: 실패 저장 후 P11 안내 (401 주인권한 없음 4001 / 404 업체 없음 4002 / 그 외 4009)
      const failCd = status === 401 ? "4001" : status === 404 ? "4002" : "4009";
      try {
        const saved = await saveStep(pos.reqId, "FAIL", { resCd: failCd, errMsg: `${status || ""} ${errorCode || err.message}` });
        if (!saved.ok) return toNotice(req, res, saved.resCd);
      } catch (saveErr) {
        console.error(`[naver/places/${placeId}/connect] FAIL 저장 실패:`, saveErr.message);
      }
      return res.redirect(303, noticeUrl(failCd));
    }

    let message = "연동 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
    let responseStatus = 502;
    if (status === 401) {
      message = "이 업체에 대한 주인권한이 없어 연동할 수 없습니다. 플레이스+에서 주인권한을 확인해주세요.";
      responseStatus = 401;
    } else if (status === 404) {
      message = "해당 업체를 찾을 수 없습니다. 목록을 새로고침한 뒤 다시 시도해주세요.";
      responseStatus = 404;
    }

    return res.status(responseStatus).send(
        layout(req, {
          title: "연동 실패",
          heading: "연동에 실패했습니다",
          body: `
          <p class="msg">${escapeHtml(message)}</p>
          <div class="actions-after"><a class="btn btn-primary" href="/naver/places?storeId=${encodeURIComponent(storeId)}&naverUniqueId=${encodeURIComponent(naverUniqueId)}">목록으로 돌아가기</a></div>
        `,
        })
    );
  }
});

/**
 * STEP 3-3. 연동 해지
 *
 * POST /naver/places/:placeId/disconnect?storeId=xxx
 * (가이드: DELETE .../agency-mappings, 204 No Content 성공)
 */
router.post("/:placeId/disconnect", async (req, res) => {
  const { storeId, refreshToken, naverUniqueId } = getDemoStoreContext(req);
  const { placeId } = req.params;
  const page = req.query.page || 0;

  try {
    const accessToken = await getAccessToken(storeId, refreshToken);
    await deleteAgencyMapping({ accessToken, naverUniqueId, placeId });

    return res.redirect(
      `/naver/places?storeId=${encodeURIComponent(storeId)}&naverUniqueId=${encodeURIComponent(naverUniqueId)}&page=${page}`
    );
  } catch (err) {
    const status = err.response?.status;
    console.error(
      `[naver/places/${placeId}/disconnect] 연동 해지 실패:`,
      status,
      err.response?.data?.errorCode || err.message
    );

    let message = "연동 해지 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
    let responseStatus = 502;
    if (status === 401) {
      message = "이 업체에 대한 권한이 없어 연동을 해지할 수 없습니다.";
      responseStatus = 401;
    } else if (status === 409) {
      message = "이미 연동이 해지되어 있습니다.";
      responseStatus = 409;
    }

    return res.status(responseStatus).send(
        layout(req, {
          title: "연동 해지 실패",
          heading: "연동 해지에 실패했습니다",
          body: `
          <p class="msg">${escapeHtml(message)}</p>
          <div class="actions-after"><a class="btn btn-primary" href="/naver/places?storeId=${encodeURIComponent(storeId)}&naverUniqueId=${encodeURIComponent(naverUniqueId)}">목록으로 돌아가기</a></div>
        `,
        })
    );
  }
});

module.exports = router;
module.exports.renderConnectedPage = renderConnectedPage;
