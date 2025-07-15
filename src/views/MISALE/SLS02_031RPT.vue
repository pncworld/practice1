/*--############################################################################
# Filename : SLS02_031RPT.vue                                                  
# Description : 매출관리 > 당일 매출 조회 > 영수증별 매출 상세현황.             
# Date :2025-05-16                                                             
# Author : 권맑음                     
################################################################################*/
<template>
  <!-- 조회조건 -->
  <div class="h-[95%]" @click="handleParentClick">
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
      class="grid grid-rows-2 grid-cols-[5fr,5fr] justify-start bg-gray-200 rounded-lg h-24 items-start z-10">
      <div class="">
        <Datepicker2
          class="ml-8"
          :initToday="0"
          ref="datepicker"
          :closePopUp="closePopUp"
          @endDate="endDate"
          @startDate="startDate"
          @excelDate="excelDate"
          :mainName="'기간'"></Datepicker2>
      </div>
      <!-- <div><input type="checkbox" /></div> -->
      <div class="-ml-10">
        <PickStorePlural
          @lngStoreCodes="selectedStoreCd"
          @lngStoreGroup="selectedGroupCd"
          @lngStoreAttrs="lngStoreAttrs"
          @excelStore="excelStore"
          :placeholderName="'선택'"></PickStorePlural>
      </div>

      <div class="flex justify-start items-center ml-12 space-x-5">
        <PayCodeList2
          class="flex w-[25vw]"
          @payCd="selectedpayCd"
          :groupCd="groupCd"
          :storeCd="0"
          :init="init">
        </PayCodeList2>
        <MenuCdList
          class="flex w-[15vw]"
          @menuCd="selectedmenuCd"
          :groupCd="groupCd"
          :storeCd="0"
          :init="init">
        </MenuCdList>
      </div>
    </div>
    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="h-[65vh] mt-5">
      <Realgrid
        :progname="'SLS02_031RPT_VUE'"
        :progid="1"
        :rowData="rowData"
        :setRowGroupSpan2="'lngStoreCode,strStoreName,TR0_lngReceipt,strSeatName,dtmDate,TR0_dtmEndTime,TR2_dtmInTime,TR2_intCustCnt,TR21_intAgeCnt,TR2_intItmCnt,TR2_lngSalAmt,TR2_lngActAmt,lngSupplyAmt,lngVat,lngDisAmt'"
        :rowStateeditable="false"
        :documentTitle="'SLS02_031RPT'"
        :documentSubTitle="documentSubTitle"
        :exporttoExcel="exceloutput">
      </Realgrid>
    </div>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import { getReceiptDetailStatus } from "@/api/misales";

/**
 *  매출 일자 호출 컴포넌트
 *  */

import Datepicker2 from "@/components/Datepicker2.vue";

/**
 *  할인 코드 호출 컴포넌트
 *  */

import MenuCdList from "@/components/menuCdList.vue";
/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
import PayCodeList2 from "@/components/payCodeList2.vue";

/**
 *  결제 코드 호출 컴포넌트
 *  */

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
const datepicker = ref(null);
const closePopUp = ref(false);
const handleParentClick = (e) => {
  const datepickerEl = datepicker.value?.$el;
  if (datepickerEl && datepickerEl.contains(e.target)) {
    return;
  }
  closePopUp.value = !closePopUp.value;
};
const selectedstartDate = ref();
const selectedendDate = ref();

const endDate = (e) => {
  selectedendDate.value = e;
};
const startDate = (e) => {
  selectedstartDate.value = e;
};

const excelstore = ref("");
const excelStore = (e) => {
  excelstore.value = e;
};
const exceldate = ref("");
const excelDate = (e) => {
  exceldate.value = e;
};

const receiptNo = ref();
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
    const res = await getReceiptDetailStatus(
      groupCd.value,
      storeCd.value,
      payCd.value,
      menuCd.value,
      selectedstartDate.value,
      selectedendDate.value
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
const groupCd = ref();
const storeCd = ref();
const init = ref(false);

/**
 * 선택한 매장 코드 호출 함수
 */

const selectedStoreCd = (e) => {
  console.log(e);
  storeCd.value = e;

  initGrid();
  //init.value = !init.value;
};
/**
 * 선택한 매장 그룹 코드 호출 함수
 */

const selectedGroupCd = (e) => {
  //comsole.log(e);
  groupCd.value = e;
};
const rowData = ref([]);

const payCd = ref(0);
const menuCd = ref(0);

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
const selectedmenuCd = (e) => {
  if (e == null) {
    menuCd.value = 0;
  } else {
    menuCd.value = e;
  }
};

const exceloutput = ref(false);
/**
 * 엑셀 내보내기 함수
 */
const documentSubTitle = ref("");
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
  const a = "할인코드 :" + (payCd.value == 0 ? "전체" : payCd.value);
  const b = "메뉴코드 :" + (menuCd.value == 0 ? "전체" : menuCd.value);
  documentSubTitle.value =
    exceldate.value + "\n" + excelstore.value + "\n" + a + "\n" + b;
  exceloutput.value = !exceloutput.value;
};
/**
 * 그리드 초기화
 */

const initGrid = () => {
  if (rowData.value.length != 0) {
    rowData.value = [];
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
