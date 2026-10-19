<template>
  <div class="pss-root flex w-full min-w-0 max-w-full flex-row gap-2">
    <div
      class="pss-brand flex shrink-0 items-center justify-center self-stretch font-semibold text-base text-nowrap"
      style="width: 4.5rem; min-width: 3.5rem">
      매장명
    </div>
    <div class="pss-grid min-w-0 flex-1">
      <label
        class="pss-radio flex shrink-0 cursor-pointer items-center gap-1 self-center text-base font-normal"
        for="searchType1"
        >직/가맹<input
          id="searchType1"
          type="radio"
          value="1"
          v-model="settingDisable"
          @click="initSearchBox"
          :disabled="settingDisable2"
      /></label>
      <select
        v-model="selectedStoreGroup"
        disabled
        class="pss-select pss-col-grp min-w-0">
        <option :value="i.lngStoreGroup" v-for="i in storeGroup" :key="i.lngStoreGroup">
          {{ i.strName }}
        </option>
      </select>
      <select
        v-model="selectedStoreType"
        :disabled="disabled1"
        class="pss-select pss-col-mid min-w-0 w-full">
        <option :value="0">전체</option>
        <option :value="i.lngStoreAttr" v-for="i in storeType" :key="i.lngStoreAttr">
          {{ i.strName }}
        </option>
      </select>
      <div class="pss-col-store min-w-0">
        <v-select
          v-model="selectedStoreList"
          append-to-body
          :options="rowData"
          label="strName"
          :placeholder="placeHolderNm"
          class="custom-select2 pss-vselect w-full min-w-0"
          clearable="true"
          @click="clickPosNo"
          :disabled="disabled1"
          :reduce="(store) => store.lngStoreCode" />
      </div>

      <label
        class="pss-radio flex shrink-0 cursor-pointer items-center gap-1 self-center text-base font-normal"
        for="searchType2"
        >팀/SC<input
          id="searchType2"
          type="radio"
          value="2"
          v-model="settingDisable"
          @click="initSearchBox"
          :disabled="settingDisable2"
      /></label>
      <select
        v-model="selectedStoreGroup2"
        disabled
        class="pss-select pss-col-grp min-w-0">
        <option :value="i.lngStoreGroup" v-for="i in storeGroup" :key="'g2-' + i.lngStoreGroup">
          {{ i.strName }}
        </option>
      </select>
      <div class="pss-col-mid pss-mid-pair min-w-0">
        <select
          v-model="selectedStoreTeam"
          class="pss-select min-w-0 w-full"
          :disabled="disabled2">
          <option :value="0">전체</option>
          <option :value="i.lngTeamCode" v-for="i in storeTeam" :key="i.lngTeamCode">
            {{ i.strTeamName }}
          </option>
        </select>
        <select
          v-model="selectedSuperVisor"
          class="pss-select min-w-0 w-full"
          :disabled="disabled2">
          <option :value="0">전체</option>
          <option :value="i.lngSupervisor" v-for="i in storeSuperVisor" :key="i.lngSupervisor">
            {{ i.strName }}
          </option>
        </select>
      </div>
      <div class="pss-col-store min-w-0">
        <v-select
          v-model="selectedStoreList"
          append-to-body
          :options="rowData"
          label="strName"
          :placeholder="placeHolderNm"
          class="custom-select2 pss-vselect w-full min-w-0"
          clearable="true"
          @click="clickPosNo"
          :disabled="disabled2"
          :reduce="(store) => store.lngStoreCode" />
      </div>
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
    ////console.log(store.state.userData.lngTeamCode);
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

const setStoreCode = (code) => {
  selectedStoreList.value =
    code == null || code === 0 ? null : Number(code);
};

defineExpose({ setStoreCode });
</script>

<style scoped>
.pss-root {
  --pss-control-h: 1.75rem;
  --pss-control-radius: 0.375rem;
}

/* 두 줄 동일 열: 끝선 맞춤. 그룹 콤보(1열) 2배 폭 → 마지막 열(1fr)이 같은 만큼 줄어듦 */
.pss-grid {
  --pss-grp-col: 11rem; /* 기존 5.5rem의 2배 */
  display: grid;
  align-items: center;
  column-gap: 0.5rem;
  row-gap: 0.375rem;
  grid-template-columns: auto var(--pss-grp-col) minmax(5.5rem, 12rem) minmax(0, 1fr);
  grid-template-rows: auto auto;
}

.pss-col-grp {
  width: var(--pss-grp-col);
  min-width: var(--pss-grp-col);
  max-width: 100%;
  box-sizing: border-box;
}

.pss-mid-pair {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  column-gap: 0.5rem;
  align-items: center;
  width: 100%;
}

.pss-col-store {
  min-width: 0;
  width: 100%;
}

.pss-select {
  box-sizing: border-box;
  height: var(--pss-control-h);
  min-height: var(--pss-control-h);
  max-height: var(--pss-control-h);
  padding: 0 0.35rem;
  border: 1px solid #cbd5e1;
  border-radius: var(--pss-control-radius);
  background-color: #fff;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.25rem;
  color: rgb(55 65 81);
}
.pss-select:focus {
  border-color: #3b82f6;
  outline: none;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.35);
}

/* 마지막 매장(v-select) — native .pss-select 와 동일 높이·라운드·테두리 */
.pss-root :deep(.pss-vselect) {
  width: 100%;
  min-width: 0;
  height: var(--pss-control-h);
  min-height: var(--pss-control-h);
  max-height: var(--pss-control-h);
  font-size: 0.875rem;
}
.pss-root :deep(.pss-vselect .vs__dropdown-toggle) {
  box-sizing: border-box;
  display: flex !important;
  align-items: center !important;
  justify-content: flex-start !important;
  height: var(--pss-control-h) !important;
  min-height: var(--pss-control-h) !important;
  max-height: var(--pss-control-h) !important;
  padding: 0 0.35rem !important;
  border: 1px solid #cbd5e1 !important;
  border-radius: var(--pss-control-radius) !important;
  background-color: #fff !important;
  box-shadow: none !important;
  overflow: hidden;
}
.pss-root :deep(.pss-vselect .vs__selected-options) {
  display: flex;
  align-items: center;
  flex-wrap: nowrap !important;
  padding: 0 !important;
  margin: 0 !important;
  min-width: 0;
  overflow: hidden;
}
.pss-root :deep(.pss-vselect .vs__selected),
.pss-root :deep(.pss-vselect .vs__placeholder),
.pss-root :deep(.pss-vselect .vs__search) {
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
  background: none !important;
  font-size: 0.875rem !important;
  font-weight: 400 !important;
  line-height: 1.25rem !important;
  color: rgb(55 65 81) !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.pss-root :deep(.pss-vselect .vs__actions) {
  padding: 0 0 0 0.15rem !important;
}
.pss-root :deep(.pss-vselect .vs__open-indicator) {
  fill: #94a3b8 !important;
  transform: scale(0.55) !important;
}
.pss-root :deep(.pss-vselect.vs--open .vs__open-indicator) {
  fill: #94a3b8 !important;
  transform: scale(0.55) rotate(180deg) !important;
}
.pss-root :deep(.pss-vselect .vs__clear) {
  fill: #94a3b8 !important;
  transform: scale(0.7);
  margin-top: 0;
}
</style>

<style>
.vs--disabled .vs__dropdown-toggle {
  background-color: #d1d5db !important;
  color: black !important; /* 텍스트 색상도 변경 */

  border-color: #d1d5db !important;
}
</style>
