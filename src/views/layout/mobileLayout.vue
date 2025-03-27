<template>
  <div class="h-screen overflow-y-auto" @click="resetScreen">
    <Loading></Loading>
    <Inactive></Inactive>
    <main class="h-screen overflow-y-auto bg-gray-100" ref="scrollContainer">
      <router-view v-slot="{ Component, route }" class="mt-12">
        <div
          class="flex flex-col gap-0 w-full items-center justify-center mr-0 h-auto mt-8"
          v-show="notice">
          <!-- <div class="flex justify-end w-full mr-4">
            <button class="text-3xl" @click="showNotice(false)">
              <font-awesome-icon icon="xmark" />
            </button>
          </div> -->
          <div class="absolute top-[50vh] flex justify-center items-center">
            공지사항이 없습니다.
          </div>
        </div>

        <div
          v-if="personal"
          class="h-[110%] w-auto items-center overflow-y-auto relative">
          <div
            class="flex flex-col h-full w-full space-y-3 justify-center items-center overflow-y-auto">
            <div
              v-for="(i, index) in salesMenus"
              @click="movePage(i.code, i.name)"
              class="text-xl mt-[5vh] text-nowrap w-[95vw] h-[10vh] flex justify-center items-center"
              :class="index % 2 == 1 ? 'bg-white' : 'bg-gray-200'">
              <button>{{ i.name }}</button>
            </div>
          </div>
        </div>

        <component
          v-show="!(notice || personal)"
          :is="Component"
          class="overflow-y-auto"
          id="content"></component>
      </router-view>
    </main>
  </div>
  <MobileTotalMenu
    v-show="showTotalMenu"
    @MenuState="MenuState"
    @SalesMenus="SalesMenus"></MobileTotalMenu>
  <MobileMenu
    ref="stickyElement"
    id="stickyElement"
    v-if="showMobileMenu"
    @showNotice="showNotice"
    @showpersonal="showpersonal"
    @showMenu3="showMenu3"
    @click.stop
    :changeIcon="changeIcon"
    :changeMenuState="showTotalMenu"
    :changeBottomMenu="changeBottomMenu"
    :class="{ hidden: !isStickyVisible }"></MobileMenu>
</template>

<script setup>
import Inactive from "@/components/inactive.vue";
import Loading from "@/components/loading.vue";
import MobileMenu from "@/components/MenuComponent/mobileMenu.vue";
import router from "@/router";
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import MobileTotalMenu from "../MOBILE/component/mobileTotalMenu.vue";

const notice = ref(false);
const isMenu2 = ref(false);
const personal = ref(false);
const showMobileMenu = ref(true);
const clickthismenu = ref([]);
const route = useRoute();

const salesMenus = ref([]);
const SalesMenus = (e) => {
  console.log(e);
  salesMenus.value = e;
};
const MenuState = (e) => {
  showTotalMenu.value = e;
  notice.value = e;
  personal.value = e;
};
const showNotice = (value) => {
  notice.value = value;
};
const showpersonal = (value) => {
  personal.value = value;
};

const showTotalMenu = ref(false);
const showMenu3 = (e) => {
  console.log(e);
  if (e == true) {
    showTotalMenu.value = true;
    store.state.inActiveBackGround = true;
  } else {
    showTotalMenu.value = false;
    store.state.inActiveBackGround = false;
  }
};

const resetScreen = (e) => {
  showTotalMenu.value = false;
  store.state.inActiveBackGround = false;
};

const goRouter = (value) => {
  switch (value) {
    case 2:
      router.push("/m/MISALES/SLS06_003RPT.xml");
      break;

    case 3:
      router.push("/m/MISALES/SLS06_004RPT.xml");
      break;

    case 4:
      router.push("/m/MISALES/SLS06_005RPT.xml");
      break;

    default:
      break;
  }

  personal.value = false;
  isMenu.value = false;
};
const showsubMenu = (value) => {
  const index = clickthismenu.value.indexOf(value);
  if (index == -1) {
    clickthismenu.value.push(value);
  } else {
    clickthismenu.value.splice(index, 1);
  }
};
const showornotsubMenu = (value) => {
  return clickthismenu.value.includes(value);
};
const store = useStore();
const categories = ref([]);
const selectedCategoryId = computed(() => store.state.selectedCategoryId);

const mainCategoryList = computed(() => store.state.mainCategory);
const subCategoryList = computed(() => store.state.subCategory);
const minorCategoryList = computed(() => store.state.minorCategory);

const hierarchicalCategories = computed(() => {
  return mainCategoryList.value.map((main) => {
    const subCategories = subCategoryList.value
      .filter((sub) => sub.lngCode === main.lngCode)
      .map((sub) => {
        const minorCategories = minorCategoryList.value.filter(
          (minor) =>
            minor.lngCode === sub.lngCode &&
            minor.lngProgramSub == sub.lngProgramSub
        );
        return { ...sub, minorCategories };
      });

    return { ...main, subCategories };
  });
});
watch(selectedCategoryId, (newCategory) => {
  // cMenu= store.state.mainCategory.filter(item => item.lngCode == newCategory).map(item=> item.strTitle)[0];

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
  console.log(hierarchicalCategories.value);
});
const activeCategory = ref([]);
const activesubCategory = ref([]);

// watch(
//   () => route.path,
//   (newPath) => {
//     showMobileMenu.value = newPath !== "/"; // Update based on new route
//   }
// );

const logout = () => {
  store.replaceState({
    userData: [], // 사용자 데이터를 저장할 상태
    selectedCategoryId: null,
    currentTabs: [],
    activeTab: "",
    mainCategory: [],
    subCategory: [],
    minorCategory: [],
    storeGroup: [],
    storeType: [],
    storeCd: [],
  });
  //localStorage.clear();
  // sessionStorage.clear();
  window.location.href = "/";
};

const isStickyVisible = ref(true); // 요소가 화면에 보이는지 여부
const stickyElement = ref(null);

const changeBottomMenu = ref(true);

const lastScrollY = ref(0); // 마지막 스크롤 위치
const scrollContainer = ref(null);
const handleScroll = () => {
  if (scrollContainer.value.scrollTop > lastScrollY.value) {
    // 아래로 스크롤하면 메뉴 숨기기
    changeBottomMenu.value = false;
  } else {
    // 위로 스크롤하면 메뉴 보이기
    changeBottomMenu.value = true;
  }
  lastScrollY.value = scrollContainer.value.scrollTop;
};

onMounted(() => {
  if (scrollContainer.value) {
    scrollContainer.value.addEventListener("scroll", handleScroll); // 스크롤 컨테이너에 이벤트 등록
    lastScrollY.value = scrollContainer.value.scrollTop;
  }
});

onBeforeUnmount(() => {
  if (scrollContainer.value) {
    scrollContainer.value.removeEventListener("scroll", handleScroll);
  }
});

// 컴포넌트가 마운트될 때 IntersectionObserver 설정
// onMounted(() => {
//   nextTick(() => {
//     if (stickyElement.value) {
//       const observer = new IntersectionObserver(handleIntersection, {
//         root: null, // 뷰포트를 기준으로 검사
//         threshold: 0, // 요소가 0%라도 보이면 callback 실행
//       });
//       console.log(stickyElement.value)
//       observer.observe(stickyElement.value);

//       // 컴포넌트가 언마운트될 때 observer 해제
//       onBeforeUnmount(() => {
//         observer.disconnect();
//       });
//     } else {
//       console.error('stickyElement is null');
//     }
//   });
// });

const changeIcon = ref(false);
const movePage = (e, e2) => {
  console.log(`/m/${e}`);
  store.state.mobileSelectProgName = e2;
  changeIcon.value = !changeIcon.value;
  personal.value = false;
  notice.value = false;
  router.push(`/m/${e}`);
};
</script>

<style lang="scss" scoped></style>
