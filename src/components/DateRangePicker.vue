<template>
    <div class="w-1/4">
      <VueDatePicker v-model="dateRange"
      :format="format"
      :locale="locale"
      :range="true"
      placeholder="날짜를 선택하세요" :enable-time-picker="false" 
      @change="handleDateRangeChange"></VueDatePicker>
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


  // Emit date range change
const emit = defineEmits(['update:dateRange']);

function handleDateRangeChange(newDateRange) {
  emit('update:dateRange', newDateRange);
}

// Watch for dateRange changes
watch(dateRange, (newDateRange) => {
  emit('update:dateRange', newDateRange);
});
  </script>
  
  <style scoped>
  /* Add any custom styles you need */
  </style>
  