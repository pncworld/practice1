<template>
  <div>
    <button @click="showStore">{{ defaultPlaceHolder }}</button>
  </div>
  <div
    class="fixed top-0 left-0 w-full h-full bg-white z-50"
    v-show="showStoreBln">
    <div class="flex justify-between mt-5 p-5">
      <div class="text-3xl font-semibold">매장조회</div>
      <div><button @click="hideStore" class="text-3xl">X</button></div>
    </div>
    <div class="flex flex-col gap-5 justify-start">
      <!-- <div class="flex justify-start items-center">
        <div class="ml-10">법인</div>
        <div class="ml-16">
          <select name="" id="" class="w-60 border h-10"></select>
        </div>
      </div> -->
      <!-- <div class="flex justify-start">
        <div class="ml-10">브랜드</div>
        <div class="ml-10 mr-5">
          <select name="" id="" class="w-60 border h-10"></select>
        </div>
      </div> -->
      <!-- <div class="flex justify-start">
        <div class="ml-10 text-nowrap">매장코드/명</div>
        <div class="ml-2">
          <input type="text" class="border h-8" />
        </div>
      </div> -->

      <div class="ml-10 text-2xl font-semibold justify-start flex">
        매장 목록
      </div>
      <div>
        <div
          class="flex justify-center border-b-2 bg-gray-100 h-14 items-center">
          <div class="mr-20">매장코드</div>
          <div>|</div>
          <div class="ml-20">매장명</div>
        </div>
      </div>
      <div class="flex">
        <div
          :class="`grid grid-cols-1 grid-rows-[${StoreList.length}] w-1/2 space-y-3 overflow-auto`">
          <button
            v-for="i in StoreList"
            class="text-base"
            @click="emitStore(i.lngStoreCode, i.strName)">
            {{ i.lngStoreCode }}
          </button>
        </div>
        <div
          :class="`grid grid-cols-1 grid-rows-[${StoreList.length}] w-1/2 space-y-3 overflow-auto`">
          <button
            v-for="i in StoreList"
            class="overflow-hidden text-base"
            @click="emitStore(i.lngStoreCode, i.strName)">
            {{ i.strName }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useStore } from "vuex";

const store = useStore();
onMounted(() => {
  StoreList.value = store.state.storeCd.map((item) => ({
    lngStoreAttr: item.lngStoreAttr,
    lngStoreCode: item.lngStoreCode,
    strName: item.strName,
  }));
});

const defaultPlaceHolder = ref("매장 선택>");
const emit = defineEmits(["lngStoreCode"]);
const emitStore = (value1, value2) => {
  emit("lngStoreCode", value1);
  defaultPlaceHolder.value = value2;
  hideStore();
};
const StoreList = ref([]);
const showStoreBln = ref(false);

const showStore = () => {
  showStoreBln.value = true;
};
const hideStore = () => {
  showStoreBln.value = false;
};
</script>

<style lang="scss" scoped></style>
