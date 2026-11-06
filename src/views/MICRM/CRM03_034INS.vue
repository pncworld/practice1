/*--############################################################################
# Filename : CRM03_034INS.vue                                                  
# Description : 고객관리 > 고객 실적 관리 > 고객 메뉴별 할인 현황.              
# Date :2025-06-12                                                             
# Author : 권맑음                     
################################################################################*/
<template>
  <!-- 조회조건 -->
  <div class="flex h-full min-h-0 flex-col" @click="handleParentClick">
    <div
      class="flex shrink-0 items-center justify-between gap-3 overflow-y-hidden pr-1">
      <PageName></PageName>
      <div class="flex shrink-0 items-center justify-end space-x-2 pr-5">
        <button type="button" class="button search md:w-auto w-14" @click="searchButton">
          조회
        </button>
        <button type="button" class="button save w-auto excel" @click="excelButton">
          엑셀
        </button>
      </div>
    </div>

    <!-- 조회 AREA (2026-11-05 정리 : CRM03_004INS 와 같은 방식, 왼쪽 기간·고객등급 / 오른쪽 매장명) -->
    <div
      class="crm334-search-panel z-10 mt-3 w-full max-w-[min(100%,1680px)] min-w-0 shrink-0 self-center overflow-x-auto rounded-md border border-slate-500/70 bg-gray-200 shadow-sm"
      :style="{ '--crm334-control-border': crm334ControlBorder }">
      <div class="crm334-search-grid text-slate-800">
        <div class="crm334-left-stack">
          <!-- 1행: 기간 -->
          <div class="crm334-cell">
            <div class="crm334-label-slot"><span class="crm334-lbl">기간</span></div>
            <div class="crm334-date-slot">
              <Datepicker2
                ref="datepicker"
                :main-name="'기간'"
                :omit-main-label="true"
                :filter-bar-align="true"
                :init-today="1"
                :close-pop-up="closePopUp"
                @end-date="endDate"
                @excel-date="excelDate"
                @start-date="startDate"></Datepicker2>
            </div>
          </div>
          <!-- 2행: 고객등급(소속사) · 셀병합 -->
          <div class="crm334-cell">
            <div class="crm334-label-slot"><span class="crm334-lbl">고객등급</span></div>
            <div class="crm334-level-field">
              <select
                id="crm334-level"
                v-model="cond"
                class="crm334-select h-8 min-h-8 min-w-0 flex-1 rounded-md border border-solid bg-white px-2 text-sm text-slate-800">
                <option value="0">전체</option>
                <option v-for="i in optionList" :key="i.intLevel" :value="i.intLevel">
                  {{ i.strLevelName }}
                </option>
              </select>
              <label class="crm334-check-label shrink-0" for="cond2">
                <input
                  id="cond2"
                  type="checkbox"
                  class="crm334-check"
                  @change="cond2 = $event.target.checked" />
                셀병합
              </label>
            </div>
          </div>
        </div>
        <!-- 오른쪽: 매장명 -->
        <div class="crm334-cell crm334-store-cell">
          <div class="crm334-label-slot"><span class="crm334-lbl">매장명</span></div>
          <div class="crm334-store-slot">
            <PickStoreRenew
              compact
              omit-main-label
              combo-fill
              @lngStoreGroup="lngStoreGroup"
              @lngStoreAttrs="lngStoreAttrs"
              @lngStoreCode="lngStoreCode"
              @excelStore="excelStore"></PickStoreRenew>
          </div>
        </div>
      </div>
    </div>
    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div
      class="mx-auto mt-2 flex min-h-0 w-full max-w-[min(100%,1680px)] flex-1 basis-0 flex-col overflow-hidden px-1 pb-1">
      <div
        class="crm334-main-grid-frame relative flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden rounded-sm border border-gray-400 bg-white">
        <Realgrid
          :progname="'CRM03_034INS_VUE'"
          :progid="1"
          :rowData="rowData"
          :reload="reload"
          :setFooterCustomColumnId="['strName']"
          :setFooterCustomText="['합계']"
          :setRowGroupSpan2="setRowGroupSpan2"
          :setFooter="true"
          :hideColumnsId="hideColumnsId"
          :documentTitle="'CRM03_034INS'"
          @clickedRowData="clickedRowData"
          :documentSubTitle="documentSubTitle"
          :rowStateeditable="false"
          :exporttoExcel="exportExcel">
        </Realgrid>
      </div>
    </div>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import {
  getCustBuyList,
  getCustDisCountList,
  getInitDataCustPurchase,
} from "@/api/micrm";
import Datepicker2 from "@/components/Datepicker2.vue";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
import PickStoreRenew from "@/components/pickStoreRenew.vue";
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

/*
 * 공통 표준  Function
 */

import { onMounted, ref, watch } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";
/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getInitDataCustPurchase(store.state.userData.lngStoreGroup);
  optionList.value = res.data.List;
});
const crm334ControlBorder = "#cbd5e1";
const optionList = ref([]);
const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);
const cond3 = ref(true);
const rowData2 = ref([]);
const rowData3 = ref([]);
const rowData4 = ref([]);
const condValue = ref(0);
const store = useStore();
const cond = ref(0);
const cond2 = ref(false);
const datepicker = ref(null);
const closePopUp = ref(false);

const setRowGroupSpan2 = ref("");
watch(cond2, () => {
  if (cond2.value) {
    setRowGroupSpan2.value =
      "dtmDate,strStoreName,strCdNumber,strCustName,strLevelName";
  } else {
    setRowGroupSpan2.value = "";
  }
  reload.value = !reload.value;
});
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

const sDate = ref();
const eDate = ref();
const startDate = (e) => {
  sDate.value = e;
};
const endDate = (e) => {
  eDate.value = e;
};

const selectedDate = ref();
const excelDate = (e) => {
  selectedDate.value = e;
};

const storeCode = ref();
const lngStoreCode = (e) => {
  storeCode.value = e;
};

const storeAttr = ref();
const lngStoreAttrs = (e) => {
  storeAttr.value = e;
};

const groupCd = ref();
const lngStoreGroup = (e) => {
  groupCd.value = e;
};
/**
 *  조회 함수
 */
const hideColumnsId = ref([]);
const searchButton = async () => {
  try {
    store.state.loading = true;
    initGrid();

    const res = await getCustDisCountList(
      groupCd.value,
      storeCode.value,
      sDate.value,
      eDate.value,
      cond.value
    );

    rowData.value = res.data.List;
    ////console.log(res);
    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    //comsole.log(error);
  } finally {
    store.state.loading = false;
  }
};

/**
 * 페이지 매장 코드 세팅
 */

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
  documentSubTitle.value = selectedDate.value + "\n" + selectedExcelStore.value;

  //documentSubTitle.value += "\n";
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
/*
 * 조회 AREA (2026-11-05, CRM03_004INS 와 같은 방식) — 칸 크기 숫자로 고정, 앞 공백 = 뒤 공백
 *  - 왼쪽 열 : 기간(날짜 2칸 + ~ + 달력 버튼) / 고객등급 + 셀병합, 같은 폭
 *  - 오른쪽 열 : 매장명, 화면이 좁으면 줄어듦
 */
.crm334-search-panel {
  --crm334-pad-x: 3rem;
  --crm334-col-gap: 2.5rem;
  --crm334-row-gap: 0.5rem;
  --crm334-item-gap: 1rem;
  --crm334-label-w: 4.5rem; /* 「고객등급」 글자 폭 */
  --crm334-date-w: 12rem; /* 날짜 칸 1개 = 콤보 1개 기준 12rem */
  --crm334-tilde-w: 0.75rem;
  --crm334-cal-btn-w: 2rem;
  --crm334-range-gap: 0.25rem;
  --crm334-field-w: calc(
    var(--crm334-date-w) * 2 + var(--crm334-tilde-w) + var(--crm334-cal-btn-w) + var(--crm334-range-gap) * 3
  );
  --crm334-store-w: 34rem;
}

.crm334-search-grid {
  display: grid;
  grid-template-columns: max-content minmax(0, calc(var(--crm334-label-w) + var(--crm334-item-gap) + var(--crm334-store-w)));
  justify-content: space-between;
  align-items: start;
  column-gap: var(--crm334-col-gap);
  padding: 0.75rem var(--crm334-pad-x);
  min-width: 0;
}

.crm334-left-stack {
  display: flex;
  flex-direction: column;
  row-gap: var(--crm334-row-gap);
  min-width: 0;
}

.crm334-cell {
  display: flex;
  min-height: 2rem;
  align-items: center;
  gap: var(--crm334-item-gap);
  min-width: 0;
}

.crm334-lbl {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(30 41 59);
  white-space: nowrap;
}

/* 항목명 칸 : 기간·고객등급·매장명 같은 폭, 가운데 정렬 */
.crm334-label-slot {
  display: flex;
  flex: 0 0 var(--crm334-label-w);
  width: var(--crm334-label-w);
  min-height: 2rem;
  align-items: center;
  justify-content: center;
}

/* 기간 Datepicker2 (filterBarAlign) — 구성 요소 고정 크기, 전체 폭 = --crm334-field-w */
.crm334-date-slot {
  flex: 0 0 var(--crm334-field-w);
  width: var(--crm334-field-w);
}

.crm334-date-slot :deep(> div.flex.justify-start.items-center) {
  width: var(--crm334-field-w) !important;
  max-width: none !important;
  min-height: 2rem;
  margin: 0 !important;
  gap: 0 !important;
  align-items: center;
}

.crm334-date-slot :deep(> div.flex > div.inline-flex.h-8) {
  flex: 0 0 auto;
  width: var(--crm334-field-w);
  margin: 0 !important;
  padding: 0 !important;
  gap: var(--crm334-range-gap) !important;
}

.crm334-date-slot :deep(input[type="date"]) {
  flex: 0 0 var(--crm334-date-w);
  width: var(--crm334-date-w) !important;
  max-width: none !important;
  height: 2rem !important;
  margin: 0 !important;
  border: 1px solid var(--crm334-control-border) !important;
  box-sizing: border-box;
}

.crm334-date-slot :deep(input[type="date"]:focus) {
  border-color: #3b82f6 !important;
}

.crm334-date-slot :deep(div.inline-flex.h-8 > span) {
  flex: 0 0 var(--crm334-tilde-w);
  width: var(--crm334-tilde-w);
  margin: 0 !important;
  padding: 0 !important;
  text-align: center;
}

.crm334-date-slot :deep(div.inline-flex.h-8 > button) {
  flex: 0 0 var(--crm334-cal-btn-w);
  width: var(--crm334-cal-btn-w) !important;
  min-width: var(--crm334-cal-btn-w) !important;
  height: 2rem !important;
  margin: 0 !important;
  padding: 0 !important;
}

/* 고객등급 + 셀병합 : 끝선 = 기간 끝선 */
.crm334-level-field {
  display: flex;
  flex: 0 0 var(--crm334-field-w);
  width: var(--crm334-field-w);
  min-height: 2rem;
  align-items: center;
  gap: 0.75rem;
}

.crm334-select {
  border: 1px solid var(--crm334-control-border) !important;
  box-sizing: border-box;
}

.crm334-select:focus {
  border-color: #3b82f6 !important;
  outline: none;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.35);
}

.crm334-check-label {
  display: inline-flex;
  min-height: 2rem;
  cursor: pointer;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: rgb(55 65 81);
}

.crm334-check {
  height: 1rem;
  width: 1rem;
  flex-shrink: 0;
}

/* 매장명 PickStoreRenew (compact·comboFill) — 칸 폭을 채움, 높이 2rem·테두리 통일 */
.crm334-store-cell {
  justify-self: stretch;
}

.crm334-store-slot {
  display: flex;
  flex: 1 1 auto;
  min-width: 0;
  min-height: 2rem;
  align-items: center;
}

/*
 * PickStoreRenew 안쪽은 [그룹 select] [속성 select] [매장 v-select] 를 감싼 div 가 내용 크기라,
 * comboFill 만으로는 매장 콤보가 쪼그라듦 → ACT09_004RPT 와 같이 안쪽을 3열 그리드로 펴서 칸을 채움
 * (그룹 : 속성 : 매장 = 고정 2칸 + 나머지)
 */
.crm334-store-slot :deep(> div.flex) {
  display: grid !important;
  grid-template-columns: 8rem 8rem minmax(0, 1fr) !important;
  column-gap: 0.5rem;
  width: 100% !important;
  min-width: 0 !important;
  max-width: 100% !important;
  margin-top: 0 !important;
  align-items: center !important;
}

.crm334-store-slot :deep(> div.flex > div) {
  width: 100% !important;
  min-width: 0 !important;
}

.crm334-store-slot :deep(> div.flex > div select) {
  box-sizing: border-box;
  width: 100% !important;
  max-width: 100% !important;
  height: 2rem;
  min-height: 2rem;
  margin-left: 0 !important;
  padding: 0 0.375rem;
  font-size: 0.875rem;
  border-radius: 0.375rem;
  border: 1px solid var(--crm334-control-border) !important;
}

.crm334-store-slot :deep(.custom-select) {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important;
  margin-left: 0 !important;
}

.crm334-store-slot :deep(.custom-select.custom-select--compact .vs__dropdown-toggle) {
  box-sizing: border-box;
  height: 2rem !important;
  min-height: 2rem !important;
  padding: 2px 8px !important;
  border: 1px solid var(--crm334-control-border) !important;
  border-radius: 0.375rem !important;
  background: #fff;
  overflow: hidden !important;
  flex-wrap: nowrap !important;
}

.crm334-store-slot :deep(.custom-select.custom-select--compact .vs__selected-options) {
  flex: 1 1 auto !important;
  flex-wrap: nowrap !important;
  min-width: 0 !important;
  overflow: hidden !important;
}

.crm334-store-slot :deep(.custom-select.custom-select--compact .vs__selected) {
  display: block !important;
  font-size: 0.875rem !important;
  line-height: 1.75rem !important;
  margin-top: 0 !important;
  padding-top: 0 !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}

/* 메인 그리드 : 뷰포트에 맞는 최소 높이 */
.crm334-main-grid-frame {
  min-height: min(65vh, 420px);
}

@media (max-height: 800px) {
  .crm334-main-grid-frame {
    min-height: min(52vh, 300px);
  }
}

@media (max-height: 900px) {
  .crm334-search-panel {
    margin-top: 0.25rem !important;
  }

  .crm334-search-grid {
    padding-top: 0.5rem !important;
    padding-bottom: 0.5rem !important;
  }
}
</style>
