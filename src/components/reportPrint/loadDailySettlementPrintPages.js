/**
 * 일일 정산 레포트(SLS02_017) — A4 본문 높이 측정 후 행 단위 페이지 분할
 * (발주서 splitVoucherByMeasure 와 동일 목적: 그리드 중간 끊김 방지)
 */
import { SLS0217_SHEET_CSS } from "./sls0217SheetStyles";

function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function mmToPx(mm) {
  return (mm * 96) / 25.4;
}

function pick(row, keys) {
  if (!row || typeof row !== "object") return "";
  for (const k of keys) {
    if (row[k] != null && row[k] !== "") return row[k];
  }
  return "";
}

function fmtNum(v, { rate = false } = {}) {
  if (v == null || v === "") return "";
  if (typeof v === "string" && /[^\d.\-]/.test(v) && !rate) {
    /* 이미 포맷된 문자열 */
    const n = Number(String(v).replace(/,/g, ""));
    if (!Number.isFinite(n)) return String(v);
    return rate
      ? n.toLocaleString("ko-KR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : n.toLocaleString("ko-KR");
  }
  const n = Number(v);
  if (!Number.isFinite(n)) return String(v ?? "");
  if (rate) {
    return n.toLocaleString("ko-KR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  return n.toLocaleString("ko-KR");
}

function cellHtml(row, col) {
  const raw = pick(row, col.keys);
  if (col.rate) return esc(fmtNum(raw, { rate: true }));
  if (col.num) return esc(fmtNum(raw));
  return esc(raw);
}

/** 섹션 컬럼 정의 — RealGrid/API 필드명 후보 */
const SECTION_DEFS = [
  {
    id: "time",
    title: "시간대별 매출 내역",
    columns: [
      { label: "시간대", keys: ["strHour", "strTime", "strTimeName", "strName"], align: "left" },
      { label: "조수", keys: ["lngRecCnt", "lngCnt", "lngJoCnt"], num: true },
      { label: "조수누계", keys: ["lngRecCum", "lngCntSum", "lngJoCum"], num: true },
      { label: "객수", keys: ["lngCustCnt", "lngCust"], num: true },
      { label: "객수누계", keys: ["lngCustCum", "lngCustSum"], num: true },
      { label: "매출액", keys: ["lngSalAmt", "lngAmt", "lngTotAmt"], num: true },
      { label: "매출액누계", keys: ["lngSalCum", "lngAmtSum", "lngTotCum"], num: true },
      { label: "객단가", keys: ["lngCustAmt", "lngAvg", "lngUnitPrice"], num: true },
      { label: "객단가누계", keys: ["lngCustAmtCum", "lngAvgSum"], num: true },
      { label: "비율", keys: ["dblDistRate", "dblRate"], rate: true },
    ],
  },
  {
    id: "sales",
    title: "매출 세부 내역",
    columns: [
      { label: "세부항목", keys: ["strName", "strItemName", "strPayName", "strTitle"], align: "left" },
      { label: "건수", keys: ["lngCnt", "lngRecCnt", "lngQty"], num: true },
      { label: "금액", keys: ["lngAmt", "lngSalAmt", "lngMoney", "curAmt"], num: true },
      { label: "비율", keys: ["dblRate", "dblDistRate"], rate: true },
    ],
  },
  {
    id: "menu",
    title: "메뉴 그룹별 내역",
    columns: [
      { label: "메뉴그룹명", keys: ["strName", "strGroupName", "strMenuGroup"], align: "left" },
      { label: "건수", keys: ["lngCnt", "lngRecCnt", "lngQty"], num: true },
      { label: "금액", keys: ["lngAmt", "lngSalAmt", "lngMoney", "curAmt"], num: true },
      { label: "비율", keys: ["dblRate", "dblDistRate"], rate: true },
    ],
  },
  {
    id: "cash",
    title: "현금 정산 내역",
    columns: [
      { label: "정산항목", keys: ["strName", "strItemName", "strTitle"], align: "left" },
      { label: "건수", keys: ["lngCnt", "lngRecCnt", "lngQty"], num: true },
      { label: "금액", keys: ["lngAmt", "lngSalAmt", "lngMoney", "curAmt"], num: true },
      { label: "비율", keys: ["dblRate", "dblDistRate"], rate: true },
    ],
  },
  {
    id: "card",
    title: "신용카드 별 내역",
    columns: [
      { label: "카드사명", keys: ["strName", "strCardName", "strCard"], align: "left" },
      { label: "건수", keys: ["lngCnt", "lngRecCnt", "lngQty"], num: true },
      { label: "금액", keys: ["lngAmt", "lngSalAmt", "lngMoney", "curAmt"], num: true },
      { label: "비율", keys: ["dblRate", "dblDistRate"], rate: true },
    ],
  },
  {
    id: "cancel",
    title: "매출 취소 내역",
    columns: [
      { label: "취소항목", keys: ["strName", "strItemName", "strTitle"], align: "left" },
      { label: "건수", keys: ["lngCnt", "lngRecCnt", "lngQty"], num: true },
      { label: "금액", keys: ["lngAmt", "lngSalAmt", "lngMoney", "curAmt"], num: true },
    ],
  },
  {
    id: "openclose",
    title: "개점/마감내역",
    columns: [
      { label: "세션구분", keys: ["strName", "strSession", "strType"], align: "left" },
      { label: "포스", keys: ["strPos", "strPosNo", "lngPosNo"], align: "center" },
      { label: "작업시간", keys: ["strWorkTime", "strTime", "dtmWork"], align: "center" },
      { label: "담당자명", keys: ["strEmpName", "strChargerName", "strUserName"], align: "left" },
    ],
  },
];

function theadHtml(columns) {
  return `<thead><tr>${columns
    .map((c) => `<th>${esc(c.label)}</th>`)
    .join("")}</tr></thead>`;
}

function tbodyHtml(columns, rows) {
  if (!rows.length) {
    return `<tbody><tr><td colspan="${columns.length}" class="is-center">자료 없음</td></tr></tbody>`;
  }
  return `<tbody>${rows
    .map((row) => {
      const tds = columns
        .map((c) => {
          const cls = c.num || c.rate ? "is-num" : c.align === "center" ? "is-center" : "is-left";
          return `<td class="${cls}">${cellHtml(row, c)}</td>`;
        })
        .join("");
      return `<tr>${tds}</tr>`;
    })
    .join("")}</tbody>`;
}

function renderMeasureHtml(meta, sectionsOnPage, { showDocHeader }) {
  const header = showDocHeader
    ? `<div class="sls0217-sheet__title-box"><h1 class="sls0217-sheet__title">일일 정산 레포트</h1></div>
      <div class="sls0217-sheet__meta">
        <div class="sls0217-sheet__meta-item"><span class="sls0217-sheet__meta-k">조회기간</span><span>${esc(meta.periodText)}</span></div>
        <div class="sls0217-sheet__meta-item"><span class="sls0217-sheet__meta-k">조회일시</span><span>${esc(meta.searchAtText)}</span></div>
        <div class="sls0217-sheet__meta-item"><span class="sls0217-sheet__meta-k">매장</span><span>${esc(meta.storeText)}</span></div>
      </div>`
    : "";

  const body = sectionsOnPage
    .map((sec) => {
      const cont = sec.continued
        ? `<span class="sls0217-sheet__cont">(계속)</span>`
        : "";
      return `<section class="sls0217-sheet__sec">
        <h3 class="sls0217-sheet__sec-title">${esc(sec.title)}${cont}</h3>
        <table class="sls0217-sheet__table">${theadHtml(sec.columns)}${tbodyHtml(
          sec.columns,
          sec.rows,
        )}</table>
      </section>`;
    })
    .join("");

  return `${header}${body}
    <div class="rp-page__footer" style="margin-top:8px;padding-top:4px;border-top:2px solid #94a3b8;font-size:12px;">
      <div>인쇄일자 · 인쇄시간</div><div>n / n</div>
    </div>`;
}

/**
 * @param {{
 *   periodText: string,
 *   searchAtText: string,
 *   storeText: string,
 *   timeRows: object[],
 *   salesRows: object[],
 *   menuRows: object[],
 *   cashRows: object[],
 *   cardRows: object[],
 *   cancelRows: object[],
 *   openCloseRows: object[],
 * }} data
 * @returns {object[]}
 */
export function loadDailySettlementPrintPages(data) {
  const meta = {
    periodText: data?.periodText || "",
    searchAtText: data?.searchAtText || "—",
    storeText: data?.storeText || "",
  };

  const rowMap = {
    time: Array.isArray(data?.timeRows) ? data.timeRows : [],
    sales: Array.isArray(data?.salesRows) ? data.salesRows : [],
    menu: Array.isArray(data?.menuRows) ? data.menuRows : [],
    cash: Array.isArray(data?.cashRows) ? data.cashRows : [],
    card: Array.isArray(data?.cardRows) ? data.cardRows : [],
    cancel: Array.isArray(data?.cancelRows) ? data.cancelRows : [],
    openclose: Array.isArray(data?.openCloseRows) ? data.openCloseRows : [],
  };

  /** 첫 행 키로 컬럼 keys 보정 — 후보에 없으면 Object.keys 순서로 매핑 */
  const resolveColumns = (def, rows) => {
    const sample = rows.find((r) => r && typeof r === "object");
    if (!sample) return def.columns;
    const sampleKeys = Object.keys(sample);
    return def.columns.map((col, idx) => {
      const hit = (col.keys || []).some((k) =>
        Object.prototype.hasOwnProperty.call(sample, k),
      );
      if (hit) return col;
      const fallback = sampleKeys[idx];
      if (!fallback) return col;
      return { ...col, keys: [fallback, ...(col.keys || [])] };
    });
  };

  const work = SECTION_DEFS.map((def) => {
    const rows = [...(rowMap[def.id] || [])];
    return {
      ...def,
      columns: resolveColumns(def, rows),
      rows,
      offset: 0,
    };
  });

  if (typeof document === "undefined") {
    return [
      {
        key: "sls0217-p1",
        voucherPage: 1,
        voucherPageCount: 1,
        isFirstPage: true,
        isLastPage: true,
        periodText: meta.periodText,
        searchAtText: meta.searchAtText,
        storeText: meta.storeText,
        sections: work.map((s) => ({
          id: s.id,
          title: s.title,
          columns: s.columns,
          rows: s.rows,
          continued: false,
        })),
      },
    ];
  }

  /* A4 297mm − @page 상하 − 바닥글 ≈ 본문 */
  const maxBodyPx = mmToPx(297 - 10 - 6 - 7);
  const pageWidthPx = mmToPx(210);

  const host = document.createElement("div");
  host.setAttribute("data-sls0217-measure", "1");
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
  styleEl.textContent = `${SLS0217_SHEET_CSS}
.sls0217-measure-wrap { box-sizing: border-box; width: 100%; padding: 2mm 3mm 0; }
`;
  host.appendChild(styleEl);
  document.body.appendChild(host);

  const measure = (sectionsOnPage, showDocHeader) => {
    const prev = host.querySelector(".sls0217-measure-wrap");
    if (prev) prev.remove();
    const wrap = document.createElement("div");
    wrap.className = "sls0217-measure-wrap sls0217-sheet";
    wrap.innerHTML = renderMeasureHtml(meta, sectionsOnPage, { showDocHeader });
    host.appendChild(wrap);
    return wrap.getBoundingClientRect().height;
  };

  /** @type {{ sections: object[], showDocHeader: boolean }[]} */
  const pageChunks = [];

  try {
    let pageSections = [];
    let showDocHeader = true;

    const flushPage = () => {
      if (!pageSections.length && !showDocHeader) return;
      pageChunks.push({
        sections: pageSections,
        showDocHeader,
      });
      pageSections = [];
      showDocHeader = false;
    };

    for (const sec of work) {
      const total = sec.rows.length;
      let offset = 0;
      let firstChunk = true;

      /* 빈 섹션도 제목+빈표 한 번은 출력 */
      if (total === 0) {
        const candidate = [
          ...pageSections,
          {
            id: sec.id,
            title: sec.title,
            columns: sec.columns,
            rows: [],
            continued: false,
          },
        ];
        const h = measure(candidate, showDocHeader);
        if (h > maxBodyPx && pageSections.length) {
          flushPage();
          pageSections = [
            {
              id: sec.id,
              title: sec.title,
              columns: sec.columns,
              rows: [],
              continued: false,
            },
          ];
        } else {
          pageSections = candidate;
        }
        continue;
      }

      while (offset < total) {
        let lo = offset + 1;
        let hi = total;
        let best = offset + 1;

        while (lo <= hi) {
          const mid = Math.floor((lo + hi) / 2);
          const slice = sec.rows.slice(offset, mid);
          const candidate = [
            ...pageSections,
            {
              id: sec.id,
              title: sec.title,
              columns: sec.columns,
              rows: slice,
              continued: !firstChunk,
            },
          ];
          const h = measure(candidate, showDocHeader);
          if (h <= maxBodyPx) {
            best = mid;
            lo = mid + 1;
          } else {
            hi = mid - 1;
          }
        }

        /* 현재 페이지에 한 행도 안 들어가면 페이지 넘김 */
        if (best <= offset) {
          if (pageSections.length || showDocHeader) {
            flushPage();
            continue;
          }
          best = offset + 1;
        }

        pageSections.push({
          id: sec.id,
          title: sec.title,
          columns: sec.columns,
          rows: sec.rows.slice(offset, best),
          continued: !firstChunk,
        });
        offset = best;
        firstChunk = false;

        /* 이 섹션이 아직 남았으면 다음 장으로 */
        if (offset < total) {
          flushPage();
        }
      }
    }

    if (pageSections.length || showDocHeader) {
      flushPage();
    }

    if (!pageChunks.length) {
      pageChunks.push({ sections: [], showDocHeader: true });
    }

    const voucherPageCount = pageChunks.length;
    return pageChunks.map((chunk, i) => {
      const voucherPage = i + 1;
      return {
        key: `sls0217-p${voucherPage}`,
        voucherPage,
        voucherPageCount,
        isFirstPage: voucherPage === 1,
        isLastPage: voucherPage === voucherPageCount,
        periodText: meta.periodText,
        searchAtText: meta.searchAtText,
        storeText: meta.storeText,
        showDocHeader: chunk.showDocHeader,
        sections: chunk.sections,
      };
    });
  } finally {
    host.remove();
  }
}
