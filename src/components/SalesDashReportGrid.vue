<template>
  <div class="sa-rg-host">
    <div ref="hostEl" class="sa-rg-inner"></div>
  </div>
</template>

<script setup>
import { GridView, LocalDataProvider } from "realgrid";
import { nextTick, onMounted, onUnmounted, ref, watch } from "vue";

const props = defineProps({
  /**
   * { fieldName, headerText, width?, bodyAlign?: 'near'|'center'|'far',
   *   fieldDataType?: 'text'|'number', numberFormat?: string, headerBg?, headerFg? }
   */
  columns: {
    type: Array,
    default: () => [],
  },
  /**
   * RealGrid `setColumnLayout` — 2단 헤더(그룹) 등. `salesAnalysisDashboardColumns` 의 COL_CUSTOMER_LAYOUT 참고.
   * 비우면 1단 헤더만 사용.
   */
  columnLayout: {
    type: Array,
    default: null,
  },
  rowData: {
    type: Array,
    default: () => [],
  },
  /** 엑셀 파일명·문서 제목 기본값 */
  exportLabel: {
    type: String,
    default: "",
  },
  /** 바디 행 높이(px). 주간 등 컴팩트용으로 28 등 */
  rowHeight: {
    type: Number,
    default: 30,
  },
  /** 0이면 자동. 주간 등에서 헤더 한 줄 높이 고정 */
  headerHeightPx: {
    type: Number,
    default: 0,
  },
  /** even | none — none 이면 세로로 빈 영역 채우며 늘어나는 느낌 완화 */
  fitStyle: {
    type: String,
    default: "even",
  },
  /**
   * 특정 필드 값이 목록과 일치하면 해당 데이터 행 전체를 강조 (예: 매장 매출 `store` = `합계`)
   * `{ field: 'store', values: ['합계'] }` — `values` 는 trim 후 문자열 일치
   */
  totalRowHighlight: {
    type: Object,
    default: null,
  },
});

const hostEl = ref(null);
let gridView = null;
let dataProvider = null;
let styleEl = null;
let resizeObserver = null;

function disconnectResizeObserver() {
  if (resizeObserver) {
    try {
      resizeObserver.disconnect();
    } catch (_) {
      void 0;
    }
    resizeObserver = null;
  }
}

function bodyAlignToCss(a) {
  if (a === "far" || a === "right") return "right";
  if (a === "near" || a === "left") return "left";
  return "center";
}

function bodyAlignToFlexJustify(a) {
  const css = bodyAlignToCss(a);
  if (css === "right") return "flex-end";
  if (css === "left") return "flex-start";
  return "center";
}

function destroyGrid() {
  disconnectResizeObserver();
  if (gridView) {
    try {
      gridView.destroy();
    } catch (_) {
      void 0;
    }
    gridView = null;
  }
  if (dataProvider) {
    try {
      dataProvider.destroy();
    } catch (_) {
      void 0;
    }
    dataProvider = null;
  }
  if (styleEl?.parentNode) {
    styleEl.parentNode.removeChild(styleEl);
    styleEl = null;
  }
}

function scheduleResize() {
  const run = () => {
    try {
      gridView?.resetSize?.();
    } catch (_) {
      void 0;
    }
  };
  requestAnimationFrame(run);
  setTimeout(run, 50);
  setTimeout(run, 200);
}

function buildGrid() {
  destroyGrid();
  const el = hostEl.value;
  if (!el || !props.columns?.length) return;

  const id = "g" + Math.random().toString(36).slice(2, 12);

  let css = "";
  const hasLayout = Array.isArray(props.columnLayout) && props.columnLayout.length > 0;
  const groupCount = hasLayout ? props.columnLayout.length : 0;

  const columnDefs = props.columns.map((c, i) => {
    const hCls = `sa_rpt_h_${id}_${i}`;
    const bCls = `sa_rpt_b_${id}_${i}`;
    const bg = c.headerBg || "#243d5c";
    const fg = c.headerFg || "#ffffff";
    const bodyAlign = bodyAlignToCss(c.bodyAlign ?? (i === 0 ? "near" : "far"));
    const flexJ = bodyAlignToFlexJustify(c.bodyAlign ?? (i === 0 ? "near" : "far"));
    const hdrRight =
      i === props.columns.length - 1
        ? "rgba(255,255,255,0.28)"
        : "rgba(255,255,255,0.62)";
    css += `.${hCls}{background-color:${bg}!important;color:${fg}!important;text-align:center!important;vertical-align:middle!important;font-weight:700!important;border-right:1px solid ${hdrRight}!important;border-bottom:1px solid rgba(255,255,255,0.38)!important;}\n`;
    css += `.${bCls}{vertical-align:middle!important;text-align:${bodyAlign}!important;border-right:1px solid #8a96a8!important;border-bottom:1px solid #b8c4d4!important;background:#f6f8fb!important;}\n`;
    css += `.${bCls}.rg-body-cell,.${bCls}.rg-data-cell{vertical-align:middle!important;text-align:${bodyAlign}!important;}\n`;
    css += `.${bCls} .rg-renderer{display:flex!important;align-items:center!important;justify-content:${flexJ}!important;box-sizing:border-box!important;min-height:100%!important;width:100%!important;text-align:inherit!important;}\n`;
    const col = {
      name: c.fieldName,
      fieldName: c.fieldName,
      width: c.width ?? 110,
      header: {
        text: c.headerText,
        styleName: hCls,
      },
      styleName: bCls,
    };
    if (c.numberFormat) {
      col.numberFormat = c.numberFormat;
    }
    // 2026-11-11 opt-in: tooltip(row) 함수가 있는 열만 마우스오버 시 사유 표시 (빈 문자열이면 표시 안 함)
    if (typeof c.tooltip === "function") {
      col.renderer = { type: "text", showTooltip: true };
    }
    // 2026-11-11 opt-in: signColor 열만 양수 빨강·음수 파랑 (옵션 없는 열은 기존과 동일)
    if (c.signColor === true) {
      const posCls = `sa_rpt_pos_${id}_${i}`;
      const negCls = `sa_rpt_neg_${id}_${i}`;
      css += `td.rg-data-cell.${posCls},td.rg-data-cell.${posCls} .rg-renderer{color:#dc2626!important;}\n`;
      css += `td.rg-data-cell.${negCls},td.rg-data-cell.${negCls} .rg-renderer{color:#2563eb!important;}\n`;
      col.styleCallback = (grid, dataCell) => {
        let v;
        try {
          v = Number(grid.getValue(dataCell.index.itemIndex, c.fieldName));
        } catch {
          return undefined;
        }
        if (!Number.isFinite(v) || v === 0) return undefined;
        return { styleName: `${bCls} ${v > 0 ? posCls : negCls}` };
      };
    }
    return col;
  });

  if (hasLayout) {
    for (let gi = 0; gi < groupCount; gi++) {
      const gCls = `sa_rpt_hg_${id}_${gi}`;
      const gHdrRight =
        gi === groupCount - 1
          ? "rgba(255,255,255,0.28)"
          : "rgba(255,255,255,0.62)";
      css += `.${gCls}{background-color:#243d5c!important;color:#ffffff!important;text-align:center!important;vertical-align:middle!important;font-weight:700!important;border-right:1px solid ${gHdrRight}!important;border-bottom:1px solid rgba(255,255,255,0.38)!important;}\n`;
    }
  }

  const th = props.totalRowHighlight;
  let totalRowCls = "";
  if (th && typeof th.field === "string" && Array.isArray(th.values) && th.values.length > 0) {
    totalRowCls = `sa_rpt_tot_${id}`;
    css += `tr.${totalRowCls} td.rg-data-cell{background:#fce9ea!important;font-weight:700!important;color:#5a1f24!important;}\n`;
    css += `tr.${totalRowCls} .rg-renderer{font-weight:700!important;color:#5a1f24!important;}\n`;
  }

  styleEl = document.createElement("style");
  styleEl.setAttribute("data-sa-rpt-grid", id);
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  dataProvider = new LocalDataProvider();
  dataProvider.setFields(
    props.columns.map((c) => ({
      fieldName: c.fieldName,
      dataType: c.fieldDataType === "number" ? "number" : "text",
    }))
  );

  gridView = new GridView(el);
  gridView.setDataSource(dataProvider);
  gridView.setColumns(columnDefs);

  if (hasLayout) {
    const layoutFixed = props.columnLayout.map((g, gi) => {
      if (typeof g === "string") return g;
      const gCls = `sa_rpt_hg_${id}_${gi}`;
      return {
        ...g,
        header: {
          visible: g.header?.visible !== false,
          text: g.header?.text ?? "",
          styleName: gCls,
        },
      };
    });
    gridView.setColumnLayout(layoutFixed);
  }

  gridView.setCheckBar({ visible: false });
  gridView.setRowIndicator({ visible: false });
  gridView.setStateBar({ visible: false });
  gridView.footer.visible = false;

  gridView.editOptions.readOnly = true;
  gridView.editOptions.editable = false;

  gridView.displayOptions.rowHeight = props.rowHeight;
  gridView.displayOptions.fitStyle = ["none", "even", "fill"].includes(props.fitStyle)
    ? props.fitStyle
    : "even";
  if (props.headerHeightPx > 0) {
    try {
      gridView.setHeader({
        height: props.headerHeightPx,
        minHeight: 22,
      });
    } catch (_) {
      void 0;
    }
  }
  // 2026-11-11 opt-in: tooltip 열이 있을 때만 등록 (없으면 기존과 동일)
  const tooltipCols = new Map(
    props.columns.filter((c) => typeof c.tooltip === "function").map((c) => [c.fieldName, c.tooltip])
  );
  if (tooltipCols.size) {
    gridView.displayOptions.showTooltip = true;
    gridView.displayOptions.showEmptyTooltip = true; // 빈칸에서도 사유 표시
    // 반환값이 없으면 RealGrid 가 tooltip 을 띄우지 않음 → tooltip 없는 열·값 있는 칸은 표시 안 함
    gridView.onShowTooltip = (grid, index) => {
      const key = index?.fieldName ?? index?.column?.fieldName ?? index?.column;
      const fn = tooltipCols.get(key);
      if (!fn) return undefined;
      try {
        const text = fn(grid.getValues(index.itemIndex) || {});
        return text ? String(text) : undefined;
      } catch {
        return undefined;
      }
    };
  }

  gridView.displayOptions.selectionStyle = "block";
  gridView.displayOptions.useAlternateRowStyle = true;

  if (totalRowCls && th) {
    const field = th.field;
    const vals = th.values.map((v) => (v != null ? String(v).trim() : ""));
    gridView.setRowStyleCallback((grid, item) => {
      if (item == null || typeof item.index !== "number") return undefined;
      let raw;
      try {
        raw = grid.getValue(item.index, field);
      } catch {
        return undefined;
      }
      const s = raw != null && raw !== "" ? String(raw).trim() : "";
      if (vals.includes(s)) return { styleName: totalRowCls };
      return undefined;
    });
  }

  const rows = Array.isArray(props.rowData) ? props.rowData.map((r) => ({ ...r })) : [];
  dataProvider.setRows(rows);

  scheduleResize();

  const hostWrap = hostEl.value?.parentElement;
  if (hostWrap && typeof ResizeObserver !== "undefined") {
    resizeObserver = new ResizeObserver(() => scheduleResize());
    resizeObserver.observe(hostWrap);
  }
}

onMounted(async () => {
  await nextTick();
  buildGrid();
});

watch(
  () => props.rowData,
  (rows) => {
    if (!dataProvider) return;
    const list = Array.isArray(rows) ? rows.map((r) => ({ ...r })) : [];
    dataProvider.setRows(list);
    try {
      gridView?.refresh?.(true);
    } catch (_) {
      void 0;
    }
    scheduleResize();
  },
  { deep: true }
);

onUnmounted(() => {
  destroyGrid();
});

function ensureDashExcelDocStyles() {
  const id = "sa-dash-xls-doc-styles";
  if (typeof document === "undefined") return;
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement("style");
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = `
.sa_dash_xls_title{
  font-family:'맑은 고딕','Malgun Gothic',sans-serif!important;
  font-size:18pt!important;
  font-weight:700!important;
  color:#1a3c70!important;
  text-align:left!important;
  vertical-align:middle!important;
  background-color:#edf1f7!important;
}
.sa_dash_xls_subtitle{
  font-family:'맑은 고딕','Malgun Gothic',sans-serif!important;
  font-size:10pt!important;
  font-weight:500!important;
  color:#2f4666!important;
  text-align:left!important;
  vertical-align:top!important;
  white-space:pre-line!important;
  background-color:#f7f9fc!important;
}
`.replace(/\s+/g, " ");
}

function exportToExcel(overrides = {}) {
  if (!gridView) return;
  ensureDashExcelDocStyles();
  const base = overrides.fileBase ?? props.exportLabel ?? "grid";
  const safe = String(base).replace(/[\\/:*?"<>|]/g, "_");
  const now = new Date();
  const stamp =
    overrides.fileStamp ??
    `${now.getFullYear()}${pad2(now.getMonth() + 1)}${pad2(now.getDate())}_${pad2(
      now.getHours()
    )}${pad2(now.getMinutes())}${pad2(now.getSeconds())}`;
  const rawName = overrides.fileName ?? `${safe}_${stamp}.xlsx`;
  const fileName = /\.xlsx$/i.test(rawName) ? rawName : `${rawName}.xlsx`;
  const bullet = "\u2022 ";
  const subtitle =
    overrides.subtitle ??
    `${bullet}조회일시: ${now.toLocaleString("ko-KR")}`;
  const titleStyleName =
    typeof overrides.titleStyleName === "string" && overrides.titleStyleName
      ? overrides.titleStyleName
      : "sa_dash_xls_title";
  const subtitleStyleName =
    typeof overrides.subtitleStyleName === "string" && overrides.subtitleStyleName
      ? overrides.subtitleStyleName
      : "sa_dash_xls_subtitle";
  try {
    gridView.exportGrid({
      type: "excel",
      target: "local",
      numberCallback(_index, _column, value) {
        return value === Infinity ? 0 : value;
      },
      fileName,
      showProgress: true,
      progressMessage: "엑셀 변환 중입니다.",
      indicator: true,
      header: true,
      footer: false,
      compatibility: true,
      lookupDisplay: true,
      applyDynamicStyles: true,
      documentTitle: {
        message: overrides.title ?? base,
        visible: true,
        spaceTop: 0,
        spaceBottom: 0,
        height: overrides.titleHeight ?? 44,
        styleName: titleStyleName,
      },
      documentSubtitle: {
        message: subtitle,
        visible: true,
        height: overrides.subtitleHeight ?? (String(subtitle).includes("\n") ? 72 : 40),
        styleName: subtitleStyleName,
      },
    });
  } catch (e) {
    console.error("[SalesDashReportGrid] exportToExcel", e);
  }
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

function resetLayout() {
  scheduleResize();
}

defineExpose({
  exportToExcel,
  resetLayout,
});
</script>

<style scoped>
.sa-rg-host {
  flex: 1 1 0;
  min-height: 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  /* 곡선은 .sa-card-body 한 곳에서만 — 중첩 radius+transform은 하단 잘림처럼 보이기 쉬움 */
}

.sa-rg-inner {
  flex: 1 1 0;
  min-height: 0;
  width: 100%;
}
</style>
