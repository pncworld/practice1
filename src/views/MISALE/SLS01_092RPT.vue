/*--############################################################################
# Filename : SLS01_092RPT.vue                                                  
# Description : 매출관리 > 매출 목표 관리 > 일별 계획 대비 현황.               
# Date :2025-05-14                                                             
# Author : 권맑음                     
################################################################################*/
<template>
  <!-- 조회조건 -->
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
    class="grid grid-rows-1 grid-cols-[7fr,0.1fr,7fr] justify-start bg-gray-200 rounded-lg h-24 items-start z-10">
    <div class="grid grid-cols-1 grid-rows-2">
      <Datepicker2
        @startDate="startDate"
        @endDate="endDate"
        @excelDate="excelDate"
        :initToday="1"
        class="">
      </Datepicker2>
      <div class="flex justify-start items-center ml-12 space-x-5 text-nowrap">
        <div class="text-base font-semibold">매출목표</div>
        <input
          type="text"
          class="rounded-lg pl-1 h-8 text-right disabled:bg-white"
          v-model="maxSaleTarget"
          disabled />
        <div class="text-base font-semibold">매출구분 :</div>
        <label for="showSale1"
          ><input
            type="radio"
            id="showSale1"
            name="showSale"
            v-model="checked"
            :value="0" />실매출</label
        >
        <label for="showSale2"
          ><input
            id="showSale2"
            name="showSale"
            type="radio"
            v-model="checked"
            :value="1" />순매출</label
        >
      </div>
    </div>
    <div class="mt-8">
      <input type="checkbox" :value="1" @click="updateShowStore" />
    </div>
    <div>
      <PickStoreSingle
        @lngStoreGroup="lngStoreGroup"
        @lngSupervisor="lngSupervisor"
        @lngStoreTeam="lngStoreTeam"
        @lngStoreAttrs="lngStoreAttrs"
        @lngStoreCode="lngStoreCode"
        @excelStore="excelStore"></PickStoreSingle>
    </div>
  </div>
  <!-- 조회조건 -->
  <!-- 그리드 영역 -->
  <div class="h-[80%] mt-5">
    <Realgrid
      :progname="'SLS01_092RPT_VUE'"
      :progid="progid"
      :rowData="rowData"
      :selectionStyle="'singleRow'"
      :setRowStyleCalls="true"
      :setRowStyleLevel="2"
      :reload="reload"
      :hideColumnsId="hideColumnsId"
      :setFooter="true"
      :documentTitle="'SLS01_092RPT'"
      :setMergeMode="false"
      :rowStateeditable="false"
      :documentSubTitle="documentSubTitle"
      :exporttoExcel="exporttoExcel"></Realgrid>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import { getPlanbyDays, getPlanbyTime } from "@/api/misales";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

import Datepicker2 from "@/components/Datepicker2.vue";
/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
/**
 *  매장 단일 선택 컴포넌트
 *  */

import PickStoreSingle from "@/components/pickStoreSingle.vue";
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

const selectedDate = ref();
const documentSubTitle = ref();
const selectedExcelDate = ref();
const selectedExcelStore = ref();
const selectedstartDate = ref();
const selectedendDate = ref();
const customFooterShowLast = ref(true);
const progid = ref(1);
/**
 * 선택한 매출 시작일자
 */

const startDate = (e) => {
  selectedstartDate.value = e;
};
/**
 * 선택한 매출 종료일자
 */

const endDate = (e) => {
  selectedendDate.value = e;
};

/**
 * 엑셀용 일자 세팅 함수
 */

const excelDate = (e) => {
  selectedExcelDate.value = e;
};
/**
 * 엑셀용 매장 세팅 함수
 */

const excelStore = (e) => {
  selectedExcelStore.value = e;
};
const lngstoregroup = ref();
const lngstoreattr = ref();
const lngstoreteam = ref();
const lngstoresupervisor = ref();
const lngstorecode = ref();
const maxSaleTarget = ref("");
const checked = ref(0);
const setGroupFooter = ref(false);
const hideColumnsId = ref(["strStore"]);
/**
 * 페이지 매장 그룹 세팅
 */

const lngStoreGroup = (e) => {
  lngstoregroup.value = e;
  //comsole.log(e);
  initGrid();
};

/**
 * 페이지 매장 분류 세팅
 */

const lngStoreAttrs = (e) => {
  lngstoreattr.value = e;
  //comsole.log(e);
  initGrid();
};
/**
 * 페이지 매장 팀 세팅
 */

const lngStoreTeam = (e) => {
  lngstoreteam.value = e;
  //comsole.log(e);
  initGrid();
};
/**
 * 페이지 매장 슈퍼바이저 세팅
 */

const lngSupervisor = (e) => {
  lngstoresupervisor.value = e;
  //comsole.log(e);
  initGrid();
};
/**
 * 페이지 매장 코드 세팅
 */

const lngStoreCode = (e) => {
  lngstorecode.value = e;
  //comsole.log(e);
  initGrid();
};

const receiptNo = ref();
const initCheckBox = ref(false);
const setGroupColumnId = ref("strStore");
const store = useStore();
const reload = ref(false);
//comsole.log(store);

const afterSearch = ref(false);
/**
 *  조회 함수
 */

const searchButton = async () => {
  // initCheckBox.value = !initCheckBox.value
  // initSearchWord.value = !initSearchWord.value
  // if (storeCd.value == 0) {
  //     Swal.fire({
  //         title: '경고',
  //         text: '매장을 선택하세요.',
  //         icon: 'warning',
  //         confirmButtonText: '확인'
  //     })
  //     return;
  // }
  store.state.loading = true;
  try {
    initGrid();
    let barea;
    if (hideColumnsId.value.includes("strStore")) {
      barea = 0;
    } else {
      barea = 1;
    }
    if (hideColumnsId.value.includes("strStore")) {
      progid.value = 1;
    } else {
      progid.value = 2;
    }
    reload.value = !reload.value;
    //comsole.log(lngstoregroup.value);
    //comsole.log(lngstoreattr.value);
    //comsole.log(lngstoreteam.value);
    //comsole.log(lngstoresupervisor.value);
    //comsole.log(lngstorecode.value);
    //comsole.log(selectedstartDate.value);
    //comsole.log(selectedendDate.value);
    //comsole.log(barea);
    //comsole.log(checked.value);
    const res = await getPlanbyDays(
      lngstoregroup.value,
      lngstoreattr.value,
      lngstoreteam.value,
      lngstoresupervisor.value,
      lngstorecode.value,
      selectedstartDate.value,
      selectedendDate.value,
      barea,
      checked.value
    );
    //comsole.log(res);

    rowData.value = res.data.List;
    if (rowData.value.length > 0) {
      maxSaleTarget.value = rowData.value
        .map((i) => i.lngProject)[0]
        .toLocaleString();
    }

    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
  } finally {
    store.state.loading = false;
  }
};
const groupCd = ref();
const storeCd = ref();
const dtmDate = ref();
const init = ref(false);
/**
 * 선택한 매장 코드 호출 함수
 */

const selectedStoreCd = (e) => {
  //comsole.log(e);
  storeCd.value = e;

  initGrid();
  selectedPosNo.value = "0";
  receiptNo.value = "";
  init.value = !init.value;
};
/**
 * 선택한 매장 그룹 코드 호출 함수
 */

const selectedGroupCd = (e) => {
  //comsole.log(e);
  groupCd.value = e;
};
const rowData = ref([]);
const rowData2 = ref([]);
const rowData3 = ref([]);
const rowData4 = ref([]);

const selectedPosNo = ref();
/**
 * 선택한 포스 번호 호출 함수
 */

const posNo = (e) => {
  //comsole.log(e);
  if (e == null) {
    selectedPosNo.value = 0;
  } else {
    selectedPosNo.value = e;
  }
};

const disCountCd = ref("");
/**
 * 선택한 할인 코드 호출 함수
 */

const DisCountCd = (e) => {
  //comsole.log(e);
  if (e == null) {
    disCountCd.value = 0;
  } else {
    disCountCd.value = e;
  }
};

const payCd = ref("");
/**
 * 선택한 결제 코드 호출 함수
 */

const selectedpayCd = (e) => {
  if (e == null) {
    payCd.value = 0;
  } else {
    payCd.value = e;
  }
};

const exporttoExcel = ref(false);
/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 진행해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  let cond = "매출목표 : ";
  if (maxSaleTarget.value != "") {
    cond += maxSaleTarget.value;
  }

  let cond2 = "매출구분 : ";
  if (checked.value == 0) {
    cond2 += "실매출";
  } else {
    cond2 += "순매출";
  }
  documentSubTitle.value =
    selectedExcelDate.value +
    "\n" +
    selectedExcelStore.value +
    "\n" +
    cond +
    "\n" +
    cond2;
  exporttoExcel.value = !exporttoExcel.value;
};
/**
 * 그리드 초기화
 */

const initGrid = () => {
  //comsole.log(rowData.value);
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
};
const updateShowStore = (e) => {
  if (e.target.checked) {
    hideColumnsId.value = [];
  } else {
    hideColumnsId.value = ["strStore"];
  }
};
</script>
