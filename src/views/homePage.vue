<template>
  <div class="home">
    <div class="home-card home-hello">
      <div class="home-kicker">안녕하세요</div>
      <div class="home-name">
        <span>{{ StoreName }}</span> 입니다.
      </div>
      <div class="home-updated">최신 업데이트 {{ today }}</div>
    </div>

    <div class="home-kpis">
      <div class="home-card home-kpi">
        <div class="home-kpi-tag">일매출</div>
        <div class="home-kpi-sub">전일 {{ lastDaySale }}원</div>
        <div class="home-kpi-now">{{ todaySale }}원</div>
      </div>
      <div class="home-card home-kpi">
        <div class="home-kpi-tag">주간매출</div>
        <div class="home-kpi-sub">전주 {{ lastWeekSale }}원</div>
        <div class="home-kpi-now">{{ WeekSale }}원</div>
      </div>
      <div class="home-card home-kpi">
        <div class="home-kpi-tag">월매출</div>
        <div class="home-kpi-sub">전월 {{ lastMonthSale }}원</div>
        <div class="home-kpi-now">{{ MonthSale }}원</div>
      </div>
    </div>

    <div class="home-diffs">
      <div class="home-card home-diff">
        <div>전일대비</div>
        <div class="home-diff-val" :class="diffClass(difdaySale)">
          <font-awesome-icon
            :icon="['fas', 'circle-arrow-up']"
            v-show="difdaySale > 0" />
          <font-awesome-icon
            :icon="['fas', 'circle-arrow-down']"
            v-show="difdaySale < 0" />
          {{ difdaySale2 }}
        </div>
      </div>
      <div class="home-card home-diff">
        <div>전주대비</div>
        <div class="home-diff-val" :class="diffClass(difweekSale)">
          <font-awesome-icon
            :icon="['fas', 'circle-arrow-up']"
            v-show="difweekSale > 0" />
          <font-awesome-icon
            :icon="['fas', 'circle-arrow-down']"
            v-show="difweekSale < 0" />
          {{ difweekSale2 }}
        </div>
      </div>
      <div class="home-card home-diff">
        <div>전월대비</div>
        <div class="home-diff-val" :class="diffClass(difmonthSale)">
          <font-awesome-icon
            :icon="['fas', 'circle-arrow-up']"
            v-show="difmonthSale > 0" />
          <font-awesome-icon
            :icon="['fas', 'circle-arrow-down']"
            v-show="difmonthSale < 0" />
          {{ difmonthSale2 }}
        </div>
      </div>
    </div>

    <div class="home-card home-chart">
      <div class="home-chart-unit">단위 (만원)</div>
      <div class="home-bars">
        <div class="home-bar-col">
          <div class="home-bar-pair">
            <div class="home-bar is-day is-dim" :style="{ height: prevsaleH }"></div>
            <div class="home-bar is-day" :style="{ height: nextsaleH }"></div>
          </div>
          <div class="home-bar-cap">전일 {{ lastDaySale2 }}</div>
          <div class="home-bar-cap is-now">당일 {{ todaySale2 }}</div>
        </div>
        <div class="home-bar-col">
          <div class="home-bar-pair">
            <div class="home-bar is-week is-dim" :style="{ height: prevWeeksaleH }"></div>
            <div class="home-bar is-week" :style="{ height: nextWeeksaleH }"></div>
          </div>
          <div class="home-bar-cap">전주 {{ lastWeekSale2 }}</div>
          <div class="home-bar-cap is-now">금주 {{ WeekSale2 }}</div>
        </div>
        <div class="home-bar-col">
          <div class="home-bar-pair">
            <div class="home-bar is-month is-dim" :style="{ height: prevMonthsaleH }"></div>
            <div class="home-bar is-month" :style="{ height: nextMonthsaleH }"></div>
          </div>
          <div class="home-bar-cap">전월 {{ lastMonthSale2 }}</div>
          <div class="home-bar-cap is-now">당월 {{ MonthSale2 }}</div>
        </div>
      </div>
    </div>

    <!-- 메뉴 관리: 웹 메뉴코드등록(MST01_003INS) 메뉴가 있는 계정만. 버튼 하나, 가운데 배치. 누르면 메뉴 목록 -->
    <div v-if="showMenuView" class="home-tools is-single">
      <button
        type="button"
        class="home-card home-tool"
        @click="openMenuManage">
        <span class="home-tool-icon is-list" aria-hidden="true">
          <!-- 메뉴판 아이콘 -->
          <svg viewBox="0 0 24 24" focusable="false">
            <rect x="4.5" y="3" width="15" height="18" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.8" />
            <path d="M8.5 8h7M8.5 12h7M8.5 16h4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          </svg>
        </span>
        <span class="home-tool-text">
          <span class="home-tool-title">메뉴 관리</span>
          <span class="home-tool-sub">{{ showQuickMenu ? "메뉴 조회·등록·AI 메뉴관리" : "메뉴 목록·상세 조회" }}</span>
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { getMobileDashBoard } from "@/api/mobile";
import { canUseQuickMenu, loadMenuAccess } from "@/views/MOBILE/master/mobileMenuAccess";
import { useRouter } from "vue-router";
import {
  formatLocalDate2,
  formatNumberWithCommas,
} from "@/customFunc/customFunc";
/*
 * 공통 표준  Function
 */

import { computed, onMounted, ref } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";
const lastDaySale = ref("");
const todaySale = ref("");
const MonthSale = ref("");
const lastMonthSale = ref("");
const WeekSale = ref("");
const lastWeekSale = ref("");

const lastDaySale2 = ref("");
const todaySale2 = ref("");
const MonthSale2 = ref("");
const lastMonthSale2 = ref("");
const WeekSale2 = ref("");
const lastWeekSale2 = ref("");

const store = useStore();
const selectedStoreCode = ref("");
/**
 * 페이지 매장 코드 세팅
 */

const lngStoreCode = (e) => {
  selectedStoreCode.value = e;
};
const prevsaleH = ref(0);
const nextsaleH = ref(0);
const prevWeeksaleH = ref(0);
const nextWeeksaleH = ref(0);
const prevMonthsaleH = ref(0);
const nextMonthsaleH = ref(0);

const difdaySale = ref(0);
const difdaySale2 = ref(0);
const difweekSale = ref(0);
const difweekSale2 = ref(0);
const difmonthSale = ref(0);
const difmonthSale2 = ref(0);
const diffClass = (value) =>
  Number(value) > 0 ? "is-up" : Number(value) < 0 ? "is-down" : "";
const isMobile = store.state.isMobile;
const StoreName = ref("");
const today = ref(formatLocalDate2(new Date()));
const router = useRouter();

/**
 * 메뉴 관리 버튼 (사용 조건은 mobileMenuAccess.js — 웹 메뉴코드등록 MST01_003INS 와 같다)
 * - 메뉴 조회: 웹 메뉴에 메뉴코드등록이 있는 계정
 * - 초간단 메뉴등록: 위 + AI 사용 그룹(3015 제외) + 매장 계정·공통 메뉴(조회 전용)가 아닌 계정
 * - 홈에는 「메뉴 관리」 버튼 하나. 누르면 모바일 메뉴 목록 화면으로 가고, 초간단 메뉴등록은 그 화면 안 버튼으로 연다
 */
const menuAccessUser = ref(null);
const menuAccessMenu = ref(null);
const showMenuView = computed(() => !!menuAccessUser.value && !!menuAccessMenu.value);
const showQuickMenu = computed(() => canUseQuickMenu(menuAccessUser.value, menuAccessMenu.value));
const loadMenuTools = async () => {
  const access = await loadMenuAccess(store.state.StoreToken);
  menuAccessUser.value = access.user;
  menuAccessMenu.value = access.menu;
};
const openMenuManage = () => {
  router.push("/m/MIMASTER/menuManage");
};
/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  store.state.loading2 = false;
  loadMenuTools();

  StoreName.value = store.state.userData.STORE_NM;
  store.state.mobileSelectProgName = "";
  let res;
  try {
    res = await getMobileDashBoard(
      store.state.userData.GROUP_CD,
      store.state.userData.STORE_CD,
      store.state.userData.USER_NO
    );
  } catch (error) {}

  const data = res.data.List[0];
  //comsole.log(data);
  lastDaySale.value = formatNumberWithCommas(data.YESTERDAY_SAL);
  todaySale.value = formatNumberWithCommas(data.TODAY_SAL);
  lastWeekSale.value = formatNumberWithCommas(data.LASTWEEK_SAL);
  WeekSale.value = formatNumberWithCommas(data.THISWEEK_SAL);
  lastMonthSale.value = formatNumberWithCommas(data.LASTMONTH_SAL);
  MonthSale.value = formatNumberWithCommas(data.THISMONTH_SAL);

  difdaySale.value = Number(data.TODAY_SAL) - Number(data.YESTERDAY_SAL);
  difdaySale2.value = formatNumberWithCommas(
    Number(data.TODAY_SAL) - Number(data.YESTERDAY_SAL)
  );

  todaySale2.value = Math.round(Number(data.TODAY_SAL) / 10000);
  lastDaySale2.value = Math.round(Number(data.YESTERDAY_SAL) / 10000);

  MonthSale2.value = Math.round(Number(data.THISMONTH_SAL) / 10000);

  lastMonthSale2.value = Math.round(Number(data.LASTMONTH_SAL) / 10000);

  WeekSale2.value = Math.round(Number(data.THISWEEK_SAL) / 10000);
  lastWeekSale2.value = Math.round(Number(data.LASTWEEK_SAL) / 10000);

  // nextsaleH.value = Number(data.TODAY_SAL) / 5000000 + "vh";
  // prevsaleH.value = Number(data.YESTERDAY_SAL) / 5000000 + "vh";
  // nextWeeksaleH.value = Number(data.THISWEEK_SAL) / 15000000 + "vh";
  // prevWeeksaleH.value = Number(data.LASTWEEK_SAL) / 15000000 + "vh";
  // nextMonthsaleH.value = Number(data.THISMONTH_SAL) / 150000000 + "vh";
  // prevMonthsaleH.value = Number(data.LASTMONTH_SAL) / 150000000 + "vh";

  nextsaleH.value =
    Math.round(
      (Number(data.TODAY_SAL) /
        (Number(data.YESTERDAY_SAL) + Number(data.TODAY_SAL))) *
        85
    ) + "%";
  prevsaleH.value =
    Math.round(
      (Number(data.YESTERDAY_SAL) /
        (Number(data.YESTERDAY_SAL) + Number(data.TODAY_SAL))) *
        85
    ) + "%";

  nextWeeksaleH.value =
    Math.round(
      (Number(data.THISWEEK_SAL) /
        (Number(data.LASTWEEK_SAL) + Number(data.THISWEEK_SAL))) *
        85
    ) + "%";
  prevWeeksaleH.value =
    Math.round(
      (Number(data.LASTWEEK_SAL) /
        (Number(data.LASTWEEK_SAL) + Number(data.THISWEEK_SAL))) *
        85
    ) + "%";
  nextMonthsaleH.value =
    Math.round(
      (Number(data.THISMONTH_SAL) /
        (Number(data.THISMONTH_SAL) + Number(data.LASTMONTH_SAL))) *
        85
    ) + "%";
  prevMonthsaleH.value =
    Math.round(
      (Number(data.LASTMONTH_SAL) /
        (Number(data.LASTMONTH_SAL) + Number(data.THISMONTH_SAL))) *
        85
    ) + "%";
  ////console.log(prevsaleH.value);
  ////console.log(prevWeeksaleH.value);
  ////console.log(nextMonthsaleH.value);
  difweekSale.value = Number(data.THISWEEK_SAL) - Number(data.LASTWEEK_SAL);
  difweekSale2.value = formatNumberWithCommas(
    Number(data.THISWEEK_SAL) - Number(data.LASTWEEK_SAL)
  );

  difmonthSale.value = Number(data.THISMONTH_SAL) - Number(data.LASTMONTH_SAL);
  difmonthSale2.value = formatNumberWithCommas(
    Number(data.THISMONTH_SAL) - Number(data.LASTMONTH_SAL)
  );
});
</script>

<style scoped>
.home {
  min-height: 100%;
  padding: 4.2rem 0.75rem 5.5rem;
  background: #f8fafc;
}

.home-card {
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  background: #fff;
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.04);
}

.home-hello {
  padding: 1rem 1rem 0.85rem;
}

.home-kicker {
  font-size: 0.75rem;
  color: #94a3b8;
}

.home-name {
  margin-top: 0.2rem;
  font-size: 1.15rem;
  font-weight: 700;
  color: #0f172a;
}

.home-name span {
  color: #3b82f6;
}

.home-updated {
  margin-top: 0.45rem;
  text-align: right;
  font-size: 0.7rem;
  color: #94a3b8;
}

.home-kpis,
.home-diffs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.45rem;
  margin-top: 0.65rem;
}

.home-kpi,
.home-diff {
  padding: 0.7rem 0.45rem 0.65rem;
}

.home-kpi-tag {
  display: inline-flex;
  padding: 0.15rem 0.45rem;
  border-radius: 999px;
  background: #0f172a;
  color: #fff;
  font-size: 0.65rem;
  font-weight: 700;
}

.home-kpi-sub {
  margin-top: 0.45rem;
  font-size: 0.62rem;
  line-height: 1.25;
  color: #94a3b8;
  word-break: keep-all;
}

.home-kpi-now {
  margin-top: 0.15rem;
  font-size: 0.78rem;
  font-weight: 800;
  color: #3b82f6;
  word-break: break-all;
}

.home-diff {
  font-size: 0.68rem;
  color: #94a3b8;
  text-align: center;
}

.home-diff-val {
  margin-top: 0.35rem;
  font-size: 0.72rem;
  font-weight: 700;
  color: #334155;
  word-break: break-all;
}

.home-diff-val.is-up {
  color: #ef4444;
}

.home-diff-val.is-down {
  color: #3b82f6;
}

.home-chart {
  margin-top: 0.65rem;
  padding: 0.85rem 0.5rem 0.75rem;
}

.home-chart-unit {
  margin-bottom: 0.35rem;
  padding-left: 0.35rem;
  font-size: 0.68rem;
  color: #94a3b8;
}

.home-bars {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.25rem;
}

.home-bar-pair {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 0.45rem;
  height: 9.5rem;
}

.home-bar {
  width: 1.35rem;
  min-height: 4px;
  border-radius: 0.45rem 0.45rem 0.2rem 0.2rem;
}

.home-bar.is-day {
  background: #ef4444;
}

.home-bar.is-week {
  background: #22c55e;
}

.home-bar.is-month {
  background: #3b82f6;
}

.home-bar.is-dim {
  opacity: 0.45;
}

.home-bar-cap {
  margin-top: 0.35rem;
  text-align: center;
  font-size: 0.68rem;
  color: #94a3b8;
}

.home-bar-cap.is-now {
  margin-top: 0.1rem;
  font-weight: 700;
  color: #334155;
}

/* 메뉴 관리 버튼: 2개면 반반, 1개면 가운데 */
.home-tools {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.45rem;
  margin-top: 0.65rem;
}

.home-tools.is-single {
  grid-template-columns: minmax(0, 15rem);
  justify-content: center;
}

.home-tool {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  min-width: 0;
  padding: 0.8rem 0.7rem;
  text-align: left;
  cursor: pointer;
  transition: transform 0.12s ease, box-shadow 0.12s ease;
}

.home-tool:active {
  transform: scale(0.97);
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.08);
}

.home-tool-icon {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 0.8rem;
  color: #fff;
}

.home-tool-icon svg {
  width: 1.4rem;
  height: 1.4rem;
}


.home-tool-icon.is-list {
  background: linear-gradient(135deg, #818cf8, #3b82f6);
  box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);
}

.home-tool-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.home-tool-title {
  font-size: 0.8rem;
  font-weight: 800;
  color: #0f172a;
  word-break: keep-all;
}

.home-tool-sub {
  margin-top: 0.15rem;
  font-size: 0.62rem;
  line-height: 1.3;
  color: #94a3b8;
  word-break: keep-all;
}
</style>
