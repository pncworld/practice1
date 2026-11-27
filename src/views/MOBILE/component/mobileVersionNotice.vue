<!--
  모바일 새 버전 안내 — 운영 빌드에서만 동작 (PC 의 src/components/VersionNoticeBar.vue 와 같은 version.json 사용)
  · 화면이 받은 빌드 버전(VUE_APP_BUILD_VERSION)과 서버 /version.json 을 비교
  · 로그인(/m)·홈(/m/homepage) 화면: 잃을 입력이 없으므로 바로 자동 새로고침 (같은 버전에 한 번만)
  · 그 밖의 화면: 상단 바 아래에 안내 띠 [새로고침] / [닫기(30분)] — 입력 중인 내용이 사라지지 않게 자동으로 하지 않음
  · 확인 시점: 앱(탭)으로 돌아올 때, 화면 이동 시, 화면을 보고 있는 동안 10분마다
  · 개발 서버 미리보기: 주소 끝에 ?mvnPreview=1 → 띠만 표시 (버전 확인·새로고침 안 함)
-->
<template>
  <Transition name="mvn">
    <div v-if="showBar" class="mvn-bar" role="status" aria-live="polite">
      <svg class="mvn-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M20 11a8 8 0 1 0-2.3 5.7M20 5v6h-6"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round" />
      </svg>
      <span class="mvn-text">새 버전이 있습니다</span>
      <button type="button" class="mvn-btn mvn-btn-main" @click="reloadNow">
        새로고침
      </button>
      <button
        type="button"
        class="mvn-btn mvn-btn-close"
        aria-label="닫기"
        @click="snooze">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M6 6l12 12M18 6 6 18"
            fill="none"
            stroke="currentColor"
            stroke-width="2.2"
            stroke-linecap="round" />
        </svg>
      </button>
    </div>
  </Transition>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

const CURRENT_VERSION = String(process.env.VUE_APP_BUILD_VERSION || "");
const ENABLED =
  process.env.NODE_ENV === "production" && /^\d{14}$/.test(CURRENT_VERSION);

const CHECK_INTERVAL_MS = 10 * 60 * 1000; // 화면을 보고 있는 동안 10분마다
const MIN_GAP_MS = 60 * 1000; // 화면 이동·앱 복귀가 잦아도 1분에 한 번만 요청
const SNOOZE_MS = 30 * 60 * 1000; // [닫기] → 30분 동안 다시 띄우지 않음
const AUTO_RELOAD_KEY = "pncMobileVersionAutoReloaded"; // 자동 새로고침 반복 방지

/** 자동 새로고침해도 되는 화면 (입력 중인 내용이 없는 곳) */
const isAutoReloadPath = (path) => {
  const p = String(path || "").replace(/\/+$/, "").toLowerCase();
  return p === "/m" || p === "/m/homepage";
};

const route = useRoute();
const showBar = ref(false);
let lastCheckAt = 0;
let snoozeUntil = 0;
let timer = null;

const fetchServerVersion = async () => {
  try {
    const res = await fetch(`/version.json?t=${Date.now()}`, {
      cache: "no-store",
    });
    if (!res.ok) return "";
    const data = await res.json();
    const v = String(data?.version ?? "");
    return /^\d{14}$/.test(v) ? v : "";
  } catch (_) {
    return ""; // 못 읽으면 아무것도 하지 않음
  }
};

const checkVersion = async (force = false) => {
  if (!ENABLED) return;
  if (document.visibilityState !== "visible") return;
  const nowMs = Date.now();
  if (!force && nowMs - lastCheckAt < MIN_GAP_MS) return;
  lastCheckAt = nowMs;

  const serverVersion = await fetchServerVersion();
  // 서버 버전이 더 새로울 때만 (캐시된 예전 값으로 알림이 반복되지 않게)
  if (!serverVersion || serverVersion <= CURRENT_VERSION) return;

  if (isAutoReloadPath(route.path)) {
    let already = "";
    try {
      already = sessionStorage.getItem(AUTO_RELOAD_KEY) || "";
    } catch (_) {
      already = "";
    }
    if (already !== serverVersion) {
      try {
        sessionStorage.setItem(AUTO_RELOAD_KEY, serverVersion);
      } catch (_) {
        /* ignore */
      }
      window.location.reload();
      return;
    }
  }

  if (nowMs < snoozeUntil) return;
  showBar.value = true;
};

const reloadNow = () => {
  window.location.reload();
};

const snooze = () => {
  snoozeUntil = Date.now() + SNOOZE_MS;
  showBar.value = false;
};

const onVisibilityChange = () => {
  if (document.visibilityState === "visible") checkVersion();
};
/* 뒤로 가기 캐시(bfcache)에서 화면이 되살아난 경우도 확인 */
const onPageShow = (e) => {
  if (e.persisted) checkVersion(true);
};

const DEV_PREVIEW =
  process.env.NODE_ENV !== "production" &&
  new URLSearchParams(window.location.search).has("mvnPreview");

onMounted(() => {
  if (DEV_PREVIEW) {
    window.setTimeout(() => {
      showBar.value = true;
    }, 300);
    return;
  }
  if (!ENABLED) return;
  document.addEventListener("visibilitychange", onVisibilityChange);
  window.addEventListener("pageshow", onPageShow);
  timer = window.setInterval(() => checkVersion(true), CHECK_INTERVAL_MS);
  checkVersion(true);
});

onBeforeUnmount(() => {
  document.removeEventListener("visibilitychange", onVisibilityChange);
  window.removeEventListener("pageshow", onPageShow);
  if (timer) window.clearInterval(timer);
});

// 화면 이동 시 확인
watch(
  () => route.fullPath,
  () => checkVersion()
);
</script>

<style scoped>
/* 상단 바(3.25rem) 바로 아래에 떠 있는 띠 — 화면 내용은 밀지 않는다 */
.mvn-bar {
  position: fixed;
  top: calc(3.25rem + 0.5rem);
  left: 50%;
  /* 화면 전체를 덮는 창(PnC# AI 도우미 z-index 9000) 위에도 보이게 (2026-11-27). 위치는 그 창 제목줄 바로 아래와도 맞음 */
  z-index: 9100;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: min(calc(100% - 1.5rem), 26rem);
  min-height: 2.75rem;
  padding: 0.375rem 0.375rem 0.375rem 0.75rem;
  transform: translateX(-50%);
  color: var(--m-text, #0f172a);
  background: var(--m-surface, #fff);
  border: 1px solid var(--m-accent-border, #bfdbfe);
  border-radius: 0.875rem;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.16);
}

.mvn-icon {
  flex-shrink: 0;
  width: 1.125rem;
  height: 1.125rem;
  color: var(--m-accent, #2563eb);
}

.mvn-text {
  flex: 1 1 auto;
  min-width: 0;
  font-size: calc(0.875rem * var(--m-fs, 1));
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mvn-btn {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  height: 2rem;
  border-radius: 0.625rem;
  font-size: calc(0.8125rem * var(--m-fs, 1));
  font-weight: 700;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.mvn-btn-main {
  padding: 0 0.75rem;
  color: #fff;
  background: var(--m-accent, #2563eb);
}

.mvn-btn-close {
  width: 2rem;
  color: var(--m-text-3, #64748b);
}

.mvn-btn-close svg {
  width: 1rem;
  height: 1rem;
}

.mvn-btn:active {
  transform: scale(0.96);
}

.mvn-enter-active,
.mvn-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.mvn-enter-from,
.mvn-leave-to {
  opacity: 0;
  transform: translate(-50%, -0.5rem);
}

@media (prefers-reduced-motion: reduce) {
  .mvn-enter-active,
  .mvn-leave-active {
    transition: none;
  }
  .mvn-btn:active {
    transform: none;
  }
}
</style>
