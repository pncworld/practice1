<template>
    <div class="flex justify-end space-x-4">
     <div class="flex items-center">매장명 : </div>
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
        
          <option value="0">선택</option>
          <option :value="item.lngStoreCode" v-for="item in storeCd" :key="item.lngStoreCode">{{ item.strName }}</option>
        </select>
      </div>
    </div>
  </template>
  

<script setup>
import axios from 'axios';
import { onMounted, ref, watch } from 'vue';
import { useStore } from 'vuex';
const storeGroup = ref([]);
const storeType = ref([]);
const storeCd = ref([]);
const storeCd2 = ref([]);
const isDisabled1 = ref(false);
const isDisabled2 = ref(false);
const isDisabled3 = ref(false);
    const store = useStore();
    const userData = store.state.userData ;
const emit = defineEmits(['update:storeGroup' , 'update:storeType' , 'update:storeCd']);
const emitStoreGroup = (value) => {
    emit('update:storeGroup', value);
};

const emitStoreType = (value) => {
    emit('update:storeType', value);
};

const emitStoreCode = (value) => {
    emit('update:storeCd', value);
};
    const readsales = async() => {
     const response = await axios.post("http://211.238.145.43:3000/usp_APP_COMSTORE_GET_LIST",{
        P_STORE_CD : userData.lngStoreGroup ,
     });

     const result = response.data.recordsets ;
     
     storeGroup.value = result[0];
     storeType.value = result[1];
     storeCd.value = result[2];
     storeCd2.value = result[2];
     
     
  } 
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
  watch(
    () => store.state.userData, // userData를 감시하는 함수
  (newUserData) => {
    if (newUserData && newUserData.lngStoreGroup) { // lngPosition이 존재하는지 확인
      readsales();
      
        if (storeGroup.value.length > 0) {
        emit('update:storeGroup', storeGroup.value[0].lngStoreGroup);
        console.log(storeGroup.value[0].lngStoreGroup);
        }
      
    }
  }
)
</script>

