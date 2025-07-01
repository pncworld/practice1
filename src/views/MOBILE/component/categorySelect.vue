/*--############################################################################
# Filename : MST01_033INS.vue                                                  
# Description : 마스터관리 > 메뉴 마스터 > 메뉴코드등록                        
# Date :2025-05-14                                                             
# Author : 권맑음                     
################################################################################*/
<template>
  <div
    class="w-[100vw] h-[9vh] absolute top-[6vh] bg-black grid grid-rows-1 grid-cols-[4fr,1fr]">
    <div class="flex flex-col items-center justify-center">
      <div class="text-sm text-white text-nowrap">{{ selectedStoreName }}</div>
    </div>
    <div class="flex flex-col items-center justify-center bg-blue-500">
      <button @click="showStoreAndDate">
        <font-awesome-icon
          :icon="['fas', 'sliders']"
          class="text-white size-10" />
      </button>
    </div>
  </div>
  <div
    class="bg-white absolute top-0 text-black w-full h-[50vh] mt-[6vh]"
    v-show="show">
    <div class="flex flex-col">
      <div class="flex mt-[5vh] space-x-5">
        <div class="text-lg font-medium ml-[4vw]">지점명</div>
        <div class="border border-gray-600 w-[70vw]">
          <select name="" id="" class="w-full h-full" v-model="selectedStoreCd">
            <option
              :value="{
                STORE_CD: i.STORE_CD,
                GROUP_CD: i.GROUP_CD,
              }"
              v-for="i in StoreList">
              {{ i.STORE_NM }}
            </option>
          </select>
        </div>
      </div>
      <div class="flex mt-[5vh] space-x-5">
        <div class="text-lg font-medium ml-[4vw]">대카테고리</div>
        <div class="border border-gray-600 w-[60vw]">
          <select name="" id="" class="w-full h-full" v-model="selectedCond">
            <option value="0">선택</option>
            <option :value="i.LCLASS_CD" v-for="i in optionList">
              {{ i.LCLASS_NM }}
            </option>
          </select>
        </div>
      </div>
      <div class="flex mt-[5vh] space-x-5">
        <div class="text-lg font-medium ml-[4vw]">중카테고리</div>
        <div class="border border-gray-600 w-[60vw]">
          <select name="" id="" class="w-full h-full" v-model="selectedCond2">
            <option value="0">전체</option>
            <option :value="i.SCLASS_CD" v-for="i in optionList2">
              {{ i.SCLASS_NM }}
            </option>
          </select>
        </div>
      </div>
      <div class="flex justify-center items-center">
        <button
          @click="sendSearch"
          class="bg-blue-600 text-white text-xl rounded-lg w-[80vw] h-[5vh] mt-[5vh]">
          조회하기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { GetLClassInfo, GetSClassInfo } from "@/api/etc";
import { getAppStoreList } from "@/api/mobile";
import { formatLocalDate } from "@/customFunc/customFunc";
import store from "@/store";
import Swal from "sweetalert2";
/*
 * 공통 표준  Function
 */

import { onMounted, ref, watch } from "vue";

/**
 * 선택한 매출 시작일자
 */

const startDate = ref(formatLocalDate(new Date()));
/**
 * 선택한 매출 종료일자
 */

const endDate = ref(formatLocalDate(new Date()));
const selectedStoreName = ref("");
const show = ref(false);

const props = defineProps({
  changeState: {
    type: Boolean,
    default: false,
  },
});

const setIcon = ref(0);

const emit = defineEmits(["currState", "GROUP_CD", "STORE_CD", "FILTERDATA"]);
const showStoreAndDate = () => {
  show.value = true;

  selectedStoreCd2.value = selectedStoreCd.value;
};

/**
 * 	화면 Load시 실행 스크립트
 */
const optionList = ref([]);
const optionList2 = ref([]);
const selectedCond = ref(0);
const selectedCond2 = ref(1);
onMounted(async () => {
  const res = await getAppStoreList(
    store.state.userData.GROUP_CD,
    store.state.userData.STORE_CD,
    store.state.userData.USER_NO
  );

  StoreList.value = res?.data?.List;
  //console.log(StoreList.value);
  selectedStoreCd.value = {
    STORE_CD: store.state.userData.STORE_CD,
    GROUP_CD: store.state.userData.GROUP_CD,
  };

  //comsole.log(selectedStoreCd.value);
  //comsole.log(StoreList.value);
  const filteredNm = StoreList.value.filter(
    (item) => item.STORE_CD == selectedStoreCd.value.STORE_CD
  )[0]?.STORE_NM;
  selectedStoreName.value = filteredNm;

  const res2 = await GetLClassInfo(
    store.state.userData.GROUP_CD,
    store.state.userData.STORE_CD
  );
  //console.log(res2);
  optionList.value = res2.data.LClassList;
});

const StoreList = ref([]);
watch(
  () => props.changeState,
  () => {
    //comsole.log(props.changeState);
    if (props.changeState == false) {
      show.value = props.changeState;
      emit("currState", true);
    }
  }
);

/**
 * 선택한 매장 코드 호출 함수
 */

const selectedStoreCd = ref(0);
/**
 * 선택한 매장 코드 호출 함수
 */

watch(selectedStoreCd, async () => {
  const res2 = await GetLClassInfo(
    store.state.userData.GROUP_CD,
    selectedStoreCd.value.STORE_CD
  );
  console.log(res2);
  optionList.value = res2.data.LClassList;
  selectedCond.value = 0;
});

watch(selectedCond, async () => {
  const res2 = await GetSClassInfo(
    store.state.userData.GROUP_CD,
    selectedStoreCd.value.STORE_CD,
    selectedCond.value,
    0
  );
  console.log(res2);
  optionList2.value = res2.data.SClassList;
  selectedCond2.value = 0;
});

const selectedStoreCd2 = ref(0);
const sendSearch = () => {
  const filteredData = ref([]);
  if (selectedStoreCd.value == 0) {
    //filteredData.value = optionList2.value;
    Swal.fire({
      title: "경고",
      text: "지점을 선택해주세요.",
    });
    return;
  }
  if (selectedCond.value == 0) {
    //filteredData.value = optionList2.value;
    Swal.fire({
      title: "경고",
      text: "대카테고리를 선택해주세요.",
    });
    return;
  }

  if (selectedCond2.value == 0) {
    //filteredData.value = optionList2.value;
    Swal.fire({
      title: "경고",
      text: "중카테고리를 선택해주세요.",
    });
    return;
  } else {
    filteredData.value = optionList2.value.filter(
      (item) => item.SCLASS_CD == selectedCond2.value
    );
  }

  //comsole.log(selectedStoreCd.value.GROUP_CD);
  //   emit("startDate", startDate.value);
  //   emit("endDate", endDate.value);
  emit("GROUP_CD", selectedStoreCd.value.GROUP_CD);
  emit("STORE_CD", selectedStoreCd.value.STORE_CD);
  emit("FILTERDATA", filteredData.value);

  //comsole.log(selectedStoreCd2.value);
  //selectedStoreCd.value = selectedStoreCd2.value;
  emit("SEARCHNOW", true);

  const filteredNm = StoreList.value.filter(
    (item) =>
      item.STORE_CD == selectedStoreCd.value.STORE_CD &&
      item.GROUP_CD == selectedStoreCd.value.GROUP_CD
  )[0].STORE_NM;
  selectedStoreName.value = filteredNm;
  show.value = false;
};
</script>

<style lang="scss" scoped></style>
