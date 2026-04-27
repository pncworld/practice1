<!-- /*--############################################################################
# Filename : MST04_002INS.vue                                                  
# Description : 마스터관리 > 자재 마스터 > 자재 마스터 엑셀 업로드.         
# Date :2025-08-20                                                            
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <div
    class="flex h-full max-w-full min-h-0 flex-col gap-3 overflow-hidden pb-1 box-border">
    <!-- 상단: 페이지명 -->
    <div class="flex shrink-0 flex-wrap items-center justify-between gap-3">
      <PageName />
    </div>

    <!-- 엑셀 업로드: 라벨+입력 동일 줄 (MST04_001 조회조건과 동일 w-[8rem] 라벨) -->
    <div class="shrink-0 rounded-lg bg-gray-200 px-4 py-3">
      <div class="flex flex-col gap-y-3">
        <div class="flex min-w-0 flex-wrap items-center gap-2">
          <span
            class="w-[8rem] shrink-0 text-center text-base font-semibold text-gray-900"
            >파일선택</span
          >
          <input
            type="text"
            class="h-8 min-w-[22rem] max-w-[40rem] shrink-0 border border-black bg-white px-2 text-sm disabled:bg-white"
            v-model="fileName"
            disabled />
          <button type="button" :class="popupToolbarBtnClass" @click="FileChoice">
            파일선택
          </button>
          <input
            type="file"
            hidden
            ref="fileInput"
            @change="onFileChange"
            accept=".xlsx,.xls" />
          <button type="button" :class="popupToolbarBtnClass" @click="downloadFile">
            샘플 다운로드
          </button>
        </div>
        <div class="flex min-w-0 flex-wrap items-center gap-2">
          <span
            class="w-[8rem] shrink-0 text-center text-base font-semibold text-gray-900"
            >SHEET 선택</span
          >
          <select
            class="h-8 w-52 shrink-0 border border-black bg-white px-2 text-sm"
            @change="changeSheet"
            v-model="excelcond">
            <option :value="i.lngCode" v-for="i in SheetList" :key="i.lngCode">
              {{ i.strName }}
            </option>
          </select>
          <button type="button" class="button save shrink-0 md:w-auto" @click="saveButton">
            저장
          </button>
        </div>
      </div>
      <p class="mt-3 text-left text-sm leading-snug text-gray-700">
        ★전매장 사용 가능 자재로 등록됩니다.
      </p>
    </div>

    <!-- 미리보기 그리드 + 등록내역 조회 + 내역 그리드 (남은 높이 분할) -->
    <div class="flex min-h-0 min-w-0 flex-1 flex-col gap-3 overflow-hidden">
      <div
        class="flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border border-gray-300 bg-white shadow-sm">
        <div class="flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-auto">
          <Realgrid
            :progname="'MST04_002INS_VUE'"
            :progid="2"
            :rowData="rowData"
            :reload="reload"
            :setStateBar="false"
            :setGroupCustomLevel="2"
            :mergeColumns2="true"
            @clickedRowData="clickedRowData6"
            @dblclickedRowData="dblclickedRowData"
            :mergeColumnGroupName2="[
              ['발주/매입'],
              ['청구'],
              ['반품/이동'],
              ['실사/재고'],
              ['사용/손실'],
              ['단가'],
            ]"
            :mergeColumnGroupSubList2="[
              ['strOrderNCheckUOM', 'strOrderNCheckUOMFigure'],
              ['strDemandUOM', 'strDemandUOMFigure'],
              ['strReturnNMoveUOM', 'strReturnNMoveUOMFigure'],
              ['strRealNReportUOM', 'strRealNReportUOMFigure'],
              ['strUseNLossUOM', 'strUseNLossUOMFigure'],
              ['curUnitPrice', 'curSalesUnitPrice'],
            ]"
            :rowStateeditable="false">
          </Realgrid>
        </div>
      </div>

      <!-- 자재 마스터 등록 내역 조회 -->
      <div class="shrink-0 rounded-lg bg-gray-200 px-4 py-3">
        <div class="flex min-w-0 flex-wrap items-center justify-between gap-3">
          <span class="min-w-0 text-base font-semibold text-gray-900">
            자재 마스터 등록 내역 조회
          </span>
          <div class="flex shrink-0 flex-wrap items-center justify-end gap-2">
            <button type="button" class="button search shrink-0 md:w-auto w-14" @click="searchButton">
              조회
            </button>
            <button type="button" class="button save w-auto excel shrink-0" @click="excelButton">
              엑셀
            </button>
          </div>
        </div>
        <div
          class="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 lg:grid-cols-12 lg:items-center">
          <div class="flex min-w-0 items-center gap-2 lg:col-span-4">
            <span
              class="flex w-[8rem] shrink-0 items-center justify-center text-base font-semibold text-gray-900"
              >조회조건</span
            >
            <select
              class="h-8 min-w-0 flex-1 max-w-full border border-black bg-white px-2 text-sm"
              @change="changeCond"
              v-model="searchCond">
              <option value="1">최근업로드</option>
              <option value="2">자재코드</option>
              <option value="3">일자선택</option>
            </select>
          </div>
          <div
            v-show="searchCond == 2"
            class="flex min-w-0 flex-wrap items-center gap-2 lg:col-span-4">
            <input
              type="text"
              class="h-8 min-w-0 w-full max-w-[9rem] border border-black px-2 text-sm sm:max-w-[10rem]"
              @input="onlyNumber"
              v-model="cond" />
            <input
              type="text"
              class="h-8 min-w-0 w-full max-w-[9rem] border border-black px-2 text-sm sm:max-w-[10rem]"
              @input="onlyNumber"
              v-model="cond2" />
          </div>
          <div
            v-show="searchCond == 3"
            class="flex min-w-0 items-center gap-2 lg:col-span-4 lg:justify-start">
            <input type="date" class="h-8 border border-black px-2 text-sm" v-model="cond3" />
          </div>
        </div>
        <p class="mt-3 text-left text-sm leading-snug text-gray-700">
          ★엑셀 업로드 완료시 신규 업로드 내역이 자동 조회됩니다.
        </p>
      </div>

      <div
        class="flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border border-gray-300 bg-white shadow-sm">
        <div class="flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-auto">
          <Realgrid
            :progname="'MST04_002INS_VUE'"
            :progid="3"
            :rowData="rowData2"
            :reload="reload"
            :setStateBar="false"
            :setGroupCustomLevel="2"
            :mergeColumns2="true"
            :mergeColumnGroupName2="[['단위'], ['단가']]"
            :mergeColumnGroupSubList2="[
              [
                'strOrderNCheck',
                'strDemandUOM',
                'strReturnNMoveUOM',
                'strRealNreportUOM',
                'strUseNLossUOM',
              ],
              ['curUnitPrice', 'curSalesUnitPrice'],
            ]"
            :documentTitle="'MST04_002INS'"
            :documentSubTitle="documentSubTitle"
            :exporttoExcel="exportExcel"
            :rowStateeditable="false">
          </Realgrid>
        </div>
      </div>
    </div>
  </div>

  <Teleport to="body">
    <div
      v-if="openPop"
      class="fixed inset-0 z-[11000] flex items-center justify-center bg-black/40 px-3 py-4">
      <div
        role="dialog"
        aria-modal="true"
        class="flex h-[min(28rem,90vh)] w-full max-w-[34rem] flex-col rounded-lg border-2 border-gray-700 bg-white shadow-2xl">
        <div
          class="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-4 py-3">
          <h2 class="min-w-0 flex-1 pr-2 text-lg font-bold leading-tight text-gray-900">
            기 등록 동일 코드 품목 조회
          </h2>
          <div class="flex shrink-0 flex-wrap items-center justify-end gap-2">
            <button type="button" class="button save w-auto excel shrink-0" @click="excelButton2">
              엑셀
            </button>
            <button type="button" class="whitebutton shrink-0" @click="openPop = false">
              닫기
            </button>
          </div>
        </div>
        <div class="min-h-0 flex-1 overflow-hidden p-3">
          <div class="h-full min-h-[12rem] w-full min-w-0">
            <Realgrid
              :progname="'MST04_002INS_VUE'"
              :progid="4"
              :rowStateeditable="false"
              :exporttoExcel="exportExcel2"
              :documentTitle="'MST04_002INS'"
              :rowData="ErrorRowData"></Realgrid>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
  <!--그리드 영역 -->
</template>

<script setup>
import { getStockEnrollList, saveStockExcelData } from "@/api/master";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
/**
 *  매장  단일 선택 컴포넌트
 *  */

/**
 * 	그리드 생성
 */

import Realgrid from "@/components/realgrid.vue";
/**
 *  페이지로그 자동 입력
 *  */

import { formatLocalDate, insertPageLog } from "@/customFunc/customFunc";
import Swal from "sweetalert2";
/*
 * 공통 표준  Function
 */

import { onMounted, ref } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";

/** 발주등록 PUR03_035INS 팝업 · MST04_001INS 신규팝업과 동일한 흰 버튼 형식 */
const popupToolbarBtnClass =
  "whitebutton !h-9 !px-5 !py-2 !text-sm !font-semibold !border-gray-500 !text-gray-700 hover:!bg-blue-50 hover:!border-blue-400 disabled:opacity-50 disabled:pointer-events-none";
import { read, utils } from "xlsx-js-style";

const reload = ref(false);
const rowData = ref([]);
const rowData2 = ref([]);
const rowData3 = ref([]);
const rowData4 = ref([]);
const rowData5 = ref([]);
const afterSearch = ref(false);
const selectedstartDate = ref();
const selectedendDate = ref();
const cond = ref("");
const cond2 = ref("");
const today = new Date();
const cond3 = ref(formatLocalDate(today));

/**
 * 선택한 매출 시작일자
 */

const store = useStore();

const deleteLngCode = ref("");

const disabled2 = ref(false);

/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
});

/**
 *  조회 함수
 */

const filteredrowData = ref([]);
const searchButton = async () => {
  store.state.loading = true;
  try {
    initGrid();

    reload.value = !reload.value;

    let searchValue = "";
    let searchValue2 = "";

    if (searchCond.value == 2) {
      searchValue = cond.value;
      searchValue2 = cond2.value;
    } else if (searchCond.value == 3) {
      searchValue = cond3.value;
    } else if (searchCond.value == 1) {
      searchValue = "";
      searchValue2 = "";
    }
    const res = await getStockEnrollList(
      store.state.userData.lngStoreGroup,
      searchCond.value,
      searchValue,
      searchValue2
    );
    //console.log(res);

    rowData2.value = res.data.List;

    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
  } finally {
    store.state.loading = false;
  }
};

const selectedGroup = ref();
const addRow = ref(false);

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
 * 그리드 초기화
 */

const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
};

const exportExcel = ref(false);
const exportExcel2 = ref(false);

//comsole.log(store.state.minorCategory);

/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  exportExcel.value = !exportExcel.value;
};
const excelButton2 = () => {
  exportExcel2.value = !exportExcel2.value;
};

const datepicker = ref(null);

/**
 * 매출 일자 안 라디오박스 닫기 위한 외부 클릭 감지 함수
 */

const documentSubTitle = ref("");
const selectedExcelDate = ref("");

const saveNew = ref(true);
const ErrorRowData = ref([]);
const openPop = ref(false);
const saveButton = async () => {
  if (currentFile.value == null || currentFile.value == undefined) {
    Swal.fire({
      title: "경고",
      text: "저장할 자재 데이터를 먼저 업로드하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (updateRowData.value.length == 0) {
    Swal.fire({
      title: "경고",
      text: "저장할 자재 데이터가 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  try {
    store.state.loading = true;
    const lngStockIDs = updateRowData.value
      .map((item) => item.lngStockID)
      .join("\u200b");
    const strStockNames = updateRowData.value
      .map((item) => item.strStockName)
      .join("\u200b");
    const strStandardNames = updateRowData.value
      .map((item) => item.strStandardName)
      .join("\u200b");
    const strStockGroupNames = updateRowData.value
      .map((item) => item.strStockGroupName)
      .join("\u200b");
    const strCategoryNames = updateRowData.value
      .map((item) => item.strCategoryName)
      .join("\u200b");
    const strGenericNames = updateRowData.value
      .map((item) => item.strGenericName)
      .join("\u200b");
    const strTaxTypeNames = updateRowData.value
      .map((item) => item.strTaxTypeName)
      .join("\u200b");
    const strOrderNCheckUOMs = updateRowData.value
      .map((item) => item.strOrderNCheckUOM)
      .join("\u200b");
    const strOrderNCheckUOMFigures = updateRowData.value
      .map((item) => item.strOrderNCheckUOMFigure)
      .join("\u200b");
    const strDemandUOMs = updateRowData.value
      .map((item) => item.strDemandUOM)
      .join("\u200b");
    const strDemandUOMFigures = updateRowData.value
      .map((item) => item.strDemandUOMFigure)
      .join("\u200b");
    const strReturnNMoveUOMs = updateRowData.value
      .map((item) => item.strReturnNMoveUOM)
      .join("\u200b");
    const strReturnNMoveUOMFigures = updateRowData.value
      .map((item) => item.strReturnNMoveUOMFigure)
      .join("\u200b");
    const strRealNReportUOMs = updateRowData.value
      .map((item) => item.strRealNReportUOM)
      .join("\u200b");
    const strRealNReportUOMFigures = updateRowData.value
      .map((item) => item.strRealNReportUOMFigure)
      .join("\u200b");
    const strUseNLossUOMs = updateRowData.value
      .map((item) => item.strUseNLossUOM)
      .join("\u200b");
    const strUseNLossUOMFigures = updateRowData.value
      .map((item) => item.strUseNLossUOMFigure)
      .join("\u200b");
    const curUnitPrices = updateRowData.value
      .map((item) => item.curUnitPrice)
      .join("\u200b");
    const curSalesUnitPrices = updateRowData.value
      .map((item) => item.curSalesUnitPrice)
      .join("\u200b");
    const strSupplierNames = updateRowData.value
      .map((item) => item.strSupplierName)
      .join("\u200b");
    const strBarCodes = updateRowData.value
      .map((item) => item.strBarCode)
      .join("\u200b");

    const res = await saveStockExcelData(
      store.state.userData.lngStoreGroup,
      lngStockIDs,
      strStockNames,
      strStandardNames,
      strStockGroupNames,
      strCategoryNames,
      strGenericNames,
      strTaxTypeNames,
      strOrderNCheckUOMs,
      strOrderNCheckUOMFigures,
      strDemandUOMs,
      strDemandUOMFigures,
      strReturnNMoveUOMs,
      strReturnNMoveUOMFigures,
      strRealNReportUOMs,
      strRealNReportUOMFigures,
      strUseNLossUOMs,
      strUseNLossUOMFigures,
      curUnitPrices,
      curSalesUnitPrices,
      strSupplierNames,
      strBarCodes,
      store.state.userData.lngSequence
    );
    store.state.loading = false;
    console.log(res);
    if (res.data.ERROR_CD == "99") {
      await Swal.fire({
        title: "실패",
        text: `이미 등록된 품목과 동일한 코드의번호가 엑셀파일에 존재합니다. 엑셀파일의 자재코드 번호를 수정하십시오.  동일한 코드 번호의 품목을 확인 하시겠습니까?`,
        icon: "error",
        confirmButtonText: "확인",
        cancelButtonText: "취소",
        showCancelButton: true,
      }).then(async (result) => {
        if (result.isConfirmed) {
          ErrorRowData.value = res.data.ERROR_LIST;
          openPop.value = true;
        } else {
          fileName.value = "";
          rowData.value = [];
          SheetList.value = [];

          openPop.value = false;
        }
      });
      return;
    } else {
      await Swal.fire({
        title: "성공",
        text: "저장에 성공하였습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
      SheetList.value = [];
      excelcond.value = 1;
      fileName.value = "";
      rowData.value = [];
      updateRowData.value = [];
      return;
    }
  } catch (error) {
    store.state.loading = false;
  } finally {
    store.state.loading = false;
    //cleanButton();
  }
};

const saveNew2 = ref(true);

const downloadFile = () => {
  const link = document.createElement("a");
  link.href = "/sampleMaterial.xls"; // public 폴더 또는 정적 자원 경로
  link.download = "자재마스터샘플데이터.xls";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const fileInput = ref(null);
const FileChoice = () => {
  fileInput.value.click();
};

const SheetList = ref([]);
const excelcond = ref(1);
const currentFile = ref();
const updateRowData = ref([]);
const fileName = ref("");
const onFileChange = async (e) => {
  const file = e.target.files[0];
  //console.log(file);
  fileName.value = file.name;
  currentFile.value = file;
  excelcond.value = 1;
  SheetList.value = [];
  if (file) {
    const arrayBuffer = await file.arrayBuffer();
    // XLSX 라이브러리에서 arrayBuffer 사용 가능
    const workbook = read(arrayBuffer, { type: "array" });

    const sheetLength = workbook.SheetNames.length;

    for (let i = 0; i < sheetLength; i++) {
      SheetList.value.push({ lngCode: i + 1, strName: workbook.SheetNames[i] });
    }

    const result = await readFileWithArrayBuffer(file);
    //console.log(result);
  }
  e.target.value = "";
};

async function readFileWithArrayBuffer(file) {
  const arrayBuffer = await file.arrayBuffer();
  // XLSX 라이브러리에서 arrayBuffer 사용 가능
  const workbook = read(arrayBuffer, { type: "array" });

  const sheetName = workbook.SheetNames[excelcond.value - 1];
  const sheet = workbook.Sheets[sheetName];
  const jsonData = utils.sheet_to_json(sheet, { header: 1 });

  const header = [
    "lngStockID",
    "strStockName",
    "strStandardName",
    "strStockGroupName",
    "strCategoryName",
    "strGenericName",
    "strTaxTypeName",
    "strOrderNCheckUOM",
    "strOrderNCheckUOMFigure",
    "strDemandUOM",
    "strDemandUOMFigure",
    "strReturnNMoveUOM",
    "strReturnNMoveUOMFigure",
    "strRealNReportUOM",
    "strRealNReportUOMFigure",
    "strUseNLossUOM",
    "strUseNLossUOMFigure",
    "curUnitPrice",
    "curSalesUnitPrice",
    "strSupplierName",
    "strBarCode",
  ];

  const rows = jsonData.slice(2); // 실제 데이터 행들
  console.log(rows);
  rowData.value = rows
    .filter((item) => item.length !== 0)
    .map((row) => {
      const obj = {};
      header.forEach((key, i) => {
        obj[key] = row[i];
      });
      return obj;
    });
  //   rowData.value = rowData.value.map((item) => ({
  //     ...item,
  //     strSaleCustStatus: 0,
  //     strSaleCustStatusTxt: "정상",
  //   }));
  updateRowData.value = JSON.parse(JSON.stringify(rowData.value));
  ////console.log(updateRowData.value);
  return jsonData;
}

const changeSheet = (e) => {
  if (currentFile.value == null || currentFile.value == undefined) {
    return;
  }
  readFileWithArrayBuffer(currentFile.value);
};

const searchCond = ref(1);
const changeCond = (e) => {
  searchCond.value = e.target.value;
};

const onlyNumber = (e) => {
  ////console.log(e);
  e.target.value = e.target.value.replace(/[^0-9]/g, "");
};
</script>

<style></style>
