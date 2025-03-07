<template>
    <div class="flex justify-between items-center w-full overflow-y-auto">
        <div class="flex justify-start  w-full pl-12 pt-4">
            <div class="flex justify-start">
                <h1 class="font-bold text-sm md:text-2xl w-full">
                    시간대별 계획 대비 현황.
                </h1>
            </div>

        </div>
        <div class="flex justify-center mr-9 space-x-2 pr-5">

            <button @click="searchButton" class="button search md:w-auto w-14">조회</button>
            <button @click="excelButton" class="button save w-auto excel">엑셀</button>

        </div>
    </div>
    <div class="grid grid-rows-1 grid-cols-[7fr,1fr,7fr] justify-between  bg-gray-200 rounded-lg h-24 items-center z-10">
        <div class="grid grid-cols-1 grid-rows-2 mr-60">
            <Datepicker1 @dateValue="dateValue" @year="year" @month="month" @day="day"></Datepicker1>
            <div class="flex justify-center items-center ml-16 space-x-3"><div class="text-base font-semibold">매출목표 : </div><input type="text" class="rounded-lg pl-1 h-8"></div>
        </div>
        <div><input type="checkbox" :value="1" v-model="checked"></div>
        <div>
            <PickStoreSingle @lngStoreGroup="lngStoreGroup" @lngSupervisor="lngSupervisor" @lngStoreTeam="lngStoreTeam" @lngStoreAttrs="lngStoreAttrs" @lngStoreCode="lngStoreCode" ></PickStoreSingle>
        </div>
       
    </div>

    <div class="h-[80%] mt-5">
       
            <Realgrid :progname="'SLS01_091RPT_VUE'" :progid="1" :rowData="rowData" 
                 :selectionStyle="'singleRow'"
                :documentTitle="'SLS01_091RPT'" :documentSubTitle="documentSubTitle" :exporttoExcel="exportExcel"></Realgrid>
       
       
    </div>



</template>

<script setup>
import { getPlanbyTime } from '@/api/misales';
import Datepicker1 from '@/components/Datepicker1.vue';
import PickStoreSingle from '@/components/pickStoreSingle.vue';
import Realgrid from '@/components/realgrid.vue';
import Swal from 'sweetalert2';
import { ref } from 'vue';
import { useStore } from 'vuex';
const selectedDate = ref()

const dateValue = (e) => {
    selectedDate.value = e
    console.log(selectedDate.value)
    initGrid()
}
const year = (e) => {
    console.log(e)
}
const month = (e) => {
    console.log(e)
}
const day = (e) => {
    console.log(e)
}
const lngstoregroup =ref()
const lngstoreattr =ref()
const lngstoreteam =ref()
const lngstoresupervisor =ref()
const lngstorecode =ref()
const checked = ref([])
const lngStoreGroup = (e) => {
    lngstoregroup.value = e
    console.log(e)
}
const lngStoreAttrs = (e) => {
    lngstoreattr.value = e
    console.log(e)
}
const lngStoreTeam = (e) => {
    lngstoreteam.value = e
    console.log(e)
}
const lngSupervisor = (e) => {
    lngstoresupervisor.value = e
    console.log(e)
}
const lngStoreCode = (e) => {
    lngstorecode.value = e
    console.log(e)
}

const receiptNo = ref()
const initCheckBox = ref(false)
const initSearchWord = ref(false)
const store = useStore();
const loginedstrLang = store.state.userData.lngLanguage
console.log(store)

const afterSearch = ref(false)
const searchButton = async () => {
    // initCheckBox.value = !initCheckBox.value
    // initSearchWord.value = !initSearchWord.value
    // if (storeCd.value == 0) {
    //     Swal.fire({
    //         title: '경고',
    //         text: '매장을 선택하세요.',
    //         icon: 'warning',
    //         confirmButtonText: '확인'
    //     })
    //     return;
    // }
    store.state.loading = true;
    try {
        initGrid()
        let bit ;
        if(checked.value.includes(1)){
            bit = 1
        } else {
            bit = 0
        }
        const res = await getPlanbyTime(lngstoregroup.value, lngstoreattr.value, lngstoreteam.value, lngstoresupervisor.value, lngstorecode.value, selectedDate.value ,bit)
        console.log(res)

        rowData.value = res.data.List
        afterSearch.value = true
    } catch (error) {
        afterSearch.value = false
    } finally {
        store.state.loading = false;

    }

}
const groupCd = ref()
const storeCd = ref()
const dtmDate = ref()
const init = ref(false)
const selectedStoreCd = (e) => {
    console.log(e)
    storeCd.value = e

    initGrid()
    selectedPosNo.value = '0'
    receiptNo.value = ''
    init.value = !init.value


}
const selectedGroupCd = (e) => {
    console.log(e)
    groupCd.value = e
}
const rowData = ref([])
const rowData2 = ref([])
const rowData3 = ref([])
const rowData4 = ref([])


const selectedPosNo = ref()
const posNo = (e) => {
    console.log(e)
    if (e == null) {
        selectedPosNo.value = 0
    } else {
        selectedPosNo.value = e
    }

}

const disCountCd = ref("")
const DisCountCd = (e) => {
    console.log(e)
    if (e == null) {
        disCountCd.value = 0
    } else {
        disCountCd.value = e
    }
}

const payCd = ref("")
const selectedpayCd = (e) => {


    if (e == null) {
        payCd.value = 0
    } else {
        payCd.value = e
    }
}




const exceloutput = ref(false)
const excelButton = () => {
    if (afterSearch.value == false) {
        Swal.fire({
            title: '경고',
            text: '조회를 먼저 진행해주세요.',
            icon: 'warning',
            confirmButtonText: '확인'
        })
        return;
    }
    exceloutput.value = !exceloutput.value
}
const initGrid = () => {

    console.log(rowData.value)
    if (rowData.value.length > 0) {
        rowData.value = []
    }
  


}


</script>
