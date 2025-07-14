/*--############################################################################
# Filename : SLS06_001RPT.vue                                                  
# Description : 매출관리 > 기간별 마스터 > 요일별 매출 현황.                   
# Date :2025-05-14                                                             
# Author : 권맑음                     
################################################################################*/
<template>
  <!-- 조회조건 -->
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
      class="grid grid-cols-2 grid-rows-1 justify-between bg-gray-200 rounded-lg h-24 items-start z-10">
      <div class="grid grid-cols-1 grid-rows-2">
        <div class="flex">
          <label for="daily" class="font-thin inline-flex ml-4">
            <input
              type="checkbox"
              id="daily"
              @change="seeDaily"
              class="ml-5 mt-2 z-50" />
          </label>
          <Datepicker2
            @startDate="startDate"
            @endDate="endDate"
            :closePopUp="closePopUp"
            ref="datepicker"
            :initToday="1"
            :selectedGroup="selectedGroup"
            @excelDate="excelDate"
            class=""></Datepicker2>
        </div>
        <div
          class="flex justify-start items-center text-base text-nowrap font-semibold ml-28">
          요일명
          <div class="flex ml-5 space-x-3 -mt-1">
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
    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
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
        :rowStateeditable="false"
        :exporttoExcel="exportExcel">
      </Realgrid>
      <!-- <Realgrid :progname="'SLS05_004RPT_VUE'" :progid="1" :rowData="rowData" :reload="reload" 
         :setFooter="true" :setFooterExpressions="setFooterExpressions" :setFooterColID="setFooterColID"
         :exporttoExcel="exportExcel" :documentTitle="'SLS05_004RPT'" :documentSubTitle="documentSubTitle" 
      </Realgrid> -->
    </div>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import { getWeedaySalesReport, getWeekDayList } from "@/api/misales";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

import Datepicker2 from "@/components/Datepicker2.vue";
/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
/**
 *  단일 매장  컴포넌트
 *  */

import pickStoreSingle from "@/components/pickStoreSingle.vue";
/**
 * 	그리드 생성
 */

import Realgrid from "@/components/realgrid.vue";
/**
 *  페이지로그 자동 입력
 *  */

import { insertPageLog } from "@/customFunc/customFunc";
/*
 * 공통 표준  Function
 */

import { onMounted, ref, watch } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

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

/**
 * 선택한 매출 시작일자
 */

const startDate = (e) => {
  //comsole.log(e);
  selectedstartDate.value = e;
};

/**
 * 선택한 매출 종료일자
 */

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

const updateProgid = () => {
  if (tempSeeDaily.value && tempSeeStore.value) {
    reportCheckData.value = "12";
    setGroupSumCustomColumnId.value = ["dtmDate"];
    setGroupColumnId.value = "strStore,strWeek";
    //comsole.log(setGroupColumnId.value);
    progId.value = "4";
  } else if (tempSeeDaily.value) {
    reportCheckData.value = "1";
    setGroupSumCustomColumnId.value = ["dtmDate"];
    setGroupColumnId.value = "strWeek";
    //comsole.log(setGroupColumnId.value);
    progId.value = "2";
  } else if (tempSeeStore.value) {
    reportCheckData.value = "2";
    setGroupSumCustomColumnId.value = ["strWeek"];
    setGroupColumnId.value = "strStore";
    //comsole.log(setGroupColumnId.value);
    progId.value = "3";
  } else {
    reportCheckData.value = "0";
    setGroupSumCustomColumnId.value = ["dtmDate"];
    setGroupColumnId.value = "";
    //comsole.log(setGroupColumnId.value);
    progId.value = "1";
  }
};

const store = useStore();
const loginedstrLang = store.state.userData.lngLanguage;

const datepicker = ref(null);
const closePopUp = ref(false);
/**
 * 매출 일자 안 라디오박스 닫기 위한 외부 클릭 감지 함수
 */

const handleParentClick = (e) => {
  const datepickerEl = datepicker.value?.$el;
  if (datepickerEl && datepickerEl.contains(e.target)) {
    return;
  }
  closePopUp.value = !closePopUp.value;
};

/**
 *  조회 함수
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

    //comsole.log(selectedStorearr);

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

    //comsole.log(selectedWeekDayValue);

    //comsole.log(reportCheckData.value);

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
    //comsole.log(res);
    rowData.value = res.data.weekdaySales;

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
const selectedStoreTeam = ref();
const selectedStoreSuperVisor = ref();
/**
 * 페이지 매장 그룹 세팅
 */

const lngStoreGroup = (e) => {
  initGrid();
  //comsole.log(e);
  selectedGroup.value = e;
};
/**
 * 페이지 매장 코드 세팅
 */

const lngStoreCodes = (e) => {
  initGrid();
  selectWeekDay.value = null;
  selectedStores.value = e;
  //comsole.log(e);
};

/**
 * 페이지 매장 분류 세팅
 */

const lngStoreAttrs = (e) => {
  initGrid();
  selectedStoreAttrs.value = e;
  //comsole.log(e);
};
/**
 * 페이지 매장 슈퍼바이저 세팅
 */

const lngSupervisor = (e) => {
  initGrid();
  selectedStoreSuperVisor.value = e;
  //comsole.log(e);
};
/**
 * 페이지 매장 팀 세팅
 */

const lngStoreTeam = (e) => {
  initGrid();
  selectedStoreTeam.value = e;
  //comsole.log(e);
};

/* 매입사 콤보박스 */
const selectWeekDay = ref(null);
const weekDay = ref([]);
const selectedWeekDay = ref("");

/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getWeekDayList(87, "01");
  weekDay.value = res.data.weekDayList;
  //comsole.log(weekDay.value);
});

// watch([selectedGroup, selectedStores], async () => {
//     //comsole.log(selectedGroup.value, selectedStores.value)
//     const res = await getWeekDayList(87, '01')
//     weekDay.value = res.data.getWeekDayList
//     //comsole.log(weekDay.value)
// })

watch(selectWeekDay, (newValue) => {
  selectedWeekDay.value = newValue ? newValue.strDcode : "";
  //comsole.log(selectedWeekDay.value);
});

/**
 * 그리드 초기화
 */

const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
};

//엑셀 버튼 처리 함수
const exportExcel = ref(false);
/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  documentSubTitle.value =
    selectedExcelDate.value + "\n" + selectedExcelStore.value;
  //comsole.log(documentSubTitle.value); // 맑음 소스 pickStorePlural.vue 소스의 excelStore 받아야 함.
  // 엑셀 기능 실행
  exportExcel.value = !exportExcel.value;
};

// 엑셀 추출
const documentSubTitle = ref("");
const selectedExcelDate = ref("");
/**
 * 엑셀용 일자 세팅 함수
 */

const excelDate = (e) => {
  selectedExcelDate.value = e;
  //comsole.log(e);
};
const selectedExcelStore = ref("");
/**
 * 엑셀용 매장 세팅 함수
 */

const excelStore = (e) => {
  selectedExcelStore.value = e;
  //comsole.log(e);
};
</script>
