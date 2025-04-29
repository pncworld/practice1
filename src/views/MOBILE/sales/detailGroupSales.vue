<template>
  <div class="h-full w-full" @click="resetScreen">
    <div class="h-[15vh] w-full"></div>
    <div
      class="relative h-[7vh] items-center text-lg font-medium w-full bg-white flex justify-center">
      <div class="w-2/5 font-semibold justify-start">메뉴그룹명</div>
      <div class="w-1/5 font-semibold flex justify-end">건수</div>
      <div class="w-2/5 font-semibold flex justify-end pr-5">금액</div>
    </div>
    <div v-for="i in rowData" class="bg-gray-300">
      <div
        :class="i.strMajorGroup.includes('[') ? 'bg-gray-300' : 'bg-blue-50'"
        class="grid grid-rows-1 grid-cols-[1fr,0.5fr,1fr] h-[5vh] justify-center items-center font-medium">
        <div class="flex justify-start pl-[5vw] text-nowrap">
          {{ i.strMajorGroup }}
        </div>
        <div class="text-nowrap flex justify-end">{{ i.lngCount }}</div>
        <div class="text-nowrap flex justify-end pr-[5vw]">
          {{ i.lngAmount }}
        </div>
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
import { getMobileGroupSales } from "@/api/mobile";
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

    const res = await getMobileGroupSales(
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
    //console.log(rowData.value);
  } catch (error) {
  } finally {
    store.state.loading2 = false;
  }
};
onMounted(() => {
  //console.log(store.state);
});
</script>

<style lang="scss" scoped></style>
