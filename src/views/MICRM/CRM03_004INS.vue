/*--############################################################################
# Filename : CRM03_004INS.vue
# Description : 고객관리 > 고객 실적 관리 > 고객카드 할인 현황.
# Date :2025-06-12
# Author : 권맑음
# 2026-11-05 : 조회 영역 정리(CRM03_009RPT 패턴), 카드번호 입력 → 고객명 조회 팝업,
#              임직원할인(공통코드 448 설정 그룹 전용) POS번호·할인차감 칸
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
      class="crm34-search-panel z-10 mt-3 w-full max-w-[min(100%,1680px)] min-w-0 shrink-0 self-center overflow-x-auto rounded-md border border-slate-500/70 bg-gray-200 shadow-sm">
      <div
        class="crm34-search-body min-w-0 text-slate-800"
        :style="{ '--crm34-control-border': crm34ControlBorder }">
        <!-- 왼쪽: 1행 기간 / 2행 고객명 · 오른쪽: 매장명(직/가맹·팀/SC 2줄) — 전체 2행 -->
        <div class="crm34-search-grid">
          <div class="crm34-left-stack">
            <!-- 1행: 기간 -->
            <div class="crm34-cell">
              <div class="crm34-label-slot">
                <span class="crm34-lbl">기간</span>
              </div>
              <div class="crm34-date-slot">
                <Datepicker2
                  ref="datepicker"
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
            <!-- 2행: 고객명 (고객명 조회 팝업으로 선택) -->
            <div class="crm34-cell">
              <div class="crm34-label-slot">
                <span class="crm34-lbl">고객명</span>
              </div>
              <div class="crm34-cust-pick flex min-w-0 items-center gap-2">
                <input
                  id="crm34-pick-card"
                  v-model="pickedCardDisplay"
                  type="text"
                  disabled
                  autocomplete="off"
                  placeholder="카드번호"
                  class="crm34-sg-input h-8 min-h-8 w-[6.5rem] min-w-0 shrink-0 rounded-md border border-solid bg-slate-100 px-2 text-sm text-slate-700" />
                <input
                  id="crm34-pick-name"
                  v-model="pickedCustName"
                  type="text"
                  disabled
                  autocomplete="off"
                  placeholder="전체 고객"
                  class="crm34-sg-input h-8 min-h-8 min-w-0 flex-1 rounded-md border border-solid bg-white px-2 text-sm text-slate-800" />
                <button type="button" class="crm34-cust-pick-btn shrink-0" @click="openCustSearch">
                  조회
                </button>
                <button type="button" class="crm34-cust-pick-btn shrink-0" @click="resetCustPick">
                  초기화
                </button>
              </div>
            </div>
          </div>
          <div class="crm34-store-slot">
            <PickStoreSingle
              @lngStoreGroup="lngStoreGroup"
              @lngStoreAttrs="lngStoreAttrs"
              @lngStoreCode="lngStoreCode"
              @lngSupervisor="lngSupervisor"
              @lngStoreTeam="lngTeamCode"
              @excelStore="excelStore"></PickStoreSingle>
          </div>
        </div>
      </div>
    </div>
    <!-- 조회조건 -->

    <!-- 그리드 영역 -->
    <div
      class="crm34-grid-shell mx-auto mt-2 flex min-h-0 w-full max-w-[min(100%,1680px)] flex-1 basis-0 flex-col overflow-hidden px-1 pb-1">
      <div
        class="crm34-main-grid-frame flex w-full min-w-0 flex-1 flex-col overflow-hidden rounded-sm border border-gray-400 bg-white">
        <div class="relative min-h-0 w-full flex-1">
          <Realgrid
            :progname="'CRM03_004INS_VUE'"
            :progid="1"
            :rowData="rowData"
            :reload="reload"
            :setFooterCustomColumnId="['strStoreName']"
            :setFooterCustomText="['합계']"
            :setFooter="true"
            :setGroupFooter="true"
            :setGroupColumnId="'strStoreName'"
            :hideColumnsId="hideColumnsId"
            :documentTitle="'CRM03_004INS'"
            :documentSubTitle="documentSubTitle"
            :rowStateeditable="false"
            :exporttoExcel="exportExcel">
          </Realgrid>
        </div>
      </div>
    </div>
    <!-- 그리드 영역 -->
  </div>

  <CustomerSearch
    v-if="showCustPopup"
    join-sts="1"
    @strCCardID="onPickCard"
    @strCustName="onPickCustName"
    @closePopUp="showCustPopup = false" />
</template>

<script setup>
import {
  getCustCardDisList,
  getCustCardDisList2,
  getStaffDcInfo,
} from "@/api/micrm";
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
 * 	고객 카드번호 조회 팝업 (CRM02_002RPT 와 같은 컴포넌트)
 */
import CustomerSearch from "@/components/customerSearch.vue";
/**
 * 	그리드 생성
 */
import Realgrid from "@/components/realgrid.vue";
/**
 *  페이지로그 자동 입력
 *  */
import { insertPageLog } from "@/customFunc/customFunc";

import { onMounted, ref } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */
import { useStore } from "vuex";

const store = useStore();
const crm34ControlBorder = "#cbd5e1";

/**
 * 임직원할인 (공통코드 448 설정 그룹 전용, 2026-11-05)
 * - 설정 그룹이 아니면 기존 조회(getCustCardDisList)·기존 그리드 그대로, 직원할인 칸은 숨김
 * - 설정 그룹이면 getCustCardDisList2 로 POS번호·할인차감을 함께 조회
 */
const STAFF_DC_COLS = ["intRegNo", "intDcUseCnt", "strDcYM"];
const staffDcGroup = ref(false);
const hideColumnsId = ref([...STAFF_DC_COLS]);

const loadStaffDcGroup = async () => {
  try {
    const res = await getStaffDcInfo(store.state.userData.lngStoreGroup, "");
    staffDcGroup.value =
      res?.data?.RESULT_CD == "00" && (res.data.List ?? []).length > 0;
  } catch (error) {
    staffDcGroup.value = false;
  }
  hideColumnsId.value = staffDcGroup.value ? [] : [...STAFF_DC_COLS];
};

onMounted(async () => {
  await insertPageLog(store.state.activeTab2);
  await loadStaffDcGroup();
});

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);
const datepicker = ref(null);
const closePopUp = ref(false);

/**
 * 고객명 조회 팝업 (카드번호 입력창 대신)
 * - 고른 고객의 카드번호를 기존 조회 조건(카드번호)으로 넘긴다. 비워 두면 전체 고객
 */
const showCustPopup = ref(false);
const cond = ref(""); // 조회 조건 카드번호
const pickedCardDisplay = ref("");
const pickedCustName = ref("");

const normalizeCardDisplay = (v) =>
  String(v ?? "")
    .replace(/[[\]]/g, "")
    .trim();

const openCustSearch = () => {
  showCustPopup.value = true;
};
const onPickCard = (v) => {
  cond.value = normalizeCardDisplay(v);
  pickedCardDisplay.value = normalizeCardDisplay(v);
  initGrid();
};
const onPickCustName = (v) => {
  pickedCustName.value = String(v ?? "").trim();
};
const resetCustPick = () => {
  cond.value = "";
  pickedCardDisplay.value = "";
  pickedCustName.value = "";
  initGrid();
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
const searchButton = async () => {
  try {
    store.state.loading = true;
    initGrid();

    // 직원할인 설정 그룹만 새 조회, 다른 그룹은 기존 조회 그대로
    const fetchList = staffDcGroup.value
      ? getCustCardDisList2
      : getCustCardDisList;
    const res = await fetchList(
      groupCd.value,
      storeCode.value,
      storeAttr.value,
      teamcode.value,
      supervisor.value,
      sDate.value,
      eDate.value,
      cond.value
    );

    rowData.value = res.data.List;
    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
  } finally {
    store.state.loading = false;
  }
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
  documentSubTitle.value =
    selectedDate.value +
    "\n" +
    selectedExcelStore.value +
    (pickedCustName.value ? `\n고객명: ${pickedCustName.value}` : "");
  exportExcel.value = !exportExcel.value;
};

// 엑셀 추출
const documentSubTitle = ref("");
const selectedExcelStore = ref("");
/**
 * 엑셀용 매장 세팅 함수
 */
const excelStore = (e) => {
  selectedExcelStore.value = e;
};
</script>

<style scoped>
/* 메인 그리드: 고정 vh 대신 뷰포트에 맞는 최소 높이 (CRM02_002RPT·CRM03_009RPT 와 같은 방식) */
.crm34-main-grid-frame {
  min-height: min(65vh, 420px);
}

@media (max-height: 800px) {
  .crm34-main-grid-frame {
    min-height: min(52vh, 300px);
  }
}

.crm34-lbl {
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

/*
 * 조회 AREA 크기 (STK05_013RPT 방식) — 숫자로 고정해 칸 크기 통일, 앞 공백 = 뒤 공백
 *  - 왼쪽 열 : 항목명(기간·고객명 같은 폭) + 값 칸(기간 = 날짜 2칸 + ~ + 달력 버튼, 고객명 = 같은 폭)
 *  - 오른쪽 열 : 매장명(PickStoreSingle) 고정 폭, 화면이 좁으면 줄어듦
 *  - 두 열은 space-between → 왼쪽 열 시작 = 패널 pad, 매장 끝 = 패널 끝 - 같은 pad
 */
.crm34-search-panel {
  --crm34-pad-x: 3rem;
  --crm34-col-gap: 2.5rem;
  --crm34-row-gap: 0.5rem;
  --crm34-item-gap: 1rem;
  --crm34-label-w: 3.5rem; /* 「고객명」 글자 폭 */
  --crm34-date-w: 12rem; /* 날짜 칸 1개 = 콤보 1개 기준 12rem */
  --crm34-tilde-w: 0.75rem;
  --crm34-cal-btn-w: 2rem;
  --crm34-range-gap: 0.25rem;
  --crm34-field-w: calc(
    var(--crm34-date-w) * 2 + var(--crm34-tilde-w) + var(--crm34-cal-btn-w) + var(--crm34-range-gap) * 3
  );
  --crm34-store-w: 46rem;
}

.crm34-search-grid {
  display: grid;
  grid-template-columns: max-content minmax(0, var(--crm34-store-w));
  justify-content: space-between;
  align-items: center;
  column-gap: var(--crm34-col-gap);
  padding: 0.75rem var(--crm34-pad-x);
  min-width: 0;
}

.crm34-left-stack {
  display: flex;
  flex-direction: column;
  row-gap: var(--crm34-row-gap);
  min-width: 0;
}

.crm34-cell {
  display: flex;
  min-height: 2rem;
  align-items: center;
  gap: var(--crm34-item-gap);
  min-width: 0;
}

/* 항목명 칸 : 기간·고객명 같은 폭, 가운데 정렬 */
.crm34-label-slot {
  display: flex;
  flex: 0 0 var(--crm34-label-w);
  width: var(--crm34-label-w);
  min-height: 2rem;
  align-items: center;
  justify-content: center;
}

/* 기간 Datepicker2 (filterBarAlign) — 구성 요소를 고정 크기로 두어 전체 폭 = --crm34-field-w */
.crm34-date-slot {
  flex: 0 0 var(--crm34-field-w);
  width: var(--crm34-field-w);
}

.crm34-date-slot :deep(> div.flex.justify-start.items-center) {
  width: var(--crm34-field-w) !important;
  max-width: none !important;
  min-height: 2rem;
  margin: 0 !important;
  gap: 0 !important;
  align-items: center;
}

.crm34-date-slot :deep(> div.flex > div.inline-flex.h-8) {
  flex: 0 0 auto;
  width: var(--crm34-field-w);
  margin: 0 !important;
  padding: 0 !important;
  gap: var(--crm34-range-gap) !important;
}

.crm34-date-slot :deep(input[type="date"]) {
  flex: 0 0 var(--crm34-date-w);
  width: var(--crm34-date-w) !important;
  max-width: none !important;
  height: 2rem !important;
  margin: 0 !important;
}

.crm34-date-slot :deep(div.inline-flex.h-8 > span) {
  flex: 0 0 var(--crm34-tilde-w);
  width: var(--crm34-tilde-w);
  margin: 0 !important;
  padding: 0 !important;
  text-align: center;
}

.crm34-date-slot :deep(div.inline-flex.h-8 > button) {
  flex: 0 0 var(--crm34-cal-btn-w);
  width: var(--crm34-cal-btn-w) !important;
  min-width: var(--crm34-cal-btn-w) !important;
  height: 2rem !important;
  margin: 0 !important;
  padding: 0 !important;
}

/* 고객명 칸 끝선 = 기간 칸 끝선 */
.crm34-cust-pick {
  flex: 0 0 var(--crm34-field-w);
  width: var(--crm34-field-w);
}

.crm34-store-slot {
  display: flex;
  min-width: 0;
  min-height: 2rem;
  align-items: center;
}

.crm34-store-slot :deep(.pss-root) {
  width: 100%;
  min-width: 0;
}

.crm34-search-panel .crm34-sg-input {
  border: 1px solid var(--crm34-control-border) !important;
  box-sizing: border-box;
}

.crm34-search-panel .crm34-date-slot :deep(input[type="date"]) {
  border: 1px solid var(--crm34-control-border) !important;
  box-sizing: border-box;
}

.crm34-search-panel .crm34-date-slot :deep(input[type="date"]:focus) {
  border-color: #3b82f6 !important;
}

.crm34-cust-pick-btn {
  box-sizing: border-box;
  display: inline-flex;
  height: 2rem;
  min-height: 2rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  border: 1px solid rgb(203 213 225);
  background-color: #fff;
  padding: 0 0.75rem;
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(55 65 81);
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

.crm34-cust-pick-btn:hover {
  background-color: rgb(248 250 252);
}

@media (max-height: 900px) {
  .crm34-search-panel {
    margin-top: 0.25rem !important;
  }

  .crm34-search-grid {
    padding-top: 0.5rem !important;
    padding-bottom: 0.5rem !important;
  }
}
</style>
