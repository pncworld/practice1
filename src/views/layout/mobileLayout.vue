/*--############################################################################
# Filename : MST01_033INS.vue                                                  
# Description : 마스터관리 > 메뉴 마스터 > 메뉴코드등록                        
# Date :2025-05-14                                                             
# Author : 권맑음                     
################################################################################*/
<template>
  <div
    class="h-screen overflow-y-auto"
    @click="resetScreen"
    ref="scrollContainer3">
    <loading></loading>
    <Loading2></Loading2>
    <Inactive></Inactive>
    <main
      class="h-screen overflow-y-auto bg-slate-50"
      ref="scrollContainer"
      v-show="!(notice || personal || order)">
      <router-view v-slot="{ Component, route }" class="mt-1">
        <component
          :is="Component"
          class="overflow-y-auto"
          id="content"></component>
      </router-view>
    </main>
    <div class="m-panel" v-show="notice">
      <div
        v-show="!showDetailNotice"
        @scroll="handleScroll2"
        ref="scrollArea"
        class="overflow-y-auto">
        <div class="m-empty" v-if="blnNoticeList">공지사항이 없습니다.</div>

        <div class="m-list" v-if="!blnNoticeList">
          <div
            v-for="I in notices"
            :key="I.NOTICE_ID"
            @click="showNoticeDetail(I.NOTICE_ID)"
            :class="I.READ_YN == 1 ? 'is-read' : ''"
            class="m-notice">
            <div class="m-notice-title">
              <span v-if="I.IMPORTANT_YN == '1'" class="m-badge">중요</span>
              <span>{{ I.TITLE_NM }}</span>
            </div>
            <div class="m-notice-meta">{{ I.WRITER_NM }}</div>
            <div class="m-notice-sub">
              {{ I.WRITE_DT }} · 조회 {{ I.READ_CNT }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="personal" class="m-panel">
      <div class="m-list">
        <button
          v-for="(i, index) in salesMenus"
          :key="i.code || index"
          type="button"
          class="m-menu"
          @click="movePage(i.code, i.name)">
          <span>{{ i.name }}</span>
          <font-awesome-icon :icon="['fas', 'chevron-right']" />
        </button>
      </div>
    </div>
    <div v-if="order" class="m-panel">
      <div class="m-list">
        <button
          v-for="(i, index) in orderMenus"
          :key="i.code || index"
          type="button"
          class="m-menu"
          @click="movePage(i.code, i.name)">
          <span>{{ i.name }}</span>
          <font-awesome-icon :icon="['fas', 'chevron-right']" />
        </button>
      </div>
    </div>
    <div v-if="showDetailNotice" class="m-detail">
      <h1>{{ DetailNotice.TITLE_NM }}</h1>
      <div class="m-detail-meta">
        <div>작성자 {{ DetailNotice.WRITER_NM }}</div>
        <div class="m-detail-row">
          <span>{{ DetailNotice.WRITE_DT }} · 조회 {{ DetailNotice.READ_CNT }}</span>
          <button type="button" @click="downloadFile">
            첨부 {{ downloadFileLeng }}
          </button>
        </div>
      </div>
      <div class="m-detail-body">
        <div v-html="DetailNotice.NOTICE_CT"></div>
      </div>
    </div>
  </div>
  <MobileTotalMenu
    v-show="showTotalMenu"
    @MenuState="MenuState"
    @showNotice="showNotice2"
    @SalesMenus="SalesMenus"
    @OrderMenus="OrderMenus"></MobileTotalMenu>
  <MobileMenu
    ref="stickyElement"
    id="stickyElement"
    v-if="showMobileMenu"
    @showNotice="showNotice"
    @showpersonal="showpersonal"
    @showorder="showorder"
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
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";
import MobileTotalMenu from "../MOBILE/component/mobileTotalMenu.vue";
import { getNoticeDetail, getNoticeList } from "@/api/mobile";
import { insertMobilePageLog } from "@/customFunc/customFunc";
const store = useStore();

const notice = ref(false);
const isMenu2 = ref(false);
const personal = ref(false);
const order = ref(false);
const showMobileMenu = ref(true);
const clickthismenu = ref([]);
const route = useRoute();
const blnNoticeList = ref(true);
const salesMenus = ref([]);
const orderMenus = ref([]);
const SalesMenus = (e) => {
  //comsole.log(e);
  salesMenus.value = e;
};
const OrderMenus = (e) => {
  orderMenus.value = e;
};

const changeMenuState = ref(false);
const MenuState = (e) => {
  showTotalMenu.value = e;
  notice.value = e;
  personal.value = e;
  order.value = e;
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
const showorder = (value) => {
  order.value = value;
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
/**
 *  그리드 검색어 세팅
 */

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
/**
 * 	화면 Load시 실행 스크립트
 */

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

const changeSalesIconState = ref(true);
const changeIcon = ref(0);
const movePage = async (e, e2) => {
  //comsole.log(e2);
  //store.state.mobileSelectProgName = e2;

  const checkSession = await insertMobilePageLog({
    strUrl: e2,
    lngProgramID: e,
  });

  store.dispatch("saveMobileProgName", e2);
  changeIcon.value = 0;
  personal.value = false;
  order.value = false;
  changeSalesIconState.value = !changeSalesIconState.value;
  notice.value = false;
  router.push(`/m/${e}`);
};
</script>

<style scoped>
.m-panel {
  min-height: 100%;
  padding: 4.2rem 0.75rem 5.5rem;
  background: #f8fafc;
}

.m-empty {
  padding: 4rem 1rem;
  text-align: center;
  font-size: 0.875rem;
  color: #94a3b8;
}

.m-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.m-notice,
.m-menu {
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  background: #fff;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
}

.m-notice {
  padding: 0.9rem 1rem;
  text-align: left;
}

.m-notice.is-read {
  opacity: 0.55;
}

.m-notice-title {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.95rem;
  font-weight: 700;
  color: #0f172a;
}

.m-badge {
  flex-shrink: 0;
  padding: 0.05rem 0.4rem;
  border-radius: 999px;
  background: #ef4444;
  color: #fff;
  font-size: 0.65rem;
}

.m-notice-meta {
  margin-top: 0.35rem;
  font-size: 0.75rem;
  color: #64748b;
}

.m-notice-sub {
  margin-top: 0.15rem;
  font-size: 0.7rem;
  color: #94a3b8;
}

.m-menu {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.95rem 1rem;
  color: #1e293b;
  font-size: 0.95rem;
  font-weight: 600;
  text-align: left;
}

.m-menu svg {
  color: #cbd5e1;
  font-size: 0.75rem;
}

.m-detail {
  min-height: 100%;
  padding: 4.2rem 0 5.5rem;
  background: #f8fafc;
}

.m-detail h1 {
  padding: 0.25rem 1.1rem 0.6rem;
  font-size: 1.25rem;
  font-weight: 800;
  color: #0f172a;
  text-align: left;
}

.m-detail-meta {
  padding: 0 1.1rem 0.9rem;
  font-size: 0.8rem;
  color: #64748b;
  text-align: left;
}

.m-detail-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.25rem;
}

.m-detail-row button {
  color: #3b82f6;
  font-weight: 700;
}

.m-detail-body {
  min-height: 24rem;
  margin: 0 0.75rem;
  padding: 1rem;
  border-radius: 1rem;
  background: #fff;
  color: #334155;
  text-align: left;
  white-space: pre-line;
}
</style>
