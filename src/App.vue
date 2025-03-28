<script setup>
import JSZip from "jszip";
import { defineAsyncComponent, onMounted, ref } from "vue";
import { useStore } from "vuex";
import LoadingScreen from "./components/LoadingScreen.vue";

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
onMounted(() => {
  detectMobile();
  store.state.isMobile = isMobile.value;
});

window.JSZip = JSZip;
</script>

<template>
  <Suspense>
    <template #default>
      <!-- isMobile에 따라 레이아웃을 동적으로 선택 -->
      <component :is="isMobile ? MobileLayout : BasicLayout" class="">
        <router-view></router-view>
        <!-- 자식 컴포넌트를 여기에 렌더링 -->
      </component>
    </template>
    <template #fallback>
      <!-- 로딩 중에 보여줄 컴포넌트 -->
      <LoadingScreen />
    </template>
  </Suspense>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
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
