/*--############################################################################
# Filename : SLS06_003RPT.vue                                                  
# Description : 매출관리 > 기간별 매출 현황 > 월별 매출 현황.                  
# Date :2025-05-14                                                             
# Author : 권맑음                     
################################################################################*/
<template>
  <!-- 조회조건 -->
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
    class="grid grid-cols-[15fr,1fr,15fr] grid-rows-1 justify-between bg-gray-200 rounded-lg h-24 items-start z-10">
    <div class="grid grid-cols-1 grid-rows-2">
      <Datepicker3
        class=""
        @endMonth="endMonth"
        @endYear="endYear"
        @startMonth="startMonth"
        @startYear="startYear"
        @excelDate="excelDate"></Datepicker3>
      <div
        class="flex items-center text-base text-nowrap font-semibold pl-12 mt-3">
        조회조건
        <div>
          <label for="sum" class="font-normal"
            ><input
              type="checkbox"
              id="sum"
              class="ml-5"
              @change="seeSum" />합계</label
          >
        </div>
      </div>
    </div>
    <div class="mt-8 ml-12">
      <input type="checkbox" name="" id="" @change="showStore" />
    </div>
    <div class="ml-5">
      <PickStorePlural
        @lngStoreCodes="lngStoreCodes"
        @lngStoreGroup="lngStoreGroup"
        @lngStoreAttrs="lngStoreAttrs"
        @excelStore="excelStore">
      </PickStorePlural>
    </div>
    <div></div>
  </div>
  <!-- 조회조건 -->
  <!-- 그리드 영역 -->
  <div class="w-full h-[85%]">
    <Realgrid
      :progname="'SLS06_003RPT_VUE'"
      :progid="1"
      :rowData="rowData"
      :reload="reload"
      :setFooter="true"
      :setGroupFooter="setGroupFooter"
      :setGroupColumnId="'strStoreGroupName'"
      :hideColumnsId="hideColumnsId"
      :suffixColumnPercent="[
        'lngActAmt_pastMonth_rate',
        'lngActAmt_pastYear_rate',
      ]"
      :documentTitle="'SLS06_003RPT'"
      :documentSubTitle="documentSubTitle"
      :exporttoExcel="exportExcel"
      :mergeColumns2="true"
      :mergeColumnGroupSubList2="[
        [
          'lngActAmt_pastMonth',
          'lngActAmt_pastYear',
          'lngActAmt_pastMonth_rate',
          'lngActAmt_pastYear_rate',
          'lngSupplyAmt',
        ],
      ]"
      :rowStateeditable="false"
      :mergeColumnGroupName2="['순매출액']"></Realgrid>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import { getSalesDatabyMonth } from "@/api/misales";
/**
 *  해당연월 컴포넌트
 *  */

import Datepicker3 from "@/components/Datepicker3.vue";
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
/**
 *  페이지로그 자동 입력
 *  */

import { insertPageLog } from "@/customFunc/customFunc";
/**
 *  경고창 호출 라이브러리
 *  */

import Swal from "sweetalert2";
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

const setGroupSummaryCenterIds = ref("dtmDate,strWeekName");
const progid = ref(1);
const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);
const selectedstartYear = ref();
const selectedendYear = ref();
const selectedstartMonth = ref();
const selectedendMonth = ref();
const hideColumnNow = ref(true);
const hideColumn = ref("strStore");
const hideColumnsId = ref(["strStore"]);

/**
 * 	종료 월
 */

const endMonth = (e) => {
  //comsole.log(e);
  selectedendMonth.value = e;
};

/**
 * 	시작 년
 */

const startYear = (e) => {
  //comsole.log(e);
  selectedstartYear.value = e;
};

/**
 * 	시작 월
 */

const startMonth = (e) => {
  //comsole.log(e);
  selectedstartMonth.value = e;
};

/**
 * 	종료 년
 */

const endYear = (e) => {
  //comsole.log(e);
  selectedendYear.value = e;
};

const seeUnite = (e) => {
  if (e.target.checked) {
    setGroupFooter.value = true;
  } else {
    setGroupFooter.value = false;
  }
  reload.value = !reload.value;
};

const tempSeeDetail = ref(1);
const seeDetail = (e) => {
  if (e.target.checked) {
    tempSeeDetail.value = 2;
  } else {
    tempSeeDetail.value = 1;
  }
};
const store = useStore();
const loginedstrLang = store.state.userData.lngLanguage;
//comsole.log(store.state.userData);

/**
 *  조회 함수
 */

const searchButton = async () => {
  if (
    selectedstartYear.value == null ||
    selectedstartMonth.value == null ||
    selectedendYear.value == null ||
    selectedendMonth.value == null
  ) {
    Swal.fire({
      title: "날짜를 선택하세요.",
      icon: "info",

      confirmButtonColor: "#3085d6",

      confirmButtonText: "확인",
    });
    return;
  }

  try {
    store.state.loading = true;
    initGrid();
    if (tempChecked.value == true) {
      hideColumnsId.value = [];
    } else {
      hideColumnsId.value = ["strStore"];
    }
    reload.value = !reload.value;
    /**
     * 선택한 매출 시작일자
     */

    const startDate = `${selectedstartYear.value}-${String(
      selectedstartMonth.value
    ).padStart(2, "0")}-01`;
    /**
     * 선택한 매출 종료일자
     */

    const endDate = `${selectedendYear.value}-${String(
      selectedendMonth.value
    ).padStart(2, "0")}-01`;
    //comsole.log(selectedGroup.value);
    //comsole.log(selectedStores.value);
    //comsole.log(startDate);
    //comsole.log(endDate);
    //comsole.log(tempChecked.value ? 1 : 0);
    const res = await getSalesDatabyMonth(
      selectedGroup.value,
      selectedStores.value,
      startDate,
      endDate,
      tempChecked.value ? 1 : 0
    );
    ////console.log(res);
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
  selectedStoreAttrs.value = e;
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
const selectedExcelStore = ref("");
const selectedExcelDate = ref("");
const documentSubTitle = ref("");
/**
 * 엑셀용 매장 세팅 함수
 */

const excelStore = (e) => {
  selectedExcelStore.value = e;
};
/**
 * 엑셀용 일자 세팅 함수
 */

const excelDate = (e) => {
  selectedExcelDate.value = e;
};
/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  documentSubTitle.value =
    selectedExcelDate.value + "\n" + selectedExcelStore.value;
  exportExcel.value = !exportExcel.value;
};

const tempChecked = ref(false);
const showStore = (e) => {
  if (e.target.checked) {
    tempChecked.value = true;
  } else {
    tempChecked.value = false;
  }
};

const seeSum = (e) => {
  if (e.target.checked) {
    setGroupFooter.value = true;
  } else {
    setGroupFooter.value = false;
  }
  reload.value = !reload.value;
};
</script>

<style></style>
