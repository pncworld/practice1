<!-- /*--############################################################################
# Filename : STKN07_015RPT.vue                                                  
# Description : 자재관리 > 실사 관리 > 파트별 실사등록 시트 발행.               
# Date :2025-09-17                                                            
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
        <button @click="excelButton" class="button save w-40 excel">
          조사 시트발행
        </button>
      </div>
    </div>
    <div
      class="grid grid-cols-2 grid-rows-1 justify-between bg-gray-200 rounded-lg h-24 items-start z-10">
      <div class="grid grid-cols-1 grid-rows-2">
        <div class="flex ml-16 mt-2">
          <DatePicker4 @year="year" @month="month"></DatePicker4>
        </div>
        <div
          class="flex justify-start items-center text-base text-nowrap font-semibold ml-12 mt-2">
          자재분류
          <div class="flex ml-5 space-x-3 -mt-1">
            <div>
              <select
                name=""
                id=""
                class="border border-black w-32 h-7"
                @change="changeOption"
                v-model="cond">
                <option value="0">전체</option>
                <option :value="i.strDCode" v-for="i in optionList">
                  {{ i.strDName }}
                </option>
              </select>
            </div>
            <div>
              <select
                name=""
                id=""
                class="border border-black w-32 h-7"
                v-model="cond2">
                <option value="0">전체</option>
                <option :value="i.lngDetail" v-for="i in optionList2">
                  {{ i.strDetail }}
                </option>
              </select>
            </div>
            <div>
              <input
                type="text"
                class="border border-black w-56 h-7"
                v-model="cond3" />
            </div>
          </div>
          <div class="flex justify-end ml-20 mt-2">
            <label for="cond4"
              ><input
                type="checkbox"
                id="cond4"
                v-model="cond4" />전체보기</label
            >
          </div>
        </div>
      </div>
      <div class="mt-2 flex -ml-32">
        <PickStoreRenew
          @lngStoreCode="lngStoreCode"
          @excelStore="excelStore"
          :hideit2="false"
          :hideit="false"></PickStoreRenew>
        <div class="flex items-center space-x-5 -ml-11">
          <div class="text-base font-semibold">파트</div>
          <div>
            <select
              name=""
              id=""
              class="border border-black w-32 h-8"
              v-model="cond5">
              <option :value="i.lngPartCode" v-for="i in optionList3">
                {{ i.strPartName }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="w-full h-[82%]">
      <div class="flex text-red-400 text-nowrap">
        ※발행된 시트의 양식 변경 시 실사등록 엑셀 업로드가 되지 않습니다.
        (실사재고 수량만 입력 후 파트별 실사등록에서 엑셀 업로드)
      </div>
      <Realgrid
        :progname="'STKN07_015RPT_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :documentTitle="'STKN07_015RPT'"
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
import { getCommonList } from "@/api/common";
import {
  getLossMasterPartList,
  getStockDetail,
  getTakeWorkSheetListbyPart,
  getWorkList,
} from "@/api/mistock";
import DatePicker4 from "@/components/DatePicker4.vue";
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

import { insertPageLog } from "@/customFunc/customFunc";
/*
 * 공통 표준  Function
 */

import { onMounted, ref } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */
import Swal from "sweetalert2";

import { useStore } from "vuex";

const optionList = ref([]);
const optionList2 = ref([]);
const optionList3 = ref([]);
const optionList4 = ref([]);
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
const cond4 = ref(false);
const cond5 = ref("0");
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

const cond6 = ref(true);
const checkCond = (e) => {
  cond6.value = e.target.checked;
};
const searchButton = async () => {
  if (selectedStore.value == "0") {
    Swal.fire({
      title: "경고",
      text: "매장을 먼저 선택해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }

  if (cond5.value == "0") {
    Swal.fire({
      title: "경고",
      text: "파트를 먼저 선택해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }
  try {
    initGrid();

    store.state.loading = true;
    const res = await getTakeWorkSheetListbyPart(
      store.state.userData.lngStoreGroup,
      selectedStore.value,
      cond.value,
      cond2.value,
      cond3.value,
      1,
      syear.value + smonth.value + "01",
      cond5.value,
      cond4.value == true ? 1 : 0
    );
    console.log(res);
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
  const res = await getCommonList("07");

  optionList.value = res.data.List;

  //comsole.log(weekDay.value);
});

const changeOption = async (e) => {
  const res = await getStockDetail(
    store.state.userData.lngStoreGroup,
    e.target.value
  );
  //console.log(res);
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

const lngStoreCode = async (e) => {
  selectedStore.value = e;
  const res2 = await getLossMasterPartList(
    store.state.userData.lngStoreGroup,
    selectedStore.value
  );

  optionList3.value = res2.data.List;
};
const selectedExcelStore = ref("");
/**
 * 엑셀용 매장 세팅 함수
 */

const excelStore = (e) => {
  selectedExcelStore.value = e;
  //comsole.log(e);
};

const smonth = ref("");
const month = (e) => {
  smonth.value = e;
};

const syear = ref("");
const year = (e) => {
  syear.value = e;
};
</script>
