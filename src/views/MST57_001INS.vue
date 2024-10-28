<template>
    <div class="flex justify-start pl-4 pt-4">
        <div class="flex justify-start"><h1 class="font-bold text-2xl">
            카테고리 관리
        </h1></div>
        <div class="flex space-x-3" style="margin-left: 1100px;"><button @click="searchMenu" class="button search">조회</button><button @click="searchMenu" class="button save">저장</button></div>
    </div>
    <br>
    <div class="flex justify-start  space-x-5 bg-gray-200 rounded-lg h-16 items-center"><PickStore4 @update:storeAreaCd="handleStoreAreaCd" @update:storeCd="handleStoreCd"></PickStore4> </div> 
    <div class="flex">
    
    <div class="border border-black w-64 h-96 ml-5 mt-10 overflow-auto" >
        
        <div v-for="i in Category" :key="i.MajorCode" class=" mr-40"><button @click="bringCategory(i.MajorCode)" class=" font-bold" style="font-size: 15px" >{{ i.MajorName}}</button>
            <div v-for="x in i.SubCategory" :key="x.SubCode" class="flex justify-start w-32 ml-10" :class="{'bg-lightblue': selectedButton === x.SubCode}"><button class=" font-thin " @click="bringCategory(i.MajorCode)" style="font-size: 15px">{{ x.SubName }}</button></div>
        </div>
    </div>
   
    <div class="h-60 w-4/7 ml-5  mt-10 border-t border-b border-black">
        <div class="  text-white h-9 w-16 rounded-md flex items-center -mt-9 float-end mr-4"><button class="button delete" style="font-size: 14px">삭제</button></div>
        <div class="grid grid-cols-[1fr_3fr] grid-rows-5 mt-0 h-full divide-x divide-y divide-gray-300">
            <div class="bg-gray-200 flex justify-start items-center pl-4">메인카테고리명(한국어)</div>
            <div class="bg-white"><input type="text" class="border border-gray-300 h-6 mt-2 w-96 flex justify-start ml-4 pl-2 "  v-model="languageName0"></div>
            <div class="bg-gray-200 flex justify-start items-center pl-4">메인카테고리명(영어)</div>
            <div class="bg-white"><input type="text" class="border border-gray-300 h-6 mt-2 w-96 flex justify-start ml-4 pl-2" v-model="languageName1"></div>
            <div class="bg-gray-200 flex justify-start items-center pl-4">메인카테고리명(일본어)</div>
            <div class="bg-white"><input type="text" class="border border-gray-300 h-6 mt-2 w-96 flex justify-start ml-4 pl-2" v-model="languageName2"></div>
            <div class="bg-gray-200 flex justify-start items-center pl-4">메인카테고리명(중국어)</div>
            <div class="bg-white"><input type="text" class="border border-gray-300 h-6 mt-2 w-96 flex justify-start ml-4 pl-2" v-model="languageName3"></div>
            <div class="bg-gray-200 flex justify-start items-center pl-4">메인카테고리명(스페인어)</div>
            <div class="bg-white"><input type="text" class="border border-gray-300 h-6 mt-2 w-96 flex justify-start ml-4 pl-2" v-model="languageName4"></div>
        
        </div>
    </div>
    
    </div>
    <div class="flex justify-start ml-5 mt-5 space-x-2 "><button class="button primary" style="font-size: 14px" @click="addMainCategory">메인카테고리추가</button><button class="button primary " style="font-size: 14px">노출순서관리</button></div>          
    <div class="flex justify-between -mt-36 ml-3 ">
    <div class=" text-white rounded-md h-10 w-36 ml-72 flex items-center justify-center"><button class="button primary " @click="addsubCategory" style="font-size: 14px">서브카테고리 추가</button></div>
    <div class=" text-white rounded-md h-10 w-32 flex items-center justify-center mr-60" ><button class="button delete" style="font-size: 14px">전체 삭제</button></div>
</div>
  

    <div class="w-4/6  border  border-neutral-600 -z-20" style="margin-left: 296px"></div>
    <div class="h-60 w-4/6   mt-10 border-t border-b border-black" style="margin-left: 296px" v-for="i in subMultiLang">
        <div class="-mt-10" style="margin-left:960px;"><button class="button delete">삭제</button></div>
        <div class="grid grid-cols-[1fr_3fr] grid-rows-5 mt-0 h-full divide-x divide-y divide-gray-300" >
            <div class="bg-gray-200 flex justify-start items-center pl-4">서브카테고리명(한)</div>
            <div class="bg-white"><input type="text" class="border border-gray-300 h-6 mt-2 w-96 flex justify-start ml-4 pl-2 " :value="i[0] ? i[0].LanguageName : ''" ></div>
            <div class="bg-gray-200 flex justify-start items-center pl-4">서브카테고리명(영)</div>
            <div class="bg-white"><input type="text" class="border  border-gray-300 h-6 mt-2 w-96 flex justify-start ml-4 pl-2 " :value="i[1] ? i[1].LanguageName : ''"></div>
            <div class="bg-gray-200 flex justify-start items-center pl-4">서브카테고리명(일)</div>
            <div class="bg-white"><input type="text" class="border border-gray-300 h-6 mt-2 w-96 flex justify-start ml-4 pl-2 " :value="i[2] ? i[2].LanguageName : ''"></div>
            <div class="bg-gray-200 flex justify-start items-center pl-4">서브카테고리명(중)</div>
            <div class="bg-white"><input type="text" class="border border-gray-300 h-6 mt-2 w-96 flex justify-start ml-4 pl-2 " :value="i[3] ? i[3].LanguageName : ''"></div>
            <div class="bg-gray-200 flex justify-start items-center pl-4">서브카테고리명(스)</div>
            <div class="bg-white"><input type="text" class="border border-gray-300 h-6 mt-2 w-96 flex justify-start ml-4 pl-2 " :value="i[4] ? i[4].LanguageName : ''"></div>
         
        </div>
        <div class="float-right -mr-32 space-y-5">   

    </div>
    </div>
    <div class="flex justify-end mr-20 mt-10">
        <div class="flex flex-col">
    <div class=" text-white rounded-md h-8 w-44 flex items-center justify-center"><button class="button primary">서브카테고리 추가</button></div>
    <div class=" text-white rounded-md h-8 w-28 flex items-center justify-center mt-5"><button class="button primary">전체 저장</button></div>
    </div>
    </div>
    <br>
    <br>
    <br>
</template>

<script setup>

import Loading from '@/components/loading.vue';
import PickStore4 from '@/components/pickStore4.vue';
import axios from 'axios';
import Swal from 'sweetalert2';
import { ref, watch } from 'vue';
import { useStore } from 'vuex';
const searchStoreName = ref();
const selectedButton = ref();
const Category = ref([]);
const getMultiLang = ref([])
const mainMultiLang = ref([])
const subMultiLang = ref([])
const store = useStore();
const nowStoreCd = ref();
const  handleStoreCd = (newValue) => {
    nowStoreCd.value = newValue ;
}
watch(nowStoreCd , (newvalue, oldvalue) => {
    if(newvalue != oldvalue) {
        getMultiLang.value = [];
        mainMultiLang.value = [];
        subMultiLang.value = [];
        Category.value = [] ;
        languageName0.value = '';
        languageName1.value = '';
        languageName2.value = '';
        languageName3.value = '';
        languageName4.value = '';
        convertedsubMultiLang.value = [];
    }
})
const nowStoreAreaCd = ref();
const  handleStoreAreaCd = (newValue) => {
  
    nowStoreAreaCd.value = newValue ;
}
const languageName0 = ref('');
const languageName1 = ref('');
const languageName2 = ref('');
const languageName3 = ref('');
const languageName4 = ref('');
const userData = store.state.userData; 
const groupCd = ref(userData.lngStoreGroup);
const addMainCategory = async() => {
        const maxCategoryCode = Category.value.reduce( (max, item) => {
            return item.MajorCode > max.MajorCode ? item.MajorCode : max.MajorCode ; 
        })
       
        Category.value.push({MajorCode: maxCategoryCode+1 , MajorName : '' , SubCategory : []
        })
        languageName0.value = '';
        languageName1.value = '';
        languageName2.value = '';
        languageName3.value = '';
        languageName4.value = '';
        convertedsubMultiLang.value = [];
}
const searchMenu = async () => {
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
        })
        return;
    }
    store.state.loading = true;
    try {
       
        const res = await axios.post('/api/MIMASTER/MST57_001INS.asmx/getCategoryInfo', {
           
             GROUP_CD : groupCd.value,
             STORE_CD : nowStoreCd.value,
             AREA_CD  : nowStoreAreaCd.value
        });
        console.log(res.data)
        Category.value = res.data.MainCategory ;
        
        const res1 = await axios.post('/api/MIMASTER/MST57_002INS.asmx/getMultiLingual' ,{
            GROUP_CD : groupCd.value,
            STORE_CD : nowStoreCd.value,
        })

        getMultiLang.value = res1.data.MultiLingual ;
    } catch (error) {
      
    } finally {
        
        store.state.loading = false; // 로딩 상태 종료
    }
};
const convertedsubMultiLang = ref([])
const subCode3 = ref();
const userInputData = ref([])
const bringCategory = (value) => {
  
    Category.value = Category.value.map(categoryItem => {
  // getMultiLang에서 MajorCode와 일치하는 항목을 찾아 mainMultilang으로 설정
    categoryItem.mainMultilang = getMultiLang.value.filter(item => 
    item.TypeCode === '4' && item.categoryCode === categoryItem.MajorCode
  );
  categoryItem.subMultilang = getMultiLang.value.filter(item => {
  const matchedSubCategory = categoryItem.SubCategory.find(sub => sub.SubCode === item.categoryCode);
  return item.TypeCode === '3' && matchedSubCategory;
});

  return categoryItem;
});
console.log(Category.value)
    selectedButton.value = value;
    // mainMultiLang.value = getMultiLang.value.filter( item => item.TypeCode =='4' && item.categoryCode ==value) ;
    // //구조 좀 다르게 짜야할듯

    // const subCode = ref([]);
    // subCode.value = Category.value.filter( item => item.MajorCode == value)[0].SubCategory ;
    // const subCode2 = ref([]);
    // for (let i = 0; i < subCode.value.length; i++) {
    //     subCode2.value.push(subCode.value[i].SubCode);
    // }
    // subCode3.value = subCode2.value;
   
    languageName0.value = Category.value.map(item => {
     const result = item.mainMultilang.find(item2 => item2.LanguageID === '0' && item2.categoryCode === value);
     return result ? result.LanguageName : '';
     }).filter(name => name !== ''); // 빈 값 제거

     languageName1.value = Category.value.map(item => {
     const result = item.mainMultilang.find(item2 => item2.LanguageID === '1' && item2.categoryCode === value);
     return result ? result.LanguageName : '';
     }).filter(name => name !== ''); // 빈 값 제거
   
     languageName2.value = Category.value.map(item => {
     const result = item.mainMultilang.find(item2 => item2.LanguageID === '2' && item2.categoryCode === value);
     return result ? result.LanguageName : '';
     }).filter(name => name !== '');
   
     languageName3.value = Category.value.map(item => {
     const result = item.mainMultilang.find(item2 => item2.LanguageID === '3' && item2.categoryCode === value);
     return result ? result.LanguageName : '';
     }).filter(name => name !== '');
   
     languageName4.value = Category.value.map(item => {
     const result = item.mainMultilang.find(item2 => item2.LanguageID === '4' && item2.categoryCode === value);
     return result ? result.LanguageName : '';
     }).filter(name => name !== '');
   
    const subCodes = Category.value.filter(item2 => item2.MajorCode == value).flatMap(item2 => item2.SubCategory.map(item3 => item3.SubCode));
    subMultiLang.value = subCodes.map(code => {
    // 각 code에 대해 필터링하여 해당 categoryCode와 일치하는 subMultilang 항목을 모음
    return Category.value.map(item => {
        return item.subMultilang.filter(item2 => item2.categoryCode === code);
    }).flat(); // 각 배열을 평탄화하여 단일 배열로 만듭니다.
});
   

    
}
const addsubCategory = () => {

    const lastcategoryCode =  convertedsubMultiLang.value[convertedsubMultiLang.value.length-1][0].categoryCode;
   
    convertedsubMultiLang.value.push([
    {TypeCode: '3', categoryCode: lastcategoryCode, LanguageID: '0', LanguageName: ''},
    {TypeCode: '3', categoryCode: lastcategoryCode, LanguageID: '1', LanguageName: ''},
    {TypeCode: '3', categoryCode: lastcategoryCode, LanguageID: '2', LanguageName: ''},
    {TypeCode: '3', categoryCode: lastcategoryCode, LanguageID: '3', LanguageName: ''},
    {TypeCode: '3', categoryCode: lastcategoryCode, LanguageID: '4', LanguageName: ''}])
}
</script>

