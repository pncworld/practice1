<template>
  <div class="flex flex-col h-screen overflow-hidden bg-gray-100">
    <Loading style="z-index: 100;"></Loading>

    <header v-if="showMenu" class="bg-gray-100 border rounded-3xl text-gray-600 p-2 w-full h-10 md:h-14 box-content">
  <!-- 상단 영역 -->
  <div class="flex items-center justify-between bg-gray-100 p-4 rounded-lg fixed top-0 h-12 w-full -mt-3 pb-0">
    <!-- 로고 영역 -->
    <div class="flex-shrink-0 items-center mt-8 hidden md:block">
      <img :src="strLogoUrl" alt="Logo" class="w-24 sm:w-36 md:w-48 lg:w-52 sm:h-8 md:h-12 lg:h-16 rounded-lg">
    </div>
    
    <div class="flex justify-start mx-auto pb-1 scrollbar-hide max-w-[1300px] w-full"> <!-- 부모 div -->
  <div class="flex overflow-x-auto space-x-2 md:space-x-1 w-full mt-4 md:mt-2 md:ml-5"> <!-- 내부 div -->
    <button
      v-for="(item, i) in mainCategoryList"
      :key="i"
      @click="selectCategory(item.lngCode)"
      class="px-3 py-2 text-sm sm:text-sm md:text-xs lg:text-sm font-semibold text-gray-700 bg-white border rounded hover:bg-gray-200 whitespace-nowrap"
    >
      {{ item.strTitle }}
    </button>
    <button class="flex md:hidden w-5 md:w-7 px-3 py-2 text-sm sm:text-sm md:text-xs lg:text-sm font-semibold text-gray-700 bg-white border rounded hover:bg-gray-200 whitespace-nowrap"><img src="../../assets/table_star.svg" alt="Star" ></button>
    <button @click="deleteAllTabs" class="block md:hidden"><img src="../../assets/ic_delete.svg" alt="Delete" class="w-1 sm:w-6 md:w-7 "></button>
    <button @click="reLoad" class="block md:hidden"><img src="../../assets/ic_refresh.svg" alt="Refresh" class="w-1 sm:w-6 md:w-7 "></button>
    <button @click="showMenus" class="block md:hidden"><img src="../../assets/ic_menu.svg" alt="Menu" class="w-1 sm:w-6 md:w-7 "></button>
    <button @click="hideMenu" class="block md:hidden"><img src="../../assets/ic_extent.svg" alt="Extend" class="w-5 sm:w-6 md:w-7 "></button>
    <button @click="logout" class="block md:hidden"><img src="../../assets/logout_icon.svg" alt="Logout" class="w-3 sm:w-4 md:w-5 "></button> </div>
</div>


    
    <!-- 우측 버튼 영역 -->
    <div class="items-center space-x-4 hidden sm:flex">
      <button><img src="../../assets/table_star.svg" alt="Star" class="w-5 sm:w-6 md:w-7"></button>
      <button @click="deleteAllTabs"><img src="../../assets/ic_delete.svg" alt="Delete" class="w-5 sm:w-6 md:w-7"></button>
      <button @click="reLoad"><img src="../../assets/ic_refresh.svg" alt="Refresh" class="w-5 sm:w-6 md:w-7"></button>
      <button @click="showMenus"><img src="../../assets/ic_menu.svg" alt="Menu" class="w-5 sm:w-6 md:w-7"></button>
      <button @click="hideMenu"><img src="../../assets/ic_extent.svg" alt="Extend" class="w-5 sm:w-6 md:w-7"></button>
      <button @click="logout"><img src="../../assets/logout_icon.svg" alt="Logout" class="w-3 sm:w-4 md:w-5 "></button>
    </div>
  </div>

  <!-- 탭 영역 -->
  <div class="overflow-x-auto space-x-2 mt-8 ml-60 hidden md:flex">
    <div
      v-for="tab in tabs"
      :key="tab.lngProgramID"
      @click="setActiveTab(tab)"
      class="flex items-center space-x-2 px-4 py-2 border bg-white text-xs rounded-md cursor-pointer font-bold hover:bg-blue-50 transition whitespace-nowrap"
      :class="{ 'text-blue-400': isActive(tab) }"
    >
      <span>{{ tab.strTitle }}</span>
      <button @click.stop="removeTab(tab)">
        <img src="../../assets/deleteIcon.png" alt="Delete" class="w-3 h-3 text-blue-300">
      </button>
    </div>
  </div>
</header>

<!-- <header v-if="showMenu" class="bg-white border rounded-3xl text-gray-600 p-4 w-full h-20">
      <div class="text-sm font-bold flex space-x-5 -ml-72 justify-center -mt-2">
        <span><img :src="strLogoUrl" alt="" class="w-52 absolute left-5 -top-0 "></span>
        <span class="absolute space-x-5" style="left: 270px;">
        <button class="" v-for="(item , i) in mainCategoryList" :key="i" value="" id="{{ item.lngCode }}" @click="selectCategory(item.lngCode)" >{{ item.strTitle }}</button></span>
        <div class="absolute right-10 space-x-4 mt-3 text-black font-bold ">
        <button><img src="../../assets/table_star.svg" alt="" class="size-7"></button>
        <button @click="deleteAllTabs"><img src="../../assets/ic_delete.svg" alt="" class="size-7"></button>
        <button  @click="reLoad"><img src="../../assets/ic_refresh.svg" alt="" class="size-7"></button>
        <button @click="showMenus"><img src="../../assets/ic_menu.svg" alt="" class="size-7"></button>
        <button  @click="hideMenu"><img src="../../assets/ic_extent.svg" alt="" class="size-7"></button>
        <button  @click="logout" ><img src="../../assets/logout_icon.svg" alt="" class="size-5 -mt-6 ml-2"></button> 
        </div>
        
      </div>
      <div class="flex space-x-2 absolute left-72 mt-8">
        <div v-if="showMenu" v-for="tab in tabs" :key="tab.lngProgramID" @click="setActiveTab(tab)" class="w-auto h-7 bg-slate-100 text-xs rounded-md px-4 py-2 cursor-pointer font-bold hover:bg-blue-50 transition" :class="{'text-blue-400' : isActive(tab)}">
          {{tab.strTitle}}<button @click.stop="removeTab(tab)"><span class="text-blue-300 "><img src="../../assets/deleteIcon.png" alt="" class="size-3"></span></button>  </div>
        </div>
      
    </header> -->
    <div class="flex flex-1 overflow-hidden ">
      <!-- Sidebar -->
      <aside v-show="isMenu&&showMenu" class=" bg-white text-gray-600 p-0 m-0 border-gray-200  border  justify-center items-center hidden md:flex w-full md:w-[14%]" >
        <BasicMenu v-if="showMenu" class="w-full h-full  border hidden md:block" />
      </aside>
      
      <!-- Main Content -->
      <main class="w-full h-full bg-white p-1 overflow-y-scroll overflow-x-hidden">
      <router-view  v-slot="{ Component, route }">
      <keep-alive>
        <component :is="Component" :key="`${route.path}-${componentKey}`" />
      </keep-alive>
      </router-view>


      
      </main>     
    </div>
  </div>
</template>
  
<script setup>
import BasicMenu from '@/components/BasicMenu.vue';
import DailySales from '@/components/DailySales.vue';
import Loading from '@/components/loading.vue';
import MobileMenu from '@/components/MenuComponent/mobileMenu.vue';
import router from '@/router';
import Swal from 'sweetalert2';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import {  useStore } from 'vuex';


// 화면 크기 감지 및 업데이트


const route = useRoute();
const store = useStore() ;
const userData = computed(() => store.state.userData)
const strLogoUrl = computed(() => userData.value.strLogoUrl)
const mobileShowMenu = ref(false);
const showMenu = ref(route.path != '/'); // Initialize based on current route
const componentKey = ref(null);
// Watch for route changes

watch(() => route.path, (newPath) => {
  showMenu.value = newPath != '/'; // Update based on new route
 
});
store.dispatch('convertLoading',false);
const deleteAllTabs = () => {
  Swal.fire({
      title: '확인',
      text: '열린화면을 모두 닫으시겠습니까?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '확인',
      cancelButtonText: '취소',
    }).then((result) => {
      if(result.isConfirmed){
        store.dispatch('closeAllTabs');
        router.push('/homePage');
      } else {
        
      }
     
    });
  
}
const navigateTo = (path) => {
  router.push(path);
}
const showmenus = ref(false);
const currentTabs = ref(store.state.currentTabs);
const showMenus = () => {
  showmenus.value = !showmenus.value;
  
}
const selectCategory = (category) => {
  
    store.dispatch('selectCategory', category);
    isMenu.value = true;
    mobileShowMenu.value = true;
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

const isMenu = ref(true);
const mainCategoryList = computed(() => store.state.mainCategory);
const clickFirstCategory = () => {
  const buttons = document.querySelectorAll('button'); // 모든 버튼 선택
  if (buttons.length > 0) {
    buttons[0].click(); // 첫 번째 버튼 클릭
  }
};
watch(mainCategoryList, (newCategories) => {
  if (newCategories.length > 0) {
    clickFirstCategory(); // 카테고리 목록이 변경되면 첫 번째 카테고리 클릭
  }
});

const hideMenu = () => {
  isMenu.value = !isMenu.value;
  
}
const moveToHome = () => {
  router.push('/homePage')
}

const excludedComponents = ref([]);

const tabs = computed(() => store.state.currentTabs);
const includedComponents = computed(() => {
  const currentTabs = store.state.currentTabs; // Vuex 상태 참조
  return currentTabs.map( tab => tab.lngProgramID);
});

const removedtabId = ref();
const removeTab = (tab) => {
  store.dispatch("closeTab", tab.lngProgramID);
  const currentTab = store.state.currentTabs ;
  if(currentTab.length > 0){
    // @click.stop 안해서 상위 이벤트 전파때문에 안됬었음.

    store.dispatch('changeActiveTab', currentTab[currentTab.length-1]);
    const insteadProgramID= currentTab[currentTab.length-1].lngProgramID;
    const insteadtab= currentTab[currentTab.length-1];
    const insteadstrUrl= currentTab[currentTab.length-1].strUrl;
    componentKey.value = insteadProgramID;
    isActive(insteadtab)
    router.push({path : '/'+insteadstrUrl.split('::')[0] + '/' + insteadstrUrl.split('::')[1] , query : { index : insteadProgramID}   });
    
  } else {
    componentKey.value = null ;
    router.push("/homePage");
  }
   
}

const isActive = (tab) => {
  const activeTab = store.state.activeTab ; 
  console.log(tab)
  console.log(activeTab)
  return activeTab && activeTab == tab.lngProgramID;
} 

//ref 는 기존의 변수까지 전부 병렬적으로 바꾸는거 같고 computed는 직렬적으로 바꾸는 것 같음
const lngProgramID = computed(() => {
  return store.state.activeTab ; // 기본값 설정
});

const reLoad = () => {
  store.dispatch('convertLoading',true);
  const activeTab = store.state.activeTab ;
  console.log(activeTab)
  store.dispatch('refreshTab' , activeTab );
  const activeTab2 = store.state.activeTab ;
  componentKey.value = activeTab2;

  store.dispatch('convertLoading',false);
}

const setActiveTab = (tab) => {
  // showmenus.value = false ;
  store.dispatch('changeActiveTab', tab);
  const activeTab = store.state.activeTab ;
  componentKey.value = activeTab;
  isActive(tab);
  router.push({path : '/'+tab.strUrl.split('::')[0] + '/' + tab.strUrl.split('::')[1] , query : { index : tab.lngProgramID}   });
};

watch( ()=> route.query , (newQuery) => {
  if(newQuery.index) {
    componentKey.value = newQuery.index
  } 
})

watch(() => store.state.currentTabs, (newTabs) => {
  store.dispatch('changeActiveTab', newTabs);
  const activeTab = store.state.activeTab ;
  componentKey.value = activeTab;
  
})




</script>

  
  <style scoped>
  .layout {
    display: flex;
    height: 100vh;
    overflow: hidden; /* 화면 밖으로 나가는 애니메이션 방지 */
  }
  
  .sidebar {
    width: 20%;
    position: relative;
    background: blue;
    opacity: 0.6;
  }
  
  .main-content {
    width: 80%;
    position: relative;
    background: white;
    padding: 20px;
    overflow: hidden; /* 화면 밖으로 나가는 애니메이션 방지 */
  }
  
  </style>
  