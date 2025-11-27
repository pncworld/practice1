<template>
  <v-autocomplete
    v-model="selectedStoreCode"
    :items="storeCd"
    :loading="loading"
    item-title="name"
    item-value="code"
    cache-items
    class="border border-black w-[10%] h-[10%]"
    flat
    hide-no-data
    hide-details
    label="매장을 선택하세요"
    solo-inverted />
</template>

<script setup>
import { ref } from "vue";

// 선택된 값
const selectedStoreCode = ref(null);

// 로딩 여부(필요시)
const loading = ref(false);

// 자동완성에 들어갈 항목
const storeCd = ref([
  { name: "서울점", code: "S001" },
  { name: "부산점", code: "B002" },
  { name: "대구점", code: "D003" },
  { name: "인천점", code: "I004" },
]);
</script>

<style scoped></style>
