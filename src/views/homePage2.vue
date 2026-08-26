<template>
  <div class="br12 po-page">
    <StoreGroupWelcomePopup v-if="showWelcomePopup" />
    <div class="page-scroll">
      <div class="pd24 pt0 mt30 grid-area" data-fixed>
        <!-- grid-area: 남은 화면 높이 전체 채움 / grid-fixed: 콘텐츠 높이만큼만 출력 -->

        <SalesAnalysisDashboard
          v-if="isHomeSalesAnalysisDashboard"
          ref="salesAnalysisDashboardRef"
          class="sa-dash-host"
          @refresh="onSalesAnalysisDashboardRefresh"
        />

        <div v-else class="dashboard-content">
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
                  @clickedRowData="openNoticeDetail"
                  @clickedRowData2="openNoticeDetail"
                  @dblclickedRowData="openNoticeDetail"
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

    <div
      v-if="showNoticeDetail"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70]">
      <div class="hp-notice-modal">
        <div class="hp-notice-modal-header">
          <div class="title-section !mb-0">
            <div class="icon"></div>
            <div class="f20 text">공지사항 상세조회</div>
          </div>
          <button class="button primary" @click="closeNoticeDetail">목록보기</button>
        </div>

        <div class="hp-notice-meta">
          <div class="hp-notice-meta-label">작성자</div>
          <div class="hp-notice-meta-value">{{ noticeDetailWriter }}</div>
          <div class="hp-notice-meta-label">작성일자</div>
          <div class="hp-notice-meta-value">{{ noticeDetailDate }}</div>
          <div class="hp-notice-meta-label">제목</div>
          <div class="hp-notice-meta-value hp-notice-meta-value--subject">
            {{ noticeDetailSubject }}
          </div>
        </div>

        <div class="hp-notice-body content-wrapper" v-html="noticeDetailBody"></div>
      </div>
    </div>
  </div>
  <!-- po-page -->
</template>

<script setup>
import { MainDashBoard, MainDashBoard2, MainDashBoard3 } from "@/api/common";
import { getNoticeList2 } from "@/api/minotice";
import { getNoticeDocDetail } from "@/api/minotice";
import SalesAnalysisDashboard from "@/components/SalesAnalysisDashboard.vue";
import StoreGroupWelcomePopup from "@/components/StoreGroupWelcomePopup.vue";
import { USER_ADMIN_ID_SUPPLIER_ACCOUNT } from "@/constants/sessionUser";
import { matchesSalesAnalysisHomeTempBypass } from "@/constants/salesAnalysisDashboardApi.js";
import Chart from "@/components/chart.vue";
import Realgrid from "@/components/realgrid.vue";
import { computed, onMounted, ref } from "vue";

const WELCOME_POPUP_GROUP = 3071;
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";

const store = useStore();

const showWelcomePopup = computed(
  () => Number(store.state.userData?.lngStoreGroup) === WELCOME_POPUP_GROUP
);

/** 홈 매출 분석 대시보드 노출은 `SALES_ANALYSIS_HOME_TEMP_BYPASS_RULES` (`salesAnalysisDashboardApi.js`)만 따름 */
/** @param {Record<string, unknown>|unknown} u userData */
function isSalesAnalysisDashboardHome(u) {
  if (!u || typeof u !== "object" || Array.isArray(u)) return false;
  return matchesSalesAnalysisHomeTempBypass(u);
}

const isHomeSalesAnalysisDashboard = computed(() =>
  isSalesAnalysisDashboardHome(store.state.userData)
);

/** KPI·매출그리드·전년 월누계 차트 — 동일 미조회 조건 */
function shouldSkipMainDashBoardSalesChart(userdata) {
  if (!userdata) return true;
  if (Number(userdata.lngSupplierID) > 0) return true;
  if (userdata.lngStoreGroup == "3033" && userdata.lngPositionType == 0) return true;
  if (userdata.lngStoreGroup == "7650" && userdata.lngPositionType == 0) return true;
  if (userdata.lngStoreGroup == "7639" && userdata.lngPositionType == 0) return true;
  if (userdata.lngStoreGroup == "7838" && userdata.lngPositionType == 0) return true;
  if (userdata.lngStoreGroup == "7208" && userdata.lngPositionType == 0) return true;
  if (userdata.lngUserAdminID == userdata.lngStoreGroup) return true;
  return false;
}

const salesAnalysisDashboardRef = ref(null);

function onSalesAnalysisDashboardRefresh() {
  /* SalesAnalysisDashboard 가 새로고침 시 API까지 처리한 뒤 emit 함 — 부모에서 추가 연동 시 여기 작성 */
}

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
const showNoticeDetail = ref(false);
const noticeDetailSubject = ref("");
const noticeDetailWriter = ref("");
const noticeDetailDate = ref("");
const noticeDetailBody = ref("");

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
  console.log(store.state.userData);
  const userdata = store.state.userData;
  if (isSalesAnalysisDashboardHome(userdata)) {
    /* 신규 매출 분석 대시보드: `SalesAnalysisDashboard` 가 API 구간에서 로딩 처리 */
    return;
  }
  /* 구 대시보드 공통: 매장 그룹과 무관, 공급사(60)이면 MainDashBoard·2·3 미호출 */
  if (Number(userdata.lngUserAdminID) === USER_ADMIN_ID_SUPPLIER_ACCOUNT) {
    store.dispatch("convertLoading", false);
    return;
  }

  store.dispatch("convertLoading", true);
  try {
    let lngStoreCode = "";

    if (userdata.lngSubLease == "0") {
      lngStoreCode = 0;
    } else {
      lngStoreCode = userdata.lngPosition;
    }

    let res = "";
    if (
      userdata.lngSupplierID <= 1 &&
      userdata.lngUserAdminID !== userdata.lngStoreGroup &&
      !shouldSkipMainDashBoardSalesChart(userdata)
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
      const res2 = await MainDashBoard2(
        userdata.lngStoreGroup,
        userdata.lngPosition,
        userdata.lngSequence
      );
      // ////console.log(res2);
      rowData3.value = res2.data.List;
      rowData4.value = res2.data.List2;
    }

    if (!shouldSkipMainDashBoardSalesChart(userdata)) {
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
    }
  } catch (e) {
    console.error("[homePage2] dashboard load", e);
  } finally {
    store.dispatch("convertLoading", false);
  }
});

const getNoticeSeq = (row) => {
  if (!row || typeof row !== "object") return "";

  if (Array.isArray(row)) {
    const seqFromArray = [...row]
      .reverse()
      .find((item) => item !== null && item !== undefined && /^\d+$/.test(String(item)));
    return seqFromArray ? String(seqFromArray) : "";
  }

  const key = Object.keys(row).find((k) => k.toLowerCase().includes("seq"));
  if (key && row[key] !== undefined && row[key] !== null && row[key] !== "") {
    return String(row[key]);
  }

  return (
    row.lngSeqID ??
    row.lngSeqId ??
    row.lngSEQID ??
    row.seqID ??
    row.seqId ??
    row.noticeSeq ??
    row.noticeSEQ ??
    row.lngNoticeSeq ??
    row.SEQID ??
    row.SEQNO ??
    row.lngSeqNo ??
    ""
  );
};

const resolveNoticeRow = (payload) => {
  if (typeof payload === "number") {
    return rowData3.value[payload] ?? null;
  }

  if (payload && typeof payload === "object" && "dataRow" in payload) {
    const idx = Number(payload.dataRow);
    if (!Number.isNaN(idx) && idx >= 0) {
      return rowData3.value[idx] ?? payload;
    }
  }

  return payload;
};

const getRowValue = (row, keys) => {
  if (!row || typeof row !== "object") return "";
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== null && row[key] !== "") {
      return String(row[key]).trim();
    }
  }
  return "";
};

const normalizeDateText = (value) => {
  if (!value) return "";
  return String(value).replace(/[.\s]/g, "").slice(0, 10);
};

const findNoticeSeqByList = async (row) => {
  const userData = store.state.userData;
  const subject = getRowValue(row, ["strSubject", "SUBJECT", "subject"]);
  const writer = getRowValue(row, ["strWriter", "WRITER", "writer"]);
  const writeDate = normalizeDateText(
    getRowValue(row, ["dtmWriteDate", "WRITE_DATE", "writeDate", "strDate"])
  );

  const res = await getNoticeList2(
    userData.lngStoreGroup,
    userData.lngPosition,
    userData.lngUserAdminID,
    1,
    "00",
    "",
    userData.lngLanguage
  );

  const list = Array.isArray(res?.data?.List) ? res.data.List : [];
  const matched = list.find((item) => {
    const itemSubject = String(item?.strSubject ?? "").trim();
    const itemWriter = String(item?.strWriter ?? "").trim();
    const itemDate = normalizeDateText(item?.dtmWriteDate ?? "");

    if (!itemSubject || !subject) return false;
    if (itemSubject !== subject) return false;
    if (writer && itemWriter && writer !== itemWriter) return false;
    if (writeDate && itemDate && writeDate !== itemDate) return false;
    return true;
  });

  return matched?.lngSeqID ? String(matched.lngSeqID) : "";
};

const openNoticeDetail = async (payload) => {
  const row = resolveNoticeRow(payload);
  let seqNo = getNoticeSeq(row);
  if (!seqNo) {
    seqNo = await findNoticeSeqByList(row);
  }
  if (!seqNo) {
    moveNoticePage();
    return;
  }

  try {
    store.dispatch("convertLoading", true);
    const userData = store.state.userData;
    const res = await getNoticeDocDetail(
      userData.lngStoreGroup,
      userData.lngPosition,
      userData.lngUserAdminID,
      seqNo
    );

    const detail = res?.data?.List?.[0];
    if (!detail) {
      return;
    }

    noticeDetailSubject.value = detail.strSubject ?? "";
    noticeDetailWriter.value = detail.strWriter ?? "";
    noticeDetailDate.value = detail.dtmWriteDate ?? "";
    noticeDetailBody.value = detail.strBody ?? "";
    showNoticeDetail.value = true;
  } catch (error) {
    console.error("[homePage2] notice detail load", error);
  } finally {
    store.dispatch("convertLoading", false);
  }
};

const closeNoticeDetail = () => {
  showNoticeDetail.value = false;
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

<style scoped>
.sa-dash-host {
  flex: 1 1 0;
  min-height: 0;
  min-width: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.hp-notice-modal {
  width: min(90vw, 1080px);
  max-height: 88vh;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 0.75rem;
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.18);
  padding: 1rem;
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr);
  gap: 0.75rem;
}

.hp-notice-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.hp-notice-meta {
  display: grid;
  grid-template-columns: 7rem minmax(0, 1fr) 7rem minmax(0, 1fr);
  border-top: 1px solid #d1d5db;
  border-left: 1px solid #d1d5db;
}

.hp-notice-meta-label,
.hp-notice-meta-value {
  border-right: 1px solid #d1d5db;
  border-bottom: 1px solid #d1d5db;
  padding: 0.5rem 0.75rem;
  display: flex;
  align-items: center;
}

.hp-notice-meta-label {
  justify-content: center;
  background: #f3f4f6;
  font-weight: 600;
}

.hp-notice-meta-value--subject {
  grid-column: span 3;
}

.hp-notice-body {
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.75rem;
  overflow: auto;
  min-height: 24rem;
}
</style>
