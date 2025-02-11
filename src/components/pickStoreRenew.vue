<template>
    <div class="grid grid-rows-1 grid-cols-[2fr,3fr,3fr,3fr] justify-center space-x-2 text-sm items-center w-full ">
     <div class="items-center font-bold text-base flex w-20 pl-5">매장명 : </div>
      <div>
        <select :disabled="is9999" v-model="selectedGroup"  id="storeGroup" class=" border border-gray-800 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" @change="emitStoreGroup($event.target.value)" >
          <option :value="item.lngStoreGroup" v-for="item in storeGroup" :key="item.lngStoreGroup">{{ item.strName }}</option>
        </select>
      </div>
      <div>
        <select :disabled="isDisabled2"  class=" border border-gray-800 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" @change="setStore($event.target.value); emitStoreType($event.target.value);">
         
          <option value="0">전체</option>
          <option :value="item.lngStoreAttr" v-for="item in storeType" :key="item.lngStoreAttr">{{ item.strName }}</option>
        </select>
      </div>
      <div class="flex items-center">
        <input list="storeCd" id="fruits">
        <datalist id="storeCd">
 <option :value="i.lngCode" v-for="i in storeCd"> {{  i.strName }}</option>
</datalist>
      </div>
     
    </div>
</template>
  

<script setup>
import { defineProps , onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
const storeGroup = ref([]);
const storeType = ref([]);
const storeCd = ref([]);
const storeCd2 = ref([]);
const isDisabled1 = ref(false);
const isDisabled2 = ref(false);
const isDisabled3 = ref(false);
const selectedGroup = ref()
const selectedStore = ref(null);
    const store = useStore();
    const userData = store.state.userData ;

const props = defineProps({
      groupCdDisabled: Boolean,
      hidesub: {
      type: Boolean,
      default: true,
     }
     
      
    })
const is9999 = ref(store.state.userData.lngStoreGroup[0] !=='9999')
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
onMounted(() => {
  selectedGroup.value = store.state.storeGroup[0].lngStoreGroup
  emit('update:storeCd', 0);
})
// const emitStoreCode = (e) => {
//   console.log(e)
//   const selectedCd = e.target.value
//   if( value !='0' && value != undefined){
//     const selectedNm = storeCd.value.filter(item => item.lngStoreCode == value)[0].strName

//     emit('storeNm' ,selectedNm )
//     emit('update:storeCd', value);
//   } else {
//     emit('update:storeCd', value);
//   }
// };

watch(selectedStore , () => {
  if(selectedStore.value == null){
    emit('update:storeGroup', selectedGroup.value);
    emit('update:storeCd', 0);
  } else {
    emit('update:storeGroup', selectedGroup.value);
    emit('update:storeCd', selectedStore.value);
  }
})
   
  storeGroup.value = store.state.storeGroup;
  storeType.value = store.state.storeType;
  storeCd.value = store.state.storeCd;
  storeCd2.value = store.state.storeCd;

  const setStore = (value) => {
    console.log(value)
    if ( value ==0) {
        storeCd.value = storeCd2.value ;
        return storeCd.value ;
    }
    storeCd.value = storeCd2.value.filter( item => {
        return item.lngStoreAttr == value ;
    })
    selectedStore.value = 0
  }

  const route = useRoute();
  
  watch(() => route.path, (newPath) =>{
        if (storeGroup.value.length > 0) {
          selectedGroup.value = storeGroup.value[0].lngStoreGroup
        emit('update:storeGroup', storeGroup.value[0].lngStoreGroup);
        
        console.log(storeGroup.value[0].lngStoreGroup);
        }
      
    
  }
 
  
)

const handleClear = (e) => {
  selectedStore.value = 0
}
</script>

<style>
.custom-select .vs__dropdown-toggle {
  border: 1px solid #d1d5db !important; /* 전체 테두리 */
  border-radius: 0.375rem !important; /* Tailwind rounded-md */
  background-color: #ffffff !important; /* 흰색 배경 */
  display: flex;
  align-items: center; /* 텍스트 중앙 정렬 */
  height: 40px !important; /* 높이 조정 */
  padding: 6px 12px !important; /* 내부 간격 */
}

/* 선택된 값 및 플레이스홀더 스타일 */
.custom-select .vs__selected {
  font-size: 14px !important;
  color: #374151 !important; /* Tailwind text-gray-700 */
  display: flex;
  justify-content: left !important;
  align-items: center;
  height: 100% !important;

  min-width : 110% !important;
  padding-top: 14px !important; /* 텍스트를 좀 더 아래로 이동 */
  
  overflow: hidden !important;
}

/* 플레이스홀더 및 입력 필드 조정 */
.custom-select .vs__search {
  height: 100%;
  padding: 1px 0 !important; /* 입력 필드가 너무 위쪽에 올라가지 않도록 조정 */
  margin: 0 !important;
}

/* 드롭다운 리스트 스타일 */
.custom-select .vs__dropdown-menu {
  z-index: 1000 !important; /* 다른 요소보다 위에 표시 */
  background: white;
  border-radius: 0.375rem;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 14px !important;
  padding-top: 1px !important;

}

/* 포커스 상태 스타일 */
.custom-select .vs__dropdown-toggle:focus {
  border: 2px solid #3b82f6 !important; /* Tailwind focus:ring-blue-500 */
  outline: none !important;
}

</style>

