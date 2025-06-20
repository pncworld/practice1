<!-- /*--############################################################################
# Filename : CRM65_005RPT.vue                                                  
# Description : 고객관리 > 전자상품권 현황 > 전자상품권 재고현황.   
# Date :2025-06-19                                                            
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
        <button @click="excelButton" class="button save w-auto excel">
          엑셀
        </button>
      </div>
    </div>
    <div
      class="grid grid-cols-[1fr,1fr] grid-rows-2 bg-gray-200 rounded-lg h-16 items-center z-10 space-x-2 justify-start">
      <div class="justify-start ml-4 mt-8">
        <Datepicker2
          :mainName="'조회 기간'"
          @startDate="startDate"
          @excelDate="excelDate"
          @endDate="endDate"></Datepicker2>
      </div>
      <div>
        <button class="whitebutton bg-white mt-8" @click="visible = true">
          상품권선택
        </button>
      </div>
    </div>
    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="w-full h-[75%]">
      <Realgrid
        :progname="'CRM65_005RPT_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :setDynamicGrid4="true"
        :setDynamicGrid4Cond="setDynamicGrid4Cond"
        :mergeColumns3="true"
        :setFooter="true"
        :showCheckBar="false"
        :mergeColumnGroupName3="mergeColumnGroupName3"
        :mergeColumnGroupSubList3="mergeColumnGroupSubList3"
        :mergeColumnGroupName4="mergeColumnGroupName4"
        :setFooterCustomColumnId="['strStore']"
        :setFooterCustomText="['합계']"
        :documentTitle="'CRM65_005RPT'"
        :documentSubTitle="documentSubTitle"
        :rowStateeditable="false"
        :exporttoExcel="exportExcel">
      </Realgrid>
    </div>
  </div>
  <div
    v-show="visible"
    class="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
    <div class="bg-white rounded-2xl shadow-lg p-6 w-[40vw] h-[50vh]">
      <h2 class="text-lg font-bold mb-4 text-center">상품권 선택</h2>
      <div class="h-[80%]">
        <Realgrid
          :progname="'CRM65_005RPT_VUE'"
          :progid="2"
          @realgridname="realgridname"
          @checkedRowData="checkedRowData"
          @checkedRowIndex="checkedRowIndex"
          :setStateBar="false"
          :initCheckRows="initCheckRows"
          :initCheckRowNow="initCheckRowNow"
          :rowData="rowData2"></Realgrid>
      </div>
      <div class="flex space-x-2">
        <button
          class="mt-4 w-full bg-gray-800 text-white py-2 rounded-xl"
          @click="setSearchCond">
          저장
        </button>
        <button
          class="mt-4 w-full bg-gray-800 text-white py-2 rounded-xl"
          @click="setInitCheck">
          닫기
        </button>
      </div>
    </div>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import {
  getGftCardStockList,
  getGftLedgerTradeAggList,
  getGftList,
} from "@/api/micrm";
import Datepicker2 from "@/components/Datepicker2.vue";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
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
import RealGrid from "realgrid";
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
/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getGftList(store.state.userData.lngStoreGroup);

  rowData2.value = res.data.List;
});

const reload = ref(false);
const rowData = ref([]);
const rowData2 = ref([]);
const afterSearch = ref(false);
const selectedCond = ref(0);
const condValue = ref(0);
const cond = ref([]);
const cond2 = ref(0);
const cond3 = ref(0);
const visible = ref(false);
const store = useStore();
const optionList = ref([]);
const optionList2 = ref([]);
const optionList3 = ref([]);
const datepicker = ref(null);
const closePopUp = ref(false);
const custId = ref("");
const initCheckRowNow = ref(false);
const checkedRows = ref([]);
const checkedRowData = (e) => {
  checkedRows.value = e;
};

const checkedIndex = ref([]);
const savedcheckedIndex = ref([]);
const checkedRowIndex = (e) => {
  console.log(e);
  checkedIndex.value = e;
};

const initCheckRows = ref([]);
const setDynamicGrid4Cond = ref(0);
const setSearchCond = () => {
  initGrid();
  cond.value = checkedRows.value;
  console.log(cond.value);
  savedcheckedIndex.value = checkedIndex.value;

  mergeColumnGroupName4.value = [
    "상품권 구분",
    ...cond.value.map((item) => item.strGftType),
  ];

  for (let i = 0; i < cond.value.length; i++) {
    const group = [];
    for (let j = 1 + i * 7; j <= 7 + i * 7; j++) {
      group.push(`column${j}`);
    }
    mergeColumnGroupSubList3.value.push([group]); // 대괄호 한 번 더 감싸는 거 잊지 마
  }
  mergeColumnGroupName3.value = [[""]];
  mergeColumnGroupSubList3.value.push([`column${cond.value.length * 7 + 1}`]);
  for (let i = 1; i <= cond.value.length + 1; i++) {
    const group = ["", "", "출고", "출고", " ", " ", " "];
    mergeColumnGroupName3.value.push(group);
  }
  mergeColumnGroupName3.value.push(["합계"]);

  setDynamicGrid4Cond.value = cond.value.length;
  reload.value = !reload.value;
  visible.value = false;
};

const setInitCheck = () => {
  cond.value = rowData2.value.filter((item, index) =>
    savedcheckedIndex.value.includes(index)
  );
  console.log(cond.value);
  initCheckRows.value = savedcheckedIndex.value;
  initCheckRowNow.value = !initCheckRowNow.value;
  visible.value = false;
};
const mergeColumnGroupName4 = ref(["상품권구분"]);
const mergeColumnGroupName3 = ref([[""]]);
const mergeColumnGroupSubList3 = ref([[["strStore"]]]);
const gridName = ref("");
const realgridname = (e) => {
  gridName.value = e;
  console.log(e);
};

watch(visible, () => {
  const reagrid2 = document.getElementById(gridName.value);
  if (reagrid2) {
    setTimeout(() => {
      RealGrid.getGridInstance(reagrid2).resetSize();
      RealGrid.getGridInstance(reagrid2).refresh(true);
    }, 10);
  }
});
const custNm = ref("");
const strSaleCustName = (e) => {
  custNm.value = e;
};
const sd = ref("");
const groupCd = ref("");
const ed = ref("");
const storeCds = ref("");
const selectedDate = ref("");
const startDate = (e) => {
  sd.value = e;
};
const endDate = (e) => {
  ed.value = e;
};
const lngStoreGroup = (e) => {
  groupCd.value = e;
};
const lngStoreCodes = (e) => {
  storeCds.value = e;
};

const excelDate = (e) => {
  selectedDate.value = e;
};
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

const hideColumnsId = ref(["strStoreName"]);
const searchButton = async () => {
  if (sd.value == null || ed.value == null) {
    Swal.fire({
      title: "경고",
      text: "일자을 선택하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  try {
    store.state.loading = true;
    initGrid();
    console.log(cond.value.map((item) => item.lngGftType + "|"));
    const res = await getGftCardStockList(
      store.state.userData.lngStoreGroup,
      0,
      sd.value,
      ed.value,
      cond.value.map((item) => item.lngGftType).join("|")
    );
    console.log(res);
    rowData.value = res.data.List;

    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    console.log(error);
  } finally {
    store.state.loading = false;
  }
};

/* 매장 컴포넌트 관련 함수 */
const selectedGroup = ref();
const selectedStores = ref();
const selectedStoreAttrs = ref();

/**
 * 페이지 매장 코드 세팅
 */

const lngStoreCode = async (e) => {
  initGrid();
  selectedStores.value = e;
  console.log(e);
};

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
  documentSubTitle.value = selectedDate.value;

  exportExcel.value = !exportExcel.value;
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
</script>
