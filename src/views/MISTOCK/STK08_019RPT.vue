<!-- /*--############################################################################
# Filename : STK08_019RPT.vue                                                  
# Description : 자재관리2 > 재고 현황 > 파트별 월수불 현황                      
# Date :2025-09-18                                                             
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <div class="flex h-full min-h-0 flex-col" @click="handleParentClick">
    <div
      class="flex shrink-0 justify-between items-center w-full overflow-y-hidden">
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
      class="z-10 mt-3 w-full min-w-0 shrink-0 overflow-x-auto rounded-lg bg-gray-200 px-8 py-3 md:px-12">
      <div
        class="stk08019-search-grid min-w-0"
        :style="{
          '--stk08019-control-border': stk08019ControlBorder,
          '--stk08019-item-gap': stk08019ItemGap,
        }">
        <div class="stk08019-cell">
          <div class="stk08019-sg-label">마감월</div>
          <div class="stk08019-cell-field stk08019-month-slot min-w-0">
            <DatePicker4
              main-name=""
              @month="month"
              @year="year" />
          </div>
        </div>
        <div class="stk08019-cell">
          <div class="stk08019-sg-label">매장</div>
          <div class="stk08019-cell-field stk08019-pick-slot min-w-0">
            <PickStore
              compact-search-bar
              :main-name="''"
              @update:storeGroup="lngStoreGroup"
              :defaultStoreNm="'전체'"
              :hideGroup="false"
              :hideAttr="false"
              @storeNm="excelStore"
              @update:storeCd="lngStoreCode" />
          </div>
        </div>
        <div class="stk08019-cell">
          <div class="stk08019-sg-label">파트</div>
          <div class="stk08019-cell-field min-w-0">
            <select
              id="stk08-019-cond-part"
              v-model="cond"
              class="stk08019-select h-8 w-full min-w-0 rounded-md border border-solid bg-white text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option
                v-for="i in optionList6"
                :key="i.lngPartCode"
                :value="i.lngPartCode">
                {{ i.strPartName }}
              </option>
            </select>
          </div>
        </div>

        <div class="stk08019-cell">
          <div class="stk08019-sg-label">자재분류</div>
          <div class="stk08019-cell-field min-w-0">
            <select
              id="stk08-019-cond-category"
              v-model="cond2"
              class="stk08019-select h-8 w-full min-w-0 rounded-md border border-solid bg-white text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="0">전체</option>
              <option
                v-for="i in optionList"
                :key="i.lngDetail"
                :value="i.lngDetail">
                {{ i.strDetail }}
              </option>
            </select>
          </div>
        </div>
        <div class="stk08019-cell">
          <div class="stk08019-sg-label">자재그룹</div>
          <div class="stk08019-cell-field min-w-0">
            <select
              id="stk08-019-cond-stock-group"
              v-model="cond3"
              class="stk08019-select h-8 w-full min-w-0 rounded-md border border-solid bg-white text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="0">전체</option>
              <option
                v-for="i in optionList2"
                :key="i.lngStockGroupID"
                :value="i.lngStockGroupID">
                {{ i.strStockGroupName }}
              </option>
            </select>
          </div>
        </div>
        <div class="stk08019-cell">
          <div class="stk08019-sg-label">자재특성</div>
          <div class="stk08019-cell-field min-w-0">
            <select
              id="stk08-019-cond-generic"
              v-model="cond4"
              class="stk08019-select h-8 w-full min-w-0 rounded-md border border-solid bg-white text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="0">전체</option>
              <option
                v-for="i in optionList3"
                :key="i.lngGenericID"
                :value="i.lngGenericID">
                {{ i.strGenericName }}
              </option>
            </select>
          </div>
        </div>

        <div class="stk08019-cell">
          <div class="stk08019-sg-label">자재코드/명</div>
          <div
            class="stk08019-cell-field stk08019-dual-input flex min-h-8 min-w-0 flex-nowrap items-center gap-2">
            <input
              id="stk08-019-stock-id"
              v-model="cond5"
              type="text"
              autocomplete="off"
              placeholder="자재코드"
              class="stk08019-input stk08019-input--code h-8 min-h-8 min-w-0 rounded-md border border-solid bg-white px-2 text-sm text-gray-700" />
            <input
              id="stk08-019-stock-name"
              v-model="cond6"
              type="text"
              autocomplete="off"
              placeholder="자재명"
              class="stk08019-input stk08019-input--name h-8 min-h-8 min-w-0 rounded-md border border-solid bg-white px-2 text-sm text-gray-700" />
          </div>
        </div>
        <div class="stk08019-cell">
          <div class="stk08019-sg-label">단위</div>
          <div class="stk08019-cell-field min-w-0">
            <select
              id="stk08-019-cond-unit"
              v-model="cond7"
              class="stk08019-select h-8 w-full min-w-0 rounded-md border border-solid bg-white text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option
                v-for="i in optionList4"
                :key="i.strDCode"
                :value="i.strDCode">
                {{ i.strDName }}
              </option>
            </select>
          </div>
        </div>
        <div class="stk08019-cell">
          <div class="stk08019-sg-label">단가</div>
          <div class="stk08019-cell-field min-w-0">
            <select
              id="stk08-019-cond-price"
              v-model="cond8"
              class="stk08019-select h-8 w-full min-w-0 rounded-md border border-solid bg-white text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option
                v-for="i in optionList5"
                :key="i.strDCode"
                :value="i.strDCode">
                {{ i.strDName }}
              </option>
            </select>
          </div>
        </div>
      </div>
      <div
        class="stk08019-footer mt-2 flex min-w-0 flex-nowrap items-center justify-between gap-4">
        <p class="min-w-0 text-sm font-semibold text-red-500">
          ※사용량 = 기초 + 입고(매입 + 매장간입고) - 출고(손실 + 매장간출고) -
          실사
        </p>
        <label
          for="stk08-019-cond-all"
          class="flex shrink-0 cursor-pointer items-center gap-1 whitespace-nowrap text-sm font-semibold text-gray-900">
          <input id="stk08-019-cond-all" v-model="cond9" type="checkbox" />
          전체보기
        </label>
      </div>
    </div>
    <div class="mt-2 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <div class="relative h-full min-h-0 min-w-0 flex-1">
        <Realgrid
        :progname="'STK08_019RPT_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :setStateBar="false"
        :mergeColumnGroupName2="[
          '기초재고',
          '매입',
          '반품',
          '매장간입고',
          '입고계',
          '손실',
          '매장간출고',
          '출고 계',
          '실사',
          '사용량',
        ]"
        :mergeColumnGroupSubList2="[
          ['dblInitQty', 'curInitCost'],
          ['dblCheckQty', 'curCheckCost'],
          ['dblReturnQty', 'curReturnCost'],
          ['dblStoreMoveInQty', 'curStoreMoveInCost'],
          ['dblInTotQty', 'curInTotCost'],
          ['dblLossQty', 'curLossCost'],
          ['dblStoreMoveOutQty', 'curStoreMoveOutCost'],
          ['dblOutTotQty', 'curOutTotCost'],
          ['dblTakeQty', 'curTakeCost'],
          ['dblUsageQty', 'curUsageCost'],
        ]"
        :headerColors="['', '', '', '', 'green', '', '', 'green', '', 'red']"
        :mergeColumns2="true"
        :documentTitle="'STK08_019RPT'"
        @clickedRowData="clickedRowData"
        :setFooter="true"
        :setMergeMode="false"
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
import { getStockGeneric, getStockGroup } from "@/api/master";
import {
  getLossMasterPartList,
  getStockDetail,
  getStockMonthlyInOutList,
  getStockMonthlyInOutListByPart,
} from "@/api/mistock";
import DatePicker4 from "@/components/DatePicker4.vue";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
import PickStore from "@/components/pickStore.vue";
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
import Swal from "sweetalert2";
/**
 *  경고창 호출 라이브러리
 *  */

/*
 * 공통 표준  Function
 */

import { onMounted, ref } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";
/**
 * 	화면 Load시 실행 스크립트
 */

const optionList3 = ref([]);
onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getStockDetail(store.state.userData.lngStoreGroup, "01");

  console.log(res);
  optionList.value = res.data.List;

  const res2 = await getStockGroup(store.state.userData.lngStoreGroup);

  optionList2.value = res2.data.List;

  const res3 = await getStockGeneric(store.state.userData.lngStoreGroup);

  optionList3.value = res3.data.List;

  const res4 = await getCommonList(166);
  console.log(res4);
  optionList4.value = res4.data.List.filter((item) => item.strDCode != "01");

  const res5 = await getCommonList(171);
  console.log(res5);
  optionList5.value = res5.data.List;

  const today = new Date();
  sdate.value = today.getFullYear();

  edate.value = String(today.getMonth()).padStart(2, "0");
});
const optionList4 = ref([]);
const optionList5 = ref([]);
const optionList6 = ref([]);
const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

const edate = ref("01");
const sdate = ref(2025);
const cond = ref("0");
const cond2 = ref("0");
const cond3 = ref("0");
const cond4 = ref("0");
const cond5 = ref("");
const cond6 = ref("");
const cond7 = ref("05");
const cond8 = ref("03");

const store = useStore();

const stk08019ControlBorder = "#cbd5e1";
const stk08019ItemGap = "0.75rem";

const datepicker = ref(null);
const closePopUp = ref(false);
const optionList = ref([]);
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
  initGrid();
  sDate.value = e;
};
const endDate = (e) => {
  initGrid();
  eDate.value = e;
};

const selectedDate = ref();
const excelDate = (e) => {
  selectedDate.value = e;
};
const optionList2 = ref([]);

const teamcode = ref();
const lngTeamCode = (e) => {
  teamcode.value = e;
};
const supervisor = ref();
const lngSupervisor = (e) => {
  supervisor.value = e;
};
const storeCode = ref();
const lngStoreCode = async (e) => {
  initGrid();
  storeCode.value = e;

  const res2 = await getLossMasterPartList(
    store.state.userData.lngStoreGroup,
    storeCode.value
  );

  optionList6.value = res2.data.List;
};

const storeAttr = ref();
const lngStoreAttrs = (e) => {
  storeAttr.value = e;
};

const groupCd = ref();
const lngStoreGroup = (e) => {
  groupCd.value = e;
};

const supplierid = ref("");
const SupplierId = (e) => {
  supplierid.value = e;
};
/**
 *  조회 함수
 */
const toStk08019Num = (v) => {
  if (v === undefined || v === null || v === "") return 0;
  const n = Number(String(v).replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
};

/** 매장간입고·입고계(매입+매장간입고) 행 매핑 */
const mapStk08019GridRow = (row) => {
  if (!row || typeof row !== "object") return row;
  const dblCheckQty = toStk08019Num(row.dblCheckQty);
  const curCheckCost = toStk08019Num(row.curCheckCost);
  const dblStoreMoveInQty = toStk08019Num(row.dblStoreMoveInQty);
  const curStoreMoveInCost = toStk08019Num(row.curStoreMoveInCost);
  return {
    ...row,
    dblStoreMoveInQty,
    curStoreMoveInCost,
    dblInTotQty: dblCheckQty + dblStoreMoveInQty,
    curInTotCost: curCheckCost + curStoreMoveInCost,
  };
};

const mapStk08019GridList = (list) =>
  Array.isArray(list) ? list.map((row) => mapStk08019GridRow(row)) : [];

const searchButton = async () => {
  try {
    store.state.loading = true;
    initGrid();

    const res = await getStockMonthlyInOutListByPart(
      groupCd.value,
      storeCode.value,
      cond.value,
      selectedYear.value + selectedMonth.value,
      cond2.value,
      cond3.value,
      cond4.value,
      cond7.value,
      cond8.value,
      cond9.value == true ? "02" : "01",
      cond5.value,
      cond6.value,
      0,
      "M"
    );

    rowData.value = mapStk08019GridList(res.data.List);
    console.log(res);
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

  reload.value = !reload.value;
};

//엑셀 버튼 처리 함수
const exportExcel = ref(false);
/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  documentSubTitle.value =
    "일자 :" +
    selectedYear.value +
    "년" +
    selectedMonth.value +
    "월" +
    "\n" +
    "매장명 :" +
    selectedExcelStore.value;
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

const cond9 = ref(false);

const selectedYear = ref("");
const year = (e) => {
  selectedYear.value = e;
};

const selectedMonth = ref("");
const month = (e) => {
  selectedMonth.value = e;
};
</script>

<style scoped>
.stk08019-search-grid {
  --stk08019-label-col: 7rem;
  display: grid;
  width: 100%;
  min-width: 0;
  align-items: center;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  column-gap: var(--stk08019-item-gap);
  row-gap: var(--stk08019-item-gap);
}

.stk08019-cell {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: var(--stk08019-item-gap);
}

.stk08019-sg-label {
  flex: 0 0 var(--stk08019-label-col);
  width: var(--stk08019-label-col);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
}

.stk08019-cell-field {
  min-width: 0;
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  width: 100%;
}

.stk08019-cell-field:not(.stk08019-dual-input) > * {
  min-width: 0;
  width: 100%;
}

.stk08019-dual-input {
  width: 100%;
}

.stk08019-search-grid select.stk08019-select,
.stk08019-search-grid input.stk08019-input {
  box-sizing: border-box;
  border: 1px solid var(--stk08019-control-border) !important;
}

.stk08019-search-grid select.stk08019-select:focus,
.stk08019-search-grid input.stk08019-input:focus {
  border-color: #3b82f6 !important;
  outline: none;
}

.stk08019-search-grid input.stk08019-input::placeholder {
  color: rgb(156 163 175);
}

.stk08019-input--code {
  flex: 0 1 38%;
  max-width: 9rem;
}

.stk08019-input--name {
  flex: 1 1 auto;
  min-width: 0;
}

.stk08019-cell-field.stk08019-month-slot {
  justify-content: flex-start;
}

.stk08019-month-slot :deep(.flex.space-x-5) {
  margin-top: 0 !important;
  margin-left: 0 !important;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  min-height: 2rem;
  gap: 0.5rem !important;
}

/* DatePicker4 내부 라벨·space-x-5 여백 제거 → 아래 행 입력 왼쪽선 정렬 */
.stk08019-month-slot :deep(.flex.space-x-5 > *) {
  margin-left: 0 !important;
  margin-inline-start: 0 !important;
}

.stk08019-month-slot :deep(.flex.space-x-5 > div:first-child) {
  display: none !important;
  width: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
  overflow: hidden;
}

/* 셀 너비 기준 년 30% · 월 20% (합 50%) */
.stk08019-month-slot :deep(.flex.space-x-5 > div:nth-child(2)) {
  flex: 0 0 30%;
  width: 30%;
  max-width: 30%;
  min-width: 0;
}

.stk08019-month-slot :deep(.flex.space-x-5 > div:nth-child(3)) {
  flex: 0 0 20%;
  width: 20%;
  max-width: 20%;
  min-width: 0;
}

.stk08019-month-slot :deep(select) {
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  height: 2rem;
  min-height: 2rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  border-radius: 0.375rem;
  border: 1px solid var(--stk08019-control-border) !important;
  background: #fff;
  font-size: 0.875rem;
  color: rgb(55 65 81);
}

.stk08019-month-slot :deep(select:focus) {
  border-color: #3b82f6 !important;
  outline: none;
}

.stk08019-pick-slot :deep(> div.flex) {
  width: 100%;
  min-width: 0;
  gap: var(--stk08019-item-gap) !important;
}

/* 외부 라벨(매장) 사용 — PickStore 기본 '매장명' 텍스트 숨김 */
.stk08019-pick-slot :deep(> div.flex > div:first-child) {
  display: none !important;
  width: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
  overflow: hidden;
}

.stk08019-pick-slot :deep(> div.flex > div.relative) {
  flex: 1 1 auto !important;
  max-width: 100% !important;
}

.stk08019-pick-slot :deep(> div.flex > div) {
  flex: 1 1 0;
  min-width: 0;
}

.stk08019-pick-slot :deep(select) {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  height: 2rem;
  min-height: 2rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  border-radius: 0.375rem;
  border: 1px solid var(--stk08019-control-border) !important;
  background: #fff;
  font-size: 0.875rem;
  color: rgb(55 65 81);
}

.stk08019-pick-slot :deep(select:focus) {
  border-color: #3b82f6 !important;
  outline: none;
}

/* compact PickStore — 셸(border-gray-800)을 다른 콤보와 동일하게 */
.stk08019-pick-slot :deep(.pickstore-vs-shell) {
  box-sizing: border-box;
  height: 2rem !important;
  min-height: 2rem !important;
  max-height: 2rem !important;
  border: 1px solid var(--stk08019-control-border) !important;
  border-radius: 0.375rem !important;
  background: #fff;
}

.stk08019-pick-slot :deep(.pickstore-vs-shell:focus-within),
.stk08019-pick-slot :deep(.pickstore-vs-shell:has(.vs--open)) {
  border-color: #3b82f6 !important;
}

.stk08019-pick-slot :deep(.pickstore-vs-shell .style-chooser) {
  height: 100% !important;
  min-height: 0 !important;
}

.stk08019-pick-slot :deep(.pickstore-vs-shell .style-chooser .vs__dropdown-toggle) {
  border: 0 !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  min-height: 0 !important;
  height: 100% !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  display: flex !important;
  align-items: center !important;
}

.stk08019-pick-slot :deep(.pickstore-vs-shell .vs__selected-options) {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  padding: 0 0 0 0.5rem !important;
}

/* pickStore .vs__selected absolute+width100% 가 X(지우기) 버튼을 덮음 */
.stk08019-pick-slot :deep(.pickstore-vs-shell .vs__selected) {
  position: static !important;
  width: auto !important;
  max-width: 100% !important;
  font-size: 0.875rem !important;
  line-height: 1.25rem;
  color: rgb(55 65 81);
}

.stk08019-pick-slot :deep(.pickstore-vs-shell .vs__search) {
  font-size: 0.875rem !important;
  line-height: 1.25rem;
  color: rgb(55 65 81);
}

.stk08019-pick-slot :deep(.pickstore-vs-shell .vs__actions) {
  flex-shrink: 0;
  display: flex !important;
  align-items: center;
  padding-right: 0.25rem;
}

.stk08019-pick-slot :deep(.pickstore-vs-shell .vs__clear),
.stk08019-pick-slot :deep(.pickstore-vs-shell .vs__open-indicator) {
  display: flex !important;
}
</style>
