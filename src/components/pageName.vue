<template>
                            <div class="flex items-center f24 fc-000 page-title">
      {{ currentTabName }}
      <button class="btn-star active" @click="deleteFavoriteF" v-if="isFavoriteOrNot"/>
      <button class="btn-star " @click="saveFavoriteF" v-if="!isFavoriteOrNot"/>
    </div>
</template>

<script setup>
import { addFavorite, deleteFavorite } from "@/api/common";
import store from "@/store";
import { onActivated, onMounted, ref, watch } from "vue";

const currentTabName = ref("");
const isFavoriteOrNot = ref(false);

let lngProgId;

const syncTabNameFromStore = () => {
  const t = store.state.activeTab2;
  if (!t || typeof t !== "object") {
    currentTabName.value = "";
    isFavoriteOrNot.value = false;
    return;
  }
  currentTabName.value = t.strTitle ?? "";
  if (!t.lngProgramID) {
    isFavoriteOrNot.value = false;
    return;
  }
  lngProgId = t.lngProgramID.split("_")[0];
  isFavoriteOrNot.value = store.state.favoriteList.includes(Number(lngProgId));
};

onMounted(syncTabNameFromStore);
onActivated(syncTabNameFromStore);

watch(
  () => [store.state.activeTab2, store.state.favoriteList],
  () => {
    syncTabNameFromStore();
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
