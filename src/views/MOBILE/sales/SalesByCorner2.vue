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
          <div class="mu-card-title">{{ i.CORNER_NM }}</div>
          <div class="mu-key">
            <div class="mu-key-label">실매출</div>
            <div class="mu-key-value">{{ i.ACT_AMT }}</div>
          </div>
        </div>
        <dl class="mu-kv">
          <dt>총매출</dt>
          <dd>{{ i.TOT_AMT }}</dd>
          <dt>신용카드</dt>
          <dd>{{ i.CREDIT_AMT }}</dd>
          <dt>현금매출</dt>
          <dd>{{ i.CASH_AMT }}</dd>
          <dt>외상매출</dt>
          <dd>{{ i.TRUST_AMT }}</dd>
          <dt>기타매출</dt>
          <dd>{{ i.ETC_AMT }}</dd>
          <dt>할인액</dt>
          <dd>{{ i.DC_AMT }}</dd>
        </dl>
      </div>
    </div>
  </div>
  <MobileDateStore
    :autoSearch="true"
    @click.stop
    class="z-[10]"
    :changeState="changeState"
    :defaultAllStores="true"
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
import "../mobileUi.css";
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
