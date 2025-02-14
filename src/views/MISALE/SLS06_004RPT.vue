<template>
  <div class="flex justify-between items-center w-full overflow-y-auto">
    <div class="flex justify-start  w-full pl-12 pt-4">
      <div class="flex justify-start">
        <h1 class="font-bold text-sm md:text-2xl w-full">
          일자별 매출 현황.
        </h1>
      </div>

    </div>
    <div class="flex justify-center mr-9 space-x-2 pr-5">

      <button @click="chartButton" class="button primary md:w-auto w-14">차트</button>
      <button @click="searchButton" class="button search md:w-auto w-14">조회</button>
      <button @click="excelButton" class="button save w-auto excel">엑셀</button>

    </div>
  </div>
  <div class="grid grid-cols-2 grid-rows-1 justify-between  bg-gray-200 rounded-lg h-24 items-center z-10">
    <div class="grid grid-cols-1 grid-rows-2">
      <Datepicker2 @endDate="endDate" @startDate="startDate"></Datepicker2>
      <div class="flex justify-start items-center text-base text-nowrap font-semibold ml-40 ">조회조건 : <div><label
            for="detail" class="font-thin"><input type="checkbox" id="detail" class="ml-5"
              @change="seeDetail">상세보기</label></div>
        <div><label for="unite" class="font-thin"><input type="checkbox" id="unite" class="ml-5 "
              @change="seeUnite">셀병합</label></div>
      </div>
    </div>
    <div class="ml-10">
      <PickStorePlural @lngStoreCodes="lngStoreCodes" @lngStoreGroup="lngStoreGroup" @lngStoreAttrs="lngStoreAttrs">
      </PickStorePlural>
    </div>
    <div></div>

  </div>

  <div class="w-full h-[85%]">

    <Realgrid :progname="'SLS06_004RPT_VUE'" :progid="progid" :rowData="rowData" :reload="reload" :setFooter="true"
      :setGroupFooter="setGroupFooter" :setFooterExpressions="setFooterExpressions" :setFooterColID="setFooterColID"
      :ExcelNm="'일자별 매출 현황.'" :exporttoExcel="exportExcel" :setGroupColumnId="'dtmDate'" :setGroupSumCustomText="'소계'"
      :setGroupSumCustomColumnId="'strWeekName'" :setGroupCustomLevel="1"
      :setGroupSummaryCenterIds="setGroupSummaryCenterIds"></Realgrid>
  </div>
</template>

<script setup>
import { getDailySalesDetailReport, getDailySalesReport } from '@/api/misales';
import Datepicker2 from '@/components/Datepicker2.vue';
import PickStorePlural from '@/components/pickStorePlural.vue';
import Realgrid from '@/components/realgrid.vue';
import Swal from 'sweetalert2';
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
const selectedstartDate = ref()
const selectedendDate = ref()
const startDate = (e) => {
  console.log(e)
  selectedstartDate.value = e
}
const endDate = (e) => {
  selectedendDate.value = e
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
    if (selectedStores.value == undefined || selectedStores.value.length == 0) {
      selectedStorearr = 0
    } else {
      selectedStorearr = selectedStores.value.map(item => item).join(',')
    }

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
const excelButton = () => {
  exportExcel.value = !exportExcel.value
}
</script>

<style></style>