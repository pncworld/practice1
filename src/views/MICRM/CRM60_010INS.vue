<!-- /*--############################################################################
# Filename : CRM60_010INS.vue                                                  
# Description : 고객관리 > 전자상품권 마스터 관리 > 직원복지카드 이관(SGI)    
# Date :2025-12-04                                                            
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <!-- 조회조건 -->
  <div class="h-full" @click="handleParentClick">
    <div class="flex justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center mr-9 space-x-2 pr-5">
        <button @click="changeButton" class="button primary md:w-auto w-14">
          교체처리
        </button>
      </div>
    </div>
    <div class="text-red-500">
      ※신규카드는 사용 내역이 없는 미사용카드만 이관 가능합니다.
    </div>
    <div
      class="grid grid-rows-[1fr,1fr,1fr,1fr,10fr] grid-cols-[1fr,3fr,1fr,3fr] w-full h-[90%]">
      <div
        class="border-l border-t border-black text-center flex justify-center items-center bg-gray-200">
        분실 카드번호
      </div>
      <div
        class="border-l border-t border-black text-center flex justify-start space-x-3 pl-1 items-center">
        <input
          type="text"
          class="border border-black disabled:bg-white"
          disabled
          v-model="cond" />
        <input
          type="text"
          class="border border-black"
          @input="inputcond"
          :disabled="disabled"
          v-model="cond2" />
        <button class="whitebutton" @click="searchButton" :disabled="disabled">
          조회
        </button>
        <button class="whitebutton" @click="resetButton">재설정</button>
      </div>
      <div
        class="border-l border-t border-black text-center flex justify-center items-center bg-gray-200">
        신규 카드번호
      </div>
      <div
        class="border-l border-t border-r border-black text-center flex justify-start space-x-3 pl-1 items-center">
        <input
          type="text"
          class="border border-black disabled:bg-white"
          disabled
          v-model="cond3" />
        <input
          type="text"
          class="border border-black"
          @input="inputcond2"
          v-model="cond4"
          :disabled="disabled2" />
        <button class="whitebutton" @click="checkButton" :disabled="disabled2">
          카드체크
        </button>
        <button class="whitebutton" @click="resetButton2">재설정</button>
      </div>
      <div
        class="border-l border-t border-black text-center flex justify-center items-center bg-gray-200">
        사용금액
      </div>
      <div
        class="border-l border-t border-r border-black text-center flex justify-start space-x-3 pl-1 items-center col-span-3">
        <input
          type="text"
          class="border border-black disabled:bg-white"
          disabled
          v-model="cond5" />
      </div>
      <div
        class="border-l border-t border-black text-center flex justify-center items-center bg-gray-200">
        잔고
      </div>
      <div
        class="border-l border-t border-r border-black text-center flex justify-start space-x-3 pl-1 items-center col-span-3">
        <input
          type="text"
          class="border border-black disabled:bg-white"
          disabled
          v-model="cond6" />
      </div>
      <div
        class="border-l border-t border-black text-center flex justify-center items-center bg-gray-200">
        당월 상품권상태
      </div>
      <div
        class="border-l border-t border-r border-black text-center flex justify-start space-x-3 pl-1 items-center col-span-3">
        <input
          type="text"
          class="border border-black disabled:bg-white"
          disabled
          v-model="cond7" />
      </div>
      <div
        class="border-l border-t border-b border-black text-center flex justify-center items-center bg-gray-200">
        당월 거래내역
      </div>
      <div
        class="border-l border-t border-r border-b border-black text-center flex justify-start space-x-3 pl-1 items-center col-span-3">
        <Realgrid
          :progname="'CRM60_010INS_VUE'"
          :progid="1"
          :rowData="rowData"
          :rowStateeditable="false"></Realgrid>
      </div>
    </div>
    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import {
  checkGftCard,
  getGftCard,
  getGftLedgerList,
  setWelFareCardNo,
} from "@/api/micrm";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
import Realgrid from "@/components/realgrid.vue";
/**
 * 	매장 단일 선택 컴포넌트
 */
/**
 * 	그리드 생성
 */

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
const selectedCond = ref(0);
const condValue = ref(0);
const cond = ref(198900400000);
const cond2 = ref("");
const cond3 = ref(198900400000);
const cond4 = ref("");
const cond5 = ref("");
const cond6 = ref("");
const cond7 = ref("");
const store = useStore();
const optionList = ref([]);
const optionList2 = ref([]);
const optionList3 = ref([]);
const datepicker = ref(null);
const closePopUp = ref(false);
const custId = ref("");

const sd = ref("");
const sd2 = ref("");
const ed = ref("");
const ed2 = ref("");
const selectedDate = ref("");

/**
 * 매출 일자 안 라디오박스 닫기 위한 외부 클릭 감지 함수
 */

/**
 *  조회 함수
 */
const disabled = ref(false);
const searchButton = async () => {
  if (cond2.value.length < 4) {
    Swal.fire({
      title: "경고",
      text: "분실 카드번호를 확인해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  try {
    store.state.loading = true;
    initGrid();

    const res = await getGftCard(
      store.state.userData.lngStoreGroup,
      cond.value + cond2.value,
      1
    );
    //console.log(res);
    //rowData.value = res.data.List;
    if (res.data.List[0].STATUS !== "0000") {
      Swal.fire({
        title: "경고",
        text: "유효하지 않은 카드번호입니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }
    rowData.value = res.data.List3;
    cond5.value = res.data.List2[0].lngTotUse;
    cond6.value = res.data.List2[0].lngGftBalance;
    cond7.value = res.data.List2[0].STATUS;
    afterSearch.value = true;
    disabled.value = true;
  } catch (error) {
    afterSearch.value = false;
    //comsole.log(error);
    disabled.value = false;
  } finally {
    store.state.loading = false;
  }
};

const resetButton = () => {
  rowData.value = [];
  cond5.value = "";
  cond6.value = "";
  cond7.value = "";

  cond2.value = "";
  disabled.value = false;
};
const resetButton2 = () => {
  cond4.value = "";
  disabled2.value = false;
};

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

/**
 * 엑셀용 매장 세팅 함수
 */

const inputcond = (e) => {
  cond2.value = e.target.value.replace(/[^0-9]/g, "");
};
const inputcond2 = (e) => {
  cond4.value = e.target.value.replace(/[^0-9]/g, "");
};

const disabled2 = ref(false);
const checkButton = async () => {
  if (cond4.value.length < 4) {
    Swal.fire({
      title: "경고",
      text: "신규 카드번호를 확인해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  try {
    store.state.loading = true;

    const res = await checkGftCard(
      store.state.userData.lngStoreGroup,
      cond3.value + cond4.value,
      1
    );

    //rowData.value = res.data.List;
    if (res.data.List[0].STATUS !== "0000") {
      Swal.fire({
        title: "경고",
        text: "신규 카드번호 이관 불가. 피앤시월드 연락요망.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }

    afterSearch.value = true;
    disabled2.value = true;
  } catch (error) {
    afterSearch.value = false;
    //comsole.log(error);
    disabled2.value = false;
  } finally {
    store.state.loading = false;
  }
};

const changeButton = async () => {
  if (disabled.value == false) {
    Swal.fire({
      title: "경고",
      text: "분실 카드번호를 먼저 조회해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  if (disabled2.value == false) {
    Swal.fire({
      title: "경고",
      text: "신규 카드번호를 먼저 체크해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  try {
    store.state.loading = true;

    const res = await setWelFareCardNo(
      store.state.userData.lngStoreGroup,
      cond.value + cond2.value,
      cond3.value + cond4.value,
      1
    );

    if (res.data.RESULT_CD == "00") {
      Swal.fire({
        title: "성공",
        text: "신규 카드번호 번호로 기존 분실카드 데이터를 이관하였습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
    }
  } catch (error) {
  } finally {
    store.state.loading = false;
  }
};
</script>
