/**
 * PnC# AI 도우미 공유 상태 (2026-11-25)
 * - 레이아웃 팝업(DashboardSalesAi)과 기본 대시보드 AI 창(DashboardSalesAiInline)이 같은 대화·범위를 쓴다
 * - 조회 범위(매장)는 서버(MISALES/SLS00_002AI.asmx)가 토큰 사용자 기준으로 정한다. 화면은 표시만 한다
 * - 메뉴 등록: 서버가 정한 순서(매장 → 메뉴명 → 판매가 → 대분류 → 소분류 → 과세구분 → 확인)로 핵심 항목만 받고,
 *   확인이 끝나면 메뉴코드등록 화면(MST01_003INS)으로 넘겨 그 화면 AI 가 메뉴코드부터 이어서 등록한다
 */
import { computed, reactive } from "vue";
import store from "@/store";
import { chatDashboardMenuRegister, chatDashboardSales, getDashboardAiScope } from "@/api/dashboardAi";

/** 공급사 계정 (서버도 차단하지만 화면에서 먼저 호출하지 않는다) */
const USER_ADMIN_ID_SUPPLIER_ACCOUNT = 60;
/** 서버 MAX_CHAT_MESSAGES(19) 이하로 보낸다: 앞 대화 9쌍 + 새 질문 */
const MAX_HISTORY_PAIRS = 9;
/** 메뉴코드등록 화면으로 넘기는 값 (sessionStorage 키). MST01_003INS.vue 가 읽고 지운다 */
export const AI_MENU_HANDOFF_KEY = "pncAiMenuDraft";

const state = reactive({
  userKey: "",
  scopeLoaded: false,
  enabled: false,
  scopeType: "",
  groupNm: "",
  storeCnt: 0,
  storeNm: "",
  canRegisterMenu: false,
  /** 메뉴 등록을 할 수 없는 이유 (서버 안내: RMS·I-FRESH 에서 등록, 매장 계정 공통 메뉴 등) */
  menuRegMsg: "",
  loading: false,
  testMode: false,
  popupOpen: false,
  /** 화면 표시용 메시지 (오류 포함) */
  messages: [],
  /** 서버로 보내는 대화 기록 (성공한 질문·답만, user/assistant 번갈아) */
  history: [],
  /** 메뉴 등록 진행 중이면 { draft, history } */
  menu: null,
});

let scopePromise = null;

function currentUserKey() {
  const u = store.state.userData || {};
  return [u.lngStoreGroup, u.lngSequence, u.lngUserAdminID, u.lngPosition].join("|");
}

function resetAll() {
  state.scopeLoaded = false;
  state.enabled = false;
  state.scopeType = "";
  state.groupNm = "";
  state.storeCnt = 0;
  state.storeNm = "";
  state.canRegisterMenu = false;
  state.menuRegMsg = "";
  state.testMode = false;
  state.popupOpen = false;
  state.messages = [];
  state.history = [];
  state.menu = null;
}

/** 조회 범위를 한 번만 읽는다. 로그인 계정이 바뀌면 대화와 범위를 비우고 다시 읽는다 */
export function loadSalesAiScope() {
  const key = currentUserKey();
  if (state.userKey !== key) {
    state.userKey = key;
    resetAll();
    scopePromise = null;
  }
  if (scopePromise) return scopePromise;

  scopePromise = (async () => {
    const userData = store.state.userData || {};
    if (!userData.lngStoreGroup || Number(userData.lngUserAdminID) === USER_ADMIN_ID_SUPPLIER_ACCOUNT) {
      state.scopeLoaded = true;
      return;
    }
    try {
      const res = await getDashboardAiScope();
      const data = res?.data || {};
      if (data.RESULT_CD === "00" && data.SCOPE_TYPE && data.SCOPE_TYPE !== "BLOCK") {
        state.scopeType = data.SCOPE_TYPE;
        state.groupNm = data.GROUP_NM || "";
        state.storeCnt = Number(data.STORE_CNT) || 0;
        state.storeNm = Array.isArray(data.List) && data.List.length > 0 ? data.List[0].STORE_NM : "";
        // 서버 허용 여부만 기억한다. 메뉴코드등록 화면 권한은 왼쪽 메뉴가 늦게 불러와질 수 있어 등록 요청 때 확인한다
        state.canRegisterMenu = data.MENU_REG_YN === "Y";
        state.menuRegMsg = data.MENU_REG_MSG || "";
        state.enabled = true;
      }
    } catch (e) {
      // 범위 조회 실패(프로시저 미등록 등)면 AI 창을 띄우지 않는다
      console.error("[salesAi] scope", e);
      scopePromise = null;
    } finally {
      state.scopeLoaded = true;
    }
  })();
  return scopePromise;
}

export function resetSalesAiChat() {
  state.messages = [];
  state.history = [];
  state.testMode = false;
  state.menu = null;
}

export async function sendSalesAiText(text) {
  const question = String(text || "").trim();
  if (!question || state.loading || !state.enabled) return false;

  state.messages.push({ role: "user", text: question });

  // 메뉴 등록 진행 중이면 등록 대화로
  if (state.menu) {
    await sendMenuRegister(question);
    return true;
  }

  const recent = state.history.slice(-MAX_HISTORY_PAIRS * 2);
  const payload = [...recent, { role: "user", content: question }];

  state.loading = true;
  try {
    const res = await chatDashboardSales(payload);
    const data = res?.data || {};

    if (data.RESULT_CD !== "00") {
      state.messages.push({
        role: "ai",
        text: data.RESULT_NM || "조회 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
        error: true,
      });
      return true;
    }
    if (data.STATUS === "BLOCK") {
      state.messages.push({ role: "ai", text: data.REPLY, error: true });
      return true;
    }
    // 메뉴 등록 요청: 등록 진행을 시작하고 같은 문장을 첫 입력으로 보낸다
    if (data.STATUS === "MENU_REG") {
      if (!state.canRegisterMenu || !findMenuScreen()) {
        // 서버가 준 이유(RMS·I-FRESH 에서 등록 등)를 우선 보여 주고, 없으면 메뉴코드등록 화면 권한이 없는 경우
        state.messages.push({
          role: "ai",
          text:
            state.menuRegMsg ||
            "메뉴코드등록 화면 권한이 없어 메뉴를 등록할 수 없습니다. 화면 권한이 있는 본사 계정으로 이용해 주세요.",
          error: !state.menuRegMsg,
        });
        return true;
      }
      state.menu = { draft: null, history: [] };
      state.loading = false;
      await sendMenuRegister(question);
      return true;
    }

    state.testMode = data.RESULT_NM === "TEST_MODE";
    const reply = data.REPLY || "";
    state.messages.push({
      role: "ai",
      text: reply,
      condition: data.CONDITION || null,
      columns: Array.isArray(data.COLUMNS) ? data.COLUMNS : [],
      rows: Array.isArray(data.List) ? data.List : [],
      total: data.TOTAL || null,
      prevTotal: data.PREV_TOTAL || null,
      chart: data.CHART || null,
      sections: Array.isArray(data.SECTIONS) ? data.SECTIONS : null,
      view: "chart",
    });

    // 다음 질문이 조건을 이어받을 수 있게 조회 조건을 답 뒤에 붙여 기록한다
    const condLine = data.CONDITION ? "\n[조회 조건] " + salesAiConditionText(data.CONDITION) : "";
    state.history.push({ role: "user", content: question });
    state.history.push({ role: "assistant", content: (reply || "(답변 없음)") + condLine });
  } catch (e) {
    console.error("[salesAi] chat", e);
    state.messages.push({
      role: "ai",
      text: "서버에 연결하지 못했습니다. 잠시 후 다시 시도해 주세요.",
      error: true,
    });
  } finally {
    state.loading = false;
  }
  return true;
}

// ===== 메뉴 등록 =====

async function sendMenuRegister(question) {
  const menu = state.menu;
  if (!menu) return;
  const recent = menu.history.slice(-MAX_HISTORY_PAIRS * 2);
  const payload = [...recent, { role: "user", content: question }];

  state.loading = true;
  try {
    const res = await chatDashboardMenuRegister(payload, menu.draft);
    const data = res?.data || {};
    if (data.RESULT_CD !== "00") {
      state.messages.push({
        role: "ai",
        text: data.RESULT_NM || "메뉴 등록 진행 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
        error: true,
      });
      return;
    }
    state.testMode = data.RESULT_NM === "TEST_MODE";
    const draft = data.DRAFT || null;
    const showCard = data.STEP === "CONFIRM" || data.STATUS === "MENU_READY";
    state.messages.push({
      role: "ai",
      text: data.REPLY || "",
      choices: Array.isArray(data.CHOICES) ? data.CHOICES : [],
      menuDraft: showCard ? draft : null,
      menuReady: data.STATUS === "MENU_READY",
      menuStep: data.STEP || "",
    });

    if (data.STATUS === "MENU_REG") {
      menu.draft = draft;
      menu.history.push({ role: "user", content: question });
      menu.history.push({ role: "assistant", content: data.REPLY || "(질문)" });
    } else {
      // 확인 완료·취소·권한 없음이면 등록 진행을 끝낸다 (완료 카드의 버튼은 메시지에 남은 값으로 넘긴다)
      state.menu = null;
    }
  } catch (e) {
    console.error("[salesAi] menu", e);
    state.messages.push({
      role: "ai",
      text: "서버에 연결하지 못했습니다. 잠시 후 다시 시도해 주세요.",
      error: true,
    });
  } finally {
    state.loading = false;
  }
}

/** 메뉴 등록 진행을 그만둔다 (화면의 '등록 취소' 버튼) */
export function cancelSalesAiMenu() {
  if (!state.menu) return;
  state.menu = null;
  state.messages.push({ role: "ai", text: "메뉴 등록을 취소했습니다. 다른 질문을 입력해 주세요." });
}

/** 왼쪽 메뉴에서 메뉴코드등록 화면 항목 (권한이 없으면 메뉴에 없다) */
function findMenuScreen() {
  const list = store.state.minorCategory || [];
  return list.find((m) => String(m.strUrl || "").includes("MST01_003INS.xml")) || null;
}

/**
 * 확인이 끝난 메뉴를 메뉴코드등록 화면으로 넘긴다.
 * 값은 sessionStorage 에 두고, 메뉴 탭 이동은 다른 화면과 같은 store.state.moveOtherTab 을 쓴다
 * @returns {boolean} 화면을 열었으면 true
 */
export function handoffMenuToScreen(draft) {
  const screen = findMenuScreen();
  if (!screen || !draft) return false;
  try {
    sessionStorage.setItem(AI_MENU_HANDOFF_KEY, JSON.stringify({ ...draft, at: Date.now() }));
  } catch (e) {
    return false;
  }
  state.popupOpen = false;
  store.state.moveOtherTab = {
    strTitle: screen.strTitle,
    lngProgramID: screen.lngProgramID,
    strUrl: screen.strUrl,
  };
  return true;
}

// ===== 표시용 =====

export const SALES_AI_TOPIC_TEXT = {
  SALES: "매출",
  TIME: "시간대별",
  MENU: "메뉴",
  PAYMENT: "결제수단별",
  DISCOUNT: "할인",
  CARD: "카드사별",
  VOID: "매출취소",
  SETTLE: "일일정산레포트",
  STORE_INFO: "매장 정보",
  CREDIT: "외상",
  PREPAID: "선수금",
  STAFF: "직원 후불",
  RECEIPT: "영수증 목록",
  ANALYZE: "원인 분석",
};

const GROUP_BY_TEXT = {
  TOTAL: "합계",
  DAY: "일별",
  WEEKDAY: "요일별",
  MONTH: "월별",
  STORE: "매장별",
  HOUR: "시간별",
  BAND: "구간별",
  MENU: "메뉴별",
  SUBGROUP: "소분류별",
  MAJOR: "대분류별",
  LIST: "목록",
  COMP: "사업장별",
  DEPT: "부서별",
  SUMMARY: "합계",
  HIST: "거래 내역",
  HIST_CHARGE: "충전 내역",
  HIST_USE: "사용 내역",
};

const COMPARE_TEXT = { prevYear: "전년 비교", prevMonth: "전월 비교", prevPeriod: "직전 기간 비교" };

export function salesAiConditionText(c) {
  if (!c) return "";
  // 매장 정보처럼 기간이 없는 결과는 기간을 쓰지 않는다
  const parts = c.FROM_DT ? [c.FROM_DT + " ~ " + c.TO_DT, SALES_AI_TOPIC_TEXT[c.TOPIC] || c.TOPIC] : [SALES_AI_TOPIC_TEXT[c.TOPIC] || c.TOPIC];
  if (c.TOPIC !== "ANALYZE" && c.TOPIC !== "SETTLE" && c.TOPIC !== "STORE_INFO" && GROUP_BY_TEXT[c.GROUP_BY]) {
    // 직원 후불의 COMP 는 소속사별 (외상·선수금은 사업장별)
    parts.push(c.TOPIC === "STAFF" && c.GROUP_BY === "COMP" ? "소속사별" : GROUP_BY_TEXT[c.GROUP_BY]);
  }
  if (c.STORE_TEXT) parts.push(c.STORE_TEXT);
  if (c.WEEKDAY_TEXT) parts.push(c.WEEKDAY_TEXT + "요일");
  if (c.TIME_TEXT) parts.push(c.TIME_TEXT);
  if (c.KEYWORD_TEXT) parts.push("'" + c.KEYWORD_TEXT + "'");
  if (c.COMPARE_FROM_DT) {
    parts.push((COMPARE_TEXT[c.COMPARE] || "비교") + " " + c.COMPARE_FROM_DT + " ~ " + c.COMPARE_TO_DT);
  }
  return parts.join(" · ");
}

export function useSalesAi() {
  const scopeText = computed(() => {
    const brand = state.groupNm ? state.groupNm + " · " : "";
    if (state.scopeType === "STORE") return brand + state.storeNm + " 매출만 조회";
    if (state.scopeType === "SUPERVISOR") return brand + "담당 매장 " + state.storeCnt + "곳 조회";
    return brand + "매장 " + state.storeCnt + "곳 조회";
  });

  const examples = computed(() => {
    const common = ["이번 달 매출", "어제 시간대별 매출", "지난주 메뉴 TOP 10", "이번 달 결제수단별 매출", "어제 매출취소 내역"];
    // 현재 상황을 전제로 한 질문(예: '객단가가 왜 낮아졌어?')은 예시에 넣지 않는다 (2026-11-25 요청)
    const sales =
      state.scopeType === "STORE"
        ? [...common, "어제 일일정산레포트", "우리 매장 정보"]
        : common;
    // 메뉴 등록 예시는 항상 보여 준다. 등록할 수 없는 계정·브랜드는 누르면 이유(RMS·I-FRESH 에서 등록 등)를 안내한다
    const menu = ["새 메뉴 등록", "아이스 아메리카노 4500원 메뉴 추가", "커피에 바닐라라떼 등록"];
    // kind: sales = 조회(파란 서브 버튼) / menu = 등록(연두 버튼). 등록 연두·조회 파랑 규칙
    return [...sales.map((text) => ({ text, kind: "sales" })), ...menu.map((text) => ({ text, kind: "menu" }))];
  });

  return {
    state,
    scopeText,
    examples,
    loadScope: loadSalesAiScope,
    sendText: sendSalesAiText,
    resetChat: resetSalesAiChat,
    cancelMenu: cancelSalesAiMenu,
    handoffMenu: handoffMenuToScreen,
  };
}
