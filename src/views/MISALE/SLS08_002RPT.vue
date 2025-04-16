<template>
  <div class="h-full" @click="handleParentClick">
    <div class="flex justify-between items-center w-full overflow-y-hidden">
      <div class="flex justify-start w-full pl-12 pt-4">
        <div class="flex justify-start">
          <h1 class="font-bold text-sm md:text-2xl w-full">주문 취소 현황.</h1>
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
      class="grid grid-cols-2 grid-rows-1 justify-between bg-gray-200 rounded-lg h-24 items-center z-10">
      <div class="grid grid-cols-1 grid-rows-3 mt-12">
        <Datepicker2
          class="ml-9"
          @endDate="endDate"
          @startDate="startDate"
          :closePopUp="closePopUp"
          ref="datepicker"
          @excelDate="excelDate"></Datepicker2>
        <div class="flex justify-between items-center text-nowrap ml-40 -mt-2">
          <div
            class="text-nowrap flex justify-start items-center space-x-10 ml-8">
            <div class="text-base font-semibold">조건 :</div>
            <div class="flex space-x-10">
              <label for="store"
                ><input
                  type="checkbox"
                  id="store"
                  @click="showStore" />매장명</label
              >
              <label for="unite"
                ><input
                  type="checkbox"
                  id="unite"
                  @click="cellUnite" />셀병합</label
              >
              <!-- <label for="sum"><input type="checkbox" id="sum" @click="showSum">합계</label> -->
            </div>
          </div>
          <div class="flex justify-end -space-x-5 mt-3 ml-[422px]">
            <div class="text-base font-semibold">사유코드 :</div>
            <v-select
              v-model="selectedCause"
              :options="causeList"
              placeholder="전체"
              label="strName"
              class="custom-select4 !mr-10"
              clearable="true"
              @click="resetVselect2" />
          </div>
        </div>
      </div>
      <div class="ml-10 -mt-10">
        <PickStoreRenew3
          @lngStoreCode="lngStoreCodes"
          @lngStoreGroup="lngStoreGroup"
          @excelStore="excelStore"
          @changeInit="changeInit"
          @lngStoreAttrs="lngStoreAttrs">
        </PickStoreRenew3>
      </div>
      <div></div>
    </div>

    <div class="w-full h-[80%]">
      <Realgrid
        :progname="'SLS08_002RPT_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :setFooter="true"
        :mergeMask="mergeMask"
        :setMergeMode="false"
        :setGroupSumCustomColumnId="['dtmDate']"
        :setGroupSumCustomText="['소계']"
        :setGroupFooter="true"
        :setGroupColumnId="setGroupColumnId"
        :setGroupFooterExpressions="['sum', 'sum']"
        :setGroupFooterColID="['intCount', 'lngActAmt']"
        :hideColumnsId="hideColumnsId"
        :setRowGroupSpan2="setRowGroupSpan"
        :setFooterExpressions="['sum', 'sum']"
        :setFooterColID="['intCount', 'lngActAmt']"
        :documentTitle="'SLS08_002RPT'"
        :documentSubTitle="documentSubTitle"
        :exporttoExcel="exportExcel">
      </Realgrid>
    </div>
  </div>
</template>

<script setup>
import { getCauseListbyMenu, getMenusCancelData } from "@/api/misales";
import Datepicker2 from "@/components/Datepicker2.vue";
import PickStoreRenew3 from "@/components/pickStoreRenew.vue";
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
const reportType = ref(1);
const setGroupColumnId = ref("dtmDate");
const hideColumnsId = ref(["strStore"]);
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
onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const userGroup = store.state.storeGroup[0].lngStoreGroup;

  const res = await getCauseListbyMenu(userGroup, 0);
  causeList.value = res.data.List;
  console.log(res);
});

const loginedstrLang = store.state.userData.lngLanguage;
const searchButton = async () => {
  store.state.loading = true;
  try {
    initGrid();
    let cause;
    if (selectedCause.value == null || selectedCause.value == undefined) {
      cause = 0;
    } else {
      cause = selectedCause.value.lngCode;
    }

    if (tempHideStore.value == true) {
      hideColumnsId.value = [];
      mergeMask.value = "strStore";
      setGroupColumnId.value = "strStore";
    } else {
      hideColumnsId.value = ["strStore"];
      setGroupColumnId.value = "dtmDate";
      mergeMask.value = "dtmDate";
    }
    if (tempCellUnite.value == true) {
      if (tempHideStore.value == true) {
        setRowGroupSpan.value = "strStore,dtmDate";
      } else {
        setRowGroupSpan.value = "dtmDate";
      }
    } else {
      setRowGroupSpan.value = "";
    }

    // if(tempSum.value == true){
    //   setGroupFooter.value = true
    // } else {
    //   setGroupFooter.value = false
    // }

    reload.value = !reload.value;

    const res = await getMenusCancelData(
      selectedGroup.value,
      selectedStoreAttrs.value,
      selectedStores.value,
      selectedstartDate.value,
      selectedendDate.value,
      reportType.value,
      cause
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

console.log(store.state.minorCategory);

const excelButton = () => {
  let condition = "조건 :";
  if (tempHideStore.value == true) {
    condition += "매장명,";
  }
  if (tempCellUnite.value == true) {
    condition += "셀병합,";
  }

  condition = condition.substring(0, condition.length - 1);
  let codestr;
  if (selectedCause.value == null || selectedCause.value == undefined) {
    codestr = "전체";
  } else {
    codestr = causeList.value.filter(
      (item) => item.lngCode == selectedCause.value.lngCode
    )[0].strName;
  }

  documentSubTitle.value =
    selectedExcelDate.value +
    "\n" +
    selectedExcelStore.value +
    "\n" +
    condition +
    "\n" +
    "사유코드 : " +
    codestr;
  console.log(documentSubTitle.value);
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
    reportType.value = "12";
  } else {
    tempHideStore.value = false;
    reportType.value = "1";
  }
};
const tempCellUnite = ref(false);
const cellUnite = (e) => {
  if (e.target.checked) {
    tempCellUnite.value = true;
  } else {
    tempCellUnite.value = false;
  }
};
const tempSum = ref(false);
//   const showSum = (e) => {
//       if(e.target.checked){
//         //tempSum.value = true

//         if(tempHideStore.value == true){
//           setGroupColumnId.value = 'strStore'
//         } else {
//           setGroupColumnId.value = 'dtmDate'
//         }
//         setGroupFooter.value = true
//         reload.value = !reload.value
//       } else {
//         //tempSum.value = false
//         setGroupFooter.value = false
//         reload.value = !reload.value
//       }
//   }
const changeInit = (e) => {
  initGrid();
};
</script>

<style></style>
