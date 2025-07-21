<!-- /*--############################################################################
# Filename : SLS11_024RPT.vue                                                  
# Description : 매출관리 > 분류별 매출 현황 > 주문구분 현황.           
# Date :2025-07-21                                                            
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
      class="grid grid-cols-3 grid-rows-1 justify-between bg-gray-200 rounded-lg h-14 items-start z-10">
      <div class="">
        <Datepicker2
          @endDate="endDate"
          @startDate="startDate"
          :closePopUp="closePopUp"
          ref="datepicker"
          class=""
          :mainName="'기간'"
          @excelDate="excelDate"
          :initToday="1"
          :initToday3="true"></Datepicker2>
      </div>
      <div class="">
        <PickStoreRenew
          @lngStoreCode="lngStoreCodes"
          @lngStoreGroup="lngStoreGroup"
          @excelStore="excelStore"
          @changeInit="changeInit"
          @lngSupervisor="lngSupervisor"
          @lngStoreTeam="lngStoreTeam"
          @lngStoreAttrs="lngStoreAttrs">
        </PickStoreRenew>
      </div>
      <div class="flex items-center justify-center mt-2">
        <div class="font-semibold text-base flex items-center justify-center">
          주문구분
        </div>
        <div class="flex items-center justify-center ml-2">
          <select
            name=""
            id=""
            class="h-10 w-48 border border-black"
            v-model="cond">
            <option value="0">전체</option>
            <option value="1">POS</option>
            <option value="2">TABLET ORDER</option>
          </select>
        </div>
      </div>
    </div>
    <!-- 조회 조건 -->
    <!--그리드 영역 -->
    <div class="w-full h-[80vh] grid-rows-2 grid-cols-1">
      <div class="h-[20%]">
        <Realgrid
          :progname="'SLS11_024RPT_VUE'"
          :progid="2"
          :rowData="rowData2"
          :reload="reload"
          :setFooter="true"
          :setMergeMode="false"
          :setGroupCustomLevel="2"
          :setGroupFooter="setGroupFooter"
          :setGroupSumCustomColumnId2="['strStoreName']"
          :hideColumnsId="hideColumnsId"
          :setGroupColumnId="setGroupColumnId"
          :documentTitle="'SLS12_011RPT'"
          :documentSubTitle="documentSubTitle"
          :exporttoExcel="exportExcel"
          :rowStateeditable="false"
          :setGroupOrderByColumnId="'dtmDate'">
        </Realgrid>
      </div>
      <div class="h-[70%]">
        <Realgrid
          :progname="'SLS11_024RPT_VUE'"
          :progid="1"
          :rowData="rowData"
          :reload="reload"
          :setMergeMode="false"
          :setGroupCustomLevel="2"
          :setGroupFooter="setGroupFooter"
          :setGroupSumCustomColumnId2="['strStoreName']"
          :hideColumnsId="hideColumnsId"
          :setGroupColumnId="setGroupColumnId"
          :documentTitle="'SLS12_011RPT'"
          :documentSubTitle="documentSubTitle"
          :exporttoExcel="exportExcel"
          :rowStateeditable="false"
          :setGroupOrderByColumnId="'dtmDate'">
        </Realgrid>
      </div>
    </div>
  </div>
  <!--그리드 영역 -->
</template>

<script setup>
import { getReportybyCashReceipt } from "@/api/misales";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

import Datepicker2 from "@/components/Datepicker2.vue";
/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
import PickStoreRenew from "@/components/pickStoreRenew.vue";
/**
 *  매장  단일 선택 컴포넌트
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

import { onMounted, ref, watch } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";

const progid = ref(1);
const setRowGroupSpan = ref("strStoreName,dtmDate");
const reload = ref(false);
const rowData = ref([]);
const rowData2 = ref([]);
const afterSearch = ref(false);
const selectedstartDate = ref();
const selectedendDate = ref();
const cond = ref(0);
const setGroupColumnId = ref("");
const hideColumnsId = ref(["strStoreName", "dtmDate"]);
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

const setGroupFooter = ref(true);

const store = useStore();
const limitEndDate = ref();

/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  //console.log(formattedDate.value);
});

/**
 *  조회 함수
 */

const searchButton = async () => {
  store.state.loading = true;
  try {
    initGrid();

    let reportType = "";
    if (selectedCond.value.includes(0)) {
      reportType += "1";
    }
    if (selectedCond.value.includes(1)) {
      reportType += "2";
    }

    if (!selectedCond.value.includes(0) && !selectedCond.value.includes(1)) {
      reportType = "0";
    }
    reload.value = !reload.value;

    const res = await getReportybyCashReceipt(
      selectedGroup.value,
      selectedStoreAttrs.value,
      selectedStoreTeam.value,
      selectedStoreSupervisor.value,
      selectedStores.value,
      selectedstartDate.value,
      selectedendDate.value,
      reportType,
      selectedCond2.value
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
const selectedStoreSupervisor = ref();
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
 * 페이지 매장 팀 세팅
 */

const lngStoreTeam = (e) => {
  selectedStoreTeam.value = e;
  //comsole.log(e);
};
/**
 * 페이지 매장 슈퍼바이저 세팅
 */

const lngSupervisor = (e) => {
  selectedStoreSupervisor.value = e;
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
  let condition = "조건 :";
  if (selectedCond.value.includes(0)) {
    condition += "일자별,";
  }
  if (selectedCond.value.includes(1)) {
    condition += "매장별,";
  }
  if (selectedCond.value.includes(2)) {
    condition += "합계,";
  }

  if (selectedCond2.value.includes("01")) {
    condition += "영업일,";
  } else {
    condition += "승인일,";
  }
  condition = condition.substring(0, condition.length - 1);

  documentSubTitle.value =
    selectedExcelDate.value +
    "\n" +
    selectedExcelStore.value +
    "\n" +
    condition;

  exportExcel.value = !exportExcel.value;
};

const datepicker = ref(null);
const closePopUp = ref(false);
/**
 * 매출 일자 안 라디오박스 닫기 위한 외부 클릭 감지 함수
 */

const handleParentClick = (e) => {
  if (e.target && e.target.type === "checkbox") {
    return;
  }
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
const selectedCond = ref([]);
const selectedCond2 = ref("01");
const selectedCond3 = ref([2]);
const formattedDate = ref("");
watch(selectedCond2, () => {
  if (selectedCond2.value.includes("01")) {
    limitEndDate.value = "9999-12-31";
  } else {
    limitEndDate.value = formattedDate.value;
    //limitEndDate.value = limitEndDate.value.toISOString().split("T")[0]
  }
  //comsole.log(formattedDate.value);
});
const tempGroupColumnIds = new Set();
watch(selectedCond, () => {
  if (selectedCond.value.includes(0)) {
    hideColumnsId.value = hideColumnsId.value.filter(
      (item) => item != "dtmDate"
    );
  } else if (!selectedCond.value.includes(0)) {
    hideColumnsId.value.push("dtmDate");
  }

  if (selectedCond.value.includes(1)) {
    hideColumnsId.value = hideColumnsId.value.filter(
      (item) => item != "strStoreName"
    );
    tempGroupColumnIds.add("strStoreName");
  } else if (!selectedCond.value.includes(1)) {
    hideColumnsId.value.push("strStoreName");
    tempGroupColumnIds.delete("strStoreName");
  }

  setGroupColumnId.value = [...tempGroupColumnIds]
    .sort((a, b) => b - a)
    .join(",");
  //comsole.log(setGroupColumnId.value);
});

watch(selectedCond3, () => {
  //comsole.log(selectedCond3.value);
  if (selectedCond3.value.includes(2)) {
    setGroupFooter.value = true;
  } else {
    setGroupFooter.value = false;
  }
  //comsole.log(selectedCond3.value);
  reload.value = !reload.value;
});
</script>

<style></style>
