<template>
  <div class="flex justify-end text-sm">
    <div class="flex items-center font-bold text-sm ml-12">매장그룹</div>
    <div>
      <select
        :disabled="isDisabled1"
        id="storeGroup"
        v-model="selectedGroup"
        class="border border-gray-800 rounded-md p-2 ml-5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        @change="emitStoreGroup($event.target.value)">
        <option value="0">선택</option>
        <option
          :value="item.lngStoreGroup"
          v-for="item in storeGroup"
          :key="item.lngStoreGroup">
          {{ item.strName }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { defineProps, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
const storeGroup = ref([]);
const storeType = ref([]);
const storeCd = ref([]);
const storeCd2 = ref([]);
const storeNm = ref("");
const isDisabled1 = ref(false);
const isDisabled2 = ref(false);
const isDisabled3 = ref(false);
const selectedGroup = ref(0);
let store = useStore();
const userData = store.state.userData;

const props = defineProps({
  groupCdDisabled: Boolean,
  initGroup: {
    type: Boolean,
    String: false,
  },
});
const { groupCdDisabled } = props;
isDisabled1.value = groupCdDisabled;
const emit = defineEmits(["update:storeGroup", "GroupNm"]);
const emitStoreGroup = (value) => {
  emit("update:storeGroup", value);
};

onMounted(() => {
  store = useStore();

  storeGroup.value = store.state.storeGroup;
  storeType.value = store.state.storeType;
  storeCd.value = store.state.storeCd;
  storeCd2.value = store.state.storeCd;
  ////console.log(store.state.userData);

  if (props.initGroup == true) {
    emit("update:storeGroup", store.state.userData.lngStoreGroup);
    selectedGroup.value = store.state.userData.lngStoreGroup;
    isDisabled1.value = true;

    let groupObj = storeGroup.value.find(
      (item) => item.lngStoreGroup == selectedGroup.value
    );
    let groupnm = groupObj ? groupObj.strName : "선택";

    emit("GroupNm", groupnm);
  } else {
    emit("update:storeGroup", 0);
    selectedGroup.value = 0;
    isDisabled1.value = false;

    let groupObj = storeGroup.value.find(
      (item) => item.lngStoreGroup == selectedGroup.value
    );
    let groupnm = groupObj ? groupObj.strName : "선택";
    emit("GroupNm", groupnm);
  }
  // if (
  //   store.state.userData.blnBrandAdmin == "True" ||
  //   store.state.userData.lngPositionType == "1"
  // ) {
  //   isDisabled1.value = false;
  // } else {
  //   isDisabled1.value = true;
  // }

  // storeGroup.value = store.state.storeGroup;
  // if(storeGroup.value[0] !=undefined){
  //   emit('update:storeGroup', storeGroup.value[0].lngStoreGroup);
  // }
  // emit("update:storeGroup", 0);
});

watch(selectedGroup, () => {
  emit("update:storeGroup", selectedGroup.value);
  let groupnm =
    storeGroup.value.filter(
      (item) => item.lngStoreGroup == selectedGroup.value
    )[0]?.strName || "선택";
  emit("GroupNm", groupnm);
});
</script>
