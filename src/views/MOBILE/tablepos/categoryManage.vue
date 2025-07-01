<!-- /*--############################################################################
# Filename : categoryManage.vue                                                  
# Description : 모바일 >  카테고리 관리                        
# Date :2025-06-30                                                           
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <div class="h-full w-full" @click="resetScreen">
    <div class="h-[15vh] w-full"></div>
    <!-- <div
      class="relative h-[7vh] text-sm font-medium w-full bg-white grid grid-rows-1 grid-cols-[0.5fr,0.8fr,1.2fr,1.2fr,1fr] items-center">
      <div class="font-semibold text-nowrap">일자</div>
      <div class="font-semibold text-nowrap">객수/조수</div>
      <div class="font-semibold text-nowrap">총매출</div>
      <div class="font-semibold text-nowrap">실매출</div>
      <div class="font-semibold text-nowrap">할인액</div>
    </div> -->
    <!-- <div v-for="i in rowData" class="bg-gray-300">
      <div
        :class="i.dtmDate.includes('[') ? 'bg-gray-300 text-xs' : 'bg-blue-50'"
        class="grid grid-rows-1 grid-cols-[0.5fr,0.8fr,1.2fr,1.2fr,1fr] h-[7vh] justify-center items-center font-medium text-xs">
        <div class="flex justify-start pl-[10%]">{{ i.dtmDate }}</div>
        <div class="flex justify-center">
          {{ i.lngCustCnt }}/{{ i.lngRecCnt }}
        </div>
        <div class="flex justify-end">{{ i.lngSalAmt }}</div>
        <div class="flex justify-end">{{ i.lngActAmt }}</div>
        <div class="flex justify-end pr-[10%]">{{ i.lngDiscountAmt }}</div>
      </div>
    </div> -->
    <div class="flex justify-center items-center mt-2 w-full">
      <div
        class="grid grid-rows-6 grid-cols-[1fr,3fr] text-sm w-[95vw] h-[60vh]">
        <div
          class="bg-gray-200 flex justify-center border-l border-t border-black items-center">
          중카테고리명
        </div>
        <div
          class="border-l border-t border-black flex justify-start pl-2 text-lg items-center">
          {{ cond1 }}
        </div>

        <div
          class="bg-gray-200 flex justify-center border-l border-t border-black items-center">
          사용여부
        </div>
        <div
          class="border-l border-t border-black flex justify-start pl-2 text-lg items-center space-x-10">
          <label for="use"
            ><input
              type="radio"
              name="cond8"
              id="use"
              v-model="cond8"
              value="Y" />사용</label
          >
          <label for="nuse"
            ><input
              type="radio"
              name="cond8"
              id="nuse"
              v-model="cond8"
              value="N" />미사용</label
          >
        </div>

        <div
          class="bg-gray-200 flex justify-center border-l border-t border-black items-center row-span-2">
          사용기간
        </div>
        <div
          class="border-l border-t border-black flex flex-col justify-start  row-span-2 space-y-4">
          <div class="pl-2 mt-2">
            <label for="alldate"
              ><input
                type="checkbox"
                class=""
                id="alldate"
                v-model="alldate"
                @click="handleDate" />전체기간</label
            >
          </div>
          <div class="grid grid-rows-1 grid-cols-[3fr,0.5fr,3fr] space-x-0 ">
            <input type="date" v-model="cond2" class="text-sm  w-[35vw] disabled:bg-gray-400 !mr-2 " :disabled="disable1" />
            <span class="flex justify-center items-center">~</span>
            <input type="date" v-model="cond5"  class="text-sm  w-[35vw] disabled:bg-gray-400 !mr-2 " :disabled="disable1" />
          </div>
        </div>

        <div
          class="bg-gray-200 flex justify-center border-l border-t border-black items-center row-span-2">
          사용시간
        </div>
        <div
          class="border-l border-t border-black flex flex-col justify-start row-span-2 space-y-3" >
          <div  class="pl-2 mt-2">
            <label for="alltime"
              ><input
                type="checkbox"
                id="alltime"
                v-model="alltime"
                @click="handleTime" />전체시간</label
            >
          </div>
          <div class="grid grid-rows-1 grid-cols-[3fr,1fr,3fr] pl-2 ">
            <div class="pr-2">
              <select name="" id="" v-model="cond3" :disabled="disable2">
                <option :value="i.lngCode" v-for="i in optionList">
                  {{ i.strName }}
                </option>
              </select>
              <span>시</span>
              <select name="" id="" v-model="cond4" :disabled="disable2">
                <option :value="i.lngCode" v-for="i in optionList2">
                  {{ i.strName }}
                </option>
              </select>
              <span>분</span>
            </div>
            <span>~</span>
            <div class="pr-2">
              <select name="" id="" v-model="cond6" :disabled="disable2">
                <option :value="i.lngCode" v-for="i in optionList">
                  {{ i.strName }}
                </option>
              </select>
              <span>시</span>
              <select name="" id="" v-model="cond7" :disabled="disable2">
                <option :value="i.lngCode" v-for="i in optionList2">
                  {{ i.strName }}
                </option>
              </select>
              <span>분</span>
            </div>
          </div>
        </div>

        <div
          class="bg-gray-200 flex justify-center border-l border-t border-b border-black items-center row-span-2">
          사용요일
        </div>
        <div
          class="border-l border-t border-b border-black flex flex-col justify-center pl-2 row-span-2 space-y-3">
          <div ><label for="allcheck"><input @click="checkDays" type="checkbox" id="allcheck" v-model="allcheck">전체체크</input></label></div>
          <div class="flex">
          <label for="mon"
            ><input
              type="checkbox"
              id="mon"
              v-model="mon"
              @click="handleday" />월</label
          >
          <label for="tue"
            ><input
              type="checkbox"
              id="tue"
              v-model="tue"
              @click="handleday" />화</label
          >
          <label for="wed"
            ><input
              type="checkbox"
              id="wed"
              v-model="wed"
              @click="handleday" />수</label
          >
          <label for="thu"
            ><input
              type="checkbox"
              id="thu"
              v-model="thu"
              @click="handleday" />목</label
          >
          <label for="fri"
            ><input
              type="checkbox"
              id="fri"
              v-model="fri"
              @click="handleday" />금</label
          >
          <label for="sat"
            ><input
              type="checkbox"
              id="sat"
              v-model="sat"
              @click="handleday" />토</label
          >
          <label for="sun"
            ><input
              type="checkbox"
              id="sun"
              v-model="sun"
              @click="handleday" />일</label
          >
          <label for="holiday"
            ><input
              type="checkbox"
              id="holiday"
              v-model="holiday"
              @click="handleHoli" />공휴일</label
          >
        </div>
        </div>

      
      </div>
      
    </div>
    <div class="flex justify-end pr-2 mt-2 ">
      <button class="button save" @click="saveButton">저장</button>
    </div>
  </div>
  <CategorySelect
    @click.stop
    class="z-[10]"
    :changeState="changeState"
    @currState="currState"
    @FILTERDATA="FILTERDATA"
    @GROUP_CD="GROUP_CD"
    @STORE_CD="STORE_CD"></CategorySelect>
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
import CategorySelect from "../component/categorySelect.vue";
import Swal from "sweetalert2";

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

const endDate = (e) => {
  selectEndDate.value = e;
};
const GROUP_CD = (e) => {
  selectGroupCd.value = e;
};
const STORE_CD = (e) => {
  selectStoreCd.value = e;
};

const rowData = ref([]);

const optionList = ref([
  { lngCode: 0, strName: 0 },
  { lngCode: 1, strName: 1 },
  { lngCode: 2, strName: 2 },
  { lngCode: 3, strName: 3 },
  { lngCode: 4, strName: 4 },
  { lngCode: 5, strName: 5 },
  { lngCode: 6, strName: 6 },
  { lngCode: 7, strName: 7 },
  { lngCode: 8, strName: 8 },
  { lngCode: 9, strName: 9 },
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
  { lngCode: 0, strName: 0 },
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
  console.log(e);
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

const saveButton = async (e) => {
  console.log(cond2.value)

  if(LCLASS_CD.value ==''){
    Swal.fire({
        title: "경고",
        text: "조회를 먼저 진행해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
  }

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
    let etime = String(cond5.value).padStart(2, '0') +String(cond6.value).padStart(2, '0')
    const res = await saveStockInfo(selectGroupCd.value , selectStoreCd.value , LCLASS_CD.value , SCLASS_CD.value , cond8.value , alldate.value == true ? 1 : 0 , cond2.value , cond5.value , seeday , alltime.value == true ? 1 : 0 , ftime, etime )
  } catch (error) {
    
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

onMounted(() => {});
</script>

<style scoped>

</style>
