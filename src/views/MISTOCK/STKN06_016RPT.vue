<!-- /*--############################################################################
# Filename : STKN06_016RPT.vue                                                  
# Description : 자재관리2 > 손실 관리 > 손실 현황                      
# Date :2025-09-01                                                             
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <!-- 조회조건 -->
  <div class="flex h-full min-h-0 flex-col" @click="handleParentClick">
    <div
      class="flex w-full shrink-0 items-center justify-between overflow-y-hidden">
      <PageName></PageName>
      <div class="mr-9 flex justify-center space-x-2 pr-5">
        <button @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <button @click="excelButton" class="button save w-auto excel">
          엑셀
        </button>
      </div>
    </div>

    <div
      class="stkn0616-search-panel z-10 mt-3 w-full min-h-0 shrink-0 rounded-lg bg-gray-200"
      :style="{
        '--stkn0616-control-border': stkn0616ControlBorder,
        '--stkn0616-item-gap': stkn0616ItemGap,
        '--stkn0616-col-gap': stkn0616ColGap,
        '--stkn0616-row-gap': stkn0616RowGap,
        '--stkn0616-label-col': stkn0616LabelCol,
        '--stkn0616-store-group-w': stkn0616StoreGroupWidth,
        '--stkn0616-store-attr-w': stkn0616StoreAttrWidth,
        '--stkn0616-store-name-w': stkn0616StoreNameWidth,
      }">
      <div class="stkn0616-search-grid min-w-0">
        <!-- 좌: 선택일자 / 자재분류 / 조회조건 -->
        <div class="stkn0616-left-stack min-w-0">
          <div class="stkn0616-sg-label">선택일자</div>
          <div class="stkn0616-cell-field stkn0616-date-slot min-w-0">
            <Datepicker2
              :mainName="'선택일자'"
              omit-main-label
              filter-bar-align
              @endDate="endDate"
              ref="datepicker"
              :initToday="1"
              :closePopUp="closePopUp"
              @excelDate="excelDate"
              @startDate="startDate" />
          </div>

          <div class="stkn0616-sg-label">자재분류</div>
          <div class="stkn0616-cell-field stkn0616-pair-row min-w-0">
            <select class="stkn0616-sg-select" v-model="cond3">
              <option value="0">전체</option>
              <option value="1">분류</option>
              <option value="2">그룹</option>
              <option value="3">특성</option>
              <option value="4">재고조사주기</option>
            </select>
            <select class="stkn0616-sg-select" v-model="cond4">
              <option value="0">전체</option>
              <option
                :value="i.strDCode"
                v-for="i in optionList2"
                :key="i.strDCode">
                {{ i.strDName }}
              </option>
            </select>
          </div>

          <div class="stkn0616-sg-label">조회조건</div>
          <div class="stkn0616-cell-field stkn0616-cond-pair min-w-0">
            <label class="stkn0616-check stkn0616-check--store" for="cond5">
              <input type="checkbox" id="cond5" v-model="cond5" />
              매장별
            </label>
            <label class="stkn0616-check stkn0616-check--day" for="cond6">
              <input type="checkbox" id="cond6" v-model="cond6" />
              일자별
            </label>
          </div>
        </div>

        <!-- 중: 매장 / 단위 -->
        <div class="stkn0616-mid-stack min-w-0">
          <div class="stkn0616-cell stkn0616-cell--store">
            <div class="stkn0616-sg-label">매장</div>
            <div
              class="stkn0616-cell-field stkn0616-pick-slot stkn0616-pick-slot--store-grid min-w-0">
              <PickStoreRenew
                compact
                omit-main-label
                combo-fill
                main-name="매장"
                :placeholder-name="'전체'"
                @lngStoreGroup="lngStoreGroup"
                @excelStore="excelStore"
                @lngStoreCode="lngStoreCode" />
            </div>
          </div>
          <div class="stkn0616-cell stkn0616-cell--unit">
            <div class="stkn0616-sg-label">단위</div>
            <div class="stkn0616-cell-field stkn0616-cell-field--unit min-w-0">
              <select class="stkn0616-sg-select stkn0616-sg-select--unit" v-model="cond2">
                <option
                  :value="i.strDCode"
                  v-for="i in optionList"
                  :key="i.strDCode">
                  {{ i.strDName }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- 우: 품목구분 -->
        <div class="stkn0616-cell stkn0616-cell--item min-w-0">
          <div class="stkn0616-item-group min-w-0">
            <div class="stkn0616-sg-label">품목구분</div>
            <select class="stkn0616-sg-select stkn0616-sg-select--item" v-model="cond">
              <option value="0">전체</option>
              <option
                :value="i.strDCode"
                v-for="i in optionList3"
                :key="i.strDCode">
                {{ i.strDName }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- 그리드 영역 -->
    <div class="mt-2 min-h-0 w-full flex-1">
      <Realgrid
        class="h-full min-h-0 w-full"
        :progname="'STKN06_016RPT_VUE'"
        :progid="progid"
        :rowData="rowData"
        :reload="reload"
        :documentTitle="'STKN06_016RPT'"
        @clickedRowData="clickedRowData"
        :documentSubTitle="documentSubTitle"
        :rowStateeditable="false"
        :exporttoExcel="exportExcel" />
    </div>
  </div>
</template>

<script setup>
import { getCommonList } from "@/api/common";
import { getStockCategory, getStockGeneric, getStockGroup } from "@/api/master";
import { getLossReportList } from "@/api/mistock";
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

const stkn0616ControlBorder = "#cbd5e1";
const stkn0616ItemGap = "0.75rem";
/** 3열 사이 동일 간격 */
const stkn0616ColGap = "1.25rem";
const stkn0616RowGap = "0.5625rem";
const stkn0616LabelCol = "5.5rem";
const stkn0616StoreGroupWidth = "calc(7rem * 1)";
/** 매장 콤보 비율 1 : 1.3 : 1.7 */
const stkn0616StoreAttrWidth = "calc(7rem * 1.3)";
const stkn0616StoreNameWidth = "calc(7rem * 1.7)";

/**
 * 	화면 Load시 실행 스크립트
 */

const optionList3 = ref([]);
onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getCommonList(27);

  optionList.value = res.data.List;

  const res2 = await getCommonList(52);
  optionList3.value = res2.data.List;
});

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

const cond = ref("0");
const cond2 = ref("04");
const cond3 = ref("0");
const cond4 = ref("0");
const cond5 = ref(true);
const cond6 = ref(true);
const store = useStore();

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
watch(cond3, async () => {
  if (cond3.value == 1) {
    const res2 = await getStockCategory(store.state.userData.lngStoreGroup);

    optionList2.value = res2.data.List;

    optionList2.value = optionList2.value.map((item) => ({
      ...item,
      strDCode: item.lngCategoryID,
      strDName: item.strCategoryName,
    }));
  } else if (cond3.value == 2) {
    const res = await getStockGroup(store.state.userData.lngStoreGroup);

    optionList2.value = res.data.List;

    optionList2.value = optionList2.value.map((item) => ({
      ...item,
      strDCode: item.lngStockGroupID,
      strDName: item.strStockGroupName,
    }));
  } else if (cond3.value == 3) {
    const res3 = await getStockGeneric(store.state.userData.lngStoreGroup);

    optionList2.value = res3.data.List;

    optionList2.value = optionList2.value.map((item) => ({
      ...item,
      strDCode: item.lngGenericID,
      strDName: item.strGenericName,
    }));
  } else {
    optionList2.value = [];
  }
  cond4.value = "0";
});

const teamcode = ref();
const lngTeamCode = (e) => {
  teamcode.value = e;
};
const supervisor = ref();
const lngSupervisor = (e) => {
  supervisor.value = e;
};
const storeCode = ref();
const lngStoreCode = (e) => {
  initGrid();
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

const supplierid = ref("");
const SupplierId = (e) => {
  supplierid.value = e;
};
/**
 *  조회 함수
 */
const hideColumnsId = ref([]);
const searchButton = async () => {
  try {
    store.state.loading = true;
    initGrid();

    let reporttype = "";

    if (cond5.value == false && cond6.value == false) {
      reporttype = "";
    } else if (cond5.value == false && cond6.value == true) {
      reporttype = "1";
    } else if (cond5.value == true && cond6.value == false) {
      reporttype = "2";
    } else {
      reporttype = "12";
    }
    const res = await getLossReportList(
      groupCd.value,
      storeCode.value,
      0,
      sDate.value.replaceAll("-", ""),
      eDate.value.replaceAll("-", ""),
      cond.value,
      cond3.value,
      cond4.value,
      cond2.value,
      reporttype
    );

    rowData.value = res.data.List;
    //console.log(res);
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

const progid = ref(1);

const setRowStyleCallsDefaultCol2 = ref("strTaxType");
const setRowStyleCallsDefaultCol = ref("strTaxType");
const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }

  if (cond5.value == false && cond6.value == false) {
    progid.value = 1;
  } else if (cond5.value == true && cond6.value == false) {
    progid.value = 3;
  } else if (cond5.value == false && cond6.value == true) {
    progid.value = 2;
  } else {
    progid.value = 4;
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
    selectedDate.value + "\n" + "매장명 :" + selectedExcelStore.value;
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

const clickedRowData = () => {};
</script>

<style scoped>
/* 패널: 세로만. 좌우 inset은 그리드에 둠 (ACT09/PUR 3열 반응형) */
.stkn0616-search-panel {
  --stkn0616-panel-pad-x: 2rem;
  box-sizing: border-box;
  padding-left: 0;
  padding-right: 0;
  padding-block: 0.75rem;
  overflow-x: auto;
}

@media (min-width: 640px) {
  .stkn0616-search-panel {
    --stkn0616-panel-pad-x: 2.5rem;
  }
}

@media (min-width: 768px) {
  .stkn0616-search-panel {
    --stkn0616-panel-pad-x: 3rem;
  }
}

@media (min-width: 1024px) {
  .stkn0616-search-panel {
    --stkn0616-panel-pad-x: 3.5rem;
  }
}

.stkn0616-search-grid {
  display: grid;
  /* ACT09/PUR: 3열 반응형 — 열 안에서 축소, column-gap으로 균등 간격 */
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 1.35fr) minmax(0, 0.9fr);
  column-gap: var(--stkn0616-col-gap);
  row-gap: var(--stkn0616-row-gap);
  align-items: start;
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  padding-left: var(--stkn0616-panel-pad-x);
  padding-right: var(--stkn0616-panel-pad-x);
  --stkn0616-row-min-h: 2rem;
  --stkn0616-control-h: 2rem;
  --stkn0616-pair-gap: 0.5rem;
  /* 선택일자(날짜+달력) 폭 = 자재분류·조회조건 필드 끝선 */
  --stkn0616-left-field-w: calc(
    9rem + 9rem + 2rem + 0.125rem * 3 + 0.125rem + 0.9rem
  );
  --stkn0616-store-fr-sum: 4;
  --stkn0616-store-fr-12: 2.3;
}

/* 선택일자·자재분류·조회조건 — 동일 필드 끝선 */
.stkn0616-left-stack {
  display: grid;
  grid-template-columns: var(--stkn0616-label-col) minmax(0, var(--stkn0616-left-field-w));
  column-gap: var(--stkn0616-item-gap);
  row-gap: var(--stkn0616-row-gap);
  align-items: center;
  width: max-content;
  max-width: 100%;
  min-width: 0;
}

.stkn0616-left-stack > .stkn0616-sg-label,
.stkn0616-left-stack > .stkn0616-cell-field {
  min-height: var(--stkn0616-row-min-h);
}

.stkn0616-mid-stack {
  display: flex;
  flex-direction: column;
  gap: var(--stkn0616-row-gap);
  width: 100%;
  min-width: 0;
  max-width: 100%;
}

.stkn0616-cell--store,
.stkn0616-cell--unit,
.stkn0616-cell--item {
  width: 100%;
  min-width: 0;
  max-width: 100%;
}

.stkn0616-cell {
  display: flex;
  min-width: 0;
  min-height: var(--stkn0616-row-min-h);
  align-items: center;
  gap: var(--stkn0616-item-gap);
}

.stkn0616-cell-field {
  min-width: 0;
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  width: 100%;
}

.stkn0616-cell-field--end {
  justify-content: flex-end;
}

.stkn0616-item-group {
  display: flex;
  align-items: center;
  gap: var(--stkn0616-item-gap);
  width: 100%;
  min-width: 0;
  max-width: 100%;
}

.stkn0616-item-group .stkn0616-sg-label {
  flex: 0 0 var(--stkn0616-label-col);
}

.stkn0616-cell-field:not(.stkn0616-pair-row):not(.stkn0616-cond-pair):not(
    .stkn0616-cell-field--unit
  ):not(.stkn0616-pick-slot)
  > * {
  min-width: 0;
  width: 100%;
}

.stkn0616-cell-field--unit {
  flex: 1 1 auto;
  width: 100%;
  min-width: 0;
}

.stkn0616-pick-slot {
  flex: 1 1 auto;
  width: 100%;
  max-width: 100%;
  min-width: 0;
}

.stkn0616-date-slot {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  flex: 0 0 auto;
}

/*
 * 자재분류 · 조회조건 — 선택일자 필드와 동일 끝선
 * 1열 왼쪽 = 매장별 / 자재분류 1번째 콤보
 * 2열 왼쪽 = 일자별 / 자재분류 2번째 콤보
 */
.stkn0616-cell-field.stkn0616-pair-row,
.stkn0616-cell-field.stkn0616-cond-pair {
  display: grid;
  grid-template-columns: minmax(0, 0.7fr) minmax(0, 1.2fr);
  column-gap: var(--stkn0616-pair-gap);
  align-items: center;
  justify-items: stretch;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  min-height: var(--stkn0616-row-min-h);
}

.stkn0616-pair-row > * {
  box-sizing: border-box;
  min-width: 0;
  max-width: 100%;
  width: 100%;
}

.stkn0616-check--store {
  grid-column: 1;
  justify-self: start;
  margin: 0;
  padding: 0;
}

.stkn0616-check--day {
  grid-column: 2;
  justify-self: start;
  margin: 0;
  padding: 0;
}

.stkn0616-sg-label {
  flex: 0 0 var(--stkn0616-label-col);
  width: var(--stkn0616-label-col);
  min-width: 0;
  max-width: var(--stkn0616-label-col);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 0.9375rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stkn0616-check {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  min-height: var(--stkn0616-row-min-h);
  font-size: 0.875rem;
  font-weight: 600;
  color: rgb(17 24 39);
  white-space: nowrap;
  cursor: pointer;
}

.stkn0616-check input[type="checkbox"] {
  box-sizing: border-box;
  width: 1rem;
  height: 1rem;
  margin: 0;
  flex-shrink: 0;
}

.stkn0616-sg-select {
  box-sizing: border-box;
  height: var(--stkn0616-control-h);
  min-height: var(--stkn0616-control-h);
  max-height: var(--stkn0616-control-h);
  width: 100%;
  min-width: 0;
  padding: 0 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: rgb(55 65 81);
  background: #fff;
  border: 1px solid var(--stkn0616-control-border);
  border-radius: 0.375rem;
}

.stkn0616-sg-select:focus {
  outline: none;
  border-color: #3b82f6;
}

/* 단위 = 매장 1·2번 합폭 비율 / 품목구분 = 열 필드 전체 */
.stkn0616-sg-select--unit {
  width: calc(
    (var(--stkn0616-store-fr-12) / var(--stkn0616-store-fr-sum)) *
      (100% - 2 * var(--stkn0616-item-gap)) + var(--stkn0616-item-gap)
  );
  max-width: 100%;
  min-width: 0;
  flex: 0 1 auto;
}

.stkn0616-sg-select--item {
  flex: 1 1 auto;
  width: 100%;
  min-width: 0;
  max-width: 100%;
}

.stkn0616-date-slot :deep(> div.flex.justify-start.items-center) {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0;
  gap: 0.25rem !important;
  margin-left: 0;
  padding-left: 0;
}

.stkn0616-date-slot :deep(> div.flex > div.inline-flex.h-8) {
  flex: 1 1 auto;
  min-width: 0;
  width: auto !important;
  max-width: 100%;
  gap: 0.125rem !important;
}

.stkn0616-date-slot :deep(input[type="date"]) {
  border: 1px solid var(--stkn0616-control-border) !important;
  box-sizing: border-box;
  flex: 1 1 0;
  width: 9rem !important;
  min-width: 0;
  max-width: 9rem;
  height: var(--stkn0616-control-h) !important;
  min-height: var(--stkn0616-control-h) !important;
  max-height: var(--stkn0616-control-h) !important;
  padding-left: 0.45rem;
  padding-right: 0.25rem;
  font-size: 0.875rem !important;
  line-height: 1.25rem !important;
  border-radius: 0.375rem;
}

.stkn0616-date-slot :deep(input[type="date"]:focus) {
  border-color: #3b82f6 !important;
}

.stkn0616-pick-slot :deep(> div.flex) {
  margin: 0 !important;
  margin-top: 0 !important;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  flex-wrap: nowrap;
  align-items: center;
  gap: var(--stkn0616-item-gap) !important;
  justify-content: flex-start !important;
}

.stkn0616-pick-slot :deep(> div.flex > div:has(select)) {
  flex: 1 1 0;
  min-width: 0;
}

.stkn0616-pick-slot :deep(> div.flex > div:nth-child(1) select),
.stkn0616-pick-slot :deep(> div.flex > div:nth-child(2) select) {
  box-sizing: border-box;
  height: var(--stkn0616-control-h) !important;
  min-height: var(--stkn0616-control-h) !important;
  max-height: var(--stkn0616-control-h) !important;
  margin-left: 0 !important;
  padding: 0 0.375rem !important;
  font-size: 0.875rem !important;
  line-height: 1.25rem !important;
  border-radius: 0.375rem;
  border: 1px solid var(--stkn0616-control-border) !important;
  width: 100% !important;
  max-width: 100% !important;
}

.stkn0616-pick-slot :deep(> div.flex > div:nth-child(2) select) {
  padding: 0 0.25rem !important;
}

.stkn0616-pick-slot :deep(> div.flex > div:last-child) {
  flex: 1 1 0;
  min-width: 0;
  max-width: 100%;
}

.stkn0616-pick-slot :deep(.custom-select) {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important;
  margin-left: 0 !important;
  font-size: 0.875rem !important;
  font-weight: 400 !important;
  line-height: 1.25rem !important;
  color: rgb(55 65 81) !important;
}

.stkn0616-pick-slot
  :deep(.custom-select.custom-select--compact .vs__dropdown-toggle) {
  box-sizing: border-box;
  height: var(--stkn0616-control-h) !important;
  min-height: var(--stkn0616-control-h) !important;
  max-height: var(--stkn0616-control-h) !important;
  padding: 0 0.375rem !important;
  border: 1px solid var(--stkn0616-control-border) !important;
  border-radius: 0.375rem !important;
  background-color: #fff !important;
  overflow: hidden !important;
  flex-wrap: nowrap !important;
  align-items: center !important;
}

.stkn0616-pick-slot
  :deep(.custom-select.custom-select--compact .vs__selected-options) {
  flex: 1 1 auto !important;
  flex-wrap: nowrap !important;
  min-width: 0 !important;
  max-width: 100% !important;
  overflow: hidden !important;
  padding: 0 !important;
  margin: 0 !important;
  align-items: center !important;
}

.stkn0616-pick-slot
  :deep(.custom-select.custom-select--compact .vs__selected),
.stkn0616-pick-slot
  :deep(.custom-select.custom-select--compact .vs__search),
.stkn0616-pick-slot
  :deep(.custom-select.custom-select--compact .pickstore-selected-text) {
  display: block !important;
  box-sizing: border-box !important;
  font-size: 0.875rem !important;
  font-weight: 400 !important;
  line-height: calc(var(--stkn0616-control-h) - 2px) !important;
  height: auto !important;
  min-height: 0 !important;
  min-width: 0 !important;
  max-width: 100% !important;
  margin: 0 !important;
  margin-top: 0 !important;
  padding: 0 !important;
  padding-top: 0 !important;
  color: rgb(55 65 81) !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}

.stkn0616-pick-slot
  :deep(.custom-select.custom-select--compact .vs__dropdown-menu),
.stkn0616-pick-slot
  :deep(.custom-select.custom-select--compact .vs__dropdown-option) {
  font-size: 0.875rem !important;
  font-weight: 400 !important;
  line-height: 1.25rem !important;
}

/* 3번째(v-select) 화살표를 1·2번 native select 톤에 맞춤 */
.stkn0616-pick-slot :deep(.custom-select .vs__actions) {
  padding: 0 2px 0 0 !important;
}

.stkn0616-pick-slot :deep(.custom-select .vs__clear) {
  display: none !important;
}

.stkn0616-pick-slot :deep(.custom-select .vs__open-indicator) {
  fill: rgb(107 114 128) !important;
  transform: scale(0.55) !important;
  transition: transform 0.15s ease;
}

.stkn0616-pick-slot :deep(.custom-select.vs--open .vs__open-indicator) {
  transform: scale(0.55) rotate(180deg) !important;
}

/* 조회 AREA 내 모든 네이티브 select 높이 통일 */
.stkn0616-search-panel select.stkn0616-sg-select {
  height: var(--stkn0616-control-h) !important;
  min-height: var(--stkn0616-control-h) !important;
  max-height: var(--stkn0616-control-h) !important;
}

/* 매장 3콤보 — 비율 유지하며 열 폭에 맞춰 축소 (ACT09/PUR와 동일) */
.stkn0616-pick-slot--store-grid :deep(> div.flex) {
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.3fr) minmax(0, 1.7fr) !important;
  width: 100% !important;
  min-width: 0 !important;
  max-width: 100% !important;
  flex-wrap: unset !important;
  align-items: stretch !important;
  gap: var(--stkn0616-item-gap) !important;
}

.stkn0616-pick-slot--store-grid
  :deep(> div.flex > div:nth-child(1) select),
.stkn0616-pick-slot--store-grid
  :deep(> div.flex > div:nth-child(2) select) {
  width: 100% !important;
  max-width: 100% !important;
}

.stkn0616-pick-slot--store-grid :deep(> div.flex > div:last-child) {
  flex: unset !important;
  width: 100% !important;
  min-width: 0 !important;
  max-width: 100% !important;
}

.stkn0616-pick-slot--store-grid
  :deep(> div.flex > div:last-child .custom-select) {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important;
  margin-left: 0 !important;
}

@media (max-width: 1023px) {
  .stkn0616-search-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
