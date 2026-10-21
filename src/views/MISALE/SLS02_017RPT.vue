/*--############################################################################
# Filename : SLS02_017RPT.vue                                                  
# Description : 매출관리 > 매출 집계 현황 > 일일정산레포트                      
# Date :2025-05-14                                                             
# Author : 권맑음                     
################################################################################*/
<template>
  <!-- pl-5: 셸 w-right가 pl0이라 그리드가 좌측 메뉴에 붙음 → 우측 pd20과 맞춤 -->
  <div
    class="flex h-full min-h-0 flex-col overflow-hidden pl-5"
    @click="handleParentClick">
    <div
      class="flex w-full shrink-0 items-center justify-between overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center space-x-2 pr-5">
        <button type="button" @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <button type="button" @click="excelButton" class="button save w-auto excel">
          엑셀
        </button>
        <button type="button" @click="printButton" class="button print w-auto">
          인쇄
        </button>
      </div>
    </div>

    <div
      class="sls0217-search-panel z-10 mt-3 w-full min-h-0 shrink-0 overflow-visible rounded-lg bg-gray-200"
      :style="{
        '--sls0217-panel-pad-x': '2rem',
        '--sls0217-control-border': sls0217ControlBorder,
        '--sls0217-col-gutter': sls0217ColGutter,
        '--sls0217-row-gap': sls0217RowGap,
        '--sls0217-label-col': sls0217LabelCol,
      }">
      <div class="sls0217-search-layout min-w-0">
        <!-- 좌: 매출일자 / 지폐권종표시 -->
        <div class="sls0217-left-stack min-w-0">
          <div class="sls0217-row">
            <span class="sls0217-lbl shrink-0">매출일자</span>
            <div class="sls0217-date-slot min-w-0 flex-1">
              <Datepicker2
                ref="datepicker"
                omit-main-label
                filter-bar-align
                :mainName="'매출일자'"
                :closePopUp="closePopUp"
                @endDate="endDate"
                @startDate="startDate"
                @excelDate="excelDate" />
            </div>
          </div>
          <div class="sls0217-row">
            <span class="sls0217-lbl shrink-0">조회조건</span>
            <div class="sls0217-check-row min-w-0 flex-1">
              <label class="sls0217-check" for="bill">
                <input
                  id="bill"
                  type="checkbox"
                  @click="checkBill" />
                지폐권종표시
              </label>
            </div>
          </div>
        </div>

        <!-- 우: 매장 (단일·placeholder 선택 유지) -->
        <div class="sls0217-right-store min-w-0 overflow-visible">
          <PickStoreSingle2
            :placeholderName="'선택'"
            @lngStoreCode="lngStoreCode"
            @lngStoreGroup="lngStoreGroup"
            @excelStore="excelStore"
            @lngStoreAttrs="lngStoreAttrs"
            @lngStoreTeam="lngStoreTeam"
            @lngSupervisor="lngSupervisor" />
        </div>
      </div>
    </div>

    <!--
      그리드: 뷰포트에 억지로 끼우지 않고 고정 높이 + 페이지 스크롤.
      각 칸에 타이틀(|)을 두고 그리드와 겹치지 않게 분리.
    -->
    <div class="sls0217-body mt-3 min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto pr-2 pb-4">
      <!-- 1) 시간대별 (전체 폭) -->
      <section class="sls0217-section">
        <div class="sls0217-sec-hd">
          <h3 class="sls0217-sec-title">시간대별 내역</h3>
          <button
            type="button"
            class="sls0217-expand-btn"
            data-sls0217-expand="time"
            title="시간대별 내역 크게 보기"
            aria-label="시간대별 내역 크게 보기"
            @click="openExpand('time', $event)">
            <svg class="sls0217-expand-icon" viewBox="0 0 40 40" aria-hidden="true">
              <g fill="none" stroke="currentColor" stroke-width="2">
                <rect x="10" y="10" width="20" height="20" />
                <path d="M19.13 26.01h-5.26v-5.09" />
                <path d="M13.87 26.01l5.26-5.26" />
                <path d="M20.87 13.99h5.26v5.09" />
                <path d="M26.13 13.99l-5.26 5.26" />
              </g>
            </svg>
            <span class="sls0217-expand-tip" role="tooltip">시간대별 내역 크게 보기</span>
          </button>
        </div>
        <div class="sls0217-grid-mount sls0217-grid-mount--time">
          <Realgrid
            class="h-full min-h-0 w-full"
            :progname="'SLS02_017RPT_VUE'"
            :progid="1"
            :rowData="rowData"
            :reload="reload"
            :exporttoExcel="exportExcel"
            :documentSubTitle="documentSubTitle"
            :documentTitle="'SLS06_005RPT'"
            :getJson="getJson"
            :rowStateeditable="false"
            @getJsonData="getJsonData" />
        </div>
      </section>

      <!-- 2) 매출세부 | 메뉴그룹 -->
      <div class="sls0217-pair">
        <section class="sls0217-section">
          <div class="sls0217-sec-hd">
            <h3 class="sls0217-sec-title">매출세부내역</h3>
            <button
              type="button"
              class="sls0217-expand-btn"
              data-sls0217-expand="sales"
              title="매출세부내역 크게 보기"
              aria-label="매출세부내역 크게 보기"
              @click="openExpand('sales', $event)">
              <svg class="sls0217-expand-icon" viewBox="0 0 40 40" aria-hidden="true">
                <g fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="10" y="10" width="20" height="20" />
                  <path d="M19.13 26.01h-5.26v-5.09" />
                  <path d="M13.87 26.01l5.26-5.26" />
                  <path d="M20.87 13.99h5.26v5.09" />
                  <path d="M26.13 13.99l-5.26 5.26" />
                </g>
              </svg>
              <span class="sls0217-expand-tip" role="tooltip">매출세부내역 크게 보기</span>
            </button>
          </div>
          <div class="sls0217-grid-mount sls0217-grid-mount--pair">
            <Realgrid
              class="h-full min-h-0 w-full"
              :progname="'SLS02_017RPT_VUE'"
              :progid="2"
              :rowData="rowData2"
              :reload="reload"
              :exporttoExcel="exportExcel"
              :documentSubTitle="documentSubTitle"
              :documentTitle="'SLS06_005RPT'"
              :getJson="getJson"
              :rowStateeditable="false"
              @getJsonData="getJsonData2" />
          </div>
        </section>
        <section class="sls0217-section">
          <div class="sls0217-sec-hd">
            <h3 class="sls0217-sec-title">메뉴그룹별내역</h3>
            <button
              type="button"
              class="sls0217-expand-btn"
              data-sls0217-expand="menu"
              title="메뉴그룹별내역 크게 보기"
              aria-label="메뉴그룹별내역 크게 보기"
              @click="openExpand('menu', $event)">
              <svg class="sls0217-expand-icon" viewBox="0 0 40 40" aria-hidden="true">
                <g fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="10" y="10" width="20" height="20" />
                  <path d="M19.13 26.01h-5.26v-5.09" />
                  <path d="M13.87 26.01l5.26-5.26" />
                  <path d="M20.87 13.99h5.26v5.09" />
                  <path d="M26.13 13.99l-5.26 5.26" />
                </g>
              </svg>
              <span class="sls0217-expand-tip" role="tooltip">메뉴그룹별내역 크게 보기</span>
            </button>
          </div>
          <div class="sls0217-grid-mount sls0217-grid-mount--pair">
            <Realgrid
              class="h-full min-h-0 w-full"
              :progname="'SLS02_017RPT_VUE'"
              :progid="5"
              :rowData="rowData5"
              :reload="reload"
              :exporttoExcel="exportExcel"
              :documentSubTitle="documentSubTitle"
              :documentTitle="'SLS06_005RPT'"
              :rowStateeditable="false"
              :getJson="getJson"
              @getJsonData="getJsonData5" />
          </div>
        </section>
      </div>

      <!-- 3) 현금정산 | 신용카드 (기존 비율상 더 높게) -->
      <div class="sls0217-pair">
        <section class="sls0217-section">
          <div class="sls0217-sec-hd">
            <h3 class="sls0217-sec-title">현금정산내역</h3>
            <button
              type="button"
              class="sls0217-expand-btn"
              data-sls0217-expand="cash"
              title="현금정산내역 크게 보기"
              aria-label="현금정산내역 크게 보기"
              @click="openExpand('cash', $event)">
              <svg class="sls0217-expand-icon" viewBox="0 0 40 40" aria-hidden="true">
                <g fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="10" y="10" width="20" height="20" />
                  <path d="M19.13 26.01h-5.26v-5.09" />
                  <path d="M13.87 26.01l5.26-5.26" />
                  <path d="M20.87 13.99h5.26v5.09" />
                  <path d="M26.13 13.99l-5.26 5.26" />
                </g>
              </svg>
              <span class="sls0217-expand-tip" role="tooltip">현금정산내역 크게 보기</span>
            </button>
          </div>
          <div class="sls0217-grid-mount sls0217-grid-mount--cash">
            <Realgrid
              class="h-full min-h-0 w-full"
              :progname="'SLS02_017RPT_VUE'"
              :progid="3"
              :rowData="rowData3"
              :getJson="getJson"
              :rowStateeditable="false"
              @getJsonData="getJsonData3" />
          </div>
        </section>
        <section class="sls0217-section">
          <div class="sls0217-sec-hd">
            <h3 class="sls0217-sec-title">신용카드별내역</h3>
            <button
              type="button"
              class="sls0217-expand-btn"
              data-sls0217-expand="card"
              title="신용카드별내역 크게 보기"
              aria-label="신용카드별내역 크게 보기"
              @click="openExpand('card', $event)">
              <svg class="sls0217-expand-icon" viewBox="0 0 40 40" aria-hidden="true">
                <g fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="10" y="10" width="20" height="20" />
                  <path d="M19.13 26.01h-5.26v-5.09" />
                  <path d="M13.87 26.01l5.26-5.26" />
                  <path d="M20.87 13.99h5.26v5.09" />
                  <path d="M26.13 13.99l-5.26 5.26" />
                </g>
              </svg>
              <span class="sls0217-expand-tip" role="tooltip">신용카드별내역 크게 보기</span>
            </button>
          </div>
          <div class="sls0217-grid-mount sls0217-grid-mount--cash">
            <Realgrid
              class="h-full min-h-0 w-full"
              :progname="'SLS02_017RPT_VUE'"
              :progid="6"
              :rowData="rowData6"
              :getJson="getJson"
              :rowStateeditable="false"
              @getJsonData="getJsonData6" />
          </div>
        </section>
      </div>

      <!-- 4) 매출취소 | 개점/마감 -->
      <div class="sls0217-pair">
        <section class="sls0217-section">
          <div class="sls0217-sec-hd">
            <h3 class="sls0217-sec-title">매출취소내역</h3>
            <button
              type="button"
              class="sls0217-expand-btn"
              data-sls0217-expand="cancel"
              title="매출취소내역 크게 보기"
              aria-label="매출취소내역 크게 보기"
              @click="openExpand('cancel', $event)">
              <svg class="sls0217-expand-icon" viewBox="0 0 40 40" aria-hidden="true">
                <g fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="10" y="10" width="20" height="20" />
                  <path d="M19.13 26.01h-5.26v-5.09" />
                  <path d="M13.87 26.01l5.26-5.26" />
                  <path d="M20.87 13.99h5.26v5.09" />
                  <path d="M26.13 13.99l-5.26 5.26" />
                </g>
              </svg>
              <span class="sls0217-expand-tip" role="tooltip">매출취소내역 크게 보기</span>
            </button>
          </div>
          <div class="sls0217-grid-mount sls0217-grid-mount--pair60">
            <Realgrid
              class="h-full min-h-0 w-full"
              :progname="'SLS02_017RPT_VUE'"
              :progid="4"
              :rowData="rowData4"
              :getJson="getJson"
              :rowStateeditable="false"
              @getJsonData="getJsonData4" />
          </div>
        </section>
        <section class="sls0217-section">
          <div class="sls0217-sec-hd">
            <h3 class="sls0217-sec-title">개점/마감내역</h3>
            <button
              type="button"
              class="sls0217-expand-btn"
              data-sls0217-expand="openclose"
              title="개점/마감내역 크게 보기"
              aria-label="개점/마감내역 크게 보기"
              @click="openExpand('openclose', $event)">
              <svg class="sls0217-expand-icon" viewBox="0 0 40 40" aria-hidden="true">
                <g fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="10" y="10" width="20" height="20" />
                  <path d="M19.13 26.01h-5.26v-5.09" />
                  <path d="M13.87 26.01l5.26-5.26" />
                  <path d="M20.87 13.99h5.26v5.09" />
                  <path d="M26.13 13.99l-5.26 5.26" />
                </g>
              </svg>
              <span class="sls0217-expand-tip" role="tooltip">개점/마감내역 크게 보기</span>
            </button>
          </div>
          <div class="sls0217-grid-mount sls0217-grid-mount--pair60">
            <Realgrid
              class="h-full min-h-0 w-full"
              :progname="'SLS02_017RPT_VUE'"
              :progid="7"
              :rowData="rowData7"
              :getJson="getJson"
              :rowStateeditable="false"
              @getJsonData="getJsonData7" />
          </div>
        </section>
      </div>
    </div>
  </div>

  <ReportPrintShell
    v-model:open="printPreviewOpen"
    title="일일 정산 레포트 인쇄 미리보기"
    :pages="printPages"
    :loading="printLoading"
    :extra-print-css="sls0217PrintCss"
    extra-print-css-id="sls0217-sheet-styles">
    <template #page="{ page }">
      <DailySettlementPrintSheet :page="page" />
    </template>
  </ReportPrintShell>

  <!-- 크게 보기 — 발주등록II / 매출분석 대시보드 FLIP 애니메이션 -->
  <Teleport to="body">
    <div
      v-if="expandOpen && expandView"
      ref="expandOverlayEl"
      class="sls0217-expand-overlay"
      :class="{ 'sls0217-expand-overlay--dim': expandOverlayDim }"
      @mousedown.self="closeExpand">
      <div
        ref="expandDialogEl"
        class="sls0217-expand-dialog"
        role="dialog"
        aria-modal="true"
        :aria-label="`${expandView.title} 크게 보기`"
        :style="expandPop.style"
        @mousedown.stop
        @keydown.esc="closeExpand">
        <div class="sls0217-expand-hd" @mousedown="onExpandHeadDown">
          <div class="sls0217-expand-hd-lead">
            <h2 class="sls0217-expand-title">{{ expandView.title }}</h2>
            <div class="sls0217-expand-meta" aria-label="조회 조건">
              <span class="sls0217-expand-meta-item">
                <em>매장</em>{{ expandStoreText }}
              </span>
              <span class="sls0217-expand-meta-item">
                <em>기간</em>{{ expandPeriodText }}
              </span>
              <span class="sls0217-expand-meta-item">
                <em>조회시간</em>{{ expandSearchAtText }}
              </span>
            </div>
          </div>
          <div class="sls0217-expand-hd-actions" @mousedown.stop>
            <button type="button" class="pnc-sub-btn pnc-sub-btn--gray" @click="closeExpand">
              <svg class="pnc-sub-btn__icon" viewBox="0 0 16 16" aria-hidden="true">
                <path
                  d="M4.2 4.2l7.6 7.6M11.8 4.2l-7.6 7.6"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.7"
                  stroke-linecap="round" />
              </svg>
              닫기
            </button>
          </div>
        </div>
        <div class="sls0217-expand-body">
          <div
            v-if="!expandHasRows"
            class="sls0217-expand-empty"
            role="status">
            조회된 내역이 없습니다.
          </div>
          <Realgrid
            v-else
            :key="'sls0217-expand-' + expandKey"
            class="h-full min-h-0 w-full"
            :progname="'SLS02_017RPT_VUE'"
            :progid="expandView.progid"
            :rowData="expandRows"
            :rowStateeditable="false"
            :documentTitle="'SLS02_017RPT'" />
        </div>
        <div
          class="sls0217-expand-resize"
          title="크기 조절"
          @mousedown.stop="expandPop.startResize"></div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { getSalesDayReport } from "@/api/misales";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

import Datepicker2 from "@/components/Datepicker2.vue";
/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
/**
 *  매장  단일 선택 컴포넌트
 *  */

import PickStoreSingle2 from "@/components/pickStoreSingle.vue";
/**
 * 	그리드 생성
 */

import Realgrid from "@/components/realgrid.vue";
import ReportPrintShell from "@/components/reportPrint/ReportPrintShell.vue";
import { loadDailySettlementPrintPages } from "@/components/reportPrint/loadDailySettlementPrintPages";
import { SLS0217_SHEET_CSS } from "@/components/reportPrint/sls0217SheetStyles";
import DailySettlementPrintSheet from "@/components/reportPrint/sheets/DailySettlementPrintSheet.vue";
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

import { computed, nextTick, onMounted, ref } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";

/**
 *  엑셀 내보내기 관련 라이브러리
 */

import { utils, writeFile } from "xlsx-js-style";
/**
 *  크게 보기 팝업 — 드래그·리사이즈 (발주등록II / 출고등록과 동일)
 */

import { useFloatPopup } from "@/utils/floatPopup";

/** 조회 AREA — SLS02_014 / SLS06_001 반응형 패턴 */
const sls0217ControlBorder = "#cbd5e1";
const sls0217ColGutter = "1.25rem";
const sls0217RowGap = "0.875rem";
const sls0217LabelCol = "5.5rem";

/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
});

/** Datepicker excelDate — 기존 이벤트 연결 유지 */
const excelDate = () => {};

const excelstore = ref();
const selectedGroup = ref();
const selectedStore = ref();
const selectedStoreAttr = ref();
const selectedStoreTeam = ref();
const selectedStoreSuperVisor = ref();

const getJson = ref(false);

/**
 * 페이지 매장 그룹 세팅
 */

const lngStoreGroup = (e) => {
  selectedGroup.value = e;
  //comsole.log(e);
};
/**
 * 페이지 매장 코드 세팅
 */

const lngStoreCode = (e) => {
  initGrid();
  selectedStore.value = e;
  //comsole.log(e);
};

/**
 * 페이지 매장 분류 세팅
 */

const lngStoreAttrs = (e) => {
  initGrid();
  selectedStoreAttr.value = e;
};
/**
 * 페이지 매장 팀 세팅
 */

const lngStoreTeam = (e) => {
  initGrid();
  selectedStoreTeam.value = e;
};
/**
 * 페이지 매장 슈퍼바이저 세팅
 */

const lngSupervisor = (e) => {
  initGrid();
  selectedStoreSuperVisor.value = e;
};
/**
 * 엑셀용 매장 세팅 함수
 */

const excelStore = (e) => {
  excelstore.value = e;
};

const receiptNo = ref();

const store = useStore();
const loginedlngLang = store.state.userData.lngLanguage;
//comsole.log(store);
const selectedstartDate = ref();
const selectedendDate = ref();
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
const afterSearch = ref(false);
/**
 *  조회 함수
 */

const searchButton = async () => {
  // initCheckBox.value = !initCheckBox.value
  // initSearchWord.value = !initSearchWord.value
  if (selectedStore.value == 0) {
    Swal.fire({
      title: "경고",
      text: "매장을 선택하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  store.state.loading = true;
  try {
    initGrid();
    const res = await getSalesDayReport(
      selectedGroup.value,
      selectedStore.value,
      selectedstartDate.value,
      selectedendDate.value,
      whetherBill.value,
      loginedlngLang
    );
    //comsole.log(res);

    rowData.value = res.data.TIMELIST;
    rowData2.value = res.data.SALESDATA1;
    rowData3.value = res.data.SALESDATA1_2;
    rowData4.value = res.data.SALESDATA2;
    rowData5.value = res.data.SALESDATA3;
    rowData6.value = res.data.SALESDATA4;
    rowData7.value = res.data.SALESDATA5;
    afterSearch.value = true;
    lastSearchAt.value = new Date();
  } catch (error) {
    afterSearch.value = false;
  } finally {
    store.state.loading = false;
  }
};

/** 마지막 조회 시각 — 크게 보기 팝업·인쇄·엑셀 메타용 */
const lastSearchAt = ref(null);

const formatSearchAt = (d) => {
  if (!d || !(d instanceof Date) || Number.isNaN(d.getTime())) return "—";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${y}-${m}-${day} ${hh}:${mm}:${ss}`;
};

const rowData = ref([]);
const rowData2 = ref([]);
const rowData3 = ref([]);
const rowData4 = ref([]);
const rowData5 = ref([]);
const rowData6 = ref([]);
const rowData7 = ref([]);

const exportExcel1 = ref();
const exportExcel2 = ref();
const exportExcel3 = ref();
const exportExcel4 = ref();
const exportExcel5 = ref();
const exportExcel6 = ref();
const exportExcel7 = ref();

const getJsonData = (e) => {
  exportExcel1.value = e;
};
const getJsonData2 = (e) => {
  exportExcel2.value = e;
};
const getJsonData3 = (e) => {
  exportExcel3.value = e;
};
const getJsonData4 = (e) => {
  exportExcel4.value = e;
};
const getJsonData5 = (e) => {
  exportExcel5.value = e;
};
const getJsonData6 = (e) => {
  exportExcel6.value = e;
};
const getJsonData7 = (e) => {
  exportExcel7.value = e;
};

const exceloutput = ref(false);
/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 진행해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  getJson.value = !getJson.value;
  setTimeout(() => {
    const wb = utils.book_new();
    const ws = utils.aoa_to_sheet([]);

    ws["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 9 } }, // A1~J1 병합
      { s: { r: 2, c: 7 }, e: { r: 4, c: 9 } },
    ]; //A1~ j1 병합

    utils.sheet_add_aoa(ws, [["일일 정산 레포트"]], { origin: "A1" });

    //utils.sheet_add_aoa(ws, [['조회기간 :' + selectedstartDate.value + "~" + selectedendDate.value +'\n'+excelstore.value ]], { origin: "H3" });

    utils.sheet_add_aoa(
      ws,
      [
        [
          "시간대",
          "조수",
          "조수누계",
          "객수",
          "객수누계",
          "매출액",
          "매출액누계",
          "객단가",
          "객단가누계",
          "비율",
        ],
      ],
      { origin: "A8" }
    );

    exportExcel1.value = exportExcel1.value.map((item) => ({
      ...item,
      dblDistRate: new Intl.NumberFormat("ko-KR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(item.dblDistRate),
    }));
    utils.sheet_add_json(ws, exportExcel1.value, {
      origin: "A9",
      skipHeader: true,
    });

    const firstTableRows = exportExcel1.value.length + 10;

    const subtitle = "A" + (firstTableRows + 1);

    const secondTableStartRow = firstTableRows + 2;
    const origin = "A" + secondTableStartRow;
    const origin2 = "A" + (secondTableStartRow + 1); // exportExcel2.value.length
    utils.sheet_add_aoa(ws, [["세부항목", "건수", "금액", "비율"]], {
      origin: origin,
    });
    utils.sheet_add_json(ws, exportExcel2.value, {
      origin: origin2,
      skipHeader: true,
    });

    const thirdTableRows = secondTableStartRow + exportExcel2.value.length + 2;
    const subtitle2 = "A" + (thirdTableRows + 1);
    const origin3 = "A" + (thirdTableRows + 2);
    const origin4 = "A" + (thirdTableRows + 3);
    utils.sheet_add_aoa(ws, [["정산항목", "건수", "금액", "비율"]], {
      origin: origin3,
    });
    utils.sheet_add_json(ws, exportExcel3.value, {
      origin: origin4,
      skipHeader: true,
    });

    const fourthTableRows = thirdTableRows + exportExcel3.value.length + 2;
    const subtitle3 = "A" + (fourthTableRows + 2);
    const origin5 = "A" + (fourthTableRows + 3);
    const origin6 = "A" + (fourthTableRows + 4);

    utils.sheet_add_aoa(ws, [["취소항목", "건수", "금액"]], {
      origin: origin5,
    });
    utils.sheet_add_json(ws, exportExcel4.value, {
      origin: origin6,
      skipHeader: true,
    });

    const origin7 = "G" + secondTableStartRow;
    const origin8 = "G" + (secondTableStartRow + 1);
    const subtitle4 = "G" + (secondTableStartRow - 1);

    utils.sheet_add_aoa(ws, [["메뉴그룹명", "건수", "금액", "비율"]], {
      origin: origin7,
    });

    exportExcel5.value = exportExcel5.value.map((item) => ({
      ...item,
      dblRate: new Intl.NumberFormat("ko-KR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(item.dblRate),
    }));
    utils.sheet_add_json(ws, exportExcel5.value, {
      origin: origin8,
      skipHeader: true,
    });

    const fifthTableRows = secondTableStartRow + exportExcel5.value.length + 2;
    const origin9 = "G" + (fifthTableRows + 1);
    const origin10 = "G" + (fifthTableRows + 2);
    const subtitle5 = "G" + fifthTableRows;

    utils.sheet_add_aoa(ws, [["카드사명", "건수", "금액", "비율"]], {
      origin: origin9,
    });

    exportExcel6.value = exportExcel6.value.map((item) => ({
      ...item,
      dblRate: new Intl.NumberFormat("ko-KR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(item.dblRate),
    }));
    utils.sheet_add_json(ws, exportExcel6.value, {
      origin: origin10,
      skipHeader: true,
    });

    const lastTableRows = fifthTableRows + exportExcel6.value.length + 2;
    const origin11 = "G" + (lastTableRows + 2);
    const origin12 = "G" + (lastTableRows + 3);
    const subtitle6 = "G" + (lastTableRows + 1);

    utils.sheet_add_aoa(ws, [["세션구분", "포스", "작업시간", "담당자명"]], {
      origin: origin11,
    });

    utils.sheet_add_json(ws, exportExcel7.value, {
      origin: origin12,
      skipHeader: true,
    });

    /** 숫자 셀만 오른쪽 — [총매출계] 등 라벨은 항상 왼쪽 (옛 exceptionCenter A1.. 오탐 제거) */
    const isNumericExcelCell = (c) => {
      if (!c) return false;
      if (c.t === "n") return true;
      const v = c.v;
      if (typeof v === "number") return Number.isFinite(v);
      if (typeof v !== "string") return false;
      const s = v.trim().replace(/,/g, "");
      if (!s) return false;
      return Number.isFinite(Number(s));
    };

    for (const cell in ws) {
      if (cell[0] === "!") continue; // 스페셜 키는 건너뛰기

      const num = isNumericExcelCell(ws[cell]);
      ws[cell].s = {
        font: {
          name: "맑은 고딕",
          sz: 12,
          bold: false,
          color: { rgb: "000000" },
        },
        alignment: {
          horizontal: num ? "right" : "left",
          vertical: "center",
        },
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } },
        },
      };
      if (ws[cell].t === "n") {
        ws[cell].z = "#,##0";
      }
    }
    ws["A1"].s = {
      font: {
        bold: true, // 굵게
        sz: 25, // 폰트 크기
      },
      alignment: {
        horizontal: "center", // 가로 중앙 정렬
        vertical: "center", // 세로 중앙 정렬
      },
    };

    utils.sheet_add_aoa(ws, [["○시간대별 매출 내역"]], { origin: "A7" });
    utils.sheet_add_aoa(ws, [["○매출 세부 내역"]], { origin: subtitle });
    utils.sheet_add_aoa(ws, [["○현금 정산 내역"]], { origin: subtitle2 });
    utils.sheet_add_aoa(ws, [["○매출 취소 내역"]], { origin: subtitle3 });
    utils.sheet_add_aoa(ws, [["○메뉴 그룹별 내역"]], { origin: subtitle4 });
    utils.sheet_add_aoa(ws, [["○신용카드 별 내역"]], { origin: subtitle5 });
    utils.sheet_add_aoa(ws, [["○개점/마감내역"]], { origin: subtitle6 });

    const range6 = [
      "A8",
      "B8",
      "C8",
      "D8",
      "E8",
      "F8",
      "G8",
      "H8",
      "I8",
      "J8",
      "A" + secondTableStartRow,
      "B" + secondTableStartRow,
      "C" + secondTableStartRow,
      "D" + secondTableStartRow,
      "A" + (thirdTableRows + 2),
      "B" + (thirdTableRows + 2),
      "C" + (thirdTableRows + 2),
      "D" + (thirdTableRows + 2),
      "A" + (fourthTableRows + 3),
      "B" + (fourthTableRows + 3),
      "C" + (fourthTableRows + 3),
      "G" + secondTableStartRow,
      "H" + secondTableStartRow,
      "I" + secondTableStartRow,
      "J" + secondTableStartRow,
      "G" + (fifthTableRows + 1),
      "H" + (fifthTableRows + 1),
      "I" + (fifthTableRows + 1),
      "J" + (fifthTableRows + 1),
      "G" + (lastTableRows + 2),
      "H" + (lastTableRows + 2),
      "I" + (lastTableRows + 2),
      "J" + (lastTableRows + 2),
    ];
    range6.forEach((cell) => {
      ws[cell].s = {
        font: {
          name: "맑은 고딕", // 폰트 이름
          sz: 12, // 폰트 크기
          bold: true, // 굵게 여부
          color: { rgb: "000000" }, // 폰트 색상 (검정)
        },
        alignment: {
          horizontal: "center", // 가로 중앙 정렬
          vertical: "center", // 세로 중앙 정렬
        },
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } },
        },
      };
    });

    ws["!cols"] = [
      { wch: 30 }, // A열 너비: 30문자
      { wch: 10 }, // B열 너비: 15문자
      { wch: 15 }, // C열 너비: 20문자
      { wch: 10 }, // D열 너비: 20문자
      { wch: 15 }, // E열 너비: 20문자
      { wch: 15 }, // F열 너비: 20문자
      { wch: 30 }, // G열 너비: 20문자
      { wch: 15 }, // H열 너비: 20문자
      { wch: 25 }, // I열 너비: 20문자
      { wch: 15 }, // I열 너비: 20문자
    ];

    // H3 셀 — 조회기간 / 조회일시 / 매장명
    const cellAddress = "H3";
    const cell = ws[cellAddress] || {};
    cell.v = [
      `조회기간 : ${selectedstartDate.value || ""} ~ ${selectedendDate.value || ""}`,
      `조회일시 : ${formatSearchAt(lastSearchAt.value)}`,
      `매장명 : ${excelstore.value || ""}`,
    ].join("\n");
    cell.s = {
      alignment: {
        horizontal: "left",
        vertical: "top",
        wrapText: true,
      },
    };
    ws[cellAddress] = cell;

    utils.book_append_sheet(wb, ws, "Sheet1");

    writeFile(wb, "일일 정산 레포트.xlsx");
  }, 100);
};

/**
 * 인쇄 — 발주서와 동일하게 A4 측정 분할 (행 중간 끊김 없음)
 */
const printPreviewOpen = ref(false);
const printLoading = ref(false);
const printPages = ref([]);
const sls0217PrintCss = SLS0217_SHEET_CSS;

const printButton = async () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 진행해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  printPreviewOpen.value = true;
  printLoading.value = true;
  printPages.value = [];
  try {
    const periodText = `${selectedstartDate.value || ""} ~ ${
      selectedendDate.value || ""
    }`;
    const storeText = String(excelstore.value || "").trim();
    const searchAtText = formatSearchAt(lastSearchAt.value);
    printPages.value = loadDailySettlementPrintPages({
      periodText,
      searchAtText,
      storeText,
      timeRows: rowData.value,
      salesRows: rowData2.value,
      menuRows: rowData5.value,
      cashRows: rowData3.value,
      cardRows: rowData6.value,
      cancelRows: rowData4.value,
      openCloseRows: rowData7.value,
    });
    if (!printPages.value.length) {
      printPreviewOpen.value = false;
      await Swal.fire({
        title: "경고",
        text: "출력할 데이터가 없습니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
    }
  } catch (e) {
    console.error("[SLS02_017RPT] printButton", e);
    printPreviewOpen.value = false;
    await Swal.fire({
      title: "오류",
      text: "인쇄 미리보기를 준비하는 중 오류가 발생했습니다.",
      icon: "error",
      confirmButtonText: "확인",
    });
  } finally {
    printLoading.value = false;
  }
};

// 바이너리 문자열을 ArrayBuffer로 변환하는 함수
// function s2ab(s) {
//   const buf = new ArrayBuffer(s.length);
//   const view = new Uint8Array(buf);
//   for (let i = 0; i < s.length; i++) {
//     view[i] = s.charCodeAt(i) & 0xFF;
//   }
//   return buf;
// }

/**
 * 그리드 초기화
 */

const initGrid = () => {
  if (rowData.value.length != 0) {
    rowData.value = [];
  }
  if (rowData2.value.length != 0) {
    rowData2.value = [];
  }
  if (rowData3.value.length != 0) {
    rowData3.value = [];
  }
  if (rowData4.value.length != 0) {
    rowData4.value = [];
  }
  if (rowData5.value.length != 0) {
    rowData5.value = [];
  }
  if (rowData6.value.length != 0) {
    rowData6.value = [];
  }
  if (rowData7.value.length != 0) {
    rowData7.value = [];
  }
};
const whetherBill = ref(0);
const checkBill = (e) => {
  if (e.target.checked) {
    whetherBill.value = "1";
  } else {
    whetherBill.value = "0";
  }
};

const closePopUp = ref(false);
const datepicker = ref(null);
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

/** 섹션별 크게 보기 — PUR03_006 / SalesAnalysisDashboard 패턴 */
const EXPAND_META = {
  time: { title: "시간대별 내역", progid: 1 },
  sales: { title: "매출세부내역", progid: 2 },
  menu: { title: "메뉴그룹별내역", progid: 5 },
  cash: { title: "현금정산내역", progid: 3 },
  card: { title: "신용카드별내역", progid: 6 },
  cancel: { title: "매출취소내역", progid: 4 },
  openclose: { title: "개점/마감내역", progid: 7 },
};

const expandOpen = ref(false);
const expandKey = ref("");
const expandOverlayDim = ref(false);
const expandOverlayEl = ref(null);
const expandDialogEl = ref(null);
let expandOriginRect = null;
let expandLeaving = false;

const EXPAND_FLIP_MS_IN = 820;
const EXPAND_FLIP_MS_OUT = 640;

const expandPop = useFloatPopup({
  width: 1120,
  height: 680,
  minWidth: 640,
  minHeight: 360,
  maxWidthRatio: 0.92,
  maxHeightRatio: 0.88,
});

const expandView = computed(() => EXPAND_META[expandKey.value] || null);

const expandStoreText = computed(() => {
  const s = String(excelstore.value || "").trim();
  return s || "—";
});

const expandPeriodText = computed(() => {
  const a = selectedstartDate.value || "";
  const b = selectedendDate.value || "";
  if (!a && !b) return "—";
  return `${a} ~ ${b}`;
});

const expandSearchAtText = computed(() => formatSearchAt(lastSearchAt.value));

const expandRows = computed(() => {
  switch (expandKey.value) {
    case "time":
      return rowData.value;
    case "sales":
      return rowData2.value;
    case "menu":
      return rowData5.value;
    case "cash":
      return rowData3.value;
    case "card":
      return rowData6.value;
    case "cancel":
      return rowData4.value;
    case "openclose":
      return rowData7.value;
    default:
      return [];
  }
});

const expandHasRows = computed(
  () => Array.isArray(expandRows.value) && expandRows.value.length > 0
);

const prefersExpandReducedMotion = () => {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

const readExpandOriginFromEvent = (e) => {
  const t = e?.currentTarget;
  if (!t || typeof t.getBoundingClientRect !== "function") return null;
  const r = t.getBoundingClientRect();
  if (!r.width || !r.height) return null;
  return { left: r.left, top: r.top, width: r.width, height: r.height };
};

const readExpandOriginByKey = (key) => {
  if (typeof document === "undefined" || !key) return expandOriginRect;
  const btn = document.querySelector(`[data-sls0217-expand="${key}"]`);
  if (!btn || typeof btn.getBoundingClientRect !== "function") return expandOriginRect;
  const r = btn.getBoundingClientRect();
  if (!r.width || !r.height) return expandOriginRect;
  return { left: r.left, top: r.top, width: r.width, height: r.height };
};

const clearExpandDialogMotion = (dialog) => {
  if (!dialog) return;
  dialog.style.transition = "";
  dialog.style.transform = "";
  dialog.style.transformOrigin = "";
  dialog.style.opacity = "";
  dialog.style.willChange = "";
};

const waitExpandFlip = (el, ms) =>
  new Promise((resolve) => {
    if (!el) {
      resolve();
      return;
    }
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      el.removeEventListener("transitionend", onEnd);
      resolve();
    };
    const onEnd = (ev) => {
      if (ev.target !== el) return;
      if (ev.propertyName === "transform" || ev.propertyName === "opacity") finish();
    };
    el.addEventListener("transitionend", onEnd);
    setTimeout(finish, ms + 40);
  });

const nextExpandFrames = (count = 2) =>
  new Promise((resolve) => {
    if (typeof window === "undefined" || !window.requestAnimationFrame) {
      resolve();
      return;
    }
    let left = Math.max(1, count);
    const step = () => {
      left -= 1;
      if (left <= 0) resolve();
      else window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  });

const computeExpandFlip = (dialog, origin, dir) => {
  if (!dialog || !origin) return null;
  const last = dialog.getBoundingClientRect();
  if (!last.width || !last.height) return null;
  const ox = origin.left + origin.width / 2 - last.left;
  const oy = origin.top + origin.height / 2 - last.top;
  const sW = origin.width / last.width;
  const sH = origin.height / last.height;
  const sFit = Math.max(0.05, Math.min(sW, sH));
  const s =
    dir === "in"
      ? Math.min(0.03, Math.max(0.012, sFit * 0.2))
      : Math.max(0.06, Math.sqrt(Math.max(0.0001, sW * sH)));
  return { ox, oy, s };
};

const runExpandFlip = async (dir) => {
  const dialog = expandDialogEl.value;
  if (!dialog) return false;
  if (prefersExpandReducedMotion()) return false;
  const origin =
    dir === "out" ? readExpandOriginByKey(expandKey.value) : expandOriginRect;
  const flip = computeExpandFlip(dialog, origin, dir);
  if (!flip) return false;

  const ms = dir === "in" ? EXPAND_FLIP_MS_IN : EXPAND_FLIP_MS_OUT;
  const ease =
    dir === "in"
      ? "cubic-bezier(0.22, 1, 0.36, 1)"
      : "cubic-bezier(0.4, 0, 0.2, 1)";
  const from = `scale(${flip.s})`;
  const to = "scale(1)";

  dialog.style.transformOrigin = `${flip.ox}px ${flip.oy}px`;
  dialog.style.willChange = "transform, opacity";

  if (dir === "in") {
    dialog.style.transition = "none";
    dialog.style.opacity = "0";
    dialog.style.transform = from;
    expandOverlayDim.value = false;
    void dialog.offsetWidth;
    await nextExpandFrames(2);
    dialog.style.opacity = "0.92";
    dialog.style.transition = `transform ${ms}ms ${ease}, opacity ${Math.round(ms * 0.75)}ms ease-out`;
    void dialog.offsetWidth;
    dialog.style.transform = to;
    dialog.style.opacity = "1";
    expandOverlayDim.value = true;
    await waitExpandFlip(dialog, ms);
    clearExpandDialogMotion(dialog);
  } else {
    dialog.style.transition = "none";
    dialog.style.transform = to;
    dialog.style.opacity = "1";
    void dialog.offsetWidth;
    await nextExpandFrames(1);
    dialog.style.transition = `transform ${ms}ms ${ease}, opacity ${Math.round(ms * 0.85)}ms ease-in`;
    dialog.style.transform = from;
    dialog.style.opacity = "0.72";
    expandOverlayDim.value = false;
    await waitExpandFlip(dialog, ms);
    clearExpandDialogMotion(dialog);
  }
  return true;
};

const openExpand = async (key, event) => {
  if (!EXPAND_META[key] || expandLeaving) return;
  expandOriginRect = readExpandOriginFromEvent(event);
  expandKey.value = key;
  expandPop.place();
  expandOverlayDim.value =
    !expandOriginRect || prefersExpandReducedMotion();
  expandOpen.value = true;
  await nextTick();
  const dialog = expandDialogEl.value;
  if (dialog && expandOriginRect && !prefersExpandReducedMotion()) {
    dialog.style.transition = "none";
    dialog.style.opacity = "0";
  }
  try {
    const flipped = await runExpandFlip("in");
    if (!flipped) expandOverlayDim.value = true;
  } catch (_) {
    expandOverlayDim.value = true;
    clearExpandDialogMotion(dialog);
  }
};

const closeExpand = async () => {
  if (!expandOpen.value || expandLeaving) return;
  expandLeaving = true;
  try {
    await runExpandFlip("out");
  } catch (_) {
    clearExpandDialogMotion(expandDialogEl.value);
  }
  expandOpen.value = false;
  expandOverlayDim.value = false;
  expandOriginRect = null;
  expandLeaving = false;
};

const onExpandHeadDown = (event) => {
  if (expandLeaving) return;
  expandPop.startDrag(event);
};
</script>

<style scoped>
.sls0217-search-panel {
  box-sizing: border-box;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  padding-left: var(--sls0217-panel-pad-x, 2rem);
  padding-right: var(--sls0217-panel-pad-x, 2rem);
}

@media (min-width: 768px) {
  .sls0217-search-panel {
    --sls0217-panel-pad-x: 3rem;
  }
}

.sls0217-search-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);
  column-gap: var(--sls0217-col-gutter, 1.25rem);
  align-items: start;
  min-width: 0;
}

.sls0217-left-stack {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: var(--sls0217-row-gap, 0.875rem);
  min-width: 0;
  width: 100%;
  max-width: 100%;
}

.sls0217-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  min-height: 2rem;
}

.sls0217-lbl {
  box-sizing: border-box;
  flex: 0 0 var(--sls0217-label-col, 5.5rem);
  width: var(--sls0217-label-col, 5.5rem);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
  text-align: center;
  white-space: nowrap;
}

.sls0217-date-slot {
  min-width: 0;
  flex: 1 1 auto;
}

.sls0217-date-slot :deep(> div.flex.justify-start.items-center) {
  margin: 0 !important;
  width: auto !important;
  max-width: 100%;
}

.sls0217-date-slot :deep(input[type="date"]) {
  box-sizing: border-box;
  height: 2rem;
  min-height: 2rem;
  max-height: 2rem;
  border: 1px solid var(--sls0217-control-border, #cbd5e1);
  border-radius: 0.375rem;
  background: #fff;
}

.sls0217-date-slot :deep(div.inline-flex.h-8),
.sls0217-date-slot :deep(button) {
  height: 2rem !important;
  min-height: 2rem !important;
}

.sls0217-check-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem 1.25rem;
  min-height: 2rem;
}

.sls0217-check {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.875rem;
  font-weight: 400;
  color: rgb(17 24 39);
  white-space: nowrap;
  cursor: pointer;
}

.sls0217-check input {
  margin: 0;
  width: 1rem;
  height: 1rem;
  accent-color: #2563eb;
  cursor: pointer;
}

.sls0217-right-store {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  overflow: visible;
}

.sls0217-right-store :deep(.pss-brand) {
  font-size: 1rem !important;
  font-weight: 600 !important;
  line-height: 1.25 !important;
  color: rgb(17 24 39) !important;
}

.sls0217-right-store :deep(select),
.sls0217-right-store :deep(.h-8),
.sls0217-right-store :deep(.pss-select),
.sls0217-right-store :deep(.pss-vselect) {
  box-sizing: border-box;
  height: 2rem !important;
  min-height: 2rem !important;
}

@media (max-width: 1280px) {
  .sls0217-search-layout {
    grid-template-columns: minmax(0, 1fr);
    row-gap: var(--sls0217-row-gap, 0.875rem);
  }
}

/* —— 본문(스크롤) · 섹션 타이틀(|) · 그리드 높이 —— */
.sls0217-body {
  display: flex;
  flex-direction: column;
  gap: 1.125rem;
  box-sizing: border-box;
}

.sls0217-section {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;
}

.sls0217-sec-hd {
  display: flex;
  align-items: center;
  gap: 0.1rem;
  min-height: 0;
  height: 1.5rem;
  flex-shrink: 0;
  margin: 0;
  padding: 0;
}

/* 공통 타이틀 — 왼쪽 | 바 (primary-deep) · 발주등록II 그리드 타이틀과 동일 계열 */
.sls0217-sec-title {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin: 0;
  padding: 0;
  flex-shrink: 0;
  font-size: 0.9375rem;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.01em;
  color: #1a3c70;
  white-space: nowrap;
}

.sls0217-sec-title::before {
  content: "";
  display: inline-block;
  flex-shrink: 0;
  width: 0.25rem;
  height: 0.9em;
  border-radius: 999px;
  background: #2563eb;
}

/* 확대 버튼 — 타이틀 행 높이에 맞춤 (여백 과다 방지) */
.sls0217-expand-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  padding: 0;
  border: 0;
  border-radius: 0.25rem;
  background: transparent;
  color: #1d4ed8;
  cursor: pointer;
  flex-shrink: 0;
}

.sls0217-expand-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.sls0217-expand-btn:hover,
.sls0217-expand-btn:focus-visible {
  background: rgb(37 99 235 / 0.12);
}

.sls0217-expand-btn:focus-visible {
  outline: 2px solid rgba(29, 78, 216, 0.45);
  outline-offset: 1px;
}

.sls0217-expand-tip {
  position: absolute;
  top: calc(100% + 4px);
  left: 50%;
  z-index: 30;
  padding: 6px 10px;
  border: 1px solid #6b7280;
  background-color: #4b5563;
  color: #f9fafb;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.45;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
  transform: translateX(-50%);
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
}

.sls0217-expand-btn:hover .sls0217-expand-tip,
.sls0217-expand-btn:focus-visible .sls0217-expand-tip {
  opacity: 1;
  visibility: visible;
}

/* 하단 3행(좌·우 쌍) — 가운데 여백을 기존(1rem)의 약 3배 */
.sls0217-pair {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  column-gap: 3rem;
  row-gap: 1.125rem;
  min-width: 0;
  align-items: stretch;
}

.sls0217-grid-mount {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  overflow: hidden;
  border: 1px solid #cbd5e1;
  border-radius: 0.25rem;
  background: #fff;
}

/* 비율: 시간대 ≈ 중간쌍, 현금정산 더 높게 (구 1 : 1 : 2.5 : 1) */
/* 기존 18rem의 약 66% */
.sls0217-grid-mount--time {
  height: 11.88rem;
  min-height: 11.88rem;
}

/* 매출세부·메뉴그룹 — 기존 16rem의 1.3배 */
.sls0217-grid-mount--pair {
  height: 20.8rem;
  min-height: 20.8rem;
}

/* 매출취소·개점/마감 — 기존 일반쌍(16rem)의 60% 유지 */
.sls0217-grid-mount--pair60 {
  height: 9.6rem;
  min-height: 9.6rem;
}

.sls0217-grid-mount--cash {
  height: 22rem;
  min-height: 22rem;
}

.sls0217-grid-mount :deep(.rg-root),
.sls0217-grid-mount :deep(.rg-container) {
  height: 100% !important;
}

@media (max-width: 1100px) {
  .sls0217-pair {
    grid-template-columns: minmax(0, 1fr);
  }
}

/* —— 크게 보기 팝업 (z-index ≥ 10050, Teleport to body) ——
   열림/닫힘: JS FLIP (클릭 아이콘 ↔ 팝업) — 대시보드·발주등록II와 동일 */
.sls0217-expand-overlay {
  position: fixed;
  inset: 0;
  z-index: 10050;
  box-sizing: border-box;
  background: rgba(15, 28, 48, 0.45);
  opacity: 0;
  transition: opacity 0.65s ease;
  overflow: hidden;
}

.sls0217-expand-overlay--dim {
  opacity: 1;
}

.sls0217-expand-dialog {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #fff;
  border: 1px solid rgba(26, 60, 112, 0.22);
  border-radius: 0.75rem;
  box-shadow: 0 18px 48px rgba(15, 28, 48, 0.28);
  will-change: transform, opacity;
}

@media (prefers-reduced-motion: reduce) {
  .sls0217-expand-overlay {
    transition: none;
  }
}

.sls0217-expand-hd {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  flex-shrink: 0;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  background: #f8fafc;
  cursor: move;
  user-select: none;
}

.sls0217-expand-hd-lead {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 0;
  flex: 1 1 auto;
}

.sls0217-expand-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.3;
  color: #1a3c70;
  white-space: nowrap;
}

.sls0217-expand-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem 1rem;
  min-width: 0;
}

.sls0217-expand-meta-item {
  display: inline-flex;
  align-items: baseline;
  gap: 0.35rem;
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1.35;
  color: #334155;
  white-space: nowrap;
}

.sls0217-expand-meta-item em {
  font-style: normal;
  font-weight: 700;
  color: #1a3c70;
}

.sls0217-expand-hd-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
  cursor: default;
  padding-top: 0.1rem;
}

.sls0217-expand-body {
  flex: 1 1 auto;
  min-height: 0;
  padding: 0.75rem 1rem 1rem;
  overflow: hidden;
}

.sls0217-expand-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  min-height: 12rem;
  margin: 0;
  padding: 1.5rem;
  border: 1px dashed #cbd5e1;
  border-radius: 0.5rem;
  background: #f8fafc;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #64748b;
  text-align: center;
}

.sls0217-expand-body :deep(.rg-root),
.sls0217-expand-body :deep(.rg-container) {
  height: 100% !important;
}

.sls0217-expand-resize {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 16px;
  height: 16px;
  cursor: nwse-resize;
  background: linear-gradient(
    135deg,
    transparent 50%,
    #94a3b8 50%,
    #94a3b8 62%,
    transparent 62%,
    transparent 74%,
    #94a3b8 74%
  );
}
</style>
