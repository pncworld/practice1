<template>
  <div class="flex space-x-5 items-center mt-2">
    <div class="text-base font-semibold">{{ Name }}</div>
    <!-- <select
      name=""
      id=""
      class="w-64 h-8 border border-black"
      v-model="cond"
      :disabled="disableBusiness">
      <option value="0">{{ Nm }}</option>
      <option :value="i.lngSupplierID" v-for="i in optionList">
        {{ i.strSupplierName }}
      </option>
    </select> -->

    <v-select
      v-model="selectedSupplier"
      :options="optionList"
      label="strSupplierName"
      placeholder="전체"
      :reduce="(store) => (store != null ? store.lngSupplierID : null)"
      clearable="true"
      class="w-64 h-8 bg-white"
      />
  </div>
</template>

<script setup>
import { getSuppliers } from "@/api/master";
import store from "@/store";
import { onMounted, ref, watch } from "vue";

const optionList = ref([]);
const selectedSupplier = ref('');
const emit = defineEmits(["SupplierId"]);
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
    selectedSupplier.value = props.selectSupplierId;
  }
);
onMounted(async () => {
  const res = await getSuppliers(store.state.userData.lngStoreGroup);
  optionList.value = res.data.List;
  // optionList.value = [
  //   { lngSupplierID: '0' , strSupplierName: "전체"},
  //   ...res.data.List
  // ];

  // console.log(optionList.value)

  Name.value = props.defaultName;

  selectedSupplier.value = '';
  // Nm.value = props.defaultNm;
  emit("SupplierId", selectedSupplier.value);
  // emit("SupplierNm", Nm.value);
});

watch(selectedSupplier, () => {
  if (selectedSupplier.value == null || selectedSupplier.value == undefined) {
    emit("SupplierId", '');
  } else {
    emit("SupplierId", selectedSupplier.value);
  }
});

</script>

<style scoped>
</style>