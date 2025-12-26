<script setup>
import JSZip from "jszip";
import { defineAsyncComponent, onMounted, ref, watch, computed } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import LoadingScreen from "./components/LoadingScreen.vue";
import EmptyLayout from "./views/layout/EmptyLayout.vue";
import ModalAlert from "./components/ModalAlert.vue";
import { useModalAlert } from "./utils/modalAlert";

const isMobile = ref(false);
const store = useStore();
const detectMobile = () => {
  const userAgent = window.navigator.userAgent;
  isMobile.value = /iPhone|iPad|iPod|Android/i.test(userAgent);
};

const MobileLayout = defineAsyncComponent(() =>
  import("../src/views/layout/mobileLayout.vue")
);
const BasicLayout = defineAsyncComponent(() =>
  import("../src/views/layout/BasicLayout.vue")
);
const route = useRoute();
const exception = ref(false);
onMounted(() => {
  detectMobile();
  store.state.isMobile = isMobile.value;
});

watch(route, () => {
  if (route.fullPath.includes("VUEPOS")) {
    exception.value = true;
  } else {
    exception.value = false;
  }
});

// 로그인 페이지("/")에서는 레이아웃을 사용하지 않음
const isLoginPage = computed(() => route.path === "/");

// 레이아웃 컴포넌트 결정
const layoutComponent = computed(() => {
  // 로그인 페이지는 레이아웃 없이 직접 렌더링
  if (isLoginPage.value) {
    return null;
  }
  
  // 모바일이면 MobileLayout
  if (isMobile.value) {
    return MobileLayout;
  }
  
  // VUEPOS 경로면 EmptyLayout
  if (exception.value) {
    return EmptyLayout;
  }
  
  // 기본적으로 BasicLayout
  return BasicLayout;
});

window.JSZip = JSZip;

// 전역 Modal Alert
const { modal, handleModalConfirm, handleModalSave, handleModalCancel } = useModalAlert();
</script>

<template>
  <Suspense>
    <template #default>
      <!-- 로그인 페이지는 레이아웃 없이 직접 렌더링 -->
      <template v-if="isLoginPage">
        <router-view></router-view>
      </template>
      <!-- 그 외 페이지는 레이아웃 컴포넌트 사용 -->
      <component v-else :is="layoutComponent" class="">
        <router-view></router-view>
        <!-- 자식 컴포넌트를 여기에 렌더링 -->
      </component>
    </template>
    <template #fallback>
      <!-- 로딩 중에 보여줄 컴포넌트 -->
      <LoadingScreen />
    </template>
  </Suspense>
  
  <!-- 전역 Modal Alert -->
  <ModalAlert
    :isVisible="modal.visible"
    :type="modal.type"
    :title="modal.title"
    :message="modal.message"
    :showConfirm="modal.showConfirm"
    :showSave="modal.showSave"
    :showCancel="modal.showCancel"
    @close="modal.visible = false"
    @confirm="handleModalConfirm"
    @save="handleModalSave"
    @cancel="handleModalCancel"
  />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  color: #2c3e50;
  height: 100vh;
}
html {
  height: 100vh;
}
body {
  height: 100vh;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
