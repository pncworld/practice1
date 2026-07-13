<template>
  <!-- 좌측 메뉴 / 퍼블리셔 마크업 기반 -->
  <aside class="w-left sidemenu">
    <!-- 사용자 정보 -->
    <div class="pd20 user-info" style="position:relative;">
      <!-- 아이콘 hover 열림 / 드롭다운 유지 묶음 -->
      <div class="user-menu-host">
        <div
          class="flex f13 fc-white bd-white-20 br50 items-center inner user-area-oval"
          style="cursor:pointer;"
          @click.stop="toggleUserMenu">
          <!-- 사람 아이콘 — hover 시 드롭다운 열림 -->
          <span
            class="flex-center bg-black-50 br50p user-icon"
            @mouseenter="onUserMenuHostEnter"
            @mouseleave="onUserMenuHostLeave">
            <svg style="width:1.1em;height:1.1em;color:white;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </span>
          <!-- 타원: 매장명만 표시 -->
          <span class="user-info-tooltip-host user-info-tooltip-host--store">
            <span
              ref="userStoreRef"
              class="user-store user-store--only"
              :class="{ 'is-overflow': userStoreOverflow }"
              @mouseenter="onUserStoreEnter"
              @mouseleave="onUserStoreLeave">
              {{ storeDisplayText }}
            </span>
            <span
              v-show="userStoreTooltipVisible"
              class="user-info-hover-tooltip"
              role="tooltip">
              {{ storeDisplayText }}
            </span>
          </span>
        </div>

        <!-- 드롭다운 메뉴 -->
        <div
          v-if="userMenuOpen"
          class="user-account-dropdown"
          @click.stop
          @mouseenter="onUserMenuHostEnter"
          @mouseleave="onUserMenuHostLeave">
          <!-- 환영 헤더 -->
          <div class="user-account-dropdown__greeting">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width:15px;height:15px;flex-shrink:0;color:#6b7280;">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span><strong>{{ loginName }}</strong>님 반갑습니다.</span>
          </div>
          <div class="user-account-dropdown__divider"></div>
        <a
          href="https://pf.kakao.com/_Ztrxks"
          target="_blank"
          rel="noopener noreferrer"
          class="user-account-dropdown__item user-account-dropdown__item--kakao"
          @click="closeUserMenu">
          <img src="@/assets/images/kakao_channel_talk.svg" alt="카카오" style="width:15px;height:15px;flex-shrink:0;" />
          채널톡 상담
        </a>
        <a
          href="https://sopumzip.shop/main/index"
          target="_blank"
          rel="noopener noreferrer"
          class="user-account-dropdown__item user-account-dropdown__item--order"
          @click="closeUserMenu">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          소모품 발주
        </a>
        <button type="button" class="user-account-dropdown__item" @click="openPasswordModal">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
          비밀번호 변경
        </button>
        <button type="button" class="user-account-dropdown__item user-account-dropdown__item--logout" @click="doLogout">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          로그아웃
        </button>
        </div><!-- /user-account-dropdown -->
      </div><!-- /user-menu-host -->

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
        autocomplete="off"
        readonly
        v-model="searchword"
        @focus="(e) => e.target.removeAttribute('readonly')"
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

  <!-- 비밀번호 변경 모달 (body 최상위에 렌더링) -->
  <Teleport to="body">
    <div v-if="showPasswordModal" class="pw-modal-overlay">
      <!-- 모달 카드 -->
      <div class="pw-modal-card" @click.stop>
        <!-- 헤더 -->
        <div class="pw-modal-header">
          <div style="display:flex;align-items:center;gap:12px;">
            <div class="pw-modal-header__icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width:22px;height:22px;color:white;">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <div style="font-size:1.05rem;font-weight:600;color:white;">비밀번호 변경</div>
              <div style="font-size:0.82rem;color:rgba(255,255,255,0.8);">계정 보안을 위해 주기적으로 변경해 주세요</div>
            </div>
          </div>
          <button type="button" class="pw-modal-close" @click="closePasswordModal" title="닫기">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width:18px;height:18px;">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- 안내 -->
        <div class="pw-modal-notice">
          (주)피앤시월드에서는 고객님의 개인정보 보호와 안전한 서비스 이용을 위해 항상 노력하고 있습니다.
        </div>

        <!-- 규칙 -->
        <div class="pw-modal-rules">
          <div class="pw-modal-rules__title">비밀번호 규칙</div>
          <ul>
            <li v-for="rule in pwRules" :key="rule.text" :class="rule.met ? 'pw-rule--met' : 'pw-rule--unmet'">
              <svg fill="currentColor" viewBox="0 0 20 20" style="width:15px;height:15px;flex-shrink:0;">
                <path fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd" />
              </svg>
              {{ rule.text }}
            </li>
          </ul>
        </div>

        <!-- 폼 -->
        <div class="pw-modal-form">
          <!-- 브라우저 autofill 흡수용 더미 필드 -->
          <input type="text" autocomplete="username" aria-hidden="true"
            style="position:absolute;left:-9999px;width:1px;height:1px;opacity:0;pointer-events:none;" />

          <!-- 현재 비밀번호 -->
          <div class="pw-modal-field">
            <label>현재 비밀번호</label>
            <div class="pw-modal-input-wrap">
              <input
                :type="pwShowCurrent ? 'text' : 'password'"
                v-model="pwCurrent"
                autocomplete="off"
                placeholder="현재 비밀번호를 입력하세요"
                :class="['pw-modal-input', pwCurrent ? 'has-icon' : '']" />
              <button v-if="pwCurrent" type="button" tabindex="-1" class="pw-eye-btn" @click="pwShowCurrent = !pwShowCurrent">
                <svg v-if="!pwShowCurrent" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width:16px;height:16px;">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width:16px;height:16px;">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
          </div>

          <!-- 새 비밀번호 -->
          <div class="pw-modal-field">
            <label>새 비밀번호</label>
            <div class="pw-modal-input-wrap">
              <input
                :type="pwShowNew ? 'text' : 'password'"
                v-model="pwNew"
                autocomplete="new-password"
                placeholder="새 비밀번호를 입력하세요"
                class="pw-modal-input has-icon" />
              <button type="button" tabindex="-1" class="pw-eye-btn" @click="pwShowNew = !pwShowNew">
                <svg v-if="!pwShowNew" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width:16px;height:16px;">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width:16px;height:16px;">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
            <!-- 강도 바 — 충족 개수만큼 왼쪽부터 채움 -->
            <div v-if="pwNew" class="pw-strength-bar">
              <div class="pw-strength-bar__tracks">
                <div
                  v-for="i in pwStrengthTotal"
                  :key="i"
                  class="pw-strength-bar__track"
                  :class="i <= pwStrengthMet ? pwStrengthBarClass : ''"></div>
              </div>
              <span class="pw-strength-label" :class="pwStrengthTextClass"
                >{{ pwStrengthLabel }} ({{ pwStrengthMet }}/{{ pwStrengthTotal }})</span
              >
            </div>
          </div>

          <!-- 새 비밀번호 확인 -->
          <div class="pw-modal-field">
            <label>새 비밀번호 확인</label>
            <div class="pw-modal-input-wrap">
              <input
                :type="pwShowConfirm ? 'text' : 'password'"
                v-model="pwConfirm"
                autocomplete="new-password"
                placeholder="새 비밀번호를 다시 입력하세요"
                :class="['pw-modal-input has-icon', pwConfirm && pwNew !== pwConfirm ? 'error' : '']" />
              <button type="button" tabindex="-1" class="pw-eye-btn" @click="pwShowConfirm = !pwShowConfirm">
                <svg v-if="!pwShowConfirm" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width:16px;height:16px;">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width:16px;height:16px;">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
            <p v-if="pwConfirm && pwNew !== pwConfirm" class="pw-mismatch-msg">
              <svg fill="currentColor" viewBox="0 0 20 20" style="width:13px;height:13px;flex-shrink:0;">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              비밀번호가 일치하지 않습니다.
            </p>
          </div>

          <!-- 저장 버튼 -->
          <button type="button" class="pw-modal-save-btn" @click="pwSaveButton">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width:16px;height:16px;">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            비밀번호 변경
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { addFavorite, deleteFavorite } from "@/api/common";
import { savePassWord, validatePassWord } from "@/api/system";
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
const userIdRef = ref(null);
const userStoreRef = ref(null);
const userIdTooltipVisible = ref(false);
const userStoreTooltipVisible = ref(false);
const userStoreOverflow = ref(false);
const storeDisplayText = computed(
  () => `${storeName.value} (${lStoreCd.value})`
);

const isTextTruncated = (el) => {
  if (!el) return false;
  return el.scrollWidth > el.clientWidth + 1;
};

const onUserIdEnter = () => {
  userIdTooltipVisible.value = isTextTruncated(userIdRef.value);
};

const onUserIdLeave = () => {
  userIdTooltipVisible.value = false;
};

const onUserStoreEnter = () => {
  userStoreTooltipVisible.value = isTextTruncated(userStoreRef.value);
};

const onUserStoreLeave = () => {
  userStoreTooltipVisible.value = false;
};

let userInfoResizeObserver = null;
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
// ─── 사용자 계정 드롭다운 ───────────────────────────────────────
const userMenuOpen = ref(false);
const toggleUserMenu = () => { userMenuOpen.value = !userMenuOpen.value; };
const closeUserMenu = () => { userMenuOpen.value = false; };

/** hover 자동 열림/닫힘 — 타원↔드롭다운 이동 시 깜빡임 방지용 딜레이 타이머 */
let _userMenuCloseTimer = null;
const onUserMenuHostEnter = () => {
  if (_userMenuCloseTimer) { clearTimeout(_userMenuCloseTimer); _userMenuCloseTimer = null; }
  userMenuOpen.value = true;
};
const onUserMenuHostLeave = () => {
  _userMenuCloseTimer = setTimeout(() => {
    userMenuOpen.value = false;
    _userMenuCloseTimer = null;
  }, 180);
};

const doLogout = () => {
  userMenuOpen.value = false;
  store.dispatch("logout");
  sessionStorage.clear();
  window.location.href = "/";
};

// ─── 비밀번호 변경 모달 ──────────────────────────────────────────
const showPasswordModal = ref(false);

const pwCurrent   = ref("");
const pwNew       = ref("");
const pwConfirm   = ref("");
const pwShowCurrent = ref(false);
const pwShowNew     = ref(false);
const pwShowConfirm = ref(false);

const openPasswordModal = () => {
  userMenuOpen.value = false;
  pwCurrent.value = "";
  pwNew.value = "";
  pwConfirm.value = "";
  pwShowCurrent.value = false;
  pwShowNew.value = false;
  pwShowConfirm.value = false;
  showPasswordModal.value = true;
};
const closePasswordModal = () => { showPasswordModal.value = false; };

// 비밀번호 유틸
const PW_COMMON = [
  "12345678","123456789","1234567890","password","password1",
  "qwerty123","qwerty1","iloveyou","admin123","letmein",
  "welcome1","monkey123","dragon123","master123","abc12345",
  "111111111","1q2w3e4r","1q2w3e4r5t","pass1234","p@ssw0rd",
];
function pwHasSpecial(pw) {
  return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(pw);
}
function pwHasRepeated(pw) { return /(.)\1{3,}/.test(pw); }
function pwHasSequential(pw) {
  const s = pw.toLowerCase();
  for (let i = 0; i < s.length - 3; i++) {
    const [a,b,c,d] = [s.charCodeAt(i),s.charCodeAt(i+1),s.charCodeAt(i+2),s.charCodeAt(i+3)];
    if (b===a+1&&c===b+1&&d===c+1) return true;
    if (b===a-1&&c===b-1&&d===c-1) return true;
  }
  return false;
}

const pwRules = computed(() => {
  const pw = pwNew.value;
  const id = store.state.userData?.loginID ?? "";
  return [
    { text: "8자리 이상 20자리 이하 (기본)", met: pw.length >= 8 && pw.length <= 20, basic: true },
    { text: "영문자·숫자·특수문자 중 2종류 이상", met: [/[a-zA-Z]/.test(pw),/[0-9]/.test(pw),pwHasSpecial(pw)].filter(Boolean).length >= 2 },
    { text: "아이디와 동일한 비밀번호 불가", met: pw.length > 0 && id.length > 0 && !pw.toLowerCase().includes(id.toLowerCase()) },
    { text: "동일 문자 4회 이상 연속 불가 (예: aaaa)", met: pw.length > 0 && !pwHasRepeated(pw) },
    { text: "연속 문자·숫자 4자리 이상 불가 (예: abcd)", met: pw.length > 0 && !pwHasSequential(pw) },
    { text: "자주 사용되는 비밀번호 불가", met: pw.length > 0 && !PW_COMMON.includes(pw.toLowerCase()) },
  ];
});

const PW_MIN_RULES_TO_SAVE = 4;
/** 기본 조건: 8자리 미만이면 취약 고정·변경 불가 */
const pwMeetsBasicLength = computed(() => {
  const len = pwNew.value?.length ?? 0;
  return len >= 8 && len <= 20;
});

const pwStrengthMet = computed(
  () => pwRules.value.filter((r) => r.met).length
);
const pwStrengthTotal = computed(() => pwRules.value.length);

const pwStrengthBarClass = computed(() => {
  if (!pwMeetsBasicLength.value) return "is-weak";
  const met = pwStrengthMet.value;
  if (met <= 0) return "";
  if (met <= 2) return "is-weak";
  if (met <= 3) return "is-fair";
  if (met < pwStrengthTotal.value) return "is-good";
  return "is-strong";
});
const pwStrengthTextClass = computed(() => pwStrengthBarClass.value);
const pwStrengthLabel = computed(() => {
  if (!pwNew.value) return "취약";
  if (!pwMeetsBasicLength.value) return "취약";
  const met = pwStrengthMet.value;
  if (met <= 2) return "취약";
  if (met <= 3) return "보통";
  if (met < pwStrengthTotal.value) return "양호";
  return "강함";
});

const pwSaveButton = () => {
  if (pwNew.value !== pwConfirm.value) {
    Swal.fire({ icon:"error", title:"신규 비밀번호 오류", text:"신규 비밀번호와 확인 비밀번호가 일치하지 않습니다." });
    return;
  }
  if (!pwMeetsBasicLength.value) {
    Swal.fire({
      icon: "error",
      title: "기본 조건 미충족",
      text: "비밀번호는 8자리 이상 20자리 이하(기본 조건)여야 합니다.",
    });
    return;
  }
  if (pwStrengthMet.value < PW_MIN_RULES_TO_SAVE) {
    const failed = pwRules.value.filter((r) => !r.met);
    Swal.fire({
      icon: "error",
      title: "비밀번호 규칙 미충족",
      html:
        `비밀번호 규칙 ${PW_MIN_RULES_TO_SAVE}개 이상 만족해야 변경할 수 있습니다.<br>` +
        `(현재 ${pwStrengthMet.value}/${pwStrengthTotal.value})<br><br>` +
        failed.map((r) => `• ${r.text}`).join("<br>"),
    });
    return;
  }
  Swal.fire({
    title:"변경", text:"비밀번호를 변경하시겠습니까?",
    showCancelButton:true, confirmButtonText:"변경", cancelButtonText:"취소",
    confirmButtonColor:"#3085d6", cancelButtonColor:"#d33",
  }).then(async result => {
    if (!result.isConfirmed) return;
    store.state.loading = true;
    try {
      const res = await validatePassWord(store.state.userData.lngSequence, pwCurrent.value);
      if (res.data.List[0].value == "1") {
        const res2 = await savePassWord(store.state.userData.lngStoreGroup, store.state.userData.lngSequence, pwNew.value);
        if (res2.data.RESULT_CD == "00") {
          Swal.fire({ icon:"success", title:"변경 성공", text:"비밀번호가 성공적으로 변경되었습니다." });
          closePasswordModal();
        }
      } else {
        Swal.fire({ icon:"error", title:"비밀번호 오류", text:"기존 비밀번호가 일치하지 않습니다." });
      }
    } catch {
    } finally {
      store.state.loading = false;
      pwCurrent.value = "";
      pwNew.value = "";
      pwConfirm.value = "";
    }
  });
};

// 드롭다운 외부 클릭 시 닫기 (타이머도 정리)
const onDocClick = () => {
  if (_userMenuCloseTimer) { clearTimeout(_userMenuCloseTimer); _userMenuCloseTimer = null; }
  closeUserMenu();
};

// ─── 모바일 감지 ─────────────────────────────────────────────────
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
  document.addEventListener("click", onDocClick);
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

  nextTick(() => {
    const targets = [userIdRef.value, userStoreRef.value].filter(Boolean);
    if (targets.length && typeof ResizeObserver !== "undefined") {
      userInfoResizeObserver = new ResizeObserver(() => {
        if (!isTextTruncated(userIdRef.value)) {
          userIdTooltipVisible.value = false;
        }
        if (!isTextTruncated(userStoreRef.value)) {
          userStoreTooltipVisible.value = false;
        }
        userStoreOverflow.value = isTextTruncated(userStoreRef.value);
      });
      targets.forEach((el) => userInfoResizeObserver.observe(el));
      userStoreOverflow.value = isTextTruncated(userStoreRef.value);
    }
  });

  router.push("/homePage");
});

onUnmounted(() => {
  document.removeEventListener("click", onDocClick);
  userInfoResizeObserver?.disconnect();
  userInfoResizeObserver = null;
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
/* ── 사용자 메뉴 호스트 (타원 + 드롭다운 묶음) ─────── */
.user-menu-host {
  position: relative;
  display: flex;
  flex: 1;
  min-width: 0;
}

/* ── 사용자 타원 영역 hover 효과 ─────────────────── */
@keyframes oval-pulse {
  0%   { background: rgba(255,255,255,0.08); box-shadow: none; }
  50%  { background: rgba(255,255,255,0.52); box-shadow: 0 0 0 3px rgba(255,255,255,0.7); }
  100% { background: rgba(255,255,255,0.08); box-shadow: none; }
}
.user-area-oval {
  transition: background 0.18s, box-shadow 0.18s;
}
.user-area-oval:hover {
  animation: oval-pulse 0.8s ease-in-out infinite;
}
.user-area-oval:active {
  animation: none;
  background: rgba(255, 255, 255, 0.38) !important;
}

.user-area-oval:active .user-icon {
  transform: scale(0.95);
}

/* 타원: 매장명만 표시 — layout.css .po-layout .user-store::before 보다 우선 적용 */
.user-store--only::before { display: none !important; }
.user-store--only {
  display: block;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: center;
}
/* 매장명이 잘릴 때는 왼쪽부터 보이도록 */
.user-store--only.is-overflow {
  text-align: left;
}
/* 아이콘+gap 보정 → 타원 진중앙 정렬 */
.user-info-tooltip-host--store {
  padding-right: 26px;
}

/* ── 사용자 계정 드롭다운 ─────────────────── */
.user-account-dropdown {
  position: absolute;
  top: calc(100% - 8px);
  left: 50%;
  transform: translateX(-50%);
  z-index: 200;
  min-width: 220px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.18);
  padding: 6px 0;
  overflow: hidden;
}
.user-account-dropdown__item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 9px 20px;
  font-size: 0.9rem;
  color: #374151;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s;
}
.user-account-dropdown__greeting {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px 9px;
  font-size: 0.86rem;
  color: #4b5563;
  background: linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%);
  border-bottom: 1px solid #dbeafe;
  pointer-events: none;
}
.user-account-dropdown__greeting strong { font-weight: 700; color: #1d4ed8; }
.user-account-dropdown__divider { display: none; }
.user-account-dropdown__item svg { width: 15px; height: 15px; color: #6b7280; flex-shrink: 0; }
.user-account-dropdown__item:hover { background: #fef9c3; }
.user-account-dropdown__item--kakao { color: #3b1d1d; text-decoration: none; }
.user-account-dropdown__item--order { color: #374151; text-decoration: none; }
.user-account-dropdown__item--logout { color: #ef4444; }
.user-account-dropdown__item--logout svg { color: #ef4444; }

/* ── 비밀번호 변경 모달 ───────────────────── */
.pw-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}
.pw-modal-card {
  width: 100%;
  max-width: 440px;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.25);
}
.pw-modal-header {
  background: linear-gradient(90deg, #2563eb, #3b82f6);
  padding: 18px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.pw-modal-header__icon {
  background: rgba(255,255,255,0.2);
  border-radius: 50%;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.pw-modal-close {
  background: rgba(255,255,255,0.15);
  border: none;
  border-radius: 6px;
  padding: 5px;
  cursor: pointer;
  color: white;
  display: flex;
  align-items: center;
  transition: background 0.15s;
}
.pw-modal-close:hover { background: rgba(255,255,255,0.3); }
.pw-modal-notice {
  background: #eff6ff;
  border-bottom: 1px solid #dbeafe;
  padding: 10px 20px;
  font-size: 0.78rem;
  color: #2563eb;
}
.pw-modal-rules {
  padding: 14px 20px;
  border-bottom: 1px solid #f3f4f6;
}
.pw-modal-rules__title {
  font-size: 0.75rem;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
}
.pw-modal-rules ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 5px; }
.pw-modal-rules li { display: flex; align-items: center; gap: 7px; font-size: 0.83rem; transition: color 0.2s; }
.pw-rule--met  { color: #16a34a; }
.pw-rule--unmet { color: #6b7280; }
.pw-rule--met svg  { color: #22c55e; }
.pw-rule--unmet svg { color: #d1d5db; }

.pw-modal-form { padding: 16px 20px; display: flex; flex-direction: column; gap: 14px; }
.pw-modal-field { display: flex; flex-direction: column; gap: 5px; }
.pw-modal-field label { font-size: 0.88rem; font-weight: 500; color: #374151; }
.pw-modal-input-wrap { position: relative; }
.pw-modal-input {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 9px 14px;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  box-sizing: border-box;
}
.pw-modal-input.has-icon { padding-right: 38px; }
.pw-modal-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.15); }
.pw-modal-input.error { border-color: #f87171; }
.pw-modal-input.error:focus { box-shadow: 0 0 0 3px rgba(248,113,113,0.15); }
.pw-eye-btn {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  padding: 2px;
  display: flex;
  align-items: center;
}
.pw-eye-btn:hover { color: #4b5563; }

.pw-strength-bar { display: flex; align-items: center; gap: 8px; margin-top: 6px; }
.pw-strength-bar__tracks { display: flex; gap: 4px; flex: 1; }
.pw-strength-bar__track {
  height: 5px;
  flex: 1;
  border-radius: 9999px;
  background: #e5e7eb;
  transition: background 0.2s;
}
.pw-strength-bar__track.is-weak { background: #f87171; }
.pw-strength-bar__track.is-fair { background: #facc15; }
.pw-strength-bar__track.is-good { background: #60a5fa; }
.pw-strength-bar__track.is-strong { background: #22c55e; }
.pw-strength-label { font-size: 0.75rem; color: #6b7280; white-space: nowrap; }
.pw-strength-label.is-weak { color: #ef4444; }
.pw-strength-label.is-fair { color: #eab308; }
.pw-strength-label.is-good { color: #3b82f6; }
.pw-strength-label.is-strong { color: #16a34a; }

.pw-mismatch-msg { display: flex; align-items: center; gap: 4px; font-size: 0.78rem; color: #ef4444; margin-top: 2px; }

.pw-modal-save-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  width: 100%;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px;
  font-size: 0.92rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
}
.pw-modal-save-btn:hover { background: #1d4ed8; }
.pw-modal-save-btn:active { background: #1e40af; }

/* ── 기존 스타일 ──────────────────────────── */
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
