/*--############################################################################
# Filename : SLS02_031RPT.vue
# Description : 매출관리 > 당일 매출 조회 > 영수증별 매출 상세현황.
# Date :2025-05-16
# Author : 권맑음
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
      class="sls0231-search-panel z-10 mt-3 w-full min-h-0 shrink-0 overflow-visible rounded-lg bg-gray-200"
      :style="{
        '--sls0231-panel-pad-x': '2rem',
        '--sls0231-control-border': sls0231ControlBorder,
        '--sls0231-col-gutter': sls0231ColGutter,
        '--sls0231-row-gap': sls0231RowGap,
        '--sls0231-label-col': sls0231LabelCol,
        '--psp-label-w': sls0231LabelCol,
        '--psp-radio-w': '4.75rem',
        '--psp-col-gap': '0.5rem',
      }">
      <div class="sls0231-search-layout min-w-0">
        <!-- 좌측: 기간 / 결제코드·메뉴코드 -->
        <div class="sls0231-left-stack min-w-0">
          <div class="sls0231-row">
            <span class="sls0231-lbl shrink-0">기간</span>
            <div class="sls0231-date-slot min-w-0 flex-1">
              <Datepicker2
                ref="datepicker"
                omit-main-label
                filter-bar-align
                :initToday="0"
                :mainName="'기간'"
                :closePopUp="closePopUp"
                @endDate="endDate"
                @startDate="startDate"
                @excelDate="excelDate" />
            </div>
          </div>

          <div class="sls0231-row sls0231-row--codes">
            <span class="sls0231-lbl shrink-0">결제코드</span>
            <div class="sls0231-ctrl-slot">
              <v-select
                v-model="selectedPay"
                :options="payCodeList"
                placeholder="전체"
                label="strName"
                class="custom-select2 sls0231-vselect"
                :reduce="(item) => (item != null ? item.lngCode : null)"
                clearable
                @update:modelValue="onPayCdChange" />
            </div>
            <span class="sls0231-lbl shrink-0">메뉴코드</span>
            <div class="sls0231-ctrl-slot">
              <v-select
                v-model="selectedMenu"
                :options="menuCodeList"
                placeholder="전체"
                label="strName"
                class="custom-select2 sls0231-vselect"
                :reduce="(item) => (item != null ? item.lngCode : null)"
                clearable
                @update:modelValue="onMenuCdChange" />
            </div>
          </div>
        </div>

        <!-- 우측: 매장명 (~80% 칼럼) -->
        <div class="sls0231-right-store min-w-0 overflow-visible">
          <PickStorePlural
            fluid-width
            @lngStoreCodes="selectedStoreCd"
            @lngStoreGroup="selectedGroupCd"
            @lngStoreAttrs="lngStoreAttrs"
            @excelStore="excelStore"
            :placeholderName="'선택'" />
        </div>
      </div>
    </div>

    <div class="mt-2 flex min-h-0 min-w-0 flex-1 flex-col">
      <div class="relative min-h-0 w-full flex-1">
        <Realgrid
          :progname="'SLS02_031RPT_VUE'"
          :progid="1"
          :rowData="rowData"
          :setRowGroupSpan2="'lngStoreCode,strStoreName,TR0_lngReceipt,strSeatName,dtmDate,TR0_dtmEndTime,TR2_dtmInTime,TR2_intCustCnt,TR21_intAgeCnt,TR2_intItmCnt,TR2_lngSalAmt,TR2_lngActAmt,lngSupplyAmt,lngVat,lngDisAmt'"
          :rowStateeditable="false"
          :documentTitle="'SLS02_031RPT'"
          :documentSubTitle="documentSubTitle"
          :exporttoExcel="exceloutput">
        </Realgrid>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getMenuCdList, getpayCodeList3, getReceiptDetailStatus } from "@/api/misales";

/**
 *  매출 일자 호출 컴포넌트
 *  */

import Datepicker2 from "@/components/Datepicker2.vue";

/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";

/**
 *  매장 복수 선택 컴포넌트
 *  */

import PickStorePlural from "@/components/pickStorePlural.vue";

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

/** 조회 AREA — SLS04_004RPT wire 패턴 */
const sls0231ControlBorder = "#cbd5e1";
const sls0231ColGutter = "1.25rem";
const sls0231RowGap = "0.875rem";
const sls0231LabelCol = "5.5rem";

const store = useStore();

/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  await insertPageLog(store.state.activeTab2);
  await loadPayAndMenuCodes(store.state.userData.lngStoreGroup, 0);
});

const datepicker = ref(null);
const closePopUp = ref(false);
const handleParentClick = (e) => {
  const datepickerEl = datepicker.value?.$el;
  if (datepickerEl && datepickerEl.contains(e.target)) {
    return;
  }
  closePopUp.value = !closePopUp.value;
};
const selectedstartDate = ref();
const selectedendDate = ref();

const endDate = (e) => {
  selectedendDate.value = e;
};
const startDate = (e) => {
  selectedstartDate.value = e;
};

const excelstore = ref("");
const excelStore = (e) => {
  excelstore.value = e;
};
const exceldate = ref("");
const excelDate = (e) => {
  exceldate.value = e;
};

const afterSearch = ref(false);

const groupCd = ref();
const storeCd = ref();
const init = ref(false);
const rowData = ref([]);

const payCd = ref(0);
const menuCd = ref(0);
const payCodeList = ref([]);
const menuCodeList = ref([]);
const selectedPay = ref(null);
const selectedMenu = ref(null);

const loadPayAndMenuCodes = async (gCd, sCd) => {
  try {
    const [payRes, menuRes] = await Promise.all([
      getpayCodeList3(gCd, sCd ?? 0),
      getMenuCdList(gCd, sCd ?? 0),
    ]);
    payCodeList.value = payRes.data?.List ?? [];
    menuCodeList.value = menuRes.data?.List ?? [];
  } catch (error) {
    payCodeList.value = [];
    menuCodeList.value = [];
  }
};

const onPayCdChange = (val) => {
  payCd.value = val == null ? 0 : val;
};

const onMenuCdChange = (val) => {
  menuCd.value = val == null ? 0 : val;
};

watch(init, () => {
  selectedPay.value = null;
  selectedMenu.value = null;
  payCd.value = 0;
  menuCd.value = 0;
});

/**
 *  조회 함수
 */

const searchButton = async () => {
  if (storeCd.value == 0) {
    Swal.fire({
      title: "경고",
      text: "매장을 선택하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  store.state.loading = true;
  try {
    initGrid();
    const res = await getReceiptDetailStatus(
      groupCd.value,
      storeCd.value,
      payCd.value,
      menuCd.value,
      selectedstartDate.value,
      selectedendDate.value
    );

    rowData.value = res.data.List;
    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
  } finally {
    store.state.loading = false;
  }
};

/**
 * 선택한 매장 코드 호출 함수
 */

const selectedStoreCd = (e) => {
  storeCd.value = e;
  initGrid();
};

/**
 * 선택한 매장 그룹 코드 호출 함수
 */

const selectedGroupCd = (e) => {
  groupCd.value = e;
};

const exceloutput = ref(false);
/**
 * 엑셀 내보내기 함수
 */
const documentSubTitle = ref("");
const excelButton = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 진행해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  const a = "할인코드 :" + (payCd.value == 0 ? "전체" : payCd.value);
  const b = "메뉴코드 :" + (menuCd.value == 0 ? "전체" : menuCd.value);
  documentSubTitle.value =
    exceldate.value + "\n" + excelstore.value + "\n" + a + "\n" + b;
  exceloutput.value = !exceloutput.value;
};

/**
 * 그리드 초기화
 */

const initGrid = () => {
  if (rowData.value.length != 0) {
    rowData.value = [];
  }
};

const selectedStoreAttr = ref();

/**
 * 페이지 매장 분류 세팅
 */

const lngStoreAttrs = (e) => {
  selectedStoreAttr.value = e;
  initGrid();
  init.value = !init.value;
  if (groupCd.value != null) {
    loadPayAndMenuCodes(groupCd.value, 0);
  }
};
</script>

<style scoped>
.sls0231-search-panel {
  box-sizing: border-box;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  padding-left: var(--sls0231-panel-pad-x, 2rem);
  padding-right: var(--sls0231-panel-pad-x, 2rem);
}

@media (min-width: 768px) {
  .sls0231-search-panel {
    --sls0231-panel-pad-x: 3rem;
  }
}

.sls0231-search-layout {
  /* 우측 매장명 칼럼 — 과도 축소 완화 (~90%) */
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);
  column-gap: var(--sls0231-col-gutter, 1.25rem);
  align-items: start;
  min-width: 0;
}

.sls0231-left-stack {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: var(--sls0231-row-gap, 0.875rem);
  min-width: 0;
  width: 100%;
  max-width: 100%;
}

.sls0231-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  min-height: 2rem;
}

.sls0231-row--codes {
  flex-wrap: wrap;
  row-gap: 0.5rem;
}

.sls0231-lbl {
  box-sizing: border-box;
  flex: 0 0 var(--sls0231-label-col, 5.5rem);
  width: var(--sls0231-label-col, 5.5rem);
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

.sls0231-date-slot {
  min-width: 0;
  flex: 1 1 auto;
}

.sls0231-date-slot :deep(> div.flex.justify-start.items-center) {
  margin: 0 !important;
  width: auto !important;
  max-width: 100%;
}

.sls0231-date-slot :deep(input[type="date"]) {
  box-sizing: border-box;
  height: 2rem;
  min-height: 2rem;
  border: 1px solid var(--sls0231-control-border, #cbd5e1);
  border-radius: 0.375rem;
  background: #fff;
}

.sls0231-ctrl-slot {
  box-sizing: border-box;
  flex: 0 0 12rem;
  width: 12rem;
  min-width: 0;
  max-width: 12rem;
}

.sls0231-search-panel :deep(.sls0231-vselect) {
  width: 100%;
  min-width: 0;
  height: 2rem;
  min-height: 2rem;
}

.sls0231-search-panel :deep(.sls0231-vselect .vs__dropdown-toggle) {
  box-sizing: border-box;
  height: 2rem !important;
  min-height: 2rem !important;
  padding: 0 0.5rem !important;
  border: 1px solid var(--sls0231-control-border, #cbd5e1) !important;
  border-radius: 0.375rem !important;
  background: #fff !important;
  overflow: hidden;
}

.sls0231-search-panel :deep(.sls0231-vselect .vs__selected-options) {
  display: flex;
  align-items: center;
  flex-wrap: nowrap !important;
  padding: 0 !important;
  margin: 0 !important;
  overflow: hidden;
  min-width: 0;
}

.sls0231-search-panel :deep(.sls0231-vselect .vs__selected),
.sls0231-search-panel :deep(.sls0231-vselect .vs__placeholder) {
  margin: 0 !important;
  padding: 0 !important;
  border: none;
  background: none;
  display: block;
  font-size: 0.875rem !important;
  line-height: 1.25rem !important;
  color: rgb(55 65 81);
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis;
  max-width: 100%;
}

.sls0231-search-panel :deep(.sls0231-vselect .vs__search) {
  margin: 0 !important;
  padding: 0 !important;
  font-size: 0.875rem !important;
}

.sls0231-search-panel :deep(.sls0231-vselect .vs__actions) {
  padding: 0 0 0 0.25rem !important;
}

.sls0231-right-store {
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

.sls0231-right-store:has(.psp-popup),
.sls0231-right-store:has(.psp-store-hover-list) {
  z-index: 50;
}

.sls0231-right-store :deep(.psp-root) {
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

.sls0231-right-store :deep(.psp-label) {
  width: var(--psp-label-w, 5.5rem);
  justify-content: center;
  padding-inline-start: 0;
  font-size: 1rem;
  font-weight: 600;
}

/* 매장 콤보/트리거 — 기간·결제/메뉴(h-8)와 동일 높이 */
.sls0231-right-store :deep(.psp-select),
.sls0231-right-store :deep(.psp-store-trigger),
.sls0231-right-store :deep(.psp-collapse-btn) {
  height: 2rem !important;
  min-height: 2rem !important;
}

.sls0231-right-store :deep(.psp-collapse-btn) {
  width: 2rem !important;
}

.sls0231-date-slot :deep(div.inline-flex.h-8),
.sls0231-date-slot :deep(button) {
  height: 2rem !important;
  min-height: 2rem !important;
}

.sls0231-right-store :deep(.psp-popup) {
  z-index: 60;
  right: 0;
  left: auto;
  width: min(42rem, 92vw);
  min-width: 28rem;
  max-width: min(42rem, 92vw);
}

@media (max-width: 1280px) {
  .sls0231-search-layout {
    grid-template-columns: minmax(0, 1fr);
    row-gap: var(--sls0231-row-gap, 0.875rem);
  }

  .sls0231-right-store :deep(.psp-popup) {
    left: 0;
    right: auto;
  }
}
</style>
