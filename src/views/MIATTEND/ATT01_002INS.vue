/*--############################################################################
# Filename : ATT01_002INS.vue                                                  
# Description : 마스터관리 > 사원 마스터 > 사원 등록.                          
# Date :2025-05-14                                                             
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
        <div class="flex justify-center items-center space-x-3 ml-60">
          <div class="text-base font-semibold">검색 :</div>
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

        <div class="flex">
          <div class="text-base font-semibold">직책:</div>
          <div>
            <select name="" id="" v-model="cond4" class="w-60 ml-1">
              <option value="0">전체</option>
              <option :value="i.lngClassCode" v-for="i in dataList2">
                {{ i.strClass }}
              </option>
            </select>
          </div>
        </div>

        <div class="flex">
          <div class="text-base font-semibold">직위 :</div>
          <div>
            <select name="" id="" v-model="cond5" class="w-60 ml-1">
              <option value="0">전체</option>
              <option :value="i.lngRankCode" v-for="i in dataList3">
                {{ i.strRank }}
              </option>
            </select>
          </div>
        </div>

        <div class="flex">
          <div class="text-base font-semibold">근무장소:</div>
          <div>
            <select name="" id="" v-model="cond6" class="w-60 ml-1">
              <option value="0">전체</option>
              <option :value="i.lngAreaCode" v-for="i in dataList">
                {{ i.strArea }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
    <!-- 조회 조건 -->
    <!-- 그리드 영역-->
    <div
      class="grid grid-rows-2 grid-cols-1 h-[70vh] w-full justify-center mt-1">
      <div class="w-full h-[30vh]">
        <Realgrid
          :progname="'ATT01_002INS_VUE2'"
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
          :documentTitle="'ATT01_002INS'"
          @selectedIndex="selectedIndex"
          :rowStateeditable="false"
          @sendRowState="sendRowState"
          @allStateRows="allStateRows"
          :addField="'new'"></Realgrid>
      </div>
      <div class="w-full h-[40vh] -mt-10">
        <div
          class="grid grid-rows-9 grid-cols-[1fr,2fr,1fr,2fr,1fr,2fr] h-[30vh]">
          <div
            class="bg-gray-100 border-l border-t border-gray-600 flex justify-center items-center">
            <span
              class="flex justify-center items-center text-red-400 text-justify"
              >*</span
            >매장코드
          </div>
          <div
            class="border-l border-t border-gray-600 flex justify-center items-center">
            <select
              name="lngPosition"
              id=""
              v-model="gridvalue1"
              @change="changeInfo"
              class="border border-black w-[80%] h-[80%]">
              <option :value="i.lngStoreCode" v-for="i in dataList4">
                {{ i.strName }}
              </option>
            </select>
          </div>
          <div
            class="bg-gray-100 border-l border-t border-gray-600 flex justify-center items-center">
            <span
              class="flex justify-center items-center text-red-400 text-justify"
              >*</span
            >사원이름
          </div>
          <div
            class="border-l border-t border-gray-600 flex justify-center items-center">
            <input
              type="text"
              name="strChargerName"
              @input="changeInfo"
              class="border border-black w-[80%] h-[80%]"
              v-model="gridvalue2" />
          </div>
          <div
            class="bg-gray-100 border-l border-t border-gray-600 flex justify-center items-center">
            <span
              class="flex justify-center items-center text-red-400 text-justify"
              >*</span
            >사원 코드
          </div>
          <div
            class="border-l border-t border-gray-600 flex justify-center items-center">
            <input
              type="text"
              name="lngChargerCode"
              @input="changeInfo"
              class="border border-black w-[80%] h-[80%]"
              v-model="gridvalue3" />
          </div>
          <div
            class="bg-gray-100 border-l border-t border-gray-600 flex justify-center items-center">
            주민번호
          </div>
          <div
            class="border-l border-t border-gray-600 flex justify-center items-center">
            <input
              type="text"
              name="strIdNo"
              @input="changeInfo"
              class="border border-black w-[80%] h-[80%]"
              v-model="gridvalue4" />
          </div>
          <div
            class="bg-gray-100 border-l border-t border-gray-600 flex justify-center items-center">
            비밀번호
          </div>
          <div
            class="border-l border-t border-gray-600 flex justify-center items-center">
            <input
              type="text"
              name="strPassword"
              @input="changeInfo"
              class="border border-black w-[80%] h-[80%]"
              v-model="gridvalue5" />
          </div>
          <div
            class="bg-gray-100 border-l border-t border-gray-600 flex justify-center items-center">
            생년월일
          </div>
          <div
            class="border-l border-t border-gray-600 flex justify-center items-center">
            <input
              type="date"
              name="dtmBirthDate"
              @input="changeInfo"
              v-model="gridvalue6"
              class="border border-black w-[60%] h-[80%]" />
            <select
              name="blnLuner"
              id=""
              @input="changeInfo"
              v-model="gridvalue7"
              class="border border-black w-[20%] h-[80%]">
              <option :value="true">양력</option>
              <option :value="false">음력</option>
            </select>
          </div>
          <div
            class="bg-gray-100 border-l border-t border-gray-600 flex justify-center items-center">
            <span
              class="flex justify-center items-center text-red-400 text-justify"
              >*</span
            >직책
          </div>
          <div
            class="border-l border-t border-gray-600 flex justify-center items-center">
            <select
              name="lngClassCode"
              id=""
              @input="changeInfo"
              v-model="gridvalue8"
              class="border border-black w-[80%] h-[80%]">
              <option value="0">선택</option>
              <option :value="i.lngClassCode" v-for="i in dataList2">
                {{ i.strClass }}
              </option>
            </select>
          </div>
          <div
            class="bg-gray-100 border-l border-t border-gray-600 flex justify-center items-center">
            <span
              class="flex justify-center items-center text-red-400 text-justify"
              >*</span
            >직위
          </div>
          <div
            class="border-l border-t border-gray-600 flex justify-center items-center">
            <select
              name="lngRankCode"
              id=""
              @input="changeInfo"
              v-model="gridvalue9"
              class="border border-black w-[80%] h-[80%]">
              <option value="0">선택</option>
              <option :value="i.lngRankCode" v-for="i in dataList3">
                {{ i.strRank }}
              </option>
            </select>
          </div>
          <div
            class="bg-gray-100 border-l border-t border-gray-600 flex justify-center items-center">
            <span
              class="flex justify-center items-center text-red-400 text-justify"
              >*</span
            >근무장소
          </div>
          <div
            class="border-l border-t border-gray-600 flex justify-center items-center">
            <select
              name="lngAreaCode"
              id=""
              @input="changeInfo"
              v-model="gridvalue10"
              class="border border-black w-[80%] h-[80%]">
              <option value="0">선택</option>
              <option :value="i.lngAreaCode" v-for="i in dataList">
                {{ i.strArea }}
              </option>
            </select>
          </div>
          <div
            class="bg-gray-100 border-l border-t border-gray-600 flex justify-center items-center">
            입사일자
          </div>
          <div
            class="border-l border-t border-gray-600 flex justify-center items-center">
            <input
              type="date"
              name="dtmJoinDate"
              @input="changeInfo"
              v-model="gridvalue11"
              class="border border-black w-[80%] h-[80%]" />
          </div>
          <div
            class="bg-gray-100 border-l border-t border-gray-600 flex justify-center items-center">
            카드번호
          </div>
          <div
            class="border-l border-t border-gray-600 flex justify-center items-center">
            <input
              type="text"
              name="strCardNumber"
              @input="changeInfo"
              v-model="gridvalue12"
              class="border border-black w-[80%] h-[80%]" />
          </div>
          <div
            class="bg-gray-100 border-l border-t border-gray-600 flex justify-center items-center">
            <span
              class="flex justify-center items-center text-red-400 text-justify"
              >*</span
            >재직구분
          </div>
          <div
            class="border-l border-t border-gray-600 flex justify-center items-center">
            <select
              name="blnExpireClass"
              @input="changeInfo"
              v-model="gridvalue13"
              class="border border-black w-[80%] h-[80%]">
              <option value="0">재직</option>
              <option value="1">퇴직</option>
              <option value="2">휴직</option>
            </select>
          </div>
          <div
            class="bg-gray-100 border-l border-t border-gray-600 flex justify-center items-center">
            우편번호
          </div>
          <div
            class="border-l border-t border-gray-600 flex justify-center items-center">
            <input
              type="text"
              name="strZipCode"
              @input="changeInfo"
              v-model="gridvalue14"
              class="border border-black w-[50%] h-[80%]" />
            <button class="whitebutton" @click="showZipCode">
              우편번호 찾기
            </button>
          </div>
          <div
            class="bg-gray-100 border-l border-t border-gray-600 flex justify-center items-center">
            주소
          </div>
          <div
            class="border-l border-t border-gray-600 flex justify-center items-center col-span-3">
            <input
              type="text"
              name="strAddress"
              @input="changeInfo"
              v-model="gridvalue15"
              class="border border-black w-[80%] h-[80%] mr-28" />
          </div>

          <div
            class="bg-gray-100 border-l border-t border-gray-600 flex justify-center items-center">
            전화번호
          </div>
          <div
            class="border-l border-t border-gray-600 flex justify-center items-center">
            <input
              type="text"
              name="strTelNumber"
              @input="changeInfo"
              v-model="gridvalue16"
              class="border border-black w-[80%] h-[80%]" />
          </div>
          <div
            class="bg-gray-100 border-l border-t border-gray-600 flex justify-center items-center">
            휴대폰번호
          </div>
          <div
            class="border-l border-t border-gray-600 flex justify-center items-center">
            <input
              type="text"
              name="strCPhone"
              @input="changeInfo"
              v-model="gridvalue17"
              class="border border-black w-[80%] h-[80%]" />
          </div>
          <div
            class="bg-gray-100 border-l border-t border-gray-600 flex justify-center items-center">
            퇴직일자
          </div>
          <div
            class="border-l border-t border-gray-600 flex justify-center items-center">
            <input
              type="date"
              name="dtmRetireDate"
              @input="changeInfo"
              v-model="gridvalue18"
              class="border border-black w-[80%] h-[80%]" />
          </div>
          <div
            class="bg-gray-100 border-l border-t border-gray-600 flex justify-center items-center">
            이메일
          </div>
          <div
            class="border-l border-t border-gray-600 flex justify-center items-center">
            <input
              type="text"
              name="strEmail"
              @input="changeInfo"
              v-model="gridvalue19"
              class="border border-black w-[80%] h-[80%]" />
          </div>
          <div
            class="border-t border-gray-600 flex justify-center items-center"></div>
          <div
            class="border-t border-gray-600 flex justify-center items-center"></div>
          <div
            class="border-t border-gray-600 flex justify-center items-center"></div>
          <div
            class="border-t border-gray-600 flex justify-center items-center"></div>
          <div
            class="bg-gray-100 border-l border-t border-gray-600 flex justify-center items-center">
            계약 만기일
          </div>
          <div
            class="border-l border-t border-gray-600 flex justify-center items-center">
            <input
              type="date"
              name="dtmExpireDate"
              @input="changeInfo"
              v-model="gridvalue20"
              class="border border-black w-[80%] h-[80%]" />
          </div>
          <div
            class="bg-gray-100 border-l border-t border-gray-600 flex justify-center items-center">
            보건증만기일
          </div>
          <div
            class="border-l border-t border-gray-600 flex justify-center items-center">
            <input
              type="date"
              name="dtmHealthExpireDate"
              @input="changeInfo"
              v-model="gridvalue21"
              class="border border-black w-[80%] h-[80%]" />
          </div>
          <div
            class="bg-gray-100 border-l border-t border-gray-600 flex justify-center items-center">
            정규직/PT
          </div>
          <div
            class="border-l border-t border-gray-600 flex justify-center items-center">
            <select
              name="lngWorkClass"
              id=""
              @change="changeInfo"
              v-model="gridvalue22"
              class="border border-black w-[80%] h-[80%]">
              <option value="0">해당 사항 없음</option>
              <option value="1">정직원</option>
              <option value="2">PT</option>
            </select>
          </div>
          <div
            class="bg-gray-100 border-l border-t border-gray-600 flex justify-center items-center">
            거래은행
          </div>
          <div
            class="border-l border-t border-gray-600 flex justify-center items-center">
            <select
              name="lngBankCode"
              id=""
              @change="changeInfo"
              v-model="gridvalue23"
              class="border border-black w-[80%] h-[80%]">
              <option value="0">선택</option>
              <option :value="i.lngBankCode" v-for="i in dataList5">
                {{ i.strBankName }}
              </option>
            </select>
          </div>
          <div
            class="bg-gray-100 border-l border-t border-gray-600 flex justify-center items-center">
            계좌번호
          </div>
          <div
            class="border-l border-t border-gray-600 flex justify-center items-center">
            <input
              type="text"
              name="strBankNumber"
              id=""
              @input="changeInfo"
              v-model="gridvalue24"
              class="border border-black w-[80%] h-[80%]" />
          </div>
        </div>
      </div>
      <!-- 그리드 영역-->
      <!-- 연동 데이터 영역-->
    </div>

    <GetZipCode
      v-if="zipCode"
      @closePopUp="closeZipCode"
      @address="address"
      @zipCode="zipCode2"></GetZipCode>
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

const searchoption = ref(0);
const searchword = ref("");

const cond = ref(true);
const cond2 = ref(true);
const cond3 = ref(true);
const cond4 = ref(0);
const cond5 = ref(0);
const cond6 = ref(0);

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getInitEmpInfo(store.state.userData.lngStoreGroup);
  dataList.value = res.data.List;
  dataList2.value = res.data.List2;
  dataList3.value = res.data.List3;
  dataList4.value = res.data.List4;
  dataList5.value = res.data.List5;

  gridvalue1.value = store.state.userData.lngPosition;
  ////console.log(res);
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
  // /////console.log(storeNm);
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
  ////console.log(newValue);
  gridvalue1.value = newValue[1];
  gridvalue2.value = newValue[4];
  gridvalue3.value = newValue[3];
  gridvalue4.value = newValue[35];
  gridvalue5.value = newValue[14];
  gridvalue6.value = newValue[31].split(" ")[0];
  gridvalue7.value = newValue[28] == "True" ? true : false;
  gridvalue8.value = newValue[23];
  gridvalue9.value = newValue[24];
  gridvalue10.value = newValue[25];
  gridvalue11.value = newValue[16].split(" ")[0];
  gridvalue12.value = newValue[15];
  gridvalue13.value = newValue[29];
  gridvalue14.value = newValue[32];
  gridvalue15.value = newValue[12];
  gridvalue16.value = newValue[10];
  gridvalue17.value = newValue[11];
  gridvalue18.value = newValue[19].split(" ")[0];
  gridvalue19.value = newValue[22];
  gridvalue20.value = newValue[17].split(" ")[0];
  gridvalue21.value = newValue[18].split(" ")[0];
  gridvalue22.value = newValue[36];
  gridvalue23.value = newValue[30];
  gridvalue24.value = newValue[21];
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
  // if (storeCd.value == "0" || storeCd.value == undefined) {
  //   Swal.fire({
  //     title: "경고",
  //     text: "매장을 선택하세요.",
  //     icon: "warning",
  //     showCancelButton: false,
  //     confirmButtonColor: "#3085d6",
  //     allowOutsideClick: false,
  //   });
  //   return;
  // }

  try {
    store.state.loading = true;
    let res;
    //comsole.log(groupCd.value);
    //comsole.log(storeCd.value);

    let lngoption =
      (cond.value == true ? "1" : "") +
      (cond2.value == true ? "2" : "") +
      (cond3.value == true ? "3" : "");
    res = await getChargerInfo2(
      groupCd.value,
      storeCd.value,
      storeType.value,
      searchoption.value,
      searchword.value,
      cond4.value,
      cond5.value,
      cond6.value,
      lngoption
    );

    rowData.value = res.data.List;
    updateRow.value = JSON.parse(JSON.stringify(rowData.value));
    ////console.log(res);
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
        ////console.log(res);
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
