<!-- /*--############################################################################
# Filename : SLS04_004RPT.vue                                                  
# Description : 매출관리 > 메뉴별 매출 현황 > 메뉴별/시간별 매출현황.           
# Date :2025-05-14                                                             
# Author : 권맑음                     
################################################################################*/ -->
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
      class="sls04-search-panel z-10 mt-3 w-full min-h-0 shrink-0 overflow-visible rounded-lg bg-gray-200"
      :style="{
        '--sls04-panel-pad-x': '2rem',
        '--sls04-control-border': sls04ControlBorder,
        '--sls04-col-gutter': sls04ColGutter,
        '--sls04-row-gap': sls04RowGap,
        '--sls04-label-col': sls04LabelCol,
        '--psp-label-w': sls04LabelCol,
        '--psp-radio-w': '4.75rem',
        '--psp-col-gap': '0.5rem',
      }">
      <div class="sls04-search-layout min-w-0">
        <!-- 좌측: 기간 / 조건 / 메뉴·객층 -->
        <div class="sls04-left-stack min-w-0">
          <div class="sls04-row">
            <span class="sls04-lbl shrink-0">기간</span>
            <div class="sls04-date-slot min-w-0 flex-1">
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

          <div class="sls04-row">
            <span class="sls04-lbl shrink-0">조건</span>
            <div class="sls04-checks flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1">
              <label class="sls04-check-label" for="store">
                <input id="store" type="checkbox" class="sls04-check" @click="setCond" />
                매장별
              </label>
              <label class="sls04-check-label" for="date">
                <input id="date" type="checkbox" class="sls04-check" @click="setCond" />
                일자별
              </label>
              <label class="sls04-check-label" for="unite">
                <input id="unite" type="checkbox" class="sls04-check" @click="setCellUnite" />
                셀병합
              </label>
              <label class="sls04-check-label" for="group">
                <input id="group" type="checkbox" class="sls04-check" @click="changeGridMenus" />
                메뉴그룹표시
              </label>
            </div>
          </div>

          <div class="sls04-row sls04-row--menu">
            <span class="sls04-lbl shrink-0">메뉴구분</span>
            <div class="sls04-menu-fields min-w-0">
              <v-select
                v-model="selectedMenu"
                :options="mainMenu"
                placeholder="전체"
                label="strname"
                class="custom-select2 sls04-vselect sls04-menu-item"
                clearable="true" />
              <v-select
                v-model="selectedsubMenu"
                :options="menuType"
                placeholder="전체"
                label="strname"
                class="custom-select2 sls04-vselect sls04-menu-item"
                clearable="true" />
              <v-select
                v-model="selectedSubSubMenu"
                :options="Menus"
                placeholder="전체"
                label="strname"
                class="custom-select2 sls04-vselect sls04-menu-item sls04-menu-item--wide"
                clearable="true" />
              <input
                type="text"
                v-model="searchText"
                placeholder="메뉴명"
                @click.stop
                @mousedown.stop
                class="sls04-sg-input sls04-menu-item relative z-10 h-8 min-h-8 rounded-md border border-solid bg-white px-2 text-sm text-gray-700" />
            </div>
          </div>
        </div>

        <!-- 우측: 매장명 + 객층구분(우측 정렬) -->
        <div class="sls04-right-store min-w-0 overflow-visible">
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
          <div class="sls04-guest-row">
            <span class="sls04-lbl shrink-0">객층구분</span>
            <v-select
              v-model="selectedGuest"
              :options="GuestType"
              placeholder="전체"
              label="strName"
              class="custom-select2 sls04-vselect sls04-guest-select"
              clearable="true" />
          </div>
        </div>
      </div>
    </div>

    <!-- 그리드 영역 -->
    <div class="mt-2 flex min-h-0 min-w-0 flex-1 flex-col">
      <div class="relative min-h-0 w-full flex-1">
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

const sls04ControlBorder = "#cbd5e1";
const sls04ColGutter = "0.5rem";
const sls04RowGap = "0.875rem";
const sls04LabelCol = "5.5rem";
</script>

<style scoped>
.sls04-search-panel {
  box-sizing: border-box;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  padding-left: var(--sls04-panel-pad-x, 2rem);
  padding-right: var(--sls04-panel-pad-x, 2rem);
}

@media (min-width: 768px) {
  .sls04-search-panel {
    --sls04-panel-pad-x: 3rem;
  }
}

.sls04-search-layout {
  /* 메뉴구분 1.5배 폭 반영 — 좌측 비중 확대 */
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
  column-gap: var(--sls04-col-gutter, 0.5rem);
  align-items: start;
  min-width: 0;
}

.sls04-left-stack {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: var(--sls04-row-gap, 0.875rem);
  min-width: 0;
  width: 100%;
  max-width: 100%;
}

.sls04-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  min-height: 2rem;
}

.sls04-lbl {
  box-sizing: border-box;
  flex: 0 0 var(--sls04-label-col, 5.5rem);
  width: var(--sls04-label-col, 5.5rem);
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

.sls04-checks {
  min-width: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem 1rem;
}

.sls04-check-label {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.9375rem;
  line-height: 1.25;
  color: #1f2937;
  white-space: nowrap;
  cursor: pointer;
}

.sls04-check {
  width: 1rem;
  height: 1rem;
  margin: 0;
  accent-color: #2563eb;
  cursor: pointer;
}

.sls04-date-slot {
  min-width: 0;
  flex: 1 1 auto;
}

.sls04-date-slot :deep(> div.flex.justify-start.items-center) {
  margin: 0 !important;
  width: auto !important;
  max-width: 100%;
}

.sls04-date-slot :deep(input[type="date"]) {
  box-sizing: border-box;
  height: 2rem;
  min-height: 2rem;
  border: 1px solid var(--sls04-control-border, #cbd5e1);
  border-radius: 0.375rem;
  background: #fff;
}

.sls04-menu-fields {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  flex: 1 1 auto;
  position: relative;
  z-index: 5;
}

.sls04-menu-item {
  box-sizing: border-box;
  flex: 1 1 0;
  min-width: 9rem;
  max-width: 13.5rem;
  height: 2rem;
  min-height: 2rem;
}

/* 3번째(메뉴명) — 긴 텍스트용으로 더 넓게 */
.sls04-menu-item--wide {
  flex: 2 1 0;
  min-width: 16rem;
  max-width: 22rem;
}

/* 메뉴명 입력창 — 기존 대비 약 1.5배 */
.sls04-menu-fields .sls04-sg-input {
  flex: 0 0 auto;
  width: 16.5rem;
  min-width: 16.5rem;
  max-width: 16.5rem;
  pointer-events: auto;
  cursor: text;
}

.sls04-sg-input {
  box-sizing: border-box;
  height: 2rem;
  min-height: 2rem;
  border-color: var(--sls04-control-border, #cbd5e1);
}

.sls04-sg-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.25);
}

/* custom-select2 + 조회 AREA h-8 / 말줄임 */
.sls04-search-panel :deep(.sls04-vselect) {
  height: 2rem;
  min-height: 2rem;
}

.sls04-search-panel :deep(.sls04-vselect .vs__dropdown-toggle) {
  box-sizing: border-box;
  height: 2rem !important;
  min-height: 2rem !important;
  padding: 0 0.5rem !important;
  border: 1px solid var(--sls04-control-border, #cbd5e1) !important;
  border-radius: 0.375rem !important;
  background: #fff !important;
  overflow: hidden;
}

.sls04-search-panel :deep(.sls04-vselect .vs__selected-options) {
  display: flex;
  align-items: center;
  flex-wrap: nowrap !important;
  padding: 0 !important;
  margin: 0 !important;
  overflow: hidden;
  min-width: 0;
}

.sls04-search-panel :deep(.sls04-vselect .vs__selected),
.sls04-search-panel :deep(.sls04-vselect .vs__placeholder) {
  margin: 0 !important;
  padding: 0 !important;
  border: none;
  background: none;
  display: block;
  font-size: 0.875rem !important;
  line-height: 1.25rem !important;
  color: rgb(55 65 81);
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis;
  max-width: 100%;
  min-width: 0;
}

.sls04-search-panel :deep(.sls04-vselect .vs__search) {
  margin: 0 !important;
  padding: 0 !important;
  height: 1.25rem;
  line-height: 1.25rem;
  font-size: 0.875rem;
  min-width: 4px !important;
  opacity: 1 !important;
  cursor: text;
}

.sls04-search-panel :deep(.sls04-vselect .vs__actions) {
  padding: 0 0 0 0.25rem !important;
}

.sls04-right-store {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: var(--sls04-row-gap, 0.875rem);
  min-width: 0;
  overflow: visible;
}

/* 매장 팝업/말풍선 열리면 좌측 메뉴입력창보다 위 */
.sls04-right-store:has(.psp-popup),
.sls04-right-store:has(.psp-store-hover-list) {
  z-index: 50;
}

.sls04-right-store :deep(.psp-popup) {
  z-index: 60;
}

.sls04-right-store :deep(.psp-root) {
  /* 라벨 | 직/가맹·팀/SC | 그룹 | 속성·팀/SC쌍 | 매장선택(최대) */
  grid-template-columns:
    var(--psp-label-w, 5.5rem)
    minmax(var(--psp-radio-w, 4.75rem), auto)
    minmax(8rem, 1.1fr)
    minmax(12.5rem, 1.45fr)
    minmax(13rem, 1.85fr);
  column-gap: var(--psp-col-gap, 0.5rem);
  row-gap: 0.5rem;
}

.sls04-right-store :deep(.psp-label) {
  width: var(--psp-label-w, 5.5rem);
  justify-content: center;
  padding-inline-start: 0;
  font-size: 1rem;
  font-weight: 600;
}

/* 매장 콤보/트리거도 h-8로 통일 (공통 컴포넌트 기본 1.75rem 덮어씀) */
.sls04-right-store :deep(.psp-select),
.sls04-right-store :deep(.psp-store-trigger),
.sls04-right-store :deep(.psp-collapse-btn) {
  height: 2rem !important;
  min-height: 2rem !important;
}

.sls04-right-store :deep(.psp-collapse-btn) {
  width: 2rem !important;
}

/* 객층구분: 매장 AREA 우측 정렬 */
.sls04-guest-row {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  min-width: 0;
  min-height: 2rem;
}

.sls04-guest-row .sls04-lbl {
  flex: 0 0 auto;
  width: auto;
  justify-content: flex-end;
}

.sls04-guest-select {
  width: 13rem;
  max-width: 100%;
  height: 2rem;
  min-height: 2rem;
}

@media (max-width: 1100px) {
  .sls04-search-layout {
    grid-template-columns: minmax(0, 1fr);
    row-gap: var(--sls04-row-gap, 0.875rem);
  }

  .sls04-menu-fields {
    flex-wrap: wrap;
  }
}
</style>
