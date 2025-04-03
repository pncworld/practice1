<template>
  <div class="bg-white text-gray-600 w-full overflow-auto h-full m-0">
    <div class="">
      <h1 class="flex text-2xl font-bold h-12 items-center bg-gray-100 p-5">
        {{ cMenu }}
      </h1>

      <div class="flex h-14">
        <input
          type="text"
          class="rounded-2xl bg-transparent border border-solid placeholder-opacity-30 y-3 mx-2 my-2 px-3"
          style="height: 39px; width: 190px; border-radius: 19px"
          placeholder="검색어입력" /><button class="w-2/12">
          <img
            src="../assets/finder_icon.svg"
            class="inline-block w-6/12"
            alt="" />
        </button>
      </div>
      <label class="bg-gray-100">
        <div class="flex justify-start bg-gray-100 h-8 items-center">
          <input type="checkbox" @click="showAll" class="ml-3" />전체
        </div>
      </label>
      <ul>
        <li
          v-for="category in categories"
          :key="category.lngProgramSub"
          :id="category.lngProgramSub"
          class="bg-gray-100">
          <button
            @click="toggleCategory(category.lngProgramSub)"
            class="w-full h-12 text-left px-2 text-gray-900 rounded-lg hover:bg-blue-100 focus:outline-none flex items-center justify-between">
            <span> {{ category.strTitle }}</span
            ><img
              src="../assets/arrow2.png"
              alt=""
              class="transition-transform duration-300"
              :class="{
                'rotate-0': !rotateStates[category.lngProgramSub],
                '-rotate-90': rotateStates[category.lngProgramSub],
              }" />
          </button>
          <ul v-if="isOpen(category.lngProgramSub)" class="pl-4 mt-2">
            <li v-for="sub in category.subcategories" :key="sub.id">
              <div class="flex">
                <button @click="favoriteadd(sub.lngProgramID)">
                  <img
                    src="../assets/table_star.svg"
                    alt=""
                    v-if="!currentFavorite[sub.lngProgramID]" /><img
                    src="../assets/table_star-checked.svg"
                    alt=""
                    v-if="currentFavorite[sub.lngProgramID]" /></button
                ><a
                  href="#"
                  class="flex items-center bg-gray-100 text-gray-900 rounded hover:bg-blue-100 h-10"
                  @click="
                    selectCategory(sub.strUrl, sub.lngProgramID, sub.strTitle)
                  ">
                  {{ sub.strTitle }}
                </a>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import router from "@/router";
import Swal from "sweetalert2";
import { v4 } from "uuid";
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { useStore } from "vuex";
const emit = defineEmits(["emittab", "activeTab"]);
const props = defineProps({
  selectCategoryId: {
    type: String,
    default: "1",
  },
  tabs: {
    type: Array,
    default: [],
  },
});

const store = useStore();
const categories = ref([]);
const toggleArrow = ref(false);
const openCategoryId = ref([]);
const rotateStates = ref({});
const currentFavorite = ref({});
const favoriteadd = (data) => {
  currentFavorite.value[data] = !currentFavorite.value[data];
  store.dispatch("addFavoriteList", data);
};

const toggleCategory = (id) => {
  rotateStates.value[id] = !rotateStates.value[id];
  if (openCategoryId.value.includes(id)) {
    openCategoryId.value = openCategoryId.value.filter((item) => item !== id);
  } else {
    openCategoryId.value.push(id);
  }
  nextTick(() => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
};

var countShow = false;
const showAll = () => {
  countShow = !countShow;
  if (countShow) {
    for (let index = 0; index < categories.value.length; index++) {
      openCategoryId.value.push(categories.value[index].lngProgramSub);
    }
  } else {
    for (let index = 1; index <= categories.value.length; index++) {
      openCategoryId.value = [];
    }
  }
};
const isOpen = (id) => openCategoryId.value.includes(id);
const isMobile = ref(false);
const detectMobile = () => {
  const userAgent = window.navigator.userAgent;
  isMobile.value = /iPhone|iPad|iPod|Android/i.test(userAgent);
};
onMounted(() => {
  console.log(selectedCategoryId.value);

  cMenu = store.state.mainCategory
    .filter((item) => item.lngCode == selectedCategoryId.value)
    .map((item) => item.strTitle)[0];

  const subCategory = store.state.subCategory;
  const minorCategory = store.state.minorCategory;
  let category = [];

  category = subCategory.filter(
    (item) => item.lngCode == selectedCategoryId.value
  );
  category.forEach((element) => {
    const matchedMinorCategory = minorCategory.filter(
      (item) => item.lngProgramSub == element.lngProgramSub
    );
    element.subcategories = matchedMinorCategory;
  });

  categories.value = category;
  detectMobile();
  console.log(isMobile);

  router.push("/homepage");
});

watch(
  () => store.state.moveOtherTab,
  () => {
    if (store.state.moveOtherTab != "") {
      selectCategory(
        store.state.moveOtherTab.strUrl,
        store.state.moveOtherTab.lngProgramID,
        store.state.moveOtherTab.strTitle
      );
    }
    store.state.moveOtherTab = "";
  }
);
const tabs = ref([]);

watch(
  () => props.tabs,
  () => {
    tabs.value = props.tabs;
  }
);
const currentTab = ref();
const selectCategory = (strUrl, lngProgramID2, strTitle) => {
  if (tabs.value.length >= 10) {
    Swal.fire({
      title: "탭 제한",
      text: "최대 10개 탭까지 열 수 있습니다.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }
  currentTab.value = strTitle;

  const existingTab = tabs.value.find((tab) =>
    tab.lngProgramID.startsWith(lngProgramID2)
  );
  console.log(existingTab);
  if (existingTab) {
    Swal.fire({
      title: "메뉴 중복 안내",
      text: "선택 메뉴는 이미 열린 화면이 있습니다.기존 화면으로 이동하거나 새 화면으로 열 수 있습니다",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "기존 화면 이동",
      cancelButtonText: "새 화면 열기",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(lngProgramID2);
        console.log(tabs.value);
        const matchingTabs = tabs.value.filter((tab) =>
          tab.lngProgramID.startsWith(lngProgramID2)
        );
        const tab = { lngProgramID: matchingTabs[0].lngProgramID };
        emit("emittab", tabs.value);
        emit("activeTab", {
          strUrl: strUrl,
          lngProgramID: matchingTabs[0].lngProgramID,
          strTitle: strTitle,
        });
        router.push({
          path:
            "/" +
            matchingTabs[0].strUrl.split("::")[0] +
            "/" +
            matchingTabs[0].strUrl.split("::")[1],
          query: { index: tab.lngProgramID },
        });
      } else {
        const uuid = v4();
        const lngProgramIdv4 = lngProgramID2 + "_" + uuid;
        const newTab = { strUrl, lngProgramID: lngProgramIdv4, strTitle };
        emit("activeTab", newTab);
        tabs.value.push(newTab);
        router.push({
          path: "/" + strUrl.split("::")[0] + "/" + strUrl.split("::")[1],
          query: { index: lngProgramIdv4 },
        });
      }
    });
  } else {
    const uuid = v4();
    const lngProgramIdv4 = lngProgramID2 + "_" + uuid;
    console.log(lngProgramIdv4);
    const newTab = { strUrl, lngProgramID: lngProgramIdv4, strTitle };
    tabs.value.push(newTab);
    emit("emittab", tabs.value);
    emit("activeTab", newTab);
    router.push({
      path: "/" + strUrl.split("::")[0] + "/" + strUrl.split("::")[1],
      query: { index: lngProgramIdv4 },
    });
  }

  const matchingtab = categories.value
    .flatMap((item) => item.subcategories)
    .filter((sub) => sub.lngProgramID == lngProgramID2); // 조건 넣어서 필터

  console.log(matchingtab);
  //store.dispatch("saveActiveTab", matchingtab[0]);
};
var cMenu = ref("매출관리");
const selectedCategoryId = computed(() => store.state.selectedCategoryId);

watch(
  () => props.selectCategoryId,
  (newCategory) => {
    cMenu = store.state.mainCategory
      .filter((item) => item.lngCode == newCategory)
      .map((item) => item.strTitle)[0];

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
    console.log(categories.value);
  }
);
</script>
