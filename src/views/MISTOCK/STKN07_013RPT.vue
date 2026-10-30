<!-- /*--############################################################################
# Filename : STKN07_013RPT.vue                                                  
# Description : 자재관리2 > 실사 관리 > 실사 등록.
# Date :2025-09-16                                                             
# Author : 권지안                    
################################################################################*/ -->
<template>
  <!-- 조회조건 -->
  <!-- pl-5: 셸 w-right가 pl0이라 그리드가 좌측 메뉴에 붙음 → 우측 pd20과 맞춤 -->
  <div class="stkn713-page flex h-full min-h-0 flex-col pl-5" @click="handleParentClick">
    <div class="flex shrink-0 justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center space-x-2 pr-5">
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
      class="stkn713-search-panel z-10 mt-3 w-full min-w-0 shrink-0 rounded-lg bg-gray-200">
      <div class="stkn713-search-grid min-w-0">
        <!-- 1행: 일자 | 매장 | 거래처 -->
        <div class="stkn713-cell">
          <div class="stkn713-sg-label">일자</div>
          <div class="stkn713-cell-field stkn713-date-slot">
            <Datepicker1 @dateValue="dateValue" :mainName="'일자'" :initToday="1">
            </Datepicker1>
          </div>
        </div>
        <div class="stkn713-cell">
          <div class="stkn713-sg-label">매장</div>
          <div class="stkn713-cell-field stkn713-pick-slot">
            <PickStore
              compact-search-bar
              :compact-store-combo-max-rem="96"
              main-name=""
              @update:storeGroup="lngStoreGroup"
              :defaultStoreNm="'전체'"
              @storeNm="excelStore"
              @update:storeCd="lngStoreCode"></PickStore>
          </div>
        </div>
        <div class="stkn713-cell">
          <div class="stkn713-sg-label">거래처</div>
          <div class="stkn713-cell-field stkn713-bc-slot">
            <BusinessClient2 compact-search-bar @SupplierId="SupplierId" />
          </div>
        </div>

        <!-- 2행: 자재그룹 | 자재분류 | 자재특성 -->
        <div class="stkn713-cell">
          <label class="stkn713-sg-label" for="stkn07-013-group">자재그룹</label>
          <div class="stkn713-cell-field">
            <select id="stkn07-013-group" class="stkn713-control" v-model="cond4">
              <option value="0">전체</option>
              <option :value="i.lngStockGroupID" v-for="i in optionList2" :key="i.lngStockGroupID">
                {{ i.strStockGroupName }}
              </option>
            </select>
          </div>
        </div>
        <div class="stkn713-cell">
          <label class="stkn713-sg-label" for="stkn07-013-class">자재분류</label>
          <div class="stkn713-cell-field">
            <select id="stkn07-013-class" class="stkn713-control" v-model="cond5">
              <option value="0">전체</option>
              <option :value="i.lngDetail" v-for="i in optionList" :key="i.lngDetail">
                {{ i.strDetail }}
              </option>
            </select>
          </div>
        </div>
        <div class="stkn713-cell">
          <label class="stkn713-sg-label" for="stkn07-013-generic">자재특성</label>
          <div class="stkn713-cell-field">
            <select id="stkn07-013-generic" class="stkn713-control" v-model="cond6">
              <option value="0">전체</option>
              <option :value="i.lngGenericID" v-for="i in optionList3" :key="i.lngGenericID">
                {{ i.strGenericName }}
              </option>
            </select>
          </div>
        </div>

        <!-- 3행: 자재코드/명(+전체보기) | 재고조사주기 | 파일 -->
        <div class="stkn713-cell">
          <label class="stkn713-sg-label" for="stkn07-013-stock">자재코드/명</label>
          <div class="stkn713-cell-field stkn713-inline">
            <input
              id="stkn07-013-stock"
              type="text"
              class="stkn713-control"
              v-model="cond1" />
            <!-- <div>
              <input
                type="text"
                class="h-8 w-40 border border-black"
                v-model="cond2" />
            </div> -->
            <label for="cond7" class="stkn713-check">
              <input type="checkbox" id="cond7" @change="setCond7" /> 전체보기
            </label>
          </div>
        </div>
        <div class="stkn713-cell">
          <label class="stkn713-sg-label" for="stkn07-013-cycle">재고조사주기</label>
          <div class="stkn713-cell-field">
            <select id="stkn07-013-cycle" class="stkn713-control" v-model="cond3">
              <option value="0">선택</option>
              <option :value="i.strDCode" v-for="i in optionList4" :key="i.strDCode">
                {{ i.strDName }}
              </option>
            </select>
          </div>
        </div>
        <div class="stkn713-cell">
          <label class="stkn713-sg-label" for="stkn07-013-file">파일</label>
          <div class="stkn713-cell-field stkn713-inline">
            <input
              id="stkn07-013-file"
              type="text"
              class="stkn713-control"
              disabled
              v-model="excelName" />
            <button type="button" class="pnc-sub-btn" @click="beforeFileSelect">
              <svg class="pnc-sub-btn__icon" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M8 10.5V3M5 6l3-3 3 3M3 12.8h10" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              파일선택
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- 조회조건 -->
    <div class="stkn713-hint">
      * 월마감인 경우는 실사일자를 반드시 월의 마지막날로 선택해야 합니다.
    </div>
    <!-- 그리드 영역 -->
    <div class="min-h-0 w-full flex-1">
      <Realgrid
        :progname="'STKN07_013RPT_VUE'"
        :progid="1"
        :rowData="rowData"
        :searchColId="'lngStockID,strStockName'"
        :searchWord3="cond1"
        :CalculateShortQty="'dblShortQty'"
        :calculateShortQtyGuardCol="'strCheck'"
        :inputUnsignedDecimalColumn="'dblTakeQty'"
        :highlightColId="'dblTakeQty'"
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
import {
  getStockDetail,
  getDiligenceRegistration,
  getDiligenceRegistration2,
  delDiligenceRegistration,
  setDiligenceRegistration,
} from "@/api/mistock";

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
  deleteRowData.value = updateRowData.value.filter(
    (item) => item.lngCheck === true
  );
  console.log(deleteRowData.value);
};

/**
 * 조회 초기화
 */

const allstaterows = ref([]);

const allStateRows = (e) => {
  // console.log(e);
  allstaterows.value = e.updated;
};

/**
 * 저장하지 않은 실사재고 변경 확인
 * — 조회할 때 받은 실사재고를 자재별로 기억해 두고, 지금 값과 다르면 「수정한 내용」으로 본다
 */
const baseTakeByStock = ref(new Map());
const takeKey = (v) =>
  v === null || v === undefined || String(v).trim() === "" ? "" : String(Number(v));

/** 마지막 조회 결과 원본 — 엑셀 업로드 시 자재코드로 매핑할 기준 */
const searchedRows = ref([]);

const rememberBaseTake = (rows) => {
  baseTakeByStock.value = new Map(
    (rows || []).map((row) => [String(row.lngStockID), takeKey(row.dblTakeQty)])
  );
  searchedRows.value = JSON.parse(JSON.stringify(rows || []));
};

const hasUnsavedTakeChanges = () =>
  (updateRowData.value || []).some(
    (row) =>
      takeKey(row.dblTakeQty) !==
      (baseTakeByStock.value.get(String(row.lngStockID)) ?? "")
  );

/** 수정한 내용이 있으면 확인 창 — 계속 진행하면 true */
const confirmDiscardChanges = async (actionName) => {
  if (!hasUnsavedTakeChanges()) return true;
  const result = await Swal.fire({
    title: "확인",
    html:
      `수정한 내용이 있습니다. 저장없이 ${actionName} 하시겠습니까?<br>` +
      `(저장없이 ${actionName} 시 입력 된 데이터는 이전 데이터로 초기화 됩니다.)`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "확인",
    cancelButtonText: "취소",
  });
  return result.isConfirmed;
};

/**
 *  조회 함수 — 조회 버튼: 수정한 내용 확인 후 조회
 */
const searchButton = async () => {
  if (!(await confirmDiscardChanges("다시 조회"))) return;
  await runSearch();
};

/** 실제 조회 (저장·삭제 후 다시 조회할 때는 확인 없이 바로) */
const runSearch = async () => {
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
  // 다시 조회하면 엑셀로 불러온 값은 DB 값으로 바뀌므로 업로드 상태·파일명 초기화
  excelLoaded.value = false;
  excelName.value = "";
  try {
    store.state.loading = true;
    initGrid();

    convCond3.value = parseInt(cond3.value, 10); // "01" → 1
    // console.log(convCond3.value);

    if (groupCd.value == "3183") {
      const res = await getDiligenceRegistration(
        groupCd.value,
        storeCode.value,
        selectedDate.value.replaceAll("-", ""),
        convCond3.value,
        "5",
        cond7.value == true ? "02" : "01",
        supplierid.value,
        cond4.value,
        cond5.value,
        cond6.value
      );

      // console.log(res);

      rowData.value = res.data.List;
      updateRowData.value = res.data.List;
      rememberBaseTake(res.data.List);

      afterSearch.value = true;
    } else {
      const res = await getDiligenceRegistration2(
        groupCd.value,
        storeCode.value,
        selectedDate.value.replaceAll("-", ""),
        convCond3.value,
        "5",
        cond7.value == true ? "02" : "01"
      );

      // console.log(res);

      rowData.value = res.data.List;
      updateRowData.value = res.data.List;
      rememberBaseTake(res.data.List);

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
  if (!(await confirmDiscardChanges("삭제"))) return;
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
          ""
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
    runSearch();
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
  // 엑셀로 불러온 경우는 그리드 수정 행 목록이 비어 있어도 변경으로 봄
  if (allstaterows.value.length == 0 && !excelLoaded.value) {
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

        convCond3.value = parseInt(cond3.value, 10); // "01" → 1

        // 기존 프로그램과 동일: 저장하면 그리드의 모든 자재를 저장(미입력은 실사재고 0). 엑셀 업로드 후에는 매핑된 품목만 그리드에 있으므로 그 품목만 저장
        const selectedRows = updateRowData.value || [];
        const takeOf = (item) => Number(item.dblTakeQty) || 0;
        // 과부족은 그리드 자동계산과 같은 식으로 다시 계산 (미입력 행은 화면에 0 으로 보이지만 저장값은 실사재고 0 기준)
        const shortOf = (item) => {
          const take = takeOf(item);
          const result = Number(item.dblResultQty) || 0;
          const shortQty = result > 0 ? take - result : take + result;
          return Math.round(shortQty * 10000) / 10000;
        };

        const lngStockIDs = selectedRows
          .map((item) => item.lngStockID)
          .join("\u200b");

        const hasNegative = selectedRows.some((item) => takeOf(item) < 0);

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
          .map((item) => takeOf(item))
          .join("\u200b");

        const dblShortQtys = selectedRows
          .map((item) => shortOf(item))
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
          ""
        );
        store.state.loading = false;

        // console.log(res);

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
    runSearch();
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
/** 조회 영역 「파일」 칸에 표시할 업로드 파일명 */
const excelName = ref("");
/** 엑셀로 실사재고를 불러옴 — 그리드 수정 행 목록이 비어 있어도 저장 가능 */
const excelLoaded = ref(false);

const beforeFileSelect = () => {
  // 엑셀 품목을 조회 목록에 자재코드로 매핑하므로 조회가 먼저 필요
  if (afterSearch.value == false || searchedRows.value.length === 0) {
    Swal.fire({
      title: "경고",
      text: `조회를 먼저 해주세요.`,
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
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
    excelName.value = file.name;
    excelLoaded.value = rowData.value.length > 0; // 매핑된 품목이 있을 때만 저장 가능
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

  const excelRows = rows
    .map((row) => {
      const obj = {};
      header.forEach((key, i) => {
        obj[key] = row[i + 2];
      });
      return obj;
    })
    .filter((obj) => String(obj.lngStockID ?? "").trim() !== "");

  // 엑셀 실사재고: 자재코드별 (콤마 제거 후 숫자)
  const excelTakeByStock = new Map();
  excelRows.forEach((obj) => {
    const text = String(obj.dblTakeQty ?? "").replace(/,/g, "").trim();
    excelTakeByStock.set(String(obj.lngStockID).trim(), text === "" ? 0 : Number(text) || 0);
  });

  // 조회 목록에 자재코드로 매핑 → 엑셀에 있는 품목만 그리드에 표시(이 품목들만 저장됨)
  const mappedRows = searchedRows.value
    .filter((row) => excelTakeByStock.has(String(row.lngStockID).trim()))
    .map((row) => ({
      ...row,
      dblTakeQty: excelTakeByStock.get(String(row.lngStockID).trim()),
      strCheck: "Y", // 업로드한 품목은 입력된 것으로 보고 과부족 계산
    }));

  const mappedIds = new Set(mappedRows.map((row) => String(row.lngStockID).trim()));
  const unmatchedCount = [...excelTakeByStock.keys()].filter((id) => !mappedIds.has(id)).length;

  rowData.value = mappedRows;
  updateRowData.value = JSON.parse(JSON.stringify(mappedRows));

  if (mappedRows.length === 0) {
    Swal.fire({
      title: "알림",
      text: "엑셀 품목 중 조회 목록과 자재코드가 일치하는 품목이 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
  } else if (unmatchedCount > 0) {
    Swal.fire({
      title: "알림",
      html: `엑셀 품목 ${mappedRows.length}건을 불러왔습니다.<br>조회 목록에 없는 ${unmatchedCount}건은 제외했습니다.`,
      icon: "info",
      confirmButtonText: "확인",
    });
  }
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

<style scoped>
/*
 * 조회 AREA — STK32_001INS·STK05_013RPT 와 같은 기준
 *  · 콤보·날짜·입력칸 크기 숫자 고정·통일(--stkn713-ctl-w)
 *  · 항목명 칸 폭 통일(가장 긴 「자재코드/명」「재고조사주기」 기준) + 가운데 정렬 → 열마다 시작선 일치
 *  · 3열 max-content + space-between → 열 사이 간격 균등, 앞·뒤 공백 = --stkn713-panel-pad-x
 */
.stkn713-page {
  --stkn713-label-col: 5.75rem;
  --stkn713-item-gap: 1.25rem; /* 항목명 ↔ 콤보 */
  --stkn713-col-gap: 2.5rem;
  --stkn713-row-gap: 0.625rem;
  --stkn713-panel-pad-x: 2rem; /* 콤보를 키운 만큼 앞·뒤 공백 축소 (앞 = 뒤 유지) */
  --stkn713-row-min-h: 2rem;
  --stkn713-control-border: #cbd5e1;
  --stkn713-control-h: 2rem;
  --stkn713-ctl-w: 12rem; /* 일자·콤보·입력칸·매장 콤보·거래처 콤보 같은 폭 (10rem → 12rem) */
  --stkn713-pick-sub-w: 5.25rem; /* 매장 그룹·속성 콤보 */
  --stkn713-inline-gap: 0.5rem;
}

.stkn713-search-panel {
  box-sizing: border-box;
  padding-block: 0.75rem;
  padding-inline: var(--stkn713-panel-pad-x);
}

.stkn713-search-grid {
  display: grid;
  grid-template-columns: repeat(3, max-content);
  justify-content: space-between;
  column-gap: var(--stkn713-col-gap);
  row-gap: var(--stkn713-row-gap);
  align-items: center;
  width: 100%;
  min-width: 0;
}

.stkn713-cell {
  display: flex;
  min-width: 0;
  min-height: var(--stkn713-row-min-h);
  align-items: center;
  gap: var(--stkn713-item-gap);
}

.stkn713-sg-label {
  flex: 0 0 var(--stkn713-label-col);
  width: var(--stkn713-label-col);
  min-height: var(--stkn713-row-min-h);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
  white-space: nowrap;
}

.stkn713-cell-field {
  flex: 0 0 auto;
  min-width: 0;
  min-height: var(--stkn713-row-min-h);
  display: flex;
  align-items: center;
}

.stkn713-inline {
  gap: var(--stkn713-inline-gap);
}

.stkn713-control {
  box-sizing: border-box;
  flex: 0 0 var(--stkn713-ctl-w);
  width: var(--stkn713-ctl-w);
  height: var(--stkn713-control-h);
  min-height: var(--stkn713-control-h);
  max-height: var(--stkn713-control-h);
  min-width: 0;
  border: 1px solid var(--stkn713-control-border);
  border-radius: 0.375rem;
  background: #fff;
  padding: 0 0.5rem;
  font-size: 0.875rem;
  color: rgb(55 65 81);
}

.stkn713-control:focus {
  border-color: #3b82f6;
  outline: none;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.25);
}

.stkn713-control:disabled {
  background: #fff;
  color: rgb(55 65 81);
}

.stkn713-check {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  color: rgb(17 24 39);
  white-space: nowrap;
  cursor: pointer;
}

.stkn713-hint {
  flex-shrink: 0;
  margin: 0.5rem 0 0.25rem 0.5rem;
  font-size: 0.875rem;
  font-weight: 700;
  color: #2563eb;
}

/* 일자 Datepicker1 — 바깥 항목명 사용: 안쪽 제목·숨은 여백 제거, 입력칸 = --stkn713-ctl-w */
.stkn713-date-slot :deep(div.space-x-5 > span) {
  display: none;
}

.stkn713-date-slot :deep(div.space-x-5) {
  margin: 0 !important;
  display: flex;
  align-items: center;
}

.stkn713-date-slot :deep(div.space-x-5 > *) {
  margin-left: 0 !important;
  margin-right: 0 !important;
}

.stkn713-date-slot :deep(input[type="date"]) {
  box-sizing: border-box;
  width: var(--stkn713-ctl-w) !important;
  max-width: none !important;
  min-width: 0;
  height: var(--stkn713-control-h) !important;
  padding-left: 0.75rem;
  padding-right: 0.5rem;
  font-size: 0.875rem;
  border: 1px solid var(--stkn713-control-border) !important;
  border-radius: 0.375rem;
}

.stkn713-date-slot :deep(input[type="date"]:focus) {
  border-color: #3b82f6 !important;
}

/* 매장 PickStore (compact) — 안쪽 제목 숨김, 그룹·속성은 작게, 매장 콤보 = --stkn713-ctl-w */
.stkn713-pick-slot :deep(> div.flex.text-base) {
  width: auto !important;
  max-width: none !important;
  min-width: 0;
  margin: 0 !important;
  align-items: center;
  gap: var(--stkn713-inline-gap) !important;
}

.stkn713-pick-slot :deep(> div.flex > div:first-child) {
  display: none;
}

.stkn713-pick-slot :deep(select) {
  box-sizing: border-box;
  width: var(--stkn713-pick-sub-w) !important;
  height: var(--stkn713-control-h) !important;
  border: 1px solid var(--stkn713-control-border) !important;
}

.stkn713-pick-slot :deep(.relative.min-w-0.flex-1) {
  flex: 0 0 var(--stkn713-ctl-w) !important;
  width: var(--stkn713-ctl-w) !important;
  min-width: 0 !important;
  max-width: var(--stkn713-ctl-w) !important;
}

/* 거래처 BusinessClient2 (compact) — 콤보 = --stkn713-ctl-w */
.stkn713-bc-slot :deep(> div.flex.text-base) {
  width: var(--stkn713-ctl-w) !important;
  max-width: none !important;
  min-width: 0;
  margin: 0 !important;
}

.stkn713-pick-slot :deep(.pickstore-vs-shell),
.stkn713-bc-slot :deep(.pickstore-vs-shell) {
  box-sizing: border-box;
  width: 100% !important;
  max-width: none !important;
  height: var(--stkn713-control-h) !important;
  border: 1px solid var(--stkn713-control-border) !important;
}

/* 창이 좁으면 2열로 (열 시작선 정렬은 유지) */
@media (max-width: 1600px) {
  .stkn713-search-grid {
    grid-template-columns: repeat(2, max-content);
  }
}
</style>

<style>
/* 실사재고(입력 칸) — 공통 강조색(#8ee0ff, 청구 등록과 공유) 대신 이 화면만 연한 파스텔 하늘색 */
.stkn713-page .demand-qty {
  background: #e3f2fd !important;
}
</style>
