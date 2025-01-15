<template>
    <div class="h-[80%]">
        <div class="flex justify-between items-center w-full overflow-y-auto">
    <div class="flex justify-start  w-full pl-12 pt-4">
               <div class="flex justify-start"><h1 class="font-bold text-sm md:text-2xl w-full">
                신용카드 매입사 등록.
               </h1></div>
                
               </div>
               <div class="flex justify-center mr-10 space-x-2 pr-5">

                 <button @click="searchButton" class="button search">조회</button>
                  <button @click="saveButton" class="button save">저장</button>
                
            </div>
            
  
  </div>
  <div class="flex justify-start  space-x-5 bg-gray-200 rounded-lg h-16 items-center mt-3">
  <PickStore3 @update:storeGroup="handleGroupCd" @update:storeCd="handleStoreCd" @storeNm="storeNm"  @update:ischanged="handleinitAll">
  </PickStore3>
  </div>
  <span class="grid grid-rows-1 grid-cols-2 mt-5"><div class="ml-10 flex justify-start font-bold text-xl">카드 정보</div><div class="flex justify-between ml-44"><div class="flex justify-start font-bold text-xl">상세정보</div><div class="mr-20"><button class="whitebutton" @click="addButton">추가</button><button class="whitebutton" @click="deleteButton">삭제</button></div></div></span>
  <div class="grid grid-rows-1 grid-cols-2 h-full w-full justify-center mt-2">
    
    <div class="w-[110%] ml-10 h-full">
        
        <Realgrid :progname="'MST43_001INS_VUE'" :progid="1" :rowData="rowData" @clickedRowData="clickedRowData"  @selcetedrowData="selcetedrowData" @updatedRowData="updatedRowData" :selectionStyle="'singleRow'" :setNumberformatColumn="'lngRate'" :labelingColumns="'lngStoreCode'" :valuesData="valuesData" :labelsData="labelsData" :changeNow="changeNow" :changeValue2="changeValue2" :changeColid="changeColid" :changeRow="changeRow" @selectedIndex="selectedIndex" :addRow4="addRow" :deleteRow2="deleteRow" :addrowDefault="addrowDefault" :addrowProp="addrowProp"  :rowStateeditable="false" :addField="'new'"></Realgrid></div>
       
        <div class="grid grid-cols-[1fr,6fr] grid-rows-6 w-[70%] ml-44 h-[30%] ">
        <div class="border flex h-full items-center text-sm font-semibold justify-center bg-gray-100 text-blue-500 rounded-tl-lg">*매장명</div>
        <div class="border flex h-full items-center text-sm font-semibold justify-center rounded-tr-lg"><input type="text" class="border text-sm rounded-md w-full pl-2 h-full disabled:bg-gray-200" v-model="gridvalue1" name="gridvalue1" @input="changeInfo" disabled></div>
        <div class="border flex h-full items-center text-sm font-semibold justify-center bg-gray-100 text-blue-500">*매입사코드</div>
        <div class="border flex h-full items-center text-sm font-semibold justify-center"><input type="text" class="border text-sm rounded-md w-full pl-2 h-full disabled:bg-gray-200" v-model="gridvalue2" name="gridvalue2" @input="changeInfo" :disabled="addNew" ></div>
        <div class="border flex h-full items-center text-sm font-semibold justify-center bg-gray-100">매입사명</div>
        <div class="border flex h-full items-center text-sm font-semibold justify-left "><input type="text" class="border text-sm rounded-md w-full pl-2 h-full" v-model="gridvalue3" name="gridvalue3" @input="changeInfo"></div>
        <div class="border flex h-full items-center text-sm font-semibold justify-center bg-gray-100 ">영문명</div>
        <div class="border flex h-full items-center text-sm font-semibold justify-center rounded-br-lg"><input type="text" class="border text-sm rounded-md w-full pl-2 h-full" v-model="gridvalue4" name="gridvalue4" @input="changeInfo"></div>
        <div class="border flex h-full items-center text-sm font-semibold justify-center bg-gray-100 ">적용비율</div>
        <div class="border flex h-full items-center text-sm font-semibold justify-center rounded-br-lg"><input type="text" class="border text-sm rounded-md w-full pl-2 h-full" v-model="gridvalue5" name="gridvalue5" @input="changeInfo"  ></div>
        <div class="border flex h-full items-center text-sm font-semibold justify-center bg-gray-100 rounded-bl-lg">인터페이스코드</div>
        <div class="border flex h-full items-center text-sm font-semibold justify-center rounded-br-lg"><input type="text" class="border text-sm rounded-md w-full pl-2 h-full" v-model="gridvalue6" name="gridvalue6" @input="changeInfo"></div>
        <input type="hidden" class="border text-sm rounded-md w-full pl-2 h-full disabled:bg-gray-200" v-model="gridvalue7" name="gridvalue7" @input="changeInfo" disabled>
     
    </div>
  </div>
    </div>
</template>

<script setup>
import { getCardInfo, saveCreditCardEnroll } from '@/api/master';
import { getChargerInfo, saveEMP } from '@/api/miattend';
import PickStore11 from '@/components/pickStore11.vue';
import PickStore3 from '@/components/pickStore3.vue';

import Realgrid from '@/components/realgrid.vue';
import Swal from 'sweetalert2';
import { ref } from 'vue';
import { useStore } from 'vuex';

const rowData = ref([])
const groupCd = ref()
const storeCd = ref(0)
const afterSearch = ref(false);
const empCode = ref()
const empName = ref()
const clickStoreCd = ref(0)
const clickStoreNm = ref()
const addNew = ref(true)
const valuesData = ref([])
const labelsData = ref([])
const addRow = ref(false)
const changeNow  =ref(false)
const changeValue2  =ref()
const changeColid  =ref()
const changeRow  =ref()
const gridvalue1 = ref()
const gridvalue2 = ref()
const gridvalue3 = ref()
const gridvalue4= ref()
const gridvalue5 = ref()
const gridvalue6= ref()
const gridvalue7= ref()

const selectedIndex = (newValue) => {

    changeRow.value = newValue
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

  if(clickStoreCd.value == '0'){
    Swal.fire({
      title: '매장을 선택하세요.',
      confirmButtonText: '확인',
    }
    )
    return ;
  }
   
    addrowDefault.value = clickStoreCd.value+','+clickStoreNm.value
    addRow.value = !addRow.value
}
const deleteRow = ref(false)
const deleteButton = () => {
  if(afterSearch.value == false){
    Swal.fire({
      title: '조회를 먼저 해주세요.',
      confirmButtonText: '확인',
    }
    )
    return ;
  }
    deleteRow.value = !deleteRow.value
}
const disableCd = ref(false)
const clickedRowData = (newValue) => {
  gridvalue1.value = newValue[7]
  gridvalue2.value = newValue[2]
  gridvalue3.value = newValue[3]
  gridvalue4.value = newValue[4]
  gridvalue5.value = newValue[5] == undefined ?  newValue[5] : newValue[5].toFixed(2)
  gridvalue6.value = newValue[6]
  gridvalue7.value = newValue[1]
   if(newValue[9] == true){
    addNew.value = false
   } else {
     addNew.value = true
   }

}
const handleGroupCd = (newValue) => {
    groupCd.value = newValue
}
const handleStoreCd = (newValue) => {
    rowData.value = []
    gridvalue1.value =''
    gridvalue2.value =''
    gridvalue3.value =''
    gridvalue4.value =''
    gridvalue5.value =''
    gridvalue6.value =''
    gridvalue7.value =''
    storeCd.value = newValue
    clickStoreCd.value = newValue
    console.log(newValue)
}
const updateRow = ref([])
const updatedRowData = (newValue) => {
    updateRow.value = newValue
    console.log(newValue)
}

const changeInfo = (e) => {
    const rowName = e.target.name 
    const rowValue = e.target.value

    if(rowName == 'gridvalue5'){
      const regex = /^\d*\.?\d{0,2}$/;

// 값이 숫자 형식이 아닌 경우 처리 (빈 문자열도 처리)
if (rowValue === '' || regex.test(rowValue)) {
  // 0 이상 100 이하 체크 (빈 문자열은 조건에서 제외)
  const isInRange = Number(rowValue) >= 0 && Number(rowValue) <= 100;

  if (isInRange) {
    // 소수점 둘째 자리까지 포맷팅하여 적용
    e.target.value = (parseFloat(rowValue)).toFixed(2); 
  } else {
    // 범위 초과시 입력을 허용하지 않음
    e.target.value = rowValue.slice(0, -1);
    return;
  }
} else {
  // 잘못된 문자가 들어오면 제거
  e.target.value = rowValue.slice(0, -1);
  return;
}
      changeColid.value = 'lngRate'
      changeValue2.value = rowValue
    } else if (rowName == 'gridvalue2') {
      
        changeValue2.value = rowValue
        changeColid.value = 'strBuyCode'
    } else if (rowName == 'gridvalue3'){
        changeValue2.value = rowValue
        changeColid.value = 'strBuyName'
    } else if(rowName == 'gridvalue4') {
        changeValue2.value = rowValue
        changeColid.value = 'strBuyEName'
    } else if(rowName == 'gridvalue6') {
        changeValue2.value = rowValue
        changeColid.value = 'strIFCode'
    }
    changeNow.value = !changeNow.value

}

const addrowDefault = ref('')
const storeList = ref([])
const addrowProp = ref('lngStoreCode,strStoreName')
const store = useStore();
const searchButton = async() => {
   
   store.state.loading = true;
   try {
     let res;
    
     res = await getCardInfo( groupCd.value , storeCd.value)

     rowData.value = res.data.CARDLIST
     storeList.value = res.data.STOREINFO
     updateRow.value = JSON.parse(JSON.stringify(rowData.value))
     console.log(res)
      afterSearch.value = true;
   } catch (error) {
       afterSearch.value = false;
 
   } finally {
     
       let newlabeldataarr = storeList.value.map(item => item.strName)
       labelsData.value.push(newlabeldataarr)
       let newvaluedataarr = storeList.value.map(item => item.lngStoreCode)
       valuesData.value.push(newvaluedataarr)
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

   const validateRow = updateRow.value.filter(item =>  item.new == true && (item.strBuyCode == '' || item.strBuyCode == undefined )).length
  if(validateRow > 0 ) {
    Swal.fire({
      title: '경고',
      text: '미입력된 매입사코드가 존재합니다. 확인해주세요.',
      icon: 'warning',
      confirmButtonText: '확인'
    })
    return ;
  }

  const groupedByStoreCode = updateRow.value
  .reduce((acc, item) => {
    // 그룹화, 같은 lngStoreCode를 키로 사용
    if (!acc[item.lngStoreCode]) {
      acc[item.lngStoreCode] = [];
    }
    acc[item.lngStoreCode].push(item);
    return acc;
  }, {});

// 각 그룹에서 strBuyCode 중복 체크
const duplicateCount = Object.values(groupedByStoreCode)
  .map(group => {
    // 각 그룹 내에서 strBuyCode 중복 체크
    const buyCodeCount = group.reduce((acc, item) => {
      acc[item.strBuyCode] = (acc[item.strBuyCode] || 0) + 1;
      return acc;
    }, {});
    
    // 중복된 strBuyCode 개수 세기
    return Object.values(buyCodeCount).filter(count => count > 1).length;
  })
  .reduce((acc, count) => acc + count, 0);  // 모든 그룹의 중복 개수를 합산

console.log(duplicateCount);

if(duplicateCount > 0 ) {
    Swal.fire({
      title: '경고',
      text: '중복된 매입사코드가 존재합니다. 확인해주세요.',
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
    


   const chargeStoreCd = updateRow.value.filter(item => item.deleted != true && item.new != true).map(item => item.lngStoreCode)
   const chargeBuyCd = updateRow.value.filter(item => item.deleted != true && item.new != true).map(item => item.strBuyCode)
   const chargeBuyNm = updateRow.value.filter(item => item.deleted != true && item.new != true).map(item => item.strBuyName)
   const chargeBuyENm= updateRow.value.filter(item => item.deleted != true && item.new != true).map(item => item.strBuyEName)
   const chargelngRate= updateRow.value.filter(item => item.deleted != true && item.new != true).map(item => item.lngRate)
   const chargestrIFCode= updateRow.value.filter(item => item.deleted != true && item.new != true).map(item => item.strIFCode)
  
   const insertStoreCd = updateRow.value.filter(item => item.deleted != true && item.new == true).map(item => item.lngStoreCode)
   const insertBuyCd = updateRow.value.filter(item => item.deleted != true && item.new == true).map(item => item.strBuyCode)
   const insertBuyNm = updateRow.value.filter(item => item.deleted != true && item.new == true).map(item => item.strBuyName)
   const insertBuyENm= updateRow.value.filter(item => item.deleted != true && item.new == true).map(item => item.strBuyEName)
   const insertlngRate= updateRow.value.filter(item => item.deleted != true && item.new == true).map(item => item.lngRate)
   const insertstrIFCode= updateRow.value.filter(item => item.deleted != true && item.new == true).map(item => item.strIFCode)

 
   const deleteCode = updateRow.value.filter(item => item.deleted == true).map(item => item.strBuyCode)
   const deleteStoreCd = updateRow.value.filter(item => item.deleted == true).map(item => item.lngStoreCode)
   const res = await saveCreditCardEnroll(groupCd.value , storeCd.value ,chargeStoreCd.join(','), chargeBuyCd.join(','),
   chargeBuyNm.join(',') , chargeBuyENm.join(',') , chargelngRate.join(',') , chargestrIFCode.join(',') 
   , insertStoreCd.join(',') ,insertBuyCd.join(',') , insertBuyNm.join(',') , insertBuyENm.join(','), 
   insertlngRate.join(',') , insertstrIFCode.join(',') , deleteStoreCd.join(',') ,deleteCode.join(','))
   console.log(res)
Swal.fire({
      title: '저장 되었습니다.',
      confirmButtonText: '확인',
})
  } catch (error) {
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
</script>

<style scoped>

</style>