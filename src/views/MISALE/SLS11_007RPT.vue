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
      class="grid grid-cols-2 grid-rows-1 justify-between bg-gray-200 rounded-lg h-24 items-center z-10">
      <div class="grid grid-cols-1 grid-rows-2">
        <Datepicker2
          @startDate="startDate"
          @endDate="endDate"
          :closePopUp="closePopUp"
          ref="datepicker"
          :selectedGroup="selectedGroup"
          @excelDate="excelDate" />
        <div
          class="flex justify-start items-center text-base text-nowrap font-semibold ml-40">
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
            <label for="unite" class="font-normal">
              <input
                type="checkbox"
                id="unite"
                class="ml-5"
                @change="cellUnite"
                checked />셀병합
            </label>
          </div>
          <div>
            <label for="sum" class="font-normal">
              <input
                type="checkbox"
                id="sum"
                class="ml-5"
                @change="seeSum"
                checked />합계
            </label>
          </div>
        </div>
      </div>
      <div class="h-[75%] ml-5">
        <pickStoreRenew
          @lngStoreCode="selectedStoreCd"
          @lngStoreGroup="selectedGroupCd"
          @lngStoreAttrs="lngStoreAttrs"
          @excelStore="excelStore"
          @changeInit="changeInit"></pickStoreRenew>
      </div>
    </div>
    <div class="w-full h-[82%]">
      <Realgrid
        :progname="'SLS11_007RPT_VUE'"
        :progid="progId"
        :rowData="rowData"
        :reload="reload"
        :setFooter="true"
        :setFooterExpressions="setFooterExpressions"
        :setFooterColID="setFooterColID"
        :setGroupFooter="setGroupFooter"
        :setGroupColumnId="setGroupColumnId"
        :setGroupSumCustomColumnId="['dtmDate']"
        :setGroupSumCustomText="['소계']"
        :hideColumnsId="hideColumnsId"
        :setGroupFooterExpressions="setGroupFooterExpressions"
        :setGroupFooterColID="setGroupFooterColID"
        :mergeMask="''"
        :setMergeMode="false"
        :setRowGroupSpan2="setRowGroupSpan"
        :documentTitle="'SLS11_007RPT'"
        :rowStateeditable="false"
        :documentSubTitle="documentSubTitle"
        :exporttoExcel="exportExcel">
      </Realgrid>
    </div>
  </div>
</template>

<script setup>
import { getSalesByPaymentTypeReport } from "@/api/misales";
import Datepicker2 from "@/components/Datepicker2.vue";
import PageName from "@/components/pageName.vue";
import pickStoreRenew from "@/components/pickStoreRenew.vue";
import Realgrid from "@/components/realgrid.vue";
import { insertPageLog } from "@/customFunc/customFunc";
import { onMounted, ref, watch } from "vue";
import { useStore } from "vuex";

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
});

const setFooterColID = ref([
  "lngTotAmt",
  "lngActAmt",
  "lngCashAmt",
  "lngCreditAmt",
  "lngTicketAmt",
  "lngTrustAmt",
  "lngPointAmt",
  "lngPointCnt",
  "lngCashBagSAmt",
  "lngCashBagCnt",
  "lngCashBagAmt",
  "lngTMCAmt",
  "lngTMCCnt",
  "lngDCAmt",
  "lngDepositAmt",
  "lngRepayAmt",
  "lngGiftCardAmt",
]);
const setFooterExpressions = ref([
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
  "sum",
  "sum",
  "sum",
  "sum",
]);
const setGroupFooter = ref(false);
const setGroupFooterColID = ref([
  "lngTotAmt",
  "lngActAmt",
  "lngCashAmt",
  "lngCreditAmt",
  "lngTicketAmt",
  "lngTrustAmt",
  "lngPointAmt",
  "lngPointCnt",
  "lngCashBagSAmt",
  "lngCashBagCnt",
  "lngCashBagAmt",
  "lngTMCAmt",
  "lngTMCCnt",
  "lngDCAmt",
  "lngDepositAmt",
  "lngRepayAmt",
  "lngGiftCardAmt",
]);
const setGroupFooterExpressions = ref([
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
  "sum",
  "sum",
  "sum",
  "sum",
]);

const setGroupColumnId = ref("strStore");
const hideColumnsId = ref([]);
const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);
const selectedstartDate = ref();
const selectedendDate = ref();
const setRowGroupSpan = ref("");

const startDate = (e) => {
  console.log(e);
  selectedstartDate.value = e;
};

const endDate = (e) => {
  console.log(e);
  selectedendDate.value = e;
};

const tempSeeDaily = ref(false);
const reportCheckData = ref("0");
const progId = ref("1");

const seeDaily = (e) => {
  tempSeeDaily.value = e.target.checked;
  updateProgid();
};

const updateProgid = () => {
  if (tempSeeDaily.value) {
    reportCheckData.value = "1";
    progId.value = "2";
  } else {
    reportCheckData.value = "0";
    progId.value = "1";
  }
};

const store = useStore();
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

    if (tempCellUnite.value == true) {
      setRowGroupSpan.value = "strStore";
    } else {
      setRowGroupSpan.value = "";
    }

    //그리드 갱신
    reload.value = !reload.value;

    console.log(reportCheckData.value);

    const res = await getSalesByPaymentTypeReport(
      groupCd.value,
      storeCd.value,
      selectedstartDate.value,
      selectedendDate.value,
      reportCheckData.value
    );
    console.log(res);
    rowData.value = res.data.salesByPaymentType;

    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    console.log(error);
  } finally {
    store.state.loading = false;
  }
};

const groupCd = ref();
const storeCd = ref();
const selectedStoreAttr = ref();

const selectedStoreCd = (e) => {
  console.log(e);
  storeCd.value = e;
};
const selectedGroupCd = (e) => {
  console.log(e);
  groupCd.value = e;
};
const lngStoreAttrs = (e) => {
  initGrid();
  selectedStoreAttr.value = e;
  console.log(e);
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
  documentSubTitle.value =
    selectedExcelDate.value + "\n" + selectedExcelStore.value;
  console.log(documentSubTitle.value);
  // 엑셀 기능 실행
  exportExcel.value = !exportExcel.value;
};

// 엑셀 추출
const documentSubTitle = ref("");
const selectedExcelDate = ref("");
const excelDate = (e) => {
  selectedExcelDate.value = e;
  console.log(e);
};
const selectedExcelStore = ref("");
const excelStore = (e) => {
  selectedExcelStore.value = e;
  console.log(e);
};

const tempCellUnite = ref(true);
const cellUnite = (e) => {
  if (e.target.checked) {
    tempCellUnite.value = true;
    setRowGroupSpan.value = "strStore";
  } else {
    tempCellUnite.value = false;
    setRowGroupSpan.value = "";
  }
  reload.value = !reload.value;
};

watch([tempSeeDaily, reload], ([dailyValue, _]) => {
  setGroupFooter.value = dailyValue;
});

const seeSum = (e) => {
  if (e.target.checked) {
    setGroupColumnId.value = "strStore";
    reload.value = !reload.value;
  } else {
    setGroupColumnId.value = "";
    reload.value = !reload.value;
  }
};

const changeInit = (e) => {
  initGrid();
};
</script>
