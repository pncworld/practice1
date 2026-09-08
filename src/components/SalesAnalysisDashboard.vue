<template>
  <div class="sa-root">
    <header class="sa-head">
      <div class="sa-head-leading">
        <h1 class="sa-title">매출 분석</h1>
        <div class="sa-date-range" aria-label="조회 기간">
          <input
            v-model="selectedFromDate"
            type="date"
            class="sa-date-input"
            :max="maxSelectableDate"
            aria-label="조회 시작일" />
          <span class="sa-date-sep" aria-hidden="true">~</span>
          <input
            v-model="selectedToDate"
            type="date"
            class="sa-date-input"
            :max="maxSelectableDate"
            aria-label="조회 종료일" />
          <button type="button" class="sa-hd-btn sa-hd-btn--ghost" @click="onSearch">
            조회
          </button>
        </div>
      </div>
      <div class="sa-head-btns">
        <span v-if="queryDateTimeText" class="sa-query-at" aria-label="데이터 조회 일시">
          조회일시 : {{ queryDateTimeText }}
        </span>
        <button type="button" class="sa-hd-btn sa-hd-btn--primary" @click="onExcel">
          <img class="sa-hd-btn__ic" :src="saIconExcel" width="16" height="16" alt="" />
          엑셀변환
        </button>
        <span class="sa-hd-btn-wrap sa-hd-btn-wrap--tooltip-host" style="display:none;">
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
              <button
                type="button"
                class="sa-card-title-btn"
                data-sa-expand="weekly"
                title="크게 보기"
                aria-label="주간 핵심 지표 크게 보기"
                @click="openPanelExpand('weekly', $event)">
                <span class="sa-card-title">주간 핵심 지표</span>
                <img class="sa-card-title__expand-ic" :src="saIconExtent" width="22" height="22" alt="" />
              </button>
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
              <button
                type="button"
                class="sa-card-title-btn"
                data-sa-expand="customer"
                title="크게 보기"
                aria-label="객수 / 객단가 크게 보기"
                @click="openPanelExpand('customer', $event)">
                <span class="sa-card-title">객수 / 객단가</span>
                <img class="sa-card-title__expand-ic" :src="saIconExtent" width="22" height="22" alt="" />
              </button>
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
            <button
              type="button"
              class="sa-card-title-btn"
              data-sa-expand="material"
              title="크게 보기"
              aria-label="재료비 크게 보기"
              @click="openPanelExpand('material', $event)">
              <span class="sa-card-title">재료비</span>
              <img class="sa-card-title__expand-ic" :src="saIconExtent" width="22" height="22" alt="" />
            </button>
            <button
              type="button"
              class="sa-hd-btn sa-hd-btn--outline"
              @click.stop="onGoTargetCostRateRegister">
              <img
                class="sa-hd-btn__ic sa-hd-btn__ic--detail"
                :src="saIconDetail"
                width="16"
                height="16"
                alt="" />
              목표원가율 등록
            </button>
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
          <button
            type="button"
            class="sa-card-title-btn"
            data-sa-expand="store"
            title="크게 보기"
            aria-label="매장 매출 크게 보기"
            @click="openPanelExpand('store', $event)">
            <span class="sa-card-title">매장 매출</span>
            <img class="sa-card-title__expand-ic" :src="saIconExtent" width="22" height="22" alt="" />
          </button>
          <button
            type="button"
            class="sa-hd-btn sa-hd-btn--outline"
            @click.stop="onGoSalesGoalRegister">
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
          <button
            type="button"
            class="sa-card-title-btn"
            data-sa-expand="labor"
            title="크게 보기"
            aria-label="예약현황 크게 보기"
            @click="openPanelExpand('labor', $event)">
            <span class="sa-card-title">예약현황</span>
            <img class="sa-card-title__expand-ic" :src="saIconExtent" width="22" height="22" alt="" />
          </button>
        </div>
        <div class="sa-card-body">
          <SalesDashReportGrid
            ref="gridLabor"
            export-label="예약현황"
            :columns="COL_RESERVATION"
            :row-data="laborRows"
            :total-row-highlight="STORE_SALES_TOTAL_ROW_HIGHLIGHT" />
        </div>
      </section>
    </div>

    <Teleport to="body">
      <div
        v-if="expandUiOpen && expandPanelView"
        ref="expandOverlayEl"
        class="sa-expand-overlay"
        :class="{ 'sa-expand-overlay--dim': expandOverlayDim }"
        role="presentation">
        <div
          class="sa-expand-dialog"
          role="dialog"
          aria-modal="true"
          :aria-label="`${expandPanelView.title} 크게 보기`"
          tabindex="-1"
          ref="expandDialogEl"
          :style="expandDialogPosStyle">
          <div
            class="sa-expand-hd"
            title="드래그하여 이동"
            @mousedown="onExpandDialogDragStart">
            <div class="sa-expand-hd-lead">
              <h2 class="sa-expand-title">{{ expandPanelView.title }}</h2>
              <span class="sa-expand-period" aria-label="조회 기간">
                조회기간 {{ periodLabel }}
              </span>
            </div>
            <div class="sa-expand-hd-actions">
              <button
                type="button"
                class="sa-hd-btn sa-hd-btn--ghost"
                title="새로고침"
                @click="onExpandPanelRefresh">
                <img
                  class="sa-hd-btn__ic sa-hd-btn__ic--refresh"
                  :src="saIconRefresh"
                  width="16"
                  height="16"
                  alt="" />
                새로고침
              </button>
              <button
                type="button"
                class="sa-hd-btn sa-hd-btn--primary"
                @click="onExpandPanelExcel">
                <img class="sa-hd-btn__ic" :src="saIconExcel" width="16" height="16" alt="" />
                엑셀변환
              </button>
              <button type="button" class="sa-hd-btn sa-hd-btn--ghost" @click="closePanelExpand">
                닫기
              </button>
            </div>
          </div>
          <div class="sa-expand-body">
            <SalesDashReportGrid
              ref="expandGridRef"
              :key="`expand-${expandPanelView.id}`"
              :export-label="expandPanelView.exportLabel"
              :columns="expandPanelView.columns"
              :column-layout="expandPanelView.columnLayout"
              :row-data="expandPanelView.rowData"
              :row-height="expandPanelView.rowHeight"
              :fit-style="expandPanelView.fitStyle"
              :total-row-highlight="expandPanelView.totalRowHighlight" />
          </div>
          <div
            class="sa-expand-resize-grip"
            aria-hidden="true"
            title="크기 조절"
            @mousedown.stop="onExpandDialogResizeStart">
            <span class="sa-expand-resize-grip__plate">
              <span class="sa-expand-resize-grip__dots"></span>
            </span>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import SalesDashReportGrid from "@/components/SalesDashReportGrid.vue";
import {
  getCustomerAndUnitPriceByStore,
  getMaterialCostByStore,
  getReservationByStore,
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
  COL_MATERIAL,
  COL_RESERVATION,
  COL_STORE_SALES,
  COL_WEEKLY,
} from "@/constants/salesAnalysisDashboardColumns.js";
import saIconDetail from "@/assets/images/ic_move.svg";
import saIconExcel from "@/assets/excel_icon_dashboard.svg";
import saIconExtent from "@/assets/ic_extent.svg";
import saIconRefresh from "@/assets/ic_refresh.svg";
import Swal from "sweetalert2";
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

/** 패널 타이틀 크게 보기 (이 컴포넌트 전용) */
const expandPanelId = ref(null);
/** v-if — 닫힘 FLIP 끝날 때까지 true 유지 */
const expandUiOpen = ref(false);
const expandOverlayDim = ref(false);
const expandDialogEl = ref(null);
const expandOverlayEl = ref(null);
const expandGridRef = ref(null);
/** 팝업 위치(px) — 헤더 드래그로 이동 */
const expandDialogPos = ref({ left: 0, top: 0 });
const expandDialogPosStyle = computed(() => ({
  left: `${expandDialogPos.value.left}px`,
  top: `${expandDialogPos.value.top}px`,
}));
/** 팝업 열기 전 body overflow — 닫을 때 원복 */
let expandPrevBodyOverflow = null;
/** @type {{ startX: number; startY: number; origLeft: number; origTop: number } | null} */
let expandDragState = null;
/** @type {{ startX: number; startY: number; origW: number; origH: number } | null} */
let expandResizeState = null;
/** @type {{ left: number; top: number; width: number; height: number } | null} */
let expandOriginRect = null;
let expandLeaving = false;
const EXPAND_FLIP_MS_IN = 820;
const EXPAND_FLIP_MS_OUT = 640;
/** API 조회 완료 시점(Asia/Seoul `yyyy-mm-dd HH:mm`) — 미조회·스킵 시 빈 문자열 */
const queryDateTimeText = ref("");

const { FROM_DT: defaultFromDt, TO_DT: defaultToDt } = getSeoulMonthFromToYmdHyphen();
/** 조회 조건 — 날짜 입력값 */
const selectedFromDate = ref(defaultFromDt);
const selectedToDate = ref(defaultToDt);
/** 마지막 조회에 사용된 기간(엑셀·표시용) */
const queriedFromDate = ref(defaultFromDt);
const queriedToDate = ref(defaultToDt);

/** 상세페이지 이동 — 일시 비활성, 클릭 시 툴팁만 표시 */
let detailPrepTooltipTimer = null;
const detailPrepTooltipVisible = ref(false);

const weeklyKpi = ref([]);
const customerRows = ref([]);
const storeSalesRows = ref([]);
const costMaterialRows = ref([]);
const laborRows = ref([]);

const expandPanelView = computed(() => {
  const id = expandPanelId.value;
  if (!id) return null;
  const commonTot = STORE_SALES_TOTAL_ROW_HIGHLIGHT;
  /** @type {Record<string, object>} */
  const map = {
    weekly: {
      id: "weekly",
      title: "주간 핵심 지표",
      exportLabel: "주간핵심지표",
      columns: COL_WEEKLY,
      columnLayout: null,
      rowData: weeklyKpi.value,
      rowHeight: 32,
      fitStyle: "even",
      totalRowHighlight: null,
    },
    customer: {
      id: "customer",
      title: "객수 / 객단가",
      exportLabel: "객수_객단가",
      columns: COL_CUSTOMER,
      columnLayout: COL_CUSTOMER_LAYOUT,
      rowData: customerRows.value,
      rowHeight: 32,
      fitStyle: "even",
      totalRowHighlight: commonTot,
    },
    material: {
      id: "material",
      title: "재료비",
      exportLabel: "재료비",
      columns: COL_MATERIAL,
      columnLayout: null,
      rowData: costMaterialRows.value,
      rowHeight: 32,
      fitStyle: "even",
      totalRowHighlight: commonTot,
    },
    store: {
      id: "store",
      title: "매장 매출",
      exportLabel: "매장매출",
      columns: COL_STORE_SALES,
      columnLayout: null,
      rowData: storeSalesRows.value,
      rowHeight: 32,
      fitStyle: "even",
      totalRowHighlight: commonTot,
    },
    labor: {
      id: "labor",
      title: "예약현황",
      exportLabel: "예약현황",
      columns: COL_RESERVATION,
      columnLayout: null,
      rowData: laborRows.value,
      rowHeight: 32,
      fitStyle: "even",
      totalRowHighlight: commonTot,
    },
  };
  return map[id] ?? null;
});

function centerExpandDialog() {
  const dialog = expandDialogEl.value;
  const overlay = expandOverlayEl.value;
  if (!dialog || !overlay) return;
  const ow = overlay.clientWidth;
  const oh = overlay.clientHeight;
  const dw = dialog.offsetWidth;
  const dh = dialog.offsetHeight;
  expandDialogPos.value = {
    left: Math.max(0, Math.round((ow - dw) / 2)),
    top: Math.max(0, Math.round((oh - dh) / 2)),
  };
}

/** 팝업 마운트 전 대략 중앙 — 첫 프레임이 좌상단에서 튀지 않게 (애니메이션 가시성) */
function precenterExpandDialog() {
  if (typeof window === "undefined") return;
  const ow = window.innerWidth;
  const oh = window.innerHeight;
  const dw = Math.min(ow * 0.818, 1027);
  const dh = Math.min(oh * 0.774, 686);
  expandDialogPos.value = {
    left: Math.max(0, Math.round((ow - dw) / 2)),
    top: Math.max(0, Math.round((oh - dh) / 2)),
  };
}

function clampExpandDialogPos(left, top) {
  const dialog = expandDialogEl.value;
  const overlay = expandOverlayEl.value;
  if (!dialog || !overlay) return { left, top };
  const maxL = Math.max(0, overlay.clientWidth - dialog.offsetWidth);
  const maxT = Math.max(0, overlay.clientHeight - dialog.offsetHeight);
  return {
    left: Math.min(maxL, Math.max(0, left)),
    top: Math.min(maxT, Math.max(0, top)),
  };
}

function onExpandDialogDragMove(e) {
  if (!expandDragState) return;
  const next = clampExpandDialogPos(
    expandDragState.origLeft + (e.clientX - expandDragState.startX),
    expandDragState.origTop + (e.clientY - expandDragState.startY)
  );
  expandDialogPos.value = next;
}

function onExpandDialogDragEnd() {
  expandDragState = null;
  if (typeof window === "undefined") return;
  window.removeEventListener("mousemove", onExpandDialogDragMove);
  window.removeEventListener("mouseup", onExpandDialogDragEnd);
}

function onExpandDialogDragStart(e) {
  if (e.button !== 0) return;
  const t = e.target;
  if (t && typeof t.closest === "function" && t.closest("button, a, input, select, textarea")) {
    return;
  }
  const dialog = expandDialogEl.value;
  if (!dialog) return;
  e.preventDefault();
  expandDragState = {
    startX: e.clientX,
    startY: e.clientY,
    origLeft: expandDialogPos.value.left,
    origTop: expandDialogPos.value.top,
  };
  if (typeof window === "undefined") return;
  window.addEventListener("mousemove", onExpandDialogDragMove);
  window.addEventListener("mouseup", onExpandDialogDragEnd);
}

function onExpandDialogResizeMove(e) {
  if (!expandResizeState) return;
  const dialog = expandDialogEl.value;
  const overlay = expandOverlayEl.value;
  if (!dialog || !overlay) return;
  const minW = Math.min(420, overlay.clientWidth);
  const minH = Math.min(360, overlay.clientHeight);
  const maxW = Math.max(minW, overlay.clientWidth * 0.98);
  const maxH = Math.max(minH, overlay.clientHeight * 0.96);
  const nextW = Math.min(
    maxW,
    Math.max(minW, expandResizeState.origW + (e.clientX - expandResizeState.startX))
  );
  const nextH = Math.min(
    maxH,
    Math.max(minH, expandResizeState.origH + (e.clientY - expandResizeState.startY))
  );
  dialog.style.width = `${Math.round(nextW)}px`;
  dialog.style.height = `${Math.round(nextH)}px`;
  expandDialogPos.value = clampExpandDialogPos(
    expandDialogPos.value.left,
    expandDialogPos.value.top
  );
}

function onExpandDialogResizeEnd() {
  expandResizeState = null;
  if (typeof window === "undefined") return;
  window.removeEventListener("mousemove", onExpandDialogResizeMove);
  window.removeEventListener("mouseup", onExpandDialogResizeEnd);
  try {
    expandGridRef.value?.resetLayout?.();
  } catch (_) {
    void 0;
  }
}

function onExpandDialogResizeStart(e) {
  if (e.button !== 0) return;
  const dialog = expandDialogEl.value;
  if (!dialog) return;
  e.preventDefault();
  expandResizeState = {
    startX: e.clientX,
    startY: e.clientY,
    origW: dialog.offsetWidth,
    origH: dialog.offsetHeight,
  };
  if (typeof window === "undefined") return;
  window.addEventListener("mousemove", onExpandDialogResizeMove);
  window.addEventListener("mouseup", onExpandDialogResizeEnd);
}

function prefersExpandReducedMotion() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function readExpandOriginFromEvent(e) {
  const t = e?.currentTarget;
  if (!t || typeof t.getBoundingClientRect !== "function") return null;
  const r = t.getBoundingClientRect();
  if (!r.width || !r.height) return null;
  return { left: r.left, top: r.top, width: r.width, height: r.height };
}

function readExpandOriginByPanelId(id) {
  if (typeof document === "undefined" || !id) return expandOriginRect;
  const btn = document.querySelector(`[data-sa-expand="${id}"]`);
  if (!btn || typeof btn.getBoundingClientRect !== "function") return expandOriginRect;
  const r = btn.getBoundingClientRect();
  if (!r.width || !r.height) return expandOriginRect;
  return { left: r.left, top: r.top, width: r.width, height: r.height };
}

function clearExpandDialogMotionStyles(dialog) {
  if (!dialog) return;
  dialog.style.transition = "";
  dialog.style.transform = "";
  dialog.style.transformOrigin = "";
  dialog.style.opacity = "";
}

function waitExpandFlip(el, ms) {
  return new Promise((resolve) => {
    if (!el) {
      resolve();
      return;
    }
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      el.removeEventListener("transitionend", onEnd);
      resolve();
    };
    const onEnd = (ev) => {
      if (ev.target !== el) return;
      if (ev.propertyName === "transform" || ev.propertyName === "opacity") finish();
    };
    el.addEventListener("transitionend", onEnd);
    setTimeout(finish, ms + 40);
  });
}

function nextExpandFrames(n = 2) {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.requestAnimationFrame) {
      resolve();
      return;
    }
    let left = Math.max(1, n);
    const step = () => {
      left -= 1;
      if (left <= 0) resolve();
      else window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  });
}

/**
 * 클릭 타이틀 중심 기준 균등 scale
 * @param {"in"|"out"} dir — 열림은 더 작게 시작해야 커짐이 잘 보임
 * @returns {{ ox: number; oy: number; s: number } | null}
 */
function computeExpandFlipScale(dialog, origin, dir = "out") {
  if (!dialog || !origin) return null;
  const last = dialog.getBoundingClientRect();
  if (!last.width || !last.height) return null;
  const ox = origin.left + origin.width / 2 - last.left;
  const oy = origin.top + origin.height / 2 - last.top;
  const sW = origin.width / last.width;
  const sH = origin.height / last.height;
  const sFit = Math.max(0.05, Math.min(sW, sH));
  const s =
    dir === "in"
      ? Math.min(0.03, Math.max(0.012, sFit * 0.2))
      : Math.max(0.06, Math.sqrt(Math.max(0.0001, sW * sH)));
  return { ox, oy, s };
}

/**
 * FLIP: 클릭 타이틀 ↔ 팝업 (이 대시보드 전용)
 * @param {"in"|"out"} dir
 */
async function runExpandFlip(dir) {
  const dialog = expandDialogEl.value;
  const overlay = expandOverlayEl.value;
  if (!dialog || !overlay) return false;
  if (prefersExpandReducedMotion()) return false;

  const origin =
    dir === "out"
      ? readExpandOriginByPanelId(expandPanelId.value)
      : expandOriginRect;
  const flip = computeExpandFlipScale(dialog, origin, dir);
  if (!flip) return false;

  const ms = dir === "in" ? EXPAND_FLIP_MS_IN : EXPAND_FLIP_MS_OUT;
  /** 열림/닫힘 대칭 — 닫힘과 같은 계열 곡선 */
  const ease =
    dir === "in"
      ? "cubic-bezier(0.22, 1, 0.36, 1)"
      : "cubic-bezier(0.4, 0, 0.2, 1)";
  const from = `scale(${flip.s})`;
  const to = "scale(1)";

  dialog.style.transformOrigin = `${flip.ox}px ${flip.oy}px`;

  if (dir === "in") {
    /* 첫 페인트에 풀사이즈가 보이지 않게 숨긴 뒤 invert 적용 */
    dialog.style.transition = "none";
    dialog.style.opacity = "0";
    dialog.style.transform = from;
    expandOverlayDim.value = false;
    void dialog.offsetWidth;
    await nextExpandFrames(2);
    dialog.style.opacity = "0.92";
    dialog.style.transition = `transform ${ms}ms ${ease}, opacity ${Math.round(ms * 0.75)}ms ease-out`;
    void dialog.offsetWidth;
    dialog.style.transform = to;
    dialog.style.opacity = "1";
    expandOverlayDim.value = true;
    await waitExpandFlip(dialog, ms);
    clearExpandDialogMotionStyles(dialog);
  } else {
    dialog.style.transition = "none";
    dialog.style.transform = to;
    dialog.style.opacity = "1";
    void dialog.offsetWidth;
    await nextExpandFrames(1);
    dialog.style.transition = `transform ${ms}ms ${ease}, opacity ${Math.round(ms * 0.85)}ms ease-in`;
    dialog.style.transform = from;
    dialog.style.opacity = "0.72";
    expandOverlayDim.value = false;
    await waitExpandFlip(dialog, ms);
    clearExpandDialogMotionStyles(dialog);
  }
  return true;
}

function teardownExpandPanel() {
  expandUiOpen.value = false;
  expandPanelId.value = null;
  expandOverlayDim.value = false;
  expandOriginRect = null;
  expandLeaving = false;
  if (typeof document !== "undefined" && expandPrevBodyOverflow !== null) {
    document.body.style.overflow = expandPrevBodyOverflow;
    expandPrevBodyOverflow = null;
  }
}

async function openPanelExpand(id, e) {
  if (expandLeaving) return;
  expandOriginRect = readExpandOriginFromEvent(e);
  precenterExpandDialog();
  expandPanelId.value = id;
  expandUiOpen.value = true;
  /* FLIP 준비 전엔 딤/풀사이즈 노출 방지 */
  expandOverlayDim.value = !expandOriginRect || prefersExpandReducedMotion();
  if (typeof document !== "undefined") {
    if (expandPrevBodyOverflow === null) {
      expandPrevBodyOverflow = document.body.style.overflow;
    }
    document.body.style.overflow = "hidden";
  }
  await nextTick();
  const dialog = expandDialogEl.value;
  if (dialog && expandOriginRect && !prefersExpandReducedMotion()) {
    dialog.style.transition = "none";
    dialog.style.opacity = "0";
  }
  centerExpandDialog();
  await nextTick();
  centerExpandDialog();
  if (dialog) {
    dialog.style.width = "";
    dialog.style.height = "";
  }
  try {
    const flipped = await runExpandFlip("in");
    if (!flipped) expandOverlayDim.value = true;
  } catch (_) {
    expandOverlayDim.value = true;
    clearExpandDialogMotionStyles(dialog);
  }
  try {
    expandDialogEl.value?.focus?.();
  } catch (_) {
    void 0;
  }
  try {
    expandGridRef.value?.resetLayout?.();
  } catch (_) {
    void 0;
  }
}

async function closePanelExpand() {
  if (expandLeaving || !expandUiOpen.value) return;
  expandLeaving = true;
  onExpandDialogDragEnd();
  onExpandDialogResizeEnd();
  try {
    await runExpandFlip("out");
  } catch (_) {
    void 0;
  }
  teardownExpandPanel();
}

/** 크게 보기 팝업 — 대시보드와 동일 기간으로 재조회 (팝업 유지) */
function onExpandPanelRefresh() {
  if (isInvalidSalesDashDateRange(selectedFromDate.value, selectedToDate.value)) {
    void Swal.fire({
      title: "경고",
      text: "조회 기간을 확인해 주십시오!",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  void loadSalesAnalysisDashboardData().finally(() => {
    emit("refresh");
    resetAllGridLayouts();
    try {
      expandGridRef.value?.resetLayout?.();
    } catch (_) {
      void 0;
    }
  });
}

/** 크게 보기 팝업 — 현재 패널만 엑셀 (xlsx-js-style, 맑은 고딕 고정) */
function onExpandPanelExcel() {
  const view = expandPanelView.value;
  if (!view || !Array.isArray(view.columns) || view.columns.length === 0) {
    window.alert("엑셀로 내보낼 데이터가 없습니다.");
    return;
  }
  try {
    const columns = view.columns;
    const rows = Array.isArray(view.rowData) ? view.rowData : [];
    const maxCols = Math.max(1, columns.length);
    const FROM_DT = String(queriedFromDate.value ?? "").trim();
    const TO_DT = String(queriedToDate.value ?? "").trim();
    const queriedAt = formatSalesDashQueryAtSeoul(new Date());
    const bullet = SA_EXCEL_META_BULLET;

    const wb = utils.book_new();
    const ws = utils.aoa_to_sheet([]);
    const pad = (/** @type {unknown[]} */ arr) => {
      const x = arr.slice();
      while (x.length < maxCols) x.push("");
      return x;
    };

    utils.sheet_add_aoa(ws, [pad([view.title])], { origin: "A1" });
    utils.sheet_add_aoa(
      ws,
      [pad([`${bullet}조회기간: ${periodLabel.value} (${FROM_DT}~${TO_DT})`])],
      { origin: "A2" }
    );
    utils.sheet_add_aoa(ws, [pad([`${bullet}조회일시: ${queriedAt}`])], { origin: "A3" });
    utils.sheet_add_aoa(ws, [pad([""])], { origin: "A4" });

    const headerRow1 = 5;
    utils.sheet_add_aoa(ws, [pad(columns.map((c) => c.headerText))], {
      origin: utils.encode_cell({ r: headerRow1 - 1, c: 0 }),
    });

    const fields = columns.map((c) => c.fieldName);
    const aoa = rows.map((row) =>
      pad(
        fields.map((f) => {
          const v = row?.[f];
          if (v === null || v === undefined || v === "") return "";
          if (typeof v === "number" && Number.isFinite(v)) return v;
          return String(v);
        })
      )
    );
    const dataStart = 6;
    let dataEnd = 0;
    if (aoa.length) {
      utils.sheet_add_aoa(ws, aoa, { origin: utils.encode_cell({ r: dataStart - 1, c: 0 }) });
      dataEnd = dataStart + aoa.length - 1;
    }

    const merges = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: maxCols - 1 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: maxCols - 1 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: maxCols - 1 } },
    ];
    ws["!merges"] = merges;

    const titleStyle = {
      font: { name: "맑은 고딕", sz: 18, bold: true, color: { rgb: "FF1A3C70" } },
      fill: { patternType: "solid", fgColor: { rgb: "FFDCE6F5" } },
      alignment: { horizontal: "left", vertical: "center", wrapText: true },
      border: SA_EXCEL_BORDER,
    };
    const metaStyle = {
      font: { name: "맑은 고딕", sz: 11, bold: false, color: { rgb: "FF2F4666" } },
      fill: { patternType: "solid", fgColor: { rgb: "FFF3F6FB" } },
      alignment: { horizontal: "left", vertical: "center", wrapText: true },
      border: SA_EXCEL_BORDER,
    };
    const headerStyle = {
      font: { name: "맑은 고딕", sz: 11, bold: true, color: { rgb: "FFFFFFFF" } },
      fill: { patternType: "solid", fgColor: { rgb: "FF243D5C" } },
      alignment: { horizontal: "center", vertical: "center", wrapText: true },
      border: SA_EXCEL_BORDER,
    };
    const dataBase = {
      font: { name: "맑은 고딕", sz: 11, color: { rgb: "FF222222" } },
      fill: { patternType: "solid", fgColor: { rgb: "FFFFFFFF" } },
      border: SA_EXCEL_BORDER,
      alignment: { vertical: "center", wrapText: true },
    };
    const dataTotal = {
      font: { name: "맑은 고딕", sz: 11, bold: true, color: { rgb: "FF5A1F24" } },
      fill: { patternType: "solid", fgColor: { rgb: "FFFCE9EA" } },
      border: SA_EXCEL_BORDER,
      alignment: { vertical: "center", wrapText: true },
    };

    paintDashExcelRect(ws, 1, 1, 1, maxCols, titleStyle);
    paintDashExcelRect(ws, 2, 1, 2, maxCols, metaStyle);
    paintDashExcelRect(ws, 3, 1, 3, maxCols, metaStyle);
    paintDashExcelRect(ws, headerRow1, 1, headerRow1, maxCols, headerStyle);

    const tot = view.totalRowHighlight;
    if (dataEnd >= dataStart) {
      for (let r = dataStart; r <= dataEnd; r++) {
        const rowObj = rows[r - dataStart];
        const isTotal = dashExcelRowMatchesTotalHighlight(rowObj, tot);
        for (let c = 1; c <= maxCols; c++) {
          const addr = utils.encode_cell({ r: r - 1, c: c - 1 });
          const cell = ws[addr];
          if (!cell) continue;
          const colDef = columns[c - 1];
          const isNumberCol = colDef?.fieldDataType === "number";
          const base = isTotal ? dataTotal : dataBase;
          cell.s = {
            ...base,
            alignment: {
              ...base.alignment,
              horizontal: isNumberCol ? "right" : "left",
            },
          };
          if (cell.t === "n" && isNumberCol) {
            cell.z = colDef?.numberFormat?.includes(".") ? "#,##0.00" : "#,##0";
          }
        }
      }
    }

    if (!ws["!rows"]) ws["!rows"] = [];
    ws["!rows"][0] = { hpt: 32, customHeight: true };
    ws["!rows"][1] = { hpt: 22, customHeight: true };
    ws["!rows"][2] = { hpt: 22, customHeight: true };
    ws["!rows"][headerRow1 - 1] = { hpt: 24, customHeight: true };
    if (dataEnd >= dataStart) {
      for (let rr = dataStart; rr <= dataEnd; rr++) {
        ws["!rows"][rr - 1] = { hpt: 20, customHeight: true };
      }
    }

    /** @type {import("xlsx-js-style").ColInfo[]} */
    const cols = columns.map((c) => {
      const px = typeof c.width === "number" ? c.width : 96;
      const wch = Math.min(36, Math.max(10, Math.round(px / 5) + 1));
      return { wch };
    });
    ws["!cols"] = cols;

    const sheetName = String(view.exportLabel || view.title || "sheet")
      .replace(/[\\/?*\[\]:]/g, "_")
      .slice(0, 31);
    utils.book_append_sheet(wb, ws, sheetName || "sheet");

    const now = new Date();
    const stamp = `${now.getFullYear()}${pad2(now.getMonth() + 1)}${pad2(now.getDate())}_${pad2(
      now.getHours()
    )}${pad2(now.getMinutes())}${pad2(now.getSeconds())}`;
    const safeBase = String(view.exportLabel || view.title || "export").replace(
      /[\\/:*?"<>|]/g,
      "_"
    );
    writeFile(wb, `${safeBase}_${stamp}.xlsx`);
  } catch (e) {
    console.error("[SalesAnalysisDashboard] onExpandPanelExcel", e);
    window.alert("엑셀 저장 중 오류가 발생했습니다.");
  }
}

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

/** Asia/Seoul 당일 `yyyy-mm-dd` — 날짜 입력 max */
function getSeoulTodayYmdHyphen() {
  return getSeoulMonthFromToYmdHyphen().TO_DT;
}

/** `yyyy-mm-dd` → `m/d` 표시 */
function formatYmdToMdSlash(ymd) {
  const m = String(ymd ?? "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return String(ymd ?? "");
  return `${Number(m[2])}/${Number(m[3])}`;
}

function isInvalidSalesDashDateRange(fromDt, toDt) {
  const from = String(fromDt ?? "").trim();
  const to = String(toDt ?? "").trim();
  if (!from || !to) return true;
  return from > to;
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

/** 매장 매출 공통 행 */
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

/** 재료비 — 목표/실제 원가율·금액 (SP 합계 행 store=`합계`, 매장매출과 동일 강조) */
function mapMaterialDashRow(r) {
  if (!r || typeof r !== "object") {
    return {
      store: "",
      targetRate: 0,
      actualRate: 0,
      rateDiff: 0,
      targetAmt: 0,
      purchaseAmt: 0,
      amtDiff: 0,
    };
  }
  return {
    store: String(pickRow(r, ["store", "STORE_NM", "STR_STORE_NM", "STORE"]) ?? ""),
    targetRate:
      parseDashRate(
        pickRow(r, ["targetRate", "TARGET_RATE", "TARGETRATE", "목표원가율"])
      ) ?? 0,
    actualRate:
      parseDashRate(
        pickRow(r, ["actualRate", "ACTUAL_RATE", "ACTUALRATE", "실제원가율"])
      ) ?? 0,
    rateDiff:
      parseDashRate(pickRow(r, ["rateDiff", "RATE_DIFF", "RATEDIFF", "원가율차이"])) ?? 0,
    targetAmt: parseDashAmount(
      pickRow(r, ["targetAmt", "TARGET_AMT", "TARGETAMT", "목표금액"])
    ),
    purchaseAmt: parseDashAmount(
      pickRow(r, ["purchaseAmt", "PURCHASE_AMT", "PURCHASEAMT", "actual", "매입금액"])
    ),
    amtDiff: parseDashAmount(pickRow(r, ["amtDiff", "AMT_DIFF", "AMTDIFF", "금액비"])),
  };
}

/** 예약현황 — store, rsv, mom, yoy, grp, grp_yoy */
function mapReservationDashRow(r) {
  if (!r || typeof r !== "object") {
    return { store: "", rsv: 0, mom: null, yoy: null, grp: 0, grp_yoy: null };
  }
  return {
    store: String(pickRow(r, ["store", "STORE_NM", "STR_STORE_NM", "STORE"]) ?? ""),
    rsv: parseDashAmount(pickRow(r, ["rsv", "RSV", "RSV_CNT", "RESERVATION"])),
    mom: parseDashRate(pickRow(r, ["mom", "MOM", "MOM_RATE"])),
    yoy: parseDashRate(pickRow(r, ["yoy", "YOY", "YOY_RATE"])),
    grp: parseDashAmount(pickRow(r, ["grp", "GRP", "GRP_CNT", "GROUP_CNT"])),
    grp_yoy: parseDashRate(pickRow(r, ["grp_yoy", "GRP_YOY", "GROUP_YOY"])),
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

  /* 전역 로딩: API 직전에 켜고, 한 프레임 그린 뒤 동시 요청 (로그인 직후 대기 체감 완화) */
  store.dispatch("convertLoading", true);
  await nextTick();

  const FROM_DT = String(selectedFromDate.value ?? "").trim();
  const TO_DT = String(selectedToDate.value ?? "").trim();
  const groupCd = u.lngStoreGroup;
  const storeCd = resolveSalesDashStoreCd(u);
  const sequence = u.lngSequence;
  try {
    const [rw, rc, rs, rm, rl] = await Promise.allSettled([
      getWeeklyKeyIndicators(groupCd, storeCd, sequence, FROM_DT, TO_DT),
      getCustomerAndUnitPriceByStore(groupCd, storeCd, sequence, FROM_DT, TO_DT),
      getStoreSalesByStore(groupCd, storeCd, sequence, FROM_DT, TO_DT),
      getMaterialCostByStore(groupCd, storeCd, sequence, FROM_DT, TO_DT),
      getReservationByStore(groupCd, storeCd, sequence, FROM_DT, TO_DT),
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
        ? readDashList(rm.value).map((row) => mapMaterialDashRow(row))
        : [];
    laborRows.value =
      rl.status === "fulfilled" && Array.isArray(readDashList(rl.value))
        ? readDashList(rl.value).map((row) => mapReservationDashRow(row))
        : [];
  } catch {
    clearSalesAnalysisDashboardRows();
  } finally {
    store.dispatch("convertLoading", false);
    queryDateTimeText.value = formatSalesDashQueryAtSeoul(new Date());
    queriedFromDate.value = FROM_DT;
    queriedToDate.value = TO_DT;
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

/** 창 리사이즈 후 RealGrid 크기 재계산 */
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

function onSearch() {
  if (isInvalidSalesDashDateRange(selectedFromDate.value, selectedToDate.value)) {
    void Swal.fire({
      title: "경고",
      text: "조회 기간을 확인해 주십시오!",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
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
  const defs = [COL_WEEKLY, COL_STORE_SALES, COL_CUSTOMER, COL_MATERIAL, COL_RESERVATION];
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
      COL_RESERVATION.length
    );
    const padTop = (/** @type {unknown[]} */ cells) => {
      const x = cells.slice();
      while (x.length < maxCols) x.push("");
      return x;
    };

    const FROM_DT = String(queriedFromDate.value ?? "").trim();
    const TO_DT = String(queriedToDate.value ?? "").trim();
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
    pushSection("예약현황", COL_RESERVATION, laborRows.value, STORE_SALES_TOTAL_ROW_HIGHLIGHT);

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

/** 좌측 메뉴(minorCategory)에서 화면 XML로 프로그램 정보 조회 — 탭·strUrl·lngProgramID 일치 */
function resolveMenuProgramByXmlFile(xmlFileName) {
  const list = store.state.minorCategory;
  if (!Array.isArray(list)) return null;
  const needle = String(xmlFileName ?? "").trim().toLowerCase();
  if (!needle) return null;
  return (
    list.find((item) => {
      const url = String(item?.strUrl ?? "").toLowerCase();
      return url.endsWith(needle) || url.includes(`::${needle}`);
    }) ?? null
  );
}

function openSls01RegistrationTab(fallbackTitle) {
  const t = SALES_GOAL_REGISTRATION_TAB;
  const menuProg = resolveMenuProgramByXmlFile("SLS01_001INS.xml");
  const strUrl = menuProg?.strUrl ?? t.strUrl;
  const strTitle = menuProg?.strTitle ?? fallbackTitle ?? t.strTitle;
  const lngProgramID = menuProg?.lngProgramID ?? t.lngProgramID;

  if (!strUrl) {
    window.alert("등록 화면 경로(strUrl)가 설정되지 않았습니다.");
    return;
  }

  const programId = Number(lngProgramID);
  if (Number.isFinite(programId) && programId > 0) {
    store.state.moveOtherTab = {
      strUrl,
      lngProgramID: programId,
      strTitle,
    };
    return;
  }

  void router.push({ path: "/MISALES/SLS01_001INS.xml" }).catch(() => {});
}

function onGoSalesGoalRegister() {
  openSls01RegistrationTab("매출목표 등록");
}

/** 재료비 — 목표원가율은 SLS01_001INS 동일 화면에서 등록 */
function onGoTargetCostRateRegister() {
  openSls01RegistrationTab("목표원가율 등록");
}

const maxSelectableDate = computed(() => getSeoulTodayYmdHyphen());

const periodLabel = computed(
  () => `${formatYmdToMdSlash(queriedFromDate.value)} ~ ${formatYmdToMdSlash(queriedToDate.value)}`
);

onMounted(() => {
  void loadSalesAnalysisDashboardData();
  if (typeof window === "undefined") return;
  window.addEventListener("resize", scheduleDashGridReflow, { passive: true });
});

onUnmounted(() => {
  closePanelExpand();
  if (typeof window === "undefined") return;
  window.removeEventListener("resize", scheduleDashGridReflow);
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
    const { FROM_DT, TO_DT } = getSeoulMonthFromToYmdHyphen();
    selectedFromDate.value = FROM_DT;
    selectedToDate.value = TO_DT;
    queriedFromDate.value = FROM_DT;
    queriedToDate.value = TO_DT;
  },
});
</script>

<style scoped>
.sa-root {
  /* 넓은 해상도에서만 폭이 무한히 늘어나면 RealGrid 컬럼·행이 커져 노트북 대비 배율이 달라 보임 → 기준 폭 상한 후 가운데 정렬 */
  --sa-layout-max-width: 1520px;
  --sa-gap: 14px;
  --sa-row-min: 152px;
  /* 상단(주간+객수 / 매장매출) 최소 높이 — 0으로 접히면 하단만 보이고 RealGrid 가 겹쳐 그림 */
  --sa-top-min: 300px;
  --sa-head-gap: 14px;
  --sa-title-date-gap: 22px;
  --sa-card-hd-body-gap: 7px;
  --sa-card-hd-height: 45px;
  --sa-weekly-rg-row: 28px;
  --sa-weekly-rg-hdr: 26px;
  --sa-weekly-data-rows: 4;
  --sa-weekly-body-pad-bottom: 6px;
  --sa-weekly-grid-inner: calc(
    var(--sa-weekly-rg-hdr) + var(--sa-weekly-data-rows) * var(--sa-weekly-rg-row)
  );
  --sa-weekly-band: calc(
    var(--sa-card-hd-height) + var(--sa-card-hd-body-gap) + var(--sa-weekly-grid-inner) +
      var(--sa-weekly-body-pad-bottom)
  );
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: var(--sa-head-gap);
  /* 부모 .sa-dash-host 가 확정 높이·스크롤 담당 — 여기는 내용만 채움 */
  flex: 1 1 auto;
  align-self: center;
  width: min(100%, var(--sa-layout-max-width));
  min-width: 0;
  min-height: 0;
  height: 100%;
  max-height: 100%;
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
  border: 1px solid #a8d5b5;
  background: #d4edda;
  color: #2d6a4f;
}

.sa-hd-btn--primary:hover {
  background: #b7dfc4;
  border-color: #8ec6a0;
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

.sa-date-range {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 10px;
  min-width: 0;
}

.sa-date-input {
  width: 9.25rem;
  max-width: 100%;
  height: 2rem;
  padding: 0 10px;
  font-size: 14px;
  font-weight: 600;
  color: var(--primary-deep, #1a3c70);
  background: #fff;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  font-variant-numeric: tabular-nums;
}

.sa-date-input:focus {
  outline: none;
  border-color: #5782ff;
  box-shadow: 0 0 0 2px rgba(87, 130, 255, 0.2);
}

.sa-date-sep {
  font-size: 14px;
  font-weight: 700;
  color: var(--primary-dark, #0063c0);
  flex-shrink: 0;
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
  /*
   * % 기반 --sa-bottom-band 제거.
   * 상단 minmax(0,1fr) 은 0 접힘 → RealGrid 겹침 유발. px 하한 유지.
   */
  grid-template-rows: minmax(var(--sa-top-min), 2fr) minmax(var(--sa-row-min), 1fr);
  gap: var(--sa-gap);
  align-items: stretch;
}

.sa-col-left {
  grid-column: 1;
  grid-row: 1 / -1;
  min-width: 0;
  min-height: 0;
  display: grid;
  grid-template-rows: minmax(var(--sa-top-min), 2fr) minmax(var(--sa-row-min), 1fr);
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
  height: 100%;
  isolation: isolate;
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

.sa-card-title-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin: 0;
  padding: 4px 6px 4px 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  min-width: 0;
  max-width: 100%;
  border-radius: 6px;
  color: inherit;
  text-align: left;
}

.sa-card-title-btn:hover .sa-card-title,
.sa-card-title-btn:focus-visible .sa-card-title {
  color: #0b2a5c;
  transform: scale(1.06);
}

.sa-card-title-btn:hover .sa-card-title__expand-ic,
.sa-card-title-btn:focus-visible .sa-card-title__expand-ic {
  opacity: 1;
  transform: scale(1.32);
  /* 브랜드 남색 계열 포인트 블루 (#1f6feb) */
  filter: brightness(0) saturate(100%) invert(32%) sepia(98%) saturate(1800%)
    hue-rotate(199deg) brightness(0.98) contrast(1.05);
}

.sa-card-title-btn:focus-visible {
  outline: 2px solid rgba(26, 60, 112, 0.45);
  outline-offset: 2px;
}

.sa-card-title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.25;
  color: var(--primary-deep, #1a3c70);
  min-width: 0;
  transform-origin: left center;
  transition: color 0.15s ease, transform 0.15s ease;
}

.sa-card-title__expand-ic {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  opacity: 0.78;
  transform-origin: center;
  transition: opacity 0.15s ease, transform 0.15s ease, filter 0.15s ease;
}

/* 패널 크게 보기 — 리사이즈·드래그 이동 (가로≈87%, 세로≈88%)
   열림/닫힘 모션은 JS FLIP (클릭 타이틀 ↔ 팝업) — 이 컴포넌트만 */
.sa-expand-overlay {
  position: fixed;
  inset: 0;
  z-index: 12000;
  box-sizing: border-box;
  padding: 0;
  background: rgba(15, 28, 48, 0.45);
  overflow: hidden;
  opacity: 0;
  transition: opacity 0.65s ease;
}

.sa-expand-overlay--dim {
  opacity: 1;
}

.sa-expand-dialog {
  position: absolute;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: min(81.8vw, 1027px);
  height: min(77.4vh, 686px);
  min-width: min(420px, 100%);
  min-height: min(360px, 100%);
  max-width: 98vw;
  max-height: 96vh;
  resize: both;
  overflow: auto;
  background: #fff;
  border-radius: 12px;
  border: 1px solid rgba(26, 60, 112, 0.22);
  box-shadow: 0 18px 48px rgba(15, 28, 48, 0.28);
  will-change: transform, opacity;
}

@media (prefers-reduced-motion: reduce) {
  .sa-expand-overlay {
    transition: none;
  }
}

.sa-expand-resize-grip {
  position: absolute;
  right: 2px;
  bottom: 2px;
  z-index: 3;
  width: 28px;
  height: 28px;
  pointer-events: auto;
  cursor: nwse-resize;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
}

.sa-expand-resize-grip__plate {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 5px 0 10px 0;
  background: linear-gradient(135deg, #e8eef7 0%, #c5d3e6 55%, #a8bcd4 100%);
  border: 1px solid rgba(26, 60, 112, 0.45);
  box-shadow:
    0 1px 3px rgba(15, 28, 48, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.65);
  transition:
    background 0.12s ease,
    border-color 0.12s ease,
    box-shadow 0.12s ease;
}

.sa-expand-resize-grip__dots {
  display: block;
  width: 14px;
  height: 14px;
  opacity: 1;
  background-image:
    radial-gradient(circle, #1a3c70 1.55px, transparent 1.7px),
    radial-gradient(circle, #1a3c70 1.55px, transparent 1.7px),
    radial-gradient(circle, #1a3c70 1.55px, transparent 1.7px),
    radial-gradient(circle, #1a3c70 1.55px, transparent 1.7px),
    radial-gradient(circle, #1a3c70 1.55px, transparent 1.7px),
    radial-gradient(circle, #1a3c70 1.55px, transparent 1.7px);
  background-size: 4px 4px;
  background-position:
    9px 9px,
    5px 9px,
    9px 5px,
    1px 9px,
    5px 5px,
    9px 1px;
  background-repeat: no-repeat;
  transition:
    transform 0.12s ease,
    background-image 0.12s ease;
}

.sa-expand-resize-grip:hover .sa-expand-resize-grip__plate,
.sa-expand-resize-grip:active .sa-expand-resize-grip__plate {
  background: linear-gradient(135deg, #ffd0d0 0%, #ff8a8a 50%, #e53935 100%);
  border-color: rgba(183, 28, 28, 0.75);
  box-shadow:
    0 2px 6px rgba(183, 28, 28, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.55);
}

.sa-expand-resize-grip:hover .sa-expand-resize-grip__dots,
.sa-expand-resize-grip:active .sa-expand-resize-grip__dots {
  transform: scale(1.08);
  background-image:
    radial-gradient(circle, #7f0000 1.55px, transparent 1.7px),
    radial-gradient(circle, #7f0000 1.55px, transparent 1.7px),
    radial-gradient(circle, #7f0000 1.55px, transparent 1.7px),
    radial-gradient(circle, #7f0000 1.55px, transparent 1.7px),
    radial-gradient(circle, #7f0000 1.55px, transparent 1.7px),
    radial-gradient(circle, #7f0000 1.55px, transparent 1.7px);
}

.sa-expand-hd {
  flex-shrink: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 14px;
  box-sizing: border-box;
  min-height: 48px;
  padding: 8px 14px 8px 18px;
  background: linear-gradient(180deg, #dbe2ee 0%, #ccd8e6 100%);
  border-bottom: 1px solid rgba(26, 60, 112, 0.18);
  cursor: move;
  user-select: none;
}

.sa-expand-hd-lead {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 12px;
  min-width: 0;
  flex: 1 1 auto;
}

.sa-expand-hd-actions {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  gap: 8px;
  margin-left: auto;
  cursor: default;
}

.sa-expand-hd-actions .sa-hd-btn {
  cursor: pointer;
}

.sa-expand-title {
  margin: 0;
  font-size: 17px;
  font-weight: 700;
  color: var(--primary-deep, #1a3c70);
  min-width: 0;
  flex-shrink: 0;
}

.sa-expand-period {
  display: inline-flex;
  align-items: center;
  margin: 0;
  padding: 3px 10px;
  border-radius: 999px;
  border: 1px solid rgba(26, 60, 112, 0.16);
  background: rgba(255, 255, 255, 0.7);
  font-size: 13px;
  font-weight: 700;
  line-height: 1.3;
  color: #314864;
  white-space: nowrap;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sa-expand-body {
  flex: 1 1 auto;
  min-height: 280px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 8px 10px 12px;
  overflow: hidden;
  background: #fff;
}

.sa-expand-body :deep(.sa-rg-host) {
  flex: 1 1 0;
  min-height: 0;
  min-width: 0;
  width: 100%;
  height: 100%;
}
</style>
