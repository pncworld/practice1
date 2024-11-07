<template>
    <div class="md:w-72 w-14 flex relatvie flex-col md:flex-row ">
      <VueDatePicker  v-model="dateRange"
      :format="format"
      :locale="locale"
      :range="true"
      placeholder="날짜를 선택하세요" 
      :enable-time-picker="false" 
      week-start="0"
      auto-apply
      :clearable="false"
      @change="handleDateRangeChange"></VueDatePicker>
      
    
      <div class="flex md:hidden justify-center">
        <div class="inline-flex rounded-md shadow-sm space-x-3 mt-2">
          <button
      v-for="(label, period) in periods"
      :key="period"
      @click="setActive(period)"
      :class="[
        'px-4 py-2 focus:outline-none border border-gray-500 rounded-md', 
        { 'bg-blue-500 text-white': active === period, 'bg-gray-200 text-gray-700': active !== period }
      ]">
      {{ label }}
    </button>
</div>
      </div>
      
    </div>
    
    
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
 

  const today = new Date() ;
  const startOfToday = new Date(today.setHours(0, 0, 0, 0)); // 오늘 날짜의 시작
  const endOfToday = new Date(today.setHours(23, 59, 59, 999)); // 오늘 날짜의 끝
  const dateRange = ref([startOfToday, endOfToday]); // 범위 선택을 위한 상태
  const format = 'yyyy-MM-dd'; // 날짜 형식 설정
  const locale = "ko"; // 한글 로케일 설정
  const selectedRange = ref(''); // 선택한 기간
  const active = ref("today");
    const periods = {
      dayUnit: "일 단위",
      weekUnit: "주 단위",
      monthUnit: "월 단위",

    };

    const setActive =(period) =>{
      active.value = period;
      selectedRange.value = period;
      updateDateRange();
    }
  // Emit date range change
const emit = defineEmits(['update:dateRange']);

function handleDateRangeChange(newDateRange) {
  emit('update:dateRange', newDateRange);
}

function updateDateRange() {
    const today = new Date();
    let startDate, endDate;

      switch (selectedRange.value) {
        case 'today':
          startDate = startOfToday;
          endDate = endOfToday;
          break;
        case 'dayUnit':
          const StartdayUnit = new Date(today);
          StartdayUnit.setDate(today.getDate()-30)
          startDate = StartdayUnit;
          endDate = endOfToday;
          break;

        case 'yesterday':
          startDate = startOfToday -1;
          endDate = startOfToday -1;
          break;

          case 'weekUnit':
            //12주
          const weekUnitStart = new Date(today);
          const weekUnitEnd = new Date(today);
          weekUnitStart.setDate(today.getDate() - today.getDay() - 7*11 );
          startDate = weekUnitStart;
          weekUnitEnd.setDate(today.getDate() - today.getDay()+6)
          endDate = weekUnitEnd;
          break;
          case 'monthUnit':
            //12주
          const monthUnitStart = new Date(today);
          const monthUnitEnd = new Date(today);
          monthUnitStart.setMonth(today.getMonth()-6 );
          monthUnitStart.setDate(1);
          startDate = monthUnitStart;
          monthUnitEnd.setDate(today.getDate() - today.getDay()+6)
          endDate = monthUnitEnd;
          break;
        case 'lastweek':
          const lastWeekStart = new Date(today);
          lastWeekStart.setDate(today.getDate() - today.getDay() - 7); // 지난 주 시작 날짜
          const lastWeekEnd = new Date(today);
          lastWeekEnd.setDate(today.getDate() - today.getDay() - 1); // 지난 주 종료 날짜
          startDate = lastWeekStart;
          endDate = lastWeekEnd;
          break;

        case 'currentWeek':
          const currentWeekStart = new Date(today);
          currentWeekStart.setDate(today.getDate() - today.getDay()); // 이번 주 시작 날짜
          const currentWeekEnd = new Date(today);
          currentWeekEnd.setDate(today.getDate() ); // 이번 주 종료 날짜
          startDate = currentWeekStart;
          endDate = currentWeekEnd;
          break;

        case 'lastMonth':
          const lastMonth = new Date(today);
          lastMonth.setMonth(today.getMonth() - 1);
          const lastMonthStart = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1); // 전월 시작 날짜
          const lastMonthEnd = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0); // 전월 종료 날짜
          startDate = lastMonthStart;
          endDate = lastMonthEnd;
          break;

        case 'currentMonth':
          const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1); // 금월 시작 날짜
          const currentMonthEnd = new Date(today.getFullYear(), today.getMonth() , today.getDate()); // 금월 종료 날짜
          startDate = currentMonthStart;
          endDate = currentMonthEnd;
          break;

          case 'last3Month':
          const last3Month = new Date(today);
          last3Month.setMonth(today.getMonth() - 3);
          const last3MonthStart = new Date(last3Month.getFullYear(), last3Month.getMonth(), 1);
          const last3MonthEnd = new Date(last3Month.getFullYear(), last3Month.getMonth()+3, 0 );
        
          startDate = last3MonthStart;
          endDate = last3MonthEnd;
          break;

          case 'current3Month':
          const current3Month = new Date(today);
          current3Month.setMonth(today.getMonth() - 2);
          const current3MonthStart = new Date(current3Month.getFullYear(), current3Month.getMonth(), 1);
          const current3MonthEnd = new Date(current3Month.getFullYear(), current3Month.getMonth()+2, current3Month.getDate() );
        
          startDate = current3MonthStart;
          endDate = current3MonthEnd;
          break;

      }

      // DatePicker에 선택된 날짜 범위를 업데이트
      dateRange.value = [startDate, endDate];
    }
  

// Watch for dateRange changes
watch(dateRange, (newDateRange) => {
  emit('update:dateRange', newDateRange);
});

const showRadio = ref(false);
function toggleRadio() {

  showRadio.value = !showRadio.value;
}
  </script>
  
  <style scoped>
  /* Add any custom styles you need */
  </style>
  