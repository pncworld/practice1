/**
 * PnC# AI 도우미 공유 상태 (2026-11-25)
 * - 레이아웃 팝업(DashboardSalesAi)과 기본 대시보드 AI 창(DashboardSalesAiInline)이 같은 대화·범위를 쓴다
 * - 조회 범위(매장)는 서버(MISALES/SLS00_002AI.asmx)가 토큰 사용자 기준으로 정한다. 화면은 표시만 한다
 * - 메뉴 등록: 서버가 정한 순서(매장 → 메뉴명 → 판매가 → 대분류 → 소분류 → 과세구분 → 확인)로 핵심 항목만 받고,
 *   확인이 끝나면 메뉴코드등록 화면(MST01_003INS)으로 넘겨 그 화면 AI 가 메뉴코드부터 이어서 등록한다
 */
import { computed, reactive } from "vue";
import store from "@/store";
import {
  chatDashboardMenuRegister,
  chatDashboardSales,
  chatDashboardSalesTool,
  getDashboardAiScope,
} from "@/api/dashboardAi";

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
  /** 멤버십 사용 브랜드(가입 회원 있음)면 고객 예시 질문을 보여 준다. 고객 조회 허용 판단은 서버가 다시 한다 */
  useCrm: false,
  /** 도구 사용 방식(chatSalesTool)으로 질문한다. 켜는 계정은 서버 설정(Web.config AiToolMode)이 정한다 */
  useTool: false,
  loading: false,
  /** 로딩 말풍선 안내 종류 ("customer" = 고객 조회, 그 외 빈 값) */
  loadingKind: "",
  testMode: false,
  popupOpen: false,
  /** 화면 표시용 메시지 (오류 포함) */
  messages: [],
  /** 서버로 보내는 대화 기록 (성공한 질문·답만, user/assistant 번갈아) */
  history: [],
  /** 메뉴 등록 진행 중이면 { draft, history } (이전 방식, 2026-11-26 부터 메뉴 관리 칸을 쓴다) */
  menu: null,
  /**
   * 메뉴 관리 칸 (2026-11-26): 도우미 창 안에 펼친 메뉴 관리 도우미(MobileAiMenu embedded)
   * { id, question, key, sentKey, readOnlyText } — question 은 칸에 보낼 문장, key 가 바뀌면 다시 보낸다,
   * sentKey 는 이미 보낸 key (홈 창·팝업을 오가며 칸이 다시 만들어져도 같은 문장을 두 번 보내지 않게)
   */
  menuPanel: null,
  /**
   * 메뉴 관리 칸이 닫힐 때(팝업 닫기·홈 창↔팝업 이동·메뉴 관리 끝내기) 그때까지 보이던 대화 화면 { 칸 id: html } (2026-11-27)
   * 칸이 다시 만들어지면 대화가 처음부터라 결과가 사라져 보였다 → 닫힐 때의 모습을 대화 기록에 남긴다 (누르기 등 동작은 없음)
   */
  menuSnapshots: {},
});
let menuPanelSeq = 0;

/** 메뉴 관리 칸이 닫힐 때의 대화 화면을 남긴다 (같은 칸이 여러 번 닫히면 이어 붙인다) */
export function saveMenuSnapshot(id, html) {
  const h = String(html || "").trim();
  if (!id || !h) return;
  state.menuSnapshots = { ...state.menuSnapshots, [id]: (state.menuSnapshots[id] || "") + h };
}

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
  state.useCrm = false;
  state.useTool = false;
  state.testMode = false;
  state.popupOpen = false;
  state.messages = [];
  state.history = [];
  state.menu = null;
  state.menuPanel = null;
  state.menuSnapshots = {};
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
        state.useCrm = data.CRM_YN === "Y";
        state.useTool = data.TOOL_YN === "Y";
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
  state.menuPanel = null;
  state.menuSnapshots = {};
}

/** 고객 질문 안내용(대략). 실제로 사내 AI 로 보낼지는 서버(SLS00_002AI IsCustomerQuestion)가 정한다 */
const CUSTOMER_HINT = /(고객(?!\s?수)|회원|멤버십|연락처|전화번호|휴대폰|핸드폰|카드번호|탈퇴|휴면|구매\s?이력|방문\s?이력|마일리지|01[016789][-\s]?\d{3,4}[-\s]?\d{4})/;

const SALES_TOPIC_HINT = /(매출|메뉴|영수증|취소|정산|외상|선수금|후불|매장 목록|매장 정보|결제수단|카드사|할인|시간대)/;

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

  // 고객 질문은 오래 걸린다 → 로딩 말풍선 한 개에 안내를 함께 보여 준다 (판단은 서버가 하고, 여기는 안내만)
  const lastAi = [...recent].reverse().find((m) => m.role === "assistant");
  // 고객 답 뒤 이어지는 질문도 고객으로 보되, 매출 등 업무 단어가 있으면 아니다 (서버 IsCustomerRoute·SALES_TOPIC_WORDS 와 같음)
  const customerFollowUp =
    lastAi && String(lastAi.content).startsWith("[고객]") && !SALES_TOPIC_HINT.test(question);
  // 선수금·외상 거래처(고객)는 매출 쪽 조회라 고객 안내를 띄우지 않는다 (서버 IsAccountCustomerWord 와 같음)
  const accountCust = /선수금|외상|미수|후불|선결제|거래처/.test(question);
  state.loadingKind = state.useCrm && !accountCust && (CUSTOMER_HINT.test(question) || customerFollowUp) ? "customer" : "";

  state.loading = true;
  try {
    const res = state.useTool ? await chatDashboardSalesTool(payload) : await chatDashboardSales(payload);
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
    // 메뉴 관리 요청(등록·조회·수정·다국어·메뉴키·분류·시간대 메뉴 판매): 창 안에 메뉴 관리 칸을 펼치고 같은 문장을 넘긴다 (2026-11-26)
    // 다른 화면으로 옮기지 않는다. 권한(메뉴코드등록 메뉴·AI 사용 브랜드)은 칸이 모바일 메뉴 화면과 같은 기준으로 다시 확인한다
    if (data.STATUS === "MENU_REG") {
      openMenuPanel(question);
      return true;
    }

    state.testMode = data.RESULT_NM === "TEST_MODE";
    // 고객 답은 서버가 '[고객]'으로 시작한다. 화면에는 떼고 보여 주고, 기록에는 남겨 서버가 다음 질문을 사내 AI 로 보낼지·Claude 대화에서 뺄지 판단하게 한다
    const isCustomer = String(data.REPLY || "").startsWith("[고객]") || data.CONDITION?.TOPIC === "CUSTOMER";
    const reply = String(data.REPLY || "").replace(/^\[고객\]\s*/, "");
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
      exportKey: data.EXPORT_KEY || "",
      view: "chart",
    });

    // 다음 질문이 조건을 이어받을 수 있게 조회 조건을 답 뒤에 붙여 기록한다
    const condLine = data.CONDITION ? "\n[조회 조건] " + salesAiConditionText(data.CONDITION) : "";
    state.history.push({ role: "user", content: question });
    state.history.push({ role: "assistant", content: (isCustomer ? "[고객] " : "") + (reply || "(답변 없음)") + condLine });
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

// ===== 메뉴 관리 칸 (2026-11-26) =====

/**
 * 메뉴 관리 칸을 펼치고 문장을 넘긴다. 이미 펼쳐져 있으면 그 칸에 이어서 보낸다.
 * 서버가 등록을 막은 이유(I-FRESH 에서 등록, 매장 계정 공통 메뉴 등)가 있으면 칸은 조회·매출만 한다
 */
function openMenuPanel(question) {
  const readOnlyText = state.canRegisterMenu ? "" : state.menuRegMsg;
  if (state.menuPanel) {
    state.menuPanel.question = question;
    state.menuPanel.key += 1;
    state.messages.push({ role: "ai", text: "메뉴 관리 도우미가 이어서 처리합니다." });
    return;
  }
  const id = ++menuPanelSeq;
  state.menuPanel = { id, question, key: 1, sentKey: 0, readOnlyText };
  state.messages.push({
    role: "ai",
    text: "메뉴 관리 도우미가 이어서 처리합니다. 메뉴 관리 중에는 입력하신 내용을 메뉴 관리 도우미가 답하고, 마치면 아래 [메뉴 관리 끝내기]를 눌러 주세요.",
    menuPanelId: id,
  });
}

/** 메뉴 관리 칸이 문장을 받았다 (같은 문장을 다시 보내지 않게) */
export function markMenuPanelSent(key) {
  if (state.menuPanel) state.menuPanel.sentKey = key;
}

/** 메뉴 관리 칸을 닫는다 (칸의 닫기) */
export function closeMenuPanel() {
  if (!state.menuPanel) return;
  state.menuPanel = null;
  state.messages.push({ role: "ai", text: "메뉴 관리를 마쳤습니다. 다른 질문을 입력해 주세요." });
}

// ===== 메뉴 등록 (이전 방식: 값만 받고 메뉴코드등록 화면으로 넘김. 2026-11-26 부터 쓰지 않음) =====

async function sendMenuRegister(question) {
  const menu = state.menu;
  if (!menu) return;
  const recent = menu.history.slice(-MAX_HISTORY_PAIRS * 2);
  const payload = [...recent, { role: "user", content: question }];

  state.loadingKind = "";
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
 * 메뉴코드등록 화면의 왼쪽 메뉴 경로 (이 계정 메뉴 기준, 예: '마스터관리 > 메뉴 마스터 > 메뉴 코드 등록').
 * 메뉴 권한이 없으면 빈 문자열 (2026-11-27: 메뉴 관리 도우미로 못 하는 요청에 화면 경로를 안내)
 */
export function menuScreenPath() {
  const screen = findMenuScreen();
  if (!screen) return "";
  return [screen.strMajorName, screen.strSubName, screen.strTitle || screen.strProgramName]
    .map((v) => String(v || "").trim())
    .filter((v) => v !== "")
    .join(" > ");
}

/** 메뉴코드등록 화면에서 이 메뉴 보기 (sessionStorage 키). MST01_003INS.vue 가 읽고 지운다 (2026-11-27) */
export const AI_MENU_FOCUS_KEY = "pncAiMenuFocus";

/**
 * 메뉴코드등록 화면을 열고 그 메뉴 줄을 선택하게 한다 (AI 창 메뉴 관리 결과에서 메뉴를 누름)
 * @param {{code: string, name?: string, storeCd?: string, storeNm?: string}} target
 * @returns {boolean} 화면을 열었으면 true
 */
export function openMenuScreenAt(target) {
  if (!target || !target.code || !findMenuScreen()) return false;
  try {
    sessionStorage.setItem(
      AI_MENU_FOCUS_KEY,
      JSON.stringify({
        GROUP_CD: String(store.state.userData?.lngStoreGroup ?? ""),
        STORE_CD: String(target.storeCd ?? ""),
        STORE_NM: target.storeNm || "",
        CODE: String(target.code),
        NAME: target.name || "",
        at: Date.now(),
      })
    );
  } catch (e) {
    // 저장소를 못 쓰면 화면만 연다
  }
  // 지금 메뉴코드등록 화면을 보고 있으면 탭을 새로 열지 않고(중복 안내 창 없이) 팝업만 닫고 그 화면이 바로 고르게 한다
  const onScreen = String(window.location.pathname || "").includes("MST01_003INS");
  if (onScreen) {
    state.popupOpen = false;
    window.dispatchEvent(new CustomEvent(AI_MENU_FOCUS_EVENT));
    return true;
  }
  const opened = openMenuScreen();
  // 이미 열린 탭으로 이동하면 화면이 새로 그려지지 않으므로 알림으로도 알린다 (탭 이동이 끝난 뒤)
  if (opened) setTimeout(() => window.dispatchEvent(new CustomEvent(AI_MENU_FOCUS_EVENT)), 800);
  return opened;
}

/** 메뉴코드등록 화면에 '이 메뉴 보기'를 다시 읽으라고 알리는 window 이벤트 이름 */
export const AI_MENU_FOCUS_EVENT = "pnc-ai-menu-focus";

/** 메뉴코드등록 화면을 연다 (넘기는 값 없이 탭만). 열었으면 true */
export function openMenuScreen() {
  const screen = findMenuScreen();
  if (!screen) return false;
  state.popupOpen = false;
  store.state.moveOtherTab = {
    strTitle: screen.strTitle,
    lngProgramID: screen.lngProgramID,
    strUrl: screen.strUrl,
  };
  return true;
}

/**
 * 메뉴 관리 도우미로 못 하는 요청(이미지·주방출력·할인 등): 화면 경로와 [메뉴코드등록 화면 열기] 버튼을 붙인다
 * @param {string} menuText 대상 메뉴 (예: '[10204] 삼선우동'), 모르면 빈 문자열
 */
export function pushMenuScreenGuide(menuText) {
  const path = menuScreenPath();
  if (!path) {
    state.messages.push({ role: "ai", text: "메뉴코드등록 화면 권한이 없어 직접 수정할 수 없습니다. 관리자에게 권한을 요청해 주세요." });
    return;
  }
  const target = menuText ? `'${menuText}' 메뉴를 고른 뒤 ` : "메뉴를 고른 뒤 ";
  state.messages.push({
    role: "ai",
    text: `이 항목은 메뉴코드등록 화면에서 바꿀 수 있습니다.\n경로: ${path}\n화면을 열고 매장을 조회한 다음 ${target}오른쪽 상세정보에서 수정하고 저장해 주세요.`,
    menuScreenLink: true,
  });
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
  CUSTOMER: "고객",
  ANALYZE: "원인 분석",
  SCREEN: "화면 조회",
};

const GROUP_BY_TEXT = {
  TOTAL: "합계",
  DAY: "일별",
  WEEKDAY: "요일별",
  MONTH: "월별",
  STORE: "매장별",
  STORE_DAY: "매장별 일자별",
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
  KIND: "구분별",
};

const COMPARE_TEXT = { prevYear: "전년 비교", prevMonth: "전월 비교", prevWeek: "전주 같은 요일 비교", prevPeriod: "직전 기간 비교" };

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
  // 금액 많은 순이 아닌 정렬 기준 (예: 판매수량 많은 순). 다음 질문이 이어받도록 [조회 조건] 줄에도 들어간다 (2026-11-27)
  if (c.SORT_TEXT) parts.push(c.SORT_TEXT);
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
    // 멤버십 사용 브랜드는 매출 예시를 2개 줄이고 그 뒤에 고객 예시 2개를 붙인다 (2026-11-25 요청)
    const common = state.useCrm
      ? ["이번 달 매출", "지난주 메뉴 TOP 10", "어제 매출취소 내역"]
      : ["이번 달 매출", "어제 시간대별 매출", "지난주 메뉴 TOP 10", "이번 달 결제수단별 매출", "어제 매출취소 내역"];
    const customer = state.useCrm ? ["이번 달 신규 가입 회원 수", "이번 달 고객 가입 리스트"] : [];
    // 현재 상황을 전제로 한 질문(예: '객단가가 왜 낮아졌어?')은 예시에 넣지 않는다 (2026-11-25 요청)
    const sales =
      state.scopeType === "STORE"
        ? [...common, "어제 일일정산레포트", "우리 매장 정보"]
        : common;
    // 메뉴 등록 예시는 항상 보여 준다. 등록할 수 없는 계정·브랜드는 누르면 이유(RMS·I-FRESH 에서 등록 등)를 안내한다
    const menu = ["새 메뉴 등록", "아이스 아메리카노 4500원 메뉴 추가", "커피에 바닐라라떼 등록"];
    // kind: sales = 조회(파란 서브 버튼) / menu = 등록(연두 버튼). 등록 연두·조회 파랑 규칙
    // kind crm = 고객(CRM) 조회(보라 버튼)
    return [
      ...sales.map((text) => ({ text, kind: "sales" })),
      ...customer.map((text) => ({ text, kind: "crm" })),
      ...menu.map((text) => ({ text, kind: "menu" })),
    ];
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
    markMenuPanelSent,
    closeMenuPanel,
  };
}
