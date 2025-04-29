<template>
  <div class="flex md:hidden justify-center">
    <div class="inline-flex rounded-md shadow-sm space-x-3 mt-2">
      <button
        v-for="(label, period) in periods"
        :key="period"
        @click="setActive(period)"
        :class="[
          'px-4 py-2 focus:outline-none border border-gray-500 rounded-md',
          {
            'bg-blue-500 text-white': active === period,
            'bg-gray-200 text-gray-700': active !== period,
          },
        ]">
        {{ label }}
      </button>
    </div>
  </div>
  <div class="md:w-72 w-full flex relatvie flex-col md:flex-row">
    <input
      type="button"
      :value="
        selectedRange == 'dayUnit'
          ? formatDate(dateRange[0]) + '~' + formatDate(dateRange[1])
          : selectedRange == 'weekUnit'
          ? formatDate(weekRange[0][0]) + '~' + formatDate(weekRange[1][1])
          : monthRange[0].year +
            '.' +
            (monthRange[0].month + 1) +
            '~' +
            monthRange[1].year +
            '.' +
            (monthRange[1].month + 1)
      "
      @click="showCalender"
      class="px-6 py-2 bg-white text-gray-500 rounded-lg cursor-pointer hover:bg-blue-100 focus:outline-none focus:ring-2 transition" />
    <div class="absolute mt-9 w-full">
      <VueDatePicker
        v-if="selectedRange == 'dayUnit' && thisCalender"
        v-model="dateRange"
        class="w-full"
        :format="format"
        :locale="locale"
        :range="true"
        placeholder="날짜를 선택하세요"
        :enable-time-picker="false"
        inline
        week-start="0"
        auto-apply
        :clearable="false"
        @update:modelValue="handleDateRangeChange"
        v-bind="
          selectedRange == 'monthUnit'
            ? { 'month-picker': true, range: true }
            : selectedRange == 'weekUnit'
            ? { 'week-picker': true }
            : {}
        "></VueDatePicker>

      <VueDatePicker
        v-if="selectedRange == 'weekUnit' && thisCalender"
        v-model="weekRange"
        :format="format"
        :locale="locale"
        :range="true"
        placeholder="날짜를 선택하세요"
        :enable-time-picker="false"
        inline
        week-start="0"
        auto-apply
        :clearable="false"
        @update:modelValue="handleDateRangeChange"
        week-picker></VueDatePicker>

      <VueDatePicker
        v-if="selectedRange == 'monthUnit' && thisCalender"
        v-model="monthRange"
        :format="format"
        :locale="locale"
        inline
        :range="true"
        placeholder="날짜를 선택하세요"
        :enable-time-picker="false"
        week-start="0"
        auto-apply
        :clearable="false"
        @update:modelValue="handleDateRangeChange"
        month-picker></VueDatePicker>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const thisCalender = ref(false);
const showCalender = () => {
  thisCalender.value = !thisCalender.value;
};
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1 해줌
  const day = String(date.getDate()).padStart(2, "0"); // 일자도 두 자리로 맞춰줌

  return `${year}-${month}-${day}`;
}
const today = new Date();
const startOfToday = new Date(today.setHours(0, 0, 0, 0)); // 오늘 날짜의 시작
const endOfToday = new Date(today.setHours(23, 59, 59, 999)); // 오늘 날짜의 끝
const dateRange = ref([startOfToday, endOfToday]); // 범위 선택을 위한 상태
const weekRange = ref(); // 범위 선택을 위한 상태
const monthRange = ref({ month: 2, year: 2024 }); // 범위 선택을 위한 상태
const format = "yyyy-MM-dd"; // 날짜 형식 설정
const locale = "ko"; // 한글 로케일 설정
const selectedRange = ref("dayUnit"); // 선택한 기간
const active = ref("today");
const clickUnit = ref(false);
const selectMode = ref();
const showCalendar = ref(false);
const periods = {
  dayUnit: "일 단위",
  weekUnit: "주 단위",
  monthUnit: "월 단위",
};

const setActive = (period) => {
  clickUnit.value = true;
  active.value = period;
  selectedRange.value = period;
  updateunit(period);
  updateDateRange();
};
// Emit date range change
const emit = defineEmits(["update:dateRange", "update:unit"]);

function updateunit(period) {
  emit("update:unit", period);
}
function handleDateRangeChange(newDateRange) {
  thisCalender.value = !thisCalender.value;
  let newdate = [];
  if (selectedRange.value == "weekUnit") {
    newdate.push(newDateRange[0][0]);
    newdate.push(newDateRange[1][1]);
    emit("update:dateRange", newdate);
  } else if (selectedRange.value == "dayUnit") {
    emit("update:dateRange", newDateRange);
  } else {
    //console.log(newDateRange);
    const startday = new Date();
    startday.setMonth(newDateRange[0].month);
    startday.setDate(1);
    const end = new Date();
    if (newDateRange[1].month == end.getMonth()) {
      end.setMonth(newDateRange[1].month);
    } else {
      end.setMonth(newDateRange[1].month);
      end.setDate(1);
      end.setMonth(end.getMonth() + 1);
      end.setDate(0);
    }
    newdate.push(startday, end);
    //console.log(newdate);
    emit("update:dateRange", newdate);
  }
}
function handleDateRangeChange2(newDateRange) {
  let newdate = [];
  if (selectedRange.value == "weekUnit") {
    newdate.push(newDateRange[0][0]);
    newdate.push(newDateRange[1][1]);
    emit("update:dateRange", newdate);
  } else if (selectedRange.value == "dayUnit") {
    emit("update:dateRange", newDateRange);
  } else {
    //console.log(newDateRange);
    const startday = new Date();
    startday.setMonth(newDateRange[0].month);
    startday.setDate(1);
    const end = new Date();
    if (newDateRange[1].month == end.getMonth()) {
      end.setMonth(newDateRange[1].month);
    } else {
      end.setMonth(newDateRange[1].month);
      end.setDate(1);
      end.setMonth(end.getMonth() + 1);
      end.setDate(0);
    }
    newdate.push(startday, end);
    //console.log(newdate);
    emit("update:dateRange", newdate);
  }
}
function notActive() {
  clickUnit.value = false;
  //console.log(clickUnit.value);
}
function combinedHandler() {
  notActive();
  updateDateRange();
}
function updateDateRange() {
  if (clickUnit.value == false) {
    updateunit("dayUnit");
    return;
  }

  let startDate, endDate;

  switch (selectedRange.value) {
    case "dayUnit":
      const StartdayUnit = new Date();
      StartdayUnit.setDate(StartdayUnit.getDate() - 30);
      startDate = StartdayUnit;
      endDate = endOfToday;
      dateRange.value = [startDate, endDate];
      handleDateRangeChange2(dateRange.value);
      break;

    case "weekUnit":
      //12주
      const today = new Date(); // 오늘 날짜
      const weekUnitStart = new Date(today);
      const weekUnitEnd = new Date(today);

      // 12주 전의 주 시작일 (일요일 기준)
      weekUnitStart.setDate(today.getDate() - today.getDay() - 7 * 11); // 12주 전

      // 12주 전의 주 종료일 (토요일 기준)
      weekUnitEnd.setDate(today.getDate() - today.getDay() + 6); // 이번 주의 토요일

      // 두 번째 주: 11주 전의 범위
      const secondWeekStart = new Date(today);
      const secondWeekEnd = new Date(today);

      secondWeekStart.setDate(today.getDate() - today.getDay()); // 11주 전
      secondWeekEnd.setDate(today.getDate() - today.getDay() + 6); // 11주 전의 토요일

      // weekRange는 이중 배열로 설정
      weekRange.value = [
        [
          new Date(weekUnitStart),
          new Date(weekUnitEnd),
          new Date(weekUnitEnd),
          new Date(weekUnitEnd),
          new Date(weekUnitEnd),
          new Date(weekUnitEnd),
          new Date(weekUnitEnd),
          new Date(weekUnitEnd),
          new Date(weekUnitEnd),
          new Date(weekUnitEnd),
          new Date(weekUnitEnd),
          new Date(weekUnitEnd),
          new Date(weekUnitEnd),
          new Date(weekUnitEnd),
          new Date(weekUnitEnd),
          new Date(weekUnitEnd),
          new Date(weekUnitEnd),
          new Date(weekUnitEnd),
          new Date(weekUnitEnd),
          new Date(weekUnitEnd),
          new Date(weekUnitEnd),
          new Date(weekUnitEnd),
          new Date(weekUnitEnd),
          new Date(weekUnitEnd),
          new Date(weekUnitEnd),
          new Date(weekUnitEnd),
        ], // 첫 번째 주 범위 (복사본 사용)
        [new Date(secondWeekStart), new Date(secondWeekEnd)], // 두 번째 주 범위 (복사본 사용)
      ];
      handleDateRangeChange2(weekRange.value);
      break;
    case "monthUnit":
      //12주
      const today2 = new Date();
      const monthUnitStart = new Date(today2);
      const monthUnitEnd = new Date(today2);
      monthUnitStart.setMonth(today2.getMonth() - 6);
      monthUnitStart.setDate(1);
      startDate = {
        month: monthUnitStart.getMonth(),
        year: monthUnitStart.getFullYear(),
      };
      monthUnitEnd.setDate(today2.getDate() - today2.getDay() + 6);
      endDate = {
        month: monthUnitEnd.getMonth(),
        year: monthUnitEnd.getFullYear(),
      };
      monthRange.value = [];
      monthRange.value.push(startDate);
      monthRange.value.push(endDate);
      handleDateRangeChange2(monthRange.value);
      break;
  }

  // DatePicker에 선택된 날짜 범위를 업데이트
}
watch(monthRange, (newvalue) => {
  //console.log(newvalue);
});
watch(dateRange, (newvalue) => {});
watch(weekRange, (newvalue) => {});
function updateWeekChange() {
  //console.log(weekRange.value);
}
// Watch for dateRange changes
watch(dateRange, (newDateRange) => {
  emit("update:dateRange", newDateRange);
});

const showRadio = ref(false);

const handleWeekRangeChange = () => {
  weekRange.value[1][0] = weekRange.value[1][1];
};

const attributes = ref([
  {
    key: "today",
    highlight: true,
    dates: new Date(),
  },
]);
</script>

<style scoped>
/* Add any custom styles you need */
</style>
