<template>
  <div class="flex space-x-5 items-center mt-2">
    <div class="text-base font-semibold">{{ Name }}</div>
    <select
      name=""
      id=""
      class="w-64 h-7 border border-black"
      :class="dynamicClass"
      v-model="cond"
      :disabled="disableBusiness">
      <option value="0">{{ Nm }}</option>
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
const props = defineProps({
  defaultNm: {
    type: String,
    default: "선택",
  },
  disable: {
    type: Boolean,
    default: false,
  },
  selectSupplierId: {
    type: String,
    default: 0,
  },
  defaultName: {
    type: String,
    default: "거래처",
  },
  setDynamicClass: {
    type: String,
    default: "",
  },
});

const Nm = ref("");
const disableBusiness = ref(false);
const Name = ref("");
watch(
  () => props.disable,
  () => {
    disableBusiness.value = props.disable;
  }
);
watch(
  () => props.selectSupplierId,
  () => {
    cond.value = props.selectSupplierId;
  }
);
const dynamicClass = ref("");
onMounted(async () => {
  const res = await getSuppliers(store.state.userData.lngStoreGroup);

  ////console.log(res);
  Name.value = props.defaultName;
  optionList.value = res.data.List;

  cond.value = 0;
  Nm.value = props.defaultNm;
  emit("SupplierId", cond.value);
  emit("SupplierNm", Nm.value);

  if (props.setDynamicClass != "") {
    dynamicClass.value = props.setDynamicClass;
  }

  if (props.disable == true) {
    disableBusiness.value = props.disable;
  }
});

watch(cond, () => {
  emit("SupplierId", cond.value);

  const name =
    optionList.value.filter((item) => item.lngSupplierID == cond.value)[0]
      ?.strSupplierName || Nm.value;

  emit("SupplierNm", name);
});
</script>

<style scoped></style>
