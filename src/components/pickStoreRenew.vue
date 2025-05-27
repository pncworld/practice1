<template>
  <div
    class="grid grid-rows-1 grid-cols-[repeat(4,1fr)] justify-center text-sm items-center w-[500px] space-x-2">
    <div class="items-center font-bold text-base flex w-20 pl-5">매장명 :</div>
    <div v-if="hideit">
      <select
        :disabled="true"
        v-model="selectedGroup"
        id="storeGroup"
        class="border border-gray-800 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        @change="emitStoreGroup($event.target.value)">
        <option
          :value="item.lngStoreGroup"
          v-for="item in storeGroup"
          :key="item.lngStoreGroup">
          {{ item.strName }}
        </option>
      </select>
    </div>
    <div v-if="hideit2">
      <select
        :disabled="disabled1"
        v-model="selectedStoreType"
        class="border border-gray-800 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        @change="initGrid">
        <option value="0">전체</option>
        <option
          :value="item.lngStoreAttr"
          v-for="item in storeType"
          :key="item.lngStoreAttr">
          {{ item.strName }}
        </option>
      </select>
    </div>
    <div>
      <v-select
        v-model="selectedStore"
        :options="storeCd"
        :disabled="disabled1"
        label="strName"
        :placeholder="defaultPlaceHolder"
        class="!w-72 !h-7 -mt-3 custom-select"
        :clearable="!disabled1"
        @click="resetSelectedStore" />
    </div>
  </div>
</template>

<script setup>
import { defineProps, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

const store = useStore();
const storeGroup = ref([]);
const storeType = ref([]);
const storeCd = ref([]);
const storeCd2 = ref([]);
const isDisabled1 = ref(false);
const isDisabled2 = ref(false);
const disabled1 = ref(false);
const selectedGroup = ref();
const selectedStore = ref(null);

const userData = store.state.userData;

const props = defineProps({
  groupCdDisabled: Boolean,
  hidesub: {
    type: Boolean,
    default: true,
  },
  placeholderName: {
    type: String,
    default: "전체",
  },
  hideit: {
    type: Boolean,
    default: true,
  },
  hideit2: {
    type: Boolean,
    default: true,
  },
  disableStore: {
    type: Boolean,
    default: false,
  },
});

const hideit = ref(props.hideit);
const hideit2 = ref(props.hideit2);
const is9999 = ref(store.state.userData.lngStoreGroup[0] !== "9999");
//const hideit = ref(props.hidesub);
const defaultPlaceHolder = ref(props.placeholderName);
const selectedStoreType = ref(0);
// watch(
//   () => props.hidesub,
//   () => {
//     hideit.value = props.hidesub;
//   }
// );
const { groupCdDisabled } = props;
isDisabled1.value = groupCdDisabled;
const changed = ref(false);
const ischanged = () => {
  changed.value = !changed.value;

  //comsole.log(changed.value);
  emit("update:ischanged", changed.value);
};
const emit = defineEmits([
  "update:storeGroup",
  "update:storeType",
  "update:storeCd",
  "update:ischanged",
  "storeNm",
  "excelStore",
  "lngStoreCode",
  "lngStoreGroup",
  "lngStoreAttrs",
  "changeInit",
]);
const emitStoreGroup = (value) => {
  emit("update:storeGroup", value);
  emit("lngStoreGroup", value);
  emit("changeInit", true);
};

const emitStoreType = (value) => {
  emit("update:storeType", value);
};

// watch(() => store.state.storeCd , () => {

// })

watch(
  () => props.disableStore,
  () => {
    disabled1.value = props.disableStore;
  }
);
onMounted(() => {
  defaultPlaceHolder.value = props.placeholderName;
  selectedGroup.value = store.state.storeGroup[0].lngStoreGroup;
  console.log(storeCd.value);
  if (
    store.state.userData.blnBrandAdmin == "True" ||
    store.state.userData.lngPositionType == "1"
  ) {
    disabled1.value = false;
    emit("update:storeGroup", selectedGroup.value);
    emit("lngStoreGroup", selectedGroup.value);
    emit("update:storeCd", 0);
    emit("lngStoreAttrs", 0);
    emit("lngStoreCode", 0);
    emit("excelStore", "매장명 : 전체");
  } else {
    disabled1.value = true;
    emit("lngStoreGroup", store.state.userData.lngStoreGroup);
    emit("lngStoreCodes", store.state.userData.lngPosition);
    emit("lngStoreCode", store.state.userData.lngPosition);
    emit("lngStoreAttrs", store.state.userData.lngJoinType);
    emit("excelStore", "매장명 : " + store.state.userData.strStoreName);
    selectedStoreType.value = store.state.userData.lngJoinType;
    selectedStore.value = store.state.storeCd[0];
    //comsole.log(store.state.storeCd);
  }
});
// const emitStoreCode = (e) => {
//   //comsole.log(e)
//   const selectedCd = e.target.value
//   if( value !='0' && value != undefined){
//     const selectedNm = storeCd.value.filter(item => item.lngStoreCode == value)[0].strName

//     emit('storeNm' ,selectedNm )
//     emit('update:storeCd', value);
//   } else {
//     emit('update:storeCd', value);
//   }
// };
const initGrid = (e) => {
  emit("changeInit", true);
};
watch(selectedStoreType, () => {
  if (selectedStoreType.value == 0) {
    storeCd.value = store.state.storeCd;
  } else {
    storeCd.value = store.state.storeCd.filter(
      (item) => item.lngStoreAttr == selectedStoreType.value
    );
  }
  if (
    store.state.userData.blnBrandAdmin == "True" ||
    store.state.userData.lngPositionType == "1"
  ) {
    selectedStore.value = null;
  }

  emit("lngStoreAttrs", selectedStoreType.value);
  emit("changeInit", true);
});
watch(selectedStore, () => {
  if (selectedStore.value == null) {
    emit("update:storeGroup", selectedGroup.value);
    emit("update:storeCd", 0);
    emit("lngStoreGroup", selectedGroup.value);
    emit("lngStoreCode", 0);
    emit("excelStore", "매장명 : 전체");
  } else {
    emit("update:storeGroup", selectedGroup.value);
    emit("update:storeCd", selectedStore.value.lngStoreCode);
    emit("lngStoreGroup", selectedGroup.value);
    emit("lngStoreCode", selectedStore.value.lngStoreCode);
    const name = store.state.storeCd.filter(
      (item) => item.lngStoreCode == selectedStore.value.lngStoreCode
    )[0].strName;
    emit("excelStore", "매장명 : " + name);
  }
  //comsole.log(selectedStore.value);
  emit("changeInit", true);
});

storeGroup.value = store.state.storeGroup;
storeType.value = store.state.storeType;
storeCd.value = store.state.storeCd;
storeCd2.value = store.state.storeCd;

const setStore = (value) => {
  //comsole.log(value);
  if (value == 0) {
    storeCd.value = storeCd2.value;
    return storeCd.value;
  }
  storeCd.value = storeCd2.value.filter((item) => {
    return item.lngStoreAttr == value;
  });
  selectedStore.value = 0;
};

const route = useRoute();

watch(
  () => route.path,
  (newPath) => {
    if (storeGroup.value.length > 0) {
      selectedGroup.value = storeGroup.value[0].lngStoreGroup;
      emit("update:storeGroup", storeGroup.value[0].lngStoreGroup);
      emit("lngStoreGroup", storeGroup.value[0].lngStoreGroup);

      //comsole.log(storeGroup.value[0].lngStoreGroup);
    }
  }
);

const resetSelectedStore = (e) => {
  if (
    store.state.userData.blnBrandAdmin == "True" ||
    store.state.userData.lngPositionType == "1"
  ) {
    selectedStore.value = null;
  }
};
</script>

<style>
.custom-select .vs__dropdown-toggle {
  border: 1px solid #d1d5db !important; /* 전체 테두리 */
  border-radius: 0.375rem !important; /* Tailwind rounded-md */
  background-color: #ffffff !important; /* 흰색 배경 */
  display: flex;
  align-items: center; /* 텍스트 중앙 정렬 */
  height: 40px !important; /* 높이 조정 */
  padding: 6px 12px !important; /* 내부 간격 */
}

/* 선택된 값 및 플레이스홀더 스타일 */
.custom-select .vs__selected {
  font-size: 14px !important;
  color: #374151 !important; /* Tailwind text-gray-700 */
  display: flex;
  justify-content: left !important;
  align-items: center;
  height: 100% !important;

  min-width: 110% !important;
  padding-top: 25px !important; /* 텍스트를 좀 더 아래로 이동 */

  overflow: hidden !important;
}
.custom-select.vs--disabled .vs__selected {
  font-size: 14px !important;
  color: #374151 !important; /* Tailwind text-gray-700 */
  display: flex;
  justify-content: left !important;
  align-items: center;
  height: 100% !important;

  min-width: 110% !important;
  margin-top: -10px !important; /* 텍스트를 좀 더 아래로 이동 */

  overflow: hidden !important;
}

/* 플레이스홀더 및 입력 필드 조정 */
.custom-select .vs__search {
  height: 100%;
  padding: 1px 0 !important; /* 입력 필드가 너무 위쪽에 올라가지 않도록 조정 */
  margin: 0 !important;
}
.custom-select.vs--disabled .vs__search {
  height: 100%;
  padding: 1px 0 !important; /* 입력 필드가 너무 위쪽에 올라가지 않도록 조정 */
  margin: 0 !important;
  display: none;
}

/* 드롭다운 리스트 스타일 */
.custom-select .vs__dropdown-menu {
  z-index: 1000 !important; /* 다른 요소보다 위에 표시 */
  background: white;
  border-radius: 0.375rem;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 14px !important;
  padding-top: 1px !important;
}

/* 포커스 상태 스타일 */
.custom-select .vs__dropdown-toggle:focus {
  border: 2px solid #3b82f6 !important; /* Tailwind focus:ring-blue-500 */
  outline: none !important;
}

.vs--disabled .vs__dropdown-toggle {
  background-color: #d1d5db !important;
  color: white !important; /* 텍스트 색상도 변경 */
  border-color: #d1d5db !important;
}
</style>
