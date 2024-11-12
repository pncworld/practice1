<template>

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
    <div class="md:w-72 w-full flex relatvie flex-col md:flex-row ">
      <VueDatePicker  :v-model="selectedRange === 'monthUnit' ? monthRange : selectedRange === 'weekUnit' ? weekRange : dateRange"
      :format="format"
      :locale="locale"
      :range="true"
      placeholder="날짜를 선택하세요" 
      :enable-time-picker="false" 
      week-start="0"
      auto-apply
      :clearable="false"
      @update:modelValue="handleDateRangeChange"  v-bind="selectedRange == 'monthUnit' ? {'month-picker' : true , 'range' : true} :  selectedRange == 'weekUnit' ? { 'week-picker' : true} : {} "></VueDatePicker>

      

     

    </div>
    
    
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
 

  const today = new Date() ;
  const startOfToday = new Date(today.setHours(0, 0, 0, 0)); // 오늘 날짜의 시작
  const endOfToday = new Date(today.setHours(23, 59, 59, 999)); // 오늘 날짜의 끝
  const dateRange = ref([startOfToday, endOfToday]); // 범위 선택을 위한 상태
  const weekRange = ref(); // 범위 선택을 위한 상태
  const format = 'yyyy-MM-dd'; // 날짜 형식 설정
  const locale = "ko"; // 한글 로케일 설정
  const selectedRange = ref(''); // 선택한 기간
  const active = ref("today");
  const clickUnit = ref(false);
  const selectMode = ref();
    const periods = {
      dayUnit: "일 단위",
      weekUnit: "주 단위",
      monthUnit: "월 단위",

    };

    const setActive =(period) =>{
      clickUnit.value = true;
      active.value = period;
      selectedRange.value = period;
      updateunit(period)
      updateDateRange();

    }
  // Emit date range change
const emit = defineEmits(['update:dateRange','update:unit']);

function updateunit(period) {
  emit('update:unit',period);
}
function handleDateRangeChange(newDateRange) {
  updateDateRange()
  emit('update:dateRange', newDateRange);

}
function notActive(){
  clickUnit.value = false;
  console.log( clickUnit.value)
}
function combinedHandler() {
  notActive()
  updateDateRange()
}
function updateDateRange() {
  console.log(dateRange.value)
  console.log(selectedRange.value)
  if(clickUnit.value == false) {
    updateunit('dayUnit')
    return ; 
  } 
    const today = new Date();
    let startDate, endDate;

      switch (selectedRange.value) {
        
        case 'dayUnit':
          const StartdayUnit = new Date(today);
          StartdayUnit.setDate(today.getDate()-30)
          startDate = StartdayUnit;
          endDate = endOfToday;
          dateRange.value = [startDate, endDate];
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
       
        

      }

      // DatePicker에 선택된 날짜 범위를 업데이트
     
     
    }
  

// Watch for dateRange changes
watch(dateRange, (newDateRange) => {
  emit('update:dateRange', newDateRange);
});

const showRadio = ref(false);


const handleWeekRangeChange = () => {
  weekRange.value[1][0] = weekRange.value[1][1]
}
  </script>
  
  <style scoped>
  /* Add any custom styles you need */
  </style>
  