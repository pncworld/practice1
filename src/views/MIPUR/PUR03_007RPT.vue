<!-- /*--############################################################################
# Filename : PUR03_007RPT.vue
# Description : 구매관리2 > 매입 관리 > 발주 등록 히스토리 조회
# Date :2025-09-24
# Author : 권맑음
################################################################################*/ -->
<template>
  <!-- pl-5: 셸 w-right가 pl0이라 그리드가 좌측 메뉴에 붙음 → 우측 pd20과 맞춤 -->
  <div class="flex h-full min-h-0 flex-col pl-5" @click="handleParentClick">
    <div class="flex shrink-0 justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center space-x-2 pr-5">
        <button type="button" @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <button type="button" @click="excelButton" class="button w-auto excel">엑셀</button>
      </div>
    </div>

    <div
      class="pur007-search-panel z-10 mt-3 w-full min-w-0 shrink-0 rounded-lg bg-gray-200"
      :style="{
        '--pur007-control-border': pur007ControlBorder,
        '--pur007-item-gap': pur007ItemGap,
        '--pur007-col-gap': pur007ColGap,
        '--pur007-row-gap': pur007RowGap,
        '--pur007-panel-pad-x': pur007PanelPadX,
        '--pur007-label-col': pur007LabelCol,
        '--pur007-date-field-w': pur007DateFieldW,
        '--pur007-bc-field-w': pur007BcFieldW,
        '--pur007-right-field-w': pur007RightFieldW,
        '--pur007-row-min-h': pur007RowMinH,
        '--pur007-control-h': pur007ControlH,
      }">
      <div class="pur007-search-grid min-w-0">
        <div class="pur007-row">
          <div class="pur007-edge" aria-hidden="true"></div>
          <div class="pur007-cell pur007-cell--left">
            <div class="pur007-sg-label">발주일자</div>
            <div class="pur007-cell-field pur007-date-slot min-w-0 overflow-hidden">
              <Datepicker2
                ref="datepicker"
                omit-main-label
                filter-bar-align
                :mainName="'발주일자'"
                :initToday="1"
                :closePopUp="closePopUp"
                @excelDate="excelDate"
                @endDate="endDate"
                @startDate="startDate" />
            </div>
          </div>
          <div class="pur007-spacer" aria-hidden="true"></div>
          <div class="pur007-cell pur007-cell--right">
            <div class="pur007-sg-label">매장명</div>
            <div class="pur007-cell-field pur007-pick-slot min-w-0">
              <PickStore
                compact-search-bar
                :compact-store-combo-max-rem="pur007PickStoreComboMaxRem"
                :store-dropdown-min-width-rem="pur007StoreDropdownMinRem"
                main-name=""
                @update:storeGroup="lngStoreGroup"
                :defaultStoreNm="'전체'"
                @storeNm="excelStore"
                :hideGroup="false"
                :hideAttr="false"
                :defaultStoreType2="true"
                :defaultStore="true"
                @update:storeCd="lngStoreCode" />
            </div>
          </div>
          <div class="pur007-edge" aria-hidden="true"></div>
        </div>
        <div class="pur007-row">
          <div class="pur007-edge" aria-hidden="true"></div>
          <div class="pur007-cell pur007-cell--left">
            <div class="pur007-sg-label">거래처</div>
            <div class="pur007-cell-field pur007-bc-slot min-w-0">
              <BusinessClient
                compact-search-bar
                :default-nm="'전체'"
                @SupplierId="SupplierId" />
            </div>
          </div>
          <div class="pur007-spacer" aria-hidden="true"></div>
          <div class="pur007-cell pur007-cell--right">
            <div class="pur007-sg-label">자재코드/명</div>
            <div class="pur007-cell-field pur007-item-slot min-w-0">
              <input
                v-model="cond"
                class="pur007-item-input pur007-item-input--code"
                type="text"
                inputmode="numeric"
                pattern="[0-9]*"
                lang="en"
                autocomplete="off"
                placeholder="코드"
                @keydown="digits.onKeydown"
                @beforeinput="digits.onBeforeInput"
                @paste="digits.onPaste"
                @compositionstart="digits.onCompositionStart"
                @compositionupdate="digits.onCompositionUpdate"
                @compositionend="digits.onCompositionEnd"
                @input="digits.onInput"
                @keyup.enter="searchButton" />
              <input
                v-model="cond2"
                class="pur007-item-input"
                type="text"
                autocomplete="off"
                placeholder="자재명"
                @keyup.enter="searchButton" />
            </div>
          </div>
          <div class="pur007-edge" aria-hidden="true"></div>
        </div>
      </div>
    </div>

    <div class="mt-2 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <Realgrid
        class="pur007-grid-body min-h-0 w-full flex-1"
        :progname="'PUR03_007RPT_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :setStateBar="false"
        :set-row-group-span="'strStoreName'"
        :set-row-group-span2="'dtmOrderDate,dtmExpectedDate,strOrderNo,strSupplierName'"
        :merge-mask="pur007MergeMask"
        :documentTitle="'PUR03_007RPT'"
        :documentSubTitle="documentSubTitle"
        :rowStateeditable="false"
        :exporttoExcel="exportExcel" />
    </div>
  </div>
</template>

<script setup>
import { getOrderHistoryList } from "@/api/mipur";
import BusinessClient from "@/components/businessClient2.vue";
import Datepicker2 from "@/components/Datepicker2.vue";
import PageName from "@/components/pageName.vue";
import PickStore from "@/components/pickStore.vue";
import Realgrid from "@/components/realgrid.vue";
import { insertPageLog } from "@/customFunc/customFunc";
import { makeDigitsOnlyHandlers } from "@/utils/inputRestrict";
import { onMounted, ref } from "vue";
import { useStore } from "vuex";

const pur007ControlBorder = "#cbd5e1";
const pur007ItemGap = "2rem";
const pur007ColGap = "1.75rem";
const pur007RowGap = "0.75rem";
const pur007PanelPadX = "7rem";
const pur007LabelCol = "7.25rem";
const pur007DateFieldW = "21.6rem";
const pur007BcFieldW = "17.94rem";
const pur007RightFieldW = "24rem";
const pur007RowMinH = "2rem";
const pur007ControlH = "2rem";
const pur007PickStoreComboMaxRem = 8;
const pur007StoreDropdownMinRem = 8;
/** 전표번호+거래처. 공통 mergeMask는 마지막 필드만 쓰므로 두 키를 이어 붙인다. */
const pur007MergeMask = "strOrderNo']+values['strSupplierName";

const digits = makeDigitsOnlyHandlers({
  setValue: (v) => {
    cond.value = v;
  },
});

onMounted(async () => {
  await insertPageLog(store.state.activeTab2);
});

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

const cond = ref("");
const cond2 = ref("");

const store = useStore();

const datepicker = ref(null);
const closePopUp = ref(false);

const handleParentClick = (e) => {
  const datepickerEl = datepicker.value?.$el;
  if (datepickerEl && datepickerEl.contains(e.target)) {
    return;
  }
  closePopUp.value = !closePopUp.value;
};

const sDate = ref("");
const eDate = ref("");

const selectedDate = ref();
const excelDate = (e) => {
  selectedDate.value = e;
};

const storeCode = ref();
const lngStoreCode = (e) => {
  initGrid();
  storeCode.value = e;
};

const groupCd = ref();
const lngStoreGroup = (e) => {
  groupCd.value = e;
};

const supplierid = ref("");
const SupplierId = (e) => {
  supplierid.value = e;
};

const searchButton = async () => {
  try {
    store.state.loading = true;
    initGrid();

    const res = await getOrderHistoryList(
      groupCd.value,
      storeCode.value,
      sDate.value.replaceAll("-", ""),
      eDate.value.replaceAll("-", ""),
      supplierid.value,
      cond.value,
      cond2.value
    );

    rowData.value = res.data.List;
    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
  } finally {
    store.state.loading = false;
  }
};

const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
  reload.value = !reload.value;
};

const exportExcel = ref(false);

const excelButton = () => {
  documentSubTitle.value =
    selectedDate.value + "\n" + "매장명 :" + selectedExcelStore.value;
  exportExcel.value = !exportExcel.value;
};

const documentSubTitle = ref("");
const selectedExcelStore = ref("");

const excelStore = (e) => {
  selectedExcelStore.value = e;
};

const startDate = (e) => {
  sDate.value = e;
};
const endDate = (e) => {
  eDate.value = e;
};
</script>

<style scoped>
.pur007-search-panel {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  padding-left: 0;
  padding-right: 0;
  padding-block: 0.75rem;
  overflow-x: visible;
}

.pur007-search-grid {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  padding-left: 0;
  padding-right: 0;
  row-gap: var(--pur007-row-gap);
}

.pur007-row {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  width: 100%;
  min-width: 0;
}

/* 앞·뒤 동일 --pur007-panel-pad-x(7rem) — 018과 같은 edge */
.pur007-edge {
  flex: 0 0 var(--pur007-panel-pad-x);
  width: var(--pur007-panel-pad-x);
  min-width: var(--pur007-panel-pad-x);
  max-width: var(--pur007-panel-pad-x);
  align-self: stretch;
}

.pur007-spacer {
  flex: 1 1 0;
  min-width: var(--pur007-col-gap);
  align-self: stretch;
}

.pur007-cell {
  display: flex;
  flex: 0 0 auto;
  min-width: 0;
  min-height: var(--pur007-row-min-h);
  align-items: center;
  gap: var(--pur007-item-gap);
}

.pur007-cell--left {
  flex: 0 0 calc(var(--pur007-label-col) + var(--pur007-item-gap) + var(--pur007-date-field-w));
  width: calc(var(--pur007-label-col) + var(--pur007-item-gap) + var(--pur007-date-field-w));
}

.pur007-cell--right {
  flex: 0 0 calc(var(--pur007-label-col) + var(--pur007-item-gap) + var(--pur007-right-field-w));
  width: calc(var(--pur007-label-col) + var(--pur007-item-gap) + var(--pur007-right-field-w));
}

.pur007-sg-label {
  flex: 0 0 var(--pur007-label-col);
  width: var(--pur007-label-col);
  max-width: var(--pur007-label-col);
  min-height: var(--pur007-row-min-h);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
  white-space: nowrap;
}

.pur007-cell-field {
  display: flex;
  flex: 0 0 auto;
  min-width: 0;
  min-height: var(--pur007-row-min-h);
  align-items: center;
}

.pur007-date-slot {
  width: var(--pur007-date-field-w);
  max-width: var(--pur007-date-field-w);
}

/* 거래처 오른쪽 = 발주일자 두 번째 날짜 오른쪽 (기간버튼 2rem + 간격 제외) */
.pur007-bc-slot {
  width: calc(var(--pur007-date-field-w) - 2.25rem);
  max-width: calc(var(--pur007-date-field-w) - 2.25rem);
}

.pur007-pick-slot,
.pur007-item-slot {
  width: var(--pur007-right-field-w);
  max-width: var(--pur007-right-field-w);
  overflow: hidden;
}

.pur007-item-slot {
  gap: 0.5rem;
}

.pur007-item-input {
  box-sizing: border-box;
  flex: 1 1 0;
  min-width: 0;
  height: var(--pur007-control-h);
  min-height: var(--pur007-control-h);
  max-height: var(--pur007-control-h);
  padding: 0 0.5rem;
  border: 1px solid var(--pur007-control-border);
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background: #fff;
}

.pur007-item-input--code {
  flex: 0 0 9.25rem;
  max-width: 9.25rem;
}

.pur007-item-input:focus {
  outline: none;
  border-color: #3b82f6;
}

.pur007-search-grid .pur007-pick-slot :deep(select) {
  box-sizing: border-box;
  height: var(--pur007-control-h) !important;
  min-height: var(--pur007-control-h) !important;
  max-height: var(--pur007-control-h) !important;
  border: 1px solid var(--pur007-control-border) !important;
}

.pur007-search-grid .pur007-pick-slot :deep(select:focus) {
  border-color: #3b82f6 !important;
}

.pur007-search-grid .pur007-pick-slot :deep(.pickstore-vs-shell),
.pur007-search-grid .pur007-bc-slot :deep(.pickstore-vs-shell) {
  box-sizing: border-box;
  height: var(--pur007-control-h) !important;
  min-height: var(--pur007-control-h) !important;
  max-height: var(--pur007-control-h) !important;
  border: 1px solid var(--pur007-control-border) !important;
  overflow: hidden !important;
  position: relative !important;
}

.pur007-search-grid .pur007-pick-slot :deep(.style-chooser),
.pur007-search-grid .pur007-bc-slot :deep(.style-chooser) {
  width: 100% !important;
  height: 100% !important;
}

.pur007-search-grid .pur007-pick-slot :deep(.vs__dropdown-toggle),
.pur007-search-grid .pur007-bc-slot :deep(.vs__dropdown-toggle) {
  box-sizing: border-box;
  min-height: var(--pur007-control-h) !important;
  height: var(--pur007-control-h) !important;
  max-height: var(--pur007-control-h) !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  padding-left: 0.5rem !important;
  padding-right: 0.25rem !important;
  display: flex !important;
  align-items: center !important;
  flex-wrap: nowrap !important;
}

.pur007-search-grid .pur007-pick-slot :deep(.vs__selected-options),
.pur007-search-grid .pur007-bc-slot :deep(.vs__selected-options) {
  flex: 1 1 auto !important;
  min-width: 0 !important;
  position: relative !important;
  height: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
  overflow: hidden !important;
}

.pur007-search-grid .pur007-pick-slot :deep(.vs__selected),
.pur007-search-grid .pur007-bc-slot :deep(.vs__selected) {
  position: absolute !important;
  left: 0 !important;
  right: 1.5rem !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  margin: 0 !important;
  padding: 0 !important;
  height: auto !important;
  max-width: 100% !important;
  line-height: 1.25 !important;
  font-size: 0.875rem !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  display: block !important;
  background: transparent !important;
}

.pur007-search-grid .pur007-pick-slot :deep(.vs__search),
.pur007-search-grid .pur007-bc-slot :deep(.vs__search) {
  margin: 0 !important;
  padding: 0 !important;
  height: calc(var(--pur007-control-h) - 2px) !important;
  line-height: calc(var(--pur007-control-h) - 2px) !important;
  font-size: 0.875rem !important;
}

.pur007-search-grid .pur007-pick-slot :deep(.vs__actions),
.pur007-search-grid .pur007-bc-slot :deep(.vs__actions) {
  display: flex !important;
  align-items: center !important;
  padding: 0 2px 0 0 !important;
  flex-shrink: 0 !important;
  margin-left: auto !important;
}

.pur007-search-panel .pur007-date-slot :deep(> div.flex.justify-start.items-center) {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0;
  margin: 0 !important;
  gap: 0.25rem !important;
}

.pur007-search-panel .pur007-date-slot :deep(> div.flex > div.inline-flex.h-8) {
  flex: 1 1 auto;
  min-width: 0;
  max-width: 100%;
  width: 100%;
  gap: 0.125rem !important;
}

.pur007-search-panel .pur007-date-slot :deep(input[type="date"]) {
  box-sizing: border-box;
  height: var(--pur007-control-h) !important;
  min-height: var(--pur007-control-h) !important;
  max-height: var(--pur007-control-h) !important;
  border: 1px solid var(--pur007-control-border) !important;
  width: auto !important;
  flex: 1 1 0;
  min-width: 6.5rem;
  max-width: none;
  padding-left: 0.45rem;
  padding-right: 0.25rem;
  font-size: 0.875rem;
}

.pur007-search-panel .pur007-date-slot :deep(input[type="date"]:focus) {
  border-color: #3b82f6 !important;
}

.pur007-bc-slot :deep(> div.flex.text-base) {
  margin: 0 !important;
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0;
  gap: 0 !important;
}

.pur007-pick-slot :deep(> div.flex.text-base) {
  width: 100%;
  min-width: 0;
  min-height: var(--pur007-row-min-h);
  align-items: center;
  gap: var(--pur007-item-gap) !important;
}

.pur007-pick-slot :deep(> div.flex > div:first-child) {
  display: none;
}

.pur007-pick-slot :deep(.relative.min-w-0.flex-1) {
  flex: 1 1 auto !important;
  min-width: 0 !important;
  max-width: none !important;
}

.pur007-grid-body {
  min-height: 12rem;
}
</style>
