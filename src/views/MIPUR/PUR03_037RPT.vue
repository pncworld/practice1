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
      class="z-10 mt-3 w-full min-w-0 overflow-x-auto rounded-lg bg-gray-200 px-24 py-4">
      <div
        class="pur037-search-grid min-w-0"
        :style="{
          '--pur037-control-border': pur037ControlBorder,
          '--pur037-item-gap': pur037ItemGap,
        }">
        <div class="pur037-cell">
          <div class="pur037-sg-label">입고예정일자</div>
          <div class="pur037-cell-field pur037-date-slot min-w-0">
            <Datepicker1
              ref="datepicker"
              :mainName="'입고예정일자'"
              :initToday="1"
              :closePopUp="closePopUp"
              @excelDate="excelDate"
              @dateValue="dateValue" />
          </div>
        </div>
        <div class="pur037-cell">
          <div class="pur037-sg-label">매장명</div>
          <div class="pur037-cell-field pur037-pick-slot min-w-0">
            <PickStore
              compact-search-bar
              :compact-store-combo-max-rem="pur037PickStoreComboMaxRem"
              main-name=""
              @update:storeGroup="lngStoreGroup"
              :defaultStoreNm="'전체'"
              @storeNm="excelStore"
              :hideGroup="false"
              :hideAttr="false"
              :defaultStoreType2="true"
              :defaultStore="true"
              @update:storeCd="lngStoreCode" />
          </div>
        </div>
        <div class="pur037-cell">
          <div class="pur037-sg-label">거래처</div>
          <div class="pur037-cell-field pur037-bc-slot min-w-0">
            <BusinessClient
              compact-search-bar
              @SupplierId="SupplierId" />
          </div>
        </div>
        <div class="pur037-cell">
          <div class="pur037-sg-label">파트</div>
          <div class="pur037-cell-field min-w-0">
            <select
              id="pur03-037-cond-part"
              v-model="cond"
              class="pur037-part-select h-8 w-full min-w-[8rem] rounded-md border border-solid bg-white text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option
                v-for="i in optionList"
                :key="i.lngPartCode"
                :value="i.lngPartCode">
                {{ i.strPartName }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- 조회조건 -->
    <!-- 그리드 영역 — 발주등록(80%) 대비 조금 넓게 -->
    <div class="w-full h-[85%]">
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

        <div class="flex space-x-5 ml-10 items-center">
          <div class="text-base font-semibold">발주번호</div>
          <div>
            <input
              type="text"
              class="border border-black h-7 w-23 disabled:bg-gray-200"
              v-model="forPopupOrderNo"
              disabled />
          </div>
        </div>

        <div class="flex space-x-5 ml-10 items-center">
          <div class="text-base font-semibold">파트명</div>
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
import BusinessClient from "@/components/businessClient2.vue";
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

/** 조회줄 컨트롤 공통 테두리(search-area-layout) */
const pur037ControlBorder = "#cbd5e1";
/** compact 매장 v-select가 칸 폭을 채우도록 기본 12rem 상한 해제(조회줄 4등분 시각 균등) */
const pur037PickStoreComboMaxRem = 96;

/** 라벨↔필드, 항목(4블록) 사이 간격 — 한 값으로 통일 */
const pur037ItemGap = "0.75rem";

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
      String(sDate.value ?? "").replaceAll("-", ""),
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
    "파트명 : " +
    // optionList.value.filter((item) => item.lngPartCode == cond.value)[0].strPartName;
    forPopupPartNM.value
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
const forPopupPartNM = ref("");

const scond = ref("");
const clickedRowData = (e) => {
  scond.value = e[3];
  forPopupOrderStoreCd.value = e[1];
  forPopupPartNM.value = e[4];
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
    }&@P_dtmOrderDate=${String(sDate.value ?? "").replaceAll(
      "-",
      ""
    )}&@P_flag=1&@P_lngStoreCodeList=${storecds}&@P_orderNo=${ordercds}`,
    "_blank",
    "width=1600,height=1200"
  );
};
</script>

<style scoped>
/* 4열 동일 minmax(0,1fr) + column-gap만으로 열 간격 통일 (search-area-layout) */
.pur037-search-grid {
  --pur037-label-col: 6.5rem;
  display: grid;
  width: 100%;
  min-width: 0;
  align-items: center;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  column-gap: var(--pur037-item-gap);
}

.pur037-cell {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: var(--pur037-item-gap);
}

.pur037-sg-label {
  flex: 0 0 var(--pur037-label-col);
  width: var(--pur037-label-col);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
}

.pur037-cell-field {
  min-width: 0;
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  width: 100%;
}

/* 라벨 제외 나머지 칸을 컨트롤이 가득 채움 → 칸마다 L/R 빈 여백 균형 */
.pur037-cell-field > * {
  min-width: 0;
  width: 100%;
}

.pur037-search-grid select.pur037-part-select {
  border: 1px solid var(--pur037-control-border) !important;
}

.pur037-search-grid select.pur037-part-select:focus {
  border-color: #3b82f6 !important;
}

.pur037-search-grid .pur037-pick-slot :deep(select) {
  border: 1px solid var(--pur037-control-border) !important;
}

.pur037-search-grid .pur037-pick-slot :deep(select:focus) {
  border-color: #3b82f6 !important;
}

.pur037-search-grid .pur037-pick-slot :deep(.pickstore-vs-shell),
.pur037-search-grid .pur037-bc-slot :deep(.pickstore-vs-shell) {
  border: 1px solid var(--pur037-control-border) !important;
}

/* Datepicker2 filterBarAlign 날짜 입력과 동일 높이·타이포 (h-8, text-sm, pl-3, rounded-md) */
.pur037-search-grid .pur037-date-slot :deep(input[type="date"]) {
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  height: 2rem;
  min-height: 2rem;
  padding-left: 0.75rem;
  padding-right: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  border-radius: 0.375rem;
  border: 1px solid var(--pur037-control-border) !important;
}

.pur037-search-grid .pur037-date-slot :deep(input[type="date"]:focus) {
  border-color: #3b82f6 !important;
}

/* 그리드 바깥 라벨로 쓰므로 Datepicker1 안쪽 제목 숨김 */
.pur037-date-slot :deep(div.space-x-5 > span) {
  display: none;
}

.pur037-date-slot :deep(div.space-x-5) {
  margin-top: 0;
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;
}

.pur037-bc-slot :deep(> div.flex.text-base) {
  width: 100%;
  min-width: 0;
}

.pur037-pick-slot :deep(> div.flex.text-base) {
  width: 100%;
  min-width: 0;
  /* PickStore compact 기본 gap-4(1rem) → 조회줄 간격과 불일치 */
  gap: var(--pur037-item-gap) !important;
}

.pur037-pick-slot :deep(> div.flex > div:first-child) {
  display: none;
}

.pur037-bc-slot :deep(> div.flex.items-center) {
  margin-top: 0;
}
</style>
