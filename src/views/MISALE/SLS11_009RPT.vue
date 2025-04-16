<template>
  <div class="h-full" @click="handleParentClick">
    <div class="flex justify-between items-center w-full overflow-y-hidden">
      <div class="flex justify-start w-full pl-12 pt-4">
        <div class="flex justify-start">
          <h1 class="font-bold text-sm md:text-2xl w-full">객층별 매출현황.</h1>
        </div>
      </div>
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
      class="grid grid-cols-2 grid-rows-1 justify-between bg-gray-200 rounded-lg h-28 items-center z-10">
      <div class="grid grid-cols-1 grid-rows-3 mt-12">
        <div class="flex -space-x-24">
          <input
            type="checkbox"
            class="ml-16 z-30 mt-5"
            @click="checkReportType"
            :value="1" />
          <Datepicker2
            @endDate="endDate"
            @startDate="startDate"
            :closePopUp="closePopUp"
            ref="datepicker"
            @excelDate="excelDate"
            :mainName="'일자'"></Datepicker2>

          <input
            type="checkbox"
            class="!ml-40 mt-5"
            @click="checkReportType"
            :value="2" />
        </div>
        <div class="flex justify-center mt-2 pr-16">
          <div class="text-base font-semibold">객층구분 :</div>
          <v-select
            v-model="selectedCust"
            :options="customerList"
            placeholder="전체"
            label="strName"
            class="custom-select5"
            clearable="true"
            @click="resetVselect2" />
        </div>
      </div>
      <div class="ml-10">
        <PickStoreSingle2
          @lngStoreCode="lngStoreCodes"
          @lngStoreGroup="lngStoreGroup"
          @excelStore="excelStore"
          @changeInit="changeInit"
          @lngSupervisor="lngSupervisor"
          @lngStoreTeam="lngStoreTeam"
          @lngStoreAttrs="lngStoreAttrs">
        </PickStoreSingle2>
        <div
          class="text-nowrap flex justify-start items-center space-x-10 ml-8 mt-2">
          <div class="text-base font-semibold">조건 :</div>
          <div class="flex space-x-10">
            <label for="store"
              ><input
                type="checkbox"
                id="store"
                @click="cellUnite" />셀병합</label
            >
            <label for="unite"
              ><input
                type="checkbox"
                id="unite"
                @click="balance" />할인전잔액</label
            >
            <label for="sum"
              ><input type="checkbox" id="sum" @click="showSum" />합계</label
            >
          </div>
        </div>
      </div>
      <div></div>
    </div>

    <div class="w-full h-[80%]">
      <Realgrid
        :progname="'SLS11_009RPT_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :setFooter="true"
        :setMergeMode="false"
        :setGroupSumCustomColumnId2="['strCustomer']"
        :setGroupFooter="setGroupFooter"
        :setGroupColumnId="setGroupColumnId"
        :hideColumnsId="hideColumnsId"
        :setRowGroupSpan="setRowGroupSpan"
        :documentTitle="'SLS11_009RPT'"
        :documentSubTitle="documentSubTitle"
        :exporttoExcel="exportExcel">
      </Realgrid>
    </div>
  </div>
</template>

<script setup>
import { getCustomerList, getSalesbyCustomer } from "@/api/misales";
import Datepicker2 from "@/components/Datepicker2.vue";
import PickStoreSingle2 from "@/components/pickStoreSingle.vue";
import Realgrid from "@/components/realgrid.vue";
import { insertPageLog } from "@/customFunc/customFunc";
import { onMounted, ref } from "vue";
import { useStore } from "vuex";

const orderPay = ref(1);
const setFooterColID = ref([
  "lngRecCnt",
  "lngRecAmt",
  "lngCustCnt",
  "lngCustAmt",
  "lngSalAmt",
  "lngDiscount",
  "lngActAmt",
  "lngVAT",
  "lngSupplyAmt",
  "dblDistRate",
  "lngTotAmt",
  "dtmDate",
]);
const setGroupFooterColID = ref([
  "lngRecCnt",
  "lngRecAmt",
  "lngCustCnt",
  "lngCustAmt",
  "lngSalAmt",
  "lngDiscount",
  "lngActAmt",
  "lngVAT",
  "lngSupplyAmt",
  "dblDistRate",
  "lngTotAmt",
  "dtmDate",
]);
const setFooterExpressions = ref([
  "sum",
  "avg",
  "sum",
  "avg",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "custom",
]);
const setGroupFooterExpressions = ref([
  "sum",
  "avg",
  "sum",
  "avg",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "custom",
]);
const setGroupSummaryCenterIds = ref("strTime");
const progid = ref(1);
const setRowGroupSpan = ref("");
const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);
const selectedstartDate = ref();
const selectedendDate = ref();
const hideColumnNow = ref(true);
const setGroupColumnId = ref("");
const hideColumnsId = ref(["strStore", "dtmDate", "lngTotAmt"]);
const startDate = (e) => {
  console.log(e);
  selectedstartDate.value = e;
};
const endDate = (e) => {
  selectedendDate.value = e;
};
const startTime = ref(0);
const endTime = ref(23);
const setGroupFooter = ref(false);
const selectedCause = ref(null);
const store = useStore();
const causeList = ref([]);
const mergeMask = ref();
const selectedCust = ref(null);
const customerList = ref([]);
onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
});

const loginedstrLang = store.state.userData.lngLanguage;
const searchButton = async () => {
  store.state.loading = true;
  try {
    initGrid();
    let cust;
    if (selectedCust.value == null) {
      cust = 0;
    } else {
      cust = selectedCust.value.lngCode;
    }

    reload.value = !reload.value;

    const res = await getSalesbyCustomer(
      selectedGroup.value,
      selectedStoreAttrs.value,
      selectedStoreTeam.value,
      selectedStoreSuperVisor.value,
      selectedStores.value,
      selectedstartDate.value,
      selectedendDate.value,
      reportType.value,
      cust
    );
    console.log(res);
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
const selectedStoreTeam = ref();
const selectedStoreSuperVisor = ref();
const lngStoreGroup = (e) => {
  console.log(e);
  selectedGroup.value = e;
};
const lngStoreCodes = async (e) => {
  selectedStores.value = e;
  console.log(e);

  const res = await getCustomerList(selectedGroup.value, selectedStores.value);
  customerList.value = res.data.List;
};
const lngStoreAttrs = (e) => {
  selectedStoreAttrs.value = e;
  console.log(e);
};
const lngSupervisor = (e) => {
  selectedStoreSuperVisor.value = e;
  console.log(e);
};
const lngStoreTeam = (e) => {
  selectedStoreTeam.value = e;
  console.log(e);
};

const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
};

const exportExcel = ref(false);

console.log(store.state.minorCategory);

const excelButton = () => {
  let condition = "객층구분 :";
  if (selectedCust.value == null) {
    condition += "전체";
  } else {
    condition += selectedCust.value.strName;
  }

  let condition2 = "조건 : ";
  if (setRowGroupSpan.value == "strStore") {
    condition2 += "셀병합,";
  }
  if (hideColumnsId.value.includes("lngTotAmt")) {
    condition2 += "할인전잔액,";
  }
  if (setGroupFooter.value == true) {
    condition2 += "합계,";
  }

  condition2 = condition2.substring(0, condition2.length - 1);

  documentSubTitle.value =
    selectedExcelDate.value +
    "\n" +
    selectedExcelStore.value +
    "\n" +
    condition +
    "\n" +
    condition2;

  exportExcel.value = !exportExcel.value;
};

const resetVselect2 = () => {
  endTime.value = 23;
};
const datepicker = ref(null);
const closePopUp = ref(false);
const handleParentClick = (e) => {
  const datepickerEl = datepicker.value?.$el;

  if (datepickerEl && datepickerEl.contains(e.target)) {
    return;
  }
  closePopUp.value = !closePopUp.value;
};
const documentSubTitle = ref("");
const selectedExcelDate = ref("");
const excelDate = (e) => {
  selectedExcelDate.value = e;
};
const selectedExcelStore = ref("");
const excelStore = (e) => {
  selectedExcelStore.value = e;
};
const tempHideStore = ref(false);
const showStore = (e) => {
  if (e.target.checked) {
    tempHideStore.value = true;
  } else {
    tempHideStore.value = false;
  }
};
const tempCellUnite = ref(false);
const cellUnite = (e) => {
  if (e.target.checked) {
    if (setGroupColumnId.value == "strCustomer") {
      setRowGroupSpan.value = "strCustomer";
    } else {
      setRowGroupSpan.value = "strStore";
    }
  } else {
    setRowGroupSpan.value = "";
  }
  reload.value = !reload.value;
};
const tempSum = ref(false);
const showSum = (e) => {
  if (e.target.checked) {
    console.log(setGroupColumnId.value);
    setGroupFooter.value = true;
    reload.value = !reload.value;
  } else {
    setGroupFooter.value = false;
    reload.value = !reload.value;
  }
};

const changeInit = (e) => {
  initGrid();
};
const reportType = ref("0");
const checkReportType = (e) => {
  if (e.target.value == 1) {
    if (e.target.checked) {
      if (setGroupColumnId.value.includes("strStore")) {
        setGroupColumnId.value = "strStore,dtmDate";
      } else {
        setGroupColumnId.value = "strCustomer";
      }
      hideColumnsId.value = hideColumnsId.value.filter(
        (item) => item !== "dtmDate"
      );
      if (reportType.value.includes("2")) {
        reportType.value = "12";
      } else if (reportType.value.includes("1")) {
        reportType.value = "1";
      } else {
        reportType.value = "1";
      }
    } else {
      if (setGroupColumnId.value.includes("strStore")) {
        setGroupColumnId.value = "strStore";
      } else {
        setGroupColumnId.value = "";
      }
      hideColumnsId.value.push("dtmDate");
      if (reportType.value.includes("2")) {
        reportType.value = "2";
      } else if (reportType.value.includes("1")) {
        reportType.value = "0";
      }
    }
  } else if (e.target.value == 2) {
    if (e.target.checked) {
      if (setGroupColumnId.value.includes("strCustomer")) {
        setGroupColumnId.value = "strStore,dtmDate";
      } else {
        setGroupColumnId.value = "strStore";
      }

      hideColumnsId.value = hideColumnsId.value.filter(
        (item) => item !== "strStore"
      );
      if (reportType.value.includes("1")) {
        reportType.value = "12";
      } else if (reportType.value.includes("2")) {
        reportType.value = "2";
      } else {
        reportType.value = "2";
      }
    } else {
      if (setGroupColumnId.value.includes("dtmDate")) {
        setGroupColumnId.value = "strCustomer";
      } else {
        setGroupColumnId.value = "";
      }
      hideColumnsId.value.push("strStore");
      if (reportType.value.includes("1")) {
        reportType.value = "1";
      } else if (reportType.value.includes("2")) {
        reportType.value = "0";
      }
    }
  }
};

const balance = (e) => {
  if (e.target.checked) {
    hideColumnsId.value = hideColumnsId.value.filter(
      (item) => item != "lngTotAmt"
    );
    reload.value = !reload.value;
  } else {
    hideColumnsId.value.push("lngTotAmt");
    reload.value = !reload.value;
  }
};
</script>

<style></style>
