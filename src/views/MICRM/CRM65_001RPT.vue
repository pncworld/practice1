<!-- /*--############################################################################
# Filename : CRM65_001RPT.vue                                                  
# Description : 고객관리 > 전자상품권 현황 > 전자상품권 원장     
# Date :2025-06-19                                                            
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
      class="grid grid-cols-[1fr,1fr,1.5fr] grid-rows-2 bg-gray-200 rounded-lg h-24 items-center z-10 space-x-2 justify-start">
      <div class="justify-start">
        <Datepicker2
          :mainName="'생성일자'"
          @startDate="startDate"
          class="!pr-12"
          @excelDate="excelDate"
          @endDate="endDate"></Datepicker2>
      </div>
      <div class="justify-center flex items-center !ml-32 w-[60%]">
        <span class="text-base font-semibold">상품권구분 : </span>
        <select name="" id="" class="ml-4 w-40 h-8" v-model="cond">
          <option value="0">전체</option>
          <option :value="i.lngGftCategory" v-for="i in optionList">
            {{ i.strGftCategory }}
          </option>
        </select>
      </div>
      <div class="flex justify-start -space-x-1 !ml-8">
        <input type="checkbox" class="" v-model="cond2" />
        <Datepicker2
          :mainName="'회수일자'"
          class="!pr-52"
          @startDate="startDate2"
          @endDate="endDate2"></Datepicker2>
      </div>
      <div class="text-base flex justify-start font-semibold pl-32">
        <span class="text-base font-semibold"> 권종 :</span>
        <select name="" id="" class="w-40 ml-3 h-8" v-model="cond3">
          <option value="0">전체</option>
          <option :value="i.lngGftType" v-for="i in optionList2">
            {{ i.strGftType }}
          </option>
        </select>
      </div>

      <div class="text-base flex justify-start font-semibold pl-32">
        <span class="text-base font-semibold"> 상품권상태 :</span>
        <select name="" id="" class="w-40 ml-3 h-8" v-model="cond4">
          <option value="0">전체</option>
          <option :value="i.strDCode" v-for="i in optionList3">
            {{ i.strDName }}
          </option>
        </select>
      </div>

      <div
        class="text-base flex justify-start items-center font-semibold pl-10 space-x-3">
        <span class="text-base font-semibold"> 상품권번호 :</span>
        <input type="text" v-model="cond5" class="w-52 h-8 pl-1" />
      </div>
    </div>
    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="w-full h-[75%]">
      <Realgrid
        :progname="'CRM65_001RPT_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :documentTitle="'CRM65_001RPT'"
        :documentSubTitle="documentSubTitle"
        :rowStateeditable="false"
        :exporttoExcel="exportExcel">
      </Realgrid>
    </div>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import { getCommonList } from "@/api/common";
import {
  getGftLedgerList,
  getInitGftData,
  getPrePaidbyAccount,
} from "@/api/micrm";
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

  const res = await getCommonList(254);

  optionList3.value = res.data.List;
  const res2 = await getInitGftData(store.state.userData.lngStoreGroup);
  console.log(res2);
  optionList.value = res2.data.List;
  optionList2.value = res2.data.List2;
});

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);
const selectedCond = ref(0);
const condValue = ref(0);
const cond = ref(0);
const cond2 = ref(false);
const cond3 = ref(0);
const cond4 = ref(0);
const cond5 = ref("");
const store = useStore();
const optionList = ref([]);
const optionList2 = ref([]);
const optionList3 = ref([]);
const datepicker = ref(null);
const closePopUp = ref(false);
const custId = ref("");
const strSaleCustID = (e) => {
  initGrid();
  custId.value = e;
};
const custNm = ref("");
const strSaleCustName = (e) => {
  custNm.value = e;
};
const sd = ref("");
const sd2 = ref("");
const ed = ref("");
const ed2 = ref("");
const selectedDate = ref("");
const startDate = (e) => {
  sd.value = e;
};
const endDate = (e) => {
  ed.value = e;
};
const startDate2 = (e) => {
  sd2.value = e;
};
const endDate2 = (e) => {
  ed2.value = e;
};

const excelDate = (e) => {
  selectedDate.value = e;
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

/**
 *  조회 함수
 */

const searchButton = async () => {
  if (sd.value == null || ed.value == null) {
    Swal.fire({
      title: "경고",
      text: "생성일자을 선택하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (cond2.value == false) {
    if (sd2.value == null || ed2.value == null) {
      Swal.fire({
        title: "경고",
        text: "생성일자을 선택하세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }
  }
  try {
    store.state.loading = true;
    initGrid();

    const res = await getGftLedgerList(
      store.state.userData.lngStoreGroup,
      sd.value,
      ed.value,
      cond.value,
      cond3.value,
      cond4.value,
      cond5.value,
      cond2.value == true ? 1 : 0,
      sd2.value,
      ed2.value
    );
    console.log(res);
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
 * 페이지 매장 코드 세팅
 */

const lngStoreCode = async (e) => {
  initGrid();
  selectedStores.value = e;
  console.log(e);
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
  documentSubTitle.value = selectedDate.value;

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
const excelList = (e) => {
  selectedExcelList.value = e;
  //comsole.log(e);
};
</script>
