/*--############################################################################
# Filename : CRM10_007INS_shy.vue                                              
# Description : 마스터관리 > 예약 관리 > 예약타임테이블.                        
# Date :2025-06-04                                                             
# Author : 권맑음                     
################################################################################*/
<template>
  <!-- 조회조건 -->
  <div class="h-full" @click="handleParentClick">
    <div class="flex justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center mr-9 space-x-2 pr-5">
        <button @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <button @click="addButton" class="button new md:w-auto w-14">
          신규
        </button>
        <button @click="saveButton" class="button save md:w-auto w-14">
          저장
        </button>
        <button @click="deleteButton" class="button delete md:w-auto w-14">
          삭제
        </button>
        <button @click="excelButton" class="button save w-auto excel">
          엑셀
        </button>
      </div>
    </div>

    <div class="flex bg-gray-200 rounded-lg h-16 items-start z-10">
      <PickStore
        :hideGroup="false"
        :hideAttr="false"
        @update:storeCd="lngStoreCode"
        @update:storeGroup="lngStoreGroup"
        @storeNm="excelStore">
      </PickStore>
    </div>
    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="w-full h-[80%] grid grid-rows-1 grid-cols-[7fr,5fr]">
      <Realgrid
        :progname="'CRM10_007INS_VUE_shy'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :setStateBar="false"
        @clickedRowData="clickedRowData"
        :documentTitle="'CRM10_007INS_shy'"
        :dynamicRowHeight="true"
        :documentSubTitle="documentSubTitle"
        :rowStateeditable="false"
        :exporttoExcel="exportExcel">
      </Realgrid>
      <div class="w-[70%] h-[30vh] mt-10 ml-10">
        <div
          class="grid grid-rows-6 grid-cols-[1fr,3fr] border w-full h-full border-black">
          <div class="border border-black flex justify-center items-center">
            휴일구분
          </div>
          <div class="border border-black flex justify-center items-center">
            <select
              name=""
              id=""
              :disabled="disablegrid"
              class="border h-[70%] w-[70%] border-black"
              v-model="gridvalue1">
              <option value="0">평일</option>
              <option value="1">휴일</option>
            </select>
          </div>
          <div class="border border-black flex justify-center items-center">
            식사구분
          </div>
          <div class="border border-black flex justify-center items-center">
            <select
              name=""
              id=""
              :disabled="disablegrid"
              class="border h-[70%] w-[70%] border-black"
              v-model="gridvalue2">
              <option value="0">선택</option>
              <option :value="i.strDCode" v-for="i in optionList">
                {{ i.strDName }}
              </option>
            </select>
          </div>
          <div class="border border-black flex justify-center items-center">
            회차
          </div>
          <div class="border border-black flex justify-center items-center">
            <select
              name=""
              id=""
              :disabled="disablegrid"
              class="border h-[70%] w-[70%] border-black"
              v-model="gridvalue3">
              <option value="0">선택</option>
              <option :value="i.strDCode" v-for="i in optionList2">
                {{ i.strDName }}
              </option>
            </select>
          </div>
          <div class="border border-black flex justify-center items-center">
            시간대코드
          </div>
          <div class="border border-black flex justify-center items-center">
            <input
              type="text"
              :disabled="disablegrid"
              v-model="gridvalue4"
              class="border w-[70%] h-[80%] pl-1" />
          </div>
          <div class="border border-black flex justify-center items-center">
            시간대
          </div>
          <div class="border border-black flex justify-center items-center">
            <TimePicker
              v-model="gridvalue5"
              format="HH:mm"
              :hour12="false"
              :key="setGridValue5" />
          </div>
          <div class="border border-black flex justify-center items-center">
            사용여부
          </div>
          <div class="border border-black flex justify-center items-center">
            <select
              name=""
              id=""
              class="border h-[70%] w-[70%] border-black"
              v-model="gridvalue6">
              <option :value="i.strDCode" v-for="i in optionList3">
                {{ i.strDName }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import { getCommonList } from "@/api/common";
import {
  getReservedChangeHistory,
  getReservedTimeTable,
  saveReserveTimeTable,
} from "@/api/micrm";
import TimePicker from "vue3-timepicker";
import "vue3-timepicker/dist/VueTimepicker.css";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
import PickStore from "@/components/pickStore.vue";
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

import Swal from "sweetalert2";
/*
 * 공통 표준  Function
 */

import { onMounted, ref, watch } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";
/**
 * 	화면 Load시 실행 스크립트
 */

const optionList = ref([]);
const optionList2 = ref([]);
const optionList3 = ref([]);

const gridvalue1 = ref(0);
const gridvalue2 = ref(0);
const gridvalue3 = ref(0);
const gridvalue4 = ref("");
const gridvalue5 = ref("00:00");
const setGridValue5 = ref(1);
const gridvalue6 = ref(1);
onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
  const res = await getCommonList(231);
  const res2 = await getCommonList(232);
  const res3 = await getCommonList(45);

  optionList.value = res.data.List;
  optionList2.value = res2.data.List;
  optionList3.value = res3.data.List;
  //console.log(optionList2.value);
  reload.value = !reload.value;
});

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

const cond = ref("");
const cond2 = ref("");
const store = useStore();

const clickedRowData = (e) => {
  disablegrid.value = true;
  insertupdatedelete.value = 2;
  //console.log(e);
  gridvalue1.value = e[6];
  gridvalue2.value = e[7];
  gridvalue3.value = e[8];
  gridvalue4.value = e[3];
  //console.log(e[4]);
  gridvalue5.value = e[4];
  gridvalue6.value = e[9];
  setGridValue5.value = setGridValue5.value + 1;
};

function timeStringToDate(timeStr) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

/**
 *  조회 함수
 */

const searchButton = async () => {
  try {
    store.state.loading = true;
    initGrid();
    reload.value = !reload.value;
    const res = await getReservedTimeTable(
      selectedGroup.value,
      selectedStores.value
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
const disablegrid = ref(true);
const insertupdatedelete = ref(1);
const addButton = () => {
  insertupdatedelete.value = 1;
  disablegrid.value = false;
  gridvalue1.value = 1;
  gridvalue2.value = 0;
  gridvalue3.value = 0;
  gridvalue4.value = "";
  gridvalue5.value = "00:00";
  gridvalue6.value = 1;

  setGridValue5.value = setGridValue5.value + 1;
};

const saveButton = async () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  if (gridvalue2.value == 0) {
    Swal.fire({
      title: "경고",
      text: "식사구분을 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  if (gridvalue3.value == 0) {
    Swal.fire({
      title: "경고",
      text: "회차를 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (gridvalue4.value == "" || gridvalue4.value.trim() === "") {
    Swal.fire({
      title: "경고",
      text: "시간대코드를 입력해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (gridvalue5.value == "00:00") {
    Swal.fire({
      title: "경고",
      text: "시간대를 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  try {
    store.state.loading = true;
    const res = await saveReserveTimeTable(
      selectedGroup.value,
      selectedStores.value,
      gridvalue1.value,
      gridvalue2.value,
      gridvalue3.value,
      gridvalue4.value,
      gridvalue5.value,
      gridvalue6.value,
      insertupdatedelete.value == 1
        ? "I"
        : insertupdatedelete.value == 2
        ? "U"
        : "D"
    );

    Swal.fire({
      title: "성공",
      text: "저장이 완료되었습니다.",
      icon: "success",
      confirmButtonText: "확인",
    });
    //console.log(res);
  } catch (error) {
  } finally {
    store.state.loading = false;
    searchButton();
  }
};

const deleteButton = () => {
  insertupdatedelete.value = 3;
  saveButton();
};
/* 매장 컴포넌트 관련 함수 */
const selectedGroup = ref();
const selectedStores = ref();
const selectedStoreAttrs = ref();

/**
 * 페이지 매장 코드 세팅
 */

const lngStoreCode = async (e) => {
  initGrid();
  selectedStores.value = e;
};
const lngStoreGroup = async (e) => {
  //initGrid();
  selectedGroup.value = e;
};

/**
 * 그리드 초기화
 */

const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
  afterSearch.value = false;
  gridvalue1.value = 0;
  gridvalue2.value = 0;
  gridvalue3.value = 0;
  gridvalue4.value = "";
  gridvalue5.value = "00:00";
  setGridValue5.value = setGridValue5.value + 1;
  gridvalue6.value = 0;
};

//엑셀 버튼 처리 함수
const exportExcel = ref(false);
/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  documentSubTitle.value = selectedExcelStore.value + "\n";

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
