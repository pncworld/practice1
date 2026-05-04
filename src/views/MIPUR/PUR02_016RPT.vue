<!-- /*--############################################################################
# Filename : PUR02_016INS.vue                                                  
# Description : 구매관리2 > 매입 관리 > 매입 미확정 현황.                      
# Date :2025-08-28                                                             
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <!-- 조회조건 -->
  <div class="h-full" @click="handleParentClick">
    <div class="flex justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center mr-9 space-x-2 pr-5">
        <button @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <button @click="excelButton" class="button w-auto excel">엑셀</button>
      </div>
    </div>
    <div
      class="pur016-search-panel z-10 mt-3 w-full min-w-0 overflow-x-auto rounded-lg bg-gray-200 px-24 py-4">
      <div
        class="pur016-search-grid min-w-0"
        :style="{
          '--pur016-control-border': pur016ControlBorder,
          '--pur016-item-gap': pur016ItemGap,
        }">
        <div class="pur016-cell pur016-cell--tight-label">
          <div class="pur016-sg-label">선택기간</div>
          <div class="pur016-cell-field pur016-date-slot min-w-0">
            <Datepicker2
              ref="datepicker"
              omit-main-label
              filter-bar-align
              :mainName="'선택기간'"
              :initToday="1"
              :closePopUp="closePopUp"
              @excelDate="excelDate"
              @endDate="endDate"
              @startDate="startDate" />
          </div>
        </div>
        <div class="pur016-cell">
          <div class="pur016-sg-label">매장</div>
          <div class="pur016-cell-field pur016-pick-slot min-w-0">
            <PickStore
              compact-search-bar
              :compact-store-combo-max-rem="pur016PickStoreComboMaxRem"
              main-name=""
              :default-store-nm="'전체'"
              :default-store="true"
              :default-store-type2="true"
              :hide-group="false"
              :hide-attr="false"
              @update:storeGroup="lngStoreGroup"
              @storeNm="excelStore"
              @update:storeCd="lngStoreCode" />
          </div>
        </div>
        <div class="pur016-cell">
          <div class="pur016-sg-label">거래처</div>
          <div class="pur016-cell-field pur016-bc-slot min-w-0">
            <BusinessClient2
              compact-search-bar
              @SupplierId="SupplierId"
              @SupplierNm="SupplierNm" />
          </div>
        </div>
        <div class="pur016-cell pur016-cell--tight-label">
          <div class="pur016-sg-label">단위</div>
          <div class="pur016-cell-field min-w-0">
            <select
              id="pur02-016-unit"
              v-model="cond"
              class="pur016-sg-select h-8 w-full min-w-0 rounded-md border border-solid bg-white text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option
                v-for="i in optionList"
                :key="i.strDCode"
                :value="i.strDCode">
                {{ i.strDName }}
              </option>
            </select>
          </div>
        </div>
        <div class="pur016-cell">
          <div class="pur016-sg-label">확정구분</div>
          <div class="pur016-cell-field min-w-0">
            <select
              id="pur02-016-confirm"
              v-model="cond2"
              class="pur016-sg-select h-8 w-full min-w-0 rounded-md border border-solid bg-white text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option
                v-for="i in optionList2"
                :key="i.strDCode"
                :value="i.strDCode">
                {{ i.strDName }}
              </option>
            </select>
          </div>
        </div>
        <div class="pur016-cell pur016-grid-filler" aria-hidden="true" />
      </div>
    </div>

    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="mt-2 w-full h-[65vh]">
      <Realgrid
        :progname="'PUR02_016RPT_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :setStateBar="false"
        :setFooter="true"
        :documentTitle="'PUR02_016RPT'"
        :selectionStyle="'block'"
        @dblclickedRowData="dblclickedRowData"
        :documentSubTitle="documentSubTitle"
        :rowStateeditable="false"
        :exporttoExcel="exportExcel">
      </Realgrid>
    </div>
  </div>

  <!-- 그리드 영역 -->
</template>

<script setup>
import { getCommonList } from "@/api/common";
import { getStockAuditReportList } from "@/api/mipur";
import BusinessClient2 from "@/components/businessClient2.vue";
import Datepicker2 from "@/components/Datepicker2.vue";
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

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getCommonList(27);

  optionList.value = res.data.List.filter((item) => item.strDCode != "01");

  const res2 = await getCommonList(24);

  optionList2.value = res2.data.List;
});

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

const cond = ref("02");
const cond2 = ref("01");

const cond5 = ref(0);
const store = useStore();

/** 조회 AREA(search-area-layout) */
const pur016ControlBorder = "#cbd5e1";
const pur016ItemGap = "0.75rem";
const pur016PickStoreComboMaxRem = 36;

const datepicker = ref(null);
const closePopUp = ref(false);
const optionList = ref([]);
const optionList2 = ref([]);
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

const sDate = ref("");
const eDate = ref("");

const selectedDate = ref();
const excelDate = (e) => {
  selectedDate.value = e;
};

const storeCode = ref();
const lngStoreCode = (e) => {
  initGrid();
  storeCode.value = e;
};

const groupCd = ref();
const lngStoreGroup = (e) => {
  groupCd.value = e;
};

const supplierid = ref("0");
const SupplierId = (e) => {
  supplierid.value =
    e === "" || e === null || e === undefined ? "0" : String(e);
};
const SupplierNm = () => {};

const dblclickedRowData = () => {};
/**
 *  조회 함수
 */
const hideColumnsId = ref([]);
const searchButton = async () => {
  try {
    store.state.loading = true;
    initGrid();

    const res = await getStockAuditReportList(
      groupCd.value,
      storeCode.value,
      sDate.value.replaceAll("-", ""),
      eDate.value.replaceAll("-", ""),
      supplierid.value,
      cond.value,
      cond2.value,
      0
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

const disabled1 = ref(false);
const progid = ref(1);
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
    selectedDate.value + "\n" + "매장명 :" + selectedExcelStore.value;
  exportExcel.value = !exportExcel.value;
};

const documentSubTitle2 = ref("");

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

const startDate = (e) => {
  sDate.value = e;
};
const endDate = (e) => {
  eDate.value = e;
};
</script>

<style scoped>
/* 3열×2행 — 2행은 단위·확정구분 + 빈 칸 (search-area-layout) */
.pur016-search-grid {
  --pur016-label-col: 6.5rem;
  display: grid;
  width: 100%;
  min-width: 0;
  align-items: center;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  column-gap: var(--pur016-item-gap);
  row-gap: var(--pur016-item-gap);
}

.pur016-cell {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: var(--pur016-item-gap);
}

/* 선택기간·단위 — 라벨만 좁혀 앞쪽(값 영역) 확보 */
.pur016-cell--tight-label {
  gap: 0.375rem;
}

.pur016-cell--tight-label .pur016-sg-label {
  flex: 0 0 4.5rem;
  width: 4.5rem;
  min-width: 4.5rem;
}

.pur016-grid-filler {
  visibility: hidden;
  pointer-events: none;
  min-height: 2rem;
}

.pur016-sg-label {
  flex: 0 0 var(--pur016-label-col);
  width: var(--pur016-label-col);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
}

.pur016-cell-field {
  min-width: 0;
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  width: 100%;
}

.pur016-cell-field > * {
  min-width: 0;
  width: 100%;
}

.pur016-search-panel .pur016-search-grid select.pur016-sg-select {
  box-sizing: border-box;
  border: 1px solid var(--pur016-control-border) !important;
}

.pur016-search-panel .pur016-search-grid select.pur016-sg-select:focus {
  border-color: #3b82f6 !important;
}

.pur016-search-panel .pur016-pick-slot :deep(select) {
  border: 1px solid var(--pur016-control-border) !important;
}

.pur016-search-panel .pur016-pick-slot :deep(select:focus) {
  border-color: #3b82f6 !important;
}

.pur016-search-panel .pur016-pick-slot :deep(.pickstore-vs-shell),
.pur016-search-panel .pur016-bc-slot :deep(.pickstore-vs-shell) {
  border: 1px solid var(--pur016-control-border) !important;
  box-sizing: border-box;
  max-width: 100%;
  min-width: 0;
}

.pur016-search-panel .pur016-date-slot :deep(input[type="date"]) {
  box-sizing: border-box;
  /* 단위 select와 비슷하되 스크롤 방지용으로 w-36 대비 소폭 축소 */
  flex: 0 1 8.5rem;
  min-width: 8.25rem;
  width: 8.5rem;
  max-width: 8.5rem;
  height: 2rem;
  min-height: 2rem;
  padding-left: 0.45rem;
  padding-right: 0.35rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  border-radius: 0.375rem;
  border: 1px solid var(--pur016-control-border) !important;
}

.pur016-search-panel .pur016-date-slot :deep(input[type="date"]:focus) {
  border-color: #3b82f6 !important;
}

.pur016-date-slot {
  overflow-x: auto;
  scrollbar-width: thin;
}

.pur016-date-slot :deep(> div.flex.justify-start.items-center) {
  margin-left: 0;
  padding-left: 0;
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  column-gap: 0.25rem !important;
}

.pur016-date-slot :deep(> div.flex > div.inline-flex) {
  display: inline-flex !important;
  flex-shrink: 0;
  min-width: min-content;
  max-width: none;
  flex-wrap: nowrap;
  align-items: center;
  gap: 0.125rem !important;
}

.pur016-date-slot :deep(> div.flex > div.inline-flex > span),
.pur016-date-slot :deep(> div.flex > div.inline-flex > button) {
  flex-shrink: 0;
}

.pur016-pick-slot {
  overflow-x: auto;
  scrollbar-width: thin;
}

.pur016-pick-slot :deep(> div.flex.text-base) {
  width: 100%;
  min-width: 0;
  gap: var(--pur016-item-gap) !important;
}

.pur016-pick-slot :deep(> div.flex > div:first-child) {
  display: none;
}

.pur016-bc-slot :deep(> div.flex.text-base) {
  width: 100%;
  min-width: 0;
}

.pur016-bc-slot :deep(> div.flex.items-center) {
  margin-top: 0;
}
</style>
