<template>
  <div
    class="psp-root"
    :class="fluidWidth ? 'psp-root--fluid' : 'psp-root--fixed'">
    <div
      class="psp-label font-semibold text-base row-span-2 text-nowrap flex items-center justify-center">
      매장명
    </div>
    <div class="psp-cell psp-cell--radio flex justify-center items-center">
      <label for="searchType1" class="text-base" :disabled="disabled1"
        >직/가맹&nbsp;<input
          type="radio"
          id="searchType1"
          value="1"
          v-model="settingDisable"
          :disabled="disabled1"
      /></label>
    </div>
    <div class="psp-cell">
      <select
        name=""
        id=""
        v-model="selectedStoreGroup"
        :disabled="true"
        class="psp-select psp-select--grp rounded-lg">
        <option :value="i.lngStoreGroup" v-for="i in storeGroup">
          {{ i.strName }}
        </option>
      </select>
    </div>
    <div class="psp-cell">
      <select
        name=""
        id=""
        v-model="selectedStoreType"
        :disabled="settingDisable == 2 || disabled1"
        class="psp-select psp-select--mid rounded-lg"
        @change="selectstoreType">
        <option :value="0">전체</option>
        <option :value="i.lngStoreAttr" v-for="i in storeType">
          {{ i.strName }}
        </option>
      </select>
    </div>
    <div class="psp-store-pick">
      <div class="psp-store-trigger-wrap">
        <button
          type="button"
          class="psp-store-trigger"
          :class="{ 'is-open': showStore }"
          :disabled="settingDisable == 2 || disabled1"
          :title="hasSelectedStores && settingDisable == 1 ? undefined : '매장 선택'"
          @click="showStoreList">
          <span class="psp-store-trigger__text">{{ selectedStoreList }}</span>
          <svg
            class="psp-store-trigger__chev"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true">
            <path
              d="M5 7.5L10 12.5L15 7.5"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </button>
        <button
          v-show="showStore"
          type="button"
          class="psp-collapse-btn"
          title="매장 선택 접기"
          @click="showStoreList">
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              d="M5 12.5L10 7.5L15 12.5"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </button>
        <div
          v-if="hasSelectedStores && !showStore && settingDisable == 1"
          class="psp-store-hover-list"
          role="tooltip">
          <div class="psp-store-hover-list__frame">
            <div class="psp-store-hover-list__body">
              <div class="psp-store-hover-list__head">
                선택 {{ selectedStores.length }}개 매장
              </div>
              <div
                v-for="(name, idx) in hoverStoreNames"
                :key="`${idx}-${name}`"
                class="psp-store-hover-list__row">
                {{ name }}
              </div>
              <div
                v-if="hoverStoreMoreCount > 0"
                class="psp-store-hover-list__row psp-store-hover-list__row--more">
                ... 외 {{ hoverStoreMoreCount }}개 매장
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="showStore"
        class="psp-popup z-30 absolute">
        <div class="psp-filter-bar">
          <label class="psp-filter-label" for="psp-store-filter">매장명</label>
          <input
            id="psp-store-filter"
            type="text"
            class="psp-filter-input"
            placeholder="매장명 검색"
            v-model="searchWord"
            @input="searchword" />
          <button type="button" class="psp-sub-btn" @click="showOnlyChecked">
            선택매장확인
          </button>
          <button type="button" class="psp-sub-btn" @click="resetChecked">
            초기화
          </button>
        </div>
        <div class="psp-popup-body">
          <Realgrid
            class="psp-store-grid"
            :progname="'PICKSTOREPLURAL_VUE'"
            :progid="1"
            :rowData="rowData"
            :setStateBar="false"
            @checkedRowData="checkedRowData"
            @selcetedrowData="selcetedrowData"
            :searchWord3="searchWord"
            :searchColId="'strName'"
            :rowStateeditable="false"
            :checkRenderEditable="true"
            :checkRowAuto="false"
            :checkRowAuto2="true"
            :checkRowAuto2Col="'checkbox'"
            @updatedRowData="updatedRowData"
            :labelsData="labelsData"
            :valuesData="valuesData"
            :labelingColumns="labelingColumns"
            :showOnlyChecked="showOnlycheck"></Realgrid>
        </div>
      </div>
    </div>
    <div class="psp-cell psp-cell--radio flex justify-center items-center">
      <label for="searchType2" class="text-base" :disabled="disabled1"
        >팀/SC&nbsp;<input
          type="radio"
          id="searchType2"
          value="2"
          v-model="settingDisable"
          :disabled="disabled1"
      /></label>
    </div>
    <div class="psp-cell">
      <select
        name=""
        id=""
        v-model="selectedStoreGroup2"
        class="psp-select psp-select--grp rounded-lg"
        :disabled="true">
        <option :value="i.lngStoreGroup" v-for="i in storeGroup">
          {{ i.strName }}
        </option>
      </select>
    </div>
    <div class="psp-cell psp-cell--team">
      <div class="psp-team-pair">
        <select
          name=""
          id=""
          v-model="selectedStoreTeam"
          class="psp-select rounded-lg"
          :disabled="settingDisable == 1 || disabled1"
          @change="selectstoreteam">
          <option :value="0">전체</option>
          <option :value="i.lngTeamCode" v-for="i in storeTeam">
            {{ i.strTeamName }}
          </option>
        </select>
        <select
          name=""
          id=""
          v-model="selectedSuperVisor"
          class="psp-select rounded-lg"
          :disabled="settingDisable == 1 || disabled1"
          @change="selectsupervisor">
          <option :value="0">전체</option>
          <option :value="i.lngSupervisor" v-for="i in storeSuperVisor">
            {{ i.strName }}
          </option>
        </select>
      </div>
    </div>
    <div class="psp-store-pick">
      <div class="psp-store-trigger-wrap">
        <button
          type="button"
          class="psp-store-trigger"
          :class="{ 'is-open': showStore && settingDisable == 2 }"
          :disabled="settingDisable == 1 || disabled1"
          :title="hasSelectedStores && settingDisable == 2 ? undefined : '매장 선택'"
          @click="showStoreList">
          <span class="psp-store-trigger__text">{{ selectedStoreList }}</span>
          <svg
            class="psp-store-trigger__chev"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true">
            <path
              d="M5 7.5L10 12.5L15 7.5"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </button>
        <div
          v-if="hasSelectedStores && !showStore && settingDisable == 2"
          class="psp-store-hover-list"
          role="tooltip">
          <div class="psp-store-hover-list__frame">
            <div class="psp-store-hover-list__body">
              <div class="psp-store-hover-list__head">
                선택 {{ selectedStores.length }}개 매장
              </div>
              <div
                v-for="(name, idx) in hoverStoreNames"
                :key="`sc-${idx}-${name}`"
                class="psp-store-hover-list__row">
                {{ name }}
              </div>
              <div
                v-if="hoverStoreMoreCount > 0"
                class="psp-store-hover-list__row psp-store-hover-list__row--more">
                ... 외 {{ hoverStoreMoreCount }}개 매장
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, toRef, watch } from "vue";
import { useStore } from "vuex";
import Realgrid from "./realgrid.vue";

const store = useStore();
const teamscList = ref("전체");
const selectedStoreList = ref("전체");
const storeGroup = ref([]);
const storeType = ref([]);
const storeTeam = ref([]);
const settingDisable = ref(1);
const storeSuperVisor = ref([]);
const selectedStoreGroup = ref(
  store.state.storeGroup?.[0]?.lngStoreGroup || null
);
const selectedStoreGroup2 = ref(
  store.state.storeGroup?.[0]?.lngStoreGroup || null
);
const selectedStoreType = ref(0);
const selectedStoreTeam = ref(0);
const selectedSuperVisor = ref(0);
const disabled1 = ref(false);
const emit = defineEmits([
  "lngStoreGroups",
  "lngStoreCodes",
  "lngStoreAttrs",
  "lngStoreGroup",
  "excelStore",
  "lngStoreAttr",
  "lngStoreTeam",
  "lngSupervisor",
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
  /** true: 고정 830px 대신 부모 폭에 맞춤 (화면별 opt-in) */
  fluidWidth: {
    type: Boolean,
    default: false,
  },
});
const searchWord = ref("");
const rowData = ref([]);
const labelingColumns = ref(
  "lngStoreGroup,lngStoreAttr,lngTeamCode,lngSupervisor"
);
const valuesData = ref([]);
const labelsData = ref([]);
const initCheck = ref(false);

watch(
  () => store.state.storeCd,
  () => {
    // storeGroup.value = store.state.storeGroup;
    // storeType.value = store.state.storeType;
    // storeTeam.value = store.state.storeTeamCode;
    // storeSuperVisor.value = store.state.storeSupervisor;
    // rowData.value = store.state.storeCd;
    // if (
    //   store.state.userData.blnBrandAdmin == "True" ||
    //   store.state.userData.lngPositionType == "1"
    // ) {
    //   disabled1.value = false;
    //   emit("lngStoreGroup", store.state.storeGroup[0].lngStoreGroup);
    //   emit(
    //     "lngStoreCodes",
    //     store.state.storeCd.map((item) => item.lngStoreCode).join(",")
    //   );
    //   //comsole.log(store.state.storeCd);
    //   emit("lngStoreAttrs", 0);
    //   emit("lngSupervisor", 0);
    //   emit("lngStoreTeam", 0);
    //   emit("excelStore", "매장명 : 전체");
    // } else {
    //   disabled1.value = true;
    //   emit("lngStoreGroup", store.state.userData.lngStoreGroup);
    //   emit("lngStoreCodes", store.state.userData.lngPosition);
    //   emit("lngStoreAttrs", store.state.userData.lngJoinType);
    //   emit("lngSupervisor", store.state.userData.lngSupervisor);
    //   emit("lngStoreTeam", store.state.userData.lngTeamCode);
    //   emit("excelStore", "매장명 : " + store.state.userData.strStoreName);
    //   selectedStoreType.value = store.state.userData.lngJoinType;
    //   selectedStoreList.value = store.state.userData.strStoreName;
    //   selectedStoreTeam.value = store.state.userData.lngTeamCode;
    //   selectedSuperVisor.value = store.state.userData.lngSupervisor;
    // }
    // labelsData.value.push(store.state.storeGroup.map((item) => item.strName));
    // valuesData.value.push(
    //   store.state.storeGroup.map((item) => item.lngStoreGroup)
    // );
    // labelsData.value.push(store.state.storeType.map((item) => item.strName));
    // valuesData.value.push(store.state.storeType.map((item) => item.lngStoreAttr));
    // labelsData.value.push(
    //   store.state.storeTeamCode.map((item) => item.strTeamName)
    // );
    // valuesData.value.push(
    //   store.state.storeTeamCode.map((item) => item.lngTeamCode)
    // );
    // labelsData.value.push(
    //   store.state.storeSupervisor.map((item) => item.strName)
    // );
    // valuesData.value.push(
    //   store.state.storeSupervisor.map((item) => item.lngSupervisor)
    // );
    // initCheck.value = !initCheck.value;
  }
);
onMounted(() => {
  storeGroup.value = store.state.storeGroup;
  storeType.value = store.state.storeType;
  //comsole.log(store.state.storeType);
  storeTeam.value = store.state.storeTeamCode;
  storeSuperVisor.value = store.state.storeSupervisor;
  rowData.value = store.state.storeCd;

  if (
    store.state.userData.blnBrandAdmin == "True" ||
    store.state.userData.lngPositionType == "1"
  ) {
    disabled1.value = false;
    emit("lngStoreGroup", store.state.storeGroup[0].lngStoreGroup);

    emit(
      "lngStoreCodes",
      store.state.storeCd.map((item) => item.lngStoreCode).join(",")
    );
    //comsole.log(store.state.storeCd);

    emit("lngStoreAttrs", 0);
    emit("lngSupervisor", 0);
    emit("lngStoreTeam", 0);
    emit("excelStore", "매장명 : 전체");
  } else {
    disabled1.value = true;
    emit("lngStoreGroup", store.state.userData.lngStoreGroup);
    emit("lngStoreCodes", store.state.userData.lngPosition);
    emit("lngStoreAttrs", store.state.userData.lngJoinType);
    emit("lngSupervisor", store.state.userData.lngSupervisor);
    emit("lngStoreTeam", store.state.userData.lngTeamCode);
    emit("excelStore", "매장명 : " + store.state.userData.strStoreName);
    selectedStoreType.value = store.state.userData.lngJoinType;
    selectedStoreList.value = store.state.userData.strStoreName;
    selectedStoreTeam.value = store.state.userData.lngTeamCode;
    selectedSuperVisor.value = store.state.userData.lngSupervisor;
  }

  labelsData.value.push(store.state.storeGroup.map((item) => item.strName));
  valuesData.value.push(
    store.state.storeGroup.map((item) => item.lngStoreGroup)
  );

  labelsData.value.push(store.state.storeType.map((item) => item.strName));
  valuesData.value.push(store.state.storeType.map((item) => item.lngStoreAttr));

  labelsData.value.push(
    store.state.storeTeamCode.map((item) => item.strTeamName)
  );
  valuesData.value.push(
    store.state.storeTeamCode.map((item) => item.lngTeamCode)
  );

  labelsData.value.push(
    store.state.storeSupervisor.map((item) => item.strName)
  );
  valuesData.value.push(
    store.state.storeSupervisor.map((item) => item.lngSupervisor)
  );
  initCheck.value = !initCheck.value;
});

watch(selectedStoreType, (newValue) => {
  // if(selectedStoreType.value == 0){
  //     rowData.value = store.state.storeCd
  //     emit('lngStoreCodes' ,store.state.storeCd.map(item => item.lngStoreCode).join(','))
  // } else {
  //     rowData.value = store.state.storeCd.filter(item => item.lngStoreAttr == selectedStoreType.value)
  //     //sendStoreCodes.value = rowData.value.filter(item => item.checkbox == true).map(item => item.lngStoreCode)
  //     emit('lngStoreCodes' ,store.state.storeCd.filter(item => item.lngStoreAttr == selectedStoreType.value).map(item => item.lngStoreCode).join(','))
  // }
  // emit('lngStoreAttr',selectedStoreType.value)
  // emit('lngStoreAttrs',selectedStoreType.value)
  // emit('excelStore' ,'매장명 : 전체')
  // initCheck.value = !initCheck.value
  // selectedStoreList.value = '전체'
});

const selectstoreType = (e) => {
  if (selectedStoreType.value == 0) {
    rowData.value = store.state.storeCd;
    emit(
      "lngStoreCodes",
      store.state.storeCd.map((item) => item.lngStoreCode).join(",")
    );
  } else {
    rowData.value = store.state.storeCd.filter(
      (item) => item.lngStoreAttr == selectedStoreType.value
    );
    //sendStoreCodes.value = rowData.value.filter(item => item.checkbox == true).map(item => item.lngStoreCode)
    emit(
      "lngStoreCodes",
      store.state.storeCd
        .filter((item) => item.lngStoreAttr == selectedStoreType.value)
        .map((item) => item.lngStoreCode)
        .join(",")
    );
  }

  emit("lngStoreAttr", selectedStoreType.value);
  emit("lngStoreAttrs", selectedStoreType.value);
  emit("excelStore", "매장명 : 전체");
  initCheck.value = !initCheck.value;
  selectedStoreList.value = "전체";
};
const selectstoreteam = (e) => {
  if (selectedStoreTeam.value == 0) {
    rowData.value = store.state.storeCd;
    storeSuperVisor.value = store.state.storeSupervisor;
    emit(
      "lngStoreCodes",
      store.state.storeCd.map((item) => item.lngStoreCode).join(",")
    );
  } else {
    rowData.value = store.state.storeCd.filter(
      (item) => item.lngTeamCode == selectedStoreTeam.value
    );
    storeSuperVisor.value = store.state.storeSupervisor.filter(
      (item) => item.lngTeamCode == selectedStoreTeam.value
    );
    emit(
      "lngStoreCodes",
      store.state.storeCd
        .filter((item) => item.lngTeamCode == selectedStoreTeam.value)
        .map((item) => item.lngStoreCode)
        .join(",")
    );
  }
  selectedSuperVisor.value = 0;

  initCheck.value = !initCheck.value;
  emit("lngStoreTeam", selectedStoreTeam.value);
  emit("excelStore", "매장명 : 전체");
  selectedStoreList.value = "전체";
};
watch(selectedStoreTeam, (newValue) => {});
const selectsupervisor = (e) => {
  if (selectedSuperVisor.value == 0) {
    if (selectedStoreTeam.value == 0) {
      rowData.value = store.state.storeCd;
      emit(
        "lngStoreCodes",
        store.state.storeCd.map((item) => item.lngStoreCode).join(",")
      );
    } else {
      rowData.value = store.state.storeCd.filter(
        (item) => item.lngTeamCode == selectedStoreTeam.value
      );
      emit(
        "lngStoreCodes",
        store.state.storeCd
          .filter((item) => item.lngTeamCode == selectedStoreTeam.value)
          .map((item) => item.lngStoreCode)
          .join(",")
      );
    }
  } else {
    if (selectedStoreTeam.value == 0) {
      rowData.value = store.state.storeCd.filter(
        (item) => item.lngSupervisor == selectedSuperVisor.value
      );
      emit(
        "lngStoreCodes",
        store.state.storeCd
          .filter((item) => item.lngSupervisor == selectedSuperVisor.value)
          .map((item) => item.lngStoreCode)
          .join(",")
      );
    } else {
      rowData.value = store.state.storeCd
        .filter((item) => item.lngTeamCode == selectedStoreTeam.value)
        .filter((item) => item.lngSupervisor == selectedSuperVisor.value);
      emit(
        "lngStoreCodes",
        store.state.storeCd
          .filter((item) => item.lngTeamCode == selectedStoreTeam.value)
          .filter((item) => item.lngSupervisor == selectedSuperVisor.value)
          .map((item) => item.lngStoreCode)
          .join(",")
      );
    }
  }
  initCheck.value = !initCheck.value;
  const sendSupervisor = selectedSuperVisor.value;
  emit("lngSupervisor", sendSupervisor);
  emit("excelStore", "매장명 : 전체");
  selectedStoreList.value = "전체";
};
watch(selectedSuperVisor, (newValue) => {});

watch(settingDisable, () => {
  if (settingDisable.value == 1) {
    selectedSuperVisor.value = 0;
    selectedStoreTeam.value = 0;
  } else {
    selectedStoreType.value = 0;
  }
});

const showStore = ref(false);
const showStoreList = () => {
  searchWord.value = "";
  showStore.value = !showStore.value;
};

const sendStoreGroups = ref([]);
const sendStoreCodes = ref([]);
const sendStoreAttrs = ref([]);
const selectedStores = ref([]);
const HOVER_STORE_MAX = 15;
const hasSelectedStores = computed(
  () => Array.isArray(selectedStores.value) && selectedStores.value.length > 0
);
const hoverStoreNames = computed(() =>
  hasSelectedStores.value
    ? selectedStores.value.slice(0, HOVER_STORE_MAX)
    : []
);
const hoverStoreMoreCount = computed(() => {
  const total = selectedStores.value?.length || 0;
  return total > HOVER_STORE_MAX ? total - HOVER_STORE_MAX : 0;
});
const checkedRowData = (e) => {
  // sendStoreGroups.value = rowData.value
  //   .filter((item) => item.checkbox == true)
  //   .map((item) => item.lngStoreGroup);
  // sendStoreCodes.value = rowData.value
  //   .filter((item) => item.checkbox == true)
  //   .map((item) => item.lngStoreCode);
  // sendStoreAttrs.value = rowData.value
  //   .filter((item) => item.checkbox == true)
  //   .map((item) => item.lngStoreAttr);
  // selectedStores.value = rowData.value
  //   .filter((item) => item.checkbox == true)
  //   .map((item) => item.strName);
  // if (settingDisable.value == 1) {
  //   teamscList.value = "전체";
  //   if (selectedStores.value.length > 1) {
  //     selectedStoreList.value =
  //       selectedStores.value[0] +
  //       " 외" +
  //       (selectedStores.value.length - 1) +
  //       "건";
  //   } else if (selectedStores.value.length == 1) {
  //     selectedStoreList.value = selectedStores.value;
  //   } else {
  //     selectedStoreList.value = "전체";
  //   }
  //   emit("excelStore", "매장명 : " + selectedStoreList.value);
  // } else {
  //   selectedStoreList.value = "전체";
  //   if (selectedStores.value.length > 1) {
  //     selectedStoreList.value =
  //       selectedStores.value[0] +
  //       " 외" +
  //       (selectedStores.value.length - 1) +
  //       "건";
  //   } else if (selectedStores.value.length == 1) {
  //     selectedStoreList.value = selectedStores.value;
  //   } else {
  //     selectedStoreList.value = "전체";
  //   }
  //   emit("excelStore", "매장명 : " + selectedStoreList.value);
  // }
  // emit("lngStoreGroups", sendStoreGroups.value);
  // if (sendStoreCodes.value.length == 0) {
  //   let senditem = rowData.value.map((item) => item.lngStoreCode).join(",");
  //   emit("lngStoreCodes", senditem);
  // } else {
  //   emit("lngStoreCodes", sendStoreCodes.value.join(","));
  // }
  // emit("lngStoreAttrs", selectedStoreType.value);
  // const sendSupervisor = selectedSuperVisor.value;
  // emit("lngSupervisor", sendSupervisor);
  // emit("lngStoreTeam", selectedStoreTeam.value);
};
const searchword = (e) => {
  searchWord.value = e.target.value;
};

const updatedRowData = (e) => {
  console.log(e);
  const storecodes = e.map((item) => item.lngStoreCode);
  const checkeds = e.map((item) => item.checkbox);
  for (var i = 0; i < storecodes.length; i++) {
    const change = rowData.value.find(
      (item) => item.lngStoreCode == storecodes[i]
    );
    if (change) {
      change.checkbox = checkeds[i];
    }
  }

  // 필터/화면에 안 보이는 행 포함 — 전체 rowData에서 체크된 매장 수집
  const checkedRowData = rowData.value.filter((item) => item.checkbox == true);

  sendStoreGroups.value = checkedRowData.map((item) => item.lngStoreGroup);
  sendStoreCodes.value = checkedRowData.map((item) => item.lngStoreCode);
  sendStoreAttrs.value = checkedRowData.map((item) => item.lngStoreAttr);
  selectedStores.value = checkedRowData.map((item) => item.strName);
  if (settingDisable.value == 1) {
    teamscList.value = "전체";
    if (selectedStores.value.length > 1) {
      selectedStoreList.value =
        selectedStores.value[0] +
        " 외" +
        (selectedStores.value.length - 1) +
        "건";
    } else if (selectedStores.value.length == 1) {
      selectedStoreList.value = selectedStores.value;
    } else {
      selectedStoreList.value = "전체";
    }
    emit("excelStore", "매장명 : " + selectedStoreList.value);
  } else {
    selectedStoreList.value = "전체";
    if (selectedStores.value.length > 1) {
      selectedStoreList.value =
        selectedStores.value[0] +
        " 외" +
        (selectedStores.value.length - 1) +
        "건";
    } else if (selectedStores.value.length == 1) {
      selectedStoreList.value = selectedStores.value;
    } else {
      selectedStoreList.value = "전체";
    }
    emit("excelStore", "매장명 : " + selectedStoreList.value);
  }
  emit("lngStoreGroups", sendStoreGroups.value);
  if (sendStoreCodes.value.length == 0) {
    // 체크된 것이 없을 때는 초기값과 동일하게 전체 매장 코드를 emit
    if (
      store.state.userData.blnBrandAdmin == "True" ||
      store.state.userData.lngPositionType == "1"
    ) {
      emit(
        "lngStoreCodes",
        store.state.storeCd.map((item) => item.lngStoreCode).join(",")
      );
    } else {
      emit("lngStoreCodes", store.state.userData.lngPosition);
    }
  } else {
    emit("lngStoreCodes", sendStoreCodes.value.join(","));
  }

  emit("lngStoreAttrs", selectedStoreType.value);
  const sendSupervisor = selectedSuperVisor.value;
  emit("lngSupervisor", sendSupervisor);
  emit("lngStoreTeam", selectedStoreTeam.value);
};
const initCheckBoxRef = toRef(props, "initCheckBox");
const initSearchWord = toRef(props, "initCheckBox");
watch(initCheckBoxRef, () => {
  rowData.value.forEach((item) => (item.checkbox = false));
  rowData.value = [...rowData.value];
});

watch(initCheck, () => {
  rowData.value.forEach((item) => (item.checkbox = false));
  rowData.value = [...rowData.value];
});
watch(initSearchWord, () => {
  searchWord.value = "";
});

const resetChecked = () => {
  rowData.value.forEach((item) => (item.checkbox = false));
  rowData.value = [...rowData.value];
  searchWord.value = "";
  emit("lngStoreGroup", store.state.storeGroup[0].lngStoreGroup);
  // 초기값과 동일하게 전체 매장 코드를 emit
  if (
    store.state.userData.blnBrandAdmin == "True" ||
    store.state.userData.lngPositionType == "1"
  ) {
    emit(
      "lngStoreCodes",
      store.state.storeCd.map((item) => item.lngStoreCode).join(",")
    );
  } else {
    emit("lngStoreCodes", store.state.userData.lngPosition);
  }
  emit("lngStoreAttrs", 0);
  emit("lngSupervisor", 0);
  emit("lngStoreTeam", 0);
  selectedStores.value = [];
  selectedStoreList.value = "전체";
};
const showOnlycheck = ref(false);
const showOnlyChecked = () => {
  showOnlycheck.value = !showOnlycheck.value;
};
</script>

<style scoped>
.psp-root {
  display: grid;
  grid-template-columns: 3.75rem minmax(4.75rem, auto) minmax(0, 1.15fr) minmax(0, 1.05fr) minmax(8.5rem, 0.95fr);
  grid-template-rows: auto auto;
  column-gap: 0.4rem;
  row-gap: 0.35rem;
  align-items: center;
  box-sizing: border-box;
}

.psp-root--fixed {
  width: 830px;
  height: 4rem;
  margin-top: 0.5rem;
}

.psp-root--fluid {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  margin-top: 0;
  min-height: 4rem;
}

.psp-label {
  grid-row: span 2;
  padding-inline-start: 0.25rem;
}

.psp-cell {
  min-width: 0;
}

.psp-select {
  box-sizing: border-box;
  width: 100%;
  height: 1.75rem;
  min-width: 0;
  border: 1px solid #cbd5e1;
  background: #fff;
  font-size: 0.875rem;
  color: #111827;
}

.psp-team-pair {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  column-gap: 0.35rem;
  min-width: 0;
}

.psp-store-pick {
  position: relative;
  min-width: 0;
  width: 100%;
  overflow: visible;
}

.psp-store-trigger-wrap {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  width: 100%;
  min-width: 0;
}

.psp-store-trigger {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.35rem;
  width: 100%;
  min-width: 0;
  height: 1.75rem;
  padding: 0 0.5rem 0 0.625rem;
  border: 1px solid #94a3b8;
  border-radius: 0.375rem;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  color: #0f172a;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.2;
  text-align: left;
  cursor: pointer;
  box-shadow: 0 1px 2px rgb(15 23 42 / 0.06);
  transition:
    border-color 0.15s ease,
    background-color 0.15s ease,
    box-shadow 0.15s ease,
    color 0.15s ease;
}

.psp-store-trigger--wide {
  width: 100%;
  margin-left: 0;
}

.psp-store-trigger__text {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.psp-store-trigger__chev {
  width: 0.875rem;
  height: 0.875rem;
  flex-shrink: 0;
  color: #64748b;
  transition: transform 0.15s ease, color 0.15s ease;
}

.psp-store-trigger:hover:not(:disabled) {
  border-color: #60a5fa;
  background: #eff6ff;
  color: #1d4ed8;
}

.psp-store-trigger:hover:not(:disabled) .psp-store-trigger__chev {
  color: #2563eb;
}

.psp-store-trigger.is-open {
  border-color: #3b82f6;
  background: #dbeafe;
  color: #1e40af;
  box-shadow: 0 0 0 3px rgb(59 130 246 / 0.15);
}

.psp-store-trigger.is-open .psp-store-trigger__chev {
  color: #1d4ed8;
  transform: rotate(180deg);
}

.psp-store-trigger:disabled {
  cursor: not-allowed;
  background: #f3f4f6;
  border-color: #d1d5db;
  color: #9ca3af;
  box-shadow: none;
}

/* 선택 매장 호버 말풍선 */
@property --psp-bubble-angle {
  syntax: "<angle>";
  inherits: false;
  initial-value: 0deg;
}

.psp-store-hover-list {
  display: none;
  position: absolute;
  top: calc(100% + 0.65rem);
  right: 0;
  z-index: 45;
  box-sizing: border-box;
  min-width: max(100%, 14rem);
  max-width: min(24rem, 90vw);
  padding: 0;
  border: none;
  background: transparent;
  box-shadow: none;
  overflow: visible;
  pointer-events: auto;
  animation: psp-bubble-in 0.16s ease-out;
}

.psp-store-trigger-wrap:hover .psp-store-hover-list {
  display: block;
}

/* 움직이는 테두리 프레임 */
.psp-store-hover-list__frame {
  position: relative;
  box-sizing: border-box;
  padding: 2px;
  border-radius: 0.8rem;
  background: conic-gradient(
    from var(--psp-bubble-angle),
    #1d4ed8 0deg,
    #60a5fa 55deg,
    #dbeafe 95deg,
    transparent 130deg,
    transparent 230deg,
    #93c5fd 280deg,
    #1d4ed8 360deg
  );
  box-shadow:
    0 12px 28px rgb(37 99 235 / 0.14),
    0 2px 8px rgb(15 23 42 / 0.08);
  animation: psp-bubble-border-spin 1.8s linear infinite;
}

.psp-store-hover-list__body {
  position: relative;
  z-index: 1;
  max-height: none;
  overflow: visible;
  padding: 0.25rem 0 0.4rem;
  border-radius: 0.7rem;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
}

.psp-store-hover-list__head {
  padding: 0.35rem 0.85rem 0.45rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: #1d4ed8;
  border-bottom: 1px solid #dbeafe;
}

/* 말풍선 꼬리 */
.psp-store-hover-list::before,
.psp-store-hover-list::after {
  content: "";
  position: absolute;
  right: 1.35rem;
  width: 0.7rem;
  height: 0.7rem;
  transform: rotate(45deg);
}

.psp-store-hover-list::before {
  top: -0.28rem;
  background: #60a5fa;
  z-index: 0;
  animation: psp-bubble-tail-pulse 1.8s ease-in-out infinite;
}

.psp-store-hover-list::after {
  top: -0.2rem;
  background: #ffffff;
  z-index: 1;
}

.psp-store-hover-list__row {
  box-sizing: border-box;
  padding: 0.4rem 0.85rem;
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1.35;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-bottom: 1px solid #eef2ff;
}

.psp-store-hover-list__row:last-child {
  border-bottom: none;
}

.psp-store-hover-list__row--more {
  color: #dc2626;
  font-weight: 700;
  text-align: right;
}

@keyframes psp-bubble-in {
  from {
    opacity: 0;
    transform: translateY(-4px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes psp-bubble-border-spin {
  to {
    --psp-bubble-angle: 360deg;
  }
}

@keyframes psp-bubble-tail-pulse {
  0%,
  100% {
    background: #60a5fa;
  }
  50% {
    background: #2563eb;
  }
}

.psp-collapse-btn {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  flex-shrink: 0;
  padding: 0;
  border: 1px solid #93c5fd;
  border-radius: 0.375rem;
  background: #eff6ff;
  color: #1d4ed8;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease;
}

.psp-collapse-btn svg {
  width: 0.95rem;
  height: 0.95rem;
}

.psp-collapse-btn:hover {
  background: #dbeafe;
  border-color: #60a5fa;
}

/* 매장명 검색 + 그리드 통합 팝업 */
.psp-popup {
  top: calc(100% + 0.35rem);
  right: 0;
  z-index: 30;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: min(42rem, 92vw);
  min-width: 28rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.625rem;
  background: #fff;
  box-shadow:
    0 10px 28px rgb(15 23 42 / 0.14),
    0 2px 6px rgb(15 23 42 / 0.06);
  overflow: hidden;
}

.psp-filter-bar {
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  width: 100%;
  min-height: 2.75rem;
  padding: 0.55rem 0.75rem;
  border: none;
  border-bottom: 1px solid #e2e8f0;
  border-radius: 0;
  background: #f8fafc;
  box-shadow: none;
}

.psp-filter-label {
  flex-shrink: 0;
  font-size: 0.875rem;
  font-weight: 700;
  color: #0f172a;
  white-space: nowrap;
}

.psp-filter-input {
  box-sizing: border-box;
  flex: 1 1 auto;
  min-width: 8rem;
  height: 2rem;
  min-height: 2rem;
  padding: 0 0.75rem;
  border: 1.5px solid #64748b;
  border-radius: 0.375rem;
  background: #fff;
  color: #0f172a;
  font-size: 0.875rem;
  font-weight: 500;
}

.psp-filter-input::placeholder {
  color: #94a3b8;
  font-weight: 400;
}

.psp-filter-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgb(59 130 246 / 0.18);
}

.psp-popup-body {
  position: relative;
  width: 100%;
  height: min(18rem, 42vh);
  min-height: 14rem;
  background: #fff;
}

.psp-store-grid {
  position: absolute !important;
  inset: 0;
  width: 100% !important;
  height: 100% !important;
  z-index: 1;
}

.psp-sub-btn {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  height: 2rem;
  min-height: 2rem;
  min-width: 5.5rem;
  padding: 0 0.75rem;
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1.2;
  white-space: nowrap;
  color: rgb(30 64 175);
  border: 1px solid rgb(147 197 253);
  border-radius: 0.375rem;
  background-color: rgb(239 246 255);
  box-shadow: 0 1px 2px 0 rgb(59 130 246 / 0.08);
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease;
}

.psp-sub-btn:hover {
  background-color: rgb(219 234 254);
  border-color: rgb(96 165 250);
}
</style>
