<template>
  <!-- AI 매출 도우미 대화 영역 (팝업·대시보드 AI 창 공용). 대화 상태는 useSalesAi 공유 -->
  <div class="sac-root">
    <div v-if="state.testMode" class="sac-test">테스트 모드: AI를 호출하지 않고 이번 달 합계로 조회한 결과입니다.</div>

    <div ref="logRef" class="sac-log" @scroll.passive="rememberLogScroll">
      <!-- 첫 화면: 대시보드는 KPI·표(slot), 팝업은 안내 문구 -->
      <slot name="intro">
        <div v-if="state.messages.length === 0" class="sac-guide">
          <!-- 2026-11-27 요청: 매출만이 아니므로 하는 일을 짧게. 기간 제한·표/그래프 안내는 뺀다 -->
          <!-- 고객 조회는 멤버십 사용 브랜드(useCrm)만 된다 -->
          <p>
            궁금한 것이나 할 일을 말로 요청해 주세요.
            {{ state.useCrm ? "매출·멤버십 고객 조회" : "매출 조회" }}, 메뉴 등록·수정이 가능합니다.
          </p>
        </div>
      </slot>

      <div v-if="state.messages.length === 0" class="sac-chips">
        <!-- 매출 조회 = 파란 서브 버튼, 고객(CRM) 조회 = 보라 버튼, 등록 = 연두 버튼 (등록 연두·조회 파랑 규칙) -->
        <button
          v-for="ex in examples"
          :key="ex.text"
          type="button"
          class="pnc-sub-btn"
          :class="{ 'sac-reg-btn': ex.kind === 'menu', 'sac-crm-btn': ex.kind === 'crm' }"
          :disabled="state.loading"
          @click="send(ex.text)">
          {{ ex.text }}
        </button>
      </div>

      <template v-for="(msg, idx) in state.messages" :key="idx">
      <div
        class="sac-row"
        :class="msg.role === 'user' ? 'sac-row--user' : 'sac-row--ai'">
        <div
          class="sac-bubble"
          :class="{ 'sac-bubble--error': msg.error, 'sac-bubble--wide': hasResult(msg) }">
          <div class="sac-text">{{ msg.text }}</div>
          <!-- 메뉴 관리 도우미로 못 하는 요청: 메뉴코드등록 화면 열기 (2026-11-27) -->
          <button
            v-if="msg.menuScreenLink"
            type="button"
            class="pnc-sub-btn sac-screen-btn"
            @click="onOpenMenuScreen">
            <svg class="pnc-sub-btn__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            메뉴코드등록 화면 열기
          </button>

          <!-- 메뉴 등록: 받은 값 확인 카드 -->
          <div v-if="msg.menuDraft" class="sac-menu-card">
            <div v-if="msg.menuDraft.STORE_NM" class="sac-menu-row"><span>매장</span><b>{{ msg.menuDraft.STORE_NM }}</b></div>
            <div class="sac-menu-row"><span>메뉴명</span><b>{{ msg.menuDraft.NAME || "-" }}</b></div>
            <div class="sac-menu-row"><span>판매가</span><b>{{ fmt(msg.menuDraft.PRICE) }}원</b></div>
            <div class="sac-menu-row">
              <span>분류</span><b>{{ msg.menuDraft.MAIN_NM || "-" }} &gt; {{ msg.menuDraft.SUB_NM || "-" }}</b>
            </div>
            <div class="sac-menu-row"><span>과세구분</span><b>{{ msg.menuDraft.TAX === "2" ? "면세" : "과세" }}</b></div>
            <button
              v-if="msg.menuReady"
              type="button"
              class="pnc-sub-btn sac-reg-btn sac-menu-go"
              @click="goMenuScreen(msg.menuDraft)">
              <svg class="pnc-sub-btn__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              메뉴코드등록 화면에서 이어서 등록
            </button>
          </div>

          <!-- 선택지 (마지막 답에만 누를 수 있게). 메뉴 등록 진행 중 선택지라 등록 색(연두) -->
          <div v-if="msg.choices && msg.choices.length" class="sac-choices">
            <button
              v-for="c in msg.choices"
              :key="c"
              type="button"
              class="pnc-sub-btn sac-reg-btn"
              :disabled="state.loading || idx !== state.messages.length - 1 || !state.menu"
              @click="send(c)">
              {{ c }}
            </button>
          </div>

          <template v-if="hasResult(msg)">
            <div class="sac-cond">{{ conditionText(msg.condition) }}</div>

            <!-- 합계만 있는 결과: 숫자 카드 (매출 합계는 아래에 매출세부내역 영역이 함께 온다) -->
            <div v-if="isKpiResult(msg)" class="sac-kpis">
              <div v-for="col in valueColumns(msg)" :key="col.KEY" class="sac-kpi">
                <span>{{ col.TITLE }}</span>
                <b>{{ cellText(col, msg.total) }}</b>
              </div>
              <div v-if="msg.prevTotal && msg.total.DIFF_RATE !== undefined" class="sac-kpi">
                <span>비교 기간 대비</span>
                <b :class="rateClass(msg.total.DIFF_RATE)">{{ rateText(msg.total.DIFF_RATE) }}</b>
              </div>
            </div>

            <!-- 표·그래프. 도구 사용 방식은 아래 영역(추가 조회 결과)과 함께 나올 수 있다 -->
            <template v-if="!isKpiResult(msg) && (!msg.sections || !msg.sections.length || (msg.rows && msg.rows.length))">
              <div class="sac-tools">
                <div v-if="msg.chart" class="sac-tabs" role="tablist">
                  <button
                    type="button"
                    class="sac-tab"
                    :class="{ 'sac-tab--on': msg.view !== 'table' }"
                    @click="msg.view = 'chart'">
                    그래프
                  </button>
                  <button
                    type="button"
                    class="sac-tab"
                    :class="{ 'sac-tab--on': msg.view === 'table' }"
                    @click="msg.view = 'table'">
                    표
                  </button>
                </div>
                <button type="button" class="pnc-sub-btn sac-excel" @click="downloadExcel(msg)">
                  <svg class="pnc-sub-btn__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path
                      d="M12 4v11M7 10l5 5 5-5M5 19h14"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round" />
                  </svg>
                  엑셀
                </button>
                <!-- 고객 목록: 가린 휴대폰·카드번호 원본은 신청번호를 받아 담당자에게 신청 (고객 조회 = 보라) -->
                <button
                  v-if="msg.exportKey"
                  type="button"
                  class="pnc-sub-btn sac-crm-btn"
                  :disabled="exportBusy"
                  @click="askCustomerExport(msg)">
                  <svg class="pnc-sub-btn__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <rect x="5" y="11" width="14" height="9" rx="2" fill="none" stroke="currentColor" stroke-width="2" />
                    <path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                  </svg>
                  원본 신청
                </button>
              </div>

              <DashboardAiChart v-if="msg.chart && msg.view !== 'table'" :chart="msg.chart" :rows="msg.rows" :columns="msg.columns" />

              <div v-else class="sac-table-wrap">
                <table class="sac-table">
                  <thead>
                    <tr>
                      <th v-for="col in msg.columns" :key="col.KEY">{{ col.TITLE }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, rIdx) in tableRows(msg)" :key="rIdx">
                      <!-- 화면 조회 결과는 화면처럼 같은 값이 이어지는 칸을 합친다 (rowspan 0 = 위 칸에 합쳐져 그리지 않음) -->
                      <template v-for="(col, cIdx) in msg.columns" :key="col.KEY">
                        <td
                          v-if="mergeSpan(msg, rIdx, cIdx) > 0"
                          :rowspan="mergeSpan(msg, rIdx, cIdx)"
                          :class="[col.TYPE === 'text' ? 'sac-td-text' : '', col.KEY === 'DIFF_RATE' ? rateClass(row[col.KEY]) : '', mergeSpan(msg, rIdx, cIdx) > 1 ? 'sac-td-merged' : '']">
                          <!-- 합친 칸은 표를 내려도 이름이 헤더 아래에 남게 한다 (2026-11-27) -->
                          <span v-if="mergeSpan(msg, rIdx, cIdx) > 1" class="sac-merged-label">{{ cellText(col, row) }}</span>
                          <template v-else>{{ cellText(col, row) }}</template>
                        </td>
                      </template>
                    </tr>
                  </tbody>
                  <tfoot v-if="msg.total && msg.rows.length > 1">
                    <tr>
                      <td
                        v-for="(col, cIdx) in msg.columns"
                        :key="col.KEY"
                        :class="[col.TYPE === 'text' ? 'sac-td-text' : '', col.KEY === 'DIFF_RATE' ? rateClass(msg.total[col.KEY]) : '']">
                        {{ cIdx === 0 ? totalLabel(msg) : totalCellText(col, msg.total) }}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </template>

            <!-- 일일정산레포트처럼 영역이 여러 개인 결과: 영역마다 제목 + 표 -->
            <template v-if="msg.sections && msg.sections.length">
              <div class="sac-tools">
                <button type="button" class="pnc-sub-btn sac-excel" @click="downloadSectionsExcel(msg)">
                  <svg class="pnc-sub-btn__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path
                      d="M12 4v11M7 10l5 5 5-5M5 19h14"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round" />
                  </svg>
                  엑셀
                </button>
              </div>
              <div v-for="(sec, sIdx) in msg.sections" :key="sIdx" class="sac-section">
                <div class="sac-sec-title">{{ sec.TITLE }}</div>
                <div v-if="!sec.ROWS || sec.ROWS.length === 0" class="sac-sec-empty">자료 없음</div>
                <div v-else class="sac-table-wrap sac-table-wrap--sec">
                  <table class="sac-table">
                    <thead>
                      <tr>
                        <th v-for="col in sec.COLUMNS" :key="col.KEY">{{ col.TITLE }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(row, rIdx) in sec.ROWS" :key="rIdx">
                        <td v-for="col in sec.COLUMNS" :key="col.KEY" :class="col.TYPE === 'text' ? 'sac-td-text' : ''">
                          {{ cellText(col, row) }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </template>
          </template>
        </div>
      </div>
      <!-- 메뉴 관리 (2026-11-26, 2026-11-27 입력창 하나로): 메뉴 관리 도우미의 대화를 이 대화에 이어 붙인다.
           입력은 아래 입력창이 메뉴 관리 도우미로 넘긴다. 홈 창·팝업 중 보이는 한 곳에만 펼친다 -->
      <!-- 메뉴 관리 칸이 닫힐 때(팝업 닫기·창 이동·끝내기) 남긴 대화 화면 (보기만, 2026-11-27) -->
      <div
        v-if="msg.menuPanelId && state.menuSnapshots[msg.menuPanelId]"
        class="sac-menu-snapshot mst003-chat-popup--bare"
        v-html="state.menuSnapshots[msg.menuPanelId]"></div>
      <SalesAiMenuPanel
        v-if="isLiveMenuPanel(msg)"
        :ref="setMenuPanelRef"
        :question="state.menuPanel.sentKey === state.menuPanel.key ? '' : state.menuPanel.question"
        :question-key="state.menuPanel.key"
        :read-only-text="state.menuPanel.readOnlyText"
        :mobile="props.surface === 'mobile'"
        @sent="markMenuPanelSent"
        @close="closeMenuPanel"
        @menu-state="onMenuState"
        @screen-only="pushMenuScreenGuide"
        @focus-menu="onFocusMenuInScreen"
        @snapshot="(h) => saveMenuSnapshot(msg.menuPanelId, h)" />
      </template>

      <div v-if="state.loading" class="sac-row sac-row--ai">
        <div class="sac-bubble sac-bubble--loading">
          <span class="sac-dots" aria-hidden="true"><i></i><i></i><i></i></span>
          {{ state.loadingKind === "customer" ? "고객 정보를 조회하고 있습니다" : "조회하고 있습니다" }}
          <span class="sac-elapsed">{{ loadingSec }}초</span>
          <div class="sac-loading-sub">
            {{ state.loadingKind === "customer" ? "고객 정보 조회는 시간이 조금 더 걸립니다(약 20~30초)." : "분석 질문은 30초 정도 걸릴 수 있습니다." }}
          </div>
        </div>
      </div>
    </div>

    <!-- 메뉴 등록 진행 중 표시 -->
    <div v-if="state.menu" class="sac-menu-bar">
      <span>메뉴 등록 진행 중 · 순서대로 안내해 드립니다</span>
      <button type="button" class="pnc-sub-btn pnc-sub-btn--gray" :disabled="state.loading" @click="cancelMenu">
        <svg class="pnc-sub-btn__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <circle cx="12" cy="12" r="8.25" fill="none" stroke="currentColor" stroke-width="2" />
          <path d="M9.2 9.2l5.6 5.6M14.8 9.2l-5.6 5.6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
        등록 취소
      </button>
    </div>

    <!-- 메뉴 관리 중 표시 (2026-11-27): 이때 입력은 메뉴 관리 도우미가 받는다 -->
    <div v-if="menuMode" class="sac-menu-bar">
      <span>메뉴 관리 중 · 입력하신 내용은 메뉴 관리 도우미가 답합니다</span>
      <button type="button" class="pnc-sub-btn pnc-sub-btn--gray" :disabled="menuInfo.busy" @click="endMenuMode">
        <svg class="pnc-sub-btn__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <circle cx="12" cy="12" r="8.25" fill="none" stroke="currentColor" stroke-width="2" />
          <path d="M9.2 9.2l5.6 5.6M14.8 9.2l-5.6 5.6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
        메뉴 관리 끝내기
      </button>
    </div>

    <!-- 음성 대화 중 상태 (모바일). 읽는 중에 누르면 건너뛰고 바로 듣기 -->
    <div v-if="voice.on" class="sac-voice-bar" :class="'sac-voice-bar--' + voice.phase" @click="onVoiceBarClick">
      <span class="sac-voice-dot" aria-hidden="true"></span>
      <span class="sac-voice-text">{{ voicePhaseText }}</span>
      <button type="button" class="sac-voice-stop" @click.stop="toggleVoice">멈춤</button>
    </div>

    <div class="sac-input">
      <textarea
        ref="inputRef"
        v-model="inputText"
        class="sac-textarea"
        rows="2"
        maxlength="500"
        :placeholder="inputPlaceholder"
        :disabled="inputBusy"
        :readonly="voice.on"
        @pointerdown="onInputTouch"
        @keydown="onKeydown"></textarea>
      <div class="sac-btns" :class="{ 'sac-btns--voice': voice.supported }">
      <button
        type="button"
        class="pnc-sub-btn sac-send"
        :disabled="inputBusy || !inputText.trim()"
        @click="send(inputText)">
        <svg class="pnc-sub-btn__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        보내기
      </button>
      <!-- 음성 대화 (모바일, 브라우저가 음성 인식을 지원할 때만): 보내기 아래 (2026-11-27 요청) -->
      <button
        v-if="voice.supported"
        type="button"
        class="sac-mic"
        :class="{ 'sac-mic--on': voice.on }"
        :aria-label="voice.on ? '음성 대화 멈춤' : '음성 대화 시작'"
        @click="toggleVoice">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <rect x="9" y="3" width="6" height="11" rx="3" fill="none" stroke="currentColor" stroke-width="2" />
          <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
        {{ voice.on ? "멈춤" : "말하기" }}
      </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineEmits, defineExpose, defineProps, nextTick, onActivated, onBeforeUnmount, onDeactivated, onMounted, ref, watch } from "vue";
import SalesAiMenuPanel from "@/components/salesAi/SalesAiMenuPanel.vue";
import { utils, writeFile } from "xlsx-js-style";
import Swal from "sweetalert2";
import DashboardAiChart from "@/components/DashboardAiChart.vue";
import { getCustomerExportRows, requestCustomerExport } from "@/api/dashboardAi";
import {
  SALES_AI_TOPIC_TEXT,
  openMenuScreen,
  openMenuScreenAt,
  pushMenuScreenGuide,
  saveMenuSnapshot,
  saveMobileMenuFocus,
  salesAiConditionText,
  useSalesAi,
} from "@/components/salesAi/useSalesAi";
import { choiceIndexFromSpeech, useVoiceChat } from "@/components/salesAi/useVoiceChat";

const props = defineProps({
  // 이 대화 영역이 어디에 있는지: inline = 기본 대시보드 AI 창 / popup = 상단 AI 팝업 / mobile = 모바일 통합 AI 화면
  // (메뉴 관리 칸을 보이는 한 곳에만 펼친다)
  surface: { type: String, default: "inline" },
  // 음성 대화(마이크 듣기 + 휴대폰 음성으로 읽기) 사용. 모바일 통합 AI 화면만 켠다 (2026-11-27 요청: 음성은 모바일만)
  voice: { type: Boolean, default: false },
});
// open-mobile-menu: 모바일에서 메뉴를 누름 → 모바일 메뉴 목록에서 그 메뉴 보기 { code, name, storeCd } (화면 이동은 모바일 화면이 한다)
const emit = defineEmits(["open-mobile-menu"]);

const { state, examples, sendText, cancelMenu, handoffMenu, markMenuPanelSent, closeMenuPanel } = useSalesAi();

/** 지금 대화가 보이는 곳: 모바일 통합 AI 화면 / 상단 팝업 / 홈 AI 창 */
function liveSurface() {
  if (state.mobileActive) return "mobile";
  return state.popupOpen ? "popup" : "inline";
}

/** 이 메시지 아래에 메뉴 관리 칸을 펼칠지 (열린 칸의 메시지 + 지금 보이는 곳: 팝업이 열려 있으면 팝업, 아니면 홈 창) */
function isLiveMenuPanel(msg) {
  if (!msg.menuPanelId || !state.menuPanel || state.menuPanel.id !== msg.menuPanelId) return false;
  return liveSurface() === props.surface;
}

// ===== 메뉴 관리 중: 입력창 하나로 (2026-11-27) =====
// 메뉴 관리 칸이 이 대화 영역에 펼쳐져 있으면 입력창의 말은 메뉴 관리 도우미가 받는다
const menuMode = computed(() => !!state.menuPanel && liveSurface() === props.surface);
const EMPTY_MENU_INFO = { ready: false, busy: false, placeholder: "", count: 0 };
const menuInfo = ref({ ...EMPTY_MENU_INFO });
let menuPanelRef = null;
function setMenuPanelRef(el) {
  menuPanelRef = el;
}
function onMenuState(s) {
  menuInfo.value = { ...EMPTY_MENU_INFO, ...s };
}
watch(menuMode, (on) => {
  if (!on) menuInfo.value = { ...EMPTY_MENU_INFO };
});
// 메뉴 관리 도우미의 말풍선이 늘면 아래로
watch(
  () => menuInfo.value.count,
  () => scrollToBottom()
);
const inputBusy = computed(() => state.loading || (menuMode.value && menuInfo.value.busy));
const inputPlaceholder = computed(() =>
  menuMode.value
    ? `메뉴 관리: ${menuInfo.value.placeholder || "원하시는 작업을 입력해 주세요."}`
    : "예: 메뉴코드 등록해줘"
);
// 메뉴 관리 결과에서 메뉴를 누름: 메뉴코드등록 화면을 열고 그 메뉴 줄을 선택한다 (2026-11-27)
function onFocusMenuInScreen(target) {
  // 모바일: 웹 화면 대신 모바일 메뉴 목록에서 그 메뉴를 펼친다
  if (props.surface === "mobile") {
    saveMobileMenuFocus(target);
    emit("open-mobile-menu", target);
    return;
  }
  if (!openMenuScreenAt(target)) {
    state.messages.push({
      role: "ai",
      text: "메뉴코드등록 화면을 열 수 없습니다. 왼쪽 메뉴에서 메뉴코드등록 화면 권한을 확인해 주세요.",
      error: true,
    });
  }
}
function onOpenMenuScreen() {
  if (!openMenuScreen()) {
    state.messages.push({
      role: "ai",
      text: "메뉴코드등록 화면을 열 수 없습니다. 왼쪽 메뉴에서 메뉴코드등록 화면 권한을 확인해 주세요.",
      error: true,
    });
  }
}
function endMenuMode() {
  closeMenuPanel();
  focusInput();
}
// 입력창의 말을 메뉴 관리 도우미로 넘긴다. 아직 준비 전(매장 선택 전·불러오는 중)이면 안내한다
async function sendToMenu(q) {
  const ok = menuPanelRef ? await menuPanelRef.sendText(q) : false;
  if (!ok) {
    inputText.value = q;
    state.messages.push({
      role: "ai",
      text: menuInfo.value.ready
        ? "메뉴 관리 도우미가 답을 쓰는 중입니다. 잠시 후 다시 보내 주세요."
        : "메뉴 관리 칸이 아직 준비되지 않았습니다. 매장을 고르거나 메뉴 목록을 불러온 뒤 다시 보내 주세요.",
    });
  }
}

/** 확인이 끝난 메뉴를 메뉴코드등록 화면으로 넘긴다 */
function goMenuScreen(draft) {
  if (!handoffMenu(draft)) {
    state.messages.push({
      role: "ai",
      text: "메뉴코드등록 화면을 열 수 없습니다. 왼쪽 메뉴에서 메뉴코드등록 화면 권한을 확인해 주세요.",
      error: true,
    });
  }
}

const inputText = ref("");
const logRef = ref(null);
const inputRef = ref(null);

function scrollToBottom() {
  nextTick(() => {
    const el = logRef.value;
    if (el) el.scrollTop = el.scrollHeight;
  });
}

/**
 * 고객 원본 신청: 먼저 신청번호를 받을지 묻고, 받으면 대화창에 번호와 신청 방법을 남긴다 (2026-11-25)
 * 원본 자료(가리지 않은 휴대폰·카드번호)는 화면으로 내려오지 않는다. 담당자가 신청번호로 따로 추출한다
 */
const exportBusy = ref(false);
async function askCustomerExport(msg) {
  if (!msg.exportKey || exportBusy.value) return;
  const ok = await Swal.fire({
    title: "원본 자료 신청",
    text: "가린 휴대폰·카드번호가 들어간 원본 자료가 필요하신가요? 신청번호를 발급해 드립니다. 신청번호로 담당자에게 메일로 신청해 주세요. (신청번호는 24시간 동안 유효합니다)",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "신청번호 받기",
    cancelButtonText: "취소",
  });
  if (!ok.isConfirmed) return;
  exportBusy.value = true;
  try {
    const res = await requestCustomerExport(msg.exportKey);
    const data = res?.data || {};
    if (data.RESULT_CD !== "00" || !data.REQ_NO) {
      state.messages.push({ role: "ai", text: data.RESULT_NM || "원본 자료 신청 중 오류가 발생했습니다.", error: true });
      return;
    }
    state.messages.push({
      role: "ai",
      text:
        `신청번호: ${data.REQ_NO}\n` +
        `이 번호로 담당자에게 메일로 원본 자료를 신청해 주세요.\n` +
        `신청번호는 24시간 동안 유효합니다${data.EXPIRE_DT ? ` (${data.EXPIRE_DT} 까지)` : ""}.`,
    });
  } catch (e) {
    console.error("[salesAi] export", e);
    state.messages.push({ role: "ai", text: "서버에 연결하지 못했습니다. 잠시 후 다시 시도해 주세요.", error: true });
  } finally {
    exportBusy.value = false;
    scrollToBottom();
  }
}

/** 로딩 중 경과 초 (진행 중인지 알 수 있게 1초마다 올린다) */
const loadingSec = ref(0);
let loadingTimer = null;
function stopLoadingTimer() {
  if (loadingTimer) clearInterval(loadingTimer);
  loadingTimer = null;
}
watch(
  () => state.loading,
  (on) => {
    stopLoadingTimer();
    loadingSec.value = 0;
    if (on) loadingTimer = setInterval(() => (loadingSec.value += 1), 1000);
  },
  { immediate: true }
);
onBeforeUnmount(stopLoadingTimer);

/**
 * 대화 위치 기억 (2026-11-26: 다른 화면에 갔다가 홈으로 오면 대화가 맨 위로 감)
 *  keep-alive 로 화면을 숨겼다 다시 붙이면 브라우저가 스크롤을 0 으로 돌린다 → 스크롤할 때마다 위치를 적어 두고 돌아올 때 되돌린다
 *  (떠나는 시점 onDeactivated 에는 이미 화면에서 떨어져 0 이라 그때 읽으면 안 됨. 팝업 창은 keep-alive 밖이라 onActivated 가 불리지 않음)
 */
let savedLogScroll = -1;
let logDetached = false;
function rememberLogScroll() {
  const el = logRef.value;
  if (!el || !el.isConnected || logDetached) return;
  savedLogScroll = el.scrollTop;
}
onDeactivated(() => {
  logDetached = true;
});
onActivated(() => {
  logDetached = false;
  if (savedLogScroll < 0) return;
  nextTick(() => {
    requestAnimationFrame(() => {
      if (logRef.value) logRef.value.scrollTop = savedLogScroll;
    });
  });
});

/**
 * 팝업·모바일 창을 열면 마지막 대화가 보이게 (2026-11-27 요청: 상단 AI 아이콘으로 열면 맨 위부터 보여 불편)
 *  메뉴 관리 내용처럼 늦게 그려지는 부분이 있어, 그린 직후와 잠시 뒤에 한 번 더 내린다. 대시보드 창(inline)은 위치 기억을 그대로 쓴다
 */
onMounted(() => {
  if (props.surface !== "popup" && props.surface !== "mobile") return;
  scrollToBottom();
  requestAnimationFrame(() => scrollToBottom());
  setTimeout(scrollToBottom, 300);
});

/** 다른 화면(팝업↔대시보드)에서 대화가 늘어도 아래로 */
watch(
  () => [state.messages.length, state.loading],
  () => scrollToBottom()
);

async function send(text, fromVoice = false) {
  const q = String(text || "").trim();
  if (!q || inputBusy.value) return;
  // 음성 대화 중 버튼(예시·선택지)이나 보내기를 누르면 음성 대화를 멈추고 그 입력으로 진행
  if (!fromVoice && voiceChat) voiceChat.stop();
  inputText.value = "";
  scrollToBottom();
  if (menuMode.value) await sendToMenu(q);
  else await sendText(q);
  scrollToBottom();
  // 음성 대화 중에는 입력창에 커서를 두지 않는다 (휴대폰 키보드가 올라오지 않게)
  if (!voiceChat || !voiceChat.voice.on) nextTick(() => inputRef.value?.focus());
}

// ===== 모바일 음성 대화 (2026-11-27, voice 를 켠 화면만) =====
// 말한 글을 같은 보내기 흐름으로 보내고, 그 뒤에 새로 온 답 글을 돌려준다 (소리로 읽기용)
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function waitIdle(limitMs) {
  const until = Date.now() + limitMs;
  while (inputBusy.value && Date.now() < until) await sleep(200);
}
// 메뉴 관리 도우미는 답 뒤에 다음 질문을 조금 늦게 붙이기도 해서(예: 코드 확정 → 주방출력 질문), 말풍선 수가 잠시 그대로일 때까지 기다린다
async function waitMenuSettled() {
  const until = Date.now() + 6000;
  let count = menuInfo.value.count;
  let stableSince = Date.now();
  while (Date.now() < until) {
    await sleep(150);
    if (menuInfo.value.busy || menuInfo.value.count !== count) {
      count = menuInfo.value.count;
      stableSince = Date.now();
    } else if (Date.now() - stableSince >= 700) break;
  }
  await nextTick();
}
async function voiceSend(q) {
  await waitIdle(60000);
  const before = state.messages.length;
  const wasMenu = menuMode.value;
  // 메뉴 관리의 선택 단계에서 '2번'처럼 번호로 말하면 화면의 그 선택지를 누른 것과 같게 (같은 이름 분류가 둘이어도 정확히)
  const pick = wasMenu ? choiceIndexFromSpeech(q, (menuInfo.value.choices || []).length) : -1;
  if (pick >= 0 && menuPanelRef && (await menuPanelRef.pickChoice(pick))) {
    await waitIdle(60000);
    await waitMenuSettled();
    return menuInfo.value.lastReply || "";
  }
  await send(q, true);
  if (wasMenu) {
    if (menuMode.value) await waitMenuSettled();
    // 메뉴 관리가 끝났으면(끝내기 등) 대화창에 새로 붙은 안내를 읽는다
    if (!menuMode.value) {
      return state.messages
        .slice(before)
        .filter((m) => m.role === "ai")
        .map((m) => m.text)
        .join("\n");
    }
    return menuInfo.value.lastReply || "";
  }
  let reply = state.messages
    .slice(before)
    .filter((m) => m.role === "ai")
    .map((m) => m.text)
    .join("\n");
  // 이 말로 메뉴 관리가 시작되면(예: '새 메뉴 등록') 메뉴 관리 도우미의 첫 답까지 기다려 함께 읽는다
  if (!wasMenu && menuMode.value) {
    const until = Date.now() + 30000;
    while (Date.now() < until && (!menuInfo.value.ready || menuInfo.value.busy || !menuInfo.value.lastReply)) await sleep(200);
    await waitMenuSettled();
    if (menuInfo.value.lastReply) reply = menuInfo.value.lastReply;
  }
  return reply;
}
const voiceChat = props.voice
  ? useVoiceChat({
      send: voiceSend,
      onInterim: (t) => {
        inputText.value = t;
      },
      onNotice: (msg) => {
        state.messages.push({ role: "ai", text: msg });
      },
    })
  : null;
const voice = voiceChat ? voiceChat.voice : { supported: false, on: false, phase: "" };
const voicePhaseText = computed(() => {
  if (voice.phase === "listen") return voice.heard ? "듣고 있어요…" : "말씀하세요. 듣고 있어요";
  if (voice.phase === "think") return "답을 찾고 있어요";
  if (voice.phase === "speak") return "읽어 드리는 중 · 누르면 건너뜀";
  return "";
});
function toggleVoice() {
  if (!voiceChat) return;
  if (voice.on) voiceChat.stop();
  else {
    inputRef.value?.blur();
    voiceChat.start(state.messages.length === 0 ? "무엇을 도와드릴까요? 말씀하세요." : "말씀하세요.");
  }
}
function onVoiceBarClick() {
  if (voiceChat && voice.phase === "speak") voiceChat.skip();
}
// 입력창을 누르면 글자로 입력하려는 것 → 음성 대화를 멈춘다
function onInputTouch() {
  if (voiceChat && voice.on) voiceChat.stop();
}
// 새 대화(대화 비움)면 음성 대화도 멈춘다
watch(
  () => state.messages.length,
  (n) => {
    if (n === 0 && voiceChat) voiceChat.stop();
  }
);

function onKeydown(e) {
  if (e.key === "Enter" && !e.shiftKey && !e.isComposing) {
    e.preventDefault();
    send(inputText.value);
  }
}

function focusInput() {
  nextTick(() => inputRef.value?.focus());
}

defineExpose({ focusInput, scrollToBottom });

// ===== 결과 표시 =====

const conditionText = salesAiConditionText;

function hasResult(msg) {
  if (msg.role !== "ai" || !msg.condition) return false;
  if (Array.isArray(msg.sections) && msg.sections.length > 0) return true;
  return Array.isArray(msg.columns) && msg.columns.length > 0;
}

/** 합계(TOTAL) 1행 결과는 표 대신 숫자 카드 */
function isKpiResult(msg) {
  return msg.condition && msg.condition.GROUP_BY === "TOTAL" && msg.condition.TOPIC !== "ANALYZE";
}

/** 화면 표에 그리는 최대 행 수. 그 이상(고객 목록 최대 20,000명 등)은 엑셀로 받는다 (서버 CUSTOMER_SCREEN_ROWS 와 같게) */
const MAX_TABLE_ROWS = 500;

function tableRows(msg) {
  const rows = msg.rows || [];
  return rows.length > MAX_TABLE_ROWS ? rows.slice(0, MAX_TABLE_ROWS) : rows;
}

/**
 * 셀 병합: 화면 조회 결과(TOPIC=SCREEN) 또는 서버가 MERGE=Y 로 준 열만.
 * 왼쪽 열부터 같은 값이 이어지고 그 왼쪽 열들도 같은 묶음일 때만 합친다 (예: 같은 매장·같은 테이블의 메뉴 줄)
 * 결과: spans[r][c] = 1 이상이면 그 칸의 rowspan, 0 이면 위 칸에 합쳐져 그리지 않음. 메시지마다 한 번 계산해 둔다
 */
const mergeCache = new WeakMap();
function mergeSpans(msg) {
  const rows = tableRows(msg);
  const key = msg;
  if (mergeCache.has(key)) return mergeCache.get(key);
  const cols = msg.columns || [];
  const screen = msg.condition && msg.condition.TOPIC === "SCREEN";
  const mergeable = cols.map((c) => screen || c.MERGE === "Y");
  const spans = rows.map(() => cols.map(() => 1));
  // sameAsPrev[r] = 지금까지 왼쪽 열들이 모두 윗줄과 같은지
  const sameAsPrev = rows.map((_, r) => r > 0);
  for (let c = 0; c < cols.length; c++) {
    if (!mergeable[c]) {
      for (let r = 0; r < rows.length; r++) sameAsPrev[r] = false;
      continue;
    }
    let start = 0;
    for (let r = 1; r <= rows.length; r++) {
      const same =
        r < rows.length && sameAsPrev[r] && String(rows[r][cols[c].KEY] ?? "") === String(rows[r - 1][cols[c].KEY] ?? "");
      if (r < rows.length) sameAsPrev[r] = same;
      if (!same) {
        spans[start][c] = r - start;
        for (let k = start + 1; k < r; k++) spans[k][c] = 0;
        start = r;
      }
    }
  }
  mergeCache.set(key, spans);
  return spans;
}

function mergeSpan(msg, rIdx, cIdx) {
  if (!(msg.condition && msg.condition.TOPIC === "SCREEN") && !(msg.columns || []).some((c) => c.MERGE === "Y")) return 1;
  const spans = mergeSpans(msg);
  return spans[rIdx] ? spans[rIdx][cIdx] : 1;
}

/** 비중 열: 실매출 비중(SHARE)과 정렬 기준 비중(SORT_SHARE, 예: 판매수량 비중) — 2026-11-27 */
function isShareKey(key) {
  return key === "SHARE" || key === "SORT_SHARE";
}

function valueColumns(msg) {
  return msg.columns.filter((c) => c.TYPE !== "text" && !isShareKey(c.KEY) && !c.KEY.startsWith("PREV_") && c.KEY !== "DIFF_RATE");
}

function totalLabel(msg) {
  const all = Number(msg.condition?.ROW_TOTAL_CNT) || 0;
  const shown = msg.rows ? msg.rows.length : 0;
  if (all > shown) {
    return msg.condition?.GROUP_BY === "STORE" ? "전체 " + all + "곳 합계" : "전체 " + all + "건 합계";
  }
  return "합계";
}

function fmt(v) {
  if (v === "" || v == null) return "-";
  const n = Number(v);
  return Number.isFinite(n) ? n.toLocaleString("ko-KR") : String(v);
}

function rateText(v) {
  if (v === "" || v == null) return "-";
  const n = Number(v);
  if (!Number.isFinite(n)) return "-";
  return (n > 0 ? "+" : "") + n.toFixed(1) + "%";
}

function cellText(col, row) {
  const v = row ? row[col.KEY] : "";
  if (col.TYPE === "text") return v == null || v === "" ? "-" : v;
  if (col.TYPE === "num") return v === "" || v == null ? "-" : fmt(v);
  if (col.TYPE === "rate") return isShareKey(col.KEY) ? (v === "" || v == null ? "-" : Number(v).toFixed(1) + "%") : rateText(v);
  return fmt(v);
}

/** 합계 행: 글자 열·비중은 비우고 숫자·비교만 */
function totalCellText(col, total) {
  if (col.TYPE === "text" || isShareKey(col.KEY)) return "";
  if (total[col.KEY] === undefined) return "";
  return cellText(col, total);
}

/** 증가 = 빨강, 감소 = 파랑 (국내 매출 표기 관례) */
function rateClass(v) {
  const n = Number(v);
  if (v === "" || v == null || !Number.isFinite(n) || n === 0) return "";
  return n > 0 ? "sac-up" : "sac-down";
}

// ===== 엑셀 =====

const EXCEL_BORDER = {
  top: { style: "thin", color: { rgb: "CBD5E1" } },
  bottom: { style: "thin", color: { rgb: "CBD5E1" } },
  left: { style: "thin", color: { rgb: "CBD5E1" } },
  right: { style: "thin", color: { rgb: "CBD5E1" } },
};

/** 영역이 여러 개인 결과(일일정산레포트): 한 시트에 영역 제목·머리글·행을 차례로 쌓는다 */
function downloadSectionsExcel(msg) {
  const aoa = [];
  const styles = []; // [rowIndex, kind, colCount, cols]
  aoa.push(["PnC# AI 도우미 · " + state.groupNm]);
  aoa.push(["조회 조건", conditionText(msg.condition)]);
  let maxCols = 2;
  msg.sections.forEach((sec) => {
    aoa.push([]);
    aoa.push(["■ " + sec.TITLE]);
    styles.push([aoa.length - 1, "title", 1, sec.COLUMNS]);
    aoa.push(sec.COLUMNS.map((c) => c.TITLE));
    styles.push([aoa.length - 1, "head", sec.COLUMNS.length, sec.COLUMNS]);
    maxCols = Math.max(maxCols, sec.COLUMNS.length);
    if (!sec.ROWS || sec.ROWS.length === 0) {
      aoa.push(["자료 없음"]);
      return;
    }
    sec.ROWS.forEach((r) => {
      aoa.push(sec.COLUMNS.map((c) => excelValue(c, r)));
      styles.push([aoa.length - 1, "body", sec.COLUMNS.length, sec.COLUMNS]);
    });
  });

  const ws = utils.aoa_to_sheet(aoa);
  styles.forEach(([r, kind, n, cols]) => {
    for (let c = 0; c < n; c++) {
      const cell = ws[utils.encode_cell({ r, c })];
      if (!cell) continue;
      if (kind === "title") {
        cell.s = { font: { bold: true, sz: 12 } };
      } else if (kind === "head") {
        cell.s = { border: EXCEL_BORDER, fill: { fgColor: { rgb: "F1F5F9" } }, font: { bold: true }, alignment: { horizontal: "center" } };
      } else {
        cell.s = { border: EXCEL_BORDER };
        if (typeof cell.v === "number") cell.z = cols[c].TYPE === "num" ? "#,##0.##" : "#,##0";
      }
    }
  });
  ws["!cols"] = Array.from({ length: maxCols }, (_, i) => ({ wch: i === 0 ? 18 : 13 }));

  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, "일일정산");
  const c = msg.condition || {};
  const name = `AI매출_일일정산_${c.STORE_TEXT || ""}_${c.FROM_DT || ""}_${c.TO_DT || ""}.xlsx`.replace(/[\\/:*?"<>|]/g, "");
  writeFile(wb, name);
}

function excelValue(col, row) {
  const v = row ? row[col.KEY] : "";
  if (col.TYPE === "text") return v ?? "";
  if (v === "" || v == null) return "";
  const n = Number(v);
  return Number.isFinite(n) ? n : v;
}

async function downloadExcel(msg) {
  // 고객 목록처럼 화면에 일부만 받은 결과는 버튼을 누를 때 서버에서 전체를 받는다 (2026-11-26)
  let rows = msg.rows;
  const allCnt = Number(msg.condition?.ROW_TOTAL_CNT) || 0;
  if (msg.exportKey && allCnt > rows.length) {
    if (exportBusy.value) return;
    exportBusy.value = true;
    Swal.fire({ title: "엑셀 준비 중", text: allCnt.toLocaleString() + "명 전체를 조회하고 있습니다.", allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    try {
      const res = await getCustomerExportRows(msg.exportKey);
      const data = res?.data || {};
      if (data.RESULT_CD !== "00") {
        Swal.fire({ icon: "warning", text: data.RESULT_NM || "엑셀을 받지 못했습니다." });
        return;
      }
      rows = Array.isArray(data.List) ? data.List : [];
      Swal.close();
    } catch (e) {
      Swal.fire({ icon: "error", text: "엑셀을 받지 못했습니다. 잠시 후 다시 시도해 주세요." });
      return;
    } finally {
      exportBusy.value = false;
    }
  }
  const cols = msg.columns;
  const aoa = [];
  aoa.push(["PnC# AI 도우미 · " + state.groupNm]);
  aoa.push(["조회 조건", conditionText(msg.condition)]);
  aoa.push([]);
  aoa.push(cols.map((c) => c.TITLE));
  rows.forEach((r) => aoa.push(cols.map((c) => excelValue(c, r))));
  if (msg.total && rows.length > 1) {
    aoa.push(cols.map((c, i) => (i === 0 ? totalLabel(msg) : c.TYPE === "text" || isShareKey(c.KEY) ? "" : excelValue(c, msg.total))));
  }

  const ws = utils.aoa_to_sheet(aoa);
  const headerRow = 3;
  for (let r = headerRow; r < aoa.length; r++) {
    for (let c = 0; c < cols.length; c++) {
      const ref = utils.encode_cell({ r, c });
      const cell = ws[ref];
      if (!cell) continue;
      cell.s = {
        border: {
          top: { style: "thin", color: { rgb: "CBD5E1" } },
          bottom: { style: "thin", color: { rgb: "CBD5E1" } },
          left: { style: "thin", color: { rgb: "CBD5E1" } },
          right: { style: "thin", color: { rgb: "CBD5E1" } },
        },
      };
      if (r === headerRow) {
        cell.s.fill = { fgColor: { rgb: "F1F5F9" } };
        cell.s.font = { bold: true };
        cell.s.alignment = { horizontal: "center" };
      } else if (typeof cell.v === "number") {
        cell.z = cols[c].TYPE === "rate" ? "0.0" : "#,##0";
      }
    }
  }
  ws["!cols"] = cols.map((c) => ({ wch: c.TYPE === "text" ? 22 : 14 }));

  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, "AI 매출");
  const c = msg.condition || {};
  const name = `AI매출_${SALES_AI_TOPIC_TEXT[c.TOPIC] || "조회"}_${c.FROM_DT || ""}_${c.TO_DT || ""}.xlsx`.replace(/[\\/:*?"<>|]/g, "");
  writeFile(wb, name);
}
</script>

<style scoped>
.sac-root {
  flex: 1 1 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.sac-test {
  padding: 0.4rem 1rem;
  font-size: 0.8rem;
  color: #9a3412;
  background: #fff7ed;
  border-bottom: 1px solid #fed7aa;
}

.sac-log {
  flex: 1 1 0;
  min-height: 0;
  overflow-y: auto;
  padding: 1rem;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.sac-guide {
  color: #334155;
  font-size: 0.875rem;
  line-height: 1.5;
}

.sac-guide-sub {
  margin-top: 0.25rem;
  font-size: 0.8rem;
  color: #64748b;
}

.sac-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.sac-row {
  display: flex;
}

.sac-row--user {
  justify-content: flex-end;
}

.sac-row--ai {
  justify-content: flex-start;
}

.sac-bubble {
  max-width: 100%;
  min-width: 0;
  padding: 0.6rem 0.8rem;
  border-radius: 0.6rem;
  font-size: 0.875rem;
  line-height: 1.55;
}

.sac-bubble--wide {
  width: 100%;
}

.sac-row--user .sac-bubble {
  max-width: 80%;
  background: #fff7ed;
  border: 1px solid #fdba74;
  color: #7c2d12;
}

.sac-row--ai .sac-bubble {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  color: #0f172a;
}

.sac-bubble--error {
  border-color: #fecaca !important;
  background: #fef2f2 !important;
  color: #991b1b !important;
}

.sac-bubble--loading {
  color: #334155 !important;
}

.sac-loading-sub {
  margin-top: 0.2rem;
  font-size: 0.75rem;
  color: #64748b;
}

.sac-elapsed {
  margin-left: 0.35rem;
  font-variant-numeric: tabular-nums;
  color: #ea580c;
  font-weight: 600;
}

/* 진행 중 표시: 점 3개가 차례로 움직인다 */
.sac-dots {
  display: inline-flex;
  gap: 3px;
  margin-right: 0.4rem;
  vertical-align: middle;
}

.sac-dots i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #f97316;
  animation: sac-dot 1s infinite ease-in-out;
}

.sac-dots i:nth-child(2) {
  animation-delay: 0.15s;
}

.sac-dots i:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes sac-dot {
  0%,
  80%,
  100% {
    opacity: 0.25;
    transform: translateY(0);
  }
  40% {
    opacity: 1;
    transform: translateY(-3px);
  }
}

.sac-text {
  white-space: pre-wrap;
  word-break: keep-all;
  overflow-wrap: anywhere;
  line-height: 1.7;
}

.sac-screen-btn {
  margin-top: 0.5rem;
}

/* 메뉴 관리 칸이 닫힐 때 남긴 대화 화면: 보기만 (버튼·메뉴 누르기는 동작하지 않으므로 막는다) */
.sac-menu-snapshot {
  pointer-events: none;
}

.sac-cond {
  margin-top: 0.4rem;
  font-size: 0.75rem;
  color: #64748b;
}

.sac-tools {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.sac-tabs {
  display: inline-flex;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  overflow: hidden;
}

.sac-tab {
  height: 1.75rem;
  padding: 0 0.75rem;
  font-size: 0.8rem;
  color: #475569;
  background: #ffffff;
  cursor: pointer;
}

.sac-tab + .sac-tab {
  border-left: 1px solid #cbd5e1;
}

/* 선택 = 주황 (화면이 파랑 위주라 선택 표시는 주황) */
.sac-tab--on {
  background: #fff7ed;
  color: #c2410c;
  font-weight: 700;
}

.sac-excel {
  margin-left: auto;
}

/* 메뉴 등록 */
.sac-choices {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.55rem;
}

/* 등록 계열 = 연두 (조회 = 파랑과 구분). 공통 pnc-sub-btn 의 색만 이 화면에서 바꾼다 */
.pnc-sub-btn.sac-reg-btn {
  color: #3f6212;
  border-color: #a3e635;
  background-color: #f7fee7;
  box-shadow: 0 1px 2px 0 rgb(101 163 13 / 0.12);
}

.pnc-sub-btn.sac-reg-btn:hover:not(:disabled) {
  background-color: #ecfccb;
  border-color: #84cc16;
}

/* 고객(CRM) 예시: 매출 조회(파랑)·등록(연두)·선택(주황)과 구분되는 보라 (2026-11-25 요청) */
.pnc-sub-btn.sac-crm-btn {
  color: #6d28d9;
  border-color: #c4b5fd;
  background-color: #f5f3ff;
  box-shadow: 0 1px 2px 0 rgb(124 58 237 / 0.12);
}

.pnc-sub-btn.sac-crm-btn:hover:not(:disabled) {
  background-color: #ede9fe;
  border-color: #a78bfa;
}

.sac-menu-card {
  margin-top: 0.55rem;
  padding: 0.6rem 0.75rem;
  border: 1px solid #bef264;
  border-radius: 0.5rem;
  background: #f7fee7;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.sac-menu-row {
  display: flex;
  gap: 0.75rem;
  font-size: 0.85rem;
}

.sac-menu-row span {
  width: 4.5rem;
  flex-shrink: 0;
  color: #64748b;
}

.sac-menu-row b {
  color: #0f172a;
}

.sac-menu-go {
  align-self: flex-start;
  margin-top: 0.4rem;
}

.sac-menu-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.4rem 1rem;
  font-size: 0.8rem;
  font-weight: 700;
  color: #3f6212;
  background: #f7fee7;
  border-top: 1px solid #d9f99d;
}

.sac-section + .sac-section {
  margin-top: 0.75rem;
}

/* 영역 제목: 왼쪽 파란 세로 바 (section-title-bar 규칙) */
.sac-sec-title {
  position: relative;
  margin-top: 0.6rem;
  padding-left: 0.55rem;
  font-size: 0.85rem;
  font-weight: 700;
  color: #0f172a;
}

.sac-sec-title::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.15rem;
  bottom: 0.15rem;
  width: 3px;
  border-radius: 2px;
  background: #2563eb;
}

.sac-sec-empty {
  margin-top: 0.3rem;
  font-size: 0.8rem;
  color: #94a3b8;
}

.sac-table-wrap--sec {
  max-height: 16rem;
}

.sac-table-wrap {
  margin-top: 0.5rem;
  max-height: 20rem;
  overflow: auto;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
}
/* 합친 칸: 화면 그리드처럼 위쪽에 맞추고 옅은 배경 */
.sac-td-merged {
  vertical-align: top;
  background: #fffbeb;
}
.sac-merged-label {
  position: sticky;
  top: 2.1rem;
  display: block;
}
/* 결과 표 스크롤 막대: 얇아서 잡기 어려워 16px 로 키운다 (콤보 펼침 목록 공통 막대와 같은 굵기) — 2026-11-26 요청 */
/* 대화 영역(.sac-log) 세로 막대도 같은 16px 로 (2026-11-27 요청: 가늘어서 잡기 어려움) */
.sac-table-wrap::-webkit-scrollbar,
.sac-log::-webkit-scrollbar {
  width: 16px;
  height: 16px;
}
.sac-table-wrap::-webkit-scrollbar-track,
.sac-log::-webkit-scrollbar-track {
  background: #f1f5f9;
}
.sac-table-wrap::-webkit-scrollbar-thumb,
.sac-log::-webkit-scrollbar-thumb {
  background: #94a3b8;
  border-radius: 8px;
  border: 3px solid #f1f5f9;
}
.sac-table-wrap::-webkit-scrollbar-thumb:hover,
.sac-log::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}
.sac-table-wrap::-webkit-scrollbar-corner,
.sac-log::-webkit-scrollbar-corner {
  background: #f1f5f9;
}

.sac-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8rem;
}

/* 구분선: 행·열 모두 보이게 (2026-11-27 요청, 예전 #f1f5f9 는 거의 안 보임) */
.sac-table th,
.sac-table td {
  padding: 0.35rem 0.55rem;
  border-bottom: 1px solid #e2e8f0;
  border-right: 1px solid #e2e8f0;
  text-align: right;
  white-space: nowrap;
}

.sac-table th:last-child,
.sac-table td:last-child {
  border-right: 0;
}

.sac-table th {
  position: sticky;
  top: 0;
  background: #f1f5f9;
  color: #334155;
  font-weight: 600;
  text-align: center;
  border-bottom: 1px solid #cbd5e1;
  /* 합친 칸의 따라오는 이름(.sac-merged-label)이 스크롤 때 헤더 위로 겹치지 않게 헤더를 위 층에 (2026-11-27) */
  z-index: 2;
}

.sac-table .sac-td-text {
  text-align: left;
}

.sac-table tfoot td {
  position: sticky;
  bottom: 0;
  z-index: 2;
  background: #f8fafc;
  font-weight: 700;
  border-top: 1px solid #cbd5e1;
}

.sac-kpis {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.sac-kpi {
  display: flex;
  flex-direction: column;
  min-width: 7rem;
  padding: 0.45rem 0.65rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  background: #f8fafc;
}

.sac-kpi span {
  font-size: 0.75rem;
  color: #64748b;
}

.sac-kpi b {
  font-size: 0.95rem;
  color: #0f172a;
}

.sac-up {
  color: #dc2626 !important;
}

.sac-down {
  color: #2563eb !important;
}

/* 보내기 버튼은 질문창과 같은 높이 (공통 pnc-sub-btn 의 2rem 고정 높이를 이 화면에서만 풀어 준다) */
.sac-input .sac-send {
  height: auto;
  min-height: 0;
  align-self: stretch;
  /* 2026-11-27 요청: 버튼 폭을 줄여 질문창을 넓게 */
  padding: 0 0.6rem;
  gap: 0.2rem;
  border-width: 2px;
  border-radius: 0.5rem;
  font-size: 0.8rem;
}

.sac-input {
  display: flex;
  align-items: stretch;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-top: 1px solid #e2e8f0;
  background: #ffffff;
}

/* 보내기·말하기 버튼 묶음: 음성이 없는 화면(웹)은 묶음 없이 기존 배치 그대로 */
.sac-btns {
  display: contents;
}
.sac-btns--voice {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  flex-shrink: 0;
}
.sac-btns--voice .sac-send {
  flex: 1.7 1 0;
  min-height: 2.3rem;
  font-size: 0.85rem;
  justify-content: center;
}
/* 음성 대화 (모바일, 2026-11-27): 말하기 버튼은 청록 (주황 입력·파랑 조회·연두 등록·보라 고객과 구분), 켜지면 청록으로 채움 */
.sac-mic {
  flex: 1 1 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
  min-height: 1.75rem;
  padding: 0 0.6rem;
  border: 1px solid #5eead4;
  border-radius: 0.5rem;
  background: #f0fdfa;
  color: #0f766e;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
}
.sac-mic svg {
  width: 1.05rem;
  height: 1.05rem;
}
.sac-mic--on {
  background: #0d9488;
  border-color: #0d9488;
  color: #ffffff;
}
.sac-voice-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 1rem;
  border-top: 1px solid #99f6e4;
  background: #f0fdfa;
  color: #115e59;
  font-size: 0.85rem;
  font-weight: 700;
}
.sac-voice-text {
  flex: 1;
  min-width: 0;
}
.sac-voice-dot {
  width: 0.7rem;
  height: 0.7rem;
  border-radius: 50%;
  background: #94a3b8;
  flex-shrink: 0;
}
.sac-voice-bar--listen .sac-voice-dot {
  background: #0d9488;
  animation: sac-voice-pulse 1s ease-in-out infinite;
}
.sac-voice-bar--think .sac-voice-dot {
  background: #f59e0b;
}
.sac-voice-bar--speak .sac-voice-dot {
  background: #16a34a;
  animation: sac-voice-pulse 1.4s ease-in-out infinite;
}
@keyframes sac-voice-pulse {
  0%,
  100% {
    transform: scale(0.8);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.25);
    opacity: 1;
  }
}
.sac-voice-stop {
  flex-shrink: 0;
  height: 1.9rem;
  padding: 0 0.8rem;
  border: 1px solid #5eead4;
  border-radius: 0.5rem;
  background: #ffffff;
  color: #115e59;
  font-size: 0.8rem;
  font-weight: 700;
}

/* 질문창: 안내 문구와 같은 주황 계열 두꺼운 테두리로 눈에 띄게, 입력 중에는 은은한 빛 */
.sac-textarea {
  flex: 1 1 auto;
  min-width: 0;
  resize: none;
  padding: 0.5rem 0.7rem;
  border: 2px solid #fb923c;
  border-radius: 0.5rem;
  background: #fffaf5;
  font-size: 0.9rem;
  line-height: 1.4;
  color: #0f172a;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.sac-textarea::placeholder {
  color: #9a6b4b;
}

.sac-textarea:focus {
  outline: none;
  border-color: #ea580c;
  background: #ffffff;
  box-shadow: 0 0 0 4px rgb(251 146 60 / 0.25);
}

.sac-textarea:disabled {
  border-color: #fed7aa;
}
</style>
