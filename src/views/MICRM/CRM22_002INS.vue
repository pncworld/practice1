<!-- /*--############################################################################
# Filename : CRM22_002INS.vue                                                  
# Description : 고객관리 > 프로모션 쿠폰 관리 > 이벤트 쿠폰 생성     
# Date :2025-07-08                                                            
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <!-- 조회조건 -->
  <div class="h-full" @click="handleParentClick">
    <div class="flex justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center mr-9 space-x-2 pr-5">
        <!-- <button @click="searchButton" class="button search md:w-auto w-14">
            조회
          </button>
          <button @click="addButton" class="button new md:w-auto w-14">
            출고
          </button>
          <button @click="deleteButton" class="button delete md:w-auto w-14">
            취소처리
          </button>
          <button @click="excelButton" class="button save w-auto excel">
            엑셀
          </button> -->
        <button @click="saveButton" class="button save md:w-auto w-14">
          저장
        </button>
      </div>
    </div>
    <div
      class="grid grid-cols-[1fr,1fr] grid-rows-2 bg-gray-200 rounded-lg h-24 items-center pt-1 z-10 pl-12 justify-start">
      <div class="flex justify-start items-center col-span-2">
        <span class="text-base font-semibold">구분</span>
        <select
          name=""
          id=""
          class="w-60 h-8 ml-5"
          v-model="cond"
          @change="setCoupon">
          <option value="0">선택</option>
          <option :value="i.lngCouponType" v-for="i in optionList">
            {{ i.strCouponName }}
          </option>
        </select>
      </div>

      <div class="flex justify-start items-center">
        <span class="text-base font-semibold">파일</span>
        <button @click="beforeFileSelect" class="whitebutton bg-white ml-5">
          파일 업로드
        </button>
        <button class="whitebutton bg-white ml-10" @click="getExcelFiles">
          엑셀파일 불러오기
        </button>
        <span class="font-semibold text-base ml-10">Sheet</span>
        <div>
          <select name="" id="" class="w-32 h-8 ml-5" v-model="cond3">
            <option :value="i.lngCode" v-for="i in SheetList">
              {{ i.strName }}
            </option>
          </select>
        </div>
      </div>
    </div>
    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="flex flex-col">
      <div class="flex justify-center">
        <button class="whitebutton" @click="downloadFile">
          샘플 파일 다운
        </button>
      </div>
      ※ 1. 샘플파일 다운받아 작성. 2. 엑셀파일 import 후 저장클릭.
      <br />※ Excel 97~2003 호환버전만 지원합니다. <br />
      ※ 쿠폰코드 번호는 최대 16자리 숫자만 등록 가능합니다. <br />
      ※ 파일 작성 시 필요한 부분만 작성해 주시면 됩니다.(예 -쿠폰번호 자동 생성
      시 수신 번호만 작성) <br />
      <div class="text-red-500">
        ※ 반드시 쿠폰 정보 확인 후 등록 하십시오.(프로모션 관리 > 이벤트
        쿠폰등록 에서 수정)
      </div>
    </div>

    <div class="grid grid-rows-1 grid-cols-3">
      <div class="flex space-x-1">
        <div>◎쿠폰정보: 문자</div>
        <div>
          <input
            type="text"
            class="border border-black"
            disabled
            v-model="cond2" />
        </div>
      </div>

      <div class="flex space-x-1">
        <div>쿠폰번호</div>
        <div>
          <input
            type="text"
            class="border border-black"
            disabled
            v-model="cond3" />
        </div>
      </div>

      <div class="flex space-x-1">
        <div>유효기간</div>
        <div>
          <input
            type="text"
            class="border border-black"
            disabled
            v-model="cond4" />
        </div>
        <div>
          <input
            type="text"
            class="border border-black"
            disabled
            v-model="cond5" />
        </div>
      </div>
    </div>
    <div class="w-full h-[60%] mt-3">
      <Realgrid
        :progname="'CRM22_002INS_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        @clickedRowData="clickedRowData"
        @selectedIndex="selectedIndex"
        @updatedRowData="updatedRowData"
        :rowStateeditable="false"
        :addRow4="addRow"
        :changeValue2="changeValue3"
        :changeRow="changeRow"
        :changeColid="changeColid"
        :changeNow="changeNow"
        :addrowDefault="addrowDefault"
        :addrowProp="addrowProp"
        @allStateRows="allStateRows"
        @sendRowState="sendRowState"
        :exporttoExcel="exportExcel">
      </Realgrid>
    </div>
  </div>
  <input
    type="file"
    ref="fileInput"
    accept=".xls,.xlsx"
    class="hidden"
    @change="handleFileChange" />

  <!-- 그리드 영역 -->
</template>

<script setup>
import {
  getEventCouponEnrollList,
  getGFTMaster,
  getGFTMaster2,
  saveExcelDataGft,
} from "@/api/micrm";
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

import { onMounted, ref, watch } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";
import { read, utils } from "xlsx-js-style";
/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res2 = await getEventCouponEnrollList(
    store.state.userData.lngStoreGroup
  );
  //console.log(res2);
  optionList.value = res2.data.List;
  //optionList2.value = res2.data.List2;
});

const setCoupon = (e) => {
  if (e.target.value == 0) {
    return;
  }
  //console.log(optionList.value);

  const filtered = optionList.value.filter(
    (item) => item.lngCouponType == e.target.value
  )[0];

  cond2.value = filtered.strSMSSendYN == "N" ? "미전송" : "전송";
  cond3.value = filtered.lngCouponType;
  cond4.value = filtered.strFrom;
  cond5.value = filtered.strTo;
};
const fileInput = ref(null);

const beforeFileSelect = () => {
  // 여기서 점검: 권한, 사용자 상태 등
  if (cond.value == "0") {
    Swal.fire({
      title: "경고",
      text: "쿠폰을 미리 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  fileInput.value.click();
};
const SheetList = ref([]);
const currentFile = ref();
const handleFileChange = async (e) => {
  const file = e.target.files[0];
  //console.log(file);
  currentFile.value = file;
  cond3.value = 1;
  SheetList.value = [];
  if (file) {
    const arrayBuffer = await file.arrayBuffer();
    // XLSX 라이브러리에서 arrayBuffer 사용 가능
    const workbook = read(arrayBuffer, { type: "array" });

    const sheetLength = workbook.SheetNames.length;

    for (let i = 0; i < sheetLength; i++) {
      SheetList.value.push({ lngCode: i + 1, strName: "시트" + (i + 1) });
    }

    const result = await readFileWithArrayBuffer(file);
    //console.log(result);
  }
};

async function readFileWithArrayBuffer(file) {
  const arrayBuffer = await file.arrayBuffer();
  // XLSX 라이브러리에서 arrayBuffer 사용 가능
  const workbook = read(arrayBuffer, { type: "array" });

  const sheetName = workbook.SheetNames[cond3.value - 1];
  const sheet = workbook.Sheets[sheetName];
  const jsonData = utils.sheet_to_json(sheet, { header: 1 });

  const header = ["strMobile", "strCouponNo"];

  const rows = jsonData.slice(1); // 실제 데이터 행들

  rowData.value = rows.map((row) => {
    const obj = {};
    header.forEach((key, i) => {
      obj[key] = row[i];
    });
    return obj;
  });

  //console.log(rowData.value);
  return jsonData;
}

const getExcelFiles = () => {
  if (currentFile.value == null || currentFile.value == undefined) {
    return;
  }
  readFileWithArrayBuffer(currentFile.value);
};
const reload = ref(false);
const rowData = ref([]);
const rowData2 = ref([]);
const afterSearch = ref(false);
const selectedCond = ref(0);
const condValue = ref(0);
const cond = ref("0");
const cond2 = ref("");
const cond3 = ref("");
const cond4 = ref("");
const cond5 = ref("");

const disable1 = ref(true);
const disable2 = ref(true);
const pcond21 = ref(0);
const pcond22 = ref("");
const pcond23 = ref("");
const pcond24 = ref("");
const today = ref(new Date());
const pcond1 = ref();
const pcond2 = ref("0");
const pcond3 = ref("");
const pcond4 = ref("");

const store = useStore();
const optionList = ref([]);
const optionList2 = ref([]);
const optionList3 = ref([]);
const optionList4 = ref([]);
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
const visible2 = ref(false);

const addRow = ref(false);
const addRow2 = ref(false);
const addrowProp = ref("");
const addrowDefault = ref("");
const addButton = () => {
  addRow.value = !addRow.value;
};
const addButton2 = () => {
  addRow2.value = !addRow2.value;
};
const searchButton = async () => {
  try {
    store.state.loading = true;
    initGrid();

    const res = await getGFTMaster(store.state.userData.lngStoreGroup);

    rowData.value = res.data.List;
    updatedRow.value = JSON.parse(JSON.stringify(res.data.List));

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
const selectedStores2 = ref();
const selectedStoreAttrs = ref();

const saveButton = async () => {
  if (currentFile.value == null || currentFile.value == undefined) {
    Swal.fire({
      title: "경고",
      text: "업로드할 데이터를 먼저 업로드해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (rowData.value.length == 0) {
    Swal.fire({
      title: "경고",
      text: "업로드할 데이터를 먼저 업로드해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  // //console.log(cAllStateRow.value);
  try {
    const amounts = rowData.value.map((item) => item.lngAmount).join("\u200b");
    const gftCards = rowData.value
      .map((item) => item.strGftCardno)
      .join("\u200b");
    const saleDates = rowData.value
      .map((item) => item.dtmSaledate)
      .join("\u200b");
    const FDates = rowData.value.map((item) => item.dtmFromdate).join("\u200b");
    const TDates = rowData.value.map((item) => item.dtmTodate).join("\u200b");
    const saleStores = rowData.value
      .map((item) => item.lngSaleStore)
      .join("\u200b");
    const res = await saveExcelDataGft(
      store.state.userData.lngStoreGroup,
      store.state.userData.lngSequence,
      amounts,
      gftCards,
      saleDates,
      FDates,
      TDates,
      saleStores
    );
    //console.log(res);
    if (res.data.RESULT_CD == "00") {
      Swal.fire({
        title: "성공",
        text: "저장에 성공하였습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
    } else {
      Swal.fire({
        title: "실패",
        text: "저장에 실패하였습니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
    }

    //console.log(res);
  } catch (error) {
    //console.log(error);
  } finally {
    visible.value = false;
    initGrid();
    // searchButton();
  }
};

/**
 * 페이지 매장 코드 세팅
 */

const lngStoreCode = async (e) => {
  //initGrid();
  selectedStores.value = e;
  //console.log(e);
};
const lngStoreCode2 = async (e) => {
  //initGrid();
  selectedStores2.value = e;
  //console.log(e);
};

/**
 * 그리드 초기화
 */
const downloadFile = () => {
  const link = document.createElement("a");
  link.href = "/CouponCreate.xls"; // public 폴더 또는 정적 자원 경로
  link.download = "CouponCreate.xls";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
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
const selectedCardNo = ref("");
const selectedDate2 = ref("");
const selectedStoreCd = ref("");
const clickedRowData = async (e) => {
  cond.value = e[0];
  cond2.value = e[1];

  const res = await getGFTMaster2(store.state.userData.lngStoreGroup, e[0]);
  //console.log(res);
  rowData2.value = res.data.List;
  updatedRow2.value = JSON.parse(JSON.stringify(res.data.List));
  cond3.value = e[0];
};
const clickedRowData2 = async (e) => {
  //console.log(e);
  cond4.value = e[1];
  cond5.value = e[2];
};
const updatedRow = ref([]);
const updatedRow2 = ref([]);
const updatedRowData = (e) => {
  updatedRow.value = e;
};

const updatedRowData2 = (e) => {
  updatedRow2.value = e;
};
const currentGroupRowState = ref("");
const sendRowState = (e) => {
  currentGroupRowState.value = e;
};
const sendRowState2 = (e) => {
  if (e == "created") {
    disable2.value = false;
  } else {
    disable2.value = true;
  }
};
const cAllStateRow = ref("");
const allStateRows = (e) => {
  cAllStateRow.value = e;
};
const cAllStateRow2 = ref("");
const allStateRows2 = (e) => {
  cAllStateRow2.value = e;
};

const cRowIndex = ref("-1");
const selectedIndex = (e) => {
  cRowIndex.value = e;
};
const cRowIndex2 = ref("-1");
const selectedIndex2 = (e) => {
  cRowIndex2.value = e;
};
const changeRow = ref("-1");
const changeRow2 = ref("-1");
watch(currentGroupRowState, () => {
  if (currentGroupRowState.value == "created") {
    disable1.value = false;
  } else {
    disable1.value = true;
  }
});

const changeNow = ref(false);
const changeColid = ref("");
const changeValue3 = ref("");
const changeValue = (e) => {
  if (cRowIndex.value == "-1") {
    return;
  }
  changeRow.value = cRowIndex.value;
  changeColid.value = e.target.name;
  changeValue3.value = e.target.value;

  changeNow.value = !changeNow.value;
};

const changeNow2 = ref(false);
const changeColid2 = ref("");
const changeValue4 = ref("");
const changeValue2 = (e) => {
  if (cRowIndex2.value == "-1") {
    return;
  }
  changeRow2.value = cRowIndex2.value;
  changeColid2.value = e.target.name;
  changeValue4.value = e.target.value;

  changeNow2.value = !changeNow2.value;
};
const deleteButton = async (e) => {
  visible2.value = true;
};
const excelStore = (e) => {
  selectedExcelStore.value = e;
  //comsole.log(e);
};
const excelList = (e) => {
  selectedExcelList.value = e;
  //comsole.log(e);
};
</script>
