<!--
  ServerMaintenanceNoticePopup.vue
  서버 시스템 확장 작업 안내 팝업 (전 매장그룹, 로그인 후 홈에서 표시)
-->
<template>
  <Teleport to="body">
    <Transition name="popup-fade">
      <div v-if="visible" class="smnp-overlay" @click.self="close">
        <div
          class="smnp-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="smnp-title">
          <div class="smnp-header">
            <div class="smnp-header-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12 2a10 10 0 1 1 0 20A10 10 0 0 1 12 2zm0 2a8 8 0 1 0 0 16A8 8 0 0 0 12 4zm-.01 4a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0V9a1 1 0 0 1 1-1zm.01 8.25a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5z" />
              </svg>
            </div>
            <div class="smnp-header-text">
              <p id="smnp-title" class="smnp-title">
                8/26(수) 서버 시스템 확장 작업 안내
              </p>
              <p class="smnp-subtitle">서비스 안정화 및 시스템 확장</p>
            </div>
            <button class="smnp-close-btn" @click="close" aria-label="닫기">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div class="smnp-body">
            <p class="smnp-intro">
              서비스 안정화 및 시스템 확장을 위해 8월 26일(수) 새벽에 작업을
              진행합니다.<br />
              매장 포스에서 일반 신용카드·현금 결제는 평소와 같이 사용하실 수
              있으며, 아래 연동·부가 기능만 작업시간 동안 제한됩니다.<br />
              일정과 제한 사항을 안내 드리오니 운영에 참고 부탁드립니다.
            </p>

            <section class="smnp-section">
              <h3 class="smnp-section-title">작업 일시</h3>
              <p class="smnp-section-text">
                2026년 8월 26일(수) 01:00 ~ 05:00
              </p>
              <p class="smnp-note">
                ※ 작업 상황에 따라 시간은 다소 변동될 수 있습니다.
              </p>
            </section>

            <section class="smnp-section">
              <h3 class="smnp-section-title">작업 시간 내 이용 제한</h3>
              <ul class="smnp-list">
                <li>포스 매출 전송 중지 (작업 완료 후 자동으로 순차 전송)</li>
                <li>포스 마스터 환경수신 불가</li>
                <li>
                  피앤시월드 고객 멤버십 관련 서비스 사용 불가 (사용 매장만
                  해당)
                </li>
                <li>
                  피앤시월드 전자상품권 사용 불가 (사용 매장만 해당)
                </li>
                <li>
                  선수금 / 외상 / 사원증 결제 불가 (사용 매장만 해당)
                </li>
                <li>피앤시오피스 및 모바일 앱 접속 불가</li>
                <li>문자 및 알림톡 발송 불가</li>
                <li>홈페이지 고객정보 연동 불가</li>
              </ul>
            </section>

            <p class="smnp-ok">
              위 사항 외 일반 신용카드, 현금 결제 시 포스 사용은 문제없습니다.
            </p>

            <section class="smnp-section smnp-contact">
              <h3 class="smnp-section-title">문의: 서버개발팀</h3>
              <p class="smnp-section-text">
                T. 1588-7443 / T. 02-2023-6821<br />
                E. sungwoo@pncworld.com
              </p>
            </section>

            <p class="smnp-closing">
              이용에 불편을 드려 죄송합니다.<br />
              안정적인 서비스 제공을 위한 작업 이오니 양해 부탁드립니다.<br />
              감사합니다.
            </p>
          </div>

          <div class="smnp-footer">
            <label class="smnp-no-more-label">
              <input
                type="checkbox"
                v-model="noMoreToday"
                class="smnp-no-more-chk" />
              <span>오늘 하루 다시 보지 않기</span>
            </label>
            <button class="smnp-confirm-btn" @click="close">확인</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, onMounted } from "vue";

const emit = defineEmits(["close"]);

const STORAGE_KEY = "smnp_hide_until_20260826";
const visible = ref(false);
const noMoreToday = ref(false);

function shouldShow() {
  const hideUntil = localStorage.getItem(STORAGE_KEY);
  if (!hideUntil) return true;
  return new Date().getTime() > Number(hideUntil);
}

function close() {
  if (noMoreToday.value) {
    const midnight = new Date();
    midnight.setHours(23, 59, 59, 999);
    localStorage.setItem(STORAGE_KEY, String(midnight.getTime()));
  }
  visible.value = false;
  emit("close");
}

onMounted(() => {
  if (shouldShow()) {
    setTimeout(() => {
      visible.value = true;
    }, 400);
  } else {
    emit("close");
  }
});
</script>

<style scoped>
.smnp-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 16px;
}

.smnp-dialog {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  width: 100%;
  max-width: 560px;
  max-height: min(88vh, 820px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.smnp-header {
  background: linear-gradient(135deg, #b45309 0%, #f59e0b 100%);
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 14px;
  flex-shrink: 0;
}

.smnp-header-icon {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.smnp-header-icon svg {
  width: 24px;
  height: 24px;
  color: #ffffff;
}

.smnp-header-text {
  flex: 1;
  min-width: 0;
}

.smnp-title {
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 2px;
  line-height: 1.3;
}

.smnp-subtitle {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.88);
  margin: 0;
}

.smnp-close-btn {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s;
}

.smnp-close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.smnp-close-btn svg {
  width: 16px;
  height: 16px;
  color: #ffffff;
}

.smnp-body {
  padding: 22px 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.smnp-intro {
  font-size: 13px;
  color: #374151;
  margin: 0;
  line-height: 1.7;
}

.smnp-section {
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-left: 4px solid #f59e0b;
  border-radius: 8px;
  padding: 12px 14px;
}

.smnp-section-title {
  font-size: 13px;
  font-weight: 700;
  color: #92400e;
  margin: 0 0 6px;
}

.smnp-section-text {
  font-size: 13px;
  color: #374151;
  margin: 0;
  line-height: 1.6;
}

.smnp-note {
  font-size: 12px;
  color: #6b7280;
  margin: 6px 0 0;
}

.smnp-list {
  margin: 0;
  padding-left: 18px;
  font-size: 13px;
  color: #374151;
  line-height: 1.7;
}

.smnp-list li + li {
  margin-top: 2px;
}

.smnp-ok {
  font-size: 13px;
  font-weight: 600;
  color: #1e40af;
  margin: 0;
  line-height: 1.6;
}

.smnp-contact {
  background: #f9fafb;
  border-color: #e5e7eb;
  border-left-color: #6b7280;
}

.smnp-contact .smnp-section-title {
  color: #374151;
}

.smnp-closing {
  font-size: 13px;
  color: #4b5563;
  margin: 0;
  line-height: 1.7;
}

.smnp-footer {
  padding: 14px 24px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f9fafb;
  flex-shrink: 0;
}

.smnp-no-more-label {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  color: #6b7280;
  cursor: pointer;
  user-select: none;
}

.smnp-no-more-chk {
  width: 14px;
  height: 14px;
  cursor: pointer;
  accent-color: #f59e0b;
}

.smnp-confirm-btn {
  background: #374151;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 8px 22px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.smnp-confirm-btn:hover {
  background: #1f2937;
}

.popup-fade-enter-active,
.popup-fade-leave-active {
  transition: opacity 0.25s ease;
}

.popup-fade-enter-active .smnp-dialog,
.popup-fade-leave-active .smnp-dialog {
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.popup-fade-enter-from,
.popup-fade-leave-to {
  opacity: 0;
}

.popup-fade-enter-from .smnp-dialog {
  transform: scale(0.94) translateY(-10px);
  opacity: 0;
}

.popup-fade-leave-to .smnp-dialog {
  transform: scale(0.94) translateY(-10px);
  opacity: 0;
}
</style>
