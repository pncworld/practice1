<template>
  <div class="flex justify-start text-sm items-center w-[500px] ml-12 !mt-2">
    <div class="items-center font-bold text-base flex text-nowrap">
      사업장명
    </div>
    <div>
      <v-select
        v-model="selectedStore"
        :options="storeCd"
        :disabled="disabled1"
        label="strSaleCompName"
        :placeholder="defaultPlaceHolder"
        class="!w-72 !h-7 -mt-3 custom-select ml-5"
        :clearable="!disabled1"
        @click="resetSelectedStore" />
    </div>
  </div>
</template>

<script setup>
import { getCustCompany, getCustCompany2 } from "@/api/micrm";
import { defineProps, onMounted, ref, watch } from "vue";
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
    default: "선택",
  },
  setAPI: {
    type: String,
    default: "0",
  },
});
const is9999 = ref(store.state.userData.lngStoreGroup[0] !== "9999");
const hideit = ref(props.hidesub);
const defaultPlaceHolder = ref(props.placeholderName);
const selectedStoreType = ref(0);
watch(
  () => props.hidesub,
  () => {
    hideit.value = props.hidesub;
  }
);
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
  "BP_ID",
  "lngIFChk",
]);

onMounted(async () => {
  console.log(store.state.userData);

  if (props.setAPI == "0") {
    const res = await getCustCompany(
      store.state.userData.lngStoreGroup,
      store.state.userData.lngPosition,
      store.state.userData.lngPositionType
    );

    //console.log(res);

    storeCd.value = res.data.List;
    emit("excelStore", "사업장명 : 전체");
    if (selectedStore.value == null) {
      emit("lngStoreCode", 0);
    }
  } else {
    const res = await getCustCompany2(
      store.state.userData.lngStoreGroup,
      store.state.userData.lngPosition
    );

    console.log(res);

    storeCd.value = res.data.List;
    emit("excelStore", "사업장명 : 전체");
    if (selectedStore.value == null) {
      emit("lngStoreCode", 0);
      emit("BP_ID", 0);
      emit("lngIFChk", "");
    }
  }
});

watch(selectedStore, () => {
  if (selectedStore.value == null) {
    emit("lngStoreCode", 0);
    emit("excelStore", "사업장명 : 전체");
    emit("BP_ID", 0);
    emit("lngIFChk", "");
  } else {
    emit("lngStoreCode", selectedStore.value.strSaleCompCode);
    emit("BP_ID", selectedStore.value.BP_ID);
    emit("lngIFChk", selectedStore.value.lngIFChk);

    const name = storeCd.value.filter(
      (item) => item.strSaleCompCode == selectedStore.value.strSaleCompCode
    )[0].strSaleCompName;
    emit("excelStore", "사업장명 : " + name);
  }
  //comsole.log(selectedStore.value);
  emit("changeInit", true);
});

storeGroup.value = store.state.storeGroup;
storeType.value = store.state.storeType;
storeCd.value = store.state.storeCd;
storeCd2.value = store.state.storeCd;

const resetSelectedStore = (e) => {
  if (
    store.state.userData.blnBrandAdmin == "True" ||
    store.state.userData.lngPositionType == "1"
  ) {
    selectedStore.value = null;
  }
};

// document.querySelector(".vs__search").disabled = true;
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
  height: 100% !important;
  padding-top: -1px !important; /* 입력 필드가 너무 위쪽에 올라가지 않도록 조정 */
  margin-top: 0 !important;
}
.custom-select.vs--disabled .vs__search {
  height: 100%;
  padding: -5px 0 !important; /* 입력 필드가 너무 위쪽에 올라가지 않도록 조정 */
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
