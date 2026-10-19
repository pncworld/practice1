/*--############################################################################
# Filename : CRM20_009RPT.vue
# Description : 매출관리 > 외상 거래 현황 > 영수증별외상매출조회.
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
      class="crm2009-search-panel z-10 mt-3 w-full min-h-0 shrink-0 overflow-visible rounded-lg bg-gray-200"
      :style="{
        '--crm2009-control-border': crm2009ControlBorder,
        '--crm2009-col-gap': crm2009ColGutter,
        '--crm2009-item-gap': crm2009ItemGap,
        '--crm2009-row-gap': crm2009RowGap,
        '--crm2009-label-col': crm2009LabelCol,
        '--crm2009-left-field-w': crm2009LeftFieldW,
      }">
      <div class="crm2009-search-grid min-w-0">
        <!-- 좌: 라벨열+필드열 오와열 (사업장 끝 = 조회기간 끝) -->
        <div class="crm2009-left-stack min-w-0">
          <div class="crm2009-lbl">사업장</div>
          <div class="crm2009-field crm2009-company min-w-0">
            <PickCustCompany
              omit-label
              filter-bar-align
              @excelStore="excelStore"
              @lngStoreCode="lngStoreCode" />
          </div>
          <div class="crm2009-lbl">조회기간</div>
          <div class="crm2009-field crm2009-date-slot min-w-0">
            <Datepicker2
              ref="datepicker"
              omit-main-label
              filter-bar-align
              :mainName="'조회기간'"
              :closePopUp="closePopUp"
              :initToday="1"
              :makeSevenTerm="true"
              @endDate="endDate"
              @excelDate="excelDate"
              @startDate="startDate" />
          </div>
        </div>
        <!-- 우: 동일 라벨폭·동일 gap → 거래처/매장 시작선 정렬 -->
        <div class="crm2009-right-stack min-w-0 overflow-visible">
          <div class="crm2009-lbl">거래처</div>
          <div class="crm2009-field crm2009-belong-wrap min-w-0 overflow-visible">
            <div class="crm2009-belong min-w-0">
              <PickBelongCust
                omit-label
                filter-bar-align
                :lngStoreCode="selectedStores"
                @excelList="excelList"
                @strSaleCustName="strSaleCustName"
                @strSaleCustID="strSaleCustID" />
            </div>
            <label class="crm2009-check" for="crm2009-cond2">
              <input
                type="checkbox"
                id="crm2009-cond2"
                v-model="cond2"
                @click="changeCond" />소속거래처포함
            </label>
          </div>
          <div class="crm2009-lbl">매장</div>
          <div
            class="crm2009-field crm2009-pick-slot crm2009-pick-slot--store-grid min-w-0 overflow-visible">
            <PickStoreRenew
              compact
              omit-main-label
              combo-fill
              main-name="매장"
              :placeholder-name="'전체'"
              @lngStoreAttrs="lngStoreAttrs"
              @lngStoreCode="lngStoreCode2"
              @lngStoreGroup="lngStoreGroup"
              @excelStore="excelStore2" />
          </div>
        </div>
      </div>
    </div>

    <div class="mt-2 flex min-h-0 min-w-0 flex-1 flex-col">
      <div class="relative min-h-0 w-full flex-1">
        <Realgrid
          class="h-full min-h-0 w-full"
          :progname="'CRM20_009RPT_VUE'"
          :progid="1"
          :rowData="rowData"
          :reload="reload"
          :documentTitle="'CRM20_009RPT'"
          :documentSubTitle="documentSubTitle"
          :rowStateeditable="false"
          :setGroupFooter="true"
          :setFooter="true"
          :setGroupColumnId="'strSaleCustID'"
          :hideColumnsId="['lngStoreCode']"
          :setGroupOrderByColumnId="'strSaleCustID'"
          :setMergeMode="true"
          :setGroupSumCustomColumnId2="['strSaleCustName']"
          :setGroupSumCustomText3="['             계']"
          :exporttoExcel="exportExcel" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { getBalancebyCustAndDate, getBalancebyReceipt } from "@/api/micrm";
import Datepicker2 from "@/components/Datepicker2.vue";
import PageName from "@/components/pageName.vue";
import PickBelongCust from "@/components/pickBelongCust.vue";
import PickCustCompany from "@/components/pickCustCompany.vue";
import PickStoreRenew from "@/components/pickStoreRenew.vue";
import Realgrid from "@/components/realgrid.vue";
import { insertPageLog } from "@/customFunc/customFunc";
import Swal from "sweetalert2";
import { onMounted, ref } from "vue";
import { useStore } from "vuex";

const crm2009ControlBorder = "#cbd5e1";
const crm2009ColGutter = "1.5rem";
const crm2009ItemGap = "0.75rem";
const crm2009RowGap = "0.875rem";
const crm2009LabelCol = "5rem";
/** 조회기간(날짜2+달력) 폭 = 사업장 필드 끝선 */
const crm2009LeftFieldW = "22rem";

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

    const cstartDate =
      startdate.value.split("-")[0] +
      startdate.value.split("-")[1] +
      startdate.value.split("-")[2];
    const cendDate =
      enddate.value.split("-")[0] +
      enddate.value.split("-")[1] +
      enddate.value.split("-")[2];
    const ccond2 = cond2.value == false ? 0 : 1;
    const res = await getBalancebyReceipt(
      selectedStores.value,
      custId.value,
      cstartDate,
      cendDate,
      ccond2,
      selectedGroup.value,
      0,
      selectedStores2.value
    );
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
const selectedStores2 = ref();
const selectedStoreAttrs = ref();

const lngStoreCode = async (e) => {
  initGrid();
  selectedStores.value = e;
};
const lngStoreCode2 = async (e) => {
  initGrid();
  selectedStores2.value = e;
};
const lngStoreGroup = async (e) => {
  initGrid();
  selectedGroup.value = e;
};
const lngStoreAttrs = async (e) => {
  initGrid();
  selectedStoreAttrs.value = e;
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
    exceldate.value +
    "\n" +
    selectedExcelStore2.value;
  exportExcel.value = !exportExcel.value;
};

const documentSubTitle = ref("");
const selectedExcelList = ref("");

const selectedExcelStore = ref("");
const selectedExcelStore2 = ref("");

const excelStore = (e) => {
  selectedExcelStore.value = e;
};
const excelStore2 = (e) => {
  selectedExcelStore2.value = e;
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
.crm2009-search-panel {
  --crm2009-panel-pad-x: 2.5rem;
  --crm2009-row-min-h: 2rem;
  --crm2009-control-h: 2rem;
  box-sizing: border-box;
  padding-left: 0;
  padding-right: 0;
  padding-block: 0.75rem;
  overflow: visible;
}

.crm2009-search-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: var(--crm2009-col-gap, 1.5rem);
  row-gap: var(--crm2009-row-gap, 0.875rem);
  align-items: start;
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  padding-left: var(--crm2009-panel-pad-x);
  padding-right: var(--crm2009-panel-pad-x);
}

/* 좌·우 동일: 라벨열 + 필드열, 동일 item-gap → 오와열 */
.crm2009-left-stack {
  display: grid;
  grid-template-columns:
    var(--crm2009-label-col, 5rem)
    minmax(0, var(--crm2009-left-field-w, 22rem));
  column-gap: var(--crm2009-item-gap, 0.75rem);
  row-gap: var(--crm2009-row-gap, 0.875rem);
  align-items: center;
  width: 100%;
  max-width: 100%;
  min-width: 0;
}

.crm2009-right-stack {
  display: grid;
  grid-template-columns: var(--crm2009-label-col, 5rem) minmax(0, 1fr);
  column-gap: var(--crm2009-item-gap, 0.75rem);
  row-gap: var(--crm2009-row-gap, 0.875rem);
  align-items: center;
  width: 100%;
  min-width: 0;
}

.crm2009-lbl {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  min-height: var(--crm2009-row-min-h);
  font-size: 0.9375rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
  white-space: nowrap;
}

.crm2009-field {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  min-height: var(--crm2009-row-min-h);
  display: flex;
  align-items: center;
}

/* 사업장 끝선 = 조회기간 끝선 (left-field-w 채움) */
.crm2009-company {
  width: 100%;
  max-width: 100%;
  overflow: visible;
}

.crm2009-company :deep(> .flex) {
  display: flex !important;
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important;
}

.crm2009-company :deep(> .flex > div) {
  width: 100% !important;
  min-width: 0 !important;
  max-width: 100% !important;
  flex: 1 1 auto !important;
}

.crm2009-company :deep(.custom-select),
.crm2009-company :deep(.v-select) {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important;
  height: var(--crm2009-control-h) !important;
  min-height: var(--crm2009-control-h) !important;
  max-height: var(--crm2009-control-h) !important;
  font-size: 0.875rem !important;
  font-weight: 400 !important;
  line-height: 1.25rem !important;
  color: rgb(55 65 81) !important;
}

.crm2009-company :deep(.vs__dropdown-toggle) {
  box-sizing: border-box;
  height: var(--crm2009-control-h) !important;
  min-height: var(--crm2009-control-h) !important;
  max-height: var(--crm2009-control-h) !important;
  padding: 0 0.375rem !important;
  border: 1px solid var(--crm2009-control-border, #cbd5e1) !important;
  border-radius: 0.375rem !important;
  background-color: #fff !important;
  overflow: hidden !important;
  flex-wrap: nowrap !important;
  align-items: center !important;
}

.crm2009-company :deep(.vs__selected-options) {
  flex: 1 1 auto !important;
  flex-wrap: nowrap !important;
  min-width: 0 !important;
  max-width: 100% !important;
  overflow: hidden !important;
  padding: 0 !important;
  margin: 0 !important;
  align-items: center !important;
}

.crm2009-company :deep(.vs__selected),
.crm2009-company :deep(.vs__search) {
  display: block !important;
  box-sizing: border-box !important;
  font-size: 0.875rem !important;
  font-weight: 400 !important;
  line-height: calc(var(--crm2009-control-h) - 2px) !important;
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

.crm2009-company :deep(.vs__actions) {
  padding: 0 2px 0 0 !important;
}

.crm2009-company :deep(.vs__clear) {
  display: none !important;
}

.crm2009-company :deep(.vs__open-indicator) {
  fill: rgb(107 114 128) !important;
  transform: scale(0.55) !important;
  transition: transform 0.15s ease;
}

.crm2009-company :deep(.vs--open .vs__open-indicator) {
  transform: scale(0.55) rotate(180deg) !important;
}

.crm2009-date-slot :deep(> div.flex.justify-start.items-center) {
  margin: 0 !important;
  width: 100% !important;
  max-width: 100%;
}

.crm2009-date-slot :deep(input[type="date"]) {
  box-sizing: border-box;
  height: var(--crm2009-control-h);
  min-height: var(--crm2009-control-h);
  max-height: var(--crm2009-control-h);
  border: 1px solid var(--crm2009-control-border, #cbd5e1);
  border-radius: 0.375rem;
  background: #fff;
}

.crm2009-date-slot :deep(div.inline-flex.h-8),
.crm2009-date-slot :deep(button) {
  height: var(--crm2009-control-h) !important;
  min-height: var(--crm2009-control-h) !important;
}

.crm2009-belong-wrap {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 0.75rem;
}

.crm2009-belong {
  position: relative;
  min-width: 0;
  flex: 0 1 auto;
  overflow: visible;
}

.crm2009-belong :deep(.pbc-bar__code) {
  width: calc(5.5rem * 1.3);
  min-width: calc(4.5rem * 1.3);
}

.crm2009-belong :deep(.pbc-bar__name) {
  width: calc(9rem * 1.3);
  min-width: calc(6rem * 1.3);
  max-width: calc(11rem * 1.3);
  flex: 0 1 calc(9rem * 1.3);
}

.crm2009-check {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.875rem;
  color: rgb(17 24 39);
  white-space: nowrap;
  cursor: pointer;
}

.crm2009-check input {
  margin: 0;
}

/* 매장 — STKN06_016 pick-slot 동일 톤 (콤보 3개 props 유지) */
.crm2009-pick-slot {
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;
  max-width: 100%;
}

.crm2009-pick-slot > :deep(*) {
  width: 100%;
  min-width: 0;
  max-width: 100%;
}

.crm2009-pick-slot :deep(> div.flex) {
  margin: 0 !important;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  flex-wrap: nowrap;
  align-items: center;
  gap: var(--crm2009-item-gap, 0.75rem) !important;
  justify-content: flex-start !important;
}

.crm2009-pick-slot :deep(> div.flex > div:has(select)) {
  flex: 1 1 0;
  min-width: 0;
}

.crm2009-pick-slot :deep(> div.flex > div:nth-child(1) select),
.crm2009-pick-slot :deep(> div.flex > div:nth-child(2) select) {
  box-sizing: border-box;
  height: var(--crm2009-control-h) !important;
  min-height: var(--crm2009-control-h) !important;
  max-height: var(--crm2009-control-h) !important;
  margin-left: 0 !important;
  padding: 0 0.375rem !important;
  font-size: 0.875rem !important;
  line-height: 1.25rem !important;
  color: rgb(55 65 81);
  border-radius: 0.375rem;
  border: 1px solid var(--crm2009-control-border, #cbd5e1) !important;
  background: #fff;
  width: 100% !important;
  max-width: 100% !important;
}

.crm2009-pick-slot :deep(> div.flex > div:nth-child(2) select) {
  padding: 0 0.25rem !important;
}

.crm2009-pick-slot :deep(> div.flex > div:last-child) {
  flex: 1 1 0;
  min-width: 0;
  max-width: 100%;
}

.crm2009-pick-slot :deep(.custom-select) {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important;
  margin-left: 0 !important;
  font-size: 0.875rem !important;
  font-weight: 400 !important;
  line-height: 1.25rem !important;
  color: rgb(55 65 81) !important;
}

.crm2009-pick-slot
  :deep(.custom-select.custom-select--compact .vs__dropdown-toggle) {
  box-sizing: border-box;
  height: var(--crm2009-control-h) !important;
  min-height: var(--crm2009-control-h) !important;
  max-height: var(--crm2009-control-h) !important;
  padding: 0 0.375rem !important;
  border: 1px solid var(--crm2009-control-border, #cbd5e1) !important;
  border-radius: 0.375rem !important;
  background-color: #fff !important;
  overflow: hidden !important;
  flex-wrap: nowrap !important;
  align-items: center !important;
}

.crm2009-pick-slot
  :deep(.custom-select.custom-select--compact .vs__selected-options) {
  flex: 1 1 auto !important;
  flex-wrap: nowrap !important;
  min-width: 0 !important;
  max-width: 100% !important;
  overflow: hidden !important;
  padding: 0 !important;
  margin: 0 !important;
  align-items: center !important;
}

.crm2009-pick-slot
  :deep(.custom-select.custom-select--compact .vs__selected),
.crm2009-pick-slot
  :deep(.custom-select.custom-select--compact .vs__search),
.crm2009-pick-slot
  :deep(.custom-select.custom-select--compact .pickstore-selected-text) {
  display: block !important;
  box-sizing: border-box !important;
  font-size: 0.875rem !important;
  font-weight: 400 !important;
  line-height: calc(var(--crm2009-control-h) - 2px) !important;
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

.crm2009-pick-slot
  :deep(.custom-select.custom-select--compact .vs__dropdown-menu),
.crm2009-pick-slot
  :deep(.custom-select.custom-select--compact .vs__dropdown-option) {
  font-size: 0.875rem !important;
  font-weight: 400 !important;
  line-height: 1.25rem !important;
}

.crm2009-pick-slot :deep(.custom-select .vs__actions) {
  padding: 0 2px 0 0 !important;
}

.crm2009-pick-slot :deep(.custom-select .vs__clear) {
  display: none !important;
}

.crm2009-pick-slot :deep(.custom-select .vs__open-indicator) {
  fill: rgb(107 114 128) !important;
  transform: scale(0.55) !important;
  transition: transform 0.15s ease;
}

.crm2009-pick-slot :deep(.custom-select.vs--open .vs__open-indicator) {
  transform: scale(0.55) rotate(180deg) !important;
}

.crm2009-pick-slot--store-grid :deep(> div.flex) {
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.3fr) minmax(0, 1.7fr) !important;
  width: 100% !important;
  min-width: 0 !important;
  max-width: 100% !important;
  flex-wrap: unset !important;
  align-items: stretch !important;
  gap: var(--crm2009-item-gap, 0.75rem) !important;
}

.crm2009-pick-slot--store-grid
  :deep(> div.flex > div:nth-child(1) select),
.crm2009-pick-slot--store-grid
  :deep(> div.flex > div:nth-child(2) select) {
  width: 100% !important;
  max-width: 100% !important;
}

.crm2009-pick-slot--store-grid :deep(> div.flex > div:last-child) {
  flex: unset !important;
  width: 100% !important;
  min-width: 0 !important;
  max-width: 100% !important;
}

.crm2009-pick-slot--store-grid
  :deep(> div.flex > div:last-child .custom-select) {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important;
  margin-left: 0 !important;
}

@media (max-width: 900px) {
  .crm2009-search-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .crm2009-left-stack {
    grid-template-columns: var(--crm2009-label-col, 5rem) minmax(0, 1fr);
  }
}
</style>
