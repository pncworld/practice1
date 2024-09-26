<template>
  <div class="bg-white text-gray-600  w-full overflow-auto h-full m-0">
    <div class="p-4">
      <h1 class="text-2xl font-bold mb-4 border border-gray-950 ">{{cMenu}}</h1>
      <label>
  <input type="checkbox" @click="showAll" />메뉴 펼치기
    </label>
      <ul>
        <li v-for="category in categories" :key="category.lngProgramSub" :id="category.lngProgramSub" class="mb-2">
          <button 
            @click="toggleCategory(category.lngProgramSub)"
            class="w-full text-center px-4 py-2 text-gray-900 border border-gray-950 rounded-lg hover:bg-blue-100 focus:outline-none"
          >
            {{ category.strTitle }}
          </button>
          <ul v-if="isOpen(category.lngProgramSub)" class="pl-4 mt-2 ">
            <li v-for="sub in category.subcategories" :key="sub.id">
              <a href="#" class="block px-4 py-2 bg-white text-gray-900  rounded hover:bg-blue-100" @click="selectCategory(sub.strUrl , sub.lngProgramID , sub.strTitle)">
                {{ sub.strTitle }} 
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import router from '@/router';
import { computed, nextTick, ref, watch } from 'vue';
import { useStore } from 'vuex';
const store = useStore();
const categories = ref([]);

const openCategoryId = ref([]);
const toggleCategory = (id) => {
  if(openCategoryId.value.includes(id)){
    openCategoryId.value = openCategoryId.value.filter(item => item !== id);
  } else {
    openCategoryId.value.push(id);
  }
  nextTick(()=>{
  const element = document.getElementById(id);
  if(element){
    element.scrollIntoView({behavior : 'smooth' , block: 'center'});
  }
})
};

var countShow = false ;
const showAll = () =>{
  countShow = !countShow ;
  if(countShow){
  for (let index = 0; index < categories.value.length; index++) {
    openCategoryId.value.push(categories.value[index].lngProgramSub);
    
  }
  
} else {
  for (let index = 1; index <= categories.value.length; index++) {
    openCategoryId.value = [];
   
  }
}
}
const isOpen = (id) => openCategoryId.value.includes(id);

const selectCategory = (strUrl , lngProgramID , strTitle) => {
  
  const newTab = { strUrl , lngProgramID, strTitle}
  store.dispatch("addNewTab" , newTab); 
  router.push(strUrl);
}
var cMenu = ref("매출관리");
const selectedCategoryId = computed(() => store.state.selectedCategoryId) ;

watch(selectedCategoryId , (newCategory) => {
    
    cMenu= store.state.mainCategory.filter(item => item.lngCode == newCategory).map(item=> item.strTitle)[0];
    
    const subCategory = store.state.subCategory;
    const minorCategory = store.state.minorCategory;
    let category = [];
   
    category = subCategory.filter(item => item.lngCode == newCategory);
    category.forEach(element => {
        const matchedMinorCategory = minorCategory.filter(item => item.lngProgramSub == element.lngProgramSub);
        element.subcategories = matchedMinorCategory;
    });
   
    categories.value = category ;
    console.log(categories.value)
})
</script>


