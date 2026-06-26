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
            class="flex min-w-0 flex-wrap items-center gap-2 lg:col-span-5">
            <input
              type="text"
              class="h-8 min-w-0 w-full max-w-[9rem] border border-black px-2 text-sm sm:max-w-[10rem]"
              placeholder="자재코드 시작번호"
              @input="onlyNumber"
              v-model="cond" />
            <span class="shrink-0 text-base font-semibold text-gray-900">~</span>
            <input
              type="text"
              class="h-8 min-w-0 w-full max-w-[9rem] border border-black px-2 text-sm sm:max-w-[10rem]"
              placeholder="자재코드 종료번호"
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
        class="flex h-[min(28rem,90vh)] w-full max-w-[min(100%,44rem)] flex-col rounded-lg border-2 border-gray-700 bg-white shadow-2xl">
        <div
          class="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-4 py-3">
          <h2 class="min-w-0 flex-1 pr-2 text-lg font-bold leading-tight text-gray-900">
            기 등록 동일 코드 품목 조회
          </h2>
          <div class="flex shrink-0 flex-wrap items-center justify-end gap-2">
            <button type="button" :class="popupToolbarBtnClass" @click="excelButton2">
              엑셀
            </button>
            <button type="button" :class="popupToolbarBtnClass" @click="openPop = false">
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
              :merge-column-width-scale2="mst04002DupGridColumnWidthScale"
              :rowData="ErrorRowData" />
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

/** 엑셀 단가 — 판매: 없으면 0 / 매입·판매: 비숫자 시 경고 */
const mst04002ClassifyExcelPriceRaw = (value) => {
  if (value === null || value === undefined) return "missing";
  if (typeof value === "number") {
    return Number.isFinite(value) ? "ok" : "invalid";
  }
  const s = String(value).trim();
  if (!s) return "missing";
  const normalized = s.replace(/,/g, "");
  return /-?\d+(?:\.\d+)?/.test(normalized) ? "ok" : "invalid";
};

const mst04002ParseExcelPrice = (value) => {
  if (value === null || value === undefined) return "0";
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  const normalized = String(value).replace(/,/g, "");
  const matched = normalized.match(/-?\d+(?:\.\d+)?/);
  return matched ? matched[0] : "0";
};

const mst04002IsValidProcessedPrice = (value) => {
  const s = String(value ?? "").trim();
  if (!s) return false;
  return Number.isFinite(Number(s));
};

const mst04002FormatExcelPriceCell = (key, raw) => {
  const cls = mst04002ClassifyExcelPriceRaw(raw);
  if (key === "curSalesUnitPrice") {
    if (cls === "ok") return mst04002ParseExcelPrice(raw);
    if (cls === "missing") return "0";
    return "";
  }
  if (key === "curUnitPrice") {
    return cls === "ok" ? mst04002ParseExcelPrice(raw) : "";
  }
  return raw;
};

const mst04002ReadPriceIssue = (key, raw) => {
  const cls = mst04002ClassifyExcelPriceRaw(raw);
  if (key === "curSalesUnitPrice") {
    return cls === "invalid" ? "invalid" : null;
  }
  if (key === "curUnitPrice") {
    return cls === "ok" ? null : cls;
  }
  return null;
};

const mst04002JoinExcelPriceColumn = (rows, key) =>
  rows.map((item) => mst04002ParseExcelPrice(item[key])).join("\u200b");

/** 중복 품목 팝업(grid 4) — 자재코드 좁게 · 자재명 넓게 */
const mst04002DupGridColumnWidthScale = {
  lngStockID: 0.55,
  strStockName: 1.5,
};

/** 엑셀 셀 → API 전송 문자열 (undefined·숫자 포맷 통일) */
const mst04002JoinExcelColumn = (rows, key) =>
  rows
    .map((item) => {
      const v = item[key];
      if (v === null || v === undefined) return "";
      if (typeof v === "number" && Number.isFinite(v)) {
        return Number.isInteger(v) ? String(v) : String(v);
      }
      return String(v).trim();
    })
    .join("\u200b");

/** saveStockExcelData — RESULT_CD 단일 규약 (중복 98 / 성공 00 / 기타 99) */
const MST04_002_SAVE_OK = "00";
const MST04_002_SAVE_DUPLICATE = "98";

function mst04002GetDuplicateRows(data) {
  const list = data?.ERROR_LIST;
  if (!Array.isArray(list)) return [];
  return list.filter((row) => {
    const id = row?.lngStockID ?? row?.LNGSTOCKID;
    const n = Number(id);
    return Number.isFinite(n) && n > 0;
  });
}

function mst04002ParseSaveResponse(data) {
  const resultCd = String(data?.RESULT_CD ?? "").trim().toUpperCase();
  const legacyErrorCd = String(data?.ERROR_CD ?? "").trim();
  const duplicateRows = mst04002GetDuplicateRows(data);

  if (resultCd === MST04_002_SAVE_DUPLICATE) {
    return {
      kind: "duplicate",
      message:
        data?.RESULT_NM ||
        "중복되는 자재코드가 존재합니다. 엑셀파일의 자재코드를 확인하십시오.",
      errorList: duplicateRows,
    };
  }
  if (
    resultCd === MST04_002_SAVE_OK ||
    legacyErrorCd === "00" ||
    legacyErrorCd === "0000"
  ) {
    return { kind: "success" };
  }
  return {
    kind: "error",
    message:
      data?.RESULT_NM || data?.ERROR_MSG || "저장에 실패하였습니다.",
  };
}

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
const documentSubTitle = ref("");

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

const mst04002BuildSearchSubtitle = (condType, value1, value2) => {
  if (condType == 2) {
    const start = String(value1 ?? "").trim();
    const end = String(value2 ?? "").trim();
    if (!start && !end) return "자재코드";
    if (!start || !end || start === end) return `자재코드 : ${start || end}`;
    return `자재코드 : ${start} ~ ${end}`;
  }
  if (condType == 3) {
    return value1 ? `일자 : ${value1}` : "일자선택";
  }
  return "최근업로드";
};

const mst04002ResolveStockCodeRange = (startRaw, endRaw) => {
  const start = String(startRaw ?? "").trim();
  let end = String(endRaw ?? "").trim();
  if (start && !end) {
    end = start;
  }
  return { start, end };
};

/** 하단 등록내역 그리드 조회 (API만 호출 — 그리드 reload 없음) */
const mst04002FetchEnrollList = async () => {
  let searchValue = "";
  let searchValue2 = "";

  if (searchCond.value == 2) {
    const range = mst04002ResolveStockCodeRange(cond.value, cond2.value);
    searchValue = range.start;
    searchValue2 = range.end;
  } else if (searchCond.value == 3) {
    searchValue = cond3.value;
  }

  const res = await getStockEnrollList(
    store.state.userData.lngStoreGroup,
    searchCond.value,
    searchValue,
    searchValue2
  );

  rowData2.value = Array.isArray(res?.data?.List) ? res.data.List : [];
  documentSubTitle.value = mst04002BuildSearchSubtitle(
    searchCond.value,
    searchValue,
    searchValue2
  );
  afterSearch.value = true;
};

const searchButton = async () => {
  if (searchCond.value == 2 && !String(cond.value ?? "").trim()) {
    await Swal.fire({
      title: "경고",
      text: "자재코드를 입력 후 조회 해 주십시오.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  store.state.loading = true;
  try {
    await mst04002FetchEnrollList();
  } catch (error) {
    afterSearch.value = false;
    rowData2.value = [];
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

const selectedExcelDate = ref("");

const saveNew = ref(true);
const ErrorRowData = ref([]);
const openPop = ref(false);

/** 엑셀 필수 항목 (판매단가·바코드 제외) */
const EXCEL_REQUIRED_FIELDS = [
  { key: "lngStockID", label: "자재코드" },
  { key: "strStockName", label: "자재명" },
  { key: "strStandardName", label: "규격" },
  { key: "strStockGroupName", label: "자재그룹" },
  { key: "strCategoryName", label: "자재분류" },
  { key: "strGenericName", label: "자재특성" },
  { key: "strTaxTypeName", label: "과세면세구분" },
  { key: "strOrderNCheckUOM", label: "발주/매입 단위" },
  { key: "strOrderNCheckUOMFigure", label: "발주/매입 환산율" },
  { key: "strDemandUOM", label: "청구 단위" },
  { key: "strDemandUOMFigure", label: "청구 환산율" },
  { key: "strReturnNMoveUOM", label: "반품/이동 단위" },
  { key: "strReturnNMoveUOMFigure", label: "반품/이동 환산율" },
  { key: "strRealNReportUOM", label: "실사/재고 단위" },
  { key: "strRealNReportUOMFigure", label: "실사/재고 환산율" },
  { key: "strUseNLossUOM", label: "사용/손실 단위" },
  { key: "strUseNLossUOMFigure", label: "사용/손실 환산율" },
  { key: "strSupplierName", label: "주거래처" },
];

const isExcelFieldEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === "number" && !Number.isNaN(value)) return false;
  return String(value).trim() === "";
};

const getMissingRequiredExcelDetails = (rows) => {
  const lines = [];
  rows.forEach((row, index) => {
    const missingLabels = EXCEL_REQUIRED_FIELDS.filter(({ key }) =>
      isExcelFieldEmpty(row[key])
    ).map(({ label }) => label);
    if (missingLabels.length === 0) return;

    const dataRowNo = index + 1;
    lines.push(`- 데이터 ${dataRowNo}행 : ${missingLabels.join(", ")}`);
  });
  return lines;
};

const getMissingPurchasePriceDetails = (rows) => {
  const lines = [];
  rows.forEach((row) => {
    if (row._mst04PurchasePriceIssue !== "missing") return;
    const code = String(row.lngStockID ?? "").trim() || "-";
    const name = String(row.strStockName ?? "").trim() || "-";
    lines.push(`- ${code} / ${name} : 매입가가 없습니다.`);
  });
  return lines;
};

const getInvalidPriceDetails = (rows) => {
  const lines = [];
  rows.forEach((row) => {
    const code = String(row.lngStockID ?? "").trim() || "-";
    const name = String(row.strStockName ?? "").trim() || "-";
    const purchaseInvalid =
      row._mst04PurchasePriceIssue === "invalid" ||
      (String(row.curUnitPrice ?? "").trim() &&
        !mst04002IsValidProcessedPrice(row.curUnitPrice));
    const salesInvalid =
      row._mst04SalesPriceIssue === "invalid" ||
      (String(row.curSalesUnitPrice ?? "").trim() &&
        !mst04002IsValidProcessedPrice(row.curSalesUnitPrice));

    if (purchaseInvalid) {
      lines.push(`- ${code} / ${name} : 매입단가가 숫자가 아닙니다.`);
    }
    if (salesInvalid) {
      lines.push(`- ${code} / ${name} : 판매단가가 숫자가 아닙니다.`);
    }
  });
  return lines;
};

const mst04002ShowValidationWarning = (title, intro, detailLines) => {
  const maxShow = 8;
  const shown = detailLines.slice(0, maxShow);
  const restCount = detailLines.length - shown.length;
  let detailText = shown.join("\n");
  if (restCount > 0) {
    detailText += `\n- … 외 ${restCount}건`;
  }
  return Swal.fire({
    title,
    html: `<p style="margin:0;text-align:center;">${intro}</p>
      <div style="margin-top:0.75rem;text-align:left;font-size:0.9em;line-height:1.55;max-height:50vh;overflow-y:auto;">
        ${detailText.replace(/\n/g, "<br>")}
      </div>`,
    icon: "warning",
    confirmButtonText: "확인",
  });
};

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

  const missingDetails = getMissingRequiredExcelDetails(updateRowData.value);
  if (missingDetails.length > 0) {
    await mst04002ShowValidationWarning(
      "경고",
      "미입력된 필수값이 존재합니다. 확인해 주세요.",
      missingDetails
    );
    return;
  }

  const missingPurchasePrices = getMissingPurchasePriceDetails(updateRowData.value);
  if (missingPurchasePrices.length > 0) {
    await mst04002ShowValidationWarning(
      "경고",
      "매입단가가 없는 자재가 있습니다. 확인해 주세요.",
      missingPurchasePrices
    );
    return;
  }

  const invalidPrices = getInvalidPriceDetails(updateRowData.value);
  if (invalidPrices.length > 0) {
    await mst04002ShowValidationWarning(
      "경고",
      "단가가 숫자가 아닌 자재가 있습니다. 확인해 주세요.",
      invalidPrices
    );
    return;
  }

  try {
    store.state.loading = true;
    const lngStockIDs = mst04002JoinExcelColumn(updateRowData.value, "lngStockID");
    const strStockNames = mst04002JoinExcelColumn(updateRowData.value, "strStockName");
    const strStandardNames = mst04002JoinExcelColumn(
      updateRowData.value,
      "strStandardName"
    );
    const strStockGroupNames = mst04002JoinExcelColumn(
      updateRowData.value,
      "strStockGroupName"
    );
    const strCategoryNames = mst04002JoinExcelColumn(
      updateRowData.value,
      "strCategoryName"
    );
    const strGenericNames = mst04002JoinExcelColumn(
      updateRowData.value,
      "strGenericName"
    );
    const strTaxTypeNames = mst04002JoinExcelColumn(
      updateRowData.value,
      "strTaxTypeName"
    );
    const strOrderNCheckUOMs = mst04002JoinExcelColumn(
      updateRowData.value,
      "strOrderNCheckUOM"
    );
    const strOrderNCheckUOMFigures = mst04002JoinExcelColumn(
      updateRowData.value,
      "strOrderNCheckUOMFigure"
    );
    const strDemandUOMs = mst04002JoinExcelColumn(updateRowData.value, "strDemandUOM");
    const strDemandUOMFigures = mst04002JoinExcelColumn(
      updateRowData.value,
      "strDemandUOMFigure"
    );
    const strReturnNMoveUOMs = mst04002JoinExcelColumn(
      updateRowData.value,
      "strReturnNMoveUOM"
    );
    const strReturnNMoveUOMFigures = mst04002JoinExcelColumn(
      updateRowData.value,
      "strReturnNMoveUOMFigure"
    );
    const strRealNReportUOMs = mst04002JoinExcelColumn(
      updateRowData.value,
      "strRealNReportUOM"
    );
    const strRealNReportUOMFigures = mst04002JoinExcelColumn(
      updateRowData.value,
      "strRealNReportUOMFigure"
    );
    const strUseNLossUOMs = mst04002JoinExcelColumn(updateRowData.value, "strUseNLossUOM");
    const strUseNLossUOMFigures = mst04002JoinExcelColumn(
      updateRowData.value,
      "strUseNLossUOMFigure"
    );
    const curUnitPrices = mst04002JoinExcelPriceColumn(
      updateRowData.value,
      "curUnitPrice"
    );
    const curSalesUnitPrices = mst04002JoinExcelPriceColumn(
      updateRowData.value,
      "curSalesUnitPrice"
    );
    const strSupplierNames = mst04002JoinExcelColumn(
      updateRowData.value,
      "strSupplierName"
    );
    const strBarCodes = mst04002JoinExcelColumn(updateRowData.value, "strBarCode");

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
    const saveResult = mst04002ParseSaveResponse(res.data);

    if (saveResult.kind === "duplicate") {
      const dupMsg =
        saveResult.message ||
        "이미 등록된 품목과 동일한 코드의번호가 엑셀파일에 존재합니다. 엑셀파일의 자재코드 번호를 수정하십시오.";

      if (saveResult.errorList.length > 0) {
        await Swal.fire({
          title: "실패",
          text: `${dupMsg} 동일한 코드 번호의 품목을 확인 하시겠습니까?`,
          icon: "error",
          confirmButtonText: "확인",
          cancelButtonText: "취소",
          showCancelButton: true,
        }).then(async (result) => {
          if (result.isConfirmed) {
            ErrorRowData.value = saveResult.errorList;
            openPop.value = true;
          } else {
            fileName.value = "";
            rowData.value = [];
            SheetList.value = [];
            openPop.value = false;
          }
        });
      } else {
        await Swal.fire({
          title: "실패",
          text: dupMsg,
          icon: "error",
          confirmButtonText: "확인",
        });
      }
      return;
    }

    if (saveResult.kind === "success") {
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
      searchCond.value = "1";
      await mst04002FetchEnrollList();
      return;
    }

    await Swal.fire({
      title: "실패",
      text: saveResult.message,
      icon: "error",
      confirmButtonText: "확인",
    });
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
  rowData.value = rows
    .filter((item) => item.length !== 0)
    .map((row) => {
      const obj = {};
      header.forEach((key, i) => {
        const raw = row[i];
        if (key === "curUnitPrice" || key === "curSalesUnitPrice") {
          obj[key] = mst04002FormatExcelPriceCell(key, raw);
          const issue = mst04002ReadPriceIssue(key, raw);
          if (key === "curUnitPrice" && issue) {
            obj._mst04PurchasePriceIssue = issue;
          }
          if (key === "curSalesUnitPrice" && issue) {
            obj._mst04SalesPriceIssue = issue;
          }
        } else {
          obj[key] = raw;
        }
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
