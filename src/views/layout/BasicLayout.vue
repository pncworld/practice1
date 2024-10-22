<template>
  <div class="flex flex-col h-screen overflow-hidden bg-gray-100">
    <Loading></Loading>
    <header v-if="showMenu" class="bg-white border rounded-3xl text-gray-600 p-4 w-full h-20">
      
      <div class="text-sm font-bold flex space-x-5 -ml-64 justify-center -mt-2">
        <button  v-for="(item , i) in mainCategoryList" :key="i" value="" id="{{ item.lngCode }}" @click="selectCategory(item.lngCode)" >{{ item.strTitle }}</button>
        <div class="absolute right-10 space-x-4 mt-3 text-black font-bold ">
        <button><img src="../../assets/table_star.svg" alt="" class="size-7"></button>
        <button @click="deleteAllTabs"><img src="../../assets/ic_delete.svg" alt="" class="size-7"></button>
        <button  @click="reLoad"><img src="../../assets/ic_refresh.svg" alt="" class="size-7"></button>
        <button @click="showMenus"><img src="../../assets/ic_menu.svg" alt="" class="size-7"></button>
        <button  @click="hideMenu"><img src="../../assets/ic_extent.svg" alt="" class="size-7"></button>
        <button  @click="logout" ><img src="../../assets/logout_icon.svg" alt="" class="size-5 -mt-6 ml-2"></button> 
        </div>
        
      </div>
      <div class="absolute z-50 right-36 top-14 border border-black" v-show="showmenus" ><div v-for="i in currentTabs" :key="i.lngProgramID" class="bg-white flex justify-start pt-3 pb-3"><button @click="setActiveTab(i)">{{ i.strTitle }}</button></div></div> 
      <div class="flex space-x-2 absolute left-72 mt-4">
        <div v-if="showMenu" v-for="tab in tabs" :key="tab.lngProgramID" @click="setActiveTab(tab)" class="w-auto h-7 bg-slate-100 text-xs rounded-md px-4 py-2 cursor-pointer font-bold hover:bg-blue-50 transition" :class="{'text-black': !isActive(tab),'text-blue-400' : isActive(tab)}">
          {{tab.strTitle}}<button @click.stop="removeTab(tab)"><span class="text-blue-300 "><img src="../../assets/deleteIcon.png" alt="" class="size-3"></span></button>  </div>
        </div>
      
    </header>
    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar -->
      <aside v-show="isMenu && showMenu" class=" bg-white text-gray-600 p-0 m-0 border-gray-200  border flex justify-center items-center" style="width:14%">
        <BasicMenu v-if="showMenu" class="w-full h-full  border" />
      </aside>
      
      <!-- Main Content -->
      <main class="flex-1 bg-white p-1 overflow-y-scroll overflow-x-hidden">
        
      <router-view v-slot="{ Component , route}">
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
import router from '@/router';
import Swal from 'sweetalert2';
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import {  useStore } from 'vuex';


const route = useRoute();
const store = useStore() ;
const userData = store.state.userData;
const showMenu = ref(route.path != '/'); // Initialize based on current route
const componentKey = ref(null);
// Watch for route changes
watch(() => route.path, (newPath) => {
  showMenu.value = newPath != '/'; // Update based on new route
 
});
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
   
    console.log(category);
  
    isMenu.value = true;
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

const isMenu = ref(false);
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


const removeTab = (tab) => {
  
  store.dispatch("closeTab", tab.lngProgramID);
  const currentTab = store.state.currentTabs ;
  if(currentTab.length > 0){
    // @click.stop 안해서 상위 이벤트 전파때문에 안됬었음.
    store.dispatch('changeActiveTab', currentTab[currentTab.length-1]);
    componentKey.value = currentTab[currentTab.length-1].lngProgramID;
    
  } else {
    componentKey.value = null ;
    router.push("/homePage");
  }
   
}

const isActive = (tab) => {
  const activeTab = store.state.activeTab ; 
  return activeTab && activeTab == tab.lngProgramID;
} 

//ref 는 기존의 변수까지 전부 병렬적으로 바꾸는거 같고 computed는 직렬적으로 바꾸는 것 같음
const lngProgramID = computed(() => {
  return store.state.activeTab ; // 기본값 설정
});

const reLoad = () => {
  store.dispatch('convertLoading',true);
  const activeTab = store.state.activeTab ;
  store.dispatch('refreshTab' , activeTab );
 
  componentKey.value = activeTab;

  store.dispatch('convertLoading',false);
}

const setActiveTab = (tab) => {
  // showmenus.value = false ;
  store.dispatch('changeActiveTab', tab);
  const activeTab = store.state.activeTab ;
  componentKey.value = activeTab;
  isActive(tab);
  router.push({path : tab.strUrl , query : { index : tab.lngProgramID}   });
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
  