/*--############################################################################
# Filename : ACT04_003RPT.vue
# Description : 입출금관리 > 입출금 관리 >입출금 집계 현황
# Date :2025-05-21
# Author : 권맑음
################################################################################*/
<template>
  <!-- pl-5: 셸 w-right가 pl0이라 그리드가 좌측 메뉴에 붙음 → 우측 pd20과 맞춤 -->
  <div class="flex h-full min-h-0 flex-col pl-5" @click="handleParentClick">
    <div class="flex shrink-0 justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center space-x-2 pr-5">
        <button type="button" @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <button type="button" @click="excelButton" class="button save w-auto excel">
          엑셀
        </button>
      </div>
    </div>

    <div
      class="act0403-search-panel z-10 mt-3 w-full min-w-0 shrink-0 rounded-lg bg-gray-200"
      :style="{
        '--act0403-control-border': act0403ControlBorder,
        '--act0403-col-gap': act0403ColGap,
        '--act0403-row-gap': act0403RowGap,
        '--act0403-label-col': act0403LabelCol,
        '--act0403-item-gap': act0403ItemGap,
        '--act0403-row-min-h': act0403RowMinH,
        '--act0403-control-h': act0403ControlH,
      }">
      <div class="act0403-search-layout min-w-0">
        <div class="act0403-left-stack min-w-0">
          <div class="act0403-row">
            <div class="act0403-label">기간</div>
            <div class="act0403-field act0403-date-slot min-w-0">
              <Datepicker2
                ref="datepicker"
                omit-main-label
                filter-bar-align
                :mainName="'기간'"
                :initToday="1"
                :closePopUp="closePopUp"
                @endDate="endDate"
                @startDate="startDate"
                @excelDate="excelDate" />
            </div>
          </div>
          <div class="act0403-row">
            <div class="act0403-label" aria-hidden="true"></div>
            <div class="act0403-field act0403-checks min-w-0">
              <label class="act0403-check" for="act04-003-sum">
                <input
                  id="act04-003-sum"
                  type="checkbox"
                  v-model="cond"
                  @click="checkCond" />
                소계
              </label>
              <label class="act0403-check" for="act04-003-cellUnite">
                <input
                  id="act04-003-cellUnite"
                  type="checkbox"
                  v-model="cond2"
                  @click="checkCond2" />
                셀병합
              </label>
            </div>
          </div>
        </div>

        <div class="act0403-pick-slot min-w-0">
          <PickStoreSingle
            @lngStoreCode="lngStoreCodes"
            @lngStoreGroup="lngStoreGroup"
            @excelStore="excelStore"
            @lngStoreAttrs="lngStoreAttrs"
            @changeInit="changeInit" />
        </div>
      </div>
    </div>

    <div class="mt-2 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <Realgrid
        class="act0403-grid-body min-h-0 w-full flex-1"
        :progname="'ACT04_003RPT_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :setRowGroupSpan2="setRowGroupSpan2"
        :set-merge-mode="cond2"
        :documentTitle="'ACT04_003RPT'"
        :setFooter="true"
        :rowStateeditable="false"
        :setGroupFooter="cond"
        :setGroupColumnId="'strName,dtmDate'"
        :setGroupFooterColID="['Cnt', 'SumMoney']"
        :setGroupFooterExpressions="['sum', 'sum']"
        :setGroupSumCustomColumnId2="['InOutCodeName']"
        :setFooterColID="['Cnt', 'SumMoney']"
        :setFooterExpressions="['sum', 'sum']"
        :setFooterCustomColumnId="['strName']"
        :setFooterCustomText="['총합계']"
        row-group-hide-expander
        :documentSubTitle="documentSubTitle"
        :exporttoExcel="exportExcel" />
    </div>
  </div>
</template>

<script setup>
import {
  getAccCodeList,
  getDWAggDetail,
  getDWDetail,
  getEmployeeSummary,
} from "@/api/account";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

import Datepicker2 from "@/components/Datepicker2.vue";
/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
/**
 *  매장 선택 컴포넌트
 *  */

import PickStoreSingle from "@/components/pickStoreSingle.vue";
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

import { onMounted, ref } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";

const act0403ControlBorder = "#cbd5e1";
const act0403ColGap = "1.75rem";
const act0403RowGap = "0.75rem";
const act0403LabelCol = "5.75rem";
const act0403ItemGap = "0.75rem";
const act0403RowMinH = "2rem";
const act0403ControlH = "2rem";

const setRowGroupSpan = ref("");
const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);
const selectedstartDate = ref();
const selectedendDate = ref();
const hideColumnNow = ref(true);
const setGroupColumnId = ref("strName");
const CondList = ref([]);
const selectedCond = ref(0);
/** 셀병합 기본 OFF */
const setRowGroupSpan2 = ref("");
const mergeMask = ref("lngStoreCode");
const cond2 = ref(false);
/** 소계 기본 OFF */
const cond = ref(false);

const checkCond = (e) => {
  if (e.target.checked) {
    cond.value = true;

    reload.value = !reload.value;
  } else {
    reload.value = !reload.value;
    cond.value = false;
  }
};
const checkCond2 = (e) => {
  if (e.target.checked) {
    cond2.value = true;
    setRowGroupSpan2.value = "strName";
    reload.value = !reload.value;
  } else {
    setRowGroupSpan2.value = "";
    reload.value = !reload.value;
    cond2.value = false;
  }
};
/**
 * 선택한 매출 시작일자
 */

const startDate = (e) => {
  //comsole.log(e);
  selectedstartDate.value = e;
};
/**
 * 선택한 매출 종료일자
 */

const endDate = (e) => {
  selectedendDate.value = e;
};
const empId = ref("");
const empName = ref("");
const startTime = ref(0);
const endTime = ref(23);
const setGroupFooter = ref(true);
const selectedCause = ref(null);
const store = useStore();
const causeList = ref([]);
const tranType = ref(1);
const lngOption = ref(0);
const optionValue = ref("");
/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const userGroup = store.state.storeGroup[0].lngStoreGroup;

  //   const res = await getCauseList(userGroup, 0);
  //   causeList.value = res.data.List;
  //   //comsole.log(res);

  // const res2 = await getAccCodeList(userGroup);
  // ////console.log(res2);
  // CondList.value = res2.data.List;
});

const loginedstrLang = store.state.userData.lngLanguage;
/**
 *  조회 함수
 */

const searchButton = async () => {
  store.state.loading = true;
  try {
    initGrid();

    // if(tempSum.value == true){
    //   setGroupFooter.value = true
    // } else {
    //   setGroupFooter.value = false
    // }

    reload.value = !reload.value;

    const res = await getDWAggDetail(
      selectedGroup.value,
      selectedStores.value,
      selectedstartDate.value,
      selectedendDate.value
    );
    ////console.log(res);
    rowData.value = res.data.List;

    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
  } finally {
    store.state.loading = false;
  }
};

const selectedGroup = ref();
const selectedStores = ref();
const selectedStoreAttrs = ref();
/**
 * 페이지 매장 그룹 세팅
 */

const lngStoreGroup = (e) => {
  //comsole.log(e);
  selectedGroup.value = e;
};
/**
 * 페이지 매장 코드 세팅
 */

const lngStoreCodes = (e) => {
  selectedStores.value = e;
  //comsole.log(e);
};

/**
 * 페이지 매장 분류 세팅
 */

const lngStoreAttrs = (e) => {
  selectedStoreAttrs.value = e;
  //comsole.log(e);
};

/**
 * 그리드 초기화
 */

const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
};

const exportExcel = ref(false);

//comsole.log(store.state.minorCategory);

/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  documentSubTitle.value =
    selectedExcelDate.value + "\n" + selectedExcelStore.value;
  //comsole.log(documentSubTitle.value);
  exportExcel.value = !exportExcel.value;
};

const resetVselect2 = () => {
  endTime.value = 23;
};
const datepicker = ref(null);
const employee = ref(null);
const button = ref(null);
const closePopUp = ref(false);
/**
 * 매출 일자 안 라디오박스 닫기 위한 외부 클릭 감지 함수
 */

const handleParentClick = (e) => {
  const datepickerEl = datepicker.value?.$el;
  const employeeEl = employee.value?.$el;

  if (datepickerEl && datepickerEl.contains(e.target)) {
    return;
  }
  if (employeeEl && employeeEl.contains(e.target)) {
    return;
  }
  if (e.target.closest("button")) {
    return;
  }
  open.value = false;
  closePopUp.value = !closePopUp.value;
};
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
const tempHideStore = ref(true);

const tempCellUnite = ref(true);
const cellUnite = (e) => {
  if (e.target.checked) {
    tempCellUnite.value = true;
    setRowGroupSpan.value = "strName";
  } else {
    tempCellUnite.value = false;
    setRowGroupSpan.value = "";
  }
  reload.value = !reload.value;
};
const tempSum = ref(false);
const showSum = (e) => {
  if (e.target.checked) {
    setGroupColumnId.value = "strName";
    setGroupFooter.value = true;
    reload.value = !reload.value;
  } else {
    setGroupColumnId.value = "";
    setGroupFooter.value = false;
    reload.value = !reload.value;
  }
};
/**
 *  컴포넌트 변동시 감지 함수
 */

const changeInit = (e) => {
  initGrid();
};
const custName = (e) => {
  empName.value = e;
};
const custId = (e) => {
  empId.value = e;
};
const open = ref(false);
const openPopUp = (e) => {
  empName.value = "";
  empId.value = "";
  open.value = true;
};
const updateOpen = (e) => {
  open.value = false;
};
const resetOptionValue = (e) => {
  if (e.target.value == 0) {
    optionValue.value = "";
  }
};

const resetInputBox = (e) => {
  if (e.keyCode === 8 || e.keyCode === 46) {
    empId.value = "";
    empName.value = "";
  }
};
</script>

<style scoped>
.act0403-search-panel {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  --act0403-panel-pad-x: 2rem;
  padding-left: var(--act0403-panel-pad-x);
  padding-right: var(--act0403-panel-pad-x);
  padding-block: 0.75rem;
}

@media (min-width: 640px) {
  .act0403-search-panel {
    --act0403-panel-pad-x: 2.5rem;
  }
}

@media (min-width: 768px) {
  .act0403-search-panel {
    --act0403-panel-pad-x: 3.5rem;
  }
}

@media (min-width: 1024px) {
  .act0403-search-panel {
    --act0403-panel-pad-x: 4rem;
  }
}

.act0403-search-layout {
  display: grid;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  align-items: stretch;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.45fr);
  column-gap: var(--act0403-col-gap);
}

.act0403-left-stack {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--act0403-row-gap);
  min-width: 0;
}

.act0403-row {
  display: flex;
  min-width: 0;
  min-height: var(--act0403-row-min-h);
  flex-direction: row;
  align-items: center;
  gap: var(--act0403-item-gap);
}

.act0403-label {
  flex: 0 0 var(--act0403-label-col);
  width: var(--act0403-label-col);
  min-width: 0;
  max-width: var(--act0403-label-col);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: var(--act0403-row-min-h);
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
  text-align: center;
  white-space: nowrap;
}

.act0403-field {
  display: flex;
  min-width: 0;
  flex: 1 1 auto;
  align-items: center;
  min-height: var(--act0403-row-min-h);
  --act0403-period-first-w: calc((100% - 2.65rem) / 2);
}

.act0403-checks {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem 1.25rem;
  min-width: 0;
}

.act0403-check {
  display: inline-flex;
  align-items: center;
  min-height: var(--act0403-row-min-h);
  gap: 0.45rem;
  font-size: 0.875rem;
  line-height: 1.25;
  white-space: nowrap;
  cursor: pointer;
}

.act0403-check input[type="checkbox"] {
  box-sizing: border-box;
  margin: 0;
  flex-shrink: 0;
  width: 1.05rem;
  height: 1.05rem;
  min-width: 1.05rem;
  min-height: 1.05rem;
  accent-color: #2563eb;
  cursor: pointer;
}

.act0403-search-panel .act0403-date-slot :deep(> div.flex.justify-start.items-center) {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0;
  margin: 0 !important;
  gap: 0.25rem !important;
}

.act0403-search-panel .act0403-date-slot :deep(> div.flex > div.inline-flex.h-8) {
  flex: 1 1 auto;
  min-width: 0;
  max-width: 100%;
  width: 100%;
  gap: 0.125rem !important;
}

.act0403-search-panel .act0403-date-slot :deep(input[type="date"]) {
  box-sizing: border-box;
  height: var(--act0403-control-h) !important;
  min-height: var(--act0403-control-h) !important;
  max-height: var(--act0403-control-h) !important;
  border: 1px solid var(--act0403-control-border) !important;
  width: var(--act0403-period-first-w) !important;
  flex: 0 0 var(--act0403-period-first-w) !important;
  min-width: 0;
  max-width: var(--act0403-period-first-w);
  padding-left: 0.45rem;
  padding-right: 0.25rem;
  font-size: 0.875rem;
}

.act0403-search-panel .act0403-date-slot :deep(input[type="date"]:focus) {
  border-color: #3b82f6 !important;
}

.act0403-search-panel .act0403-date-slot :deep(div.inline-flex.h-8 > span) {
  flex-shrink: 0;
}

.act0403-search-panel .act0403-date-slot :deep(div.inline-flex.h-8 > button) {
  flex-shrink: 0;
  width: 1.65rem !important;
  height: 1.65rem !important;
  min-width: 1.65rem;
  margin-left: 0 !important;
}

.act0403-pick-slot {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-width: 0;
  min-height: 100%;
}

.act0403-pick-slot :deep(.pss-root) {
  width: 85%;
  max-width: 85%;
  min-width: 0;
}

.act0403-pick-slot :deep(.pss-brand) {
  font-size: 1rem !important;
  font-weight: 600 !important;
  line-height: 1.25 !important;
  color: rgb(17 24 39) !important;
}

.act0403-grid-body {
  min-height: 12rem;
}
</style>
