<!-- /*--############################################################################
# Filename : PUR01_026RPT.vue
# Description : 구매관리2 > 매입 관리 > 발주 미확정 현황.
# Date :2025-09-29
# Author : 권지안
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
      class="pur026-search-panel z-10 mt-3 w-full min-h-0 shrink-0 rounded-lg bg-gray-200"
      :style="{
        '--pur026-control-border': pur026ControlBorder,
        '--pur026-col-gutter': pur026ColGutter,
        '--pur026-row-gap': pur026RowGap,
        '--pur026-label-col': pur026LabelCol,
        '--pur026-row-min-h': pur026RowMinH,
        '--pur026-control-h': pur026ControlH,
      }">
      <div class="pur026-wire-grid min-w-0">
        <div class="pur026-wire-cell">
          <div class="pur026-wire-label">납기일자</div>
          <div class="pur026-wire-field pur026-date-slot min-w-0 overflow-hidden">
            <Datepicker2
              ref="datepicker"
              omit-main-label
              filter-bar-align
              :mainName="'납기일자'"
              :initToday="0"
              :closePopUp="closePopUp"
              @excelDate="excelDate"
              @endDate="endDate"
              @startDate="startDate" />
          </div>
        </div>
        <div class="pur026-wire-cell">
          <div class="pur026-wire-label">매장명</div>
          <div class="pur026-wire-field pur026-mat-row pur026-pick-slot-full min-w-0 w-full">
            <PickStore
              @update:storeGroup="lngStoreGroup"
              @update:storeType="lngStoreAttrs"
              :default-store-nm="'전체'"
              :defaultStore="true"
              :defaultStoreType2="true"
              @storeNm="excelStore"
              @update:storeCd="lngStoreCode" />
          </div>
        </div>
        <div class="pur026-wire-cell">
          <div class="pur026-wire-label">거래처</div>
          <div class="pur026-wire-field pur026-bc-slot min-w-0 w-full max-w-full">
            <BusinessClient
              compact-search-bar
              @SupplierId="SupplierId" />
          </div>
        </div>

        <div class="pur026-wire-cell">
          <div class="pur026-wire-label">단위</div>
          <div class="pur026-wire-field min-w-0">
            <select
              id="pur01-026-cond-unit"
              class="pur026-sg-select"
              v-model="cond">
              <option
                v-for="i in optionList"
                :key="i.strDCode"
                :value="i.strDCode">
                {{ i.strDName }}
              </option>
            </select>
          </div>
        </div>
        <div class="pur026-wire-cell">
          <div class="pur026-wire-label">확정구분</div>
          <div class="pur026-wire-field min-w-0">
            <select
              id="pur01-026-cond-confirm"
              class="pur026-sg-select"
              v-model="cond2">
              <option
                v-for="i in optionList2"
                :key="i.strDCode"
                :value="i.strDCode">
                {{ i.strDName }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-2 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <Realgrid
        class="pur026-grid-body min-h-0 w-full flex-1"
        :progname="'PUR01_026RPT_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :setStateBar="false"
        :rowStateeditable="false"
        :setFooter="false"
        :documentTitle="'PUR01_026RPT'"
        :selectionStyle="'block'"
        :exporttoExcel="exportExcel"
        :documentSubTitle="documentSubTitle" />
    </div>
  </div>
</template>

<script setup>
import { getCommonList } from "@/api/common";
import { getOrderUnconfirmedStatus } from "@/api/mipur";
import BusinessClient from "@/components/businessClient2.vue";
import Datepicker2 from "@/components/Datepicker2.vue";
import PageName from "@/components/pageName.vue";
import PickStore from "@/components/pickStore.vue";
import Realgrid from "@/components/realgrid.vue";
import { insertPageLog } from "@/customFunc/customFunc";
import { onMounted, ref } from "vue";
import { useStore } from "vuex";

const pur026ControlBorder = "#cbd5e1";
const pur026ColGutter = "1.25rem";
const pur026RowGap = "0.75rem";
const pur026LabelCol = "5.75rem";
const pur026RowMinH = "2rem";
const pur026ControlH = "2rem";

const store = useStore();
const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

const cond = ref("02");
const cond2 = ref("01");

const datepicker = ref(null);
const closePopUp = ref(false);
const optionList = ref([]);
const optionList2 = ref([]);

onMounted(async () => {
  await insertPageLog(store.state.activeTab2);

  const res = await getCommonList(27);
  optionList.value = res.data.List.filter((item) => item.strDCode != "01");

  const res2 = await getCommonList(24);
  optionList2.value = res2.data.List;
});

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

const storeAttr = ref(0);
const lngStoreAttrs = (e) => {
  storeAttr.value = e;
};

const supplierid = ref("");
const SupplierId = (e) => {
  supplierid.value = e;
};

const searchButton = async () => {
  try {
    store.state.loading = true;
    initGrid();

    const s = String(sDate.value ?? "").replaceAll("-", "");
    const e = String(eDate.value ?? "").replaceAll("-", "");
    const res = await getOrderUnconfirmedStatus(
      groupCd.value,
      storeCode.value,
      s,
      e,
      supplierid.value,
      cond.value,
      cond2.value,
      0
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
const documentSubTitle = ref("");
const selectedExcelStore = ref("");

const excelButton = () => {
  documentSubTitle.value =
    selectedDate.value + "\n" + "매장명 :" + selectedExcelStore.value;
  exportExcel.value = !exportExcel.value;
};

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
.pur026-search-panel {
  --pur026-panel-pad-x: 2rem;
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  padding-left: 0;
  padding-right: 0;
  padding-block: 0.75rem;
  overflow-x: auto;
}

@media (min-width: 640px) {
  .pur026-search-panel {
    --pur026-panel-pad-x: 2.5rem;
  }
}

@media (min-width: 768px) {
  .pur026-search-panel {
    --pur026-panel-pad-x: 3rem;
  }
}

@media (min-width: 1024px) {
  .pur026-search-panel {
    --pur026-panel-pad-x: 3.5rem;
  }
}

.pur026-wire-grid {
  display: grid;
  width: max(100%, max-content);
  min-width: 100%;
  box-sizing: border-box;
  padding-left: var(--pur026-panel-pad-x);
  padding-right: var(--pur026-panel-pad-x);
  align-items: center;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  column-gap: var(--pur026-col-gutter);
  row-gap: var(--pur026-row-gap);
}

.pur026-wire-cell {
  display: flex;
  min-width: 0;
  min-height: var(--pur026-row-min-h);
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}

.pur026-wire-label {
  flex: 0 0 var(--pur026-label-col);
  width: var(--pur026-label-col);
  min-width: 0;
  max-width: var(--pur026-label-col);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: var(--pur026-row-min-h);
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pur026-wire-field {
  display: flex;
  min-width: 0;
  max-width: 100%;
  flex: 1 1 auto;
  align-items: center;
  min-height: var(--pur026-row-min-h);
}

.pur026-wire-field:not(.pur026-mat-row) > * {
  min-width: 0;
  width: 100%;
}

.pur026-mat-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 2fr);
  column-gap: 0.5rem;
  align-items: center;
  min-width: 0;
  max-width: 100%;
}

.pur026-mat-row > * {
  box-sizing: border-box;
  min-width: 0;
  max-width: 100%;
}

.pur026-sg-select {
  box-sizing: border-box;
  height: var(--pur026-control-h);
  min-height: var(--pur026-control-h);
  max-height: var(--pur026-control-h);
  width: 100%;
  min-width: 0;
  padding: 0 0.375rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: rgb(55 65 81);
  background: #fff;
  border: 1px solid var(--pur026-control-border);
  border-radius: 0.375rem;
}

.pur026-sg-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.2);
}

.pur026-search-panel .pur026-bc-slot :deep(.pickstore-vs-shell) {
  box-sizing: border-box !important;
  height: var(--pur026-control-h) !important;
  min-height: var(--pur026-control-h) !important;
  max-height: var(--pur026-control-h) !important;
  border: 1px solid var(--pur026-control-border) !important;
  border-radius: 0.375rem !important;
  font-size: 0.875rem !important;
  background: #fff !important;
  max-width: 100%;
  min-width: 0;
}

.pur026-bc-slot :deep(> div.flex.text-base) {
  margin: 0 !important;
  width: 100%;
  min-width: 0;
  gap: 0 !important;
}

.pur026-bc-slot :deep(.vs__dropdown-toggle) {
  height: 100% !important;
  min-height: 0 !important;
  border: none !important;
}

/* 매장명: 그룹·구분·매장 3콤보 (1fr 1fr 2fr) */
.pur026-pick-slot-full :deep(> div.flex.text-base) {
  display: contents;
  margin: 0;
}

.pur026-pick-slot-full :deep(> div.flex.text-base > div:first-child) {
  display: none !important;
}

.pur026-pick-slot-full :deep(> div.flex.text-base > div:nth-child(2) select),
.pur026-pick-slot-full :deep(> div.flex.text-base > div:nth-child(3) select) {
  display: block !important; /* PickStore hidden md:inline-block 덮어 그룹·구분 항상 표시 */
  margin-left: 0 !important;
  height: var(--pur026-control-h) !important;
  min-height: var(--pur026-control-h) !important;
  max-height: var(--pur026-control-h) !important;
  padding: 0 0.375rem !important;
  font-size: 0.875rem !important;
  line-height: 1.25rem;
  box-sizing: border-box;
  width: 100% !important;
  max-width: 100%;
  border: 1px solid var(--pur026-control-border) !important;
  border-radius: 0.375rem !important;
  background: #fff !important;
}

.pur026-pick-slot-full :deep(> div.flex.text-base > div:nth-child(4)) {
  margin-left: 0 !important;
  width: 100% !important;
  min-width: 0;
  max-width: 100%;
}

.pur026-pick-slot-full :deep(> div.flex.text-base > div:nth-child(4) > div:first-child),
.pur026-pick-slot-full :deep(.pickstore-vs-shell) {
  height: var(--pur026-control-h) !important;
  min-height: var(--pur026-control-h) !important;
  max-height: var(--pur026-control-h) !important;
  width: 100% !important;
  max-width: 100%;
  border-radius: 0.375rem !important;
  font-size: 0.875rem !important;
  line-height: 1.25rem;
  box-sizing: border-box;
  border: 1px solid var(--pur026-control-border) !important;
  background: #fff !important;
}

.pur026-pick-slot-full :deep(.vs__dropdown-toggle) {
  height: 100% !important;
  min-height: 0 !important;
  border: none !important;
}

.pur026-search-panel .pur026-date-slot :deep(> div.flex.justify-start.items-center) {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0;
  margin: 0 !important;
  gap: 0.25rem !important;
}

.pur026-search-panel .pur026-date-slot :deep(> div.flex > div.inline-flex.h-8) {
  flex: 1 1 auto;
  min-width: 0;
  max-width: 100%;
  width: 100%;
  gap: 0.125rem !important;
}

.pur026-search-panel .pur026-date-slot :deep(input[type="date"]) {
  box-sizing: border-box;
  height: var(--pur026-control-h) !important;
  min-height: var(--pur026-control-h) !important;
  max-height: var(--pur026-control-h) !important;
  border: 1px solid var(--pur026-control-border) !important;
  width: auto !important;
  flex: 1 1 0;
  min-width: 5.25rem;
  max-width: none;
  padding-left: 0.45rem;
  padding-right: 0.25rem;
  font-size: 0.875rem;
}

.pur026-search-panel .pur026-date-slot :deep(input[type="date"]:focus) {
  border-color: #3b82f6 !important;
}

.pur026-search-panel .pur026-date-slot :deep(div.inline-flex.h-8 > span) {
  flex-shrink: 0;
}

.pur026-search-panel .pur026-date-slot :deep(div.inline-flex.h-8 > button) {
  flex-shrink: 0;
  width: 1.65rem !important;
  height: 1.65rem !important;
  min-width: 1.65rem;
  margin-left: 0 !important;
}

.pur026-grid-body {
  min-height: 12rem;
}
</style>
