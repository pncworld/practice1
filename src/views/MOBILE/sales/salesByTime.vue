/*--############################################################################
# Filename : MST01_033INS.vue                                                  
# Description : 마스터관리 > 메뉴 마스터 > 메뉴코드등록                        
# Date :2025-05-14                                                             
# Author : 권맑음                     
################################################################################*/
<template>
  <div class="mu-page" @click="resetScreen">
    <div class="mu-head"></div>
    <div v-if="rowData.length == 0" class="mu-empty">
      {{ loaded ? "조회된 내역이 없습니다." : "위 조회 조건을 눌러 기간과 매장을 선택한 뒤 조회하세요." }}
    </div>
    <div class="mu-cards">
      <div v-for="(i, idx) in rowData" :key="idx" class="mu-card">
        <div class="mu-card-top">
          <div class="mu-card-title">
            {{ i.strTimeName }}
            <span class="mu-sub">({{ i.dblDistRate }}%)</span>
          </div>
          <div class="mu-key">
            <div class="mu-key-label">실매출</div>
            <div class="mu-key-value">{{ i.lngActAmt }}</div>
          </div>
        </div>
        <dl class="mu-kv">
          <dt>실매출누계</dt>
          <dd>{{ i.lngAccActAmt }}</dd>
          <dt>조수 / 누계</dt>
          <dd>{{ i.lngRecCnt }} / {{ i.lngAccRecCnt }}</dd>
          <dt>객수 / 누계</dt>
          <dd>{{ i.lngCustCnt }} / {{ i.lngAccCustCnt }}</dd>
          <dt>객단가 / 누계</dt>
          <dd>{{ i.lngAvgCustAmt }} / {{ i.lngAvgAccCustAmt }}</dd>
        </dl>
      </div>
    </div>
  </div>
  <MobileDateStore
    :autoSearch="true"
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
import "../mobileUi.css";
import { applyNetUnitPrice } from "@/utils/netUnitPrice";
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
const loaded = ref(false);
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
    /* 2026-11-13 1871: 객단가·객단가누계 순매출(실매출÷1.1) 기준 — 숫자 서식 넣기 전에 계산 */
    const list = applyNetUnitPrice(res.data.List, selectGroupCd.value, [
      { target: "lngAvgCustAmt", amount: "lngActAmt", count: "lngCustCnt" },
      { target: "lngAvgAccCustAmt", amount: "lngAccActAmt", count: "lngAccCustCnt" },
    ]);
    rowData.value = list.map((item) => ({
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
