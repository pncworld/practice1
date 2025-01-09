<template>
    <div class="flex justify-between items-center w-full overflow-y-auto">
    <div class="flex justify-start  w-full pl-12 pt-4">
               <div class="flex justify-start"><h1 class="font-bold text-sm md:text-2xl w-full">
                매장정보등록
               </h1></div>
                
               </div>
               <div class="flex justify-center mr-10 space-x-2 pr-5">

                 <button @click="searchButton" class="button search">조회</button>
                  <button @click="addButton" class="button new">신규</button>
                  <button @click="saveButton" class="button save">저장</button>
                  <button @click="deleteButton" class="button delete">삭제</button>
                  <button @click="exportToExcel" class="button excel">엑셀</button>
            </div>
            
  
  </div>
  <div class="flex justify-start  space-x-5 bg-gray-200 rounded-lg h-16 items-center mt-3">
  <PickStore3 @update:storeGroup="handleGroupCd" @update:storeCd="handleStoreCd"  @storeNm="handlestoreNm" @GroupNm="handleGroupNm" @update:ischanged="handleinitAll">
  </PickStore3>
  <input type="text" v-model="searchstore" class="rounded-lg h-[53%] items-center border border-black" :disabled="allstrore"></div> 
       
   <div class="h-[56%] w-full"><Realgrid class="w-full h-full mt-2" :progname="'MST01_002INS_VUE'" :progid="1" :rowData="rowData" @clickedRowData="clickedRowData3"  @selcetedrowData="selcetedrowData" :selectionStyle="'singleRow'" :initFocus="initFocus" :labelingColumns="'lngSupervisor,lngSaleType,lngMultiPriceGroupCode,lngJoinType,lngSubLease,lngStoreAttr,lngStoreArea'" :valuesData="valuesData" :labelsData="labelsData" :deleteRow="deleted"></Realgrid>
    </div>
   <div class="relative left-0 -top-4 mt-5">
    <div class="absolute grid grid-cols-6 grid-rows-10 gap-0 w-full">
        <div class="border flex h-7 items-center text-sm font-semibold justify-center bg rounded-ss-xl bg-gray-100 text-blue-500">
        *매장코드 
        </div>
        <div class="border flex h-7 items-center text-sm font-semibold justify-center"><input type="text" id="storeCode" class="text-xs border rounded-md w-full pl-2 h-7 " v-model="lngStoreCode" :disabled="disableStoreCode" name="lngStoreCode" @keyup="updateGridValue"/></div>
        <div class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100 text-blue-500">
        *매장명 
        </div>
        <div class="border flex h-7 items-center text-sm font-semibold justify-center"><input type="text" id="storeCode" class="text-xs border rounded-md w-full pl-2 h-7 " v-model="strName" name="strName" @input="updateGridValue"/></div>
        <div class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100">
        사업자번호 
        </div>
        <div class="border flex h-7 items-center text-sm font-semibold justify-center rounded-se-xl"><input type="text" id="storeCode" class="text-xs border rounded-md w-full pl-2 h-7 " v-model="strRegistNo"  name="strRegistNo" @keyup="updateGridValue"/></div>
        <div class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100">
        가맹유형 
        </div>
        <div class="border flex h-7 items-center text-sm font-semibold justify-center"><select class="text-xs border rounded-md w-full h-7 pl-1" v-model="lngJoinType" name="lngJoinType" @change="updateGridValue" >
    
          <option v-for="item in lngJoinTypes" :key="item.lngCode" :value="item.lngCode" class="text-sm">
                {{ item.strName }}
            </option>
        </select></div>
        <div class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100 text-blue-500">
        *멀티단가 그룹 
        </div>
        <div class="border flex h-7 items-center text-sm font-semibold justify-center"><select  class="text-xs border rounded-md w-full h-7 pl-1 " v-model="lngMultiPriceGroupCode" name="lngMultiPriceGroupCode" @change="updateGridValue" >
        
          <option v-for="item in lngMultiPriceGroupCodes" :key="item.lngMultiPriceGroupCode" :value="item.lngMultiPriceGroupCode" class="text-sm">
                {{ item.strMultiPriceGroupName }}
            </option>
        </select></div>
        <div class="border flex h-7 items-center text-sm font-semibold justify-center">
         
        </div>
        <div class="border flex h-7 items-center text-sm font-semibold justify-center"><input type="hidden" id="storeCode" class="text-xs border rounded-md w-full p-2 h-7 pl-2" /></div>

        <div class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100">
        대표자명  
        </div>
        <div class="border flex h-7 items-center text-sm font-semibold justify-center"><input type="text" id="storeCode" class="text-xs border rounded-md w-full pl-2 h-7 "  v-model="strDirector" name="strDirector"  @keyup="updateGridValue"/></div>
        <div class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100">
        업종 
        </div>
        <div class="border flex h-7 items-center text-sm font-semibold justify-center"><input type="text" id="storeCode" class="text-xs border rounded-md w-full pl-2 h-7 " v-model="strDealType" name="strDealType" @keyup="updateGridValue"/></div>
        <div class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100">
        업태 
        </div>
        <div class="border flex h-7 items-center text-sm font-semibold justify-center"><input type="text" id="storeCode" class="text-xs border rounded-md w-full pl-2 h-7 " v-model="strDealKind" name="strDealKind"  @keyup="updateGridValue"/></div>

        <div class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100">
        매장구분  
        </div>
        <div class="border flex h-7 items-center text-sm font-semibold justify-center"><select id="storeCode" class="text-xs border rounded-md w-full  h-7 pl-1" v-model="lngStoreAttr" name="lngStoreAttr" @change="updateGridValue">
    
          <option v-for="item in lngStoreAttrs" :key="item.lngStoreAttr" :value="item.lngStoreAttr" class="text-xs">
                {{ item.strName }}
            </option>
        </select></div>
        <div class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100">
        매장유형 
        </div>
        <div class="border flex h-7 items-center text-sm font-semibold justify-center"><select id="storeCode" class="text-xs border rounded-md w-full h-7 pl-1" v-model="lngSubLease" name="lngSubLease" @change="updateGridValue" >
          <option v-for="item in lngSubLeases" :key="item.lngCode" :value="item.lngCode" class="text-sm">
                {{ item.strName }}
            </option>
        </select></div>
        <div class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100">
        지역 
        </div>
        <div class="border flex h-7 items-center text-sm font-semibold justify-center"><select type="text" id="storeCode" class="text-xs border rounded-md w-full  h-7 pl-1" v-model="lngStoreArea" name="lngStoreArea" @change="updateGridValue">
          <option v-for="item in lngStoreAreas" :key="item.lngStoreArea" :value="item.lngStoreArea" class="text-sm">
                {{ item.strName }}
            </option>
        </select></div>

        <div class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100">
        오픈일자
        </div>
        <div class="border flex h-7 items-center text-sm font-semibold justify-center"><input type="input" id="storeCode" class="border rounded-md w-full p-2 h-7 pl-2" v-model="dtmOpenDate" name="dtmOpenDate" @keyup="updateGridValue"  /></div>
        <div class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100">
        폐점일자 
        </div>
        <div class="border flex h-7 items-center text-sm font-semibold justify-center"><input type="text" id="storeCode" class="border rounded-md w-full p-2 h-7 pl-1" v-model="dtmStop" name="dtmStop"  @keyup="updateGridValue"/></div>
        <div class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100">
        변환코드 
        </div>
        <div class="border flex h-7 items-center text-sm font-semibold justify-center"><input type="text" id="storeCode" class="border rounded-md w-full p-2 h-7 pl-1" v-model="strConvCode" name="strConvCode" @keyup="updateGridValue"/></div>

        <div class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100">
        우편번호  
        </div>
        <div class="border flex h-7 items-center text-sm font-semibold justify-center"><input type="text" id="storeCode" class="border rounded-md w-full p-2 h-7 pl-1" v-model="strZipCode" name="strZipCode" @keyup="updateGridValue"/></div>
        <div class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100">
        주소  
        </div>
        <div class="border flex h-7 items-center text-sm font-semibold justify-center" style="width: 460px"><input type="text" id="storeCode" class="border rounded-md w-full h-7 pl-1" v-model="strAddress" name="strAddress" @keyup="updateGridValue"/></div>
        <div class="h-0 w-0">
        </div>
        <div class="border flex h-7 items-center text-sm font-semibold justify-center"><input type="text" id="storeCode" class="border rounded-md w-full pl-2 h-7 " v-model="strAddressEtc" name="strAddressEtc" @keyup="updateGridValue"/></div>

        <div class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100">
        전화번호  
        </div>
        <div class="border flex h-7 items-center text-sm font-semibold justify-center"><input type="text" id="storeCode" class="border rounded-md w-full pl-2 h-7 " v-model="strTel" name="strTel" @keyup="updateGridValue"/></div>
        <div class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100">
        휴대폰번호 
        </div>
        <div class="border flex h-7 items-center text-sm font-semibold justify-center"><input type="text" id="storeCode" class="border rounded-md w-full pl-2 h-7 " v-model="strPhone" name="strPhone" @keyup="updateGridValue"/></div>
        <div class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100">
        팩스번호 
        </div>
        <div class="border flex h-7 items-center text-sm font-semibold justify-center"><input type="text" id="storeCode" class="border rounded-md w-full pl-2 h-7 " v-model="strFax" name="strFax" @keyup="updateGridValue"/></div>

        <div class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100">
        평수 
        </div>
        <div class="border flex h-7 items-center text-sm font-semibold justify-center"><input type="text" id="storeCode" class="border rounded-md w-full pl-2 h-7 " v-model="lngFloorSpace" name="lngFloorSpace" @keyup="updateGridValue"/></div>
        <div class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100">
        임차조건  
        </div>
        <div class="border flex h-7 items-center text-sm font-semibold justify-center"><input type="text" id="storeCode" class="border rounded-md w-full pl-2 h-7 " v-model="lngLease" name="lngLease" @keyup="updateGridValue"/></div>
        <div class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100">
        BEP 
        </div>
        <div class="border flex h-7 items-center text-sm font-semibold justify-center"><input type="text" id="storeCode" class="border rounded-md w-full pl-2 h-7 " v-model="lngBEP" name="lngBEP" @keyup="updateGridValue"/></div>

        <div class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100">
        상권  
        </div>
        <div class="border flex h-7 items-center text-sm font-semibold justify-center"><select  id="storeCode" class="text-xs border rounded-md w-full pl-1 h-7 " v-model="lngSaleType" name="lngSaleType" @change="updateGridValue">
           <option value="0">없음</option>
          <option v-for="item in lngSaleTypes" :key="item.lngSaleType" :value="item.lngSaleType" class="text-sm">
                {{ item.strSaleType }}
            </option>
        </select></div>
        <div class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100">
        담당 S/C 
        </div>
        <div class="border flex h-7 items-center text-sm font-semibold justify-center"><select id="storeCode" class="text-xs border rounded-md w-full pl-1 h-7 " v-model="lngSupervisor" name="lngSupervisor" @change="updateGridValue">
          <option v-for="item in lngSupervisors" :key="item.lngSupervisor" :value="item.lngSupervisor" class="text-sm">
                {{ item.strName }}
            </option>
        </select></div>
        <div class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100">
        배송기사명 
        </div>
        <div class="border flex h-7 items-center text-sm font-semibold justify-center"><input type="text" id="storeCode" class="border rounded-md w-full pl-2 h-7 " v-model="strDev1" name="strDev1" @keyup="updateGridValue"/></div>

        <div class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100 rounded-es-xl">
        좌석수 
        </div>
        <div class="border flex h-7 items-center text-sm font-semibold justify-center"><input type="text" id="storeCode" class="border rounded-md w-full pl-2 h-7 " v-model="lngTable" name="lngTable" @keyup="updateGridValue"/></div>
        <div class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100">
        매장이력  
        </div>
        <div class="border flex h-7 items-center text-sm font-semibold justify-center rounded-ee-xl" style="width:687px"><input type="text" id="storeCode" class="border rounded-md w-full pl-2 h-7 " v-model="strStoreHistory" name="strStoreHistory" @keyup="updateGridValue" /></div>
        
    </div>
    
    
</div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useStore } from 'vuex';
import PickStore3 from '@/components/pickStore3.vue';
import { getGridInfoList} from '@/api/common';
import Swal from 'sweetalert2';
import { getMultiPrice, getstoreInfo, INS004_select, INS006_select, joinType_query, store_delete, store_insert, store_query, store_update, storeArea, storeAttr, subLease_query } from '@/api/master';
import Realgrid from '@/components/realgrid.vue';

const result = ref([]);
const store = useStore();
const groupCd = ref()
const searchStoreName = ref('')
const disableStoreCode = ref(true);
const gridOptions = {
  immutableData: true,
}
const labelsData =ref([])
const valuesData =ref([])

const storeType = ref('0');
const storeCd = ref('0');
const allstrore = ref(false);
const handleStoreCd = (newValue) => {
    storeCd.value = newValue
    if(storeCd.value ==0){
      allstrore.value = false
    } else {
      allstrore.value = true
      searchstore.value = ''
    }
}
const handleGroupCd = (newValue) => {
    console.log(newValue)
    groupCd.value = newValue
}
function exportToExcel() {
    gridApi.value.exportDataAsExcel();
}
const searchstore = ref('')

const gridApi = ref();
const GridInfo_PROG_ID = "MST01_002INS_VUE";
const GridInfo_GRID_ID = "1";
// API 호출 (설정값 호출)
const tabInitSetArray = ref([]);
(async () => {
    try {
        const result = await getGridInfoList(GridInfo_PROG_ID, GridInfo_GRID_ID);
        tabInitSetArray.value = result; 
    } catch (error) {
        console.error("Failed to fetch data:", error); // 오류 로그 출력
    } finally {
      
    }
})();
const colDefs2 =ref([]);

const rowData = ref ([]);
const lngMultiPriceGroupCodes = ref([]);
const lngStoreAttrs = ref([]);
const lngJoinTypes = ref([]);
const lngSubLeases = ref([]);
const lngStoreAreas = ref([]);
const lngSaleTypes = ref([]);
const lngSupervisors = ref([]);
const searchButton = async() => {
     lngMultiPriceGroupCodes.value = [];
     lngStoreAttrs.value = [];
     lngJoinTypes.value = [];
     lngSubLeases.value = [];
     lngStoreAreas.value = [];
     lngSaleTypes.value = [];
     lngSupervisors.value = [];
     valuesData.value = []
     labelsData.value = []
      store.dispatch("convertLoading", true);
       console.log(searchStoreName.value)
       console.log(groupCd.value)
       console.log(storeType.value)
       console.log(storeCd.value)
      const res = await getstoreInfo( groupCd.value, storeType.value , storeCd.value , searchStoreName.value);
        console.log(res)
        
        lngJoinTypes.value = res.data.JOINTYPE
        lngMultiPriceGroupCodes.value = res.data.STOREMULTI
        lngStoreAttrs.value = res.data.STOREATTR
        lngSubLeases.value = res.data.STORETYPE
        lngStoreAreas.value = res.data.STOREAREA
        lngSaleTypes.value = res.data.SALETYPE
        lngSupervisors.value = res.data.SUPERVISOR

        if(lngJoinTypes.value.length >0){
          lngJoinType.value = lngJoinTypes.value[0].lngCode
        }
        if(lngMultiPriceGroupCodes.value.length >0){
          lngMultiPriceGroupCode.value = lngMultiPriceGroupCodes.value[0].lngMultiPriceGroupCode
        }
        if(lngStoreAttrs.value.length >0){

          lngStoreAttr.value = lngStoreAttrs.value[0].lngStoreAttr
        }

        if(lngSubLeases.value.length >0){
          lngSubLease.value = lngSubLeases.value[0].lngCode
        }

        if(lngStoreAreas.value.length >0){
          lngStoreArea.value = lngStoreAreas.value[0].lngStoreArea
        }

        if(lngSaleTypes.value.length >0){
          lngSaleType.value = lngSaleTypes.value[0].lngSaleType
        }
        if(lngSupervisors.value.length >0){
          lngSupervisor.value = lngSupervisors.value[0].lngSupervisor
        }
       
        // labelsData.value.push()
        // valuesData
        console.log(lngSupervisors.value)
        console.log(lngSaleTypes.value)
        console.log(lngMultiPriceGroupCodes.value)
        let sublabelarr = []
        let subvaluearr = []
        for(var i = 0 ; i< lngSupervisors.value.length ; i++){
          sublabelarr.push(lngSupervisors.value[i].strName)
          subvaluearr.push(lngSupervisors.value[i].lngSupervisor)
        }
        sublabelarr.push(' ')
        subvaluearr.push(0)
        labelsData.value.push(sublabelarr)
        valuesData.value.push(subvaluearr)
         sublabelarr = []
         subvaluearr = []
        for(var i = 0 ; i< lngSaleTypes.value.length ; i++){
          sublabelarr.push(lngSaleTypes.value[i].strSaleType)
          subvaluearr.push(lngSaleTypes.value[i].lngSaleType)
        }
        sublabelarr.push('없음')
        subvaluearr.push(0)
        labelsData.value.push(sublabelarr)
        valuesData.value.push(subvaluearr)
        sublabelarr = []
         subvaluearr = []
        for(var i = 0 ; i< lngMultiPriceGroupCodes.value.length ; i++){
          sublabelarr.push(lngMultiPriceGroupCodes.value[i].strMultiPriceGroupName)
          subvaluearr.push(lngMultiPriceGroupCodes.value[i].lngMultiPriceGroupCode)
        }
        labelsData.value.push(sublabelarr)
        valuesData.value.push(subvaluearr)

        sublabelarr = []
         subvaluearr = []
        for(var i = 0 ; i< lngJoinTypes.value.length ; i++){
          sublabelarr.push(lngJoinTypes.value[i].strName)
          subvaluearr.push(lngJoinTypes.value[i].lngCode)
        }
        sublabelarr.push(' ')
        subvaluearr.push(0)
        labelsData.value.push(sublabelarr)
        valuesData.value.push(subvaluearr)

        sublabelarr = []
         subvaluearr = []
        for(var i = 0 ; i< lngSubLeases.value.length ; i++){
          sublabelarr.push(lngSubLeases.value[i].strName)
          subvaluearr.push(lngSubLeases.value[i].lngCode)
        }
        labelsData.value.push(sublabelarr)
        valuesData.value.push(subvaluearr)
 
        sublabelarr = []
         subvaluearr = []
        for(var i = 0 ; i< lngStoreAttrs.value.length ; i++){
          sublabelarr.push(lngStoreAttrs.value[i].strName)
          subvaluearr.push(lngStoreAttrs.value[i].lngStoreAttr)
        }
        labelsData.value.push(sublabelarr)
        valuesData.value.push(subvaluearr)

        sublabelarr = []
         subvaluearr = []
        for(var i = 0 ; i< lngStoreAreas.value.length ; i++){
          sublabelarr.push(lngStoreAreas.value[i].strName)
          subvaluearr.push(lngStoreAreas.value[i].lngStoreArea)
        }
        labelsData.value.push(sublabelarr)
        valuesData.value.push(subvaluearr)
 
        console.log(labelsData.value)
        console.log(valuesData.value)
        rowData.value = res.data.store
       store.dispatch("convertLoading", false);
    
       
}
const insertupdated =ref();
const deleted = ref(false)
const deleteButton = () => {
  deleted.value = !deleted.value
}
const addStore = () => {
  const newItem = {
      lngStoreCode: null,
      strName: '',
      strRegistNo: '',
      strDirector: '',
      strDealType: null,
      strDealKind: null,
      lngJoinType: null,
      strJoinTypeName: '',
      lngSubLease: null,
      strSubLeaseName: '',
      lngStoreAttr: null,
      strStoreAttrName:'',
      lngStoreArea: null,
      strStoreAreaName: '',
      dtmOpenDate: null,
      strTel: '',
      strFax: '',
      strZipCode: null,
      strAddress: '',
      strAddressEtc: '',
      strConvCode:'',
      strPhone: '',
      lngBEP: '',
      lngFloorSpace:'',
      lngLease: '',
      strCheck: '',
      lngSaleType: '',
      dtmStop:'',
      strDev1: '',
      lngTable: null,
      lngSupervisor: '',
      strStoreHistory: '',
      lngMultiPriceGroupCode: null,
      strMultiPriceGroupName: '',

   };
     newItem.isNew= true ;
     newItem.isUpdate= false ;
  
    insertupdated.value = gridApi.value.applyTransaction({add: [newItem]}); // 그리드에 업데이트
}


const saveButton = () => {
   console.log(rowData.value)
}

const clickedRowData3 = (newValue) => {
  console.log(newValue)
  console.log(rowData.value)
  lngStoreCode.value = newValue[1]
  strName.value = newValue[2]
  strRegistNo.value = newValue[3]
  strDirector.value = newValue[4]
  strDealType.value = newValue[5]
  strDealKind.value = newValue[6]
  lngJoinType.value = newValue[7]
  lngSubLease.value = newValue[9]
  lngStoreAttr.value = newValue[11]
  lngStoreArea.value = newValue[13]
  dtmOpenDate.value = newValue[15]
  strTel.value = newValue[16]
  strFax.value = newValue[17]
  strZipCode.value = newValue[18]
  strAddress.value = newValue[19]
  strAddressEtc.value = newValue[20]
  strConvCode.value = newValue[21]
  strPhone.value = newValue[22]
  lngBEP.value = newValue[23]
  lngFloorSpace.value = newValue[24]
  lngLease.value = newValue[25] 
  lngSupervisor.value = newValue[26] 
  lngSaleType.value = newValue[27]
  dtmStop.value = newValue[28]
  strDev1.value = newValue[29]
  lngTable.value = newValue[30]
  lngMultiPriceGroupCode.value = newValue[31]
  strStoreHistory.value = newValue[32]
 
}
const lngStoreCode = ref();
const strName = ref();
const strRegistNo = ref();
const strDirector = ref();
const strDealType = ref();
const strDealKind = ref();
const lngJoinType = ref();
const lngSubLease = ref();
const lngStoreAttr = ref();
const lngStoreArea = ref();
const dtmOpenDate = ref();
const strTel = ref();
const strFax = ref();
const strZipCode = ref();
const strAddress = ref();
const strAddressEtc = ref();
const strConvCode = ref();
const strPhone = ref();
const lngBEP = ref();
const lngFloorSpace = ref();
const lngLease = ref();
const lngSaleType = ref();
const lngSupervisor = ref();
const dtmStop = ref();
const strDev1 = ref();
const strStoreHistory = ref();
const lngTable = ref();
const lngMultiPriceGroupCode = ref();




</script>

<style >
 .ag-theme-alpine {
    height: 100%;
    width: 100%;
    --ag-row-height : 20px !important ; 
  }
  .ag-header-cell-label {
   justify-content: left !important ;
   margin-right: -5px !important;
  
 } 
 
  .custom-grid{
    --ag-header-background-color: #545876 !important;
   --ag-header-foreground-color: white !important; 
    --ag-font-size: 11px !important;
  }
</style>   