<!-- /*--############################################################################
# Filename : CRM65_001RPT.vue
# Description : 고객관리 > 전자상품권 현황 > 전자상품권 원장
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
      class="crm6501-search-panel z-10 mt-3 w-full min-h-0 shrink-0 overflow-visible rounded-lg bg-gray-200"
      :style="{
        '--crm6501-control-border': crm6501ControlBorder,
        '--crm6501-col-gap': crm6501ColGutter,
        '--crm6501-item-gap': crm6501ItemGap,
        '--crm6501-row-gap': crm6501RowGap,
        '--crm6501-label-col': crm6501LabelCol,
        '--crm6501-panel-pad-x': crm6501PanelPadX,
        '--crm6501-control-h': crm6501ControlH,
        '--crm6501-row-min-h': crm6501RowMinH,
      }">
      <!--
        3열 동일 그리드(행 간 열·라벨 시작선 정렬)
        row1: 생성일자 | 상품권구분 | 회수일자(+checkbox)
        row2: 권종 | 상품권상태 | 상품권번호
      -->
      <div class="crm6501-search-grid min-w-0">
        <div class="crm6501-cell crm6501-cell--date">
          <div class="crm6501-lbl">생성일자</div>
          <div class="crm6501-field crm6501-date-slot min-w-0">
            <Datepicker2
              ref="datepicker"
              :main-name="'생성일자'"
              omit-main-label
              filter-bar-align
              :close-pop-up="closePopUp"
              @excel-date="excelDate"
              @start-date="startDate"
              @end-date="endDate"></Datepicker2>
          </div>
        </div>

        <div class="crm6501-cell">
          <div class="crm6501-lbl">상품권구분</div>
          <div class="crm6501-field min-w-0">
            <select v-model="cond" class="crm6501-select">
              <option value="0">전체</option>
              <option
                v-for="i in optionList"
                :key="i.lngGftCategory"
                :value="i.lngGftCategory">
                {{ i.strGftCategory }}
              </option>
            </select>
          </div>
        </div>

        <div class="crm6501-cell crm6501-cell--recover">
          <div class="crm6501-lbl">회수일자</div>
          <div class="crm6501-field crm6501-recover-field min-w-0">
            <button
              type="button"
              class="crm6501-check"
              :class="{ 'is-on': cond2 }"
              :aria-pressed="cond2 ? 'true' : 'false'"
              title="회수일자 사용"
              aria-label="회수일자 사용"
              @click.stop="cond2 = !cond2">
              <svg
                v-show="cond2"
                class="crm6501-check-mark"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false">
                <path
                  d="M5 13l4 4L19 7"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
            </button>
            <div class="crm6501-date-slot min-w-0 flex-1">
              <Datepicker2
                :main-name="'회수일자'"
                omit-main-label
                filter-bar-align
                :close-pop-up="closePopUp"
                @start-date="startDate2"
                @end-date="endDate2"></Datepicker2>
            </div>
          </div>
        </div>

        <div class="crm6501-cell">
          <div class="crm6501-lbl">권종</div>
          <div class="crm6501-field min-w-0">
            <select v-model="cond3" class="crm6501-select">
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

        <div class="crm6501-cell">
          <div class="crm6501-lbl">상품권상태</div>
          <div class="crm6501-field min-w-0">
            <select v-model="cond4" class="crm6501-select">
              <option value="0">전체</option>
              <option
                v-for="i in optionList3"
                :key="i.strDCode"
                :value="i.strDCode">
                {{ i.strDName }}
              </option>
            </select>
          </div>
        </div>

        <div class="crm6501-cell">
          <div class="crm6501-lbl">상품권번호</div>
          <div class="crm6501-field min-w-0">
            <input v-model="cond5" type="text" class="crm6501-input" />
          </div>
        </div>
      </div>
    </div>

    <div class="mt-2 flex min-h-0 min-w-0 flex-1 flex-col">
      <div class="relative min-h-0 w-full flex-1">
        <Realgrid
          class="h-full min-h-0 w-full"
          :progname="'CRM65_001RPT_VUE'"
          :progid="1"
          :rowData="rowData"
          :reload="reload"
          hyphen-date-mask-as-text
          :documentTitle="'CRM65_001RPT'"
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
import {
  getGftLedgerList,
  getInitGftData,
  getPrePaidbyAccount,
} from "@/api/micrm";
import Datepicker2 from "@/components/Datepicker2.vue";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
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

import { onMounted, ref } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";

const store = useStore();
const crm6501ControlBorder = "#cbd5e1";
const crm6501ColGutter = "1.5rem";
const crm6501ItemGap = "0.75rem";
const crm6501RowGap = "0.75rem";
/** 가장 긴 라벨(상품권구분·상태·번호) 기준 — 전 열 동일 */
const crm6501LabelCol = "5.5rem";
const crm6501PanelPadX = "2rem";
const crm6501ControlH = "2rem";
const crm6501RowMinH = "2rem";

/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getCommonList(254);

  optionList3.value = res.data.List;
  const res2 = await getInitGftData(store.state.userData.lngStoreGroup);
  ////console.log(res2);
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
const cond4 = ref(0);
const cond5 = ref("");
const optionList = ref([]);
const optionList2 = ref([]);
const optionList3 = ref([]);
const datepicker = ref(null);
const closePopUp = ref(false);
const custId = ref("");
const strSaleCustID = (e) => {
  initGrid();
  custId.value = e;
};
const custNm = ref("");
const strSaleCustName = (e) => {
  custNm.value = e;
};
const sd = ref("");
const sd2 = ref("");
const ed = ref("");
const ed2 = ref("");
const selectedDate = ref("");
const startDate = (e) => {
  sd.value = e;
};
const endDate = (e) => {
  ed.value = e;
};
const startDate2 = (e) => {
  sd2.value = e;
};
const endDate2 = (e) => {
  ed2.value = e;
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
      text: "생성일자을 선택하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (cond2.value == false) {
    if (sd2.value == null || ed2.value == null) {
      Swal.fire({
        title: "경고",
        text: "생성일자을 선택하세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }
  }
  try {
    store.state.loading = true;
    initGrid();

    const res = await getGftLedgerList(
      store.state.userData.lngStoreGroup,
      sd.value,
      ed.value,
      cond.value,
      cond3.value,
      cond4.value,
      cond5.value,
      cond2.value == true ? 1 : 0,
      sd2.value,
      ed2.value
    );
    ////console.log(res);
    rowData.value = res.data.List;

    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    //comsole.log(error);
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
.crm6501-search-panel {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  padding-block: 0.75rem;
  padding-left: var(--crm6501-panel-pad-x, 2rem);
  padding-right: var(--crm6501-panel-pad-x, 2rem);
  overflow-x: visible;
}

.crm6501-search-grid {
  box-sizing: border-box;
  display: grid;
  width: 100%;
  min-width: 0;
  align-items: center;
  column-gap: var(--crm6501-col-gap, 1.5rem);
  row-gap: var(--crm6501-row-gap, 0.75rem);
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.crm6501-cell {
  box-sizing: border-box;
  display: grid;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  min-height: var(--crm6501-row-min-h, 2rem);
  grid-template-columns: var(--crm6501-label-col, 5.5rem) minmax(0, 1fr);
  column-gap: var(--crm6501-item-gap, 0.75rem);
  align-items: center;
}

.crm6501-lbl {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  min-height: var(--crm6501-row-min-h, 2rem);
  font-size: 0.9375rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
  white-space: nowrap;
}

.crm6501-field {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  min-height: var(--crm6501-row-min-h, 2rem);
}

.crm6501-recover-field {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  min-width: 0;
}

.crm6501-recover-field .crm6501-date-slot {
  position: relative;
  z-index: 1;
  min-width: 0;
}

.crm6501-check {
  box-sizing: border-box;
  position: relative;
  z-index: 5;
  display: inline-flex;
  flex: 0 0 1.15rem;
  align-items: center;
  justify-content: center;
  width: 1.15rem;
  height: 1.15rem;
  margin: 0;
  padding: 0;
  cursor: pointer;
  color: #fff;
  background: #fff;
  border: 1.5px solid #64748b;
  border-radius: 0.2rem;
}

.crm6501-check.is-on {
  background: #2563eb;
  border-color: #2563eb;
}

.crm6501-check-mark {
  display: block;
  width: 0.85rem;
  height: 0.85rem;
}

.crm6501-select,
.crm6501-input {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  height: var(--crm6501-control-h, 2rem);
  min-height: var(--crm6501-control-h, 2rem);
  max-height: var(--crm6501-control-h, 2rem);
  padding: 0 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: rgb(30 41 59);
  background: #fff;
  border: 1px solid var(--crm6501-control-border, #cbd5e1);
  border-radius: 0.375rem;
}

.crm6501-select:focus,
.crm6501-input:focus {
  border-color: #3b82f6;
  outline: none;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.35);
}

.crm6501-date-slot {
  min-width: 0;
  width: 100%;
  max-width: 100%;
}

.crm6501-date-slot :deep(> div.flex.justify-start.items-center) {
  margin: 0 !important;
  width: 100% !important;
  max-width: 100%;
  min-width: 0;
  min-height: var(--crm6501-row-min-h, 2rem);
  align-items: center;
}

.crm6501-date-slot :deep(> div.flex.justify-start.items-center > div) {
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  width: 100%;
  max-width: 100%;
  min-width: 0;
}

.crm6501-date-slot :deep(input[type="date"]) {
  box-sizing: border-box;
  flex: 1 1 0;
  width: 0 !important;
  min-width: 0;
  max-width: 100%;
  height: var(--crm6501-control-h, 2rem);
  min-height: var(--crm6501-control-h, 2rem);
  max-height: var(--crm6501-control-h, 2rem);
  border: 1px solid var(--crm6501-control-border, #cbd5e1);
  border-radius: 0.375rem;
  background: #fff;
}

.crm6501-date-slot :deep(input[type="date"]:focus) {
  border-color: #3b82f6;
}

.crm6501-date-slot :deep(button) {
  flex: 0 0 auto;
  height: var(--crm6501-control-h, 2rem) !important;
  min-height: var(--crm6501-control-h, 2rem) !important;
}

@media (max-width: 1100px) {
  .crm6501-search-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
