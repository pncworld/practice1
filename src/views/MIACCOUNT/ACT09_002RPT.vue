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
      class="grid grid-cols-2 grid-rows-1 justify-between bg-gray-200 rounded-lg h-24 items-center z-10">
      <div class="grid grid-cols-1 grid-rows-2 mt-1">
        <Datepicker2
          @endDate="endDate"
          @startDate="startDate"
          :closePopUp="closePopUp"
          ref="datepicker"
          @excelDate="excelDate"
          :mainName="'일자'"
          :initToday="'1'"></Datepicker2>
        <div
          class="flex justify-start items-center text-nowrap ml-36 space-x-10 mt-1">
          <div class="flex items-center">
            <div class="font-semibold text-base">거래 구분 :</div>
            <div>
              <select
                name=""
                id=""
                class="rounded-lg h-8 ml-2 w-24"
                v-model="tranType">
                <option :value="1">포인트</option>
                <option :value="2">급여공제</option>
              </select>
            </div>
          </div>
          <div class="flex items-center">
            <div class="font-semibold text-base ml-3">조회 옵션:</div>
            <select
              name=""
              id=""
              class="rounded-lg h-8 ml-3 w-24"
              v-model="lngOption"
              @change="resetOptionValue">
              <option :value="0">선택</option>
              <option :value="1">부서</option>
              <option :value="2">소속사</option>
            </select>
            <input
              type="text"
              class="rounded-lg h-8 ml-2 pl-1 disabled:bg-gray-100 border"
              v-model="optionValue"
              :disabled="lngOption == 0" />
          </div>

          <div class="flex items-center pl-[85px]">
            <div class="font-semibold text-base">사원명 :</div>
            <input
              type="text"
              class="rounded-lg h-8 ml-3"
              v-model="empId"
              readonly
              @keydown="resetInputBox" />
            <input
              type="text"
              class="rounded-lg h-8 ml-3"
              v-model="empName"
              readonly
              @keydown="resetInputBox" />
            <button
              class="button primary !h-7 !w-16 ml-2"
              @click="openPopUp"
              ref="button">
              조회
            </button>
            <EmployeePopUp
              @custId="custId"
              @custName="custName"
              :open="open"
              ref="employee"
              @updateOpen="updateOpen"
              class="absolute right-56 top-56 z-40"></EmployeePopUp>
          </div>
        </div>
      </div>
      <div class="ml-20 -mt-10">
        <PickStoreRenew3
          @lngStoreCode="lngStoreCodes"
          @lngStoreGroup="lngStoreGroup"
          @excelStore="excelStore"
          @lngStoreAttrs="lngStoreAttrs"
          @changeInit="changeInit">
        </PickStoreRenew3>
      </div>
      <div></div>
    </div>

    <div class="w-full h-[80%]">
      <Realgrid
        :progname="'ACT09_002RPT_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :setFooter="true"
        :setFooterExpressions="['sum', 'sum']"
        :setFooterColID="['lngUseCnt', 'dblSaleAmt']"
        :setFooterCustomColumnId="['strSaleCustName']"
        :setFooterCustomText="['합계']"
        :setGroupFooterColID="['strName', 'lngUseCnt', 'dblSaleAmt']"
        :setGroupFooterExpressions="['custom', 'sum', 'sum']"
        :setGroupSumCustomColumnId="['strSaleCustName']"
        :setGroupSumCustomText="['사원소계']"
        :setGroupFooter="true"
        :setMergeMode="false"
        :setGroupColumnId="'strSaleCustID'"
        :documentTitle="'ACT09_002RPT'"
        :documentSubTitle="documentSubTitle"
        :exporttoExcel="exportExcel">
      </Realgrid>
    </div>
  </div>
</template>

<script setup>
import { getEmployeeDetailSummary } from "@/api/account";
import { getCauseList } from "@/api/misales";
import Datepicker2 from "@/components/Datepicker2.vue";
import EmployeePopUp from "@/components/employeePopUp.vue";
import PageName from "@/components/pageName.vue";
import PickStoreRenew3 from "@/components/pickStoreRenew.vue";
import Realgrid from "@/components/realgrid.vue";
import { insertPageLog } from "@/customFunc/customFunc";
import { onMounted, ref } from "vue";
import { useStore } from "vuex";

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
});

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
const empId = ref("");
const empName = ref("");
const startTime = ref(0);
const endTime = ref(23);
const setGroupFooter = ref(true);
const selectedCause = ref(null);
const store = useStore();
const causeList = ref([]);
const tranType = ref(1);
const lngOption = ref(0);
const optionValue = ref("");
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

    // if(tempSum.value == true){
    //   setGroupFooter.value = true
    // } else {
    //   setGroupFooter.value = false
    // }

    reload.value = !reload.value;

    const res = await getEmployeeDetailSummary(
      selectedGroup.value,
      selectedStoreAttrs.value,
      selectedStores.value,
      selectedstartDate.value,
      selectedendDate.value,
      tranType.value,
      empId.value,
      lngOption.value,
      optionValue.value
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

//console.log(store.state.minorCategory);

const excelButton = () => {
  let condition = "거래 구분 :";

  if (tranType.value == 1) {
    condition += "포인트";
  } else {
    condition += "급여공제";
  }

  let condition2 = "조회 옵션 :";
  if (lngOption.value == 0) {
    condition2 += "선택";
  } else if (lngOption.value == 1) {
    condition2 += "부서";
  } else if (lngOption.value == 2) {
    condition2 += "소속사";
  }
  condition2 += optionValue.value;

  let condition3 = "사원명 : " + empId.value + "," + empName.value;

  documentSubTitle.value =
    selectedExcelDate.value +
    "\n" +
    selectedExcelStore.value +
    "\n" +
    condition +
    "\n" +
    condition2 +
    "\n" +
    condition3;
  //console.log(documentSubTitle.value);
  exportExcel.value = !exportExcel.value;
};

const resetVselect2 = () => {
  endTime.value = 23;
};
const datepicker = ref(null);
const employee = ref(null);
const button = ref(null);
const closePopUp = ref(false);
const handleParentClick = (e) => {
  const datepickerEl = datepicker.value?.$el;
  const employeeEl = employee.value?.$el;

  if (datepickerEl && datepickerEl.contains(e.target)) {
    return;
  }
  if (employeeEl && employeeEl.contains(e.target)) {
    return;
  }
  if (e.target.closest("button")) {
    return;
  }
  open.value = false;
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
const custName = (e) => {
  empName.value = e;
};
const custId = (e) => {
  empId.value = e;
};
const open = ref(false);
const openPopUp = (e) => {
  empName.value = "";
  empId.value = "";
  open.value = true;
};
const updateOpen = (e) => {
  open.value = false;
};
const resetOptionValue = (e) => {
  if (e.target.value == 0) {
    optionValue.value = "";
  }
};

const resetInputBox = (e) => {
  if (e.keyCode === 8 || e.keyCode === 46) {
    empId.value = "";
    empName.value = "";
  }
};
</script>

<style></style>
