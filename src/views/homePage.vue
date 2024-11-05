<template>
    <div class="bg-white border border-gray-200 rounded-lg shadow-lg p-6 max-w-lg mx-auto mt-8">
    <div class="text-xl font-semibold text-blue-600 mb-2">공지사항</div>
    <div class="text-gray-700" v-if="isMobile">
      모바일 환경에서는 일부 기능이 제한됩니다.
    </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex';

const store = useStore();

const isMobile = store.state.isMobile ;
</script>

<style lang="scss" scoped>

</style>