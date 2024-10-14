<template>
    <div class="flex justify-end space-x-4 w-9/12 text-xs ">
      <div class="flex flex-col items-center justify-center">
      <label for="type1" class="flex items-center mb-2 pt-4 ">
        <input type="radio" name="type" id="type1" class="mr-2 -ml-7" value="1" v-model="firstRadiobutton"  @change="radioClick"> 직/가맹
      </label>
     <label for="type2" class="flex items-center pt-4">
       <input type="radio" name="type" id="type2" class="mr-2 -ml-7" value="2" v-model="firstRadiobutton" @change="radioClick"> 팀/SC
     </label>
     
      </div>
      <div class="flex justify-center space-x-2 w-8/12">
      <div>
        <select :disabled="true"  id="storeGroup" class="mt-2 border w-40 border-gray-800 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" @change="emitStoreGroup($event.target.value)">
          <option :value="item.lngStoreGroup" v-for="item in storeGroup" :key="item.lngStoreGroup">{{ item.strName }}</option>
        </select>
       
        <select :disabled="true"   id="storeGroup" class="mt-2 w-32 -ml-8 border border-gray-800 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" @change="emitStoreGroup($event.target.value)">
          <option :value="item.lngStoreGroup" v-for="item in storeGroup" :key="item.lngStoreGroup">{{ item.strName }}</option>
        </select>
      </div>
      <div>
        
        <select :disabled="isDisabled1"  class="mt-2  border border-gray-800 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" @change="emitStoreType($event.target.value);">
         
          <option value="0">전체</option>
          <option :value="item.lngStoreAttr" v-for="item in storeType" :key="item.lngStoreAttr">{{ item.strName }}</option>
        </select>

        <select :disabled="isDisabled2"  id="storeTeamCode" class="mt-2 w-32 -ml-10 border border-gray-800 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" @change="emitStoreGroup($event.target.value); setSuperVisor($event.target.value)">
          <option :value="item.lngTeamCode" v-for="item in storeTeamCode" :key="item.lngTeamCode">{{ item.strTeamName }}</option>
        </select>
      </div>
      <div>
       
        <select :disabled="isDisabled1" id="updatedStoreName1" class="mt-2 border w-64 border-gray-800 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" @mousedown.prevent="showStoreGrid">
          
          <option value="0" v-if="!updated">선택</option>
          <option value="1" v-if="updated">{{storeName}}</option>
          
        </select>

        <select :disabled="isDisabled2"  id="storeSupervisor" class="mt-2 w-32 relative right-3 border border-gray-800 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" @change="emitsuperVisor($event.target.value)">
          <option value="0">전체</option>
          <option :value="item.lngSupervisor" v-for="item in storeSupervisor2" :key="item.lngSupervisor">{{ item.strName }}</option>
        </select>

        <select :disabled="isDisabled2" id="updatedStoreName2"  class="mt-2 w-32 relative right-0 border border-gray-800 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"  @mousedown.prevent="showStoreGrid">
          <option :value="0" v-if="!updated">전체</option>
          <option value="1" v-if="updated">{{storeName}}</option>
        </select>

      
      </div>
      
      
    </div>
    <div class="absolute flex justify-end items-center z-10 right-4 top-64 " v-show="openStoreGrid"><PickStoreGrid :storeType="storeType2" :radioSelect="radioSelect" :storeSupervisor="storeSupervisor3" @storeCd="searchStoreCd" @storeName="updatedstoreName"></PickStoreGrid></div>
      
  </div>
  
  </template>
  

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import PickStoreGrid from './pickStoreGrid.vue';
const storeGroup = ref([]);
const storeType = ref([]);
const storeType2 = ref('');
const storeCd = ref([]);
const storeTeamCode = ref([]);
const storeSupervisor = ref([]);
const storeSupervisor2 = ref([]);
const storeSupervisor3 = ref();
const storeCd2 = ref([]);
const isDisabled1 = ref(false);
const isDisabled2 = ref(true);
const radioSelect = ref(false);
const openStoreGrid = ref(false);
const firstRadiobutton = ref("1");
const store = useStore();
const storeName = ref('');
const emit = defineEmits(['storeCd']);
const props = defineProps({
  afterSearch : {
    type : Boolean
  }
});

watch(
  () => props.afterSearch,
  (newValue, oldValue) => {
    if(newValue) {
      openStoreGrid.value = false 
    } else {
      openStoreGrid.value = true;
    }
  }
);
const emitStoreGroup = (value) => {
    emit('update:storeGroup', value);
};

const emitStoreType = (newvalue) => {
    //emit('update:storeType', value);
    storeType2.value = newvalue 
};

const emitsuperVisor = (newvalue) => {
   //emit('update:storeSupervisor', value);
   storeSupervisor3.value = newvalue
  
};
  function showStoreGrid() {
    openStoreGrid.value = !openStoreGrid.value ;
  }

  function radioClick() {
    if(firstRadiobutton.value == '1') {
      isDisabled2.value = true;
      isDisabled1.value = false;
      radioSelect.value = false;
    } else {
      isDisabled2.value = false;
      isDisabled1.value = true;
      radioSelect.value = true ;
    }
  }

  storeGroup.value = store.state.storeGroup;
  storeType.value = store.state.storeType;
  storeCd.value = store.state.storeCd;
  storeTeamCode.value = store.state.storeTeamCode;
  storeSupervisor.value = store.state.storeSupervisor;
  storeSupervisor2.value = store.state.storeSupervisor;
  storeCd2.value = store.state.storeCd;
  
  
  const route = useRoute();
  
  watch(() => route.path, (newPath) =>{
        if (storeGroup.value.length > 0) {
        emit('update:storeGroup', storeGroup.value[0].lngStoreGroup);
      
        }
      
    
  })

  const setSuperVisor = (newvalue) => {
    storeSupervisor2.value = storeSupervisor.value.filter( item => {
        return item.lngTeamCode == newvalue ;
    })
  }

  const searchStoreCd = (selectedStoreCode) => {
      emit('storeCd' , selectedStoreCode)
  }
  const updated = ref(false)
  const updatedstoreName = (newname) => {
  
     if (newname == undefined ){
       updated.value = false ;
       return;
     }
     updated.value = true ;
     console.log(newname)
     storeName.value = newname;
  }
  
 
  

</script>

