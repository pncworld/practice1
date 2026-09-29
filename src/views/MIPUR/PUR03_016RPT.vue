<!-- /*--############################################################################
# Filename : PUR03_016RPT.vue
# Description : 구매관리2 > 발주 관리 > 발주서 발행
# Date :2025-08-26
# Author : 권맑음
################################################################################*/ -->
<template>
  <div class="h-full" @click="handleParentClick">
    <div class="flex justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center mr-9 space-x-2 pr-5">
        <button @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <button @click="excelButton" class="button w-auto excel">엑셀</button>
        <button @click="printButton" class="button print w-auto">인쇄</button>
        <button @click="printCrystalButton" class="button print w-auto">
          인쇄(구버전)
        </button>
      </div>
    </div>
    <div
      class="pur016-search-panel z-10 mt-3 w-full min-w-0 shrink-0 rounded-lg bg-gray-200"
      :style="{
        '--pur016-control-border': pur016ControlBorder,
        '--pur016-item-gap': pur016ItemGap,
        '--pur016-col-gap': pur016ColGap,
        '--pur016-panel-pad-x': pur016PanelPadX,
      }">
      <div class="pur016-search-grid min-w-0">
        <div class="pur016-cell">
          <div class="pur016-sg-label">입고예정일자</div>
          <div class="pur016-cell-field pur016-date-slot min-w-0">
            <Datepicker1
              ref="datepicker"
              :mainName="'입고예정일자'"
              :initToday="1"
              :closePopUp="closePopUp"
              @excelDate="excelDate"
              @dateValue="dateValue" />
          </div>
        </div>
        <div class="pur016-cell">
          <div class="pur016-sg-label">매장명</div>
          <div class="pur016-cell-field pur016-pick-slot min-w-0">
            <PickStore
              compact-search-bar
              :compact-store-combo-max-rem="pur016PickStoreComboMaxRem"
              :store-dropdown-min-width-rem="pur016StoreDropdownMinRem"
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
        <div class="pur016-cell">
          <div class="pur016-sg-label">거래처</div>
          <div class="pur016-cell-field pur016-bc-slot min-w-0">
            <BusinessClient
              compact-search-bar
              :defaultNm="'전체'"
              @SupplierId="SupplierId" />
          </div>
        </div>
      </div>
    </div>

    <div class="w-full h-[85%]">
      <Realgrid
        :progname="'PUR03_016RPT_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :setStateBar="false"
        :setGroupFooter="true"
        :setGroupColumnId="'strStoreName'"
        :documentTitle="'PUR03_016RPT'"
        :selectionStyle="'block'"
        @clickedRowData="clickedRowData"
        :documentSubTitle="documentSubTitle"
        :rowStateeditable="false"
        @clickedButtonCol="clickedButtonCol"
        @checkedRowData="checkedRowData"
        :checkRowAuto="false"
        :checkRowAuto2="true"
        :checkRenderEditable="true"
        :exporttoExcel="exportExcel">
      </Realgrid>
    </div>
  </div>

  <div
    v-if="openPopUp"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white p-6 rounded-2xl shadow-xl w-[50vw] h-[50vh]">
      <div class="flex justify-between">
        <h2 class="text-xl font-bold mb-4">발주서 조회</h2>
        <div class="flex space-x-5">
          <button class="whitebutton" @click="excelButton2">엑셀</button
          ><button class="whitebutton" @click="openPopUp = false">닫기</button>
        </div>
      </div>
      <div class="flex">
        <div class="flex space-x-5 items-center">
          <div class="text-base font-semibold">매장명</div>
          <div>
            <input
              type="text"
              class="border border-black h-7 w-48 disabled:bg-gray-200"
              disabled
              v-model="selectedExcelStore" />
          </div>
        </div>

        <div class="flex space-x-5 ml-5 items-center">
          <div class="text-base font-semibold">발주번호</div>
          <div>
            <input
              type="text"
              class="border border-black h-7 w-48 disabled:bg-gray-200"
              v-model="forPopupOrderNo"
              disabled />
          </div>
        </div>
      </div>
      <div class="h-[80%] w-full flex justify-center items-center mt-2">
        <Realgrid
          :progname="'PUR03_016RPT_01POP_VUE'"
          :progid="1"
          :documentTitle="'PUR03_016RPT'"
          :exporttoExcel="exportExcel2"
          :documentSubTitle="documentSubTitle2"
          :rowData="rowData2"></Realgrid>
      </div>
    </div>
  </div>

  <ReportPrintShell
    v-model:open="printPreviewOpen"
    title="발주서 인쇄 미리보기"
    :pages="printPages"
    :loading="printLoading">
    <template #page="{ page }">
      <PurchaseOrderPrintSheet :page="page" party-layout="basic" />
    </template>
  </ReportPrintShell>
</template>

<script setup>
import { getOrderInfoDetail, getPurchaseOrderList } from "@/api/mipur";
import BusinessClient from "@/components/businessClient2.vue";
import Datepicker1 from "@/components/Datepicker1.vue";
import PageName from "@/components/pageName.vue";
import PickStore from "@/components/pickStore.vue";
import Realgrid from "@/components/realgrid.vue";
import ReportPrintShell from "@/components/reportPrint/ReportPrintShell.vue";
import { loadPurchaseOrderPrintPages } from "@/components/reportPrint/loadPurchaseOrderPrintPages";
import PurchaseOrderPrintSheet from "@/components/reportPrint/sheets/PurchaseOrderPrintSheet.vue";
import { insertPageLog } from "@/customFunc/customFunc";
import Swal from "sweetalert2";
import { onMounted, ref } from "vue";
import { useStore } from "vuex";

onMounted(async () => {
  await insertPageLog(store.state.activeTab2);
});

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);
const store = useStore();

const pur016ControlBorder = "#cbd5e1";
const pur016PickStoreComboMaxRem = 96;
const pur016StoreDropdownMinRem = 22;
const pur016ItemGap = "1rem";
const pur016ColGap = "1.75rem";
const pur016PanelPadX = "2.5rem";

const datepicker = ref(null);
const closePopUp = ref(false);

const handleParentClick = (e) => {
  const datepickerEl = datepicker.value?.$el;
  if (datepickerEl && datepickerEl.contains(e.target)) {
    return;
  }
  closePopUp.value = !closePopUp.value;
};

const sDate = ref();
const dateValue = (e) => {
  initGrid();
  sDate.value = e;
};

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

    const res = await getPurchaseOrderList(
      groupCd.value,
      storeCode.value,
      sDate.value.replaceAll("-", ""),
      supplierid.value
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

const documentSubTitle2 = ref("");
const exportExcel2 = ref(false);
const excelButton2 = () => {
  documentSubTitle2.value =
    "매장명 :" +
    selectedExcelStore.value +
    "\n" +
    "발주번호 :" +
    forPopupOrderNo.value;
  exportExcel2.value = !exportExcel2.value;
};

const documentSubTitle = ref("");
const selectedExcelStore = ref("");
const excelStore = (e) => {
  selectedExcelStore.value = e;
};

const openPopUp = ref(false);

const clickedButtonCol = async (e) => {
  if (e == "strOrderNo") {
    const res = await getOrderInfoDetail(
      groupCd.value,
      forPopupOrderStoreCd.value,
      forPopupOrderNo.value
    );
    rowData2.value = res.data.List;
    openPopUp.value = true;
  }
};
const rowData2 = ref([]);
const forPopupOrderStoreCd = ref("");
const forPopupOrderNo = ref("");
const clickedRowData = (e) => {
  forPopupOrderStoreCd.value = e[1];
  forPopupOrderNo.value = e[5];
};

const checkedrowdata = ref([]);
const checkedRowData = (e) => {
  checkedrowdata.value = e;
};

const printPreviewOpen = ref(false);
const printLoading = ref(false);
const printPages = ref([]);

const printButton = async () => {
  if (checkedrowdata.value.length == 0) {
    Swal.fire({
      title: "경고",
      text: "선택한 전표가 존재하지 않습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  printPreviewOpen.value = true;
  printLoading.value = true;
  printPages.value = [];
  try {
    printPages.value = await loadPurchaseOrderPrintPages(
      groupCd.value,
      checkedrowdata.value,
      {
        storeCd: storeCode.value,
        orderDate: String(sDate.value ?? "").replaceAll("-", ""),
        flag: "1",
        partyLayout: "basic",
      }
    );
    if (!printPages.value.length) {
      printPreviewOpen.value = false;
      await Swal.fire({
        title: "경고",
        text: "출력할 발주서 상세를 불러오지 못했습니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
    }
  } catch (e) {
    console.error("[PUR03_016RPT] printButton", e);
    printPreviewOpen.value = false;
    await Swal.fire({
      title: "오류",
      text: "발주서 인쇄 데이터를 불러오는 중 오류가 발생했습니다.",
      icon: "error",
      confirmButtonText: "확인",
    });
  } finally {
    printLoading.value = false;
  }
};

const printCrystalButton = () => {
  if (checkedrowdata.value.length == 0) {
    Swal.fire({
      title: "경고",
      text: "선택한 전표가 존재하지 않습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  const storecds = checkedrowdata.value
    .map((item) => item.lngStoreCode)
    .join(",");
  const ordercds = checkedrowdata.value
    .map((item) => item.strOrderNo)
    .join(",");
  const orderDate = String(sDate.value ?? "").replaceAll("-", "");
  window.open(
    `http://222.231.31.99/Report/CRPrint.aspx?pCount=10&Report=PUR03_016RPT_RPT&@P_lngStoreGroup=${
      groupCd.value
    }&@P_lngStoreCode=${
      storeCode.value
    }&@P_dtmOrderDate=${orderDate}&@P_flag=1&@P_lngStoreCodeList=${storecds}&@P_orderNo=${ordercds}`,
    "_blank",
    "width=1600,height=1200"
  );
};
</script>

<style scoped>
/*
 * 조회 AREA — layout-equal-spacing / search-area-symmetric-inset / search-area-alignment
 * 3열(일자·매장·거래처) 반응형, 행·컨트롤 높이 2rem
 */
.pur016-search-panel {
  box-sizing: border-box;
  padding-left: 0;
  padding-right: 0;
  padding-block: 0.75rem;
  overflow-x: auto;
}

.pur016-search-grid {
  --pur016-label-col: 6.5rem;
  --pur016-row-min-h: 2rem;
  --pur016-control-h: 2rem;
  display: grid;
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  align-items: center;
  grid-template-columns:
    minmax(18rem, 1.15fr)
    minmax(16rem, 1.45fr)
    minmax(14rem, 1.25fr);
  column-gap: var(--pur016-col-gap);
  padding-left: var(--pur016-panel-pad-x);
  padding-right: var(--pur016-panel-pad-x);
}

.pur016-cell {
  display: flex;
  min-width: 0;
  min-height: var(--pur016-row-min-h);
  align-items: center;
  gap: var(--pur016-item-gap);
}

.pur016-sg-label {
  flex: 0 0 var(--pur016-label-col);
  width: var(--pur016-label-col);
  min-height: var(--pur016-row-min-h);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
}

.pur016-cell-field {
  min-width: 0;
  min-height: var(--pur016-row-min-h);
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  width: 100%;
}

.pur016-cell-field > * {
  min-width: 0;
  width: 100%;
}

.pur016-search-grid .pur016-pick-slot :deep(select) {
  box-sizing: border-box;
  height: var(--pur016-control-h) !important;
  min-height: var(--pur016-control-h) !important;
  max-height: var(--pur016-control-h) !important;
  border: 1px solid var(--pur016-control-border) !important;
}

.pur016-search-grid .pur016-pick-slot :deep(select:focus) {
  border-color: #3b82f6 !important;
}

.pur016-search-grid .pur016-pick-slot :deep(.pickstore-vs-shell),
.pur016-search-grid .pur016-bc-slot :deep(.pickstore-vs-shell) {
  box-sizing: border-box;
  height: var(--pur016-control-h) !important;
  min-height: var(--pur016-control-h) !important;
  max-height: var(--pur016-control-h) !important;
  border: 1px solid var(--pur016-control-border) !important;
  overflow: hidden !important;
  position: relative !important;
}

.pur016-search-grid .pur016-pick-slot :deep(.style-chooser),
.pur016-search-grid .pur016-bc-slot :deep(.style-chooser) {
  width: 100% !important;
  height: 100% !important;
}

.pur016-search-grid .pur016-pick-slot :deep(.vs__dropdown-toggle),
.pur016-search-grid .pur016-bc-slot :deep(.vs__dropdown-toggle) {
  box-sizing: border-box;
  min-height: var(--pur016-control-h) !important;
  height: var(--pur016-control-h) !important;
  max-height: var(--pur016-control-h) !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  padding-left: 0.5rem !important;
  padding-right: 0.25rem !important;
  display: flex !important;
  align-items: center !important;
  flex-wrap: nowrap !important;
}

.pur016-search-grid .pur016-pick-slot :deep(.vs__selected-options),
.pur016-search-grid .pur016-bc-slot :deep(.vs__selected-options) {
  flex: 1 1 auto !important;
  min-width: 0 !important;
  position: relative !important;
  height: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
  overflow: hidden !important;
}

.pur016-search-grid .pur016-pick-slot :deep(.vs__selected),
.pur016-search-grid .pur016-bc-slot :deep(.vs__selected) {
  position: absolute !important;
  left: 0 !important;
  right: 1.5rem !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  margin: 0 !important;
  padding: 0 !important;
  height: auto !important;
  max-height: none !important;
  width: auto !important;
  max-width: 100% !important;
  line-height: 1.25 !important;
  font-size: 0.875rem !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  display: block !important;
  background: transparent !important;
}

.pur016-search-grid .pur016-pick-slot :deep(.vs__search),
.pur016-search-grid .pur016-bc-slot :deep(.vs__search) {
  margin: 0 !important;
  padding: 0 !important;
  height: calc(var(--pur016-control-h) - 2px) !important;
  line-height: calc(var(--pur016-control-h) - 2px) !important;
  font-size: 0.875rem !important;
}

.pur016-search-grid .pur016-pick-slot :deep(.vs__actions),
.pur016-search-grid .pur016-bc-slot :deep(.vs__actions) {
  display: flex !important;
  align-items: center !important;
  padding: 0 2px 0 0 !important;
  flex-shrink: 0 !important;
  margin-left: auto !important;
}

.pur016-search-grid .pur016-date-slot :deep(input[type="date"]) {
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  min-width: 10.5rem;
  height: var(--pur016-control-h);
  min-height: var(--pur016-control-h);
  max-height: var(--pur016-control-h);
  padding-left: 0.75rem;
  padding-right: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  border-radius: 0.375rem;
  border: 1px solid var(--pur016-control-border) !important;
}

.pur016-search-grid .pur016-date-slot :deep(input[type="date"]:focus) {
  border-color: #3b82f6 !important;
}

.pur016-date-slot :deep(div.space-x-5 > span) {
  display: none;
}

.pur016-date-slot :deep(div.space-x-5) {
  margin-top: 0;
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;
  min-height: var(--pur016-row-min-h);
}

.pur016-bc-slot :deep(> div.flex.text-base) {
  width: 100%;
  min-width: 0;
  min-height: var(--pur016-row-min-h);
  align-items: center;
}

.pur016-pick-slot :deep(> div.flex.text-base) {
  width: 100%;
  min-width: 0;
  min-height: var(--pur016-row-min-h);
  align-items: center;
  gap: var(--pur016-item-gap) !important;
}

.pur016-pick-slot :deep(> div.flex > div:first-child) {
  display: none;
}

.pur016-pick-slot :deep(.relative.min-w-0.flex-1) {
  flex: 1 1 auto !important;
  min-width: 11rem !important;
  max-width: none !important;
}
.pur016-pick-slot :deep(.pickstore-vs-shell) {
  min-width: 0;
  width: 100% !important;
  max-width: none !important;
}

.pur016-bc-slot :deep(> div.flex.items-center) {
  margin-top: 0;
}
</style>
