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
      <div class="grid grid-cols-1 grid-rows-2">
        <Datepicker2
          @startDate="startDate"
          @endDate="endDate"
          :closePopUp="closePopUp"
          ref="datepicker"
          :selectedGroup="selectedGroup"
          @excelDate="excelDate" />
        <div
          class="flex justify-start items-center text-base text-nowrap font-semibold ml-48">
          조건 :
          <div class="ml-4">
            <label for="byday"
              ><input
                type="checkbox"
                id="byday"
                @click="showDay" />일자별</label
            >
          </div>
          <div class="ml-3">
            <label for="bystore"
              ><input
                type="checkbox"
                id="bystore"
                @click="showStore" />매장명</label
            >
          </div>
          <div class="ml-4">
            <label for="bysum"
              ><input type="checkbox" id="bysum" @click="showSum" />합계</label
            >
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
        :progname="'SLS11_013RPT_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :setGroupColumnId="setGroupColumnId"
        :setMergeMode="false"
        :setGroupSumCustomColumnId2="['strStoreName']"
        :setFooter="true"
        :setGroupFooter="setGroupFooter"
        :setFooterExpressions="setFooterExpressions"
        :hideColumnsId="hideColumnsId"
        :documentTitle="'SLS11_013RPT'"
        :rowStateeditable="false"
        :documentSubTitle="documentSubTitle"
        :exporttoExcel="exportExcel">
      </Realgrid>
    </div>
  </div>
</template>

<script setup>
import { getSalesbySeats } from "@/api/misales";
import Datepicker2 from "@/components/Datepicker2.vue";
import PageName from "@/components/pageName.vue";
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
const setGroupFooter = ref(false);
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
const selectedDay = ref(0);
const selectedStore = ref(0);

const hideColumnsId = ref(["strStoreName", "strDate"]);
const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);
const selectedstartDate = ref();
const selectedendDate = ref();
const selectedStartTime = ref({ value: 0, strName: "00:00" });
const selectedEndTime = ref({ value: 23, strName: "23:00" });
const setGroupColumnId = ref("");
const resetVselect = () => {
  selectedStartTime.value = { value: 0, strName: "00:00" };
};
const resetVselect2 = () => {
  selectedEndTime.value = { value: 23, strName: "23:00" };
};
const startDate = (e) => {
  //comsole.log(e);
  selectedstartDate.value = e;
};

const endDate = (e) => {
  //comsole.log(e);
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

    const res = await getSalesbySeats(
      selectedGroup.value,
      selectedStoreAttrs.value,
      selectedStores.value,
      selectedstartDate.value,
      selectedendDate.value,
      selectedDay.value,
      selectedStore.value
    );

    rowData.value = res.data.List;

    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    //comsole.log(error);
  } finally {
    store.state.loading = false;
  }
};

/* 매장 컴포넌트 관련 함수 */
const selectedGroup = ref();
const selectedStores = ref();
const selectedStoreAttrs = ref();
const lngStoreGroup = (e) => {
  //initGrid();
  //comsole.log(e);
  selectedGroup.value = e;
};
const lngStoreCode = (e) => {
  initGrid();
  selectedStores.value = e;
  //comsole.log(e);
};
const lngStoreAttrs = (e) => {
  //initGrid();
  selectedStoreAttrs.value = e;
  //comsole.log(e);
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
  let condition = "조건 :";
  if (selectedDay.value == 1) {
    condition += "일자별,";
  }
  if (selectedStore.value == 1) {
    condition += "매장별,";
  }
  if (setGroupFooter.value == true) {
    condition += "합계,";
  }
  condition = condition.substring(0, condition.length - 1);
  documentSubTitle.value =
    selectedExcelDate.value +
    "\n" +
    selectedExcelStore.value +
    "\n" +
    condition;
  //comsole.log(documentSubTitle.value); // 맑음 소스 pickStorePlural.vue 소스의 excelStore 받아야 함.
  // 엑셀 기능 실행
  exportExcel.value = !exportExcel.value;
};

// 엑셀 추출
const documentSubTitle = ref("");
const selectedExcelDate = ref("");
const excelDate = (e) => {
  selectedExcelDate.value = e;
  //comsole.log(e);
};
const selectedExcelStore = ref("");
const excelStore = (e) => {
  selectedExcelStore.value = e;
  //comsole.log(e);
};

const showSum = (e) => {
  if (e.target.checked) {
    setGroupFooter.value = true;
    reload.value = !reload.value;
  } else {
    setGroupFooter.value = false;
    reload.value = !reload.value;
  }
};
const showStore = (e) => {
  if (e.target.checked) {
    selectedStore.value = 1;
    hideColumnsId.value = hideColumnsId.value.filter(
      (item) => item != "strStoreName"
    );
    if (setGroupColumnId.value.includes("strDate")) {
      setGroupColumnId.value = "strStoreName,strDate";
    } else {
      setGroupColumnId.value = "strStoreName";
    }
  } else {
    selectedStore.value = 0;
    hideColumnsId.value.push("strStoreName");
    if (setGroupColumnId.value.includes("strDate")) {
      setGroupColumnId.value = "strDate";
    } else {
      setGroupColumnId.value = "";
    }
  }
};
const showDay = (e) => {
  if (e.target.checked) {
    selectedDay.value = 1;
    hideColumnsId.value = hideColumnsId.value.filter(
      (item) => item != "strDate"
    );
    if (setGroupColumnId.value.includes("strStoreName")) {
      setGroupColumnId.value = "strStoreName,strDate";
    } else {
      setGroupColumnId.value = "strDate";
    }
  } else {
    selectedDay.value = 0;
    hideColumnsId.value.push("strDate");
    if (setGroupColumnId.value.includes("strStoreName")) {
      setGroupColumnId.value = "strStoreName";
    } else {
      setGroupColumnId.value = "";
    }
  }
};
</script>
