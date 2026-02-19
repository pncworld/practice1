<!-- /*--############################################################################
# Filename : PUR03_037RPT.vue                                                  
# Description : 구매관리2 > 발주 관리 > 발주서 발행(파트별)                     
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
      class="grid grid-cols-4 grid-rows-1 bg-gray-200 rounded-lg h-16 items-start z-10">
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
      <div class="flex justify-start pl-3 items-center space-x-5 mt-2">
        <div class="text-base font-semibold">파트</div>
        <div>
          <select
            name=""
            id=""
            class="border border-black w-32 h-8"
            v-model="cond">
            <option :value="i.lngPartCode" v-for="i in optionList">
              {{ i.strPartName }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="w-full h-[75vh]">
      <div class="w-full h-[80%]">
        <Realgrid
          :progname="'PUR03_037RPT_VUE'"
          :progid="1"
          :rowData="rowData"
          :reload="reload"
          :setStateBar="false"
          :setFooter="true"
          :setFooterColID="setFooterColID"
          :setFooterExpressions="setFooterExpressions"
          :setFooterCustomColumnId="setFooterCustomColumnId"
          :setFooterCustomText="setFooterCustomText"
          :setGroupFooter="true"
          :setGroupColumnId="'strStoreName'"
          :setGroupFooterColID="setGroupFooterColID"
          :setGroupFooterExpressions="setGroupFooterExpressions"
          :setGroupSumCustomColumnId="setGroupSumCustomColumnId"
          :setGroupSumCustomText="setGroupSumCustomText"
          :setGroupSumCustomColumnId2="setGroupSumCustomColumnId2"
          :setMergeMode="false"
          :documentTitle="'PUR03_037RPT'"
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
              class="border border-black h-7 w-67 disabled:bg-gray-200"
              disabled
              v-model="forPopupOrderStoreNM" /> 
          </div>
        </div>

        <div class="flex space-x-5 ml-5 items-center">
          <div class="text-base font-semibold">발주번호</div>
          <div>
            <input
              type="text"
              class="border border-black h-7 w-30 disabled:bg-gray-200"
              v-model="forPopupOrderNo"
              disabled />
          </div>
        </div>

        <div class="flex space-x-5 ml-5 items-center">
          <div class="text-base font-semibold">파트번호</div>
          <select
            name=""
            id=""
            class="border border-black w-35 h-8 disabled:bg-gray-200"
            disabled
            v-model="scond">
            <option :value="i.lngPartCode" v-for="i in optionList">
              {{ i.strPartName }}
            </option>
          </select>
        </div>
      </div>
      <div class="h-[80%] w-full flex justify-center items-center mt-2">
        <Realgrid
          :progname="'PUR03_016RPT_01POP_VUE'"
          :progid="1"
          :documentTitle="'PUR03_037RPT'"
          :rowStateeditable="false"
          :setFooter="true"
          :setFooterColID="setFooterColID2"
          :setFooterExpressions="setFooterExpressions2"
          :setFooterCustomColumnId="setFooterCustomColumnId2"
          :setFooterCustomText="setFooterCustomText2"
          :exporttoExcel="exportExcel2"
          :documentSubTitle="documentSubTitle2"
          :rowData="rowData2"></Realgrid>
      </div>
    </div>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import {
  getOrderInfoDetail,
  getPurchaseOrderList,
  getPurchaseOrderListByPart,
} from "@/api/mipur";
import { getLossMasterPartList } from "@/api/mistock";
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

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

// 그룹 푸터 합계를 표시할 컬럼 설정
// 필요한 컬럼 ID를 배열에 추가하고, 각 컬럼에 대한 표현식(sum, avg, count 등)을 지정하세요
const setGroupFooterColID = ref([
  "lngOrderQty",
  "curSupply",
  "curTax",
  "curTotalCost" 
]);
const setGroupFooterExpressions = ref([
  "sum",
  "sum",
  "sum",
  "sum", 
]);

// 전체 푸터(총계) 합계 설정
const setFooterColID = ref([
  "lngOrderQty",
  "curSupply",
  "curTax",
  "curTotalCost",
]);
const setFooterExpressions = ref(["sum", "sum", "sum", "sum"]);
const setFooterCustomColumnId = ref(["strStoreName"]);
const setFooterCustomText = ref(["총계"]);

// 팝업 그리드(발주서 조회) 전체 푸터(총계) 합계 설정
const setFooterColID2 = ref([
  "dblOrderQty",
  "curSupply",
  "curTax",
  "curTotal",
]);
const setFooterExpressions2 = ref(["sum", "sum", "sum", "sum"]);
const setFooterCustomColumnId2 = ref(["strStoreName"]);
const setFooterCustomText2 = ref(["총계"]);

// 그룹 푸터에 표시할 커스텀 텍스트 설정
const setGroupSumCustomColumnId = ref(["strStoreName"]);
const setGroupSumCustomText = ref(["소계"]);

// 그룹 푸터에 "소계" 텍스트를 표시할 컬럼 설정 (setGroupSumCustomColumnId2 사용)
const setGroupSumCustomColumnId2 = ref(["strStoreName"]);

const cond = ref("0");

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

const storeCode = ref();
const lngStoreCode = async (e) => {
  initGrid();
  storeCode.value = e;

  const res2 = await getLossMasterPartList(
    store.state.userData.lngStoreGroup,
    storeCode.value
  );

  optionList.value = res2.data.List;
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

    const res = await getPurchaseOrderListByPart(
      groupCd.value,
      storeCode.value,
      cond.value,
      sDate.value.replaceAll("-", ""),
      supplierid.value
    );

    rowData.value = res.data.List;
    //console.log(res);
    // 디버깅: 실제 데이터 구조 확인
    if (res.data.List && res.data.List.length > 0) {
      console.log("그리드 컬럼 확인:", Object.keys(res.data.List[0]));
    }
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
    forPopupOrderStoreNM.value +
    "\n" +
    "발주번호 :" +
    forPopupOrderNo.value +
    "\n" +
    "파트번호 : " +
    optionList.value.filter((item) => item.lngPartCode == cond.value)[0]
      .strPartName;
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

    console.log(res);
    // 팝업 그리드 합계 마스킹(콤마 등) 적용을 위해 합계 대상 필드를 숫자로 보정
    rowData2.value = (res.data.List ?? []).map((row) => {
      const toNum = (v) => {
        if (v === null || v === undefined || v === "") return 0;
        if (typeof v === "number") return v;
        const n = Number(String(v).replaceAll(",", ""));
        return isNaN(n) ? 0 : n;
      };
      return {
        ...row,
        dblOrderQty: toNum(row.dblOrderQty),
        curSupply: toNum(row.curSupply),
        curTax: toNum(row.curTax),
        curTotal: toNum(row.curTotal),
      };
    });
    openPopUp.value = true;
  }
};
const rowData2 = ref([]);
const forPopupOrderStoreCd = ref("");
const forPopupOrderStoreNM = ref("");
const forPopupOrderNo = ref("");

const scond = ref("");
const clickedRowData = (e) => {
  scond.value = e[3];
  forPopupOrderStoreCd.value = e[1];
  forPopupOrderStoreNM.value = e[2];
  forPopupOrderNo.value = e[7];
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
    `http://222.231.31.99/Report/CRPrint.aspx?pCount=10&Report=PUR03_016RPT_PART&@P_lngStoreGroup=${
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
