/*--############################################################################
# Filename : SLS06_013RPT.vue
# Description : 매출관리 > 기간별 매출 현황 > 일별 분석
# Date :2026-03-09
# Author : 권지안
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
          @excelDate="excelDate" />
      </div>
      <div class="-ml-8">
        <PickStorePlural
          @lngStoreCodes="lngStoreCodes"
          @lngStoreGroup="lngStoreGroup"
          @lngStoreAttrs="lngStoreAttrs"
          @excelStore="excelStore" />
      </div>
    </div>
    <!-- 조회조건 -->
    <!-- 탭 -->
    <div class="flex gap-0 w-full border-b border-gray-300">
      <button
        v-for="tab in tabList"
        :key="tab"
        type="button"
        class="px-4 py-2.5 text-sm font-medium rounded-t transition-colors"
        :class="activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
        @click="activeTab = tab">
        {{ tab }}
      </button>
    </div>
    <!-- 그리드 영역 -->
    <div class="w-full h-[85%]">
      <Realgrid
        :progname="'SLS06_013RPT_VUE'"
        :progid="'1'"
        :rowData="rowData"
        :reload="reload"
        :setFooter="true"
        :setFooterExpressions="setFooterExpressions"
        :setFooterColID="setFooterColID"
        :documentTitle="'SLS06_013RPT'"
        :rowStateeditable="false"
        :documentSubTitle="documentSubTitle"
        :exporttoExcel="exportExcel">
      </Realgrid>
    </div>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import { getDailySalesAnalysis } from "@/api/misales";
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

const setFooterColID = ref([
  "saleAmt",
  "discountAmt",
  "actAmt",
  "netSalesAmt",
  "VATAmt",
  "billCnt",
  "billAverage",
  "custCnt",
  "custAverage",
  "tableCnt",
  "tableTurnover",
  "cashAmt",
  "cardAmt",
  "ratioDiscount",
  "amtDiscount",
  "hallCnt",
  "hallAmt",
  "takeoutCnt",
  "takeoutAmt",
  "deliveryCnt",
  "deliveryAmt",
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
  "sum",
  "sum",
  "sum",
  "sum"
]);

const tabList = ["종합", "매장별", "결제수단별", "할인별", "시간대별", "주문유형별"];
const activeTab = ref("종합");
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
    
    selectedStorearr = selectedStores.value;
    
    // 일자별 조회
    const res = await getDailySalesAnalysis(
        selectedGroup.value,
        selectedStorearr,
        selectedstartDate.value,
        selectedendDate.value,
    );

    // console.log(res);
    
    rowData.value = res.data.dailySalesAnalysis;
    
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
  initGrid();
  selectedGroup.value = e;
};
/**
 * 페이지 매장 코드 세팅
 */

const lngStoreCodes = (e) => {
  initGrid();
  selectedStores.value = e;
};

/**
 * 페이지 매장 분류 세팅
 */

const lngStoreAttrs = (e) => {
  initGrid();
  selectedStoreAttrs.value = e;
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
};
const selectedExcelStore = ref("");

/**
 * 엑셀용 매장 세팅 함수
 */

const excelStore = (e) => {
  selectedExcelStore.value = e;
};
</script>

<style></style>