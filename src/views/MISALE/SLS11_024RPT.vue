<!-- /*--############################################################################
# Filename : SLS11_024RPT.vue                                                  
# Description : 매출관리 > 분류별 매출 현황 > 주문구분 현황.           
# Date :2025-07-21                                                            
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <!-- 조회 조건 -->
  <div class="h-full" @click="handleParentClick">
    <div class="flex justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center mr-9 space-x-2 pr-5">
        <button @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <button @click="downloadExcel" class="button save w-auto excel">
          엑셀
        </button>
      </div>
    </div>
    <div
      class="grid grid-cols-3 grid-rows-1 justify-between bg-gray-200 rounded-lg h-14 items-start z-10">
      <div class="">
        <Datepicker2
          @endDate="endDate"
          @startDate="startDate"
          :closePopUp="closePopUp"
          ref="datepicker"
          class=""
          :mainName="'기간'"
          @excelDate="excelDate"
          :initToday="1"
          :initToday3="true"></Datepicker2>
      </div>
      <div class="">
        <PickStoreRenew
          @lngStoreCode="lngStoreCodes"
          @lngStoreGroup="lngStoreGroup"
          @excelStore="excelStore"
          @changeInit="changeInit">
        </PickStoreRenew>
      </div>
      <div class="flex items-center justify-center mt-2">
        <div class="font-semibold text-base flex items-center justify-center">
          주문구분
        </div>
        <div class="flex items-center justify-center ml-2">
          <select
            name=""
            id=""
            class="h-10 w-48 border border-black"
            v-model="cond">
            <option value="0">전체</option>
            <option value="1">POS</option>
            <option value="2">TABLET ORDER</option>
            <option value="3">배달</option>
          </select>
        </div>
      </div>
    </div>
    <!-- 조회 조건 -->
    <!--그리드 영역 -->
    <div class="w-full h-[80vh] grid-rows-2 grid-cols-1">
      <div class="h-[20%]">
        <Realgrid
          :progname="'SLS11_024RPT_VUE'"
          :progid="2"
          :rowData="rowData2"
          :reload="reload"
          :setFooter="true"
          :setMergeMode="false"
          :setGroupCustomLevel="2"
          :setGroupFooter="setGroupFooter"
          @clickedRowData="clickedRowData"
          :setGroupSumCustomColumnId2="['strStoreName']"
          :suffixColumnPercent="['lngTabOrderRate']"
          :setGroupColumnId="setGroupColumnId"
          :documentTitle="'SLS11_024RPT'"
          :documentSubTitle="documentSubTitle"
          :exporttoExcel="exportExcel"
          :rowStateeditable="false">
        </Realgrid>
      </div>
      <div class="h-[70%]">
        <Realgrid
          :progname="'SLS11_024RPT_VUE'"
          :progid="1"
          :rowData="filteredrowData"
          :reload="reload"
          :setRowGroupSpan2="'strStoreName,dtmDate,lngReceipt'"
          :mergeMask="'strStoreName,dtmDate'"
          :documentTitle="'SLS11_024RPT'"
          :documentSubTitle="documentSubTitle"
          :exporttoExcel="exportExcel"
          :rowStateeditable="false">
        </Realgrid>
      </div>
    </div>
  </div>
  <!--그리드 영역 -->
</template>

<script setup>
import { getOrderStatus } from "@/api/misales";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

import Datepicker2 from "@/components/Datepicker2.vue";
/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
import PickStoreRenew from "@/components/pickStoreRenew.vue";
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

import {
  formatDateTime3,
  formatLocalDate,
  insertPageLog,
} from "@/customFunc/customFunc";
/*
 * 공통 표준  Function
 */

import { onMounted, ref, watch } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";
import Swal from "sweetalert2";
import { utils, writeFile } from "xlsx-js-style";

const reload = ref(false);
const rowData = ref([]);
const rowData2 = ref([]);
const afterSearch = ref(false);
const selectedstartDate = ref();
const selectedendDate = ref();
const cond = ref(0);
const setGroupColumnId = ref("");

/**
 * 선택한 매출 시작일자
 */

const startDate = (e) => {
  //comsole.log(e);
  selectedstartDate.value = e;
};
/**
 * 선택한 매출 종료일자
 */

const endDate = (e) => {
  selectedendDate.value = e;
};

const setGroupFooter = ref(true);

const store = useStore();
const clickedRowData = (e) => {
  // //console.log(e);

  filteredrowData.value = rowData.value.filter((item) =>
    item.strStoreName.includes(e[0])
  );
};
/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  ////console.log(formattedDate.value);
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

    const res = await getOrderStatus(
      selectedGroup.value,
      selectedStores.value,
      selectedstartDate.value,
      selectedendDate.value,
      cond.value
    );
    //console.log(res);
    rowData2.value = res.data.List;
    rowData.value = res.data.List2;

    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
  } finally {
    store.state.loading = false;
  }
};

const selectedGroup = ref();
const selectedStores = ref();

/**
 * 페이지 매장 그룹 세팅
 */

const lngStoreGroup = (e) => {
  //comsole.log(e);
  selectedGroup.value = e;
};
/**
 * 페이지 매장 코드 세팅
 */

const lngStoreCodes = (e) => {
  selectedStores.value = e;
  //comsole.log(e);
};

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

  if (rowData2.value.length > 0) {
    rowData2.value = [];
  }
  if (filteredrowData.value.length > 0) {
    filteredrowData.value = [];
  }
};

const exportExcel = ref(false);

//comsole.log(store.state.minorCategory);

/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  documentSubTitle.value =
    selectedExcelDate.value + "\n" + selectedExcelStore.value + "\n";

  exportExcel.value = !exportExcel.value;
};

const datepicker = ref(null);
const closePopUp = ref(false);
/**
 * 매출 일자 안 라디오박스 닫기 위한 외부 클릭 감지 함수
 */

const handleParentClick = (e) => {
  if (e.target && e.target.type === "checkbox") {
    return;
  }
  const datepickerEl = datepicker.value?.$el;

  if (datepickerEl && datepickerEl.contains(e.target)) {
    return;
  }
  closePopUp.value = !closePopUp.value;
};
const documentSubTitle = ref("");
const selectedExcelDate = ref("");
/**
 * 엑셀용 일자 세팅 함수
 */

const excelDate = (e) => {
  selectedExcelDate.value = e;
};
const selectedExcelStore = ref("");
/**
 * 엑셀용 매장 세팅 함수
 */

const excelStore = (e) => {
  selectedExcelStore.value = e;
};

/**
 *  컴포넌트 변동시 감지 함수
 */

const changeInit = (e) => {
  initGrid();
};

/**
 * 그리드 컬럼 마스크(###,###,###,##0.00%)와 동일하게
 * 소수점 2자리 고정 + 천단위 콤마로 TABLET ORDER 비율 값을 표시
 */
const formatTabOrderRate = (value) => {
  const num = Number(value) || 0;
  return (
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num) + "%"
  );
};

const toNumber = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};

const EXCEL_BORDER = {
  top: { style: "thin", color: { rgb: "000000" } },
  bottom: { style: "thin", color: { rgb: "000000" } },
  left: { style: "thin", color: { rgb: "000000" } },
  right: { style: "thin", color: { rgb: "000000" } },
};

const EXCEL_HEADER_STYLE = {
  fill: { patternType: "solid", fgColor: { rgb: "87CEFA" } },
  font: { name: "맑은 고딕", bold: true, sz: 11, color: { rgb: "000000" } },
  alignment: { horizontal: "center", vertical: "center" },
  border: EXCEL_BORDER,
};

const EXCEL_DATA_STYLE = {
  font: { name: "맑은 고딕", sz: 11, color: { rgb: "000000" } },
  alignment: { horizontal: "center", vertical: "center" },
  border: EXCEL_BORDER,
};

const EXCEL_TOTAL_STYLE = {
  fill: { patternType: "solid", fgColor: { rgb: "FFF2CC" } },
  font: { name: "맑은 고딕", bold: true, sz: 11, color: { rgb: "000000" } },
  alignment: { horizontal: "center", vertical: "center" },
  border: EXCEL_BORDER,
};

const applyExcelRangeStyle = (worksheet, startRow, endRow, colCount, style, options = {}) => {
  const { leftAlignCols = [], rightAlignCols = [], numberCols = {} } = options;

  for (let row = startRow; row <= endRow; row += 1) {
    for (let col = 0; col < colCount; col += 1) {
      const cellRef = utils.encode_cell({ r: row - 1, c: col });
      if (!worksheet[cellRef]) {
        worksheet[cellRef] = { t: "s", v: "" };
      }

      worksheet[cellRef].s = {
        ...style,
        alignment: {
          ...style.alignment,
          horizontal: leftAlignCols.includes(col)
            ? "left"
            : rightAlignCols.includes(col)
            ? "right"
            : style.alignment?.horizontal || "center",
        },
      };

      if (numberCols[col] && worksheet[cellRef].t === "n") {
        worksheet[cellRef].z = numberCols[col];
      }
    }
  }
};

const downloadExcel = () => {
  if (!afterSearch.value || rowData2.value.length === 0) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 진행해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  const summaryHeaders = [
    "No",
    "매장명",
    "총 건수",
    "POS",
    "배달",
    "TABLET ORDER",
    "TABLET ORDER 비율",
  ];
  const detailHeaders = [
    "No",
    "매장명",
    "일자",
    "영수번호",
    "주문시간",
    "주문구분",
    "메뉴코드",
    "메뉴명",
    "판매가",
    "수량",
    "금액",
  ];

  const summaryRows = rowData2.value.map((row, index) => [
    index + 1,
    row.strStoreName ?? "",
    toNumber(row.lngTotCnt),
    toNumber(row.lngPosOrderCnt),
    toNumber(row.lngDelOrderCnt),
    toNumber(row.lngTabOrderCnt),
    formatTabOrderRate(row.lngTabOrderRate),
  ]);

  const sumTot = summaryRows.reduce((acc, row) => acc + row[2], 0);
  const sumPos = summaryRows.reduce((acc, row) => acc + row[3], 0);
  const sumDel = summaryRows.reduce((acc, row) => acc + row[4], 0);
  const sumTab = summaryRows.reduce((acc, row) => acc + row[5], 0);
  const avgTabRate = formatTabOrderRate(sumTot > 0 ? (sumTab / sumTot) * 100 : 0);

  const detailSource =
    filteredrowData.value.length > 0 ? filteredrowData.value : rowData.value;
  const detailRows = detailSource.map((row, index) => [
    index + 1,
    row.strStoreName ?? "",
    row.dtmDate ? formatLocalDate(String(row.dtmDate).split(" ")[0]) : "",
    row.lngReceipt ?? "",
    row.dtmEndTime ?? "",
    row.strOrderType ?? "",
    row.lngSMenu ?? "",
    row.strMenuName ?? "",
    toNumber(row.lngPrice),
    toNumber(row.intCount),
    toNumber(row.lngAmount),
  ]);

  const summaryHeaderRow = 6;
  const summaryDataStart = 7;
  const summaryDataEnd = summaryDataStart + summaryRows.length - 1;
  const totalRow = summaryDataEnd + 1;
  const detailSectionTitleRow = totalRow + 2;
  const detailHeaderRow = detailSectionTitleRow + 1;
  const detailDataStart = detailHeaderRow + 1;
  const detailDataEnd = detailDataStart + Math.max(detailRows.length, 1) - 1;

  const worksheet = utils.aoa_to_sheet([
    ["주문구분 현황"],
    [],
    [selectedExcelDate.value || ""],
    [selectedExcelStore.value || ""],
    [`작성일시 : ${formatDateTime3(new Date())}`],
    summaryHeaders,
    ...summaryRows,
    ["", "합계", sumTot, sumPos, sumDel, sumTab, avgTabRate],
    [],
    ["○ 주문 상세"],
    detailHeaders,
    ...(detailRows.length > 0 ? detailRows : [["", "상세 데이터가 없습니다."]]),
  ]);

  worksheet["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 6 } },
    { s: { r: 2, c: 0 }, e: { r: 2, c: 6 } },
    { s: { r: 3, c: 0 }, e: { r: 3, c: 6 } },
    { s: { r: 4, c: 0 }, e: { r: 4, c: 6 } },
    {
      s: { r: detailSectionTitleRow - 1, c: 0 },
      e: { r: detailSectionTitleRow - 1, c: 10 },
    },
  ];

  worksheet["!cols"] = [
    { wch: 8 },
    { wch: 28 },
    { wch: 14 },
    { wch: 14 },
    { wch: 28 },
    { wch: 20 },
    { wch: 22 },
    { wch: 44 },
    { wch: 12 },
    { wch: 10 },
    { wch: 14 },
  ];

  worksheet["!rows"] = [{ hpt: 30 }];

  // 타이틀
  if (worksheet.A1) {
    worksheet.A1.s = {
      font: { name: "맑은 고딕", bold: true, sz: 18, color: { rgb: "000000" } },
      alignment: { horizontal: "center", vertical: "center" },
    };
  }

  // 조회조건
  ["A3", "A4", "A5"].forEach((cell) => {
    if (worksheet[cell]) {
      worksheet[cell].s = {
        font: { name: "맑은 고딕", sz: 11 },
        alignment: { horizontal: "left", vertical: "center" },
      };
    }
  });

  // 요약 헤더/데이터/합계
  applyExcelRangeStyle(
    worksheet,
    summaryHeaderRow,
    summaryHeaderRow,
    summaryHeaders.length,
    EXCEL_HEADER_STYLE
  );
  if (summaryRows.length > 0) {
    applyExcelRangeStyle(
      worksheet,
      summaryDataStart,
      summaryDataEnd,
      summaryHeaders.length,
      EXCEL_DATA_STYLE,
      {
        leftAlignCols: [1],
        rightAlignCols: [2, 3, 4, 5, 6],
        numberCols: {
          2: "#,##0",
          3: "#,##0",
          4: "#,##0",
          5: "#,##0",
        },
      }
    );
  }
  applyExcelRangeStyle(
    worksheet,
    totalRow,
    totalRow,
    summaryHeaders.length,
    EXCEL_TOTAL_STYLE,
    {
      leftAlignCols: [1],
      rightAlignCols: [2, 3, 4, 5, 6],
      numberCols: {
        2: "#,##0",
        3: "#,##0",
        4: "#,##0",
        5: "#,##0",
      },
    }
  );

  // 상세 섹션 타이틀
  const detailTitleCell = `A${detailSectionTitleRow}`;
  if (worksheet[detailTitleCell]) {
    worksheet[detailTitleCell].s = {
      font: { name: "맑은 고딕", bold: true, sz: 12 },
      alignment: { horizontal: "left", vertical: "center" },
    };
  }

  // 상세 헤더/데이터
  applyExcelRangeStyle(
    worksheet,
    detailHeaderRow,
    detailHeaderRow,
    detailHeaders.length,
    EXCEL_HEADER_STYLE
  );

  if (detailRows.length > 0) {
    applyExcelRangeStyle(
      worksheet,
      detailDataStart,
      detailDataEnd,
      detailHeaders.length,
      EXCEL_DATA_STYLE,
      {
        leftAlignCols: [1, 7],
        rightAlignCols: [8, 9, 10],
        numberCols: {
          8: "#,##0",
          9: "#,##0",
          10: "#,##0",
        },
      }
    );
  }

  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, "주문구분 현황");
  writeFile(workbook, "주문구분 현황.xlsx");
};
</script>

<style></style>
