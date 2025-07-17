<!-- /*--############################################################################
# Filename : CRM05_008INS.vue                                                  
# Description : 고객관리 > 고객 포인트 관리> 카드 이동                      
# Date :2025-06-18                                                             
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <!-- 조회조건 -->
  <div class="h-full" @click="handleParentClick">
    <div class="flex justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center mr-9 space-x-2 pr-5">
        <button @click="saveButton" class="button save md:w-auto w-14">
          저장
        </button>
      </div>
    </div>

    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <br />
    <br />

    <div
      class="grid grid-rows-[1fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr,2fr] grid-cols-[1fr,3fr,1fr,3fr] w-[60vw] h-[60vh]">
      <div
        class="border-l border-t border-black flex justify-center items-center bg-gray-100">
        고객카드번호
      </div>
      <div
        class="border-l border-t border-black flex justify-start items-center pl-2">
        <input
          type="text"
          class="border border-black disabled:bg-white"
          v-model="pcond"
          disabled />
        <button
          class="whitebutton"
          @click="
            showPopup = true;
            isfirst = false;
          ">
          조회
        </button>
      </div>

      <div></div>
      <div></div>
      <div
        class="border-l border-t border-black flex justify-center items-center bg-gray-100">
        고객명
      </div>
      <div
        class="border-l border-t border-black flex justify-start items-center pl-2">
        <input
          type="text"
          class="border border-black disabled:bg-white"
          v-model="pcond2"
          disabled />
      </div>

      <div
        class="border-l border-t border-black flex justify-center items-center bg-gray-100">
        전화번호
      </div>
      <div
        class="border-l border-t border-black flex justify-start items-center pl-2">
        <input
          type="text"
          class="border border-black disabled:bg-white"
          v-model="pcond3"
          disabled />
      </div>

      <div
        class="border-l border-t border-black flex justify-center items-center bg-gray-100">
        방문횟수
      </div>
      <div
        class="border-l border-t border-black flex justify-start items-center pl-2">
        <input
          type="text"
          class="border border-black disabled:bg-white"
          v-model="pcond4"
          disabled />
      </div>
      <div
        class="border-l border-t border-black flex justify-center items-center bg-gray-100">
        실매출액
      </div>
      <div
        class="border-l border-t border-black flex justify-start items-center pl-2">
        <input
          type="number"
          class="border border-black disabled:bg-white"
          v-model="pcond5"
          disabled />
      </div>
      <div
        class="border-l border-t border-black flex justify-center items-center bg-gray-100">
        누적포인트
      </div>
      <div
        class="border-l border-t border-black flex justify-start items-center pl-2">
        <input
          type="number"
          class="border border-black disabled:bg-white"
          v-model="pcond6"
          disabled />
      </div>
      <div
        class="border-l border-t border-black flex justify-center items-center bg-gray-100">
        보너스포인트
      </div>
      <div
        class="border-l border-t border-black flex justify-start items-center pl-2">
        <input
          type="number"
          class="border border-black disabled:bg-white"
          v-model="pcond7"
          disabled />
      </div>
      <div
        class="border-l border-t border-black flex justify-center items-center bg-gray-100">
        사용포인트
      </div>
      <div
        class="border-l border-t border-black flex justify-start items-center pl-2">
        <input
          type="number"
          class="border border-black disabled:bg-white"
          v-model="pcond8"
          disabled />
      </div>
      <div
        class="border-l border-t border-black flex justify-center items-center bg-gray-100">
        잔여포인트
      </div>
      <div
        class="border-l border-t border-black flex justify-start items-center pl-2">
        <input
          type="number"
          class="border border-black disabled:bg-white"
          v-model="pcond9"
          disabled />
      </div>
      <div
        class="border-l border-t border-black flex justify-center items-center bg-gray-100">
        사용할 카드번호
      </div>
      <div
        class="border-l border-t border-black flex justify-start items-center pl-2">
        <input
          type="text"
          class="border border-black disabled:bg-white"
          v-model="pcond10"
          disabled />
        <button
          class="whitebutton"
          @click="
            showPopup = true;
            isfirst = true;
          ">
          조회
        </button>
      </div>

      <div></div>
      <div></div>
      <div
        class="border-l border-t border-black flex justify-center items-center bg-gray-100">
        고객명
      </div>
      <div
        class="border-l border-t border-black flex justify-start items-center pl-2">
        <input
          type="text"
          class="border border-black disabled:bg-white"
          v-model="pcond11"
          disabled />
      </div>

      <div
        class="border-l border-t border-black flex justify-center items-center bg-gray-100">
        전화번호
      </div>
      <div
        class="border-l border-t border-black flex justify-start items-center pl-2">
        <input
          type="text"
          class="border border-black disabled:bg-white"
          v-model="pcond12"
          disabled />
      </div>

      <div
        class="border-l border-t border-black flex justify-center items-center bg-gray-100">
        방문횟수
      </div>
      <div
        class="border-l border-t border-black flex justify-start items-center pl-2">
        <input
          type="text"
          class="border border-black disabled:bg-white"
          v-model="pcond13"
          disabled />
      </div>
      <div
        class="border-l border-t border-black flex justify-center items-center bg-gray-100">
        실매출액
      </div>
      <div
        class="border-l border-t border-black flex justify-start items-center pl-2">
        <input
          type="number"
          class="border border-black disabled:bg-white"
          v-model="pcond14"
          disabled />
      </div>
      <div
        class="border-l border-t border-black flex justify-center items-center bg-gray-100">
        누적포인트
      </div>
      <div
        class="border-l border-t border-black flex justify-start items-center pl-2">
        <input
          type="number"
          class="border border-black disabled:bg-white"
          v-model="pcond15"
          disabled />
      </div>
      <div
        class="border-l border-t border-black flex justify-center items-center bg-gray-100">
        보너스포인트
      </div>
      <div
        class="border-l border-t border-black flex justify-start items-center pl-2">
        <input
          type="number"
          class="border border-black disabled:bg-white"
          v-model="pcond16"
          disabled />
      </div>
      <div
        class="border-l border-t border-black flex justify-center items-center bg-gray-100">
        사용포인트
      </div>
      <div
        class="border-l border-t border-black flex justify-start items-center pl-2">
        <input
          type="number"
          class="border border-black disabled:bg-white"
          v-model="pcond17"
          disabled />
      </div>
      <div
        class="border-l border-t border-black flex justify-center items-center bg-gray-100">
        잔여포인트
      </div>
      <div
        class="border-l border-t border-black flex justify-start items-center pl-2">
        <input
          type="number"
          class="border border-black disabled:bg-white"
          v-model="pcond18"
          disabled />
      </div>
      <div
        class="border-l border-t border-black flex justify-center items-center bg-gray-100">
        비고
      </div>
      <div
        class="col-span-3 border-l border-t border-black flex justify-start items-center pl-2">
        <input
          type="text"
          class="border w-[80%] h-[80%] border-black"
          v-model="pcond19" />
      </div>
      <div></div>
      <div></div>
    </div>
    <div class="flex flex-col">
      <div class="text-red-500 text-base">
        ※사용할 카드번호의 고객정보는 삭제 됩니다. (사용하지 않는 카드의
        고객정보로 사용)
      </div>
      <div class="text-red-500 text-base">
        ※사용할 카드의 고객정보를 유지해야 할 경우 이 프로그램을 사용하시면
        안됩니다.
      </div>
    </div>
  </div>

  <CustomerSearch
    v-if="showPopup"
    @strCCardID="strCCardID"
    @strCustName="strCustName"
    @strMobile="strMobile"
    @strHomeAddr1="strHomeAddr1"
    @lngVisitCnt="lngVisitCnt"
    @lngActAmt="lngActAmt"
    @lngSalePoint="lngSalePoint"
    @lngBonusPoint="lngBonusPoint"
    @lngUsedPoint="lngUsedPoint"
    @lngRemPoint="lngRemPoint"
    @strRemark="strRemark"
    @lngStoreCode="lngStoreCode"
    @lngCustNo="lngCustNo"
    @closePopUp="showPopup = false"></CustomerSearch>

  <!-- 그리드 영역 -->
</template>

<script setup>
import {
  getCardChangeInfo,
  getPointHistoryList,
  mergeCard,
  updateBonusPoint,
} from "@/api/micrm";
import CustomerSearch from "@/components/customerSearch.vue";
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
});

const reload = ref(false);
const rowData = ref([]);
const rowData2 = ref([]);
const afterSearch = ref(false);

const rowData3 = ref([]);
const rowData4 = ref([]);
const condValue = ref(0);
const store = useStore();
const cond = ref(0);
const cond2 = ref("");
const datepicker = ref(null);
const closePopUp = ref(false);
const isfirst = ref(false);
const pcond = ref("");
const pcond2 = ref("");
const pcond3 = ref("");
const pcond4 = ref("");
const pcond5 = ref("");
const pcond6 = ref("");
const pcond7 = ref("");
const pcond8 = ref("");
const pcond9 = ref("");
const pcond10 = ref("");
const pcond11 = ref("");
const pcond12 = ref("");
const pcond13 = ref("");
const pcond14 = ref("");
const pcond15 = ref("");
const pcond16 = ref("");
const pcond17 = ref("");
const pcond18 = ref("");
const pcond19 = ref("");

const showPopup = ref(false);

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

const searchNum = ref(0);

/**
 *  조회 함수
 */

const searchButton = async () => {
  try {
    store.state.loading = true;
    initGrid();
    let res;
    if (cond.value == 0) {
      res = await getCardChangeInfo(
        store.state.userData.lngStoreGroup,
        null,
        cond2.value,
        null
      );
    } else if (cond.value == 1) {
      res = await getCardChangeInfo(
        store.state.userData.lngStoreGroup,
        null,
        null,
        cond2.value
      );
    } else {
      res = await getCardChangeInfo(
        store.state.userData.lngStoreGroup,
        cond2.value,
        null,
        null
      );
    }
    //console.log(res);

    rowData2.value = res.data.List;
    //console.log(res);
    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    //comsole.log(error);
  } finally {
    store.state.loading = false;
  }
};

const selectedStoreCd = ref();
const selectedCustNo = ref();
const selectedStoreCd2 = ref();
const selectedCustNo2 = ref();

const strCCardID = (e) => {
  if (isfirst.value == false) {
    pcond.value = e;
  } else {
    pcond10.value = e;
  }
};
const strCustName = (e) => {
  if (isfirst.value == false) {
    pcond2.value = e;
  } else {
    pcond11.value = e;
  }
};
const strMobile = (e) => {
  if (isfirst.value == false) {
    pcond3.value = e;
  } else {
    pcond12.value = e;
  }
};
const lngVisitCnt = (e) => {
  if (isfirst.value == false) {
    pcond4.value = e;
  } else {
    pcond13.value = e;
  }
};
const lngActAmt = (e) => {
  if (isfirst.value == false) {
    pcond5.value = e;
  } else {
    pcond14.value = e;
  }
};
const lngSalePoint = (e) => {
  if (isfirst.value == false) {
    pcond6.value = e;
  } else {
    pcond15.value = e;
  }
};
const lngBonusPoint = (e) => {
  if (isfirst.value == false) {
    pcond7.value = e;
  } else {
    pcond16.value = e;
  }
};
const lngUsedPoint = (e) => {
  if (isfirst.value == false) {
    pcond8.value = e;
  } else {
    pcond17.value = e;
  }
};
const lngRemPoint = (e) => {
  if (isfirst.value == false) {
    pcond9.value = e;
  } else {
    pcond18.value = e;
  }
};
const strRemark = (e) => {
  //pcond12.value = e;
};
const lngStoreCode = (e) => {
  if (isfirst.value == false) {
    selectedStoreCd.value = e;
  } else {
    selectedStoreCd2.value = e;
  }
};
const lngCustNo = async (e) => {
  if (isfirst.value == false) {
    selectedCustNo.value = e;
  } else {
    selectedCustNo2.value = e;
  }
};

const checkCard = ref(false);

const saveButton = async () => {
  if (selectedCustNo.value == null || selectedCustNo.value == undefined) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });

    return;
  }

  if (selectedCustNo2.value == null || selectedCustNo2.value == undefined) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });

    return;
  }

  if (pcond.value == pcond10.value) {
    Swal.fire({
      title: "경고",
      text: "동일한 카드번호입니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });

    return;
  }

  try {
    store.state.loading = true;
    const res = await mergeCard(
      store.state.userData.lngStoreGroup,
      selectedCustNo.value,
      selectedCustNo2.value,
      pcond.value,
      pcond10.value,
      store.state.userData.lngSequence,
      pcond19.value
    );

    Swal.fire({
      title: "성공",
      text: "카드 이동을 완료하였습니다.",
      icon: "success",
      confirmButtonText: "확인",
    });
  } catch (error) {
  } finally {
    store.state.loading = false;
    initGrid();
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

  pcond10.value = "";
  pcond11.value = "";
  pcond12.value = "";
  pcond13.value = "";
  pcond14.value = "";
  pcond15.value = "";
  pcond16.value = "";
  pcond17.value = "";
  pcond18.value = "";
  pcond19.value = "";
};

//엑셀 버튼 처리 함수
const exportExcel = ref(false);
/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  documentSubTitle.value = selectedDate.value + "\n" + selectedExcelList.value;

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
</script>
