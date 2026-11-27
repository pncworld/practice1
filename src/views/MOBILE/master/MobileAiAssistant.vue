<!--
  모바일 PnC# AI 도우미 (통합 AI, 2026-11-27) — /m/MIMASTER/aiAssistant
  - 웹 PnC# AI 도우미와 같은 대화 부품(SalesAiChat, surface="mobile")을 화면 전체로 쓴다. 매출 질문 + 메뉴 관리(같은 창, 입력창 하나)
  - 모바일 세션(store.state.userData)은 웹 세션과 모양이 달라, 메뉴 AI 와 같은 방법(mobileMenuAccess loadMenuAccess)으로 웹 세션을 받아 범위를 읽는다
  - 메뉴 관리 결과에서 메뉴를 누르면 모바일 메뉴 목록(menuManage)에서 그 메뉴를 펼친다
  - 키보드: 모바일 메뉴 AI 와 같은 useChatKeyboard (화면 전체 고정, 크기·위치를 직접 바꾸지 않음)
-->
<template>
  <div class="mas">
    <div class="mas-head">
      <button type="button" class="mas-back" aria-label="뒤로" @click="goBack">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <SalesAiRobot :size="30" />
      <div class="mas-head-text">
        <div class="mas-title">
          PnC# AI 도우미
          <span v-if="versionText" class="mas-ver">{{ versionText }}</span>
        </div>
        <!-- 2026-11-27 요청: 매출·메뉴만이 아니므로(고객·음성 포함) 짧게 -->
        <div class="mas-sub">무엇이든 AI에게 물어보세요</div>
      </div>
      <button
        v-if="state.enabled"
        type="button"
        class="mas-new"
        :disabled="state.loading"
        @click="onReset">
        새 대화
      </button>
    </div>

    <div v-if="!state.scopeLoaded" class="mas-note">불러오는 중입니다…</div>
    <div v-else-if="!state.enabled" class="mas-note">
      이 계정은 PnC# AI 도우미를 쓸 수 없습니다.<br />웹 피앤시오피스 계정 권한을 확인해 주세요.
    </div>
    <SalesAiChat v-else ref="chatRef" class="mas-chat" surface="mobile" :voice="true" @open-mobile-menu="openMobileMenu" />

    <div class="mas-notice">AI는 실수를 할 수 있습니다. 중요한 숫자는 해당 메뉴 화면에서 한 번 더 확인해 주세요.</div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import store from "@/store";
import SalesAiChat from "@/components/salesAi/SalesAiChat.vue";
import SalesAiRobot from "@/components/salesAi/SalesAiRobot.vue";
import { loadSalesAiScope, salesAiVersionText, useSalesAi } from "@/components/salesAi/useSalesAi";
import { loadMenuAccess } from "./mobileMenuAccess";
import { useChatKeyboard } from "./mobileChatKeyboard";

const router = useRouter();
const { state, resetChat } = useSalesAi();
const chatRef = ref(null);
const versionText = computed(() => salesAiVersionText(state.aiVer));

// 키보드가 올라오면 마지막 답변이 보이게 (모바일 메뉴 AI 와 같음)
useChatKeyboard(() => chatRef.value?.scrollToAnswer());

onMounted(async () => {
  store.state.mobileSelectProgName = "PnC# AI 도우미";
  state.mobileActive = true;
  state.popupOpen = false;
  const access = await loadMenuAccess(store.state.StoreToken);
  // 메뉴로 못 하는 요청 안내에 쓸 PC 메뉴코드등록 경로 (메뉴 권한이 없으면 빈 값 → 권한 안내)
  const m = access.menu;
  state.mobileMenuPath = m
    ? [m.strMajorName, m.strSubName, m.strTitle || m.strProgramName].map((v) => String(v || "").trim()).filter((v) => v).join(" > ")
    : "";
  await loadSalesAiScope(access.user || {});
  // 화면을 열 때 키보드를 띄우지 않는다 (모바일 메뉴 관리 AI 와 같음: 입력창을 누를 때만 키보드)
});

onBeforeUnmount(() => {
  state.mobileActive = false;
});

const onReset = () => {
  resetChat();
};

const goBack = () => {
  if (window.history.length > 1) router.back();
  else router.push("/m/homepage");
};

// 메뉴 관리 결과에서 메뉴를 누름: 모바일 메뉴 목록에서 그 메뉴를 펼친다 (펼칠 메뉴는 saveMobileMenuFocus 로 남겨 둠)
const openMobileMenu = () => {
  router.push("/m/MIMASTER/menuManage");
};
</script>

<style scoped>
/* 화면 전체 고정 (모바일 메뉴 AI 와 같음). 키보드가 올라오면 브라우저가 높이를 줄여 입력창이 키보드 위에 붙는다 */
.mas {
  position: fixed;
  inset: 0;
  z-index: 9000;
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: 100dvh;
  background: var(--m-bg, #f8fafc);
}

.mas-head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
  padding: 0.6rem 0.75rem;
  border-bottom: 1px solid var(--m-border, #e2e8f0);
  background: var(--m-surface, #fff);
}

.mas-back {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border: 0;
  border-radius: 0.6rem;
  background: transparent;
  color: var(--m-text, #0f172a);
}

.mas-back svg {
  width: 1.35rem;
  height: 1.35rem;
}

.mas-head-text {
  flex: 1;
  min-width: 0;
}

.mas-title {
  font-size: calc(1rem * var(--m-fs, 1));
  font-weight: 800;
  color: var(--m-text, #0f172a);
}

/* 버전 표시: 테두리·바탕 없이 하늘색 글자만 (2026-11-27 요청: 주황은 안내 문구·입력창과 겹침) */
.mas-ver {
  display: inline-block;
  white-space: nowrap;
  margin-left: 0.3rem;
  font-size: calc(0.7rem * var(--m-fs, 1));
  font-weight: 700;
  color: #0369a1;
}

.mas-sub {
  font-size: calc(0.75rem * var(--m-fs, 1));
  color: #ea580c;
  font-weight: 700;
}

.mas-new {
  flex-shrink: 0;
  height: 2.1rem;
  padding: 0 0.8rem;
  border: 1px solid #fecdd3;
  border-radius: 0.6rem;
  background: #fff1f2;
  color: #9f1239;
  font-size: calc(0.8rem * var(--m-fs, 1));
  font-weight: 700;
}

.mas-note {
  margin: 1rem 0.75rem;
  padding: 0.9rem;
  border: 1px solid var(--m-border, #e2e8f0);
  border-radius: 0.75rem;
  background: var(--m-surface, #fff);
  color: var(--m-text-3, #475569);
  font-size: calc(0.85rem * var(--m-fs, 1));
  line-height: 1.6;
}

/* 대화 부품이 남는 높이를 모두 쓴다 (대화 영역만 스크롤) */
.mas-chat {
  flex: 1 1 0;
  min-height: 0;
}

.mas-notice {
  flex-shrink: 0;
  padding: 0.35rem 0.75rem 0.5rem;
  font-size: calc(0.68rem * var(--m-fs, 1));
  color: #94a3b8;
  text-align: center;
  background: var(--m-surface, #fff);
}
</style>
