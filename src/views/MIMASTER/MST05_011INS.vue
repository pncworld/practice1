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

<div v-show="showchangingSub" class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
<div class="bg-white p-6 rounded shadow-lg w-2/3 h-3/4 overflow-auto">
  <div>서브 카테고리 순서 변경</div>
  
  <!-- VueDraggableNext 사용 -->
  <VueDraggableNext
    v-model="subOriginCategory"
    :group="{ name: 'subCategory', pull: 'clone', put: true }"
    class="space-y-2"
    :move="onMove2"  
  >
    <div
      v-for="(item, index) in subOriginCategory"
      :key="item.SubCode"
      class="p-4 bg-gray-200 rounded-lg shadow-md cursor-move h-12"
      v-show="item && item.SubName !== ''"
    >
      <p>{{ item.SubName }}</p>
    </div>
  </VueDraggableNext>

  <div class="flex justify-center space-x-3">
    <button @click="changeSubCate" class="mt-4 p-2 bg-blue-500 text-white rounded">닫기</button>
  </div>
</div>
</div>
<div class="flex flex-col w-1/3 h-2/3">
<div class="flex justify-between mt-10 ml-10 w-full border-b  border-b-gray-300">
  <div>
    <button class="contents_tab-button">메뉴관리</button>
    <button  class="contents_tab-button">TLU관리</button>
  </div>
  <div class="mt-3">
    <button class="whitebutton" @click="searchMenuList">조회</button>
    <button class="whitebutton">추가</button>
  </div>
</div>

<div class="mt-3 ml-10 grid grid-cols-[1fr,3fr] grid-rows-2 gap-0 w-full">
  <div class="customtableIndex border border-gray-400 rounded-tl-lg">메뉴분류</div>
  <div class="px-4 py-2 border border-gray-300 rounded-tr-lg flex ">
    <select name="" id="" class="flex-1" @change="setSubCd" v-model="forsearchMain">
      <option value="0">전체</option>
      <option value="i.GroupCd" v-for="i in MenuGroup"> [{{i.GroupCd}}]{{ i.majorGroupNm }}</option>
    </select>
    <select name="" id="" class="flex-1" v-model="forsearchSub">
      <option value="0">전체</option>
      <option value="i.GroupCd" v-for="i in SubMenuGroup"> [{{i.GroupCd}}]{{ i.subGroupNm }}</option>
    </select>
  </div>
  <div class="customtableIndex border border-gray-400 rounded-bl-lg">메뉴명/코드</div>
  <div class="px-1 py-1 border border-gray-300 rounded-br-lg "><input type="text" class="border w-full h-full px-1 border-gray-400 rounded-lg" v-model="searchWord"></div>
</div>
  <div class="ml-10 mt-5 w-full h-full">

    <div id="realgrid" style="width: 100%; height: 140%;"></div>
  </div>
</div>
<div class="flex flex-col justify-end mr-5">
  <div class="flex absolute left-[50%] top-[24%] w-2/5 h-56">
<div  class="grid grid-cols-5 grid-rows-2 gap-3 mt-4 w-full h-full ">
<div v-for="item in subCategory" class="screen-muuri-sort-empty flex justify-center items-center" >
  <p v-if="item.SubName != ''" @click="showMenuKey(item.SubCode)" class="w-28 h-28 flex items-center justify-center"><button >{{ item.SubName }} </button><button @click.stop="showPopup(item.SubCode)"><font-awesome-icon :icon="['far', 'pen-to-square']" /></button></p> 
  <p v-else-if="item.new == true" class="text-gray-500 w-28 h-28 flex items-center justify-center" @click.stop="addData(item.SubCode)"><button><font-awesome-icon icon="plus" />카테고리 추가</button></p> 
  <p v-else class="text-gray-500 flex items-center justify-center"><button></button></p>
</div>
</div>
<div class="flex flex-col ml-3 w-5 h-full mt-4 absolute -right-10 "><button class="border border-gray-500 w-full h-full" @click="showPrev"><font-awesome-icon icon="arrow-up-long" class="w-full h-full"/></button><button class="border border-gray-400 h-full" @click="changeSubCate"><font-awesome-icon icon="bars" /></button><button class="border border-gray-500 w-full h-full" @click="showNext"><font-awesome-icon icon="arrow-down-long" class="w-full h-full"/></button></div>

</div>
<div class="flex justify-end -mt-3 mr-[2%]">
  <!-- 데이터를 드래그하여 이동시키기 위한 컨테이너 -->
   <div class="w-full h-full ">
   <button class="button primary absolute right-[25%] top-[52%]" @click="changingMode">교체하기밀어내기</button>
   <VueDraggableNext
  v-model="items"
  :move="onMove"
   @end="onEnd"
   animation="200"
  class="grid grid-cols-5 grid-rows-6 gap-3 mt-4 w-1/2 h-96 absolute bottom-5 right-10 pb-10 pr-10"
>
  <div
    v-for="(item, index) in items"
    :key="item.intKeySeq"
    class="screen-muuri-sort-empty flex items-center justify-center"
    :data-key="item.intKeySeq"
  >
    <p>{{ item.strKeyName }}</p>
  </div>
</VueDraggableNext>
</div>
</div>

</div>


</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { deletetablePosMenuKey, get_category_info, getCategoryInfo, getMenuList, getMultiLingual, savetablePosMenuKey, tablePosMenuKey, tablePosMenuKey_v2 } from '@/api/master';
import { VueDraggableNext } from 'vue-draggable-next';
import Swal from 'sweetalert2';
import PickStore5 from '@/components/pickStore5.vue';
import { ButtonVisibility, GridView, LocalDataProvider } from 'realgrid';


// 더미 데이터
const items = ref([]);

const subOriginCategory = ref([]);

const subCategory = ref(subOriginCategory.value.slice(0,10));
const forsearchMain = ref('0')
const forsearchSub = ref('0')

const searchWord = ref('')
// 드래그 가능한 요소를 설정하는 메서드
const container = ref(null);
let draggedItemIndex = null;
let targetItemIndex = null;
const currentsubPage = ref(1);
const changeMode = ref(false);
const changingMode = () => {
changeMode.value =!changeMode.value;
}
const showchangingSub = ref(false)
const changePopup = ref(false);
const currentId = ref();
const deleteAllitems = ref([]);
const popupData = ref([]);
const confirmitem= ref([]);
const languageName0 = ref('');
const languageName1 = ref('');
const languageName2 = ref('');
const languageName3 = ref('');
const languageName4 = ref('');
const clickedSubCode = ref()
const maxSubCode = ref();
const posNo = ref();
const sortableContainer =ref(null)
let sortableInstance = null;
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
const addData = (value) => {
console.log(value)
console.log(subCategory.value)
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
const index2 = subOriginCategory.value.findIndex(item => item.SubCode === clickedSubCode.value.toString() ); // id로 해당 항목 찾기

if (index !== -1) {
// 항목이 존재하면 수정
  let category = Category.value.find(category => category.MajorCode == clickedMainCategory.value).SubCategory
  let subCategory2 = category.find(item => item.SubCode == clickedSubCode.value.toString())
  subCategory2.SubName = languageName0.value
 
  console.log(subOriginCategory.value)
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
   
console.log(subOriginCategory.value)
   subCategory.value = subOriginCategory.value.slice(10 * (currentsubPage.value-1), 10 * (currentsubPage.value-1)+10);
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
  subOriginCategory.value = [...currSubCategory.value];
  console.log(subOriginCategory.value)
  const currlength = subOriginCategory.value.length
  if(currlength< (currentsubPage.value)*10 ) {
    calculateMaxSubCode()
    subOriginCategory.value.push({SubCode : maxSubCode.value +1 , SubName : '', new:true})
    for(var i=0 ; i< (currentsubPage.value)*10-currlength ; i++ ){
      subOriginCategory.value.push({SubCode : '' , SubName : ''})
  }
  }
  
  subCategory.value = subOriginCategory.value.slice(10 * (currentsubPage.value-1), 10 * (currentsubPage.value-1)+10);
  
}
console.log(subOriginCategory.value)
isNew.value == false;
changePopup.value = !changePopup.value
}

const showNext = () => {
currentsubPage.value ++;
const currlength = subOriginCategory.value.length;
if(currlength >= (currentsubPage.value-1)*10  ){
  calculateMaxSubCode()
  if(!subOriginCategory.value.find(item => item.new == true)) subOriginCategory.value.push({SubCode : maxSubCode.value +1 , SubName : '' , new:true})
  console.log( currentsubPage.value)
  for( var i=1 ; i <=(currentsubPage.value*10)-currlength-1 ; i++) {
  subOriginCategory.value.push({SubCode : '' , SubName : ''})
}
}
console.log(subOriginCategory.value)
subCategory.value = subOriginCategory.value.slice(10 * (currentsubPage.value-1), 10 * (currentsubPage.value-1)+10);
}
const showPrev = () => {
if (currentsubPage.value == 1){
  return ;
}
currentsubPage.value --;
subCategory.value = subOriginCategory.value.slice(10 * (currentsubPage.value-1), 10 * (currentsubPage.value-1)+10);

}
const updateMenuKey = ref(false)
let dupliitems = []
watch( updateMenuKey, (newValue)=>{

dupliitems = [...items.value]
MenuKeyList.value = MenuKeyList.value.filter(item => item.majorCode !==clickedMainCategory.value)
for(var i=0 ; i<dupliitems.length ; i++ ){
  dupliitems[i].intKeySeq = (i +1).toString() ;
  MenuKeyList.value.push(dupliitems[i]);
}
updateMenuKey.value = false
console.log(dupliitems)

})

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
const MenuKeyList = ref([])
const searchMenu = async () => {
    changeMode.value = false
    subMultiLang.value = [];
    Category.value = [] ;
    MenuKeyList.value = []
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
    MenuGroup.value = res2.data.menuGroup
    SubMenuGroup.value = res2.data.submenuGroup
    MenuKeyList.value = res2.data.menuList
   
    const res = await getCategoryInfo( groupCd.value,nowStoreCd.value,nowStoreAreaCd.value);

    Category.value = res.data.MainCategory ;
    afterSearch.value = true;
    const res1 = await getMultiLingual( groupCd.value,nowStoreCd.value,)

    getMultiLang.value = res1.data.MultiLingual ;

    confirmitem.value = [...MenuKeyList.value]
   
    MenuKeyList.value = MenuKeyList.value.map(item => {
    return {
      ...item,
      add: '추가'
    }
  })
} catch (error) {
    afterSearch.value = false;
} finally {
    
    store.state.loading = false; // 로딩 상태 종료
    (() => {
        Category.value.filter(item => { 
            item.SubCategory = item.SubCategory.filter(sub => sub.SubCode !== '')
             });
             })();
             modified.value = false ;
             afterCategory.value = false;
}


calculateMaxSubCode();
};

const setSubCd = () => {
  // SubMenuGroup.value = 
}
const showsubCategory = (value) => {
clickedMainCategory.value = value;
currSubCategory.value = Category.value.filter(item => item.MajorCode == value)[0].SubCategory
subOriginCategory.value = [...currSubCategory.value];
subCategory.value = subOriginCategory.value.slice(0,10)
const currlength = subCategory.value.length
maxSubCode.value++;

if(currlength <10){
subCategory.value.push({SubName:'' , SubCode: maxSubCode.value.toString(), new:true})
subOriginCategory.value.push({SubName:'' , SubCode:maxSubCode.value.toString(), new:true})
for(var i= 0 ; i< 9-currlength ; i++){
  subCategory.value.push({SubName:'' , SubCode: ''})
  subOriginCategory.value.push({SubName:'' , SubCode: ''})
}
}

}
const calculateMaxSubCode = () =>{
maxSubCode.value = Math.max(
   ...Category.value
.filter(item => item.SubCategory && item.SubCategory.length > 0)
.flatMap(item => item.SubCategory.map(sub => Number(sub.SubCode))));
}
const showMenuKey =(value) => {

clickedSubCategory.value = value;
console.log(MenuKeyList.value)
items.value = MenuKeyList.value.filter(item => item.majorCode == clickedMainCategory.value && item.subCode == clickedSubCategory.value)
const maxIntKeySeq = Math.max(...items.value.map(item => Number(item.intKeySeq)));

const itemslength = items.value.length;
if(itemslength < 30){
for(var i= 1 ; i<= 30-itemslength ; i++){
  items.value.push({fileName: "", intKeySeq: (maxIntKeySeq+i).toString(),lngKeyscrNo: "0000", majorCode: clickedMainCategory.value, majorName: "",
strKeyName: "",subCode: clickedSubCategory.value ,subName: ""})
}
}
deleteAllitems.value = items.value.map(item => item.intKeySeq);
console.log(deleteAllitems.value)
}

const changeSubCate =() => {
showchangingSub.value = !showchangingSub.value
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
watch(subOriginCategory , (newValue) => {
subCategory.value = subOriginCategory.value.slice(10 * (currentsubPage.value-1), 10 * (currentsubPage.value-1)+10);

})
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
updateMenuKey.value = true;
} else {
updateMenuKey.value = true
}
};

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

  if(JSON.stringify(confirmitem.value) === JSON.stringify(MenuKeyList.value)) {
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
    console.log(groupCd.value)
    console.log(nowStoreCd.value)
    console.log(nowStoreAreaCd.value)
    console.log(clickedSubCategory.value)
    console.log(deleteAllitems.value)
    console.log(dupliitems)
    const res = await deletetablePosMenuKey({
     GROUP_CD: groupCd.value,
     STORE_CD: nowStoreCd.value,
     AREA_CD : nowStoreAreaCd.value,
     SUB_CD  : clickedSubCategory.value,
     KEY_SEQ : deleteAllitems.value.join(',')
  })

  const MenuCds = dupliitems.filter(item => item.lngKeyscrNo !='0000').map(item => item.lngKeyscrNo );
  const MenuNm = dupliitems.filter(item => item.lngKeyscrNo !='0000').map(item => item.strKeyName);
  const MenuSeq = dupliitems.filter(item => item.lngKeyscrNo !='0000').map(item => item.intKeySeq);
  console.log(MenuNm)
  console.log(MenuCds)
  const res2 = await savetablePosMenuKey({
    GROUP_CD:  groupCd.value,
    STORE_CD: nowStoreCd.value,
    AREA_CD : nowStoreAreaCd.value,
    SUB_CD  : clickedSubCategory.value,
    MENU_CD : MenuCds.join(','),
    MENU_NM : MenuNm.join(',')
  })
  
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
  dataProvider.setRows(MenuKeyList.value);
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
  

  gridView.onCellEdited = function (grid, itemIndex, row, field) {
    // 데이터가 수정될 때 rows를 갱
    gridView.commit();
  
  // 이후 데이터 갱신 (필요시 rows를 업데이트)
 
  };

  gridView.onCellItemClicked = function (grid, index, clickData) {
    currentSelectedMenuCode.value = dataProvider.getRows()[clickData.itemIndex][0]
   
  return true;
}



}
const searchMenuList = () => {
  
  var filters = [
  {
    name: "custom",
    criteria: `value = '${searchWord.value}'`,
    active: true
  }
];
  var col = gridView.columnByName('메뉴코드')
  var col2 = gridView.columnByName('메뉴명')
  col.setFilters( filters );
  col2.setFilters( filters );


}
const handlePosNo = (newValue) => {
  posNo.value = newValue
  searchMenu()
}

watch(() => MenuKeyList.value, () => {
  showMenuKeys();  // MenuKeyList 값이 변경될 때마다 그리드 업데이트
});

</script>

<style scoped>

</style>
