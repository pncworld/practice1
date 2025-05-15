/*--############################################################################
# Filename : SLS14_032RPT.vue                                                  
# Description : 매출관리 > 기타 매출 현황 > 부가세 참고자료                    
# Date :2025-05-14                                                             
# Author : 권맑음                     
################################################################################*/
<template>
  <!-- 조회 조건 -->
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
    class="flex justify-between bg-gray-200 rounded-lg h-16 items-center z-10">
    <div>
      <Datepicker3
        @endMonth="endMonth"
        @endYear="endYear"
        @startMonth="startMonth"
        @startYear="startYear"
        @excelDate="excelDate"></Datepicker3>
    </div>

    <div class="mr-28">
      <PickStoreRenew
        @lngStoreCode="lngStoreCodes"
        @lngStoreGroup="lngStoreGroup"
        @lngStoreAttrs="lngStoreAttrs"
        @excelStore="excelStore"
        :placeholderName="'선택'">
      </PickStoreRenew>
    </div>
  </div>
  <!-- 조회 조건 -->
  <!--그리드 영역 -->
  <div class="w-full h-[85%]">
    <Realgrid
      :progname="'SLS14_032RPT_VUE'"
      :progid="1"
      :rowData="rowData"
      :reload="reload"
      :setRowStyleCalls="true"
      :setGroupFooter="true"
      :setGroupColumnId="'strStoreGroupName'"
      :setGroupFooterColID="setGroupFooterColID"
      :setGroupFooterExpressions="setGroupFooterExpressions"
      :setRowGroupSpan2="'strName,dtmDate'"
      :mergeMask="'strName'"
      :documentTitle="'SLS14_032RPT'"
      :rowStateeditable="false"
      :documentSubTitle="documentSubTitle"
      :exporttoExcel="exportExcel"></Realgrid>
  </div>
  <!--그리드 영역 -->
</template>

<script setup>
import { getVATInfo } from "@/api/misales";

/**
 *  해당연월 컴포넌트
 *  */

import Datepicker3 from "@/components/Datepicker3.vue";
/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";

/**
 *  매장 단일 선택 컴포넌트
 *  */

import PickStoreRenew from "@/components/pickStoreRenew.vue";
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

const setGroupFooter = ref(false);
const setFooterColID = ref([
  "lngDayCnt",
  "lngCustCnt",
  "lngCustAmt",
  "lngRecCnt",
  "lngRecAmt",
  "lngSalAmt",
  "lngTotAmt",
  "lngActAmt_pastMonth",
  "lngActAmt_pastYear",
  "lngActAmt_pastMonth_rate",
  "lngActAmt_pastYear_rate",
  "lngSupplyAmt",
  "lngVAT",
  "lngAvgCustCnt",
  "lngAvgTotAmt",
  "dblDistRate",
]);
const setGroupFooterColID = ref([
  "lngDayCnt",
  "lngCustCnt",
  "lngCustAmt",
  "lngRecCnt",
  "lngRecAmt",
  "lngSalAmt",
  "lngTotAmt",
  "lngActAmt_pastMonth",
  "lngActAmt_pastYear",
  "lngActAmt_pastMonth_rate",
  "lngActAmt_pastYear_rate",
  "lngSupplyAmt",
  "lngVAT",
  "lngAvgCustCnt",
  "lngAvgTotAmt",
  "dblDistRate",
]);
const setFooterExpressions = ref([
  "sum",
  "sum",
  "avg",
  "sum",
  "avg",
  "sum",
  "sum",
  "sum",
  "sum",
  "avg",
  "avg",
  "sum",
  "sum",
  "avg",
  "avg",
  "sum",
]);
const setGroupFooterExpressions = ref([
  "sum",
  "sum",
  "avg",
  "sum",
  "avg",
  "sum",
  "sum",
  "sum",
  "sum",
  "avg",
  "avg",
  "sum",
  "sum",
  "avg",
  "avg",
  "sum",
]);

const setGroupSummaryCenterIds = ref("dtmDate,strWeekName");
const progid = ref(1);
const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);
const selectedstartYear = ref();
const selectedendYear = ref();
const selectedstartMonth = ref();
const selectedendMonth = ref();
const hideColumnNow = ref(true);
const hideColumn = ref("strStore");
const hideColumnsId = ref(["strStore"]);
/**
 * 	종료 월
 */

const endMonth = (e) => {
  //comsole.log(e);
  selectedendMonth.value = e;
};
/**
 * 	시작 년
 */

const startYear = (e) => {
  //comsole.log(e);
  selectedstartYear.value = e;
};
/**
 * 	시작 월
 */

const startMonth = (e) => {
  //comsole.log(e);
  selectedstartMonth.value = e;
};
/**
 * 	종료 년
 */

const endYear = (e) => {
  //comsole.log(e);
  selectedendYear.value = e;
};

const seeUnite = (e) => {
  if (e.target.checked) {
    setGroupFooter.value = true;
  } else {
    setGroupFooter.value = false;
  }
  reload.value = !reload.value;
};

const tempSeeDetail = ref(1);
const seeDetail = (e) => {
  if (e.target.checked) {
    tempSeeDetail.value = 2;
  } else {
    tempSeeDetail.value = 1;
  }
};
const store = useStore();
const loginedstrLang = store.state.userData.lngLanguage;
//comsole.log(store.state.userData);

/**
 *  조회 함수
 */

const searchButton = async () => {
  if (
    selectedstartYear.value == null ||
    selectedstartMonth.value == null ||
    selectedendYear.value == null ||
    selectedendMonth.value == null
  ) {
    Swal.fire({
      title: "날짜를 선택하세요.",
      icon: "info",

      confirmButtonColor: "#3085d6",

      confirmButtonText: "확인",
    });
    return;
  }
  if (selectedStores.value == 0) {
    Swal.fire({
      title: "매장을 선택하세요.",
      icon: "info",

      confirmButtonColor: "#3085d6",

      confirmButtonText: "확인",
    });
    return;
  }
  store.state.loading = true;
  try {
    initGrid();
    if (tempChecked.value == true) {
      hideColumnsId.value = [];
    } else {
      hideColumnsId.value = ["strStore"];
    }
    reload.value = !reload.value;
    /**
     * 선택한 매출 시작일자
     */

    const startDate = `${selectedstartYear.value}${String(
      selectedstartMonth.value
    ).padStart(2, "0")}`;
    /**
     * 선택한 매출 종료일자
     */

    const endDate = `${selectedendYear.value}${String(
      selectedendMonth.value
    ).padStart(2, "0")}`;

    const res = await getVATInfo(
      selectedGroup.value,
      selectedStores.value,
      startDate,
      endDate
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
const selectedExcelStore = ref("");
const selectedExcelDate = ref("");
const documentSubTitle = ref("");
/**
 * 엑셀용 매장 세팅 함수
 */

const excelStore = (e) => {
  selectedExcelStore.value = e;
};
/**
 * 엑셀용 일자 세팅 함수
 */

const excelDate = (e) => {
  selectedExcelDate.value = e;
};
/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  documentSubTitle.value =
    selectedExcelDate.value + "\n" + selectedExcelStore.value;
  exportExcel.value = !exportExcel.value;
};

const tempChecked = ref(false);
const showStore = (e) => {
  if (e.target.checked) {
    tempChecked.value = true;
  } else {
    tempChecked.value = false;
  }
};
</script>

<style>
.rg-body .rg-table tr td:hover,
.rg-fixed-body .rg-table tr td:hover {
  background: none;
}
</style>
