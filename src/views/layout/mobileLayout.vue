/*--############################################################################
# Filename : MST01_033INS.vue                                                  
# Description : 마스터관리 > 메뉴 마스터 > 메뉴코드등록                        
# Date :2025-05-14                                                             
# Author : 권맑음                     
################################################################################*/
<template>
  <div
    class="m-vh overflow-y-auto"
    @click="resetScreen"
    ref="scrollContainer3">
    <loading></loading>
    <Loading2></Loading2>
    <Inactive></Inactive>
    <MobileVersionNotice />
    <main
      class="m-vh overflow-y-auto bg-slate-50"
      ref="scrollContainer"
      v-show="!(notice || personal || order)">
      <router-view v-slot="{ Component, route }" class="mt-1">
        <component
          :is="Component"
          class="overflow-y-auto"
          id="content"></component>
      </router-view>
    </main>
    <div class="m-panel" v-show="notice">
      <div
        v-show="!showDetailNotice"
        @scroll="handleScroll2"
        ref="scrollArea"
        class="overflow-y-auto">
        <div class="m-empty" v-if="blnNoticeList">공지사항이 없습니다.</div>

        <div class="m-list" v-if="!blnNoticeList">
          <div
            v-for="I in notices"
            :key="I.NOTICE_ID"
            role="button"
            @click="showNoticeDetail(I.NOTICE_ID)"
            :class="I.READ_YN == 1 ? 'is-read' : ''"
            class="m-notice">
            <div class="m-notice-main">
              <div class="m-notice-title">
                <span v-if="I.IMPORTANT_YN == '1'" class="m-badge">중요</span>
                <span class="m-notice-text">{{ I.TITLE_NM }}</span>
              </div>
              <div class="m-notice-meta">{{ I.WRITER_NM }}</div>
              <div class="m-notice-sub">
                {{ I.WRITE_DT }} · 조회 {{ I.READ_CNT }}
              </div>
            </div>
            <font-awesome-icon
              :icon="['fas', 'chevron-right']"
              class="m-chevron" />
          </div>
        </div>
      </div>
    </div>

    <div v-if="personal" class="m-panel">
      <div class="m-empty" v-if="!(salesMenus && salesMenus.length)">
        조회할 수 있는 매출조회 메뉴가 없습니다.
      </div>
      <div class="m-list">
        <button
          v-for="(i, index) in salesMenus"
          :key="i.code || index"
          type="button"
          class="m-menu"
          @click="movePage(i.code, i.name)">
          <span>
            {{ i.name }}
            <span v-if="isNewProgram(i.code)" class="m-new-badge" aria-label="신규">N</span>
          </span>
          <font-awesome-icon :icon="['fas', 'chevron-right']" />
        </button>
      </div>
    </div>
    <div v-if="order" class="m-panel">
      <div class="m-empty" v-if="!(orderMenus && orderMenus.length)">
        사용할 수 있는 발주관리 메뉴가 없습니다.
      </div>
      <div class="m-list">
        <button
          v-for="(i, index) in orderMenus"
          :key="i.code || index"
          type="button"
          class="m-menu"
          @click="movePage(i.code, i.name)">
          <span>{{ i.name }}</span>
          <font-awesome-icon :icon="['fas', 'chevron-right']" />
        </button>
      </div>
    </div>
    <div v-if="showDetailNotice" class="m-detail">
      <h1>{{ DetailNotice.TITLE_NM }}</h1>
      <div class="m-detail-meta">
        <div>작성자 {{ DetailNotice.WRITER_NM }}</div>
        <div class="m-detail-row">
          <span>{{ DetailNotice.WRITE_DT }} · 조회 {{ DetailNotice.READ_CNT }}</span>
          <button
            type="button"
            class="m-attach"
            :class="{ 'is-none': downloadFileLeng == 0 }"
            @click="downloadFile">
            <font-awesome-icon :icon="['fas', 'paperclip']" />
            첨부 {{ downloadFileLeng }}
          </button>
        </div>
      </div>
      <div class="m-detail-body">
        <div v-html="DetailNotice.NOTICE_CT"></div>
      </div>
    </div>
  </div>
  <MobileTotalMenu
    v-show="showTotalMenu"
    @MenuState="MenuState"
    @showNotice="showNotice2"
    @SalesMenus="SalesMenus"
    @OrderMenus="OrderMenus"></MobileTotalMenu>
  <MobileMenu
    ref="stickyElement"
    id="stickyElement"
    v-if="showMobileMenu"
    @showNotice="showNotice"
    @showpersonal="showpersonal"
    @showorder="showorder"
    @showMenu3="showMenu3"
    @changeIconValue="changeIconValue"
    @searchword="searchword"
    @searchNow="searchNow"
    @reSearch="reSearch"
    @click.stop
    :changeIcon="changeIcon"
    :changeSalesIconState="changeSalesIconState"
    :changeMenuState="changeMenuState"
    :changeBottomMenu="changeBottomMenu"
    :class="{ hidden: !isStickyVisible }"></MobileMenu>
</template>

<script setup>
import Inactive from "@/components/inactive.vue";
import Loading from "@/components/loading.vue";
import Loading2 from "@/components/loading2.vue";
import MobileMenu from "@/components/MenuComponent/mobileMenu.vue";
import router from "@/router";
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";
import MobileTotalMenu from "../MOBILE/component/mobileTotalMenu.vue";
import MobileVersionNotice from "../MOBILE/component/mobileVersionNotice.vue";
import { isNewProgram } from "../MOBILE/component/mobileNewProgram";
/* 모바일 색 테마 (밝게/어둡게) — 웹 화면에는 영향 없음 */
import "../MOBILE/mobileTheme.css";
import { disposeMobileTheme, initMobileTheme } from "../MOBILE/mobileTheme";
import { getNoticeDetail, getNoticeList } from "@/api/mobile";
import { insertMobilePageLog } from "@/customFunc/customFunc";
const store = useStore();

const notice = ref(false);
const isMenu2 = ref(false);
const personal = ref(false);
const order = ref(false);
const showMobileMenu = ref(true);
const clickthismenu = ref([]);
const route = useRoute();
const blnNoticeList = ref(true);
const salesMenus = ref([]);
const orderMenus = ref([]);
const SalesMenus = (e) => {
  //comsole.log(e);
  salesMenus.value = e;
};
const OrderMenus = (e) => {
  orderMenus.value = e;
};

const changeMenuState = ref(false);
const MenuState = (e) => {
  showTotalMenu.value = e;
  notice.value = e;
  personal.value = e;
  order.value = e;
};
const showNotice = async (value) => {
  notice.value = value;
  showDetailNotice.value = false;

  pageIndex.value = 0;
  const res = await getNoticeList(
    store.state.userData.GROUP_CD,
    store.state.userData.STORE_CD,
    store.state.userData.USER_NO,
    pageIndex.value,
    pageIndex2.value,
    0,
    ""
  );

  //comsole.log(res);
  if (res.data.List.length == 0) {
    blnNoticeList.value = true;
  } else {
    blnNoticeList.value = false;
  }
  notices.value = res.data.List;
};

const showNotice2 = (e) => {
  notice.value = e;
  showDetailNotice.value = false;
};
const showpersonal = (value) => {
  personal.value = value;
};
const showorder = (value) => {
  order.value = value;
};

const showTotalMenu = ref(false);
const showMenu3 = (e) => {
  //comsole.log(e);
  if (e == true) {
    showTotalMenu.value = true;
    store.state.inActiveBackGround = true;
  } else {
    showTotalMenu.value = false;
    store.state.inActiveBackGround = false;
  }
};

const resetScreen = (e) => {
  showTotalMenu.value = false;
  store.state.inActiveBackGround = false;
};

// const goRouter = (value) => {
//   switch (value) {
//     case 2:
//       router.push("/m/MISALES/SLS06_003RPT.xml");
//       break;

//     case 3:
//       router.push("/m/MISALES/SLS06_004RPT.xml");
//       break;

//     case 4:
//       router.push("/m/MISALES/SLS06_005RPT.xml");
//       break;

//     default:
//       break;
//   }

//   personal.value = false;
//   isMenu.value = false;
// };

watch(notice, async () => {
  //comsole.log(store.state.userData);
  if (notice.value == true) {
    const res = await getNoticeList(
      store.state.userData.GROUP_CD,
      store.state.userData.STORE_CD,
      store.state.userData.USER_NO,
      pageIndex.value,
      pageIndex2.value,
      0,
      ""
    );

    //comsole.log(res);
    if (res.data.List.length == 0) {
      blnNoticeList.value = true;
    } else {
      blnNoticeList.value = false;
    }
    notices.value = res.data.List;
  }
});

const changeIconValue = (e) => {
  changeIcon.value = e;
};
// const showsubMenu = (value) => {
//   const index = clickthismenu.value.indexOf(value);
//   if (index == -1) {
//     clickthismenu.value.push(value);
//   } else {
//     clickthismenu.value.splice(index, 1);
//   }
// };
// const showornotsubMenu = (value) => {
//   return clickthismenu.value.includes(value);
// };
const pageIndex = ref(0);
const pageIndex2 = ref(15);
const DetailNotice = ref([]);
const showDetailNotice = ref(false);
const downloadFileUrl = ref("");
const downloadFileName = ref("");
const downloadFileLeng = ref(0);
const showNoticeDetail = async (e) => {
  showDetailNotice.value = true;
  changeIcon.value = 4;

  const res = await getNoticeDetail(
    store.state.userData.GROUP_CD,
    store.state.userData.STORE_CD,
    store.state.userData.USER_NO,
    e
  );
  DetailNotice.value = res.data.List[0];
  if (res.data.List2.length > 0) {
    downloadFileLeng.value = res.data.List2.length;
    downloadFileUrl.value = res.data.List2[0].FILE_URL;
    downloadFileName.value = res.data.List2[0].FILE_NM;
  } else {
    downloadFileLeng.value = 0;
    downloadFileUrl.value = "";
    downloadFileName.value = "";
  }

  //comsole.log(res);
  scrollContainer3.value.scrollTop = 0;
};

const downloadFile = async () => {
  if (downloadFileLeng.value > 0) {
    const response = await fetch(downloadFileUrl.value, {
      method: "GET",
      // headers: { Authorization: 'Bearer xxx' } // 필요하면 추가
    });
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = downloadFileName.value;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  }
};
const categories = ref([]);
const selectedCategoryId = computed(() => store.state.selectedCategoryId);

const mainCategoryList = computed(() => store.state.mainCategory);
const subCategoryList = computed(() => store.state.subCategory);
const minorCategoryList = computed(() => store.state.minorCategory);

const hierarchicalCategories = computed(() => {
  return mainCategoryList.value.map((main) => {
    const subCategories = subCategoryList.value
      .filter((sub) => sub.lngCode === main.lngCode)
      .map((sub) => {
        const minorCategories = minorCategoryList.value.filter(
          (minor) =>
            minor.lngCode === sub.lngCode &&
            minor.lngProgramSub == sub.lngProgramSub
        );
        return { ...sub, minorCategories };
      });

    return { ...main, subCategories };
  });
});
watch(selectedCategoryId, (newCategory) => {
  // cMenu= store.state.mainCategory.filter(item => item.lngCode == newCategory).map(item=> item.strTitle)[0];

  const subCategory = store.state.subCategory;
  const minorCategory = store.state.minorCategory;
  let category = [];

  category = subCategory.filter((item) => item.lngCode == newCategory);
  category.forEach((element) => {
    const matchedMinorCategory = minorCategory.filter(
      (item) => item.lngProgramSub == element.lngProgramSub
    );
    element.subcategories = matchedMinorCategory;
  });

  categories.value = category;
  //comsole.log(hierarchicalCategories.value);
});
const activeCategory = ref([]);
const activesubCategory = ref([]);

// watch(
//   () => route.path,
//   (newPath) => {
//     showMobileMenu.value = newPath !== "/"; // Update based on new route
//   }
// );

const isStickyVisible = ref(true); // 요소가 화면에 보이는지 여부
const stickyElement = ref(null);

const changeBottomMenu = ref(true);

const lastScrollY = ref(0); // 마지막 스크롤 위치
const lastScrollY3 = ref(0); // 마지막 스크롤 위치
const scrollContainer = ref(null);
const scrollContainer3 = ref(null);

const scrollArea = ref(null);

// const handleScroll2 = () => {
//   const el = scrollArea.value;
//   const threshold = 10; // 10px 여유 두고 바닥 처리

//   if (el.scrollTop + el.clientHeight >= el.scrollHeight - threshold) {
//     //comsole.log("⬇ 바닥에 도달했어요!");
//     // 여기에 API 더 불러오거나 알림 띄우거나 원하는 액션 실행
//   }
// };

const handleScroll2 = () => {
  if (scrollArea.value.scrollTop > lastScrollY.value) {
    // 아래로 스크롤하면 메뉴 숨기기
  } else {
    // 위로 스크롤하면 메뉴 보이기
  }

  lastScrollY.value = scrollArea.value.scrollTop;
};

/*
 * 하단 탭 숨김·표시 (포털 앱과 같은 방식)
 * - 같은 방향으로 NAV_DELTA px 이상 움직였을 때만 바꾼다 (손 떨림·관성 스크롤 끝 흔들림에 들락날락하지 않게)
 * - 맨 위 근처, 맨 아래 끝, 스크롤할 내용이 거의 없을 때는 항상 보인다
 * - iOS 탄성 스크롤(맨 위·맨 아래 튕김) 구간에서는 판정하지 않는다
 */
const NAV_DELTA = 24;
const NAV_TOP_KEEP = 56;
const navTrack = { last: 0, anchor: 0, dir: 0 };
const updateBottomNav = (el) => {
  if (!el) return;
  const y = el.scrollTop;
  const max = el.scrollHeight - el.clientHeight;
  if (max <= NAV_DELTA * 2 || y <= NAV_TOP_KEEP) {
    changeBottomMenu.value = true;
    navTrack.last = navTrack.anchor = Math.max(0, y);
    navTrack.dir = 0;
    return;
  }
  if (y > max) return;
  if (y >= max - 2) {
    changeBottomMenu.value = true;
    navTrack.last = navTrack.anchor = y;
    navTrack.dir = 0;
    return;
  }
  const dir = y > navTrack.last ? 1 : y < navTrack.last ? -1 : 0;
  if (dir === 0) return;
  if (dir !== navTrack.dir) {
    navTrack.dir = dir;
    navTrack.anchor = navTrack.last;
  }
  if (dir > 0 && y - navTrack.anchor >= NAV_DELTA) changeBottomMenu.value = false;
  if (dir < 0 && navTrack.anchor - y >= NAV_DELTA) changeBottomMenu.value = true;
  navTrack.last = y;
};

const handleScroll = () => {
  updateBottomNav(scrollContainer.value);
  lastScrollY.value = scrollContainer.value?.scrollTop || 0;
};
const handleScroll3 = async (e) => {
  const target = scrollContainer3.value;
  const scrollTop = target.scrollTop; // 현재 스크롤 위치
  const scrollHeight = target.scrollHeight; // 전체 스크롤 높이
  const clientHeight = target.clientHeight; // 보이는 영역 높이

  if (scrollTop + clientHeight >= scrollHeight - 1) {
    pageIndex.value = pageIndex.value + 1;
    //pageIndex2.value = pageIndex2.value + 15;
    const res = await getNoticeList(
      store.state.userData.GROUP_CD,
      store.state.userData.STORE_CD,
      store.state.userData.USER_NO,
      pageIndex.value,
      pageIndex2.value,
      searchNotice.value == "" ? 0 : 1,
      searchNotice.value
    );

    notices.value.push(...res.data.List);
  }

  // 하단 탭: 본문과 같은 방식 (updateBottomNav)
  updateBottomNav(scrollContainer3.value);

  lastScrollY3.value = scrollContainer3.value.scrollTop;
};

const searchNotice = ref("");
/**
 *  그리드 검색어 세팅
 */

const searchword = (e) => {
  searchNotice.value = e;
};

const searchNow = async (e) => {
  pageIndex.value = 0;
  pageIndex2.value = 15;
  //comsole.log(searchNotice.value);
  const res = await getNoticeList(
    store.state.userData.GROUP_CD,
    store.state.userData.STORE_CD,
    store.state.userData.USER_NO,
    pageIndex.value,
    pageIndex2.value,
    searchNotice.value == "" ? 0 : 1,
    searchNotice.value
  );
  //comsole.log(res);
  notices.value = res.data.List;
};
const notices = ref([]);
/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  initMobileTheme(); /* 저장된 밝게/어둡게 적용 */
  if (scrollContainer.value) {
    scrollContainer.value.addEventListener("scroll", handleScroll); // 스크롤 컨테이너에 이벤트 등록
    lastScrollY.value = scrollContainer.value.scrollTop;
  }
  if (scrollContainer3.value) {
    scrollContainer3.value.addEventListener("scroll", handleScroll3); // 스크롤 컨테이너에 이벤트 등록
    lastScrollY3.value = scrollContainer3.value.scrollTop;
  }
  if (scrollArea.value) {
    scrollArea.value.addEventListener("scroll", handleScroll2); // 스크롤 컨테이너에 이벤트 등록
    lastScrollY3.value = scrollArea.value.scrollTop;
  }

  store.state.inActiveBackGround = false;
});

onBeforeUnmount(() => {
  disposeMobileTheme(); /* 웹 화면으로 갈 때 테마 표시 해제 */
  if (scrollContainer.value) {
    scrollContainer.value.removeEventListener("scroll", handleScroll);
  }
  if (scrollContainer3.value) {
    scrollContainer3.value.removeEventListener("scroll", handleScroll3);
  }
});

// 컴포넌트가 마운트될 때 IntersectionObserver 설정

const changeSalesIconState = ref(true);
const changeIcon = ref(0);
const movePage = async (e, e2) => {
  //comsole.log(e2);
  //store.state.mobileSelectProgName = e2;

  const checkSession = await insertMobilePageLog({
    strUrl: e2,
    lngProgramID: e,
  });

  store.dispatch("saveMobileProgName", e2);
  changeIcon.value = 0;
  personal.value = false;
  order.value = false;
  changeSalesIconState.value = !changeSalesIconState.value;
  notice.value = false;
  router.push(`/m/${e}`);
};
</script>

<style scoped>
/* 주소창이 접히고 펴질 때 높이가 흔들리지 않도록 dvh 사용 (미지원 브라우저는 vh) */
.m-vh {
  height: 100vh;
  height: 100dvh;
}

.m-panel {
  min-height: 100%;
  padding: 4.2rem 0.75rem calc(5.5rem + env(safe-area-inset-bottom, 0px));
  background: var(--m-bg, #f8fafc);
  -webkit-tap-highlight-color: transparent;
}

.m-empty {
  padding: 4rem 1rem;
  text-align: center;
  font-size: calc(0.875rem * var(--m-fs, 1));
  color: var(--m-text-4, #94a3b8);
}

.m-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.m-notice,
.m-menu {
  border: 1px solid var(--m-border, #e2e8f0);
  border-radius: 1rem;
  background: var(--m-surface, #fff);
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
}

.m-notice {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-height: 3.5rem;
  padding: 0.9rem 1rem;
  text-align: left;
  cursor: pointer;
  touch-action: manipulation;
  transition: background-color 0.15s ease;
}

.m-notice:active,
.m-menu:active {
  background: var(--m-surface-2, #eef2f7);
}

.m-notice-main {
  flex: 1;
  min-width: 0;
}

.m-notice.is-read .m-notice-main {
  opacity: 0.55;
}

.m-chevron {
  flex-shrink: 0;
  color: var(--m-text-4, #cbd5e1);
  font-size: calc(0.75rem * var(--m-fs, 1));
}

.m-notice-title {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: calc(0.95rem * var(--m-fs, 1));
  font-weight: 700;
  color: var(--m-text, #0f172a);
}

.m-notice-text {
  min-width: 0;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  word-break: keep-all;
  overflow-wrap: anywhere;
}

.m-badge {
  flex-shrink: 0;
  padding: 0.05rem 0.4rem;
  border-radius: 999px;
  background: #ef4444;
  color: #fff;
  font-size: calc(0.65rem * var(--m-fs, 1));
}

.m-notice-meta {
  margin-top: 0.35rem;
  font-size: calc(0.75rem * var(--m-fs, 1));
  color: var(--m-text-3, #64748b);
}

.m-notice-sub {
  margin-top: 0.15rem;
  font-size: calc(0.7rem * var(--m-fs, 1));
  color: var(--m-text-4, #94a3b8);
}

.m-menu {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 3.5rem;
  padding: 0.95rem 1rem;
  color: var(--m-text, #1e293b);
  font-size: calc(0.95rem * var(--m-fs, 1));
  font-weight: 600;
  text-align: left;
  touch-action: manipulation;
  transition: background-color 0.15s ease;
}

.m-menu svg {
  color: var(--m-text-4, #cbd5e1);
  font-size: calc(0.75rem * var(--m-fs, 1));
}

.m-detail {
  min-height: 100%;
  padding: 4.2rem 0 5.5rem;
  background: var(--m-bg, #f8fafc);
}

.m-detail h1 {
  padding: 0.25rem 1.1rem 0.6rem;
  font-size: calc(1.25rem * var(--m-fs, 1));
  font-weight: 800;
  color: var(--m-text, #0f172a);
  text-align: left;
}

.m-detail-meta {
  padding: 0 1.1rem 0.9rem;
  font-size: calc(0.8rem * var(--m-fs, 1));
  color: var(--m-text-3, #64748b);
  text-align: left;
}

.m-detail-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.25rem;
}

.m-attach {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  gap: 0.35rem;
  min-height: 2.75rem;
  padding: 0 0.875rem;
  border-radius: 999px;
  background: var(--m-accent-weak, #eff4ff);
  color: var(--m-accent, #2563eb);
  font-size: calc(0.8125rem * var(--m-fs, 1));
  font-weight: 700;
  touch-action: manipulation;
  transition: background-color 0.15s ease;
}

.m-attach:active {
  background: var(--m-accent-weak, #dbe7ff);
}

/* 첨부 파일이 없을 때: 누를 수 없는 상태로 보이게 */
.m-attach.is-none {
  background: var(--m-surface-2, #f1f5f9);
  color: var(--m-text-4, #94a3b8);
}

.m-detail-body {
  min-height: 24rem;
  margin: 0 0.75rem;
  padding: 1rem;
  border: 1px solid var(--m-border, #e2e8f0);
  border-radius: 1rem;
  background: var(--m-surface, #fff);
  color: var(--m-text-2, #334155);
  font-size: calc(0.9375rem * var(--m-fs, 1));
  line-height: 1.6;
  text-align: left;
  white-space: pre-line;
  overflow-wrap: anywhere;
}

/* 공지 본문 안의 이미지·표가 화면 밖으로 넘치지 않게 */
.m-detail-body :deep(img),
.m-detail-body :deep(video) {
  max-width: 100%;
  height: auto;
}

.m-detail-body :deep(table) {
  display: block;
  max-width: 100%;
  overflow-x: auto;
}

@media (prefers-reduced-motion: reduce) {
  .m-notice,
  .m-menu,
  .m-attach {
    transition: none;
  }
}
</style>
