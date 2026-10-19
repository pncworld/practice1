/*--############################################################################
# Filename : SLS06_002RPT.vue                                                  
# Description : 매출관리 > 기간별 매출 현황 >시간대별 매출 현황.                
# Date :2025-05-14                                                             
# Author : 권맑음                     
################################################################################*/
<template>
  <div class="flex h-full min-h-0 flex-col pl-5" @click="handleParentClick">
    <div
      class="flex w-full shrink-0 items-center justify-between overflow-y-hidden">
      <PageName></PageName>
      <div class="mr-9 flex justify-center space-x-2 pr-5">
        <button @click="chartButton" class="button chart md:w-auto w-14">
          차트
        </button>
        <button @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <button @click="excelButton" class="button save w-auto excel">
          엑셀
        </button>
      </div>
    </div>

    <div
      class="sls0602-search-panel z-10 mt-3 w-full min-h-0 shrink-0 overflow-visible rounded-lg bg-gray-200"
      :style="{
        '--sls0602-panel-pad-x': '2rem',
        '--sls0602-control-border': sls0602ControlBorder,
        '--sls0602-col-gutter': sls0602ColGutter,
        '--sls0602-row-gap': sls0602RowGap,
        '--sls0602-label-col': sls0602LabelCol,
      }">
      <div class="sls0602-search-layout min-w-0">
        <!-- 좌: 기간 / 시간대 / 요일조건 — 기간 달력 끝선 = 시간대 3콤보 끝선 (2:2:2) -->
        <div class="sls0602-left-stack min-w-0">
          <div class="sls0602-left-grid min-w-0">
            <span class="sls0602-lbl">기간</span>
            <div class="sls0602-period-track">
              <Datepicker2
                ref="datepicker"
                omit-main-label
                filter-bar-align
                :initToday="1"
                :mainName="'기간'"
                :closePopUp="closePopUp"
                @startDate="startDate"
                @endDate="endDate"
                @excelDate="excelDate" />
            </div>
            <div class="sls0602-left-extra" aria-hidden="true"></div>

            <span class="sls0602-lbl">시간대</span>
            <div class="sls0602-time-combos">
              <select class="sls0602-select" v-model="orderPay">
                <option :value="1">주문</option>
                <option :value="2">계산</option>
              </select>
              <v-select
                v-model="startTime"
                :options="times"
                label="strName"
                class="custom-select2 sls0602-vselect"
                :reduce="(item) => (item != null ? item.value : null)"
                :clearable="true"
                @click="resetVselect" />
              <span class="sls0602-tilde">~</span>
              <v-select
                v-model="endTime"
                :options="times"
                label="strName"
                class="custom-select2 sls0602-vselect"
                :reduce="(item) => (item != null ? item.value : null)"
                :clearable="true"
                @click="resetVselect2" />
            </div>
            <label class="sls0602-check sls0602-salamt-check" for="showSalAmt">
              <input
                type="checkbox"
                id="showSalAmt"
                @change="changecheckedBefore" />
              할인전 매출액
            </label>

            <span class="sls0602-lbl">요일조건</span>
            <div class="sls0602-check-row">
              <label class="sls0602-check" for="mon">
                <input type="checkbox" id="mon" :value="2" checked @change="checkit" />월
              </label>
              <label class="sls0602-check" for="tue">
                <input type="checkbox" id="tue" :value="3" checked @change="checkit" />화
              </label>
              <label class="sls0602-check" for="wed">
                <input type="checkbox" id="wed" :value="4" checked @change="checkit" />수
              </label>
              <label class="sls0602-check" for="thu">
                <input type="checkbox" id="thu" :value="5" checked @change="checkit" />목
              </label>
              <label class="sls0602-check" for="fri">
                <input type="checkbox" id="fri" :value="6" checked @change="checkit" />금
              </label>
              <label class="sls0602-check" for="sat">
                <input type="checkbox" id="sat" :value="7" checked @change="checkit" />토
              </label>
              <label class="sls0602-check" for="sun">
                <input type="checkbox" id="sun" :value="1" checked @change="checkit" />일
              </label>
            </div>
          </div>
        </div>

        <!-- 우: 매장 + 조회조건(일자별/매장별) — 요일조건 옆·매장명 아래 -->
        <div class="sls0602-right-store min-w-0 overflow-visible">
          <PickStoreSingle2
            @lngStoreCode="lngStoreCodes"
            @lngStoreGroup="lngStoreGroup"
            @excelStore="excelStore"
            @lngStoreAttrs="lngStoreAttrs"
            @lngStoreTeam="lngStoreTeam"
            @lngSupervisor="lngSupervisor" />
          <div class="sls0602-report-cond">
            <span class="sls0602-lbl sls0602-report-cond__lbl">조회조건</span>
            <div class="sls0602-report-cond__checks">
              <label class="sls0602-check" for="sls0602-daily">
                <input
                  type="checkbox"
                  id="sls0602-daily"
                  :checked="tempSeeDaily"
                  @change="seeDaily" />
                일자별
              </label>
              <label class="sls0602-check" for="sls0602-store">
                <input
                  type="checkbox"
                  id="sls0602-store"
                  :checked="tempSeeStore"
                  @change="seeStore" />
                매장별
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-2 flex min-h-0 min-w-0 flex-1 flex-col">
      <div class="sls0602-grid relative min-h-0 w-full flex-1">
        <Realgrid
          class="h-full min-h-0 w-full"
          :progname="'SLS06_002RPT_VUE'"
          :progid="progId"
          :rowData="rowData"
          :reload="reload"
          :setFooter="true"
          :setGroupFooter="setGroupFooter"
          :setFooterExpressions="setFooterExpressions"
          :setFooterColID="setFooterColID"
          :setGroupFooterExpressions="setGroupFooterExpressions"
          :setGroupFooterColID="setGroupFooterColID"
          :setGroupColumnId="setGroupColumnId"
          :setGroupSumCustomText="['소계']"
          :setGroupSumCustomColumnId="setGroupSumCustomColumnId"
          :setGroupCustomLevel="1"
          :setRowGroupSpan="setRowGroupSpan"
          :setGroupSummaryCenterIds="setGroupSummaryCenterIds"
          row-group-collapsed-adornments="footer"
          :row-group-hide-expander="true"
          :ExcelNm="'시간대별 매출 현황.'"
          :exporttoExcel="exportExcel"
          :hideColumn="'lngSalAmt'"
          :hideColumnNow="hideColumnNow"
          :hideColumnsId="hideColumnsId"
          :documentTitle="'SLS06_002RPT'"
          :rowStateeditable="false"
          :documentSubTitle="documentSubTitle" />
      </div>
    </div>

    <Teleport to="body">
      <div
        v-show="byRadioButton"
        class="sls0602-chart-overlay"
        @mousedown.self="closeButton2">
        <div
          class="sls0602-chart-dialog"
          :style="chartPop.style"
          role="dialog"
          aria-modal="true"
          @mousedown.stop>
          <div class="sls0602-chart-head" @mousedown="onChartHeadDown">
            <h2 class="sls0602-chart-title">시간대별 매출현황</h2>
            <div class="sls0602-chart-actions" @mousedown.stop>
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

          <div class="sls0602-chart-toolbar">
            <div class="sls0602-chart-row">
              <span class="sls0602-chart-lbl">데이터 선택</span>
              <div class="sls0602-chart-radios">
                <label class="sls0602-chart-radio" for="first">
                  <input type="radio" id="first" name="option" v-model="selectOption" :value="1" />객수
                </label>
                <label class="sls0602-chart-radio" for="second">
                  <input type="radio" id="second" name="option" v-model="selectOption" :value="2" />객단가
                </label>
                <label class="sls0602-chart-radio" for="third">
                  <input type="radio" id="third" name="option" v-model="selectOption" :value="3" />조수
                </label>
                <label class="sls0602-chart-radio" for="fourth">
                  <input type="radio" id="fourth" name="option" v-model="selectOption" :value="4" />조단가
                </label>
                <label class="sls0602-chart-radio" for="fifth">
                  <input type="radio" id="fifth" name="option" v-model="selectOption" :value="5" />총매출액
                </label>
                <label class="sls0602-chart-radio" for="sixth">
                  <input type="radio" id="sixth" name="option" v-model="selectOption" :value="6" />실매출액
                </label>
                <label class="sls0602-chart-radio" for="seventh">
                  <input type="radio" id="seventh" name="option" v-model="selectOption" :value="7" />순매출액
                </label>
              </div>
            </div>
            <div class="sls0602-chart-row">
              <span class="sls0602-chart-lbl">차트 유형</span>
              <div class="sls0602-chart-radios">
                <label class="sls0602-chart-radio" for="graph1">
                  <input type="radio" id="graph1" name="option2" v-model="selectOption2" :value="1" />꺽은선 그래프
                </label>
                <label class="sls0602-chart-radio" for="graph2">
                  <input type="radio" id="graph2" name="option2" v-model="selectOption2" :value="2" />막대 그래프
                </label>
                <label class="sls0602-chart-radio" for="graph3">
                  <input type="radio" id="graph3" name="option2" v-model="selectOption2" :value="3" />원형 그래프
                </label>
              </div>
            </div>
          </div>

          <div class="sls0602-chart-body">
            <Chart
              class="sls0602-chart-canvas"
              :type="type"
              :labels="labels"
              :label="label"
              :showLegend="type === 'pie'"
              :pie-slice-label="type === 'pie'"
              :changePieData="true"
              :datas="datas"
              :chartName="'시간대별 매출현황'"
              :colors="colors" />
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { getTimeSalesReport } from "@/api/misales";
import Chart from "@/components/chart.vue";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

import Datepicker2 from "@/components/Datepicker2.vue";
/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";

/**
 *  매장  단일 선택 컴포넌트
 *  */

import PickStoreSingle2 from "@/components/pickStoreSingle.vue";
/**
 * 	그리드 생성
 */

import Realgrid from "@/components/realgrid.vue";
/**
 *  페이지로그 자동 입력
 *  */

import { insertPageLog } from "@/customFunc/customFunc";
import { useFloatPopup } from "@/utils/floatPopup";
/*
 * 공통 표준  Function
 */

import { onMounted, ref, watch } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";

/** 조회 AREA — SLS06_001 / SLS02_023 패턴 */
const sls0602ControlBorder = "#cbd5e1";
const sls0602ColGutter = "1.25rem";
const sls0602RowGap = "0.875rem";
const sls0602LabelCol = "5.5rem";

/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
});

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
const times = ref([
  { value: 0, strName: "00:00" },
  { value: 1, strName: "01:00" },
  { value: 2, strName: "02:00" },
  { value: 3, strName: "03:00" },
  { value: 4, strName: "04:00" },
  { value: 5, strName: "05:00" },
  { value: 6, strName: "06:00" },
  { value: 7, strName: "07:00" },
  { value: 8, strName: "08:00" },
  { value: 9, strName: "09:00" },
  { value: 10, strName: "10:00" },
  { value: 11, strName: "11:00" },
  { value: 12, strName: "12:00" },
  { value: 13, strName: "13:00" },
  { value: 14, strName: "14:00" },
  { value: 15, strName: "15:00" },
  { value: 16, strName: "16:00" },
  { value: 17, strName: "17:00" },
  { value: 18, strName: "18:00" },
  { value: 19, strName: "19:00" },
  { value: 20, strName: "20:00" },
  { value: 21, strName: "21:00" },
  { value: 22, strName: "22:00" },
  { value: 23, strName: "23:00" },
]);

const orderPay = ref(1);
const setFooterColID = ref([
  "lngRecCnt",
  "lngRecAmt",
  "lngCustCnt",
  "lngCustAmt",
  "lngSalAmt",
  "lngDiscount",
  "lngActAmt",
  "lngVAT",
  "lngSupplyAmt",
  "dblDistRate",
  "lngTotAmt",
  "dtmDate",
]);
const setFooterExpressions = ref([
  "sum",
  "avg",
  "sum",
  "avg",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "custom",
]);
const setGroupFooterColID = ref([
  "lngRecCnt",
  "lngRecAmt",
  "lngCustCnt",
  "lngCustAmt",
  "lngSalAmt",
  "lngDiscount",
  "lngActAmt",
  "lngVAT",
  "lngSupplyAmt",
  "dblDistRate",
  "lngTotAmt",
  /* dtmDate 제외 — 소계 행에 그룹 첫 날짜가 찍히던 문제 */
]);
const setGroupFooterExpressions = ref([
  "sum",
  "avg",
  "sum",
  "avg",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
]);
/** 구 REPORT_TYPE: 0 / 1(일자별) / 2(매장별) / 12(둘 다) — 기본 매장별만 */
const tempSeeDaily = ref(false);
const tempSeeStore = ref(true);
const reportCheckData = ref("2");
const setGroupFooter = ref(true);
const setGroupColumnId = ref("strStore");
const setGroupSumCustomColumnId = ref(["strTime"]);
const setGroupSummaryCenterIds = ref("strTime");
const setRowGroupSpan = ref("");
/**
 * SLS06_002는 mstGridInfo lngGridID=1 기준으로 운용.
 * 서브SUM(소계 행) + 누계열 병합은 그룹 설정으로 처리 (구 REPORT_TYPE 12와 동일).
 */
const progId = ref("1");
/** 조회조건에 없는 차원 컬럼 숨김 (기본: 매장별 → 날짜만 숨김) */
const hideColumnsId = ref(["dtmDate"]);

const seeDaily = (e) => {
  tempSeeDaily.value = e.target.checked;
  updateReportType();
  clearGridOnReportCondChange();
};

const seeStore = (e) => {
  tempSeeStore.value = e.target.checked;
  updateReportType();
  clearGridOnReportCondChange();
};

/** 조회조건(일자별/매장별) 변경 시 이전 조회 결과 비움 */
const clearGridOnReportCondChange = () => {
  initGrid();
  afterSearch.value = false;
  reload.value = !reload.value;
};

/** REPORT_TYPE·그룹·소계·누계병합·컬럼표시 */
const updateReportType = () => {
  if (tempSeeDaily.value && tempSeeStore.value) {
    /* 구 스크린샷: 매장+시간대 그룹, 시간대 소계, 누계열 병합 */
    reportCheckData.value = "12";
    setGroupFooter.value = true;
    setGroupColumnId.value = "strStore,strTime";
    setGroupSumCustomColumnId.value = ["strTime"];
    setGroupSummaryCenterIds.value = "strTime";
    setRowGroupSpan.value = "lngCustTotCnt,lngRecTotCnt,lngAccTotAmt";
    hideColumnsId.value = [];
  } else if (tempSeeDaily.value) {
    reportCheckData.value = "1";
    setGroupFooter.value = true;
    setGroupColumnId.value = "strTime";
    setGroupSumCustomColumnId.value = ["strTime"];
    setGroupSummaryCenterIds.value = "strTime";
    setRowGroupSpan.value = "lngCustTotCnt,lngRecTotCnt,lngAccTotAmt";
    hideColumnsId.value = ["strStore"];
  } else if (tempSeeStore.value) {
    /* 매장별 샘플: 날짜 숨김, 매장 그룹, 소계 문구는 시간대 열 */
    reportCheckData.value = "2";
    setGroupFooter.value = true;
    setGroupColumnId.value = "strStore";
    setGroupSumCustomColumnId.value = ["strTime"];
    setGroupSummaryCenterIds.value = "strTime";
    setRowGroupSpan.value = "";
    hideColumnsId.value = ["dtmDate"];
  } else {
    /* 미선택: 매장·날짜·누계열 숨김 → 남은 열이 그리드 폭을 채움 */
    reportCheckData.value = "0";
    setGroupFooter.value = false;
    setGroupColumnId.value = "";
    setGroupSumCustomColumnId.value = [];
    setGroupSummaryCenterIds.value = " ";
    setRowGroupSpan.value = "";
    hideColumnsId.value = [
      "strStore",
      "dtmDate",
      "lngCustTotCnt",
      "lngRecTotCnt",
      "lngAccTotAmt",
    ];
  }
};

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);
const selectedstartDate = ref();
const selectedendDate = ref();
const hideColumnNow = ref(true);
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
const startTime = ref(0);
const endTime = ref(23);
const tempSeeDetail = ref(1);

const store = useStore();
//comsole.log(store.state); // 여기서 한번 확인
//comsole.log(store.state.lngStoreGroup); // 여기서도 확인
const loginedstrLang = store.state.userData.lngLanguage;
/**
 *  조회 함수
 */

const searchButton = async () => {
  store.state.loading = true;
  try {
    initGrid();
    reload.value = !reload.value;

    const sendcheckedDay = [...checkedDay];

    const res = await getTimeSalesReport(
      selectedGroup.value,
      selectedStoreAttrs.value,
      selectedStoreTeam.value,
      selectedStoreSuperVisor.value,
      selectedStores.value,
      selectedstartDate.value,
      selectedendDate.value,
      reportCheckData.value,
      startTime.value,
      endTime.value,
      orderPay.value,
      sendcheckedDay.join(",")
    );
    //comsole.log(res);
    rowData.value = res.data.TIMESALE;

    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
  } finally {
    store.state.loading = false;
  }
};

const datas = ref([]);
const selectOption = ref(1);
const selectOption2 = ref(1);
const labels = ref([]);
const label = ref([]);
const type = ref("line");

/** 객수 + 꺽은선 기본값, 이전 차트 데이터 제거 */
const resetChartPopup = () => {
  selectOption.value = 1;
  selectOption2.value = 1;
  type.value = "line";
  datas.value = [];
  labels.value = [];
  label.value = [];
};

const closeButton2 = () => {
  byRadioButton.value = false;
  resetChartPopup();
};

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
/** 시간대 시리즈 — labels와 datas 순서를 맞춰 원형 그래프에도 시간대가 붙게 함 */
const applyTimeChartSeries = (rows, valueKey) => {
  const sorted = [...rows].sort(
    (a, b) =>
      Number(String(a.strTime).split(":")[0]) -
      Number(String(b.strTime).split(":")[0])
  );
  labels.value = sorted.map((item) => item.strTime);
  label.value = labels.value.slice();
  datas.value = [sorted.map((item) => item[valueKey])];
};

const aggregateByTime = (temp, valueKey) =>
  Object.values(
    temp.reduce((acc, cur) => {
      if (!acc[cur.strTime]) {
        acc[cur.strTime] = {
          strTime: cur.strTime,
          [valueKey]: Number(cur[valueKey]) || 0,
        };
      } else {
        acc[cur.strTime][valueKey] += Number(cur[valueKey]) || 0;
      }
      return acc;
    }, {})
  )
    .sort((a, b) => b[valueKey] - a[valueKey])
    .slice(0, 30);

/**
 *  조회 함수
 */

const searchButton2 = async () => {
  store.state.loading = true;
  try {
    const sendcheckedDay = [...checkedDay];

    const res = await getTimeSalesReport(
      selectedGroup.value,
      selectedStoreAttrs.value,
      selectedStoreTeam.value,
      selectedStoreSuperVisor.value,
      selectedStores.value,
      selectedstartDate.value,
      selectedendDate.value,
      reportCheckData.value,
      startTime.value,
      endTime.value,
      orderPay.value,
      sendcheckedDay.join(",")
    );
    const temp = res.data.TIMESALE || [];
    const valueKeyByOption = {
      1: "lngCustCnt",
      2: "lngCustAmt",
      3: "lngRecCnt",
      4: "lngRecAmt",
      5: "lngSalAmt",
      6: "lngTotAmt",
      7: "lngSupplyAmt",
    };
    const valueKey = valueKeyByOption[selectOption.value] || "lngCustCnt";
    applyTimeChartSeries(aggregateByTime(temp, valueKey), valueKey);

    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
  } finally {
    store.state.loading = false;
  }
};

const byRadioButton = ref(false);

/** 차트 팝업 — 제목 줄 드래그로 이동 (PUR08과 동일 유틸) */
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
 * 차트 버튼 — 열 때 객수·꺽은선으로 초기화 후 바로 조회
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

const selectedGroup = ref();
const selectedStores = ref();
const selectedStoreAttrs = ref();
const selectedStoreTeam = ref();
const selectedStoreSuperVisor = ref();
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

const lngStoreAttrs = (e) => {
  selectedStoreAttrs.value = e;
  //comsole.log(e);
};
/**
 * 페이지 매장 팀 세팅
 */

const lngStoreTeam = (e) => {
  selectedStoreTeam.value = e;
  //comsole.log(e);
};
/**
 * 페이지 매장 슈퍼바이저 세팅
 */

const lngSupervisor = (e) => {
  selectedStoreSuperVisor.value = e;
  //comsole.log(e);
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

//comsole.log(store.state.minorCategory);

/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  const order = orderPay.value == 1 ? "주문 " : "계산 ";
  const stime = times.value.filter((item) => item.value == startTime.value)[0]
    .strName;
  const etime = times.value.filter((item) => item.value == endTime.value)[0]
    .strName;
  const dayArray = Array.from(checkedDay)
    .sort((a, b) => a - b)
    .map((day) => dayMap[day])
    .join(",");
  documentSubTitle.value =
    selectedExcelDate.value +
    "\n" +
    selectedExcelStore.value +
    "\n" +
    "시간대 : " +
    order +
    stime +
    "~" +
    etime +
    "\n" +
    "요일조건 : " +
    dayArray +
    "\n" +
    "조회조건 : " +
    (tempSeeDaily.value ? "일자별 " : "") +
    (tempSeeStore.value ? "매장별" : "") +
    (!tempSeeDaily.value && !tempSeeStore.value ? "없음" : "");
  //comsole.log(documentSubTitle.value);
  exportExcel.value = !exportExcel.value;
};
const checkedDay = new Set([1, 2, 3, 4, 5, 6, 7]);
const dayMap = {
  1: "월",
  2: "화",
  3: "수",
  4: "목",
  5: "금",
  6: "토",
  7: "일",
};
const checkit = (e) => {
  //comsole.log(e);
  if (e.target.checked) {
    checkedDay.add(Number(e.target.value));
  } else {
    checkedDay.delete(Number(e.target.value));
  }
};
const changecheckedBefore = (e) => {
  if (e.target.checked) {
    hideColumnNow.value = false;
  } else {
    hideColumnNow.value = true;
  }
};

const resetVselect = () => {
  startTime.value = 0;
};
const resetVselect2 = () => {
  endTime.value = 23;
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
</script>

<style scoped>
.sls0602-search-panel {
  box-sizing: border-box;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  padding-left: var(--sls0602-panel-pad-x, 2rem);
  padding-right: var(--sls0602-panel-pad-x, 2rem);
}

@media (min-width: 768px) {
  .sls0602-search-panel {
    --sls0602-panel-pad-x: 3rem;
  }
}

.sls0602-search-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);
  column-gap: var(--sls0602-col-gutter, 1.25rem);
  align-items: start;
  min-width: 0;
}

.sls0602-left-stack {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  min-width: 0;
  width: 100%;
  max-width: 100%;
}

/* col2 = 기간 Datepicker(달력 아이콘 끝) 폭 → 시간대 3콤보가 동일 폭으로 맞춤 */
.sls0602-left-grid {
  display: grid;
  grid-template-columns:
    var(--sls0602-label-col, 5.5rem)
    max-content
    auto;
  column-gap: 0.5rem;
  row-gap: var(--sls0602-row-gap, 0.875rem);
  align-items: center;
  min-width: 0;
  width: max-content;
  max-width: 100%;
}

.sls0602-lbl {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 2rem;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
  text-align: center;
  white-space: nowrap;
}

.sls0602-period-track {
  grid-column: 2;
  width: max-content;
  max-width: 100%;
  min-width: 0;
}

.sls0602-period-track :deep(> div.flex.justify-start.items-center) {
  margin: 0 !important;
  width: auto !important;
  max-width: 100%;
}

.sls0602-period-track :deep(input[type="date"]) {
  box-sizing: border-box;
  height: 2rem;
  min-height: 2rem;
  max-height: 2rem;
  border: 1px solid var(--sls0602-control-border, #cbd5e1);
  border-radius: 0.375rem;
  background: #fff;
}

.sls0602-period-track :deep(div.inline-flex.h-8),
.sls0602-period-track :deep(button) {
  height: 2rem !important;
  min-height: 2rem !important;
}

.sls0602-left-extra {
  grid-column: 3;
  min-width: 0;
}

/* 주문·시작·종료 = 2:2:2, 끝선 = 기간 달력 아이콘 끝
   width:0 + min-width:100% → col2 폭(기간)에만 맞추고 자체 max-content로 열을 안 넓힘 */
.sls0602-time-combos {
  grid-column: 2;
  box-sizing: border-box;
  display: grid;
  grid-template-columns:
    minmax(0, 2fr)
    minmax(0, 2fr)
    auto
    minmax(0, 2fr);
  column-gap: 0.25rem;
  align-items: center;
  width: 0;
  min-width: 100%;
  min-height: 2rem;
}

.sls0602-select {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  height: 2rem;
  min-height: 2rem;
  max-height: 2rem;
  padding: 0 0.35rem;
  border: 1px solid var(--sls0602-control-border, #cbd5e1);
  border-radius: 0.375rem;
  background: #fff;
  font-size: 0.875rem;
  color: rgb(55 65 81);
}

.sls0602-tilde {
  flex: 0 0 auto;
  padding: 0 0.15rem;
  color: rgb(55 65 81);
  line-height: 2rem;
}

.sls0602-salamt-check {
  grid-column: 3;
  justify-self: start;
  justify-content: flex-start;
}

.sls0602-search-panel :deep(.sls0602-vselect) {
  width: 100%;
  min-width: 0;
  height: 2rem;
  min-height: 2rem;
}

.sls0602-search-panel :deep(.sls0602-vselect .vs__dropdown-toggle) {
  box-sizing: border-box;
  height: 2rem !important;
  min-height: 2rem !important;
  padding: 0 0.5rem !important;
  border: 1px solid var(--sls0602-control-border, #cbd5e1) !important;
  border-radius: 0.375rem !important;
  background: #fff !important;
  overflow: hidden;
}

.sls0602-search-panel :deep(.sls0602-vselect .vs__selected-options) {
  display: flex;
  align-items: center;
  flex-wrap: nowrap !important;
  padding: 0 !important;
  margin: 0 !important;
  overflow: hidden;
  min-width: 0;
}

.sls0602-search-panel :deep(.sls0602-vselect .vs__selected),
.sls0602-search-panel :deep(.sls0602-vselect .vs__placeholder) {
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
}

.sls0602-search-panel :deep(.sls0602-vselect .vs__search) {
  margin: 0 !important;
  padding: 0 !important;
  font-size: 0.875rem !important;
}

.sls0602-search-panel :deep(.sls0602-vselect .vs__actions) {
  padding: 0 0 0 0.25rem !important;
}

/* 월~일: 기간 트랙(col2) 안 7등분 — 요일별 칸 폭·간격 동일 */
.sls0602-check-row {
  grid-column: 2;
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  column-gap: 0.25rem;
  align-items: center;
  width: 0;
  min-width: 100%;
  min-height: 2rem;
}

.sls0602-check {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  min-width: 0;
  font-size: 0.875rem;
  font-weight: 400;
  color: rgb(17 24 39);
  white-space: nowrap;
  cursor: pointer;
}

.sls0602-check input {
  margin: 0;
  flex-shrink: 0;
}

.sls0602-right-store {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: var(--sls0602-row-gap, 0.875rem);
  width: 100%;
  max-width: 100%;
  min-width: 0;
  overflow: visible;
}

/* 매장명 아래 · 요일조건 옆 — 조회조건(일자별/매장별) */
.sls0602-report-cond {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  min-height: 2rem;
}

.sls0602-report-cond__lbl {
  flex: 0 0 var(--sls0602-label-col, 5.5rem);
  width: var(--sls0602-label-col, 5.5rem);
}

.sls0602-report-cond__checks {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem 1.25rem;
  min-height: 2rem;
  min-width: 0;
}

/* 조회 AREA 2rem — native select / 마지막 v-select 동일 높이·라운드 */
.sls0602-right-store :deep(.pss-root) {
  --pss-control-h: 2rem;
  --pss-control-radius: 0.375rem;
}

.sls0602-right-store :deep(.pss-select),
.sls0602-right-store :deep(select) {
  height: 2rem !important;
  min-height: 2rem !important;
  max-height: 2rem !important;
  border-radius: 0.375rem !important;
  border: 1px solid var(--sls0602-control-border, #cbd5e1) !important;
  box-sizing: border-box;
}

.sls0602-right-store :deep(.pss-vselect) {
  height: 2rem !important;
  min-height: 2rem !important;
  max-height: 2rem !important;
}

.sls0602-right-store :deep(.pss-vselect .vs__dropdown-toggle) {
  height: 2rem !important;
  min-height: 2rem !important;
  max-height: 2rem !important;
  border-radius: 0.375rem !important;
  border: 1px solid var(--sls0602-control-border, #cbd5e1) !important;
  padding: 0 0.35rem !important;
  background: #fff !important;
  box-shadow: none !important;
  box-sizing: border-box;
}

.sls0602-right-store :deep(.pss-vselect .vs__open-indicator) {
  fill: #94a3b8 !important;
  transform: scale(0.55) !important;
}

/* 그룹 접기 화살표 숨김 (접으면 빈 행 — 이 화면에서는 사용 안 함) */
.sls0602-grid :deep(.rg-rowgroup-expander),
.sls0602-grid :deep(.rg-rowgroup-expander-expanded),
.sls0602-grid :deep(.rg-rowgroup-expander-collapsed),
.sls0602-grid :deep(.rg-expander-expanded),
.sls0602-grid :deep(.rg-expander-collapsed) {
  display: none !important;
  width: 0 !important;
  min-width: 0 !important;
  height: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
  visibility: hidden !important;
}

@media (max-width: 1280px) {
  .sls0602-search-layout {
    grid-template-columns: minmax(0, 1fr);
    row-gap: var(--sls0602-row-gap, 0.875rem);
  }
}

/* 차트 팝업 — 제목 줄로 이동 (위치·크기는 chartPop.style) */
.sls0602-chart-overlay {
  position: fixed;
  inset: 0;
  z-index: 10050;
  background: rgb(0 0 0 / 0.45);
  box-sizing: border-box;
}

.sls0602-chart-dialog {
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

.sls0602-chart-head {
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

.sls0602-chart-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: rgb(17 24 39);
  white-space: nowrap;
}

.sls0602-chart-actions {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 0.5rem;
}

.sls0602-chart-toolbar {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid rgb(226 232 240);
  background: rgb(243 244 246);
}

.sls0602-chart-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 0.75rem;
  min-height: 2rem;
}

.sls0602-chart-lbl {
  flex: 0 0 5.5rem;
  width: 5.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: rgb(17 24 39);
  white-space: nowrap;
}

.sls0602-chart-radios {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem 0.85rem;
  min-width: 0;
}

.sls0602-chart-radio {
  display: inline-flex;
  align-items: center;
  gap: 0.28rem;
  font-size: 0.875rem;
  color: rgb(31 41 55);
  white-space: nowrap;
  cursor: pointer;
}

.sls0602-chart-radio input {
  margin: 0;
}

.sls0602-chart-body {
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
.sls0602-chart-canvas {
  flex: 1 1 auto;
  display: block;
  width: 100% !important;
  max-width: 100%;
  min-height: 28rem;
  height: 100% !important;
  background: #fff;
}
</style>
