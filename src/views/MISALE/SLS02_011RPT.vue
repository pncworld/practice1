<template>
     <div class="flex justify-between items-center w-full overflow-y-auto">
    <div class="flex justify-start  w-full pl-12 pt-4">
               <div class="flex justify-start"><h1 class="font-bold text-sm md:text-2xl w-full">
                영수증별 매출 조회.
               </h1></div>
                
               </div>
               <div class="flex justify-center mr-9 space-x-2 pr-5">
                
            <button @click="searchButton" class="button search md:w-auto w-14">조회</button>
            <button @click="saveButton" class="button save w-auto">저장</button>
              
            </div>
            </div>
            <div class="flex justify-between  space-x-5 bg-gray-200 rounded-lg h-20 items-center">
                  <Datepicker1 @dateValue="dateValue" @year="year" @month="month" @day="day"></Datepicker1>
                  <PickStoreRenew></pickStoreRenew>
                  <PickStorePlural :progname="'PICKSTOREPLURAL_VUE'" :progid="1" @lngStoreGroups="lngStoreGroups" @lngStoreCodes="lngStoreCodes" :initCheckBox="initCheckBox" :initSearchWord="initSearchWord"></pickStorePlural>
                </div> 
   
   
</template>

<script setup>
import Datepicker1 from '@/components/Datepicker1.vue';
import PickStorePlural from '@/components/pickStorePlural.vue';
import PickStoreRenew from '@/components/pickStoreRenew.vue';
import { ref, watch } from 'vue';
const selectedDate = ref()

const dateValue = (e) => {
    selectedDate.value = e
    console.log(selectedDate.value)
}
const year = (e) => {
    console.log(e)
}
const month = (e) => {
    console.log(e)
}
const day = (e) => {
    console.log(e)
}

const lngStoreGroups = (e) => {
    console.log(e)
}
const lngStoreCodes = (e) => {
    console.log(e)
}

const initCheckBox = ref(false)
const initSearchWord = ref(false)

const searchButton = () =>{
    initCheckBox.value = !initCheckBox.value
    initSearchWord.value = !initSearchWord.value
}
</script>

