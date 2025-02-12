<template>
     <div class="flex justify-between items-center w-full overflow-y-auto">
    <div class="flex justify-start  w-full pl-12 pt-4">
               <div class="flex justify-start"><h1 class="font-bold text-sm md:text-2xl w-full">
                영수증별 매출 조회.
               </h1></div>
                
               </div>
               <div class="flex justify-center mr-9 space-x-2 pr-5">
                
            <button @click="searchButton" class="button search md:w-auto w-14">조회</button>
            <button @click="excelButton" class="button save w-auto excel">엑셀</button>
              
            </div>
            </div>
            <div class="grid grid-rows-2 grid-cols-3 justify-between  bg-gray-200 rounded-lg h-24 items-center z-10">
                  <div><Datepicker1 @dateValue="dateValue" @year="year" @month="month" @day="day"></Datepicker1></div>
                  <div><PickStoreRenew @update:storeCd="selectedStoreCd" @update:storeGroup="selectedGroupCd" @update:storeType="changeStoreType"></pickStoreRenew></div>
                    <div><PosList :groupCd="groupCd" :storeCd="storeCd" @posNo="posNo" class="!ml-3" :init="init"></posList></div>
                  <div class="text-base font-semibold w-[90%] ml-10 z-10">영수증 번호: <input type="text" class="border rounded-lg pl-1 h-10 !w-36 z-30" v-model="receiptNo"></div>
                  <div class="grid !mr-10  items-center relative"><DisCountCdList class=" flex absolute -right-1 w-[150%]" @disCountCd="DisCountCd" :groupCd="groupCd" :storeCd="storeCd" :init="init"></DisCountCdList></div>
                  <div class="relative"><PayCodeList class="absolute right-5 flex -mt-5 left-[155px]" @payCd="selectedpayCd" :groupCd="groupCd" :storeCd="storeCd" :init="init"></payCodeList></div> 
                </div> 

                <div class="grid grid-rows-1 grid-cols-[6.5fr,3.5fr] h-[80%] mt-5">
                    <div><span class="flex justify-start">*영수내역을 선택하시면 상세내역을 확인할 수 있습니다.</span><Realgrid :progname="'SLS02_011RPT_VUE'" :progid="1" :rowData="rowData" :valuesData="valuesData" :labelsData="labelsData" :labelingColumns="'strVoidFlag'" :selectionStyle="'singleRow'" @clickedRowData="clickedRowData" :initSelect="true" :exporttoExcel="exceloutput" :ExcelNm="'영수증별 매출 조회.'"></Realgrid></div>
                    <div class="grid grid-rows-3 grid-cols-1">
                        <div>
                            <span class="flex justify-start">고객 정보</span><Realgrid :progname="'SLS02_011RPT_VUE'" :progid="2" :rowData="rowData2"></Realgrid></div>
                        <div class="mt-5">
                            <span class="flex justify-start">주문 정보</span><Realgrid :progname="'SLS02_011RPT_VUE'" :progid="3" :rowData="rowData3"></Realgrid></div>
                        <div class="mt-5">
                            <span class="flex justify-start">결제 정보</span><Realgrid :progname="'SLS02_011RPT_VUE'" :progid="4" :rowData="rowData4"></Realgrid></div>
                    </div>
                </div>

   
   
</template>

<script setup>
import { getCustInfo, getOrderInfo, getPayInfo, getReceiptDatas } from '@/api/misales';
import Datepicker1 from '@/components/Datepicker1.vue';
import DisCountCdList from '@/components/disCountCdList.vue';
import PayCodeList from '@/components/payCodeList.vue';
import PickStorePlural from '@/components/pickStorePlural.vue';
import PickStoreRenew from '@/components/pickStoreRenew.vue';
import PosList from '@/components/posList.vue';
import Realgrid from '@/components/realgrid.vue';
import Swal from 'sweetalert2';
import { ref, watch } from 'vue';
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

const lngStoreGroups = (e) => {
    console.log(e)
}
const lngStoreCodes = (e) => {
    console.log(e)
}

const receiptNo = ref()
const initCheckBox = ref(false)
const initSearchWord = ref(false)
const store = useStore();
const loginedstrLang = store.state.userData.lngLanguage
console.log(store)

const afterSearch = ref(false)
const searchButton = async() =>{
    // initCheckBox.value = !initCheckBox.value
    // initSearchWord.value = !initSearchWord.value
    if(storeCd.value == 0){
      Swal.fire({
        title: '경고',
        text: '매장을 선택하세요.',
        icon: 'warning',
        confirmButtonText: '확인'
      })
      return ;
    }
  store.state.loading = true;
  try {
    initGrid()
    const res = await getReceiptDatas(groupCd.value , storeCd.value , selectedPosNo.value, selectedDate.value  ,receiptNo.value, disCountCd.value,  payCd.value ,loginedstrLang   )
    console.log(res)

    rowData.value = res.data.RECEIPT
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
const selectedStoreCd = (e) =>{
    console.log(e)
    storeCd.value = e

     initGrid()
     selectedPosNo.value = '0'
     receiptNo.value = ''
     init.value = !init.value
    
    
}
const selectedGroupCd = (e) =>{
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
    selectedPosNo.value = e
}

const disCountCd = ref("")
const DisCountCd = (e) => {
    console.log(e)
    disCountCd.value = e
}

const payCd = ref("")
const selectedpayCd = (e) => {
    payCd.value = e
}

const valuesData = ref([['Sales Cancellation','Menu Correction','Order Cancellation']])
const labelsData = ref([['매출취소','메뉴정정','주문취소']])


const clickedRowData = async(e) => {
    console.log(e)
    const seqId = e[17]

    const res = await getCustInfo(groupCd.value ,storeCd.value ,seqId)

    rowData2.value = res.data.CUSTOMER

    const res2 = await getOrderInfo(groupCd.value ,storeCd.value ,seqId)

    rowData3.value = res2.data.ORDER

    const res3 = await getPayInfo(groupCd.value ,storeCd.value ,seqId , loginedstrLang)

    rowData4.value = res3.data.PAYLIST

     console.log(res3)

}

const exceloutput = ref(false)
const excelButton = () => {
    if(afterSearch.value == false){
        Swal.fire({
            title: '경고',
            text: '조회를 먼저 진행해주세요.',
            icon: 'warning',
            confirmButtonText: '확인'
        })
        return ;
    }
    exceloutput.value = !exceloutput.value
}
const initGrid = () => {
  
    
    if(rowData.value.length != 0){
        rowData.value = []
    }
    if(rowData2.value.length != 0){
        rowData2.value = []
    }
    if(rowData3.value.length != 0){
        rowData3.value = []
    }
    if(rowData4.value.length != 0){
        rowData4.value = []
    }
  
    
  
}

const changeStoreType = (e) => {
    initGrid();
    init.value = !init.value
}
</script>

