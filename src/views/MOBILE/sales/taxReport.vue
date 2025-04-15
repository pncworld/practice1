<template>
  <div class="h-full w-full" @click="resetScreen">
    <div class="h-[15vh] w-full"></div>
    <div
      class="relative h-[7vh] items-center text-lg font-medium w-full bg-white flex justify-center">
      <div class="w-[20%] font-semibold text-nowrap">조회월</div>
      <div class="w-[20%] font-semibold">매입사</div>
      <div class="w-[25%] font-semibold flex justify-end">건수</div>
      <div class="w-[30%] font-semibold flex justify-end">금액</div>
    </div>
    <div v-for="i in rowData" class="bg-gray-300">
      <div
        :class="i.MONTH_DT.includes('[') ? 'bg-gray-300' : 'bg-blue-50'"
        class="grid grid-rows-1 grid-cols-[1fr,1fr,1fr,1.5fr] h-[7vh] justify-center items-center font-medium">
        <div class="pl-1">{{ i.MONTH_DT }}</div>

        <div>{{ i.BUYCOMP_NM }}</div>
        <div class="flex justify-end">{{ i.APP_CNT }}</div>
        <div class="flex justify-end pr-[10%]">{{ i.APP_AMT }}</div>
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
import { getMobileSalesByMenu, getMobileTaxReport } from "@/api/mobile";
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
    const res = await getMobileTaxReport(
      selectGroupCd.value,
      selectStoreCd.value,
      selectStartDate.value,
      selectEndDate.value
    );

    rowData.value = res.data.List.map((item) => ({
      ...item,
      APP_CNT: item.APP_CNT.toLocaleString(),
      APP_AMT: item.APP_AMT.toLocaleString(),
    }));
  } catch (error) {
  } finally {
    store.state.loading2 = false;
  }

  console.log(rowData.value);
};
onMounted(() => {});
</script>

<style lang="scss" scoped></style>
