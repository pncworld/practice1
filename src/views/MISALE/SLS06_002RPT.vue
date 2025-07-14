/*--############################################################################
# Filename : SLS06_002RPT.vue                                                  
# Description : 매출관리 > 기간별 매출 현황 >시간대별 매출 현황.                
# Date :2025-05-14                                                             
# Author : 권맑음                     
################################################################################*/
<template>
  <!-- 조회조건 -->
  <div class="h-full" @click="handleParentClick">
    <div class="flex justify-between items-center w-full overflow-y-hidden">
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
      </div>
    </div>
    <div
      class="grid grid-cols-2 grid-rows-1 justify-between bg-gray-200 rounded-lg h-32 z-10">
      <div class="grid grid-cols-1 grid-rows-3 mt-2">
        <Datepicker2
          @endDate="endDate"
          @startDate="startDate"
          :closePopUp="closePopUp"
          :initToday="1"
          ref="datepicker"
          @excelDate="excelDate"></Datepicker2>
        <div class="flex flex-col justify-center items-start text-nowrap">
          <div
            class="text-nowrap flex justify-center items-center space-x-2 ml-[62px]">
            <div class="text-base font-semibold">시간대</div>
            <div class="pl-3">
              <select
                name=""
                id=""
                class="border rounded-lg w-16 h-8"
                v-model="orderPay">
                <option :value="1">주문</option>
                <option :value="2">계산</option>
              </select>
            </div>
            <div>
              <!-- <select name="" id="" class="border rounded-lg w-16 h-8" v-model="startTime">
              <option :value="i.value" v-for="i in times">{{ i.strName }}</option>
            </select> -->

              <v-select
                v-model="startTime"
                :options="times"
                label="strName"
                class="w-32 custom-select3"
                :reduce="(store) => (store != null ? store.value : null)"
                clearable="true"
                @click="resetVselect" />
            </div>
            <div>~</div>
            <div>
              <!-- <select name="" id="" class="border rounded-lg w-16 h-8" v-model="endTime">
              <option :value="i.value" v-for="i in times">{{ i.strName }}</option>
            </select> -->

              <v-select
                v-model="endTime"
                :options="times"
                label="strName"
                class="w-32 custom-select3"
                :reduce="(store) => (store != null ? store.value : null)"
                clearable="true"
                @click="resetVselect2" />
            </div>
            <div>
              <label for="showSalAmt"
                ><input
                  type="checkbox"
                  id="showSalAmt"
                  @change="changecheckedBefore" />할인전 매출액</label
              >
            </div>
          </div>
        </div>
        <div class="flex justify-start space-x-5 ml-12 items-center">
          <div class="text-base font-semibold">요일조건</div>
          <label for="mon"
            ><input
              type="checkbox"
              id="mon"
              :value="2"
              checked
              @change="checkit" />월</label
          >
          <label for="tue"
            ><input
              type="checkbox"
              id="tue"
              :value="3"
              checked
              @change="checkit" />화</label
          >
          <label for="wed"
            ><input
              type="checkbox"
              id="wed"
              :value="4"
              checked
              @change="checkit" />수</label
          >
          <label for="thu"
            ><input
              type="checkbox"
              id="thu"
              :value="5"
              checked
              @change="checkit" />목</label
          >
          <label for="fri"
            ><input
              type="checkbox"
              id="fri"
              :value="6"
              checked
              @change="checkit" />금</label
          >
          <label for="sat"
            ><input
              type="checkbox"
              id="sat"
              :value="7"
              checked
              @change="checkit" />토</label
          >
          <label for="sun"
            ><input
              type="checkbox"
              id="sun"
              :value="1"
              checked
              @change="checkit" />일</label
          >
        </div>
      </div>
      <div class="">
        <PickStoreSingle2
          @lngStoreCode="lngStoreCodes"
          @lngStoreGroup="lngStoreGroup"
          @excelStore="excelStore"
          @lngStoreAttrs="lngStoreAttrs"
          @lngStoreTeam="lngStoreTeam"
          @lngSupervisor="lngSupervisor">
        </PickStoreSingle2>
      </div>
      <div></div>
    </div>

    <div class="w-full h-[80%]">
      <div
        v-show="byRadioButton"
        class="absolute top-80 left-64 z-[60] bg-gray-200 rounded-lg p-2">
        <div class="flex justify-start items-center space-x-1">
          데이터 선택
          <div class="flex justify-start ml-5 space-x-1">
            <label for="first"
              ><input
                type="radio"
                id="first"
                name="option"
                v-model="selectOption"
                :value="1" />객수</label
            ><label for="second"
              ><input
                type="radio"
                id="second"
                name="option"
                v-model="selectOption"
                :value="2" />객단가</label
            ><label for="third"
              ><input
                type="radio"
                id="third"
                name="option"
                v-model="selectOption"
                :value="3" />조수</label
            ><label for="fourth"
              ><input
                type="radio"
                id="fourth"
                name="option"
                v-model="selectOption"
                :value="4" />조단가</label
            ><label for="fifth"
              ><input
                type="radio"
                id="fifth"
                name="option"
                v-model="selectOption"
                :value="5" />총매출액</label
            ><label for="sixth"
              ><input
                type="radio"
                id="sixth"
                name="option"
                v-model="selectOption"
                :value="6" />실매출액</label
            ><label for="seventh"
              ><input
                type="radio"
                id="seventh"
                name="option"
                v-model="selectOption"
                :value="7" />순매출액</label
            >
          </div>
          <div class="flex !pl-80 space-x-1">
            <button class="button search !h-6" @click="searchButton2">
              조회</button
            ><button class="button primary !h-6" @click="closeButton2">
              닫기
            </button>
          </div>
        </div>
        <div class="flex justify-start items-center space-x-1 bg-gray-200 mt-1">
          차트 유형 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <div class="space-x-1">
            <label for="graph1"
              ><input
                type="radio"
                id="graph1"
                name="option2"
                v-model="selectOption2"
                :value="1" />꺽은선 그래프</label
            ><label for="graph2"
              ><input
                type="radio"
                id="graph2"
                name="option2"
                v-model="selectOption2"
                :value="2" />막대 그래프</label
            ><label for="graph3"
              ><input
                type="radio"
                id="graph3"
                name="option2"
                v-model="selectOption2"
                :value="3" />원형 그래프</label
            >
          </div>
        </div>
        <Chart
          class="h-auto z-[60] !w-[1000px] bg-white"
          :type="type"
          :labels="labels"
          :label="label"
          :showLegend="false"
          :changePieData="true"
          :datas="datas"
          :chartName="'시간대별 매출현황'"
          :colors="colors"></Chart>
      </div>
      <!-- 조회조건 -->
      <!-- 그리드 영역 -->
      <Realgrid
        :progname="'SLS06_002RPT_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :setFooter="true"
        :setGroupFooter="true"
        :setFooterExpressions="setFooterExpressions"
        :setFooterColID="setFooterColID"
        :setGroupFooterExpressions="setGroupFooterExpressions"
        :setGroupFooterColID="setGroupFooterColID"
        :ExcelNm="'시간대별 매출 현황.'"
        :exporttoExcel="exportExcel"
        :setGroupColumnId="'strStore,strTime'"
        :setGroupSumCustomText="['소계']"
        :setGroupSumCustomColumnId="['strTime']"
        :setGroupCustomLevel="1"
        :setRowGroupSpan="'lngCustTotCnt,lngRecTotCnt,lngAccTotAmt'"
        :setGroupSummaryCenterIds="setGroupSummaryCenterIds"
        :hideColumn="'lngSalAmt'"
        :hideColumnNow="hideColumnNow"
        :documentTitle="'SLS06_002RPT'"
        :rowStateeditable="false"
        :documentSubTitle="documentSubTitle">
      </Realgrid>
    </div>
  </div>
  <!-- 그리드 영역 -->
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
/*
 * 공통 표준  Function
 */

import { onMounted, ref, watch } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";

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
  "custom",
]);
const setGroupSummaryCenterIds = ref("strTime");
const progid = ref(1);

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

    const sendcheckedDay = [...checkedDay];

    const res = await getTimeSalesReport(
      selectedGroup.value,
      selectedStoreAttrs.value,
      selectedStoreTeam.value,
      selectedStoreSuperVisor.value,
      selectedStores.value,
      selectedstartDate.value,
      selectedendDate.value,
      "12",
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
      "12",
      startTime.value,
      endTime.value,
      orderPay.value,
      sendcheckedDay.join(",")
    );
    //comsole.log(res);
    let temp = res.data.TIMESALE;
    if (selectOption.value == 1) {
      labels.value = [...new Set(temp.map((item) => item.strTime))]
        .sort((a, b) => {
          return Number(a.split(":")[0]) - Number(b.split(":")[0]);
        })
        .slice(); // 반응형 Proxy에서 일반 배열로 변환
      //comsole.log(labels.value); // 이 부분은 배열로 변환된 결과

      let menus = Object.values(
        temp.reduce((acc, cur) => {
          if (!acc[cur.strTime]) {
            acc[cur.strTime] = {
              strTime: cur.strTime,
              lngCustCnt: cur.lngCustCnt,
            };
          } else {
            acc[cur.strTime].lngCustCnt += cur.lngCustCnt; // 같은 lngCode면 lngMenuCnt 누적
          }
          return acc;
        }, {})
      )
        .sort((a, b) => b.lngCustCnt - a.lngCustCnt)
        .slice(0, 30);
      //comsole.log(menus);
      label.value = menus.map((item) => item.strTime);

      //comsole.log(menus);
      datas.value = [];
      let data1 = [];
      data1 = menus
        .sort((a, b) => {
          return (
            Number(a.strTime.split(":")[0]) - Number(b.strTime.split(":")[0])
          );
        })
        .map((item) => item.lngCustCnt);
      datas.value.push(data1);
    } else if (selectOption.value == 2) {
      labels.value = [...new Set(temp.map((item) => item.strTime))]
        .sort((a, b) => {
          return Number(a.split(":")[0]) - Number(b.split(":")[0]);
        })
        .slice(); // 반응형 Proxy에서 일반 배열로 변환
      //comsole.log(labels.value); // 이 부분은 배열로 변환된 결과

      let menus = Object.values(
        temp.reduce((acc, cur) => {
          if (!acc[cur.strTime]) {
            acc[cur.strTime] = {
              strTime: cur.strTime,
              lngCustAmt: cur.lngCustAmt,
            };
          } else {
            acc[cur.strTime].lngCustAmt += cur.lngCustAmt; // 같은 lngCode면 lngMenuCnt 누적
          }
          return acc;
        }, {})
      )
        .sort((a, b) => b.lngCustAmt - a.lngCustAmt)
        .slice(0, 30);
      //comsole.log(menus);
      label.value = menus.map((item) => item.strTime);

      //comsole.log(menus);
      datas.value = [];
      let data1 = [];
      data1 = menus
        .sort((a, b) => {
          return (
            Number(a.strTime.split(":")[0]) - Number(b.strTime.split(":")[0])
          );
        })
        .map((item) => item.lngCustAmt);
      datas.value.push(data1);
    } else if (selectOption.value == 3) {
      labels.value = [...new Set(temp.map((item) => item.strTime))]
        .sort((a, b) => {
          return Number(a.split(":")[0]) - Number(b.split(":")[0]);
        })
        .slice(); // 반응형 Proxy에서 일반 배열로 변환
      //comsole.log(labels.value); // 이 부분은 배열로 변환된 결과

      let menus = Object.values(
        temp.reduce((acc, cur) => {
          if (!acc[cur.strTime]) {
            acc[cur.strTime] = {
              strTime: cur.strTime,
              lngRecCnt: cur.lngRecCnt,
            };
          } else {
            acc[cur.strTime].lngRecCnt += cur.lngRecCnt; // 같은 lngCode면 lngMenuCnt 누적
          }
          return acc;
        }, {})
      )
        .sort((a, b) => b.lngRecCnt - a.lngRecCnt)
        .slice(0, 30);
      //comsole.log(menus);
      label.value = menus.map((item) => item.strTime);

      //comsole.log(menus);
      datas.value = [];
      let data1 = [];
      data1 = menus
        .sort((a, b) => {
          return (
            Number(a.strTime.split(":")[0]) - Number(b.strTime.split(":")[0])
          );
        })
        .map((item) => item.lngRecCnt);
      datas.value.push(data1);
    } else if (selectOption.value == 4) {
      labels.value = [...new Set(temp.map((item) => item.strTime))]
        .sort((a, b) => {
          return Number(a.split(":")[0]) - Number(b.split(":")[0]);
        })
        .slice(); // 반응형 Proxy에서 일반 배열로 변환
      //comsole.log(labels.value); // 이 부분은 배열로 변환된 결과

      let menus = Object.values(
        temp.reduce((acc, cur) => {
          if (!acc[cur.strTime]) {
            acc[cur.strTime] = {
              strTime: cur.strTime,
              lngRecAmt: cur.lngRecAmt,
            };
          } else {
            acc[cur.strTime].lngRecAmt += cur.lngRecAmt; // 같은 lngCode면 lngMenuCnt 누적
          }
          return acc;
        }, {})
      )
        .sort((a, b) => b.lngRecAmt - a.lngRecAmt)
        .slice(0, 30);
      //comsole.log(menus);
      label.value = menus.map((item) => item.strTime);

      //comsole.log(menus);
      datas.value = [];
      let data1 = [];
      data1 = menus
        .sort((a, b) => {
          return (
            Number(a.strTime.split(":")[0]) - Number(b.strTime.split(":")[0])
          );
        })
        .map((item) => item.lngRecAmt);
      datas.value.push(data1);
    } else if (selectOption.value == 5) {
      labels.value = [...new Set(temp.map((item) => item.strTime))]
        .sort((a, b) => {
          return Number(a.split(":")[0]) - Number(b.split(":")[0]);
        })
        .slice(); // 반응형 Proxy에서 일반 배열로 변환
      //comsole.log(labels.value); // 이 부분은 배열로 변환된 결과

      let menus = Object.values(
        temp.reduce((acc, cur) => {
          if (!acc[cur.strTime]) {
            acc[cur.strTime] = {
              strTime: cur.strTime,
              lngSalAmt: cur.lngSalAmt,
            };
          } else {
            acc[cur.strTime].lngSalAmt += cur.lngSalAmt; // 같은 lngCode면 lngMenuCnt 누적
          }
          return acc;
        }, {})
      )
        .sort((a, b) => b.lngSalAmt - a.lngSalAmt)
        .slice(0, 30);
      //comsole.log(menus);
      label.value = menus.map((item) => item.strTime);

      //comsole.log(menus);
      datas.value = [];
      let data1 = [];
      data1 = menus
        .sort((a, b) => {
          return (
            Number(a.strTime.split(":")[0]) - Number(b.strTime.split(":")[0])
          );
        })
        .map((item) => item.lngSalAmt);
      datas.value.push(data1);
    } else if (selectOption.value == 6) {
      labels.value = [...new Set(temp.map((item) => item.strTime))]
        .sort((a, b) => {
          return Number(a.split(":")[0]) - Number(b.split(":")[0]);
        })
        .slice(); // 반응형 Proxy에서 일반 배열로 변환
      //comsole.log(labels.value); // 이 부분은 배열로 변환된 결과

      let menus = Object.values(
        temp.reduce((acc, cur) => {
          if (!acc[cur.strTime]) {
            acc[cur.strTime] = {
              strTime: cur.strTime,
              lngTotAmt: cur.lngTotAmt,
            };
          } else {
            acc[cur.strTime].lngTotAmt += cur.lngTotAmt; // 같은 lngCode면 lngMenuCnt 누적
          }
          return acc;
        }, {})
      )
        .sort((a, b) => b.lngTotAmt - a.lngTotAmt)
        .slice(0, 30);
      //comsole.log(menus);
      label.value = menus.map((item) => item.strTime);

      //comsole.log(menus);
      datas.value = [];
      let data1 = [];
      data1 = menus
        .sort((a, b) => {
          return (
            Number(a.strTime.split(":")[0]) - Number(b.strTime.split(":")[0])
          );
        })
        .map((item) => item.lngTotAmt);
      datas.value.push(data1);
    } else if (selectOption.value == 7) {
      labels.value = [...new Set(temp.map((item) => item.strTime))]
        .sort((a, b) => {
          return Number(a.split(":")[0]) - Number(b.split(":")[0]);
        })
        .slice(); // 반응형 Proxy에서 일반 배열로 변환
      //comsole.log(labels.value); // 이 부분은 배열로 변환된 결과

      let menus = Object.values(
        temp.reduce((acc, cur) => {
          if (!acc[cur.strTime]) {
            acc[cur.strTime] = {
              strTime: cur.strTime,
              lngSupplyAmt: cur.lngSupplyAmt,
            };
          } else {
            acc[cur.strTime].lngSupplyAmt += cur.lngSupplyAmt; // 같은 lngCode면 lngMenuCnt 누적
          }
          return acc;
        }, {})
      )
        .sort((a, b) => b.lngSupplyAmt - a.lngSupplyAmt)
        .slice(0, 30);
      //comsole.log(menus);
      label.value = menus.map((item) => item.strTime);

      //comsole.log(menus);
      datas.value = [];
      let data1 = [];
      data1 = menus
        .sort((a, b) => {
          return (
            Number(a.strTime.split(":")[0]) - Number(b.strTime.split(":")[0])
          );
        })
        .map((item) => item.lngSupplyAmt);
      datas.value.push(data1);
    }

    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
  } finally {
    store.state.loading = false;
  }
};

const byRadioButton = ref(false);
/**
 * 차트 버튼
 */

const chartButton = () => {
  byRadioButton.value = !byRadioButton.value;
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
    dayArray;
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

<style></style>
