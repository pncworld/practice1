<template>
    <div class="grid grid-cols-[1fr,2fr,2fr,2fr] grid-rows-2 h-16 w-[770px]">
        <div><label for="searchType1" class="text-base" :disabled="disabled1">직/가맹<input type="radio" id="searchType1"
                    value="1" v-model="settingDisable" :disabled="disabled1"></label></div>
        <div><select name="" id="" v-model="selectedStoreGroup" :disabled="true"
                class="mr-2 w-56 h-7 rounded-lg">
                <option :value="i.lngStoreGroup" v-for="i in storeGroup">{{ i.strName }}</option>
            </select></div>
        <div><select name="" id="" v-model="selectedStoreType" :disabled="settingDisable == 2 || disabled1"
                class="w-56 h-7 rounded-lg mr-2" @change="selectstoreType">
                <option :value="0">전체</option>
                <option :value="i.lngStoreAttr" v-for="i in storeType">{{ i.strName }}</option>
            </select></div>
        <div class="w-44">
            <div class="grid grid-rows-1 grid-cols-[6fr,1fr] w-44">
                <div>
                    <input type="button"
                        class="bg-white border w-48 h-7 rounded-lg disabled:bg-gray-100 text-center overflow-hidden"
                        @click="showStoreList" :disabled="settingDisable == 2 || disabled1" v-model="selectedStoreList">
                </div>
                <div><button class="bg-blue-700 w-4 h-7 rounded-md" v-show="showStore" @click="showStoreList"><img
                            src="../assets/white_arrow_up.png" alt="" class="w-32 bg-white"></button></div>
            </div>
            <div class="z-30 absolute mt-9 bg-gray-200 w-[40%] h-8 right-5 " v-if="showStore">
                <div class="font-medium  w-[90%] flex items-center justify-start ml-5 space-x-4">
                    <div class="text-center">매장명 : <input type="text" class="border ml-5 pl-2 rounded-lg"
                            v-model="searchWord" @input="searchword">
                    </div>
                    <div class="text-center bg-black border rounded-lg p-1"><button class="text-white"
                            @click="showOnlyChecked">선택매장확인</button></div>
                    <div class="text-center bg-black border rounded-lg p-1"><button class="text-white"
                            @click="resetChecked">초기화</button></div>
                </div>
            </div>
            <Realgrid v-if="showStore" class="!w-[40%] !h-[30%] z-30 absolute mt-16 right-5"
                :progname="'PICKSTOREPLURAL_VUE'" :progid="1" :rowData="rowData" :setStateBar="false"
                @checkedRowData="checkedRowData" @selcetedrowData="selcetedrowData" :searchWord="searchWord"
                :searchColId="'strName'" @updatedRowData="updatedRowData" :labelsData="labelsData"
                :valuesData="valuesData" :labelingColumns="labelingColumns" :showOnlyChecked="showOnlycheck"></Realgrid>
        </div>
        <div><label for="searchType2" class="text-base ml-2" :disabled="disabled1">팀/SC<input type="radio"
                    id="searchType2" value="2" v-model="settingDisable" :disabled="disabled1"></label></div>
        <div class="w-48"><select name="" id="" v-model="selectedStoreGroup2" class="w-full mr-10  h-7 rounded-lg"
                :disabled="true">
                <option :value="i.lngStoreGroup" v-for="i in storeGroup">{{ i.strName }}</option>
            </select></div>
        <div>
            <div class="grid grid-rows-1 grid-cols-2 ">
                <div class="-ml-8"><select name="" id="" v-model="selectedStoreTeam" class="w-full h-7 rounded-lg"
                        :disabled="settingDisable == 1 || disabled1" @change="selectstoreteam">
                        <option :value="0">전체</option>
                        <option :value="i.lngTeamCode" v-for="i in storeTeam">{{ i.strTeamName }}</option>
                    </select></div>
                <div><select name="" id="" v-model="selectedSuperVisor" class="w-32 h-7 rounded-lg ml-2"
                        :disabled="settingDisable == 1 || disabled1" @change="selectsupervisor">
                        <option :value="0">전체</option>
                        <option :value="i.lngSupervisor" v-for="i in storeSuperVisor">{{ i.strName }}</option>
                    </select></div>
            </div>
        </div>
        <div class="ml-5 pr-10 w-[200px]">
            <input type="button"
                class="bg-white border w-full ml-4 rounded-lg h-7 disabled:bg-gray-100 text-center overflow-hidden mr-5"
                @click="showStoreList" :disabled="settingDisable == 1 || disabled1" v-model="selectedStoreList">
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
const selectedStoreGroup = ref(store.state.storeGroup?.[0]?.lngStoreGroup || null)
const selectedStoreGroup2 = ref(store.state.storeGroup?.[0]?.lngStoreGroup || null)
const selectedStoreType = ref(0)
const selectedStoreTeam = ref(0)
const selectedSuperVisor = ref(0)
const disabled1 = ref(false)
const emit = defineEmits(['lngStoreGroups', 'lngStoreCodes', 'lngStoreAttrs', 'lngStoreGroup', 'excelStore', 'lngStoreAttr', 'lngStoreTeam', 'lngSupervisor']);
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
const initCheck = ref(false)
onMounted(() => {

    storeGroup.value = store.state.storeGroup
    storeType.value = store.state.storeType
    console.log(store.state.storeType)
    storeTeam.value = store.state.storeTeamCode
    storeSuperVisor.value = store.state.storeSupervisor
    rowData.value = store.state.storeCd

    if (store.state.userData.blnBrandAdmin == 'True' || store.state.userData.lngPositionType == '1') {
        disabled1.value = false
        emit('lngStoreGroup', store.state.storeGroup[0].lngStoreGroup)

        emit('lngStoreCodes', store.state.storeCd.map(item => item.lngStoreCode).join(','))
        console.log(store.state.storeCd)

        emit('lngStoreAttrs', 0)
        emit('lngSupervisor', 0)
        emit('lngStoreTeam', 0)
        emit('excelStore', '매장명 : 전체')
    } else {
        disabled1.value = true
        emit('lngStoreGroup', store.state.userData.lngStoreGroup)
        emit('lngStoreCodes', store.state.userData.lngPosition)
        emit('lngStoreAttrs', store.state.userData.lngJoinType)
        emit('lngSupervisor', store.state.userData.lngSupervisor)
        emit('lngStoreTeam', store.state.userData.lngTeamCode)
        emit('excelStore', '매장명 : ' + store.state.userData.strStoreName)
        selectedStoreType.value = store.state.userData.lngJoinType
        selectedStoreList.value = store.state.userData.strStoreName
        selectedStoreTeam.value = store.state.userData.lngTeamCode
        selectedSuperVisor.value = store.state.userData.lngSupervisor
    }

    labelsData.value.push(store.state.storeGroup.map(item => item.strName))
    valuesData.value.push(store.state.storeGroup.map(item => item.lngStoreGroup))

    labelsData.value.push(store.state.storeType.map(item => item.strName))
    valuesData.value.push(store.state.storeType.map(item => item.lngStoreAttr))

    labelsData.value.push(store.state.storeTeamCode.map(item => item.strTeamName))
    valuesData.value.push(store.state.storeTeamCode.map(item => item.lngTeamCode))

    labelsData.value.push(store.state.storeSupervisor.map(item => item.strName))
    valuesData.value.push(store.state.storeSupervisor.map(item => item.lngSupervisor))
    initCheck.value = !initCheck.value


})

watch(selectedStoreType, (newValue) => {
    // if(selectedStoreType.value == 0){
    //     rowData.value = store.state.storeCd
    //     emit('lngStoreCodes' ,store.state.storeCd.map(item => item.lngStoreCode).join(','))
    // } else {
    //     rowData.value = store.state.storeCd.filter(item => item.lngStoreAttr == selectedStoreType.value)
    //     //sendStoreCodes.value = rowData.value.filter(item => item.checkbox == true).map(item => item.lngStoreCode)
    //     emit('lngStoreCodes' ,store.state.storeCd.filter(item => item.lngStoreAttr == selectedStoreType.value).map(item => item.lngStoreCode).join(','))
    // }

    // emit('lngStoreAttr',selectedStoreType.value)
    // emit('lngStoreAttrs',selectedStoreType.value)
    // emit('excelStore' ,'매장명 : 전체')
    // initCheck.value = !initCheck.value
    // selectedStoreList.value = '전체'
})

const selectstoreType = (e) => {
    if (selectedStoreType.value == 0) {
        rowData.value = store.state.storeCd
        emit('lngStoreCodes', store.state.storeCd.map(item => item.lngStoreCode).join(','))
    } else {
        rowData.value = store.state.storeCd.filter(item => item.lngStoreAttr == selectedStoreType.value)
        //sendStoreCodes.value = rowData.value.filter(item => item.checkbox == true).map(item => item.lngStoreCode)
        emit('lngStoreCodes', store.state.storeCd.filter(item => item.lngStoreAttr == selectedStoreType.value).map(item => item.lngStoreCode).join(','))
    }

    emit('lngStoreAttr', selectedStoreType.value)
    emit('lngStoreAttrs', selectedStoreType.value)
    emit('excelStore', '매장명 : 전체')
    initCheck.value = !initCheck.value
    selectedStoreList.value = '전체'
}
const selectstoreteam = (e) => {
    if (selectedStoreTeam.value == 0) {
        rowData.value = store.state.storeCd
        storeSuperVisor.value = store.state.storeSupervisor
        emit('lngStoreCodes', store.state.storeCd.map(item => item.lngStoreCode).join(','))
    } else {
        rowData.value = store.state.storeCd.filter(item => item.lngTeamCode == selectedStoreTeam.value)
        storeSuperVisor.value = store.state.storeSupervisor.filter(item => item.lngTeamCode == selectedStoreTeam.value)
        emit('lngStoreCodes', store.state.storeCd.filter(item => item.lngTeamCode == selectedStoreTeam.value).map(item => item.lngStoreCode).join(','))
    }
    selectedSuperVisor.value = 0;

    initCheck.value = !initCheck.value
    emit('lngStoreTeam', selectedStoreTeam.value)
    emit('excelStore', '매장명 : 전체')
    selectedStoreList.value = '전체'
}
watch(selectedStoreTeam, (newValue) => {

})
const selectsupervisor = (e) => {
    if (selectedSuperVisor.value == 0) {
        if (selectedStoreTeam.value == 0) {
            rowData.value = store.state.storeCd
            emit('lngStoreCodes', store.state.storeCd.map(item => item.lngStoreCode).join(','))
        } else {
            rowData.value = store.state.storeCd.filter(item => item.lngTeamCode == selectedStoreTeam.value)
            emit('lngStoreCodes', store.state.storeCd.filter(item => item.lngTeamCode == selectedStoreTeam.value).map(item => item.lngStoreCode).join(','))
        }
    } else {
        if (selectedStoreTeam.value == 0) {
            rowData.value = store.state.storeCd.filter(item => item.lngSupervisor == selectedSuperVisor.value)
            emit('lngStoreCodes', store.state.storeCd.filter(item => item.lngSupervisor == selectedSuperVisor.value).map(item => item.lngStoreCode).join(','))
        } else {
            rowData.value = store.state.storeCd.filter(item => item.lngTeamCode == selectedStoreTeam.value).filter(item => item.lngSupervisor == selectedSuperVisor.value)
            emit('lngStoreCodes', store.state.storeCd.filter(item => item.lngTeamCode == selectedStoreTeam.value).filter(item => item.lngSupervisor == selectedSuperVisor.value).map(item => item.lngStoreCode).join(','))
        }

    }
    initCheck.value = !initCheck.value
    const sendSupervisor = selectedSuperVisor.value 
    emit('lngSupervisor', sendSupervisor)
    emit('excelStore', '매장명 : 전체')
    selectedStoreList.value = '전체'
}
watch(selectedSuperVisor, (newValue) => {

})

watch(settingDisable, () => {
    if (settingDisable.value == 1) {
        selectedSuperVisor.value = 0
        selectedStoreTeam.value = 0
    } else {
        selectedStoreType.value = 0
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
    sendStoreGroups.value = rowData.value.filter(item => item.checkbox == true).map(item => item.lngStoreGroup)
    sendStoreCodes.value = rowData.value.filter(item => item.checkbox == true).map(item => item.lngStoreCode)
    sendStoreAttrs.value = rowData.value.filter(item => item.checkbox == true).map(item => item.lngStoreAttr)
    selectedStores.value = rowData.value.filter(item => item.checkbox == true).map(item => item.strName)
    if (settingDisable.value == 1) {
        teamscList.value = '전체'
        if (selectedStores.value.length > 1) {
            selectedStoreList.value = selectedStores.value[0] + ' 외' + (selectedStores.value.length - 1) + '건'
        } else if (selectedStores.value.length == 1) {
            selectedStoreList.value = selectedStores.value
        } else {
            selectedStoreList.value = '전체'
        }
        emit('excelStore', '매장명 : ' + selectedStoreList.value)
    } else {
        selectedStoreList.value = '전체'
        if (selectedStores.value.length > 1) {
            selectedStoreList.value = selectedStores.value[0] + ' 외' + (selectedStores.value.length - 1) + '건'
        } else if (selectedStores.value.length == 1) {
            selectedStoreList.value = selectedStores.value
        } else {
            selectedStoreList.value = '전체'
        }
        emit('excelStore', '매장명 : ' + selectedStoreList.value)
    }
    emit('lngStoreGroups', sendStoreGroups.value)
    if (sendStoreCodes.value.length == 0) {
        let senditem = rowData.value.map(item => item.lngStoreCode).join(',')
        emit('lngStoreCodes', senditem)
    } else {
        emit('lngStoreCodes', sendStoreCodes.value.join(','))
    }

    emit('lngStoreAttrs', selectedStoreType.value)
    const sendSupervisor = selectedSuperVisor.value 
    emit('lngSupervisor', sendSupervisor)
    emit('lngStoreTeam', selectedStoreTeam.value)
}
const searchword = (e) => {
    searchWord.value = e.target.value
}

const updatedRowData = (e) => {
    const storecodes = e.map(item => item.lngStoreCode)
    const checkeds = e.map(item => item.checkbox)
    for (var i = 0; i < storecodes.length; i++) {
        const change = rowData.value.find(item => item.lngStoreCode == storecodes[i])
        change.checkbox = checkeds[i]
    }

}
const initCheckBoxRef = toRef(props, 'initCheckBox')
const initSearchWord = toRef(props, 'initCheckBox')
watch(initCheckBoxRef, () => {
    rowData.value.forEach(item => item.checkbox = false)
    rowData.value = [...rowData.value]
})

watch(initCheck, () => {
    rowData.value.forEach(item => item.checkbox = false)
    rowData.value = [...rowData.value]
})
watch(initSearchWord, () => {
    searchWord.value = ''
})

const resetChecked = () => {
    rowData.value.forEach(item => item.checkbox = false)
    rowData.value = [...rowData.value]

    emit('lngStoreGroup', store.state.storeGroup[0].lngStoreGroup)
    emit('lngStoreCodes', 0)
    emit('lngStoreAttrs', 0)
    emit('lngSupervisor', 0)
    emit('lngStoreTeam', 0)
    selectedStoreList.value = '전체'
}
const showOnlycheck = ref(false)
const showOnlyChecked = () => {
    showOnlycheck.value = !showOnlycheck.value
}


</script>
