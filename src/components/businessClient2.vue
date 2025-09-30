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
const selectedSupplierNm = ref('');
const emit = defineEmits(["SupplierId", "SupplierNm"]);
const props = defineProps({
  selectSupplierNm : {
    type: String,
    default: "전체",
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
watch(
  () => props.selectSupplierNm,
  () => {
    selectedSupplierNm.value = props.selectSupplierNm;
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

  // props.selectSupplierId가 있으면 선택값과 이름 설정
  if (props.selectSupplierId) {
    selectedSupplier.value = props.selectSupplierId;
    const found = optionList.value.find(i => String(i.lngSupplierID) === String(props.selectSupplierId));
    selectedSupplierNm.value = found ? found.strSupplierName : '';
  } else {
    selectedSupplier.value = '';
    selectedSupplierNm.value = '전체';
  }

  // selectedSupplier.value = '';
  // selectedSupplierNm.value = '';
  emit("SupplierId", selectedSupplier.value);
  emit("SupplierNm", selectedSupplierNm.value);
});

watch(selectedSupplier, (newVal) => {
  if (newVal === null || newVal === undefined || newVal === '') {
    selectedSupplierNm.value = '전체';
    emit("SupplierId", '');
    emit("SupplierNm", '전체');
    return;
  } 
  const found = optionList.value.find(i => String(i.lngSupplierID) === String(newVal));
  selectedSupplierNm.value = found ? found.strSupplierName : '';
  emit("SupplierId", selectedSupplier.value);
  emit("SupplierNm", selectedSupplierNm.value);
});

</script>

<style scoped>
</style>