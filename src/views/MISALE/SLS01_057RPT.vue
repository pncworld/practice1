<template>
  <div class="flex justify-between items-center w-full overflow-y-auto">
    <div class="flex justify-start w-full pl-12 pt-4">
      <div class="flex justify-start">
        <h1 class="font-bold text-sm md:text-2xl w-full">
          코너별 영수증별 매출 조회.
        </h1>
      </div>
    </div>
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
    class="grid grid-rows-2 grid-cols-3 justify-between bg-gray-200 rounded-lg h-24 items-center z-10">
    <div>
      <Datepicker1
        @dateValue="dateValue"
        @year="year"
        @month="month"
        @day="day"
        @excelDate="excelDate"></Datepicker1>
    </div>
    <div class="-ml-10">
      <PickStoreCorner
        @lngStoreGroup="lngStoreGroup"
        @lngStoreCode="lngStoreCode"
        @lngAreaCode="lngAreaCode"
        @excelStore="excelStore"></PickStoreCorner>
    </div>
    <div>
      <PosList
        :groupCd="groupCd"
        :storeCd="storeCd"
        @posNo="posNo"
        class="!ml-3"
        :init="init"></PosList>
    </div>
    <div class="text-base font-semibold w-[90%] ml-10 z-10">
      영수증 번호:
      <input
        type="text"
        class="border rounded-lg pl-1 h-10 !w-36 z-30"
        v-model="receiptNo" />
    </div>
    <div class="grid !mr-80 items-center relative">
      <DisCountCdList
        class="flex absolute -right-1 w-[150%]"
        @disCountCd="DisCountCd"
        @discountNm="discountNm"
        :groupCd="groupCd"
        :storeCd="storeCd"
        :init="init"></DisCountCdList>
    </div>
    <div class="flex justify-center items-center mt-3 ml-9">
      <PayCodeList
        class="flex -mt-5"
        @payCd="selectedpayCd"
        @payNm="payNm"
        :groupCd="groupCd"
        :storeCd="storeCd"
        :init="init">
      </PayCodeList>
    </div>
  </div>

  <div class="grid grid-rows-1 grid-cols-[7fr,3fr] h-[80%] mt-5">
    <div>
      <span class="flex justify-start"
        >*영수내역을 선택하시면 상세내역을 확인할 수 있습니다.</span
      >
      <Realgrid
        :progname="'SLS01_057RPT_VUE'"
        :progid="1"
        :rowData="rowData"
        :valuesData="valuesData"
        :documentTitle="'SLS01_057RPT'"
        :labelsData="labelsData"
        :labelingColumns="'strVoidFlag'"
        :selectionStyle="'singleRow'"
        @clickedRowData="clickedRowData"
        :initSelect="true"
        :setStateBar="false"
        :exporttoExcel="exceloutput"
        :documentSubTitle="documentSubTitle"></Realgrid>
    </div>
    <div class="grid grid-rows-3 grid-cols-1">
      <div>
        <span class="flex justify-start">고객 정보</span>
        <Realgrid
          :progname="'SLS02_011RPT_VUE'"
          :progid="2"
          :rowData="rowData2"
          :setStateBar="false"></Realgrid>
      </div>
      <div class="mt-5">
        <span class="flex justify-start">주문 정보</span>
        <Realgrid
          :progname="'SLS02_011RPT_VUE'"
          :progid="3"
          :rowData="rowData3"
          :setStateBar="false"></Realgrid>
      </div>
      <div class="mt-5">
        <span class="flex justify-start">결제 정보</span>
        <Realgrid
          :progname="'SLS02_011RPT_VUE'"
          :progid="4"
          :rowData="rowData4"
          :setStateBar="false"></Realgrid>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  getCustInfo,
  getOrderInfo,
  getPayInfo,
  getReceiptbyCorner,
  getReceiptDatas,
} from "@/api/misales";
import PickStoreCorner from "@/components/pickStoreCorner.vue";
import Datepicker1 from "@/components/Datepicker1.vue";
import DisCountCdList from "@/components/disCountCdList.vue";
import PayCodeList from "@/components/payCodeList.vue";
import PosList from "@/components/posList.vue";
import Realgrid from "@/components/realgrid.vue";
import Swal from "sweetalert2";
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
import { insertPageLog } from "@/customFunc/customFunc";

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
});
const selectedDate = ref();

const dateValue = (e) => {
  selectedDate.value = e;
  console.log(selectedDate.value);
  initGrid();
};
const year = (e) => {
  console.log(e);
};
const month = (e) => {
  console.log(e);
};
const day = (e) => {
  console.log(e);
};

const receiptNo = ref();
const initCheckBox = ref(false);
const initSearchWord = ref(false);
const store = useStore();
const loginedstrLang = store.state.userData.lngLanguage;
console.log(store);

const afterSearch = ref(false);
const searchButton = async () => {
  // initCheckBox.value = !initCheckBox.value
  // initSearchWord.value = !initSearchWord.value
  if (storeCd.value == 0) {
    Swal.fire({
      title: "경고",
      text: "매장을 선택하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  store.state.loading = true;
  try {
    initGrid();
    const res = await getReceiptbyCorner(
      groupCd.value,
      storeCd.value,
      selectedStoreAreaCode.value,
      selectedPosNo.value,
      selectedDate.value,
      receiptNo.value,
      disCountCd.value,
      payCd.value,
      loginedstrLang
    );
    console.log(res);

    rowData.value = res.data.List;
    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
  } finally {
    store.state.loading = false;
  }
};
const groupCd = ref();
const storeCd = ref();
const selectedExcelStore = ref();
const selectedExcelDate = ref();
const selectedStoreAreaCode = ref();
const init = ref(false);
const documentSubTitle = ref("");
const lngStoreCode = async (e) => {
  console.log(e);
  storeCd.value = e;

  initGrid();
  selectedPosNo.value = "0";
  receiptNo.value = "";
  init.value = !init.value;
};
const lngStoreGroup = (e) => {
  console.log(e);
  groupCd.value = e;
};
const lngAreaCode = (e) => {
  initGrid();
  console.log(e);
  selectedStoreAreaCode.value = e;
};
const excelStore = (e) => {
  console.log(e);
  selectedExcelStore.value = e;
};
const excelDate = (e) => {
  console.log(e);
  selectedExcelDate.value = e;
};
const rowData = ref([]);
const rowData2 = ref([]);
const rowData3 = ref([]);
const rowData4 = ref([]);

const selectedPosNo = ref();
const posNo = (e) => {
  console.log(e);
  if (e == null) {
    selectedPosNo.value = 0;
  } else {
    selectedPosNo.value = e;
  }
};

const disCountCd = ref("");
const disCountNm = ref("");
const DisCountCd = (e) => {
  console.log(e);
  if (e == null) {
    disCountCd.value = 0;
  } else {
    disCountCd.value = e;
  }
};
const discountNm = (e) => {
  console.log(e);
  disCountNm.value = e;
};

const payCd = ref("");
const paynm = ref("");
const selectedpayCd = (e) => {
  if (e == null) {
    payCd.value = 0;
  } else {
    payCd.value = e;
  }
};
const payNm = (e) => {
  paynm.value = e;
};

const valuesData = ref([
  ["Sales Cancellation", "Menu Correction", "Order Cancellation"],
]);
const labelsData = ref([["매출취소", "메뉴정정", "주문취소"]]);

const clickedRowData = async (e) => {
  console.log(e);
  const seqId = e[0];

  const res = await getCustInfo(groupCd.value, storeCd.value, seqId);

  rowData2.value = res.data.CUSTOMER;

  const res2 = await getOrderInfo(groupCd.value, storeCd.value, seqId);

  rowData3.value = res2.data.ORDER;

  const res3 = await getPayInfo(
    groupCd.value,
    storeCd.value,
    seqId,
    loginedstrLang
  );

  rowData4.value = res3.data.PAYLIST;

  console.log(res3);
};

const exceloutput = ref(false);
const excelButton = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 진행해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  let cond = "포스번호 : ";
  cond += selectedPosNo.value == 0 ? "전체" : selectedPosNo.value;
  let cond2 = "영수증번호 : ";
  cond2 += receiptNo.value;
  let cond3 = "할인코드 : ";
  cond3 += disCountNm.value;
  let cond4 = "지불코드 : ";
  cond4 += paynm.value;

  documentSubTitle.value =
    selectedExcelDate.value +
    "\n" +
    selectedExcelStore.value +
    "\n" +
    cond +
    "\n" +
    cond2 +
    "\n" +
    cond3 +
    "\n" +
    cond4;
  exceloutput.value = !exceloutput.value;
};
const initGrid = () => {
  if (rowData.value.length != 0) {
    rowData.value = [];
  }
  if (rowData2.value.length != 0) {
    rowData2.value = [];
  }
  if (rowData3.value.length != 0) {
    rowData3.value = [];
  }
  if (rowData4.value.length != 0) {
    rowData4.value = [];
  }
};

const selectedStoreAttr = ref();
const lngStoreAttrs = (e) => {
  selectedStoreAttr.value = e;
  initGrid();
  init.value = !init.value;
};
</script>
