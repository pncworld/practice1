<!-- /*--############################################################################
# Filename : PUR03_036RPT.vue                                                  
# Description : 구매관리2 > 발주 관리 > 조회유형별 발주현황 (파트별)                     
# Date :2025-09-19                                                             
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
    <!-- 와이어: L/R=px-24, 3열×2행 + 열 사이 여백 + 하단 조회유형 풀폭 (036은 3열째에 자재명/코드) -->
    <div
      class="pur036-search-panel z-10 mt-3 w-full min-w-0 overflow-x-auto rounded-lg bg-gray-200 px-24 py-4">
      <div
        class="pur036-wire-grid min-w-0"
        :style="{
          '--pur036-control-border': pur036ControlBorder,
          '--pur036-col-gutter': pur036ColGutter,
          '--pur036-row-gap': pur036RowGap,
          '--pur036-label-col': pur036LabelCol,
        }">
        <div class="pur036-wire-cell">
          <div class="pur036-wire-label">납기일자</div>
          <div class="pur036-wire-field pur036-date-slot min-w-0 overflow-hidden">
            <Datepicker2
              ref="datepicker"
              omit-main-label
              filter-bar-align
              :mainName="'납기일자'"
              :closePopUp="closePopUp"
              @excelDate="excelDate"
              @endDate="endDate"
              @startDate="startDate" />
          </div>
        </div>
        <div class="pur036-wire-cell">
          <div class="pur036-wire-label">매장선택</div>
          <div class="pur036-wire-field pur036-pick-slot min-w-0 w-full">
            <PickStore
              compact-search-bar
              :compact-store-combo-max-rem="18"
              main-name=""
              :hide-group="false"
              :hide-attr="false"
              @update:storeGroup="lngStoreGroup"
              :defaultStoreNm="'전체'"
              @storeNm="excelStore"
              :defaultStoreType2="true"
              :defaultStore="true"
              @update:storeCd="lngStoreCode" />
          </div>
        </div>
        <div class="pur036-wire-cell">
          <div class="pur036-wire-label">파트</div>
          <div class="pur036-wire-field min-w-0">
            <select
              id="pur03-036-cond-part"
              v-model="cond"
              class="pur036-sg-select h-8 w-full min-w-0 rounded-md border border-solid bg-white text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option
                v-for="i in optionList"
                :key="i.lngPartCode"
                :value="i.lngPartCode">
                {{ i.strPartName }}
              </option>
            </select>
          </div>
        </div>

        <div class="pur036-wire-cell">
          <div class="pur036-wire-label">거래처</div>
          <div class="pur036-wire-field pur036-bc-slot min-w-0 w-full max-w-full">
            <BusinessClient
              compact-search-bar
              @SupplierId="SupplierId" />
          </div>
        </div>
        <div class="pur036-wire-cell">
          <div class="pur036-wire-label">단위</div>
          <div class="pur036-wire-field min-w-0">
            <select
              id="pur03-036-cond-unit"
              v-model="cond2"
              class="pur036-sg-select h-8 w-full min-w-0 rounded-md border border-solid bg-white text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option
                v-for="i in optionList3"
                :key="i.strDCode"
                :value="i.strDCode">
                {{ i.strDName }}
              </option>
            </select>
          </div>
        </div>
        <div class="pur036-wire-cell min-w-0">
          <div class="pur036-wire-label">자재명/코드</div>
          <div class="pur036-wire-field pur036-mat-row min-w-0">
            <select
              id="pur03-036-mat-kind"
              v-model="cond3"
              class="pur036-sg-select pur036-mat-kind h-8 w-full min-w-0 max-w-full rounded-md border border-solid bg-white text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="0">전체</option>
              <option value="1">분류</option>
              <option value="2">그룹</option>
              <option value="3">특성</option>
              <option value="4">재고조사주기</option>
            </select>
            <select
              id="pur03-036-mat-code"
              v-model="cond4"
              class="pur036-sg-select pur036-mat-code h-8 w-full min-w-0 max-w-full rounded-md border border-solid bg-white text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="0">전체</option>
              <option
                v-for="i in optionList2"
                :key="i.strDCode"
                :value="i.strDCode">
                {{ i.strDName }}
              </option>
            </select>
            <input
              id="pur03-036-mat-keyword"
              v-model="cond5"
              type="text"
              placeholder="검색어"
              title="자재명·코드 키워드"
              class="pur036-sg-input pur036-mat-keyword h-8 min-h-8 min-w-0 w-full max-w-full rounded-md border border-solid bg-white px-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div class="pur036-wire-span">
          <div class="pur036-wire-span-label">조회유형</div>
          <div class="pur036-wire-span-radios">
            <label class="flex shrink-0 cursor-pointer items-center gap-1.5 text-sm">
              <input id="pur03-036-type-0" v-model="cond6" type="radio" value="0" />
              자재별
            </label>
            <label class="flex shrink-0 cursor-pointer items-center gap-1.5 text-sm">
              <input id="pur03-036-type-1" v-model="cond6" type="radio" value="1" />
              매장별 자재별
            </label>
            <label class="flex shrink-0 cursor-pointer items-center gap-1.5 text-sm">
              <input id="pur03-036-type-2" v-model="cond6" type="radio" value="2" />
              매장별 일자별 자재별
            </label>
            <label class="flex shrink-0 cursor-pointer items-center gap-1.5 text-sm">
              <input id="pur03-036-type-3" v-model="cond6" type="radio" value="3" />
              파트별 자재별
            </label>
          </div>
        </div>
      </div>
    </div>
    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="w-full h-[65vh]">
      <Realgrid
        :progname="'PUR03_036RPT_VUE'"
        :progid="progid"
        :rowData="rowData"
        :reload="reload"
        :documentTitle="'PUR03_036RPT'"
        @clickedRowData="clickedRowData"
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
import { getStockCategory, getStockGeneric, getStockGroup } from "@/api/master";
import { getOrderListPartByType } from "@/api/mipur";
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

const pur036ControlBorder = "#cbd5e1";
/** 와이어 열 사이 여백(L·R은 px-24) */
const pur036ColGutter = "1.5rem";
const pur036RowGap = "0.875rem";
/** 항목명 칸 폭 통일 — 칸 안 텍스트는 가운데(search-area-layout), 입력은 오른쪽 */
const pur036LabelCol = "7rem";

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);
const optionList3 = ref([]);
const cond = ref("0");
const cond2 = ref("02");
const cond3 = ref(0);
const cond4 = ref(0);
const cond5 = ref("");
const cond6 = ref("0");
const store = useStore();

onMounted(async () => {
  await insertPageLog(store.state.activeTab2);

  const res = await getCommonList(27);

  optionList3.value = res.data.List.filter((item) => item.strDCode !== "01");
});

const clickedRowData = () => {};

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
  cond4.value = 0;
});

const storeCode = ref();
const lngStoreCode = async (e) => {
  initGrid();
  storeCode.value = e;

  const res2 = await getLossMasterPartList(
    store.state.userData.lngStoreGroup,
    storeCode.value
  );

  optionList.value = res2.data.List;
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

    const getIp = await fetch("https://api.ipify.org?format=json");

    const ip = await getIp.json();
    const res = await getOrderListPartByType(
      groupCd.value,
      storeCode.value,
      String(sDate.value ?? "").replaceAll("-", ""),
      String(eDate.value ?? "").replaceAll("-", ""),
      supplierid.value,
      cond3.value,
      cond4.value,
      cond5.value,
      cond2.value,
      cond.value,
      store.state.userData.lngSequence,
      ip.ip,
      cond6.value
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

  if (cond6.value == 0) {
    progid.value = 1;
  } else if (cond6.value == 1) {
    progid.value = 3;
  } else if (cond6.value == 2) {
    progid.value = 6;
  } else if (cond6.value == 3) {
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
/* 와이어: 3열 + 열 사이 여백; 각 칸은 [항목명 열(가운데) | 입력] */
.pur036-wire-grid {
  display: grid;
  width: 100%;
  min-width: 0;
  align-items: center;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  column-gap: var(--pur036-col-gutter);
  row-gap: var(--pur036-row-gap);
}

.pur036-wire-cell {
  display: flex;
  min-width: 0;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}

.pur036-wire-label {
  flex: 0 0 var(--pur036-label-col);
  width: var(--pur036-label-col);
  min-width: 0;
  max-width: var(--pur036-label-col);
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

.pur036-wire-field {
  display: flex;
  min-width: 0;
  max-width: 100%;
  flex: 1 1 auto;
  align-items: center;
}

/* 단일 컨트롤이 칸 나머지를 채움 */
.pur036-wire-field:not(.pur036-mat-row) > * {
  min-width: 0;
  width: 100%;
}

.pur036-mat-row {
  max-width: 100%;
  overflow-x: auto;
  scrollbar-width: thin;
}

/* 1:1:2 — 콤보 2열 균등, 검색어 2배 폭. 셀 밖으로 넘치면 겹침 → 자식은 칸 안에만 맞춤 */
.pur036-wire-field.pur036-mat-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 2fr);
  column-gap: 0.5rem;
  row-gap: 0.375rem;
  align-items: center;
  min-width: 0;
}

.pur036-wire-field.pur036-mat-row > * {
  box-sizing: border-box;
  min-width: 0;
  max-width: 100%;
}

.pur036-wire-span {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  /* 칸 내 라벨↔입력 간격과 동일 */
  gap: 0.5rem;
  min-width: 0;
}

.pur036-wire-span-label {
  flex: 0 0 var(--pur036-label-col);
  width: var(--pur036-label-col);
  min-width: 0;
  max-width: var(--pur036-label-col);
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

.pur036-wire-span-radios {
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

.pur036-sg-select {
  box-sizing: border-box;
}

.pur036-search-panel select.pur036-sg-select {
  border: 1px solid var(--pur036-control-border) !important;
}

.pur036-search-panel select.pur036-sg-select:focus {
  border-color: #3b82f6 !important;
}

.pur036-search-panel .pur036-sg-input {
  border: 1px solid var(--pur036-control-border) !important;
  box-sizing: border-box;
}

.pur036-search-panel .pur036-sg-input:focus {
  border-color: #3b82f6 !important;
}

.pur036-search-panel .pur036-pick-slot :deep(select) {
  border: 1px solid var(--pur036-control-border) !important;
}

.pur036-search-panel .pur036-pick-slot :deep(select:focus) {
  border-color: #3b82f6 !important;
}

.pur036-search-panel .pur036-pick-slot :deep(.pickstore-vs-shell),
.pur036-search-panel .pur036-bc-slot :deep(.pickstore-vs-shell) {
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
  border: 1px solid var(--pur036-control-border) !important;
}

/* compact 매장 v-select 래퍼(rem 상한)가 열보다 클 때 넘침 방지 */
.pur036-search-panel .pur036-pick-slot :deep(div.relative.min-w-0.flex-1) {
  max-width: 100% !important;
}

.pur036-search-panel .pur036-date-slot :deep(input[type="date"]:focus) {
  border-color: #3b82f6 !important;
}

/* 좁은 3열 1칸: Datepicker2 기본 w-36×2+gap → 균등 축소해 스크롤 없이 맞춤 */
.pur036-search-panel .pur036-date-slot :deep(> div.flex.justify-start.items-center) {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0;
  gap: 0.25rem !important;
}

.pur036-search-panel .pur036-date-slot :deep(> div.flex > div.inline-flex.h-8) {
  flex: 1 1 auto;
  min-width: 0;
  max-width: 100%;
  width: 100%;
  gap: 0.125rem !important;
}

.pur036-search-panel .pur036-date-slot :deep(input[type="date"]) {
  border: 1px solid var(--pur036-control-border) !important;
  box-sizing: border-box;
  width: auto !important;
  flex: 1 1 0;
  min-width: 5.25rem;
  max-width: none;
  padding-left: 0.45rem;
  padding-right: 0.25rem;
}

.pur036-search-panel .pur036-date-slot :deep(div.inline-flex.h-8 > span) {
  flex-shrink: 0;
  padding-left: 0.05rem;
  padding-right: 0.05rem;
}

.pur036-search-panel .pur036-date-slot :deep(div.inline-flex.h-8 > button) {
  flex-shrink: 0;
  width: 1.65rem !important;
  height: 1.65rem !important;
  min-width: 1.65rem;
  margin-left: 0 !important;
}

.pur036-search-panel .pur036-date-slot :deep(div.inline-flex.h-8 > button img) {
  max-width: 85%;
  max-height: 85%;
}

.pur036-pick-slot :deep(> div.flex.text-base) {
  width: 100%;
  min-width: 0;
}

.pur036-pick-slot :deep(> div.flex > div:first-child) {
  display: none;
}

.pur036-date-slot :deep(> div.flex.justify-start.items-center) {
  margin-left: 0;
  padding-left: 0;
}

.pur036-bc-slot :deep(> div.flex) {
  justify-content: flex-start;
  width: 100%;
  margin-left: 0;
  padding-left: 0;
}
</style>
