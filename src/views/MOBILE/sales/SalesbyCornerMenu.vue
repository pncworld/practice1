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
      class="relative h-[7vh] items-center text-lg font-medium w-full bg-white flex justify-center">
      <div class="w-[30%] font-semibold text-nowrap">코너명</div>
      <div class="w-[20%] font-semibold">메뉴명</div>
      <div class="w-[25%] font-semibold flex justify-end">건수</div>
      <div class="w-[30%] font-semibold flex justify-end">금액</div>
    </div>
    <div v-for="i in rowData" class="bg-gray-300">
      <div
        class="grid grid-rows-1 grid-cols-[2fr,2.3fr,1fr,1.5fr] h-[7vh] justify-center items-center font-medium">
        <div class="pl-1 text-nowrap overflow-hidden">{{ i.CORNER_NM }}</div>

        <div class="overflow-hidden text-nowrap">{{ i.MENU_NM }}</div>
        <div class="flex justify-end overflow-hidden">{{ i.MENU_CNT }}</div>
        <div class="flex justify-end pr-[10%] overflow-hidden">
          {{ i.SAL_AMT }}
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
  getMobileSalesByMenu,
  getMobileTaxReport,
  getSalesByCornerMenu3,
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
    const res = await getSalesByCornerMenu3(
      selectGroupCd.value,
      selectStoreCd.value,
      selectStartDate.value,
      selectEndDate.value,
      store.state.userData.USER_NO
    );
    console.log(res);
    rowData.value = res.data.List.map((item) => ({
      ...item,
      SAL_AMT: parseInt(item.SAL_AMT).toLocaleString(),
      MENU_CNT: parseInt(item.MENU_CNT).toLocaleString(),
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
