<template>
    <div class="h-screen overflow-y-auto">
    <main class="h-screen overflow-y-auto">
    <router-view v-slot="{ Component, route }" >
        <div class="flex flex-col gap-0  w-full items-center justify-center mr-0 h-auto" v-show="isMenu">
        <div class="flex justify-end pr-10"><button class="text-3xl" @click="showMenu(false)"><font-awesome-icon icon="xmark" /></button></div>
        <div class="flex justify-start items-center pl-10 border border-gray-300 h-24 w-full" ><button class="text-2xl h-full w-full flex justify-start items-center" @click="showsubMenu(1)"><font-awesome-icon icon="chart-simple" />매출</button>
        </div>
        <div class="grid grid-rows-6 h-80 border w-full " v-if="showornotsubMenu(1)">
          <div class="h-full w-full border border-gray-200"><button class="h-full w-full">매출현황</button></div>
          <div class="h-full w-full border border-gray-200"><button class="h-full w-full">시간대별 분석</button></div>
          <div class="h-full w-full border border-gray-200"><button class="h-full w-full" @click="goRouter(3)">기간별 분석</button></div>
          <div class="h-full w-full border border-gray-200"><button class="h-full w-full">요일별 분석</button></div>
          <div class="h-full w-full border border-gray-200"><button class="h-full w-full">메뉴별 분석</button></div>
          <div class="h-full w-full border border-gray-200"><button class="h-full w-full">주제/결제유형별 분석</button></div>
        </div>
        <div class="flex justify-start items-center pl-10 border border-gray-300 h-24  w-full" ><button class="text-2xl h-full w-full flex justify-start items-center"><font-awesome-icon icon="chart-simple" />기타1</button></div>
        <div class="flex justify-start items-center pl-10 border border-gray-300 h-24  w-full" ><button class="text-2xl h-full w-full flex justify-start items-center"><font-awesome-icon icon="chart-simple" />기타2</button></div>
        <div class="flex justify-start items-center pl-10 border border-gray-300 h-24  w-full" ><button class="text-2xl h-full w-full flex justify-start items-center"><font-awesome-icon icon="chart-simple" />기타3</button></div>
        <div class="flex justify-start items-center pl-10 border border-gray-300 h-24  w-full" ><button class="text-2xl h-full w-full flex justify-start items-center"><font-awesome-icon icon="chart-simple" />기타3</button></div>
        <div class="flex justify-start items-center pl-10 border border-gray-300 h-24  w-full" ><button class="text-2xl h-full w-full flex justify-start items-center"><font-awesome-icon icon="chart-simple" />기타3</button></div>
  </div>
 
    <div v-if="personal" class="grid grid-cols-2 gap-3 h-full w-auto items-center pl-24">
    <div>
    <button class="flex font-semibold size-16 justify-end items-center text-gray-700 bg-white border rounded hover:bg-gray-200 whitespace-nowrap">즐겨찾기</button></div>
    <div>
    <button @click="logout" class="flex font-semibold size-16 justify-end items-center text-gray-700 bg-white border rounded hover:bg-gray-200 whitespace-nowrap">로그아웃</button></div> </div>
   
    <component v-show="!isMenu && !personal " :is="Component" ></component>
    </router-view>
    </main>
    <MobileMenu v-show="showMobileMenu" @showMenu="showMenu" @showpersonal="showpersonal" class="" ></MobileMenu>
    </div>
</template>

<script setup>
import BasicMenu from '@/components/BasicMenu.vue';
import MobileMenu from '@/components/MenuComponent/mobileMenu.vue';
import router from '@/router';
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

const isMenu = ref(false);
const isMenu2 = ref(false);
const personal = ref(false);
const showMobileMenu = ref(true);
const clickthismenu = ref([]);
const route = useRoute();
const showMenu = (value) => {

    isMenu.value = value ;
}
const showpersonal = (value) => {
    personal.value = value;
  
}
const goRouter = (value) => {
   router.push('/m/MISALES/SLS06_004RPT.xml');
   personal.value = false;
   isMenu.value = false;
}
const showsubMenu = (value) => {
  const index = clickthismenu.value.indexOf(value);
  if( index == -1){
    clickthismenu.value.push(value);
  } else {
    clickthismenu.value.splice(index, 1);
  }
   
};
const showornotsubMenu = (value) => {
  return clickthismenu.value.includes(value);
}
const store = useStore();
const categories = ref([]);
const selectedCategoryId = computed(() => store.state.selectedCategoryId) ;


const mainCategoryList = computed(() => store.state.mainCategory);
const subCategoryList = computed(() => store.state.subCategory);
const minorCategoryList = computed(() => store.state.minorCategory);

const hierarchicalCategories = computed(() => {
  return mainCategoryList.value.map(main => {
    const subCategories = subCategoryList.value
      .filter(sub => sub.lngCode === main.lngCode)
      .map(sub => {
        const minorCategories = minorCategoryList.value.filter(
          minor => minor.lngCode === sub.lngCode && minor.lngProgramSub == sub.lngProgramSub
        );
        return { ...sub, minorCategories };
      });

    return { ...main, subCategories };
  });
});
watch(selectedCategoryId , (newCategory) => {
  
    // cMenu= store.state.mainCategory.filter(item => item.lngCode == newCategory).map(item=> item.strTitle)[0];
     
     const subCategory = store.state.subCategory;
     const minorCategory = store.state.minorCategory;
     let category = [];  
    
     category = subCategory.filter(item => item.lngCode == newCategory);
     category.forEach(element => {
         const matchedMinorCategory = minorCategory.filter(item => item.lngProgramSub == element.lngProgramSub);
         element.subcategories = matchedMinorCategory;
     });
    
     categories.value = category ;
      console.log(hierarchicalCategories.value)
 })
 const activeCategory = ref([]);
 const activesubCategory = ref([]);

// 카테고리 보이기/숨기기 함수
const toggleCategory = (lngCode) => {
  const index = activeCategory.value.indexOf(lngCode);
  if (index === -1) {
    // 카테고리가 활성화되지 않았다면 추가
    activeCategory.value.push(lngCode);
  } else {
    // 카테고리가 이미 활성화된 상태라면 배열에서 제거
    activeCategory.value.splice(index, 1);
  }
};
const selectSubCategory = (lngProgramSub) => {
  const index = activesubCategory.value.indexOf(lngProgramSub);
  if (index === -1) {
    // 카테고리가 활성화되지 않았다면 추가
    activesubCategory.value.push(lngProgramSub);
  } else {
    // 카테고리가 이미 활성화된 상태라면 배열에서 제거
    activesubCategory.value.splice(index, 1);
  }
};

// 특정 카테고리가 활성화 상태인지 확인하는 함수
const isCategoryVisible = (lngCode) => {
  return activeCategory.value.includes(lngCode);
};
const issubCategoryVisible = (lngProgramSub) => {
  return activesubCategory.value.includes(lngProgramSub);
};
watch(() => route.path, (newPath) => {
    showMobileMenu.value = newPath !== '/'; // Update based on new route
});

const routecategory =( strUrl, strTitle,lngProgramID) => {
    router.push('/'+strUrl.split("::")[0]+'/'+strUrl.split("::")[1]);
    personal.value = false;
    isMenu.value = false;
}
const logout = () => {
  
  store.replaceState({
      userData: [], // 사용자 데이터를 저장할 상태
      selectedCategoryId : null ,
      currentTabs : [] ,
      activeTab : '',
      mainCategory : [],
      subCategory : [],
      minorCategory : [],
      storeGroup : [],
      storeType : [],
      storeCd : [],
  })
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = '/';
}
</script>

<style lang="scss" scoped>

</style>