/*--############################################################################
# Filename : SLS04_003RPT.vue                                                  
# Description : 매출관리 > 메뉴별 매출 현황 > 메뉴별/결제형태별 매출현황.      
# Date :2025-05-14                                                             
# Author : 권맑음                     
################################################################################*/
<template>
  <!-- 조회 조건 -->
  <div class="flex h-full min-h-0 flex-col" @click="handleParentClick">
    <div class="flex shrink-0 justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center mr-9 space-x-2 pr-5">
        <button @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <button @click="excelButton" class="button save w-auto excel">
          엑셀
        </button>
      </div>
    </div>

    <div
      class="sls0403-search-panel z-10 mt-3 w-full min-h-0 shrink-0 overflow-visible rounded-lg bg-gray-200"
      :style="{
        '--sls0403-panel-pad-x': '2rem',
        '--sls0403-control-border': sls0403ControlBorder,
        '--sls0403-col-gutter': sls0403ColGutter,
        '--sls0403-row-gap': sls0403RowGap,
        '--sls0403-label-col': sls0403LabelCol,
        '--psp-label-w': sls0403LabelCol,
        '--psp-radio-w': '4.75rem',
        '--psp-col-gap': '0.5rem',
      }">
      <div class="sls0403-search-layout min-w-0">
        <!-- 1행: 기간 | 매장명(2~3열, 1~2행 span) -->
        <div class="sls0403-cell sls0403-cell--period">
          <span class="sls0403-lbl shrink-0">기간</span>
          <div class="sls0403-date-slot min-w-0 flex-1">
            <Datepicker2
              ref="datepicker"
              omit-main-label
              filter-bar-align
              :mainName="'기간'"
              :closePopUp="closePopUp"
              @endDate="endDate"
              @startDate="startDate"
              @excelDate="excelDate" />
          </div>
        </div>

        <div class="sls0403-cell sls0403-cell--store min-w-0 overflow-visible">
          <PickStorePlural
            fluid-width
            @lngStoreCodes="lngStoreCodes"
            @lngStoreGroup="lngStoreGroup"
            @lngSupervisor="lngSupervisor"
            @lngStoreTeam="lngStoreTeam"
            @lngStoreAttr="lngStoreAttr"
            @excelStore="excelStore"
            :setFooterColID="setFooterColID"
            :setFooterExpressions="setFooterExpressions" />
        </div>

        <!-- 2행: 조회구분 -->
        <div class="sls0403-cell sls0403-cell--type">
          <span class="sls0403-lbl shrink-0">조회구분</span>
          <div class="sls0403-cond-fields min-w-0">
            <select
              id="sls0403-search-type"
              class="sls0403-sg-select"
              v-model="selectedSearchType"
              @change="changeSearchType">
              <option :value="1">집계</option>
              <option :value="2">일자별</option>
              <option :value="3">월별</option>
            </select>
            <label class="sls0403-check-label" for="detail">
              <input
                id="detail"
                type="checkbox"
                class="sls0403-check"
                @change="detailView" />
              상세보기
            </label>
            <label class="sls0403-check-label" for="StoreName">
              <input
                id="StoreName"
                type="checkbox"
                class="sls0403-check"
                @change="showStore" />
              매장명표시
            </label>
          </div>
        </div>

        <!-- 3행: 메뉴구분 — 3열 전체 -->
        <div class="sls0403-cell sls0403-cell--menu">
          <span class="sls0403-lbl shrink-0">메뉴구분</span>
          <div class="sls0403-menu-fields min-w-0">
            <v-select
              v-model="selectedMenu"
              :options="mainMenu"
              placeholder="전체"
              label="strname"
              class="custom-select2 sls0403-vselect sls0403-menu-item"
              clearable="true" />
            <v-select
              v-model="selectedsubMenu"
              :options="menuType"
              placeholder="전체"
              label="strname"
              class="custom-select2 sls0403-vselect sls0403-menu-item"
              clearable="true" />
            <v-select
              v-model="selectedSubSubMenu"
              :options="Menus"
              placeholder="전체"
              label="strname"
              class="custom-select2 sls0403-vselect sls0403-menu-item sls0403-menu-item--wide"
              clearable="true" />
          </div>
        </div>
      </div>
    </div>

    <!-- 그리드 영역 -->
    <div class="mt-2 flex min-h-0 min-w-0 flex-1 flex-col">
      <div class="relative min-h-0 w-full flex-1" v-if="selectedDetail == false">
        <Realgrid
          :progname="'SLS04_003RPT_VUE'"
          :progid="1"
          :rowData="rowData"
          :reload="reload"
          :exporttoExcel="exportExcel"
          :documentSubTitle="documentSubTitle"
          :documentTitle="'SLS04_003RPT'"
          :setDynamicGrid7="true"
          :setFooter="true"
          :hideColumnsId="hideColumnsId"
          :rowStateeditable="false" />
      </div>

      <div class="relative min-h-0 w-full flex-1" v-if="selectedDetail == true">
        <Realgrid
          :progname="'SLS04_003RPT_VUE'"
          :progid="1"
          :rowData="rowData2"
          :reload="reload"
          :exporttoExcel="exportExcel2"
          :documentSubTitle="documentSubTitle"
          :documentTitle="'SLS04_003RPT'"
          :setFooter="true"
          :setDynamicGrid8="true"
          :mergeColumns2="true"
          :mergeColumnGroupName2="mergeColumnGroupName2"
          :mergeColumnGroupSubList2="mergeColumnGroupSubList2"
          :hideColumnsId="hideColumnsId"
          :rowStateeditable="false" />
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  getMenuCondition,
  getMenuPayColumns,
  getSalesReportByMenuAndPayType,
} from "@/api/misales";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

import Datepicker2 from "@/components/Datepicker2.vue";
/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
/**
 * 	다중 매장 선택 컴포넌트
 */

import PickStorePlural from "@/components/pickStorePlural.vue";
/**
 * 	그리드 생성
 */

import Realgrid from "@/components/realgrid.vue";
/*
 * 공통 커스텀 Function ( 페이지 로그 , 시간 포맷)
 */

import { formatTime, insertPageLog } from "@/customFunc/customFunc";
/*
 * 공통 표준  Function
 */

import { onMounted, ref, watch } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";

const progid = ref(4);
const reload = ref(false);
const rowData = ref([]);
const rowData2 = ref([]);
const afterSearch = ref(false);
const selectedstartDate = ref();
const selectedendDate = ref();

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
const setRowGroupSpan = ref("");
const tempSeeDay = ref(0);
const seeDays = (e) => {
  if (e.target.checked) {
    tempSeeDay.value = 1;
  } else {
    tempSeeDay.value = 0;
  }
};
const hideColumnNow = ref(true);

const store = useStore();
const loginedstrLang = store.state.userData.lngLanguage;
/**
 *  조회 함수
 */

const searchButton = async () => {
  store.state.loading = true;
  try {
    initGrid();
    //comsole.log(selectedSearchType.value);
    //comsole.log(selectedDetail.value);

    let reportType;
    if (
      selectedDetail.value == true &&
      showornotstore.value == true &&
      selectedSearchType.value == 1
    ) {
      reportType = 12;
    } else if (
      selectedDetail.value == true &&
      showornotstore.value == true &&
      selectedSearchType.value == 2
    ) {
      reportType = 13;
    } else if (
      selectedDetail.value == true &&
      showornotstore.value == true &&
      selectedSearchType.value == 3
    ) {
      reportType = 14;
    } else if (
      selectedDetail.value == true &&
      showornotstore.value == false &&
      selectedSearchType.value == 1
    ) {
      reportType = 8;
    } else if (
      selectedDetail.value == true &&
      showornotstore.value == false &&
      selectedSearchType.value == 2
    ) {
      reportType = 9;
    } else if (
      selectedDetail.value == true &&
      showornotstore.value == false &&
      selectedSearchType.value == 3
    ) {
      reportType = 10;
    } else if (
      selectedDetail.value == false &&
      showornotstore.value == true &&
      selectedSearchType.value == 1
    ) {
      reportType = 4;
    } else if (
      selectedDetail.value == false &&
      showornotstore.value == true &&
      selectedSearchType.value == 2
    ) {
      reportType = 5;
    } else if (
      selectedDetail.value == false &&
      showornotstore.value == true &&
      selectedSearchType.value == 3
    ) {
      reportType = 6;
    } else if (
      selectedDetail.value == false &&
      showornotstore.value == false &&
      selectedSearchType.value == 1
    ) {
      reportType = 0;
    } else if (
      selectedDetail.value == false &&
      showornotstore.value == false &&
      selectedSearchType.value == 2
    ) {
      reportType = 1;
    } else if (
      selectedDetail.value == false &&
      showornotstore.value == false &&
      selectedSearchType.value == 3
    ) {
      reportType = 2;
    }
    //comsole.log(reportType);
    // if (temptmergeColumns2.value == false) {
    //   mergeColumns2.value = false;
    // } else {
    //   mergeColumns2.value = true;
    // }

    // const reportType = [...checkedReportTypes]
    // const checkdays = [...checkedDays]

    // //comsole.log(checkdays)
    let first;
    let second;
    let third;

    if (selectedsubMenu.value == null || selectedsubMenu.value == undefined) {
      second = 0;
    } else {
      second = selectedsubMenu.value.lngcode;
    }
    if (selectedMenu.value == null || selectedMenu.value == undefined) {
      first = 0;
    } else {
      //comsole.log(selectedMenu.value);
      first = selectedMenu.value.lngcode;
    }

    if (
      selectedSubSubMenu.value == null ||
      selectedSubSubMenu.value == undefined
    ) {
      third = 0;
    } else {
      third = selectedSubSubMenu.value.lngcode;
    }

    const res = await getSalesReportByMenuAndPayType(
      selectedGroup.value,
      selectedStores.value,
      selectedstartDate.value,
      selectedendDate.value,
      reportType,
      first,
      second,
      third
    );
    console.log(res);
    if (selectedDetail.value == false) {
      rowData.value = res.data.List.filter((item) => item.lngCode != "0");
    } else {
      rowData2.value = res.data.List.filter((item) => item.lngCode != "0");
    }

    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    store.state.loading = false;
  } finally {
    store.state.loading = false;
  }
};
const currentTime = ref(formatTime(new Date()));
const selectedGroup = ref();
const selectedStores = ref();
const selectedStoreAttrs = ref();
const selectedHoliday = ref(0);
const selectedsubMenu = ref(null);
/**
 * 페이지 매장 그룹 세팅
 */

const lngStoreGroup = (e) => {
  initGrid();
  //comsole.log(e);
  selectedGroup.value = e;
};
/**
 * 페이지 매장 코드 세팅
 */

const lngStoreCodes = (e) => {
  initGrid();
  selectedStores.value = e;
  //comsole.log(e);
};
/**
 * 페이지 매장 분류 세팅
 */

const lngStoreAttr = (e) => {
  initGrid();
  selectedStoreAttrs.value = e;
  //comsole.log(e);
};
/**
 * 페이지 매장 팀 세팅
 */

const lngStoreTeam = (e) => {
  initGrid();
};
/**
 * 페이지 매장 슈퍼바이저 세팅
 */

const lngSupervisor = (e) => {
  initGrid();
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
};

const exportExcel = ref(false);
const exportExcel2 = ref(false);
const selectedSearchType = ref(1);
const documentSubTitle = ref("");
const menuDistinct = ref(["전체", "대그룹", "서브그룹", "메뉴구분"]);
const searchCondition = ref([
  "매장명표시",
  "대그룹",
  "서브그룹",
  "일자별",
  "증정구분",
  "단가제외",
  "합계",
  "셀병합",
]);
const dayCondition = ref(["일", "월", "화", "수", "목", "금", "토"]);
const ConditionSet = new Set([]);
/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  let menu;
  if (selectedMenu.value == null) {
    menu = "전체";
  } else {
    menu = menuDistinct.value[selectedMenu.value];
  }

  let submenu;
  //comsole.log(selectedsubMenu.value);
  //comsole.log(subList.value);
  if (selectedsubMenu.value == null || menuType.value.length == 0) {
    submenu = "전체";
  } else {
    submenu = menuType.value.find(
      (item) => item.lngcode == selectedsubMenu.value.lngcode
    ).strname;
  }
  const newCondarr = [...ConditionSet].sort();
  let searchcond = "";
  for (let i = 0; i < newCondarr.length; i++) {
    searchcond += searchCondition.value[newCondarr[i]] + ",";
  }

  let thirdcond = "";
  const newCondarr2 = [...checkedDays].sort();
  for (let i = 0; i < newCondarr2.length; i++) {
    thirdcond += dayCondition.value[newCondarr2[i] - 1] + ",";
  }
  let first;
  let second;
  let third;
  if (selectedMenu.value == null) {
    first = "전체";
  } else {
    first = mainMenu.value.filter(
      (item) => item.lngcode == selectedMenu.value.lngcode
    )[0].strname;
  }

  if (selectedsubMenu.value == null || menuType.value.length == 0) {
    second = "전체";
  } else {
    second = menuType.value.filter(
      (item) => item.lngcode == selectedsubMenu.value.lngcode
    )[0].strname;
  }

  if (selectedSubSubMenu.value == null || Menus.value.length == 0) {
    third = "전체";
  } else {
    third = Menus.value.filter(
      (item) => item.lngcode == selectedSubSubMenu.value.lngcode
    )[0].strname;
  }

  documentSubTitle.value =
    selectedExcelDate.value +
    "\n" +
    selectedExcelStore.value +
    "\n" +
    "메뉴구분 :" +
    first +
    "," +
    second +
    "," +
    third;

  if (selectedDetail.value == false) {
    exportExcel.value = !exportExcel.value;
  } else {
    exportExcel2.value = !exportExcel2.value;
  }
};

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
const selectedExcelDate = ref("");
const selectedExcelStore = ref("");
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
/**
 * 프린트 기능 버튼
 */

const printButton = () => {
  window.print();
};
const selectedMenu = ref(null);

const subList = ref([]);
const menuType = ref([]);
const Menus = ref([]);
const mainMenu = ref([
  { lngcode: 0, strname: "전체" },
  { lngcode: 1, strname: "대그룹" },
  { lngcode: 2, strname: "서브그룹" },
  { lngcode: 3, strname: "메뉴코드" },
]);
watch(selectedMenu, async () => {
  // if (selectedMenu.value == null) {
  //   selectedMenu.value = 0;
  // }
  const res = await getMenuCondition(
    selectedGroup.value,
    selectedStores.value,
    2,
    selectedMenu.value == null ? 0 : selectedMenu.value.lngcode,
    0
  );
  menuType.value = res.data.List;
  selectedsubMenu.value = null;
  //comsole.log(menuType.value);
});
const selectedSubSubMenu = ref(null);
watch(selectedsubMenu, async () => {
  // if (selectedsubMenu.value == null) {
  //   selectedsubMenu.value = 0;
  // }

  const res = await getMenuCondition(
    selectedGroup.value,
    selectedStores.value,
    3,
    selectedMenu.value == null ? 0 : selectedMenu.value.lngcode,
    selectedsubMenu.value == null ? 0 : selectedsubMenu.value.lngcode
  );
  Menus.value = res.data.List;
  selectedSubSubMenu.value = null;
});

/**
 * 	화면 Load시 실행 스크립트
 */

const mergeColumnGroupSubList2 = ref([]);
const mergeColumnGroupName2 = ref([]);
onMounted(async () => {
  const pageLog = insertPageLog(store.state.activeTab2);

  const res = await getMenuCondition(
    selectedGroup.value,
    selectedStores.value,
    1,
    0,
    0
  );

  mainMenu.value = res.data.List;

  const res2 = await getMenuPayColumns(store.state.userData.lngStoreGroup);
  //console.log(res2);
  mergeColumnGroupName2.value = Object.values(res2.data.List).map(
    (item) => item.strName
  );
  //console.log(mergeColumnGroupName2.value);
  const temp = Object.values(res2.data.List2).map((item) => item.Column1);
  const chunkSize = 4;
  const chunked = [];

  for (let i = 0; i < temp.length; i = i + 4) {
    chunked.push(temp.slice(i, i + chunkSize));
  }
  mergeColumnGroupSubList2.value = chunked;

  console.log(mergeColumnGroupSubList2.value);
  console.log(mergeColumnGroupName2.value);
});
const hideColumnsId = ref(["strStoreName", "dtmDate", "dtmDate2"]);

const selectedDetail = ref(false);
const temptmergeColumns2 = ref(false);
const detailView = (e) => {
  if (e.target.checked) {
    selectedDetail.value = true;
    temptmergeColumns2.value = true;
  } else {
    selectedDetail.value = false;
    temptmergeColumns2.value = false;
  }
  syncHideColumnsByOptions();
};
const customOrder = ["strStore", "strMajor", "strSub", "dtmDate"];
// const checking = (e) => {
//   if (e.target.id == "store") {
//     if (e.target.checked) {
//       checkedReportTypes.add(2);
//       hideColumnsId.value = hideColumnsId.value.filter(
//         (item) => item !== "strStore"
//       );
//       setGroupColumnId.value.push("strStore");
//       ConditionSet.add(0);
//     } else {
//       checkedReportTypes.delete(2);
//       hideColumnsId.value.push("strStore");
//       setGroupColumnId.value = setGroupColumnId.value.filter(
//         (item) => item !== "strStore"
//       );
//       ConditionSet.delete(0);
//     }
//   } else if (e.target.id == "maingroup") {
//     if (e.target.checked) {
//       checkedReportTypes.add(3);
//       ConditionSet.add(1);
//       hideColumnsId.value = hideColumnsId.value.filter(
//         (item) => item !== "strMajor"
//       );
//       setGroupColumnId.value.push("strMajor");
//     } else {
//       checkedReportTypes.delete(3);
//       ConditionSet.delete(1);
//       hideColumnsId.value.push("strMajor");
//       setGroupColumnId.value = setGroupColumnId.value.filter(
//         (item) => item !== "strMajor"
//       );
//     }
//   } else if (e.target.id == "subgroup") {
//     if (e.target.checked) {
//       checkedReportTypes.add(4);
//       ConditionSet.add(2);
//       hideColumnsId.value = hideColumnsId.value.filter(
//         (item) => item !== "strSub"
//       );
//       setGroupColumnId.value.push("strSub");
//     } else {
//       checkedReportTypes.delete(4);
//       ConditionSet.delete(2);
//       hideColumnsId.value.push("strSub");
//       setGroupColumnId.value = setGroupColumnId.value.filter(
//         (item) => item !== "strSub"
//       );
//     }
//   } else if (e.target.id == "day") {
//     if (e.target.checked) {
//       checkedReportTypes.add(1);
//       ConditionSet.add(3);
//       hideColumnsId.value = hideColumnsId.value.filter(
//         (item) => item !== "dtmDate"
//       );
//       setGroupColumnId.value.push("dtmDate");
//       //setGroupColumnId.value.push('lngCode')
//     } else {
//       checkedReportTypes.delete(1);
//       ConditionSet.delete(3);
//       hideColumnsId.value.push("dtmDate");
//       setGroupColumnId.value = setGroupColumnId.value.filter(
//         (item) => item !== "dtmDate"
//       );
//       //setGroupColumnId.value = setGroupColumnId.value.filter(item => item !== 'lngCode');
//     }
//   } else if (e.target.id == "gift") {
//     if (e.target.checked) {
//       checkedGift.value = 1;
//       hideColumnsId.value = hideColumnsId.value.filter(
//         (item) => item !== "lngNMenuCnt" && item != "lngGMenuCnt"
//       );
//       ConditionSet.add(4);
//     } else {
//       checkedGift.value = 0;
//       hideColumnsId.value.push("lngNMenuCnt");
//       hideColumnsId.value.push("lngGMenuCnt");
//       ConditionSet.delete(4);
//     }
//   } else if (e.target.id == "exception") {
//     if (e.target.checked) {
//       checkedlngPrice.value = 1;
//       hideColumnsId.value.push("lngPrice");
//       ConditionSet.add(5);
//     } else {
//       ConditionSet.delete(5);
//       checkedlngPrice.value = 0;
//       hideColumnsId.value = hideColumnsId.value.filter(
//         (item) => item !== "lngPrice"
//       );
//     }
//   } else if (e.target.id == "sum") {
//     if (e.target.checked) {
//       checkedlngPrint.value = 1;
//       setGroupFooter.value = true;
//       setGroupSumCustomLevel.value = 2;
//       ConditionSet.add(6);
//     } else {
//       ConditionSet.delete(6);
//       checkedlngPrint.value = 0;
//       setGroupFooter.value = false;
//       setGroupSumCustomLevel.value = 1;
//     }
//   } else if (e.target.id == "unite") {
//     if (e.target.checked) {
//       ConditionSet.add(7);
//       setRowGroupSpan.value = "strStore,strMajor,strSub";
//       setGroupSumCustomLevel.value = 2;
//     } else {
//       ConditionSet.delete(7);
//       setRowGroupSpan.value = "";
//       setGroupSumCustomLevel.value = 1;
//     }

//     reload.value = !reload.value;
//   }
//   setGroupColumnId.value.sort((a, b) => {
//     // customOrder 배열에서 각 요소의 인덱스를 비교
//     const indexA = customOrder.indexOf(a);
//     const indexB = customOrder.indexOf(b);

//     // 만약 배열에 없는 값이 있다면 -1이 반환되므로, 이를 처리해줍니다.
//     if (indexA === -1 && indexB === -1) return 0; // 둘 다 없으면 순서 유지
//     if (indexA === -1) return 1; // a가 없으면 뒤로 보냄
//     if (indexB === -1) return -1; // b가 없으면 뒤로 보냄

//     return indexA - indexB;
//   });

//   setGroupColumnId2.value = setGroupColumnId.value.join(",");
// };
const checkedDays = new Set([1, 2, 3, 4, 5, 6, 7]);
const checkday = (e) => {
  if (e.target.id == "mon") {
    if (e.target.checked) {
      checkedDays.add(2);
    } else {
      checkedDays.delete(2);
    }
  } else if (e.target.id == "tue") {
    if (e.target.checked) {
      checkedDays.add(3);
    } else {
      checkedDays.delete(3);
    }
  } else if (e.target.id == "wed") {
    if (e.target.checked) {
      checkedDays.add(4);
    } else {
      checkedDays.delete(4);
    }
  } else if (e.target.id == "thu") {
    if (e.target.checked) {
      checkedDays.add(5);
    } else {
      checkedDays.delete(5);
    }
  } else if (e.target.id == "fri") {
    if (e.target.checked) {
      checkedDays.add(6);
    } else {
      checkedDays.delete(6);
    }
  } else if (e.target.id == "sat") {
    if (e.target.checked) {
      checkedDays.add(7);
    } else {
      checkedDays.delete(7);
    }
  } else if (e.target.id == "sun") {
    if (e.target.checked) {
      checkedDays.add(1);
    } else {
      checkedDays.delete(1);
    }
  }
};
const showornotstore = ref(false);

/** 조회구분·매장명표시 기준 hideColumnsId 동기화 */
const syncHideColumnsByOptions = () => {
  const type = selectedSearchType.value;
  const detail = selectedDetail.value == true;
  const showStore = showornotstore.value == true;
  const next = [];

  if (!showStore) {
    next.push("strStoreName");
  }

  if (type == 1) {
    // 집계 — 일자/월 컬럼 숨김
    next.push("dtmDate", "dtmDate2");
  } else if (type == 2) {
    // 일자별
    next.push("dtmDate2");
    if (!detail) {
      next.push("dtmDate");
    }
  } else {
    // 월별
    next.push("dtmDate");
    if (!detail) {
      next.push("dtmDate2");
    }
  }

  hideColumnsId.value = next;
};

const showStore = (e) => {
  if (e.target.checked) {
    showornotstore.value = true;
    hideColumnNow.value = false;
  } else {
    showornotstore.value = false;
    hideColumnNow.value = true;
  }
  syncHideColumnsByOptions();
};

const changeSearchType = () => {
  syncHideColumnsByOptions();
};

/** 조회 AREA — SLS04_004 wire 패턴 */
const sls0403ControlBorder = "#cbd5e1";
const sls0403ColGutter = "0.5rem";
const sls0403RowGap = "0.875rem";
const sls0403LabelCol = "5.5rem";
</script>

<style scoped>
.sls0403-search-panel {
  box-sizing: border-box;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  padding-left: var(--sls0403-panel-pad-x, 2rem);
  padding-right: var(--sls0403-panel-pad-x, 2rem);
}

@media (min-width: 768px) {
  .sls0403-search-panel {
    --sls0403-panel-pad-x: 3rem;
  }
}

.sls0403-search-layout {
  /* 3열 — 매장명(2~3열) 폭은 SLS04_004 우측(1fr / 전체 대비)과 동일 비중 */
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.5fr) minmax(0, 0.5fr);
  grid-template-rows: auto auto auto;
  column-gap: var(--sls0403-col-gutter, 1.25rem);
  row-gap: var(--sls0403-row-gap, 0.75rem);
  align-items: center;
  min-width: 0;
}

.sls0403-cell {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  min-height: 2rem;
}

.sls0403-cell--period {
  grid-column: 1;
  grid-row: 1;
  position: relative;
  z-index: 2;
}

.sls0403-cell--type {
  grid-column: 1;
  grid-row: 2;
  position: relative;
  z-index: 2;
}

.sls0403-cell--store {
  grid-column: 2 / span 2;
  grid-row: 1 / span 2;
  position: relative;
  z-index: 1;
  align-self: stretch;
  justify-content: center;
  overflow: visible;
}

.sls0403-cell--menu {
  grid-column: 1 / -1;
  grid-row: 3;
  position: relative;
  z-index: 2;
}

.sls0403-lbl {
  box-sizing: border-box;
  flex: 0 0 var(--sls0403-label-col, 5.5rem);
  width: var(--sls0403-label-col, 5.5rem);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
  text-align: center;
  white-space: nowrap;
}

.sls0403-cond-fields {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 1rem;
  min-width: 0;
  flex: 1 1 auto;
}

.sls0403-check-label {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.9375rem;
  line-height: 1.25;
  font-weight: 400;
  color: #1f2937;
  white-space: nowrap;
  cursor: pointer;
}

.sls0403-check {
  width: 1rem;
  height: 1rem;
  margin: 0;
  accent-color: #2563eb;
  cursor: pointer;
}

.sls0403-date-slot {
  min-width: 0;
  flex: 1 1 auto;
}

.sls0403-date-slot :deep(> div.flex.justify-start.items-center) {
  margin: 0 !important;
  width: auto !important;
  max-width: 100%;
}

.sls0403-date-slot :deep(input[type="date"]) {
  box-sizing: border-box;
  height: 2rem !important;
  min-height: 2rem !important;
  padding: 0 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: rgb(55 65 81);
  border: 1px solid var(--sls0403-control-border, #cbd5e1) !important;
  border-radius: 0.375rem !important;
  background: #fff !important;
}

.sls0403-date-slot :deep(div.inline-flex.h-8),
.sls0403-date-slot :deep(button) {
  box-sizing: border-box;
  height: 2rem !important;
  min-height: 2rem !important;
}

.sls0403-sg-select {
  box-sizing: border-box;
  height: 2rem !important;
  min-height: 2rem !important;
  width: 7rem;
  padding: 0 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: rgb(55 65 81);
  border: 1px solid var(--sls0403-control-border, #cbd5e1);
  border-radius: 0.375rem;
  background: #fff;
  appearance: auto;
}

.sls0403-menu-fields {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  flex: 1 1 auto;
}

.sls0403-menu-item {
  box-sizing: border-box;
  flex: 0 1 11rem;
  width: 11rem;
  max-width: 11rem;
  min-width: 0;
  height: 2rem !important;
  min-height: 2rem !important;
}

.sls0403-menu-item--wide {
  flex: 0 1 14.3rem;
  width: 14.3rem;
  max-width: 14.3rem;
}

.sls0403-search-panel :deep(.sls0403-vselect) {
  width: 100%;
  min-width: 0;
  height: 2rem !important;
  min-height: 2rem !important;
}

.sls0403-search-panel :deep(.sls0403-vselect .vs__dropdown-toggle) {
  box-sizing: border-box !important;
  display: flex !important;
  align-items: center !important;
  height: 2rem !important;
  min-height: 2rem !important;
  max-height: 2rem !important;
  padding: 0 0.5rem !important;
  border: 1px solid var(--sls0403-control-border, #cbd5e1) !important;
  border-radius: 0.375rem !important;
  background: #fff !important;
  box-shadow: none !important;
  overflow: hidden;
}

.sls0403-search-panel :deep(.sls0403-vselect .vs__selected-options) {
  display: flex !important;
  align-items: center !important;
  flex-wrap: nowrap !important;
  padding: 0 !important;
  margin: 0 !important;
  overflow: hidden;
  min-width: 0;
  min-height: 0 !important;
}

.sls0403-search-panel :deep(.sls0403-vselect .vs__selected),
.sls0403-search-panel :deep(.sls0403-vselect .vs__placeholder) {
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
  background: none !important;
  display: block;
  font-size: 0.875rem !important;
  line-height: 1.25rem !important;
  color: rgb(55 65 81) !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis;
  max-width: 100%;
}

.sls0403-search-panel :deep(.sls0403-vselect .vs__search),
.sls0403-search-panel :deep(.sls0403-vselect .vs__search input) {
  margin: 0 !important;
  padding: 0 !important;
  height: 1.25rem !important;
  min-height: 0 !important;
  line-height: 1.25rem !important;
  font-size: 0.875rem !important;
}

.sls0403-search-panel :deep(.sls0403-vselect .vs__actions) {
  padding: 0 0 0 0.25rem !important;
  align-items: center !important;
}

.sls0403-cell--store:has(.psp-popup),
.sls0403-cell--store:has(.psp-store-hover-list) {
  z-index: 50;
}

.sls0403-cell--store :deep(.psp-root) {
  /* SLS04_004 매장명 콤보 비율과 동일 */
  grid-template-columns:
    var(--psp-label-w, 5.5rem)
    minmax(var(--psp-radio-w, 4.75rem), auto)
    minmax(8rem, 1.1fr)
    minmax(12.5rem, 1.45fr)
    minmax(13rem, 1.85fr);
  column-gap: var(--psp-col-gap, 0.5rem);
  row-gap: 0.5rem;
  width: 100%;
  max-width: 100%;
  min-width: 0;
}

.sls0403-cell--store :deep(.psp-label) {
  width: var(--psp-label-w, 5.5rem);
  justify-content: center;
  padding-inline-start: 0;
  font-size: 1rem !important;
  font-weight: 600 !important;
  line-height: 1.25;
  color: rgb(17 24 39);
}

.sls0403-cell--store :deep(.psp-select),
.sls0403-cell--store :deep(.psp-store-trigger),
.sls0403-cell--store :deep(.psp-collapse-btn) {
  box-sizing: border-box !important;
  height: 2rem !important;
  min-height: 2rem !important;
  max-height: 2rem !important;
  font-size: 0.875rem !important;
  line-height: 1.25rem !important;
  border-radius: 0.375rem !important;
}

.sls0403-cell--store :deep(.psp-select) {
  color: rgb(55 65 81) !important;
  border: 1px solid var(--sls0403-control-border, #cbd5e1) !important;
  background: #fff !important;
  padding: 0 0.5rem !important;
}

.sls0403-cell--store :deep(.psp-collapse-btn) {
  width: 2rem !important;
  padding: 0 !important;
}

.sls0403-cell--store :deep(.psp-popup) {
  z-index: 60;
  right: 0;
  left: auto;
  width: min(42rem, 92vw);
  min-width: 28rem;
  max-width: min(42rem, 92vw);
}

@media (max-width: 1280px) {
  .sls0403-search-layout {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: none;
    row-gap: var(--sls0403-row-gap, 0.75rem);
  }

  .sls0403-cell--period,
  .sls0403-cell--type,
  .sls0403-cell--store,
  .sls0403-cell--menu {
    grid-column: 1;
    grid-row: auto;
  }

  .sls0403-cell--store :deep(.psp-popup) {
    left: 0;
    right: auto;
  }
}
</style>
