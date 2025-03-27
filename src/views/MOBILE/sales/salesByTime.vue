<template>
  <div class="h-full w-full" @click="resetScreen">
    <div class="h-[15vh] w-full"></div>
    <div
      class="relative h-[7vh] items-center text-lg font-medium w-full bg-white flex justify-center">
      <div class="w-[30%] font-semibold text-nowrap">시간대</div>
      <div>|</div>
      <div class="w-[70%] font-semibold">내역</div>
    </div>
    <div v-for="i in rowData" class="bg-gray-300">
      <div
        class="grid grid-rows-1 grid-cols-[6fr,1fr,3fr] h-[7vh] justify-center items-center font-medium">
        <div class="text-nowrap flex justify-start ml-[5%]">
          {{ i.strBuyName }}
        </div>

        <div class="flex justify-start">{{ i.lngCount }}</div>
        <div class="flex justify-start">{{ i.lngAmount }}</div>
      </div>
    </div>
  </div>
  <MobileDateStore
    @click.stop
    class="z-[10]"
    :changeState="changeState"
    @currState="currState"
    @SEARCHNOW="SEARCHNOW"
    @startDate="startDate"
    @endDate="endDate"
    @GROUP_CD="GROUP_CD"
    @STORE_CD="STORE_CD"></MobileDateStore>
</template>

<script setup>
import { getSalesByCreditCard } from "@/api/mobile";
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
import MobileDateStore from "../component/mobileDateStore.vue";

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
  try {
    store.state.loading = true;
    const res = await getSalesByCreditCard(
      selectGroupCd.value,
      selectStoreCd.value,
      selectStartDate.value,
      selectEndDate.value
    );

    rowData.value = res.data.List.map((item) => ({
      ...item,
      lngAmount: item.lngAmount.toLocaleString(),
      lngCount: item.lngCount.toLocaleString(),
    }));
  } catch (error) {
  } finally {
    store.state.loading = false;
  }

  console.log(rowData.value);
};
onMounted(() => {});
</script>

<style lang="scss" scoped></style>
