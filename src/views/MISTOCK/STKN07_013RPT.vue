<!-- /*--############################################################################
# Filename : STKN07_013RPT.vue                                                  
# Description : 자재관리2 > 실사 관리 > 실사 등록.
# Date :2025-09-16                                                             
# Author : 권지안                    
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
        <button @click="deleteButton" class="button delete md:w-auto w-14">
          삭제
        </button>
        <button @click="saveButton" class="button save md:w-auto w-14">
          저장
        </button>
        <button @click="excelButton" class="button save w-auto excel">
          엑셀
        </button>
      </div>
    </div>
    <div
      class="grid grid-cols-3 grid-rows-4 bg-gray-200 rounded-lg h-48 items-start z-10">
      <div class="justify-start flex ml-28 space-x-5 mt items-center">
        <Datepicker1
          @dateValue="dateValue"
          :mainName="'일자'"
          :initToday="1">
        </Datepicker1>
      </div>
      <div class="flex justify-start items-center !-ml-1">
        <PickStore
          @update:storeGroup="lngStoreGroup"
          :defaultStoreNm="'전체'"
          class=""
          @storeNm="excelStore"
          @update:storeCd="lngStoreCode"></PickStore>
      </div>
      <div class="flex justify-start pl-20 items-center mt-2 space-x-5">
      </div>
      <div class="flex space-x-5 ml-16 mt-3 items-center">
        <div class="font-semibold text-base">자재코드/명</div>
        <div class="flex space-x-3">
          <div>
            <input
              type="text"
              class="h-8 w-64 border border-black"
              v-model="cond1" />
          </div>
          <!-- <div>
            <input
              type="text"
              class="h-8 w-40 border border-black"
              v-model="cond2" />
          </div> -->
        </div>
      </div>
      <div class="flex space-x-5 mt-3 items-center">
        <div class="text-base font-semibold">재고조사주기</div>
          <div>
            <select
              name=""
              id=""
              class="w-64 h-8 border border-black"
              v-model="cond3">
              <option value="0">선택</option>
              <option :value="i.strDCode" v-for="i in optionList4">
                {{ i.strDName }}
              </option>
            </select>
          </div>
      </div>
      <div class="flex space-x-5 ml-14 mt-3 items-center">
        <BusinessClient2
          @SupplierId="SupplierId" />
      </div>
      <div class="flex ml-10 pl-11 items-center mt-3 space-x-5">
        <div class="font-semibold text-base">자재그룹</div>
        <div>
          <select
            name=""
            id=""
            class="w-64 h-8 border border-black"
            v-model="cond4">
            <option value="0">전체</option>
            <option :value="i.lngStockGroupID" v-for="i in optionList2">
              {{ i.strStockGroupName }}
            </option>
          </select>
        </div>
      </div>
      <div class="flex ml-7 items-center mt-3 space-x-5">
        <div class="text-base font-semibold">자재분류</div>
        <div>
          <select
            name=""
            id=""
            class="w-64 h-8 border border-black"
            v-model="cond5">
            <option value="0">전체</option>
            <option :value="i.lngDetail" v-for="i in optionList">
              {{ i.strDetail }}
            </option>
          </select>
        </div>
      </div>
       <div class="flex ml-10 items-center mt-3 space-x-5">
        <div class="text-base font-semibold">자재특성</div>
        <div>
          <select
            name=""
            id=""
            class="w-64 h-8 border border-black"
            v-model="cond6">
            <option value="0">전체</option>
            <option :value="i.lngGenericID" v-for="i in optionList3">
              {{ i.strGenericName }}
            </option>
          </select>
        </div>
      </div>
      <div class="justify-start flex ml-28 space-x-5 mt items-center">
        <div class="text-base font-semibold">파일</div>
          <input
              type="text"
              class="h-8 w-64 bg-white border border-black"
              disabled
              v-model="excelName" />
            <label
              for="hiddenFile"
              class="button primary h-7 flex items-center ml-2 mt-1 cursor-pointer"
              @click="beforeFileSelect">
              파일선택
            </label>
      </div>
      <div class="flex space-x-5 mt-3 ml-28 items-center">
          <label for="cond7">
            <input
              type="checkbox"
              id="cond7"
              @change="setCond7" /> 전체보기
          </label>
      </div>
      <div class="flex justify-start pl-20 items-center mt-2 space-x-5">
      </div>
    </div>
    <!-- 조회조건 -->
    <div class="font-bold text-blue-600">* 월마감인 경우는 실사일자를 반드시 월의 마지막날로 선택해야 합니다.</div>
    <!-- 그리드 영역 -->
    <div class="w-full h-[65vh]">
      <Realgrid
        :progname="'STKN07_013RPT_VUE'"
        :progid="1"
        :rowData="rowData"
        :searchColId="'lngStockID,strStockName'"
        :searchWord3="cond1"
        :CalculateShortQty="'dblShortQty'"
        :inputOnlyNumberColumn="'dblTakeQty'"
        @updatedRowData="updatedRowData"
        @allStateRows="allStateRows"
        :documentTitle="'STKN07_013RPT'"
        :documentSubTitle="documentSubTitle"
        :rowStateeditable="false"
        :checkRenderEditable="true"
        :checkRowAuto="false"
        :checkRowAuto2="true"
        :editableColId="'dblTakeQty'"
        :selectionStyle="'block'"
        :exporttoExcel="exportExcel">
      </Realgrid>
        <!-- :reload="reload"
        :setStateBar="false" -->
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
import { getCommonList } from "@/api/common";
import { getStockGeneric, getStockGroup } from "@/api/master";
import { getStockDetail, getDiligenceRegistration, getDiligenceRegistration2, delDiligenceRegistration, setDiligenceRegistration } from "@/api/mistock";

/**
 *  매출 일자 세팅 컴포넌트
 *  */
import Datepicker1 from "@/components/Datepicker1.vue";

/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
import PickStore from "@/components/pickStore.vue";
/**
 * 	거래처 선택 컴포넌트
 */
import BusinessClient2 from "@/components/businessClient2.vue";
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
const optionList = ref([]);
const optionList2 = ref([]);
const optionList3 = ref([]);
const optionList4 = ref([]);

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getStockDetail(store.state.userData.lngStoreGroup, "01");
  optionList.value = res.data.List;

  const res2 = await getStockGroup(store.state.userData.lngStoreGroup);
  optionList2.value = res2.data.List;

  const res3 = await getStockGeneric(store.state.userData.lngStoreGroup);
  optionList3.value = res3.data.List;

  const res4 = await getCommonList("73");
  optionList4.value = res4.data.List;

});
const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

const cond1 = ref("");
// const cond2 = ref("");
const cond4 = ref("0");
const cond5 = ref("0");
const cond6 = ref("0");

const cond7 = ref(false);
const setCond7 = (e) => {
  cond7.value = e.target.checked;
};

const cond3 = ref("01");
const convCond3 = ref(0);

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

const groupCd = ref();
const lngStoreGroup = (e) => {
  initGrid();
  groupCd.value = e;
};

const storeCode = ref();
const lngStoreCode = (e) => {
  initGrid();
  storeCode.value = e;
};

const storeAttr = ref();
const lngStoreAttrs = (e) => {
  initGrid();
  storeAttr.value = e;
};

const supplierid = ref("");
const SupplierId = (e) => {
  initGrid();
  supplierid.value = e;
  // console.log(supplierid.value);
};

const selectedDate = ref();

/**
 * 	매출 일자 가져오는 함수
 */

const dateValue = (e) => {
  initGrid();
  selectedDate.value = e;
  // console.log(selectedDate.value);
};

const updateRowData = ref([]);
const deleteRowData = ref([]);
const updatedRowData = (newvalue) => {
  updateRowData.value = newvalue;
  // console.log(updateRowData.value);
  deleteRowData.value = updateRowData.value.filter(item => item.lngCheck === true);
  // console.log(deleteRowData.value); 
  
};

/**
 * 조회 초기화
 */

const allstaterows = ref([]);

const allStateRows = (e) => {
  console.log(e);
  allstaterows.value = e.updated;
};

/**
 *  조회 함수
 */
const searchButton = async () => {
  if (storeCode.value == "0") {
    Swal.fire({
      title: "경고",
      text: "매장을 먼저 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  if (cond3.value == "0") {
    Swal.fire({
      title: "경고",
      text: "재고조사주기를 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  try {
    store.state.loading = true;
    initGrid();

    convCond3.value = parseInt(cond3.value, 10);  // "01" → 1
    // console.log(convCond3.value);

    if(groupCd.value == "3183"){

      const res = await getDiligenceRegistration(
        groupCd.value,
        storeCode.value,
        selectedDate.value.replaceAll("-", ""),
        convCond3.value,
        '5',
        cond7.value == true ? "02" : "01",
        supplierid.value,
        cond4.value,
        cond5.value,
        cond6.value,
      );
    
      // console.log(res);

      rowData.value = res.data.List;
      updateRowData.value = res.data.List;

      afterSearch.value = true;

    }
    else {
      const res = await getDiligenceRegistration2(
        groupCd.value,
        storeCode.value,
        selectedDate.value.replaceAll("-", ""),
        convCond3.value,
        '5',
        cond7.value == true ? "02" : "01",
      );
      
      // console.log(res);

      rowData.value = res.data.List;
      updateRowData.value = res.data.List;

      afterSearch.value = true;

    }
  } catch (error) {
    afterSearch.value = false;
    //comsole.log(error);
  } finally {
    store.state.loading = false;
  }
};

/**
 *  삭제 처리 함수
 */
const deleteButton = async () => {
  if (allstaterows.value.length == 0) 
  {
    Swal.fire({
      title: "경고",
      text: "변경된 사항이 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  try {
    await Swal.fire({
      title: "확인",
      text: "삭제하시겠습니까?",
      icon: "warning", // 'success', 'error', 'warning', 'info', 'question'
      showCancelButton: true, // 취소 버튼 표시
      confirmButtonText: "확인",
      cancelButtonText: "취소",
    }).then(async (result) => {
      if (result.isConfirmed) {
        store.state.loading = true;

        // console.log(deleteRowData.value);

        const lngStockIDs = deleteRowData.value
          // .filter((_, index) => allstaterows.value.includes(index))
          .map((item) => item.lngStockID)
          .join("\u200b");

        // console.log(selectedDate.value.replaceAll("-", ""), lngStockIDs);

        const res = await delDiligenceRegistration(
          groupCd.value,
          storeCode.value,
          selectedDate.value.replaceAll("-", ""),
          lngStockIDs,
          "",
        );
        store.state.loading = false;

        console.log(res);

        if (res.data.RESULT_CD == "00") {
          Swal.fire({
            title: "성공",
            text: "삭제에 성공하였습니다.",
            icon: "success", // 'success', 'error', 'warning', 'info', 'question'
            confirmButtonText: "확인",
          });
        } else {
          Swal.fire({
            title: "실패",
            text: "삭제에 실패하였습니다.",
            icon: "error", // 'success', 'error', 'warning', 'info', 'question'
            confirmButtonText: "확인",
          });
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    });
  } catch (error) {
  } finally {
    searchButton();
  }
};

/**
 *  저장 처리 함수
 */
const saveButton = async () => {
  if (cond3.value == "0") {
    Swal.fire({
      title: "경고",
      text: "재고조사주기를 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  console.log(allstaterows.value.length);
  if (allstaterows.value.length == 0) {
    Swal.fire({
      title: "경고",
      text: "변경된 사항이 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  try {
    await Swal.fire({
      title: "확인",
      text: "저장하시겠습니까?",
      icon: "warning", // 'success', 'error', 'warning', 'info', 'question'
      showCancelButton: true, // 취소 버튼 표시
      confirmButtonText: "확인",
      cancelButtonText: "취소",
    }).then(async (result) => {
      if (result.isConfirmed) {
        store.state.loading = true;

        // console.log(updateRowData.value);

        convCond3.value = parseInt(cond3.value, 10);  // "01" → 1

        const lngStockIDs = updateRowData.value
          .filter((_, index) => allstaterows.value.includes(index))
          .map((item) => item.lngStockID)
          .join("\u200b");

        const selectedRows = updateRowData.value.filter((_, index) => allstaterows.value.includes(index));
        const hasNegative = selectedRows.some(item => item.dblTakeQty < 0);

        if (hasNegative) {
          Swal.fire({
            title: "경고",
            text: "실사 내역에 음수 값이 입력되었습니다",
            icon: "warning",
            confirmButtonText: "확인",
          });
          return;
        }

        const dblTakeQtys = selectedRows
          .map((item) => item.dblTakeQty)
          .join("\u200b");

        const dblShortQtys = updateRowData.value
          .filter((_, index) => allstaterows.value.includes(index))
          .map((item) => item.dblShortQty)
          .join("\u200b");

        // console.log(selectedDate.value.replaceAll("-", ""), convCond3.value, lngStockIDs, dblTakeQtys, dblShortQtys);

        const res = await setDiligenceRegistration(
          convCond3.value,
          groupCd.value,
          storeCode.value,
          selectedDate.value.replaceAll("-", ""),
          lngStockIDs,
          dblTakeQtys,
          dblShortQtys,
          "5",
          "",
        );
        store.state.loading = false;

        console.log(res);

        if (res.data.RESULT_CD == "00") {
          Swal.fire({
            title: "성공",
            text: "저장에 성공하였습니다.",
            icon: "success", // 'success', 'error', 'warning', 'info', 'question'
            confirmButtonText: "확인",
          });
        } else {
          Swal.fire({
            title: "실패",
            text: "저장에 실패하였습니다.",
            icon: "error", // 'success', 'error', 'warning', 'info', 'question'
            confirmButtonText: "확인",
          });
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    });
  } catch (error) {
  } finally {
    searchButton();
  }
};

/**
 * 그리드 초기화
 */

const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
  reload.value = !reload.value;
  fileInput.value = null;
};

const fileInput = ref(null);
const SheetList = ref([]);
const currentFile = ref();
const excelcond = ref(1);

const beforeFileSelect = () => {
  // 여기서 점검: 권한, 사용자 상태 등
  // if (CompanyCode.value == 0 || afterSearch.value == false) {
  //   Swal.fire({
  //     title: "경고",
  //     text: `조회를 먼저 해주세요.`,
  //     icon: "warning",
  //     confirmButtonText: "확인",
  //   });
  //   return;
  // }
  fileInput.value.click();
};

const handleFileChange = async (e) => {
  const file = e.target.files[0];
  // console.log(file);
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
};

async function readFileWithArrayBuffer(file) {
  const arrayBuffer = await file.arrayBuffer();
  // XLSX 라이브러리에서 arrayBuffer 사용 가능
  const workbook = read(arrayBuffer, { type: "array" });

  const sheetName = workbook.SheetNames[excelcond.value - 1];
  const sheet = workbook.Sheets[sheetName];
  const jsonData = utils.sheet_to_json(sheet, { header: 1 });

  const header = [
    "strStockGroupName",
    "strGenericName",
    "strCategoryName",
    "lngStockID",
    "strStockName",
    "strStandardName",
    "strUnitName",
    "curPrice",
    "dblResultQty",
    "dblTakeQty",
    "dblShortQty",
    "strCheck",
  ];

  const rows = jsonData.slice(4); // 실제 데이터 행들

  rowData.value = rows.map((row) => {
    const obj = {};
    header.forEach((key, i) => {
      obj[key] = row[i+2];
    });
    return obj;
  });
  rowData.value = rowData.value.map((item) => ({
    ...item,
  }));
  updateRowData.value = JSON.parse(JSON.stringify(rowData.value));
  // console.log(updateRowData.value);
  return jsonData;
}

//엑셀 버튼 처리 함수
const exportExcel = ref(false);

/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  documentSubTitle.value =
    "일자 : " +
    selectedDate.value +
    "\n" +
    "매장명 : " +
    selectedExcelStore.value;
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
