<template>
  <div class="flex flex-col h-screen overflow-hidden bg-gray-100">
    <!-- Header -->
    <header v-if="showMenu" class="bg-blue-900 text-white p-4 w-full h-2/7">
      <div class="text-xll font-bold flex space-x-5 ml-40 justify-center">
        <button  v-for="(item , i) in mainCategoryList" :key="i" value="" id="{{ item.lngCode }}" @click="selectCategory(item.lngCode)" >{{ item.strTitle }}</button>
        <!-- <button @click="navigateTo('/dashboard'); selectCategory('home');">홈</button>&nbsp;&nbsp;&nbsp;
        <button>즐겨찾기</button>&nbsp;&nbsp;&nbsp;&nbsp;
        <button @click="selectCategory('sale')">매출</button>&nbsp;&nbsp;&nbsp;&nbsp;
        <button @click="selectCategory('warehouse')">창고</button>&nbsp;&nbsp;&nbsp;&nbsp;
        <button @click="selectCategory('purchase')">구매</button>&nbsp;&nbsp;&nbsp;&nbsp;
        <button @click="selectCategory('purchase2')">구매(직영)</button>&nbsp;&nbsp;&nbsp;&nbsp;
        <button @click="selectCategory('cost')">원가</button>&nbsp;&nbsp;&nbsp;&nbsp;
        <button @click="selectCategory('order')">수주</button>&nbsp;&nbsp;&nbsp;&nbsp;
        <button>인사</button>&nbsp;&nbsp;&nbsp;&nbsp;
        <button>회계</button>&nbsp;&nbsp;&nbsp;&nbsp;
        <button>포스</button>&nbsp;&nbsp;&nbsp;&nbsp;
        <button>CRM</button>&nbsp;&nbsp;&nbsp;&nbsp;
        <button>매출</button>&nbsp;&nbsp;&nbsp;&nbsp;
        <button>포스</button>&nbsp;&nbsp;&nbsp;&nbsp;
        <button>기준정보</button>&nbsp;&nbsp;&nbsp;&nbsp;
        <button>시스템</button>&nbsp;&nbsp;&nbsp;&nbsp;
        <button>계정</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      -->
        <div class="absolute right-10 space-x-4">
        <button class=" text-sm" @click="reLoad">새로고침</button>
        <button class=" text-sm" @click="hideMenu">확대</button>
        <button class=" text-sm" @click="logout">로그아웃</button> 
        </div>
      </div>
      
    </header>
    
    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar -->
      <aside v-show="isMenu && showMenu" class="w-1/5 bg-white text-gray-600 p-0 m-0 border-gray-200 rounded border-4 flex justify-center items-center">
        <BasicMenu v-if="showMenu" class="w-full h-full" />
      </aside>
      
      <!-- Main Content -->
      <main class="flex-1 p-1 bg-white overflow-auto">
        <div class="flex space-x-2">
        <div v-if="showMenu" v-for="tab in tabs" :key="tab.uniqueId" @click="setActiveTab(tab)" class="w-2/12 bg-white text-gray-500 border border-slate-950 rounded-md px-4 py-2 cursor-pointer hover:bg-blue-50 transition">
          {{tab.name}}<button @click="removeTab(tab)"><img src="../../assets/deleteIcon.png" alt="x" class="w-4 h-auto"></button>  </div>
        </div>
        <router-view v-slot="{ Component }">
      <keep-alive :exclude="excludedComponents">
    <component :is="Component" :key="`${route.path}-${activeTabId}`"/>
     </keep-alive>
      </router-view>
      </main>
    </div>
  </div>
</template>
  
<script setup>
import BasicMenu from '@/components/BasicMenu.vue';
import router from '@/router';
import axios from 'axios';
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import {  useStore } from 'vuex';

const route = useRoute();
const store = useStore() ;
const userData = store.state.userData;
const showMenu = ref(route.path != '/'); // Initialize based on current route

// Watch for route changes
watch(() => route.path, (newPath) => {
  showMenu.value = newPath != '/'; // Update based on new route
 
});

const navigateTo = (path) => {
  router.push(path);
}

const selectCategory = (category) => {
  
    store.dispatch('selectCategory', category);
   
    console.log(category);
  
  isMenu.value = true;
}

const logout = () => {
  store.dispatch('updateUserData', []);
  store.dispatch('closeAllTabs');
  store.replaceState({
       userData: [], // 사용자 데이터를 저장할 상태
      selectedCategoryId : null ,
      currentTabs : [] ,
      activeTab : '',
      mainCategory : [],
      subCategory : [],
      minorCategory : []
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

const excludedComponents = ref([]);

const tabs = computed(() => store.state.currentTabs);
const removeTab = (tab) => {
  
  store.dispatch("closeTab",tab.uniqueId);
 
  const currentTabs = store.state.currentTabs;
  excludedComponents.value.push(tab.uniqueId);
  
  if(currentTabs.length > 0){
    store.dispatch('changeActiveTab', currentTabs[currentTabs.length-1]);
    console.log(currentTabs[currentTabs.length-1].url);
    
    router.push(currentTabs[currentTabs.length-1].url);
  } else {
    router.push("/");
  }
   
}
const reload = () => {

}

const setActiveTab = (tab) => {
  store.dispatch('changeActiveTab', tab)
  
  router.push(tab.url)
}
const activeTabId = computed(() => {
  return store.state?.activeTab ? store.state.activeTab : 'defaultTab'; // 기본값 설정
});


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
  