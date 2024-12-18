<template>
    <div class="flex justify-between items-center w-full overflow-y-auto">
    <div class="flex justify-start  w-full pl-12 pt-4">
    <div class="flex justify-start">
      <h1 class="font-bold text-sm md:text-2xl w-full">출력관리</h1></div>
    </div>
    <div class="flex justify-center mr-10 space-x-2 pr-5">
      <button @click="searchButton" class="button search md:w-auto w-14">조회</button>
      <button @click="saveButton" class="button save w-auto">저장</button>
      <button @click="copyButton" class="button copy w-auto" v-if="currentMenu == true">복사</button>
    </div>
</div>
  <br>
  <div class="flex justify-start  space-x-5 bg-gray-200 rounded-lg md:h-16 h-24 items-center">
    <PickStore @areaCd="handleStoreAreaCd" @update:storeCd="handleStoreCd" @posNo="handlePosNo" @storeNm="handlestoreNm" @update:ischanged="handleinitAll" ></PickStore>
   </div> 
  <div class="z-50">
      <DupliPopUp5 :isVisible="showPopup2" @close="showPopup2 = false" :storeCd="nowStoreCd" :storeNm="clickedStoreNm" :areaCd="nowStoreAreaCd" :posNo="posNo" :progname="'MST44_061INS_VUE'" :dupliapiname="'DUPLIALLKDS'" :progid="3" :poskiosk="'getStoreList'"  naming2="KDS">
      </DupliPopUp5>
   </div>
    <div class="mt-5 flex justify-start ml-10">
      <button class="contents_tab-button " :class="{'text-blue-600' : currentMenu==1 }" @click="showMenus(1)">출력코너명 설정</button>
      <button class="contents_tab-button" :class="{'text-blue-600' : currentMenu==2 }"  @click="showMenus(2)">주방출력 메뉴설정</button>
      <button class="contents_tab-button" :class="{'text-blue-600' : currentMenu==3 }"  @click="showMenus(3)">영수증 문구출력</button>
    </div>
  <div class="flex h-4/6 w-full mt-5">
  <div class="flex flex-col w-3/5 h-4/6">
  <div class="flex justify-between mt-0 ml-10  border-b  border-b-gray-300" :class="currentMenu == 1 ? 'w-full' : 'w-[54%]'">
    <div class="flex justify-start rounded-tl-lg  text-xl -mt-1 font-bold " v-if="currentMenu == 1">출력코너명 목록</div>
    <div class="flex justify-start rounded-tl-lg text-xl -mt-1 font-bold " v-if="currentMenu == 2">주방출력 메뉴설정</div>
    <div class="flex justify-start rounded-tl-lg text-xl -mt-1 font-bold " v-if="currentMenu == 3">POS 목록</div>
  </div>
  <div class="h-full" v-show="currentMenu == 1">
    <div class="ml-10 mt-5 w-full h-full">
      <Realgrid class="w-full h-[400%]" :progname="'MST44_062INS_VUE'" :progid="1" :rowData="rowData" :showGrid="showGrid" :showCheckBar="false"  @selcetedrowData="selcetedrowData" :changeRow="changeRow" :changeColid="'cornerNm'" :changeValue="changeValue" @updatedRowData="updatedRowData" @clickedRowData="clickedRowData"   ></Realgrid>

    </div>
  </div>
  <div class="h-full mt-64" v-show="currentMenu == 1">
    <div class="flex justify-start rounded-tl-lg  text-xl -mt-1 font-bold ml-10 " v-if="currentMenu == false">POS별 출력코너명 목록</div>
    <div class="ml-10 mt-5 w-full h-full">
      <Realgrid class="w-full h-[400%]" :progname="'MST44_062INS_VUE'" :progid="2" :rowData="rowData2" :showGrid="showGrid" :showCheckBar="false" ></Realgrid>
    </div>
  </div>

  <div class="h-4/6 w-[80vw]" v-show="currentMenu == 2">
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
      <Realgrid class="w-[103%] h-[200%]" :progname="'MST44_062INS_VUE'" :progid="nowStoreCd" :reload="reload" :rowData="rowData3" :showGrid="showGrid" :showCheckBar="false"  @selcetedrowData="selcetedrowData" :searchWord="searchword1" :searchColId="'lngCode,strName'" :addRow="addRows" @updatedRowData="updatedRowData2" :deleteRow="deleteRows" @clickedRowData="clickedRowData" :editableColId="'strName'" :fixedColumn="fixedColumn" :mergeColumns="true" :mergeColumnGroupName="'메뉴정보'" :mergeColumnGroupSubList="'mainName,subName,lngCode,strName,lngPrice'"></Realgrid>
    </div>
  </div>


  <div class="h-4/6 w-[80vw]" v-show="currentMenu == 3">
    <div>
     <Realgrid class="w-[100%] h-[150%]" :progname="'MST44_062INS_VUE'" :progid="3"></Realgrid>
    </div>
  </div>

</div>
<!-- TAB1 공간 -->
<div class="w-[52%] h-[20%] grid grid-rows-2 grid-cols-1 ml-28 -mt-2" v-if="currentMenu == 1">
<div class="font-bold text-xl flex justify-start items-center">상세정보</div>
  <div class="w-full h-full flex justify-start items-center">
    <div class="grid grid-rows-2 grid-cols-[1fr,3fr] w-[93%] h-full  ">
      <div class="rounded-tl-lg border border-gray-600 flex justify-center items-center">출력코너</div>
      <div class="rounded-tr-lg border border-gray-600 h-full py-1 px-1 flex items-center"><input type="text" class="w-full border border-gray-600 rounded-lg disabled:bg-gray-300" v-model="clickedNo" disabled></div>
      <div class="rounded-bl-lg border border-gray-600 flex justify-center items-center">출력코너명</div>
      <div class="rounded-br-lg border border-gray-600 h-full py-1 px-1 flex items-center"><input type="text" class="w-full border border-gray-600 rounded-lg" v-model="clickedNm" @input="changeValues"></div>
    </div>
  </div>
</div>
<!-- TAB2 공간 -->
<label v-if="currentMenu == 2" class="mt-20 relative right-96 top-1 h-2">
  <input type="checkbox" v-model="ischecked" >
  미설정메뉴보기
</label>
  

</div>
  
</template>
  
<script setup>
  import { ref, onMounted, watch } from 'vue';
  import { useStore } from 'vuex';
  import { getKitchenSettingList, getPrintList , getStorePosList, saveKDSSettingAll, saveKitchenSettingAll, savePrintNm, saveScreenKeys } from '@/api/master';

  import Swal from 'sweetalert2';
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
  const confirmitem= ref([]);
  const reloadit= ref(true);
  
  const posNo = ref();
  const addrowDefault = ref()
  const currmenuKeyPage = ref(1)
  const AllscreenKeyPage = ref(1)
  const rowData = ref([])
  const rowData2 = ref([])
  const rowData3 = ref([])
  const showMenus = (value) => {
  if(value ==1) {
    currentMenu.value = 1;
    hidesub.value = false
  } else if(value ==2){
    currentMenu.value = 2;
    hidesub.value = true
  } else {
    currentMenu.value = 3
  }
}
  

  const currentMenu = ref('1')
  

  
  



  const hidesub = ref(false)
 
  const nowStoreAreaCd = ref();
  const  handleStoreAreaCd = (newValue) => {
  
  nowStoreAreaCd.value = newValue ;
  console.log(nowStoreAreaCd.value)
  }
  const updatedRowData = (newValue) => {
    updatedList.value = newValue
    console.log(updatedList.value)
  }

  const forSaveMenu = ref([])
  const updatedRowData2 = (newValue) => {
    if(currentMenu.value == 2){

    forSaveMenu.value = []
    updatedList2.value = newValue
    SettingList.value.forEach((item,index) => {
      const matchedItem = updatedList2.value.find(Item => Item.lngCode == item.lngCode )
      if (matchedItem) {
        SettingList.value[index] = {...matchedItem}
       }
    })

    const length = printNameList.value.length
    for(var i=0 ; i < length ; i++){
      forSaveMenu.value.push(SettingList.value.filter(item => item['checkbox'+(i+1)] == true).map(item2 => Number(item2.lngCode)))
    }
    console.log(updatedList2.value)
    
  }
  }
  const nowStoreCd = ref();
  const afterCategory = ref(false);
  const  handleStoreCd = async(newValue) => {
    afterSearch.value = false;
    rowData.value = []
    rowData2.value = []
    
    SettingList.value = []
          checked.value = []
          printNameList.value = []
          MenuGroup.value =[]
          SubMenuGroup.value =[]
          ischecked.value = false

  nowStoreCd.value = newValue ;
  reload.value = !reload.value
  }
  const KDSList = ref();
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
  const MenuList = ref([])
  const MenuKeyList = ref([])
  const clickedScreenOrMenu = ref(false)
  const TLUList = ref([])
  const checked = ref()
  const addRows = ref(false)
  const deleteRows = ref(false)
  const addRow = () => {
    if(afterSearch.value == false) {
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

  const printNameList = ref([])
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
 

  store.state.loading = true;
  try {
    let res;
      if(currentMenu.value == 1) {
          res = await getPrintList(groupCd.value , nowStoreCd.value)
          console.log(res)
          rowData.value = res.data.Print
          rowData2.value = res.data.Print2

          console.log(rowData2.value)
      } else if(currentMenu.value == 2){
        res = await getKitchenSettingList(groupCd.value , nowStoreCd.value)
        console.log(res)
     
        SettingList.value = [...res.data.KITCHENMENU]
        MenuGroup.value = res.data.MAINGROUP
        SubMenuGroup.value = res.data.SUBGROUP
        checked.value = res.data.SAVED
        PrintList.value = res.data.PRINTLIST
        printNameList.value = res.data.KITCHENPRINT
        console.log(checked.value)
        console.log(printNameList.value)
        for(var i=0 ; i< checked.value.length ; i++){
             const tlngCode = checked.value[i].lngCode
             const portid = checked.value[i].portId
             const index =  SettingList.value.findIndex(item => item.lngCode == tlngCode)
             SettingList.value[index][portid] = true
         }

         rowData3.value = [ ...SettingList.value]
         updatedList2.value = [ ...SettingList.value]
         console.log(SettingList.value)
         confirmitem.value = JSON.parse(JSON.stringify(SettingList.value));
        afterSearch2.value = true
      } else if (currentMenu.value ==3){
        res = await getStorePosList(groupCd.value,nowStoreCd.value)
        console.log(res)
      }
  
  
   
  } catch (error) {
      afterSearch.value = false;
      afterSearch2.value = false;
  } finally {
    if(currentMenu.value == 2){
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
    }
    
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
    if(ischecked.value == false && afterSearch2.value) {
      rowData3.value = SettingList.value.filter( item => {
        if(forsearchMain.value =='0' ){
          return item ;
        } else if ( forsearchMain.value !='0' && forsearchSub.value !='0' )  {
          return  item.mainCode == forsearchMain.value && item.subCode == forsearchSub.value ;
        } else if (  forsearchMain.value !='0' && forsearchSub.value =='0') {
          return  item.mainCode == forsearchMain.value 
        }
       
      })
    } else if(ischecked.value == true && afterSearch2.value){
      forSaveMenu2.value = []
      rowData3.value = SettingList.value.filter( item => {
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
      if(ischecked.value == false && afterSearch2.value) {
        rowData3.value = SettingList.value.filter( item => {
        if(forsearchMain.value =='0' ){
          return item ;
        } else if ( forsearchMain.value !='0' && forsearchSub.value !='0' )  {
          return  item.mainCode == forsearchMain.value && item.subCode == forsearchSub.value ;
        } else if (  forsearchMain.value !='0' && forsearchSub.value =='0') {
          return  item.mainCode == forsearchMain.value 
        }
       
      })
    } else if(ischecked.value == true && afterSearch2.value){
      forSaveMenu2.value = []
      rowData3.value = SettingList.value.filter( item => {
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
      if(ischecked.value == false && afterSearch2.value) {
        rowData3.value = SettingList.value.filter( item => {
        if(forsearchMain.value =='0' ){
          return item ;
        } else if ( forsearchMain.value !='0' && forsearchSub.value !='0' )  {
          return  item.mainCode == forsearchMain.value && item.subCode == forsearchSub.value ;
        } else if (  forsearchMain.value !='0' && forsearchSub.value =='0') {
          return  item.mainCode == forsearchMain.value 
        }
       
      })
    } else if(ischecked.value == true && afterSearch2.value){
      forSaveMenu2.value = []
      rowData3.value = SettingList.value.filter( item => {
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
        rowData3.value = SettingList.value.filter( item => {
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
        rowData3.value = SettingList.value.filter( item => {
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
          rowData3.value = SettingList.value.filter( item => {
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
          rowData3.value = SettingList.value.filter( item => {
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
    if(currentMenu.value ==1){
      if(afterSearch.value == false) {
      Swal.fire({
        title: '경고',
        text: '조회를 먼저 진행해주세요.',
        icon: 'warning',
        confirmButtonText: '확인'
      })
      return ;
    }
    } else if (currentMenu.value ==2) {
      if(afterSearch2.value == false) {
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

      if(currentMenu.value == 1) {
         const printNo =  updatedList.value.map(item => item.lngPosition)
         const printNm =  updatedList.value.map(item => item.cornerNm)
         res = await savePrintNm(groupCd.value , nowStoreCd.value ,printNo.join(',') , printNm.join(','))
         console.log(res)
      } else if(currentMenu.value == 2) {
        let totalSum = [] ;
        const calculateArr = ref([])

        SettingList.value.forEach((obj) => {
          let sum = 0 ;
          Object.keys(obj).filter(key => key.startsWith('checkbox') && obj[key] == true)
          .forEach(key => {
            const index = parseInt(key.replace('checkbox' , ''))
            sum += Math.pow(2,index-1)
          })
          totalSum.push(sum)
        })
      
        totalSum = totalSum.filter(item => item !=0)
     
      
        const uniqueArray = [...new Set(totalSum)].sort((a,b) => a-b);
    
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
    calculateArr.value[key] = [...new Set(calculateArr.value[key])] ;
  }
});

 calculateArr.value = calculateArr.value.slice(1)
 calculateArr.value = calculateArr.value.map(item =>  Array.from(item))
 for(var i =0 ; i < calculateArr.value.length ; i++){
   if(calculateArr.value[i] == null){
    calculateArr.value[i] = [0] 
   }
 }
 console.log(JSON.stringify(calculateArr.value))
 console.log(JSON.stringify(forSaveMenu.value))
 console.log(uniqueArray.join(','))

 console.log(updatedList2.value)


    res = await saveKitchenSettingAll(groupCd.value, nowStoreCd.value, JSON.stringify(forSaveMenu.value) ,uniqueArray.join(',') ,JSON.stringify(calculateArr.value) ,userData.loginID)
    console.log(res)  
    
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
    clickedNo.value = newValue[2]
    clickedNm.value = newValue[3]
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
  