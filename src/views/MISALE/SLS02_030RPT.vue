/*--############################################################################
# Filename : SLS02_030RPT.vue                                                  
# Description : 매출관리 > 기간별 매출 현황 > 매장별 실시간 매출 조회         #
Date :2025-05-14                                                              #
Author : 권맑음                     
################################################################################*/
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
      class="grid grid-cols-2 grid-rows-1 justify-between bg-gray-200 rounded-lg h-28 items-start z-10">
      <div class="grid grid-cols-1 grid-rows-3">
        <Datepicker2
          @endDate="endDate"
          @startDate="startDate"
          :closePopUp="closePopUp"
          ref="datepicker"
          @excelDate="excelDate"
          :initToday="1"></Datepicker2>
        <div
          class="flex justify-start items-start text-base text-nowrap font-semibold ml-20 space-x-5">
          구분
          <div class="flex ml-5 space-x-5">
            <select name="" id="" class="border w-40 h-7 rounded-lg">
              <option value="">직가맹</option>
            </select>
            <select name="" id="" class="border w-40 h-7 rounded-lg">
              <option value="">전체</option>
            </select>
          </div>
        </div>
        <div
          class="flex justify-start items-start text-base text-nowrap font-semibold ml-12 -mt-5">
          조회조건
          <div>
            <label for="detail" class="font-normal"
              ><input
                type="checkbox"
                id="detail"
                class="ml-5"
                @change="seeDays" />일자별</label
            >
          </div>
        </div>
      </div>
      <div class="">
        <PickStorePlural
          @lngStoreCodes="lngStoreCodes"
          @lngStoreGroup="lngStoreGroup"
          @lngSupervisor="lngSupervisor"
          @lngStoreTeam="lngStoreTeam"
          @lngStoreAttrs="lngStoreAttrs"
          @excelStore="excelStore">
        </PickStorePlural>
        <div class="text-red-500 h-5 mt-2 flex justify-end mr-3">
          <div v-show="afterSearch">
            {{ currentTime }}에 조회되었으며 미결제금액은 조회 시간 기준입니다.
          </div>
        </div>
      </div>
      <div></div>
    </div>

    <div class="w-full h-[85%]">
      <Realgrid
        :progname="'SLS02_030RPT_VUE'"
        :progid="progid"
        :rowData="rowData"
        :reload="reload"
        :exporttoExcel="exportExcel"
        :documentSubTitle="documentSubTitle"
        :documentTitle="'SLS02_030RPT'"
        :rowStateeditable="false"
        :setRowGroupSpan="'strName'"></Realgrid>
    </div>
  </div>
</template>

<script setup>
import { getRealTimeReport } from "@/api/misales";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

import Datepicker2 from "@/components/Datepicker2.vue";
/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
/**
 * 	다중 매장 선택 컴포넌트
 */

import PickStorePlural from "@/components/pickStorePlural.vue";
/**
 * 	그리드 생성
 */

import Realgrid from "@/components/realgrid.vue";
/*
 * 공통 커스텀 Function ( 페이지 로그 , 시간 포맷)
 */

import { formatTime, insertPageLog } from "@/customFunc/customFunc";
/*
 * 공통 표준  Function
 */

import { onMounted, ref } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";

/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
});

const setGroupFooter = ref(false);
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
const setGroupSummaryCenterIds = ref("dtmDate,strWeekName");
const progid = ref(2);
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
  selectedendDate.value = e;
};

const tempSeeDay = ref(0);
const seeDays = (e) => {
  if (e.target.checked) {
    tempSeeDay.value = 1;
  } else {
    tempSeeDay.value = 0;
  }
};
const store = useStore();
const loginedstrLang = store.state.userData.lngLanguage;
/**
 *  조회 함수
 */

const searchButton = async () => {
  store.state.loading = true;
  try {
    initGrid();
    if (tempSeeDay.value == 1) {
      progid.value = 1;
    } else {
      progid.value = 2;
    }
    reload.value = !reload.value;
    let selectedStorearr;
    // if (selectedStores.value == undefined || selectedStores.value.length == 0) {
    //     selectedStorearr = 0
    // } else {
    selectedStorearr = selectedStores.value;
    // }

    const res = await getRealTimeReport(
      selectedGroup.value,
      selectedStorearr,
      selectedstartDate.value,
      selectedendDate.value,
      tempSeeDay.value
    );
    //comsole.log(res);
    rowData.value = res.data.RECEIPT;

    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
  } finally {
    store.state.loading = false;
  }
};
const currentTime = ref(formatTime(new Date()));
const selectedGroup = ref();
const selectedStores = ref();
const selectedStoreAttrs = ref(0);
const selectedLngSuperVisor = ref(0);
const selectedLngStoreTeam = ref(0);
/**
 * 페이지 매장 그룹 세팅
 */

const lngStoreGroup = (e) => {
  //comsole.log(e);
  selectedGroup.value = e;
};
/**
 * 페이지 매장 코드 세팅
 */

const lngStoreCodes = (e) => {
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
  selectedLngSuperVisor.value = e;
  //comsole.log(e);
};

/**
 * 페이지 매장 팀 세팅
 */

const lngStoreTeam = (e) => {
  initGrid();
  selectedLngStoreTeam.value = e;
  //comsole.log(e);
};

/**
 * 그리드 초기화
 */

const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
};

const exportExcel = ref(false);
const documentSubTitle = ref("");
/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  documentSubTitle.value =
    selectedExcelDate.value + "\n" + selectedExcelStore.value;
  exportExcel.value = !exportExcel.value;
};

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
const selectedExcelDate = ref("");
const selectedExcelStore = ref("");
/**
 * 엑셀용 일자 세팅 함수
 */

const excelDate = (e) => {
  selectedExcelDate.value = e;
};
/**
 * 엑셀용 매장 세팅 함수
 */

const excelStore = (e) => {
  selectedExcelStore.value = e;
};
</script>

<style></style>
