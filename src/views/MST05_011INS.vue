<template>
      <div class="flex justify-between items-center w-full overflow-y-auto">
      <div class="flex justify-start pl-4 pt-4">
                 <div class="flex justify-start"><h1 class="font-bold text-sm md:text-2xl w-32 md:w-auto">
                  메뉴키 설정
                 </h1><div class="flex justify-end space-x-2 ml-24 md:ml-[945px]"><button @click="searchMenu" class="button search md:w-auto w-14">조회</button>
                
                  <button @click="saveMenus" class="button save text-sm  md:w-auto w-14">저장</button>
                </div></div>
                  
                 </div>

    </div>
    <br>
    <div class="flex justify-start  space-x-5 bg-gray-200 rounded-lg md:h-16 h-24 items-center"><PickStore4 @update:storeAreaCd="handleStoreAreaCd" @update:storeCd="handleStoreCd"></PickStore4> </div> 
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

    <div v-show="showchangingSub" class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50   ">
      <div class="bg-white p-6 rounded shadow-lg w-2/3 h-3/4 overflow-auto">
      <div>서브 카테고리 순서 변경</div>
      <div ref="sortableContainer" class="space-y-2">
        <div
          v-for="(item, index) in subOriginCategory"
          :key="item.SubCode"
          class="p-4 bg-gray-200 rounded-lg shadow-md cursor-move h-12 "
          v-show="item && item.SubName != ''">
          <p>{{ item.SubName }}</p>
        </div>
      </div>
      <div class="flex justify-center space-x-3">
        <button @click="changeSubCate" class="mt-4 p-2 bg-blue-500 text-white rounded">닫기</button>
      </div>
      </div>
      
    </div>
  <div class="flex w-full">
    <div class="flex absolute justify-start w-full h-1/2 left-[25%]  ">
      <div  class="grid grid-cols-1 grid-rows-5 gap-2 mt-20 w-1/6 h-1/2 justify-center items-center">
        <button v-for="item in Category" class="p-4 bg-gray-200 rounded-lg shadow-md w-full h-full" @click="showsubCategory(item.MajorCode)">{{ item.MajorName }}</button>
    </div>
    </div>
    <div class="flex flex-col justify-end mr-5">
      <div class="flex absolute left-[50%] top-[24%] w-2/5 h-56">
    <div  class="grid grid-cols-5 grid-rows-2 gap-3 mt-4 w-full h-full ">
    <div v-for="item in subCategory" class=" p-4 bg-gray-200 rounded-lg shadow-md w-full h-full flex justify-center items-center" >
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
      class="grid grid-cols-6 grid-rows-5 gap-3 mt-4 w-1/2 h-96 absolute bottom-5 right-10 pb-10 pr-10"
    >
      <div
        v-for="(item, index) in items"
        :key="item.intKeySeq"
        class="p-4 bg-gray-200 rounded-lg shadow-md w-auto h-auto"
        :data-key="item.intKeySeq"
      >
        <p>{{ item.strKeyName }}</p>
      </div>
    </VueDraggableNext>
    </div>
    </div>

</div>

  </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue';
  import Sortable from 'sortablejs';
import PickStore4 from '@/components/pickStore4.vue';
import { useStore } from 'vuex';
import { get_category_info, getCategoryInfo, getMultiLingual, tablePosMenuKey, tablePosMenuKey_v2 } from '@/api/master';
import { VueDraggableNext } from 'vue-draggable-next';

  
  // 더미 데이터
  const items = ref([
  ]);
  
  const subOriginCategory = ref([]);

  const subCategory = ref(subOriginCategory.value.slice(0,10));
  
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
  const popupData = ref([]);
  const languageName0 = ref('');
const languageName1 = ref('');
const languageName2 = ref('');
const languageName3 = ref('');
const languageName4 = ref('');
const clickedSubCode = ref()
const maxSubCode = ref();
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
 watch( items, (newValue)=>{
  console.log(newValue)
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
const mainMultiLang = ref([])
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
        subMultiLang.value = [];
        Category.value = [] ;
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
       
        const res = await getCategoryInfo( groupCd.value,nowStoreCd.value,nowStoreAreaCd.value);
    
        Category.value = res.data.MainCategory ;
        afterSearch.value = true;
        const res1 = await getMultiLingual( groupCd.value,nowStoreCd.value,)

        getMultiLang.value = res1.data.MultiLingual ;

        const res3 = await tablePosMenuKey_v2( groupCd.value,nowStoreCd.value,nowStoreAreaCd.value )
        MenuKeyList.value = res3.data.menuKeyList
    
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
      items.value.push({fileName: "", intKeySeq: (maxIntKeySeq+i).toString(),lngKeyscrNo: "", majorCode: clickedMainCategory.value, majorName: "",
    strKeyName: "",subCode: clickedSubCategory.value ,subName: ""})
    }
  }
  console.log(items.value)
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
const onEnd = (evt) => {
  // Swap을 처리할 조건
  console.log(changeMode.value)
  if (changeMode.value === false) {
    const oldIndex = evt.oldIndex;  // 드래그된 아이템의 기존 인덱스


    // oldIndex와 newIndex의 아이템을 swap (배열에서 두 아이템의 위치를 바꿔줍니다)
    const swappedItems = [...items.value];  // items를 복사

    const temp = swappedItems[oldIndex];
    swappedItems[oldIndex] = swappedItems[targetItemIndex2];
    swappedItems[targetItemIndex2] = temp;

    // 배열을 업데이트
    items.value = swappedItems;
  } else {
 
  }
};

  </script>
  
  <style scoped>
  
  </style>
  