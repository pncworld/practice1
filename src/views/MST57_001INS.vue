<template>
    <div class="flex justify-start pl-4 pt-4">
        <div class="flex justify-start"><h1 class="font-bold text-2xl">
            메뉴 카테고리 관리
        </h1></div>
        <div class="flex space-x-3" style="margin-left: 1050px;"><button @click="searchMenu" class="button search">조회</button><button @click="saveMenus" class="button save">저장</button></div>
    </div>
    <br>
    <div class="flex justify-start  space-x-5 bg-gray-200 rounded-lg h-16 items-center"><PickStore4 @update:storeAreaCd="handleStoreAreaCd" @update:storeCd="handleStoreCd"></PickStore4> </div> 
    <div class="flex">
    
    <div class="border border-black w-64 h-96 ml-5 mt-10 overflow-auto" >
        
        <div v-for="i in Category" :key="i.MajorCode" class="ml-5 w-auto flex justify-start items-start flex-col"><button @click="bringCategory(i.MajorCode)" class=" font-bold" style="font-size: 15px" >{{ i.MajorName}}</button>
            <div v-for="x in i.SubCategory" :key="x.SubCode" class="flex items-start w-auto ml-5" :class="{'bg-lightblue': selectedButton === x.SubCode}"><button class=" font-thin " @click="bringCategory(i.MajorCode)" style="font-size: 15px">{{ x.SubName }}</button></div>
        </div>
    </div>
   
    <div class="h-60 w-4/6 ml-5  mt-10 border-t border-b border-black">
        <div class="  text-white h-9 w-24 rounded-md flex items-center -mt-9 float-end -mr-24"><button class="button delete" style="font-size: 14px" @click="deleteMainCategory">삭제</button></div>
        <div class="grid grid-cols-[1fr_3fr] grid-rows-5 mt-0 h-full divide-x divide-y divide-gray-300">
            <div class="bg-gray-200 flex justify-start items-center pl-4">메인카테고리명(한국어)</div>
            <div class="bg-white"><input type="text" class="border border-gray-300 h-6 mt-2 w-96 flex justify-start ml-4 pl-2 " v-model="languageName0" @input="changeMajorName"></div>
            <div class="bg-gray-200 flex justify-start items-center pl-4">메인카테고리명(영어)</div>
            <div class="bg-white"><input type="text" class="border border-gray-300 h-6 mt-2 w-96 flex justify-start ml-4 pl-2"  v-model="languageName1" @input="changeMajorName1"></div>
            <div class="bg-gray-200 flex justify-start items-center pl-4">메인카테고리명(중국어)</div>
            <div class="bg-white"><input type="text" class="border border-gray-300 h-6 mt-2 w-96 flex justify-start ml-4 pl-2"  v-model="languageName2" @input="changeMajorName2"></div>
            <div class="bg-gray-200 flex justify-start items-center pl-4">메인카테고리명(일본어)</div>
            <div class="bg-white"><input type="text" class="border border-gray-300 h-6 mt-2 w-96 flex justify-start ml-4 pl-2"  v-model="languageName3" @input="changeMajorName3"></div>
            <div class="bg-gray-200 flex justify-start items-center pl-4">메인카테고리명(스페인어)</div>
            <div class="bg-white"><input type="text" class="border border-gray-300 h-6 mt-2 w-96 flex justify-start ml-4 pl-2"  v-model="languageName4" @input="changeMajorName4"></div>
        
        </div>
    </div>
    
    </div>
    <div class="flex justify-start ml-5 mt-5 space-x-2 "><button class="button primary" style="font-size: 14px" @click="addMainCategory">메인카테고리추가</button>
        <!-- <button class="button primary " style="font-size: 14px">노출순서관리</button> -->
    </div>          
    <div class="flex justify-between -mt-36 ml-3 ">
    <div class=" text-white rounded-md h-10 w-36 ml-72 flex items-center justify-center"><button class="button primary " @click="addsubCategory" style="font-size: 14px">서브카테고리 추가</button></div>
    <div class=" text-white rounded-md h-10 w-32 flex items-center justify-center mr-40" ><button class="button delete" style="font-size: 14px">전체 삭제</button></div>
</div>
  

    <div class="w-4/6  border  border-neutral-600 -z-20" style="margin-left: 296px"></div>
    <div class="h-60 w-4/6   mt-10 border-t border-b border-black" style="margin-left: 296px" v-for="i in subMultiLang">
        <div class="-mt-10" style="margin-left:1070px;"><button class="button delete" @click="deleteSubCategory(i[0].categoryCode)">삭제</button></div>
        <div class="grid grid-cols-[1fr_3fr] grid-rows-5 mt-0 h-full divide-x divide-y divide-gray-300" >
            <div class="bg-gray-200 flex justify-start items-center pl-4">서브카테고리명(한국어)</div>
            <div class="bg-white"><input type="text" class="border border-gray-300 h-6 mt-2 w-96 flex justify-start ml-4 pl-2 " :value="i[0] ? i[0].LanguageName : ''" @input="event => changeSubName(i[0].categoryCode, event)"></div>
            <div class="bg-gray-200 flex justify-start items-center pl-4">서브카테고리명(영어)</div>
            <div class="bg-white"><input type="text" class="border  border-gray-300 h-6 mt-2 w-96 flex justify-start ml-4 pl-2 " :value="i[1] ? i[1].LanguageName : ''" @input="event => changeSubName1(i[0].categoryCode, event)"></div>
            <div class="bg-gray-200 flex justify-start items-center pl-4">서브카테고리명(중국어)</div>
            <div class="bg-white"><input type="text" class="border border-gray-300 h-6 mt-2 w-96 flex justify-start ml-4 pl-2 " :value="i[2] ? i[2].LanguageName : ''" @input="event => changeSubName2(i[0].categoryCode, event)"></div>
            <div class="bg-gray-200 flex justify-start items-center pl-4">서브카테고리명(일본어)</div>
            <div class="bg-white"><input type="text" class="border border-gray-300 h-6 mt-2 w-96 flex justify-start ml-4 pl-2 " :value="i[3] ? i[3].LanguageName : ''" @input="event => changeSubName3(i[0].categoryCode, event)"></div>
            <div class="bg-gray-200 flex justify-start items-center pl-4">서브카테고리명(스페인어)</div>
            <div class="bg-white"><input type="text" class="border border-gray-300 h-6 mt-2 w-96 flex justify-start ml-4 pl-2 " :value="i[4] ? i[4].LanguageName : ''" @input="event => changeSubName4(i[0].categoryCode, event)"></div>
         
        </div>
        <div class="float-right -mr-32 space-y-5">   

    </div>
    </div>
    <div class="flex justify-end mr-40 mt-10">
        <div class="flex flex-col items-end">
    <div class=" text-white rounded-md h-8 w-44 flex items-center justify-center "><button class="button primary">서브카테고리 추가</button></div>
    <div class=" text-white rounded-md h-8 w-28 flex items-center justify-center mt-5 "><button class="button primary">전체 저장</button></div>
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
const mainCategoryInsert = ref(false)
const store = useStore();
const nowStoreCd = ref();
const currentMajorCode = ref();
const newMainCategoryCode = ref([]);
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

const addMainCategory = () => {
        mainCategoryInsert.value = true ; 
        const newMajorCode = Category.value.map( item => {
            return Number(item.MajorCode);
        })
       
        const newmajorcode = (newMajorCode[newMajorCode.length -1]+1).toString();
        newMainCategoryCode.value.push(newmajorcode);
        const newMainCategory = {MajorCode: newmajorcode, MajorName: '새 카테고리', SubCategory: [], mainMultilang: [], subMultilang: []};
        const languagename0 = {TypeCode: '4', categoryCode: newmajorcode , LanguageID: '0', LanguageName: '새 카테고리'}
        const languagename1 = {TypeCode: '4', categoryCode: newmajorcode , LanguageID: '1', LanguageName: ''}
        const languagename2 = {TypeCode: '4', categoryCode: newmajorcode , LanguageID: '2', LanguageName: ''}
        const languagename3 = {TypeCode: '4', categoryCode: newmajorcode , LanguageID: '3', LanguageName: ''}
        const languagename4 = {TypeCode: '4', categoryCode: newmajorcode , LanguageID: '4', LanguageName: ''}
        getMultiLang.value.push(languagename0)
        getMultiLang.value.push(languagename1)
        getMultiLang.value.push(languagename2)
        getMultiLang.value.push(languagename3)
        getMultiLang.value.push(languagename4)
        Category.value.push(newMainCategory)
        languageName0.value = '새 카테고리';
        languageName1.value = '';
        languageName2.value = '';
        languageName3.value = '';
        languageName4.value = '';
        currentMajorCode.value = newmajorcode;
        bringCategory(newmajorcode);
        addsubCategory();
}
const changeMajorName = (event) => {
    let inputdata = event.target.value;
    const changegetMulilang = () => {
         getMultiLang.value.map( item => {
            if (item.categoryCode == currentMajorCode.value && item.TypeCode =='4' && item.LanguageID == '0'){
                item.LanguageName = inputdata;
            }
        })
    }
    changegetMulilang();
    const changingcategoryname = ()=> {Category.value.filter(item => {
        if(item.MajorCode == currentMajorCode.value){
            item.MajorName=inputdata
        }
    })};
    changingcategoryname();
}
const changeMajorName1 = (event) => {
    let inputdata = event.target.value;
    const changegetMulilang = () => {
         getMultiLang.value.map( item => {
            if (item.categoryCode == currentMajorCode.value && item.TypeCode =='4' && item.LanguageID == '1'){
                item.LanguageName = inputdata;
            }
        })
    }
    changegetMulilang();
    
}
const changeMajorName2 = (event) => {
    let inputdata = event.target.value;
    const changegetMulilang = () => {
         getMultiLang.value.map( item => {
            if (item.categoryCode == currentMajorCode.value && item.TypeCode =='4' && item.LanguageID == '2'){
                item.LanguageName = inputdata;
            }
        })
    }
    changegetMulilang();
    
}
const changeMajorName3 = (event) => {
    let inputdata = event.target.value;
    const changegetMulilang = () => {
         getMultiLang.value.map( item => {
            if (item.categoryCode == currentMajorCode.value && item.TypeCode =='4' && item.LanguageID == '3'){
                item.LanguageName = inputdata;
            }
        })
    }
    changegetMulilang();
    
}
const changeMajorName4 = (event) => {
    let inputdata = event.target.value;
    const changegetMulilang = () => {
         getMultiLang.value.map( item => {
            if (item.categoryCode == currentMajorCode.value && item.TypeCode =='4' && item.LanguageID == '4'){
                item.LanguageName = inputdata;
            }
        })
    }
    changegetMulilang();
    
}
const deleteSubCategory = (categoryCode) => {
    console.log(categoryCode)
    searchMenu();
    bringCategory(categoryCode);
}
const deleteMainCategory = () => {
    Swal.fire({
        title: '경고',
        text: '메인 카테고리를 정말 삭제하시겠습니까?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '삭제',
        cancelButtonText: '취소'
    })
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
    
        Category.value = res.data.MainCategory ;
        
        const res1 = await axios.post('/api/MIMASTER/MST57_001INS.asmx/getMultiLingual' ,{
            GROUP_CD : groupCd.value,
            STORE_CD : nowStoreCd.value,
        })

        getMultiLang.value = res1.data.MultiLingual ;
    } catch (error) {
      
    } finally {
        
        store.state.loading = false; // 로딩 상태 종료
    }
    console.log(Category.value);
};
const saveMenus = async() => {
    
    let res ; 
    if (mainCategoryInsert.value == false ){
        res = await axios.post('/api/MIMASTER/MST57_001INS.asmx/setMainCategoryUpdate', {
            GROUP_CD : groupCd.value,
            STORE_CD : nowStoreCd.value,
            AREA_CD  : nowStoreAreaCd.value,
            MAJOR_CD  : currentMajorCode.value,
            MAJOR_NM  : [languageName0.value,languageName1.value,languageName2.value,languageName3.value,languageName4.value].join(","),
            LANGUAGE_ID : ['0','1','2','3','4'].join(",")
        });
    } else if (mainCategoryInsert.value == true){
      
        res = await axios.post('/api/MIMASTER/MST57_001INS.asmx/setMainCategoryINSERT', {
            GROUP_CD : groupCd.value,
            STORE_CD : nowStoreCd.value,
            AREA_CD  : nowStoreAreaCd.value,
            MAJOR_CD  : currentMajorCode.value,
            MAJOR_NM  : [languageName0.value,languageName1.value,languageName2.value,languageName3.value,languageName4.value].join(","),
            LANGUAGE_ID : ['0','1','2','3','4'].join(",")
        }
    )
    }
 
    const subMultis = subMultiLang.value
    .flatMap(innerArray => innerArray) // 이중 배열을 평평하게 만듭니다.
    .filter(item => item.Insert === true); // Insert 속성이 true인 요소만 필터링합니다.

    const subCd = subMultis.map(item => item.categoryCode)
    const subNm = subMultis.map(item => item.LanguageName)
    const languageNm = subMultis.map(item => item.LanguageID)

    const subMultis2 = subMultiLang.value
    .flatMap(innerArray => innerArray) // 이중 배열을 평평하게 만듭니다.
    .filter(item => item.Insert != true); // Insert 속성이 true인 요소만 필터링합니다.

    const subCd2 = subMultis2.map(item => item.categoryCode)
    const subNm2 = subMultis2.map(item => item.LanguageName)
    const languageNm2 = subMultis2.map(item => item.LanguageID)
    
    try {
    const res2 = await axios.post('/api/MIMASTER/MST57_001INS.asmx/setSubCategoryINSERT', {
        GROUP_CD: groupCd.value,
        STORE_CD: nowStoreCd.value,
        AREA_CD: nowStoreAreaCd.value,
        MAJOR_CD: currentMajorCode.value,
        SUB_CD: subCd.join(","),
        SUB_NM: subNm.join(","),
        LANGUAGE_ID: languageNm.join(",")
    });

    const res3 = await axios.post('/api/MIMASTER/MST57_001INS.asmx/setSubCategoryUPDATE', {
        GROUP_CD: groupCd.value,
        STORE_CD: nowStoreCd.value,
        AREA_CD: nowStoreAreaCd.value,
        MAJOR_CD: currentMajorCode.value,
        SUB_CD: subCd2.join(","),
        SUB_NM: subNm2.join(","),
        LANGUAGE_ID: languageNm2.join(",")
    });

    // 이제 res2를 사용하여 상태 확인 가능
    if (res2.status === 200 && res3.status === 200) {
        await searchMenu(); // searchMenu()도 await
        bringCategory(currentMajorCode.value);

        Swal.fire({
            title: '저장 성공',
            text: '저장되었습니다.',
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
        });
    }
} catch (error) {
    // 오류 처리
    console.error('Error occurred:', error);
    Swal.fire({
        title: '저장 실패',
        text: '오류가 발생했습니다.',
        icon: 'error',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
    });
}
}

const convertedsubMultiLang = ref([])
const subCode3 = ref();
const userInputData = ref([])
const bringCategory = (value) => {
    if(newMainCategoryCode.value.includes(value)){
        mainCategoryInsert.value = true ; 
    } else {
        mainCategoryInsert.value = false ; 
    }
    
    currentMajorCode.value = value;
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

    selectedButton.value = value;
  
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
    console.log(subCodes);
    subMultiLang.value = subCodes.map(code => {
    // 각 code에 대해 필터링하여 해당 categoryCode와 일치하는 subMultilang 항목을 모음
    return Category.value.map(item => {
        return item.subMultilang.filter(item2 => item2.categoryCode === code);
    }).flat(); // 각 배열을 평탄화하여 단일 배열로 만듭니다.
   
});
    // if( subMultiLang.value[0].length ==0){
    //         subMultiLang.value = ''
    // }
     console.log(subMultiLang.value)

}


const addsubCategory = () => {
    console.log(Category.value)
    let maxSubCode = Math.max(
       ...Category.value
    .filter(item => item.SubCategory && item.SubCategory.length > 0)
    .flatMap(item => item.SubCategory.map(sub => Number(sub.SubCode))));

    maxSubCode =(Number(maxSubCode)+1).toString();

     (() => {
    Category.value.filter(item => { 
    if (item.MajorCode === currentMajorCode.value) {
       item.SubCategory.push({ SubCode: maxSubCode, SubName: '' });
    }
    });
     })();
    //console.log()
  
    const sumarray = [];
  
    const newsubCategory0 = {TypeCode: '3', categoryCode: maxSubCode, LanguageID: '0', LanguageName: '' , Insert : true};
    const newsubCategory1 = {TypeCode: '3', categoryCode: maxSubCode, LanguageID: '1', LanguageName: '' , Insert : true};
    const newsubCategory2 = {TypeCode: '3', categoryCode: maxSubCode, LanguageID: '2', LanguageName: '' , Insert : true};
    const newsubCategory3 = {TypeCode: '3', categoryCode: maxSubCode, LanguageID: '3', LanguageName: '' , Insert : true};
    const newsubCategory4 = {TypeCode: '3', categoryCode: maxSubCode, LanguageID: '4', LanguageName: '' , Insert : true};

    sumarray.push(newsubCategory0);
    sumarray.push(newsubCategory1);
    sumarray.push(newsubCategory2);
    sumarray.push(newsubCategory3);
    sumarray.push(newsubCategory4);
    getMultiLang.value.push(newsubCategory0);
    getMultiLang.value.push(newsubCategory1);
    getMultiLang.value.push(newsubCategory2);
    getMultiLang.value.push(newsubCategory3);
    getMultiLang.value.push(newsubCategory4);
    //  if(subMultiLang.value ==''){
    //     subMultiLang.value = []
    //  }
    subMultiLang.value.push(sumarray);
    console.log(subMultiLang.value)
    console.log(getMultiLang.value)
    //bringCategory(currentMajorCode.value);
}
const changeSubName = (categorycode , event) => {
    let inputdata = event.target.value;
    const changegetMulilang = () => {
         getMultiLang.value.map( item => {
            if (item.categoryCode == categorycode && item.TypeCode =='3' && item.LanguageID == '0'){
                item.LanguageName = inputdata;
            }
        })
    }
    changegetMulilang();
}
const changeSubName1 = (categorycode , event) => {
    let inputdata = event.target.value;
    const changegetMulilang = () => {
         getMultiLang.value.map( item => {
            if (item.categoryCode == categorycode && item.TypeCode =='3' && item.LanguageID == '1'){
                item.LanguageName = inputdata;
            }
        })
    }
    changegetMulilang();
}
const changeSubName2 = (categorycode , event) => {
    let inputdata = event.target.value;
    const changegetMulilang = () => {
         getMultiLang.value.map( item => {
            if (item.categoryCode == categorycode && item.TypeCode =='3' && item.LanguageID == '2'){
                item.LanguageName = inputdata;
            }
        })
    }
    changegetMulilang();
}
const changeSubName3 = (categorycode , event) => {
    let inputdata = event.target.value;
    const changegetMulilang = () => {
         getMultiLang.value.map( item => {
            if (item.categoryCode == categorycode && item.TypeCode =='3' && item.LanguageID == '3'){
                item.LanguageName = inputdata;
            }
        })
    }
    changegetMulilang();
}
const changeSubName4 = (categorycode , event) => {
    let inputdata = event.target.value;
    const changegetMulilang = () => {
         getMultiLang.value.map( item => {
            if (item.categoryCode == categorycode && item.TypeCode =='3' && item.LanguageID == '4'){
                item.LanguageName = inputdata;
            }
        })
    }
    changegetMulilang();
}
</script>

