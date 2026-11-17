/*--############################################################################
# Filename : SLS02_030RPT.vue                                                  
# Description : 매출관리 > 기간별 매출 현황 > 매장별 실시간 매출 조회         #
Date :2025-05-14                                                              #
Author : 권맑음                     
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
      class="sls0230-search-panel z-10 mt-3 w-full min-h-0 shrink-0 overflow-visible rounded-lg bg-gray-200"
      :style="{
        '--sls0230-control-border': sls0230ControlBorder,
        '--sls0230-col-gutter': sls0230ColGutter,
        '--sls0230-row-gap': sls0230RowGap,
        '--sls0230-label-col': sls0230LabelCol,
        '--sls0230-select-w': sls0230SelectW,
        '--psp-label-w': sls0230LabelCol,
        '--psp-radio-w': '4.75rem',
        '--psp-col-gap': '0.5rem',
      }">
      <div class="sls0230-search-layout min-w-0">
        <!-- 좌측: 매출일자 / 구분 / 조회조건 -->
        <div class="sls0230-left-stack min-w-0">
          <div class="sls0230-row">
            <span class="sls0230-lbl shrink-0">매출일자</span>
            <div class="sls0230-date-slot min-w-0 flex-1">
              <Datepicker2
                ref="datepicker"
                omit-main-label
                filter-bar-align
                :mainName="'매출일자'"
                :closePopUp="closePopUp"
                :initToday="1"
                @endDate="endDate"
                @startDate="startDate"
                @excelDate="excelDate" />
            </div>
          </div>

          <div class="sls0230-row">
            <span class="sls0230-lbl shrink-0">구분</span>
            <div class="sls0230-selects flex min-w-0 items-center">
              <select name="" id="" class="sls0230-select">
                <option value="">직가맹</option>
              </select>
              <select name="" id="" class="sls0230-select">
                <option value="">전체</option>
              </select>
            </div>
          </div>

          <div class="sls0230-row">
            <span class="sls0230-lbl shrink-0">조회조건</span>
            <div class="sls0230-checks flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1">
              <label class="sls0230-check-label" for="detail">
                <input
                  id="detail"
                  type="checkbox"
                  class="sls0230-check"
                  @change="seeDays" />
                일자별
              </label>
            </div>
          </div>
        </div>

        <!-- 우측: 매장명 + 조회 시각 안내 -->
        <div class="sls0230-right-store min-w-0 overflow-visible">
          <PickStorePlural
            fluid-width
            @lngStoreCodes="lngStoreCodes"
            @lngStoreGroup="lngStoreGroup"
            @lngSupervisor="lngSupervisor"
            @lngStoreTeam="lngStoreTeam"
            @lngStoreAttrs="lngStoreAttrs"
            @excelStore="excelStore" />
          <div class="sls0230-notice">
            <div v-show="afterSearch">
              {{ currentTime }}에 조회되었으며 미결제금액은 조회 시간 기준입니다.
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-2 flex min-h-0 min-w-0 flex-1 flex-col">
      <div class="relative min-h-0 w-full flex-1">
        <Realgrid
          :progname="'SLS02_030RPT_VUE'"
          :progid="progid"
          :rowData="rowData"
          :reload="reload"
          :exporttoExcel="exportExcel"
          :documentSubTitle="documentSubTitle"
          :documentTitle="'SLS02_030RPT'"
          :rowStateeditable="false"
          :setRowGroupSpan="'strName'"></Realgrid>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getRealTimeReport } from "@/api/misales";
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
/*
 * 공통 커스텀 Function ( 페이지 로그 , 시간 포맷)
 */

import { formatTime, insertPageLog } from "@/customFunc/customFunc";
/*
 * 공통 표준  Function
 */

import { onMounted, ref } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";

/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
});

const setGroupFooter = ref(false);
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
const setGroupSummaryCenterIds = ref("dtmDate,strWeekName");
/** 조회 AREA 레이아웃 값 (SLS02_014RPT 패턴) */
const sls0230ControlBorder = "#cbd5e1";
const sls0230ColGutter = "1.25rem";
/** 매장명 줄 간격(0.5rem)과 같게 → 좌우 줄 위치가 나란함 */
const sls0230RowGap = "0.5rem";
const sls0230LabelCol = "5.5rem";
/** 기간 전체 폭 21.625rem(날짜 9rem×2 + ~ + 달력 버튼) = 콤보 2개 + 간격 0.5rem → 끝선 일치 */
const sls0230SelectW = "10.5625rem";
const progid = ref(2);
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

const tempSeeDay = ref(0);
const seeDays = (e) => {
  if (e.target.checked) {
    tempSeeDay.value = 1;
  } else {
    tempSeeDay.value = 0;
  }
};
const store = useStore();
const loginedstrLang = store.state.userData.lngLanguage;
/**
 *  조회 함수
 */

const searchButton = async () => {
  store.state.loading = true;
  try {
    initGrid();
    if (tempSeeDay.value == 1) {
      progid.value = 1;
    } else {
      progid.value = 2;
    }
    reload.value = !reload.value;
    let selectedStorearr;
    // if (selectedStores.value == undefined || selectedStores.value.length == 0) {
    //     selectedStorearr = 0
    // } else {
    selectedStorearr = selectedStores.value;
    // }

    const res = await getRealTimeReport(
      selectedGroup.value,
      selectedStorearr,
      selectedstartDate.value,
      selectedendDate.value,
      tempSeeDay.value
    );
    //comsole.log(res);
    rowData.value = res.data.RECEIPT;

    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
  } finally {
    store.state.loading = false;
  }
};
const currentTime = ref(formatTime(new Date()));
const selectedGroup = ref();
const selectedStores = ref();
const selectedStoreAttrs = ref(0);
const selectedLngSuperVisor = ref(0);
const selectedLngStoreTeam = ref(0);
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
  initGrid();
  selectedStoreAttrs.value = e;
  //comsole.log(e);
};
/**
 * 페이지 매장 슈퍼바이저 세팅
 */

const lngSupervisor = (e) => {
  initGrid();
  selectedLngSuperVisor.value = e;
  //comsole.log(e);
};

/**
 * 페이지 매장 팀 세팅
 */

const lngStoreTeam = (e) => {
  initGrid();
  selectedLngStoreTeam.value = e;
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
const documentSubTitle = ref("");
/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  documentSubTitle.value =
    selectedExcelDate.value + "\n" + selectedExcelStore.value;
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
</script>

<style scoped>
.sls0230-search-panel {
  box-sizing: border-box;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  padding-left: var(--sls0230-panel-pad-x, 2rem);
  /* 항목명 칸(5.5rem) 가운데 정렬로 4글자 항목명 앞에 1rem 여백이 생김 → 뒤에도 같은 값 추가 */
  padding-right: calc(var(--sls0230-panel-pad-x, 2rem) + 1rem);
}

@media (min-width: 768px) {
  .sls0230-search-panel {
    --sls0230-panel-pad-x: 3rem;
  }
}

.sls0230-search-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);
  column-gap: var(--sls0230-col-gutter, 1.25rem);
  align-items: start;
  min-width: 0;
}

.sls0230-left-stack {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: var(--sls0230-row-gap, 0.875rem);
  min-width: 0;
  width: 100%;
  max-width: 100%;
}

.sls0230-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  min-height: 2rem;
}

.sls0230-lbl {
  box-sizing: border-box;
  flex: 0 0 var(--sls0230-label-col, 5.5rem);
  width: var(--sls0230-label-col, 5.5rem);
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

.sls0230-selects {
  gap: 0.5rem;
  min-width: 0;
}

.sls0230-select {
  box-sizing: border-box;
  flex: 0 1 var(--sls0230-select-w, 10rem);
  width: var(--sls0230-select-w, 10rem);
  min-width: 0;
  height: 2rem;
  padding: 0 0.5rem;
  border: 1px solid var(--sls0230-control-border, #cbd5e1);
  border-radius: 0.375rem;
  background: #fff;
  font-size: 0.9375rem;
}

.sls0230-select:focus {
  outline: none;
  border-color: #3b82f6;
}

.sls0230-checks {
  min-width: 0;
}

.sls0230-check-label {
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

.sls0230-check {
  width: 1rem;
  height: 1rem;
  margin: 0;
  accent-color: #2563eb;
  cursor: pointer;
}

.sls0230-date-slot {
  min-width: 0;
  flex: 1 1 auto;
}

.sls0230-date-slot :deep(> div.flex.justify-start.items-center) {
  margin: 0 !important;
  width: auto !important;
  max-width: 100%;
}

.sls0230-date-slot :deep(input[type="date"]) {
  box-sizing: border-box;
  height: 2rem;
  min-height: 2rem;
  border: 1px solid var(--sls0230-control-border, #cbd5e1);
  border-radius: 0.375rem;
  background: #fff;
}

.sls0230-date-slot :deep(div.inline-flex.h-8),
.sls0230-date-slot :deep(button) {
  height: 2rem !important;
  min-height: 2rem !important;
}

.sls0230-right-store {
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

.sls0230-right-store:has(.psp-popup),
.sls0230-right-store:has(.psp-store-hover-list) {
  z-index: 50;
}

.sls0230-right-store :deep(.psp-root) {
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

.sls0230-right-store :deep(.psp-label) {
  width: var(--psp-label-w, 5.5rem);
  justify-content: center;
  padding-inline-start: 0;
  font-size: 1rem;
  font-weight: 600;
}

/* 매장 콤보/트리거 — 일자(h-8)와 동일 높이 */
.sls0230-right-store :deep(.psp-select),
.sls0230-right-store :deep(.psp-store-trigger),
.sls0230-right-store :deep(.psp-collapse-btn) {
  height: 2rem !important;
  min-height: 2rem !important;
}

.sls0230-right-store :deep(.psp-collapse-btn) {
  width: 2rem !important;
}

.sls0230-right-store :deep(.psp-popup) {
  z-index: 60;
  right: 0;
  left: auto;
  width: min(42rem, 92vw);
  min-width: 28rem;
  max-width: min(42rem, 92vw);
}

/* 조회 시각 안내 — 매장 영역 아래 오른쪽, 자리 고정(조회 전후 높이 변화 없음) */
.sls0230-notice {
  display: flex;
  justify-content: flex-end;
  min-height: 1.25rem;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: #ef4444;
  text-align: right;
}

@media (max-width: 1280px) {
  .sls0230-search-layout {
    grid-template-columns: minmax(0, 1fr);
    row-gap: var(--sls0230-row-gap, 0.875rem);
  }

  .sls0230-right-store :deep(.psp-popup) {
    left: 0;
    right: auto;
  }
}
</style>
