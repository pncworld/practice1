<template>
  <div class="flex justify-center items-center space-x-3 w-[600px] pl-20">
    <div class="pl-20 font-semibold  flex items-center text-nowrap text-base">매출일자 : </div>
    <div class="grid grid-cols-[2fr,1fr,2fr,1fr,1fr] grid-rows-1 justify-start h-11 pr-14 space-x-1">
      <input type="date" class="border rounded-lg h-10 w-32 text-base mr-2 pl-5" v-model="selectedStartDate"
        max="9999-12-31">
      <span class="items-center flex">~</span>
      <input type="date" class="border rounded-lg h-10 w-32 text-base pl-5 ml-2" v-model="selectedEndDate"
        max="9999-12-31">
      <button class="w-[600%] ml-2" @click="toggleRadio"><img src="../assets/choiceCalendar.png" class="w-full" alt="">
      </button>
    </div>
    <div class="flex justify-start">
      <div v-show="showRadio" class="-mt-2 p-1 -ml-10 w-56 bg-gray-100 rounded-lg shadow-md z-10 absolute">
        <div class="flex justify-end mr-3"><button @click="toggleRadio">닫기</button></div>
        <h2 class="text-lg font-semibold mb-4">기간 선택</h2>

        <div class="flex flex-col space-y-2 items-center pr-8">
          <label class="flex items-center cursor-pointer">
            <input type="radio" name="dateRange" id="lastweek" value="lastweek" v-model="selectedRange"
              @change="updateDateRange" class="hidden peer" />
            <span
              class="flex items-center justify-center w-6 h-6 border-2 border-gray-300 rounded-full peer-checked:border-blue-500 peer-checked:bg-blue-500 mr-2"></span>
            전주
          </label>

          <label class="flex items-center cursor-pointer">
            <input type="radio" name="dateRange" id="currentWeek" value="currentWeek" v-model="selectedRange"
              @change="updateDateRange" class="hidden peer" />
            <span
              class="flex items-center justify-center w-6 h-6 border-2 border-gray-300 rounded-full peer-checked:border-blue-500 peer-checked:bg-blue-500 mr-2"></span>
            금주
          </label>

          <label class="flex items-center cursor-pointer">
            <input type="radio" name="dateRange" id="lastMonth" value="lastMonth" v-model="selectedRange"
              @change="updateDateRange" class="hidden peer" />
            <span
              class="flex items-center justify-center w-6 h-6 border-2 border-gray-300 rounded-full peer-checked:border-blue-500 peer-checked:bg-blue-500 mr-2"></span>
            전월
          </label>

          <label class="flex items-center cursor-pointer">
            <input type="radio" name="dateRange" id="currentMonth" value="currentMonth" v-model="selectedRange"
              @change="updateDateRange" class="hidden peer" />
            <span
              class="flex items-center justify-center w-6 h-6 border-2 border-gray-300 rounded-full peer-checked:border-blue-500 peer-checked:bg-blue-500 mr-2"></span>
            금월
          </label>

          <label class="flex items-center cursor-pointer pl-6">
            <input type="radio" name="dateRange" id="last3Month" value="last3Month" v-model="selectedRange"
              @change="updateDateRange" class="hidden peer" />
            <span
              class="flex items-center justify-center w-6 h-6 border-2 border-gray-300 rounded-full peer-checked:border-blue-500 peer-checked:bg-blue-500 mr-2"></span>
            전3개월
          </label>

          <label class="flex items-center cursor-pointer pl-6">
            <input type="radio" name="dateRange" id="current3Month" value="current3Month" v-model="selectedRange"
              @change="updateDateRange" class="hidden peer" />
            <span
              class="flex items-center justify-center w-6 h-6 border-2 border-gray-300 rounded-full peer-checked:border-blue-500 peer-checked:bg-blue-500 mr-2"></span>
            금3개월
          </label>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';

const formatDate = (date) => date.toISOString().split('T')[0]
const today = new Date();
today.setDate(today.getDate() - 1)
const selectedStartDate = ref(formatDate(today))
const selectedEndDate = ref(formatDate(today))

const emitDate1 = (e) => {
  console.log(e)
}
onMounted(() => {
  emit('startDate', selectedStartDate.value)
  emit('endDate', selectedEndDate.value)
  emit('excelDate', '매출일자 : '+selectedStartDate.value+'~'+ selectedEndDate.value)
})
const emitDate2 = (e) => {
  console.log(e)
}
const emit = defineEmits(['startDate', 'endDate','excelDate']);
const props = defineProps(['closePopUp'])
const showRadio = ref(false)
const toggleRadio = (e) => {
  showRadio.value = !showRadio.value;
}
const updateDateRange = (e) => {
  const TODAY = new Date();
  TODAY.setDate(TODAY.getDate() - 1);
  if (e.target.value == 'lastweek') {
    const lastWeekStart = new Date(TODAY);
    lastWeekStart.setDate(TODAY.getDate() - TODAY.getDay() - 6); // 지난 주 시작 날짜
    const lastWeekEnd = new Date(TODAY);
    lastWeekEnd.setDate(TODAY.getDate() - TODAY.getDay()); // 지난 주 종료 날짜
    console.log(lastWeekStart)
    selectedStartDate.value = formatDateToYYYYMMDD(lastWeekStart);
    selectedEndDate.value = formatDateToYYYYMMDD(lastWeekEnd);
  } else if (e.target.value == 'currentWeek') {
    const currentWeekStart = new Date(TODAY);
    currentWeekStart.setDate(TODAY.getDate() - TODAY.getDay() + 1); // 이번 주 시작 날짜
    const currentWeekEnd = new Date(TODAY);
    currentWeekEnd.setDate(TODAY.getDate() + 1); // 이번 주 종료 날짜
    selectedStartDate.value = formatDateToYYYYMMDD(currentWeekStart);
    selectedEndDate.value = formatDateToYYYYMMDD(currentWeekEnd);
  } else if (e.target.value == 'lastMonth') {
    const lastMonth = new Date(TODAY);
    lastMonth.setMonth(TODAY.getMonth() - 1);
    const lastMonthStart = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1); // 전월 시작 날짜
    const lastMonthEnd = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0); // 전월 종료 날짜
    selectedStartDate.value = formatDateToYYYYMMDD(lastMonthStart);
    selectedEndDate.value = formatDateToYYYYMMDD(lastMonthEnd);
  } else if (e.target.value == 'currentMonth') {
    const currentMonthStart = new Date(TODAY.getFullYear(), TODAY.getMonth(), 1); // 금월 시작 날짜
    const currentMonthEnd = new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate()); // 금월 종료 날짜
    selectedStartDate.value = formatDateToYYYYMMDD(currentMonthStart);
    selectedEndDate.value = formatDateToYYYYMMDD(currentMonthEnd);
  } else if (e.target.value == 'last3Month') {
    const last3Month = new Date(TODAY);
    last3Month.setMonth(TODAY.getMonth() - 3);
    const last3MonthStart = new Date(last3Month.getFullYear(), last3Month.getMonth(), 1);
    const last3MonthEnd = new Date(last3Month.getFullYear(), last3Month.getMonth() + 3, 0);
    selectedStartDate.value = formatDateToYYYYMMDD(last3MonthStart);
    selectedEndDate.value = formatDateToYYYYMMDD(last3MonthEnd);
  } else if (e.target.value == 'current3Month') {
    const current3Month = new Date(TODAY);
    current3Month.setMonth(TODAY.getMonth() - 2);
    const current3MonthStart = new Date(current3Month.getFullYear(), current3Month.getMonth(), 1);
    const current3MonthEnd = new Date(current3Month.getFullYear(), current3Month.getMonth() + 2, current3Month.getDate());

    selectedStartDate.value = formatDateToYYYYMMDD(current3MonthStart);
    selectedEndDate.value = formatDateToYYYYMMDD(current3MonthEnd);
  }
}

function formatDateToYYYYMMDD(date) {
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();

  month = month < 10 ? '0' + month : month;
  day = day < 10 ? '0' + day : day;

  return year + '-' + month + '-' + day;
}

watch(() => [selectedStartDate.value, selectedEndDate.value], () => {
  emit('startDate', selectedStartDate.value);
  emit('endDate', selectedEndDate.value);
  emit('excelDate', '매출일자 : '+selectedStartDate.value+'~'+ selectedEndDate.value)
},
  { deep: true })

watch(() => props.closePopUp, () => {
  showRadio.value = false
})

</script>

<style></style>