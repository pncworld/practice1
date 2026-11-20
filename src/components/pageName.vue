<template>
  <div class="page-title-wrap">
    <!-- 메뉴 경로 (대분류 › 중분류). 메뉴 정보에서 찾지 못하면 표시하지 않는다 -->
    <div v-if="menuPath.length" class="page-path">
      <template v-for="(part, i) in menuPath" :key="i">
        <svg v-if="i > 0" class="page-path-sep" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
        <span>{{ part }}</span>
      </template>
    </div>
    <div class="flex items-center f24 fc-000 page-title">
      {{ currentTabName }}
      <button class="btn-star active" @click="deleteFavoriteF" v-if="isFavoriteOrNot"/>
      <button class="btn-star " @click="saveFavoriteF" v-if="!isFavoriteOrNot"/>
    </div>
  </div>
</template>

<script setup>
import { addFavorite, deleteFavorite } from "@/api/common";
import store from "@/store";
import { onActivated, onMounted, ref, watch } from "vue";

const currentTabName = ref("");
const isFavoriteOrNot = ref(false);
const menuPath = ref([]);

let lngProgId;

/* 메뉴 정보(minorCategory)에서 이 프로그램의 대분류·중분류 이름을 찾는다 */
const findMenuPath = (progId) => {
  const list = Array.isArray(store.state.minorCategory) ? store.state.minorCategory : [];
  const item = list.find((m) => String(m.lngProgramID) === String(progId));
  if (!item) return [];
  return [item.strMajorName, item.strSubName]
    .map((s) => String(s ?? "").trim())
    .filter(Boolean);
};

const syncTabNameFromStore = () => {
  const t = store.state.activeTab2;
  if (!t || typeof t !== "object") {
    currentTabName.value = "";
    isFavoriteOrNot.value = false;
    menuPath.value = [];
    return;
  }
  currentTabName.value = t.strTitle ?? "";
  if (!t.lngProgramID) {
    isFavoriteOrNot.value = false;
    menuPath.value = [];
    return;
  }
  lngProgId = t.lngProgramID.split("_")[0];
  isFavoriteOrNot.value = store.state.favoriteList.includes(Number(lngProgId));
  menuPath.value = findMenuPath(lngProgId);
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
