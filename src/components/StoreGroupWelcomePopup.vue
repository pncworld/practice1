<!--
  StoreGroupWelcomePopup.vue
  매장그룹 3071 전용 환영/안내 팝업 (로그인 후 홈 화면에서 1회 표시)
-->
<template>
  <Teleport to="body">
    <Transition name="popup-fade">
      <div v-if="visible" class="sgwp-overlay" @click.self="close">
        <div class="sgwp-dialog" role="dialog" aria-modal="true" aria-labelledby="sgwp-title">
          <!-- 헤더 -->
          <div class="sgwp-header">
            <div class="sgwp-header-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2a10 10 0 1 1 0 20A10 10 0 0 1 12 2zm0 2a8 8 0 1 0 0 16A8 8 0 0 0 12 4zm0 3a1 1 0 0 1 1 1v4.586l2.707 2.707a1 1 0 0 1-1.414 1.414l-3-3A1 1 0 0 1 11 13V9a1 1 0 0 1 1-1z" />
              </svg>
            </div>
            <div class="sgwp-header-text">
              <p id="sgwp-title" class="sgwp-title">PNC Office 시스템 안내</p>
              <p class="sgwp-subtitle">매장 운영 매뉴얼 안내</p>
            </div>
            <button class="sgwp-close-btn" @click="close" aria-label="닫기">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <!-- 본문 -->
          <div class="sgwp-body">
            <div class="sgwp-notice-box">
              <p class="sgwp-notice-title">안녕하세요! PNC Office에 오신 것을 환영합니다.</p>
              <p class="sgwp-notice-text">
                본 시스템을 처음 이용하시거나 사용 방법이 궁금하신 분들을 위해
                <strong>매장 운영 매뉴얼</strong>을 제공해 드리고 있습니다.
              </p>
            </div>

            <ul class="sgwp-info-list">
              <li>
                <span class="sgwp-info-icon">📋</span>
                <span>매뉴얼에는 시스템 주요 기능 및 사용 방법이 상세히 설명되어 있습니다.</span>
              </li>
              <li>
                <span class="sgwp-info-icon">🔄</span>
                <span>시스템 업데이트 시 매뉴얼도 함께 갱신됩니다.</span>
              </li>
              <li>
                <span class="sgwp-info-icon">📞</span>
                <span>추가 문의 사항은 고객센터(<strong>1588-7443</strong>)로 연락해 주세요.</span>
              </li>
            </ul>

            <!-- 다운로드 버튼 -->
            <a
              :href="manualPath"
              download
              class="sgwp-download-btn"
              @click="onDownload"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              매장 운영 매뉴얼 다운로드
            </a>
          </div>

          <!-- 푸터 -->
          <div class="sgwp-footer">
            <label class="sgwp-no-more-label">
              <input type="checkbox" v-model="noMoreToday" class="sgwp-no-more-chk" />
              <span>오늘 하루 다시 보지 않기</span>
            </label>
            <button class="sgwp-confirm-btn" @click="close">확인</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, onMounted } from "vue";

const STORAGE_KEY = "sgwp_hide_until";
const MANUAL_PATH = "/manuals/store_3071_manual.pdf";

const visible = ref(false);
const noMoreToday = ref(false);
const manualPath = ref(MANUAL_PATH);

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
}

function onDownload() {
  /* 다운로드 클릭 이벤트 - 필요 시 로그 기록 */
}

onMounted(() => {
  if (shouldShow()) {
    setTimeout(() => {
      visible.value = true;
    }, 600);
  }
});
</script>

<style scoped>
/* 오버레이 */
.sgwp-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 16px;
}

/* 다이얼로그 */
.sgwp-dialog {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  width: 100%;
  max-width: 500px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* 헤더 */
.sgwp-header {
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 14px;
  position: relative;
}

.sgwp-header-icon {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sgwp-header-icon svg {
  width: 24px;
  height: 24px;
  color: #ffffff;
}

.sgwp-header-text {
  flex: 1;
  min-width: 0;
}

.sgwp-title {
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 2px;
  line-height: 1.3;
}

.sgwp-subtitle {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

.sgwp-close-btn {
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

.sgwp-close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.sgwp-close-btn svg {
  width: 16px;
  height: 16px;
  color: #ffffff;
}

/* 본문 */
.sgwp-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.sgwp-notice-box {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-left: 4px solid #3b82f6;
  border-radius: 8px;
  padding: 14px 16px;
}

.sgwp-notice-title {
  font-size: 14px;
  font-weight: 600;
  color: #1e40af;
  margin: 0 0 6px;
}

.sgwp-notice-text {
  font-size: 13px;
  color: #374151;
  margin: 0;
  line-height: 1.6;
}

.sgwp-info-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sgwp-info-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 13px;
  color: #4b5563;
  line-height: 1.5;
}

.sgwp-info-icon {
  flex-shrink: 0;
  font-size: 16px;
  line-height: 1.5;
}

/* 다운로드 버튼 */
.sgwp-download-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  padding: 12px 20px;
  border-radius: 10px;
  text-decoration: none;
  transition: opacity 0.15s, transform 0.1s;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.sgwp-download-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.sgwp-download-btn:active {
  transform: translateY(0);
}

.sgwp-download-btn svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

/* 푸터 */
.sgwp-footer {
  padding: 14px 24px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f9fafb;
}

.sgwp-no-more-label {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  color: #6b7280;
  cursor: pointer;
  user-select: none;
}

.sgwp-no-more-chk {
  width: 14px;
  height: 14px;
  cursor: pointer;
  accent-color: #3b82f6;
}

.sgwp-confirm-btn {
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

.sgwp-confirm-btn:hover {
  background: #1f2937;
}

/* 트랜지션 */
.popup-fade-enter-active,
.popup-fade-leave-active {
  transition: opacity 0.25s ease;
}

.popup-fade-enter-active .sgwp-dialog,
.popup-fade-leave-active .sgwp-dialog {
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.popup-fade-enter-from,
.popup-fade-leave-to {
  opacity: 0;
}

.popup-fade-enter-from .sgwp-dialog {
  transform: scale(0.94) translateY(-10px);
  opacity: 0;
}

.popup-fade-leave-to .sgwp-dialog {
  transform: scale(0.94) translateY(-10px);
  opacity: 0;
}
</style>
