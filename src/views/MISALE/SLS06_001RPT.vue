/*--############################################################################
# Filename : SLS06_001RPT.vue
# Description : 매출관리 > 기간별 마스터 > 요일별 매출 현황.
# Date :2025-05-14
# Author : 권맑음
################################################################################*/
<template>
  <div class="flex h-full min-h-0 flex-col pl-5" @click="handleParentClick">
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
      class="sls0601-search-panel z-10 mt-3 w-full min-h-0 shrink-0 overflow-visible rounded-lg bg-gray-200"
      :style="{
        '--sls0601-panel-pad-x': '2rem',
        '--sls0601-control-border': sls0601ControlBorder,
        '--sls0601-col-gutter': sls0601ColGutter,
        '--sls0601-row-gap': sls0601RowGap,
        '--sls0601-label-col': sls0601LabelCol,
      }">
      <div class="sls0601-search-layout min-w-0">
        <!-- 좌: 기간 / 요일명 / 조회조건 -->
        <div class="sls0601-left-stack min-w-0">
          <div class="sls0601-row">
            <span class="sls0601-lbl shrink-0">기간</span>
            <div class="sls0601-date-slot min-w-0 flex-1">
              <Datepicker2
                ref="datepicker"
                omit-main-label
                filter-bar-align
                :initToday="1"
                :mainName="'기간'"
                :selectedGroup="selectedGroup"
                :closePopUp="closePopUp"
                @startDate="startDate"
                @endDate="endDate"
                @excelDate="excelDate" />
            </div>
          </div>

          <div class="sls0601-row">
            <span class="sls0601-lbl shrink-0">요일명</span>
            <div class="sls0601-weekday-slot min-w-0">
              <v-select
                v-model="selectWeekDay"
                :options="weekDay"
                placeholder="전체"
                label="strDName"
                class="custom-select2 sls0601-vselect"
                :clearable="true" />
            </div>
          </div>

          <div class="sls0601-row">
            <span class="sls0601-lbl shrink-0">조회조건</span>
            <div class="sls0601-check-row min-w-0 flex-1">
              <label class="sls0601-check" for="sls0601-daily">
                <input
                  type="checkbox"
                  id="sls0601-daily"
                  @change="seeDaily" />
                일자별
              </label>
              <label class="sls0601-check" for="sls0601-store">
                <input
                  type="checkbox"
                  id="sls0601-store"
                  @change="seeStore" />
                매장별
              </label>
            </div>
          </div>
        </div>

        <!-- 우: 매장 -->
        <div class="sls0601-right-store min-w-0 overflow-visible">
          <pickStoreSingle
            @lngStoreCode="lngStoreCodes"
            @lngStoreGroup="lngStoreGroup"
            @excelStore="excelStore"
            @lngStoreAttrs="lngStoreAttrs"
            @lngStoreTeam="lngStoreTeam"
            @lngSupervisor="lngSupervisor" />
        </div>
      </div>
    </div>

    <div class="mt-2 flex min-h-0 min-w-0 flex-1 flex-col">
      <div class="relative min-h-0 w-full flex-1">
        <Realgrid
          class="h-full min-h-0 w-full"
          :progname="'SLS06_001RPT_VUE'"
          :progid="progId"
          :rowData="rowData"
          :reload="reload"
          :setFooter="true"
          :setFooterExpressions="setFooterExpressions"
          :setFooterColID="setFooterColID"
          :setGroupFooter="setGroupFooter"
          :setGroupColumnId="setGroupColumnId"
          :setGroupSumCustomText="['소계']"
          :setGroupSumCustomColumnId="setGroupSumCustomColumnId"
          :setGroupSumCustomLevel="3"
          :setGroupSummaryCenterIds="setGroupSummaryCenterIds"
          :setGroupFooterExpressions="setGroupFooterExpressions"
          :setGroupFooterColID="setGroupFooterColID"
          :documentTitle="'SLS06_001RPT'"
          :documentSubTitle="documentSubTitle"
          :rowStateeditable="false"
          :exporttoExcel="exportExcel" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { getWeedaySalesReport, getWeekDayList } from "@/api/misales";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

import Datepicker2 from "@/components/Datepicker2.vue";
/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
/**
 *  단일 매장  컴포넌트
 *  */

import pickStoreSingle from "@/components/pickStoreSingle.vue";
/**
 * 	그리드 생성
 */

import Realgrid from "@/components/realgrid.vue";
/**
 *  페이지로그 자동 입력
 *  */

import { insertPageLog } from "@/customFunc/customFunc";
/*
 * 공통 표준  Function
 */

import { onMounted, ref, watch } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";

/** 조회 AREA — SLS02_023 / SLS02_031 패턴 */
const sls0601ControlBorder = "#cbd5e1";
const sls0601ColGutter = "1.25rem";
const sls0601RowGap = "0.875rem";
const sls0601LabelCol = "5.5rem";

const setFooterColID = ref([
  "lngWeekCnt",
  "lngCustCnt",
  "lngCustAmt",
  "lngRecCnt",
  "lngRecAmt",
  "lngSalAmt",
  "lngActAmt",
  "lngSumAmt",
  "lngAvgCustCnt",
  "lngAvgActAmt",
  "dblDistRate",
]);
const setFooterExpressions = ref([
  "sum",
  "sum",
  "avg",
  "sum",
  "avg",
  "sum",
  "sum",
  "sum",
  "sum",
  "avg",
  "sum",
]);
const setGroupFooter = ref(true);
const setGroupFooterColID = ref([
  "lngWeekCnt",
  "lngCustCnt",
  "lngCustAmt",
  "lngRecCnt",
  "lngRecAmt",
  "lngSalAmt",
  "lngActAmt",
  "lngSumAmt",
  "lngAvgCustCnt",
  "lngAvgActAmt",
  "dblDistRate",
]);
const setGroupFooterExpressions = ref([
  "sum",
  "sum",
  "avg",
  "sum",
  "avg",
  "sum",
  "sum",
  "sum",
  "sum",
  "avg",
  "sum",
]);
const setGroupSummaryCenterIds = ref("dtmDate, strWeek");
const setGroupSumCustomColumnId = ref(["strWeek"]);
const setGroupColumnId = ref("");
const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);
const selectedstartDate = ref();
const selectedendDate = ref();

/**
 * 선택한 매출 시작일자
 */

const startDate = (e) => {
  selectedstartDate.value = e;
};

/**
 * 선택한 매출 종료일자
 */

const endDate = (e) => {
  selectedendDate.value = e;
};

const tempSeeDaily = ref(false);
const tempSeeStore = ref(false);
const reportCheckData = ref("0");
const progId = ref("1");

const seeDaily = (e) => {
  tempSeeDaily.value = e.target.checked;
  updateProgid();
};

const seeStore = (e) => {
  tempSeeStore.value = e.target.checked;
  updateProgid();
};

const updateProgid = () => {
  if (tempSeeDaily.value && tempSeeStore.value) {
    reportCheckData.value = "12";
    setGroupSumCustomColumnId.value = ["dtmDate"];
    setGroupColumnId.value = "strStore,strWeek";
    progId.value = "4";
  } else if (tempSeeDaily.value) {
    reportCheckData.value = "1";
    setGroupSumCustomColumnId.value = ["dtmDate"];
    setGroupColumnId.value = "strWeek";
    progId.value = "2";
  } else if (tempSeeStore.value) {
    reportCheckData.value = "2";
    setGroupSumCustomColumnId.value = ["strWeek"];
    setGroupColumnId.value = "strStore";
    progId.value = "3";
  } else {
    reportCheckData.value = "0";
    setGroupSumCustomColumnId.value = ["dtmDate"];
    setGroupColumnId.value = "";
    progId.value = "1";
  }
};

const store = useStore();
const loginedstrLang = store.state.userData.lngLanguage;

const datepicker = ref(null);
const closePopUp = ref(false);
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

const searchButton = async () => {
  store.state.loading = true;
  try {
    initGrid();

    reload.value = !reload.value;

    let selectedStorearr;
    if (
      selectedStores.value == undefined ||
      selectedStores.value.length == 0 ||
      selectedStores.value == 0
    ) {
      selectedStorearr = 0;
    } else {
      selectedStorearr = selectedStores.value;
    }

    let selectedWeekDayValue;
    if (
      selectedWeekDay.value == undefined ||
      selectedWeekDay.value.length == 0 ||
      selectedWeekDay.value == 0
    ) {
      selectedWeekDayValue = 0;
    } else {
      selectedWeekDayValue = selectedWeekDay.value;
    }

    const res = await getWeedaySalesReport(
      selectedGroup.value,
      selectedStoreAttrs.value,
      selectedStoreTeam.value,
      selectedStoreSuperVisor.value,
      selectedStorearr,
      selectedstartDate.value,
      selectedendDate.value,
      reportCheckData.value,
      selectedWeekDayValue
    );
    rowData.value = res.data.weekdaySales;

    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
  } finally {
    store.state.loading = false;
  }
};

/* 매장 컴포넌트 관련 함수 */
const selectedGroup = ref();
const selectedStores = ref();
const selectedStoreAttrs = ref();
const selectedStoreTeam = ref();
const selectedStoreSuperVisor = ref();
/**
 * 페이지 매장 그룹 세팅
 */

const lngStoreGroup = (e) => {
  initGrid();
  selectedGroup.value = e;
};
/**
 * 페이지 매장 코드 세팅
 */

const lngStoreCodes = (e) => {
  initGrid();
  selectWeekDay.value = null;
  selectedStores.value = e;
};

/**
 * 페이지 매장 분류 세팅
 */

const lngStoreAttrs = (e) => {
  initGrid();
  selectedStoreAttrs.value = e;
};
/**
 * 페이지 매장 슈퍼바이저 세팅
 */

const lngSupervisor = (e) => {
  initGrid();
  selectedStoreSuperVisor.value = e;
};
/**
 * 페이지 매장 팀 세팅
 */

const lngStoreTeam = (e) => {
  initGrid();
  selectedStoreTeam.value = e;
};

/* 매입사 콤보박스 */
const selectWeekDay = ref(null);
const weekDay = ref([]);
const selectedWeekDay = ref("");

/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getWeekDayList(87, "01");
  weekDay.value = res.data.weekDayList;
});

watch(selectWeekDay, (newValue) => {
  selectedWeekDay.value = newValue ? newValue.strDcode : "";
});

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
  documentSubTitle.value =
    selectedExcelDate.value + "\n" + selectedExcelStore.value;
  exportExcel.value = !exportExcel.value;
};

// 엑셀 추출
const documentSubTitle = ref("");
const selectedExcelDate = ref("");
/**
 * 엑셀용 일자 세팅 함수
 */

const excelDate = (e) => {
  selectedExcelDate.value = e;
};
const selectedExcelStore = ref("");
/**
 * 엑셀용 매장 세팅 함수
 */

const excelStore = (e) => {
  selectedExcelStore.value = e;
};
</script>

<style scoped>
.sls0601-search-panel {
  box-sizing: border-box;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  padding-left: var(--sls0601-panel-pad-x, 2rem);
  padding-right: var(--sls0601-panel-pad-x, 2rem);
}

@media (min-width: 768px) {
  .sls0601-search-panel {
    --sls0601-panel-pad-x: 3rem;
  }
}

.sls0601-search-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);
  column-gap: var(--sls0601-col-gutter, 1.25rem);
  align-items: start;
  min-width: 0;
}

.sls0601-left-stack {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: var(--sls0601-row-gap, 0.875rem);
  min-width: 0;
  width: 100%;
  max-width: 100%;
}

.sls0601-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  min-height: 2rem;
}

.sls0601-lbl {
  box-sizing: border-box;
  flex: 0 0 var(--sls0601-label-col, 5.5rem);
  width: var(--sls0601-label-col, 5.5rem);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
  text-align: center;
  white-space: nowrap;
}

.sls0601-date-slot {
  min-width: 0;
  flex: 1 1 auto;
}

.sls0601-date-slot :deep(> div.flex.justify-start.items-center) {
  margin: 0 !important;
  width: auto !important;
  max-width: 100%;
}

.sls0601-date-slot :deep(input[type="date"]) {
  box-sizing: border-box;
  height: 2rem;
  min-height: 2rem;
  max-height: 2rem;
  border: 1px solid var(--sls0601-control-border, #cbd5e1);
  border-radius: 0.375rem;
  background: #fff;
}

.sls0601-date-slot :deep(div.inline-flex.h-8),
.sls0601-date-slot :deep(button) {
  height: 2rem !important;
  min-height: 2rem !important;
}

/* Datepicker2 첫 날짜 input(w-36 = 9rem)과 동일 */
.sls0601-weekday-slot {
  flex: 0 0 9rem;
  width: 9rem;
  max-width: 9rem;
  min-width: 0;
}

.sls0601-search-panel :deep(.sls0601-vselect) {
  width: 100%;
  min-width: 0;
  height: 2rem;
  min-height: 2rem;
}

.sls0601-search-panel :deep(.sls0601-vselect .vs__dropdown-toggle) {
  box-sizing: border-box;
  height: 2rem !important;
  min-height: 2rem !important;
  padding: 0 0.5rem !important;
  border: 1px solid var(--sls0601-control-border, #cbd5e1) !important;
  border-radius: 0.375rem !important;
  background: #fff !important;
  overflow: hidden;
}

.sls0601-search-panel :deep(.sls0601-vselect .vs__selected-options) {
  display: flex;
  align-items: center;
  flex-wrap: nowrap !important;
  padding: 0 !important;
  margin: 0 !important;
  overflow: hidden;
  min-width: 0;
}

.sls0601-search-panel :deep(.sls0601-vselect .vs__selected),
.sls0601-search-panel :deep(.sls0601-vselect .vs__placeholder) {
  margin: 0 !important;
  padding: 0 !important;
  border: none;
  background: none;
  display: block;
  font-size: 0.875rem !important;
  line-height: 1.25rem !important;
  color: rgb(55 65 81);
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis;
  max-width: 100%;
}

.sls0601-search-panel :deep(.sls0601-vselect .vs__search) {
  margin: 0 !important;
  padding: 0 !important;
  font-size: 0.875rem !important;
}

.sls0601-search-panel :deep(.sls0601-vselect .vs__actions) {
  padding: 0 0 0 0.25rem !important;
}

.sls0601-check-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem 1.25rem;
  min-height: 2rem;
}

.sls0601-check {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.875rem;
  font-weight: 400;
  color: rgb(17 24 39);
  white-space: nowrap;
  cursor: pointer;
}

.sls0601-check input {
  margin: 0;
}

.sls0601-right-store {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  overflow: visible;
}

.sls0601-right-store :deep(select),
.sls0601-right-store :deep(input),
.sls0601-right-store :deep(button) {
  box-sizing: border-box;
}

.sls0601-right-store :deep(select),
.sls0601-right-store :deep(.h-8) {
  height: 2rem !important;
  min-height: 2rem !important;
}

@media (max-width: 1280px) {
  .sls0601-search-layout {
    grid-template-columns: minmax(0, 1fr);
    row-gap: var(--sls0601-row-gap, 0.875rem);
  }
}
</style>
