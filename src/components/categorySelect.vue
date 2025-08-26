<template>
  <div class="grid grid-rows-1 grid-cols-4 mt-2 gap-5">
    <div class="flex ml-12 items-center space-x-5">
      <div class="text-base font-semibold">매장명</div>
      <select
        name=""
        id=""
        class="w-64 h-8 border border-black"
        v-model="selectedStoreCd">
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
    <div class="flex space-x-5 items-center">
      <div class="text-lg font-semibold">대카테고리</div>
      <div class="border border-gray-600">
        <select name="" id="" class="w-64 h-8" v-model="selectedCond">
          <option value="0">선택</option>
          <option :value="i.LCLASS_CD" v-for="i in optionList">
            {{ i.LCLASS_NM }}
          </option>
        </select>
      </div>
    </div>

    <div class="flex space-x-5 items-center">
      <div class="text-lg font-semibold">중카테고리</div>
      <div class="border border-gray-600">
        <select name="" id="" class="w-64 h-8" v-model="selectedCond2">
          <option value="0">선택</option>
          <option :value="i.SCLASS_CD" v-for="i in optionList2">
            {{ i.FULL_NM }}
          </option>
        </select>
      </div>
    </div>

    <!-- <div class="flex justify-center items-center">
      <button
        @click="sendSearch"
        class="bg-blue-600 text-white text-xl rounded-lg button search">
        조회
      </button>
    </div> -->
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
  reSearch: {
    type: Boolean,
    default: false,
  },
  getFilteredData: {
    type: Boolean,
    default: false,
  },
});

const setIcon = ref(0);

const emit = defineEmits([
  "currState",
  "GROUP_CD",
  "STORE_CD",
  "FILTERDATA",
  "MAINCATEGORY",
  "SUBCATEGORY",
]);
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
const selectedCond2 = ref(0);
onMounted(async () => {
  const res = await getAppStoreList(
    store.state.userData.lngStoreGroup,
    store.state.userData.lngPosition,
    store.state.userData.lngSequence
  );

  StoreList.value = res?.data?.List;
  //console.log(StoreList.value);
  selectedStoreCd.value = {
    STORE_CD: store.state.userData.lngPosition,
    GROUP_CD: store.state.userData.lngStoreGroup,
  };

  //comsole.log(selectedStoreCd.value);
  //comsole.log(StoreList.value);
  const filteredNm = StoreList.value.filter(
    (item) => item.STORE_CD == selectedStoreCd.value.STORE_CD
  )[0]?.STORE_NM;
  selectedStoreName.value = filteredNm;

  const res2 = await GetLClassInfo(
    store.state.userData.lngStoreGroup,
    store.state.userData.lngPosition
  );
  //console.log(res2);
  optionList.value = res2.data.LClassList;

  emit("SUBCATEGORY", selectedCond2.value);
  emit("MAINCATEGORY", selectedCond.value);
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
  emit("STORE_CD", selectedStoreCd.value);
  if (selectedStoreCd.value != 0) {
    const res2 = await GetLClassInfo(
      store.state.userData.lngStoreGroup,
      selectedStoreCd.value.STORE_CD
    );
    //console.log(res2);
    optionList.value = res2.data.LClassList;
    selectedCond.value = 0;
    selectedCond2.value = 0;
  } else {
    optionList.value = [];
    selectedCond.value = 0;
    optionList2.value = [];
    selectedCond2.value = 0;
  }
});

watch(selectedCond, async () => {
  emit("MAINCATEGORY", selectedCond.value);
  if (selectedCond.value == 0) {
    emit("mainCategory", "선택");
    return;
  }
  const res2 = await GetSClassInfo(
    store.state.userData.lngStoreGroup,
    selectedStoreCd.value.STORE_CD,
    selectedCond.value,
    0
  );
  //console.log(res2);
  optionList2.value = res2.data.SClassList;
  selectedCond2.value = 0;
  const maincategory = optionList.value.filter(
    (item) => item.LCLASS_CD == selectedCond.value
  )[0].LCLASS_NM;
  emit("mainCategory", maincategory);
});

watch(selectedCond2, () => {
  emit("SUBCATEGORY", selectedCond2.value);
  //emit("FILTERDATA");
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

watch(
  () => props.getFilteredData,
  () => {
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
  }
);

watch(
  () => props.reSearch,
  async () => {
    const res1 = await GetLClassInfo(
      store.state.userData.lngStoreGroup,
      selectedStoreCd.value.STORE_CD
    );
    //console.log(res1);
    optionList.value = res1.data.LClassList;

    const res2 = await GetSClassInfo(
      store.state.userData.lngStoreGroup,
      selectedStoreCd.value.STORE_CD,
      selectedCond.value,
      0
    );
    //console.log(res2);
    optionList2.value = res2.data.SClassList;
    // selectedCond2.value = 0;
    const maincategory = optionList.value.filter(
      (item) => item.LCLASS_CD == selectedCond.value
    )[0].LCLASS_NM;
    emit("mainCategory", maincategory);

    //sendSearch();
  }
);
</script>

<style lang="scss" scoped></style>
