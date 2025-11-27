<!-- /*--############################################################################
# Filename : ATT02_003INS.vue                                                  
# Description : 근태관리 > 근무 계획 및 실적 > 출퇴근 등록.                           
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
         <button @click="saveButton" class="button save md:w-auto w-14">
          저장
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
        <Datepicker2 @endDate="endDate" @startDate="startDate" :initToday='1' @excelDate="excelDate"></Datepicker2>

        <PickStore @update:storeCd="lngStoreCode" @storeNm="excelStore"></PickStore>
      </div>
      <div class="flex ">
        <div class="flex ml-20 space-x-5 h-full w-[20%]">
          <div class="text-base font-semibold">사원</div>
          <select name="" id="" class="w-full h-full border border-black" v-model="cond">
            <option value="0">전체</option>
            <option :value="i.lngSequence" v-for="i in optionList">{{ i.strChargerName}}</option>
          </select>
          <div class="flex text-nowrap"><label for="cond"><input type="checkbox" id="cond" @change="setOptionList">퇴(휴)직자포함</input></label></div>
        </div>
        <div class="flex ml-28 pl-2 space-x-5 w-[20%]">
            <div class="text-base font-semibold">사원구분</div>
            <div class="flex h-full w-full">
                <select name="" id="" class="flex h-full w-full border border-black" v-model="cond2">
                    <option :value="i.strDCode" v-for="i in optionList2">{{ i.strDName }}</option>
                </select>
            </div>
        </div>
        <div class="flex ml-14 pl-2 space-x-5 w-[20%]">
            <div class="text-base font-semibold">근태유형</div>
            <div class="flex h-full w-full">
                <select name="" id="" class="flex h-full w-full border border-black" v-model="cond3">
                
                    <option :value="i.strDCode" v-for="i in optionList3">{{ i.strDName }}</option>
                </select>
            </div>
        </div>
        <div class="flex ml-14 pl-2 space-x-5 w-[20%]">
            <div class="text-base font-semibold">직무명</div>
            <div class="flex h-full w-full">
                <select name="" id="" class="flex h-full w-full border border-black" v-model="cond4">
                      <option value="0">전체</option>
                    <option :value="i.lngRankCode" v-for="i in optionList4">{{ i.strRank }}</option>
                </select>
            </div>
        </div>
      </div>
    </div>
    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="w-full h-[80%] grid grid-rows-1  mt-5">
      <Realgrid
        :progname="'ATT02_003INS_M_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :setFooter="true"
        :documentSubTitle="documentSubTitle"
        :documentTitle="'ATT02_003INS'"
        @updatedRowData="updatedRowData"
        @allStateRows="allStateRows"
        :labelingColumns="'strWorkType'"
        :inputOnlyNumberColumn="'dtmAttendPlan,dtmLeavePlan'"
        :labelsData="labelsData"
        :valuesData="valuesData"
        :editableColId="'strWorkType,dtmAttendPlan,dtmLeavePlan'"
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

import { getCommonList } from "@/api/common";
import { getCommuteList, getCommuteList2, getEmpCode2, getEmpRankCode, saveCommuteList } from "@/api/miattend";
import Datepicker2 from "@/components/Datepicker2.vue";
import PickStore from "@/components/pickStore.vue";
import { useStore } from "vuex";
import Swal from "sweetalert2";
/**
 * 	화면 Load시 실행 스크립트
 */

const gridvalue1 = ref();
const gridvalue2 = ref();
const gridvalue3 = ref(1);
const gridvalue4 = ref("");
const gridvalue5 = ref("");
const gridvalue6 = ref("");
const gridvalue7 = ref("");
const gridvalue8 = ref("");
const cond = ref(0);
const optionList = ref([]);
const optionList2 = ref([]);
const optionList3 = ref([]);
const optionList4 = ref([]);
const lngstorecode = ref(0)
const sdate = ref('')
const edate = ref('')
const valuesData = ref([])
const labelsData = ref([])
const allstaterows  =ref([])
const allStateRows = (e) =>{
allstaterows.value =e
}
const updatedrowdata = ref([])
const updatedRowData = (e) =>{
updatedrowdata.value = e
}
const lngStoreCode = async(e) => {
    lngstorecode.value = e

    const res = await getEmpCode2(store.state.userData.lngStoreGroup , lngstorecode.value , 0 , 1 , 0)
    console.log(res)
    optionList.value = res.data.List

}

const startDate = (e) => {
    sdate.value = e
}
const endDate = (e) => {
    edate.value = e
}

const cond3 = ref('01')
const cond4 = ref(0)
const cond2 = ref(1)
onMounted(async () => {
  store.state.loading = true
  const pageLog = await insertPageLog(store.state.activeTab2);

  
  const res = await getEmpCode2(store.state.userData.lngStoreGroup , store.state.userData.lngPosition , 0 , 0 , 0)
  optionList.value = res.data.List


  const res2 = await getCommonList(256)

  optionList2.value = res2.data.List
  const res3 = await getCommonList(258)

  optionList3.value = res3.data.List

  labelsData.value = [optionList3.value.map(item => item.strDName)]
  valuesData.value = [optionList3.value.map(item => item.strDCode)]

  const res4 = await getEmpRankCode( store.state.userData.lngStoreGroup , 1)

  optionList4.value = res4.data.List
  store.state.loading = false

});

const setOptionList =async (e) =>{
    if (e.target.checked){
      const res = await getEmpCode2(store.state.userData.lngStoreGroup , lngstorecode.value , 0 , '1' , 0)

      optionList.value = res.data.List
    } else {
      const res = await getEmpCode2(store.state.userData.lngStoreGroup , lngstorecode.value , 0 , '0' , 0)

      optionList.value = res.data.List
    }
   
}
const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

const store = useStore();



/**
 *  조회 함수
 */

const searchButton = async () => {
  try {
    store.state.loading = true;
    initGrid();
    reload.value = !reload.value;
    const res = await getCommuteList2(store.state.userData.lngStoreGroup, lngstorecode.value ,0 , sdate.value , edate.value , cond.value , cond4.value , cond2.value , cond3.value);
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




const saveButton = async () => {

  if (allstaterows.value.updated.length == 0){
       Swal.fire({
      title: "경고",
      text: "변경된 사항이 없습니다..",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  try {
    store.state.loading = true;
    // initGrid();
    // reload.value = !reload.value;
     const ip = await fetch("https://api.ipify.org?format=json")
     .then(res => res.json());
    store.state.loading =true
    let storeCds = updatedrowdata.value.filter((item , index) =>allstaterows.value.updated.includes(index)).map(item => item.lngStoreCode).join('\u200b')
    let lngseqs = updatedrowdata.value.filter((item , index) =>allstaterows.value.updated.includes(index)).map(item => item.lngSequence).join('\u200b')
    let dtmdate = updatedrowdata.value.filter((item , index) =>allstaterows.value.updated.includes(index)).map(item => item.dtmDate).join('\u200b')
    let lngchargercd = updatedrowdata.value.filter((item , index) =>allstaterows.value.updated.includes(index)).map(item => item.lngChargerCode).join('\u200b')
    let lngareacds = updatedrowdata.value.filter((item , index) =>allstaterows.value.updated.includes(index)).map(item => item.lngAreaCode).join('\u200b')
    let lngrankcds = updatedrowdata.value.filter((item , index) =>allstaterows.value.updated.includes(index)).map(item => item.lngRankCode).join('\u200b')
    let dtmattendplan = updatedrowdata.value.filter((item , index) =>allstaterows.value.updated.includes(index)).map(item => item.dtmDate +' '+item.dtmAttendPlan).join('\u200b')
    let dtmleaveplan = updatedrowdata.value.filter((item , index) =>allstaterows.value.updated.includes(index)).map(item => item.dtmDate +' '+item.dtmLeavePlan).join('\u200b')
    let dtmworktime = updatedrowdata.value.filter((item , index) =>allstaterows.value.updated.includes(index)).map(item => (item.dtmDate +' '+item.dtmWorkTime).trimEnd()).join('\u200b')
    let dtmresttime = updatedrowdata.value.filter((item , index) =>allstaterows.value.updated.includes(index)).map(item => (item.dtmDate +' '+item.dtmRestTime).trimEnd()).join('\u200b')
    let dtmnighttime = updatedrowdata.value.filter((item , index) =>allstaterows.value.updated.includes(index)).map(item => (item.dtmDate +' '+item.dtmNightTime).trimEnd()).join('\u200b')
    let dtmholidaytime = updatedrowdata.value.filter((item , index) =>allstaterows.value.updated.includes(index)).map(item => (item.dtmDate +' '+item.dtmHolidayTime).trimEnd()).join('\u200b')
    let dtmovertime = updatedrowdata.value.filter((item , index) =>allstaterows.value.updated.includes(index)).map(item => (item.dtmDate +' '+item.dtmOverTime).trimEnd()).join('\u200b')
    let dtmwholiday = updatedrowdata.value.filter((item , index) =>allstaterows.value.updated.includes(index)).map(item => (item.dtmDate +' '+item.dtmWHolidayTime).trimEnd()).join('\u200b')
    let curworkpay = updatedrowdata.value.filter((item , index) =>allstaterows.value.updated.includes(index)).map(item => item.curWorkPay == '' ? 0 : item.curWorkPay ).join('\u200b')
    let curnightpay = updatedrowdata.value.filter((item , index) =>allstaterows.value.updated.includes(index)).map(item => item.curNightPay == '' ? 0 : item.curNightPay ).join('\u200b')
    let curholidaypay = updatedrowdata.value.filter((item , index) =>allstaterows.value.updated.includes(index)).map(item => item.curHolidayPay == '' ? 0 : item.curHolidayPay ).join('\u200b')
    let curoverpay = updatedrowdata.value.filter((item , index) =>allstaterows.value.updated.includes(index)).map(item => item.curOverPay == '' ? 0 : item.curOverPay ).join('\u200b')
    let curwholidaypay = updatedrowdata.value.filter((item , index) =>allstaterows.value.updated.includes(index)).map(item => item.curWHolidayPay == '' ? 0 : item.curWHolidayPay).join('\u200b')
    let curtraffic = updatedrowdata.value.filter((item , index) =>allstaterows.value.updated.includes(index)).map(item => item.curTraffic == '' ? 0 : item.curTraffic ).join('\u200b')
    let curphysicalexam = updatedrowdata.value.filter((item , index) =>allstaterows.value.updated.includes(index)).map(item => item.curPhysicalExam == '' ? 0 : item.curPhysicalExam ).join('\u200b')
    let dtmwovertime = updatedrowdata.value.filter((item , index) =>allstaterows.value.updated.includes(index)).map(item => item.dtmDate +' '+String(item.dtmWOverTime).padStart(2,'0') + ':00').join('\u200b')
    let curwoverpay = updatedrowdata.value.filter((item , index) =>allstaterows.value.updated.includes(index)).map(item => item.curWOverPay == '' ? 0 : item.curWOverPay ).join('\u200b')
    let curannualeavepay = updatedrowdata.value.filter((item , index) =>allstaterows.value.updated.includes(index)).map(item => item.curAnnualLeavePay == '' ? 0 : item.curAnnualLeavePay ).join('\u200b')
    let strworktype = updatedrowdata.value.filter((item , index) =>allstaterows.value.updated.includes(index)).map(item => item.strWorkType).join('\u200b')
    const res = await saveCommuteList(store.state.userData.lngStoreGroup, storeCds , lngseqs,dtmdate,lngchargercd,lngareacds,lngrankcds,dtmattendplan,dtmleaveplan,dtmworktime,dtmresttime,dtmnighttime,dtmholidaytime,dtmovertime,dtmwholiday,curworkpay,curnightpay,curholidaypay,curoverpay,curwholidaypay,curtraffic,curphysicalexam,dtmwovertime,curwoverpay,curannualeavepay,strworktype , store.state.userData.lngSequence , ip.ip, 'U' );

    if(res.data.RESULT_CD == '00'){
        await  Swal.fire({
          title: "성공",
          text: "출퇴근 등록 정보를 수정하였습니다.",
          icon: "success",
          confirmButtonText: "확인",
        });
        } else {
         await   Swal.fire({
          title: "실패",
          text: "출퇴근 등록 정보 수정에 실패하였습니다.",
          icon: "error",
          confirmButtonText: "확인",
        });
      }
    store.state.loading =false
    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
     store.state.loading =false
    console.log(error);
  } finally {
    store.state.loading = false;
    searchButton()
  }
};




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


const excelStore = (e) => {

  selectedExcelStore.value = "매장명 : " + e;
  //comsole.log(e);
};
const excelDate = (e) => {
  selectedExcelDate.value = e;
  //comsole.log(e);
};

/**
 * 엑셀용 매장 세팅 함수
 */

</script>
