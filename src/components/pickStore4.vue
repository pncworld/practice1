<template>
    <div class="flex items-center justify-end space-x-3 text-xs ">
     <div class="font-bold text-sm pl-4 hidden md:inline-block"> 매장명 :  </div>
      <div class="hidden md:block">
        <select :disabled="isDisabled1"   id="storeGroup" class="border border-gray-800 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" @change="emitStoreGroup($event.target.value)">
          <option :value="item.lngStoreGroup" v-for="item in storeGroup" :key="item.lngStoreGroup">{{ item.strName }}</option>
        </select>
      </div>
      <div class="hidden md:block">
        <select :disabled="isDisabled2"  class=" border border-gray-800 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" @change="setStore($event.target.value); emitStoreType($event.target.value);">
         
          <option value="0">전체</option>
          <option :value="item.lngStoreAttr" v-for="item in storeType" :key="item.lngStoreAttr">{{ item.strName }}</option>
        </select>
      </div>
      <div class="flex flex-col space-y-3">
       <div><span class="font-bold text-sm pl-4 inline-block md:hidden"> 매장명 : </span> <select :disabled="isDisabled3"  class="w-2/3 md:w-auto border border-gray-800 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" @change="emitStoreCode($event.target.value); setStoreAreaCd($event.target.value); ischanged(); ">
        
          <option value="0">선택</option>
          <option :value="item.lngStoreCode" v-for="item in storeCd" :key="item.lngStoreCode">{{ item.strName }}</option>
        </select>
        
      </div>
        <div class="inline-block md:hidden">
        <span class="font-bold text-sm ">지역코드 : &nbsp;</span> <select :disabled="isDisabled4"  class="w-32 border border-gray-800 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" v-model="selectedStoreAreaCd">
          <option :value="item.lngAreaCode" v-for="item in storeAreaCd" :key="item.lngAreaCode">{{ item.lngAreaCode }}</option>
        </select>
      </div>
    </div>
    
      <div class="hidden md:inline-block">
     <span class="font-bold text-sm ">지역코드 : &nbsp;</span> <select :disabled="isDisabled4"  class="w-32 border border-gray-800 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" v-model="selectedStoreAreaCd" @change="emitStoreAreaCd($event.target.value)">
      <option value="0">선택</option>
      <option :value="item.lngAreaCode" v-for="item in storeAreaCd" :key="item.lngAreaCode">{{ item.lngAreaCode }}</option>
        </select>
      </div>
    </div>
  </template>
  

<script setup>
import axios from 'axios';
import { defineProps , ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
const storeGroup = ref([]);
const storeType = ref([]);
const storeCd = ref([]);
const storeCd2 = ref([]);
const storeAreaCd = ref([]);
const storeAreaCd2 = ref([]);
const isDisabled1 = ref(false);
const isDisabled2 = ref(false);
const isDisabled3 = ref(false);
const isDisabled4 = ref(false);
const selectedStoreAreaCd = ref('0');
const changed = ref(false)
const ischanged = () => {
    changed.value = !changed.value;
    console.log("여긴")
    console.log(changed.value)
    emit('update:ischanged',changed.value);
};
// watch ( selectedStoreAreaCd , (newValue) => {
//   emit('update:storeAreaCd',newValue);
// })
    const store = useStore();
    const userData = store.state.userData ;

const props = defineProps({
      groupCdDisabled: Boolean
    })
const {groupCdDisabled} = props ;
isDisabled1.value = groupCdDisabled;
const emit = defineEmits(['update:storeGroup' , 'update:storeType' , 'update:storeCd', 'update:storeAreaCd', 'update:ischanged']);
const emitStoreGroup = (value) => {
    emit('update:storeGroup', value);
};

const emitStoreType = (value) => {
    emit('update:storeType', value);
};

const emitStoreCode = (value) => {
    
    emit('update:storeCd', value);
};
const emitStoreAreaCd = (value) => {
   emit('update:storeAreaCd', value);
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
  const setStoreAreaCd = (value) => {
        if ( value == 0) {
          selectedStoreAreaCd.value = '0';
          storeAreaCd.value='0';
          return  ;
        }
        storeAreaCd.value = storeAreaCd2.value.filter( item => {
            return item.lngStoreCode == value ;
        })
        console.log(storeAreaCd.value)
        // selectedStoreAreaCd.value = storeAreaCd.value[0] ? storeAreaCd.value[0].lngAreaCode : '0'
        selectedStoreAreaCd.value =  '0'
        console.log(selectedStoreAreaCd.value);
        emitStoreAreaCd(selectedStoreAreaCd.value);
  }

  const route = useRoute();
  
  watch(() => route.path, (newPath) =>{
        if (storeGroup.value.length > 0) {
        emit('update:storeGroup', storeGroup.value[0].lngStoreGroup);
        console.log(storeGroup.value[0].lngStoreGroup);
        }
      
    
  }
 
  
)
</script>

