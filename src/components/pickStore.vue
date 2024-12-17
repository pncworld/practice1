<template>
    <div class="flex justify-center md:justify-end space-x-4 text-sm mr-5  ">
     <div class="items-center font-bold hidden md:flex pl-12">매장명 : </div>
      <div>
        <select :disabled="isDisabled1"  id="storeGroup" class="hidden md:inline-block border border-gray-800 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" @change="emitStoreGroup($event.target.value)">
          <option :value="item.lngStoreGroup" v-for="item in storeGroup" :key="item.lngStoreGroup">{{ item.strName }}</option>
        </select>
      </div>
      <div v-show="hideit">
        <select :disabled="isDisabled2"  class="hidden md:inline-block border border-gray-800 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" @change="setStore($event.target.value); emitStoreType($event.target.value);">
         
          <option value="0">전체</option>
          <option :value="item.lngStoreAttr" v-for="item in storeType" :key="item.lngStoreAttr">{{ item.strName }}</option>
        </select>
      </div>
      <div class="w-full md:w-auto" v-show="hideit">
        <select :disabled="isDisabled3"  class="w-full md:w-auto border border-gray-800 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" @change="emitStoreCode($event.target.value); ischanged();">
        
          <option value="0">선택</option>
          <option :value="item.lngStoreCode" v-for="item in storeCd" :key="item.lngStoreCode">{{ item.strName }}</option>
        </select>
      </div>
    </div>
  </template>
  

<script setup>
import { defineProps , ref, watch } from 'vue';
import { useRoute } from 'vue-router';
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

const props = defineProps({
      groupCdDisabled: Boolean,
      hidesub: {
      type: Boolean,
      default: true,
     }
     
      
    })

const hideit = ref(props.hidesub)

watch(() => props.hidesub, () => {
  hideit.value = props.hidesub;
})
const {groupCdDisabled} = props ;
isDisabled1.value = groupCdDisabled;
const changed = ref(false)
const ischanged = () => {
    changed.value = !changed.value;
  
    console.log(changed.value)
    emit('update:ischanged',changed.value);
};
const emit = defineEmits(['update:storeGroup' , 'update:storeType' , 'update:storeCd' ,'update:ischanged', 'storeNm']);
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
};
   
  storeGroup.value = store.state.storeGroup;
  storeType.value = store.state.storeType;
  storeCd.value = store.state.storeCd;
  storeCd2.value = store.state.storeCd;
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

  const route = useRoute();
  
  watch(() => route.path, (newPath) =>{
        if (storeGroup.value.length > 0) {
        emit('update:storeGroup', storeGroup.value[0].lngStoreGroup);
        console.log(storeGroup.value[0].lngStoreGroup);
        }
      
    
  }
 
  
)
</script>

