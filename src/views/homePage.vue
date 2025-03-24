<template>
  <div>
    <div class="text-2xl flex justify-start ml-2 font-semibold">매출 현황</div>
    <div class="text-xl flex justify-between ml-2 font-normal mt-2">
      <SelectMobileStore @lngStoreCode="lngStoreCode"></SelectMobileStore>
      <button><img src="../assets/ic_refresh.svg" alt="" /></button>
    </div>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import SelectMobileStore from "./MOBILE/component/selectMobileStore.vue";
import { ref } from "vue";

const store = useStore();
const selectedStoreCode = ref("");
const lngStoreCode = (e) => {
  selectedStoreCode.value = e;
};
const isMobile = store.state.isMobile;
</script>

<style lang="scss" scoped></style>
