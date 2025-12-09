<!-- /*--############################################################################
# Filename : SLS11_023RPT.vue                                                  
# Description : 매출관리 > 분류별 매출 현황 > 고객할인현황             #
Date :2025-12-05                                                              #
Author : 권맑음                     
################################################################################*/ -->
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
      class="grid grid-cols-2 grid-rows-2 justify-between bg-gray-200 rounded-lg h-24 items-start z-10">
      <div class="">
        <Datepicker2
          @startDate="startDate"
          @endDate="endDate"
          :closePopUp="closePopUp"
          ref="datepicker"
          :mainName="'기간'"
          :initToday="1"
          :initToday3="true"
          :selectedGroup="selectedGroup"
          @excelDate="excelDate" />
      </div>
      <div class="h-[75%]">
        <PickStoreSingle
          @lngStoreCode="lngStoreCode"
          @lngStoreGroup="lngStoreGroup"
          :placeholderName="'선택'"
          @excelStore="excelStore"></PickStoreSingle>
      </div>
      <div class="flex ml-12 mt-2 space-x-5">
        <div class="text-base font-semibold">집계기준</div>
        <div>
          <label for="cond"
            ><input
              type="checkbox"
              id="cond"
              :value="cond"
              @click="cond = !cond"
              checked />매장</label
          >
        </div>
        <div>
          <label for="cond2"
            ><input
              type="checkbox"
              id="cond2"
              :value="cond2"
              @click="cond2 = !cond2"
              checked />일자</label
          >
        </div>
        <div>
          <label for="cond3"
            ><input
              type="checkbox"
              id="cond3"
              :value="cond3"
              @click="cond3 = !cond3"
              checked />등급</label
          >
        </div>
      </div>
    </div>
    <div class="w-full h-[82%]">
      <Realgrid
        :progname="'CRM03_019RPT_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :documentTitle="'CRM03_019RPT'"
        :rowStateeditable="false"
        :setFooter="true"
        :hideColumnsId="hideColumnsId"
        :documentSubTitle="documentSubTitle"
        :exporttoExcel="exportExcel">
      </Realgrid>
    </div>
  </div>
</template>

<script setup>
/**
 *  매출 일자 세팅 컴포넌트
 *  */

import { getCustCardDisAggList, getCustSaleList } from "@/api/misales";
import Datepicker2 from "@/components/Datepicker2.vue";
/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
/**
 * 	매장 단일 선택 컴포넌트
 */
import PickStoreSingle from "@/components/pickStoreSingle.vue";
/**
 * 	그리드 생성
 */

import Realgrid from "@/components/realgrid.vue";
/**
 *  페이지로그 자동 입력
 *  */

import { insertPageLog } from "@/customFunc/customFunc";
import Swal from "sweetalert2";
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
const setFooterColID = ref(["strStoreName"]);
const setFooterExpressions = ref(["custom"]);

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);
const selectedstartDate = ref();
const selectedendDate = ref();
const selectedStartTime = ref({ value: 0, strName: "00:00" });
const selectedEndTime = ref({ value: 23, strName: "23:00" });
const cond = ref(true);
const cond2 = ref(true);
const cond3 = ref(true);

watch(cond3, () => {
  console.log(cond.value);
  console.log(cond2.value);
  console.log(cond3.value);
});
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
  //comsole.log(e);
  selectedendDate.value = e;
};

const tempSeeDaily = ref(false);
const tempSeeStore = ref(false);

const store = useStore();
const loginedstrLang = store.state.userData.lngLanguage;

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
const hideColumnsId = ref([]);
const searchButton = async () => {
  if (selectedStores.value == "0") {
    Swal.fire({
      title: "경고",
      text: "매장을 먼저 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  try {
    store.state.loading = true;
    initGrid();
    if (cond.value == false && !hideColumnsId.value.includes("strStoreName")) {
      hideColumnsId.value.push("strStoreName");
    } else if (
      cond.value == true &&
      hideColumnsId.value.includes("strStoreName")
    ) {
      hideColumnsId.value = hideColumnsId.value.filter(
        (item) => item != "strStoreName"
      );
    }
    if (cond2.value == false && !hideColumnsId.value.includes("dtmDate")) {
      hideColumnsId.value.push("dtmDate");
    } else if (cond2.value == true && hideColumnsId.value.includes("dtmDate")) {
      hideColumnsId.value = hideColumnsId.value.filter(
        (item) => item != "dtmDate"
      );
    }
    if (cond3.value == false && !hideColumnsId.value.includes("strLevelName")) {
      hideColumnsId.value.push("strLevelName");
    } else if (
      cond3.value == true &&
      hideColumnsId.value.includes("strLevelName")
    ) {
      hideColumnsId.value = hideColumnsId.value.filter(
        (item) => item != "strLevelName"
      );
    }
    //console.log(hideColumnsId.value);

    reload.value = !reload.value;
    const res = await getCustCardDisAggList(
      selectedGroup.value,
      selectedStores.value,
      selectedstartDate.value.replaceAll("-", ""),
      selectedendDate.value.replaceAll("-", ""),
      (cond.value == true ? 1 : 0) +
        (cond2.value == true ? 2 : 0) +
        (cond3.value == true ? 4 : 0)
    );
    //console.log(res);
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
const selectedGroup = ref();
const selectedStores = ref();
const selectedStoreAttrs = ref();
/**
 * 페이지 매장 그룹 세팅
 */

const lngStoreGroup = (e) => {
  //initGrid();
  //comsole.log(e);
  selectedGroup.value = e;
};
/**
 * 페이지 매장 코드 세팅
 */

const lngStoreCode = (e) => {
  initGrid();
  selectedStores.value = e;
  //comsole.log(e);
};

/**
 * 페이지 매장 분류 세팅
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
  documentSubTitle.value =
    selectedExcelDate.value + "\n" + selectedExcelStore.value;

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
</script>
