/*--############################################################################
# Filename : SLS12_019RPT.vue                                                  
# Description : 매출관리 > 상세 매출 현황 > 결제 세부 내역                      
# Date :2025-05-14                                                             
# Author : 권맑음                     
################################################################################*/
<template>
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
          @endDate="endDate"
          @startDate="startDate"
          class=""
          :closePopUp="closePopUp"
          ref="datepicker"
          @excelDate="excelDate"></Datepicker2>

        <div class="flex justify-start -space-x-7">
          <div class="text-base font-semibold ml-12 text-nowrap">결제코드</div>
          <div class="flex justify-center">
            <v-select
              v-model="selectedCode"
              :options="codeList"
              placeholder="전체"
              label="strName"
              class="custom-select5"
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

    <div class="w-full h-[80%]">
      <Realgrid
        :progname="'SLS12_019RPT_VUE'"
        :progid="progid"
        :rowData="rowData"
        :reload="reload"
        :setFooter="true"
        :mergeMask="''"
        :setMergeMode="false"
        :setGroupFooter="setGroupFooter"
        :setGroupColumnId="setGroupColumnId"
        :setGroupCustomLevel="2"
        :setGroupSumCustomColumnId2="['lngStoreCode']"
        :setFooterCustomColumnId="['strStoreName']"
        :setFooterCustomText="['총합계']"
        :documentTitle="'SLS12_019RPT'"
        :rowStateeditable="false"
        :documentSubTitle="documentSubTitle"
        :exporttoExcel="exportExcel">
      </Realgrid>
    </div>
  </div>
</template>

<script setup>
import { getpayCodeList2, getSalesDetail } from "@/api/misales";
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

const orderPay = ref(1);
const setFooterColID = ref(["lngCount", "lngPreAmt", "lngAmt", "lngChange"]);
const setGroupFooterColID = ref(["lngStoreCode"]);
const setFooterExpressions = ref(["sum", "sum", "sum", "sum"]);
const setGroupFooterExpressions = ref(["sum", "sum", "sum", "sum"]);
const codeList = ref([]);
const selectedCode = ref(null);
const progid = ref(1);
const setRowGroupSpan = ref("lngStoreCode,strName");
const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);
const selectedstartDate = ref();
const selectedendDate = ref();
const hideColumnNow = ref(true);
const setGroupColumnId = ref("lngStoreCode");
const hideColumnsId = ref(["strStore"]);
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
const startTime = ref(0);
const endTime = ref(23);
const setGroupFooter = ref(true);
const selectedCause = ref(null);
const store = useStore();
const causeList = ref([]);
const mergeMask = ref();
/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const userGroup = store.state.storeGroup[0].lngStoreGroup;

  const res = await getpayCodeList2(userGroup, 0);
  codeList.value = res.data.List;
  //comsole.log(res);
});

const loginedstrLang = store.state.userData.lngLanguage;
/**
 *  조회 함수
 */

const searchButton = async () => {
  store.state.loading = true;
  try {
    initGrid();
    let code;
    if (selectedCode.value == null || selectedCode.value == undefined) {
      code = 0;
    } else {
      code = selectedCode.value.lngCode;
    }

    reload.value = !reload.value;

    const res = await getSalesDetail(
      selectedGroup.value,
      selectedStoreAttrs.value,
      selectedStoreTeam.value,
      selectedStoreSuperVisor.value,
      selectedStores.value,
      selectedstartDate.value,
      selectedendDate.value,
      code
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
  const userGroup = store.state.storeGroup[0].lngStoreGroup;

  const res = await getpayCodeList2(userGroup, selectedStores.value);
  codeList.value = res.data.List;
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
  // let condition = '조건 :';
  // if(tempHideStore.value == true){
  //   condition+="매장명,"
  // }
  // if(tempCellUnite.value == true){
  //   condition+="셀병합,"
  // }
  // if(setGroupFooter.value == true){
  //   condition+="합계,"
  // }
  // condition= condition.substring(0,condition.length-1)
  let codestr = "결제코드 :";
  if (selectedCode.value == null || selectedCode.value == undefined) {
    codestr += "전체";
  } else {
    codestr += selectedCode.value.strName;
  }

  documentSubTitle.value =
    selectedExcelDate.value + "\n" + selectedExcelStore.value + "\n" + codestr;
  //comsole.log(documentSubTitle.value);
  exportExcel.value = !exportExcel.value;
};

const resetVselect2 = () => {
  endTime.value = 23;
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
const tempHideStore = ref(false);
const showStore = (e) => {
  if (e.target.checked) {
    tempHideStore.value = true;
  } else {
    tempHideStore.value = false;
  }
};
const tempCellUnite = ref(false);
const cellUnite = (e) => {
  if (e.target.checked) {
    tempCellUnite.value = true;
  } else {
    tempCellUnite.value = false;
  }
};
const tempSum = ref(false);
const showSum = (e) => {
  if (e.target.checked) {
    //tempSum.value = true

    setGroupColumnId.value = "strName";
    setGroupFooter.value = true;
    reload.value = !reload.value;
  } else {
    //tempSum.value = false
    setGroupColumnId.value = "";
    setGroupFooter.value = false;
    reload.value = !reload.value;
  }
};
/**
 *  컴포넌트 변동시 감지 함수
 */

const changeInit = (e) => {
  initGrid();
};
</script>

<style></style>
