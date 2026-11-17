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
          <div class="mu-card-title">{{ i.STORE_NM }}</div>
          <div class="mu-key">
            <div class="mu-key-label">예상실매출</div>
            <div class="mu-key-value">{{ i.TOT_AMT }}</div>
          </div>
        </div>
        <dl class="mu-kv">
          <dt>미결제</dt>
          <dd>{{ i.ORDER_AMT }}</dd>
          <dt>총매출</dt>
          <dd>{{ i.SAL_AMT }}</dd>
          <dt>할인</dt>
          <dd>{{ i.DC_AMT }}</dd>
          <dt>실매출</dt>
          <dd>{{ i.ACT_AMT }}</dd>
        </dl>
        <div class="mu-stats">
          <div class="mu-stat">
            조수 <b>{{ i.REC_CNT }}</b>
          </div>
          <div class="mu-stat">
            객수 <b>{{ i.CUST_CNT }}</b>
          </div>
        </div>
      </div>
    </div>
  </div>
  <MobileDateStore
    :autoSearch="true"
    @click.stop
    class="z-[10]"
    :changeState="changeState"
    :defaultAllStores="true"
    :queryPeriod="true"
    @currState="currState"
    @SEARCHNOW="SEARCHNOW"
    @startDate="startDate"
    @endDate="endDate"
    @GROUP_CD="GROUP_CD"
    @STORE_CD="STORE_CD"></MobileDateStore>
</template>

<script setup>
import { getMobileSalesByRealTime, getMobileSalesByStore } from "@/api/mobile";
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
    const res = await getMobileSalesByRealTime(
      selectGroupCd.value,
      selectStoreCd.value,
      selectStartDate.value,
      selectEndDate.value
    );
    //comsole.log(res);
    rowData.value = res.data.List.map((item) => ({
      ...item,
      TOT_AMT: item.TOT_AMT.toLocaleString(),
      ORDER_AMT: item.ORDER_AMT.toLocaleString(),
      SAL_AMT: item.SAL_AMT.toLocaleString(),
      ACT_AMT: item.ACT_AMT.toLocaleString(),
      REC_CNT: item.REC_CNT.toLocaleString(),
      CUST_CNT: item.CUST_CNT.toLocaleString(),
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
