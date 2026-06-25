/*--############################################################################
# Filename : SLS01_001INS.vue                                                  
# Description : 매출관리 > 매출 목표 관리 > 일별 매출 계획 등록.               
# Date :2025-05-14                                                             
# Author : 권맑음                     
################################################################################*/
<template>
  <div class="sls01-page flex min-h-0 flex-col" ref="sls01PageRef">
    <div class="flex shrink-0 justify-between items-center w-full overflow-y-hidden">
    <PageName></PageName>
    <div class="flex justify-center mr-9 space-x-2 pr-5">
        <button @click="() => searchButton()" class="button search md:w-auto w-14">
        조회
      </button>
      <button @click="saveButton" class="button save md:w-auto w-14">
        저장
      </button>
      <button @click="excelButton" class="button w-auto excel">엑셀</button>
    </div>
  </div>
  <div
    class="sls01-search-panel relative z-10 mt-2 w-full min-w-0 shrink-0 overflow-x-auto overflow-y-hidden rounded-lg bg-gray-200 px-4 py-2.5 sm:px-6 md:px-10 lg:px-12 xl:py-3 2xl:px-16"
    :style="{
      '--sls01-control-border': sls01ControlBorder,
      '--sls01-item-gap': sls01ItemGap,
      '--sls01-row-gap': sls01RowGap,
      '--sls01-label-col': sls01LabelCol,
      '--sls01-week-col': sls01WeekCol,
      '--sls01-month-col': sls01MonthCol,
    }">
    <div class="sls01-search-grid min-w-0">
      <!-- 1행 좌: 매출 목표 년월 -->
      <div class="sls01-wire-cell">
        <div class="sls01-wire-label">매출 목표 년월</div>
        <div class="sls01-wire-field sls01-inline-ops sls01-date-ops min-w-0">
          <select
            id="sls01-year"
            v-model="sls01SelectedYear"
            class="sls01-sg-select sls01-week-select h-8 shrink-0 rounded-md border border-solid bg-white px-1.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            @change="onSls01YearChange">
            <option v-for="y in sls01YearOptions" :key="y" :value="y">{{ y }}</option>
          </select>
          <select
            id="sls01-month"
            v-model="sls01SelectedMonth"
            class="sls01-sg-select sls01-month-select h-8 shrink-0 rounded-md border border-solid bg-white px-1.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            @change="onSls01MonthChange">
            <option v-for="m in sls01MonthOptions" :key="m" :value="m">{{ m }}</option>
          </select>
        </div>
      </div>

      <!-- 우: 매장 (1~3행) -->
      <div class="sls01-pick-span">
        <PickStoreSingle
          ref="pickStoreRef"
          @lngStoreGroup="lngStoreGroup"
          @lngSupervisor="lngSupervisor"
          @lngStoreTeam="lngStoreTeam"
          @lngStoreAttrs="lngStoreAttrs"
          @lngStoreCode="lngStoreCode"
          @excelStore="excelStore"
          :placeholderName="'선택'" />
        </div>

      <!-- 2행 좌: 매출목표액 -->
      <div class="sls01-wire-cell">
        <div class="sls01-wire-label">매출목표액</div>
        <div class="sls01-wire-field sls01-inline-ops min-w-0">
          <select
            id="sls01-target-week"
            v-model="selectWeek"
            class="sls01-sg-select sls01-week-select h-8 shrink-0 rounded-md border border-solid bg-white px-1.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option :value="0">전체</option>
            <option :value="i.lngCode" v-for="i in WeekDays" :key="i.lngCode">
              {{ i.strName }}
            </option>
          </select>
          <input
            id="sls01-target-amt"
            type="text"
            inputmode="numeric"
            v-model="targetSales"
            @keydown="onTargetSalesKeydown"
            @input="onTargetSalesInput"
            @paste="onTargetSalesPaste"
            class="sls01-sg-input h-8 min-h-8 min-w-0 flex-1 rounded-md border border-solid bg-white px-2 text-right text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button
            type="button"
            class="sls01-sub-btn shrink-0"
            @click="setMonthSales">
            적용
          </button>
        </div>
      </div>

      <!-- 3행 좌: 파일경로 + 파일선택 -->
      <div class="sls01-wire-cell min-w-0">
        <div class="sls01-wire-label">매출계획 엑셀 업로드</div>
        <div class="sls01-wire-field sls01-inline-ops min-w-0">
          <input
            id="sls01-file-name"
            type="text"
              disabled
            v-model="excelName"
            :title="excelName"
            class="sls01-sg-input sls01-file-input h-8 min-h-8 min-w-0 flex-1 rounded-md border border-solid bg-white px-2 text-sm text-gray-700" />
            <label
              for="hiddenFile"
            class="sls01-sub-btn shrink-0 cursor-pointer">
              파일선택
            </label>
            <input
            ref="hiddenFileRef"
              type="file"
              class="hidden"
              id="hiddenFile"
              @change="readExcel"
            @click="onFileInputClick" />
          </div>
        </div>

      <!-- 3행 우: sheet 선택 레이블 = PickStoreSingle 매장명 left 라인 -->
      <div class="sls01-excel-store-col sls01-pss-row min-w-0">
        <span class="sls01-inline-label sls01-sheet-brand shrink-0">Sheet 선택</span>
        <div class="sls01-excel-sheet-ops sls01-inline-ops min-w-0 flex-1">
          <select
            :key="sls01ExcelUiKey"
            id="sls01-sheet"
            v-model="selectSheet"
            :disabled="!sls01ExcelFileLoaded"
            class="sls01-sg-select sls01-sheet-select h-8 shrink-0 rounded-md border border-solid bg-white px-1.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            @change="onSls01SheetChange">
            <option :value="SLS01_SHEET_NONE">선택</option>
            <option :value="i.lngCode" v-for="i in sheetArr" :key="i.lngCode">
              {{ i.strName }}
            </option>
          </select>
          <button
            type="button"
            class="sls01-sub-btn shrink-0 whitespace-nowrap"
            :disabled="!sls01ExcelFileLoaded"
            @click="saveUploadFile">
            업로드 파일 저장
          </button>
          <button
            type="button"
            class="sls01-sub-btn sls01-sub-btn--download shrink-0"
            @click="downloadSample">
            <span class="sls01-sub-btn__excel-icon" aria-hidden="true"></span>
            download
          </button>
      </div>
    </div>

      <div class="sls01-foot-span">
        <p class="sls01-hint m-0 text-sm text-gray-700">
          ※ 1. 샘플파일 다운받아 작성(Download 버튼). 2. 파일선택 후 「업로드
          파일 저장」 버튼 클릭
        </p>
      </div>
    </div>
  </div>
  <!-- 조회 조건 -->

  <Teleport to="body">
    <div v-show="openPopUp" class="sls01-popup-layer fixed inset-0 z-[200]">
      <div class="sls01-popup-backdrop" @click="closePopup"></div>
      <div
        class="sls01-day-popup fixed"
        :style="{ left: popupLeft, top: popupTop }"
        @click.stop>
        <div class="sls01-day-popup__header">
          <span class="sls01-day-popup__title">일별 매출계획</span>
              <button
            type="button"
            class="sls01-day-popup__close"
            aria-label="닫기"
                @click="closePopup">
            ×
              </button>
        </div>
        <div class="sls01-day-popup__body">
          <div class="sls01-day-popup__date-wrap">
            <div
              id="sls01-popup-date"
              class="sls01-day-popup__date-display"
              :class="sls01PopupDateToneClass"
              :title="sls01PopupHolidayFullTitle">
              <span class="sls01-day-popup__date-main">{{ sls01PopupDateMain }}</span>
              <span
                v-if="sls01PopupHolidayName"
                class="sls01-day-popup__date-meta sls01-day-popup__date-meta--holiday">
                {{ sls01PopupHolidayName }}
              </span>
              <span
                v-if="sls01PopupWeekday"
                class="sls01-day-popup__date-meta"
                :class="sls01PopupDateWeekdayClass">
                ({{ sls01PopupWeekday }})
              </span>
            </div>
          </div>
          <div class="sls01-day-popup__row">
            <label class="sls01-day-popup__label" for="sls01-popup-amt">목표액</label>
              <input
              ref="sls01PopupAmtRef"
              id="sls01-popup-amt"
                type="text"
              inputmode="numeric"
              v-model="clickedProj"
              @keydown="onClickedProjKeydown"
              @input="onClickedProjInput"
              @paste="onClickedProjPaste"
              class="sls01-day-popup__input sls01-day-popup__input--amount" />
          </div>
          <div class="sls01-day-popup__row">
            <label class="sls01-day-popup__label" for="sls01-popup-comment">비고</label>
              <input
              id="sls01-popup-comment"
                type="text"
                :value="clickedComment"
                @input="changeComment($event)"
              @keydown="onClickedCommentKeydown"
              class="sls01-day-popup__input" />
    </div>
        </div>
        <div class="sls01-day-popup__footer">
        <button
            type="button"
            class="sls01-day-popup__btn"
            @click="closePopup">
            닫기
        </button>
      </div>
    </div>
      </div>
  </Teleport>

  <!--달력 영역-->
  <div class="sls01-cal-section mt-1 flex min-h-0 flex-1 flex-col">
    <div class="sls01-cal-toolbar shrink-0">
      <button
        type="button"
        class="sls01-cal-nav"
        aria-label="이전 달"
        @click="handleSls01CalendarPrev">
        ‹
        </button>
      <div class="sls01-cal-toolbar__main">
        <p class="sls01-cal-toolbar__title">{{ sls01CalendarTitle }}</p>
        <div class="sls01-cal-toolbar__total">
          <span class="sls01-cal-toolbar__total-label">매출 목표액</span>
          <span class="sls01-cal-toolbar__total-value">{{ targetMonthSales || "0" }}</span>
      </div>
    </div>
      <button
        type="button"
        class="sls01-cal-nav"
        aria-label="다음 달"
        @click="handleSls01CalendarNext">
        ›
      </button>
  </div>
    <div
      class="sls01-cal-body"
      ref="sls01CalBodyRef"
      :style="sls01CalBodyStyle">
      <FullCalendar
        :options="sls01CalendarOptions"
        class="sls01-cal-fc"
        ref="calendarRef" />
    </div>
  </div>
  <!--달력 영역-->
  </div>
</template>

<script setup>
import { getProjByMonth, saveExcelDataPlan } from "@/api/misales";
/**
 *  해당연월 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";

/**
 *  매장 단일 선택 컴포넌트
 *  */

import PickStoreSingle from "@/components/pickStoreSingle.vue";
import {
  excelSerialDateToJSDate,
  formatNumberWithCommas,
  insertPageLog,
} from "@/customFunc/customFunc";
import {
  formatHolidayLabelForCalendar,
  getKoreanPublicHolidayShortName,
  isKoreanPublicHoliday,
} from "@/customFunc/koreanHolidays";

/**
 *  달력 관련 라이브러리
 *  */

import koLocale from "@fullcalendar/core/locales/ko";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/vue3";
/**
 *  경고창 호출 라이브러리
 *  */

import Swal from "sweetalert2";
/*
 * 공통 표준  Function
 */

import {
  computed,
  isRef,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";

/**
 *  엑셀 내보내기 관련 라이브러리
 */
import { read, utils, writeFile } from "xlsx-js-style";

/** 조회 AREA — PUR02_017INS / CRM01 search-area-layout 패턴 */
const sls01ControlBorder = "#cbd5e1";
const sls01ItemGap = "0.75rem";
const sls01RowGap = "0.5625rem";
/** 가장 긴 라벨(매출계획 엑셀 업로드) 전체 표시 */
const sls01LabelCol = "10.5rem";
/** 매출목표액 요일 콤보 = 날짜 연도 콤보 폭 */
const sls01WeekCol = "8rem";
/** Datepicker3 월 콤보(w-28) 유지 */
const sls01MonthCol = "7rem";

/** 브라우저가 허용하는 범위 내 파일 경로(또는 파일명) 표시 */
const resolveSls01ExcelDisplayPath = (fileInput, file) => {
  if (!file) return "";
  const inputPath = String(fileInput?.value ?? "").trim();
  if (inputPath) return inputPath;
  return String(file.webkitRelativePath || file.name || "").trim();
};

const warnSearchFirst = () => {
  Swal.fire({
    title: "경고",
    text: "조회를 먼저 진행해주세요.",
    icon: "warning",
    confirmButtonText: "확인",
  });
};

const onFileInputClick = (e) => {
  if (!afterSearch.value) {
    e.preventDefault();
    warnSearchFirst();
    return;
  }
  e.target.value = "";
};
const popupLeft = ref("0px");
const popupTop = ref("0px");
const selectWeek = ref(0);
const targetSales = ref("");
const targetMonthSales = ref("0");

const sls01CalendarTitle = computed(() => {
  if (currentYear.value == null || currentMonth.value == null) return "—";
  return `${currentYear.value}년 ${currentMonth.value}월`;
});

const parseSls01Amount = (val) => {
  const s = String(val ?? "")
    .replace(/,/g, "")
    .trim();
  if (s === "") return "";
  const n = Number(s);
  return Number.isFinite(n) ? String(n) : "";
};

const formatSls01Amount = (val) => {
  const raw = parseSls01Amount(val);
  if (raw === "") return "";
  return formatNumberWithCommas(raw);
};

const SLS01_AMOUNT_NAV_KEYS = new Set([
  "Backspace",
  "Delete",
  "Tab",
  "Escape",
  "Enter",
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "Home",
  "End",
]);

const digitCountBeforeDisplayIndex = (displayValue, pos) => {
  const s = String(displayValue ?? "");
  const p = Math.min(Math.max(0, pos), s.length);
  let n = 0;
  for (let i = 0; i < p; i++) {
    if (/\d/.test(s[i])) n++;
  }
  return n;
};

const displayIndexAfterDigitCount = (displayValue, digitCount) => {
  const s = String(displayValue ?? "");
  if (digitCount <= 0) return 0;
  let n = 0;
  for (let i = 0; i < s.length; i++) {
    if (/\d/.test(s[i])) {
      n++;
      if (n >= digitCount) return i + 1;
    }
  }
  return s.length;
};

const formatSls01AmountDigits = (digits) =>
  digits === "" ? "" : Number(digits).toLocaleString("en-US");

const applySls01AmountValue = (el, refTarget, digits, cursorDigitPos) => {
  const formatted = formatSls01AmountDigits(digits);
  if (isRef(refTarget)) {
    refTarget.value = formatted;
  } else if (el) {
    el.value = formatted;
  }
  const pos = displayIndexAfterDigitCount(formatted, cursorDigitPos);
  nextTick(() => {
    if (typeof el?.setSelectionRange === "function") {
      el.setSelectionRange(pos, pos);
    }
  });
};

const onSls01AmountKeydown = (e, refTarget, onChanged) => {
  if (e.isComposing) return;
  if (e.ctrlKey || e.metaKey) return;

  const el = e.target;
  const disp = String(
    isRef(refTarget) ? refTarget.value : (refTarget ?? el.value ?? "")
  );
  const curDigits = disp.replace(/\D/g, "");
  const start = typeof el.selectionStart === "number" ? el.selectionStart : 0;
  const end = typeof el.selectionEnd === "number" ? el.selectionEnd : start;
  const sIdx = digitCountBeforeDisplayIndex(disp, start);
  const eIdx = digitCountBeforeDisplayIndex(disp, end);

  if (e.key === "Backspace" || e.key === "Delete") {
    e.preventDefault();
    if (!isRef(refTarget)) return;

    let nextDigits = curDigits;
    let cursorDigitPos = sIdx;

    if (start !== end) {
      nextDigits = curDigits.slice(0, sIdx) + curDigits.slice(eIdx);
      cursorDigitPos = sIdx;
    } else if (e.key === "Backspace") {
      if (sIdx > 0) {
        nextDigits = curDigits.slice(0, sIdx - 1) + curDigits.slice(sIdx);
        cursorDigitPos = sIdx - 1;
      }
    } else if (sIdx < curDigits.length) {
      nextDigits = curDigits.slice(0, sIdx) + curDigits.slice(sIdx + 1);
      cursorDigitPos = sIdx;
    }

    applySls01AmountValue(el, refTarget, nextDigits, cursorDigitPos);
    onChanged?.();
    return;
  }

  if (SLS01_AMOUNT_NAV_KEYS.has(e.key)) return;
  if (/^\d$/.test(e.key)) return;
  e.preventDefault();
};

const onSls01AmountInput = (e, refTarget, onChanged) => {
  const el = e.target;
  const disp = String(isRef(refTarget) ? refTarget.value : "");
  const curDigits = disp.replace(/\D/g, "");
  const start = typeof el.selectionStart === "number" ? el.selectionStart : 0;
  const sIdx = digitCountBeforeDisplayIndex(disp, start);
  const browserDigits = String(e.target.value ?? "")
    .replace(/,/g, "")
    .replace(/\D/g, "");
  const digitPos = Math.min(
    Math.max(0, sIdx + (browserDigits.length - curDigits.length)),
    browserDigits.length
  );
  applySls01AmountValue(el, refTarget, browserDigits, digitPos);
  onChanged?.();
};

const onSls01AmountPaste = (e, refTarget, onChanged) => {
  e.preventDefault();
  const pasteDigits = (e.clipboardData?.getData("text/plain") ?? "").replace(
    /\D/g,
    ""
  );
  const el = e.target;
  const start = typeof el.selectionStart === "number" ? el.selectionStart : 0;
  const end = typeof el.selectionEnd === "number" ? el.selectionEnd : start;
  const disp = String(isRef(refTarget) ? refTarget.value : "");
  const curDigits = disp.replace(/\D/g, "");
  const sIdx = digitCountBeforeDisplayIndex(disp, start);
  const eIdx = digitCountBeforeDisplayIndex(disp, end);
  const merged = curDigits.slice(0, sIdx) + pasteDigits + curDigits.slice(eIdx);
  const digits = merged.replace(/\D/g, "");
  applySls01AmountValue(el, refTarget, digits, sIdx + pasteDigits.length);
  onChanged?.();
};

const onTargetSalesInput = (e) => onSls01AmountInput(e, targetSales);
const onTargetSalesPaste = (e) => onSls01AmountPaste(e, targetSales);
const onTargetSalesKeydown = (e) => onSls01AmountKeydown(e, targetSales);

/** 월매출목표액 = 달력 일별 목표액(title) 합계 */
const syncMonthTargetTotal = () => {
  const sum = rowData.value.reduce(
    (acc, item) => acc + (Number(parseSls01Amount(item.title)) || 0),
    0
  );
  targetMonthSales.value = formatSls01Amount(String(sum));
};
const setMonthSales = () => {
  if (!afterSearch.value) {
    warnSearchFirst();
    return;
  }
  const rawAmt = parseSls01Amount(targetSales.value);
  if (selectWeek.value != 0) {
    const filteredRowData = rowData.value.filter((item) => {
      return new Date(item.start).getDay() == selectWeek.value - 1;
    });
    filteredRowData.forEach((item) => {
      item.title = rawAmt;
      applySls01ChangedFlag(item);
    });
  } else {
    rowData.value.forEach((item) => {
      item.title = rawAmt;
      applySls01ChangedFlag(item);
    });
  }
};
const rowData = ref([]);
const rowData2 = ref([]);
const currentMonth = ref();
const currentYear = ref();
const sls01YearOptions = ref([]);
const sls01MonthOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const sls01SelectedYear = ref(null);
const sls01SelectedMonth = ref(null);

const syncSls01ExcelDateLabel = () => {
  if (sls01SelectedYear.value == null || sls01SelectedMonth.value == null) return;
  excelDate(
    `날짜 : ${sls01SelectedYear.value}-${String(sls01SelectedMonth.value).padStart(2, "0")}`
  );
};

const sls01PageReady = ref(false);
const pickStoreRef = ref(null);
const sls01RevertingStore = ref(false);
const sls01StoreChangeBusy = ref(false);
let sls01StoreCodeTimer = null;
let sls01StoreCodePending = null;

const normalizeSls01StoreCode = (code) =>
  code == null || code === "" || code === 0 ? 0 : Number(code);

const hasUnsavedSls01Changes = () => afterSearch.value && !isSls01RowDataSynced();

const confirmDiscardSls01Changes = async () => {
  const result = await Swal.fire({
    title: "확인",
    html: `입력한 매출계획이 저장되지 않았습니다.<br><span style="color:#dc2626;font-weight:600">계속 진행 하시겠습니까?</span>`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "예",
    cancelButtonText: "아니오",
    confirmButtonColor: "#6b7280",
    cancelButtonColor: "#d33",
  });
  return result.isConfirmed;
};

const confirmSls01DiscardIfNeeded = async () => {
  if (!hasUnsavedSls01Changes()) return true;
  return confirmDiscardSls01Changes();
};

const tryAutoSearch = async () => {
  if (!sls01PageReady.value) return true;
  const searched = await searchButton({
    skipUnsavedCheck: true,
    silentNoStore: true,
  });
  await ensureSls01SheetMatchesConditions();
  return searched;
};

const onSls01YearChange = async () => {
  const prevYear = currentYear.value;
  if (!(await confirmSls01DiscardIfNeeded())) {
    sls01SelectedYear.value = prevYear;
    return;
  }
  startYear(sls01SelectedYear.value);
  syncSls01ExcelDateLabel();
  await tryAutoSearch();
};

const onSls01MonthChange = async () => {
  const prevMonth = currentMonth.value;
  if (!(await confirmSls01DiscardIfNeeded())) {
    sls01SelectedMonth.value = prevMonth;
    return;
  }
  startMonth(sls01SelectedMonth.value);
  syncSls01ExcelDateLabel();
  await tryAutoSearch();
};

const shiftSls01Month = (delta) => {
  if (sls01SelectedYear.value == null || sls01SelectedMonth.value == null) return;
  const d = new Date(
    sls01SelectedYear.value,
    sls01SelectedMonth.value - 1 + delta,
    1
  );
  sls01SelectedYear.value = d.getFullYear();
  sls01SelectedMonth.value = d.getMonth() + 1;
  startYear(sls01SelectedYear.value);
  startMonth(sls01SelectedMonth.value);
  syncSls01ExcelDateLabel();
};

const handleSls01CalendarPrev = async () => {
  if (!(await confirmSls01DiscardIfNeeded())) return;
  shiftSls01Month(-1);
  await tryAutoSearch();
};

const handleSls01CalendarNext = async () => {
  if (!(await confirmSls01DiscardIfNeeded())) return;
  shiftSls01Month(1);
  await tryAutoSearch();
};

const initSls01DateSelectors = () => {
  const today = new Date();
  const initDate = new Date(today);
  initDate.setMonth(today.getMonth() - 1 + 1);
  const years = [];
  for (let y = today.getFullYear() - 8; y <= today.getFullYear() + 5; y++) {
    years.push(y);
  }
  sls01YearOptions.value = years.sort((a, b) => b - a);
  sls01SelectedYear.value = initDate.getFullYear();
  sls01SelectedMonth.value = initDate.getMonth() + 1;
  startYear(sls01SelectedYear.value);
  startMonth(sls01SelectedMonth.value);
  syncSls01ExcelDateLabel();
};

const clickedComment = ref("");
const clickedProj = ref("");
const clickedDate = ref("");

/**
 * 	시작 월
 */

const startMonth = (e) => {
  currentMonth.value = e;

  if (e == null || currentYear.value == null) return;
  selectedstartDate.value =
    currentYear.value +
    "-" +
    String(currentMonth.value).padStart(2, "0") +
    "-01";

  if (calendarRef.value) {
    const calendar = calendarRef.value.getApi(); // calendarRef에서 API 가져오기
    if (calendar) {
      calendar.gotoDate(selectedstartDate.value); // gotoDate는 calendar API에서 사용해야 함
    }
  }
  initGrid();
};
/**
 * 	시작 년
 */

const startYear = (e) => {
  currentYear.value = e;

  if (currentMonth.value == null || e == null) return;
  selectedstartDate.value =
    currentYear.value +
    "-" +
    String(currentMonth.value).padStart(2, "0") +
    "-01";

  if (calendarRef.value) {
    const calendar = calendarRef.value.getApi(); // calendarRef에서 API 가져오기
    if (calendar) {
      calendar.gotoDate(selectedstartDate.value); // gotoDate는 calendar API에서 사용해야 함
    }
  }
  initGrid();
};
const SLS01_SHEET_NONE = -1;
const selectSheet = ref(SLS01_SHEET_NONE);
const sls01LastValidSheetIndex = ref(SLS01_SHEET_NONE);
const excelRawSheets = ref([]);
const excelData = ref([]);
const excelUploadFormats = ref([]);
const excelName = ref("");
const hiddenFileRef = ref(null);

const sls01ExcelFileLoaded = computed(
  () => excelRawSheets.value.length > 0
);
const sls01ExcelUiKey = ref(0);
const sheetArr = ref([]);

const SLS01_WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];
const SLS01_EXCEL_HEADER_LEGACY = ["매장코드", "일자", "목표금액", "비고"];
const SLS01_EXCEL_HEADER_STORE = ["매장명", "일자", "목표금액", "비고"];
const SLS01_EXCEL_HEADER_LEGACY_WD = ["매장코드", "일자", "요일", "목표금액", "비고"];
const SLS01_EXCEL_HEADER_STORE_WD = ["매장명", "일자", "요일", "목표금액", "비고"];

const SLS01_EXCEL_HEADER_FORMATS = {
  [JSON.stringify(SLS01_EXCEL_HEADER_STORE)]: { type: "name", hasWeekday: false },
  [JSON.stringify(SLS01_EXCEL_HEADER_STORE_WD)]: { type: "name", hasWeekday: true },
  [JSON.stringify(SLS01_EXCEL_HEADER_LEGACY)]: { type: "code", hasWeekday: false },
  [JSON.stringify(SLS01_EXCEL_HEADER_LEGACY_WD)]: { type: "code", hasWeekday: true },
};

const normalizeSls01ExcelHeader = (header) => {
  if (!Array.isArray(header)) return [];
  return header.map((cell) => String(cell ?? "").trim());
};

const detectSls01ExcelHeaderFormat = (header) => {
  const normalized = normalizeSls01ExcelHeader(header);
  const exactKey = JSON.stringify(normalized);
  if (SLS01_EXCEL_HEADER_FORMATS[exactKey]) {
    return SLS01_EXCEL_HEADER_FORMATS[exactKey];
  }

  for (const [fmtKey, fmtVal] of Object.entries(SLS01_EXCEL_HEADER_FORMATS)) {
    const expected = JSON.parse(fmtKey);
    if (
      normalized.length >= expected.length &&
      expected.every((h, i) => normalized[i] === h)
    ) {
      return fmtVal;
    }
  }
  return null;
};

const getSls01ExcelFormatType = (format) =>
  typeof format === "string" ? format : format?.type ?? "code";

const getSls01WeekdayFromDateStr = (dateStr) => {
  const parts = String(dateStr ?? "")
    .split("-")
    .map(Number);
  if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) return -1;
  return new Date(parts[0], parts[1] - 1, parts[2]).getDay();
};

const getSls01WeekdayLabel = (dateStr) => {
  const dow = getSls01WeekdayFromDateStr(dateStr);
  return dow >= 0 ? SLS01_WEEKDAY_LABELS[dow] : "";
};

const getSls01PopupDateAtNoon = (dateStr) =>
  dateStr ? new Date(`${dateStr}T12:00:00`) : null;

const sls01PopupDateMain = computed(() => {
  const dateStr = clickedDate.value;
  if (!dateStr) return "—";
  const parts = parseSls01ExcelDateParts(dateStr);
  if (!parts) return dateStr;
  const { year, month, day } = parts;
  return `${year}년 ${month}월 ${day}일`;
});

const sls01PopupWeekday = computed(() =>
  getSls01WeekdayLabel(clickedDate.value)
);

const sls01PopupHolidayName = computed(() => {
  const d = getSls01PopupDateAtNoon(clickedDate.value);
  return d ? getKoreanPublicHolidayShortName(d) ?? "" : "";
});

const sls01PopupHolidayFullTitle = computed(() =>
  sls01PopupHolidayName.value || undefined
);

const sls01PopupDateWeekdayClass = computed(() => {
  const dateStr = clickedDate.value;
  if (!dateStr) return "";
  const d = getSls01PopupDateAtNoon(dateStr);
  if (d && getKoreanPublicHolidayShortName(d)) {
    return "sls01-day-popup__date-meta--holiday";
  }
  const dow = getSls01WeekdayFromDateStr(dateStr);
  if (dow === 0) return "sls01-day-popup__date-meta--sun";
  if (dow === 6) return "sls01-day-popup__date-meta--sat";
  return "";
});

const sls01PopupDateToneClass = computed(() => {
  const dateStr = clickedDate.value;
  if (!dateStr) return "";
  const d = getSls01PopupDateAtNoon(dateStr);
  if (d && getKoreanPublicHolidayShortName(d)) {
    return "sls01-day-popup__date-display--holiday";
  }
  const dow = getSls01WeekdayFromDateStr(dateStr);
  if (dow === 0) return "sls01-day-popup__date-display--sun";
  if (dow === 6) return "sls01-day-popup__date-display--sat";
  return "";
});

const getSls01CurrentStoreDisplayName = () => {
  if (selectedExcelStore.value) {
    const matched = String(selectedExcelStore.value).match(/매장명\s*:\s*(.+)/);
    if (matched) return matched[1].trim();
  }
  const found = store.state.storeCd?.find(
    (s) => String(s.lngStoreCode) === String(lngstorecode.value)
  );
  return found?.strName?.trim() ?? "";
};

const getSls01MonthLastDay = (year, month) =>
  new Date(year, month, 0).getDate();

const parseSls01ExcelDateParts = (dateStr) => {
  const parts = String(dateStr ?? "")
    .split("-")
    .map(Number);
  if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) return null;
  const [year, month, day] = parts;
  return { year, month, day };
};

/** 해당 월에 실제 존재하는 일자인지 (예: 6월 31일, 평년 2월 29일 → false) */
const isSls01ValidCalendarDate = (year, month, day) => {
  if (month < 1 || month > 12 || day < 1) return false;
  const lastDay = getSls01MonthLastDay(year, month);
  if (day > lastDay) return false;
  const d = new Date(year, month - 1, day);
  return (
    d.getFullYear() === year &&
    d.getMonth() === month - 1 &&
    d.getDate() === day
  );
};

const normalizeSls01ExcelDate = (val) => {
  if (val == null || val === "") return "";
  if (typeof val === "string") return val.split("T")[0].trim();
  return excelSerialDateToJSDate(val);
};

const parseSls01ExcelAmount = (val) => {
  if (val == null || val === "") return "0";
  const raw = String(val).replace(/,/g, "").trim();
  const n = Number(raw);
  return Number.isFinite(n) ? String(n) : "0";
};

const parseSls01ExcelRow = (row, format) => {
  const formatType = getSls01ExcelFormatType(format);
  const hasWeekday = format?.hasWeekday === true;
  const amountIdx = hasWeekday ? 3 : 2;
  const commentIdx = hasWeekday ? 4 : 3;

  return {
    매장코드: formatType === "code" ? row[0] ?? "" : "",
    매장명: formatType === "name" ? String(row[0] ?? "").trim() : "",
    일자: normalizeSls01ExcelDate(row[1]),
    요일: hasWeekday ? String(row[2] ?? "").trim() : "",
    목표금액: parseSls01ExcelAmount(row[amountIdx]),
    비고: row[commentIdx] ?? "",
  };
};

const validateSls01ExcelUploadRows = (rows, format, options = {}) => {
  const { skipStoreCheck = false } = options;

  if (!rows.length) {
    return { ok: false, message: "업로드할 데이터가 없습니다." };
  }

  const year = currentYear.value;
  const month = currentMonth.value;
  const storeName = getSls01CurrentStoreDisplayName();

  for (const row of rows) {
    const dateStr = normalizeSls01ExcelDate(row.일자);
    if (!dateStr) {
      return { ok: false, message: "일자 형식이 올바르지 않습니다." };
    }

    const parts = parseSls01ExcelDateParts(dateStr);
    if (!parts) {
      return { ok: false, message: "일자 형식이 올바르지 않습니다." };
    }

    const { year: rowYear, month: rowMonth, day: rowDay } = parts;
    if (rowYear !== year || rowMonth !== month) {
      return {
        ok: false,
        message: `업로드 파일의 일자가 조회된 ${year}년 ${month}월과 일치하지 않습니다.`,
      };
    }

    const lastDay = getSls01MonthLastDay(year, month);
    if (!isSls01ValidCalendarDate(rowYear, rowMonth, rowDay)) {
      return {
        ok: false,
        message: `${year}년 ${month}월은 ${lastDay}일까지입니다. 존재하지 않는 일자(${dateStr})가 포함되어 있습니다.`,
      };
    }

    if (!skipStoreCheck) {
      if (getSls01ExcelFormatType(format) === "name") {
        const rowStoreName = String(row.매장명 ?? "").trim();
        if (rowStoreName !== storeName) {
          return {
            ok: false,
            message: `업로드 파일의 매장명이 조회된 매장(${storeName})과 일치하지 않습니다.`,
          };
        }
      } else if (
        String(row.매장코드 ?? "").trim() !== String(lngstorecode.value)
      ) {
        return {
          ok: false,
          message: "업로드 파일의 매장코드가 조회된 매장과 일치하지 않습니다.",
        };
      }
    }
  }

  return { ok: true };
};

const getSls01ApiPayload = (res) => {
  const data = res?.data;
  if (data == null || data === "") return null;
  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }
  if (typeof data.d === "object" && data.d != null) return data.d;
  if (typeof data.d === "string") {
    try {
      return JSON.parse(data.d);
    } catch {
      return null;
    }
  }
  return data;
};

const isSls01ApiSuccess = (res) => {
  const payload = getSls01ApiPayload(res) ?? res?.data;
  if (!payload || typeof payload !== "object") return false;
  const cd = payload.RESULT_CD ?? payload.Result_CD ?? payload.result_cd;
  if (cd == null || cd === "") return false;
  return cd == "00" || String(cd).padStart(2, "0") === "00";
};

/** 저장 성공 시에만 호출 — 엑셀 업로드 UI·데이터 초기화 */
const resetSls01ExcelUpload = async () => {
  excelRawSheets.value = [];
    excelData.value = [];
  excelUploadFormats.value = [];
  sheetArr.value = [];
  selectSheet.value = SLS01_SHEET_NONE;
  sls01LastValidSheetIndex.value = SLS01_SHEET_NONE;
  excelName.value = "";
  const fileEl = hiddenFileRef.value ?? document.getElementById("hiddenFile");
  if (fileEl) fileEl.value = "";
  sls01ExcelUiKey.value += 1;
  await nextTick();
};

const buildSls01ExcelSheetName = () => {
  const year = currentYear.value;
  const month = String(currentMonth.value).padStart(2, "0");
  const storeName = getSls01CurrentStoreDisplayName() || "매장";
  const safeStoreName = storeName.replace(/[\\/?*[\]:]/g, "_").trim();
  const prefix = `${year}-${month} `;
  let name = `${prefix}${safeStoreName}`;
  if (name.length > 31) {
    name = prefix + safeStoreName.slice(0, Math.max(1, 31 - prefix.length));
  }
  return name || "Sheet1";
};

const buildSls01MonthExcelRows = () => {
  const year = currentYear.value;
  const month = currentMonth.value;
  const storeName = getSls01CurrentStoreDisplayName();
  const lastDay = getSls01MonthLastDay(year, month);
  const rows = [];

  for (let day = 1; day <= lastDay; day += 1) {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const item = rowData.value.find((r) => r.start === dateStr);
    const amount = item?.title ? parseSls01ExcelAmount(item.title) : "0";
    const comment = item?.strComment ? String(item.strComment) : "";
    rows.push([
      storeName,
      dateStr,
      getSls01WeekdayLabel(dateStr),
      formatSls01Amount(amount) || "0",
      comment,
    ]);
  }

  return rows;
};

const SLS01_EXCEL_BORDER = {
  top: "thin",
  left: "thin",
  bottom: "thin",
  right: "thin",
};

const sls01ExcelWeekendFont = (dow, size = 18) => {
  const font = { size };
  if (dow === 0) font.color = { rgb: "FFDC2626" };
  else if (dow === 6) font.color = { rgb: "FF2563EB" };
  return font;
};

const applySls01ExcelSheetStyle = (worksheet, monthRows, headerRgb = "FFD9EAD3") => {
  const rowCount = monthRows.length;
  const headerStyle = {
    fill: { fgColor: { rgb: headerRgb } },
    font: { bold: true, size: 18 },
    alignment: { horizontal: "center", vertical: "center" },
    border: SLS01_EXCEL_BORDER,
  };
  const dataStyle = {
    border: SLS01_EXCEL_BORDER,
    font: { size: 18 },
    alignment: { vertical: "center" },
  };
  const dateStyle = {
    border: SLS01_EXCEL_BORDER,
    font: { size: 18 },
    alignment: { horizontal: "center", vertical: "center" },
  };
  const weekdayStyle = {
    border: SLS01_EXCEL_BORDER,
    font: { size: 18 },
    alignment: { horizontal: "center", vertical: "center" },
  };
  const amountStyle = {
    border: SLS01_EXCEL_BORDER,
    font: { size: 18 },
    alignment: { horizontal: "right", vertical: "center" },
  };

  ["A1", "B1", "C1", "D1", "E1"].forEach((cell) => {
    if (worksheet[cell]) worksheet[cell].s = headerStyle;
  });

  for (let r = 2; r <= rowCount + 1; r += 1) {
    const dateStr = monthRows[r - 2]?.[1] ?? "";
    const dow = getSls01WeekdayFromDateStr(dateStr);
    const weekendFont = sls01ExcelWeekendFont(dow);

    ["A", "E"].forEach((col) => {
      const cell = `${col}${r}`;
      if (worksheet[cell]) worksheet[cell].s = dataStyle;
    });

    const dateCell = `B${r}`;
    if (worksheet[dateCell]) {
      worksheet[dateCell].s = {
        ...dateStyle,
        font: { ...dateStyle.font, ...weekendFont },
      };
    }

    const weekdayCell = `C${r}`;
    if (worksheet[weekdayCell]) {
      worksheet[weekdayCell].s = {
        ...weekdayStyle,
        font: { ...weekdayStyle.font, ...weekendFont },
      };
    }

    const amountCell = `D${r}`;
    if (worksheet[amountCell]) worksheet[amountCell].s = amountStyle;
  }

  worksheet["!rows"] = [{ hpt: 28 }, ...new Array(rowCount).fill({ hpt: 26 })];
};

const normalizeSls01Comment = (val) => String(val ?? "").trim();

const normalizeSls01AmtForCompare = (val) => {
  const parsed = parseSls01Amount(val);
  return parsed === "" ? "0" : parsed;
};

const serializeSls01RowDataForCompare = (items) =>
  [...(items ?? [])]
    .map((item) => ({
      start: String(item?.start ?? ""),
      title: normalizeSls01AmtForCompare(item?.title),
      strComment: normalizeSls01Comment(item?.strComment),
    }))
    .sort((a, b) => a.start.localeCompare(b.start));

const isSls01RowDataSynced = () =>
  JSON.stringify(serializeSls01RowDataForCompare(rowData.value)) ===
  JSON.stringify(serializeSls01RowDataForCompare(rowData2.value));

const getSls01BaselineByDate = () =>
  new Map(
    rowData2.value.map((item) => [
      item.start,
      {
        title: item.title,
        strComment: item.strComment ?? "",
      },
    ])
  );

const isSls01ValueChanged = (baseline, amt, comment) => {
  const baseAmt = normalizeSls01AmtForCompare(baseline?.title);
  const baseComment = normalizeSls01Comment(baseline?.strComment);
  const newAmt = normalizeSls01AmtForCompare(amt);
  const newComment = normalizeSls01Comment(comment);
  return newAmt !== baseAmt || newComment !== baseComment;
};

const applySls01ChangedFlag = (item) => {
  const baseline = getSls01BaselineByDate().get(item.start);
  item.sls01FromExcel = isSls01ValueChanged(
    baseline,
    item.title,
    item.strComment
  );
};

const applyExcelRowsToCalendar = (rows) => {
  if (!rows?.length) return false;

  const baselineByDate = getSls01BaselineByDate();

  const byDate = new Map(
    rowData.value.map((item) => [
      item.start,
      {
        start: item.start,
        title: item.title,
        strComment: item.strComment ?? "",
        sls01FromExcel: false,
      },
    ])
  );

  rows.forEach((row) => {
    const dateStr = normalizeSls01ExcelDate(row.일자);
    if (!dateStr) return;
    const newAmt = parseSls01ExcelAmount(row.목표금액);
    const newComment = row.비고 ?? "";
    const baseline = baselineByDate.get(dateStr);
    byDate.set(dateStr, {
      start: dateStr,
      title: newAmt,
      strComment: newComment,
      sls01FromExcel: isSls01ValueChanged(baseline, newAmt, newComment),
    });
  });

  rowData.value = Array.from(byDate.values()).sort((a, b) =>
    a.start.localeCompare(b.start)
  );
  syncMonthTargetTotal();
  return true;
};

/** sheet 선택 시 — 양식·일자·매장 등 전체 검증 후 파싱 */
const parseAndValidateSls01ExcelSheet = (sheetIndex) => {
  const raw = excelRawSheets.value[sheetIndex];
  const sheetName = sheetArr.value[sheetIndex]?.strName ?? raw?.sheetName ?? "";

  if (!raw?.jsonData?.length) {
    return { ok: false, message: "sheet 데이터가 없습니다.", sheetName };
  }

  const format = detectSls01ExcelHeaderFormat(raw.jsonData[0]);
  if (!format) {
    return {
      ok: false,
      message:
        "엑셀 형식이 올바르지 않습니다. (매장명/매장코드, 일자, 요일(선택), 목표금액, 비고)",
      sheetName,
    };
  }

  const rows = raw.jsonData
    .slice(1)
    .filter((row) => row && row[1] != null && row[1] !== "")
    .map((row) => parseSls01ExcelRow(row, format));

  if (!rows.length) {
    return { ok: false, message: "업로드할 데이터가 없습니다.", sheetName };
  }

  const validation = validateSls01ExcelUploadRows(rows, format);
  if (!validation.ok) {
    return { ok: false, message: validation.message, sheetName };
  }

  return { ok: true, rows, format, sheetName };
};

const forceSls01SheetSelect = async (sheetIndex) => {
  selectSheet.value = sheetIndex;
  sls01ExcelUiKey.value += 1;
  await nextTick();
};

const restoreSls01CalendarFromBaseline = () => {
  if (!afterSearch.value || !rowData2.value.length) return;
  rowData.value = rowData2.value.map((item) => ({
    title: item.title,
    start: item.start,
    strComment: item.strComment ?? "",
    sls01FromExcel: false,
  }));
  syncMonthTargetTotal();
};

const revertSls01SheetSelection = async (revertIndex) => {
  if (revertIndex >= 0 && revertIndex !== SLS01_SHEET_NONE) {
    const parsed = parseAndValidateSls01ExcelSheet(revertIndex);
    if (!parsed.ok) {
      sls01LastValidSheetIndex.value = SLS01_SHEET_NONE;
      restoreSls01CalendarFromBaseline();
      await forceSls01SheetSelect(SLS01_SHEET_NONE);
      return;
    }
    excelData.value[revertIndex] = parsed.rows;
    excelUploadFormats.value[revertIndex] = parsed.format;
    applyExcelRowsToCalendar(parsed.rows);
    sls01LastValidSheetIndex.value = revertIndex;
    await forceSls01SheetSelect(revertIndex);
    return;
  }

  sls01LastValidSheetIndex.value = SLS01_SHEET_NONE;
  restoreSls01CalendarFromBaseline();
  await forceSls01SheetSelect(SLS01_SHEET_NONE);
};

const loadSls01ExcelSheet = async (sheetIndex, options = {}) => {
  const { revertIndex = SLS01_SHEET_NONE, showAlert = true } = options;

  if (sheetIndex < 0 || !excelRawSheets.value[sheetIndex]) {
    await revertSls01SheetSelection(revertIndex);
    return false;
  }

  const parsed = parseAndValidateSls01ExcelSheet(sheetIndex);
  if (!parsed.ok) {
    if (showAlert) {
      await Swal.fire({
        title: "경고",
        text: parsed.sheetName
          ? `[${parsed.sheetName}] ${parsed.message}`
          : parsed.message,
        icon: "warning",
        confirmButtonText: "확인",
      });
    }
    await revertSls01SheetSelection(revertIndex);
    return false;
  }

  excelData.value[sheetIndex] = parsed.rows;
  excelUploadFormats.value[sheetIndex] = parsed.format;

  if (!applyExcelRowsToCalendar(parsed.rows)) {
    await revertSls01SheetSelection(revertIndex);
    return false;
  }

  sls01LastValidSheetIndex.value = sheetIndex;
  await forceSls01SheetSelect(sheetIndex);
  return true;
};

/** 년월·매장 변경 등으로 현재 sheet가 조건과 맞지 않으면 이전 유효 선택으로 복원 */
const ensureSls01SheetMatchesConditions = async (options = {}) => {
  const { showAlert = true } = options;
  if (selectSheet.value < 0 || !excelRawSheets.value.length) return;

  const currentIndex = Number(selectSheet.value);
  if (parseAndValidateSls01ExcelSheet(currentIndex).ok) return;

  if (showAlert) {
    await Swal.fire({
      title: "경고",
      text: "선택된 sheet가 현재 조회 조건(년월·매장)과 일치하지 않습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
  }

  const revertIndex =
    sls01LastValidSheetIndex.value !== currentIndex
      ? sls01LastValidSheetIndex.value
      : SLS01_SHEET_NONE;
  await revertSls01SheetSelection(revertIndex);
};

const onSls01SheetChange = async () => {
  const sheetIndex = Number(selectSheet.value);
  const previousIndex = sls01LastValidSheetIndex.value;

  if (sheetIndex < 0) {
    sls01LastValidSheetIndex.value = SLS01_SHEET_NONE;
    restoreSls01CalendarFromBaseline();
    return;
  }

  await loadSls01ExcelSheet(sheetIndex, {
    revertIndex: previousIndex,
  });
};

const readSls01ExcelWorkbook = (workbook) => {
  const rawSheets = [];
  const sheets = [];

    for (let i = 0; i < workbook.SheetNames.length; i++) {
      const sheetName = workbook.SheetNames[i];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = utils.sheet_to_json(worksheet, { header: 1 });
    rawSheets.push({ sheetName, jsonData });
    sheets.push({ lngCode: i, strName: sheetName });
  }

  return { rawSheets, sheets };
};

const finishSls01ExcelUpload = async () => {
  const count = sheetArr.value.length;
  selectSheet.value = SLS01_SHEET_NONE;
  sls01LastValidSheetIndex.value = SLS01_SHEET_NONE;

  if (count === 0) {
    Swal.fire({
      title: "경고",
      text: "업로드할 sheet가 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
        return;
      }

  if (count === 1) {
    const loaded = await loadSls01ExcelSheet(0, {
      revertIndex: SLS01_SHEET_NONE,
    });
    if (loaded) {
      await Swal.fire({
        title: "안내",
        text: "선택 된 엑셀파일이 로드 되었습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
    }
    return;
  }

  await Swal.fire({
    title: "안내",
    html: "선택 된 엑셀파일이 로드 되었습니다.<br>업로드 할 SHEET를 선택 해 주십시오!",
    icon: "success",
    confirmButtonText: "확인",
  });
};

const readExcel = (e) => {
  const fileInput = e.target;
  if (!afterSearch.value) {
    fileInput.value = "";
    warnSearchFirst();
    return;
  }
  const file = fileInput.files[0];
  if (!file) return;
  excelName.value = resolveSls01ExcelDisplayPath(fileInput, file);
  const reader = new FileReader();

  reader.readAsArrayBuffer(file);
  reader.onload = (ev) => {
    const data = new Uint8Array(ev.target.result);
    const workbook = read(data, { type: "array" });
    const { rawSheets, sheets } = readSls01ExcelWorkbook(workbook);

    if (!sheets.length) {
      Swal.fire({
        title: "경고",
        text: "업로드할 sheet가 없습니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      excelName.value = "";
      const fileEl = hiddenFileRef.value ?? document.getElementById("hiddenFile");
      if (fileEl) fileEl.value = "";
      return;
    }

    excelRawSheets.value = rawSheets;
    excelData.value = sheets.map(() => null);
    excelUploadFormats.value = sheets.map(() => null);
    sheetArr.value = sheets;
    finishSls01ExcelUpload();
  };
};

const syncClickedProjToRow = () => {
  const rawAmt = parseSls01Amount(clickedProj.value);
  rowData.value.forEach((item) => {
    if (item.start == clickedDate.value) {
      item.title = rawAmt;
      applySls01ChangedFlag(item);
    }
  });
};

const onClickedProjInput = (e) => {
  onSls01AmountInput(e, clickedProj, syncClickedProjToRow);
};

const onClickedProjKeydown = (e) => {
  if (e.key === "Enter" && !e.isComposing) {
    e.preventDefault();
    syncClickedProjToRow();
    advanceSls01DayPopupAfterAmtEnter();
    return;
  }
  onSls01AmountKeydown(e, clickedProj, syncClickedProjToRow);
};

const onClickedProjPaste = (e) => {
  onSls01AmountPaste(e, clickedProj);
  syncClickedProjToRow();
};

const changeComment = (e) => {
  clickedComment.value = e.target.value;
  rowData.value.forEach((item) => {
    if (item.start == clickedDate.value) {
      item.strComment = clickedComment.value;
      applySls01ChangedFlag(item);
    }
  });
};

const onClickedCommentKeydown = (e) => {
  if (e.key === "Enter" && !e.isComposing) {
    e.preventDefault();
    changeComment(e);
    closePopup();
  }
};

const saveUploadFile = async () => {
  if (!excelRawSheets.value.length) {
    Swal.fire({
      title: "경고",
      text: "엑셀파일을 먼저 업로드 해주세요!",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  if (selectSheet.value < 0) {
    Swal.fire({
      title: "경고",
      text: "sheet를 선택해 주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  const parsed = parseAndValidateSls01ExcelSheet(selectSheet.value);
  if (!parsed.ok) {
    Swal.fire({
      title: "경고",
      text: parsed.sheetName
        ? `[${parsed.sheetName}] ${parsed.message}`
        : parsed.message,
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  excelData.value[selectSheet.value] = parsed.rows;
  excelUploadFormats.value[selectSheet.value] = parsed.format;
  const sheetRows = parsed.rows;

  try {
    const dates = sheetRows.map((i) => i.일자).join(",");
    const projs = sheetRows
      .map((i) => Number(i.목표금액.replace(/,/g, "")))
      .join(",");
    const comments = sheetRows.map((i) => i.비고).join("\u2063");
    const res = await saveExcelDataPlan(
      lngstoregroup.value,
      lngstorecode.value,
      dates,
      projs,
      comments
    );

    if (!isSls01ApiSuccess(res)) {
      await Swal.fire({
        title: "실패",
        text: "저장에 실패했습니다.",
        icon: "error",
        confirmButtonText: "확인",
      });
      return;
    }

    await searchButton({ skipUnsavedCheck: true });
    await resetSls01ExcelUpload();
    await Swal.fire({
        title: "성공",
        text: "저장되었습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
  } catch (error) {
    await Swal.fire({
      title: "실패",
      text: "저장 중 오류가 발생했습니다.",
      icon: "error",
      confirmButtonText: "확인",
    });
  }
};

/**
 *  저장 버튼 함수
 */

const saveButton = async () => {
  if (currentYear.value == null || currentMonth.value == null) {
    Swal.fire({
      title: "경고",
      text: "날짜를 선택하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  if (isSls01RowDataSynced()) {
    Swal.fire({
      title: "경고",
      text: "변경된 사항이 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  try {
    Swal.fire({
      title: "저장",
      text: "저장하시겠습니까?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "확인",
      cancelButtonText: "취소",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const dates = rowData.value.map((i) => i.start).join(",");
          const projs = rowData.value
            .map((i) => parseSls01Amount(i.title))
            .join(",");
          const comments = rowData.value
            .map((i) => i.strComment)
            .join("\u2063");

          //comsole.log(dates, projs, comments);
          const res = await saveExcelDataPlan(
            lngstoregroup.value,
            lngstorecode.value,
            dates,
            projs,
            comments
          );

          if (!isSls01ApiSuccess(res)) {
            await Swal.fire({
              title: "실패",
              text: "저장에 실패했습니다.",
              icon: "error",
              confirmButtonText: "확인",
            });
            return;
          }

          await searchButton({ skipUnsavedCheck: true });
          await resetSls01ExcelUpload();
          await Swal.fire({
              title: "성공",
              text: "저장되었습니다.",
              icon: "success",
              confirmButtonText: "확인",
            });
        } catch (e) {
          await Swal.fire({
              title: "실패",
            text: "저장 중 오류가 발생했습니다.",
              icon: "error",
              confirmButtonText: "확인",
            });
        }
      }
    });
  } catch (error) {
    //comsole.log(error);
  } finally {
  }
};

const openPopUp = ref(false);
const sls01PopupAmtRef = ref(null);
const tempDate = ref("");

const focusSls01PopupAmt = () => {
  nextTick(() => {
    sls01PopupAmtRef.value?.focus();
  });
};

const closePopup = () => {
  openPopUp.value = false;
};

const positionSls01DayPopup = ({ jsEvent = null, dateStr = null } = {}) => {
  const margin = 8;
  const popupW = 300;
  const popupH = 268;

  let anchorX;
  let anchorY;

  if (jsEvent?.clientX != null && jsEvent?.clientY != null) {
    anchorX = jsEvent.clientX;
    anchorY = jsEvent.clientY;
  } else if (dateStr) {
    const cell = document.querySelector(
      `.sls01-cal-section .fc-daygrid-day[data-date="${dateStr}"]`
    );
    if (cell) {
      const rect = cell.getBoundingClientRect();
      anchorX = rect.left + rect.width / 2;
      anchorY = rect.top + rect.height / 2;
    }
  }

  if (anchorX == null || anchorY == null) return;

  let left = anchorX + margin;
  let top = anchorY + margin;
  if (left + popupW > window.innerWidth) {
    left = Math.max(margin, anchorX - popupW - margin);
  }
  if (top + popupH > window.innerHeight) {
    top = Math.max(margin, anchorY - popupH - margin);
  }
  popupLeft.value = `${left}px`;
  popupTop.value = `${top}px`;
};

const loadSls01DayPopupData = (dateStr) => {
  const popupInfo = rowData.value.find((item) => item.start === dateStr);
  if (!popupInfo) return false;
  clickedDate.value = popupInfo.start;
  clickedComment.value = popupInfo.strComment ?? "";
  clickedProj.value = formatSls01Amount(popupInfo.title);
  return true;
};

/** 조회 월 기준 다음 일자 (말일·타월이면 null) */
const getSls01NextDayInMonth = (dateStr) => {
  if (!dateStr || currentYear.value == null || currentMonth.value == null) {
    return null;
  }
  const parts = parseSls01ExcelDateParts(dateStr);
  if (!parts) return null;

  const { year, month, day } = parts;
  if (year !== currentYear.value || month !== currentMonth.value) return null;

  const lastDay = getSls01MonthLastDay(year, month);
  if (day >= lastDay) return null;

  const nextStr = `${year}-${String(month).padStart(2, "0")}-${String(day + 1).padStart(2, "0")}`;
  return rowData.value.some((item) => item.start === nextStr) ? nextStr : null;
};

const openSls01DayPopup = (dateStr, { jsEvent = null } = {}) => {
  if (!loadSls01DayPopupData(dateStr)) return false;
  positionSls01DayPopup({ jsEvent, dateStr: jsEvent ? null : dateStr });
  tempDate.value = dateStr;
  openPopUp.value = true;
  focusSls01PopupAmt();
  return true;
};

/** 목표액 Enter — 다음 날 팝업 (말일이면 닫기) */
const advanceSls01DayPopupAfterAmtEnter = () => {
  const nextDate = getSls01NextDayInMonth(clickedDate.value);
  if (!nextDate) {
    closePopup();
    return;
  }
  openSls01DayPopup(nextDate);
};

watch(openPopUp, (isOpen) => {
  if (!isOpen) return;
  focusSls01PopupAmt();
});

const isSls01OutsideCurrentMonth = (dateStr) => {
  if (!dateStr || currentYear.value == null || currentMonth.value == null) {
    return false;
  }
  const [y, m] = dateStr.split("-").map(Number);
  return y !== currentYear.value || m !== currentMonth.value;
};

const handleDateClick = (e) => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 진행해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return true;
  }

  if (isSls01OutsideCurrentMonth(e.dateStr)) {
    const clickedMonth = Number(e.dateStr.split("-")[1]);
    Swal.fire({
      title: "경고",
      text: `${clickedMonth}월 조회 후 등록 하세요.`,
      icon: "warning",
      confirmButtonText: "확인",
    });
    return true;
  }

  if (afterSearch.value && tempDate.value == e.dateStr) {
    openPopUp.value = !openPopUp.value;
    if (openPopUp.value) {
      loadSls01DayPopupData(e.dateStr);
      positionSls01DayPopup({ jsEvent: e.jsEvent });
      focusSls01PopupAmt();
    }
    return false;
  }
  if (afterSearch.value && tempDate.value != e.dateStr) {
    openSls01DayPopup(e.dateStr, { jsEvent: e.jsEvent });
  }
  return false;
};

/**
 * 	화면 Load시 실행 스크립트
 */

const sls01PageRef = ref(null);
const sls01CalBodyRef = ref(null);
const sls01CalBodyHeightPx = ref(480);
let sls01CalResizeObserver = null;

const sls01CalBodyStyle = computed(() => ({
  height: `${sls01CalBodyHeightPx.value}px`,
  flex: "0 0 auto",
}));

const calendarOptions = ref({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: "dayGridMonth",
  locale: koLocale,
  height: 480,
  expandRows: true,
  events: rowData.value,
  eventColor: "#6ee7b7",
  eventBorderColor: "#34d399",
  eventTextColor: "#065f46",
  dayCellClassNames: (arg) =>
    isKoreanPublicHoliday(arg.date) ? ["sls01-cal-holiday"] : [],
  dayCellContent: (arg) => {
    const holidayName = getKoreanPublicHolidayShortName(arg.date);
    if (!holidayName) {
      return { html: `<span class="fc-daygrid-day-number">${arg.dayNumberText}</span>` };
    }
    const holidayLabel = formatHolidayLabelForCalendar(holidayName);
    return {
      html: `<div class="sls01-cal-day-head">
        <span class="fc-daygrid-day-number">${arg.dayNumberText}</span>
        <span class="sls01-cal-day-holiday" title="${holidayName}">${holidayLabel}</span>
      </div>`,
    };
  },
  eventClassNames: (arg) =>
    arg.event.extendedProps.sls01FromExcel === true
      ? ["sls01-cal-event--from-excel"]
      : [],
  eventContent: function (arg) {
    const strComment = arg.event.extendedProps.strComment || "";
    const fromExcel = arg.event.extendedProps.sls01FromExcel === true;
    const title = formatSls01Amount(arg.event.title || "");

    return {
      html: `<div class="sls01-cal-event${
        strComment ? "" : " sls01-cal-event--amt-only"
      }">
                  ${
                    strComment
                      ? `<span class="sls01-cal-event__comment">${strComment}</span>`
                      : ""
                  }
                  <span class="sls01-cal-event__amt${
                    fromExcel ? " sls01-cal-event__amt--excel" : ""
                  }">${title}</span>
               </div>`,
    };
  },
  eventClick: function (event) {
    //comsole.log(event);
    const info = {
      dateStr: event.event.startStr,
      jsEvent: {
        clientX: event.jsEvent.clientX,
        clientY: event.jsEvent.clientY,
      },
    };
    if (handleDateClick(info)) return;

    const clickedElement = event.el;

    // 상위 4개 요소에 접근 (parentElement를 4번 사용)
    let parentElement = clickedElement;
    for (let i = 0; i < 4; i++) {
      parentElement = parentElement.parentElement;
    }

    // 모든 날짜에 대한 'clicked-day' 클래스를 리셋
    document.querySelectorAll(".fc-day").forEach((day) => {
      day.classList.remove("clicked-day");
    });

    // 클릭된 날짜에 'clicked-day' 클래스 추가
    parentElement.classList.add("clicked-day");
  },
  dateClick: function (info) {
    if (handleDateClick(info)) return;

    const clickedDate = info.dayEl;
    document.querySelectorAll(".fc-day").forEach((day) => {
      day.classList.remove("clicked-day");
    });
    clickedDate.classList.add("clicked-day");
  },
  headerToolbar: false,
  viewDidMount: () => {
    syncSls01CalendarSize();
  },
});

const sls01CalendarOptions = computed(() => ({
  ...calendarOptions.value,
  height: sls01CalBodyHeightPx.value,
}));

const syncSls01CalendarSize = () => {
  requestAnimationFrame(() => {
    nextTick(() => {
      const bodyEl = sls01CalBodyRef.value;
      if (!bodyEl) return;

      const bodyTop = bodyEl.getBoundingClientRect().top;
      const nextHeight = Math.max(
        420,
        Math.floor(window.innerHeight - bodyTop - 16)
      );

      if (sls01CalBodyHeightPx.value !== nextHeight) {
        sls01CalBodyHeightPx.value = nextHeight;
      }

      nextTick(() => {
        const api = calendarRef.value?.getApi?.();
        if (!api) return;
        api.setOption("height", sls01CalBodyHeightPx.value);
        api.updateSize();
      });
    });
  });
};

onMounted(async () => {
  initSls01DateSelectors();
  const pageLog = await insertPageLog(store.state.activeTab2);

  await nextTick();
  sls01PageReady.value = true;
  syncSls01CalendarSize();
  setTimeout(syncSls01CalendarSize, 150);
  setTimeout(syncSls01CalendarSize, 400);

  if (typeof ResizeObserver !== "undefined") {
    sls01CalResizeObserver = new ResizeObserver(() => syncSls01CalendarSize());
    if (sls01PageRef.value) sls01CalResizeObserver.observe(sls01PageRef.value);
    if (sls01CalBodyRef.value) sls01CalResizeObserver.observe(sls01CalBodyRef.value);
  }
  window.addEventListener("resize", syncSls01CalendarSize);
});

onUnmounted(() => {
  sls01CalResizeObserver?.disconnect();
  window.removeEventListener("resize", syncSls01CalendarSize);
});

watch(
  rowData,
  () => {
    calendarOptions.value.events = [...rowData.value];
    syncMonthTargetTotal();
  },
  { deep: true }
);

const documentSubTitle = ref();
const selectedExcelDate = ref();
const selectedExcelStore = ref();
const selectedstartDate = ref();
const selectedendDate = ref();

const WeekDays = ref([
  { lngCode: 1, strName: "일요일" },
  { lngCode: 2, strName: "월요일" },
  { lngCode: 3, strName: "화요일" },
  { lngCode: 4, strName: "수요일" },
  { lngCode: 5, strName: "목요일" },
  { lngCode: 6, strName: "금요일" },
  { lngCode: 7, strName: "토요일" },
]);

/**
 * 엑셀용 일자 세팅 함수
 */

const excelDate = (e) => {
  selectedExcelDate.value = e;
};
/**
 * 엑셀용 매장 세팅 함수
 */

const excelStore = (e) => {
  selectedExcelStore.value = e;
};
const lngstoregroup = ref();
const lngstoreattr = ref();
const lngstoreteam = ref();
const lngstoresupervisor = ref();
const lngstorecode = ref();
const maxSaleTarget = ref("");
const checked = ref(0);

/**
 * 페이지 매장 그룹 세팅
 */

const lngStoreGroup = (e) => {
  lngstoregroup.value = e;
  //comsole.log(e);
  initGrid();
};

/**
 * 페이지 매장 분류 세팅
 */

const lngStoreAttrs = (e) => {
  lngstoreattr.value = e;
  //comsole.log(e);
  initGrid();
};
/**
 * 페이지 매장 팀 세팅
 */

const lngStoreTeam = (e) => {
  lngstoreteam.value = e;
  //comsole.log(e);
  initGrid();
};
/**
 * 페이지 매장 슈퍼바이저 세팅
 */

const lngSupervisor = (e) => {
  lngstoresupervisor.value = e;
  //comsole.log(e);
  initGrid();
};
/**
 * 페이지 매장 코드 세팅
 */

const applyLngStoreCodeChange = async (e) => {
  if (sls01RevertingStore.value) {
  lngstorecode.value = e;
    return;
  }
  if (sls01StoreChangeBusy.value) {
    sls01StoreCodePending = e;
    return;
  }

  const prevCode = lngstorecode.value;
  const prevNormalized = normalizeSls01StoreCode(prevCode);
  const nextNormalized = normalizeSls01StoreCode(e);

  if (nextNormalized === prevNormalized) {
    lngstorecode.value = e;
    return;
  }

  sls01StoreChangeBusy.value = true;
  try {
    if (!(await confirmSls01DiscardIfNeeded())) {
      sls01RevertingStore.value = true;
      pickStoreRef.value?.setStoreCode(
        prevNormalized === 0 ? null : prevCode
      );
      sls01RevertingStore.value = false;
      return;
    }

    lngstorecode.value = e;
  initGrid();
    await tryAutoSearch();
  } finally {
    sls01StoreChangeBusy.value = false;
    const pending = sls01StoreCodePending;
    sls01StoreCodePending = null;
    if (
      pending != null &&
      normalizeSls01StoreCode(pending) !== normalizeSls01StoreCode(lngstorecode.value)
    ) {
      await applyLngStoreCodeChange(pending);
    }
  }
};

/** PickStoreSingle 연속 emit(0 → 매장코드) 시 미저장 확인 1회만 */
const lngStoreCode = (e) => {
  if (sls01RevertingStore.value) {
    lngstorecode.value = e;
    return;
  }
  sls01StoreCodePending = e;
  if (sls01StoreCodeTimer) clearTimeout(sls01StoreCodeTimer);
  sls01StoreCodeTimer = setTimeout(() => {
    const nextCode = sls01StoreCodePending;
    sls01StoreCodePending = null;
    sls01StoreCodeTimer = null;
    applyLngStoreCodeChange(nextCode);
  }, 0);
};

const store = useStore();

//comsole.log(store);

const afterSearch = ref(false);
/**
 *  조회 함수
 */

const searchButton = async (options = {}) => {
  const opts =
    options?.target instanceof HTMLElement ? {} : options || {};
  const { skipUnsavedCheck = false, silentNoStore = false } = opts;

  if (currentYear.value == null || currentMonth.value == null) {
    Swal.fire({
      title: "경고",
      text: "날짜를 선택하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  if (lngstorecode.value == 0) {
    if (!silentNoStore) {
    Swal.fire({
      title: "경고",
      text: "매장을 선택하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    }
    return false;
  }
  if (!skipUnsavedCheck && hasUnsavedSls01Changes()) {
    if (!(await confirmDiscardSls01Changes())) return false;
  }
  store.state.loading = true;
  try {
    const res = await getProjByMonth(
      lngstoregroup.value,
      lngstorecode.value,
      selectedstartDate.value
    );
    //comsole.log(res);
    afterSearch.value = true;
    rowData2.value = JSON.parse(JSON.stringify(res.data.List));

    rowData.value = res.data.List.map((item) => ({
      title: item.lngProjAmt,
      start: item.dtmDate,
      strComment: item.strComment,
      sls01FromExcel: false,
    }));
    rowData2.value = JSON.parse(
      JSON.stringify(
        res.data.List.map((item) => ({
          title: item.lngProjAmt,
          start: item.dtmDate,
          strComment: item.strComment,
        }))
      )
    );

    // if (rowData.value.length > 0) {
    //     maxSaleTarget.value = rowData.value.map(i => i.lngProject)[0].toLocaleString();
    // }
  } catch (error) {
    afterSearch.value = false;
    return;
  } finally {
    store.state.loading = false;
    targetSales.value = "";
    selectWeek.value = 0;
    syncSls01CalendarSize();
  }
  return true;
};

const downloadSample = () => {
  if (!afterSearch.value) {
    warnSearchFirst();
    return;
  }
  if (lngstorecode.value == 0) {
    Swal.fire({
      title: "경고",
      text: "매장을 선택하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  const storeName = getSls01CurrentStoreDisplayName();
  const monthRows = buildSls01MonthExcelRows();
  const data = [SLS01_EXCEL_HEADER_STORE_WD, ...monthRows];
  const worksheet = utils.aoa_to_sheet(data);

  worksheet["!cols"] = [
    { wch: 24 },
    { wch: 14 },
    { wch: 8 },
    { wch: 16 },
    { wch: 40 },
  ];

  applySls01ExcelSheetStyle(worksheet, monthRows);

  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, buildSls01ExcelSheetName());

  const safeStoreName = storeName.replace(/[\\/:*?"<>|]/g, "_") || "매장";
  const fileName = `${currentYear.value}년${String(currentMonth.value).padStart(2, "0")}월_매출계획_${safeStoreName}.xlsx`;
  writeFile(workbook, fileName);
};

const calendarRef = ref(null);
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

  const events = rowData.value.map((event) => ({
    date: new Date(event.start),
    amount: formatSls01Amount(event.title),
    comment: event.strComment,
  }));

  const allDates = events.map((e) => e.date);
  const minDate = new Date(Math.min(...allDates));
  const maxDate = new Date(Math.max(...allDates));
  const year = minDate.getFullYear();
  const month = minDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const totalDays = lastDay.getDate();

  let calendarData = [["일", "월", "화", "수", "목", "금", "토"]];

  // 월과 년을 하나의 셀로 가로로 병합하여 추가
  const headerRow = [
    "",
    "",
    {
      v: `${currentYear.value}년 ${currentMonth.value}월`,
      s: { alignment: { horizontal: "center" }, wrapText: true },
    },
    "",
    "",
    "",
    "",
  ];

  // 첫 번째 행에 월과 년 정보 추가
  calendarData.unshift(headerRow);

  // 데이터를 계속해서 채워넣기
  let week = new Array(7).fill("");
  for (let d = 1; d <= totalDays; d++) {
    let currentDate = new Date(year, month, d);
    let dayOfWeek = currentDate.getDay();

    let event = events.find((e) => e.date.getDate() === d);
    week[dayOfWeek] = event
      ? `${d}일 \n ${event.amount} \n ${event.comment}`
      : `${d}`;

    if (dayOfWeek === 6 || d === totalDays) {
      calendarData.push(week);
      week = new Array(7).fill("");
    }
  }

  // worksheet 생성
  const worksheet = utils.aoa_to_sheet(calendarData);

  // 셀 병합 (월과 년을 하나의 셀로 가로로 병합)
  worksheet["!merges"] = [
    { s: { r: 0, c: 2 }, e: { r: 0, c: 3 } }, // 첫 번째 행에서 '월'과 '년'을 병합
  ];

  // 행 높이 조정 (한 셀을 넓게 보이도록)
  worksheet["!rows"] = new Array(calendarData.length).fill({ hpt: 65 }); // 40pt 높이

  // 열 너비 조정 (요일과 날짜가 잘 보이도록)
  worksheet["!cols"] = new Array(7).fill({ wch: 36 }); // 열 너비 15칸

  // 스타일 적용 (모든 셀에 대해 정렬과 텍스트 개행 적용)
  // Object.keys(worksheet).forEach(cellRef => {
  //     if (cellRef[0] === "!") return; // "!merges", "!cols" 등은 무시

  //     const cell = worksheet[cellRef];

  //     if (cell && cell.v !== undefined) {
  //         cell.s = {
  //             alignment: { horizontal: "center", vertical: "center", wrapText: true }
  //         };
  //     }
  // });
  Object.keys(worksheet).forEach((cellRef) => {
    if (cellRef[0] === "!") return; // "!merges", "!cols" 등은 무시

    const cell = worksheet[cellRef];

    if (cell && cell.v !== undefined) {
      // 기본 스타일: 가운데 정렬, 개행 처리
      const style = {
        alignment: { horizontal: "center", vertical: "center", wrapText: true },
      };

      // 셀 참조에서 숫자(행 번호) 추출 (예: "B3" -> 3)
      const rowNumberMatch = cellRef.match(/\d+/);
      if (rowNumberMatch && Number(rowNumberMatch[0]) > 1) {
        // 1행이 아닌 경우 테두리 추가 (굵은 테두리)
        style.border = {
          top: { style: "thick", color: { rgb: "000000" } },
          bottom: { style: "thick", color: { rgb: "000000" } },
          left: { style: "thick", color: { rgb: "000000" } },
          right: { style: "thick", color: { rgb: "000000" } },
        };
      }

      cell.s = style;
    }
  });

  //comsole.log(calendarData);
  // 워크북에 시트 추가
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, "월별 목표금액 달력");

  // 파일 저장
  writeFile(
    workbook,
    `${currentYear.value}년 ${currentMonth.value}월 계획 달력.xlsx`
  );
};
/**
 * 그리드 초기화
 */

const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }

  afterSearch.value = false;
  targetSales.value = "";
  targetMonthSales.value = formatSls01Amount("0");
  selectWeek.value = 0;
};
</script>
<style scoped>
/* search-area-layout — 2열 그리드, 라벨 열 통일·가운데 (PUR02_017INS / CRM01) */
.sls01-search-grid {
  display: grid;
  width: 100%;
  min-width: 0;
  align-items: center;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: var(--sls01-item-gap);
  row-gap: var(--sls01-row-gap);
}

.sls01-wire-cell {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 0.5rem;
}

.sls01-wire-span-full {
  grid-column: 1 / -1;
}

.sls01-pss-row {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  width: 100%;
  min-width: 0;
  align-items: center;
}

.sls01-sheet-brand {
  width: 4.5rem;
  min-width: 3.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
}

.sls01-excel-store-col {
  grid-column: 2;
  align-self: center;
}

.sls01-pick-span {
  grid-column: 2;
  grid-row: 1 / 3;
  align-self: start;
  min-width: 0;
  width: 100%;
  overflow-x: hidden;
}

.sls01-page {
  --sls01-layout-offset: 12.5rem;
  min-height: calc(100vh - var(--sls01-layout-offset));
}

@media (max-width: 1440px) {
  .sls01-page {
    --sls01-layout-offset: 11.25rem;
  }
}

/* 달력 상단 — 년월 + 월매출목표액 + 이전/다음 */
.sls01-cal-section {
  min-width: 0;
  flex: 1 1 0;
  min-height: 0;
}

.sls01-cal-toolbar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.375rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid rgb(191 219 254);
  border-radius: 0.5rem;
  background: linear-gradient(180deg, rgb(248 250 252) 0%, rgb(239 246 255) 100%);
  box-shadow: 0 1px 2px rgb(59 130 246 / 0.08);
}

.sls01-cal-nav {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 2.25rem;
  height: 2.25rem;
  padding: 0;
  font-size: 1.375rem;
  font-weight: 600;
  line-height: 1;
  color: rgb(30 64 175);
  background: #fff;
  border: 1px solid rgb(147 197 253);
  border-radius: 0.375rem;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease;
}

.sls01-cal-nav:hover {
  background: rgb(239 246 255);
  border-color: rgb(96 165 250);
  box-shadow: 0 1px 3px rgb(59 130 246 / 0.15);
}

.sls01-cal-toolbar__main {
  display: flex;
  flex: 1;
  min-width: 0;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.625rem 1.25rem;
}

.sls01-cal-toolbar__title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: rgb(30 41 59);
  white-space: nowrap;
}

.sls01-cal-toolbar__total {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  max-width: 100%;
  padding: 0.3125rem 0.75rem;
  border: 1px solid rgb(191 219 254);
  border-radius: 9999px;
  background: rgb(236 242 255);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.7);
}

.sls01-cal-toolbar__total-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: rgb(71 85 105);
  white-space: nowrap;
}

.sls01-cal-toolbar__total-value {
  font-size: 1.0625rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: rgb(30 64 175);
  white-space: nowrap;
}

.sls01-cal-body {
  min-width: 0;
  width: 100%;
  overflow: hidden;
}

.sls01-cal-fc,
.sls01-cal-body :deep(.fc),
.sls01-cal-body :deep(.fc-view-harness),
.sls01-cal-body :deep(.fc-view-harness-active) {
  height: 100% !important;
  width: 100%;
}

.sls01-cal-body :deep(.fc-daygrid-body) {
  width: 100% !important;
}

.sls01-foot-span {
  grid-column: 1 / -1;
  padding-top: 0.25rem;
}

.sls01-hint {
  min-width: 0;
}

.sls01-file-input {
  flex: 1 1 0;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 조회 결과 표시 — 입력 옵션(흰 배경)과 구분 */
.sls01-result-input {
  background-color: rgb(236 242 255) !important;
  border-color: rgb(191 219 254) !important;
  color: rgb(30 64 175) !important;
  font-weight: 600;
  cursor: default;
}

.sls01-result-input:disabled {
  opacity: 1;
}

.sls01-wire-label {
  flex: 0 0 var(--sls01-label-col);
  width: var(--sls01-label-col);
  min-width: var(--sls01-label-col);
  max-width: var(--sls01-label-col);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9375rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
  text-align: center;
  white-space: nowrap;
  overflow: visible;
  padding: 0 0.125rem;
  box-sizing: border-box;
}

.sls01-wire-field {
  display: flex;
  min-width: 0;
  max-width: 100%;
  flex: 1 1 auto;
  align-items: center;
}

.sls01-wire-field:not(.sls01-inline-ops):not(.sls01-date-slot) > * {
  min-width: 0;
  width: 100%;
}

.sls01-inline-ops {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.sls01-inline-label {
  font-size: 0.9375rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
  white-space: nowrap;
}

.sls01-week-select {
  width: var(--sls01-week-col);
  min-width: var(--sls01-week-col);
  max-width: var(--sls01-week-col);
}

.sls01-month-select {
  width: var(--sls01-month-col);
  min-width: var(--sls01-month-col);
  max-width: var(--sls01-month-col);
}

.sls01-sheet-select {
  width: 12rem;
  min-width: 12rem;
  max-width: 12rem;
}

.sls01-search-panel select.sls01-sheet-select:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  background-color: rgb(243 244 246);
}

.sls01-search-panel select.sls01-sg-select {
  box-sizing: border-box;
  border: 1px solid var(--sls01-control-border) !important;
}

.sls01-search-panel select.sls01-sg-select:focus {
  border-color: #3b82f6 !important;
}

.sls01-search-panel .sls01-sg-input {
  box-sizing: border-box;
  border: 1px solid var(--sls01-control-border) !important;
}

.sls01-search-panel .sls01-sg-input:focus {
  border-color: #3b82f6 !important;
}

/* 보조버튼 — CRM01 팝업 톤 + 연한 파란색(회색 패널에서 구분) */
.sls01-sub-btn {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  height: 2rem;
  min-height: 2rem;
  padding: 0 0.625rem;
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1.2;
  white-space: nowrap;
  color: rgb(30 64 175);
  border: 1px solid rgb(147 197 253);
  border-radius: 0.375rem;
  background-color: rgb(239 246 255);
  box-shadow: 0 1px 2px 0 rgb(59 130 246 / 0.08);
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease;
  cursor: pointer;
}

.sls01-sub-btn:hover:not(:disabled) {
  background-color: rgb(219 234 254);
  border-color: rgb(96 165 250);
}

.sls01-sub-btn--download {
  padding-left: 0.5rem;
}

.sls01-sub-btn__excel-icon {
  display: inline-block;
  flex-shrink: 0;
  width: 0.875rem;
  height: 0.875rem;
  background-color: #217346;
  mask: url("@/assets/images/button/excel_w.svg") no-repeat center / contain;
  -webkit-mask: url("@/assets/images/button/excel_w.svg") no-repeat center / contain;
}

.sls01-sub-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.sls01-pick-span :deep(.pss-select),
.sls01-pick-span :deep(.vs__dropdown-toggle) {
  border: 1px solid var(--sls01-control-border) !important;
  box-sizing: border-box;
}

.sls01-popup-layer {
  pointer-events: none;
}

.sls01-popup-backdrop {
  position: absolute;
  inset: 0;
  background: rgb(15 23 42 / 0.25);
  pointer-events: auto;
}

.sls01-day-popup {
  width: min(18.75rem, calc(100vw - 1rem));
  background: #fff;
  border: 1px solid rgb(120 113 108);
  border-radius: 0.5rem;
  box-shadow:
    0 10px 15px -3px rgb(0 0 0 / 0.14),
    0 20px 40px -8px rgb(0 0 0 / 0.2),
    0 0 0 2px rgb(245 158 11 / 0.35);
  overflow: hidden;
  pointer-events: auto;
}

.sls01-day-popup__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: linear-gradient(90deg, rgb(68 64 60), rgb(41 37 36));
  color: #fff;
  border-bottom: 2px solid rgb(245 158 11);
}

.sls01-day-popup__title {
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.sls01-day-popup__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  padding: 0;
  font-size: 1.25rem;
  line-height: 1;
  color: #fff;
  background: rgb(255 255 255 / 0.15);
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.sls01-day-popup__close:hover {
  background: rgb(255 255 255 / 0.28);
}

.sls01-day-popup__body {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  padding: 0.75rem;
  background: #fff;
}

.sls01-day-popup__row {
  display: grid;
  grid-template-columns: 3.75rem minmax(0, 1fr);
  align-items: center;
  gap: 0.5rem;
}

.sls01-day-popup__label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: rgb(55 65 81);
  text-align: right;
  white-space: nowrap;
}

.sls01-day-popup__input {
  box-sizing: border-box;
  width: 100%;
  height: 2rem;
  min-height: 2rem;
  padding: 0 0.5rem;
  font-size: 0.875rem;
  color: rgb(17 24 39);
  background: #fff;
  border: 1px solid rgb(203 213 225);
  border-radius: 0.375rem;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.sls01-day-popup__input:focus {
  border-color: rgb(217 119 6);
  box-shadow: 0 0 0 2px rgb(245 158 11 / 0.3);
}

.sls01-day-popup__input--readonly {
  background: rgb(248 250 252);
  color: rgb(71 85 105);
  cursor: default;
}

.sls01-day-popup__date-wrap {
  display: flex;
  justify-content: center;
  width: 100%;
}

.sls01-day-popup__date-display {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.25rem 0.375rem;
  width: 100%;
  min-height: 2.5rem;
  padding: 0.375rem 0.625rem;
  font-size: 1.0625rem;
  letter-spacing: -0.02em;
  text-align: center;
  background: linear-gradient(180deg, rgb(248 250 252) 0%, rgb(241 245 249) 100%);
  border: 1px solid rgb(203 213 225);
  border-radius: 0.375rem;
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 0.85),
    0 1px 2px rgb(15 23 42 / 0.06);
}

.sls01-day-popup__date-main {
  font-weight: 700;
  color: rgb(17 24 39);
}

.sls01-day-popup__date-meta {
  font-weight: 700;
  color: rgb(55 65 81);
}

.sls01-day-popup__date-meta--holiday,
.sls01-day-popup__date-meta--sun {
  color: rgb(185 28 28);
}

.sls01-day-popup__date-meta--sat {
  color: rgb(29 78 216);
}

.sls01-day-popup__date-display--holiday,
.sls01-day-popup__date-display--sun {
  background: linear-gradient(180deg, rgb(255 241 242) 0%, rgb(254 226 226) 100%);
  border-color: rgb(248 113 113);
}

.sls01-day-popup__date-display--sat {
  background: linear-gradient(180deg, rgb(239 246 255) 0%, rgb(191 219 254) 100%);
  border-color: rgb(96 165 250);
}

.sls01-day-popup__input--amount {
  text-align: right;
  font-weight: 600;
  color: rgb(146 64 14);
}

.sls01-day-popup__footer {
  display: flex;
  justify-content: flex-end;
  padding: 0.5rem 0.75rem 0.75rem;
  background: rgb(255 251 235);
  border-top: 1px solid rgb(253 230 138);
}

.sls01-day-popup__btn {
  box-sizing: border-box;
  height: 2rem;
  min-height: 2rem;
  padding: 0 1rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #fff;
  background: rgb(217 119 6);
  border: 1px solid rgb(180 83 9);
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.sls01-day-popup__btn:hover {
  background: rgb(180 83 9);
}
</style>

<style>
/* SLS01 달력 — 그리드·요일·이벤트 균일 크기 */
.sls01-cal-section .fc-scroller,
.sls01-cal-section .fc-scroller-harness,
.sls01-cal-section .fc-scroller-liquid-absolute {
  overflow: hidden !important;
}

.sls01-cal-section .fc-scrollgrid {
  height: 100% !important;
}

.sls01-cal-section .fc-scrollgrid-sync-table {
  table-layout: fixed;
  width: 100% !important;
}

.sls01-cal-section .fc-daygrid-day-top {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 1.375rem;
  flex-shrink: 0;
  overflow: visible;
}

.sls01-cal-section .sls01-cal-day-head {
  position: relative;
  display: inline-block;
  height: 1.375rem;
  line-height: 1.375rem;
  vertical-align: top;
}

.sls01-cal-section .sls01-cal-day-holiday {
  position: absolute;
  left: calc(100% + 0.125rem);
  bottom: 0.125rem;
  max-width: 4.75rem;
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1.1;
  color: rgb(220 38 38);
  white-space: nowrap;
  pointer-events: auto;
}

.sls01-cal-section .fc-daygrid-day-number {
  float: none !important;
  display: inline-block;
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.3;
  vertical-align: middle;
}

.sls01-cal-section .fc-col-header-cell,
.sls01-cal-section .fc-daygrid-day {
  width: 14.2857%;
}

.sls01-cal-section .fc-daygrid-day-frame {
  display: flex;
  flex-direction: column;
  min-height: 3.25rem;
  height: 100%;
  box-sizing: border-box;
}

.sls01-cal-section .fc-daygrid-day-events {
  flex: 1 1 auto;
  min-height: 0;
  margin-top: 0.125rem;
  margin-bottom: 0;
}

.sls01-cal-section .fc-daygrid-event-harness {
  margin-bottom: 0 !important;
}

.sls01-cal-section .fc-daygrid-block-event .fc-event {
  min-height: 2.5rem;
  height: 100%;
}

.sls01-cal-section .fc-daygrid-block-event .fc-event-main {
  height: 100%;
}

.sls01-cal-section .sls01-cal-event {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.125rem;
  height: 100%;
  min-height: 0;
  padding: 0.125rem 0.25rem;
  box-sizing: border-box;
  overflow: hidden;
  line-height: 1.25;
}

.sls01-cal-section .sls01-cal-event--amt-only {
  justify-content: flex-end;
}

.sls01-cal-section .sls01-cal-event__comment {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.8125rem;
}

.sls01-cal-section .sls01-cal-event__amt {
  display: block;
  font-size: clamp(0.875rem, 2.2vh, 1.0625rem);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.sls01-cal-section .sls01-cal-event__amt--excel {
  color: rgb(126 28 158) !important;
}

.sls01-cal-section .fc-daygrid-event-harness .fc-event.sls01-cal-event--from-excel,
.sls01-cal-section .fc-h-event.sls01-cal-event--from-excel {
  background-color: rgb(254 240 138) !important;
  border-color: rgb(234 179 8) !important;
}

.sls01-cal-section .fc-event.sls01-cal-event--from-excel .sls01-cal-event__comment {
  color: rgb(55 65 81) !important;
}

.sls01-cal-section .fc-event,
.sls01-cal-section .fc-event-dot {
  font-size: 16px !important;
}

.sls01-cal-section .fc-daygrid-event-harness .fc-event,
.sls01-cal-section .fc-h-event {
  background-color: rgb(167 243 208) !important;
  border-color: rgb(52 211 153) !important;
}

.sls01-cal-section .fc-event-main,
.sls01-cal-section .sls01-cal-event {
  color: rgb(6 78 59) !important;
}

.sls01-cal-section .fc-day-sun .fc-daygrid-day-frame {
  background-color: rgb(255 241 242);
}

.sls01-cal-section .fc-day-sat .fc-daygrid-day-frame {
  background-color: rgb(219 234 254);
}

.sls01-cal-section .fc-daygrid-day.sls01-cal-holiday .fc-daygrid-day-number {
  color: rgb(220 38 38) !important;
  font-weight: 700;
}

.sls01-cal-section .fc-day-today .fc-daygrid-day-number {
  font-weight: 700;
}

.sls01-cal-section .fc-col-header-cell.fc-day-sun .fc-col-header-cell-cushion {
  color: rgb(220 38 38);
  font-weight: 700;
}

.sls01-cal-section .fc-col-header-cell.fc-day-sat .fc-col-header-cell-cushion {
  color: rgb(37 99 235);
  font-weight: 700;
}

.sls01-cal-section .fc-day.clicked-day {
  background-color: rgb(209 250 229) !important;
}

.sls01-cal-section .fc-day.clicked-day .fc-daygrid-day-frame {
  background-color: rgb(209 250 229) !important;
}
</style>
