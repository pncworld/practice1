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
      <div class="grid grid-cols-1 grid-rows-3 mt-12">
        <div class="flex">
          <Datepicker2
            @endDate="endDate"
            @startDate="startDate"
            :closePopUp="closePopUp"
            ref="datepicker"
            @excelDate="excelDate"
            :mainName="'일자'"
            :initToday="1"></Datepicker2>
        </div>
        <div
          class="text-nowrap flex justify-start items-center -space-x-7 ml-36 pl-1 -mt-1">
          <div class="text-base font-semibold">할인코드 :</div>
          <div class="flex mt-2 items-center justify-start">
            <v-select
              v-model="selectedDiscountCode"
              :options="discountCodeList"
              placeholder="전체"
              label="strName"
              class="custom-select5"
              clearable="true"
              @click="resetVselect2" />
          </div>
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
      </div>
      <div></div>
    </div>

    <div class="w-full h-[80%]">
      <Realgrid
        :progname="'SLS11_004RPT_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :setFooter="true"
        :setMergeMode="false"
        :setGroupSumCustomColumnId2="setGroupSumCustomColumnId2"
        :setGroupCustomLevel="2"
        :setGroupFooter="true"
        :setGroupColumnId="setGroupColumnId"
        :selectionStyle="'group'"
        :rowStateeditable="false"
        :setFooterCustomColumnId="['strStoreName']"
        :setFooterCustomText="['총합계']"
        :documentTitle="'SLS11_004RPT'"
        :documentSubTitle="documentSubTitle"
        :exporttoExcel="exportExcel">
      </Realgrid>
    </div>
  </div>
</template>

<script setup>
import { getDiscountCodes, getDiscountRecords } from "@/api/misales";
import Datepicker2 from "@/components/Datepicker2.vue";
import PageName from "@/components/pageName.vue";
import PickStoreSingle2 from "@/components/pickStoreSingle.vue";
import Realgrid from "@/components/realgrid.vue";
import { insertPageLog } from "@/customFunc/customFunc";
import { onMounted, ref } from "vue";
import { useStore } from "vuex";

const progid = ref(1);
const setRowGroupSpan = ref("");
const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);
const selectedstartDate = ref();
const selectedendDate = ref();
const hideColumnNow = ref(true);
const setGroupSumCustomColumnId2 = ref(["lngStoreCode"]);
const setGroupColumnId = ref("lngStoreCode");
const hideColumnsId = ref(["strStore", "dtmDate"]);
const startDate = (e) => {
  //console.log(e);
  selectedstartDate.value = e;
};
const endDate = (e) => {
  selectedendDate.value = e;
};

const setGroupFooter = ref(false);

const store = useStore();

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
});

const searchButton = async () => {
  store.state.loading = true;
  try {
    initGrid();
    let selectedlngCode = "";
    if (selectedDiscountCode.value == null) {
      selectedlngCode = 0;
    } else {
      selectedlngCode = selectedDiscountCode.value.lngCode;
    }
    reload.value = !reload.value;

    const res = await getDiscountRecords(
      selectedGroup.value,
      selectedStoreAttrs.value,
      selectedStoreTeam.value,
      selectedStoreSuperVisor.value,
      selectedStores.value,
      selectedstartDate.value,
      selectedendDate.value,
      selectedlngCode
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
const selectedStoreSuperVisor = ref();
const lngStoreGroup = (e) => {
  //console.log(e);
  selectedGroup.value = e;
};
const lngStoreCodes = async (e) => {
  selectedStores.value = e;
  //console.log(e);

  const res = await getDiscountCodes(selectedGroup.value, selectedStores.value);
  discountCodeList.value = res.data.List;
  selectedDiscountCode.value = null;
};
const lngStoreAttrs = (e) => {
  selectedStoreAttrs.value = e;
  //console.log(e);
};
const lngSupervisor = (e) => {
  selectedStoreSuperVisor.value = e;
  //console.log(e);
};
const lngStoreTeam = (e) => {
  selectedStoreTeam.value = e;
  //console.log(e);
};

const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
};

const exportExcel = ref(false);

const excelButton = () => {
  let condition2 = "할인코드 : ";
  if (selectedDiscountCode.value == null) {
    condition2 += "전체";
  } else {
    condition2 += selectedDiscountCode.value.strName;
  }

  //condition2 = condition2.substring(0,condition2.length-1)

  documentSubTitle.value =
    selectedExcelDate.value +
    "\n" +
    selectedExcelStore.value +
    "\n" +
    condition2;

  exportExcel.value = !exportExcel.value;
};

const selectedDiscountCode = ref(null);
const discountCodeList = ref([]);
const resetVselect2 = () => {
  selectedDiscountCode.value = null;
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

const changeInit = (e) => {
  initGrid();
};
</script>

<style></style>
