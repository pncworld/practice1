<template>
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
    class="grid grid-cols-2 grid-rows-1 justify-between bg-gray-200 rounded-lg h-24 items-center z-10">
    <div class="grid grid-cols-1 grid-rows-2">
      <Datepicker2
        @endDate="endDate"
        @startDate="startDate"
        @excelDate="excelDate"></Datepicker2>
      <div
        class="flex justify-start items-center text-base text-nowrap font-semibold ml-40 pl-1">
        조회조건 :
        <div>
          <label for="detail" class="font-normal"
            ><input
              type="checkbox"
              id="detail"
              class="ml-5"
              @change="seeDetail" />상세보기</label
          >
        </div>
        <div>
          <label for="unite" class="font-normal"
            ><input
              type="checkbox"
              id="unite"
              class="ml-5"
              @change="seeUnite" />셀병합</label
          >
        </div>
      </div>
    </div>
    <div class="ml-10">
      <PickStorePlural
        @lngStoreCodes="lngStoreCodes"
        @lngStoreGroup="lngStoreGroup"
        @lngStoreAttrs="lngStoreAttrs"
        @excelStore="excelStore">
      </PickStorePlural>
    </div>
    <div></div>
  </div>

  <div class="w-full h-[85%]">
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
          <label for="eieghth"
            ><input
              type="radio"
              id="eieghth"
              name="option"
              v-model="selectOption"
              :value="8" />할인액</label
          >
        </div>
        <div class="flex !pl-80 space-x-1">
          <button class="button search !h-6" @click="searchButton2">조회</button
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
        :chartName="'일자별 매출현황'"
        :colors="colors"></Chart>
    </div>
    <Realgrid
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
      :setGroupSummaryCenterIds="setGroupSummaryCenterIds"></Realgrid>
  </div>
</template>

<script setup>
import { getDailySalesDetailReport, getDailySalesReport } from "@/api/misales";
import Chart from "@/components/chart.vue";
import Datepicker2 from "@/components/Datepicker2.vue";
import PageName from "@/components/pageName.vue";
import PickStorePlural from "@/components/pickStorePlural.vue";
import Realgrid from "@/components/realgrid.vue";
import { insertPageLog } from "@/customFunc/customFunc";
import { onMounted, ref, watch } from "vue";
import { useStore } from "vuex";

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
const startDate = (e) => {
  console.log(e);
  selectedstartDate.value = e;
};
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
const tempSeeDetail = ref(1);
const seeDetail = (e) => {
  if (e.target.checked) {
    tempSeeDetail.value = 2;
  } else {
    tempSeeDetail.value = 1;
  }
};
const store = useStore();
const loginedstrLang = store.state.userData.lngLanguage;
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
      console.log(res);
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
      console.log(res);
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
const lngStoreGroup = (e) => {
  console.log(e);
  selectedGroup.value = e;
};
const lngStoreCodes = (e) => {
  selectedStores.value = e;
  console.log(e);
};
const lngStoreAttrs = (e) => {
  selectedStoreAttrs.value = e;
  console.log(e);
};

const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
};

const exportExcel = ref(false);
const selectedExcelStore = ref("");
const selectedExcelDate = ref("");
const documentSubTitle = ref("");
const excelStore = (e) => {
  selectedExcelStore.value = e;
};
const excelDate = (e) => {
  selectedExcelDate.value = e;
};
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
const chartButton = () => {
  byRadioButton.value = !byRadioButton.value;
};

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
    console.log(res);
    let temp = res.data.DAILYSALES;
    console.log(temp);
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

      console.log(menus);
      label.value = menus.map((item) => item.dtmDate);

      console.log(menus);
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

      console.log(menus);
      label.value = menus.map((item) => item.dtmDate);

      console.log(menus);
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

      console.log(menus);
      label.value = menus.map((item) => item.dtmDate);

      console.log(menus);
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

      console.log(menus);
      label.value = menus.map((item) => item.dtmDate);

      console.log(menus);
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

      console.log(menus);
      label.value = menus.map((item) => item.dtmDate);

      console.log(menus);
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

      console.log(menus);
      label.value = menus.map((item) => item.dtmDate);

      console.log(menus);
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

      console.log(menus);
      label.value = menus.map((item) => item.dtmDate);

      console.log(menus);
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

      console.log(menus);
      label.value = menus.map((item) => item.dtmDate);

      console.log(menus);
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

<style></style>
