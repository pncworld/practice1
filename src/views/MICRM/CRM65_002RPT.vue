<!-- /*--############################################################################
# Filename : CRM65_002RPT.vue
# Description : 고객관리 > 전자상품권 현황 > 전자상품권 거래 내역
# Date :2025-06-19
# Author : 권맑음
################################################################################*/ -->
<template>
  <div class="flex h-full min-h-0 flex-col pl-5" @click="handleParentClick">
    <div
      class="flex w-full shrink-0 items-center justify-between overflow-y-hidden">
      <PageName></PageName>
      <div class="mr-9 flex justify-center space-x-2 pr-5">
        <button type="button" class="button search md:w-auto w-14" @click="searchButton">
          조회
        </button>
        <button type="button" class="button save w-auto excel" @click="excelButton">
          엑셀
        </button>
      </div>
    </div>

    <div
      class="crm6502-search-panel z-10 mt-3 w-full min-h-0 shrink-0 overflow-visible rounded-lg bg-gray-200"
      :style="{
        '--crm6502-control-border': crm6502ControlBorder,
        '--crm6502-col-gap': crm6502ColGutter,
        '--crm6502-item-gap': crm6502ItemGap,
        '--crm6502-row-gap': crm6502RowGap,
        '--crm6502-label-col': crm6502LabelCol,
        '--crm6502-panel-pad-x': crm6502PanelPadX,
        '--crm6502-select-w': crm6502SelectW,
        '--crm6502-control-h': crm6502ControlH,
        '--crm6502-row-min-h': crm6502RowMinH,
        '--psp-label-w': crm6502LabelCol,
        '--psp-radio-w': '4.75rem',
        '--psp-col-gap': '0.5rem',
      }">
      <!--
        004와 같은 2행:
        좌 — row1 일자 / row2 구분·권종
        우 — PickStorePlural(직/가맹 · 팀/SC)
        조회조건 체크는 이 화면 전용이라 그 아래 줄에 유지
      -->
      <div class="crm6502-search-layout min-w-0">
        <div class="crm6502-left-stack min-w-0">
          <div class="crm6502-row">
            <span class="crm6502-lbl shrink-0">일자</span>
            <div class="crm6502-date-slot min-w-0 flex-1">
              <Datepicker2
                ref="datepicker"
                :main-name="'일자'"
                omit-main-label
                filter-bar-align
                :close-pop-up="closePopUp"
                @excel-date="excelDate"
                @start-date="startDate"
                @end-date="endDate"></Datepicker2>
            </div>
          </div>

          <div class="crm6502-row crm6502-row--pair">
            <div class="crm6502-pair-item min-w-0">
              <span class="crm6502-lbl shrink-0">구분</span>
              <select v-model="cond" class="crm6502-select">
                <option value="0">전체</option>
                <option
                  v-for="i in optionList"
                  :key="i.lngGftCategory"
                  :value="i.lngGftCategory">
                  {{ i.strGftCategory }}
                </option>
              </select>
            </div>
            <div class="crm6502-pair-item min-w-0">
              <span class="crm6502-lbl shrink-0">권종</span>
              <select v-model="cond3" class="crm6502-select">
                <option value="0">전체</option>
                <option
                  v-for="i in optionList2"
                  :key="i.lngGftType"
                  :value="i.lngGftType">
                  {{ i.strGftType }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div class="crm6502-right-store min-w-0 overflow-visible">
          <div class="crm6502-pick-wrap min-w-0 flex-1">
            <PickStorePlural
              fluid-width
              @lngStoreGroup="lngStoreGroup"
              @lngStoreCodes="lngStoreCodes"></PickStorePlural>
          </div>
        </div>
      </div>

      <div class="crm6502-check-row min-w-0">
        <span class="crm6502-lbl shrink-0">조회조건</span>
        <div class="crm6502-checks min-w-0">
          <label class="crm6502-check-item" for="cond4">
            <input id="cond4" v-model="cond4" type="checkbox" />전체
          </label>
          <label class="crm6502-check-item" for="cond5">
            <input id="cond5" v-model="cond5" type="checkbox" />생성
          </label>
          <label class="crm6502-check-item" for="cond6">
            <input id="cond6" v-model="cond6" type="checkbox" />출고
          </label>
          <label class="crm6502-check-item" for="cond7">
            <input id="cond7" v-model="cond7" type="checkbox" />판매
          </label>
          <label class="crm6502-check-item" for="cond8">
            <input id="cond8" v-model="cond8" type="checkbox" />충전
          </label>
          <label class="crm6502-check-item" for="cond9">
            <input id="cond9" v-model="cond9" type="checkbox" />사용
          </label>
          <label class="crm6502-check-item" for="cond10">
            <input id="cond10" v-model="cond10" type="checkbox" />회수
          </label>
          <label class="crm6502-check-item" for="cond11">
            <input id="cond11" v-model="cond11" type="checkbox" />교환폐기
          </label>
          <label class="crm6502-check-item" for="cond12">
            <input id="cond12" v-model="cond12" type="checkbox" />교환판매
          </label>
          <label class="crm6502-check-item" for="cond13">
            <input id="cond13" v-model="cond13" type="checkbox" />교환충전
          </label>
          <label class="crm6502-check-item" for="cond14">
            <input id="cond14" v-model="cond14" type="checkbox" />취소
          </label>
          <label class="crm6502-check-item" for="cond15">
            <input id="cond15" v-model="cond15" type="checkbox" />분실
          </label>
          <label class="crm6502-check-item" for="cond16">
            <input id="cond16" v-model="cond16" type="checkbox" />증정
          </label>
        </div>
      </div>
    </div>

    <div class="mt-2 flex min-h-0 min-w-0 flex-1 flex-col">
      <div class="relative min-h-0 w-full flex-1">
        <Realgrid
          class="h-full min-h-0 w-full"
          :progname="'CRM65_002RPT_VUE'"
          :progid="1"
          :rowData="rowData"
          :reload="reload"
          :documentTitle="'CRM65_002RPT'"
          :documentSubTitle="documentSubTitle"
          :rowStateeditable="false"
          :exporttoExcel="exportExcel">
        </Realgrid>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getCommonList } from "@/api/common";
import { getGftLedgerTradeList, getInitGftData } from "@/api/micrm";
import Datepicker2 from "@/components/Datepicker2.vue";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
import PickStorePlural from "@/components/pickStorePlural.vue";
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

import Swal from "sweetalert2";
/*
 * 공통 표준  Function
 */

import { onMounted, ref, watch } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";

const store = useStore();
const crm6502ControlBorder = "#cbd5e1";
const crm6502ColGutter = "1.25rem";
const crm6502ItemGap = "0.75rem";
const crm6502RowGap = "0.75rem";
const crm6502LabelCol = "5rem";
const crm6502PanelPadX = "2rem";
/** 구분·권종 — 004와 같이 일자 한 칸에 맞춤 */
const crm6502SelectW = "9.5rem";
const crm6502ControlH = "2rem";
const crm6502RowMinH = "2rem";

/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getCommonList(254);

  optionList3.value = res.data.List;
  const res2 = await getInitGftData(store.state.userData.lngStoreGroup);

  optionList.value = res2.data.List;
  optionList2.value = res2.data.List2;
});

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);
const selectedCond = ref(0);
const condValue = ref(0);
const cond = ref(0);
const cond2 = ref(false);
const cond3 = ref(0);
const cond4 = ref(true);
const cond5 = ref(true);
const cond6 = ref(true);
const cond7 = ref(true);
const cond8 = ref(true);
const cond9 = ref(true);
const cond10 = ref(true);
const cond11 = ref(true);
const cond12 = ref(true);
const cond13 = ref(true);
const cond14 = ref(true);
const cond15 = ref(true);
const cond16 = ref(true);
const optionList = ref([]);
const optionList2 = ref([]);
const optionList3 = ref([]);
const datepicker = ref(null);
const closePopUp = ref(false);
const custId = ref("");

watch(cond4, () => {
  if (cond4.value == true) {
    cond5.value = true;
    cond6.value = true;
    cond7.value = true;
    cond8.value = true;
    cond9.value = true;
    cond10.value = true;
    cond11.value = true;
    cond12.value = true;
    cond13.value = true;
    cond14.value = true;
    cond15.value = true;
    cond16.value = true;
  }
});
const strSaleCustID = (e) => {
  initGrid();
  custId.value = e;
};
const custNm = ref("");
const strSaleCustName = (e) => {
  custNm.value = e;
};
const sd = ref("");
const groupCd = ref("");
const ed = ref("");
const storeCds = ref("");
const selectedDate = ref("");
const startDate = (e) => {
  sd.value = e;
};
const endDate = (e) => {
  ed.value = e;
};
const lngStoreGroup = (e) => {
  groupCd.value = e;
};
const lngStoreCodes = (e) => {
  storeCds.value = e;
};

const excelDate = (e) => {
  selectedDate.value = e;
};
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
  if (sd.value == null || ed.value == null) {
    Swal.fire({
      title: "경고",
      text: "일자을 선택하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  try {
    store.state.loading = true;
    initGrid();
    // @strApprovalType: DB 승인구분 순서(1~13) 고정 슬롯 — 체크 시 해당 코드, 미체크 시 0
    // 1생성 2판매 3충전 4사용 5회수 6교환폐기 7교환판매 8교환충전 9취소 10출고 11차감 12분실 13증정 (전체 cond4는 슬롯 없음)
    const strcond = [
      [cond5, 1],
      [cond7, 2],
      [cond8, 3],
      [cond9, 4],
      [cond10, 5],
      [cond11, 6],
      [cond12, 7],
      [cond13, 8],
      [cond14, 9],
      [cond6, 10],
      [null, 11],
      [cond15, 12],
      [cond16, 13],
    ]
      .map(([r, code]) => (r && r.value ? String(code) : "0"))
      .join(",");

    // DEBUG: 조회 시 콘솔 확인용 (불필요 시 제거)
    const debugPayload = {
      GROUP_CD: groupCd.value,
      STORE_CDS: storeCds.value,
      COND: cond.value,
      COND2: cond3.value,
      START_DATE: sd.value,
      END_DATE: ed.value,
      COND3: strcond,
      LANG: store.state.userData.strLanguage,
    };
    console.group("[CRM65_002RPT] getGftLedgerTradeList");
    console.log(
      "권종(cond)→API COND2:",
      cond3.value,
      "| 조회조건 슬롯(1~13순)→API COND3:",
      JSON.stringify(strcond)
    );
    console.log(
      "체크 cond4~16 (전체,생성,출고,판매,…):",
      [
        cond4.value,
        cond5.value,
        cond6.value,
        cond7.value,
        cond8.value,
        cond9.value,
        cond10.value,
        cond11.value,
        cond12.value,
        cond13.value,
        cond14.value,
        cond15.value,
        cond16.value,
      ]
        .map((v) => (v ? "1" : "0"))
        .join("")
    );
    console.log("요청 본문 스냅샷(JSON):", JSON.stringify(debugPayload));
    console.groupEnd();

    const res = await getGftLedgerTradeList(
      groupCd.value,
      storeCds.value,
      cond.value,
      cond3.value,
      sd.value,
      ed.value,
      strcond,
      store.state.userData.strLanguage
    );
    ////console.log(res);
    rowData.value = res.data.List;

    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    ////console.log(error);
  } finally {
    store.state.loading = false;
  }
};

/* 매장 컴포넌트 관련 함수 */
const selectedGroup = ref();
const selectedStores = ref();
const selectedStoreAttrs = ref();

/**
 * 페이지 매장 코드 세팅
 */

const lngStoreCode = async (e) => {
  initGrid();
  selectedStores.value = e;
  ////console.log(e);
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
  documentSubTitle.value = selectedDate.value;

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
.crm6502-search-panel {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  padding-block: 0.75rem;
  padding-left: var(--crm6502-panel-pad-x, 2rem);
  padding-right: var(--crm6502-panel-pad-x, 2rem);
  overflow-x: visible;
}

.crm6502-search-layout {
  display: grid;
  grid-template-columns: max-content minmax(0, 1fr);
  column-gap: var(--crm6502-col-gap, 1.25rem);
  align-items: center;
  min-width: 0;
}

.crm6502-left-stack {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  gap: var(--crm6502-row-gap, 0.75rem);
  width: max-content;
  max-width: 100%;
  min-width: max-content;
}

.crm6502-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--crm6502-item-gap, 0.75rem);
  width: 100%;
  min-width: 0;
  min-height: var(--crm6502-row-min-h, 2rem);
}

.crm6502-row--pair {
  flex: 0 0 auto;
  flex-wrap: nowrap;
  gap: var(--crm6502-item-gap, 0.75rem);
  width: max-content;
  min-width: max-content;
}

.crm6502-pair-item {
  display: flex;
  flex: 0 0 auto;
  flex-direction: row;
  align-items: center;
  gap: var(--crm6502-item-gap, 0.75rem);
}

.crm6502-lbl {
  box-sizing: border-box;
  flex: 0 0 var(--crm6502-label-col, 5rem);
  width: var(--crm6502-label-col, 5rem);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-height: var(--crm6502-row-min-h, 2rem);
  font-size: 0.9375rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
  white-space: nowrap;
}

.crm6502-select {
  box-sizing: border-box;
  width: var(--crm6502-select-w, 9.5rem);
  max-width: 100%;
  min-width: 0;
  height: var(--crm6502-control-h, 2rem);
  min-height: var(--crm6502-control-h, 2rem);
  max-height: var(--crm6502-control-h, 2rem);
  padding: 0 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: rgb(30 41 59);
  background: #fff;
  border: 1px solid var(--crm6502-control-border, #cbd5e1);
  border-radius: 0.375rem;
}

.crm6502-select:focus {
  border-color: #3b82f6;
  outline: none;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.35);
}

.crm6502-date-slot {
  flex: 1 1 auto;
  min-width: 0;
}

.crm6502-date-slot :deep(> div.flex.justify-start.items-center) {
  margin: 0 !important;
  width: 100% !important;
  max-width: 100%;
  min-height: var(--crm6502-row-min-h, 2rem);
  align-items: center;
}

.crm6502-date-slot :deep(> div.flex.justify-start.items-center > div) {
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  width: 100%;
  max-width: 100%;
  min-width: 0;
}

.crm6502-date-slot :deep(input[type="date"]) {
  box-sizing: border-box;
  flex: 1 1 0;
  width: auto !important;
  min-width: 0;
  max-width: none;
  height: var(--crm6502-control-h, 2rem);
  min-height: var(--crm6502-control-h, 2rem);
  max-height: var(--crm6502-control-h, 2rem);
  border: 1px solid var(--crm6502-control-border, #cbd5e1);
  border-radius: 0.375rem;
  background: #fff;
}

.crm6502-date-slot :deep(input[type="date"]:focus) {
  border-color: #3b82f6;
}

.crm6502-date-slot :deep(div.inline-flex.h-8),
.crm6502-date-slot :deep(button) {
  height: var(--crm6502-control-h, 2rem) !important;
  min-height: var(--crm6502-control-h, 2rem) !important;
}

.crm6502-right-store {
  position: relative;
  z-index: 4;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: end;
  gap: 0.4rem;
  width: 100%;
  max-width: 54.6rem;
  min-width: 0;
  overflow: visible;
}

.crm6502-pick-wrap {
  position: relative;
  z-index: 1;
  min-width: 0;
  width: 100%;
}

.crm6502-right-store:has(.psp-popup),
.crm6502-right-store:has(.psp-store-hover-list) {
  z-index: 50;
}

.crm6502-right-store :deep(.psp-root) {
  grid-template-columns:
    var(--psp-label-w, 5rem)
    minmax(var(--psp-radio-w, 4.75rem), auto)
    minmax(0, 1.05fr)
    minmax(0, 1.3fr)
    minmax(0, 1.35fr);
  column-gap: var(--psp-col-gap, 0.5rem);
  row-gap: var(--crm6502-row-gap, 0.75rem);
  width: 100%;
  max-width: 100%;
  min-width: 0;
}

.crm6502-right-store :deep(.psp-label) {
  width: var(--psp-label-w, 5rem);
  justify-content: flex-start;
  padding-inline-start: 0;
  font-size: 0.9375rem;
  font-weight: 600;
}

.crm6502-right-store :deep(.psp-select),
.crm6502-right-store :deep(.psp-store-trigger),
.crm6502-right-store :deep(.psp-collapse-btn) {
  height: var(--crm6502-control-h, 2rem) !important;
  min-height: var(--crm6502-control-h, 2rem) !important;
}

.crm6502-right-store :deep(.psp-collapse-btn) {
  width: var(--crm6502-control-h, 2rem) !important;
}

.crm6502-right-store :deep(.psp-popup) {
  z-index: 60;
  right: 0;
  left: auto;
  width: min(42rem, 92vw);
  min-width: 28rem;
  max-width: min(42rem, 92vw);
}

.crm6502-check-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--crm6502-item-gap, 0.75rem);
  min-width: 0;
  min-height: var(--crm6502-row-min-h, 2rem);
  margin-top: var(--crm6502-row-gap, 0.75rem);
}

.crm6502-checks {
  display: flex;
  flex: 1 1 auto;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 0.875rem;
  min-width: 0;
  min-height: var(--crm6502-row-min-h, 2rem);
}

.crm6502-check-item {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  min-height: var(--crm6502-row-min-h, 2rem);
  font-size: 0.875rem;
  font-weight: 500;
  color: rgb(30 41 59);
  white-space: nowrap;
  cursor: pointer;
}

.crm6502-check-item input {
  width: 1rem;
  height: 1rem;
  accent-color: #2563eb;
}

@media (max-width: 1280px) {
  .crm6502-search-layout {
    grid-template-columns: minmax(0, 1fr);
    row-gap: var(--crm6502-row-gap, 0.75rem);
    align-items: start;
  }

  .crm6502-left-stack {
    width: 100%;
  }

  .crm6502-row--pair {
    flex-wrap: wrap;
  }

  .crm6502-select {
    width: min(var(--crm6502-select-w, 9.5rem), 100%);
  }

  .crm6502-date-slot :deep(> div.flex.justify-start.items-center) {
    width: 100% !important;
  }

  .crm6502-right-store :deep(.psp-popup) {
    left: 0;
    right: auto;
  }
}
</style>
