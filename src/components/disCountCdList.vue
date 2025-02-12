<template>
    <div class=" flex justify-center items-center space-x-3 ">
     <div class="text-base font-semibold ">할인코드 :</div><select name="" id="" class="font-thin w-64 h-10 rounded-lg border " @change="changeDiscount" v-model="selectedDiscountNo">
        <option value="0">전체</option>
        <option :value="i.lngCode" v-for="i in disCountList" >{{ i.strName }}</option>
     </select>
    </div>
</template>

<script setup>
import { getDiscountCdList } from '@/api/misales';
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

    const emit = defineEmits(['disCountCd']);
const disCountList = ref([])
const selectedDiscountNo = ref(0)
watch( () => props.storeCd , async() => {
       const res = await getDiscountCdList(props.groupCd , props.storeCd);
       disCountList.value = res.data.DISCOUNTLIST
       console.log(res)
    })

    const changeDiscount = (e) => {
        emit('disCountCd' , e.target.value)
    }

    watch( () => props.init , () => {
        selectedDiscountNo.value = 0
    
    })

</script>
