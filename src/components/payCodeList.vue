<template>
  <div class="flex justify-center items-center space-x-3">
    <div class="text-base font-semibold">지불코드 :</div>
    <!-- <select name="" id="" class="font-thin w-44 h-10 rounded-lg border ml-1 pl-1 " @change="changePayCd" v-model="selectedPayCd">
        <option value="0">전체</option>
        <option :value="i.lngCode" v-for="i in payCodeList" >{{ i.strName }}</option>
     </select> -->

    <v-select
      v-model="selectedPayCd"
      :options="payCodeList"
      label="strName"
      placeholder="전체"
      class="!w-48 !h-7 -mt-3 custom-select"
      :reduce="(store) => (store != null ? store.lngCode : null)"
      clearable="true"
      @click="clickPayCd" />
  </div>
</template>

<script setup>
import { getpayCodeList } from "@/api/misales";
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
onMounted(() => {
  emit("payNm", "전체");
});
watch(
  () => props.storeCd,
  async () => {
    const res = await getpayCodeList(props.groupCd, props.storeCd);
    payCodeList.value = res.data.PAYCDLIST;
    ////console.log(res)
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
    //console.log(payCodeList.value);
    //console.log(selectedPayCd.value);
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
