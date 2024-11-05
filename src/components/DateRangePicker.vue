<template>
    <div class="md:w-72 w-14 flex relatvie ">
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
      
     <button class="w-1/12" @click="toggleRadio" v-if="!showRadio"><img src="../assets/choiceCalendar.png" alt="" >
      </button>
      <div v-if="showRadio" class="mt-2 p-8 ml-72 w-56 bg-gray-100 rounded-lg shadow-md z-10 absolute">
        <div class="flex justify-end -mr-6"><button @click="toggleRadio">닫기</button></div>
        <h2 class="text-lg font-semibold mb-4">기간 선택</h2>
    
        <div class="flex flex-col space-y-2">
    <label class="flex items-center cursor-pointer">
      <input 
        type="radio" 
        name="dateRange" 
        id="lastweek" 
        value="lastweek" 
        v-model="selectedRange" 
        @change="updateDateRange" 
        class="hidden peer" 
      />
      <span class="flex items-center justify-center w-6 h-6 border-2 border-gray-300 rounded-full peer-checked:border-blue-500 peer-checked:bg-blue-500 mr-2"></span>
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
        class="hidden peer" 
      />
      <span class="flex items-center justify-center w-6 h-6 border-2 border-gray-300 rounded-full peer-checked:border-blue-500 peer-checked:bg-blue-500 mr-2"></span>
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
        class="hidden peer" 
      />
      <span class="flex items-center justify-center w-6 h-6 border-2 border-gray-300 rounded-full peer-checked:border-blue-500 peer-checked:bg-blue-500 mr-2"></span>
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
        class="hidden peer" 
      />
      <span class="flex items-center justify-center w-6 h-6 border-2 border-gray-300 rounded-full peer-checked:border-blue-500 peer-checked:bg-blue-500 mr-2"></span>
      금월
    </label>

    <label class="flex items-center cursor-pointer">
      <input 
        type="radio" 
        name="dateRange"  
        id="last3Month" 
        value="last3Month" 
        v-model="selectedRange" 
        @change="updateDateRange" 
        class="hidden peer" 
      />
      <span class="flex items-center justify-center w-6 h-6 border-2 border-gray-300 rounded-full peer-checked:border-blue-500 peer-checked:bg-blue-500 mr-2"></span>
      전3개월
    </label>

    <label class="flex items-center cursor-pointer">
      <input 
        type="radio" 
        name="dateRange"  
        id="current3Month" 
        value="current3Month" 
        v-model="selectedRange" 
        @change="updateDateRange" 
        class="hidden peer" 
      />
      <span class="flex items-center justify-center w-6 h-6 border-2 border-gray-300 rounded-full peer-checked:border-blue-500 peer-checked:bg-blue-500 mr-2"></span>
      금3개월
    </label>
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

  // Emit date range change
const emit = defineEmits(['update:dateRange']);

function handleDateRangeChange(newDateRange) {
  emit('update:dateRange', newDateRange);
}

function updateDateRange() {
    const today = new Date();
    let startDate, endDate;

      switch (selectedRange.value) {
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
  