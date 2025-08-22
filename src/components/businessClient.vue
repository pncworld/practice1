<template>
  <div class="flex space-x-5 items-center mt-2">
    <div class="text-base font-semibold">거래처</div>
    <select name="" id="" class="w-64 h-8 border border-black" v-model="cond">
      <option value="0">선택</option>
      <option :value="i.lngSupplierID" v-for="i in optionList">
        {{ i.strSupplierName }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { getSuppliers } from "@/api/master";
import store from "@/store";
import { onMounted, ref, watch } from "vue";

const optionList = ref([]);
const cond = ref("0");
const emit = defineEmits(["SupplierId", "SupplierNm"]);
onMounted(async () => {
  const res = await getSuppliers(store.state.userData.lngStoreGroup);

  //console.log(res);

  optionList.value = res.data.List;

  cond.value = 0;
  emit("SupplierId", cond.value);
  emit("SupplierNm", "선택");
});

watch(cond, () => {
  emit("SupplierId", cond.value);

  const name =
    optionList.value.filter((item) => item.lngSupplierID == cond.value)[0]
      ?.strSupplierName || "선택";

  emit("SupplierNm", name);
});
</script>

<style scoped></style>
