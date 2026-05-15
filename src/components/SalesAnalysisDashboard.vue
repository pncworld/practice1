<template>
  <div class="sa-root">
    <header class="sa-head">
      <div class="sa-head-leading">
        <h1 class="sa-title">매출 분석</h1>
        <span class="sa-period">{{ periodLabel }}</span>
      </div>
      <div class="sa-head-btns">
        <span v-if="queryDateTimeText" class="sa-query-at" aria-label="데이터 조회 일시">
          조회일시 : {{ queryDateTimeText }}
        </span>
        <button type="button" class="sa-hd-btn sa-hd-btn--ghost" @click="onRefresh">
          <img class="sa-hd-btn__ic sa-hd-btn__ic--refresh" :src="saIconRefresh" width="16" height="16" alt="" />
          새로고침
        </button>
        <button type="button" class="sa-hd-btn sa-hd-btn--primary" @click="onExcel">
          <img class="sa-hd-btn__ic" :src="saIconExcel" width="16" height="16" alt="" />
          엑셀변환
        </button>
        <span class="sa-hd-btn-wrap sa-hd-btn-wrap--tooltip-host">
          <button type="button" class="sa-hd-btn sa-hd-btn--outline" @click="onGoDetail">
            <img
              class="sa-hd-btn__ic sa-hd-btn__ic--detail"
              :src="saIconDetail"
              width="16"
              height="16"
              alt="" />
            상세페이지 이동
          </button>
          <span
            v-show="detailPrepTooltipVisible"
            role="status"
            class="sa-hd-prep-tooltip"
            aria-live="polite">
            준비 중입니다.
          </span>
        </span>
      </div>
    </header>

    <div class="sa-columns" aria-label="매출 분석 패널">
      <div class="sa-col-left">
        <div class="sa-left-stack">
          <section class="sa-card sa-area-weekly">
            <div class="sa-card-hd">
              <h2 class="sa-card-title">주간 핵심 지표</h2>
            </div>
            <div class="sa-card-body">
              <SalesDashReportGrid
                ref="gridWeekly"
                export-label="주간핵심지표"
                :columns="COL_WEEKLY"
                :row-data="weeklyKpi"
                :row-height="28" />
            </div>
          </section>

          <section class="sa-card sa-area-customer">
            <div class="sa-card-hd">
              <h2 class="sa-card-title">객수 / 객단가</h2>
            </div>
            <div class="sa-card-body">
              <SalesDashReportGrid
                ref="gridCustomer"
                export-label="객수_객단가"
                :columns="COL_CUSTOMER"
                :column-layout="COL_CUSTOMER_LAYOUT"
                :row-data="customerRows"
                :total-row-highlight="STORE_SALES_TOTAL_ROW_HIGHLIGHT" />
            </div>
          </section>
        </div>

        <section class="sa-card sa-area-material">
          <div class="sa-card-hd">
            <h2 class="sa-card-title">재료비</h2>
          </div>
          <div class="sa-card-body">
            <SalesDashReportGrid
              ref="gridMaterial"
              export-label="재료비"
              :columns="COL_MATERIAL"
              :row-data="costMaterialRows"
              :total-row-highlight="STORE_SALES_TOTAL_ROW_HIGHLIGHT" />
          </div>
        </section>
      </div>

      <section class="sa-card sa-area-store">
        <div class="sa-card-hd">
          <h2 class="sa-card-title">매장 매출</h2>
          <button type="button" class="sa-hd-btn sa-hd-btn--outline" @click="onGoSalesGoalRegister">
            <img
              class="sa-hd-btn__ic sa-hd-btn__ic--detail"
              :src="saIconDetail"
              width="16"
              height="16"
              alt="" />
            매출목표 등록
          </button>
        </div>
        <div class="sa-card-body">
          <SalesDashReportGrid
            ref="gridStore"
            export-label="매장매출"
            :columns="COL_STORE_SALES"
            :row-data="storeSalesRows"
            :total-row-highlight="STORE_SALES_TOTAL_ROW_HIGHLIGHT" />
        </div>
      </section>

      <section class="sa-card sa-area-labor">
        <div class="sa-card-hd">
          <h2 class="sa-card-title">인건비</h2>
        </div>
        <div class="sa-card-body">
          <SalesDashReportGrid
            ref="gridLabor"
            export-label="인건비"
            :columns="COL_LABOR"
            :row-data="laborRows" />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import SalesDashReportGrid from "@/components/SalesDashReportGrid.vue";
import {
  getCustomerAndUnitPriceByStore,
  getLaborCostByStore,
  getMaterialCostByStore,
  getStoreSalesByStore,
  getWeeklyKeyIndicators,
} from "@/api/common";
import { USER_ADMIN_ID_SUPPLIER_ACCOUNT } from "@/constants/sessionUser";
import {
  SALES_ANALYSIS_DASHBOARD_API,
  SALES_GOAL_REGISTRATION_TAB,
} from "@/constants/salesAnalysisDashboardApi.js";
import {
  COL_CUSTOMER,
  COL_CUSTOMER_LAYOUT,
  COL_LABOR,
  COL_MATERIAL,
  COL_STORE_SALES,
  COL_WEEKLY,
} from "@/constants/salesAnalysisDashboardColumns.js";
import saIconDetail from "@/assets/images/ic_move.svg";
import saIconExcel from "@/assets/excel_icon.svg";
import saIconRefresh from "@/assets/ic_refresh.svg";
import { utils, writeFile } from "xlsx-js-style";
import { computed, nextTick, onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const emit = defineEmits(["refresh"]);
const store = useStore();
const router = useRouter();

/** `store` = `합계` 행 강조 — 매장 매출·객수/객단가 공통 */
const STORE_SALES_TOTAL_ROW_HIGHLIGHT = Object.freeze({
  field: "store",
  values: ["합계"],
});

/** 표시 기간 문자열을 다시 그릴 때마다 증가 (한국 당일 기준 재계산) */
const periodRefreshKey = ref(0);
/** API 조회 완료 시점(Asia/Seoul `yyyy-mm-dd HH:mm`) — 미조회·스킵 시 빈 문자열 */
const queryDateTimeText = ref("");

/** 상세페이지 이동 — 일시 비활성, 클릭 시 툴팁만 표시 */
let detailPrepTooltipTimer = null;
const detailPrepTooltipVisible = ref(false);

const weeklyKpi = ref([]);
const customerRows = ref([]);
const storeSalesRows = ref([]);
const costMaterialRows = ref([]);
const laborRows = ref([]);

/**
 * Asia/Seoul 기준 연·월·일 (조회 시점 = 브라우저 시계가 아닌 한국 달력)
 * @param {Date} [d]
 * @returns {{ y: number; m: number; d: number }}
 */
function getSeoulYmd(d = new Date()) {
  const s = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
  const [y, mo, da] = s.split("-").map((v) => parseInt(v, 10));
  return { y, m: mo, d: da };
}

/** Asia/Seoul 당월 1일 ~ 당일, `yyyy-mm-dd` (FROM_DT / TO_DT) */
function getSeoulMonthFromToYmdHyphen() {
  const s = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  const [y, mo, da] = s.split("-");
  return {
    FROM_DT: `${y}-${mo}-01`,
    TO_DT: `${y}-${mo}-${da}`,
  };
}

/** Asia/Seoul 기준 조회 완료 일시 `yyyy-mm-dd HH:mm` */
function formatSalesDashQueryAtSeoul(d = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(d);
  const get = (/** @type {Intl.DateTimeFormatPartTypes} */ t) =>
    parts.find((p) => p.type === t)?.value ?? "";
  const y = get("year");
  const mo = get("month");
  const da = get("day");
  const h = get("hour");
  const mi = get("minute");
  if (!y) return "";
  return `${y}-${mo}-${da} ${h}:${mi}`;
}

/**
 * 본사(STORE_CD 0) 여부 — 세션 필드 조합으로 판별
 * 1) `lngSubLease === "0"`: 직영/본사(기존 MainDashBoard·getYesterdayClose 와 동일)
 * 2) `lngUserAdminID === lngStoreGroup`: 그룹관리자(홈 대시보드에서 그룹=관리자일 때 별도 분기와 동일 맥락) → 그룹 단위 조회로 STORE_CD 0
 * @param {Record<string, unknown>} u userData
 */
function isHeadOfficeForSalesDashStoreCd(u) {
  if (!u || typeof u !== "object" || Array.isArray(u)) return false;
  if (String(u.lngSubLease ?? "") === "0") return true;
  const admin = u.lngUserAdminID;
  const grp = u.lngStoreGroup;
  if (admin === undefined || admin === null || grp === undefined || grp === null) {
    return false;
  }
  return String(admin) === String(grp);
}

/**
 * dash API 미호출·공 그리드:
 * - `lngStoreGroup === lngUserAdminID`(그룹관리자)
 * - `lngUserAdminID === 60`(공급사)
 * (`SALES_ANALYSIS_HOME_TEMP_BYPASS_RULES` 는 홈에 카드 노출용이며 API 예외가 아님.)
 * @param {Record<string, unknown>} u userData
 */
function shouldSkipSalesAnalysisDashApis(u) {
  if (!u || typeof u !== "object" || Array.isArray(u)) return true;
  const admin = u.lngUserAdminID;
  const grp = u.lngStoreGroup;
  if (admin !== undefined && admin !== null && grp !== undefined && grp !== null) {
    if (String(admin) === String(grp)) return true;
  }
  const n = Number(u.lngUserAdminID);
  if (!Number.isFinite(n) || n !== USER_ADMIN_ID_SUPPLIER_ACCOUNT) return false;
  return true;
}

/**
 * STORE_CD: 본사면 0, 아니면 소속 매장(포지션)
 * @param {Record<string, unknown>} u userData
 */
function resolveSalesDashStoreCd(u) {
  if (!u || typeof u !== "object" || Array.isArray(u)) return 0;
  if (isHeadOfficeForSalesDashStoreCd(u)) return 0;
  return u.lngPosition ?? 0;
}

function readDashList(res) {
  let d = res?.data;
  /* ASMX ScriptService 등 `{"d": "{...}"}` / 문자열 JSON 대비 */
  if (d && typeof d === "object" && "d" in d && d.d != null) {
    const inner = d.d;
    if (typeof inner === "string") {
      try {
        d = JSON.parse(inner);
      } catch {
        return [];
      }
    } else if (typeof inner === "object") {
      d = inner;
    }
  }
  if (typeof d === "string") {
    try {
      d = JSON.parse(d);
    } catch {
      return [];
    }
  }
  if (!d || typeof d !== "object") return [];
  const list = d.List ?? d.list;
  return Array.isArray(list) ? list : [];
}

function pickRow(r, keys) {
  for (const k of keys) {
    if (r[k] !== undefined && r[k] !== null && r[k] !== "") return r[k];
  }
  return undefined;
}

/** 금액·건수 등 정수 표시용 — 빈 값은 0 */
function parseDashAmount(v) {
  if (v === undefined || v === null || v === "") return 0;
  if (typeof v === "number") return Number.isFinite(v) ? v : 0;
  const s = String(v).replace(/,/g, "").trim();
  if (s === "") return 0;
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}

/** 달성률·전주·전년 등 — 빈 값은 null (셀 비움) */
function parseDashRate(v) {
  if (v === undefined || v === null || v === "") return null;
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  const s = String(v).replace(/,/g, "").replace(/%/g, "").trim();
  if (s === "") return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

/** 주간 핵심 지표 행 */
function mapWeeklyDashRow(r) {
  if (!r || typeof r !== "object") {
    return { label: "", target: 0, actual: 0, rate: 0, wow: null, yoy: null };
  }
  return {
    label: String(pickRow(r, ["label", "LABEL", "GUBUN", "STR_NAME", "DIV_NM"]) ?? ""),
    target: parseDashAmount(pickRow(r, ["target", "TARGET", "GOAL", "GOAL_AMT"])),
    actual: parseDashAmount(pickRow(r, ["actual", "ACTUAL", "SALES", "TOT_AMT"])),
    rate: parseDashRate(pickRow(r, ["rate", "RATE", "ACH_RATE"])) ?? 0,
    wow: parseDashRate(pickRow(r, ["wow", "WOW", "WOW_RATE"])),
    yoy: parseDashRate(pickRow(r, ["yoy", "YOY", "YOY_RATE"])),
  };
}

/** 매장 매출 / 재료비 / 인건비 공통 행 */
function mapStoreMetricDashRow(r) {
  if (!r || typeof r !== "object") {
    return { store: "", target: 0, actual: 0, rate: 0, wow: null, yoy: null };
  }
  return {
    store: String(pickRow(r, ["store", "STORE_NM", "STR_STORE_NM", "STORE"]) ?? ""),
    target: parseDashAmount(pickRow(r, ["target", "TARGET", "GOAL"])),
    actual: parseDashAmount(pickRow(r, ["actual", "ACTUAL", "AMT", "COST", "TOT_AMT"])),
    rate: parseDashRate(pickRow(r, ["rate", "RATE"])) ?? 0,
    wow: parseDashRate(pickRow(r, ["wow", "WOW", "WOW_RATE"])),
    yoy: parseDashRate(pickRow(r, ["yoy", "YOY", "YOY_RATE"])),
  };
}

/** 객수/객단가 — 그리드 fieldName */
function mapCustomerDashRow(r) {
  if (!r || typeof r !== "object") {
    return {
      store: "",
      custCount: 0,
      custWow: null,
      custYoy: null,
      price: 0,
      priceWow: null,
      priceYoy: null,
    };
  }
  return {
    store: String(pickRow(r, ["store", "STORE_NM", "STR_STORE_NM", "STORE"]) ?? ""),
    custCount: parseDashAmount(
      pickRow(r, ["custCount", "CUST_COUNT", "CUST_CNT", "CUSTOMER_CNT"])
    ),
    custWow: parseDashRate(pickRow(r, ["custWow", "CUST_WOW", "CUST_WOW_RATE"])),
    custYoy: parseDashRate(pickRow(r, ["custYoy", "CUST_YOY", "CUST_YOY_RATE"])),
    price: parseDashAmount(pickRow(r, ["price", "UNIT_PRICE", "PRICE", "CUST_PRICE"])),
    priceWow: parseDashRate(pickRow(r, ["priceWow", "PRICE_WOW", "UNIT_WOW"])),
    priceYoy: parseDashRate(pickRow(r, ["priceYoy", "PRICE_YOY", "UNIT_YOY"])),
  };
}

function clearSalesAnalysisDashboardRows() {
  weeklyKpi.value = [];
  customerRows.value = [];
  storeSalesRows.value = [];
  costMaterialRows.value = [];
  laborRows.value = [];
}

async function loadSalesAnalysisDashboardData() {
  const u = store.state.userData;
  if (!u || typeof u !== "object" || Array.isArray(u)) {
    clearSalesAnalysisDashboardRows();
    queryDateTimeText.value = "";
    return;
  }
  if (shouldSkipSalesAnalysisDashApis(u)) {
    clearSalesAnalysisDashboardRows();
    queryDateTimeText.value = "";
    return;
  }
  const { FROM_DT, TO_DT } = getSeoulMonthFromToYmdHyphen();
  const groupCd = u.lngStoreGroup;
  const storeCd = resolveSalesDashStoreCd(u);
  const sequence = u.lngSequence;
  try {
    store.state.loading = true;
    const [rw, rc, rs, rm, rl] = await Promise.allSettled([
      getWeeklyKeyIndicators(groupCd, storeCd, sequence, FROM_DT, TO_DT),
      getCustomerAndUnitPriceByStore(groupCd, storeCd, sequence, FROM_DT, TO_DT),
      getStoreSalesByStore(groupCd, storeCd, sequence, FROM_DT, TO_DT),
      getMaterialCostByStore(groupCd, storeCd, sequence, FROM_DT, TO_DT),
      getLaborCostByStore(groupCd, storeCd, sequence, FROM_DT, TO_DT),
    ]);
    weeklyKpi.value =
      rw.status === "fulfilled" && Array.isArray(readDashList(rw.value))
        ? readDashList(rw.value).map((row) => mapWeeklyDashRow(row))
        : [];
    customerRows.value =
      rc.status === "fulfilled" && Array.isArray(readDashList(rc.value))
        ? readDashList(rc.value).map((row) => mapCustomerDashRow(row))
        : [];
    storeSalesRows.value =
      rs.status === "fulfilled" && Array.isArray(readDashList(rs.value))
        ? readDashList(rs.value).map((row) => mapStoreMetricDashRow(row))
        : [];
    costMaterialRows.value =
      rm.status === "fulfilled" && Array.isArray(readDashList(rm.value))
        ? readDashList(rm.value).map((row) => mapStoreMetricDashRow(row))
        : [];
    laborRows.value =
      rl.status === "fulfilled" && Array.isArray(readDashList(rl.value))
        ? readDashList(rl.value).map((row) => mapStoreMetricDashRow(row))
        : [];
  } catch {
    clearSalesAnalysisDashboardRows();
  } finally {
    store.state.loading = false;
    queryDateTimeText.value = formatSalesDashQueryAtSeoul(new Date());
  }
}

const gridWeekly = ref(null);
const gridCustomer = ref(null);
const gridMaterial = ref(null);
const gridStore = ref(null);
const gridLabor = ref(null);

const gridRefs = [gridWeekly, gridCustomer, gridMaterial, gridStore, gridLabor];

function resetAllGridLayouts() {
  nextTick(() => {
    for (const r of gridRefs) {
      r.value?.resetLayout?.();
    }
  });
}

/** 리사이즈·브레이크포인트 전환 후 레이아웃이 잡힌 뒤 RealGrid 크기 재계산 (겹침·가로스크롤 완화) */
let saDashResizeTimer = null;
function scheduleDashGridReflow() {
  if (saDashResizeTimer) clearTimeout(saDashResizeTimer);
  saDashResizeTimer = setTimeout(() => {
    saDashResizeTimer = null;
    nextTick(() => {
      requestAnimationFrame(() => {
        resetAllGridLayouts();
      });
    });
  }, 120);
}

/** `@media (max-width: 1280px)` 과 동일 — `display: contents` 전환 시 그리드 깨짐 방지 */
const SA_DASH_COL_MQ = "(max-width: 1280px)";
let saDashMq = null;

function onRefresh() {
  periodRefreshKey.value += 1;
  void loadSalesAnalysisDashboardData().finally(() => {
    emit("refresh");
    resetAllGridLayouts();
  });
}

/** 엑셀 상단 메타 줄 접두 — 별 대신 불릿(보고서 톤) */
const SA_EXCEL_META_BULLET = "\u2022 ";

/** 엑셀 셀 테두리 (데이터·헤더용 연한 회색) */
const SA_EXCEL_BORDER = {
  top: { style: "thin", color: { rgb: "FFB4B4B4" } },
  bottom: { style: "thin", color: { rgb: "FFB4B4B4" } },
  left: { style: "thin", color: { rgb: "FFB4B4B4" } },
  right: { style: "thin", color: { rgb: "FFB4B4B4" } },
};

/** 상단 배너 기본 격자선(프레임 덮어쓰기 전) */
const SA_EXCEL_BORDER_BANNER_BASE = {
  top: { style: "thin", color: { rgb: "FFB4B4B4" } },
  bottom: { style: "thin", color: { rgb: "FFB4B4B4" } },
  left: { style: "thin", color: { rgb: "FFB4B4B4" } },
  right: { style: "thin", color: { rgb: "FFB4B4B4" } },
};

/** 각 표(구역 제목~데이터) 바깥 둘레만 — 내부 격자는 연한선 유지 */
const SA_EXCEL_BORDER_BLOCK_OUTLINE = { style: "medium", color: { rgb: "FF000000" } };

/**
 * 한 시트에 표를 위에서 아래로 이어 붙임 (제목·헤더·데이터 + 빈 행)
 * @param {import("xlsx-js-style").WorkSheet} ws
 * @param {number} row1 1-based 시작 행
 * @param {string} sectionTitle
 * @param {{ fieldName: string; headerText: string; fieldDataType?: string; numberFormat?: string }[]} columns
 * @param {Record<string, unknown>[]} rows
 * @param {number} maxCols 가로 폭 맞춤
 */
function appendDashExcelSection(ws, row1, sectionTitle, columns, rows, maxCols) {
  const pad = (/** @type {unknown[]} */ arr) => {
    const x = arr.slice();
    while (x.length < maxCols) x.push("");
    return x;
  };
  const sectionTitleRow = row1;
  utils.sheet_add_aoa(ws, [pad([sectionTitle])], {
    origin: utils.encode_cell({ r: row1 - 1, c: 0 }),
  });
  let r = row1 + 1;
  const headerRow = r;
  utils.sheet_add_aoa(ws, [pad(columns.map((c) => c.headerText))], {
    origin: utils.encode_cell({ r: r - 1, c: 0 }),
  });
  r += 1;
  const safeRows = Array.isArray(rows) ? rows : [];
  const fields = columns.map((c) => c.fieldName);
  const aoa = safeRows.map((row) =>
    pad(
      fields.map((f) => {
        const v = row[f];
        if (v === null || v === undefined || v === "") return "";
        if (typeof v === "number" && Number.isFinite(v)) return v;
        return String(v);
      })
    )
  );
  const dataStart = r;
  let dataEnd = 0;
  if (aoa.length) {
    utils.sheet_add_aoa(ws, aoa, { origin: utils.encode_cell({ r: r - 1, c: 0 }) });
    dataEnd = r + aoa.length - 1;
    r += aoa.length;
  }
  utils.sheet_add_aoa(ws, [pad([""])], { origin: utils.encode_cell({ r: r - 1, c: 0 }) });
  r += 1;
  return {
    nextRow: r,
    sectionTitleRow,
    headerRow,
    dataStart: aoa.length ? dataStart : 0,
    dataEnd: aoa.length ? dataEnd : 0,
    columns,
    colCount: columns.length,
  };
}

function ensureDashExcelCell(ws, r0, c0) {
  const addr = utils.encode_cell({ r: r0, c: c0 });
  if (!ws[addr]) ws[addr] = { t: "s", v: "" };
  return addr;
}

/** @param {import("xlsx-js-style").CellStyle} style */
function paintDashExcelRect(ws, r1, c1, r2, c2, style) {
  for (let r = r1; r <= r2; r++) {
    for (let c = c1; c <= c2; c++) {
      const addr = ensureDashExcelCell(ws, r - 1, c - 1);
      ws[addr].s = style;
    }
  }
}

/**
 * 구역 제목 행 ~ 데이터 마지막까지, 열 1..cc 범위의 **바깥쪽**만 검정 medium 테두리
 * @param {import("xlsx-js-style").WorkSheet} ws
 */
function paintDashExcelBlockOuterOutline(ws, block, cc) {
  const r1 = block.sectionTitleRow;
  let r2 = block.headerRow;
  if (block.dataStart > 0 && block.dataEnd >= block.dataStart) {
    r2 = block.dataEnd;
  }
  const edge = SA_EXCEL_BORDER_BLOCK_OUTLINE;
  for (let r = r1; r <= r2; r++) {
    for (let c = 1; c <= cc; c++) {
      const addr = utils.encode_cell({ r: r - 1, c: c - 1 });
      const cell = ws[addr];
      if (!cell) continue;
      const s = cell.s && typeof cell.s === "object" ? { ...cell.s } : {};
      const prevB =
        s.border && typeof s.border === "object" ? { ...s.border } : { ...SA_EXCEL_BORDER };
      s.border = {
        ...prevB,
        top: r === r1 ? edge : prevB.top,
        bottom: r === r2 ? edge : prevB.bottom,
        left: c === 1 ? edge : prevB.left,
        right: c === cc ? edge : prevB.right,
      };
      cell.s = s;
    }
  }
}

/**
 * 상단 타이틀 행 — 검정 thick 외곽 + 좌/우 구간 사이 검정 thin 세로선
 * @param {import("xlsx-js-style").WorkSheet} ws
 */
function paintExcelBannerFrame(ws, bannerRow, maxCols, leftCols) {
  const thick = { style: "thick", color: { rgb: "FF000000" } };
  const thinG = SA_EXCEL_BORDER.top;
  const thinBlk = { style: "thin", color: { rgb: "FF000000" } };
  for (let c = 1; c <= maxCols; c++) {
    const addr = utils.encode_cell({ r: bannerRow - 1, c: c - 1 });
    const cell = ws[addr];
    if (!cell?.s) continue;
    const prev = cell.s.border && typeof cell.s.border === "object" ? { ...cell.s.border } : {};
    const left = c === 1 ? thick : c === leftCols + 1 ? thinBlk : thinG;
    const right = c === maxCols ? thick : c === leftCols ? thinBlk : thinG;
    cell.s = {
      ...cell.s,
      border: {
        ...prev,
        top: thick,
        bottom: thick,
        left,
        right,
      },
    };
  }
}

/**
 * 엑셀용 합계 행 판별 — RealGrid `totalRowHighlight` 와 동일 규칙(trim 후 문자열 일치)
 * @param {Record<string, unknown>} row
 * @param {{ field: string; values: string[] } | null | undefined} highlight
 */
function dashExcelRowMatchesTotalHighlight(row, highlight) {
  if (!highlight || !row || typeof row !== "object" || Array.isArray(row)) return false;
  const field = highlight.field;
  if (!field || typeof field !== "string") return false;
  const raw = row[field];
  if (raw === undefined || raw === null) return false;
  const s = String(raw).trim();
  const vals = highlight.values;
  if (!Array.isArray(vals)) return false;
  return vals.some((v) => String(v).trim() === s);
}

/** @param {import("xlsx-js-style").WorkSheet} ws */
function applySalesDashExcelStyles(ws, layout) {
  const { maxCols, bannerRow, leftCols, blocks } = layout;

  const bannerLeftStyle = {
    font: { name: "맑은 고딕", sz: 16, bold: true, color: { rgb: "FFFFFFFF" } },
    fill: { patternType: "solid", fgColor: { rgb: "FF243D5C" } },
    alignment: { horizontal: "center", vertical: "center", wrapText: true },
    border: SA_EXCEL_BORDER_BANNER_BASE,
  };
  const bannerRightStyle = {
    font: { name: "맑은 고딕", sz: 11, bold: false, color: { rgb: "FF1A2847" } },
    fill: { patternType: "solid", fgColor: { rgb: "FFEDF1F7" } },
    alignment: { horizontal: "left", vertical: "center", wrapText: true },
    border: SA_EXCEL_BORDER_BANNER_BASE,
  };

  paintDashExcelRect(ws, bannerRow, 1, bannerRow, leftCols, bannerLeftStyle);
  paintDashExcelRect(ws, bannerRow, leftCols + 1, bannerRow, maxCols, bannerRightStyle);
  paintExcelBannerFrame(ws, bannerRow, maxCols, leftCols);

  const sectionTitleStyle = {
    font: { name: "맑은 고딕", sz: 12, bold: true, color: { rgb: "FF1A3C70" } },
    fill: { patternType: "solid", fgColor: { rgb: "FFD4DCF0" } },
    alignment: { horizontal: "center", vertical: "center", wrapText: true },
    border: SA_EXCEL_BORDER,
  };
  const headerStyle = {
    font: { name: "맑은 고딕", sz: 11, bold: true, color: { rgb: "FFFFFFFF" } },
    fill: { patternType: "solid", fgColor: { rgb: "FF243D5C" } },
    alignment: { horizontal: "center", vertical: "center", wrapText: true },
    border: SA_EXCEL_BORDER,
  };
  const dataBase = {
    font: { name: "맑은 고딕", sz: 11, color: { rgb: "FF000000" } },
    fill: { patternType: "solid", fgColor: { rgb: "FFFFFFFF" } },
    border: SA_EXCEL_BORDER,
    alignment: { vertical: "center", wrapText: true },
  };
  /** 그리드 합계 행(`SalesDashReportGrid` totalRowHighlight)과 동일 톤 */
  const dataTotalRowBase = {
    font: { name: "맑은 고딕", sz: 11, bold: true, color: { rgb: "FF5A1F24" } },
    fill: { patternType: "solid", fgColor: { rgb: "FFFCE9EA" } },
    border: SA_EXCEL_BORDER,
    alignment: { vertical: "center", wrapText: true },
  };

  for (const b of blocks) {
    const cc = b.colCount ?? b.columns?.length ?? maxCols;
    paintDashExcelRect(ws, b.sectionTitleRow, 1, b.sectionTitleRow, cc, sectionTitleStyle);
    paintDashExcelRect(ws, b.headerRow, 1, b.headerRow, cc, headerStyle);
    if (b.dataStart > 0 && b.dataEnd >= b.dataStart) {
      const totalSet = new Set(
        Array.isArray(b.totalSheetRows) ? b.totalSheetRows.map((n) => Number(n)) : []
      );
      for (let r = b.dataStart; r <= b.dataEnd; r++) {
        const isTotal = totalSet.has(r);
        for (let c = 1; c <= cc; c++) {
          const addr = utils.encode_cell({ r: r - 1, c: c - 1 });
          const cell = ws[addr];
          if (!cell) continue;
          const colDef = b.columns[c - 1];
          const isNumberCol = colDef?.fieldDataType === "number";
          const hz = isNumberCol ? "right" : "left";
          const base = isTotal ? dataTotalRowBase : dataBase;
          cell.s = {
            ...base,
            alignment: { ...base.alignment, horizontal: hz },
          };
          if (cell.t === "n" && isNumberCol) {
            cell.z = colDef?.numberFormat?.includes(".") ? "#,##0.00" : "#,##0";
          }
        }
      }
    }
  }

  for (const b of blocks) {
    const cc = b.colCount ?? b.columns?.length ?? maxCols;
    paintDashExcelBlockOuterOutline(ws, b, cc);
  }

  if (!ws["!rows"]) ws["!rows"] = [];
  ws["!rows"][bannerRow - 1] = { hpt: 54, customHeight: true };
  for (const b of blocks) {
    if (b.sectionTitleRow > 0) {
      ws["!rows"][b.sectionTitleRow - 1] = { hpt: 26, customHeight: true };
    }
    if (b.headerRow > 0) {
      ws["!rows"][b.headerRow - 1] = { hpt: 24, customHeight: true };
    }
    if (b.dataStart > 0 && b.dataEnd >= b.dataStart) {
      for (let rr = b.dataStart; rr <= b.dataEnd; rr++) {
        ws["!rows"][rr - 1] = { hpt: 20, customHeight: true };
      }
    }
  }
}

/**
 * RealGrid 컬럼 `width`(px)를 열 인덱스별 최대로 묶어 엑셀 열 폭(`!cols`) 생성 — 화면 표와 비율 맞춤
 * @param {number} maxCols
 * @returns {import("xlsx-js-style").ColInfo[]}
 */
function buildSalesDashExcelCols(maxCols) {
  const defs = [COL_WEEKLY, COL_STORE_SALES, COL_CUSTOMER, COL_MATERIAL, COL_LABOR];
  /** @type {import("xlsx-js-style").ColInfo[]} */
  const cols = [];
  for (let i = 0; i < maxCols; i++) {
    let px = 64;
    for (const arr of defs) {
      const d = arr[i];
      if (d && typeof d.width === "number") px = Math.max(px, d.width);
    }
    const wch = Math.min(40, Math.max(9, Math.round(px / 5) + 1));
    cols.push({ wch });
  }
  return cols;
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

function onExcel() {
  try {
    const wb = utils.book_new();
    const ws = utils.aoa_to_sheet([]);
    const maxCols = Math.max(
      COL_WEEKLY.length,
      COL_CUSTOMER.length,
      COL_MATERIAL.length,
      COL_STORE_SALES.length,
      COL_LABOR.length
    );
    const padTop = (/** @type {unknown[]} */ cells) => {
      const x = cells.slice();
      while (x.length < maxCols) x.push("");
      return x;
    };

    const { FROM_DT, TO_DT } = getSeoulMonthFromToYmdHyphen();
    const leftCols = Math.max(1, Math.floor(maxCols / 2));
    const bannerRow = 1;
    const topBanner = padTop([]);
    topBanner[0] = "매출 분석";
    const queriedAt =
      queryDateTimeText.value && String(queryDateTimeText.value).trim() !== ""
        ? String(queryDateTimeText.value).trim()
        : formatSalesDashQueryAtSeoul(new Date());
    topBanner[leftCols] =
      `${SA_EXCEL_META_BULLET}조회기간: ${periodLabel.value} (${FROM_DT}~${TO_DT})\n${SA_EXCEL_META_BULLET}조회일시: ${queriedAt}`;
    utils.sheet_add_aoa(ws, [topBanner], { origin: utils.encode_cell({ r: 0, c: 0 }) });

    let r = 2;
    utils.sheet_add_aoa(ws, [padTop([""])], { origin: utils.encode_cell({ r: r - 1, c: 0 }) });
    r += 1;

    const merges = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: leftCols - 1 } },
      { s: { r: 0, c: leftCols }, e: { r: 0, c: maxCols - 1 } },
    ];

    const blocks = [];
    /** @param {string} title @param {typeof COL_WEEKLY} cols @param {unknown[]} data @param {{ field: string; values: string[] } | null} [totalHighlight] */
    const pushSection = (title, cols, data, totalHighlight = null) => {
      const rows = Array.isArray(data) ? data : [];
      const b = appendDashExcelSection(ws, r, title, cols, rows, maxCols);
      r = b.nextRow;
      const colCount = b.colCount;
      merges.push({
        s: { r: b.sectionTitleRow - 1, c: 0 },
        e: { r: b.sectionTitleRow - 1, c: colCount - 1 },
      });
      const totalSheetRows = [];
      if (totalHighlight && b.dataStart > 0) {
        rows.forEach((row, idx) => {
          if (dashExcelRowMatchesTotalHighlight(/** @type {Record<string, unknown>} */ (row), totalHighlight)) {
            totalSheetRows.push(b.dataStart + idx);
          }
        });
      }
      blocks.push({
        sectionTitleRow: b.sectionTitleRow,
        headerRow: b.headerRow,
        dataStart: b.dataStart,
        dataEnd: b.dataEnd,
        columns: b.columns,
        colCount,
        totalSheetRows,
      });
    };
    const WEEKLY_TOTAL_HIGHLIGHT = Object.freeze({ field: "label", values: ["합계"] });
    pushSection("주간 핵심 지표", COL_WEEKLY, weeklyKpi.value, WEEKLY_TOTAL_HIGHLIGHT);
    pushSection("매장 매출", COL_STORE_SALES, storeSalesRows.value, STORE_SALES_TOTAL_ROW_HIGHLIGHT);
    pushSection("객수 / 객단가", COL_CUSTOMER, customerRows.value, STORE_SALES_TOTAL_ROW_HIGHLIGHT);
    pushSection("재료비", COL_MATERIAL, costMaterialRows.value, STORE_SALES_TOTAL_ROW_HIGHLIGHT);
    pushSection("인건비", COL_LABOR, laborRows.value, STORE_SALES_TOTAL_ROW_HIGHLIGHT);

    ws["!merges"] = merges;

    applySalesDashExcelStyles(ws, { maxCols, bannerRow, leftCols, blocks });

    ws["!cols"] = buildSalesDashExcelCols(maxCols);

    utils.book_append_sheet(wb, ws, "매출분석");
    const now = new Date();
    const fname = `매출분석_${now.getFullYear()}${pad2(now.getMonth() + 1)}${pad2(now.getDate())}_${pad2(
      now.getHours()
    )}${pad2(now.getMinutes())}${pad2(now.getSeconds())}.xlsx`;
    writeFile(wb, fname.replace(/[\\/:*?"<>|]/g, "_"));
  } catch (e) {
    console.error("[SalesAnalysisDashboard] onExcel", e);
    window.alert("엑셀 저장 중 오류가 발생했습니다.");
  }
}

function onGoDetail() {
  if (detailPrepTooltipTimer) clearTimeout(detailPrepTooltipTimer);
  detailPrepTooltipVisible.value = true;
  detailPrepTooltipTimer = setTimeout(() => {
    detailPrepTooltipVisible.value = false;
    detailPrepTooltipTimer = null;
  }, 2200);
}

function onGoSalesGoalRegister() {
  const t = SALES_GOAL_REGISTRATION_TAB;
  if (!t.strUrl) {
    window.alert("매출목표 등록 경로(strUrl)가 설정되지 않았습니다.");
    return;
  }
  const programId = Number(t.lngProgramID);
  if (Number.isFinite(programId) && programId > 0) {
    store.state.moveOtherTab = {
      strUrl: t.strUrl,
      lngProgramID: programId,
      strTitle: t.strTitle,
    };
    return;
  }
  void router.push({ path: "/MISALES/SLS01_001INS.xml" }).catch(() => {});
}

const periodLabel = computed(() => {
  periodRefreshKey.value;
  const { m, d } = getSeoulYmd();
  return `${m}/1 ~ ${m}/${d}`;
});

onMounted(() => {
  void loadSalesAnalysisDashboardData();
  if (typeof window === "undefined") return;
  window.addEventListener("resize", scheduleDashGridReflow, { passive: true });
  try {
    saDashMq = window.matchMedia(SA_DASH_COL_MQ);
    if (saDashMq.addEventListener) {
      saDashMq.addEventListener("change", scheduleDashGridReflow);
    } else if (saDashMq.addListener) {
      saDashMq.addListener(scheduleDashGridReflow);
    }
  } catch {
    void 0;
  }
});

onUnmounted(() => {
  if (typeof window === "undefined") return;
  window.removeEventListener("resize", scheduleDashGridReflow);
  if (saDashMq) {
    if (saDashMq.removeEventListener) {
      saDashMq.removeEventListener("change", scheduleDashGridReflow);
    } else if (saDashMq.removeListener) {
      saDashMq.removeListener(scheduleDashGridReflow);
    }
    saDashMq = null;
  }
  if (saDashResizeTimer) {
    clearTimeout(saDashResizeTimer);
    saDashResizeTimer = null;
  }
  if (detailPrepTooltipTimer) {
    clearTimeout(detailPrepTooltipTimer);
    detailPrepTooltipTimer = null;
  }
});

defineExpose({
  SALES_ANALYSIS_DASHBOARD_API,
  weeklyKpi,
  customerRows,
  storeSalesRows,
  costMaterialRows,
  laborRows,
  loadSalesAnalysisDashboardData,
  /** @deprecated 동일 동작 — `loadSalesAnalysisDashboardData` 사용 */
  loadCustomerAndUnitPriceByStore: loadSalesAnalysisDashboardData,
  refreshPeriodLabel() {
    periodRefreshKey.value += 1;
  },
});
</script>

<style scoped>
.sa-root {
  /* 넓은 해상도에서만 폭이 무한히 늘어나면 RealGrid 컬럼·행이 커져 노트북 대비 배율이 달라 보임 → 기준 폭 상한 후 가운데 정렬 */
  --sa-layout-max-width: 1520px;
  --sa-gap: 14px;
  --sa-row-min: 152px;
  --sa-head-gap: 14px;
  /* 제목「매출 분석」과 기간 배지 사이 */
  --sa-title-date-gap: 22px;
  /* 카드 소제목 영역과 그리드 사이 */
  --sa-card-hd-body-gap: 7px;
  /* 카드 제목줄(헤더) 공통 높이 — 매장 매출 등 우측 버튼 있어도 다른 카드와 동일 */
  --sa-card-hd-height: 45px;
  /* 주간: 행 28px — 데이터 행 4행(매출·객수·객단가·재료비) 기준 높이 */
  --sa-weekly-rg-row: 28px;
  --sa-weekly-rg-hdr: 26px;
  --sa-weekly-data-rows: 4;
  --sa-weekly-body-pad-bottom: 6px;
  --sa-weekly-grid-inner: calc(
    var(--sa-weekly-rg-hdr) + var(--sa-weekly-data-rows) * var(--sa-weekly-rg-row)
  );
  /* 참고: 주간 카드 높이(4행 기준). 레이아웃은 2:3 fr 로 분배 */
  --sa-weekly-band: calc(
    var(--sa-card-hd-height) + var(--sa-card-hd-body-gap) + var(--sa-weekly-grid-inner) +
      var(--sa-weekly-body-pad-bottom)
  );
  flex: 1 1 auto;
  align-self: center;
  width: min(100%, var(--sa-layout-max-width));
  min-width: 0;
  min-height: 0;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--sa-head-gap);
}

.sa-head {
  flex-shrink: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px 24px;
  padding-bottom: 4px;
  border-bottom: 2px solid var(--primary-deep, #1a3c70);
}

.sa-head-leading {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--sa-title-date-gap);
  min-width: 0;
}

.sa-head-btns {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 12px;
}

.sa-hd-btn-wrap--tooltip-host {
  position: relative;
  display: inline-flex;
  vertical-align: middle;
}

.sa-hd-prep-tooltip {
  position: absolute;
  left: 50%;
  top: calc(100% + 6px);
  transform: translateX(-50%);
  z-index: 30;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  color: var(--primary-deep, #1a3c70);
  background: #fff;
  border: 1px solid rgba(26, 60, 112, 0.28);
  border-radius: 6px;
  box-shadow: 0 4px 14px rgba(26, 60, 112, 0.15);
  pointer-events: none;
}

.sa-hd-btn {
  margin: 0;
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 600;
  border-radius: 5px;
  cursor: pointer;
  white-space: nowrap;
  line-height: 1.25;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.sa-hd-btn__ic {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  object-fit: contain;
  pointer-events: none;
}

.sa-hd-btn__ic--refresh {
  transform: scale(1.23);
  transform-origin: center;
}

.sa-hd-btn__ic--detail {
  transform: scale(0.81);
  transform-origin: center;
}

.sa-hd-btn--outline .sa-hd-btn__ic {
  opacity: 0.92;
}

.sa-hd-btn--primary {
  border: 1px solid #4a6fd8;
  background: #5782ff;
  color: #fff;
}

.sa-hd-btn--primary:hover {
  filter: brightness(1.05);
}

.sa-hd-btn--ghost {
  border: 1px solid #c5d0e6;
  background: #f4f7fc;
  color: var(--primary-deep, #1a3c70);
}

.sa-hd-btn--ghost:hover {
  background: #e8eef8;
}

.sa-hd-btn--outline {
  border: 1px solid #5782ff;
  background: #fff;
  color: #4060c0;
}

.sa-hd-btn--outline:hover {
  background: #f0f4ff;
}

.sa-title {
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  color: var(--primary-deep, #1a3c70);
  letter-spacing: -0.02em;
}

.sa-period {
  font-weight: 700;
  color: var(--primary-dark, #0063c0);
  padding: 6px 14px;
  background: var(--tint-200, #e8eef5);
  border-radius: 8px;
  font-size: 14px;
}

/* 조회 완료 시각(Asia/Seoul) — 기간 배지와 톤 맞춤 */
.sa-query-at {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  padding: 6px 14px;
  font-size: 14px;
  font-weight: 600;
  color: var(--primary-deep, #1a3c70);
  background: linear-gradient(145deg, #f6f8fc 0%, #eef3fb 45%, #e8eef8 100%);
  border: 1px solid rgba(26, 60, 112, 0.22);
  border-radius: 999px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.85), 0 1px 2px rgba(26, 60, 112, 0.06);
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.01em;
  white-space: nowrap;
}

.sa-columns {
  flex: 1 1 0;
  min-height: 0;
  min-width: 0;
  height: 100%;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  /* 하단 행(재료비·인건비) 높이는 기존 3행 그리드의 3행째와 동일 — 위쪽은 주간:객수 = 2:3 */
  --sa-rows-sum: calc(100% - 2 * var(--sa-gap));
  --sa-row-third: calc(var(--sa-rows-sum) / 3);
  --sa-bottom-band: max(var(--sa-row-min), var(--sa-row-third));
  grid-template-rows: minmax(0, 1fr) var(--sa-bottom-band);
  gap: var(--sa-gap);
  align-items: stretch;
}

.sa-col-left {
  grid-column: 1;
  grid-row: 1 / -1;
  min-width: 0;
  min-height: 0;
  display: grid;
  grid-template-rows: minmax(0, 1fr) var(--sa-bottom-band);
  gap: var(--sa-gap);
  align-items: stretch;
}

.sa-left-stack {
  min-width: 0;
  min-height: 0;
  display: grid;
  grid-template-rows: minmax(90px, 2fr) minmax(100px, 3fr);
  gap: var(--sa-gap);
  align-items: stretch;
}

.sa-area-weekly {
  min-width: 0;
  min-height: 0;
}

.sa-area-weekly .sa-card-body {
  flex: 1 1 0;
  min-height: 0;
  max-height: none;
  padding: 0 5px var(--sa-weekly-body-pad-bottom);
  box-sizing: border-box;
}

.sa-area-weekly .sa-card-body :deep(.sa-rg-host) {
  flex: 1 1 0;
  min-height: 0;
  min-width: 0;
}

.sa-area-customer {
  min-width: 0;
  min-height: 0;
}

.sa-area-material {
  min-width: 0;
  min-height: 0;
}

.sa-area-store {
  grid-column: 2;
  grid-row: 1;
  min-height: 0;
}

.sa-area-labor {
  grid-column: 2;
  grid-row: 2;
  min-height: 0;
}

.sa-card {
  background: var(--white, #fff);
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(26, 60, 112, 0.06);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: var(--sa-card-hd-body-gap);
  min-height: 0;
  isolation: isolate;
  /* 리사이즈 시 RealGrid 캔버스가 인접 카드와 겹쳐 보이는 현상 완화 */
  contain: layout;
}

/* 주간·객수 상단 스택 2:3 — `sa-card` 공통 min-height:0 은 아래에서 주간만 보정 */
.sa-card.sa-area-weekly {
  min-height: 0;
  height: 100%;
  max-height: none;
}

.sa-card-hd {
  flex-shrink: 0;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  box-sizing: border-box;
  height: var(--sa-card-hd-height);
  padding: 0 16px;
  background: linear-gradient(180deg, #dbe2ee 0%, #ccd8e6 100%);
  border-bottom: 1px solid rgba(26, 60, 112, 0.18);
  border-radius: 11px 11px 0 0;
}

.sa-card-body {
  flex: 1 1 0;
  min-height: 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  /* 카드 12px + 1px 테두리 안쪽 곡선과 맞춤 — 더 작은 radius면 하단이 깎여 보임 */
  padding: 0 5px 12px;
  box-sizing: border-box;
  overflow: hidden;
  border-radius: 0 0 11px 11px;
  background: #fff;
}

.sa-card-body :deep(.sa-rg-host) {
  flex: 1 1 0;
  min-height: 0;
}

.sa-card-title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.25;
  color: var(--primary-deep, #1a3c70);
  min-width: 0;
}

@media (max-width: 1280px) {
  .sa-col-left,
  .sa-left-stack {
    display: contents;
  }

  .sa-columns {
    grid-template-columns: 1fr;
    /* 1·2행: 주간:객수 = 2:3, 3~5행: 재료비·매장·인건비 (기존 1/5 기준) */
    --sa-rows5-sum: calc(100% - 4 * var(--sa-gap));
    --sa-rows5-one: calc(var(--sa-rows5-sum) / 5);
    grid-template-rows:
      minmax(90px, 2fr)
      minmax(100px, 3fr)
      max(120px, var(--sa-rows5-one))
      max(120px, var(--sa-rows5-one))
      max(120px, var(--sa-rows5-one));
  }

  .sa-area-weekly {
    grid-column: 1;
    grid-row: 1;
    min-height: 0;
    max-height: none;
    height: 100%;
    align-self: stretch;
  }

  .sa-area-customer {
    grid-column: 1;
    grid-row: 2;
  }

  .sa-area-material {
    grid-column: 1;
    grid-row: 3;
  }

  .sa-area-store {
    grid-column: 1;
    grid-row: 4;
  }

  .sa-area-labor {
    grid-column: 1;
    grid-row: 5;
  }
}
</style>
