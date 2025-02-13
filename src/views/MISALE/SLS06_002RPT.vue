<template>
    <div class="flex justify-between items-center w-full overflow-y-auto">
    <div class="flex justify-start  w-full pl-12 pt-4">
               <div class="flex justify-start"><h1 class="font-bold text-sm md:text-2xl w-full">
                시간대별 매출 현황.
               </h1></div>
                
               </div>
               <div class="flex justify-center mr-9 space-x-2 pr-5">
                
            <button @click="chartButton" class="button primary md:w-auto w-14">차트</button>
            <button @click="searchButton" class="button search md:w-auto w-14">조회</button>
            <button @click="excelButton" class="button save w-auto excel">엑셀</button>
              
            </div>
            </div>
            <div class="grid grid-cols-2 grid-rows-1 justify-between  bg-gray-200 rounded-lg h-32 items-center z-10">
                  <div class="grid grid-cols-1 grid-rows-3 mt-5">
                    <Datepicker2 @endDate="endDate" @startDate="startDate"></Datepicker2>
                    <div class="flex flex-col justify-start items-start text-nowrap ml-40 ">
                       <div class=" text-nowrap flex justify-start items-center space-x-3 ml-4">
                        <div class="text-base font-semibold">시간대 :</div>
                        <div><select name="" id="" class="border rounded-lg w-16 h-8 mr-3" v-model="orderPay">
                            <option :value="1">주문</option>
                            <option :value="2">계산</option>
                        </select></div>
                        <div><select name="" id="" class="border rounded-lg w-16 h-8" v-model="startTime">
                            <option :value="i.value" v-for="i in times">{{i.strName}}</option>
                        </select></div>
                        <div>~</div>
                        <div><select name="" id="" class="border rounded-lg w-16 h-8" v-model="endTime">
                            <option :value="i.value" v-for="i in times">{{i.strName}}</option>
                        </select></div>
                        <div><label for=""><input type="checkbox" @change="changecheckedBefore">할인전 매출액</label></div>
                    </div>
                        </div>
                        <div class="flex justify-center mr-48 space-x-2"><div class="text-base font-semibold">요일조건 : </div>
                            <label for="mon"><input type="checkbox" id="mon" :value="1" checked @change="checkit">월</label>
                            <label for="tue"><input type="checkbox" id="tue" :value="2" checked @change="checkit">화</label>
                            <label for="wed"><input type="checkbox" id="wed" :value="3" checked @change="checkit">수</label>
                            <label for="thu"><input type="checkbox" id="thu" :value="4" checked @change="checkit">목</label>
                            <label for="fri"><input type="checkbox" id="fri" :value="5" checked @change="checkit">금</label>
                            <label for="sat"><input type="checkbox" id="sat" :value="6" checked @change="checkit">토</label>
                            <label for="sun"><input type="checkbox" id="sun" :value="7" checked @change="checkit">일</label>
                        
                        </div>
                  </div>
                  <div class="ml-10"><PickStorePlural @lngStoreCodes="lngStoreCodes" @lngStoreGroup="lngStoreGroup" @lngStoreAttrs="lngStoreAttrs"></PickStorePlural></div>
                  <div></div>

                </div> 

                <div class="w-full h-[80%]">

                  <Realgrid :progname="'SLS06_002RPT_VUE'" :progid="1" :rowData="rowData" :reload="reload" :setFooter="true" :setGroupFooter="setGroupFooter" :setFooterExpressions="setFooterExpressions" :setFooterColID="setFooterColID" :ExcelNm="'일자별 매출 현황.'" :exporttoExcel="exportExcel" :setGroupColumnId="'dtmDate'" :setGroupSumCustomText="'소계'" :setGroupSumCustomColumnId="'strWeekName'" :setGroupCustomLevel="1" :setGroupSummaryCenterIds="setGroupSummaryCenterIds"></Realgrid>
                </div>
</template>

<script setup>
import { getDailySalesDetailReport, getDailySalesReport } from '@/api/misales';
import Datepicker2 from '@/components/Datepicker2.vue';
import PickStorePlural from '@/components/pickStorePlural.vue';
import Realgrid from '@/components/realgrid.vue';
import { ref } from 'vue';
import { useStore } from 'vuex';

const times = ref([
  { value: 0, strName: '00:00' },
  { value: 1, strName: '01:00' },
  { value: 2, strName: '02:00' },
  { value: 3, strName: '03:00' },
  { value: 4, strName: '04:00' },
  { value: 5, strName: '05:00' },
  { value: 6, strName: '06:00' },
  { value: 7, strName: '07:00' },
  { value: 8, strName: '08:00' },
  { value: 9, strName: '09:00' },
  { value: 10, strName: '10:00' },
  { value: 11, strName: '11:00' },
  { value: 12, strName: '12:00' },
  { value: 13, strName: '13:00' },
  { value: 14, strName: '14:00' },
  { value: 15, strName: '15:00' },
  { value: 16, strName: '16:00' },
  { value: 17, strName: '17:00' },
  { value: 18, strName: '18:00' },
  { value: 19, strName: '19:00' },
  { value: 20, strName: '20:00' },
  { value: 21, strName: '21:00' },
  { value: 22, strName: '22:00' },
  { value: 23, strName: '23:00' }
]
)
const setGroupFooter = ref(false)
const orderPay = ref(1)
const setFooterColID = ref(['lngRecCnt','lngRecAmt','lngCustCnt','lngCustAmt','lngSalAmt','lngDiscount','lngActAmt','lngVAT','lngSupplyAmt','dblDistRate','lngTotAmt','dtmDate'])
const setFooterExpressions = ref(['sum','avg','sum','avg','sum','sum','sum','sum','sum','sum','sum','custom'])
const setGroupSummaryCenterIds = ref('dtmDate,strWeekName')
const progid = ref(1)
const reload = ref(false)
const rowData = ref([])
const afterSearch = ref(false)
const selectedstartDate = ref()
const selectedendDate = ref()
const startDate = (e)=>{
  console.log(e)
  selectedstartDate.value = e
}
const endDate = (e)=>{
  selectedendDate.value = e
}
const startTime = ref(0)
const endTime = ref(23)
const tempSeeDetail = ref(1)

const store = useStore()
const loginedstrLang = store.state.userData.lngLanguage
const searchButton = async() =>{
  store.state.loading = true;
  try {
    initGrid()
      let selectedStorearr ;
      if(selectedStores.value == undefined ||  selectedStores.value.length == 0){
         selectedStorearr = 0
    } else {
        selectedStorearr = selectedStores.value.map(item => item).join(',')
    }
     
   

    const sendcheckedDay = [...checkedDay]
      const res = await getTimeSalesReport(selectedGroup.value , selectedStorearr, selectedstartDate.value , selectedendDate.value , 2 , startTime.value ,endTime.value  ,orderPay.value   , sendcheckedDay.join(',')   )
      console.log(res)
      rowData.value = res.data.DAILYSALES

    

  
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
   if(rowData.value.length > 0){
     rowData.value = []
   }
}

const exportExcel = ref(false)
const excelButton = () => {
  exportExcel.value = !exportExcel.value
}
const checkedDay = new Set([1,2,3,4,5,6,7])
const checkit = (e) => {
    if(e.target.checked){
        checkedDay.add(e.target.value)
    } else {
        checkedDay.delete(e.target.value)
    }
}
const checkedBefore = ref(false)
const changecheckedBefore = (e) => {
    if(e.target.checked){
        checkedBefore.value = true
    } else {
        checkedBefore.value = false
    }
    
}
</script>

<style>

</style>