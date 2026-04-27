<!-- /*--############################################################################
# Filename : PUR01_026RPT.vue                                                  
# Description : 구매관리2 > 매입 관리 > 발주 미확정 현황.                      
# Date :2025-09-29                                                             
# Author : 권지안                    
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
        <button @click="excelButton" class="button w-auto excel">엑셀</button>
      </div>
    </div>
    <!-- 조회: 2행×7열, 좌우(px-24) 안에서 100% 폭 — 5열(매장)만 1fr로 넓힘 -->
    <div
      class="z-10 mt-3 w-full min-w-0 overflow-x-auto rounded-lg bg-gray-200 px-24 py-4">
      <div
        class="pur01-search-grid min-w-0"
        :style="{ '--pur01-control-border': pur01ControlBorder }">
        <!-- 1행 (7칸) -->
        <div class="pur01-sg-label">납기일자</div>
        <div class="pur01-date-slot min-w-0 overflow-x-auto [scrollbar-width:thin]">
          <Datepicker2
            ref="datepicker"
            omit-main-label
            filter-bar-align
            :mainName="'납기일자'"
            :initToday="0"
            :closePopUp="closePopUp"
            @excelDate="excelDate"
            @endDate="endDate"
            @startDate="startDate"
            @dateValue="dateValue">
          </Datepicker2>
        </div>
        <div class="pur01-sg-gap" aria-hidden="true"></div>
        <div class="pur01-sg-label">매장명</div>
        <div class="pur01-pick-slot min-w-0 w-full">
          <PickStore
            compact-search-bar
            :compact-store-combo-max-rem="24"
            main-name=""
            @update:storeGroup="lngStoreGroup"
            :defaultStoreNm="'전체'"
            @storeNm="excelStore"
            :defaultStoreType2="true"
            :defaultStore="true"
            @update:storeCd="lngStoreCode"></PickStore>
        </div>
        <div class="pur01-sg-row1-tail" aria-hidden="true"></div>

        <!-- 2행 (7칸) -->
        <div class="pur01-sg-label">거래처</div>
        <div class="pur01-bc-slot min-w-0 w-full max-w-full">
          <BusinessClient
            compact-search-bar
            @SupplierId="SupplierId"
            @SupplierNm="SupplierNm" />
        </div>
        <div class="pur01-sg-gap" aria-hidden="true"></div>
        <div class="pur01-sg-label">단위</div>
        <select
          id="pur01-026-cond-unit"
          class="pur01-sg-select h-8 w-48 rounded-md border border-solid bg-white text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          v-model="cond">
          <option :value="i.strDCode" v-for="i in optionList" :key="i.strDCode">
            {{ i.strDName }}
          </option>
        </select>
        <div class="pur01-sg-label">확정구분</div>
        <select
          id="pur01-026-cond-confirm"
          class="pur01-sg-select h-8 w-48 rounded-md border border-solid bg-white text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          v-model="cond2">
          <option :value="i.strDCode" v-for="i in optionList2" :key="i.strDCode">
            {{ i.strDName }}
          </option>
        </select>
      </div>
    </div>

    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="w-full h-[65vh]">
      <Realgrid
        :progname="'PUR01_026RPT_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :setStateBar="false"
        :rowStateeditable="false"
        :setFooter="false"
        :documentTitle="'PUR01_026RPT'"
        :selectionStyle="'block'"
        :exporttoExcel="exportExcel"
        :documentSubTitle="documentSubTitle"
      />
    </div>
  </div>

  <!-- 그리드 영역 -->
</template>

<script setup>
import { getCommonList } from "@/api/common";
import { getOrderUnconfirmedStatus } from "@/api/mipur";
import BusinessClient from "@/components/businessClient2.vue";
import Datepicker2 from "@/components/Datepicker2.vue";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
import PickStore from "@/components/pickStore.vue";
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

import { onMounted, ref } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";
/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getCommonList(27);

  optionList.value = res.data.List.filter((item) => item.strDCode != "01");

  const res2 = await getCommonList(24);

  optionList2.value = res2.data.List;
});

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

const cond = ref("02");
const cond2 = ref("01");

const cond5 = ref(0);
const store = useStore();

/** 조회줄 컨트롤 공통 테두리(많이 쓰는 연한 회색) — hex/rgb 바꿔서 통일 색 조정 */
const pur01ControlBorder = "#cbd5e1";

const datepicker = ref(null);
const closePopUp = ref(false);
const optionList = ref([]);
const optionList2 = ref([]);
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

const sDate = ref("");
const eDate = ref("");

const selectedDate = ref();
const excelDate = (e) => {
  selectedDate.value = e;
};

const storeCode = ref();
const lngStoreCode = (e) => {
  initGrid();
  storeCode.value = e;
};

const groupCd = ref();
const lngStoreGroup = (e) => {
  groupCd.value = e;
};

const supplierid = ref("");
const SupplierId = (e) => {
  supplierid.value = e;
};
/**
 *  조회 함수
 */
const hideColumnsId = ref([]);
const searchButton = async () => {
  try {
    store.state.loading = true;
    initGrid();

    const s = String(sDate.value ?? "").replaceAll("-", "");
    const e = String(eDate.value ?? "").replaceAll("-", "");
    const res = await getOrderUnconfirmedStatus(
      groupCd.value,
      storeCode.value,
      s,
      e,
      supplierid.value,
      cond.value,
      cond2.value,
      0
    );

    rowData.value = res.data.List;
    // console.log(res);
    
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

const disabled1 = ref(false);
const progid = ref(1);
const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }

  reload.value = !reload.value;
};

//엑셀 버튼 처리 함수
const exportExcel = ref(false);
/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  documentSubTitle.value =
    selectedDate.value + "\n" + "매장명 :" + selectedExcelStore.value;
  exportExcel.value = !exportExcel.value;
};

const documentSubTitle2 = ref("");

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

const startDate = (e) => {
  sDate.value = e;
};
const endDate = (e) => {
  eDate.value = e;
};
</script>

<style scoped>
/* 엑셀형 2×7: 라벨 열(1·4·6)은 가장 긴 항목명 기준 동일 폭 + 가운데 정렬(search-area-layout 규칙) */
.pur01-search-grid {
  --pur01-label-col: 5.5rem; /* 납기일자·확정구분 등 최장 항목명 기준 통일 */
  display: grid;
  width: 100%;
  align-items: center;
  column-gap: 0.75rem;
  row-gap: 0.5rem;
  grid-template-columns:
    var(--pur01-label-col)
    minmax(12rem, max-content)
    0.75rem
    var(--pur01-label-col)
    minmax(22rem, 1fr)
    var(--pur01-label-col)
    minmax(12rem, max-content);
}

/* flex로 칸 전체 기준 가운데(우측으로 몰리는 현상 방지) */
.pur01-sg-label {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-width: 0;
  justify-self: stretch;
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
}

.pur01-sg-gap {
  width: 0.75rem;
  min-width: 0.75rem;
}

.pur01-sg-row1-tail {
  grid-column: 6 / span 2;
  min-width: 0;
}

.pur01-sg-select {
  justify-self: start;
}

/*
 * Tailwind border-gray-800 / vue-select 기본(매우 옅은 --vs-border-color) 때문에
 * 넓은 v-select만 테두리가 안 보이는 경우 → 이 그리드 안에서는 1px 실선으로 통일
 */
.pur01-search-grid select.pur01-sg-select {
  border: 1px solid var(--pur01-control-border) !important;
}

.pur01-search-grid select.pur01-sg-select:focus {
  border-color: #3b82f6 !important;
}

.pur01-search-grid .pur01-pick-slot :deep(select) {
  border: 1px solid var(--pur01-control-border) !important;
}

.pur01-search-grid .pur01-pick-slot :deep(select:focus) {
  border-color: #3b82f6 !important;
}

.pur01-search-grid .pur01-pick-slot :deep(.pickstore-vs-shell),
.pur01-search-grid .pur01-bc-slot :deep(.pickstore-vs-shell) {
  border: 1px solid var(--pur01-control-border) !important;
}

.pur01-search-grid .pur01-date-slot :deep(input[type="date"]) {
  border: 1px solid var(--pur01-control-border) !important;
}

.pur01-search-grid .pur01-date-slot :deep(input[type="date"]:focus) {
  border-color: #3b82f6 !important;
}

/* 거래처: compact-search-bar 시 제목 없음 — 그리드 열 폭만 맞춤 */
.pur01-bc-slot :deep(> div.flex.items-center) {
  margin-top: 0;
}
.pur01-pick-slot {
  width: 100%;
  min-width: 0;
}

.pur01-pick-slot :deep(> div.flex.text-base) {
  width: 100%;
  min-width: 0;
}

.pur01-pick-slot :deep(> div.flex > div:first-child) {
  display: none;
}
.pur01-date-slot :deep(> div.flex.justify-start.items-center) {
  margin-left: 0;
  padding-left: 0;
  width: fit-content;
  max-width: 100%;
}
.pur01-bc-slot :deep(> div.flex) {
  justify-content: flex-start;
  width: 100%;
  margin-left: 0;
  padding-left: 0;
}

</style>
