<!-- /*--############################################################################
# Filename : STKN07_017RPT.vue                                                  
# Description : 자재관리 > 실사 관리 > 파트별 실사 조회.               
# Date :2025-09-18                                                           
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
        <button @click="excelButton" class="button save excel">엑셀</button>
      </div>
    </div>
    <div
      class="grid grid-cols-4 grid-rows-1 justify-between bg-gray-200 rounded-lg h-16 items-start z-10">
      <div class="grid grid-cols-1 grid-rows-2">
        <div class="flex ml-12">
          <Datepicker1 @dateValue="dateValue"></Datepicker1>
        </div>
      </div>
      <div class="mt-2 flex">
        <PickStoreRenew
          @lngStoreCode="lngStoreCode"
          @excelStore="excelStore"
          :hideit2="false"
          :hideit="false"></PickStoreRenew>
      </div>
      <div class="flex items-center space-x-5 mt-2">
        <div class="text-base font-semibold">파트</div>
        <div>
          <select
            name=""
            id=""
            class="border border-black w-32 h-8"
            v-model="cond">
            <option :value="i.lngPartCode" v-for="i in optionList3">
              {{ i.strPartName }}
            </option>
          </select>
        </div>
      </div>
      <div class="flex mt-2 items-center space-x-5">
        <div class="text-base font-semibold">조사주기</div>
        <div>
          <select
            name=""
            id=""
            class="w-48 h-8 border border-black"
            v-model="cond2">
            <option value="0">전체</option>
            <option :value="i.strDCode" v-for="i in optionList2">
              {{ i.strDName }}
            </option>
          </select>
        </div>
        <div>
          <label for="cond3"
            ><input type="checkbox" id="cond3" v-model="cond3" />전체보기</label
          >
        </div>
      </div>
    </div>
    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="w-full h-[82%]">
      <Realgrid
        :progname="'STKN07_017RPT_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :setFooter="true"
        :documentTitle="'STKN07_017RPT'"
        :documentSubTitle="documentSubTitle"
        :rowStateeditable="false"
        :exporttoExcel="exportExcel">
      </Realgrid>
    </div>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import { getCommonList } from "@/api/common";
import {
  getLossMasterPartList,
  getStockDetail,
  getStockResultByPart,
} from "@/api/mistock";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
import PickStoreRenew from "@/components/pickStoreRenew.vue";
/**
 *  단일 매장  컴포넌트
 *  */

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
import Swal from "sweetalert2";

import Datepicker1 from "@/components/Datepicker1.vue";
import { useStore } from "vuex";

const optionList = ref([]);
const optionList2 = ref([]);
const optionList3 = ref([]);

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

/**
 * 선택한 매출 시작일자
 */

const cond = ref(0);
const cond2 = ref(0);
const cond3 = ref(false);

const store = useStore();

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

/**
 *  조회 함수
 */

const searchButton = async () => {
  if (selectedStore.value == "0") {
    Swal.fire({
      title: "경고",
      text: "매장을 먼저 선택해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }

  if (cond.value == "0") {
    Swal.fire({
      title: "경고",
      text: "파트를 먼저 선택해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }
  try {
    initGrid();

    store.state.loading = true;
    const res = await getStockResultByPart(
      store.state.userData.lngStoreGroup,
      selectedStore.value,
      selectedDate.value.replaceAll("-", ""),
      cond2.value,
      5,
      cond3.value == true ? "02" : "01",
      cond.value
    );
    console.log(res);
    rowData.value = res.data.List;

    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    //comsole.log(error);
  } finally {
    store.state.loading = false;
  }
};

/* 매장 컴포넌트 관련 함수 */

const selectedStore = ref(0);

const selectedWeekDay = ref("");

/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
  const res = await getCommonList("07");

  optionList.value = res.data.List;

  const res2 = await getCommonList(73);

  optionList2.value = res2.data.List;

  //comsole.log(weekDay.value);
});

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
  documentSubTitle.value =
    selectedExcelDate.value + "\n" + selectedExcelStore.value;

  // 엑셀 기능 실행
  exportExcel.value = !exportExcel.value;
};

// 엑셀 추출
const documentSubTitle = ref("");
const selectedExcelDate = ref("");

const selectedDate = ref("");
const dateValue = (e) => {
  selectedDate.value = e;
};

const lngStoreCode = async (e) => {
  selectedStore.value = e;
  const res2 = await getLossMasterPartList(
    store.state.userData.lngStoreGroup,
    selectedStore.value
  );

  optionList3.value = res2.data.List;

  initGrid();
};
const selectedExcelStore = ref("");
/**
 * 엑셀용 매장 세팅 함수
 */

const excelStore = (e) => {
  selectedExcelStore.value = e;
  //comsole.log(e);
};

const smonth = ref("");
const month = (e) => {
  smonth.value = e;
};

const syear = ref("");
const year = (e) => {
  syear.value = e;
};
</script>
