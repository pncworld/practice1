<template>
  <!-- 좌측 메뉴 / 퍼블리셔 마크업 기반 -->
  <aside class="w-left sidemenu">
    <!-- 사용자 정보 -->
    <div class="pd20 user-info">
      <div class="flex f13 fc-white bd-white-20 br50 items-center inner">
        <span class="flex-center bg-black-50 br50p user-icon">
          <img src="../assets/images/ic_user.png">
        </span>
        <span class="user-id">{{ loginName }}</span>
        <span class="user-store">
          {{ storeName }} ({{ lStoreCd }})
        </span>
      </div>
      <button class="btn-sidemenu-toggle" type="button">
        <span></span>
      </button>
      <button class="btn-sidemenu-close" type="button" @click="closeSidemenu" title="사이드메뉴 닫기">
        <i class="ico ico-close"></i>
      </button>
    </div>

    <!-- 검색 -->
    <div class="search-box">
      <input
        type="text"
        class="search-input"
        placeholder="검색어를 입력해주세요"
        v-model="searchword"
        @input="setProgramList"
      >
      <button class="search-btn"></button>
    </div>

    <!-- 상단 페이지 타이틀 -->
    <div class="menu-header">
      <div class="f30 fw700 fc-000 flex-center menu-title-main">
        {{ cMenu }}
      </div>
    </div>

    <!-- 메뉴 / 즐겨찾기 탭 (UI는 jQuery가 active 제어) -->
    <div class="flex items-center menu-top">
      <div class="menu-tab active">
        <span class="ico-menu"></span>
        <span class="label">메뉴</span>
      </div>
      <div class="menu-favorite">
        <span class="ico-star-off"></span>
        <span class="label">즐겨찾기</span>
      </div>
    </div>

    <!-- 전체 열기 (동작은 jQuery, 데이터 필터는 Vue) -->
    <div class="pd20 flex menu-toggle">
      <span class="f14 fw500 label toggle-text">전체 열기</span>
      <label class="toggle-wrap">
        <input type="checkbox" id="toggleAll">
        <span class="toggle-ui"></span>
      </label>
    </div>

    <!-- 메뉴 그룹 -->
    <div class="pd20 pt0 menu-group">
      <div
        class="menu-section"
        v-for="category in categories"
        :key="category.lngProgramSub"
      >
        <div class="menu-section-head">
          <div class="menu-section-title">
            <span class="ico-folder"></span>
            {{ category.strTitle }}
          </div>
          <button class="btn-collapse"></button>
        </div>

        <ul class="menu-list">
          <li
            v-for="sub in category.subcategories"
            :key="sub.lngProgramID"
          >
            <a
              href="#"
              @click.prevent="
                selectCategory(sub.strUrl, sub.lngProgramID, sub.strTitle)
              "
            >
              <div class="menu-list-title">
                <button
                  class="btn-star"
                  :class="{ active: currentFavorite.includes(sub.lngProgramID) }"
                  aria-label="즐겨찾기 추가/해제"
                  @click.stop="
                    currentFavorite.includes(sub.lngProgramID)
                      ? favoritedelete(sub.lngProgramID)
                      : favoriteadd(sub.lngProgramID)
                  "
                ></button>
                {{ sub.strTitle }}
              </div>
              <span class="ico-arrow"></span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </aside>
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

const storeName = ref("");
const loginName = ref("");
const lStoreCd = ref("");
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

// 초기 메뉴 리스트 구성 함수
const initializeCategories = () => {
  const subCategory = store.state.subCategory;
  const minorCategory = store.state.minorCategory;
  let category = [];

  category = subCategory.filter(
    (item) => item.lngCode == props.selectCategoryId
  );
  
  // 깊은 복사본을 만들어서 원본 데이터 보호
  category = category.map((element) => {
    const matchedMinorCategory = minorCategory.filter(
      (item) =>
        item.lngProgramSub == element.lngProgramSub &&
        item.lngCode == element.lngCode
    );
    // 깊은 복사본 생성
    return {
      ...element,
      subcategories: matchedMinorCategory.map((sub) => ({ ...sub }))
    };
  });

  return category;
};

const setProgramList = (e) => {
  //comsole.log(e.target.value);

  cMenu = store.state.mainCategory
    .filter((item) => item.lngCode == props.selectCategoryId)
    .map((item) => item.strTitle)[0];

  if (e.target.value == "") {
    // 검색어가 비어있을 때 초기 데이터로 복원
    searchword.value = "";
    countShow.value = false;
    openCategoryId.value = [];
    categories.value = initializeCategories();
    return;
  } else {
    // 검색어가 있을 때 필터링 (원본 데이터 보호를 위해 깊은 복사본 사용)
    const subCategory = store.state.subCategory;
    const minorCategory = store.state.minorCategory;
    let category = [];

    category = subCategory.filter(
      (item) => item.lngCode == props.selectCategoryId
    );
    
    // 깊은 복사본을 만들어서 필터링
    category = category.map((element) => {
      const matchedMinorCategory = minorCategory.filter(
        (item) =>
          item.lngProgramSub == element.lngProgramSub &&
          item.lngCode == element.lngCode
      );
      // 검색어로 필터링 (깊은 복사본에서)
      const filteredSubcategories = matchedMinorCategory
        .filter((subitem) => subitem.strProgramName.includes(e.target.value))
        .map((sub) => ({ ...sub }));
      
      return {
        ...element,
        subcategories: filteredSubcategories
      };
    });

    // 빈 카테고리 제거
    category = category.filter(
      (item) => item.subcategories.length !== 0
    );

    categories.value = category;
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

const closeSidemenu = () => {
  // 사이드메뉴 닫기: collapse 클래스 제거, body에서 sidemenu-expanded 클래스 제거
  if (typeof window !== 'undefined' && window.$) {
    window.$(".sidemenu").removeClass("collapse");
    window.$("body").removeClass("sidemenu-expanded");
  } else {
    const sidemenu = document.querySelector(".sidemenu");
    if (sidemenu) {
      sidemenu.classList.remove("collapse");
    }
    document.body.classList.remove("sidemenu-expanded");
  }
};

onMounted(() => {
  ////console.log(store.state.userData);
  loginName.value = store.state.userData.loginID;
  storeName.value = store.state.userData.strStoreName;
  lStoreCd.value = store.state.userData.lngPosition;
  currentFavorite.value = [];
  currentFavorite.value = [...store.state.favoriteList];

  cMenu = store.state.mainCategory
    .filter((item) => item.lngCode === selectedCategoryId.value)
    .map((item) => item.strTitle)[0];

  // 초기화 함수 사용
  categories.value = initializeCategories();

  detectMobile();
  //comsole.log(isMobile);

  // Vue가 DOM을 업데이트한 후 jQuery 초기화 함수 호출
  nextTick(() => {
    // DOM이 렌더링되었는지 확인
    const domElements = document.querySelectorAll('.menu-list li').length;
    //console.log('onMounted - categories:', categories.value.length, 'DOM elements:', domElements);
    
    // jQuery가 로드되었는지 확인
    if (typeof $ === 'undefined') {
      //console.error('jQuery is not loaded!');
      return;
    }
    
    const $menuSections = $('.menu-section');
    //console.log('jQuery menu sections:', $menuSections.length);
    
    if (typeof window.initActiveMenu === 'function') {
      window.initActiveMenu();
    }
    
        // active 메뉴가 없으면 아무것도 열지 않음 (초기 상태 유지)
        // 사용자가 직접 클릭하거나 전체 열기 버튼을 사용하도록 함
    
    // 전체 열기 버튼 이벤트 재바인딩 확인
    const $toggleAll = $('#toggleAll');
    if ($toggleAll.length > 0) {
      //console.log('ToggleAll checkbox found:', $toggleAll.length);
      // 이벤트가 바인딩되었는지 확인
      const events = $._data($toggleAll[0], 'events');
      //console.log('ToggleAll events:', events);
    }
    
    // DOM이 아직 준비되지 않았으면 한 번 더 시도
    if (domElements === 0 && categories.value.length > 0) {
      setTimeout(() => {
        const retryElements = document.querySelectorAll('.menu-list li').length;
        //console.log('retry - DOM elements:', retryElements);
        if (typeof window.initActiveMenu === 'function') {
          window.initActiveMenu();
        }
      }, 100);
    }
  });

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

  const existingTab = tabs.value.find(
    (tab) => tab.lngProgramID.split("_")[0] == lngProgramID2
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

  // const matchingtab = categories.value
  //   .flatMap((item) => item.subcategories)
  //   .filter((sub) => sub.lngProgramID == lngProgramID2); // 조건 넣어서 필터

  //comsole.log(matchingtab);
  //store.dispatch("saveActiveTab", matchingtab[0]);
};
var cMenu = ref("매출관리");
//const selectedCategoryId = computed(() => store.state.selectedCategoryId);
const selectedCategoryId = ref("1");

watch(
  () => [props.selectCategoryId, props.triggerNow],
  (newCategory) => {
    clickFavorite.value = false;
    searchword.value = "";
    openCategoryId.value = [];
    countShow.value = false;
    cMenu = store.state.mainCategory
      .filter((item) => item.lngCode == props.selectCategoryId)
      .map((item) => item.strTitle)[0];

    // 초기화 함수 사용
    categories.value = initializeCategories();
    //comsole.log(categories.value);
  }
);

// categories가 변경될 때마다 DOM 업데이트 후 jQuery 초기화
watch(
  () => categories.value,
  (newCategories, oldCategories) => {
    if (newCategories && newCategories.length > 0) {
      nextTick(() => {
        const domElements = document.querySelectorAll('.menu-list li').length;
        //console.log('categories watch - categories:', newCategories.length, 'DOM elements:', domElements);
        
        // jQuery 이벤트가 제대로 바인딩되었는지 확인
        const $menuList = $('.menu-list li');
        //console.log('jQuery elements:', $menuList.length);
        
        // active 메뉴가 있으면 초기화, 없으면 첫 번째 섹션 열기
        if (typeof window.initActiveMenu === 'function') {
          window.initActiveMenu();
        }
        
        // active 메뉴가 없으면 아무것도 열지 않음 (초기 상태 유지)
        
        // DOM이 아직 준비되지 않았으면 재시도
        if (domElements === 0) {
          setTimeout(() => {
            const retryElements = document.querySelectorAll('.menu-list li').length;
            //console.log('categories watch retry - DOM elements:', retryElements);
            if (typeof window.initActiveMenu === 'function' && retryElements > 0) {
              window.initActiveMenu();
            }
          }, 200);
        }
      });
    }
  },
  { deep: true }
);
</script>
<style scoped>
.scroll-container {
  overflow-y: auto;
  scrollbar-gutter: stable;
}

/* 초기 진입 시: 모든 메뉴 리스트 접힌 상태 */
.menu-section .menu-list {
  display: none;
}

/* jQuery에서 open 클래스를 주거나 slideDown을 호출하면 펼쳐짐 */
.menu-section.open .menu-list {
  display: block;
}
</style>
