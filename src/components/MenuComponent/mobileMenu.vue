<template>
  <div class="m-top" v-show="showMenu2">
    <div class="m-top-left">
      <button
        type="button"
        class="m-icon-btn"
        aria-label="전체 메뉴"
        @click="showTotalMenu"
        v-if="clickIcon != 4">
        <font-awesome-icon :icon="['fas', 'bars']" />
      </button>
      <button
        type="button"
        class="m-icon-btn"
        aria-label="뒤로"
        @click="moveBack"
        v-if="clickIcon == 4">
        <font-awesome-icon :icon="['fas', 'angle-left']" />
      </button>
      <div v-if="clickIcon == 2 && showInputBox == false" class="m-title">공지사항</div>
      <div v-if="clickIcon == 3" class="m-title">매출조회</div>
      <div v-if="clickIcon == 5" class="m-title">발주관리</div>
      <div v-if="clickIcon == 0" class="m-title">{{ selectedProgName }}</div>
      <div v-if="showInputBox" class="m-title m-title--search">
        <input
          type="text"
          inputmode="search"
          enterkeyhint="search"
          autocomplete="off"
          @keydown.enter="searchNotice2"
          v-model="searchWord"
          class="m-search"
          aria-label="공지사항 검색"
          placeholder="공지사항 검색" />
      </div>
    </div>
    <div class="m-top-right">
      <!-- 화면 색: 밝게 ↔ 어둡게 (고른 값은 이 휴대폰에 저장) -->
      <button
        type="button"
        class="m-icon-btn m-theme-btn"
        :aria-label="isDark ? '밝은 화면으로' : '어두운 화면으로'"
        :aria-pressed="isDark"
        @click="toggleTheme">
        <font-awesome-icon :icon="['fas', isDark ? 'sun' : 'moon']" />
      </button>
      <button
        type="button"
        class="m-icon-btn"
        aria-label="새로고침"
        @click="reload"
        v-if="clickIcon == 1 || clickIcon == 0">
        <font-awesome-icon :icon="['fas', 'rotate-right']" />
      </button>
      <button
        type="button"
        class="m-icon-btn"
        :class="{ 'is-on': showInputBox }"
        aria-label="검색"
        @click="searchNotice"
        v-if="clickIcon == 2">
        <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
      </button>
    </div>
  </div>
  <!-- 숨김/표시는 display 전환 대신 transform 으로 처리한다(화면 밀림 방지) -->
  <div
    class="m-tab"
    :class="{ 'is-hidden': !showMenu }"
    :aria-hidden="!showMenu">
    <button
      type="button"
      @click="showHomePage"
      class="m-tab-btn"
      :class="{ 'is-on': clickIcon == 1 }">
      <span class="m-tab-ico"><font-awesome-icon icon="house" /></span>
      <div>홈</div>
    </button>
    <button
      type="button"
      @click="showMobileNotice"
      class="m-tab-btn"
      :class="{ 'is-on': clickIcon == 2 }">
      <span class="m-tab-ico"
        ><font-awesome-icon :icon="['far', 'bell']"
      /></span>
      <div>공지사항</div>
    </button>
    <button
      type="button"
      @click="showMobilePersonal"
      class="m-tab-btn"
      :class="{ 'is-on': clickIcon == 3 }">
      <span class="m-tab-ico"
        ><font-awesome-icon :icon="['far', 'calendar-days']"
      /></span>
      <div>매출조회</div>
    </button>
    <!-- 발주관리 프로그램 권한이 있을 때만 4번째 탭을 보인다 -->
    <button
      v-if="hasOrderMenu"
      type="button"
      @click="showMobileOrder"
      class="m-tab-btn"
      :class="{ 'is-on': clickIcon == 5 }">
      <span class="m-tab-ico"
        ><font-awesome-icon :icon="['fas', 'cart-shopping']"
      /></span>
      <div>발주관리</div>
    </button>
  </div>
</template>

<script setup>
import router from "@/router";
import store from "@/store";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { isDark, toggleTheme } from "@/views/MOBILE/mobileTheme";
import { useStore } from "vuex";

/*
 * 발주관리(mainCode 30) 프로그램 권한 여부.
 * 전체 메뉴(mobileTotalMenu.vue)와 같은 기준:
 * mobileFunction 에 CATEGORY_ID "30" 이 있고, mobileCategory 에 CATEGORY_ID 30 항목이 1개 이상.
 */
const hasOrderMenu = computed(() => {
  const funcs = store.state.mobileFunction || [];
  const cats = store.state.mobileCategory || [];
  return (
    funcs.some((func) => func.CATEGORY_ID == "30") &&
    cats.some((item) => Number(item.CATEGORY_ID) === 30)
  );
});

const showTotalMenu = () => {
  //showMenu3.value = !showMenu3.value;
  emit("showMenu3", true);
};
const moveBack = () => {
  //showMenu3.value = !showMenu3.value;
  clickIcon.value = 2;
  emit("showNotice", true);
  emit("showMenu3", false);
};

const selectedProgName = ref("");

watch(selectedProgName, () => {
  //comsole.log(selectedProgName.value);
});

const clickIcon = ref(1);
watch(
  () => store.state.mobileSelectProgName,
  () => {
    //comsole.log(store.state.mobileSelectProgName);

    if (store.state.mobileSelectProgName != "") {
      clickIcon.value = 0;
    }
    selectedProgName.value = store.state.mobileSelectProgName;
  },
  {
    immediate: true,
  }
);
const showMenu3 = ref(false);
const mobileMenu = ref(false);
const showMenu = ref(false);
const showMenu2 = ref(false);
const personal = ref(false);
const orderMenu = ref(false);

const route = useRoute();

/*
 * 새로고침하거나 주소로 바로 들어오면 mobileSelectProgName 이 비어 제목이 사라진다.
 * 주소의 프로그램 번호(/m/20013 → 20013)로 모바일 메뉴 목록(mobileCategory)에서 이름을 찾아 맞춘다
 * (휴대폰 뒤로가기로 다른 화면에 갔을 때 이전 제목이 남는 것도 같이 바로잡힌다).
 * 주소가 프로그램 번호가 아니거나 목록에 없으면 기존 값을 그대로 둔다.
 */
const fillProgNameFromRoute = () => {
  const m = String(route.path || "").match(/^\/m\/(\d+)$/);
  if (!m) return;
  const cats = store.state.mobileCategory || [];
  const hit = cats.find((c) => String(c.PROGID) === m[1]);
  if (hit && hit.PROGNM && hit.PROGNM !== store.state.mobileSelectProgName) {
    store.dispatch("saveMobileProgName", hit.PROGNM);
  }
};
watch(
  [() => route.path, () => store.state.mobileCategory],
  () => fillProgNameFromRoute(),
  { immediate: true }
);

watch(route, () => {
  //comsole.log(route.path);
  if (route.path === "/m") {
    showMenu.value = false; // 또는 원하는 다른 동작 수행
    showMenu2.value = false; // 또는 원하는 다른 동작 수행
  } else {
    showMenu.value = true;
    showMenu2.value = true;
  }

  //comsole.log(store.state.mobileSelectProgName);
});
onMounted(() => {
  if (store.state.StoreToken != "") {
    showMenu2.value = true;
    showMenu.value = true;
  } else {
    showMenu2.value = false;
    showMenu.value = false;
  }
  //comsole.log(store.state.mobileSelectProgName);
  //selectedProgName.value = store.state.mobileSelectProgName;
});
const emit = defineEmits([
  "showNotice",
  "showpersonal",
  "showorder",
  "showHomepage",
  "showMenu3",
  "changeIconValue",
  "searchNow",
  "searchword",
]);

const props = defineProps({
  // Prop 정의
  changeMenuState: {
    type: Boolean,
    default: false,
  },
  changeBottomMenu: {
    type: Boolean,
    default: true,
  },
  changeIcon: {
    type: String,
    default: "0",
  },
  changeSalesIconState: {
    type: Boolean,
    default: false,
  },
});

watch(
  () => props.changeIcon,
  () => {
    //comsole.log(props.changeIcon);
    clickIcon.value = props.changeIcon;
  }
);

watch(clickIcon, () => {
  emit("changeIconValue", clickIcon.value);
});
watch(
  () => props.changeMenuState,
  () => {
    //comsole.log("여길오냐?");
    showMenu3.value = props.changeMenuState;
    clickIcon.value = 0;
  }
);
watch(
  () => props.changeSalesIconState,
  () => {
    personal.value = false;
    orderMenu.value = false;
  }
);
const showMobileNotice = () => {
  if (mobileMenu.value) {
    clickIcon.value = 0;
  } else {
    clickIcon.value = 2;
  }
  mobileMenu.value = !mobileMenu.value;

  emit("showNotice", mobileMenu.value);
  personal.value = false;
  orderMenu.value = false;
  emit("showpersonal", personal.value);
  emit("showorder", orderMenu.value);
  emit("showHomepage", false);
};
const showMobilePersonal = () => {
  if (personal.value) {
    clickIcon.value = 0;
  } else {
    clickIcon.value = 3;
  }

  mobileMenu.value = false;
  emit("showNotice", mobileMenu.value);
  personal.value = !personal.value;
  orderMenu.value = false;
  showInputBox.value = false;
  emit("showpersonal", personal.value);
  emit("showorder", orderMenu.value);
  emit("showHomepage", false);
};
const showMobileOrder = () => {
  if (orderMenu.value) {
    clickIcon.value = 0;
  } else {
    clickIcon.value = 5;
  }

  mobileMenu.value = false;
  emit("showNotice", mobileMenu.value);
  personal.value = false;
  orderMenu.value = !orderMenu.value;
  showInputBox.value = false;
  emit("showpersonal", personal.value);
  emit("showorder", orderMenu.value);
  emit("showHomepage", false);
};
const showHomePage = () => {
  clickIcon.value = 1;
  mobileMenu.value = false;
  showInputBox.value = false;
  emit("showNotice", mobileMenu.value);
  personal.value = false;
  orderMenu.value = false;
  emit("showpersonal", personal.value);
  emit("showorder", orderMenu.value);
  router.push("/m/homePage");
};

const reSearch = ref(false);
const store2 = useStore();
const reload = () => {
  //comsole.log(route.path);
  if (route.path === "/m/20013") {
    reSearch.value = !reSearch.value;
    store2.state.mobileReSearch = reSearch.value;
    // store.state.mobileReSearch = !reSearch.value;
    return;
  }
  window.location.reload();
};

const showInputBox = ref(false);
const searchWord = ref("");
const searchNow = ref(false);

const searchNotice2 = () => {
  emit("searchword", searchWord.value);
  if (showInputBox.value == false) {
    showInputBox.value = true;
  } else {
    searchNow.value = !searchNow.value;
    emit("searchNow", searchNow);
    showInputBox.value = false;
    // emit("searchword", searchWord.value);
  }
};
const searchNotice = () => {
  emit("searchword", searchWord.value);
  if (showInputBox.value == false) {
    showInputBox.value = true;
  } else {
    searchNow.value = !searchNow.value;
    emit("searchNow", searchNow);
    showInputBox.value = false;
    // emit("searchword", searchWord.value);
  }
};

watch(
  () => props.changeBottomMenu,
  () => {
    //comsole.log(props.changeBottomMenu);
    showMenu.value = props.changeBottomMenu;
  }
);
</script>

<style scoped>
.m-top {
  position: fixed;
  top: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 3.25rem;
  padding: 0 0.5rem;
  padding-left: max(0.5rem, env(safe-area-inset-left));
  padding-right: max(0.5rem, env(safe-area-inset-right));
  background: var(--m-surface, #fff);
  border-bottom: 1px solid var(--m-border, #eef2f6);
  -webkit-tap-highlight-color: transparent;
}

.m-top-left {
  display: flex;
  flex: 1;
  align-items: center;
  min-width: 0;
  gap: 0.125rem;
}

.m-top-right {
  display: flex;
  flex-shrink: 0;
  align-items: center;
}

/* 터치 영역 44px, 눌림 표시는 안쪽 원으로 */
.m-icon-btn {
  position: relative;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.875rem;
  color: var(--m-text-2, #334155);
  font-size: 1.15rem;
  touch-action: manipulation;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.m-icon-btn:active {
  background: var(--m-surface-2, #eef2f7);
}

/* 어두운 화면일 때 해 아이콘은 따뜻한 노란색 */
html[data-mtheme="dark"] .m-theme-btn {
  color: #fbbf24;
}

.m-icon-btn.is-on {
  background: var(--m-accent-weak, #eff4ff);
  color: var(--m-accent, #2563eb);
}

.m-title {
  min-width: 0;
  overflow: hidden;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--m-text, #0f172a);
  white-space: nowrap;
  text-overflow: ellipsis;
}

.m-title--search {
  flex: 1;
  overflow: visible;
  padding-right: 0.25rem;
}

/* 글자 16px: iOS 에서 입력 시 화면이 확대되어 밀리는 현상 방지 */
.m-search {
  width: 100%;
  height: 2.5rem;
  padding: 0 0.9rem;
  border: 1px solid var(--m-border, #e2e8f0);
  border-radius: 999px;
  background: var(--m-bg, #f8fafc);
  color: var(--m-text, #0f172a);
  font-size: 1rem;
  font-weight: 500;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.m-search:focus {
  border-color: #2563eb;
  background: var(--m-surface, #fff);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

.m-tab {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 30;
  display: flex;
  width: 100%;
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
  background: var(--m-surface, #fff);
  border-top: 1px solid var(--m-border, #eef2f6);
  box-shadow: 0 -6px 16px rgba(15, 23, 42, 0.04);
  transform: translateY(0);
  transition: transform 0.24s cubic-bezier(0.2, 0.8, 0.2, 1),
    visibility 0s linear 0s;
  will-change: transform;
  -webkit-tap-highlight-color: transparent;
}

.m-tab.is-hidden {
  transform: translateY(100%);
  visibility: hidden;
  pointer-events: none;
  transition: transform 0.24s cubic-bezier(0.2, 0.8, 0.2, 1),
    visibility 0s linear 0.24s;
}

/* 버튼 3개/4개 모두 가로 전체를 같은 폭으로 나눈다 */
.m-tab-btn {
  display: flex;
  flex: 1 1 0;
  min-width: 0;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.1rem;
  height: 3.6rem;
  color: var(--m-text-4, #94a3b8);
  font-size: 1.1rem;
  touch-action: manipulation;
  user-select: none;
  transition: color 0.15s ease;
}

.m-tab-ico {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.25rem;
  height: 1.75rem;
  border-radius: 999px;
  transition: background-color 0.15s ease, transform 0.15s ease;
}

.m-tab-btn:active .m-tab-ico {
  background: var(--m-surface-2, #eef2f7);
  transform: scale(0.94);
}

.m-tab-btn div {
  font-size: 0.6875rem;
  font-weight: 600;
}

.m-tab-btn.is-on {
  color: var(--m-accent, #2563eb);
}

.m-tab-btn.is-on .m-tab-ico {
  background: var(--m-accent-weak, #eff4ff);
}

.m-tab-btn.is-on div {
  font-weight: 700;
}

@media (prefers-reduced-motion: reduce) {
  .m-tab,
  .m-tab.is-hidden,
  .m-tab-ico,
  .m-icon-btn {
    transition: none;
  }
}
</style>
