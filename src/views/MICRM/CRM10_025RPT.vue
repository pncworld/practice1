/*--############################################################################
# Filename : CRM10_025RPT.vue
# Description : 고객관리 > 고객 예약 관리 > 예약고객명단.
# Date :2025-05-22
# Author : 권맑음
################################################################################*/
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
      class="crm10025-search-panel z-10 mt-3 w-full min-h-0 shrink-0 overflow-visible rounded-lg bg-gray-200"
      :style="{
        '--crm10025-control-border': crm10025ControlBorder,
        '--crm10025-col-gap': crm10025ColGutter,
        '--crm10025-item-gap': crm10025ItemGap,
        '--crm10025-row-gap': crm10025RowGap,
        '--crm10025-label-col': crm10025LabelCol,
      }">
      <!--
        1행 매장명 · 2행 예약일|상태|고객명|전화번호
        앞뒤 pad 동일 · 항목 사이 1fr 균등 · 매장=예약일 필드 끝선
      -->
      <div class="crm10025-search-body min-w-0">
        <div class="crm10025-row crm10025-row-store min-w-0">
          <div class="crm10025-lbl">매장명</div>
          <div class="crm10025-field crm10025-pick-slot min-w-0 overflow-visible">
            <PickStore
              compact-search-bar
              main-name=""
              :hide-group="false"
              :hide-attr="false"
              :default-store-nm="'전체'"
              @update:store-cd="lngStoreCode"
              @update:store-group="lngStoreGroup"
              @store-nm="excelStore"></PickStore>
          </div>
        </div>

        <div class="crm10025-row crm10025-row-filters min-w-0">
          <div class="crm10025-cell crm10025-cell--date">
            <div class="crm10025-lbl">예약일</div>
            <div class="crm10025-field crm10025-date-slot min-w-0">
              <Datepicker2
                ref="datepicker"
                :main-name="'예약일'"
                omit-main-label
                filter-bar-align
                :init-today="1"
                :close-pop-up="closePopUp"
                @end-date="endDate"
                @excel-date="excelDate"
                @start-date="startDate"></Datepicker2>
            </div>
          </div>
          <div class="crm10025-gutter" aria-hidden="true"></div>
          <div class="crm10025-cell crm10025-cell--status">
            <div class="crm10025-lbl">상태</div>
            <div class="crm10025-field min-w-0">
              <select v-model="status" class="crm10025-select">
                <option value="99">전체</option>
                <option value="0">예약</option>
                <option value="1">방문</option>
                <option value="2">대기</option>
                <option value="3">입장</option>
                <option value="4">취소</option>
                <option value="5">NO SHOW</option>
              </select>
            </div>
          </div>
          <div class="crm10025-gutter" aria-hidden="true"></div>
          <div class="crm10025-cell crm10025-cell--name">
            <div class="crm10025-lbl">고객명</div>
            <div class="crm10025-field crm10025-field--name min-w-0">
              <input
                v-model="cond"
                type="text"
                autocomplete="off"
                class="crm10025-input crm10025-input--name" />
            </div>
          </div>
          <div class="crm10025-gutter" aria-hidden="true"></div>
          <div class="crm10025-cell crm10025-cell--phone">
            <div class="crm10025-lbl">전화번호</div>
            <div class="crm10025-field crm10025-phone-field min-w-0">
              <input
                v-model="cond2"
                type="text"
                inputmode="numeric"
                autocomplete="off"
                class="crm10025-input crm10025-input--phone" />
              <span class="crm10025-hint">(뒷4자리)</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-2 flex min-h-0 min-w-0 flex-1 flex-col">
      <div class="relative min-h-0 w-full flex-1">
        <Realgrid
          class="h-full min-h-0 w-full"
          :progname="'CRM10_025RPT_VUE'"
          :progid="1"
          :rowData="rowData"
          :reload="reload"
          :setStateBar="false"
          :documentTitle="'CRM10_025RPT'"
          :documentSubTitle="documentSubTitle"
          :rowStateeditable="false"
          :dynamicRowHeight="true"
          :exporttoExcel="exportExcel">
        </Realgrid>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getReservedCustomorSearch } from "@/api/micrm";
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
const crm10025ControlBorder = "#cbd5e1";
const crm10025ColGutter = "1.5rem";
const crm10025ItemGap = "0.75rem";
const crm10025RowGap = "0.875rem";
const crm10025LabelCol = "5rem";

/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
});

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

const cond = ref("");
const cond2 = ref("");
const status = ref(99);
const datepicker = ref(null);
const closePopUp = ref(false);
const custId = ref("");
const strSaleCustID = (e) => {
  custId.value = e;
  initGrid();
};
const custNm = ref("");
const strSaleCustName = (e) => {
  custNm.value = e;
};

const startdate = ref("");
const startDate = (e) => {
  startdate.value = e;
};
const enddate = ref("");
const endDate = (e) => {
  enddate.value = e;
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
  // if (selectedStores.value == 0) {
  //   Swal.fire({
  //     title: "경고",
  //     text: "매장명을 먼저 선택하세요.",
  //     icon: "warning",
  //     confirmButtonText: "확인",
  //   });
  //   return;
  // }
  try {
    store.state.loading = true;
    //initGrid();

    const res = await getReservedCustomorSearch(
      selectedGroup.value,
      selectedStores.value,
      startdate.value,
      enddate.value,
      status.value,
      cond.value,
      cond2.value
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
const lngStoreGroup = async (e) => {
  //initGrid();
  selectedGroup.value = e;
  ////console.log(e);
};

/**
 * 그리드 초기화
 */

const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
  status.value = 99;
  cond.value = "";
  cond2.value = "";
};

//엑셀 버튼 처리 함수
const exportExcel = ref(false);
/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  documentSubTitle.value =
    selectedExcelStore.value + "\n" + selectedExcelDate.value;

  //documentSubTitle.value += "\n";
  exportExcel.value = !exportExcel.value;
};

// 엑셀 추출
const documentSubTitle = ref("");
const selectedExcelList = ref("");
const selectedExcelDate = ref("");

const selectedExcelStore = ref("");
/**
 * 엑셀용 매장 세팅 함수
 */

const excelStore = (e) => {
  selectedExcelStore.value = "매장명 : " + e;
  //comsole.log(e);
};
const excelDate = (e) => {
  selectedExcelDate.value = e;
  //comsole.log(e);
};
</script>

<style scoped>
.crm10025-search-panel {
  --crm10025-panel-pad-x: 2rem;
  --crm10025-row-min-h: 2rem;
  --crm10025-control-h: 2rem;
  --crm10025-left-field-w: calc(
    9rem + 9rem + 2rem + 0.125rem * 3 + 0.125rem + 0.9rem
  );
  --crm10025-short-field-w: calc(var(--crm10025-left-field-w) * 0.6);
  --crm10025-status-w: 9rem;
  box-sizing: border-box;
  padding-left: 0;
  padding-right: 0;
  padding-block: 0.75rem;
  overflow: visible;
}

.crm10025-search-body {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  row-gap: var(--crm10025-row-gap, 0.875rem);
  padding-left: var(--crm10025-panel-pad-x);
  padding-right: var(--crm10025-panel-pad-x);
}

.crm10025-row-store {
  display: grid;
  grid-template-columns:
    var(--crm10025-label-col, 5rem)
    minmax(0, var(--crm10025-left-field-w));
  column-gap: var(--crm10025-item-gap, 0.75rem);
  align-items: center;
  width: max-content;
  max-width: 100%;
  min-width: 0;
  min-height: var(--crm10025-row-min-h);
}

.crm10025-row-filters {
  display: grid;
  grid-template-columns:
    max-content
    minmax(var(--crm10025-col-gap, 1.5rem), 1fr)
    max-content
    minmax(var(--crm10025-col-gap, 1.5rem), 1fr)
    max-content
    minmax(var(--crm10025-col-gap, 1.5rem), 1fr)
    max-content;
  align-items: center;
  width: 100%;
  min-width: 0;
}

.crm10025-gutter {
  min-width: 0;
  pointer-events: none;
}

.crm10025-cell {
  display: grid;
  grid-template-columns: var(--crm10025-label-col, 5rem) max-content;
  column-gap: var(--crm10025-item-gap, 0.75rem);
  align-items: center;
  width: max-content;
  max-width: 100%;
  min-width: 0;
  min-height: var(--crm10025-row-min-h);
}

.crm10025-cell--date {
  grid-template-columns:
    var(--crm10025-label-col, 5rem)
    minmax(0, var(--crm10025-left-field-w));
}

.crm10025-cell--date .crm10025-date-slot,
.crm10025-row-store .crm10025-pick-slot {
  width: 100%;
  max-width: var(--crm10025-left-field-w);
}

.crm10025-lbl {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: var(--crm10025-row-min-h);
  font-size: 0.9375rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
  text-align: center;
  white-space: nowrap;
}

.crm10025-field {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  min-height: var(--crm10025-row-min-h);
  display: flex;
  align-items: center;
}

.crm10025-input,
.crm10025-select {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  height: var(--crm10025-control-h);
  min-height: var(--crm10025-control-h);
  max-height: var(--crm10025-control-h);
  padding: 0 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: rgb(30 41 59);
  background: #fff;
  border: 1px solid var(--crm10025-control-border, #cbd5e1);
  border-radius: 0.375rem;
}

.crm10025-select {
  width: var(--crm10025-status-w);
  max-width: var(--crm10025-status-w);
  flex: 0 0 auto;
}

.crm10025-field--name {
  width: var(--crm10025-short-field-w);
  max-width: var(--crm10025-short-field-w);
  justify-content: flex-start;
}

.crm10025-input--name,
.crm10025-input--phone {
  flex: 0 0 auto;
  width: var(--crm10025-short-field-w);
  max-width: var(--crm10025-short-field-w);
  min-width: 0;
}

.crm10025-input:focus,
.crm10025-select:focus {
  border-color: #3b82f6;
  outline: none;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.35);
}

.crm10025-phone-field {
  flex-wrap: nowrap;
  width: max-content;
  max-width: 100%;
  gap: 0.375rem;
}

.crm10025-hint {
  flex-shrink: 0;
  font-size: 0.75rem;
  font-weight: 500;
  color: rgb(71 85 105);
  white-space: nowrap;
}

.crm10025-date-slot :deep(> div.flex.justify-start.items-center) {
  margin: 0 !important;
  width: 100% !important;
  max-width: 100%;
  min-height: var(--crm10025-row-min-h);
  align-items: center;
}

.crm10025-date-slot :deep(input[type="date"]) {
  box-sizing: border-box;
  height: var(--crm10025-control-h);
  min-height: var(--crm10025-control-h);
  max-height: var(--crm10025-control-h);
  border: 1px solid var(--crm10025-control-border, #cbd5e1);
  border-radius: 0.375rem;
  background: #fff;
}

.crm10025-date-slot :deep(input[type="date"]:focus) {
  border-color: #3b82f6;
}

.crm10025-date-slot :deep(div.inline-flex.h-8),
.crm10025-date-slot :deep(button) {
  height: var(--crm10025-control-h) !important;
  min-height: var(--crm10025-control-h) !important;
}

.crm10025-pick-slot :deep(> div.flex.text-base > div.shrink-0:first-child) {
  display: none;
}

.crm10025-pick-slot {
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;
  max-width: 100%;
}

.crm10025-pick-slot > :deep(*) {
  width: 100% !important;
  min-width: 0 !important;
  max-width: 100% !important;
}

.crm10025-pick-slot :deep(> div.flex.text-base) {
  margin: 0 !important;
  width: 100% !important;
  min-width: 0 !important;
  max-width: 100% !important;
  flex-wrap: nowrap;
  align-items: center;
  gap: 0 !important;
  justify-content: flex-start !important;
}

.crm10025-pick-slot :deep(> div.flex.text-base > div.relative),
.crm10025-pick-slot :deep(.relative.min-w-0.flex-1) {
  flex: 1 1 auto !important;
  width: 100% !important;
  min-width: 0 !important;
  max-width: 100% !important;
}

.crm10025-pick-slot :deep(.pickstore-vs-shell) {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important;
  box-sizing: border-box;
  height: var(--crm10025-control-h) !important;
  min-height: var(--crm10025-control-h) !important;
  max-height: var(--crm10025-control-h) !important;
  border: 1px solid var(--crm10025-control-border, #cbd5e1) !important;
}

.crm10025-pick-slot :deep(.style-chooser),
.crm10025-pick-slot :deep(.vs__dropdown-toggle) {
  width: 100% !important;
  box-sizing: border-box;
  height: var(--crm10025-control-h) !important;
  min-height: var(--crm10025-control-h) !important;
  max-height: var(--crm10025-control-h) !important;
}

@media (max-width: 1100px) {
  .crm10025-row-filters {
    grid-template-columns: max-content;
    justify-content: start;
    row-gap: var(--crm10025-row-gap, 0.875rem);
  }

  .crm10025-gutter {
    display: none;
  }
}
</style>
