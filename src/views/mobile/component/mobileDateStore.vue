<template>
  <div
    class="w-[100vw] h-[9vh] absolute top-[6vh] bg-black grid grid-rows-1 grid-cols-[1fr,3fr,1fr]">
    <div class="flex flex-col items-center justify-center ml-2">
      <div class="text-lg text-white text-nowrap">{{ startDate }}</div>
      <div class="text-lg text-white text-nowrap">~{{ endDate }}</div>
    </div>
    <div class="flex flex-col items-center justify-center">
      <div class="text-lg text-white text-nowrap">{{ selectedStoreName }}</div>
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
import { onMounted, ref, watch } from "vue";

const startDate = ref(formatLocalDate(new Date()));
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
};
onMounted(async () => {
  const res = await getAppStoreList(
    store.state.userData.GROUP_CD,
    store.state.userData.STORE_CD,
    store.state.userData.USER_NO
  );

  StoreList.value = res?.data?.List;

  selectedStoreCd.value = {
    STORE_CD: store.state.userData.STORE_CD,
    GROUP_CD: store.state.userData.GROUP_CD,
  };
  console.log(selectedStoreCd.value);
  console.log(StoreList.value);
  const filteredNm = StoreList.value.filter(
    (item) => item.STORE_CD == selectedStoreCd.value.STORE_CD
  )[0].STORE_NM;
  selectedStoreName.value = filteredNm;
});

const StoreList = ref([]);
watch(
  () => props.changeState,
  () => {
    console.log(props.changeState);
    if (props.changeState == false) {
      show.value = props.changeState;
      emit("currState", true);
    }
  }
);

const selectedStoreCd = ref(0);
const sendSearch = () => {
  console.log(selectedStoreCd.value.GROUP_CD);
  emit("startDate", startDate.value);
  emit("endDate", endDate.value);
  emit("GROUP_CD", selectedStoreCd.value.GROUP_CD);
  emit("STORE_CD", selectedStoreCd.value.STORE_CD);
  emit("SEARCHNOW", true);

  const filteredNm = StoreList.value.filter(
    (item) => item.STORE_CD == selectedStoreCd.value.STORE_CD
  )[0].STORE_NM;
  selectedStoreName.value = filteredNm;
  show.value = false;
};
</script>

<style lang="scss" scoped></style>
