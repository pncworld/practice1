<template>
  <div
    class="flex fixed top-0 w-full bg-white z-10 space-x-0 border border-gray-100 justify-between"
    v-show="showMenu2">
    <div class="flex">
      <button @click="showTotalMenu" v-if="clickIcon != 4">
        <font-awesome-icon :icon="['fas', 'bars']" class="size-8 mt-2 ml-5" />
      </button>

      <button @click="moveBack" v-if="clickIcon == 4">
        <font-awesome-icon
          :icon="['fas', 'angle-left']"
          class="size-8 mt-2 ml-5" />
      </button>
      <div
        v-if="clickIcon == 2 && showInputBox == false"
        class="flex justify-center items-center ml-[2vw] text-xl font-semibold">
        공지사항
      </div>
      <div
        v-if="clickIcon == 3"
        class="flex justify-center items-center ml-[2vw] text-xl font-semibold">
        매출조회
      </div>
      <div
        v-if="clickIcon == 0"
        class="flex justify-center items-center ml-[2vw] text-xl font-semibold">
        {{ selectedProgName }}
      </div>
      <div
        v-if="clickIcon == 4"
        class="flex justify-center items-center ml-[2vw] text-xl font-semibold"></div>
      <div
        v-if="showInputBox"
        class="flex justify-center items-center ml-[2vw] text-xl font-semibold">
        <input
          type="text"
          @keydown.enter="searchNotice2"
          v-model="searchWord"
          class="border border-gray-500 rounded-lg h-6 pl-1" />
      </div>
    </div>
    <div>
      <button @click="reload" v-if="clickIcon == 1 || clickIcon == 0">
        <font-awesome-icon
          :icon="['fas', 'rotate-right']"
          class="size-8 mt-2 mr-5" />
      </button>
      <button @click="searchNotice" v-if="clickIcon == 2">
        <font-awesome-icon
          :icon="['fas', 'magnifying-glass']"
          class="size-8 mt-2 mr-5" />
      </button>
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
      @click="showMobileNotice"
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
import store from "@/store";
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

const showTotalMenu = () => {
  showMenu3.value = !showMenu3.value;
  emit("showMenu3", showMenu3.value);
};
const moveBack = () => {
  //showMenu3.value = !showMenu3.value;
  clickIcon.value = 1;
  emit("showNotice", true);
  emit("showMenu3", false);
};

const selectedProgName = ref("");

watch(selectedProgName, () => {
  console.log(selectedProgName.value);
});

const clickIcon = ref(1);
watch(
  () => store.state.mobileSelectProgName,
  () => {
    console.log(store.state.mobileSelectProgName);

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

const route = useRoute();
watch(route, () => {
  console.log(route.path);
  if (route.path === "/m") {
    showMenu.value = false; // 또는 원하는 다른 동작 수행
    showMenu2.value = false; // 또는 원하는 다른 동작 수행
  } else {
    showMenu.value = true;
    showMenu2.value = true;
  }

  console.log(store.state.mobileSelectProgName);
});
onMounted(() => {
  if (store.state.StoreToken != "") {
    showMenu2.value = true;
    showMenu.value = true;
  } else {
    showMenu2.value = false;
    showMenu.value = false;
  }
  console.log(store.state.mobileSelectProgName);
  //selectedProgName.value = store.state.mobileSelectProgName;
});
const emit = defineEmits([
  "showNotice",
  "showpersonal",
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
});

watch(
  () => props.changeIcon,
  () => {
    console.log(props.changeIcon);
    clickIcon.value = props.changeIcon;
  }
);

watch(clickIcon, () => {
  emit("changeIconValue", clickIcon.value);
});
watch(
  () => props.changeMenuState,
  () => {
    showMenu3.value = props.changeMenuState;
    clickIcon.value = 0;
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
  emit("showpersonal", personal.value);
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
  showInputBox.value = false;
  emit("showpersonal", personal.value);
  emit("showHomepage", false);
};
const showHomePage = () => {
  clickIcon.value = 1;
  mobileMenu.value = false;
  showInputBox.value = false;
  emit("showNotice", mobileMenu.value);
  personal.value = false;
  emit("showpersonal", personal.value);
  router.push("/m/homePage");
};

const reload = () => {
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
    console.log(props.changeBottomMenu);
    showMenu.value = props.changeBottomMenu;
  }
);
</script>

<style lang="scss" scoped></style>
