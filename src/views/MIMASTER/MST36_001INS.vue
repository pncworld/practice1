<template>
   
        <div class="flex justify-between items-center w-full overflow-y-auto">
    <div class="flex justify-start  w-full pl-12 pt-4">
               <div class="flex justify-start"><h1 class="font-bold text-sm md:text-2xl w-full">
                결제 코드 등록.
               </h1></div>
                
               </div>
               <div class="flex justify-center mr-9 space-x-2 pr-5"><button @click="searchButton" class="button search md:w-auto w-14">조회</button>
              
              <button @click="saveButton" class="button save w-auto">저장</button>
              
            </div>
            </div>
            <br>
            <div class="flex justify-start  space-x-5 bg-gray-200 rounded-lg md:h-16 h-24 items-center"><PickStore3  @update:storeCd="handleStoreCd"  @storeNm="handlestoreNm" @update:ischanged="handleinitAll" @update:ischanged2="searchinit" ></PickStore3> </div> 
  <div class="z-50">
      <DupliPopUp :isVisible="showPopup2" @close="showPopup2 = false" :storeCd="nowStoreCd" :poskiosk="'getStoreAndPosList'" :storeNm="clickedStoreNm" :areaCd="nowStoreAreaCd" :posNo="posNo" :screenType="currentpaymentCd" :screenList="screenList" :progname="'MST01_011INS_VUE'" :dupliapiname="'DUPLIFUNCKEY'" :progid="1" :naming="'POS번호'" :naming2="'기능키'">
      </DupliPopUp>
    </div>
  


</template>

<script setup>
import DupliPopUp from '@/components/dupliPopUp.vue';
import PickStore3 from '@/components/pickStore3.vue';
import Swal from 'sweetalert2';
import { ref } from 'vue';
import { useStore } from 'vuex';

const nowStoreAreaCd = ref();
const nowStoreCd = ref();
const posNo = ref();
const searchword1 = ref('');
const MenuGroup = ref('');
const SubMenuGroup = ref('');
const items = ref('');
const forsearchMain = ref('');
const forsearchSub = ref('');
const afterSearch = ref(false);
const clickedStoreNm = ref()
const store = useStore();
const userData = store.state.userData; 
const groupCd = ref(userData.lngStoreGroup);
 
  

  const  handleStoreCd = async(newValue) => {
    if(newValue == '0'){
    afterSearch.value = false;
    }
    nowStoreCd.value = newValue ;
    searchButton()
}

  const handlestoreNm = (newData) => {
    clickedStoreNm.value = newData
  }

  const searchinit = (newvalue) => {
      afterSearch.value = false
  } 

  const handleinitAll = (newvalue) => {

      MenuGroup.value =[]
      SubMenuGroup.value=[]
      items.value = []
      forsearchMain.value ='0'
      forsearchSub.value ='0'
      afterSearch.value = false
      searchword1.value =''
      afterSearch.value = false
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
//   if(nowStoreAreaCd.value == '0' || nowStoreAreaCd.value == undefined) {
//       Swal.fire({
//           title: '경고',
//           text: 'POS번호를 선택하세요.',
//           icon: 'warning',
//           showCancelButton: false,
//           confirmButtonColor: '#3085d6',
//           allowOutsideClick: false
//       })
//       return;
//   }
  store.state.loading = true;
  try {
    console.log(groupCd.value)
    console.log(nowStoreCd.value)
    console.log(clickedStoreNm.value)
      


     
   
  } catch (error) {
      afterSearch.value = false;
  } finally {
      
      store.state.loading = false; // 로딩 상태 종료

               afterSearch.value = true;
  }
  

  
  };
</script>

<style lang="scss" scoped>

</style>