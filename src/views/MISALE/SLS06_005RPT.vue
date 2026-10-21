/*--############################################################################
# Filename : SLS06_005RPT.vue
# Description : 매출관리 > 기간별 매출 현황 > 전년대비실적.
# Date :2025-05-14
# Author : 권맑음
################################################################################*/
<template>
  <!-- pl-5: 셸 w-right가 pl0이라 그리드가 좌측 메뉴에 붙음 → 우측 pd20과 맞춤 -->
  <div class="flex h-full min-h-0 flex-col pl-5" @click="handleParentClick">
    <div
      class="flex w-full shrink-0 items-center justify-between overflow-y-hidden">
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
      class="sls0605-search-panel z-10 mt-3 w-full min-h-0 shrink-0 overflow-visible rounded-lg bg-gray-200"
      :style="{
        '--sls0605-panel-pad-x': '2rem',
        '--sls0605-control-border': sls0605ControlBorder,
        '--sls0605-col-gutter': sls0605ColGutter,
        '--sls0605-row-gap': sls0605RowGap,
        '--sls0605-label-col': sls0605LabelCol,
      }">
      <div class="sls0605-search-layout min-w-0">
        <div class="sls0605-left-stack min-w-0">
          <div class="sls0605-row">
            <span class="sls0605-lbl shrink-0">비교/기준년도</span>
            <div class="sls0605-year-row min-w-0 flex-1">
              <select
                id="sls0605-compare-year"
                v-model="selectedCompareYear"
                class="sls0605-sg-select"
                title="비교년도">
                <option v-for="i in yearsArray" :key="'c-' + i" :value="i">
                  {{ i }}
                </option>
              </select>
              <span class="sls0605-year-slash" aria-hidden="true">/</span>
              <select
                id="sls0605-ref-year"
                v-model="selectedRefYear"
                class="sls0605-sg-select"
                title="기준년도">
                <option v-for="i in yearsArray" :key="'r-' + i" :value="i">
                  {{ i }}
                </option>
              </select>
            </div>
          </div>
          <div class="sls0605-row">
            <span class="sls0605-lbl shrink-0">매출 구분</span>
            <div class="sls0605-radio-row min-w-0 flex-1">
              <label class="sls0605-radio" for="sls0605-sales-1">
                <input
                  id="sls0605-sales-1"
                  v-model="selectedSalesType"
                  type="radio"
                  name="sls0605-salesType"
                  :value="1" />
                실매출
              </label>
              <label class="sls0605-radio" for="sls0605-sales-2">
                <input
                  id="sls0605-sales-2"
                  v-model="selectedSalesType"
                  type="radio"
                  name="sls0605-salesType"
                  :value="2" />
                순매출
              </label>
            </div>
          </div>
        </div>

        <div class="sls0605-right-store min-w-0 overflow-visible">
          <PickStoreSingle2
            @lngStoreCode="lngStoreCode"
            @lngStoreGroup="lngStoreGroup"
            @lngStoreAttrs="lngStoreAttrs"
            @lngStoreTeam="lngStoreTeam"
            @lngSupervisor="lngSupervisor"
            @excelStore="excelStore" />
        </div>
      </div>
    </div>

    <div class="mt-2 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <div class="sls0605-grid-wrap min-h-0 w-full shrink-0">
        <Realgrid
          class="h-full min-h-0 w-full"
          :progname="'SLS06_005RPT_VUE'"
          :progid="1"
          :rowData="rowData"
          :reload="reload"
          :exporttoExcel="exportExcel"
          :documentSubTitle="documentSubTitle"
          :documentTitle="'SLS06_005RPT'"
          :rowStateeditable="false"
          :setFooterColID="[
            'lastTotAmt',
            'lastCustCnt',
            'lastCustResult',
            'nowTotAmt',
            'nowCustCnt',
            'nowCustResult',
            'differAmt',
            'differCust',
            'differCustResult',
          ]"
          :setFooterExpressions="[
            'sum',
            'sum',
            'avg',
            'sum',
            'sum',
            'avg',
            'sum',
            'sum',
            'avg',
          ]"
          :setFooter="true"
          :mergeColumns2="true"
          :mergeColumnGroupSubList2="[
            ['lastTotAmt', 'lastCustCnt', 'lastCustResult'],
            ['nowTotAmt', 'nowCustCnt', 'nowCustResult'],
            ['differAmt', 'differCust', 'differCustResult', 'AmtRate'],
          ]"
          :mergeColumnGroupName2="[
            '비교년도' + '(' + selectedCompareYear + ')',
            '기준년도' + '(' + selectedRefYear + ')',
            '전년대비',
          ]"
          @getJsonData="getJsonData"
          :getJson="getJson" />
      </div>

      <!-- chart.vue 기본 height:600px가 라디오를 덮지 않도록 wrap에서 클리핑 -->
      <div class="sls0605-chart-wrap relative mt-1 min-h-0 flex-1 overflow-hidden">
        <Chart
          v-show="byRadioButton"
          class="sls0605-chart h-full min-h-0 w-full"
          :type="type"
          :labels="[
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '10',
            '11',
            '12',
          ]"
          :label="[selectedCompareYear, selectedRefYear]"
          :datas="datas"
          :chartName="'전년대비실적'"
          :colors="['lightgreen', '#333399']"
          :print="print" />
      </div>

      <div
        class="sls0605-chart-bar relative z-20 mt-2 flex shrink-0 flex-wrap items-center justify-end gap-x-4 gap-y-2">
        <label class="sls0605-radio" for="sls0605-chart-line">
          <input
            id="sls0605-chart-line"
            v-model="setchart"
            type="radio"
            name="sls0605-Chart"
            :value="0" />
          선 그래프
        </label>
        <label class="sls0605-radio" for="sls0605-chart-bar">
          <input
            id="sls0605-chart-bar"
            v-model="setchart"
            type="radio"
            name="sls0605-Chart"
            :value="1" />
          막대그래프
        </label>
        <label class="sls0605-radio" for="sls0605-chart-hide">
          <input
            id="sls0605-chart-hide"
            v-model="setchart"
            type="radio"
            name="sls0605-Chart"
            :value="2" />
          차트숨기기
        </label>
        <button type="button" class="button print" @click="printChart">인쇄</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getPrevYearComparison } from "@/api/misales";
import Chart from "@/components/chart.vue";
/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
/**
 *  매장  단일 선택 컴포넌트
 *  */

import PickStoreSingle2 from "@/components/pickStoreSingle.vue";
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

/** 조회 AREA — SLS06_001 / SLS06_004 반응형 패턴 */
const sls0605ControlBorder = "#cbd5e1";
const sls0605ColGutter = "1.25rem";
const sls0605RowGap = "0.875rem";
const sls0605LabelCol = "7rem";

const selectedCompareYear = ref(new Date().getFullYear() - 1);
const selectedRefYear = ref(new Date().getFullYear());
const Years = new Date().getFullYear();
const yearsArray = Array.from({ length: 11 }, (_, i) => Years - 10 + i).sort(
  (a, b) => b - a
);

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);
const type = ref("line");
const labels = ref("line");
const label = ref("line");
const datas = ref([]);
const searchText = ref("");
const selectedGuest = ref({ strName: "전체", lngCode: 0 });
const GuestType = ref([
  { strName: "전체", lngCode: 0 },
  { strName: "가족", lngCode: 1 },
  { strName: "친구", lngCode: 2 },
  { strName: "연인", lngCode: 3 },
  { strName: "직장인", lngCode: 4 },
  { strName: "모임", lngCode: 5 },
  { strName: "외국인", lngCode: 6 },
  { strName: "단독", lngCode: 7 },
  { strName: "기타", lngCode: 8 },
  { strName: "주부", lngCode: 9 },
  { strName: "9", lngCode: 10 },
  { strName: "11", lngCode: 11 },
  { strName: "12", lngCode: 12 },
]);
const selectedSalesType = ref(1);
const getJson = ref(false);
const checkedDate = ref(0);
const checkedStore = ref(0);

const store = useStore();
const loginedstrLang = store.state.userData.lngLanguage;
/**
 *  조회 함수
 */

const searchButton = async () => {
  store.state.loading = true;
  try {
    initGrid();

    reload.value = !reload.value;

    setchart.value = 2;
    const res = await getPrevYearComparison(
      selectedGroup.value,
      selectedStoreAttrs.value,
      selectedStoreTeam.value,
      selectedStoreSuperVisor.value,
      selectedStores.value,
      selectedRefYear.value,
      selectedCompareYear.value,
      selectedSalesType.value
    );
    //comsole.log(res);
    rowData.value = res.data.List.filter((item) => item.lngCode != "");

    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
  } finally {
    store.state.loading = false;
  }
};
const print = ref(false);
const selectedGroup = ref();
const selectedStores = ref();
const selectedStoreAttrs = ref();
const selectedStoreTeam = ref();
const selectedStoreSuperVisor = ref();
const selectedHoliday = ref(0);
const selectedsubMenu = ref(null);
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

const lngStoreCode = (e) => {
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
 * 페이지 매장 팀 세팅
 */

const lngStoreTeam = (e) => {
  selectedStoreTeam.value = e;
  initGrid();
};
/**
 * 페이지 매장 슈퍼바이저 세팅
 */

const lngSupervisor = (e) => {
  selectedStoreSuperVisor.value = e;
  initGrid();
};

/**
 * 그리드 초기화
 */

const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
  if (datas.value.length > 0) {
    datas.value = [];
  }
  setchart.value = 2;
};

const exportExcel = ref(false);
const selectedSearchType = ref(4);
const documentSubTitle = ref("");
const menuDistinct = ref(["전체", "대그룹", "서브그룹", "메뉴구분"]);
const searchCondition = ref([
  "매장명표시",
  "대그룹",
  "서브그룹",
  "일자별",
  "증정구분",
  "단가제외",
  "합계",
  "셀병합",
]);
const dayCondition = ref(["일", "월", "화", "수", "목", "금", "토"]);
const ConditionSet = new Set([]);
/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  documentSubTitle.value =
    "비교년도/기준년도 : " +
    selectedCompareYear.value +
    " / " +
    selectedRefYear.value +
    "\n" +
    selectedExcelStore.value +
    "\n" +
    "매출구분 : " +
    (selectedSalesType.value == 1 ? "실매출" : "순매출");
  exportExcel.value = !exportExcel.value;
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
  closePopUp.value = !closePopUp.value;
};
const selectedExcelDate = ref("");
const selectedExcelStore = ref("");
/**
 * 엑셀용 일자 세팅 함수
 */

const excelDate = (e) => {
  selectedExcelDate.value = e;
};
/**
 * 엑셀용 매장 세팅 함수
 */

const excelStore = (e) => {
  selectedExcelStore.value = e;
};

const selectedMenu = ref(null);

const subList = ref([]);
const menuType = ref([]);
const Menus = ref([]);
const mainMenu = ref([]);
const byRadioButton = ref(false);
const getJsonData = (e) => {
  datas.value = [];
  let data1 = [];
  for (let i = 0; i < e.length; i++) {
    data1.push(e[i].lastTotAmt);
  }
  datas.value.push(data1);

  let data2 = [];
  for (let i = 0; i < e.length; i++) {
    data2.push(e[i].nowTotAmt);
  }
  datas.value.push(data2);
  //comsole.log(labels.value);
  //comsole.log(label.value);
  //comsole.log(datas.value);
};
/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = insertPageLog(store.state.activeTab2);
});

const setchart = ref(2);
watch(setchart, () => {
  if (setchart.value == 0) {
    type.value = "line";
    byRadioButton.value = true;
  } else if (setchart.value == 1) {
    type.value = "bar";
    byRadioButton.value = true;
  } else {
    byRadioButton.value = false;
  }

  getJson.value = !getJson.value;
});

const printChart = () => {
  print.value = !print.value;
};
</script>

<style scoped>
.sls0605-search-panel {
  box-sizing: border-box;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  padding-left: var(--sls0605-panel-pad-x, 2rem);
  padding-right: var(--sls0605-panel-pad-x, 2rem);
}

@media (min-width: 768px) {
  .sls0605-search-panel {
    --sls0605-panel-pad-x: 3rem;
  }
}

.sls0605-search-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);
  column-gap: var(--sls0605-col-gutter, 1.25rem);
  align-items: start;
  min-width: 0;
}

.sls0605-left-stack {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--sls0605-row-gap, 0.875rem);
  min-width: 0;
  width: 100%;
  max-width: 100%;
  min-height: 100%;
}

.sls0605-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  min-height: 2rem;
}

.sls0605-lbl {
  box-sizing: border-box;
  flex: 0 0 var(--sls0605-label-col, 7rem);
  width: var(--sls0605-label-col, 7rem);
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

.sls0605-year-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 0.65rem;
  min-width: 0;
}

.sls0605-year-slash {
  flex: 0 0 auto;
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1;
  color: rgb(55 65 81);
}

.sls0605-sg-select {
  box-sizing: border-box;
  height: 2rem;
  min-height: 2rem;
  max-height: 2rem;
  width: 8rem;
  max-width: 100%;
  min-width: 0;
  padding: 0 0.375rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: rgb(55 65 81);
  background: #fff;
  border: 1px solid var(--sls0605-control-border, #cbd5e1);
  border-radius: 0.375rem;
}

.sls0605-sg-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.2);
}

.sls0605-radio-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem 1.25rem;
  min-height: 2rem;
}

.sls0605-radio {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.875rem;
  font-weight: 400;
  color: rgb(17 24 39);
  white-space: nowrap;
  cursor: pointer;
}

.sls0605-radio input {
  margin: 0;
  flex-shrink: 0;
}

.sls0605-right-store {
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

.sls0605-right-store :deep(.pss-brand) {
  font-size: 1rem !important;
  font-weight: 600 !important;
  line-height: 1.25 !important;
  color: rgb(17 24 39) !important;
}

.sls0605-right-store :deep(select),
.sls0605-right-store :deep(.h-8),
.sls0605-right-store :deep(.pss-select),
.sls0605-right-store :deep(.pss-vselect) {
  box-sizing: border-box;
  height: 2rem !important;
  min-height: 2rem !important;
}

.sls0605-grid-wrap {
  height: min(26vh, 14rem);
  min-height: 10rem;
}

.sls0605-chart-wrap {
  min-height: 12rem;
  overflow: hidden;
}

/* 공통 Chart 기본 600px 고정 높이를 이 화면 영역 안으로만 맞춤 */
.sls0605-chart-wrap :deep(.chart-container) {
  box-sizing: border-box;
  width: 100%;
  height: 100% !important;
  max-height: 100%;
  min-height: 0;
}

.sls0605-chart-bar {
  position: relative;
  z-index: 20;
  min-height: 2rem;
  pointer-events: auto;
}

@media (max-width: 1280px) {
  .sls0605-search-layout {
    grid-template-columns: minmax(0, 1fr);
    row-gap: var(--sls0605-row-gap, 0.875rem);
  }
}
</style>
