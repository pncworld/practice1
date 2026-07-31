<!-- /*--############################################################################
# Filename : PUR01_010RPT.vue
# Description : 구매관리2 > 발주 관리 > 조회유형별 발주현황
# Date :2025-08-26
# Author : 권맑음
################################################################################*/ -->
<template>
  <div class="flex h-full min-h-0 flex-col" @click="handleParentClick">
    <div class="flex shrink-0 justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center mr-9 space-x-2 pr-5">
        <button type="button" @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <button type="button" @click="excelButton" class="button save w-auto excel">
          엑셀
        </button>
      </div>
    </div>

    <div
      class="pur010-search-panel z-10 mt-3 w-full min-h-0 shrink-0 rounded-lg bg-gray-200"
      :style="{
        '--pur010-control-border': pur010ControlBorder,
        '--pur010-col-gutter': pur010ColGutter,
        '--pur010-row-gap': pur010RowGap,
        '--pur010-label-col': pur010LabelCol,
        '--pur010-row-min-h': pur010RowMinH,
        '--pur010-control-h': pur010ControlH,
      }">
      <div class="pur010-wire-grid min-w-0">
        <div class="pur010-wire-cell">
          <div class="pur010-wire-label">납기일자</div>
          <div class="pur010-wire-field pur010-date-slot min-w-0 overflow-hidden">
            <Datepicker2
              ref="datepicker"
              omit-main-label
              filter-bar-align
              :mainName="'납기일자'"
              :initToday="1"
              :closePopUp="closePopUp"
              @excelDate="excelDate"
              @endDate="endDate"
              @startDate="startDate" />
          </div>
        </div>
        <div class="pur010-wire-cell">
          <div class="pur010-wire-label">매장선택</div>
          <div class="pur010-wire-field pur010-pick-slot min-w-0 w-full">
            <PickStore
              compact-search-bar
              :compact-store-combo-max-rem="18"
              main-name=""
              @update:storeGroup="lngStoreGroup"
              :defaultStoreNm="'전체'"
              :hideAttr="false"
              :hideGroup="false"
              :defaultStore="true"
              @storeNm="excelStore"
              :defaultStoreType2="true"
              @update:storeCd="lngStoreCode" />
          </div>
        </div>
        <div class="pur010-wire-cell">
          <div class="pur010-wire-label">거래처</div>
          <div class="pur010-wire-field pur010-bc-slot min-w-0 w-full max-w-full">
            <BusinessClient2
              compact-search-bar
              :default-nm="'전체'"
              @SupplierId="SupplierId" />
          </div>
        </div>

        <div class="pur010-wire-cell">
          <div class="pur010-wire-label">단위</div>
          <div class="pur010-wire-field min-w-0">
            <select
              id="pur01-010-unit"
              v-model="cond"
              class="pur010-sg-select">
              <option
                v-for="i in optionList"
                :key="i.strDCode"
                :value="i.strDCode">
                {{ i.strDName }}
              </option>
            </select>
          </div>
        </div>
        <div class="pur010-wire-cell pur010-wire-cell--span2 min-w-0">
          <div class="pur010-wire-label">자재명/코드</div>
          <div class="pur010-wire-field pur010-mat-row min-w-0">
            <select
              id="pur01-010-mat-kind"
              v-model="cond2"
              class="pur010-sg-select pur010-mat-kind">
              <option value="0">전체</option>
              <option value="1">분류</option>
              <option value="2">그룹</option>
              <option value="3">특성</option>
              <option value="4">재고조사주기</option>
            </select>
            <select
              id="pur01-010-mat-code"
              v-model="cond3"
              class="pur010-sg-select pur010-mat-code">
              <option value="0">전체</option>
              <option
                v-for="i in optionList2"
                :key="String(i.strDCode)"
                :value="i.strDCode">
                {{ i.strDName }}
              </option>
            </select>
            <input
              id="pur01-010-mat-keyword"
              v-model="cond4"
              type="text"
              placeholder="검색어"
              title="자재명·코드 키워드"
              class="pur010-sg-input pur010-mat-keyword" />
          </div>
        </div>

        <div class="pur010-wire-span">
          <div class="pur010-wire-span-label">조회유형</div>
          <div class="pur010-wire-span-radios pur010-wire-check">
            <label class="pur010-radio-label" for="pur01-010-type-0">
              <input id="pur01-010-type-0" v-model="cond5" type="radio" value="0" />
              자재별
            </label>
            <label class="pur010-radio-label" for="pur01-010-type-1">
              <input id="pur01-010-type-1" v-model="cond5" type="radio" value="1" />
              일자별 자재별
            </label>
            <label class="pur010-radio-label" for="pur01-010-type-2">
              <input id="pur01-010-type-2" v-model="cond5" type="radio" value="2" />
              매장별 자재별
            </label>
            <label class="pur010-radio-label" for="pur01-010-type-3">
              <input id="pur01-010-type-3" v-model="cond5" type="radio" value="3" />
              거래처별 자재별
            </label>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-2 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <Realgrid
        class="pur010-grid-body min-h-0 w-full flex-1"
        :progname="'PUR01_010RPT_VUE'"
        :progid="progid"
        :rowData="rowData"
        :reload="reload"
        :documentTitle="'PUR01_010RPT'"
        :documentSubTitle="documentSubTitle"
        :rowStateeditable="false"
        :exporttoExcel="exportExcel" />
    </div>
  </div>
</template>

<script setup>
import { getCommonList } from "@/api/common";
import { getStockCategory, getStockGeneric, getStockGroup } from "@/api/master";
import { getOrderListByType } from "@/api/mipur";
import BusinessClient2 from "@/components/businessClient2.vue";
import Datepicker2 from "@/components/Datepicker2.vue";
import PageName from "@/components/pageName.vue";
import PickStore from "@/components/pickStore.vue";
import Realgrid from "@/components/realgrid.vue";
import { insertPageLog } from "@/customFunc/customFunc";
import { onMounted, ref, watch } from "vue";
import { useStore } from "vuex";

const pur010ControlBorder = "#cbd5e1";
const pur010ColGutter = "1.25rem";
const pur010RowGap = "0.75rem";
const pur010LabelCol = "5.75rem";
const pur010RowMinH = "2rem";
const pur010ControlH = "2rem";

const store = useStore();
const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

const cond = ref("02");
const cond2 = ref(0);
const cond3 = ref(0);
const cond4 = ref("");
const cond5 = ref(0);

const datepicker = ref(null);
const closePopUp = ref(false);
const optionList = ref([]);
const optionList2 = ref([]);

onMounted(async () => {
  await insertPageLog(store.state.activeTab2);

  const res = await getCommonList(27);
  optionList.value = res.data.List.filter((item) => item.strDCode !== "01");
});

const handleParentClick = (e) => {
  const datepickerEl = datepicker.value?.$el;
  if (datepickerEl && datepickerEl.contains(e.target)) {
    return;
  }
  closePopUp.value = !closePopUp.value;
};

const sDate = ref();
const eDate = ref();
const startDate = (e) => {
  initGrid();
  sDate.value = e;
};
const endDate = (e) => {
  initGrid();
  eDate.value = e;
};

const selectedDate = ref();
const excelDate = (e) => {
  selectedDate.value = e;
};

watch(cond2, async () => {
  if (cond2.value == 1) {
    const res2 = await getStockCategory(store.state.userData.lngStoreGroup);
    optionList2.value = res2.data.List.map((item) => ({
      ...item,
      strDCode: item.lngCategoryID,
      strDName: item.strCategoryName,
    }));
  } else if (cond2.value == 2) {
    const res = await getStockGroup(store.state.userData.lngStoreGroup);
    optionList2.value = res.data.List.map((item) => ({
      ...item,
      strDCode: item.lngStockGroupID,
      strDName: item.strStockGroupName,
    }));
  } else if (cond2.value == 3) {
    const res3 = await getStockGeneric(store.state.userData.lngStoreGroup);
    optionList2.value = res3.data.List.map((item) => ({
      ...item,
      strDCode: item.lngGenericID,
      strDName: item.strGenericName,
    }));
  } else {
    optionList2.value = [];
  }
  cond3.value = 0;
});

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

    const getIp = await fetch("https://api.ipify.org?format=json");
    const ip = await getIp.json();
    const res = await getOrderListByType(
      groupCd.value,
      0,
      storeCode.value,
      sDate.value.replaceAll("-", ""),
      eDate.value.replaceAll("-", ""),
      supplierid.value,
      cond.value,
      cond2.value,
      cond3.value,
      cond4.value,
      cond5.value,
      store.state.userData.lngSequence,
      ip.ip
    );

    rowData.value = res.data.List;
    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
  } finally {
    store.state.loading = false;
  }
};

const progid = ref(1);
const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }

  if (cond5.value == 0) {
    progid.value = 1;
  } else if (cond5.value == 1) {
    progid.value = 2;
  } else if (cond5.value == 2) {
    progid.value = 3;
  } else if (cond5.value == 3) {
    progid.value = 4;
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
</script>

<style scoped>
.pur010-search-panel {
  --pur010-panel-pad-x: 2rem;
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  padding-left: 0;
  padding-right: 0;
  padding-block: 0.75rem;
  overflow-x: auto;
}

@media (min-width: 640px) {
  .pur010-search-panel {
    --pur010-panel-pad-x: 2.5rem;
  }
}

@media (min-width: 768px) {
  .pur010-search-panel {
    --pur010-panel-pad-x: 3rem;
  }
}

@media (min-width: 1024px) {
  .pur010-search-panel {
    --pur010-panel-pad-x: 3.5rem;
  }
}

.pur010-wire-grid {
  display: grid;
  width: max(100%, max-content);
  min-width: 100%;
  box-sizing: border-box;
  padding-left: var(--pur010-panel-pad-x);
  padding-right: var(--pur010-panel-pad-x);
  align-items: center;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  column-gap: var(--pur010-col-gutter);
  row-gap: var(--pur010-row-gap);
}

.pur010-wire-cell {
  display: flex;
  min-width: 0;
  min-height: var(--pur010-row-min-h);
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}

.pur010-wire-cell--span2 {
  grid-column: span 2;
}

.pur010-wire-label {
  flex: 0 0 var(--pur010-label-col);
  width: var(--pur010-label-col);
  min-width: 0;
  max-width: var(--pur010-label-col);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: var(--pur010-row-min-h);
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pur010-wire-field {
  display: flex;
  min-width: 0;
  max-width: 100%;
  flex: 1 1 auto;
  align-items: center;
  min-height: var(--pur010-row-min-h);
}

.pur010-wire-field:not(.pur010-mat-row) > * {
  min-width: 0;
  width: 100%;
}

.pur010-mat-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 2fr);
  column-gap: 0.5rem;
  align-items: center;
  min-width: 0;
  max-width: 100%;
}

.pur010-mat-row > * {
  box-sizing: border-box;
  min-width: 0;
  max-width: 100%;
}

.pur010-wire-span {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  min-height: var(--pur010-row-min-h);
}

.pur010-wire-span-label {
  flex: 0 0 var(--pur010-label-col);
  width: var(--pur010-label-col);
  min-width: 0;
  max-width: var(--pur010-label-col);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: var(--pur010-row-min-h);
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pur010-wire-span-radios {
  display: flex;
  min-width: 0;
  flex: 1 1 auto;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.65rem 1.1rem;
  max-width: 100%;
}

.pur010-wire-check,
.pur010-radio-label {
  display: inline-flex;
  align-items: center;
  min-height: var(--pur010-row-min-h);
  gap: 0.375rem;
  font-size: 0.875rem;
  line-height: 1.25;
  white-space: nowrap;
  cursor: pointer;
}

.pur010-radio-label input[type="radio"] {
  margin: 0;
  flex-shrink: 0;
}

.pur010-sg-select,
.pur010-sg-input {
  box-sizing: border-box;
  height: var(--pur010-control-h);
  min-height: var(--pur010-control-h);
  max-height: var(--pur010-control-h);
  width: 100%;
  min-width: 0;
  padding: 0 0.375rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: rgb(55 65 81);
  background: #fff;
  border: 1px solid var(--pur010-control-border);
  border-radius: 0.375rem;
}

.pur010-sg-select:focus,
.pur010-sg-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.2);
}

.pur010-search-panel .pur010-pick-slot :deep(select),
.pur010-search-panel .pur010-pick-slot :deep(.pickstore-vs-shell),
.pur010-search-panel .pur010-bc-slot :deep(.pickstore-vs-shell) {
  box-sizing: border-box !important;
  height: var(--pur010-control-h) !important;
  min-height: var(--pur010-control-h) !important;
  max-height: var(--pur010-control-h) !important;
  border: 1px solid var(--pur010-control-border) !important;
  border-radius: 0.375rem !important;
  font-size: 0.875rem !important;
  background: #fff !important;
}

.pur010-search-panel .pur010-pick-slot :deep(select) {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important;
  margin-left: 0 !important;
  padding: 0 0.375rem !important;
}

.pur010-search-panel .pur010-pick-slot :deep(.pickstore-vs-shell),
.pur010-search-panel .pur010-bc-slot :deep(.pickstore-vs-shell) {
  max-width: 100%;
  min-width: 0;
}

.pur010-search-panel .pur010-pick-slot :deep(div.relative.min-w-0.flex-1) {
  max-width: 100% !important;
}

.pur010-pick-slot :deep(> div.flex.text-base) {
  width: 100%;
  min-width: 0;
  margin: 0 !important;
  gap: var(--pur010-col-gutter) !important;
}

.pur010-pick-slot :deep(> div.flex > div:first-child) {
  display: none;
}

.pur010-bc-slot :deep(> div.flex.text-base) {
  margin: 0 !important;
  width: 100%;
  min-width: 0;
  gap: 0 !important;
}

.pur010-pick-slot :deep(.vs__dropdown-toggle),
.pur010-bc-slot :deep(.vs__dropdown-toggle) {
  height: 100% !important;
  min-height: 0 !important;
  border: none !important;
}

.pur010-search-panel .pur010-date-slot :deep(> div.flex.justify-start.items-center) {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0;
  margin: 0 !important;
  gap: 0.25rem !important;
}

.pur010-search-panel .pur010-date-slot :deep(> div.flex > div.inline-flex.h-8) {
  flex: 1 1 auto;
  min-width: 0;
  max-width: 100%;
  width: 100%;
  gap: 0.125rem !important;
}

.pur010-search-panel .pur010-date-slot :deep(input[type="date"]) {
  box-sizing: border-box;
  height: var(--pur010-control-h) !important;
  min-height: var(--pur010-control-h) !important;
  max-height: var(--pur010-control-h) !important;
  border: 1px solid var(--pur010-control-border) !important;
  width: auto !important;
  flex: 1 1 0;
  min-width: 5.25rem;
  max-width: none;
  padding-left: 0.45rem;
  padding-right: 0.25rem;
  font-size: 0.875rem;
}

.pur010-search-panel .pur010-date-slot :deep(input[type="date"]:focus) {
  border-color: #3b82f6 !important;
}

.pur010-search-panel .pur010-date-slot :deep(div.inline-flex.h-8 > span) {
  flex-shrink: 0;
}

.pur010-search-panel .pur010-date-slot :deep(div.inline-flex.h-8 > button) {
  flex-shrink: 0;
  width: 1.65rem !important;
  height: 1.65rem !important;
  min-width: 1.65rem;
  margin-left: 0 !important;
}

.pur010-grid-body {
  min-height: 12rem;
}
</style>
