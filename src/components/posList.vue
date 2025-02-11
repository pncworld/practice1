<template>
     <div class="font-semibold text-base"> POS번호 :  <select name="" id="" class="border rounded-lg w-32 h-10 font-thin pl-2" v-model="selectedPosNo" @change="changePosNo">
        <option :value="0">전체</option>
        <option :value="i.lngCode" v-for="i in POSLIST">{{ i.strName }}</option>
      </select>
    </div>
</template>

<script setup>
import { getPosList } from '@/api/common';
import { onMounted, ref, watch } from 'vue';

const selectedPosNo = ref(0)
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
    const emit = defineEmits(['posNo']);

onMounted(() => {
    emit('posNo' , selectedPosNo.value)
})
 const POSLIST = ref([])
    watch( () => props.storeCd , async() => {
       const res = await getPosList(props.groupCd , props.storeCd);
       POSLIST.value = res.data.pos
    
    })

    const changePosNo = (e) => {
        emit('posNo' , e.target.value)
    }

    watch( () => props.init , () => {
        selectedPosNo.value = 0
    
    })
</script>
