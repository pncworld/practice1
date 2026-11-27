<template>
  <div class="home">
    <div class="home-card home-hello">
      <div class="home-hello-top">
        <span class="home-kicker">안녕하세요</span>
        <span class="home-updated">최신 업데이트 {{ today }}</span>
      </div>
      <div class="home-name">
        <span>{{ StoreName }}</span> 입니다.
      </div>
    </div>

    <!-- PnC# AI 도우미 (통합 AI: 매출 질문 + 메뉴 관리, 2026-11-27). 서버가 AI 를 허용한 계정만 -->
    <button
      v-if="salesAiState.enabled"
      type="button"
      class="home-card home-quick home-ai"
      @click="openAiAssistant">
      <span class="home-quick-icon home-ai-icon" aria-hidden="true">
        <SalesAiRobot :size="30" />
      </span>
      <span class="home-quick-title">PnC# AI 도우미</span>
      <span class="home-quick-sub">무엇이든 AI에게 물어보세요</span>
      <svg class="home-quick-chev" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>

    <!-- 메뉴 관리: 웹 메뉴코드등록(MST01_003INS) 메뉴가 있는 계정만. 인사 카드 바로 아래, 폭 전체의 낮은 한 줄 버튼. 누르면 메뉴 목록 -->
    <button
      v-if="showMenuView"
      type="button"
      class="home-card home-quick"
      @click="openMenuManage">
      <span class="home-quick-icon" aria-hidden="true">
        <!-- 메뉴판 아이콘 -->
        <svg viewBox="0 0 24 24" focusable="false">
          <rect x="4.5" y="3" width="15" height="18" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.8" />
          <path d="M8.5 8h7M8.5 12h7M8.5 16h4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        </svg>
      </span>
      <span class="home-quick-title">메뉴 관리</span>
      <span class="home-quick-sub">{{ showQuickMenu ? "메뉴 조회·초간단 등록" : "메뉴 목록·상세 조회" }}</span>
      <svg class="home-quick-chev" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>

    <!-- 매출 묶음: 매출(일·주·월) + 대비 → 막대 그래프. 사이에 다른 항목을 넣지 않는다 -->
    <div class="home-card home-sales">
      <component
        :is="canOpenRealtime ? 'button' : 'div'"
        :type="canOpenRealtime ? 'button' : null"
        class="home-row is-today"
        :class="{ 'is-link': canOpenRealtime }"
        @click="openRealtime('day')">
        <div class="home-row-left">
          <div class="home-row-label">일매출</div>
          <div class="home-row-prev">전일 {{ lastDaySale || "-" }}원</div>
        </div>
        <div class="home-row-right">
          <div class="home-row-now" :class="{ 'is-loading': !loaded }">
            {{ todaySale || "-" }}<small>원</small>
          </div>
          <div class="home-diff" :class="diffClass(difdaySale)">
            <span class="home-diff-label">전일대비</span>
            <font-awesome-icon
              :icon="['fas', 'circle-arrow-up']"
              v-show="difdaySale > 0" />
            <font-awesome-icon
              :icon="['fas', 'circle-arrow-down']"
              v-show="difdaySale < 0" />
            {{ difdaySale2 }}원
          </div>
        </div>
        <svg v-if="canOpenRealtime" class="home-row-chev" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </component>
      <component
        :is="canOpenRealtime ? 'button' : 'div'"
        :type="canOpenRealtime ? 'button' : null"
        class="home-row"
        :class="{ 'is-link': canOpenRealtime }"
        @click="openRealtime('week')">
        <div class="home-row-left">
          <div class="home-row-label">주간매출</div>
          <div class="home-row-prev">전주 {{ lastWeekSale || "-" }}원</div>
        </div>
        <div class="home-row-right">
          <div class="home-row-now" :class="{ 'is-loading': !loaded }">
            {{ WeekSale || "-" }}<small>원</small>
          </div>
          <div class="home-diff" :class="diffClass(difweekSale)">
            <span class="home-diff-label">전주대비</span>
            <font-awesome-icon
              :icon="['fas', 'circle-arrow-up']"
              v-show="difweekSale > 0" />
            <font-awesome-icon
              :icon="['fas', 'circle-arrow-down']"
              v-show="difweekSale < 0" />
            {{ difweekSale2 }}원
          </div>
        </div>
        <svg v-if="canOpenRealtime" class="home-row-chev" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </component>
      <component
        :is="canOpenRealtime ? 'button' : 'div'"
        :type="canOpenRealtime ? 'button' : null"
        class="home-row"
        :class="{ 'is-link': canOpenRealtime }"
        @click="openRealtime('month')">
        <div class="home-row-left">
          <div class="home-row-label">월매출</div>
          <div class="home-row-prev">전월 {{ lastMonthSale || "-" }}원</div>
        </div>
        <div class="home-row-right">
          <div class="home-row-now" :class="{ 'is-loading': !loaded }">
            {{ MonthSale || "-" }}<small>원</small>
          </div>
          <div class="home-diff" :class="diffClass(difmonthSale)">
            <span class="home-diff-label">전월대비</span>
            <font-awesome-icon
              :icon="['fas', 'circle-arrow-up']"
              v-show="difmonthSale > 0" />
            <font-awesome-icon
              :icon="['fas', 'circle-arrow-down']"
              v-show="difmonthSale < 0" />
            {{ difmonthSale2 }}원
          </div>
        </div>
        <svg v-if="canOpenRealtime" class="home-row-chev" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </component>
    </div>

    <div class="home-card home-chart">
      <div class="home-chart-head">
        <div class="home-chart-legend">
          <span><i class="is-dim"></i>이전</span>
          <span><i></i>현재</span>
        </div>
        <div class="home-chart-unit">단위 (만원)</div>
      </div>
      <div class="home-bars">
        <div class="home-bar-col">
          <div class="home-bar-pair">
            <div class="home-bar is-dim" :style="{ height: prevsaleH }"></div>
            <div class="home-bar" :style="{ height: nextsaleH }"></div>
          </div>
          <div class="home-bar-cap">전일 {{ man(lastDaySale2) }}</div>
          <div class="home-bar-cap is-now">당일 {{ man(todaySale2) }}</div>
        </div>
        <div class="home-bar-col">
          <div class="home-bar-pair">
            <div class="home-bar is-dim" :style="{ height: prevWeeksaleH }"></div>
            <div class="home-bar" :style="{ height: nextWeeksaleH }"></div>
          </div>
          <div class="home-bar-cap">전주 {{ man(lastWeekSale2) }}</div>
          <div class="home-bar-cap is-now">금주 {{ man(WeekSale2) }}</div>
        </div>
        <div class="home-bar-col">
          <div class="home-bar-pair">
            <div class="home-bar is-dim" :style="{ height: prevMonthsaleH }"></div>
            <div class="home-bar" :style="{ height: nextMonthsaleH }"></div>
          </div>
          <div class="home-bar-cap">전월 {{ man(lastMonthSale2) }}</div>
          <div class="home-bar-cap is-now">당월 {{ man(MonthSale2) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getAppStoreList, getMobileDashBoard } from "@/api/mobile";
import { canUseQuickMenu, loadMenuAccess } from "@/views/MOBILE/master/mobileMenuAccess";
import SalesAiRobot from "@/components/salesAi/SalesAiRobot.vue";
import { loadSalesAiScope, useSalesAi } from "@/components/salesAi/useSalesAi";
import { useRouter } from "vue-router";
import {
  formatLocalDate,
  formatLocalDate2,
  formatNumberWithCommas,
  insertMobilePageLog,
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
/** 매출 값을 받아 왔는지 (받기 전에는 금액 자리에 회색 자리 표시) */
const loaded = ref(false);
/** 그래프 아래 숫자(만원): 1,234 형식. 값이 오기 전에는 - */
const man = (v) => (v === "" || v === null || v === undefined ? "-" : Number(v).toLocaleString("ko-KR"));
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
  // PnC# AI 도우미 카드: 웹 세션으로 AI 범위를 읽어 서버가 허용한 계정만 보인다 (2026-11-27)
  if (access.user) loadSalesAiScope(access.user);
};
const openMenuManage = () => {
  router.push("/m/MIMASTER/menuManage");
};

/* PnC# AI 도우미 (통합 AI) */
const { state: salesAiState } = useSalesAi();
const openAiAssistant = () => {
  router.push("/m/MIMASTER/aiAssistant");
};

/**
 * 일매출·주간매출·월매출 줄을 누르면 실시간 매출현황(/m/20008)을 그 기간으로 바로 조회해서 연다
 * 누를 수 있는 조건 (둘 다 만족):
 *  1) 이 계정의 모바일 메뉴에 실시간 매출현황(PROGID 20008)이 있다
 *  2) 본사 계정(매장 목록에 「전체」 행 + 매장 2개 이상 → 「전체」로 조회) 또는 매장 계정(매장 1개 → 자기 매장으로 조회)
 *     매장이 여러 개인데 「전체」 행이 없는 계정은 대시보드 금액과 같은 범위로 조회할 수 없으므로 누를 수 없게 둔다
 * 기간 (대시보드 금액과 같은 기준): 일 = 오늘 / 주간 = 이번 주 일요일 ~ 오늘 / 월 = 이번 달 1일 ~ 오늘
 */
const REALTIME_PROG_ID = 20008;
const realtimeMenu = computed(() =>
  (Array.isArray(store.state.mobileCategory) ? store.state.mobileCategory : []).find(
    (item) => Number(item.PROGID) === REALTIME_PROG_ID
  )
);
/** 본사 또는 매장 계정인지 (매장 목록을 받아 온 뒤에만 true) */
const storeScopeOk = ref(false);
const canOpenRealtime = computed(() => !!realtimeMenu.value && storeScopeOk.value);
const isAllStoreRow = (item) => {
  const name = String(item?.STORE_NM ?? "").replace(/\s/g, "");
  const code = String(item?.STORE_CD ?? "").trim();
  return name === "전체" || (code !== "" && Number(code) === 0);
};
const loadStoreScope = async () => {
  try {
    const u = store.state.userData || {};
    const res = await getAppStoreList(u.GROUP_CD, u.STORE_CD, u.USER_NO);
    const list = Array.isArray(res?.data?.List) ? res.data.List : [];
    const stores = list.filter((item) => !isAllStoreRow(item));
    const hasAll = list.some((item) => isAllStoreRow(item));
    storeScopeOk.value = stores.length === 1 || (stores.length > 1 && hasAll);
  } catch (error) {
    storeScopeOk.value = false;
  }
};
const realtimePeriod = (kind) => {
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (kind === "week") from.setDate(from.getDate() - from.getDay());
  if (kind === "month") from.setDate(1);
  return { from: formatLocalDate(from), to: formatLocalDate(now) };
};
let openingRealtime = false;
const openRealtime = async (kind) => {
  if (!canOpenRealtime.value || openingRealtime) return;
  openingRealtime = true;
  try {
    /* 전체 메뉴에서 화면을 여는 순서와 같다 (mobileTotalMenu.vue moveProgram): 접속 기록 → 화면 이름 저장 → 이동 */
    const name = realtimeMenu.value.PROGNM || "실시간 매출현황";
    await insertMobilePageLog({ strUrl: name, lngProgramID: REALTIME_PROG_ID });
    store.dispatch("saveMobileProgName", name);
    router.push({ path: "/m/" + REALTIME_PROG_ID, query: realtimePeriod(kind) });
  } finally {
    openingRealtime = false;
  }
};
/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  store.state.loading2 = false;
  loadMenuTools();
  loadStoreScope();

  StoreName.value = store.state.userData.STORE_NM;
  store.state.mobileSelectProgName = "";
  let res;
  try {
    res = await getMobileDashBoard(
      store.state.userData.GROUP_CD,
      store.state.userData.STORE_CD,
      store.state.userData.USER_NO
    );
  } catch (error) {
    /* 조회 실패: 아래에서 값 없이 끝낸다 (금액은 - 로 표시) */
  }
  loaded.value = true;

  const data = res?.data?.List?.[0];
  if (!data) return;
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
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  /* 레이아웃이 화면에 mt-1(4px)을 붙이므로 그만큼 빼야 내용이 짧을 때 바깥 스크롤이 생기지 않는다 */
  min-height: calc(100% - 0.25rem);
  /* 위: 상단 바(3.25rem) 아래 / 아래: 하단 탭(3.6rem + 홈 표시줄 영역) 위로 내용이 보이게 */
  padding: 3.75rem 0.75rem calc(4.75rem + env(safe-area-inset-bottom));
  background: var(--m-bg, #f8fafc);
}

.home-card {
  border: 1px solid var(--m-border, #e2e8f0);
  border-radius: 1rem;
  background: var(--m-surface, #fff);
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.04);
}

/* 인사 카드 */
.home-hello {
  padding: 0.75rem 1rem 0.8rem;
}

.home-hello-top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
}

.home-kicker {
  font-size: calc(0.8125rem * var(--m-fs, 1));
  color: var(--m-text-3, #64748b);
}

.home-updated {
  font-size: calc(0.75rem * var(--m-fs, 1));
  font-variant-numeric: tabular-nums;
  color: var(--m-text-4, #94a3b8);
  white-space: nowrap;
}

.home-name {
  margin-top: 0.15rem;
  font-size: calc(1.125rem * var(--m-fs, 1));
  font-weight: 700;
  line-height: 1.35;
  color: var(--m-text, #0f172a);
  word-break: keep-all;
}

.home-name span {
  color: var(--m-accent, #2563eb);
}

/* 메뉴 관리: 폭 전체, 낮은 한 줄(3rem = 48px) 버튼. 아이콘 · 제목 · 설명(넘치면 …) · › */
.home-quick {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  width: 100%;
  height: 3rem;
  padding: 0 0.75rem 0 0.625rem;
  text-align: left;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  transition: background-color 0.15s ease, transform 0.15s ease;
}

.home-quick:active {
  background: var(--m-surface-2, #f1f5f9);
  transform: scale(0.985);
}

.home-quick-icon {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 1.875rem;
  height: 1.875rem;
  border-radius: 0.5625rem;
  background: var(--m-accent-weak, #eff6ff);
  color: var(--m-accent, #2563eb);
}

.home-quick-icon svg {
  width: 1.15rem;
  height: 1.15rem;
}

/* PnC# AI 도우미 카드: 로봇 아이콘(배경 없이), 제목은 웹 AI 창 안내와 같은 주황 (2026-11-27) */
.home-ai .home-ai-icon {
  background: transparent;
}

.home-ai .home-quick-title {
  color: #ea580c;
}

.home-quick-title {
  flex: 0 0 auto;
  font-size: calc(0.9375rem * var(--m-fs, 1));
  font-weight: 700;
  color: var(--m-text, #0f172a);
}

.home-quick-sub {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  font-size: calc(0.8125rem * var(--m-fs, 1));
  color: var(--m-text-3, #64748b);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.home-quick-chev {
  flex: 0 0 auto;
  width: 1rem;
  height: 1rem;
  color: var(--m-text-4, #94a3b8);
}

/* 매출(일·주·월): 한 카드 안에 세 줄. 왼쪽 = 구분·이전 금액, 오른쪽 = 현재 금액·대비 */
.home-sales {
  padding: 0.125rem 0;
  overflow: hidden;
}

.home-row {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  width: 100%;
  min-height: 3.875rem;
  padding: 0.625rem 1rem;
  border: none;
  background: transparent;
  text-align: left;
}

/* 누를 수 있는 줄 (실시간 매출현황으로 이동): 오른쪽 › 표시 + 눌림 색 */
.home-row.is-link {
  padding-right: 0.625rem;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  transition: background-color 0.15s ease;
}

.home-row.is-link:active {
  background: var(--m-surface-2, #f1f5f9);
}

.home-row.is-link .home-row-right {
  margin-left: auto;
}

.home-row-chev {
  flex: 0 0 auto;
  width: 1rem;
  height: 1rem;
  margin-left: -0.25rem;
  color: var(--m-text-4, #94a3b8);
}

.home-row + .home-row {
  border-top: 1px solid var(--m-border, #f1f5f9);
}

.home-row-left {
  flex: 0 1 auto;
  min-width: 0;
}

.home-row-label {
  font-size: calc(0.9375rem * var(--m-fs, 1));
  font-weight: 700;
  color: var(--m-text, #0f172a);
}

.home-row-prev {
  margin-top: 0.2rem;
  font-size: calc(0.8125rem * var(--m-fs, 1));
  font-variant-numeric: tabular-nums;
  color: var(--m-text-3, #64748b);
  white-space: nowrap;
}

.home-row-right {
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  align-items: flex-end;
  text-align: right;
}

.home-row-now {
  min-width: 2rem;
  font-size: calc(1.1875rem * var(--m-fs, 1));
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  line-height: 1.25;
  letter-spacing: -0.01em;
  color: var(--m-text, #0f172a);
  white-space: nowrap;
}

/* 오늘 매출이 가장 먼저 눈에 들어오게 */
.home-row.is-today .home-row-now {
  font-size: calc(1.5rem * var(--m-fs, 1));
  color: var(--m-accent, #2563eb);
}

.home-row-now small {
  margin-left: 0.1rem;
  font-size: calc(0.8125rem * var(--m-fs, 1));
  font-weight: 600;
}

/* 값이 오기 전: 같은 크기의 회색 자리 표시 (값이 들어와도 줄 높이가 변하지 않는다) */
.home-row .home-row-now.is-loading {
  min-width: 6.5rem;
  border-radius: 0.4rem;
  background: var(--m-surface-2, #eef2f6);
  color: transparent;
}

.home-diff {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.2rem;
  font-size: calc(0.8125rem * var(--m-fs, 1));
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--m-text-2, #475569);
  white-space: nowrap;
}

.home-diff-label {
  font-weight: 500;
  color: var(--m-text-3, #64748b);
}

.home-diff.is-up {
  color: var(--m-danger, #dc2626);
}

.home-diff.is-down {
  color: var(--m-accent, #2563eb);
}

/* 막대 그래프 */
.home-chart {
  padding: 0.75rem 0.75rem 0.8rem;
}

.home-chart-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: calc(0.75rem * var(--m-fs, 1));
  color: var(--m-text-3, #64748b);
}

.home-chart-legend {
  display: flex;
  gap: 0.75rem;
}

.home-chart-legend span {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}

.home-chart-legend i {
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 0.2rem;
  background: #3b82f6;
}

.home-chart-legend i.is-dim {
  background: var(--m-chart-dim, #cbd5e1);
}

.home-bars {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.25rem;
}

.home-bar-pair {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 0.4rem;
  height: 7rem;
  border-bottom: 1px solid var(--m-border, #e2e8f0);
}

.home-bar {
  width: 1.5rem;
  min-height: 4px;
  border-radius: 0.4rem 0.4rem 0 0;
  background: #3b82f6;
  /* 값이 들어오면 아래에서 한 번에 부드럽게 올라온다 */
  transition: height 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.home-bar.is-dim {
  background: var(--m-chart-dim, #cbd5e1);
}

.home-bar-cap {
  margin-top: 0.4rem;
  text-align: center;
  font-size: calc(0.75rem * var(--m-fs, 1));
  font-variant-numeric: tabular-nums;
  color: var(--m-text-3, #64748b);
  white-space: nowrap;
}

.home-bar-cap.is-now {
  margin-top: 0.1rem;
  font-size: calc(0.8125rem * var(--m-fs, 1));
  font-weight: 700;
  color: var(--m-text, #0f172a);
}

/* 「동작 줄이기」를 켠 기기: 움직이는 효과를 끈다 */
@media (prefers-reduced-motion: reduce) {
  .home-bar,
  .home-quick {
    transition: none;
  }

  .home-quick:active {
    transform: none;
  }
}
</style>
