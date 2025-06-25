<!-- /*--############################################################################
# Filename : CRM11_006RPT.vue                                                  
# Description : 고객관리 > 프로모션 관리 > 멤버십 쿠폰조회.              
# Date :2025-06-25                                                             
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
      class="grid grid-cols-[1fr,1fr] grid-rows-[1fr,1fr] bg-gray-200 rounded-lg h-28 items-center z-10 space-x-5">
      <div class="justify-start flex items-center -space-x-14">
        <Datepicker2
          :mainName="'기간'"
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
        <span class="text-base font-semibold">쿠폰명 :</span>
        <select name="" id="" class="ml-5 w-48 h-8" v-model="cond">
          <option value="0">전체</option>
          <option :value="i.lngCouponId" v-for="i in optionList">
            {{ i.strCouponName }}
          </option>
        </select>
      </div>
      <div class="flex">
        <div class="ml-20 text-base font-semibold">쿠폰번호 :</div>
        <div><input type="number" class="ml-5 w-48 h-8" v-model="cond2" /></div>
      </div>
      <div class="flex justify-start items-center pl-14">
        <div class="flex items-center justify-start space-x-3">
          <span class="text-nowrap text-base font-semibold">고객명 :</span>
          <input
            type="text"
            class="h-8 w-32 disabled:bg-white"
            v-model="cond3"
            disabled />
          <input
            type="text"
            class="h-8 w-32 disabled:bg-white"
            v-model="cond4"
            disabled />
          <button class="whitebutton !bg-white z-50" @click="setCond">
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
          :progname="'CRM11_006RPT_VUE'"
          :progid="1"
          :rowData="rowData"
          :reload="reload"
          @buttonClicked="buttonClicked"
          :documentTitle="'CRM11_006RPT'"
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

  <!-- 팝업 오버레이 -->
  <div
    v-if="visible2"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <!-- 팝업 내용 -->
    <div class="bg-white p-6 rounded-2xl shadow-xl w-[90%] max-w-md h-[25%]">
      <h2 class="text-xl font-semibold mb-4 flex justify-center items-center">
        유효기간 조정
      </h2>
      <div class="mb-4 flex justify-center flex-col items-center">
        <div class="grid grid-rows-2 grid-cols-2">
          <div>선택한 쿠폰코드</div>
          <div>
            <input
              type="number"
              v-model="pcond"
              class="border border-black"
              disabled />
          </div>
          <div>선택한 고객명</div>
          <div>
            <input
              type="text"
              v-model="pcond2"
              class="border border-black"
              disabled />
          </div>
        </div>
        <input
          type="date"
          v-model="cond5"
          class="border border-black rounded-lg w-32 h-8 mt-5" />
      </div>
      <div class="text-right flex justify-end items-center space-x-2">
        <button
          @click="saveButton"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          저장
        </button>
        <button
          @click="visible2 = false"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          닫기
        </button>
      </div>
    </div>
  </div>

  <!-- 그리드 영역 -->
</template>

<script setup>
import {
  getInitCouponType,
  getPromoCouponList,
  saveExtendExpireDate,
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
import Swal from "sweetalert2";
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

  const res = await getInitCouponType(store.state.userData.lngStoreGroup);
  //console.log(res);
  optionList.value = res.data.List;
});

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);
const visible = ref(false);
const visible2 = ref(false);
const initAll = ref(false);
const store = useStore();
const cond = ref("0");
const cond2 = ref("");
const cond3 = ref("");
const cond4 = ref("");
const cond5 = ref("");
const pcond = ref("");
const pcond2 = ref("");
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
  cond4.value = e;
};
const lngCustNo = (e) => {
  cond3.value = e;
};

const selectedCustNo = ref("");
const selectedMemberDiv = ref("");
const buttonClicked = (e) => {
  //console.log(e);
  const temp = e[7];
  pcond.value = e[1];
  pcond2.value = e[3];
  selectedCustNo.value = e[15];
  selectedMemberDiv.value = e[16];
  const newdate = new Date(temp);

  newdate.setDate(newdate.getDate() + 61);
  // console.log(newdate);
  cond5.value = newdate.toISOString().split("T")[0];
  visible2.value = true;
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

    const res = await getPromoCouponList(
      store.state.userData.lngStoreGroup,
      cond3.value,
      cond2.value,
      sDate.value,
      eDate.value,
      cond.value
    );

    rowData.value = res.data.List;
    console.log(res);
    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    //comsole.log(error);
  } finally {
    store.state.loading = false;
  }
};

const saveButton = async () => {
  try {
    const res = await saveExtendExpireDate(
      store.state.userData.lngStoreGroup,
      selectedCustNo.value,
      pcond.value,
      selectedMemberDiv.value,
      store.state.userData.lngSequence
    );

    console.log(res);
    Swal.fire({
      title: "성공",
      text: "유효기간을 저장하였습니다.",
      icon: "success",
      confirmButtonText: "확인",
    });
    return;
  } catch (error) {
  } finally {
    visible2.value = false;
    searchButton();
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
