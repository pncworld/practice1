<template>
  <div class="flex justify-between items-center w-full overflow-y-auto">
    <div class="flex justify-start  w-full pl-12 pt-4">
      <div class="flex justify-start">
        <h1 class="font-bold text-sm md:text-2xl w-full">출력관리</h1>
      </div>
    </div>
    <div class="flex justify-center mr-10 space-x-2 pr-5">
      <button @click="searchButton" class="button search md:w-auto w-14">조회</button>
      <button @click="saveButton" class="button save w-auto">저장</button>
      <button @click="copyButton" class="button copy w-auto" v-if="currentMenu == true">복사</button>
    </div>
  </div>
  <br>
  <div class="flex justify-start  space-x-5 bg-gray-200 rounded-lg md:h-16 h-24 items-center">
    <PickStore @areaCd="handleStoreAreaCd" @update:storeCd="handleStoreCd" @posNo="handlePosNo" @storeNm="handlestoreNm"
      @update:ischanged="handleinitAll"></PickStore>
  </div>
  <div class="z-50">
    <DupliPopUp5 :isVisible="showPopup2" @close="showPopup2 = false" :storeCd="nowStoreCd" :storeNm="clickedStoreNm"
      :areaCd="nowStoreAreaCd" :posNo="posNo" :progname="'MST44_061INS_VUE'" :dupliapiname="'DUPLIALLKDS'" :progid="3"
      :poskiosk="'getStoreList'" naming2="KDS">
    </DupliPopUp5>
  </div>
  <div class="mt-5 flex justify-start ml-10">
    <button class="contents_tab-button " :class="{ 'text-blue-600': currentMenu == 1 }" @click="showMenus(1)">출력코너명
      설정</button>
    <button class="contents_tab-button" :class="{ 'text-blue-600': currentMenu == 2 }" @click="showMenus(2)">주방출력
      메뉴설정</button>
    <button class="contents_tab-button" :class="{ 'text-blue-600': currentMenu == 3 }" @click="showMenus(3)">영수증
      문구출력</button>
  </div>
  <div class="flex h-4/6 w-full mt-5">
    <div class="flex flex-col w-3/5 h-4/6">
      <div class="flex justify-between mt-0 ml-10  border-b  border-b-gray-300"
        :class="currentMenu == 1 ? 'w-full' : currentMenu == 3 ? 'w-[45vw]' : 'w-[54%]'">
        <div class="flex justify-start rounded-tl-lg  text-xl -mt-1 font-bold " v-if="currentMenu == 1">출력코너명 목록</div>
        <div class="flex justify-start rounded-tl-lg text-xl -mt-1 font-bold " v-if="currentMenu == 2">주방출력 메뉴설정</div>
        <div class="flex justify-start rounded-tl-lg text-xl -mt-1 font-bold " v-if="currentMenu == 3">POS 목록</div>
        <div class="flex justify-start rounded-tl-lg text-xl -mt-1 font-bold space-x-1 " v-if="currentMenu == 3"><button
            class="whitebutton" @click="initAllSection">초기화</button><button class="whitebutton"
            @click="dupliData">복사</button><button class="whitebutton" @click="dupliAllData">붙여넣기</button></div>

      </div>
      <div class="h-full" v-show="currentMenu == 1">
        <div class="ml-10 mt-5 w-full h-full">
          <Realgrid class="w-full h-[400%]" :progname="'MST44_062INS_VUE'" :progid="1" :rowData="rowData"
            :showGrid="showGrid" :showCheckBar="false" @selcetedrowData="selcetedrowData" :changeRow="changeRow"
            :changeColid="'cornerNm'" :changeValue="changeValue2" @updatedRowData="updatedRowData"
            @clickedRowData="clickedRowData"></Realgrid>

        </div>
      </div>
      <div class="h-full mt-64" v-show="currentMenu == 1">
        <div class="flex justify-start rounded-tl-lg  text-xl -mt-1 font-bold ml-10 " v-if="currentMenu == false">POS별
          출력코너명 목록</div>
        <div class="ml-10 mt-5 w-full h-full">
          <Realgrid class="w-full h-[400%]" :progname="'MST44_062INS_VUE'" :progid="2" :rowData="rowData2"
            :showGrid="showGrid" :showCheckBar="false"></Realgrid>
        </div>
      </div>

      <div class="h-4/6 w-[80vw]" v-show="currentMenu == 2">
        <div class="mt-3 ml-10 grid grid-cols-[1fr,3fr] grid-rows-2 gap-0 w-[35%]">
          <div class="customtableIndex border border-gray-400 rounded-tl-lg">메뉴분류</div>
          <div class="px-2 py-1 border border-gray-400 rounded-tr-lg flex space-x-2 ">
            <select name="" id="" class="flex-1 border border-gray-400 rounded-lg" @change="setSubCd"
              v-model="forsearchMain">
              <option value="0">전체</option>
              <option :value="i.mainCode" v-for="i in MenuGroup"> {{ i.mainName }}</option>
            </select>
            <select name="" id="" class="flex-1 border border-gray-400 rounded-lg" v-model="forsearchSub">
              <option value="0">전체</option>
              <option :value="i.subCode" v-for="i in filteredSubMenuGroup">{{ i.subName }}</option>
            </select>
          </div>

          <div class="customtableIndex border border-gray-400 rounded-bl-lg">메뉴명/코드</div>
          <div class="px-2 py-1 border border-gray-400 rounded-br-lg "><input type="text"
              class="border w-full h-full px-1 border-gray-400 rounded-lg" @input="searchMenuList"
              v-model="searchword1"></div>
        </div>
        <div class="ml-10 mt-5 w-full h-full">
          <Realgrid class="w-[103%] h-[200%]" :progname="'MST44_062INS_VUE'" :progid="nowStoreCd" :reload="reload"
            :rowData="rowData3" :showGrid="showGrid" :showCheckBar="false" @selcetedrowData="selcetedrowData"
            :searchWord="searchword1" :searchColId="'lngCode,strName'" :addRow="addRows"
            @updatedRowData="updatedRowData2" :deleteRow="deleteRows" @clickedRowData="clickedRowData"
            :editableColId="'strName'" :fixedColumn="fixedColumn" :mergeColumns="true" :mergeColumnGroupName="'메뉴정보'"
            :mergeColumnGroupSubList="'mainName,subName,lngCode,strName,lngPrice'"></Realgrid>
        </div>
      </div>

      <div class="h-[100vh]" v-if="currentMenu == 3">
        <div class="h-[15vh] w-[45vw] ml-10 mt-5" v-show="currentMenu == 3">
          <div class="w-full h-full ">
            <Realgrid class="w-[100%] h-[150%] " :progname="'MST44_062INS_VUE'" :progid="3" :reload="reload"
              :rowData="rowData4" :showGrid="showGrid" @clickedRowData="clickedRowData2"
              @updatedRowData="updatedRowData3" :changeColid="changeColid" :changeRow="changeRow"
              :changeValue="changeValue"></Realgrid>
          </div>
        </div>

        <div v-show="currentMenu == 3" class="mt-24 flex flex-col justify-start ml-10 h-[40vh] w-[45vw] rounded-lg ">
          <h1 class="text-xl font-bold flex justify-start">영수증 문구</h1>
          <div class="grid grid-rows-[1fr,4fr] grid-cols-[2fr,9fr] h-full">
            <div class="bg-gray-100 flex justify-center items-center rounded-tl-lg border border-gray-600">
              영수증 상단 문구
            </div>
            <div
              class="justify-center items-center rounded-tr-lg border border-gray-600 grid grid-rows-2 grid-cols-1 w-full px-2 py-2 gap-1">
              <div class=" w-full h-full px-2 py-2 rounded-lg  text-red-500">
                ({{ receiptUByte }}byte)
              </div>
              <input class="border w-full h-full px-2 py-2 rounded-lg border-gray-600 flex justify-start "
                v-model="receiptU" @input="handleInput" @click="caculateByte3" :disabled="!afterSearch3"
                @change="changeData">
              </input>
            </div>
            <div class="bg-gray-100 flex justify-center items-center rounded-bl-lg border border-gray-600">
              영수증 하단 문구
            </div>
            <div
              class="justify-center items-center rounded-br-lg border border-gray-600 grid grid-rows-6 grid-cols-1 w-full px-2 py-2 gap-1">
              <div class=" w-full h-full px-2 py-2 rounded-lg  flex justify-center text-red-500">({{ receiptDByte }}byte)
              </div>
              <input class="border w-full h-full px-2 py-2 rounded-lg border-gray-600 flex justify-start "
                v-model="receiptD1" @input="handleInput2" @click="selecedReceiptSection(1)"
                :disabled="!afterSearch3"></input>
              <input class="border w-full h-full px-2 py-2 rounded-lg border-gray-600 flex justify-start "
                v-model="receiptD2" @input="handleInput2" @click="selecedReceiptSection(2)"
                :disabled="!afterSearch3"></input>
              <input class="border w-full h-full px-2 py-2 rounded-lg border-gray-600 flex justify-start "
                v-model="receiptD3" @input="handleInput2" @click="selecedReceiptSection(3)"
                :disabled="!afterSearch3"></input>
              <input class="border w-full h-full px-2 py-2 rounded-lg border-gray-600 flex justify-start "
                v-model="receiptD4" @input="handleInput2" @click="selecedReceiptSection(4)"
                :disabled="!afterSearch3"></input>
              <input class="border w-full h-full px-2 py-2 rounded-lg border-gray-600 flex justify-start "
                v-model="receiptD5" @input="handleInput2" @click="selecedReceiptSection(5)"
                :disabled="!afterSearch3"></input>
            </div>
          </div>
        </div>
      </div>

    </div>
    <!-- TAB1 공간 -->
    <div class="w-[52%] h-[20%] grid grid-rows-2 grid-cols-1 ml-28 -mt-2" v-if="currentMenu == 1">
      <div class="font-bold text-xl flex justify-start items-center">상세정보</div>
      <div class="w-full h-full flex justify-start items-center">
        <div class="grid grid-rows-2 grid-cols-[1fr,3fr] w-[93%] h-full  ">
          <div class="rounded-tl-lg border border-gray-600 flex justify-center items-center">출력코너</div>
          <div class="rounded-tr-lg border border-gray-600 h-full py-1 px-1 flex items-center"><input type="text"
              class="w-full border border-gray-600 rounded-lg disabled:bg-gray-300" v-model="clickedNo" disabled></div>
          <div class="rounded-bl-lg border border-gray-600 flex justify-center items-center">출력코너명</div>
          <div class="rounded-br-lg border border-gray-600 h-full py-1 px-1 flex items-center"><input type="text"
              class="w-full border border-gray-600 rounded-lg" v-model="clickedNm" @input="changeValues"></div>
        </div>
      </div>
    </div>

    <div class="w-[52%] h-[20%] ml-10 mt-48 flex flex-col justify-center" v-if="currentMenu == 3">
      <div class="font-bold text-xl flex justify-start items-center">영수증 예시</div>
      <div class="flex justify-center items-center h-[50vh] w-[20vw] bg-gray-100 ml-28 mt-10">
        <div class="w-full h-[110%] bg-white p-5 border shadow-lg rounded-lg">
          <!-- 상단 수정 가능 영역 -->
          <div class="text-center space-y-2">
            <input type="text" v-model="receiptU" class="flex justify-start w-full">
            <div>선불 데모매장 0212345678</div>
            <div>주소상세주소</div>
            <div>111-11-11111</div>
          </div>
          <hr class="my-3 border-gray-300" />

          <!-- 영수증 본문 -->
          <div class="text-sm">
            <div class="flex justify-between">
              <span>YYYY-MM-DD 00:00:00</span>
              <span>01-0001</span>
            </div>
            <div class="mt-1 flex justify-end">
              <span>T:01 Guest Type: 0 Count: 0</span>
            </div>
            <hr class="my-3 border-gray-300" />

            <!-- 메뉴 리스트 -->
            <div class="space-y-2">
              <div class="flex justify-between">
                <span>메뉴1</span>
                <span>1</span>
                <span>0</span>
              </div>
              <div class="flex justify-between">
                <span>메뉴2</span>
                <span>2</span>
                <span>0</span>
              </div>
            </div>
            <hr class="my-3 border-gray-300" />

            <!-- 합계 -->
            <div class="flex justify-between font-semibold">
              <span>합 계</span>
              <span>0</span>
            </div>
            <div class="flex justify-between">
              <span>부가세 과세 물품 가액</span>
              <span>0</span>
            </div>
            <div class="flex justify-between">
              <span>부가세</span>
              <span>0</span>
            </div>
            <hr class="my-3 border-gray-300" />

            <!-- 하단 수정 가능 영역 -->
            <div class="flex justify-between font-semibold">
              <span>현 금</span>
              <div>0</div>
            </div>
            <div class="text-sm mt-1 flex justify-between">
              <span>IN-00:00:00</span>
              <span class="float-right">CASHIER: 점장</span>
            </div>

            <div class="flex flex-col mt-2">

              <input type="text" v-model="receiptD1">
              <input type="text" v-model="receiptD2">
              <input type="text" v-model="receiptD3">
              <input type="text" v-model="receiptD4">
              <input type="text" v-model="receiptD5">

            </div>
          </div>
        </div>
      </div>

    </div>
    <!-- TAB2 공간 -->
    <label v-if="currentMenu == 2" class="mt-20 relative right-96 top-1 h-2">
      <input type="checkbox" v-model="ischecked">
      미설정메뉴보기
    </label>


  </div>

</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { getKitchenSettingList, getPrintList, getStorePosList, saveKDSSettingAll, saveKitchenSettingAll, savePrintNm, saveReceiptData, saveScreenKeys } from '@/api/master';

import Swal from 'sweetalert2';
import PickStore from '@/components/pickStore.vue';
import Realgrid from '@/components/realgrid.vue';
import DupliPopUp5 from '@/components/dupliPopUp5.vue';
import { nextTick } from 'vue';



// 더미 데이터
const items = ref([]);
const ScreenKeyOrigin = ref([]);
const ScreenKeys = ref();
const updatedList = ref()
const updatedList2 = ref()
const forsearchMain = ref('0')
const forsearchSub = ref('0')
const ischecked = ref(false)
const rowData4 = ref([])
const changeMode = ref(false);
const fixedColumn = ref(true);
const PrintList = ref([])
const clickedNm = ref('')
const clickedNo = ref()
const clickedStoreNm = ref()
const handlestoreNm = (newData) => {
  clickedStoreNm.value = newData
}
const showPopup2 = ref(false)
const confirmitem = ref([]);
const reloadit = ref(true);
const receiptU = ref('')
const receiptD1 = ref('')
const receiptD2 = ref('')
const receiptD3 = ref('')
const receiptD4 = ref('')
const receiptD5 = ref('')
const posNo = ref();
const addrowDefault = ref()
const currmenuKeyPage = ref(1)
const AllscreenKeyPage = ref(1)
const rowData = ref([])
const rowData2 = ref([])
const rowData3 = ref([])
const showMenus = (value) => {
  if (value == 1) {
    currentMenu.value = 1;
    hidesub.value = false
  } else if (value == 2) {
    currentMenu.value = 2;
    hidesub.value = true
  } else {
    currentMenu.value = 3
  }
}


const currentMenu = ref('1')







const hidesub = ref(false)

const nowStoreAreaCd = ref();
const handleStoreAreaCd = (newValue) => {

  nowStoreAreaCd.value = newValue;
  console.log(nowStoreAreaCd.value)
}
const updatedRowData = (newValue) => {
  updatedList.value = newValue
  console.log(updatedList.value)
}

const forSaveMenu = ref([])
const updatedRowData2 = (newValue) => {
  if (currentMenu.value == 2) {

    forSaveMenu.value = []
    updatedList2.value = newValue
    SettingList.value.forEach((item, index) => {
      const matchedItem = updatedList2.value.find(Item => Item.lngCode == item.lngCode)
      if (matchedItem) {
        SettingList.value[index] = { ...matchedItem }
      }
    })

    const length = printNameList.value.length
    for (var i = 0; i < length; i++) {
      forSaveMenu.value.push(SettingList.value.filter(item => item['checkbox' + (i + 1)] == true).map(item2 => Number(item2.lngCode)))
    }
    console.log(updatedList2.value)

  }
}

const updatedList3 = ref([])
const updatedRowData3 = (newValue) => {
  updatedList3.value = newValue
  console.log(updatedList3.value)
}
const nowStoreCd = ref();
const afterCategory = ref(false);
const handleStoreCd = async (newValue) => {
  afterSearch.value = false;
  rowData.value = []
  rowData2.value = []

  SettingList.value = []
  checked.value = []
  printNameList.value = []
  MenuGroup.value = []
  SubMenuGroup.value = []
  ischecked.value = false

  nowStoreCd.value = newValue;
  console.log(nowStoreCd.value)
  reload.value = !reload.value
}
const handleInput = (e) => {
  changeColid.value = 'strReceiptU'
  calculateByte(e);
  changeValues(e)

}

const reload = ref(false)
const SettingList = ref();
const Category = ref([]);
const changeValue = ref('')
const MenuGroup = ref([])
const SubMenuGroup = ref([])

const changeValues = (e) => {
  changeValue.value = e.target.value
}

const store = useStore();
const searchword1 = ref()
const searchword3 = ref()
const userData = store.state.userData;

const groupCd = ref(userData.lngStoreGroup);
const modified = ref(false);
const afterSearch = ref(false);
const afterSearch2 = ref(false);
const afterSearch3 = ref(false);
const MenuList = ref([])
const MenuKeyList = ref([])
const clickedScreenOrMenu = ref(false)
const TLUList = ref([])
const checked = ref()
const addRows = ref(false)
const deleteRows = ref(false)
const addRow = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: '경고.',
      text: '조회를 먼저 해주세요',
      icon: 'warning',
      confirmButtonText: '확인',
    })
    return;
  }
  addRows.value = !addRows.value
  addrowDefault.value = userData.strStoreGroupName
  console.log(updatedList.value)
  if (updatedList.value == undefined || updatedList.value[0] == undefined) {
    addrowDefault.value += ',' + 1
  } else {
    const maxKdsCornerNum = Math.max(...updatedList.value.map(item => item.kdsCornerNum))
    console.log(maxKdsCornerNum)
    addrowDefault.value += ',' + (maxKdsCornerNum + 1)
    console.log(addrowDefault.value)
  }

}

const printNameList = ref([])
const deleteRow = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: '경고.',
      text: '조회를 먼저 해주세요',
      icon: 'warning',
      confirmButtonText: '확인',
    })
    return;
  }
  deleteRows.value = !deleteRows.value
}
const copyButton = () => {

  if (afterSearch.value == false) {
    Swal.fire({
      title: '경고.',
      text: '조회를 먼저 해주세요',
      icon: 'warning',
      confirmButtonText: '확인',
    })
    return;
  }
  showPopup2.value = true;

}

const selcetedrowData = (newValue) => {
  console.log(newValue)
  if (currentMenu.value == 3) {

  }
}
const searchButton = async () => {
  changeMode.value = false
  Category.value = [];
  items.value = []
  receiptU.value = ''
  receiptD1.value = ''
  receiptD2.value = ''
  receiptD3.value = ''
  receiptD4.value = ''
  receiptD5.value = ''

  if (nowStoreCd.value == '0' || nowStoreCd.value == undefined) {
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
    if (currentMenu.value == 1) {
      res = await getPrintList(groupCd.value, nowStoreCd.value)
      console.log(res)
      rowData.value = res.data.Print
      rowData2.value = res.data.Print2

      console.log(rowData2.value)
    } else if (currentMenu.value == 2) {
      res = await getKitchenSettingList(groupCd.value, nowStoreCd.value)
      console.log(res)

      SettingList.value = [...res.data.KITCHENMENU]
      MenuGroup.value = res.data.MAINGROUP
      SubMenuGroup.value = res.data.SUBGROUP
      checked.value = res.data.SAVED
      PrintList.value = res.data.PRINTLIST
      printNameList.value = res.data.KITCHENPRINT
      console.log(checked.value)
      console.log(printNameList.value)
      console.log(SettingList.value)
      for (var i = 0; i < checked.value.length; i++) {
        const tlngCode = checked.value[i].lngCode
        const portid = checked.value[i].portId
        const index = SettingList.value.findIndex(item => item.lngCode == tlngCode)
        if (index != -1) {
          SettingList.value[index][portid] = true
        }

      }

      rowData3.value = [...SettingList.value]
      updatedList2.value = [...SettingList.value]

      confirmitem.value = JSON.parse(JSON.stringify(SettingList.value));
      afterSearch2.value = true
    } else if (currentMenu.value == 3) {
      res = await getStorePosList(groupCd.value, nowStoreCd.value)
      console.log(res)
      rowData4.value = res.data.RECEIPTLIST
      afterSearch3.value = true
    }



  } catch (error) {
    console.log(error)
    afterSearch.value = false;
    afterSearch2.value = false;
    afterSearch3.value = false;
  } finally {
    if (currentMenu.value == 2) {
      if (ischecked.value == true) {
        ischecked.value = false
        setTimeout(() => {
          ischecked.value = true
        }, 10)
      } else {
        ischecked.value = true
        setTimeout(() => {
          ischecked.value = false
        }, 10)
      }

      const temp1 = forsearchMain.value
      forsearchMain.value = '0'
      setTimeout(() => {
        forsearchMain.value = temp1
      }, 1)
      const temp2 = forsearchSub.value
      forsearchSub.value = '0'
      setTimeout(() => {
        forsearchSub.value = temp2
      }, 1)
    }

    store.state.loading = false; // 로딩 상태 종료
    modified.value = false;
    afterCategory.value = false;
    clickedNo.value = ''
    clickedNm.value = ''

  }



};
const filteredSubMenuGroup = ref([]);
const alreadyCheckedList = ref([])
const forSaveMenu2 = ref([])
watch(ischecked, (newvalue) => {
  if (ischecked.value == false && afterSearch2.value) {
    rowData3.value = SettingList.value.filter(item => {
      if (forsearchMain.value == '0') {
        return item;
      } else if (forsearchMain.value != '0' && forsearchSub.value != '0') {
        return item.mainCode == forsearchMain.value && item.subCode == forsearchSub.value;
      } else if (forsearchMain.value != '0' && forsearchSub.value == '0') {
        return item.mainCode == forsearchMain.value
      }

    })
  } else if (ischecked.value == true && afterSearch2.value) {
    forSaveMenu2.value = []
    rowData3.value = SettingList.value.filter(item => {
      if (forsearchMain.value == '0') {
        forsearchSub.value = '0'
        return (!Object.values(item).includes(true));
      } else if (forsearchMain.value != '0' && forsearchSub.value != '0') {
        return (!Object.values(item).includes(true)) && item.mainCode == forsearchMain.value && item.subCode == forsearchSub.value;
      } else {
        return (!Object.values(item).includes(true)) && item.mainCode == forsearchMain.value;
      }

    })

  }
  const temp1 = searchword1.value
  searchword1.value = ''
  setTimeout(() => {
    searchword1.value = temp1
  }, 1)

})
const setSubCd = () => {
  forsearchSub.value = '0'
  filteredSubMenuGroup.value = SubMenuGroup.value.filter(item => item.mainCode == forsearchMain.value)
  searchword1.value = ''

}
watch(forsearchMain, () => {
  if (forsearchMain.value != '0') {
    if (ischecked.value == false && afterSearch2.value) {
      rowData3.value = SettingList.value.filter(item => {
        if (forsearchMain.value == '0') {
          return item;
        } else if (forsearchMain.value != '0' && forsearchSub.value != '0') {
          return item.mainCode == forsearchMain.value && item.subCode == forsearchSub.value;
        } else if (forsearchMain.value != '0' && forsearchSub.value == '0') {
          return item.mainCode == forsearchMain.value
        }

      })
    } else if (ischecked.value == true && afterSearch2.value) {
      forSaveMenu2.value = []
      rowData3.value = SettingList.value.filter(item => {
        if (forsearchMain.value == '0') {
          forsearchSub.value = '0'
          return (!Object.values(item).includes(true));
        } else if (forsearchMain.value != '0' && forsearchSub.value != '0') {
          return (!Object.values(item).includes(true)) && item.mainCode == forsearchMain.value && item.subCode == forsearchSub.value;
        } else {
          return (!Object.values(item).includes(true)) && item.mainCode == forsearchMain.value;
        }

      })

    }
  } else {
    if (ischecked.value == false && afterSearch2.value) {
      rowData3.value = SettingList.value.filter(item => {
        if (forsearchMain.value == '0') {
          return item;
        } else if (forsearchMain.value != '0' && forsearchSub.value != '0') {
          return item.mainCode == forsearchMain.value && item.subCode == forsearchSub.value;
        } else if (forsearchMain.value != '0' && forsearchSub.value == '0') {
          return item.mainCode == forsearchMain.value
        }

      })
    } else if (ischecked.value == true && afterSearch2.value) {
      forSaveMenu2.value = []
      rowData3.value = SettingList.value.filter(item => {
        if (forsearchMain.value == '0') {
          forsearchSub.value = '0'
          return (!Object.values(item).includes(true));
        } else if (forsearchMain.value != '0' && forsearchSub.value != '0') {
          return (!Object.values(item).includes(true)) && item.mainCode == forsearchMain.value && item.subCode == forsearchSub.value;
        } else {
          return (!Object.values(item).includes(true)) && item.mainCode == forsearchMain.value;
        }

      })

    }
  }

})

watch(forsearchSub, () => {
  if (forsearchSub.value != '0') {
    if (ischecked.value == true) {
      rowData3.value = SettingList.value.filter(item => {
        if (forsearchMain.value == '0') {
          forsearchSub.value = '0'
          return (!Object.values(item).includes(true));
        } else if (forsearchMain.value != '0' && forsearchSub.value != '0') {
          return (!Object.values(item).includes(true)) && item.mainCode == forsearchMain.value && item.subCode == forsearchSub.value;
        } else {
          return (!Object.values(item).includes(true)) && item.mainCode == forsearchMain.value;
        }

      })
    } else {
      rowData3.value = SettingList.value.filter(item => {
        if (forsearchMain.value == '0') {
          return item;
        } else if (forsearchMain.value != '0' && forsearchSub.value != '0') {
          return item.mainCode == forsearchMain.value && item.subCode == forsearchSub.value;
        } else if (forsearchMain.value != '0' && forsearchSub.value == '0') {
          return item.mainCode == forsearchMain.value
        }

      })
    }

  } else {
    if (forsearchMain.value != '0') {

      if (ischecked.value == true) {
        rowData3.value = SettingList.value.filter(item => {
          if (forsearchMain.value == '0') {
            forsearchSub.value = '0'
            return (!Object.values(item).includes(true));
          } else if (forsearchMain.value != '0' && forsearchSub.value != '0') {
            return (!Object.values(item).includes(true)) && item.mainCode == forsearchMain.value && item.subCode == forsearchSub.value;
          } else {
            return (!Object.values(item).includes(true)) && item.mainCode == forsearchMain.value;
          }

        })
      } else {
        rowData3.value = SettingList.value.filter(item => {
          if (forsearchMain.value == '0') {
            return item;
          } else if (forsearchMain.value != '0' && forsearchSub.value != '0') {
            return item.mainCode == forsearchMain.value && item.subCode == forsearchSub.value;
          } else if (forsearchMain.value != '0' && forsearchSub.value == '0') {
            return item.mainCode == forsearchMain.value
          }

        })
      }


    }

  }

  const temp = searchword1.value
  searchword1.value = ''
  setTimeout(() => {
    searchword1.value = temp
  }, 10)
})


const searchMenuList = (e) => {
  searchword1.value = e.target.value

}




const saveButton = async () => {
  if (currentMenu.value == 1) {
    if (afterSearch.value == false) {
      Swal.fire({
        title: '경고',
        text: '조회를 먼저 진행해주세요.',
        icon: 'warning',
        confirmButtonText: '확인'
      })
      return;
    }
  } else if (currentMenu.value == 2) {

    if (afterSearch2.value == false) {
      Swal.fire({
        title: '경고',
        text: '조회를 먼저 진행해주세요.',
        icon: 'warning',
        confirmButtonText: '확인'
      })
      return;
    }
  }

  if (currentMenu.value == false) {

    if (JSON.stringify(confirmitem.value) === JSON.stringify(updatedList.value)) {
      Swal.fire({
        title: '경고',
        text: '변경된 사항이 없습니다.',
        icon: 'warning',
        confirmButtonText: '확인'
      })
      return;
    }
  } else if (currentMenu.value == true) {
    if (JSON.stringify(confirmitem.value) === JSON.stringify(updatedList2.value)) {
      Swal.fire({
        title: '경고',
        text: '변경된 사항이 없습니다.',
        icon: 'warning',
        confirmButtonText: '확인'
      })
      return;
    }
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
        let res;

        if (currentMenu.value == 1) {
          const printNo = updatedList.value.map(item => item.lngPosition)
          const printNm = updatedList.value.map(item => item.cornerNm)
          res = await savePrintNm(groupCd.value, nowStoreCd.value, printNo.join(','), printNm.join(','))
          console.log(res)
        } else if (currentMenu.value == 2) {
          let totalSum = [];
          const calculateArr = ref([])

          SettingList.value.forEach((obj) => {
            let sum = 0;
            Object.keys(obj).filter(key => key.startsWith('checkbox') && obj[key] == true)
              .forEach(key => {
                const index = parseInt(key.replace('checkbox', ''))
                sum += Math.pow(2, index - 1)
              })
            totalSum.push(sum)
          })

          totalSum = totalSum.filter(item => item != 0)


          const uniqueArray = [...new Set(totalSum)].sort((a, b) => a - b);

          SettingList.value.forEach((obj) => {
            let sum = 0;
            let index;
            let checkedColumn = [];

            // 'checkbox'로 시작하는 키 중에서 값이 true인 항목들을 필터링
            Object.keys(obj).filter(key => key.startsWith('checkbox') && obj[key] === true).forEach(key => {
              index = parseInt(key.replace('checkbox', ''));  // index 계산
              checkedColumn.push(index);  // 체크된 열 인덱스를 배열에 추가
              sum += Math.pow(2, index - 1);  // sum에 값을 더함
            });

            // checkedColumn에 있는 모든 인덱스에 대해 sum 값을 추가
            checkedColumn.forEach(colIndex => {
              // calculateArr.value[colIndex]가 배열이 아닌 경우 초기화
              if (!Array.isArray(calculateArr.value[colIndex])) {
                calculateArr.value[colIndex] = [];  // 해당 index에 배열을 생성
              }
              calculateArr.value[colIndex].push(sum);  // 해당 열의 배열에 sum을 추가
            });
          });

          // calculateArr.value의 각 속성 배열에 대해 중복을 제거

          Object.keys(calculateArr.value).forEach(key => {
            if (Array.isArray(calculateArr.value[key])) {
              // Set을 사용하여 중복을 제거하고 배열로 변환
              calculateArr.value[key] = [...new Set(calculateArr.value[key])];
            }
          });

          calculateArr.value = calculateArr.value.slice(1)
          calculateArr.value = calculateArr.value.map(item => Array.from(item))
          for (var i = 0; i < calculateArr.value.length; i++) {
            if (calculateArr.value[i] == null) {
              calculateArr.value[i] = [0]
            }
          }
          console.log(JSON.stringify(calculateArr.value))
          console.log(JSON.stringify(forSaveMenu.value))
          console.log(uniqueArray.join(','))

          console.log(updatedList2.value)


          res = await saveKitchenSettingAll(groupCd.value, nowStoreCd.value, JSON.stringify(forSaveMenu.value), uniqueArray.join(','), JSON.stringify(calculateArr.value), userData.loginID)
          console.log(res)

        } else if (currentMenu.value == 3) {
          const posNos = updatedList3.value.map(item => item.intPosNo)
          const areaCodes = updatedList3.value.map(item => item.lngAreaCode)
          const strreceipts = updatedList3.value.map(item => item.strReceiptU)
          const strreceipts2 = updatedList3.value.map(item => item.strReceiptD)

          res = await saveReceiptData(groupCd.value, nowStoreCd.value, posNos.join(','), areaCodes.join(','), strreceipts.join(','), strreceipts2.join(','))

        }

        console.log(res)

      } catch (error) {

      } finally {
        store.state.loading = false;
        changeValue.value = null
        Swal.fire({
          title: '저장 되었습니다.',
          confirmButtonText: '확인',
        })

        searchButton()
        reload.value = !reload.value
      }
    }
  }
  )




}

const changeRow = ref()
const clickedRowData = (newValue) => {
  console.log(newValue)
  clickedNo.value = newValue[2]
  clickedNm.value = newValue[3]
  changeRow.value = newValue.index

}
const receiptUByte = ref('0')
const receiptDByte = ref('0')
const changeColid = ref('')

const caculateByte3 = (e) => {
  changeColid.value = 'strReceiptU'
  const encoder = new TextEncoder();
  let inputValue = e.target.value
  receiptUByte.value = encoder.encode(inputValue).length
  changeValue.value = e.target.value
}


const initAllSection = () => {
  receiptU.value = ''
  receiptD1.value = ''
  receiptD2.value = ''
  receiptD3.value = ''
  receiptD4.value = ''
  receiptD5.value = ''
}

let changedupliindex = ''
let savedreceiptU = ''
let savedreceiptD1 = ''
let savedreceiptD2 = ''
let savedreceiptD3 = ''
let savedreceiptD4 = ''
let savedreceiptD5 = ''

const dupliData = () => {
  changedupliindex = changeRow.value
  savedreceiptU = receiptU.value
  savedreceiptD1 = receiptD1.value
  savedreceiptD2 = receiptD2.value
  savedreceiptD3 = receiptD3.value
  savedreceiptD4 = receiptD4.value
  savedreceiptD5 = receiptD5.value
}





const calculateByte = (e) => {

  const encoder = new TextEncoder();
  let inputValue = e.target.value
  console.log(inputValue)
  receiptUByte.value = encoder.encode(inputValue).length
  if (receiptUByte.value >= 43) {
    console.log(inputValue)
    Swal.fire({
      title: '경고',
      text: '43바이트 이상 입력할 수 없습니다.',
      icon: 'warning',
      confirmButtonText: '확인'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(inputValue)

        while (receiptUByte.value >= 43) {
          inputValue = inputValue.slice(0, inputValue.length - 1)
          console.log(receiptU.value)
          receiptUByte.value = encoder.encode(inputValue).length
        }

        receiptU.value = inputValue

      }


    }
    )


    return;
  }


}

const selecedSection = ref()
const selecedReceiptSection = (value) => {
  changeColid.value = 'strReceiptD'
  selecedSection.value = value
  const encoder = new TextEncoder();
  if (value == 1) {
    receiptDByte.value = encoder.encode(receiptD1.value).length

  } else if (value == 2) {
    receiptDByte.value = encoder.encode(receiptD2.value).length

  } else if (value == 3) {
    receiptDByte.value = encoder.encode(receiptD3.value).length
  } else if (value == 4) {
    receiptDByte.value = encoder.encode(receiptD4.value).length
  } else if (value == 5) {
    receiptDByte.value = encoder.encode(receiptD5.value).length
  }
}
const calculateByte2 = (e) => {

  const encoder = new TextEncoder();
  let inputValue = e.target.value
  console.log(inputValue)
  receiptDByte.value = encoder.encode(inputValue).length
  if (receiptDByte.value >= 43) {
    console.log(inputValue)
    Swal.fire({
      title: '경고',
      text: '43바이트 이상 입력할 수 없습니다.',
      icon: 'warning',
      confirmButtonText: '확인'
    }).then((result) => {
      if (result.isConfirmed) {


        while (receiptDByte.value >= 43) {
          inputValue = inputValue.slice(0, inputValue.length - 1)
          console.log(receiptU.value)
          receiptDByte.value = encoder.encode(inputValue).length
        }
        if (selecedSection.value == 1) {
          receiptD1.value = inputValue
        } else if (selecedSection.value == 2) {
          receiptD2.value = inputValue
        } else if (selecedSection.value == 3) {
          receiptD3.value = inputValue
        } else if (selecedSection.value == 4) {
          receiptD4.value = inputValue
        } else if (selecedSection.value == 5) {
          receiptD5.value = inputValue
        }


      }


    }
    )


    return;
  }


}
const handleInput2 = (e) => {
  calculateByte2(e);
  changeValues2(e);

}
const addSpace42Text = (value) => {
  let prechangeValue = value
  const encoder = new TextEncoder();
  let byteLength = encoder.encode(prechangeValue).length;

  while (byteLength < 42) {
    prechangeValue += ' ';  // 공백을 추가
    byteLength = encoder.encode(prechangeValue).length;  // 바이트 길이를 다시 계산
  }
  return prechangeValue
}
const changeValues2 = async (e) => {

  let newText1 = addSpace42Text(receiptD1.value == undefined ? '' : receiptD1.value)
  let newText2 = addSpace42Text(receiptD2.value == undefined ? '' : receiptD2.value)
  let newText3 = addSpace42Text(receiptD3.value == undefined ? '' : receiptD3.value)
  let newText4 = addSpace42Text(receiptD4.value == undefined ? '' : receiptD4.value)
  let newText5 = addSpace42Text(receiptD5.value == undefined ? '' : receiptD5.value)

  changeColid.value = 'strReceiptD'
  changeValue.value = newText1 + newText2 + newText3 + newText4 + newText5



}

const dupliAllData = () => {
  receiptU.value = savedreceiptU
  receiptD1.value = savedreceiptD1
  receiptD2.value = savedreceiptD2
  receiptD3.value = savedreceiptD3
  receiptD4.value = savedreceiptD4
  receiptD5.value = savedreceiptD5

}

watch(receiptU, (newvalue) => {
  setTimeout(() => {
    changeColid.value = 'strReceiptU'
    changeValue.value = newvalue
  }, 10)
})
watch(receiptD1, () => {
  setTimeout(() => {
    changeValues2();
  }, 5);
})
watch(receiptD2, () => {
  setTimeout(() => {
    changeValues2();
  }, 5);

})
watch(receiptD3, () => {
  setTimeout(() => {
    changeValues2();
  }, 5);

})
watch(receiptD4, () => {
  setTimeout(() => {
    changeValues2();
  }, 5);
})
watch(receiptD5, () => {
  setTimeout(() => {
    changeValues2();
  }, 5);
})


function splitStringByByteLength(str, maxByteLength) {
  const encoder = new TextEncoder(); // UTF-8로 인코딩
  const bytes = encoder.encode(str); // 문자열을 바이트 배열로 변환
  let chunks = [];
  let currentByteLength = 0;
  let currentChunk = "";

  for (let i = 0; i < str.length; i++) {
    const charBytes = encoder.encode(str[i]); // 현재 문자의 바이트 배열
    const charByteLength = charBytes.length; // 현재 문자의 바이트 길이

    if (currentByteLength + charByteLength > maxByteLength) {
      chunks.push(currentChunk); // 현재 청크를 추가
      currentChunk = ""; // 청크 초기화
      currentByteLength = 0; // 바이트 길이 초기화
    }

    currentChunk += str[i];
    currentByteLength += charByteLength;
  }

  // 마지막 청크 추가
  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
}
const clickedRowData2 = (newValue) => {
  console.log(newValue)
  changeRow.value = newValue.index
  receiptU.value = newValue[2]
  const result = splitStringByByteLength(newValue[3], 42)
  receiptD1.value = result[0]
  receiptD2.value = result[1]
  receiptD3.value = result[2]
  receiptD4.value = result[3]
  receiptD5.value = result[4]

}

const handlePosNo = (newValue) => {
  posNo.value = newValue
  console.log(posNo.value)
  if (nowStoreAreaCd.value != undefined || posNo.value != undefined) {
    searchButton()
  }

}









const handleinitAll = (newvalue) => {
  MenuGroup.value = []
  SubMenuGroup.value = []
  MenuKeyList.value = []
  ScreenKeyOrigin.value = []
  TLUList.value = []
  AllscreenKeyPage.value = '1'
  MenuList.value = []
  ScreenKeys.value = []
  items.value = []
  forsearchMain.value = '0'
  forsearchSub.value = '0'
  filteredSubMenuGroup.value = []
  searchword1.value = ''
  searchword3.value = ''
  afterSearch.value = false
}
</script>


<style scoped></style>