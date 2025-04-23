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
          @endDate="endDate"
          @startDate="startDate"
          :closePopUp="closePopUp"
          ref="datepicker"
          @excelDate="excelDate"></Datepicker2>
        <div class="flex flex-col justify-start items-start text-nowrap ml-44">
          <div
            class="text-nowrap flex justify-start items-center space-x-10 -ml-3 mt-2">
            <div class="text-base font-semibold">승인구분 :</div>
            <div class="flex space-x-10">
              <label for="unite"
                ><input
                  type="radio"
                  id="unite"
                  name="cond"
                  :value="0"
                  v-model="selecetedCond"
                  checked />승인</label
              >
              <label for="store"
                ><input
                  type="radio"
                  id="store"
                  name="cond"
                  :value="1"
                  v-model="selecetedCond" />취소</label
              >
            </div>
          </div>
        </div>
        <div class="flex justify-start ml-40 pl-1 space-x-5">
          <div class="text-base font-semibold">조회조건 :</div>
          <label for="cunite"
            ><input
              type="checkbox"
              id="cunite"
              checked
              @click="cellUnite" />셀병합</label
          >
          <label for="sum"
            ><input
              type="checkbox"
              id="sum"
              checked
              @click="showSum" />합계</label
          >

          <div class="flex pl-24 space-x-5">
            <div class="text-base font-semibold">발급구분 :</div>
            <label for="all"
              ><input
                type="radio"
                id="all"
                name="issues"
                v-model="selecetedCond2"
                :value="0" />전체</label
            >
            <label for="issue"
              ><input
                type="radio"
                id="issue"
                name="issues"
                v-model="selecetedCond2"
                :value="1" />발급</label
            >
            <label for="nissue"
              ><input
                type="radio"
                id="nissue"
                name="issues"
                v-model="selecetedCond2"
                :value="2" />미발급</label
            >
          </div>
        </div>
      </div>
      <div class="ml-10 flex flex-col">
        <PickStoreSingle2
          @lngStoreCode="lngStoreCodes"
          @lngStoreGroup="lngStoreGroup"
          @excelStore="excelStore"
          @changeInit="changeInit"
          @lngSupervisor="lngSupervisor"
          @lngStoreTeam="lngStoreTeam"
          @lngStoreAttrs="lngStoreAttrs">
        </PickStoreSingle2>
        <div class="text-red-500 mt-5 mr-14 flex justify-end">
          <div>
            여신전문금융업법에 의거 3개월 이내의 자료만 조회 가능합니다.
          </div>
        </div>
      </div>
      <div></div>
    </div>

    <div class="w-full h-[80%]">
      <Realgrid
        :progname="'SLS11_008RPT_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :setFooter="true"
        :mergeMask="'strStore'"
        :setMergeMode="false"
        :setGroupFooter="setGroupFooter"
        :setRowGroupSpan2="setRowGroupSpan"
        :setGroupSumCustomColumnId2="['strStore']"
        :setGroupColumnId="'strStore,dtmDate'"
        :documentTitle="'SLS11_008RPT'"
        :documentSubTitle="documentSubTitle"
        :exporttoExcel="exportExcel"
        :setGroupOrderByColumnId="'strStore'">
      </Realgrid>
    </div>
  </div>
</template>

<script setup>
import {
  getCashReceiptDetail,
  getCauseList,
  getPastSalesChanges,
} from "@/api/misales";
import Datepicker2 from "@/components/Datepicker2.vue";
import PageName from "@/components/pageName.vue";
import PickStoreSingle2 from "@/components/pickStoreSingle.vue";
import Realgrid from "@/components/realgrid.vue";
import { insertPageLog } from "@/customFunc/customFunc";
import { onMounted, ref } from "vue";
import { useStore } from "vuex";

const progid = ref(1);
const setRowGroupSpan = ref("strStore,dtmDate");
const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);
const selectedstartDate = ref();
const selectedendDate = ref();
const hideColumnNow = ref(true);
const setGroupColumnId = ref("strName");
const hideColumnsId = ref([]);
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
const selecetedCond = ref(0);
const selecetedCond2 = ref(1);
onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const userGroup = store.state.storeGroup[0].lngStoreGroup;

  const res = await getCauseList(userGroup, 0);
  causeList.value = res.data.List;
  console.log(res);
});

const loginedstrLang = store.state.userData.lngLanguage;
const searchButton = async () => {
  store.state.loading = true;
  try {
    initGrid();

    reload.value = !reload.value;

    const res = await getCashReceiptDetail(
      selectedGroup.value,
      selectedStoreAttrs.value,
      selectedStoreTeam.value,
      selectedStoreSupervisor.value,
      selectedStores.value,
      selectedstartDate.value,
      selectedendDate.value,
      selecetedCond.value,
      selecetedCond2.value
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
const selectedStoreSupervisor = ref();
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
const lngStoreTeam = (e) => {
  selectedStoreTeam.value = e;
  console.log(e);
};
const lngSupervisor = (e) => {
  selectedStoreSupervisor.value = e;
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
  let condition = "승인구분 :";
  if (selecetedCond.value == 0) {
    condition += "승인";
  } else {
    condition += "취소";
  }
  let condition2 = "조회조건 :";
  if (setRowGroupSpan.value != "") {
    condition2 += "셀병합,";
  }

  if (setGroupFooter.value == true) {
    condition2 += "합계,";
  }

  condition2 = condition2.substring(0, condition2.length - 1);

  let condition3 = "발급구분 :";

  if (selecetedCond2.value == 0) {
    condition3 += "전체";
  } else if (selecetedCond2.value == 1) {
    condition3 += "발급";
  } else {
    condition3 += "미발급";
  }

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
    setRowGroupSpan.value = "strStore,dtmDate";
  } else {
    setRowGroupSpan.value = "";
  }
  reload.value = !reload.value;
};
const tempSum = ref(false);
const showSum = (e) => {
  if (e.target.checked) {
    setGroupFooter.value = true;
    reload.value = !reload.value;
  } else {
    setGroupFooter.value = false;
    reload.value = !reload.value;
  }
};
const changeInit = (e) => {
  initGrid();
};
</script>

<style></style>
