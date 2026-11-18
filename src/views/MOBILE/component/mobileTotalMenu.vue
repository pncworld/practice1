/*--############################################################################
# Filename : MST01_033INS.vue                                                  
# Description : 마스터관리 > 메뉴 마스터 > 메뉴코드등록                        
# Date :2025-05-14                                                             
# Author : 권맑음                     
################################################################################*/
<template>
  <div class="side">
    <div class="side-logo">
      <!-- 브랜드 로고 (PC 상단 로고와 같은 이미지). 로그인 정보에 로고 주소가 없거나 못 불러오면 기존 PNC 로고 -->
      <div v-if="brandLogoUrl && !brandLogoFailed" class="side-brand">
        <img
          :key="brandLogoUrl"
          :src="brandLogoUrl"
          alt="브랜드 로고"
          @error="onBrandLogoError" />
      </div>
      <img v-else src="../../../assets/pnc_mobile_logo.png" alt="PNC Office" />
    </div>
    <!-- 로그인 사용자: 이니셜 원 + 이름 / 매장명 (한 줄 높이로 작게) -->
    <div class="side-store">
      <span class="side-store-avatar" aria-hidden="true">
        <font-awesome-icon :icon="['fas', 'user']" />
      </span>
      <div class="side-store-text">
        <div class="side-store-name">{{ StoreName }}</div>
        <div v-if="loginStoreName && loginStoreName !== StoreName" class="side-store-sub">
          {{ loginStoreName }}
        </div>
      </div>
    </div>
    <button type="button" class="side-link" @click="showHome">
      <font-awesome-icon icon="house" />
      <span>홈</span>
    </button>
    <button type="button" class="side-link" @click="showNotice">
      <font-awesome-icon :icon="['far', 'bell']" />
      <span>공지사항</span>
    </button>

    <div class="side-scroll">
      <div v-for="(i, index) in menuItems" :key="index" class="side-group">
        <button type="button" class="side-link" @click="toggleSubMenu(index)">
          <font-awesome-icon
            :icon="['far', 'calendar-days']"
            v-if="i.mainCode == 20" />
          <font-awesome-icon
            :icon="['fas', 'cart-shopping']"
            v-if="i.mainCode == 30" />
          <img
            v-if="i.mainCode == 50"
            src="../../../assets/tablet-screen-button-solid.svg"
            alt=""
            class="side-img" />
          <span>{{ i.title }}</span>
          <font-awesome-icon
            class="side-chevron"
            :icon="['fas', i.isOpen ? 'chevron-up' : 'chevron-down']" />
        </button>
        <div v-if="i.isOpen" class="side-sub">
          <button
            v-for="(subItem, subIndex) in i.children"
            :key="subIndex"
            type="button"
            class="side-sub-btn"
            @click="moveProgram(subItem.code, subItem.name)">
            {{ subItem.name }}
            <span v-if="isNewProgram(subItem.code)" class="m-new-badge" aria-label="신규">N</span>
          </button>
        </div>
      </div>
    </div>

    <div class="side-foot">
      <div class="side-foot-btn">
        <font-awesome-icon :icon="['fas', 'gear']" />
        설정
      </div>
      <button type="button" class="side-foot-btn side-foot-out" @click="logout">
        <font-awesome-icon :icon="['fas', 'arrow-right-from-bracket']" />
        로그아웃
      </button>
    </div>
  </div>
</template>

<script setup>
import { insertMobilePageLog } from "@/customFunc/customFunc";
import router from "@/router";
/*
 * 공통 표준  Function
 */

import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { PNC_IMAGE_DEV_MIRROR_ORIGIN } from "@/constants/pncHosts";
import {
  isProductionBuild,
  normalizePncImagePath,
  resolveSessionLogoUrl,
} from "@/utils/resolveSessionLogoUrl";
import { isNewProgram, loadNewPrograms } from "./mobileNewProgram";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";
const menuItems = ref([
  //   {
  //     title: "공지사항",
  //     isOpen: false,
  //     children: [
  //       { code: 10001, name: "공지사항 목록" },
  //       { code: 10002, name: "공지사항 조회" },
  //     ],
  //   },
  {
    title: "매출조회",
    mainCode: 20,
    isOpen: false,
    children: [
      { code: 20001, name: "정산내역" },
      { code: 20002, name: "매출세부내역" },
      { code: 20003, name: "메뉴그룹별 내역" },
      { code: 20004, name: "메뉴별 매출내역" },
      { code: 20005, name: "신용카드별 매출내역" },
      { code: 20006, name: "시간대별 매출내역" },
      { code: 20007, name: "매장별 매출현황" },
      { code: 20008, name: "실시간 매출현황" },
      { code: 20009, name: "일자별 매출내역2" },
      { code: 20010, name: "매출취소현황" },
      { code: 20011, name: "개점/마감정보" },
      { code: 20012, name: "부가세신고참고자료" },
      { code: 20013, name: "좌석정보현황" },
      { code: 20014, name: "코너별 매출현황" },
      { code: 20015, name: "코너별 메뉴 매출현황" },
    ],
  },
  {
    title: "발주관리",
    mainCode: 30,
    isOpen: false,
    children: [
      { code: 30001, name: "주문조회" },
      { code: 30002, name: "주문등록" },
      { code: 30003, name: "매입입고조회" },
      { code: 30004, name: "매입확정" },
      { code: 30005, name: "반품조회" },
      { code: 30006, name: "반품등록" },
      { code: 30011, name: "청구 등록" },
      { code: 30500, name: "주문수정" },
      { code: 30501, name: "반품삭제" },
    ],
  },
  {
    title: "TablePos",
    mainCode: 50,
    isOpen: false,
    children: [{ code: 50001, name: "카테고리관리" }],
  },
]);

const menuItems2 = ref([
  //   {
  //     title: "공지사항",
  //     isOpen: false,
  //     children: [
  //       { code: 10001, name: "공지사항 목록" },
  //       { code: 10002, name: "공지사항 조회" },
  //     ],
  //   },
  {
    title: "매출조회",
    mainCode: 20,
    isOpen: false,
    children: [
      { code: 20001, name: "정산내역" },
      { code: 20002, name: "매출세부내역" },
      { code: 20003, name: "메뉴그룹별 내역" },
      { code: 20004, name: "메뉴별 매출내역" },
      { code: 20005, name: "신용카드별 매출내역" },
      { code: 20006, name: "시간대별 매출내역" },
      { code: 20007, name: "매장별 매출현황" },
      { code: 20008, name: "실시간 매출현황" },
      { code: 20009, name: "일자별 매출내역2" },
      { code: 20010, name: "매출취소현황" },
      { code: 20011, name: "개점/마감정보" },
      { code: 20012, name: "부가세신고참고자료" },
      { code: 20013, name: "좌석정보현황" },
      { code: 20014, name: "코너별 매출현황" },
      { code: 20015, name: "코너별 메뉴 매출현황" },
    ],
  },
  {
    title: "발주관리",
    mainCode: 30,
    isOpen: false,
    children: [
      { code: 30001, name: "주문조회" },
      { code: 30002, name: "주문등록" },
      { code: 30003, name: "매입입고조회" },
      { code: 30004, name: "매입확정" },
      { code: 30005, name: "반품조회" },
      { code: 30006, name: "반품등록" },
      { code: 30011, name: "청구 등록" },
      { code: 30500, name: "주문수정" },
      { code: 30501, name: "반품삭제" },
    ],
  },
  {
    title: "TablePos",
    mainCode: 50,
    isOpen: false,
    children: [{ code: 50001, name: "카테고리관리" }],
  },
]);
const store = useStore();

/*
 * 브랜드 로고 — 모바일 로그인 정보의 LOGO_URL (PC 의 strNLogoUrl 과 같은 값)
 * 주소 변환은 PC 와 같은 resolveSessionLogoUrl 사용 (이미지 서버 주소 → /image/... 상대경로)
 */
const brandLogoFailed = ref(false);
const brandLogoUrl = computed(() => {
  const raw = String(store.state.userData?.LOGO_URL ?? "").trim();
  if (!raw) return "";
  return resolveSessionLogoUrl({ strNLogoUrl: raw }, "");
});
watch(brandLogoUrl, () => {
  brandLogoFailed.value = false;
});
/* 개발 서버는 /image 프록시 실패 시 미러 주소로 1번 더 시도, 그래도 안 되면 기존 PNC 로고 */
const onBrandLogoError = (e) => {
  const img = e?.target;
  if (img && !isProductionBuild() && !img.dataset.mirrorTried) {
    try {
      const path = new URL(img.src, window.location.href).pathname;
      if (/^\/image\//i.test(path)) {
        img.dataset.mirrorTried = "1";
        img.src = `${PNC_IMAGE_DEV_MIRROR_ORIGIN}${normalizePncImagePath(path)}`;
        return;
      }
    } catch (_) {
      /* ignore */
    }
  }
  brandLogoFailed.value = true;
};
const StoreName = ref("");
/* 서랍 위 사용자 표시: 로그인 매장명 */
const loginStoreName = computed(() => String(store.state.userData?.STORE_NM || "").trim());
const toggleHeight = ref(false);
const toggleSubMenu = (e) => {
  menuItems.value[e].isOpen = !menuItems.value[e].isOpen;
  toggleHeight.value = !toggleHeight.value;
};

const groupMenu = ref([]);

const emit = defineEmits(["MenuState", "SalesMenus", "OrderMenus", "showNotice"]);
watch(
  () => store.state.mobileCategory,
  () => {
    //comsole.log(store.state.mobileSelectProgName);
    menuItems.value = menuItems2.value.filter(
      (item) =>
        store.state.mobileFunction.some(
          (func) => func.CATEGORY_ID == item.mainCode.toString()
        ) // mobileFunction 배열 내에 CATEGORY_ID item.mainCode와 일치하는 항목이 있는지 확인
    );
    //comsole.log(menuItems.value);
    menuItems.value = menuItems.value.map((item) => ({
      ...item,
      children: store.state.mobileCategory
        .filter((item2) => item.mainCode == Number(item2.CATEGORY_ID)) // mainCode와 CATEGORY_ID가 같은 것만 남김
        .map((item2) => ({
          code: item2.PROGID,
          name: item2.PROGNM,
        })),
    }));

    //comsole.log(menuItems.value);
    const salesItem = menuItems.value.find((item) => item.mainCode == 20);
    const orderItem = menuItems.value.find((item) => item.mainCode == 30);
    if (salesItem) {
      emit("SalesMenus", salesItem.children);
    } else if (menuItems.value[0]) {
      emit("SalesMenus", menuItems.value[0].children);
    }
    if (orderItem) {
      emit("OrderMenus", orderItem.children);
    }
  },
  { immediate: true } // 새로고침할때 반응해주게 하는 설정
);

/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(() => {
  StoreName.value = store.state.userData.USER_NM;
  loadNewPrograms();
});

const route = useRoute();
watch(route, () => {
  if (route.path != "/") {
    StoreName.value = store.state.userData.USER_NM;
  }
});

const moveProgram = async (e1, e2) => {
  //comsole.log(store.state.userData);
  const checkSession = await insertMobilePageLog({
    strUrl: e2,
    lngProgramID: e1,
  });

  //comsole.log(e1, e2);
  //store.state.mobileSelectProgName = e2;
  store.dispatch("saveMobileProgName", e2);
  router.push(`/m/${e1}`);

  emit("MenuState", false);
  store.state.inActiveBackGround = false;
};

const showHome = () => {
  router.push(`/m/homepage`);
  store.state.mobileSelectProgName = "";
  emit("MenuState", false);
  store.state.inActiveBackGround = false;
};
const showNotice = () => {
  store.state.mobileSelectProgName = "공지사항";
  emit("MenuState", false);
  store.state.inActiveBackGround = false;
  emit("showNotice", true);
};

const logout = () => {
  store.commit("clearSession");
  //localStorage.clear();
  // sessionStorage.clear();
  window.location.href = "/";
};
</script>

<style scoped>
.side {
  position: fixed;
  top: 0;
  z-index: 60;
  display: flex;
  flex-direction: column;
  width: 17rem;
  height: 100%;
  overflow: hidden;
  background: var(--m-surface, #fff);
  box-shadow: 8px 0 24px rgba(15, 23, 42, 0.12);
}

.side-logo {
  display: flex;
  justify-content: center;
  padding: 1.25rem 1rem 0.75rem;
}

.side-logo img {
  max-width: 9rem;
}

/* 브랜드 로고는 PC 처럼 흰 바탕 카드 안에 (어두운 화면에서도 로고 색이 그대로 보이게) */
.side-brand {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 4rem;
  padding: 0.5rem 1rem;
  background: #fff;
  border: 1px solid var(--m-border, #e2e8f0);
  border-radius: 1rem;
}

.side-brand img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.side-store {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin: 0 1rem 0.5rem;
  padding: 0.25rem 0.1rem 0.5rem;
}

.side-store-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 2.1rem;
  height: 2.1rem;
  border-radius: 999px;
  background: var(--m-accent-weak, #eff4ff);
  color: var(--m-accent-strong, #2563eb);
  font-size: 0.85rem;
}

.side-store-text {
  min-width: 0;
  flex: 1;
}

.side-store-name {
  overflow: hidden;
  color: var(--m-text, #0f172a);
  font-size: calc(0.9375rem * var(--m-fs, 1));
  font-weight: 700;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.side-store-sub {
  overflow: hidden;
  margin-top: 0.05rem;
  color: var(--m-text-4, #94a3b8);
  font-size: calc(0.75rem * var(--m-fs, 1));
  white-space: nowrap;
  text-overflow: ellipsis;
}

/*
 * 그룹 목록(스크롤 영역)
 * - 위쪽 고정 영역(홈·공지사항)과는 항상 보이는 구분선으로 나눈다
 * - 스크롤바는 얇게, 끝까지 내려도 뒤 화면이 따라 움직이지 않게
 */
.side-scroll {
  position: relative;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding-bottom: calc(4.5rem + env(safe-area-inset-bottom));
  border-top: 1px solid var(--m-border, #e2e8f0);
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}

.side-scroll::-webkit-scrollbar {
  width: 4px;
}

.side-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.side-scroll::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: var(--m-surface-3, #cbd5e1);
}

/*
 * 목록을 내렸을 때만 고정 영역 아래에 옅은 그림자를 보여 준다 (내용이 그 밑으로 들어간다는 표시)
 * 스크롤 위치에 따라 바뀌는 효과라 지원하는 브라우저에서만 켠다. 지원하지 않으면 위 구분선만 보인다
 */
@supports (animation-timeline: scroll()) {
  .side-scroll::before {
    content: "";
    position: sticky;
    top: 0;
    z-index: 3;
    display: block;
    height: 0.625rem;
    margin-bottom: -0.625rem;
    background: linear-gradient(rgba(15, 23, 42, 0.1), rgba(15, 23, 42, 0));
    opacity: 0;
    pointer-events: none;
    animation: side-scroll-shadow linear both;
    animation-timeline: scroll(nearest block);
    animation-range: 0 1.5rem;
  }
}

@keyframes side-scroll-shadow {
  to {
    opacity: 1;
  }
}

.side-group {
  border-top: 1px solid var(--m-border, #f1f5f9);
}

.side-group:first-child {
  border-top: none;
}

/*
 * 그룹 머리글(매출조회·발주관리 …): 그 그룹의 하위 메뉴를 보는 동안 목록 맨 위에 붙어 있다
 * → 하위 메뉴가 위쪽 「공지사항」에 딸린 것처럼 보이지 않는다
 */
.side-group > .side-link {
  position: sticky;
  top: 0;
  z-index: 2;
  background: var(--m-surface, #fff);
}

/* 펼친 그룹: 머리글 아래에 선을 그어 하위 메뉴와 구분한다 */
.side-group:has(> .side-sub) > .side-link {
  box-shadow: 0 1px 0 #e2e8f0;
}

.side-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  min-height: 3rem;
  padding: 0.95rem 1.1rem;
  color: var(--m-text, #1e293b);
  font-size: calc(1rem * var(--m-fs, 1));
  font-weight: 600;
  text-align: left;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

.side-link:active {
  background: var(--m-surface-2, #f1f5f9);
}

.side-group > .side-link:active {
  background: var(--m-surface-2, #f1f5f9);
}

.side-link svg,
.side-img {
  width: 1.15rem;
  color: var(--m-accent, #3b82f6);
}

.side-chevron {
  margin-left: auto;
  width: 0.7rem !important;
  color: var(--m-text-4, #94a3b8) !important;
}

/* 하위 메뉴: 왼쪽 세로선으로 어느 그룹에 속하는지 보여 준다 */
.side-sub {
  margin: 0.35rem 0.75rem 0.6rem 1.65rem;
  padding-left: 0.5rem;
  border-left: 2px solid var(--m-border, #e2e8f0);
}

.side-sub-btn {
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 2.75rem;
  padding: 0.4rem 0.7rem;
  border-radius: 0.7rem;
  color: var(--m-text-2, #475569);
  font-size: calc(0.9375rem * var(--m-fs, 1));
  text-align: left;
  word-break: keep-all;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

.side-sub-btn:active {
  background: var(--m-accent-weak, #eff6ff);
  color: var(--m-accent, #2563eb);
}

.side-foot {
  position: absolute;
  bottom: 0;
  z-index: 4;
  display: flex;
  width: 100%;
  padding-bottom: env(safe-area-inset-bottom);
  border-top: 1px solid var(--m-border, #e2e8f0);
  background: var(--m-surface, #fff);
}

.side-foot-btn {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  height: 3.25rem;
  color: var(--m-text-3, #64748b);
  font-size: calc(0.85rem * var(--m-fs, 1));
  font-weight: 600;
  -webkit-tap-highlight-color: transparent;
}

button.side-foot-btn:active {
  background: var(--m-surface-2, #f1f5f9);
}

.side-foot-out {
  color: var(--m-danger, #ef4444);
}
</style>
