<template>
    <div class="h-[80%]">
        <div class="flex justify-between items-center w-full overflow-y-auto">
    <div class="flex justify-start  w-full pl-12 pt-4">
               <div class="flex justify-start"><h1 class="font-bold text-sm md:text-2xl w-full">
                매장별 결제코드 등록
               </h1></div>
                
               </div>
               <div class="flex justify-center mr-10 space-x-2 pr-5">

                 <button @click="searchButton" class="button search">조회</button>
                  <button @click="saveButton" class="button save">저장</button>
                  <button @click="copyButton" class="button copy">복사</button>
            </div>
            
  
  </div>
  <div class="flex justify-start  space-x-5 bg-gray-200 rounded-lg h-16 items-center mt-3">
  <PickStore11 @update:storeGroup="handleGroupCd" @update:storeCd="handleStoreCd" >
  </PickStore11>
  </div>
  <span class="grid grid-rows-1 grid-cols-2 mt-5"><div class="ml-10 flex justify-start font-bold text-xl">결제코드 목록</div><div class="flex ml-7"><div class="flex justify-start font-bold text-xl">매장에 할당된 결제코드 목록</div></div></span>
    <div class="w-[90%] ml-10 h-full grid grid-cols-[5fr_1fr_5fr]">
        
        <Realgrid :progname="'MST36_055INS_VUE'" :progid="1" :rowData="rowData"  @selectedIndex="selectedIndex"  @checkedRowData="checkedRowData" @updatedRowData="updatedRowData" :selectionStyle="'singleRow'"   :rowStateeditable="false" :addField="'new'" :labelingColumns="'lngAmountType'" :valuesData="valuesData" :labelsData="labelsData" :showCheckBar="true" :notsoftDelete="true" :setAllCheck="setAllCheck" :deleteRow4="deleteRow4" ></Realgrid>
        <div class="flex flex-col justify-center items-center space-y-10"><button @click="moveRight"><img src="../../assets/table-right.svg" alt=""></button><button @click="moveLeft"><img src="../../assets/table-left.svg" alt=""></button></div>
        <Realgrid :progname="'MST36_055INS_VUE'" :progid="1" :rowData="rowData2"  @selectedIndex="selectedIndex"  @checkedRowData="checkedRowData2" @updatedRowData="updatedRowData2" :selectionStyle="'singleRow'"    :rowStateeditable="false" :addField="'new'" :labelingColumns="'lngAmountType'" :valuesData="valuesData" :labelsData="labelsData":showCheckBar="true" :notsoftDelete="true" :setAllCheck="setAllCheck2" :deleteRow4="deleteRow5"></Realgrid>
       
    </div>

    </div>
</template>

<script setup>
import {  getAllPayList,  savePayGroup } from '@/api/master';
import PickGroup from '@/components/pickGroup.vue';
import PickStore11 from '@/components/pickStore11.vue';
import PickStore3 from '@/components/pickStore3.vue';

import Realgrid from '@/components/realgrid.vue';
import Swal from 'sweetalert2';
import { ref } from 'vue';
import { useStore } from 'vuex';

const rowData = ref([])
const rowData2 = ref([])
const groupCd = ref()
const storeCd = ref(0)
const afterSearch = ref(false);

const clickStoreCd = ref(0)
const clickStoreNm = ref()
const addNew = ref(true)
const valuesData = ref([['0','1','2']])
const labelsData = ref([['할인','지불' ,'할증']])
const addRow = ref(false)
const changeNow  =ref(false)
const changeValue2  =ref()
const changeColid  =ref()
const changeRow  =ref()
const gridvalue1 = ref()
const gridvalue2 = ref()
const gridvalue3 = ref()
const gridvalue4= ref(false)
const gridvalue5 = ref()


const selectedIndex = (newValue) => {

    changeRow.value = newValue
    console.log(changeRow.value)
}
const addButton = () => {
  if(afterSearch.value == false){
    Swal.fire({
      title: '조회를 먼저 해주세요.',
      confirmButtonText: '확인',
    }
    )
    return ;
  }
    addRow.value = !addRow.value
}
const deleteRow4 = ref(false)
const deleteRow5 = ref(false)

const disableCd = ref(false)

const handleGroupCd = (newValue) => {
    groupCd.value = newValue
   
}
const handleStoreCd = (newvalue) => {
    storeCd.value = newvalue
    rowData.value = []
}

const updateRow = ref([])
const checkedRowData = (newValue) => {
    updateRow.value = newValue
    console.log(newValue)
}
const updateRow2 = ref()
const checkedRowData2 = (newValue) => {
    updateRow2.value = newValue
    console.log(newValue)
}

const updatedRowData = (newValue) => {
  rowData.value = newValue
}
const updatedRowData2 = (newValue) => {
  rowData2.value = newValue
}
const addrowDefault = ref()
const exporttoExcel = ref(false)
const addrowProp = ref('lngStoreGroup')
const store = useStore();
const excelButton = () => {
    if(afterSearch.value == false){
    Swal.fire({
      title: '조회를 먼저 해주세요.',
      confirmButtonText: '확인',
    }
    )
    return ;
  }
    exporttoExcel.value = !exporttoExcel.value
}
const searchButton = async() => {
   if(storeCd.value == 0){
    Swal.fire({
      title: '경고',
      text: '매장명을 선택해주세요.',
      icon: 'warning',
      confirmButtonText: '확인'
    }
    )
    return ;
   }
   store.state.loading = true;
   try {
    rowData.value = []
    rowData2.value = []

     let res;
     
     res = await getAllPayList( groupCd.value , storeCd.value )
     console.log(res)
     rowData.value = res.data.PAYCODE
     rowData2.value = res.data.STOREPAYCODE
     updateRow.value = JSON.parse(JSON.stringify(rowData.value))
   
      afterSearch.value = true;
   } catch (error) {
       afterSearch.value = false;
 
   } finally {
     

       store.state.loading = false; 
               
   }
}
const storeNm = (newValue) => {
  clickStoreNm.value = newValue
}

const saveButton = async() => {
  console.log(updateRow.value)
if(afterSearch.value == false) {
    Swal.fire({
      title: '경고',
      text: '조회를 먼저 진행해주세요.',
      icon: 'warning',
      confirmButtonText: '확인'
    })
    return ;
  }
  if(JSON.stringify(updateRow.value) === JSON.stringify(rowData.value) ) {
    Swal.fire({
      title: '경고',
      text: '변경된 사항이 없습니다.',
      icon: 'warning',
      confirmButtonText: '확인'
    })
    return ;
  }


 

  Swal.fire({
    title: '저장',
      text: '저장 하시겠습니까?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: '저장',
      cancelButtonText: '취소'
}).then(async (result) => {
  if(result.isConfirmed){
    store.state.loading = true;
  try {
    
   console.log(rowData.value)
   console.log(rowData2.value)


Swal.fire({
      title: '저장 되었습니다.',
      confirmButtonText: '확인',
})
store.state.loading = false
  } catch (error) {
    console.log(error)
    Swal.fire({
      title: '저장이 실패되었습니다.',
      confirmButtonText: '확인',
  })
  } finally {
    store.state.loading = false
    searchButton();
  }
}
})
 

}
const setAllCheck = ref(false)
const setAllCheck2 = ref(false)
const moveRight = () => {
  console.log(updateRow.value)
  for(var i=0 ; i <updateRow.value.length ; i++){
     rowData2.value.push({ lngCode : updateRow.value[i].lngCode , strName: updateRow.value[i].strName  , lngAmountType:  updateRow.value[i].lngAmountType  })
  }
  updateRow.value = []
 
  deleteRow4.value = !deleteRow4.value
  rowData2.value = [...rowData2.value]
 
  console.log(rowData.value)
}
const moveLeft = () => {

  console.log(updateRow2.value)
 
  for(var i=0 ; i <updateRow2.value.length ; i++){
     rowData.value.push({ lngCode : updateRow2.value[i].lngCode , strName: updateRow2.value[i].strName  , lngAmountType:  updateRow2.value[i].lngAmountType  })
  }
  updateRow2.value = []

 
  deleteRow5.value = !deleteRow5.value
  rowData.value = [...rowData.value]
  console.log(rowData2.value)
}
</script>

<style scoped>

</style>