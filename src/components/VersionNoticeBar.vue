<!--
  새 버전 알림 — 운영 빌드에서만 동작
  · 화면이 받은 빌드 버전(VUE_APP_BUILD_VERSION)과 서버 dist/version.json 을 비교
  · 다르면 화면 위쪽에 안내 띠: [새로고침] / [나중에(30분)]
  · 열린 탭·입력 중인 내용이 사라지지 않게 자동 새로고침은 하지 않음 (로그인 화면만 조용히 새로고침)
  · 확인 시점: 창으로 돌아올 때, 메뉴(화면) 이동 시, 화면을 보고 있는 동안 10분마다
-->
<template>
  <!-- 상단 메인 메뉴(헤더) 높이만큼 덮어서 메뉴는 못 누르고, 아래 탭은 그대로 선택 가능 -->
  <div
    v-if="showBar"
    class="vnb-bar"
    :style="{ minHeight: `${barHeight}px` }"
    role="status"
    aria-live="polite">
    <span class="vnb-text">
      <svg class="vnb-warn-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3.5 2.5 20h19L12 3.5Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
        <path d="M12 10v4.5M12 17.2v.3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <span class="vnb-msg">
        <span>새 버전이 배포되었습니다. 작업을 저장한 뒤 [새로고침]을 눌러 주세요.</span>
        <span class="vnb-sub">새로고침하면 저장하지 않은 내용은 사라집니다.</span>
      </span>
    </span>
    <div class="vnb-actions">
      <button type="button" class="pnc-sub-btn vnb-btn-reload" @click="reloadNow">
        <svg class="pnc-sub-btn__icon" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M12.6 6.2A5 5 0 1 0 13 10M13 3v3.4H9.6" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        새로고침
      </button>
      <button type="button" class="pnc-sub-btn pnc-sub-btn--gray vnb-btn-later" @click="snooze">
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
// 띠 높이 = 상단 헤더(.po-header, 메인 메뉴 줄) 아래 끝까지. 헤더가 없으면 기본 56px
const DEFAULT_BAR_HEIGHT = 56;
const barHeight = ref(DEFAULT_BAR_HEIGHT);
const measureHeader = () => {
  const header = document.querySelector(".po-header");
  const bottom = header ? Math.round(header.getBoundingClientRect().bottom) : 0;
  barHeight.value = Math.max(bottom, DEFAULT_BAR_HEIGHT);
};
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
  measureHeader();
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

// 개발 환경 미리보기 : npm run serve 로 띄운 화면 주소 끝에 ?vnbPreview=1 을 붙이면 띠를 바로 보여 줌
//   (운영 빌드에서는 동작하지 않음, 버전 확인도 하지 않음)
const DEV_PREVIEW =
  process.env.NODE_ENV !== "production" &&
  new URLSearchParams(window.location.search).has("vnbPreview");

onMounted(() => {
  if (DEV_PREVIEW) {
    window.addEventListener("resize", onResize);
    // 헤더가 그려진 뒤에 높이를 재도록 조금 늦게 띄움
    window.setTimeout(() => {
      measureHeader();
      showBar.value = true;
    }, 500);
    return;
  }
  if (!ENABLED) return;
  document.addEventListener("visibilitychange", onVisibilityChange);
  window.addEventListener("resize", onResize);
  timer = window.setInterval(() => checkVersion(true), CHECK_INTERVAL_MS);
  checkVersion(true);
});

// 창 크기가 바뀌면 헤더 높이(80/70/60px)가 달라지므로 다시 잼
const onResize = () => {
  if (showBar.value) measureHeader();
};

onBeforeUnmount(() => {
  document.removeEventListener("visibilitychange", onVisibilityChange);
  window.removeEventListener("resize", onResize);
  if (timer) window.clearInterval(timer);
});

// 메뉴(화면) 이동 시 확인
watch(
  () => route.fullPath,
  () => checkVersion()
);
</script>

<style scoped>
/* 화면 위쪽 전체 폭 주황 띠 : 파란 헤더와 구분되게 (2026-11-06) */
.vnb-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10040; /* 업무 팝업(11000)·알림창(13050) 아래 — 팝업 작업을 가리지 않음 */
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  box-sizing: border-box;
  padding: 0.75rem 1.5rem;
  background: #d85a30;
  box-shadow: 0 4px 14px rgb(15 23 42 / 0.25);
  font-size: 1.125rem;
  color: #fff;
  animation: vnb-blink 1.2s ease-in-out infinite alternate;
}

/* 깜빡임 : 띠 바탕을 진한 주황 ↔ 주황으로 */
@keyframes vnb-blink {
  from {
    background: #d85a30;
  }
  to {
    background: #a8391a;
  }
}

.vnb-text {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
}

/* 본문 아래 둘째 줄 : 저장하지 않은 내용 주의 */
.vnb-msg {
  display: inline-flex;
  flex-direction: column;
  min-width: 0;
  line-height: 1.35;
  word-break: keep-all; /* 좁은 창에서 줄이 바뀌어도 단어 중간에서 끊지 않음 */
}

/* 버튼 글자는 줄바꿈하지 않음 (좁은 창에서 "새로 / 고침" 처럼 끊기는 것 방지) */
.vnb-actions .pnc-sub-btn {
  white-space: nowrap;
}

.vnb-sub {
  font-size: 0.875rem;
  font-weight: 600;
  color: #ffe4d6;
}

.vnb-warn-icon {
  width: 1.625rem;
  height: 1.625rem;
  flex-shrink: 0;
  animation: vnb-icon-blink 1.2s steps(2, jump-none) infinite;
}

/* 경고 아이콘 깜빡임 (켜짐 ↔ 흐림) */
@keyframes vnb-icon-blink {
  from {
    opacity: 1;
  }
  to {
    opacity: 0.25;
  }
}

/* 새로고침 : 흰 바탕·주황 글자 (주황 띠 위에서 가장 눈에 띄게) + 빛줄기가 스르륵 지나감 */
.vnb-bar .vnb-btn-reload {
  position: relative;
  overflow: hidden;
  height: 2.5rem;
  padding: 0 1.25rem;
  border-color: #fff;
  background: #fff;
  color: #993c1d;
  font-size: 1rem;
  font-weight: 700;
}

.vnb-bar .vnb-btn-later {
  height: 2.5rem;
  padding: 0 1rem;
  font-size: 1rem;
}

.vnb-bar .vnb-btn-reload::after {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: -60%;
  width: 45%;
  background: linear-gradient(
    100deg,
    rgb(255 255 255 / 0) 0%,
    rgb(216 90 48 / 0.35) 50%,
    rgb(255 255 255 / 0) 100%
  );
  transform: skewX(-20deg);
  animation: vnb-shine 2.2s ease-in-out infinite;
  pointer-events: none;
}

@keyframes vnb-shine {
  0% {
    left: -60%;
  }
  60%,
  100% {
    left: 130%;
  }
}

/* 움직임 줄이기 설정을 켠 사용자는 애니메이션 없음 */
@media (prefers-reduced-motion: reduce) {
  .vnb-bar,
  .vnb-warn-icon,
  .vnb-bar .vnb-btn-reload::after {
    animation: none;
  }
}

.vnb-bar .vnb-btn-reload:hover {
  background: #fdeee8;
}

/* 나중에 : 투명 바탕·흰 테두리 */
.vnb-bar .vnb-btn-later {
  border-color: #f5c4b3;
  background: transparent;
  color: #fff;
}

.vnb-bar .vnb-btn-later:hover {
  background: rgb(255 255 255 / 0.15);
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
