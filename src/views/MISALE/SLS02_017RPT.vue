<template>
  <div class="h-full" @click="handleParentClick">
    <div class="flex justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center mr-9 space-x-2 pr-5">
        <button @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <button @click="excelButton" class="button save w-auto excel">
          엑셀
        </button>
        <button @click="printButton" class="button print w-auto">인쇄</button>
      </div>
    </div>
    <div
      class="grid grid-rows-2 grid-cols-2 justify-between bg-gray-200 rounded-lg h-24 items-center z-10">
      <div class="mt-5">
        <Datepicker2
          @endDate="endDate"
          @startDate="startDate"
          @excelDate="excelDate"
          :closePopUp="closePopUp"
          ref="datepicker"></Datepicker2>
      </div>
      <div class="mt-10">
        <PickStoreSingle2
          @lngStoreCode="lngStoreCode"
          @lngStoreGroup="lngStoreGroup"
          @excelStore="excelStore"
          @lngStoreAttrs="lngStoreAttrs"
          @lngStoreTeam="lngStoreTeam"
          @lngSupervisor="lngSupervisor"
          :placeholderName="'선택'">
        </PickStoreSingle2>
      </div>
      <div class="-ml-96 mr-5">
        <label for="bill"
          ><input
            type="checkbox"
            id="bill"
            @click="checkBill" />지폐권종표시</label
        >
      </div>
    </div>

    <div class="grid grid-rows-[1fr,1fr,2.5fr,1fr] grid-cols-1 h-[83%]">
      <div>
        <div class="flex justify-start ml-5">○시간대별 내역</div>
        <Realgrid
          :progname="'SLS02_017RPT_VUE'"
          :progid="1"
          :rowData="rowData"
          :reload="reload"
          :exporttoExcel="exportExcel"
          :documentSubTitle="documentSubTitle"
          :documentTitle="'SLS06_005RPT'"
          :getJson="getJson"
          @getJsonData="getJsonData">
        </Realgrid>
      </div>
      <div>
        <div class="flex justify-between ml-5 mt-5">
          <div>○매출세부내역</div>
          <div class="mr-[34%]">○메뉴그룹별내역</div>
        </div>
        <div class="flex justify-between h-[90%] mt-2 space-x-80">
          <Realgrid
            :progname="'SLS02_017RPT_VUE'"
            :progid="2"
            :rowData="rowData2"
            :reload="reload"
            :exporttoExcel="exportExcel"
            :documentSubTitle="documentSubTitle"
            :documentTitle="'SLS06_005RPT'"
            :getJson="getJson"
            @getJsonData="getJsonData2">
          </Realgrid>
          <Realgrid
            :progname="'SLS02_017RPT_VUE'"
            :progid="5"
            :rowData="rowData5"
            :reload="reload"
            :exporttoExcel="exportExcel"
            :documentSubTitle="documentSubTitle"
            :documentTitle="'SLS06_005RPT'"
            :getJson="getJson"
            @getJsonData="getJsonData5">
          </Realgrid>
        </div>
      </div>
      <div>
        <div class="flex justify-between ml-5 mt-8">
          <div>○현금정산내역</div>
          <div class="mr-[34%]">○신용카드별내역</div>
        </div>
        <div class="flex justify-between h-[86%] space-x-80">
          <Realgrid
            :progname="'SLS02_017RPT_VUE'"
            :progid="3"
            :rowData="rowData3"
            :getJson="getJson"
            @getJsonData="getJsonData3"></Realgrid>
          <Realgrid
            :progname="'SLS02_017RPT_VUE'"
            :progid="6"
            :rowData="rowData6"
            :getJson="getJson"
            @getJsonData="getJsonData6"></Realgrid>
        </div>
      </div>
      <div>
        <div class="flex justify-between ml-5 mt-2">
          <div>○매출취소내역</div>
          <div class="mr-[34%]">○개점/마감내역</div>
        </div>
        <div class="flex justify-between h-[90%] space-x-80">
          <Realgrid
            :progname="'SLS02_017RPT_VUE'"
            :progid="4"
            :rowData="rowData4"
            :getJson="getJson"
            @getJsonData="getJsonData4"></Realgrid>
          <Realgrid
            :progname="'SLS02_017RPT_VUE'"
            :progid="7"
            :rowData="rowData7"
            :getJson="getJson"
            @getJsonData="getJsonData7"></Realgrid>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getSalesDayReport } from "@/api/misales";
import Datepicker2 from "@/components/Datepicker2.vue";
import PageName from "@/components/pageName.vue";
import PickStoreSingle2 from "@/components/pickStoreSingle.vue";
import Realgrid from "@/components/realgrid.vue";
import { insertPageLog } from "@/customFunc/customFunc";
import Swal from "sweetalert2";
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
import { utils, write, writeFile } from "xlsx-js-style";

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
});

const excelstore = ref();
const selectedGroup = ref();
const selectedStore = ref();
const selectedStoreAttr = ref();
const selectedStoreTeam = ref();
const selectedStoreSuperVisor = ref();

const getJson = ref(false);

const lngStoreGroup = (e) => {
  selectedGroup.value = e;
  console.log(e);
};
const lngStoreCode = (e) => {
  initGrid();
  selectedStore.value = e;
  console.log(e);
};
const lngStoreAttrs = (e) => {
  initGrid();
  selectedStoreAttr.value = e;
};
const lngStoreTeam = (e) => {
  initGrid();
  selectedStoreTeam.value = e;
};
const lngSupervisor = (e) => {
  initGrid();
  selectedStoreSuperVisor.value = e;
};
const excelStore = (e) => {
  excelstore.value = e;
};

const receiptNo = ref();

const store = useStore();
const loginedlngLang = store.state.userData.lngLanguage;
console.log(store);
const selectedstartDate = ref();
const selectedendDate = ref();
const startDate = (e) => {
  console.log(e);
  selectedstartDate.value = e;
};
const endDate = (e) => {
  selectedendDate.value = e;
};
const afterSearch = ref(false);
const searchButton = async () => {
  // initCheckBox.value = !initCheckBox.value
  // initSearchWord.value = !initSearchWord.value
  if (selectedStore.value == 0) {
    Swal.fire({
      title: "경고",
      text: "매장을 선택하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  store.state.loading = true;
  try {
    initGrid();
    const res = await getSalesDayReport(
      selectedGroup.value,
      selectedStore.value,
      selectedstartDate.value,
      selectedendDate.value,
      whetherBill.value,
      loginedlngLang
    );
    console.log(res);

    rowData.value = res.data.TIMELIST;
    rowData2.value = res.data.SALESDATA1;
    rowData3.value = res.data.SALESDATA1_2;
    rowData4.value = res.data.SALESDATA2;
    rowData5.value = res.data.SALESDATA3;
    rowData6.value = res.data.SALESDATA4;
    rowData7.value = res.data.SALESDATA5;
    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
  } finally {
    store.state.loading = false;
  }
};

const rowData = ref([]);
const rowData2 = ref([]);
const rowData3 = ref([]);
const rowData4 = ref([]);
const rowData5 = ref([]);
const rowData6 = ref([]);
const rowData7 = ref([]);

const exportExcel1 = ref();
const exportExcel2 = ref();
const exportExcel3 = ref();
const exportExcel4 = ref();
const exportExcel5 = ref();
const exportExcel6 = ref();
const exportExcel7 = ref();

const getJsonData = (e) => {
  exportExcel1.value = e;
};
const getJsonData2 = (e) => {
  exportExcel2.value = e;
};
const getJsonData3 = (e) => {
  exportExcel3.value = e;
};
const getJsonData4 = (e) => {
  exportExcel4.value = e;
};
const getJsonData5 = (e) => {
  exportExcel5.value = e;
};
const getJsonData6 = (e) => {
  exportExcel6.value = e;
};
const getJsonData7 = (e) => {
  exportExcel7.value = e;
};

const exceloutput = ref(false);
const excelButton = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 진행해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  getJson.value = !getJson.value;
  setTimeout(() => {
    const wb = utils.book_new();
    const ws = utils.aoa_to_sheet([]);

    ws["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 9 } }, // A1~J1 병합
      { s: { r: 2, c: 7 }, e: { r: 4, c: 9 } },
    ]; //A1~ j1 병합

    utils.sheet_add_aoa(ws, [["일일 정산 레포트"]], { origin: "A1" });

    //utils.sheet_add_aoa(ws, [['조회기간 :' + selectedstartDate.value + "~" + selectedendDate.value +'\n'+excelstore.value ]], { origin: "H3" });

    utils.sheet_add_aoa(
      ws,
      [
        [
          "시간대",
          "조수",
          "조수누계",
          "객수",
          "객수누계",
          "매출액",
          "매출액누계",
          "객단가",
          "객단가누계",
          "비율",
        ],
      ],
      { origin: "A8" }
    );

    exportExcel1.value = exportExcel1.value.map((item) => ({
      ...item,
      dblDistRate: new Intl.NumberFormat("ko-KR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(item.dblDistRate),
    }));
    utils.sheet_add_json(ws, exportExcel1.value, {
      origin: "A9",
      skipHeader: true,
    });

    const firstTableRows = exportExcel1.value.length + 10;

    const subtitle = "A" + (firstTableRows + 1);

    const secondTableStartRow = firstTableRows + 2;
    const origin = "A" + secondTableStartRow;
    const origin2 = "A" + (secondTableStartRow + 1); // exportExcel2.value.length
    utils.sheet_add_aoa(ws, [["세부항목", "건수", "금액", "비율"]], {
      origin: origin,
    });
    utils.sheet_add_json(ws, exportExcel2.value, {
      origin: origin2,
      skipHeader: true,
    });

    const thirdTableRows = secondTableStartRow + exportExcel2.value.length + 2;
    const subtitle2 = "A" + (thirdTableRows + 1);
    const origin3 = "A" + (thirdTableRows + 2);
    const origin4 = "A" + (thirdTableRows + 3);
    utils.sheet_add_aoa(ws, [["정산항목", "건수", "금액", "비율"]], {
      origin: origin3,
    });
    utils.sheet_add_json(ws, exportExcel3.value, {
      origin: origin4,
      skipHeader: true,
    });

    const fourthTableRows = thirdTableRows + exportExcel3.value.length + 2;
    const subtitle3 = "A" + (fourthTableRows + 2);
    const origin5 = "A" + (fourthTableRows + 3);
    const origin6 = "A" + (fourthTableRows + 4);

    utils.sheet_add_aoa(ws, [["취소항목", "건수", "금액"]], {
      origin: origin5,
    });
    utils.sheet_add_json(ws, exportExcel4.value, {
      origin: origin6,
      skipHeader: true,
    });

    const origin7 = "G" + secondTableStartRow;
    const origin8 = "G" + (secondTableStartRow + 1);
    const subtitle4 = "G" + (secondTableStartRow - 1);

    utils.sheet_add_aoa(ws, [["메뉴그룹명", "건수", "금액", "비율"]], {
      origin: origin7,
    });

    exportExcel5.value = exportExcel5.value.map((item) => ({
      ...item,
      dblRate: new Intl.NumberFormat("ko-KR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(item.dblRate),
    }));
    utils.sheet_add_json(ws, exportExcel5.value, {
      origin: origin8,
      skipHeader: true,
    });

    const fifthTableRows = secondTableStartRow + exportExcel5.value.length + 2;
    const origin9 = "G" + (fifthTableRows + 1);
    const origin10 = "G" + (fifthTableRows + 2);
    const subtitle5 = "G" + fifthTableRows;

    utils.sheet_add_aoa(ws, [["카드사명", "건수", "금액", "비율"]], {
      origin: origin9,
    });

    exportExcel6.value = exportExcel6.value.map((item) => ({
      ...item,
      dblRate: new Intl.NumberFormat("ko-KR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(item.dblRate),
    }));
    utils.sheet_add_json(ws, exportExcel6.value, {
      origin: origin10,
      skipHeader: true,
    });

    const lastTableRows = fifthTableRows + exportExcel6.value.length + 2;
    const origin11 = "G" + (lastTableRows + 2);
    const origin12 = "G" + (lastTableRows + 3);
    const subtitle6 = "G" + (lastTableRows + 1);

    utils.sheet_add_aoa(ws, [["세션구분", "포스", "작업시간", "담당자명"]], {
      origin: origin11,
    });

    utils.sheet_add_json(ws, exportExcel7.value, {
      origin: origin12,
      skipHeader: true,
    });

    let exceptionCenter = [];
    for (let i = 0; i < exportExcel2.value.length; i++) {
      exceptionCenter.push("A" + (i + 1));
    }
    for (let i = 0; i < exportExcel7.value.length; i++) {
      exceptionCenter.push("H" + (i + lastTableRows + 3));
      exceptionCenter.push("I" + (i + lastTableRows + 3));
    }

    for (const cell in ws) {
      if (cell[0] === "!") continue; // 스페셜 키는 건너뛰기

      const isNumber = !isNaN(ws[cell].v);
      ws[cell].s = {
        font: {
          name: "맑은 고딕", // 폰트 이름
          sz: 12, // 폰트 크기
          bold: false, // 굵게 여부
          color: { rgb: "000000" }, // 폰트 색상 (검정)
        },
        alignment: {
          horizontal: exceptionCenter.includes(cell)
            ? "center"
            : !isNumber
            ? "left"
            : "right", // 가로 중앙 정렬 const origin2 = "A" + (secondTableStartRow+1); // exportExcel2.value.length
          vertical: exceptionCenter.includes(cell)
            ? "center"
            : !isNumber
            ? "left"
            : "right", // 세로 중앙 정렬
        },
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } },
        },
      };
      if (ws[cell].t === "n") {
        // 천단위 구분자로 표시: 소수점 없이 표시하려면 "#,##0", 소수점이 필요하면 "#,##0.00" 등 사용
        ws[cell].z = "#,##0";
      }
    }
    ws["A1"].s = {
      font: {
        bold: true, // 굵게
        sz: 25, // 폰트 크기
      },
      alignment: {
        horizontal: "center", // 가로 중앙 정렬
        vertical: "center", // 세로 중앙 정렬
      },
    };

    utils.sheet_add_aoa(ws, [["○시간대별 매출 내역"]], { origin: "A7" });
    utils.sheet_add_aoa(ws, [["○매출 세부 내역"]], { origin: subtitle });
    utils.sheet_add_aoa(ws, [["○현금 정산 내역"]], { origin: subtitle2 });
    utils.sheet_add_aoa(ws, [["○매출 취소 내역"]], { origin: subtitle3 });
    utils.sheet_add_aoa(ws, [["○메뉴 그룹별 내역"]], { origin: subtitle4 });
    utils.sheet_add_aoa(ws, [["○신용카드 별 내역"]], { origin: subtitle5 });
    utils.sheet_add_aoa(ws, [["○개점/마감내역"]], { origin: subtitle6 });

    const range6 = [
      "A8",
      "B8",
      "C8",
      "D8",
      "E8",
      "F8",
      "G8",
      "H8",
      "I8",
      "J8",
      "A" + secondTableStartRow,
      "B" + secondTableStartRow,
      "C" + secondTableStartRow,
      "D" + secondTableStartRow,
      "A" + (thirdTableRows + 2),
      "B" + (thirdTableRows + 2),
      "C" + (thirdTableRows + 2),
      "D" + (thirdTableRows + 2),
      "A" + (fourthTableRows + 3),
      "B" + (fourthTableRows + 3),
      "C" + (fourthTableRows + 3),
      "G" + secondTableStartRow,
      "H" + secondTableStartRow,
      "I" + secondTableStartRow,
      "J" + secondTableStartRow,
      "G" + (fifthTableRows + 1),
      "H" + (fifthTableRows + 1),
      "I" + (fifthTableRows + 1),
      "J" + (fifthTableRows + 1),
      "G" + (lastTableRows + 2),
      "H" + (lastTableRows + 2),
      "I" + (lastTableRows + 2),
      "J" + (lastTableRows + 2),
    ];
    range6.forEach((cell) => {
      ws[cell].s = {
        font: {
          name: "맑은 고딕", // 폰트 이름
          sz: 12, // 폰트 크기
          bold: true, // 굵게 여부
          color: { rgb: "000000" }, // 폰트 색상 (검정)
        },
        alignment: {
          horizontal: "center", // 가로 중앙 정렬
          vertical: "center", // 세로 중앙 정렬
        },
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } },
        },
      };
    });

    ws["!cols"] = [
      { wch: 30 }, // A열 너비: 30문자
      { wch: 10 }, // B열 너비: 15문자
      { wch: 15 }, // C열 너비: 20문자
      { wch: 10 }, // D열 너비: 20문자
      { wch: 15 }, // E열 너비: 20문자
      { wch: 15 }, // F열 너비: 20문자
      { wch: 30 }, // G열 너비: 20문자
      { wch: 15 }, // H열 너비: 20문자
      { wch: 25 }, // I열 너비: 20문자
      { wch: 15 }, // I열 너비: 20문자
    ];

    // H3 셀에 줄바꿈 포함된 텍스트 추가
    const cellAddress = "H3";
    const cell = ws[cellAddress] || {};
    cell.v = `조회기간: ${selectedstartDate.value} ~ ${selectedendDate.value}\n${excelstore.value}`;
    cell.s = {
      alignment: {
        horizontal: "left",
        vertical: "top",
        wrapText: true, // 텍스트 줄 바꿈 활성화
      },
    };
    ws[cellAddress] = cell;

    utils.book_append_sheet(wb, ws, "Sheet1");

    writeFile(wb, "일일 정산 레포트.xlsx");
  }, 100);
};

const printButton = () => {
  getJson.value = !getJson.value;
  setTimeout(() => {
    const wb = utils.book_new();
    const ws = utils.aoa_to_sheet([]);

    ws["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 9 } }, // A1~J1 병합
      { s: { r: 2, c: 7 }, e: { r: 4, c: 9 } },
    ]; //A1~ j1 병합

    utils.sheet_add_aoa(ws, [["일일 정산 레포트"]], { origin: "A1" });

    //utils.sheet_add_aoa(ws, [['조회기간 :' + selectedstartDate.value + "~" + selectedendDate.value +'\n'+excelstore.value ]], { origin: "H3" });

    utils.sheet_add_aoa(
      ws,
      [
        [
          "시간대",
          "조수",
          "조수누계",
          "객수",
          "객수누계",
          "매출액",
          "매출액누계",
          "객단가",
          "객단가누계",
          "비율",
        ],
      ],
      { origin: "A8" }
    );

    exportExcel1.value = exportExcel1.value.map((item) => ({
      ...item,
      dblDistRate: new Intl.NumberFormat("ko-KR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(item.dblDistRate),
    }));
    utils.sheet_add_json(ws, exportExcel1.value, {
      origin: "A9",
      skipHeader: true,
    });

    const firstTableRows = exportExcel1.value.length + 10;

    const subtitle = "A" + (firstTableRows + 1);

    const secondTableStartRow = firstTableRows + 2;
    const origin = "A" + secondTableStartRow;
    const origin2 = "A" + (secondTableStartRow + 1);
    utils.sheet_add_aoa(ws, [["세부항목", "건수", "금액", "비율"]], {
      origin: origin,
    });
    utils.sheet_add_json(ws, exportExcel2.value, {
      origin: origin2,
      skipHeader: true,
    });

    const thirdTableRows = secondTableStartRow + exportExcel2.value.length + 2;
    const subtitle2 = "A" + (thirdTableRows + 1);
    const origin3 = "A" + (thirdTableRows + 2);
    const origin4 = "A" + (thirdTableRows + 3);
    utils.sheet_add_aoa(ws, [["정산항목", "건수", "금액", "비율"]], {
      origin: origin3,
    });
    utils.sheet_add_json(ws, exportExcel3.value, {
      origin: origin4,
      skipHeader: true,
    });

    const fourthTableRows = thirdTableRows + exportExcel3.value.length + 2;
    const subtitle3 = "A" + (fourthTableRows + 2);
    const origin5 = "A" + (fourthTableRows + 3);
    const origin6 = "A" + (fourthTableRows + 4);

    utils.sheet_add_aoa(ws, [["취소항목", "건수", "금액"]], {
      origin: origin5,
    });
    utils.sheet_add_json(ws, exportExcel4.value, {
      origin: origin6,
      skipHeader: true,
    });

    const origin7 = "G" + secondTableStartRow;
    const origin8 = "G" + (secondTableStartRow + 1);
    const subtitle4 = "G" + (secondTableStartRow - 1);

    utils.sheet_add_aoa(ws, [["메뉴그룹명", "건수", "금액", "비율"]], {
      origin: origin7,
    });

    exportExcel5.value = exportExcel5.value.map((item) => ({
      ...item,
      dblRate: new Intl.NumberFormat("ko-KR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(item.dblRate),
    }));
    utils.sheet_add_json(ws, exportExcel5.value, {
      origin: origin8,
      skipHeader: true,
    });

    const fifthTableRows = secondTableStartRow + exportExcel5.value.length + 2;
    const origin9 = "G" + (fifthTableRows + 1);
    const origin10 = "G" + (fifthTableRows + 2);
    const subtitle5 = "G" + fifthTableRows;

    utils.sheet_add_aoa(ws, [["카드사명", "건수", "금액", "비율"]], {
      origin: origin9,
    });

    exportExcel6.value = exportExcel6.value.map((item) => ({
      ...item,
      dblRate: new Intl.NumberFormat("ko-KR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(item.dblRate),
    }));
    utils.sheet_add_json(ws, exportExcel6.value, {
      origin: origin10,
      skipHeader: true,
    });

    const lastTableRows = fifthTableRows + exportExcel6.value.length + 2;
    const origin11 = "G" + (lastTableRows + 2);
    const origin12 = "G" + (lastTableRows + 3);
    const subtitle6 = "G" + (lastTableRows + 1);

    utils.sheet_add_aoa(ws, [["세션구분", "포스", "작업시간", "담당자명"]], {
      origin: origin11,
    });

    utils.sheet_add_json(ws, exportExcel7.value, {
      origin: origin12,
      skipHeader: true,
    });

    for (const cell in ws) {
      if (cell[0] === "!") continue; // 스페셜 키는 건너뛰기
      ws[cell].s = {
        font: {
          name: "맑은 고딕", // 폰트 이름
          sz: 12, // 폰트 크기
          bold: false, // 굵게 여부
          color: { rgb: "000000" }, // 폰트 색상 (검정)
        },
        alignment: {
          horizontal: "center", // 가로 중앙 정렬
          vertical: "center", // 세로 중앙 정렬
        },
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } },
        },
      };
      if (ws[cell].t === "n") {
        // 천단위 구분자로 표시: 소수점 없이 표시하려면 "#,##0", 소수점이 필요하면 "#,##0.00" 등 사용
        ws[cell].z = "#,##0";
      }
    }
    ws["A1"].s = {
      font: {
        bold: true, // 굵게
        sz: 25, // 폰트 크기
      },
      alignment: {
        horizontal: "center", // 가로 중앙 정렬
        vertical: "center", // 세로 중앙 정렬
      },
    };

    utils.sheet_add_aoa(ws, [["○시간대별 매출 내역"]], { origin: "A7" });
    utils.sheet_add_aoa(ws, [["○매출 세부 내역"]], { origin: subtitle });
    utils.sheet_add_aoa(ws, [["○현금 정산 내역"]], { origin: subtitle2 });
    utils.sheet_add_aoa(ws, [["○매출 취소 내역"]], { origin: subtitle3 });
    utils.sheet_add_aoa(ws, [["○메뉴 그룹별 내역"]], { origin: subtitle4 });
    utils.sheet_add_aoa(ws, [["○신용카드 별 내역"]], { origin: subtitle5 });
    utils.sheet_add_aoa(ws, [["○개점/마감내역"]], { origin: subtitle6 });

    const range6 = [
      "A8",
      "B8",
      "C8",
      "D8",
      "E8",
      "F8",
      "G8",
      "H8",
      "I8",
      "J8",
      "A" + secondTableStartRow,
      "B" + secondTableStartRow,
      "C" + secondTableStartRow,
      "D" + secondTableStartRow,
      "A" + (thirdTableRows + 2),
      "B" + (thirdTableRows + 2),
      "C" + (thirdTableRows + 2),
      "D" + (thirdTableRows + 2),
      "A" + (fourthTableRows + 3),
      "B" + (fourthTableRows + 3),
      "C" + (fourthTableRows + 3),
      "G" + secondTableStartRow,
      "H" + secondTableStartRow,
      "I" + secondTableStartRow,
      "J" + secondTableStartRow,
      "G" + (fifthTableRows + 1),
      "H" + (fifthTableRows + 1),
      "I" + (fifthTableRows + 1),
      "J" + (fifthTableRows + 1),
      "G" + (lastTableRows + 2),
      "H" + (lastTableRows + 2),
      "I" + (lastTableRows + 2),
      "J" + (lastTableRows + 2),
    ];
    range6.forEach((cell) => {
      ws[cell].s = {
        font: {
          name: "맑은 고딕", // 폰트 이름
          sz: 12, // 폰트 크기
          bold: true, // 굵게 여부
          color: { rgb: "000000" }, // 폰트 색상 (검정)
        },
        alignment: {
          horizontal: "center", // 가로 중앙 정렬
          vertical: "center", // 세로 중앙 정렬
        },
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } },
        },
      };
    });

    ws["!cols"] = [
      { wch: 30 }, // A열 너비: 30문자
      { wch: 10 }, // B열 너비: 15문자
      { wch: 15 }, // C열 너비: 20문자
      { wch: 10 }, // D열 너비: 20문자
      { wch: 15 }, // E열 너비: 20문자
      { wch: 15 }, // F열 너비: 20문자
      { wch: 30 }, // G열 너비: 20문자
      { wch: 15 }, // H열 너비: 20문자
      { wch: 25 }, // I열 너비: 20문자
      { wch: 15 }, // I열 너비: 20문자
    ];

    // H3 셀에 줄바꿈 포함된 텍스트 추가
    const cellAddress = "H3";
    const cell = ws[cellAddress] || {};
    cell.v = `조회기간: ${selectedstartDate.value} ~ ${selectedendDate.value}\n${excelstore.value}`;
    cell.s = {
      alignment: {
        horizontal: "top",
        vertical: "center",
        wrapText: true, // 텍스트 줄 바꿈 활성화
      },
    };
    ws[cellAddress] = cell;

    utils.book_append_sheet(wb, ws, "Sheet1");

    let html = utils.sheet_to_html(wb.Sheets[wb.SheetNames[0]], {
      raw: true,
      bookTabs: false,
    });

    html = html.replace(/\n/g, "<br>");

    // **컬럼 너비 스타일 생성 함수**
    function getColumnStyles(worksheet) {
      if (!worksheet["!cols"]) return ""; // 컬럼 정보가 없으면 빈 문자열 반환

      let colStyles = "<colgroup>";
      worksheet["!cols"].forEach((col) => {
        if (col.wpx) {
          // 픽셀 단위 너비 정보가 있는 경우
          colStyles += `<col style="width: ${col.wpx}px;">`;
        } else if (col.wch) {
          // 문자 단위 너비 정보가 있는 경우 (대략적인 너비)
          colStyles += `<col style="width: ${col.wch * 8}px;">`; // 8px는 임의의 문자 너비 값, 조정 필요
        } else {
          colStyles += "<col>"; // 너비 정보가 없으면 기본 너비
        }
      });
      colStyles += "</colgroup>";
      return colStyles;
    }

    const columnStyles = getColumnStyles(wb.Sheets[wb.SheetNames[0]]); // 컬럼 스타일 생성

    const style = `
  <style>
    table {
      width: 100%;
      border-collapse: collapse;
    }
    table, th, td {
      border: 1px solid black;
    }
    th, td {
      padding: 8px;
      text-align: left;
      vertical-align: top; /* 셀 내용 상단 정렬 (엑셀과 유사) */
      white-space: nowrap; /* 셀 내용 줄바꿈 방지 (엑셀과 유사, 필요에 따라 제거) */
    }
    /* 추가적인 테이블 스타일 (필요에 따라 조정) */
    body {
      font-family: Arial, sans-serif; /* 폰트 설정 (엑셀 기본 폰트와 유사) */
      font-size: 10pt; /* 기본 폰트 크기 (엑셀 기본 크기와 유사) */
    }
  </style>
`;

    const printWindow = window.open("", "_blank");
    printWindow.document.open();
    printWindow.document.write(`
  <html>
    <head>
      <title>Print</title>
      ${style}
    </head>
    <body>
      ${columnStyles} ${html}
    </body>
  </html>
`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    // printWindow.close(); // 사용자 경험 개선을 위해 자동 닫기 제거 (이전 답변 참고)
  }, 100);
};

// 바이너리 문자열을 ArrayBuffer로 변환하는 함수
// function s2ab(s) {
//   const buf = new ArrayBuffer(s.length);
//   const view = new Uint8Array(buf);
//   for (let i = 0; i < s.length; i++) {
//     view[i] = s.charCodeAt(i) & 0xFF;
//   }
//   return buf;
// }

const initGrid = () => {
  if (rowData.value.length != 0) {
    rowData.value = [];
  }
  if (rowData2.value.length != 0) {
    rowData2.value = [];
  }
  if (rowData3.value.length != 0) {
    rowData3.value = [];
  }
  if (rowData4.value.length != 0) {
    rowData4.value = [];
  }
  if (rowData5.value.length != 0) {
    rowData5.value = [];
  }
  if (rowData6.value.length != 0) {
    rowData6.value = [];
  }
  if (rowData7.value.length != 0) {
    rowData7.value = [];
  }
};
const whetherBill = ref(0);
const checkBill = (e) => {
  if (e.target.checked) {
    whetherBill.value = "1";
  } else {
    whetherBill.value = "0";
  }
};

const closePopUp = ref(false);
const datepicker = ref(null);
const handleParentClick = (e) => {
  const datepickerEl = datepicker.value?.$el;

  if (datepickerEl && datepickerEl.contains(e.target)) {
    return;
  }
  closePopUp.value = !closePopUp.value;
};
</script>
