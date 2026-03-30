/*--############################################################################
# Filename : SLS06_013RPT.vue
# Description : 매출관리 > 기간별 매출 현황 > 일별 분석
# Date :2026-03-09
# Author : 권지안
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
      <div class="grid grid-cols-1 grid-rows-2">
        <Datepicker2
          @endDate="endDate"
          @startDate="startDate"
          :closePopUp="closePopUp"
          class=""
          ref="datepicker"
          @excelDate="excelDate" />
      </div>
      <div class="-ml-8">
        <PickStorePlural
          @lngStoreCodes="lngStoreCodes"
          @lngStoreGroup="lngStoreGroup"
          @lngStoreAttrs="lngStoreAttrs"
          @excelStore="excelStore" />
      </div>
    </div>
    <!-- 조회조건 -->
    <!-- 탭 -->
    <div class="flex flex-col w-full border-b border-gray-300">
      <div class="flex gap-0">
        <button
          v-for="tab in tabList"
          :key="tab"
          type="button"
          class="px-4 py-2.5 text-sm font-medium rounded-t transition-colors"
          :class="
            activeTab === tab
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          "
          @click="activeTab = tab">
          {{ tab }}
        </button>
      </div>

      <!-- 그룹 소계 체크박스 (매장별 탭 전용) -->
      <div
        v-if="activeTab === '매장별'"
        class="flex items-center gap-4 px-4 py-2 bg-gray-50 border-t border-gray-200 text-sm text-gray-800">
        <span class="font-semibold">그룹 소계</span>
        <label class="flex items-center gap-1">
          <input type="checkbox" v-model="groupByDate" @click.stop />
          <span>매출 일자별</span>
        </label>
        <label class="flex items-center gap-1">
          <input type="checkbox" v-model="groupByStore" @click.stop />
          <span>매장별</span>
        </label>
      </div>
    </div>
    <!-- 그리드 영역 -->
    <div class="w-full h-[85%]">
      <Realgrid
        :key="activeTab"
        :progname="'SLS06_013RPT_VUE'"
        :progid="
          activeTab === '종합'
            ? 1
            : activeTab === '매장별'
            ? 2
            : activeTab === '결제수단별'
            ? 3
            : activeTab === '할인별'
            ? 4
            : activeTab === '시간대별'
            ? 5
            : 6
        "
        :rowData="rowData"
        :reload="reload"
        :setFooter="true"
        :setFooterExpressions="setFooterExpressions"
        :setFooterColID="setFooterColID"
        :setGroupFooterExpressions="setFooterExpressions"
        :setGroupFooterColID="setFooterColID"
        :setGroupFooter="activeTab === '매장별' && groupColumnId !== ''"
        :setGroupColumnId="activeTab === '매장별' ? groupColumnId : ''"
        :setGroupOrderByColumnId="activeTab === '매장별' ? groupColumnId : ''"
        :documentTitle="'SLS06_013RPT'"
        :rowStateeditable="false"
        :documentSubTitle="documentSubTitle"
        :exporttoExcel="exportExcel">
      </Realgrid>
    </div>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import { getDailySalesAnalysis, dailySalesAnalysisStore } from "@/api/misales";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

import Datepicker2 from "@/components/Datepicker2.vue";
/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";

/**
 * 	다중 매장 선택 컴포넌트
 */

import PickStorePlural from "@/components/pickStorePlural.vue";

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

import { computed, onMounted, ref, watch } from "vue";
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

const setFooterColID = ref([
  "saleAmt",
  "discountAmt",
  "actAmt",
  "netSalesAmt",
  "VATAmt",
  "billCnt",
  "billAverage",
  "custCnt",
  "custAverage",
  "tableCnt",
  "tableTurnover",
  "cashAmt",
  "cardAmt",
  "ratioDiscount",
  "amtDiscount",
  "hallCnt",
  "hallAmt",
  "takeoutCnt",
  "takeoutAmt",
  "deliveryCnt",
  "deliveryAmt",
]);

const setFooterExpressions = ref([
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum"
]);

const tabList = ["종합", "매장별", "결제수단별", "할인별", "시간대별", "주문유형별"];
const activeTab = ref("종합");
const reload = ref(false);

// 탭별 데이터
const rowDataTotal = ref([]); // 종합 탭
const rowDataStore = ref([]); // 매장별 탭

// 현재 탭에 보여줄 데이터
const rowData = computed(() => {
  if (activeTab.value === "종합") {
    return rowDataTotal.value;
  }
  if (activeTab.value === "매장별") {
    return rowDataStore.value;
  }
  // 다른 탭은 아직 별도 프로시저 미사용 → 빈 데이터
  return [];
});
const afterSearch = ref(false);
const selectedstartDate = ref();
const selectedendDate = ref();

// 그룹 소계 옵션 (매출 일자별 / 매장별)
const groupByDate = ref(false);
const groupByStore = ref(false);

// 그룹핑 기준 컬럼 (체크박스 조합에 따라 dtmDate, strStoreName, 또는 둘 다)
const groupColumnId = computed(() => {
  const cols = [];
  if (groupByDate.value) {
    cols.push("dtmDate");
  }
  if (groupByStore.value) {
    cols.push("strName");
  }
  // 아무 것도 선택 안 했을 때는 기본값(빈 문자열)로 그룹 미적용
  return cols.join(",");
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
  selectedendDate.value = e;
};

// 그룹 옵션 변경 시 그리드 리로드
watch(
  () => [groupByDate.value, groupByStore.value],
  () => {
    reload.value = !reload.value;
  }
);

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

const searchButton = async () => {
  store.state.loading = true;
  try {
    initGrid();

    // 그리드 갱신
    reload.value = !reload.value;

    // 매장 선택
    const selectedStorearr = selectedStores.value;

    // 종합 / 매장별 탭 데이터를 동시에 조회
    const [resTotal, resStore] = await Promise.all([
      getDailySalesAnalysis(
        selectedGroup.value,
        selectedStorearr,
        selectedstartDate.value,
        selectedendDate.value
      ),
      dailySalesAnalysisStore(
        selectedGroup.value,
        selectedStorearr,
        selectedstartDate.value,
        selectedendDate.value
      ),
    ]);

    rowDataTotal.value = resTotal.data.dailySalesAnalysis || [];
    // 매장별 프로시저 결과 키는 dailySalesAnalysisStore 또는 dailySalesAnalysis 중 하나일 수 있음
    rowDataStore.value =
      resStore.data.dailySalesAnalysisStore ||
      resStore.data.dailySalesAnalysis ||
      [];

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
  initGrid();
  selectedGroup.value = e;
};
/**
 * 페이지 매장 코드 세팅
 */

const lngStoreCodes = (e) => {
  initGrid();
  selectedStores.value = e;
};

/**
 * 페이지 매장 분류 세팅
 */

const lngStoreAttrs = (e) => {
  initGrid();
  selectedStoreAttrs.value = e;
};

/**
 * 그리드 초기화
 */

const initGrid = () => {
  if (rowDataTotal.value.length > 0) {
    rowDataTotal.value = [];
  }
  if (rowDataStore.value.length > 0) {
    rowDataStore.value = [];
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
};
const selectedExcelStore = ref("");

/**
 * 엑셀용 매장 세팅 함수
 */

const excelStore = (e) => {
  selectedExcelStore.value = e;
};
</script>

<style></style>