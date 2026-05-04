<!-- /*--############################################################################
# Filename : PUR02_035RPT.vue                                                  
# Description : 구매관리2 > 발주 관리 > 조회유형별 매입현황 (파트별)                   
# Date :2025-09-23                                                             
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <!-- 조회조건 — 노트북: 세로 flex로 그리드가 남은 높이만 사용 -->
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
    <!-- PUR03_036RPT와 동일 와이어: 3열×2행 + 자재명/코드 3열째 + 조회유형 풀폭 -->
    <div
      class="pur235-search-panel z-10 mt-3 w-full min-h-0 shrink-0 overflow-x-auto rounded-lg bg-gray-200 px-24 py-3">
      <div
        class="pur235-wire-grid min-w-0"
        :style="{
          '--pur235-control-border': pur235ControlBorder,
          '--pur235-col-gutter': pur235ColGutter,
          '--pur235-row-gap': pur235RowGap,
          '--pur235-label-col': pur235LabelCol,
        }">
        <div class="pur235-wire-cell">
          <div class="pur235-wire-label">선택기간</div>
          <div class="pur235-wire-field pur235-date-slot min-w-0 overflow-hidden">
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
        <div class="pur235-wire-cell">
          <div class="pur235-wire-label">매장선택</div>
          <div class="pur235-wire-field pur235-pick-slot min-w-0 w-full">
            <PickStore
              compact-search-bar
              :compact-store-combo-max-rem="18"
              main-name=""
              :hide-group="false"
              :hide-attr="false"
              @update:storeGroup="lngStoreGroup"
              :default-store-nm="'전체'"
              @storeNm="excelStore"
              :default-store-type2="true"
              :default-store="true"
              @update:storeCd="lngStoreCode" />
          </div>
        </div>
        <div class="pur235-wire-cell">
          <div class="pur235-wire-label">파트</div>
          <div class="pur235-wire-field min-w-0">
            <select
              id="pur02-035-part"
              v-model="cond6"
              class="pur235-sg-select h-8 w-full min-w-0 rounded-md border border-solid bg-white text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option
                v-for="i in optionList3"
                :key="i.lngPartCode"
                :value="i.lngPartCode">
                {{ i.strPartName }}
              </option>
            </select>
          </div>
        </div>

        <div class="pur235-wire-cell">
          <div class="pur235-wire-label">거래처</div>
          <div class="pur235-wire-field pur235-bc-slot min-w-0 w-full max-w-full">
            <BusinessClient
              compact-search-bar
              @SupplierId="SupplierId" />
          </div>
        </div>
        <div class="pur235-wire-cell">
          <div class="pur235-wire-label">단위</div>
          <div class="pur235-wire-field min-w-0">
            <select
              id="pur02-035-unit"
              v-model="cond"
              class="pur235-sg-select h-8 w-full min-w-0 rounded-md border border-solid bg-white text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option
                v-for="i in optionList"
                :key="i.strDCode"
                :value="i.strDCode">
                {{ i.strDName }}
              </option>
            </select>
          </div>
        </div>
        <div class="pur235-wire-cell min-w-0">
          <div class="pur235-wire-label">자재명/코드</div>
          <div class="pur235-wire-field pur235-mat-row min-w-0">
            <select
              id="pur02-035-mat-kind"
              v-model="cond2"
              class="pur235-sg-select pur235-mat-kind h-8 w-full min-w-0 max-w-full rounded-md border border-solid bg-white text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="0">전체</option>
              <option value="1">분류</option>
              <option value="2">그룹</option>
              <option value="3">특성</option>
              <option value="4">재고조사주기</option>
            </select>
            <select
              id="pur02-035-mat-code"
              v-model="cond3"
              class="pur235-sg-select pur235-mat-code h-8 w-full min-w-0 max-w-full rounded-md border border-solid bg-white text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="0">전체</option>
              <option
                v-for="i in optionList2"
                :key="String(i.strDCode)"
                :value="i.strDCode">
                {{ i.strDName }}
              </option>
            </select>
            <input
              id="pur02-035-mat-keyword"
              v-model="cond4"
              type="text"
              placeholder="검색어"
              title="자재명·코드 키워드"
              class="pur235-sg-input pur235-mat-keyword h-8 min-h-8 min-w-0 w-full max-w-full rounded-md border border-solid bg-white px-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div class="pur235-wire-span">
          <div class="pur235-wire-span-label">조회유형</div>
          <div class="pur235-wire-span-radios">
            <label class="flex shrink-0 cursor-pointer items-center gap-1.5 text-sm">
              <input id="pur02-035-type-0" v-model="cond5" type="radio" value="0" />
              자재별
            </label>
            <label class="flex shrink-0 cursor-pointer items-center gap-1.5 text-sm">
              <input id="pur02-035-type-1" v-model="cond5" type="radio" value="1" />
              매장별 자재별
            </label>
            <label class="flex shrink-0 cursor-pointer items-center gap-1.5 text-sm">
              <input id="pur02-035-type-2" v-model="cond5" type="radio" value="2" />
              매장별 일자별 자재별
            </label>
            <label class="flex shrink-0 cursor-pointer items-center gap-1.5 text-sm">
              <input id="pur02-035-type-3" v-model="cond5" type="radio" value="3" />
              파트별 자재별
            </label>
          </div>
        </div>
      </div>
    </div>
    <!-- 그리드: flex-1 + min-h-0 → 탭 영역 안에서만 확장 (뷰포트 밖으로 밀리지 않음) -->
    <div class="mt-2 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <div class="relative h-full min-h-0 min-w-0 flex-1">
        <Realgrid
        :progname="'PUR02_035RPT_VUE'"
        :progid="progid"
        :rowData="rowData"
        :reload="reload"
        :setRowStyleCalls="true"
        :setRowStyleCallsDefaultCol="setRowStyleCallsDefaultCol"
        :setRowStyleCallsDefaultCol2="setRowStyleCallsDefaultCol2"
        :hardCodeSetRowStyleCalls="true"
        :documentTitle="'PUR02_035RPT'"
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
import { getCommonList } from "@/api/common";
import { getStockCategory, getStockGeneric, getStockGroup } from "@/api/master";
import { getOrderListByTypeByPart } from "@/api/mipur";
import { getLossMasterPartList } from "@/api/mistock";
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

  const res = await getCommonList(27);

  optionList.value = res.data.List.filter((item) => item.strDCode !== "01");
});

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

const cond = ref("02");
const cond2 = ref(0);
const cond3 = ref(0);
const cond4 = ref("");
const cond5 = ref(0);
const cond6 = ref(0);
const store = useStore();

/** 조회 AREA — PUR03_036RPT wire 패턴과 동일 토큰 */
const pur235ControlBorder = "#cbd5e1";
const pur235ColGutter = "1.5rem";
const pur235RowGap = "0.875rem";
const pur235LabelCol = "7rem";

const datepicker = ref(null);
const closePopUp = ref(false);
const optionList = ref([]);
const optionList3 = ref([]);
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

const storeCode = ref();
const lngStoreCode = async (e) => {
  initGrid();
  storeCode.value = e;

  const res2 = await getLossMasterPartList(
    store.state.userData.lngStoreGroup,
    storeCode.value
  );

  optionList3.value = res2.data.List;
};

const storeAttr = ref();
const lngStoreAttrs = (e) => {
  storeAttr.value = e;
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
const clickedRowData = () => {};
/**
 *  조회 함수
 */
const hideColumnsId = ref([]);
const searchButton = async () => {
  try {
    store.state.loading = true;
    initGrid();

    let ipAddr = "";
    try {
      const getIp = await fetch("https://api.ipify.org?format=json");
      if (getIp.ok) {
        const ip = await getIp.json();
        ipAddr = ip?.ip ?? "";
      }
    } catch {
      ipAddr = "";
    }

    const res = await getOrderListByTypeByPart(
      groupCd.value,
      storeCode.value,
      cond6.value,
      String(sDate.value ?? "").replaceAll("-", ""),
      String(eDate.value ?? "").replaceAll("-", ""),
      supplierid.value,
      cond2.value,
      cond3.value,
      cond4.value,
      cond.value,
      store.state.userData.lngSequence,
      ipAddr,
      cond5.value
    );

    rowData.value = res.data.List;
    console.log(res);
    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    console.error("[PUR02_035RPT] searchButton", error);
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

const setRowStyleCallsDefaultCol = ref("strTaxType");
const setRowStyleCallsDefaultCol2 = ref("strStockName");
const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }

  if (cond5.value == 0) {
    progid.value = 1;
    setRowStyleCallsDefaultCol.value = "strTaxType";
    setRowStyleCallsDefaultCol2.value = "strStockName";
  } else if (cond5.value == 1) {
    progid.value = 3;
    setRowStyleCallsDefaultCol.value = "strTaxType";
    setRowStyleCallsDefaultCol2.value = "strStockName";
  } else if (cond5.value == 2) {
    setRowStyleCallsDefaultCol.value = "dtmCheckDate";
    setRowStyleCallsDefaultCol2.value = "dtmCheckDate";
    progid.value = 4;
  } else if (cond5.value == 3) {
    setRowStyleCallsDefaultCol.value = "strTaxType";
    setRowStyleCallsDefaultCol2.value = "strStockName";
    progid.value = 6;
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
/* PUR03_036RPT와 동일 와이어 — 클래스만 pur235 */
.pur235-wire-grid {
  display: grid;
  width: 100%;
  min-width: 0;
  align-items: center;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  column-gap: var(--pur235-col-gutter);
  row-gap: var(--pur235-row-gap);
}

.pur235-wire-cell {
  display: flex;
  min-width: 0;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}

.pur235-wire-label {
  flex: 0 0 var(--pur235-label-col);
  width: var(--pur235-label-col);
  min-width: 0;
  max-width: var(--pur235-label-col);
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

.pur235-wire-field {
  display: flex;
  min-width: 0;
  max-width: 100%;
  flex: 1 1 auto;
  align-items: center;
}

.pur235-wire-field:not(.pur235-mat-row) > * {
  min-width: 0;
  width: 100%;
}

.pur235-mat-row {
  max-width: 100%;
  overflow-x: auto;
  scrollbar-width: thin;
}

.pur235-wire-field.pur235-mat-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 2fr);
  column-gap: 0.5rem;
  row-gap: 0.375rem;
  align-items: center;
  min-width: 0;
}

.pur235-wire-field.pur235-mat-row > * {
  box-sizing: border-box;
  min-width: 0;
  max-width: 100%;
}

.pur235-wire-span {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
}

.pur235-wire-span-label {
  flex: 0 0 var(--pur235-label-col);
  width: var(--pur235-label-col);
  min-width: 0;
  max-width: var(--pur235-label-col);
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

.pur235-wire-span-radios {
  display: flex;
  min-width: 0;
  flex: 1 1 auto;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.65rem 1.1rem;
  max-width: 100%;
  overflow-x: auto;
  scrollbar-width: thin;
}

.pur235-sg-select {
  box-sizing: border-box;
}

.pur235-search-panel select.pur235-sg-select {
  border: 1px solid var(--pur235-control-border) !important;
}

.pur235-search-panel select.pur235-sg-select:focus {
  border-color: #3b82f6 !important;
}

.pur235-search-panel .pur235-sg-input {
  border: 1px solid var(--pur235-control-border) !important;
  box-sizing: border-box;
}

.pur235-search-panel .pur235-sg-input:focus {
  border-color: #3b82f6 !important;
}

.pur235-search-panel .pur235-pick-slot :deep(select) {
  border: 1px solid var(--pur235-control-border) !important;
}

.pur235-search-panel .pur235-pick-slot :deep(select:focus) {
  border-color: #3b82f6 !important;
}

.pur235-search-panel .pur235-pick-slot :deep(.pickstore-vs-shell),
.pur235-search-panel .pur235-bc-slot :deep(.pickstore-vs-shell) {
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
  border: 1px solid var(--pur235-control-border) !important;
}

.pur235-search-panel .pur235-pick-slot :deep(div.relative.min-w-0.flex-1) {
  max-width: 100% !important;
}

.pur235-search-panel .pur235-date-slot :deep(input[type="date"]:focus) {
  border-color: #3b82f6 !important;
}

.pur235-search-panel .pur235-date-slot :deep(> div.flex.justify-start.items-center) {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0;
  gap: 0.25rem !important;
}

.pur235-search-panel .pur235-date-slot :deep(> div.flex > div.inline-flex.h-8) {
  flex: 1 1 auto;
  min-width: 0;
  max-width: 100%;
  width: 100%;
  gap: 0.125rem !important;
}

.pur235-search-panel .pur235-date-slot :deep(input[type="date"]) {
  border: 1px solid var(--pur235-control-border) !important;
  box-sizing: border-box;
  width: auto !important;
  flex: 1 1 0;
  min-width: 5.25rem;
  max-width: none;
  padding-left: 0.45rem;
  padding-right: 0.25rem;
}

.pur235-search-panel .pur235-date-slot :deep(div.inline-flex.h-8 > span) {
  flex-shrink: 0;
  padding-left: 0.05rem;
  padding-right: 0.05rem;
}

.pur235-search-panel .pur235-date-slot :deep(div.inline-flex.h-8 > button) {
  flex-shrink: 0;
  width: 1.65rem !important;
  height: 1.65rem !important;
  min-width: 1.65rem;
  margin-left: 0 !important;
}

.pur235-search-panel .pur235-date-slot :deep(div.inline-flex.h-8 > button img) {
  max-width: 85%;
  max-height: 85%;
}

.pur235-pick-slot :deep(> div.flex.text-base) {
  width: 100%;
  min-width: 0;
}

.pur235-pick-slot :deep(> div.flex > div:first-child) {
  display: none;
}

.pur235-date-slot :deep(> div.flex.justify-start.items-center) {
  margin-left: 0;
  padding-left: 0;
}

.pur235-bc-slot :deep(> div.flex) {
  justify-content: flex-start;
  width: 100%;
  margin-left: 0;
  padding-left: 0;
}
</style>
