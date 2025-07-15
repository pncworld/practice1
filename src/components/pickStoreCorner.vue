<template>
  <div
    class="grid grid-rows-1 grid-cols-[1fr,3fr,3fr,6fr] w-[600px] h-8 items-center justify-start gap-5 ml-12 mt-2">
    <div class="text-base font-semibold text-nowrap w-auto">매장 코너</div>
    <div class="w-32">
      <select
        name=""
        id=""
        v-model="storeGroup"
        disabled
        class="w-36 h-10 rounded-lg text-center flex justify-start">
        <option :value="i.lngStoreGroup" v-for="i in storeGroups">
          {{ i.strName }}
        </option>
      </select>
    </div>
    <div class="w-28">
      <v-select
        v-model="storeStore"
        :options="storeList"
        :disabled="lngPositionType == 0"
        label="strName"
        :placeholder="'선택'"
        class="custom-select9 bg-white w-52 h-10 mr-10 disabled:bg-gray-50"
        :clearable="lngPositionType !== 0"
        @click="resetStore" />
    </div>
    <div class="pl-20">
      <v-select
        v-model="selectedAreaCode"
        :options="storeAreaList"
        :disabled="lngPositionType == 0"
        label="strName"
        :placeholder="'전체'"
        class="custom-select9 bg-white w-80 h-10 disabled:bg-gray-100"
        @click="resetArea"
        :clearable="lngPositionType !== 0"
        @change="sendStoreCode" />
    </div>
  </div>
</template>

<script setup>
import { getStoreCorner } from "@/api/misales";
import { ref, watch } from "vue";
import { onMounted } from "vue";
import { useStore } from "vuex";

const store = useStore();
const storeGroup = ref(store.state.storeGroup[0].lngStoreGroup);
const storeStore = ref(store.state.storeCd[0]);
const storeGroups = ref();
const storeList = ref();
const selectedAreaCode = ref(null);
const storeAreaList = ref([]);
const emit = defineEmits([
  "lngStoreGroup",
  "lngAreaCode",
  "lngStoreCode",
  "excelStore",
]);
const lngPositionType = ref(0);
onMounted(async () => {
  //comsole.log(store.state.storeGroup);
  //comsole.log(store.state);
  storeGroups.value = store.state.storeGroup;
  storeList.value = store.state.storeCd;
  storeGroup.value = store.state.storeGroup[0].lngStoreGroup;
  storeStore.value = store.state.storeCd[0];
  lngPositionType.value =
    store.state.userData.lngPositionType == "1" ||
    store.state.userData.blnBrandAdmin == "True"
      ? 1
      : 0;
  let lngStoreCode = store.state.userData.lngPosition;
  let lngAreaCode = store.state.userData.lngAreaCode;

  let userGroup = store.state.userData.lngStoreGroup;
  const res = await getStoreCorner(
    userGroup,
    lngPositionType.value,
    lngStoreCode,
    lngAreaCode
  );
  console.log(res);
  storeAreaList.value = res.data.List;
  //comsole.log(storeAreaList.value);
  // selectedAreaCode.value = storeAreaList.value[0].lngAreaCode
  if (
    store.state.userData.lngPositionType == "1" ||
    store.state.userData.blnBrandAdmin == "True"
  ) {
    storeStore.value = storeList.value.filter(
      (item) => item.lngStoreCode == lngStoreCode
    )[0];
    selectedAreaCode.value = null;
  } else {
    storeStore.value = storeList.value.filter(
      (item) => item.lngStoreCode == lngStoreCode
    )[0];
    selectedAreaCode.value = storeAreaList.value.filter(
      (item) => item.lngAreaCode == lngAreaCode
    )[0];
  }
  emit("lngStoreGroup", storeGroup.value);
  if (storeStore.value == null) {
    emit("lngStoreCode", 0);
  } else {
    emit("lngStoreCode", storeStore.value.lngStoreCode);
  }

  if (selectedAreaCode.value == null) {
    emit("excelStore", "매장 코너 : 전체");
    emit("lngAreaCode", 0);
  } else {
    const excelName = storeAreaList.value.filter(
      (item) => item.lngAreaCode == selectedAreaCode.value.lngAreaCode
    )[0].strName;
    emit("excelStore", "매장 코너 : " + excelName);
    emit("lngAreaCode", selectedAreaCode.value);
  }
});

const sendStoreCode = (e) => {};
watch(storeStore, () => {
  if (storeStore.value == null) {
    emit("lngStoreCode", 0);
  } else {
    emit("lngStoreCode", storeStore.value.lngStoreCode);
  }

  selectedAreaCode.value = null;
  emit("lngAreaCode", 0);
});
watch(selectedAreaCode, () => {
  if (selectedAreaCode.value == null) {
    emit("lngAreaCode", 0);
  } else {
    emit("lngAreaCode", selectedAreaCode.value.lngAreaCode);
  }
});

const resetStore = () => {
  if (lngPositionType.value == 1) {
    storeStore.value = null;
  }
};
const resetArea = () => {
  if (lngPositionType.value == 1) {
    selectedAreaCode.value = null;
  }
};
</script>

<style>
.custom-select9.vs--disabled .vs__search {
  height: 100%;
  padding: 1px 0 !important; /* 입력 필드가 너무 위쪽에 올라가지 않도록 조정 */
  margin: 0 !important;
  display: none;
  color: rgb(211, 211, 211) !important;
}
.vs--disabled .vs__dropdown-toggle {
  background-color: white !important;
  border-color: white !important;
  -webkit-text-fill-color: #2c3e50 !important;
  opacity: 0.7;
}
</style>
