<template>
    <div v-if="isVisible" class="fixed flex top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 justify-center items-center">
      <div class=" bg-white w-[30%] h-[80%] shadow-lg rounded-lg flex flex-col">
        <header class="popup-header flex justify-between pl-5 pt-5">
            <h1 class="font-bold text-2xl">메뉴키화면키 복사</h1>
            <button class="border border-gray-300 button primary rounded-md mr-12" @click="dupliStore">복사</button>
        </header>
        <main class="popup-body flex-grow">
          <div class="flex justify-start font-bold text-xl ml-12">기준매장</div>
          <div class="grid grid-rows-3 grid-cols-[1fr,4fr] border-[1px] border-gray-400 w-[480px] ml-12 h-32 rounded-lg ">
            <div class="border-[1px] border-gray-400 rounded-tl-md flex justify-center items-center">기준매장</div>
            <div class="w-full border border-gray-400 rounded-tr-md flex justify-center items-center"><input type="text" class="w-[90%] h-[90%] border-[1px] border-gray-400 rounded-md pl-1" :value="'['+storeCd+']' + storeNm" disabled></div>
            <div class="border-[1px] border-gray-400 rounded-bl-md flex justify-center items-center">POS번호</div>
            <div class="w-full border border-gray-400 rounded-br-md flex justify-center items-center"><input type="text" class="w-[90%] h-[90%] border-[1px] border-gray-400 rounded-md pl-1" :value="posNo" disabled></div>
            <div class="border-[1px] border-gray-400 rounded-bl-md flex justify-center items-center">원본화면</div>
            <div class="w-full border border-gray-400 rounded-br-md flex justify-center items-center"><input type="text" class="w-[90%] h-[90%] border-[1px] border-gray-400 rounded-md pl-1" :value="'화면'+nowscreenNo" disabled></div>
             </div>
          <div class="flex justify-center mt-5"><img src="../assets/masterCopy-ArrowDown.png" alt=""></div>
          <div class="flex justify-between font-bold text-xl ml-12"><div>대상 매장 선택</div><div><button class="whitebutton mr-12" @click="showStoreList">조회</button></div></div>
          <div class="grid grid-cols-[1fr,4fr] border-[1px] border-gray-400 w-[480px] ml-12 h-20 mt-5 rounded-lg ">
            <div class="border-[1px] border-gray-400 rounded-tl-md flex justify-center items-center">복사대상화면번호</div>
            <div class="w-full border border-gray-400 rounded-tr-md flex justify-center items-center"><select type="text" class="w-[90%] h-[90%] border-[1px] border-gray-400 rounded-md"  v-model="targetScreenNo">
              <option value="0">선택</option>
              <option value="1">화면1</option>
<option value="2">화면2</option>
<option value="3">화면3</option>
<option value="4">화면4</option>
<option value="5">화면5</option>
<option value="6">화면6</option>
<option value="7">화면7</option>
<option value="8">화면8</option>
<option value="9">화면9</option>
<option value="10">화면10</option>
<option value="11">화면11</option>
<option value="12">화면12</option>
<option value="13">화면13</option>
<option value="14">화면14</option>
<option value="15">화면15</option>
<option value="16">화면16</option>
<option value="17">화면17</option>
<option value="18">화면18</option>
<option value="19">화면19</option>
<option value="20">화면20</option>

            </select></div>
      
            <div class="border-[1px] border-gray-400 rounded-tl-md flex justify-center items-center">매장코드/명</div>
            <div class="w-full border border-gray-400 rounded-tr-md flex justify-center items-center"><input type="text" class="w-[90%] h-[90%] border-[1px] border-gray-400 rounded-md"  @input="handleKeyup"></div></div>
        <div class="w-[480px] h-[380px] ml-12 flex justify-center"><realgrid :progname="progname" :progid="progid" :rowData="rowData" :showGrid="showGrid" :showCheckBar="true"  @selcetedrowData="selcetedrowData"></realgrid></div>
        </main>
        <footer class="flex justify-end p-5 mt-1">
         <div class="border border-gray-300 rounded-md w-20 h-10 mr-7 -mt-8"><button @click="close" class="w-full h-full">닫기</button></div>
        </footer>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from "vue";
  import style from "../customStyle/style.css"
import realgrid from "./realgrid.vue";
import * as api from "@/api/common";
import * as api2 from "@/api/master";
import { useStore } from "vuex";
import Swal from "sweetalert2";
  const {isVisible ,storeCd,storeNm,posNo,areaCd , progname , progid ,dupliapiname ,nowscreenNo} = defineProps({
    isVisible: { type: Boolean, default: false }, // 팝업 가시성 관리
    storeCd : { type : String , default: ''} ,
    storeNm : { type : String , default: ''} ,
    posNo : { type : Number , default: ''} ,
    areaCd : {type : Number , default : ''},
    progname : {type: String },
    progid : {type : Number},
    dupliapiname : {type : String},
    nowscreenNo : {type : Number}
  });
  const store = useStore();  // vuex store
  const userData = store.state.userData; 
  const groupCd = ref(userData.lngStoreGroup)
  const searchWord = ref('')
  const targetScreenNo = ref('0')
  const checked =ref(false)
  const emit = defineEmits(["close"]);
  
  function close() {
    rowData.value = []
    emit("close");
  }
 const rowData = ref([]);
 const showGrid = ref(false)

  const showStoreList = async() => {
   let res;
   console.log(progname)
   console.log(progid)
      try {
         res = await api.getStoreAndPosList(groupCd.value , storeCd  ,posNo)
      } catch (error) {
        console.log(error)
      } finally {
        showGrid.value = true
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
    if (newData.length >0) {
      checked.value = true
    } else {
      checked.value = false
    }
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
    if(targetScreenNo.value =='0'){
      Swal.fire({
        title: '경고',
        text: '복사할 화면번호가 없습니다.',
        icon: 'warning',
        confirmButtonText: '확인'
      })
      return ;
    } 
    if(checked.value == false){
      Swal.fire({
        title: '경고',
        text: '복사할 대상이 없습니다.',
        icon: 'warning',
        confirmButtonText: '확인'
      })
      return;
    } else {
    Swal.fire({
      title: '확인',
      text: '선택하신 POS의 메뉴배치정보 및 화면정보가 모두 삭제 후 복사됩니다. 계속 진행하시겠습니다?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: '복사',
      cancelButtonText: '취소'
    }).then(async(result) => {
      if (result.isConfirmed) {
        store.state.loading = true;
       const res3 = await api2[dupliapiname](groupCd.value , storeCd,areaCd ,posNo , groupCd2.join(','),storeCd2.join(','),areaCd2.join(','),posNo2.join(','), nowscreenNo ,  targetScreenNo.value)
       console.log(res3)
      if(res3.data.RESULT_CD == '00'){
        store.state.loading = false;
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
        } else {
          store.state.loading = false;
        }
      }
       else {
        return ;
       }
    })
   

   
  }
  } catch (error) {
    
  } finally {
    store.state.loading = false
   
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
  