/*--############################################################################
# Filename : MST01_033INS.vue                                                  
# Description : 마스터관리 > 메뉴 마스터 > 메뉴코드등록                        
# Date :2025-05-14                                                             
# Author : 권맑음                     
################################################################################*/
<template>
  <div
    class="w-[100vw] h-[9vh] absolute top-[6vh] bg-black grid grid-rows-1 grid-cols-[1fr,3fr,1fr]">
    <div class="flex flex-col items-center justify-center ml-2">
      <div class="text-sm text-white text-nowrap">{{ startDate }}</div>
      <div class="text-sm text-white text-nowrap">~{{ endDate }}</div>
    </div>
    <div class="flex flex-col items-center justify-center">
      <div
        class="text-sm text-white whitespace-nowrap overflow-hidden w-[50vw]">
        {{ selectedStoreName }}
      </div>
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
      <div
        class="flex justify-start space-x-2 mt-[2vh] text-lg font-medium ml-[4vw]">
        <div>조회기간</div>
        <div class="w-[35vw]">
          <input
            type="date"
            v-model="startDate"
            class="border w-full text-xs"
            @input="resetIcon" />
        </div>
        <div class="w-[35vw]">
          <input
            type="date"
            v-model="endDate"
            class="border w-full text-xs"
            @input="resetIcon" />
        </div>
      </div>
      <div
        class="flex w-full mt-[3vh] justify-center items-center space-x-2 p-2">
        <button
          @click="setYesterDay"
          class="border border-blue-500 text-blue-500 rounded-lg w-1/4 h-8"
          :class="setIcon == 1 ? 'bg-blue-500 text-white' : ''">
          전일
        </button>
        <button
          @click="setLastWeek"
          class="border border-blue-500 text-blue-500 rounded-lg w-1/4 h-8"
          :class="setIcon == 2 ? 'bg-blue-500 text-white' : ''">
          1주일
        </button>
        <button
          @click="setLastMonth"
          class="border border-blue-500 text-blue-500 rounded-lg w-1/4 h-8"
          :class="setIcon == 3 ? 'bg-blue-500 text-white' : ''">
          1개월
        </button>
        <button
          @click="setLast3Month"
          class="border border-blue-500 text-blue-500 rounded-lg w-1/4 h-8"
          :class="setIcon == 4 ? 'bg-blue-500 text-white' : ''">
          3개월
        </button>
      </div>

      <div class="flex flex-col mt-[5vh] space-x-5 space-y-2">
        <div class="flex">
          <div class="text-lg font-medium ml-[5vw]">매장검색</div>
          <div class="border border-gray-600 w-[60vw]">
            <input
              type="text"
              class="w-full h-full"
              v-model="searchword"
              @keydown.enter="filterStore" />
          </div>
          <button class="text-2xl" id="StoreSelect2" @click="filterStore">
            🔍
          </button>
        </div>
        <div class="flex">
          <div class="text-lg font-medium ml-[4vw]">지점명</div>
          <div class="border border-gray-600 w-[60vw]">
            <select
              name=""
              id="StoreSelect"
              ref="StoreSelect"
              class="w-full h-full"
              v-model="selectedStoreCd2">
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
import { getAppStoreList } from "@/api/mobile";
import { formatLocalDate } from "@/customFunc/customFunc";
import store from "@/store";
/*
 * 공통 표준  Function
 */

import { nextTick, onMounted, ref, watch } from "vue";

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

const resetIcon = () => {
  setIcon.value = 0;
};
const setIcon = ref(0);
const setYesterDay = () => {
  const today = new Date();
  today.setDate(today.getDate() - 1);

  startDate.value = formatLocalDate(today);
  endDate.value = formatLocalDate(today);
  setIcon.value = 1;
};
const setLastWeek = () => {
  const today = new Date();
  today.setDate(today.getDate() - 1);
  endDate.value = formatLocalDate(today);

  today.setDate(today.getDate() - 6);
  startDate.value = formatLocalDate(today);
  setIcon.value = 2;
};
const setLastMonth = () => {
  const today = new Date();
  today.setDate(today.getDate() - 1);
  endDate.value = formatLocalDate(today);

  today.setMonth(today.getMonth() - 1);
  today.setDate(today.getDate() + 1);
  startDate.value = formatLocalDate(today);
  setIcon.value = 3;
};
const setLast3Month = () => {
  const today = new Date();
  today.setDate(today.getDate() - 1);
  endDate.value = formatLocalDate(today);

  today.setMonth(today.getMonth() - 3);
  today.setDate(today.getDate() + 1);
  startDate.value = formatLocalDate(today);
  setIcon.value = 4;
};
const emit = defineEmits([
  "currState",
  "startDate",
  "endDate",
  "GROUP_CD",
  "STORE_CD",
  "SEARCHNOW",
]);
const showStoreAndDate = () => {
  show.value = true;

  selectedStoreCd2.value = selectedStoreCd.value;
};
/**
 * 	화면 Load시 실행 스크립트
 */
const tempStoreList = ref([]);
onMounted(async () => {
  const res = await getAppStoreList(
    store.state.userData.GROUP_CD,
    store.state.userData.STORE_CD,
    store.state.userData.USER_NO
  );

  // console.log(res);

  StoreList.value = res?.data?.List;
  tempStoreList.value = res?.data?.List;
  ////console.log(StoreList.value);
  selectedStoreCd.value = {
    STORE_CD: store.state.userData.STORE_CD,
    GROUP_CD: store.state.userData.GROUP_CD,
  };

  selectedStoreCd2.value = {
    STORE_CD: store.state.userData.STORE_CD,
    GROUP_CD: store.state.userData.GROUP_CD,
  };
  //comsole.log(selectedStoreCd.value);
  //comsole.log(StoreList.value);
  const filteredNm = StoreList.value.filter(
    (item) => item.STORE_CD == selectedStoreCd.value.STORE_CD
  )[0]?.STORE_NM;
  selectedStoreName.value = filteredNm;
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

const selectedStoreCd2 = ref(0);
const sendSearch = () => {
  //comsole.log(selectedStoreCd.value.GROUP_CD);
  emit("startDate", startDate.value);
  emit("endDate", endDate.value);
  emit("GROUP_CD", selectedStoreCd2.value.GROUP_CD);
  emit("STORE_CD", selectedStoreCd2.value.STORE_CD);

  //comsole.log(selectedStoreCd2.value);
  selectedStoreCd.value = selectedStoreCd2.value;
  emit("SEARCHNOW", true);

  const filteredNm = StoreList.value.filter(
    (item) =>
      item.STORE_CD == selectedStoreCd.value.STORE_CD &&
      item.GROUP_CD == selectedStoreCd.value.GROUP_CD
  )[0].STORE_NM;
  selectedStoreName.value = filteredNm;
  show.value = false;
};

const searchword = ref("");

const StoreSelect = ref(null);
const filterStore = async (e) => {
  if (searchword.value == "" || searchword.value == undefined) {
    StoreList.value = [...tempStoreList.value];
  } else {
    StoreList.value = tempStoreList.value.filter((item) =>
      item.STORE_NM.toLowerCase().includes(searchword.value.toLowerCase())
    );
  }

  selectedStoreCd2.value = StoreList.value
    .map((item) => ({
      GROUP_CD: item.GROUP_CD,
      STORE_CD: item.STORE_CD,
    }))
    .filter((_, index) => index == 0)[0];

  document.querySelector("#StoreSelect").focus();
};

function openSelect() {
  const element = document.querySelector("#StoreSelect");

  if (element) {
    try {
      // 최신 브라우저용 표준 메서드
      element.showPicker();
    } catch (error) {
      // showPicker를 지원하지 않는 브라우저를 위한 예외 처리
      console.log("이 브라우저는 강제 오픈을 지원하지 않습니다.", error);
      // 아래 방법 2(size 변경)를 여기서 실행할 수도 있습니다.
      element.focus();
    }
  }
}

onMounted(() => {
  const triggerBtn = document.querySelector("#StoreSelect2");
  if (triggerBtn) {
    triggerBtn.addEventListener("click", (e) => {
      e.preventDefault(); // 버튼 고유 동작 방지
      openSelect();
    });
  }
});
</script>

<style lang="scss" scoped></style>
