<template>
  <div class="br12 po-page">
    <div class="page-scroll">
      <div class="pd24 pt0 mt30 grid-area" data-fixed>
        <!-- grid-area: 남은 화면 높이 전체 채움 / grid-fixed: 콘텐츠 높이만큼만 출력 -->
        
        <div class="dashboard-content">
          <section class="dashboard-top">
            <!-- KPI 2x2 -->
            <div class="kpi-area" style="grid-column: 1 / 2; grid-row: 1 / 2;">
              <div class="kpi-card">
                <div class="f14 kpi-title">매출</div>
                <div class="kpi-num">
                  <div class="f30 kpi-value">{{ formatNumber(kpiData.sales) }}</div>
                  <div class="f14 kpi-rate" :class="kpiData.salesRateClass">{{ kpiData.salesRate }}</div>
                </div>
              </div>
              <div class="kpi-card">
                <div class="f14 kpi-title">고객수</div>
                <div class="kpi-num">
                  <div class="f30 kpi-value">{{ formatNumber(kpiData.customers) }}</div>
                  <div class="f14 kpi-rate" :class="kpiData.customersRateClass">{{ kpiData.customersRate }}</div>
                </div>
              </div>
              <div class="kpi-card">
                <div class="f14 kpi-title">고객 AVG</div>
                <div class="kpi-num">
                  <div class="f30 kpi-value">{{ formatNumber(kpiData.customerAvg) }}</div>
                  <div class="f14 kpi-rate" :class="kpiData.customerAvgRateClass">{{ kpiData.customerAvgRate }}</div>
                </div>
              </div>
              <div class="kpi-card">
                <div class="f14 kpi-title">영수증수</div>
                <div class="kpi-num">
                  <div class="f30 kpi-value">{{ formatNumber(kpiData.receipts) }}</div>
                  <div class="f14 kpi-rate" :class="kpiData.receiptsRateClass">{{ kpiData.receiptsRate }}</div>
                </div>
              </div>
            </div>
            <!-- 전년 월누계 대비실적 -->
            <div class="board-box chart-box-wrap grid-area">
              <div class="title-section-wrap">
                <div class="title-section">
                  <div class="icon"></div>
                  <div class="f20 text">전년 월누계 대비실적</div>
                </div>
              </div>
              <div class="chart-box">
                <Chart
                  class="!h-full !w-full"
                  :type="'line'"
                  :labels="labels"
                  :label="label"
                  :datas="datas"
                  :showDataLabel="false"
                ></Chart>
              </div>
            </div>

            <!-- 과거(이전달) vs 현재 매출현황 -->
            <div class="board-box grid-box-wrap grid-area">
              <div class="title-section-wrap">
                <div class="title-section">
                  <div class="icon"></div>
                  <div class="f20 text">과거(이전달) vs 현재 매출현황</div>
                </div>
              </div>
              <div class="rg-grid-area">
                <Realgrid
                  :progname="'MainDashBoard_VUE'"
                  :progid="2"
                  :rowData="rowData2"
                  :rowStateeditable="false"
                  :setStateBar="false"
                ></Realgrid>
              </div>
            </div>
          </section>

          <section class="dashboard-board">
            <!-- 공지사항 -->
            <div class="board-box grid-area">
              <div class="title-section-wrap">
                <div class="title-section">
                  <div class="icon"></div>
                  <div class="f20 text">공지사항</div>
                </div>
                <a href="#" class="f13 btn-more" @click.prevent="moveNoticePage">
                  더보기 <i class="ic-more"></i>
                </a>
              </div>
              <div class="rg-grid-area">
                <Realgrid
                  :progname="'MainDashBoard_VUE'"
                  :progid="3"
                  :rowStateeditable="false"
                  :setStateBar="false"
                  @dblclickedRowData="dblclickedRowData"
                  :rowData="rowData3"
                ></Realgrid>
              </div>
            </div>

            <!-- 게시판 -->
            <div class="board-box grid-area">
              <div class="title-section-wrap">
                <div class="title-section">
                  <div class="icon"></div>
                  <div class="f20 text">게시판</div>
                </div>
                <!-- <a href="#" class="f13 btn-more">
                  더보기 <i class="ic-more"></i>
                </a> -->
              </div>
              <div class="rg-grid-area">
                <Realgrid
                  :progname="'MainDashBoard_VUE'"
                  :progid="4"
                  :rowStateeditable="false"
                  :setStateBar="false"
                  :rowData="rowData4"
                ></Realgrid>
              </div>
            </div>
          </section>
        </div>
      </div>
      <!-- grid-area, grid-fixed -->
    </div>
    <!-- page-scroll -->
  </div>
  <!-- po-page -->
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

// KPI 데이터
const kpiData = ref({
  sales: 0,
  salesRate: '0%',
  salesRateClass: 'up',
  customers: 0,
  customersRate: '0%',
  customersRateClass: 'up',
  customerAvg: 0,
  customerAvgRate: '0%',
  customerAvgRateClass: 'up',
  receipts: 0,
  receiptsRate: '0%',
  receiptsRateClass: 'up'
});
onMounted(async () => {
  store.state.loading = false;

  console.log(store.state.userData);
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
    
    // 각 타이틀에 맞게 currentMonth와 strAchieveRate 데이터 추출
    if (rowData2.value && rowData2.value.length > 0) {
      // 매출 (인덱스 0)
      const salesItem = rowData2.value[0];
      const salesCurrentMonth = salesItem ? parseInt(parseFloat(salesItem.currentMonth || salesItem.currenMonth || 0)) : 0;
      const salesAchieveRate = salesItem?.strAchieveRate || '0%';
      
      // 고객수 (인덱스 1)
      const customersItem = rowData2.value[1];
      const customersCurrentMonth = customersItem ? parseInt(parseFloat(customersItem.currentMonth || customersItem.currenMonth || 0)) : 0;
      const customersAchieveRate = customersItem?.strAchieveRate || '0%';
      
      // 고객 AVG. (인덱스 2)
      const customerAvgItem = rowData2.value[2];
      const customerAvgCurrentMonth = customerAvgItem ? parseInt(parseFloat(customerAvgItem.currentMonth || customerAvgItem.currenMonth || 0)) : 0;
      const customerAvgAchieveRate = customerAvgItem?.strAchieveRate || '0%';
      
      // 영수증수 (인덱스 3)
      const receiptsItem = rowData2.value[3];
      const receiptsCurrentMonth = receiptsItem ? parseInt(parseFloat(receiptsItem.currentMonth || receiptsItem.currenMonth || 0)) : 0;
      const receiptsAchieveRate = receiptsItem?.strAchieveRate || '0%';
      
      // KPI 데이터 업데이트
      kpiData.value.sales = salesCurrentMonth;
      kpiData.value.salesRate = salesAchieveRate;
      kpiData.value.salesRateClass = salesAchieveRate && salesAchieveRate.startsWith('-') ? 'down' : 'up';
      
      kpiData.value.customers = customersCurrentMonth;
      kpiData.value.customersRate = customersAchieveRate;
      kpiData.value.customersRateClass = customersAchieveRate && customersAchieveRate.startsWith('-') ? 'down' : 'up';
      
      kpiData.value.customerAvg = customerAvgCurrentMonth;
      kpiData.value.customerAvgRate = customerAvgAchieveRate;
      kpiData.value.customerAvgRateClass = customerAvgAchieveRate && customerAvgAchieveRate.startsWith('-') ? 'down' : 'up';
      
      kpiData.value.receipts = receiptsCurrentMonth;
      kpiData.value.receiptsRate = receiptsAchieveRate;
      kpiData.value.receiptsRateClass = receiptsAchieveRate && receiptsAchieveRate.startsWith('-') ? 'down' : 'up';
    }


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

// 숫자 포맷팅 (천단위 콤마)
const formatNumber = (num) => {
  if (!num && num !== 0) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
</script>

<style lang="scss" scoped></style>
