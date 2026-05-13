<!-- /*--############################################################################
# Filename : CRM10_022RPT.vue                                                  
# Description : 고객관리 > 고객 예약 관리 > 예약조회.                          
# Date :2025-05-21                                                             
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <!-- 조회조건 -->
  <div class="flex h-full min-h-0 flex-col" @click="handleParentClick">
    <div
      class="flex shrink-0 items-center justify-between gap-3 overflow-y-hidden pr-1">
      <PageName></PageName>
      <div class="flex shrink-0 items-center justify-end space-x-2 pr-5">
        <button type="button" class="button search md:w-auto w-14" @click="searchButton">
          조회
        </button>
        <button type="button" class="button save w-auto excel" @click="excelButton">
          엑셀
        </button>
      </div>
    </div>

    <div
      class="crm10-search-panel z-10 mt-3 w-full max-w-[min(100%,1680px)] min-w-0 shrink-0 self-center overflow-x-auto rounded-md border border-slate-500/70 bg-gradient-to-b from-violet-100 via-purple-50/95 to-slate-100 shadow-sm">
      <div
        class="crm10-search-body min-w-0 text-slate-800"
        :style="{ '--crm10-control-border': crm10ControlBorder }">
        <!-- 1행: 매장명 · 매장 · 접수일 -->
        <div
          class="crm10-search-row crm10-row-store flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-slate-500/45 px-4 py-2.5 sm:px-5">
          <div class="crm10-label-slot shrink-0">
            <span class="crm10-lbl">매장명</span>
          </div>
          <div class="crm10-pick-slot min-w-0 flex-1 basis-0 sm:max-w-[22rem]">
            <PickStore
              compact-search-bar
              :compact-store-combo-max-rem="20"
              main-name=""
              :default-store-nm="'전체'"
              :hide-group="false"
              :hide-attr="false"
              @update:store-cd="lngStoreCode"
              @update:store-group="lngStoreGroup"
              @store-nm="excelStore"></PickStore>
          </div>
          <div class="crm10-pair flex shrink-0 flex-nowrap items-center gap-x-2">
            <div class="crm10-label-slot shrink-0">
              <span class="crm10-lbl">접수일</span>
            </div>
            <div class="crm10-date-slot min-w-0">
              <Datepicker2
                ref="datepicker"
                :main-name="'접수일'"
                omit-main-label
                filter-bar-align
                :init-today="1"
                :close-pop-up="closePopUp"
                @end-date="endDate"
                @excel-date="excelDate"
                @start-date="startDate"></Datepicker2>
            </div>
          </div>
        </div>

        <!-- 2행: 상태 · 고객명 · 전화번호 -->
        <div
          class="crm10-search-row crm10-row-rest flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2.5 sm:px-5">
          <div class="crm10-pair flex shrink-0 flex-nowrap items-center gap-x-2">
            <div class="crm10-label-slot shrink-0">
              <span class="crm10-lbl">상태</span>
            </div>
            <select
              id="crm10-022-status"
              v-model="status"
              class="crm10-select h-8 min-h-8 w-36 shrink-0 rounded-md border border-solid bg-white px-2 text-sm text-slate-800">
              <option value="99">전체</option>
              <option value="0">예약</option>
              <option value="1">방문</option>
              <option value="2">대기</option>
              <option value="3">입장</option>
              <option value="4">취소</option>
              <option value="5">NO SHOW</option>
            </select>
          </div>

          <div class="crm10-pair flex shrink-0 flex-nowrap items-center gap-x-2">
            <div class="crm10-label-slot shrink-0">
              <span class="crm10-lbl">고객명</span>
            </div>
            <input
              v-model="cond"
              type="text"
              autocomplete="off"
              class="crm10-input h-8 min-h-8 w-[11rem] max-w-[min(100%,14rem)] shrink-0 rounded-md border border-solid bg-white px-2 text-sm text-slate-800" />
          </div>

          <div class="crm10-pair flex min-w-0 shrink-0 flex-nowrap items-center gap-x-2">
            <div class="crm10-label-slot shrink-0">
              <span class="crm10-lbl">전화번호</span>
            </div>
            <div class="crm10-phone-val flex min-w-0 flex-nowrap items-center gap-x-1.5">
              <input
                v-model="cond2"
                type="text"
                inputmode="numeric"
                autocomplete="off"
                class="crm10-input h-8 min-h-8 w-[7.5rem] shrink-0 rounded-md border border-solid bg-white px-2 text-sm text-slate-800" />
              <span class="crm10-hint shrink-0 text-xs font-medium text-slate-600">(뒷4자리)</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 그리드 -->
    <div
      class="crm10-grid-shell mx-auto mt-2 flex min-h-0 min-w-0 w-full max-w-[min(100%,1680px)] flex-1 flex-col basis-0 overflow-hidden px-1 pb-1">
      <div
        class="crm10-main-grid-frame flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden rounded-sm border border-gray-400 bg-white">
        <div class="relative min-h-0 w-full flex-1">
          <Realgrid
            :progname="'CRM10_022RPT_VUE'"
            :progid="1"
            :rowData="rowData"
            :reload="reload"
            :setStateBar="false"
            :documentTitle="'CRM10_022RPT'"
            :dynamicRowHeight="true"
            :documentSubTitle="documentSubTitle"
            :rowStateeditable="false"
            :exporttoExcel="exportExcel">
          </Realgrid>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getReservedSearch } from "@/api/micrm";
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
const crm10ControlBorder = "#cbd5e1";

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

onMounted(async () => {
  await insertPageLog(store.state.activeTab2);
});
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
    // initGrid();

    const res = await getReservedSearch(
      selectedGroup.value,
      selectedStores.value,
      startdate.value,
      enddate.value,
      status.value,
      cond.value,
      cond2.value
    );
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
  cond.value = "";
  cond2.value = "";
  status.value = 99;
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
.crm10-main-grid-frame {
  min-height: min(65vh, 420px);
}

@media (max-height: 800px) {
  .crm10-main-grid-frame {
    min-height: min(52vh, 300px);
  }
}

.crm10-lbl {
  display: flex;
  min-width: 0;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(30 41 59);
  text-align: center;
  white-space: nowrap;
}

.crm10-label-slot {
  display: grid;
  min-width: 0;
  min-height: 2rem;
  align-items: center;
  grid-template-columns: minmax(5.25rem, 6.75rem);
}

.crm10-pick-slot :deep(> div.flex.text-base > div.shrink-0:first-child) {
  display: none;
}

.crm10-date-slot :deep(> div.flex.justify-start.items-center) {
  min-height: 2rem;
  align-items: center;
}

.crm10-search-panel .crm10-input,
.crm10-search-panel .crm10-select {
  border: 1px solid var(--crm10-control-border) !important;
  box-sizing: border-box;
}

.crm10-search-panel .crm10-input:focus,
.crm10-search-panel .crm10-select:focus {
  border-color: #3b82f6 !important;
  outline: none;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.35);
}

.crm10-search-panel .crm10-date-slot :deep(input[type="date"]) {
  border: 1px solid var(--crm10-control-border) !important;
  box-sizing: border-box;
}

.crm10-search-panel .crm10-date-slot :deep(input[type="date"]:focus) {
  border-color: #3b82f6 !important;
}

.crm10-pick-slot {
  width: 100%;
  min-width: 0;
}

.crm10-pick-slot :deep(select) {
  border: 1px solid var(--crm10-control-border) !important;
}

.crm10-pick-slot :deep(select:focus) {
  border-color: #3b82f6 !important;
}

.crm10-pick-slot :deep(.pickstore-vs-shell) {
  border: 1px solid var(--crm10-control-border) !important;
}

.crm10-pick-slot :deep(> div.flex.text-base) {
  width: 100%;
  min-width: 0;
}

@media (max-height: 900px) {
  .crm10-search-panel {
    margin-top: 0.25rem !important;
  }

  .crm10-search-row {
    padding-top: 0.5rem !important;
    padding-bottom: 0.5rem !important;
  }
}
</style>
