<template>
  <div
    class="overflow-y-auto flex flex-col justify-center items-center space-y-4 h-full relative">
    <div class="w-[95%] p-3 h-[10%] bg-white flex flex-col justify-center">
      <div class="flex justify-start">안녕하세요!</div>
      <div class="flex items-center">
        <span class="text-blue-500 text-nowrap text-2xl">{{ StoreName }}</span>
        &nbsp;&nbsp;&nbsp; 입니다.
      </div>
      <div class="flex justify-end text-gray-500">
        최신 업데이트 {{ today }}
      </div>
    </div>

    <div class="h-[12vh] w-[95%] bg-white overflow-visible">
      <div class="grid grid-rows-2 grid-cols-3 h-full gap-1">
        <div
          class="bg-black text-white flex justify-center items-center h-[50%]">
          일매출
        </div>
        <div
          class="bg-black text-white flex justify-center items-center h-[50%]">
          주간매출
        </div>
        <div
          class="bg-black text-white flex justify-center items-center h-[50%]">
          월매출
        </div>
        <div class="text-gray-500 h-full -mt-[20%]">
          전일 / <br />
          {{ lastDaySale }}원 <br />
          <div class="text-blue-400">{{ todaySale }}원</div>
        </div>
        <div class="text-gray-500 h-full -mt-[20%]">
          전주 / <br />
          {{ lastWeekSale }}원 <br />
          <div class="text-blue-400">{{ WeekSale }}원</div>
        </div>
        <div class="text-gray-500 h-full -mt-[20%]">
          전월 / <br />
          {{ lastMonthSale }}원 <br />
          <div class="text-blue-400">{{ MonthSale }}원</div>
        </div>
      </div>
    </div>

    <div class="h-[6%] w-[95%] flex space-x-1">
      <div class="grid grid-rows-1 grid-cols-1 w-[33%] bg-white">
        <div class="flex flex-col h-[10vh]">
          <div class="flex justify-center text-gray-500 mr-[2vw]">전일대비</div>
          <div class="pl-1">
            <font-awesome-icon
              :icon="['fas', 'circle-arrow-up']"
              class="text-red-500 size-[3vw]"
              v-show="difdaySale > 0" /><font-awesome-icon
              :icon="['fas', 'circle-arrow-down']"
              class="text-blue-500 size-[3vw]"
              v-show="difdaySale < 0" />&nbsp;&nbsp;{{ difdaySale2 }}
          </div>
        </div>
      </div>
      <div class="grid grid-rows-1 grid-cols-1 w-[33%] bg-white">
        <div class="flex flex-col h-[10vh]">
          <div class="flex justify-center text-gray-500 mr-[2vw]">전주대비</div>
          <div class="pl-1">
            <font-awesome-icon
              :icon="['fas', 'circle-arrow-up']"
              class="text-red-500 size-[3vw]"
              v-show="difweekSale > 0" /><font-awesome-icon
              :icon="['fas', 'circle-arrow-down']"
              class="text-blue-500 size-[3vw]"
              v-show="difweekSale < 0" />&nbsp;&nbsp;{{ difweekSale2 }}
          </div>
        </div>
      </div>

      <div class="grid grid-rows-1 grid-cols-1 w-[33%] bg-white relative">
        <div class="flex flex-col h-[10vh]">
          <div class="flex justify-center text-gray-500 mr-[2vw]">전월대비</div>
          <div class="pl-1">
            <font-awesome-icon
              :icon="['fas', 'circle-arrow-up']"
              class="text-red-500 size-[3vw]"
              v-show="difmonthSale > 0" /><font-awesome-icon
              :icon="['fas', 'circle-arrow-down']"
              class="text-blue-500 size-[3vw]"
              v-show="difmonthSale < 0" />&nbsp;&nbsp;{{ difmonthSale2 }}
          </div>
        </div>
      </div>
    </div>
    <div class="grid grid-rows-1 grid-cols-3 bg-white h-[50%] w-[95%] relative">
      <div class="flex items-end justify-center space-x-4 h-[90%]">
        <div
          class="bg-red-500 opacity-60 w-[10vw] flex relative"
          :style="{ height: prevsaleH }">
          <span class="text-black absolute bottom-full mb-1 ml-1">{{
            lastDaySale2
          }}</span>
        </div>
        <div
          class="bg-red-500 flex relative w-[10vw]"
          :style="{ height: nextsaleH }">
          <span class="text-black absolute bottom-full mb-1 ml-1">{{
            todaySale2
          }}</span>
        </div>
      </div>
      <div class="size-[1vw] absolute text-nowrap">단위 (만원)</div>
      <div class="flex items-end justify-center space-x-4 h-[90%]">
        <div
          class="bg-green-500 opacity-60 w-[10vw] flex relative"
          :style="{ height: prevWeeksaleH }">
          <span class="text-black absolute bottom-full mb-1 ml-1">{{
            lastWeekSale2
          }}</span>
        </div>
        <div
          class="bg-green-500 flex relative w-[10vw]"
          :style="{ height: nextWeeksaleH }">
          <span class="text-black absolute bottom-full mb-1 ml-1">{{
            WeekSale2
          }}</span>
        </div>
      </div>
      <div class="flex items-end justify-center space-x-4 h-[90%]">
        <div
          class="bg-blue-500 opacity-60 w-[10vw] flex relative"
          :style="{ height: prevMonthsaleH }">
          <span class="text-black absolute bottom-full mb-1 ml-1">{{
            lastMonthSale2
          }}</span>
        </div>
        <div
          class="bg-blue-500 flex w-[10vw] relative"
          :style="{ height: nextMonthsaleH }">
          <span class="text-black absolute bottom-full mb-1 ml-1">{{
            MonthSale2
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getMobileDashBoard } from "@/api/mobile";
import {
  formatLocalDate2,
  formatNumberWithCommas,
} from "@/customFunc/customFunc";
/*
 * 공통 표준  Function
 */

import { onMounted, ref } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";
const lastDaySale = ref("");
const todaySale = ref("");
const MonthSale = ref("");
const lastMonthSale = ref("");
const WeekSale = ref("");
const lastWeekSale = ref("");

const lastDaySale2 = ref("");
const todaySale2 = ref("");
const MonthSale2 = ref("");
const lastMonthSale2 = ref("");
const WeekSale2 = ref("");
const lastWeekSale2 = ref("");

const store = useStore();
const selectedStoreCode = ref("");
/**
 * 페이지 매장 코드 세팅
 */

const lngStoreCode = (e) => {
  selectedStoreCode.value = e;
};
const prevsaleH = ref(0);
const nextsaleH = ref(0);
const prevWeeksaleH = ref(0);
const nextWeeksaleH = ref(0);
const prevMonthsaleH = ref(0);
const nextMonthsaleH = ref(0);

const difdaySale = ref(0);
const difdaySale2 = ref(0);
const difweekSale = ref(0);
const difweekSale2 = ref(0);
const difmonthSale = ref(0);
const difmonthSale2 = ref(0);
const isMobile = store.state.isMobile;
const StoreName = ref("");
const today = ref(formatLocalDate2(new Date()));
/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  store.state.loading2 = false;

  StoreName.value = store.state.userData.STORE_NM;
  store.state.mobileSelectProgName = "";
  let res;
  try {
    res = await getMobileDashBoard(
      store.state.userData.GROUP_CD,
      store.state.userData.STORE_CD,
      store.state.userData.USER_NO
    );
  } catch (error) {}

  const data = res.data.List[0];
  //comsole.log(data);
  lastDaySale.value = formatNumberWithCommas(data.YESTERDAY_SAL);
  todaySale.value = formatNumberWithCommas(data.TODAY_SAL);
  lastWeekSale.value = formatNumberWithCommas(data.LASTWEEK_SAL);
  WeekSale.value = formatNumberWithCommas(data.THISWEEK_SAL);
  lastMonthSale.value = formatNumberWithCommas(data.LASTMONTH_SAL);
  MonthSale.value = formatNumberWithCommas(data.THISMONTH_SAL);

  difdaySale.value = Number(data.TODAY_SAL) - Number(data.YESTERDAY_SAL);
  difdaySale2.value = formatNumberWithCommas(
    Number(data.TODAY_SAL) - Number(data.YESTERDAY_SAL)
  );

  todaySale2.value = Math.round(Number(data.TODAY_SAL) / 10000);
  lastDaySale2.value = Math.round(Number(data.YESTERDAY_SAL) / 10000);

  MonthSale2.value = Math.round(Number(data.THISMONTH_SAL) / 10000);

  lastMonthSale2.value = Math.round(Number(data.LASTMONTH_SAL) / 10000);

  WeekSale2.value = Math.round(Number(data.THISWEEK_SAL) / 10000);
  lastWeekSale2.value = Math.round(Number(data.LASTWEEK_SAL) / 10000);

  // nextsaleH.value = Number(data.TODAY_SAL) / 5000000 + "vh";
  // prevsaleH.value = Number(data.YESTERDAY_SAL) / 5000000 + "vh";
  // nextWeeksaleH.value = Number(data.THISWEEK_SAL) / 15000000 + "vh";
  // prevWeeksaleH.value = Number(data.LASTWEEK_SAL) / 15000000 + "vh";
  // nextMonthsaleH.value = Number(data.THISMONTH_SAL) / 150000000 + "vh";
  // prevMonthsaleH.value = Number(data.LASTMONTH_SAL) / 150000000 + "vh";

  nextsaleH.value =
    Math.round(
      (Number(data.TODAY_SAL) /
        (Number(data.YESTERDAY_SAL) + Number(data.TODAY_SAL))) *
        85
    ) + "%";
  prevsaleH.value =
    Math.round(
      (Number(data.YESTERDAY_SAL) /
        (Number(data.YESTERDAY_SAL) + Number(data.TODAY_SAL))) *
        85
    ) + "%";

  nextWeeksaleH.value =
    Math.round(
      (Number(data.THISWEEK_SAL) /
        (Number(data.LASTWEEK_SAL) + Number(data.THISWEEK_SAL))) *
        85
    ) + "%";
  prevWeeksaleH.value =
    Math.round(
      (Number(data.LASTWEEK_SAL) /
        (Number(data.LASTWEEK_SAL) + Number(data.THISWEEK_SAL))) *
        85
    ) + "%";
  nextMonthsaleH.value =
    Math.round(
      (Number(data.THISMONTH_SAL) /
        (Number(data.THISMONTH_SAL) + Number(data.LASTMONTH_SAL))) *
        85
    ) + "%";
  prevMonthsaleH.value =
    Math.round(
      (Number(data.LASTMONTH_SAL) /
        (Number(data.LASTMONTH_SAL) + Number(data.THISMONTH_SAL))) *
        85
    ) + "%";
  console.log(prevsaleH.value);
  console.log(prevWeeksaleH.value);
  console.log(nextMonthsaleH.value);
  difweekSale.value = Number(data.THISWEEK_SAL) - Number(data.LASTWEEK_SAL);
  difweekSale2.value = formatNumberWithCommas(
    Number(data.THISWEEK_SAL) - Number(data.LASTWEEK_SAL)
  );

  difmonthSale.value = Number(data.THISMONTH_SAL) - Number(data.LASTMONTH_SAL);
  difmonthSale2.value = formatNumberWithCommas(
    Number(data.THISMONTH_SAL) - Number(data.LASTMONTH_SAL)
  );
});
</script>

<style lang="scss" scoped></style>
