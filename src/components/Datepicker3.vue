<template>
    <div class="flex items-center ml-20 space-x-2">
        <span class="ml-10 font-semibold text-base">해당월 : </span>
        <select name="" id="" class="w-32 h-8 rounded-lg border border-gray-500" v-model="startyear">
            <option :value="i" v-for="i in settingYears">{{ i }}</option>
        </select>
        <select name="" id="" class="w-10 h-8 rounded-lg border border-gray-500" v-model="startmonth">
            <option :value="i" v-for="i in Months">{{ i }}</option>
        </select>

        <select name="" id="" class="w-32 h-8 rounded-lg border border-gray-500" v-model="endyear">
            <option :value="i" v-for="i in settingYears">{{ i }}</option>
        </select>
        <select name="" id="" class="w-10 h-8 rounded-lg border border-gray-500" v-model="endmonth">
            <option :value="i" v-for="i in Months">{{ i }}</option>
        </select>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';


const emit = defineEmits(['startYear', 'startMonth', 'endYear', 'endMonth']);


const startyear = ref()
const startmonth = ref(1)
const endyear = ref()
const endmonth = ref(1)

const settingYears = ref([])

let Months = [1,2,3,4,5,6,7,8,9,10,11,12]
onMounted(() => {
    const today = new Date()
    const currentYear = today.getFullYear()

    startyear.value = currentYear
    endyear.value = currentYear

    for (let i = currentYear-8; i <= currentYear + 5; i++) {
        settingYears.value.push(i)
    }

    settingYears.value.sort((a,b) => b-a)

    emit('startYear', startyear.value)
    emit('startMonth', startmonth.value)
    emit('endYear', endyear.value)
    emit('endMonth', endmonth.value)
})

watch([startyear,startmonth,endyear,endmonth] , () => {
    emit('startYear', startyear.value)
    emit('startMonth', startmonth.value)
    emit('endYear', endyear.value)
    emit('endMonth', endmonth.value)
})
</script>
