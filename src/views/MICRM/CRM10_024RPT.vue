/*--############################################################################
# Filename : CRM10_024RPT.vue                                                  
# Description : 고객관리 > 고객 예약 관리 > 예약일보.                           
# Date :2025-05-22                                                             
# Author : 권맑음                     
################################################################################*/
<template>
  <div class="crm10-024-rpt flex h-full min-h-0 flex-col" @click="handleParentClick">
    <!-- 상단: 제목 + 버튼 -->
    <header class="crm10-024-rpt__head flex shrink-0 items-center justify-between px-2">
      <PageName></PageName>
      <div class="flex shrink-0 items-center justify-end space-x-2 pr-5">
        <button type="button" class="button search md:w-auto w-14" @click="searchButton">조회</button>
        <button type="button" class="button save w-auto excel" @click="excelButton2">엑셀</button>
        <button type="button" class="button save w-auto excel" @click="excelButton">엑셀</button>
      </div>
    </header>

    <!-- 조회 AREA (CRM10_022 / PUR017 패턴) -->
    <div
      class="crm10-024-rpt__search-panel z-10 mx-auto mt-2 w-full max-w-[min(100%,1680px)] shrink-0 overflow-hidden rounded-lg bg-gray-200 px-12 py-4 sm:px-16"
      :style="{
        '--crm10-024-label-col': crm10LabelCol,
        '--crm10-024-col-gap': crm10ColGap,
        '--crm10-024-inner-gap': crm10InnerGap,
        '--crm10-024-slash-gap': crm10SlashGap,
        '--crm10-024-date-width': crm10DateInputWidth,
        '--crm10-024-control-border': crm10ControlBorder,
      }">
      <div class="crm10-024-rpt__search-grid">
        <div class="crm10-024-rpt__search-pair crm10-024-rpt__search-pair--store">
          <div class="crm10-024-rpt__sg-label">매장 / 시간대</div>
          <div class="crm10-024-rpt__cell-field crm10-024-rpt__pick-slot">
            <PickStore
              compact-search-bar
              :compact-store-combo-max-rem="crm10PickStoreComboMaxRem"
              main-name=""
              :hide-group="false"
              :hide-attr="false"
              :show-time="true"
              @update:store-cd="lngStoreCode"
              @update:store-group="lngStoreGroup"
              @update-time="updateTime"
              @store-nm="excelStore" />
          </div>
        </div>

        <div class="crm10-024-rpt__search-pair">
          <div class="crm10-024-rpt__sg-label">예약일</div>
          <div class="crm10-024-rpt__cell-field crm10-024-rpt__date-slot">
            <Datepicker1
              :init-today="1"
              :main-name="'예약일'"
              @date-value="dateValue"
              @excel-date="excelDate" />
          </div>
        </div>

        <div class="crm10-024-rpt__search-pair">
          <div class="crm10-024-rpt__sg-label">고객명</div>
          <div class="crm10-024-rpt__cell-field">
            <input
              v-model="cond"
              type="text"
              autocomplete="off"
              class="crm10-024-rpt__sg-input h-8 w-[7.5rem] shrink-0 rounded-md border border-solid bg-white px-2 text-sm text-gray-800" />
          </div>
        </div>

        <div class="crm10-024-rpt__search-pair">
          <div class="crm10-024-rpt__sg-label">전화번호</div>
          <div class="crm10-024-rpt__cell-field crm10-024-rpt__phone-field">
            <input
              v-model="cond2"
              type="text"
              inputmode="numeric"
              autocomplete="off"
              class="crm10-024-rpt__sg-input h-8 w-[7.5rem] shrink-0 rounded-md border border-solid bg-white px-2 text-sm text-gray-800" />
            <span class="crm10-024-rpt__hint shrink-0 text-sm font-medium text-gray-600">(뒷4자리)</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 본문: 4개 그리드 단일 스크롤 · 가로 1680px 통일 -->
    <div class="crm10-024-rpt__scroll-wrap flex-1 min-h-0">
      <div
        ref="scrollContainerRef"
        class="crm10-024-rpt__scroll h-full min-h-0 overflow-y-auto"
        @scroll="updateScrollSpy">
        <div class="crm10-024-rpt__grid-stack">
        <section
          class="crm10-024-rpt__block"
          data-scroll-section="summary"
          data-scroll-label="시간대별 예약현황">
          <div class="crm10-024-rpt__block-title crm10-024-rpt__block-title--summary">
            <span class="crm10-024-rpt__tag crm10-024-rpt__tag--summary">시간대별 예약현황</span>
            <p class="crm10-024-rpt__dblclick-hint">
              <span class="crm10-024-rpt__dblclick-hint-mark" aria-hidden="true">※</span>
              예약정보를 더블클릭하시면 상세정보를 확인할 수 있습니다.
            </p>
          </div>
          <div
            v-if="changeTime == false"
            class="crm10-024-rpt__summary-rg">
            <div class="crm10-024-rpt__summary-rg-mount">
              <Realgrid
                :progname="'CRM10_024RPT_VUE'"
                :progid="1"
                :rowData="rowData"
                :reload="reload"
                :setStateBar="false"
                :documentTitle="'CRM10_024RPT'"
                :documentSubTitle="documentSubTitle"
                :mergeColumns2="true"
                :mergeColumnGroupName2="mergeColumnGroupName2"
                :mergeColumnGroupSubList2="mergeColumnGroupSubList2"
                :rowStateeditable="false"
                :syncGridHeight="true"
                :exporttoExcel="exportExcel" />
            </div>
          </div>
          <div
            v-if="changeTime == true"
            class="crm10-024-rpt__summary-rg">
            <div class="crm10-024-rpt__summary-rg-mount">
              <Realgrid
                :progname="'CRM10_024RPT_VUE'"
                :progid="2"
                :rowData="rowData2"
                :reload="reload"
                :setStateBar="false"
                :documentTitle="'CRM10_024RPT'"
                :mergeColumns2="true"
                :mergeColumnGroupName2="mergeColumnGroupName2"
                :mergeColumnGroupSubList2="mergeColumnGroupSubList3"
                :documentSubTitle="documentSubTitle"
                :syncGridHeight="true"
                :rowStateeditable="false"
                :exporttoExcel="exportExcel" />
            </div>
          </div>
        </section>

        <section
          class="crm10-024-rpt__block"
          data-scroll-section="group"
          data-scroll-label="단체예약">
          <div class="crm10-024-rpt__block-title">
            <span class="crm10-024-rpt__tag">단체예약</span>
          </div>
          <div class="crm10-024-rpt__detail-rg">
            <div class="crm10-024-rpt__detail-rg-mount">
              <Realgrid
                :progname="'CRM10_024RPT_VUE'"
                :progid="3"
                :rowData="rowData3"
                :reload="reload"
                :setStateBar="false"
                :syncGridHeight="true"
                :ColCellRedColorColId="crm10RedAmountColIds"
                :documentTitle="'CRM10_024RPT'"
                :documentSubTitle="documentSubTitle"
                :rowStateeditable="false"
                @dblclicked-row-data="(row) => openRsvDetailPopup(row, 'group')" />
            </div>
          </div>
        </section>

        <section
          class="crm10-024-rpt__block"
          data-scroll-section="general"
          data-scroll-label="일반예약">
          <div class="crm10-024-rpt__block-title">
            <span class="crm10-024-rpt__tag">일반예약</span>
          </div>
          <div class="crm10-024-rpt__detail-rg">
            <div class="crm10-024-rpt__detail-rg-mount">
              <Realgrid
                :progname="'CRM10_024RPT_VUE'"
                :progid="4"
                :rowData="rowData4"
                :reload="reload"
                :setStateBar="false"
                :syncGridHeight="true"
                :dynamicRowHeight="true"
                :ColCellRedColorColId="crm10RedAmountColIds"
                :documentTitle="'CRM10_024RPT'"
                :documentSubTitle="documentSubTitle"
                :rowStateeditable="false"
                @dblclicked-row-data="(row) => openRsvDetailPopup(row, 'general')" />
            </div>
          </div>
        </section>

        <section
          class="crm10-024-rpt__block"
          data-scroll-section="cancel"
          data-scroll-label="예약취소">
          <div class="crm10-024-rpt__block-title">
            <span class="crm10-024-rpt__tag crm10-024-rpt__tag--cancel">예약취소</span>
          </div>
          <div class="crm10-024-rpt__detail-rg">
            <div class="crm10-024-rpt__detail-rg-mount">
              <Realgrid
                :progname="'CRM10_024RPT_VUE'"
                :progid="4"
                :rowData="rowData5"
                :reload="reload"
                :setStateBar="false"
                :syncGridHeight="true"
                :dynamicRowHeight="true"
                :ColCellRedColorColId="crm10RedAmountColIds"
                :documentTitle="'CRM10_024RPT'"
                :documentSubTitle="documentSubTitle"
                :rowStateeditable="false"
                @dblclicked-row-data="(row) => openRsvDetailPopup(row, 'cancel')" />
            </div>
          </div>
        </section>
        </div>
      </div>
      <div
        v-show="afterSearch && activeScrollSectionLabel && scrollBadgeVisible"
        class="crm10-024-rpt__scroll-badge"
        :class="{
          'crm10-024-rpt__scroll-badge--summary': activeScrollSectionKey === 'summary',
          'crm10-024-rpt__scroll-badge--cancel': activeScrollSectionKey === 'cancel',
        }"
        :style="{ top: `${scrollBadgeTop}px` }"
        aria-live="polite">
        {{ activeScrollSectionLabel }}
      </div>
    </div>
  </div>

  <Teleport to="body">
    <div
      v-if="rsvPopupOpen"
      class="crm10-rsv-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="crm10-rsv-modal-title"
      @click.self="closeRsvDetailPopup">
      <div class="crm10-rsv-modal__panel">
        <header class="crm10-rsv-modal__header">
          <div class="crm10-rsv-modal__title-wrap">
            <h2 id="crm10-rsv-modal-title" class="crm10-rsv-modal__title">예약 상세내역</h2>
            <span
              class="crm10-rsv-modal__badge"
              :class="{
                'crm10-rsv-modal__badge--group': rsvPopupMeta.sectionKey === 'group',
                'crm10-rsv-modal__badge--general': rsvPopupMeta.sectionKey === 'general',
                'crm10-rsv-modal__badge--cancel': rsvPopupMeta.sectionKey === 'cancel',
              }">
              {{ rsvPopupMeta.sectionLabel }}
            </span>
          </div>
          <button
            type="button"
            class="crm10-rsv-modal__close"
            aria-label="닫기"
            @click="closeRsvDetailPopup">
            ✕
          </button>
        </header>

        <div class="crm10-rsv-modal__context">
          <span v-if="rsvPopupMeta.storeName" class="crm10-rsv-modal__chip">
            {{ rsvPopupMeta.storeName }}
          </span>
          <span v-if="rsvPopupMeta.rsvDate" class="crm10-rsv-modal__chip">
            예약일 {{ rsvPopupMeta.rsvDate }}
          </span>
          <span v-if="rsvPopupMeta.timeSlot" class="crm10-rsv-modal__chip">
            {{ rsvPopupMeta.timeSlot }}
          </span>
        </div>

        <div class="crm10-rsv-modal__body">
          <div class="crm10-rsv-modal__grid">
            <template v-for="field in rsvPopupFields" :key="field.key">
              <div
                class="crm10-rsv-modal__field"
                :class="{ 'crm10-rsv-modal__field--wide': field.wide }">
                <div class="crm10-rsv-modal__label">{{ field.label }}</div>
                <div
                  class="crm10-rsv-modal__value"
                  :class="{ 'crm10-rsv-modal__value--remark': field.wide }">
                  {{ field.value || "—" }}
                </div>
              </div>
            </template>
          </div>
        </div>

        <footer class="crm10-rsv-modal__footer">
          <button
            type="button"
            class="button primary crm10-rsv-modal__close-btn md:w-auto min-w-[5.5rem] justify-center px-4 text-center"
            @click="closeRsvDetailPopup">
            닫기
          </button>
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { getReservedDetail, getReservedDetail2 } from "@/api/micrm";
import Datepicker1 from "@/components/Datepicker1.vue";
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

import Swal from "sweetalert2";
/*
 * 공통 표준  Function
 */

import { nextTick, onMounted, onUnmounted, ref, watch } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";
import { utils, writeFile } from "xlsx-js-style";
/**
 * 	화면 Load시 실행 스크립트
 */

const scrollContainerRef = ref(null);
const activeScrollSectionKey = ref("summary");
const activeScrollSectionLabel = ref("시간대별 예약현황");
const scrollBadgeTop = ref(0);
const scrollBadgeVisible = ref(false);
let scrollSpyResizeObserver = null;

/** 스크롤 thumb 하단 위치 추정 (px, 컨테이너 뷰포트 기준) */
function getScrollThumbBottom(container) {
  const { scrollTop, scrollHeight, clientHeight } = container;
  const maxScroll = Math.max(scrollHeight - clientHeight, 0);
  const minThumb = 48;

  if (maxScroll <= 0) {
    return clientHeight;
  }

  const thumbHeight = Math.max(
    (clientHeight / scrollHeight) * clientHeight,
    minThumb
  );
  const thumbTravel = Math.max(clientHeight - thumbHeight, 0);
  const thumbTop = (scrollTop / maxScroll) * thumbTravel;

  return thumbTop + thumbHeight;
}

function resolveScrollSection(container, sections, thumbBottomPx) {
  const { scrollTop, scrollHeight, clientHeight } = container;
  const maxScroll = Math.max(scrollHeight - clientHeight, 0);

  if (maxScroll > 0 && scrollTop + clientHeight >= scrollHeight - 6) {
    const last = sections[sections.length - 1];
    return {
      key: last.dataset.scrollSection || "cancel",
      label: last.dataset.scrollLabel || "",
    };
  }

  const probeY = container.getBoundingClientRect().top + thumbBottomPx;
  let matched = sections[0];

  for (const section of sections) {
    const rect = section.getBoundingClientRect();
    if (probeY >= rect.top && probeY <= rect.bottom) {
      return {
        key: section.dataset.scrollSection || matched.dataset.scrollSection,
        label: section.dataset.scrollLabel || matched.dataset.scrollLabel,
      };
    }
    if (rect.top <= probeY) {
      matched = section;
    }
  }

  return {
    key: matched.dataset.scrollSection || "summary",
    label: matched.dataset.scrollLabel || "",
  };
}

function updateScrollSpy() {
  const container = scrollContainerRef.value;
  if (!container) return;

  const sections = [...container.querySelectorAll("[data-scroll-section]")];
  if (!sections.length) return;

  const { scrollHeight, clientHeight } = container;
  const thumbBottom = getScrollThumbBottom(container);
  const section = resolveScrollSection(container, sections, thumbBottom);

  activeScrollSectionKey.value = section.key;
  activeScrollSectionLabel.value = section.label;
  scrollBadgeTop.value = Math.round(thumbBottom);
  scrollBadgeVisible.value = scrollHeight > clientHeight + 1;
}

function scheduleScrollSpy() {
  nextTick(() => {
    requestAnimationFrame(updateScrollSpy);
  });
}

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
  scheduleScrollSpy();

  if (typeof ResizeObserver !== "undefined" && scrollContainerRef.value) {
    scrollSpyResizeObserver = new ResizeObserver(scheduleScrollSpy);
    scrollSpyResizeObserver.observe(scrollContainerRef.value);
    const stack = scrollContainerRef.value.querySelector(".crm10-024-rpt__grid-stack");
    if (stack) scrollSpyResizeObserver.observe(stack);
  }
});

onUnmounted(() => {
  scrollSpyResizeObserver?.disconnect();
  scrollSpyResizeObserver = null;
});

/** 조회 AREA — PUR017 / CRM10_022 패턴 */
const crm10ControlBorder = "#9ca3af";
const crm10ColGap = "1.75rem";
const crm10InnerGap = "0.375rem";
const crm10SlashGap = "0.5rem";
const crm10DateInputWidth = "8.75rem";
const crm10LabelCol = "7.5rem";
const crm10PickStoreComboMaxRem = 32;
const crm10RedAmountColIds = ["strRAmount"];

const reload = ref(false);
const rowData = ref([]);
const rowData2 = ref([]);
const rowData3 = ref([]);
const rowData4 = ref([]);
const rowData5 = ref([]);
const afterSearch = ref(false);

const cond = ref("");
const cond2 = ref("");
const store = useStore();

const datepicker = ref(null);
const closePopUp = ref(false);
const custId = ref("");
const strSaleCustID = (e) => {
  custId.value = e;
  initGrid();
};
const custNm = ref("");
const strSaleCustName = (e) => {
  custNm.value = e;
};

const startdate = ref("");
const dateValue = (e) => {
  startdate.value = e;
};
const enddate = ref("");
const endDate = (e) => {
  enddate.value = e;
};

const mergeColumnGroupName2 = ref(["1부", "2부"]);
const mergeColumnGroupSubList2 = ref([
  [
    "lngTime101",
    "lngTime102",
    "lngTime103",
    "lngTime104",
    "lngTime105",
    "lngTime106",
    "lngTime107",
  ],
  [
    "lngTime201",
    "lngTime202",
    "lngTime2025",
    "lngTime203",
    "lngTime204",
    "lngTime205",
    "lngTime206",
  ],
]);
const mergeColumnGroupSubList3 = ref([
  [
    "lngTime301",
    "lngTime302",
    "lngTime303",
    "lngTime304",
    "lngTime3042",
    "lngTime305",
    "lngTime306",
    "lngTime307",
    "lngTime308",
  ],
  ["lngTimeD2_1930", "lngTime401", "lngTime402", "lngTime403"],
]);

const changeTime = ref(false);

watch(
  () => [
    rowData3.value.length,
    rowData4.value.length,
    rowData5.value.length,
    changeTime.value,
  ],
  () => scheduleScrollSpy()
);

const selectedTime = ref(0);
const updateTime = (e) => {
  initGrid();
  selectedTime.value = e;

  if (e == 1) {
    changeTime.value = false;
  } else if (e == 2) {
    changeTime.value = true;
  }
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
  if (selectedStores.value == 0) {
    Swal.fire({
      title: "경고",
      text: "매장명을 먼저 선택하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  if (selectedTime.value == 0) {
    Swal.fire({
      title: "경고",
      text: "시간대를 먼저 선택하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  try {
    store.state.loading = true;
    // initGrid();
    ////console.log(changeTime.value);
    if (changeTime.value == false) {
      const res = await getReservedDetail(
        selectedGroup.value,
        selectedStores.value,
        startdate.value,
        cond.value,
        cond2.value
      );
      ////console.log(res);
      rowData.value = res.data.List;
      rowData3.value = normalizeRsvDetailRows(res.data.List2);
      rowData4.value = normalizeRsvDetailRows(res.data.List3);
      rowData5.value = normalizeRsvDetailRows(res.data.List4);
    } else {
      const res = await getReservedDetail2(
        selectedGroup.value,
        selectedStores.value,
        startdate.value,
        cond.value,
        cond2.value
      );
      ////console.log(res);
      rowData2.value = res.data.List;
      rowData3.value = normalizeRsvDetailRows(res.data.List2);
      rowData4.value = normalizeRsvDetailRows(res.data.List3);
      rowData5.value = normalizeRsvDetailRows(res.data.List4);
    }

    afterSearch.value = true;
    scheduleScrollSpy();
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
 * 페이지 매장 코드 세팅
 */

const lngStoreCode = async (e) => {
  initGrid();
  selectedStores.value = e;
  ////console.log(e);
};
const lngStoreGroup = async (e) => {
  //initGrid();
  selectedGroup.value = e;
  ////console.log(e);
};

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
  if (rowData5.value.length > 0) {
    rowData5.value = [];
  }

  cond.value = "";
  cond2.value = "";
};

//엑셀 버튼 처리 함수
const exportExcel = ref(false);
/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  documentSubTitle.value =
    selectedExcelStore.value + "\n" + selectedExcelDate.value;

  //documentSubTitle.value += "\n";
  exportExcel.value = !exportExcel.value;
};
const excelButton2 = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 진행해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (selectedTime.value == 0) {
    return;
  }
  const time = ref("런치");
  if (selectedTime.value == 1) {
    time.value = "런치";
  } else {
    time.value = "디너";
  }

  const worksheet = {};
  worksheet["A1"] = { t: "s", v: "예약일보" };
  worksheet["A2"] = { t: "s", v: "예약일 : " + startdate.value };
  worksheet["A3"] = { t: "s", v: selectedExcelStore.value };
  worksheet["A4"] = { t: "s", v: "시간 : " + time.value };

  const maxrow =
    rowData3.value.length + rowData4.value.length + rowData5.value.length;
  worksheet["!ref"] = `A1:K${maxrow}`;

  worksheet["A6"] = { t: "s", v: "▣단체예약" };

  const columns = [
    "strRoom",
    "dtmRsvTime",
    "strRsvName",
    "lngAdultCnt",
    "lngChildCnt",
    "strRsvTelNo",
    "strTable",
    "strChargerName",
    "dtmInsert",
    "strRAmount",
    "strRRemark",
  ];
  const columns2 = [
    "룸",
    "시간",
    "고객명",
    "어른",
    "아이",
    "연락처",
    "테이블",
    "접수자",
    "접수일",
    "예약금",
    "비고",
  ];

  const columns3 = [
    "RowNumber",
    "dtmRsvTime",
    "strRsvName",
    "lngAdultCnt",
    "lngChildCnt",
    "strRsvTelNo",
    "strTable",
    "strChargerName",
    "dtmInsert",
    "strRAmount",
    "strRRemark",
  ];
  const columns4 = [
    "No",
    "시간",
    "고객명",
    "어른",
    "아이",
    "연락처",
    "테이블",
    "접수자",
    "접수일",
    "예약금",
    "비고",
  ];

  columns.forEach((col, index) => {
    const colLetter = getColumnLetter(index);
    worksheet[`${colLetter}7`] = {
      t: "s",
      v: columns2[index],
      s: {
        font: { name: "맑은 고딕", sz: 11, bold: true },
        alignment: { wrapText: true, vertical: "top" },
      },
    };
  });

  rowData3.value.forEach((row, rowIndex) => {
    const excelRow = 8 + rowIndex;
    columns.forEach((col, colIndex) => {
      const colLetter = getColumnLetter(colIndex);
      const cellAddress = `${colLetter}${excelRow}`;
      const cellValue = row[col];
      const cellType = typeof cellValue === "number" ? "n" : "s";
      worksheet[cellAddress] = { t: cellType, v: cellValue };
    });
  });

  const maxRow = rowData3.value.length + 9;
  worksheet[`A${maxRow}`] = { t: "s", v: "▣일반예약" };
  columns3.forEach((col, index) => {
    const colLetter = getColumnLetter(index);
    worksheet[`${colLetter}${maxRow + 1}`] = {
      t: "s",
      v: columns4[index],
      s: {
        font: { name: "맑은 고딕", sz: 11, bold: true },
        alignment: { wrapText: true, vertical: "top" },
      },
    };
  });

  rowData4.value.forEach((row, rowIndex) => {
    const excelRow = maxRow + 2 + rowIndex;
    columns3.forEach((col, colIndex) => {
      const colLetter = getColumnLetter(colIndex);
      const cellAddress = `${colLetter}${excelRow}`;
      const cellValue = row[col];
      const cellType = typeof cellValue === "number" ? "n" : "s";
      worksheet[cellAddress] = { t: cellType, v: cellValue };
      if (!worksheet[excelRow + rowIndex]) worksheet[excelRow + rowIndex] = [];
      worksheet[excelRow + rowIndex][colIndex] = { hpt: 150 };
    });
  });

  const maxRow2 = rowData3.value.length + rowData4.value.length + 12;
  worksheet[`A${maxRow2}`] = { t: "s", v: "▣예약취소" };
  columns3.forEach((col, index) => {
    const colLetter = getColumnLetter(index);
    worksheet[`${colLetter}${maxRow2 + 1}`] = {
      t: "s",
      v: columns4[index],
      s: {
        font: { name: "맑은 고딕", sz: 11, bold: true },
        alignment: { wrapText: true, vertical: "top" },
      },
    };
  });

  rowData5.value.forEach((row, rowIndex) => {
    const excelRow = maxRow2 + 2 + rowIndex;
    columns.forEach((col, colIndex) => {
      const colLetter = getColumnLetter(colIndex);
      const cellAddress = `${colLetter}${excelRow}`;
      const cellValue = row[col];
      const cellType = typeof cellValue === "number" ? "n" : "s";
      worksheet[cellAddress] = { t: cellType, v: cellValue };
    });
  });

  const lastCol = getColumnLetter(columns.length - 1); // 마지막 열 (예: 'C')
  const lastRow =
    12 +
    rowData3.value.length +
    rowData4.value.length +
    rowData5.value.length +
    2; // 데이터 끝나는 행
  for (let i = 0; i < lastRow; i++) {
    for (let j = 0; j < lastRow; j++) {
      const colLetter = String.fromCharCode(65 + j); // A, B, C...
      const cellRef = `${colLetter}${i + 1}`; // Excel은 1-based

      if (worksheet[cellRef]) {
        worksheet[cellRef].s = {
          font: { name: "맑은 고딕", sz: 11 },
          alignment: {
            horizontal: "center",
            vertical: "center",
            wrapText: true,
          },
        };
      }
    }
  }
  worksheet["!ref"] = `A1:${lastCol}${lastRow}`;
  worksheet["!cols"] = [
    { wch: 20 }, // strRoom
    { wch: 12 }, // dtmRsvTime
    { wch: 18 }, // strRsvName
    { wch: 12 }, // lngAdultCnt
    { wch: 12 }, // lngChildCnt
    { wch: 20 }, // strRsvTelNo
    { wch: 20 }, // strTable
    { wch: 20 }, // strChargerName
    { wch: 16 }, // dtmInsert
    { wch: 20 }, // strRAmount
    { wch: 60 }, // strRRemark
  ];

  // 워크북에 시트 추가
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, "예약일보");

  // 파일 저장
  writeFile(workbook, `예약일보.xlsx`);
};

function getColumnLetter(index) {
  let letter = "";
  while (index >= 0) {
    letter = String.fromCharCode((index % 26) + 65) + letter;
    index = Math.floor(index / 26) - 1;
  }
  return letter;
}

// 엑셀 추출
const documentSubTitle = ref("");
const selectedExcelList = ref("");
const selectedExcelDate = ref("");

const selectedExcelStore = ref("");
/**
 * 엑셀용 매장 세팅 함수
 */

const excelStore = (e) => {
  selectedExcelStore.value = "매장명 : " + e;
  //comsole.log(e);
};
const excelDate = (e) => {
  selectedExcelDate.value = e;
  //comsole.log(e);
};

const RSV_SECTION_LABELS = {
  group: "단체예약",
  general: "일반예약",
  cancel: "예약취소",
};

const rsvPopupOpen = ref(false);
const rsvPopupMeta = ref({
  sectionKey: "",
  sectionLabel: "",
  storeName: "",
  rsvDate: "",
  timeSlot: "",
});
const rsvPopupFields = ref([]);

function normalizeRsvCellValue(v) {
  if (v == null) return "";
  const s = String(v).trim();
  if (!s || s.toLowerCase() === "null" || s.toLowerCase() === "undefined") return "";
  return s;
}

function normalizeRsvDetailRows(list) {
  if (!Array.isArray(list)) return [];
  return list.map((row) => {
    if (!row || typeof row !== "object") return row;
    if (!Object.prototype.hasOwnProperty.call(row, "strRRemark")) return row;
    return { ...row, strRRemark: normalizeRsvCellValue(row.strRRemark) };
  });
}

function rsvRowField(row, fieldName) {
  if (row == null) return "";
  if (typeof row === "object" && !Array.isArray(row)) {
    if (Object.prototype.hasOwnProperty.call(row, fieldName)) {
      return normalizeRsvCellValue(row[fieldName]);
    }
    const alt = Object.keys(row).find(
      (k) => k.toLowerCase() === String(fieldName).toLowerCase()
    );
    if (alt) {
      return normalizeRsvCellValue(row[alt]);
    }
  }
  return "";
}

function rsvPopupTimeSlotLabel() {
  if (selectedTime.value == 1) return "런치";
  if (selectedTime.value == 2) return "디너";
  return "";
}

function rsvPopupStoreLabel() {
  const raw = selectedExcelStore.value || "";
  return raw.replace(/^매장명\s*:\s*/i, "").trim();
}

function buildRsvPopupFields(row, section) {
  const adult = rsvRowField(row, "lngAdultCnt");
  const child = rsvRowField(row, "lngChildCnt");
  const adultNum = Number(adult) || 0;
  const childNum = Number(child) || 0;
  const fields = [];

  if (section === "group") {
    fields.push({ key: "strRoom", label: "룸", value: rsvRowField(row, "strRoom") });
  } else {
    fields.push({
      key: "RowNumber",
      label: "No",
      value: rsvRowField(row, "RowNumber"),
    });
  }

  fields.push(
    { key: "dtmRsvTime", label: "예약시간", value: rsvRowField(row, "dtmRsvTime") },
    { key: "strRsvName", label: "고객명", value: rsvRowField(row, "strRsvName") },
    { key: "strRsvTelNo", label: "연락처", value: rsvRowField(row, "strRsvTelNo") },
    {
      key: "guest",
      label: "인원",
      value: `어른 ${adult || 0} / 아이 ${child || 0} (합계 ${adultNum + childNum}명)`,
    },
    { key: "strTable", label: "테이블", value: rsvRowField(row, "strTable") },
    {
      key: "strChargerName",
      label: "접수자",
      value: rsvRowField(row, "strChargerName"),
    },
    { key: "dtmInsert", label: "접수일", value: rsvRowField(row, "dtmInsert") },
    { key: "strRAmount", label: "예약금", value: rsvRowField(row, "strRAmount") },
    {
      key: "strRRemark",
      label: "비고",
      value: rsvRowField(row, "strRRemark"),
      wide: true,
    }
  );

  return fields;
}

function openRsvDetailPopup(row, section) {
  if (!row) return;

  const customerName = rsvRowField(row, "strRsvName");
  if (!customerName) {
    Swal.fire({
      title: "안내",
      text: "예약 정보가 있는 행을 더블클릭해 주세요.",
      icon: "info",
      confirmButtonText: "확인",
    });
    return;
  }

  rsvPopupMeta.value = {
    sectionKey: section,
    sectionLabel: RSV_SECTION_LABELS[section] || "예약",
    storeName: rsvPopupStoreLabel(),
    rsvDate: startdate.value,
    timeSlot: rsvPopupTimeSlotLabel(),
  };
  rsvPopupFields.value = buildRsvPopupFields(row, section);
  rsvPopupOpen.value = true;
}

function closeRsvDetailPopup() {
  rsvPopupOpen.value = false;
}
</script>

<style scoped>
/* 항목 세트(라벨+컨트롤)는 붙이고, 세트 사이는 균등 분배 */
.crm10-024-rpt__search-panel {
  overflow-x: hidden;
}

.crm10-024-rpt__search-grid {
  display: grid;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  align-items: center;
  grid-template-columns: minmax(0, 1fr) auto auto auto;
  column-gap: var(--crm10-024-col-gap);
}

/* 라벨 ↔ 컨트롤 간격 — 항목마다 동일 (column-gap) */
.crm10-024-rpt__search-pair {
  display: grid;
  grid-template-columns: var(--crm10-024-label-col) minmax(0, 1fr);
  column-gap: var(--crm10-024-inner-gap);
  align-items: center;
  width: 100%;
  min-width: 0;
  white-space: nowrap;
}

.crm10-024-rpt__search-pair:not(.crm10-024-rpt__search-pair--store) {
  grid-template-columns: var(--crm10-024-label-col) auto;
}

.crm10-024-rpt__search-pair--store {
  width: 100%;
  min-width: 0;
}

.crm10-024-rpt__search-pair--store .crm10-024-rpt__cell-field {
  flex: 1 1 auto;
  min-width: 0;
  width: 100%;
}

.crm10-024-rpt__search-pair--store .crm10-024-rpt__pick-slot {
  flex: 1 1 auto;
  width: 100%;
  min-width: 0;
  max-width: 100%;
}

.crm10-024-rpt__sg-label {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
  white-space: nowrap;
}

.crm10-024-rpt__cell-field {
  min-width: 0;
  flex: 0 1 auto;
  display: flex;
  align-items: center;
}

.crm10-024-rpt__phone-field {
  gap: 0.375rem;
}

.crm10-024-rpt__pick-slot {
  overflow: hidden;
}

.crm10-024-rpt__pick-slot :deep(> div.flex.text-base > div.shrink-0:first-child) {
  display: none;
}

.crm10-024-rpt__pick-slot :deep(> div.flex.text-base) {
  margin: 0;
  width: 100%;
  min-width: 0;
  align-items: center;
  /* 매장·시간대만 보이므로 gap 제거 — / 앞뒤는 ::before margin으로만 */
  gap: 0 !important;
}

.crm10-024-rpt__pick-slot :deep(select),
.crm10-024-rpt__pick-slot :deep(.pickstore-vs-shell) {
  border: 1px solid var(--crm10-024-control-border) !important;
  box-sizing: border-box;
}

.crm10-024-rpt__pick-slot :deep(> div.flex.text-base > div:nth-child(4)) {
  flex: 1 1 0;
  min-width: 0;
  width: 100%;
  max-width: 100% !important;
}

.crm10-024-rpt__pick-slot :deep(.pickstore-vs-shell) {
  width: 100%;
  max-width: 100% !important;
}

/* 매장 콤보 / 시간대 콤보 사이 구분 — / 앞·뒤 동일 간격 */
.crm10-024-rpt__pick-slot :deep(> div.flex.text-base > div:last-child) {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  margin-left: 0 !important;
}

.crm10-024-rpt__pick-slot :deep(> div.flex.text-base > div:last-child)::before {
  content: "/";
  margin-left: var(--crm10-024-slash-gap);
  margin-right: var(--crm10-024-slash-gap);
  font-size: 1rem;
  font-weight: 600;
  color: rgb(17 24 39);
}

.crm10-024-rpt__pick-slot :deep(> div.flex.text-base > div:last-child select) {
  box-sizing: border-box;
  height: 2rem;
  min-height: 2rem;
  width: 5rem;
  padding: 0 0.375rem;
  font-size: 0.875rem;
  border-radius: 0.375rem;
  border: 1px solid var(--crm10-024-control-border) !important;
}

.crm10-024-rpt__date-slot {
  flex: 0 0 auto;
}

.crm10-024-rpt__date-slot :deep(> div) {
  margin: 0 !important;
  display: flex;
  align-items: center;
  width: auto;
  column-gap: 0;
}

.crm10-024-rpt__date-slot :deep(> div > input[type="date"]) {
  margin-left: 0 !important;
}

.crm10-024-rpt__date-slot :deep(> div > span) {
  display: none;
}

.crm10-024-rpt__date-slot :deep(input[type="date"]) {
  box-sizing: border-box;
  height: 2rem;
  min-height: 2rem;
  width: var(--crm10-024-date-width);
  max-width: var(--crm10-024-date-width);
  padding-left: 0.5rem;
  font-size: 0.875rem;
  border-radius: 0.375rem;
  border: 1px solid var(--crm10-024-control-border) !important;
}

.crm10-024-rpt__sg-input {
  box-sizing: border-box;
  border: 1px solid var(--crm10-024-control-border) !important;
}

.crm10-024-rpt__sg-input:focus {
  border-color: #3b82f6 !important;
  outline: none;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.35);
}

.crm10-024-rpt__scroll-wrap {
  position: relative;
}

.crm10-024-rpt__scroll {
  padding: 0.5rem 0.5rem 1rem;
  scrollbar-gutter: stable;
  scrollbar-width: auto;
  scrollbar-color: #f43f5e #ffe4e6;
}

/* 스크롤 thumb 하단 라인에 맞춰 표시 */
.crm10-024-rpt__scroll-badge {
  position: absolute;
  right: 0.125rem;
  z-index: 30;
  transform: translateY(-100%);
  max-width: 4.75rem;
  transition: top 0.12s ease-out;
  padding: 0.5rem 0.375rem;
  border-radius: 0.5rem;
  border: 1px solid #c4b5fd;
  background: rgb(237 233 254 / 0.96);
  box-shadow: 0 2px 8px rgb(91 33 182 / 0.15);
  font-size: 0.6875rem;
  font-weight: 700;
  line-height: 1.35;
  text-align: center;
  color: #5b21b6;
  pointer-events: none;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  letter-spacing: 0.02em;
}

.crm10-024-rpt__scroll-badge--summary {
  color: #1e3a8a;
  background: rgb(219 234 254 / 0.96);
  border-color: #93c5fd;
}

.crm10-024-rpt__scroll-badge--cancel {
  color: #9f1239;
  background: rgb(255 228 230 / 0.96);
  border-color: #fda4af;
}

.crm10-024-rpt__scroll::-webkit-scrollbar {
  width: 16px;
}

.crm10-024-rpt__scroll::-webkit-scrollbar-track {
  background: #ffe4e6;
  border-left: 1px solid #fecdd3;
  border-radius: 8px;
}

.crm10-024-rpt__scroll::-webkit-scrollbar-thumb {
  background: #f43f5e;
  border: 3px solid #ffe4e6;
  border-radius: 8px;
  min-height: 3rem;
}

.crm10-024-rpt__scroll::-webkit-scrollbar-thumb:hover {
  background: #e11d48;
}

.crm10-024-rpt__scroll::-webkit-scrollbar-thumb:active {
  background: #be123c;
}

.crm10-024-rpt__grid-stack {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: min(100%, 1680px);
  margin: 0 auto 1.5rem;
  padding: 0 0.25rem;
}

.crm10-024-rpt__block {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  width: 100%;
  min-width: 0;
}

.crm10-024-rpt__block-title {
  position: sticky;
  top: 0;
  z-index: 15;
  padding: 0.25rem 0 0.25rem 0.125rem;
  background: linear-gradient(
    to bottom,
    rgb(255 255 255 / 0.98) 0%,
    rgb(255 255 255 / 0.92) 70%,
    rgb(255 255 255 / 0) 100%
  );
}

.crm10-024-rpt__block-title--summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
  min-width: 0;
  padding-right: 0;
}

.crm10-024-rpt__dblclick-hint {
  margin: 0;
  flex: 0 1 auto;
  text-align: right;
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1.35;
  color: #e11d48;
  white-space: nowrap;
}

.crm10-024-rpt__dblclick-hint-mark {
  margin-right: 0.25rem;
  font-weight: 700;
}

.crm10-024-rpt__tag {
  display: inline-flex;
  align-items: center;
  padding: 0.3125rem 0.75rem;
  font-size: 0.8125rem;
  font-weight: 700;
  color: #5b21b6;
  background: #ede9fe;
  border: 1px solid #c4b5fd;
  border-radius: 0.25rem;
}

.crm10-024-rpt__tag--summary {
  color: #1e3a8a;
  background: #dbeafe;
  border-color: #93c5fd;
}

.crm10-024-rpt__tag--cancel {
  color: #9f1239;
  background: #ffe4e6;
  border-color: #fda4af;
}

/* 시간대별 — 헤더+3행 고정 */
.crm10-024-rpt__summary-rg {
  width: 100%;
  overflow-x: auto;
  border: 1px solid #9ca3af;
  border-radius: 0.25rem;
  background: #fff;
}

.crm10-024-rpt__summary-rg-mount {
  position: relative;
  width: 100%;
  height: 8.25rem;
  min-height: 8.25rem;
}

.crm10-024-rpt__summary-rg-mount :deep(.realgrid) {
  width: 100%;
  height: 100%;
}

/* 상세 — 데이터 없어도 헤더 표시, syncGridHeight로 행만큼 확장 */
.crm10-024-rpt__detail-rg {
  width: 100%;
  overflow-x: auto;
  overflow-y: visible;
  border: 1px solid #9ca3af;
  border-radius: 0.25rem;
  background: #fff;
}

.crm10-024-rpt__detail-rg-mount {
  position: relative;
  width: 100%;
  min-height: 5rem;
}

.crm10-024-rpt__detail-rg-mount :deep(.realgrid) {
  width: 100%;
  height: 5rem;
  min-height: 5rem;
}


.crm10-rsv-modal {
  position: fixed;
  inset: 0;
  z-index: 10050;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgb(15 23 42 / 0.55);
  backdrop-filter: blur(2px);
}

.crm10-rsv-modal__panel {
  display: flex;
  flex-direction: column;
  width: min(100%, 44rem);
  max-height: min(90vh, 40rem);
  overflow: hidden;
  border-radius: 0.875rem;
  border: 1px solid #c4b5fd;
  background: linear-gradient(180deg, #faf5ff 0%, #fff 2.5rem);
  box-shadow:
    0 24px 48px rgb(91 33 182 / 0.18),
    0 8px 16px rgb(15 23 42 / 0.12);
}

.crm10-rsv-modal__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.125rem 1.25rem 0.875rem;
  border-bottom: 1px solid #e9d5ff;
}

.crm10-rsv-modal__title-wrap {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.625rem;
}

.crm10-rsv-modal__title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #312e81;
}

.crm10-rsv-modal__badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
}

.crm10-rsv-modal__badge--group,
.crm10-rsv-modal__badge--general {
  color: #5b21b6;
  background: #ede9fe;
  border: 1px solid #c4b5fd;
}

.crm10-rsv-modal__badge--cancel {
  color: #9f1239;
  background: #ffe4e6;
  border: 1px solid #fda4af;
}

.crm10-rsv-modal__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: none;
  border-radius: 0.5rem;
  background: #f5f3ff;
  color: #5b21b6;
  font-size: 1rem;
  line-height: 1;
  cursor: pointer;
  transition: background 0.15s ease;
}

.crm10-rsv-modal__close:hover {
  background: #ede9fe;
}

.crm10-rsv-modal__context {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem 0;
}

.crm10-rsv-modal__chip {
  display: inline-flex;
  align-items: center;
  padding: 0.3125rem 0.625rem;
  border-radius: 0.375rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #475569;
}

.crm10-rsv-modal__body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 1rem 1.25rem;
  scrollbar-width: auto;
  scrollbar-color: #f43f5e #ffe4e6;
}

.crm10-rsv-modal__body::-webkit-scrollbar {
  width: 12px;
}

.crm10-rsv-modal__body::-webkit-scrollbar-track {
  background: #ffe4e6;
  border-radius: 8px;
}

.crm10-rsv-modal__body::-webkit-scrollbar-thumb {
  background: #f43f5e;
  border: 2px solid #ffe4e6;
  border-radius: 8px;
}

.crm10-rsv-modal__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.625rem;
}

.crm10-rsv-modal__field {
  display: grid;
  grid-template-columns: 5.5rem minmax(0, 1fr);
  align-items: stretch;
  min-height: 2.5rem;
  border: 1px solid #e9d5ff;
  border-radius: 0.5rem;
  overflow: hidden;
  background: #fff;
}

.crm10-rsv-modal__field--wide {
  grid-column: 1 / -1;
  grid-template-columns: 5.5rem minmax(0, 1fr);
  align-items: start;
}

.crm10-rsv-modal__label {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 0.375rem;
  background: linear-gradient(180deg, #f5f3ff, #ede9fe);
  font-size: 0.8125rem;
  font-weight: 700;
  color: #5b21b6;
  text-align: center;
  border-right: 1px solid #e9d5ff;
}

.crm10-rsv-modal__field--wide .crm10-rsv-modal__label {
  align-items: flex-start;
  padding-top: 0.75rem;
}

.crm10-rsv-modal__value {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  line-height: 1.45;
  color: #1e293b;
  word-break: break-word;
}

.crm10-rsv-modal__value--remark {
  align-items: flex-start;
  min-height: 6rem;
  max-height: 14rem;
  overflow-y: auto;
  white-space: pre-wrap;
}

.crm10-rsv-modal__footer {
  display: flex;
  justify-content: flex-end;
  padding: 0.875rem 1.25rem 1.125rem;
  border-top: 1px solid #ede9fe;
  background: #fafafa;
}

.crm10-rsv-modal__close-btn {
  font-weight: 600;
  box-shadow: 0 1px 3px 0 rgb(87 130 255 / 0.3);
}

@media (max-width: 640px) {
  .crm10-rsv-modal__grid {
    grid-template-columns: 1fr;
  }

  .crm10-rsv-modal__field,
  .crm10-rsv-modal__field--wide {
    grid-template-columns: 5rem minmax(0, 1fr);
  }
}
</style>
