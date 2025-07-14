<template>
  <div class="flex justify-center items-center space-x-5 mt-2">
    <div class="font-semibold text-base flex pl-5">POS번호</div>
    <!-- <select name="" id="" class="border rounded-lg w-44 h-10 font-thin pl-1" v-model="selectedPosNo" @change="changePosNo">
        <option :value="0">전체</option>
        <option :value="i.lngCode" v-for="i in POSLIST">{{ i.strName }}</option>
      </select> -->

    <v-select
      v-model="selectedPosNo"
      :options="POSLIST"
      label="strName"
      placeholder="전체"
      class="!w-48 !h-7 -mt-3 custom-select"
      :reduce="(store) => (store != null ? store.lngCode : null)"
      clearable="true"
      @click="clickPosNo" />
  </div>
</template>

<script setup>
import { getPosList, getPosList2 } from "@/api/common";
import { onMounted, ref, watch } from "vue";

const selectedPosNo = ref(null);
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
const emit = defineEmits(["posNo", "excelPosNo"]);

onMounted(() => {
  emit("posNo", 0);
  emit("excelPosNo", "포스번호 : 전체");
});
const POSLIST = ref([]);
watch(
  () => props.storeCd,
  async () => {
    const res = await getPosList2(props.groupCd, props.storeCd);
    POSLIST.value = res.data.pos;
  }
);

// const changePosNo = (e) => {
//     //comsole.log(e)
//     emit('posNo' , e.target.value)
// }

watch(selectedPosNo, () => {
  if (selectedPosNo.value == null || selectedPosNo.value == undefined) {
    emit("posNo", 0);
    emit("excelPosNo", "포스번호 : 전체");
  } else {
    emit("posNo", selectedPosNo.value);
    emit("excelPosNo", "포스번호 : " + selectedPosNo.value);
  }
});
const clickPosNo = (e) => {
  selectedPosNo.value = null;
};

watch(
  () => props.init,
  () => {
    selectedPosNo.value = null;
  }
);
</script>
