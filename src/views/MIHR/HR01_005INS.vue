/*--############################################################################
# Filename : HR01_005INS.vue                                                    
# Description : 인사관리 > 마스터 관리 > 근무계약 등록.                        
# Date :2025-06-11                                                             
# Author : 권맑음                     
################################################################################*/
<template>
  <!-- 조회 조건 -->
  <div class="h-[80%]">
    <div class="flex justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center mr-10 space-x-2 pr-5">
        <button @click="searchButton" class="button search">조회</button>
        <button @click="addButton" class="button new">신규</button>
        <button @click="saveButton" class="button save">저장</button>
        <button @click="deleteButton" class="button delete">삭제</button>
        <button @click="excelButton" class="button excel">엑셀</button>
      </div>
    </div>
    <div
      class="flex flex-col justify-start space-x-5 bg-gray-200 rounded-lg h-24 items-start pt-3 pl-36">
      <div class="flex">
        <div>
          <PickStore
            @update:storeGroup="handleGroupCd"
            @update:storeCd="handleStoreCd"
            @update:storeType="handleStoreType"
            :defaultStoreNm="'전체'"
            @storeNm="storeNm"
            @update:ischanged="handleinitAll">
          </PickStore>
        </div>
        <div class="flex justify-center items-center space-x-3 ml-20">
          <div class="flex items-center justify-center">
            <div class="text-base font-semibold">구분 :</div>
            <select
              name=""
              id=""
              class="w-20 h-8 ml-2 rounded-lg"
              v-model="selectedOption">
              <option value="0">전체</option>
              <option :value="i.lngCode" v-for="i in optionList">
                {{ i.strStndName }}
              </option>
            </select>
          </div>
          <div class="flex items-center justify-center space-x-3 pl-10">
            <div class="text-base font-semibold ml-10">검색 :</div>
            <select
              name=""
              id=""
              class="w-20 h-10 rounded-lg"
              v-model="searchoption">
              <option value="0">전체</option>
              <option value="1">사원명</option>
              <option value="2">사원코드</option>
            </select>
            <input
              type="text"
              v-model="searchword"
              class="w-72 h-10 pl-1 rounded-lg" />
          </div>
        </div>
      </div>
      <div class="flex mt-3 space-x-10 items-center">
        <div class="text-base font-semibold">조회옵션</div>
        <div>
          <label for="cond" class="text-sm"
            ><input type="checkbox" id="cond" v-model="cond" />재직</label
          >
        </div>
        <div>
          <label for="cond2"
            ><input type="checkbox" id="cond2" v-model="cond2" />퇴사</label
          >
        </div>
        <div>
          <label for="cond3"
            ><input type="checkbox" id="cond3" v-model="cond3" />휴직</label
          >
        </div>

        <div class="flex pl-24 -mt-2">
          <input type="checkbox" v-model="disableAll" />
          <Datepicker2
            class="!pr-48"
            :mainName="'기간'"
            @endDate="endDate"
            @startDate="startDate"
            :disableAll="disableAll"></Datepicker2>
        </div>
      </div>
    </div>
    <!-- 조회 조건 -->
    <!-- 그리드 영역-->
    <div
      class="grid grid-rows-1 grid-cols-2 h-[70vh] w-full justify-center mt-1">
      <div class="w-full h-full">
        <Realgrid
          :progname="'HR01_005INS_VUE'"
          :progid="1"
          :rowData="rowData"
          @clickedRowData="clickedRowData"
          @selcetedrowData="selcetedrowData"
          @updatedRowData="updatedRowData"
          :addRow4="addRow"
          :deleteRow2="deleteRow"
          :addrowDefault="addrowDefault"
          :addrowProp="'lngStoreGroup,lngPosition,strStoreName,lngChargerCode,strChargerName,strIdNoMask,strAreaName,strClass,strRank,curAmt,strTelNumber,strAddress,strExpireClass,strPassword,strCardNumber,dtmJoinDate,dtmExpireDate,dtmHealthExpireDate,dtmRetireDate,strBankName,strBankNumber,strEmail,lngClassCode,lngRankCode,lngAreaCode,lngPayCode,lngChangePayCode,blnLuner,blnExpireClass,lngBankCode,dtmBirthDate,strZipCode,dtmChangeDate,lngForeigner,strIdNo,lngWorkClass,lngSequence,lngUserAdminID'"
          :changeNow="changeNow"
          :changeValue2="changeValue2"
          :changeColid="changeColid"
          :changeRow="changeRow"
          :exporttoExcel="exporttoExcel"
          :documentSubTitle="documentSubTitle"
          :documentTitle="'HR01_005INS'"
          @selectedIndex="selectedIndex"
          :rowStateeditable="false"
          @sendRowState="sendRowState"
          @allStateRows="allStateRows"
          :addField="'new'"></Realgrid>
      </div>
      <div class="w-full h-[40vh] mt-5">
        <div class="text-base font-semibold pl-2">
          근무 계약 등록(신규/수정)
        </div>
        <div class="grid grid-rows-5 grid-cols-[1fr,2fr,1fr,2fr] h-[20vh]">
          <div
            class="bg-gray-100 border-l border-t border-gray-600 flex justify-center items-center">
            사원
          </div>
          <div
            class="border-l border-t border-gray-600 flex justify-center items-center">
            <button @click="selectEMP">
              <input
                type="text"
                disabled
                class="border border-black w-[80%] h-[80%] pointer-events-none" />
            </button>
          </div>
          <div
            class="bg-gray-100 border-l border-t border-gray-600 flex justify-center items-center">
            급여기준
          </div>
          <div
            class="border-l border-t border-gray-600 flex justify-center items-center">
            <select name="" id="" class="border border-black w-[80%] h-[80%]">
              <option value=""></option>
            </select>
          </div>
          <div
            class="bg-gray-100 border-l border-t border-gray-600 flex justify-center items-center">
            계약 시작일/종료일
          </div>
          <div
            class="border-l border-t border-gray-600 flex justify-center items-center">
            <input type="date" class="border border-black w-[30%] h-[80%]" /> /
            <input type="date" class="border border-black w-[30%] h-[80%]" />
          </div>
          <div
            class="bg-gray-100 border-l border-t border-gray-600 flex justify-center items-center">
            계약일
          </div>
          <div
            class="border-l border-t border-gray-600 flex justify-center items-center">
            <input type="date" class="border border-black w-[80%] h-[80%]" />
          </div>
          <div
            class="bg-gray-100 border-l border-t border-gray-600 flex justify-center items-center">
            급여/시급
          </div>
          <div
            class="border-l border-t border-gray-600 flex justify-center items-center">
            <input type="number" class="border border-black w-[30%] h-[80%]" />
            <input type="number" class="border border-black w-[30%] h-[80%]" />
          </div>
          <div
            class="bg-gray-100 border-l border-t border-gray-600 flex justify-center items-center">
            주휴수당 포함여부
          </div>
          <div
            class="border-l border-t border-gray-600 flex justify-start pl-8 items-center">
            <input type="checkbox" />
          </div>
          <div
            class="bg-gray-100 border-l border-t border-gray-600 flex justify-center items-center">
            소정근무시간 주/월
          </div>
          <div
            class="border-l border-t border-gray-600 flex justify-center items-center">
            <input type="number" class="border border-black w-[30%] h-[80%]" />
            <input type="number" class="border border-black w-[30%] h-[80%]" />
          </div>
          <div
            class="bg-gray-100 border-l border-t border-gray-600 flex justify-center items-center">
            근로계약서 첨부
          </div>
          <div
            class="border-l border-t border-gray-600 flex justify-center items-center">
            <input type="file" class="border border-black w-[70%] h-[90%]" />
            <button class="whitebutton">파일삭제</button>
          </div>
          <div
            class="bg-gray-100 border-l border-t border-gray-600 flex justify-center items-center">
            비고
          </div>
          <div
            class="border-l border-t border-gray-600 flex justify-start pl-10 items-center col-span-3">
            <input type="text" class="border border-black w-[80%] h-[80%]" />
          </div>
        </div>
        <div class="text-base font-semibold pl-2 mt-2">※계약 스케쥴 등록</div>
        <div
          class="grid grid-rows-7 grid-cols-[2fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr,3fr] h-[25vh] w-[95%] min-w-0">
          <div
            class="border-l border-t border-black bg-gray-200 justify-center flex items-center">
            요일
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            월
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            화
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            수
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            목
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            금
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            토
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            일
          </div>
          <div class="row-span-7 h-[160%]">
            <Realgrid
              :progname="'HR01_005INS_VUE'"
              :progid="2"
              :setStateBar="false"
              :setRowIndicator="false"
              :rowData="rowData"></Realgrid>
          </div>
          <div
            class="border-l border-t border-black bg-gray-200 justify-center flex items-center">
            근로일
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <input type="checkbox" />
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <input type="checkbox" />
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <input type="checkbox" />
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <input type="checkbox" />
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <input type="checkbox" />
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <input type="checkbox" />
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <input type="checkbox" />
          </div>
          <div
            class="border-l border-t border-black bg-gray-200 justify-center flex items-center">
            주휴일
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <input type="checkbox" />
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <input type="checkbox" />
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <input type="checkbox" />
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <input type="checkbox" />
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <input type="checkbox" />
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <input type="checkbox" />
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <input type="checkbox" />
          </div>
          <div
            class="border-l border-t border-black bg-gray-200 justify-center flex items-center">
            근로시간
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <input
              type="text"
              min="0"
              class="w-[80%] border border-black"
              value="12:00" />
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <input
              type="text"
              min="0"
              class="w-[80%] border border-black"
              value="12:00" />
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <input
              type="text"
              min="0"
              class="w-[80%] border border-black"
              value="12:00" />
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <input
              type="text"
              min="0"
              class="w-[80%] border border-black"
              value="12:00" />
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <input
              type="text"
              min="0"
              class="w-[80%] border border-black"
              value="12:00" />
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <input
              type="text"
              min="0"
              class="w-[80%] border border-black"
              value="12:00" />
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <input
              type="text"
              min="0"
              class="w-[80%] border border-black"
              value="12:00" />
          </div>
          <div
            class="border-l border-t border-black bg-gray-200 justify-center flex items-center">
            출근시간
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <input
              type="text"
              min="0"
              class="w-[80%] border border-black"
              value="12:00" />
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <input
              type="text"
              min="0"
              class="w-[80%] border border-black"
              value="12:00" />
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <input
              type="text"
              min="0"
              class="w-[80%] border border-black"
              value="12:00" />
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <input
              type="text"
              min="0"
              class="w-[80%] border border-black"
              value="12:00" />
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <input
              type="text"
              min="0"
              class="w-[80%] border border-black"
              value="12:00" />
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <input
              type="text"
              min="0"
              class="w-[80%] border border-black"
              value="12:00" />
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <input
              type="text"
              min="0"
              class="w-[80%] border border-black"
              value="12:00" />
          </div>
          <div
            class="border-l border-t border-black bg-gray-200 justify-center flex items-center">
            퇴근시간
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <input
              type="text"
              min="0"
              class="w-[80%] border border-black"
              value="12:00" />
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <input
              type="text"
              min="0"
              class="w-[80%] border border-black"
              value="12:00" />
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <input
              type="text"
              min="0"
              class="w-[80%] border border-black"
              value="12:00" />
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <input
              type="text"
              min="0"
              class="w-[80%] border border-black"
              value="12:00" />
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <input
              type="text"
              min="0"
              class="w-[80%] border border-black"
              value="12:00" />
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <input
              type="text"
              min="0"
              class="w-[80%] border border-black"
              value="12:00" />
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <input
              type="text"
              min="0"
              class="w-[80%] border border-black"
              value="12:00" />
          </div>

          <div
            class="border-l border-t border-black bg-gray-200 justify-center flex items-center">
            상세보기
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <button class="whitebutton">확인</button>
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <button class="whitebutton">확인</button>
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <button class="whitebutton">확인</button>
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <button class="whitebutton">확인</button>
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <button class="whitebutton">확인</button>
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <button class="whitebutton">확인</button>
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <button class="whitebutton">확인</button>
          </div>
        </div>
        <div class="w-[71%] h-[16vh]">
          <Realgrid
            :progname="'HR01_005INS_VUE'"
            :progid="3"
            :setStateBar="false"
            :setRowIndicator="false"
            :rowData="rowData"></Realgrid>
        </div>
      </div>
      <!-- 그리드 영역-->
      <!-- 연동 데이터 영역-->
    </div>
  </div>

  <!-- 연동 데이터 영역-->
</template>

<script setup>
import {
  getChargerInfo,
  getChargerInfo2,
  getInitEmpInfo,
  saveEMP,
  saveEMP2,
} from "@/api/miattend";
import { getEmpContractList, getInitEmpContractInfo } from "@/api/mihr";
import Datepicker1 from "@/components/Datepicker1.vue";
import Datepicker2 from "@/components/Datepicker2.vue";
import DateRangePicker from "@/components/DateRangePicker.vue";
import DateRangePicker2 from "@/components/DateRangePicker2.vue";
import EmployeePopUp from "@/components/employeePopUp.vue";
import GetZipCode from "@/components/getZipCode.vue";
/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
/**
 * 매장 공통 컴포넌트
 */

import PickStore from "@/components/pickStore.vue";

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

import { nextTick, onMounted, ref } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { Store, useStore } from "vuex";

/**
 * 	화면 Load시 실행 스크립트
 */

const selectEMP = () => {
  openPopUp.value = true;
  console.log("왓음");
};
const openPopUp = ref(false);
const disableAll = ref(true);
const store = useStore();
const dataList = ref([]);
const dataList2 = ref([]);
const dataList3 = ref([]);
const dataList4 = ref([]);
const dataList5 = ref([]);

const gridvalue1 = ref();
const gridvalue2 = ref();
const gridvalue3 = ref();
const gridvalue4 = ref();
const gridvalue5 = ref();
const gridvalue6 = ref();
const gridvalue7 = ref();
const gridvalue8 = ref();
const gridvalue9 = ref();
const gridvalue10 = ref();
const gridvalue11 = ref();
const gridvalue12 = ref();
const gridvalue13 = ref();
const gridvalue14 = ref();
const gridvalue15 = ref();
const gridvalue16 = ref();
const gridvalue17 = ref();
const gridvalue18 = ref();
const gridvalue19 = ref();
const gridvalue20 = ref();
const gridvalue21 = ref();
const gridvalue22 = ref();
const gridvalue23 = ref();
const gridvalue24 = ref();

const zipCode = ref(false);
const showZipCode = () => {
  zipCode.value = true;
};
const closeZipCode = () => {
  zipCode.value = false;
};

const address = async (e) => {
  gridvalue15.value = e;

  setTimeout(() => {
    changeColid.value = "strAddress";
    changeValue2.value = e;
    changeNow.value = !changeNow.value;
  }, 10);
};

const zipCode2 = async (e) => {
  gridvalue14.value = e;
  setTimeout(() => {
    changeColid.value = "strZipCode";
    changeValue2.value = e;
    changeNow.value = !changeNow.value;
  }, 10);
};

const selectedOption = ref(0);
const searchoption = ref(0);
const searchword = ref("");

const cond = ref(true);
const cond2 = ref(false);
const cond3 = ref(false);
const EndDate = ref("");
const StartDate = ref("");
const endDate = (e) => {
  EndDate.value = e;
};
const startDate = (e) => {
  StartDate.value = e;
};
onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getInitEmpContractInfo(store.state.userData.lngStoreGroup);
  optionList.value = res.data.List;

  //console.log(res);
});
const rowData = ref([]);
const groupCd = ref();
const storeCd = ref();
const afterSearch = ref(false);
const exporttoExcel = ref(false);
const documentSubTitle = ref("");
const isNewRow = ref(true);
/**
 * 추가 버튼 함수
 */
const optionList = ref([]);
const addRow = ref(false);
const changeNow = ref(false);
const changeValue2 = ref();
const changeColid = ref();
const changeRow = ref();

const sendRowState = (e) => {
  if (e == "created") {
    isNewRow.value = false;
  } else {
    isNewRow.value = true;
  }
};

const allRowStates = ref([]);
const allStateRows = (e) => {
  allRowStates.value = e;
};
/**
 * 수정용 데이터 행 설정
 */

const selectedIndex = (newValue) => {
  changeRow.value = newValue;
};
/**
 *  추가 버튼
 */

const addButton = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "조회를 먼저 해주세요.",
      confirmButtonText: "확인",
    });
    return;
  }
  // isNewRow.value = false;
  const newCode =
    Math.max(0, ...updateRow.value.map((item) => item.lngChargerCode)) + 1;
  const storeNm = store.state.userData.strStoreName;
  // /console.log(storeNm);
  addrowDefault.value =
    groupCd.value +
    "," +
    store.state.userData.lngPosition +
    "," +
    storeNm +
    "," +
    newCode +
    ", ,,,,,,,,재직,,,, , , , , ,,0,0,0, ,0,0,0,0,,,,,,0,0,0";
  addRow.value = !addRow.value;
};
/**
 * 그리드 행 삭제 버튼 함수
 */

/**
 * 데이터셋 상세정보 셋팅
 */

const clickedRowData = (newValue) => {
  console.log(newValue);
  // gridvalue1.value = newValue[1];
  // gridvalue2.value = newValue[4];
  // gridvalue3.value = newValue[3];
  // gridvalue4.value = newValue[35];
  // gridvalue5.value = newValue[14];
  // gridvalue6.value = newValue[31].split(" ")[0];
  // gridvalue7.value = newValue[28] == "True" ? true : false;
  // gridvalue8.value = newValue[23];
  // gridvalue9.value = newValue[24];
  // gridvalue10.value = newValue[25];
  // gridvalue11.value = newValue[16].split(" ")[0];
  // gridvalue12.value = newValue[15];
  // gridvalue13.value = newValue[29];
  // gridvalue14.value = newValue[32];
  // gridvalue15.value = newValue[12];
  // gridvalue16.value = newValue[10];
  // gridvalue17.value = newValue[11];
  // gridvalue18.value = newValue[19].split(" ")[0];
  // gridvalue19.value = newValue[22];
  // gridvalue20.value = newValue[17].split(" ")[0];
  // gridvalue21.value = newValue[18].split(" ")[0];
  // gridvalue22.value = newValue[36];
  // gridvalue23.value = newValue[30];
  // gridvalue24.value = newValue[21];
};
/**
 * 페이지 매장 그룹 세팅
 */

const handleGroupCd = (newValue) => {
  groupCd.value = newValue;
};
/**
 * 페이지 매장 코드 세팅
 */

const handleStoreCd = (newValue) => {
  storeCd.value = newValue;
};

const storeType = ref();
const handleStoreType = (e) => {
  storeType.value = e;
};
const updateRow = ref([]);
/**
 * 입력창 수정 데이터 갱신
 */

const updatedRowData = (newValue) => {
  updateRow.value = newValue;
  //comsole.log(newValue);
};

/**
 * INPUT , SELECT 수정 데이터 갱신
 */

const changeInfo = (e) => {
  const rowName = e.target.name;
  const rowValue = e.target.value;

  if (rowName == "lngPosition") {
    setTimeout(() => {
      changeValue2.value = dataList4.value.filter(
        (item) => item.lngStoreCode == rowValue
      )[0].strName;
      changeColid.value = "strStoreName";

      changeNow.value = !changeNow.value;
    }, 10);
  }

  if (rowName == "lngClassCode") {
    setTimeout(() => {
      changeValue2.value = dataList2.value.filter(
        (item) => item.lngClassCode == rowValue
      )[0].strClass;
      changeColid.value = "strClass";

      changeNow.value = !changeNow.value;
    }, 10);
  }

  if (rowName == "lngRankCode") {
    setTimeout(() => {
      changeValue2.value = dataList3.value.filter(
        (item) => item.lngRankCode == rowValue
      )[0].strRank;
      changeColid.value = "strRank";

      changeNow.value = !changeNow.value;
    }, 10);
  }

  if (rowName == "lngAreaCode") {
    setTimeout(() => {
      changeValue2.value = dataList.value.filter(
        (item) => item.lngAreaCode == rowValue
      )[0].strArea;
      changeColid.value = "strAreaName";

      changeNow.value = !changeNow.value;
    }, 10);
  }

  if (rowName == "blnExpireClass") {
    setTimeout(() => {
      changeValue2.value =
        rowValue == 0 ? "재직" : rowValue == 1 ? "퇴직" : "휴직";
      changeColid.value = "strExpireClass";

      changeNow.value = !changeNow.value;
    }, 10);
  }

  if (rowName == "lngBankCode") {
    setTimeout(() => {
      changeValue2.value = dataList5.value.filter(
        (item) => item.lngBankCode == rowValue
      )[0].strBankName;
      changeColid.value = "strBankName";

      changeNow.value = !changeNow.value;
    }, 10);
  }
  changeColid.value = rowName;
  changeValue2.value = rowValue;

  changeNow.value = !changeNow.value;
};

const addrowDefault = ref("");

/**
 *  조회 함수
 */

const searchButton = async () => {
  try {
    store.state.loading = true;
    let res;
    //comsole.log(groupCd.value);
    //comsole.log(storeCd.value);

    let lngoption =
      (cond.value == true ? "1" : "") +
      (cond2.value == true ? "2" : "") +
      (cond3.value == true ? "3" : "");

    let sdate = disableAll.value == true ? "1980-01-01" : StartDate.value;
    let edate = disableAll.value == true ? "9999-12-01" : EndDate.value;
    res = await getEmpContractList(
      groupCd.value,
      storeCd.value,
      selectedOption.value,
      lngoption,
      sdate,
      edate,
      searchoption.value,
      searchword.value
    );

    rowData.value = res.data.List;
    updateRow.value = JSON.parse(JSON.stringify(rowData.value));
    console.log(res);
    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
  } finally {
    store.state.loading = false;
  }
};

/**
 *  저장 버튼 함수
 */

const saveButton = async () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 진행해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  if (JSON.stringify(updateRow.value) === JSON.stringify(rowData.value)) {
    Swal.fire({
      title: "경고",
      text: "변경된 사항이 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  const validateRow2 = updateRow.value.filter(
    (item) => item.strChargerName == "" || item.strChargerName == undefined
  ).length;
  if (validateRow2 > 0) {
    Swal.fire({
      title: "경고",
      text: "사원이름이 미입력되었습니다. 확인해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  const validateRow3 = updateRow.value.filter(
    (item) => item.lngChargerCode == "" || item.lngChargerCode == undefined
  ).length;
  if (validateRow3 > 0) {
    Swal.fire({
      title: "경고",
      text: "사원번호가 미입력되었습니다. 확인해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  const validateRow4 = updateRow.value.filter(
    (item) => item.lngClassCode == "0" || item.lngClassCode == undefined
  ).length;
  if (validateRow4 > 0) {
    Swal.fire({
      title: "경고",
      text: "직책이 미입력되었습니다. 확인해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  const validateRow5 = updateRow.value.filter(
    (item) => item.lngRankCode == "0" || item.lngRankCode == undefined
  ).length;
  if (validateRow5 > 0) {
    Swal.fire({
      title: "경고",
      text: "직위가 미입력되었습니다. 확인해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  const validateRow6 = updateRow.value.filter(
    (item) => item.lngAreaCode == "0" || item.lngAreaCode == undefined
  ).length;
  if (validateRow6 > 0) {
    Swal.fire({
      title: "경고",
      text: "근무장소가 미입력되었습니다. 확인해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  const validateRow7 = updateRow.value.filter(
    (item) => item.blnExpireClass == undefined
  ).length;
  if (validateRow7 > 0) {
    Swal.fire({
      title: "경고",
      text: "재직구분이 미입력되었습니다. 확인해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  Swal.fire({
    title: "저장",
    text: "저장 하시겠습니까?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "저장",
    cancelButtonText: "취소",
  }).then(async (result) => {
    if (result.isConfirmed) {
      store.state.loading = true;
      try {
        //comsole.log(updateRow.value);

        const chargerCode = updateRow.value.map((item) => item.lngChargerCode);
        const chargerName = updateRow.value.map((item) => item.strChargerName);

        const strIdNo = updateRow.value.map((item) => item.strIdNo);
        const lngClassCode = updateRow.value.map((item) => item.lngClassCode);
        const lngRankCode = updateRow.value.map((item) => item.lngRankCode);
        const lngAreaCode = updateRow.value.map((item) => item.lngAreaCode);
        const dtmJoinDate = updateRow.value.map(
          (item) => item.dtmJoinDate.split(" ")[0]
        );
        const dtmExpireDate = updateRow.value.map(
          (item) => item.dtmExpireDate.split(" ")[0]
        );
        const dtmHealthExpireDate = updateRow.value.map(
          (item) => item.dtmHealthExpireDate.split(" ")[0]
        );
        const dtmBirthDate = updateRow.value.map(
          (item) => item.dtmBirthDate.split(" ")[0]
        );
        const strTelNumber = updateRow.value.map((item) => item.strTelNumber);
        const strZipCode = updateRow.value.map((item) => item.strZipCode);
        const strAddress = updateRow.value.map((item) => item.strAddress);
        const strPassword = updateRow.value.map((item) => item.strPassword);
        const lngBankCode = updateRow.value.map((item) => item.lngBankCode);
        const strBankNumber = updateRow.value.map((item) => item.strBankNumber);
        const blnExpireClass = updateRow.value.map(
          (item) => item.blnExpireClass
        );
        const strCardNumber = updateRow.value.map((item) => item.strCardNumber);
        const strEmail = updateRow.value.map((item) => item.strEmail);
        const strCPhone = updateRow.value.map((item) => item.strCPhone);
        const blnLuner = updateRow.value.map((item) =>
          item.blnLuner == "True" ? 1 : item.blnLuner == true ? 1 : 0
        );

        const lngPayCode = updateRow.value.map((item) => item.lngPayCode);
        const dtmChangeDate = updateRow.value.map(
          (item) => item.dtmChangeDate.split(" ")[0]
        );
        const lngUserAdminID = updateRow.value.map(
          (item) => item.lngUserAdminID
        );
        const dtmRetireDate = updateRow.value.map(
          (item) => item.dtmRetireDate.split(" ")[0]
        );
        const lngChangePayCode = updateRow.value.map(
          (item) => item.lngChangePayCode
        );
        const lngStoreGroup = updateRow.value.map((item) => item.lngStoreGroup);
        const lngSequence = updateRow.value.map((item) => item.lngSequence);
        const lngPosition = updateRow.value.map((item) => item.lngPosition);

        const lngWorkClass = updateRow.value.map((item) => item.lngWorkClass);

        const res = await saveEMP2(
          chargerCode.join("\u200b"),
          chargerName.join("\u200b"),
          strIdNo.join("\u200b"),
          lngClassCode.join("\u200b"),
          lngRankCode.join("\u200b"),
          lngAreaCode.join("\u200b"),
          dtmJoinDate.join("\u200b"),
          dtmExpireDate.join("\u200b"),
          dtmHealthExpireDate.join("\u200b"),
          dtmBirthDate.join("\u200b"),
          strTelNumber.join("\u200b"),
          strZipCode.join("\u200b"),
          strAddress.join("\u200b"),
          strPassword.join("\u200b"),
          lngBankCode.join("\u200b"),
          strBankNumber.join("\u200b"),
          blnExpireClass.join("\u200b"),
          strCardNumber.join("\u200b"),
          strEmail.join("\u200b"),
          strCPhone.join("\u200b"),
          lngPosition.join("\u200b"),
          blnLuner.join("\u200b"),
          lngPayCode.join("\u200b"),
          dtmChangeDate.join("\u200b"),
          lngUserAdminID.join("\u200b"),
          dtmRetireDate.join("\u200b"),
          lngChangePayCode.join("\u200b"),
          lngStoreGroup.join("\u200b"),
          lngSequence.join("\u200b"),
          lngWorkClass.join("\u200b")
        );
        console.log(res);
        Swal.fire({
          title: "저장 되었습니다.",
          confirmButtonText: "확인",
        });
      } catch (error) {
        Swal.fire({
          title: "저장이 실패되었습니다.",
          confirmButtonText: "확인",
        });
      } finally {
        store.state.loading = false;
        searchButton();
      }
    }
  });
};

const excelNm = ref("");
const storeNm = (e) => {
  excelNm.value = e;
};
const excelButton = () => {
  const a =
    searchoption.value == 0
      ? "전체"
      : searchoption.value == 1
      ? "사원명"
      : "사원번호";
  const b = searchword.value;

  const c =
    "조회옵션 직책 :" +
    (cond.value == true ? "재직" : "") +
    "," +
    (cond2.value == true ? "퇴사" : "") +
    "," +
    (cond3.value == true ? "휴직" : "");
  documentSubTitle.value =
    "매장명 : " + excelNm.value + "\n" + (a + ":" + b) + "\n" + c;
  exporttoExcel.value = !exporttoExcel.value;
};
</script>

<style scoped></style>
