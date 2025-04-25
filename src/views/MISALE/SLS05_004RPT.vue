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
      <div class="grid grid-cols-1 grid-rows-3">
        <div class="flex">
          <label for="daily" class="font-thin inline-flex">
            <input
              type="checkbox"
              id="daily"
              @change="seeDaily"
              class="ml-20 mt-5" />
          </label>
          <Datepicker2
            class="pr-52"
            @startDate="startDate"
            @endDate="endDate"
            @acceptDate="acceptDate"
            :closePopUp="closePopUp"
            ref="datepicker"
            :selectedRadioBox="selectedRadioBox"
            :selectedGroup="selectedGroup"
            :orgAcceptDate="orgAcceptDate"
            @excelDate="excelDate"></Datepicker2>
        </div>
        <div
          class="flex justify-start items-center text-base text-nowrap font-semibold ml-44">
          매입사 :
          <div class="flex ml-7 space-x-3 mt-1">
            <v-select
              v-model="selectCardCorp"
              :options="cardCorp"
              placeholder="전체"
              label="strBuyName"
              class="w-48 !h-8 bg-white"
              clearable="true" />
          </div>
        </div>
        <div
          class="flex justify-start items-center text-base text-nowrap font-semibold ml-40">
          조회조건 :
          <div>
            <label for="saleDay" class="font-normal">
              <input
                type="radio"
                id="saleDay"
                value="01"
                v-model="selectedRadioBox"
                class="ml-5" />
              영업일
            </label>
          </div>
          <div>
            <label for="acceptDay" class="font-normal">
              <input
                type="radio"
                id="acceptDay"
                value="02"
                v-model="selectedRadioBox"
                class="ml-5" />
              승인일
            </label>
          </div>
        </div>
      </div>
      <div class="h-[75%] ml-5">
        <label for="daily" class="font-thin inline-flex">
          <input type="checkbox" id="daily" @change="seeStore" />
          <pickStoreSingle
            @lngStoreCode="lngStoreCodes"
            @lngStoreGroup="lngStoreGroup"
            @lngStoreAttrs="lngStoreAttrs"
            @lngSupervisor="lngSupervisor"
            @lngStoreTeam="lngStoreTeam"
            @excelStore="excelStore" />
        </label>
      </div>
    </div>
    <div class="w-full h-[82%]">
      <Realgrid
        :progname="'SLS05_004RPT_VUE'"
        :progid="progId"
        :rowData="rowData"
        :reload="reload"
        :setFooter="true"
        :setFooterExpressions="setFooterExpressions"
        :setFooterColID="setFooterColID"
        :setGroupFooter="setGroupFooter"
        :setGroupColumnId="'strStoreName,dtmDate'"
        :setGroupSumCustomText="['소계']"
        :setGroupSumCustomColumnId="setGroupSumCustomColumnId"
        :setGroupSumCustomLevel="3"
        :setGroupSummaryCenterIds="setGroupSummaryCenterIds"
        :setGroupFooterExpressions="setGroupFooterExpressions"
        :setGroupFooterColID="setGroupFooterColID"
        :documentTitle="'SLS05_004RPT'"
        :rowStateeditable="false"
        :documentSubTitle="documentSubTitle"
        :exporttoExcel="exportExcel">
      </Realgrid>
      <!-- <Realgrid :progname="'SLS05_004RPT_VUE'" :progid="1" :rowData="rowData" :reload="reload" 
         :setFooter="true" :setFooterExpressions="setFooterExpressions" :setFooterColID="setFooterColID"
         :exporttoExcel="exportExcel" :documentTitle="'SLS05_004RPT'" :documentSubTitle="documentSubTitle" 
      </Realgrid> -->
    </div>
  </div>
</template>

<script setup>
import { getCardCorp, getCardSalesSumReport } from "@/api/misales";
import Datepicker2 from "@/components/Datepicker2.vue";
import PageName from "@/components/pageName.vue";
import pickStoreSingle from "@/components/pickStoreSingle.vue";
import Realgrid from "@/components/realgrid.vue";
import { insertPageLog } from "@/customFunc/customFunc";
import Swal from "sweetalert2";
import { onMounted, ref, watch } from "vue";
import { useStore } from "vuex";

const setFooterColID = ref([
  "lngTotalCnt",
  "lngTotalAmt",
  "lngApprovalCnt",
  "lngApprovalAmt",
  "lngCancleCnt",
  "lngCancleAmt",
  "lngSumCnt",
  "lngSumAmt",
  "lngCommission",
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
]);
const setGroupFooter = ref(true);
const setGroupFooterColID = ref([
  "lngTotalCnt",
  "lngTotalAmt",
  "lngApprovalCnt",
  "lngApprovalAmt",
  "lngCancleCnt",
  "lngCancleAmt",
  "lngSumCnt",
  "lngSumAmt",
  "lngCommission",
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
]);
const setGroupSummaryCenterIds = ref("dtmDate, strBuyName");
const setGroupSumCustomColumnId = ref(["strBuyName"]);
const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);
const selectedstartDate = ref();
const selectedendDate = ref();
const orgAcceptDate = ref();

const startDate = (e) => {
  console.log(e);
  selectedstartDate.value = e;
  if (selectedRadioBox.value == "02") {
    if (selectedstartDate.value > orgAcceptDate.value) {
      Swal.fire({
        title: "경고",
        text: "승인일 기준 조회는 " + orgAcceptDate.value + "까지 가능합니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
    }
  }
};

const endDate = (e) => {
  console.log(e);
  selectedendDate.value = e;
  if (selectedRadioBox.value == "02") {
    if (selectedendDate.value > orgAcceptDate.value) {
      Swal.fire({
        title: "경고",
        text: "승인일 기준 조회는 " + orgAcceptDate.value + "까지 가능합니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
    }
  }
};

const acceptDate = (e) => {
  console.log(e);
  orgAcceptDate.value = e;
};

const tempSeeDaily = ref(false);
const tempSeeStore = ref(false);
const reportCheckData = ref("0");
const progId = ref("1");

const seeDaily = (e) => {
  tempSeeDaily.value = e.target.checked;
  updateProgid();
};

const seeStore = (e) => {
  tempSeeStore.value = e.target.checked;
  updateProgid();
};

const updateProgid = () => {
  if (tempSeeDaily.value && tempSeeStore.value) {
    reportCheckData.value = "012";
    setGroupSumCustomColumnId.value = ["strBuyName"];
    progId.value = "4";
  } else if (tempSeeDaily.value) {
    reportCheckData.value = "01";
    setGroupSumCustomColumnId.value = ["strBuyName"];
    progId.value = "2";
  } else if (tempSeeStore.value) {
    reportCheckData.value = "02";
    setGroupSumCustomColumnId.value = ["strBuyName"];
    progId.value = "3";
  } else {
    reportCheckData.value = "0";
    setGroupSumCustomColumnId.value = ["strBuyName"];
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

// 조회조건 라디오박스 이벤트 (영업일, 승인일)
const selectedRadioBox = ref("01"); // 기본 선택값

/*
 *조회 처리 함수
 */
const searchButton = async () => {
  store.state.loading = true;
  try {
    initGrid();

    //그리드 갱신
    reload.value = !reload.value;

    //매장 선택
    // let selectedStorearr;
    // if (selectedStores.value == undefined || selectedStores.value.length == 0 || selectedStores.value == 0) {
    //   selectedStorearr = 0
    // } else {
    //   selectedStorearr = selectedStores.value
    // }

    // console.log(selectedStorearr)

    //매입사코드 선택 콤보박스
    let selectedBuyCodeValue;
    if (
      selectedBuyCode.value == undefined ||
      selectedBuyCode.value.length == 0 ||
      selectedBuyCode.value == 0
    ) {
      selectedBuyCodeValue = 0;
    } else {
      selectedBuyCodeValue = selectedBuyCode.value;
    }

    console.log(selectedBuyCodeValue);

    console.log(selectedRadioBox.value);

    console.log(reportCheckData.value);

    const res = await getCardSalesSumReport(
      selectedGroup.value,
      selectedStoreAttrs.value,
      selectedStoreTeam.value,
      selectedStoreSuperVisor.value,
      selectedStores.value,
      selectedstartDate.value,
      selectedendDate.value,
      reportCheckData.value,
      selectedRadioBox.value,
      selectedBuyCodeValue
    );
    console.log(res);
    rowData.value = res.data.cardSalesSum;

    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    console.log(error);
  } finally {
    store.state.loading = false;
  }
};

/* 매장 컴포넌트 관련 함수 */
const selectedGroup = ref();
const selectedStores = ref();
const selectedStoreAttrs = ref();
const selectedStoreTeam = ref();
const selectedStoreSuperVisor = ref();
const lngStoreGroup = (e) => {
  initGrid();
  console.log(e);
  selectedGroup.value = e;
};
const lngStoreCodes = (e) => {
  initGrid();
  selectCardCorp.value = null;
  selectedStores.value = e;
  console.log(e);
};
const lngStoreAttrs = (e) => {
  initGrid();
  selectedStoreAttrs.value = e;
  console.log(e);
};
const lngSupervisor = (e) => {
  initGrid();
  selectedStoreSuperVisor.value = e;
  console.log(e);
};
const lngStoreTeam = (e) => {
  initGrid();
  selectedStoreTeam.value = e;
  console.log(e);
};

/* 매입사 콤보박스 */
const selectCardCorp = ref(null);
const cardCorp = ref([]);
const selectedBuyCode = ref("");

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getCardCorp(selectedGroup.value, selectedStores.value, 1);
  cardCorp.value = res.data.cardCorpList;
  console.log(cardCorp.value);
});

watch([selectedGroup, selectedStores], async () => {
  console.log(selectedGroup.value, selectedStores.value);
  const res = await getCardCorp(selectedGroup.value, selectedStores.value, 1);
  cardCorp.value = res.data.cardCorpList;
  console.log(cardCorp.value);
});

watch(selectCardCorp, (newValue) => {
  selectedBuyCode.value = newValue ? newValue.strBuyCode : "";
  console.log(selectedBuyCode.value);
});

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
  if (selectedExcelStore.value == "매장명 : 선택") {
    documentSubTitle.value = selectedExcelDate.value + "\n" + "매장명 : 전체";
  } else {
    documentSubTitle.value =
      selectedExcelDate.value + "\n" + selectedExcelStore.value;
  }
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
</script>
