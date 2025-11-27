<template>
  <div class="flex space-x-5 items-center mt-2" :class="dynamicClass2">
    <div class="text-base font-semibold">{{ Name }}</div>
    <select
      name=""
      id=""
      class="w-[60%] h-7 border border-black"
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
  setDynamicClass2: {
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
const dynamicClass2 = ref("");
onMounted(async () => {
  // if(lngSupplierID == 0)
  // {//거래처가 아닌 아이디로 들어갔을 경우
  // 	DivSearch.cbSupplier.Index = 0;
  // 	DivSearch.cbSupplier.Editable = true;
  // 	DivSearch.cbSupplier.Enable = true;
  // }
  // else
  // {
  // 	var nFindRow = ds_Supplier.FindRow("lngSupplierID",lngSupplierID);

  // 	if(nFindRow >= 0)
  // 	{
  // 		DivSearch.cbSupplier.Value = lngSupplierID;
  // 	}
  // 	else
  // 	{
  // 		DivSearch.com_supplier.Index = -1;
  // 	}

  // 	DivSearch.cbSupplier.Editable = false;
  // 	DivSearch.cbSupplier.Enable = false;
  // }

  const res = await getSuppliers(store.state.userData.lngStoreGroup);
  optionList.value = res.data.List;

  let lngSupplierID = store.state.userData.lngSupplierID;
  console.log(res);
  if (lngSupplierID == 0) {
    disableBusiness.value = false;
    cond.value = 0;
    Nm.value = props.defaultNm;
  } else {
    let find = optionList.value.find(
      (item) => item.lngSupplierID == lngSupplierID
    );

    if (find != undefined) {
      disableBusiness.value = true;
      cond.value = find.lngSupplierID;
      Nm.value = find.strSupplierName;
    } else {
      disableBusiness.value = true;
      Nm.value = " ";
      cond.value = -1;
    }
  }

  Name.value = props.defaultName;

  emit("SupplierId", cond.value);
  emit("SupplierNm", Nm.value);

  if (props.setDynamicClass != "") {
    dynamicClass.value = props.setDynamicClass;
  }
  if (props.setDynamicClass2 != "") {
    dynamicClass2.value = props.setDynamicClass2;
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
