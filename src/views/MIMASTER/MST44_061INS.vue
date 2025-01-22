<template>
    <div class="flex justify-between items-center w-full overflow-y-auto">
    <div class="flex justify-start  w-full pl-12 pt-4">
               <div class="flex justify-start"><h1 class="font-bold text-sm md:text-2xl w-full">
                KDS 관리
               </h1></div>
                
               </div>
               <div class="flex justify-center mr-10 space-x-2 pr-5"><button @click="searchButton" class="button search md:w-auto w-14">조회</button>
              
              <button @click="saveButton" class="button save w-auto">저장</button>
              <button @click="copyButton" class="button copy w-auto" v-if="currentMenu == true">복사</button>
           
            </div>
  
  </div>
  <br>
  <div class="flex justify-start  space-x-5 bg-gray-200 rounded-lg md:h-16 h-24 items-center"><PickStore @areaCd="handleStoreAreaCd" @update:storeCd="handleStoreCd" @posNo="handlePosNo" @storeNm="handlestoreNm" @update:ischanged="handleinitAll" :hidesub="hidesub"></PickStore> </div> 
  <div class="z-50">
      <DupliPopUp5 :isVisible="showPopup2" @close="showPopup2 = false" :storeCd="nowStoreCd" :storeNm="clickedStoreNm" :areaCd="nowStoreAreaCd" :posNo="posNo" :progname="'MST44_061INS_VUE'" :dupliapiname="'DUPLIALLKDS'" :progid="3" :poskiosk="'getStoreList'"  naming2="KDS">
      </DupliPopUp5>
    
    </div>
    <div class="mt-5 flex justify-start ml-10">
      <button class="contents_tab-button " :class="{'text-blue-600' : currentMenu==false }" @click="showMenus(1)">KDS설정</button>
      <button class="contents_tab-button" :class="{'text-blue-600' : currentMenu==true }"  @click="showMenus(2)">매장별 KDS설정</button>
    </div>
  <div class="flex h-4/6 w-full mt-5">
    
  <div class="flex flex-col w-3/5 h-4/6">
  <div class="flex justify-between mt-0 ml-10  border-b  border-b-gray-300" :class="currentMenu == false ? 'w-full' : 'w-[54%]'">
  
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
    <div class="mt-3 ml-10 grid grid-cols-[1fr,3fr] grid-rows-2 gap-0 w-[35%]">
      <div class="customtableIndex border border-gray-400 rounded-tl-lg">메뉴분류</div>
   <div class="px-2 py-1 border border-gray-400 rounded-tr-lg flex space-x-2 ">
     <select name="" id="" class="flex-1 border border-gray-400 rounded-lg" @change="setSubCd" v-model="forsearchMain">
       <option value="0">전체</option>
       <option :value="i.mainCode" v-for="i in MenuGroup"> {{ i.mainName }}</option>
     </select>
     <select name="" id="" class="flex-1 border border-gray-400 rounded-lg" v-model="forsearchSub">
       <option value="0">전체</option>
       <option :value="i.subCode" v-for="i in filteredSubMenuGroup">{{ i.subName}}</option>
     </select>
   </div>
   
   <div class="customtableIndex border border-gray-400 rounded-bl-lg">메뉴명/코드</div>
   <div class="px-2 py-1 border border-gray-400 rounded-br-lg "><input type="text" class="border w-full h-full px-1 border-gray-400 rounded-lg" @input="searchMenuList" v-model="searchword1"></div>
  </div>
    <div class="ml-10 mt-5 w-full h-full">
      <Realgrid class="w-[103%] h-[200%]" :progname="'MST44_061INS_VUE'" :progid="groupCd" :reload="reload" :rowData="rowData2" :showGrid="showGrid" :showCheckBar="false"  @selcetedrowData="selcetedrowData" :searchWord="searchword1" :searchColId="'lngCode,strName'" :addRow="addRows" @updatedRowData="updatedRowData2" :deleteRow="deleteRows" @clickedRowData="clickedRowData" :editableColId="'strName'" :fixedColumn="fixedColumn"></Realgrid>

    </div>
  </div>

</div>
<div class="w-[52%] h-[20%] grid grid-rows-2 grid-cols-1 ml-28 -mt-2" v-if="currentMenu == false">
<div class="font-bold text-xl flex justify-start items-center">상세정보</div>
  <div class="w-full h-full flex justify-start items-center">
    <div class="grid grid-rows-2 grid-cols-[1fr,3fr] w-[93%] h-full  ">
      <div class="rounded-tl-lg border border-gray-600 flex justify-center items-center">KDS번호</div>
      <div class="rounded-tr-lg border border-gray-600 h-full py-1 px-1 flex items-center"><input type="text" class="w-full border border-gray-600 rounded-lg disabled:bg-gray-300" v-model="clickedNo" disabled></div>
      <div class="rounded-bl-lg border border-gray-600 flex justify-center items-center">KDS명</div>
      <div class="rounded-br-lg border border-gray-600 h-full py-1 px-1 flex items-center"><input type="text" class="w-full border border-gray-600 rounded-lg" v-model="clickedNm" @input="changeValues"></div>
    </div>
  </div>
</div>
<label v-if="currentMenu == true" class="mt-20 relative right-96 top-1 h-2">
  <input type="checkbox" v-model="ischecked" >
  미설정메뉴보기
</label>
  
  
  
  
  </div>
  
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue';
  import { useStore } from 'vuex';
  import {  getKDSList, getKDSSettingList, getMenuKeyList, getMenuList, getScreenList,getTLUList, saveAllMenuKey, saveKDSList, saveKDSSettingAll, saveScreenKeys } from '@/api/master';

  import Swal from 'sweetalert2';

  import DupliPopUp from '@/components/dupliPopUp.vue';
import PickStore from '@/components/pickStore.vue';
import Realgrid from '@/components/realgrid.vue';
import DupliPopUp5 from '@/components/dupliPopUp5.vue';
  
  
  // 더미 데이터
  const items = ref([]);
  const ScreenKeyOrigin = ref([]);
  const ScreenKeys = ref();
  const updatedList = ref()
  const updatedList2 = ref()
  const forsearchMain = ref('0')
  const forsearchSub = ref('0')
  const ischecked = ref(false)
  const rowStateeditable = ref(false)
  const changeMode = ref(false);
  const fixedColumn = ref(true);

  const clickedNm = ref('')
  const clickedNo = ref()
  const clickedStoreNm = ref()
  const handlestoreNm = (newData) => {
    clickedStoreNm.value = newData
  }
  const showPopup2 = ref(false)
  const showPopup3 = ref(false)

  
  const confirmitem= ref([]);
  const reloadit= ref(true);
  
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

  const forSaveMenu = ref([])
  const updatedRowData2 = (newValue) => {
    console.log(newValue)
    if(currentMenu.value == true){

    forSaveMenu.value = []
    updatedList2.value = newValue
    KDSSettingList.value.forEach((item,index) => {
      const matchedItem = updatedList2.value.find(kdsItem => kdsItem.lngCode == item.lngCode )
      if (matchedItem) {
        KDSSettingList.value[index] = {...matchedItem}
       }
    })

    const kdslength = kdsList.value.length
    for(var i=0 ; i < kdslength ; i++){
      forSaveMenu.value.push(KDSSettingList.value.filter(item => item['checkbox'+(i+1)] == true).map(item2 => item2.lngCode))
    }

    
  }
  }
  const nowStoreCd = ref();
  const afterCategory = ref(false);
  const  handleStoreCd = async(newValue) => {
    afterSearch.value = false;
    rowData2.value = []
    
    KDSSettingList.value = []
          checked.value = []
          kdsList.value = []
          MenuGroup.value =[]
          SubMenuGroup.value =[]
          ischecked.value = false

  nowStoreCd.value = newValue ;
 
  }
  const KDSList = ref();
  const reload = ref(false)
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

  const groupCd = ref(userData.lngStoreGroup);
  const modified = ref(false);
  const afterSearch = ref(false);
  const afterSearch2 = ref(false);
  const MenuList = ref([])
  const MenuKeyList = ref([])
  const clickedScreenOrMenu = ref(false)
  const TLUList = ref([])
  const checked = ref()
  const addRows = ref(false)
  const deleteRows = ref(false)
  const addRow = () => {
    if(afterSearch2.value == false) {
      Swal.fire({
        title: '경고.',
        text: '조회를 먼저 해주세요',
        icon: 'warning',
        confirmButtonText: '확인',
      })
      return ; 
    }
    addRows.value = !addRows.value
    addrowDefault.value = userData.strStoreGroupName
    console.log(updatedList.value)
    if(updatedList.value == undefined || updatedList.value[0] == undefined) {
      addrowDefault.value += ','+1
    } else {
      const maxKdsCornerNum = Math.max(...updatedList.value.map(item => item.kdsCornerNum)) 
    console.log(maxKdsCornerNum)
    addrowDefault.value += ','+ (maxKdsCornerNum+1)
    console.log(addrowDefault.value)
    }
   
  }
  const rowData = ref([])
  const rowData2 = ref([])
  const kdsList = ref([])
  const deleteRow = () => {
    if(afterSearch.value == false) {
      Swal.fire({
        title: '경고.',
        text: '조회를 먼저 해주세요',
        icon: 'warning',
        confirmButtonText: '확인',
      })
      return ; 
    }
    deleteRows.value = !deleteRows.value
  }
  const copyButton =() => {

    if(afterSearch.value == false) {
      Swal.fire({
      title: '경고.',
      text: '조회를 먼저 해주세요',
      icon: 'warning',
      confirmButtonText: '확인',
    })
      return ;
    }
    showPopup2.value = true ;
   
  }
  
  const selcetedrowData = (newValue) => {
    console.log(newValue)
  }
  const searchButton = async () => {
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
          afterSearch2.value = true
      } else {
          res = await getKDSSettingList(groupCd.value , nowStoreCd.value )
          KDSSettingList.value = res.data.KDSSETTINGLIST
          checked.value = res.data.CHECK
          kdsList.value = res.data.KDS
          console.log(KDSSettingList.value)
          for(var i=0 ; i< checked.value.length ; i++){
            const tlngCode = checked.value[i].lngCode
            const tCornerNm = checked.value[i].kdsCornerNum
            const index =  KDSSettingList.value.findIndex(item => item.lngCode == tlngCode)
            if(KDSSettingList.value[index]){
              KDSSettingList.value[index][tCornerNm] = true
            }
           
          }

          rowData2.value = [...KDSSettingList.value]
          console.log(rowData2.value)
          updatedList2.value = [...KDSSettingList.value]
          confirmitem.value = JSON.parse(JSON.stringify(KDSSettingList.value));
         
          MenuGroup.value = res.data.MAINGROUP
          SubMenuGroup.value = res.data.SUBGROUP
        
          console.log(MenuGroup.value)
          console.log(SubMenuGroup.value)
          console.log(checked.value)
          afterSearch.value = true;
      }
  
  
     
  } catch (error) {
     console.log(error)
  } finally {
      if(ischecked.value == true){
        ischecked.value = false
        setTimeout(() => {
          ischecked.value = true
        },10)
      } else {
        ischecked.value = true
        setTimeout(() => {
          ischecked.value = false
        },10)
      }

      const temp1 = forsearchMain.value
      forsearchMain.value = '0'
      setTimeout(() => {
        forsearchMain.value = temp1
        },1)
      const temp2 = forsearchSub.value
      forsearchSub.value = '0'
      setTimeout(() => {
        forsearchSub.value = temp2
        },1)
      store.state.loading = false; // 로딩 상태 종료
               modified.value = false ;
               afterCategory.value = false;
               clickedNo.value = ''
               clickedNm.value = ''
              
  }
  

  
  };
  const filteredSubMenuGroup = ref([]);
  const alreadyCheckedList = ref([])
  const forSaveMenu2 = ref([])
  watch(ischecked , (newvalue) => {
    if(ischecked.value == false && afterSearch.value) {
      rowData2.value = KDSSettingList.value.filter( item => {
        if(forsearchMain.value =='0' ){
          return item ;
        } else if ( forsearchMain.value !='0' && forsearchSub.value !='0' )  {
          return  item.mainCode == forsearchMain.value && item.subCode == forsearchSub.value ;
        } else if (  forsearchMain.value !='0' && forsearchSub.value =='0') {
          return  item.mainCode == forsearchMain.value 
        }
       
      })
    } else if(ischecked.value == true && afterSearch.value){
      forSaveMenu2.value = []
      rowData2.value = KDSSettingList.value.filter( item => {
        if(forsearchMain.value =='0'  ){
          forsearchSub.value = '0'
          return (!Object.values(item).includes(true));
        } else if ( forsearchMain.value !='0' && forsearchSub.value !='0' ) {
          return (!Object.values(item).includes(true)) && item.mainCode == forsearchMain.value && item.subCode == forsearchSub.value ;
        } else {
          return (!Object.values(item).includes(true)) && item.mainCode == forsearchMain.value ;
        }
       
      })
    
    }
    const temp1 = searchword1.value
      searchword1.value = ''
      setTimeout(() => {
        searchword1.value = temp1
       },1)

  })
  const setSubCd = () => {
    forsearchSub.value = '0'
    filteredSubMenuGroup.value = SubMenuGroup.value.filter(item => item.mainCode == forsearchMain.value)
    searchword1.value = ''
  
  }
  watch(forsearchMain , () => {
    if(forsearchMain.value != '0'){
      if(ischecked.value == false && afterSearch.value) {
      rowData2.value = KDSSettingList.value.filter( item => {
        if(forsearchMain.value =='0' ){
          return item ;
        } else if ( forsearchMain.value !='0' && forsearchSub.value !='0' )  {
          return  item.mainCode == forsearchMain.value && item.subCode == forsearchSub.value ;
        } else if (  forsearchMain.value !='0' && forsearchSub.value =='0') {
          return  item.mainCode == forsearchMain.value 
        }
       
      })
    } else if(ischecked.value == true && afterSearch.value){
      forSaveMenu2.value = []
      rowData2.value = KDSSettingList.value.filter( item => {
        if(forsearchMain.value =='0'  ){
          forsearchSub.value = '0'
          return (!Object.values(item).includes(true));
        } else if ( forsearchMain.value !='0' && forsearchSub.value !='0' ) {
          return (!Object.values(item).includes(true)) && item.mainCode == forsearchMain.value && item.subCode == forsearchSub.value ;
        } else {
          return (!Object.values(item).includes(true)) && item.mainCode == forsearchMain.value ;
        }
       
      })
    
    }
    } else {
      if(ischecked.value == false && afterSearch.value) {
      rowData2.value = KDSSettingList.value.filter( item => {
        if(forsearchMain.value =='0' ){
          return item ;
        } else if ( forsearchMain.value !='0' && forsearchSub.value !='0' )  {
          return  item.mainCode == forsearchMain.value && item.subCode == forsearchSub.value ;
        } else if (  forsearchMain.value !='0' && forsearchSub.value =='0') {
          return  item.mainCode == forsearchMain.value 
        }
       
      })
    } else if(ischecked.value == true && afterSearch.value){
      forSaveMenu2.value = []
      rowData2.value = KDSSettingList.value.filter( item => {
        if(forsearchMain.value =='0'  ){
          forsearchSub.value = '0'
          return (!Object.values(item).includes(true));
        } else if ( forsearchMain.value !='0' && forsearchSub.value !='0' ) {
          return (!Object.values(item).includes(true)) && item.mainCode == forsearchMain.value && item.subCode == forsearchSub.value ;
        } else {
          return (!Object.values(item).includes(true)) && item.mainCode == forsearchMain.value ;
        }
       
      })
    
    }
    }
    
  })

  watch(forsearchSub , () => {
    if(forsearchSub.value != '0'){
      if(ischecked.value == true){
        rowData2.value = KDSSettingList.value.filter( item => {
        if(forsearchMain.value =='0'  ){
          forsearchSub.value = '0'
          return (!Object.values(item).includes(true));
        } else if ( forsearchMain.value !='0' && forsearchSub.value !='0' ) {
          return (!Object.values(item).includes(true)) && item.mainCode == forsearchMain.value && item.subCode == forsearchSub.value ;
        } else {
          return (!Object.values(item).includes(true)) && item.mainCode == forsearchMain.value ;
        }
       
      })
      } else {
        rowData2.value = KDSSettingList.value.filter( item => {
        if(forsearchMain.value =='0' ){
          return item ;
        } else if ( forsearchMain.value !='0' && forsearchSub.value !='0' )  {
          return  item.mainCode == forsearchMain.value && item.subCode == forsearchSub.value ;
        } else if (  forsearchMain.value !='0' && forsearchSub.value =='0') {
          return  item.mainCode == forsearchMain.value 
        }
       
      })
      }
    
    }  else {
      if(forsearchMain.value !='0'){
 
        if(ischecked.value == true){
          rowData2.value = KDSSettingList.value.filter( item => {
        if(forsearchMain.value =='0'  ){
          forsearchSub.value = '0'
          return (!Object.values(item).includes(true));
        } else if ( forsearchMain.value !='0' && forsearchSub.value !='0' ) {
          return (!Object.values(item).includes(true)) && item.mainCode == forsearchMain.value && item.subCode == forsearchSub.value ;
        } else {
          return (!Object.values(item).includes(true)) && item.mainCode == forsearchMain.value ;
        }
       
      })
        } else {
          rowData2.value = KDSSettingList.value.filter( item => {
        if(forsearchMain.value =='0' ){
          return item ;
        } else if ( forsearchMain.value !='0' && forsearchSub.value !='0' )  {
          return  item.mainCode == forsearchMain.value && item.subCode == forsearchSub.value ;
        } else if (  forsearchMain.value !='0' && forsearchSub.value =='0') {
          return  item.mainCode == forsearchMain.value 
        }
       
      })
        }
        
      
      }
   
    }
 
    const temp = searchword1.value
    searchword1.value = '' 
    setTimeout(()=>{
      searchword1.value = temp
    },10)
  })
  
  
 const searchMenuList = (e) => {
   searchword1.value = e.target.value

 }
 

 

  const saveButton = async() => {
    if ( currentMenu.value == false){

    if(afterSearch2.value == false) {
      Swal.fire({
        title: '경고',
        text: '조회를 먼저 진행해주세요.',
        icon: 'warning',
        confirmButtonText: '확인'
      })
      return ;
    }
  } else {
    if(afterSearch.value == false) {
      Swal.fire({
        title: '경고',
        text: '조회를 먼저 진행해주세요.',
        icon: 'warning',
        confirmButtonText: '확인'
      })
      return ;
    }

  }
    if ( currentMenu.value == false){

    if(JSON.stringify(confirmitem.value) === JSON.stringify(updatedList.value) ) {
      Swal.fire({
        title: '경고',
        text: '변경된 사항이 없습니다.',
        icon: 'warning',
        confirmButtonText: '확인'
      }) 
      return ;
    }
  } else if (currentMenu.value == true){
    if(JSON.stringify(confirmitem.value) === JSON.stringify(updatedList2.value) ) {
      Swal.fire({
        title: '경고',
        text: '변경된 사항이 없습니다.',
        icon: 'warning',
        confirmButtonText: '확인'
      })
      return ;
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
      } else {
       
          console.log(forSaveMenu.value)
          res = await saveKDSSettingAll(groupCd.value, nowStoreCd.value, JSON.stringify(forSaveMenu.value) ,userData.loginID)
         
      }
   
      console.log(res)
     
  } catch (error) {
      
    } finally {
      store.state.loading = false;
      Swal.fire({
        title: '저장 되었습니다.',
        confirmButtonText: '확인',
      })
  
      searchButton()
      reload.value= !reload.value
    }
  }
  }
  )
   

  

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
      searchButton()
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
  