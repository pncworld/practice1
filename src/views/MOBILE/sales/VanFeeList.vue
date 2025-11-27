<!-- /*--############################################################################
# Filename : MST01_033INS.vue                                                  
# Description : 마스터관리 > 메뉴 마스터 > 메뉴코드등록                        
# Date :2025-05-14                                                             
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <div class="h-full w-full" @click="resetScreen">
    <div class="h-[15vh] w-full"></div>
    <div
      class="relative h-[7vh] items-center text-base font-medium w-full bg-white flex">
      <div class="w-[30vw] font-semibold text-nowrap text-center">금액구간</div>
      <div class="w-[30vw] font-semibold text-end">건수</div>
      <div class="w-[30vw] font-semibold flex justify-end text-end">
        KIS수수료
      </div>
      <div
        class="w-[28vw] font-semibold flex justify-end text-end pr-1 text-red-500">
        KS수수료
      </div>
    </div>
    <div v-for="i in rowData" class="bg-gray-300">
      <div
        :class="i.strAmtSection.includes('[') ? 'bg-gray-300' : 'bg-gray-200'"
        class="grid grid-rows-1 grid-cols-[3.3fr,1.5fr,2.5fr,2.5fr] h-[7vh] justify-center items-center font-medium">
        <div class="pl-1 text-nowrap overflow-hidden">
          {{ i.strAmtSection }}
        </div>

        <div class="overflow-hidden text-nowrap text-end">
          {{ i.lngAprvlCnt }}
        </div>
        <div class="flex justify-end overflow-hidden">{{ i.curKisVanFee }}</div>
        <div class="flex justify-end pr-[10%] overflow-hidden">
          {{ i.curKsVanFee }}
        </div>
      </div>
    </div>
  </div>
  <MobileDateStore2
    @click.stop
    class="z-[10]"
    :changeState="changeState"
    @currState="currState"
    @SEARCHNOW="SEARCHNOW"
    @startDate="startDate"
    @endDate="endDate"
    @GROUP_CD="GROUP_CD"
    @STORE_CD="STORE_CD"></MobileDateStore2>
</template>

<script setup>
import { getSalesByCornerMenu3, getVanFeeList } from "@/api/mobile";
/*
 * 공통 표준  Function
 */

import { onMounted, ref } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";
import MobileDateStore2 from "../component/mobileDateStore2.vue";

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
    const res = await getVanFeeList(
      selectGroupCd.value,
      selectStoreCd.value,
      selectStartDate.value,
      selectEndDate.value
    );

    rowData.value = res.data.List.map((item) => ({
      ...item,
      curKisVanFee: parseInt(item.curKisVanFee).toLocaleString(),
      lngAprvlCnt: parseInt(item.lngAprvlCnt).toLocaleString(),
    }));
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
