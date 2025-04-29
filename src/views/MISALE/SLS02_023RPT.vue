<template>
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
      class="grid grid-cols-2 grid-rows-1 justify-between bg-gray-200 rounded-lg h-32 items-center z-10">
      <div class="grid grid-cols-1 grid-rows-3 mt-2">
        <Datepicker2
          @startDate="startDate"
          @endDate="endDate"
          :closePopUp="closePopUp"
          ref="datepicker"
          @excelDate="excelDate"
          :mainName="'기간'" />
        <div class="flex justify-center items-center mr-36 ml-2">
          <div class="text-base font-semibold">구분 :</div>
          <div class="flex justify-center space-x-5 ml-5">
            <select
              name=""
              id=""
              class="h-8 rounded-lg w-32"
              @change="getSub"
              v-model="selectedMainCode">
              <option :value="'01'">직가맹</option>
              <option :value="'02'">지역</option>
              <option :value="'03'">매장유형</option>
            </select>

            <select
              name=""
              id=""
              class="h-8 rounded-lg w-32"
              v-model="selectedCode">
              <option :value="-1">전체</option>
              <option :value="i.lngCode" v-for="i in sublist">
                {{ i.strName }}
              </option>
            </select>
          </div>
        </div>
        <div
          class="flex justify-start items-center text-base text-nowrap font-semibold ml-36 pl-1">
          조회조건 :
          <div>
            <label for="daily" class="font-normal">
              <input
                type="checkbox"
                id="daily"
                class="ml-5"
                @change="seeDaily" />일자별
            </label>
          </div>
          <div>
            <label for="sum" class="font-normal">
              <input
                type="checkbox"
                id="sum"
                class="ml-5"
                @change="seeSum" />건수
            </label>
          </div>
        </div>
      </div>
      <div class="h-[75%] ml-5">
        <PickStorePlural
          @lngStoreCodes="lngStoreCodes"
          @lngStoreGroup="lngStoreGroup"
          @lngStoreAttrs="lngStoreAttrs"
          @excelStore="excelStore"
          @changeInit="changeInit"></PickStorePlural>
      </div>
    </div>
    <div class="w-full h-[82%]">
      <Realgrid
        :progname="'SLS02_023RPT_VUE'"
        :progid="progId"
        :setDynamicGrid="true"
        :rowData="rowData"
        :reload="reload"
        :setFooter="true"
        :setFooterCustomColumnId="['strJoinType']"
        :setFooterCustomText="['합계']"
        :hideColumnsId="hideColumnsId"
        :mergeMask="''"
        :setMergeMode="false"
        :setRowGroupSpan2="setRowGroupSpan"
        :documentTitle="'SLS02_023RPT'"
        :documentSubTitle="documentSubTitle"
        :rowStateeditable="false"
        :exporttoExcel="exportExcel">
      </Realgrid>
    </div>
  </div>
</template>

<script setup>
import {
  getJoinType,
  getSalesByPaymentType2Report,
  getStoreArea,
  getSubLease,
  isDynamicGrid,
} from "@/api/misales";
import Datepicker2 from "@/components/Datepicker2.vue";
import PageName from "@/components/pageName.vue";
import PickStorePlural from "@/components/pickStorePlural.vue";
import Realgrid from "@/components/realgrid.vue";
import { insertPageLog } from "@/customFunc/customFunc";
import { onMounted, ref } from "vue";
import { useStore } from "vuex";

const setGroupColumnId = ref("strStore");
const hideColumnsId = ref(["dtmDate"]);
const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);
const selectedstartDate = ref();
const selectedendDate = ref();
const setRowGroupSpan = ref("strJoinType");
const sublist = ref([]);
const store = useStore();
const selectedCode = ref("-1");
const isDynamicGrid2 = ref("");
const selectedMainCode = ref("01");
onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getJoinType(store.state.userData.lngStoreGroup, 0);
  sublist.value = res.data.List;

  const res2 = await isDynamicGrid(store.state.userData.lngStoreGroup);
  //console.log(res2);
  //isDynamicGrid2.value = res2.data.List[0].strDynamicGrid;
  if (res2.data.List[0].strDynamicGrid == "Y") {
    isDynamicGrid2.value = "Y";
    progId.value = 1;
  } else {
    isDynamicGrid2.value = "N";
    progId.value = 2;
  }
  reload.value = !reload.value;
});

const getSub = async (e) => {
  if (e.target.value == "01") {
    const res = await getJoinType(store.state.userData.lngStoreGroup, 0);
    sublist.value = res.data.List;
  } else if (e.target.value == "02") {
    const res = await getStoreArea(store.state.userData.lngStoreGroup, 0);
    sublist.value = res.data.List;
    //console.log(sublist.value);
  } else if (e.target.value == "03") {
    const res = await getSubLease(store.state.userData.lngStoreGroup);
    sublist.value = res.data.List;
  }
  selectedCode.value = -1;
};
const startDate = (e) => {
  //console.log(e);
  selectedstartDate.value = e;
};

const endDate = (e) => {
  //console.log(e);
  selectedendDate.value = e;
};

const tempSeeDaily = ref(false);
const reportCheckData = ref("0");
const progId = ref("1");

const seeDaily = (e) => {
  tempSeeDaily.value = e.target.checked;
  if (e.target.checked) {
    hideColumnsId.value = [];
  } else {
    hideColumnsId.value = ["dtmDate"];
  }
};

const loginedstrLang = store.state.userData.lngLanguage;

const datepicker = ref(null);
const closePopUp = ref(false);
const handleParentClick = (e) => {
  const datepickerEl = datepicker.value?.$el;
  if (datepickerEl && datepickerEl.contains(e.target)) {
    return;
  }
  closePopUp.value = !closePopUp.value;
};

/*
 *조회 처리 함수
 */
const searchButton = async () => {
  store.state.loading = true;
  try {
    initGrid();

    //그리드 갱신
    reload.value = !reload.value;

    const res = await getSalesByPaymentType2Report(
      groupCd.value,
      storeCd.value,
      selectedstartDate.value,
      selectedendDate.value,
      tempSeeDaily.value ? 1 : 0,
      isDynamicGrid2.value,
      selectedMainCode.value,
      selectedCode.value,
      setCnt.value
    );
    //console.log(res);
    rowData.value = res.data.List;

    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    //console.log(error);
  } finally {
    store.state.loading = false;
  }
};

const groupCd = ref("");
const storeCd = ref("");
const selectedStoreAttr = ref();

const lngStoreCodes = (e) => {
  initGrid();
  //console.log(e);
  storeCd.value = e;
};
const lngStoreGroup = (e) => {
  //console.log(e);
  groupCd.value = e;
};
const lngStoreAttrs = (e) => {
  initGrid();
  selectedStoreAttr.value = e;
  //console.log(e);
};

/*
그리드 초기화
*/
const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
};

//엑셀 버튼 처리 함수
const exportExcel = ref(false);
const excelButton = () => {
  let cond = "구분 : ";
  if (selectedMainCode.value == "01") {
    cond += "직가맹 ,";
  } else if (selectedMainCode.value == "02") {
    cond += "지역 ,";
  } else if (selectedMainCode.value == "03") {
    cond += "매장유형 ,";
  }

  if (selectedCode.value == -1) {
    cond += "전체 ";
  } else {
    cond += sublist.value.find(
      (item) => item.lngCode == selectedCode.value
    ).strName;
  }

  let cond2 = "조회조건 :";
  if (hideColumnsId.value.length == 0) {
    cond2 += "일자별,";
  }

  if (setCnt.value == 1) {
    cond2 += "건수,";
  }
  cond2 = cond2.substring(0, cond2.length - 1);
  documentSubTitle.value =
    selectedExcelDate.value +
    "\n" +
    selectedExcelStore.value +
    "\n" +
    cond +
    "\n" +
    cond2;
  //console.log(documentSubTitle.value);
  // 엑셀 기능 실행
  exportExcel.value = !exportExcel.value;
};

// 엑셀 추출
const documentSubTitle = ref("");
const selectedExcelDate = ref("");
const excelDate = (e) => {
  selectedExcelDate.value = e;
  //console.log(e);
};
const selectedExcelStore = ref("");
const excelStore = (e) => {
  selectedExcelStore.value = e;
  //console.log(e);
};

const setCnt = ref(0);
const seeSum = (e) => {
  if (e.target.checked) {
    setCnt.value = 1;
  } else {
    setCnt.value = 0;
  }
};

const changeInit = (e) => {
  initGrid();
};
</script>
