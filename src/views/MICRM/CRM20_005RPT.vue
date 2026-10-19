/*--############################################################################
# Filename : CRM20_005RPT.vue
# Description : 매출관리 > 외상 거래 현황 > 외상거래처원장.
# Date :2025-05-19
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
      class="crm2005-search-panel z-10 mt-3 w-full min-h-0 shrink-0 overflow-visible rounded-lg bg-gray-200"
      :style="{
        '--crm2005-control-border': crm2005ControlBorder,
        '--crm2005-col-gap': crm2005ColGutter,
        '--crm2005-item-gap': crm2005ItemGap,
        '--crm2005-row-gap': crm2005RowGap,
        '--crm2005-label-col': crm2005LabelCol,
        '--crm2005-left-field-w': crm2005LeftFieldW,
      }">
      <div class="crm2005-search-grid min-w-0">
        <div class="crm2005-left-stack min-w-0">
          <div class="crm2005-lbl">사업장</div>
          <div class="crm2005-field crm2005-company min-w-0">
            <PickCustCompany
              omit-label
              filter-bar-align
              @excelStore="excelStore"
              @lngStoreCode="lngStoreCode" />
          </div>
          <div class="crm2005-lbl">구분</div>
          <div class="crm2005-field crm2005-radio-row min-w-0">
            <label class="crm2005-radio" for="crm2005-cond0">
              <input
                type="radio"
                id="crm2005-cond0"
                name="crm2005-condtype"
                value="0"
                v-model="condValue" />전체
            </label>
            <label class="crm2005-radio" for="crm2005-cond1">
              <input
                type="radio"
                id="crm2005-cond1"
                name="crm2005-condtype"
                value="1"
                v-model="condValue" />개인
            </label>
            <label class="crm2005-radio" for="crm2005-cond2">
              <input
                type="radio"
                id="crm2005-cond2"
                name="crm2005-condtype"
                value="2"
                v-model="condValue" />단체
            </label>
          </div>
        </div>

        <div class="crm2005-right-stack min-w-0 overflow-visible">
          <div class="crm2005-lbl">거래처</div>
          <div class="crm2005-field crm2005-belong min-w-0 overflow-visible">
            <PickBelongCust
              omit-label
              filter-bar-align
              :lngStoreCode="selectedStores"
              @excelList="excelList"
              @strSaleCustName="strSaleCustName"
              @strSaleCustID="strSaleCustID" />
          </div>
        </div>
      </div>
    </div>

    <div class="mt-2 flex min-h-0 min-w-0 flex-1 flex-col">
      <div class="relative min-h-0 w-full flex-1">
        <Realgrid
          class="h-full min-h-0 w-full"
          :progname="'CRM20_005RPT_VUE'"
          :progid="1"
          :rowData="rowData"
          :reload="reload"
          :documentTitle="'CRM20_005RPT'"
          :documentSubTitle="documentSubTitle"
          :rowStateeditable="false"
          :exporttoExcel="exportExcel" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { getBelongCustList } from "@/api/micrm";
import PageName from "@/components/pageName.vue";
import PickBelongCust from "@/components/pickBelongCust.vue";
import PickCustCompany from "@/components/pickCustCompany.vue";
import Realgrid from "@/components/realgrid.vue";
import { insertPageLog } from "@/customFunc/customFunc";
import Swal from "sweetalert2";
import { onMounted, ref } from "vue";
import { useStore } from "vuex";

/** 조회 AREA — 2열 균등 + 앞뒤 pad 동일 */
const crm2005ControlBorder = "#cbd5e1";
const crm2005ColGutter = "1.5rem";
const crm2005ItemGap = "0.75rem";
const crm2005RowGap = "0.875rem";
const crm2005LabelCol = "5rem";
/** 006/007/009 조회기간·사업장과 동일 폭 */
const crm2005LeftFieldW = "22rem";

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
});

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

const condValue = ref(0);
const store = useStore();

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
      text: "사업장을 먼저 선택하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  try {
    store.state.loading = true;
    initGrid();

    const res = await getBelongCustList(
      selectedStores.value,
      custId.value,
      condValue.value
    );
    rowData.value = res.data.List;
    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
  } finally {
    store.state.loading = false;
  }
};

const selectedStores = ref(0);
const lngStoreCode = (e) => {
  selectedStores.value = e;
  initGrid();
};

const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
};

const exportExcel = ref(false);

const excelButton = () => {
  documentSubTitle.value =
    selectedExcelStore.value + "\n" + selectedExcelList.value;

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
</script>

<style scoped>
.crm2005-search-panel {
  --crm2005-panel-pad-x: 7rem;
  --crm2005-row-min-h: 2rem;
  --crm2005-control-h: 2rem;
  box-sizing: border-box;
  padding-left: 0;
  padding-right: 0;
  padding-block: 0.75rem;
  overflow: visible;
}

@media (max-width: 1280px) {
  .crm2005-search-panel {
    --crm2005-panel-pad-x: 2.5rem;
  }
}

.crm2005-search-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: var(--crm2005-col-gap, 1.5rem);
  row-gap: var(--crm2005-row-gap, 0.875rem);
  align-items: start;
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  padding-left: var(--crm2005-panel-pad-x);
  padding-right: var(--crm2005-panel-pad-x);
}

.crm2005-left-stack {
  display: grid;
  /* 사업장 폭 = 006/007/009 조회기간·사업장 (22rem) */
  grid-template-columns:
    var(--crm2005-label-col, 5rem)
    minmax(0, var(--crm2005-left-field-w, 22rem));
  column-gap: var(--crm2005-item-gap, 0.75rem);
  row-gap: var(--crm2005-row-gap, 0.875rem);
  align-items: center;
  width: 100%;
  max-width: 100%;
  min-width: 0;
}

.crm2005-right-stack {
  display: grid;
  grid-template-columns: var(--crm2005-label-col, 5rem) minmax(0, 1fr);
  column-gap: var(--crm2005-item-gap, 0.75rem);
  row-gap: var(--crm2005-row-gap, 0.875rem);
  align-items: center;
  width: 100%;
  min-width: 0;
}

.crm2005-lbl {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  min-height: var(--crm2005-row-min-h);
  font-size: 0.9375rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
  white-space: nowrap;
}

.crm2005-field {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  min-height: var(--crm2005-row-min-h);
  display: flex;
  align-items: center;
}

/* 사업장 — 006/007/009 left-field-w와 동일 */
.crm2005-company {
  width: 100%;
  max-width: 100%;
  overflow: visible;
}

.crm2005-company :deep(> .flex) {
  display: flex !important;
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important;
}

.crm2005-company :deep(> .flex > div) {
  width: 100% !important;
  min-width: 0 !important;
  max-width: 100% !important;
  flex: 1 1 auto !important;
}

.crm2005-company :deep(.custom-select),
.crm2005-company :deep(.v-select) {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important;
  height: var(--crm2005-control-h) !important;
  min-height: var(--crm2005-control-h) !important;
  max-height: var(--crm2005-control-h) !important;
  font-size: 0.875rem !important;
  font-weight: 400 !important;
  line-height: 1.25rem !important;
  color: rgb(55 65 81) !important;
}

.crm2005-company :deep(.vs__dropdown-toggle) {
  box-sizing: border-box;
  height: var(--crm2005-control-h) !important;
  min-height: var(--crm2005-control-h) !important;
  max-height: var(--crm2005-control-h) !important;
  padding: 0 0.375rem !important;
  border: 1px solid var(--crm2005-control-border, #cbd5e1) !important;
  border-radius: 0.375rem !important;
  background-color: #fff !important;
  overflow: hidden !important;
  flex-wrap: nowrap !important;
  align-items: center !important;
}

.crm2005-company :deep(.vs__selected-options) {
  flex: 1 1 auto !important;
  flex-wrap: nowrap !important;
  min-width: 0 !important;
  max-width: 100% !important;
  overflow: hidden !important;
  padding: 0 !important;
  margin: 0 !important;
  align-items: center !important;
}

.crm2005-company :deep(.vs__selected),
.crm2005-company :deep(.vs__search) {
  display: block !important;
  box-sizing: border-box !important;
  font-size: 0.875rem !important;
  font-weight: 400 !important;
  line-height: calc(var(--crm2005-control-h) - 2px) !important;
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

.crm2005-company :deep(.vs__actions) {
  padding: 0 2px 0 0 !important;
}

.crm2005-company :deep(.vs__clear) {
  display: none !important;
}

.crm2005-company :deep(.vs__open-indicator) {
  fill: rgb(107 114 128) !important;
  transform: scale(0.55) !important;
  transition: transform 0.15s ease;
}

.crm2005-company :deep(.vs--open .vs__open-indicator) {
  transform: scale(0.55) rotate(180deg) !important;
}

.crm2005-belong {
  position: relative;
  width: 100%;
  min-width: 0;
  overflow: visible;
}

/* 거래처 코드·명 입력 1.3배 (위치·버튼 유지) */
.crm2005-belong :deep(.pbc-bar__code) {
  width: calc(5.5rem * 1.3);
  min-width: calc(4.5rem * 1.3);
}

.crm2005-belong :deep(.pbc-bar__name) {
  width: calc(9rem * 1.3);
  min-width: calc(6rem * 1.3);
  max-width: calc(11rem * 1.3);
  flex: 0 1 calc(9rem * 1.3);
}

.crm2005-radio-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 1rem;
}

.crm2005-radio {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.875rem;
  color: rgb(17 24 39);
  white-space: nowrap;
  cursor: pointer;
}

.crm2005-radio input {
  margin: 0;
}

@media (max-width: 900px) {
  .crm2005-search-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .crm2005-left-stack {
    grid-template-columns: var(--crm2005-label-col, 5rem) minmax(0, 1fr);
  }
}
</style>
