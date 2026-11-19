<!-- /*--############################################################################
# Filename : SLS04_002RPT.vue                                                  
# Description : 매출관리 > 메뉴별 매출 현황> 메뉴군별 매출 현황2.              
# Date :2025-05-14                                                             
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <!-- 조회 조건 -->
  <div class="flex h-full min-h-0 flex-col" @click="handleParentClick">
    <div class="flex shrink-0 justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center mr-9 space-x-2 pr-5">
        <button @click="chartButton" class="button chart md:w-auto w-14">
          차트
        </button>
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
      class="sls0402-search-panel z-10 mt-3 w-full min-h-0 shrink-0 overflow-visible rounded-lg bg-gray-200"
      :style="{
        '--sls0402-panel-pad-x': '2rem',
        '--sls0402-control-border': sls0402ControlBorder,
        '--sls0402-col-gutter': sls0402ColGutter,
        '--sls0402-row-gap': sls0402RowGap,
        '--sls0402-label-col': sls0402LabelCol,
        '--psp-label-w': sls0402LabelCol,
        '--psp-radio-w': '4.75rem',
        '--psp-col-gap': '0.5rem',
      }">
      <div class="sls0402-search-layout min-w-0">
        <!-- 1행: 기간 | 매장명(1~2행 span) -->
        <div class="sls0402-row">
          <span class="sls0402-lbl shrink-0">기간</span>
          <div class="sls0402-date-slot min-w-0 flex-1">
            <Datepicker2
              ref="datepicker"
              omit-main-label
              filter-bar-align
              :mainName="'기간'"
              :initEndYesterday="true"
              :closePopUp="closePopUp"
              @endDate="endDate"
              @startDate="startDate"
              @excelDate="excelDate" />
          </div>
        </div>

        <div class="sls0402-right-store min-w-0 overflow-visible">
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

        <!-- 2행: 메뉴구분 -->
        <div class="sls0402-row">
          <span class="sls0402-lbl shrink-0">메뉴구분</span>
          <div class="sls0402-menu-fields min-w-0">
            <v-select
              v-model="selectedMenu"
              :options="mainMenu"
              placeholder="전체"
              label="strName"
              class="custom-select2 sls0402-vselect sls0402-menu-item"
              :reduce="(store) => (store != null ? store.lngCode : null)"
              clearable />
            <v-select
              v-model="selectedsubMenu"
              :options="subList"
              placeholder="전체"
              label="strName"
              class="custom-select2 sls0402-vselect sls0402-menu-item sls0402-menu-item--wide"
              :reduce="(store) => (store != null ? store.lngCode : null)"
              clearable />
          </div>
        </div>

        <!-- 3행: 조회조건 (전체 폭) -->
          <div class="sls0402-row sls0402-row--cond">
            <span class="sls0402-lbl shrink-0">조회조건</span>
            <div class="sls0402-checks sls0402-checks--single flex min-w-0 items-center">
              <label class="sls0402-check-label" for="store">
                <input id="store" type="checkbox" class="sls0402-check" @change="checking" />
                매장명표시
              </label>
              <label class="sls0402-check-label" for="maingroup">
                <input id="maingroup" type="checkbox" class="sls0402-check" checked @change="checking" />
                대그룹
              </label>
              <label class="sls0402-check-label" for="subgroup">
                <input id="subgroup" type="checkbox" class="sls0402-check" checked @change="checking" />
                서브그룹
              </label>
              <label class="sls0402-check-label" for="day">
                <input id="day" type="checkbox" class="sls0402-check" @change="checking" />
                일자별
              </label>
              <label class="sls0402-check-label" for="gift">
                <input id="gift" type="checkbox" class="sls0402-check" checked @change="checking" />
                증정구분
              </label>
              <label class="sls0402-check-label" for="exception">
                <input id="exception" type="checkbox" class="sls0402-check" @change="checking" />
                단가제외
              </label>
              <label class="sls0402-check-label" for="sum">
                <input id="sum" type="checkbox" class="sls0402-check" checked @change="checking" />
                합계
              </label>
              <label class="sls0402-check-label" for="unite">
                <input id="unite" type="checkbox" class="sls0402-check" checked @change="checking" />
                셀병합
              </label>
            </div>
          </div>

          <!-- 4행 왼쪽: 조회 기준(그룹)별 접기·펼치기 -->
          <div class="sls0402-row sls0402-row--level">
            <span class="sls0402-lbl shrink-0">펼침 단계</span>
            <div class="sls0402-level-btns flex min-w-0 items-center">
              <template v-for="(lv, i) in sls0402LevelOptions" :key="lv.key">
                <span v-if="i > 0" class="sls0402-level-sep" aria-hidden="true">›</span>
                <button
                  type="button"
                  class="sls0402-level-btn"
                  :class="[`sls0402-level-btn--${lv.key}`, { 'is-active': sls0402ActiveLevel === lv.key }]"
                  :disabled="!sls0402LevelEnabled"
                  :title="lv.title"
                  @click="sls0402ExpandTo(lv)">
                  {{ lv.label }}
                </button>
              </template>
            </div>
          </div>

        <!-- 4행 오른쪽: 요일조건 · 공휴일 (매장명과 같은 시작선) -->
        <div class="sls0402-right-cond">
          <div class="sls0402-row">
            <span class="sls0402-lbl shrink-0">요일조건</span>
            <div class="sls0402-checks sls0402-checks--days flex min-w-0 items-center">
              <label class="sls0402-check-label" for="mon">
                <input id="mon" type="checkbox" class="sls0402-check" checked @change="checkday" />
                월
              </label>
              <label class="sls0402-check-label" for="tue">
                <input id="tue" type="checkbox" class="sls0402-check" checked @change="checkday" />
                화
              </label>
              <label class="sls0402-check-label" for="wed">
                <input id="wed" type="checkbox" class="sls0402-check" checked @change="checkday" />
                수
              </label>
              <label class="sls0402-check-label" for="thu">
                <input id="thu" type="checkbox" class="sls0402-check" checked @change="checkday" />
                목
              </label>
              <label class="sls0402-check-label" for="fri">
                <input id="fri" type="checkbox" class="sls0402-check" checked @change="checkday" />
                금
              </label>
              <label class="sls0402-check-label" for="sat">
                <input id="sat" type="checkbox" class="sls0402-check" checked @change="checkday" />
                토
              </label>
              <label class="sls0402-check-label" for="sun">
                <input id="sun" type="checkbox" class="sls0402-check" checked @change="checkday" />
                일
              </label>
            </div>
            <div class="sls0402-holiday">
              <span class="sls0402-holiday-lbl">공휴일</span>
              <select v-model="selectedHoliday" class="sls0402-sg-select">
                <option :value="0">선택</option>
                <option :value="1">포함</option>
                <option :value="2">제외</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 조회 조건 -->
    <!-- 그리드 영역 -->
    <div class="relative mt-2 flex min-h-0 min-w-0 flex-1 flex-col">
      <span id="print-area2"></span>
      <div id="print-area" class="h-full w-full">
        <Realgrid
          :progname="'SLS04_002RPT_VUE'"
          :progid="1"
          :rowData="rowData"
          :reload="reload"
          :exporttoExcel="exportExcel"
          :documentSubTitle="documentSubTitle"
          :documentTitle="'SLS04_002RPT'"
          :hideColumnsId="hideColumnsId"
          :setGroupColumnId="setGroupColumnId2"
          :setGroupFooter="setGroupFooter"
          :setFooter="true"
          :setGroupCustomLevel="2"
          :setFooterColID="setFooterColID"
          :setFooterExpressions="setFooterExpressions"
          :setGroupSumCustomColumnId="setGroupSumCustomColumnId"
          :setGroupSumCustomText="setGroupSumCustomText"
          :setGroupSumCustomLevel="setGroupSumCustomLevel"
          :setGroupFooterColID="setGroupFooterColID"
          :setGroupFooterExpressions="setGroupFooterExpressions"
          :setRowGroupSpan="setRowGroupSpan"
          :setMergeMode="checkedUnite"
          :rowStateeditable="false"
          :setGroupSumCustomLevel2="setGroupSumCustomLevel2"
          row-group-collapsed-adornments="footer"
          :setFooterCustomColumnId="['strMenu']"
          :setFooterCustomText="['총합계']"
          @gridReady="onSls0402GridReady"></Realgrid>
      </div>
    </div>

    <Teleport to="body">
      <div
        v-show="byRadioButton"
        class="sls0402-chart-overlay"
        @mousedown.self="closeButton2">
        <div
          class="sls0402-chart-dialog"
          :style="chartPop.style"
          role="dialog"
          aria-modal="true"
          @mousedown.stop>
          <div class="sls0402-chart-head" @mousedown="onChartHeadDown">
            <h2 class="sls0402-chart-title">메뉴군별 매출 현황2</h2>
            <div class="sls0402-chart-actions" @mousedown.stop>
              <button type="button" class="pnc-sub-btn" @click="searchButton2">
                <svg class="pnc-sub-btn__icon" viewBox="0 0 16 16" aria-hidden="true">
                  <circle cx="7" cy="7" r="4.2" fill="none" stroke="currentColor" stroke-width="1.6" />
                  <path d="M10.2 10.2 13.2 13.2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
                </svg>
                조회
              </button>
              <button
                type="button"
                class="pnc-sub-btn pnc-sub-btn--gray"
                @click="closeButton2">
                <svg class="pnc-sub-btn__icon" viewBox="0 0 16 16" aria-hidden="true">
                  <path
                    d="M4 4l8 8M12 4 4 12"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.6"
                    stroke-linecap="round" />
                </svg>
                닫기
              </button>
            </div>
          </div>

          <div class="sls0402-chart-toolbar">
            <div class="sls0402-chart-row">
              <span class="sls0402-chart-lbl">데이터 선택</span>
              <div class="sls0402-chart-radios">
                <label class="sls0402-chart-radio" for="sls0402-first">
                  <input type="radio" id="sls0402-first" name="sls0402-option" v-model="selectOption" :value="1" />총건수
                </label>
                <label class="sls0402-chart-radio" for="sls0402-second">
                  <input type="radio" id="sls0402-second" name="sls0402-option" v-model="selectOption" :value="2" />정상건수
                </label>
                <label class="sls0402-chart-radio" for="sls0402-third">
                  <input type="radio" id="sls0402-third" name="sls0402-option" v-model="selectOption" :value="3" />증정건수
                </label>
                <label class="sls0402-chart-radio" for="sls0402-fourth">
                  <input type="radio" id="sls0402-fourth" name="sls0402-option" v-model="selectOption" :value="4" />할인건수
                </label>
                <label class="sls0402-chart-radio" for="sls0402-fifth">
                  <input type="radio" id="sls0402-fifth" name="sls0402-option" v-model="selectOption" :value="5" />총매출액
                </label>
                <label class="sls0402-chart-radio" for="sls0402-sixth">
                  <input type="radio" id="sls0402-sixth" name="sls0402-option" v-model="selectOption" :value="6" />실매출액
                </label>
                <label class="sls0402-chart-radio" for="sls0402-seventh">
                  <input type="radio" id="sls0402-seventh" name="sls0402-option" v-model="selectOption" :value="7" />순매출액
                </label>
                <label class="sls0402-chart-radio" for="sls0402-eighth">
                  <input type="radio" id="sls0402-eighth" name="sls0402-option" v-model="selectOption" :value="8" />할인액
                </label>
                <label class="sls0402-chart-radio" for="sls0402-ninth">
                  <input type="radio" id="sls0402-ninth" name="sls0402-option" v-model="selectOption" :value="9" />증정금액
                </label>
              </div>
            </div>
            <div class="sls0402-chart-row">
              <span class="sls0402-chart-lbl">차트 유형</span>
              <div class="sls0402-chart-radios">
                <label class="sls0402-chart-radio" for="sls0402-graph1">
                  <input type="radio" id="sls0402-graph1" name="sls0402-option2" v-model="selectOption2" :value="1" />꺽은선 그래프
                </label>
                <label class="sls0402-chart-radio" for="sls0402-graph2">
                  <input type="radio" id="sls0402-graph2" name="sls0402-option2" v-model="selectOption2" :value="2" />막대 그래프
                </label>
                <label class="sls0402-chart-radio" for="sls0402-graph3">
                  <input type="radio" id="sls0402-graph3" name="sls0402-option2" v-model="selectOption2" :value="3" />원형 그래프
                </label>
              </div>
            </div>
          </div>

          <div class="sls0402-chart-body">
            <Chart
              class="sls0402-chart-canvas"
              :type="type"
              :labels="labels"
              :label="label"
              :showLegend="type === 'pie'"
              :pie-slice-label="type === 'pie'"
              :changePieData="true"
              :datas="datas"
              :chartName="'메뉴군별 매출 현황2'"
              :colors="colors" />
          </div>
        </div>
      </div>
    </Teleport>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import { getSalesReportByMenu, getTableSearchCondition } from "@/api/misales";
import Chart from "@/components/chart.vue";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

import Datepicker2 from "@/components/Datepicker2.vue";
import { rgGetInstance } from "@/components/realgridInstanceRegistry";
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
import { useFloatPopup } from "@/utils/floatPopup";

/*
 * 프린트 세팅 라이브러리
 */

import printJS from "print-js";

/*
 * 공통 표준  Function
 */

import { computed, onMounted, ref, watch } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";

/** 조회 AREA — SLS04_004 / SLS02_031 wire 패턴 */
const sls0402ControlBorder = "#cbd5e1";
const sls0402ColGutter = "1.25rem";
const sls0402RowGap = "0.5rem";
const sls0402LabelCol = "5.5rem";

const colors = [
  "lightgreen",
  "#333399",
  "#FF5733",
  "#33FF57",
  "#3357FF",
  "#FF33A8",
  "#A833FF",
  "#33FFF5",
  "#F5FF33",
  "#FF8C33",
  "#8CFF33",
  "#338CFF",
  "#FF338C",
  "#8C33FF",
  "#33FF8C",
  "#F533FF",
  "#33F5FF",
  "#FF33F5",
  "#FFD700",
  "#00FA9A",
  "#1E90FF",
  "#FF4500",
  "#DA70D6",
  "#00CED1",
  "#ADFF2F",
  "#FF69B4",
  "#20B2AA",
  "#9370DB",
  "#3CB371",
  "#FFB6C1",
];
const setGroupFooter = ref(true);
const setFooterColID = ref([
  "strStore",
  "lngCode",
  "strMajor",
  "strSub",
  "strMenu",
  "dtmDate",
  "lngPrice",
  "dtmDate",
  "lngNMenuCnt",
  "lngGMenuCnt",
  "lngMenuCnt",
  "lngSalAmt",
  "lngGAmount",
  "lngDCAmt",
  "lngActAmt",
  "lngVAT",
  "lngNetAmt",
  "dblDistRate",
  "lngSalCnt",
  "dblPreWeek",
  "dblPreYear",
]);

const setFooterExpressions = ref([
  "custom",
  "custom",
  "custom",
  "custom",
  "custom",
  "custom",
  "custom",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "avg",
  "avg",
]);
const setGroupFooterColID = ref([
  "strStore",
  "strMajor",
  "strSub",
  "dtmDate",
  "lngPrice",
  "dtmDate",
  "lngNMenuCnt",
  "lngGMenuCnt",
  "lngMenuCnt",
  "lngSalAmt",
  "lngGAmount",
  "lngDCAmt",
  "lngActAmt",
  "lngVAT",
  "lngNetAmt",
  "dblDistRate",
  "lngSalCnt",
  "dblPreWeek",
  "dblPreYear",
]);
const setGroupFooterExpressions = ref([
  "custom",
  "custom",
  "custom",
  "custom",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "avg",
  "avg",
]);
const setGroupSumCustomColumnId = ref(["strStore", "strMajor", "strSub"]);
const setGroupSumCustomText = ref(["매장 소계", "", ""]);
const setGroupSumCustomLevel = ref(2);
const setGroupColumnId = ref(["strMajor", "strSub", ""]);
const setGroupColumnId2 = ref("strMajor,strSub,");
const setGroupSumCustomLevel2 = ref(1);
const progid = ref(2);
const reload = ref(false);
const rowData = ref([]);
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
const byRadioButton = ref(false);

const selectOption = ref(1);
const selectOption2 = ref(1);

watch(selectOption, () => {
  //comsole.log(selectOption.value);
});
watch(selectOption2, () => {
  if (selectOption2.value == 1) {
    type.value = "line";
  } else if (selectOption2.value == 2) {
    type.value = "bar";
  } else if (selectOption2.value == 3) {
    type.value = "pie";
  }
  datas.value = [...datas.value];
});
const datas = ref([]);
const type = ref("line");
const label = ref([]);
const labels = ref([]);

/** 총건수 + 꺽은선 기본값, 이전 차트 데이터 제거 */
const resetChartPopup = () => {
  selectOption.value = 1;
  selectOption2.value = 1;
  type.value = "line";
  datas.value = [];
  labels.value = [];
  label.value = [];
};

const getJsonData = (e) => {
  datas.value = [];
  let data1 = [];
  for (let i = 0; i < e.length; i++) {
    data1.push(e[i].lastTotAmt);
  }
  datas.value.push(data1);

  let data2 = [];
  for (let i = 0; i < e.length; i++) {
    data2.push(e[i].nowTotAmt);
  }
  datas.value.push(data2);
};
const setchart = ref(2);
const getJson = ref(false);
// watch(setchart, () => {
//   if (setchart.value == 0) {
//     type.value = "line";
//     byRadioButton.value = true;
//   } else if (setchart.value == 1) {
//     type.value = "bar";
//     byRadioButton.value = true;
//   } else {
//     byRadioButton.value = false;
//   }

//   getJson.value = !getJson.value;
// });
/**
 * 선택한 매출 종료일자
 */

const endDate = (e) => {
  selectedendDate.value = e;
};

/** 차트 팝업 — 제목 줄 드래그로 이동 (SLS06_002 / PUR08과 동일 유틸) */
const chartPop = useFloatPopup({
  width: 1088,
  height: 832,
  minWidth: 720,
  minHeight: 480,
  maxWidthRatio: 0.96,
  maxHeightRatio: 0.92,
});

const onChartHeadDown = (event) => {
  if (event.button !== 0) return;
  if (event.target.closest("button")) return;
  chartPop.startDrag(event);
};

/**
 * 차트 버튼 — 열 때 총건수·꺽은선으로 초기화 후 바로 조회
 */
const chartButton = async () => {
  if (byRadioButton.value) {
    closeButton2();
    return;
  }
  resetChartPopup();
  byRadioButton.value = true;
  chartPop.place();
  await searchButton2();
};
const setRowGroupSpan = ref("strStore,strMajor,strSub");
// 셀병합 체크값 → 그룹 묶음(row group) 셀 병합 여부
const checkedUnite = ref(true);
const tempSeeDay = ref(0);
const seeDays = (e) => {
  if (e.target.checked) {
    tempSeeDay.value = 1;
  } else {
    tempSeeDay.value = 0;
  }
};
const store = useStore();
const loginedstrLang = store.state.userData.lngLanguage;
/**
 *  조회 함수
 */

const searchButton = async () => {
  store.state.loading = true;
  try {
    initGrid();

    // 일자별 + 하루만 조회: 일자 합계가 서브그룹 합계와 같은 값이라 일자로는 묶지 않음 (일자 열은 표시)
    const sls0402SingleDay =
      checkedReportTypes.has(1) &&
      selectedstartDate.value === selectedendDate.value;
    setGroupColumnId2.value = setGroupColumnId.value
      .filter((f) => !(sls0402SingleDay && f === "dtmDate"))
      .join(",");

    reload.value = !reload.value;

    const reportType = [...checkedReportTypes];
    const checkdays = [...checkedDays];

    //comsole.log(checkdays);

    if (selectedsubMenu.value == null || selectedsubMenu.value == undefined) {
      selectedsubMenu.value = 0;
    }
    if (selectedMenu.value == null || selectedMenu.value == undefined) {
      selectedMenu.value = 0;
    }
    const res = await getSalesReportByMenu(
      selectedGroup.value,
      selectedStores.value,
      selectedstartDate.value,
      selectedendDate.value,
      selectedMenu.value,
      selectedsubMenu.value,
      reportType.join(""),
      checkedGift.value,
      checkedlngPrice.value,
      checkedlngPrint.value,
      checkdays.join(","),
      selectedHoliday.value
    );
    //console.log(res);
    rowData.value = sls0402SortByDate(res.data.MENUS);

    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
  } finally {
    store.state.loading = false;
  }
};

const closeButton2 = () => {
  byRadioButton.value = false;
  resetChartPopup();
};
/**
 *  조회 함수
 */

const searchButton2 = async () => {
  store.state.loading = true;
  try {
    const reportType = [...checkedReportTypes];
    const checkdays = [...checkedDays];

    //comsole.log(checkdays);

    if (selectedsubMenu.value == null || selectedsubMenu.value == undefined) {
      selectedsubMenu.value = 0;
    }
    if (selectedMenu.value == null || selectedMenu.value == undefined) {
      selectedMenu.value = 0;
    }
    const res = await getSalesReportByMenu(
      selectedGroup.value,
      selectedStores.value,
      selectedstartDate.value,
      selectedendDate.value,
      selectedMenu.value,
      selectedsubMenu.value,
      123,
      1,
      checkedlngPrice.value,
      1,
      checkdays.join(","),
      selectedHoliday.value
    );

    //comsole.log(res.data.MENUS);
    //comsole.log(selectOption.value);
    datas.value = [];
    if (selectOption.value == 1) {
      labels.value = [
        ...new Set(res.data.MENUS.map((item) => item.dtmDate.split(" ")[0])),
      ].sort((a, b) => new Date(a) - new Date(b)); // 반응형 Proxy에서 일반 배열로 변환
      //comsole.log(labels.value); // 이 부분은 배열로 변환된 결과

      let menus = Object.values(
        res.data.MENUS.reduce((acc, cur) => {
          if (!acc[cur.lngCode]) {
            acc[cur.lngCode] = {
              lngCode: cur.lngCode,
              strMenu: cur.strMenu,
              lngMenuCnt: cur.lngMenuCnt,
            };
          } else {
            acc[cur.lngCode].lngMenuCnt += cur.lngMenuCnt; // 같은 lngCode면 lngMenuCnt 누적
          }
          return acc;
        }, {})
      )
        .sort((a, b) => b.lngMenuCnt - a.lngMenuCnt)
        .slice(0, 5);
      //comsole.log(menus);
      label.value = menus.map((item) => item.strMenu);

      //comsole.log(menus);
      let data1 = [];
      for (let i = 0; i < menus.length; i++) {
        data1 = [];
        for (let j = 0; j < labels.value.length; j++) {
          const result = res.data.MENUS.filter(
            (item) =>
              item.dtmDate.split(" ")[0] == labels.value[j] &&
              item.lngCode == menus[i].lngCode
          );
          if (result.length == 0) {
            data1.push(0);
          } else {
            data1.push(result.reduce((sum, item) => sum + item.lngMenuCnt, 0));
          }
        }
        datas.value.push(data1);
      }
      datas.value = [...datas.value];

      //comsole.log(datas.value);
    } else if (selectOption.value == 2) {
      labels.value = [
        ...new Set(res.data.MENUS.map((item) => item.dtmDate.split(" ")[0])),
      ].sort((a, b) => new Date(a) - new Date(b)); // 반응형 Proxy에서 일반 배열로 변환
      //comsole.log(labels.value); // 이 부분은 배열로 변환된 결과

      let menus = Object.values(
        res.data.MENUS.reduce((acc, cur) => {
          if (!acc[cur.lngCode]) {
            acc[cur.lngCode] = {
              lngCode: cur.lngCode,
              strMenu: cur.strMenu,
              lngNMenuCnt: cur.lngNMenuCnt,
            };
          } else {
            acc[cur.lngCode].lngNMenuCnt += cur.lngNMenuCnt; // 같은 lngCode면 lngMenuCnt 누적
          }
          return acc;
        }, {})
      )
        .sort((a, b) => b.lngNMenuCnt - a.lngNMenuCnt)
        .slice(0, 5);
      //comsole.log(menus);
      label.value = menus.map((item) => item.strMenu);

      //comsole.log(menus);
      let data1 = [];
      for (let i = 0; i < menus.length; i++) {
        data1 = [];
        for (let j = 0; j < labels.value.length; j++) {
          const result = res.data.MENUS.filter(
            (item) =>
              item.dtmDate.split(" ")[0] == labels.value[j] &&
              item.lngCode == menus[i].lngCode
          );
          if (result.length == 0) {
            data1.push(0);
          } else {
            data1.push(result.reduce((sum, item) => sum + item.lngNMenuCnt, 0));
          }
        }
        datas.value.push(data1);
      }
      datas.value = [...datas.value];
      //comsole.log(datas.value);
    } else if (selectOption.value == 3) {
      labels.value = [
        ...new Set(res.data.MENUS.map((item) => item.dtmDate.split(" ")[0])),
      ].sort((a, b) => new Date(a) - new Date(b)); // 반응형 Proxy에서 일반 배열로 변환
      //comsole.log(labels.value); // 이 부분은 배열로 변환된 결과

      let menus = Object.values(
        res.data.MENUS.reduce((acc, cur) => {
          if (!acc[cur.lngCode]) {
            acc[cur.lngCode] = {
              lngCode: cur.lngCode,
              strMenu: cur.strMenu,
              lngGMenuCnt: cur.lngGMenuCnt,
            };
          } else {
            acc[cur.lngCode].lngGMenuCnt += cur.lngGMenuCnt; // 같은 lngCode면 lngMenuCnt 누적
          }
          return acc;
        }, {})
      )
        .sort((a, b) => b.lngGMenuCnt - a.lngGMenuCnt)
        .slice(0, 5);
      //comsole.log(menus);
      label.value = menus.map((item) => item.strMenu);

      //comsole.log(menus);
      let data1 = [];
      for (let i = 0; i < menus.length; i++) {
        data1 = [];
        for (let j = 0; j < labels.value.length; j++) {
          const result = res.data.MENUS.filter(
            (item) =>
              item.dtmDate.split(" ")[0] == labels.value[j] &&
              item.lngCode == menus[i].lngCode
          );
          if (result.length == 0) {
            data1.push(0);
          } else {
            data1.push(result.reduce((sum, item) => sum + item.lngGMenuCnt, 0));
          }
        }
        datas.value.push(data1);
      }
      datas.value = [...datas.value];
    } else if (selectOption.value == 4) {
      labels.value = [
        ...new Set(res.data.MENUS.map((item) => item.dtmDate.split(" ")[0])),
      ].sort((a, b) => new Date(a) - new Date(b)); // 반응형 Proxy에서 일반 배열로 변환
      //comsole.log(labels.value); // 이 부분은 배열로 변환된 결과

      let menus = Object.values(
        res.data.MENUS.reduce((acc, cur) => {
          if (!acc[cur.lngCode]) {
            acc[cur.lngCode] = {
              lngCode: cur.lngCode,
              strMenu: cur.strMenu,
              lngSalCnt: cur.lngSalCnt,
            };
          } else {
            acc[cur.lngCode].lngSalCnt += cur.lngSalCnt; // 같은 lngCode면 lngMenuCnt 누적
          }
          return acc;
        }, {})
      )
        .sort((a, b) => b.lngSalCnt - a.lngSalCnt)
        .slice(0, 5);
      //comsole.log(menus);
      label.value = menus.map((item) => item.strMenu);

      //comsole.log(menus);
      let data1 = [];
      for (let i = 0; i < menus.length; i++) {
        data1 = [];
        for (let j = 0; j < labels.value.length; j++) {
          const result = res.data.MENUS.filter(
            (item) =>
              item.dtmDate.split(" ")[0] == labels.value[j] &&
              item.lngCode == menus[i].lngCode
          );
          if (result.length == 0) {
            data1.push(0);
          } else {
            data1.push(result.reduce((sum, item) => sum + item.lngSalCnt, 0));
          }
        }
        datas.value.push(data1);
      }
      datas.value = [...datas.value];
    } else if (selectOption.value == 5) {
      labels.value = [
        ...new Set(res.data.MENUS.map((item) => item.dtmDate.split(" ")[0])),
      ].sort((a, b) => new Date(a) - new Date(b)); // 반응형 Proxy에서 일반 배열로 변환
      //comsole.log(labels.value); // 이 부분은 배열로 변환된 결과

      let menus = Object.values(
        res.data.MENUS.reduce((acc, cur) => {
          if (!acc[cur.lngCode]) {
            acc[cur.lngCode] = {
              lngCode: cur.lngCode,
              strMenu: cur.strMenu,
              lngSalAmt: cur.lngSalAmt,
            };
          } else {
            acc[cur.lngCode].lngSalAmt += cur.lngSalAmt; // 같은 lngCode면 lngMenuCnt 누적
          }
          return acc;
        }, {})
      )
        .sort((a, b) => b.lngSalAmt - a.lngSalAmt)
        .slice(0, 5);
      //comsole.log(menus);
      label.value = menus.map((item) => item.strMenu);

      //comsole.log(menus);
      let data1 = [];
      for (let i = 0; i < menus.length; i++) {
        data1 = [];
        for (let j = 0; j < labels.value.length; j++) {
          const result = res.data.MENUS.filter(
            (item) =>
              item.dtmDate.split(" ")[0] == labels.value[j] &&
              item.lngCode == menus[i].lngCode
          );
          if (result.length == 0) {
            data1.push(0);
          } else {
            data1.push(result.reduce((sum, item) => sum + item.lngSalAmt, 0));
          }
        }
        datas.value.push(data1);
      }
      datas.value = [...datas.value];
    } else if (selectOption.value == 6) {
      labels.value = [
        ...new Set(res.data.MENUS.map((item) => item.dtmDate.split(" ")[0])),
      ].sort((a, b) => new Date(a) - new Date(b)); // 반응형 Proxy에서 일반 배열로 변환
      //comsole.log(labels.value); // 이 부분은 배열로 변환된 결과

      let menus = Object.values(
        res.data.MENUS.reduce((acc, cur) => {
          if (!acc[cur.lngCode]) {
            acc[cur.lngCode] = {
              lngCode: cur.lngCode,
              strMenu: cur.strMenu,
              lngActAmt: cur.lngActAmt,
            };
          } else {
            acc[cur.lngCode].lngActAmt += cur.lngActAmt; // 같은 lngCode면 lngMenuCnt 누적
          }
          return acc;
        }, {})
      )
        .sort((a, b) => b.lngActAmt - a.lngActAmt)
        .slice(0, 5);
      //comsole.log(menus);
      label.value = menus.map((item) => item.strMenu);

      //comsole.log(menus);
      let data1 = [];
      for (let i = 0; i < menus.length; i++) {
        data1 = [];
        for (let j = 0; j < labels.value.length; j++) {
          const result = res.data.MENUS.filter(
            (item) =>
              item.dtmDate.split(" ")[0] == labels.value[j] &&
              item.lngCode == menus[i].lngCode
          );
          if (result.length == 0) {
            data1.push(0);
          } else {
            data1.push(result.reduce((sum, item) => sum + item.lngActAmt, 0));
          }
        }
        datas.value.push(data1);
      }
      datas.value = [...datas.value];
    } else if (selectOption.value == 7) {
      labels.value = [
        ...new Set(res.data.MENUS.map((item) => item.dtmDate.split(" ")[0])),
      ].sort((a, b) => new Date(a) - new Date(b)); // 반응형 Proxy에서 일반 배열로 변환
      //comsole.log(labels.value); // 이 부분은 배열로 변환된 결과

      let menus = Object.values(
        res.data.MENUS.reduce((acc, cur) => {
          if (!acc[cur.lngCode]) {
            acc[cur.lngCode] = {
              lngCode: cur.lngCode,
              strMenu: cur.strMenu,
              lngNetAmt: cur.lngNetAmt,
            };
          } else {
            acc[cur.lngCode].lngNetAmt += cur.lngNetAmt; // 같은 lngCode면 lngMenuCnt 누적
          }
          return acc;
        }, {})
      )
        .sort((a, b) => b.lngNetAmt - a.lngNetAmt)
        .slice(0, 5);
      //comsole.log(menus);
      label.value = menus.map((item) => item.strMenu);

      //comsole.log(menus);
      let data1 = [];
      for (let i = 0; i < menus.length; i++) {
        data1 = [];
        for (let j = 0; j < labels.value.length; j++) {
          const result = res.data.MENUS.filter(
            (item) =>
              item.dtmDate.split(" ")[0] == labels.value[j] &&
              item.lngCode == menus[i].lngCode
          );
          if (result.length == 0) {
            data1.push(0);
          } else {
            data1.push(result.reduce((sum, item) => sum + item.lngNetAmt, 0));
          }
        }
        datas.value.push(data1);
      }
      datas.value = [...datas.value];
    } else if (selectOption.value == 8) {
      labels.value = [
        ...new Set(res.data.MENUS.map((item) => item.dtmDate.split(" ")[0])),
      ].sort((a, b) => new Date(a) - new Date(b)); // 반응형 Proxy에서 일반 배열로 변환
      //comsole.log(labels.value); // 이 부분은 배열로 변환된 결과

      let menus = Object.values(
        res.data.MENUS.reduce((acc, cur) => {
          if (!acc[cur.lngCode]) {
            acc[cur.lngCode] = {
              lngCode: cur.lngCode,
              strMenu: cur.strMenu,
              lngDCAmt: cur.lngDCAmt,
            };
          } else {
            acc[cur.lngCode].lngDCAmt += cur.lngDCAmt; // 같은 lngCode면 lngMenuCnt 누적
          }
          return acc;
        }, {})
      )
        .sort((a, b) => b.lngDCAmt - a.lngDCAmt)
        .slice(0, 5);
      //comsole.log(menus);
      label.value = menus.map((item) => item.strMenu);

      //comsole.log(menus);
      let data1 = [];
      for (let i = 0; i < menus.length; i++) {
        data1 = [];
        for (let j = 0; j < labels.value.length; j++) {
          const result = res.data.MENUS.filter(
            (item) =>
              item.dtmDate.split(" ")[0] == labels.value[j] &&
              item.lngCode == menus[i].lngCode
          );
          if (result.length == 0) {
            data1.push(0);
          } else {
            data1.push(result.reduce((sum, item) => sum + item.lngDCAmt, 0));
          }
        }
        datas.value.push(data1);
      }
      datas.value = [...datas.value];
    } else if (selectOption.value == 9) {
      labels.value = [
        ...new Set(res.data.MENUS.map((item) => item.dtmDate.split(" ")[0])),
      ].sort((a, b) => new Date(a) - new Date(b)); // 반응형 Proxy에서 일반 배열로 변환
      //comsole.log(labels.value); // 이 부분은 배열로 변환된 결과

      let menus = Object.values(
        res.data.MENUS.reduce((acc, cur) => {
          if (!acc[cur.lngCode]) {
            acc[cur.lngCode] = {
              lngCode: cur.lngCode,
              strMenu: cur.strMenu,
              lngGAmount: cur.lngGAmount,
            };
          } else {
            acc[cur.lngCode].lngGAmount += cur.lngGAmount; // 같은 lngCode면 lngMenuCnt 누적
          }
          return acc;
        }, {})
      )
        .sort((a, b) => b.lngGAmount - a.lngGAmount)
        .slice(0, 5);
      //comsole.log(menus);
      label.value = menus.map((item) => item.strMenu);

      //comsole.log(menus);
      let data1 = [];
      for (let i = 0; i < menus.length; i++) {
        data1 = [];
        for (let j = 0; j < labels.value.length; j++) {
          const result = res.data.MENUS.filter(
            (item) =>
              item.dtmDate.split(" ")[0] == labels.value[j] &&
              item.lngCode == menus[i].lngCode
          );
          if (result.length == 0) {
            data1.push(0);
          } else {
            data1.push(result.reduce((sum, item) => sum + item.lngGAmount, 0));
          }
        }
        datas.value.push(data1);
      }
      datas.value = [...datas.value];
    }

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
const ConditionSet = new Set([1, 2, 4, 6, 7]);
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
  if (selectedsubMenu.value == null) {
    submenu = "전체";
  } else {
    submenu = subList.value.find(
      (item) => item.lngCode == selectedsubMenu.value
    ).strName;
  }
  const newCondarr = [...ConditionSet].sort();
  let searchcond = "";
  for (let i = 0; i < newCondarr.length; i++) {
    searchcond += searchCondition.value[newCondarr[i]] + ",";
  }
  if (searchcond.slice(-1) === ",") {
    searchcond = searchcond.slice(0, -1);
  }

  let thirdcond = "";
  const newCondarr2 = [...checkedDays].sort();
  for (let i = 0; i < newCondarr2.length; i++) {
    thirdcond += dayCondition.value[newCondarr2[i] - 1] + ",";
  }
  if (thirdcond.slice(-1) === ",") {
    thirdcond = thirdcond.slice(0, -1);
  }

  documentSubTitle.value =
    selectedExcelDate.value +
    "\n" +
    selectedExcelStore.value +
    "\n" +
    "메뉴구분 :" +
    menu +
    "," +
    submenu +
    "\n" +
    "조회조건 : " +
    searchcond +
    "\n" +
    "요일조건 : " +
    thirdcond;
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

/**
 * 프린트 기능 버튼
 */

const printButton = () => {
  if (afterSearch.value == false) {
    return;
  }
  //comsole.log(rowData.value);

  const convert = rowData.value.map((item) => ({
    ...item,
    lngPrice: item.lngPrice.toLocaleString(),
    lngNMenuCnt: item.lngNMenuCnt.toLocaleString(),
    lngGMenuCnt: item.lngGMenuCnt.toLocaleString(),
    lngMenuCnt: item.lngMenuCnt.toLocaleString(),
    lngSalAmt: item.lngSalAmt.toLocaleString(),
    lngGAmount: item.lngGAmount.toLocaleString(),
    lngDCAmt: item.lngDCAmt.toLocaleString(),
    lngActAmt: item.lngActAmt.toLocaleString(),
    lngNetAmt: item.lngNetAmt.toLocaleString(),
    lngSalCnt: item.lngSalCnt.toLocaleString(),
    dblPreWeek: Math.round(item.dblPreWeek * 100) / 100,
    dblPreYear: Math.round(item.dblPreYear * 100) / 100,
  }));

  let property = [
    { field: "strStore", displayName: "매장명" },
    { field: "strMajor", displayName: "대그룹" },
    { field: "strSub", displayName: "서브그룹" },
    { field: "lngCode", displayName: "메뉴코드" },
    { field: "strMenu", displayName: "메뉴명" },
    { field: "lngPrice", displayName: "단가" },
    { field: "dtmDate", displayName: "일자" },
    { field: "lngNMenuCnt", displayName: "정상건수" },
    { field: "lngGMenuCnt", displayName: "증정건수" },
    { field: "lngMenuCnt", displayName: "총건수" },
    { field: "lngSalAmt", displayName: "총매출액" },
    { field: "lngGAmount", displayName: "증정금액" },
    { field: "lngDCAmt", displayName: "할인액" },
    { field: "lngActAmt", displayName: "실매출액" },
    { field: "lngNetAmt", displayName: "순매출액" },
    { field: "lngSalCnt", displayName: "할인건수" },
    { field: "dblPreWeek", displayName: "전주비" },
    { field: "dblPreYear", displayName: "전년비" },
  ];
  if (hideColumnsId.value.includes("dtmDate")) {
    property = property.filter((item) => item.field !== "dtmDate");
  }
  if (hideColumnsId.value.includes("strStore")) {
    property = property.filter((item) => item.field !== "strStore");
  }
  if (hideColumnsId.value.includes("strMajor")) {
    property = property.filter((item) => item.field !== "strMajor");
  }
  if (hideColumnsId.value.includes("strSub")) {
    property = property.filter((item) => item.field !== "strSub");
  }
  printJS({
    printable: convert, // JSON 배열
    properties: property,
    type: "json",
    header: `
  <div style="display: flex; justify-content: space-between; font-size: 24px; font-weight: bold; margin-bottom: 10px;">
    <div>메뉴군별 매출 현황2</div>
    <div> ${selectedExcelStore.value}</div>
  </div>
`,
    style: `.header { font-weight: bold;  font-size: 16px;  } @page {
    size: portrait;
  }  th {
    font-size: 16px;  /* 원하는 글자 크기 */
  }`,
  });
};

const selectedMenu = ref(null);

const subList = ref([]);
const mainMenu = ref([
  { lngCode: 0, strName: "전체" },
  { lngCode: 1, strName: "대그룹" },
  { lngCode: 2, strName: "서브그룹" },
  { lngCode: 3, strName: "메뉴코드" },
]);
watch(selectedMenu, async () => {
  const res = await getTableSearchCondition(
    selectedGroup.value,
    selectedStores.value,
    selectedMenu.value
  );
  subList.value = res.data.SUBLIST;
  //comsole.log(subList.value);
  selectedsubMenu.value = null;
});

/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getTableSearchCondition(
    selectedGroup.value,
    selectedStores.value,
    selectedMenu.value
  );
  subList.value = res.data.SUBLIST;
});
// 구버전과 같이 대그룹·서브그룹·합계·셀병합 기본 체크 (그룹 열 표시)
const hideColumnsId = ref([
  "strStore",
  "dtmDate",
]);
/**
 * 소계(그룹 푸터) 행 보기 개선 — 이 화면 전용 (realgrid.vue 공통 동작은 그대로)
 *  - 메뉴명 칸에 "○○ 서브그룹 합계 / 대그룹 합계 / 매장 합계 / 일자 합계" 표시
 *  - 단계별 배경색·굵은 글씨, 단가 합계(의미 없는 값)는 비움
 */
const SLS0402_GROUP_NAME = {
  strStore: "매장 합계",
  strMajor: "대그룹 합계",
  strSub: "서브그룹 합계",
  dtmDate: "일자 합계",
};
/** 그리드에 실제로 넘긴 그룹 열 목록 (setGroupColumnId2 기준, 빈 값 제외) */
const sls0402GroupFields = () =>
  String(setGroupColumnId2.value || "")
    .split(",")
    .filter(Boolean);
const SLS0402_TEXT_COLS =["strStore", "strMajor", "strSub", "lngCode", "strMenu", "dtmDate"];
const sls0402GroupFieldOf = (group) => {
  const fields = sls0402GroupFields();
  const lv = Number(group?.level) || 0;
  return { field: fields[lv - 1] || "", rank: fields.length - lv };
};
const sls0402GroupValue = (grid, group, field) => {
  try {
    const dataRow = group?.firstItem?.dataRow;
    if (dataRow == null || dataRow < 0 || !field) return "";
    const v = grid.getDataSource().getValue(dataRow, field);
    if (v == null) return "";
    if (field === "dtmDate") {
      const d = v instanceof Date ? v : new Date(String(v).replace(" ", "T"));
      if (isNaN(d.getTime())) return String(v).slice(0, 10);
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      return `${d.getFullYear()}-${mm}-${dd}`;
    }
    return String(v);
  } catch (_) {
    return "";
  }
};
/**
 * 펼침 단계 — 조회 기준(그룹)별 접기·펼치기
 *  - 버튼은 마지막 조회에 적용된 그룹(매장·대그룹·서브그룹·일자) 순서대로 + "메뉴 전체"
 *  - "대그룹" = 대그룹 합계까지만, "서브그룹" = 서브그룹 합계까지, "메뉴 전체" = 모두 펼침
 */
const SLS0402_LEVEL_LABEL = {
  strStore: "매장",
  strMajor: "대그룹",
  strSub: "서브그룹",
  dtmDate: "일자",
};
const sls0402GridId = ref("");
const sls0402LoadedFields = ref([]);
const sls0402ActiveLevel = ref("all");
const sls0402LevelOptions = computed(() => {
  const fields = sls0402LoadedFields.value.length
    ? sls0402LoadedFields.value
    : setGroupFooter.value
    ? String(setGroupColumnId2.value || "").split(",").filter(Boolean)
    : [];
  return [
    ...fields.map((f, i) => ({
      key: f,
      label: SLS0402_LEVEL_LABEL[f] || f,
      depth: i,
      title: `${SLS0402_LEVEL_LABEL[f] || f} 합계까지만 보기`,
    })),
    { key: "all", label: "메뉴 전체", depth: fields.length, title: "메뉴까지 모두 펼치기" },
  ];
});
const sls0402LevelEnabled = computed(
  () =>
    sls0402LoadedFields.value.length > 0 &&
    Array.isArray(rowData.value) &&
    rowData.value.length > 0
);
const sls0402ExpandTo = (lv) => {
  const gv = rgGetInstance(sls0402GridId.value)?.gridView;
  if (!gv || !sls0402LevelEnabled.value) return;
  const total = sls0402LoadedFields.value.length;
  sls0402ByButton = true;
  try {
    if (lv.depth >= total) {
      gv.expandAll(true);
    } else {
      gv.collapseAll(true);
      if (lv.depth > 0) gv.expandAll(true, lv.depth);
    }
  } finally {
    sls0402ByButton = false;
  }
  sls0402ActiveLevel.value = lv.key;
};
/** 그리드의 ▽/▷로 직접 접거나 펴면 버튼 단계와 달라지므로 선택 표시 해제 */
let sls0402ByButton = false;
const sls0402WatchManualToggle = (gv) => {
  const clear = () => {
    if (!sls0402ByButton) sls0402ActiveLevel.value = "";
  };
  gv.onExpanded = clear;
  gv.onCollapsed = clear;
};

const onSls0402GridReady = (id) => {
  const gv = rgGetInstance(id)?.gridView;
  if (!gv) return;
  sls0402GridId.value = id;
  sls0402LoadedFields.value = setGroupFooter.value ? sls0402GroupFields() : [];
  sls0402ActiveLevel.value = "all";
  sls0402WatchManualToggle(gv);
  sls0402ApplyTotalRate(gv);
  if (!setGroupFooter.value) {
    gv.refresh();
    return;
  }
  const cols = gv.getColumns?.() || [];
  cols.forEach((c) => {
    const fieldName = c.fieldName;
    const col = gv.columnByField(fieldName);
    if (!col || !col.groupFooter) return;
    const align = SLS0402_TEXT_COLS.includes(fieldName)
      ? "setTextAlignLeft"
      : "setTextAlignRight";
    col.groupFooter.styleCallback = (grid, footer) => {
      // 합계 종류별 고정 색 (조회조건 조합이 바뀌어도 같은 합계는 같은 색)
      // styleCallback 의 footer.level 은 그룹 level + 1 (valueCallback 의 group.level 과 1 차이)
      const { field } = sls0402GroupFieldOf({ level: (Number(footer?.level) || 0) - 1 });
      return { styleName: `sls0402-gf sls0402-gf-${field || "etc"} ${align}` };
    };
    if (fieldName === "strMenu") {
      col.groupFooter.valueCallback = (grid, column, footerIndex, group) => {
        const { field } = sls0402GroupFieldOf(group);
        if (!field) return "소계";
        const name = sls0402GroupValue(grid, group, field);
        return `${name ? name + " " : ""}${SLS0402_GROUP_NAME[field] || "소계"}`;
      };
    } else if (SLS0402_GROUP_NAME[fieldName]) {
      // 그룹 열: 소계 단계와 그 위 단계 값만 표시, 아래 단계 칸은 비움
      col.groupFooter.valueCallback = (grid, column, footerIndex, group) => {
        const fields = sls0402GroupFields();
        const idx = fields.indexOf(fieldName);
        const lv = Number(group?.level) || 0;
        if (idx < 0 || idx > lv - 1) return "";
        return sls0402GroupValue(grid, group, fieldName);
      };
    } else if (fieldName === "lngCode" || fieldName === "lngPrice") {
      col.groupFooter.valueCallback = () => "";
    } else if (SLS0402_RATE_PRE[fieldName] && sls0402HasPreAmt()) {
      // 전주비·전년비 소계: 단순 평균이 아니라 (소계 금액 - 전기 금액) / 전기 금액
      col.groupFooter.valueCallback = (grid, column, footerIndex, group) => {
        const rows = sls0402RowsOfGroup(grid, group);
        return sls0402Rate(rows, SLS0402_RATE_PRE[fieldName]);
      };
    }
  });
  gv.refresh();
};

/**
 * 전주비·전년비 합계 계산 (프로시저 usp_VUE_slsGetMenuSales2_CON 과 같은 식)
 *  - 현재 금액: 순매출액(lngNetAmt = 프로시저의 a.lngActAmt), 전기 금액: lngPreWeekAmt / lngPreYearAmt
 *  - ASMX 가 전기 금액을 아직 안 주면(구버전 API) 기존 평균 표시를 그대로 둔다
 */
const SLS0402_RATE_PRE = { dblPreWeek: "lngPreWeekAmt", dblPreYear: "lngPreYearAmt" };
const sls0402HasPreAmt = () =>
  Array.isArray(rowData.value) &&
  rowData.value.length > 0 &&
  Object.prototype.hasOwnProperty.call(rowData.value[0], "lngPreWeekAmt");
const sls0402Num = (v) => {
  const n = Number(String(v ?? "").replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
};
const sls0402Rate = (rows, preField) => {
  let cur = 0;
  let pre = 0;
  rows.forEach((r) => {
    cur += sls0402Num(r.lngNetAmt);
    pre += sls0402Num(r[preField]);
  });
  let rate;
  if (cur > 0 && pre === 0) rate = 100;
  else if (cur < 0 && pre === 0) rate = -100;
  else if (cur === pre) rate = 0;
  else if (cur === 0) rate = -100;
  else rate = ((cur - pre) / pre) * 100;
  return Math.round(rate * 10) / 10;
};
const sls0402DateKey = (v) => {
  if (v == null || v === "") return "";
  const d = v instanceof Date ? v : new Date(String(v).replace(" ", "T"));
  if (isNaN(d.getTime())) return String(v).slice(0, 10);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
/** 소계 그룹에 속한 원본 행(rowData) — 그룹 단계까지의 그룹 열 값이 같은 행 */
const sls0402RowsOfGroup = (grid, group) => {
  const fields = sls0402GroupFields();
  const lv = Number(group?.level) || 0;
  const keys = fields.slice(0, lv);
  const dataRow = group?.firstItem?.dataRow;
  if (dataRow == null || dataRow < 0) return [];
  const ds = grid.getDataSource();
  const want = keys.map((f) => {
    const v = ds.getValue(dataRow, f);
    return f === "dtmDate" ? sls0402DateKey(v) : String(v ?? "");
  });
  return rowData.value.filter((r) =>
    keys.every((f, i) =>
      (f === "dtmDate" ? sls0402DateKey(r[f]) : String(r[f] ?? "")) === want[i]
    )
  );
};
/**
 * 일자별 조회 시 서브그룹 안을 "일자 → 메뉴" 순서로 정렬
 *  - 프로시저는 매장·대그룹·서브그룹·메뉴명·일자 순으로 주므로, 그대로 묶으면 같은 일자 합계가 메뉴마다 쪼개진다
 *  - 매장·대그룹·서브그룹 순서는 프로시저 순서(처음 나온 순서) 그대로, 그 안에서 일자 오름차순, 같은 일자 안은 원래(메뉴명) 순서
 */
const sls0402SortByDate = (list) => {
  if (!Array.isArray(list) || !checkedReportTypes.has(1)) return list;
  const groupOrder = new Map();
  const keyOf = (r) => `${r.strStore ?? ""}\u0001${r.strMajor ?? ""}\u0001${r.strSub ?? ""}`;
  list.forEach((r) => {
    const k = keyOf(r);
    if (!groupOrder.has(k)) groupOrder.set(k, groupOrder.size);
  });
  return list
    .map((r, i) => ({ r, i, g: groupOrder.get(keyOf(r)), d: sls0402DateKey(r.dtmDate) }))
    .sort((a, b) => a.g - b.g || (a.d < b.d ? -1 : a.d > b.d ? 1 : 0) || a.i - b.i)
    .map((x) => x.r);
};
/** 맨 아래 총합계(Σ) 행의 전주비·전년비 */
const sls0402ApplyTotalRate = (gv) => {
  if (!sls0402HasPreAmt()) return;
  Object.entries(SLS0402_RATE_PRE).forEach(([field, preField]) => {
    const col = gv.columnByField(field);
    if (!col || !col.footer) return;
    col.footer.valueCallback = () => sls0402Rate(rowData.value, preField);
  });
};
const checkedReportTypes = new Set([0, 3, 4]);
const checkedGift = ref(1);
const checkedlngPrice = ref(0);
const checkedlngPrint = ref(1);
const customOrder = ["strStore", "strMajor", "strSub", "dtmDate"];
const checking = (e) => {
  if (e.target.id == "store") {
    if (e.target.checked) {
      checkedReportTypes.add(2);
      hideColumnsId.value = hideColumnsId.value.filter(
        (item) => item !== "strStore"
      );
      setGroupColumnId.value.push("strStore");
      ConditionSet.add(0);
    } else {
      checkedReportTypes.delete(2);
      hideColumnsId.value.push("strStore");
      setGroupColumnId.value = setGroupColumnId.value.filter(
        (item) => item !== "strStore"
      );
      ConditionSet.delete(0);
    }
  } else if (e.target.id == "maingroup") {
    if (e.target.checked) {
      checkedReportTypes.add(3);
      ConditionSet.add(1);
      hideColumnsId.value = hideColumnsId.value.filter(
        (item) => item !== "strMajor"
      );
      setGroupColumnId.value.push("strMajor");
    } else {
      checkedReportTypes.delete(3);
      ConditionSet.delete(1);
      hideColumnsId.value.push("strMajor");
      setGroupColumnId.value = setGroupColumnId.value.filter(
        (item) => item !== "strMajor"
      );
    }
  } else if (e.target.id == "subgroup") {
    if (e.target.checked) {
      checkedReportTypes.add(4);
      ConditionSet.add(2);
      hideColumnsId.value = hideColumnsId.value.filter(
        (item) => item !== "strSub"
      );
      setGroupColumnId.value.push("strSub");
    } else {
      checkedReportTypes.delete(4);
      ConditionSet.delete(2);
      hideColumnsId.value.push("strSub");
      setGroupColumnId.value = setGroupColumnId.value.filter(
        (item) => item !== "strSub"
      );
    }
  } else if (e.target.id == "day") {
    if (e.target.checked) {
      checkedReportTypes.add(1);
      ConditionSet.add(3);
      hideColumnsId.value = hideColumnsId.value.filter(
        (item) => item !== "dtmDate"
      );
      setGroupColumnId.value.push("dtmDate");
      //setGroupColumnId.value.push('lngCode')
    } else {
      checkedReportTypes.delete(1);
      ConditionSet.delete(3);
      hideColumnsId.value.push("dtmDate");
      setGroupColumnId.value = setGroupColumnId.value.filter(
        (item) => item !== "dtmDate"
      );
      //setGroupColumnId.value = setGroupColumnId.value.filter(item => item !== 'lngCode');
    }
  } else if (e.target.id == "gift") {
    if (e.target.checked) {
      checkedGift.value = 1;
      hideColumnsId.value = hideColumnsId.value.filter(
        (item) => item !== "lngNMenuCnt" && item != "lngGMenuCnt"
      );
      ConditionSet.add(4);
    } else {
      checkedGift.value = 0;
      hideColumnsId.value.push("lngNMenuCnt");
      hideColumnsId.value.push("lngGMenuCnt");
      ConditionSet.delete(4);
    }
  } else if (e.target.id == "exception") {
    if (e.target.checked) {
      checkedlngPrice.value = 1;
      hideColumnsId.value.push("lngPrice");
      ConditionSet.add(5);
    } else {
      ConditionSet.delete(5);
      checkedlngPrice.value = 0;
      hideColumnsId.value = hideColumnsId.value.filter(
        (item) => item !== "lngPrice"
      );
    }
  } else if (e.target.id == "sum") {
    if (e.target.checked) {
      checkedlngPrint.value = 1;
      setGroupFooter.value = true;
      setGroupSumCustomLevel.value = 2;
      ConditionSet.add(6);
    } else {
      ConditionSet.delete(6);
      checkedlngPrint.value = 0;
      setGroupFooter.value = false;
      setGroupSumCustomLevel.value = 1;
    }
  } else if (e.target.id == "unite") {
    if (e.target.checked) {
      ConditionSet.add(7);
      setRowGroupSpan.value = "strStore,strMajor,strSub";
      checkedUnite.value = true;
      setGroupSumCustomLevel.value = 2;
    } else {
      ConditionSet.delete(7);
      setRowGroupSpan.value = "";
      checkedUnite.value = false;
      setGroupSumCustomLevel.value = 1;
    }

    reload.value = !reload.value;
  }
  setGroupColumnId.value.sort((a, b) => {
    // customOrder 배열에서 각 요소의 인덱스를 비교
    const indexA = customOrder.indexOf(a);
    const indexB = customOrder.indexOf(b);

    // 만약 배열에 없는 값이 있다면 -1이 반환되므로, 이를 처리해줍니다.
    if (indexA === -1 && indexB === -1) return 0; // 둘 다 없으면 순서 유지
    if (indexA === -1) return 1; // a가 없으면 뒤로 보냄
    if (indexB === -1) return -1; // b가 없으면 뒤로 보냄

    return indexA - indexB;
  });

  setGroupColumnId2.value = setGroupColumnId.value.join(",");
};
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
</script>

<style scoped>
.sls0402-search-panel {
  box-sizing: border-box;
  padding-top: 0.625rem;
  padding-bottom: 0.625rem;
  border: 1px solid #d5dbe3;
  padding-left: var(--sls0402-panel-pad-x, 2rem);
  padding-right: var(--sls0402-panel-pad-x, 2rem);
}

@media (min-width: 768px) {
  .sls0402-search-panel {
    --sls0402-panel-pad-x: 3rem;
  }
}

.sls0402-search-layout {
  /* 상단 2행: 기간·메뉴 | 매장명(중심 기준 확대) / 하단 2행: 조회·요일(좌측 열) */
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(32rem, 1.4fr);
  grid-template-rows: auto auto auto auto;
  column-gap: var(--sls0402-col-gutter, 1.25rem);
  row-gap: var(--sls0402-row-gap, 0.75rem);
  align-items: center;
  min-width: 0;
}

.sls0402-search-layout > .sls0402-row {
  grid-column: 1;
  min-width: 0;
}

.sls0402-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  min-height: 2rem;
}

.sls0402-lbl {
  box-sizing: border-box;
  flex: 0 0 var(--sls0402-label-col, 5.5rem);
  width: var(--sls0402-label-col, 5.5rem);
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

.sls0402-checks {
  flex: 1 1 auto;
  min-width: 0;
  gap: 0.35rem 0.85rem;
}

/* 조회조건 — 그리드 2열 폭 기준 */
.sls0402-checks--single {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-start;
  gap: 0.35rem 1rem;
  overflow: visible;
  min-width: 0;
  min-height: 2rem;
}

/* 요일조건 — 조회조건과 동일 열 폭, 공휴일 콤보 우측 끝 정렬 */
.sls0402-checks--days {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 0.35rem 1.25rem;
  overflow: visible;
  width: 100%;
  min-width: 0;
  min-height: 2rem;
}

.sls0402-check-label {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.9375rem;
  line-height: 1.25;
  font-weight: 400 !important;
  color: #1f2937;
  white-space: nowrap;
  cursor: pointer;
  flex-shrink: 0;
}

.sls0402-checks--single .sls0402-check-label {
  gap: 0.4rem;
}

.sls0402-check {
  width: 1rem;
  height: 1rem;
  margin: 0;
  accent-color: #2563eb;
  cursor: pointer;
}

.sls0402-date-slot {
  min-width: 0;
  flex: 1 1 auto;
}

.sls0402-date-slot :deep(> div.flex.justify-start.items-center) {
  margin: 0 !important;
  width: auto !important;
  max-width: 100%;
}

.sls0402-date-slot :deep(input[type="date"]) {
  box-sizing: border-box;
  height: 2rem !important;
  min-height: 2rem !important;
  padding: 0 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: rgb(55 65 81);
  border: 1px solid var(--sls0402-control-border, #cbd5e1) !important;
  border-radius: 0.375rem !important;
  background: #fff !important;
}

.sls0402-date-slot :deep(div.inline-flex.h-8),
.sls0402-date-slot :deep(button) {
  box-sizing: border-box;
  height: 2rem !important;
  min-height: 2rem !important;
}

.sls0402-menu-fields {
  display: flex;
  /* 줄바꿈하면 행 높이가 2배가 되므로 한 줄 유지, 콤보 폭만 줄어듦 */
  flex-wrap: nowrap;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  flex: 1 1 auto;
}

.sls0402-menu-item {
  box-sizing: border-box;
  flex: 0 1 11rem;
  width: 11rem;
  max-width: 11rem;
  min-width: 0;
  height: 2rem !important;
  min-height: 2rem !important;
}

/* 메뉴구분 2번째 콤보 — 1.3배 */
.sls0402-menu-item--wide {
  flex: 0 1 14.3rem;
  width: 14.3rem;
  max-width: 14.3rem;
}

/* 3행: 조회조건 — 전체 폭 */
.sls0402-search-layout > .sls0402-row--cond {
  grid-column: 1 / -1;
  grid-row: 3;
  /* 위: 검색 조건(기간·메뉴·매장) / 아래: 보기 옵션 — 얇은 구분선 */
  border-top: 1px solid #cfd6df;
  padding-top: 0.5rem;
}

/* 4행 왼쪽: 펼침 단계 */
.sls0402-search-layout > .sls0402-row--level {
  grid-column: 1;
  grid-row: 4;
}

/* 4행 오른쪽: 요일조건·공휴일 — 매장명 블록과 같은 시작선·폭 */
.sls0402-right-cond {
  grid-column: 2;
  grid-row: 4;
  justify-self: end;
  width: 90.25%;
  max-width: 90.25%;
  min-width: 0;
}

.sls0402-right-cond .sls0402-checks--days {
  flex: 1 1 auto;
  width: auto;
}

.sls0402-holiday {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
  padding-left: 1.5rem;
  flex-shrink: 0;
}

.sls0402-holiday-lbl {
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
  white-space: nowrap;
}

/* 펼침 단계 버튼 (선택 = 주황), 버튼 사이 › = 단계가 깊어지는 방향 */
.sls0402-level-btns {
  flex-wrap: wrap;
  gap: 0.35rem;
  min-height: 2rem;
}

.sls0402-level-sep {
  font-size: 1.125rem;
  line-height: 1;
  color: #94a3b8;
  user-select: none;
}

.sls0402-level-btn {
  box-sizing: border-box;
  height: 2rem;
  padding: 0 0.8rem;
  font-size: 0.875rem;
  line-height: 1;
  color: #334155;
  background: #fff;
  border: 1px solid var(--sls0402-control-border, #cbd5e1);
  border-radius: 0.375rem;
  white-space: nowrap;
  cursor: pointer;
}

/* 버튼 색 = 그 단계 합계 행 색 (그리드 .sls0402-gf-* 와 동일) */
.sls0402-level-btn--strSub:not(:disabled) {
  background: #e0ecfb;
  color: #1e3a8a;
}
.sls0402-level-btn--strMajor:not(:disabled) {
  background: #dcf2e3;
  color: #14532d;
}
.sls0402-level-btn--strStore:not(:disabled) {
  background: #ebe5f8;
  color: #3b0764;
}
.sls0402-level-btn--dtmDate:not(:disabled) {
  background: #eef0f3;
  color: #1f2937;
}

.sls0402-level-btn:hover:not(:disabled) {
  border-color: #f97316;
}

/* 선택 = 주황 테두리(배경은 단계 색 유지) */
.sls0402-level-btn.is-active:not(:disabled) {
  border: 2px solid #f97316;
  padding: 0 calc(0.8rem - 1px);
  font-weight: 700;
}

.sls0402-level-btn:disabled {
  color: #94a3b8;
  background: #f1f5f9;
  cursor: not-allowed;
}

.sls0402-sg-select {
  box-sizing: border-box;
  height: 2rem !important;
  min-height: 2rem !important;
  width: 6rem;
  padding: 0 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: rgb(55 65 81);
  border: 1px solid var(--sls0402-control-border, #cbd5e1);
  border-radius: 0.375rem;
  background: #fff;
  appearance: auto;
}

/* v-select (메뉴구분) — h-8 통일 */
.sls0402-search-panel :deep(.sls0402-vselect) {
  width: 100%;
  min-width: 0;
  height: 2rem !important;
  min-height: 2rem !important;
}

.sls0402-search-panel :deep(.sls0402-vselect .vs__dropdown-toggle) {
  box-sizing: border-box !important;
  display: flex !important;
  align-items: center !important;
  height: 2rem !important;
  min-height: 2rem !important;
  max-height: 2rem !important;
  padding: 0 0.5rem !important;
  border: 1px solid var(--sls0402-control-border, #cbd5e1) !important;
  border-radius: 0.375rem !important;
  background: #fff !important;
  box-shadow: none !important;
  overflow: hidden;
}

.sls0402-search-panel :deep(.sls0402-vselect .vs__selected-options) {
  display: flex !important;
  align-items: center !important;
  flex-wrap: nowrap !important;
  padding: 0 !important;
  margin: 0 !important;
  overflow: hidden;
  min-width: 0;
  min-height: 0 !important;
}

.sls0402-search-panel :deep(.sls0402-vselect .vs__selected),
.sls0402-search-panel :deep(.sls0402-vselect .vs__placeholder) {
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

.sls0402-search-panel :deep(.sls0402-vselect .vs__search),
.sls0402-search-panel :deep(.sls0402-vselect .vs__search input) {
  margin: 0 !important;
  padding: 0 !important;
  height: 1.25rem !important;
  min-height: 0 !important;
  line-height: 1.25rem !important;
  font-size: 0.875rem !important;
}

.sls0402-search-panel :deep(.sls0402-vselect .vs__actions) {
  padding: 0 0 0 0.25rem !important;
  align-items: center !important;
}

.sls0402-right-store {
  position: relative;
  z-index: 1;
  grid-column: 2;
  grid-row: 1 / span 2;
  align-self: stretch;
  justify-self: end;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  width: 90.25%; /* 현재(95%)의 95% */
  max-width: 90.25%;
  min-width: 0;
  overflow: visible;
}

.sls0402-right-store:has(.psp-popup),
.sls0402-right-store:has(.psp-store-hover-list) {
  z-index: 50;
}

.sls0402-right-store :deep(.psp-root) {
  grid-template-columns:
    var(--psp-label-w, 5.5rem)
    minmax(var(--psp-radio-w, 4.75rem), auto)
    minmax(7rem, 1.05fr)
    minmax(9.5rem, 1.3fr)
    minmax(9.5rem, 1.35fr);
  column-gap: var(--psp-col-gap, 0.5rem);
  row-gap: 0.5rem;
  width: 100%;
  max-width: 100%;
  min-width: 0;
}

.sls0402-right-store :deep(.psp-label) {
  width: var(--psp-label-w, 5.5rem);
  justify-content: center;
  padding-inline-start: 0;
  font-size: 1rem !important;
  font-weight: 600 !important;
  line-height: 1.25;
  color: rgb(17 24 39);
}

/* 매장 콤보/트리거 — 기간·메뉴·공휴일과 동일 h-8 */
.sls0402-right-store :deep(.psp-select),
.sls0402-right-store :deep(.psp-store-trigger),
.sls0402-right-store :deep(.psp-collapse-btn) {
  box-sizing: border-box !important;
  height: 2rem !important;
  min-height: 2rem !important;
  max-height: 2rem !important;
  font-size: 0.875rem !important;
  line-height: 1.25rem !important;
  border-radius: 0.375rem !important;
}

.sls0402-right-store :deep(.psp-select) {
  color: rgb(55 65 81) !important;
  border: 1px solid var(--sls0402-control-border, #cbd5e1) !important;
  background: #fff !important;
  padding: 0 0.5rem !important;
}

.sls0402-right-store :deep(.psp-collapse-btn) {
  width: 2rem !important;
  padding: 0 !important;
}

.sls0402-right-store :deep(.psp-popup) {
  z-index: 60;
  right: 0;
  left: auto;
  width: min(42rem, 92vw);
  min-width: 28rem;
  max-width: min(42rem, 92vw);
}

@media (max-width: 1280px) {
  .sls0402-search-layout {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: none;
    row-gap: var(--sls0402-row-gap, 0.75rem);
  }

  .sls0402-search-layout > .sls0402-row {
    grid-column: 1;
    grid-row: auto;
    width: 100%;
    max-width: 100%;
  }

  .sls0402-checks--single {
    width: auto;
    max-width: 100%;
  }

  /* 좁은 화면: 조회·요일 체크가 패널 밖으로 잘리지 않게 줄바꿈 */
  .sls0402-checks--single,
  .sls0402-checks--days {
    flex-wrap: wrap;
  }

  .sls0402-right-cond {
    grid-column: 1;
    grid-row: auto;
    width: 100%;
    max-width: 100%;
    justify-self: stretch;
  }

  .sls0402-right-store {
    grid-column: 1;
    grid-row: auto;
    width: 100%;
    max-width: 100%;
    justify-self: stretch;
  }

  .sls0402-right-store :deep(.psp-popup) {
    left: 0;
    right: auto;
  }
}
</style>

<style>
/* SLS04_002RPT 소계 행 (단계: 0=가장 안쪽 그룹, 숫자가 클수록 바깥 그룹) */
.sls0402-gf {
  font-weight: 700;
  color: #1f2937;
  border-top: 1px solid #94a3b8 !important;
}
/* 서브그룹 합계 — 연한 파랑 */
.sls0402-gf-strSub {
  background: #e0ecfb;
  color: #1e3a8a;
}
/* 대그룹 합계 — 연한 초록 */
.sls0402-gf-strMajor {
  background: #dcf2e3;
  color: #14532d;
}
/* 매장 합계 — 연한 보라 */
.sls0402-gf-strStore {
  background: #ebe5f8;
  color: #3b0764;
}
/* 일자 합계 — 연한 회색 */
.sls0402-gf-dtmDate,
.sls0402-gf-etc {
  background: #eef0f3;
  color: #1f2937;
}

@media print {
  body * {
    visibility: hidden; /* 모든 요소 숨기기 */
  }

  #print-area,
  #print-area * {
    visibility: visible !important; /* print-area 영역만 보이게 */
  }

  #print-area2,
  #print-area2 * {
    visibility: visible !important; /* print-area2도 보이게 */
  }

  /* @page는 페이지 크기와 방향을 설정 */
  @page {
    size: A4 landscape; /* A4 크기, 가로 방향으로 설정 */
    margin: 5%; /* 여백을 없앰 */
  }

  #print-area,
  #print-area2 {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%; /* 가로 폭을 페이지에 맞춤 */
    height: 80%; /* 세로를 페이지에 맞춤 */
    transform-origin: 0 0; /* 왼쪽 상단에서 크기 축소 */
    zoom: 0.55;
  }
}

/* 차트 팝업 — 제목 줄로 이동 (위치·크기는 chartPop.style) */
.sls0402-chart-overlay {
  position: fixed;
  inset: 0;
  z-index: 10050;
  background: rgb(0 0 0 / 0.45);
  box-sizing: border-box;
}

.sls0402-chart-dialog {
  z-index: 1;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  border: 1px solid rgb(203 213 225);
  border-radius: 0.5rem;
  background: #fff;
  box-shadow: 0 20px 40px rgb(15 23 42 / 0.18);
}

.sls0402-chart-head {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid rgb(226 232 240);
  background: rgb(248 250 252);
  cursor: move;
  user-select: none;
}

.sls0402-chart-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: rgb(17 24 39);
  white-space: nowrap;
}

.sls0402-chart-actions {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 0.5rem;
}

.sls0402-chart-toolbar {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid rgb(226 232 240);
  background: rgb(243 244 246);
}

.sls0402-chart-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 0.75rem;
  min-height: 2rem;
}

.sls0402-chart-lbl {
  flex: 0 0 5.5rem;
  width: 5.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: rgb(17 24 39);
  white-space: nowrap;
}

.sls0402-chart-radios {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem 0.85rem;
  min-width: 0;
}

.sls0402-chart-radio {
  display: inline-flex;
  align-items: center;
  gap: 0.28rem;
  font-size: 0.875rem;
  color: rgb(31 41 55);
  white-space: nowrap;
  cursor: pointer;
}

.sls0402-chart-radio input {
  margin: 0;
}

.sls0402-chart-body {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  min-height: 0;
  min-width: 0;
  overflow: hidden;
  padding: 0.75rem 1rem 1rem;
  background: #fff;
}

/* Chart.js maintainAspectRatio:false → 부모 높이 필수. height:auto 금지 */
.sls0402-chart-canvas {
  flex: 1 1 auto;
  display: block;
  width: 100% !important;
  max-width: 100%;
  min-height: 28rem;
  height: 100% !important;
  background: #fff;
}
</style>
