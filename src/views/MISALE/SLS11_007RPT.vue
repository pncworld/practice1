/*--############################################################################
# Filename : SLS11_007RPT.vue                                                  
# Description : 매출관리 > 분류별 매출현황 > 결제 형태별 매출현황.              
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
          class="flex justify-start items-center text-base text-nowrap font-semibold ml-40">
          조회조건 :
          <div>
            <label for="daily" class="font-normal">
              <input
                type="checkbox"
                id="daily"
                class="ml-5"
                @change="seeDaily" />일자별
            </label>
          </div>
          <div>
            <label for="unite" class="font-normal">
              <input
                type="checkbox"
                id="unite"
                class="ml-5"
                @change="cellUnite"
                checked />셀병합
            </label>
          </div>
          <div>
            <label for="sum" class="font-normal">
              <input
                type="checkbox"
                id="sum"
                class="ml-5"
                @change="seeSum"
                checked />합계
            </label>
          </div>
        </div>
      </div>
      <div class="h-[75%] ml-5">
        <pickStoreRenew
          @lngStoreCode="selectedStoreCd"
          @lngStoreGroup="selectedGroupCd"
          @lngStoreAttrs="lngStoreAttrs"
          @excelStore="excelStore"
          @changeInit="changeInit"></pickStoreRenew>
      </div>
    </div>
    <!-- 조회 조건 -->
    <!-- 그리드 영역 -->
    <div class="w-full h-[82%]">
      <Realgrid
        :progname="'SLS11_007RPT_VUE'"
        :progid="progId"
        :rowData="rowData"
        :reload="reload"
        :setFooter="true"
        :setFooterExpressions="setFooterExpressions"
        :setFooterColID="setFooterColID"
        :setGroupFooter="setGroupFooter"
        :setGroupColumnId="setGroupColumnId"
        :setGroupSumCustomColumnId="['dtmDate']"
        :setGroupSumCustomText="['소계']"
        :hideColumnsId="hideColumnsId"
        :setGroupFooterExpressions="setGroupFooterExpressions"
        :setGroupFooterColID="setGroupFooterColID"
        :mergeMask="''"
        :setMergeMode="false"
        :setRowGroupSpan2="setRowGroupSpan"
        :documentTitle="'SLS11_007RPT'"
        :rowStateeditable="false"
        :documentSubTitle="documentSubTitle"
        :exporttoExcel="exportExcel">
      </Realgrid>
    </div>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import { getSalesByPaymentTypeReport } from "@/api/misales";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

import Datepicker2 from "@/components/Datepicker2.vue";
/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
/**
 * 	매장 단일 선택 컴포넌트
 */

import pickStoreRenew from "@/components/pickStoreRenew.vue";
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

/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
});

const setFooterColID = ref([
  "lngTotAmt",
  "lngActAmt",
  "lngCashAmt",
  "lngCreditAmt",
  "lngTicketAmt",
  "lngTrustAmt",
  "lngPointAmt",
  "lngPointCnt",
  "lngCashBagSAmt",
  "lngCashBagCnt",
  "lngCashBagAmt",
  "lngTMCAmt",
  "lngTMCCnt",
  "lngDCAmt",
  "lngDepositAmt",
  "lngRepayAmt",
  "lngGiftCardAmt",
]);
const setFooterExpressions = ref([
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
]);
const setGroupFooter = ref(false);
const setGroupFooterColID = ref([
  "lngTotAmt",
  "lngActAmt",
  "lngCashAmt",
  "lngCreditAmt",
  "lngTicketAmt",
  "lngTrustAmt",
  "lngPointAmt",
  "lngPointCnt",
  "lngCashBagSAmt",
  "lngCashBagCnt",
  "lngCashBagAmt",
  "lngTMCAmt",
  "lngTMCCnt",
  "lngDCAmt",
  "lngDepositAmt",
  "lngRepayAmt",
  "lngGiftCardAmt",
]);
const setGroupFooterExpressions = ref([
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
]);

const setGroupColumnId = ref("strStore");
const hideColumnsId = ref([]);
const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);
const selectedstartDate = ref();
const selectedendDate = ref();
const setRowGroupSpan = ref("");

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
const reportCheckData = ref("0");
const progId = ref("1");

const seeDaily = (e) => {
  tempSeeDaily.value = e.target.checked;
  updateProgid();
};

const updateProgid = () => {
  if (tempSeeDaily.value) {
    reportCheckData.value = "1";
    progId.value = "2";
  } else {
    reportCheckData.value = "0";
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

    if (tempCellUnite.value == true) {
      setRowGroupSpan.value = "strStore";
    } else {
      setRowGroupSpan.value = "";
    }

    //그리드 갱신
    reload.value = !reload.value;

    //comsole.log(reportCheckData.value);

    const res = await getSalesByPaymentTypeReport(
      groupCd.value,
      storeCd.value,
      selectedstartDate.value,
      selectedendDate.value,
      reportCheckData.value
    );
    //comsole.log(res);
    rowData.value = res.data.salesByPaymentType;

    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    //comsole.log(error);
  } finally {
    store.state.loading = false;
  }
};

const groupCd = ref();
const storeCd = ref();
const selectedStoreAttr = ref();

/**
 * 선택한 매장 코드 호출 함수
 */

const selectedStoreCd = (e) => {
  //comsole.log(e);
  storeCd.value = e;
};
/**
 * 선택한 매장 그룹 코드 호출 함수
 */

const selectedGroupCd = (e) => {
  //comsole.log(e);
  groupCd.value = e;
};

/**
 * 페이지 매장 분류 세팅
 */

const lngStoreAttrs = (e) => {
  initGrid();
  selectedStoreAttr.value = e;
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

const tempCellUnite = ref(true);
const cellUnite = (e) => {
  if (e.target.checked) {
    tempCellUnite.value = true;
    setRowGroupSpan.value = "strStore";
  } else {
    tempCellUnite.value = false;
    setRowGroupSpan.value = "";
  }
  reload.value = !reload.value;
};

watch([tempSeeDaily, reload], ([dailyValue, _]) => {
  setGroupFooter.value = dailyValue;
});

const seeSum = (e) => {
  if (e.target.checked) {
    setGroupColumnId.value = "strStore";
    reload.value = !reload.value;
  } else {
    setGroupColumnId.value = "";
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
