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
       <button v-for="(i,index) in ScreenKeyOrigin" :value="i.intScreenNo" class="bg-gray-100 rounded-lg w-[200px] h-10 flex-shrink-0" :class="clickScreenButton == (index) ? 'text-blue-600' : 'black' ">{{i.strScreenName}}</button>
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
   
   <button type="button" @click="addNewWidget()">Add Widget</button> {{ info }}
   <div class="flex">
   <div class="grid-stack table_style overflow-hidden !w-[1000px] !h-[630px]"></div>
   <div class="grid grid-rows-[1fr,3fr,1fr,1fr,1fr,1fr,1fr,1fr,4fr,1fr] grid-cols-1 border border-gray-200 w-[25%] ml-20 rounded-lg" >
    <div class="bg-gray-100 font-semibold flex items-center justify-center">테이블 속성</div>
    <div class="flex justify-center items-center gap-3"><button @click="shapeclick(1)" :class="clickedShape == 1 ? 'bg-blue-200' : 'bg-white'" class="h-full w-[25%] flex justify-center items-center"><img src="../../assets/palette1.svg" alt=""></button><button @click="shapeclick(2)" :class="clickedShape == 2 ? 'bg-blue-200' : 'bg-white'" class="h-full w-[25%] flex justify-center items-center"><img src="../../assets/palette2.svg" alt=""></button><button @click="shapeclick(3)" :class="clickedShape == 3 ? 'bg-blue-200' : 'bg-white'" class="h-full w-[25%] flex justify-center items-center"><img src="../../assets/palette3.svg" alt=""></button><button @click="shapeclick(4)" class="h-full w-[25%] flex justify-center items-center" :class="clickedShape == 4 ? 'bg-blue-200' : 'bg-white'"><img src="../../assets/palette4.svg" alt=""></button></div>
    <div class="grid grid-cols-2"><div class="bg-gray-100 font-semibold flex justify-center items-center">테이블 코드</div><div class="flex justify-center items-center "><input type="text" class="border rounded-lg border-gray-200 px-2" v-model="clickedtableCode"></div></div>
    <div class="grid grid-cols-2"><div class="bg-gray-100 font-semibold flex justify-center items-center">테이블 명</div><div class="flex justify-center items-center"><input type="text" class="border rounded-lg border-gray-200 px-2" v-model="clickedtableNm"></div></div>
    <div class="grid grid-cols-2"><div class="bg-gray-100 font-semibold flex justify-center items-center">좌석 수</div><div class="flex justify-center items-center"><input type="text" class="border rounded-lg border-gray-200 px-2" v-model="clickedtableSeats"></div></div>
    <div  class="grid grid-cols-4"><div class="bg-gray-100 font-semibold flex justify-center items-center">가로 위치(x)</div><div class="flex justify-center items-center"><input type="text" class="border rounded-lg border-gray-200 px-2 w-full" v-model="clickedtableX"></div><div class="bg-gray-100 font-semibold flex justify-center items-center">세로 위치(Y)</div><div class="flex justify-center items-center"><input type="text" class="border rounded-lg border-gray-200 px-2 w-full" v-model="clickedtableY"></div></div>
    <div  class="grid grid-cols-4"><div class="bg-gray-100 font-semibold flex justify-center items-center">너비</div><div class="flex justify-center items-center"><input type="text" class="border rounded-lg border-gray-200 px-2 w-full" v-model="clickedtableW"></div><div class="bg-gray-100 font-semibold flex justify-center items-center">높이</div><div class="flex justify-center items-center"><input type="text" class="border rounded-lg border-gray-200 px-2 w-full" v-model="clickedtableH"></div></div>
    <div class="bg-gray-100 font-semibold flex items-center justify-center">테이블 색상</div>
    <div >
    <div class="grid grid-rows-2 grid-cols-7 gap-1 mt-5 ml-5">
      <button class="bg-white w-10 h-10 border border-gray-300 rounded-lg " :class="clickedColor == 1 ? '!border-black' : ''" @click="setColor(1)" ></button>
      <button class="bg-[#BACCFF] w-10 h-10 border border-gray-300 rounded-lg " :class="clickedColor == 2 ? '!border-black' : ''" @click="setColor(2)"></button>
      <button class="bg-[#B3EAFF] w-10 h-10 border border-gray-300 rounded-lg " :class="clickedColor == 3 ? '!border-black' : ''" @click="setColor(3)"></button>
      <button class="bg-[#CFFFAB] w-10 h-10 border border-gray-300 rounded-lg " :class="clickedColor == 4 ? '!border-black' : ''" @click="setColor(4)"></button>
      <button class="bg-[#FFDDBA] w-10 h-10 border border-gray-300 rounded-lg " :class="clickedColor == 5 ? '!border-black' : ''" @click="setColor(5)"></button>
      <button class="bg-[#FFC5C5] w-10 h-10 border border-gray-300 rounded-lg " :class="clickedColor == 6 ? '!border-black' : ''" @click="setColor(6)"></button>
      <button class="bg-[#D5C5FF] w-10 h-10 border border-gray-300 rounded-lg " :class="clickedColor == 7 ? '!border-black' : ''" @click="setColor(7)"></button>
      <button class="bg-[#C3C3C3] w-10 h-10 border border-gray-300 rounded-lg " :class="clickedColor == 8 ? '!border-black' : ''" @click="setColor(8)"></button>
      <button class="bg-[#7699FF] w-10 h-10 border border-gray-300 rounded-lg " :class="clickedColor == 9 ? '!border-black' : ''" @click="setColor(9)"></button>
      <button class="bg-[#5DD2FF] w-10 h-10 border border-gray-300 rounded-lg " :class="clickedColor == 10 ? '!border-black' : ''" @click="setColor(10)"></button>
      <button class="bg-[#9CFA55] w-10 h-10 border border-gray-300 rounded-lg " :class="clickedColor == 11 ? '!border-black' : ''" @click="setColor(11)"></button>
      <button class="bg-[#FFB162] w-10 h-10 border border-gray-300 rounded-lg " :class="clickedColor == 12 ? '!border-black' : ''" @click="setColor(12)"></button>
      <button class="bg-[#FF9191] w-10 h-10 border border-gray-300 rounded-lg " :class="clickedColor == 13 ? '!border-black' : ''" @click="setColor(13)"></button>
      <button class="bg-[#AB8CFF] w-10 h-10 border border-gray-300 rounded-lg " :class="clickedColor == 14 ? '!border-black' : ''" @click="setColor(14)"></button>
    </div>
    </div>
    <div class="grid grid-cols-2"><div><button>복사</button></div><div><button>삭제</button></div></div>
  </div>
  </div>
  
 </template>
 
 <script setup>
 import { getTableList, getTableScreenKeys } from '@/api/master';
 import PickStore5 from '@/components/pickStore5.vue';
 import { GridLayout, GridItem } from "grid-layout-plus";
import { GridStack } from 'gridstack';
 import "gridstack/dist/gridstack.min.css";


 import Swal from 'sweetalert2';
 import { computed, nextTick, onMounted, ref, watch } from 'vue';
 import { useStore } from 'vuex';

 const ScreenKeyOrigin = ref([])
 const changeMode = ref(false);
 const Category = ref([]);

 const store = useStore();
 const userData = store.state.userData; 
 const groupCd = ref(userData.lngStoreGroup);
 const nowStoreCd = ref('0');
 const currentMenu = ref(1);
 
 const posNo = ref('');
 const afterSearch = ref(false);
 const nowStoreAreaCd = ref('0');
 const clickScreenButton = ref(0);
 const modified = ref(false);
 const afterCategory = ref(false);
 const clickedNo = ref('');
 const clickedNm = ref('');
 const tableList = ref([])
 const clickedShape = ref(1);
 const shapeclick = (value) => {
  clickedShape.value = value 

  const widgetElement = document.querySelector(`[gs-id="${clickedtableCode.value}"]`);
  if(clickedShape.value ==2) {
    widgetElement.style.borderRadius = '50%';
  } else if (clickedShape.value ==3){
    widgetElement.classList.add('diamond')
    

  }
 
 }
 const clickedColor = ref(1);
 const setColor = (value) =>{
  clickedColor.value = value
 }
 const filteredtableList = ref([])
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
     if(grid != null){
      grid.removeAll();
     }
     res = await getTableScreenKeys(groupCd.value , nowStoreCd.value , posNo.value, nowStoreAreaCd.value)
     ScreenKeyOrigin.value = res.data.SCREENKEYS
 
     console.log(ScreenKeyOrigin.value)
     let res2 = await getTableList(groupCd.value , nowStoreCd.value , posNo.value, nowStoreAreaCd.value)
     tableList.value = res2.data.TABLELISTS
     console.log(tableList.value)
     filteredtableList.value = tableList.value.filter(item => item.intScreenNo == '1').map(item => ({
      ...item,
      x : Math.round(item.lngX/125) ,
      y : Math.round(item.lngY/125) ,
      w : Math.round(item.lngWidth/120) ,
      h : Math.round(item.lngHeight/120) ,
      id : item.lngKeyscrNo
     }))

     console.log(filteredtableList.value)
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

 const clickedtableCode = ref('')
 const clickedtableNm = ref('')
 const clickedtableSeats = ref('')
 const clickedtableX = ref('')
 const clickedtableY = ref('')
 const clickedtableW = ref('')
 const clickedtableH = ref('')
 let count = ref(0);
          let info = ref("");
          let grid = null; // DO NOT use ref(null) as proxies GS will break all logic when comparing structures... see https://github.com/gridstack/gridstack.js/issues/2115
          let items = ref([])
// Initialize GridStack on mount
onMounted(() => {
            grid = GridStack.init({ // DO NOT use grid.value = GridStack.init(), see above
              float: true,
              cellHeight: 'auto',
              column : 90 ,
              resizable: { handles: 'e,se' },
              minRow : 56 ,
              maxRow: 56
            })

            grid.on("dragstop", function (event, element) {
              const node = element.gridstackNode;
              info.value = `you just dragged node #${node.id} to ${node.x},${node.y} – good job!`;
              const findtableindex = filteredtableList.value.findIndex(item => item.id == node.id)
              filteredtableList.value[findtableindex].x = node.x
              filteredtableList.value[findtableindex].y = node.y
          
            });

            grid.on("resizestop", function (event, element) {
  const node = element.gridstackNode;
  info.value = `you just resized node #${node.id} to width: ${node.w}, height: ${node.h} – good job!`;

  // 리사이즈된 아이템의 정보 업데이트
  const findtableindex = filteredtableList.value.findIndex(item => item.id == node.id);
  if (findtableindex !== -1) {
    filteredtableList.value[findtableindex].w = node.w;
    filteredtableList.value[findtableindex].h = node.h;
  }
});


          });

          function addNewWidget() {
    // filteredtableList에서 아이템을 가져옴, 없으면 기본 값 설정
    const node = filteredtableList.value[count.value] || {
        w: Math.round(1 + 90 * Math.random()), // 너비
        h: Math.round(1 + 90 * Math.random())  // 높이
    };
    
    // id는 count 값을 사용
    node.id = String(count.value++);
    
    // autoPosition을 true로 설정하여 겹치지 않게 자동으로 위치 배치
    grid.addWidget(node, false); // true로 설정하면 GridStack이 자동으로 위치를 계산
    grid.commit();
}

 watch(filteredtableList,(newList) => {
    if (newList.length > 0) {
     for(var i = 0 ; i< filteredtableList.value.length ; i++){
        const item = filteredtableList.value[i];
        const node = {
          x: item.x,
          y: item.y,
          w: item.w,
          h: item.h,
          id: item.id
        }
        grid.addWidget(node); // Add widget to the grid
        const widgetElement = document.querySelector(`[gs-id="${item.id}"]`);
         if (widgetElement) {
        widgetElement.style.backgroundColor = decimalToRGB(item.lngKeyColor) || 'blue'; // 색상 적용
      
      } 
      const textElement = widgetElement.querySelector('.grid-stack-item-content');
       if (textElement) {
        textElement.innerText = item.strName; // 텍스트 설정
      }
      if (widgetElement) {
        widgetElement.addEventListener('click', function () {
          const finditem = filteredtableList.value.find(item2 => item2.id == item.id);
          console.log('아이템 클릭됨!');
          console.log(`아이템 ID: ${finditem.id}`);
          clickedtableCode.value = finditem.id
          clickedtableNm.value = finditem.strName
          clickedtableX.value = finditem.x*125
          clickedtableY.value = finditem.y*125
          clickedtableW.value = finditem.w*120
          clickedtableH.value = finditem.h*120
          clickedtableSeats.value = finditem.lngCount
          console.log(`x: ${finditem.x}, y: ${finditem.y}`);
          console.log(`너비: ${finditem.w}, 높이: ${finditem.h}`);
          // 원하는 추가 작업을 여기에 작성
        });
      }
     
     }
  
    }
  },
  { immediate: false } // tableList가 처음 정의되었을 때는 실행하지 않음
);
  </script>
 <style>
.grid-stack {
 background : #ffffff
}
.grid-stack-item {
  position: relative;
  border: 2px solid #555; /* 아이템 경계선 */
  background-color: rgba(0, 0, 0, 0.1); /* 아이템 배경색 */
}

/* .grid-stack-item-content {
  background-color: white;
  border: 1px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  box-sizing: border-box;
} */
.table_style {
  width: 902px; 
  height: 600px !important; 
  border: 1px solid #E4E4E4; 
  border-radius: 10px; 
  background-image: url('../../assets/tablegrid-bg.jpg'); 
  margin-right: 30px;
}

.diamond {
  position: absolute; z-index: 0; width:100%; height: 100%; clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
}


/* 위치 정의 (gs-x) */
.gs-90 > .grid-stack-item[gs-x="1"] { left: 1.11%; }
.gs-90 > .grid-stack-item[gs-x="2"] { left: 2.22%; }
.gs-90 > .grid-stack-item[gs-x="3"] { left: 3.33%; }
.gs-90 > .grid-stack-item[gs-x="4"] { left: 4.44%; }
.gs-90 > .grid-stack-item[gs-x="5"] { left: 5.56%; }
.gs-90 > .grid-stack-item[gs-x="6"] { left: 6.67%; }
.gs-90 > .grid-stack-item[gs-x="7"] { left: 7.78%; }
.gs-90 > .grid-stack-item[gs-x="8"] { left: 8.89%; }
.gs-90 > .grid-stack-item[gs-x="9"] { left: 10.00%; }
.gs-90 > .grid-stack-item[gs-x="10"] { left: 11.11%; }
.gs-90 > .grid-stack-item[gs-x="11"] { left: 12.22%; }
.gs-90 > .grid-stack-item[gs-x="12"] { left: 13.33%; }
.gs-90 > .grid-stack-item[gs-x="13"] { left: 14.44%; }
.gs-90 > .grid-stack-item[gs-x="14"] { left: 15.56%; }
.gs-90 > .grid-stack-item[gs-x="15"] { left: 16.67%; }
.gs-90 > .grid-stack-item[gs-x="16"] { left: 17.78%; }
.gs-90 > .grid-stack-item[gs-x="17"] { left: 18.89%; }
.gs-90 > .grid-stack-item[gs-x="18"] { left: 20.00%; }
.gs-90 > .grid-stack-item[gs-x="19"] { left: 21.11%; }
.gs-90 > .grid-stack-item[gs-x="20"] { left: 22.22%; }
.gs-90 > .grid-stack-item[gs-x="21"] { left: 23.33%; }
.gs-90 > .grid-stack-item[gs-x="22"] { left: 24.44%; }
.gs-90 > .grid-stack-item[gs-x="23"] { left: 25.56%; }
.gs-90 > .grid-stack-item[gs-x="24"] { left: 26.67%; }
.gs-90 > .grid-stack-item[gs-x="25"] { left: 27.78%; }
.gs-90 > .grid-stack-item[gs-x="26"] { left: 28.89%; }
.gs-90 > .grid-stack-item[gs-x="27"] { left: 30.00%; }
.gs-90 > .grid-stack-item[gs-x="28"] { left: 31.11%; }
.gs-90 > .grid-stack-item[gs-x="29"] { left: 32.22%; }
.gs-90 > .grid-stack-item[gs-x="30"] { left: 33.33%; }
.gs-90 > .grid-stack-item[gs-x="31"] { left: 34.44%; }
.gs-90 > .grid-stack-item[gs-x="32"] { left: 35.56%; }
.gs-90 > .grid-stack-item[gs-x="33"] { left: 36.67%; }
.gs-90 > .grid-stack-item[gs-x="34"] { left: 37.78%; }
.gs-90 > .grid-stack-item[gs-x="35"] { left: 38.89%; }
.gs-90 > .grid-stack-item[gs-x="36"] { left: 40.00%; }
.gs-90 > .grid-stack-item[gs-x="37"] { left: 41.11%; }
.gs-90 > .grid-stack-item[gs-x="38"] { left: 42.22%; }
.gs-90 > .grid-stack-item[gs-x="39"] { left: 43.33%; }
.gs-90 > .grid-stack-item[gs-x="40"] { left: 44.44%; }
.gs-90 > .grid-stack-item[gs-x="41"] { left: 45.56%; }
.gs-90 > .grid-stack-item[gs-x="42"] { left: 46.67%; }
.gs-90 > .grid-stack-item[gs-x="43"] { left: 47.78%; }
.gs-90 > .grid-stack-item[gs-x="44"] { left: 48.89%; }
.gs-90 > .grid-stack-item[gs-x="45"] { left: 50.00%; }
.gs-90 > .grid-stack-item[gs-x="46"] { left: 51.11%; }
.gs-90 > .grid-stack-item[gs-x="47"] { left: 52.22%; }
.gs-90 > .grid-stack-item[gs-x="48"] { left: 53.33%; }
.gs-90 > .grid-stack-item[gs-x="49"] { left: 54.44%; }
.gs-90 > .grid-stack-item[gs-x="50"] { left: 55.56%; }
.gs-90 > .grid-stack-item[gs-x="51"] { left: 56.67%; }
.gs-90 > .grid-stack-item[gs-x="52"] { left: 57.78%; }
.gs-90 > .grid-stack-item[gs-x="53"] { left: 58.89%; }
.gs-90 > .grid-stack-item[gs-x="54"] { left: 60.00%; }
.gs-90 > .grid-stack-item[gs-x="55"] { left: 61.11%; }
.gs-90 > .grid-stack-item[gs-x="56"] { left: 62.22%; }
.gs-90 > .grid-stack-item[gs-x="57"] { left: 63.33%; }
.gs-90 > .grid-stack-item[gs-x="58"] { left: 64.44%; }
.gs-90 > .grid-stack-item[gs-x="59"] { left: 65.56%; }
.gs-90 > .grid-stack-item[gs-x="60"] { left: 66.67%; }
.gs-90 > .grid-stack-item[gs-x="61"] { left: 67.78%; }
.gs-90 > .grid-stack-item[gs-x="62"] { left: 68.89%; }
.gs-90 > .grid-stack-item[gs-x="63"] { left: 70.00%; }
.gs-90 > .grid-stack-item[gs-x="64"] { left: 71.11%; }
.gs-90 > .grid-stack-item[gs-x="65"] { left: 72.22%; }
.gs-90 > .grid-stack-item[gs-x="66"] { left: 73.33%; }
.gs-90 > .grid-stack-item[gs-x="67"] { left: 74.44%; }
.gs-90 > .grid-stack-item[gs-x="68"] { left: 75.56%; }
.gs-90 > .grid-stack-item[gs-x="69"] { left: 76.67%; }
.gs-90 > .grid-stack-item[gs-x="70"] { left: 77.78%; }
.gs-90 > .grid-stack-item[gs-x="71"] { left: 78.89%; }
.gs-90 > .grid-stack-item[gs-x="72"] { left: 80.00%; }
.gs-90 > .grid-stack-item[gs-x="73"] { left: 81.11%; }
.gs-90 > .grid-stack-item[gs-x="74"] { left: 82.22%; }
.gs-90 > .grid-stack-item[gs-x="75"] { left: 83.33%; }
.gs-90 > .grid-stack-item[gs-x="76"] { left: 84.44%; }
.gs-90 > .grid-stack-item[gs-x="77"] { left: 85.56%; }
.gs-90 > .grid-stack-item[gs-x="78"] { left: 86.67%; }
.gs-90 > .grid-stack-item[gs-x="79"] { left: 87.78%; }
.gs-90 > .grid-stack-item[gs-x="80"] { left: 88.89%; }
.gs-90 > .grid-stack-item[gs-x="81"] { left: 90.00%; }
.gs-90 > .grid-stack-item[gs-x="82"] { left: 91.11%; }
.gs-90 > .grid-stack-item[gs-x="83"] { left: 92.22%; }
.gs-90 > .grid-stack-item[gs-x="84"] { left: 93.33%; }
.gs-90 > .grid-stack-item[gs-x="85"] { left: 94.44%; }
.gs-90 > .grid-stack-item[gs-x="86"] { left: 95.56%; }
.gs-90 > .grid-stack-item[gs-x="87"] { left: 96.67%; }
.gs-90 > .grid-stack-item[gs-x="88"] { left: 97.78%; }
.gs-90 > .grid-stack-item[gs-x="89"] { left: 98.89%; }
.gs-90 > .grid-stack-item[gs-x="90"] { left: 100.00%; }


/* 너비 정의 (gs-w) */
.gs-90 > .grid-stack-item[gs-w="1"] { width: 1.11%; }
.gs-90 > .grid-stack-item[gs-w="2"] { width: 2.22%; }
.gs-90 > .grid-stack-item[gs-w="3"] { width: 3.33%; }
.gs-90 > .grid-stack-item[gs-w="4"] { width: 4.44%; }
.gs-90 > .grid-stack-item[gs-w="5"] { width: 5.56%; }
.gs-90 > .grid-stack-item[gs-w="6"] { width: 6.67%; }
.gs-90 > .grid-stack-item[gs-w="7"] { width: 7.78%; }
.gs-90 > .grid-stack-item[gs-w="8"] { width: 8.89%; }
.gs-90 > .grid-stack-item[gs-w="9"] { width: 10.00%; }
.gs-90 > .grid-stack-item[gs-w="10"] { width: 11.11%; }
.gs-90 > .grid-stack-item[gs-w="11"] { width: 12.22%; }
.gs-90 > .grid-stack-item[gs-w="12"] { width: 13.33%; }
.gs-90 > .grid-stack-item[gs-w="13"] { width: 14.44%; }
.gs-90 > .grid-stack-item[gs-w="14"] { width: 15.56%; }
.gs-90 > .grid-stack-item[gs-w="15"] { width: 16.67%; }
.gs-90 > .grid-stack-item[gs-w="16"] { width: 17.78%; }
.gs-90 > .grid-stack-item[gs-w="17"] { width: 18.89%; }
.gs-90 > .grid-stack-item[gs-w="18"] { width: 20.00%; }
.gs-90 > .grid-stack-item[gs-w="19"] { width: 21.11%; }
.gs-90 > .grid-stack-item[gs-w="20"] { width: 22.22%; }
.gs-90 > .grid-stack-item[gs-w="21"] { width: 23.33%; }
.gs-90 > .grid-stack-item[gs-w="22"] { width: 24.44%; }
.gs-90 > .grid-stack-item[gs-w="23"] { width: 25.56%; }
.gs-90 > .grid-stack-item[gs-w="24"] { width: 26.67%; }
.gs-90 > .grid-stack-item[gs-w="25"] { width: 27.78%; }
.gs-90 > .grid-stack-item[gs-w="26"] { width: 28.89%; }
.gs-90 > .grid-stack-item[gs-w="27"] { width: 30.00%; }
.gs-90 > .grid-stack-item[gs-w="28"] { width: 31.11%; }
.gs-90 > .grid-stack-item[gs-w="29"] { width: 32.22%; }
.gs-90 > .grid-stack-item[gs-w="30"] { width: 33.33%; }
.gs-90 > .grid-stack-item[gs-w="31"] { width: 34.44%; }
.gs-90 > .grid-stack-item[gs-w="32"] { width: 35.56%; }
.gs-90 > .grid-stack-item[gs-w="33"] { width: 36.67%; }
.gs-90 > .grid-stack-item[gs-w="34"] { width: 37.78%; }
.gs-90 > .grid-stack-item[gs-w="35"] { width: 38.89%; }
.gs-90 > .grid-stack-item[gs-w="36"] { width: 40.00%; }
.gs-90 > .grid-stack-item[gs-w="37"] { width: 41.11%; }
.gs-90 > .grid-stack-item[gs-w="38"] { width: 42.22%; }
.gs-90 > .grid-stack-item[gs-w="39"] { width: 43.33%; }
.gs-90 > .grid-stack-item[gs-w="40"] { width: 44.44%; }
.gs-90 > .grid-stack-item[gs-w="41"] { width: 45.56%; }
.gs-90 > .grid-stack-item[gs-w="42"] { width: 46.67%; }
.gs-90 > .grid-stack-item[gs-w="43"] { width: 47.78%; }
.gs-90 > .grid-stack-item[gs-w="44"] { width: 48.89%; }
.gs-90 > .grid-stack-item[gs-w="45"] { width: 50.00%; }
.gs-90 > .grid-stack-item[gs-w="46"] { width: 51.11%; }
.gs-90 > .grid-stack-item[gs-w="47"] { width: 52.22%; }
.gs-90 > .grid-stack-item[gs-w="48"] { width: 53.33%; }
.gs-90 > .grid-stack-item[gs-w="49"] { width: 54.44%; }
.gs-90 > .grid-stack-item[gs-w="50"] { width: 55.56%; }
.gs-90 > .grid-stack-item[gs-w="51"] { width: 56.67%; }
.gs-90 > .grid-stack-item[gs-w="52"] { width: 57.78%; }
.gs-90 > .grid-stack-item[gs-w="53"] { width: 58.89%; }
.gs-90 > .grid-stack-item[gs-w="54"] { width: 60.00%; }
.gs-90 > .grid-stack-item[gs-w="55"] { width: 61.11%; }
.gs-90 > .grid-stack-item[gs-w="56"] { width: 62.22%; }
.gs-90 > .grid-stack-item[gs-w="57"] { width: 63.33%; }
.gs-90 > .grid-stack-item[gs-w="58"] { width: 64.44%; }
.gs-90 > .grid-stack-item[gs-w="59"] { width: 65.56%; }
.gs-90 > .grid-stack-item[gs-w="60"] { width: 66.67%; }
.gs-90 > .grid-stack-item[gs-w="61"] { width: 67.78%; }
.gs-90 > .grid-stack-item[gs-w="62"] { width: 68.89%; }
.gs-90 > .grid-stack-item[gs-w="63"] { width: 70.00%; }
.gs-90 > .grid-stack-item[gs-w="64"] { width: 71.11%; }
.gs-90 > .grid-stack-item[gs-w="65"] { width: 72.22%; }
.gs-90 > .grid-stack-item[gs-w="66"] { width: 73.33%; }
.gs-90 > .grid-stack-item[gs-w="67"] { width: 74.44%; }
.gs-90 > .grid-stack-item[gs-w="68"] { width: 75.56%; }
.gs-90 > .grid-stack-item[gs-w="69"] { width: 76.67%; }
.gs-90 > .grid-stack-item[gs-w="70"] { width: 77.78%; }
.gs-90 > .grid-stack-item[gs-w="71"] { width: 78.89%; }
.gs-90 > .grid-stack-item[gs-w="72"] { width: 80.00%; }
.gs-90 > .grid-stack-item[gs-w="73"] { width: 81.11%; }
.gs-90 > .grid-stack-item[gs-w="74"] { width: 82.22%; }
.gs-90 > .grid-stack-item[gs-w="75"] { width: 83.33%; }
.gs-90 > .grid-stack-item[gs-w="76"] { width: 84.44%; }
.gs-90 > .grid-stack-item[gs-w="77"] { width: 85.56%; }
.gs-90 > .grid-stack-item[gs-w="78"] { width: 86.67%; }
.gs-90 > .grid-stack-item[gs-w="79"] { width: 87.78%; }
.gs-90 > .grid-stack-item[gs-w="80"] { width: 88.89%; }
.gs-90 > .grid-stack-item[gs-w="81"] { width: 90.00%; }
.gs-90 > .grid-stack-item[gs-w="82"] { width: 91.11%; }
.gs-90 > .grid-stack-item[gs-w="83"] { width: 92.22%; }
.gs-90 > .grid-stack-item[gs-w="84"] { width: 93.94%; }
.gs-90 > .grid-stack-item[gs-w="85"] { width: 94.44%; }
.gs-90 > .grid-stack-item[gs-w="86"] { width: 95.56%; }
.gs-90 > .grid-stack-item[gs-w="87"] { width: 96.67%; }
.gs-90 > .grid-stack-item[gs-w="88"] { width: 97.78%; }
.gs-90 > .grid-stack-item[gs-w="89"] { width: 98.89%; }
.gs-90 > .grid-stack-item[gs-w="90"] { width: 100.00%; }
	
 </style>
 