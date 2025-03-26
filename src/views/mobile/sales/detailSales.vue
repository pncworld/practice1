<template>
  <div class="h-full w-full" @click="resetScreen">
    <div
      class="absolute top-[15vh] h-[7vh] items-center text-lg font-medium w-full bg-white flex justify-center">
      <div class="w-2/4 font-semibold">세부항목</div>
      <div class="w-1/4 font-semibold">건수</div>
      <div class="w-1/4 font-semibold">금액</div>
    </div>
    <div
      class="absolute top-[22vh] h-[7vh] items-center text-lg font-medium w-full bg-white flex flex-col justify-center">
      <div v-for="i in rowData" class="flex">
        <div class="w-2/4 font-normal">{{ i.strAccName }}</div>
        <div class="w-1/4 font-normal">{{ i.lngCount }}</div>
        <div class="w-1/4 font-normal">{{ i.lngAmount }}</div>
      </div>
    </div>
  </div>
  <MobileDateStore
    @click.stop
    :changeState="changeState"
    @currState="currState"
    @SEARCHNOW="SEARCHNOW"
    @startDate="startDate"
    @endDate="endDate"
    @GROUP_CD="GROUP_CD"
    @STORE_CD="STORE_CD"></MobileDateStore>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
import MobileDateStore from "../component/mobileDateStore.vue";
import { getMobileDetailSales } from "@/api/mobile";

const store = useStore();
const changeState = ref(true);
const resetScreen = async (e) => {
  changeState.value = false;

  // changeState.value = !changeState.value;
  store.state.inActiveBackGround = false;
};

const currState = (e) => {
  changeState.value = e;
};
const selectStartDate = ref("");
const selectEndDate = ref("");
const selectGroupCd = ref("");
const selectStoreCd = ref("");
const startDate = (e) => {
  selectStartDate.value = e;
};
const endDate = (e) => {
  selectEndDate.value = e;
};
const GROUP_CD = (e) => {
  selectGroupCd.value = e;
};
const STORE_CD = (e) => {
  selectStoreCd.value = e;
};

const rowData = ref([]);
const SEARCHNOW = async (e) => {
  const res = await getMobileDetailSales(
    selectGroupCd.value,
    selectStoreCd.value,
    selectStartDate.value,
    selectEndDate.value
  );

  rowData.value = res.data.List;
  console.log(rowData.value);
};
onMounted(() => {
  console.log(store.state);
});
</script>

<style lang="scss" scoped></style>
