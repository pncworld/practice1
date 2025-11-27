<!-- /*--############################################################################
# Filename : ATT04_004RPT.vue                                                  
# Description : 인사관리 > 근무 현황 조회 > 출퇴근 현황.                           
# Date :2025-11-19                                                            
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
        <!-- <button @click="addButton" class="button new md:w-auto w-14">
          신규
        </button>
        <button @click="saveButton" class="button save md:w-auto w-14">
          저장
        </button>
        <button @click="deleteButton" class="button delete md:w-auto w-14">
          삭제
        </button> -->
        <button @click="excelButton" class="button save w-auto excel">
          엑셀
        </button>
      </div>
    </div>
    <div class="bg-gray-200 rounded-lg h-28 items-start z-10 space-y-2">
      <div class="flex">
        <Datepicker2 @endDate="endDate" @startDate="startDate" :initToday="1" @excelDate="excelDate"></Datepicker2>

        <PickStore @update:storeCd="lngStoreCode" @storeNm="excelStore"></PickStore>
      </div>
      <div class="flex ">
        <div class="flex ml-20 space-x-5 h-full w-[20%]">
          <div class="text-base font-semibold">사원</div>
          <!-- <select name="" id="" class="w-full h-full border border-black" v-model="cond2">
            <option value="0">전체</option>
            <option :value="i.lngSequence" v-for="i in optionList">{{ i.strChargerNameNo}}</option>
          </select> -->
          <Searchinput :options="optionList" @selected="selected" :code="'lngSequence'" :label="'strChargerNameNo'"></Searchinput>
          <div class="flex text-nowrap"><label for="cond"><input type="checkbox" id="cond" @change="setOptionList">퇴(휴)직자포함</input></label></div>
        </div>
        <div class="flex ml-28 pl-2 space-x-5 w-[20%]">
            <div class="text-base font-semibold">사원분류</div>
            <div class="flex h-full w-full">
                <!-- <select name="" id="" class="flex h-full w-full border border-black" v-model="cond3">

                      <option value="0">전체</option>
                    <option :value="i.lngClassCode" v-for="i in optionList2">{{ i.strClass }}</option>
                </select> -->
                 <Searchinput :options="optionList2" @selected="selected2" :code="'lngClassCode'" :label="'strClass'"></Searchinput>
            </div>
        </div>
      </div>
    </div>
    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="w-full h-[80%] grid grid-rows-1  mt-5">
      <Realgrid
        :progname="'ATT04_004RPT_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :documentTitle="'ATT04_004RPT'"
        :documentSubTitle="documentSubTitle"
        :setFooter="true"
        :rowStateeditable="false"
        :exporttoExcel="exportExcel">
      </Realgrid>
    </div>
    </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import "vue3-timepicker/dist/VueTimepicker.css";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
/**
 * 	매장 단일 선택 컴포넌트
 */
/**
 * 	그리드 생성
 */

import Realgrid from "@/components/realgrid.vue";
/**
 *  페이지로그 자동 입력
 *  */

import { insertPageLog } from "@/customFunc/customFunc";
/**
 *  경고창 호출 라이브러리
 *  */

/*
 * 공통 표준  Function
 */

import { onMounted, ref } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { getCommuteList, getEmpClassCode, getEmpCode } from "@/api/miattend";
import Datepicker2 from "@/components/Datepicker2.vue";
import PickStore from "@/components/pickStore.vue";
import { useStore } from "vuex";
import Searchinput from "@/components/searchinput.vue";
/**
 * 	화면 Load시 실행 스크립트
 */

const optionList3 = ref([]);

const gridvalue1 = ref();
const gridvalue2 = ref();
const gridvalue3 = ref(1);
const gridvalue4 = ref("");
const gridvalue5 = ref("");
const gridvalue6 = ref("");
const gridvalue7 = ref("");
const gridvalue8 = ref("");
const cond = ref(1);
const optionList = ref([]);
const optionList2 = ref([]);
const lngstorecode = ref(0)
const sdate = ref('')
const edate = ref('')
const lngStoreCode = async(e) => {
    lngstorecode.value = e

    if (lngstorecode.value == '0'){
 
   optionList.value =[]
    } else {
        const res = await getEmpCode(store.state.userData.lngStoreGroup , lngstorecode.value , 0 , 2)
        console.log(res)
  optionList.value = res.data.List
    }

}

const startDate = (e) => {
    sdate.value = e
}
const endDate = (e) => {
    edate.value = e
}

const cond3 = ref(0)
const cond2 = ref(0)

const selected = (e) =>{
  cond2.value = e
}
const selected2= (e) =>{
  cond3.value = e
}
onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  // const res = await getEmpCode(store.state.userData.lngStoreGroup , 0 , 0 , 2)
  // optionList.value = res.data.List

  const res2 = await getEmpClassCode(store.state.userData.lngStoreGroup ,1)
  optionList2.value = res2.data.List

});

const setOptionList =async (e) =>{
    if (e.target.checked){
      const res = await getEmpCode(store.state.userData.lngStoreGroup , lngstorecode.value , 1 , 2)
      optionList.value = res.data.List
    } else {
      const res = await getEmpCode(store.state.userData.lngStoreGroup , lngstorecode.value , 0 , 2)
      optionList.value = res.data.List
    }
}
const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

const store = useStore();

const afterClick = ref(false);


const updateStateRow = ref([]);


/**
 *  조회 함수
 */

const searchButton = async () => {
  try {
    store.state.loading = true;
    initGrid();
    reload.value = !reload.value;
    const res = await getCommuteList(store.state.userData.lngStoreGroup, 0 , lngstorecode.value , sdate.value , edate.value , cond3.value , cond2.value);
    console.log(res)
    rowData.value = res.data.List;
 
    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    //comsole.log(error);
  } finally {
    store.state.loading = false;
  }
};
const disablegrid = ref(true);
const disablegrid2 = ref(true);
const insertupdatedelete = ref(1);
const addRow4 = ref(false);



/* 매장 컴포넌트 관련 함수 */

/**
 * 페이지 매장 코드 세팅
 */

/**
 * 그리드 초기화
 */

const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
  afterSearch.value = false;

  gridvalue1.value = "";
  gridvalue2.value = "";
  gridvalue3.value = "1";
  gridvalue4.value = "";
  gridvalue5.value = "";
  gridvalue6.value = "";
  gridvalue7.value = "";
  gridvalue8.value = "";
  disablegrid.value = true;
  disablegrid2.value = true;
};

//엑셀 버튼 처리 함수
const exportExcel = ref(false);
/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  documentSubTitle.value = selectedExcelDate.value + '\n' + selectedExcelStore.value

  //documentSubTitle.value += "\n";
  exportExcel.value = !exportExcel.value;
};

// 엑셀 추출
const documentSubTitle = ref("");
const selectedExcelList = ref("");
const selectedExcelDate = ref("");

const selectedExcelStore = ref("");
/**
 * 엑셀용 매장 세팅 함수
 */

const excelStore = (e) => {

  selectedExcelStore.value = "매장명 : " + e;
  //comsole.log(e);
};
const excelDate = (e) => {
  selectedExcelDate.value = e;
  //comsole.log(e);
};
</script>
