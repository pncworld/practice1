<template>
  <div
    class="h-[30px] w-[85%] bg-white border border-black rounded-lg text-xs text-nowrap">
    <v-select
      :reduce="(option) => option.lngCode"
      class="style-chooser h-full text-sm !disabled:text-black"
      v-model="selected"
      :disabled="isDisabled"
      :clearable="!isDisabled"
      label="strName"
      :placeholder="defaultNm"
      @click="reset"
      append-to-body
      :options="options">
      <template #no-options>
        <div>검색된 항목이 없습니다.</div>
      </template>

      <template #no-results>
        <div>검색된 항목이 없습니다.</div>
      </template>
    </v-select>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useStore } from "vuex";

const defaultNm = ref("선택");
const props = defineProps({
  options: {
    type: Array,
    default: [],
  },
  code: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
  defaultNm: {
    type: String,
    default: "선택",
  },
});

const emit = defineEmits(["selected"]);

const selected = ref(null);
const store = useStore();
const options = ref([]);
onMounted(() => {
  options.value = props.options;

  options.value = options.value.map((item) => ({
    ...item,
    lngCode: item[props.code],
    strName: item[props.label],
  }));

  defaultNm.value = props.defaultNm;
});

watch(selected, () => {
  if (selected.value == null) {
    emit("selected", 0);
  } else {
    emit("selected", selected.value);
  }
});

watch(
  () => props.options,
  () => {
    options.value = props.options;

    options.value = options.value.map((item) => ({
      ...item,
      lngCode: item[props.code],
      strName: item[props.label],
    }));

    selected.value = null;
  }
);
const reset = () => {
  selected.value = null;
};
</script>

<style scoped></style>
