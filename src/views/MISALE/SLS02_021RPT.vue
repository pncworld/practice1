<template>
  <div class="h-full" @click="handleParentClick">
    <div class="flex justify-between items-center w-full overflow-y-hidden">
      <div class="flex justify-start w-full pl-12 pt-4">
        <div class="flex justify-start">
          <h1 class="font-bold text-sm md:text-2xl w-full">
            영수증 상세 매출 조회.
          </h1>
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
      class="grid grid-rows-1 grid-cols-2 justify-between bg-gray-200 rounded-lg h-14 items-center z-10">
      <div>
        <Datepicker2
          @endDate="endDate"
          @startDate="startDate"
          :closePopUp="closePopUp"
          ref="datepicker"
          @excelDate="excelDate"></Datepicker2>
      </div>
      <div class="w-96 ml-40">
        <PickStoreRenew3
          @lngStoreCode="selectedStoreCd"
          @lngStoreGroup="selectedGroupCd"
          @lngStoreAttrs="changeStoreType"
          @excelStore="excelStore"></PickStoreRenew3>
      </div>
    </div>

    <div class="grid grid-rows-1 grid-cols-1 h-[85%] mt-5">
      <Realgrid
        :progname="'SLS02_021RPT_VUE'"
        :progid="1"
        :rowData="rowData"
        :exporttoExcel="exporttoExcel"
        :documentTitle="'SLS02_021RPT'"
        :documentSubTitle="documentSubTitle">
      </Realgrid>
    </div>
  </div>
</template>

<script setup>
import { getReceiptDataDetail } from "@/api/misales";
import Datepicker2 from "@/components/Datepicker2.vue";
import PickStoreRenew3 from "@/components/pickStoreRenew.vue";
import Realgrid from "@/components/realgrid.vue";
import { insertPageLog } from "@/customFunc/customFunc";
import { onMounted, ref } from "vue";
import { useStore } from "vuex";

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
});

const selectedStartDate = ref();
const selectedEndDate = ref();

const startDate = (e) => {
  selectedStartDate.value = e;
};
const endDate = (e) => {
  selectedEndDate.value = e;
};
const lngStoreGroups = (e) => {
  console.log(e);
};
const lngStoreCodes = (e) => {
  console.log(e);
};

const receiptNo = ref();
const initCheckBox = ref(false);
const initSearchWord = ref(false);
const store = useStore();
const loginedstrLang = store.state.userData.lngLanguage;
console.log(store);

const afterSearch = ref(false);
const searchButton = async () => {
  store.state.loading = true;
  try {
    initGrid();

    const res = await getReceiptDataDetail(
      groupCd.value,
      storeCd.value,
      selectedStartDate.value,
      selectedEndDate.value
    );
    console.log(res);

    rowData.value = res.data.RECEIPT;
    afterSearch.value = true;
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

const selectedPosNo = ref();

const exporttoExcel = ref(false);
const excelButton = () => {
  documentSubTitle.value =
    selectedExcelDate.value + "\n" + selectedExcelStore.value;
  exporttoExcel.value = !exporttoExcel.value;
};
const initGrid = () => {
  if (rowData.value.length != 0) {
    rowData.value = [];
  }
};

const changeStoreType = (e) => {
  initGrid();
  init.value = !init.value;
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
const selectedExcelStore = ref("");
const excelDate = (e) => {
  selectedExcelDate.value = e;
};
const excelStore = (e) => {
  selectedExcelStore.value = e;
};
</script>
