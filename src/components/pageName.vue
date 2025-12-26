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
