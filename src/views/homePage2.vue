<template>
  <div class="flex justify-center items-center mt-10 w-full overflow-auto">
    <div
      class="grid grid-rows-3 grid-cols-1 w-[85vw] h-[85vh] items-center shadow-lg border-2">
      <div class="flex w-full h-[20vh] -mt-5 space-x-10 justify-start ml-10">
        <div class="w-[45%] h-full flex justify-start flex-col items-start">
          <span>◎전일마감현황</span>
          <Realgrid
            :progname="'MainDashBoard_VUE'"
            :progid="1"
            :rowStateeditable="false"
            :setStateBar="false"
            :rowData="rowData"></Realgrid>
        </div>
        <div class="w-[45%] h-full flex justify-start flex-col items-start">
          <span>◎과거(이전달) vs 현재 매출현황</span>
          <Realgrid
            :progname="'MainDashBoard_VUE'"
            :progid="2"
            :rowData="rowData2"
            :rowStateeditable="false"
            :setStateBar="false"></Realgrid>
        </div>
      </div>
      <div class="flex h-72 ml-10 -mt-12">
        <div class="w-full flex justify-start flex-col items-start">
          <span class="mt-10">◎전년 월누계 대비실적</span>
          <Chart
            class="!h-80 !w-[97%]"
            :type="'line'"
            :labels="labels"
            :label="label"
            :datas="datas"
            :showDataLabel="false"></Chart>
        </div>
      </div>
      <div class="flex w-[85vw] h-[20vh] space-x-10 justify-start ml-10">
        <div class="w-[45%] h-full flex justify-start flex-col items-start">
          <span class="flex space-x-3"
            ><span>◎공지사항</span
            ><button class="whitebutton -mt-2" @click="moveNoticePage">
              공지사항 목록가기
            </button></span
          >
          <Realgrid
            :progname="'MainDashBoard_VUE'"
            :progid="3"
            :rowStateeditable="false"
            :setStateBar="false"
            @dblclickedRowData="dblclickedRowData"
            :rowData="rowData3"></Realgrid>
        </div>
        <div class="w-[45%] h-full flex justify-start flex-col items-start">
          <span class="">◎게시판</span>
          <Realgrid
            :progname="'MainDashBoard_VUE'"
            :progid="4"
            :rowStateeditable="false"
            :setStateBar="false"
            :rowData="rowData4"></Realgrid>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { MainDashBoard, MainDashBoard2, MainDashBoard3 } from "@/api/common";
import Chart from "@/components/chart.vue";
import Realgrid from "@/components/realgrid.vue";
import { onMounted, ref } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";

const store = useStore();

/**
 * 	화면 Load시 실행 스크립트
 */

const rowData = ref([]);
const rowData2 = ref([]);
const rowData3 = ref([]);
const rowData4 = ref([]);

const datas = ref([]);
const labels = ref([]);
const label = ref([]);
onMounted(async () => {
  store.state.loading = false;

  ////console.log(store.state.userData);
  const userdata = store.state.userData;
  let lngStoreCode = "";

  if (userdata.lngSubLease == "0") {
    lngStoreCode = 0;
  } else {
    lngStoreCode = userdata.lngPosition;
  }

  let res = "";
  if (
    userdata.lngSupplierID <= 1 &&
    userdata.lngUserAdminID !== userdata.lngStoreGroup
  ) {
    res = await MainDashBoard(
      userdata.lngStoreGroup,
      lngStoreCode,
      userdata.lngSubLease,
      userdata.lngSequence,
      userdata.lngLanguage
    );

    rowData.value = res.data.List;

    rowData2.value = res.data.List2;

    // ////console.log(res);
  }

  if (
    (userdata.lngSupplierID <= 0 || userdata.lngStoreGroup == "1260") &&
    userdata.lngUserAdminID != userdata.lngStoreGroup
  ) {
    let res = await MainDashBoard2(
      userdata.lngStoreGroup,
      userdata.lngPosition,
      userdata.lngSequence
    );
    // ////console.log(res);
    rowData3.value = res.data.List;
    rowData4.value = res.data.List2;
  }

  if (userdata.lngSupplierID > 0) {
    return;
  }
  if (userdata.lngStoreGroup == "3033" && userdata.lngPositionType == 0) {
    return;
  }
  if (userdata.lngStoreGroup == "7650" && userdata.lngPositionType == 0) {
    return;
  }
  if (userdata.lngStoreGroup == "7639" && userdata.lngPositionType == 0) {
    return;
  }
  if (userdata.lngStoreGroup == "7838" && userdata.lngPositionType == 0) {
    return;
  }
  if (userdata.lngStoreGroup == "7208" && userdata.lngPositionType == 0) {
    return;
  }
  if (userdata.lngUserAdminID == userdata.lngStoreGroup) {
    return;
  }

  res = await MainDashBoard3(userdata.lngStoreGroup, lngStoreCode);
  datas.value = [
    res.data.List.map((item) => parseInt(item.lastTotAmt)),
    res.data.List.map((item) => parseInt(item.nowTotAmt)),
  ];

  ////console.log(datas.value);
  labels.value = res.data.List.map((item) => item.dtmDay);
  ////console.log(res);
  const today = new Date();
  label.value = [
    today.getFullYear() - 1 + "-" + (today.getMonth() + 1),
    today.getFullYear() + "-" + (today.getMonth() + 1),
  ];
});

const dblclickedRowData = (e) => {
  ////console.log(e);
};

const moveNoticePage = (e) => {
  store.state.moveOtherTab = {
    strUrl: "MINOTICE::NOT01_001INS.xml",
    lngProgramID: 800101,
    strTitle: "공지사항 목록",
  };
};
</script>

<style lang="scss" scoped></style>
