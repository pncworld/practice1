/*--############################################################################
# Filename : CRM20_002RPT.vue                                                  
# Description : 고객관리 > 고객 실적 관리 > 고객 실적 조회                      
# Date :2025-06-12                                                             
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
      class="crm02-search-panel z-10 mt-3 w-full max-w-[min(100%,1680px)] min-w-0 shrink-0 self-center overflow-x-auto rounded-md border border-slate-500/70 bg-gradient-to-b from-violet-100 via-purple-50/95 to-slate-100 shadow-sm">
      <div
        class="crm02-search-body min-w-0 text-slate-800"
        :style="{ '--crm02-control-border': crm02ControlBorder }">
        <!-- 참고: 1행 — 기간 · 체크 · 고객명 · 조회 -->
        <div
          class="crm02-search-r1 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-slate-500/45 px-4 py-2.5 sm:px-5">
          <!-- 1행 라벨 열 = 2행 .crm02-r2-cell 첫 열 -->
          <div class="crm02-r1-left flex min-w-0 flex-1 items-center gap-x-2">
            <div class="crm02-r1-label-slot shrink-0">
              <span class="crm02-r2-label">기간</span>
            </div>
            <div
              class="crm02-r1-cluster flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2 sm:flex-nowrap sm:gap-x-4 sm:gap-y-0">
              <div class="crm02-r1-period flex min-h-8 shrink-0 items-center">
                <div class="crm02-date-field min-w-0 shrink-0">
                  <Datepicker2
                    :main-name="'기간'"
                    :omit-main-label="true"
                    :filter-bar-align="true"
                    ref="datepicker"
                    :initToday="1"
                    :closePopUp="closePopUp"
                    @excelDate="excelDate"
                    @endDate="endDate"
                    @startDate="startDate"></Datepicker2>
                </div>
              </div>
              <div class="crm02-r1-checks flex min-h-8 shrink-0 items-center gap-x-4 sm:gap-x-5">
                <label class="crm02-check-label shrink-0" for="crm02-cond-all">
                  <input
                    id="crm02-cond-all"
                    v-model="cond"
                    type="checkbox"
                    name="condtype"
                    class="crm02-check"
                    @change="setCond" />
                  전체기간
                </label>
                <label class="crm02-check-label shrink-0" for="crm02-cond-agg">
                  <input
                    id="crm02-cond-agg"
                    v-model="cond2"
                    type="checkbox"
                    name="condtype"
                    class="crm02-check"
                    @change="setCond2" />
                  집계내역
                </label>
              </div>
            </div>
          </div>
          <div
            class="crm02-r1-cust flex min-h-8 w-full min-w-0 shrink-0 items-center justify-end gap-2 sm:w-auto sm:max-w-[min(100%,42rem)]">
            <span class="crm02-inline-lbl shrink-0">고객명</span>
            <div class="crm02-cust-pick flex min-w-0 flex-1 flex-wrap items-center gap-2 sm:min-w-[12rem]">
              <input
                id="crm02-pick-card"
                v-model="pickedCardDisplay"
                type="text"
                disabled
                autocomplete="off"
                class="crm02-sg-input crm02-cust-pick-input h-8 min-h-8 min-w-0 flex-1 rounded-md border border-solid bg-slate-100 px-2 text-sm text-slate-700 sm:max-w-[7rem]"
              />
              <input
                id="crm02-pick-name"
                v-model="pickedCustName"
                type="text"
                disabled
                autocomplete="off"
                class="crm02-sg-input crm02-cust-pick-input h-8 min-h-8 min-w-0 flex-1 rounded-md border border-solid bg-white px-2 text-sm text-slate-800 sm:min-w-[6rem]"
              />
              <button
                type="button"
                class="crm02-cust-pick-btn shrink-0"
                @click="openCustSearch">
                조회
              </button>
              <button
                type="button"
                class="crm02-cust-pick-btn shrink-0"
                @click="resetCustPick">
                초기화
              </button>
            </div>
          </div>
        </div>
        <!-- 참고: 2행 — 포인트 4종 균등 -->
        <div
          class="crm02-search-r2 grid grid-cols-1 gap-x-3 gap-y-2 px-4 py-2.5 sm:grid-cols-2 sm:px-5 lg:grid-cols-4 lg:gap-x-3">
          <div class="crm02-r2-cell">
            <span class="crm02-r2-label">누적포인트</span>
            <input
              id="crm02-pt-sale"
              v-model="point1"
              type="text"
              disabled
              autocomplete="off"
              class="crm02-sg-input crm02-pt-readonly h-8 min-h-8 min-w-0 w-full rounded-md border border-solid bg-slate-100 px-2 text-sm text-slate-700" />
          </div>
          <div class="crm02-r2-cell">
            <span class="crm02-r2-label">사용포인트</span>
            <input
              id="crm02-pt-used"
              v-model="point2"
              type="text"
              disabled
              autocomplete="off"
              class="crm02-sg-input crm02-pt-readonly h-8 min-h-8 min-w-0 w-full rounded-md border border-solid bg-slate-100 px-2 text-sm text-slate-700" />
          </div>
          <div class="crm02-r2-cell">
            <span class="crm02-r2-label">잔여포인트</span>
            <input
              id="crm02-pt-rem"
              v-model="point3"
              type="text"
              disabled
              autocomplete="off"
              class="crm02-sg-input crm02-pt-readonly h-8 min-h-8 min-w-0 w-full rounded-md border border-solid bg-slate-100 px-2 text-sm text-slate-700" />
          </div>
          <div class="crm02-r2-cell">
            <span class="crm02-r2-label">보너스포인트</span>
            <input
              id="crm02-pt-bonus"
              v-model="point4"
              type="text"
              disabled
              autocomplete="off"
              class="crm02-sg-input crm02-pt-readonly h-8 min-h-8 min-w-0 w-full rounded-md border border-solid bg-slate-100 px-2 text-sm text-slate-700" />
          </div>
        </div>
      </div>
    </div>
    <!-- 그리드: 노트북 뷰포트에 맞춤 — flex-1 + min-h-0 체인 (Realgrid h-full) -->
    <div
      class="crm02-grid-shell mx-auto mt-2 grid min-h-0 min-w-0 w-full max-w-[min(100%,1680px)] flex-1 basis-0 grid-cols-[minmax(0,2.7fr)_minmax(0,1.3fr)] grid-rows-1 gap-2 overflow-hidden px-1 pb-1">
      <section class="crm02-grid-main flex min-h-0 min-w-0 flex-col">
        <div
          class="crm02-main-grid-frame flex w-full min-w-0 flex-1 flex-col overflow-hidden rounded-sm border border-gray-400 bg-white">
          <div class="relative min-h-0 w-full flex-1">
            <Realgrid
              :progname="'CRM02_002RPT_VUE'"
              :progid="1"
              :rowData="rowData"
              :reload="reload"
              :setFooterCustomColumnId="['strCCardID']"
              :setFooterCustomText="['합계']"
              :setFooter="true"
              :hideColumnsId="hideColumnsId"
              :documentTitle="'CRM02_002RPT'"
              @clickedRowData="clickedRowData"
              :documentSubTitle="documentSubTitle"
              :rowStateeditable="false"
              :exporttoExcel="exportExcel">
            </Realgrid>
          </div>
        </div>
      </section>
      <section
        class="crm02-grid-side grid h-full min-h-0 min-w-0 grid-cols-1 grid-rows-[1fr,4fr,1fr,4fr,1fr,4fr] border border-black">
        <div class="flex items-center justify-start">※고객정보</div>
        <div class="h-full min-h-0 w-full overflow-hidden">
          <Realgrid
            :progname="'CRM02_002RPT_VUE_Popup'"
            :progid="1"
            :rowData="rowData2"
            :rowStateeditable="false"
            :setStateBar="false"></Realgrid>
        </div>
        <div class="flex items-center justify-start">※주문내역</div>
        <div class="h-full min-h-0 w-full overflow-hidden">
          <Realgrid
            :progname="'CRM02_002RPT_VUE_Popup'"
            :progid="2"
            :rowData="rowData3"
            :rowStateeditable="false"
            :setStateBar="false"></Realgrid>
        </div>
        <div class="flex items-center justify-start">※결재내역</div>
        <div class="h-full min-h-0 w-full overflow-hidden">
          <Realgrid
            :progname="'CRM02_002RPT_VUE_Popup'"
            :progid="3"
            :rowData="rowData4"
            :rowStateeditable="false"
            :setStateBar="false"></Realgrid>
        </div>
      </section>
    </div>
  </div>

  <CustomerSearch
    v-if="showCustPopup"
    join-sts="1"
    @strCCardID="onPickCard"
    @strCustName="onPickCustName"
    @lngCustNo="onPickCustNo"
    @closePopUp="showCustPopup = false"
  />
  <!-- 그리드 영역 -->
</template>

<script setup>
import {
  getCustPointInfo,
  getCustRecord,
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
import CustomerSearch from "@/components/customerSearch.vue";
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
import Swal from "sweetalert2";
/**
 * 	화면 Load시 실행 스크립트
 */

const store = useStore();

const crm02ControlBorder = "#cbd5e1";

onMounted(async () => {
  await insertPageLog(store.state.activeTab2);
  syncExcelListLabel();
});

const showCustPopup = ref(false);
const pickedCardDisplay = ref("");
const pickedCustName = ref("");
const searchNum = ref("");
const custID = ref();

const syncExcelListLabel = () => {
  selectedExcelList.value = pickedCustName.value
    ? `고객명: ${pickedCustName.value}`
    : "고객명:   ";
};

const openCustSearch = () => {
  showCustPopup.value = true;
};

const normalizeCardDisplay = (v) =>
  String(v ?? "")
    .replace(/[\[\]]/g, "")
    .trim();

const onPickCard = (v) => {
  searchNum.value = String(v ?? "").trim();
  pickedCardDisplay.value = normalizeCardDisplay(v);
  initGrid();
};

const onPickCustName = (v) => {
  pickedCustName.value = String(v ?? "").trim();
  syncExcelListLabel();
};

const onPickCustNo = (v) => {
  custID.value = v;
};

const resetCustPick = () => {
  searchNum.value = "";
  custID.value = "";
  pickedCardDisplay.value = "";
  pickedCustName.value = "";
  syncExcelListLabel();
  initGrid();
};

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

const rowData2 = ref([]);
const rowData3 = ref([]);
const rowData4 = ref([]);
const condValue = ref(0);
const cond = ref(false);
const cond2 = ref(false);
const datepicker = ref(null);
const closePopUp = ref(false);

const point1 = ref();
const point2 = ref();
const point3 = ref();
const point4 = ref();

watch(cond2, () => {
  if (cond2.value == true) {
    hideColumnsId.value = ["dtmAddDate", "lngReceipt", "strReason"];
  } else {
    hideColumnsId.value = [];
  }
  initGrid();
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
/**
 *  조회 함수
 */
const hideColumnsId = ref([]);
const searchButton = async () => {
  try {
    store.state.loading = true;
    initGrid();

    const res = await getCustRecord(
      store.state.userData.lngStoreGroup,
      searchNum.value,
      sDate.value,
      eDate.value,
      cond.value == true ? 1 : 0,
      cond2.value == true ? 1 : 0
    );
    if (custID.value != "" && custID.value != undefined) {
      const resPt = await getCustPointInfo(
        store.state.userData.lngStoreGroup,
        custID.value
      );

      point1.value = resPt.data.List[0].lngSalePoint;
      point2.value = resPt.data.List[0].lngUsedPoint;
      point3.value = resPt.data.List[0].lngRemPoint;
      point4.value = resPt.data.List[0].lngBonusPoint;
    }
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
    //comsole.log(error);
  } finally {
    store.state.loading = false;
  }
};

const clickedRowData = async (e) => {
  const res = await getReceiptDataDetail2(e[1], e[2], e[0]);
  ////console.log(res);
  rowData2.value = res.data.List;
  rowData3.value = res.data.List2;
  rowData4.value = res.data.List3;
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
  if (rowData2.value.length > 0) {
    rowData2.value = [];
  }
  if (rowData3.value.length > 0) {
    rowData3.value = [];
  }
  if (rowData4.value.length > 0) {
    rowData4.value = [];
  }
  point1.value = "";
  point2.value = "";
  point3.value = "";
  point4.value = "";
};

//엑셀 버튼 처리 함수
const exportExcel = ref(false);
/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  documentSubTitle.value = selectedDate.value + "\n" + selectedExcelList.value;

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

const setCond2 = (e) => {
  cond2.value = !cond2.value;
};
const setCond = (e) => {
  cond.value = !cond.value;
};
</script>

<style scoped>
/* 메인 그리드: 고정 vh 대신 뷰포트·노트북에 맞는 최소 높이 (MST/CRM10류) */
.crm02-main-grid-frame {
  min-height: min(65vh, 420px);
}

@media (max-height: 800px) {
  .crm02-main-grid-frame {
    min-height: min(52vh, 300px);
  }
}

.crm02-inline-lbl {
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(30 41 59);
  white-space: nowrap;
}

/* 1행 '기간' 라벨: 2행 .crm02-r2-cell 첫 열과 동일 폭 → 누적포인트 칸 왼쪽선과 일치 */
.crm02-r1-label-slot {
  display: grid;
  min-width: 0;
  min-height: 2rem;
  align-items: center;
  grid-template-columns: minmax(5.25rem, 6.75rem);
}

/* 2행: 4열 균등 + 셀 안 라벨|입력 2열 그리드(간격 통일) */
.crm02-search-r2 {
  align-items: stretch;
}

.crm02-r2-cell {
  display: grid;
  min-width: 0;
  min-height: 2rem;
  align-items: center;
  column-gap: 0.5rem;
  grid-template-columns: minmax(5.25rem, 6.75rem) minmax(0, 1fr);
}

.crm02-r2-label {
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

.crm02-date-field :deep(> div.flex.justify-start.items-center) {
  min-height: 2rem;
  align-items: center;
}

.crm02-cust-pick {
  min-width: 0;
}

.crm02-cust-pick-input {
  border: 1px solid var(--crm02-control-border) !important;
  box-sizing: border-box;
}

.crm02-cust-pick-btn {
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

.crm02-cust-pick-btn:hover {
  background-color: rgb(248 250 252);
}

.crm02-check-label {
  display: inline-flex;
  min-height: 2rem;
  cursor: pointer;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: rgb(55 65 81);
}

.crm02-check {
  height: 1rem;
  width: 1rem;
  flex-shrink: 0;
  border-radius: 0.25rem;
  border: 1px solid rgb(148 163 184);
}

.crm02-search-panel .crm02-sg-input {
  border: 1px solid var(--crm02-control-border) !important;
  box-sizing: border-box;
}

.crm02-search-panel .crm02-sg-input:focus {
  border-color: #3b82f6 !important;
}

/* 조회 결과 전용 — 비활성 톤 유지(브라우저 기본 흐림 완화) */
.crm02-search-panel .crm02-pt-readonly:disabled {
  cursor: default;
  opacity: 1;
}

.crm02-search-panel .crm02-date-field :deep(input[type="date"]) {
  border: 1px solid var(--crm02-control-border) !important;
  box-sizing: border-box;
}

.crm02-search-panel .crm02-date-field :deep(input[type="date"]:focus) {
  border-color: #3b82f6 !important;
}

@media (max-height: 900px) {
  .crm02-search-panel {
    margin-top: 0.25rem !important;
  }

  .crm02-search-r1,
  .crm02-search-r2 {
    padding-top: 0.5rem !important;
    padding-bottom: 0.5rem !important;
  }

  .crm02-search-r2 {
    gap: 0.5rem !important;
  }
}
</style>
