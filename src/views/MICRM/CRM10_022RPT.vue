/*--############################################################################
# Filename : CRM10_022RPT.vue                                                  
# Description : 고객관리 > 고객 예약 관리 > 예약조회.                          
# Date :2025-05-21                                                             
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
    <div class="flex bg-gray-200 rounded-lg h-16 items-start z-10">
      <div>
        <PickStore
          class="!-mr-4"
          :hideGroup="false"
          :hideAttr="false"
          @update:storeCd="lngStoreCode"
          @update:storeGroup="lngStoreGroup"
          @storeNm="excelStore"
          :defaultStoreNm="'전체'">
        </PickStore>
      </div>
      <div class="ml-5">
        <Datepicker2
          @endDate="endDate"
          @startDate="startDate"
          @excelDate="excelDate"
          :initToday="1"
          :mainName="'접수일'"
          class="!w-[350px] !pr-0 !ml-5"></Datepicker2>
      </div>
      <div class="flex mt-5 ml-32">
        <div class="text-base font-semibold text-nowrap">상태</div>
        <div>
          <select name="" id="" class="w-32 ml-5" v-model="status">
            <option value="99">전체</option>
            <option value="0">예약</option>
            <option value="1">방문</option>
            <option value="2">대기</option>
            <option value="3">입장</option>
            <option value="4">취소</option>
            <option value="5">NO SHOW</option>
          </select>
        </div>
      </div>
      <div class="flex ml-6 mt-5">
        <div class="text-base font-semibold">고객명</div>
        <div><input type="text" class="ml-5" v-model="cond" /></div>
      </div>
      <div class="flex mt-5 ml-5">
        <div class="text-base font-semibold">전화번호</div>
        <div><input type="text" class="ml-5" v-model="cond2" /></div>
        <div>(뒷4자리)</div>
      </div>
    </div>
    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="w-full h-[75%]">
      <Realgrid
        :progname="'CRM10_022RPT_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :setStateBar="false"
        :documentTitle="'CRM10_022RPT'"
        :dynamicRowHeight="true"
        :documentSubTitle="documentSubTitle"
        :rowStateeditable="false"
        :exporttoExcel="exportExcel">
      </Realgrid>
    </div>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import {
  getBelongCustList,
  getReservedChangeHistory,
  getReservedSearch,
} from "@/api/micrm";
import Datepicker2 from "@/components/Datepicker2.vue";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
import PickStore from "@/components/pickStore.vue";
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

const cond = ref("");
const cond2 = ref("");
const store = useStore();
const status = ref(99);
const datepicker = ref(null);
const closePopUp = ref(false);
const custId = ref("");
const strSaleCustID = (e) => {
  custId.value = e;
  initGrid();
};
const custNm = ref("");
const strSaleCustName = (e) => {
  custNm.value = e;
};

const startdate = ref("");
const startDate = (e) => {
  startdate.value = e;
};
const enddate = ref("");
const endDate = (e) => {
  enddate.value = e;
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
  // if (selectedStores.value == 0) {
  //   Swal.fire({
  //     title: "경고",
  //     text: "매장명을 먼저 선택하세요.",
  //     icon: "warning",
  //     confirmButtonText: "확인",
  //   });
  //   return;
  // }
  try {
    store.state.loading = true;
    // initGrid();

    const res = await getReservedSearch(
      selectedGroup.value,
      selectedStores.value,
      startdate.value,
      enddate.value,
      status.value,
      cond.value,
      cond2.value
    );
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
  //console.log(e);
};
const lngStoreGroup = async (e) => {
  //initGrid();
  selectedGroup.value = e;
  //console.log(e);
};

/**
 * 그리드 초기화
 */

const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
  cond.value = "";
  cond2.value = "";
  status.value = 99;
};

//엑셀 버튼 처리 함수
const exportExcel = ref(false);
/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  documentSubTitle.value =
    selectedExcelStore.value + "\n" + selectedExcelDate.value;

  //documentSubTitle.value += "\n";
  exportExcel.value = !exportExcel.value;
};

// 엑셀 추출
const documentSubTitle = ref("");
const selectedExcelList = ref("");
const selectedExcelDate = ref("");

const selectedExcelStore = ref("");
/**
 * 엑셀용 매장 세팅 함수
 */

const excelStore = (e) => {
  selectedExcelStore.value = "매장명 : " + e;
  //comsole.log(e);
};
const excelDate = (e) => {
  selectedExcelDate.value = e;
  //comsole.log(e);
};
</script>
