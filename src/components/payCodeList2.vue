<template>
  <div class="flex justify-center items-center space-x-3 ml-12">
    <div class="text-base font-semibold text-nowrap">결제코드</div>
    <v-select
      v-model="selectedPayCd"
      :options="payCodeList"
      label="strName"
      placeholder="전체"
      class="!w-48 !h-7 mt-3 custom-select5 !pr-20"
      :reduce="(store) => (store != null ? store.lngCode : null)"
      clearable="true"
      @click="clickPayCd" />
  </div>
</template>

<script setup>
import { getpayCodeList, getpayCodeList3 } from "@/api/misales";
import store from "@/store";
import { onMounted, ref, watch } from "vue";
const props = defineProps({
  groupCd: {
    type: String,
    default: "",
  },
  storeCd: {
    type: String,
    default: "",
  },
  init: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["payCd", "payNm"]);
const payCodeList = ref([]);
const selectedPayCd = ref(null);
onMounted(async () => {
  emit("payNm", "전체");

  const res = await getpayCodeList3(store.state.userData.lngStoreGroup, 0);
  // ////console.log(res);
  payCodeList.value = res.data.List;
  ////console.log(payCodeList.value);
});
watch(
  () => props.storeCd,
  async () => {
    const res = await getpayCodeList3(props.groupCd, props.storeCd);
    payCodeList.value = res.data.List;
    ////console.log(res);
    ////comsole.log(res)
  }
);

// const changePayCd = (e) => {
//     emit('payCd' , e.target.value)
// }

watch(selectedPayCd, () => {
  emit("payCd", selectedPayCd.value);
  if (selectedPayCd.value == null) {
    emit("payNm", "전체");
  } else {
    //comsole.log(payCodeList.value);
    //comsole.log(selectedPayCd.value);
    let nm = payCodeList.value.filter(
      (item) => item.lngCode == selectedPayCd.value
    )[0].strName;
    emit("payNm", nm);
  }
});

const clickPayCd = () => {
  selectedPayCd.value = null;
};

watch(
  () => props.init,
  () => {
    selectedPayCd.value = null;
  }
);
</script>
