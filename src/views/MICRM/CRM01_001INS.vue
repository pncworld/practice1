/*--############################################################################
# Filename : CRM01_001INS.vue                                                  
# Description : 고객관리 > 고객신상정보 > 고객정보                              
# Date :2025-06-13                                                             
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
        <button @click="searchButton" class="button save md:w-auto w-14">
          저장
        </button>
        <button @click="excelButton" class="button save w-auto excel">
          엑셀
        </button>
      </div>
    </div>
    <div
      class="grid grid-cols-3 grid-rows-7 bg-gray-200 rounded-lg h-80 items-center z-10 space-x-5 pt-4">
      <div class="justify-start ml-16 flex col-span-2">
        <PickStoreSingle
          :setDisableType="true"
          @lngStoreCode="lngStoreCode"
          @lngStoreGroup="lngStoreGroup"
          @lngSupervisor="lngSupervisor"
          @lngStoreTeam="lngStoreTeam"></PickStoreSingle>
      </div>
      <div
        class="h-full !-ml-52 mt-1 justify-center items-center flex flex-col space-y-3">
        <div class="flex justify-start items-center">
          <div class="text-center font-semibold text-sm">고객카드번호 :</div>
          <div class="ml-5">
            <input type="text" class="h-6 w-32" v-model="cond" />
          </div>
          <span class="text-red-400">※ '-'없이 기입</span>
        </div>
        <div class="flex justify-start items-center mr-10">
          <div class="text-center font-semibold text-sm">고객명 :</div>
          <div class="ml-5">
            <input type="text" class="h-6 w-32" v-model="cond2" />
          </div>
        </div>
      </div>
      <div class="flex justify-start space-x-5 mt-6 !ml-20">
        <div class="text-center font-semibold text-sm">생년월일</div>
        <div class="flex w-20">
          <select name="" id="" class="w-12 h-7" v-model="cond3">
            <option value="0"></option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
          </select>
          월
        </div>

        <div>
          <select name="" id="" class="w-12 h-7" v-model="cond4">
            <option value="0"></option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
            <option value="13">13</option>
            <option value="14">14</option>
            <option value="15">15</option>
            <option value="16">16</option>
            <option value="17">17</option>
            <option value="18">18</option>
            <option value="19">19</option>
            <option value="20">20</option>
            <option value="21">21</option>
            <option value="22">22</option>
            <option value="23">23</option>
            <option value="24">24</option>
            <option value="25">25</option>
            <option value="26">26</option>
            <option value="27">27</option>
            <option value="28">28</option>
            <option value="29">29</option>
            <option value="30">30</option>
            <option value="31">31</option>
          </select>
          일자
        </div>
      </div>

      <div class="flex justify-start space-x-5 mt-6 !ml-20">
        <div class="text-center font-semibold text-sm">직종</div>
        <select name="" id="" class="w-32 h-7" v-model="cond5">
          <option value="0">전체</option>
          <option value="1">회사원</option>
          <option value="2">공무원</option>
          <option value="3">교직원</option>
          <option value="4">전문직</option>
          <option value="5">자영업</option>
          <option value="6">학생</option>
          <option value="7">주부</option>
        </select>
      </div>

      <div class="flex justify-start space-x-5 mt-6 !ml-20">
        <div class="text-center font-semibold text-sm">성별</div>
        <select name="" id="" class="w-32 h-7" v-model="cond6">
          <option value="0">전체</option>
          <option value="1">여자</option>
          <option value="2">남자</option>
        </select>
      </div>

      <div class="flex justify-start space-x-5 mt-6 !ml-20">
        <div class="text-center font-semibold text-sm">전화번호</div>
        <div class="flex w-20 h-7">
          <input type="text" v-model="cond7" />
          <span class="text-nowrap">※010-0000-0000</span>
        </div>
      </div>

      <div class="flex justify-start space-x-5 mt-6 !ml-14">
        <div class="text-center font-semibold text-sm">가입상태</div>
        <select name="" id="" class="w-32 h-7" v-model="cond8">
          <option value="0">전체</option>
          <option value="1">정상</option>
          <option value="2">대기</option>
          <option value="3">탈퇴</option>
          <option value="4">삭제</option>
          <option value="5">중지</option>
          <option value="6">웹전용</option>
        </select>
      </div>

      <div class="flex justify-start space-x-5 mt-6 !ml-14">
        <div class="text-center font-semibold text-sm">결혼여부</div>
        <select name="" id="" class="w-32 h-7" v-model="cond9">
          <option value="0">전체</option>
          <option value="1">미혼</option>
          <option value="2">기혼</option>
        </select>
      </div>

      <div class="flex justify-start space-x-5 mt-6 !pr-20">
        <Datepicker2
          :disableBox="false"
          class="!-ml-10"
          @endDate="endDate"
          @startDate="startDate"
          :removeDefault="true"
          :mainName="'가입일'"></Datepicker2>
      </div>

      <div class="flex justify-start space-x-5 mt-6 !pr-20">
        <Datepicker2
          :disableBox="false"
          class="!-ml-20"
          @endDate="endDate2"
          @startDate="startDate2"
          :removeDefault="true"
          :mainName="'최초사용일'"></Datepicker2>
      </div>

      <div class="flex justify-start space-x-5 mt-6 !ml-20">
        <div class="text-center font-semibold text-sm">등급</div>
        <select name="" id="" class="border w-32 h-7 ml-2" v-model="cond10">
          <option value="0">전체</option>
          <option :value="i.intLevel" v-for="i in optionList">
            {{ i.strLevelName }}
          </option>
        </select>
      </div>

      <div class="flex justify-start space-x-5 mt-6 !pl-12">
        <div class="text-center font-semibold text-sm">누적포인트</div>
        <select name="" id="" class="border w-10 h-7 ml-2" v-model="cond11">
          <option value="1"><</option>
          <option value="2">=</option>
          <option value="3">></option>
        </select>
        <input type="number" class="w-32" v-model="cond12" />
      </div>

      <div class="flex justify-start space-x-5 mt-6 !pl-5">
        <div class="text-center font-semibold text-sm">잔여포인트</div>
        <select name="" id="" class="border w-10 h-7 ml-2" v-model="cond13">
          <option value="1"><</option>
          <option value="2">=</option>
          <option value="3">></option>
        </select>
        <input type="number" class="w-32" v-model="cond14" />
      </div>

      <div class="flex justify-start space-x-5 mt-6">
        <Datepicker2
          :disableBox="false"
          class="!-ml-20"
          @endDate="endDate3"
          @startDate="startDate3"
          :removeDefault="true"
          :mainName="'최종사용일'"></Datepicker2>
      </div>

      <div class="flex justify-start space-x-5 mt-3 !pl-12">
        <div class="text-center font-semibold text-sm">방문횟수</div>
        <select name="" id="" class="border w-10 h-7 ml-2" v-model="cond15">
          <option value="1"><</option>
          <option value="2">=</option>
          <option value="3">></option>
        </select>
        <input type="number" class="w-32" v-model="cond16" />
      </div>

      <div class="flex justify-start space-x-5 mt-3 !pl-5">
        <div class="text-center font-semibold text-sm">SMS수신동의</div>
        <select name="" id="" class="border w-32 h-7 ml-2" v-model="cond17">
          <option value="2">전체</option>
          <option value="0">동의</option>
          <option value="1">비동의</option>
        </select>
      </div>

      <div class="flex justify-start space-x-5 mt-3 !ml-12">
        <div class="text-center font-semibold text-sm">실매출액</div>
        <select name="" id="" class="border w-10 h-7 ml-2" v-model="cond18">
          <option value="1"><</option>
          <option value="2">=</option>
          <option value="3">></option>
        </select>
        <input type="number" class="w-32" v-model="cond19" />
      </div>

      <div class="flex justify-start space-x-5 mt-0 !pl-12">
        <div class="text-center font-semibold text-sm">마케팅수신동의</div>
        <select name="" id="" class="border w-32 h-7 ml-2" v-model="cond20">
          <option value="2">전체</option>
          <option value="0">동의</option>
          <option value="1">비동의</option>
        </select>
      </div>

      <div class="flex justify-start space-x-5 mt-0 !pl-5">
        <div class="text-center font-semibold text-sm">휴면회원여부</div>
        <select name="" id="" class="border w-32 h-7 ml-2" v-model="cond21">
          <option value="-1">전체</option>
          <option value="1">일반</option>
          <option value="2">휴면</option>
        </select>
      </div>

      <div class="flex justify-start space-x-5 mt-0 !-ml-2">
        <PickStore
          :hideAttr="false"
          :hideGroup="false"
          :defaultStore="true"
          @update:storeCd="preferStore"
          :mainName="'선호매장'"></PickStore>
      </div>
    </div>
    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="grid grid-rows-1 grid-cols-1 w-full h-[40vh]">
      <div class="w-full h-full">
        <Realgrid
          :progname="'CRM01_001INS_VUE'"
          :progid="1"
          :rowData="rowData"
          :reload="reload"
          :documentTitle="'CRM01_001INS'"
          @clickedRowData="clickedRowData"
          :documentSubTitle="documentSubTitle"
          :rowStateeditable="false"
          :exporttoExcel="exportExcel">
        </Realgrid>
      </div>
    </div>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import {
  getCustomerInfo,
  getCustPointInfo,
  getCustRecord,
  getInitDataCustPurchase,
  getReceiptDataDetail2,
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
import PickStoreSingle from "@/components/pickStoreSingle.vue";
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

const optionList = ref([]);
onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getInitDataCustPurchase(store.state.userData.lngStoreGroup);
  optionList.value = res.data.List;
});

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

const rowData2 = ref([]);
const rowData3 = ref([]);
const rowData4 = ref([]);
const condValue = ref(0);
const store = useStore();
const cond = ref("");
const cond2 = ref("");
const cond3 = ref(0);
const cond4 = ref(0);
const cond5 = ref(0);
const cond6 = ref(0);
const cond7 = ref("");
const cond8 = ref(0);
const cond9 = ref(0);
const cond10 = ref(0);
const cond11 = ref(1);
const cond12 = ref("");
const cond13 = ref(1);
const cond14 = ref("");
const cond15 = ref(1);
const cond16 = ref("");
const cond17 = ref(2);
const cond18 = ref(1);
const cond19 = ref("");
const cond20 = ref(2);
const cond21 = ref(-1);
const datepicker = ref(null);
const closePopUp = ref(false);

const point1 = ref();
const point2 = ref();
const point3 = ref();
const point4 = ref();

const team = ref();
const lngStoreTeam = (e) => {
  team.value = e;
};
const supervisor = ref();
const lngSupervisor = (e) => {
  supervisor.value = e;
};
const groupCd = ref();
const lngStoreGroup = (e) => {
  groupCd.value = e;
};
const storeCd = ref();
const lngStoreCode = (e) => {
  storeCd.value = e;
};

const pstore = ref();

const preferStore = (e) => {
  pstore.value = e;
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

const Name = (e) => {
  console.log(e);
};
const searchNum = ref(0);
const ID = (e) => {
  searchNum.value = e;
};

const custID = ref();
const CustId = (e) => {
  custID.value = e;
};
const sDate = ref();
const eDate = ref();
const startDate = (e) => {
  sDate.value = e;
};
const endDate = (e) => {
  eDate.value = e;
};

const sDate2 = ref();
const eDate2 = ref();
const startDate2 = (e) => {
  sDate2.value = e;
};
const endDate2 = (e) => {
  eDate2.value = e;
};

const sDate3 = ref();
const eDate3 = ref();
const startDate3 = (e) => {
  sDate3.value = e;
};
const endDate3 = (e) => {
  eDate3.value = e;
};

const selectedDate = ref();
const excelDate = (e) => {
  selectedDate.value = e;
};
/**
 *  조회 함수
 */
const hideColumnsId = ref([]);
const searchButton = async () => {
  try {
    store.state.loading = true;
    initGrid();

    console.log(
      groupCd.value,
      0,
      team.value,
      supervisor.value,
      storeCd.value,
      null,
      cond.value,
      cond2.value,
      cond8.value,
      null,
      cond3.value,
      cond4.value,
      cond9.value,
      cond6.value,
      cond5.value,
      cond7.value,
      null,
      null,
      null,
      sDate.value,
      eDate.value,
      sDate2.value,
      eDate2.value,
      sDate3.value,
      eDate3.value,
      cond11.value,
      cond12.value,
      cond13.value,
      cond14.value,
      cond18.value,
      cond19.value,
      cond15.value,
      cond16.value,
      cond10.value,
      cond17.value,
      pstore.value,
      cond21.value,
      cond20.value
    );
    if (cond19.value == "") {
      cond19.value = null;
    }
    if (cond14.value == "") {
      cond14.value = null;
    }
    if (cond12.value == "") {
      cond12.value = null;
    }
    const res = await getCustomerInfo(
      groupCd.value,
      0,
      team.value,
      supervisor.value,
      storeCd.value,
      null,
      cond.value,
      cond2.value,
      cond8.value,
      null,
      cond3.value,
      cond4.value,
      cond9.value,
      cond6.value,
      cond5.value,
      cond7.value,
      null,
      null,
      null,
      sDate.value,
      eDate.value,
      sDate2.value,
      eDate2.value,
      sDate3.value,
      eDate3.value,
      cond11.value,
      cond12.value,
      cond13.value,
      cond14.value,
      cond18.value,
      cond19.value,
      cond15.value,
      cond16.value,
      cond10.value,
      cond17.value,
      pstore.value,
      cond21.value,
      cond20.value
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

const clickedRowData = async (e) => {
  const res = await getReceiptDataDetail2(e[1], e[2], e[0]);
  console.log(res);
  rowData2.value = res.data.List;
  rowData3.value = res.data.List2;
  rowData4.value = res.data.List3;
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
  if (rowData2.value.length > 0) {
    rowData2.value = [];
  }
  if (rowData3.value.length > 0) {
    rowData3.value = [];
  }
  if (rowData4.value.length > 0) {
    rowData4.value = [];
  }
  point1.value = "";
  point2.value = "";
  point3.value = "";
  point4.value = "";
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
