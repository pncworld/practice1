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
      <div class="w-[50%] font-semibold text-nowrap text-center">매장명</div>
      <div>|</div>
      <div class="w-[50%] font-semibold text-center">매출 내역</div>
    </div>
    <div v-for="i in rowData" class="bg-white">
      <div
        class="grid grid-rows-1 grid-cols-[1fr,1fr] h-[20vh] justify-center items-center font-medium">
        <div
          class="text-nowrap flex flex-col justify-center items-center ml-[5%]">
          <div
            class="text-base font-semibold text break-words whitespace-normal">
            {{ i.CORNER_NM }}
          </div>
        </div>

        <div class="grid grid-rows-4 grid-cols-2 gap-2 p-1">
          <div class="text-blue-500 flex justify-start">신용카드</div>
          <div class="text-nowrap flex justify-end">
            {{ i.CREDIT_AMT }}
          </div>
          <div class="text-blue-500 flex justify-start">현금매출</div>
          <div class="text-nowrap flex justify-end">
            {{ i.CASH_AMT }}
          </div>
          <div class="text-blue-500 flex justify-start">외상매출</div>
          <div class="text-nowrap flex justify-end">
            {{ i.TRUST_AMT }}
          </div>
          <div class="text-blue-500 flex justify-start">기타매출</div>
          <div class="text-nowrap flex justify-end">
            {{ i.ETC_AMT }}
          </div>
          <div class="text-blue-500 flex justify-start">할인액</div>
          <div class="text-nowrap flex justify-end">
            {{ i.DC_AMT }}
          </div>
        </div>
      </div>
      <div class="grid grid-rows-1 grid-cols-2 bg-gray-300">
        <div class="flex justify-between items-center p-2">
          총매출
          <div class="text-red-500">{{ i.TOT_AMT }}</div>
        </div>
        <div class="flex justify-between items-center p-2">
          실매출
          <div class="text-red-500">{{ i.ACT_AMT }}</div>
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
import {
  getMobileSalesByCorner,
  getMobileSalesByRealTime,
  getMobileSalesByStore,
} from "@/api/mobile";
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
    const res = await getMobileSalesByCorner(
      selectGroupCd.value,
      selectStoreCd.value,
      selectStartDate.value,
      selectEndDate.value,
      store.state.userData.USER_NO
    );
    console.log(res);
    rowData.value = res.data.List.map((item) => ({
      ...item,
      TOT_AMT: parseInt(item.TOT_AMT).toLocaleString(),
      CASH_AMT: parseInt(item.CASH_AMT).toLocaleString(),
      DC_AMT: parseInt(item.DC_AMT).toLocaleString(),
      ETC_AMT: parseInt(item.ETC_AMT).toLocaleString(),
      ACT_AMT: parseInt(item.ACT_AMT).toLocaleString(),
      TRUST_AMT: parseInt(item.TRUST_AMT).toLocaleString(),
      CREDIT_AMT: parseInt(item.CREDIT_AMT).toLocaleString(),
    }));

    console.log(rowData.value);
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
