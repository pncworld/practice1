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
      <div class="grid grid-cols-1 grid-rows-2 mt-2 space-y-1">
        <Datepicker2
          @endDate="endDate"
          @startDate="startDate"
          :closePopUp="closePopUp"
          ref="datepicker"
          @excelDate="excelDate"></Datepicker2>

        <div class="flex justify-center mr-12 -space-x-5">
          <div class="text-base font-semibold ml-24 text-nowrap">
            결제코드 :
          </div>
          <div class="flex justify-center">
            <v-select
              v-model="selectedCode"
              :options="codeList"
              placeholder="전체"
              label="strName"
              class="custom-select5"
              clearable="true"
              @click="resetVselect2" />
          </div>
        </div>
      </div>
      <div class="ml-10 mt-2">
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
        :progname="'SLS12_019RPT_VUE'"
        :progid="progid"
        :rowData="rowData"
        :reload="reload"
        :setFooter="true"
        :mergeMask="''"
        :setMergeMode="false"
        :setGroupFooter="setGroupFooter"
        :setGroupColumnId="setGroupColumnId"
        :setGroupCustomLevel="2"
        :setGroupSumCustomColumnId2="['lngStoreCode']"
        :setFooterCustomColumnId="['strStoreName']"
        :setFooterCustomText="['총합계']"
        :documentTitle="'SLS12_019RPT'"
        :rowStateeditable="false"
        :documentSubTitle="documentSubTitle"
        :exporttoExcel="exportExcel">
      </Realgrid>
    </div>
  </div>
</template>

<script setup>
import { getpayCodeList2, getSalesDetail } from "@/api/misales";
import Datepicker2 from "@/components/Datepicker2.vue";
import PageName from "@/components/pageName.vue";
import PickStoreSingle2 from "@/components/pickStoreSingle.vue";
import Realgrid from "@/components/realgrid.vue";
import { insertPageLog } from "@/customFunc/customFunc";
import { onMounted, ref } from "vue";
import { useStore } from "vuex";

const orderPay = ref(1);
const setFooterColID = ref(["lngCount", "lngPreAmt", "lngAmt", "lngChange"]);
const setGroupFooterColID = ref(["lngStoreCode"]);
const setFooterExpressions = ref(["sum", "sum", "sum", "sum"]);
const setGroupFooterExpressions = ref(["sum", "sum", "sum", "sum"]);
const codeList = ref([]);
const selectedCode = ref(null);
const progid = ref(1);
const setRowGroupSpan = ref("lngStoreCode,strName");
const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);
const selectedstartDate = ref();
const selectedendDate = ref();
const hideColumnNow = ref(true);
const setGroupColumnId = ref("lngStoreCode");
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
const setGroupFooter = ref(true);
const selectedCause = ref(null);
const store = useStore();
const causeList = ref([]);
const mergeMask = ref();
onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const userGroup = store.state.storeGroup[0].lngStoreGroup;

  const res = await getpayCodeList2(userGroup, 0);
  codeList.value = res.data.List;
  console.log(res);
});

const loginedstrLang = store.state.userData.lngLanguage;
const searchButton = async () => {
  store.state.loading = true;
  try {
    initGrid();
    let code;
    if (selectedCode.value == null || selectedCode.value == undefined) {
      code = 0;
    } else {
      code = selectedCode.value.lngCode;
    }

    reload.value = !reload.value;

    const res = await getSalesDetail(
      selectedGroup.value,
      selectedStoreAttrs.value,
      selectedStoreTeam.value,
      selectedStoreSuperVisor.value,
      selectedStores.value,
      selectedstartDate.value,
      selectedendDate.value,
      code
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
  const userGroup = store.state.storeGroup[0].lngStoreGroup;

  const res = await getpayCodeList2(userGroup, selectedStores.value);
  codeList.value = res.data.List;
  console.log(e);
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

const excelButton = () => {
  // let condition = '조건 :';
  // if(tempHideStore.value == true){
  //   condition+="매장명,"
  // }
  // if(tempCellUnite.value == true){
  //   condition+="셀병합,"
  // }
  // if(setGroupFooter.value == true){
  //   condition+="합계,"
  // }
  // condition= condition.substring(0,condition.length-1)
  let codestr = "결제코드 :";
  if (selectedCode.value == null || selectedCode.value == undefined) {
    codestr += "전체";
  } else {
    codestr += selectedCode.value.strName;
  }

  documentSubTitle.value =
    selectedExcelDate.value + "\n" + selectedExcelStore.value + "\n" + codestr;
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
  } else {
    tempHideStore.value = false;
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
const showSum = (e) => {
  if (e.target.checked) {
    //tempSum.value = true

    setGroupColumnId.value = "strName";
    setGroupFooter.value = true;
    reload.value = !reload.value;
  } else {
    //tempSum.value = false
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
