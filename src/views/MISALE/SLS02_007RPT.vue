<!-- /*--############################################################################
# Filename : SLS02_007RPT.vue                                                  
# Description : 매출관리 > 매출집계현황 > 일별층별매출현황.
# Date :2025-12-10                                                             
# Author : 권지안                    
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
      <div class="grid grid-cols-1 grid-rows-3">
        <Datepicker2
          class=""
          ref="datepicker"
          :closePopUp="closePopUp"
          @endDate="endDate"
          @startDate="startDate"
          @excelDate="excelDate"
          :initToday3="true">
        </Datepicker2>
        <div class="flex justify-between items-center text-nowrap ml-20 -mt-2">
          <div class="text-nowrap flex justify-start items-center space-x-5">
            <div class="text-base font-semibold">조건</div>
            <div class="flex space-x-10">
              <label for="thirdFloor">
                <input
                  type="checkbox"
                  id="thirdFloor"
                  @click="checkFloor"
                  checked
                />3층
              </label>
              <label for="ninethFloor">
                <input
                  type="checkbox"
                  id="ninethFloor"
                  @click="checkFloor"
                  checked
                />9층
              </label>
            </div>
          </div>
        </div>
      </div>
      <div class="ml-1">
        <PickStoreRenew3
          @lngStoreCode="lngStoreCodes"
          @lngStoreGroup="lngStoreGroup"
          @excelStore="excelStore"
          @changeInit="changeInit"
          @lngStoreAttrs="lngStoreAttrs">
        </PickStoreRenew3>
      </div>
    </div>
    <!-- 조회 조건 -->
    <!-- 그리드 영역 -->
    <div class="w-full h-[80%]">
      <Realgrid
        :progname="'SLS02_007RPT_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :setFooter="true"
        :setFooterExpressions="['sum', 'sum']"
        :setFooterColID="['lngAmount', 'intCount']"
        :documentTitle="'SLS02_007RPT'"
        :rowStateeditable="false"
        :documentSubTitle="documentSubTitle"
        :exporttoExcel="exportExcel">
      </Realgrid>
    </div>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import { getDailySalesStatusByFloor } from "@/api/misales";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

import Datepicker2 from "@/components/Datepicker2.vue";
/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
/**
 *  매장 선택 컴포넌트
 *  */

import PickStoreRenew3 from "@/components/pickStoreRenew.vue";
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

import { useStore } from "vuex";

const setRowGroupSpan = ref("");
const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);
const selectedstartDate = ref();
const selectedendDate = ref();

/**
 * 선택한 매출 시작일자
 */

const startDate = (e) => {
  // console.log(e);
  selectedstartDate.value = e;
};

/**
 * 선택한 매출 종료일자
 */
const endDate = (e) => {
  selectedendDate.value = e;
};

let intRegNo1 = 1;
let intRegNo2 = 2;

const checkFloor = () => {
  const chk1 = document.getElementById("thirdFloor").checked;
  const chk2 = document.getElementById("ninethFloor").checked;

  if (chk1 && chk2) {
    intRegNo1 = 1;
    intRegNo2 = 2;
  } else if (chk1 && !chk2) {
    intRegNo1 = 1;
    intRegNo2 = 1;
  } else if (!chk1 && chk2) {
    intRegNo1 = 2;
    intRegNo2 = 2;
  } else {
    intRegNo1 = 0;
    intRegNo2 = 0;
  }

  // console.log("intRegNo1:", intRegNo1, " / intRegNo2:", intRegNo2);

};

const store = useStore();
const mergeMask = ref();

/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const userGroup = store.state.storeGroup[0].lngStoreGroup;

  // const res = await getCauseListbyMenu(userGroup, 0);
  // causeList.value = res.data.List;
  //comsole.log(res);
});

/**
 *  조회 함수
 */

const searchButton = async () => {
  store.state.loading = true;
  try {
    initGrid();

    reload.value = !reload.value;

    const res = await getDailySalesStatusByFloor(
      selectedGroup.value,
      selectedStores.value,
      selectedstartDate.value,
      selectedendDate.value,
      intRegNo1,
      intRegNo2,
      901
    );

    // console.log(res)
    
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

//comsole.log(store.state.minorCategory);

/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {

  documentSubTitle.value =
    selectedExcelDate.value +
    "\n" +
    selectedExcelStore.value
  ;
  
  exportExcel.value = !exportExcel.value;

};

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
const documentSubTitle = ref("");
const selectedExcelDate = ref("");
/**
 * 엑셀용 일자 세팅 함수
 */

const excelDate = (e) => {
  selectedExcelDate.value = e;
};
const selectedExcelStore = ref("");
/**
 * 엑셀용 매장 세팅 함수
 */

const excelStore = (e) => {
  selectedExcelStore.value = e;
};

/**
 *  컴포넌트 변동시 감지 함수
 */

const changeInit = (e) => {
  initGrid();
};
</script>

<style></style>
