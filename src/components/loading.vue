<template>
  <div
    v-if="isLoading"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-[95]">
    <div class="loading-wrap" style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
      <img src="../assets/images/loading.gif" alt="로딩 중" style="width: auto; height: auto; max-width: 80px; max-height: 80px;">
      <!-- <div class="f15 loading-text">처리 중입니다.</div> -->
    </div>
  </div>
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
