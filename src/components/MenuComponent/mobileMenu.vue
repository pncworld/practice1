<template>
  <div class="m-top" v-show="showMenu2">
    <div class="m-top-left">
      <button type="button" class="m-icon-btn" @click="showTotalMenu" v-if="clickIcon != 4">
        <font-awesome-icon :icon="['fas', 'bars']" />
      </button>
      <button type="button" class="m-icon-btn" @click="moveBack" v-if="clickIcon == 4">
        <font-awesome-icon :icon="['fas', 'angle-left']" />
      </button>
      <div v-if="clickIcon == 2 && showInputBox == false" class="m-title">공지사항</div>
      <div v-if="clickIcon == 3" class="m-title">매출조회</div>
      <div v-if="clickIcon == 5" class="m-title">발주관리</div>
      <div v-if="clickIcon == 0" class="m-title">{{ selectedProgName }}</div>
      <div v-if="showInputBox" class="m-title">
        <input
          type="text"
          @keydown.enter="searchNotice2"
          v-model="searchWord"
          class="m-search"
          placeholder="검색" />
      </div>
    </div>
    <div>
      <button type="button" class="m-icon-btn" @click="reload" v-if="clickIcon == 1 || clickIcon == 0">
        <font-awesome-icon :icon="['fas', 'rotate-right']" />
      </button>
      <button type="button" class="m-icon-btn" @click="searchNotice" v-if="clickIcon == 2">
        <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
      </button>
    </div>
  </div>
  <div class="m-tab" v-show="showMenu">
    <button
      type="button"
      @click="showHomePage"
      class="m-tab-btn"
      :class="{ 'is-on': clickIcon == 1 }">
      <font-awesome-icon icon="house" />
      <div>홈</div>
    </button>
    <button
      type="button"
      @click="showMobileNotice"
      class="m-tab-btn"
      :class="{ 'is-on': clickIcon == 2 }">
      <font-awesome-icon :icon="['far', 'bell']" />
      <div>공지사항</div>
    </button>
    <button
      type="button"
      @click="showMobilePersonal"
      class="m-tab-btn"
      :class="{ 'is-on': clickIcon == 3 }">
      <font-awesome-icon :icon="['far', 'calendar-days']" />
      <div>매출조회</div>
    </button>
    <button
      type="button"
      @click="showMobileOrder"
      class="m-tab-btn"
      :class="{ 'is-on': clickIcon == 5 }">
      <font-awesome-icon :icon="['fas', 'cart-shopping']" />
      <div>발주관리</div>
    </button>
  </div>
</template>

<script setup>
import router from "@/router";
import store from "@/store";
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

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
  padding: 0 0.75rem;
  background: #fff;
  border-bottom: 1px solid #eef2f6;
}

.m-top-left {
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 0.35rem;
}

.m-icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.75rem;
  color: #334155;
  font-size: 1.15rem;
}

.m-title {
  max-width: 62vw;
  overflow: hidden;
  font-size: 1.05rem;
  font-weight: 700;
  color: #0f172a;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.m-search {
  width: 52vw;
  height: 2rem;
  padding: 0 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  background: #f8fafc;
  font-size: 0.875rem;
  font-weight: 500;
}

.m-tab {
  position: fixed;
  bottom: 0;
  z-index: 30;
  display: flex;
  width: 100%;
  padding-bottom: env(safe-area-inset-bottom);
  background: #fff;
  border-top: 1px solid #eef2f6;
  box-shadow: 0 -6px 16px rgba(15, 23, 42, 0.04);
}

.m-tab-btn {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.15rem;
  height: 3.6rem;
  color: #94a3b8;
  font-size: 1.15rem;
}

.m-tab-btn div {
  font-size: 0.68rem;
  font-weight: 600;
}

.m-tab-btn.is-on {
  color: #3b82f6;
}
</style>
