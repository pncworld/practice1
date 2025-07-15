<!-- /*--############################################################################
# Filename : CRM65_002RPT.vue                                                  
# Description : 고객관리 > 전자상품권 현황 > 전자상품권 거래 내역      
# Date :2025-06-19                                                            
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
      class="grid grid-cols-[1fr,1fr] grid-rows-3 bg-gray-200 rounded-lg h-36 items-start z-10 justify-start">
      <div class="justify-start">
        <Datepicker2
          :mainName="'일자'"
          @startDate="startDate"
          @excelDate="excelDate"
          @endDate="endDate"></Datepicker2>
      </div>
      <div class="-ml-16">
        <PickStorePlural
          @lngStoreGroup="lngStoreGroup"
          @lngStoreCodes="lngStoreCodes"></PickStorePlural>
      </div>
      <div class="justify-start flex items-center ml-12 mt-2">
        <span class="text-base font-semibold">구분</span>
        <select name="" id="" class="ml-5 w-40 h-8" v-model="cond">
          <option value="0">전체</option>
          <option :value="i.lngGftCategory" v-for="i in optionList">
            {{ i.strGftCategory }}
          </option>
        </select>

        <span class="text-base font-semibold ml-10"> 권종 </span>
        <select name="" id="" class="w-40 ml-5 h-8" v-model="cond3">
          <option value="0">전체</option>
          <option :value="i.lngGftType" v-for="i in optionList2">
            {{ i.strGftType }}
          </option>
        </select>
      </div>
      <div></div>

      <div
        class="text-base flex justify-start font-semibold pl-12 w-[150%] space-x-5 mt-2">
        <span class="text-base font-semibold"> 조회조건 </span>
        <label for="cond4"
          ><input type="checkbox" id="cond4" v-model="cond4" />전체</label
        >
        <label for="cond5"
          ><input type="checkbox" id="cond5" v-model="cond5" />생성</label
        >
        <label for="cond6"
          ><input type="checkbox" id="cond6" v-model="cond6" />출고</label
        >
        <label for="cond7"
          ><input type="checkbox" id="cond7" v-model="cond7" />판매</label
        >
        <label for="cond8"
          ><input type="checkbox" id="cond8" v-model="cond8" />충전</label
        >
        <label for="cond9"
          ><input type="checkbox" id="cond9" v-model="cond9" />사용</label
        >
        <label for="cond10"
          ><input type="checkbox" id="cond10" v-model="cond10" />회수</label
        >
        <label for="cond11"
          ><input type="checkbox" id="cond11" v-model="cond11" />교환폐기</label
        >
        <label for="cond12"
          ><input type="checkbox" id="cond12" v-model="cond12" />교환판매</label
        >
        <label for="cond13"
          ><input type="checkbox" id="cond13" v-model="cond13" />교환충전</label
        >
        <label for="cond14"
          ><input type="checkbox" id="cond14" v-model="cond14" />취소</label
        >
        <label for="cond15"
          ><input type="checkbox" id="cond15" v-model="cond15" />분실</label
        >
        <label for="cond16"
          ><input type="checkbox" id="cond16" v-model="cond16" />증정</label
        >
      </div>
    </div>
    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="w-full h-[75%]">
      <Realgrid
        :progname="'CRM65_002RPT_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :documentTitle="'CRM65_002RPT'"
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
import { getGftLedgerTradeList, getInitGftData } from "@/api/micrm";
import Datepicker2 from "@/components/Datepicker2.vue";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
import PickStorePlural from "@/components/pickStorePlural.vue";
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

  const res = await getCommonList(254);

  optionList3.value = res.data.List;
  const res2 = await getInitGftData(store.state.userData.lngStoreGroup);

  optionList.value = res2.data.List;
  optionList2.value = res2.data.List2;
});

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);
const selectedCond = ref(0);
const condValue = ref(0);
const cond = ref(0);
const cond2 = ref(false);
const cond3 = ref(0);
const cond4 = ref(true);
const cond5 = ref(true);
const cond6 = ref(true);
const cond7 = ref(true);
const cond8 = ref(true);
const cond9 = ref(true);
const cond10 = ref(true);
const cond11 = ref(true);
const cond12 = ref(true);
const cond13 = ref(true);
const cond14 = ref(true);
const cond15 = ref(true);
const cond16 = ref(true);
const store = useStore();
const optionList = ref([]);
const optionList2 = ref([]);
const optionList3 = ref([]);
const datepicker = ref(null);
const closePopUp = ref(false);
const custId = ref("");

watch(cond4, () => {
  if (cond4.value == true) {
    cond5.value = true;
    cond6.value = true;
    cond7.value = true;
    cond8.value = true;
    cond9.value = true;
    cond10.value = true;
    cond11.value = true;
    cond12.value = true;
    cond13.value = true;
    cond14.value = true;
    cond15.value = true;
    cond16.value = true;
  }
});
const strSaleCustID = (e) => {
  initGrid();
  custId.value = e;
};
const custNm = ref("");
const strSaleCustName = (e) => {
  custNm.value = e;
};
const sd = ref("");
const groupCd = ref("");
const ed = ref("");
const storeCds = ref("");
const selectedDate = ref("");
const startDate = (e) => {
  sd.value = e;
};
const endDate = (e) => {
  ed.value = e;
};
const lngStoreGroup = (e) => {
  groupCd.value = e;
};
const lngStoreCodes = (e) => {
  storeCds.value = e;
};

const excelDate = (e) => {
  selectedDate.value = e;
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

/**
 *  조회 함수
 */

const searchButton = async () => {
  if (sd.value == null || ed.value == null) {
    Swal.fire({
      title: "경고",
      text: "일자을 선택하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  try {
    store.state.loading = true;
    initGrid();
    let strcond = cond4.value ? "1," : "";
    strcond += cond5.value ? "2," : "";
    strcond += cond6.value ? "3," : "";
    strcond += cond7.value ? "4," : "";
    strcond += cond8.value ? "5," : "";
    strcond += cond9.value ? "6," : "";
    strcond += cond10.value ? "7," : "";
    strcond += cond11.value ? "8," : "";
    strcond += cond12.value ? "9," : "";
    strcond += cond13.value ? "10," : "";
    strcond += cond14.value ? "11," : "";
    strcond += cond15.value ? "12," : "";
    strcond += cond16.value ? "13," : "";
    strcond = strcond.slice(0, strcond.length - 1);
    const res = await getGftLedgerTradeList(
      groupCd.value,
      storeCds.value,
      cond.value,
      cond3.value,
      sd.value,
      ed.value,
      strcond,
      store.state.userData.strLanguage
    );
    console.log(res);
    rowData.value = res.data.List;

    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    console.log(error);
  } finally {
    store.state.loading = false;
  }
};

/* 매장 컴포넌트 관련 함수 */
const selectedGroup = ref();
const selectedStores = ref();
const selectedStoreAttrs = ref();

/**
 * 페이지 매장 코드 세팅
 */

const lngStoreCode = async (e) => {
  initGrid();
  selectedStores.value = e;
  console.log(e);
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
  documentSubTitle.value = selectedDate.value;

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
