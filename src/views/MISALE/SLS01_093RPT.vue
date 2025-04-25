<template>
  <div class="flex justify-between items-center w-full overflow-y-hidden">
    <PageName></PageName>
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
    class="grid grid-rows-1 grid-cols-[7fr,1fr,7fr] justify-between bg-gray-200 rounded-lg h-24 items-center z-10">
    <div class="grid grid-cols-1 grid-rows-2 mr-60">
      <Datepicker3
        @startYear="startYear"
        @startMonth="startMonth"
        @endMonth="endMonth"
        @endYear="endYear"
        @excelDate="excelDate"
        :initToday="1"
        class="ml-5"></Datepicker3>
      <div
        class="flex justify-center items-center ml-20 pr-1 space-x-3 text-nowrap">
        <div class="text-base font-semibold">매출목표 :</div>
        <input
          type="text"
          class="rounded-lg pl-1 h-8 text-right disabled:bg-white"
          v-model="maxSaleTarget"
          disabled />
        <div class="text-base font-semibold">매출구분 :</div>
        <label for="showSale1"
          ><input
            type="radio"
            id="showSale1"
            name="showSale"
            v-model="checked"
            :value="0" />실매출</label
        >
        <label for="showSale2"
          ><input
            id="showSale2"
            name="showSale"
            type="radio"
            v-model="checked"
            :value="1" />순매출</label
        >
      </div>
    </div>
    <div><input type="checkbox" :value="1" @click="updateShowStore" /></div>
    <div>
      <PickStoreSingle
        @lngStoreGroup="lngStoreGroup"
        @lngSupervisor="lngSupervisor"
        @lngStoreTeam="lngStoreTeam"
        @lngStoreAttrs="lngStoreAttrs"
        @lngStoreCode="lngStoreCode"
        @excelStore="excelStore"></PickStoreSingle>
    </div>
  </div>

  <div class="h-[80%] mt-5">
    <Realgrid
      :progname="'SLS01_093RPT_VUE'"
      :progid="progid"
      :rowData="rowData"
      :reload="reload"
      :selectionStyle="'singleRow'"
      :setRowStyleCalls="true"
      :hideColumnsId="hideColumnsId"
      :setFooter="true"
      :documentTitle="'SLS01_093RPT'"
      :setGroupFooter="false"
      :setRowStyleLevel="2"
      :setGroupColumnId="setGroupColumnId"
      :setMergeMode="false"
      :documentSubTitle="documentSubTitle"
      :rowStateeditable="false"
      :exporttoExcel="exporttoExcel"></Realgrid>
  </div>
</template>

<script setup>
import { getPlanbyMonths } from "@/api/misales";
import Datepicker3 from "@/components/Datepicker3.vue";
import PageName from "@/components/pageName.vue";
import PickStoreSingle from "@/components/pickStoreSingle.vue";
import Realgrid from "@/components/realgrid.vue";
import { insertPageLog } from "@/customFunc/customFunc";
import Swal from "sweetalert2";
import { onMounted, ref } from "vue";
import { useStore } from "vuex";

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
});

const reload = ref(false);
const documentSubTitle = ref();
const selectedExcelDate = ref();
const selectedExcelStore = ref();
const selectedstartDate = ref();
const selectedendDate = ref();
const selectedEndYear = ref();
const selectedStartYear = ref();
const selectedEndMonth = ref();
const selectedStartMonth = ref();
const progid = ref(1);
const endYear = (e) => {
  console.log(e);
  selectedEndYear.value = e;
};
const endMonth = (e) => {
  console.log(e);
  selectedEndMonth.value = e;
};
const startYear = (e) => {
  console.log(e);
  selectedStartYear.value = e;
};
const startMonth = (e) => {
  console.log(e);
  selectedStartMonth.value = e;
};

const excelDate = (e) => {
  selectedExcelDate.value = e;
};
const excelStore = (e) => {
  selectedExcelStore.value = e;
};
const customFooterShowLast = ref(true);
const lngstoregroup = ref();
const lngstoreattr = ref();
const lngstoreteam = ref();
const lngstoresupervisor = ref();
const lngstorecode = ref();
const maxSaleTarget = ref("");
const checked = ref(0);
const setGroupFooter = ref(false);
const hideColumnsId = ref(["strStore"]);
const lngStoreGroup = (e) => {
  lngstoregroup.value = e;
  console.log(e);
  initGrid();
};
const lngStoreAttrs = (e) => {
  lngstoreattr.value = e;
  console.log(e);
  initGrid();
};
const lngStoreTeam = (e) => {
  lngstoreteam.value = e;
  console.log(e);
  initGrid();
};
const lngSupervisor = (e) => {
  lngstoresupervisor.value = e;
  console.log(e);
  initGrid();
};
const lngStoreCode = (e) => {
  lngstorecode.value = e;
  console.log(e);
  initGrid();
};

const receiptNo = ref();
const initCheckBox = ref(false);
const setGroupColumnId = ref("strStore");
const store = useStore();
const loginedstrLang = store.state.userData.lngLanguage;
console.log(store);

const afterSearch = ref(false);
const searchButton = async () => {
  // initCheckBox.value = !initCheckBox.value
  // initSearchWord.value = !initSearchWord.value
  // if (storeCd.value == 0) {
  //     Swal.fire({
  //         title: '경고',
  //         text: '매장을 선택하세요.',
  //         icon: 'warning',
  //         confirmButtonText: '확인'
  //     })
  //     return;
  // }

  if (
    selectedStartMonth.value == null ||
    selectedEndMonth.value == null ||
    selectedStartYear.value == null ||
    selectedEndYear.value == null
  ) {
    Swal.fire({
      title: "경고",
      text: "날짜를 선택하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  try {
    store.state.loading = true;
    initGrid();
    reload.value = !reload.value;
    let barea;
    if (hideColumnsId.value.includes("strStore")) {
      barea = 0;
    } else {
      barea = 1;
    }
    let startDate =
      selectedStartYear.value +
      "-" +
      String(selectedStartMonth.value).padStart(2, "0") +
      "-01";

    let endDate = new Date(selectedEndYear.value, selectedEndMonth.value, 1)
      .toISOString()
      .split("T")[0];
    console.log(endDate);
    const res = await getPlanbyMonths(
      lngstoregroup.value,
      lngstoreattr.value,
      lngstoreteam.value,
      lngstoresupervisor.value,
      lngstorecode.value,
      startDate,
      endDate,
      barea,
      checked.value
    );
    console.log(res);

    rowData.value = res.data.List;
    if (rowData.value.length > 0) {
      console.log(rowData.value);
      if (customFooterShowLast.value == true) {
        maxSaleTarget.value = rowData.value
          .map((i) => i.lngMonthProject)
          .reduce((acc, cur) => acc + cur, 0)
          .toLocaleString();
      } else {
        maxSaleTarget.value = rowData.value
          .filter((item) => item.lngOrder == 1)
          .map((i) => i.lngMonthProject)
          .reduce((acc, cur) => acc + cur, 0)
          .toLocaleString();
      }
    }

    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    console.log(error);
  } finally {
    store.state.loading = false;
  }
};
const groupCd = ref();
const storeCd = ref();
const dtmDate = ref();
const init = ref(false);
const selectedStoreCd = (e) => {
  console.log(e);
  storeCd.value = e;

  initGrid();
  selectedPosNo.value = "0";
  receiptNo.value = "";
  init.value = !init.value;
};
const selectedGroupCd = (e) => {
  console.log(e);
  groupCd.value = e;
};
const rowData = ref([]);
const rowData2 = ref([]);
const rowData3 = ref([]);
const rowData4 = ref([]);

const selectedPosNo = ref();
const posNo = (e) => {
  console.log(e);
  if (e == null) {
    selectedPosNo.value = 0;
  } else {
    selectedPosNo.value = e;
  }
};

const disCountCd = ref("");
const DisCountCd = (e) => {
  console.log(e);
  if (e == null) {
    disCountCd.value = 0;
  } else {
    disCountCd.value = e;
  }
};

const payCd = ref("");
const selectedpayCd = (e) => {
  if (e == null) {
    payCd.value = 0;
  } else {
    payCd.value = e;
  }
};

const exporttoExcel = ref(false);
const excelButton = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 진행해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  let cond = "매출목표 : ";
  if (maxSaleTarget.value != "") {
    cond += maxSaleTarget.value;
  }

  let cond2 = "매출구분 : ";
  if (checked.value == 0) {
    cond2 += "실매출";
  } else {
    cond2 += "순매출";
  }
  documentSubTitle.value =
    selectedExcelDate.value +
    "\n" +
    selectedExcelStore.value +
    "\n" +
    cond +
    "\n" +
    cond2;
  exporttoExcel.value = !exporttoExcel.value;
};
const initGrid = () => {
  console.log(rowData.value);
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
};
const updateShowStore = (e) => {
  if (e.target.checked) {
    hideColumnsId.value = [];
    progid.value = 2;
    customFooterShowLast.value = false;
  } else {
    hideColumnsId.value = ["strStore"];
    progid.value = 1;
    customFooterShowLast.value = true;
  }
};
</script>
