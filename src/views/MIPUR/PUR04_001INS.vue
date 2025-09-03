<!-- /*--############################################################################
# Filename : PUR04_001INS.vue                                                  
# Description : 구매관리2 > 단가 관리 > 매입 단가 등록                      
# Date :2025-08-28                                                             
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
        <button @click="copyButton" class="button copy w-auto excel">
          복사
        </button>
      </div>
    </div>
    <div
      class="grid grid-cols-2 grid-rows-2 bg-gray-200 rounded-lg h-24 items-start z-10">
      <div class="justify-start flex ml-4">
        <PickStore
          @update:storeGroup="lngStoreGroup"
          :defaultStoreNm="'전체'"
          @storeNm="excelStore"
          :hideGroup="false"
          :hideAttr="false"
          :defaultStore="true"
          @update:storeCd="lngStoreCode"></PickStore>
      </div>
      <div class="flex justify-start items-center">
        <BusinessClient
          @SupplierId="SupplierId"
          :defaultNm="'전체'"></BusinessClient>
      </div>

      <div class="flex space-x-5 ml-12 mt-3 items-center">
        <div class="font-semibold text-base">자재코드</div>
        <div>
          <input
            type="text"
            class="h-7 border border-black pl-1"
            @input="onlyNumber"
            v-model="cond" />
        </div>
      </div>
      <div class="flex space-x-5 ml-0 mt-3 items-center">
        <div class="text-base font-semibold">자재명</div>
        <div>
          <input
            type="text"
            class="w-64 h-7 border border-black"
            v-model="cond2" />
        </div>
      </div>
    </div>
    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="grid grid-rows-1 grid-cols-2 h-[75vh] mt-1 gap-2">
      <div>
        <Realgrid
          :progname="'PUR04_001INS_VUE'"
          :progid="1"
          :rowData="rowData"
          :reload="reload"
          :setRowStyleCalls="true"
          :setRowStyleCallsDefaultCol="'strTaxType'"
          :setRowStyleCallsDefaultCol2="'strStockName'"
          :hardCodeSetRowStyleCalls="true"
          :documentTitle="'PUR01_009RPT'"
          @dblclickedRowData="dblclickedRowData"
          @clickedRowData="clickedRowData"
          :documentSubTitle="documentSubTitle"
          :rowStateeditable="false"
          :exporttoExcel="exportExcel">
        </Realgrid>
      </div>
      <div class="w-full">
        <div class="grid grid-rows-[1fr,3fr,22fr] grid-cols-1">
          <div class="flex justify-between">
            <div class="text-bold text-red-500">
              ※매입단가 : 발주/매입 금액 단위 금액
            </div>
            <div class="flex space-x-2">
              <button class="whitebutton" @click="addButton">신규</button>
              <button class="whitebutton" @click="saveButton">저장</button>
              <button class="whitebutton" @click="deleteButton">삭제</button>
            </div>
          </div>
          <div class="grid grid-rows-3 grid-cols-[1fr,3fr,1fr,3fr]">
            <div
              class="border-l border-t border-black font-semibold text-base bg-gray-100 text-center flex items-center justify-center">
              거래처
            </div>
            <div class="border-l border-t border-black !flex !items-center">
              <BusinessClient
                @SupplierId="SupplierId2"
                :selectSupplierId="supplierid2"
                :defaultName="''"
                class="!mt-0 !-ml-3"></BusinessClient>
            </div>
            <div
              class="border-l border-t border-black font-semibold text-base bg-gray-100 text-center flex items-center justify-center">
              부가세 구분
            </div>
            <div class="border-l border-t border-black !flex !items-center">
              <label for="scond"
                ><input
                  type="checkbox"
                  class="ml-2"
                  id="scond"
                  v-model="scond" />포함</label
              >
            </div>
            <div
              class="border-l border-t border-black font-semibold text-base bg-gray-100 text-center flex items-center justify-center">
              단가
            </div>
            <div class="border-l border-t border-black !flex !items-center">
              <input
                type="text"
                name="curUnitPrice"
                class="ml-2 border border-black pl-1 disabled:bg-gray-300"
                @input="onlyNumber2"
                :disabled="disabled"
                v-model="scond2" />
            </div>
            <div
              class="border-l border-t border-black font-semibold text-base bg-gray-100 text-center flex items-center justify-center">
              단가(VAT포함)
            </div>
            <div class="border-l border-t border-black !flex !items-center">
              <input
                type="text"
                name="curUnitPrice2"
                class="ml-2 border border-black pl-1 disabled:bg-gray-300"
                @input="onlyNumber2"
                :disabled="!disabled"
                v-model="scond3" />
            </div>
            <div
              class="border-l border-t border-b border-black font-semibold text-base bg-gray-100 text-center flex items-center justify-center">
              적용일
            </div>
            <div
              class="border-l border-t border-b border-black !flex !items-center">
              <input
                type="date"
                v-model="scond4"
                class="ml-2 border border-black pl-1 disabled:bg-gray-300 w-[65%]" />
            </div>
            <div
              class="border-l border-t border-b border-black font-semibold text-base bg-gray-100 text-center flex items-center justify-center">
              구분(주/부)
            </div>
            <div
              class="border-l border-t border-b border-black !flex !items-center">
              <select
                name=""
                id=""
                class="border border-black w-[65%] ml-2"
                v-model="scond5">
                <option value="0">선택</option>
                <option :value="i.strDCode" v-for="i in optionList">
                  {{ i.strDName }}
                </option>
              </select>
            </div>
          </div>

          <div class="h-full w-full">
            <Realgrid
              :progname="'PUR04_001INS_VUE'"
              :progid="2"
              :rowStateeditable="false"
              @clickedRowData="clickedRowData2"
              :rowData="rowData2"></Realgrid>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div
    v-if="openCopy"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <!-- 팝업 박스 -->
    <div class="bg-white rounded-2xl shadow-lg w-[60vw] h-[70vh] p-6 relative">
      <div class="flex justify-between">
        <h2 class="text-xl font-bold mb-4">복사</h2>
        <!-- 버튼 영역 -->
        <div class="flex justify-end space-x-2">
          <button
            class="px-4 py-2 bg-blue-600 text-white rounded-lg"
            @click="confirmAction">
            복사
          </button>
          <button
            class="px-4 py-2 bg-gray-300 rounded-lg"
            @click="openCopy = false">
            닫기
          </button>
        </div>
      </div>
      <div class="flex items-center space-x-5">
        <div class="!-ml-12">
          <PickStore
            @update:storeGroup="lngStoreGroup"
            :defaultStoreNm="'공통'"
            @storeNm="excelStore"
            :hideGroup="false"
            :hideAttr="false"
            :defaultStore="true"
            @update:storeCd="lngStoreCode"></PickStore>
        </div>
      </div>
      <div class="grid grid-rows-1 grid-cols-[6fr,1fr,6fr] mt-2 h-[80%]">
        <div class="h-full w-full">
          <Realgrid
            :progname="'PUR04_001INS_VUE'"
            :progid="3"
            :rowData="rowData3"></Realgrid>
        </div>
        <div>&nbsp;</div>
        <div class="h-full w-full">
          <Realgrid :progname="'PUR04_001INS_VUE'" :progid="4"></Realgrid>
        </div>
      </div>
    </div>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import { getCommonList } from "@/api/common";
import {
  deleteStockPriceHistory,
  getCheckStoreList,
  getStockUnitPriceList,
  getUnitPriceDetailList,
  saveStockPriceHistory,
} from "@/api/mipur";
import BusinessClient from "@/components/businessClient.vue";
import DupliPopUp7 from "@/components/dupliPopUp7.vue";
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

import { formatLocalDate, insertPageLog } from "@/customFunc/customFunc";
import Swal from "sweetalert2";
/**
 *  경고창 호출 라이브러리
 *  */

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

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getCommonList(35);

  optionList.value = res.data.List;

  scond4.value = formatLocalDate(new Date());
});

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

const cond = ref("");
const cond2 = ref("");
const cond4 = ref("");
const cond5 = ref(0);
const store = useStore();

const datepicker = ref(null);
const closePopUp = ref(false);
const optionList = ref([]);
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

const sDate = ref();
const eDate = ref();
const startDate = (e) => {
  initGrid();
  sDate.value = e;
};
const endDate = (e) => {
  initGrid();
  eDate.value = e;
};

const selectedDate = ref();
const excelDate = (e) => {
  selectedDate.value = e;
};
const optionList2 = ref([]);

const teamcode = ref();
const lngTeamCode = (e) => {
  teamcode.value = e;
};
const supervisor = ref();
const lngSupervisor = (e) => {
  supervisor.value = e;
};
const storeCode = ref();
const lngStoreCode = (e) => {
  initGrid();
  storeCode.value = e;
};

const storeAttr = ref();
const lngStoreAttrs = (e) => {
  storeAttr.value = e;
};

const groupCd = ref();
const lngStoreGroup = (e) => {
  groupCd.value = e;
};

const supplierid = ref("");
const SupplierId = (e) => {
  supplierid.value = e;
};

const supplierid2 = ref("");
const SupplierId2 = (e) => {
  supplierid2.value = e;
};
/**
 *  조회 함수
 */
const hideColumnsId = ref([]);
const searchButton = async () => {
  try {
    store.state.loading = true;
    initGrid();

    const res = await getStockUnitPriceList(
      groupCd.value,
      storeCode.value,
      supplierid.value,
      cond.value,
      cond2.value,
      store.state.userData.strLanguage
    );

    rowData.value = res.data.List;
    //console.log(res);
    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    //comsole.log(error);
  } finally {
    store.state.loading = false;
  }
};

/**
 * 페이지 매장 코드 세팅
 */

/**
 * 그리드 초기화
 */

const progid = ref(1);
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
    selectedDate.value + "\n" + "매장명 :" + selectedExcelStore.value;
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

const onlyNumber = (e) => {
  e.target.value = e.target.value.replace(/[^0-9]/g, "");
};

const onlyNumber2 = (e) => {
  e.target.value = e.target.value.replace(/[^0-9]/g, "");

  if (e.target.name == "curUnitPrice") {
    if (isNaN(scond2.value)) {
      scond3.value = "";
    } else {
      scond3.value =
        parseInt(scond2.value) + Math.floor(parseInt(scond2.value) * 0.1);
    }
  } else if (e.target.name == "curUnitPrice2") {
    if (isNaN(scond3.value)) {
      scond2.value = "";
    } else {
      scond2.value = Math.round((parseInt(scond3.value) * 10) / 11);
    }
  }
};

const rowData2 = ref([]);
const afterDblClick = ref(false);

const scond = ref(false);
const scond2 = ref("");
const scond3 = ref("");
const scond4 = ref("");
const scond5 = ref(0);
const tempStockId = ref("");
const dblclickedRowData = async (e) => {
  //console.log(e);

  try {
    const res = await getUnitPriceDetailList(
      groupCd.value,
      storeCode.value,
      supplierid.value,
      e[1],
      store.state.userData.strLanguage
    );

    //console.log(res);

    rowData2.value = res.data.List;
    afterDblClick.value = true;
    tempStockId.value = e[1];
    tempFromDate.value = "";
    tempTodate.value = "";
    tempSupplierId.value = "";
  } catch (error) {}
};

const addButton = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }

  if (afterDblClick.value == false) {
    Swal.fire({
      title: "경고",
      text: "자재코드를 먼저 선택해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }

  supplierid2.value = 0;
  scond.value = false;
  scond2.value = "";
  scond3.value = "";
  scond4.value = formatLocalDate(new Date());
  scond5.value = 0;
};

const disabled = ref(false);
watch(scond, () => {
  if (scond.value == false) {
    disabled.value = false;
  } else {
    disabled.value = true;
  }
});

const saveButton = async () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }

  if (afterDblClick.value == false) {
    Swal.fire({
      title: "경고",
      text: "자재코드를 먼저 선택해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }

  if (supplierid2.value == 0) {
    Swal.fire({
      title: "경고",
      text: "거래처를 선택해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }

  if (supplierid2.value == 0) {
    Swal.fire({
      title: "경고",
      text: "거래처를 선택해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }

  if (
    scond2.value == false &&
    (scond3.value == "" || scond3.value == undefined)
  ) {
    Swal.fire({
      title: "경고",
      text: "단가를 입력해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }

  if (
    scond2.value == true &&
    (scond4.value == "" || scond4.value == undefined)
  ) {
    Swal.fire({
      title: "경고",
      text: "단가를 입력해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }

  if (scond5.value == 0) {
    Swal.fire({
      title: "경고",
      text: "구분을 선택해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }

  try {
    const res = await saveStockPriceHistory(
      groupCd.value,
      storeCode.value,
      supplierid2.value,
      tempStockId.value,
      scond2.value,
      scond4.value.replaceAll("-", ""),
      scond5.value,
      store.state.userData.lngSequence
    );

    //console.log(res);

    if (res.data.RESULT_CD == "00") {
      Swal.fire({
        title: "성공",
        text: "저장을 완료하였습니다.",
        icon: "success",

        confirmButtonText: "확인",
      });
    } else {
      Swal.fire({
        title: "실패",
        text: "저장에 실패하였습니다. 적용일을 확인해주세요.",
        icon: "error",

        confirmButtonText: "확인",
      });
    }
  } catch (error) {
  } finally {
    try {
      const res = await getUnitPriceDetailList(
        groupCd.value,
        storeCode.value,
        supplierid.value,
        tempStockId.value,
        store.state.userData.strLanguage
      );

      //console.log(res);

      rowData2.value = res.data.List;
      afterDblClick.value = true;
    } catch (error) {}
  }
};

const tempFromDate = ref("");
const tempTodate = ref("");
const tempSupplierId = ref("");
const clickedRowData2 = (e) => {
  ////console.log(e);
  tempSupplierId.value = e[0];
  tempFromDate.value = e[3];
  tempTodate.value = e[5];
};

const deleteButton = async () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
  }
  if (tempSupplierId.value == "" || tempSupplierId.value == undefined) {
    Swal.fire({
      title: "경고",
      text: "삭제할 항목을 선택해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
  }

  try {
    const res = await deleteStockPriceHistory(
      groupCd.value,
      storeCode.value,
      tempSupplierId.value,
      tempStockId.value,
      tempFromDate.value,
      tempTodate.value
    );

    if (res.data.RESULT_CD == "00") {
      Swal.fire({
        title: "성공",
        text: "삭제를 완료하였습니다.",
        icon: "success",

        confirmButtonText: "확인",
      });
    } else {
      Swal.fire({
        title: "실패",
        text: "삭제를 실패하였습니다.",
        icon: "error",

        confirmButtonText: "확인",
      });
    }
  } catch (error) {
  } finally {
    try {
      const res = await getUnitPriceDetailList(
        groupCd.value,
        storeCode.value,
        supplierid.value,
        tempStockId.value,
        store.state.userData.strLanguage
      );

      //console.log(res);

      rowData2.value = res.data.List;
      afterDblClick.value = true;
    } catch (error) {}
  }
};

const openCopy = ref(false);
const copyButton = async () => {
  openCopy.value = true;

  try {
    const res = await getCheckStoreList(groupCd.value, 0);

    rowData3.value = res.data.List;
  } catch (error) {}
};

const rowData3 = ref([]);
</script>
