/*--############################################################################
# Filename : SLS06_004RPT.vue                                                  
# Description : 매출관리 > 기간별 매출 현황 > 일자별 매출 현황                 
# Date :2025-05-14                                                             
# Author : 권맑음                     
################################################################################*/
<template>
  <!-- pl-5: 셸 w-right가 pl0이라 그리드가 좌측 메뉴에 붙음 → 우측 pd20과 맞춤 -->
  <div class="flex h-full min-h-0 flex-col pl-5" @click="handleParentClick">
    <div
      class="flex w-full shrink-0 items-center justify-between overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center space-x-2 pr-5">
        <button type="button" @click="chartButton" class="button chart md:w-auto w-14">
          차트
        </button>
        <button type="button" @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <button type="button" @click="excelButton" class="button save w-auto excel">
          엑셀
        </button>
      </div>
    </div>

    <div
      class="sls0604-search-panel z-10 mt-3 w-full min-h-0 shrink-0 overflow-visible rounded-lg bg-gray-200"
      :style="{
        '--sls0604-panel-pad-x': '2rem',
        '--sls0604-control-border': sls0604ControlBorder,
        '--sls0604-col-gutter': sls0604ColGutter,
        '--sls0604-row-gap': sls0604RowGap,
        '--sls0604-label-col': sls0604LabelCol,
        '--psp-label-w': sls0604LabelCol,
        '--psp-radio-w': '4.75rem',
        '--psp-col-gap': '0.5rem',
      }">
      <div class="sls0604-search-layout min-w-0">
        <div class="sls0604-left-stack min-w-0">
          <div class="sls0604-row">
            <span class="sls0604-lbl shrink-0">기간</span>
            <div class="sls0604-date-slot min-w-0 flex-1">
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
          <div class="sls0604-row">
            <span class="sls0604-lbl shrink-0">조회조건</span>
            <div class="sls0604-check-row min-w-0 flex-1">
              <label class="sls0604-check" for="sls0604-detail">
                <input
                  id="sls0604-detail"
                  type="checkbox"
                  checked
                  @change="seeDetail" />
                상세보기
              </label>
              <label class="sls0604-check" for="sls0604-unite">
                <input
                  id="sls0604-unite"
                  type="checkbox"
                  @change="seeUnite" />
                셀병합
              </label>
            </div>
          </div>
        </div>

        <div class="sls0604-right-store min-w-0 overflow-visible">
          <PickStorePlural
            fluid-width
            @lngStoreCodes="lngStoreCodes"
            @lngStoreGroup="lngStoreGroup"
            @lngStoreAttrs="lngStoreAttrs"
            @excelStore="excelStore" />
        </div>
      </div>
    </div>

    <div class="relative mt-2 flex min-h-0 min-w-0 flex-1 flex-col">
      <div
        v-show="byRadioButton"
        class="absolute left-64 top-20 z-[60] rounded-lg bg-gray-200 p-2">
        <div class="flex items-center justify-start space-x-1">
          데이터 선택
          <div class="ml-5 flex justify-start space-x-1">
            <label for="first"
              ><input
                id="first"
                v-model="selectOption"
                type="radio"
                name="option"
                :value="1" />객수</label
            ><label for="second"
              ><input
                id="second"
                v-model="selectOption"
                type="radio"
                name="option"
                :value="2" />객단가</label
            ><label for="third"
              ><input
                id="third"
                v-model="selectOption"
                type="radio"
                name="option"
                :value="3" />조수</label
            ><label for="fourth"
              ><input
                id="fourth"
                v-model="selectOption"
                type="radio"
                name="option"
                :value="4" />조단가</label
            ><label for="fifth"
              ><input
                id="fifth"
                v-model="selectOption"
                type="radio"
                name="option"
                :value="5" />총매출액</label
            ><label for="sixth"
              ><input
                id="sixth"
                v-model="selectOption"
                type="radio"
                name="option"
                :value="6" />실매출액</label
            ><label for="seventh"
              ><input
                id="seventh"
                v-model="selectOption"
                type="radio"
                name="option"
                :value="7" />순매출액</label
            >
            <label for="eieghth"
              ><input
                id="eieghth"
                v-model="selectOption"
                type="radio"
                name="option"
                :value="8" />할인액</label
            >
          </div>
          <div class="flex space-x-1 !pl-80">
            <button type="button" class="button search !h-6" @click="searchButton2">
              조회
            </button>
            <button type="button" class="button primary !h-6" @click="closeButton2">
              닫기
            </button>
          </div>
        </div>
        <div class="mt-1 flex items-center justify-start space-x-1 bg-gray-200">
          차트 유형 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <div class="space-x-1">
            <label for="graph1"
              ><input
                id="graph1"
                v-model="selectOption2"
                type="radio"
                name="option2"
                :value="1" />꺽은선 그래프</label
            ><label for="graph2"
              ><input
                id="graph2"
                v-model="selectOption2"
                type="radio"
                name="option2"
                :value="2" />막대 그래프</label
            ><label for="graph3"
              ><input
                id="graph3"
                v-model="selectOption2"
                type="radio"
                name="option2"
                :value="3" />원형 그래프</label
            >
          </div>
        </div>
        <Chart
          class="z-[60] h-auto !w-[1000px] bg-white"
          :type="type"
          :labels="labels"
          :label="label"
          :showLegend="false"
          :changePieData="true"
          :datas="datas"
          :chartName="'일자별 매출현황'"
          :colors="colors" />
      </div>

      <Realgrid
        class="h-full min-h-0 w-full flex-1"
        :progname="'SLS06_004RPT_VUE'"
        :progid="progid"
        :rowData="rowData"
        :reload="reload"
        :setFooter="true"
        :setGroupFooter="setGroupFooter"
        :setFooterExpressions="setFooterExpressions"
        :setFooterColID="setFooterColID"
        :documentTitle="'SLS06_004RPT'"
        :documentSubTitle="documentSubTitle"
        :exporttoExcel="exportExcel"
        :setGroupColumnId="'dtmDate'"
        :setGroupSumCustomText="['소계']"
        :setGroupSumCustomColumnId="['strWeekName']"
        :setGroupCustomLevel="3"
        :rowStateeditable="false"
        :setGroupSummaryCenterIds="setGroupSummaryCenterIds" />
    </div>
  </div>
</template>

<script setup>
import { getDailySalesDetailReport, getDailySalesReport } from "@/api/misales";
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
 * 	다중 매장 선택 컴포넌트
 */

import PickStorePlural from "@/components/pickStorePlural.vue";
/**
 * 	그리드 생성
 */

import Realgrid from "@/components/realgrid.vue";
/**
 *  페이지로그 자동 입력
 *  */

import { insertPageLog } from "@/customFunc/customFunc";
/*
 * 공통 표준  Function
 */

import { onMounted, ref, watch } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";

/** 조회 AREA — SLS06_001 / SLS04_002 반응형 패턴 */
const sls0604ControlBorder = "#cbd5e1";
const sls0604ColGutter = "1.25rem";
const sls0604RowGap = "0.875rem";
const sls0604LabelCol = "5.5rem";

const store = useStore();
const datepicker = ref(null);
const closePopUp = ref(false);

const handleParentClick = (e) => {
  const datepickerEl = datepicker.value?.$el;
  if (datepickerEl && datepickerEl.contains(e.target)) {
    return;
  }
  closePopUp.value = !closePopUp.value;
};

/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
});

const setGroupFooter = ref(false);
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
const setGroupSummaryCenterIds = ref("dtmDate,strWeekName");
const progid = ref(1);
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
/**
 * 선택한 매출 종료일자
 */

const endDate = (e) => {
  selectedendDate.value = e;
};
const seeUnite = (e) => {
  if (e.target.checked) {
    setGroupFooter.value = true;
  } else {
    setGroupFooter.value = false;
  }
  reload.value = !reload.value;
};
const tempSeeDetail = ref(2);
const seeDetail = (e) => {
  if (e.target.checked) {
    tempSeeDetail.value = 2;
  } else {
    tempSeeDetail.value = 1;
  }
};
const loginedstrLang = store.state.userData.lngLanguage;
/**
 *  조회 함수
 */

const searchButton = async () => {
  store.state.loading = true;
  try {
    initGrid();
    progid.value = tempSeeDetail.value;
    reload.value = !reload.value;
    let selectedStorearr;

    selectedStorearr = selectedStores.value;

    if (progid.value == 1) {
      const res = await getDailySalesReport(
        selectedGroup.value,
        selectedStorearr,
        selectedstartDate.value,
        selectedendDate.value,
        1,
        loginedstrLang
      );
      //comsole.log(res);
      rowData.value = res.data.DAILYSALES;
    } else if (progid.value == 2) {
      const res = await getDailySalesDetailReport(
        selectedGroup.value,
        selectedStorearr,
        selectedstartDate.value,
        selectedendDate.value,
        1,
        loginedstrLang
      );
      //comsole.log(res);
      rowData.value = res.data.DAILYSALES;
    }

    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
  } finally {
    store.state.loading = false;
  }
};

const selectedGroup = ref();
const selectedStores = ref();
const selectedStoreAttrs = ref();
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
 * 그리드 초기화
 */

const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
};

const exportExcel = ref(false);
const selectedExcelStore = ref("");
const selectedExcelDate = ref("");
const documentSubTitle = ref("");
/**
 * 엑셀용 매장 세팅 함수
 */

const excelStore = (e) => {
  selectedExcelStore.value = e;
};
/**
 * 엑셀용 일자 세팅 함수
 */

const excelDate = (e) => {
  selectedExcelDate.value = e;
};
/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  documentSubTitle.value =
    selectedExcelDate.value + "\n" + selectedExcelStore.value;
  exportExcel.value = !exportExcel.value;
};

const byRadioButton = ref(false);
const closeButton2 = () => {
  byRadioButton.value = false;
};
const datas = ref([]);
const selectOption = ref(1);
const selectOption2 = ref(1);
const labels = ref([]);
const label = ref([]);
const type = ref("line");
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
/**
 * 차트 버튼
 */

const chartButton = () => {
  byRadioButton.value = !byRadioButton.value;
};

/**
 *  조회 함수
 */

const searchButton2 = async () => {
  store.state.loading = true;
  try {
    let selectedStorearr;

    selectedStorearr = selectedStores.value;

    const res = await getDailySalesDetailReport(
      selectedGroup.value,
      selectedStorearr,
      selectedstartDate.value,
      selectedendDate.value,
      1,
      loginedstrLang
    );
    //comsole.log(res);
    let temp = res.data.DAILYSALES;
    //comsole.log(temp);
    if (selectOption.value == 1) {
      labels.value = [
        ...new Set(temp.map((item) => item.dtmDate.split(" ")[0])),
      ].sort((a, b) => {
        return new Date(a.dtmDate) - new Date(b.dtmDate);
      });

      let menus = Object.values(
        temp.reduce((acc, cur) => {
          if (!acc[cur.dtmDate.split(" ")[0]]) {
            acc[cur.dtmDate.split(" ")[0]] = {
              dtmDate: cur.dtmDate.split(" ")[0],
              lngCustCnt: cur.lngCustCnt,
            };
          } else {
            acc[cur.dtmDate.split(" ")[0]].lngCustCnt += cur.lngCustCnt; // 같은 lngCode면 lngMenuCnt 누적
          }
          return acc;
        }, {})
      ).sort((a, b) => b.lngCustCnt - a.lngCustCnt);

      //comsole.log(menus);
      label.value = menus.map((item) => item.dtmDate);

      //comsole.log(menus);
      datas.value = [];
      let data1 = [];
      data1 = menus
        .sort((a, b) => {
          return new Date(a.dtmDate) - new Date(b.dtmDate);
        })
        .map((item) => item.lngCustCnt);
      datas.value.push(data1);
    } else if (selectOption.value == 2) {
      labels.value = [
        ...new Set(temp.map((item) => item.dtmDate.split(" ")[0])),
      ].sort((a, b) => {
        return new Date(a.dtmDate) - new Date(b.dtmDate);
      });

      let menus = Object.values(
        temp.reduce((acc, cur) => {
          if (!acc[cur.dtmDate.split(" ")[0]]) {
            acc[cur.dtmDate.split(" ")[0]] = {
              dtmDate: cur.dtmDate.split(" ")[0],
              lngCustAmt: cur.lngCustAmt,
            };
          } else {
            acc[cur.dtmDate.split(" ")[0]].lngCustAmt += cur.lngCustAmt; // 같은 lngCode면 lngMenuCnt 누적
          }
          return acc;
        }, {})
      ).sort((a, b) => b.lngCustAmt - a.lngCustAmt);

      //comsole.log(menus);
      label.value = menus.map((item) => item.dtmDate);

      //comsole.log(menus);
      datas.value = [];
      let data1 = [];
      data1 = menus
        .sort((a, b) => {
          return new Date(a.dtmDate) - new Date(b.dtmDate);
        })
        .map((item) => item.lngCustAmt);
      datas.value.push(data1);
    } else if (selectOption.value == 3) {
      labels.value = [
        ...new Set(temp.map((item) => item.dtmDate.split(" ")[0])),
      ].sort((a, b) => {
        return new Date(a.dtmDate) - new Date(b.dtmDate);
      });

      let menus = Object.values(
        temp.reduce((acc, cur) => {
          if (!acc[cur.dtmDate.split(" ")[0]]) {
            acc[cur.dtmDate.split(" ")[0]] = {
              dtmDate: cur.dtmDate.split(" ")[0],
              lngRecCnt: cur.lngRecCnt,
            };
          } else {
            acc[cur.dtmDate.split(" ")[0]].lngRecCnt += cur.lngRecCnt; // 같은 lngCode면 lngMenuCnt 누적
          }
          return acc;
        }, {})
      ).sort((a, b) => b.lngRecCnt - a.lngRecCnt);

      //comsole.log(menus);
      label.value = menus.map((item) => item.dtmDate);

      //comsole.log(menus);
      datas.value = [];
      let data1 = [];
      data1 = menus
        .sort((a, b) => {
          return new Date(a.dtmDate) - new Date(b.dtmDate);
        })
        .map((item) => item.lngRecCnt);
      datas.value.push(data1);
    } else if (selectOption.value == 4) {
      labels.value = [
        ...new Set(temp.map((item) => item.dtmDate.split(" ")[0])),
      ].sort((a, b) => {
        return new Date(a.dtmDate) - new Date(b.dtmDate);
      });

      let menus = Object.values(
        temp.reduce((acc, cur) => {
          if (!acc[cur.dtmDate.split(" ")[0]]) {
            acc[cur.dtmDate.split(" ")[0]] = {
              dtmDate: cur.dtmDate.split(" ")[0],
              lngRecAmt: cur.lngRecAmt,
            };
          } else {
            acc[cur.dtmDate.split(" ")[0]].lngRecAmt += cur.lngRecAmt; // 같은 lngCode면 lngMenuCnt 누적
          }
          return acc;
        }, {})
      ).sort((a, b) => b.lngRecAmt - a.lngRecAmt);

      //comsole.log(menus);
      label.value = menus.map((item) => item.dtmDate);

      //comsole.log(menus);
      datas.value = [];
      let data1 = [];
      data1 = menus
        .sort((a, b) => {
          return new Date(a.dtmDate) - new Date(b.dtmDate);
        })
        .map((item) => item.lngRecAmt);
      datas.value.push(data1);
    } else if (selectOption.value == 5) {
      labels.value = [
        ...new Set(temp.map((item) => item.dtmDate.split(" ")[0])),
      ].sort((a, b) => {
        return new Date(a.dtmDate) - new Date(b.dtmDate);
      });

      let menus = Object.values(
        temp.reduce((acc, cur) => {
          if (!acc[cur.dtmDate.split(" ")[0]]) {
            acc[cur.dtmDate.split(" ")[0]] = {
              dtmDate: cur.dtmDate.split(" ")[0],
              lngSalAmt: cur.lngSalAmt,
            };
          } else {
            acc[cur.dtmDate.split(" ")[0]].lngSalAmt += cur.lngSalAmt; // 같은 lngCode면 lngMenuCnt 누적
          }
          return acc;
        }, {})
      ).sort((a, b) => b.lngSalAmt - a.lngSalAmt);

      //comsole.log(menus);
      label.value = menus.map((item) => item.dtmDate);

      //comsole.log(menus);
      datas.value = [];
      let data1 = [];
      data1 = menus
        .sort((a, b) => {
          return new Date(a.dtmDate) - new Date(b.dtmDate);
        })
        .map((item) => item.lngSalAmt);
      datas.value.push(data1);
    } else if (selectOption.value == 6) {
      labels.value = [
        ...new Set(temp.map((item) => item.dtmDate.split(" ")[0])),
      ].sort((a, b) => {
        return new Date(a.dtmDate) - new Date(b.dtmDate);
      });

      let menus = Object.values(
        temp.reduce((acc, cur) => {
          if (!acc[cur.dtmDate.split(" ")[0]]) {
            acc[cur.dtmDate.split(" ")[0]] = {
              dtmDate: cur.dtmDate.split(" ")[0],
              lngActAmt: cur.lngActAmt,
            };
          } else {
            acc[cur.dtmDate.split(" ")[0]].lngActAmt += cur.lngActAmt; // 같은 lngCode면 lngMenuCnt 누적
          }
          return acc;
        }, {})
      ).sort((a, b) => b.lngActAmt - a.lngActAmt);

      //comsole.log(menus);
      label.value = menus.map((item) => item.dtmDate);

      //comsole.log(menus);
      datas.value = [];
      let data1 = [];
      data1 = menus
        .sort((a, b) => {
          return new Date(a.dtmDate) - new Date(b.dtmDate);
        })
        .map((item) => item.lngActAmt);
      datas.value.push(data1);
    } else if (selectOption.value == 7) {
      labels.value = [
        ...new Set(temp.map((item) => item.dtmDate.split(" ")[0])),
      ].sort((a, b) => {
        return new Date(a.dtmDate) - new Date(b.dtmDate);
      });

      let menus = Object.values(
        temp.reduce((acc, cur) => {
          if (!acc[cur.dtmDate.split(" ")[0]]) {
            acc[cur.dtmDate.split(" ")[0]] = {
              dtmDate: cur.dtmDate.split(" ")[0],
              lngSupplyAmt: cur.lngSupplyAmt,
            };
          } else {
            acc[cur.dtmDate.split(" ")[0]].lngSupplyAmt += cur.lngSupplyAmt; // 같은 lngCode면 lngMenuCnt 누적
          }
          return acc;
        }, {})
      ).sort((a, b) => b.lngSupplyAmt - a.lngSupplyAmt);

      //comsole.log(menus);
      label.value = menus.map((item) => item.dtmDate);

      //comsole.log(menus);
      datas.value = [];
      let data1 = [];
      data1 = menus
        .sort((a, b) => {
          return new Date(a.dtmDate) - new Date(b.dtmDate);
        })
        .map((item) => item.lngSupplyAmt);
      datas.value.push(data1);
    } else if (selectOption.value == 8) {
      labels.value = [
        ...new Set(temp.map((item) => item.dtmDate.split(" ")[0])),
      ].sort((a, b) => {
        return new Date(a.dtmDate) - new Date(b.dtmDate);
      });

      let menus = Object.values(
        temp.reduce((acc, cur) => {
          if (!acc[cur.dtmDate.split(" ")[0]]) {
            acc[cur.dtmDate.split(" ")[0]] = {
              dtmDate: cur.dtmDate.split(" ")[0],
              lngDiscount: cur.lngDiscount,
            };
          } else {
            acc[cur.dtmDate.split(" ")[0]].lngDiscount += cur.lngDiscount; // 같은 lngCode면 lngMenuCnt 누적
          }
          return acc;
        }, {})
      ).sort((a, b) => b.lngDiscount - a.lngDiscount);

      //comsole.log(menus);
      label.value = menus.map((item) => item.dtmDate);

      //comsole.log(menus);
      datas.value = [];
      let data1 = [];
      data1 = menus
        .sort((a, b) => {
          return new Date(a.dtmDate) - new Date(b.dtmDate);
        })
        .map((item) => item.lngDiscount);
      datas.value.push(data1);
    }
  } catch (error) {
  } finally {
    store.state.loading = false;
  }
};
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
</script>

<style scoped>
.sls0604-search-panel {
  box-sizing: border-box;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  padding-left: var(--sls0604-panel-pad-x, 2rem);
  padding-right: var(--sls0604-panel-pad-x, 2rem);
}

@media (min-width: 768px) {
  .sls0604-search-panel {
    --sls0604-panel-pad-x: 3rem;
  }
}

.sls0604-search-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.35fr);
  column-gap: var(--sls0604-col-gutter, 1.25rem);
  align-items: start;
  min-width: 0;
}

.sls0604-left-stack {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--sls0604-row-gap, 0.875rem);
  min-width: 0;
  width: 100%;
  max-width: 100%;
  min-height: 100%;
}

.sls0604-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  min-height: 2rem;
}

.sls0604-lbl {
  box-sizing: border-box;
  flex: 0 0 var(--sls0604-label-col, 5.5rem);
  width: var(--sls0604-label-col, 5.5rem);
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

.sls0604-date-slot {
  min-width: 0;
  flex: 1 1 auto;
}

.sls0604-date-slot :deep(> div.flex.justify-start.items-center) {
  margin: 0 !important;
  width: auto !important;
  max-width: 100%;
}

.sls0604-date-slot :deep(input[type="date"]) {
  box-sizing: border-box;
  height: 2rem;
  min-height: 2rem;
  max-height: 2rem;
  border: 1px solid var(--sls0604-control-border, #cbd5e1);
  border-radius: 0.375rem;
  background: #fff;
}

.sls0604-date-slot :deep(div.inline-flex.h-8),
.sls0604-date-slot :deep(button) {
  height: 2rem !important;
  min-height: 2rem !important;
}

.sls0604-check-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem 1.25rem;
  min-height: 2rem;
}

.sls0604-check {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.875rem;
  font-weight: 400;
  color: rgb(17 24 39);
  white-space: nowrap;
  cursor: pointer;
}

.sls0604-check input[type="checkbox"] {
  box-sizing: border-box;
  margin: 0;
  flex-shrink: 0;
  width: 1.05rem;
  height: 1.05rem;
  min-width: 1.05rem;
  min-height: 1.05rem;
  accent-color: #2563eb;
  cursor: pointer;
}

.sls0604-right-store {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  overflow: visible;
}

.sls0604-right-store :deep(.psp-root) {
  width: 100%;
  min-width: 0;
}

.sls0604-right-store :deep(.psp-label) {
  font-size: 1rem !important;
  font-weight: 600 !important;
  line-height: 1.25 !important;
  color: rgb(17 24 39) !important;
}

.sls0604-right-store :deep(select),
.sls0604-right-store :deep(.psp-select),
.sls0604-right-store :deep(.psp-store-trigger) {
  box-sizing: border-box;
  height: 2rem !important;
  min-height: 2rem !important;
}

@media (max-width: 1280px) {
  .sls0604-search-layout {
    grid-template-columns: minmax(0, 1fr);
    row-gap: var(--sls0604-row-gap, 0.875rem);
  }
}
</style>
