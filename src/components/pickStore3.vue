<template>
    <div class="flex justify-end space-x-4 text-sm">
     <div class="flex items-center font-bold text-sm pl-4 ml-8">매장명 : </div>
      <div>
        <select :disabled="isDisabled1"   id="storeGroup" class="border border-gray-800 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" @change="emitStoreGroup($event.target.value)">
          <option :value="item.lngStoreGroup" v-for="item in storeGroup" :key="item.lngStoreGroup">{{ item.strName }}</option>
        </select>
      </div>
      <div>
        <select :disabled="isDisabled2"  class="border border-gray-800 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" @change="setStore($event.target.value); emitStoreType($event.target.value);">
         
          <option value="0">전체</option>
          <option :value="item.lngStoreAttr" v-for="item in storeType" :key="item.lngStoreAttr">{{ item.strName }}</option>
        </select>
      </div>
      <div>
        <select :disabled="isDisabled3"  class="border border-gray-800 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" @change="emitStoreCode($event.target.value)">
        
          <option value="0">전체</option>
          <option :value="item.lngStoreCode" v-for="item in storeCd" :key="item.lngStoreCode">{{ item.strName }}</option>
        </select>
      </div>
    </div>
  </template>
  

<script setup>
import axios from 'axios';
import { defineProps , onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
const storeGroup = ref([]);
const storeType = ref([]);
const storeCd = ref([]);
const storeCd2 = ref([]);
const storeNm = ref('');
const isDisabled1 = ref(false);
const isDisabled2 = ref(false);
const isDisabled3 = ref(false);
let store = useStore();
const userData = store.state.userData ;

const props = defineProps({
      groupCdDisabled: Boolean
    })
const {groupCdDisabled} = props ;
isDisabled1.value = groupCdDisabled;
const emit = defineEmits(['update:storeGroup' , 'update:storeType' , 'update:storeCd','storeNm' , 'GroupNm']);
const emitStoreGroup = (value) => {
    emit('update:storeGroup', value);
};

const emitStoreType = (value) => {
    emit('update:storeType', value);
};

const emitStoreCode = (value) => {
   if( value !='0'){
   const selectedNm = storeCd.value.filter(item => item.lngStoreCode == value)[0].strName

    emit('storeNm' ,selectedNm )
    emit('update:storeCd', value);
  } else {
    emit('update:storeCd', value);
  }
  emit('GroupNm', storeGroup.value[0].strName);
};

onMounted(()=>{

    store = useStore();
  
    storeGroup.value = store.state.storeGroup;
    if(storeGroup.value[0] !=undefined){
      emit('update:storeGroup', storeGroup.value[0].lngStoreGroup);
    }
 


})
   
  storeGroup.value = store.state.storeGroup;
  storeType.value = store.state.storeType;
  storeCd.value = store.state.storeCd;
  storeCd2.value = store.state.storeCd;
  
  const setStore = (value) => {
    if ( value ==0) {
        storeCd.value = storeCd2.value ;
        return storeCd.value ;
    }
    storeCd.value = storeCd2.value.filter( item => {
        return item.lngStoreAttr == value ;
    })

  }

  const route = useRoute();
  
  watch(() => route.path, (newPath) =>{
        if (storeGroup.value.length > 0) {
     
        emit('update:storeGroup', storeGroup.value[0].lngStoreGroup);

   
        }
      
    
  }
 
  
)
</script>

