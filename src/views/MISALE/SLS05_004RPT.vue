/*--############################################################################
# Filename : SLS05_004RPT.vue                                                  
# Description : 매출관리 > 카드별 매출 현황 > 카드 매출 집계 현황.              
# Date :2025-05-14                                                             
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
      class="grid grid-cols-2 grid-rows-1 justify-between bg-gray-200 rounded-lg h-32 items-start z-10">
      <div class="grid grid-cols-1 grid-rows-3">
        <div class="flex items-center">
          <label for="daily" class="font-thin inline-flex z-50">
            <input
              type="checkbox"
              id="daily"
              @change="seeDaily"
              class="ml-5 mt-2" />
          </label>
          <Datepicker2
            class="-ml-8"
            @startDate="startDate"
            @endDate="endDate"
            @acceptDate="acceptDate"
            :closePopUp="closePopUp"
            ref="datepicker"
            :selectedRadioBox="selectedRadioBox"
            :selectedGroup="selectedGroup"
            :orgAcceptDate="orgAcceptDate"
            @excelDate="excelDate"></Datepicker2>
        </div>
        <div
          class="flex justify-start items-center text-base text-nowrap font-semibold ml-16">
          매입사
          <div class="flex ml-5 space-x-3 mt-1">
            <v-select
              v-model="selectCardCorp"
              :options="cardCorp"
              placeholder="전체"
              label="strBuyName"
              class="w-48 !h-8 bg-white"
              clearable="true" />
          </div>
        </div>
        <div
          class="flex justify-start items-start text-base text-nowrap font-semibold ml-12">
          조회조건
          <div>
            <label for="saleDay" class="font-normal">
              <input
                type="radio"
                id="saleDay"
                value="01"
                v-model="selectedRadioBox"
                class="ml-5" />
              영업일
            </label>
          </div>
          <div>
            <label for="acceptDay" class="font-normal">
              <input
                type="radio"
                id="acceptDay"
                value="02"
                v-model="selectedRadioBox"
                class="ml-5" />
              승인일
            </label>
          </div>
        </div>
      </div>
      <div class="h-[75%] ml-5">
        <label for="daily" class="font-thin inline-flex">
          <input type="checkbox" id="daily" @change="seeStore" class="mt-1" />
          <pickStoreSingle
            @lngStoreCode="lngStoreCodes"
            @lngStoreGroup="lngStoreGroup"
            @lngStoreAttrs="lngStoreAttrs"
            @lngSupervisor="lngSupervisor"
            @lngStoreTeam="lngStoreTeam"
            @excelStore="excelStore" />
        </label>
      </div>
    </div>
    <!-- 조회조건 -->
    <!-- 그리드 영역-->
    <div class="w-full h-[82%]">
      <Realgrid
        :progname="'SLS05_004RPT_VUE'"
        :progid="progId"
        :rowData="rowData"
        :reload="reload"
        :setFooter="true"
        :documentTitle="'SLS05_004RPT'"
        :rowStateeditable="false"
        :setGroupColumnId="setGroupColumnId"
        :setGroupFooter="true"
        :documentSubTitle="documentSubTitle"
        :exporttoExcel="exportExcel">
      </Realgrid>
      <!-- <Realgrid :progname="'SLS05_004RPT_VUE'" :progid="1" :rowData="rowData" :reload="reload" 
         :setFooter="true" :setFooterExpressions="setFooterExpressions" :setFooterColID="setFooterColID"
         :exporttoExcel="exportExcel" :documentTitle="'SLS05_004RPT'" :documentSubTitle="documentSubTitle" 
      </Realgrid> -->
    </div>
  </div>
  <!-- 그리드 영역-->
</template>

<script setup>
import { getCardCorp, getCardSalesSumReport } from "@/api/misales";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

import Datepicker2 from "@/components/Datepicker2.vue";
/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";

/**
 *  단일 매장  컴포넌트
 *  */

import pickStoreSingle from "@/components/pickStoreSingle.vue";
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

import { onMounted, ref, watch } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";

const setGroupSumCustomColumnId = ref(["strBuyName"]);
const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);
const selectedstartDate = ref();
const selectedendDate = ref();
const orgAcceptDate = ref();

/**
 * 선택한 매출 시작일자
 */

const startDate = (e) => {
  //comsole.log(e);
  selectedstartDate.value = e;
  if (selectedRadioBox.value == "02") {
    if (selectedstartDate.value > orgAcceptDate.value) {
      Swal.fire({
        title: "경고",
        text: "승인일 기준 조회는 " + orgAcceptDate.value + "까지 가능합니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
    }
  }
};

/**
 * 선택한 매출 종료일자
 */

const endDate = (e) => {
  //comsole.log(e);
  selectedendDate.value = e;
  if (selectedRadioBox.value == "02") {
    if (selectedendDate.value > orgAcceptDate.value) {
      Swal.fire({
        title: "경고",
        text: "승인일 기준 조회는 " + orgAcceptDate.value + "까지 가능합니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
    }
  }
};

/**
 *  날짜 제한 함수
 */

const acceptDate = (e) => {
  //comsole.log(e);
  orgAcceptDate.value = e;
};

const setGroupColumnId = ref("");
const tempSeeDaily = ref(false);
const tempSeeStore = ref(false);
const reportCheckData = ref("0");
const progId = ref("1");

const seeDaily = (e) => {
  tempSeeDaily.value = e.target.checked;
  if (tempSeeStore.value == true) {
    setGroupColumnId.value = "strStoreName,dtmDate";
  } else {
    setGroupColumnId.value = "dtmDate";
  }
  updateProgid();
};

const seeStore = (e) => {
  tempSeeStore.value = e.target.checked;

  if (tempSeeDaily.value == true) {
    setGroupColumnId.value = "strStoreName,dtmDate";
  } else {
    setGroupColumnId.value = "strStoreName";
  }
  updateProgid();
};

const updateProgid = () => {
  if (tempSeeDaily.value && tempSeeStore.value) {
    reportCheckData.value = "012";

    progId.value = "4";
  } else if (tempSeeDaily.value) {
    reportCheckData.value = "01";

    progId.value = "2";
  } else if (tempSeeStore.value) {
    reportCheckData.value = "02";

    progId.value = "3";
  } else {
    reportCheckData.value = "0";

    progId.value = "1";
  }
};

const store = useStore();
const loginedstrLang = store.state.userData.lngLanguage;

const datepicker = ref(null);
const closePopUp = ref(false);
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

// 조회조건 라디오박스 이벤트 (영업일, 승인일)
const selectedRadioBox = ref("01"); // 기본 선택값

/**
 *  조회 함수
 */

const searchButton = async () => {
  store.state.loading = true;
  try {
    initGrid();

    //그리드 갱신
    reload.value = !reload.value;

    //매장 선택
    // let selectedStorearr;
    // if (selectedStores.value == undefined || selectedStores.value.length == 0 || selectedStores.value == 0) {
    //   selectedStorearr = 0
    // } else {
    //   selectedStorearr = selectedStores.value
    // }

    // //comsole.log(selectedStorearr)

    //매입사코드 선택 콤보박스
    let selectedBuyCodeValue;
    if (
      selectedBuyCode.value == undefined ||
      selectedBuyCode.value.length == 0 ||
      selectedBuyCode.value == 0
    ) {
      selectedBuyCodeValue = 0;
    } else {
      selectedBuyCodeValue = selectedBuyCode.value;
    }

    //comsole.log(selectedBuyCodeValue);

    //comsole.log(selectedRadioBox.value);

    //comsole.log(reportCheckData.value);

    const res = await getCardSalesSumReport(
      selectedGroup.value,
      selectedStoreAttrs.value,
      selectedStoreTeam.value,
      selectedStoreSuperVisor.value,
      selectedStores.value,
      selectedstartDate.value,
      selectedendDate.value,
      reportCheckData.value,
      selectedRadioBox.value,
      selectedBuyCodeValue
    );
    ////console.log(res);
    rowData.value = res.data.cardSalesSum;

    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    //comsole.log(error);
  } finally {
    store.state.loading = false;
  }
};

/* 매장 컴포넌트 관련 함수 */
const selectedGroup = ref();
const selectedStores = ref();
const selectedStoreAttrs = ref();
const selectedStoreTeam = ref();
const selectedStoreSuperVisor = ref();
/**
 * 페이지 매장 그룹 세팅
 */

const lngStoreGroup = (e) => {
  initGrid();
  //comsole.log(e);
  selectedGroup.value = e;
};
/**
 * 페이지 매장 코드 세팅
 */

const lngStoreCodes = (e) => {
  initGrid();
  selectCardCorp.value = null;
  selectedStores.value = e;
  //comsole.log(e);
};

/**
 * 페이지 매장 분류 세팅
 */

const lngStoreAttrs = (e) => {
  initGrid();
  selectedStoreAttrs.value = e;
  //comsole.log(e);
};
/**
 * 페이지 매장 슈퍼바이저 세팅
 */

const lngSupervisor = (e) => {
  initGrid();
  selectedStoreSuperVisor.value = e;
  //comsole.log(e);
};
/**
 * 페이지 매장 팀 세팅
 */

const lngStoreTeam = (e) => {
  initGrid();
  selectedStoreTeam.value = e;
  ////console.log(e);
};

/* 매입사 콤보박스 */
const selectCardCorp = ref(null);
const cardCorp = ref([]);
const selectedBuyCode = ref("");

/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getCardCorp(selectedGroup.value, selectedStores.value, 1);
  cardCorp.value = res.data.cardCorpList;
  //comsole.log(cardCorp.value);
});

watch([selectedGroup, selectedStores], async () => {
  //comsole.log(selectedGroup.value, selectedStores.value);
  const res = await getCardCorp(selectedGroup.value, selectedStores.value, 1);
  cardCorp.value = res.data.cardCorpList;
  //comsole.log(cardCorp.value);
});

watch(selectCardCorp, (newValue) => {
  selectedBuyCode.value = newValue ? newValue.strBuyCode : "";
  //comsole.log(selectedBuyCode.value);
});

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
  if (selectedExcelStore.value == "매장명 : 선택") {
    documentSubTitle.value = selectedExcelDate.value + "\n" + "매장명 : 전체";
  } else {
    documentSubTitle.value =
      selectedExcelDate.value + "\n" + selectedExcelStore.value;
  }
  //comsole.log(documentSubTitle.value);
  // 엑셀 기능 실행
  exportExcel.value = !exportExcel.value;
};

// 엑셀 추출
const documentSubTitle = ref("");
const selectedExcelDate = ref("");
/**
 * 엑셀용 일자 세팅 함수
 */

const excelDate = (e) => {
  selectedExcelDate.value = e;
  //comsole.log(e);
};
const selectedExcelStore = ref("");
/**
 * 엑셀용 매장 세팅 함수
 */

const excelStore = (e) => {
  selectedExcelStore.value = e;
  //comsole.log(e);
};
</script>
