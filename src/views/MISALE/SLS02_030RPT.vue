<template>
    <div class="h-full" @click="handleParentClick">
        <div class="flex justify-between items-center w-full overflow-y-auto">
            <div class="flex justify-start  w-full pl-12 pt-4">
                <div class="flex justify-start">
                    <h1 class="font-bold text-sm md:text-2xl w-full">
                        매장별 실시간 매출 조회
                    </h1>
                </div>

            </div>
            <div class="flex justify-center mr-9 space-x-2 pr-5">

                <button @click="searchButton" class="button search md:w-auto w-14">조회</button>
                <button @click="excelButton" class="button save w-auto excel">엑셀</button>

            </div>
        </div>
        <div class="grid grid-cols-2 grid-rows-1 justify-between  bg-gray-200 rounded-lg h-28 items-center z-10 ">
            <div class="grid grid-cols-1 grid-rows-3 -space-y-5 mt-5">
                <Datepicker2 @endDate="endDate" @startDate="startDate" :closePopUp="closePopUp" ref="datepicker"
                    @excelDate="excelDate" :initToday="'Y'"></Datepicker2>
                    <div class="flex justify-start items-center text-base text-nowrap font-semibold ml-48 ">
                        구분 : <div class="flex ml-3 space-x-3">
                            <select name="" id="" class="border w-40 h-7 rounded-lg">
                                <option value="">직가맹</option>
                            </select>
                            <select name="" id=""  class="border w-40 h-7 rounded-lg">
                                <option value="">전체</option>
                            </select>
                        </div>
                    </div>
                <div class="flex justify-start items-center text-base text-nowrap font-semibold ml-40 !-mt-10 ">조회조건 : <div>
                        <label for="detail" class="font-thin"><input type="checkbox" id="detail" class="ml-5"
                                @change="seeDays">일자별</label></div>

                </div>
            </div>
            <div class="ml-10">
                <PickStorePlural @lngStoreCodes="lngStoreCodes" @lngStoreGroup="lngStoreGroup"
                    @lngStoreAttrs="lngStoreAttrs" @excelStore="excelStore">
                </PickStorePlural>
                <div class="text-red-500 h-5 mt-2 flex justify-end mr-3" ><div v-show="afterSearch">{{currentTime}}에 조회되었으며 미결제금액은 조회 시간 기준입니다.</div></div>
            </div>
            <div></div>

        </div>

        <div class="w-full h-[85%]">

            <Realgrid :progname="'SLS02_030RPT_VUE'" :progid="progid" :rowData="rowData" :reload="reload"
                 :exporttoExcel="exportExcel" :documentSubTitle="documentSubTitle" :documentTitle="'SLS02_030RPT'" :setRowGroupSpan="'strName'"></Realgrid>
        </div>
    </div>
</template>

<script setup>
import { getDailySalesDetailReport, getDailySalesReport, getRealTimeReport } from '@/api/misales';
import Datepicker2 from '@/components/Datepicker2.vue';
import PickStorePlural from '@/components/pickStorePlural.vue';
import Realgrid from '@/components/realgrid.vue';
import { formatTime } from '@/customFunc/customFunc';
import Swal from 'sweetalert2';
import { ref } from 'vue';
import { useStore } from 'vuex';

const setGroupFooter = ref(false)
const setFooterColID = ref(['lngRecCnt', 'lngRecAmt', 'lngCustCnt', 'lngCustAmt', 'lngSalAmt', 'lngDiscount', 'lngActAmt', 'lngVAT', 'lngSupplyAmt', 'dblDistRate', 'lngTotAmt', 'dtmDate'])
const setFooterExpressions = ref(['sum', 'avg', 'sum', 'avg', 'sum', 'sum', 'sum', 'sum', 'sum', 'sum', 'sum', 'custom'])
const setGroupSummaryCenterIds = ref('dtmDate,strWeekName')
const progid = ref(2)
const reload = ref(false)
const rowData = ref([])
const afterSearch = ref(false)
const selectedstartDate = ref()
const selectedendDate = ref()
const startDate = (e) => {
    console.log(e)
    selectedstartDate.value = e
}
const endDate = (e) => {
    selectedendDate.value = e
}

const tempSeeDay = ref(0)
const seeDays = (e) => {

    if (e.target.checked) {
        tempSeeDay.value = 1
    } else {
        tempSeeDay.value = 0
     
    }
}
const store = useStore()
const loginedstrLang = store.state.userData.lngLanguage
const searchButton = async () => {
    store.state.loading = true;
    try {
        initGrid()
        if(tempSeeDay.value == 1){
            progid.value = 1
        } else {
            progid.value = 2
        }
        reload.value = !reload.value
        let selectedStorearr;
        if (selectedStores.value == undefined || selectedStores.value.length == 0) {
            selectedStorearr = 0
        } else {
            selectedStorearr = selectedStores.value
        }

  
            const res = await getRealTimeReport(selectedGroup.value, selectedStorearr, selectedstartDate.value, selectedendDate.value, tempSeeDay.value )
            console.log(res)
            rowData.value = res.data.RECEIPT




        afterSearch.value = true
    } catch (error) {
        afterSearch.value = false
    } finally {
        store.state.loading = false;

    }

}
const currentTime = ref(formatTime(new Date()))
const selectedGroup = ref()
const selectedStores = ref()
const selectedStoreAttrs = ref()
const lngStoreGroup = (e) => {
    console.log(e)
    selectedGroup.value = e
}
const lngStoreCodes = (e) => {
    selectedStores.value = e
    console.log(e)
}
const lngStoreAttrs = (e) => {
    selectedStoreAttrs.value = e
    console.log(e)
}

const initGrid = () => {
    if (rowData.value.length > 0) {
        rowData.value = []
    }
}

const exportExcel = ref(false)
const documentSubTitle = ref('')
const excelButton = () => {
    documentSubTitle.value = selectedExcelDate.value+'\n'+selectedExcelStore.value
    exportExcel.value = !exportExcel.value
}

const datepicker = ref(null)
const closePopUp = ref(false)
const handleParentClick = (e) => {
    const datepickerEl = datepicker.value?.$el;

    if (datepickerEl && datepickerEl.contains(e.target)) {
        return;
    }
    closePopUp.value = !closePopUp.value

}
const selectedExcelDate = ref('')
const selectedExcelStore = ref('')
const excelDate = (e) => {
    selectedExcelDate.value = e
}
const excelStore = (e) => {
    selectedExcelStore.value = e
}
</script>

<style></style>