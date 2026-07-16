/*--############################################################################
# Filename : SLS02_014RPT.vue
# Description : 매출관리 > 매장별 매출 현황 > 지역/업종별 매출 현황.
# Date :2025-05-14
# Author : 권맑음
################################################################################*/
<template>
  <div class="flex h-full min-h-0 flex-col" @click="handleParentClick">
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
      class="sls0214-search-panel z-10 mt-3 w-full min-h-0 shrink-0 overflow-visible rounded-lg bg-gray-200"
      :style="{
        '--sls0214-panel-pad-x': '2rem',
        '--sls0214-control-border': sls0214ControlBorder,
        '--sls0214-col-gutter': sls0214ColGutter,
        '--sls0214-row-gap': sls0214RowGap,
        '--sls0214-label-col': sls0214LabelCol,
        '--psp-label-w': sls0214LabelCol,
        '--psp-radio-w': '4.75rem',
        '--psp-col-gap': '0.5rem',
      }">
      <div class="sls0214-search-layout min-w-0">
        <!-- 좌측: 매출일자 / 조회조건 -->
        <div class="sls0214-left-stack min-w-0">
          <div class="sls0214-row">
            <span class="sls0214-lbl shrink-0">매출일자</span>
            <div class="sls0214-date-slot min-w-0 flex-1">
              <Datepicker2
                ref="datepicker"
                omit-main-label
                filter-bar-align
                :mainName="'매출일자'"
                :closePopUp="closePopUp"
                @endDate="endDate"
                @startDate="startDate"
                @excelDate="excelDate" />
            </div>
          </div>

          <div class="sls0214-row">
            <span class="sls0214-lbl shrink-0">조회조건</span>
            <div class="sls0214-checks flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1">
              <label class="sls0214-check-label" for="daily">
                <input
                  id="daily"
                  type="checkbox"
                  class="sls0214-check"
                  @change="seeDaily" />
                일자별
              </label>
              <label class="sls0214-check-label" for="store">
                <input
                  id="store"
                  type="checkbox"
                  class="sls0214-check"
                  @change="seeStore" />
                매장별
              </label>
              <label class="sls0214-check-label" for="sum">
                <input
                  id="sum"
                  type="checkbox"
                  class="sls0214-check"
                  @change="seeSum" />
                합계
              </label>
            </div>
          </div>
        </div>

        <!-- 우측: 매장명 -->
        <div class="sls0214-right-store min-w-0 overflow-visible">
          <PickStorePlural
            fluid-width
            @lngStoreCodes="lngStoreCodes"
            @lngStoreGroup="lngStoreGroup"
            @lngStoreAttrs="lngStoreAttrs"
            @excelStore="excelStore" />
        </div>
      </div>
    </div>

    <div class="mt-2 flex min-h-0 min-w-0 flex-1 flex-col">
      <div class="relative min-h-0 w-full flex-1">
        <Realgrid
          :progname="'SLS02_014RPT_VUE'"
          :progid="progid"
          :rowData="rowData"
          :reload="reload"
          :setFooter="true"
          :setGroupFooter="setGroupFooter"
          :setFooterExpressions="setFooterExpressions"
          :setFooterColID="setFooterColID"
          :setGroupColumnId="'strStore'"
          :setGroupSumCustomText="['소계']"
          :setGroupSumCustomColumnId="setGroupSumCustomColumnId"
          :setGroupSumCustomLevel="3"
          :setGroupSummaryCenterIds="setGroupSummaryCenterIds"
          :setGroupFooterExpressions="setGroupFooterExpressions"
          :setGroupFooterColID="setGroupFooterColID"
          :documentTitle="'SLS02_014RPT'"
          :rowStateeditable="false"
          :documentSubTitle="documentSubTitle"
          :exporttoExcel="exportExcel">
        </Realgrid>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getAreaIndustrySalesReport } from "@/api/misales";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

import Datepicker2 from "@/components/Datepicker2.vue";
/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";

/**
 * 	다중 매장 선택 컴포넌트
 */

import PickStorePlural from "@/components/pickStorePlural.vue";

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

/** 조회 AREA — SLS04 / SLS02_031 wire 패턴 */
const sls0214ControlBorder = "#cbd5e1";
const sls0214ColGutter = "1.25rem";
const sls0214RowGap = "0.875rem";
const sls0214LabelCol = "5.5rem";

/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
});

const setGroupFooter = ref(false);
const setFooterColID = ref([
  "strStore",
  "lngRecCnt",
  "lngRecAmt",
  "lngCustCnt",
  "lngCustAmt",
  "lngSalAmt",
  "lngDiscountAmt",
  "lngTotAmt",
  "lngVAT",
  "lngSupplyAmt",
  "dblDistRate",
  "lngWorkDay",
  "lngActAvg",
  "lngStoreCode",
]);
const setGroupFooterColID = ref([
  "strStore",
  "lngRecCnt",
  "lngRecAmt",
  "lngCustCnt",
  "lngCustAmt",
  "lngSalAmt",
  "lngDiscountAmt",
  "lngTotAmt",
  "lngVAT",
  "lngSupplyAmt",
  "dblDistRate",
  "lngWorkDay",
  "lngActAvg",
  "lngStoreCode",
]);
const setFooterExpressions = ref([
  "custom",
  "sum",
  "avg",
  "sum",
  "avg",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "avg",
  "custom",
]);
const setGroupFooterExpressions = ref([
  "custom",
  "sum",
  "avg",
  "sum",
  "avg",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "avg",
  "custom",
]);
const setGroupSummaryCenterIds = ref("dtmDate,dayName");
const setGroupSumCustomColumnId = ref(["lngStoreCode"]);
const progid = ref(1);
const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);
const selectedstartDate = ref();
const selectedendDate = ref();

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
/* 합계 체크박스 */
const seeSum = (e) => {
  //comsole.log(e.target.checked);
  if (e.target.checked) {
    setGroupFooter.value = true;
  } else {
    setGroupFooter.value = false;
  }
  reload.value = !reload.value;
};
const tempSeeDaily = ref(false);
const tempSeeStore = ref(false);
const tempCheckData = ref(3);

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
    // 일자별 매장별
    tempCheckData.value = 12;
    setGroupSumCustomColumnId.value = ["dayName"];
  } else if (tempSeeDaily.value) {
    // 일자별
    tempCheckData.value = 1;
    setGroupSumCustomColumnId.value = ["dayName"];
  } else if (tempSeeStore.value) {
    // 매장별
    tempCheckData.value = 2;
    setGroupSumCustomColumnId.value = ["strStoreAttr"];
  } else {
    tempCheckData.value = 3;
    setGroupSumCustomColumnId.value = ["lngStoreCode"];
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
    //   //comsole.log(tempCheckData.value)
    progid.value = tempCheckData.value;
    //그리드 갱신
    reload.value = !reload.value;

    //매장 선택
    let selectedStorearr;
    // //comsole.log(selectedStores.value)
    // if (selectedStores.value == undefined || selectedStores.value.length == 0) {
    //   //comsole.log('여기오냐?')
    //   selectedStorearr = ref(store.state.storeCd).value.map(item => item.lngStoreCode).join(',');
    // } else {
    selectedStorearr = selectedStores.value;
    //}

    //comsole.log(selectedStorearr);

    // 체크박스별 조회
    if (progid.value == 1) {
      // 일자별 조회
      const res = await getAreaIndustrySalesReport(
        selectedGroup.value,
        selectedStorearr,
        selectedstartDate.value,
        selectedendDate.value,
        1,
        loginedstrLang
      );
      //comsole.log(res);
      rowData.value = res.data.areaIndustrySales;
    } else if (progid.value == 2) {
      // 매장별 조회
      const res = await getAreaIndustrySalesReport(
        selectedGroup.value,
        selectedStorearr,
        selectedstartDate.value,
        selectedendDate.value,
        2,
        loginedstrLang
      );
      //comsole.log(res);
      rowData.value = res.data.areaIndustrySales;
    } else if (progid.value == 12) {
      // 일자별 매장별 조회
      const res = await getAreaIndustrySalesReport(
        selectedGroup.value,
        selectedStorearr,
        selectedstartDate.value,
        selectedendDate.value,
        12,
        loginedstrLang
      );
      //comsole.log(res);
      rowData.value = res.data.areaIndustrySales;
    } else {
      // 조회
      const res = await getAreaIndustrySalesReport(
        selectedGroup.value,
        selectedStorearr,
        selectedstartDate.value,
        selectedendDate.value,
        0,
        loginedstrLang
      );
      //comsole.log(res);
      rowData.value = res.data.areaIndustrySales;
    }

    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    //comsole.log(error);
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
  initGrid();
  //comsole.log(e);
  selectedGroup.value = e;
};
/**
 * 페이지 매장 코드 세팅
 */

const lngStoreCodes = (e) => {
  initGrid();
  selectedStores.value = e;
  //comsole.log(e);
};

/**
 * 페이지 매장 분류 세팅
 */

const lngStoreAttrs = (e) => {
  initGrid();
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

//엑셀 버튼 처리 함수
const exportExcel = ref(false);
/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  documentSubTitle.value =
    selectedExcelDate.value + "\n" + selectedExcelStore.value;
  //comsole.log(documentSubTitle.value);
  // 엑셀 기능 실행
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
  //comsole.log(e);
};
const selectedExcelStore = ref("");

/**
 * 엑셀용 매장 세팅 함수
 */

const excelStore = (e) => {
  selectedExcelStore.value = e;
  //comsole.log(e);
};
</script>

<style scoped>
.sls0214-search-panel {
  box-sizing: border-box;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  padding-left: var(--sls0214-panel-pad-x, 2rem);
  padding-right: var(--sls0214-panel-pad-x, 2rem);
}

@media (min-width: 768px) {
  .sls0214-search-panel {
    --sls0214-panel-pad-x: 3rem;
  }
}

.sls0214-search-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);
  column-gap: var(--sls0214-col-gutter, 1.25rem);
  align-items: start;
  min-width: 0;
}

.sls0214-left-stack {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: var(--sls0214-row-gap, 0.875rem);
  min-width: 0;
  width: 100%;
  max-width: 100%;
}

.sls0214-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  min-height: 2rem;
}

.sls0214-lbl {
  box-sizing: border-box;
  flex: 0 0 var(--sls0214-label-col, 5.5rem);
  width: var(--sls0214-label-col, 5.5rem);
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

.sls0214-checks {
  min-width: 0;
}

.sls0214-check-label {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.9375rem;
  line-height: 1.25;
  font-weight: 400;
  color: #1f2937;
  white-space: nowrap;
  cursor: pointer;
}

.sls0214-check {
  width: 1rem;
  height: 1rem;
  margin: 0;
  accent-color: #2563eb;
  cursor: pointer;
}

.sls0214-date-slot {
  min-width: 0;
  flex: 1 1 auto;
}

.sls0214-date-slot :deep(> div.flex.justify-start.items-center) {
  margin: 0 !important;
  width: auto !important;
  max-width: 100%;
}

.sls0214-date-slot :deep(input[type="date"]) {
  box-sizing: border-box;
  height: 2rem;
  min-height: 2rem;
  border: 1px solid var(--sls0214-control-border, #cbd5e1);
  border-radius: 0.375rem;
  background: #fff;
}

.sls0214-date-slot :deep(div.inline-flex.h-8),
.sls0214-date-slot :deep(button) {
  height: 2rem !important;
  min-height: 2rem !important;
}

.sls0214-right-store {
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

.sls0214-right-store:has(.psp-popup),
.sls0214-right-store:has(.psp-store-hover-list) {
  z-index: 50;
}

.sls0214-right-store :deep(.psp-root) {
  grid-template-columns:
    var(--psp-label-w, 5.5rem)
    minmax(var(--psp-radio-w, 4.75rem), auto)
    minmax(7rem, 1.05fr)
    minmax(9.5rem, 1.3fr)
    minmax(9.5rem, 1.35fr);
  column-gap: var(--psp-col-gap, 0.5rem);
  row-gap: 0.5rem;
  width: 100%;
  max-width: 100%;
  min-width: 0;
}

.sls0214-right-store :deep(.psp-label) {
  width: var(--psp-label-w, 5.5rem);
  justify-content: center;
  padding-inline-start: 0;
  font-size: 1rem;
  font-weight: 600;
}

/* 매장 콤보/트리거 — 일자(h-8)와 동일 높이 */
.sls0214-right-store :deep(.psp-select),
.sls0214-right-store :deep(.psp-store-trigger),
.sls0214-right-store :deep(.psp-collapse-btn) {
  height: 2rem !important;
  min-height: 2rem !important;
}

.sls0214-right-store :deep(.psp-collapse-btn) {
  width: 2rem !important;
}

.sls0214-right-store :deep(.psp-popup) {
  z-index: 60;
  right: 0;
  left: auto;
  width: min(42rem, 92vw);
  min-width: 28rem;
  max-width: min(42rem, 92vw);
}

@media (max-width: 1280px) {
  .sls0214-search-layout {
    grid-template-columns: minmax(0, 1fr);
    row-gap: var(--sls0214-row-gap, 0.875rem);
  }

  .sls0214-right-store :deep(.psp-popup) {
    left: 0;
    right: auto;
  }
}
</style>
