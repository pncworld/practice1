<template>
  <div class="h-full" @click="handleParentClick">
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
      class="grid grid-cols-2 grid-rows-1 justify-between bg-gray-200 rounded-lg h-32 items-center z-10">
      <div class="grid grid-cols-1 grid-rows-3 mt-5">
        <Datepicker2
          class="ml-9"
          @endDate="endDate"
          @startDate="startDate"
          :closePopUp="closePopUp"
          ref="datepicker"
          @excelDate="excelDate"></Datepicker2>
        <div class="flex flex-col justify-start items-start text-nowrap ml-40">
          <div
            class="text-nowrap flex justify-start items-center space-x-10 ml-8 mt-2">
            <div class="text-base font-semibold">조건 :</div>
            <div class="flex space-x-10">
              <label for="unite"
                ><input
                  type="checkbox"
                  id="unite"
                  @click="cellUnite"
                  checked />셀병합</label
              >
              <label for="store"
                ><input
                  type="checkbox"
                  id="store"
                  @click="showSum"
                  checked />합계</label
              >
            </div>
          </div>
        </div>
        <div class="flex justify-center -mr-16 -space-x-5">
          <div class="text-base font-semibold ml-5">사유코드 :</div>
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
      <div class="ml-10 -mt-10">
        <PickStoreSingle2
          @lngStoreCode="lngStoreCodes"
          @lngStoreGroup="lngStoreGroup"
          @excelStore="excelStore"
          @changeInit="changeInit"
          @lngSupervisor="lngSupervisor"
          @lngStoreTeam="lngStoreTeam"
          @lngStoreAttrs="lngStoreAttrs">
        </PickStoreSingle2>
      </div>
      <div></div>
    </div>

    <div class="w-full h-[80%]">
      <Realgrid
        :progname="'SLS08_005RPT_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :setFooter="true"
        :mergeMask="''"
        :setMergeMode="false"
        :rowStateeditable="false"
        :setGroupSumCustomColumnId="['dtmDate']"
        :setGroupSumCustomText="['소계']"
        :setGroupFooter="setGroupFooter"
        :setGroupColumnId="setGroupColumnId"
        :setGroupFooterExpressions="['sum', 'sum', 'sum', 'sum']"
        :setGroupFooterColID="[
          'lngBActamt',
          'lngAActamt',
          'lngAActamt2',
          'lngChange',
        ]"
        :hideColumnsId="hideColumnsId"
        :setRowGroupSpan2="setRowGroupSpan"
        :setFooterExpressions="['sum', 'sum', 'sum', 'sum']"
        :setFooterColID="[
          'lngBActamt',
          'lngAActamt',
          'lngAActamt2',
          'lngChange',
        ]"
        :documentTitle="'SLS08_005RPT'"
        :documentSubTitle="documentSubTitle"
        :exporttoExcel="exportExcel"
        :setGroupOrderByColumnId="'dtmDate'">
      </Realgrid>
    </div>
  </div>
</template>

<script setup>
import { getCauseList, getPastSalesChanges } from "@/api/misales";
import Datepicker2 from "@/components/Datepicker2.vue";
import PageName from "@/components/pageName.vue";
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
const setGroupColumnId = ref("strName");
const hideColumnsId = ref([]);
const startDate = (e) => {
  //console.log(e);
  selectedstartDate.value = e;
};
const endDate = (e) => {
  selectedendDate.value = e;
};
const startTime = ref(0);
const endTime = ref(23);
const setGroupFooter = ref(true);
const selectedCause = ref(null);
const store = useStore();
const causeList = ref([]);
const mergeMask = ref();
onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const userGroup = store.state.storeGroup[0].lngStoreGroup;

  const res = await getCauseList(userGroup, 0);
  causeList.value = res.data.List;
  //console.log(res);
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

    if (tempCellUnite.value == true) {
      setRowGroupSpan.value = "strName";
    } else {
      setRowGroupSpan.value = "";
    }

    // if(tempSum.value == true){
    //   setGroupFooter.value = true
    // } else {
    //   setGroupFooter.value = false
    // }

    reload.value = !reload.value;

    const res = await getPastSalesChanges(
      selectedGroup.value,
      selectedStoreAttrs.value,
      selectedStoreTeam.value,
      selectedStoreSupervisor.value,
      selectedStores.value,
      selectedstartDate.value,
      selectedendDate.value,
      "12",
      cause
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
const selectedStoreTeam = ref();
const selectedStoreSupervisor = ref();
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
const lngStoreTeam = (e) => {
  selectedStoreTeam.value = e;
  //console.log(e);
};
const lngSupervisor = (e) => {
  selectedStoreSupervisor.value = e;
  //console.log(e);
};

const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
};

const exportExcel = ref(false);

//console.log(store.state.minorCategory);

const excelButton = () => {
  let condition = "조건 :";
  if (tempCellUnite.value == true) {
    condition += "셀병합,";
  }
  if (setGroupFooter.value == true) {
    condition += "합계,";
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
  //console.log(documentSubTitle.value);
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
const tempHideStore = ref(true);

const tempCellUnite = ref(true);
const cellUnite = (e) => {
  if (e.target.checked) {
    tempCellUnite.value = true;
    setRowGroupSpan.value = "strName";
  } else {
    tempCellUnite.value = false;
    setRowGroupSpan.value = "";
  }
  reload.value = !reload.value;
};
const tempSum = ref(false);
const showSum = (e) => {
  if (e.target.checked) {
    setGroupColumnId.value = "strName";
    setGroupFooter.value = true;
    reload.value = !reload.value;
  } else {
    setGroupColumnId.value = "";
    setGroupFooter.value = false;
    reload.value = !reload.value;
  }
};
const changeInit = (e) => {
  initGrid();
};
</script>

<style></style>
