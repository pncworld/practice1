/*--############################################################################
# Filename : MST01_033INS.vue                                                  
# Description : 마스터관리 > 메뉴 마스터 > 메뉴코드등록                        
# Date :2025-05-14                                                             
# Author : 권맑음                     
################################################################################*/
<template>
  <SelectStore v-if="currentComponent === 'SelectStore'" />
  <UseProgram v-if="currentComponent === 'SelectStore'" />
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";
import SelectStore from "@/components/SelectStore.vue";
import UseProgram from "@/components/UseProgram.vue";
import BasicLayout from "./layout/BasicLayout.vue";

const store = useStore();
const currentComponent = ref("SelectStore");

const updateCurrentComponent = (newValue) => {
  switch (newValue) {
    case "/dailysales":
      currentComponent.value = "DailySales";
      break;
    default:
      currentComponent.value = "SelectStore";
      break;
  }
};
const unwatch = watch(
  () => store.state.selectedCategoryId,
  (newValue) => {
    updateCurrentComponent(newValue);
  },
  { immediate: true }
);
// Handle back navigation
const handlePopState = (event) => {
  // Rollback the state on back navigation
  if (event.state != null) {
    // 뒤로가기 일때
    store.dispatch("selectCategory", null); // Update Vuex state
    // Optionally update the component to reflect the change

    updateCurrentComponent(store.state.selectedCategoryId);
  }
};

/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(() => {
  window.addEventListener("popstate", handlePopState);
});

onUnmounted(() => {
  window.removeEventListener("popstate", handlePopState);
  unwatch(); // Clean up watcher
});
</script>
