/*--############################################################################
# Filename : SLS11_012RPT.vue                                                  
# Description : 매출관리 > 분류별 매출 현황 > 주문자별 매출현황.                
# Date :2025-05-14                                                             
# Author : 권맑음                     
################################################################################*/
<template>
  <!-- 조회 조건 -->
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
      <div class="grid grid-cols-1 grid-rows-3">
        <div class="flex">
          <Datepicker2
            @endDate="endDate"
            @startDate="startDate"
            :closePopUp="closePopUp"
            ref="datepicker"
            class=""
            @excelDate="excelDate"
            :mainName="'일자'"></Datepicker2>
        </div>
        <div
          class="text-nowrap flex justify-start items-center space-x-5 ml-12 mt-2">
          <div class="text-base font-semibold">조건</div>
          <div class="flex space-x-10">
            <label for="day"
              ><input type="checkbox" id="day" @click="byDay" />일자별</label
            >
            <label for="store"
              ><input
                type="checkbox"
                id="store"
                @click="byStore" />매장명</label
            >
            <label for="unite"
              ><input
                type="checkbox"
                id="unite"
                @click="showUnite" />셀병합</label
            >
            <label for="sum"
              ><input type="checkbox" id="sum" @click="showSum" />합계</label
            >
          </div>
        </div>
      </div>
      <div class="">
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
    <!-- 조회 조건 -->
    <!-- 그리드 영역 -->
    <div class="w-full h-[80%]">
      <Realgrid
        :progname="'SLS11_012RPT_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :setFooter="true"
        :setMergeMode="false"
        :setGroupSumCustomColumnId2="setGroupSumCustomColumnId2"
        :setGroupFooter="setGroupFooter"
        :setGroupColumnId="setGroupColumnId"
        :selectionStyle="'group'"
        :hideColumnsId="hideColumnsId"
        :setRowGroupSpan="setRowGroupSpan"
        :documentTitle="'SLS11_012RPT'"
        :rowStateeditable="false"
        :documentSubTitle="documentSubTitle"
        :exporttoExcel="exportExcel">
      </Realgrid>
    </div>
    <!-- 그리드 영역 -->
  </div>
</template>

<script setup>
import { getSalesbyOrders } from "@/api/misales";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

import Datepicker2 from "@/components/Datepicker2.vue";
/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
/**
 *  매장  단일 선택 컴포넌트
 *  */

import PickStoreSingle2 from "@/components/pickStoreSingle.vue";
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

import { onMounted, ref } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";

const progid = ref(1);
const setRowGroupSpan = ref("");
const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);
const selectedstartDate = ref();
const selectedendDate = ref();
const hideColumnNow = ref(true);
const setGroupSumCustomColumnId2 = ref(["strStore"]);
const setGroupColumnId = ref("");
const hideColumnsId = ref(["strStore", "dtmDate"]);
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
const startTime = ref(0);
const endTime = ref(23);
const setGroupFooter = ref(false);
const selectedCause = ref(null);
const store = useStore();
const causeList = ref([]);
const mergeMask = ref();
const selectedCust = ref(null);
const customerList = ref([]);
/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
});

const loginedstrLang = store.state.userData.lngLanguage;
/**
 *  조회 함수
 */

const searchButton = async () => {
  store.state.loading = true;
  try {
    initGrid();

    reload.value = !reload.value;

    const res = await getSalesbyOrders(
      selectedGroup.value,
      selectedStoreAttrs.value,
      selectedStoreTeam.value,
      selectedStoreSuperVisor.value,
      selectedStores.value,
      selectedstartDate.value,
      selectedendDate.value,
      reportType.value
    );
    //comsole.log(res);
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

const lngStoreCodes = async (e) => {
  selectedStores.value = e;
  //comsole.log(e);

  // const res = await getCustomerList(selectedGroup.value,selectedStores.value)
  // customerList.value = res.data.List
};

/**
 * 페이지 매장 분류 세팅
 */

const lngStoreAttrs = (e) => {
  selectedStoreAttrs.value = e;
  //comsole.log(e);
};
/**
 * 페이지 매장 슈퍼바이저 세팅
 */

const lngSupervisor = (e) => {
  selectedStoreSuperVisor.value = e;
  //comsole.log(e);
};
/**
 * 페이지 매장 팀 세팅
 */

const lngStoreTeam = (e) => {
  selectedStoreTeam.value = e;
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

//comsole.log(store.state.minorCategory);

/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  let condition2 = "조건 : ";
  if (!hideColumnsId.value.includes("dtmDate")) {
    condition2 += "일자별,";
  }
  if (!hideColumnsId.value.includes("strStore")) {
    condition2 += "매장명,";
  }
  if (setRowGroupSpan.value == "strStore") {
    condition2 += "셀병합,";
  }
  if (setGroupFooter.value == true) {
    condition2 += "합계,";
  }

  condition2 = condition2.substring(0, condition2.length - 1);

  documentSubTitle.value =
    selectedExcelDate.value +
    "\n" +
    selectedExcelStore.value +
    "\n" +
    condition2;

  exportExcel.value = !exportExcel.value;
};

const resetVselect2 = () => {
  endTime.value = 23;
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
const documentSubTitle = ref("");
const selectedExcelDate = ref("");
/**
 * 엑셀용 일자 세팅 함수
 */

const excelDate = (e) => {
  selectedExcelDate.value = e;
};
const selectedExcelStore = ref("");
/**
 * 엑셀용 매장 세팅 함수
 */

const excelStore = (e) => {
  selectedExcelStore.value = e;
};

const reportType = ref("0");
const byDay = (e) => {
  if (e.target.checked) {
    if (reportType.value.includes("2")) {
      reportType.value = "12";
    } else {
      reportType.value = "1";
    }

    if (setGroupColumnId.value.includes("strStore")) {
      setGroupColumnId.value = "strStore,dtmDate";
    } else {
      setGroupColumnId.value = "dtmDate";
    }
    hideColumnsId.value = hideColumnsId.value.filter(
      (item) => item != "dtmDate"
    );
    if (!setGroupSumCustomColumnId2.value.includes("strStore")) {
      setGroupSumCustomColumnId2.value = ["dtmDate"];
    }
  } else {
    if (reportType.value.includes("2")) {
      reportType.value = "2";
    } else {
      reportType.value = "0";
    }

    if (setGroupColumnId.value.includes("strStore")) {
      setGroupColumnId.value = "strStore";
    } else {
      setGroupColumnId.value = "";
    }
    hideColumnsId.value.push("dtmDate");
    setGroupSumCustomColumnId2.value = ["strStore"];
  }
};

const byStore = (e) => {
  if (e.target.checked) {
    if (reportType.value.includes("1")) {
      reportType.value = "12";
    } else {
      reportType.value = "2";
    }
    if (setGroupColumnId.value.includes("dtmDate")) {
      setGroupColumnId.value = "strStore,dtmDate";
    } else {
      setGroupColumnId.value = "strStore";
    }
    hideColumnsId.value = hideColumnsId.value.filter(
      (item) => item != "strStore"
    );
    setGroupSumCustomColumnId2.value = ["strStore"];
  } else {
    if (reportType.value.includes("1")) {
      reportType.value = "1";
    } else {
      reportType.value = "0";
    }
    if (setGroupColumnId.value.includes("dtmDate")) {
      setGroupColumnId.value = "dtmDate";
    } else {
      setGroupColumnId.value = "";
    }
    hideColumnsId.value.push("strStore");
    setGroupSumCustomColumnId2.value = ["dtmDate"];
  }
};
const showUnite = (e) => {
  if (e.target.checked) {
    setRowGroupSpan.value = "strStore";
  } else {
    setRowGroupSpan.value = "";
  }
  reload.value = !reload.value;
};
const tempSum = ref(false);
const showSum = (e) => {
  if (e.target.checked) {
    //comsole.log(reportType.value);
    setGroupFooter.value = true;
    reload.value = !reload.value;
  } else {
    setGroupFooter.value = false;
    reload.value = !reload.value;
  }
};

/**
 *  컴포넌트 변동시 감지 함수
 */

const changeInit = (e) => {
  initGrid();
};
</script>

<style></style>
