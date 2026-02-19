<!-- /*--############################################################################
# Filename : SLS02_011RPT.vue                                                  
# Description : 매출관리 > 당일 매출 조회 > 영수증별 매출 조회.                #
Date :2025-05-14                                                              #
Author : 권맑음                     
################################################################################*/ -->
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
    class="grid grid-rows-2 grid-cols-[1fr,1.2fr,1fr] justify-between bg-gray-200 rounded-lg h-24 items-center z-10">
    <div class="ml-[67px]">
      <Datepicker1
        @dateValue="dateValue"
        @year="year"
        @month="month"
        @day="day"></Datepicker1>
    </div>
    <div class="ml-9">
      <PickStoreRenew3
        @lngStoreCode="selectedStoreCd"
        @lngStoreGroup="selectedGroupCd"
        @lngStoreAttrs="lngStoreAttrs"
        :placeholderName="'선택'"></PickStoreRenew3>
    </div>
    <div>
      <PosList
        :groupCd="groupCd"
        :storeCd="storeCd"
        @posNo="posNo"
        class="!ml-3"
        :init="init"></PosList>
    </div>
    <div class="space-x-5 flex items-center">
      <div class="text-base font-semibold ml-12 z-10">영수증 번호</div>
      <input
        type="text"
        class="border rounded-lg h-10 !w-36 z-30"
        v-model="receiptNo" />
    </div>
    <div class="flex justify-start items-center ml-5">
      <DisCountCdList
        class="flex w-[150%]"
        @disCountCd="DisCountCd"
        :groupCd="groupCd"
        :storeCd="storeCd"
        :init="init"></DisCountCdList>
    </div>
    <div class="flex justify-center items-center ml-9">
      <PayCodeList
        class="flex"
        @payCd="selectedpayCd"
        :groupCd="groupCd"
        :storeCd="storeCd"
        :init="init">
      </PayCodeList>
    </div>
  </div>
  <!-- 조회조건 -->
  <!-- 그리드 영역 -->
  <div class="grid grid-rows-1 grid-cols-[7fr,3fr] h-[65vh] mt-5">
    <div>
      <span class="flex justify-start"
        >*영수내역을 선택하시면 상세내역을 확인할 수 있습니다.</span
      >
      <Realgrid
        :progname="'SLS02_011RPT_VUE'"
        :progid="1"
        :rowData="rowData"
        :valuesData="valuesData"
        :labelsData="labelsData"
        :labelingColumns="'strVoidFlag'"
        :selectionStyle="'singleRow'"
        @clickedRowData="clickedRowData"
        :initSelect="true"
        :exporttoExcel="exceloutput"
        :setStateBar="false"
        :rowStateeditable="false"
        :ExcelNm="'영수증별 매출 조회.'"></Realgrid>
    </div>
    <div class="grid grid-rows-3 grid-cols-1">
      <div>
        <span class="flex justify-start">고객 정보</span>
        <Realgrid
          :progname="'SLS02_011RPT_VUE'"
          :progid="2"
          :rowData="rowData2"
          :rowStateeditable="false"
          :setStateBar="false"></Realgrid>
      </div>
      <div class="mt-5">
        <span class="flex justify-start">주문 정보</span>
        <Realgrid
          :progname="'SLS02_011RPT_VUE'"
          :progid="3"
          :rowData="rowData3"
          :rowStateeditable="false"
          :setStateBar="false"></Realgrid>
      </div>
      <div class="mt-5">
        <span class="flex justify-start">결제 정보</span>
        <Realgrid
          :progname="'SLS02_011RPT_VUE'"
          :progid="4"
          :rowData="rowData4"
          :rowStateeditable="false"
          :setStateBar="false"></Realgrid>
      </div>
    </div>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import {
  getCustInfo,
  getOrderInfo,
  getPayInfo,
  getReceiptDatas,
} from "@/api/misales";

/**
 *  매출 일자 호출 컴포넌트
 *  */

import Datepicker1 from "@/components/Datepicker1.vue";

/**
 *  할인 코드 호출 컴포넌트
 *  */

import DisCountCdList from "@/components/disCountCdList.vue";
/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";

/**
 *  결제 코드 호출 컴포넌트
 *  */

/**
 *  결제 코드 호출 컴포넌트
 *  */

import PayCodeList from "@/components/payCodeList.vue";

/**
 *  매장 선택 컴포넌트
 *  */

import PickStoreRenew3 from "@/components/pickStoreRenew.vue";

/**
 *  포스번호 호출 컴포넌트
 *  */

import PosList from "@/components/posList.vue";
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
const selectedDate = ref();

/**
 * 	매출 일자 가져오는 함수
 */

const dateValue = (e) => {
  selectedDate.value = e;
  //comsole.log(selectedDate.value);
  initGrid();
};
const year = (e) => {
  //comsole.log(e);
};
const month = (e) => {
  //comsole.log(e);
};
const day = (e) => {
  //comsole.log(e);
};

/**
 * 페이지 매장 그룹 세팅
 */

const lngStoreGroups = (e) => {
  //comsole.log(e);
};

/**
 * 페이지 매장 코드 세팅
 */

const lngStoreCodes = (e) => {
  //comsole.log(e);
};

const receiptNo = ref();
const initCheckBox = ref(false);
const initSearchWord = ref(false);
const store = useStore();
const loginedstrLang = store.state.userData.lngLanguage;
//comsole.log(store);

const afterSearch = ref(false);
/**
 *  조회 함수
 */

const searchButton = async () => {
  // initCheckBox.value = !initCheckBox.value
  // initSearchWord.value = !initSearchWord.value
  if (storeCd.value == 0) {
    Swal.fire({
      title: "경고",
      text: "매장을 선택하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  store.state.loading = true;
  try {
    initGrid();
    const res = await getReceiptDatas(
      groupCd.value,
      storeCd.value,
      selectedPosNo.value,
      selectedDate.value,
      receiptNo.value,
      disCountCd.value,
      payCd.value,
      loginedstrLang
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
const groupCd = ref();
const storeCd = ref();
const dtmDate = ref();
const init = ref(false);

/**
 * 선택한 매장 코드 호출 함수
 */

const selectedStoreCd = (e) => {
  //comsole.log(e);
  storeCd.value = e;

  initGrid();
  selectedPosNo.value = "0";
  receiptNo.value = "";
  init.value = !init.value;
};
/**
 * 선택한 매장 그룹 코드 호출 함수
 */

const selectedGroupCd = (e) => {
  //comsole.log(e);
  groupCd.value = e;
};
const rowData = ref([]);
const rowData2 = ref([]);
const rowData3 = ref([]);
const rowData4 = ref([]);

const selectedPosNo = ref();

/**
 * 선택한 포스 번호 호출 함수
 */

const posNo = (e) => {
  //comsole.log(e);
  if (e == null) {
    selectedPosNo.value = 0;
  } else {
    selectedPosNo.value = e;
  }
};

const disCountCd = ref("");

/**
 * 선택한 할인 코드 호출 함수
 */

const DisCountCd = (e) => {
  //comsole.log(e);
  if (e == null) {
    disCountCd.value = 0;
  } else {
    disCountCd.value = e;
  }
};

const payCd = ref("");

/**
 * 선택한 결제 코드 호출 함수
 */

const selectedpayCd = (e) => {
  if (e == null) {
    payCd.value = 0;
  } else {
    payCd.value = e;
  }
};

const valuesData = ref([
  ["Sales Cancellation", "Menu Correction", "Order Cancellation"],
]);
const labelsData = ref([["매출취소", "메뉴정정", "주문취소"]]);

/**
 * 데이터셋 상세정보 셋팅
 */

const clickedRowData = async (e) => {
  //comsole.log(e);
  const seqId = e[18];

  const res = await getCustInfo(groupCd.value, storeCd.value, seqId);
  rowData2.value = res.data.CUSTOMER;

  const res2 = await getOrderInfo(groupCd.value, storeCd.value, seqId);
  rowData3.value = res2.data.ORDER;

  const res3 = await getPayInfo(
    groupCd.value,
    storeCd.value,
    seqId,
    loginedstrLang
  );

  rowData4.value = res3.data.PAYLIST;

  //comsole.log(res3);
};

const exceloutput = ref(false);
/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 진행해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  exceloutput.value = !exceloutput.value;
};
/**
 * 그리드 초기화
 */

const initGrid = () => {
  if (rowData.value.length != 0) {
    rowData.value = [];
  }
  if (rowData2.value.length != 0) {
    rowData2.value = [];
  }
  if (rowData3.value.length != 0) {
    rowData3.value = [];
  }
  if (rowData4.value.length != 0) {
    rowData4.value = [];
  }
};

const selectedStoreAttr = ref();

/**
 * 페이지 매장 분류 세팅
 */

const lngStoreAttrs = (e) => {
  selectedStoreAttr.value = e;
  initGrid();
  init.value = !init.value;
};
</script>
