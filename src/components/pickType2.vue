<template>
  <div class="flex ml-12 items-center justify-start">
    <div class="font-semibold text-base">매장 유형</div>
    <select
      name=""
      id=""
      class="w-32 h-8 border border-black ml-5"
      v-model="cond">
      <option :value="i.lngSubLease" v-for="i in optionList">
        {{ i.strName }}
      </option>
    </select>
  </div>
</template>

<script setup>
import store from "@/store";
import { ref, watch } from "vue";
import { onMounted } from "vue";

const cond = ref(0);
const emit = defineEmits(["SubLease", "SubLeaseName"]);
onMounted(() => {
  console.log(store.state.storeSubLease);

  optionList.value = store.state.storeSubLease;

  cond.value = store.state.userData.lngSubLease;

  emit("SubLease", cond.value);

  const SubLeaseNm =
    optionList.value.filter((item) => item.lngSubLease == cond.value)[0]
      ?.strName || "선택";

  emit("SubLeaseName", SubLeaseNm);
});
const optionList = ref([]);

watch(cond, () => {
  emit("SubLease", cond.value);

  const SubLeaseNm =
    optionList.value.filter((item) => item.lngSubLease == cond.value)[0]
      ?.strName || "선택";

  emit("SubLeaseName", SubLeaseNm);
});
</script>

<style></style>
