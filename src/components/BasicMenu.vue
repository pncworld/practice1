<template>
  <div class="bg-gray-100 text-gray-600 w-full scroll-container h-full m-0">
    <div class="">
      <h1 class="flex text-2xl font-bold h-12 items-center bg-gray-100 p-5">
        {{ cMenu }}
      </h1>

      <div class="flex h-14 bg-white">
        <input
          type="text"
          class="rounded-2xl bg-transparent border border-solid placeholder-opacity-30 y-3 mx-2 my-2 px-3"
          style="height: 39px; width: 190px; border-radius: 19px"
          v-model="searchword"
          @input="setProgramList"
          placeholder="검색어입력" />
        <!-- <img
            src="../assets/finder_icon.svg"
            class="inline-block w-9"
            @click="setProgramList"
            alt="" /> -->
      </div>
      <div class="flex justify-between bg-gray-100">
        <label class="bg-gray-100">
          <div class="flex justify-start bg-gray-100 h-8 items-center">
            <input
              type="checkbox"
              @click="showAll"
              class="ml-3"
              :value="true"
              v-model="countShow" />전체
          </div>
        </label>
        <button
          class="mr-7 mt-1 text-black flex size-6 items-center justify-center"
          @click.stop="showFavorite">
          <img
            src="../../src/assets/table_star.svg"
            alt="Star"
            v-show="!clickFavorite" />
          <img
            v-show="clickFavorite"
            src="../assets/table_star-checked.svg"
            alt="" />
          즐겨찾기
        </button>
      </div>
      <ul>
        <li
          v-for="i in favoriteProgList"
          v-if="clickFavorite"
          class="bg-gray-100 overflow-y-auto">
          <div class="flex ml-4">
            <button
              @click="favoriteadd(i.lngProgramID)"
              v-if="!currentFavorite.includes(i.lngProgramID)">
              <img src="../assets/table_star.svg" alt="" />
            </button>
            <button
              @click="favoritedelete(i.lngProgramID)"
              v-if="currentFavorite.includes(i.lngProgramID)">
              <img src="../assets/table_star-checked.svg" alt="" />
            </button>
            <button
              class="w-full h-10 text-left px-2 text-gray-900 rounded-lg hover:bg-blue-100 focus:outline-none flex items-center justify-between"
              @click="selectCategory(i.strUrl, i.lngProgramID, i.strTitle)">
              {{ i.strTitle }}
            </button>
          </div>
        </li>
      </ul>
      <ul>
        <li
          v-if="!clickFavorite"
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
                <button
                  @click="favoriteadd(sub.lngProgramID)"
                  v-if="!currentFavorite.includes(sub.lngProgramID)">
                  <img src="../assets/table_star.svg" alt="" />
                </button>
                <button
                  @click="favoritedelete(sub.lngProgramID)"
                  v-if="currentFavorite.includes(sub.lngProgramID)">
                  <img src="../assets/table_star-checked.svg" alt="" /></button
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
import { addFavorite, deleteFavorite } from "@/api/common";
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
  triggerNow: {
    type: Boolean,
    default: false,
  },
});

const store = useStore();
const clickFavorite = ref(false);
const favoriteProgList = ref([]);
const showFavorite = () => {
  clickFavorite.value = !clickFavorite.value;
  //currentFavorite.value;

  //comsole.log(store.state.minorCategory);
  favoriteProgList.value = store.state.minorCategory.filter((item) =>
    currentFavorite.value.includes(item.lngProgramID)
  );

  if (clickFavorite.value) {
    cMenu = "즐겨찾기";
  } else {
    cMenu = store.state.mainCategory
      .filter((item) => item.lngCode == props.selectCategoryId)
      .map((item) => item.strTitle)[0];
  }
};

watch(
  () => store.state.favoriteList,
  () => {
    currentFavorite.value = [...store.state.favoriteList];
    favoriteProgList.value = store.state.minorCategory.filter((item) =>
      currentFavorite.value.includes(item.lngProgramID)
    );
  }
);

const setProgramList = (e) => {
  //comsole.log(e.target.value);

  cMenu = store.state.mainCategory
    .filter((item) => item.lngCode == props.selectCategoryId)
    .map((item) => item.strTitle)[0];

  const subCategory = store.state.subCategory;
  const minorCategory = store.state.minorCategory;
  let category = [];

  category = subCategory.filter(
    (item) => item.lngCode == props.selectCategoryId
  );
  category.forEach((element) => {
    const matchedMinorCategory = minorCategory.filter(
      (item) => item.lngProgramSub == element.lngProgramSub
    );
    element.subcategories = matchedMinorCategory;
  });

  categories.value = category;
  if (e.target.value == "") {
    searchword.value = "";
    openCategoryId.value = [];
    showAll();
    return;
  } else {
    //comsole.log(categories.value);
    categories.value.forEach((item) => {
      item.subcategories = item.subcategories.filter((subitem) =>
        subitem.strProgramName.includes(e.target.value)
      );
    });

    categories.value = categories.value.filter(
      (item) => item.subcategories.length !== 0
    );
    showAll2();
  }
};

const searchword = ref("");
const categories = ref([]);
const toggleArrow = ref(false);
const openCategoryId = ref([]);
const rotateStates = ref({});
const currentFavorite = ref([]);
const favoriteadd = async (data) => {
  currentFavorite.value = [...currentFavorite.value, data];
  store.dispatch("setFavoriteList", currentFavorite.value);
  const res = await addFavorite(data, store.state.userData.loginID);
};
const favoritedelete = async (data) => {
  currentFavorite.value = currentFavorite.value.filter((item) => item !== data);
  store.dispatch("setFavoriteList", currentFavorite.value);
  const res = await deleteFavorite(data, store.state.userData.loginID);
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

const countShow = ref(false);
const showAll = () => {
  countShow.value = !countShow.value;
  if (countShow.value) {
    for (let index = 0; index < categories.value.length; index++) {
      openCategoryId.value.push(categories.value[index].lngProgramSub);
    }
  } else {
    for (let index = 1; index <= categories.value.length; index++) {
      openCategoryId.value = [];
    }
  }
};
const showAll2 = () => {
  countShow.value = true;
  if (countShow.value) {
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
  currentFavorite.value = [];
  currentFavorite.value = [...store.state.favoriteList];

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
  //comsole.log(categories.value);
  detectMobile();
  //comsole.log(isMobile);

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
  //comsole.log(strUrl, lngProgramID2, strTitle);
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
  //comsole.log(existingTab);
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
        //comsole.log(lngProgramID2);
        //comsole.log(tabs.value);
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
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        const uuid = v4();
        const lngProgramIdv4 = lngProgramID2 + "_" + uuid;
        const newTab = { strUrl, lngProgramID: lngProgramIdv4, strTitle };

        emit("activeTab", newTab);
        tabs.value.push(newTab);
        emit("emittab", tabs.value);
        router.push({
          path: "/" + strUrl.split("::")[0] + "/" + strUrl.split("::")[1],
          query: { index: lngProgramIdv4 },
        });
      } else {
        return;
      }
    });
  } else {
    const uuid = v4();
    const lngProgramIdv4 = lngProgramID2 + "_" + uuid;
    //comsole.log(lngProgramIdv4);
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

  //comsole.log(matchingtab);
  //store.dispatch("saveActiveTab", matchingtab[0]);
};
var cMenu = ref("매출관리");
const selectedCategoryId = computed(() => store.state.selectedCategoryId);

watch(
  () => [props.selectCategoryId, props.triggerNow],
  (newCategory) => {
    clickFavorite.value = false;
    searchword.value = "";
    openCategoryId.value = [];
    cMenu = store.state.mainCategory
      .filter((item) => item.lngCode == props.selectCategoryId)
      .map((item) => item.strTitle)[0];

    const subCategory = store.state.subCategory;
    const minorCategory = store.state.minorCategory;
    let category = [];

    category = subCategory.filter(
      (item) => item.lngCode == props.selectCategoryId
    );
    category.forEach((element) => {
      const matchedMinorCategory = minorCategory.filter(
        (item) => item.lngProgramSub == element.lngProgramSub
      );
      element.subcategories = matchedMinorCategory;
    });

    categories.value = category;
    //comsole.log(categories.value);
  }
);
</script>
<style scoped>
.scroll-container {
  overflow-y: auto;
  scrollbar-gutter: stable;
}
</style>
