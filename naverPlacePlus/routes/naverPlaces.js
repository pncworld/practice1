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
 *   3. 목록 조회 결과가 비어있으면(주인권한 있는 업체가 없으면), 스마트플레이스
 *      "업체 찾기" 페이지로 보내 신규등록/주인권한 변경을 하도록 유도한다.
 *      (https://new.smartplace.naver.com/bizes/lookup?to=redirectURL)
 */

const express = require("express");
const router = express.Router();

const { getAccessToken } = require("../services/naverAuth");
const {
  getPlaceBusinesses,
  addAgencyMapping,
  getAgencyMapping,
  deleteAgencyMapping,
} = require("../services/placeApi");
const { getDemoStoreContext } = require("../services/demoStore");
const { getBaseUrl } = require("../services/baseUrl");
const { FRONT_HOST } = require("../services/frontHost");

const PAGE_SIZE = 10; // 가이드 슬라이드 23: 디폴트 사이즈 10

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (ch) => {
    switch (ch) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      default:
        return "&#39;";
    }
  });
}

function layout({ title, body }) {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <title>${escapeHtml(title)}</title>
  <style>
    body { font-family: -apple-system, "Malgun Gothic", sans-serif; max-width: 720px; margin: 40px auto; padding: 0 16px; color: #222; }
    h1 { font-size: 20px; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    th, td { border-bottom: 1px solid #eee; padding: 10px 8px; text-align: left; font-size: 14px; vertical-align: middle; }
    th { color: #888; font-weight: 500; }
    button, .btn { background: #03c75a; color: #fff; border: none; border-radius: 6px; padding: 8px 14px; font-size: 14px; cursor: pointer; text-decoration: none; display: inline-block; }
    button:hover, .btn:hover { background: #02b350; }
    .muted { color: #888; font-size: 13px; }
    .empty { text-align: center; padding: 48px 0; color: #666; }
    .pager { display: flex; justify-content: space-between; margin-top: 20px; }
    .pager a { color: #03c75a; text-decoration: none; font-size: 14px; }
    .notice { background: #f5f5f5; border-radius: 8px; padding: 12px 16px; font-size: 13px; color: #555; margin-top: 12px; }
  </style>
</head>
<body>
  ${body}
</body>
</html>`;
}

function buildLookupUrl(callbackUrl) {
  const url = new URL("/bizes/lookup", FRONT_HOST);
  url.searchParams.set("to", callbackUrl);
  return url.toString();
}

/**
 * STEP 3. 업체 목록 조회
 *
 * GET /naver/places?storeId=xxx&page=0
 */
router.get("/", async (req, res) => {
  const { storeId, refreshToken, naverUniqueId } = getDemoStoreContext(req);
  const page = Number.parseInt(req.query.page, 10) || 0;

  try {
    const accessToken = await getAccessToken(storeId, refreshToken);
    const { items, totalCount } = await getPlaceBusinesses({
      accessToken,
      naverUniqueId,
      page,
    });

    const selfUrl = new URL(`/naver/places`, getBaseUrl(req));
    selfUrl.searchParams.set("storeId", storeId);
    selfUrl.searchParams.set("naverUniqueId", naverUniqueId);

    const pageLink = (targetPage) =>
      `/naver/places?storeId=${encodeURIComponent(storeId)}&naverUniqueId=${encodeURIComponent(naverUniqueId)}&page=${targetPage}`;

    if (!items || items.length === 0) {
      const lookupUrl = buildLookupUrl(selfUrl.toString());
      return res.send(
        layout({
          title: "연동할 업체 찾기",
          body: `
            <h1>연동할 업체를 찾을 수 없어요</h1>
            <div class="empty">
              <p>이 네이버 계정이 주인권한을 가진 업체가 없습니다.</p>
              <p class="muted">아래 버튼으로 이동해 업체를 신규 등록하거나, 이미 등록된 업체라면 주인권한을 변경해주세요.</p>
              <p style="margin-top: 20px;"><a class="btn" href="${escapeHtml(lookupUrl)}">업체 찾기 / 주인권한 변경하러 가기</a></p>
            </div>
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
        const image = biz.businessImage?.primary?.thumbnail;
        const isConnected = connectedFlags[index];
        const actionForm = isConnected
          ? `<form method="post" action="/naver/places/${encodeURIComponent(biz.placeId)}/disconnect?storeId=${encodeURIComponent(storeId)}&naverUniqueId=${encodeURIComponent(naverUniqueId)}&page=${page}" onsubmit="return confirm('연동을 해지할까요?');">
              <button type="submit" style="background:#888;">연동 해지</button>
            </form>`
          : `<form method="post" action="/naver/places/${encodeURIComponent(biz.placeId)}/connect?storeId=${encodeURIComponent(storeId)}&naverUniqueId=${encodeURIComponent(naverUniqueId)}&page=${page}">
              <button type="submit">연동하기</button>
            </form>`;
        return `
          <tr>
            <td>${image ? `<img src="${escapeHtml(image)}" alt="" width="48" height="48" style="border-radius:6px;object-fit:cover;" />` : ""}</td>
            <td>
              <div><strong>${escapeHtml(biz.businessName)}</strong> ${isConnected ? '<span class="muted">(연동됨)</span>' : ""}</div>
              <div class="muted">${escapeHtml(biz.address || "")}</div>
            </td>
            <td>${actionForm}</td>
          </tr>
        `;
      })
      .join("");

    const hasPrev = page > 0;
    const hasNext = (page + 1) * PAGE_SIZE < totalCount;

    return res.send(
      layout({
        title: "연동할 업체 선택",
        body: `
          <h1>연동할 업체를 선택하세요</h1>
          <p class="muted">전체 ${totalCount}개 업체 중 ${page * PAGE_SIZE + 1}~${page * PAGE_SIZE + items.length}번째</p>
          <table>
            <thead><tr><th></th><th>업체 정보</th><th></th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
          <div class="pager">
            <a href="${hasPrev ? pageLink(page - 1) : "#"}" style="visibility:${hasPrev ? "visible" : "hidden"}">← 이전 페이지</a>
            <a href="${hasNext ? pageLink(page + 1) : "#"}" style="visibility:${hasNext ? "visible" : "hidden"}">다음 페이지 →</a>
          </div>
          <div class="notice">찾는 업체가 없나요? <a href="${escapeHtml(buildLookupUrl(selfUrl.toString()))}">업체 찾기로 이동</a></div>
        `,
      })
    );
  } catch (err) {
    console.error("[naver/places] 업체 목록 조회 실패:", err.message);
    return res
      .status(502)
      .send("업체 목록을 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
  }
});

/**
 * STEP 3-2. 연동 추가
 *
 * POST /naver/places/:placeId/connect?storeId=xxx
 */
router.post("/:placeId/connect", async (req, res) => {
  const { storeId, refreshToken, naverUniqueId } = getDemoStoreContext(req);
  const { placeId } = req.params;

  try {
    const accessToken = await getAccessToken(storeId, refreshToken);
    const result = await addAgencyMapping({ accessToken, naverUniqueId, placeId });

    return res.send(
      layout({
        title: "연동 완료",
        body: `
          <h1>연동이 완료됐어요 🎉</h1>
          <p>플레이스 ID <strong>${escapeHtml(placeId)}</strong> 업체와의 연동이 등록되었습니다.</p>
          <p class="muted">연동 등록 시각: ${escapeHtml(result.regDateTime)}</p>
          <p style="margin-top: 24px;"><a class="btn" href="/naver/start">처음으로</a></p>
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
    let message = "연동 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
    let responseStatus = 502;
    if (status === 401) {
      message = "이 업체에 대한 주인권한이 없어 연동할 수 없습니다. 스마트플레이스에서 주인권한을 확인해주세요.";
      responseStatus = 401;
    } else if (status === 404) {
      message = "해당 업체를 찾을 수 없습니다. 목록을 새로고침한 뒤 다시 시도해주세요.";
      responseStatus = 404;
    }

    return res.status(responseStatus).send(
      layout({
        title: "연동 실패",
        body: `
          <h1>연동에 실패했어요</h1>
          <p>${escapeHtml(message)}</p>
          <p style="margin-top: 24px;"><a class="btn" href="/naver/places?storeId=${encodeURIComponent(storeId)}&naverUniqueId=${encodeURIComponent(naverUniqueId)}">목록으로 돌아가기</a></p>
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
      layout({
        title: "연동 해지 실패",
        body: `
          <h1>연동 해지에 실패했어요</h1>
          <p>${escapeHtml(message)}</p>
          <p style="margin-top: 24px;"><a class="btn" href="/naver/places?storeId=${encodeURIComponent(storeId)}&naverUniqueId=${encodeURIComponent(naverUniqueId)}">목록으로 돌아가기</a></p>
        `,
      })
    );
  }
});

module.exports = router;
