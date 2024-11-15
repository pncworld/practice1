<template>
    <div class="h-screen overflow-y-auto">
      <Loading></Loading>
    <main class="h-screen overflow-y-auto">
    <router-view v-slot="{ Component, route }" >
        <div class="flex flex-col gap-0  w-full items-center justify-center mr-0 h-auto mt-8" v-show="isMenu">
        <div class="flex justify-end w-full mr-4"><button class="text-3xl" @click="showMenu(false)"><font-awesome-icon icon="xmark" /></button></div>
        <div class="flex justify-start items-center pl-10 border border-gray-300 h-24 w-full" ><button class="text-2xl h-full w-full flex justify-start items-center" @click="showsubMenu(1)"><font-awesome-icon icon="chart-simple" />매출</button>
        </div>
        <div class="grid grid-rows-6 h-80 border w-full " v-if="showornotsubMenu(1)">
          <div class="h-full w-full border border-gray-200"><button class="h-full w-full">매출현황</button></div>
          <div class="h-full w-full border border-gray-200"><button class="h-full w-full" @click="goRouter(2)">시간대별 분석</button></div>
          <div class="h-full w-full border border-gray-200"><button class="h-full w-full" @click="goRouter(3)">기간별 분석</button></div>
          <div class="h-full w-full border border-gray-200"><button class="h-full w-full" @click="goRouter(4)">요일별 분석</button></div>
          <div class="h-full w-full border border-gray-200"><button class="h-full w-full">메뉴별 분석</button></div>
          <div class="h-full w-full border border-gray-200"><button class="h-full w-full">주제/결제유형별 분석</button></div>
        </div>
        <div class="flex justify-start items-center pl-10 border border-gray-300 h-24  w-full" ><button class="text-2xl h-full w-full flex justify-start items-center"><font-awesome-icon icon="chart-simple" />기타1</button></div>
       
  </div>
 
    <div v-if="personal" class="grid grid-cols-2 gap-3 h-full w-auto items-center pl-24">
    <div>
    <button class="flex font-semibold size-16 justify-end items-center text-gray-700 bg-white border rounded hover:bg-gray-200 whitespace-nowrap">즐겨찾기</button></div>
    <div>
    <button @click="logout" class="flex font-semibold size-16 justify-end items-center text-gray-700 bg-white border rounded hover:bg-gray-200 whitespace-nowrap">로그아웃</button></div> </div>
   
    <component v-show="!isMenu && !personal " :is="Component" ></component>
    </router-view>
    </main>
    <MobileMenu ref="stickyElement" v-if="showMobileMenu" @showMenu="showMenu" @showpersonal="showpersonal" :class="{ hidden: !isStickyVisible }" ></MobileMenu>
    </div>
</template>

<script setup>
import BasicMenu from '@/components/BasicMenu.vue';
import Loading from '@/components/loading.vue';
import MobileMenu from '@/components/MenuComponent/mobileMenu.vue';
import router from '@/router';
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
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
     switch (value) {
      case 2:
      router.push('/m/MISALES/SLS06_003RPT.xml');
        break;
    
      case 3:
      router.push('/m/MISALES/SLS06_004RPT.xml');
        break;
        
      case 4:
      router.push('/m/MISALES/SLS06_005RPT.xml');
        break;
    
      default:
        break;
    }
   
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



watch(() => route.path, (newPath) => {
    showMobileMenu.value = newPath !== '/'; // Update based on new route
});


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

const isStickyVisible = ref(true); // 요소가 화면에 보이는지 여부
const stickyElement = ref(null);

// IntersectionObserver 콜백 함수
const handleIntersection = (entries) => {
  const entry = entries[0]; // 첫 번째 관찰 항목만 처리
  if (entry.isIntersecting) {
    isStickyVisible.value = true; // 요소가 화면에 보일 때
  } else {
    isStickyVisible.value = false; // 요소가 화면에서 벗어날 때
  }
};

// 컴포넌트가 마운트될 때 IntersectionObserver 설정
// onMounted(() => {
//   nextTick(() => {
//     if (stickyElement.value) {
//       const observer = new IntersectionObserver(handleIntersection, {
//         root: null, // 뷰포트를 기준으로 검사
//         threshold: 0, // 요소가 0%라도 보이면 callback 실행
//       });
//       console.log(stickyElement.value)
//       observer.observe(stickyElement.value);

//       // 컴포넌트가 언마운트될 때 observer 해제
//       onBeforeUnmount(() => {
//         observer.disconnect();
//       });
//     } else {
//       console.error('stickyElement is null');
//     }
//   });
// });
</script>

<style lang="scss" scoped>

</style>