/*--############################################################################
# Filename : CRM20_007RPT.vue                                                  
# Description : 매출관리 > 외상 거래 현황 > 거래처별일자별외상잔액.            
# Date :2025-05-20                                                             
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
      class="grid grid-cols-2 grid-rows-2 bg-gray-200 rounded-lg h-24 items-center z-10 space-x-5">
      <div class="mt-1 justify-start flex flex-col">
        <PickCustCompany
          class="ml-32"
          @excelStore="excelStore"
          @lngStoreCode="lngStoreCode"></PickCustCompany>
      </div>
      <div class="h-[75%] ml-5 mt-1 justify-start flex">
        <PickBelongCust
          :lngStoreCode="selectedStores"
          @excelList="excelList"
          @strSaleCustName="strSaleCustName"
          @strSaleCustID="strSaleCustID"></PickBelongCust>
      </div>
      <div class="!mr-20 !pr-20">
        <Datepicker2
          :mainName="'조회기간'"
          class="!mr-20 !pr-20"
          :closePopUp="closePopUp"
          ref="datepicker"
          :initToday="1"
          @endDate="endDate"
          @excelDate="excelDate"
          @startDate="startDate"></Datepicker2>
      </div>
      <div class="space-x-2 flex justify-start ml-20 items-center">
        <div class="text-base">거래구분 :</div>
        <div class="flex justify-center items-center">
          <select
            name=""
            id=""
            v-model="cond"
            class="w-40 h-8 flex justify-center items-center">
            <option value="0">전체</option>
            <option value="1">입금</option>
            <option value="2">매출</option>
          </select>
        </div>
        <div>
          <label for="cond2"
            ><input
              type="checkbox"
              id="cond2"
              v-model="cond2"
              @click="changeCond" />소속거래처포함</label
          >
        </div>
      </div>
    </div>
    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="w-full h-[75%]">
      <Realgrid
        :progname="'CRM20_007RPT_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :valuesData="[['1', '2']]"
        :labelsData="[['입금', '매출']]"
        :labelingColumns="'strSaleTranType'"
        :documentTitle="'CRM20_007RPT'"
        :setFooter="true"
        :documentSubTitle="documentSubTitle"
        :rowStateeditable="false"
        :exporttoExcel="exportExcel">
      </Realgrid>
    </div>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import { getBalancebyCustAndDate } from "@/api/micrm";
import Datepicker2 from "@/components/Datepicker2.vue";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
import PickBelongCust from "@/components/pickBelongCust.vue";
import PickCustCompany from "@/components/pickCustCompany.vue";
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
});

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

const condValue = ref(0);
const store = useStore();
const cond = ref(0);
const cond2 = ref(true);

const changeCond = () => {
  cond2.value = !cond2.value;
};
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
  if (selectedStores.value == 0) {
    Swal.fire({
      title: "경고",
      text: "사업장을 선택하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  try {
    store.state.loading = true;
    initGrid();

    const ccond2 = cond2.value == false ? 0 : 1;
    const res = await getBalancebyCustAndDate(
      selectedStores.value,
      custId.value,
      startdate.value,
      enddate.value,
      cond.value,
      ccond2
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
const exceldate = ref("");
const excelDate = (e) => {
  exceldate.value = e;
};
/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  documentSubTitle.value =
    selectedExcelStore.value +
    "\n" +
    selectedExcelList.value +
    "\n" +
    exceldate.value;

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
const excelList = (e) => {
  selectedExcelList.value = e;
  //comsole.log(e);
};

const enddate = ref("");
const endDate = (e) => {
  enddate.value = e;
};
const startdate = ref("");
const startDate = (e) => {
  startdate.value = e;
};
</script>
