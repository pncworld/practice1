<template>
  <!-- 기본 대시보드 왼쪽 AI 창. 첫 화면에 KPI·'과거 vs 현재' 표(slot home)를 보여 주고 그 아래에서 대화가 이어진다
       AI 를 쓸 수 없는 계정(공급사 60·그룹관리자 등)이거나 범위를 아직 못 읽었으면 slot 만 그대로 보여 준다 (기존 대시보드와 같음) -->
  <div v-if="state.enabled" class="dai-root">
    <div class="dai-head">
      <div class="dai-title-wrap">
        <div class="title-section !mb-0">
          <div class="icon"></div>
          <div class="f20 text">PnC# AI 도우미</div>
        </div>
        <div class="sai-prompt">
          <SalesAiRobot />
          <span>무엇을 도와드릴까요? 질문이나 요청을 입력해 주세요.</span>
        </div>
      </div>
      <button
        v-if="state.messages.length > 0"
        type="button"
        class="pnc-sub-btn pnc-sub-btn--rose"
        :disabled="state.loading"
        @click="resetChat">
        <svg class="pnc-sub-btn__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
        새 대화
      </button>
    </div>
    <SalesAiChat>
      <template #intro>
        <div class="dai-home">
          <slot name="home"></slot>
        </div>
      </template>
    </SalesAiChat>
  </div>
  <div v-else class="dai-fallback">
    <slot name="home"></slot>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import SalesAiChat from "@/components/salesAi/SalesAiChat.vue";
import SalesAiRobot from "@/components/salesAi/SalesAiRobot.vue";
import { useSalesAi } from "@/components/salesAi/useSalesAi";

const { state, loadScope, resetChat } = useSalesAi();

onMounted(() => {
  loadScope();
});
</script>

<style scoped>
.dai-root {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  overflow: hidden;
}

.dai-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.9rem 1.25rem 0.75rem;
  border-bottom: 1px solid #e2e8f0;
}

.dai-title-wrap {
  min-width: 0;
}

/* 안내 문구: 눈에 띄는 주황 (구조 막대 파랑과 구분) */
.sai-prompt {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.35rem;
  font-size: 0.95rem;
  font-weight: 700;
  color: #ea580c;
}

.dai-home {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.dai-fallback {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
</style>
