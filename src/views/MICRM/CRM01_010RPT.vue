<!-- /*--############################################################################
# Filename : CRM01_010RPT.vue                                                  
# Description : 고객관리 > 고객신상정보 > 고객 가입 현황.                 
# Date :2025-06-18                                                             
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
      class="grid grid-cols-[2fr,2fr,1fr] grid-rows-1 bg-gray-200 rounded-lg h-20 items-center z-10 space-x-5">
      <div class="justify-start flex items-center -space-x-10">
        <div class="pl-7 z-50">
          <input type="checkbox" v-model="cond" @input="cond = !cond" />
        </div>
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

      <div class="h-[75%] justify-start items-center flex space-x-2">
        <div class="pl-2 z-50">
          <input type="checkbox" v-model="cond2" @input="cond2 = !cond2" />
        </div>
        <PickStoreSingle
          @lngStoreGroup="lngStoreGroup"
          @lngStoreCode="lngStoreCode"
          @lngStoreAttrs="lngStoreAttrs"
          @lngStoreTeam="lngStoreTeam"
          @excelStore="excelStore"
          @lngSupervisor="lngSupervisor"></PickStoreSingle>
      </div>
      <div class="flex justify-start items-center !ml-12">
        <span class="text-base font-semibold">등급 </span>
        <select name="" id="" class="border w-32 h-7 ml-2" v-model="cond3">
          <option value="0">전체</option>
          <option :value="i.intLevel" v-for="i in optionList">
            {{ i.strLevelName }}
          </option>
        </select>
      </div>
    </div>
    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="w-full h-[75vh]">
      <div class="w-full h-[80%]">
        <Realgrid
          :progname="'CRM01_010RPT_VUE'"
          :progid="1"
          :rowData="rowData"
          :reload="reload"
          :setFooterCustomColumnId="['strStoreName']"
          :hideColumnsId="hideColumnsId"
          :setFooterCustomText="['합계']"
          :setGroupSumCustomColumnId="['strStoreName']"
          :setGroupSumCustomText="['일자별']"
          :setFooter="setFooter"
          :setGroupFooter="setGroupFooter"
          :setMergeMode="false"
          :setGroupColumnId="'dtmDate'"
          :documentTitle="'CRM01_010RPT'"
          :documentSubTitle="documentSubTitle"
          :rowStateeditable="false"
          @buttonClicked="buttonClicked"
          :exporttoExcel="exportExcel">
        </Realgrid>
      </div>
    </div>
  </div>
  <CustomerSearch
    v-if="visible"
    @lngCustNo="lngCustNo"
    @strCustName="strCustName"
    @closePopUp="visible = false"
    :joinSts="3"></CustomerSearch>
  <!-- 그리드 영역 -->
</template>

<script setup>
import {
  getInitDataCustPurchase,
  getRegisterCustomer,
  getStopCustList,
  restoreCustomor,
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

import { onMounted, ref, watch } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";
/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getInitDataCustPurchase(store.state.userData.lngStoreGroup);
  optionList.value = res.data.List;
});

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);
const visible = ref(false);
const rowData2 = ref([]);
const rowData3 = ref([]);
const rowData4 = ref([]);
const condValue = ref(0);
const store = useStore();
const cond = ref(false);
const cond2 = ref(false);
const cond3 = ref(0);
const optionList = ref([]);
const datepicker = ref(null);
const closePopUp = ref(false);
const setFooter = ref(false);
const groupCd = ref(0);
const storeCd = ref(0);
const joinType = ref(0);
const superVisor = ref(0);
const TeamCd = ref(0);

const lngSupervisor = (e) => {
  superVisor.value = e;
};
const lngStoreTeam = (e) => {
  TeamCd.value = e;
};
const lngStoreAttrs = (e) => {
  joinType.value = e;
};
const lngStoreCode = (e) => {
  storeCd.value = e;
};
const lngStoreGroup = (e) => {
  groupCd.value = e;
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

    if (cond.value == true) {
      hideColumnsId.value = [];
    } else {
      hideColumnsId.value = ["dtmDate"];
    }
    if (cond2.value == true && cond.value == true) {
      hideColumnsId.value = [];
      setFooter.value = true;
    } else if (cond2.value == false && cond.value == false) {
      hideColumnsId.value = [
        "lngStoreGroup",
        "strSubLeaseName",
        "strTeamName",
        "strSupervisorName",
        "lngStoreCode",
        "strStoreName",
      ];
      cond.value = true;
      setFooter.value = false;
    }

    if (cond.value == true && cond2.value == true) {
      setGroupFooter.value = true;
    } else {
      setGroupFooter.value = false;
    }
    const res = await getRegisterCustomer(
      groupCd.value,
      storeCd.value,
      joinType.value,
      superVisor.value,
      TeamCd.value,
      sDate.value,
      eDate.value,
      cond3.value,
      cond.value == true ? 1 : 0
    );

    rowData.value = res.data.List;
    ////console.log(res);
    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    //comsole.log(error);
  } finally {
    store.state.loading = false;
  }
};

const buttonClicked = async (e) => {
  try {
    const res = await restoreCustomor(
      store.state.userData.lngStoreGroup,
      e[8],
      store.state.userData.lngSequence
    );
    ////console.log(res);
  } catch (error) {
  } finally {
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
