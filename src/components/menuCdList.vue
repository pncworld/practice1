div
<template>
  <div class="flex justify-center items-center space-x-3">
    <div class="text-base font-semibold text-nowrap">메뉴코드 :</div>

    <v-select
      v-model="selectedDiscountNo"
      :options="disCountList"
      label="strName"
      placeholder="전체"
      class="!w-48 !h-7 mt-3 custom-select5 pr-20"
      :reduce="(store) => (store != null ? store.lngCode : null)"
      clearable="true"
      @click="clickDiscount" />
  </div>
</template>

<script setup>
import { getMenuCdList } from "@/api/misales";
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

const emit = defineEmits(["menuCd", "menuNm"]);
const disCountList = ref([]);
const selectedDiscountNo = ref(null);
onMounted(async () => {
  emit("menuNm", "전체");
  //console.log(store.state);
  const res = await getMenuCdList(store.state.userData.lngStoreGroup, 0);
  //comsole.log(res);
  disCountList.value = res.data.List;
});
watch(
  () => props.storeCd,
  async () => {
    try {
      const res = await getMenuCdList(props.groupCd, props.storeCd);
      //comsole.log(res);
      disCountList.value = res.data.List;
    } catch (error) {
      console.error("API 호출 실패:", error);
    }
  },
  { flush: "post" }
);

// const changeDiscount = (e) => {
//     //comsole.log(e)
//     emit('disCountCd' , e.target.value)
// }

watch(selectedDiscountNo, () => {
  emit("menuCd", selectedDiscountNo.value);
  if (selectedDiscountNo.value != null) {
    let nm = disCountList.value.filter(
      (item) => item.lngCode == selectedDiscountNo.value
    );
    emit("menuNm", nm[0].strName);
  } else {
    emit("menuNm", "전체");
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
