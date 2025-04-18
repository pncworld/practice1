<template>
  <div class="flex justify-start w-full pl-12 pt-4">
    <div class="flex justify-start">
      <h1 class="font-bold text-sm md:text-2xl w-full">{{ currentTabName }}</h1>
      <button class="" @click="" v-if="isFavoriteOrNot">
        <img src="../assets/table_star-checked.svg" alt="" />
      </button>
      <button class="" @click="" v-if="!isFavoriteOrNot">
        <img src="../../src/assets/table_star.svg" alt="" />
      </button>
    </div>
  </div>
</template>

<script setup>
import store from "@/store";
import { ref, watch } from "vue";
import { onMounted } from "vue";

const currentTabName = ref("");
const isFavoriteOrNot = ref(false);
onMounted(async () => {
  currentTabName.value = store.state.activeTab2.strTitle;
  let lngProgId = store.state.activeTab2.lngProgramID.split("_")[0];
  console.log(store.state.favoriteList);
  console.log(lngProgId);
  isFavoriteOrNot.value = store.state.favoriteList.includes(Number(lngProgId));
});

watch(
  () => [store.state.activeTab2, store.state.favoriteList],
  () => {
    currentTabName.value = store.state.activeTab2.strTitle;
    let lngProgId = store.state.activeTab2.lngProgramID.split("_")[0];
    console.log(store.state.favoriteList);
    console.log(lngProgId);
    isFavoriteOrNot.value = store.state.favoriteList.includes(
      Number(lngProgId)
    );
  }
);
</script>

<style lang="scss" scoped></style>
