<template>
    <div>
                 <div class="flex justify-start pl-4 pt-4">
                 <div class="flex justify-start"><h1 class="font-bold text-2xl">
                  매장정보등록
                 </h1><div class="flex justify-end space-x-2" style="margin-left:750px"><button @click="searchStore" class="button search">조회</button>
                  <button @click="addStore" class="button new">신규</button>
                  <button @click="updateRowData" class="button save">저장</button>
                  <button @click="deleteStore" class="button delete">삭제</button>
                  <button @click="exportToExcel" class="button excel">엑셀</button>
                </div> </div>
                  
                
                 </div>
                 <br>
                 
                 <div class="flex justify-start  space-x-5 bg-gray-200 rounded-lg h-16 items-center"><PickStore3 :groupCdDisabled="groupCdDisabled" :gridOptions="gridOptions"  @update:storeType="handleGroupCdDisabledUpdate" @update:storeCd="handleStoreCd"></PickStore3> <input type="text" class="w-1/7 rounded border border-neutral-700 h-9 px-1 " v-model="searchStoreName" @keyup.enter="searchStore"></div> 
                
    </div>
    <div><ag-grid-vue class="ag-theme-alpine custom-grid" :defaultColDef="defaultColDef" :columnDefs="colDefs2"  rowSelection="multiple" :rowData="rowData" style="height:540px" @rowClicked="onRowClicked" @grid-ready="onGridReady"/></div>
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
import PickStore from '@/components/pickStore.vue';
import { AgGridVue } from 'ag-grid-vue3';
import axios from 'axios';
import { ref } from 'vue';
import { useStore } from 'vuex';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import PickStore3 from '@/components/pickStore3.vue';
import { getGridInfoList} from '@/api/common';
import Swal from 'sweetalert2';
import { getMultiPrice, INS004_select, INS006_select, joinType_query, store_delete, store_insert, store_query, store_update, storeArea, storeAttr, subLease_query } from '@/api/master';

const result = ref([]);
const store = useStore();
const groupCd = store.state.storeGroup[0] ?  store.state.storeGroup[0].lngStoreGroup : ''
const searchStoreName = ref('')
const disableStoreCode = ref(true);
const gridOptions = {
  immutableData: true,
}
const storeType = ref('0');
const handleGroupCdDisabledUpdate = (newValue) => {
    storeType.value = newValue;
}
const storeCd = ref('0');
const handleStoreCd = (newValue) => {
    storeCd.value = newValue
}
function exportToExcel() {
    gridApi.value.exportDataAsExcel();
}
const groupCdDisabled = ref(true);
const defaultColDef = ref({
    minWidth: 20,
    resizable: true,
    suppressMenu : true ,
    enableCellChangeFlash: true,
  });
const onGridReady = (params) => {
  gridApi.value = params.api; // 그리드 API 저장
};
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
const searchStore = async() => {
     lngMultiPriceGroupCodes.value = [];
     lngStoreAttrs.value = [];
     lngJoinTypes.value = [];
     lngSubLeases.value = [];
     lngStoreAreas.value = [];
     lngSaleTypes.value = [];
     lngSupervisors.value = [];
      store.dispatch("convertLoading", true);
      const response1 = await getMultiPrice(groupCd);

      const result1 = response1.data.recordsets[0];
      for (let i = 0; i < result1.length; i++) {
        lngMultiPriceGroupCodes.value.push(result1[i]);
      }
      lngMultiPriceGroupCode.value = result1[0].lngMultiPriceGroupCode
      const response2 = await storeAttr(groupCd,storeType.value);
      
      const result2 = response2.data.recordsets[0];
      for (let i = 0; i < result2.length; i++) {
        lngStoreAttrs.value.push(result2[i])
        
      }
      lngStoreAttr.value = result2[0].lngStoreAttr

      const response3 = await joinType_query(groupCd);

      const result3 = response3.data.recordsets[0];
      for (let i = 0; i < result3.length; i++) {
        lngJoinTypes.value.push(result3[i])
      }
      lngJoinType.value = result3[0].lngCode

      const response4 = await subLease_query(groupCd);

      const result4 = response4.data.recordsets[0]
      for (let i = 0; i < result4.length; i++) {
        lngSubLeases.value.push(result4[i])
      }
      lngSubLease.value = result4[0].lngCode
      const response5 = await storeArea(groupCd);

      const result5 = response5.data.recordsets[0];
      for (let i = 0; i < result5.length; i++) {
        lngStoreAreas.value.push(result5[i])
      }
      lngStoreArea.value = result5[0].lngStoreArea
      const response6 = await INS006_select(groupCd);

      const result6 = response6.data.recordsets[0];
      for (let i = 0; i < result6.length; i++) {
        lngSaleTypes.value.push(result6[i])
      }
      if (result6.length ==0 ){
        lngSaleType.value = '0'
        lngSaleTypes.value.push({
          lngSaleType : '0',
          strSaleType : '없음'
        })
      } else {
        lngSaleType.value = result6[0].lngSaleType 
      }
      
       const response7 = await INS004_select(groupCd)

      const result7 = response7.data.recordsets[0];
      for (let i = 0; i < result7.length; i++) {
        lngSupervisors.value.push(result7[i])
      }
      lngSupervisor.value = result7[0].lngSupervisor

      const response = await store_query(groupCd, storeType.value , storeCd.value , searchStoreName.value);
        
       const result = response.data.recordsets[0];
    
       updateColumns(result)
       store.dispatch("convertLoading", false);
    
       
}
const insertupdated =ref();
const deleteStore = async() => {
  store.dispatch("convertLoading", true);
  const selectedRowNode = gridApi.value.getSelectedNodes();

  const response = await store_delete(Array(selectedRowNode.length).fill(groupCd).join(','),selectedRowNode.map(row => row.data.lngStoreCode).join(',')
)
 

  if (response.status == '200'){
    Swal.fire('삭제 되었습니다.')
  }
  store.dispatch("convertLoading", false);
  searchStore();
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
const updateRowData = async() => {
  store.dispatch("convertLoading", true);
  const rowsToSave = [];
  const rowsToUpdate = [];
  gridApi.value.forEachNode((node) => {
  if (node.data.isNew) {  // isNew 속성이 true인 경우에만 필터링
    rowsToSave.push(node.data)
  } else if (node.data.isUpdate) {
    rowsToUpdate.push(node.data)
 
  }
});

let result = 0;
  if (rowsToSave.length > 0) {

  const finalObject = {
  P_lngCompanyCode: Array(rowsToSave.length).fill(groupCd).join(','),
  P_lngStoreGroup: Array(rowsToSave.length).fill(groupCd).join(','),
  P_lngStoreCode: rowsToSave.map(row => row.lngStoreCode).join(','),
  P_strName: rowsToSave.map(row => row.strName).join(','),
  P_strRegistNo: rowsToSave.map(row => row.strRegistNo).join(','),
  P_strDirector: rowsToSave.map(row => row.strDirector).join(','),
  P_strDealType: rowsToSave.map(row => row.strDealType).join(','),
  P_strDealKind: rowsToSave.map(row => row.strDealKind).join(','),
  P_strZipCode: rowsToSave.map(row => row.strZipCode).join(','),
  P_strAddress: rowsToSave.map(row => row.strAddress).join(','),
  P_strAddressEtc: rowsToSave.map(row => row.strAddressEtc).join(','),
  P_strTel: rowsToSave.map(row => row.strTel).join(','),
  P_strFax: rowsToSave.map(row => row.strFax).join(','),
  P_dtmOpenDate: rowsToSave.map(row => row.dtmOpenDate).join(','),
  P_lngJoinType: rowsToSave.map(row => row.lngJoinType).join(','),
  P_lngSubLease: rowsToSave.map(row => row.lngSubLease).join(','),
  P_lngStoreAttr: rowsToSave.map(row => row.lngStoreAttr).join(','),
  P_lngStoreArea: rowsToSave.map(row => row.lngStoreArea).join(','),
  P_strConvCode: rowsToSave.map(row => row.strConvCode).join(','),
  P_lngUserID: rowsToSave.map(row => row.lngUserID).join(',') ,
  P_lngMultiPriceGroupCode : rowsToSave.map(row => row.lngMultiPriceGroupCode).join(',') 
};

const response = await store_insert(finalObject);
       
        if (response.status === 200) {
             result = 200
         }
  }

  if (rowsToUpdate.length > 0) {

const finalObject1 = {
      P_lngCompanyCode: Array(rowsToUpdate.length).fill(groupCd).join(',') ,
      P_lngStoreGroup: Array(rowsToUpdate.length).fill(groupCd).join(',') ,
      P_lngStoreCode: rowsToUpdate.map(row => row.lngStoreCode).join(',') ,
      P_strName: rowsToUpdate.map(row => row.strName).join(',') ,
      P_strRegistNo: rowsToUpdate.map(row => row.strRegistNo).join(','),
      P_strDirector: rowsToUpdate.map(row => row.strDirector).join(','),
      P_strDealType: rowsToUpdate.map(row => row.strDealType).join(','),
      P_strDealKind: rowsToUpdate.map(row => row.strDealKind).join(','),
      P_strZipCode: rowsToUpdate.map(row => row.strZipCode).join(','),
      P_strAddress: rowsToUpdate.map(row => row.strAddress).join(','),
      P_strAddressEtc: rowsToUpdate.map(row => row.strAddressEtc).join(','),
      P_strTel: rowsToUpdate.map(row => row.strTel).join(','),
      P_strFax: rowsToUpdate.map(row => row.strFax).join(','),
      P_dtmOpenDate: rowsToUpdate.map(row => row.dtmOpenDate).join(','),
      P_lngJoinType: rowsToUpdate.map(row => row.lngJoinType).join(','),
      P_lngSubLease: rowsToUpdate.map(row => row.lngSubLease).join(','),
      P_lngStoreAttr: rowsToUpdate.map(row => row.lngStoreAttr).join(','),
      P_lngStoreArea: rowsToUpdate.map(row => row.lngStoreArea).join(','),
      P_strConvCode: rowsToUpdate.map(row => row.strConvCode).join(','),
      P_lngUserID: rowsToUpdate.map(row => row.lngUserID).join(',')
};

const response = await store_update(finalObject1)
     
      if (response.status === 200) {
           result = 200
       }
}
  if (result === 200) {
        Swal.fire('저장 되었습니다.');
    }
    store.dispatch("convertLoading", false);
  searchStore()
}
const updateColumns = (result) => {
    let column2 = [];
    column2.push(
        {
            field : 'NO',
            headerName: 'No',
        valueGetter: (params) => {
        return params.node.rowIndex + 1;  // 0부터 시작하는 인덱스에 1을 더해 순번을 만듦
    },
    sortable: false,  // 정렬 비활성화 (순번이므로)
    filter: false,    // 필터 비활성화
    width: 80 ,        // 적절한 넓이 설정,
    lockPosition : true
        }
    )
   
    const styleTag = document.createElement("style");
    document.head.appendChild(styleTag);
    
    for (let i = 0; i < tabInitSetArray.value.length ; i++) {
      const headerclass = `headerclass-${i}`;
      const hcolor = tabInitSetArray.value[i].strHdColor;
      const hbkcolor = tabInitSetArray.value[i].strHdBkColor;
      styleTag.innerHTML += `.${headerclass} {
          background-color : ${hbkcolor} !important;
          color : ${hcolor} !important ;
       
      }`
      
      // 컬럼마다의 값을 할당 밑은 조건에 해당할때 형식이나 값을 지정해줌.
       const column = {
        field: tabInitSetArray.value[i].strColID,
        headerName: tabInitSetArray.value[i].strHdText,
        width: tabInitSetArray.value[i].intHdWidth,
        headerClass: headerclass,
        editable : tabInitSetArray.value[i].strEdit === 'true' ? true : false,
        cellStyle : {
          textAlign : tabInitSetArray.value[i].strAlign
        },
        lockPosition : tabInitSetArray.value[i].strHdFix === 'true' ? false : true ,
      }

      if( tabInitSetArray.value[i].intHdWidth == '0'){
        column.hide = true
      }
      if ( tabInitSetArray.value[i].strColID =='lngCheck'){
        column.checkboxSelection= true ;
        column.headerCheckboxSelection = true ;
      }
      if(tabInitSetArray.value[i].strColID =='lngSaleType'){
        column.cellRenderer = (params) =>{
          if(params.value){

           if(lngSaleTypes.value.length == 0){
             return ''
           } else {
            return lngSaleTypes.value.find(item => item.lngSaleType == params.value).strSaleType
           }
        }
      }
      }
      if(tabInitSetArray.value[i].strColID == 'lngSupervisor'){
        column.cellRenderer = (params) =>{
          if(params.value !='' && params.value){

           if(lngSupervisors.value.length == 0){
             return '없음'
           } else {
            return lngSupervisors.value.find(item => item.lngSupervisor == params.value).strName
           }
          }
        }
      }
      if(tabInitSetArray.value[i].strColID == 'dtmOpenDate'){
        column.cellRenderer = (params) =>{
        
          if(params.value !='' && params.value !=null){

          
          const rawDate = params.value.toString(); // 주어진 데이터 (예: 20110302)
        
        // 날짜 형식을 변환 (2011-03-02)
        const formattedDate = `${rawDate.substring(0, 4)}-${rawDate.substring(4, 6)}-${rawDate.substring(6, 8)}`;

        return formattedDate;
        }
      }
      }

      if(tabInitSetArray.value[i].strColID == 'lngMultiPriceGroupCode'){
        column.cellRenderer = (params) =>{
          if(params.value != null ){
          if(lngMultiPriceGroupCodes.value.length == 0){
             return ''
           } else {
            return lngMultiPriceGroupCodes.value.find(item => item.lngMultiPriceGroupCode == params.value).strMultiPriceGroupName
           }
          } 
      }
      }

      if(tabInitSetArray.value[i].strColID === 'lngStoreAttr'){
        column.cellRenderer = (params) =>{
          if(params.value !='' && params.value){
          if(lngStoreAttrs.value.length == 0 || params.value == '12'){
             return ''
           } else {
            return lngStoreAttrs.value.find(item => item.lngStoreAttr == params.value).strName
           }
          } 
        }
      }
      

      if(tabInitSetArray.value[i].strColID == 'lngJoinType'){
       
        column.cellRenderer = (params) =>{
         
          if(params.value != '0' && params.value !='' && params.value !=null ) {
          if(lngJoinTypes.value.length == 0 || params.value == '12'){
             return ''
           } else {
            return lngJoinTypes.value.find(item => item.lngCode == params.value).strName
           }
          } else {
            return ''
          }
      }
      }


      if(tabInitSetArray.value[i].strColID == 'lngSubLease'){
        column.cellRenderer = (params) =>{
          if(params.value !='' && params.value){

          if(lngSubLeases.value.length == 0 ){
             return ''
           } else {
            return lngSubLeases.value.find(item => item.lngCode == params.value ).strName
           }
          }
        
      }
      }

      if(tabInitSetArray.value[i].strColID == 'lngStoreArea'){
        column.cellRenderer = (params) =>{
          if(params.value !='' && params.value){
          if(lngStoreAreas.value.length == 0 || params.value == '12'){
             return ''
           } else {
            return lngStoreAreas.value.find(item => item.lngStoreArea == params.value).strName
           }
          }
      }
      }
    column2.push(column);
    }
    rowData.value = result.map(item => ({
      lngStoreCode: item.lngStoreCode,
      strName: item.strName,
      strRegistNo: item.strRegistNo,
      strDirector: item.strDirector,
      strDealType: item.strDealType,
      strDealKind: item.strDealKind,
      lngJoinType: item.lngJoinType,
      strJoinTypeName: item.strJoinTypeName,
      lngSubLease: item.lngSubLease,
      strSubLeaseName: item.strSubLeaseName,
      lngStoreAttr: item.lngStoreAttr,
      strStoreAttrName: item.strStoreAttrName,
      lngStoreArea: item.lngStoreArea,
      strStoreAreaName: item.strStoreAreaName,
      dtmOpenDate: item.dtmOpenDate,
      strTel: item.strTel,
      strFax: item.strFax,
      strZipCode: item.strZipCode,
      strAddress: item.strAddress,
      strAddressEtc: item.strAddressEtc,
      strConvCode: item.strConvCode,
      strPhone: item.strPhone,
      lngBEP: item.lngBEP,
      lngFloorSpace: item.lngFloorSpace,
      lngLease: item.lngLease,
      strCheck: item.strCheck,
      lngSaleType: item.lngSaleType,
      dtmStop: item.dtmStop,
      strDev1: item.strDev1,
      lngTable: item.lngTable,
      lngSupervisor: item.lngSupervisor,
      strStoreHistory: item.strStoreHistory,
      lngMultiPriceGroupCode: item.lngMultiPriceGroupCode,
      strMultiPriceGroupName: item.strMultiPriceGroupName
    }));
   
    colDefs2.value = column2;
    
}
const updateGridValue = (event) => {

  let inputText = event.target.value;
  const inputName = event.target.name ;

  const selectedRowNode = gridApi.value.getSelectedNodes()[0];
  
   if (selectedRowNode) {
  // 선택한 행의 데이터를 업데이트
   if (!isNaN(Number(inputText)) && inputText !='') {
    inputText = Number(inputText)
  }
   selectedRowNode.data[inputName] = inputText; // 값 업데이트
   selectedRowNode.data.isUpdate = true ;
  // 업데이트 트랜잭션 적용
  //insertupdated.value += gridApi.value.applyTransaction({ update: [selectedRowNode.data] });
} 
    gridApi.value.refreshCells({ rowNodes: [selectedRowNode] })

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
const dtmOpenDate2 = ref();
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

const selectedRowData2 = ref('');
const onRowClicked = (event) => {
    const selectedRowData = event.data; // 클릭한 행의 데이터
    
    if ( selectedRowData.isNew == true ) {
      disableStoreCode.value = false;
    
    } else {
      disableStoreCode.value = true;
    }
    // 상태에 값을 설정하여 input/select에 전달
    selectedRowData2.value = event.node
    lngStoreCode.value = selectedRowData.lngStoreCode; 
    strName.value = selectedRowData.strName; 
    strRegistNo.value = selectedRowData.strRegistNo; 
    strDirector.value = selectedRowData.strDirector; 
    strDealType.value = selectedRowData.strDealType; 
    strDealKind.value = selectedRowData.strDealKind; 
    lngJoinType.value = selectedRowData.lngJoinType; 
    lngSubLease.value = selectedRowData.lngSubLease; 
    lngStoreAttr.value = selectedRowData.lngStoreAttr; 
    lngStoreArea.value = selectedRowData.lngStoreArea; 
    dtmOpenDate.value = selectedRowData.dtmOpenDate ; 
    strTel.value = selectedRowData.strTel; 
    strFax.value = selectedRowData.strFax; 
    strZipCode.value = selectedRowData.strZipCode; 
    strAddress.value = selectedRowData.strAddress; 
    strAddressEtc.value = selectedRowData.strAddressEtc; 
    strPhone.value = selectedRowData.strPhone; 
    strConvCode.value = selectedRowData.strConvCode; 
    lngBEP.value = selectedRowData.lngBEP; 
    lngFloorSpace.value = selectedRowData.lngFloorSpace; 
    lngLease.value = selectedRowData.lngLease; 
    lngSaleType.value = selectedRowData.lngSaleType; 
    dtmStop.value = selectedRowData.dtmStop; 
    strDev1.value = selectedRowData.strDev1; 
    lngTable.value = selectedRowData.lngTable; 
    strStoreHistory.value = selectedRowData.strStoreHistory; 
    lngMultiPriceGroupCode.value = selectedRowData.lngMultiPriceGroupCode; 
  
};


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