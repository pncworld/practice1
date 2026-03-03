/*--############################################################################
# Filename : SLS07_006INS.vue                                                  
# Description : 매출관리 > 매출 집계 현황 > 일매출 보고                         
# Date :2025-05-16                                                             
# Author : 권맑음                     
################################################################################*/

<template>
  <div class="flex justify-between items-center w-full overflow-y-hidden">
    <PageName></PageName>
    <div class="flex justify-center mr-9 space-x-2 pr-5">
      <button @click="sendButton" class="button sms w-24">문자 전송</button>
      <button @click="searchButton" class="button search md:w-auto w-14">
        조회
      </button>
      <button @click="saveButton" class="button save md:w-auto w-14">
        저장
      </button>
      <button @click="excelButton" class="button save w-auto excel">
        엑셀
      </button>
    </div>
  </div>
  <div
    class="grid grid-rows-2 grid-cols-1 justify-between bg-gray-200 rounded-lg h-28 items-start z-10">
    <div class="ml-16">
      <PickStoreRenew
        @lngStoreCode="lngStoreCode"
        @lngStoreGroup="lngStoreGroup"
        @lngStoreAttrs="lngStoreAttrs"
        @excelStore="excelStore"
        :placeholderName="'선택'">
      </PickStoreRenew>
    </div>
    <div class="ml-12">
      <div class="flex space-x-5">
        <Datepicker1
          :initToday="1"
          @dateValue="dateValue1"
          @excelDate="excelDate"
          :mainName="'보고일자'"></Datepicker1>
        <Datepicker1
          :initToday="initcompday"
          @dateValue="dateValue2"
          @excelDate="excelDate2"
          :reload="reload"
          :reloadDate="reloadDate"
          :mainName="'비교일자(전년)'"></Datepicker1>
        <Datepicker1
          :initToday="initcompday2"
          @dateValue="dateValue3"
          @excelDate="excelDate3"
          :reloadDate="reloadDate"
          :reload="reload"
          :mainName="'비교일자(전전년)'"></Datepicker1>
      </div>
    </div>
  </div>
  <div class="h-[20vh]">
    <Realgrid
      :progname="'SLS07_006INS_VUE'"
      :progid="1"
      :rowData="rowData"
      :reload="reload"
      :exporttoExcel="exportExcel"
      :documentSubTitle="documentSubTitle"
      :documentTitle="'SLS07_006INS'"
      :suffixColumnPercent="[
        'percentGoal',
        'percentLastYear',
        'percentYearBefore',
      ]"
      :rowStateeditable="false">
    </Realgrid>
  </div>
  <div class="grid grid-rows-1 grid-cols-2">
    <div>
      <div class="flex text-2xl justify-start ml-5 mt-2">※입력 사항</div>
      <textarea
        name=""
        id=""
        v-model="inputview"
        class="border shadow-lg h-[40vh] w-[35vw] pl-1 mt-2"></textarea>
    </div>
    <div>
      <div class="flex text-2xl justify-start ml-5 mt-2">※미리 보기</div>
      <textarea
        name=""
        id=""
        class="border shadow-lg h-[40vh] w-[35vw] pl-1 mt-2"
        v-model="preview"
        disabled></textarea>
    </div>
  </div>
</template>

<script setup>
import {
  getDaySalesReport2,
  saveDailyReportComments,
  sendSMS,
} from "@/api/misales";
import Datepicker1 from "@/components/Datepicker1.vue";
import PageName from "@/components/pageName.vue";
import PickStoreRenew from "@/components/pickStoreRenew.vue";
import Realgrid from "@/components/realgrid.vue";
import {
  formatLocalDate2,
  formatLocalDate3,
  formatNumberWithCommas,
} from "@/customFunc/customFunc";
import store from "@/store";
import Swal from "sweetalert2";
import { nextTick, onMounted, ref } from "vue";

onMounted(() => {});
const reportDay = ref("");
const compday = ref("");
const compday2 = ref("");
const reloadDate = ref("");
const afterSearch = ref(false);
const rowData = ref([]);
const phoneNums = ref([]);
const phoneNums2 = ref([]);
const initcompday2 = ref(1);
const initcompday = ref(1);
const reload = ref(false);
const dateValue1 = (e) => {
  reportDay.value = e;

  initcompday2.value = -(
    getDaysBetween(
      getLastYearBeforeSameWeekday(new Date(reportDay.value)),
      new Date(reportDay.value)
    ) - 1
  );

  initcompday.value = -(
    getDaysBetween(
      getLastYearSameWeekday(new Date(reportDay.value)),
      new Date(reportDay.value)
    ) - 1
  );
  reloadDate.value = e;
  reload.value = !reload.value;
};

const dateValue2 = (e) => {
  compday.value = e;
};
const dateValue3 = (e) => {
  compday2.value = e;
};

const searchButton = async () => {
  if (storeCd.value == 0) {
    Swal.fire({
      title: "경고",
      text: "매장을 선택하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  try {
    store.state.loading = true;
    initGrid();

    const reportday_1 = reportDay.value.substring(0, 8) + "01";
    const compday_1 = compday.value.substring(0, 8) + "02"; // 2
    const compday2_1 = compday2.value.substring(0, 8) + "04"; // 4

    const res = await getDaySalesReport2(
      groupCd.value,
      storeCd.value,
      reportDay.value,
      compday.value,
      compday2.value,
      reportday_1,
      compday_1,
      compday2_1
    );
    ////console.log(res);
    rowData.value = res.data.List;

    preview.value =
      "[ " +
      storeNm.value +
      "]" +
      "\n" +
      formatLocalDate3(new Date(res.data.List2[0].dtmDate.split(" ")[0])) +
      "\n" +
      "\n" +
      "--비교일자" +
      "\n" +
      "전년 : " +
      formatLocalDate3(new Date(compday.value)) +
      "\n" +
      "전전년 : " +
      formatLocalDate3(new Date(compday2.value)) +
      "\n" +
      "\n";

    for (let i = 0; i < res.data.List.length; i++) {
      preview.value +=
        "--" +
        res.data.List[i].strName +
        "\n" +
        "재작년 : " +
        formatNumberWithCommas(res.data.List[i].lngYearBeforeAmount) +
        (res.data.List[i].strName == "객수 보고" ? "명" : "원") +
        "\n" +
        "전년 : " +
        formatNumberWithCommas(res.data.List[i].lngLastYearAmount) +
        (res.data.List[i].strName == "객수 보고" ? "명" : "원") +
        "\n" +
        "금년 : " +
        formatNumberWithCommas(res.data.List[i].lngCurYearAmount) +
        (res.data.List[i].strName == "객수 보고" ? "명" : "원") +
        "\n" +
        "재작년 대비 : " +
        formatNumberWithCommas(res.data.List[i].percentYearBefore) +
        "%" +
        "\n" +
        "전년 대비 : " +
        formatNumberWithCommas(res.data.List[i].percentLastYear) +
        "%" +
        "\n" +
        "\n";

      if (res.data.List[i].strName == "월누계 매출") {
        preview.value +=
          "--월누계 목표매출" +
          "\n" +
          "목표 : " +
          formatNumberWithCommas(res.data.List[i].lngGoalAmount) +
          "원" +
          "\n" +
          "금년 : " +
          formatNumberWithCommas(res.data.List[i].lngCurYearAmount) +
          "원" +
          "\n" +
          "목표 대비 달성율 : " +
          formatNumberWithCommas(res.data.List[i].percentGoal) +
          "%" +
          "\n";
      }
    }
    const issueNote = res.data.List2?.[0]?.strIssueNote ?? "";

    // 금일평당매출
    const lngCurYearAmount = res.data.List[0].lngCurYearAmount ?? 0;
    const lngFloorSpace = res.data.List4?.[0]?.lngFloorSpace ?? 0;
    const salePerSquareMeter = lngFloorSpace > 0 ? Math.round(lngCurYearAmount / lngFloorSpace) : 0;

    // 금일회전율보고
    const lngTable = res.data.List4?.[0]?.lngTable ?? 0;
    const lunchCustCnt = res.data.List5?.[0]?.lunchCustCnt ?? 0;
    const dinnerCustCnt = res.data.List5?.[0]?.dinnerCustCnt ?? 0;
    const lunchRotationRate =
      lngTable > 0 ? Math.round((lunchCustCnt / lngTable) * 10) / 10 : 0;
    const dinnerRotationRate =
      lngTable > 0 ? Math.round((dinnerCustCnt / lngTable) * 10) / 10 : 0;
    const totalRotationRate = Math.round((lunchRotationRate + dinnerRotationRate) * 10) / 10;

    const deliveryCnt = res.data.List6?.[0]?.deliveryCnt ?? 0;
    const deliveryCustCnt = res.data.List6?.[0]?.deliveryCustCnt ?? 0;
    const deliverySaleAmt = res.data.List6?.[0]?.deliverySaleAmt ?? 0;
    const takeoutCnt = res.data.List6?.[0]?.takeoutCnt ?? 0;
    const takeoutCustCnt = res.data.List6?.[0]?.takeoutCustCnt ?? 0;
    const takeoutSaleAmt = res.data.List6?.[0]?.takeoutSaleAmt ?? 0;

    const totalDeliveryTakeoutSale = Number(deliverySaleAmt) + Number(takeoutSaleAmt);
    const totalDeliveryTakeoutCnt = Number(deliveryCnt) + Number(takeoutCnt);
    const totalDeliveryTakeoutCust = Number(deliveryCustCnt) + Number(takeoutCustCnt);
    const deliveryTakeoutSalePercent =
      lngCurYearAmount > 0
        ? Math.round((totalDeliveryTakeoutSale / lngCurYearAmount) * 100)
        : 0;
    const deliverySalePercent =
      totalDeliveryTakeoutSale > 0
        ? Math.round((Number(deliverySaleAmt) / totalDeliveryTakeoutSale) * 100)
        : 0;
    const takeoutSalePercent =
      totalDeliveryTakeoutSale > 0
        ? Math.round((Number(takeoutSaleAmt) / totalDeliveryTakeoutSale) * 100)
        : 0;
    const deliveryCntPercent =
      totalDeliveryTakeoutCnt > 0
        ? Math.round((Number(deliveryCnt) / totalDeliveryTakeoutCnt) * 100)
        : 0;
    const takeoutCntPercent =
      totalDeliveryTakeoutCnt > 0
        ? Math.round((Number(takeoutCnt) / totalDeliveryTakeoutCnt) * 100)
        : 0;
    const deliveryCustPercent =
      totalDeliveryTakeoutCust > 0
        ? Math.round((Number(deliveryCustCnt) / totalDeliveryTakeoutCust) * 100)
        : 0;
    const takeoutCustPercent =
      totalDeliveryTakeoutCust > 0
        ? Math.round((Number(takeoutCustCnt) / totalDeliveryTakeoutCust) * 100)
        : 0;

    const inputTemplate =
      // "<일일 매출 요약>" +
      // "\n" +
      "- 일 총근무시간 : 시간" +
      "\n" +
      "- 금일인시매출 : 원" +
      "\n" +
      "- 금일평당매출 : " + formatNumberWithCommas(salePerSquareMeter) + "원" +
      "\n" +
      "- 금일회전율보고" +
      "\n" +
      "  점심 (11:30~17:00) : " + Number(lunchRotationRate).toFixed(1) + "회전" +
      "\n" +
      "  저녁 (17:00~22:00) : " + Number(dinnerRotationRate).toFixed(1) + "회전" +
      "\n" +
      "  회전율합계 : " + Number(totalRotationRate).toFixed(1) + "회전" +
      "\n" +
      "\n" +
      "<배달 및 포장매출현황>" +
      "\n" +
      "*포장/배달 총매출 : " + formatNumberWithCommas(totalDeliveryTakeoutSale) + "원(" + deliveryTakeoutSalePercent + "%)" +
      "\n" +
      "-배달매출 : " + formatNumberWithCommas(deliverySaleAmt) + "원(" + deliverySalePercent + "%)" +
      "\n" +
      "-포장매출 : " + formatNumberWithCommas(takeoutSaleAmt) + "원(" + takeoutSalePercent + "%)" +
      "\n" +
      "\n" +
      "*포장/배달 총건수 : " + formatNumberWithCommas(totalDeliveryTakeoutCnt) + "건" +
      "\n" +
      "- 배달앱 : " + formatNumberWithCommas(deliveryCnt) + "건(" + deliveryCntPercent + "%)" +
      "\n" +
      "- 전화 : " + formatNumberWithCommas(takeoutCnt) + "건(" + takeoutCntPercent + "%)" +
      "\n" +
      "\n" +
      "*포장/배달 총객수 : " + formatNumberWithCommas(totalDeliveryTakeoutCust) + "명" +
      "\n" +
      "- 배달앱 : " + formatNumberWithCommas(deliveryCustCnt) + "명(" + deliveryCustPercent + "%)" +
      "\n" +
      "- 전화 : " + formatNumberWithCommas(takeoutCustCnt) + "명(" + takeoutCustPercent + "%)" +
      "\n" +
      "\n" +
      "<상품권 내역>" +
      "\n" +
      "\n" +
      "\n" +
      "\n" +
      "\n" +
      "\n" +
      "- 금일 하루도 수고 하셨습니다.";

    preview.value += "\n" + "입력사항" + "\n" + (issueNote || inputTemplate);
    inputview.value = issueNote || inputTemplate;
    oriinputview.value = JSON.parse(
      JSON.stringify(issueNote || inputTemplate)
    );
    phoneNums.value = res.data.List3.map((item) => item.strPhoneNum).join(
      "\u200B"
    );
    phoneNums2.value = res.data.List3.map((item) => item.strCallingNum).join(
      "\u200B"
    );
    //preview.value += '월누계 목표매출' + '\n' + '목표 : ' +res.data.List[i].lngGoalAmount + '\n' + '금년 : ' + res.data.List[i].
    afterSearch.value = true;
  } catch (error) {
  } finally {
    store.state.loading = false;
  }
};

const saveButton = async () => {
  if (storeCd.value == 0) {
    Swal.fire({
      title: "경고",
      text: "매장을 선택하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (inputview.value == "") {
    Swal.fire({
      title: "경고",
      text: "입력사항을 먼저 입력해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  if (oriinputview.value == inputview.value) {
    Swal.fire({
      title: "경고",
      text: "입력사항을 수정해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  try {
    store.state.loading = true;
    const res = await saveDailyReportComments(
      groupCd.value,
      storeCd.value,
      reportDay.value,
      inputview.value
    );

    ////console.log(res);
    Swal.fire({
      title: "완료",
      text: "저장이 완료되었습니다.",
      icon: "success",
      confirmButtonText: "확인",
    });
  } catch (error) {
  } finally {
    store.state.loading = false;
    searchButton();
  }
};

const sendButton = async () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  try {
    store.state.loading = true;
    const res = await sendSMS(
      groupCd.value,
      storeCd.value,
      `${storeNm.value}-일 매출 보고`,
      preview.value,
      2,
      "",
      1,
      "",
      "",
      phoneNums.value,
      phoneNums2.value,
      groupCd.value,
      "111.111.111.111"
    );

    ////console.log(res);
    store.state.loading = false;
    if (res.status == 200) {
      Swal.fire({
        title: "성공",
        text: "문자 전송을 완료하였습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
    }
  } catch (error) {
  } finally {
    store.state.loading = false;
  }
};

const exceldate = ref("");
const exceldate2 = ref("");
const exceldate3 = ref("");
const excelDate = (e) => {
  exceldate.value = e;
};
const excelDate2 = (e) => {
  exceldate2.value = e;
};
const excelDate3 = (e) => {
  exceldate3.value = e;
};
const exportExcel = ref(false);
const documentSubTitle = ref("");
const excelButton = () => {
  documentSubTitle.value =
    excelstore.value +
    "\n" +
    exceldate.value +
    "\n" +
    exceldate2.value +
    "\n" +
    exceldate3.value;
  exportExcel.value = !exportExcel.value;
};

const groupCd = ref("");
const lngStoreGroup = (e) => {
  groupCd.value = e;
};
const storeCd = ref("");
const lngStoreCode = (e) => {
  storeCd.value = e;
  initGrid();
};
const lngStoreAttrs = (e) => {
  initGrid();
};

const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
  afterSearch.value = false;
  inputview.value = "";
  preview.value = "";
};

const preview = ref("");
const inputview = ref("");
const oriinputview = ref("");
const storeNm = ref("");
const excelstore = ref("");
const excelStore = (e) => {
  storeNm.value = e.split(":")[1];
  excelstore.value = e;
};

function getDaysBetween(date1, date2) {
  const msPerDay = 1000 * 60 * 60 * 24;
  const diffTime = Math.abs(date2 - date1); // 밀리초 차이
  return Math.round(diffTime / msPerDay); // 일 수 차이
}

function getLastYearSameWeekday(date = new Date()) {
  const currentDayOfWeek = date.getDay(); // 0 (일) ~ 6 (토)
  const lastYearDate = new Date(date);
  lastYearDate.setFullYear(date.getFullYear() - 1);

  const lastYearDayOfWeek = lastYearDate.getDay();
  const diff = currentDayOfWeek - lastYearDayOfWeek;
  lastYearDate.setDate(lastYearDate.getDate() + diff);

  return lastYearDate;
}

function getLastYearBeforeSameWeekday(date = new Date()) {
  const targetWeekday = date.getDay(); // 오늘 요일
  const startDate = new Date(date);
  startDate.setFullYear(date.getFullYear() - 2); // 정확히 2년 전 날짜

  // 같은 요일을 만날 때까지 하루씩 앞으로 이동
  while (startDate.getDay() !== targetWeekday) {
    startDate.setDate(startDate.getDate() + 1); // 하루 전으로 이동
  }

  return startDate;
}
</script>

<style lang="scss" scoped></style>