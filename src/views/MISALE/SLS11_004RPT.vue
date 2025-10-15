 /*--############################################################################
# Filename : SLS11_004RPT.vue                                                  
# Description : 매출관리 > 상세 매출 현황 > 할인 세부 내역.                    
# Date :2025-05-14                                                             
# Author : 권맑음                     
################################################################################*/
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
      class="grid grid-cols-2 grid-rows-1 justify-between bg-gray-200 rounded-lg h-24 items-start z-10">
      <div class="grid grid-cols-1 grid-rows-3">
        <div class="flex ml-8">
          <Datepicker2
            @endDate="endDate"
            @startDate="startDate"
            :closePopUp="closePopUp"
            ref="datepicker"
            @excelDate="excelDate"
            :mainName="'일자'"
            :initToday="1"></Datepicker2>
        </div>
        <div
          class="text-nowrap flex justify-start items-center -space-x-7 ml-12 -mt-1">
          <div class="text-base font-semibold">할인코드</div>
          <div class="flex mt-2 items-center justify-start">
            <v-select
              v-model="selectedDiscountCode"
              :options="discountCodeList"
              placeholder="전체"
              label="strName"
              class="!w-48 !h-7 custom-select5"
              clearable="true"
              @click="resetVselect2" />
          </div>
        </div>
      </div>
      <div class="">
        <PickStoreSingle2
          @lngStoreCode="lngStoreCodes"
          @lngStoreGroup="lngStoreGroup"
          @excelStore="excelStore"
          @changeInit="changeInit"
          @lngSupervisor="lngSupervisor"
          @lngStoreTeam="lngStoreTeam"
          @lngStoreAttrs="lngStoreAttrs">
        </PickStoreSingle2>
      </div>
      <div></div>
    </div>
    <!-- 조회조건 -->
    <!-- 그리드 영역-->
    <div class="w-full h-[80%]">
      <Realgrid
        :progname="'SLS11_004RPT_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :setFooter="true"
        :setMergeMode="false"
        :setGroupSumCustomColumnId2="setGroupSumCustomColumnId2"
        :setGroupCustomLevel="2"
        :setGroupFooter="true"
        :setGroupColumnId="setGroupColumnId"
        :selectionStyle="'group'"
        :rowStateeditable="false"
        :setFooterCustomColumnId="['strStoreName']"
        :setFooterCustomText="['총합계']"
        :documentTitle="'SLS11_004RPT'"
        :documentSubTitle="documentSubTitle"
        :exporttoExcel="exportExcel">
      </Realgrid>
    </div>
  </div>
  <!-- 그리드 영역-->
</template>

<script setup>
import { getDiscountCodes, getDiscountRecords } from "@/api/misales";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

import Datepicker2 from "@/components/Datepicker2.vue";
/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
/**
 *  매장  단일 선택 컴포넌트
 *  */

import PickStoreSingle2 from "@/components/pickStoreSingle.vue";
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

const progid = ref(1);
const setRowGroupSpan = ref("");
const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);
const selectedstartDate = ref();
const selectedendDate = ref();
const hideColumnNow = ref(true);
const setGroupSumCustomColumnId2 = ref(["lngStoreCode"]);
const setGroupColumnId = ref("lngStoreCode");
const hideColumnsId = ref(["strStore", "dtmDate"]);
/**
 * 선택한 매출 시작일자
 */

const startDate = (e) => {
  //comsole.log(e);
  selectedstartDate.value = e;
};
/**
 * 선택한 매출 종료일자
 */

const endDate = (e) => {
  selectedendDate.value = e;
};

const setGroupFooter = ref(false);

const store = useStore();

/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
});

/**
 *  조회 함수
 */

const searchButton = async () => {
  store.state.loading = true;
  try {
    initGrid();
    let selectedlngCode = "";
    if (selectedDiscountCode.value == null) {
      selectedlngCode = 0;
    } else {
      selectedlngCode = selectedDiscountCode.value.lngCode;
    }
    reload.value = !reload.value;

    const res = await getDiscountRecords(
      selectedGroup.value,
      selectedStoreAttrs.value,
      selectedStoreTeam.value,
      selectedStoreSuperVisor.value,
      selectedStores.value,
      selectedstartDate.value,
      selectedendDate.value,
      selectedlngCode
    );
    //comsole.log(res);
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
const selectedStoreTeam = ref();
const selectedStoreSuperVisor = ref();
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

const lngStoreCodes = async (e) => {
  selectedStores.value = e;
  //comsole.log(e);

  const res = await getDiscountCodes(selectedGroup.value, selectedStores.value);
  discountCodeList.value = res.data.List;
  selectedDiscountCode.value = null;
};

/**
 * 페이지 매장 분류 세팅
 */

const lngStoreAttrs = (e) => {
  selectedStoreAttrs.value = e;
  //comsole.log(e);
};
/**
 * 페이지 매장 슈퍼바이저 세팅
 */

const lngSupervisor = (e) => {
  selectedStoreSuperVisor.value = e;
  //comsole.log(e);
};
/**
 * 페이지 매장 팀 세팅
 */

const lngStoreTeam = (e) => {
  selectedStoreTeam.value = e;
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

/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  let condition2 = "할인코드 : ";
  if (selectedDiscountCode.value == null) {
    condition2 += "전체";
  } else {
    condition2 += selectedDiscountCode.value.strName;
  }

  //condition2 = condition2.substring(0,condition2.length-1)

  documentSubTitle.value =
    selectedExcelDate.value +
    "\n" +
    selectedExcelStore.value +
    "\n" +
    condition2;

  exportExcel.value = !exportExcel.value;
};

const selectedDiscountCode = ref(null);
const discountCodeList = ref([]);
const resetVselect2 = () => {
  selectedDiscountCode.value = null;
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
