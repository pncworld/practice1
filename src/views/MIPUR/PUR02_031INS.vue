<!-- /*--############################################################################
# Filename : PUR02_031INS.vue                                                  
# Description : 구매관리2 > 매입 관리 > 매입등록                      
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
        <button @click="addButton" class="button new md:w-auto w-14">
          신규
        </button>
        <button @click="saveButton" class="button save md:w-auto w-14">
          저장
        </button>
        <button @click="deleteButton" class="button delete md:w-auto w-14">
          삭제
        </button>
        <button @click="excelButton" class="button save w-auto excel">
          엑셀
        </button>
      </div>
    </div>
    <div
      class="grid grid-cols-3 grid-rows-1 bg-gray-200 rounded-lg h-16 items-start z-10">
      <div class="justify-start flex">
        <Datepicker2
          :mainName="'조회기간'"
          @endDate="endDate"
          ref="datepicker"
          :closePopUp="closePopUp"
          @excelDate="excelDate"
          @startDate="startDate">
        </Datepicker2>
      </div>
      <div class="flex justify-start items-center">
        <PickStore
          @update:storeGroup="lngStoreGroup"
          :hideGroup="false"
          :defaultStoreType2="true"
          :hideAttr="false"
          @storeNm="excelStore"
          @update:storeCd="lngStoreCode"></PickStore>
      </div>
      <div class="flex justify-start pl-16 items-start mt-2">
        <BusinessClient
          @SupplierId="SupplierId"
          :defaultNm="'전체'"></BusinessClient>
      </div>
    </div>
    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="w-full h-[25vh]">
      <div class="w-full h-full">
        <Realgrid
          :progname="'PUR02_031INS_VUE'"
          :progid="1"
          :rowData="rowData"
          :reload="reload"
          :setFooter="true"
          :documentTitle="'PUR02_031INS'"
          @clickedRowData="clickedRowData"
          :documentSubTitle="documentSubTitle"
          :rowStateeditable="false"
          :exporttoExcel="exportExcel">
        </Realgrid>
      </div>
    </div>
    <div class="flex bg-gray-200 rounded-lg h-16 items-start z-10 space-x-5">
      <div class="ml-12 mt-2">
        <BusinessClient
          @SupplierId="SupplierId2"
          :defaultNm="'전체'"></BusinessClient>
      </div>
      <div class="flex items-center space-x-5 mt-4">
        <div class="font-semibold text-base">자재명</div>
        <div>
          <input
            type="text"
            class="w-56 h-7 border border-black"
            v-model="cond2" />
        </div>
      </div>
      <div class="mt-4 ml-5">
        <button class="whitebutton bg-white" @click="searchButton2">
          조회
        </button>
      </div>
    </div>

    <div class="h-[35vh]">
      <Realgrid
        :progname="'PUR02_031INS_VUE'"
        :progid="2"
        :rowData="rowData2"></Realgrid>
    </div>

    <div class="h-[10vh]">
      <div class="text-base font-semibold">Comment</div>

      <textarea
        name=""
        id=""
        class="shadow-lg border border-gray-400 w-full h-full"></textarea>
    </div>
  </div>
  <!-- 그리드 영역 -->

  <div
    v-if="showp"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white p-6 rounded-2xl shadow-xl w-96 flex">
      <h2 class="text-xl font-bold mb-4">자재 리스트</h2>

      <button
        @click="showp = false"
        class="px-4 py-2 bg-gray-700 text-white rounded-lg">
        닫기
      </button>
    </div>

    <div>
      <Realgrid
        :progname="'PUR02_031INS_VUE'"
        :progid="2"
        :rowData="rowData2"></Realgrid>
    </div>
  </div>
</template>

<script setup>
import { getCommonList } from "@/api/common";
import { getPurChaseEnrollList, getStockItemList4 } from "@/api/mipur";
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

  optionList.value = res.data.List.filter((item) => item.strDCode !== "01");
});

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

const cond = ref("02");
const cond2 = ref("");
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
const startDate = (e) => {
  initGrid();
  sDate.value = e;
};
const endDate = (e) => {
  initGrid();
  eDate.value = e;
};

const selectedDate = ref();
const excelDate = (e) => {
  selectedDate.value = e;
};
const optionList2 = ref([]);

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
    console.log(store.state.userData);
    const res = await getPurChaseEnrollList(
      groupCd.value,
      storeCode.value,
      store.state.userData.strLanguage,
      sDate.value.replaceAll("-", ""),
      eDate.value.replaceAll("-", ""),
      supplierid.value
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

const progid = ref(1);
const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }

  //   if (cond5.value == 0) {
  //     progid.value = 1;
  //   } else if (cond5.value == 1) {
  //     progid.value = 2;
  //   } else if (cond5.value == 2) {
  //     progid.value = 3;
  //   } else if (cond5.value == 3) {
  //     progid.value = 4;
  //   }

  //   reload.value = !reload.value;
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

const rowData2 = ref([]);

const selectedSupplierid2 = ref("");
const SupplierId2 = (e) => {
  //console.log(e);
  selectedSupplierid2.value = e;
};
const searchButton2 = async () => {
  try {
    const res = await getStockItemList4(
      groupCd.value,
      storeCode.value,
      selectedSupplierid2.value,
      "strStock",
      "",
      "0",
      cond2.value
    );

    console.log(res);

    showp.value = true;
  } catch (error) {}
};

const showp = ref(false);
</script>
