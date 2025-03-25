<template>
  <div
    class="flex fixed top-0 w-full bg-white z-10 space-x-0 border border-gray-100 justify-between"
    v-show="showMenu2">
    <div>
      <button @click="showTotalMenu">
        <font-awesome-icon :icon="['fas', 'bars']" class="size-8 mt-2 ml-5" />
      </button>
    </div>
    <div>
      <font-awesome-icon
        :icon="['fas', 'rotate-right']"
        class="size-8 mt-2 mr-5" />
    </div>
  </div>
  <div
    class="flex justify-center fixed bottom-0 w-full bg-white z-10 space-x-0 border border-gray-100"
    v-show="showMenu">
    <button
      @click="showHomePage"
      class="w-1/3 bg-white"
      :class="{ '!bg-blue-500 text-white': clickIcon == 1 }">
      <font-awesome-icon icon="house" class="size-8" />
      <div class="text-xs">홈</div>
    </button>
    <button
      @click="showMobileMenu"
      class="w-1/3 bg-white"
      :class="{ '!bg-blue-500 text-white': clickIcon == 2 }">
      <font-awesome-icon :icon="['far', 'bell']" class="size-8" />
      <div class="text-xs">공지사항</div>
    </button>
    <button
      @click="showMobilePersonal"
      class="w-1/3 bg-white"
      :class="{ '!bg-blue-500 text-white': clickIcon == 3 }">
      <font-awesome-icon :icon="['far', 'calendar-days']" class="size-8" />
      <div class="text-xs">매출조회</div>
    </button>
  </div>
</template>

<script setup>
import router from "@/router";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

const showTotalMenu = () => {
  showMenu3.value = !showMenu3.value;
  emit("showMenu3", showMenu3.value);
};

const showMenu3 = ref(false);
const mobileMenu = ref(false);
const showMenu = ref(false);
const showMenu2 = ref(false);
const personal = ref(false);
const clickIcon = ref(0);
const route = useRoute();
watch(route, () => {
  console.log(route.path);
  if (route.path === "/") {
    showMenu.value = false; // 또는 원하는 다른 동작 수행
    showMenu2.value = false; // 또는 원하는 다른 동작 수행
  } else {
    showMenu.value = true;
    showMenu2.value = true;
  }
});
const emit = defineEmits([
  "showMenu",
  "showpersonal",
  "showHomepage",
  "showMenu3",
]);

const props = defineProps({
  // Prop 정의
  changeMenuState: {
    type: Boolean,
    default: false,
  },
});

watch(
  () => props.changeMenuState,
  () => {
    showMenu3.value = props.changeMenuState;
  }
);
const showMobileMenu = () => {
  clickIcon.value = 2;
  mobileMenu.value = !mobileMenu.value;

  emit("showMenu", mobileMenu.value);
  personal.value = false;
  emit("showpersonal", personal.value);
  emit("showHomepage", false);
};
const showMobilePersonal = () => {
  clickIcon.value = 3;
  mobileMenu.value = false;
  emit("showMenu", mobileMenu.value);
  personal.value = !personal.value;
  emit("showpersonal", personal.value);
  emit("showHomepage", false);
};
const showHomePage = () => {
  clickIcon.value = 1;
  mobileMenu.value = false;
  emit("showMenu", mobileMenu.value);
  personal.value = false;
  emit("showpersonal", personal.value);
  router.push("/homePage");
};
</script>

<style lang="scss" scoped></style>
