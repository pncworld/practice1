<!-- /*--############################################################################
# Filename : PUR01_010RPT.vue                                                  
# Description : 구매관리2 > 발주 관리 > 조회유형별 발주현황                      
# Date :2025-08-26                                                             
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
        <button @click="excelButton" class="button w-auto excel">엑셀</button>
        <button @click="printButton" class="button print w-auto">인쇄</button>
      </div>
    </div>
    <div
      class="grid grid-cols-3 grid-rows-3 bg-gray-200 rounded-lg h-16 items-start z-10">
      <div class="justify-start flex ml-12">
        <Datepicker1
          :mainName="'입고예정일자'"
          ref="datepicker"
          :initToday="1"
          :closePopUp="closePopUp"
          @excelDate="excelDate"
          @dateValue="dateValue">
        </Datepicker1>
      </div>
      <div class="flex justify-start items-center">
        <PickStore
          @update:storeGroup="lngStoreGroup"
          :defaultStoreNm="'전체'"
          @storeNm="excelStore"
          :hideGroup="false"
          :hideAttr="false"
          :defaultStoreType2="true"
          :defaultStore="true"
          @update:storeCd="lngStoreCode"></PickStore>
      </div>
      <div class="flex justify-start pl-3 items-center mt-1">
        <BusinessClient
          @SupplierId="SupplierId"
          :defaultNm="'전체'"></BusinessClient>
      </div>
    </div>

    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="w-full h-[75vh]">
      <div class="w-full h-[80%]">
        <Realgrid
          :progname="'PUR03_016RPT_VUE'"
          :progid="1"
          :rowData="rowData"
          :reload="reload"
          :setStateBar="false"
          :setGroupFooter="true"
          :setGroupColumnId="'strStoreName'"
          :documentTitle="'PUR03_016RPT'"
          :selectionStyle="'block'"
          @clickedRowData="clickedRowData"
          :documentSubTitle="documentSubTitle"
          :rowStateeditable="false"
          @clickedButtonCol="clickedButtonCol"
          @checkedRowData="checkedRowData"
          :checkRowAuto="false"
          :checkRowAuto2="true"
          :checkRenderEditable="true"
          :exporttoExcel="exportExcel">
        </Realgrid>
      </div>
    </div>
  </div>

  <div
    v-if="openPopUp"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white p-6 rounded-2xl shadow-xl w-[50vw] h-[50vh]">
      <div class="flex justify-between">
        <h2 class="text-xl font-bold mb-4">발주서 조회</h2>
        <div class="flex space-x-5">
          <button class="whitebutton" @click="excelButton2">엑셀</button
          ><button class="whitebutton" @click="openPopUp = false">닫기</button>
        </div>
      </div>
      <div class="flex">
        <div class="flex space-x-5 items-center">
          <div class="text-base font-semibold">매장명</div>
          <div>
            <input
              type="text"
              class="border border-black h-7 w-48 disabled:bg-gray-200"
              disabled
              v-model="selectedExcelStore" />
          </div>
        </div>

        <div class="flex space-x-5 ml-5 items-center">
          <div class="text-base font-semibold">발주번호</div>
          <div>
            <input
              type="text"
              class="border border-black h-7 w-48 disabled:bg-gray-200"
              v-model="forPopupOrderNo"
              disabled />
          </div>
        </div>
      </div>
      <div class="h-[80%] w-full flex justify-center items-center mt-2">
        <Realgrid
          :progname="'PUR03_016RPT_01POP_VUE'"
          :progid="1"
          :documentTitle="'PUR03_016RPT'"
          :exporttoExcel="exportExcel2"
          :documentSubTitle="documentSubTitle2"
          :rowData="rowData2"></Realgrid>
      </div>
    </div>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import { getCommonList } from "@/api/common";
import { getStockCategory, getStockGeneric, getStockGroup } from "@/api/master";
import { getOrderInfoDetail, getPurchaseOrderList } from "@/api/mipur";
import BusinessClient from "@/components/businessClient.vue";
import Datepicker1 from "@/components/Datepicker1.vue";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
import PickStore from "@/components/pickStore.vue";
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
import Swal from "sweetalert2";
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

  const res = await getCommonList(27);

  optionList.value = res.data.List.filter((item) => item.strDCode !== "01");
});

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

const cond = ref("02");
const cond2 = ref(0);
const cond3 = ref(0);
const cond4 = ref("");
const cond5 = ref(0);
const store = useStore();

const datepicker = ref(null);
const closePopUp = ref(false);
const optionList = ref([]);
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
const dateValue = (e) => {
  initGrid();
  sDate.value = e;
  ////console.log(e);
};

const selectedDate = ref();
const excelDate = (e) => {
  selectedDate.value = e;
};
const optionList2 = ref([]);
watch(cond2, async () => {
  if (cond2.value == 1) {
    const res2 = await getStockCategory(store.state.userData.lngStoreGroup);

    optionList2.value = res2.data.List;

    optionList2.value = optionList2.value.map((item) => ({
      ...item,
      strDCode: item.lngCategoryID,
      strDName: item.strCategoryName,
    }));
  } else if (cond2.value == 2) {
    const res = await getStockGroup(store.state.userData.lngStoreGroup);

    optionList2.value = res.data.List;

    optionList2.value = optionList2.value.map((item) => ({
      ...item,
      strDCode: item.lngStockGroupID,
      strDName: item.strStockGroupName,
    }));
  } else if (cond2.value == 3) {
    const res3 = await getStockGeneric(store.state.userData.lngStoreGroup);

    optionList2.value = res3.data.List;

    optionList2.value = optionList2.value.map((item) => ({
      ...item,
      strDCode: item.lngGenericID,
      strDName: item.strGenericName,
    }));
  } else {
    optionList2.value = [];
  }
  ////console.log(optionList2.value);
  cond3.value = 0;
});

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

const supplierid = ref("");
const SupplierId = (e) => {
  supplierid.value = e;
};
/**
 *  조회 함수
 */
const hideColumnsId = ref([]);
const searchButton = async () => {
  try {
    store.state.loading = true;
    initGrid();

    const res = await getPurchaseOrderList(
      groupCd.value,
      storeCode.value,
      sDate.value.replaceAll("-", ""),
      supplierid.value
    );

    rowData.value = res.data.List;
    //console.log(res);
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

const progid = ref(1);
const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }

  if (cond5.value == 0) {
    progid.value = 1;
  } else if (cond5.value == 1) {
    progid.value = 2;
  } else if (cond5.value == 2) {
    progid.value = 3;
  } else if (cond5.value == 3) {
    progid.value = 4;
  }

  reload.value = !reload.value;
};

//엑셀 버튼 처리 함수
const exportExcel = ref(false);
/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  documentSubTitle.value =
    selectedDate.value + "\n" + "매장명 :" + selectedExcelStore.value;
  exportExcel.value = !exportExcel.value;
};

const documentSubTitle2 = ref("");
const exportExcel2 = ref(false);
const excelButton2 = () => {
  documentSubTitle2.value =
    "매장명 :" +
    selectedExcelStore.value +
    "\n" +
    "발주번호 :" +
    forPopupOrderNo.value;
  exportExcel2.value = !exportExcel2.value;
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

const openPopUp = ref(false);

const clickedButtonCol = async (e) => {
  //   //console.log(e);
  //   //console.log(forPopupOrderNo.value);

  if (e == "strOrderNo") {
    const res = await getOrderInfoDetail(
      groupCd.value,
      forPopupOrderStoreCd.value,
      forPopupOrderNo.value
    );

    //console.log(res);
    rowData2.value = res.data.List;
    openPopUp.value = true;
  }
};
const rowData2 = ref([]);
const forPopupOrderStoreCd = ref("");
const forPopupOrderNo = ref("");
const clickedRowData = (e) => {
  //console.log(e);
  forPopupOrderStoreCd.value = e[1];
  forPopupOrderNo.value = e[5];
};

const checkedrowdata = ref([]);
const checkedRowData = (e) => {
  checkedrowdata.value = e;

  //console.log(e);
};
const printButton = () => {
  if (checkedrowdata.value.length == 0) {
    Swal.fire({
      title: "경고",
      text: "선택한 전표가 존재하지 않습니다.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }
  const storecds = checkedrowdata.value
    .map((item) => item.lngStoreCode)
    .join(",");
  const ordercds = checkedrowdata.value
    .map((item) => item.strOrderNo)
    .join(",");
  window.open(
    `http://222.231.31.99/Report/CRPrint.aspx?pCount=10&Report=PUR03_016RPT_RPT&@P_lngStoreGroup=${
      groupCd.value
    }&@P_lngStoreCode=${
      storeCode.value
    }&@P_dtmOrderDate=${sDate.value.replaceAll(
      "-",
      ""
    )}&@P_flag=1&@P_lngStoreCodeList=${storecds}&@P_orderNo=${ordercds}`,
    "_blank",
    "width=1600,height=1200"
  );
};
</script>
