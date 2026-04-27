<template>
  <div
    :class="[
      'flex text-base',
      compactSearchBar
        ? 'mt-0 ml-0 min-w-0 w-full items-center justify-start gap-4'
        : 'mt-2 items-center space-x-5',
    ]">
    <div
      v-if="!compactSearchBar"
      class="shrink-0 text-base font-semibold">
      {{ Name }}
    </div>
    <div
      class="pickstore-vs-shell overflow-hidden rounded-md border border-gray-800 bg-white text-sm text-nowrap"
      :class="
        compactSearchBar
          ? 'h-8 min-h-8 w-full max-w-full min-w-0'
          : 'h-8 w-64 shrink-0 min-w-0'
      ">
      <v-select
        v-model="selectedSupplier"
        :options="optionList"
        label="strSupplierName"
        placeholder="전체"
        :reduce="(store) => (store != null ? store.lngSupplierID : null)"
        :clearable="!disable"
        append-to-body
        :disabled="disable"
        class="style-chooser h-full !disabled:text-black text-sm">
        <template #no-options>
          <div>검색된 항목이 없습니다.</div>
        </template>
        <template #no-results>
          <div>검색된 항목이 없습니다.</div>
        </template>
      </v-select>
    </div>
  </div>
</template>

<script setup>
import { getSuppliers } from "@/api/master";
import store from "@/store";
import { onMounted, ref, watch } from "vue";

const optionList = ref([]);
const selectedSupplier = ref("");
const selectedSupplierNm = ref("");
const emit = defineEmits(["SupplierId", "SupplierNm"]);
const props = defineProps({
  selectSupplierNm: {
    type: String,
    default: "전체",
  },
  disable: {
    type: Boolean,
    default: false,
  },
  selectSupplierId: {
    type: [String, Number],
    default: "",
  },
  defaultName: {
    type: String,
    default: "거래처",
  },
  /** PickStore `compact-search-bar`와 동일 — 조회줄에서 레이아웃·콤보 셸 통일 */
  compactSearchBar: {
    type: Boolean,
    default: false,
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
    applyPresetSupplier(props.selectSupplierId);
  }
);
watch(
  () => props.selectSupplierNm,
  () => {
    selectedSupplierNm.value = props.selectSupplierNm;
  }
);

function hasPresetId(id) {
  return (
    id !== "" &&
    id != null &&
    id !== 0 &&
    id !== "0"
  );
}

function applyPresetSupplier(presetId) {
  if (hasPresetId(presetId)) {
    selectedSupplier.value = presetId;
    const found = optionList.value.find(
      (i) => String(i.lngSupplierID) === String(presetId)
    );
    selectedSupplierNm.value = found ? found.strSupplierName : "";
  } else {
    selectedSupplier.value = "";
    selectedSupplierNm.value = "전체";
  }
}

onMounted(async () => {
  try {
    const gid = store.state.userData?.lngStoreGroup;
    const res = await getSuppliers(gid);
    optionList.value = Array.isArray(res?.data?.List) ? res.data.List : [];
  } catch {
    optionList.value = [];
  }

  Name.value = props.defaultName;

  const presetId = props.selectSupplierId;
  if (hasPresetId(presetId)) {
    selectedSupplier.value = presetId;
    const found = optionList.value.find(
      (i) => String(i.lngSupplierID) === String(presetId)
    );
    selectedSupplierNm.value = found ? found.strSupplierName : "";
  } else {
    selectedSupplier.value = "";
    selectedSupplierNm.value = "전체";
  }

  emit("SupplierId", selectedSupplier.value);
  emit("SupplierNm", selectedSupplierNm.value);
});

watch(selectedSupplier, (newVal) => {
  if (newVal === null || newVal === undefined || newVal === "") {
    selectedSupplierNm.value = "전체";
    emit("SupplierId", "");
    emit("SupplierNm", "전체");
    return;
  }
  const found = optionList.value.find(
    (i) => String(i.lngSupplierID) === String(newVal)
  );
  selectedSupplierNm.value = found ? found.strSupplierName : "";
  emit("SupplierId", selectedSupplier.value);
  emit("SupplierNm", selectedSupplierNm.value);
});
</script>

<!-- pickStore와 분리 번들에서도 동일 셸 스타일 적용 -->
<style>
.pickstore-vs-shell .style-chooser .vs__dropdown-toggle {
  border: 0 !important;
  border-radius: 0 !important;
  box-shadow: none !important;
}
</style>
