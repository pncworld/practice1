<!-- /*--############################################################################
# Filename : CRM01_013INS.vue                                                  
# Description : 마스터관리 > 직원후불 마스터 > 직원후불 고객정보관리            
# Date :2025-07-09                                                             
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <!-- 조회 부분 -->
  <div class="flex justify-between items-center w-full overflow-y-hidden">
    <PageName></PageName>
    <div class="flex justify-center mr-10 space-x-2 pr-5">
      <button
        @click="receiveButton"
        class="button primary !w-24 !text-nowrap"
        v-if="disableButton">
        정보 수신
      </button>
      <button @click="searchButton" class="button search">조회</button>
      <button @click="saveButton" class="button save" :disabled="disableButton">
        저장
      </button>
      <button @click="exportToExcel" class="button excel">엑셀</button>
    </div>
  </div>
  <div
    class="flex justify-start space-x-5 bg-gray-200 rounded-lg h-16 items-center mt-3">
    <PickCustCompany
      :setAPI="1"
      @excelStore="excelStore"
      @lngIFChk="lngIFChk"
      @BP_ID="BP_ID"
      @lngStoreCode="setCompanyCode"></PickCustCompany>
    <div class="flex items-center justify-center space-x-2">
      <div class="font-semibold text-base">조회조건:</div>
      <div class="pl-2">
        <select
          name=""
          id=""
          class="border border-black w-24 h-8"
          v-model="cond">
          <option value="1">카드번호</option>
          <option value="2">사원번호</option>
          <option value="3">사원명</option>
          <option value="4">부서명</option>
          <option value="5">소속사명</option>
        </select>
      </div>
      <div>
        <input
          type="text"
          class="border border-black w-48 h-8"
          v-model="cond2" />
      </div>

      <div class="flex flex-col justify-center pl-5">
        <div>
          <label for=""
            ><input type="checkbox" checked v-model="cond3" />퇴사자 제외</label
          >
        </div>
        <div>
          <label for=""
            ><input type="checkbox" checked v-model="cond4" />분실/교체
            제외</label
          >
        </div>
      </div>
    </div>
  </div>
  <!-- 조회 부분 -->
  <!-- 그리드 부분 -->
  <div class="h-[32vh] w-full">
    <div class="flex justify-end gap-1 mt-1">
      <button @click="addButton" class="whitebutton" :disabled="disableButton">
        추가
      </button>
      <button
        @click="deleteButton"
        class="whitebutton"
        :disabled="disableButton">
        삭제
      </button>
    </div>
    <Realgrid
      class="w-full h-full mt-2"
      :progname="'CRM01_013INS_VUE'"
      :progid="1"
      :rowData="rowData"
      :showCheckBar="true"
      :checkRowAuto="false"
      @clickedRowData="clickedRowData3"
      @selcetedrowData="selcetedrowData"
      @updatedRowData="updatedRowData"
      @allStateRows="allStateRows"
      @checkedRowData="checkedRowData"
      @sendRowState="sendRowState"
      :valuesData="valuesData"
      :labelsData="labelsData"
      :deleteRow3="deleted"
      :changeColid="changeColid"
      :changeRow="changeRow"
      :changeValue2="changeValue"
      :changeNow2="changeNow"
      @selectedIndex2="selectedIndex2"
      :useCheckboxfordelete="true"
      :addRow4="addRow4"
      :addrowDefault="addrowDefault"
      :addrowProp="addrowProp"
      :addField="'new'"
      :rowStateeditable="false"
      :documentSubTitle="documentSubTitle"
      :documentTitle="'CRM01_013INS'"
      :exporttoExcel="exExcel"></Realgrid>
  </div>
  <!-- 그리드 부분 -->
  <!-- 데이터 부분 -->
  <div class="mt-10">
    <div class="grid grid-cols-[2fr,3fr,2fr,3fr] grid-rows-8 gap-0 w-full">
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center bg rounded-ss-xl bg-gray-100 text-blue-500">
        *카드번호
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-start space-x-4">
        <input
          type="text"
          id="storeCode"
          class="text-sm border rounded-md w-[70%] pl-2 h-7 disabled:bg-gray-300"
          v-model="gridvalue1"
          :disabled="disabled"
          name="strSaleCardNo"
          @input="updateGridValue" />
        <button
          class="whitebutton"
          @click="cardChange"
          :disabled="disableButton">
          카드변경
        </button>
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100">
        한도금액
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-start">
        <input
          type="number"
          id="storeCode"
          class="text-sm border rounded-md w-[70%] pl-2 h-7"
          v-model="gridvalue2"
          name="dblLimitAmt"
          @input="updateGridValue" />
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100 text-blue-500">
        *사원번호
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-start rounded-se-xl">
        <input
          type="text"
          id="storeCode"
          class="text-sm border rounded-md w-[70%] pl-2 h-7 disabled:bg-gray-300"
          v-model="gridvalue3"
          :disabled="disabled"
          name="strSaleCustID"
          @input="updateGridValue" />
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100">
        사용금액
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-start">
        <input
          type="text"
          id="storeCode"
          class="text-sm border rounded-md w-[70%] pl-2 h-7"
          v-model="gridvalue4"
          disabled
          name="dblSaleAmt"
          @input="updateGridValue" />
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100 text-blue-500">
        *사원명
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-start">
        <input
          type="text"
          id="storeCode"
          class="text-sm border rounded-md w-[70%] pl-2 h-7 disabled:bg-gray-300"
          v-model="gridvalue5"
          name="strSaleCustName"
          @input="updateGridValue" />
      </div>

      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100">
        잔여금액
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-start">
        <input
          type="text"
          id="storeCode"
          class="text-sm border rounded-md w-[70%] pl-2 h-7"
          v-model="gridvalue6"
          disabled
          name="dblRemAmt"
          @input="updateGridValue" />
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100">
        전화번호
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-start">
        <input
          type="text"
          id="storeCode"
          class="text-sm border rounded-md w-[70%] pl-2 h-7"
          v-model="gridvalue7"
          name="strTelNo"
          @input="updateGridValue" />
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100">
        등록일자
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-start">
        <input
          type="text"
          name="dtmInsDateTime"
          v-model="gridvalue8"
          class="text-sm border rounded-md w-[70%] pl-2 h-7"
          disabled />
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100">
        소속사코드
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-start">
        <input
          type="text"
          id="storeCode"
          class="text-sm border rounded-md w-[70%] pl-2 h-7"
          v-model="gridvalue9"
          name="strCustCompCode"
          @input="updateGridValue" />
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100">
        퇴사여부
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center space-x-5">
        <label for="cond"
          ><input
            type="radio"
            v-model="gridvalue10"
            name="strSaleCustStatus"
            @input="updateGridValue"
            id="cond"
            :disabled="!disabled"
            value="0" />정상</label
        >
        <label for="cond2"
          ><input
            type="radio"
            v-model="gridvalue10"
            name="strSaleCustStatus"
            @input="updateGridValue"
            id="cond2"
            value="1" />퇴사</label
        >
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100">
        소속사명
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-start">
        <input
          type="text"
          id="storeCode"
          class="border rounded-md w-[70%] h-7 pl-2"
          v-model="gridvalue11"
          name="strCustCompName"
          @input="updateGridValue" />
      </div>

      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100">
        사원카드 분실여부
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center space-x-5">
        <label for="cond4"
          ><input
            type="radio"
            name="strSaleCardStatus"
            id="cond4"
            disabled
            value="0"
            v-model="gridvalue12" />정상</label
        >
        <label for="cond5"
          ><input
            type="radio"
            name="strSaleCardStatus"
            id="cond5"
            disabled
            value="1"
            v-model="gridvalue12" />교체</label
        >
        <label for="cond6"
          ><input
            type="radio"
            name="strSaleCardStatus"
            id="cond6"
            disabled
            value="2"
            v-model="gridvalue12" />분실</label
        >
      </div>

      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100">
        부서코드
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-start">
        <input
          type="text"
          id="storeCode"
          class="border rounded-md w-[70%] h-7 pl-2"
          v-model="gridvalue13"
          name="strCustDeptCode"
          @input="updateGridValue" />
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100">
        주소
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-start">
        <input
          type="text"
          id="storeCode"
          class="border text-sm rounded-md w-[70%] p-2 h-7 pl-2"
          v-model="gridvalue14"
          name="strAddress"
          @input="updateGridValue" />
      </div>

      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100">
        부서명
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-start">
        <input
          type="text"
          id="storeCode"
          class="border text-sm rounded-md w-[70%] p-2 h-7 pl-2"
          v-model="gridvalue15"
          name="strCustDeptName"
          @input="updateGridValue" />
      </div>
    </div>
  </div>

  <div class="text-base font-semibold">※후불 고객 정보 엑셀 업로드</div>
  <div class="flex justify-start items-center pl-10">
    <span class="text-base font-semibold">파일</span>
    <button
      @click="beforeFileSelect"
      class="whitebutton bg-white ml-10"
      :disabled="disableButton">
      파일 업로드
    </button>
    <button
      class="whitebutton bg-white ml-10"
      @click="getExcelFiles"
      :disabled="disableButton">
      엑셀파일 불러오기
    </button>
    <span class="font-semibold text-base ml-10">Sheet</span>
    <div>
      <select
        name=""
        id=""
        class="w-32 h-8 ml-5 border border-gray-400"
        v-model="excelcond">
        <option :value="i.lngCode" v-for="i in SheetList">
          {{ i.strName }}
        </option>
      </select>
    </div>
    <div class="pl-10">
      <button
        class="whitebutton !bg-blue-500 !text-white"
        @click="saveButton3"
        :disabled="disableButton">
        업로드
      </button>
    </div>
  </div>
  <button class="whitebutton ml-20 mt-10" @click="downloadFile">
    샘플 다운로드
  </button>
  <div
    v-if="visible"
    class="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
    <div class="bg-white rounded-2xl shadow-lg p-6 w-[30vw] h-[40vh]">
      <h2 class="text-lg font-bold mb-4 text-center">
        직원후불 고객카드 변경(분실/교체)
      </h2>
      <div
        class="grid grid-rows-[1fr,1fr,1fr,1fr,1fr] grid-cols-[1fr,3fr] h-[60%]">
        <div
          class="text-base font-semibold border-l border-t border-black flex justify-center items-center bg-gray-100">
          사원명
        </div>
        <div
          class="text-base font-semibold border-l border-t border-black flex justify-start pl-3 items-center">
          <input
            type="text"
            class="border border-black h-[80%] w-[80%]"
            v-model="pcond"
            disabled />
        </div>
        <div
          class="text-base font-semibold border-l border-t border-black flex justify-center bg-gray-100 items-center">
          사원번호
        </div>
        <div
          class="text-base font-semibold border-l border-t border-black flex justify-start pl-3 items-center">
          <input
            type="number"
            class="border border-black h-[80%] w-[80%]"
            v-model="pcond2"
            disabled />
        </div>
        <div
          class="text-base font-semibold border-l border-t border-black flex justify-center items-center bg-gray-100">
          현재 카드번호
        </div>
        <div
          class="text-base font-semibold border-l border-t border-black flex justify-start pl-3 items-center">
          <input
            type="number"
            class="border border-black h-[80%] w-[80%]"
            v-model="pcond3"
            disabled />
        </div>
        <div
          class="text-base font-semibold border-l border-t border-black flex justify-center bg-gray-100 items-center">
          신규 카드번호
        </div>
        <div
          class="text-base font-semibold border-l border-t border-black flex justify-start pl-3 items-center">
          <input
            type="number"
            class="border border-black h-[80%] w-[80%]"
            v-model="pcond4" />
        </div>
        <div
          class="text-base font-semibold border-l border-t border-black flex justify-center bg-gray-100 items-center">
          변경 유형
        </div>
        <div
          class="text-base font-semibold border-l border-t border-black flex justify-start pl-5 space-x-5 items-center">
          <label for="change"
            ><input
              type="radio"
              id="change"
              v-model="pcond5"
              value="1" />교체</label
          >
          <label for="change2"
            ><input
              type="radio"
              id="change2"
              v-model="pcond5"
              value="2" />분실</label
          >
        </div>
      </div>

      <div class="flex space-x-2">
        <button
          class="mt-4 w-full bg-gray-800 text-white py-2 rounded-xl"
          @click="saveButton2">
          저장
        </button>

        <button
          class="mt-4 w-full bg-gray-800 text-white py-2 rounded-xl"
          @click="visible = false">
          닫기
        </button>
      </div>
    </div>
  </div>

  <div
    v-if="openpopup2"
    class="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
    <div class="bg-white rounded-2xl shadow-lg p-6 w-[30vw] h-[40vh]">
      <h2 class="text-lg font-bold mb-4 text-center">고객정보 수신 작업</h2>
      <div
        class="grid grid-rows-[1fr,1fr,1fr,1fr,1fr] grid-cols-[1fr,3fr] h-[60%]">
        <div
          class="text-base font-semibold border-l border-t border-black flex justify-center items-center bg-gray-100">
          사업장명
        </div>
        <div
          class="text-base font-semibold border-l border-t border-black flex justify-start pl-3 items-center">
          <input
            type="text"
            class="border border-black h-[80%] w-[80%]"
            v-model="p2cond"
            disabled />
        </div>
        <div
          class="text-base font-semibold border-l border-t border-black flex justify-center bg-gray-100 items-center">
          수신유형
        </div>
        <div
          class="text-base font-semibold border-l border-t border-black flex justify-start pl-3 items-center space-x-3">
          <label for="p2cond2"
            ><input
              type="radio"
              v-model="p2cond2"
              value="1"
              id="p2cond2" />수정내역 수신</label
          >
          <label for="p2cond22"
            ><input
              type="radio"
              v-model="p2cond2"
              value="0"
              id="p2cond22" />전체 수신</label
          >
        </div>
        <div
          class="text-base font-semibold border-l border-t border-b border-black flex justify-center items-center bg-gray-100">
          수정일자
        </div>
        <div
          class="text-base font-semibold border-l border-t border-b border-black flex justify-start pl-3 items-center">
          <input
            type="date"
            class="border border-black"
            v-model="p2cond3"
            :disabled="disabled2" />
        </div>
      </div>

      <div class="flex space-x-2">
        <button
          class="mt-4 w-full bg-gray-800 text-white py-2 rounded-xl"
          @click="receiveButton2">
          수신
        </button>

        <button
          class="mt-4 w-full bg-gray-800 text-white py-2 rounded-xl"
          @click="openpopup2 = false">
          닫기
        </button>
      </div>
    </div>
  </div>

  <input
    type="file"
    ref="fileInput"
    accept=".xls,.xlsx"
    class="hidden"
    @change="handleFileChange" />
  <!-- 데이터 부분 -->
</template>

<script setup>
import { setEmployeeInfo, setEmployeeInfo2 } from "@/api/etc";
import {
  deleteCustomors2,
  getAccCust,
  saveCustomorsInfo,
  saveEmployeeCustInfo,
} from "@/api/micrm";
/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
import PickCustCompany from "@/components/pickCustCompany.vue";
/**
 * 매장 공통 컴포넌트
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

import { nextTick, onMounted, ref, watch } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";
import { read, utils } from "xlsx-js-style";
/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  if (store.state.userData.lngStoreGroup == "3069") {
    showReceive.value = true;
  }
});

const disableButton = ref(false);
const store = useStore();
const groupCd = ref();

const disableStoreCode = ref(true);
/**
 * 추가 버튼 함수
 */

const addRow4 = ref(false);
const labelsData = ref([]);
const valuesData = ref([]);
const afterSearch = ref(false);
const storeType = ref("0");

/**
 * 페이지 매장 코드 세팅
 */

/**
 * 페이지 매장 그룹 세팅
 */

const gridvalue1 = ref("");
const gridvalue2 = ref("");
const gridvalue3 = ref("");
const gridvalue4 = ref("");
const gridvalue5 = ref("");
const gridvalue6 = ref("");
const gridvalue7 = ref("");
const gridvalue8 = ref("");
const gridvalue9 = ref("");
const gridvalue10 = ref("0");
const gridvalue11 = ref("");
const gridvalue12 = ref("");
const gridvalue13 = ref("");
const gridvalue14 = ref("");
const gridvalue15 = ref("");
const gridvalue16 = ref("");
const gridvalue17 = ref("");

const openCardChange = ref(false);
const exExcel = ref(false);
const exExcelNm = ref("매장정보등록");
/**
 * 엑셀 Export 버튼
 */
const documentSubTitle = ref("");

const excelStore = (e) => {
  documentSubTitle.value = e;
  p2cond.value = e.split("사업장명 : ")[1];

  documentSubTitle.value += "\n" + "조회조건 :";
  documentSubTitle.value +=
    (cond3.value == true ? "퇴사자 제외 ," : "" + " , ") +
    (cond4.value == true ? "분실/교체 제외" : "");

  //console.log(p2cond.value);
};
const exportToExcel = () => {
  exExcel.value = !exExcel.value;
};

// API 호출 (설정값 호출)

const rowData = ref([]);

/**
 * 페이지 매장 분류 세팅
 */

/**
 * 페이지 매장 슈퍼바이저 세팅
 */

const initlngMultiPriceGroupCode = ref(-1);

const showReceive = ref(false);
/**
 *  조회 함수
 */
const cond = ref(1);
const cond2 = ref("");
const cond3 = ref(true);
const cond4 = ref(true);
const disabled = ref(true);
const disabled2 = ref(false);
const searchButton = async () => {
  if (CompanyCode.value == 0) {
    Swal.fire({
      title: "경고",
      text: "사업장명을 먼저 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  try {
    initGrid();
    store.state.loading = true;
    let pcond = "";
    let pcond2 = "";
    let pcond3 = "";
    let pcond4 = "";
    let pcond5 = "";

    if (cond.value == 1) {
      pcond = cond2.value;
    } else if (cond.value == 2) {
      pcond2 = cond2.value;
    } else if (cond.value == 3) {
      pcond3 = cond2.value;
    } else if (cond.value == 4) {
      pcond4 = cond2.value;
    } else if (cond.value == 5) {
      pcond5 = cond2.value;
    }
    let pcond6 = "0";
    if (cond3.value == true && cond4.value == true) {
      pcond6 = "12";
    } else if (cond3.value == false && cond4.value == true) {
      pcond6 = "2";
    } else if (cond3.value == true && cond4.value == false) {
      pcond6 = "1";
    } else {
      pcond6 = "0";
    }
    const res = await getAccCust(
      CompanyCode.value,
      pcond,
      pcond2,
      pcond3,
      pcond4,
      pcond5,
      pcond6
    );

    rowData.value = res.data.List;
    store.state.loading = false;
    afterSearch.value = true;
  } catch (error) {
  } finally {
    store.state.loading = false;
  }
};

const openpopup2 = ref(false);
const receiveButton = async (e) => {
  if (currIFCHK.value == 1) {
    //http://www.pncoffice.com:8081/CJFWBaeminEmpSaleService.asmx/GET_EMP_CUST_LIST
    openpopup2.value = true;
    const currDate = new Date().toISOString().split("T")[0];
    p2cond3.value = currDate;
  } else if (currIFCHK.value == 2) {
    const currDate = new Date().toISOString().split("T")[0];
    try {
      store.state.loading = true;
      const res = await setEmployeeInfo(
        CompanyCode.value,
        currDate,
        store.state.userData.lngSequence
      );

      store.state.loading = false;
      if (res.data.d == "success") {
        Swal.fire({
          title: "성공",
          text: "수신을 성공하였습니다.",
          icon: "success",
          confirmButtonText: "확인",
        });
        return;
      } else {
        Swal.fire({
          title: "실패",
          text: "수신에 실패하였습니다. 피앤시월드로 문의해주세요.",
          icon: "error",
          confirmButtonText: "확인",
        });
        return;
      }
    } catch (error) {}
  }
};

const receiveButton2 = async () => {
  // strRcvID , strDate , strRegID , strBpID
  const currDate = new Date().toISOString().split("T")[0];
  let regId = "";
  if (p2cond2.value == 0) {
    regId = "";
  } else {
    regId = p2cond3.value;
  }
  const res = await setEmployeeInfo2(
    CompanyCode.value,
    currDate,
    store.state.userData.lngSequence,
    regId,
    currBPID.value
  );
  openpopup2.value = false;
  if (res.data.d == "성공했습니다.") {
    Swal.fire({
      title: "성공",
      text: "수신 완료하였습니다.",
      icon: "success",
      confirmButtonText: "확인",
    });
    return;
  } else {
    Swal.fire({
      title: "실패",
      text: "수신에 실패하였습니다. 피앤시월드로 문의 바랍니다.",
      icon: "error",
      confirmButtonText: "확인",
    });
    return;
  }
};
const deleted = ref(false);

/**
 * 삭제 버튼
 */

const addrowDefault = ref("");
const addrowProp = ref("");
/**
 *  추가 버튼
 */
const CompanyCode = ref("");
const setCompanyCode = (e) => {
  CompanyCode.value = e;
};

const addButton = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 진행해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  addrowProp.value = `strSaleCardNo,strSaleCustID,strSaleCustName,strTelNo,strCustCompCode,strCustCompName,strCustDeptCode,strCustDeptName,strAddress,dtmInsDateTime,strSaleCustStatusTxt,strSaleCardStatusTxt,dblLimitAmt,dblSaleAmt,dblRemAmt,strSaleCustStatus,strSaleCardStatus,strLimitModify`;
  const currdate = new Date().toISOString().split("T")[0];
  addrowDefault.value = `,,,,,,,,,${currdate},정상,정상,0,0,0,0,0,0`;

  addRow4.value = !addRow4.value;
};

const deleteButton = () => {
  deleted.value = !deleted.value;
};
/**
 *  저장 버튼 함수
 */

const saveButton = async () => {
  try {
    store.state.loading = true;
    if (checkedRows.value.length > 0) {
      const compcds = checkedRows.value
        .map((item) => item.strSaleCustID)
        .join("\u200b");
      const cardNos = checkedRows.value
        .map((item) => item.strSaleCardNo)
        .join("\u200b");

      const res = await deleteCustomors2(
        CompanyCode.value,
        compcds,
        cardNos,
        store.state.userData.lngSequence,
        ""
      );
      console.log(res);
    }

    const custids = updateRowData.value
      .filter(
        (item, index) =>
          stateRows.value.updated.includes(index) ||
          stateRows.value.created.includes(index)
      )
      .map((item) => item.strSaleCustID)
      .join("\u200b");
    const limitAmt = updateRowData.value
      .filter(
        (item, index) =>
          stateRows.value.updated.includes(index) ||
          stateRows.value.created.includes(index)
      )
      .map((item) => item.dblLimitAmt)
      .join("\u200b");
    const custStatus = updateRowData.value
      .filter(
        (item, index) =>
          stateRows.value.updated.includes(index) ||
          stateRows.value.created.includes(index)
      )
      .map((item) => item.strSaleCustStatus)
      .join("\u200b");
    const cardStatus = updateRowData.value
      .filter(
        (item, index) =>
          stateRows.value.updated.includes(index) ||
          stateRows.value.created.includes(index)
      )
      .map((item) => item.strSaleCardStatus)
      .join("\u200b");
    const cardNos = updateRowData.value
      .filter(
        (item, index) =>
          stateRows.value.updated.includes(index) ||
          stateRows.value.created.includes(index)
      )
      .map((item) => item.strSaleCardNo)
      .join("\u200b");
    const custNms = updateRowData.value
      .filter(
        (item, index) =>
          stateRows.value.updated.includes(index) ||
          stateRows.value.created.includes(index)
      )
      .map((item) => item.strSaleCustName)
      .join("\u200b");
    const deptCds = updateRowData.value
      .filter(
        (item, index) =>
          stateRows.value.updated.includes(index) ||
          stateRows.value.created.includes(index)
      )
      .map((item) => item.strCustDeptCode)
      .join("\u200b");
    const deptNms = updateRowData.value
      .filter(
        (item, index) =>
          stateRows.value.updated.includes(index) ||
          stateRows.value.created.includes(index)
      )
      .map((item) => item.strCustDeptName)
      .join("\u200b");
    const telNos = updateRowData.value
      .filter(
        (item, index) =>
          stateRows.value.updated.includes(index) ||
          stateRows.value.created.includes(index)
      )
      .map((item) => item.strTelNo)
      .join("\u200b");
    const compCds = updateRowData.value
      .filter(
        (item, index) =>
          stateRows.value.updated.includes(index) ||
          stateRows.value.created.includes(index)
      )
      .map((item) => item.strCustCompCode)
      .join("\u200b");
    const compNms = updateRowData.value
      .filter(
        (item, index) =>
          stateRows.value.updated.includes(index) ||
          stateRows.value.created.includes(index)
      )
      .map((item) => item.strCustCompName)
      .join("\u200b");
    const address = updateRowData.value
      .filter(
        (item, index) =>
          stateRows.value.updated.includes(index) ||
          stateRows.value.created.includes(index)
      )
      .map((item) => item.strAddress)
      .join("\u200b");
    const res = await saveCustomorsInfo(
      CompanyCode.value,
      custids,
      limitAmt,
      custStatus,
      cardStatus,
      cardNos,
      custNms,
      deptCds,
      deptNms,
      telNos,
      compCds,
      compNms,
      address,
      store.state.userData.lngSequence
    );
    console.log(res);
    if (res.data.RESULT_CD == "00") {
      Swal.fire({
        title: "성공",
        text: `저장이 완료되었습니다.`,
        icon: "success",
        confirmButtonText: "확인",
      });
      return;
    }
  } catch (error) {
  } finally {
    store.state.loading = false;
    searchButton();
  }
};

const saveButton2 = async () => {
  try {
    store.state.loading = true;
    const res = await saveEmployeeCustInfo(
      CompanyCode.value,
      pcond2.value,
      pcond3.value,
      pcond4.value,
      pcond5.value,
      store.state.userData.lngSequence
    );
    console.log(res);

    if (res.data.List[0].strErr == "0000") {
      Swal.fire({
        title: "성공",
        text: `${res.data.List[0].strErrMsg}`,
        icon: "success",
        confirmButtonText: "확인",
      });
      return;
    } else {
      Swal.fire({
        title: "실패",
        text: `${res.data.List[0].strErrMsg} 피앤시월드로 문의부탁드립니다.`,
        icon: "error",
        confirmButtonText: "확인",
      });
      return;
    }
  } catch (error) {
  } finally {
    store.state.loading = false;
    visible.value = false;
  }
};

const saveButton3 = async () => {
  try {
    store.state.loading = true;

    const custids = updateRowData.value
      .map((item) => item.strSaleCustID)
      .join("\u200b");
    const limitAmt = updateRowData.value
      .map((item) => item.dblLimitAmt)
      .join("\u200b");
    const custStatus = updateRowData.value
      .map((item) => item.strSaleCustStatus)
      .join("\u200b");
    const cardStatus = updateRowData.value
      .map((item) => item.strSaleCardStatus)
      .join("\u200b");
    const cardNos = updateRowData.value
      .map((item) => item.strSaleCardNo)
      .join("\u200b");
    const custNms = updateRowData.value
      .map((item) => item.strSaleCustName)
      .join("\u200b");
    const deptCds = updateRowData.value
      .map((item) => item.strCustDeptCode)
      .join("\u200b");
    const deptNms = updateRowData.value
      .map((item) => item.strCustDeptName)
      .join("\u200b");
    const telNos = updateRowData.value
      .map((item) => item.strTelNo)
      .join("\u200b");
    const compCds = updateRowData.value
      .map((item) => item.strCustCompCode)
      .join("\u200b");
    const compNms = updateRowData.value
      .map((item) => item.strCustCompName)
      .join("\u200b");
    const address = updateRowData.value
      .map((item) => item.strAddress)
      .join("\u200b");
    const res = await saveCustomorsInfo(
      CompanyCode.value,
      custids,
      limitAmt,
      custStatus,
      cardStatus,
      cardNos,
      custNms,
      deptCds,
      deptNms,
      telNos,
      compCds,
      compNms,
      address,
      store.state.userData.lngSequence
    );
    console.log(res);
    if (res.data.RESULT_CD == "00") {
      Swal.fire({
        title: "성공",
        text: `저장이 완료되었습니다.`,
        icon: "success",
        confirmButtonText: "확인",
      });
      return;
    }
  } catch (error) {
  } finally {
    store.state.loading = false;
    searchButton();
  }
};

/**
 * 수정용 데이터 행 설정
 */

const selectedIndex2 = (e) => {
  changeRow.value = e;
};
/**
 * 데이터셋 상세정보 셋팅
 */

const clickedRowData3 = (e) => {
  console.log(e);
  gridvalue1.value = e[0];
  gridvalue2.value = e[12];
  gridvalue3.value = e[1];
  gridvalue4.value = e[13];
  gridvalue5.value = e[2];
  gridvalue6.value = e[14];
  gridvalue7.value = e[3];
  gridvalue8.value = e[9].toISOString().split("T")[0];
  gridvalue9.value = e[4];
  gridvalue10.value = e[15];
  gridvalue11.value = e[5];
  gridvalue12.value = e[16];
  gridvalue13.value = e[6];
  gridvalue14.value = e[8];
  gridvalue15.value = e[7];
};
/**
 * 페이지 매장 코드 세팅
 */
const visible = ref(false);
const cardChange = (e) => {
  if (openCardChange.value == false) {
    return;
  }
  visible.value = !visible.value;

  pcond.value = gridvalue5.value;
  pcond2.value = gridvalue3.value;
  pcond3.value = gridvalue1.value;

  pcond5.value = 1;
};

const pcond = ref("");
const pcond2 = ref("");
const pcond3 = ref("");
const pcond4 = ref("");
const pcond5 = ref("");
/**
 * 페이지 매장 분류 세팅
 */

const dtmOpenDate = ref(new Date().toISOString().split("T")[0]);

/**
 * 페이지 매장 슈퍼바이저 세팅
 */

const dtmStop = ref(new Date("9999-12-31").toISOString().split("T")[0]);

const changeValue = ref();
const changeRow = ref();
const changeColid = ref();
const changeNow = ref(false);
const updateGridValue = async (e) => {
  const name = e.target.name;
  const value = e.target.value;

  if (name == "strSaleCustStatus") {
    console.log(value);
    changeColid.value = "strSaleCustStatusTxt";
    changeValue.value = value == 0 ? "정상" : "퇴사";
    changeNow.value = !changeNow.value;
    await nextTick();
  }

  // if (name == "strSaleCardStatus") {
  //   changeColid.value = "strSaleCardStatusTxt";
  //   changeValue.value = value == 0 ? "정상" : value == 1 ? "교체" : "분실";
  //   changeNow.value = !changeNow.value;
  //   await nextTick();
  // }
  changeColid.value = name;
  changeValue.value = value;
  changeNow.value = !changeNow.value;
};
const updateRowData = ref([]);

/**
 * 입력창 수정 데이터 갱신
 */
const stateRows = ref([]);
const allStateRows = (e) => {
  console.log(e);
  stateRows.value = e;
};

const sendRowState = (e) => {
  if (e == "created") {
    disabled.value = false;
    openCardChange.value = false;
  } else {
    disabled.value = true;
    openCardChange.value = true;
  }
};

const checkedRows = ref([]);
const checkedRowData = (e) => {
  console.log(e);

  checkedRows.value = e;
};
const updatedRowData = (newvalue) => {
  updateRowData.value = newvalue;
  console.log(updateRowData.value);
};

watch(dtmOpenDate, () => {
  //comsole.log(dtmOpenDate.value);
});
watch(dtmStop, () => {
  //comsole.log(dtmStop.value);
});

const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
  gridvalue1.value = "";
  gridvalue2.value = "";
  gridvalue3.value = "";
  gridvalue4.value = "";
  gridvalue5.value = "";
  gridvalue6.value = "";
  gridvalue7.value = "";
  gridvalue8.value = "";
  gridvalue9.value = "";
  gridvalue10.value = "0";
  gridvalue11.value = "";
  gridvalue12.value = "1";
  gridvalue13.value = "";
  gridvalue14.value = "";
  gridvalue15.value = "";

  openCardChange.value = false;

  SheetList.value = [];
  fileInput.value = null;
};
const fileInput = ref(null);
const SheetList = ref([]);
const beforeFileSelect = () => {
  // 여기서 점검: 권한, 사용자 상태 등
  if (CompanyCode.value == 0) {
    return;
  }
  fileInput.value.click();
};

const excelcond = ref(1);
const handleFileChange = async (e) => {
  const file = e.target.files[0];
  console.log(file);
  currentFile.value = file;
  excelcond.value = 1;

  if (file) {
    const arrayBuffer = await file.arrayBuffer();
    // XLSX 라이브러리에서 arrayBuffer 사용 가능
    const workbook = read(arrayBuffer, { type: "array" });

    const sheetLength = workbook.SheetNames.length;

    for (let i = 0; i < sheetLength; i++) {
      SheetList.value.push({ lngCode: i + 1, strName: "시트" + (i + 1) });
    }

    const result = await readFileWithArrayBuffer(file);
    console.log(result);
  }
};

const currentFile = ref();

const getExcelFiles = () => {
  if (currentFile.value == null || currentFile.value == undefined) {
    return;
  }
  readFileWithArrayBuffer(currentFile.value);
};

async function readFileWithArrayBuffer(file) {
  const arrayBuffer = await file.arrayBuffer();
  // XLSX 라이브러리에서 arrayBuffer 사용 가능
  const workbook = read(arrayBuffer, { type: "array" });

  const sheetName = workbook.SheetNames[excelcond.value - 1];
  const sheet = workbook.Sheets[sheetName];
  const jsonData = utils.sheet_to_json(sheet, { header: 1 });

  const header = [
    "strSaleCardNo",
    "strSaleCustID",
    "strSaleCustName",
    "strTelNo",
    "strCustCompCode",
    "strCustCompName",
    "strCustDeptCode",
    "strCustDeptName",
    "dblLimitAmt",
  ];

  const rows = jsonData.slice(1); // 실제 데이터 행들

  rowData.value = rows.map((row) => {
    const obj = {};
    header.forEach((key, i) => {
      obj[key] = row[i];
    });
    return obj;
  });

  updateRowData.value = JSON.parse(JSON.stringify(rowData.value));
  console.log(updateRowData.value);
  return jsonData;
}

const downloadFile = () => {
  const link = document.createElement("a");
  link.href = "/SaleCustList.xls"; // public 폴더 또는 정적 자원 경로
  link.download = "SaleCustList.xls";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const currIFCHK = ref(0);
const currBPID = ref(0);
const lngIFChk = (e) => {
  currIFCHK.value = e;
  if (e == 0) {
    disableButton.value = false;
  } else if (e == 1 || e == 2) {
    disableButton.value = true;
  }
};
const BP_ID = (e) => {
  console.log(e);
  currBPID.value = e;
};

const p2cond = ref("");
const p2cond2 = ref("1");
const p2cond3 = ref("");

watch(p2cond2, () => {
  if (p2cond2.value == 1) {
    disabled2.value = false;
  } else {
    disabled2.value = true;
  }
});
</script>

<style></style>
