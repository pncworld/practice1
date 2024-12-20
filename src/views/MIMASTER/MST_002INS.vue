<template>
  <div class="flex justify-between items-center w-full overflow-y-auto">
     <div class="flex justify-start  w-full pl-12 pt-4">
     <div class="flex justify-start">
       <h1 class="font-bold text-sm md:text-2xl w-full">테이블관리</h1></div>
     </div>
     <div class="flex justify-center mr-10 space-x-2 pr-5">
       <button @click="searchButton" class="button search md:w-auto w-14">조회</button>
       <button @click="saveButton" class="button save w-auto">저장</button>
       <button @click="copyButton" class="button copy w-auto" v-if="currentMenu == true">복사</button>
     </div>
 </div>
 <br>
   <div class="flex justify-start  space-x-5 bg-gray-200 rounded-lg md:h-16 h-24 items-center">
     <PickStore5 @areaCd="handleStoreAreaCd" @update:storeCd="handleStoreCd" @posNo="handlePosNo" @storeNm="handlestoreNm" @update:ischanged="handleinitAll" ></PickStore5>
    </div> 
 
   <div class="flex ml-10 mt-2 w-[60%] flex-row justify-between">
     <div class="flex flex-row w-[79%]  items-center">
     <button class="w-10 flex-shrink-0 flex items-center">
       <img src="../../assets/ic_before.svg" alt="">
     </button>
     <div class="flex gap-2 w-full overflow-hidden">
       <button v-for="i in ScreenKeyOrigin" :value="i.intScreenNo" class="bg-gray-100 rounded-lg w-[200px] h-10 flex-shrink-0">{{i.strScreenName}}</button>
     </div> 
     <button class="w-10 flex-shrink-0 flex items-center">
       <img src="../../assets/ic_after.svg" alt="">
     </button>
     <button class="w-10 flex-shrink-0 flex items-center">
       <img src="../../assets/Btn_46_add.svg" alt="">
     </button>
     <button class="w-10 flex-shrink-0 flex items-center">
       <img src="../../assets/Btn_46_refresh.svg" alt="">
     </button>
   </div>
   <div class="ml-60 h-14 w-[200px] mt-2 flex items-center">
     <button class="button primary w-[130px] h-[40px] flex justify-center">테이블 추가</button>
   </div>
   </div>
 
   <!-- <div class="w-[1200px] h-[700px] border border-black">
     <v-stage :config="stageConfig">
       <v-layer>
   
         <v-line
           v-for="line in gridLines"
           :key="line.id"
           :config="line"
         />
  
         <v-group
        v-for="(item, index) in tableList"
        :config="CreateConfig2(item)"
        @dragmove="handleDragMove(index,$event)"
      >
       사각형 (v-rect) 
        <v-rect
          :width="item.width"
          :height="item.height"
          :fill="item.fill"
          :config="CreateConfig(item)"
          :drag-bound-func="dragBoundFunc"
        />
        
    텍스트 (v-text) 
        <v-text
          :x="item.width / 2" 
          :y="item.height / 2"
          :text="item.srtName"
          :font-size="16"
          :align="'center'"
          :config="createTextConfig(item)"
        />
      </v-group>
       
     
       </v-layer>
     </v-stage>
   </div> -->
   <GridLayout
      :layout="tableList"
      :col-num="12"
      :row-height="30"
      :is-draggable="true"
      :is-resizable="true"
      :responsive="true"
      :max-rows="5"  
      class="grid-layout"
    >
      <GridItem
        v-for="(item, index) in tableList"
        :key="index"
        :x="item.lngX"
        :y="item.lngY"
        :w="item.lngWidth"
        :h="item.lngHeight"
        :i="item.i"
      >
        <div class="grid-item">
          <p>Item {{ item.i }}</p>
        </div>
      </GridItem>
    </GridLayout>
 </template>
 
 <script setup>
 import { getTableList, getTableScreenKeys } from '@/api/master';
 import PickStore5 from '@/components/pickStore5.vue';
 import { GridLayout, GridItem } from "vue3-grid-layout";
 
 import Swal from 'sweetalert2';
 import { computed, onMounted, ref, watch } from 'vue';
 import { useStore } from 'vuex';

 const ScreenKeyOrigin = ref([])
 const changeMode = ref(false);
 const Category = ref([]);
 const items = ref([]);

 const store = useStore();
 const userData = store.state.userData; 
 const groupCd = ref(userData.lngStoreGroup);
 const nowStoreCd = ref('0');
 const currentMenu = ref(1);
 
 const posNo = ref('');
 const afterSearch = ref(false);
 const nowStoreAreaCd = ref('0');
 
 const modified = ref(false);
 const afterCategory = ref(false);
 const clickedNo = ref('');
 const clickedNm = ref('');
 const tableList = ref([])
 const  handleStoreCd = async(newValue) => {
     afterSearch.value = false;
    
      nowStoreCd.value = newValue ;
  }
 
  const handlePosNo = (newValue) => {
     posNo.value = newValue
     console.log(posNo.value)
     if(nowStoreAreaCd.value != undefined || posNo.value != undefined){
         searchButton()
     }
    
   }
 
   const  handleStoreAreaCd = (newValue) => {
   
   nowStoreAreaCd.value = newValue ;
   console.log(nowStoreAreaCd.value)
   }
 
 const searchButton = async () => {
       items.value = []
   
   
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
           text: 'POS번호를 선택하세요.',
           icon: 'warning',
           showCancelButton: false,
           confirmButtonColor: '#3085d6',
           allowOutsideClick: false
       })
       return;
   }
  
 
   store.state.loading = true;
   try {
     let res;
 
     res = await getTableScreenKeys(groupCd.value , nowStoreCd.value , posNo.value, nowStoreAreaCd.value)
     ScreenKeyOrigin.value = res.data.SCREENKEYS
 
     console.log(ScreenKeyOrigin.value)
     let res2 = await getTableList(groupCd.value , nowStoreCd.value , posNo.value, nowStoreAreaCd.value)
     tableList.value = res2.data.TABLELISTS
     console.log(tableList.value)
    
   } catch (error) {
       afterSearch.value = false;
 
   } finally {
   
     
       store.state.loading = false; // 로딩 상태 종료
                modified.value = false ;
                afterCategory.value = false;
                clickedNo.value = ''
                clickedNm.value = ''
               
   }
   
 
   
   };
 


   const decimalToRGB = (decimal) => {
   const r = (decimal >> 16) & 255;
   const g = (decimal >> 8) & 255;
   const b = decimal & 255;
   return `rgb(${r}, ${g}, ${b})`;
 };

 watch(tableList , () => {
   console.log(tableList.value)
 })

 let grid = null;

const layout = [
        { i: "1", x: 0, y: 0, w: 4, h: 2 },
        { i: "2", x: 4, y: 0, w: 4, h: 2 },
        { i: "3", x: 8, y: 0, w: 4, h: 2 },
        { i: "4", x: 0, y: 2, w: 4, h: 2 },
        { i: "5", x: 4, y: 2, w: 4, h: 2 },
        { i: "6", x: 8, y: 2, w: 4, h: 2 }
      ]


  </script>
 <style>
.grid-layout {
  width: 100%;
  height: 100%;
}

.grid-item {
  background-color: #ddd;
  padding: 10px;
  text-align: center;
  border-radius: 5px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}


 </style>
 