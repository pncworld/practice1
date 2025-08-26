<!-- /*--############################################################################
# Filename : categoryManage.vue                                                  
# Description : 모바일 >  카테고리 관리                        
# Date :2025-06-30                                                           
# Author : 권맑음                     
################################################################################*/ -->
<template>
   <div class="" @click="handleParentClick">
    <div class="flex justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <!-- <div class="flex justify-center mr-9 space-x-2 pr-5">
        <button @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <button @click="excelButton" class="button save w-auto excel">
          엑셀
        </button>
      </div> -->
      <button class="button search" @click="searchButton">조회</button>
    </div>
  </div>

  <div  class="flex flex-col bg-gray-200 rounded-lg items-start justify-start h-24">
 <CategorySelect
      @click.stop
      class=""
      :changeState="changeState"
      :reSearch="reSearch"
      @MAINCATEGORY="MAINCATEGORY"
      @SUBCATEGORY="SUBCATEGORY"
      @FILTERDATA="FILTERDATA"
      :getFilteredData="getFilteredData"
      @STORE_CD="STORE_CD"
      @GROUP_CD="GROUP_CD">
    </CategorySelect>
  </div>
    <div class="flex justify-center items-center mt-2 w-full">
      <div
        class="grid grid-rows-[3fr,1.8fr,5fr,5fr,5fr] grid-cols-[1fr,3fr] text-sm w-[95vw] h-[55vh]">
        <!-- <div
          class="bg-gray-200 flex justify-center border-l border-t border-black items-center">
          카테고리명
        </div> -->
        <!-- <div v-if="!FirstSearch"
          class="border-l border-t border-r border-black flex justify-center items-center  text-lg  p-2 overflow-hidden col-span-2 bg-green-200 ">
          <span>카테고리를 먼저 선택해주세요. ↗</span>
        </div>

        <div v-if="FirstSearch"
          class="border-l border-t border-r border-black flex justify-center pl-2 text-lg items-center overflow-hidden col-span-2 bg-green-200 ">
         {{ category }} <span class="text-xl pl-2 pr-2">></span> {{ cond1 }}
        </div> -->

        <div
          class="bg-gray-200 flex justify-center border-l border-t border-black items-center">
          사용여부
        </div>
        <div
          class="border-l border-t border-r border-black flex justify-start pl-2 text-lg items-center space-x-10">
          <label for="use"
            ><input
              type="radio"
              name="cond8"
              id="use"
              :disabled="!FirstSearch"
              v-model="cond8"
              value="Y" />사용</label
          >
          <label for="nuse"
            ><input
              type="radio"
              name="cond8"
              id="nuse"
               :disabled="!FirstSearch"
              v-model="cond8"
              value="N" />미사용</label
          >
        </div>

        <div
          class="bg-gray-200 flex justify-center border-l border-t border-black items-center ">
          사용기간
        </div>
        <div
          class="border-l border-t border-r border-black flex flex-col justify-center pl-2 items-start  space-y-2 ">
          <div class="flex justify-start text-lg">
            <label for="alldate"
              ><input
                type="checkbox"
                class=""
                id="alldate"
                 :disabled="!FirstSearch"
                v-model="alldate"
                @click="handleDate" />전체기간</label
            >
          </div>
          <div class="flex flex-col space-y-2 text-lg ">
            <div class="flex"><span>시작일 : </span><input type="date"  v-model="cond2" class="text-lg ml-1  w-[42vw] disabled:bg-gray-400 !mr-2 " :disabled="!FirstSearch || disable1" /></div>
           
            <!-- <span class="flex justify-center items-center">~</span> -->
            <div class="flex "><span>종료일 : </span><input type="date" v-model="cond5"  class=" ml-1 w-[42vw] disabled:bg-gray-400 !mr-2 text-lg " :disabled="!FirstSearch || disable1" /></div>
          </div>
        </div>

        <div
          class="bg-gray-200 flex justify-center border-l border-t border-black items-center ">
          사용시간
        </div>
        <div
          class="border-l border-t border-r border-black flex flex-col justify-center pl-2 items-start  space-y-2  text-lg" >
          <div  class="">
            <label for="alltime"
              ><input
                type="checkbox"
                id="alltime"
                 :disabled="!FirstSearch"
                v-model="alltime"
                @click="handleTime" />전체시간</label
            >
          </div>
          <div class="flex flex-col space-y-2 ">
            <div class="pr-2">
              <span>시작시간 : </span>
              <select name="" id="" v-model="cond3" :disabled="!FirstSearch || disable2" class="ml-1 text-lg disabled:bg-gray-400  disabled:opacity-100">
                <option :value="i.lngCode" v-for="i in optionList">
                  {{ i.strName }}
                </option>
              </select>
              <span>시</span>
              <select name="" id="" v-model="cond4" :disabled="!FirstSearch || disable2" class="text-lg  disabled:bg-gray-400  disabled:opacity-100">
                <option :value="i.lngCode" v-for="i in optionList2">
                  {{ i.strName }}
                </option>
              </select>
              <span>분</span>
            </div>
    
            <div class="pr-2">
              <span>종료시간 : </span>
              <select name="" id="" v-model="cond6" :disabled="disable2 || !FirstSearch" class=" text-lg ml-1 disabled:bg-gray-400 disabled:opacity-100">
                <option :value="i.lngCode" v-for="i in optionList">
                  {{ i.strName }}
                </option>
              </select>
              <span>시</span>
              <select name="" id="" v-model="cond7" :disabled="disable2 || !FirstSearch" class=" text-lg disabled:bg-gray-400  disabled:opacity-100">
                <option :value="i.lngCode" v-for="i in optionList2">
                  {{ i.strName }}
                </option>
              </select>
              <span>분</span>
            </div>
          </div>
        </div>

        <div
          class="bg-gray-200 flex justify-center border-l border-t border-b border-black items-center ">
          사용요일
        </div>
        <div
          class="border-l border-t border-r border-black flex flex-col justify-center pl-2 items-start  space-y-2  text-lg border-b">
          <div ><label for="allcheck"><input @click="checkDays" type="checkbox" id="allcheck" v-model="allcheck" :disabled="!FirstSearch">전체체크</input></label></div>
          <div class="flex flex-col">
            <div class="space-x-3">
          <label for="mon"
            ><input
              type="checkbox"
              id="mon"
              v-model="mon"
               :disabled="!FirstSearch"
              @click="handleday" />월</label
          >
          <label for="tue"
            ><input
              type="checkbox"
              id="tue"
               :disabled="!FirstSearch"
              v-model="tue"
              @click="handleday" />화</label
          >
          <label for="wed"
            ><input
              type="checkbox"
              id="wed"
               :disabled="!FirstSearch"
              v-model="wed"
              @click="handleday" />수</label
          >
          <label for="thu"
            ><input
              type="checkbox"
              id="thu"
               :disabled="!FirstSearch"
              v-model="thu"
              @click="handleday" />목</label
          >
          <label for="fri"
            ><input
              type="checkbox"
              id="fri"
               :disabled="!FirstSearch"
              v-model="fri"
              @click="handleday" />금</label
          >
        </div>
        <div class="space-x-3">
          <label for="sat"
            ><input
              type="checkbox"
              id="sat"
               :disabled="!FirstSearch"
              v-model="sat"
              @click="handleday" />토</label
          >
          <label for="sun"
            ><input
              type="checkbox"
              id="sun"
               :disabled="!FirstSearch"
              v-model="sun"
              @click="handleday" />일</label
          >
          <label for="holiday"
            ><input
              type="checkbox"
              id="holiday"
               :disabled="!FirstSearch"
              v-model="holiday"
              @click="handleHoli" />공휴일</label
          >
        </div>
        </div>
        </div>

      
      </div>
      
    </div>
    <div class="flex justify-end pr-2 mt-2 ">
      <button class="button save" @click="saveButton"  :disabled="!FirstSearch">저장</button>
    </div>
  

</template>

<script setup>
/*
 * 공통 표준  Function
 */

import { onMounted, ref, watch } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";
import Swal from "sweetalert2";
import { SetSClassStkRgst } from "@/api/etc";
import CategorySelect from "@/components/categorySelect.vue";
import PageName from "@/components/pageName.vue";

const store = useStore();
const changeState = ref(true);
const resetScreen = async (e) => {
  changeState.value = false;

  // changeState.value = !changeState.value;
  store.state.inActiveBackGround = false;
};

const currState = (e) => {
  changeState.value = e;
};
const selectStartDate = ref("");
const selectEndDate = ref("");
const selectGroupCd = ref("");
const selectStoreCd = ref("");
/**
 * 선택한 매출 시작일자
 */

const startDate = (e) => {
  selectStartDate.value = e;
};
/**
 * 선택한 매출 종료일자
 */

const mainCategory = ref("");
const subCategory = ref("");
const MAINCATEGORY = (e) => {
  console.log(e);
  mainCategory.value = e;
};

const SUBCATEGORY = (e) => {
  console.log(e);
  subCategory.value = e;
};
const STORE_CD = (e) => {
  selectStoreCd.value = e;
};

const GROUP_CD = (e) =>{
  selectGroupCd.value = e
}

const rowData = ref([]);

const optionList = ref([
  { lngCode: 0, strName: '00' },
  { lngCode: 1, strName: '01' },
  { lngCode: 2, strName: '02' },
  { lngCode: 3, strName: '03' },
  { lngCode: 4, strName: '04' },
  { lngCode: 5, strName: '05' },
  { lngCode: 6, strName: '06' },
  { lngCode: 7, strName: '07' },
  { lngCode: 8, strName: '08' },
  { lngCode: 9, strName: '09' },
  { lngCode: 10, strName: 10 },
  { lngCode: 11, strName: 11 },
  { lngCode: 12, strName: 12 },
  { lngCode: 13, strName: 13 },
  { lngCode: 14, strName: 14 },
  { lngCode: 15, strName: 15 },
  { lngCode: 16, strName: 16 },
  { lngCode: 17, strName: 17 },
  { lngCode: 18, strName: 18 },
  { lngCode: 19, strName: 19 },
  { lngCode: 20, strName: 20 },
  { lngCode: 21, strName: 21 },
  { lngCode: 22, strName: 22 },
  { lngCode: 23, strName: 23 },
]);

const optionList2 = ref([
  { lngCode: 0, strName: '00' },
  { lngCode: 10, strName: 10 },
  { lngCode: 20, strName: 20 },
  { lngCode: 30, strName: 30 },
  { lngCode: 40, strName: 40 },
  { lngCode: 50, strName: 50 },
]);

const cond1 = ref("");
const cond2 = ref("");
const cond3 = ref("");
const alldate = ref(false);
const alltime = ref(false);
const holiday = ref(false);
const cond4 = ref("");
const cond5 = ref("");
const cond6 = ref("");
const cond7 = ref("");
const cond8 = ref("Y");

const handleDate = (e) => {
  alldate.value = !alldate.value;

};
const handleTime = (e) => {
  alltime.value = !alltime.value;
};

const handleHoli = (e) => {
  holiday.value = !holiday.value;
};

const LCLASS_CD = ref('')
const SCLASS_CD = ref('')
const FILTERDATA = (e) => {
  // console.log(e)
  // if(e == undefined) {
  //   return ;
  // }
  FirstSearch.value = true
//  console.log(e);
  LCLASS_CD.value = e[0].LCLASS_CD;
  SCLASS_CD.value = e[0].SCLASS_CD;
  cond1.value = e[0].FULL_NM;
  cond2.value = e[0].FROM_DATE;
  cond3.value = parseInt(e[0].FROM_TIME.substring(0, 2));
  cond4.value = parseInt(e[0].FROM_TIME.substring(2));

  cond5.value = e[0].TO_DATE;
  cond6.value = parseInt(e[0].TO_TIME.substring(0, 2));
  cond7.value = parseInt(e[0].TO_TIME.substring(2));

  cond8.value = e[0].USE_YN;

  mon.value = e[0].SEL_DAY.substring(0, 1) == "1" ? true : false;
  tue.value = e[0].SEL_DAY.substring(1, 2) == "1" ? true : false;
  wed.value = e[0].SEL_DAY.substring(2, 3) == "1" ? true : false;
  thu.value = e[0].SEL_DAY.substring(3, 4) == "1" ? true : false;
  fri.value = e[0].SEL_DAY.substring(4, 5) == "1" ? true : false;
  sat.value = e[0].SEL_DAY.substring(5, 6) == "1" ? true : false;
  sun.value = e[0].SEL_DAY.substring(6, 7) == "1" ? true : false;

  holiday.value = e[0].SEL_DAY.substring(7, 8) == "1" ? true : false;

  alldate.value = e[0].ALL_DATE == "1" ? true : false;
  alltime.value = e[0].ALL_TIME == "1" ? true : false;
};

const mon = ref(false);
const tue = ref(false);
const wed = ref(false);
const thu = ref(false);
const fri = ref(false);
const sat = ref(false);
const sun = ref(false);

const disable1 = ref(false)
const disable2 = ref(false)
const handleday = (e) => {
  const id = e.target.id;
  const val = e.target.value;

  if (id == "mon") {
    mon.value = !mon.value;
  } else if (id == "tue") {
    tue.value = !tue.value;
  } else if (id == "wed") {
    wed.value = !wed.value;
  } else if (id == "thu") {
    thu.value = !thu.value;
  } else if (id == "fri") {
    fri.value = !fri.value;
  } else if (id == "sat") {
    sat.value = !sat.value;
  } else if (id == "sun") {
    sun.value = !sun.value;
  }
};

const allcheck = ref(false)
const checkDays = (e) => {

  allcheck.value = e.target.checked
  if(e.target.checked){
  holiday.value = true;
    mon.value = true;
    tue.value = true;
    wed.value = true;
    thu.value = true;
    fri.value = true;
    sat.value = true;
    sun.value = true;
  } else {
    holiday.value = false;
    mon.value = false;
    tue.value = false;
    wed.value = false;
    thu.value = false;
    fri.value = false;
    sat.value = false;
    sun.value = false;
  }
}

watch(([mon,tue,wed,thu,fri,sat,sun,holiday]) ,() => {
  if(mon.value == false || tue.value == false|| wed.value == false|| thu.value == false|| fri.value == false|| sat.value == false|| sun.value == false|| holiday.value == false){
    allcheck.value = false
  } else {
    allcheck.value = true
  }
})

watch((alldate) ,() => {
  if(alldate.value == true){
    disable1.value =true
  } else {
    disable1.value =false
  }

})

watch((alltime) ,() => {
  if(alltime.value == true){
    disable2.value =true
  } else {
    disable2.value =false
  }

})

const reSearch = ref(false)
const saveButton = async (e) => {
  // //console.log(alldate.value)
  // //console.log(cond2.value == undefined)

  if(alldate.value == true){
    cond2.value = new Date().toISOString().split('T')[0]
    cond5.value = new Date().toISOString().split('T')[0]
  }

  if(alldate.value == false && cond2.value ==''){
    Swal.fire({
        title: "경고",
        text: "사용시작날짜를 정확히 지정해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
  }
  if(alldate.value == false && cond5.value ==''){
    Swal.fire({
        title: "경고",
        text: "사용종료날짜를 정확히 지정해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
  }

  if(alldate.value == false && (new Date(cond2.value) > new Date(cond5.value))){
    Swal.fire({
        title: "경고",
        text: "종료날짜가 시작날짜보다 앞섭니다. 수정을 해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
  }
  if(LCLASS_CD.value ==''){
    Swal.fire({
        title: "경고",
        text: "조회를 먼저 진행해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
  }

  // //console.log(cond2.value)
  // //console.log(cond5.value)
  if(cond3.value == cond6.value && cond4.value == cond7.value){
    Swal.fire({
        title: "경고",
        text: "같은 시간을 선택하셨습니다. 다른 시간으로 변경해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
  }
  try {

    let seeday = ''

    if(mon.value == true) {
      seeday += '1'
    } else {
seeday += '0'
    }

    if(tue.value == true) {
      seeday += '1'
    } else {
seeday += '0'
    }

    if(wed.value == true) {
      seeday += '1'
    } else {
seeday += '0'
    }

    if(thu.value == true) {
      seeday += '1'
    } else {
seeday += '0'
    }

    if(fri.value == true) {
      seeday += '1'
    } else {
seeday += '0'
    }
    if(sat.value == true) {
      seeday += '1'
    } else {
seeday += '0'
    }

    if(sun.value == true) {
      seeday += '1'
    } else {
seeday += '0'
    }
    if(holiday.value == true) {
      seeday += '1'
    } else {
    seeday += '0'
    }

    let ftime = String(cond3.value).padStart(2, '0') +String(cond4.value).padStart(2, '0')
    let etime = String(cond6.value).padStart(2, '0') +String(cond7.value).padStart(2, '0')
    const res = await SetSClassStkRgst(selectGroupCd.value , selectStoreCd.value , LCLASS_CD.value , SCLASS_CD.value , cond8.value , alldate.value == true ? 1 : 0 , cond2.value , cond5.value , seeday , alltime.value == true ? 1 : 0 , ftime, etime )
     console.log(res)

    if(res.data.Result =='00'){
      Swal.fire({
        title: "성공",
        text: "저장을 완료하였습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
    } else {
      Swal.fire({
        title: "실패",
        text: `저장에 실패하였습니다. ${res.data.Result}`,
        icon: "error",
        confirmButtonText: "확인",
      });
    }
  } catch (error) {
    
  } finally {
    reSearch.value = !reSearch.value
  }
};


// const SEARCHNOW = async (e) => {
//   try {
//     store.state.loading2 = true;
//     const res = await getMobileSalesbyDays(
//       selectGroupCd.value,
//       selectStoreCd.value,
//       selectStartDate.value,
//       selectEndDate.value
//     );

//     rowData.value = res.data.List.map((item) => ({
//       ...item,
//       lngCustCnt: item.lngCustCnt.toLocaleString(),
//       lngRecCnt: item.lngRecCnt.toLocaleString(),
//       lngSalAmt: item.lngSalAmt.toLocaleString(),
//       lngActAmt: item.lngActAmt.toLocaleString(),
//       lngDiscountAmt: item.lngDiscountAmt.toLocaleString(),
//     }));
//   } catch (error) {
//   } finally {
//     store.state.loading2 = false;
//   }

//   //comsole.log(rowData.value);
// };
/**
 * 	화면 Load시 실행 스크립트
 */
const FirstSearch = ref(false)
onMounted(() => {});

const getFilteredData = ref(false)
const searchButton = () => {
   getFilteredData.value = !getFilteredData.value
}
</script>

<style scoped>

</style>
