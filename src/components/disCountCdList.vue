div
<template>
  <div class="flex justify-start items-center space-x-5">
    <div class="text-base font-semibold">할인코드</div>
    <!-- <select name="" id="" class="font-thin w-64 h-10 rounded-lg border " @change="changeDiscount" v-model="selectedDiscountNo">
        <option value="0">전체</option>
        <option :value="i.lngCode" v-for="i in disCountList" >{{ i.strName }}</option>
     </select> -->

    <v-select
      v-model="selectedDiscountNo"
      :options="disCountList"
      label="strName"
      placeholder="전체"
      class="!w-48 !h-7 -mt-3 custom-select"
      :reduce="(store) => (store != null ? store.lngCode : null)"
      clearable="true"
      @click="clickDiscount" />
  </div>
</template>

<script setup>
import { getDiscountCdList } from "@/api/misales";
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

const emit = defineEmits(["disCountCd", "discountNm"]);
const disCountList = ref([]);
const selectedDiscountNo = ref(null);
onMounted(async () => {
  emit("discountNm", "전체");
  ////console.log(store.state);
  const res = await getDiscountCdList(store.state.userData.lngStoreGroup, 0);
  //comsole.log(res);
  disCountList.value = res.data.DISCOUNTLIST;
});
watch(
  () => props.storeCd,
  async () => {
    try {
      const res = await getDiscountCdList(props.groupCd, props.storeCd);
      //comsole.log(res);
      disCountList.value = res.data.DISCOUNTLIST;
    } catch (error) {
      //console.error("API 호출 실패:", error);
    }
  },
  { flush: "post" }
);

// const changeDiscount = (e) => {
//     //comsole.log(e)
//     emit('disCountCd' , e.target.value)
// }

watch(selectedDiscountNo, () => {
  emit("disCountCd", selectedDiscountNo.value);
  if (selectedDiscountNo.value != null) {
    let nm = disCountList.value.filter(
      (item) => item.lngCode == selectedDiscountNo.value
    );
    emit("discountNm", nm[0].strName);
  } else {
    emit("discountNm", "전체");
  }
});
const clickDiscount = (e) => {
  selectedDiscountNo.value = null;
};

watch(
  () => props.init,
  () => {
    selectedDiscountNo.value = null;
  }
);
</script>
