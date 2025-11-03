<!-- /*--############################################################################
# Filename : SLS11_007RPT.vue                                                  
# Description : 매출관리 > 분류별 매출현황 > 좌석별/메뉴별 매출현황.              
# Date :2025-11-03                                                            
# Author : 권맑음                     
################################################################################*/ -->
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
      <div class="grid grid-cols-1 grid-rows-2">
        <Datepicker2
          @startDate="startDate"
          @endDate="endDate"
          :closePopUp="closePopUp"
          ref="datepicker"
          @excelDate="excelDate" />
        <div
          class="flex justify-start items-center text-base text-nowrap font-semibold ml-12">
          조회조건
          <div>
            <label for="daily" class="font-normal">
              <input
                type="checkbox"
                id="daily"
                class="ml-5"
                :value="cond"
                @change="setDay" />일자별
            </label>
          </div>
          <div>
            <label for="unite" class="font-normal">
              <input
                type="checkbox"
                id="unite"
                class="ml-5"
                :value="cond2"
                @change="setStore" />매장별
            </label>
          </div>
          <div>
            <label for="sum" class="font-normal">
              <input
                type="checkbox"
                id="sum"
                class="ml-5"
                :value="cond3"
                @change="setSum"
                checked />합계
            </label>
          </div>
        </div>
      </div>
      <div class="h-[75%]">
        <pickStoreRenew
          @lngStoreCode="selectedStoreCd"
          @lngStoreGroup="selectedGroupCd"
          @lngStoreAttrs="lngStoreAttrs"
          @excelStore="excelStore"
          @changeInit="changeInit"></pickStoreRenew>
      </div>
    </div>
    <!-- 조회 조건 -->
    <!-- 그리드 영역 -->
    <div class="w-full h-[82%]">
      <Realgrid
        :progname="'SLS11_021RPT_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :setFooter="true"
        :setGroupSumCustomColumnId="['dtmDate']"
        :setGroupSumCustomText="['소계']"
        :setGroupFooter="setGroupFooter"
        :hideColumnsId="hideColumnsId"
        :setGroupColumnId="setGroupColumnId"
        :setGroupSumCustomColumnId2="setGroupSumCustomColumnId2"
        :mergeMask="''"
        :setMergeMode="false"
        :documentTitle="'SLS11_021RPT'"
        :rowStateeditable="false"
        :documentSubTitle="documentSubTitle"
        :exporttoExcel="exportExcel">
      </Realgrid>
    </div>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import {
  getSalesByPaymentTypeReport,
  getSalesBySeatsAndMenus,
} from "@/api/misales";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

import Datepicker2 from "@/components/Datepicker2.vue";
/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
/**
 * 	매장 단일 선택 컴포넌트
 */

import pickStoreRenew from "@/components/pickStoreRenew.vue";
/**
 * 	그리드 생성
 */

import Realgrid from "@/components/realgrid.vue";
/**
 *  페이지로그 자동 입력
 *  */

import { insertPageLog } from "@/customFunc/customFunc";
import { IconTemplate } from "ckeditor5";
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
});

const setGroupFooter = ref(true);
const hideColumnsId = ref(["strStoreName", "strDate"]);
const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);
const sdate = ref();
const edate = ref();
const setRowGroupSpan = ref("");

/**
 * 선택한 매출 시작일자
 */

const startDate = (e) => {
  //comsole.log(e);
  sdate.value = e;
};

/**
 * 선택한 매출 종료일자
 */

const endDate = (e) => {
  //comsole.log(e);
  edate.value = e;
};

const reportCheckData = ref("0");

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
  store.state.loading = true;
  try {
    initGrid();

    //그리드 갱신
    reload.value = !reload.value;

    //comsole.log(reportCheckData.value);

    const res = await getSalesBySeatsAndMenus(
      groupCd.value,
      storeCd.value,
      sdate.value,
      edate.value,
      cond.value == true ? 1 : 0,
      cond2.value == true ? 1 : 0,
      cond3.value == true ? 1 : 0
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

const groupCd = ref();
const storeCd = ref();
const selectedStoreAttr = ref();

/**
 * 선택한 매장 코드 호출 함수
 */

const selectedStoreCd = (e) => {
  //comsole.log(e);
  storeCd.value = e;
};
/**
 * 선택한 매장 그룹 코드 호출 함수
 */

const selectedGroupCd = (e) => {
  //comsole.log(e);
  groupCd.value = e;
};

/**
 * 페이지 매장 분류 세팅
 */

const lngStoreAttrs = (e) => {
  initGrid();
  selectedStoreAttr.value = e;
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

//엑셀 버튼 처리 함수
const exportExcel = ref(false);
/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  documentSubTitle.value =
    selectedExcelDate.value + "\n" + selectedExcelStore.value;
  //comsole.log(documentSubTitle.value);
  // 엑셀 기능 실행
  exportExcel.value = !exportExcel.value;
};

// 엑셀 추출
const documentSubTitle = ref("");
const selectedExcelDate = ref("");
/**
 * 엑셀용 일자 세팅 함수
 */

const excelDate = (e) => {
  selectedExcelDate.value = e;
  //comsole.log(e);
};
const selectedExcelStore = ref("");
/**
 * 엑셀용 매장 세팅 함수
 */

const excelStore = (e) => {
  selectedExcelStore.value = e;
  //comsole.log(e);
};

/**
 *  컴포넌트 변동시 감지 함수
 */

const changeInit = (e) => {
  initGrid();
};

const cond = ref(false);
const cond2 = ref(false);
const cond3 = ref(true);
const setGroupColumnId = ref("");
const setGroupSumCustomColumnId2 = ref(["strStoreName", "strDate"]);
const setSum = (e) => {
  cond3.value = e.target.checked;

  if (cond3.value == true) {
    setGroupFooter.value = true;
  } else {
    setGroupFooter.value = false;
  }
};
const setStore = (e) => {
  cond2.value = e.target.checked;

  if (cond2.value == true) {
    hideColumnsId.value = hideColumnsId.value.filter(
      (item) => item != "strStoreName"
    );
    if (cond.value == true) {
      setGroupColumnId.value = "strStoreName,strDate";
    } else {
      setGroupColumnId.value = "strStoreName";
    }
  } else {
    hideColumnsId.value.push("strStoreName");
    if (cond.value == true) {
      setGroupColumnId.value = "strDate";
    } else {
      setGroupColumnId.value = "";
    }
  }
};
const setDay = (e) => {
  cond.value = e.target.checked;

  if (cond.value == true) {
    hideColumnsId.value = hideColumnsId.value.filter(
      (item) => item != "strDate"
    );

    if (cond2.value == true) {
      setGroupColumnId.value = "strStoreName,strDate";
    } else {
      setGroupColumnId.value = "strDate";
    }
  } else {
    hideColumnsId.value.push("strDate");

    if (cond2.value == true) {
      setGroupColumnId.value = "strStoreName";
    } else {
      setGroupColumnId.value = "";
    }
  }
};
</script>
