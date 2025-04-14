<template>
  <div class="h-full w-full" @click="resetScreen">
    <div class="h-[15vh] w-full"></div>
    <div
      class="relative h-[7vh] text-base font-medium w-full bg-white grid grid-rows-1 grid-cols-[1.5fr,1.5fr,2fr,1fr] p-1">
      <div class="w-full font-semibold flex items-center">세션구분</div>
      <div class="w-full font-semibold flex items-center">POS</div>
      <div class="w-full font-semibold flex items-center">작업시간</div>
      <div class="w-full font-semibold flex items-center">담당자</div>
    </div>
    <div v-for="i in rowData" class="bg-gray-300">
      <div
        :class="i.SALE_DT.includes('[') ? 'bg-gray-300' : 'bg-blue-50'"
        class="grid grid-rows-1 grid-cols-[1fr,1fr,1.8fr,1fr] h-[7vh] justify-center items-center font-medium">
        <div>{{ i.SESSIONSTATUS }}</div>
        <div>{{ i.POS_NO }}</div>
        <div>{{ i.WORK_TM }}</div>
        <div>{{ i.EMP_NM }}</div>
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
import {
  getMobileOpenCloseReport,
  getMobileSalesByMenu,
  getMobileVoidReport,
} from "@/api/mobile";
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
    const res = await getMobileOpenCloseReport(
      selectGroupCd.value,
      selectStoreCd.value,
      selectStartDate.value,
      selectEndDate.value
    );

    rowData.value = res.data.List;
  } catch (error) {
  } finally {
    store.state.loading2 = false;
  }

  console.log(rowData.value);
};
onMounted(() => {});
</script>

<style lang="scss" scoped></style>
