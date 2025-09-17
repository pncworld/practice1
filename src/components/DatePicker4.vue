<template>
  <div class="flex space-x-5">
    <div class="flex items-center justify-center text-base font-semibold">
      마감월
    </div>
    <div>
      <select
        name=""
        id=""
        class="h-8 w-24 border border-black"
        @change="emitYear"
        v-model="cond">
        <option :value="i.lngCode" v-for="i in optionList">
          {{ i.lngCode }}
        </option>
      </select>
    </div>
    <div>
      <select
        name=""
        id=""
        class="h-8 w-10 border border-black"
        v-model="cond2"
        @change="emitMonth">
        <option :value="i.lngCode" v-for="i in optionList2">
          {{ i.lngCode }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { formatLocalDate } from "@/customFunc/customFunc";
import { onMounted, ref } from "vue";

const emit = defineEmits(["year", "month"]);
const optionList = ref([]);
const optionList2 = ref([]);

const cond = ref("");
const cond2 = ref("");
onMounted(() => {
  for (let i = 0; i < 10; i++) {
    optionList.value.push({
      lngCode: 2020 + i,
    });
  }

  for (let i = 0; i < 12; i++) {
    optionList2.value.push({
      lngCode: String(i + 1).padStart(2, 0),
    });
  }

  // console.log(formatLocalDate(new Date()).split("-")[1]);
  cond.value = formatLocalDate(new Date()).split("-")[0];
  cond2.value = formatLocalDate(new Date()).split("-")[1];
  emit("year", cond.value);
  emit("month", cond2.value);
});

const emitMonth = (e) => {
  emit("month", e.target.value);
};
const emitYear = (e) => {
  emit("year", e.target.value);
};
</script>

<style scoped></style>
