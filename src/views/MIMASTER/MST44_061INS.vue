<template>
    <div class="flex justify-between items-center w-full overflow-y-auto">
    <div class="flex justify-start  w-full pl-12 pt-4">
               <div class="flex justify-start"><h1 class="font-bold text-sm md:text-2xl w-full">
                KDS 관리
               </h1></div>
                
               </div>
               <div class="flex justify-center mr-10 space-x-2 pr-5"><button @click="searchMenu" class="button search md:w-auto w-14">조회</button>
              
              <button @click="saveButton" class="button save w-auto">저장</button>
              <button @click="copyButton" class="button primary w-auto">복사</button>
            </div>
  
  </div>
  <br>
  <div class="flex justify-start  space-x-5 bg-gray-200 rounded-lg md:h-16 h-24 items-center"><PickStore @areaCd="handleStoreAreaCd" @update:storeCd="handleStoreCd" @posNo="handlePosNo" @storeNm="handlestoreNm" @update:ischanged="handleinitAll" :hidesub="hidesub"></PickStore> </div> 
  <div class="z-50">
      <DupliPopUp :isVisible="showPopup2" @close="showPopup2 = false" :storeCd="nowStoreCd" :storeNm="clickedStoreNm" :areaCd="nowStoreAreaCd" :posNo="posNo" :progname="'MST01_011INS_VUE'" :dupliapiname="'DUPLIALLPOSDATA'" :progid="1" :poskiosk="'getStoreAndPosList'" :naming="'POS번호'">
      </DupliPopUp>
    </div>
    <div class="mt-5 flex justify-start ml-10">
      <button class="contents_tab-button " :class="{'text-blue-600' : currentMenu==false }" @click="showMenus(1)">KDS설정</button>
      <button class="contents_tab-button" :class="{'text-blue-600' : currentMenu==true }"  @click="showMenus(2)">매장별 KDS설정</button>
    </div>
  <div class="flex h-4/6 w-full mt-5">
    
  <div class="flex flex-col w-3/5 h-4/6">
  <div class="flex justify-between mt-0 ml-10  border-b  border-b-gray-300" :class="currentMenu == false ? 'w-full' : 'w-[80%]'">
  
    <div class="flex justify-start rounded-tl-lg  text-xl -mt-1 font-bold " v-if="currentMenu == false">KDS 목록</div>
    <div class="flex justify-start rounded-tl-lg text-xl -mt-1 font-bold " v-if="currentMenu == true">메뉴별 KDS 설정</div>
     
    <div class="mt-3">
   
      <button class="whitebutton" @click="addRow" v-if="currentMenu == false">추가</button>
    <button class="whitebutton" @click="deleteRow" v-if="currentMenu == false">삭제</button>
    </div>
  </div>
  
  <div class="h-4/6" v-show="currentMenu == false">
    <div class="ml-10 mt-5 w-full h-full">
      <Realgrid class="w-full h-[230%]" :progname="'MST44_061INS_VUE'" :progid="1" :rowData="rowData" :showGrid="showGrid" :showCheckBar="false"  @selcetedrowData="selcetedrowData" :searchWord="searchword1" :searchColId="'lngCode,strName'" :addRow2="addRows" :addrowProp="'strName,kdsCornerNum'" :addrowDefault="addrowDefault" @updatedRowData="updatedRowData" @clickedRowData="clickedRowData" :deleteRow="deleteRows"  :changeColid="'kdsCornerNm'" :changeRow="changeRow" :changeValue="changeValue" :rowStateeditable="rowStateeditable" ></Realgrid>

    </div>
  </div>

  <div class="h-4/6 w-[80vw]" v-show="currentMenu == true">
    <div class="mt-3 ml-10 grid grid-cols-[1fr,3fr] grid-rows-2 gap-0 w-[52%]">
      <div class="customtableIndex border border-gray-400 rounded-tl-lg">메뉴분류</div>
   <div class="px-4 py-2 border border-gray-300 rounded-tr-lg flex ">
     <select name="" id="" class="flex-1" @change="setSubCd" v-model="forsearchMain">
       <option value="0">전체</option>
       <option :value="i" v-for="i in MenuGroup"> {{ i }}</option>
     </select>
     <select name="" id="" class="flex-1" v-model="forsearchSub">
       <option value="0">전체</option>
       <option :value="i" v-for="i in filteredSubMenuGroup">{{ i}}</option>
     </select>
   </div>
   
   <div class="customtableIndex border border-gray-400 rounded-bl-lg">메뉴명/코드</div>
   <div class="px-1 py-1 border border-gray-300 rounded-br-lg "><input type="text" class="border w-full h-full px-1 border-gray-400 rounded-lg" @input="searchMenuList" v-model="searchword1"></div>
  </div>
    <div class="ml-10 mt-5 w-full h-full">
      <Realgrid class="w-full h-[200%]" :progname="'MST44_061INS_VUE'" :progid="2" :rowData="rowData2" :showGrid="showGrid" :showCheckBar="false"  @selcetedrowData="selcetedrowData" :searchWord="searchword1" :searchColId="'lngCode,strName'" :addRow="addRows" @updatedRowData="updatedRowData2" :deleteRow="deleteRows" @clickedRowData="clickedRowData" :editableColId="'strName'"></Realgrid>

    </div>
  </div>

</div>
<div class="w-[50%] h-[20%] grid grid-rows-2 grid-cols-1 ml-20 -mt-2" v-if="currentMenu == false">
<div class="font-bold text-xl flex justify-start items-center">상세정보</div>
  <div class="w-full h-full flex justify-start items-center">
    <div class="grid grid-rows-2 grid-cols-[1fr,3fr] w-[90%] h-full  ">
      <div class="rounded-tl-lg border border-gray-600 flex justify-center items-center">KDS번호</div>
      <div class="rounded-tr-lg border border-gray-600 h-full py-1 px-1 flex items-center"><input type="text" class="w-full border border-gray-600 rounded-lg" v-model="clickedNo" disabled></div>
      <div class="rounded-bl-lg border border-gray-600 flex justify-center items-center">KDS명</div>
      <div class="rounded-br-lg border border-gray-600 h-full py-1 px-1 flex items-center"><input type="text" class="w-full border border-gray-600 rounded-lg" v-model="clickedNm" @input="changeValues"></div>
    </div>
  </div>
</div>
<label v-if="currentMenu == true" class="mt-20 relative right-32 top-5">
  <input type="checkbox" >
  미설정메뉴보기
</label>
  
  
  
  
  </div>
  
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue';
  import { useStore } from 'vuex';
  import {  getKDSList, getKDSSettingList, getMenuKeyList, getMenuList, getScreenList,getTLUList, saveAllMenuKey, saveKDSList, saveScreenKeys } from '@/api/master';

  import Swal from 'sweetalert2';

  import DupliPopUp from '@/components/dupliPopUp.vue';
import PickStore from '@/components/pickStore.vue';
import Realgrid from '@/components/realgrid.vue';
  
  
  // 더미 데이터
  const items = ref([]);
  const ScreenKeyOrigin = ref([]);
  const ScreenKeys = ref();
  const updatedList = ref()
  const updatedList2 = ref()
  const forsearchMain = ref('0')
  const forsearchSub = ref('0')

  const rowStateeditable = ref(false)
  const changeMode = ref(false);

  const clickedNm = ref('')
  const clickedNo = ref()
  const clickedStoreNm = ref()
  const handlestoreNm = (newData) => {
    clickedStoreNm.value = newData
  }
  const showPopup2 = ref(false)

  
  const confirmitem= ref([]);
  const confirmitem2= ref([]);

  const posNo = ref();
  const addrowDefault = ref()
  const currmenuKeyPage = ref(1)
  const AllscreenKeyPage = ref(1)

  const showMenus = (value) => {
  if(value ==1) {
    currentMenu.value = false;
    hidesub.value = false
  } else {
    currentMenu.value = true;
    hidesub.value = true
  }
}
  

  const currentMenu = ref(false)
  

  
  



  const hidesub = ref(false)
 
  const nowStoreAreaCd = ref();
  const  handleStoreAreaCd = (newValue) => {
  
  nowStoreAreaCd.value = newValue ;
  console.log(nowStoreAreaCd.value)
  }
  const updatedRowData = (newValue) => {
    updatedList.value = newValue
  }
  const updatedRowData2 = (newValue) => {
    updatedList2.value = newValue
  }
  const nowStoreCd = ref();
  const afterCategory = ref(false);
  const  handleStoreCd = async(newValue) => {
  if(newValue == '0'){
      afterSearch.value = false;
  }
  nowStoreCd.value = newValue ;
  const res2 = await getMenuList(groupCd.value,nowStoreCd.value);
      MenuList.value = res2.data.menuList
      MenuGroup.value = res2.data.menuGroup
      SubMenuGroup.value = res2.data.submenuGroup
  
      MenuList.value = MenuList.value.map(item => {
      return {
        ...item,
        add: '추가'
      }
    })
    const res5 = await getTLUList(groupCd.value,nowStoreCd.value)
      TLUList.value = res5.data.TLUList
    TLUList.value = TLUList.value.map(item => {
      return {
        ...item,
        add: '추가'
      }
    })
  }
  const KDSList = ref();
  const KDSSettingList = ref();
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
 console.log(userData)
  const groupCd = ref(userData.lngStoreGroup);
  const modified = ref(false);
  const afterSearch = ref(false);
  const MenuList = ref([])
  const MenuKeyList = ref([])
  const clickedScreenOrMenu = ref(false)
  const TLUList = ref([])
  const clickedScreenNo = ref()
  const addRows = ref(false)
  const deleteRows = ref(false)
  const addRow = () => {
    addRows.value = !addRows.value
    addrowDefault.value = userData.strStoreGroupName
    console.log(updatedList.value)
    const maxKdsCornerNum = Math.max(...updatedList.value.map(item => item.kdsCornerNum));

    addrowDefault.value += ','+ (maxKdsCornerNum+1)
    console.log(addrowDefault.value)
  }
  const rowData = ref([])
  const rowData2 = ref([])
  const deleteRow = () => {
    deleteRows.value = !deleteRows.value
  }
  const copyButton =() => {
    showPopup2.value = true ;
  }
  const selcetedrowData = (newValue) => {
    console.log(newValue)
  }
  const searchMenu = async () => {
      changeMode.value = false
      Category.value = [] ;
      items.value = []
if(currentMenu.value == true) {
  if(nowStoreCd.value == '0' || nowStoreCd.value == undefined) {
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
 
}
  store.state.loading = true;
  try {
    let res;
      if(currentMenu.value == false) {
          res = await getKDSList(groupCd.value)
          KDSList.value = res.data.KDS
          rowData.value = [...KDSList.value]
          updatedList.value = [...KDSList.value]
          confirmitem.value = JSON.parse(JSON.stringify(KDSList.value));
      } else {
          res = await getKDSSettingList(groupCd.value , nowStoreCd.value )
          KDSSettingList.value = res.data.KDSSETTINGLIST
          rowData2.value = [...KDSSettingList.value]
          updatedList2.value = [...KDSSettingList.value]
          confirmitem.value = JSON.parse(JSON.stringify(KDSSettingList.value));
          MenuGroup.value = [ ...new Set(KDSSettingList.value.map(item => item.mainName))]
          SubMenuGroup.value = [ ...new Set(KDSSettingList.value.map(item => item.subName))]
          console.log(MenuGroup.value)
      }
  
  
      afterSearch.value = true;
  } catch (error) {
      afterSearch.value = false;
  } finally {
      
      store.state.loading = false; // 로딩 상태 종료
               modified.value = false ;
               afterCategory.value = false;
              
  }
  

  
  };
  const filteredSubMenuGroup = ref([]);


  
  

  function formatNumber(value) {
    if (!value) return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
 
  watch( items , (newvalue) => {
    console.log(newvalue)
      newvalue.forEach((item,index) => {
          if ( item == null || item.lngKeyscrNo == null || item.lngKeyscrNo == ''){
            newvalue[index] = { intKeySeq : index + (currmenuKeyPage.value -1)*30 +1}
          } else {
            item.intKeySeq = index + (currmenuKeyPage.value -1)*30 +1;
          }
          
      
      })
      console.log(items.value)
      console.log(MenuKeyList.value)
  
  })
  const saveButton = async() => {
    if(afterSearch.value == false) {
      Swal.fire({
        title: '경고',
        text: '조회를 먼저 진행해주세요.',
        icon: 'warning',
        confirmButtonText: '확인'
      })
      return ;
    }
    // if(JSON.stringify(confirmitem.value) === JSON.stringify(updatedList.value) && JSON.stringify(confirmitem2.value) === JSON.stringify(ScreenKeyOrigin.value)) {
    //   Swal.fire({
    //     title: '경고',
    //     text: '변경된 사항이 없습니다.',
    //     icon: 'warning',
    //     confirmButtonText: '확인'
    //   })
    //   return ;
    // }
  
   
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
      let res;

      if(currentMenu.value == false) {
        const kdsNo = updatedList.value.filter(item => item.deleted != true).map(item => item.kdsCornerNum)
      const kdsNm =  updatedList.value.filter(item => item.deleted != true).map(item => item.kdsCornerNm)
      const deleteNo = updatedList.value.filter(item => item.deleted == true).map(item => item.kdsCornerNum)
      console.log(kdsNo)
      console.log(kdsNm)
      console.log(deleteNo)
         res = await saveKDSList(groupCd.value , kdsNo.join(',') ,kdsNm.join(',') , userData.loginID , deleteNo.join(','))
      }
     console.log(res)
      updatedList.value
     
      
      const intKeySeqs = MenuKeyList.value.filter(item => item.intPosNo == posNo.value).map(item => item.intKeySeq)
      const screenNumarr = MenuKeyList.value.filter(item => item.intPosNo == posNo.value).map(item => item.intScreenNo)
      const lngScrarr = MenuKeyList.value.filter(item => item.intPosNo == posNo.value).map(item => item.lngKeyscrNo)
      const menuKeyNmarr = MenuKeyList.value.filter(item => item.intPosNo == posNo.value).map(item => item.strKeyName)
      console.log(posNo.value)
      console.log(intKeySeqs.join(','))
      console.log(screenNumarr.join(','))
      console.log(lngScrarr.join(','))
      console.log(menuKeyNmarr.join(','))
      // const res2 = await saveAllMenuKey(groupCd.value,nowStoreCd.value, nowStoreAreaCd.value , posNo.value , intKeySeqs.join(',') ,screenNumarr.join(',') , lngScrarr.join(','), menuKeyNmarr.join(','))
      
      console.log(res)
      console.log(res2)
  } catch (error) {
      
    } finally {
      store.state.loading = false;
      Swal.fire({
        title: '저장 되었습니다.',
        confirmButtonText: '확인',
      })
  
      searchMenu()
    }
  }
  }
  )
   
  // 빈공간 데이터를 넣으려고하는데 안 들어가고 조회가 안됨 // 빈 칸에 대한 것도 데이터를 불러와야 메뉴키위치를 정할 수 있음.
  
  
  

  }

  const changeRow = ref()
  const clickedRowData = (newValue) => {
    console.log(newValue)
    clickedNo.value = newValue[1]
    clickedNm.value = newValue[2]
    changeRow.value = newValue.index
    console.log(changeRow.value)
  }
  
  const handlePosNo = (newValue) => {
    posNo.value = newValue
    console.log(posNo.value)
    if(nowStoreAreaCd.value != undefined || posNo.value != undefined){
      searchMenu()
    }
   
  }


  
  
  
  
  
  
 
  const handleinitAll = (newvalue) => {
      MenuGroup.value =[]
      SubMenuGroup.value=[]
      MenuKeyList.value =[]
      ScreenKeyOrigin.value =[]
      TLUList.value = []
      AllscreenKeyPage.value = '1'
      MenuList.value =[]
      ScreenKeys.value = []
      items.value = []
      forsearchMain.value ='0'
      forsearchSub.value ='0'
      filteredSubMenuGroup.value =[]
      searchword1.value =''
      searchword3.value =''
      afterSearch.value = false
  } 
  </script>
  
  
  <style scoped>
  
  </style>
  