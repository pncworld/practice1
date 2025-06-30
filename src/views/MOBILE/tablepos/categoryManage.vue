<!-- /*--############################################################################
# Filename : categoryManage.vue                                                  
# Description : 모바일 >  카테고리 관리                        
# Date :2025-06-30                                                           
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <div class="h-full w-full" @click="resetScreen">
    <div class="h-[15vh] w-full"></div>
    <!-- <div
      class="relative h-[7vh] text-sm font-medium w-full bg-white grid grid-rows-1 grid-cols-[0.5fr,0.8fr,1.2fr,1.2fr,1fr] items-center">
      <div class="font-semibold text-nowrap">일자</div>
      <div class="font-semibold text-nowrap">객수/조수</div>
      <div class="font-semibold text-nowrap">총매출</div>
      <div class="font-semibold text-nowrap">실매출</div>
      <div class="font-semibold text-nowrap">할인액</div>
    </div> -->
    <!-- <div v-for="i in rowData" class="bg-gray-300">
      <div
        :class="i.dtmDate.includes('[') ? 'bg-gray-300 text-xs' : 'bg-blue-50'"
        class="grid grid-rows-1 grid-cols-[0.5fr,0.8fr,1.2fr,1.2fr,1fr] h-[7vh] justify-center items-center font-medium text-xs">
        <div class="flex justify-start pl-[10%]">{{ i.dtmDate }}</div>
        <div class="flex justify-center">
          {{ i.lngCustCnt }}/{{ i.lngRecCnt }}
        </div>
        <div class="flex justify-end">{{ i.lngSalAmt }}</div>
        <div class="flex justify-end">{{ i.lngActAmt }}</div>
        <div class="flex justify-end pr-[10%]">{{ i.lngDiscountAmt }}</div>
      </div>
    </div> -->
    <div class="grid grid-row-9 grid-cols-[1fr,3fr]">
      <div class="bg-gray-100">시작일</div>
      <div class="">{{ cond1 }}</div>
      <div class="bg-gray-100">시작시간</div>
      <div class="">{{ cond2 }}</div>
    </div>
  </div>
  <CategorySelect
    @click.stop
    class="z-[10]"
    :changeState="changeState"
    @currState="currState"
    @FILTERDATA="FILTERDATA"
    @GROUP_CD="GROUP_CD"
    @STORE_CD="STORE_CD"></CategorySelect>
</template>

<script setup>
import { getMobileSalesbyDays } from "@/api/mobile";
/*
 * 공통 표준  Function
 */

import { onMounted, ref } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";
import CategorySelect from "../component/categorySelect.vue";

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

const cond1 = ref("");
const cond2 = ref("");
const cond3 = ref("");
const cond4 = ref("");
const cond5 = ref("");
const cond6 = ref("");
const cond7 = ref("");
const cond8 = ref("");
const FILTERDATA = (e) => {
  console.log(e);
  cond1.value = e[0].FROM_DATE;
  cond2.value = e[0].FROM_TIME;
};
// const SEARCHNOW = async (e) => {
//   try {
//     store.state.loading2 = true;
//     const res = await getMobileSalesbyDays(
//       selectGroupCd.value,
//       selectStoreCd.value,
//       selectStartDate.value,
//       selectEndDate.value
//     );

//     rowData.value = res.data.List.map((item) => ({
//       ...item,
//       lngCustCnt: item.lngCustCnt.toLocaleString(),
//       lngRecCnt: item.lngRecCnt.toLocaleString(),
//       lngSalAmt: item.lngSalAmt.toLocaleString(),
//       lngActAmt: item.lngActAmt.toLocaleString(),
//       lngDiscountAmt: item.lngDiscountAmt.toLocaleString(),
//     }));
//   } catch (error) {
//   } finally {
//     store.state.loading2 = false;
//   }

//   //comsole.log(rowData.value);
// };
/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(() => {});
</script>

<style lang="scss" scoped></style>
