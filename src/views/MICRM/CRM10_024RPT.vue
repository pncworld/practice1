/*--############################################################################
# Filename : CRM10_024RPT.vue                                                  
# Description : 고객관리 > 고객 예약 관리 > 예약일보.                           
# Date :2025-05-22                                                             
# Author : 권맑음                     
################################################################################*/
<template>
  <!-- 조회조건 -->
  <div class="h-full" @click="handleParentClick">
    <div class="flex justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center mr-9 space-x-2 pr-5">
        <button @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <button @click="excelButton2" class="button save w-auto excel">
          엑셀
        </button>
        <button @click="excelButton" class="button save w-auto excel">
          엑셀
        </button>
      </div>
    </div>
    <div class="flex bg-gray-200 rounded-lg h-16 items-start z-10">
      <div>
        <PickStore
          class="!-mr-10"
          :hideGroup="false"
          :hideAttr="false"
          @update:storeCd="lngStoreCode"
          @update:storeGroup="lngStoreGroup"
          @updateTime="updateTime"
          :showTime="true"
          @storeNm="excelStore">
        </PickStore>
      </div>
      <div class="ml-16">
        <Datepicker1
          @dateValue="dateValue"
          @excelDate="excelDate"
          :initToday="1"
          :mainName="'예약일'"
          class="!w-[400px] pr-5"></Datepicker1>
      </div>
      <div class="flex ml-28 mt-5">
        <div class="text-base font-semibold">고객명</div>
        <div><input type="text" class="ml-5" v-model="cond" /></div>
      </div>
      <div class="flex mt-5">
        <div class="text-base font-semibold ml-5">전화번호</div>
        <div><input type="text" class="ml-5" v-model="cond2" /></div>
        <div>(뒷4자리)</div>
      </div>
    </div>
    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="flex justify-center">
      <div
        class="overflow-y-auto h-40 w-[95%] flex justify-center items-center"
        v-if="changeTime == false">
        <Realgrid
          :progname="'CRM10_024RPT_VUE'"
          :progid="1"
          :rowData="rowData"
          :reload="reload"
          :setStateBar="false"
          :documentTitle="'CRM10_024RPT'"
          :documentSubTitle="documentSubTitle"
          :mergeColumns2="true"
          :mergeColumnGroupName2="mergeColumnGroupName2"
          :mergeColumnGroupSubList2="mergeColumnGroupSubList2"
          :rowStateeditable="false"
          :syncGridHeight="true"
          :exporttoExcel="exportExcel">
        </Realgrid>
      </div>
      <div
        v-if="changeTime == true"
        class="overflow-y-auto h-40 w-[95%] flex justify-center items-center">
        <Realgrid
          :progname="'CRM10_024RPT_VUE'"
          :progid="2"
          :rowData="rowData2"
          :reload="reload"
          :setStateBar="false"
          :documentTitle="'CRM10_024RPT'"
          :mergeColumns2="true"
          :mergeColumnGroupName2="mergeColumnGroupName2"
          :mergeColumnGroupSubList2="mergeColumnGroupSubList3"
          :documentSubTitle="documentSubTitle"
          :syncGridHeight="true"
          :rowStateeditable="false"
          :exporttoExcel="exportExcel">
        </Realgrid>
      </div>
    </div>
    <div class="flex justify-center h-full">
      <div
        class="grid grid-rows-[2fr,3fr,6fr,3fr] grid-cols-1 h-[150%] w-[95%] gap-2">
        <div>
          <div class="flex justify-start bg-purple-300 w-20">▣단체예약</div>
          <Realgrid
            :progname="'CRM10_024RPT_VUE'"
            :progid="3"
            :rowData="rowData3"
            :reload="reload"
            :setStateBar="false"
            :syncGridHeight="true"
            :documentTitle="'CRM10_024RPT'"
            :documentSubTitle="documentSubTitle"
            :rowStateeditable="false">
          </Realgrid>
        </div>
        <div class="mt-4">
          <div class="flex justify-start bg-purple-300 w-20">▣일반예약</div>
          <Realgrid
            :progname="'CRM10_024RPT_VUE'"
            :progid="4"
            :rowData="rowData4"
            :reload="reload"
            :setStateBar="false"
            :documentTitle="'CRM10_024RPT'"
            :dynamicRowHeight="true"
            :syncGridHeight="true"
            :documentSubTitle="documentSubTitle"
            :rowStateeditable="false">
          </Realgrid>
        </div>
        <div class="mt-4">
          <div class="flex justify-start bg-purple-200 w-20">▣예약취소</div>
          <Realgrid
            :progname="'CRM10_024RPT_VUE'"
            :progid="4"
            :rowData="rowData5"
            :reload="reload"
            :setStateBar="false"
            :documentTitle="'CRM10_024RPT'"
            :syncGridHeight="true"
            :documentSubTitle="documentSubTitle"
            :rowStateeditable="false">
          </Realgrid>
        </div>
      </div>
    </div>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import { getMostColumnMenuList } from "@/api/master";
import {
  getBelongCustList,
  getReservedChangeHistory,
  getReservedDetail,
  getReservedDetail2,
} from "@/api/micrm";
import Datepicker1 from "@/components/Datepicker1.vue";
import Datepicker2 from "@/components/Datepicker2.vue";
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
/**
 *  경고창 호출 라이브러리
 *  */

import Swal from "sweetalert2";
/*
 * 공통 표준  Function
 */

import { onMounted, ref } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";
import { utils, writeFile } from "xlsx-js-style";
/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
});

const reload = ref(false);
const rowData = ref([]);
const rowData2 = ref([]);
const rowData3 = ref([]);
const rowData4 = ref([]);
const rowData5 = ref([]);
const afterSearch = ref(false);

const cond = ref("");
const cond2 = ref("");
const store = useStore();

const datepicker = ref(null);
const closePopUp = ref(false);
const custId = ref("");
const strSaleCustID = (e) => {
  custId.value = e;
  initGrid();
};
const custNm = ref("");
const strSaleCustName = (e) => {
  custNm.value = e;
};

const startdate = ref("");
const dateValue = (e) => {
  startdate.value = e;
};
const enddate = ref("");
const endDate = (e) => {
  enddate.value = e;
};

const mergeColumnGroupName2 = ref(["1부", "2부"]);
const mergeColumnGroupSubList2 = ref([
  [
    "lngTime101",
    "lngTime102",
    "lngTime103",
    "lngTime104",
    "lngTime105",
    "lngTime106",
    "lngTime107",
  ],
  [
    "lngTime201",
    "lngTime202",
    "lngTime2025",
    "lngTime203",
    "lngTime204",
    "lngTime205",
    "lngTime206",
  ],
]);
const mergeColumnGroupSubList3 = ref([
  [
    "lngTime301",
    "lngTime302",
    "lngTime303",
    "lngTime304",
    "lngTime3042",
    "lngTime305",
    "lngTime306",
    "lngTime307",
    "lngTime308",
  ],
  ["lngTimeD2_1930", "lngTime401", "lngTime402"],
]);

const changeTime = ref(false);
const selectedTime = ref(0);
const updateTime = (e) => {
  initGrid();
  selectedTime.value = e;

  if (e == 1) {
    changeTime.value = false;
  } else if (e == 2) {
    changeTime.value = true;
  }
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

const searchButton = async () => {
  if (selectedStores.value == 0) {
    Swal.fire({
      title: "경고",
      text: "매장명을 먼저 선택하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  if (selectedTime.value == 0) {
    Swal.fire({
      title: "경고",
      text: "시간대를 먼저 선택하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  try {
    store.state.loading = true;
    // initGrid();
    //console.log(changeTime.value);
    if (changeTime.value == false) {
      const res = await getReservedDetail(
        selectedGroup.value,
        selectedStores.value,
        startdate.value,
        cond.value,
        cond2.value
      );
      //console.log(res);
      rowData.value = res.data.List;
      rowData3.value = res.data.List2;
      rowData4.value = res.data.List3;
      rowData5.value = res.data.List4;
    } else {
      const res = await getReservedDetail2(
        selectedGroup.value,
        selectedStores.value,
        startdate.value,
        cond.value,
        cond2.value
      );
      //console.log(res);
      rowData2.value = res.data.List;
      rowData3.value = res.data.List2;
      rowData4.value = res.data.List3;
      rowData5.value = res.data.List4;
    }

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
const selectedStoreAttrs = ref();

/**
 * 페이지 매장 코드 세팅
 */

const lngStoreCode = async (e) => {
  initGrid();
  selectedStores.value = e;
  //console.log(e);
};
const lngStoreGroup = async (e) => {
  //initGrid();
  selectedGroup.value = e;
  //console.log(e);
};

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
  if (rowData3.value.length > 0) {
    rowData3.value = [];
  }
  if (rowData4.value.length > 0) {
    rowData4.value = [];
  }
  if (rowData5.value.length > 0) {
    rowData5.value = [];
  }

  cond.value = "";
  cond2.value = "";
};

//엑셀 버튼 처리 함수
const exportExcel = ref(false);
/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  documentSubTitle.value =
    selectedExcelStore.value + "\n" + selectedExcelDate.value;

  //documentSubTitle.value += "\n";
  exportExcel.value = !exportExcel.value;
};
const excelButton2 = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 진행해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (selectedTime.value == 0) {
    return;
  }
  const time = ref("런치");
  if (selectedTime.value == 1) {
    time.value = "런치";
  } else {
    time.value = "디너";
  }

  const worksheet = {};
  worksheet["A1"] = { t: "s", v: "예약일보" };
  worksheet["A2"] = { t: "s", v: "예약일 : " + startdate.value };
  worksheet["A3"] = { t: "s", v: selectedExcelStore.value };
  worksheet["A4"] = { t: "s", v: "시간 : " + time.value };

  const maxrow =
    rowData3.value.length + rowData4.value.length + rowData5.value.length;
  worksheet["!ref"] = `A1:K${maxrow}`;

  worksheet["A6"] = { t: "s", v: "▣단체예약" };

  const columns = [
    "strRoom",
    "dtmRsvTime",
    "strRsvName",
    "lngAdultCnt",
    "lngChildCnt",
    "strRsvTelNo",
    "strTable",
    "strChargerName",
    "dtmInsert",
    "strRAmount",
    "strRRemark",
  ];
  const columns2 = [
    "룸",
    "시간",
    "고객명",
    "어른",
    "아이",
    "연락처",
    "테이블",
    "접수자",
    "접수일",
    "예약금",
    "비고",
  ];

  const columns3 = [
    "RowNumber",
    "dtmRsvTime",
    "strRsvName",
    "lngAdultCnt",
    "lngChildCnt",
    "strRsvTelNo",
    "strTable",
    "strChargerName",
    "dtmInsert",
    "strRAmount",
    "strRRemark",
  ];
  const columns4 = [
    "No",
    "시간",
    "고객명",
    "어른",
    "아이",
    "연락처",
    "테이블",
    "접수자",
    "접수일",
    "예약금",
    "비고",
  ];

  columns.forEach((col, index) => {
    const colLetter = getColumnLetter(index);
    worksheet[`${colLetter}7`] = {
      t: "s",
      v: columns2[index],
      s: {
        font: { name: "맑은 고딕", sz: 11, bold: true },
        alignment: { wrapText: true, vertical: "top" },
      },
    };
  });

  rowData3.value.forEach((row, rowIndex) => {
    const excelRow = 8 + rowIndex;
    columns.forEach((col, colIndex) => {
      const colLetter = getColumnLetter(colIndex);
      const cellAddress = `${colLetter}${excelRow}`;
      const cellValue = row[col];
      const cellType = typeof cellValue === "number" ? "n" : "s";
      worksheet[cellAddress] = { t: cellType, v: cellValue };
    });
  });

  const maxRow = rowData3.value.length + 9;
  worksheet[`A${maxRow}`] = { t: "s", v: "▣일반예약" };
  columns3.forEach((col, index) => {
    const colLetter = getColumnLetter(index);
    worksheet[`${colLetter}${maxRow + 1}`] = {
      t: "s",
      v: columns4[index],
      s: {
        font: { name: "맑은 고딕", sz: 11, bold: true },
        alignment: { wrapText: true, vertical: "top" },
      },
    };
  });

  rowData4.value.forEach((row, rowIndex) => {
    const excelRow = maxRow + 2 + rowIndex;
    columns3.forEach((col, colIndex) => {
      const colLetter = getColumnLetter(colIndex);
      const cellAddress = `${colLetter}${excelRow}`;
      const cellValue = row[col];
      const cellType = typeof cellValue === "number" ? "n" : "s";
      worksheet[cellAddress] = { t: cellType, v: cellValue };
      if (!worksheet[excelRow + rowIndex]) worksheet[excelRow + rowIndex] = [];
      worksheet[excelRow + rowIndex][colIndex] = { hpt: 150 };
    });
  });

  const maxRow2 = rowData3.value.length + rowData4.value.length + 12;
  worksheet[`A${maxRow2}`] = { t: "s", v: "▣예약취소" };
  columns3.forEach((col, index) => {
    const colLetter = getColumnLetter(index);
    worksheet[`${colLetter}${maxRow2 + 1}`] = {
      t: "s",
      v: columns4[index],
      s: {
        font: { name: "맑은 고딕", sz: 11, bold: true },
        alignment: { wrapText: true, vertical: "top" },
      },
    };
  });

  rowData5.value.forEach((row, rowIndex) => {
    const excelRow = maxRow2 + 2 + rowIndex;
    columns.forEach((col, colIndex) => {
      const colLetter = getColumnLetter(colIndex);
      const cellAddress = `${colLetter}${excelRow}`;
      const cellValue = row[col];
      const cellType = typeof cellValue === "number" ? "n" : "s";
      worksheet[cellAddress] = { t: cellType, v: cellValue };
    });
  });

  const lastCol = getColumnLetter(columns.length - 1); // 마지막 열 (예: 'C')
  const lastRow =
    12 +
    rowData3.value.length +
    rowData4.value.length +
    rowData5.value.length +
    2; // 데이터 끝나는 행
  for (let i = 0; i < lastRow; i++) {
    for (let j = 0; j < lastRow; j++) {
      const colLetter = String.fromCharCode(65 + j); // A, B, C...
      const cellRef = `${colLetter}${i + 1}`; // Excel은 1-based

      if (worksheet[cellRef]) {
        worksheet[cellRef].s = {
          font: { name: "맑은 고딕", sz: 11 },
          alignment: {
            horizontal: "center",
            vertical: "center",
            wrapText: true,
          },
        };
      }
    }
  }
  worksheet["!ref"] = `A1:${lastCol}${lastRow}`;
  worksheet["!cols"] = [
    { wch: 20 }, // strRoom
    { wch: 12 }, // dtmRsvTime
    { wch: 18 }, // strRsvName
    { wch: 12 }, // lngAdultCnt
    { wch: 12 }, // lngChildCnt
    { wch: 20 }, // strRsvTelNo
    { wch: 20 }, // strTable
    { wch: 20 }, // strChargerName
    { wch: 16 }, // dtmInsert
    { wch: 20 }, // strRAmount
    { wch: 60 }, // strRRemark
  ];

  // 워크북에 시트 추가
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, "예약일보");

  // 파일 저장
  writeFile(workbook, `예약일보.xlsx`);
};

function getColumnLetter(index) {
  let letter = "";
  while (index >= 0) {
    letter = String.fromCharCode((index % 26) + 65) + letter;
    index = Math.floor(index / 26) - 1;
  }
  return letter;
}

// 엑셀 추출
const documentSubTitle = ref("");
const selectedExcelList = ref("");
const selectedExcelDate = ref("");

const selectedExcelStore = ref("");
/**
 * 엑셀용 매장 세팅 함수
 */

const excelStore = (e) => {
  selectedExcelStore.value = "매장명 : " + e;
  //comsole.log(e);
};
const excelDate = (e) => {
  selectedExcelDate.value = e;
  //comsole.log(e);
};
</script>
