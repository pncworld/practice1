/*--############################################################################
# Filename : CRM10_020INS.vue                                                  
# Description : 마스터관리 > 예약 관리 > 예약단체테이블.                        
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
      <div>
        <PickStore
          :hideGroup="false"
          :hideAttr="false"
          @update:storeCd="lngStoreCode"
          @update:storeGroup="lngStoreGroup"
          @storeNm="excelStore">
        </PickStore>
      </div>
    </div>
    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="w-full h-[80%] grid grid-rows-1 grid-cols-[7fr,5fr]">
      <Realgrid
        :progname="'CRM10_020INS_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :setStateBar="false"
        @clickedRowData="clickedRowData"
        :documentTitle="'CRM10_020INS'"
        :dynamicRowHeight="true"
        :documentSubTitle="documentSubTitle"
        :rowStateeditable="false"
        :exporttoExcel="exportExcel">
      </Realgrid>
      <div class="w-[70%] h-[20vh] mt-10 ml-10">
        <div
          class="grid grid-rows-4 grid-cols-[1fr,3fr] border w-full h-full border-black">
          <div class="border border-black flex justify-center items-center">
            테이블그룹
          </div>
          <div class="border border-black flex justify-center items-center">
            <input
              type="number"
              :disabled="disablegrid"
              v-model="gridvalue1"
              class="w-[70%] h-[70%] border border-black pl-1" />
          </div>
          <div class="border border-black flex justify-center items-center">
            테이블그룹명
          </div>
          <div class="border border-black flex justify-center items-center">
            <input
              type="text"
              :disabled="disablegrid"
              v-model="gridvalue2"
              class="w-[70%] h-[70%] border border-black pl-1" />
          </div>
          <div class="border border-black flex justify-center items-center">
            좌석수
          </div>
          <div class="border border-black flex justify-center items-center">
            <input
              type="number"
              :disabled="disablegrid"
              v-model="gridvalue3"
              class="w-[70%] h-[70%] border border-black pl-1" />
          </div>
          <div class="border border-black flex justify-center items-center">
            사용여부
          </div>
          <div class="border border-black flex justify-center items-center">
            <select
              name=""
              id=""
              v-model="gridvalue4"
              class="w-[70%] h-[70%] border border-black pl-1">
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
  getReservedNum,
  getReserveTeamTable,
  saveReserveNum,
  saveReserveTeamTable,
} from "@/api/micrm";
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

import { onMounted, ref } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";
/**
 * 	화면 Load시 실행 스크립트
 */

const optionList3 = ref([]);

const gridvalue1 = ref();
const gridvalue2 = ref();
const gridvalue3 = ref();
const gridvalue4 = ref(1);

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res3 = await getCommonList(45);

  optionList3.value = res3.data.List;

  reload.value = !reload.value;
});

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

const store = useStore();

const clickedRowData = (e) => {
  disablegrid.value = true;
  insertupdatedelete.value = 2;
  gridvalue1.value = e[0];
  gridvalue2.value = e[1];
  gridvalue3.value = e[2];
  gridvalue4.value = e[4];
};

/**
 *  조회 함수
 */

const searchButton = async () => {
  try {
    store.state.loading = true;
    initGrid();
    reload.value = !reload.value;
    const res = await getReserveTeamTable(
      selectedGroup.value,
      selectedStores.value
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
const disablegrid = ref(true);
const insertupdatedelete = ref(1);
const addButton = () => {
  insertupdatedelete.value = 1;
  disablegrid.value = false;
  gridvalue1.value = "";
  gridvalue2.value = "";
  gridvalue3.value = 0;
  gridvalue4.value = 0;
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
  if (gridvalue1.value == "") {
    Swal.fire({
      title: "경고",
      text: "테이블그룹을 입력해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  // if (gridvalue3.value == 0) {
  //   Swal.fire({
  //     title: "경고",
  //     text: "회차를 선택해주세요.",
  //     icon: "warning",
  //     confirmButtonText: "확인",
  //   });
  //   return;
  // }

  try {
    store.state.loading = true;
    const res = await saveReserveTeamTable(
      selectedGroup.value,
      selectedStores.value,
      gridvalue1.value,
      gridvalue2.value,
      gridvalue3.value,
      gridvalue4.value,

      insertupdatedelete.value == 1
        ? "I"
        : insertupdatedelete.value == 2
        ? "U"
        : "D"
    );

    //console.log(res);
    if (res.data.RESULT_CD == "99") {
      Swal.fire({
        title: "실패",
        text: "저장에 실패하였습니다.",
        icon: "error",
        confirmButtonText: "확인",
      });
    } else {
      Swal.fire({
        title: "성공",
        text: "저장이 완료되었습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
    }

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
  gridvalue1.value = "";
  gridvalue2.value = "";
  gridvalue3.value = 0;
  gridvalue4.value = "0";
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
