<!-- /*--############################################################################
# Filename : PUR02_012RPT.vue
# Description : 구매관리2 > 매입 관리 > 발주/매입 현황.
# Date :2025-08-28
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
      class="pur012-search-panel z-10 mt-3 w-full min-w-0 shrink-0 rounded-lg bg-gray-200"
      :style="{
        '--pur012-control-border': pur012ControlBorder,
        '--pur012-item-gap': pur012ItemGap,
        '--pur012-col-gap': pur012ColGap,
        '--pur012-row-gap': pur012RowGap,
        '--pur012-panel-pad-x': pur012PanelPadX,
        '--pur012-date-field-w': pur012DateFieldW,
        '--pur012-row-min-h': pur012RowMinH,
        '--pur012-control-h': pur012ControlH,
      }">
      <div class="pur012-search-grid min-w-0">
        <div class="pur012-sg-label">조회기간</div>
        <div class="pur012-cell-field pur012-date-slot min-w-0">
          <Datepicker2
            ref="datepicker"
            omit-main-label
            filter-bar-align
            init-end-yesterday
            :make-seven-term="true"
            :mainName="'조회기간'"
            :initToday="1"
            :closePopUp="closePopUp"
            @excelDate="excelDate"
            @endDate="endDate"
            @startDate="startDate" />
        </div>
        <div class="pur012-spacer" aria-hidden="true"></div>
        <div class="pur012-sg-label">매장명</div>
        <div class="pur012-cell-field pur012-pick-slot min-w-0">
          <PickStore
            compact-search-bar
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

        <div class="pur012-sg-label">거래처</div>
        <div class="pur012-cell-field pur012-bc-slot min-w-0">
          <BusinessClient
            compact-search-bar
            :default-nm="'전체'"
            @SupplierId="SupplierId" />
        </div>
        <div class="pur012-spacer" aria-hidden="true"></div>
        <div class="pur012-sg-label">검수자</div>
        <div class="pur012-cell-field pur012-inspector-slot min-w-0">
          <input
            v-model="cond"
            class="pur012-item-input"
            type="text"
            autocomplete="off"
            @keyup.enter="searchButton" />
        </div>
      </div>
    </div>

    <div class="mt-2 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <Realgrid
        class="pur012-grid-body min-h-0 w-full flex-1"
        :progname="'PUR02_012RPT_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :setStateBar="false"
        :fixed-column="true"
        :setFooter="true"
        :documentTitle="'PUR02_012RPT'"
        :selectionStyle="'block'"
        @dblclickedRowData="dblclickedRowData"
        :documentSubTitle="documentSubTitle"
        :rowStateeditable="false"
        :exporttoExcel="exportExcel" />
    </div>
  </div>

  <Teleport to="body">
    <div
      v-if="openPopUp"
      class="pur012-popup-backdrop"
      @click.self.prevent>
      <div
        class="pur012-popup-dialog"
        role="dialog"
        aria-modal="true"
        @click.stop
        @keydown.esc="openPopUp = false">
        <div class="pur012-popup-head">
          <h2 class="pur012-popup-title">매입 상세</h2>
          <div class="pur012-popup-actions">
            <button
              type="button"
              class="whitebutton !h-9 !px-5 !py-2 !text-sm !font-semibold !border-gray-500 !text-gray-700 hover:!bg-blue-50 hover:!border-blue-400"
              @click="excelButton2">
              엑셀
            </button>
            <button
              type="button"
              class="whitebutton !h-9 !px-5 !py-2 !text-sm !font-semibold !border-gray-500 !text-gray-700 hover:!bg-blue-50 hover:!border-blue-400"
              @click="openPopUp = false">
              닫기
            </button>
          </div>
        </div>

        <div
          class="pur012-popup-fields"
          :style="{
            '--pur012-popup-border': pur012ControlBorder,
            '--pur012-popup-label': pur012PopupLabelCol,
            '--pur012-popup-gap': pur012PopupFieldGap,
          }">
          <div class="pur012-popup-grid">
            <div class="pur012-popup-label">
              <div class="pur012-popup-label-inner">전표번호(발주)</div>
            </div>
            <div class="pur012-popup-cell">
              <input type="text" class="pur012-popup-input" disabled v-model="scond" />
            </div>
            <div class="pur012-popup-label">
              <div class="pur012-popup-label-inner">전표번호(매입)</div>
            </div>
            <div class="pur012-popup-cell">
              <input type="text" class="pur012-popup-input" disabled v-model="scond2" />
            </div>

            <div class="pur012-popup-label">
              <div class="pur012-popup-label-inner">매장</div>
            </div>
            <div class="pur012-popup-cell">
              <input type="text" class="pur012-popup-input" disabled v-model="scond3" />
            </div>
            <div class="pur012-popup-label">
              <div class="pur012-popup-label-inner">거래처</div>
            </div>
            <div class="pur012-popup-cell">
              <input type="text" class="pur012-popup-input" disabled v-model="scond4" />
            </div>

            <div class="pur012-popup-label">
              <div class="pur012-popup-label-inner">검수자</div>
            </div>
            <div class="pur012-popup-cell">
              <input type="text" class="pur012-popup-input" disabled v-model="scond5" />
            </div>
            <div class="pur012-popup-label">
              <div class="pur012-popup-label-inner">검수일시</div>
            </div>
            <div class="pur012-popup-cell">
              <input type="text" class="pur012-popup-input" disabled v-model="scond6" />
            </div>

            <div class="pur012-popup-label">
              <div class="pur012-popup-label-inner">코멘트(발주)</div>
            </div>
            <div class="pur012-popup-cell pur012-popup-cell--span">
              <input type="text" class="pur012-popup-input" disabled v-model="scond7" />
            </div>

            <div class="pur012-popup-label">
              <div class="pur012-popup-label-inner">코멘트(출고)</div>
            </div>
            <div class="pur012-popup-cell pur012-popup-cell--span">
              <input type="text" class="pur012-popup-input" disabled v-model="scond8" />
            </div>

            <div class="pur012-popup-label">
              <div class="pur012-popup-label-inner">코멘트(매입)</div>
            </div>
            <div class="pur012-popup-cell pur012-popup-cell--span">
              <input type="text" class="pur012-popup-input" disabled v-model="scond9" />
            </div>
          </div>
        </div>

        <div class="pur012-popup-grid-wrap">
          <Realgrid
            class="pur012-popup-grid-body min-h-0 h-full w-full"
            :progname="'PUR02_012RPT_VUE'"
            :progid="2"
            :documentTitle="'PUR02_012RPT'"
            :exporttoExcel="exportExcel2"
            @updatedRowData="updatedRowData2"
            :setFooter="true"
            :rowStateeditable="false"
            :documentSubTitle="documentSubTitle2"
            :rowData="rowData2" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { getCommonList } from "@/api/common";
import {
  getOrderNCheckChitDetailList,
  getOrderNCheckChitMasterList,
  getStockAuditReportList,
} from "@/api/mipur";
import BusinessClient from "@/components/businessClient2.vue";
import Datepicker2 from "@/components/Datepicker2.vue";
import PageName from "@/components/pageName.vue";
import PickStore from "@/components/pickStore.vue";
import Realgrid from "@/components/realgrid.vue";
import { insertPageLog } from "@/customFunc/customFunc";
import { onMounted, ref } from "vue";
import { useStore } from "vuex";

const pur012ControlBorder = "#cbd5e1";
const pur012ItemGap = "2rem";
const pur012ColGap = "1.75rem";
const pur012RowGap = "0.75rem";
const pur012PanelPadX = "7rem";
const pur012DateFieldW = "21.6rem";
const pur012RowMinH = "2rem";
const pur012ControlH = "2rem";
const pur012PopupLabelCol = "8.5rem";
const pur012PopupFieldGap = "0.5rem";

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getCommonList(27);

  optionList.value = res.data.List.filter((item) => item.strDCode != "01");

  const res2 = await getCommonList(24);

  optionList2.value = res2.data.List;
});

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

const cond = ref("");
const cond2 = ref("01");

const cond5 = ref(0);
const store = useStore();

const datepicker = ref(null);
const closePopUp = ref(false);
const optionList = ref([]);
const optionList2 = ref([]);

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

const hideColumnsId = ref([]);
const searchButton = async () => {
  try {
    store.state.loading = true;
    initGrid();

    const res = await getOrderNCheckChitMasterList(
      groupCd.value,
      storeCode.value,
      sDate.value.replaceAll("-", ""),
      eDate.value.replaceAll("-", ""),
      supplierid.value,
      cond.value
    );

    rowData.value = res.data.List;
    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
  } finally {
    store.state.loading = false;
  }
};

const disabled1 = ref(false);
const progid = ref(1);
const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }

  reload.value = !reload.value;
};

const exportExcel = ref(false);
const exportExcel2 = ref(false);

const excelButton = () => {
  documentSubTitle.value =
    selectedDate.value + "\n" + "매장명 :" + selectedExcelStore.value;
  exportExcel.value = !exportExcel.value;
};
const excelButton2 = () => {
  documentSubTitle2.value =
    "전표번호 : " + scond.value + "\n" + "전표번호(매입) : " + scond2.value;
  exportExcel2.value = !exportExcel2.value;
};

const documentSubTitle2 = ref("");

const documentSubTitle = ref("");
const selectedExcelList = ref("");

const selectedExcelStore = ref("");

const excelStore = (e) => {
  selectedExcelStore.value = e;
};
const excelList = (e) => {
  selectedExcelList.value = e;
};

const startDate = (e) => {
  sDate.value = e;
};
const endDate = (e) => {
  eDate.value = e;
};
const rowData2 = ref([]);

const openPopUp = ref(false);

const scond = ref("");
const scond2 = ref("");
const scond3 = ref("");
const scond4 = ref("");
const scond5 = ref("");
const scond6 = ref("");
const scond7 = ref("");
const scond8 = ref("");
const scond9 = ref("");
const updatedRowData2 = () => {};
const dblclickedRowData = async (e) => {
  scond.value = e[2];
  scond2.value = e[3];
  scond3.value = e[0];
  scond4.value = e[1];
  scond5.value = e[4];
  scond6.value = e[5];
  scond7.value = e[18];
  scond8.value = e[19];
  scond9.value = e[20];
  try {
    const res = await getOrderNCheckChitDetailList(
      e[16],
      e[17],
      e[15],
      e[6],
      e[8],
      e[2],
      e[3]
    );
    rowData2.value = res.data.List;
  } catch (error) {}
  openPopUp.value = true;
};
</script>

<style scoped>
.pur012-search-panel {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  padding-left: 0;
  padding-right: 0;
  padding-block: 0.75rem;
  overflow-x: visible;
}

.pur012-search-grid {
  display: grid;
  grid-template-columns:
    max-content
    var(--pur012-date-field-w)
    minmax(var(--pur012-col-gap), 1fr)
    max-content
    calc(var(--pur012-date-field-w) - 2.25rem);
  grid-template-rows: auto auto;
  align-items: center;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  column-gap: 0;
  row-gap: var(--pur012-row-gap);
  padding-left: var(--pur012-panel-pad-x);
  padding-right: var(--pur012-panel-pad-x);
}

.pur012-spacer {
  min-width: var(--pur012-col-gap);
  align-self: stretch;
}

.pur012-sg-label {
  justify-self: stretch;
  box-sizing: content-box;
  padding-right: var(--pur012-item-gap);
  min-height: var(--pur012-row-min-h);
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

.pur012-cell-field {
  display: flex;
  min-width: 0;
  min-height: var(--pur012-row-min-h);
  align-items: center;
}

.pur012-date-slot {
  width: 100%;
  max-width: var(--pur012-date-field-w);
  justify-self: stretch;
}

.pur012-bc-slot {
  width: calc(var(--pur012-date-field-w) - 2.25rem);
  max-width: calc(var(--pur012-date-field-w) - 2.25rem);
  justify-self: start;
}

.pur012-pick-slot,
.pur012-inspector-slot {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  justify-self: stretch;
}

.pur012-pick-slot :deep(> div.flex.text-base) {
  width: 100%;
  min-width: 0;
  min-height: var(--pur012-row-min-h);
  align-items: center;
  gap: 0 !important;
}

.pur012-pick-slot :deep(> div.flex > div:first-child) {
  display: none;
}

.pur012-pick-slot :deep(.relative.min-w-0.flex-1) {
  flex: 1 1 auto !important;
  min-width: 0 !important;
  max-width: 100% !important;
  width: 100% !important;
}

.pur012-item-input {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  height: var(--pur012-control-h);
  min-height: var(--pur012-control-h);
  max-height: var(--pur012-control-h);
  padding: 0 0.5rem;
  border: 1px solid var(--pur012-control-border);
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background: #fff;
}

.pur012-item-input:focus {
  outline: none;
  border-color: #3b82f6;
}

.pur012-search-grid .pur012-pick-slot :deep(select) {
  box-sizing: border-box;
  height: var(--pur012-control-h) !important;
  min-height: var(--pur012-control-h) !important;
  max-height: var(--pur012-control-h) !important;
  border: 1px solid var(--pur012-control-border) !important;
}

.pur012-search-grid .pur012-pick-slot :deep(select:focus) {
  border-color: #3b82f6 !important;
}

.pur012-search-grid .pur012-pick-slot :deep(.pickstore-vs-shell),
.pur012-search-grid .pur012-bc-slot :deep(.pickstore-vs-shell) {
  box-sizing: border-box;
  height: var(--pur012-control-h) !important;
  min-height: var(--pur012-control-h) !important;
  max-height: var(--pur012-control-h) !important;
  border: 1px solid var(--pur012-control-border) !important;
  overflow: hidden !important;
  position: relative !important;
}

.pur012-search-grid .pur012-pick-slot :deep(.style-chooser),
.pur012-search-grid .pur012-bc-slot :deep(.style-chooser) {
  width: 100% !important;
  height: 100% !important;
}

.pur012-search-grid .pur012-pick-slot :deep(.vs__dropdown-toggle),
.pur012-search-grid .pur012-bc-slot :deep(.vs__dropdown-toggle) {
  box-sizing: border-box;
  min-height: var(--pur012-control-h) !important;
  height: var(--pur012-control-h) !important;
  max-height: var(--pur012-control-h) !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  padding-left: 0.5rem !important;
  padding-right: 0.25rem !important;
  display: flex !important;
  align-items: center !important;
  flex-wrap: nowrap !important;
}

.pur012-search-grid .pur012-pick-slot :deep(.vs__selected-options),
.pur012-search-grid .pur012-bc-slot :deep(.vs__selected-options) {
  flex: 1 1 auto !important;
  min-width: 0 !important;
  position: relative !important;
  height: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
  overflow: hidden !important;
}

.pur012-search-grid .pur012-pick-slot :deep(.vs__selected),
.pur012-search-grid .pur012-bc-slot :deep(.vs__selected) {
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

.pur012-search-grid .pur012-pick-slot :deep(.vs__search),
.pur012-search-grid .pur012-bc-slot :deep(.vs__search) {
  margin: 0 !important;
  padding: 0 !important;
  height: calc(var(--pur012-control-h) - 2px) !important;
  line-height: calc(var(--pur012-control-h) - 2px) !important;
  font-size: 0.875rem !important;
}

.pur012-search-grid .pur012-pick-slot :deep(.vs__actions),
.pur012-search-grid .pur012-bc-slot :deep(.vs__actions) {
  display: flex !important;
  align-items: center !important;
  padding: 0 2px 0 0 !important;
  flex-shrink: 0 !important;
  margin-left: auto !important;
}

.pur012-search-panel .pur012-date-slot :deep(> div.flex.justify-start.items-center) {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0;
  margin: 0 !important;
  gap: 0.25rem !important;
}

.pur012-search-panel .pur012-date-slot :deep(> div.flex > div.inline-flex.h-8) {
  flex: 1 1 auto;
  min-width: 0;
  max-width: 100%;
  width: 100%;
  gap: 0.125rem !important;
}

.pur012-search-panel .pur012-date-slot :deep(input[type="date"]) {
  box-sizing: border-box;
  height: var(--pur012-control-h) !important;
  min-height: var(--pur012-control-h) !important;
  max-height: var(--pur012-control-h) !important;
  border: 1px solid var(--pur012-control-border) !important;
  width: auto !important;
  flex: 1 1 0;
  min-width: 6.5rem;
  max-width: none;
  padding-left: 0.45rem;
  padding-right: 0.25rem;
  font-size: 0.875rem;
}

.pur012-search-panel .pur012-date-slot :deep(input[type="date"]:focus) {
  border-color: #3b82f6 !important;
}

.pur012-bc-slot :deep(> div.flex.text-base) {
  margin: 0 !important;
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0;
  gap: 0 !important;
}

.pur012-grid-body {
  min-height: 12rem;
}

.pur012-popup-backdrop {
  position: fixed;
  inset: 0;
  z-index: 11000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(0 0 0 / 0.5);
  pointer-events: auto;
}

.pur012-popup-dialog {
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: min(75vw, 72rem);
  height: min(80vh, 52rem);
  max-height: 90vh;
  padding: 1.25rem 1.5rem;
  border-radius: 1rem;
  background: #fff;
  box-shadow: 0 20px 40px rgb(0 0 0 / 0.2);
  overflow: hidden;
  pointer-events: auto;
}

.pur012-popup-head {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.pur012-popup-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.4;
  color: rgb(17 24 39);
}

.pur012-popup-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.pur012-popup-fields {
  box-sizing: border-box;
  flex-shrink: 0;
  margin-bottom: 0.75rem;
  min-width: 0;
  padding: 0.875rem 1.25rem;
  border-radius: 0.5rem;
  background: #f3f4f6;
}

.pur012-popup-grid {
  display: grid;
  width: 100%;
  min-width: 0;
  grid-template-columns:
    minmax(0, var(--pur012-popup-label)) minmax(0, 1fr)
    minmax(0, var(--pur012-popup-label)) minmax(0, 1fr);
  column-gap: 0.75rem;
  row-gap: var(--pur012-popup-gap);
  align-items: center;
}

.pur012-popup-label {
  min-width: 0;
  max-width: var(--pur012-popup-label);
}

.pur012-popup-label-inner {
  display: flex;
  width: 100%;
  min-height: 2rem;
  align-items: center;
  justify-content: center;
  padding: 0.125rem 0.25rem;
  text-align: center;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.25rem;
  color: rgb(17 24 39);
}

.pur012-popup-cell {
  display: flex;
  min-width: 0;
  align-items: center;
}

.pur012-popup-cell--span {
  grid-column: 2 / -1;
}

.pur012-popup-input {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  height: 2rem;
  min-height: 2rem;
  border-radius: 0.375rem;
  border: 1px solid var(--pur012-popup-border) !important;
  background-color: #fff;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: rgb(55 65 81);
}

.pur012-popup-input:disabled {
  background-color: rgb(229 231 235);
  color: rgb(75 85 99);
}

.pur012-popup-grid-wrap {
  display: flex;
  min-height: 0;
  min-width: 0;
  flex: 1 1 auto;
  flex-direction: column;
  overflow: hidden;
}

.pur012-popup-grid-body {
  min-height: 12rem;
}
</style>
