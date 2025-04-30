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
      <Datepicker1
        @dateValue="dateValue"
        @year="year"
        @month="month"
        @day="day"
        @excelDate="excelDate"></Datepicker1>
      <div class="flex justify-center items-center ml-28 mr-3 space-x-3">
        <div class="text-base font-semibold">매출목표 :</div>
        <input
          type="text"
          class="rounded-lg pl-1 h-8 disabled:bg-white text-right"
          v-model="Project"
          disabled />
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
      :progname="'SLS01_091RPT_VUE'"
      :progid="1"
      :rowData="rowData"
      :selectionStyle="'singleRow'"
      :hideColumnsId="hideColumnsId"
      :setFooter="true"
      :documentTitle="'SLS01_091RPT'"
      :rowStateeditable="false"
      :documentSubTitle="documentSubTitle"
      :exporttoExcel="exporttoExcel"></Realgrid>
  </div>
</template>

<script setup>
import { getPlanbyTime } from "@/api/misales";
import Datepicker1 from "@/components/Datepicker1.vue";
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

const selectedDate = ref();
const documentSubTitle = ref();
const selectedExcelDate = ref();
const selectedExcelStore = ref();
const Project = ref(null);
const dateValue = (e) => {
  selectedDate.value = e;
  //comsole.log(selectedDate.value);
  initGrid();
};
const year = (e) => {
  //comsole.log(e);
};
const month = (e) => {
  //comsole.log(e);
};
const day = (e) => {
  //comsole.log(e);
};
const excelDate = (e) => {
  selectedExcelDate.value = e;
};
const excelStore = (e) => {
  selectedExcelStore.value = e;
};
const lngstoregroup = ref();
const lngstoreattr = ref();
const lngstoreteam = ref();
const lngstoresupervisor = ref();
const lngstorecode = ref();
const checked = ref([0]);
const hideColumnsId = ref(["strStoreName"]);
const lngStoreGroup = (e) => {
  lngstoregroup.value = e;
  //comsole.log(e);
};
const lngStoreAttrs = (e) => {
  lngstoreattr.value = e;
  //comsole.log(e);
};
const lngStoreTeam = (e) => {
  lngstoreteam.value = e;
  //comsole.log(e);
};
const lngSupervisor = (e) => {
  lngstoresupervisor.value = e;
  //comsole.log(e);
};
const lngStoreCode = (e) => {
  lngstorecode.value = e;
  //comsole.log(e);
};

const receiptNo = ref();
const initCheckBox = ref(false);
const initSearchWord = ref(false);
const store = useStore();
const loginedstrLang = store.state.userData.lngLanguage;
//comsole.log(store);

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
  store.state.loading = true;
  try {
    initGrid();
    let bit;
    if (checked.value.includes(1)) {
      bit = 1;
    } else {
      bit = 0;
    }
    const res = await getPlanbyTime(
      lngstoregroup.value,
      lngstoreattr.value,
      lngstoreteam.value,
      lngstoresupervisor.value,
      lngstorecode.value,
      selectedDate.value,
      bit
    );
    //comsole.log(res);

    rowData.value = res.data.List;
    afterSearch.value = true;

    Project.value =
      rowData.value[0]?.lngProject == "" ||
      rowData.value[0]?.lngProject == undefined
        ? ""
        : Number(rowData.value[0]?.lngProject).toLocaleString();
  } catch (error) {
    afterSearch.value = false;
  } finally {
    store.state.loading = false;
  }
};
const groupCd = ref();
const storeCd = ref();
const dtmDate = ref();
const init = ref(false);
const selectedStoreCd = (e) => {
  //comsole.log(e);
  storeCd.value = e;

  initGrid();
  selectedPosNo.value = "0";
  receiptNo.value = "";
  init.value = !init.value;
};
const selectedGroupCd = (e) => {
  //comsole.log(e);
  groupCd.value = e;
};
const rowData = ref([]);
const rowData2 = ref([]);
const rowData3 = ref([]);
const rowData4 = ref([]);

const selectedPosNo = ref();
const posNo = (e) => {
  //comsole.log(e);
  if (e == null) {
    selectedPosNo.value = 0;
  } else {
    selectedPosNo.value = e;
  }
};

const disCountCd = ref("");
const DisCountCd = (e) => {
  //comsole.log(e);
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
  documentSubTitle.value =
    selectedExcelDate.value + "\n" + selectedExcelStore.value;
  exporttoExcel.value = !exporttoExcel.value;
};
const initGrid = () => {
  //comsole.log(rowData.value);
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
};
const updateShowStore = (e) => {
  if (e.target.checked) {
    hideColumnsId.value = [];
    checked.value = [1];
  } else {
    hideColumnsId.value = ["strStoreName"];
    checked.value = [0];
  }
};
</script>
