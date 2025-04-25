<template>
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
        <button @click="printButton" class="button print w-auto">인쇄</button>
      </div>
    </div>
    <div
      class="grid grid-cols-2 grid-rows-1 justify-between bg-gray-200 rounded-lg h-36 items-center z-10">
      <div class="grid grid-cols-1 grid-rows-4 -space-y-3 mt-12">
        <Datepicker2
          class="pl-16 pr-4"
          @endDate="endDate"
          @startDate="startDate"
          :closePopUp="closePopUp"
          ref="datepicker"
          @excelDate="excelDate"></Datepicker2>
        <div
          class="flex justify-start items-center text-base text-nowrap font-semibold ml-40">
          메뉴구분 :
          <div class="flex ml-3 space-x-3 mt-1">
            <v-select
              v-model="selectedMenu"
              :options="mainMenu"
              placeholder="전체"
              label="strName"
              class="w-44 !h-8 bg-white"
              :reduce="(store) => (store != null ? store.lngCode : null)"
              clearable="true" />

            <v-select
              v-model="selectedsubMenu"
              :options="subList"
              placeholder="전체"
              label="strName"
              class="w-44 !h-8 bg-white"
              :reduce="(store) => (store != null ? store.lngCode : null)"
              clearable="true" />
          </div>
        </div>
        <div
          class="flex justify-start items-center text-base text-nowrap font-semibold ml-40 -mt-20 h-8 -space-x-2">
          조회조건 :
          <div>
            <label for="store" class="font-normal"
              ><input
                type="checkbox"
                id="store"
                class="ml-5"
                @change="checking" />매장명표시</label
            >
          </div>
          <div>
            <label for="maingroup" class="font-normal"
              ><input
                type="checkbox"
                id="maingroup"
                class="ml-5"
                @change="checking" />대그룹</label
            >
          </div>
          <div>
            <label for="subgroup" class="font-normal"
              ><input
                type="checkbox"
                id="subgroup"
                class="ml-5"
                @change="checking" />서브그룹</label
            >
          </div>
          <div>
            <label for="day" class="font-normal"
              ><input
                type="checkbox"
                id="day"
                class="ml-5"
                @change="checking" />일자별</label
            >
          </div>
          <div>
            <label for="gift" class="font-normal"
              ><input
                type="checkbox"
                id="gift"
                class="ml-5"
                @change="checking" />증정구분</label
            >
          </div>
          <div>
            <label for="exception" class="font-normal"
              ><input
                type="checkbox"
                id="exception"
                class="ml-5"
                @change="checking" />단가제외</label
            >
          </div>
          <div>
            <label for="sum" class="font-normal"
              ><input
                type="checkbox"
                id="sum"
                class="ml-5"
                @change="checking" />합계</label
            >
          </div>
          <div>
            <label for="unite" class="font-normal"
              ><input
                type="checkbox"
                id="unite"
                class="ml-5"
                @change="checking" />셀병합</label
            >
          </div>
        </div>
        <div
          class="flex justify-start items-center text-base text-nowrap font-semibold ml-40 !-mt-6 h-8">
          요일조건 :
          <div>
            <label for="mon" class="font-normal"
              ><input
                type="checkbox"
                id="mon"
                class="ml-5"
                @change="checkday"
                checked />월</label
            >
          </div>
          <div>
            <label for="tue" class="font-normal"
              ><input
                type="checkbox"
                id="tue"
                class="ml-5"
                @change="checkday"
                checked />화</label
            >
          </div>
          <div>
            <label for="wed" class="font-normal"
              ><input
                type="checkbox"
                id="wed"
                class="ml-5"
                @change="checkday"
                checked />수</label
            >
          </div>
          <div>
            <label for="thu" class="font-normal"
              ><input
                type="checkbox"
                id="thu"
                class="ml-5"
                @change="checkday"
                checked />목</label
            >
          </div>
          <div>
            <label for="fri" class="font-normal"
              ><input
                type="checkbox"
                id="fri"
                class="ml-5"
                @change="checkday"
                checked />금</label
            >
          </div>
          <div>
            <label for="sat" class="font-normal"
              ><input
                type="checkbox"
                id="sat"
                class="ml-5"
                @change="checkday"
                checked />토</label
            >
          </div>
          <div>
            <label for="sun" class="font-normal"
              ><input
                type="checkbox"
                id="sun"
                class="ml-5"
                @change="checkday"
                checked />일</label
            >
          </div>

          <div class="ml-20 -mt-2">
            공휴일 :
            <select
              name=""
              id=""
              class="border w-16 h-7 rounded-lg"
              v-model="selectedHoliday">
              <option :value="0">선택</option>
              <option :value="1">포함</option>
              <option :value="2">제외</option>
            </select>
          </div>
        </div>
      </div>
      <div class="ml-10 -mt-14">
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
      <div></div>
    </div>

    <div class="w-full h-[80%] mt-1">
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
                :value="1" />총건수</label
            ><label for="second"
              ><input
                type="radio"
                id="second"
                name="option"
                v-model="selectOption"
                :value="2" />정상건수</label
            ><label for="third"
              ><input
                type="radio"
                id="third"
                name="option"
                v-model="selectOption"
                :value="3" />증정건수</label
            ><label for="fourth"
              ><input
                type="radio"
                id="fourth"
                name="option"
                v-model="selectOption"
                :value="4" />할인건수</label
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
            ><label for="eighth"
              ><input
                type="radio"
                id="eighth"
                name="option"
                v-model="selectOption"
                :value="8" />할인액</label
            ><label for="ninth"
              ><input
                type="radio"
                id="ninth"
                name="option"
                v-model="selectOption"
                :value="9" />증정금액</label
            >
          </div>
          <div class="flex pl-28 space-x-1">
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
          :datas="datas"
          :chartName="'메뉴군별 매출 현황2'"
          :colors="colors"></Chart>
      </div>
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
          :rowStateeditable="false"
          :setGroupSumCustomLevel2="setGroupSumCustomLevel2"></Realgrid>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getSalesReportByMenu, getTableSearchCondition } from "@/api/misales";
import Chart from "@/components/chart.vue";
import Datepicker2 from "@/components/Datepicker2.vue";
import PageName from "@/components/pageName.vue";
import PickStorePlural from "@/components/pickStorePlural.vue";
import Realgrid from "@/components/realgrid.vue";
import { formatTime, insertPageLog } from "@/customFunc/customFunc";
import printJS from "print-js";

import { onMounted, ref, watch } from "vue";
import { useStore } from "vuex";

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
const setGroupFooter = ref(false);
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
const setGroupSumCustomLevel = ref(1);
const setGroupColumnId = ref([""]);
const setGroupColumnId2 = ref("");
const setGroupSumCustomLevel2 = ref(1);
const progid = ref(2);
const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);
const selectedstartDate = ref();
const selectedendDate = ref();
const startDate = (e) => {
  console.log(e);
  selectedstartDate.value = e;
};
const byRadioButton = ref(false);

const selectOption = ref(1);
const selectOption2 = ref(1);

watch(selectOption, () => {
  console.log(selectOption.value);
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
const endDate = (e) => {
  selectedendDate.value = e;
};
const chartButton = () => {
  byRadioButton.value = !byRadioButton.value;
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
const store = useStore();
const loginedstrLang = store.state.userData.lngLanguage;
const searchButton = async () => {
  store.state.loading = true;
  try {
    initGrid();

    reload.value = !reload.value;

    const reportType = [...checkedReportTypes];
    const checkdays = [...checkedDays];

    console.log(checkdays);

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
    console.log(res);
    rowData.value = res.data.MENUS;

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
const searchButton2 = async () => {
  store.state.loading = true;
  try {
    const reportType = [...checkedReportTypes];
    const checkdays = [...checkedDays];

    console.log(checkdays);

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

    console.log(res.data.MENUS);
    console.log(selectOption.value);
    datas.value = [];
    if (selectOption.value == 1) {
      labels.value = [
        ...new Set(res.data.MENUS.map((item) => item.dtmDate.split(" ")[0])),
      ].slice(); // 반응형 Proxy에서 일반 배열로 변환
      console.log(labels.value); // 이 부분은 배열로 변환된 결과

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
      console.log(menus);
      label.value = menus.map((item) => item.strMenu);

      console.log(menus);
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
      console.log(datas.value);
    } else if (selectOption.value == 2) {
      labels.value = [
        ...new Set(res.data.MENUS.map((item) => item.dtmDate.split(" ")[0])),
      ].slice(); // 반응형 Proxy에서 일반 배열로 변환
      console.log(labels.value); // 이 부분은 배열로 변환된 결과

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
      console.log(menus);
      label.value = menus.map((item) => item.strMenu);

      console.log(menus);
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
      console.log(datas.value);
    } else if (selectOption.value == 3) {
      labels.value = [
        ...new Set(res.data.MENUS.map((item) => item.dtmDate.split(" ")[0])),
      ].slice(); // 반응형 Proxy에서 일반 배열로 변환
      console.log(labels.value); // 이 부분은 배열로 변환된 결과

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
      console.log(menus);
      label.value = menus.map((item) => item.strMenu);

      console.log(menus);
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
      ].slice(); // 반응형 Proxy에서 일반 배열로 변환
      console.log(labels.value); // 이 부분은 배열로 변환된 결과

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
      console.log(menus);
      label.value = menus.map((item) => item.strMenu);

      console.log(menus);
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
      ].slice(); // 반응형 Proxy에서 일반 배열로 변환
      console.log(labels.value); // 이 부분은 배열로 변환된 결과

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
      console.log(menus);
      label.value = menus.map((item) => item.strMenu);

      console.log(menus);
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
      ].slice(); // 반응형 Proxy에서 일반 배열로 변환
      console.log(labels.value); // 이 부분은 배열로 변환된 결과

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
      console.log(menus);
      label.value = menus.map((item) => item.strMenu);

      console.log(menus);
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
      ].slice(); // 반응형 Proxy에서 일반 배열로 변환
      console.log(labels.value); // 이 부분은 배열로 변환된 결과

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
      console.log(menus);
      label.value = menus.map((item) => item.strMenu);

      console.log(menus);
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
      ].slice(); // 반응형 Proxy에서 일반 배열로 변환
      console.log(labels.value); // 이 부분은 배열로 변환된 결과

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
      console.log(menus);
      label.value = menus.map((item) => item.strMenu);

      console.log(menus);
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
      ].slice(); // 반응형 Proxy에서 일반 배열로 변환
      console.log(labels.value); // 이 부분은 배열로 변환된 결과

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
      console.log(menus);
      label.value = menus.map((item) => item.strMenu);

      console.log(menus);
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
const lngStoreGroup = (e) => {
  initGrid();
  console.log(e);
  selectedGroup.value = e;
};
const lngStoreCodes = (e) => {
  initGrid();
  selectedStores.value = e;
  console.log(e);
};
const lngStoreAttr = (e) => {
  initGrid();
  selectedStoreAttrs.value = e;
  console.log(e);
};
const lngStoreTeam = (e) => {
  initGrid();
};
const lngSupervisor = (e) => {
  initGrid();
};

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
const ConditionSet = new Set([]);
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
const handleParentClick = (e) => {
  const datepickerEl = datepicker.value?.$el;

  if (datepickerEl && datepickerEl.contains(e.target)) {
    return;
  }
  closePopUp.value = !closePopUp.value;
};
const selectedExcelDate = ref("");
const selectedExcelStore = ref("");
const excelDate = (e) => {
  selectedExcelDate.value = e;
};
const excelStore = (e) => {
  selectedExcelStore.value = e;
};

const printButton = () => {
  if (afterSearch.value == false) {
    return;
  }
  console.log(rowData.value);

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
  console.log(subList.value);
  selectedsubMenu.value = null;
});

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getTableSearchCondition(
    selectedGroup.value,
    selectedStores.value,
    selectedMenu.value
  );
  subList.value = res.data.SUBLIST;
});
const hideColumnsId = ref([
  "strStore",
  "strMajor",
  "strSub",
  "dtmDate",
  "lngNMenuCnt",
  "lngGMenuCnt",
]);
const checkedReportTypes = new Set([0]);
const checkedGift = ref(0);
const checkedlngPrice = ref(0);
const checkedlngPrint = ref(0);
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
      setGroupSumCustomLevel.value = 2;
    } else {
      ConditionSet.delete(7);
      setRowGroupSpan.value = "";
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

<style>
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
</style>
