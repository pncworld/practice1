<template>
  <div
    class="flex justify-end space-x-5 fixed top-5 right-5 mt-3"
    v-show="showMenu">
    <div class="">
      <font-awesome-icon :icon="['far', 'bell']" class="text-3xl" />
    </div>
    <div class="w-full bg-gray-100 z-10 border border-gray-100">
      <button @click="showMobileMenu">
        <font-awesome-icon icon="bars" class="size-8" />
      </button>
    </div>
  </div>
</template>

<script setup>
import router from "@/router";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

const mobileMenu = ref(false);
const showMenu = ref(false);
const personal = ref(false);

const route = useRoute();
watch(route, () => {
  if (route.path === "/") {
    showMenu.value = false; // 또는 원하는 다른 동작 수행
  } else {
    showMenu.value = true;
  }
});
const emit = defineEmits(["showMenu", "showpersonal", "showHomepage"]);
const showMobileMenu = () => {
  mobileMenu.value = !mobileMenu.value;

  emit("showMenu", mobileMenu.value);
  personal.value = false;
  emit("showpersonal", personal.value);
  emit("showHomepage", false);
};
const showMobilePersonal = () => {
  mobileMenu.value = false;
  emit("showMenu", mobileMenu.value);
  personal.value = !personal.value;
  emit("showpersonal", personal.value);
  emit("showHomepage", false);
};
const showHomePage = () => {
  mobileMenu.value = false;
  emit("showMenu", mobileMenu.value);
  personal.value = false;
  emit("showpersonal", personal.value);
  router.push("/homePage");
};
</script>

<style lang="scss" scoped></style>
