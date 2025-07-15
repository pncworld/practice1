/*--############################################################################
# Filename : SLS01_001INS.vue                                                  
# Description : 매출관리 > 매출 목표 관리 > 일별 매출 계획 등록.               
# Date :2025-05-14                                                             
# Author : 권맑음                     
################################################################################*/
<template>
  <!-- 조회 조건 -->
  <div class="flex justify-between items-center w-full overflow-y-hidden">
    <PageName></PageName>
    <div class="flex justify-center mr-9 space-x-2 pr-5">
      <button @click="searchButton" class="button search md:w-auto w-14">
        조회
      </button>
      <button @click="saveButton" class="button save md:w-auto w-14">
        저장
      </button>
      <button @click="excelButton" class="button w-auto excel">엑셀</button>
    </div>
  </div>
  <div
    class="grid grid-rows-1 grid-cols-[7fr,7fr] justify-between bg-gray-200 rounded-lg h-48 items-start z-10">
    <div class="grid grid-cols-1 grid-rows-4 h-full">
      <Datepicker3
        @startYear="startYear"
        @startMonth="startMonth"
        :hideEndDate="false"
        @excelDate="excelDate"
        :firstName="'날짜'"
        class="ml-[109px]"
        :prevMonth="prevMonth"
        :nextMonth="nextMonth"
        :initMonth="1"
        :stopLimit="true">
      </Datepicker3>

      <div class="flex items-center justify-start">
        <div
          class="text-base font-semibold text-nowrap justify-center flex items-center ml-16">
          매출목표액
        </div>

        <div class="flex items-center">
          <select
            name=""
            id=""
            class="w-32 h-8 rounded-lg ml-5"
            v-model="selectWeek">
            <option :value="0">전체</option>
            <option :value="i.lngCode" v-for="i in WeekDays">
              {{ i.strName }}
            </option>
          </select>
          <input
            type="number"
            class="w-52 h-8 rounded-lg ml-2 pl-1 text-right"
            v-model="targetSales" />
          <button
            class="button primary h-7 flex items-center ml-2 mt-1"
            @click="setMonthSales">
            적용
          </button>
        </div>
      </div>
      <div class="flex items-center justify-start ml-12">
        <div
          class="text-base font-semibold text-nowrap justify-center flex items-center">
          월매출목표액
        </div>
        <div class="flex">
          <input
            type="text"
            class="w-52 h-8 rounded-lg mt-1 ml-5 disabled:bg-gray-50 text-right"
            v-model="targetMonthSales"
            disabled />
        </div>
      </div>
      <div class="flex justify-start ml-2">
        <div
          class="text-base font-semibold text-nowrap justify-center flex items-center ml-[70px]">
          파일선택
        </div>
        <div class="flex ml-5 items-center">
          <div class="flex w-[300%] items-center">
            <input
              type="text"
              class="w-52 h-8 rounded-lg disabled:bg-white"
              disabled
              v-model="excelName" />
            <label
              for="hiddenFile"
              class="button primary h-7 flex items-center ml-2 mt-1 cursor-pointer">
              파일선택
            </label>
            <input
              type="file"
              class="hidden"
              id="hiddenFile"
              @change="readExcel"
              @click="resetFileInput" />
          </div>
        </div>
      </div>
    </div>
    <div
      class="absolute z-[100] h-20"
      :style="{ top: popupTop, right: popupRight }"
      v-show="openPopUp">
      <table
        class="bg-[#f0f8ff] border border-gray-300 rounded-md shadow-sm w-full max-w-md mx-auto">
        <thead>
          <tr class="border-b border-gray-200">
            <th colspan="2" class="text-right pr-2">
              <button
                class="button primary h-6 inline-block"
                @click="closePopup">
                닫기
              </button>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr class="border-b border-gray-200">
            <td class="px-4 py-2 font-medium">일자 :</td>
            <td class="px-4 py-2">
              <input
                type="text"
                :value="clickedDate"
                disabled
                class="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </td>
          </tr>
          <tr class="border-b border-gray-200">
            <td class="px-4 py-2 font-medium">목표액 :</td>
            <td class="px-4 py-2">
              <input
                type="text"
                :value="clickedProj"
                @input="changeProj($event)"
                class="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </td>
          </tr>
          <tr>
            <td class="px-4 py-2 font-medium">비고 :</td>
            <td class="px-4 py-2">
              <input
                type="text"
                :value="clickedComment"
                @input="changeComment($event)"
                class="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-hidden" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="flex flex-col -ml-20">
      <PickStoreSingle
        @lngStoreGroup="lngStoreGroup"
        @lngSupervisor="lngSupervisor"
        @lngStoreTeam="lngStoreTeam"
        @lngStoreAttrs="lngStoreAttrs"
        @lngStoreCode="lngStoreCode"
        @excelStore="excelStore"
        :placeholderName="'선택'"></PickStoreSingle>
      <div class="flex mt-12 items-center -ml-1">
        <div class="text-base font-semibold text-nowrap">sheet선택</div>
        <select
          name=""
          id=""
          class="w-32 h-8 rounded-lg ml-5"
          v-model="selectSheet">
          <option :value="i.lngCode" v-for="i in sheetArr">
            {{ i.strName }}
          </option>
        </select>
        <button
          class="button primary h-7 flex items-center ml-4"
          @click="saveUploadFile">
          업로드 파일 저장
        </button>
      </div>
    </div>
    <div class="flex space-x-52 w-[900px]">
      <div class="ml-14 text-nowrap mt-3">
        ※ 1.샘플파일 다운받아 작성(Download버튼) 2.파일선택 후 "업로드
        파일저장"버튼 클릭
      </div>
      <div class="flex justify-start -translate-x-48">
        <button @click="downloadSample" class="button primary h-6">
          download
        </button>
      </div>
    </div>
  </div>
  <!-- 조회 조건 -->
  <!--달력 영역-->
  <div class="h-[70%] mt-1">
    <FullCalendar :options="calendarOptions" class="h-full" ref="calendarRef">
    </FullCalendar>
  </div>
  <!--달력 영역-->
</template>

<script setup>
import { getProjByMonth, saveExcelDataPlan } from "@/api/misales";
/**
 *  해당연월 컴포넌트
 *  */

import Datepicker3 from "@/components/Datepicker3.vue";
/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";

/**
 *  매장 단일 선택 컴포넌트
 *  */

import PickStoreSingle from "@/components/pickStoreSingle.vue";
import {
  excelSerialDateToJSDate,
  insertPageLog,
} from "@/customFunc/customFunc";

/**
 *  달력 관련 라이브러리
 *  */

import koLocale from "@fullcalendar/core/locales/ko";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/vue3";
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

/**
 *  엑셀 내보내기 관련 라이브러리
 */
import { read, utils, write, writeFile } from "xlsx-js-style";

const resetFileInput = (e) => {
  e.target.value = "";
};
const popupRight = ref(50);
const popupTop = ref(50);
const selectWeek = ref(0);
const targetSales = ref("");
const targetMonthSales = ref("");
const setMonthSales = () => {
  if (selectWeek.value != 0) {
    const filteredRowData = rowData.value.filter((item) => {
      return new Date(item.start).getDay() == selectWeek.value - 1;
    });
    filteredRowData.forEach((item) => {
      item.title = targetSales.value;
    });
  } else {
    rowData.value.forEach((item) => {
      item.title = targetSales.value;
    });
  }
};
const rowData = ref([]);
const rowData2 = ref([]);
const currentMonth = ref();
const currentYear = ref();
const clickedComment = ref("");
const clickedProj = ref("");
const clickedDate = ref("");

/**
 * 	시작 월
 */

const startMonth = (e) => {
  currentMonth.value = e;

  if (e == null || currentYear.value == null) return;
  selectedstartDate.value =
    currentYear.value +
    "-" +
    String(currentMonth.value).padStart(2, "0") +
    "-01";

  if (calendarRef.value) {
    const calendar = calendarRef.value.getApi(); // calendarRef에서 API 가져오기
    if (calendar) {
      calendar.gotoDate(selectedstartDate.value); // gotoDate는 calendar API에서 사용해야 함
    }
  }
  initGrid();
};
/**
 * 	시작 년
 */

const startYear = (e) => {
  currentYear.value = e;

  if (currentMonth.value == null || e == null) return;
  selectedstartDate.value =
    currentYear.value +
    "-" +
    String(currentMonth.value).padStart(2, "0") +
    "-01";

  if (calendarRef.value) {
    const calendar = calendarRef.value.getApi(); // calendarRef에서 API 가져오기
    if (calendar) {
      calendar.gotoDate(selectedstartDate.value); // gotoDate는 calendar API에서 사용해야 함
    }
  }
  initGrid();
};
const selectSheet = ref(0);
const excelData = ref([]);
const excelName = ref("");
const sheetArr = ref([]);
const readExcel = (e) => {
  const file = e.target.files[0];
  excelName.value = file.name;
  if (!file) return;
  const reader = new FileReader();

  reader.readAsArrayBuffer(file);
  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = read(data, { type: "array" });
    sheetArr.value = workbook.SheetNames.map((name, index) => ({
      lngCode: index,
      strName: name,
    }));
    excelData.value = [];
    // 첫 번째 시트 가져오기

    for (let i = 0; i < workbook.SheetNames.length; i++) {
      const sheetName = workbook.SheetNames[i];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = utils.sheet_to_json(worksheet, { header: 1 });
      const expectedHeader = ["매장코드", "일자", "목표금액", "비고"];
      const header = jsonData[0];
      if (JSON.stringify(header) !== JSON.stringify(expectedHeader)) {
        alert("엑셀 형식이 올바르지 않습니다.");
        return;
      }
      excelData.value.push(
        jsonData.slice(1).map((row) => ({
          매장코드: row[0] || "",
          일자:
            typeof row[1] == "string"
              ? row[1]
              : excelSerialDateToJSDate(row[1]),
          목표금액: row[2].toString().includes(",")
            ? Number(row[2].replace(/,/g, "")).toString()
            : Number(row[2]).toString(),
          비고: row[3],
        }))
      );
    }

    //comsole.log(excelData.value);
  };
};

const changeProj = (e) => {
  clickedProj.value = e.target.value;
  rowData.value.forEach((item) => {
    if (item.start == clickedDate.value) {
      item.title = clickedProj.value;
    }
  });
};

const changeComment = (e) => {
  clickedComment.value = e.target.value;
  rowData.value.forEach((item) => {
    if (item.start == clickedDate.value) {
      item.strComment = clickedComment.value;
    }
  });
};

const saveUploadFile = async () => {
  if (excelData.value.length == 0) {
    Swal.fire({
      title: "경고",
      text: "엑셀을 먼저 업로드 해주세요요",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  //comsole.log(excelData.value);

  try {
    const dates = excelData.value[selectSheet.value]
      .map((i) => i.일자)
      .join(",");
    const projs = excelData.value[selectSheet.value]
      .map((i) => Number(i.목표금액.replace(/,/g, "")))
      .join(",");
    const comments = excelData.value[selectSheet.value]
      .map((i) => i.비고)
      .join("\u2063");
    const res = await saveExcelDataPlan(
      lngstoregroup.value,
      lngstorecode.value,
      dates,
      projs,
      comments
    );

    //comsole.log(res);

    if (res.data.RESULT_CD == "00") {
      Swal.fire({
        title: "성공",
        text: "저장되었습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
    }
  } catch (error) {
    //comsole.log(error);
  } finally {
    searchButton();
  }
};

/**
 *  저장 버튼 함수
 */

const saveButton = async () => {
  if (currentYear.value == null || currentMonth.value == null) {
    Swal.fire({
      title: "경고",
      text: "날짜를 선택하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  if (JSON.stringify(rowData.value) == JSON.stringify(rowData2.value)) {
    Swal.fire({
      title: "경고",
      text: "변경된 사항이 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  try {
    Swal.fire({
      title: "저장",
      text: "저장하시겠습니까?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "확인",
      cancelButtonText: "취소",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const dates = rowData.value.map((i) => i.start).join(",");
          const projs = rowData.value.map((i) => i.title).join(",");
          const comments = rowData.value
            .map((i) => i.strComment)
            .join("\u2063");

          //comsole.log(dates, projs, comments);
          const res = await saveExcelDataPlan(
            lngstoregroup.value,
            lngstorecode.value,
            dates,
            projs,
            comments
          );

          //comsole.log(res);

          if (res.data.RESULT_CD == "00") {
            Swal.fire({
              title: "성공",
              text: "저장되었습니다.",
              icon: "success",
              confirmButtonText: "확인",
            });
          } else {
            Swal.fire({
              title: "실패",
              text: "저장에 실패했습니다.",
              icon: "error",
              confirmButtonText: "확인",
            });
          }
        } catch (e) {
          //comsole.log(e);
        } finally {
          searchButton();
        }
      }
    });
  } catch (error) {
    //comsole.log(error);
  } finally {
  }
};

const openPopUp = ref(false);
const tempDate = ref("");
const closePopup = () => {
  openPopUp.value = false;
};
const handleDateClick = (e) => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 진행해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  popupRight.value = 2000 - e.jsEvent.clientX + "px";
  popupTop.value = -220 + e.jsEvent.clientY + "px";

  const popupInfo = rowData.value.find((item) => item.start == e.dateStr);

  if (popupInfo) {
    clickedDate.value = popupInfo.start;
    clickedComment.value = popupInfo.strComment;
    clickedProj.value = popupInfo.title;
  } else {
    clickedComment.value = "";
    clickedProj.value = "";
    clickedDate.value = "";
  }
  if (afterSearch.value && tempDate.value == e.dateStr) {
    openPopUp.value = !openPopUp.value;
  } else if (afterSearch.value && tempDate.value != e.dateStr) {
    openPopUp.value = true;
    tempDate.value = e.dateStr;
  }
};

/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
  const nextBtn = document.getElementsByClassName("fc-next-button")[0];
  const prevBtn = document.getElementsByClassName("fc-prev-button")[0];

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextMonth.value = !nextMonth.value;
      initGrid();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prevMonth.value = !prevMonth.value;
      initGrid();
    });
  }
});

const calendarOptions = ref({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: "dayGridMonth",
  locale: koLocale,
  events: rowData.value,
  eventContent: function (arg) {
    const strComment = arg.event.extendedProps.strComment || ""; // 추가된 strComment
    const title = arg.event.title || ""; // 기존 title

    return {
      html: `<div>
                  ${strComment}<br><br>${title}
               </div>`, // 개행 처리 후 배치
    };
  },
  eventClick: function (event) {
    //comsole.log(event);
    const info = {
      dateStr: event.event.startStr,
      jsEvent: {
        clientX: event.jsEvent.clientX,
        clientY: event.jsEvent.clientY,
      },
    };
    handleDateClick(info);

    const clickedElement = event.el;

    // 상위 4개 요소에 접근 (parentElement를 4번 사용)
    let parentElement = clickedElement;
    for (let i = 0; i < 4; i++) {
      parentElement = parentElement.parentElement;
    }

    // 모든 날짜에 대한 'clicked-day' 클래스를 리셋
    document.querySelectorAll(".fc-day").forEach((day) => {
      day.classList.remove("clicked-day");
    });

    // 클릭된 날짜에 'clicked-day' 클래스 추가
    parentElement.classList.add("clicked-day");
  },
  dateClick: function (info) {
    // 클릭된 날짜의 DOM 엘리먼트에 클래스 추가
    const clickedDate = info.dayEl;

    // 기존 배경색을 리셋 후 클릭한 날짜에 배경색 추가
    document.querySelectorAll(".fc-day").forEach((day) => {
      day.classList.remove("clicked-day");
    });
    clickedDate.classList.add("clicked-day");
    handleDateClick(info);
  },
  headerToolbar: {
    left: "prev", // 왼쪽에 제목(날짜)
    center: "title", // 중앙은 비워두거나 다른 버튼 추가 가능
    right: "next", // 오른쪽에 이전, 다음, 오늘 버튼
  },
});

watch(
  rowData,
  (newEvents) => {
    calendarOptions.value.events = [...rowData.value]; // ✅ 변경된 데이터 적용
    targetMonthSales.value = rowData.value
      .map((i) => i.title)
      .reduce((acc, cur) => acc + Number(cur), 0);
  },
  { deep: true }
);

const documentSubTitle = ref();
const selectedExcelDate = ref();
const selectedExcelStore = ref();
const selectedstartDate = ref();
const selectedendDate = ref();

const WeekDays = ref([
  { lngCode: 1, strName: "일요일" },
  { lngCode: 2, strName: "월요일" },
  { lngCode: 3, strName: "화요일" },
  { lngCode: 4, strName: "수요일" },
  { lngCode: 5, strName: "목요일" },
  { lngCode: 6, strName: "금요일" },
  { lngCode: 7, strName: "토요일" },
]);

const prevMonth = ref(false);
const nextMonth = ref(false);

/**
 * 엑셀용 일자 세팅 함수
 */

const excelDate = (e) => {
  selectedExcelDate.value = e;
};
/**
 * 엑셀용 매장 세팅 함수
 */

const excelStore = (e) => {
  selectedExcelStore.value = e;
};
const lngstoregroup = ref();
const lngstoreattr = ref();
const lngstoreteam = ref();
const lngstoresupervisor = ref();
const lngstorecode = ref();
const maxSaleTarget = ref("");
const checked = ref(0);

/**
 * 페이지 매장 그룹 세팅
 */

const lngStoreGroup = (e) => {
  lngstoregroup.value = e;
  //comsole.log(e);
  initGrid();
};

/**
 * 페이지 매장 분류 세팅
 */

const lngStoreAttrs = (e) => {
  lngstoreattr.value = e;
  //comsole.log(e);
  initGrid();
};
/**
 * 페이지 매장 팀 세팅
 */

const lngStoreTeam = (e) => {
  lngstoreteam.value = e;
  //comsole.log(e);
  initGrid();
};
/**
 * 페이지 매장 슈퍼바이저 세팅
 */

const lngSupervisor = (e) => {
  lngstoresupervisor.value = e;
  //comsole.log(e);
  initGrid();
};
/**
 * 페이지 매장 코드 세팅
 */

const lngStoreCode = (e) => {
  lngstorecode.value = e;
  //comsole.log(e);
  initGrid();
};

const store = useStore();

//comsole.log(store);

const afterSearch = ref(false);
/**
 *  조회 함수
 */

const searchButton = async () => {
  // initCheckBox.value = !initCheckBox.value
  // initSearchWord.value = !initSearchWord.value
  if (currentYear.value == null || currentMonth.value == null) {
    Swal.fire({
      title: "경고",
      text: "날짜를 선택하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  if (lngstorecode.value == 0) {
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
    const res = await getProjByMonth(
      lngstoregroup.value,
      lngstorecode.value,
      selectedstartDate.value
    );
    //comsole.log(res);
    afterSearch.value = true;
    rowData2.value = JSON.parse(JSON.stringify(res.data.List));

    rowData.value = res.data.List.map((item) => ({
      title: item.lngProjAmt,
      start: item.dtmDate,
      strComment: item.strComment,
    }));
    rowData2.value = JSON.parse(
      JSON.stringify(
        res.data.List.map((item) => ({
          title: item.lngProjAmt,
          start: item.dtmDate,
          strComment: item.strComment,
        }))
      )
    );

    // if (rowData.value.length > 0) {
    //     maxSaleTarget.value = rowData.value.map(i => i.lngProject)[0].toLocaleString();
    // }
  } catch (error) {
    afterSearch.value = false;
  } finally {
    store.state.loading = false;
    targetSales.value = "";
    selectWeek.value = 0;
  }
};

const downloadSample = () => {
  if (lngstorecode.value == 0) {
    Swal.fire({
      title: "경고",
      text: "매장을 선택하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  const data = [
    ["매장코드", "일자", "목표금액", "비고"],
    [
      lngstorecode.value,
      "2025-03-01",
      "1,400,000",
      "샘플코드 작성시 삭제 후 업로드",
    ],
    [
      lngstorecode.value,
      "2025-03-02",
      "2,000,000",
      "매장코드는 상단 괄호안 코드 참고",
    ],
  ];

  const worksheet = utils.aoa_to_sheet(data);

  // Object.keys(worksheet).forEach(cell => {
  // if (cell.startsWith("B") && cell !== "B1") {
  //     //comsole.log(cell)
  //     worksheet[cell].z = "yyyy-mm-dd"; // 날짜 형식 적용
  // }
  // });
  worksheet["!cols"] = [
    { wch: 20 }, // 매장코드
    { wch: 20 }, // 일자
    { wch: 20 }, // 목표금액
    { wch: 60 }, // 비고
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

  ["A1", "B1", "C1", "D1"].forEach((cell) => {
    if (worksheet[cell]) {
      worksheet[cell].s = headerStyle;
    }
  });

  ["A2", "B2", "C2", "D2", "A3", "B3", "C3", "D3"].forEach((cell) => {
    if (worksheet[cell]) {
      worksheet[cell].s = dataStyle;
    }
  });

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
  a.download = "sample.xlsx"; // 저장될 파일명
  document.body.appendChild(a);
  a.click();
};

const calendarRef = ref(null);
/**
 * 엑셀 내보내기 함수
 */

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

  const events = rowData.value.map((event) => ({
    date: new Date(event.start),
    amount: event.title, // 목표금액
    comment: event.strComment,
  }));

  const allDates = events.map((e) => e.date);
  const minDate = new Date(Math.min(...allDates));
  const maxDate = new Date(Math.max(...allDates));
  const year = minDate.getFullYear();
  const month = minDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const totalDays = lastDay.getDate();

  let calendarData = [["일", "월", "화", "수", "목", "금", "토"]];

  // 월과 년을 하나의 셀로 가로로 병합하여 추가
  const headerRow = [
    "",
    "",
    {
      v: `${currentYear.value}년 ${currentMonth.value}월`,
      s: { alignment: { horizontal: "center" }, wrapText: true },
    },
    "",
    "",
    "",
    "",
  ];

  // 첫 번째 행에 월과 년 정보 추가
  calendarData.unshift(headerRow);

  // 데이터를 계속해서 채워넣기
  let week = new Array(7).fill("");
  for (let d = 1; d <= totalDays; d++) {
    let currentDate = new Date(year, month, d);
    let dayOfWeek = currentDate.getDay();

    let event = events.find((e) => e.date.getDate() === d);
    week[dayOfWeek] = event
      ? `${d}일 \n ${event.amount} \n ${event.comment}`
      : `${d}`;

    if (dayOfWeek === 6 || d === totalDays) {
      calendarData.push(week);
      week = new Array(7).fill("");
    }
  }

  // worksheet 생성
  const worksheet = utils.aoa_to_sheet(calendarData);

  // 셀 병합 (월과 년을 하나의 셀로 가로로 병합)
  worksheet["!merges"] = [
    { s: { r: 0, c: 2 }, e: { r: 0, c: 3 } }, // 첫 번째 행에서 '월'과 '년'을 병합
  ];

  // 행 높이 조정 (한 셀을 넓게 보이도록)
  worksheet["!rows"] = new Array(calendarData.length).fill({ hpt: 65 }); // 40pt 높이

  // 열 너비 조정 (요일과 날짜가 잘 보이도록)
  worksheet["!cols"] = new Array(7).fill({ wch: 36 }); // 열 너비 15칸

  // 스타일 적용 (모든 셀에 대해 정렬과 텍스트 개행 적용)
  // Object.keys(worksheet).forEach(cellRef => {
  //     if (cellRef[0] === "!") return; // "!merges", "!cols" 등은 무시

  //     const cell = worksheet[cellRef];

  //     if (cell && cell.v !== undefined) {
  //         cell.s = {
  //             alignment: { horizontal: "center", vertical: "center", wrapText: true }
  //         };
  //     }
  // });
  Object.keys(worksheet).forEach((cellRef) => {
    if (cellRef[0] === "!") return; // "!merges", "!cols" 등은 무시

    const cell = worksheet[cellRef];

    if (cell && cell.v !== undefined) {
      // 기본 스타일: 가운데 정렬, 개행 처리
      const style = {
        alignment: { horizontal: "center", vertical: "center", wrapText: true },
      };

      // 셀 참조에서 숫자(행 번호) 추출 (예: "B3" -> 3)
      const rowNumberMatch = cellRef.match(/\d+/);
      if (rowNumberMatch && Number(rowNumberMatch[0]) > 1) {
        // 1행이 아닌 경우 테두리 추가 (굵은 테두리)
        style.border = {
          top: { style: "thick", color: { rgb: "000000" } },
          bottom: { style: "thick", color: { rgb: "000000" } },
          left: { style: "thick", color: { rgb: "000000" } },
          right: { style: "thick", color: { rgb: "000000" } },
        };
      }

      cell.s = style;
    }
  });

  //comsole.log(calendarData);
  // 워크북에 시트 추가
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, "월별 목표금액 달력");

  // 파일 저장
  writeFile(
    workbook,
    `${currentYear.value}년 ${currentMonth.value}월 계획 달력.xlsx`
  );
};
/**
 * 그리드 초기화
 */

const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }

  afterSearch.value = false;
  targetSales.value = "";
  targetMonthSales.value = "";
  selectWeek.value = 0;
};
</script>
<style>
.fc-event,
.fc-event-dot {
  font-size: 16px !important;
}

.fc-day.clicked-day {
  background-color: skyblue !important;
  /* 원하는 배경색으로 설정 */
}
</style>
