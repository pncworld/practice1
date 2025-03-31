<template>
  <div
    v-if="isLoading"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-[95]">
    <div class="text-white text-lg mt-4">
      <img src="../assets/spinner1.gif" alt="Loading" />
    </div>
  </div>
  <!-- <LoadingScreen v-if="isLoading"></LoadingScreen> -->
</template>

<script setup>
import { ref, watch } from "vue";
import { useStore } from "vuex";

const store = useStore();
const isLoading = ref(store.state.loading);
// 컴포넌트가 마운트될 때 로딩 상태 변경
watch(
  () => store.state.loading,
  (newValue, oldValue) => {
    isLoading.value = newValue;
  }
);
</script>
