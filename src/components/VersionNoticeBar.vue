<!--
  새 버전 알림 — 운영 빌드에서만 동작
  · 화면이 받은 빌드 버전(VUE_APP_BUILD_VERSION)과 서버 dist/version.json 을 비교
  · 다르면 화면 위쪽에 안내 띠: [새로고침] / [나중에(30분)]
  · 열린 탭·입력 중인 내용이 사라지지 않게 자동 새로고침은 하지 않음 (로그인 화면만 조용히 새로고침)
  · 확인 시점: 창으로 돌아올 때, 메뉴(화면) 이동 시, 화면을 보고 있는 동안 10분마다
-->
<template>
  <div v-if="showBar" class="vnb-bar" role="status" aria-live="polite">
    <span class="vnb-text">
      새 버전이 배포되었습니다. 작업을 저장한 뒤 [새로고침]을 눌러 주세요.
    </span>
    <div class="vnb-actions">
      <button type="button" class="pnc-sub-btn" @click="reloadNow">
        <svg class="pnc-sub-btn__icon" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M12.6 6.2A5 5 0 1 0 13 10M13 3v3.4H9.6" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        새로고침
      </button>
      <button type="button" class="pnc-sub-btn pnc-sub-btn--gray" @click="snooze">
        나중에
      </button>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

const CURRENT_VERSION = String(process.env.VUE_APP_BUILD_VERSION || "");
const ENABLED = process.env.NODE_ENV === "production" && /^\d{14}$/.test(CURRENT_VERSION);

const CHECK_INTERVAL_MS = 10 * 60 * 1000; // 화면을 보고 있는 동안 10분마다
const MIN_GAP_MS = 60 * 1000; // 메뉴 이동·창 복귀가 잦아도 1분에 한 번만 요청
const SNOOZE_MS = 30 * 60 * 1000; // [나중에] → 30분 동안 다시 띄우지 않음
const AUTO_RELOAD_KEY = "pncVersionAutoReloaded"; // 로그인 화면 자동 새로고침 반복 방지

const route = useRoute();
const showBar = ref(false);
const latestVersion = ref("");
let lastCheckAt = 0;
let snoozeUntil = 0;
let timer = null;

const fetchServerVersion = async () => {
  try {
    const res = await fetch(`/version.json?t=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return "";
    const data = await res.json();
    const v = String(data?.version ?? "");
    return /^\d{14}$/.test(v) ? v : "";
  } catch (_) {
    return ""; // 못 읽으면 아무것도 하지 않음 (기존과 동일)
  }
};

const checkVersion = async (force = false) => {
  if (!ENABLED) return;
  if (document.visibilityState !== "visible") return;
  const nowMs = Date.now();
  if (!force && nowMs - lastCheckAt < MIN_GAP_MS) return;
  lastCheckAt = nowMs;

  const serverVersion = await fetchServerVersion();
  // 서버 버전이 더 새로울 때만 (캐시된 예전 값·잘못된 값으로 알림 반복 방지)
  if (!serverVersion || serverVersion <= CURRENT_VERSION) return;
  latestVersion.value = serverVersion;

  // 로그인 화면: 잃을 작업이 없으므로 조용히 새로고침 (같은 버전에 한 번만 — 반복 방지)
  if (route.path === "/") {
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

onMounted(() => {
  if (!ENABLED) return;
  document.addEventListener("visibilitychange", onVisibilityChange);
  timer = window.setInterval(() => checkVersion(true), CHECK_INTERVAL_MS);
  checkVersion(true);
});

onBeforeUnmount(() => {
  document.removeEventListener("visibilitychange", onVisibilityChange);
  if (timer) window.clearInterval(timer);
});

// 메뉴(화면) 이동 시 확인
watch(
  () => route.fullPath,
  () => checkVersion()
);
</script>

<style scoped>
.vnb-bar {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10040; /* 업무 팝업(11000)·알림창(13050) 아래 — 팝업 작업을 가리지 않음 */
  display: flex;
  align-items: center;
  gap: 1rem;
  max-width: calc(100vw - 2rem);
  padding: 0.5rem 0.75rem 0.5rem 1rem;
  border: 1px solid #bfdbfe;
  border-top: 0;
  border-radius: 0 0 0.75rem 0.75rem;
  background: #eff6ff;
  box-shadow: 0 6px 16px rgb(15 23 42 / 0.12);
  font-size: 0.875rem;
  color: #1e3a8a;
}

.vnb-text {
  font-weight: 600;
}

.vnb-actions {
  display: flex;
  flex-shrink: 0;
  gap: 0.5rem;
}

@media (max-width: 767px) {
  .vnb-bar {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
