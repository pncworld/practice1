<!-- /*--############################################################################
# Filename : CRM40_057RPT.vue                                                  
# Description : 고객관리 > 프로모션 관리 > 카카오 알림톡 발신 집계현황                     
# Date :2025-06-25                                                             
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
      class="grid grid-cols-2 grid-rows-1 bg-gray-200 rounded-lg h-20 items-start z-10">
      <div class="justify-start flex items-center ml-1">
        <input
          type="checkbox"
          v-model="cond"
          class="z-[60]"
          @change="changeCond" />
        <Datepicker2
          :mainName="'기간'"
          @endDate="endDate"
          class="-ml-4"
          ref="datepicker"
          :initToday="1"
          :closePopUp="closePopUp"
          @excelDate="excelDate"
          @startDate="startDate">
        </Datepicker2>
      </div>
      <div class="justify-start flex">
        <input
          type="checkbox"
          v-model="cond2"
          class="mr-5"
          @change="changeCond2" />
        <PickStoreSingle
          @lngStoreGroup="lngStoreGroup"
          @lngStoreAttrs="lngStoreAttrs"
          @lngStoreCode="lngStoreCode"
          @lngSupervisor="lngSupervisor"
          @lngStoreTeam="lngTeamCode"
          @excelStore="excelStore"></PickStoreSingle>
      </div>
    </div>
    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="w-full h-[70vh]">
      <div class="w-full h-[90%]">
        <Realgrid
          :progname="'CRM40_057RPT_VUE'"
          :progid="1"
          :rowData="rowData"
          :reload="reload"
          :hideColumnsId="hideColumnsId"
          :documentTitle="'CRM40_057RPT'"
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
  getKakaoAlarmAgg,
  getKakaoAlarmDetail,
  getReceiptEventList,
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
const cond = ref(true);
const cond2 = ref(true);
const cond3 = ref("");
const cond4 = ref(1);
const cond5 = ref(0);
const datepicker = ref(null);
const closePopUp = ref(false);

const changeCond = (e) => {
  cond.value = !cond.value;
};
const changeCond2 = (e) => {
  cond2.value = !cond2.value;
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

const sDate = ref();
const eDate = ref();
const startDate = (e) => {
  sDate.value = e;
  initGrid();
};
const endDate = (e) => {
  eDate.value = e;
  initGrid();
};

const selectedDate = ref();
const excelDate = (e) => {
  selectedDate.value = e;
};

const teamcode = ref();
const lngTeamCode = (e) => {
  teamcode.value = e;
  initGrid();
};
const supervisor = ref();
const lngSupervisor = (e) => {
  supervisor.value = e;
  initGrid();
};
const storeCode = ref();
const lngStoreCode = (e) => {
  storeCode.value = e;
  initGrid();
};

const storeAttr = ref();
const lngStoreAttrs = (e) => {
  storeAttr.value = e;
  initGrid();
};

const groupCd = ref();
const lngStoreGroup = (e) => {
  groupCd.value = e;
  initGrid();
};
/**
 *  조회 함수
 */
watch([cond, cond2], () => {
  if (cond.value == true) {
    hideColumnsId.value = hideColumnsId.value.filter(
      (item) => item !== "dtmDate"
    );
  } else {
    hideColumnsId.value = hideColumnsId.value.filter(
      (item) => item !== "dtmDate"
    );
    hideColumnsId.value.push("dtmDate");
  }

  if (cond2.value == true) {
    hideColumnsId.value = hideColumnsId.value.filter(
      (item) => item !== "strStoreName"
    );
  } else {
    hideColumnsId.value = hideColumnsId.value.filter(
      (item) => item !== "strStoreName"
    );
    hideColumnsId.value.push("strStoreName");
  }
  //console.log(hideColumnsId.value);
});
const hideColumnsId = ref([]);
const searchButton = async () => {
  try {
    store.state.loading = true;
    initGrid();
    let condition = 3;
    if (cond.value == false) {
      condition = 2;
    }
    const res = await getKakaoAlarmAgg(
      groupCd.value,
      storeCode.value,
      storeAttr.value,
      supervisor.value,
      teamcode.value,

      sDate.value,
      eDate.value,
      condition
    );

    rowData.value = res.data.List;
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
const excelList = (e) => {
  selectedExcelList.value = e;
  //comsole.log(e);
};
</script>
