/*--############################################################################
# Filename : SLS02_014RPT.vue                                                  
# Description : 매출관리 > 매장별 매출 현황 > 지역/업종별 매출 현황.           
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
        <Datepicker2
          @endDate="endDate"
          @startDate="startDate"
          :closePopUp="closePopUp"
          class=""
          ref="datepicker"
          @excelDate="excelDate"></Datepicker2>
        <div
          class="flex justify-start items-center text-base text-nowrap font-semibold ml-12">
          조회조건
          <div>
            <label for="daily" class="font-normal"
              ><input
                type="checkbox"
                id="daily"
                class="ml-5"
                @change="seeDaily" />일자별</label
            >
          </div>
          <div>
            <label for="store" class="font-normal"
              ><input
                type="checkbox"
                id="store"
                class="ml-5"
                @change="seeStore" />매장별</label
            >
          </div>
          <!-- <div>
            <label for="unite" class="font-thin"><input type="checkbox" id="unite" class="ml-5 "
                @change="seeUnite">셀병합</label>
          </div> -->
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
      <div class="">
        <PickStorePlural
          @lngStoreCodes="lngStoreCodes"
          @lngStoreGroup="lngStoreGroup"
          @lngStoreAttrs="lngStoreAttrs"
          @excelStore="excelStore"></PickStorePlural>
      </div>
    </div>
    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="w-full h-[85%]">
      <Realgrid
        :progname="'SLS02_014RPT_VUE'"
        :progid="progid"
        :rowData="rowData"
        :reload="reload"
        :setFooter="true"
        :setGroupFooter="setGroupFooter"
        :setFooterExpressions="setFooterExpressions"
        :setFooterColID="setFooterColID"
        :setGroupColumnId="'strStore'"
        :setGroupSumCustomText="['소계']"
        :setGroupSumCustomColumnId="setGroupSumCustomColumnId"
        :setGroupSumCustomLevel="3"
        :setGroupSummaryCenterIds="setGroupSummaryCenterIds"
        :setGroupFooterExpressions="setGroupFooterExpressions"
        :setGroupFooterColID="setGroupFooterColID"
        :documentTitle="'SLS02_014RPT'"
        :rowStateeditable="false"
        :documentSubTitle="documentSubTitle"
        :exporttoExcel="exportExcel">
      </Realgrid>
    </div>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import { getAreaIndustrySalesReport } from "@/api/misales";
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

/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
});

const setGroupFooter = ref(false);
const setFooterColID = ref([
  "strStore",
  "lngRecCnt",
  "lngRecAmt",
  "lngCustCnt",
  "lngCustAmt",
  "lngSalAmt",
  "lngDiscountAmt",
  "lngTotAmt",
  "lngVAT",
  "lngSupplyAmt",
  "dblDistRate",
  "lngWorkDay",
  "lngActAvg",
  "lngStoreCode",
]);
const setGroupFooterColID = ref([
  "strStore",
  "lngRecCnt",
  "lngRecAmt",
  "lngCustCnt",
  "lngCustAmt",
  "lngSalAmt",
  "lngDiscountAmt",
  "lngTotAmt",
  "lngVAT",
  "lngSupplyAmt",
  "dblDistRate",
  "lngWorkDay",
  "lngActAvg",
  "lngStoreCode",
]);
const setFooterExpressions = ref([
  "custom",
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
  "avg",
  "custom",
]);
const setGroupFooterExpressions = ref([
  "custom",
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
  "avg",
  "custom",
]);
const setGroupSummaryCenterIds = ref("dtmDate,dayName");
const setGroupSumCustomColumnId = ref(["lngStoreCode"]);
const progid = ref(1);
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
/* 합계 체크박스 */
const seeSum = (e) => {
  //comsole.log(e.target.checked);
  if (e.target.checked) {
    setGroupFooter.value = true;
  } else {
    setGroupFooter.value = false;
  }
  reload.value = !reload.value;
};
const tempSeeDaily = ref(false);
const tempSeeStore = ref(false);
const tempCheckData = ref(3);

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
    // 일자별 매장별
    tempCheckData.value = 12;
    setGroupSumCustomColumnId.value = ["dayName"];
  } else if (tempSeeDaily.value) {
    // 일자별
    tempCheckData.value = 1;
    setGroupSumCustomColumnId.value = ["dayName"];
  } else if (tempSeeStore.value) {
    // 매장별
    tempCheckData.value = 2;
    setGroupSumCustomColumnId.value = ["strStoreAttr"];
  } else {
    tempCheckData.value = 3;
    setGroupSumCustomColumnId.value = ["lngStoreCode"];
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
    //   //comsole.log(tempCheckData.value)
    progid.value = tempCheckData.value;
    //그리드 갱신
    reload.value = !reload.value;

    //매장 선택
    let selectedStorearr;
    // //comsole.log(selectedStores.value)
    // if (selectedStores.value == undefined || selectedStores.value.length == 0) {
    //   //comsole.log('여기오냐?')
    //   selectedStorearr = ref(store.state.storeCd).value.map(item => item.lngStoreCode).join(',');
    // } else {
    selectedStorearr = selectedStores.value;
    //}

    //comsole.log(selectedStorearr);

    // 체크박스별 조회
    if (progid.value == 1) {
      // 일자별 조회
      const res = await getAreaIndustrySalesReport(
        selectedGroup.value,
        selectedStorearr,
        selectedstartDate.value,
        selectedendDate.value,
        1,
        loginedstrLang
      );
      //comsole.log(res);
      rowData.value = res.data.areaIndustrySales;
    } else if (progid.value == 2) {
      // 매장별 조회
      const res = await getAreaIndustrySalesReport(
        selectedGroup.value,
        selectedStorearr,
        selectedstartDate.value,
        selectedendDate.value,
        2,
        loginedstrLang
      );
      //comsole.log(res);
      rowData.value = res.data.areaIndustrySales;
    } else if (progid.value == 12) {
      // 일자별 매장별 조회
      const res = await getAreaIndustrySalesReport(
        selectedGroup.value,
        selectedStorearr,
        selectedstartDate.value,
        selectedendDate.value,
        12,
        loginedstrLang
      );
      //comsole.log(res);
      rowData.value = res.data.areaIndustrySales;
    } else {
      // 조회
      const res = await getAreaIndustrySalesReport(
        selectedGroup.value,
        selectedStorearr,
        selectedstartDate.value,
        selectedendDate.value,
        0,
        loginedstrLang
      );
      //comsole.log(res);
      rowData.value = res.data.areaIndustrySales;
    }

    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    //comsole.log(error);
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
  initGrid();
  //comsole.log(e);
  selectedGroup.value = e;
};
/**
 * 페이지 매장 코드 세팅
 */

const lngStoreCodes = (e) => {
  initGrid();
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
  //comsole.log(documentSubTitle.value);
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

<style></style>
