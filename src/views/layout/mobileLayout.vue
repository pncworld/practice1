<template>
    <div class="h-full overflow-y-auto">
    <main class="h-full overflow-y-auto">
    <router-view v-slot="{ Component, route }">
        <div class="grid grid-cols-1 gap-3 h-full w-full items-center justify-center mr-3" v-show="isMenu">
        <div v-for="(item, i) in hierarchicalCategories" :key="i" class="w-full">
    <!-- 상위 카테고리 버튼 -->
    <button
      @click="toggleCategory(item.lngCode)"
      class="flex justify-center items-center px-3 py-2 font-semibold text-gray-700 bg-white border rounded hover:bg-gray-200 whitespace-nowrap w-full"
    >
      {{ item.strTitle }}
    </button>

    <!-- 하위 카테고리 버튼 -->
    <div v-show="isCategoryVisible(subItem.lngCode)" v-for="(subItem, j) in item.subCategories" :key="subItem.lngCode" class="mt-2 space-y-1 pl-4" >
      <button
        @click="selectSubCategory(subItem.lngProgramSub)"
        class="flex justify-center items-center px-3 py-2 font-medium text-gray-600 bg-gray-100 border rounded hover:bg-gray-200 whitespace-nowrap w-full"
      >
        {{ subItem.strTitle }}
      </button>

      <!-- 세 번째 계층 버튼 (minorCategories) -->
      <div v-show="issubCategoryVisible(minorItem.lngProgramSub)" v-for="(minorItem, k) in subItem.minorCategories" :key="k" class="mt-1 space-y-1 pl-8">
        <button
          @click="routecategory(minorItem.strUrl , minorItem.strTitle ,minorItem.lngProgramID)"
          class="flex justify-center items-center px-3 py-2 font-normal text-gray-500 bg-gray-50 border rounded hover:bg-gray-200 whitespace-nowrap w-full"
        >
          {{ minorItem.strTitle }}
        </button>
      </div>
    </div>
  </div>
  </div>
 
    <div v-if="personal" class="grid grid-cols-2 gap-3 h-full w-auto items-center pl-24">
    <div>
    <button class="flex font-semibold size-16 justify-end items-center text-gray-700 bg-white border rounded hover:bg-gray-200 whitespace-nowrap">즐겨찾기</button></div>
    <div>
    <button @click="logout" class="flex font-semibold size-16 justify-end items-center text-gray-700 bg-white border rounded hover:bg-gray-200 whitespace-nowrap">로그아웃</button></div> </div>
   
    <component v-show="!isMenu && !personal " :is="Component" ></component>
    </router-view>
    </main>

    </div>
    <MobileMenu v-show="showMobileMenu" @showMenu="showMenu" @showpersonal="showpersonal" class="sticky bottom-0" ></MobileMenu>
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
const route = useRoute();
const showMenu = (value) => {

    isMenu.value = value ;
}
const showpersonal = (value) => {
    personal.value = value;
    clickparent(value);
}
const clickparent = (value) => {

};
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