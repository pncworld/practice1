/**
 * 매출 분석 대시보드 — A4 본문 높이 측정 후 행 단위 페이지 분할
 * (일일 정산 레포트 / 발주서와 동일: 표 중간 끊김 방지)
 */
import { SA_DASH_SHEET_CSS } from "./saDashSheetStyles";

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

function fmtByCol(v, col) {
  if (v == null || v === "") return "";
  if (col.fieldDataType !== "number") return String(v);
  const n = Number(v);
  if (!Number.isFinite(n)) return String(v);
  const fmt = String(col.numberFormat || "#,##0");
  if (fmt.includes(".00")) {
    return n.toLocaleString("ko-KR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  if (fmt.includes(".0")) {
    return n.toLocaleString("ko-KR", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });
  }
  return n.toLocaleString("ko-KR");
}

function alignClass(col) {
  const a = col.bodyAlign;
  if (a === "far" || a === "right" || col.fieldDataType === "number") return "is-num";
  if (a === "near" || a === "left") return "is-left";
  return "is-center";
}

function theadHtml(columns) {
  return `<thead><tr>${columns
    .map((c) => `<th>${esc(c.headerText || c.fieldName)}</th>`)
    .join("")}</tr></thead>`;
}

function tbodyHtml(columns, rows, totalHighlight) {
  if (!rows.length) {
    return `<tbody><tr><td colspan="${columns.length}" class="is-center">자료 없음</td></tr></tbody>`;
  }
  return `<tbody>${rows
    .map((row) => {
      const isTotal =
        totalHighlight &&
        totalHighlight.field &&
        Array.isArray(totalHighlight.values) &&
        totalHighlight.values
          .map((x) => String(x).trim())
          .includes(String(row?.[totalHighlight.field] ?? "").trim());
      const tds = columns
        .map((c) => {
          const raw = row?.[c.fieldName];
          return `<td class="${alignClass(c)}">${esc(fmtByCol(raw, c))}</td>`;
        })
        .join("");
      return `<tr class="${isTotal ? "is-total" : ""}">${tds}</tr>`;
    })
    .join("")}</tbody>`;
}

function renderMeasureHtml(meta, sectionsOnPage, { showDocHeader }) {
  const header = showDocHeader
    ? `<div class="sa-dash-sheet__title-box"><h1 class="sa-dash-sheet__title">매출 분석</h1></div>
      <div class="sa-dash-sheet__meta">
        <div class="sa-dash-sheet__meta-item"><span class="sa-dash-sheet__meta-k">조회기간</span><span>${esc(meta.periodText)}</span></div>
        <div class="sa-dash-sheet__meta-item"><span class="sa-dash-sheet__meta-k">조회일시</span><span>${esc(meta.searchAtText)}</span></div>
      </div>`
    : "";

  const body = sectionsOnPage
    .map((sec) => {
      const cont = sec.continued
        ? `<span class="sa-dash-sheet__cont">(계속)</span>`
        : "";
      return `<section class="sa-dash-sheet__sec">
        <h3 class="sa-dash-sheet__sec-title">${esc(sec.title)}${cont}</h3>
        <table class="sa-dash-sheet__table">${theadHtml(sec.columns)}${tbodyHtml(
          sec.columns,
          sec.rows,
          sec.totalHighlight,
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
 *   sections: Array<{
 *     id: string,
 *     title: string,
 *     columns: Array<object>,
 *     rows: object[],
 *     totalHighlight?: { field: string, values: string[] } | null,
 *   }>,
 * }} data
 */
export function loadSalesAnalysisPrintPages(data) {
  const meta = {
    periodText: data?.periodText || "",
    searchAtText: data?.searchAtText || "—",
  };

  const work = (Array.isArray(data?.sections) ? data.sections : []).map((s) => ({
    id: s.id,
    title: s.title,
    columns: Array.isArray(s.columns) ? s.columns : [],
    rows: Array.isArray(s.rows) ? [...s.rows] : [],
    totalHighlight: s.totalHighlight || null,
  }));

  if (typeof document === "undefined") {
    return [
      {
        key: "sa-dash-p1",
        voucherPage: 1,
        voucherPageCount: 1,
        isFirstPage: true,
        isLastPage: true,
        periodText: meta.periodText,
        searchAtText: meta.searchAtText,
        showDocHeader: true,
        sections: work.map((s) => ({ ...s, continued: false })),
      },
    ];
  }

  const maxBodyPx = mmToPx(297 - 10 - 6 - 7);
  const pageWidthPx = mmToPx(210);

  const host = document.createElement("div");
  host.setAttribute("data-sa-dash-measure", "1");
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
  styleEl.textContent = `${SA_DASH_SHEET_CSS}
.sa-dash-measure-wrap { box-sizing: border-box; width: 100%; padding: 2mm 3mm 0; }
`;
  host.appendChild(styleEl);
  document.body.appendChild(host);

  const measure = (sectionsOnPage, showDocHeader) => {
    const prev = host.querySelector(".sa-dash-measure-wrap");
    if (prev) prev.remove();
    const wrap = document.createElement("div");
    wrap.className = "sa-dash-measure-wrap sa-dash-sheet";
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
      pageChunks.push({ sections: pageSections, showDocHeader });
      pageSections = [];
      showDocHeader = false;
    };

    for (const sec of work) {
      const total = sec.rows.length;
      let offset = 0;
      let firstChunk = true;

      if (total === 0) {
        const candidate = [
          ...pageSections,
          {
            id: sec.id,
            title: sec.title,
            columns: sec.columns,
            rows: [],
            continued: false,
            totalHighlight: sec.totalHighlight,
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
              totalHighlight: sec.totalHighlight,
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
              totalHighlight: sec.totalHighlight,
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
          totalHighlight: sec.totalHighlight,
        });
        offset = best;
        firstChunk = false;

        if (offset < total) flushPage();
      }
    }

    if (pageSections.length || showDocHeader) flushPage();
    if (!pageChunks.length) pageChunks.push({ sections: [], showDocHeader: true });

    const voucherPageCount = pageChunks.length;
    return pageChunks.map((chunk, i) => {
      const voucherPage = i + 1;
      return {
        key: `sa-dash-p${voucherPage}`,
        voucherPage,
        voucherPageCount,
        isFirstPage: voucherPage === 1,
        isLastPage: voucherPage === voucherPageCount,
        periodText: meta.periodText,
        searchAtText: meta.searchAtText,
        showDocHeader: chunk.showDocHeader,
        sections: chunk.sections,
      };
    });
  } finally {
    host.remove();
  }
}
