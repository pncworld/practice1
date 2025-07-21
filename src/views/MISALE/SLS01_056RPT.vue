<!-- /*--############################################################################
# Filename : SLS01_056RPT.vue                                                  
# Description : 매출관리 > 코너별 매출 현황 > 코너별 결제 형태별 매출 현황      
# Date :2025-05-14                                                             
# Author : 권맑음                     
################################################################################*/ -->
<template>
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
      class="grid grid-rows-1 grid-cols-[0.1fr,10fr,1fr,10fr] justify-between bg-gray-200 rounded-lg h-24 items-start z-10">
      <input type="checkbox" class="mt-5 ml-2" @click="checkDate" />
      <div class="grid grid-cols-1 grid-rows-2 ml-10">
        <Datepicker2
          @endDate="endDate"
          @startDate="startDate"
          @excelDate="excelDate"
          :initToday="1"
          class="!-ml-16"
          :closePopUp="closePopUp"
          ref="datepicker"></Datepicker2>
        <div
          class="flex justify-start -ml-6 items-center space-x-5 text-nowrap">
          <div class="text-base font-semibold ml-2">조회조건</div>
          <label for="sum"
            ><input
              id="sum"
              type="checkbox"
              @click="checkSum"
              checked />합계</label
          >
          <label for="unite"
            ><input
              id="unite"
              type="checkbox"
              @click="checkUnite"
              checked />셀병합</label
          >
        </div>
      </div>
      <div class="mt-5">
        <input type="checkbox" :value="1" @click="updateShowStore" />
      </div>
      <div class="">
        <PickStoreCorner
          @lngStoreGroup="lngStoreGroup"
          @lngStoreCode="lngStoreCode"
          @lngAreaCode="lngAreaCode"
          @excelStore="excelStore"></PickStoreCorner>
      </div>
    </div>

    <div class="h-[80%] mt-5">
      <Realgrid
        :progname="'SLS01_056RPT_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :selectionStyle="'singleRow'"
        :hideColumnsId="hideColumnsId"
        :setFooter="true"
        :documentTitle="'SLS01_056RPT'"
        :setGroupFooter="setGroupFooter"
        :setGroupSumCustomColumnId3="setGroupSumCustomColumnId3"
        :customStyleColumnID="['strStore', 'dtmDate', 'strCorner']"
        :setGroupColumnId="setGroupColumnId"
        :setMergeMode="false"
        :setRowGroupSpan2="setRowGroupSpan2"
        :documentSubTitle="documentSubTitle"
        :rowStateeditable="false"
        :exporttoExcel="exporttoExcel"></Realgrid>
    </div>
  </div>
</template>

<script setup>
import { getSalesByCorner, getSalesByCornerPayType } from "@/api/misales";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

import Datepicker2 from "@/components/Datepicker2.vue";
/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
import PickStoreCorner from "@/components/pickStoreCorner.vue";
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

  // Swal.fire({

  // });
});

const setGroupSumCustomColumnId3 = ref(["strCorner"]);
const documentSubTitle = ref();
const selectedExcelDate = ref();
const selectedExcelStore = ref();
const selectedstartDate = ref();
const selectedendDate = ref();
const setRowGroupSpan2 = ref("strStore,dtmDate,strCorner");
const selectedEndYear = ref();
const selectedStartYear = ref();
const selectedEndMonth = ref();
const reload = ref(false);
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
const lngareacode = ref();
const maxSaleTarget = ref("");
const checked = ref(0);
const setGroupFooter = ref(true);
const hideColumnsId = ref(["dtmDate", "strStore"]);
/**
 * 페이지 매장 그룹 세팅
 */

const lngStoreGroup = (e) => {
  lngstoregroup.value = e;
  //comsole.log(e);
};

/**
 * 페이지 매장 코드 세팅
 */

const lngStoreCode = (e) => {
  initGrid();
  lngstorecode.value = e;
  //comsole.log(e);
};
const lngAreaCode = (e) => {
  initGrid();
  lngareacode.value = e;
  //comsole.log(e);
};
const receiptNo = ref();
const initCheckBox = ref(false);
const setGroupColumnId = ref("strCorner");
const store = useStore();
const loginedstrLang = store.state.userData.lngLanguage;
//comsole.log(store);

const afterSearch = ref(false);
/**
 *  조회 함수
 */

const searchButton = async () => {
  // initCheckBox.value = !initCheckBox.value
  // initSearchWord.value = !initSearchWord.value
  if (lngstorecode.value == 0) {
    Swal.fire({
      title: "경고",
      text: "매장을 선택하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  try {
    store.state.loading = true;
    initGrid();
    let reporttype;
    if (checkdate.value == true && checkStore.value == true) {
      reporttype = 123;
    } else if (checkdate.value == true && checkStore.value == false) {
      reporttype = 13;
    } else if (checkdate.value == false && checkStore.value == true) {
      reporttype = 23;
    } else {
      reporttype = 3;
    }
    reload.value = !reload.value;
    //comsole.log(setGroupColumnId.value);
    const res = await getSalesByCornerPayType(
      lngstoregroup.value,
      lngstorecode.value,
      lngareacode.value,
      selectedstartDate.value,
      selectedendDate.value,
      reporttype
    );
    //comsole.log(res);

    rowData.value = res.data.List;

    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    //comsole.log(error);
  } finally {
    store.state.loading = false;
  }
};
const groupCd = ref();
const storeCd = ref();
const dtmDate = ref();
const init = ref(false);

const rowData = ref([]);

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

  let cond = "조회조건 : ";
  if (setGroupFooter.value == true) {
    cond += "합계,";
  }
  if (setRowGroupSpan2.value !== "") {
    cond += "셀병합,";
  }
  cond = cond.substring(0, cond.length - 1);

  documentSubTitle.value =
    selectedExcelDate.value + "\n" + selectedExcelStore.value + "\n" + cond;
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
const checkStore = ref(false);
const updateShowStore = (e) => {
  if (e.target.checked) {
    if (hideColumnsId.value.includes("dtmDate")) {
      hideColumnsId.value = ["dtmDate"];
    } else {
      hideColumnsId.value = [];
    }

    if (setGroupColumnId.value.includes("dtmDate")) {
      setGroupColumnId.value = "dtmDate,strStore,strCorner";
    } else {
      setGroupColumnId.value = "strStore,strCorner";
    }
    checkStore.value = true;
    if (setGroupSumCustomColumnId3.value.includes("dtmDate")) {
      setGroupSumCustomColumnId3.value = ["dtmDate", "strStore", "strCorner"];
    } else {
      setGroupSumCustomColumnId3.value = ["strStore", "strCorner"];
    }
  } else {
    if (hideColumnsId.value.includes("dtmDate")) {
      hideColumnsId.value = ["dtmDate", "strStore"];
    } else {
      hideColumnsId.value = ["strStore"];
    }

    if (setGroupColumnId.value.includes("dtmDate")) {
      setGroupColumnId.value = "dtmDate,strCorner";
    } else {
      setGroupColumnId.value = "strCorner";
    }
    checkStore.value = false;
    if (setGroupSumCustomColumnId3.value.includes("dtmDate")) {
      setGroupSumCustomColumnId3.value = ["dtmDate", "strCorner"];
    } else {
      setGroupSumCustomColumnId3.value = ["strCorner"];
    }
  }
};
const checkdate = ref(false);
const checkDate = (e) => {
  if (e.target.checked) {
    if (hideColumnsId.value.includes("strStore")) {
      hideColumnsId.value = ["strStore"];
    } else {
      hideColumnsId.value = [];
    }

    if (setGroupColumnId.value.includes("strStore")) {
      setGroupColumnId.value = "dtmDate,strStore,strCorner";
    } else {
      setGroupColumnId.value = "dtmDate,strCorner";
    }
    checkdate.value = true;
    if (setGroupSumCustomColumnId3.value.includes("strStore")) {
      setGroupSumCustomColumnId3.value = ["dtmDate", "strStore", "strCorner"];
    } else {
      setGroupSumCustomColumnId3.value = ["dtmDate", "strCorner"];
    }
  } else {
    if (hideColumnsId.value.includes("strStore")) {
      hideColumnsId.value = ["strStore", "dtmDate"];
    } else {
      hideColumnsId.value = ["dtmDate"];
    }

    if (setGroupColumnId.value.includes("strStore")) {
      setGroupColumnId.value = "strStore,strCorner";
    } else {
      setGroupColumnId.value = "strCorner";
    }
    checkdate.value = false;
    if (setGroupSumCustomColumnId3.value.includes("strStore")) {
      setGroupSumCustomColumnId3.value = ["strStore", "strCorner"];
    } else {
      setGroupSumCustomColumnId3.value = ["strCorner"];
    }
  }
};
const checkUnite = (e) => {
  if (e.target.checked) {
    setRowGroupSpan2.value = "dtmDate,strStore,strCorner";
  } else {
    setRowGroupSpan2.value = "";
  }
  reload.value = !reload.value;
};
const checkSum = (e) => {
  if (e.target.checked) {
    setGroupFooter.value = true;
  } else {
    setGroupFooter.value = false;
  }
  reload.value = !reload.value;
};
</script>
