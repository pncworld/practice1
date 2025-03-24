<template>
  <div
    v-if="isLoading"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"></div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useStore } from "vuex";

const store = useStore();
const isLoading = ref(store.state.inActiveBackGround);
// 컴포넌트가 마운트될 때 로딩 상태 변경
watch(
  () => store.state.inActiveBackGround,
  (newValue, oldValue) => {
    isLoading.value = newValue;
  }
);
</script>
