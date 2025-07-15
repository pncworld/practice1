/*--############################################################################
# Filename : CRM03_011RPT.vue                                                  
# Description : 고객관리 > 고객 실적 관리 > 고객 구매 상세 현황                 
# Date :2025-06-12                                                             
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
      class="grid grid-cols-2 grid-rows-2 bg-gray-200 rounded-lg h-28 items-start z-10 -space-x-20">
      <div class="justify-start flex -space-x-10">
        <Datepicker2
          :mainName="'기간'"
          :initToday="1"
          @endDate="endDate"
          ref="datepicker"
          :closePopUp="closePopUp"
          @excelDate="excelDate"
          @startDate="startDate">
        </Datepicker2>
      </div>

      <div class="justify-start flex">
        <PickStoreSingle
          @lngStoreGroup="lngStoreGroup"
          @lngStoreAttrs="lngStoreAttrs"
          @lngStoreCode="lngStoreCode"
          @lngSupervisor="lngSupervisor"
          @lngStoreTeam="lngTeamCode"
          @excelStore="excelStore"></PickStoreSingle>
      </div>

      <div class="flex justify-start pl-32 space-x-5 items-center">
        <div class="text-base font-semibold">등급</div>
        <div>
          <select name="" id="" class="w-48 h-8" v-model="cond">
            <option value="0">전체</option>
            <option :value="i.intLevel" v-for="i in optionList">
              {{ i.strLevelName }}
            </option>
          </select>
        </div>
      </div>
      <div class="flex justify-start space-x-5 items-center mt-5">
        <div class="text-base font-semibold">거래 구분</div>
        <div>
          <select name="" id="" class="w-48 h-8" v-model="cond2">
            <option value="0">전체</option>
            <option value="2">사용</option>
            <option value="3">적립</option>
            <option value="4">보너스</option>
          </select>
        </div>
      </div>
    </div>
    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="w-full h-[75vh]">
      <div class="w-full h-[80%]">
        <Realgrid
          :progname="'CRM03_011RPT_VUE'"
          :progid="1"
          :rowData="rowData"
          :reload="reload"
          :setFooterCustomColumnId="['strName']"
          :setFooterCustomText="['합계']"
          :setFooter="true"
          :setGroupFooter="true"
          :setGroupColumnId="'strName'"
          :hideColumnsId="hideColumnsId"
          :documentTitle="'CRM03_011RPT'"
          @clickedRowData="clickedRowData"
          :documentSubTitle="documentSubTitle"
          :rowStateeditable="false"
          :exporttoExcel="exportExcel">
        </Realgrid>
      </div>
    </div>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import {
  getCustBuyAggList,
  getCustBuyDetailList,
  getCustBuyList,
  getCustPointInfo,
  getCustRecord,
  getInitDataCustPurchase,
  getReceiptDataDetail2,
} from "@/api/micrm";
import Datepicker2 from "@/components/Datepicker2.vue";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
import PickStoreSingle from "@/components/pickStoreSingle.vue";
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

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
});

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

const rowData2 = ref([]);
const rowData3 = ref([]);
const rowData4 = ref([]);
const condValue = ref(0);
const store = useStore();
const cond = ref(0);
const cond2 = ref(0);
const cond3 = ref(0);
const optionList = ref([]);
const datepicker = ref(null);
const closePopUp = ref(false);

watch(cond, () => {
  if (cond.value == true) {
    if (cond2.value == true) {
      hideColumnsId.value = [];
      setGroupFooter.value = true;
    } else {
      hideColumnsId.value = ["strName"];
      setGroupFooter.value = false;
    }
  } else {
    if (cond2.value == true) {
      hideColumnsId.value = ["dtmDate"];
      setGroupFooter.value = false;
    } else {
      hideColumnsId.value = ["strName", "dtmDate"];
      setGroupFooter.value = false;
    }
  }
});
watch(cond2, () => {
  if (cond.value == true) {
    if (cond2.value == true) {
      hideColumnsId.value = [];
      setGroupFooter.value = true;
    } else {
      hideColumnsId.value = ["strName"];
      setGroupFooter.value = false;
    }
  } else {
    if (cond2.value == true) {
      hideColumnsId.value = ["dtmDate"];
      setGroupFooter.value = false;
    } else {
      hideColumnsId.value = ["strName", "dtmDate"];
      setGroupFooter.value = false;
    }
  }
});

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
  sDate.value = e;
};
const endDate = (e) => {
  eDate.value = e;
};

const selectedDate = ref();
const excelDate = (e) => {
  selectedDate.value = e;
};

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
/**
 *  조회 함수
 */

const setGroupFooter = ref(false);
const hideColumnsId = ref([]);
const searchButton = async () => {
  try {
    store.state.loading = true;
    initGrid();

    const res = await getCustBuyDetailList(
      groupCd.value,
      storeCode.value,
      storeAttr.value,
      supervisor.value,
      teamcode.value,
      sDate.value,
      eDate.value,
      cond.value,
      cond2.value
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
  documentSubTitle.value = selectedDate.value + "\n" + selectedExcelStore.value;

  //documentSubTitle.value += "\n";
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
</script>
