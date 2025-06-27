/*--############################################################################
# Filename : SLS04_004RPT.vue                                                  
# Description : 매출관리 > 메뉴별 매출 현황 > 메뉴별/시간별 매출현황.           
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
      class="grid grid-cols-[10fr,10fr] grid-rows-1 justify-between bg-gray-200 rounded-lg h-40 items-center z-10 p-5">
      <div
        class="grid grid-cols-1 grid-rows-4 -space-y-3 justify-start -ml-36 mt-10">
        <div class="flex justify-start ml-9">
          <Datepicker2
            class="pr-0"
            @endDate="endDate"
            @startDate="startDate"
            :closePopUp="closePopUp"
            ref="datepicker"
            @excelDate="excelDate"></Datepicker2>
        </div>
        <div class="justify-start flex items-center space-x-5 w-[600px] pl-48">
          <div class="text-base font-semibold">조건 :</div>
          <div>
            <label for="store"
              ><input
                type="checkbox"
                id="store"
                @click="setCond" />매장별</label
            >
          </div>
          <div>
            <label for="date"
              ><input type="checkbox" id="date" @click="setCond" />일자별</label
            >
          </div>
          <div>
            <label for="unite"
              ><input
                type="checkbox"
                id="unite"
                @click="setCellUnite" />셀병합</label
            >
          </div>
          <div>
            <label for="group"
              ><input
                type="checkbox"
                id="group"
                @click="changeGridMenus" />메뉴그룹표시</label
            >
          </div>
        </div>
        <div
          class="flex justify-start items-center text-base text-nowrap font-semibold ml-40">
          메뉴구분 :
          <div class="flex ml-3 space-x-3 -mt-1">
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

            <input
              type="text"
              v-model="searchText"
              class="pl-2 w-44 !h-8 bg-white" />

            <div class="flex justify-start space-x-2 items-center pl-20">
              객층구분 :
              <v-select
                v-model="selectedGuest"
                :options="GuestType"
                placeholder="전체"
                label="strName"
                class="w-44 !h-8 bg-white ml-5"
                clearable="true" />
            </div>
          </div>
        </div>
        <!-- <div class="pt-1 space-x-2 ml-10">
        
        </div> -->
      </div>
      <div class="ml-96 -mt-10">
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
    <!-- 그리드 영역 -->
    <div class="w-full h-[77%] mt-1">
      <Realgrid
        :progname="'SLS04_004RPT_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :exporttoExcel="exportExcel"
        :documentSubTitle="documentSubTitle"
        :documentTitle="'SLS04_004RPT'"
        :setRowGroupSpan2="setRowGroupSpan2"
        :mergeColumns2="true"
        :rowStateeditable="false"
        :mergeColumnGroupSubList2="[
          ['R1', 'S1', 'C1'],
          ['R2', 'S2', 'C2'],
          ['R3', 'S3', 'C3'],
          ['R4', 'S4', 'C4'],
          ['R5', 'S5', 'C5'],
          ['R6', 'S6', 'C6'],
          ['R7', 'S7', 'C7'],
          ['R8', 'S8', 'C8'],
          ['R9', 'S9', 'C9'],
          ['R10', 'S10', 'C10'],
          ['R11', 'S11', 'C11'],
          ['R12', 'S12', 'C12'],
          ['R13', 'S13', 'C13'],
          ['R14', 'S14', 'C14'],
          ['R15', 'S15', 'C15'],
          ['R16', 'S16', 'C16'],
          ['R17', 'S17', 'C17'],
          ['R18', 'S18', 'C18'],
          ['R19', 'S19', 'C19'],
          ['R20', 'S20', 'C20'],
          ['R21', 'S21', 'C21'],
          ['R22', 'S22', 'C22'],
          ['R23', 'S23', 'C23'],
          ['R24', 'S24', 'C24'],
        ]"
        :mergeColumnGroupName2="[
          '00:00-01:00',
          '01:00-02:00',
          '02:00-03:00',
          '03:00-04:00',
          '04:00-05:00',
          '05:00-06:00',
          '06:00-07:00',
          '07:00-08:00',
          '08:00-09:00',
          '09:00-10:00',
          '10:00-11:00',
          '11:00-12:00',
          '12:00-13:00',
          '13:00-14:00',
          '14:00-15:00',
          '15:00-16:00',
          '16:00-17:00',
          '17:00-18:00',
          '18:00-19:00',
          '19:00-20:00',
          '20:00-21:00',
          '21:00-22:00',
          '22:00-23:00',
          '23:00-24:00',
        ]"
        :hideColumnsId="hideColumnsId"></Realgrid>
    </div>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import { getMenuCondition, getSalesDatabyTimeAndMenu } from "@/api/misales";

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

const setGroupFooter = ref(false);
const mergeColumns2 = ref(false);

const progid = ref(1);
const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);
const selectedstartDate = ref();
const selectedendDate = ref();
const searchText = ref("");

const selectedGuest = ref({ strName: "전체", lngCode: 0 });
const GuestType = ref([
  { strName: "전체", lngCode: 0 },
  { strName: "가족", lngCode: 1 },
  { strName: "친구", lngCode: 2 },
  { strName: "연인", lngCode: 3 },
  { strName: "직장인", lngCode: 4 },
  { strName: "모임", lngCode: 5 },
  { strName: "외국인", lngCode: 6 },
  { strName: "단독", lngCode: 7 },
  { strName: "기타", lngCode: 8 },
  { strName: "주부", lngCode: 9 },
  { strName: "9", lngCode: 10 },
  { strName: "11", lngCode: 11 },
  { strName: "12", lngCode: 12 },
]);
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
const temphideColumns = ref(["strStore", "dtmDate"]);
const checkedDate = ref(0);
const checkedStore = ref(0);
const setCond = (e) => {
  if (e.target.id == "store") {
    if (e.target.checked) {
      checkedStore.value = 1;
      temphideColumns.value = temphideColumns.value.filter(
        (item) => item != "strStore"
      );
    } else {
      checkedStore.value = 0;
      temphideColumns.value.push("strStore");
    }
  } else if (e.target.id == "date") {
    if (e.target.checked) {
      checkedDate.value = 1;
      temphideColumns.value = temphideColumns.value.filter(
        (item) => item !== "dtmDate" && item !== "lngPrice"
      );
      hideColumnsId.value = hideColumnsId.value.filter(
        (item) => item !== "dtmDate" && item !== "lngPrice"
      );
    } else {
      checkedDate.value = 0;
      temphideColumns.value.push("dtmDate");
      hideColumnsId.value.push("dtmDate");
      hideColumnsId.value.push("lngPrice");
    }
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

    if (temphideColumns.value.includes("strStore")) {
      hideColumnsId.value.push("strStore");
    } else if (!temphideColumns.value.includes("strStore")) {
      hideColumnsId.value = hideColumnsId.value.filter(
        (item) => item != "strStore"
      );
    }
    if (temphideColumns.value.includes("dtmDate")) {
      hideColumnsId.value.push("dtmDate");
    } else if (!temphideColumns.value.includes("dtmDate")) {
      hideColumnsId.value = hideColumnsId.value.filter(
        (item) => item != "dtmDate"
      );
    }

    //comsole.log(hideColumnsId.value);
    reload.value = !reload.value;

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

    if (selectedGuest.value == null || selectedGuest.value == undefined) {
      selectedGuest.value = { lngCode: 0 };
    }

    const res = await getSalesDatabyTimeAndMenu(
      selectedGroup.value,
      selectedStores.value,
      selectedstartDate.value,
      selectedendDate.value,
      checkedStore.value,
      first,
      second,
      third,
      searchText.value,
      checkedDate.value,
      loginedstrLang,
      selectedGuest.value.lngCode
    );
    //comsole.log(res);
    rowData.value = res.data.List.filter((item) => item.lngCode != "");

    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
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
};

const exportExcel = ref(false);
const selectedSearchType = ref(4);
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
  //let menu ;
  // if(selectedMenu.value == null ){
  //     menu = '전체'
  // } else {
  //     menu = mainMenu.value.find(item => item.lngcode == selectedMenu.value.lngcode).strname
  // }

  // let submenu;

  // if(selectedsubMenu.value == null || menuType.value.length == 0 ){
  //     submenu = '전체'
  // } else {
  //     submenu = menuType.value.find(item => item.lngcode == selectedsubMenu.value.lngcode).strname
  // }
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
  let guest;
  if (selectedGuest.value == null || selectedGuest.value == undefined) {
    guest = "전체";
  } else {
    guest = GuestType.value.filter(
      (item) => item.lngCode == selectedGuest.value.lngCode
    )[0].strName;
  }
  documentSubTitle.value =
    selectedExcelDate.value +
    "\n" +
    selectedExcelStore.value +
    "\n" +
    "조건 :" +
    (checkedStore.value == 1 ? "매장별" : "") +
    (checkedDate.value == 1 ? " 일자별" : "") +
    "\n" +
    "메뉴구분 :" +
    first +
    "," +
    second +
    "," +
    third +
    searchText.value +
    "\n" +
    "객층구분 :" +
    guest;
  exportExcel.value = !exportExcel.value;
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

const selectedMenu = ref(null);

const subList = ref([]);
const menuType = ref([]);
const Menus = ref([]);
const mainMenu = ref([]);
watch(selectedMenu, async () => {
  //   if (selectedMenu.value == null) {
  //     selectedMenu.value = 0;
  //   }
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
  //   if (selectedsubMenu.value == null) {
  //     selectedsubMenu.value = 0;
  //   }

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
});
const hideColumnsId = ref([
  "strMajor",
  "strSub",
  "strStore",
  "dtmDate",
  "lngPrice",
]);

const checkedDays = new Set([1, 2, 3, 4, 5, 6, 7]);

const changeGridMenus = (e) => {
  if (e.target.checked) {
    if (
      hideColumnsId.value.includes("strStore") &&
      hideColumnsId.value.includes("dtmDate")
    ) {
      hideColumnsId.value = ["strStore", "dtmDate"];
    } else if (hideColumnsId.value.includes("strStore")) {
      hideColumnsId.value = ["strStore"];
    } else if (hideColumnsId.value.includes("dtmDate")) {
      hideColumnsId.value = ["dtmDate"];
    } else {
      hideColumnsId.value = [];
    }
  } else {
    if (
      hideColumnsId.value.includes("strStore") &&
      hideColumnsId.value.includes("dtmDate")
    ) {
      hideColumnsId.value = ["strStore", "dtmDate", "strMajor", "strSub"];
    } else if (hideColumnsId.value.includes("strStore")) {
      hideColumnsId.value = ["strStore", "strMajor", "strSub"];
    } else if (hideColumnsId.value.includes("dtmDate")) {
      hideColumnsId.value = ["dtmDate", "strMajor", "strSub"];
    } else {
      hideColumnsId.value = ["strMajor", "strSub"];
    }
  }
  reload.value = !reload.value;
};

const setRowGroupSpan2 = ref("");
const setCellUnite = (e) => {
  if (e.target.checked) {
    if (checkedStore.value == 1) {
      setRowGroupSpan2.value = "strStore,dtmDate";
    } else {
      setRowGroupSpan2.value = "dtmDate";
    }
  } else {
    setRowGroupSpan2.value = "";
  }
  reload.value = !reload.value;
};
</script>

<style></style>
