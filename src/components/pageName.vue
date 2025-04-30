<template>
  <div class="flex justify-start w-full pl-12 pt-4">
    <div class="flex justify-start">
      <h1 class="font-bold text-sm md:text-2xl w-full">{{ currentTabName }}</h1>
      <button class="" @click="deleteFavoriteF" v-if="isFavoriteOrNot">
        <img src="../assets/table_star-checked.svg" alt="" />
      </button>
      <button class="" @click="saveFavoriteF" v-if="!isFavoriteOrNot">
        <img src="../../src/assets/table_star.svg" alt="" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { addFavorite, deleteFavorite } from "@/api/common";
import store from "@/store";
import { ref, watch } from "vue";
import { onMounted } from "vue";

const currentTabName = ref("");
const isFavoriteOrNot = ref(false);

let lngProgId;
onMounted(async () => {
  currentTabName.value = store.state.activeTab2.strTitle;
  lngProgId = store.state.activeTab2.lngProgramID.split("_")[0];

  isFavoriteOrNot.value = store.state.favoriteList.includes(Number(lngProgId));
});

watch(
  () => [store.state.activeTab2, store.state.favoriteList],
  () => {
    currentTabName.value = store.state.activeTab2.strTitle;
    let lngProgId = store.state.activeTab2.lngProgramID.split("_")[0];

    isFavoriteOrNot.value = store.state.favoriteList.includes(
      Number(lngProgId)
    );
  }
);

const deleteFavoriteF = async () => {
  const a = store.state.favoriteList.filter(
    (item) => item != Number(lngProgId)
  );
  const res = await deleteFavorite(
    Number(lngProgId),
    store.state.userData.loginID
  );
  store.dispatch("setFavoriteList", a);
};
const saveFavoriteF = async () => {
  let b = [...store.state.favoriteList];
  b.push(Number(lngProgId));
  //comsole.log(b);
  const res = await addFavorite(
    Number(lngProgId),
    store.state.userData.loginID
  );
  store.dispatch("setFavoriteList", b);
};
</script>

<style lang="scss" scoped></style>
