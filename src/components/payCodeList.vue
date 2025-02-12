<template>
    <div class="text-base font-semibold w-full">
     지불코드 : <select name="" id="" class="font-thin w-44 h-10 rounded-lg border ml-1 pl-1 " @change="changePayCd" v-model="selectedPayCd">
        <option value="0">전체</option>
        <option :value="i.lngCode" v-for="i in payCodeList" >{{ i.strName }}</option>
     </select>
    </div>
</template>

<script setup>
import { getpayCodeList } from '@/api/misales';
import { ref, watch } from 'vue';
const props = defineProps({
      groupCd: {
      type: String,
      default: "",
      } ,
      storeCd: {
      type: String,
      default: "",
      }
      ,
      init: {
      type: Boolean,
      default: false,
      }
     
      
    })
    const emit = defineEmits(['payCd']);
const payCodeList = ref([])
const selectedPayCd =ref(0)
watch( () => props.storeCd , async() => {
       const res = await getpayCodeList(props.groupCd , props.storeCd);
       payCodeList.value = res.data.PAYCDLIST
       console.log(res)
    })

    const changePayCd = (e) => {
        emit('payCd' , e.target.value)
    }

    watch( () => props.init , () => {
        selectedPayCd.value = 0
    
    })
</script>
