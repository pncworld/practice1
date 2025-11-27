<!-- /*--############################################################################
# Filename : STKN07_016RPT.vue                                                  
# Description : 자재관리 > 실사 관리 > 파트별 실사 등록.               
# Date :2025-09-17                                                            
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <!-- 조회조건 -->
  <div class="h-full" @click="handleParentClick">
    <div class="flex justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center mr-9 space-x-2 pr-5">
        <button @click="uploadButton" class="button save w-44 excel">
          실사시트 업로드
        </button>
        <button @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <button @click="deleteButton" class="button delete md:w-auto w-14">
          삭제
        </button>
        <button @click="saveButton" class="button save md:w-auto w-14">
          저장
        </button>
        <button @click="excelButton" class="button excel md:w-auto w-14">
          엑셀
        </button>
      </div>
    </div>
    <div
      class="grid grid-cols-3 grid-rows-3 justify-between bg-gray-200 rounded-lg h-32 items-start z-10">
      <div class="flex ml-24">
        <Datepicker1 :mainName="'일자'" @dateValue="dateValue"></Datepicker1>
      </div>
      <div class="mt-2">
        <PickStoreRenew
          @lngStoreCode="lngStoreCode"
          @excelStore="excelStore"
          :hideit2="false"
          :hideit="false"></PickStoreRenew>
      </div>

      <div class="flex items-center space-x-5 mt-2 ml-5">
        <div class="text-base font-semibold">파트</div>
        <div>
          <select
            name=""
            id=""
            class="border border-black w-32 h-8"
            @change="setCond"
            v-model="cond">
            <option :value="i.lngPartCode" v-for="i in optionList">
              {{ i.strPartName }}
            </option>
          </select>
        </div>
      </div>
      <div class="flex ml-12 space-x-5 mt-2 items-center col-span-2">
        <div class="text-base font-semibold">자재코드/명</div>
        <div class="flex space-x-5">
          <input
            type="text"
            class="w-32 h-8 border border-black"
            v-model="cond2" />
          <input
            type="text"
            class="w-48 h-8 border border-black"
            v-model="cond3" />
        </div>
      </div>
      <div class="flex items-center justify-start text-base font-bold ml-1">
        <div>거래처</div>
        <select
          name=""
          id=""
          class="w-48 h-8 ml-5 border border-black"
          v-model="cond4">
          <option value="0">전체</option>
          <option :value="i.lngSupplierID" v-for="i in optionList2">
            {{ i.strSupplierName }}
          </option>
        </select>
      </div>
      <div
        class="flex justify-start items-center text-base text-nowrap font-semibold ml-16 pl-1 space-x-5">
        자재그룹
        <div class="flex space-x-5 ml-5">
          <select
            name=""
            id=""
            class="w-48 h-8 border border-black"
            v-model="cond5">
            <option value="0">전체</option>
            <option :value="i.lngStockGroupID" v-for="i in optionList3">
              {{ i.strStockGroupName }}
            </option>
          </select>
        </div>
      </div>
      <div class="flex items-center justify-start text-base font-bold ml-20">
        <div>자재분류</div>
        <select
          name=""
          id=""
          class="w-48 h-8 ml-5 border border-black"
          v-model="cond6">
          <option value="0">전체</option>
          <option :value="i.lngCategoryID" v-for="i in optionList4">
            {{ i.strCategoryName }}
          </option>
        </select>
      </div>
      <div
        class="flex items-center justify-start text-base font-bold space-x-5 -ml-3">
        <div>자재특성</div>
        <select
          name=""
          id=""
          class="w-48 h-8 border border-black"
          v-model="cond7">
          <option value="0">전체</option>
          <option :value="i.lngGenericID" v-for="i in optionList5">
            {{ i.strGenericName }}
          </option>
        </select>

        <div>
          <label for="check"
            ><input type="checkbox" id="check" v-model="cond8" />전체보기</label
          >
        </div>
      </div>
    </div>
    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="w-full h-[70%]">
      <div class="flex text-red-400 text-nowrap">
        ※월마감인 경우는 실사일자를 반드시 월의 마지막날로 선택해야 합니다.
      </div>
      <Realgrid
        :progname="'STKN07_016RPT_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :documentTitle="'STKN07_016RPT'"
        :editableColId="'dblTakeQty'"
        :checkRenderEditable="true"
        :checkRowAuto="true"
        :checkRowAuto2="false"
        @updatedRowData="updatedRowData"
        @allStateRows="allStateRows"
        :inputOnlyNumberColumn="'dblTakeQty'"
        :documentSubTitle="documentSubTitle"
        :rowStateeditable="false"
        :exporttoExcel="exportExcel">
      </Realgrid>
    </div>
  </div>
  <!-- 그리드 영역 -->
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white p-6 rounded-lg shadow-lg w-[60vw] h-[60vh]">
      <div class="flex justify-between">
        <h2 class="text-lg font-bold mb-4">실사 재고 시트 업로드</h2>
        <div class="flex space-x-2">
          <button
            class="px-4 py-2 bg-blue-500 text-white rounded"
            @click="initExcel">
            초기화
          </button>
          <button
            class="px-4 py-2 bg-blue-500 text-white rounded"
            @click="saveButton2">
            저장
          </button>
          <button
            class="px-4 py-2 bg-gray-400 text-white rounded"
            @click="open = false">
            닫기
          </button>
        </div>
      </div>
      <div
        class="grid grid-rows-2 grid-cols-[1fr,2fr,0.5fr,2fr,1fr,2fr] h-[15%] mt-2">
        <div
          class="bg-gray-100 flex justify-center items-center border-l border-t border-black">
          업로드 파일
        </div>
        <div
          class="flex justify-center items-center border-l border-t border-black space-x-2">
          <input
            type="text"
            class="border border-black h-[80%] w-[70%] disabled:bg-gray-50"
            disabled
            v-model="fileNm" />
          <input
            type="file"
            hidden
            ref="fileInput"
            accept=".xls,.xlsx"
            @change="handleFileChange" />
          <button class="whitebutton" @click="searchFile">찾기</button>
        </div>
        <div class="border-l border-t border-black"></div>
        <div class="border-t border-black"></div>
        <div
          class="bg-gray-100 border-l border-t border-black flex justify-center items-center">
          SHEET 선택
        </div>
        <div
          class="border-t border-l border-r border-black flex justify-center items-center">
          <select
            name=""
            id=""
            class="w-[80%] h-[80%] border border-black"
            v-model="excelcond"
            @change="getExcelFiles">
            <option :value="i.lngCode" v-for="i in SheetList">
              {{ i.strName }}
            </option>
          </select>
        </div>
        <div
          class="bg-gray-100 border-l border-t border-b border-black flex justify-center items-center">
          마감일
        </div>
        <div
          class="flex justify-center items-center border-l border-t border-b border-black">
          <input
            type="date"
            class="border border-black w-[80%] h-[80%]"
            v-model="scond"
            disabled />
        </div>
        <!-- <div
          class="bg-gray-100 border-l border-t border-black flex justify-center items-center">
          매장
        </div> -->
        <div class="col-span-2 border-l border-t border-b border-black pr-6">
          <pickStore
            :mainName="'매장'"
            :disabledAll="true"
            :setDynamicStoreClass="'!w-[80%] !mr-20 h-[100%] !p-0 !-mt-5  text-center'"
            :setDefaultStoreCd="scond2"
            :hideGroup="false"
            :hideAttr="false"></pickStore>
        </div>
        <div
          class="bg-gray-100 border-l border-t border-b border-black flex justify-center items-center">
          파트
        </div>
        <div
          class="flex justify-center items-center border-l border-r border-t border-b border-black">
          <select
            name=""
            id=""
            v-model="scond3"
            class="border border-black w-[80%] h-[80%]"
            disabled>
            <option :value="i.lngPartCode" v-for="i in optionList">
              {{ i.strPartName }}
            </option>
          </select>
        </div>
      </div>
      <div class="h-[70%] w-full">
        <Realgrid
          :progname="'STKN07_016RPT_VUE'"
          :progid="3"
          :rowData="rowData2"></Realgrid>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  deleteStockTakeByPart,
  getLossMasterPartList,
  getStockTakeCountListbyPart,
  saveStockTakeCountByPart,
} from "@/api/mistock";
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

import {
  getStockCategory,
  getStockGeneric,
  getStockGroup,
  getSuppliers,
} from "@/api/master";
import Datepicker1 from "@/components/Datepicker1.vue";
import { useStore } from "vuex";
import PickStore from "@/components/pickStore.vue";
import { read, utils, writeXLSX } from "xlsx-js-style";

const optionList = ref([]);
const optionList2 = ref([]);
const optionList3 = ref([]);
const optionList4 = ref([]);
const optionList5 = ref([]);

const reload = ref(false);
const rowData = ref([]);
const rowData2 = ref([]);
const afterSearch = ref(false);

/**
 * 선택한 매출 시작일자
 */

const cond = ref(0);
const cond2 = ref("");
const cond3 = ref("");
const cond4 = ref("0");
const cond5 = ref("0");
const cond6 = ref("0");
const cond7 = ref("0");
const cond8 = ref(false);

const store = useStore();

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

  if (cond.value == "0") {
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
    const res = await getStockTakeCountListbyPart(
      store.state.userData.lngStoreGroup,
      selectedStore.value,
      sdate.value.replaceAll("-", ""),
      1,
      5,
      cond8.value == true ? "02" : "01",
      cond.value
    );
    console.log(res);
    rowData.value = res.data.List;
    updatedrowdata.value = res.data.List;
    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    //comsole.log(error);
  } finally {
    store.state.loading = false;
  }
};

/* 매장 컴포넌트 관련 함수 */

const selectedStore = ref(0);

const selectedWeekDay = ref("");

/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
  //   const res = await getCommonList("07");

  //   optionList.value = res.data.List;

  const res4 = await getSuppliers(store.state.userData.lngStoreGroup);

  optionList2.value = res4.data.List;

  const res = await getStockGroup(store.state.userData.lngStoreGroup);

  optionList3.value = res.data.List;

  const res5 = await getStockCategory(store.state.userData.lngStoreGroup);

  optionList4.value = res5.data.List;

  const res6 = await getStockGeneric(store.state.userData.lngStoreGroup);

  optionList5.value = res6.data.List;

  //comsole.log(weekDay.value);
});

const saveButton = async () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
  }
  if (allstaterows.value.length == 0) {
    Swal.fire({
      title: "경고",
      text: "변경된 사항이 없습니다.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }

  Swal.fire({
    title: "알림",
    text: "저장 하시겠습니까?",
    icon: "question",

    confirmButtonText: "확인",
    cancelButtonText: "취소",
    showCancelButton: true,
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const updatedrows = updatedrowdata.value.filter((item, index) =>
          allstaterows.value.includes(index)
        );

        const res = await saveStockTakeCountByPart(
          "01",
          store.state.userData.lngStoreGroup,
          selectedStore.value,
          sdate.value.replaceAll("-", ""),
          updatedrows.map((item) => item.lngStockID).join("\u200b"),
          updatedrows.map((item) => item.dblTakeQty).join("\u200b"),
          5,
          cond.value
        );
        //console.log(res);

        if (res.data.RESULT_CD != "00") {
          Swal.fire({
            title: "실패",
            text: `${res.data.RESULT_NM}`,
            icon: "error",

            confirmButtonText: "확인",
          });
        } else {
          Swal.fire({
            title: "성공",
            text: `저장하였습니다.`,
            icon: "success",

            confirmButtonText: "확인",
          });
        }
      } catch (error) {
      } finally {
        searchButton();
      }
    } else {
      return;
    }
  });
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

const lngStoreCode = async (e) => {
  selectedStore.value = e;
  const res2 = await getLossMasterPartList(
    store.state.userData.lngStoreGroup,
    selectedStore.value
  );

  optionList.value = res2.data.List;
  afterSearch.value = false;
};
const selectedExcelStore = ref("");
/**
 * 엑셀용 매장 세팅 함수
 */

const excelStore = (e) => {
  selectedExcelStore.value = e;
  //comsole.log(e);
};

const sdate = ref("");
const dateValue = (e) => {
  sdate.value = e;
  console.log(e);
};

const updatedrowdata = ref([]);
const updatedRowData = (e) => {
  console.log(e);
  updatedrowdata.value = e;
};

const allstaterows = ref([]);
const allStateRows = (e) => {
  allstaterows.value = e.updated;
};

const setCond = (e) => {
  cond.value = e.target.value;
  afterSearch.value = false;
};

const deleteButton = async () => {
  const result = updatedrowdata.value.filter((item) => item.lngCheck == true);

  if (result.length == 0) {
    Swal.fire({
      title: "경고",
      text: `삭제할 대상을 선택해주세요.`,
      icon: "warning",

      confirmButtonText: "확인",
    });
  }

  Swal.fire({
    title: "알림",
    text: "삭제 하시겠습니까?",
    icon: "question",

    confirmButtonText: "확인",
    cancelButtonText: "취소",
    showCancelButton: true,
  }).then(async (result) => {
    if (result.isConfirmed) {
      const result2 = updatedrowdata.value.filter(
        (item) => item.lngCheck == true
      );
      try {
        const stockids = result2.map((item) => item.lngStockID).join("\u200b");
        const res = await deleteStockTakeByPart(
          store.state.userData.lngStoreGroup,
          selectedStore.value,
          sdate.value.replaceAll("-", ""),
          stockids,
          cond.value
        );
        console.log(res);
        if (res.data.RESULT_CD != "00") {
          await Swal.fire({
            title: "실패",
            text: `삭제에 실패하였습니다.`,
            icon: "error",

            confirmButtonText: "확인",
          });
        } else {
          await Swal.fire({
            title: "성공",
            text: `삭제 완료하였습니다.`,
            icon: "success",

            confirmButtonText: "확인",
          });
        }
      } catch (error) {
        console.log(error);
      } finally {
        searchButton();
      }
    } else {
      return;
    }
  });
};

const open = ref(false);
const uploadButton = () => {
  open.value = true;
};

const fileInput = ref(null);
const searchFile = () => {
  fileInput.value.value = null;
  fileInput.value.click();
};

const currentFile = ref(null);
const SheetList = ref([]);
const fileNm = ref("");
const excelcond = ref("1");
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
    console.log(result);
  }
  e.target.value = "";
};

async function readFileWithArrayBuffer(file) {
  const arrayBuffer = await file.arrayBuffer();
  // XLSX 라이브러리에서 arrayBuffer 사용 가능
  const workbook = read(arrayBuffer, { type: "array" });

  console.log(workbook);
  const sheetName = workbook.SheetNames[excelcond.value - 1];
  const sheet = workbook.Sheets[sheetName];
  const jsonData = utils.sheet_to_json(sheet, {
    header: [
      "No",
      "lngStoreCode",
      "lngCheck",
      "strStockGroupName",
      "strCategoryName",
      "strGenericName",
      "lngStockID",
      "strStockName",
      "strStandardName",
      "strUnitName",
      "dblTakeQty",
      "lngPartCode",
      "strCloseDt",
      "dblPreMonthQty",
      "dblCheckQty",
    ],
    range: 4,
  }); // 컬럼명 지칭할 헤더row 위치

  console.log(jsonData);

  rowData2.value = JSON.parse(JSON.stringify(jsonData));

  if (rowData2.value.length > 0) {
    scond.value =
      rowData2.value[0].strCloseDt.slice(0, 4) +
      "-" +
      rowData2.value[0].strCloseDt.slice(4, 6) +
      "-" +
      rowData2.value[0].strCloseDt.slice(6, 8);

    scond2.value = rowData2.value[0].lngStoreCode;
    scond3.value = rowData2.value[0].lngPartCode;
  }
  return jsonData;
}

const getExcelFiles = () => {
  if (currentFile.value == null || currentFile.value == undefined) {
    return;
  }
  readFileWithArrayBuffer(currentFile.value);
};

const scond = ref("");
const scond2 = ref("");
const scond3 = ref("");

const initExcel = () => {
  fileNm.value = "";
  scond.value = "";
  scond2.value = store.state.userData.lngPosition;
  scond3.value = "";
  excelcond.value = "";
  currentFile.value = "";

  rowData2.value = [];
};

const saveButton2 = async () => {
  if (rowData2.value.length == 0) {
    Swal.fire({
      title: "경고",
      text: "업로드할 실사 재고 사항이 없습니다.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }
  try {
    const stockids = rowData2.value
      .map((item) => item.lngStockID)
      .join("\u200b");
    const dblTakeQtys = rowData2.value
      .map((item) => item.dblTakeQty)
      .join("\u200b");
    const res = await saveStockTakeCountByPart(
      "01",
      store.state.userData.lngStoreGroup,
      scond2.value,
      scond.value.replaceAll("-", ""),
      stockids,
      dblTakeQtys,
      5,
      scond3.value
    );

    if (res.data.RESULT_CD != "00") {
      await Swal.fire({
        title: "실패",
        text: `${res.data.RESULT_NM}`,
        icon: "error",

        confirmButtonText: "확인",
      });
    } else {
      await Swal.fire({
        title: "성공",
        text: `저장하였습니다.`,
        icon: "success",

        confirmButtonText: "확인",
      });
    }
    initExcel();
  } catch (error) {}
};
</script>
