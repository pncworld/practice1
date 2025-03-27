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
      today: "오늘",
      yesterday: "전일",
      weekago: "1주일",
      monthago: "1개월",

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
      
        case 'yesterday':
          startDate = startOfToday -1;
          endDate = startOfToday -1;
          break;

          case 'weekago':
            //12주
          const weekUnitStart = new Date(today);
          const weekUnitEnd = new Date(today);
          weekUnitStart.setDate(today.getDate() - 6 );
          startDate = weekUnitStart;
          endDate = weekUnitEnd;
          break;
          case 'monthago':
            //12주
          const monthUnitStart = new Date(today);
          const monthUnitEnd = new Date(today);
          monthUnitStart.setMonth(today.getMonth()-1 );
          startDate = monthUnitStart;
          endDate = monthUnitEnd;
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
  