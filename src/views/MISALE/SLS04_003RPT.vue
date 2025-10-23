/*--############################################################################
# Filename : SLS04_003RPT.vue                                                  
# Description : 매출관리 > 메뉴별 매출 현황 > 메뉴별/결제형태별 매출현황.      
# Date :2025-05-14                                                             
# Author : 권맑음                     
################################################################################*/
<template>
  <!-- 조회 조건 -->
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
      </div>
    </div>
    <div
      class="grid grid-cols-[1fr,10fr,10fr] grid-rows-1 justify-between bg-gray-200 rounded-lg h-24 items-start z-10">
      <div class="w-10 ml-12 mt-2">
        <select
          name=""
          id=""
          class="border rounded-lg h-8 text-base relative z-50"
          v-model="selectedSearchType"
          @change="changeSearchType">
          <option :value="1">집계</option>
          <option :value="2">일자별</option>
          <option :value="3">월별</option>
        </select>
      </div>
      <div class="grid grid-cols-1 grid-rows-2 justify-start items-start">
        <div class="flex justify-start">
          <Datepicker2
            @endDate="endDate"
            @startDate="startDate"
            :closePopUp="closePopUp"
            ref="datepicker"
            @excelDate="excelDate"></Datepicker2>
          <div class="mt-2 items-center flex">
            <label for="detail" class="flex items-center"
              ><input
                type="checkbox"
                id="detail"
                @change="detailView" />상세보기</label
            >
          </div>
        </div>
        <div
          class="flex justify-start items-center text-base text-nowrap font-semibold ml-12">
          메뉴구분
          <div class="flex ml-5 space-x-3 mt-1">
            <v-select
              v-model="selectedMenu"
              :options="mainMenu"
              placeholder="전체"
              label="strname"
              class="w-44 !h-8 bg-white"
              clearable="true" />

            <v-select
              v-model="selectedsubMenu"
              :options="menuType"
              placeholder="전체"
              label="strname"
              class="w-44 !h-8 bg-white"
              clearable="true" />

            <v-select
              v-model="selectedSubSubMenu"
              :options="Menus"
              placeholder="전체"
              label="strname"
              class="w-44 !h-8 bg-white"
              clearable="true" />
          </div>
        </div>
      </div>
      <div class="ml-0 flex items-center">
        <div class="mt-2">
          <label for="StoreName"
            ><input type="checkbox" id="StoreName" @change="showStore"
          /></label>
        </div>
        <PickStorePlural
          @lngStoreCodes="lngStoreCodes"
          @lngStoreGroup="lngStoreGroup"
          @lngSupervisor="lngSupervisor"
          @lngStoreTeam="lngStoreTeam"
          @lngStoreAttr="lngStoreAttr"
          @excelStore="excelStore"
          :setFooterColID="setFooterColID"
          :setFooterExpressions="setFooterExpressions">
        </PickStorePlural>
      </div>
    </div>
    <!-- 조회 조건 -->
    <!--그리드 영역 -->
    <div class="w-full h-[85%] mt-1" v-if="selectedDetail == false">
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
        :rowStateeditable="false"></Realgrid>
    </div>

    <div class="w-full h-[85%] mt-1" v-if="selectedDetail == true">
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
        :rowStateeditable="false"></Realgrid>
    </div>
  </div>
  <!--그리드 영역 -->
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
const showStore = (e) => {
  if (e.target.checked) {
    showornotstore.value = true;
    hideColumnNow.value = false;
  } else {
    showornotstore.value = false;
    hideColumnNow.value = true;
  }
};

const changeSearchType = (e) => {
  if (e.target.value == 1) {
    if (selectedDetail.value == true) {
      hideColumnsId.value = ["strStoreName", "dtmDate", "dtmDate2"];
    } else {
      hideColumnsId.value = ["strStoreName", "dtmDate", "dtmDate2"];
    }
  } else if (e.target.value == 2) {
    if (selectedDetail.value == true) {
      hideColumnsId.value = ["strStoreName", "dtmDate2"];
    } else {
      hideColumnsId.value = ["strStoreName", "dtmDate2", "dtmDate"];
    }
  } else {
    if (selectedDetail.value == true) {
      hideColumnsId.value = ["strStoreName", "dtmDate"];
    } else {
      hideColumnsId.value = ["strStoreName", "dtmDate2", "dtmDate"];
    }
  }
};
</script>

<style></style>
