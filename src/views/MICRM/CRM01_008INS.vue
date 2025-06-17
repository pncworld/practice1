<!-- /*--############################################################################
# Filename : CRM01_008INS.vue                                                  
# Description : 고객관리 > 고객 신상 정보 > 고객 카드 교체                      
# Date :2025-06-17                                                             
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
    <span class="text-red-500"
      >※기존카드에서 미등록 신규카드로만 교체가능합니다.</span
    >
    <div
      class="grid grid-rows-[1fr,1fr,1fr,1fr,1fr,1fr,1fr,2fr] grid-cols-[1fr,3fr,1fr,3fr] w-[60vw] h-[30vh]">
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
        <button class="whitebutton" @click="showPopup = true">조회</button>
      </div>
      <div class="col-span-1"></div>
      <div></div>
      <div
        class="border-l border-t border-black flex justify-center items-center bg-gray-100">
        신규카드번호
      </div>
      <div
        class="border-l border-t border-black flex justify-start items-center pl-2 col-span-1">
        <input
          type="text"
          class="border border-black"
          v-model="pcond2"
          @input="checkCard = false" />
        <button class="whitebutton" @click="checkCardNo">조회</button>

        <!-- <span class="text-red-500 text-nowrap"
          >사용 가능한 카드번호입니다.</span
        > -->
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
          v-model="pcond3"
          disabled />
      </div>
      <div
        class="border-l border-t border-black flex justify-center items-center bg-gray-100">
        카드변경사유
      </div>
      <div
        class="border-l border-t border-black flex justify-start items-center pl-2">
        <select name="" id="" class="border border-black" v-model="pcond4">
          <option value="0">카드사용중지</option>
          <option value="1">카드분실</option>
          <option value="2">카드손상</option>
          <option value="3">기타</option>
          <option value="4">이관복구</option>
          <option value="5">회원탈퇴</option>
        </select>
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
          v-model="pcond5"
          disabled />
      </div>
      <div class="col-span-1 border-l border-t border-black"></div>
      <div class="border-t border-black"></div>
      <div
        class="border-l border-t border-black flex justify-center items-center bg-gray-100">
        방문횟수
      </div>
      <div
        class="border-l border-t border-black flex justify-start items-center pl-2">
        <input
          type="text"
          class="border border-black disabled:bg-white"
          v-model="pcond6"
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
          v-model="pcond7"
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
          v-model="pcond8"
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
          v-model="pcond9"
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
          v-model="pcond10"
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
          v-model="pcond11"
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
          v-model="pcond12" />
      </div>
      <div></div>
      <div></div>
    </div>
    <div class="grid grid-rows-1 grid-cols-1 w-full h-[45vh]">
      <Realgrid
        :progname="'CRM01_008INS_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :rowStateeditable="false">
      </Realgrid>
    </div>
  </div>

  <div
    v-if="showPopup"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <!-- 팝업 박스 -->
    <div class="bg-white rounded-xl p-6 w-[35vw] h-[30vh] shadow-lg relative">
      <h2 class="text-xl font-bold mb-4">카드번호 검색</h2>
      <div class="grid grid-rows-[1fr,7fr] grid-cols-1 items-center w-[90%]">
        <div class="grid grid-rows-1 grid-cols-[1fr,4fr,1fr]">
          <div
            class="border-l border-t flex justify-center items-center border-black">
            검색
          </div>
          <div
            class="flex border-l border-t border-black justify-center items-center space-x-2">
            <select
              name=""
              id=""
              class="flex border-black border items-center justify-center"
              v-model="cond">
              <option value="0">카드번호</option>
              <option value="1">고객명</option>
              <option value="2">휴대폰</option>
            </select>
            <input
              type="text"
              class="border border-black"
              v-model="cond2"
              @keydown.enter="searchButton" />
          </div>
          <div class="flex border-l border-t border-black space-x-2 pl-2">
            <button class="whitebutton" @click="searchButton">조회</button
            ><button class="whitebutton" @click="showPopup = false">
              닫기
            </button>
          </div>
        </div>
        <div class="h-full w-full">
          <Realgrid
            :progname="'CRM01_008INS_VUE'"
            :progid="2"
            :rowData="rowData2"
            @dblclickedRowData="dblclickedRowData"
            :rowStateeditable="false"></Realgrid>
        </div>
      </div>
    </div>
  </div>

  <!-- 그리드 영역 -->
</template>

<script setup>
import {
  changeCardNo,
  getCardChangeInfo,
  getCardChangeList,
  validCardNo,
} from "@/api/micrm";
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

const pcond = ref();
const pcond2 = ref();
const pcond3 = ref();
const pcond4 = ref(0);
const pcond5 = ref();
const pcond6 = ref();
const pcond7 = ref();
const pcond8 = ref();
const pcond9 = ref();
const pcond10 = ref();
const pcond11 = ref();
const pcond12 = ref();

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
    console.log(res);

    rowData2.value = res.data.List;
    console.log(res);
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
const dblclickedRowData = async (e) => {
  //console.log(e);
  pcond.value = e[0];
  pcond3.value = e[1];
  pcond5.value = e[2];
  pcond6.value = e[4];
  pcond7.value = e[5];
  pcond8.value = e[6];
  pcond9.value = e[7];
  pcond10.value = e[8];
  pcond11.value = e[9];
  pcond12.value = e[10];
  selectedStoreCd.value = e[11];
  selectedCustNo.value = e[12];
  showPopup.value = false;

  try {
    store.state.loading = true;
    const res = await getCardChangeList(
      store.state.userData.lngStoreGroup,
      e[12]
    );

    rowData.value = res.data.List;
  } catch (error) {
  } finally {
    store.state.loading = false;
  }
};

const checkCard = ref(false);
const checkCardNo = async () => {
  if (pcond2.value.length != 16) {
    Swal.fire({
      title: "경고",
      text: "카드번호 16자리를 입력해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  try {
    const res = await validCardNo(
      store.state.userData.lngStoreGroup,
      pcond2.value
    );

    if (res.data.List[0].lngCustNo == "") {
      Swal.fire({
        title: "확인",
        text: "사용가능한 카드번호입니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
      checkCard.value = true;
      return;
    } else {
      Swal.fire({
        title: "경고",
        text: "이미 사용중인 카드번호입니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      checkCard.value = false;
      return;
    }
  } catch (error) {}
};

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

  if (checkCard.value == false) {
    Swal.fire({
      title: "경고",
      text: "카드 중복검사를 먼저 해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });

    return;
  }

  try {
    store.state.loading = true;
    const res = await changeCardNo(
      store.state.userData.lngStoreGroup,
      selectedStoreCd.value,
      store.state.userData.lngSequence,
      selectedCustNo.value,
      pcond.value,
      pcond2.value,
      pcond4.value,
      pcond12.value
    );
    console.log(res);
    Swal.fire({
      title: "성공",
      text: "카드 번호 변경 완료하였습니다.",
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
  pcond.value = "";
  pcond2.value = "";
  pcond3.value = "";
  pcond4.value = "0";
  pcond5.value = "";
  pcond6.value = "";
  pcond7.value = "";
  pcond8.value = "";
  pcond9.value = "";
  pcond10.value = "";
  pcond11.value = "";
  pcond12.value = "";
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
