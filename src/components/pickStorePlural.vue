<template>
    <div class="grid grid-cols-[1fr,2fr,2fr,2fr] grid-rows-2 h-16">
        <div><label for="searchType1" class="text-base">직/가맹<input type="radio" id="searchType1" value="1" v-model="settingDisable"></label></div>
        <div><select name="" id="" v-model="selectedStoreGroup" :disabled="settingDisable ==2" class="mr-5 w-[95%] h-7 rounded-lg">
            <option :value="i.lngStoreGroup" v-for="i in storeGroup">{{ i.strName }}</option>
        </select></div>
        <div><select name="" id=""  v-model="selectedStoreType" :disabled="settingDisable ==2" class="w-[95%] h-7 rounded-lg">
            <option :value="0" >전체</option>
            <option :value="i.lngStoreAttr" v-for="i in storeType">{{ i.strName }}</option>
        </select></div>
        <div>
            <div class="grid grid-rows-1 grid-cols-[6fr,1fr]">
                <div><button class="bg-white border w-[95%] h-7 rounded-lg disabled:bg-gray-100" @click="showStoreList" :disabled="settingDisable ==2" >전체</button></div>
              <div><button class="bg-blue-600 w-4 h-7 rounded-md" v-show="showStore" @click="showStoreList"><img src="../assets/arrowupwhite.png" alt="" ></button></div>
            </div>
            <div class="z-30 absolute mt-9 bg-gray-200 w-[30%] h-8 right-5 " v-if="showStore"><div class="font-medium  w-[50%] flex items-center justify-start ml-5"><div>매장명 : <input type="text" class="border ml-5 pl-2 rounded-lg" v-model="searchWord" @input="searchword"></div></div></div>
            <Realgrid v-if="showStore" class="!w-[30%] !h-[30%] z-30 absolute mt-16 right-5" :progname="'PICKSTOREPLURAL_VUE'" :progid="1" :rowData="rowData" :setStateBar="false" @checkedRowData="checkedRowData" @selcetedrowData="selcetedrowData" :searchWord="searchWord"  :searchColId="'strName'" @updatedRowData="updatedRowData" :labelsData="labelsData" :valuesData="valuesData" :labelingColumns="labelingColumns"></Realgrid>
        </div>
        <div><label for="searchType2" class="text-base ml-2">팀/SC<input type="radio" id="searchType2" value="2" v-model="settingDisable"></label></div>
        <div class="w-[80%]"><select name="" id="" v-model="selectedStoreGroup2" class="w-full mr-10  h-7 rounded-lg" :disabled="settingDisable ==1"  >
            <option :value="i.lngStoreGroup" v-for="i in storeGroup">{{ i.strName }}</option>
        </select></div>
        <div><div class="grid grid-rows-1 grid-cols-2">
            <div class="-ml-8"><select name="" id="" v-model="selectedStoreTeam" class="w-full h-7 rounded-lg" :disabled="settingDisable ==1"  >
                <option :value="0" >전체</option>
            <option :value="i.lngTeamCode" v-for="i in storeTeam">{{ i.strTeamName }}</option>
        </select></div>
        <div><select name="" id="" v-model="selectedSuperVisor" class="w-[130%] h-7 rounded-lg ml-2" :disabled="settingDisable ==1" >
            <option :value="-1" >전체</option>
            <option :value="i.lngSupervisor" v-for="i in storeSuperVisor">{{ i.strName }}</option>
        </select></div>
    </div>
    </div>
    <div>
        <button class="bg-white border w-[60%] ml-4 rounded-lg h-7 disabled:bg-gray-100" :disabled="settingDisable ==1" @click="showStoreList" >전체</button>  
    </div>
    </div>
</template>

<script setup>
import { onMounted, ref, toRef, watch } from 'vue';
import { useStore } from 'vuex';
import Realgrid from './realgrid.vue';

const store = useStore();
const storeGroup = ref([]);
const storeType = ref([]);
const storeTeam = ref([]);
const settingDisable = ref(1);
const storeSuperVisor = ref([]);
const selectedStoreGroup = ref(store.state.storeGroup[0].lngStoreGroup)
const selectedStoreGroup2 = ref(store.state.storeGroup[0].lngStoreGroup)
const selectedStoreType = ref(0)
const selectedStoreTeam = ref(0)
const selectedSuperVisor = ref(0)
const emit = defineEmits(['lngStoreGroups','lngStoreCodes']);
const props = defineProps({
  initCheckBox: {
    type: Boolean,
    default: false,
  },
  initSearchWord: {
    type: Boolean,
    default: false,
  },
})
const searchWord = ref('')
const rowData = ref([])
const labelingColumns = ref('lngStoreGroup,lngStoreAttr,lngTeamCode,lngSupervisor') 
const valuesData = ref([])
const labelsData = ref([])
onMounted(() => {
  
    storeGroup.value = store.state.storeGroup
    storeType.value = store.state.storeType
    storeTeam.value = store.state.storeTeamCode
    storeSuperVisor.value = store.state.storeSupervisor
    rowData.value = store.state.storeCd
   
    labelsData.value.push(store.state.storeGroup.map(item => item.strName))
    valuesData.value.push(store.state.storeGroup.map(item => item.lngStoreGroup))

    labelsData.value.push(store.state.storeType.map(item => item.strName))
    valuesData.value.push(store.state.storeType.map(item => item.lngStoreAttr))

    labelsData.value.push(store.state.storeTeamCode.map(item => item.strTeamName))
    valuesData.value.push(store.state.storeTeamCode.map(item => item.lngTeamCode))

    labelsData.value.push(store.state.storeSupervisor.map(item => item.strName))
    valuesData.value.push(store.state.storeSupervisor.map(item => item.lngSupervisor))

  
   
})

watch(selectedStoreType , (newValue) => {
    if(selectedStoreType.value == 0){
        rowData.value = store.state.storeCd
    } else {
        rowData.value = store.state.storeCd.filter(item => item.lngStoreAttr == selectedStoreType.value)
    }
    console.log(rowData.value)
})

watch(selectedStoreTeam, (newValue) => {
    if(selectedStoreTeam.value == 0){
        rowData.value = store.state.storeCd
    } else {
        rowData.value = store.state.storeCd.filter(item => item.lngTeamCode == selectedStoreTeam.value)
    }
    selectedSuperVisor.value = -1 ;
})

watch(selectedSuperVisor, (newValue) => {
    if(selectedSuperVisor.value == -1){
        if(selectedStoreTeam.value ==0){
            rowData.value = store.state.storeCd
        } else {
            rowData.value = store.state.storeCd.filter(item => item.lngTeamCode == selectedStoreTeam.value)
        }
    } else {
        if(selectedStoreTeam.value ==0){
            rowData.value = store.state.storeCd.filter(item => item.lngSupervisor == selectedSuperVisor.value)
        } else {
            rowData.value = store.state.storeCd.filter(item => item.lngTeamCode == selectedStoreTeam.value).filter(item => item.lngSupervisor == selectedSuperVisor.value)
        }
     
    }
})


const showStore = ref(false)
const showStoreList = () => {
    showStore.value = !showStore.value
}

const sendStoreGroups = ref([])
const sendStoreCodes = ref([])
const checkedRowData = (e) => {
    sendStoreGroups.value =  rowData.value.filter(item => item.checkbox == true).map(item => item.lngStoreGroup)
    sendStoreCodes.value = rowData.value.filter(item => item.checkbox == true).map(item => item.lngStoreCode)

   
    emit('lngStoreGroups', sendStoreGroups.value)
    emit('lngStoreCodes' , sendStoreCodes.value)
}
const searchword = (e) => {
    searchWord.value = e.target.value
}

const updatedRowData = (e) => {
    console.log(e)
    const storecodes = e.map(item => item.lngStoreCode)
    const checkeds = e.map(item => item.checkbox)
    for(var i=0 ; i < storecodes.length ; i++){
       const change =  rowData.value.find(item => item.lngStoreCode == storecodes[i])
       change.checkbox = checkeds[i]
    }
   
}
const initCheckBoxRef = toRef(props, 'initCheckBox') 
const initSearchWord = toRef(props, 'initCheckBox') 
watch( initCheckBoxRef , () => {
    rowData.value.forEach(item => item.checkbox = false)
    rowData.value = [...rowData.value]
})
watch( initSearchWord , () => {
    searchWord.value = ''
})


</script>

