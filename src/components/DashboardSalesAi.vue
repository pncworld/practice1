<template>
  <!-- AI 매출 도우미 팝업 (BasicLayout 에 하나만 둔다). 공급사(60)·그룹관리자 등 서버가 BLOCK 으로 준 계정은 아무것도 그리지 않는다
       showFab: 오른쪽 아래 둥근 버튼 (1871 매출분석 대시보드에서만). 다른 화면은 레이아웃 상단 아이콘이 openPanel() 을 부른다
       대화는 useSalesAi 공유 상태라 기본 대시보드의 AI 창(DashboardSalesAiInline)과 같은 대화를 쓴다 -->
  <template v-if="state.enabled">
    <button
      v-show="showFab && !state.popupOpen"
      type="button"
      class="dsa-fab"
      title="PnC# AI 도우미에게 물어보세요"
      @click="openPanel">
      <!-- 아이콘: 도우미 창과 같은 로봇 (2026-11-27 요청) -->
      <SalesAiRobot :size="28" />
      PnC# AI 도우미
    </button>

    <Teleport to="body">
      <div v-if="state.popupOpen" class="dsa-mask">
        <div class="dsa-popup" role="dialog" aria-modal="true" aria-label="PnC# AI 도우미">
          <div class="dsa-head">
            <div class="dsa-title-wrap">
              <h2 class="dsa-title">PnC# AI 도우미</h2>
              <div class="dsa-prompt">
                <SalesAiRobot />
                <span>무엇을 도와드릴까요? 질문이나 요청을 입력해 주세요.</span>
              </div>
              <!-- AI 오답 안내·제보 (2026-11-26 요청) -->
              <div class="dsa-notice">
                AI는 실수를 할 수 있습니다. 중요한 숫자는 해당 메뉴 화면에서 한 번 더 확인해 주세요.<br />
                답변이 틀렸거나 수정 사항이 있으시면 화면을 캡처해 브랜드명과 함께
                <a href="mailto:sungwoo@pncworld.com">sungwoo@pncworld.com</a> 으로 보내 주세요.
              </div>
            </div>
            <div class="dsa-head-btns">
              <button
                type="button"
                class="pnc-sub-btn pnc-sub-btn--rose"
                :disabled="state.loading"
                @click="onReset">
                <svg class="pnc-sub-btn__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                </svg>
                새 대화
              </button>
              <button type="button" class="pnc-sub-btn pnc-sub-btn--gray" @click="closePanel">
                <svg class="pnc-sub-btn__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                </svg>
                닫기
              </button>
            </div>
          </div>

          <SalesAiChat ref="chatRef" surface="popup" />
        </div>
      </div>
    </Teleport>
  </template>
</template>

<script setup>
import { computed, defineExpose, defineProps, nextTick, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import SalesAiChat from "@/components/salesAi/SalesAiChat.vue";
import SalesAiRobot from "@/components/salesAi/SalesAiRobot.vue";
import { useSalesAi } from "@/components/salesAi/useSalesAi";

const props = defineProps({
  /** 오른쪽 아래 둥근 버튼 표시 */
  showFab: { type: Boolean, default: true },
});

const store = useStore();
const { state, loadScope, resetChat } = useSalesAi();
const chatRef = ref(null);

onMounted(() => {
  loadScope();
});

/** 다른 계정으로 다시 로그인하면 범위를 다시 읽는다 */
watch(
  () => store.state.userData,
  () => loadScope()
);

function openPanel() {
  if (!state.enabled) return;
  state.popupOpen = true;
  nextTick(() => chatRef.value?.focusInput());
}

function closePanel() {
  state.popupOpen = false;
}

/** 레이아웃 상단 버튼용: 열려 있으면 닫고, 닫혀 있으면 연다 */
function togglePanel() {
  if (state.popupOpen) closePanel();
  else openPanel();
}

function onReset() {
  resetChat();
  nextTick(() => chatRef.value?.focusInput());
}

defineExpose({
  enabled: computed(() => state.enabled),
  open: computed(() => state.popupOpen),
  openPanel,
  closePanel,
  togglePanel,
  showFab: computed(() => props.showFab),
});
</script>

<style scoped>
.dsa-fab {
  position: fixed;
  right: 1.75rem;
  bottom: 1.75rem;
  z-index: 60;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  height: 2.75rem;
  padding: 0 1.1rem;
  border: 1px solid rgb(147 197 253);
  border-radius: 999px;
  background: rgb(239 246 255);
  color: rgb(30 64 175);
  font-size: 0.875rem;
  font-weight: 700;
  box-shadow: 0 6px 16px rgb(30 64 175 / 0.18);
  cursor: pointer;
}

.dsa-fab:hover {
  background: rgb(219 234 254);
  border-color: rgb(96 165 250);
}

.dsa-mask {
  position: fixed;
  inset: 0;
  z-index: 10050;
  background: rgb(15 23 42 / 0.25);
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  padding: 1.25rem;
}

.dsa-popup {
  width: min(52rem, calc(100vw - 2.5rem));
  height: min(48rem, calc(100vh - 2.5rem));
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 0.75rem;
  box-shadow: 0 16px 36px rgb(15 23 42 / 0.2);
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

.dsa-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.dsa-title-wrap {
  min-width: 0;
}

.dsa-title {
  position: relative;
  padding-left: 0.7rem;
  font-size: 1.05rem;
  font-weight: 700;
  color: #0f172a;
}

.dsa-title::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.15rem;
  bottom: 0.15rem;
  width: 4px;
  border-radius: 2px;
  background: #2563eb;
}

/* 안내 문구: 눈에 띄는 주황 (구조 막대 파랑과 구분) */
.dsa-prompt {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.3rem;
  font-size: 0.95rem;
  font-weight: 700;
  color: #ea580c;
}
.dsa-notice {
  margin-top: 0.3rem;
  font-size: 0.78rem;
  line-height: 1.45;
  color: #64748b;
}
.dsa-notice a {
  color: #475569;
  text-decoration: underline;
}

.dsa-head-btns {
  display: flex;
  flex-shrink: 0;
  gap: 0.5rem;
}
</style>
