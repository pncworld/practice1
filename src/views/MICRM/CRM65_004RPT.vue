<!-- /*--############################################################################
# Filename : CRM65_004RPT.vue
# Description : 고객관리 > 전자상품권 현황 > 전자상품권 거래 내역 집계
# Date :2025-06-19
# Author : 권맑음
################################################################################*/ -->
<template>
  <div class="flex h-full min-h-0 flex-col pl-5" @click="handleParentClick">
    <div
      class="flex w-full shrink-0 items-center justify-between overflow-y-hidden">
      <PageName></PageName>
      <div class="mr-9 flex justify-center space-x-2 pr-5">
        <button type="button" class="button search md:w-auto w-14" @click="searchButton">
          조회
        </button>
        <button type="button" class="button save w-auto excel" @click="excelButton">
          엑셀
        </button>
      </div>
    </div>

    <div
      class="crm6504-search-panel z-10 mt-3 w-full min-h-0 shrink-0 overflow-visible rounded-lg bg-gray-200"
      :style="{
        '--crm6504-control-border': crm6504ControlBorder,
        '--crm6504-col-gap': crm6504ColGutter,
        '--crm6504-item-gap': crm6504ItemGap,
        '--crm6504-row-gap': crm6504RowGap,
        '--crm6504-label-col': crm6504LabelCol,
        '--crm6504-panel-pad-x': crm6504PanelPadX,
        '--crm6504-select-w': crm6504SelectW,
        '--crm6504-control-h': crm6504ControlH,
        '--crm6504-row-min-h': crm6504RowMinH,
        '--psp-label-w': crm6504LabelCol,
        '--psp-radio-w': '4.75rem',
        '--psp-col-gap': '0.5rem',
      }">
      <!--
        레거시형 2행:
        좌 — row1 일자 / row2 구분·권종
        우 — 매장별 체크 + PickStorePlural(직/가맹 · 팀/SC)
      -->
      <div class="crm6504-search-layout min-w-0">
        <div class="crm6504-left-stack min-w-0">
          <div class="crm6504-row">
            <span class="crm6504-lbl shrink-0">일자</span>
            <div class="crm6504-date-slot min-w-0 flex-1">
              <Datepicker2
                ref="datepicker"
                :main-name="'일자'"
                omit-main-label
                filter-bar-align
                :close-pop-up="closePopUp"
                @excel-date="excelDate"
                @start-date="startDate"
                @end-date="endDate"></Datepicker2>
            </div>
          </div>

          <div class="crm6504-row crm6504-row--pair">
            <div class="crm6504-pair-item min-w-0">
              <span class="crm6504-lbl shrink-0">구분</span>
              <select v-model="cond2" class="crm6504-select">
                <option value="0">전체</option>
                <option
                  v-for="i in optionList"
                  :key="i.lngGftCategory"
                  :value="i.lngGftCategory">
                  {{ i.strGftCategory }}
                </option>
              </select>
            </div>
            <div class="crm6504-pair-item min-w-0">
              <span class="crm6504-lbl crm6504-lbl--short shrink-0">권종</span>
              <select v-model="cond3" class="crm6504-select">
                <option value="0">전체</option>
                <option
                  v-for="i in optionList2"
                  :key="i.lngGftType"
                  :value="i.lngGftType">
                  {{ i.strGftType }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div class="crm6504-right-store min-w-0 overflow-visible">
          <label class="crm6504-store-check" title="매장별 조회">
            <input
              v-model="cond"
              type="checkbox"
              class="crm6504-check"
              aria-label="매장별 조회" />
          </label>
          <div class="crm6504-pick-wrap min-w-0 flex-1">
            <PickStorePlural
              fluid-width
              @lngStoreGroup="lngStoreGroup"
              @lngStoreCodes="lngStoreCodes"></PickStorePlural>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-2 flex min-h-0 min-w-0 flex-1 flex-col">
      <div class="relative min-h-0 w-full flex-1">
        <Realgrid
          class="h-full min-h-0 w-full"
          :progname="'CRM65_004RPT_VUE'"
          :progid="1"
          :rowData="rowData"
          :reload="reload"
          :mergeColumnGroupName2="[
            '생성',
            '출고',
            '판매',
            '충전',
            '회수',
            '사용',
            '분실',
            '잔고',
          ]"
          :mergeColumnGroupSubList2="[
            ['lngCreateCnt', 'lngCreateAmt'],
            ['lngReleaseCnt', 'lngReleaseAmt'],
            ['lngSaleCnt', 'lngSaleAmt'],
            ['lngChargeCnt', 'lngChargeAmt'],
            ['lngReturnCnt', 'lngReturnAmt'],
            ['lngUseCnt', 'lngUseAmt'],
            ['lngLoseCnt', 'lngLoseAmt'],
            ['lngBalCnt', 'lngBalAmt'],
          ]"
          :hideColumnsId="hideColumnsId"
          :mergeColumns2="true"
          :documentTitle="'CRM65_004RPT'"
          :documentSubTitle="documentSubTitle"
          :rowStateeditable="false"
          :exporttoExcel="exportExcel">
        </Realgrid>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getCommonList } from "@/api/common";
import {
  getGftLedgerTradeAggList,
  getGftLedgerTradeList,
  getInitGftData,
} from "@/api/micrm";
import Datepicker2 from "@/components/Datepicker2.vue";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
import PickStorePlural from "@/components/pickStorePlural.vue";
/**
 * 	매장 단일 선택 컴포넌트
 */
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

import { onMounted, ref, watch } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";

const store = useStore();
const crm6504ControlBorder = "#cbd5e1";
const crm6504ColGutter = "1.25rem";
const crm6504ItemGap = "0.75rem";
const crm6504RowGap = "0.75rem";
const crm6504LabelCol = "5rem";
const crm6504PanelPadX = "2rem";
/** 구분·권종 — 일자(date) 한 칸에 가깝게 (좌측 오버플로로 체크 가림 방지) */
const crm6504SelectW = "9.5rem";
const crm6504ControlH = "2rem";
const crm6504RowMinH = "2rem";

/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getCommonList(254);

  optionList3.value = res.data.List;
  const res2 = await getInitGftData(store.state.userData.lngStoreGroup);

  optionList.value = res2.data.List;
  optionList2.value = res2.data.List2;
});

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);
const selectedCond = ref(0);
const condValue = ref(0);
const cond = ref(false);
const cond2 = ref(0);
const cond3 = ref(0);
const cond4 = ref(true);
const cond5 = ref(true);
const cond6 = ref(true);
const cond7 = ref(true);
const cond8 = ref(true);
const cond9 = ref(true);
const cond10 = ref(true);
const cond11 = ref(true);
const cond12 = ref(true);
const cond13 = ref(true);
const cond14 = ref(true);
const cond15 = ref(true);
const cond16 = ref(true);
const optionList = ref([]);
const optionList2 = ref([]);
const optionList3 = ref([]);
const datepicker = ref(null);
const closePopUp = ref(false);
const custId = ref("");

const strSaleCustID = (e) => {
  initGrid();
  custId.value = e;
};
const custNm = ref("");
const strSaleCustName = (e) => {
  custNm.value = e;
};
const sd = ref("");
const groupCd = ref("");
const ed = ref("");
const storeCds = ref("");
const selectedDate = ref("");
const startDate = (e) => {
  sd.value = e;
};
const endDate = (e) => {
  ed.value = e;
};
const lngStoreGroup = (e) => {
  groupCd.value = e;
};
const lngStoreCodes = (e) => {
  storeCds.value = e;
};

const excelDate = (e) => {
  selectedDate.value = e;
};
/**
 * 매출 일자 안 라디오박스 닫기 위한 외부 클릭 감지 함수
 */

const handleParentClick = (e) => {
  const datepickerEl = datepicker.value?.$el;
  if (datepickerEl && datepickerEl.contains(e.target)) {
    return;
  }
  closePopUp.value = !closePopUp.value;
};

/**
 *  조회 함수
 */

const hideColumnsId = ref(["strStoreName"]);
const searchButton = async () => {
  if (sd.value == null || ed.value == null) {
    Swal.fire({
      title: "경고",
      text: "일자을 선택하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  try {
    store.state.loading = true;
    initGrid();
    if (cond.value == true) {
      hideColumnsId.value = [];
    } else {
      hideColumnsId.value = ["strStoreName"];
    }
    const res = await getGftLedgerTradeAggList(
      groupCd.value,
      storeCds.value,
      cond2.value,
      cond3.value,
      sd.value,
      ed.value,
      cond.value == true ? 1 : 0,
      store.state.userData.strLanguage
    );
    ////console.log(res);
    rowData.value = res.data.List;

    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    ////console.log(error);
  } finally {
    store.state.loading = false;
  }
};

/* 매장 컴포넌트 관련 함수 */
const selectedGroup = ref();
const selectedStores = ref();
const selectedStoreAttrs = ref();

/**
 * 페이지 매장 코드 세팅
 */

const lngStoreCode = async (e) => {
  initGrid();
  selectedStores.value = e;
  ////console.log(e);
};

/**
 * 그리드 초기화
 */

const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
};

//엑셀 버튼 처리 함수
const exportExcel = ref(false);
/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  documentSubTitle.value = selectedDate.value;

  exportExcel.value = !exportExcel.value;
};

// 엑셀 추출
const documentSubTitle = ref("");
const selectedExcelList = ref("");

const selectedExcelStore = ref("");
/**
 * 엑셀용 매장 세팅 함수
 */

const excelStore = (e) => {
  selectedExcelStore.value = e;
  //comsole.log(e);
};
const excelList = (e) => {
  selectedExcelList.value = e;
  //comsole.log(e);
};
</script>

<style scoped>
.crm6504-search-panel {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  padding-block: 0.75rem;
  padding-left: var(--crm6504-panel-pad-x, 2rem);
  padding-right: var(--crm6504-panel-pad-x, 2rem);
  overflow-x: visible;
}

.crm6504-search-layout {
  display: grid;
  grid-template-columns: max-content minmax(0, 1fr);
  column-gap: var(--crm6504-col-gap, 1.25rem);
  align-items: center;
  min-width: 0;
}

.crm6504-left-stack {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--crm6504-row-gap, 0.75rem);
  width: max-content;
  max-width: 100%;
  min-width: 0;
}

.crm6504-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--crm6504-item-gap, 0.75rem);
  min-width: 0;
  min-height: var(--crm6504-row-min-h, 2rem);
}

.crm6504-row--pair {
  gap: 1rem;
}

.crm6504-pair-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--crm6504-item-gap, 0.75rem);
  min-width: 0;
}

.crm6504-lbl {
  box-sizing: border-box;
  flex: 0 0 var(--crm6504-label-col, 5rem);
  width: var(--crm6504-label-col, 5rem);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: var(--crm6504-row-min-h, 2rem);
  font-size: 0.9375rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
  white-space: nowrap;
}

.crm6504-lbl--short {
  flex-basis: 3rem;
  width: 3rem;
}

.crm6504-store-check {
  box-sizing: border-box;
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  margin: 0;
  cursor: pointer;
  position: relative;
  z-index: 5;
  pointer-events: auto;
}

.crm6504-check {
  width: 1rem;
  height: 1rem;
  margin: 0;
  flex-shrink: 0;
  cursor: pointer;
  pointer-events: auto;
  accent-color: #2563eb;
}

.crm6504-select {
  box-sizing: border-box;
  width: var(--crm6504-select-w, 9.5rem);
  max-width: 100%;
  min-width: 0;
  height: var(--crm6504-control-h, 2rem);
  min-height: var(--crm6504-control-h, 2rem);
  max-height: var(--crm6504-control-h, 2rem);
  padding: 0 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: rgb(30 41 59);
  background: #fff;
  border: 1px solid var(--crm6504-control-border, #cbd5e1);
  border-radius: 0.375rem;
}

.crm6504-select:focus {
  border-color: #3b82f6;
  outline: none;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.35);
}

.crm6504-date-slot :deep(> div.flex.justify-start.items-center) {
  margin: 0 !important;
  width: max-content !important;
  max-width: 100%;
  min-height: var(--crm6504-row-min-h, 2rem);
  align-items: center;
}

.crm6504-date-slot :deep(input[type="date"]) {
  box-sizing: border-box;
  height: var(--crm6504-control-h, 2rem);
  min-height: var(--crm6504-control-h, 2rem);
  max-height: var(--crm6504-control-h, 2rem);
  border: 1px solid var(--crm6504-control-border, #cbd5e1);
  border-radius: 0.375rem;
  background: #fff;
}

.crm6504-date-slot :deep(input[type="date"]:focus) {
  border-color: #3b82f6;
}

.crm6504-date-slot :deep(div.inline-flex.h-8),
.crm6504-date-slot :deep(button) {
  height: var(--crm6504-control-h, 2rem) !important;
  min-height: var(--crm6504-control-h, 2rem) !important;
}

.crm6504-right-store {
  position: relative;
  z-index: 4;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.4rem;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  overflow: visible;
}

.crm6504-pick-wrap {
  position: relative;
  z-index: 1;
  min-width: 0;
  width: 100%;
}

.crm6504-right-store:has(.psp-popup),
.crm6504-right-store:has(.psp-store-hover-list) {
  z-index: 50;
}

.crm6504-right-store :deep(.psp-root) {
  grid-template-columns:
    var(--psp-label-w, 5rem)
    minmax(var(--psp-radio-w, 4.75rem), auto)
    minmax(0, 1.05fr)
    minmax(0, 1.3fr)
    minmax(0, 1.35fr);
  column-gap: var(--psp-col-gap, 0.5rem);
  row-gap: var(--crm6504-row-gap, 0.75rem);
  width: 100%;
  max-width: 100%;
  min-width: 0;
}

.crm6504-right-store :deep(.psp-label) {
  width: var(--psp-label-w, 5rem);
  justify-content: flex-start;
  padding-inline-start: 0;
  font-size: 0.9375rem;
  font-weight: 600;
}

.crm6504-right-store :deep(.psp-select),
.crm6504-right-store :deep(.psp-store-trigger),
.crm6504-right-store :deep(.psp-collapse-btn) {
  height: var(--crm6504-control-h, 2rem) !important;
  min-height: var(--crm6504-control-h, 2rem) !important;
}

.crm6504-right-store :deep(.psp-collapse-btn) {
  width: var(--crm6504-control-h, 2rem) !important;
}

.crm6504-right-store :deep(.psp-popup) {
  z-index: 60;
  right: 0;
  left: auto;
  width: min(42rem, 92vw);
  min-width: 28rem;
  max-width: min(42rem, 92vw);
}

@media (max-width: 1280px) {
  .crm6504-search-layout {
    grid-template-columns: minmax(0, 1fr);
    row-gap: var(--crm6504-row-gap, 0.75rem);
    align-items: start;
  }

  .crm6504-left-stack {
    width: 100%;
  }

  .crm6504-row--pair {
    flex-wrap: wrap;
  }

  .crm6504-select {
    width: min(var(--crm6504-select-w, 9.5rem), 100%);
  }

  .crm6504-date-slot :deep(> div.flex.justify-start.items-center) {
    width: 100% !important;
  }

  .crm6504-right-store :deep(.psp-popup) {
    left: 0;
    right: auto;
  }
}
</style>
