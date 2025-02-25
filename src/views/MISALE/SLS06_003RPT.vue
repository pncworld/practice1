<template>
    <div class="flex justify-between items-center w-full overflow-y-auto">
      <div class="flex justify-start  w-full pl-12 pt-4">
        <div class="flex justify-start">
          <h1 class="font-bold text-sm md:text-2xl w-full">
            월별 매출 현황.
          </h1>
        </div>
  
      </div>
      <div class="flex justify-center mr-9 space-x-2 pr-5">
  
    
        <button @click="searchButton" class="button search md:w-auto w-14">조회</button>
        <button @click="excelButton" class="button save w-auto excel">엑셀</button>
  
      </div>
    </div>
    <div class="grid grid-cols-[15fr,1fr,15fr] grid-rows-1 justify-between  bg-gray-200 rounded-lg h-24 items-center z-10">
      <div class="grid grid-cols-1 grid-rows-2">
        <Datepicker3 @endMonth="endMonth" @endYear="endYear" @startMonth="startMonth" @startYear="startYear"></Datepicker3>
        <div class="flex justify-start items-center text-base text-nowrap font-semibold ml-24 mt-3">조회조건 : <div><label
              for="sum" class="font-thin"><input type="checkbox" id="sum" class="ml-5"
                @change="seeSum">합계</label></div>
    
        </div>
      </div>
      <div><input type="checkbox" name="" id=""></div>
      <div class="ml-5">
        <PickStorePlural2 @lngStoreCodes="lngStoreCodes" @lngStoreGroup="lngStoreGroup" @lngStoreAttrs="lngStoreAttrs" @excelStore="excelStore">
        </PickStorePlural2>
      </div>
      <div></div>
  
    </div>
  
    <div class="w-full h-[85%]">
  
      <Realgrid :progname="'SLS06_004RPT_VUE'" :progid="progid" :rowData="rowData" :reload="reload" :setFooter="true"
        :setGroupFooter="setGroupFooter" :setFooterExpressions="setFooterExpressions" :setFooterColID="setFooterColID"
        :documentTitle="'SLS06_004RPT'" :documentSubTitle="documentSubTitle" :exporttoExcel="exportExcel" :setGroupColumnId="'dtmDate'" :setGroupSumCustomText="['소계']"
        :setGroupSumCustomColumnId="['strWeekName']" :setGroupCustomLevel="3"
        :setGroupSummaryCenterIds="setGroupSummaryCenterIds"></Realgrid>
    </div>
  </template>
  
  <script setup>
  import { getDailySalesDetailReport, getDailySalesReport } from '@/api/misales';
import Datepicker3 from '@/components/Datepicker3.vue';
import PickStorePlural2 from '@/components/pickStorePlural2.vue';
import Realgrid from '@/components/realgrid.vue';
import { ref } from 'vue';
import { useStore } from 'vuex';
  
  const setGroupFooter = ref(false)
  const setFooterColID = ref(['lngRecCnt', 'lngRecAmt', 'lngCustCnt', 'lngCustAmt', 'lngSalAmt', 'lngDiscount', 'lngActAmt', 'lngVAT', 'lngSupplyAmt', 'dblDistRate', 'lngTotAmt', 'dtmDate'])
  const setFooterExpressions = ref(['sum', 'avg', 'sum', 'avg', 'sum', 'sum', 'sum', 'sum', 'sum', 'sum', 'sum', 'custom'])
  const setGroupSummaryCenterIds = ref('dtmDate,strWeekName')
  const progid = ref(1)
  const reload = ref(false)
  const rowData = ref([])
  const afterSearch = ref(false)
  const selectedstartYear = ref()
  const selectedendYear = ref()
  const selectedstartMonth = ref()
  const selectedendMonth = ref()
  const endMonth = (e) => {
    console.log(e)
    selectedendMonth.value = e
  }
  const startYear = (e) => {
    console.log(e)
    selectedstartYear.value = e
  }
  const startMonth = (e) => {
    console.log(e)
    selectedstartMonth.value = e
  }
  const endYear = (e) => {
    console.log(e)
    selectedendYear.value = e
  }
 
  const seeUnite = (e) => {
    if (e.target.checked) {
      setGroupFooter.value = true
  
    } else {
      setGroupFooter.value = false
    }
    reload.value = !reload.value
  }
  const tempSeeDetail = ref(1)
  const seeDetail = (e) => {
  
    if (e.target.checked) {
      tempSeeDetail.value = 2
    } else {
      tempSeeDetail.value = 1
    }
  }
  const store = useStore()
  const loginedstrLang = store.state.userData.lngLanguage
  const searchButton = async () => {
    store.state.loading = true;
    try {
      initGrid()
      progid.value = tempSeeDetail.value
      reload.value = !reload.value
      let selectedStorearr;
    
        selectedStorearr = selectedStores.value
   
  
      if (progid.value == 1) {
        const res = await getDailySalesReport(selectedGroup.value, selectedStorearr, selectedstartDate.value, selectedendDate.value, 1, loginedstrLang)
        console.log(res)
        rowData.value = res.data.DAILYSALES
  
      } else if (progid.value == 2) {
        const res = await getDailySalesDetailReport(selectedGroup.value, selectedStorearr, selectedstartDate.value, selectedendDate.value, 1, loginedstrLang)
        console.log(res)
        rowData.value = res.data.DAILYSALES
      }
  
  
  
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
  const selectedExcelStore = ref('')
  const selectedExcelDate = ref('')
  const documentSubTitle = ref('')
  const excelStore = (e) => {
    selectedExcelStore.value = e
  }
  const excelDate = (e) => {
    selectedExcelDate.value = e
  }
  const excelButton = () => {
    documentSubTitle.value = selectedExcelDate.value+'\n'+selectedExcelStore.value
    exportExcel.value = !exportExcel.value
  }
  </script>
  
  <style></style>