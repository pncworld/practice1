<script setup>
import { onMounted, ref } from 'vue';
import BasicLayout from './views/layout/BasicLayout.vue';
import MobileLayout from './views/layout/mobileLayout.vue';
import { useStore } from 'vuex';
import JSZip from 'jszip';

const isMobile = ref(false);
const store = useStore();
const detectMobile  = () =>{
  const userAgent = window.navigator.userAgent;
  isMobile.value = /iPhone|iPad|iPod|Android/i.test(userAgent);
}
onMounted(() =>{
  detectMobile();
  store.state.isMobile= isMobile.value ;
  
})
window.JSZip = JSZip;
</script>

<template>
   <component :is="isMobile ? MobileLayout : BasicLayout" class="">
    <router-view></router-view> <!-- 자식 컴포넌트를 여기에 렌더링 -->
  </component>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height : 100vh;
}
html {
  height : 100vh;

}
body {
  height : 100vh;
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
