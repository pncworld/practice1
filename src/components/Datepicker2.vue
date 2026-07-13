<template>
  <!-- @click.stop: 조회 영역 부모(handleParentClick→closePopUp)가 버블로 받아 기간 패널이 바로 닫히는 것 방지 -->
  <div
    class="flex justify-start items-center"
    :class="
      filterBarAlign
        ? /* 조회 그리드 셀 안: shrink-0·w-auto면 내용 최소폭으로 옆 열(라벨)과 겹침 → min-w-0·줄어듦 허용 */
          'mt-0 w-full min-w-0 max-w-full shrink gap-x-2'
        : 'mt-2 w-[500px] space-x-5'
    "
    @click.stop>
    <div
      v-if="!omitMainLabel"
      class="w-auto flex shrink-0 items-center text-nowrap text-base font-semibold leading-none"
      :class="filterBarAlign ? '' : 'ml-12'">
      {{ mainName }}
    </div>
    <!-- filterBarAlign: fr 그리드는 칸 사이가 과하게 벌어짐 → inline-flex로 From ~ To 밀착 -->
    <div
      class="justify-start"
      :class="
        filterBarAlign
          ? 'inline-flex h-8 shrink-0 items-center gap-x-1 pr-0'
          : 'grid h-11 grid-cols-[2fr,1fr,2fr,1fr,1fr] grid-rows-1 space-x-1 pr-14'
      ">
      <input
        type="date"
        :disabled="disable"
        class="w-36 shrink-0"
        :class="
          filterBarAlign
            ? 'h-8 border border-gray-800 rounded-md pl-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-white disabled:text-slate-400'
            : 'mr-2 h-10 border rounded-lg pl-5 text-base disabled:bg-gray-500'
        "
        v-model="selectedStartDate"
        @change="changeStartDate"
        :max="maxEndDate" />
      <span class="flex shrink-0 items-center px-0.5">~</span>
      <input
        type="date"
        :disabled="disable"
        class="w-36 shrink-0"
        :class="
          filterBarAlign
            ? 'h-8 border border-gray-800 rounded-md pl-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-white disabled:text-slate-400'
            : 'ml-2 h-10 border rounded-lg pl-5 text-base disabled:bg-gray-500'
        "
        v-model="selectedEndDate"
        @change="changeEndDate"
        :max="maxEndDate" />
      <button
        ref="periodAnchorBtn"
        type="button"
        class="datepicker2-period-btn shrink-0"
        :class="filterBarAlign ? 'datepicker2-period-btn--compact' : 'datepicker2-period-btn--default'"
        :aria-expanded="showRadio"
        aria-haspopup="dialog"
        title="기간 선택"
        @click="toggleRadio"
        :disabled="disable"
        v-if="disable2">
        <svg
          class="datepicker2-period-btn__icon"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true">
          <rect
            x="3"
            y="4"
            width="14"
            height="13"
            rx="2"
            stroke="currentColor"
            stroke-width="1.5" />
          <path
            d="M3 8.5h14"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round" />
          <path
            d="M7 3v2.5M13 3v2.5"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round" />
          <path
            d="M6.5 12h3M6.5 14.5h7"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round" />
        </svg>
      </button>
    </div>
    <Teleport to="body">
      <div
        v-show="showRadio"
        class="datepicker2-period-panel"
        role="dialog"
        aria-label="기간 선택"
        :style="periodFloaterStyle"
        @click.stop>
        <div class="datepicker2-period-panel__header">
          <h2 class="datepicker2-period-panel__title">기간 선택</h2>
          <button
            type="button"
            class="datepicker2-period-panel__close"
            title="닫기"
            @click="toggleRadio">
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="M5 5l10 10M15 5L5 15"
                stroke="currentColor"
                stroke-width="1.7"
                stroke-linecap="round" />
            </svg>
          </button>
        </div>

        <div class="datepicker2-period-panel__list" role="radiogroup" aria-label="기간 프리셋">
          <label
            v-for="opt in periodPresetOptions"
            :key="opt.value"
            class="datepicker2-period-option"
            :class="{ 'is-selected': selectedRange === opt.value }">
            <input
              type="radio"
              name="dateRange"
              :id="opt.value"
              :value="opt.value"
              v-model="selectedRange"
              @change="updateDateRange"
              class="datepicker2-period-option__input" />
            <span class="datepicker2-period-option__radio" aria-hidden="true"></span>
            <span class="datepicker2-period-option__text">{{ opt.label }}</span>
          </label>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { getSalesCloseMaxDate } from "@/api/misales";
import Swal from "sweetalert2";
import {
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";
import { useRoute } from "vue-router";

const emit = defineEmits(["startDate", "endDate", "acceptDate", "excelDate"]);
const props = defineProps({
  closePopUp: {
    type: Boolean,
    default: false, // 기본값: 빈 함수
  },
  /** 0: 종료일=오늘. 1 이상: Datepicker1과 동일 — 오늘+(initToday-1) (1이면 오늘, 2이면 내일) */
  initToday: {
    type: Number,
    default: 0,
  },
  initToday2: {
    type: Number,
    default: 0, // 기본값: 현재 날짜
  },
  initToday3: {
    type: Boolean,
    default: false, // 기본값: 현재 날짜
  },
  initToday4: {
    type: Boolean,
    default: false, // 기본값: 현재 날짜
  },
  selectedRadioBox: {
    type: String,
    default: "01",
  },
  selectedGroup: {
    type: String,
    default: "",
  },
  orgAcceptDate: {
    type: String,
    default: "",
  },
  mainName: {
    type: String,
    default: "매출일자",
  },
  limitEndDate: {
    type: String,
    default: "9999-12-31",
  },
  makeSevenTerm: {
    type: Boolean,
    default: false,
  },
  disableAll: {
    type: Boolean,
    default: false,
  },
  removeDefault: {
    type: Boolean,
    default: false,
  },
  disableBox: {
    type: Boolean,
    default: true,
  },
  setLimitYear: {
    type: Boolean,
    default: false,
  },
  /** 조회바: 좌측 라벨 정렬(h-8 행과 맞춤), 타 화면은 기존 레이아웃 유지 */
  filterBarAlign: {
    type: Boolean,
    default: false,
  },
  /** 부모 그리드에서 라벨을 따로 둘 때 메인 라벨 숨김 */
  omitMainLabel: {
    type: Boolean,
    default: false,
  },
});
const formatDate = (date) => {
  //comsole.log(date);
  return date.toISOString().split("T")[0];
};
const today = new Date();

const mainName = ref(props.mainName);
const selectedStartDate = ref();
const selectedEndDate = ref();

const emitDate1 = (e) => {};
const maxEndDate = ref("9999-12-31");
const disable = ref(true);
const disable2 = ref(true);
onMounted(() => {
  disable.value = props.disableAll;
  disable2.value = props.disableBox;
  const today = new Date();
  if (props.initToday == 0) {
    today.setDate(today.getDate());
  } else {
    today.setDate(today.getDate() + props.initToday - 1);
  }
  tempStartDateStack.push(selectedStartDate.value);
  tempEndDateStack.push(selectedEndDate.value);

  selectedEndDate.value = formatDate(today);

  if (props.makeSevenTerm == true) {
    today.setDate(today.getDate() - 6);
    selectedStartDate.value = formatDate(today);
  } else {
    selectedStartDate.value = formatDate(today);
  }

  if (props.initToday2 !== 0) {
    today.setDate(today.getDate() + props.initToday2);
    selectedStartDate.value = formatDate(today);
  }
  if (props.initToday3 == true) {
    today.setDate(1);
    selectedStartDate.value = formatDate(today);
  }
  if (props.initToday4 == true) {
    today.setMonth(0); // 월을 1월(0)로 설정
    today.setDate(1);  // 일을 1일로 설정
    selectedStartDate.value = formatDate(today);
  }
  maxEndDate.value = props.limitEndDate;
  if (props.removeDefault == true) {
    selectedStartDate.value = "";
    selectedEndDate.value = "";
  }
  ////console.log(selectedStartDate.value);
  emit("startDate", selectedStartDate.value);
  emit("endDate", selectedEndDate.value);
  emit(
    "excelDate",
    mainName.value +
      " : " +
      selectedStartDate.value +
      "~" +
      selectedEndDate.value
  );
});

watch(
  () => props.disableAll,
  (v) => {
    disable.value = v;
    if (v && props.removeDefault) {
      selectedStartDate.value = "";
      selectedEndDate.value = "";
      emit("startDate", "");
      emit("endDate", "");
    }
  }
);
watch(
  () => props.limitEndDate,
  () => {
    //comsole.log(props.limitEndDate);

    maxEndDate.value = props.limitEndDate;
    if (new Date(selectedEndDate.value) > new Date(maxEndDate.value)) {
      selectedEndDate.value = maxEndDate.value;
    }

    if (new Date(selectedStartDate.value) > new Date(maxEndDate.value)) {
      selectedStartDate.value = maxEndDate.value;
    }
  }
);
const emitDate2 = (e) => {};

const showRadio = ref(false);
/** 기간설정 버튼 — Teleport 패널 위치 기준 */
const periodAnchorBtn = ref(null);
const PERIOD_PANEL_W_PX = 176;
const selectedRange = ref("");
const periodPresetOptions = [
  { value: "lastweek", label: "전주" },
  { value: "currentWeek", label: "금주" },
  { value: "lastMonth", label: "전월" },
  { value: "currentMonth", label: "금월" },
  { value: "last3Month", label: "전3개월" },
  { value: "current3Month", label: "금3개월" },
];

const periodFloaterStyle = ref({
  top: "0px",
  left: "0px",
});

function positionPeriodPanel() {
  const el = periodAnchorBtn.value;
  if (!el) return;
  const r = el.getBoundingClientRect();
  let left = r.left;
  const vw = window.innerWidth;
  if (left + PERIOD_PANEL_W_PX > vw - 8) {
    left = Math.max(8, vw - PERIOD_PANEL_W_PX - 8);
  }
  if (left < 8) left = 8;
  periodFloaterStyle.value = {
    top: `${Math.round(r.bottom + 4)}px`,
    left: `${Math.round(left)}px`,
  };
}

let periodPanelPositionBound = false;

function bindPeriodPanelReposition() {
  if (periodPanelPositionBound) return;
  periodPanelPositionBound = true;
  window.addEventListener("scroll", positionPeriodPanel, true);
  window.addEventListener("resize", positionPeriodPanel);
}

function unbindPeriodPanelReposition() {
  if (!periodPanelPositionBound) return;
  periodPanelPositionBound = false;
  window.removeEventListener("scroll", positionPeriodPanel, true);
  window.removeEventListener("resize", positionPeriodPanel);
}

const toggleRadio = () => {
  showRadio.value = !showRadio.value;
};

watch(showRadio, (open) => {
  if (open) {
    nextTick(() => {
      positionPeriodPanel();
      bindPeriodPanelReposition();
    });
  } else {
    unbindPeriodPanelReposition();
  }
});

const route = useRoute();
watch(
  () => route.fullPath,
  () => {
    showRadio.value = false;
    unbindPeriodPanelReposition();
  }
);

onBeforeUnmount(() => {
  unbindPeriodPanelReposition();
});
const updateDateRange = (e) => {
  const TODAY = new Date();
  // TODAY.setDate(TODAY.getDate() - 1);
  if (e.target.value == "lastweek") {
    const lastWeekStart = new Date(TODAY);
    lastWeekStart.setDate(TODAY.getDate() - TODAY.getDay() - 6); // 지난 주 시작 날짜
    const lastWeekEnd = new Date(TODAY);
    lastWeekEnd.setDate(TODAY.getDate() - TODAY.getDay()); // 지난 주 종료 날짜

    selectedStartDate.value = formatDateToYYYYMMDD(lastWeekStart);
    selectedEndDate.value = formatDateToYYYYMMDD(lastWeekEnd);
  } else if (e.target.value == "currentWeek") {
    const currentWeekStart = new Date(TODAY);
    currentWeekStart.setDate(TODAY.getDate() - TODAY.getDay() + 1); // 이번 주 시작 날짜
    const currentWeekEnd = new Date(TODAY);
    currentWeekEnd.setDate(TODAY.getDate()); // 이번 주 종료 날짜
    selectedStartDate.value = formatDateToYYYYMMDD(currentWeekStart);
    selectedEndDate.value = formatDateToYYYYMMDD(currentWeekEnd);
  } else if (e.target.value == "lastMonth") {
    const lastMonth = new Date(TODAY);
    lastMonth.setMonth(TODAY.getMonth() - 1);
    const lastMonthStart = new Date(
      lastMonth.getFullYear(),
      lastMonth.getMonth(),
      1
    ); // 전월 시작 날짜
    const lastMonthEnd = new Date(
      lastMonth.getFullYear(),
      lastMonth.getMonth() + 1,
      0
    ); // 전월 종료 날짜
    selectedStartDate.value = formatDateToYYYYMMDD(lastMonthStart);
    selectedEndDate.value = formatDateToYYYYMMDD(lastMonthEnd);
  } else if (e.target.value == "currentMonth") {
    const currentMonthStart = new Date(
      TODAY.getFullYear(),
      TODAY.getMonth(),
      1
    ); // 금월 시작 날짜
    const currentMonthEnd = new Date(
      TODAY.getFullYear(),
      TODAY.getMonth(),
      TODAY.getDate()
    ); // 금월 종료 날짜
    selectedStartDate.value = formatDateToYYYYMMDD(currentMonthStart);
    selectedEndDate.value = formatDateToYYYYMMDD(currentMonthEnd);
  } else if (e.target.value == "last3Month") {
    const last3Month = new Date(TODAY);
    last3Month.setMonth(TODAY.getMonth() - 3);
    const last3MonthStart = new Date(
      last3Month.getFullYear(),
      last3Month.getMonth(),
      1
    );
    const last3MonthEnd = new Date(
      last3Month.getFullYear(),
      last3Month.getMonth() + 3,
      0
    );
    selectedStartDate.value = formatDateToYYYYMMDD(last3MonthStart);
    selectedEndDate.value = formatDateToYYYYMMDD(last3MonthEnd);
  } else if (e.target.value == "current3Month") {
    const current3Month = new Date(TODAY);
    current3Month.setMonth(TODAY.getMonth() - 2);
    const current3MonthStart = new Date(
      current3Month.getFullYear(),
      current3Month.getMonth(),
      1
    );
    const current3MonthEnd = new Date(
      current3Month.getFullYear(),
      current3Month.getMonth() + 2,
      current3Month.getDate()
    );

    selectedStartDate.value = formatDateToYYYYMMDD(current3MonthStart);
    selectedEndDate.value = formatDateToYYYYMMDD(current3MonthEnd);
  }

  emit("startDate", selectedStartDate.value);
  emit("endDate", selectedEndDate.value);
  emit(
    "excelDate",
    mainName.value +
      " : " +
      selectedStartDate.value +
      "~" +
      selectedEndDate.value
  );
};

function formatDateToYYYYMMDD(date) {
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();

  month = month < 10 ? "0" + month : month;
  day = day < 10 ? "0" + day : day;

  return year + "-" + month + "-" + day;
}

watch(
  () => [selectedStartDate.value, selectedEndDate.value],
  async () => {
    //comsole.log(selectedStartDate.value);
    //comsole.log(maxEndDate.value);
    if (
      new Date(selectedEndDate.value) > new Date(maxEndDate.value) ||
      new Date(selectedStartDate.value) > new Date(maxEndDate.value)
    ) {
      Swal.fire({
        title: "오류",
        text:
          "승인일 기준 조회일은 " + maxEndDate.value + "일 까지 가능합니다.",
        icon: "error",
        confirmButtonText: "확인",
      });
      selectedEndDate.value = maxEndDate.value;
      selectedStartDate.value = maxEndDate.value;
      return;
    }
    emit("startDate", selectedStartDate.value);
    emit("endDate", selectedEndDate.value);
    emit(
      "excelDate",
      mainName.value +
        " : " +
        selectedStartDate.value +
        "~" +
        selectedEndDate.value
    );

    if (props.selectedRadioBox == "02") {
      if (selectedEndDate.value > props.orgAcceptDate) {
        selectedEndDate.value = props.orgAcceptDate;
        emit("endDate", props.orgAcceptDate);
      }
      if (selectedStartDate.value > selectedEndDate.value) {
        selectedStartDate.value = props.orgAcceptDate;
        emit("startDate", props.orgAcceptDate);
      }
    }
  }
);

const tempStartDateStack = [];
const tempEndDateStack = [];

watch(
  () => props.closePopUp,
  () => {
    showRadio.value = false;
  }
);

watch(
  () => props.selectedRadioBox,
  async () => {
    if (props.selectedRadioBox == "02") {
      const res = await getSalesCloseMaxDate(props.selectedGroup);
      const acceptDate = res.data.closeMaxDate[0].dtmCloseDate.split(" ")[0];

      if (selectedEndDate.value > acceptDate) {
        selectedEndDate.value = acceptDate;
        emit("endDate", acceptDate);
      }
      emit("acceptDate", acceptDate);
    }
  }
);
const changeStartDate = (e) => {
  const date1 = new Date(e.target.value);
  const date2 = new Date(selectedEndDate.value);
  if (date1.getTime() > date2.getTime() && date1.getFullYear() >= 2000) {
    // selectedStartDate.value = tempStartDateStack.pop();
    // tempStartDateStack.push(selectedStartDate.value);
    selectedEndDate.value = selectedStartDate.value;
    //  tempEndDateStack.push(selectedEndDate.value);
  } else if (1000 < date1.getFullYear() && date1.getFullYear() < 2000) {
    if (props.setLimitYear == false) {
      selectedStartDate.value = new Date().toISOString().split("T")[0];
    }
  } else if (
    props.setLimitYear == true &&
    date1.getTime() > date2.getTime() &&
    date2.getFullYear() >= 0
  ) {
    selectedEndDate.value = selectedStartDate.value;
  }
  emit(
    "excelDate",
    mainName.value +
      " : " +
      selectedStartDate.value +
      "~" +
      selectedEndDate.value
  );
  emit("startDate", selectedStartDate.value);
};
const changeEndDate = (e) => {
  const date1 = new Date(selectedStartDate.value);
  const date2 = new Date(e.target.value);
  ////console.log(date2.getFullYear());
  if (date1.getTime() > date2.getTime() && date2.getFullYear() >= 2000) {
    // Swal.fire({
    //   title: "시작일이 종료일을 앞섭니다.",
    //   text: "시작일과 종료일을 다시 선택하세요.",
    //   icon: "error",
    //   confirmButtonText: "확인",
    // });
    selectedStartDate.value = selectedEndDate.value;
    // tempStartDateStack.push(selectedStartDate.value);
    // selectedEndDate.value = tempEndDateStack.pop();
    // tempEndDateStack.push(selectedEndDate.value);
  } else if (
    props.setLimitYear == false &&
    1000 < date2.getFullYear() &&
    date2.getFullYear() < 2000
  ) {
  } else if (
    props.setLimitYear == true &&
    date1.getTime() > date2.getTime() &&
    date2.getFullYear() >= 0
  ) {
    selectedStartDate.value = selectedEndDate.value;
  }
  emit(
    "excelDate",
    mainName.value +
      " : " +
      selectedStartDate.value +
      "~" +
      selectedEndDate.value
  );
  emit("endDate", selectedEndDate.value);
};
</script>

<style>
.datepicker2-period-btn {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  background: #fff;
  color: #334155;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease,
    box-shadow 0.15s ease;
}

.datepicker2-period-btn--compact {
  margin-left: 0.125rem;
  width: 2rem;
  height: 2rem;
  min-width: 2rem;
  min-height: 2rem;
}

.datepicker2-period-btn--default {
  margin-left: 0.5rem;
  width: 1.875rem;
  height: 1.875rem;
}

.datepicker2-period-btn__icon {
  width: 1rem;
  height: 1rem;
}

.datepicker2-period-btn:hover:not(:disabled) {
  border-color: #93c5fd;
  background: #eff6ff;
  color: #1d4ed8;
}

.datepicker2-period-btn:focus-visible {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgb(59 130 246 / 0.2);
}

.datepicker2-period-btn[aria-expanded="true"] {
  border-color: #f87171;
  background: #fee2e2;
  color: #dc2626;
  animation: datepicker2-period-btn-blink 1.1s ease-in-out infinite;
}

.datepicker2-period-btn[aria-expanded="true"]:hover:not(:disabled) {
  border-color: #ef4444;
  background: #fecaca;
  color: #b91c1c;
}

@keyframes datepicker2-period-btn-blink {
  0%,
  100% {
    opacity: 1;
    box-shadow: 0 0 0 0 rgb(248 113 113 / 0.55);
  }
  50% {
    opacity: 0.82;
    box-shadow: 0 0 0 0.3rem rgb(248 113 113 / 0.35);
  }
}

.datepicker2-period-btn:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.datepicker2-period-panel {
  position: fixed;
  z-index: 5000;
  width: 11rem;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.625rem;
  background: #fff;
  box-shadow:
    0 10px 15px -3px rgb(15 23 42 / 0.12),
    0 4px 6px -4px rgb(15 23 42 / 0.08);
}

.datepicker2-period-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.125rem 0.25rem 0.5rem;
  border-bottom: 1px solid #f1f5f9;
  margin-bottom: 0.375rem;
}

.datepicker2-period-panel__title {
  margin: 0;
  font-size: 0.8125rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.2;
}

.datepicker2-period-panel__close {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  padding: 0;
  border: none;
  border-radius: 0.375rem;
  background: transparent;
  color: #64748b;
  cursor: pointer;
}

.datepicker2-period-panel__close svg {
  width: 0.875rem;
  height: 0.875rem;
}

.datepicker2-period-panel__close:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.datepicker2-period-panel__list {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.datepicker2-period-option {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 1.875rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  color: #334155;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition:
    background-color 0.12s ease,
    color 0.12s ease;
}

.datepicker2-period-option:hover:not(.is-selected) {
  background: #fef2f2;
  color: #b91c1c;
}

.datepicker2-period-option:hover:not(.is-selected) .datepicker2-period-option__radio {
  border-color: #fca5a5;
}

.datepicker2-period-option.is-selected {
  background: #dbeafe;
  color: #1e3a8a;
}

.datepicker2-period-option.is-selected:hover {
  background: #bfdbfe;
  color: #1e3a8a;
}

.datepicker2-period-option__input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.datepicker2-period-option__radio {
  box-sizing: border-box;
  width: 0.875rem;
  height: 0.875rem;
  flex-shrink: 0;
  border: 1.5px solid #cbd5e1;
  border-radius: 9999px;
  background: #fff;
  transition:
    border-color 0.12s ease,
    background-color 0.12s ease,
    box-shadow 0.12s ease;
}

.datepicker2-period-option.is-selected .datepicker2-period-option__radio {
  border-color: #1d4ed8;
  background: #1d4ed8;
  box-shadow: inset 0 0 0 2.5px #fff;
}

.datepicker2-period-option__text {
  line-height: 1.2;
  white-space: nowrap;
}
</style>
