<!-- /*--############################################################################
# Filename : SLS11_025RPT.vue                                                  
# Description : 매출관리 > 분류별 매출 현황 > POS/테이블POS 매출현황 현황.           
# Date :2026-05-19                                                            
# Author : 권지안
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
      <!-- <div class="flex items-center justify-center mt-2">
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
          </select>
        </div>
      </div> -->
    </div>
    <!-- 조회 조건 -->
    <!--그리드 영역 -->
    <div class="w-full h-[80vh] grid-rows-2 grid-cols-1">
        <Realgrid
          :progname="'SLS11_025RPT_VUE'"
          :progid="1"
          :rowData="rowData"
          :reload="reload"
          :setFooter="true"
          :setMergeMode="false"
          :setGroupCustomLevel="2"
          :setGroupFooter="setGroupFooter"
          :setGroupSumCustomColumnId2="['strStoreName']"
          :suffixColumnPercent="['lngTabOrderRate']"
          :setGroupColumnId="setGroupColumnId"
          :documentTitle="'SLS11_025RPT'"
          :documentSubTitle="documentSubTitle"
          :exporttoExcel="exportExcel"
          :rowStateeditable="false">
        </Realgrid>
    </div>
  </div>
  <!--그리드 영역 -->
</template>

<script setup>
import { getPosAndTablePosSale } from "@/api/misales";
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
  formatNumberWithCommas,
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
import { utils, write } from "xlsx-js-style";

const reload = ref(false);
const rowData = ref([]);
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

const searchButton = async () => {
  store.state.loading = true;
  try {
    initGrid();

    reload.value = !reload.value;

    const res = await getPosAndTablePosSale(
      selectedGroup.value,
      selectedStores.value,
      selectedstartDate.value,
      selectedendDate.value,
      cond.value
    );

    console.log(res);
    rowData.value = res.data.List;

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

const downloadExcel = () => {
  //console.log(rowData2.value);

  const filtered = rowData.value.map((row, index) => [
    index + 1,
    row.strStoreName,
    formatNumberWithCommas(row.lngTotCnt),
    formatNumberWithCommas(row.lngPosOrderCnt),
    formatNumberWithCommas(row.lngTabOrderCnt),
    Math.round(row.lngTabOrderRate, 2) + "%",
  ]);
  const worksheet = utils.aoa_to_sheet(filtered, { origin: "A7" });

  const sum1 = rowData.value.reduce(
    (acc, item) => acc + parseInt(item.lngTotCnt),
    0
  );
  const sum2 = rowData.value.reduce(
    (acc, item) => acc + parseInt(item.lngPosOrderCnt),
    0
  );
  const sum3 = rowData.value.reduce(
    (acc, item) => acc + parseInt(item.lngTabOrderCnt),
    0
  );
  const sum4 = rowData.value.reduce(
    (acc, item) => acc + parseInt(item.lngTabOrderRate),
    0
  );

  worksheet["B1"] = { t: "s", v: "주문구분 현황" };
  worksheet["B3"] = { t: "s", v: selectedExcelStore.value };
  worksheet["B4"] = {
    t: "s",
    v: "작성일시 :" + formatDateTime3(new Date()),
  };

  worksheet["A6"] = { t: "s", v: "No" };
  worksheet["B6"] = { t: "s", v: "매장명" };
  worksheet["C6"] = { t: "s", v: "총 건수" };
  worksheet["D6"] = { t: "s", v: "POS" };
  worksheet["E6"] = { t: "s", v: "TABLET ORDER" };
  worksheet["F6"] = { t: "s", v: "TABLET ORDER 비율" };

  const totalRow = rowData.value.length + 8;

  // console.log(sum1);
  // console.log(formatNumberWithCommas(sum1));
  worksheet[`B${totalRow}`] = {
    t: "s",
    v: "합계",
  };

  worksheet[`C${totalRow}`] = {
    t: "s",
    v: formatNumberWithCommas(sum1),
  };
  worksheet[`D${totalRow}`] = {
    t: "s",
    v: formatNumberWithCommas(sum2),
  };
  worksheet[`E${totalRow}`] = {
    t: "s",
    v: formatNumberWithCommas(sum3),
  };
  worksheet[`F${totalRow}`] = {
    t: "s",
    v: formatNumberWithCommas(sum4) + "%",
  };

  worksheet["!cols"] = [
    { wch: 10 }, // No
    { wch: 40 }, // 매장명
    { wch: 20 }, // 총 건수
    { wch: 20 }, // POS
    { wch: 20 }, // TABLET ORDER
    { wch: 20 }, // TABLET ORDER 비율
  ];

  // 헤더에 스타일 적용 예시 (Pro 버전 사용 시)
  const headerStyle = {
    fill: { fgColor: { rgb: "FF87CEFA" } },
    font: { bold: true, size: 16 },
  };

  const dataStyle = {
    border: { top: "thin", left: "thin", bottom: "thin", right: "thin" },
    font: { size: 16 },
  };

  // ["A6", "B6", "C6", "D6", "E6", "F6", "G6", "H6", "I6"].forEach((cell) => {
  //   if (worksheet[cell]) {
  //     worksheet[cell].s = headerStyle;
  //   }
  // });

  for (var i = 0; i < 6; i++) {
    let cell = String.fromCharCode(65 + i) + "6";
    if (worksheet[cell]) {
      worksheet[cell].s = headerStyle;
    }
  }

  // ["A7", "B7", "C7", "D7", "A8", "B8", "C8", "D8"].forEach((cell) => {
  //   if (worksheet[cell]) {
  //     worksheet[cell].s = dataStyle;
  //   }
  // });

  for (var i = 0; i < 9; i++) {
    let cell = String.fromCharCode(65 + i);
    for (var j = 0; j < rowData.value.length; j++) {
      cell = cell + (j + 7);
      if (worksheet[cell]) {
        worksheet[cell].s = dataStyle;
      }
    }
  }

  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, "Sheet1");

  const workbookOut = write(workbook, { bookType: "xlsx", type: "binary" });

  function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
      view[i] = s.charCodeAt(i) & 0xff;
    }
    return buf;
  }

  const blob = new Blob([s2ab(workbookOut)], {
    type: "application/octet-stream",
  });

  // Blob을 가리키는 URL 생성
  const url = window.URL.createObjectURL(blob);

  // 임시 링크를 만들어 클릭 이벤트로 다운로드 실행
  const a = document.createElement("a");
  a.href = url;
  a.download = "주문구분 현황.xlsx"; // 저장될 파일명
  document.body.appendChild(a);
  a.click();
};
</script>

<style></style>
