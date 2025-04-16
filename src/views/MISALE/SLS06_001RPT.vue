<template>
  <div class="h-full" @click="handleParentClick">
    <div class="flex justify-between items-center w-full overflow-y-hidden">
      <div class="flex justify-start w-full pl-12 pt-4">
        <div class="flex justify-start">
          <h1 class="font-bold text-sm md:text-2xl w-full">
            요일별 매출 현황.
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
        <label for="daily" class="font-thin inline-flex ml-4">
          <input
            type="checkbox"
            id="daily"
            @change="seeDaily"
            class="ml-20 mt-2" />
          <Datepicker2
            @startDate="startDate"
            @endDate="endDate"
            :closePopUp="closePopUp"
            ref="datepicker"
            :selectedGroup="selectedGroup"
            @excelDate="excelDate"
            class="pr-72"></Datepicker2>
        </label>
        <div
          class="flex justify-start items-center text-base text-nowrap font-semibold ml-36 pl-1">
          요일명 :
          <div class="flex ml-7 space-x-3 mt-1">
            <v-select
              v-model="selectWeekDay"
              :options="weekDay"
              placeholder="전체"
              label="strDName"
              class="w-48 !h-8 bg-white"
              clearable="true" />
          </div>
        </div>
      </div>
      <div class="h-[75%] ml-5">
        <label for="daily" class="font-thin inline-flex">
          <input type="checkbox" id="daily" @change="seeStore" />
          <!-- <PickStorePlural @lngStoreCodes="lngStoreCodes" @lngStoreGroup="lngStoreGroup" @lngStoreAttrs="lngStoreAttrs" @excelStore="excelStore" ></PickStorePlural> -->
          <pickStoreSingle
            @lngStoreCode="lngStoreCodes"
            @lngStoreGroup="lngStoreGroup"
            @excelStore="excelStore"
            @lngStoreAttrs="lngStoreAttrs"
            @lngStoreTeam="lngStoreTeam"
            @lngSupervisor="lngSupervisor"></pickStoreSingle>
        </label>
      </div>
    </div>
    <div class="w-full h-[82%]">
      <Realgrid
        :progname="'SLS06_001RPT_VUE'"
        :progid="progId"
        :rowData="rowData"
        :reload="reload"
        :setFooter="true"
        :setFooterExpressions="setFooterExpressions"
        :setFooterColID="setFooterColID"
        :setGroupFooter="setGroupFooter"
        :setGroupColumnId="setGroupColumnId"
        :setGroupSumCustomText="['소계']"
        :setGroupSumCustomColumnId="setGroupSumCustomColumnId"
        :setGroupSumCustomLevel="3"
        :setGroupSummaryCenterIds="setGroupSummaryCenterIds"
        :setGroupFooterExpressions="setGroupFooterExpressions"
        :setGroupFooterColID="setGroupFooterColID"
        :documentTitle="'SLS06_001RPT'"
        :documentSubTitle="documentSubTitle"
        :exporttoExcel="exportExcel">
      </Realgrid>
      <!-- <Realgrid :progname="'SLS05_004RPT_VUE'" :progid="1" :rowData="rowData" :reload="reload" 
         :setFooter="true" :setFooterExpressions="setFooterExpressions" :setFooterColID="setFooterColID"
         :exporttoExcel="exportExcel" :documentTitle="'SLS05_004RPT'" :documentSubTitle="documentSubTitle" 
      </Realgrid> -->
    </div>
  </div>
</template>

<script setup>
import { getWeedaySalesReport, getWeekDayList } from "@/api/misales";
import Datepicker2 from "@/components/Datepicker2.vue";
import pickStoreSingle from "@/components/pickStoreSingle.vue";
import Realgrid from "@/components/realgrid.vue";
import { insertPageLog } from "@/customFunc/customFunc";
import { onMounted, ref, watch } from "vue";
import { useStore } from "vuex";

const setFooterColID = ref([
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
const setFooterExpressions = ref([
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

const updateProgid = () => {
  if (tempSeeDaily.value && tempSeeStore.value) {
    reportCheckData.value = "12";
    setGroupSumCustomColumnId.value = ["dtmDate"];
    setGroupColumnId.value = "strStore,strWeek";
    console.log(setGroupColumnId.value);
    progId.value = "4";
  } else if (tempSeeDaily.value) {
    reportCheckData.value = "1";
    setGroupSumCustomColumnId.value = ["dtmDate"];
    setGroupColumnId.value = "strWeek";
    console.log(setGroupColumnId.value);
    progId.value = "2";
  } else if (tempSeeStore.value) {
    reportCheckData.value = "2";
    setGroupSumCustomColumnId.value = ["strWeek"];
    setGroupColumnId.value = "strStore";
    console.log(setGroupColumnId.value);
    progId.value = "3";
  } else {
    reportCheckData.value = "0";
    setGroupSumCustomColumnId.value = ["dtmDate"];
    setGroupColumnId.value = "";
    console.log(setGroupColumnId.value);
    progId.value = "1";
  }
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

    //그리드 갱신
    reload.value = !reload.value;

    //매장 선택
    let selectedStorearr;
    if (
      selectedStores.value == undefined ||
      selectedStores.value.length == 0 ||
      selectedStores.value == 0
    ) {
      selectedStorearr = 0;
    } else {
      selectedStorearr = selectedStores.value;
    }

    console.log(selectedStorearr);

    //요일명 선택 콤보박스
    let selectedWeekDayValue;
    if (
      selectedWeekDay.value == undefined ||
      selectedWeekDay.value.length == 0 ||
      selectedWeekDay.value == 0
    ) {
      selectedWeekDayValue = 0;
    } else {
      selectedWeekDayValue = selectedWeekDay.value;
    }

    console.log(selectedWeekDayValue);

    console.log(reportCheckData.value);

    const res = await getWeedaySalesReport(
      selectedGroup.value,
      selectedStoreAttrs.value,
      selectedStoreTeam.value,
      selectedStoreSuperVisor.value,
      selectedStorearr,
      selectedstartDate.value,
      selectedendDate.value,
      reportCheckData.value,
      selectedWeekDayValue
    );
    console.log(res);
    rowData.value = res.data.weekdaySales;

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
const selectedStoreTeam = ref();
const selectedStoreSuperVisor = ref();
const lngStoreGroup = (e) => {
  initGrid();
  console.log(e);
  selectedGroup.value = e;
};
const lngStoreCodes = (e) => {
  initGrid();
  selectWeekDay.value = null;
  selectedStores.value = e;
  console.log(e);
};
const lngStoreAttrs = (e) => {
  initGrid();
  selectedStoreAttrs.value = e;
  console.log(e);
};
const lngSupervisor = (e) => {
  initGrid();
  selectedStoreSuperVisor.value = e;
  console.log(e);
};
const lngStoreTeam = (e) => {
  initGrid();
  selectedStoreTeam.value = e;
  console.log(e);
};

/* 매입사 콤보박스 */
const selectWeekDay = ref(null);
const weekDay = ref([]);
const selectedWeekDay = ref("");

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getWeekDayList(87, "01");
  weekDay.value = res.data.weekDayList;
  console.log(weekDay.value);
});

// watch([selectedGroup, selectedStores], async () => {
//     console.log(selectedGroup.value, selectedStores.value)
//     const res = await getWeekDayList(87, '01')
//     weekDay.value = res.data.getWeekDayList
//     console.log(weekDay.value)
// })

watch(selectWeekDay, (newValue) => {
  selectedWeekDay.value = newValue ? newValue.strDcode : "";
  console.log(selectedWeekDay.value);
});

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
  documentSubTitle.value =
    selectedExcelDate.value + "\n" + selectedExcelStore.value;
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
