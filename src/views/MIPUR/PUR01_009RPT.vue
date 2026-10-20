<!-- /*--############################################################################
# Filename : PUR01_009RPT.vue                                                  
# Description : 구매관리2 > 발주 관리 > 조회유형별 매입현황                      
# Date :2025-08-28                                                             
# Author : 권맑음                     
################################################################################*/ -->
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
      class="pur009-search-panel z-10 mt-3 w-full min-w-0 shrink-0 overflow-x-auto rounded-lg bg-gray-200 py-4"
      :style="{
        '--pur009-control-border': pur009ControlBorder,
        '--pur009-col-gutter': pur009ColGutter,
        '--pur009-row-gap': pur009RowGap,
        '--pur009-panel-pad-x': pur009PanelPadX,
        '--pur009-label-col': pur009LabelCol,
        '--pur009-row-min-h': pur009RowMinH,
        '--pur009-control-h': pur009ControlH,
      }">
      <div class="pur009-wire-grid min-w-0">
        <div class="pur009-wire-cell">
          <div class="pur009-wire-label">선택기간</div>
          <div class="pur009-wire-field pur009-date-slot min-w-0 overflow-hidden">
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
        <div class="pur009-wire-cell">
          <div class="pur009-wire-label">매장명</div>
          <div class="pur009-wire-field pur009-pick-slot min-w-0 w-full">
            <PickStore
              compact-search-bar
              main-name=""
              @update:storeGroup="lngStoreGroup"
              @update:storeType="lngStoreAttrs"
              :defaultStoreNm="'전체'"
              :defaultStore="true"
              @storeNm="excelStore"
              @update:storeCd="lngStoreCode" />
          </div>
        </div>
        <div class="pur009-wire-cell">
          <div class="pur009-wire-label">거래처</div>
          <div class="pur009-wire-field pur009-bc-slot min-w-0 w-full max-w-full">
            <BusinessClient
              compact-search-bar
              :default-nm="'전체'"
              :disable="supplierComboDisabled"
              :select-supplier-id="supplierComboPresetId"
              :select-supplier-label="supplierSessionDisplayName"
              @SupplierId="SupplierId" />
          </div>
        </div>

        <div class="pur009-wire-cell">
          <div class="pur009-wire-label">단위</div>
          <div class="pur009-wire-field min-w-0">
            <select id="pur01-009-unit" class="pur009-sg-select" v-model="cond">
              <option
                v-for="i in optionList"
                :key="i.strDCode"
                :value="i.strDCode">
                {{ i.strDName }}
              </option>
            </select>
          </div>
        </div>
        <div class="pur009-wire-cell pur009-wire-cell--span2 min-w-0">
          <div class="pur009-wire-label">자재명</div>
          <div class="pur009-wire-field pur009-mat-row min-w-0">
            <select id="pur01-009-mat-kind" class="pur009-sg-select" v-model="cond2">
              <option value="0">전체</option>
              <option value="1">분류</option>
              <option value="2">그룹</option>
              <option value="3">특성</option>
              <option value="4">재고조사주기</option>
            </select>
            <select id="pur01-009-mat-code" class="pur009-sg-select" v-model="cond3">
              <option value="0">전체</option>
              <option
                v-for="i in optionList2"
                :key="String(i.strDCode)"
                :value="i.strDCode">
                {{ i.strDName }}
              </option>
            </select>
            <input
              id="pur01-009-mat-keyword"
              v-model="cond4"
              class="pur009-sg-input"
              type="text"
              autocomplete="off" />
          </div>
        </div>

        <div class="pur009-wire-span">
          <div class="pur009-wire-span-label">조회유형</div>
          <div class="pur009-wire-span-radios">
            <label class="pur009-radio" for="pur01-009-type-0">
              <input id="pur01-009-type-0" v-model="cond5" type="radio" value="0" />
              자재별
            </label>
            <label class="pur009-radio" for="pur01-009-type-1">
              <input id="pur01-009-type-1" v-model="cond5" type="radio" value="1" />
              일자별 자재별
            </label>
            <label class="pur009-radio" for="pur01-009-type-2">
              <input id="pur01-009-type-2" v-model="cond5" type="radio" value="2" />
              매장별 자재별
            </label>
            <label class="pur009-radio" for="pur01-009-type-3">
              <input id="pur01-009-type-3" v-model="cond5" type="radio" value="3" />
              매장별 일자별 자재별
            </label>
            <label class="pur009-radio" for="pur01-009-type-4">
              <input id="pur01-009-type-4" v-model="cond5" type="radio" value="4" />
              거래처별 자재별
            </label>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-2 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <Realgrid
        class="pur009-grid-body min-h-0 w-full flex-1"
        :progname="'PUR01_009RPT0_VUE'"
        :progid="progid"
        :rowData="rowData"
        :reload="reload"
        :setRowStyleCalls="true"
        :setRowStyleCallsDefaultCol="'strTaxType'"
        :setRowStyleCallsDefaultCol2="'strStockName'"
        :hardCodeSetRowStyleCalls="true"
        :documentTitle="'PUR01_009RPT'"
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
import { getOrderListByType2 } from "@/api/mipur";
import BusinessClient from "@/components/businessClient2.vue";
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

import { computed, onMounted, ref, watch } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";

const pur009ControlBorder = "#cbd5e1";
const pur009ColGutter = "1.5rem";
const pur009RowGap = "0.875rem";
const pur009PanelPadX = "2rem";
const pur009LabelCol = "7rem";
const pur009RowMinH = "2rem";
const pur009ControlH = "2rem";

const store = useStore();

/** 거래처 계정(lngUserAdminID === 60): 세션 `lngSupplierID` 고정 + 콤보 비활성 — PUR03_036RPT 와 동일 */
const isSupplierPortal = computed(() => store.getters.isSupplierAccountUser);
const supplierComboPresetId = computed(() => {
  if (!isSupplierPortal.value) return "";
  const id = store.getters.sessionLngSupplierID;
  return id != null && id > 0 ? id : "";
});
const supplierComboDisabled = computed(() => isSupplierPortal.value);
/** 로그인 세션에 오는 거래처 표시명 — 콤보 목록에 없을 때 라벨로 사용 */
const supplierSessionDisplayName = computed(() => {
  if (!isSupplierPortal.value) return "";
  const u = store.state.userData;
  if (!u || typeof u !== "object" || Array.isArray(u)) return "";
  const nm =
    u.strSupplierName ??
    u.StrSupplierName ??
    u.strChargerName ??
    u.strStoreName ??
    u.strUserID ??
    "";
  return String(nm).trim();
});

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getCommonList(27);

  optionList.value = res.data.List.filter((item) => item.strDCode !== "01");

  if (isSupplierPortal.value) {
    const sid = store.getters.sessionLngSupplierID;
    if (sid != null && sid > 0) {
      supplierid.value = String(sid);
    }
  }
});

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

const cond = ref("02");
const cond2 = ref(0);
const cond3 = ref(0);
const cond4 = ref("");
const cond5 = ref(0);

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
watch(cond2, async () => {
  if (cond2.value == 1) {
    const res2 = await getStockCategory(store.state.userData.lngStoreGroup);

    optionList2.value = res2.data.List;

    optionList2.value = optionList2.value.map((item) => ({
      ...item,
      strDCode: item.lngCategoryID,
      strDName: item.strCategoryName,
    }));
  } else if (cond2.value == 2) {
    const res = await getStockGroup(store.state.userData.lngStoreGroup);

    optionList2.value = res.data.List;

    optionList2.value = optionList2.value.map((item) => ({
      ...item,
      strDCode: item.lngStockGroupID,
      strDName: item.strStockGroupName,
    }));
  } else if (cond2.value == 3) {
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
  ////console.log(optionList2.value);
  cond3.value = 0;
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

const storeAttr = ref(0);
const lngStoreAttrs = (e) => {
  storeAttr.value = e;
};

const groupCd = ref();
const lngStoreGroup = (e) => {
  groupCd.value = e;
};

const supplierid = ref("");
const SupplierId = (e) => {
  if (isSupplierPortal.value) {
    const sid = store.getters.sessionLngSupplierID;
    if (sid != null && sid > 0) {
      supplierid.value = String(sid);
      return;
    }
  }
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

    const getIp = await fetch("https://api.ipify.org?format=json");

    const ip = await getIp.json();

    const res = await getOrderListByType2(
      groupCd.value,
      storeCode.value,
      sDate.value.replaceAll("-", ""),
      eDate.value.replaceAll("-", ""),
      supplierid.value,
      cond2.value,
      cond3.value,
      cond4.value,
      cond.value,
      storeAttr.value,
      store.state.userData.lngSequence,
      ip.ip,
      cond5.value
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
const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }

  if (cond5.value == 0) {
    progid.value = 1;
  } else if (cond5.value == 1) {
    progid.value = 2;
  } else if (cond5.value == 2) {
    progid.value = 3;
  } else if (cond5.value == 3) {
    progid.value = 4;
  } else if (cond5.value == 4) {
    progid.value = 5;
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
</script>

<style scoped>
.pur009-search-panel {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  padding-left: 0;
  padding-right: 0;
}

.pur009-wire-grid {
  display: grid;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  align-items: center;
  /* 매장 3콤보가 가운데 칸을 씀. 거래처 칸은 그보다 좁게. 고정 rem으로 옆칸을 덮지 않음 */
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 1.7fr) minmax(0, 0.8fr);
  column-gap: var(--pur009-col-gutter);
  row-gap: var(--pur009-row-gap);
  padding-left: var(--pur009-panel-pad-x);
  padding-right: var(--pur009-panel-pad-x);
}

.pur009-wire-cell {
  display: flex;
  min-width: 0;
  min-height: var(--pur009-row-min-h);
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}

.pur009-wire-cell--span2 {
  grid-column: span 2;
}

.pur009-wire-label {
  flex: 0 0 var(--pur009-label-col);
  width: var(--pur009-label-col);
  min-width: 0;
  max-width: var(--pur009-label-col);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: var(--pur009-row-min-h);
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pur009-wire-field {
  display: flex;
  min-width: 0;
  max-width: 100%;
  flex: 1 1 auto;
  align-items: center;
  min-height: var(--pur009-row-min-h);
}

.pur009-wire-field:not(.pur009-mat-row) > * {
  min-width: 0;
  width: 100%;
}

.pur009-mat-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 2fr);
  column-gap: 0.5rem;
  align-items: center;
  min-width: 0;
  max-width: 100%;
}

.pur009-mat-row > * {
  box-sizing: border-box;
  min-width: 0;
  max-width: 100%;
}

.pur009-wire-span {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  min-height: var(--pur009-row-min-h);
}

.pur009-wire-span-label {
  flex: 0 0 var(--pur009-label-col);
  width: var(--pur009-label-col);
  min-width: 0;
  max-width: var(--pur009-label-col);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: var(--pur009-row-min-h);
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pur009-wire-span-radios {
  display: flex;
  min-width: 0;
  flex: 1 1 auto;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.65rem 1.1rem;
  max-width: 100%;
}

.pur009-radio {
  display: inline-flex;
  align-items: center;
  min-height: var(--pur009-row-min-h);
  gap: 0.375rem;
  font-size: 0.875rem;
  line-height: 1.25;
  white-space: nowrap;
  cursor: pointer;
}

.pur009-radio input[type="radio"] {
  margin: 0;
  flex-shrink: 0;
}

.pur009-sg-select,
.pur009-sg-input {
  box-sizing: border-box;
  height: var(--pur009-control-h);
  min-height: var(--pur009-control-h);
  max-height: var(--pur009-control-h);
  width: 100%;
  min-width: 0;
  padding: 0 0.375rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: rgb(55 65 81);
  background: #fff;
  border: 1px solid var(--pur009-control-border);
  border-radius: 0.375rem;
}

.pur009-sg-select:focus,
.pur009-sg-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.2);
}

.pur009-search-panel .pur009-pick-slot,
.pur009-search-panel .pur009-bc-slot {
  overflow: hidden;
}

.pur009-search-panel .pur009-pick-slot :deep(select),
.pur009-search-panel .pur009-pick-slot :deep(.pickstore-vs-shell),
.pur009-search-panel .pur009-bc-slot :deep(.pickstore-vs-shell) {
  box-sizing: border-box !important;
  height: var(--pur009-control-h) !important;
  min-height: var(--pur009-control-h) !important;
  max-height: var(--pur009-control-h) !important;
  border: 1px solid var(--pur009-control-border) !important;
  border-radius: 0.375rem !important;
  font-size: 0.875rem !important;
  background: #fff !important;
}

.pur009-search-panel .pur009-pick-slot :deep(select) {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important;
  margin-left: 0 !important;
  padding: 0 0.375rem !important;
}

.pur009-search-panel .pur009-pick-slot :deep(.pickstore-vs-shell),
.pur009-search-panel .pur009-bc-slot :deep(.pickstore-vs-shell) {
  max-width: 100%;
  min-width: 0;
  width: 100%;
}

/* 매장 3콤보 배율 1:1.5:3. 매장 칸 전체 폭은 그대로 */
.pur009-pick-slot :deep(> div.flex.text-base) {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.5fr) minmax(0, 3fr);
  align-items: center;
  width: 100%;
  min-width: 0;
  margin: 0 !important;
  gap: 0.5rem !important;
}

.pur009-pick-slot :deep(> div.flex.text-base > div) {
  min-width: 0;
  width: 100%;
  max-width: 100%;
}

.pur009-pick-slot :deep(> div.flex > div:first-child) {
  display: none;
}

.pur009-search-panel .pur009-pick-slot :deep(div.relative.min-w-0.flex-1) {
  flex: none !important;
  width: 100% !important;
  min-width: 0 !important;
  max-width: 100% !important;
}

.pur009-bc-slot :deep(> div.flex.text-base) {
  margin: 0 !important;
  width: 100%;
  min-width: 0;
  gap: 0 !important;
}

.pur009-pick-slot :deep(.vs__dropdown-toggle),
.pur009-bc-slot :deep(.vs__dropdown-toggle) {
  height: 100% !important;
  min-height: 0 !important;
  border: none !important;
}

.pur009-search-panel .pur009-date-slot :deep(> div.flex.justify-start.items-center) {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0;
  margin: 0 !important;
  gap: 0.25rem !important;
}

.pur009-search-panel .pur009-date-slot :deep(> div.flex > div.inline-flex.h-8) {
  flex: 1 1 auto;
  min-width: 0;
  max-width: 100%;
  width: 100%;
  gap: 0.125rem !important;
}

.pur009-search-panel .pur009-date-slot :deep(input[type="date"]) {
  box-sizing: border-box;
  height: var(--pur009-control-h) !important;
  min-height: var(--pur009-control-h) !important;
  max-height: var(--pur009-control-h) !important;
  border: 1px solid var(--pur009-control-border) !important;
  width: auto !important;
  flex: 1 1 0;
  min-width: 5.25rem;
  max-width: none;
  padding-left: 0.45rem;
  padding-right: 0.25rem;
  font-size: 0.875rem;
}

.pur009-search-panel .pur009-date-slot :deep(input[type="date"]:focus) {
  border-color: #3b82f6 !important;
}

.pur009-search-panel .pur009-date-slot :deep(div.inline-flex.h-8 > span) {
  flex-shrink: 0;
}

.pur009-search-panel .pur009-date-slot :deep(div.inline-flex.h-8 > button) {
  flex-shrink: 0;
  width: 1.65rem !important;
  height: 1.65rem !important;
  min-width: 1.65rem;
  margin-left: 0 !important;
}

.pur009-grid-body {
  min-height: 12rem;
}
</style>
