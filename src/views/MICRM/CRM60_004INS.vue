<!-- /*--############################################################################
# Filename : CRM60_004INS.vue                                                  
# Description : 고객관리 > 전자상품권 현황 > 전자상품권 생성     
# Date :2025-06-20                                                            
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
        <button @click="addButton" class="button new md:w-auto w-14">
          신규
        </button>
        <button @click="excelButton" class="button save w-auto excel">
          엑셀
        </button>
      </div>
    </div>
    <div
      class="grid grid-cols-[1fr,1fr,1.5fr] grid-rows-2 bg-gray-200 rounded-lg h-16 items-start z-10 justify-start">
      <div class="justify-start">
        <Datepicker2
          :mainName="'생성일자'"
          @startDate="startDate"
          :initToday="1"
          :initToday3="true"
          @excelDate="excelDate"
          @endDate="endDate"></Datepicker2>
      </div>
      <div class="justify-center flex items-center !-mr-16 mt-2">
        <span class="text-base font-semibold">상품권구분 </span>
        <select name="" id="" class="ml-5 w-40 h-8" v-model="cond">
          <option value="0">전체</option>
          <option :value="i.lngGftCategory" v-for="i in optionList">
            {{ i.strGftCategory }}
          </option>
        </select>
      </div>

      <div
        class="text-base flex justify-start font-semibold pl-32 mt-2 items-center">
        <span class="text-base font-semibold"> 권종 </span>
        <select name="" id="" class="w-40 ml-5 h-8" v-model="cond3">
          <option value="0">전체</option>
          <option :value="i.lngGftType" v-for="i in optionList2">
            {{ i.strGftType }}
          </option>
        </select>
      </div>
    </div>
    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="w-full h-[75%]">
      <Realgrid
        :progname="'CRM60_004INS_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :documentTitle="'CRM60_004INS'"
        :documentSubTitle="documentSubTitle"
        :rowStateeditable="false"
        :exporttoExcel="exportExcel">
      </Realgrid>
    </div>
  </div>

  <div
    v-if="visible"
    class="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
    <div class="bg-white rounded-2xl shadow-lg p-6 w-[40vw] h-[40vh]">
      <h2 class="text-lg font-bold mb-4 text-center">전자상품권 신규 생성</h2>
      <div class="grid grid-rows-4 grid-cols-[1fr,3fr] h-[60%]">
        <div
          class="text-base font-semibold border-l border-t border-black flex justify-center items-center bg-gray-100">
          <span class="text-red-500 text-xl">*</span>구분
        </div>
        <div
          class="text-base font-semibold border-l border-t border-black flex justify-start pl-2 items-center">
          <select
            name=""
            id=""
            class="ml-3 w-52 h-[90%] border border-black"
            v-model="pcond">
            <option value="0">선택</option>
            <option :value="i.lngGftCategory" v-for="i in optionList">
              {{ i.strGftCategory }}
            </option>
          </select>
        </div>
        <div
          class="text-base font-semibold border-l border-t border-black flex justify-center bg-gray-100 items-center">
          <span class="text-red-500 text-xl">*</span>권종
        </div>
        <div
          class="text-base font-semibold border-l border-t border-black flex justify-start pl-2 items-center">
          <select
            name=""
            id=""
            class="w-52 ml-3 h-[90%] border border-black"
            v-model="pcond3">
            <option value="0">선택</option>
            <option :value="i.lngGftType" v-for="i in optionList2">
              {{ i.strGftType }}
            </option>
          </select>
        </div>
        <!-- <div
          class="text-base font-semibold border-l border-t border-black flex justify-center bg-gray-100 items-center">
          이미지
        </div>
        <div
          class="text-base font-semibold border-l border-t border-black flex justify-start items-center">
          <input
            type="file"
            class="w-[80%] ml-3 h-[90%] border border-black"
            accept=".jpg, .jpeg, image/jpeg"
            @change="FileChange" />
        </div> -->
        <div
          class="text-base font-semibold border-l border-t border-black flex justify-center bg-gray-100 items-center">
          <span class="text-red-500 text-xl">*</span>생성수량
        </div>
        <div
          class="text-base font-semibold border-l border-t border-black flex justify-centeritems-center items-center">
          <input
            type="number"
            class="w-[80%] ml-3 h-[90%] border border-black"
            v-model="pcond4" />
        </div>
        <div
          class="text-base font-semibold border-l border-t border-black flex justify-center bg-gray-100 items-center">
          유효기간
        </div>
        <div
          class="text-base font-semibold border-l border-t border-black flex justify-centeritems-center items-center">
          <input
            type="date"
            class="w-[80%] ml-3 h-[90%] border border-black"
            v-model="cond4" />
        </div>
      </div>

      <div class="flex space-x-2">
        <button
          class="mt-4 w-full bg-gray-800 text-white py-2 rounded-xl"
          @click="saveButton">
          저장
        </button>

        <button
          class="mt-4 w-full bg-gray-800 text-white py-2 rounded-xl"
          @click="visible = false">
          닫기
        </button>
      </div>
    </div>
  </div>

  <!-- 그리드 영역 -->
</template>

<script setup>
import { getCommonList } from "@/api/common";
import {
  getGftLedgerCreateList,
  getInitGftData,
  saveNewGftCard,
} from "@/api/micrm";
import Datepicker2 from "@/components/Datepicker2.vue";
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

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getCommonList(254);

  optionList3.value = res.data.List;
  const res2 = await getInitGftData(store.state.userData.lngStoreGroup);

  optionList.value = res2.data.List;
  optionList2.value = res2.data.List2;

  cond4.value = today.value.toISOString().split("T")[0];
});

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);
const selectedCond = ref(0);
const condValue = ref(0);
const cond = ref(0);
const cond2 = ref(null);

const today = ref(new Date());
const cond3 = ref(0);
const pcond3 = ref(0);
const pcond4 = ref(1);
const pcond = ref(0);
const cond4 = ref();
const store = useStore();
const optionList = ref([]);
const optionList2 = ref([]);
const optionList3 = ref([]);
const datepicker = ref(null);
const closePopUp = ref(false);

const sd = ref("");
const sd2 = ref("");
const ed = ref("");
const ed2 = ref("");
const selectedDate = ref("");
const startDate = (e) => {
  sd.value = e;
};
const endDate = (e) => {
  ed.value = e;
};

const excelDate = (e) => {
  selectedDate.value = e;
};

const FileChange = (e) => {
  const file = event.target.files[0];
  if (file) {
    cond2.value = file; // cond2에 파일 객체 저장
    console.log("선택한 파일:", cond2.value);
  }
};
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
const visible = ref(false);
const addButton = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  visible.value = true;
};
const searchButton = async () => {
  if (sd.value == null || ed.value == null) {
    Swal.fire({
      title: "경고",
      text: "생성일자을 선택하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  try {
    store.state.loading = true;
    initGrid();

    const res = await getGftLedgerCreateList(
      store.state.userData.lngStoreGroup,
      cond.value,
      cond3.value,
      sd.value,
      ed.value
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
const selectedStores = ref();
const selectedStoreAttrs = ref();

const saveButton = async () => {
  if (pcond.value == 0 || pcond3.value == 0 || pcond4.value == 0) {
    Swal.fire({
      title: "경고",
      text: "필수 사항이 누락되었습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  try {
    const res = await saveNewGftCard(
      store.state.userData.lngStoreGroup,
      pcond.value,
      pcond3.value,
      "",
      pcond4.value,
      cond4.value,
      1
    );
    console.log(res);
  } catch (error) {
    console.log(error);
  } finally {
    visible.value = false;
    searchButton();
  }
};
/**
 * 페이지 매장 코드 세팅
 */

const lngStoreCode = async (e) => {
  initGrid();
  selectedStores.value = e;
  console.log(e);
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
  documentSubTitle.value = selectedDate.value;

  exportExcel.value = !exportExcel.value;
};

// 엑셀 추출
const documentSubTitle = ref("");
const selectedExcelList = ref("");

const selectedExcelStore = ref("");
/**
 * 엑셀용 매장 세팅 함수
 */

const excelStore = (e) => {
  selectedExcelStore.value = e;
  //comsole.log(e);
};
const excelList = (e) => {
  selectedExcelList.value = e;
  //comsole.log(e);
};
</script>
