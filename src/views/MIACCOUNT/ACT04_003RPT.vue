/*--############################################################################
# Filename : ACT04_003RPT.vue                                                  
# Description : 입출금관리 > 입출금 관리 >입출금 집계 현황                     
# Date :2025-05-21                                                             
# Author : 권맑음                     
################################################################################*/
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
      class="grid grid-cols-2 grid-rows-1 justify-between bg-gray-200 rounded-lg h-24 items-start z-10">
      <div class="grid grid-cols-1 grid-rows-2">
        <Datepicker2
          @endDate="endDate"
          @startDate="startDate"
          :closePopUp="closePopUp"
          ref="datepicker"
          @excelDate="excelDate"
          :mainName="'기간'"
          :initToday="1"></Datepicker2>
        <div class="flex space-x-3 text-base font-semibold ml-12 mt-3">
          <div class="space-x-3">
            <label for="sum"
              ><input
                type="checkbox"
                id="sum"
                v-model="cond"
                @click="checkCond" />소계</label
            >
            <label for="cellUnite"
              ><input
                type="checkbox"
                id="cellUnite"
                v-model="cond2"
                @click="checkCond2" />셀병합</label
            >
          </div>
        </div>
      </div>
      <div class="">
        <PickStoreSingle
          @lngStoreCode="lngStoreCodes"
          @lngStoreGroup="lngStoreGroup"
          @excelStore="excelStore"
          @lngStoreAttrs="lngStoreAttrs"
          @changeInit="changeInit">
        </PickStoreSingle>
      </div>
      <div></div>
    </div>

    <div class="w-full h-[80%]">
      <Realgrid
        :progname="'ACT04_003RPT_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :setRowGroupSpan2="setRowGroupSpan2"
        :documentTitle="'ACT04_003RPT'"
        :setFooter="true"
        :rowStateeditable="false"
        :setGroupFooter="cond"
        :setGroupColumnId="'strName,dtmDate'"
        :setFooterCustomColumnId="['strName']"
        :setFooterCustomText="['총합계']"
        :documentSubTitle="documentSubTitle"
        :exporttoExcel="exportExcel">
      </Realgrid>
    </div>
  </div>
</template>

<script setup>
import {
  getAccCodeList,
  getDWAggDetail,
  getDWDetail,
  getEmployeeSummary,
} from "@/api/account";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

import Datepicker2 from "@/components/Datepicker2.vue";
/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
/**
 *  매장 선택 컴포넌트
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
/*
 * 공통 표준  Function
 */

import { onMounted, ref } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";

const setRowGroupSpan = ref("");
const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);
const selectedstartDate = ref();
const selectedendDate = ref();
const hideColumnNow = ref(true);
const setGroupColumnId = ref("strName");
const CondList = ref([]);
const selectedCond = ref(0);
const setRowGroupSpan2 = ref("strName");
const mergeMask = ref("lngStoreCode");
const cond2 = ref(true);
const cond = ref(true);

const checkCond = (e) => {
  if (e.target.checked) {
    cond.value = true;

    reload.value = !reload.value;
  } else {
    reload.value = !reload.value;
    cond.value = false;
  }
};
const checkCond2 = (e) => {
  if (e.target.checked) {
    cond2.value = true;
    setRowGroupSpan2.value = "strName";
    reload.value = !reload.value;
  } else {
    setRowGroupSpan2.value = "";
    reload.value = !reload.value;
    cond2.value = false;
  }
};
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
  selectedendDate.value = e;
};
const empId = ref("");
const empName = ref("");
const startTime = ref(0);
const endTime = ref(23);
const setGroupFooter = ref(true);
const selectedCause = ref(null);
const store = useStore();
const causeList = ref([]);
const tranType = ref(1);
const lngOption = ref(0);
const optionValue = ref("");
/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const userGroup = store.state.storeGroup[0].lngStoreGroup;

  //   const res = await getCauseList(userGroup, 0);
  //   causeList.value = res.data.List;
  //   //comsole.log(res);

  // const res2 = await getAccCodeList(userGroup);
  // ////console.log(res2);
  // CondList.value = res2.data.List;
});

const loginedstrLang = store.state.userData.lngLanguage;
/**
 *  조회 함수
 */

const searchButton = async () => {
  store.state.loading = true;
  try {
    initGrid();

    // if(tempSum.value == true){
    //   setGroupFooter.value = true
    // } else {
    //   setGroupFooter.value = false
    // }

    reload.value = !reload.value;

    const res = await getDWAggDetail(
      selectedGroup.value,
      selectedStores.value,
      selectedstartDate.value,
      selectedendDate.value
    );
    ////console.log(res);
    rowData.value = res.data.List;

    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
  } finally {
    store.state.loading = false;
  }
};

const selectedGroup = ref();
const selectedStores = ref();
const selectedStoreAttrs = ref();
/**
 * 페이지 매장 그룹 세팅
 */

const lngStoreGroup = (e) => {
  //comsole.log(e);
  selectedGroup.value = e;
};
/**
 * 페이지 매장 코드 세팅
 */

const lngStoreCodes = (e) => {
  selectedStores.value = e;
  //comsole.log(e);
};

/**
 * 페이지 매장 분류 세팅
 */

const lngStoreAttrs = (e) => {
  selectedStoreAttrs.value = e;
  //comsole.log(e);
};

/**
 * 그리드 초기화
 */

const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
};

const exportExcel = ref(false);

//comsole.log(store.state.minorCategory);

/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  documentSubTitle.value =
    selectedExcelDate.value + "\n" + selectedExcelStore.value;
  //comsole.log(documentSubTitle.value);
  exportExcel.value = !exportExcel.value;
};

const resetVselect2 = () => {
  endTime.value = 23;
};
const datepicker = ref(null);
const employee = ref(null);
const button = ref(null);
const closePopUp = ref(false);
/**
 * 매출 일자 안 라디오박스 닫기 위한 외부 클릭 감지 함수
 */

const handleParentClick = (e) => {
  const datepickerEl = datepicker.value?.$el;
  const employeeEl = employee.value?.$el;

  if (datepickerEl && datepickerEl.contains(e.target)) {
    return;
  }
  if (employeeEl && employeeEl.contains(e.target)) {
    return;
  }
  if (e.target.closest("button")) {
    return;
  }
  open.value = false;
  closePopUp.value = !closePopUp.value;
};
const documentSubTitle = ref("");
const selectedExcelDate = ref("");
/**
 * 엑셀용 일자 세팅 함수
 */

const excelDate = (e) => {
  selectedExcelDate.value = e;
};
const selectedExcelStore = ref("");
/**
 * 엑셀용 매장 세팅 함수
 */

const excelStore = (e) => {
  selectedExcelStore.value = e;
};
const tempHideStore = ref(true);

const tempCellUnite = ref(true);
const cellUnite = (e) => {
  if (e.target.checked) {
    tempCellUnite.value = true;
    setRowGroupSpan.value = "strName";
  } else {
    tempCellUnite.value = false;
    setRowGroupSpan.value = "";
  }
  reload.value = !reload.value;
};
const tempSum = ref(false);
const showSum = (e) => {
  if (e.target.checked) {
    setGroupColumnId.value = "strName";
    setGroupFooter.value = true;
    reload.value = !reload.value;
  } else {
    setGroupColumnId.value = "";
    setGroupFooter.value = false;
    reload.value = !reload.value;
  }
};
/**
 *  컴포넌트 변동시 감지 함수
 */

const changeInit = (e) => {
  initGrid();
};
const custName = (e) => {
  empName.value = e;
};
const custId = (e) => {
  empId.value = e;
};
const open = ref(false);
const openPopUp = (e) => {
  empName.value = "";
  empId.value = "";
  open.value = true;
};
const updateOpen = (e) => {
  open.value = false;
};
const resetOptionValue = (e) => {
  if (e.target.value == 0) {
    optionValue.value = "";
  }
};

const resetInputBox = (e) => {
  if (e.keyCode === 8 || e.keyCode === 46) {
    empId.value = "";
    empName.value = "";
  }
};
</script>

<style></style>
