<template>
    <div class="flex justify-start pl-4 pt-4">
        <div class="flex justify-start"><h1 class="font-bold text-2xl">
            메뉴 배치 관리
        </h1></div>
        <div class="absolute right-48 space-x-3 flex"><button class="button search">조회</button><button class="button save">저장</button></div>
    </div>
    <br>
    <div class="bg-gray-200 h-24 flex flex-col items-start rounded-md pt-2">
    <PickStore4></PickStore4>
    <PickCategory></PickCategory>
</div>
<div class="border border-black w-60 h-96 ml-10 mt-10 overflow-auto flex flex-col">
        <div><button>대카테고리</button></div>
        <div><button>소카테고리</button></div>
</div>
<div class="border w-4/6 ml-96 h-auto -mt-96">

    <Container :onDrop="onDrop">
      <div class="grid grid-cols-8 bg-gray-300 h-14 space-x-5 items-center justify-between font-bold">
        <div>순서</div> <div>번호</div><div>이미지</div><div>상품코드</div><div>상품명</div><div>대카테고리</div><div>중카테고리</div><div>삭제</div>
      </div>
      <Draggable v-for="item in items" :key="item.id">
        <div class="grid grid-cols-8 h-auto">
          <div class="h-16 flex items-center justify-center">{{ item.id }}</div><div class="h-16 flex items-center justify-center">{{ item.name }}</div><div class="h-16 flex items-center justify-center"><img :src="item.imgurl" alt="" class="size-8"></div><div class="h-16 flex items-center justify-center">{{ item.name }}</div>
          <div class="h-16 flex items-center justify-center">{{ item.name }}</div><div class="h-16 flex items-center justify-center">{{ item.name}}</div><div class="h-16 flex items-center justify-center">{{ item.name}}</div><div class="h-16 flex items-center justify-center">{{ item.name}}</div>
        </div>
      </Draggable>
    </Container>
  </div>
</template>

<script setup>
import PickCategory from '@/components/pickCategory.vue';
import PickStore4 from '@/components/pickStore4.vue';
import { computed, ref } from 'vue';

import { Container, Draggable } from 'vue3-smooth-dnd';
import { useStore } from 'vuex';

const store = useStore();
const userData = computed(() => store.state.userData)
const strLogoUrl = computed(() => userData.value.strLogoUrl)


const items = ref([
  { id: 1, name: 'First Item' , imgurl : strLogoUrl },
  { id: 2, name: 'Second Item', imgurl : strLogoUrl },
  { id: 3, name: 'Third Item', imgurl : strLogoUrl },
  { id: 4, name: 'Third Item', imgurl : strLogoUrl },
  { id: 7, name: 'Third Item', imgurl : strLogoUrl },
]);

const onDrop = (dropResult) => {
  const { removedIndex, addedIndex } = dropResult;

  console.log(removedIndex);
  console.log(addedIndex);

  // 1부터 시작하는 인덱스를 0으로 조정
  const realRemovedIndex = removedIndex - 1; 
  const realAddedIndex = addedIndex - 1; 

  // items 배열 복사
  const updatedItems = [...items.value];

  // removedIndex의 아이템 가져오기
  const [removedItem] = updatedItems.splice(realRemovedIndex, 1); // 항목 제거

  // addedIndex에 아이템 추가
  updatedItems.splice(realAddedIndex, 0, removedItem); // 새 위치에 추가

  // items.value에 업데이트된 배열 반영
  items.value = updatedItems;
};



</script>
