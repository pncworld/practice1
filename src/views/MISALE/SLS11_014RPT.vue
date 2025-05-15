/*--############################################################################
# Filename : SLS11_014RPT.vue                                                  
# Description : 매출관리 > 분류별 매출 현황 > 구매형태별 매출현황.             #
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
      class="grid grid-cols-2 grid-rows-1 justify-between bg-gray-200 rounded-lg h-16 items-center z-10">
      <div class="mt-1">
        <Datepicker2
          @startDate="startDate"
          @endDate="endDate"
          :closePopUp="closePopUp"
          ref="datepicker"
          :selectedGroup="selectedGroup"
          @excelDate="excelDate" />
      </div>
      <div class="h-[75%] ml-5 mt-1">
        <pickStoreRenew
          @lngStoreCode="lngStoreCode"
          @lngStoreGroup="lngStoreGroup"
          @excelStore="excelStore"
          @lngStoreAttrs="lngStoreAttrs"></pickStoreRenew>
      </div>
    </div>
    <div class="w-full h-[82%]">
      <Realgrid
        :progname="'SLS11_014RPT_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :mergeColumns2="true"
        :mergeColumnGroupSubList2="[
          ['Eat_INCNT', 'Eat_INPrice', 'Eat_INRate', 'Eat_INSum'],
          ['Take_OUTCNT', 'Take_OUTPrice', 'Take_OUTRate', 'Take_OUTSum'],
          ['Total_Cnt', 'Total_Price', 'Total_Rate', 'Total_Sum'],
        ]"
        :mergeColumnGroupName2="['Eat-In', 'Take-Out', '합계']"
        :documentTitle="'SLS11_014RPT'"
        :rowStateeditable="false"
        :documentSubTitle="documentSubTitle"
        :exporttoExcel="exportExcel">
      </Realgrid>
    </div>
  </div>
</template>

<script setup>
import { getSalesByBuyType, getSalesByTimeAndSeats } from "@/api/misales";
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
const setFooterColID = ref(["strStoreName"]);
const setFooterExpressions = ref(["custom"]);

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);
const selectedstartDate = ref();
const selectedendDate = ref();
const selectedStartTime = ref({ value: 0, strName: "00:00" });
const selectedEndTime = ref({ value: 23, strName: "23:00" });

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

    const res = await getSalesByBuyType(
      selectedGroup.value,
      selectedStoreAttrs.value,
      selectedStores.value,
      selectedstartDate.value,
      selectedendDate.value
    );
    //comsole.log(res);
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
/**
 * 페이지 매장 그룹 세팅
 */

const lngStoreGroup = (e) => {
  //initGrid();
  //comsole.log(e);
  selectedGroup.value = e;
};
/**
 * 페이지 매장 코드 세팅
 */

const lngStoreCode = (e) => {
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
