<template>
    <div class="flex items-center justify-end space-x-3 text-xs ">
     <div class="font-bold text-sm pl-12 hidden md:inline-block"> 매장명 :  </div>
      <div class="hidden md:block">
        <select :disabled="isDisabled1"   id="storeGroup" class="border border-gray-800 rounded-md p-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" @change="emitStoreGroup($event.target.value); ischanged();">
          <option :value="item.lngStoreGroup" v-for="item in storeGroup" :key="item.lngStoreGroup">{{ item.strName }}</option>
        </select>
      </div>
      <div class="hidden md:block">
        <select :disabled="isDisabled2"  class=" border border-gray-800 rounded-md p-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" @change="setStore($event.target.value); emitStoreType($event.target.value); ischanged();">
         
          <option value="0">전체</option>
          <option :value="item.lngStoreAttr" v-for="item in storeType" :key="item.lngStoreAttr">{{ item.strName }}</option>
        </select>
      </div>
      <div class="flex flex-col space-y-3">
       <div><span class="font-bold text-sm pl-4 inline-block md:hidden"> 매장명 : </span> <select :disabled="isDisabled3"  class="text-sm w-2/3 md:w-auto border border-gray-800 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" @change="emitStoreCode($event.target.value); setPosNo($event.target.value); ischanged(); ">
        
          <option value="0">선택</option>
          <option :value="item.lngStoreCode" v-for="item in storeCd" :key="item.lngStoreCode">{{ item.strName }}</option>
        </select>
        
      </div>
        
    </div>
      <div class="">
        <span class="font-bold text-sm "> KIOSK번호 : &nbsp;</span> <select :disabled="isDisabled4"  class="w-32 text-sm border border-gray-800 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" v-model="selectedPosNo" @change="ischanged2();">
          <option value="0">선택</option>
          <option :value="{ lngCode: item.lngCode , lngAreaCode: item.lngAreaCode} " v-for="item in storePosNo" :key="item.lngAreaCode">{{ item.strName }}</option>
        </select>
      </div>

      <div class="flex justify-center items-center space-x-2">
        <span class="font-bold text-sm ">결제키구분 : &nbsp;</span> 
        
        <label for="discount" class="flex justify-center items-center "><input type="radio" id="discount" v-model="paymentType" :value=3><span class="font-bold">[1]할인</span> </label> 
        <label for="payment" class="flex justify-center items-center"><input type="radio" v-model="paymentType" id="payment"  :value=4><span class="font-bold">[2]지불</span> </label> 
    
      </div>
    </div>
  </template>
  

<script setup>
import { getKioskList, getPosList } from '@/api/common';
import axios from 'axios';
import { defineProps , ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
const storeGroup = ref([]);
const storeType = ref([]);
const storeCd = ref([]);
const storeCd2 = ref([]);
const storePosNo = ref([]);
const storeAreaCd2 = ref([]);
const isDisabled1 = ref(false);
const isDisabled2 = ref(false);
const isDisabled3 = ref(false);
const isDisabled4 = ref(false);
const selectedPosNo = ref('0');
const paymentType = ref(3)
const changed = ref(false)
const ischanged = () => {
    changed.value = !changed.value;
  
    console.log(changed.value)
    emit('update:ischanged',changed.value);
};
const ischanged2 = () => {
    changed.value = !changed.value;
  
    console.log(changed.value)
    emit('update:ischanged2',changed.value);
};

    const store = useStore();
    const userData = store.state.userData ;

const props = defineProps({
      groupCdDisabled: Boolean
    })
const {groupCdDisabled} = props ;
isDisabled1.value = groupCdDisabled;
const emit = defineEmits(['update:storeGroup' , 'update:storeType' , 'update:storeCd', 'areaCd', 'posNo' ,'update:ischanged' ,'storeNm' ,'update:ischanged2' ,'updatePaymentType']);
const emitStoreGroup = (value) => {
    emit('update:storeGroup', value);
};

const emitStoreType = (value) => {
    emit('update:storeType', value);
};
watch(paymentType, (newvalue) => {
  emit('updatePaymentType',newvalue)
})
const emitStoreCode = (value) => {
  if( value !='0'){
  const selectedNm = storeCd.value.filter(item => item.lngStoreCode == value)[0].strName

    emit('storeNm' ,selectedNm )
    emit('update:storeCd', value);
  } else {
    emit('update:storeCd', value);
  }
};

const emitPosInfo = (value1 ,value2) => {

  emit('areaCd' ,value1 )
  emit('posNo' ,value2 )
}
  storeGroup.value = store.state.storeGroup;
  storeType.value = store.state.storeType;
  storeCd.value = store.state.storeCd;
  storeCd2.value = store.state.storeCd;
  storeAreaCd2.value = store.state.storeAreaCd;
   const deActivate = () => {
     let storeIndex = storeGroup.value.filter(item => {
        return item.lngStoreGroup == userData.lngStoreGroup
     })
  }
  const setStore = (value) => {
    if ( value ==0) {
        storeCd.value = storeCd2.value ;
        return storeCd.value ;
    }
    storeCd.value = storeCd2.value.filter( item => {
        return item.lngStoreAttr == value ;
    })

  }
  const setPosNo = async (value) => {
    selectedPosNo.value='0'
    storePosNo.value='0';
    let response;
       try {
        response  =await getKioskList(storeGroup.value[0].lngStoreGroup
        , value)
       
       
        
        console.log( storePosNo.value)
       } catch (error) {
        
       } finally{
        storePosNo.value = response.data.pos
       }
        
  }
watch( selectedPosNo, (newValue) => {
    console.log(newValue)
    emitPosInfo(newValue.lngAreaCode, newValue.lngCode);
  
  
})
  const route = useRoute();
  
  watch(() => route.path, (newPath) =>{
        if (storeGroup.value.length > 0) {
        emit('update:storeGroup', storeGroup.value[0].lngStoreGroup);
        console.log(storeGroup.value[0].lngStoreGroup);
        }
      
    
  }
 
  
)
</script>

