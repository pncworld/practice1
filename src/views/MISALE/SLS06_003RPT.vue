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
    class="grid grid-cols-[15fr,1fr,15fr] grid-rows-1 justify-between bg-gray-200 rounded-lg h-24 items-center z-10">
    <div class="grid grid-cols-1 grid-rows-2">
      <Datepicker3
        class="pl-2"
        @endMonth="endMonth"
        @endYear="endYear"
        @startMonth="startMonth"
        @startYear="startYear"
        @excelDate="excelDate"></Datepicker3>
      <div
        class="flex items-center text-base text-nowrap font-semibold pl-32 mt-3">
        조회조건 :
        <div>
          <label for="sum" class="font-normal"
            ><input
              type="checkbox"
              id="sum"
              class="ml-5"
              @change="seeSum" />합계</label
          >
        </div>
      </div>
    </div>
    <div><input type="checkbox" name="" id="" @change="showStore" /></div>
    <div class="ml-5">
      <PickStorePlural
        @lngStoreCodes="lngStoreCodes"
        @lngStoreGroup="lngStoreGroup"
        @lngStoreAttrs="lngStoreAttrs"
        @excelStore="excelStore">
      </PickStorePlural>
    </div>
    <div></div>
  </div>

  <div class="w-full h-[85%]">
    <Realgrid
      :progname="'SLS06_003RPT_VUE'"
      :progid="1"
      :rowData="rowData"
      :reload="reload"
      :setFooter="true"
      :setGroupFooter="setGroupFooter"
      :setGroupColumnId="'strStoreGroupName'"
      :hideColumnsId="hideColumnsId"
      :suffixColumnPercent="[
        'lngActAmt_pastMonth_rate',
        'lngActAmt_pastYear_rate',
      ]"
      :documentTitle="'SLS06_003RPT'"
      :documentSubTitle="documentSubTitle"
      :exporttoExcel="exportExcel"
      :mergeColumns2="true"
      :mergeColumnGroupSubList2="[
        [
          'lngActAmt_pastMonth',
          'lngActAmt_pastYear',
          'lngActAmt_pastMonth_rate',
          'lngActAmt_pastYear_rate',
          'lngSupplyAmt',
        ],
      ]"
      :rowStateeditable="false"
      :mergeColumnGroupName2="['순매출액']"></Realgrid>
  </div>
</template>

<script setup>
import { getSalesDatabyMonth } from "@/api/misales";
import Datepicker3 from "@/components/Datepicker3.vue";
import PageName from "@/components/pageName.vue";
import PickStorePlural from "@/components/pickStorePlural.vue";
import Realgrid from "@/components/realgrid.vue";
import { insertPageLog } from "@/customFunc/customFunc";
import Swal from "sweetalert2";
import { onMounted, ref } from "vue";
import { useStore } from "vuex";

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
});

const setGroupFooter = ref(false);

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
  //console.log(e);
  selectedendMonth.value = e;
};
const startYear = (e) => {
  //console.log(e);
  selectedstartYear.value = e;
};
const startMonth = (e) => {
  //console.log(e);
  selectedstartMonth.value = e;
};
const endYear = (e) => {
  //console.log(e);
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
//console.log(store.state.userData);

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

  try {
    store.state.loading = true;
    initGrid();
    if (tempChecked.value == true) {
      hideColumnsId.value = [];
    } else {
      hideColumnsId.value = ["strStore"];
    }
    reload.value = !reload.value;
    const startDate = `${selectedstartYear.value}-${String(
      selectedstartMonth.value
    ).padStart(2, "0")}-01`;
    const endDate = `${selectedendYear.value}-${String(
      selectedendMonth.value
    ).padStart(2, "0")}-01`;
    //console.log(selectedGroup.value);
    //console.log(selectedStores.value);
    //console.log(startDate);
    //console.log(endDate);
    //console.log(tempChecked.value ? 1 : 0);
    const res = await getSalesDatabyMonth(
      selectedGroup.value,
      selectedStores.value,
      startDate,
      endDate,
      tempChecked.value ? 1 : 0
    );
    //console.log(res);
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
  //console.log(e);
  selectedGroup.value = e;
};
const lngStoreCodes = (e) => {
  selectedStores.value = e;
  //console.log(e);
};
const lngStoreAttrs = (e) => {
  selectedStoreAttrs.value = e;
  //console.log(e);
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

const seeSum = (e) => {
  if (e.target.checked) {
    setGroupFooter.value = true;
  } else {
    setGroupFooter.value = false;
  }
  reload.value = !reload.value;
};
</script>

<style></style>
