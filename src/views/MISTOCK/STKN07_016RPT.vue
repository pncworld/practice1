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
      class="z-10 mt-3 w-full min-w-0 overflow-x-auto rounded-lg bg-gray-200 px-24 py-4">
      <div
        class="stkn016-search-grid min-w-0"
        :style="{
          '--stkn016-control-border': stkn016ControlBorder,
          '--stkn016-item-gap': stkn016ItemGap,
        }">
        <div class="stkn016-cell">
          <div class="stkn016-sg-label">일자</div>
          <div class="stkn016-cell-field stkn016-date-slot min-w-0">
            <Datepicker1
              ref="datepicker"
              :mainName="'일자'"
              @dateValue="dateValue" />
          </div>
        </div>
        <div class="stkn016-cell">
          <div class="stkn016-sg-label">매장</div>
          <div class="stkn016-cell-field stkn016-pick-slot min-w-0">
            <PickStoreRenew
              compact
              combo-fill
              omit-main-label
              main-name="매장"
              :hideit2="false"
              :hideit="false"
              @lngStoreCode="lngStoreCode"
              @excelStore="excelStore" />
          </div>
        </div>
        <div class="stkn016-cell">
          <div class="stkn016-sg-label">파트</div>
          <div class="stkn016-cell-field min-w-0">
            <select
              id="stkn07-016-cond-part"
              v-model="cond"
              class="stkn016-select h-8 w-full min-w-0 rounded-md border border-solid bg-white text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              @change="setCond">
              <option
                v-for="i in optionList"
                :key="i.lngPartCode"
                :value="i.lngPartCode">
                {{ i.strPartName }}
              </option>
            </select>
          </div>
        </div>

        <div class="stkn016-cell">
          <div class="stkn016-sg-label">자재코드/명</div>
          <div
            class="stkn016-cell-field stkn016-dual-input flex min-h-8 min-w-0 flex-nowrap items-center gap-2">
            <input
              id="stkn07-016-stock-id"
              :value="cond2"
              type="text"
              inputmode="numeric"
              pattern="[0-9]*"
              autocomplete="off"
              placeholder="자재코드"
              class="stkn016-input stkn016-input--code h-8 min-h-8 min-w-0 rounded-md border border-solid bg-white px-2 text-sm text-gray-700"
              @input="onStockCodeFilterInput" />
            <input
              id="stkn07-016-stock-name"
              :value="cond3"
              type="text"
              autocomplete="off"
              placeholder="자재명"
              class="stkn016-input stkn016-input--name h-8 min-h-8 min-w-0 rounded-md border border-solid bg-white px-2 text-sm text-gray-700"
              @input="onStockNameFilterInput"
              @compositionend="onStockNameFilterInput" />
          </div>
        </div>
        <div class="stkn016-cell stkn016-cell--spacer" aria-hidden="true"></div>
        <div class="stkn016-cell">
          <div class="stkn016-sg-label">주거래처</div>
          <div class="stkn016-cell-field min-w-0">
            <select
              id="stkn07-016-cond-supplier"
              v-model="cond4"
              class="stkn016-select h-8 w-full min-w-0 rounded-md border border-solid bg-white text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="0">전체</option>
              <option
                v-for="i in optionList2"
                :key="i.lngSupplierID"
                :value="i.lngSupplierID">
                {{ i.strSupplierName }}
              </option>
            </select>
          </div>
        </div>

        <div class="stkn016-cell">
          <div class="stkn016-sg-label">자재그룹</div>
          <div class="stkn016-cell-field min-w-0">
            <select
              id="stkn07-016-cond-stock-group"
              v-model="cond5"
              class="stkn016-select h-8 w-full min-w-0 rounded-md border border-solid bg-white text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="0">전체</option>
              <option
                v-for="i in optionList3"
                :key="i.lngStockGroupID"
                :value="i.lngStockGroupID">
                {{ i.strStockGroupName }}
              </option>
            </select>
          </div>
        </div>
        <div class="stkn016-cell">
          <div class="stkn016-sg-label">자재분류</div>
          <div class="stkn016-cell-field min-w-0">
            <select
              id="stkn07-016-cond-category"
              v-model="cond6"
              class="stkn016-select h-8 w-full min-w-0 rounded-md border border-solid bg-white text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="0">전체</option>
              <option
                v-for="i in optionList4"
                :key="i.lngCategoryID"
                :value="i.lngCategoryID">
                {{ i.strCategoryName }}
              </option>
            </select>
          </div>
        </div>
        <div class="stkn016-cell">
          <div class="stkn016-sg-label">자재특성</div>
          <div class="stkn016-cell-field min-w-0">
            <select
              id="stkn07-016-cond-generic"
              v-model="cond7"
              class="stkn016-select h-8 w-full min-w-0 rounded-md border border-solid bg-white text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="0">전체</option>
              <option
                v-for="i in optionList5"
                :key="i.lngGenericID"
                :value="i.lngGenericID">
                {{ i.strGenericName }}
              </option>
            </select>
          </div>
        </div>
      </div>
      <div
        class="stkn016-footer mt-2 flex min-w-0 flex-nowrap items-center justify-between gap-4">
        <p class="min-w-0 text-sm font-semibold text-red-500">
          ※월마감인 경우는 실사일자를 반드시 월의 마지막날로 선택해야 합니다.
        </p>
        <label
          for="stkn07-016-cond-all"
          class="flex shrink-0 cursor-pointer items-center gap-1 whitespace-nowrap text-sm font-semibold text-gray-900">
          <input id="stkn07-016-cond-all" v-model="cond8" type="checkbox" />
          전체보기
        </label>
      </div>
    </div>
    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="w-full h-[70%]">
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
        :inputUnsignedDecimalColumn="'dblTakeQty'"
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

import { nextTick, onMounted, ref } from "vue";
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

const stkn016ControlBorder = "#cbd5e1";
const stkn016ItemGap = "0.75rem";

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

/** 조회 원본 — 자재코드/명 입력 시 LIKE 필터만 rowData에 반영 */
const rawRowData = ref([]);

const normalizeStockSearchText = (value) =>
  String(value ?? "")
    .trim()
    .normalize("NFKC")
    .toLowerCase();

const getRowStockCode = (row) =>
  normalizeStockSearchText(
    row.lngStockID ??
      row.strStockID ??
      row.strStockCode ??
      row.strStockId ??
      ""
  );

const getRowStockName = (row) =>
  normalizeStockSearchText(row.strStockName ?? row.strName ?? row.strStockNm ?? "");

const applyStockLikeFilter = (list, codeRaw = cond2.value, nameRaw = cond3.value) => {
  const codeQ = normalizeStockSearchText(codeRaw);
  const nameQ = normalizeStockSearchText(nameRaw);
  if (!codeQ && !nameQ) {
    return [...list];
  }
  return list.filter((row) => {
    const code = getRowStockCode(row);
    const name = getRowStockName(row);
    const codeOk = !codeQ || code.includes(codeQ);
    const nameOk = !nameQ || name.includes(nameQ);
    return codeOk && nameOk;
  });
};

const syncRowDataFromStockFilter = async (codeRaw, nameRaw) => {
  if (!afterSearch.value) {
    return;
  }
  const filtered = applyStockLikeFilter(rawRowData.value, codeRaw, nameRaw);
  rowData.value = [...filtered];
  updatedrowdata.value = [...filtered];
  await nextTick();
};

/** 자재코드 — 숫자만 허용(붙여넣기·IME 포함 비숫자 제거) */
const sanitizeStockCodeInput = (value) =>
  String(value ?? "")
    .normalize("NFKC")
    .replace(/\D/g, "");

const onStockCodeFilterInput = (e) => {
  const v = sanitizeStockCodeInput(e.target.value);
  if (e.target.value !== v) {
    e.target.value = v;
  }
  cond2.value = v;
  syncRowDataFromStockFilter(v, cond3.value);
};

const onStockNameFilterInput = (e) => {
  const v = e.target.value;
  cond3.value = v;
  syncRowDataFromStockFilter(cond2.value, v);
};

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
    rawRowData.value = res.data.List ?? [];
    afterSearch.value = true;
    syncRowDataFromStockFilter();
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

/** 파트 목록에서 기본값(전체) 코드 — API 목록 첫 항목이 전체인 경우 대비 */
const resolveDefaultPartCode = (list) => {
  const items = Array.isArray(list) ? list : [];
  if (!items.length) return 0;
  const byName = items.find(
    (p) => String(p.strPartName ?? "").trim() === "전체"
  );
  if (byName != null) return byName.lngPartCode;
  const byZero = items.find(
    (p) => p.lngPartCode === 0 || p.lngPartCode === "0"
  );
  if (byZero != null) return byZero.lngPartCode;
  return items[0].lngPartCode;
};

const initGrid = () => {
  rawRowData.value = [];
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
  updatedrowdata.value = [];
  allstaterows.value = [];
  afterSearch.value = false;
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

  optionList.value = res2.data.List ?? [];
  cond.value = resolveDefaultPartCode(optionList.value);
  initGrid();
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
  initGrid();
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

<style scoped>
/* PUR03_037RPT / search-area-layout — 3열 repeat(1fr) + column-gap, 셀당 라벨+값 flex */
.stkn016-search-grid {
  --stkn016-label-col: 7rem;
  display: grid;
  width: 100%;
  min-width: 0;
  align-items: center;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  column-gap: var(--stkn016-item-gap);
  row-gap: var(--stkn016-item-gap);
}

.stkn016-cell {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: var(--stkn016-item-gap);
}

.stkn016-cell--spacer {
  min-height: 2rem;
  visibility: hidden;
  pointer-events: none;
}

.stkn016-sg-label {
  flex: 0 0 var(--stkn016-label-col);
  width: var(--stkn016-label-col);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
}

.stkn016-cell-field {
  min-width: 0;
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  width: 100%;
}

.stkn016-cell-field:not(.stkn016-dual-input) > * {
  min-width: 0;
  width: 100%;
}

.stkn016-dual-input {
  width: 100%;
}

.stkn016-search-grid select.stkn016-select,
.stkn016-search-grid input.stkn016-input {
  box-sizing: border-box;
  border: 1px solid var(--stkn016-control-border) !important;
}

.stkn016-search-grid select.stkn016-select:focus,
.stkn016-search-grid input.stkn016-input:focus {
  border-color: #3b82f6 !important;
}

.stkn016-search-grid input.stkn016-input::placeholder {
  color: rgb(156 163 175);
  font-weight: 400;
  opacity: 1;
}

.stkn016-input--code {
  flex: 0 0 38%;
  min-width: 0;
}

.stkn016-input--name {
  flex: 1 1 auto;
  min-width: 0;
}

/* Datepicker1: 숨긴 span이 첫 자식이라 space-x-5가 input에 margin-left를 줌 → 좌측 라인 어긋남 */
.stkn016-date-slot :deep(.space-x-5 > span) {
  display: none !important;
  width: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
  overflow: hidden;
}

.stkn016-date-slot :deep(.space-x-5) {
  margin-top: 0 !important;
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;
  min-height: 2rem;
  gap: 0 !important;
}

.stkn016-date-slot :deep(.space-x-5 > input[type="date"]) {
  margin-left: 0 !important;
  margin-inline-start: 0 !important;
}

.stkn016-search-grid .stkn016-date-slot :deep(input[type="date"]) {
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  flex: 1 1 auto;
  height: 2rem;
  min-height: 2rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  border-radius: 0.375rem;
  border: 1px solid var(--stkn016-control-border) !important;
}

.stkn016-search-grid .stkn016-date-slot :deep(input[type="date"]:focus) {
  border-color: #3b82f6 !important;
}

.stkn016-pick-slot :deep(> div.flex) {
  width: 100%;
  min-width: 0;
  gap: var(--stkn016-item-gap) !important;
}

.stkn016-pick-slot :deep(> div.flex > div) {
  flex: 1 1 0;
  min-width: 0;
}

.stkn016-pick-slot :deep(select) {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  border: 1px solid var(--stkn016-control-border) !important;
}

.stkn016-pick-slot :deep(select:focus) {
  border-color: #3b82f6 !important;
}

.stkn016-pick-slot :deep(.custom-select) {
  width: 100% !important;
  min-width: 0 !important;
  max-width: 100% !important;
  margin-left: 0 !important;
}

.stkn016-pick-slot :deep(.custom-select .vs__dropdown-toggle) {
  border: 1px solid var(--stkn016-control-border) !important;
  border-radius: 0.375rem;
}

.stkn016-pick-slot :deep(.custom-select .vs__dropdown-toggle:focus-within) {
  border-color: #3b82f6 !important;
}
</style>
