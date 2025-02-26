<template>
    <div class="h-full" @click="handleParentClick">
      <div class="flex justify-between items-center w-full overflow-y-auto">
        <div class="flex justify-start  w-full pl-12 pt-4">
          <div class="flex justify-start">
            <h1 class="font-bold text-sm md:text-2xl w-full">
              매출 취소 현황.
            </h1>
          </div>
  
        </div>
        <div class="flex justify-center mr-9 space-x-2 pr-5">
          <button @click="searchButton" class="button search md:w-auto w-14">조회</button>
          <button @click="excelButton" class="button save w-auto excel">엑셀</button>
  
        </div>
      </div>
      <div class="grid grid-cols-2 grid-rows-1 justify-between  bg-gray-200 rounded-lg h-32 items-center z-10">
        <div class="grid grid-cols-1 grid-rows-3 mt-5">
  
          <Datepicker2 @endDate="endDate" @startDate="startDate" :closePopUp="closePopUp" ref="datepicker" @excelDate="excelDate"></Datepicker2>
          <div class="flex flex-col justify-start items-start text-nowrap ml-40 ">
            <div class=" text-nowrap flex justify-start items-center space-x-10 ml-8 mt-2">
              <div class="text-base font-semibold">조건 :</div>
              <div class="flex space-x-10">
                <label for=""><input type="checkbox">매장명</label>
                <label for=""><input type="checkbox">셀병합</label>
                <label for=""><input type="checkbox">합계</label>
            </div>
            
            </div>
          </div>
          <div class="flex justify-center -mr-16 -space-x-5">
            <div class="text-base font-semibold ml-5">사유코드 : </div>
            <v-select v-model="selectedCause" 
            :options="causeList"
             placeholder="전체"
             label="strName"
             class=" custom-select4 !mr-10"
             clearable="true"
             @click="resetVselect2" />
          </div>
        </div>
        <div class="ml-10 -mt-10">
          <PickStoreSingle @lngStoreCode="lngStoreCodes" @lngStoreGroup="lngStoreGroup" @excelStore="excelStore">
          </PickStoreSingle>
        </div>
        <div></div>
  
      </div>
  
      <div class="w-full h-[80%]">
  
        <Realgrid :progname="'SLS06_002RPT_VUE'" :progid="1" :rowData="rowData" :reload="reload" :setFooter="true"
          :setGroupFooter="true" :setFooterExpressions="setFooterExpressions" :setFooterColID="setFooterColID" :setGroupFooterExpressions="setGroupFooterExpressions" :setGroupFooterColID="setGroupFooterColID"
          :ExcelNm="'시간대별 매출 현황.'" :exporttoExcel="exportExcel" :setGroupColumnId="'strStore,strTime'"
          :setGroupSumCustomText="['소계']" :setGroupSumCustomColumnId="['strTime']" :setGroupCustomLevel="1"
          :setRowGroupSpan="'lngCustTotCnt,lngRecTotCnt,lngAccTotAmt'" 
          :setGroupSummaryCenterIds="setGroupSummaryCenterIds" :hideColumn="'lngSalAmt'" :hideColumnNow="hideColumnNow" :documentTitle="'SLS06_002RPT'" :documentSubTitle="documentSubTitle">
        </Realgrid>
      </div>
    </div>
  </template>
  
  <script setup>
  import { getCauseList, getTimeSalesReport } from '@/api/misales';
import Datepicker2 from '@/components/Datepicker2.vue';
import PickStoreSingle from '@/components/pickStoreSingle.vue';
import Realgrid from '@/components/realgrid.vue';
import { insertPageLog } from '@/customFunc/customFunc';
import { onMounted, ref } from 'vue';
import { useStore } from 'vuex';
  

  
  const orderPay = ref(1)
  const setFooterColID = ref(['lngRecCnt', 'lngRecAmt', 'lngCustCnt', 'lngCustAmt', 'lngSalAmt', 'lngDiscount', 'lngActAmt', 'lngVAT', 'lngSupplyAmt', 'dblDistRate', 'lngTotAmt', 'dtmDate'])
  const setGroupFooterColID = ref(['lngRecCnt', 'lngRecAmt', 'lngCustCnt', 'lngCustAmt', 'lngSalAmt', 'lngDiscount', 'lngActAmt', 'lngVAT', 'lngSupplyAmt', 'dblDistRate', 'lngTotAmt', 'dtmDate'])
  const setFooterExpressions = ref(['sum', 'avg', 'sum', 'avg', 'sum', 'sum', 'sum', 'sum', 'sum', 'sum', 'sum', 'custom'])
  const setGroupFooterExpressions = ref(['sum', 'avg', 'sum', 'avg', 'sum', 'sum', 'sum', 'sum', 'sum', 'sum', 'sum', 'custom'])
  const setGroupSummaryCenterIds = ref('strTime')
  const progid = ref(1)
  const reload = ref(false)
  const rowData = ref([])
  const afterSearch = ref(false)
  const selectedstartDate = ref()
  const selectedendDate = ref()
  const hideColumnNow = ref(true)
  const startDate = (e) => {
    console.log(e)
    selectedstartDate.value = e
  }
  const endDate = (e) => {
    selectedendDate.value = e
  }
  const startTime = ref(0)
  const endTime = ref(23)
  const tempSeeDetail = ref(1)
  const selectedCause = ref(null)
  const store = useStore()
  const causeList = ref([])
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
  
     
      const res = await getSalesCancelData(selectedGroup.value, selectedStores.value, selectedstartDate.value, selectedendDate.value, '12', startTime.value, endTime.value, orderPay.value, sendcheckedDay.join(','))
      console.log(res)
      rowData.value = res.data.TIMESALE
  
  
  
  
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
    const order = orderPay.value == 1 ? '주문 ' :'계산 '
    const stime = times.value.filter(item => item.value == startTime.value)[0].strName
    const etime = times.value.filter(item => item.value == endTime.value)[0].strName
    const dayArray = Array.from(checkedDay).sort((a,b) => a -b).map((day) => dayMap[day]).join(',')
    documentSubTitle.value = selectedExcelDate.value +'\n'+ selectedExcelStore.value +'\n'+'시간대 : '+order+stime+'~'+etime +'\n'+'요일조건 : '+dayArray
    console.log(documentSubTitle.value);
    exportExcel.value = !exportExcel.value
  }
  const checkedDay = new Set([1, 2, 3, 4, 5, 6, 7])
  const dayMap = {
    1:'월',
    2:'화',
    3:'수',
    4:'목',
    5:'금',
    6:'토',
    7:'일'
  }
  const checkit = (e) => {
    console.log(e)
    if (e.target.checked) {
      checkedDay.add(Number(e.target.value))
    } else {
      checkedDay.delete(Number(e.target.value))
    }
  }
  const changecheckedBefore = (e) => {
    if (e.target.checked) {
      hideColumnNow.value = false
    } else {
      hideColumnNow.value = true
    }
  
  }
  
  const resetVselect = () => {
    startTime.value = 0
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
  </script>
  
  <style></style>