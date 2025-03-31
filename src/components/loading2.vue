<template>
  <LoadingScreen v-if="isLoading"></LoadingScreen>
</template>

<script setup>
import { ref, watch } from "vue";
import { useStore } from "vuex";
import LoadingScreen from "./LoadingScreen.vue";

const store = useStore();
const isLoading = ref(store.state.loading2);
//
// 컴포넌트가 마운트될 때 로딩 상태 변경
watch(
  () => store.state.isloading2,
  () => {
    isLoading.value = store.state.loading2;
  }
);
</script>
