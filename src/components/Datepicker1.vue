<template>
  <div class="space-x-5 mt-2">
    <span class="font-semibold text-base">{{ mainname }} </span
    ><input
      type="date"
      :disabled="disabled"
      class="border rounded-lg h-10 w-36 text-base pl-5 disabled:bg-gray-300"
      v-model="selectedDate"
      @change="emitDate" />
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";

const formatDate = (date) => date.toISOString().split("T")[0];
const selectedDate = ref(formatDate(new Date()));
const emit = defineEmits(["dateValue", "year", "month", "day", "excelDate"]);
const props = defineProps({
  mainName: {
    type: String,
    default: "매출일자", // 기본값: 빈 함수
  },
  initToday: {
    type: Number,
    default: 0, // 기본값: 빈 함수
  },
  reload: {
    type: Boolean,
    default: false, // 기본값: 빈 함수
  },
  reloadDate: {
    type: String,
    default: "", // 기본값: 빈 함수
  },
  disable: {
    type: Boolean,
    default: false,
  },
});
const mainname = ref("");
const today = new Date();
onMounted(() => {
  if (props.initToday == 0) {
    today.setDate(today.getDate() - 1); // initToday가 0이면 '어제'
  } else {
    today.setDate(today.getDate() + props.initToday - 1);
  }

  selectedDate.value = formatDate(today);
  emit("dateValue", selectedDate.value);
  mainname.value = props.mainName;
  emit("excelDate", mainname.value + ": " + selectedDate.value);
});
const emitDate = () => {
  //comsole.log(selectedDate.value);
  emit("dateValue", selectedDate.value);
  emit("year", selectedDate.value.split("-")[0]);
  emit("month", Number(selectedDate.value.split("-")[1]));
  emit("day", Number(selectedDate.value.split("-")[2]));
  emit("excelDate", mainname.value + ": " + selectedDate.value);
};

watch(
  () => props.reload,
  () => {
    const today = new Date(props.reloadDate);
    if (props.initToday == 0) {
      today.setDate(today.getDate() - 1); // initToday가 0이면 '어제'
    } else {
      today.setDate(today.getDate() + props.initToday - 1);
    }

    selectedDate.value = formatDate(today);
    emit("dateValue", selectedDate.value);
    mainname.value = props.mainName;
    emit("excelDate", mainname.value + ": " + selectedDate.value);
  }
);

const disabled = ref(false);
watch(
  () => props.disable,
  () => {
    console.log(props.disable);
    if (props.disable == false) {
      disabled.value = false;
    } else {
      disabled.value = true;
    }
  }
);
</script>
