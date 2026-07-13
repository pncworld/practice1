<!-- /*--############################################################################
# Filename : CRM01_010RPT.vue                                                  
# Description : 고객관리 > 고객신상정보 > 고객 가입 현황.                 
# Date :2025-06-18                                                             
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <!-- 조회조건 -->
  <div class="flex h-full min-h-0 flex-col" @click="handleParentClick">
    <div class="flex shrink-0 justify-between items-center w-full overflow-y-hidden">
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
      class="crm010-search-panel z-10 mt-3 w-full min-h-0 shrink-0 overflow-x-auto rounded-lg bg-gray-200"
      :style="{
        '--crm010-panel-pad-x': '2rem',
        '--crm010-control-border': crm010ControlBorder,
      }">
      <div class="crm010-search-layout min-w-0">
        <!-- 좌측 2단: 기간 / 등급 -->
        <div class="crm010-left-stack min-w-0">
          <div class="crm010-row">
            <input
              id="crm010-cond-period"
              v-model="cond"
              type="checkbox"
              class="crm010-check shrink-0" />
            <label class="crm010-lbl shrink-0" for="crm010-cond-period">기간</label>
            <div class="crm010-date-slot min-w-0 flex-1">
              <Datepicker2
                ref="datepicker"
                omit-main-label
                filter-bar-align
                :mainName="'기간'"
                :initToday="1"
                :closePopUp="closePopUp"
                @endDate="endDate"
                @excelDate="excelDate"
                @startDate="startDate" />
            </div>
          </div>
          <div class="crm010-row">
            <span class="crm010-check-spacer shrink-0" aria-hidden="true"></span>
            <span class="crm010-lbl shrink-0">등급</span>
            <div class="crm010-field min-w-0">
              <select
                id="crm010-grade"
                v-model="cond3"
                class="crm010-sg-select h-8 min-h-8 rounded-md border border-solid bg-white px-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="0">전체</option>
                <option
                  v-for="i in optionList"
                  :key="i.intLevel"
                  :value="i.intLevel">
                  {{ i.strLevelName }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- 우측: 매장명(2단 컴포넌트) — 좌측 2단에 맞춤 -->
        <div class="crm010-right-store min-w-0">
          <input
            id="crm010-cond-store"
            v-model="cond2"
            type="checkbox"
            class="crm010-check shrink-0" />
          <div class="crm010-pick-slot min-w-0 flex-1">
            <PickStoreSingle
              @lngStoreGroup="lngStoreGroup"
              @lngStoreCode="lngStoreCode"
              @lngStoreAttrs="lngStoreAttrs"
              @lngStoreTeam="lngStoreTeam"
              @excelStore="excelStore"
              @lngSupervisor="lngSupervisor" />
          </div>
        </div>
      </div>
    </div>

    <!-- 그리드 영역 -->
    <div class="mt-2 flex min-h-0 min-w-0 flex-1 flex-col">
      <div class="relative min-h-0 w-full flex-1">
        <Realgrid
          :progname="'CRM01_010RPT_VUE'"
          :progid="1"
          :rowData="rowData"
          :reload="reload"
          :setFooterCustomColumnId="['strStoreName']"
          :hideColumnsId="hideColumnsId"
          :setFooterCustomText="['합계']"
          :setGroupSumCustomColumnId="['strStoreName']"
          :setGroupSumCustomText="['일자별']"
          :setFooter="setFooter"
          :setGroupFooter="setGroupFooter"
          :setMergeMode="false"
          :setGroupColumnId="'dtmDate'"
          :documentTitle="'CRM01_010RPT'"
          :documentSubTitle="documentSubTitle"
          :rowStateeditable="false"
          @buttonClicked="buttonClicked"
          :exporttoExcel="exportExcel">
        </Realgrid>
      </div>
    </div>
  </div>
  <CustomerSearch
    v-if="visible"
    @lngCustNo="lngCustNo"
    @strCustName="strCustName"
    @closePopUp="visible = false"
    :joinSts="3"></CustomerSearch>
  <!-- 그리드 영역 -->
</template>

<script setup>
import {
  getInitDataCustPurchase,
  getRegisterCustomer,
  getStopCustList,
  restoreCustomor,
} from "@/api/micrm";
import CustomerSearch from "@/components/customerSearch.vue";
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

  const res = await getInitDataCustPurchase(store.state.userData.lngStoreGroup);
  optionList.value = res.data.List;
});

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);
const visible = ref(false);
const rowData2 = ref([]);
const rowData3 = ref([]);
const rowData4 = ref([]);
const condValue = ref(0);
const store = useStore();
const cond = ref(false);
const cond2 = ref(false);
const cond3 = ref(0);
const optionList = ref([]);
const datepicker = ref(null);
const closePopUp = ref(false);
const setFooter = ref(false);
const groupCd = ref(0);
const storeCd = ref(0);
const joinType = ref(0);
const superVisor = ref(0);
const TeamCd = ref(0);

const lngSupervisor = (e) => {
  superVisor.value = e;
};
const lngStoreTeam = (e) => {
  TeamCd.value = e;
};
const lngStoreAttrs = (e) => {
  joinType.value = e;
};
const lngStoreCode = (e) => {
  storeCd.value = e;
};
const lngStoreGroup = (e) => {
  groupCd.value = e;
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
};
const endDate = (e) => {
  eDate.value = e;
};

const selectedDate = ref();
const excelDate = (e) => {
  selectedDate.value = e;
};

/**
 *  조회 함수
 */

const setGroupFooter = ref(false);
const hideColumnsId = ref(["dtmDate"]);
const searchButton = async () => {
  try {
    store.state.loading = true;
    initGrid();

    if (cond.value == true) {
      hideColumnsId.value = [];
    } else {
      hideColumnsId.value = ["dtmDate"];
    }
    if (cond2.value == true && cond.value == true) {
      hideColumnsId.value = [];
      setFooter.value = true;
    } else if (cond2.value == false && cond.value == false) {
      hideColumnsId.value = [
        "lngStoreGroup",
        "strSubLeaseName",
        "strTeamName",
        "strSupervisorName",
        "lngStoreCode",
        "strStoreName",
      ];
      cond.value = true;
      setFooter.value = false;
    }

    if (cond.value == true && cond2.value == true) {
      setGroupFooter.value = true;
    } else {
      setGroupFooter.value = false;
    }
    const res = await getRegisterCustomer(
      groupCd.value,
      storeCd.value,
      joinType.value,
      superVisor.value,
      TeamCd.value,
      sDate.value,
      eDate.value,
      cond3.value,
      cond.value == true ? 1 : 0
    );

    rowData.value = res.data.List;
    ////console.log(res);
    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    //comsole.log(error);
  } finally {
    store.state.loading = false;
  }
};

const buttonClicked = async (e) => {
  try {
    const res = await restoreCustomor(
      store.state.userData.lngStoreGroup,
      e[8],
      store.state.userData.lngSequence
    );
    ////console.log(res);
  } catch (error) {
  } finally {
    searchButton();
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

const crm010ControlBorder = "#cbd5e1";
</script>

<style scoped>
.crm010-search-panel {
  box-sizing: border-box;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  padding-left: var(--crm010-panel-pad-x, 2rem);
  padding-right: var(--crm010-panel-pad-x, 2rem);
}

@media (min-width: 768px) {
  .crm010-search-panel {
    --crm010-panel-pad-x: 3rem;
  }
}

.crm010-search-layout {
  display: grid;
  grid-template-columns: minmax(18rem, 1.05fr) minmax(22rem, 1.25fr);
  column-gap: 1.75rem;
  align-items: stretch;
  min-width: 0;
}

.crm010-left-stack {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.625rem;
  min-width: 0;
  /* 패널 좌측 inset과 별도로 한 번 더 들여 → 왼쪽 공간 약 2배, 매장명 위치는 유지 */
  padding-inline-start: var(--crm010-panel-pad-x, 2rem);
}

.crm010-row {
  display: grid;
  grid-template-columns: 1rem 3.5rem minmax(0, 1fr);
  column-gap: 0.875rem;
  align-items: center;
  min-width: 0;
  min-height: 2rem;
}

.crm010-right-store {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
}

.crm010-check {
  width: 1rem;
  height: 1rem;
  margin: 0;
  cursor: pointer;
  accent-color: #2563eb;
  justify-self: center;
}

.crm010-check-spacer {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  justify-self: center;
}

.crm010-lbl {
  width: auto;
  margin: 0;
  padding-inline-end: 0.25rem;
  font-size: 1rem;
  font-weight: 600;
  color: rgb(17 24 39);
  white-space: nowrap;
  text-align: left;
}

.crm010-field {
  display: flex;
  align-items: center;
  min-width: 0;
  padding-inline-start: 0.125rem;
  /* Datepicker2 filterBarAlign: w-36 + gap-x-1 + ~ + gap-x-1 + w-36 (캘린더 버튼 제외) */
  width: calc(9rem + 0.25rem + 1rem + 0.25rem + 9rem);
  max-width: 100%;
}

.crm010-date-slot {
  min-width: 0;
  padding-inline-start: 0.125rem;
}

.crm010-date-slot :deep(> div.flex.justify-start.items-center) {
  margin: 0 !important;
  width: auto !important;
  max-width: 100%;
}

.crm010-date-slot :deep(input[type="date"]) {
  box-sizing: border-box;
  height: 2rem;
  min-height: 2rem;
  border: 1px solid var(--crm010-control-border, #cbd5e1);
  border-radius: 0.375rem;
  background: #fff;
}

.crm010-pick-slot {
  min-width: 0;
}

.crm010-pick-slot :deep(.pss-root) {
  width: 100%;
}

.crm010-sg-select {
  box-sizing: border-box;
  width: 100%;
  border-color: var(--crm010-control-border, #cbd5e1);
}

@media (max-width: 900px) {
  .crm010-search-layout {
    grid-template-columns: minmax(0, 1fr);
    row-gap: 0.75rem;
  }
}
</style>
