<template>
  <div class="flex justify-between items-center w-full overflow-y-auto">
  <div class="flex justify-start  w-full pl-4 pt-4">
             <div class="flex justify-start"><h1 class="font-bold text-sm md:text-2xl w-full">
              메뉴키 설정
             </h1></div>
              
             </div>
             <div class="flex justify-center mr-10 space-x-2 ml-[945px]"><button @click="searchMenu" class="button search md:w-auto w-14">조회</button>
            
            <button @click="savePosMenu" class="button save w-auto">저장</button>
            <button @click="" class="button primary w-auto">복사</button>
          </div>

</div>
<br>
<div class="flex justify-start  space-x-5 bg-gray-200 rounded-lg md:h-16 h-24 items-center"><PickStore5 @areaCd="handleStoreAreaCd" @update:storeCd="handleStoreCd" @posNo="handlePosNo"></PickStore5> </div> 
<div v-if="changePopup" class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
  <div class="bg-white p-6 rounded shadow-lg">
    <h2 class="text-lg font-bold">다국어 설정</h2>
    <div class="flex flex-col justify-start">
    <p>한국어</p><input type="text" class="border border-gray-400 pl-1" v-model="languageName0">
    <p>영어</p><input type="text" class="border border-gray-400 pl-1" v-model="languageName1">
    <p>중국어</p><input type="text" class="border border-gray-400 pl-1" v-model="languageName2">
    <p>일본어</p><input type="text" class="border border-gray-400 pl-1" v-model="languageName3">
    <p>스페인어</p><input type="text" class="border border-gray-400 pl-1" v-model="languageName4">
  </div>
  <div class="flex justify-center space-x-3">
    <button @click="setLang()" class="mt-4 p-2 bg-blue-500 text-white rounded">확인</button>
    <button @click="showPopup(false)" class="mt-4 p-2 bg-blue-500 text-white rounded">닫기</button>
  </div>
  </div>
  
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
      <div class="h-full w-full"><input type="text" class="border border-gray-400 pl-1 h-full w-full" v-model="currentscreenKeyNm"></div>
  </div>
  <div class="flex justify-center space-x-3 w-full h-16">
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
      :key="item.intScreenNo"
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
<div class="flex h-5/6 w-full">
<div class="flex flex-col w-3/5 h-4/6">
<div class="flex justify-between mt-10 ml-10 w-full border-b  border-b-gray-300">
  
  <div>
    <button class="contents_tab-button " :class="{'text-blue-600' : currentMenu==false }" @click="showMenus(1)">메뉴관리</button>
    <button class="contents_tab-button" :class="{'text-blue-600' : currentMenu==true }"  @click="showMenus(2)">TLU관리</button>
  </div>
  <div class="mt-3">
    <button class="whitebutton" @click="searchMenuList">조회</button>
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
  <div class="px-1 py-1 border border-gray-300 rounded-br-lg "><input type="text" class="border w-full h-full px-1 border-gray-400 rounded-lg" v-model="searchWord" @keyup.enter="searchMenuList"></div>
</div>
  <div class="ml-10 mt-5 w-full h-full">

    <div id="realgrid" style="width: 100%; height: 180%;"></div>
  </div>
</div>

<div class="h-4/6" v-show="currentMenu">
<div class="mt-3 ml-10 grid grid-cols-[1fr,3fr] grid-rows-1 gap-0 w-full">
  <div class="customtableIndex border border-gray-400 rounded-tl-lg">TLU명/코드</div>
  <div class="px-1 py-1 border border-gray-300 rounded-br-lg "><input type="text" class="border w-full h-full px-1 border-gray-400 rounded-lg" v-model="searchWord2" @keyup.enter="searchMenuList2"></div>
</div>
  <div class="ml-10 mt-5 w-full h-full">

    <div id="realgrid2" style="width: 100%; height: 90%;"></div>
    <div id="realgrid3" style="width: 100%; height: 90%;" class="mt-5"></div>
  </div>
</div>
</div>
<!-- <div><button class="button primary " @click="changingMode">교체하기밀어내기</button></div> -->
<div class="grid grid-rows-[2fr,5fr] grid-cols-1 ml-10 w-full h-full">
  <div class="flex h-full w-[950px] mt-10" v-show="afterSearch" >
  <div  class="grid grid-cols-5 grid-rows-2 gap-0  ml-10 mt-0 w-full h-[80%]">
<div v-for="item in ScreenKeys" class="screen-muuri-sort-empty flex justify-center items-center w-[160px] h-[90px] " >
  <p v-if="item.strScreenName != ''" @click="showMenuKey(item.intScreenNo)" class=" flex items-center justify-center"><button >{{ item.strScreenName }} </button><button @click.stop="editScreenKey(item.intScreenNo)"><font-awesome-icon :icon="['far', 'pen-to-square']" /></button></p> 
  <p v-else-if="item.new == true" @click="addScreenKey(item.intScreenNo)" class=" flex items-center justify-center"><button > 화면키 추가 </button></p> 
  <p v-else class="flex items-center justify-center"></p> 

</div>
</div>
<div class="flex flex-col mt-2 ml-2 w-10 h-4/6  "><button class="border border-[#CCCCCC] w-full h-full rounded-md" @click="showPrev"><img src="../../assets/arrow_up_wo_border.svg" alt=""></button><button class="border border-[#CCCCCC] h-full rounded-md" @click="showScreenKeysOrder"><img src="../../assets/table-change_2.svg" alt=""></button><button class="border border-[#CCCCCC] w-full h-full rounded-md" @click="showNext"><img src="../../assets/arrow_down_wo_border.svg" alt=""></button></div>

</div>
<div v-show="afterSearch"  class="flex mt-2 w-[950px] h-full">
 <div class="flex w-[950px] h-full ">
  <VueDraggableNext
  v-model="items"
  :move="onMove"
   @end="onEnd"
   animation="200"
  class="grid grid-cols-5 grid-rows-6  ml-10 mt-4 w-full h-full gap-0 " 
>
  <div
    v-for="(item, index) in items"
    :key="index"
    class="screen-muuri-sort-empty flex items-center justify-center w-[160px] h-[90px]"
    :class="{'!bg-orange-300 !border-gray-400' : clickedMenuKey==index }"
    @click="saveMenuKeyposition(index); clickedMenuKey = index;"
  >
    {{ item ? item.strKeyName : '' }}
  </div>
</VueDraggableNext>
 <div class="flex flex-col ml-3 w-10 h-5/6 mt-7 items-center justify-center">
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
import { deletetablePosMenuKey, get_category_info, getCategoryInfo, getMenuKeyList, getMenuList, getMultiLingual, getScreenList, getTablePosMenuKey, getTLUList, saveAllMenuKey, saveScreenKeys, savetablePosMenuKey, tablePosMenuKey, tablePosMenuKey_v2 } from '@/api/master';
import { VueDraggableNext } from 'vue-draggable-next';
import Swal from 'sweetalert2';
import PickStore5 from '@/components/pickStore5.vue';
import {  GridView, LocalDataProvider } from 'realgrid';


// 더미 데이터
const items = ref([]);

const ScreenKeyOrigin = ref([]);
const clickedMenuKey = ref()
const ScreenKeys = ref();
const forsearchMain = ref('0')
const forsearchSub = ref('0')
const addscreenKey = ref(false)
const searchWord = ref('')
const searchWord2 = ref('')
// 드래그 가능한 요소를 설정하는 메서드
const currentsubPage = ref(1);
const changeMode = ref(false);
const changingMode = () => {
changeMode.value =!changeMode.value;
}
const showChangeScreenKey = ref(false)
const changePopup = ref(false);
const deleteAllitems = ref([]);
const popupData = ref([]);
const confirmitem= ref([]);
const languageName0 = ref('');
const languageName1 = ref('');
const languageName2 = ref('');
const languageName3 = ref('');
const languageName4 = ref('');
const currentscreenKeyNm = ref('');
const clickedSubCode = ref()
const maxSubCode = ref();
const posNo = ref();
const changeScreenKey = ref(false);
const currmenuKeyPage = ref(1)
const currentSelectedMenuNm = ref("")

const showPopup = (value) => {
if(value == false){
  changePopup.value = !changePopup.value
  return ;
}
console.log( getMultiLang.value)
changePopup.value = !changePopup.value
 popupData.value = getMultiLang.value.filter(item => item.categoryCode == value && item.TypeCode =='3')
 console.log( popupData.value)
languageName0.value = popupData.value.filter(item => item.LanguageID =='0')[0].LanguageName
languageName1.value = popupData.value.filter(item => item.LanguageID =='1')[0].LanguageName
languageName2.value = popupData.value.filter(item => item.LanguageID =='2')[0].LanguageName
languageName3.value = popupData.value.filter(item => item.LanguageID =='3')[0].LanguageName
languageName4.value =  popupData.value.filter(item => item.LanguageID =='4')[0] ? popupData.value.filter(item => item.LanguageID =='4')[0].LanguageName : ''
clickedSubCode.value = value;
}
const isNew = ref(false);
const currentMenu = ref(false)

const addData = (value) => {
console.log(value)
languageName0.value = ''
languageName1.value = ''
languageName2.value = ''
languageName3.value = ''
languageName4.value = ''
changePopup.value = true;
isNew.value =true;
clickedSubCode.value = value
}
const setLang = () => {

const index = getMultiLang.value.findIndex(item => item.categoryCode === clickedSubCode.value.toString() ); // id로 해당 항목 찾기
const index2 = ScreenKeyOrigin.value.findIndex(item => item.SubCode === clickedSubCode.value.toString() ); // id로 해당 항목 찾기

if (index !== -1) {
// 항목이 존재하면 수정
  let category = Category.value.find(category => category.MajorCode == clickedMainCategory.value).SubCategory
  let subCategory2 = category.find(item => item.SubCode == clickedSubCode.value.toString())
  subCategory2.SubName = languageName0.value
 

   getMultiLang.value.forEach(item => {
    if(item.categoryCode == clickedSubCode.value && item.TypeCode =='3'){
      if(item.LanguageID =='0'){
        item.LanguageName = languageName0.value
      } else if (item.LanguageID =='1') {
        item.LanguageName = languageName1.value
      } else if (item.LanguageID =='2') {
        item.LanguageName = languageName2.value
      } else if (item.LanguageID =='3') {
        item.LanguageName = languageName3.value
      } else if (item.LanguageID =='4') {
        item.LanguageName = languageName4.value
      }
    }
   })
   
console.log(ScreenKeyOrigin.value)
   subCategory.value = ScreenKeyOrigin.value.slice(10 * (currentsubPage.value-1), 10 * (currentsubPage.value-1)+10);
   console.log(subCategory.value)

} else {
  const category = Category.value.find(category => category.MajorCode == clickedMainCategory.value)
  category.SubCategory.push({SubCode : clickedSubCode.value , SubName : languageName0.value})
  getMultiLang.value.push({TypeCode: '3', categoryCode: clickedSubCode.value , LanguageID: '0', LanguageName: languageName0.value})
  getMultiLang.value.push({TypeCode: '3', categoryCode: clickedSubCode.value , LanguageID: '1', LanguageName: languageName1.value})
  getMultiLang.value.push({TypeCode: '3', categoryCode: clickedSubCode.value , LanguageID: '2', LanguageName: languageName2.value})
  getMultiLang.value.push({TypeCode: '3', categoryCode: clickedSubCode.value , LanguageID: '3', LanguageName: languageName3.value})
  getMultiLang.value.push({TypeCode: '3', categoryCode: clickedSubCode.value , LanguageID: '4', LanguageName: languageName4.value})
  currSubCategory.value = Category.value.filter(item => item.MajorCode == clickedMainCategory.value)[0].SubCategory
  ScreenKeyOrigin.value = [...currSubCategory.value];
  console.log(ScreenKeyOrigin.value)
  const currlength = ScreenKeyOrigin.value.length
  if(currlength< (currentsubPage.value)*10 ) {
    calculateMaxSubCode()
    ScreenKeyOrigin.value.push({SubCode : maxSubCode.value +1 , SubName : '', new:true})
    for(var i=0 ; i< (currentsubPage.value)*10-currlength ; i++ ){
      ScreenKeyOrigin.value.push({SubCode : '' , SubName : ''})
  }
  }
  
  subCategory.value = ScreenKeyOrigin.value.slice(10 * (currentsubPage.value-1), 10 * (currentsubPage.value-1)+10);
  
}
console.log(ScreenKeyOrigin.value)
isNew.value == false;
changePopup.value = !changePopup.value
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
let dupliitems = []

const saveMenuKeys =() => {
let dupliitems = [...items.value]
for(var i=0 ; i< dupliitems.length ; i++) {
if(dupliitems[i].lngKeyscrNo !=''){
  dupliitems[i].intKeySeq = (i +1).toString() ;
}

}
const updatedMenuKeys = dupliitems.filter(item => item.lngKeyscrNo !='')
console.log(updatedMenuKeys)

}
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
const selectedButton = ref();
const Category = ref([]);
const getMultiLang = ref([])
const MenuGroup = ref([])
const SubMenuGroup = ref([])
const MenuKeyGroup = ref([])
const subMultiLang = ref([])
const mainCategoryInsert = ref(false)
const store = useStore();
const currSubCategory = ref([]);
const clickedMainCategory = ref();
const clickedSubCategory = ref();
const convertedsubMultiLang = ref([])
const userData = store.state.userData; 
const groupCd = ref(userData.lngStoreGroup);
const modified = ref(false);
const afterSearch = ref(false);
const MenuList = ref([])
const MenuKeyList = ref([])
const TLUList = ref([])
const clickedScreenNo = ref()
const searchMenu = async () => {
    changeMode.value = false
    subMultiLang.value = [];
    Category.value = [] ;
    MenuList.value = []
    items.value = []
    languageName0.value = '';
    languageName1.value = '';
    languageName2.value = '';
    languageName3.value = '';
    languageName4.value = '';
    convertedsubMultiLang.value = [];
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
        text: '지역코드를 선택하세요.',
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
    const res4 = await getMenuKeyList(groupCd.value,nowStoreCd.value, nowStoreAreaCd.value)
    MenuKeyList.value =res4.data.MenuKeyList
    ScreenKeyOrigin.value = res3.data.ScreenList;
    console.log( ScreenKeyOrigin.value)
    console.log(  MenuKeyList.value)
    const res5 = await getTLUList(groupCd.value,nowStoreCd.value)
    TLUList.value = res5.data.TLUList
    console.log(TLUList.value)
    addfor10ScreenKey()

    const res1 = await getMultiLingual( groupCd.value,nowStoreCd.value,)

    getMultiLang.value = res1.data.MultiLingual ;

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
}
const clickedintScreenNo = ref()
const calculateMaxSubCode = () =>{
maxSubCode.value = Math.max(
   ...Category.value
.filter(item => item.SubCategory && item.SubCategory.length > 0)
.flatMap(item => item.SubCategory.map(sub => Number(sub.SubCode))));
}
const showMenuKey =(value) => {
  clickedintScreenNo.value = value
  items.value = Array(30).fill(null)
  MenuKeyList.value.filter(item => item.intPosNo == posNo.value && item.intScreenNo ==value).forEach(item =>  {
    console.log(item)
    const position = item.intKeySeq -1
     items.value[position] = item
  })
  console.log(items.value)
  
}

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
const onMove2 = (evt) => {
// 예: 드래그 중 이동할 때의 조건 등을 설정할 수 있음
return true;

};

const onEnd = (evt) => {
// Swap을 처리할 조건
if (changeMode.value === false) {
const oldIndex = evt.oldIndex;  // 드래그된 아이템의 기존 인덱스
const swappedItems = [...items.value];  // items를 복사
const temp = swappedItems[oldIndex];

swappedItems[oldIndex] = swappedItems[targetItemIndex2];

swappedItems[targetItemIndex2] = temp;



// 배열을 업데이트
items.value = swappedItems;

console.log(items.value  )
} else {
updateMenuKey.value = true
}

console.log(items.value)
};
watch( items , (newvalue) => {
  console.log(newvalue)
    newvalue.forEach((item,index) => {
      console.log(item)
        if ( item == null){
          newvalue[index] = { intKeySeq : index + (currmenuKeyPage.value -1)*30 +1}
        } else {
          item.intKeySeq = index + (currmenuKeyPage.value -1)*30 +1;
        }
        
    
    })

    console.log(items.value)
    console.log(MenuKeyList.value)

})
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

  if(JSON.stringify(confirmitem.value) === JSON.stringify(MenuList.value)) {
    Swal.fire({
      title: '경고',
      text: '변경된 항목이 없습니다.',
      icon: 'warning',
      confirmButtonText: '확인'
    })
    return ;
  }
  Swal.fire({
    title: '저장하시겠습니까?',
    text: '변경사항을 저장하시겠습니까?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: '저장',
    cancelButtonText: '취소',
    allowOutsideClick: false
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
      title: '저장 성공',
      text: '변경 사항이 저장되었습니다.',
      icon:'success',
      confirmButtonText: '확인'
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
    { name: '선택', fieldName: 'add'
      ,header: { text: '선택',styleName : 'header-style-3'} , editable:false, renderer:{
      type:"button"
     }

    },
    
  ];
  gridView.setColumns(columns);
  // 5. 샘플 데이터 추가
  dataProvider.setRows(MenuList.value);
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
    addMenuKey()
  return true;
}
}

let gridView2 ;
let dataProvider2 ;
const clickedTLUCD = ref();
const clickedTLUNM = ref();
const showMenuKeys2 = () => {
 
 if (gridView2) {
   gridView2.destroy();  // 기존 그리드 인스턴스 파괴
 }

 dataProvider2 = new LocalDataProvider();
 
 // 2. GridView 설정
 gridView2 = new GridView('realgrid2');
 gridView2.setDataSource(dataProvider2);

 // 3. 필드 정의
 const fields = [
   { fieldName: 'lngCode', dataType: 'text' },
   { fieldName: 'strName', dataType: 'text' },
   { fieldName: 'add', dataType:'text' },
 ];
 dataProvider2.setFields(fields);


 // 4. 컬럼 정의
 const columns = [
   { name: 'TLU코드', fieldName: 'lngCode',  header: { text: 'TLU코드' ,
   styleName : 'header-style-0'
    } },
   { name: 'TLU명', fieldName: 'strName',  header: { text: 'TLU명'  ,
   styleName : 'header-style-1'
   }},
   { name: '선택', fieldName: 'add'
     ,header: { text: '선택',styleName : 'header-style-3'} , editable:false, renderer:{
     type:"button"
    }

   },
   
 ];
 gridView2.setColumns(columns);
 // 5. 샘플 데이터 추가
 dataProvider2.setRows(TLUList.value);
 gridView2.sortMode = 'explicit';
 gridView2.filterMode = 'explicit';
 gridView2.setFooters({ visible: false})
 gridView2.setRowIndicator({
   visible: true
 });
 gridView2.setCheckBar({
   visible: false,
 });
 gridView2.displayOptions.fitStyle = "even";
 gridView2.sortingOptions.enabled = true;
 
 gridView2.commit();
 gridView2.onCellEdited = function (grid, itemIndex, row, field) {
   // 데이터가 수정될 때 rows를 갱
   gridView2.commit();
 
 // 이후 데이터 갱신 (필요시 rows를 업데이트)

 };
 gridView2.onCellClicked = function (grid, clickData) {
  if (clickData == undefined) {
    return ;
  }
  clickedTLUCD.value = dataProvider2.getRows()[clickData.itemIndex][0];
 }
 gridView2.onCellItemClicked = function (grid, clickData) {
  console.log(clickData.itemIndex )
  if (clickData.itemIndex == undefined) {
    return ;
  }
  clickedTLUCD.value = dataProvider2.getRows()[clickData.itemIndex][0];
  clickedTLUNM.value = dataProvider2.getRows()[clickData.itemIndex][1];
  addTLUKey()
}



}

let gridView3 ;
let dataProvider3 ;
const showMenuKeys3 = () => {
 
 if (gridView3) {
   gridView3.destroy();  // 기존 그리드 인스턴스 파괴
 }

 dataProvider3 = new LocalDataProvider();
 
 // 2. GridView 설정
 gridView3 = new GridView('realgrid3');
 gridView3.setDataSource(dataProvider3);

 // 3. 필드 정의
 const fields = [

    { fieldName: 'menuCd', dataType: 'text' },
    { fieldName: 'menuNm', dataType: 'text' },
   
 ];
 dataProvider3.setFields(fields);


 // 4. 컬럼 정의
 const columns = [
   { name: '메뉴코드', fieldName: 'menuCd',  header: { text: '메뉴코드' ,
   styleName : 'header-style-0'
    } },
   { name: '메뉴명', fieldName: 'menuNm',  header: { text: '메뉴명'  ,
   styleName : 'header-style-1'
   }},
   
 ];
 gridView3.setColumns(columns);
 // 5. 샘플 데이터 추가
 dataProvider3.setRows();
 gridView3.sortMode = 'explicit';
 gridView3.filterMode = 'explicit';
 gridView3.setFooters({ visible: false})
 gridView3.setRowIndicator({
   visible: true
 });
 gridView3.setCheckBar({
   visible: false,
 });
 gridView3.displayOptions.fitStyle = "even";
 gridView3.sortingOptions.enabled = true;
 
 gridView3.commit();
 gridView3.onCellEdited = function (grid, itemIndex, row, field) {
   // 데이터가 수정될 때 rows를 갱
   gridView3.commit();
 
 // 이후 데이터 갱신 (필요시 rows를 업데이트)

 };

 gridView3.onCellItemClicked = function (grid, index, clickData) {
  
 return true;
}

watch(clickedTLUCD , (newValue) => {
  const TLUMenuCd = TLUList.value
  .filter(item => item.lngCode == newValue)  // lngCode가 newValue와 일치하는 항목 필터링
  .map(item => {
    // 객체의 모든 키를 가져오고 'lngMenu'로 시작하는 키들만 필터링
    const filteredMenus = Object.keys(item)
      .filter(key => key.startsWith('lngMenu') && item[key] !== 0)   // 'lngMenu'로 시작하는 키들만 필터링
      .reduce((result, key) => {
        result[key] = item[key];  // 필터링된 속성만 포함
        return result;
      }, {});
    return filteredMenus;  // 필터링된 항목 반환
  });

  console.log(TLUMenuCd[0])
  const newTLUMenus = [];

Object.keys(TLUMenuCd[0]).forEach(key => {

  const menuValue = TLUMenuCd[0][key]; // menu1, menu2, ..., menu29 값 가져오기

  const filteredMenus = MenuList.value.filter(menuItem => menuItem.menuCd === menuValue.toString());
  newTLUMenus.push(...filteredMenus); // 결과 배열에 필터링된 메뉴들을 추가
});

 console.log(newTLUMenus);



  dataProvider3.setRows(newTLUMenus);
})
}
const searchMenuList = () => {
  
  const filteredList = MenuList.value.filter(item =>
  (forsearchMain.value === '0' || item.majorGroupCd === forsearchMain.value) &&
  (forsearchSub.value === '0' || item.subGroupCd === forsearchSub.value) &&
  (item.menuCd.includes(searchWord.value) || item.menuNm.includes(searchWord.value))
);
dataProvider.setRows(filteredList);

}

const searchMenuList2 = () => {

  const filteredList = TLUList.value.filter(item =>

  (item.lngCode.toString().includes(searchWord2.value) || item.strName.includes(searchWord2.value))
);

dataProvider2.setRows(filteredList);

}


const handlePosNo = (newValue) => {
  posNo.value = newValue
  searchMenu()
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
  ScreenKeys.value = [...ScreenKeyOrigin.value.slice(10 * (currentsubPage.value-1), 10 * (currentsubPage.value-1)+10)];
    const length = ScreenKeys.value.length
    if (length <10){
      ScreenKeys.value.push({strScreenName : '' , intScreenNo : '' , new : true})
      for(var i=0 ; i< 9-length; i++){
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
  clickedScreenNo.value = value
}

const confirmaddScreenKey = () => {
  const newScreenNo = ScreenKeyOrigin.value[ScreenKeyOrigin.value.length-1].intScreenNo +1;
  ScreenKeyOrigin.value.push({strScreenName : currentscreenKeyNm.value , intScreenNo : newScreenNo  })
  addscreenKey.value = false
  addfor10ScreenKey()
  console.log(ScreenKeyOrigin.value)
  currentscreenKeyNm.value = ''
  clickedScreenNo.value = ''
}

const onEnd2 = () => {
    ScreenKeyOrigin.value.forEach((item,index) => {
      item.intScreenNo = (index+1)
    })
    console.log( ScreenKeyOrigin.value)
    addfor10ScreenKey()
}

const prevMenuKey = () => {
  if(currmenuKeyPage.value == 1){
    return ;
  }
  currmenuKeyPage.value--
  items.value = [...Array(30).fill(null)]
  MenuKeyList.value.filter(item => item.intPosNo == posNo.value && item.intScreenNo == clickedintScreenNo.value).forEach(item =>  {
    console.log(item)
    
    const position = item.intKeySeq -(currmenuKeyPage.value-1)*30  -1
    if (position >= 0 && position < 30) {
     items.value[position] = item
    }
  })
}
const nextMenuKey = () => {
  if ( currmenuKeyPage.value == 33) {
    return ;
  }
  currmenuKeyPage.value++
 
  items.value = [...Array(30).fill(null)]
  MenuKeyList.value.filter(item => item.intPosNo == posNo.value && item.intScreenNo == clickedintScreenNo.value).forEach(item =>  {
    console.log(item)
    const position = item.intKeySeq -(currmenuKeyPage.value-1)*30-1
    if (position >= 0 && position < 30) {
     items.value[position] = item
    }
  })
  console.log(items.value)

}
const existMenuKey = ref(false)
const clickedRealIndex = ref()
const saveMenuKeyposition = (index) => {
    console.log(clickedintScreenNo.value)
    console.log(index)
    console.log(items.value)

clickedRealIndex.value = (currmenuKeyPage.value - 1) * 30 + index + 1
}

const addMenuKey =() => {
  console.log( MenuKeyList.value)
  const foraddIndex = MenuKeyList.value.findIndex(item => item.intKeySeq == clickedRealIndex.value)
  console.log(foraddIndex)
  if( foraddIndex == -1) {
    MenuKeyList.value.push({intKeyNo: 6, intKeySeq : clickedRealIndex.value , intPosNo : posNo.value , intScreenNo: clickedintScreenNo.value , lngKeyscrNo: Number(currentSelectedMenuCode.value) , strKeyName: currentSelectedMenuNm.value})
  } else {
    MenuKeyList.value[foraddIndex] = {intKeyNo: 6, intKeySeq : clickedRealIndex.value , intPosNo : posNo.value , intScreenNo: clickedintScreenNo.value , lngKeyscrNo: Number(currentSelectedMenuCode.value) , strKeyName: currentSelectedMenuNm.value}
  }
  showMenuKey(clickedintScreenNo.value)
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

const showMenus = (value) => {
  if(value ==1) {
    currentMenu.value = false
  } else {
    currentMenu.value = true
    showMenuKeys2()
    showMenuKeys3()
  }
}
</script>


<style scoped>

</style>
