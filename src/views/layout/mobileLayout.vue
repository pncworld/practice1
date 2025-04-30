<template>
  <div
    class="h-screen overflow-y-auto"
    @click="resetScreen"
    ref="scrollContainer3">
    <loading></loading>
    <Loading2></Loading2>
    <Inactive></Inactive>
    <main
      class="h-screen overflow-y-auto bg-gray-100"
      ref="scrollContainer"
      v-show="!(notice || personal)">
      <router-view v-slot="{ Component, route }" class="mt-1">
        <component
          :is="Component"
          class="overflow-y-auto"
          id="content"></component>
      </router-view>
    </main>
    <div
      class="flex flex-col gap-0 w-full items-center justify-center mr-0 h-auto mt-10"
      v-show="notice">
      <!-- <div class="flex justify-end w-full mr-4">
            <button class="text-3xl" @click="showNotice(false)">
              <font-awesome-icon icon="xmark" />
            </button>
          </div> -->
      <div
        v-show="!showDetailNotice"
        @scroll="handleScroll2"
        ref="scrollArea"
        class="overflow-y-auto">
        <div
          class="absolute top-[20vh] left-[35vw] flex justify-center items-center w-auto"
          v-if="blnNoticeList">
          공지사항이 없습니다.
        </div>

        <div class="p-2 space-y-2" v-if="!blnNoticeList">
          <div
            v-for="I in notices"
            @click="showNoticeDetail(I.NOTICE_ID)"
            :class="I.READ_YN == 1 ? 'opacity-50' : ''"
            class="bg-white shadow-md rounded-2xl p-2 border border-gray-100">
            <h5
              class="text-lg text-gray-800 mb-2 text-left flex justify-between"></h5>
            <h2
              class="text-lg font-semibold text-gray-800 mb-2 flex justify-center">
              <div class="bg-red-600 text-white rounded-lg">
                {{ I.IMPORTANT_YN == "1" ? "중요" : "" }}
              </div>
              <div>{{ I.TITLE_NM }}</div>
            </h2>
            <p class="text-sm text-gray-600 line-clamp-2 text-right">
              작성자 : {{ I.WRITER_NM }}
            </p>
            <div class="text-xs text-gray-400 mt-2 text-right">
              {{ I.WRITE_DT }} / 조회수 : {{ I.READ_CNT }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="personal" class="h-[120%] w-full items-center relative">
      <div
        class="flex flex-col h-full w-full space-y-3 justify-center items-center mt-[10%]">
        <div
          v-for="(i, index) in salesMenus"
          @click="movePage(i.code, i.name)"
          class="text-xl text-nowrap w-[95vw] h-[10%] flex justify-center items-center border"
          :class="index % 2 == 1 ? 'bg-white' : 'bg-gray-200'">
          <button>{{ i.name }}</button>
        </div>
      </div>
    </div>
    <div v-if="showDetailNotice" class="h-full">
      <div class="min-h-screen bg-gray-50">
        <!-- 제목 -->
        <h1 class="text-2xl font-bold text-gray-900 mb-4 text-left pl-5 pt-5">
          {{ DetailNotice.TITLE_NM }}
        </h1>

        <!-- 작성 정보 -->
        <div
          class="text-sm text-gray-500 mb-6 flex flex-col space-y-1 text-left pl-5">
          <div><strong>작성자:</strong> {{ DetailNotice.WRITER_NM }}</div>
          <div class="flex w-full items-center">
            <strong>작성일:</strong> {{ DetailNotice.WRITE_DT }}
            <span class="mx-2">|</span>
            <strong>조회수:</strong> {{ DetailNotice.READ_CNT }}
            <button class="text-blue-500 ml-auto mr-5" @click="downloadFile">
              첨부파일({{ downloadFileLeng }})
            </button>
          </div>
        </div>

        <!-- 본문 -->
        <div
          class="bg-white rounded-xl shadow-sm text-gray-800 whitespace-pre-line h-full w-full min-h-[500px]">
          <div v-html="DetailNotice.NOTICE_CT" class="h-full text-left"></div>
        </div>
      </div>
    </div>
  </div>
  <MobileTotalMenu
    v-show="showTotalMenu"
    @MenuState="MenuState"
    @showNotice="showNotice2"
    @SalesMenus="SalesMenus"></MobileTotalMenu>
  <MobileMenu
    ref="stickyElement"
    id="stickyElement"
    v-if="showMobileMenu"
    @showNotice="showNotice"
    @showpersonal="showpersonal"
    @showMenu3="showMenu3"
    @changeIconValue="changeIconValue"
    @searchword="searchword"
    @searchNow="searchNow"
    @reSearch="reSearch"
    @click.stop
    :changeIcon="changeIcon"
    :changeSalesIconState="changeSalesIconState"
    :changeMenuState="changeMenuState"
    :changeBottomMenu="changeBottomMenu"
    :class="{ hidden: !isStickyVisible }"></MobileMenu>
</template>

<script setup>
import Inactive from "@/components/inactive.vue";
import Loading from "@/components/loading.vue";
import Loading2 from "@/components/loading2.vue";
import MobileMenu from "@/components/MenuComponent/mobileMenu.vue";
import router from "@/router";
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import MobileTotalMenu from "../MOBILE/component/mobileTotalMenu.vue";
import { getNoticeDetail, getNoticeList } from "@/api/mobile";
const store = useStore();

const notice = ref(false);
const isMenu2 = ref(false);
const personal = ref(false);
const showMobileMenu = ref(true);
const clickthismenu = ref([]);
const route = useRoute();
const blnNoticeList = ref(true);
const salesMenus = ref([]);
const SalesMenus = (e) => {
  //comsole.log(e);
  salesMenus.value = e;
};

const changeMenuState = ref(false);
const MenuState = (e) => {
  showTotalMenu.value = e;
  notice.value = e;
  personal.value = e;
};
const showNotice = async (value) => {
  notice.value = value;
  showDetailNotice.value = false;

  pageIndex.value = 0;
  const res = await getNoticeList(
    store.state.userData.GROUP_CD,
    store.state.userData.STORE_CD,
    store.state.userData.USER_NO,
    pageIndex.value,
    pageIndex2.value,
    0,
    ""
  );

  //comsole.log(res);
  if (res.data.List.length == 0) {
    blnNoticeList.value = true;
  } else {
    blnNoticeList.value = false;
  }
  notices.value = res.data.List;
};

const showNotice2 = (e) => {
  notice.value = e;
  showDetailNotice.value = false;
};
const showpersonal = (value) => {
  personal.value = value;
};

const showTotalMenu = ref(false);
const showMenu3 = (e) => {
  //comsole.log(e);
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

// const goRouter = (value) => {
//   switch (value) {
//     case 2:
//       router.push("/m/MISALES/SLS06_003RPT.xml");
//       break;

//     case 3:
//       router.push("/m/MISALES/SLS06_004RPT.xml");
//       break;

//     case 4:
//       router.push("/m/MISALES/SLS06_005RPT.xml");
//       break;

//     default:
//       break;
//   }

//   personal.value = false;
//   isMenu.value = false;
// };

watch(notice, async () => {
  //comsole.log(store.state.userData);
  if (notice.value == true) {
    const res = await getNoticeList(
      store.state.userData.GROUP_CD,
      store.state.userData.STORE_CD,
      store.state.userData.USER_NO,
      pageIndex.value,
      pageIndex2.value,
      0,
      ""
    );

    //comsole.log(res);
    if (res.data.List.length == 0) {
      blnNoticeList.value = true;
    } else {
      blnNoticeList.value = false;
    }
    notices.value = res.data.List;
  }
});

const changeIconValue = (e) => {
  changeIcon.value = e;
};
// const showsubMenu = (value) => {
//   const index = clickthismenu.value.indexOf(value);
//   if (index == -1) {
//     clickthismenu.value.push(value);
//   } else {
//     clickthismenu.value.splice(index, 1);
//   }
// };
// const showornotsubMenu = (value) => {
//   return clickthismenu.value.includes(value);
// };
const pageIndex = ref(0);
const pageIndex2 = ref(15);
const DetailNotice = ref([]);
const showDetailNotice = ref(false);
const downloadFileUrl = ref("");
const downloadFileName = ref("");
const downloadFileLeng = ref(0);
const showNoticeDetail = async (e) => {
  showDetailNotice.value = true;
  changeIcon.value = 4;

  const res = await getNoticeDetail(
    store.state.userData.GROUP_CD,
    store.state.userData.STORE_CD,
    store.state.userData.USER_NO,
    e
  );
  DetailNotice.value = res.data.List[0];
  if (res.data.List2.length > 0) {
    downloadFileLeng.value = res.data.List2.length;
    downloadFileUrl.value = res.data.List2[0].FILE_URL;
    downloadFileName.value = res.data.List2[0].FILE_NM;
  } else {
    downloadFileLeng.value = 0;
    downloadFileUrl.value = "";
    downloadFileName.value = "";
  }

  //comsole.log(res);
  scrollContainer3.value.scrollTop = 0;
};

const downloadFile = async () => {
  if (downloadFileLeng.value > 0) {
    const response = await fetch(downloadFileUrl.value, {
      method: "GET",
      // headers: { Authorization: 'Bearer xxx' } // 필요하면 추가
    });
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = downloadFileName.value;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  }
};
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
  //comsole.log(hierarchicalCategories.value);
});
const activeCategory = ref([]);
const activesubCategory = ref([]);

// watch(
//   () => route.path,
//   (newPath) => {
//     showMobileMenu.value = newPath !== "/"; // Update based on new route
//   }
// );

const isStickyVisible = ref(true); // 요소가 화면에 보이는지 여부
const stickyElement = ref(null);

const changeBottomMenu = ref(true);

const lastScrollY = ref(0); // 마지막 스크롤 위치
const lastScrollY3 = ref(0); // 마지막 스크롤 위치
const scrollContainer = ref(null);
const scrollContainer3 = ref(null);

const scrollArea = ref(null);

// const handleScroll2 = () => {
//   const el = scrollArea.value;
//   const threshold = 10; // 10px 여유 두고 바닥 처리

//   if (el.scrollTop + el.clientHeight >= el.scrollHeight - threshold) {
//     //comsole.log("⬇ 바닥에 도달했어요!");
//     // 여기에 API 더 불러오거나 알림 띄우거나 원하는 액션 실행
//   }
// };

const handleScroll2 = () => {
  if (scrollArea.value.scrollTop > lastScrollY.value) {
    // 아래로 스크롤하면 메뉴 숨기기
  } else {
    // 위로 스크롤하면 메뉴 보이기
  }

  lastScrollY.value = scrollArea.value.scrollTop;
};

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
const handleScroll3 = async (e) => {
  const target = scrollContainer3.value;
  const scrollTop = target.scrollTop; // 현재 스크롤 위치
  const scrollHeight = target.scrollHeight; // 전체 스크롤 높이
  const clientHeight = target.clientHeight; // 보이는 영역 높이

  if (scrollTop + clientHeight >= scrollHeight - 1) {
    pageIndex.value = pageIndex.value + 1;
    //pageIndex2.value = pageIndex2.value + 15;
    const res = await getNoticeList(
      store.state.userData.GROUP_CD,
      store.state.userData.STORE_CD,
      store.state.userData.USER_NO,
      pageIndex.value,
      pageIndex2.value,
      searchNotice.value == "" ? 0 : 1,
      searchNotice.value
    );

    notices.value.push(...res.data.List);
  }

  if (scrollContainer3.value.scrollTop > lastScrollY3.value) {
    // 아래로 스크롤하면 메뉴 숨기기
    changeBottomMenu.value = false;
  } else {
    // 위로 스크롤하면 메뉴 보이기
    changeBottomMenu.value = true;
  }

  lastScrollY3.value = scrollContainer3.value.scrollTop;
};

const searchNotice = ref("");
const searchword = (e) => {
  searchNotice.value = e;
};

const searchNow = async (e) => {
  pageIndex.value = 0;
  pageIndex2.value = 15;
  //comsole.log(searchNotice.value);
  const res = await getNoticeList(
    store.state.userData.GROUP_CD,
    store.state.userData.STORE_CD,
    store.state.userData.USER_NO,
    pageIndex.value,
    pageIndex2.value,
    searchNotice.value == "" ? 0 : 1,
    searchNotice.value
  );
  //comsole.log(res);
  notices.value = res.data.List;
};
const notices = ref([]);
onMounted(async () => {
  if (scrollContainer.value) {
    scrollContainer.value.addEventListener("scroll", handleScroll); // 스크롤 컨테이너에 이벤트 등록
    lastScrollY.value = scrollContainer.value.scrollTop;
  }
  if (scrollContainer3.value) {
    scrollContainer3.value.addEventListener("scroll", handleScroll3); // 스크롤 컨테이너에 이벤트 등록
    lastScrollY3.value = scrollContainer3.value.scrollTop;
  }
  if (scrollArea.value) {
    scrollArea.value.addEventListener("scroll", handleScroll2); // 스크롤 컨테이너에 이벤트 등록
    lastScrollY3.value = scrollArea.value.scrollTop;
  }

  store.state.inActiveBackGround = false;
});

onBeforeUnmount(() => {
  if (scrollContainer.value) {
    scrollContainer.value.removeEventListener("scroll", handleScroll);
  }
  if (scrollContainer3.value) {
    scrollContainer3.value.removeEventListener("scroll", handleScroll3);
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
//       //comsole.log(stickyElement.value)
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

const changeSalesIconState = ref(true);
const changeIcon = ref(0);
const movePage = (e, e2) => {
  //comsole.log(e2);
  //store.state.mobileSelectProgName = e2;
  store.dispatch("saveMobileProgName", e2);
  changeIcon.value = 0;
  personal.value = false;
  changeSalesIconState.value = !changeSalesIconState.value;
  notice.value = false;
  router.push(`/m/${e}`);
};
</script>

<style lang="scss" scoped></style>
