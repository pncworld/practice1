/*--############################################################################
# Filename : CRM20_007RPT.vue
# Description : 매출관리 > 외상 거래 현황 > 거래처별일자별외상잔액.
# Date :2025-05-20
# Author : 권맑음
################################################################################*/
<template>
  <div class="flex h-full min-h-0 flex-col pl-5" @click="handleParentClick">
    <div
      class="flex w-full shrink-0 items-center justify-between overflow-y-hidden">
      <PageName></PageName>
      <div class="mr-9 flex justify-center space-x-2 pr-5">
        <button @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <button @click="excelButton" class="button save w-auto excel">
          엑셀
        </button>
      </div>
    </div>

    <div
      class="crm2007-search-panel z-10 mt-3 w-full min-h-0 shrink-0 overflow-visible rounded-lg bg-gray-200"
      :style="{
        '--crm2007-control-border': crm2007ControlBorder,
        '--crm2007-col-gap': crm2007ColGutter,
        '--crm2007-item-gap': crm2007ItemGap,
        '--crm2007-row-gap': crm2007RowGap,
        '--crm2007-label-col': crm2007LabelCol,
        '--crm2007-left-field-w': crm2007LeftFieldW,
      }">
      <div class="crm2007-search-grid min-w-0">
        <div class="crm2007-left-stack min-w-0">
          <div class="crm2007-lbl">사업장</div>
          <div class="crm2007-field crm2007-company min-w-0">
            <PickCustCompany
              omit-label
              filter-bar-align
              @excelStore="excelStore"
              @lngStoreCode="lngStoreCode" />
          </div>
          <div class="crm2007-lbl">조회기간</div>
          <div class="crm2007-field crm2007-date-slot min-w-0">
            <Datepicker2
              ref="datepicker"
              omit-main-label
              filter-bar-align
              :mainName="'조회기간'"
              :closePopUp="closePopUp"
              :initToday="1"
              @endDate="endDate"
              @excelDate="excelDate"
              @startDate="startDate" />
          </div>
        </div>
        <div class="crm2007-right-stack min-w-0 overflow-visible">
          <div class="crm2007-lbl">거래처</div>
          <div class="crm2007-field crm2007-belong min-w-0 overflow-visible">
            <PickBelongCust
              omit-label
              filter-bar-align
              :lngStoreCode="selectedStores"
              @excelList="excelList"
              @strSaleCustName="strSaleCustName"
              @strSaleCustID="strSaleCustID" />
          </div>
          <div class="crm2007-lbl">거래구분</div>
          <div class="crm2007-field crm2007-cond-row min-w-0">
            <select class="crm2007-select" v-model="cond">
              <option value="0">전체</option>
              <option value="1">입금</option>
              <option value="2">매출</option>
            </select>
            <label class="crm2007-check" for="crm2007-cond2">
              <input
                type="checkbox"
                id="crm2007-cond2"
                v-model="cond2"
                @click="changeCond" />소속거래처포함
            </label>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-2 flex min-h-0 min-w-0 flex-1 flex-col">
      <div class="relative min-h-0 w-full flex-1">
        <Realgrid
          class="h-full min-h-0 w-full"
          :progname="'CRM20_007RPT_VUE'"
          :progid="1"
          :rowData="rowData"
          :reload="reload"
          :valuesData="[['1', '2']]"
          :labelsData="[['입금', '매출']]"
          :labelingColumns="'strSaleTranType'"
          :documentTitle="'CRM20_007RPT'"
          :setFooter="true"
          :documentSubTitle="documentSubTitle"
          :rowStateeditable="false"
          :exporttoExcel="exportExcel" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { getBalancebyCustAndDate } from "@/api/micrm";
import Datepicker2 from "@/components/Datepicker2.vue";
import PageName from "@/components/pageName.vue";
import PickBelongCust from "@/components/pickBelongCust.vue";
import PickCustCompany from "@/components/pickCustCompany.vue";
import Realgrid from "@/components/realgrid.vue";
import { insertPageLog } from "@/customFunc/customFunc";
import Swal from "sweetalert2";
import { onMounted, ref } from "vue";
import { useStore } from "vuex";

const crm2007ControlBorder = "#cbd5e1";
const crm2007ColGutter = "1.5rem";
const crm2007ItemGap = "0.75rem";
const crm2007RowGap = "0.875rem";
const crm2007LabelCol = "5rem";
/** 조회기간 폭 = 사업장 필드 끝선 */
const crm2007LeftFieldW = "22rem";

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
});

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

const condValue = ref(0);
const store = useStore();
const cond = ref(0);
const cond2 = ref(true);

const changeCond = () => {
  cond2.value = !cond2.value;
};
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

const handleParentClick = (e) => {
  const datepickerEl = datepicker.value?.$el;
  if (datepickerEl && datepickerEl.contains(e.target)) {
    return;
  }
  closePopUp.value = !closePopUp.value;
};

const searchButton = async () => {
  if (selectedStores.value == 0) {
    Swal.fire({
      title: "경고",
      text: "사업장을 선택하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  try {
    store.state.loading = true;
    initGrid();

    const ccond2 = cond2.value == false ? 0 : 1;
    store.state.loading = true;
    const res = await getBalancebyCustAndDate(
      selectedStores.value,
      custId.value,
      startdate.value,
      enddate.value,
      cond.value,
      ccond2
    );
    store.state.loading = false;
    rowData.value = res.data.List;

    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
  } finally {
    store.state.loading = false;
  }
};

const selectedGroup = ref();
const selectedStores = ref();
const selectedStoreAttrs = ref();

const lngStoreCode = async (e) => {
  initGrid();
  selectedStores.value = e;
};

const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
};

const exportExcel = ref(false);
const exceldate = ref("");
const excelDate = (e) => {
  exceldate.value = e;
};

const excelButton = () => {
  documentSubTitle.value =
    selectedExcelStore.value +
    "\n" +
    selectedExcelList.value +
    "\n" +
    exceldate.value;
  exportExcel.value = !exportExcel.value;
};

const documentSubTitle = ref("");
const selectedExcelList = ref("");

const selectedExcelStore = ref("");

const excelStore = (e) => {
  selectedExcelStore.value = e;
};
const excelList = (e) => {
  selectedExcelList.value = e;
};

const enddate = ref("");
const endDate = (e) => {
  enddate.value = e;
};
const startdate = ref("");
const startDate = (e) => {
  startdate.value = e;
};
</script>

<style scoped>
.crm2007-search-panel {
  --crm2007-panel-pad-x: 5rem;
  --crm2007-row-min-h: 2rem;
  --crm2007-control-h: 2rem;
  box-sizing: border-box;
  padding-left: 0;
  padding-right: 0;
  padding-block: 0.75rem;
  overflow: visible;
}

@media (max-width: 1280px) {
  .crm2007-search-panel {
    --crm2007-panel-pad-x: 2.5rem;
  }
}

.crm2007-search-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: var(--crm2007-col-gap, 1.5rem);
  row-gap: var(--crm2007-row-gap, 0.875rem);
  align-items: start;
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  padding-left: var(--crm2007-panel-pad-x);
  padding-right: var(--crm2007-panel-pad-x);
}

.crm2007-left-stack {
  display: grid;
  grid-template-columns:
    var(--crm2007-label-col, 5rem)
    minmax(0, var(--crm2007-left-field-w, 22rem));
  column-gap: var(--crm2007-item-gap, 0.75rem);
  row-gap: var(--crm2007-row-gap, 0.875rem);
  align-items: center;
  width: 100%;
  max-width: 100%;
  min-width: 0;
}

.crm2007-right-stack {
  display: grid;
  grid-template-columns: var(--crm2007-label-col, 5rem) minmax(0, 1fr);
  column-gap: var(--crm2007-item-gap, 0.75rem);
  row-gap: var(--crm2007-row-gap, 0.875rem);
  align-items: center;
  width: 100%;
  min-width: 0;
}

.crm2007-lbl {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  min-height: var(--crm2007-row-min-h);
  font-size: 0.9375rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
  white-space: nowrap;
}

.crm2007-field {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  min-height: var(--crm2007-row-min-h);
  display: flex;
  align-items: center;
}

/* 사업장 끝선 = 조회기간 끝선 (left-field-w 채움) */
.crm2007-company {
  width: 100%;
  max-width: 100%;
  overflow: visible;
}

.crm2007-company :deep(> .flex) {
  display: flex !important;
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important;
}

.crm2007-company :deep(> .flex > div) {
  width: 100% !important;
  min-width: 0 !important;
  max-width: 100% !important;
  flex: 1 1 auto !important;
}

.crm2007-company :deep(.custom-select),
.crm2007-company :deep(.v-select) {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important;
  height: var(--crm2007-control-h) !important;
  min-height: var(--crm2007-control-h) !important;
  max-height: var(--crm2007-control-h) !important;
  font-size: 0.875rem !important;
  font-weight: 400 !important;
  line-height: 1.25rem !important;
  color: rgb(55 65 81) !important;
}

.crm2007-company :deep(.vs__dropdown-toggle) {
  box-sizing: border-box;
  height: var(--crm2007-control-h) !important;
  min-height: var(--crm2007-control-h) !important;
  max-height: var(--crm2007-control-h) !important;
  padding: 0 0.375rem !important;
  border: 1px solid var(--crm2007-control-border, #cbd5e1) !important;
  border-radius: 0.375rem !important;
  background-color: #fff !important;
  overflow: hidden !important;
  flex-wrap: nowrap !important;
  align-items: center !important;
}

.crm2007-company :deep(.vs__selected-options) {
  flex: 1 1 auto !important;
  flex-wrap: nowrap !important;
  min-width: 0 !important;
  max-width: 100% !important;
  overflow: hidden !important;
  padding: 0 !important;
  margin: 0 !important;
  align-items: center !important;
}

.crm2007-company :deep(.vs__selected),
.crm2007-company :deep(.vs__search) {
  display: block !important;
  box-sizing: border-box !important;
  font-size: 0.875rem !important;
  font-weight: 400 !important;
  line-height: calc(var(--crm2007-control-h) - 2px) !important;
  height: auto !important;
  min-height: 0 !important;
  min-width: 0 !important;
  max-width: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
  color: rgb(55 65 81) !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}

.crm2007-company :deep(.vs__actions) {
  padding: 0 2px 0 0 !important;
}

.crm2007-company :deep(.vs__clear) {
  display: none !important;
}

.crm2007-company :deep(.vs__open-indicator) {
  fill: rgb(107 114 128) !important;
  transform: scale(0.55) !important;
  transition: transform 0.15s ease;
}

.crm2007-company :deep(.vs--open .vs__open-indicator) {
  transform: scale(0.55) rotate(180deg) !important;
}

.crm2007-date-slot :deep(> div.flex.justify-start.items-center) {
  margin: 0 !important;
  width: 100% !important;
  max-width: 100%;
}

.crm2007-date-slot :deep(input[type="date"]) {
  box-sizing: border-box;
  height: var(--crm2007-control-h);
  min-height: var(--crm2007-control-h);
  max-height: var(--crm2007-control-h);
  border: 1px solid var(--crm2007-control-border, #cbd5e1);
  border-radius: 0.375rem;
  background: #fff;
}

.crm2007-date-slot :deep(div.inline-flex.h-8),
.crm2007-date-slot :deep(button) {
  height: var(--crm2007-control-h) !important;
  min-height: var(--crm2007-control-h) !important;
}

.crm2007-belong {
  position: relative;
  width: 100%;
  min-width: 0;
  overflow: visible;
}

.crm2007-belong :deep(.pbc-bar__code) {
  width: calc(5.5rem * 1.3);
  min-width: calc(4.5rem * 1.3);
}

.crm2007-belong :deep(.pbc-bar__name) {
  width: calc(9rem * 1.3);
  min-width: calc(6rem * 1.3);
  max-width: calc(11rem * 1.3);
  flex: 0 1 calc(9rem * 1.3);
}

.crm2007-cond-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem 1rem;
}

.crm2007-select {
  box-sizing: border-box;
  height: var(--crm2007-control-h);
  min-height: var(--crm2007-control-h);
  max-height: var(--crm2007-control-h);
  width: 8rem;
  max-width: 100%;
  padding: 0 0.5rem;
  border: 1px solid var(--crm2007-control-border, #cbd5e1);
  border-radius: 0.375rem;
  background: #fff;
  font-size: 0.875rem;
  color: rgb(55 65 81);
}

.crm2007-check {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.875rem;
  color: rgb(17 24 39);
  white-space: nowrap;
  cursor: pointer;
}

.crm2007-check input {
  margin: 0;
}

@media (max-width: 900px) {
  .crm2007-search-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .crm2007-left-stack {
    grid-template-columns: var(--crm2007-label-col, 5rem) minmax(0, 1fr);
  }
}
</style>
