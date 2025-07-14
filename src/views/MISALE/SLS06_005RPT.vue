/*--############################################################################
# Filename : SLS06_005RPT.vue                                                  
# Description : 매출관리 > 기간별 매출 현황 > 전년대비실적.                     
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
      class="grid grid-cols-[10fr,10fr] grid-rows-1 justify-between bg-gray-200 rounded-lg h-20 z-10">
      <div class="grid grid-cols-1 grid-rows-2 justify-center ml-12">
        <div class="flex justify-start items-center space-x-4 mt-2">
          <div class="text-base font-semibold text-nowrap">
            비교년도/기준년도
          </div>
          <div>
            <select
              name=""
              id=""
              class="border rounded-lg w-32 h-8"
              v-model="selectedCompareYear">
              <option :value="i" v-for="i in yearsArray">{{ i }}</option>
            </select>
          </div>
          <div class="text-xl">/</div>
          <div>
            <select
              name=""
              id=""
              class="border rounded-lg w-32 h-8"
              v-model="selectedRefYear">
              <option :value="i" v-for="i in yearsArray">{{ i }}</option>
            </select>
          </div>
        </div>
        <div
          class="justify-start flex items-center space-x-5 w-[500px] pl-[60px]">
          <div class="text-base font-semibold">매출 구분</div>
          <div>
            <label for="searchType"
              ><input
                type="radio"
                id="searchType"
                name="salesType"
                v-model="selectedSalesType"
                :value="1" />실매출</label
            >
          </div>
          <div>
            <label for="searchType2"
              ><input
                type="radio"
                id="searchType2"
                name="salesType"
                v-model="selectedSalesType"
                :value="2" />순매출</label
            >
          </div>
        </div>
      </div>
      <div class="ml-90">
        <PickStoreSingle2
          @lngStoreCode="lngStoreCode"
          @lngStoreGroup="lngStoreGroup"
          @lngStoreAttrs="lngStoreAttrs"
          @lngStoreTeam="lngStoreTeam"
          @lngSupervisor="lngSupervisor"
          @excelStore="excelStore">
        </PickStoreSingle2>
      </div>
    </div>
    <!-- 조회 조건 -->
    <!-- 그리드 영역 -->
    <div class="h-[26%] w-[100%] mt-1">
      <Realgrid
        :progname="'SLS06_005RPT_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :exporttoExcel="exportExcel"
        :documentSubTitle="documentSubTitle"
        :documentTitle="'SLS06_005RPT'"
        :rowStateeditable="false"
        :setFooterColID="[
          'lastTotAmt',
          'lastCustCnt',
          'lastCustResult',
          'nowTotAmt',
          'nowCustCnt',
          'nowCustResult',
          'differAmt',
          'differCust',
          'differCustResult',
        ]"
        :setFooterExpressions="[
          'sum',
          'sum',
          'avg',
          'sum',
          'sum',
          'avg',
          'sum',
          'sum',
          'avg',
        ]"
        :setFooter="true"
        :mergeColumns2="true"
        :mergeColumnGroupSubList2="[
          ['lastTotAmt', 'lastCustCnt', 'lastCustResult'],
          ['nowTotAmt', 'nowCustCnt', 'nowCustResult'],
          ['differAmt', 'differCust', 'differCustResult', 'AmtRate'],
        ]"
        :mergeColumnGroupName2="[
          '비교년도' + '(' + selectedCompareYear + ')',
          '기준년도' + '(' + selectedRefYear + ')',
          '전년대비',
        ]"
        @getJsonData="getJsonData"
        :getJson="getJson">
      </Realgrid>
    </div>
    <div class="h-[57%] w-[100%]">
      <Chart
        class="h-[110%] -mt-5"
        v-show="byRadioButton"
        :type="type"
        :labels="[
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7',
          '8',
          '9',
          '10',
          '11',
          '12',
        ]"
        :label="[selectedCompareYear, selectedRefYear]"
        :datas="datas"
        :chartName="'전년대비실적'"
        :colors="['lightgreen', '#333399']"
        :print="print"></Chart>
    </div>
    <div class="flex justify-end space-x-2 absolute bottom-5 right-5">
      <label for="line"
        ><input
          type="radio"
          id="line"
          name="Chart"
          :value="0"
          v-model="setchart" />선 그래프</label
      >
      <label for="bar"
        ><input
          type="radio"
          id="bar"
          name="Chart"
          :value="1"
          v-model="setchart" />막대그래프</label
      >
      <label for="hide"
        ><input
          type="radio"
          id="hide"
          name="Chart"
          :value="2"
          v-model="setchart" />차트숨기기</label
      >
      <button class="button print" @click="printChart">인쇄</button>
    </div>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import { getPrevYearComparison } from "@/api/misales";
import Chart from "@/components/chart.vue";
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

const selectedCompareYear = ref(new Date().getFullYear() - 1);
const selectedRefYear = ref(new Date().getFullYear());
const Years = new Date().getFullYear();
const yearsArray = Array.from({ length: 11 }, (_, i) => Years - 10 + i).sort(
  (a, b) => b - a
);

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);
const type = ref("line");
const labels = ref("line");
const label = ref("line");
const datas = ref([]);
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
const selectedSalesType = ref(1);
const getJson = ref(false);
const checkedDate = ref(0);
const checkedStore = ref(0);

const store = useStore();
const loginedstrLang = store.state.userData.lngLanguage;
/**
 *  조회 함수
 */

const searchButton = async () => {
  store.state.loading = true;
  try {
    initGrid();

    reload.value = !reload.value;

    setchart.value = 2;
    const res = await getPrevYearComparison(
      selectedGroup.value,
      selectedStoreAttrs.value,
      selectedStoreTeam.value,
      selectedStoreSuperVisor.value,
      selectedStores.value,
      selectedRefYear.value,
      selectedCompareYear.value,
      selectedSalesType.value
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
const print = ref(false);
const selectedGroup = ref();
const selectedStores = ref();
const selectedStoreAttrs = ref();
const selectedStoreTeam = ref();
const selectedStoreSuperVisor = ref();
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

const lngStoreCode = (e) => {
  initGrid();
  selectedStores.value = e;
  //comsole.log(e);
};

/**
 * 페이지 매장 분류 세팅
 */

const lngStoreAttrs = (e) => {
  initGrid();
  selectedStoreAttrs.value = e;
  //comsole.log(e);
};
/**
 * 페이지 매장 팀 세팅
 */

const lngStoreTeam = (e) => {
  selectedStoreTeam.value = e;
  initGrid();
};
/**
 * 페이지 매장 슈퍼바이저 세팅
 */

const lngSupervisor = (e) => {
  selectedStoreSuperVisor.value = e;
  initGrid();
};

/**
 * 그리드 초기화
 */

const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
  if (datas.value.length > 0) {
    datas.value = [];
  }
  setchart.value = 2;
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
    //comsole.log(mainMenu.value.filter((item) => item.lngcode == selectedMenu.value));
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
const byRadioButton = ref(false);
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
  //comsole.log(labels.value);
  //comsole.log(label.value);
  //comsole.log(datas.value);
};
/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = insertPageLog(store.state.activeTab2);
});

const setchart = ref(2);
watch(setchart, () => {
  if (setchart.value == 0) {
    type.value = "line";
    byRadioButton.value = true;
  } else if (setchart.value == 1) {
    type.value = "bar";
    byRadioButton.value = true;
  } else {
    byRadioButton.value = false;
  }

  getJson.value = !getJson.value;
});

const printChart = () => {
  print.value = !print.value;
};
</script>

<style></style>
