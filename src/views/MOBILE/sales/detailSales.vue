/*--############################################################################
# Filename : MST01_033INS.vue                                                  
# Description : 마스터관리 > 메뉴 마스터 > 메뉴코드등록                        
# Date :2025-05-14                                                             
# Author : 권맑음                     
################################################################################*/
<template>
  <div class="h-full w-full" @click="resetScreen">
    <div class="h-[15vh] w-full"></div>
    <div
      class="relative h-[7vh] items-center text-lg font-medium w-full bg-white flex justify-center">
      <div class="w-2/5 font-semibold flex justify-start pl-3">세부항목</div>
      <div class="w-1/5 font-semibold flex justify-end">건수</div>
      <div class="w-2/5 font-semibold flex justify-end pr-5">금액</div>
    </div>
    <div v-for="i in rowData" class="bg-gray-300">
      <div
        :class="i.strAccName.includes('[') ? 'bg-gray-300' : 'bg-blue-50'"
        class="grid grid-rows-1 grid-cols-[1fr,0.5fr,1fr] h-[5vh] justify-center items-center font-medium">
        <div class="flex justify-start pl-[2vw] text-nowrap">
          {{ i.strAccName }}
        </div>
        <div class="flex justify-end text-nowrap">{{ i.lngCount }}</div>
        <div class="flex justify-end pr-[5vw] text-nowrap">
          {{ i.lngAmount }}
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
/*
 * 공통 표준  Function
 */

import { onMounted, ref } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

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

const emit = defineEmits(["initPlaceName"]);
const currState = (e) => {
  changeState.value = e;
};
const selectStartDate = ref("");
const selectEndDate = ref("");
const selectGroupCd = ref("");
const selectStoreCd = ref("");
/**
 * 선택한 매출 시작일자
 */

const startDate = (e) => {
  selectStartDate.value = e;
};
/**
 * 선택한 매출 종료일자
 */

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
    const res = await getMobileDetailSales(
      selectGroupCd.value,
      selectStoreCd.value,
      selectStartDate.value,
      selectEndDate.value
    );

    rowData.value = res.data.List.filter((item2) => item2.strAccName != "").map(
      (item) => ({
        ...item,
        lngAmount: item.lngAmount.toLocaleString(),
        lngCount:
          item.strAccName.includes("[준비금]") ||
          item.strAccName.includes("[현금계산재고]") ||
          item.strAccName.includes("[현금실재고]") ||
          item.strAccName.includes("[과부족]")
            ? ""
            : item.lngCount.toLocaleString(),
      })
    );
  } catch (error) {
  } finally {
    store.state.loading2 = false;
  }

  //comsole.log(rowData.value);
};
/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(() => {});
</script>

<style lang="scss" scoped></style>
