<template>
  <VueDatePicker
    v-model="selectedDate"
    :format="format"
    :locale="locale"
    :range="false"
    placeholder="날짜를 선택하세요"
    :enable-time-picker="false"
    week-start="0"
    auto-apply></VueDatePicker>
</template>

<script setup>
import { ref, watch } from "vue";

const today = new Date();
const startOfToday = new Date(today.setHours(0, 0, 0, 0)); // 오늘 날짜의 시작
const selectedDate = ref(startOfToday); // 선택한 날짜 상태

const format = "yyyy-MM-dd"; // 날짜 형식 설정
const locale = "ko"; // 한글 로케일 설정

// Emit date change
const emit = defineEmits(["update:selectedDate"]);

// Watch for selectedDate changes
watch(selectedDate, (newDate) => {
  //console.log(newDate);
  emit("update:selectedDate", newDate);
});
</script>

<style scoped>
/* Add any custom styles you need */
</style>
