<template>
    <div v-if="isVisible" class="fixed flex top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 justify-center items-center">
      <div class=" bg-white w-[30%] h-[80%] shadow-lg rounded-lg flex flex-col">
        <header class="popup-header flex justify-between pl-5 pt-5">
            <h1 class="font-bold text-2xl">메뉴키 복사</h1>
            <button class="border border-gray-300 button primary rounded-md mr-12" @click="dupliStore">복사</button>
        </header>
        <main class="popup-body flex-grow">
          <div class="flex justify-start font-bold text-xl ml-12">기준매장</div>
          <div class="grid grid-rows-2 grid-cols-[1fr,4fr] border-[1px] border-gray-400 w-[480px] ml-12 h-20 rounded-lg ">
            <div class="border-[1px] border-gray-400 rounded-tl-md flex justify-center items-center">기준매장</div>
            <div class="w-full border border-gray-400 rounded-tr-md flex justify-center items-center"><input type="text" class="w-[90%] h-[90%] border-[1px] border-gray-400 rounded-md" :value="'['+storeCd+']' + storeNm" disabled></div>
            <div class="border-[1px] border-gray-400 rounded-bl-md flex justify-center items-center">POS번호</div>
            <div class="w-full border border-gray-400 rounded-br-md flex justify-center items-center"><input type="text" class="w-[90%] h-[90%] border-[1px] border-gray-400 rounded-md" :value="posNo" disabled></div>
          </div>
          <div class="flex justify-center mt-10"><img src="../assets/masterCopy-ArrowDown.png" alt=""></div>
          <div class="flex justify-between font-bold text-xl ml-12"><div>대상 매장 선택</div><div><button class="whitebutton mr-12" @click="showStoreList">조회</button></div></div>
          <div class="grid grid-cols-[1fr,4fr] border-[1px] border-gray-400 w-[480px] ml-12 h-10 mt-5 rounded-lg ">
            <div class="border-[1px] border-gray-400 rounded-tl-md flex justify-center items-center">매장코드/명</div>
            <div class="w-full border border-gray-400 rounded-tr-md flex justify-center items-center"><input type="text" class="w-[90%] h-[90%] border-[1px] border-gray-400 rounded-md"  @input="handleKeyup"></div></div>
        <div class="w-[480px] h-[380px] ml-12 flex justify-center"><realgrid :progname="'MST01_011INS_VUE'" :progid="1" :rowData="rowData" :showGrid="showGrid" :showCheckBar="true"  @selcetedrowData="selcetedrowData"></realgrid></div>
        </main>
        <footer class="flex justify-end p-5 mt-auto">
         <div class="border border-gray-300 rounded-md w-20 h-10 mr-7"><button @click="close" class="w-full h-full">닫기</button></div>
        </footer>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from "vue";
  import style from "../customStyle/style.css"
import realgrid from "./realgrid.vue";
import { DELETEALLPOSINFO, DUPLIALLPOSDATA, getStoreAndPosList } from "@/api/common";
import { useStore } from "vuex";
import Swal from "sweetalert2";
  const {isVisible ,storeCd,storeNm,posNo,areaCd} = defineProps({
    isVisible: { type: Boolean, default: false }, // 팝업 가시성 관리
    storeCd : { type : String , default: ''} ,
    storeNm : { type : String , default: ''} ,
    posNo : { type : Number , default: ''} ,
    areaCd : {type : Number , default : ''}
  });
  const store = useStore();  // vuex store
  const userData = store.state.userData; 
  const groupCd = ref(userData.lngStoreGroup)
  const searchWord = ref('')

  const emit = defineEmits(["close"]);
  
  function close() {
    rowData.value = []
    emit("close");
  }
 const rowData = ref([]);
 const showGrid = ref(false)
  const showStoreList = async() => {
   let res;
      try {
         res = await getStoreAndPosList(groupCd.value , storeCd )
      } catch (error) {
        console.log(error)
      } finally {
        showGrid.value = !showGrid.value
       if(searchWord.value ==''){
        rowData.value = res.data.storepos
       } else {
        rowData.value = res.data.storepos.filter(item => item.strName.includes(searchWord.value) ||  item.lngStoreCode.toString().includes(searchWord.value))
       }
       
        console.log(rowData.value)
      }
        
    
    
  }
const selectedRows = ref([])
  const selcetedrowData = (newData) => {
    selectedRows.value = newData;
    console.log(selectedRows.value)
  }



const handleKeyup = (e) => {
  searchWord.value = e.target.value
}
const handleKeyup2 = (e) => {
  
}

const dupliStore = async() => {
  let groupCd2 = [];
  let storeCd2 = [];
  let areaCd2 = [];
  let posNo2 = [];
  for(var i =0; i< selectedRows.value.length ; i++){
    groupCd2.push(groupCd.value)
    storeCd2.push(selectedRows.value[i][0])
    areaCd2.push(selectedRows.value[i][3])
    posNo2.push(selectedRows.value[i][2])

  }
  try {
    store.state.loading = true;
    console.log(groupCd2.join(','))
    console.log(storeCd2.join(','))
    console.log(areaCd2.join(','))
    console.log(posNo2.join(','))
    console.log(groupCd.value )
    console.log(storeCd)
    console.log(areaCd)
    const res = await DELETEALLPOSINFO(groupCd2.join(','), storeCd2.join(',') , areaCd2.join(',') ,posNo2.join(',') )
    const res2 = await DUPLIALLPOSDATA(groupCd.value , storeCd,areaCd ,posNo , groupCd2.join(','),storeCd2.join(','),areaCd2.join(','),posNo2.join(','))

    console.log(res)
    console.log(res2)
    
  } catch (error) {
    
  } finally {
    store.state.loading = false
    Swal.fire({
      title: '복사 성공',
      text: '복사가 완료되었습니다.',
      icon:'success',
      confirmButtonText: '확인'
    }).then((result) => {
      if(result.isConfirmed){
        close()
      }
    })
  }
 
}
  </script>
  
  <style scoped>
  .popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .popup-content {
    background: white;
    padding: 1rem;
    border-radius: 8px;
    width: 300px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  }
  .popup-header {
    font-size: 1.25rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }
  .popup-body {
    margin-bottom: 1rem;
  }
  .popup-footer {
    text-align: right;
  }
  </style>
  