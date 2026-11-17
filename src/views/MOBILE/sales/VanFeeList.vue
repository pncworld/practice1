<!-- /*--############################################################################
# Filename : MST01_033INS.vue                                                  
# Description : 마스터관리 > 메뉴 마스터 > 메뉴코드등록                        
# Date :2025-05-14                                                             
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <div
    class="mu-page"
    style="--mu-cols: 3.3fr 1.5fr 2.5fr 2.5fr"
    @click="resetScreen">
    <div class="mu-head">
      <div class="mu-thead">
        <div>금액구간</div>
        <div class="mu-num">건수</div>
        <div class="mu-num">KIS수수료</div>
        <div class="mu-num text-red-500">KS수수료</div>
      </div>
    </div>
    <div v-if="rowData.length == 0" class="mu-empty">
      {{ loaded ? "조회된 내역이 없습니다." : "위 조회 조건을 눌러 기간과 매장을 선택한 뒤 조회하세요." }}
    </div>
    <div
      v-for="(i, idx) in rowData"
      :key="idx"
      class="mu-row mu-row--dense"
      :class="{ 'is-sum': i.strAmtSection.includes('[') }">
      <div class="mu-wrap">{{ i.strAmtSection }}</div>
      <div class="mu-num">{{ i.lngAprvlCnt }}</div>
      <div class="mu-num">{{ i.curKisVanFee }}</div>
      <div class="mu-num">{{ i.curKsVanFee }}</div>
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
import "../mobileUi.css";
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
const loaded = ref(false);
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
    loaded.value = true;
  }

  //comsole.log(rowData.value);
};
/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(() => {});
</script>

<style lang="scss" scoped></style>
