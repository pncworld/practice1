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
      <div class="w-[25%] font-semibold text-nowrap">시간대</div>
      <div>|</div>
      <div class="w-[75%] font-semibold">내역</div>
    </div>
    <div v-for="i in rowData" class="bg-gray-200">
      <div
        class="grid grid-rows-1 grid-cols-[2fr,6fr] h-[20vh] justify-center items-center font-medium">
        <div
          class="text-nowrap flex flex-col justify-center items-center ml-[5%]">
          <div class="text-lg">{{ i.strTimeName }}</div>
          <div class="text-red-500 text-lg">({{ i.dblDistRate }}%)</div>
        </div>

        <div class="grid grid-rows-4 grid-cols-2 gap-2">
          <div class="text-blue-500 flex justify-start">조수/누계</div>
          <div class="text-nowrap flex justify-end pr-[10%]">
            {{ i.lngRecCnt }}&nbsp;/&nbsp;{{ i.lngAccRecCnt }}
          </div>
          <div class="text-blue-500 flex justify-start">객수/누계</div>
          <div class="text-nowrap flex justify-end pr-[10%]">
            {{ i.lngCustCnt }}&nbsp;/&nbsp;{{ i.lngAccCustCnt }}
          </div>
          <div class="text-blue-500 flex justify-start">실매출/실매출누계</div>
          <div class="text-nowrap flex justify-end pr-[10%]">
            {{ i.lngActAmt }}&nbsp;/&nbsp;{{ i.lngAccActAmt }}
          </div>
          <div class="text-blue-500 flex justify-start">객단가/객단가누계</div>
          <div class="text-nowrap flex justify-end pr-[10%]">
            {{ i.lngAvgCustAmt }}&nbsp;/&nbsp;{{ i.lngAvgAccCustAmt }}
          </div>
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
import { getMobileSalesByTime, getSalesByCreditCard } from "@/api/mobile";
/*
 * 공통 표준  Function
 */

import { onMounted, ref } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

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
    const res = await getMobileSalesByTime(
      selectGroupCd.value,
      selectStoreCd.value,
      selectStartDate.value,
      selectEndDate.value
    );
    //comsole.log(res);
    rowData.value = res.data.List.map((item) => ({
      ...item,
      dblDistRate: Math.ceil(item.dblDistRate),
      lngRecCnt: item.lngRecCnt.toLocaleString(),
      lngAccRecCnt: item.lngAccRecCnt.toLocaleString(),
      lngCustCnt: item.lngCustCnt.toLocaleString(),
      lngAccCustCnt: item.lngAccCustCnt.toLocaleString(),
      lngActAmt: item.lngActAmt.toLocaleString(),
      lngAccActAmt: item.lngAccActAmt.toLocaleString(),
      lngAvgCustAmt: item.lngAvgCustAmt.toLocaleString(),
      lngAvgAccCustAmt: item.lngAvgAccCustAmt.toLocaleString(),
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
