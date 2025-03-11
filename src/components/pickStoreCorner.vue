<template>
    <div class="grid grid-rows-1 grid-cols-4 w-96 h-8 space-x-5">
        <div class="text-base font-semibold text-nowrap">매장 코너 : </div>
        <div><select name="" id="" v-model="storeGroup" disabled class="w-40 h-10 rounded-lg text-center">
                <option :value="i.lngStoreGroup" v-for="i in storeGroups">{{ i.strName }}</option>
            </select></div>
        <div><select name="" id="" v-model="storeStore" class="w-40 h-10 rounded-lg text-center">
                <option :value="i.lngStoreCode" v-for="i in storeList">{{ i.strName }}</option>
            </select></div>
        <div><select name="" id="" v-model="storeStore" class="w-40 h-10 rounded-lg text-center">
                <option :value="i.lngStoreCode" v-for="i in storeList">{{ i.strName }}</option>
            </select></div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { onMounted } from 'vue';
import { useStore } from 'vuex';

const store = useStore()
const storeGroup = ref(store.state.storeGroup[0].lngStoreGroup)
const storeStore = ref(store.state.storeCd[0].lngStoreCode)
const storeGroups = ref()
const storeList = ref()
const selectedStore = ref()
const emit = defineEmits(['', 'startMonth', 'endYear', 'endMonth', 'excelDate']);

onMounted(() => {
    console.log(store.state.storeGroup)
    console.log(store.state)
    storeGroups.value = store.state.storeGroup;
    storeList.value = store.state.storeCd;


})
</script>

<style></style>