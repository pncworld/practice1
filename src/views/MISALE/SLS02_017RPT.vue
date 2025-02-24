<template>
    <div class="flex justify-between items-center w-full overflow-y-auto">
        <div class="flex justify-start  w-full pl-12 pt-4">
            <div class="flex justify-start">
                <h1 class="font-bold text-sm md:text-2xl w-full">
                   일일 정산 레포트.
                </h1>
            </div>

        </div>
        <div class="flex justify-center mr-9 space-x-2 pr-5">

            <button @click="searchButton" class="button search md:w-auto w-14">조회</button>
            <button @click="excelButton" class="button save w-auto excel">엑셀</button>

        </div>
    </div>
    <div class="grid grid-rows-2 grid-cols-2 justify-between  bg-gray-200 rounded-lg h-24 items-center z-10">
        <div class="mt-5">
            <Datepicker2 @endDate="endDate" @startDate="startDate" @excelDate="excelDate"></Datepicker2>
        </div>
        <div class="mt-10">
            <PickStoreSingle2 @lngStoreCode="lngStoreCode" @lngStoreGroup="lngStoreGroup"  @excelStore="excelStore">
            </PickStoreSingle2>
        </div>
        <div class="-ml-96">
            <label for="bill"><input type="checkbox" id="bill" @click="checkBill">지폐권종표시</label>
        </div>
      
     
       
    
    </div>

    <div class="grid grid-rows-[1fr,1fr,2.5fr,1fr] grid-cols-1 h-[83%]">
        <div>
            <div class="flex justify-start ml-5">시간대별 내역</div>
            <Realgrid :progname="'SLS02_017RPT_VUE'" :progid="1" :rowData="rowData" :reload="reload"
            :exporttoExcel="exportExcel" :documentSubTitle="documentSubTitle" :documentTitle="'SLS06_005RPT'">

            </Realgrid>
        </div>
        <div>
            <div class="flex justify-between ml-5 mt-5">
                <div>매출세부내역</div>
                <div class="mr-[44%]">메뉴그룹별내역</div>
            </div>
            <div class="flex justify-between h-[90%] mt-2" >
                <Realgrid :progname="'SLS02_017RPT_VUE'" :progid="2" :rowData="rowData" :reload="reload"
                :exporttoExcel="exportExcel" :documentSubTitle="documentSubTitle" :documentTitle="'SLS06_005RPT'"></Realgrid>
                <Realgrid :progname="'SLS02_017RPT_VUE'" :progid="5" :rowData="rowData" :reload="reload"
                :exporttoExcel="exportExcel" :documentSubTitle="documentSubTitle" :documentTitle="'SLS06_005RPT'"></Realgrid>
            </div>
            
        </div>
        <div >
            <div class="flex justify-between ml-5 mt-8">
                <div>현금정산내역</div>
                <div class="mr-[44%]">신용카드별내역</div>
            </div>
            <div class="flex  justify-between h-[86%]">
                <Realgrid :progname="'SLS02_017RPT_VUE'" :progid="3"></Realgrid>
                <Realgrid :progname="'SLS02_017RPT_VUE'" :progid="6"></Realgrid>
            </div>
        </div>
        <div >
            <div class="flex justify-between ml-5 mt-2">
                <div>매출취소내역</div>
                <div class="mr-[44%]">개점/마감내역</div>
            </div>
            <div class="flex  justify-between h-[90%]">
                <Realgrid :progname="'SLS02_017RPT_VUE'" :progid="4"></Realgrid>
                <Realgrid :progname="'SLS02_017RPT_VUE'" :progid="7"></Realgrid>
            </div>
        </div>
    </div>



</template>

<script setup>
import { getCustInfo, getOrderInfo, getPayInfo, getReceiptDatas } from '@/api/misales';
import Datepicker2 from '@/components/Datepicker2.vue';
import PickStoreSingle2 from '@/components/pickStoreSingle2.vue';
import Realgrid from '@/components/realgrid.vue';
import Swal from 'sweetalert2';
import { ref } from 'vue';
import { useStore } from 'vuex';
const selectedDate = ref()
const selectedGroup = ref()
const selectedStore = ref()



const lngStoreGroup = (e) => {
    selectedGroup.value = e
    console.log(e)
}
const lngStoreCode = (e) => {
    selectedStore.value = e
    console.log(e)
}

const receiptNo = ref()
const initCheckBox = ref(false)
const initSearchWord = ref(false)
const store = useStore();
const loginedlngLang = store.state.userData.lngLanguage
console.log(store)
const selectedstartDate = ref()
const selectedendDate = ref()
const startDate = (e) => {
  console.log(e)
  selectedstartDate.value = e
}
const endDate = (e) => {
  selectedendDate.value = e
}
const afterSearch = ref(false)
const searchButton = async () => {
    // initCheckBox.value = !initCheckBox.value
    // initSearchWord.value = !initSearchWord.value
    if (selectedStore.value == 0) {
        Swal.fire({
            title: '경고',
            text: '매장을 선택하세요.',
            icon: 'warning',
            confirmButtonText: '확인'
        })
        return;
    }
    store.state.loading = true;
    try {
        initGrid()
        const res = await getSalesDayReport(selectedGroup.value, selectedStore.value, selectedstartDate.value, selectedendDate.value, whetherBill.value , loginedlngLang)
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

const valuesData = ref([['Sales Cancellation', 'Menu Correction', 'Order Cancellation']])
const labelsData = ref([['매출취소', '메뉴정정', '주문취소']])


const clickedRowData = async (e) => {
    console.log(e)
    const seqId = e[17]

    const res = await getCustInfo(groupCd.value, storeCd.value, seqId)

    rowData2.value = res.data.CUSTOMER

    const res2 = await getOrderInfo(groupCd.value, storeCd.value, seqId)

    rowData3.value = res2.data.ORDER

    const res3 = await getPayInfo(groupCd.value, storeCd.value, seqId, loginedstrLang)

    rowData4.value = res3.data.PAYLIST

    console.log(res3)

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


    if (rowData.value.length != 0) {
        rowData.value = []
    }
    if (rowData2.value.length != 0) {
        rowData2.value = []
    }
    if (rowData3.value.length != 0) {
        rowData3.value = []
    }
    if (rowData4.value.length != 0) {
        rowData4.value = []
    }



}
const whetherBill = ref(0)
const checkBill = (e) => {
    if(e.target.checked){
        whetherBill.value = 1
    } else {
        whetherBill.value = 0
    }
}
</script>
