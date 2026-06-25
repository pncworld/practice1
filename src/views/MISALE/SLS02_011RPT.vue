<!-- /*--############################################################################
# Filename : SLS02_011RPT.vue                                                  
# Description : 매출관리 > 당일 매출 조회 > 영수증별 매출 조회.                #
Date :2025-05-14                                                              #
Author : 권맑음                     
################################################################################*/ -->
<template>
  <div class="flex h-full min-h-0 flex-col">
    <div class="flex shrink-0 justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center mr-9 space-x-2 pr-5">
        <button @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <button @click="excelButton" class="button save w-auto excel">
          엑셀
        </button>
      </div>
    </div>
    <div
      class="sls011-search-panel relative z-30 mt-3 w-full min-w-0 shrink-0 overflow-visible rounded-lg bg-gray-200 px-6 py-3 md:px-10 lg:px-12"
      :style="{
        '--sls011-control-border': sls011ControlBorder,
        '--sls011-item-gap': sls011ItemGap,
        '--sls011-col-gap': sls011ColGap,
        '--sls011-label-col': sls011LabelCol,
        '--sls011-w-control': sls011ControlWidth,
        '--sls011-store-name-scale': sls011StoreNameScale,
        '--sls011-store-group-w': sls011StoreGroupWidth,
        '--sls011-store-attr-w': sls011StoreAttrWidth,
      }">
      <div ref="sls011SearchGridRef" class="sls011-search-grid min-w-0">
        <div class="sls011-cell">
          <div class="sls011-sg-label">매출일자</div>
          <div class="sls011-cell-field sls011-date-slot sls011-fixed-cap sls011-w-control min-w-0">
            <Datepicker1
              main-name=""
              @dateValue="dateValue"
              @year="year"
              @month="month"
              @day="day" />
          </div>
        </div>
        <div class="sls011-cell sls011-cell--fill sls011-cell--mid">
          <div class="sls011-sg-label">매장</div>
          <div class="sls011-cell-field sls011-pick-slot min-w-0">
            <PickStoreRenew3
              compact
              omit-main-label
              combo-fill
              :placeholderName="'선택'"
              @lngStoreCode="selectedStoreCd"
              @lngStoreGroup="selectedGroupCd"
              @lngStoreAttrs="lngStoreAttrs" />
          </div>
        </div>
        <div class="sls011-cell">
          <div class="sls011-sg-label">POS번호</div>
          <div class="sls011-cell-field sls011-vselect-slot sls011-fixed-cap sls011-w-control min-w-0">
            <PosList
              :groupCd="groupCd"
              :storeCd="storeCd"
              :init="init"
              @posNo="posNo" />
          </div>
        </div>
        <div class="sls011-cell">
          <div class="sls011-sg-label">영수증번호</div>
          <div class="sls011-cell-field sls011-fixed-cap sls011-w-control min-w-0">
            <input
              id="sls02-011-receipt"
              v-model="receiptNo"
              type="text"
              class="sls011-sg-input h-8 min-w-0 rounded-md border border-solid bg-white px-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div class="sls011-cell sls011-cell--fill sls011-cell--mid">
          <div class="sls011-sg-label">할인코드</div>
          <div class="sls011-cell-field sls011-vselect-slot sls011-fixed-cap sls011-w-control min-w-0">
            <DisCountCdList
              :groupCd="groupCd"
              :storeCd="storeCd"
              :init="init"
              @disCountCd="DisCountCd" />
          </div>
        </div>
        <div class="sls011-cell">
          <div class="sls011-sg-label">지불코드</div>
          <div class="sls011-cell-field sls011-vselect-slot sls011-fixed-cap sls011-w-control min-w-0">
            <PayCodeList
              :groupCd="groupCd"
              :storeCd="storeCd"
              :init="init"
              @payCd="selectedpayCd" />
          </div>
        </div>
      </div>
    </div>
    <!-- 그리드 영역 -->
    <div class="mt-2 grid min-h-0 flex-1 grid-cols-[7fr,3fr] grid-rows-1 gap-2">
    <div>
      <span class="flex justify-start"
        >*영수내역을 선택하시면 상세내역을 확인할 수 있습니다.</span
      >
      <Realgrid
        :progname="'SLS02_011RPT_VUE'"
        :progid="1"
        :rowData="rowData"
        :valuesData="valuesData"
        :labelsData="labelsData"
        :labelingColumns="'strVoidFlag'"
        :selectionStyle="'singleRow'"
        @clickedRowData="clickedRowData"
        :initSelect="true"
        :exporttoExcel="exceloutput"
        :setStateBar="false"
        :rowStateeditable="false"
        :ExcelNm="'영수증별 매출 조회.'"></Realgrid>
    </div>
    <div class="grid grid-rows-3 grid-cols-1">
      <div>
        <span class="flex justify-start">고객 정보</span>
        <Realgrid
          :progname="'SLS02_011RPT_VUE'"
          :progid="2"
          :rowData="rowData2"
          :rowStateeditable="false"
          :setStateBar="false"></Realgrid>
      </div>
      <div class="mt-5">
        <span class="flex justify-start">주문 정보</span>
        <Realgrid
          :progname="'SLS02_011RPT_VUE'"
          :progid="3"
          :rowData="rowData3"
          :rowStateeditable="false"
          :setStateBar="false"></Realgrid>
      </div>
      <div class="mt-5">
        <span class="flex justify-start">결제 정보</span>
        <Realgrid
          :progname="'SLS02_011RPT_VUE'"
          :progid="4"
          :rowData="rowData4"
          :rowStateeditable="false"
          :setStateBar="false"></Realgrid>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup>
import {
  getCustInfo,
  getOrderInfo,
  getPayInfo,
  getReceiptDatas,
} from "@/api/misales";

/**
 *  매출 일자 호출 컴포넌트
 *  */

import Datepicker1 from "@/components/Datepicker1.vue";

/**
 *  할인 코드 호출 컴포넌트
 *  */

import DisCountCdList from "@/components/disCountCdList.vue";
/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";

/**
 *  결제 코드 호출 컴포넌트
 *  */

/**
 *  결제 코드 호출 컴포넌트
 *  */

import PayCodeList from "@/components/payCodeList.vue";

/**
 *  매장 선택 컴포넌트
 *  */

import PickStoreRenew3 from "@/components/pickStoreRenew.vue";

/**
 *  포스번호 호출 컴포넌트
 *  */

import PosList from "@/components/posList.vue";
/**
 * 	그리드 생성
 */

import Realgrid from "@/components/realgrid.vue";
/**
 *  페이지로그 자동 입력
 *  */

import { insertPageLog } from "@/customFunc/customFunc";
/**
 *  경고창 호출 라이브러리
 *  */

import Swal from "sweetalert2";
/*
 * 공통 표준  Function
 */

import { nextTick, onMounted, onUnmounted, ref } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";

/** 조회 AREA — PUR02_017INS / SLS01 공통 wire 그리드 */
const sls011ControlBorder = "#cbd5e1";
/** 라벨↔입력 간격 */
const sls011ItemGap = "0.5rem";
/** 열(항목) 사이 간격 — 1·2·3열 경계 동일 */
const sls011ColGap = "1.25rem";
const sls011LabelCol = "5.25rem";
/** 매장 제외 단일 콤보·입력 공통 폭 (할인코드 기준, 매장 콤보와 독립) */
const sls011ControlWidth = "15.875rem";
/** 매장 그룹·속성 select — 기본(5.75rem·4.5rem) × 1.5 */
const sls011StoreGroupWidth = "8.625rem";
const sls011StoreAttrWidth = "6.75rem";
/** 매장 v-select(3번째) — 그룹·속성 제외 남은 폭 대비 */
const sls011StoreNameScale = 0.67;

const sls011SearchGridRef = ref(null);
let sls011GapBalanceRaf = 0;
let sls011GapResizeObserver = null;

/** 중앙열(매장·할인)만 우측 이동 — 양끝·콤보 폭 변경 없음 */
function balanceSls011SearchGaps() {
  const grid = sls011SearchGridRef.value;
  if (!grid) return;

  const storeCell = grid.querySelector(".sls011-cell--mid");
  const pickRow = storeCell?.querySelector(".sls011-pick-slot > div.flex");
  if (!storeCell || !pickRow) return;

  let contentRight = 0;
  for (const child of pickRow.children) {
    contentRight = Math.max(contentRight, child.getBoundingClientRect().right);
  }
  if (contentRight <= 0) return;

  const empty = storeCell.getBoundingClientRect().right - contentRight;
  if (empty <= 0) return;

  grid.style.setProperty("--sls011-mid-shift", `${Math.round(empty / 2)}px`);
}

function scheduleBalanceSls011SearchGaps() {
  cancelAnimationFrame(sls011GapBalanceRaf);
  sls011GapBalanceRaf = requestAnimationFrame(balanceSls011SearchGaps);
}

/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  document.body.classList.add("sls011-page-active");
  const pageLog = await insertPageLog(store.state.activeTab2);
  await nextTick();
  scheduleBalanceSls011SearchGaps();
  window.setTimeout(scheduleBalanceSls011SearchGaps, 150);
  window.setTimeout(scheduleBalanceSls011SearchGaps, 500);
  window.addEventListener("resize", scheduleBalanceSls011SearchGaps);
  if (typeof ResizeObserver !== "undefined" && sls011SearchGridRef.value) {
    sls011GapResizeObserver = new ResizeObserver(scheduleBalanceSls011SearchGaps);
    sls011GapResizeObserver.observe(sls011SearchGridRef.value);
    const pickSlot = sls011SearchGridRef.value.querySelector(".sls011-pick-slot");
    if (pickSlot) sls011GapResizeObserver.observe(pickSlot);
  }
});

onUnmounted(() => {
  document.body.classList.remove("sls011-page-active");
  cancelAnimationFrame(sls011GapBalanceRaf);
  window.removeEventListener("resize", scheduleBalanceSls011SearchGaps);
  sls011GapResizeObserver?.disconnect();
});
const selectedDate = ref();

/**
 * 	매출 일자 가져오는 함수
 */

const dateValue = (e) => {
  selectedDate.value = e;
  //comsole.log(selectedDate.value);
  initGrid();
};
const year = (e) => {
  //comsole.log(e);
};
const month = (e) => {
  //comsole.log(e);
};
const day = (e) => {
  //comsole.log(e);
};

/**
 * 페이지 매장 그룹 세팅
 */

const lngStoreGroups = (e) => {
  //comsole.log(e);
};

/**
 * 페이지 매장 코드 세팅
 */

const lngStoreCodes = (e) => {
  //comsole.log(e);
};

const receiptNo = ref();
const initCheckBox = ref(false);
const initSearchWord = ref(false);
const store = useStore();
const loginedstrLang = store.state.userData.lngLanguage;
//comsole.log(store);

const afterSearch = ref(false);
/**
 *  조회 함수
 */

const searchButton = async () => {
  // initCheckBox.value = !initCheckBox.value
  // initSearchWord.value = !initSearchWord.value
  if (storeCd.value == 0) {
    Swal.fire({
      title: "경고",
      text: "매장을 선택하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  store.state.loading = true;
  try {
    initGrid();
    const res = await getReceiptDatas(
      groupCd.value,
      storeCd.value,
      selectedPosNo.value,
      selectedDate.value,
      receiptNo.value,
      disCountCd.value,
      payCd.value,
      loginedstrLang
    );
    //comsole.log(res);

    rowData.value = res.data.RECEIPT;
    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
  } finally {
    store.state.loading = false;
  }
};
const groupCd = ref();
const storeCd = ref();
const dtmDate = ref();
const init = ref(false);

/**
 * 선택한 매장 코드 호출 함수
 */

const selectedStoreCd = (e) => {
  //comsole.log(e);
  storeCd.value = e;

  initGrid();
  selectedPosNo.value = "0";
  receiptNo.value = "";
  init.value = !init.value;
};
/**
 * 선택한 매장 그룹 코드 호출 함수
 */

const selectedGroupCd = (e) => {
  //comsole.log(e);
  groupCd.value = e;
};
const rowData = ref([]);
const rowData2 = ref([]);
const rowData3 = ref([]);
const rowData4 = ref([]);

const selectedPosNo = ref();

/**
 * 선택한 포스 번호 호출 함수
 */

const posNo = (e) => {
  //comsole.log(e);
  if (e == null) {
    selectedPosNo.value = 0;
  } else {
    selectedPosNo.value = e;
  }
};

const disCountCd = ref("");

/**
 * 선택한 할인 코드 호출 함수
 */

const DisCountCd = (e) => {
  //comsole.log(e);
  if (e == null) {
    disCountCd.value = 0;
  } else {
    disCountCd.value = e;
  }
};

const payCd = ref("");

/**
 * 선택한 결제 코드 호출 함수
 */

const selectedpayCd = (e) => {
  if (e == null) {
    payCd.value = 0;
  } else {
    payCd.value = e;
  }
};

const valuesData = ref([
  ["Sales Cancellation", "Menu Correction", "Order Cancellation"],
]);
const labelsData = ref([["매출취소", "메뉴정정", "주문취소"]]);

/**
 * 데이터셋 상세정보 셋팅
 */

const clickedRowData = async (e) => {
  //comsole.log(e);
  const seqId = e[18];

  const res = await getCustInfo(groupCd.value, storeCd.value, seqId);
  rowData2.value = res.data.CUSTOMER;

  const res2 = await getOrderInfo(groupCd.value, storeCd.value, seqId);
  rowData3.value = res2.data.ORDER;

  const res3 = await getPayInfo(
    groupCd.value,
    storeCd.value,
    seqId,
    loginedstrLang
  );

  rowData4.value = res3.data.PAYLIST;

  //comsole.log(res3);
};

const exceloutput = ref(false);
/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 진행해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  exceloutput.value = !exceloutput.value;
};
/**
 * 그리드 초기화
 */

const initGrid = () => {
  if (rowData.value.length != 0) {
    rowData.value = [];
  }
  if (rowData2.value.length != 0) {
    rowData2.value = [];
  }
  if (rowData3.value.length != 0) {
    rowData3.value = [];
  }
  if (rowData4.value.length != 0) {
    rowData4.value = [];
  }
};

const selectedStoreAttr = ref();

/**
 * 페이지 매장 분류 세팅
 */

const lngStoreAttrs = (e) => {
  selectedStoreAttr.value = e;
  initGrid();
  init.value = !init.value;
};
</script>

<style scoped>
.sls011-search-grid {
  display: grid;
  width: 100%;
  min-width: 0;
  align-items: center;
  overflow: visible;
  grid-template-columns: max-content minmax(0, 1fr) max-content;
  column-gap: var(--sls011-col-gap);
  row-gap: var(--sls011-item-gap);
  --sls011-mid-shift: 0px;
}

/* 매장·할인 — translate만 적용(1·3열·콤보 폭 유지) */
.sls011-cell--mid {
  transform: translateX(var(--sls011-mid-shift, 0px));
}

.sls011-cell {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: var(--sls011-item-gap);
  width: max-content;
  max-width: 100%;
}

/* 1·3열 — 그리드 stretch 방지(라벨·콤보 붙여서) */
.sls011-cell:nth-child(3n + 1),
.sls011-cell:nth-child(3n) {
  justify-self: start;
}

.sls011-cell--fill {
  width: 100%;
  max-width: 100%;
}

.sls011-sg-label {
  flex: 0 0 var(--sls011-label-col);
  width: var(--sls011-label-col);
  min-width: var(--sls011-label-col);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 0.9375rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
}

.sls011-cell-field {
  min-width: 0;
  display: flex;
  align-items: center;
}

.sls011-cell--fill .sls011-cell-field {
  flex: 1 1 auto;
  width: 100%;
}

.sls011-cell-field:not(.sls011-fixed-cap) > * {
  min-width: 0;
  width: 100%;
}

/* 고정 폭 — 셀 안 빈 공간 없음(왼쪽 정렬) */
.sls011-cell-field.sls011-fixed-cap {
  flex: 0 0 auto;
  width: auto;
  justify-content: flex-start;
  align-items: center;
}

.sls011-fixed-cap > .sls011-sg-input {
  box-sizing: border-box;
  width: var(--sls011-w-control) !important;
  max-width: var(--sls011-w-control) !important;
  flex: 0 0 auto;
}

.sls011-fixed-cap.sls011-w-control.sls011-date-slot :deep(> div) {
  display: block !important;
  margin: 0 !important;
  padding: 0 !important;
  width: var(--sls011-w-control) !important;
  max-width: var(--sls011-w-control) !important;
  min-width: 0;
  flex: 0 0 auto;
}

.sls011-fixed-cap.sls011-w-control.sls011-vselect-slot :deep(> div) {
  margin-top: 0 !important;
  min-width: 0;
  flex: 0 0 auto !important;
  justify-content: flex-start !important;
  align-items: center !important;
  gap: 0 !important;
  column-gap: 0 !important;
  width: var(--sls011-w-control) !important;
  max-width: var(--sls011-w-control) !important;
}

.sls011-fixed-cap.sls011-w-control.sls011-vselect-slot :deep(> div > *) {
  margin-left: 0 !important;
  margin-right: 0 !important;
}

.sls011-fixed-cap.sls011-w-control.sls011-vselect-slot :deep(.custom-select) {
  width: var(--sls011-w-control) !important;
  max-width: var(--sls011-w-control) !important;
  min-width: 0 !important;
  margin-top: 0 !important;
  margin-left: 0 !important;
}

.sls011-search-panel .sls011-sg-input {
  box-sizing: border-box;
  border: 1px solid var(--sls011-control-border) !important;
}

.sls011-search-panel .sls011-sg-input:focus {
  border-color: #3b82f6 !important;
}

/* Datepicker1 — 외부 라벨, w-36 */
.sls011-date-slot:not(.sls011-fixed-cap) :deep(> div) {
  margin-top: 0 !important;
  width: 100%;
  min-width: 0;
  gap: 0 !important;
}

.sls011-date-slot :deep(> div > span) {
  display: none !important;
}

.sls011-search-panel .sls011-fixed-cap.sls011-date-slot :deep(input[type="date"]) {
  box-sizing: border-box;
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important;
  height: 2rem !important;
  min-height: 2rem !important;
  margin: 0 !important;
  padding-left: 0.5rem !important;
  padding-right: 0.25rem !important;
  font-size: 0.875rem !important;
  line-height: 1.25rem !important;
  border-radius: 0.375rem !important;
  border: 1px solid var(--sls011-control-border) !important;
}

.sls011-search-panel .sls011-date-slot:not(.sls011-fixed-cap) :deep(input[type="date"]) {
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  height: 2rem;
  min-height: 2rem;
  padding-left: 0.5rem;
  padding-right: 0.25rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  border-radius: 0.375rem;
  border: 1px solid var(--sls011-control-border) !important;
}

.sls011-search-panel .sls011-date-slot :deep(input[type="date"]:focus) {
  border-color: #3b82f6 !important;
}

/* PickStoreRenew — 그룹·속성·매장 3단 (사이즈·비율 변경 없음) */
.sls011-pick-slot :deep(> div.flex) {
  margin-top: 0 !important;
  width: 100%;
  min-width: 0;
  flex-wrap: nowrap;
  align-items: center;
  gap: var(--sls011-item-gap) !important;
}

.sls011-pick-slot :deep(> div.flex > div:has(select)) {
  flex: 0 0 auto;
  min-width: 0;
}

.sls011-pick-slot :deep(> div.flex > div:nth-child(1) select) {
  box-sizing: border-box;
  width: var(--sls011-store-group-w);
  max-width: var(--sls011-store-group-w);
  height: 2rem;
  min-height: 2rem;
  margin-left: 0 !important;
  padding: 0 0.375rem;
  font-size: 0.875rem;
  border-radius: 0.375rem;
  border: 1px solid var(--sls011-control-border) !important;
}

.sls011-pick-slot :deep(> div.flex > div:nth-child(2) select) {
  box-sizing: border-box;
  width: var(--sls011-store-attr-w);
  max-width: var(--sls011-store-attr-w);
  height: 2rem;
  min-height: 2rem;
  margin-left: 0 !important;
  padding: 0 0.25rem;
  font-size: 0.875rem;
  border-radius: 0.375rem;
  border: 1px solid var(--sls011-control-border) !important;
}

.sls011-pick-slot :deep(> div.flex > div:last-child) {
  flex: 0 0 auto;
  min-width: 0;
  width: calc(
    (
        100% - var(--sls011-store-group-w) - var(--sls011-store-attr-w) -
          2 * var(--sls011-item-gap)
      ) *
      var(--sls011-store-name-scale, 0.67)
  );
  max-width: calc(
    (
        100% - var(--sls011-store-group-w) - var(--sls011-store-attr-w) -
          2 * var(--sls011-item-gap)
      ) *
      var(--sls011-store-name-scale, 0.67)
  );
}

.sls011-pick-slot :deep(.custom-select) {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important;
  margin-left: 0 !important;
}

.sls011-pick-slot :deep(.custom-select.custom-select--compact .vs__dropdown-toggle) {
  box-sizing: border-box;
  height: 2rem !important;
  min-height: 2rem !important;
  padding: 2px 8px !important;
  border: 1px solid var(--sls011-control-border) !important;
  border-radius: 0.375rem !important;
  overflow: hidden !important;
  flex-wrap: nowrap !important;
}

.sls011-pick-slot :deep(.custom-select.custom-select--compact .vs__selected-options) {
  flex: 1 1 auto !important;
  flex-wrap: nowrap !important;
  min-width: 0 !important;
  max-width: 100% !important;
  overflow: hidden !important;
}

.sls011-pick-slot :deep(.custom-select.custom-select--compact .vs__selected) {
  display: block !important;
  font-size: 0.875rem !important;
  line-height: 1.75rem !important;
  height: auto !important;
  min-width: 0 !important;
  max-width: 100% !important;
  margin-top: 0 !important;
  padding-top: 0 !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}

.sls011-pick-slot :deep(.custom-select.custom-select--compact.vs--disabled .vs__selected) {
  margin-top: 0 !important;
  padding-top: 0 !important;
}

.sls011-pick-slot :deep(.custom-select.custom-select--compact .vs__search) {
  font-size: 0.875rem !important;
}

/* PosList / 할인 / 지불 — 내부 라벨 숨김, v-select h-8 (고정폭은 .sls011-w-control) */
.sls011-vselect-slot:not(.sls011-fixed-cap) :deep(> div) {
  margin-top: 0 !important;
  width: 100%;
  min-width: 0;
  justify-content: flex-start !important;
  gap: 0 !important;
}

.sls011-vselect-slot :deep(> div > div.font-semibold),
.sls011-vselect-slot :deep(> div > .font-semibold) {
  display: none !important;
}

.sls011-vselect-slot:not(.sls011-fixed-cap) :deep(.custom-select) {
  width: 100% !important;
  max-width: 100% !important;
  margin-top: 0 !important;
  margin-left: 0 !important;
}

.sls011-vselect-slot :deep(.custom-select .vs__dropdown-toggle) {
  height: 2rem !important;
  min-height: 2rem !important;
  border: 1px solid var(--sls011-control-border) !important;
  border-radius: 0.375rem !important;
}

.sls011-vselect-slot :deep(.custom-select .vs__selected) {
  font-size: 0.875rem !important;
}

@media (max-width: 960px) {
  .sls011-search-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .sls011-cell--mid {
    transform: none;
  }
}
</style>

<!-- append-to-body 드롭다운 — 이 화면에서만 Realgrid 헤더 위 -->
<style>
body.sls011-page-active .vs__dropdown-menu {
  z-index: 200 !important;
}
</style>
