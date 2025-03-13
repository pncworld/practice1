<template>
    <div class="flex justify-between items-center w-full overflow-y-auto">
        <div class="flex justify-start  w-full pl-12 pt-4">
            <div class="flex justify-start">
                <h1 class="font-bold text-sm md:text-2xl w-full">
                    일별 계획 대비 현황.
                </h1>
            </div>

        </div>
        <div class="flex justify-center mr-9 space-x-2 pr-5">

            <button @click="searchButton" class="button search md:w-auto w-14">조회</button>
            <button @click="excelButton" class="button save w-auto excel">엑셀</button>

        </div>
    </div>
    <div
        class="grid grid-rows-1 grid-cols-[7fr,1fr,7fr] justify-between  bg-gray-200 rounded-lg h-24 items-center z-10">
        <div class="grid grid-cols-1 grid-rows-2 mr-60">
            <Datepicker2 @startDate="startDate" @endDate="endDate" @excelDate="excelDate" :initToday="1" class="ml-5">
            </Datepicker2>
            <div class="flex justify-center items-center ml-72 mr-2 space-x-3 text-nowrap">
                <div class="text-base font-semibold">매출목표 : </div><input type="text"
                    class="rounded-lg pl-1 h-8 text-right disabled:bg-white" v-model="maxSaleTarget" disabled>
                <div class="text-base font-semibold">매출구분 : </div><label for="showSale1"><input type="radio"
                        id="showSale1" name="showSale" v-model="checked" :value="0">실매출</label> <label
                    for="showSale2"><input id="showSale2" name="showSale" type="radio" v-model="checked"
                        :value="1">순매출</label>
            </div>
        </div>
        <div><input type="checkbox" :value="1" @click="updateShowStore"></div>
        <div>
            <PickStoreSingle @lngStoreGroup="lngStoreGroup" @lngSupervisor="lngSupervisor" @lngStoreTeam="lngStoreTeam"
                @lngStoreAttrs="lngStoreAttrs" @lngStoreCode="lngStoreCode" @excelStore="excelStore"
                ></PickStoreSingle>
        </div>

    </div>

    <div class="h-[80%] mt-5">

        <Realgrid :progname="'SLS01_092RPT_VUE'" :progid="progid" :rowData="rowData" :selectionStyle="'singleRow'"
             :setRowStyleCalls="true" :setRowStyleLevel="2" :reload="reload"
            :hideColumnsId="hideColumnsId" :setFooter="true" :documentTitle="'SLS01_092RPT'" :setMergeMode="false"
            :documentSubTitle="documentSubTitle" :exporttoExcel="exporttoExcel"></Realgrid>


    </div>



</template>

<script setup>
import { getPlanbyDays, getPlanbyTime } from '@/api/misales';
import Datepicker2 from '@/components/Datepicker2.vue';
import PickStoreSingle from '@/components/pickStoreSingle.vue';
import Realgrid from '@/components/realgrid.vue';
import Swal from 'sweetalert2';
import { ref } from 'vue';
import { useStore } from 'vuex';
const selectedDate = ref()
const documentSubTitle = ref()
const selectedExcelDate = ref()
const selectedExcelStore = ref()
const selectedstartDate = ref()
const selectedendDate = ref()
const customFooterShowLast = ref(true)
const progid=ref(1)
const startDate = (e) => {
    selectedstartDate.value = e
}
const endDate = (e) => {
    selectedendDate.value = e
}

const excelDate = (e) => {
    selectedExcelDate.value = e
}
const excelStore = (e) => {
    selectedExcelStore.value = e
}
const lngstoregroup = ref()
const lngstoreattr = ref()
const lngstoreteam = ref()
const lngstoresupervisor = ref()
const lngstorecode = ref()
const maxSaleTarget = ref('')
const checked = ref(0)
const setGroupFooter = ref(false)
const hideColumnsId = ref(['strStore'])
const lngStoreGroup = (e) => {
    lngstoregroup.value = e
    console.log(e)
    initGrid()
}
const lngStoreAttrs = (e) => {
    lngstoreattr.value = e
    console.log(e)
    initGrid()
}
const lngStoreTeam = (e) => {
    lngstoreteam.value = e
    console.log(e)
    initGrid()
}
const lngSupervisor = (e) => {
    lngstoresupervisor.value = e
    console.log(e)
    initGrid()
}
const lngStoreCode = (e) => {
    lngstorecode.value = e
    console.log(e)
    initGrid()
}

const receiptNo = ref()
const initCheckBox = ref(false)
const setGroupColumnId = ref('strStore')
const store = useStore();
const reload = ref(false)
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
        let barea;
        if (hideColumnsId.value.includes('strStore')) {
            barea = 0
        } else {
            barea = 1
        }
        if(hideColumnsId.value.includes('strStore')){
            progid.value = 1
        } else {
            progid.value = 2
        }
        reload.value = !reload.value
        console.log(lngstoregroup.value)
        console.log(lngstoreattr.value)
        console.log(lngstoreteam.value)
        console.log(lngstoresupervisor.value)
        console.log(lngstorecode.value)
        console.log(selectedstartDate.value)
        console.log(selectedendDate.value)
        console.log(barea)
        console.log(checked.value)
        const res = await getPlanbyDays(lngstoregroup.value, lngstoreattr.value, lngstoreteam.value, lngstoresupervisor.value, lngstorecode.value, selectedstartDate.value, selectedendDate.value, barea, checked.value)
        console.log(res)

        rowData.value = res.data.List
        if (rowData.value.length > 0) {
            maxSaleTarget.value = rowData.value.map(i => i.lngProject)[0].toLocaleString();
        }

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




const exporttoExcel = ref(false)
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

    let cond = '매출목표 : ';
    if (maxSaleTarget.value != '') {
        cond += maxSaleTarget.value
    }

    let cond2 = '매출구분 : '
    if (checked.value == 0) {
        cond2 += '실매출'
    } else {
        cond2 += '순매출'
    }
    documentSubTitle.value = selectedExcelDate.value + '\n' + selectedExcelStore.value + '\n' + cond + '\n' + cond2
    exporttoExcel.value = !exporttoExcel.value
}
const initGrid = () => {

    console.log(rowData.value)
    if (rowData.value.length > 0) {
        rowData.value = []
    }



}
const updateShowStore = (e) => {
    if (e.target.checked) {
        hideColumnsId.value = []
 
    } else {
        hideColumnsId.value = ['strStore']
  
    }
}


</script>
