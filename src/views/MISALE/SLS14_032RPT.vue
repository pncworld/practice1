<template>
  <div class="flex justify-between items-center w-full overflow-y-hidden">
    <div class="flex justify-start w-full pl-12 pt-4">
      <div class="flex justify-start">
        <h1 class="font-bold text-sm md:text-2xl w-full">부가세 참고자료.</h1>
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
    class="flex justify-between bg-gray-200 rounded-lg h-16 items-center z-10">
    <div>
      <Datepicker3
        @endMonth="endMonth"
        @endYear="endYear"
        @startMonth="startMonth"
        @startYear="startYear"
        @excelDate="excelDate"></Datepicker3>
    </div>

    <div class="mr-28">
      <PickStoreRenew
        @lngStoreCode="lngStoreCodes"
        @lngStoreGroup="lngStoreGroup"
        @lngStoreAttrs="lngStoreAttrs"
        @excelStore="excelStore"
        :placeholderName="'선택'">
      </PickStoreRenew>
    </div>
  </div>

  <div class="w-full h-[85%]">
    <Realgrid
      :progname="'SLS14_032RPT_VUE'"
      :progid="1"
      :rowData="rowData"
      :reload="reload"
      :setRowStyleCalls="true"
      :setGroupFooter="true"
      :setGroupColumnId="'strStoreGroupName'"
      :setGroupFooterColID="setGroupFooterColID"
      :setGroupFooterExpressions="setGroupFooterExpressions"
      :setRowGroupSpan2="'strName,dtmDate'"
      :mergeMask="'strName'"
      :documentTitle="'SLS14_032RPT'"
      :documentSubTitle="documentSubTitle"
      :exporttoExcel="exportExcel"></Realgrid>
  </div>
</template>

<script setup>
import { getVATInfo } from "@/api/misales";
import Datepicker3 from "@/components/Datepicker3.vue";
import PickStoreRenew from "@/components/pickStoreRenew.vue";
import Realgrid from "@/components/realgrid.vue";
import { insertPageLog } from "@/customFunc/customFunc";
import Swal from "sweetalert2";
import { onMounted, ref } from "vue";
import { useStore } from "vuex";

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
});

const setGroupFooter = ref(false);
const setFooterColID = ref([
  "lngDayCnt",
  "lngCustCnt",
  "lngCustAmt",
  "lngRecCnt",
  "lngRecAmt",
  "lngSalAmt",
  "lngTotAmt",
  "lngActAmt_pastMonth",
  "lngActAmt_pastYear",
  "lngActAmt_pastMonth_rate",
  "lngActAmt_pastYear_rate",
  "lngSupplyAmt",
  "lngVAT",
  "lngAvgCustCnt",
  "lngAvgTotAmt",
  "dblDistRate",
]);
const setGroupFooterColID = ref([
  "lngDayCnt",
  "lngCustCnt",
  "lngCustAmt",
  "lngRecCnt",
  "lngRecAmt",
  "lngSalAmt",
  "lngTotAmt",
  "lngActAmt_pastMonth",
  "lngActAmt_pastYear",
  "lngActAmt_pastMonth_rate",
  "lngActAmt_pastYear_rate",
  "lngSupplyAmt",
  "lngVAT",
  "lngAvgCustCnt",
  "lngAvgTotAmt",
  "dblDistRate",
]);
const setFooterExpressions = ref([
  "sum",
  "sum",
  "avg",
  "sum",
  "avg",
  "sum",
  "sum",
  "sum",
  "sum",
  "avg",
  "avg",
  "sum",
  "sum",
  "avg",
  "avg",
  "sum",
]);
const setGroupFooterExpressions = ref([
  "sum",
  "sum",
  "avg",
  "sum",
  "avg",
  "sum",
  "sum",
  "sum",
  "sum",
  "avg",
  "avg",
  "sum",
  "sum",
  "avg",
  "avg",
  "sum",
]);

const setGroupSummaryCenterIds = ref("dtmDate,strWeekName");
const progid = ref(1);
const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);
const selectedstartYear = ref();
const selectedendYear = ref();
const selectedstartMonth = ref();
const selectedendMonth = ref();
const hideColumnNow = ref(true);
const hideColumn = ref("strStore");
const hideColumnsId = ref(["strStore"]);
const endMonth = (e) => {
  console.log(e);
  selectedendMonth.value = e;
};
const startYear = (e) => {
  console.log(e);
  selectedstartYear.value = e;
};
const startMonth = (e) => {
  console.log(e);
  selectedstartMonth.value = e;
};
const endYear = (e) => {
  console.log(e);
  selectedendYear.value = e;
};

const seeUnite = (e) => {
  if (e.target.checked) {
    setGroupFooter.value = true;
  } else {
    setGroupFooter.value = false;
  }
  reload.value = !reload.value;
};

const tempSeeDetail = ref(1);
const seeDetail = (e) => {
  if (e.target.checked) {
    tempSeeDetail.value = 2;
  } else {
    tempSeeDetail.value = 1;
  }
};
const store = useStore();
const loginedstrLang = store.state.userData.lngLanguage;
console.log(store.state.userData);

const searchButton = async () => {
  if (
    selectedstartYear.value == null ||
    selectedstartMonth.value == null ||
    selectedendYear.value == null ||
    selectedendMonth.value == null
  ) {
    Swal.fire({
      title: "날짜를 선택하세요.",
      icon: "info",

      confirmButtonColor: "#3085d6",

      confirmButtonText: "확인",
    });
    return;
  }
  if (selectedStores.value == 0) {
    Swal.fire({
      title: "매장을 선택하세요.",
      icon: "info",

      confirmButtonColor: "#3085d6",

      confirmButtonText: "확인",
    });
    return;
  }
  store.state.loading = true;
  try {
    initGrid();
    if (tempChecked.value == true) {
      hideColumnsId.value = [];
    } else {
      hideColumnsId.value = ["strStore"];
    }
    reload.value = !reload.value;
    const startDate = `${selectedstartYear.value}${String(
      selectedstartMonth.value
    ).padStart(2, "0")}`;
    const endDate = `${selectedendYear.value}${String(
      selectedendMonth.value
    ).padStart(2, "0")}`;

    const res = await getVATInfo(
      selectedGroup.value,
      selectedStores.value,
      startDate,
      endDate
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
const lngStoreGroup = (e) => {
  console.log(e);
  selectedGroup.value = e;
};
const lngStoreCodes = (e) => {
  selectedStores.value = e;
  console.log(e);
};
const lngStoreAttrs = (e) => {
  selectedStoreAttrs.value = e;
  console.log(e);
};

const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
};

const exportExcel = ref(false);
const selectedExcelStore = ref("");
const selectedExcelDate = ref("");
const documentSubTitle = ref("");
const excelStore = (e) => {
  selectedExcelStore.value = e;
};
const excelDate = (e) => {
  selectedExcelDate.value = e;
};
const excelButton = () => {
  documentSubTitle.value =
    selectedExcelDate.value + "\n" + selectedExcelStore.value;
  exportExcel.value = !exportExcel.value;
};

const tempChecked = ref(false);
const showStore = (e) => {
  if (e.target.checked) {
    tempChecked.value = true;
  } else {
    tempChecked.value = false;
  }
};
</script>

<style>
.rg-body .rg-table tr td:hover,
.rg-fixed-body .rg-table tr td:hover {
  background: none;
}
</style>
