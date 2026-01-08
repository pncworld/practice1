/*--############################################################################
# Filename : SLS16_001RPT.vue                                                  
# Description : 매출관리 > 기타 매출 현황 > 이벤트 쿠폰 집계현황.              
# Date :2026-01-07                                                             
# Author : 권지안                     
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
      class="grid grid-cols-2 grid-rows-1 justify-between bg-gray-200 rounded-lg h-24 items-start z-10">
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
            :closePopUp="closePopUp"
            ref="datepicker"
            :selectedGroup="selectedGroup"
            @excelDate="excelDate" />
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
        :progname="'SLS16_001RPT_VUE'"
        :progid="progId"
        :rowData="rowData"
        :reload="reload"
        :setFooter="true"
        :documentTitle="'SLS16_001RPT'"
        :rowStateeditable="false"
        :setGroupColumnId="setGroupColumnId"
        :setGroupFooter="true"
        :documentSubTitle="documentSubTitle"
        :exporttoExcel="exportExcel">
      </Realgrid>
    </div>
    <!-- 그리드 영역-->
  </div>
</template>

<script setup>
import { getEventCouponSumReport } from "@/api/misales";
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

/**
 * 선택한 매출 시작일자
 */

const startDate = (e) => {
  //comsole.log(e);
  selectedstartDate.value = e;
};

/**
 * 선택한 매출 종료일자
 */

const endDate = (e) => {
  //comsole.log(e);
  selectedendDate.value = e;
};

const setGroupColumnId = ref("");
const tempSeeDaily = ref(false);
const tempSeeStore = ref(false);
const saleDateChk = ref("0");
const saleStoreChk = ref("0");
const progId = ref("4");

const seeDaily = (e) => {
  tempSeeDaily.value = e.target.checked;
  if (tempSeeStore.value == true) {
    setGroupColumnId.value = "strName,dtmDate";
  } else {
    setGroupColumnId.value = "dtmDate";
  }
  updateProgid();
};

const seeStore = (e) => {
  tempSeeStore.value = e.target.checked;

  if (tempSeeDaily.value == true) {
    setGroupColumnId.value = "strName,dtmDate";
  } else {
    setGroupColumnId.value = "strName";
  }
  updateProgid();
};


const updateProgid = () => {
  if (tempSeeDaily.value && tempSeeStore.value) {
    saleDateChk.value = "1";
    saleStoreChk.value = "1";

    progId.value = "1";
  } else if (tempSeeDaily.value) {
    saleDateChk.value = "1";
    saleStoreChk.value = "0";

    progId.value = "2";
  } else if (tempSeeStore.value) {
    saleDateChk.value = "0";
    saleStoreChk.value = "1";

    progId.value = "3";
  } else {
    saleDateChk.value = "0";
    saleStoreChk.value = "0";

    progId.value = "4";
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

/**
 *  조회 함수
 */

const searchButton = async () => {
  store.state.loading = true;
  try {
    initGrid();

    //그리드 갱신
    reload.value = !reload.value;

    const res = await getEventCouponSumReport(
      selectedGroup.value,
      selectedStoreAttrs.value,
      selectedStoreTeam.value,
      selectedStoreSuperVisor.value,
      selectedStores.value,
      selectedstartDate.value,
      selectedendDate.value,
      saleDateChk.value,
      saleStoreChk.value
    );
    
    // console.log(res);
    // dtmDate 필드를 YYYY-MM-DD 형식으로 포맷팅
    rowData.value = res.data.eventCouponSum.map((item) => {
      if (item.dtmDate) {
        item.dtmDate = item.dtmDate.split(" ")[0];
      }
      return item;
    });

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


/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
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
