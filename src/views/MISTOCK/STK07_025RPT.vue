<!-- /*--############################################################################
# Filename : STK07_025RPT.vue                                                  
# Description : 자재관리 > 재고현황> DAILY INVENTORY.               
# Date :2025-09-01                                                            
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <!-- 조회조건 -->
  <div class="h-full" @click="handleParentClick">
    <div class="flex justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center mr-9 space-x-2 pr-5">
        <button @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <button @click="excelButton" class="button save w-auto excel">
          엑셀
        </button>
      </div>
    </div>
    <div
      class="grid grid-cols-3 grid-rows-2 justify-start bg-gray-200 rounded-lg h-24 items-start z-10 w-full">
      <div class="flex ml-12 mt-2">
        <PickStoreRenew
          @lngStoreCode="lngStoreCode"
          @excelStore="excelStore"
          :mainName="'매장명'"
          :hideit2="false"
          :hideit="false"></PickStoreRenew>
      </div>

      <div
        class="flex justify-start items-center text-base text-nowrap font-semibold ml-12 mt-2">
        자재분류
        <div class="flex ml-5 space-x-3">
          <div>
            <select
              name=""
              id=""
              class="border border-black w-56 h-7"
              v-model="cond">
              <option value="0">전체</option>
              <option :value="i.lngDetail" v-for="i in optionList">
                {{ i.strDetail }}
              </option>
            </select>
          </div>
        </div>
      </div>
      <div class="flex mt-2 ml-12 items-center">
        <div class="text-base font-semibold">조회옵션</div>
        <div class="items-center ml-5">
          <select
            name=""
            id=""
            class="w-32 h-7 border border-black"
            v-model="cond2">
            <option value="0">전체품목</option>
            <option value="1">사용가능 품목</option>
            <option value="2">수불 있는 품목</option>
          </select>
        </div>
      </div>
      <div class="flex ml-11 items-center mt-2">
        <div class="text-base font-semibold">월/주차</div>
        <div class="items-center ml-5">
          <select
            name=""
            id=""
            class="w-32 h-7 border border-black"
            @change="setWeeks"
            v-model="cond3">
            <option :value="i.lngCode" v-for="i in optionList2">
              {{ i.strName }}
            </option>
          </select>
        </div>
        <div class="font-semibold ml-1">년</div>

        <div class="items-center ml-5">
          <select
            name=""
            id=""
            class="w-12 h-7 border border-black"
            @change="setWeeks"
            v-model="cond4">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
          </select>
        </div>
        <div class="font-semibold ml-1">월</div>

        <div class="items-center ml-5">
          <select
            name=""
            id=""
            class="w-12 h-7 border border-black"
            @change="setDates"
            v-model="cond5">
            <option :value="i.lngCode" v-for="i in optionList3">
              {{ i.strName }}
            </option>
          </select>
        </div>
        <div class="font-semibold ml-1">주</div>
      </div>
      <div class="flex ml-20 mt-2 items-center space-x-5 col-span-2">
        <div class="text-base font-semibold">기간</div>
        <div class="flex space-x-3 items-center">
            <input type="text" disabled class="border border-black bg-white disabled:bg-white w-48 h-7" v-model="cond6">
            <div>~</div>
            <input type="text" disabled class="border border-black bg-white disabled:bg-white w-48 h-7" v-model="cond7"></input>
        </div>
      </div>
    </div>
    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="w-full h-[70%]">
      <Realgrid
        :progname="'STK07_025RPT_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :documentTitle="'STK07_025RPT'"
        :documentSubTitle="documentSubTitle"
        :rowStateeditable="false"
        :exporttoExcel="exportExcel">
      </Realgrid>
      <!-- <Realgrid :progname="'SLS05_004RPT_VUE'" :progid="1" :rowData="rowData" :reload="reload" 
         :setFooter="true" :setFooterExpressions="setFooterExpressions" :setFooterColID="setFooterColID"
         :exporttoExcel="exportExcel" :documentTitle="'SLS05_004RPT'" :documentSubTitle="documentSubTitle" 
      </Realgrid> -->
    </div>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import { getStockDetail, getWorkList } from "@/api/mistock";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
import PickStoreRenew from "@/components/pickStoreRenew.vue";
/**
 *  단일 매장  컴포넌트
 *  */

/**
 * 	그리드 생성
 */

import Realgrid from "@/components/realgrid.vue";
/**
 *  페이지로그 자동 입력
 *  */

import { formatLocalDate, insertPageLog } from "@/customFunc/customFunc";
/*
 * 공통 표준  Function
 */

import { onMounted, ref } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";

const optionList = ref([]);
const optionList2 = ref([]);
const optionList3 = ref([]);
const optionList4 = ref([]);
const optionList5 = ref([]);
const optionList6 = ref([]);
const setGroupSumCustomColumnId = ref(["strWeek"]);
const setGroupColumnId = ref("");
const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);
const selectedstartDate = ref();
const selectedendDate = ref();

/**
 * 선택한 매출 시작일자
 */

const cond = ref(0);
const cond2 = ref(0);
const cond3 = ref("");
const cond4 = ref(1);
const tempSeeStore = ref(false);
const reportCheckData = ref("0");
const progId = ref("1");

const store = useStore();
const loginedstrLang = store.state.userData.lngLanguage;

const datepicker = ref(null);
const closePopUp = ref(false);
/**
 * 매출 일자 안 라디오박스 닫기 위한 외부 클릭 감지 함수
 */

const handleParentClick = (e) => {
  const datepickerEl = datepicker.value?.$el;
  if (datepickerEl && datepickerEl.contains(e.target)) {
    return;
  }
  closePopUp.value = !closePopUp.value;
};

/**
 *  조회 함수
 */

const cond5 = ref(1);
const cond6 = ref('');
const cond7 = ref('');
const cond8 = ref(0);
const checkCond = (e) => {
  cond6.value = e.target.checked;
};
const searchButton = async () => {
  store.state.loading = true;
  try {
    initGrid();

    const res = await getWorkList(
      store.state.userData.lngStoreGroup,
      selectedStore.value,
      cond.value,
      cond2.value,
      cond3.value,
      cond4.value,
      selectedDate.value,
      cond5.value,
      cond6.value == true ? 1 : 0
    );
    //console.log(res);
    rowData.value = res.data.List;

    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    //comsole.log(error);
  } finally {
    store.state.loading = false;
  }
};

/* 매장 컴포넌트 관련 함수 */
const selectedGroup = ref();
const selectedStore = ref(0);
const selectedStoreAttrs = ref();
const selectedStoreTeam = ref();
const selectedStoreSuperVisor = ref();
/**
 * 페이지 매장 그룹 세팅
 */

/**
 * 페이지 매장 분류 세팅
 */

/**
 * 페이지 매장 슈퍼바이저 세팅
 */

/**
 * 페이지 매장 팀 세팅
 */

/* 매입사 콤보박스 */

const selectedWeekDay = ref("");

/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
  //   const res = await getCommonList("07");
  //   const res2 = await getCommonList("73");
  //   const res3 = await getCommonList("67");
  //   const res4 = await getCommonList("166");
  //   const res5 = await getCommonList("164");

  //   optionList.value = res.data.List;
  //   optionList3.value = res2.data.List;
  //   optionList4.value = res3.data.List;
  //   optionList5.value = res4.data.List;
  //   optionList6.value = res5.data.List;

  //   if (optionList4.value.length > 0) {
  //     cond5.value = optionList4.value[0].strDCode;
  //   }
  //   if (optionList5.value.length > 0) {
  //     cond7.value = optionList5.value[0].strDCode;
  //   }
  //   if (optionList6.value.length > 0) {
  //     cond8.value = optionList6.value[0].strDCode;
  //   }

  const res = await getStockDetail(store.state.userData.lngStoreGroup, "01");

  console.log(res);
  optionList.value = res.data.List;

  const today = new Date();

  const maxyear = today.getFullYear();

  for (let i = 0; i < 10; i++) {
    optionList2.value.push({ lngCode: maxyear - i, strName: maxyear - i });
  }

  cond3.value = maxyear;
  //comsole.log(weekDay.value);

  optionList3.value = [
    { lngCode: 1, strName: 1 },
    { lngCode: 2, strName: 2 },
    { lngCode: 3, strName: 3 },
    { lngCode: 4, strName: 4 },
  ];
});

const changeOption = async (e) => {
  const res = await getStockDetail(
    store.state.userData.lngStoreGroup,
    e.target.value
  );
  console.log(res);
  optionList2.value = res.data.List;
};

/**
 * 그리드 초기화
 */

const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
};

//엑셀 버튼 처리 함수
const exportExcel = ref(false);
/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  documentSubTitle.value =
    selectedExcelDate.value + "\n" + selectedExcelStore.value;
  //comsole.log(documentSubTitle.value); // 맑음 소스 pickStorePlural.vue 소스의 excelStore 받아야 함.
  // 엑셀 기능 실행
  exportExcel.value = !exportExcel.value;
};

// 엑셀 추출
const documentSubTitle = ref("");
const selectedExcelDate = ref("");
/**
 * 엑셀용 일자 세팅 함수
 */

const excelDate = (e) => {
  selectedExcelDate.value = e;
  //comsole.log(e);
};

const selectedDate = ref("");
const dateValue = (e) => {
  selectedDate.value = e;
};

const lngStoreCode = (e) => {
  selectedStore.value = e;
};
const selectedExcelStore = ref("");
/**
 * 엑셀용 매장 세팅 함수
 */

const excelStore = (e) => {
  selectedExcelStore.value = e;
  //comsole.log(e);
};

// function getMonthWeeksByMonday(year, month) {
//   const firstDay = new Date(year, month - 1, 1); // 1일
//   const lastDay = new Date(year, month, 0);      // 말일

//   const firstWeekDay = firstDay.getDay();        // 0=일, 1=월, ..., 6=토
//   const firstWeekDate = firstDay.getDate();


//   const lastDate = lastDay.getDate();
//   let totalweek = 0
//   for(let i= firstWeekDate ; i<= lastDate ; i++){
//     const today = new Date(year , month-1 ,i)
//     const todayday = today.getDay()
//     if(todayday ==1){
// totalweek++
//     }
//   }

//   return  totalweek; // 첫 주 포함
// }

function getMonthWeeksByMonday(year, month) {
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);

  // 첫 날이 월요일이면 count = 1, 아니면 0
  let totalWeeks = firstDay.getDay() === 1 ? 1 : 0;

  // 마지막 날까지 날짜 차이 + 첫 날 요일 보정으로 월요일 수 계산
  totalWeeks += Math.floor((lastDay.getDate() + (firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1)) / 7);

  return totalWeeks;
}

const setWeeks = (e) => {
  const maxweek =getMonthWeeksByMonday(cond3.value, cond4.value)
  optionList3.value = [];
  for (let i = 0; i < maxweek; i++) {
    optionList3.value.push({ lngCode: i + 1, strName: i + 1 });
  }


};

function getWeekDateRange(year, month, weekNumber) {
  // month: 1~12
  const firstDay = new Date(year, month - 1, 1);

  // 첫 주 월요일 찾기
  const firstMonday = new Date(firstDay);
  const day = firstDay.getDay(); // 0=일,1=월,...6=토
 let offset= 0
  if(day == 0){
    offset =1
  } else if (day == 1){
    offset = 0
  } else if (day ==2){
    offset = 7
  } else if (day ==3){
    offset = 6
  } else if (day ==4){
    offset = 5
  } else if (day ==5){
    offset = 4
  } else if (day ==6){
    offset = 3
  }
  //const offset = day === 0 ? 8 : (8 - day); // 첫 주 월요일까지 일수
  firstMonday.setDate(firstDay.getDate() + (offset - 1));

  // 요청 주 월요일 계산
  const monday = new Date(firstMonday);
  monday.setDate(firstMonday.getDate() + (weekNumber - 1) * 7);

  // 요청 주 일요일 계산
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return {
    monday: formatLocalDate(monday),
    sunday: formatLocalDate(sunday)
  };
}

const setDates = (e) => {
  const result =  getWeekDateRange(cond3.value, cond4.value, cond5.value)

  cond6.value = result.monday
  cond7.value = result.sunday
}
</script>
