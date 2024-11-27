<template>
    <div class="flex justify-between items-center w-full overflow-y-auto">
    <div class="flex justify-start  w-full pl-12 pt-4">
               <div class="flex justify-start"><h1 class="font-bold text-sm md:text-2xl w-full">
                메뉴키 설정(kiosk)
               </h1></div>
                
               </div>
               <div class="flex justify-center mr-10 space-x-2 pr-5"><button @click="searchMenu" class="button search md:w-auto w-14">조회</button>
              
              <button @click="savePosMenu" class="button save w-auto">저장</button>
              <button @click="showPopupf" class="button primary w-auto">복사</button>
            </div>
  
  </div>
  <br>
  <div class="flex justify-start  space-x-5 bg-gray-200 rounded-lg md:h-16 h-24 items-center"><PickStore7kio @areaCd="handleStoreAreaCd" @update:storeCd="handleStoreCd" @posNo="handlePosNo" @storeNm="handlestoreNm" @update:ischanged="handleinitAll"></PickStore7kio> </div> 
  <div class="z-50">
      <DupliPopUp :isVisible="showPopup2" @close="showPopup2 = false" :storeCd="nowStoreCd" :storeNm="clickedStoreNm" :areaCd="nowStoreAreaCd" :posNo="posNo" :progname="'MST01_011INS_VUE'" :dupliapiname="'DUPLIALLPOSDATA'" :progid="1" :poskiosk="'getStoreAndPosList2'">
      </DupliPopUp>
    </div>
  
  <div v-if="changeScreenKey" class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center  z-50">
    <div class="bg-white p-6 rounded shadow-lg w-[25%] h-[40%] ">
      <h2 class="text-lg font-bold">화면키 수정</h2>
      <div class="flex flex-col justify-start h-12">
        <div><p>화면키명</p></div>
        <div class="h-full w-full"><input type="text" class="border border-gray-400 pl-1 h-full w-full" v-model="currentscreenKeyNm"></div>
    </div>
    <div class="flex justify-center space-x-3 w-full h-16">
      <button @click="confirmScreenKey()" class="mt-4 p-2 bg-blue-500 text-white rounded">확인</button>
      <button @click="exitScreenKey" class="mt-4 p-2 bg-blue-500 text-white rounded">닫기</button>
    </div>
    </div>
    
  </div>
  
  <div v-if="addscreenKey" class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center  z-50">
    <div class="bg-white p-6 rounded shadow-lg w-[25%] h-[40%] ">
      <h2 class="text-lg font-bold">화면키 추가</h2>
      <div class="flex flex-col justify-start h-12">
        <div><p>화면키명</p></div>
        <div class="h-full w-full rounded-sm"><input type="text" class="border border-gray-400 pl-1 h-14 w-full rounded-sm" v-model="currentscreenKeyNm"></div>
    </div>
    <div class="flex justify-center space-x-3 w-full h-16 mt-28">
      <button @click="confirmaddScreenKey()" class="mt-4 p-2 bg-blue-500 text-white rounded">확인</button>
      <button @click="exitScreenKey" class="mt-4 p-2 bg-blue-500 text-white rounded">닫기</button>
    </div>
    </div>
    
  </div>
  
  <div v-show="showChangeScreenKey" class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
  <div class="bg-white p-6 rounded shadow-lg w-2/3 h-3/4 overflow-auto">
    <div class="border-gray-500 text-2xl">화면키 순서 변경</div>
    <div class="border-gray-500 text-xl">화면키를 끌어서 이동하면 순서가 변경됩니다.</div>
    <!-- VueDraggableNext 사용 -->
    <VueDraggableNext
      v-model="ScreenKeyOrigin"
      :group="{ name: 'subCategory', pull: 'clone', put: true }"
      class="space-y-2"
      :move="onMove2"
      @end="onEnd2"  
    >
      <div
        v-for="(item, index) in ScreenKeyOrigin"
        class="p-4 bg-gray-200 rounded-lg shadow-md cursor-move h-12"
        v-show="item && item.strScreenName !== ''"
      >
        <p>{{ item.strScreenName }}</p>
      </div>
    </VueDraggableNext>
  
    <div class="flex justify-center space-x-3">
      <button @click="showScreenKeysOrder" class="mt-4 p-2 bg-blue-500 text-white rounded">닫기</button>
    </div>
  </div>
  </div>
  <span class="h-5 mt-3 flex justify-between items-center w-[900px] ml-[700px]  z-40"><h1 class="font-bold text-xl z-40">키오스크 메뉴키 배치정보</h1><span class="flex space-x-3 ml-32 pl-56 items-center">순서변경 &nbsp; &nbsp;<label class="z-40"><input type="radio" name="changingMode" @click.stop="changingMode(1)" checked>교체하기 </label><label class="z-40"><input type="radio" name="changingMode" @click.stop="changingMode(2)">밀어내기</label><button class="whitebutton z-40" @click.stop="deletekey">삭제</button></span></span> 
  <div class="flex h-5/6 w-full -mt-5">
  <div class="flex flex-col w-3/5 h-4/6">
  <div class="flex justify-between mt-0 ml-10 w-full border-b  border-b-gray-300">
    <div class="font-bold text-2xl w-auto ">
      <!-- <button class="contents_tab-button " :class="{'text-blue-600' : currentMenu==false }" @click="showMenus(1)">메뉴관리</button> -->
      메뉴 리스트
    </div>
    <div class="mt-3">
      <button class="whitebutton" @click="searchMenuList3">조회</button>
      <button class="whitebutton">추가</button>
    </div>
  </div>
  <div class="h-4/6" v-show="currentMenu == false">
  <div class="mt-3 ml-10 grid grid-cols-[1fr,3fr] grid-rows-2 gap-0 w-full">
    <div class="customtableIndex border border-gray-400 rounded-tl-lg">메뉴분류</div>
    <div class="px-4 py-2 border border-gray-300 rounded-tr-lg flex ">
      <select name="" id="" class="flex-1" @change="setSubCd" v-model="forsearchMain">
        <option value="0">전체</option>
        <option :value="i.GroupCd" v-for="i in MenuGroup"> [{{i.GroupCd}}]{{ i.majorGroupNm }}</option>
      </select>
      <select name="" id="" class="flex-1" v-model="forsearchSub">
        <option value="0">전체</option>
        <option :value="i.GroupCd" v-for="i in filteredSubMenuGroup"> [{{i.GroupCd}}]{{ i.subGroupNm }}</option>
      </select>
    </div>
    <div class="customtableIndex border border-gray-400 rounded-bl-lg">메뉴명/코드</div>
    <div class="px-1 py-1 border border-gray-300 rounded-br-lg "><input type="text" class="border w-full h-full px-1 border-gray-400 rounded-lg" @input="searchMenuList"></div>
  </div>
    <div class="ml-10 mt-5 w-full h-full">
  
      <div id="realgrid" style="width: 100%; height: 180%;"></div>
    </div>
  </div>
  
  <div class="h-4/6" v-show="currentMenu">
  <div class="mt-3 ml-10 grid grid-cols-[1fr,3fr] grid-rows-1 gap-0 w-full">
    <div class="customtableIndex border border-gray-400 rounded-tl-lg">TLU명/코드</div>
    <div class="px-1 py-1 border border-gray-300 rounded-br-lg "><input type="text" class="border w-full h-full px-1 border-gray-400 rounded-lg" @input="searchMenuList2"></div>
  </div>
    <div class="ml-10 mt-5 w-full h-full">
  
      <div id="realgrid2" style="width: 100%; height: 90%;"></div>
      <div id="realgrid3" style="width: 100%; height: 90%;" class="mt-5"></div>
    </div>
  </div>
  </div>
  <div class="grid grid-rows-[2fr,5fr] grid-cols-1 ml-10 w-full h-full z-20">
    <div class="flex h-full w-[950px] mt-10" v-show="afterSearch" >
    <div  class="grid grid-cols-4 grid-rows-2 gap-1 ml-10 mt-0 w-full h-[80%]">
  <div v-for="(item,index) in ScreenKeys" class="screen-muuri-sort-empty flex justify-center items-center w-full h-full "  :class="{'!bg-orange-500 !border-blue-700' : clickedScreenKeyIndex==index }" @click="clickedScreenKeyIndex = index; clickedScreenKeys()">
    <p v-if="item.strScreenName != ''" @click="showMenuKey(item.intScreenNo); " class=" flex items-center justify-center w-full h-full"><button class="">{{ item.strScreenName }}</button><button @click.stop="editScreenKey(item.intScreenNo)"><font-awesome-icon :icon="['far', 'pen-to-square']" /></button></p> 
    <p v-else-if="item.new == true" @click="addScreenKey(index); " class=" flex items-center justify-center w-full h-full"><button class="w-full h-full text-gray-300 flex justify-center items-center"><img src="../../assets/ic_add_gray_24.png" alt=""> 화면키 추가 </button></p> 
    <p v-else class="flex items-center justify-center"></p> 
  
  </div>
  </div>
  <div class="flex flex-col mt-1 ml-2 w-10 h-5/6  "><button class="border border-[#CCCCCC] w-full h-full rounded-md" @click="showPrev"><img src="../../assets/arrow_up_wo_border.svg" alt=""></button><button class="border border-[#CCCCCC] h-full rounded-md" @click="showScreenKeysOrder"><img src="../../assets/table-change_2.svg" alt=""></button><button class="border border-[#CCCCCC] w-full h-full rounded-md" @click="showNext"><img src="../../assets/arrow_down_wo_border.svg" alt=""></button>
  {{ currentsubPage }}/{{ AllscreenKeyPage }}</div>
  
  </div>
  <div v-show="afterSearch"  class="flex -mt-2 w-[950px] h-[95%]" >
   <div class="flex w-full h-full ">
    <VueDraggableNext
    v-model="items"
    :move="onMove"
     @end="onEnd"
     animation="200"
    class="grid grid-cols-4 grid-rows-4 ml-10 mt-4 w-full h-full gap-x-2" 
  >
    <div
      v-for="(item, index) in items"
      class="screen-muuri-sort-empty flex items-center justify-center !h-32 !w-[213px]"
      :class="{' !border-blue-700' : clickedMenuKey==index }"
      @click="saveMenuKeyposition(index); clickedMenuKey = index; clickedMenukeys()"
    >
      <span class="flex flex-col items-center justify-center" ><span v-if="item && (item.strUserFileName !='' && item.strUserFileName != undefined)" class="mt-2 h-20 w-28 flex justify-center"><img :src="`http://www.pncoffice.net/MenuImage/Image/${item.strUserFileName}`" alt="" class="h-full w-full"></span><span>{{ item ? item.strKeyName : '' }}</span></span>
    </div>
  </VueDraggableNext>
   <div class="flex flex-col ml-3 w-10 h-full mt-5 items-center justify-center">
    <div class="border  flex items-center border-[#CCCCCC] w-full h-full rounded-md " @click="prevMenuKey">
      <img src="../../assets/arrow_up_wo_border.svg" alt=""></div>
    <div class="border border-[#CCCCCC] w-full h-full rounded-md flex items-center" @click="nextMenuKey"><img src="../../assets/arrow_down_wo_border.svg" alt=""></div>
    <div>{{ currmenuKeyPage }} /33</div>
  </div> 
  </div>
  </div>
  </div>
  
  
  
  </div>
  
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue';
  import { useStore } from 'vuex';
  import { deletetablePosMenuKey, get_category_info, getCategoryInfo, getMenuKeyList, getMenuKeyList3, getMenuList, getMultiLingual, getScreenList, getTablePosMenuKey, getTLUList, saveAllMenuKey, saveScreenKeys, savetablePosMenuKey, tablePosMenuKey, tablePosMenuKey_v2 } from '@/api/master';
  import { VueDraggableNext } from 'vue-draggable-next';
  import Swal from 'sweetalert2';

  import {  GridView, LocalDataProvider } from 'realgrid';
  import DupliPopUp from '@/components/dupliPopUp.vue';

import PickStore7kio from '@/components/pickStore7kio.vue';
  
  
  // 더미 데이터
  const items = ref([]);
  const clickedScreenKeyIndex = ref()
  const ScreenKeyOrigin = ref([]);
  const clickedMenuKey = ref()
  const ScreenKeys = ref([]);
  const currentMenuorTLU = ref(false)
  const forsearchMain = ref('0')
  const forsearchSub = ref('0')
  const addscreenKey = ref(false)
  const searchWord = ref('')
  const searchWord2 = ref('')
  const afterSearch2 = ref(false)
  // 드래그 가능한 요소를 설정하는 메서드
  const currentsubPage = ref(1);
  const changeMode = ref(false);
  const changingMode = (data) => {
    if ( data == 1){
      changeMode.value = false
    } else {
      changeMode.value = true
    }
  
  }
  const nowscreenNo = ref()
  const clickedStoreNm = ref()
  const handlestoreNm = (newData) => {
    clickedStoreNm.value = newData
  }
  const showPopup2 = ref(false)
  const showChangeScreenKey = ref(false)
  const confirmitem= ref([]);
  const currentscreenKeyNm = ref('');
  const maxSubCode = ref();
  const posNo = ref();
  const changeScreenKey = ref(false);
  const currmenuKeyPage = ref(1)
  const AllscreenKeyPage = ref(1)
  const currentSelectedMenuNm = ref("")
  const currentMenu = ref(false)
  
  
  const showPopupf = () => {
    if(afterSearch.value == false) {
      Swal.fire({
        title: '조회를 먼저 해주세요.',
        confirmButtonText: '확인',
      })
      return ;
    }
    showPopup2.value = true;
  }
  
  
  const showNext = () => {
  if(currentsubPage.value >= Math.ceil(ScreenKeyOrigin.value.length /10)){
     return ; 
  }
  currentsubPage.value ++;
  
  addfor10ScreenKey()
  }
  const showPrev = () => {
    console.log(ScreenKeyOrigin.value)
  if (currentsubPage.value == 1 ){
    return ;
  }
  currentsubPage.value --;
  ScreenKeys.value = ScreenKeyOrigin.value.slice(10 * (currentsubPage.value-1), 10 * (currentsubPage.value-1)+10);
  
  }
  const updateMenuKey = ref(false)
 

  const nowStoreAreaCd = ref();
  const  handleStoreAreaCd = (newValue) => {
  
  nowStoreAreaCd.value = newValue ;
  console.log(nowStoreAreaCd.value)
  }
  
  const nowStoreCd = ref();
  const afterCategory = ref(false);
  const  handleStoreCd = (newValue) => {
  if(newValue == '0'){
      afterSearch.value = false;
  }
  nowStoreCd.value = newValue ;
  }
  const Category = ref([]);

  const MenuGroup = ref([])
  const SubMenuGroup = ref([])

  const store = useStore();

  const userData = store.state.userData; 
  const groupCd = ref(userData.lngStoreGroup);
  const modified = ref(false);
  const afterSearch = ref(true);
  const MenuList = ref([])
  const MenuKeyList = ref([])
  const clickedScreenOrMenu = ref(false)
  const TLUList = ref([])
  const clickedScreenNo = ref()
  const searchMenu = async () => {
      changeMode.value = false
      Category.value = [] ;
      MenuList.value = []
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
  if(nowStoreAreaCd.value == '0' || nowStoreAreaCd.value == undefined) {
      Swal.fire({
          title: '경고',
          text: '포스번호를 선택하세요.',
          icon: 'warning',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          allowOutsideClick: false
      })
      return;
  }
  store.state.loading = true;
  try {
      const res2 = await getMenuList(groupCd.value,nowStoreCd.value);
      MenuList.value = res2.data.menuList
      MenuGroup.value = res2.data.menuGroup
      SubMenuGroup.value = res2.data.submenuGroup
    
      const res3 = await getScreenList( groupCd.value,nowStoreCd.value, nowStoreAreaCd.value , posNo.value )
      const res4 = await getMenuKeyList3(groupCd.value,nowStoreCd.value, nowStoreAreaCd.value)
      MenuKeyList.value =res4.data.MenuKeyList
      ScreenKeyOrigin.value = res3.data.ScreenList;
      console.log( MenuKeyList.value)
     
      addfor10ScreenKey()
      console.log(ScreenKeys.value)
      AllscreenKeyPage.value = Math.ceil(ScreenKeyOrigin.value.length /10)
  
      confirmitem.value = [...MenuList.value]
     
      MenuList.value = MenuList.value.map(item => {
      return {
        ...item,
        add: '추가'
      }
    })
    TLUList.value = TLUList.value.map(item => {
      return {
        ...item,
        add: '추가'
      }
    })
  } catch (error) {
      afterSearch.value = false;
  } finally {
      
      store.state.loading = false; // 로딩 상태 종료
               modified.value = false ;
               afterCategory.value = false;
               afterSearch.value = true;
  }
  
  
  calculateMaxSubCode();
  
  };
  const filteredSubMenuGroup = ref([]);
  const setSubCd = () => {
    console.log(forsearchMain.value)
    console.log(SubMenuGroup.value)
    filteredSubMenuGroup.value = SubMenuGroup.value.filter(item => item.sublngMajor == forsearchMain.value)
    console.log(filteredSubMenuGroup.value)
    forsearchSub.value = '0'
  }
  const clickedintScreenNo = ref()
  const calculateMaxSubCode = () =>{
  maxSubCode.value = Math.max(
     ...Category.value
  .filter(item => item.SubCategory && item.SubCategory.length > 0)
  .flatMap(item => item.SubCategory.map(sub => Number(sub.SubCode))));
  }
  const showMenuKey =(value) => {
    if(clickedintScreenNo.value != value) {
      currmenuKeyPage.value = 1
    }
    clickedintScreenNo.value = value
    items.value = Array.from({ length: 16 }, (_, index) => ({
            intKeySeq: index + 1, // 인덱스에 1을 더하여 값 설정
        }));
    console.log(MenuKeyList.value)
    MenuKeyList.value.filter(item => item.intPosNo == posNo.value && item.intScreenNo ==value).forEach(item =>  {
      console.log(item)
      const position = item.intKeySeq - (currmenuKeyPage.value -1)*16 -1
      if(position >= 0 && position < 16){
            items.value[position] = item
     
      }
      
    })
    console.log(items.value)
    afterSearch2.value =true
  }
  watch(ScreenKeys,(newvalue) => {
      if(ScreenKeys.value.length >10){
        AllscreenKeyPage.value = Math.ceil(ScreenKeys.value.length /10)
      }
  })
  const showScreenKeysOrder =() => {
    showChangeScreenKey.value = !showChangeScreenKey.value
  }
  
  let targetItemIndex2 ;
  const onMove = (evt) => {
  // 예: 드래그 중 이동할 때의 조건 등을 설정할 수 있음
  if( changeMode.value == false) {
  targetItemIndex2 = Array.from(evt.from.children).indexOf(evt.related);
  return false;
  } else {
  return true;
  }
  
  };
  let targetItemIndex3 ; 
  let dupliScreenKeyOrigin;
  const onMove2 = (evt) => {
  // 예: 드래그 중 이동할 때의 조건 등을 설정할 수 있음
  targetItemIndex3 = Array.from(evt.from.children).indexOf(evt.related)
  
  dupliScreenKeyOrigin = [...ScreenKeyOrigin.value]
  return true;
  
  };
  const clickedMove = ref(false)
  const onEnd = (evt) => {
  // Swap을 처리할 조건
  if (changeMode.value === false) {
  const oldIndex = evt.oldIndex;  // 드래그된 아이템의 기존 인덱스
  const swappedItems = [...items.value];  // items를 복사
  const temp = swappedItems[oldIndex];
  
  swappedItems[oldIndex] = swappedItems[targetItemIndex2];
  
  swappedItems[targetItemIndex2] = temp;
  
  
   console.log(swappedItems)
  // 배열을 업데이트
//   items.value = swappedItems;
  
  items.value = swappedItems.map((item, index) => ({
  ...item, // 기존 객체의 다른 속성 유지
  intKeySeq: (index+ (clickedintScreenNo.value-1)*16) + 1 // 배열 순서대로 intKeySeq 재정렬
}));

  } else {
  updateMenuKey.value = true
  items.value = items.value.map((item, index) => ({
  ...item, // 기존 객체의 다른 속성 유지
  intKeySeq: (index+ (clickedintScreenNo.value-1)*16) + 1 // 배열 순서대로 intKeySeq 재정렬
}))
  }
  console.log(clickedintScreenNo.value)
      MenuKeyList.value = MenuKeyList.value.filter(item =>  (item.intScreenNo !=clickedintScreenNo.value) || (item.intScreenNo ==clickedintScreenNo.value) && item.intKeySeq < (clickedintScreenNo.value -1) *16 +1  && item.intKeySeq > (clickedintScreenNo.value) *16)
      items.value.forEach(item => {
        if( item.lngKeyscrNo != undefined){
            MenuKeyList.value.push(item)
        }
       
      })
  console.log("Items:", items.value);
  console.log("MenuKeyList:", MenuKeyList.value);
 
  };
  function formatNumber(value) {
    if (!value) return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  const onEnd2 = (evt) => {
      console.log(ScreenKeyOrigin.value)
      const originScreenNo =  dupliScreenKeyOrigin[evt.oldIndex].intScreenNo
      const targetScreenNo =  dupliScreenKeyOrigin[targetItemIndex3].intScreenNo
      ScreenKeyOrigin.value.forEach((item,index) => {
        item.intScreenNo = (index+1)
      })
      MenuKeyList.value.filter(item => item.intPosNo == posNo.value ).forEach((item,index) => {
        if(item.intScreenNo == originScreenNo) {
          item.intScreenNo = targetItemIndex3+1
        } else if ( item.intScreenNo == targetScreenNo ){
          item.intScreenNo = evt.oldIndex+1
        }
      })
      addfor10ScreenKey()
      console.log(items.value)
      console.log(MenuKeyList.value)
      showMenuKey(clickedintScreenNo.value)
  }
  watch(items, (newvalue) => {
 
     
});

  const savePosMenu = async() => {
    if(afterSearch.value == false) {
      Swal.fire({
        title: '경고',
        text: '조회를 먼저 진행해주세요.',
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
      const screenKeyNoarr =  ScreenKeyOrigin.value.map(item => item.intScreenNo)
      const screenKeyNamearr =  ScreenKeyOrigin.value.map(item => item.strScreenName)
      console.log(screenKeyNoarr.join(','))
      console.log(screenKeyNamearr.join(','))
      const res = await saveScreenKeys(groupCd.value,nowStoreCd.value, nowStoreAreaCd.value , posNo.value , screenKeyNoarr.join(',') ,screenKeyNamearr.join(',') )
      
      
      const intKeySeqs = MenuKeyList.value.filter(item => item.intPosNo == posNo.value).map(item => item.intKeySeq)
      const screenNumarr = MenuKeyList.value.filter(item => item.intPosNo == posNo.value).map(item => item.intScreenNo)
      const lngScrarr = MenuKeyList.value.filter(item => item.intPosNo == posNo.value).map(item => item.lngKeyscrNo)
      const menuKeyNmarr = MenuKeyList.value.filter(item => item.intPosNo == posNo.value).map(item => item.strKeyName)
      console.log(posNo.value)
      console.log(intKeySeqs.join(','))
      console.log(screenNumarr.join(','))
      console.log(lngScrarr.join(','))
      console.log(menuKeyNmarr.join(','))
      const res2 = await saveAllMenuKey(groupCd.value,nowStoreCd.value, nowStoreAreaCd.value , posNo.value , intKeySeqs.join(',') ,screenNumarr.join(',') , lngScrarr.join(','), menuKeyNmarr.join(','))
      
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
  let gridView;
  let dataProvider;
  const currentSelectedMenuCode = ref('')
  const currentSelectedMenuImgUrl = ref('')
  onMounted(() => {
    showMenuKeys()
  })
  
  const showMenuKeys = () => {
   
    if (gridView) {
      gridView.destroy();  // 기존 그리드 인스턴스 파괴
    }
  
    dataProvider = new LocalDataProvider();
    
    // 2. GridView 설정
    gridView = new GridView('realgrid');
    gridView.setDataSource(dataProvider);
  
    // 3. 필드 정의
    const fields = [
      { fieldName: 'menuCd', dataType: 'text' },
      { fieldName: 'menuNm', dataType: 'text' },
      { fieldName: 'lngPrice', dataType: 'number'  },
      { fieldName: 'strUserFileName', dataType: 'text'  },
      { fieldName: 'add', dataType:'text' },
    ];
    dataProvider.setFields(fields);
  
  
    // 4. 컬럼 정의
    const columns = [
      { name: '메뉴코드', fieldName: 'menuCd',  header: { text: '메뉴코드' ,
      styleName : 'header-style-0'
       } },
      { name: '메뉴명', fieldName: 'menuNm',  header: { text: '메뉴명'  ,
      styleName : 'header-style-1'
      } },
      { name: '판매가', fieldName: 'lngPrice', header: { text: '판매가',
      styleName : 'header-style-2' } , numberFormat : '#,##0' },
      { name: 'strUserFileName', fieldName: 'strUserFileName', header: { text: 'strUserFileName',
      styleName : 'header-style-2' } , numberFormat : '#,##0' , visible: false },
      { name: '선택', fieldName: 'add'
        ,header: { text: '선택',styleName : 'header-style-3'} , editable:false, renderer:{
        type:"button"
       }
  
      },
      
    ];
    gridView.setColumns(columns);
    // 5. 샘플 데이터 추가
    dataProvider.setRows(MenuList.value);
    console.log(MenuList.value)
    gridView.sortMode = 'explicit';
    gridView.filterMode = 'explicit';
    gridView.setFooters({ visible: false})
    gridView.setRowIndicator({
      visible: true
    });
    gridView.setCheckBar({
      visible: false,
    });
    gridView.displayOptions.fitStyle = "even";
    gridView.sortingOptions.enabled = true;
    
    gridView.commit();
    gridView.onCellEdited = function (grid, itemIndex, row, field) {
      // 데이터가 수정될 때 rows를 갱
      gridView.commit();
    
    // 이후 데이터 갱신 (필요시 rows를 업데이트)
   
    };
  
    gridView.onCellItemClicked = function (grid, index, clickData) {
      currentSelectedMenuCode.value = dataProvider.getRows()[clickData.itemIndex][0]
      currentSelectedMenuNm.value = dataProvider.getRows()[clickData.itemIndex][1]
      currentSelectedMenuImgUrl.value = dataProvider.getRows()[clickData.itemIndex][3]
     
      addMenuKey()
    return true;
  }
  }
  
  let gridView2 ;
  let dataProvider2 ;
  const clickedTLUCD = ref();
  const clickedTLUNM = ref();
  
  

  const searchMenuList = (e) => {
    const searchWord1 = e.target.value
    searchWord.value = e.target.value
    const filteredList = MenuList.value.filter(item =>
    (forsearchMain.value === '0' || item.majorGroupCd === forsearchMain.value) &&
    (forsearchSub.value === '0' || item.subGroupCd === forsearchSub.value) &&
    (item.menuCd.includes(searchWord1) || item.menuNm.includes(searchWord1))
  );
  dataProvider.setRows(filteredList);
  
  }
  const searchMenuList3 = (e) => {
    if(currentMenuorTLU.value == false) {
  
    const filteredList = MenuList.value.filter(item =>
    (forsearchMain.value === '0' || item.majorGroupCd === forsearchMain.value) &&
    (forsearchSub.value === '0' || item.subGroupCd === forsearchSub.value) &&
    (item.menuCd.includes(searchWord.value) || item.menuNm.includes(searchWord.value))
  );
  dataProvider.setRows(filteredList);
  } else {
    const filteredList = TLUList.value.filter(item =>
  
    (item.lngCode.toString().includes(searchWord2.value) || item.strName.includes(searchWord2.value))
  );
  dataProvider2.setRows(filteredList);
  }
  
  } 
  
  const searchMenuList2 = (e) => {
    const searchword2 = e.target.value
    searchWord2.value = e.target.value
    const filteredList = TLUList.value.filter(item =>
  
    (item.lngCode.toString().includes(searchword2) || item.strName.includes(searchword2))
  );
  
  dataProvider2.setRows(filteredList);
  
  }
  
  
  const handlePosNo = (newValue) => {
    posNo.value = newValue
    console.log(posNo.value)
    if(posNo.value !='0'){
      searchMenu()
    }
   
  }
  
  watch(() => MenuList.value, () => {
    showMenuKeys();  // MenuKeyList 값이 변경될 때마다 그리드 업데이트
  });
  
  const editScreenKey = (value) => {
    clickedScreenNo.value = value
    changeScreenKey.value = true ;
  }
  
  const exitScreenKey = () =>{
    changeScreenKey.value = false ;
    addscreenKey.value = false
  }
  const confirmScreenKey = () =>{
    const index = ScreenKeyOrigin.value.findIndex(item => item.intScreenNo == clickedScreenNo.value)
    ScreenKeyOrigin.value[index].strScreenName = currentscreenKeyNm.value
    changeScreenKey.value = false ;
    console.log(ScreenKeyOrigin.value)
    addfor10ScreenKey()
    currentscreenKeyNm.value = ''
    clickedScreenNo.value = ''
  }
  
  const addfor10ScreenKey = () => {
    ScreenKeys.value = [...ScreenKeyOrigin.value.slice(8 * (currentsubPage.value-1), 8 * (currentsubPage.value-1)+8)];
      const length = ScreenKeys.value.length
      if (length <8){
        ScreenKeys.value.push({strScreenName : '' , intScreenNo : '' , new : true})
        for(var i=0 ; i< 7-length; i++){
          ScreenKeys.value.push({strScreenName : '' , intScreenNo : ''})
        }
      }
    
  }
  
  const addfor30MenuKeys = () => {
  
      const length = items.value.length
      if (length <30){
        for(var i=0 ; i< 30-length; i++){
          items.value.push({strScreenName : '' , intScreenNo : ''})
        }
      }
  }
  
  const addScreenKey = (value) => {
    addscreenKey.value = true 
    console.log(value)
    clickedScreenNo.value = value +1
  }
  
  const confirmaddScreenKey = () => {
    if(currentscreenKeyNm.value == '' || currentscreenKeyNm.value == null){
      Swal.fire({
        title: '오류',
        text: '화면키 이름을 입력하세요.',
        icon: 'error',
        confirmButtonText : '확인'
      })
      return ;
    }
    const newScreenNo = ScreenKeyOrigin.value[ScreenKeyOrigin.value.length-1].intScreenNo +1;
    ScreenKeyOrigin.value.push({strScreenName : currentscreenKeyNm.value , intScreenNo : newScreenNo  })
    addscreenKey.value = false
    addfor10ScreenKey()
    console.log(ScreenKeyOrigin.value)
    currentscreenKeyNm.value = ''
    console.log(clickedScreenNo.value)
    showMenuKey(clickedScreenNo.value + (currentsubPage.value -1)*10)
  }
  
  
  
  const prevMenuKey = () => {
    if(currmenuKeyPage.value == 1){
      return ;
    }
    currmenuKeyPage.value--
  
    items.value = Array.from({ length: 16 }, (_, index) => ({
            intKeySeq: index + 1, // 인덱스에 1을 더하여 값 설정
        }));
    MenuKeyList.value.filter(item => item.intPosNo == posNo.value && item.intScreenNo == clickedintScreenNo.value).forEach(item =>  {
      console.log(item)
      
      const position = item.intKeySeq -(currmenuKeyPage.value-1)*16  -1
      if (position >= 0 && position < 16) {
       items.value[position] = item
      }
    })
  
  }
  const nextMenuKey = () => {
    if ( currmenuKeyPage.value == 33) {
      return ;
    }
    currmenuKeyPage.value++
  
    items.value = Array.from({ length: 16 }, (_, index) => ({
            intKeySeq: index + 1, // 인덱스에 1을 더하여 값 설정
        }));
    MenuKeyList.value.filter(item => item.intPosNo == posNo.value && item.intScreenNo == clickedintScreenNo.value).forEach(item =>  {
      console.log(item)
      const position = item.intKeySeq -(currmenuKeyPage.value-1)*16-1
      if (position >= 0 && position < 16) {
       items.value[position] = item
      }
    })
  
  }
  const existMenuKey = ref(false)
  const clickedRealIndex = ref()
  const saveMenuKeyposition = (index) => {
      console.log(clickedintScreenNo.value)
      console.log(index)
      console.log(items.value)
  
  clickedRealIndex.value = (currmenuKeyPage.value - 1) * 30 + index + 1
   console.log(clickedRealIndex.value)
  }
  
  const addMenuKey =() => {
    console.log( MenuKeyList.value)
    console.log( clickedRealIndex.value)
    const foraddIndex = MenuKeyList.value.findIndex((item) =>
    item.intPosNo == posNo.value &&
    item.intScreenNo == clickedintScreenNo.value &&
    item.intKeySeq == clickedRealIndex.value
);

    console.log(foraddIndex)
    if( foraddIndex == -1) {
      MenuKeyList.value.push({intKeyNo: 6, intKeySeq : clickedRealIndex.value , intPosNo : posNo.value , intScreenNo: clickedintScreenNo.value , lngKeyscrNo: Number(currentSelectedMenuCode.value) , strKeyName: currentSelectedMenuNm.value , strUserFileName : currentSelectedMenuImgUrl.value})
    } else {
      MenuKeyList.value[foraddIndex] = {intKeyNo: 6, intKeySeq : clickedRealIndex.value , intPosNo : posNo.value , intScreenNo: clickedintScreenNo.value , lngKeyscrNo: Number(currentSelectedMenuCode.value) , strKeyName: currentSelectedMenuNm.value ,strUserFileName : currentSelectedMenuImgUrl.value }
    }
    showMenuKey(clickedintScreenNo.value)
    console.log( MenuKeyList.value)
  }
  
  const addTLUKey =() => {
    console.log( MenuKeyList.value)
    const foraddIndex = MenuKeyList.value.findIndex(item => item.intKeySeq == clickedRealIndex.value)
    console.log(foraddIndex)
    if( foraddIndex == -1) {
      MenuKeyList.value.push({intKeyNo: 6, intKeySeq : clickedRealIndex.value , intPosNo : posNo.value , intScreenNo: clickedintScreenNo.value , lngKeyscrNo: Number(clickedTLUCD.value) , strKeyName: clickedTLUNM.value})
    } else {
      MenuKeyList.value[foraddIndex] = {intKeyNo: 6, intKeySeq : clickedRealIndex.value , intPosNo : posNo.value , intScreenNo: clickedintScreenNo.value , lngKeyscrNo: Number(clickedTLUCD.value) , strKeyName: clickedTLUNM.value}
    }
    showMenuKey(clickedintScreenNo.value)
  }
  
  const deletekey = () => {
    if(clickedScreenOrMenu.value == false) {
    
        ScreenKeyOrigin.value = ScreenKeyOrigin.value.filter(item => item.intScreenNo !=clickedintScreenNo.value)
        addscreenKey.value = false
        addfor10ScreenKey()
       
        MenuKeyList.value = MenuKeyList.value.filter(item=> item.intScreenNo!=clickedintScreenNo.value)
        currentscreenKeyNm.value = ''
    
        clickedintScreenNo.value= clickedintScreenNo.value +1 ;
        showMenuKey(clickedintScreenNo.value)
    } else {
     
       MenuKeyList.value = MenuKeyList.value.filter(item=> (item.intScreenNo!=clickedintScreenNo.value || item.intKeySeq != clickedRealIndex.value))
       console.log(MenuKeyList.value)
       showMenuKey(clickedintScreenNo.value)
    }
  }
  
  const clickedMenukeys = () => {
    clickedScreenOrMenu.value= true
  }
  const clickedScreenKeys = () => {
    clickedScreenOrMenu.value= false
  }
  const handleinitAll = (newvalue) => {
    MenuList.value = []
      MenuGroup.value =[]
      SubMenuGroup.value=[]
      MenuKeyList.value =[]
      ScreenKeyOrigin.value =[]
      TLUList.value = []
      AllscreenKeyPage.value = '1'
      MenuList.value =[]
      ScreenKeys.value = []
      items.value = []
    
  } 
  </script>
  
  
  <style scoped>
  
  </style>
  