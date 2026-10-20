/*--############################################################################
# Filename : ACT04_002RPT.vue
# Description : 입출금관리 > 입출금 관리 >입출금 상세 현황
# Date :2025-05-20
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
      class="act0402-search-panel z-10 mt-3 w-full min-w-0 shrink-0 rounded-lg bg-gray-200"
      :style="{
        '--act0402-control-border': act0402ControlBorder,
        '--act0402-col-gap': act0402ColGap,
        '--act0402-row-gap': act0402RowGap,
        '--act0402-label-col': act0402LabelCol,
        '--act0402-item-gap': act0402ItemGap,
        '--act0402-row-min-h': act0402RowMinH,
        '--act0402-control-h': act0402ControlH,
      }">
      <div class="act0402-search-layout min-w-0">
        <!-- 좌: 기간 / 계정과목·셀병합 -->
        <div class="act0402-left-stack min-w-0">
          <div class="act0402-row">
            <div class="act0402-label">기간</div>
            <div class="act0402-field act0402-date-slot min-w-0">
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
          <div class="act0402-row">
            <div class="act0402-label">계정과목</div>
            <div class="act0402-field act0402-acc-field min-w-0">
              <select
                id="act04-002-acc"
                v-model="selectedCond"
                class="act0402-sg-select act0402-acc-select">
                <option value="0">전체</option>
                <option
                  v-for="i in CondList"
                  :key="i.lngAccCode"
                  :value="i.lngAccCode">
                  {{ i.strAccName }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- 우: 매장 (PickStoreSingle — 기존 컴포넌트·이벤트 유지) -->
        <div class="act0402-pick-slot min-w-0">
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
        class="act0402-grid-body min-h-0 w-full flex-1"
        :progname="'ACT04_002RPT_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :setRowGroupSpan2="setRowGroupSpan2"
        :mergeMask="mergeMask"
        :documentTitle="'ACT04_002RPT'"
        :documentSubTitle="documentSubTitle"
        :exporttoExcel="exportExcel" />
    </div>
  </div>
</template>

<script setup>
import { getAccCodeList, getDWDetail, getEmployeeSummary } from "@/api/account";
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

const act0402ControlBorder = "#cbd5e1";
const act0402ColGap = "1.75rem";
const act0402RowGap = "0.75rem";
const act0402LabelCol = "5.75rem";
const act0402ItemGap = "0.75rem";
const act0402RowMinH = "2rem";
const act0402ControlH = "2rem";

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
/** 셀병합 — 조회 AREA 체크박스 없이 기본 병합 유지 */
const setRowGroupSpan2 = ref("lngStoreCode,strName,dtmDate,lngCode,InOutName");
const mergeMask = ref("lngStoreCode,strName,dtmDate");
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

  const res2 = await getAccCodeList(userGroup);
  ////console.log(res2);
  CondList.value = res2.data.List;
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

    const res = await getDWDetail(
      selectedGroup.value,
      selectedStores.value,
      selectedstartDate.value,
      selectedendDate.value,
      selectedCond.value
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
.act0402-search-panel {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  --act0402-panel-pad-x: 2rem;
  padding-left: var(--act0402-panel-pad-x);
  padding-right: var(--act0402-panel-pad-x);
  padding-block: 0.75rem;
}

@media (min-width: 640px) {
  .act0402-search-panel {
    --act0402-panel-pad-x: 2.5rem;
  }
}

@media (min-width: 768px) {
  .act0402-search-panel {
    --act0402-panel-pad-x: 3.5rem;
  }
}

@media (min-width: 1024px) {
  .act0402-search-panel {
    --act0402-panel-pad-x: 4rem;
  }
}

.act0402-search-layout {
  display: grid;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  align-items: stretch;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.45fr);
  column-gap: var(--act0402-col-gap);
}

.act0402-left-stack {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--act0402-row-gap);
  min-width: 0;
}

.act0402-row {
  display: flex;
  min-width: 0;
  min-height: var(--act0402-row-min-h);
  flex-direction: row;
  align-items: center;
  gap: var(--act0402-item-gap);
}

.act0402-label {
  flex: 0 0 var(--act0402-label-col);
  width: var(--act0402-label-col);
  min-width: 0;
  max-width: var(--act0402-label-col);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: var(--act0402-row-min-h);
  /* 매장명(.pss-brand text-base)과 동일 */
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
  text-align: center;
  white-space: nowrap;
}

.act0402-field {
  display: flex;
  min-width: 0;
  flex: 1 1 auto;
  align-items: center;
  min-height: var(--act0402-row-min-h);
  /* ~ + 캘린더 버튼·간격 제외한 절반 = 기간 시작일 폭 → 계정과목과 공유 */
  --act0402-period-first-w: calc((100% - 2.65rem) / 2);
}

.act0402-sg-select {
  box-sizing: border-box;
  height: var(--act0402-control-h);
  min-height: var(--act0402-control-h);
  max-height: var(--act0402-control-h);
  min-width: 0;
  padding: 0 0.375rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: rgb(55 65 81);
  background: #fff;
  border: 1px solid var(--act0402-control-border);
  border-radius: 0.375rem;
}

/* 계정과목 콤보 = 기간 시작일(첫번째 date) 폭 */
.act0402-acc-select {
  width: var(--act0402-period-first-w);
  max-width: var(--act0402-period-first-w);
  flex: 0 0 var(--act0402-period-first-w);
}

.act0402-sg-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.2);
}

.act0402-search-panel .act0402-date-slot :deep(> div.flex.justify-start.items-center) {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0;
  margin: 0 !important;
  gap: 0.25rem !important;
}

.act0402-search-panel .act0402-date-slot :deep(> div.flex > div.inline-flex.h-8) {
  flex: 1 1 auto;
  min-width: 0;
  max-width: 100%;
  width: 100%;
  gap: 0.125rem !important;
}

.act0402-search-panel .act0402-date-slot :deep(input[type="date"]) {
  box-sizing: border-box;
  height: var(--act0402-control-h) !important;
  min-height: var(--act0402-control-h) !important;
  max-height: var(--act0402-control-h) !important;
  border: 1px solid var(--act0402-control-border) !important;
  width: var(--act0402-period-first-w) !important;
  flex: 0 0 var(--act0402-period-first-w) !important;
  min-width: 0;
  max-width: var(--act0402-period-first-w);
  padding-left: 0.45rem;
  padding-right: 0.25rem;
  font-size: 0.875rem;
}

.act0402-search-panel .act0402-date-slot :deep(input[type="date"]:focus) {
  border-color: #3b82f6 !important;
}

.act0402-search-panel .act0402-date-slot :deep(div.inline-flex.h-8 > span) {
  flex-shrink: 0;
}

.act0402-search-panel .act0402-date-slot :deep(div.inline-flex.h-8 > button) {
  flex-shrink: 0;
  width: 1.65rem !important;
  height: 1.65rem !important;
  min-width: 1.65rem;
  margin-left: 0 !important;
}

.act0402-pick-slot {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-width: 0;
  min-height: 100%;
}

/* 매장 콤보 ~85% — 줄어든 15%는 가운데(좌측 스택과의 사이)에 둠 */
.act0402-pick-slot :deep(.pss-root) {
  width: 85%;
  max-width: 85%;
  min-width: 0;
}

/* 매장명 라벨 — 기간·계정과목과 동일 폰트 */
.act0402-pick-slot :deep(.pss-brand) {
  font-size: 1rem !important;
  font-weight: 600 !important;
  line-height: 1.25 !important;
  color: rgb(17 24 39) !important;
}

.act0402-grid-body {
  min-height: 12rem;
}
</style>
