<!-- /*--############################################################################
# Filename : CRM05_004RPT.vue                                                  
# Description : 고객관리 > 고객 포인트 관리 > 멤버십 소멸포인트               
# Date :2025-06-18                                                             
# Author : 권맑음                     
################################################################################*/ -->
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
      class="grid grid-cols-[1fr,1fr,1fr] grid-rows-1 bg-gray-200 rounded-lg h-20 items-center z-10 space-x-5">
      <div class="justify-start flex items-center -space-x-14">
        <Datepicker2
          :mainName="'소멸일자'"
          :initToday="1"
          ref="datepicker"
          :closePopUp="closePopUp"
          @endDate="endDate"
          @excelDate="excelDate"
          @startDate="startDate">
        </Datepicker2>
      </div>

      <div
        class="h-[75%] mt-1 justify-start items-center flex space-x-5 !ml-20">
        <span class="text-base font-semibold">소멸포인트(>=)</span>
        <input type="number" class="h-8 w-48" v-model="cond" />
      </div>
      <div class="flex justify-start items-center !mr-10">
        <div class="flex items-center justify-start !mr-10">
          <span class="text-nowrap text-base font-semibold">고객명</span>
          <input
            type="text"
            class="h-8 w-32 disabled:bg-white ml-5"
            v-model="cond2"
            disabled />
          <input
            type="text"
            class="h-8 w-32 disabled:bg-white ml-5"
            v-model="cond3"
            disabled />
          <button class="whitebutton !bg-white z-50 ml-5" @click="setCond">
            조회
          </button>
          <button class="whitebutton !bg-white z-50" @click="initAll2">
            초기화
          </button>
        </div>
      </div>
    </div>
    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="w-full h-[75vh]">
      <div class="w-full h-[80%]">
        <Realgrid
          :progname="'CRM05_004RPT_VUE'"
          :progid="1"
          :rowData="rowData"
          :reload="reload"
          :documentTitle="'CRM05_004RPT'"
          :documentSubTitle="documentSubTitle"
          :rowStateeditable="false"
          :exporttoExcel="exportExcel">
        </Realgrid>
      </div>
    </div>
  </div>
  <CustomerSearch
    v-if="visible"
    @lngCustNo="lngCustNo"
    @strCustName="strCustName"
    @closePopUp="visible = false"></CustomerSearch>
  <!-- 그리드 영역 -->
</template>

<script setup>
import {
  getInitDataCustPurchase,
  getMemberShipExpirePoint,
  getMemberShipExpirePoint2,
  restoreCustomor,
} from "@/api/micrm";
import CustomerSearch from "@/components/customerSearch.vue";
import Datepicker2 from "@/components/Datepicker2.vue";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
/**
 * 	매장 단일 선택 컴포넌트
 */
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

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);
const visible = ref(false);
const initAll = ref(false);
const store = useStore();
const cond = ref("");
const cond2 = ref("");
const cond3 = ref("");
const optionList = ref([]);
const datepicker = ref(null);
const closePopUp = ref(false);
const setFooter = ref(false);
const setCond = () => {
  visible.value = true;
};
const initAll2 = () => {
  cond2.value = "";
  cond3.value = "";
};
const strCustName = (e) => {
  cond3.value = e;
};
const lngCustNo = (e) => {
  cond2.value = e;
};

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

const sDate = ref();
const eDate = ref();
const startDate = (e) => {
  sDate.value = e;
};
const endDate = (e) => {
  eDate.value = e;
};

const selectedDate = ref();
const excelDate = (e) => {
  selectedDate.value = e;
};

/**
 *  조회 함수
 */

const setGroupFooter = ref(false);
const hideColumnsId = ref(["dtmDate"]);
const searchButton = async () => {
  try {
    store.state.loading = true;
    initGrid();

    const res = await getMemberShipExpirePoint2(
      store.state.userData.lngStoreGroup,
      sDate.value,
      eDate.value,
      cond.value == "" || cond.value == undefined ? 0 : cond.value,
      cond2.value
    );

    rowData.value = res.data.List;
    ////console.log(res);
    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    //comsole.log(error);
  } finally {
    store.state.loading = false;
  }
};

/**
 * 페이지 매장 코드 세팅
 */

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
  documentSubTitle.value = selectedDate.value + "\n" + selectedExcelStore.value;

  //documentSubTitle.value += "\n";
  exportExcel.value = !exportExcel.value;
};

// 엑셀 추출
const documentSubTitle = ref("");
const selectedExcelList = ref("");

const selectedExcelStore = ref("");
/**
 * 엑셀용 매장 세팅 함수
 */

const excelStore = (e) => {
  selectedExcelStore.value = e;
  //comsole.log(e);
};
</script>
