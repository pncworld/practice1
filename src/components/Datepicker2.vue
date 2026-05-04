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
        class="w-36 shrink-0 disabled:bg-gray-500"
        :class="
          filterBarAlign
            ? 'h-8 border border-gray-800 rounded-md pl-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
            : 'mr-2 h-10 border rounded-lg pl-5 text-base'
        "
        v-model="selectedStartDate"
        @change="changeStartDate"
        :max="maxEndDate" />
      <span class="flex shrink-0 items-center px-0.5">~</span>
      <input
        type="date"
        :disabled="disable"
        class="w-36 shrink-0 disabled:bg-gray-500"
        :class="
          filterBarAlign
            ? 'h-8 border border-gray-800 rounded-md pl-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
            : 'ml-2 h-10 border rounded-lg pl-5 text-base'
        "
        v-model="selectedEndDate"
        @change="changeEndDate"
        :max="maxEndDate" />
      <button
        ref="periodAnchorBtn"
        type="button"
        class="shrink-0"
        :class="
          filterBarAlign
            ? 'ml-0.5 flex h-8 w-8 items-center justify-center'
            : 'ml-2 w-[30px]'
        "
        @click="toggleRadio"
        :disabled="disable"
        v-if="disable2">
        <img src="../assets/choiceCalendar.png" class="w-full" alt="" />
      </button>
    </div>
    <Teleport to="body">
      <div
        v-show="showRadio"
        class="datepicker2-period-panel fixed z-[5000] w-40 rounded-lg bg-gray-100 p-1 shadow-md"
        :style="periodFloaterStyle"
        @click.stop>
        <div class="flex justify-end mr-3">
          <button type="button" @click="toggleRadio">닫기</button>
        </div>
        <h2 class="text-sm font-semibold -mt-3">기간 선택</h2>

        <div class="flex flex-col space-y-0 items-center pr-8 -mt-1">
          <label class="flex items-center cursor-pointer">
            <input
              type="radio"
              name="dateRange"
              id="lastweek"
              value="lastweek"
              v-model="selectedRange"
              @change="updateDateRange"
              class="" />

            전주
          </label>

          <label class="flex items-center cursor-pointer">
            <input
              type="radio"
              name="dateRange"
              id="currentWeek"
              value="currentWeek"
              v-model="selectedRange"
              @change="updateDateRange"
              class="" />
            <!-- <span
              class="flex items-center justify-center w-6 h-6 border-2 border-gray-300 rounded-full peer-checked:border-blue-500 peer-checked:bg-blue-500 mr-2"></span> -->
            금주
          </label>

          <label class="flex items-center cursor-pointer">
            <input
              type="radio"
              name="dateRange"
              id="lastMonth"
              value="lastMonth"
              v-model="selectedRange"
              @change="updateDateRange"
              class="" />
            <!-- <span
              class="flex items-center justify-center w-6 h-6 border-2 border-gray-300 rounded-full peer-checked:border-blue-500 peer-checked:bg-blue-500 mr-2"></span> -->
            전월
          </label>

          <label class="flex items-center cursor-pointer">
            <input
              type="radio"
              name="dateRange"
              id="currentMonth"
              value="currentMonth"
              v-model="selectedRange"
              @change="updateDateRange"
              class="" />
            <!-- <span
              class="flex items-center justify-center w-6 h-6 border-2 border-gray-300 rounded-full peer-checked:border-blue-500 peer-checked:bg-blue-500 mr-2"></span> -->
            금월
          </label>

          <label class="flex items-center cursor-pointer pl-6">
            <input
              type="radio"
              name="dateRange"
              id="last3Month"
              value="last3Month"
              v-model="selectedRange"
              @change="updateDateRange"
              class="" />
            <!-- <span
              class="flex items-center justify-center w-6 h-6 border-2 border-gray-300 rounded-full peer-checked:border-blue-500 peer-checked:bg-blue-500 mr-2"></span> -->
            전3개월
          </label>

          <label class="flex items-center cursor-pointer pl-6">
            <input
              type="radio"
              name="dateRange"
              id="current3Month"
              value="current3Month"
              v-model="selectedRange"
              @change="updateDateRange"
              class="" />
            <!-- <span
              class="flex items-center justify-center w-6 h-6 border-2 border-gray-300 rounded-full peer-checked:border-blue-500 peer-checked:bg-blue-500 mr-2"></span> -->
            금3개월
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
  () => {
    disable.value = props.disableAll;
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
const PERIOD_PANEL_W_PX = 160;

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

<style></style>
