/*--############################################################################
# Filename : MST01_033INS.vue                                                  
# Description : 마스터관리 > 메뉴 마스터 > 메뉴코드등록                        
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
      class="act09-search-panel z-10 mt-3 w-full min-h-0 shrink-0 overflow-x-auto rounded-lg bg-gray-200 px-8 py-3 md:px-12">
      <div
        class="act09-wire-grid min-w-0"
        :style="{
          '--act09-control-border': act09ControlBorder,
          '--act09-col-gutter': act09ColGutter,
          '--act09-row-gap': act09RowGap,
          '--act09-label-col': act09LabelCol,
          '--act09-item-gap': act09ItemGap,
          '--act09-store-group-w': act09StoreGroupWidth,
          '--act09-store-attr-w': act09StoreAttrWidth,
        }">
        <div class="act09-wire-cell">
          <div class="act09-wire-label">일자</div>
          <div class="act09-wire-field act09-date-slot min-w-0 overflow-hidden">
            <Datepicker2
              ref="datepicker"
              omit-main-label
              filter-bar-align
              :mainName="'일자'"
              :initToday="1"
              :closePopUp="closePopUp"
              @excelDate="excelDate"
              @endDate="endDate"
              @startDate="startDate" />
          </div>
        </div>
        <div class="act09-wire-cell">
          <div class="act09-wire-label">매장선택</div>
          <div class="act09-wire-field act09-pick-slot act09-pick-slot--store-grid min-w-0">
            <PickStoreRenew3
              ref="pickStoreRef"
              compact
              omit-main-label
              combo-fill
              init-store-from-store-cd
              @lngStoreCode="lngStoreCodes"
              @lngStoreGroup="lngStoreGroup"
              @excelStore="excelStore"
              @lngStoreAttrs="lngStoreAttrs"
              @changeInit="changeInit" />
          </div>
        </div>
        <div class="act09-wire-cell">
          <div class="act09-wire-label">거래구분</div>
          <div class="act09-wire-field min-w-0">
            <select
              id="act09-004-tran-type"
              v-model="tranType"
              class="act09-sg-select h-8 w-full min-w-0 rounded-md border border-solid bg-white text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option :value="1">포인트</option>
              <option :value="2">급여공제</option>
            </select>
          </div>
        </div>

        <div class="act09-wire-cell">
          <div class="act09-wire-label">소속사</div>
          <div class="act09-wire-field min-w-0">
            <select
              id="act09-004-aff-comp"
              v-model="affiliateCompCode"
              :disabled="
                affiliateCompLocked ||
                affiliateCompList.length === 0 ||
                affiliateCompLoading
              "
              class="act09-sg-select h-8 w-full min-w-0 rounded-md border border-solid bg-white text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
              @change="onAffiliateCompChange">
              <option v-if="affiliateCompList.length === 0" disabled value="">
                {{ affiliateCompLoading ? "불러오는 중..." : "소속사 없음" }}
              </option>
              <option
                v-for="item in affiliateCompList"
                :key="item.value"
                :value="item.value">
                {{ item.label }}
              </option>
            </select>
          </div>
        </div>
        <div class="act09-wire-cell">
          <div class="act09-wire-label">조회옵션</div>
          <div class="act09-wire-field act09-pair-row min-w-0">
            <select
              id="act09-004-option"
              :value="1"
              disabled
              class="act09-sg-select h-8 w-full min-w-0 rounded-md border border-solid bg-white text-sm text-gray-700 disabled:cursor-not-allowed disabled:bg-gray-100">
              <option :value="1">부서</option>
            </select>
            <input
              id="act09-004-option-value"
              v-model="optionValue"
              type="text"
              class="act09-sg-input h-8 min-h-8 min-w-0 w-full rounded-md border border-solid bg-white px-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              @keydown.enter="searchButton" />
          </div>
        </div>
        <div class="act09-wire-cell">
          <div class="act09-wire-label">사원명</div>
          <div class="act09-wire-field act09-emp-row min-w-0">
            <input
              id="act09-004-emp-id"
              v-model="empId"
              type="text"
              readonly
              class="act09-sg-input h-8 min-h-8 min-w-0 w-full rounded-md border border-solid bg-white px-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              @keydown="resetInputBox" />
            <input
              id="act09-004-emp-name"
              v-model="empName"
              type="text"
              readonly
              class="act09-sg-input h-8 min-h-8 min-w-0 w-full rounded-md border border-solid bg-white px-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              @keydown="resetInputBox" />
            <button
              type="button"
              class="act09-sub-btn shrink-0"
              @click="openPopUp">
              조회
            </button>
          </div>
        </div>
      </div>
    </div>

    <EmployeePopUp
      :open="open"
      employees-program-id="ACT09_004RPT"
      :affiliate-comp-list="affiliateCompList"
      :affiliate-comp-code="affiliateCompCode"
      :affiliate-comp-locked="affiliateCompLocked"
      :affiliate-comp-loading="affiliateCompLoading"
      @custId="custId"
      @custName="custName"
      @updateOpen="updateOpen" />

    <div class="mt-2 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <div class="relative h-full min-h-0 min-w-0 flex-1">
        <Realgrid
          :progname="'ACT09_004RPT_VUE'"
          :progid="1"
          :rowData="rowData"
          :reload="reload"
          :rowStateeditable="false"
          :setFooter="true"
          :setFooterExpressions="['sum', 'sum']"
          :setFooterColID="['lngUseCnt', 'dblSaleAmt']"
          :setFooterCustomColumnId="['strSaleCustName']"
          :setFooterCustomText="['합계']"
          :setGroupFooterColID="['strName', 'lngUseCnt', 'dblSaleAmt']"
          :setGroupFooterExpressions="['custom', 'sum', 'sum']"
          :setGroupSumCustomColumnId="['strSaleCustName']"
          :setGroupSumCustomText="['사원소계']"
          :setGroupFooter="true"
          :setMergeMode="false"
          :setGroupColumnId="'strSaleCustID'"
          :documentTitle="'ACT09_004RPT'"
          :documentSubTitle="documentSubTitle"
          :exporttoExcel="exportExcel">
        </Realgrid>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getEmployeeDetailSummary004 } from "@/api/account";
import {
  buildAffCompCombos,
  getAffComp,
  getCustCompany050,
} from "@/api/micrm";
import { getCauseList } from "@/api/misales";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

import Datepicker2 from "@/components/Datepicker2.vue";
import EmployeePopUp from "@/components/employeePopUp.vue";
/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
/**
 *  매장 선택 컴포넌트
 *  */

import PickStoreRenew3 from "@/components/pickStoreRenew.vue";
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

import { onMounted, onUnmounted, ref } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";

const orderPay = ref(1);
const setFooterColID = ref([
  "lngRecCnt",
  "lngRecAmt",
  "lngCustCnt",
  "lngCustAmt",
  "lngSalAmt",
  "lngDiscount",
  "lngActAmt",
  "lngVAT",
  "lngSupplyAmt",
  "dblDistRate",
  "lngTotAmt",
  "dtmDate",
]);
const setGroupFooterColID = ref([
  "lngRecCnt",
  "lngRecAmt",
  "lngCustCnt",
  "lngCustAmt",
  "lngSalAmt",
  "lngDiscount",
  "lngActAmt",
  "lngVAT",
  "lngSupplyAmt",
  "dblDistRate",
  "lngTotAmt",
  "dtmDate",
]);
const setFooterExpressions = ref([
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
  "custom",
]);
const setGroupFooterExpressions = ref([
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
  "custom",
]);
const setGroupSummaryCenterIds = ref("strTime");
const progid = ref(1);
const setRowGroupSpan = ref("");
const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);
const selectedstartDate = ref();
const selectedendDate = ref();
const hideColumnNow = ref(true);
const setGroupColumnId = ref("strName");
const hideColumnsId = ref([]);
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
const lngOption = ref(1);
const optionValue = ref("");
const strSaleCompCode = ref("");
const strSaleCompName = ref("");
const affiliateCompList = ref([]);
const affiliateCompCode = ref("");
const affiliateCompLocked = ref(false);
const affiliateCompLoading = ref(true);
const pickStoreRef = ref(null);

const getPickerStoreCode = () => {
  const code = pickStoreRef.value?.getSelectedStoreCode?.();
  if (code == null || code === "" || code === 0 || code === "0") {
    return null;
  }
  return code;
};

const resetAffCompCombos = () => {
  strSaleCompCode.value = "";
  strSaleCompName.value = "";
  affiliateCompList.value = [];
  affiliateCompCode.value = "";
  affiliateCompLocked.value = false;
};

const loadAffComp = async () => {
  if (!strSaleCompCode.value || strSaleCompCode.value === "0") {
    resetAffCompCombos();
    return;
  }
  try {
    const res = await getAffComp(
      strSaleCompCode.value,
      store.state.userData.lngStoreGroup,
      store.state.userData.lngSequence
    );
    if (res.data?.RESULT_CD !== "00") {
      resetAffCompCombos();
      return;
    }
    const combo = buildAffCompCombos(res.data?.List ?? []);
    affiliateCompLocked.value = combo.singleLocked;
    affiliateCompList.value = combo.topOptions;
    affiliateCompCode.value = combo.topValue;
  } catch (error) {
    resetAffCompCombos();
  }
};

/** CRM01_050INS(PickCustCompany setAPI=2)와 동일 — 로그인 매장그룹·포지션으로 고객사 조회 후 소속사 로드 */
const loadCustCompanyAndAffComp = async () => {
  affiliateCompLoading.value = true;
  resetAffCompCombos();
  try {
    const res = await getCustCompany050(
      store.state.userData.lngStoreGroup,
      store.state.userData.lngPosition
    );
    const list = res.data?.List ?? [];
    if (list.length === 0) {
      return;
    }
    const comp = list.length === 1 ? list[0] : list[0];
    strSaleCompCode.value = comp.strSaleCompCode ?? "";
    strSaleCompName.value = comp.strSaleCompName ?? "";
    if (strSaleCompCode.value) {
      await loadAffComp();
    }
  } catch (error) {
    resetAffCompCombos();
  } finally {
    affiliateCompLoading.value = false;
  }
};

const getAffCompCdParam = () => {
  const code = affiliateCompCode.value;
  if (!code || code === "0" || code === "") {
    return "0";
  }
  return String(code);
};

const getSearchOptionParams = () => ({
  searchLngOption: lngOption.value,
  searchOptionValue: optionValue.value,
});

const getAffiliateExcelLabel = () => {
  const affCode = affiliateCompCode.value;
  if (!affCode || affCode === "0" || affiliateCompList.value.length === 0) {
    return "전체";
  }
  const aff = affiliateCompList.value.find((i) => i.value === affCode);
  return aff?.label ?? "전체";
};

const onAffiliateCompChange = () => {
  initGrid();
};

/** 조회 AREA — ACT09 wire 패턴 */
const act09ControlBorder = "#cbd5e1";
const act09ColGutter = "1.5rem";
const act09RowGap = "0.875rem";
const act09LabelCol = "5.5rem";
const act09ItemGap = "0.5rem";
const act09StoreGroupWidth = "calc(8.625rem * 0.8)";
const act09StoreAttrWidth = "calc(6.75rem * 0.9)";
/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  document.body.classList.add("act09-page-active");
  const pageLog = await insertPageLog(store.state.activeTab2);

  const userGroup = store.state.storeGroup[0].lngStoreGroup;

  const res = await getCauseList(userGroup, 0);
  causeList.value = res.data.List;
  await loadCustCompanyAndAffComp();
});

onUnmounted(() => {
  document.body.classList.remove("act09-page-active");
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

    const { searchLngOption, searchOptionValue } = getSearchOptionParams();
    const storeCd = getPickerStoreCode() ?? selectedStores.value;

    const res = await getEmployeeDetailSummary004(
      selectedGroup.value,
      selectedStoreAttrs.value,
      storeCd,
      selectedstartDate.value,
      selectedendDate.value,
      tranType.value,
      empId.value,
      searchLngOption,
      searchOptionValue,
      getAffCompCdParam()
    );
    //comsole.log(res);
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
  selectedGroup.value = e;
};
/**
 * 페이지 매장 코드 세팅
 */

const lngStoreCodes = (e) => {
  selectedStores.value = e;
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
  let condition = "거래 구분 :";

  if (tranType.value == 1) {
    condition += "포인트";
  } else {
    condition += "급여공제";
  }

  let condition2 = "조회 옵션 :부서";
  condition2 += optionValue.value;

  let conditionAff = "소속사 : " + getAffiliateExcelLabel();

  let condition3 = "사원명 : " + empId.value + "," + empName.value;

  documentSubTitle.value =
    selectedExcelDate.value +
    "\n" +
    selectedExcelStore.value +
    "\n" +
    condition +
    "\n" +
    condition2 +
    "\n" +
    conditionAff +
    "\n" +
    condition3;
  //comsole.log(documentSubTitle.value);
  exportExcel.value = !exportExcel.value;
};

const resetVselect2 = () => {
  endTime.value = 23;
};
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

const changeInit = () => {
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

const resetInputBox = (e) => {
  if (e.keyCode === 8 || e.keyCode === 46) {
    empId.value = "";
    empName.value = "";
  }
};
</script>

<style scoped>
.act09-wire-grid {
  display: grid;
  width: 100%;
  min-width: 0;
  align-items: center;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  column-gap: var(--act09-col-gutter);
  row-gap: var(--act09-row-gap);
}

.act09-wire-cell {
  display: flex;
  min-width: 0;
  flex-direction: row;
  align-items: center;
  gap: var(--act09-item-gap);
}

.act09-wire-label {
  flex: 0 0 var(--act09-label-col);
  width: var(--act09-label-col);
  min-width: 0;
  max-width: var(--act09-label-col);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.act09-wire-field {
  display: flex;
  min-width: 0;
  max-width: 100%;
  flex: 1 1 auto;
  align-items: center;
}

.act09-wire-field:not(.act09-pair-row):not(.act09-emp-row) > * {
  min-width: 0;
  width: 100%;
}

.act09-pair-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.5fr);
  column-gap: 0.5rem;
  align-items: center;
  min-width: 0;
}

.act09-emp-row {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 3fr) auto;
  column-gap: 0.5rem;
  align-items: center;
  min-width: 0;
  max-width: 100%;
}

.act09-pair-row > *,
.act09-emp-row > * {
  box-sizing: border-box;
  min-width: 0;
  max-width: 100%;
}

/* 보조버튼 — SLS01_001INS / CRM01 팝업 톤 */
.act09-sub-btn {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  height: 2rem;
  min-height: 2rem;
  min-width: 4.5rem;
  padding: 0 0.75rem;
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1.2;
  white-space: nowrap;
  color: rgb(30 64 175);
  border: 1px solid rgb(147 197 253);
  border-radius: 0.375rem;
  background-color: rgb(239 246 255);
  box-shadow: 0 1px 2px 0 rgb(59 130 246 / 0.08);
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease;
  cursor: pointer;
}

.act09-sub-btn:hover:not(:disabled) {
  background-color: rgb(219 234 254);
  border-color: rgb(96 165 250);
}

.act09-sg-select,
.act09-sg-input {
  box-sizing: border-box;
}

.act09-search-panel select.act09-sg-select {
  border: 1px solid var(--act09-control-border) !important;
}

.act09-search-panel select.act09-sg-select:focus {
  border-color: #3b82f6 !important;
}

.act09-search-panel .act09-sg-input {
  border: 1px solid var(--act09-control-border) !important;
}

.act09-search-panel .act09-sg-input:focus {
  border-color: #3b82f6 !important;
}

.act09-search-panel .act09-date-slot :deep(input[type="date"]:focus) {
  border-color: #3b82f6 !important;
}

.act09-search-panel .act09-date-slot :deep(> div.flex.justify-start.items-center) {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0;
  gap: 0.25rem !important;
  margin-left: 0;
  padding-left: 0;
}

.act09-search-panel .act09-date-slot :deep(> div.flex > div.inline-flex.h-8) {
  flex: 1 1 auto;
  min-width: 0;
  max-width: 100%;
  width: 100%;
  gap: 0.125rem !important;
}

.act09-search-panel .act09-date-slot :deep(input[type="date"]) {
  border: 1px solid var(--act09-control-border) !important;
  box-sizing: border-box;
  width: auto !important;
  flex: 1 1 0;
  min-width: 5.25rem;
  max-width: none;
  padding-left: 0.45rem;
  padding-right: 0.25rem;
}

.act09-search-panel .act09-date-slot :deep(div.inline-flex.h-8 > span) {
  flex-shrink: 0;
  padding-left: 0.05rem;
  padding-right: 0.05rem;
}

.act09-search-panel .act09-date-slot :deep(div.inline-flex.h-8 > button) {
  flex-shrink: 0;
  width: 1.65rem !important;
  height: 1.65rem !important;
  min-width: 1.65rem;
  margin-left: 0 !important;
}

.act09-pick-slot :deep(> div.flex) {
  margin-top: 0 !important;
  width: 100%;
  min-width: 0;
  flex-wrap: nowrap;
  align-items: center;
  gap: var(--act09-item-gap) !important;
}

.act09-pick-slot :deep(> div.flex > div:has(select)) {
  flex: 0 0 auto;
  min-width: 0;
}

.act09-pick-slot :deep(> div.flex > div:nth-child(1) select) {
  box-sizing: border-box;
  width: var(--act09-store-group-w);
  max-width: var(--act09-store-group-w);
  height: 2rem;
  min-height: 2rem;
  margin-left: 0 !important;
  padding: 0 0.375rem;
  font-size: 0.875rem;
  border-radius: 0.375rem;
  border: 1px solid var(--act09-control-border) !important;
}

.act09-pick-slot :deep(> div.flex > div:nth-child(2) select) {
  box-sizing: border-box;
  width: var(--act09-store-attr-w);
  max-width: var(--act09-store-attr-w);
  height: 2rem;
  min-height: 2rem;
  margin-left: 0 !important;
  padding: 0 0.25rem;
  font-size: 0.875rem;
  border-radius: 0.375rem;
  border: 1px solid var(--act09-control-border) !important;
}

.act09-pick-slot :deep(> div.flex > div:last-child) {
  flex: 1 1 auto;
  min-width: 0;
  max-width: 100%;
}

.act09-pick-slot :deep(.custom-select) {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important;
  margin-left: 0 !important;
}

.act09-pick-slot :deep(.custom-select.custom-select--compact .vs__dropdown-toggle) {
  box-sizing: border-box;
  height: 2rem !important;
  min-height: 2rem !important;
  padding: 2px 8px !important;
  border: 1px solid var(--act09-control-border) !important;
  border-radius: 0.375rem !important;
  overflow: hidden !important;
  flex-wrap: nowrap !important;
}

.act09-pick-slot :deep(.custom-select.custom-select--compact .vs__selected-options) {
  flex: 1 1 auto !important;
  flex-wrap: nowrap !important;
  min-width: 0 !important;
  max-width: 100% !important;
  overflow: hidden !important;
}

.act09-pick-slot :deep(.custom-select.custom-select--compact .vs__selected) {
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

.act09-pick-slot :deep(.custom-select.custom-select--compact .vs__search) {
  font-size: 0.875rem !important;
}

/* store-layout — 하단 공통 pick-slot 규칙 이후 재적용 */
.act09-pick-slot--store-grid :deep(> div.flex) {
  display: grid !important;
  grid-template-columns:
    var(--act09-store-group-w)
    var(--act09-store-attr-w)
    minmax(0, 1fr) !important;
  width: 100% !important;
  min-width: 0 !important;
  max-width: 100% !important;
  flex-wrap: unset !important;
  align-items: stretch !important;
}

.act09-pick-slot--store-grid
  :deep(> div.flex > div:nth-child(1) select),
.act09-pick-slot--store-grid
  :deep(> div.flex > div:nth-child(2) select) {
  width: 100% !important;
  max-width: 100% !important;
}

.act09-pick-slot--store-grid :deep(> div.flex > div:last-child) {
  flex: unset !important;
  width: 100% !important;
  min-width: 0 !important;
  max-width: 100% !important;
}

.act09-pick-slot--store-grid
  :deep(> div.flex > div:last-child .custom-select) {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important;
  margin-left: 0 !important;
}

@media (max-width: 960px) {
  .act09-wire-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>

<style>
body.act09-page-active .vs__dropdown-menu {
  z-index: 200 !important;
}
</style>
