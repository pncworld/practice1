/*--############################################################################
# Filename : CRM10_023RPT.vue                                                  
# Description : 고객관리 > 고객 예약 관리 > 일별 예약현황.                      
# Date :2025-05-22                                                             
# Author : 권맑음                     
################################################################################*/
<template>
  <div class="flex h-full min-h-0 flex-col" @click="handleParentClick">
    <div
      class="flex shrink-0 items-center justify-between gap-3 overflow-y-hidden pr-1">
      <PageName />
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
      class="crm10-search-panel z-10 mt-3 w-full max-w-[min(100%,1680px)] min-w-0 shrink-0 self-center overflow-x-auto rounded-lg bg-gray-200 px-5 py-3 sm:px-8 md:px-12 lg:px-14 xl:py-3.5 2xl:px-16">
      <div
        class="crm10-search-body min-w-0 text-slate-800"
        :style="{ '--crm10-control-border': crm10ControlBorder }">
        <div
          class="crm10-search-row crm10-row-store flex flex-wrap items-center gap-x-3 gap-y-2">
          <div class="crm10-label-slot shrink-0">
            <span class="crm10-lbl">매장명</span>
          </div>
          <div class="crm10-pick-slot min-w-0 flex-1 basis-0 sm:max-w-[22rem]">
            <PickStore
              compact-search-bar
              :compact-store-combo-max-rem="20"
              main-name=""
              :hide-group="false"
              :hide-attr="false"
              :default-store-nm="'선택'"
              @update:store-cd="lngStoreCode"
              @update:store-group="lngStoreGroup"
              @store-nm="excelStore" />
          </div>
          <div class="crm10-pair flex shrink-0 flex-nowrap items-center gap-x-2">
            <div class="crm10-label-slot shrink-0">
              <span class="crm10-lbl">예약일</span>
            </div>
            <div class="crm10-date-slot min-w-0">
              <Datepicker2
                ref="datepicker"
                :main-name="'예약일'"
                omit-main-label
                filter-bar-align
                :init-today="1"
                :close-pop-up="closePopUp"
                @end-date="endDate"
                @start-date="startDate"
                @excel-date="excelDate" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="crm10-grid-shell mx-auto mt-2 flex min-h-0 min-w-0 w-full max-w-[min(100%,1680px)] flex-1 flex-col basis-0 overflow-hidden px-1 pb-1">
      <div
        class="crm10-main-grid-frame flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden rounded-sm border border-gray-400 bg-white">
        <div class="relative min-h-0 w-full flex-1">
          <Realgrid
            :key="`crm10-023-grid-${gridProgid}-${gridHeaderKey}`"
            :progname="'CRM10_023RPT_VUE'"
            :progid="gridProgid"
            :rowData="rowData"
            :reload="reload"
            :setStateBar="false"
            :documentTitle="'CRM10_023RPT'"
            :documentSubTitle="documentSubTitle"
            :rowStateeditable="false"
            :mergeColumns2="true"
            :mergeColumnGroupName2="mergeGroupName"
            :mergeColumnGroupSubList2="mergeSubList"
            :merge-column-width-scale2="crm10StoreColumnWidthScale"
            :weekday-holiday-style-columns="['strDate', 'strDayOfTheWeek']"
            weekday-holiday-date-field="strDate"
            :setFooterCustomColumnId="['strDate']"
            :setFooterCustomText="['합계']"
            :setFooter="true"
            :exporttoExcel="exportExcel" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getReservedSearchByDays } from "@/api/micrm";
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

import { computed, onMounted, ref } from "vue";
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

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);
const selectedStoreNm = ref("");
const crm10ControlBorder = "#cbd5e1";/** 조회 후 그리드 merge 헤더 1열(매장) 표기명 */
const searchedStoreName = ref("매장");
const gridHeaderKey = ref(0);

const CRM10_023_DEFAULT_STORE_HEADER = "매장";
/** 매장 merge 하위 컬럼(일자·요일) — MSTGRIDINFO 너비 대비 10% 확대 */
const crm10StoreColumnWidthScale = {
  strDate: 1.1,
  strDayOfTheWeek: 1.1,
};

function crm10BuildMergeGroupNames(baseNames) {
  const label = searchedStoreName.value || CRM10_023_DEFAULT_STORE_HEADER;
  return baseNames.map((name, index) => (index === 0 ? label : name));
}

const mergeColumnGroupName2 = ref([
  CRM10_023_DEFAULT_STORE_HEADER,
  "런치1부",
  "런치2부",
  "디너1부",
  "디너2부",
]);
const mergeColumnGroupSubList2 = ref([
  ["strDate", "strDayOfTheWeek"],
  [
    "lngTime101",
    "lngTime102",
    "lngTime103",
    "lngTime104",
    "lngTime105",
    "lngTime106",
    "lngTime107",
    "lngSubtotal1",
  ],
  [
    "lngTime201",
    "lngTime202",
    "lngTime2025",
    "lngTime203",
    "lngTime204",
    "lngTime205",
    "lngTime206",
    "lngSubtotal2",
  ],
  [
    "lngTime301",
    "lngTime302",
    "lngTime303",
    "lngTime304",
    "lngTime305",
    "lngTime306",
    "lngTime307",
    "lngTime308",
    "lngTime309",
    "lngSubtotal3",
  ],
  [
    "lngTimeD2_1930",
    "lngTime401",
    "lngTime402",
    "lngTime403",
    "lngSubtotal4",
  ],
]);
/** grid 9 — 해운대엘시티점: 매장 + 조식 + 런치/디너 */
const mergeColumnGroupNameGrid9 = ref([
  CRM10_023_DEFAULT_STORE_HEADER,
  "조식",
  "런치1부",
  "런치2부",
  "디너1부",
  "디너2부",
]);
const mergeColumnGroupSubListGrid9 = ref([
  ["strDate", "strDayOfTheWeek"],
  [
    "lngTime001",
    "lngTime002",
    "lngTime003",
    "lngTime004",
    "lngTime005",
    "lngTime006",
    "lngSubtotal0",
  ],
  [
    "lngTime101",
    "lngTime102",
    "lngTime103",
    "lngTime104",
    "lngTime105",
    "lngTime106",
    "lngTime107",
    "lngSubtotal1",
  ],
  [
    "lngTime201",
    "lngTime202",
    "lngTime2025",
    "lngTime203",
    "lngTime204",
    "lngTime205",
    "lngTime206",
    "lngSubtotal2",
  ],
  [
    "lngTime301",
    "lngTime302",
    "lngTime303",
    "lngTime304",
    "lngTime305",
    "lngTime306",
    "lngTime307",
    "lngTime308",
    "lngTime309",
    "lngSubtotal3",
  ],
  [
    "lngTimeD2_1930",
    "lngTime401",
    "lngTime402",
    "lngTime403",
    "lngSubtotal4",
  ],
]);
const store = useStore();
const datepicker = ref(null);const closePopUp = ref(false);

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
  if (selectedStores.value == 0) {
    Swal.fire({
      title: "경고",
      text: "매장명을 먼저 선택하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  try {
    store.state.loading = true;
    //initGrid();

    const sd = startdate.value.replaceAll("-", "");
    const ed = enddate.value.replaceAll("-", "");
    const res = await getReservedSearchByDays(
      selectedGroup.value,
      selectedStores.value,
      sd,
      ed
    );

    searchedStoreName.value =
      (selectedStoreNm.value || "").trim() || CRM10_023_DEFAULT_STORE_HEADER;
    gridHeaderKey.value += 1;
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
/** 마키노차야 해운대엘시티점 — 일별 예약현황 조식 그리드 */
const CRM10_023_BREAKFAST_STORE_CD = "1871021";
const gridProgid = computed(() =>
  String(selectedStores.value) === CRM10_023_BREAKFAST_STORE_CD ? 9 : 1
);
const mergeGroupName = computed(() =>
  gridProgid.value === 9
    ? crm10BuildMergeGroupNames(mergeColumnGroupNameGrid9.value)
    : crm10BuildMergeGroupNames(mergeColumnGroupName2.value)
);
const mergeSubList = computed(() =>
  gridProgid.value === 9
    ? mergeColumnGroupSubListGrid9.value
    : mergeColumnGroupSubList2.value
);

/**
 * 페이지 매장 코드 세팅
 */

const lngStoreCode = async (e) => {
  initGrid();
  selectedStores.value = e;
  searchedStoreName.value = CRM10_023_DEFAULT_STORE_HEADER;
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
  selectedStoreNm.value = e || "";
  selectedExcelStore.value = "매장명 : " + e;
  //comsole.log(e);
};
const excelDate = (e) => {
  selectedExcelDate.value = e;
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
    padding-top: 0.5rem !important;
    padding-bottom: 0.5rem !important;
  }
}
</style>
