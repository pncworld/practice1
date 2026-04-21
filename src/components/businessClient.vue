<template>
  <!-- 툴바 한 줄: space-x-5 / w-[60%] 없이 라벨·콤보 간격만 동일하게 (display:contents 대신 전용 마크업) -->
  <div
    v-if="inlineToolbar"
    class="flex items-center gap-2 shrink-0 m-0 p-0 mt-0">
    <div class="text-sm font-semibold text-gray-800 w-28 shrink-0">
      {{ Name }}
    </div>
    <select
      name=""
      id=""
      class="border border-gray-600 h-7 px-2 text-sm w-40 shrink-0"
      v-model="cond"
      :disabled="disableBusiness">
      <option value="0">{{ Nm }}</option>
      <option :value="i.lngSupplierID" v-for="i in optionList">
        {{ i.strSupplierName }}
      </option>
    </select>
  </div>
  <div
    v-else
    :class="[
      'flex items-center mt-2',
      toolbarStretch ? 'min-w-0 w-full gap-4' : 'space-x-5',
      setDynamicClass2,
    ]">
    <template v-if="toolbarStretch">
      <div class="shrink-0 text-base font-semibold whitespace-nowrap">
        {{ Name }}
      </div>
      <select
        name=""
        id=""
        :class="['h-7 shrink-0 border border-black', setDynamicClass]"
        v-model="cond"
        :disabled="disableBusiness">
        <option value="0">{{ Nm }}</option>
        <option :value="i.lngSupplierID" v-for="i in optionList">
          {{ i.strSupplierName }}
        </option>
      </select>
    </template>
    <template v-else>
      <div class="font-semibold whitespace-nowrap text-base">
        {{ Name }}
      </div>
      <select
        name=""
        id=""
        :class="[
          'h-7 border border-black',
          'w-[60%]',
          setDynamicClass,
        ]"
        v-model="cond"
        :disabled="disableBusiness">
        <option value="0">{{ Nm }}</option>
        <option :value="i.lngSupplierID" v-for="i in optionList">
          {{ i.strSupplierName }}
        </option>
      </select>
    </template>
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
  /** true: 조회바 등 한 줄 배치 — 자재목록/자재코드와 동일 gap·너비 */
  inlineToolbar: {
    type: Boolean,
    default: false,
  },
  /** true: 부모 그리드 안에서 라벨 고정·셀렉트가 남는 가로폭 채움 */
  toolbarStretch: {
    type: Boolean,
    default: false,
  },
});

const Nm = ref("");
const disableBusiness = ref(false);
const Name = ref(props.defaultName);
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
