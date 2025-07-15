<template>
  <div
    class="grid grid-cols-[80px,80px,150px,150px,300px] grid-rows-2 h-16 w-[750px] mt-2">
    <div
      class="font-semibold text-nowrap text-base row-span-2 flex justify-center items-center">
      매장명
    </div>
    <div class="flex justify-start items-center">
      <label for="searchType1" class="text-base font-normal"
        >직/가맹<input
          type="radio"
          id="searchType1"
          value="1"
          v-model="settingDisable"
          @click="initSearchBox"
          :disabled="settingDisable2"
      /></label>
    </div>
    <div class="w-24">
      <select
        name=""
        id=""
        v-model="selectedStoreGroup"
        :disabled="true"
        class="mr-28 w-36 h-7 rounded-lg">
        <option :value="i.lngStoreGroup" v-for="i in storeGroup">
          {{ i.strName }}
        </option>
      </select>
    </div>
    <div>
      <select
        name=""
        id=""
        v-model="selectedStoreType"
        :disabled="disabled1"
        class="w-36 h-7 rounded-lg mr-20">
        <option :value="0">전체</option>
        <option :value="i.lngStoreAttr" v-for="i in storeType">
          {{ i.strName }}
        </option>
      </select>
    </div>
    <div class="w-44">
      <div class="w-44 !h-7">
        <v-select
          v-model="selectedStoreList"
          :options="rowData"
          label="strName"
          :placeholder="placeHolderNm"
          class="custom-select2 w-80"
          clearable="true"
          @click="clickPosNo"
          :disabled="disabled1"
          :reduce="(store) => store.lngStoreCode" />
      </div>
    </div>
    <div class="flex justify-center items-center">
      <label for="searchType2" class="text-base font-normal mr-3"
        >팀/SC<input
          type="radio"
          id="searchType2"
          value="2"
          v-model="settingDisable"
          @click="initSearchBox"
          :disabled="settingDisable2"
      /></label>
    </div>
    <div class="w-32">
      <select
        name=""
        id=""
        v-model="selectedStoreGroup2"
        class="w-full mr-10 h-7 rounded-lg"
        :disabled="true">
        <option :value="i.lngStoreGroup" v-for="i in storeGroup">
          {{ i.strName }}
        </option>
      </select>
    </div>
    <div>
      <div class="grid grid-rows-1 grid-cols-2">
        <div class="-ml-3">
          <select
            name=""
            id=""
            v-model="selectedStoreTeam"
            class="w-full h-7 rounded-lg"
            :disabled="disabled2">
            <option :value="0">전체</option>
            <option :value="i.lngTeamCode" v-for="i in storeTeam">
              {{ i.strTeamName }}
            </option>
          </select>
        </div>
        <div>
          <select
            name=""
            id=""
            v-model="selectedSuperVisor"
            class="w-28 h-7 rounded-lg ml-2"
            :disabled="disabled2">
            <option :value="0">전체</option>
            <option :value="i.lngSupervisor" v-for="i in storeSuperVisor">
              {{ i.strName }}
            </option>
          </select>
        </div>
      </div>
    </div>
    <div class="ml-10">
      <v-select
        v-model="selectedStoreList"
        :options="rowData"
        label="strName"
        :placeholder="placeHolderNm"
        class="custom-select4 pr-20"
        clearable="true"
        @click="clickPosNo"
        :disabled="disabled2"
        :reduce="(store) => store.lngStoreCode" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useStore } from "vuex";

const store = useStore();
const teamscList = ref("선택");
const selectedStoreList = ref(null);
const selectedStoreList2 = ref(null);
const selectedStore = ref(0);
const storeGroup = ref([]);
const storeType = ref([]);
const storeTeam = ref([]);
const settingDisable = ref(1);
const storeSuperVisor = ref([]);
const selectedStoreGroup = ref(store.state.storeGroup[0].lngStoreGroup);
const selectedStoreGroup2 = ref(store.state.storeGroup[0].lngStoreGroup);
const selectedStoreType = ref(0);
const selectedStoreTeam = ref(0);
const selectedSuperVisor = ref(0);
const settingDisable2 = ref(false);
const emit = defineEmits([
  "lngStoreGroups",
  "lngStoreCode",
  "lngStoreAttrs",
  "lngStoreGroup",
  "excelStore",
  "lngStoreTeam",
  "lngSupervisor",
  "changeInit",
]);
const props = defineProps({
  initCheckBox: {
    type: Boolean,
    default: false,
  },
  initSearchWord: {
    type: Boolean,
    default: false,
  },
  placeholderName: {
    type: String,
    default: "전체",
  },
  setDisableType: {
    type: Boolean,
    default: false,
  },
});
const disabled1 = ref(false);
const disabled2 = ref(true);
const rowData = ref([]);
const rowData2 = ref([]);
const labelingColumns = ref(
  "lngStoreGroup,lngStoreAttr,lngTeamCode,lngSupervisor"
);
const placeHolderNm = ref(props.placeholderName);
const valuesData = ref([]);
const labelsData = ref([]);
onMounted(() => {
  placeHolderNm.value = props.placeholderName;
  storeGroup.value = store.state.storeGroup;
  storeType.value = store.state.storeType;

  storeTeam.value = store.state.storeTeamCode;
  storeSuperVisor.value = store.state.storeSupervisor;
  rowData.value = store.state.storeCd;
  rowData2.value = store.state.storeCd;
  if (
    store.state.userData.blnBrandAdmin == "True" ||
    store.state.userData.lngPositionType == "1"
  ) {
    disabled1.value = false;
    emit("lngStoreGroup", store.state.storeGroup[0].lngStoreGroup);

    emit("lngStoreCode", 0);
    //comsole.log(store.state.storeCd);

    emit("lngStoreAttrs", 0);
    emit("lngSupervisor", 0);
    emit("lngStoreTeam", 0);
    emit("excelStore", "매장명 : 전체");
  } else {
    console.log(store.state.userData.lngTeamCode);
    emit("lngStoreGroup", store.state.userData.lngStoreGroup);
    emit("lngStoreCode", store.state.userData.lngPosition);
    emit("lngStoreAttrs", store.state.userData.lngJoinType);
    emit(
      "lngSupervisor",
      store.state.userData.lngSupervisor == undefined ||
        store.state.userData.lngSupervisor == ""
        ? 0
        : store.state.userData.lngSupervisor
    );
    emit(
      "lngStoreTeam",
      store.state.userData.lngTeamCode == undefined ||
        store.state.userData.lngTeamCode == ""
        ? 0
        : store.state.userData.lngTeamCode
    );
    emit("excelStore", "매장명 : " + store.state.userData.strStoreName);
    selectedStoreType.value = store.state.userData.lngJoinType;
    selectedStoreList.value = Number(store.state.userData.lngPosition);
    //comsole.log(selectedStoreList.value);
    selectedStoreTeam.value =
      store.state.userData.lngTeamCode == undefined ||
      store.state.userData.lngTeamCode == ""
        ? 0
        : store.state.userData.lngTeamCode;
    selectedSuperVisor.value =
      store.state.userData.lngSupervisor == undefined ||
      store.state.userData.lngSupervisor == ""
        ? 0
        : store.state.userData.lngSupervisor;
    disabled1.value = true;
    settingDisable2.value = true;
  }

  if (props.setDisableType == true) {
    settingDisable.value = 2;
    disabled2.value = false;
    disabled1.value = true;
    settingDisable2.value = true;
  }
  // labelsData.value.push(store.state.storeGroup.map(item => item.strName))
  // valuesData.value.push(store.state.storeGroup.map(item => item.lngStoreGroup))

  // labelsData.value.push(store.state.storeType.map(item => item.strName))
  // valuesData.value.push(store.state.storeType.map(item => item.lngStoreAttr))

  // labelsData.value.push(store.state.storeTeamCode.map(item => item.strTeamName))
  // valuesData.value.push(store.state.storeTeamCode.map(item => item.lngTeamCode))

  // labelsData.value.push(store.state.storeSupervisor.map(item => item.strName))
  // valuesData.value.push(store.state.storeSupervisor.map(item => item.lngSupervisor))
});

watch(selectedStoreType, (newValue) => {
  if (selectedStoreType.value == 0) {
    rowData.value = store.state.storeCd;
  } else {
    rowData.value = store.state.storeCd.filter(
      (item) => item.lngStoreAttr == selectedStoreType.value
    );
  }
  if (
    store.state.userData.blnBrandAdmin == "True" ||
    store.state.userData.lngPositionType == "1"
  ) {
    selectedStoreList.value = null;
  }

  emit("lngStoreAttrs", selectedStoreType.value);
  emit("changeInit", true);
});

watch(selectedStoreTeam, (newValue) => {
  if (selectedStoreTeam.value == 0) {
    rowData.value = store.state.storeCd;
    storeSuperVisor.value = store.state.storeSupervisor;
  } else {
    rowData.value = store.state.storeCd.filter(
      (item) => item.lngTeamCode == selectedStoreTeam.value
    );
    storeSuperVisor.value = store.state.storeSupervisor.filter(
      (item) => item.lngTeamCode == selectedStoreTeam.value
    );
  }
  selectedSuperVisor.value = 0;
  if (
    store.state.userData.blnBrandAdmin == "True" ||
    store.state.userData.lngPositionType == "1"
  ) {
    selectedStoreList.value = null;
  }
  emit("lngStoreTeam", selectedStoreTeam.value);
  emit("changeInit", true);
});

watch(selectedSuperVisor, (newValue) => {
  if (selectedSuperVisor.value == 0) {
    if (selectedStoreTeam.value == 0) {
      rowData.value = store.state.storeCd;
    } else {
      rowData.value = store.state.storeCd.filter(
        (item) => item.lngTeamCode == selectedStoreTeam.value
      );
    }
  } else {
    if (selectedStoreTeam.value == 0) {
      rowData.value = store.state.storeCd.filter(
        (item) => item.lngSupervisor == selectedSuperVisor.value
      );
    } else {
      rowData.value = store.state.storeCd
        .filter((item) => item.lngTeamCode == selectedStoreTeam.value)
        .filter((item) => item.lngSupervisor == selectedSuperVisor.value);
    }
  }
  emit("lngSupervisor", selectedSuperVisor.value);
  emit("changeInit", true);
  if (
    store.state.userData.blnBrandAdmin == "True" ||
    store.state.userData.lngPositionType == "1"
  ) {
    selectedStoreList.value = null;
  }
});

watch(selectedStoreList, () => {
  if (selectedStoreList.value == null) {
    selectedStore.value = 0;
    emit("excelStore", "매장명 : 전체");
  } else {
    selectedStore.value = selectedStoreList.value;
    const name = store.state.storeCd.filter(
      (item) => item.lngStoreCode == selectedStoreList.value
    )[0].strName;
    emit("excelStore", "매장명 :" + name);
  }
  emit("lngStoreCode", selectedStore.value);
  emit("changeInit", true);
});

const initSearchBox = (e) => {
  if (e.target.value == 1) {
    selectedSuperVisor.value = 0;
    selectedStoreTeam.value = 0;
    disabled2.value = true;
    disabled1.value = false;
  } else {
    selectedStoreType.value = 0;
    disabled2.value = false;
    disabled1.value = true;
  }
};
</script>

<style>
.vs--disabled .vs__dropdown-toggle {
  background-color: #d1d5db !important;
  color: black !important; /* 텍스트 색상도 변경 */

  border-color: #d1d5db !important;
}
</style>
