<!-- /*--############################################################################
# Filename : STKN07_018RPT.vue                                                  
# Description : 자재관리2 > 실사 관리 > 일별 실사재고 등록                     
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
        <button
          @click="saveButton"
          class="button save md:w-auto w-14"
          :disabled="disabled">
          저장
        </button>
        <button @click="excelButton" class="button save w-auto excel">
          엑셀
        </button>
      </div>
    </div>
    <div
      class="grid grid-cols-3 grid-rows-6 bg-gray-200 rounded-lg h-64 items-start z-10 gap-1">
      <div class="justify-start flex ml-32">
        <Datepicker1
          :mainName="'일자'"
          @dateValue="dateValue"
          :disable="!disabled4"
          ref="datepicker"
          :initToday="1"
          @excelDate="excelDate">
        </Datepicker1>
      </div>
      <div class="flex justify-start items-center col-span-2 ml-10">
        <PickStore
          @update:storeGroup="lngStoreGroup"
          :defaultStoreNm="'선택'"
          class=""
          :hideGroup="false"
          :hideAttr="false"
          :disabledAll="!disabled4"
          @storeNm="excelStore"
          @update:storeCd="lngStoreCode"></PickStore>
      </div>
      <div class="flex justify-start pl-20 items-center mt-5 space-x-5">
        <div class="text-base font-semibold text-nowrap">자재코드/명</div>
        <div class="flex items-center justify-center space-x-2">
          <input
            type="text"
            class="border border-black h-7 w-40"
            v-model="cond" />
          <div>/</div>
          <input
            type="text"
            class="border border-black h-7 w-40"
            v-model="cond2" />
        </div>
      </div>

      <div class="flex space-x-5 !ml-20 pl-2 mt-3 items-center">
        <BusinessClient
          :defaultNm="'전체'"
          @SupplierId="SupplierId"></BusinessClient>
      </div>
      <div class="flex space-x-5 ml-12 mt-5 items-center">
        <div>
          <label for="cond3"
            ><input type="checkbox" id="cond3" @change="setCond3" checked />전체
            품목보기</label
          >
        </div>
      </div>
      <div class="flex space-x-5 ml-24 mt-5 items-center pl-1">
        <div class="font-semibold text-base">자재그룹</div>
        <div>
          <select
            name=""
            id=""
            class="w-64 border border-black h-7"
            v-model="cond4">
            <option value="0">전체</option>
            <option :value="i.lngStockGroupID" v-for="i in optionList">
              {{ i.strStockGroupName }}
            </option>
          </select>
        </div>
      </div>

      <div class="flex space-x-5 ml-16 pl-3 mt-5 items-center">
        <div class="font-semibold text-base">자재분류</div>
        <div>
          <select
            name=""
            id=""
            class="w-64 border border-black h-7"
            v-model="cond5">
            <option value="0">전체</option>
            <option :value="i.lngCategoryID" v-for="i in optionList2">
              {{ i.strCategoryName }}
            </option>
          </select>
        </div>
      </div>

      <div class="flex space-x-5 ml-12 mt-5 items-center">
        <div class="font-semibold text-base">자재특성</div>
        <div>
          <select
            name=""
            id=""
            class="w-64 border border-black h-7"
            v-model="cond6">
            <option value="0">전체</option>
            <option :value="i.lngGenericID" v-for="i in optionList3">
              {{ i.strGenericName }}
            </option>
          </select>
        </div>
      </div>

      <div class="flex ml-12 mt-5 items-center">
        <div class="font-semibold text-base text-nowrap">엑셀 실사 업로드</div>
        <div>
          <input
            type="text"
            disabled
            v-model="fileNm"
            class="border border-black h-7 w-64 disabled:bg-white ml-5" />
        </div>
        <button
          class="whitebutton bg-white ml-2 disabled:opacity-30"
          @click="findFile"
          :disabled="disabled2">
          찾기
        </button>
        <input
          type="file"
          ref="fileInput"
          hidden
          accept=".xls,.xlsx"
          @change="handleFileChange" />
        <!-- <button
          class="whitebutton bg-white disabled:opacity-30"
          :disabled="disabled3">
          불러오기
        </button> -->
      </div>

      <div class="flex ml-12 mt-5 items-center col-span-2">
        <div class="font-semibold text-base text-nowrap">SHEET 선택</div>
        <div>
          <select
            name=""
            id=""
            @change="changeSheet"
            class="border border-black h-7 w-64 disabled:bg-white ml-5 disabled:opacity-30"
            v-model="excelcond"
            :disabled="disabled3">
            <option :value="i.lngCode" v-for="i in SheetList">
              {{ i.strName }}
            </option>
          </select>
        </div>
        <button
          class="whitebutton bg-white ml-2 disabled:opacity-30"
          @click="saveButton2"
          :disabled="disabled3">
          업로드
        </button>
        <button
          class="whitebutton bg-white !text-nowrap disabled:opacity-30"
          @click="searchButton"
          :disabled="disabled3">
          업로드 초기화
        </button>
      </div>

      <div
        class="flex ml-12 mt-2 items-start flex-col justify-start col-span-3">
        <div class="font-semibold text-xs text-nowrap text-blue-500">
          ＊엑셀 실사 업로드 시 엑셀 변환 후 실사 수량만 수정 후 업로드
          해주십시오.
        </div>
        <div class="font-semibold text-xs text-nowrap text-red-500">
          ＊실사를 입력하지 않은 품목은 DAILY INVENTORY에 실재고 0으로 처리
          됩니다.
        </div>
      </div>

      <div
        class="flex ml-12 mt-1 space-x-5 items-center justify-start col-span-3">
        <div class="font-semibold text-sm text-nowrap text-blue-500">
          <span
            :class="NoticeRes !== '0000' ? 'text-red-500' : 'text-green-400'"
            >⬤</span
          >
          NOTICE
        </div>

        <input
          type="text"
          disabled
          :class="NoticeRes !== '0000' ? 'text-red-500' : 'text-green-600'"
          class="border border-black bg-white w-[85%] h-7 disabled:bg-white"
          v-model="Notice" />
      </div>
    </div>
    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="w-full h-[62vh]">
      <Realgrid
        :progname="'STKN07_018RPT_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :documentTitle="'STKN07_018RPT'"
        @clickedRowData="clickedRowData"
        @updatedRowData="updatedRowData"
        @allStateRows="allStateRows"
        :documentSubTitle="documentSubTitle"
        :rowStateeditable="false"
        :editableColId="editableColId"
        :ColCellRedColorColId="['strRegDT', 'strRegYN']"
        :exporttoExcel="exportExcel">
      </Realgrid>
    </div>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import { getStockCategory, getStockGeneric, getStockGroup } from "@/api/master";
import { getStockDailyList, saveTakeDailyRegister } from "@/api/mistock";
import BusinessClient from "@/components/businessClient.vue";
import Datepicker1 from "@/components/Datepicker1.vue";
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
import Swal from "sweetalert2";
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

import { useStore } from "vuex";
import { read, utils } from "xlsx-js-style";
/**
 * 	화면 Load시 실행 스크립트
 */

const optionList3 = ref([]);
onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getStockGroup(store.state.userData.lngStoreGroup);
  //console.log(res);
  optionList.value = res.data.List;

  const res2 = await getStockCategory(store.state.userData.lngStoreGroup);
  //console.log(res2);
  optionList2.value = res2.data.List;

  const res3 = await getStockGeneric(store.state.userData.lngStoreGroup);
  //console.log(res3);
  optionList3.value = res3.data.List;

  groupCd.value = store.state.userData.lngStoreGroup;
});

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

const cond = ref("");
const cond2 = ref("");
const cond3 = ref(true);
const cond4 = ref("0");
const cond5 = ref("0");
const cond6 = ref("0");
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

const dateValue = (e) => {
  ////console.log(e);
  sDate.value = e;

  searchButton();
};
const sDate = ref();

const selectedDate = ref();
const excelDate = (e) => {
  selectedDate.value = e;
};
const optionList2 = ref([]);

const storeCode = ref();
const lngStoreCode = (e) => {
  initGrid();
  storeCode.value = e;

  searchButton();
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
/**
 *  조회 함수
 */
const hideColumnsId = ref([]);
const searchButton = async () => {
  if (storeCode.value == "0") {
    Swal.fire({
      title: "경고",
      text: `매장을 먼저 선택해주세요.`,
      icon: "warning",

      confirmButtonText: "확인",
    });
    if (rowData.value.length > 0) {
      rowData.value = [];
    }
    return;
  }
  try {
    store.state.loading = true;
    initGrid();

    const res = await getStockDailyList(
      groupCd.value,
      storeCode.value,
      sDate.value.replaceAll("-", ""),
      5,
      cond3.value == true ? "02" : "01"
    );

    rowData.value = res.data.List2;
    console.log(res);
    NoticeRes.value = res.data.List[0].RESULT_CD;

    if (NoticeRes.value == "0000") {
      disabled.value = false;
      disabled2.value = false;
      editableColId.value = "dblTakeQty";
    } else {
      disabled.value = true;
      disabled2.value = true;
      editableColId.value = "";
    }
    Notice.value = res.data.List[0].RESULT_MSG;
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

const setRowStyleCallsDefaultCol2 = ref("strTaxType");
const setRowStyleCallsDefaultCol = ref("strTaxType");
const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }

  currentFile.value = null;
  cond.value = "";
  cond2.value = "";
  cond3.value = true;
  cond4.value = "0";
  cond5.value = "0";
  cond6.value = "0";
  fileNm.value = "";

  disabled.value = true;
  disabled2.value = true;
  disabled3.value = true;
  disabled4.value = true;
  SheetList.value = [];
  excelcond.value = "";
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
const Notice = ref("");
const setCond3 = (e) => {
  ////console.log(e.target.checked);
  cond3.value = e.target.checked;
};

const NoticeRes = ref("0000");

const disabled = ref(true);
const disabled2 = ref(true);
const disabled3 = ref(true);
const disabled4 = ref(true);

const editableColId = ref("dblTakeQty");

const saveButton = async () => {
  try {
    console.log(updatedrowdata.value);
    const storeCd = updatedrowdata.value
      .filter((item, index) => allstaterows.value.includes(index))
      .map((item) => item.lngStoreCode)
      .join("\u200b");
    const stockIds = updatedrowdata.value
      .filter((item, index) => allstaterows.value.includes(index))
      .map((item) => item.lngStockID)
      .join("\u200b");
    const takeqtys = updatedrowdata.value
      .filter((item, index) => allstaterows.value.includes(index))
      .map((item) => item.dblTakeQty)
      .join("\u200b");

    const res = await saveTakeDailyRegister(
      groupCd.value,
      storeCd,
      sDate.value.replaceAll("-", ""),
      stockIds,
      takeqtys,
      5
    );
    if (res.data.RESULT_CD == "00") {
      await Swal.fire({
        title: "성공",
        text: `저장을 완료하였습니다.`,
        icon: "success",

        confirmButtonText: "확인",
      });
    } else {
      await Swal.fire({
        title: "실패",
        text: `저장에 실패하였습니다.`,
        icon: "error",

        confirmButtonText: "확인",
      });
    }
  } catch (error) {
  } finally {
    searchButton();
  }
};

const saveButton2 = async () => {
  try {
    console.log(updatedrowdata.value);
    const storeCd = updatedrowdata.value
      .map((item) => storeCode.value)
      .join("\u200b");
    const stockIds = updatedrowdata.value
      .map((item) => item.lngStockID)
      .join("\u200b");
    const takeqtys = updatedrowdata.value
      .map((item) => item.dblTakeQty)
      .join("\u200b");

    const res = await saveTakeDailyRegister(
      groupCd.value,
      storeCd,
      sDate.value.replaceAll("-", ""),
      stockIds,
      takeqtys,
      5
    );
    if (res.data.RESULT_CD == "00") {
      await Swal.fire({
        title: "성공",
        text: `저장을 완료하였습니다.`,
        icon: "success",

        confirmButtonText: "확인",
      });
    } else {
      await Swal.fire({
        title: "실패",
        text: `저장에 실패하였습니다.`,
        icon: "error",

        confirmButtonText: "확인",
      });
    }
  } catch (error) {
  } finally {
    searchButton();
  }
};

const updatedrowdata = ref([]);
const updatedRowData = (e) => {
  updatedrowdata.value = e;
};

const allstaterows = ref([]);
const allStateRows = (e) => {
  console.log(e);
  allstaterows.value = e.updated;
};

const clickedRowData = (e) => {
  console.log(e);
};

const excelcond = ref(1);
const fileInput = ref(null);
const findFile = (e) => {
  disabled4.value = false;

  fileInput.value.click();
};

const currentFile = ref(null);
const SheetList = ref([]);
const fileNm = ref("");
const handleFileChange = async (e) => {
  const file = e.target.files[0];
  fileNm.value = file.name;
  console.log(file);
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
    // console.log(result);
  }
  e.target.value = "";

  disabled3.value = false;
};

const changeSheet = (e) => {
  excelcond.value = e.target.value;
  getExcelFiles();
};
const getExcelFiles = () => {
  if (currentFile.value == null || currentFile.value == undefined) {
    return;
  }
  readFileWithArrayBuffer(currentFile.value);
};

async function readFileWithArrayBuffer(file) {
  const arrayBuffer = await file.arrayBuffer();
  // XLSX 라이브러리에서 arrayBuffer 사용 가능
  const workbook = read(arrayBuffer, { type: "array" });

  const sheetName = workbook.SheetNames[excelcond.value - 1];
  const sheet = workbook.Sheets[sheetName];
  const jsonData = utils.sheet_to_json(sheet, { header: 1 });

  const header = [
    "No",
    "strStockGroupName",
    "strCategoryName",
    "strGenericName",
    "lngStockID",
    "strStockName",
    "strStandardName",
    "strUnitName",
    "dblPreQty",
    "dblInQty",
    "dblTakeQty",
    "strRegYN",
    "strRegDT",
    "lngStoreCode",
  ];

  const rows = jsonData.slice(3); // 실제 데이터 행들
  // console.log(rows);
  rowData.value = rows.map((row) => {
    const obj = {};
    header.forEach((key, i) => {
      obj[key] = row[i];
    });
    return obj;
  });

  rowData.value = rowData.value.filter((item) => item.dblTakeQty != 0);
  // rowData.value = rowData.value.map((item) => ({
  //   ...item,
  //   strSaleCustStatus: 0,
  //   strSaleCustStatusTxt: "정상",
  // }));
  updatedrowdata.value = JSON.parse(JSON.stringify(rowData.value));

  return jsonData;
}
</script>
