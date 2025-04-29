<template>
  <div class="h-full w-full" @click="resetScreen">
    <div class="h-[15vh] w-full"></div>
    <div
      class="relative h-[7vh] items-center text-lg font-medium w-full bg-white flex justify-center">
      <div class="w-[50%] font-semibold text-nowrap">매장명</div>
      <div>|</div>
      <div class="w-[50%] font-semibold">매출 내역</div>
    </div>
    <div v-for="i in rowData" class="bg-white">
      <div
        class="grid grid-rows-1 grid-cols-[1fr,1fr] h-[20vh] justify-center items-center font-medium">
        <div
          class="text-nowrap flex flex-col justify-center items-center ml-[5%]">
          <div class="text-lg break-words whitespace-normal">
            {{ i.STORE_NM }}
          </div>
        </div>

        <div class="grid grid-rows-4 grid-cols-2 gap-2 p-1">
          <div class="text-blue-500 flex justify-start">일순매출액</div>
          <div class="text-nowrap flex justify-end">
            {{ i.DAY_NET }}
          </div>
          <div class="text-blue-500 flex justify-start">일목표</div>
          <div class="text-nowrap flex justify-end">
            {{ i.DAY_PRJ }}
          </div>
          <div class="text-blue-500 flex justify-start">월순매출</div>
          <div class="text-nowrap flex justify-end">
            {{ i.MONTH_NET }}
          </div>
          <div class="text-blue-500 flex justify-start">월목표</div>
          <div class="text-nowrap flex justify-end">
            {{ i.MONTH_PRJ }}
          </div>
        </div>
      </div>
      <div class="grid grid-rows-1 grid-cols-2 bg-gray-300">
        <div class="flex justify-between items-center p-2">
          일달성율
          <div class="text-red-500">{{ i.DAY_RAT }}%</div>
        </div>
        <div class="flex justify-between items-center p-2">
          월달성율
          <div class="text-red-500">{{ i.MONTH_RAT }}%</div>
        </div>
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
import { getMobileSalesByStore } from "@/api/mobile";
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
    store.state.loading2 = true;
    const res = await getMobileSalesByStore(
      selectGroupCd.value,
      selectStoreCd.value,
      selectStartDate.value,
      selectEndDate.value
    );

    rowData.value = res.data.List.map((item) => ({
      ...item,
      DAY_NET: item.DAY_NET.toLocaleString(),
      MONTH_NET: item.MONTH_NET.toLocaleString(),
      DAY_PRJ: item.DAY_PRJ.toLocaleString(),
      MONTH_PRJ: item.MONTH_PRJ.toLocaleString(),
      DAY_RAT: (Number(item.DAY_RAT) * 100).toFixed(0),
      MONTH_RAT: (Number(item.MONTH_RAT) * 100).toFixed(0),
    }));
  } catch (error) {
  } finally {
    store.state.loading2 = false;
  }

  //console.log(rowData.value);
};
onMounted(() => {});
</script>

<style lang="scss" scoped></style>
