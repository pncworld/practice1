<!-- /*--############################################################################
# Filename : MST04_002INS.vue                                                  
# Description : 마스터관리 > 자재 마스터 > 자재 마스터 엑셀 업로드.         
# Date :2025-08-20                                                            
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <!-- 조회 조건 -->
  <div class="h-full" @click="handleParentClick">
    <div class="flex justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
    </div>
    <div
      class="grid grid-cols-1 grid-rows-2 justify-between bg-gray-200 rounded-lg h-20 items-start z-10">
      <div class="flex ml-[77px] mt-2 items-center space-x-5">
        <div class="font-semibold text-base">파일선택</div>
        <div>
          <input
            type="text"
            class="h-7 disabled:bg-white"
            v-model="fileName"
            disabled />
        </div>
        <div>
          <button class="whitebutton !bg-white" @click="FileChoice">
            파일선택
          </button>
          <input
            type="file"
            hidden
            ref="fileInput"
            @change="onFileChange"
            accept=".xlsx,.xls" />
        </div>
        <div>
          <button class="whitebutton !bg-white" @click="downloadFile">
            샘플 다운로드
          </button>
        </div>
      </div>
      <div class="flex ml-12 mt-2 items-center space-x-5">
        <div class="font-semibold text-base">SHEET 선택</div>
        <div>
          <select
            name=""
            id=""
            class="w-52 h-7"
            @change="changeSheet"
            v-model="excelcond">
            <option :value="i.lngCode" v-for="i in SheetList">
              {{ i.strName }}
            </option>
          </select>
        </div>
        <div class="flex space-x-5 items-center">
          <button class="whitebutton !bg-white" @click="saveButton">
            저장
          </button>
          <div>★전매장 사용 가능 자재로 등록됩니다.</div>
        </div>
      </div>
    </div>
    <!-- 조회 조건 -->
    <!--그리드 영역 -->

    <div class="w-[100%] h-[30vh] grid-rows-2 grid-cols-1">
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

    <div
      class="grid grid-cols-1 grid-rows-3 justify-between bg-gray-200 rounded-lg h-24 items-start z-10 mt-2">
      <div class="text-2xl font-bold ml-12 flex space-x-5 items-center">
        <div>자재 마스터 등록 내역 조회.</div>
        <div>
          <button class="whitebutton bg-white" @click="searchButton">
            조회
          </button>
        </div>
        <div>
          <button class="whitebutton bg-white" @click="excelButton">
            엑셀
          </button>
        </div>
      </div>
      <div class="ml-12 flex space-x-5 items-center">
        <div class="text-base font-semibold">조회조건</div>
        <div class="flex items-center">
          <select
            name=""
            id=""
            class="h-7"
            @change="changeCond"
            v-model="searchCond">
            <option value="1">최근업로드</option>
            <option value="2">자재코드</option>
            <option value="3">일자선택</option>
          </select>
        </div>
        <div v-show="searchCond == 2">
          <input type="text" @input="onlyNumber" v-model="cond" />
        </div>
        <div v-show="searchCond == 2">
          <input type="text" @input="onlyNumber" v-model="cond2" />
        </div>
        <div v-show="searchCond == 3">
          <input type="date" v-model="cond3" />
        </div>
      </div>
      <div class="flex justify-center">
        ★엑셀 업로드 완료시 신규 업로드 내역이 자동 조회됩니다.
      </div>
    </div>

    <div class="w-[100%] h-[30vh] grid-rows-2 grid-cols-1">
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
const cond4 = ref(0);
const cond5 = ref(0);
const cond6 = ref(0);
const cond7 = ref(0);
const cond8 = ref("");

const scond = ref("");
const scond2 = ref("");
const scond3 = ref("0");
const scond4 = ref("0");
const scond5 = ref("0");
const scond6 = ref("0");
const scond7 = ref("0");
const scond8 = ref("0");
const scond9 = ref("0");
const scond10 = ref("0");
const scond11 = ref("");
const scond12 = ref("0");
const scond13 = ref("");
const scond14 = ref("0");
const scond15 = ref("");
const scond16 = ref("0");
const scond17 = ref("");
const scond18 = ref("0");
const scond19 = ref("");
const scond20 = ref("0");
const scond21 = ref(false);
const scond22 = ref("");
const scond23 = ref("");
const scond24 = ref("");
const scond25 = ref("");
const scond26 = ref("");
const scond27 = ref("Y");

const sscond = ref("");
const sscond2 = ref("");

const sscond3 = ref("");
const sscond4 = ref("");

const sscond5 = ref("");
const sscond6 = ref("");

const sscond7 = ref("");
const sscond8 = ref("");

const optionList = ref([]);
const optionList2 = ref([]);
const optionList3 = ref([]);
const optionList4 = ref([]);
const optionList5 = ref([]);
const optionList6 = ref([]);
const optionList7 = ref([]);
const optionList8 = ref([]);
const optionList9 = ref([]);
const optionList10 = ref([]);
const setGroupColumnId = ref("");

const addRow2 = ref(false);
const addRow3 = ref(false);
const addRow4 = ref(false);
const addRow5 = ref(false);
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
    console.log(res);

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

//comsole.log(store.state.minorCategory);

/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  exportExcel.value = !exportExcel.value;
};

const datepicker = ref(null);

/**
 * 매출 일자 안 라디오박스 닫기 위한 외부 클릭 감지 함수
 */

const documentSubTitle = ref("");
const selectedExcelDate = ref("");

const saveNew = ref(true);
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
    if (res.data.RESULT_CD == "00") {
      Swal.fire({
        title: "성공",
        text: `${res.data.ERROR_MSG}`,
        icon: "success",
        confirmButtonText: "확인",
      });
      return;
    } else {
      Swal.fire({
        title: "실패",
        text: "저장에 실패하였습니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
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
  console.log(file);
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
    console.log(result);
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

  rowData.value = rows.map((row) => {
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
  //console.log(updateRowData.value);
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
  //console.log(e);
  e.target.value = e.target.value.replace(/[^0-9]/g, "");
};
</script>

<style></style>
