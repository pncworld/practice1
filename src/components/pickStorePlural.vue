<template>
    <div class="grid grid-cols-[1fr,2fr,2fr,2fr] grid-rows-2 h-16 w-[770px]">
        <div><label for="searchType1" class="text-base">직/가맹<input type="radio" id="searchType1" value="1" v-model="settingDisable"></label></div>
        <div><select name="" id="" v-model="selectedStoreGroup" :disabled="settingDisable ==2" class="mr-5 w-56 h-7 rounded-lg">
            <option :value="i.lngStoreGroup" v-for="i in storeGroup">{{ i.strName }}</option>
        </select></div>
        <div><select name="" id=""  v-model="selectedStoreType" :disabled="settingDisable ==2" class="w-56 h-7 rounded-lg mr-5">
            <option :value="0" >전체</option>
            <option :value="i.lngStoreAttr" v-for="i in storeType">{{ i.strName }}</option>
        </select></div>
        <div class="w-44">
            <div class="grid grid-rows-1 grid-cols-[6fr,1fr] w-44">
                <div >
                    <input type="button" class="bg-white border w-48 h-7 rounded-lg disabled:bg-gray-100 text-center overflow-hidden" @click="showStoreList" :disabled="settingDisable ==2" v-model="selectedStoreList"></div>
              <div ><button class="bg-blue-700 w-4 h-7 rounded-md" v-show="showStore" @click="showStoreList"><img src="../assets/white_arrow_up.png" alt="" class="w-32 bg-white" ></button></div>
            </div>
            <div class="z-30 absolute mt-9 bg-gray-200 w-[40%] h-8 right-5 " v-if="showStore">
                <div class="font-medium  w-[90%] flex items-center justify-start ml-5 space-x-4">
                    <div class="text-center">매장명 : <input type="text" class="border ml-5 pl-2 rounded-lg" v-model="searchWord" @input="searchword">
                    </div>
                    <div class="text-center bg-black border rounded-lg p-1"><button class="text-white" @click="showOnlyChecked">선택매장확인</button></div>
                    <div class="text-center bg-black border rounded-lg p-1"><button class="text-white" @click="resetChecked">초기화</button></div>
                </div>
            </div>
            <Realgrid v-if="showStore" class="!w-[40%] !h-[30%] z-30 absolute mt-16 right-5" :progname="'PICKSTOREPLURAL_VUE'" :progid="1" :rowData="rowData" :setStateBar="false" @checkedRowData="checkedRowData" @selcetedrowData="selcetedrowData" :searchWord="searchWord"  :searchColId="'strName'" @updatedRowData="updatedRowData" :labelsData="labelsData" :valuesData="valuesData" :labelingColumns="labelingColumns" :showOnlyChecked="showOnlycheck"></Realgrid>
        </div>
        <div><label for="searchType2" class="text-base ml-2">팀/SC<input type="radio" id="searchType2" value="2" v-model="settingDisable"></label></div>
        <div class="w-48"><select name="" id="" v-model="selectedStoreGroup2" class="w-full mr-10  h-7 rounded-lg" :disabled="settingDisable ==1"  >
            <option :value="i.lngStoreGroup" v-for="i in storeGroup">{{ i.strName }}</option>
        </select></div>
        <div ><div class="grid grid-rows-1 grid-cols-2 ">
            <div class="-ml-8"><select name="" id="" v-model="selectedStoreTeam" class="w-full h-7 rounded-lg" :disabled="settingDisable ==1"  >
                <option :value="0" >전체</option>
            <option :value="i.lngTeamCode" v-for="i in storeTeam">{{ i.strTeamName }}</option>
        </select></div>
        <div ><select name="" id="" v-model="selectedSuperVisor" class="w-32 h-7 rounded-lg ml-2" :disabled="settingDisable ==1" >
            <option :value="-1" >전체</option>
            <option :value="i.lngSupervisor" v-for="i in storeSuperVisor">{{ i.strName }}</option>
        </select></div>
    </div>
    </div>
    <div>
        <!-- <button class="bg-white border w-[60%] ml-4 rounded-lg h-7 disabled:bg-gray-100"  @click="showStoreList" >전체</button> -->
        <input type="button" class="bg-white border w-44 ml-4 rounded-lg h-7 disabled:bg-gray-100 text-center overflow-hidden" @click="showStoreList" :disabled="settingDisable ==1" v-model="selectedStoreList">  
    </div>
    </div>
</template>

<script setup>
import { onMounted, ref, toRef, watch } from 'vue';
import { useStore } from 'vuex';
import Realgrid from './realgrid.vue';

const store = useStore();
const teamscList = ref('전체')
const selectedStoreList = ref('전체')
const storeGroup = ref([]);
const storeType = ref([]);
const storeTeam = ref([]);
const settingDisable = ref(1);
const storeSuperVisor = ref([]);
const selectedStoreGroup = ref(store.state.storeGroup[0].lngStoreGroup)
const selectedStoreGroup2 = ref(store.state.storeGroup[0].lngStoreGroup)
const selectedStoreType = ref(0)
const selectedStoreTeam = ref(0)
const selectedSuperVisor = ref(-1)
const emit = defineEmits(['lngStoreGroups','lngStoreCodes','lngStoreAttrs','lngStoreGroup','excelStore']);
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
    console.log(store.state.storeType)
    storeTeam.value = store.state.storeTeamCode
    storeSuperVisor.value = store.state.storeSupervisor
    rowData.value = store.state.storeCd
    emit('lngStoreGroup' ,store.state.storeGroup[0].lngStoreGroup)
    emit('excelStore' ,'매장명 : 전체')

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
        storeSuperVisor.value = store.state.storeSupervisor
    } else {
        rowData.value = store.state.storeCd.filter(item => item.lngTeamCode == selectedStoreTeam.value)
        storeSuperVisor.value = store.state.storeSupervisor.filter(item => item.lngTeamCode == selectedStoreTeam.value)
    }
    selectedSuperVisor.value = -1 ;

    console.log(storeSuperVisor.value)

    console.log(selectedStoreTeam.value)
  
   
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
const sendStoreAttrs = ref([])
const selectedStores = ref([])
const checkedRowData = (e) => {
    sendStoreGroups.value =  rowData.value.filter(item => item.checkbox == true).map(item => item.lngStoreGroup)
    sendStoreCodes.value = rowData.value.filter(item => item.checkbox == true).map(item => item.lngStoreCode)
    sendStoreAttrs.value = rowData.value.filter(item => item.checkbox == true).map(item => item.lngStoreAttr)
    selectedStores.value = rowData.value.filter(item => item.checkbox == true).map(item => item.strName)
    if(settingDisable.value == 1) {
        teamscList.value = '전체'
        if(selectedStores.value.length > 1){
            selectedStoreList.value = selectedStores.value[0] + ' 외' + (selectedStores.value.length -1) + '건'
        } else if ( selectedStores.value.length == 1) {
            selectedStoreList.value = selectedStores.value
        } else {
            selectedStoreList.value = '전체'
        }
        emit('excelStore' ,'매장명 : '+ selectedStoreList.value)
    } else {
        selectedStoreList.value = '전체'
        if(selectedStores.value.length > 1){
            teamscList.value = selectedStores.value[0] + ' 외' + (selectedStores.value.length -1) + '건'
        } else if ( selectedStores.value.length == 1) {
            teamscList.value = selectedStores.value
        } else {
            teamscList.value = '전체'
        }

        emit('excelStore' ,'매장명 : '+ teamscList.value)
    }
    emit('lngStoreGroups', sendStoreGroups.value)
    emit('lngStoreCodes' , sendStoreCodes.value)
    emit('lngStoreAttrs' , sendStoreAttrs.value)
}
const searchword = (e) => {
    searchWord.value = e.target.value
}

const updatedRowData = (e) => {
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

const resetChecked = () => {
    rowData.value.forEach(item => item.checkbox = false)
    rowData.value = [...rowData.value]

    emit('lngStoreGroup', store.state.storeGroup[0].lngStoreGroup)
    emit('lngStoreCodes' , [])
    emit('lngStoreAttrs' , 0)
    selectedStoreList.value = '전체'
}
const showOnlycheck = ref(false)
const showOnlyChecked = () => {
    showOnlycheck.value = !showOnlycheck.value
}


</script>

