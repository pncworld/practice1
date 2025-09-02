<!-- /*--############################################################################
# Filename : PUR03_005INS.vue                                                  
# Description : 구매관리2 > 반품 관리 > 반품 등록.                      
# Date :2025-08-29                                                             
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
        <button @click="deleteButton" class="button delete md:w-auto w-14">
          삭제
        </button>
        <button @click="excelButton" class="button w-auto excel">엑셀</button>
      </div>
    </div>
    <div
      class="grid grid-cols-2 grid-rows-2 bg-gray-200 rounded-lg h-24 items-start z-10">
      <div class="justify-start flex ml-4">
        <Datepicker2
          :mainName="'일자'"
          ref="datepicker"
          :initToday="1"
          :closePopUp="closePopUp"
          @excelDate="excelDate"
          @endDate="endDate"
          @startDate="startDate"
          @dateValue="dateValue">
        </Datepicker2>
      </div>
      <div class="flex justify-start items-center">
        <PickStoreSingle
          @lngStoreGroup="lngStoreGroup"
          :placeholderName="'선택'"
          @excelStore="excelStore"
          @lngStoreCode="lngStoreCode"></PickStoreSingle>
      </div>
      <div class="flex ml-12 space-x-5 mt-0 items-center col-span-2">
        <BusinessClient
          @SupplierId="SupplierId"
          :defaultNm="'전체'"></BusinessClient>
      </div>
    </div>

    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="w-full h-[65vh]">
      <Realgrid
        :progname="'PUR03_005INS_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :setStateBar="false"
        :setFooter="true"
        :documentTitle="'PUR03_005INS'"
        :selectionStyle="'block'"
        :checkRenderEditable="true"
        :checkRowAuto="false"
        :checkRowAuto2="true"
        @checkedRowData="checkedRowData"
        @dblclickedRowData="dblclickedRowData"
        :documentSubTitle="documentSubTitle"
        :rowStateeditable="false"
        :exporttoExcel="exportExcel">
      </Realgrid>
    </div>
  </div>
  <div
    v-if="openpop"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <!-- 팝업 박스 -->
    <div class="bg-white rounded-2xl shadow-lg w-[60vw] h-[70vh] p-6 relative">
      <div class="flex justify-between">
        <h2 class="text-xl font-bold mb-4">반품 상세</h2>
        <!-- 버튼 영역 -->
        <div class="flex justify-end space-x-2">
          <button
            class="px-4 py-2 bg-gray-300 rounded-lg"
            @click="openpop = false">
            닫기
          </button>
        </div>
      </div>
      <div class="grid grid-rows-3 grid-cols-[2fr,6fr,2fr,6fr] mt-2">
        <div
          class="text-base font-semibold border-l border-t border-black bg-gray-200 text-center items-center justify-center flex">
          반품일자
        </div>
        <div class="border-l border-t border-black flex items-center">
          <input
            type="text"
            disabled
            class="disabled:bg-gray-300 border border-black ml-2 h-[80%] w-[80%]"
            v-model="scond" />
        </div>
        <div
          class="text-base font-semibold border-l border-t border-black bg-gray-200 text-center items-center justify-center flex">
          반품번호
        </div>
        <div class="border-l border-t border-r border-black flex items-center">
          <input
            type="text"
            disabled
            v-model="scond2"
            class="disabled:bg-gray-300 border border-black ml-2 h-[80%] w-[80%]" />
        </div>
        <div
          class="text-base font-semibold border-l border-t border-black bg-gray-200 text-center items-center justify-center flex">
          반품매장
        </div>
        <div class="border-l border-t border-black flex items-center">
          <input
            type="text"
            disabled
            v-model="scond3"
            class="disabled:bg-gray-300 border border-black ml-2 h-[80%] w-[80%]" />
        </div>
        <div
          class="text-base font-semibold border-l border-t border-black bg-gray-200 text-center items-center justify-center flex">
          거래처
        </div>
        <div class="border-l border-t border-r border-black flex items-center">
          <input
            type="text"
            disabled
            v-model="scond4"
            class="disabled:bg-gray-300 border border-black ml-2 h-[80%] w-[80%]" />
        </div>
        <div
          class="text-base font-semibold border-l border-t border-b border-black bg-gray-200 text-center items-center justify-center flex">
          코멘트
        </div>
        <div
          class="border-l border-t border-b border-r border-black flex items-center col-span-3">
          <input
            type="text"
            disabled
            v-model="scond5"
            class="disabled:bg-gray-300 border border-black ml-2 h-[80%] w-[80%]" />
        </div>
      </div>

      <div class="h-[80%] w-full">
        <Realgrid
          :progname="'PUR03_005INS_VUE'"
          :progid="2"
          :rowStateeditable="false"
          :setFooter="true"
          :rowData="rowData2"></Realgrid>
      </div>
    </div>
  </div>

  <div
    v-if="openpop2"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <!-- 팝업 박스 -->
    <div class="bg-white rounded-2xl shadow-lg w-[60vw] h-[70vh] p-6 relative">
      <div class="flex justify-between">
        <h2 class="text-base font-bold mb-4 text-red-500">
          반품하려는 전표를 더블클릭하면 반품 팝업창이 열립니다.
        </h2>
        <!-- 버튼 영역 -->
        <div class="flex justify-end space-x-2">
          <button
            class="px-4 py-2 bg-blue-400 rounded-lg"
            @click="searchButton2">
            조회
          </button>
          <button
            class="px-4 py-2 bg-gray-300 rounded-lg"
            @click="openpop2 = false">
            닫기
          </button>
        </div>
      </div>
      <div class="grid grid-rows-1 grid-cols-[2fr,6fr,2fr,6fr] mt-2">
        <div
          class="text-base font-semibold border-l border-t border-black bg-gray-200 text-center items-center justify-center flex">
          조회기간
        </div>
        <div class="border-l border-t border-black flex items-center space-x-5">
          <input type="date" class="border border-black" v-model="sscond" />
          ~
          <input type="date" class="border border-black" v-model="sscond2" />

          <label for="sscond3"
            ><input
              type="checkbox"
              id="sscond3"
              @input="setThisYear"
              v-model="sscond3" />금년 조회</label
          >
        </div>
        <div
          class="text-base font-semibold border-l border-t border-black bg-gray-200 text-center items-center justify-center flex">
          자재코드/자재명
        </div>
        <div class="border-l border-t border-r border-black flex items-center">
          <input
            type="text"
            v-model="sscond4"
            @input="onlyNumber"
            class="disabled:bg-gray-300 border border-black ml-2 h-[80%] w-[80%]" />

          <input
            type="text"
            v-model="sscond5"
            class="disabled:bg-gray-300 border border-black ml-2 h-[80%] w-[80%]" />
        </div>
      </div>

      <div class="h-[80%] w-full">
        <Realgrid
          :progname="'PUR03_005INS_VUE'"
          :progid="3"
          :rowStateeditable="false"
          :setFooter="true"
          @dblclickedRowData="dblclickedRowData2"
          :setRowGroupSpan2="'strSupplierName,strStoreName,dtmCheckDate,strCheckNo'"
          :mergeMask="'strSupplierName,strStoreName,dtmCheckDate,strCheckNo'"
          :rowData="rowData3"></Realgrid>
      </div>
    </div>
  </div>

  <div
    v-if="openpop3"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <!-- 팝업 박스 -->
    <div class="bg-white rounded-2xl shadow-lg w-[60vw] h-[70vh] p-6 relative">
      <div class="flex justify-end">
        <!-- <h2 class="text-base font-bold mb-4 text-red-500">
          반품하려는 전표를 더블클릭하면 반품 팝업창이 열립니다.
        </h2> -->
        <!-- 버튼 영역 -->
        <div class="flex justify-end space-x-2">
          <button class="px-4 py-2 bg-blue-400 rounded-lg" @click="saveButton2">
            저장
          </button>
          <button
            class="px-4 py-2 bg-gray-300 rounded-lg"
            @click="openpop3 = false">
            닫기
          </button>
        </div>
      </div>
      <div class="grid grid-rows-1 grid-cols-[2fr,6fr,2fr,6fr] mt-2">
        <div
          class="text-base font-semibold border-l border-t border-black bg-gray-200 text-center items-center justify-center flex">
          출고일
        </div>
        <div class="border-l border-t border-black flex items-center space-x-5">
          <input type="date" class="border border-black" v-model="ssscond" />
        </div>
        <div
          class="text-base font-semibold border-l border-t border-black bg-gray-200 text-center items-center justify-center flex">
          코멘트
        </div>
        <div class="border-l border-t border-r border-black flex items-center">
          <input
            type="text"
            v-model="ssscond2"
            class="disabled:bg-gray-300 border border-black ml-2 h-[80%] w-[80%]" />
        </div>
      </div>

      <div class="h-[80%] w-full">
        <Realgrid
          :progname="'PUR03_005INS_VUE'"
          :progid="4"
          :rowStateeditable="false"
          :editableColId="'dblReturnQty'"
          :setFooter="true"
          @updatedRowData="updatedRowData"
          :rowData="rowData4"></Realgrid>
      </div>
    </div>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import {
  deleteStockReturnChits,
  getReturnChitList,
  getReturnDetailList,
  getStockCloseDate,
  getStockReturnDetailList,
  saveStockReturnMasterDetails,
} from "@/api/mipur";
import BusinessClient from "@/components/businessClient.vue";
import Datepicker2 from "@/components/Datepicker2.vue";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
import PickStoreSingle from "@/components/pickStoreSingle.vue";
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

  //   const res = await getCommonList(27);

  //   optionList.value = res.data.List.filter((item) => item.strDCode != "01");

  //   const res2 = await getCommonList(24);

  //   optionList2.value = res2.data.List;
  const today = new Date();
  const day = today.getDay();

  const diff = day === 0 ? 6 : day - 1;

  const monday = new Date();
  monday.setDate(today.getDate() - diff);
  sscond.value = formatLocalDate(monday);

  sscond2.value = formatLocalDate(today);
});

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

const cond = ref("02");
const cond2 = ref("01");

const cond5 = ref(0);
const store = useStore();

const datepicker = ref(null);
const closePopUp = ref(false);
const optionList = ref([]);
const optionList2 = ref([]);
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

const sDate = ref("");
const eDate = ref("");

const selectedDate = ref();
const excelDate = (e) => {
  selectedDate.value = e;
};

const storeCode = ref();
const lngStoreCode = (e) => {
  initGrid();
  storeCode.value = e;
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
  if (
    sDate.value.replaceAll("-", "").slice(0, 6) !=
    eDate.value.replaceAll("-", "").slice(0, 6)
  ) {
    Swal.fire({
      title: "경고",
      text: "1개월 단위로 조회가 가능합니다.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }

  if (storeCode.value == 0) {
    Swal.fire({
      title: "경고",
      text: "매장을 선택하세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }
  try {
    store.state.loading = true;
    initGrid();

    const res = await getReturnChitList(
      groupCd.value,
      storeCode.value,
      0,
      0,
      0,
      supplierid.value,
      sDate.value.replaceAll("-", ""),
      eDate.value.replaceAll("-", "")
    );

    rowData.value = res.data.List;
    console.log(res);
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

const disabled1 = ref(false);
const progid = ref(1);
const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
  afterSearch.value = false;
  reload.value = !reload.value;
};

//엑셀 버튼 처리 함수
const exportExcel = ref(false);
/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  documentSubTitle.value = selectedDate.value + "\n" + selectedExcelStore.value;
  exportExcel.value = !exportExcel.value;
};

const documentSubTitle2 = ref("");

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

const startDate = (e) => {
  console.log(e);
  sDate.value = e;
};
const endDate = (e) => {
  eDate.value = e;
};

const openpop = ref(false);
const openpop2 = ref(false);
const openpop3 = ref(false);
const scond = ref("");
const scond2 = ref("");
const scond3 = ref("");
const scond4 = ref("");
const scond5 = ref("");

const rowData2 = ref([]);
const tempReturnNo = ref("");
const dblclickedRowData = async (e) => {
  console.log(e);
  scond.value = e[4];
  scond2.value = e[3];
  scond3.value = e[2];
  scond4.value = e[1];
  tempReturnNo.value = e[3];
  //scond5.value = e[1];

  try {
    const res = await getReturnDetailList(
      groupCd.value,
      storeCode.value,
      scond2.value,
      scond.value
    );

    rowData2.value = res.data.List;
  } catch (error) {}
  openpop.value = true;
};

// const addbutton = ref(false);
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
  searchButton2();
  openpop2.value = true;
};

const sscond = ref("");
const sscond2 = ref("");
const sscond3 = ref(false);
const sscond4 = ref("");
const sscond5 = ref("");

watch(sscond3, () => {
  if (sscond3.value == true) {
    const today = new Date();
    const year = today.getFullYear();

    sscond.value = year + "-01-01";
  } else {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    //console.log(year, month);
    sscond.value = year + "-" + month + "-01";
  }
});

const onlyNumber = (e) => {
  e.target.value = e.target.value.replace(/[^0-9]/g, "");
};

const rowData3 = ref([]);
const searchButton2 = async () => {
  //   if (
  //     sscond.value.replaceAll("-", "").slice(0, 6) !=
  //     sscond2.value.replaceAll("-", "").slice(0, 6)
  //   ) {
  //     Swal.fire({
  //       title: "경고",
  //       text: "1개월 단위로 조회가 가능합니다.",
  //       icon: "warning",

  //       confirmButtonText: "확인",
  //     });
  //     return;
  //   }

  if (storeCode.value == 0) {
    Swal.fire({
      title: "경고",
      text: "매장을 선택하세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }
  try {
    store.state.loading = true;
    initGrid();

    const res = await getStockReturnDetailList(
      groupCd.value,
      storeCode.value,
      0,
      0,
      0,
      supplierid.value,
      sscond4.value,
      sscond5.value,
      sscond.value.replaceAll("-", ""),
      sscond2.value.replaceAll("-", ""),
      ""
    );

    rowData3.value = res.data.List;
    console.log(res);
    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    //comsole.log(error);
  } finally {
    store.state.loading = false;
  }
};

const rowData4 = ref([]);
const tempSupplierid = ref("");
const dblclickedRowData2 = async (e) => {
  console.log(e);
  ssscond.value =
    e[2].slice(0, 4) + "-" + e[2].slice(4, 6) + "-" + e[2].slice(6, 8);
  try {
    const res = await getStockReturnDetailList(
      groupCd.value,
      storeCode.value,
      0,
      0,
      0,
      e[14],
      0,
      "",
      sscond.value.replaceAll("-", ""),
      sscond2.value.replaceAll("-", ""),
      e[3]
    );
    tempSupplierid.value = e[14];
    rowData4.value = res.data.List;
  } catch (error) {}

  openpop3.value = true;
};

const ssscond = ref("");
const ssscond2 = ref("");

const updatedrowdata = ref([]);
const updatedRowData = (e) => {
  console.log(e);
  updatedrowdata.value = e;
};

const saveButton2 = async () => {
  try {
    const res = await getStockCloseDate(
      groupCd.value,
      storeCode.value,
      ssscond.value
    );

    const result = res.data.List[0].blnClosed;

    if (result !== "0") {
      Swal.fire({
        title: "경고",
        text: "해당 출고일로 반품 설정을 할 수 없습니다.",
        icon: "warning",

        confirmButtonText: "확인",
      });
      return;
    }
  } catch (error) {}

  try {
    const stockids = updatedrowdata.value
      .map((item) => item.lngStockID)
      .join("\u200b");
    const returnqty = updatedrowdata.value
      .map((item) => item.dblReturnQty)
      .join("\u200b");
    const unitprices = updatedrowdata.value
      .map((item) => item.curUnitPrice)
      .join("\u200b");
    const checknos = updatedrowdata.value
      .map((item) => item.strCheckNo)
      .join("\u200b");
    const checkseq = updatedrowdata.value
      .map((item) => item.lngCheckSeq)
      .join("\u200b");
    const res = await saveStockReturnMasterDetails(
      groupCd.value,
      storeCode.value,
      tempSupplierid.value,
      ssscond.value.replaceAll("-", ""),
      ssscond2.value,
      "",
      stockids,
      returnqty,
      unitprices,
      checknos,
      checkseq,
      store.state.userData.lngSequence
    );

    if (res.data.RESULT_CD == "00") {
      await Swal.fire({
        title: "성공",
        text: "저장에 성공하였습니다.",
        icon: "success",

        confirmButtonText: "확인",
      });
    } else {
      await Swal.fire({
        title: "실패",
        text: "저장에 실패하였습니다.",
        icon: "error",

        confirmButtonText: "확인",
      });
    }
    openpop.value = false;
    openpop2.value = false;
    openpop3.value = false;
  } catch (error) {
  } finally {
    searchButton();
  }
};

const deleteButton = async () => {
  const length = checkedrowdata.value.length;

  if (length == 0) {
    Swal.fire({
      title: "경고",
      text: "삭제할 대상을 선택해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }

  try {
    const returnnos = checkedrowdata.value
      .map((item) => item.strReturnNo)
      .join("\u200b");
    const res = await deleteStockReturnChits(
      groupCd.value,
      storeCode.value,
      returnnos,
      store.state.userData.lngSequence
    );

    if (res.data.RESULT_CD == "00") {
      await Swal.fire({
        title: "성공",
        text: "삭제에 성공하였습니다.",
        icon: "success",

        confirmButtonText: "확인",
      });
    } else {
      await Swal.fire({
        title: "실패",
        text: "삭제에 실패하였습니다.",
        icon: "error",

        confirmButtonText: "확인",
      });
    }
  } catch (error) {
  } finally {
    searchButton();
  }
};

const checkedrowdata = ref([]);
const checkedRowData = (e) => {
  console.log(e);

  checkedrowdata.value = e;
};
</script>
