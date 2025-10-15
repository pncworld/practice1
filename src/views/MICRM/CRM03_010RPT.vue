/*--############################################################################
# Filename : CRM03_010RPT.vue                                                  
# Description : 고객관리 > 고객 실적 관리 > 고객메뉴군분석자료.                 
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
        <button @click="excelButton" class="button save w-auto excel">
          엑셀
        </button>
      </div>
    </div>
    <div
      class="grid grid-cols-1 grid-rows-4 bg-gray-200 rounded-lg h-48 items-start z-10 -space-x-20">
      <div class="justify-start flex space-x-36 items-start">
        <Datepicker2
          :mainName="'기간'"
          :initToday="1"
          class="-mt-3"
          ref="datepicker"
          :closePopUp="closePopUp"
          @endDate="endDate"
          @excelDate="excelDate"
          @startDate="startDate">
        </Datepicker2>
        <PickStoreSingle
          @lngStoreGroup="lngStoreGroup"
          @lngStoreAttrs="lngStoreAttrs"
          @lngStoreCode="lngStoreCode"
          @lngSupervisor="lngSupervisor"
          @lngStoreTeam="lngTeamCode"
          @excelStore="excelStore"></PickStoreSingle>
      </div>
      <div class="flex justify-start pl-[66px] space-x-5 items-center">
        <div>
          <Datepicker2
            :mainName="'가입일'"
            :disableBox="false"
            :removeDefault="true"
            @endDate="endDate2"
            @excelDate="excelDate2"
            @startDate="startDate2"></Datepicker2>
        </div>
      </div>
      <div class="flex justify-start pl-0 space-x-5 items-center">
        <div class="flex justify-center items-center">
          <div class="text-base font-semibold ml-32">지역</div>
          <select name="" id="" class="border w-32 h-8 ml-5" v-model="cond">
            <option value="0">전체</option>
            <option value="10">서울</option>
          </select>
        </div>
        <div class="flex justify-center items-center">
          <div class="text-base font-semibold ml-32">성별</div>
          <select name="" id="" class="border w-32 h-8 ml-5" v-model="cond2">
            <option :value="null">전체</option>
            <option value="1">남자</option>
            <option value="0">여자</option>
            <option value="2">외국인</option>
          </select>
        </div>

        <div class="flex justify-center items-center">
          <div class="text-base font-semibold ml-32">등급</div>
          <select name="" id="" class="border w-32 h-8 ml-5" v-model="cond3">
            <option value="0">전체</option>
            <option :value="i.intLevel" v-for="i in optionList">
              {{ i.strLevelName }}
            </option>
          </select>
        </div>

        <div class="flex justify-center items-center">
          <Datepicker2
            :mainName="'연령'"
            @endDate="endDate3"
            :removeDefault="true"
            :disableBox="false"
            :setLimitYear="true"
            @excelDate="excelDate3"
            @startDate="startDate3"></Datepicker2>
        </div>
      </div>
      <div class="flex justify-start pl-24 space-x-5 items-center">
        <div class="flex justify-start items-center ml-1">
          <!-- <div class="text-base font-semibold ml-32">메뉴구분 :</div>
          <select name="" id="" class="w-16 ml-1 h-8" v-model="cond4">
            <option value="1"><</option>
            <option value="2">=</option>
            <option value="3">></option>
          </select> -->
          <MenuGroup
            :storeCd="0"
            :groupCd="groupCd"
            @subCode="subCode"
            :initName="'메뉴구분'"
            @mainCode="mainCode"></MenuGroup>

          <input type="text" v-model="cond4" class="ml-5 h-8" />
        </div>

        <div class="flex justify-center items-center mt-1">
          <div class="text-base font-semibold ml-32">방문횟수</div>
          <select name="" id="" class="w-16 ml-5 h-8" v-model="cond5">
            <option value="1"><</option>
            <option value="2">=</option>
            <option value="3">></option>
          </select>

          <div class="flex ml-1 h-8 justify-center items-center">
            <input type="number" class="w-32 h-8" v-model="cond6" />
          </div>
        </div>
      </div>
    </div>
    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="w-full h-[60vh]">
      <div class="w-full h-[100%]">
        <Realgrid
          :progname="'CRM03_010RPT_VUE'"
          :progid="1"
          :rowData="rowData"
          :reload="reload"
          :documentTitle="'CRM03_010RPT'"
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
  getCustMenuAnalyInfo,
  getCustPointAnalyInfo,
  getInitDataCustPurchase,
} from "@/api/micrm";
import Datepicker2 from "@/components/Datepicker2.vue";
import MenuGroup from "@/components/menuGroup.vue";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
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

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
  groupCd.value = store.state.userData.lngStoreGroup;
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

const MainMenu = ref(0);
const mainCode = (e) => {
  MainMenu.value = e;
};

const SubMenu = ref(0);
const subCode = (e) => {
  SubMenu.value = e;
};
const store = useStore();
const cond = ref(0);
const cond2 = ref(null);
const cond3 = ref(0);
const optionList = ref([]);
const datepicker = ref(null);
const closePopUp = ref(false);

const cond4 = ref("");
const cond5 = ref(1);

const cond6 = ref("");
const cond7 = ref(null);

const cond8 = ref(1);
const cond9 = ref(null);
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

const teamcode = ref();
const lngTeamCode = (e) => {
  teamcode.value = e;
};
const supervisor = ref();
const lngSupervisor = (e) => {
  supervisor.value = e;
};
const storeCode = ref();
const lngStoreCode = (e) => {
  initGrid();
  storeCode.value = e;
};

const storeAttr = ref();
const lngStoreAttrs = (e) => {
  storeAttr.value = e;
};

const groupCd = ref();
const lngStoreGroup = (e) => {
  groupCd.value = e;
};
/**
 *  조회 함수
 */

const setGroupFooter = ref(false);
const hideColumnsId = ref([]);
const searchButton = async () => {
  try {
    store.state.loading = true;
    initGrid();

    const res = await getCustMenuAnalyInfo(
      groupCd.value,
      storeCode.value,
      sDate.value,
      eDate.value,
      cond.value,
      storeAttr.value,
      teamcode.value,
      supervisor.value,
      cond2.value,
      sDate2.value,
      eDate2.value,
      sDate3.value,
      eDate3.value,
      MainMenu.value,
      SubMenu.value,
      cond4.value,
      cond5.value,
      cond6.value,
      cond3.value
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
