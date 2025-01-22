<template>
   
        <div class="flex justify-between items-center w-full overflow-y-auto">
    <div class="flex justify-start  w-full pl-12 pt-4">
               <div class="flex justify-start"><h1 class="font-bold text-sm md:text-2xl w-full">
                결제 코드 등록.
               </h1></div>
                
               </div>
               <div class="flex justify-center mr-9 space-x-2 pr-5">
                
            <button @click="searchButton" class="button search md:w-auto w-14">조회</button>
            <button @click="saveButton" class="button save w-auto">저장</button>
              
            </div>
            </div>
            <br>
            <div class="flex justify-start  space-x-5 bg-gray-200 rounded-lg md:h-16 h-24 items-center">
              <PickStore12  @update:storeCd="handleStoreCd"  @storeNm="handlestoreNm" @update:ischanged="handleinitAll" @update:ischanged2="searchinit" ></PickStore12> </div> 
   <div class="grid grid-rows-1 grid-cols-[4fr,5fr] h-[86%] w-full">
            <div class="flex flex-col w-full h-full">
  <div class="flex justify-between mt-5 ml-10 w-full border-b border-b-gray-300">
    <div class="flex justify-start font-bold text-xl">결제코드 목록</div>
    <div class="mt-3 space-x-2">
      <button class="whitebutton" @click="addRow">추가</button>
      <button class="whitebutton" @click="deleteRow">삭제</button>
    </div>
  </div>

  <div class="mt-3 ml-10 grid grid-cols-[1fr,3fr] grid-rows-2 gap-0 w-full">
   
    <div class="customtableIndex border border-gray-400 rounded-tl-lg">사용여부</div>
    <div class="grid grid-rows-1 grid-cols-3 justify-center items-center ">
      <div class="border border-gray-400 h-full">
        <select name="blnInactive" id="" class="flex-1 border rounded-lg w-full h-full pl-1" @change="searchColumn" v-model="searchC1">
        <option value="-1">전체</option>
        <option value="1">사용</option>
        <option value="0">미사용</option>
      </select>
      </div>
      <div class="customtableIndex border border-gray-400 ">
        결제구분
      </div>
      <div class="border border-gray-400 h-full rounded-tr-lg">
        <select name="payDistinct" id="" class="flex-1 border rounded-lg w-full h-full pl-1" @change="searchColumn" v-model="searchC2" >
        <option value="-1">전체</option>
        <option value="1">할인</option>
        <option value="2">지불</option>
        <option value="3">할증</option>
      </select>
      </div>
    </div>

    <div class="customtableIndex border border-gray-400 rounded-bl-lg ">결제코드/명</div>
    <div class="px-1 py-1 border border-gray-300 rounded-br-lg "><input type="text" class="border w-full h-full px-1 border-gray-400 rounded-lg" @input="searchword" v-model="searchWord"></div>
  </div>
    <div class="ml-10 mt-1 w-full h-full">
  
      <Realgrid class="w-full h-full" :progname="'MST36_001INS_VUE'" :progid="1" :rowData="rowData" :showGrid="showGrid" :showCheckBar="false" @clickedRowData="clickedRowData" :selectionStyle="'singleRow'"  @selcetedrowData="selcetedrowData"  :labelsData="labelsData" :valuesData="valuesData" :labelingColumns="labelingColumns" :searchWord="searchWord" :searchColId2="'blnInactive,payDistinct'" :searchColId="'lngCode,strName'" :searchColValue2="searchColValue2" :defaultSearchAllValue="-1" :changeNow="changeNow" :changeValue2="changeValue2" :changeColid="changeColid" :changeRow="changeRow" @selectedIndex="selectedIndex" :initSelect="true" :addRow4="addRow4" :deleteRow2="deleteRow3" :addrowDefault="addrowDefault" :addrowProp="addrowProp" @updatedRowData="updatedRowData" :rowStateeditable="false" :addField="'new'"></Realgrid>

    </div>
    

  
  
  </div>
   <div class="grid grid-cols-1 grid-rows-[1fr,9fr] ml-20">
    <div class="flex space-x-1 mt-10">
      <button class="bg-gray-100 h-12 rounded-t-lg font-bold p-2 border" @click="selectMenu(1)" :class="{'text-blue-400 bg-blue-100': selectedMenu==1}">기본설정</button>
      <button class="bg-gray-100 h-12 rounded-t-lg font-bold p-2 border" @click="selectMenu(2)" :class="{'text-blue-400 bg-blue-100': selectedMenu==2}" :disabled="selectedPayDistinct">할인대상메뉴</button>
      <button class="bg-gray-100 h-12 rounded-t-lg font-bold p-2 border" @click="selectMenu(3)" :class="{'text-blue-400 bg-blue-100': selectedMenu==3}" :disabled="selectedMultiple">복합결제허용</button>
    </div>
    <div>
      <hr class="w-[90%] mt-0">
      <div v-show="selectedMenu==1" class="mt-3 h-[46%]">
          <div class="font-bold flex justify-start text-xl">기본정보</div>
         <div class="grid grid-cols-[1fr,3fr,1fr,3fr] grid-rows-[1fr,2fr,1fr] mt-5 border rounded-lg w-[90%] h-[55%]">
          <div class="flex justify-center items-center bg-gray-100 border">결제구분</div>
          <div class="flex justify-center items-center border"><select name="" id="" class="border h-full w-full rounded-lg pl-2 disabled:bg-gray-200" v-model="gridvalue1" disabled>
      <option value="0">선택</option>
      <option value="1">할인</option>
      <option value="2">지불</option>
      <option value="3">할증</option>
  
    </select></div>
          <div class="flex justify-center items-center bg-gray-100 border">결제유형</div>
          <div class="flex justify-center items-center border"><select name="" id="" class="border h-full w-full rounded-lg pl-2 disabled:bg-gray-200" disabled>
       
  
    </select></div>
          
          <div class=" justify-center items-center bg-gray-100 border grid"><div>결제코드명</div></div>
           <div class="grid grid-cols-1 grid-rows-2 h-full border"><div class="flex items-center mt-1 text-blue-400 font-semibold">*국문<input type="text" name="strName" id="" class="h-full w-[80%] border rounded-lg pl-2 ml-2 font-thin text-gray-700" v-model="gridvalue3" @input="changeInfo"></div><div class="flex items-center mt-1 ml-1"> 영문<input type="text" name="strNameE" id="" class="h-full w-[80%] border rounded-lg pl-2 ml-3" v-model="gridvalue4" @input="changeInfo"></div></div>
          <div class=" justify-center items-center bg-gray-100 border flex flex-col "><div class="border h-full w-full flex items-center justify-center text-blue-400 font-semibold">*결제코드</div><div class="border h-full w-full flex items-center justify-center text-blue-400 font-semibold">*사용여부</div></div>
          <div class="grid grid-cols-1 grid-rows-2 "> <div><input type="text" name="lngCode" id="" class="h-full w-full border rounded-lg pl-2 disabled:bg-gray-200" v-model="gridvalue5" @input="changeInfo" :disabled="isNew"></div><div class="space-x-5 border flex justify-left pl-2 items-center"><label for="using1"><input type="radio" name="blnInactive" id="using1" v-model="gridvalue6" value="0" @input="changeInfo">예</label><label for="using2"><input type="radio" name="blnInactive" id="using2" v-model="gridvalue6" value="1"  @input="changeInfo" >아니오</label></div></div>
          <div class="flex justify-center items-center bg-gray-100 border">할인그룹</div>
          <div class="flex justify-center items-center border"><select name="" id="" class="border h-full w-full rounded-lg pl-2 bg-gray-200" v-model="gridvalue2" disabled>
            <option value="">선택</option>
            <option :value="i.lngValue" v-for="i in disCountGroup">[{{ i.lngCode }}]{{i.strName}}</option>
  
    </select></div>
          <!-- <div class="flex justify-center items-center bg-gray-100 border">결제그룹</div>
          <div class="flex justify-center items-center"><select name="" id="" class="border h-full w-full rounded-lg pl-2 disabled:bg-gray-200" disabled>
      <option value="">선택</option>
  
    </select></div> -->
          
          <div class=" justify-center items-center bg-gray-100 border grid">유효기간</div>
          <div class="flex justify-center items-center border"><input type="date" max="9999-12-31" v-model="gridvalue7" name="dtmFromDate" @input="changeInfo"> ~ <input type="date" max="9999-12-31" v-model="gridvalue8" name="dtmToDate" @input="changeInfo"></div>
         
          <!-- <div class="justify-center items-center bg-gray-100 border flex text-blue-400 font-semibold">*승인구분</div>
          <div><select name="" id="" v-model="gridvalue9" class="h-full w-full rounded-lg pl-2" @change="setSub">
            <option value="">선택</option>
            <option :value="i.strDCode1" v-for="i in approveType">[{{ i.strDCode1 }}]{{i.strDName1}}</option>
          </select></div> -->
          <!-- <div class="justify-center items-center bg-gray-100 border flex text-blue-400 font-semibold">*승인유형</div>
          <div><select name="" id="" v-model="gridvalue10" class="h-full w-full rounded-lg pl-2">
            <option value="">선택</option>
            <option :value="i.strDCode2" v-for="i in filteredapproveType">[{{ i.strDCode2 }}]{{i.strDName2}}</option>
          </select></div> -->
         </div>
         <div class="font-bold text-xl flex justify-start mt-5">부가정보</div>
         <div class="grid grid-cols-[1fr,3fr,1fr,3fr] grid-rows-8 h-full mt-3 w-[90%]">
          <div class="justify-center items-center bg-gray-100 border flex rounded-tl-lg">할인방법</div>
    <div class="space-x-5 flex  items-center border justify-left pl-2"><label for="discount1"><input type="radio" id="discount1" name="lngRate" v-model="gridvalue11" value="0" @input="changeInfo">금액</label><label for="discount2"><input type="radio" id="discount2" name="lngRate" v-model="gridvalue11" value="1" @input="changeInfo">비율</label> </div>
    <div class="justify-center items-center bg-gray-100 border flex">할인금액(비율)</div>
    <div class="flex justify-center items-center"><input type="text" name="lngAmt" id="" class="h-full w-full border rounded-lg pl-2" v-model="gridvalue12" @input="changeInfo"></div>
    <div class="justify-center items-center bg-gray-100 border flex">자동계산</div>
    <div class="space-x-5 flex  items-center border justify-left pl-2"><label for="autopay1"><input type="radio" id="autopay1" name="blnAuto" v-model="gridvalue13" value="1" @input="changeInfo">예</label><label for="autopay2"><input type="radio" id="autopay2" name="blnAuto" v-model="gridvalue13" value="0" @input="changeInfo">아니오</label></div>
    <div class="justify-center items-center bg-gray-100 border flex">할인한도금액</div>
    <div class="flex justify-center items-center"><input type="text" name="lngDiscAmtLimit" id="" class="h-full w-full border rounded-lg pl-2" v-model="gridvalue14" @input="changeInfo"></div>
    <div class="justify-center items-center bg-gray-100 border flex">돈통오픈</div>
    <div class="space-x-5 flex justify-left pl-2 items-center border"><label for="openmoney1"><input type="radio" id="openmoney1" name="blnDrawer" v-model="gridvalue15" value="0" @input="changeInfo">예</label><label for="openmoney2"><input type="radio" id="openmoney2" name="blnDrawer" v-model="gridvalue15" value="1" @input="changeInfo">아니오</label></div>
    <div class="justify-center items-center bg-gray-100 border flex">계산우선순위</div>
    <div class="flex justify-center items-center"><input type="text" name="lngPrior" id="" class="h-full w-full border rounded-lg pl-2" v-model="gridvalue16" @input="changeInfo"></div>
    <div class="justify-center items-center bg-gray-100 border flex">영수증출력</div>
    <div class="space-x-5 flex justify-left pl-2 items-center border"><label for="receipt1"><input type="radio" id="receipt1" name="blnReceipt" v-model="gridvalue17" value="0" @input="changeInfo">예</label><label for="receipt2"><input type="radio" id="receipt2" name="blnReceipt" v-model="gridvalue17"  value="1" @input="changeInfo">아니오</label></div>
    <div class="justify-center items-center bg-gray-100 border flex">잔금반환비율</div>
    <div class="flex justify-center items-center"><input type="text" name="lngChangeRateLimit" id="" class="h-full w-full border rounded-lg pl-2" v-model="gridvalue18" @input="changeInfo"></div>
    <div class="justify-center items-center bg-gray-100 border flex">할인대상메뉴</div>
    <div class="space-x-5 flex justify-left pl-2 items-center border"><label for="discountfor1"><input type="radio" id="discountfor1" name="lngMenu" v-model="gridvalue19" value="0" @input="changeInfo">전체 선택</label><label for="discountfor2"><input type="radio" id="discountfor2" name="lngMenu" v-model="gridvalue19" value="1" @input="changeInfo">부분 선택</label></div>
    <div class="justify-center items-center bg-gray-100 border flex">품목할인설정</div>
    <div class="flex justify-center items-center"><select name="lngDiscType" id="" class="border h-full w-full rounded-lg pl-2" v-model="gridvalue20" @change="changeInfo">
      <option value="">선택</option>
    <option :value="i.strDCode" v-for="i in itemDiscount">[{{ i.strDCode }}]{{i.strDName}}</option>
  
    </select></div>
    <div class="justify-center items-center bg-gray-100 border flex">중복결제</div>
    <div class="space-x-5 flex justify-left pl-2 items-center border"><label for="allow1"><input type="radio" id="allow1" name="blnDuplicate" v-model="gridvalue21" value="1" @input="changeInfo">허용</label><label for="allow2"><input type="radio" id="allow2" name="blnDuplicate"  v-model="gridvalue21"  value="0" @input="changeInfo">비허용</label></div>
    <div class="justify-center items-center bg-gray-100 border flex">크롤링결제코드</div>
    <div class="flex justify-center items-center"><select name="" id="" class="border h-full w-full rounded-lg pl-2 disabled:bg-gray-200" disabled>
      <option value="">선택</option>
  
    </select></div>
    <div class="justify-center items-center bg-gray-100 border flex">단수처리방법</div>
    <div class="flex justify-center items-center"><select name="lngRoundType" id="" class="border h-full w-full rounded-lg pl-2" v-model="gridvalue22" @change="changeInfo">
      <option value="">선택</option>
     <option :value="i.strDCode" v-for="i in rounding">[{{ i.strDCode }}]{{i.strDName}}</option>
    </select></div>
    <div class="justify-center items-center bg-gray-100 border flex">단수처리자릿수</div>
    <div><input type="text" name="lngRound" id="" class="h-full w-full border rounded-lg pl-2" v-model="gridvalue23" @input="changeInfo"></div>
    <div class="justify-center items-center bg-gray-100 border flex rounded-bl-lg">세금계산방법</div>
    <div class="flex justify-center items-center"><select name="lngTax" id="" class="border h-full w-full rounded-lg pl-2" v-model="gridvalue24" @change="changeInfo">
      <option value="">선택</option>
      <option :value="i.strDCode" v-for="i in taxs">[{{ i.strDCode }}]{{i.strDName}}</option>
     
    </select></div>
    <div class="justify-center items-center bg-gray-100 border flex">결제옵션</div>
    <div class="flex justify-center items-center"><select name="strIcon" id="" class="border h-full w-full rounded-lg pl-2" v-model="gridvalue25" @change="changeInfo">
      <option value="">선택</option>
       <option :value="i.strDCode" v-for="i in payOptions">[{{ i.strDCode }}] {{ i.strDName }}</option>
    </select></div>
         </div>
      </div>
      <div v-show="selectedMenu==2" class="h-[80%] w-[90%]" >
       <div class="flex justify-between mt-3 w-full">
        <div class="font-bold text-xl" >메뉴 목록</div><div><button class="whitebutton">할인대상메뉴복사</button></div></div>
       <div class="mt-3  grid grid-cols-[1fr,3fr] grid-rows-2 gap-0 w-full">
  <div class="customtableIndex border border-gray-400 rounded-tl-lg">메뉴분류</div>
  <div class=" border border-gray-300 rounded-tr-lg flex p-1">
    <select name="" id="" class="flex-1 border rounded-lg w-full h-full " @change="setSubCd" v-model="forsearchMain">
      <option value="0">전체</option>
      <option :value="i.GroupCd" v-for="i in MenuGroup"> [{{i.GroupCd}}]{{ i.majorGroupNm }}</option>
    </select>
    <select name="" id="" class="flex-1 border rounded-lg w-full h-full" v-model="forsearchSub" @change="setSubCd2">
      <option value="0">전체</option>
      <option :value="i.GroupCd" v-for="i in filteredSubMenuGroup"> [{{i.GroupCd}}]{{ i.subGroupNm }}</option>
    </select>
  </div>
  <div class="customtableIndex border border-gray-400 rounded-bl-lg">메뉴명/코드</div>
  <div class="px-1 py-1 border border-gray-300 rounded-br-lg "><input type="text" class="border w-full h-full px-1 border-gray-400 rounded-lg" @input="searchMenuList" v-model="searchWord2"></div>
</div>
<Realgrid class="w-full h-full mt-5" :progname="'MST36_001INS_VUE'" :progid="2" :rowData="clickrowData2"  :searchWord="searchWord2" @clickedRowData="clickedRowData2" :searchColId2="'majorGroupCd,subGroupCd'" :searchColId="'menuCd,menuNm'" :searchColValue2="searchColValue3"  :initCheckColumn="initCheckColumn" :initCheckValue="initCheckValue" :initCheckAct="initCheckAct" @checkedRowData="checkedRowData" :initSelect="true" :maintaincheckColumn="'menuCd'" :rowStateeditable="false" :changeNow="changeNow2" :changeValue2="changeValue3" :changeColid="changeColid2" :changeRow="changeRow2" @updatedRowData="updatedRowData2"></Realgrid>
      </div>
<div v-show="selectedMenu==3" class="h-[90%] w-[90%]">
  <div class="grid grid-rows-1 grid-cols-[1fr,4fr] mt-3">
  <div class="customtableIndex border border-gray-400 rounded-lg">결제코드/명</div>
  <div class="px-1 py-1 border border-gray-300 rounded-br-lg "><input type="text" class="border w-full h-full px-1 border-gray-400 rounded-lg" @input="searchMenuList2" v-model="searchWord3"></div></div>
  <Realgrid class="w-full h-full mt-5" :progname="'MST36_001INS_VUE'" :progid="3" :rowData="filteredrowData3"  :setAllCheck2="setAllCheck2" :uncheckColumn="'lngCode'" :uncheckValue="uncheckValue" :uncheckAct="uncheckAct" :searchColValue2="searchColValue2" :searchWord="searchWord3" :searchColId="'lngCode,strName'" :maintaincheckColumn="'lngCode'" @checkedRowData="checkedRowData2" :rowStateeditable="false"></Realgrid>
</div>
    </div>
   </div>
  </div>


</template>

<script setup>
import { getMenuList, getMenuLists, getPayCodeEnrollInfo, savePayCode } from '@/api/master';
import PickStore12 from '@/components/pickStore12.vue';
import Realgrid from '@/components/realgrid.vue';
import Swal from 'sweetalert2';
import { ref, watch } from 'vue';
import { useStore } from 'vuex';

const searchWord2 = ref('');
const nowStoreCd = ref(-1);
const rowData = ref([]);
const addRow4 = ref(false);
const updateRow = ref([])
const deleteRow3 = ref(false);
const searchword1 = ref('');
const MenuGroup = ref('');
const SubMenuGroup = ref('');
const items = ref('');
const selectedPayDistinct = ref(false)
const selectedMultiple = ref(false)
const forsearchMain = ref(0);
const forsearchSub = ref(0);
const afterSearch = ref(false);
const clickedStoreNm = ref()
const store = useStore();
const userData = store.state.userData; 
const groupCd = ref(userData.lngStoreGroup);
 const rowData2 = ref([])
 const clickrowData2 = ref([])
 const rowData3 = ref([])
 const filteredrowData3 = ref([])
 const itemDiscount = ref([])
 const payOptions = ref([])
 const rounding = ref([])
 const taxs = ref([])
 const isNew = ref(true)
const initCheckColumn = ref('menuCd')
const disCountGroup = ref([])
const approveGroup = ref([])
const approveType = ref([])
const filteredapproveType = ref([])
const initCheckValue = ref('')
const initCheckAct = ref(false)
const uncheckValue = ref()
const uncheckAct = ref(false)
const labelsData = ref([['할인','지불','할증'],['사용','미사용']])
const valuesData = ref([['1','2','3'],['0','1']])
const labelingColumns = ref('payDistinct,blnInactive')
const gridvalue1 = ref(0)
const gridvalue2 = ref("")
const gridvalue3 = ref("")
const gridvalue4 = ref("")
const gridvalue5 = ref("")
const gridvalue6 = ref("")
const gridvalue7 = ref("")
const gridvalue8 = ref("")
const gridvalue9 = ref("")
const gridvalue10 = ref("")
const gridvalue11 = ref("")
const gridvalue12 = ref("")
const gridvalue13 = ref("")
const gridvalue14 = ref("")
const gridvalue15 = ref("")
const gridvalue16 = ref("")
const gridvalue17 = ref("")
const gridvalue18 = ref("")
const gridvalue19 = ref("")
const gridvalue20 = ref("")
const gridvalue21 = ref("")
const gridvalue22 = ref("")
const gridvalue23 = ref("")
const gridvalue24 = ref("")
const gridvalue25 = ref("")
const clickedrowdata = ref([])

const clickedRowData = (newvalue) => {
    console.log(newvalue)
    clickedrowdata.value = newvalue[27]
    gridvalue1.value = newvalue[4]
    gridvalue2.value = newvalue[21]
    gridvalue3.value = newvalue[3]
    gridvalue4.value = newvalue[8]
    gridvalue5.value = newvalue[2]
    gridvalue6.value = newvalue[6]
    gridvalue7.value = newvalue[9]
    gridvalue8.value = newvalue[10]
    gridvalue9.value = newvalue[18]
    gridvalue10.value = newvalue[19]
    gridvalue11.value = newvalue[11]
    gridvalue12.value =  newvalue[5] != undefined ?  newvalue[5].substring( 0 , newvalue[5].length -1 ) : ''
    gridvalue13.value =  newvalue[12]
    gridvalue14.value = newvalue[13]
    gridvalue15.value = newvalue[14]
    gridvalue16.value = newvalue[15]
    gridvalue17.value = newvalue[16]
    gridvalue18.value = newvalue[20]
    gridvalue19.value = newvalue[21]
    gridvalue20.value = newvalue[22]
    gridvalue21.value = newvalue[23]
    gridvalue22.value = newvalue[24]
    gridvalue23.value = newvalue[25]
    gridvalue24.value = newvalue[17]
    gridvalue25.value = newvalue[26]
    clickrowData2.value = []
    clickrowData2.value = [...clickrowData2.value]

    if(newvalue[30]== true){
      isNew.value = false
    } else {
      isNew.value = true
    }
    const firstarr =  newvalue[27] != undefined ? newvalue[27].split(',') : []
   if(rowData2.value.length > 0){

    let dupliarr = JSON.parse(JSON.stringify(rowData2.value));
    dupliarr.sort((a, b) => {
      const aIndex = firstarr.indexOf(a.menuCd);
      const bIndex =  firstarr.indexOf(b.menuCd);

  if (aIndex === -1 && bIndex === -1) return 0; // 둘 다 우선순위에 없음
  if (aIndex === -1) return 1; // a가 우선순위에 없음
  if (bIndex === -1) return -1; // b가 우선순위에 없음
  return aIndex - bIndex; // 우선순위 배열에 따라 정렬
});
   if(firstarr.length > 0 && firstarr[0] !==''){
    for(var i=0 ; i < firstarr.length ; i ++){
      const change =  dupliarr.find(item => item.menuCd == firstarr[i])
      change.checkbox = true
    }
   }
  
   
    clickrowData2.value = dupliarr
  }
   
  if(rowData3.value.length >0){

    let multiplearr = rowData3.value.filter(item => item.lngCode != gridvalue5.value).map(item => ({
      ...item ,
      checkbox : true
    }))
    let secondarr = newvalue[28] != undefined ? newvalue[28].split(';') : []
    console.log(secondarr)
    multiplearr.sort((a, b) => {
  const aIndex = secondarr.indexOf(a.lngCode.toString());
  const bIndex = secondarr.indexOf(b.lngCode.toString());

  // 둘 다 secondarr에 포함되지 않으면 순서 유지
  if (aIndex === -1 && bIndex === -1) return 0;

  // a가 secondarr에 없고 b가 있을 경우, a를 뒤로 보냄
  if (aIndex === -1) return -1;

  // b가 secondarr에 없고 a가 있을 경우, b를 뒤로 보냄
  if (bIndex === -1) return 1;

  // 둘 다 secondarr에 있으면, secondarr에 나타나는 순서대로 정렬
  return aIndex - bIndex;
});
if(secondarr.length > 0 && secondarr[0] !=''){
    for(var i=0 ; i < secondarr.length ; i ++){
      console.log(secondarr[i])
      console.log(multiplearr)
      const change =  multiplearr.find(item => item.lngCode.toString() == secondarr[i].toString())
      console.log(change)
      change.checkbox = false
    }
   }


    console.log(multiplearr)
    filteredrowData3.value = [...multiplearr]
  }
  
 
  
}

const selectedIndex = (e) => {
   changeRow.value = e
}
  const  handleStoreCd = async(newValue) => {
    console.log(newValue)
    if(newValue == '-1'){
    afterSearch.value = false;
    return ;
    }
    nowStoreCd.value = newValue ;
    searchButton()
}
const clickmappingData = ref([])
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
     
    if(nowStoreCd.value == -1){
      Swal.fire({
        title: '경고',
        text: '매장을 선택하세요.',
        icon: 'warning',
        confirmButtonText: '확인'
      })
      return ;
    }
  store.state.loading = true;
  try {
    clickrowData2.value = []
     rowData.value = []
     rowData3.value = []
     filteredrowData3.value = []
     rowData.value = [...rowData.value]
     filteredrowData3.value = [...filteredrowData3.value]
     const res = await getPayCodeEnrollInfo(groupCd.value , nowStoreCd.value)

     rowData.value = res.data.PAYCODE
     updateRow.value = JSON.parse(JSON.stringify(rowData.value))
     itemDiscount.value = res.data.ITEMDIS
     payOptions.value = res.data.PAYOPTION
     clickmappingData.value = res.data.MAPPINGCODE
     rowData3.value = res.data.MULTIPLE
     rounding.value = res.data.ROUND
     taxs.value = res.data.TAX
     disCountGroup.value = res.data.DISGROUP
     approveGroup.value = res.data.APPROVE
     const res2 = await getMenuList(groupCd.value , nowStoreCd.value)
     rowData2.value = res2.data.menuList
     SubMenuGroup.value = res2.data.submenuGroup
     MenuGroup.value = res2.data.menuGroup
     console.log(res)
     console.log(res2)
  

  } catch (error) {
      afterSearch.value = false;
  } finally {
 
approveType.value = Array.from(
  new Set(
    approveGroup.value.map(item => JSON.stringify({
      strDCode1: item.strDCode1,
      strDName1: item.strDName1
    }))
  )
).map(item => JSON.parse(item)).sort((a,b) => a.strDCode1-b.strDCode1); // 다시 객체로 변환

      store.state.loading = false; // 로딩 상태 종료
    
       afterSearch.value = true;
  }
  

  
  };

const selectedMenu = ref(1)
  const selectMenu = (newValue) => {
    selectedMenu.value = newValue

  }

  const searchWord =ref("")
  const searchColValue2 = ref("")
  const searchC1 =ref(-1)
  const searchC2 =ref(-1)
  
  const searchColumn = (e) => {
     const columnNm = e.target.name 
     const value = e.target.value 
    
     searchColValue2.value = searchC1.value+","+searchC2.value

     console.log(searchColValue2.value)
  }

  const searchword = (e) => {
    searchWord.value = e.target.value
  }

  const changeInfo = (e) => {
     const tagName = e.target.name;
     const value2 = e.target.value
 
     if(tagName =='lngAmt'){
       if(gridvalue11.value == 0 ){
        changeValue2.value = value2+'원'
        changeColid.value = tagName
       } else if ( gridvalue11.value == 1){
        changeValue2.value = value2+'%'
        changeColid.value = tagName
       }
       changeNow.value = !changeNow.value
       return ;
     }
     changeValue2.value = value2
     changeColid.value = tagName
     changeNow.value = !changeNow.value
  }
const searchColValue3  =ref('0,0')
  const filteredSubMenuGroup = ref([]);
const setSubCd = () => {

  filteredSubMenuGroup.value = SubMenuGroup.value.filter(item => item.sublngMajor == forsearchMain.value)

  forsearchSub.value = '0'

  searchColValue3.value = forsearchMain.value+',0'

   console.log(searchColValue3.value)
 
  // clickrowData2.value = rowData2.value.filter( item => {
  //   if(forsearchMain.value =='0' ){
  //         return item ;
  //       } else if ( forsearchMain.value !='0' && forsearchSub.value !='0' )  {
  //         return  item.majorGroupCd == forsearchMain.value && item.subGroupCd == forsearchSub.value ;
  //       } else if (  forsearchMain.value !='0' && forsearchSub.value =='0') {
  //         return  item.majorGroupCd == forsearchMain.value 
  //       } else {

  //       }
       
  //   })

   

}
const setSubCd2 = () => {
  searchColValue3.value = searchColValue3.value.split(',')[0]+','+forsearchSub.value
}

const searchMenuList = (e) => {
  searchWord2.value = e.target.value
}
const changeColid = ref('checkedMenu')
const changeValue2 = ref('')
const changeRow = ref()
const changeNow = ref(false)

const changeRow2 = ref()
const changeValue3 = ref(true)
const changeColid2 = ref('checkbox')
const changeNow2 = ref(false)
const checkedRowData = (e) => {
    console.log(e)
     changeColid.value = 'checkedMenu'
     const arr = e.map(item => item.menuCd)

  changeValue2.value = arr.join(',')
  changeNow.value = !changeNow.value

}
const checkedRowData2 = (e) => {
  changeColid.value = 'unchecklngCode'
  const arr = e.map(item => Number(item.lngCode))
  console.log(arr)

  const filtered2 = rowData3.value.filter(item => item.lngCode != gridvalue5.value).filter(item => !arr.includes(Number(item.lngCode))).map(item => item.lngCode)

  changeValue2.value = filtered2.join(';')
  changeNow.value = !changeNow.value
}

const setAllCheck2 = ref(false)
const searchWord3 = ref()
const searchMenuList2 = (e) => {
  searchWord3.value = e.target.value
}
const addrowProp = ref()
const addrowDefault = ref()

const addRow = () => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-CA');
  addrowDefault.value = nowStoreCd.value+','+clickedStoreNm.value+ ','+formattedDate+','+'9999-12-31'+','+''+','+''+','+''+','+''
  addrowProp.value = 'lngStoreCode,storeName,dtmFromDate,dtmToDate,lngDiscType,lngRoundType,lngTax,strIcon'
  console.log(addrowProp.value)
  addRow4.value = !addRow4.value
}
const deleteRow = () => {
  deleteRow3.value = !deleteRow3.value
}



watch(gridvalue9 , () => {
  const selectedCode = gridvalue9.value
    if(selectedCode == ''){
      filteredapproveType.value = []
      return ;
    }
    filteredapproveType.value = approveGroup.value.filter(item => item.strDCode1 == selectedCode)
})

const saveButton = () => {
  console.log(updateRow.value)
  if(afterSearch.value == false) {
    Swal.fire({
      title: '경고',
      text: '조회를 먼저 진행해주세요.',
      icon: 'warning',
      confirmButtonText: '확인'
    })
    return ;
  }
  if(JSON.stringify(updateRow.value) === JSON.stringify(rowData.value) ) {
    Swal.fire({
      title: '경고',
      text: '변경된 사항이 없습니다.',
      icon: 'warning',
      confirmButtonText: '확인'
    })
    return ;
  }

   const validateRow = updateRow.value.filter(item =>  item.lngCode == '' || item.lngCode == undefined || item.strName == '' || item.strName == undefined || item.blnInactive == undefined || item.blnInactive == '' ).length
  if(validateRow > 0 ) {
    Swal.fire({
      title: '경고',
      text: '미입력된 필수값이 존재합니다. 확인해주세요.',
      icon: 'warning',
      confirmButtonText: '확인'
    })
    return ;
  }

  const validateRow2 = new Set(updateRow.value.map(item => item.lngCode)).size ==  updateRow.value.map(item => item.lngCode).length

if(validateRow2 == false ) {
    Swal.fire({
      title: '경고',
      text: '중복된 계정코드가 존재합니다. 확인해주세요.',
      icon: 'warning',
      confirmButtonText: '확인'
    })
    return ;
  }

  Swal.fire({
    title: '저장',
      text: '저장 하시겠습니까?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: '저장',
      cancelButtonText: '취소'
}).then(async (result) => {
  if(result.isConfirmed){
    store.state.loading = true;
  try {
    const lngStoreCodearr = updateRow.value.filter(item => item.deleted !== true ).map(item => item.lngStoreCode)
    const strNamearr = updateRow.value.filter(item => item.deleted !== true ).map(item => item.strName)
    const strNameEarr = updateRow.value.filter(item => item.deleted !== true ).map(item => item.strNameE)
    const lngCodearr = updateRow.value.filter(item => item.deleted !== true ).map(item => item.lngCode)
    const blnInactivearr = updateRow.value.filter(item => item.deleted !== true ).map(item => item.blnInactive)
    const dtmFromDatearr = updateRow.value.filter(item => item.deleted !== true ).map(item => item.dtmFromDate)
    const dtmToDatearr = updateRow.value.filter(item => item.deleted !== true ).map(item => item.dtmToDate)
    const lngRatearr = updateRow.value.filter(item => item.deleted !== true ).map(item => item.lngRate)
    const lngAmtarr = updateRow.value.filter(item => item.deleted !== true ).map(item => item.lngAmt != undefined ? item.lngAmt.substring(0,item.lngAmt.length-1) : 0)
    const blnAutoarr = updateRow.value.filter(item => item.deleted !== true ).map(item => item.blnAuto )
    const lngDiscAmtLimitarr = updateRow.value.filter(item => item.deleted !== true ).map(item => item.lngDiscAmtLimit )
    const blnDrawerarr = updateRow.value.filter(item => item.deleted !== true ).map(item => item.blnDrawer )
    const lngPriorarr = updateRow.value.filter(item => item.deleted !== true ).map(item => item.lngPrior )
    const blnReceiptarr = updateRow.value.filter(item => item.deleted !== true ).map(item => item.blnReceipt )
    const lngChangeRateLimitarr = updateRow.value.filter(item => item.deleted !== true ).map(item => item.lngChangeRateLimit )
    const lngMenuarr = updateRow.value.filter(item => item.deleted !== true ).map(item => item.lngMenu )
    const lngDiscTypearr = updateRow.value.filter(item => item.deleted !== true ).map(item => item.lngDiscType )
    const blnDuplicatearr = updateRow.value.filter(item => item.deleted !== true ).map(item => item.blnDuplicate )
    const lngRoundTypearr = updateRow.value.filter(item => item.deleted !== true ).map(item => item.lngRoundType )
    const lngRoundarr = updateRow.value.filter(item => item.deleted !== true ).map(item => item.lngRound )
    const lngTaxarr = updateRow.value.filter(item => item.deleted !== true ).map(item => item.lngTax )
    const strIconarr = updateRow.value.filter(item => item.deleted !== true ).map(item => item.strIcon )
    const checkedMenus = updateRow.value.filter(item => item.deleted !== true ).map(item => item.checkedMenu )
    const unchecklngCodes = updateRow.value.filter(item => item.deleted !== true ).map(item => item.unchecklngCode )
    const deleteCd = updateRow.value.filter(item => item.deleted == true ).map(item => item.lngCode)
    

   const res = await savePayCode( groupCd.value ,
   nowStoreCd.value,
   lngStoreCodearr.join(','),
   strNamearr.join(',') , 
   strNameEarr.join(','),
   lngCodearr.join(','), 
   blnInactivearr.join(','),
   dtmFromDatearr.join(','),
   dtmToDatearr.join(','),
   lngRatearr.join(','),
   lngAmtarr.join(','),
   blnAutoarr.join(','),
   lngDiscAmtLimitarr.join(','),
   blnDrawerarr.join(','),
   lngPriorarr.join(','),
   blnReceiptarr.join(','),
   lngChangeRateLimitarr.join(','),
   lngMenuarr.join(','),
   lngDiscTypearr.join(','),
   blnDuplicatearr.join(','),
   lngRoundTypearr.join(','),
   lngRoundarr.join(','),
   lngTaxarr.join(','),
   strIconarr.join(','),
   checkedMenus.join(';'),
   unchecklngCodes.join(','),
   deleteCd.join(','),
  )
   console.log(res)


Swal.fire({
      title: '저장 되었습니다.',
      confirmButtonText: '확인',
})
store.state.loading = false
  } catch (error) {
    console.log(error)
    Swal.fire({
      title: '저장이 실패되었습니다.',
      confirmButtonText: '확인',
  })
  } finally {
    store.state.loading = false
    searchButton();
  }
}
})
 

}

const updatedRowData = (newvalue) => {
  updateRow.value = newvalue
  console.log(updateRow.value)
}
const updatedList2 = ref([])
const updatedRowData2 = (newvalue) => {
   console.log(newvalue)
   console.log(rowData2.value)

    updatedList2.value = newvalue
    clickrowData2.value.forEach((item,index) => {
      const matchedItem = updatedList2.value.filter(item => item.checkbox == true).find(item2 => item2.lngCode == item.lngCode )
      if (matchedItem) {
        clickrowData2.value[index] = {...matchedItem}
       
       }
       
    })
    
    
}

const clickedRowData2 = (e) => {
  // //console.log(e)
  // const clickedRow = clickrowData2.value.find(item => item.menuCd == e[3])
  // //console.log(clickedRow.checkbox == undefined)
  // if(clickedRow.checkbox == undefined|| clickedRow.checkbox == false){
  //   clickedRow.checkbox = true

  // } else {
  //   clickedRow.checkbox = false
  // }
  // clickrowData2.value = [...clickrowData2.value]

  // changeColid.value = 'checkedMenu'
  // console.log(clickrowData2.value)
  // const arr = clickrowData2.value.filter(item => item.checkbox == true).map(item => item.menuCd)

  // changeValue2.value = arr.join(',')
  // changeNow.value = !changeNow.value
  // //console.log(updateRow.value)

  // clickrowData2.value = rowData2.value.filter( item => {
  //       if(forsearchMain.value =='0' ){
  //         return item ;
  //       } else if ( forsearchMain.value !='0' && forsearchSub.value !='0' )  {
  //         return  item.majorGroupCd == forsearchMain.value && item.subGroupCd == forsearchSub.value ;
  //       } else if (  forsearchMain.value !='0' && forsearchSub.value =='0') {
  //         return  item.majorGroupCd == forsearchMain.value 
  //       }
       
  //     })



//     const firstarr = clickedrowdata.value != undefined ? clickedrowdata.value.split(',') : []
//    if(rowData2.value.length > 0){

//     let dupliarr = JSON.parse(JSON.stringify(clickrowData2.value));
//     if(dupliarr){
//     console.log(dupliarr)
//     dupliarr.sort((a, b) => {
//       const aIndex = firstarr.indexOf(a.menuCd);
//       const bIndex =  firstarr.indexOf(b.menuCd);

//   if (aIndex === -1 && bIndex === -1) return 0; // 둘 다 우선순위에 없음
//   if (aIndex === -1) return 1; // a가 우선순위에 없음
//   if (bIndex === -1) return -1; // b가 우선순위에 없음
//   return aIndex - bIndex; // 우선순위 배열에 따라 정렬
// });
//    if(firstarr.length > 0 && firstarr[0] !==''){
//     for(var i=0 ; i < firstarr.length ; i ++){
//       const change =  dupliarr.find(item => item.menuCd == firstarr[i])
//       change.checkbox = true
//     }
//    }
  
   
//     clickrowData2.value = [...dupliarr]
//   }
// }
 
  
  
}


</script>

<style scoped>

</style>