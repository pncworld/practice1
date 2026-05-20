/*--############################################################################
# Filename : CRM03_009RPT.vue                                                  
# Description : 고객관리 > 고객 실적 관리 > 고객쿠폰분석자료.                  
# Date :2025-06-13                                                             
# Author : 권맑음                     
################################################################################*/
<template>
  <!-- 조회조건 -->
  <div class="flex h-full min-h-0 flex-col" @click="handleParentClick">
    <div
      class="flex shrink-0 items-center justify-between gap-3 overflow-y-hidden pr-1">
      <PageName></PageName>
      <div class="flex shrink-0 items-center justify-end space-x-2 pr-5">
        <button type="button" class="button search md:w-auto w-14" @click="searchButton">
          조회
        </button>
        <button type="button" class="button save w-auto excel" @click="excelButton">
          엑셀
        </button>
      </div>
    </div>

    <div
      class="crm03-search-panel z-10 mt-3 w-full max-w-[min(100%,1680px)] min-w-0 shrink-0 self-center overflow-x-auto rounded-md border border-slate-500/70 bg-gradient-to-b from-violet-100 via-purple-50/95 to-slate-100 shadow-sm">
      <div
        class="crm03-search-body min-w-0 text-slate-800"
        :style="{ '--crm03-control-border': crm03ControlBorder }">
        <!-- 1행: 기간 · 매장 -->
        <div
          class="crm03-search-row flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-slate-500/45 px-4 py-2.5 sm:px-5">
          <div
            class="crm03-r1-left flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-2 sm:flex-nowrap">
            <div class="crm03-label-slot shrink-0">
              <span class="crm03-lbl">기간</span>
            </div>
            <div class="crm03-date-slot min-w-0 shrink-0">
              <Datepicker2
                ref="dpPeriod"
                :main-name="'기간'"
                :omit-main-label="true"
                :filter-bar-align="true"
                :init-today="1"
                :close-pop-up="closePopUp"
                @end-date="endDate"
                @excel-date="excelDate"
                @start-date="startDate"></Datepicker2>
            </div>
          </div>
          <div
            class="crm03-store-slot flex min-h-8 w-full min-w-0 items-center sm:w-auto sm:min-w-[18rem] sm:max-w-[min(100%,56rem)] sm:flex-1 sm:basis-0">
            <PickStoreSingle
              @lng-store-group="lngStoreGroup"
              @lng-store-attrs="lngStoreAttrs"
              @lng-store-code="lngStoreCode"
              @lng-supervisor="lngSupervisor"
              @lng-store-team="lngTeamCode"
              @excel-store="excelStore"></PickStoreSingle>
          </div>
        </div>

        <!-- 2행: 가입일 -->
        <div
          class="crm03-search-row flex flex-wrap items-center gap-x-2 gap-y-2 border-b border-slate-500/45 px-4 py-2.5 sm:px-5">
          <div class="crm03-label-slot shrink-0">
            <span class="crm03-lbl">가입일</span>
          </div>
          <div class="crm03-date-slot min-w-0 flex-1 sm:max-w-[28rem]">
            <Datepicker2
              ref="dpJoin"
              :main-name="'가입일'"
              :omit-main-label="true"
              :filter-bar-align="true"
              :remove-default="true"
              :disable-box="false"
              :close-pop-up="closePopUp"
              @end-date="endDate2"
              @excel-date="excelDate2"
              @start-date="startDate2"></Datepicker2>
          </div>
        </div>

        <!-- 3행: 쿠폰명 · 쿠폰사용여부 -->
        <div
          class="crm03-search-row grid grid-cols-1 gap-x-3 gap-y-2 border-b border-slate-500/45 px-4 py-2.5 sm:grid-cols-2 sm:px-5">
          <div class="crm03-r2-cell">
            <span class="crm03-lbl">쿠폰명</span>
            <select
              id="crm03-cond-coupon"
              v-model="cond"
              class="crm03-select h-8 min-h-8 min-w-0 w-full max-w-xs rounded-md border border-solid bg-white px-2 text-sm text-slate-800">
              <option value="0">전체</option>
              <option v-for="i in optionList" :key="i.lngCouponId" :value="i.lngCouponId">
                {{ i.strCouponName }}
              </option>
            </select>
          </div>
          <div class="crm03-r2-cell">
            <span class="crm03-lbl">쿠폰사용여부</span>
            <select
              id="crm03-cond-use"
              v-model="cond2"
              class="crm03-select h-8 min-h-8 min-w-0 w-full max-w-xs rounded-md border border-solid bg-white px-2 text-sm text-slate-800">
              <option :value="null">전체</option>
              <option value="Y">사용</option>
              <option value="N">미사용</option>
            </select>
          </div>
        </div>

        <!-- 4행: 성별 · 기념일 -->
        <div
          class="crm03-search-row grid grid-cols-1 gap-x-3 gap-y-2 border-b border-slate-500/45 px-4 py-2.5 sm:grid-cols-2 sm:px-5">
          <div class="crm03-r2-cell">
            <span class="crm03-lbl">성별</span>
            <select
              id="crm03-cond-gender"
              v-model="cond3"
              class="crm03-select h-8 min-h-8 min-w-0 w-full max-w-xs rounded-md border border-solid bg-white px-2 text-sm text-slate-800">
              <option :value="null">전체</option>
              <option value="1">남자</option>
              <option value="0">여자</option>
              <option value="2">외국인</option>
            </select>
          </div>
          <div class="crm03-r2-cell crm03-r2-cell--anniv">
            <span class="crm03-lbl">기념일</span>
            <div class="crm03-date-slot min-w-0">
              <Datepicker2
                ref="dpAnniv"
                :main-name="'기념일'"
                :omit-main-label="true"
                :filter-bar-align="true"
                :remove-default="true"
                :disable-box="false"
                :close-pop-up="closePopUp"
                @end-date="endDate3"
                @excel-date="excelDate2"
                @start-date="startDate3"></Datepicker2>
            </div>
          </div>
        </div>

        <!-- 5행: 지역 · 등급 -->
        <div
          class="crm03-search-row grid grid-cols-1 gap-x-3 gap-y-2 px-4 py-2.5 sm:grid-cols-2 sm:px-5">
          <div class="crm03-r2-cell">
            <span class="crm03-lbl">지역</span>
            <select
              id="crm03-cond-region"
              v-model="cond4"
              class="crm03-select h-8 min-h-8 min-w-0 w-full max-w-xs rounded-md border border-solid bg-white px-2 text-sm text-slate-800">
              <option value="0">전체</option>
              <option value="1">서울</option>
            </select>
          </div>
          <div class="crm03-r2-cell">
            <span class="crm03-lbl">등급</span>
            <select
              id="crm03-cond-level"
              v-model="cond5"
              class="crm03-select h-8 min-h-8 min-w-0 w-full max-w-xs rounded-md border border-solid bg-white px-2 text-sm text-slate-800">
              <option value="0">전체</option>
              <option v-for="i in optionList2" :key="i.intLevel" :value="i.intLevel">
                {{ i.strLevelName }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- 그리드: flex-1 + min-h-0 (Realgrid h-full) -->
    <div
      class="crm03-grid-shell mx-auto mt-2 flex min-h-0 min-w-0 w-full max-w-[min(100%,1680px)] flex-1 flex-col basis-0 overflow-hidden px-1 pb-1">
      <div
        class="crm03-main-grid-frame flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden rounded-sm border border-gray-400 bg-white">
        <div class="relative min-h-0 w-full flex-1">
          <Realgrid
            :progname="'CRM03_009RPT_VUE'"
            :progid="1"
            :rowData="rowData"
            :reload="reload"
            :setFooterCustomColumnId="['strStoreName']"
            :setFooterCustomText="['합계']"
            :setFooter="true"
            :mergeColumns2="true"
            :mergeColumnGroupSubList2="[
              [
                'intVisit',
                'lngActAmt',
                'lngAddPoint',
                'lngBonusPoint',
                'lngUsedPoint',
                'lngPromoAddPoint',
                'lngPromoUsedPoint',
                'lngReuqireCnt',
                'lngNormalCnt',
                'lngDailyEvent',
              ],
            ]"
            :mergeColumnGroupName2="['조회기간 기준']"
            :documentTitle="'CRM03_009RPT'"
            :documentSubTitle="documentSubTitle"
            :rowStateeditable="false"
            :exporttoExcel="exportExcel">
          </Realgrid>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  getCustCouponAnalyInfo,
  getInitCouponType,
  getInitDataCustPurchase,
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

import { onMounted, ref } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";
import Swal from "sweetalert2";
/**
 * 	화면 Load시 실행 스크립트
 */

const store = useStore();
const crm03ControlBorder = "#cbd5e1";

const optionList2 = ref([]);
const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

const cond = ref(0);
const cond2 = ref(null);
const cond3 = ref(null);
const optionList = ref([]);
const dpPeriod = ref(null);
const dpJoin = ref(null);
const dpAnniv = ref(null);
const closePopUp = ref(false);

const cond4 = ref(0);
const cond5 = ref(0);

onMounted(async () => {
  await insertPageLog(store.state.activeTab2);

  const res = await getInitDataCustPurchase(store.state.userData.lngStoreGroup);
  optionList2.value = res.data.List;

  const res2 = await getInitCouponType(store.state.userData.lngStoreGroup);

  optionList.value = res2.data.List;
});
/**
 * 매출 일자 안 라디오박스 닫기 위한 외부 클릭 감지 함수
 */

const handleParentClick = (e) => {
  for (const r of [dpPeriod, dpJoin, dpAnniv]) {
    const el = r.value?.$el;
    if (el && el.contains(e.target)) {
      return;
    }
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

const sDate2 = ref();
const eDate2 = ref();
const startDate2 = (e) => {
  sDate2.value = e;
};
const endDate2 = (e) => {
  eDate2.value = e;
};

const sDate3 = ref();
const eDate3 = ref();
const startDate3 = (e) => {
  sDate3.value = e;
};
const endDate3 = (e) => {
  eDate3.value = e;
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

    const res = await getCustCouponAnalyInfo(
      groupCd.value,
      storeCode.value,
      sDate.value,
      eDate.value,
      cond4.value,
      storeAttr.value,
      teamcode.value,
      supervisor.value,
      cond3.value,
      sDate2.value,
      eDate2.value,
      sDate3.value,
      eDate3.value,
      cond5.value,
      cond.value,
      cond2.value
    );

    const list = res.data.List ?? [];
    rowData.value = list;
    ////console.log(res);
    afterSearch.value = true;
    Swal.fire({
      icon: "info",
      text: `조회가 완료되었습니다.조회건수:${list.length}`,
      confirmButtonText: "확인",
    });
  } catch (error) {
    afterSearch.value = false;
    ////console.log(error);
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

<style scoped>
.crm03-main-grid-frame {
  min-height: min(65vh, 420px);
}

@media (max-height: 800px) {
  .crm03-main-grid-frame {
    min-height: min(52vh, 300px);
  }
}

.crm03-lbl {
  display: flex;
  min-width: 0;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(30 41 59);
  text-align: center;
  white-space: nowrap;
}

.crm03-label-slot {
  display: grid;
  min-width: 0;
  min-height: 2rem;
  align-items: center;
  grid-template-columns: minmax(5.25rem, 6.75rem);
}

.crm03-r2-cell {
  display: grid;
  min-width: 0;
  min-height: 2rem;
  align-items: center;
  column-gap: 0.5rem;
  grid-template-columns: minmax(5.25rem, 6.75rem) minmax(0, 1fr);
}

.crm03-r2-cell--anniv .crm03-date-slot {
  min-width: 0;
}

.crm03-date-slot :deep(> div.flex.justify-start.items-center) {
  min-height: 2rem;
  align-items: center;
}

.crm03-store-slot :deep(.pss-root) {
  width: 100%;
  min-width: 0;
}

.crm03-search-panel .crm03-select {
  border: 1px solid var(--crm03-control-border) !important;
  box-sizing: border-box;
}

.crm03-search-panel .crm03-select:focus {
  border-color: #3b82f6 !important;
  outline: none;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.35);
}

.crm03-search-panel .crm03-date-slot :deep(input[type="date"]) {
  border: 1px solid var(--crm03-control-border) !important;
  box-sizing: border-box;
}

.crm03-search-panel .crm03-date-slot :deep(input[type="date"]:focus) {
  border-color: #3b82f6 !important;
}

@media (max-height: 900px) {
  .crm03-search-panel {
    margin-top: 0.25rem !important;
  }

  .crm03-search-row {
    padding-top: 0.5rem !important;
    padding-bottom: 0.5rem !important;
  }
}
</style>
