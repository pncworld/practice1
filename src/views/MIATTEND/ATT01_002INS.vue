<template>
  <div class="h-[80%]">
    <div class="flex justify-between items-center w-full overflow-y-auto">
      <div class="flex justify-start  w-full pl-12 pt-4">
        <div class="flex justify-start">
          <h1 class="font-bold text-sm md:text-2xl w-full">
            사원 등록.
          </h1>
        </div>

      </div>
      <div class="flex justify-center mr-10 space-x-2 pr-5">

        <button @click="searchButton" class="button search">조회</button>
        <button @click="saveButton" class="button save">저장</button>

      </div>


    </div>
    <div class="flex justify-start  space-x-5 bg-gray-200 rounded-lg h-16 items-center mt-3">
      <PickStore @update:storeGroup="handleGroupCd" @update:storeCd="handleStoreCd" @update:ischanged="handleinitAll">
      </PickStore>
    </div>
    <span class="grid grid-rows-1 grid-cols-2 mt-5">
      <div class="ml-10 flex justify-start font-bold text-xl">사용자 정보</div>
      <div class="flex justify-between">
        <div class="flex justify-start font-bold text-xl">상세정보</div>
        <div class="mr-20"><button class="whitebutton" @click="addButton">추가</button><button class="whitebutton"
            @click="deleteButton">삭제</button></div>
      </div>
    </span>
    <div class="grid grid-rows-1 grid-cols-2 h-full w-full justify-center mt-2">

      <div class="w-[90%] ml-10 h-full">

        <Realgrid :progname="'ATT01_002INS_VUE'" :progid="1" :rowData="rowData" @clickedRowData="clickedRowData"
          @selcetedrowData="selcetedrowData" @updatedRowData="updatedRowData" :selectionStyle="'singleRow'"
          :labelingColumns="'blnExpireClass'" :valuesData="valuesData" :labelsData="labelsData" :addRow4="addRow"
          :deleteRow2="deleteRow" :addrowDefault="addrowDefault" :addrowProp="addrowProp" :changeNow="changeNow"
          :changeValue2="changeValue2" :changeColid="changeColid" :changeRow="changeRow" @selectedIndex="selectedIndex"
          :rowStateeditable="false" :addField="'new'"></Realgrid>
      </div>

      <div class="grid grid-cols-[1fr,6fr] grid-rows-4 w-[90%] mr-10 h-[15%] ">
        <div
          class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100 text-blue-500 rounded-tl-lg">
          *사원코드</div>
        <div class="border flex h-7 items-center text-sm font-semibold justify-center rounded-tr-lg"><input type="text"
            class="border text-sm rounded-md w-full pl-2 h-7 disabled:bg-gray-200" v-model="empCode" name="empCode"
            @input="changeInfo" disabled></div>
        <div class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100 text-blue-500">*사원이름
        </div>
        <div class="border flex h-7 items-center text-sm font-semibold justify-center"><input type="text"
            class="border text-sm rounded-md w-full pl-2 h-7" v-model="empName" name="empName" @input="changeInfo">
        </div>
        <div class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100">재직구분</div>
        <div class="border flex h-7 items-center text-sm font-semibold justify-left pl-2 space-x-2">
          <div class="flex items-center space-x-4">
            <label for="empExpire0">
              <input type="radio" class="border text-sm rounded-md pl-2" v-model="empExpire" id="empExpire0"
                name="empExpire" value="0" @input="changeInfo" />
              재직
            </label>
          </div>
          <div class="flex items-center space-x-2">
            <label for="empExpire1">
              <input type="radio" class="border text-sm rounded-md pl-2" v-model="empExpire" id="empExpire1"
                name="empExpire" value="1" @input="changeInfo" />
              퇴직
            </label>
          </div>
          <div class="flex items-center space-x-2">
            <label for="empExpire2">
              <input type="radio" class="border text-sm rounded-md pl-2" v-model="empExpire" id="empExpire2"
                name="empExpire" value="2" @input="changeInfo" />
              휴직
            </label>
          </div>
        </div>
        <div class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100 rounded-bl-lg">비밀번호
        </div>
        <div class="border flex h-7 items-center text-sm font-semibold justify-center rounded-br-lg"><input type="text"
            class="border text-sm rounded-md w-full pl-2 h-7" v-model="password" name="password" @input="changeInfo">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getChargerInfo, saveEMP } from '@/api/miattend';
import PickStore from '@/components/pickStore.vue';

import Realgrid from '@/components/realgrid.vue';
import Swal from 'sweetalert2';
import { ref } from 'vue';
import { useStore } from 'vuex';

const rowData = ref([])
const groupCd = ref()
const storeCd = ref()
const afterSearch = ref(false);
const empCode = ref()
const empName = ref()
const empExpire = ref(0)
const password = ref()
const valuesData = ref([[0, 1, 2]])
const labelsData = ref([['재직', '퇴직', '휴직']])
const addRow = ref(false)
const changeNow = ref(false)
const changeValue2 = ref()
const changeColid = ref()
const changeRow = ref()

const selectedIndex = (newValue) => {

  changeRow.value = newValue
}
const addButton = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: '조회를 먼저 해주세요.',
      confirmButtonText: '확인',
    }
    )
    return;
  }
  console.log(updateRow.value)
  const newCode = Math.max(...updateRow.value.map(item => item.lngChargerCode)) + 1
  addrowDefault.value = '0,' + newCode
  addRow.value = !addRow.value
}
const deleteRow = ref(false)
const deleteButton = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: '조회를 먼저 해주세요.',
      confirmButtonText: '확인',
    }
    )
    return;
  }
  deleteRow.value = !deleteRow.value
}

const clickedRowData = (newValue) => {
  console.log(newValue)
  empCode.value = newValue[0]
  empName.value = newValue[1]
  empExpire.value = newValue[2]
  password.value = newValue[3]
}
const handleGroupCd = (newValue) => {
  groupCd.value = newValue
}
const handleStoreCd = (newValue) => {
  storeCd.value = newValue
}
const updateRow = ref([])
const updatedRowData = (newValue) => {
  updateRow.value = newValue
  console.log(newValue)
}

const changeInfo = (e) => {
  const rowName = e.target.name
  const rowValue = e.target.value

  if (rowName == 'empCode') {

  } else if (rowName == 'empName') {
    changeValue2.value = rowValue
    changeColid.value = 'strChargerName'
  } else if (rowName == 'empExpire') {
    changeValue2.value = rowValue
    changeColid.value = 'blnExpireClass'
  } else {
    changeValue2.value = rowValue
    changeColid.value = 'strPosMngNo'
  }
  changeNow.value = !changeNow.value

}

const addrowDefault = ref('')
const addrowProp = ref('blnExpireClass,lngChargerCode')
const store = useStore();
const searchButton = async () => {

  if (storeCd.value == '0' || storeCd.value == undefined) {
    Swal.fire({
      title: '경고',
      text: '매장을 선택하세요.',
      icon: 'warning',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      allowOutsideClick: false
    })
    return;
  }



  store.state.loading = true;
  try {
    let res;
    console.log(groupCd.value)
    console.log(storeCd.value)
    res = await getChargerInfo(groupCd.value, storeCd.value)

    rowData.value = res.data.EMPCHARGER
    updateRow.value = JSON.parse(JSON.stringify(rowData.value))
    console.log(res)
    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;

  } finally {


    store.state.loading = false;

  }
}


const saveButton = async () => {

  if (afterSearch.value == false) {
    Swal.fire({
      title: '경고',
      text: '조회를 먼저 진행해주세요.',
      icon: 'warning',
      confirmButtonText: '확인'
    })
    return;
  }
  if (JSON.stringify(updateRow.value) === JSON.stringify(rowData.value)) {
    Swal.fire({
      title: '경고',
      text: '변경된 사항이 없습니다.',
      icon: 'warning',
      confirmButtonText: '확인'
    })
    return;
  }

  const validateRow = updateRow.value.filter(item => item.deleted != true && (item.strChargerName == '' || item.strChargerName == undefined)).length
  if (validateRow > 0) {
    Swal.fire({
      title: '경고',
      text: '사원이름이 미입력되었습니다. 확인해주세요.',
      icon: 'warning',
      confirmButtonText: '확인'
    })
    return;
  }

  Swal.fire({
    title: '저장',
    text: '저장 하시겠습니까?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: '저장',
    cancelButtonText: '취소'
  }).then(async (result) => {
    if (result.isConfirmed) {
      store.state.loading = true;
      try {

        console.log(updateRow.value)

        const chargerCode = updateRow.value.filter(item => item.deleted != true && item.new != true).map(item => item.lngChargerCode)
        const chargerName = updateRow.value.filter(item => item.deleted != true && item.new != true).map(item => item.strChargerName)
        const chargerExpire = updateRow.value.filter(item => item.deleted != true && item.new != true).map(item => item.blnExpireClass)
        const chargerMngNo = updateRow.value.filter(item => item.deleted != true && item.new != true).map(item => item.strPosMngNo)

        const chargerCode2 = updateRow.value.filter(item => item.deleted != true && item.new == true).map(item => item.lngChargerCode)
        const chargerName2 = updateRow.value.filter(item => item.deleted != true && item.new == true).map(item => item.strChargerName)
        const chargerExpire2 = updateRow.value.filter(item => item.deleted != true && item.new == true).map(item => item.blnExpireClass)
        const chargerMngNo2 = updateRow.value.filter(item => item.deleted != true && item.new == true).map(item => item.strPosMngNo)


        const deleteCode = updateRow.value.filter(item => item.deleted == true).map(item => item.lngChargerCode)
        const res = await saveEMP(groupCd.value, storeCd.value, chargerCode.join(','), chargerName.join(','), chargerExpire.join(','), chargerMngNo.join(','), chargerCode2.join(','), chargerName2.join(','), chargerExpire2.join(','), chargerMngNo2.join(','), deleteCode.join(','))
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

<style scoped></style>