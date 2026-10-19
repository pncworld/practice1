<template>
  <div class="flex flex-wrap items-center gap-2">
    <v-select
      class="biz-select w-40"
      :model-value="adminCode"
      :options="adminSelectOptions"
      :reduce="(option) => option.code"
      label="name"
      placeholder="전체"
      :clearable="false"
      append-to-body
      @update:modelValue="changeAdmin">
      <template #no-options><div>검색된 항목이 없습니다.</div></template>
    </v-select>
    <v-select
      class="biz-select w-44"
      :model-value="storeGroup"
      :options="groupSelectOptions"
      :reduce="(option) => option.code"
      label="name"
      placeholder="전체"
      :clearable="false"
      append-to-body
      @update:modelValue="changeGroup">
      <template #no-options><div>검색된 항목이 없습니다.</div></template>
    </v-select>
    <v-select
      class="biz-select w-52"
      :model-value="storeCode"
      :options="storeSelectOptions"
      :reduce="(option) => option.code"
      label="name"
      placeholder="전체"
      :clearable="false"
      append-to-body
      @update:modelValue="changeStore">
      <template #no-options><div>검색된 항목이 없습니다.</div></template>
    </v-select>
  </div>
</template>

<script setup>
import { selectBizAdmin } from "@/api/master";
import { computed, onMounted, ref } from "vue";

const props = defineProps({
  adminCode: {
    type: String,
    default: "0",
  },
  storeGroup: {
    type: String,
    default: "0",
  },
  storeCode: {
    type: String,
    default: "0",
  },
});

const emit = defineEmits(["update:adminCode", "update:storeGroup", "update:storeCode"]);

const adminRows = ref([]);
const groupRows = ref([]);
const storeRows = ref([]);
const groupStoreRows = ref([]);

const readPayload = (data) => {
  let payload = data;
  if (payload && typeof payload === "object" && "d" in payload) {
    payload = payload.d;
  }
  if (typeof payload === "string") {
    try {
      payload = JSON.parse(payload);
    } catch (error) {
      payload = {};
    }
  }
  return payload && typeof payload === "object" ? payload : {};
};

const loadType = async (adminCode, storeGroup, strType) => {
  const res = await selectBizAdmin(adminCode, storeGroup, strType);
  const payload = readPayload(res?.data);
  if (payload.RESULT_CD && String(payload.RESULT_CD) !== "00") {
    return { list: [], list2: [] };
  }
  return {
    list: Array.isArray(payload.list) ? payload.list : [],
    list2: Array.isArray(payload.list2) ? payload.list2 : [],
  };
};

const loadGroups = async (adminCode) => {
  const result = await loadType(adminCode, "0", "group");
  groupRows.value = result.list;
  groupStoreRows.value = result.list2;
  storeRows.value = result.list2;
};

const loadStores = async (storeGroup) => {
  if (!storeGroup || storeGroup === "0") {
    storeRows.value = groupStoreRows.value;
    return;
  }
  const result = await loadType(props.adminCode || "0", storeGroup, "store");
  storeRows.value = result.list;
};

onMounted(async () => {
  try {
    const admin = await loadType("0", "0", "admin");
    adminRows.value = admin.list;
    await loadGroups(props.adminCode || "0");
  } catch (error) {
    adminRows.value = [];
    groupRows.value = [];
    storeRows.value = [];
  }
});

const withAll = (rows) => [{ code: "0", group: "", name: "전체" }, ...rows];

const adminOptions = computed(() =>
  adminRows.value
    .filter((row) => row?.lngAdminCode != null && String(row.lngAdminCode) !== "")
    .map((row) => ({
      code: String(row.lngAdminCode),
      name: row.strAdminName || String(row.lngAdminCode),
    }))
);

const groupOptions = computed(() =>
  groupRows.value
    .filter((row) => row?.lngStoreGroup != null && String(row.lngStoreGroup) !== "")
    .map((row) => ({
      code: String(row.lngStoreGroup),
      name: row.strName || String(row.lngStoreGroup),
    }))
);

const storeOptions = computed(() =>
  storeRows.value
    .filter((row) => row?.lngStoreCode != null && String(row.lngStoreCode) !== "")
    .map((row) => ({
      code: String(row.lngStoreCode),
      group: String(row.lngStoreGroup ?? ""),
      name: row.strName || String(row.lngStoreCode),
    }))
);

const adminSelectOptions = computed(() => withAll(adminOptions.value));
const groupSelectOptions = computed(() => withAll(groupOptions.value));
const storeSelectOptions = computed(() => withAll(storeOptions.value));

const selectedCode = (value) => {
  if (value == null || value === "") {
    return "0";
  }
  return String(value);
};

const changeAdmin = async (value) => {
  const adminCode = selectedCode(value);
  emit("update:adminCode", adminCode);
  emit("update:storeGroup", "0");
  emit("update:storeCode", "0");
  try {
    await loadGroups(adminCode);
  } catch (error) {
    groupRows.value = [];
    storeRows.value = [];
  }
};

const changeGroup = async (value) => {
  const storeGroup = selectedCode(value);
  emit("update:storeGroup", storeGroup);
  emit("update:storeCode", "0");
  try {
    await loadStores(storeGroup);
  } catch (error) {
    storeRows.value = [];
  }
};

const changeStore = (value) => {
  emit("update:storeCode", selectedCode(value));
};
</script>

<style scoped>
.biz-select {
  flex-shrink: 0;
  background: #fff;
  font-size: 0.875rem;
}

.biz-select :deep(.vs__dropdown-toggle) {
  height: 2rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: #fff;
  padding: 0 0.25rem;
}

.biz-select :deep(.vs__selected-options) {
  flex-wrap: nowrap;
  padding: 0;
}

.biz-select :deep(.vs__search) {
  margin: 0;
  padding: 0 0.25rem;
  font-size: 0.875rem;
}

.biz-select :deep(.vs__selected) {
  margin: 0;
  padding: 0 0.25rem;
  font-size: 0.875rem;
}
</style>
