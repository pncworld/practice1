/*--############################################################################
# Filename : SLS08_002RPT.vue                                                  
# Description : 매출관리 > 매출 정정 현황 > 주문 취소 현황.                    
# Date :2025-05-14                                                             
# Author : 권맑음                     
################################################################################*/
<template>
  <!-- 조회 조건 -->
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
        <Datepicker2
          class=""
          @endDate="endDate"
          @startDate="startDate"
          :closePopUp="closePopUp"
          ref="datepicker"
          @excelDate="excelDate"></Datepicker2>
        <div class="flex justify-between items-center text-nowrap ml-20 -mt-2">
          <div class="text-nowrap flex justify-start items-center space-x-5">
            <div class="text-base font-semibold">조건</div>
            <div class="flex space-x-10">
              <label for="store"
                ><input
                  type="checkbox"
                  id="store"
                  @click="showStore" />매장명</label
              >
              <label for="unite"
                ><input
                  type="checkbox"
                  id="unite"
                  @click="cellUnite" />셀병합</label
              >
              <!-- <label for="sum"><input type="checkbox" id="sum" @click="showSum">합계</label> -->
            </div>
          </div>
          <div class="flex justify-end items-start -space-x-7 mt-3 ml-[73%]">
            <div class="text-base font-semibold">사유코드</div>
            <v-select
              v-model="selectedCause"
              :options="causeList"
              placeholder="전체"
              label="strName"
              class="custom-select4 !mr-10"
              clearable="true"
              @click="resetVselect2" />
          </div>
        </div>
      </div>
      <div class="ml-1">
        <PickStoreRenew3
          @lngStoreCode="lngStoreCodes"
          @lngStoreGroup="lngStoreGroup"
          @excelStore="excelStore"
          @changeInit="changeInit"
          @lngStoreAttrs="lngStoreAttrs">
        </PickStoreRenew3>
      </div>
      <div></div>
    </div>
    <!-- 조회 조건 -->
    <!-- 그리드 영역 -->
    <div class="w-full h-[80%]">
      <Realgrid
        :progname="'SLS08_002RPT_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :setFooter="true"
        :mergeMask="mergeMask"
        :setMergeMode="false"
        :setGroupSumCustomColumnId="['dtmDate']"
        :setGroupSumCustomText="['소계']"
        :setGroupFooter="true"
        :setGroupColumnId="setGroupColumnId"
        :setGroupFooterExpressions="['sum', 'sum']"
        :setGroupFooterColID="['intCount', 'lngActAmt']"
        :hideColumnsId="hideColumnsId"
        :setRowGroupSpan2="setRowGroupSpan"
        :setFooterExpressions="['sum', 'sum']"
        :setFooterColID="['intCount', 'lngActAmt']"
        :documentTitle="'SLS08_002RPT'"
        :rowStateeditable="false"
        :documentSubTitle="documentSubTitle"
        :exporttoExcel="exportExcel">
      </Realgrid>
    </div>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import { getCauseListbyMenu, getMenusCancelData } from "@/api/misales";
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

import PickStoreRenew3 from "@/components/pickStoreRenew.vue";
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

const orderPay = ref(1);
const setFooterColID = ref([
  "lngRecCnt",
  "lngRecAmt",
  "lngCustCnt",
  "lngCustAmt",
  "lngSalAmt",
  "lngDiscount",
  "lngActAmt",
  "lngVAT",
  "lngSupplyAmt",
  "dblDistRate",
  "lngTotAmt",
  "dtmDate",
]);
const setGroupFooterColID = ref([
  "lngRecCnt",
  "lngRecAmt",
  "lngCustCnt",
  "lngCustAmt",
  "lngSalAmt",
  "lngDiscount",
  "lngActAmt",
  "lngVAT",
  "lngSupplyAmt",
  "dblDistRate",
  "lngTotAmt",
  "dtmDate",
]);
const setFooterExpressions = ref([
  "sum",
  "avg",
  "sum",
  "avg",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "custom",
]);
const setGroupFooterExpressions = ref([
  "sum",
  "avg",
  "sum",
  "avg",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "custom",
]);
const setGroupSummaryCenterIds = ref("strTime");
const progid = ref(1);
const setRowGroupSpan = ref("");
const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);
const selectedstartDate = ref();
const selectedendDate = ref();
const hideColumnNow = ref(true);
const reportType = ref(1);
const setGroupColumnId = ref("dtmDate");
const hideColumnsId = ref(["strStore"]);
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
const startTime = ref(0);
const endTime = ref(23);
const setGroupFooter = ref(false);
const selectedCause = ref(null);
const store = useStore();
const causeList = ref([]);
const mergeMask = ref();
/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const userGroup = store.state.storeGroup[0].lngStoreGroup;

  const res = await getCauseListbyMenu(userGroup, 0);
  causeList.value = res.data.List;
  //comsole.log(res);
});

const loginedstrLang = store.state.userData.lngLanguage;
/**
 *  조회 함수
 */

const searchButton = async () => {
  store.state.loading = true;
  try {
    initGrid();
    let cause;
    if (selectedCause.value == null || selectedCause.value == undefined) {
      cause = 0;
    } else {
      cause = selectedCause.value.lngCode;
    }

    if (tempHideStore.value == true) {
      hideColumnsId.value = [];
      mergeMask.value = "strStore";
      setGroupColumnId.value = "strStore";
    } else {
      hideColumnsId.value = ["strStore"];
      setGroupColumnId.value = "dtmDate";
      mergeMask.value = "dtmDate";
    }
    if (tempCellUnite.value == true) {
      if (tempHideStore.value == true) {
        setRowGroupSpan.value = "strStore,dtmDate";
      } else {
        setRowGroupSpan.value = "dtmDate";
      }
    } else {
      setRowGroupSpan.value = "";
    }

    // if(tempSum.value == true){
    //   setGroupFooter.value = true
    // } else {
    //   setGroupFooter.value = false
    // }

    reload.value = !reload.value;

    const res = await getMenusCancelData(
      selectedGroup.value,
      selectedStoreAttrs.value,
      selectedStores.value,
      selectedstartDate.value,
      selectedendDate.value,
      reportType.value,
      cause
    );
    //comsole.log(res);
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
  let condition = "조건 :";
  if (tempHideStore.value == true) {
    condition += "매장명,";
  }
  if (tempCellUnite.value == true) {
    condition += "셀병합,";
  }

  condition = condition.substring(0, condition.length - 1);
  let codestr;
  if (selectedCause.value == null || selectedCause.value == undefined) {
    codestr = "전체";
  } else {
    codestr = causeList.value.filter(
      (item) => item.lngCode == selectedCause.value.lngCode
    )[0].strName;
  }

  documentSubTitle.value =
    selectedExcelDate.value +
    "\n" +
    selectedExcelStore.value +
    "\n" +
    condition +
    "\n" +
    "사유코드 : " +
    codestr;
  //comsole.log(documentSubTitle.value);
  exportExcel.value = !exportExcel.value;
};

const resetVselect2 = () => {
  endTime.value = 23;
};
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
const tempHideStore = ref(false);
const showStore = (e) => {
  if (e.target.checked) {
    tempHideStore.value = true;
    reportType.value = "12";
  } else {
    tempHideStore.value = false;
    reportType.value = "1";
  }
};
const tempCellUnite = ref(false);
const cellUnite = (e) => {
  if (e.target.checked) {
    tempCellUnite.value = true;
  } else {
    tempCellUnite.value = false;
  }
};
const tempSum = ref(false);
//   const showSum = (e) => {
//       if(e.target.checked){
//         //tempSum.value = true

//         if(tempHideStore.value == true){
//           setGroupColumnId.value = 'strStore'
//         } else {
//           setGroupColumnId.value = 'dtmDate'
//         }
//         setGroupFooter.value = true
//         reload.value = !reload.value
//       } else {
//         //tempSum.value = false
//         setGroupFooter.value = false
//         reload.value = !reload.value
//       }
//   }
/**
 *  컴포넌트 변동시 감지 함수
 */

const changeInit = (e) => {
  initGrid();
};
</script>

<style></style>
