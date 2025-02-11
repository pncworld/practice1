<template>
    <div><span class="ml-10 font-semibold text-base">매출일자 : </span><input type="date" class="border rounded-lg h-10 w-36 text-base pl-5" v-model="selectedDate" @change="emitDate">
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';

const formatDate = (date) => date.toISOString().split('T')[0]
const selectedDate = ref(formatDate(new Date()))
const emit = defineEmits(['dateValue','year','month','day']);

onMounted(() => {
    emit('dateValue',selectedDate.value)
})
const emitDate = () => {
    console.log(selectedDate.value)
    emit('dateValue',selectedDate.value)
    emit('year',selectedDate.value.split('-')[0])
    emit('month',Number(selectedDate.value.split('-')[1]))
    emit('day',Number(selectedDate.value.split('-')[2]))
}
</script>

