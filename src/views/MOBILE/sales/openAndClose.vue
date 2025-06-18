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
        <div class="flex justify-center">{{ i.SESSIONSTATUS }}</div>
        <div class="flex justify-center">{{ i.POS_NO }}</div>
        <div class="flex justify-center">{{ i.WORK_TM }}</div>
        <div class="flex justify-center">{{ i.EMP_NM }}</div>
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

  //comsole.log(rowData.value);
};
/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(() => {});
</script>

<style lang="scss" scoped></style>
