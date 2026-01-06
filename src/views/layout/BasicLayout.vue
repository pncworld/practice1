<!-- /*--############################################################################
                  # Date :2025-05-14                                            
                 # Author : 권맑음                     
################################################################################*/ -->
<template>
  <div class="flex-col po-layout" @click="closeOtherTab">
    <Loading style="z-index: 100" />

    <div class="w100 po-gradient"></div>

    <!-- ===============================
        Header
    =============================== -->
    <div v-if="showMenu" class="po-header flex-between">
      <div class="w-left h-left">
        <div class="h-logo hidden md:block">
          <!-- <img src="@/assets/images/logo.jpg" class="w100"> -->
          <img
            :src="strLogoUrl"
            @error="handleError2"
          />
        </div>
      </div>

      <div class="pd20 pt0 pb0 flex-between w-right h-right">
        <!-- GNB -->
        <nav class="flex items-center h-gnb">
          <a
            v-for="item in mainCategoryList"
            :key="item.lngCode"
            @click="selectCategory(item.lngCode)"
            :class="{ active: selectCategoryId === item.lngCode }"
          >
            {{ item.strTitle }}
          </a>
        </nav>

        <!-- Header Buttons -->
        <div class="h-controller">
          <button type="button" class="btn-action close" @click="deleteAllTabs">
            <i class="ico ico-close"></i>
          </button>
          <button type="button" class="btn-action refresh" @click="reLoad">
            <i class="ico ico-refresh"></i>
          </button>
          <button type="button" class="btn-action menu" @click.stop="showMenus">
            <i class="ico ico-menu"></i>
          </button>
        </div>

        <button class="bd-white-40 br5 f15 fw700 fc-white trs btn-logout" @click="logout">
          <!-- <img src="/src/assets/images/logout.svg"> -->
          <img src="@/assets/images/logout.svg">
          <span>로그아웃</span>
        </button>
      </div>
    </div>

    <!-- ===============================
        GNB Dropdown
    =============================== -->
    <div class="gnb-dropdown" v-show="showmenus">
      <a
        v-for="item in mainCategoryList"
        :key="item.lngCode"
        @click="selectCategory(item.lngCode)"
        :class="{ active: selectCategoryId === item.lngCode }"
      >
        {{ item.strTitle }}
      </a>
    </div>

    <!-- ===============================
        Content
    =============================== -->
    <div class="po-content">
      <!-- ===============================
          Left Menu
      =============================== -->
      <aside
        v-show="isMenu && showMenu"
        class="w-left sidemenu"
      >
        <BasicMenu
          v-if="showMenu"
          class="w100 h100"
          @emittab="emittab"
          @activeTab="activeTab"
          :selectCategoryId="selectCategoryId"
          :tabs="tabs"
          :triggerNow="triggerNow"
        />
      </aside>

      <!-- ===============================
          Right Content
      =============================== -->
      <div class="pd20 pl0 pt0 w-right">
        <!-- Tabs -->
        <div class="flex-between po-tabs">
          <div class="flex po-tabs-inner" ref="scrollContainer">
            <div
              v-for="tab in tabs"
              :key="tab.lngProgramID"
              class="po-tab-item"
              :class="{ active: currentActiveTab.lngProgramID === tab.lngProgramID }"
              @click="setActiveTab(tab)"
            >
              <span class="title">{{ tab.strTitle }}</span>
              <button class="btn-close" @click.stop="removeTab(tab)"></button>
            </div>
          </div>

          <div class="tab-actions">
            <button class="btn-action prev" @click="moveleft">
              <i class="ico ico-prev"></i>
            </button>
            <button class="btn-action next" @click="moveright">
              <i class="ico ico-next"></i>
            </button>
            <button class="btn-action close" @click="deleteAllTabs">
              <i class="ico ico-close"></i>
            </button>
            <button class="btn-action refresh" @click="reLoad">
              <i class="ico ico-refresh"></i>
            </button>
            <div class="btn-menu-group">
              <button class="btn-action menu" @click.stop="showMenus">
                <i class="ico ico-menu"></i>
              </button>
              <div class="tab-menu-popup" :class="{ open: showmenus }">
                <ul class="tab-menu-list">
                  <li
                    v-for="tab in tabs"
                    :key="tab.lngProgramID"
                    @click="setActiveTab(tab); showmenus = false;"
                  >
                    {{ tab.strTitle }}
                  </li>
                </ul>
              </div>
            </div>
            <button class="btn-action expand" @click="hideMenu">
              <i class="ico ico-expand"></i>
            </button>
          </div>
        </div>

        <!-- Router View -->
        <router-view v-slot="{ Component, route }">
          <keep-alive>
            <component
              :is="Component"
              :key="`${route.path}-${componentKey}`"
            />
          </keep-alive>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import BasicMenu from "@/components/BasicMenu.vue";
import Loading from "@/components/loading.vue";
import router from "@/router";
/**
 *  경고창 호출 라이브러리
 *  */

import Swal from "sweetalert2";
import { v4 } from "uuid";
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";

const scrollContainer = ref(null);
const moveright = () => {
  if (!scrollContainer.value) return;
  scrollContainer.value.scrollLeft += 200;
};
const moveMaxright = () => {
  if (!scrollContainer.value) return;
  scrollContainer.value.scrollLeft = scrollContainer.value.scrollWidth + 2000;
};
const moveleft = () => {
  if (!scrollContainer.value) return;
  scrollContainer.value.scrollLeft -= 200;
};
/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(() => {
  // router.push("/homepage");
});
// 화면 크기 감지 및 업데이트

const closeOtherTab = () => {
  showmenus.value = false;
};
const route = useRoute();
const store = useStore();
const userData = computed(() => store.state.userData);
const strLogoUrl = computed(
  () =>
    userData.value.strLogoUrl?.split(".net")[1] || "../../assets/noimage2.png"
); // .split(".net")[1]
const mobileShowMenu = ref(false);
const showMenu = ref(route.path != "/"); // Initialize based on current route
const componentKey = ref(null);
// Watch for route changes

watch(
  () => route.path,
  (newPath) => {
    showMenu.value = newPath != "/"; // Update based on new route
  }
);
store.dispatch("convertLoading", false);
const deleteAllTabs = () => {
  Swal.fire({
    title: "확인",
    text: "열린화면을 모두 닫으시겠습니까?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "확인",
    cancelButtonText: "취소",
  }).then((result) => {
    if (result.isConfirmed) {
      //store.dispatch("closeAllTabs");
      tabs.value = [];
      router.push("/homePage");
    } else {
    }
  });
};

const showmenus = ref(false);

const showMenus = () => {
  showmenus.value = !showmenus.value;
};
const selectCategoryId = ref(1);
const triggerNow = ref(false);

const selectCategory = (category) => {
  //store.dispatch("selectCategory", category);\
  selectCategoryId.value = category;
  isMenu.value = true;
  mobileShowMenu.value = true;
  triggerNow.value = !triggerNow.value;
};

const logout = () => {
  store.dispatch("logout");
  //localStorage.clear();
  sessionStorage.clear();
  window.location.href = "/";

  //comsole.log(store.state);
};

const isMenu = ref(true);
const mainCategoryList = computed(() => store.state.mainCategory);
const clickFirstCategory = () => {
  const buttons = document.querySelectorAll('button[name="categorys"]'); // 모든 버튼 선택
  if (buttons.length > 0) {
    buttons[0].click(); // 첫 번째 버튼 클릭
  }
};
watch(mainCategoryList, (newCategories) => {
  if (newCategories.length > 0) {
    clickFirstCategory(); // 카테고리 목록이 변경되면 첫 번째 카테고리 클릭
  }
});

const hideMenu = () => {
  isMenu.value = !isMenu.value;
  reLoad();
};

const tabs = ref([]);
const emittab = async (e) => {
  tabs.value = e;
  await nextTick();
  moveMaxright();
};

const activeTab = (e) => {
  //comsole.log(e);
  //store.state.activeTab2 = e;
  store.dispatch("saveActiveTab", e);
  currentActiveTab.value = e;
};

const removedtabId = ref();
const removeTab = (tab) => {
  //comsole.log(tab);
  //comsole.log(tabs.value);
  tabs.value = tabs.value.filter(
    (item) => item.lngProgramID != tab.lngProgramID
  );
  const currentTab = tabs.value;
  if (currentTab.length > 0) {
    // @click.stop 안해서 상위 이벤트 전파때문에 안됬었음.

    currentActiveTab.value = tabs.value[tabs.value.length - 1];
    store.dispatch("saveActiveTab", currentActiveTab.value);
    const insteadProgramID = tabs.value[tabs.value.length - 1].lngProgramID;
    const insteadstrUrl = tabs.value[tabs.value.length - 1].strUrl;
    componentKey.value = insteadProgramID;
    // isActive(insteadtab);
    router.push({
      path:
        "/" + insteadstrUrl.split("::")[0] + "/" + insteadstrUrl.split("::")[1],
      query: { index: insteadProgramID },
    });
  } else {
    componentKey.value = null;
    router.push("/homePage");
  }
};

//ref 는 기존의 변수까지 전부 병렬적으로 바꾸는거 같고 computed는 직렬적으로 바꾸는 것 같음

const reLoad = () => {
  // window.location.reload(); // 페이지 새로 고침
  //comsole.log(currentActiveTab.value);
  //comsole.log(tabs.value);
  if (
    currentActiveTab.value &&
    (tabs.value.length == 0 || currentActiveTab.value.lngProgramID == "")
  ) {
    return;
  }
  const uuid = v4();
  const b = currentActiveTab.value.lngProgramID.split("_")[0];
  const a = tabs.value.find(
    (item) => item.lngProgramID == currentActiveTab.value.lngProgramID
  );

  const c = b + "_" + uuid;
  a.lngProgramID = c;
  componentKey.value = c;
};

const currentActiveTab = ref({ lngProgramID: "", strTitle: "" });
const setActiveTab = (tab) => {
  // showmenus.value = false ;
  //store.dispatch("changeActiveTab", tab);
  currentActiveTab.value = tab;
  store.dispatch("saveActiveTab", tab);
  componentKey.value = tab.lngProgramID;
  //isActive(tab);
  router.push({
    path: "/" + tab.strUrl.split("::")[0] + "/" + tab.strUrl.split("::")[1],
    query: { index: tab.lngProgramID },
  });
};

watch(
  () => route.query,
  (newQuery) => {
    if (newQuery.index) {
      componentKey.value = newQuery.index;
    }
  }
);

watch(
  () => store.state.currentTabs,
  (newTabs) => {
    store.dispatch("changeActiveTab", newTabs);
    const activeTab = store.state.activeTab;
    componentKey.value = activeTab;
  }
);
</script>

<style scoped>
.layout {
  display: flex;
  height: 100vh;
  overflow: hidden; /* 화면 밖으로 나가는 애니메이션 방지 */
}

.sidebar {
  width: 20%;
  position: relative;
  background: blue;
  opacity: 0.6;
}

.main-content {
  width: 80%;
  position: relative;
  background: white;
  padding: 20px;
  overflow: hidden; /* 화면 밖으로 나가는 애니메이션 방지 */
}
.header-style-0 {
  background-color: #545876 !important;
  color: white !important;
}
.header-style-1 {
  background-color: #545876 !important;
  color: white !important;
}
.header-style-2 {
  background-color: #545876 !important;
  color: white !important;
}
.header-style-3 {
  background-color: #545876 !important;
  color: white !important;
}
</style>
