/*--############################################################################
# Filename : SLS02_023RPT.vue
# Description : 매출관리 > 분류별 매출 현황 > 결제 형태별 매출현황II
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
      class="sls0223-search-panel z-10 mt-3 w-full min-h-0 shrink-0 overflow-visible rounded-lg bg-gray-200"
      :style="{
        '--sls0223-panel-pad-x': '2rem',
        '--sls0223-control-border': sls0223ControlBorder,
        '--sls0223-col-gutter': sls0223ColGutter,
        '--sls0223-row-gap': sls0223RowGap,
        '--sls0223-label-col': sls0223LabelCol,
        '--psp-label-w': sls0223LabelCol,
        '--psp-radio-w': '4.75rem',
        '--psp-col-gap': '0.5rem',
      }">
      <div class="sls0223-search-layout min-w-0">
        <!-- 좌: 기간 / 구분 / 조회조건 -->
        <div class="sls0223-left-stack min-w-0">
          <div class="sls0223-row">
            <span class="sls0223-lbl shrink-0">기간</span>
            <div class="sls0223-date-slot min-w-0 flex-1">
              <Datepicker2
                ref="datepicker"
                omit-main-label
                filter-bar-align
                :mainName="'기간'"
                :closePopUp="closePopUp"
                @startDate="startDate"
                @endDate="endDate"
                @excelDate="excelDate" />
            </div>
          </div>

          <div class="sls0223-row">
            <span class="sls0223-lbl shrink-0">구분</span>
            <div class="sls0223-pair-row min-w-0">
              <select
                class="sls0223-select"
                v-model="selectedMainCode"
                @change="getSub">
                <option :value="'01'">직가맹</option>
                <option :value="'02'">지역</option>
                <option :value="'03'">매장유형</option>
              </select>
              <select class="sls0223-select" v-model="selectedCode">
                <option :value="-1">전체</option>
                <option
                  :value="i.lngCode"
                  v-for="i in sublist"
                  :key="i.lngCode">
                  {{ i.strName }}
                </option>
              </select>
            </div>
          </div>

          <div class="sls0223-row">
            <span class="sls0223-lbl shrink-0">조회조건</span>
            <div class="sls0223-check-row min-w-0 flex-1">
              <label class="sls0223-check" for="daily">
                <input type="checkbox" id="daily" @change="seeDaily" />
                일자별
              </label>
              <label
                v-if="isDynamicGrid2 == 'Y'"
                class="sls0223-check"
                for="count">
                <input type="checkbox" id="count" @change="seeSum" />
                건수
              </label>
              <label
                v-if="isDynamicGrid2 == 'N'"
                class="sls0223-check"
                for="unite">
                <input type="checkbox" id="unite" @change="seeUnite" />
                셀병합
              </label>
              <label
                v-if="isDynamicGrid2 == 'N'"
                class="sls0223-check"
                for="sum">
                <input type="checkbox" id="sum" @change="seeGroup" />
                합계
              </label>
            </div>
          </div>
        </div>

        <!-- 우: 매장 -->
        <div class="sls0223-right-store min-w-0 overflow-visible">
          <PickStorePlural
            fluid-width
            @lngStoreCodes="lngStoreCodes"
            @lngStoreGroup="lngStoreGroup"
            @lngStoreAttrs="lngStoreAttrs"
            @excelStore="excelStore"
            @changeInit="changeInit" />
        </div>
      </div>
    </div>

    <div class="mt-2 flex min-h-0 min-w-0 flex-1 flex-col">
      <div class="relative min-h-0 w-full flex-1">
        <Realgrid
          class="h-full min-h-0 w-full"
          :progname="'SLS02_023RPT_VUE'"
          :progid="progId"
          :setDynamicGrid="true"
          :rowData="rowData"
          :reload="reload"
          :setFooter="true"
          :setFooterCustomColumnId="['strStore']"
          :setFooterCustomText="['합계']"
          :setGroupSumCustomText="['매장소계']"
          :setGroupSumCustomColumnId="['strStore']"
          :hideColumnsId="hideColumnsId"
          :mergeMask="''"
          :setGroupFooter="setGroupFooter"
          :setGroupColumnId="'strStore'"
          :setMergeMode="false"
          :setRowGroupSpan2="setRowGroupSpan"
          :documentTitle="'SLS02_023RPT'"
          :documentSubTitle="documentSubTitle"
          :rowStateeditable="false"
          :exporttoExcel="exportExcel" />
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  getJoinType,
  getSalesByPaymentType2Report,
  getStoreArea,
  getSubLease,
  isDynamicGrid,
} from "@/api/misales";
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

/** 조회 AREA — SLS02_031RPT / STKN06 패턴 */
const sls0223ControlBorder = "#cbd5e1";
const sls0223ColGutter = "1.25rem";
const sls0223RowGap = "0.875rem";
const sls0223LabelCol = "5.5rem";

const setGroupColumnId = ref("strStore");
const hideColumnsId = ref(["dtmDate"]);
const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);
const selectedstartDate = ref();
const selectedendDate = ref();
const setRowGroupSpan = ref("strJoinType");
const sublist = ref([]);
const store = useStore();
const selectedCode = ref("-1");
const isDynamicGrid2 = ref("");
const selectedMainCode = ref("01");
/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getJoinType(store.state.userData.lngStoreGroup, 0);
  sublist.value = res.data.List;

  const res2 = await isDynamicGrid(store.state.userData.lngStoreGroup);
  if (res2.data.List[0].strDynamicGrid == "Y") {
    isDynamicGrid2.value = "Y";
    progId.value = 1;
  } else {
    isDynamicGrid2.value = "N";
    progId.value = 2;
  }
  reload.value = !reload.value;
});

const getSub = async (e) => {
  if (e.target.value == "01") {
    const res = await getJoinType(store.state.userData.lngStoreGroup, 0);
    sublist.value = res.data.List;
  } else if (e.target.value == "02") {
    const res = await getStoreArea(store.state.userData.lngStoreGroup, 0);
    sublist.value = res.data.List;
  } else if (e.target.value == "03") {
    const res = await getSubLease(store.state.userData.lngStoreGroup);
    sublist.value = res.data.List;
  }
  selectedCode.value = -1;
};
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
const reportCheckData = ref("0");
const progId = ref("1");

const seeDaily = (e) => {
  tempSeeDaily.value = e.target.checked;
  if (e.target.checked) {
    hideColumnsId.value = [];
  } else {
    hideColumnsId.value = ["dtmDate"];
  }
};

const seeUnite = (e) => {
  if (e.target.checked) {
    setRowGroupSpan.value = "strStore";
  } else {
    setRowGroupSpan.value = "";
  }
};
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

    const res = await getSalesByPaymentType2Report(
      groupCd.value,
      storeCd.value,
      selectedstartDate.value,
      selectedendDate.value,
      tempSeeDaily.value ? 1 : 0,
      isDynamicGrid2.value,
      selectedMainCode.value,
      selectedCode.value,
      setCnt.value
    );
    rowData.value = res.data.List;

    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
  } finally {
    store.state.loading = false;
  }
};

const groupCd = ref("");
const storeCd = ref("");
const selectedStoreAttr = ref();

/**
 * 페이지 매장 코드 세팅
 */

const lngStoreCodes = (e) => {
  initGrid();
  storeCd.value = e;
};
/**
 * 페이지 매장 그룹 세팅
 */

const lngStoreGroup = (e) => {
  groupCd.value = e;
};

/**
 * 페이지 매장 분류 세팅
 */

const lngStoreAttrs = (e) => {
  initGrid();
  selectedStoreAttr.value = e;
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
  let cond = "구분 : ";
  if (selectedMainCode.value == "01") {
    cond += "직가맹 ,";
  } else if (selectedMainCode.value == "02") {
    cond += "지역 ,";
  } else if (selectedMainCode.value == "03") {
    cond += "매장유형 ,";
  }

  if (selectedCode.value == -1) {
    cond += "전체 ";
  } else {
    cond += sublist.value.find(
      (item) => item.lngCode == selectedCode.value
    ).strName;
  }

  let cond2 = "조회조건 :";
  if (hideColumnsId.value.length == 0) {
    cond2 += "일자별,";
  }

  if (setCnt.value == 1) {
    cond2 += "건수,";
  }
  cond2 = cond2.substring(0, cond2.length - 1);
  documentSubTitle.value =
    selectedExcelDate.value +
    "\n" +
    selectedExcelStore.value +
    "\n" +
    cond +
    "\n" +
    cond2;
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

const setCnt = ref(0);
const seeSum = (e) => {
  if (e.target.checked) {
    setCnt.value = 1;
  } else {
    setCnt.value = 0;
  }
};

const setGroupFooter = ref(false);
const seeGroup = (e) => {
  if (e.target.checked) {
    setGroupFooter.value = true;
  } else {
    setGroupFooter.value = false;
  }
};

/**
 *  컴포넌트 변동시 감지 함수
 */

const changeInit = (e) => {
  initGrid();
};
</script>

<style scoped>
.sls0223-search-panel {
  box-sizing: border-box;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  padding-left: var(--sls0223-panel-pad-x, 2rem);
  padding-right: var(--sls0223-panel-pad-x, 2rem);
}

@media (min-width: 768px) {
  .sls0223-search-panel {
    --sls0223-panel-pad-x: 3rem;
  }
}

.sls0223-search-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);
  column-gap: var(--sls0223-col-gutter, 1.25rem);
  align-items: start;
  min-width: 0;
}

.sls0223-left-stack {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: var(--sls0223-row-gap, 0.875rem);
  min-width: 0;
  width: 100%;
  max-width: 100%;
}

.sls0223-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  min-height: 2rem;
}

.sls0223-lbl {
  box-sizing: border-box;
  flex: 0 0 var(--sls0223-label-col, 5.5rem);
  width: var(--sls0223-label-col, 5.5rem);
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

.sls0223-date-slot {
  min-width: 0;
  flex: 1 1 auto;
}

.sls0223-date-slot :deep(> div.flex.justify-start.items-center) {
  margin: 0 !important;
  width: auto !important;
  max-width: 100%;
}

.sls0223-date-slot :deep(input[type="date"]) {
  box-sizing: border-box;
  height: 2rem;
  min-height: 2rem;
  max-height: 2rem;
  border: 1px solid var(--sls0223-control-border, #cbd5e1);
  border-radius: 0.375rem;
  background: #fff;
}

.sls0223-date-slot :deep(div.inline-flex.h-8),
.sls0223-date-slot :deep(button) {
  height: 2rem !important;
  min-height: 2rem !important;
}

.sls0223-pair-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  column-gap: 0.5rem;
  align-items: center;
  /* 라벨 제외 필드 칸 기준 현재 대비 70% */
  flex: 0 1 70%;
  width: 70%;
  max-width: 70%;
  min-width: 0;
}

.sls0223-select {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  height: 2rem;
  min-height: 2rem;
  max-height: 2rem;
  padding: 0 0.5rem;
  border: 1px solid var(--sls0223-control-border, #cbd5e1);
  border-radius: 0.375rem;
  background: #fff;
  font-size: 0.875rem;
  color: rgb(55 65 81);
}

.sls0223-check-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem 1.25rem;
  min-height: 2rem;
}

.sls0223-check {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.875rem;
  font-weight: 400;
  color: rgb(17 24 39);
  white-space: nowrap;
  cursor: pointer;
}

.sls0223-check input {
  margin: 0;
}

.sls0223-right-store {
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

.sls0223-right-store:has(.psp-popup),
.sls0223-right-store:has(.psp-store-hover-list) {
  z-index: 50;
}

.sls0223-right-store :deep(.psp-root) {
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

.sls0223-right-store :deep(.psp-label) {
  width: var(--psp-label-w, 5.5rem);
  justify-content: center;
  padding-inline-start: 0;
  font-size: 1rem;
  font-weight: 600;
}

.sls0223-right-store :deep(.psp-select),
.sls0223-right-store :deep(.psp-store-trigger),
.sls0223-right-store :deep(.psp-collapse-btn) {
  height: 2rem !important;
  min-height: 2rem !important;
}

.sls0223-right-store :deep(.psp-collapse-btn) {
  width: 2rem !important;
}

.sls0223-right-store :deep(.psp-popup) {
  z-index: 60;
  right: 0;
  left: auto;
  width: min(42rem, 92vw);
  min-width: 28rem;
  max-width: min(42rem, 92vw);
}

@media (max-width: 1280px) {
  .sls0223-search-layout {
    grid-template-columns: minmax(0, 1fr);
    row-gap: var(--sls0223-row-gap, 0.875rem);
  }

  .sls0223-right-store :deep(.psp-popup) {
    left: 0;
    right: auto;
  }
}
</style>
