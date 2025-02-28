<template>
    <div class="h-full" @click="handleParentClick">
      <div class="flex justify-between items-center w-full overflow-y-auto">
        <div class="flex justify-start  w-full pl-12 pt-4">
          <div class="flex justify-start">
            <h1 class="font-bold text-sm md:text-2xl w-full">
              매출 변환 현황.
            </h1>
          </div>
  
        </div>
        <div class="flex justify-center mr-9 space-x-2 pr-5">
          <button @click="searchButton" class="button search md:w-auto w-14">조회</button>
          <button @click="detailSearchButton" class="button search md:w-auto w-14">상세조회</button>
          <button @click="excelButton" class="button save w-auto excel">엑셀</button>
  
        </div>
      </div>
      <div class="grid grid-cols-2 grid-rows-1 justify-between  bg-gray-200 rounded-lg h-24 items-center z-10">
        <div class="grid grid-cols-1 grid-rows-2 mt-2 space-y-1">
  
          <Datepicker2 @endDate="endDate" @startDate="startDate" :closePopUp="closePopUp" ref="datepicker" @excelDate="excelDate"></Datepicker2>
          
          <div class="flex justify-center mr-20 -space-x-5">
            <div class="text-base font-semibold ml-5">사유코드 : </div>
            <div class="flex justify-center -space-x-48">
            <v-select v-model="selectedCause" 
            :options="causeList"
             placeholder="전체"
             label="strName"
             class=" custom-select4 !mr-10"
             clearable="true"
             @click="resetVselect2" />
             <div class="mt-1 relative"><label for="sum"><input id="sum" type="checkbox" @click="showSum">합계</label></div>
            </div>
          </div>
          
        </div>
        <div class="ml-10 mt-2">
          <PickStoreSingle @lngStoreCode="lngStoreCodes" @lngStoreGroup="lngStoreGroup" @excelStore="excelStore"  @changeInit="changeInit">
          </PickStoreSingle>
        </div>
        <div></div>
  
      </div>
  
      <div class="w-full h-[80%]">
  
        <Realgrid :progname="'SLS08_004RPT_VUE'" :progid="progid" :rowData="rowData" :reload="reload" :setFooter="true" :mergeMask="''" :setMergeMode="false" :setGroupSumCustomColumnId="['dtmDate']" :setGroupSumCustomText="['소계']"
        :setGroupFooter="setGroupFooter" :setGroupColumnId="setGroupColumnId" :setGroupFooterExpressions="setGroupFooterExpressions" :setGroupFooterColID="setGroupFooterColID"
         :setRowGroupSpan2="setRowGroupSpan" :setFooterExpressions="setFooterExpressions" :setFooterColID="setFooterColID"
          :documentTitle="'SLS08_004RPT'" :documentSubTitle="documentSubTitle" :exporttoExcel="exportExcel">
        </Realgrid>
      </div>
    </div>
  </template>
  
  <script setup>
  import { getCauseList, getSalesCancelData, getSalesChangeData, getSalesChangeDetailData } from '@/api/misales';
import Datepicker2 from '@/components/Datepicker2.vue';
import PickStoreSingle from '@/components/pickStoreSingle.vue';
import Realgrid from '@/components/realgrid.vue';
import { insertPageLog } from '@/customFunc/customFunc';
import { onMounted, ref } from 'vue';
import { useStore } from 'vuex';
  

  
  const orderPay = ref(1)
  const setFooterColID = ref(['lngCount', 'lngPreAmt', 'lngAmt', 'lngChange'])
  const setGroupFooterColID = ref(['lngCount', 'lngPreAmt', 'lngAmt', 'lngChange'])
  const setFooterExpressions = ref(['sum', 'sum', 'sum', 'sum'])
  const setGroupFooterExpressions = ref(['sum', 'sum', 'sum', 'sum'])

  const progid = ref(1)
  const setRowGroupSpan = ref('lngStoreCode,strName')
  const reload = ref(false)
  const rowData = ref([])
  const afterSearch = ref(false)
  const selectedstartDate = ref()
  const selectedendDate = ref()
  const hideColumnNow = ref(true)
  const setGroupColumnId = ref('dtmDate')
  const hideColumnsId = ref(['strStore'])
  const startDate = (e) => {
    console.log(e)
    selectedstartDate.value = e
  }
  const endDate = (e) => {
    selectedendDate.value = e
  }
  const startTime = ref(0)
  const endTime = ref(23)
  const setGroupFooter = ref(false)
  const selectedCause = ref(null)
  const store = useStore()
  const causeList = ref([])
  const mergeMask = ref()
onMounted(async () => {

   const pageLog = await insertPageLog(store.state.activeTab2)

   const userGroup = store.state.storeGroup[0].lngStoreGroup

   const res = await getCauseList(userGroup,0)
   causeList.value = res.data.List
   console.log(res)
})


  const loginedstrLang = store.state.userData.lngLanguage
  const searchButton = async () => {
    store.state.loading = true;
    try {
      initGrid()
      let cause ;
      if(selectedCause.value == null || selectedCause.value == undefined ){
        cause = 0 
      } else {
        cause = selectedCause.value.lngCode
      }
     setFooterColID.value = ['lngCount', 'lngPreAmt', 'lngAmt', 'lngChange']
    setGroupFooterColID.value =['lngCount', 'lngPreAmt', 'lngAmt', 'lngChange']
    setFooterExpressions.value = ['sum', 'sum', 'sum', 'sum']
     setGroupFooterExpressions.value = ['sum', 'sum', 'sum', 'sum']
      setRowGroupSpan.value = 'lngStoreCode,strName'
      progid.value = 1
     
      reload.value =!reload.value
     
      const res = await getSalesChangeData(selectedGroup.value, selectedStores.value, selectedstartDate.value, selectedendDate.value, '1', cause)
      console.log(res)
      rowData.value = res.data.List
  
  
  
  
      afterSearch.value = true
    } catch (error) {
      afterSearch.value = false
    } finally {
      store.state.loading = false;
  
    }
  
  }
  const detailSearchButton = async () => {
    store.state.loading = true;
    try {
      initGrid()
      let cause ;
      if(selectedCause.value == null || selectedCause.value == undefined ){
        cause = 0 
      } else {
        cause = selectedCause.value.lngCode
      }
    
     
      
      if(tempSum.value == true){
        setGroupFooter.value = true
      } else {
        setGroupFooter.value = false
      }
     setFooterColID.value = ['lngStartActAmt', 'lngEndActAmt', 'lngChange']
     setGroupFooterColID.value =['lngStartActAmt', 'lngEndActAmt', 'lngChange']
     setFooterExpressions.value = ['sum', 'sum', 'sum']
     setGroupFooterExpressions.value = ['sum', 'sum', 'sum']
      setRowGroupSpan.value = 'strName'
      progid.value = 2
      reload.value =!reload.value
     
      const res = await getSalesChangeDetailData(selectedGroup.value, selectedStores.value, selectedstartDate.value, selectedendDate.value, '12', cause)
      console.log(res)
      rowData.value = res.data.List
  
  
  
  
      afterSearch.value = true
    } catch (error) {
      afterSearch.value = false
    } finally {
      store.state.loading = false;
  
    }
  
  }
  
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
  
  console.log(store.state.minorCategory)
  
  
  
  const excelButton = () => {
    // let condition = '조건 :';
    // if(tempHideStore.value == true){
    //   condition+="매장명,"
    // }
    // if(tempCellUnite.value == true){
    //   condition+="셀병합,"
    // }
    // if(setGroupFooter.value == true){
    //   condition+="합계,"
    // }
    // condition= condition.substring(0,condition.length-1)
    let codestr
    if(selectedCause.value == null || selectedCause.value == undefined){
      codestr = '전체'
    } else {
      codestr = causeList.value.filter(item => item.lngCode == selectedCause.value.lngCode)[0].strName
    }

    documentSubTitle.value = selectedExcelDate.value +'\n'+ selectedExcelStore.value +'\n'+'사유코드 : '+codestr
    console.log(documentSubTitle.value);
    exportExcel.value = !exportExcel.value
  }



  

  const resetVselect2 = () => {
    endTime.value = 23
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
  const documentSubTitle = ref('')
  const selectedExcelDate = ref('')
  const excelDate = (e)=> {
     selectedExcelDate.value = e
  }
  const selectedExcelStore = ref('')
  const excelStore = (e) =>{
    selectedExcelStore.value = e
  }
const tempHideStore = ref(false)
  const showStore = (e) => {
      if(e.target.checked){
        tempHideStore.value = true 
      } else {
        tempHideStore.value = false
      }
  }
  const tempCellUnite= ref(false)
  const cellUnite = (e) => {
      if(e.target.checked){
        tempCellUnite.value = true 
      } else {
        tempCellUnite.value = false
      }
  }
  const tempSum= ref(false)
  const showSum = (e) => {
      if(e.target.checked){
        //tempSum.value = true 
        
        setGroupColumnId.value = 'strName'
        setGroupFooter.value = true
        reload.value = !reload.value
      } else {
        //tempSum.value = false
         setGroupColumnId.value = ''
        setGroupFooter.value = false
        reload.value = !reload.value
      }
  }
  const changeInit = (e) => {
    initGrid()
  }
  </script>
  
  <style></style>