<template>
  <div class="h-full" @click="handleParentClick">
    <div class="flex justify-between items-center w-full overflow-y-hidden">
      <div class="flex justify-start w-full pl-12 pt-4">
        <div class="flex justify-start">
          <h1 class="font-bold text-sm md:text-2xl w-full">
            좌석별 시간대별 현황.
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
      class="grid grid-cols-2 grid-rows-1 justify-between bg-gray-200 rounded-lg h-24 items-center z-10">
      <div class="grid grid-cols-1 grid-rows-2">
        <Datepicker2
          @startDate="startDate"
          @endDate="endDate"
          :closePopUp="closePopUp"
          ref="datepicker"
          :selectedGroup="selectedGroup"
          @excelDate="excelDate" />
        <div
          class="flex justify-start items-center text-base text-nowrap font-semibold ml-44">
          시간대 :
          <div class="ml-4">
            <v-select
              v-model="selectedStartTime"
              :options="times"
              label="strName"
              class="w-28 custom-select3"
              clearable="true"
              @click="resetVselect" />
          </div>
          <div class="ml-3">~</div>
          <div class="ml-4">
            <v-select
              v-model="selectedEndTime"
              :options="times"
              label="strName"
              class="w-28 custom-select3"
              clearable="true"
              @click="resetVselect2" />
          </div>
        </div>
      </div>
      <div class="h-[75%] ml-5">
        <pickStoreRenew
          @lngStoreCode="lngStoreCode"
          @lngStoreGroup="lngStoreGroup"
          @excelStore="excelStore"
          @lngStoreAttrs="lngStoreAttrs"></pickStoreRenew>
      </div>
    </div>
    <div class="w-full h-[82%]">
      <Realgrid
        :progname="'SLS11_006RPT_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :setFooter="true"
        :setFooterExpressions="setFooterExpressions"
        :setFooterColID="setFooterColID"
        :setFooterCustomColumnId="['strStoreName']"
        :setFooterCustomText="['총합계']"
        :documentTitle="'SLS11_006RPT'"
        :documentSubTitle="documentSubTitle"
        :exporttoExcel="exportExcel">
      </Realgrid>
    </div>
  </div>
</template>

<script setup>
import { getSalesByTimeAndSeats } from "@/api/misales";
import Datepicker2 from "@/components/Datepicker2.vue";
import pickStoreRenew from "@/components/pickStoreRenew.vue";
import Realgrid from "@/components/realgrid.vue";
import { insertPageLog } from "@/customFunc/customFunc";
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
});
const setFooterColID = ref(["strStoreName"]);
const setFooterExpressions = ref(["custom"]);
const setGroupFooter = ref(true);
const setGroupFooterColID = ref([
  "lngWeekCnt",
  "lngCustCnt",
  "lngCustAmt",
  "lngRecCnt",
  "lngRecAmt",
  "lngSalAmt",
  "lngActAmt",
  "lngSumAmt",
  "lngAvgCustCnt",
  "lngAvgActAmt",
  "dblDistRate",
]);
const setGroupFooterExpressions = ref([
  "sum",
  "sum",
  "avg",
  "sum",
  "avg",
  "sum",
  "sum",
  "sum",
  "sum",
  "avg",
  "sum",
]);
const setGroupSummaryCenterIds = ref("dtmDate, strWeek");
const setGroupSumCustomColumnId = ref(["strWeek"]);
const setGroupColumnId = ref("");
const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);
const selectedstartDate = ref();
const selectedendDate = ref();
const selectedStartTime = ref({ value: 0, strName: "00:00" });
const selectedEndTime = ref({ value: 23, strName: "23:00" });
const times = ref([
  { value: 0, strName: "00:00" },
  { value: 1, strName: "01:00" },
  { value: 2, strName: "02:00" },
  { value: 3, strName: "03:00" },
  { value: 4, strName: "04:00" },
  { value: 5, strName: "05:00" },
  { value: 6, strName: "06:00" },
  { value: 7, strName: "07:00" },
  { value: 8, strName: "08:00" },
  { value: 9, strName: "09:00" },
  { value: 10, strName: "10:00" },
  { value: 11, strName: "11:00" },
  { value: 12, strName: "12:00" },
  { value: 13, strName: "13:00" },
  { value: 14, strName: "14:00" },
  { value: 15, strName: "15:00" },
  { value: 16, strName: "16:00" },
  { value: 17, strName: "17:00" },
  { value: 18, strName: "18:00" },
  { value: 19, strName: "19:00" },
  { value: 20, strName: "20:00" },
  { value: 21, strName: "21:00" },
  { value: 22, strName: "22:00" },
  { value: 23, strName: "23:00" },
]);
const resetVselect = () => {
  selectedStartTime.value = { value: 0, strName: "00:00" };
};
const resetVselect2 = () => {
  selectedEndTime.value = { value: 23, strName: "23:00" };
};
const startDate = (e) => {
  console.log(e);
  selectedstartDate.value = e;
};

const endDate = (e) => {
  console.log(e);
  selectedendDate.value = e;
};

const tempSeeDaily = ref(false);
const tempSeeStore = ref(false);
const reportCheckData = ref("0");
const progId = ref("1");

const seeDaily = (e) => {
  tempSeeDaily.value = e.target.checked;
  updateProgid();
};

const seeStore = (e) => {
  tempSeeStore.value = e.target.checked;
  updateProgid();
};

const store = useStore();
const loginedstrLang = store.state.userData.lngLanguage;

const datepicker = ref(null);
const closePopUp = ref(false);
const handleParentClick = (e) => {
  const datepickerEl = datepicker.value?.$el;
  if (datepickerEl && datepickerEl.contains(e.target)) {
    return;
  }
  closePopUp.value = !closePopUp.value;
};

/*
 *조회 처리 함수
 */
const searchButton = async () => {
  store.state.loading = true;
  try {
    initGrid();

    const res = await getSalesByTimeAndSeats(
      selectedGroup.value,
      selectedStoreAttrs.value,
      selectedStores.value,
      selectedstartDate.value + " " + selectedStartTime.value.strName,
      selectedendDate.value + " " + selectedEndTime.value.strName
    );
    console.log(res);
    rowData.value = res.data.List;

    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    console.log(error);
  } finally {
    store.state.loading = false;
  }
};

/* 매장 컴포넌트 관련 함수 */
const selectedGroup = ref();
const selectedStores = ref();
const selectedStoreAttrs = ref();
const lngStoreGroup = (e) => {
  initGrid();
  console.log(e);
  selectedGroup.value = e;
};
const lngStoreCode = (e) => {
  initGrid();
  selectedStores.value = e;
  console.log(e);
};
const lngStoreAttrs = (e) => {
  initGrid();
  selectedStoreAttrs.value = e;
  console.log(e);
};

/*
그리드 초기화
*/
const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
};

//엑셀 버튼 처리 함수
const exportExcel = ref(false);
const excelButton = () => {
  let condition = "시간대 :";
  condition +=
    selectedStartTime.value.strName + "~" + selectedEndTime.value.strName;
  documentSubTitle.value =
    selectedExcelDate.value +
    "\n" +
    selectedExcelStore.value +
    "\n" +
    condition;
  console.log(documentSubTitle.value); // 맑음 소스 pickStorePlural.vue 소스의 excelStore 받아야 함.
  // 엑셀 기능 실행
  exportExcel.value = !exportExcel.value;
};

// 엑셀 추출
const documentSubTitle = ref("");
const selectedExcelDate = ref("");
const excelDate = (e) => {
  selectedExcelDate.value = e;
  console.log(e);
};
const selectedExcelStore = ref("");
const excelStore = (e) => {
  selectedExcelStore.value = e;
  console.log(e);
};
</script>
