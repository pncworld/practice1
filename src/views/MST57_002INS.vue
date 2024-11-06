<template>
    <div class="flex justify-start pl-4 pt-4">
        <div class="flex justify-start"><h1 class="font-bold text-2xl">
            메뉴 배치 관리
        </h1></div>
        <div class="absolute right-48 space-x-3 flex"><button class="button search" @click="searchPosMenu">조회</button><button class="button save" @click="savePosMenu">저장</button></div>
    </div>
    <br>
    <div class="bg-gray-200 h-24 flex flex-col items-start rounded-md pt-2">
    <PickStore4 class="flex justify-start  space-x-5 bg-gray-200 rounded-lg h-16 items-center" @update:storeAreaCd="handleStoreAreaCd" @update:storeCd="handleStoreCd" @update:ischanged="ischanged"></PickStore4>
    <PickCategory :storeCd="currstoreCd" :storeAreaCd="currAreaCd" :ischange="ischange" @emitsub="emitsubcate" @emitmain="emitmaincate"></PickCategory>
</div>
<div class="border border-black w-96 h-96 ml-3 mt-10 overflow-auto flex flex-col">
  <div v-for="(mainCategory, mainIndex) in majorGroup" :key="mainIndex" class="mb-4 flex flex-col items-start">
    <button
      @click="toggleMain(mainIndex)"
      class="w-auto text-left bg-gray-200 p-3 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
    >
      {{ mainCategory.majorGroupNm }}
    </button>
    <div v-show="activeMain[mainIndex]" class="ml-4 mt-2 flex flex-col items-start space-y-2">
      <div v-for="(subCategory, subIndex) in mainCategory.subGroup" :key="subIndex">
        <button
      @click="toggleSub(subIndex)"
      class="w-auto text-left bg-gray-200 p-3 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 flex flex-col flex-grow items-start"
    >
      {{ subCategory.subGroupNm }}
    </button>
        <div v-show="activeSub[subIndex]" v-for="(item, itemIndex) in subCategory.menuList" :key="itemIndex" class="flex w-72 justify-between ml-16">
          <div class=""><button @click="addMenu(item.menuCd ,item.menuNm , mainCategory.majorGroupNm , subCategory.subGroupNm)" >{{ item.menuNm }}/{{ item.lngPrice}}원 </button></div><button @click="addMenu(item.menuCd ,item.menuNm ,mainCategory.majorGroupNm , subCategory.subGroupNm)" class="whitebutton">추가</button>
        </div>
      </div>
    </div>
  </div>
</div>
<div class="border w-4/6 h-auto -mt-96 " style="margin-left:30%;">

    <Container :onDrop="onDrop">
      <div class="grid grid-cols-8 bg-gray-300 h-14 space-x-5 items-center justify-between font-bold">
        <div>순서</div> <div>번호</div><div>이미지</div><div>메뉴코드</div><div>메뉴명</div><div>메인카테고리</div><div>서브카테고리</div><div>삭제</div>
      </div>
      <Draggable v-for="item in items">
        <div class="grid grid-cols-8 h-auto">
          <div class="h-16 flex items-center justify-center"><font-awesome-icon icon="bars" /></div><div class="h-16 flex items-center justify-center">{{ item?.intKeySeq  }}</div><div class="h-16 flex items-center justify-center"><img :src="item?.imgurl" alt="" class="size-8"></div><div class="h-16 flex items-center justify-center">{{ item?.lngKeyscrNo }}</div>
          <div class="h-16 flex items-center justify-center">{{ item?.strKeyName }}</div><div class="h-16 flex items-center justify-center">{{ item?.majorName}}</div><div class="h-16 flex items-center justify-center">{{ item?.subName}}</div><div class="h-16 flex items-center justify-center"><button @click="deleteitem(item?.lngKeyscrNo , item?.intKeySeq )"><img src="../assets/trash.svg" alt=""></button></div>
        </div>
      </Draggable>
    </Container>
  </div>
</template>

<script setup>
import { deletetablePosMenuKey, savetablePosMenuKey, tablePosMenu, tablePosMenuKey } from '@/api/master';
import PickCategory from '@/components/pickCategory.vue';
import PickStore4 from '@/components/pickStore4.vue';
import Swal from 'sweetalert2';
import { computed, ref } from 'vue';

import { Container, Draggable } from 'vue3-smooth-dnd';
import { useStore } from 'vuex';

const store = useStore();
const userData = computed(() => store.state.userData)
const strLogoUrl = computed(() => userData.value.strLogoUrl)
const groupCd = ref(userData.value.lngStoreGroup);
const activeMain = ref([]);
const activeSub = ref([]);
const loadingbar = ref(store.state.loading);
const toggleMain = (index) => {
  activeMain.value[index] = !activeMain.value[index];
}
const toggleSub = (index) => {
  activeSub.value[index] = !activeSub.value[index]
}


const items = ref([]);
const addMenu = (menuCd, menuNm, majorGroupNm ,subGroupNm) => {
   
   
    const nextid = items.value.length >0 ? items.value.reduce((max,item) =>{
      return item.intKeySeq > max ? Number(item.intKeySeq) : Number(max);
    },items.value[0].intKeySeq) +1 : 1 ;

    let additem = {intKeySeq :nextid , strKeyName:menuNm ,lngKeyscrNo:menuCd , majorName:majorGroupNm ,subName:subGroupNm ,imgurl : strLogoUrl };
    items.value.push(additem);

}
const onDrop = (dropResult) => {
  const { removedIndex, addedIndex } = dropResult;

  console.log(removedIndex);
  console.log(addedIndex);

  // 1부터 시작하는 인덱스를 0으로 조정
  const realRemovedIndex = removedIndex - 1; 
  const realAddedIndex = addedIndex - 1; 

  // items 배열 복사
  const updatedItems = ref([...items.value]);

  // removedIndex의 아이템 가져오기
  const [removedItem] = updatedItems.value.splice(realRemovedIndex, 1); // 항목 제거

  // addedIndex에 아이템 추가
  updatedItems.value.splice(realAddedIndex, 0, removedItem); // 새 위치에 추가

  // items.value에 업데이트된 배열 반영
  updatedItems.value = updatedItems.value.map((item, index) => ({
  ...item,
  intKeySeq: index + 1, // 배열 순서대로 intKeySeq 설정
  }));

  items.value = updatedItems.value;
 
};

const currstoreCd = ref('0');
const currAreaCd = ref('0');
const currmainCateCd = ref('0');
const currsubCateCd = ref('0');
const ischange = ref(false);
const ischanged = (value) => {
  ischange.value = value;
}
const handleStoreAreaCd = (value) => {
  
  currAreaCd.value = value == '' ? '1000001' : value.toString();

}
const handleStoreCd = (value) => {
   currAreaCd.value = '';
   currstoreCd.value = value;
}

const emitsubcate = (value) => {
  currsubCateCd.value = value;
}
const emitmaincate = (value) => {
  
  currmainCateCd.value = value;
}

const majorGroup = ref([]);
const deleteAllitems = ref([]);
const searchPosMenu = async() => {
    if(currstoreCd.value =='0' || currAreaCd.value =='0'){
      Swal.fire({
        title: 'Error',
        text: '매장을 선택하세요.',
        icon: 'error',
        confirmButtonText: '확인'
      })

      return ; 
    }
    console.log(currmainCateCd.value)
    console.log(currsubCateCd.value)
    if(currmainCateCd.value =='0' || currsubCateCd.value =='0'){
      Swal.fire({
        title: 'Error',
        text: '카테고리를 선택하세요.',
        icon: 'error',
        confirmButtonText: '확인'
      })

      return ; 
    }
    items.value = [];
    const res = await tablePosMenu({
        GROUP_CD : groupCd.value,
        STORE_CD : currstoreCd.value,
    })
    majorGroup.value = res.data.majorGroup

    const res2 = await tablePosMenuKey({
    GROUP_CD: groupCd.value,
    STORE_CD: currstoreCd.value,
    AREA_CD: currAreaCd.value,
    MAJOR_CD: currmainCateCd.value,
    SUB_CD: currsubCateCd.value
})

  console.log(res2)
    items.value = res2.data.menuKeyList.filter(item => item);
     if(items.value[0] == undefined){
        items.value = [];
     } 
     deleteAllitems.value = res2.data.menuKeyList.map(item => item.intKeySeq);
     console.log(deleteAllitems);
}
const deleteitems = ref([]);
const deleteitem =(value, value2) => {
  deleteitems.value.push(value2);
  items.value = items.value.filter(item => !(item.lngKeyscrNo === value && item.intKeySeq === value2));
}
const savePosMenu = async() => {
      store.state.loading = true;
      try {
        const res = await deletetablePosMenuKey({
         GROUP_CD: groupCd.value,
         STORE_CD:  currstoreCd.value,
         AREA_CD : currAreaCd.value,
         SUB_CD  : currsubCateCd.value,
         KEY_SEQ : deleteAllitems.value.join(',')
      })

      const MenuCds = items.value.map(item => item.lngKeyscrNo);
      const MenuNm = items.value.map(item => item.strKeyName);
      const res2 = await savetablePosMenuKey({
        GROUP_CD:  groupCd.value,
        STORE_CD: currstoreCd.value,
        AREA_CD : currAreaCd.value,
        SUB_CD  : currsubCateCd.value,
        MENU_CD : MenuCds.join(','),
        MENU_NM : MenuNm.join(',')
      })
      } catch (error) {
        
      } finally {
        store.state.loading = false;
        searchPosMenu()
      }
     
     

}

</script>
