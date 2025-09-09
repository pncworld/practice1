<!-- /*--############################################################################
# Filename : MST01_032RPT.vue                                                  
# Description : 마스터관리 > POS 마스터 > 마스터자동다운로드 조회.                  #
#Date :2025-07-15                                                              #
#Author : 권맑음                     
################################################################################*/ -->
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
      class="grid grid-rows-1 grid-cols-2 justify-between bg-gray-200 rounded-lg h-14 items-start z-10">
      <div class="ml-12">
        <PickStoreRenew3
          @lngStoreCode="selectedStoreCd"
          @lngStoreGroup="selectedGroupCd"
          @lngStoreAttrs="changeStoreType"
          @excelStore="excelStore"></PickStoreRenew3>
      </div>
      <div class="w-96 ml-40">
        <Datepicker2
          @endDate="endDate"
          @startDate="startDate"
          :closePopUp="closePopUp"
          :mainName="'일자'"
          :initToday="1"
          ref="datepicker"
          @excelDate="excelDate"></Datepicker2>
      </div>
    </div>

    <div class="grid grid-rows-1 grid-cols-1 h-[85%] mt-5">
      <Realgrid
        :progname="'MST01_032RPT_VUE'"
        :progid="1"
        :rowData="rowData"
        :exporttoExcel="exporttoExcel"
        :documentTitle="'MST01_032RPT'"
        :rowStateeditable="false"
        :documentSubTitle="documentSubTitle">
      </Realgrid>
    </div>
  </div>
</template>

<script setup>
import { getMasterAutoDownloadList } from "@/api/master";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

import Datepicker2 from "@/components/Datepicker2.vue";
/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
/**
 *  매장 선택 컴포넌트
 *  */

import PickStoreRenew3 from "@/components/pickStoreRenew.vue";
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
  ////console.log(store.state.userData);
});

const selectedStartDate = ref();
const selectedEndDate = ref();

/**
 * 선택한 매출 시작일자
 */

const startDate = (e) => {
  selectedStartDate.value = e;
};
/**
 * 선택한 매출 종료일자
 */

const endDate = (e) => {
  selectedEndDate.value = e;
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
  store.state.loading = true;
  try {
    initGrid();

    const res = await getMasterAutoDownloadList(
      groupCd.value,
      storeType.value,
      storeCd.value,
      selectedStartDate.value,
      selectedEndDate.value
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

const selectedPosNo = ref();

const exporttoExcel = ref(false);
/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  documentSubTitle.value =
    selectedExcelDate.value + "\n" + selectedExcelStore.value;
  exporttoExcel.value = !exporttoExcel.value;
};
/**
 * 그리드 초기화
 */

const initGrid = () => {
  if (rowData.value.length != 0) {
    rowData.value = [];
  }
};

const storeType = ref("");
const changeStoreType = (e) => {
  initGrid();
  storeType.value = e;
  init.value = !init.value;
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
