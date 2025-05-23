<template>
  <div class="flex justify-center items-center space-x-3">
    <div class="text-base font-semibold">메뉴그룹명 :</div>

    <select
      name=""
      id=""
      class="w-40 h-8"
      v-model="selectedMain"
      @change="setSub">
      <option value="0">전체</option>
      <option :value="i.lngCode" v-for="i in mainList">{{ i.strName }}</option>
    </select>
    <select name="" id="" class="w-40 h-8" v-model="selectedSub">
      <option value="0">전체</option>
      <option :value="i.lngCode" v-for="i in subsubList">
        {{ i.strName }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { getMenuGroupList } from "@/api/master";
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
const emit = defineEmits(["mainCode", "subCode"]);
const mainList = ref([]);
const subList = ref([]);
const subsubList = ref([]);
const selectedMain = ref(0);
const selectedSub = ref(0);
onMounted(async () => {
  //emit("payNm", "전체");
  // const res = await getMenuGroupList(props.groupCd, props.storeCd, 1);
  // console.log(res);
  // mainList.value = res.data.List;
  // subList.value = res.data.List2;
  emit("mainCode", 0);
  emit("subCode", 0);
});

const setSub = (e) => {
  //console.log(e);
  if (e.target.value == "0") {
    subsubList.value = subList.value;
    selectedSub.value = 0;
    return;
  }
  subsubList.value = subList.value.filter(
    (item) => item.lngMajor == e.target.value
  );
  selectedSub.value = 0;
};
watch(
  () => props.storeCd,
  async () => {
    const res = await getMenuGroupList(props.groupCd, props.storeCd, 1);
    console.log(res);
    mainList.value = res.data.List;
    subList.value = res.data.List2;
    subsubList.value = res.data.List2;
  }
);
watch(selectedSub, () => {
  emit("subCode", selectedSub.value);
});
watch(selectedMain, () => {
  emit("mainCode", selectedMain.value);
});
// const changePayCd = (e) => {
//     emit('payCd' , e.target.value)
// }

// watch(selectedPayCd, () => {
//   emit("payCd", selectedPayCd.value);
//   if (selectedPayCd.value == null) {
//     emit("payNm", "전체");
//   } else {
//     //comsole.log(payCodeList.value);
//     //comsole.log(selectedPayCd.value);
//     let nm = payCodeList.value.filter(
//       (item) => item.lngCode == selectedPayCd.value
//     )[0].strName;
//     emit("payNm", nm);
//   }
// });

// const clickPayCd = () => {
//   selectedPayCd.value = null;
// };

watch(
  () => props.init,
  () => {
    selectedPayCd.value = null;
  }
);
</script>
