<!-- 모바일 전용 확인 시트·완료 알림 (상태·함수는 mobileDialog.js) -->
<template>
  <Teleport to="body">
    <Transition name="md-fade">
      <div v-if="dialogState.open" class="md-mask" @click.self="onMask">
        <Transition name="md-up" appear>
          <div class="md-sheet" role="dialog" aria-modal="true">
            <span class="md-grip" aria-hidden="true"></span>
            <span class="md-icon" :class="'is-' + dialogState.tone" aria-hidden="true">
              <svg v-if="dialogState.type === 'confirm'" viewBox="0 0 24 24" focusable="false">
                <path d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17v3Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
              </svg>
              <svg v-else-if="dialogState.tone === 'error'" viewBox="0 0 24 24" focusable="false">
                <path d="M7 7l10 10M17 7L7 17" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
              </svg>
              <svg v-else viewBox="0 0 24 24" focusable="false">
                <path d="M12 7v6M12 16.5v.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" />
              </svg>
            </span>
            <div class="md-title">{{ dialogState.title }}</div>
            <div v-if="dialogState.message" class="md-message">{{ dialogState.message }}</div>
            <div v-if="dialogState.from !== '' || dialogState.to !== ''" class="md-change">
              <div class="md-change-row">
                <span class="md-change-label">변경 전</span>
                <span class="md-change-from">{{ dialogState.from }}</span>
              </div>
              <svg class="md-change-arrow" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M12 5v14M6 13l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <div class="md-change-row">
                <span class="md-change-label">변경 후</span>
                <span class="md-change-to">{{ dialogState.to }}</span>
              </div>
            </div>
            <div class="md-actions">
              <button v-if="dialogState.type === 'confirm'" type="button" class="md-btn" @click="closeDialog(false)">
                {{ dialogState.cancelText }}
              </button>
              <button type="button" class="md-btn is-primary" @click="closeDialog(true)">
                {{ dialogState.confirmText }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>

    <Transition name="md-toast">
      <div v-if="toastState.show" class="md-toast" :class="'is-' + toastState.tone" role="status">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <circle cx="12" cy="12" r="10" fill="currentColor" />
          <path d="M7.5 12.3l3 3 6-6.3" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span>{{ toastState.text }}</span>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { closeDialog, dialogState, toastState } from "./mobileDialog";

// 바깥을 누르면 확인창은 취소, 안내창은 닫기
const onMask = () => closeDialog(dialogState.type === "alert");
</script>

<style scoped>
.md-mask {
  position: fixed;
  inset: 0;
  z-index: 10060;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: rgba(15, 23, 42, 0.45);
}

.md-sheet {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 32rem;
  padding: 0.6rem 1.1rem calc(1rem + env(safe-area-inset-bottom));
  border-radius: 1.4rem 1.4rem 0 0;
  background: #fff;
  box-shadow: 0 -10px 30px rgba(15, 23, 42, 0.18);
  text-align: center;
}

.md-grip {
  width: 2.6rem;
  height: 0.28rem;
  margin-bottom: 1rem;
  border-radius: 999px;
  background: #e2e8f0;
}

.md-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 999px;
  background: #eff6ff;
  color: #2563eb;
}

.md-icon svg {
  width: 1.45rem;
  height: 1.45rem;
}

.md-icon.is-warning {
  background: #fff7ed;
  color: #ea580c;
}

.md-icon.is-error {
  background: #fef2f2;
  color: #dc2626;
}

.md-title {
  margin-top: 0.7rem;
  font-size: 1.05rem;
  font-weight: 800;
  color: #0f172a;
}

.md-message {
  margin-top: 0.35rem;
  font-size: 0.82rem;
  line-height: 1.5;
  color: #64748b;
  white-space: pre-line;
  word-break: keep-all;
}

.md-change {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  margin-top: 0.85rem;
  padding: 0.7rem 0.85rem;
  border-radius: 0.9rem;
  background: #f8fafc;
}

.md-change-row {
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
  text-align: left;
}

.md-change-label {
  flex-shrink: 0;
  width: 3.2rem;
  font-size: 0.68rem;
  color: #94a3b8;
}

.md-change-from {
  font-size: 0.85rem;
  color: #94a3b8;
  text-decoration: line-through;
  overflow-wrap: anywhere;
}

.md-change-to {
  font-size: 0.95rem;
  font-weight: 800;
  color: #2563eb;
  overflow-wrap: anywhere;
}

.md-change-arrow {
  width: 1rem;
  height: 1rem;
  margin: 0.25rem 0 0.25rem 0.9rem;
  color: #cbd5e1;
}

.md-actions {
  display: flex;
  gap: 0.5rem;
  width: 100%;
  margin-top: 1.1rem;
}

.md-btn {
  flex: 1;
  height: 3rem;
  border-radius: 0.85rem;
  background: #f1f5f9;
  font-size: 0.92rem;
  font-weight: 700;
  color: #475569;
}

.md-btn.is-primary {
  background: #2563eb;
  color: #fff;
}

.md-btn:active {
  transform: scale(0.98);
}

.md-toast {
  position: fixed;
  left: 50%;
  bottom: calc(5.5rem + env(safe-area-inset-bottom));
  z-index: 10070;
  display: flex;
  align-items: center;
  gap: 0.45rem;
  max-width: calc(100vw - 2rem);
  padding: 0.7rem 1rem;
  border-radius: 999px;
  background: #0f172a;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.25);
  font-size: 0.82rem;
  font-weight: 600;
  color: #fff;
  transform: translateX(-50%);
}

.md-toast svg {
  flex-shrink: 0;
  width: 1.15rem;
  height: 1.15rem;
  color: #22c55e;
}

.md-fade-enter-active,
.md-fade-leave-active {
  transition: opacity 0.2s ease;
}

.md-fade-enter-from,
.md-fade-leave-to {
  opacity: 0;
}

.md-up-enter-active {
  transition: transform 0.25s ease-out;
}

.md-up-enter-from {
  transform: translateY(100%);
}

.md-toast-enter-active,
.md-toast-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.md-toast-enter-from,
.md-toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 0.5rem);
}
</style>
