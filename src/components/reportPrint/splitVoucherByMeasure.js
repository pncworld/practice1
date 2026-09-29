import { PO_SHEET_CSS } from "./poSheetStyles";

function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function fmtAmt(v) {
  const n = Number(v);
  if (!Number.isFinite(n)) return "0";
  return n.toLocaleString("ko-KR");
}

function fmtQty(v) {
  const n = Number(v);
  if (!Number.isFinite(n)) return "0";
  if (Number.isInteger(n)) return n.toLocaleString("ko-KR");
  return n.toLocaleString("ko-KR", { maximumFractionDigits: 3 });
}

function fmtDate(v) {
  const s = String(v ?? "").trim();
  if (!s) return "";
  if (/^\d{8}$/.test(s)) {
    return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
  }
  if (s.length >= 10 && s[4] === "-" && s[7] === "-") return s.slice(0, 10);
  return s;
}

function mmToPx(mm) {
  return (mm * 96) / 25.4;
}

/**
 * @param {object} base buildPageFromDetail 결과(전체 lines)
 * @param {{ partyLayout?: 'part'|'basic' }} [opts]
 * @returns {object[]}
 */
export function splitVoucherByMeasure(base, opts = {}) {
  if (typeof document === "undefined") {
    return null;
  }

  const partyLayout = opts.partyLayout || base.partyLayout || "part";
  const isPart = partyLayout === "part";

  const lines = Array.isArray(base.lines) ? base.lines : [];
  if (!lines.length) {
    return [
      {
        ...base,
        key: `${base.key}__p1`,
        voucherPage: 1,
        voucherPageCount: 1,
        isFirstPage: true,
        isLastPage: true,
        lines: [],
      },
    ];
  }

  /* A4 297mm − @page 상하 − 바닥글(얇게) ≈ 본문 최대 높이 */
  const maxBodyPx = mmToPx(297 - 10 - 6 - 7);
  const pageWidthPx = mmToPx(210);

  const host = document.createElement("div");
  host.setAttribute("data-po-measure", "1");
  Object.assign(host.style, {
    position: "fixed",
    left: "-10000px",
    top: "0",
    width: `${pageWidthPx}px`,
    visibility: "hidden",
    pointerEvents: "none",
    zIndex: "-1",
  });
  const styleEl = document.createElement("style");
  styleEl.textContent = `${PO_SHEET_CSS}
.po-measure-wrap { box-sizing: border-box; width: 100%; padding: 2mm 3mm 0; }
`;
  host.appendChild(styleEl);
  document.body.appendChild(host);

  const render = (slice, isFirst, isLast) => {
    const rows = slice
      .map(
        (line) => `<tr>
      <td class="po-col-code">${esc(line.stockId)}</td>
      <td class="po-col-name"><span class="po-name-text">${esc(line.stockName)}</span></td>
      <td class="po-col-unit">${esc(line.unitName)}</td>
      <td class="po-col-qty">${esc(fmtQty(line.qty))}</td>
      <td class="po-col-price">${esc(fmtAmt(line.unitPrice))}</td>
      <td class="po-col-price">${esc(fmtAmt(line.supply))}</td>
      <td class="po-col-price">${esc(fmtAmt(line.tax))}</td>
      <td class="po-col-amt">${esc(fmtAmt(line.total))}</td>
    </tr>`,
      )
      .join("");

    const pv = (v) => `<span class="po-party-cell">${esc(v)}</span>`;
    const partyTable = isPart
      ? `<table class="po-sheet__party-table">
      <thead><tr>
        <th colspan="4" class="po-party-hd">수 신 처</th>
        <th colspan="4" class="po-party-hd">발 주 처</th>
      </tr></thead>
      <tbody>
        <tr><th>사업자번호</th><td>${pv(base.recvRegistNo)}</td><th>성명</th><td>${pv(base.recvDirector)}</td>
          <th>사업자번호</th><td colspan="3">${pv(base.suppRegistNo)}</td></tr>
        <tr><th>상호</th><td>${pv(base.storeName)}</td><th>파트</th><td>${pv(base.partName)}</td>
          <th>상호</th><td>${pv(base.supplierName)}</td><th>성명</th><td>${pv(base.suppDirector)}</td></tr>
        <tr><th>전화번호</th><td colspan="3">${pv(base.recvTel)}</td>
          <th>팩스번호</th><td>${pv(base.suppFax)}</td><th>담당</th><td>${pv(base.suppManager)}</td></tr>
        <tr><th>주소</th><td colspan="3">${pv(base.recvAddress)}</td>
          <th>주소</th><td colspan="3">${pv(base.suppAddress)}</td></tr>
      </tbody></table>`
      : `<table class="po-sheet__party-table">
      <thead><tr>
        <th colspan="4" class="po-party-hd">수 신 처</th>
        <th colspan="4" class="po-party-hd">발 주 처</th>
      </tr></thead>
      <tbody>
        <tr><th>사업자번호</th><td colspan="3">${pv(base.recvRegistNo)}</td>
          <th>사업자번호</th><td colspan="3">${pv(base.suppRegistNo)}</td></tr>
        <tr><th>상호</th><td>${pv(base.storeName)}</td><th>성명</th><td>${pv(base.recvDirector)}</td>
          <th>상호</th><td>${pv(base.supplierName)}</td><th>성명</th><td>${pv(base.suppDirector)}</td></tr>
        <tr><th>전화번호</th><td colspan="3">${pv(base.recvTel)}</td>
          <th>팩스번호</th><td>${pv(base.suppFax)}</td><th>담당</th><td>${pv(base.suppManager)}</td></tr>
        <tr><th>주소</th><td colspan="3">${pv(base.recvAddress)}</td>
          <th>주소</th><td colspan="3">${pv(base.suppAddress)}</td></tr>
      </tbody></table>`;

    const header = isFirst
      ? `<div class="po-sheet__title-box"><h1 class="po-sheet__title">발 주 서</h1></div>
      <div class="po-sheet__top-meta">
        <div class="po-sheet__top-item"><span class="po-sheet__k"><span class="po-sheet__mark">◆</span> 전표번호</span><span class="po-sheet__v">${esc(base.orderNo)}</span></div>
        <div class="po-sheet__top-item"><span class="po-sheet__k"><span class="po-sheet__mark">◆</span> 납기일자</span><span class="po-sheet__v">${esc(fmtDate(base.expectedDate))}</span></div>
        <div class="po-sheet__top-item"><span class="po-sheet__k"><span class="po-sheet__mark">◆</span> 발주일자</span><span class="po-sheet__v">${esc(fmtDate(base.orderDate))}</span></div>
      </div>
      ${partyTable}`
      : partyTable;

    const wrap = document.createElement("div");
    wrap.className = "po-measure-wrap po-sheet";
    wrap.innerHTML = `${header}
      <table class="po-sheet__table">
        <colgroup>
          <col class="po-col-code"/><col class="po-col-name"/><col class="po-col-unit"/><col class="po-col-qty"/>
          <col class="po-col-price"/><col class="po-col-price"/><col class="po-col-price"/><col class="po-col-amt"/>
        </colgroup>
        <thead><tr>
          <th class="po-col-code">자재코드</th><th class="po-col-name">자재명</th><th class="po-col-unit">단위</th><th class="po-col-qty">수량</th>
          <th class="po-col-price">단가</th><th class="po-col-price">공급가</th><th class="po-col-price">부가세</th><th class="po-col-amt">금액</th>
        </tr></thead>
        <tbody>${rows}</tbody>${
          isLast
            ? `<tfoot><tr><td colspan="5" class="po-sheet__sum-label">합계</td>
          <td class="po-col-price">${esc(fmtAmt(base.sumSupply))}</td>
          <td class="po-col-price">${esc(fmtAmt(base.sumTax))}</td>
          <td class="po-col-amt">${esc(fmtAmt(base.sumTotal))}</td></tr></tfoot>`
            : ""
        }
      </table>
      ${
        isLast
          ? `<div class="po-sheet__comments"><div class="po-sheet__comments-hd">◎ Order Comments ◎</div>
        <div class="po-sheet__comments-bd">${esc(base.comments)}</div></div>`
          : ""
      }
      <div class="rp-page__footer" style="margin-top:8px;padding-top:4px;border-top:2px solid #000;font-size:12px;">
        <div>인쇄일자 · 인쇄시간</div><div>n / n</div>
      </div>`;
    return wrap;
  };

  try {
    /** @type {typeof lines[]} */
    const chunks = [];
    let start = 0;
    let pageIndex = 0;

    while (start < lines.length) {
      let lo = start + 1;
      let hi = lines.length;
      let best = start + 1;

      while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        const slice = lines.slice(start, mid);
        const isFirst = pageIndex === 0;
        const isLast = mid >= lines.length;
        const prev = host.querySelector(".po-measure-wrap");
        if (prev) prev.remove();
        const el = render(slice, isFirst, isLast);
        host.appendChild(el);
        const h = el.getBoundingClientRect().height;
        if (h <= maxBodyPx) {
          best = mid;
          lo = mid + 1;
        } else {
          hi = mid - 1;
        }
      }

      if (best <= start) best = start + 1;
      chunks.push(lines.slice(start, best));
      start = best;
      pageIndex += 1;
    }

    const voucherPageCount = chunks.length;
    return chunks.map((chunk, i) => {
      const voucherPage = i + 1;
      return {
        ...base,
        key: `${base.key}__p${voucherPage}`,
        voucherPage,
        voucherPageCount,
        isFirstPage: voucherPage === 1,
        isLastPage: voucherPage === voucherPageCount,
        lines: chunk,
      };
    });
  } finally {
    host.remove();
  }
}
