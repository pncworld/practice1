/*--############################################################################
# Filename : MST01_033INS.vue                                                  
# Description : 마스터관리 > 메뉴 마스터 > 메뉴코드등록                        
# Date :2025-05-14                                                             
# Author : 권맑음                     
################################################################################*/
<template>
  <div class="h-full w-full" @click="resetScreen">
    <div class="mt-[6vh]">
      <select
        name=""
        id=""
        class="w-[90%] h-[6vh] font-semibold text-lg"
        v-model="selectStoreCd">
        <option
          class="text-center font-semibold text-lg"
          :value="{
            STORE_CD: i.STORE_CD,
            GROUP_CD: i.GROUP_CD,
          }"
          v-for="i in StoreList">
          {{ i.STORE_NM }}
        </option>
      </select>
    </div>
    <div
      class="relative h-[6vh] items-center text-lg font-medium w-full bg-black text-white flex justify-center">
      <div class="w-[40%] font-semibold text-nowrap flex justify-start pl-2">
        매장명
      </div>
      <div class="w-[40%] font-semibold flex justify-start pl-2">좌석명</div>
      <div class="w-[20%] font-semibold mr-2">
        <select
          name=""
          id=" "
          v-model="selectSeat"
          class="bg-black text-lg font-semibold">
          <option :value="0">전체</option>
          <option :value="2">사용</option>
          <option :value="1">미사용</option>
        </select>
      </div>
    </div>
    <div v-for="i in rowData" class="bg-white">
      <div
        class="grid grid-rows-1 grid-cols-[2fr,2fr,1fr] h-[8vh] justify-center items-center font-medium">
        <div class="pl-1 text-gray-400 font-semibold">{{ i.STORE_NM }}</div>

        <div class="flex justify-center">
          <div class="text-blue-600 flex text-nowrap">
            <div class="size-[3vh]">|</div>
            &nbsp;&nbsp;{{ i.TABLE_NM }}
          </div>
          &nbsp;&nbsp;{{ i.TABLE_CNT }}
        </div>
        <div
          :class="
            i.SEATIN_TY == '미사용'
              ? 'bg-gray-400 text-white'
              : 'bg-gray-200 text-gray-400'
          "
          class="w-full h-full text-center flex justify-center items-center">
          {{ i.SEATIN_TY }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getAppStoreList, getMobileSeatInfo } from "@/api/mobile";
/*
 * 공통 표준  Function
 */

import { onMounted, ref, watch } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";

const store = useStore();
const changeState = ref(true);
const resetScreen = async (e) => {
  changeState.value = false;

  // changeState.value = !changeState.value;
  store.state.inActiveBackGround = false;
};

const selectStartDate = ref("");
const selectEndDate = ref("");
const selectGroupCd = ref(store.state.userData.GROUP_CD);
const selectStoreCd = ref("");
const selectSeat = ref(0);

const StoreList = ref([]);
/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const res = await getAppStoreList(
    store.state.userData.GROUP_CD,
    store.state.userData.STORE_CD,
    store.state.userData.USER_NO
  );

  //comsole.log(res);

  StoreList.value = res?.data?.List;

  selectStoreCd.value = {
    STORE_CD: store.state.userData.STORE_CD,
    GROUP_CD: store.state.userData.GROUP_CD,
  };
});

const rowData = ref([]);

watch(
  () => store.state.mobileReSearch,
  async () => {
    try {
      store.state.loading2 = true;
      const res = await getMobileSeatInfo(
        selectGroupCd.value,
        selectStoreCd.value.STORE_CD,
        store.state.userData.USER_NO,
        selectSeat.value
      );

      rowData.value = res.data.List.map((item) => ({
        ...item,
        SEAT_CNT: item.SEAT_CNT.toLocaleString(),
      }));
    } catch (error) {
    } finally {
      store.state.loading2 = false;
    }
  }
);
watch([selectStoreCd, selectSeat], async () => {
  try {
    store.state.loading2 = true;
    const res = await getMobileSeatInfo(
      selectGroupCd.value,
      selectStoreCd.value.STORE_CD,
      store.state.userData.USER_NO,
      selectSeat.value
    );

    rowData.value = res.data.List.map((item) => ({
      ...item,
      SEAT_CNT: item.SEAT_CNT.toLocaleString(),
    }));
  } catch (error) {
  } finally {
    store.state.loading2 = false;
  }

  //comsole.log(rowData.value);
});

/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(() => {});
</script>

<style lang="scss" scoped></style>
