<!-- /*--############################################################################
# Filename : STKN07_018RPT.vue                                                  
# Description : 자재관리2 > 실사 관리 > 일별 실사재고 등록                     
# Date :2025-09-01                                                             
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
        <button @click="saveButton" class="button save md:w-auto w-14">
          저장
        </button>
        <button @click="excelButton" class="button save w-auto excel">
          엑셀
        </button>
      </div>
    </div>
    <div
      class="grid grid-cols-3 grid-rows-6 bg-gray-200 rounded-lg h-64 items-start z-10 gap-1">
      <div class="justify-start flex ml-32">
        <Datepicker1
          :mainName="'일자'"
          @dateValue="dateValue"
          ref="datepicker"
          :initToday="1"
          @excelDate="excelDate">
        </Datepicker1>
      </div>
      <div class="flex justify-start items-center col-span-2 ml-10">
        <PickStore
          @update:storeGroup="lngStoreGroup"
          :defaultStoreNm="'전체'"
          class=""
          @storeNm="excelStore"
          @update:storeCd="lngStoreCode"></PickStore>
      </div>
      <div class="flex justify-start pl-20 items-center mt-5 space-x-5">
        <div class="text-base font-semibold text-nowrap">자재코드/명</div>
        <div class="flex items-center justify-center space-x-2">
          <input
            type="text"
            class="border border-black h-7 w-40"
            v-model="cond" />
          <div>/</div>
          <input
            type="text"
            class="border border-black h-7 w-40"
            v-model="cond2" />
        </div>
      </div>

      <div class="flex space-x-5 !ml-20 pl-2 mt-3 items-center">
        <BusinessClient
          :defaultNm="'전체'"
          @SupplierId="SupplierId"></BusinessClient>
      </div>
      <div class="flex space-x-5 ml-12 mt-5 items-center">
        <div>
          <label for="cond3"
            ><input type="checkbox" id="cond3" @change="setCond3" />전체
            품목보기</label
          >
        </div>
      </div>
      <div class="flex space-x-5 ml-24 mt-5 items-center pl-1">
        <div class="font-semibold text-base">자재그룹</div>
        <div>
          <select
            name=""
            id=""
            class="w-64 border border-black h-7"
            v-model="cond4">
            <option value="0">전체</option>
            <option :value="i.lngStockGroupID" v-for="i in optionList">
              {{ i.strStockGroupName }}
            </option>
          </select>
        </div>
      </div>

      <div class="flex space-x-5 ml-16 pl-3 mt-5 items-center">
        <div class="font-semibold text-base">자재분류</div>
        <div>
          <select
            name=""
            id=""
            class="w-64 border border-black h-7"
            v-model="cond5">
            <option value="0">전체</option>
            <option :value="i.lngCategoryID" v-for="i in optionList2">
              {{ i.strCategoryName }}
            </option>
          </select>
        </div>
      </div>

      <div class="flex space-x-5 ml-12 mt-5 items-center">
        <div class="font-semibold text-base">자재특성</div>
        <div>
          <select
            name=""
            id=""
            class="w-64 border border-black h-7"
            v-model="cond6">
            <option value="0">전체</option>
            <option :value="i.lngGenericID" v-for="i in optionList3">
              {{ i.strGenericName }}
            </option>
          </select>
        </div>
      </div>

      <div class="flex ml-12 mt-5 items-center">
        <div class="font-semibold text-base text-nowrap">엑셀 실사 업로드</div>
        <div>
          <input
            type="text"
            disabled
            class="border border-black h-7 w-64 disabled:bg-white ml-5" />
        </div>
        <button class="whitebutton bg-white ml-2">찾기</button>
        <button class="whitebutton bg-white">불러오기</button>
      </div>

      <div class="flex ml-12 mt-5 items-center col-span-2">
        <div class="font-semibold text-base text-nowrap">SHEET 선택</div>
        <div>
          <input
            type="text"
            disabled
            class="border border-black h-7 w-64 disabled:bg-white ml-5" />
        </div>
        <button class="whitebutton bg-white ml-2">업로드</button>
        <button class="whitebutton bg-white !text-nowrap">업로드 초기화</button>
      </div>

      <div
        class="flex ml-12 mt-2 items-start flex-col justify-start col-span-3">
        <div class="font-semibold text-xs text-nowrap text-blue-500">
          ＊엑셀 실사 업로드 시 엑셀 변환 후 실사 수량만 수정 후 업로드
          해주십시오.
        </div>
        <div class="font-semibold text-xs text-nowrap text-red-500">
          ＊실사를 입력하지 않은 품목은 DAILY INVENTORY에 실재고 0으로 처리
          됩니다.
        </div>
      </div>

      <div
        class="flex ml-12 mt-1 space-x-5 items-center justify-start col-span-3">
        <div class="font-semibold text-sm text-nowrap text-blue-500">
          Notice
        </div>

        <input
          type="text"
          disabled
          class="border border-black bg-white w-[85%] h-7 text-red-500 disabled:bg-white"
          v-model="Notice" />
      </div>
    </div>
    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="w-full h-[62vh]">
      <Realgrid
        :progname="'STKN07_018RPT_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :documentTitle="'STKN07_018RPT'"
        @clickedRowData="clickedRowData"
        :documentSubTitle="documentSubTitle"
        :rowStateeditable="false"
        :ColCellRedColorColId="['strRegDT', 'strRegYN']"
        :exporttoExcel="exportExcel">
      </Realgrid>
    </div>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import { getCommonList } from "@/api/common";
import { getStockCategory, getStockGeneric, getStockGroup } from "@/api/master";
import { getLossReportList, getStockDailyList } from "@/api/mistock";
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

const optionList3 = ref([]);
onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getStockGroup(store.state.userData.lngStoreGroup);
  //console.log(res);
  optionList.value = res.data.List;

  const res2 = await getStockCategory(store.state.userData.lngStoreGroup);
  //console.log(res2);
  optionList2.value = res2.data.List;

  const res3 = await getStockGeneric(store.state.userData.lngStoreGroup);
  //console.log(res3);
  optionList3.value = res3.data.List;

  // const
});

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

const cond = ref("");
const cond2 = ref("");
const cond3 = ref(false);
const cond4 = ref("0");
const cond5 = ref("0");
const cond6 = ref("0");
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

const dateValue = (e) => {
  ////console.log(e);
  sDate.value = e;
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

    const res = await getStockDailyList(
      groupCd.value,
      storeCode.value,
      sDate.value.replaceAll("-", ""),
      5,
      cond3.value == true ? "02" : "01"
    );

    rowData.value = res.data.List2;
    Notice.value = res.data.List[0].RESULT_MSG;
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

const setRowStyleCallsDefaultCol2 = ref("strTaxType");
const setRowStyleCallsDefaultCol = ref("strTaxType");
const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }

  if (cond5.value == false && cond6.value == false) {
    progid.value = 1;
  } else if (cond5.value == true && cond6.value == false) {
    progid.value = 3;
  } else if (cond5.value == false && cond6.value == true) {
    progid.value = 2;
  } else {
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
const Notice = ref("");
const setCond3 = (e) => {
  ////console.log(e.target.checked);
  cond3.value = e.target.checked;
};
</script>
