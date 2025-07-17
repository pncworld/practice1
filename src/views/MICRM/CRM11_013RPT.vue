<!-- /*--############################################################################
# Filename : CRM11_013RPT.vue                                                  
# Description : 고객관리 > 프로모션 관리 > 이벤트 쿠폰 발행 현황             
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
      class="grid grid-cols-[1fr,1fr] grid-rows-[1fr,1fr] bg-gray-200 rounded-lg h-28 items-start z-10">
      <div class="justify-start flex items-center -space-x-14">
        <Datepicker2
          :mainName="'기간'"
          :initToday="1"
          ref="datepicker"
          class="ml-7"
          :closePopUp="closePopUp"
          @endDate="endDate"
          @excelDate="excelDate"
          @startDate="startDate">
        </Datepicker2>
      </div>

      <div class="mt-2 justify-start items-center flex space-x-5 !ml-20">
        <span class="text-base font-semibold">쿠폰명</span>
        <select name="" id="" class="ml-5 w-48 h-8" v-model="cond">
          <option value="0">전체</option>
          <option :value="i.lngCouponType" v-for="i in optionList">
            {{ i.strCouponName }}
          </option>
        </select>
      </div>
      <div class="flex">
        <div class="ml-12 text-base font-semibold">쿠폰번호</div>
        <div><input type="text" class="ml-5 w-48 h-8" v-model="cond2" /></div>
      </div>
      <div class="flex justify-start items-center pl-[50px]">
        <span class="text-nowrap text-base font-semibold">핸드폰번호</span>
        <input
          type="text"
          class="h-8 w-48 disabled:bg-white ml-5"
          v-model="cond3" />
      </div>
    </div>
    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="w-full h-[75vh]">
      <div class="w-full h-[80%]">
        <Realgrid
          :progname="'CRM11_013RPT_VUE'"
          :progid="1"
          :rowData="rowData"
          :reload="reload"
          @buttonClicked="buttonClicked"
          @clickedButtonCol="clickedButtonCol"
          :documentTitle="'CRM11_013RPT'"
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
        기간조정
      </h2>
      <div class="mb-4 flex justify-center flex-col items-center">
        <div class="grid grid-rows-2 grid-cols-2">
          <div>선택한 핸드폰번호</div>
          <div>
            <input
              type="text"
              v-model="pcond"
              class="border border-black"
              disabled />
          </div>
          <div>선택한 쿠폰번호</div>
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
          v-model="pcond3"
          class="border border-black rounded-lg w-32 h-8 mt-5" />
      </div>
      <div class="text-right flex justify-end items-center space-x-2">
        <button
          @click="saveButton"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          유효기간 연장
        </button>
        <button
          @click="visible2 = false"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          닫기
        </button>
      </div>
    </div>
  </div>

  <div
    v-if="visible3"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <!-- 팝업 내용 -->
    <div class="bg-white p-6 rounded-2xl shadow-xl w-[90%] max-w-md h-[25%]">
      <h2 class="text-xl font-semibold mb-4 flex justify-center items-center">
        문자재전송
      </h2>
      <div class="mb-4 flex justify-center flex-col items-center">
        <input
          type="number"
          v-model="pcond4"
          class="border border-black rounded-lg w-32 h-8 mt-5" />
      </div>
      <div class="text-right flex justify-end items-center space-x-2">
        <button
          @click="saveButton2"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          문자재전송
        </button>
        <button
          @click="visible3 = false"
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
  getEventCouponList,
  getInitCouponType2,
  saveExtendEventExpireDate,
} from "@/api/micrm";
import { sendSMS } from "@/api/misales";
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

  const res = await getInitCouponType2(store.state.userData.lngStoreGroup);
  //console.log(res);
  optionList.value = res.data.List;
});

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);
const visible = ref(false);
const visible2 = ref(false);
const visible3 = ref(false);
const initAll = ref(false);
const store = useStore();
const cond = ref("0");
const cond2 = ref("");
const cond3 = ref("");
const cond4 = ref("");
const cond5 = ref("");
const pcond = ref("");
const pcond2 = ref("");
const pcond3 = ref("");
const pcond4 = ref("");
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
const clickedButtonCol = (e) => {
  if (e == "add1") {
    visible2.value = true;
    visible3.value = false;
  } else {
    visible2.value = false;
    visible3.value = true;
  }
  //console.log(e);
};
const buttonClicked = (e) => {
  //console.log(e);
  pcond.value = e[0];
  pcond2.value = e[1];
  //pcond3.value = e[5]
  const temp = e[5];
  // pcond.value = e[1];
  // pcond2.value = e[3];
  // selectedCustNo.value = e[15];
  // selectedMemberDiv.value = e[16];
  const newdate = new Date(temp);

  newdate.setDate(newdate.getDate() + 60);
  //console.log(newdate);
  pcond3.value = newdate.toISOString().split("T")[0];
  pcond4.value = e[0].replace("-", "").replace("-", "");
  // visible2.value = true;
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
  initGrid();
};
const endDate = (e) => {
  eDate.value = e;
  initGrid();
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

    const res = await getEventCouponList(
      store.state.userData.lngStoreGroup,
      cond3.value,
      cond2.value,
      sDate.value,
      eDate.value,
      cond.value
    );

    rowData.value = res.data.List;
    //console.log(res);
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
    const res = await saveExtendEventExpireDate(
      store.state.userData.lngStoreGroup,
      pcond.value,
      pcond2.value,
      pcond3.value
    );

    //console.log(res);
    Swal.fire({
      title: "성공",
      text: "기간을 조정하였습니다.",
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

const saveButton2 = async () => {
  try {
    // const res = await sendSMS(
    //   store.state.userData.lngStoreGroup,
    //   pcond.value,
    //   pcond2.value,
    //   pcond3.value
    // );

    //console.log(res);
    Swal.fire({
      title: "성공",
      text: "문자 재전송을 완료하였습니다.",
      icon: "success",
      confirmButtonText: "확인",
    });
    return;
  } catch (error) {
  } finally {
    visible3.value = false;
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
