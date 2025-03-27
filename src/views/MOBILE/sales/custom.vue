<template>
    <div>
      <!-- 커스텀 입력 박스 -->
      <div @click="toggleDatePicker">
        <input 
          v-if="!openDatePicker" 
          type="text" 
          :value="formattedDateRange" 
          readonly 
          class="dp__pointer dp__input_readonly dp__input dp__input_icon_pad dp__input_reg"
          placeholder="날짜를 선택하세요"
        />
      </div>
  
      <!-- VueDatePicker 날짜 선택기: openDatePicker가 true일 때만 보임 -->
      <VueDatePicker
        v-if="openDatePicker && selectedRange === 'weekUnit'"
        v-model="weekRange"
        :format="format"
        :locale="locale"
        :range="true"
        placeholder="날짜를 선택하세요"
        :enable-time-picker="false"
        week-start="0"
        auto-apply
        :clearable="false"
        @update:modelValue="handleDateRangeChange"
        @change="handleDateSelection"
        week-picker
      />
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import VueDatePicker from 'vue-datepicker'; // VueDatePicker 컴포넌트 import
  
  // 상태 정의
  const selectedRange = ref('weekUnit'); // 'weekUnit'이 선택되었을 때 사용
  const weekRange = ref([null, null]); // 선택된 날짜 범위
  const openDatePicker = ref(false); // 날짜 선택기 열기/닫기 상태
  const format = 'yyyy-MM-dd'; // 날짜 형식
  const locale = 'ko'; // 로케일 설정
  
  // 날짜 범위를 'yyyy-MM-dd - yyyy-MM-dd' 형식으로 표시하기 위한 계산된 값
  const formattedDateRange = computed(() => {
    if (weekRange.value && weekRange.value.length === 2) {
      const [startDate, endDate] = weekRange.value;
      
      const startFormatted = startDate ? startDate.toISOString().split('T')[0] : '';
      const endFormatted = endDate ? endDate.toISOString().split('T')[0] : '';
      
      return `${startFormatted} - ${endFormatted}`;
    }
    return '';
  });
  
  // 날짜 범위 변경 시 처리 함수
  const handleDateRangeChange = (newRange) => {
    weekRange.value = newRange;
  };
  
  // 날짜 선택 후 선택기를 숨기는 함수
  const handleDateSelection = () => {
    openDatePicker.value = false; // 날짜를 선택하고 나면 날짜 선택기를 숨김
  };
  
  // 날짜 선택기 열고 닫기 토글 함수
  const toggleDatePicker = () => {
    openDatePicker.value = !openDatePicker.value; // openDatePicker의 값을 토글
  };
  </script>
  