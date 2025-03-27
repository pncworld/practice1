<template>
  <div class="h-full w-full" @click="resetScreen">
    <div class="h-[15vh] w-full"></div>
    <div
      class="relative h-[7vh] items-center text-lg font-medium w-full bg-white flex justify-center">
      <div class="w-2/4 font-semibold">세부항목</div>
      <div class="w-1/4 font-semibold">건수</div>
      <div class="w-1/4 font-semibold">금액</div>
    </div>
    <div v-for="i in rowData" class="bg-gray-300">
      <div
        :class="i.strAccName.includes('[') ? 'bg-gray-300' : 'bg-blue-50'"
        class="grid grid-rows-1 grid-cols-[2fr,1fr,1fr] h-[5vh] justify-center items-center font-medium">
        <div class="flex justify-start ml-[5vw]">{{ i.strAccName }}</div>
        <div>{{ i.lngCount }}</div>
        <div>{{ i.lngAMount }}</div>
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

  rowData.value = res.data.List.map((item) => ({
    ...item,
    lngAMount: item.lngAMount.toLocaleString(),
    lngCount: item.lngCount.toLocaleString(),
  }));
  console.log(rowData.value);
};
onMounted(() => {
  console.log(store.state);
});
</script>

<style lang="scss" scoped></style>
