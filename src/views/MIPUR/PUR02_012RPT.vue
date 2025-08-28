<!-- /*--############################################################################
# Filename : PUR02_012RPT.vue                                                  
# Description : 구매관리2 > 매입 관리 > 발주/매입 현황.                      
# Date :2025-08-28                                                             
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
      </div>
    </div>
    <div
      class="grid grid-cols-2 grid-rows-2 bg-gray-200 rounded-lg h-24 items-start z-10">
      <div class="justify-start flex">
        <Datepicker2
          :mainName="'조회기간'"
          ref="datepicker"
          :initToday="1"
          :closePopUp="closePopUp"
          @excelDate="excelDate"
          @endDate="endDate"
          @startDate="startDate"
          @dateValue="dateValue">
        </Datepicker2>
      </div>
      <div class="flex justify-start items-center">
        <PickStore
          @update:storeGroup="lngStoreGroup"
          :defaultStoreNm="'전체'"
          @storeNm="excelStore"
          :defaultStoreType2="true"
          :hideAttr="false"
          :hideGroup="false"
          :defaultStore="true"
          @update:storeCd="lngStoreCode"></PickStore>
      </div>
      <div class="flex ml-16 space-x-5 mt-0 items-center">
        <BusinessClient
          @SupplierId="SupplierId"
          :defaultNm="'전체'"></BusinessClient>
      </div>
      <div class="flex justify-start pl-12 items-center mt-2 space-x-5">
        <div class="font-semibold text-base">검수자</div>
        <div>
          <input type="text" class="border border-black h-7" v-model="cond" />
        </div>
      </div>
    </div>

    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="w-full h-[65vh]">
      <Realgrid
        :progname="'PUR02_012RPT_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :setStateBar="false"
        :setFooter="true"
        :documentTitle="'PUR02_012RPT'"
        :selectionStyle="'block'"
        @dblclickedRowData="dblclickedRowData"
        :documentSubTitle="documentSubTitle"
        :rowStateeditable="false"
        :exporttoExcel="exportExcel">
      </Realgrid>
    </div>
  </div>

  <div
    v-if="openPopUp"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white p-6 rounded-2xl shadow-xl w-[75vw] h-[80vh]">
      <div class="flex justify-between">
        <h2 class="text-xl font-bold mb-4">매입 상세</h2>
        <div class="flex space-x-5">
          <button class="whitebutton" @click="excelButton2">엑셀</button>
          <button class="whitebutton" @click="openPopUp = false">닫기</button>
        </div>
      </div>
      <div class="grid grid-rows-6 grid-cols-[1fr,4fr,1fr,4fr] h-[20vh]">
        <div
          class="flex space-x-5 items-center border-l border-t border-black justify-center">
          전표번호(발주)
        </div>
        <div
          class="flex space-x-5 items-center border-l border-t border-black justify-start pl-2">
          <input
            type="text"
            class="border border-black w-[80%] disabled:bg-gray-300"
            v-model="scond"
            disabled />
        </div>
        <div
          class="flex space-x-5 items-center border-l border-t border-black justify-center">
          전표번호(매입)
        </div>
        <div
          class="flex space-x-5 items-center border-l border-t border-black justify-start pl-2 border-r">
          <input
            type="text"
            v-model="scond2"
            class="border border-black w-[80%] disabled:bg-gray-300"
            disabled />
        </div>
        <div
          class="flex space-x-5 items-center border-l border-t border-black justify-center">
          매장
        </div>
        <div
          class="flex space-x-5 items-center border-l border-t border-black justify-start pl-2">
          <input
            type="text"
            v-model="scond3"
            class="border border-black w-[80%] disabled:bg-gray-300"
            disabled />
        </div>
        <div
          class="flex space-x-5 items-center border-l border-t border-black justify-center">
          거래처
        </div>
        <div
          class="flex space-x-5 items-center border-l border-t border-black justify-start pl-2 border-r">
          <input
            type="text"
            v-model="scond4"
            class="border border-black w-[80%] disabled:bg-gray-300"
            disabled />
        </div>
        <div
          class="flex space-x-5 items-center border-l border-t border-black justify-center">
          검수자
        </div>
        <div
          class="flex space-x-5 items-center border-l border-t border-black justify-start pl-2">
          <input
            type="text"
            class="border border-black w-[80%] disabled:bg-gray-300"
            v-model="scond5"
            disabled />
        </div>
        <div
          class="flex space-x-5 items-center border-l border-t border-black justify-center">
          검수일시
        </div>
        <div
          class="flex space-x-5 items-center border-l border-t border-black justify-start pl-2 border-r">
          <input
            type="text"
            class="border border-black w-[80%] disabled:bg-gray-300"
            v-model="scond6"
            disabled />
        </div>
        <div
          class="flex space-x-5 items-center border-l border-t border-black justify-center">
          코멘트(발주)
        </div>
        <div
          class="flex space-x-5 items-center border-l border-t border-r border-black justify-start pl-2 col-span-3">
          <input
            type="text"
            disabled
            class="border border-black w-[80%] disabled:bg-gray-300"
            v-model="scond7" />
        </div>
        <div
          class="flex space-x-5 items-center border-l border-t border-black justify-center">
          코멘트(출고)
        </div>
        <div
          class="flex space-x-5 items-center border-l border-t border-black justify-start pl-2 border-r col-span-3">
          <input
            type="text"
            class="border border-black w-[80%] disabled:bg-gray-300"
            disabled
            v-model="scond8" />
        </div>
        <div
          class="flex space-x-5 items-center border-l border-t border-b border-black justify-center">
          코멘트(매입)
        </div>
        <div
          class="flex space-x-5 items-center border-l border-t border-b border-r border-black justify-start pl-2 col-span-3">
          <input
            type="text"
            class="border border-black w-[80%] disabled:bg-gray-300"
            disabled
            v-model="scond9" />
        </div>
      </div>
      <div class="h-[60%] w-full flex justify-center items-center mt-2">
        <Realgrid
          :progname="'PUR02_012RPT_VUE'"
          :progid="2"
          :documentTitle="'PUR02_012RPT'"
          :exporttoExcel="exportExcel2"
          @updatedRowData="updatedRowData2"
          :setFooter="true"
          :rowStateeditable="false"
          :documentSubTitle="documentSubTitle2"
          :rowData="rowData2"></Realgrid>
      </div>
    </div>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import { getCommonList } from "@/api/common";
import {
  getOrderNCheckChitDetailList,
  getOrderNCheckChitMasterList,
  getStockAuditReportList,
} from "@/api/mipur";
import BusinessClient from "@/components/businessClient.vue";
import Datepicker2 from "@/components/Datepicker2.vue";
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

  const res = await getCommonList(27);

  optionList.value = res.data.List.filter((item) => item.strDCode != "01");

  const res2 = await getCommonList(24);

  optionList2.value = res2.data.List;
});

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

const cond = ref("");
const cond2 = ref("01");

const cond5 = ref(0);
const store = useStore();

const datepicker = ref(null);
const closePopUp = ref(false);
const optionList = ref([]);
const optionList2 = ref([]);
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

const sDate = ref("");
const eDate = ref("");

const selectedDate = ref();
const excelDate = (e) => {
  selectedDate.value = e;
};

const storeCode = ref();
const lngStoreCode = (e) => {
  initGrid();
  storeCode.value = e;
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

    const res = await getOrderNCheckChitMasterList(
      groupCd.value,
      storeCode.value,
      sDate.value.replaceAll("-", ""),
      eDate.value.replaceAll("-", ""),
      supplierid.value,
      cond.value
    );

    rowData.value = res.data.List;
    console.log(res);
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

const disabled1 = ref(false);
const progid = ref(1);
const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }

  reload.value = !reload.value;
};

//엑셀 버튼 처리 함수
const exportExcel = ref(false);
const exportExcel2 = ref(false);
/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  documentSubTitle.value =
    selectedDate.value + "\n" + "매장명 :" + selectedExcelStore.value;
  exportExcel.value = !exportExcel.value;
};
const excelButton2 = () => {
  documentSubTitle2.value =
    "전표번호 : " + scond.value + "\n" + "전표번호(매입) : " + scond2.value;
  exportExcel2.value = !exportExcel2.value;
};

const documentSubTitle2 = ref("");

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

const startDate = (e) => {
  sDate.value = e;
};
const endDate = (e) => {
  eDate.value = e;
};
const rowData2 = ref([]);

const openPopUp = ref(false);

const scond = ref("");
const scond2 = ref("");
const scond3 = ref("");
const scond4 = ref("");
const scond5 = ref("");
const scond6 = ref("");
const scond7 = ref("");
const scond8 = ref("");
const scond9 = ref("");
const dblclickedRowData = async (e) => {
  console.log(e);

  scond.value = e[2];
  scond2.value = e[3];
  scond3.value = e[0];
  scond4.value = e[1];
  scond5.value = e[4];
  scond6.value = e[5];
  scond7.value = e[18];
  scond8.value = e[19];
  scond9.value = e[20];
  try {
    const res = await getOrderNCheckChitDetailList(
      e[16],
      e[17],
      e[15],
      e[6],
      e[8],
      e[2],
      e[3]
    );
    console.log(res);
    rowData2.value = res.data.List;
  } catch (error) {}
  openPopUp.value = true;
};
</script>
