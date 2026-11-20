/*--############################################################################
# Filename : MST05_011INS.vue                                                  
# Description : 마스터관리 > POS 마스터 > 메뉴키 설정(#)                       
# Date :2025-05-14                                                             
# Author : 권맑음                     
################################################################################*/
<template>
  <!-- 조회조건 -->
  <div class="flex justify-between items-center w-full overflow-y-hidden">
    <PageName> </PageName>
    <div class="flex justify-center mr-10 space-x-2 pr-5">
      <button @click="searchAndOpenFirst" class="button search md:w-auto w-14">조회</button>
      <button @click="saveButton" class="button save w-auto">저장</button>
      <button @click="copyButton" class="button copy w-auto">복사</button>
    </div>
  </div>
  <!-- 조회 AREA: 넓으면 한 줄, 좁으면 두 줄 (MST44_052INS·MST57_003INS 와 같은 방식) -->
  <div class="mk-search">
    <PickStore
      compact-search-bar
      :compact-store-combo-max-rem="15"
      @areaCd="handleStoreAreaCd"
      @update:storeCd="handleStoreCd"
      @posNo="handlePosNo"
      @storeNm="handlestoreNm"
      @update:ischanged="handleinitAll"
      :showPosNo="true"></PickStore>
  </div>
  <div class="z-50">
    <DupliPopUp
      :isVisible="showPopup2"
      @close="showPopup2 = false"
      :storeCd="nowStoreCd"
      :storeNm="clickedStoreNm"
      :areaCd="nowStoreAreaCd"
      :posNo="posNo"
      :progname="'MST01_011INS_VUE'"
      :dupliapiname="'DUPLIALLPOSDATA'"
      :progid="1"
      :poskiosk="'getStoreAndPosList'"
      :naming="'POS번호'"
      :blnBrandAdmin="isBrandAdmin"
      :newDesign="true">
    </DupliPopUp>
  </div>
  <!-- 조회조건 -->
  <!-- 화면키 수정 팝업 -->
  <Teleport to="body">
    <div v-if="changeScreenKey" class="mk-pop-mask">
      <div class="mk-pop" role="dialog" aria-modal="true">
        <div class="mk-pop-head">
          <h2 class="mk-pop-title">화면키 수정</h2>
        </div>
        <div class="mk-pop-body">
          <label class="mk-pop-field">
            <span class="mk-pop-label">화면키명</span>
            <input type="text" class="mk-pop-input" v-model="currentscreenKeyNm" />
          </label>
        </div>
        <div class="mk-pop-foot">
          <button type="button" class="pnc-sub-btn" @click="confirmScreenKey()">
            <svg class="pnc-sub-btn__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            확인
          </button>
          <button type="button" class="pnc-sub-btn pnc-sub-btn--gray" @click="exitScreenKey">
            <svg class="pnc-sub-btn__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
            닫기
          </button>
        </div>
      </div>
    </div>
  </Teleport>
  <!-- 화면키 추가 팝업 -->
  <Teleport to="body">
    <div v-if="addscreenKey" class="mk-pop-mask">
      <div class="mk-pop" role="dialog" aria-modal="true">
        <div class="mk-pop-head">
          <h2 class="mk-pop-title">화면키 추가</h2>
        </div>
        <div class="mk-pop-body">
          <label class="mk-pop-field">
            <span class="mk-pop-label">화면키명</span>
            <input type="text" class="mk-pop-input" v-model="currentscreenKeyNm" />
          </label>
        </div>
        <div class="mk-pop-foot">
          <button type="button" class="pnc-sub-btn pnc-sub-btn--rose" @click="confirmaddScreenKey()">
            <svg class="pnc-sub-btn__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
            </svg>
            추가
          </button>
          <button type="button" class="pnc-sub-btn pnc-sub-btn--gray" @click="exitScreenKey">
            <svg class="pnc-sub-btn__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
            닫기
          </button>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- 화면키 순서 변경 팝업 -->
  <Teleport to="body">
    <div
      v-show="showChangeScreenKey"
      class="mk-order-mask"
      @click.self="showScreenKeysOrder">
      <div class="mk-order-pop" role="dialog" aria-modal="true">
        <div class="mk-order-head">
          <h2 class="mk-order-title">화면키 순서 변경</h2>
          <p class="mk-order-desc">
            화면키를 끌어서 원하는 위치에 놓으면 순서가 바뀝니다. 메뉴키도 함께 이동합니다.
          </p>
        </div>
        <div class="mk-order-body">
          <VueDraggableNext
            v-model="ScreenKeyOrigin"
            :group="{ name: 'subCategory', pull: 'clone', put: true }"
            class="mk-order-list"
            :animation="180"
            ghost-class="mk-order-ghost"
            chosen-class="mk-order-chosen"
            :move="onMove2"
            @end="onEnd2">
            <div
              v-for="(item, index) in ScreenKeyOrigin"
              class="mk-order-item"
              v-show="item && item.strScreenName !== ''">
              <svg class="mk-order-grip" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <circle cx="9" cy="6" r="1.6" /><circle cx="15" cy="6" r="1.6" />
                <circle cx="9" cy="12" r="1.6" /><circle cx="15" cy="12" r="1.6" />
                <circle cx="9" cy="18" r="1.6" /><circle cx="15" cy="18" r="1.6" />
              </svg>
              <span class="mk-order-no">{{ index + 1 }}</span>
              <p class="mk-order-name">{{ item.strScreenName }}</p>
            </div>
          </VueDraggableNext>
        </div>
        <div class="mk-order-foot">
          <span class="mk-order-hint">변경 내용은 [저장]을 눌러야 반영됩니다.</span>
          <button type="button" class="pnc-sub-btn pnc-sub-btn--gray" @click="showScreenKeysOrder">
            <svg class="pnc-sub-btn__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
            닫기
          </button>
        </div>
      </div>
    </div>
  </Teleport>
  <!-- 본문: 좌(메뉴관리 / TLU관리 탭) / 우(메뉴키 설정). 키 크기는 고정 폭, 좁아지면 우측 패널만 가로 스크롤 -->
  <div class="mk-body">
    <div class="mk-left">
      <div class="mk-panel-head">
        <div class="mk-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            class="mk-tab"
            :class="{ 'mk-tab--on': currentMenu == false }"
            :aria-selected="currentMenu == false"
            @click="showMenus(1)">
            메뉴관리
          </button>
          <button
            type="button"
            role="tab"
            class="mk-tab"
            :class="{ 'mk-tab--on': currentMenu == true }"
            :aria-selected="currentMenu == true"
            @click="showMenus(2)">
            TLU관리
          </button>
        </div>
        <!-- <button class="whitebutton" @click="searchMenuList3">조회</button> -->
        <button
          type="button"
          class="pnc-sub-btn pnc-sub-btn--rose"
          @click="movePage1"
          v-if="currentMenu == false">
          <svg class="pnc-sub-btn__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" /></svg>
          추가
        </button>
        <button
          type="button"
          class="pnc-sub-btn pnc-sub-btn--rose"
          @click="movePage2"
          v-if="currentMenu == true">
          <svg class="pnc-sub-btn__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" /></svg>
          추가
        </button>
      </div>
      <!-- 메뉴관리 탭 -->
      <div class="mk-left-body" v-show="currentMenu == false">
        <div class="mk-filter">
          <div class="customtableIndex border border-gray-400 rounded-tl-lg">
            메뉴분류
          </div>
          <div class="mk-filter-cell border border-gray-300 rounded-tr-lg">
            <select
              name="majorGroupCd"
              id=""
              class="mk-filter-select"
              @change="setSubCd"
              v-model="forsearchMain">
              <option value="-1">전체</option>
              <option :value="i.GroupCd" v-for="i in MenuGroup">
                [{{ i.GroupCd }}]{{ i.majorGroupNm }}
              </option>
            </select>
            <select
              name="subGroupCd"
              id=""
              class="mk-filter-select"
              v-model="forsearchSub"
              @change="setSubCd">
              <option value="-1">전체</option>
              <option :value="i.GroupCd" v-for="i in filteredSubMenuGroup">
                [{{ i.GroupCd }}]{{ i.subGroupNm }}
              </option>
            </select>
          </div>
          <div class="customtableIndex border border-gray-400 rounded-bl-lg">
            메뉴명/코드
          </div>
          <div class="mk-filter-cell border border-gray-300 rounded-br-lg">
            <input
              type="text"
              class="mk-filter-input"
              @input="searchMenuList"
              v-model="searchword1" />
          </div>
        </div>
        <div class="mk-left-grid">
          <Realgrid
            :progname="'MST05_011INS_VUE'"
            :progid="1"
            :rowData="MenuList"
            @selcetedrowData="selcetedrowData"
            :searchColId="'menuCd,menuNm'"
            :searchColId3="['majorGroupCd', 'subGroupCd']"
            :searchValue="searchValue"
            @realgridname="realgridname3"
            :searchWord3="searchword1"></Realgrid>
        </div>
      </div>
      <!-- TLU관리 탭: 위 TLU 목록 / 아래 선택한 TLU 의 구성 메뉴 -->
      <div class="mk-left-body" v-show="currentMenu">
        <div class="mk-filter">
          <div class="customtableIndex border border-gray-400 rounded-l-lg">
            TLU명/코드
          </div>
          <div class="mk-filter-cell border border-gray-300 rounded-r-lg">
            <input
              type="text"
              class="mk-filter-input"
              @input="searchMenuList2"
              v-model="searchword3" />
          </div>
        </div>
        <div class="mk-tlu-grids">
          <div class="mk-tlu-grid mk-tlu-grid--main">
            <Realgrid
              :progname="'MST05_011INS_VUE'"
              :progid="2"
              :rowData="TLUList"
              @selcetedrowData="selcetedrowData2"
              @clickedRowData="clickedRowData"
              @realgridname="realgridname"
              :searchColId="'lngCode,strName'"
              :searchWord3="searchword3"></Realgrid>
          </div>
          <div class="mk-tlu-sub-title">선택한 TLU 구성 메뉴</div>
          <div class="mk-tlu-grid mk-tlu-grid--sub">
            <Realgrid
              :progname="'MST05_011INS_VUE'"
              :progid="3"
              :rowData="TLUSubList"
              @realgridname="realgridname2"></Realgrid>
          </div>
        </div>
      </div>
    </div>
    <!-- 그리드 영역 -->
    <!-- 드래그 영역 -->
    <div class="mk-right">
      <div class="mk-panel-head">
        <h1 class="font-bold text-xl whitespace-nowrap">메뉴키 설정</h1>
        <span class="flex items-center gap-3 whitespace-nowrap"
          >순서변경<label class="flex items-center gap-1"
            ><input
              type="radio"
              name="changingMode"
              value="false"
              v-model="changeMode"
              @click.stop="changingMode(1)"
              checked />교체하기</label
          ><label class="flex items-center gap-1"
            ><input
              type="radio"
              name="changingMode"
              value="true"
              v-model="changeMode"
              @click.stop="changingMode(2)" />밀어내기</label
          ><button type="button" class="pnc-sub-btn pnc-sub-btn--gray" @click.stop="deletekey">
            <svg class="pnc-sub-btn__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 12.5h9l1-12.5M10 11v5M14 11v5" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" /></svg>
            삭제
          </button></span
        >
      </div>
      <div class="mk-right-scroll">
        <div class="mk-key-area">
          <!-- 화면키 5칸 x 2줄 — 오른쪽 위 연필: 이름 수정, 빈 칸: 화면키 추가 -->
          <div class="mk-screen-keys" :class="{ 'mk-hidden': !afterSearch }">
            <div
              v-for="(item, index) in ScreenKeys"
              class="screen-muuri-sort-empty mk-screen-key"
              :class="{
                'mk-screen-key--current':
                  items.length > 0 &&
                  item.intScreenNo !== '' &&
                  item.intScreenNo != null &&
                  item.intScreenNo == clickedintScreenNo,
                'mk-screen-key--target':
                  clickedScreenKeyIndex == index &&
                  clickedScreenOrMenu == false &&
                  item.intScreenNo !== '' &&
                  item.intScreenNo == clickedintScreenNo,
              }"
              @click="
                clickedScreenKeyIndex = index;
                clickedScreenKeys();
              ">
              <p
                v-if="item.strScreenName != ''"
                @click="showMenuKey(item.intScreenNo)"
                class="mk-screen-key-label">
                <span class="mk-screen-name">{{ item.strScreenName }}</span>
                <button
                  type="button"
                  class="mk-screen-edit"
                  title="화면키 이름 수정"
                  @click.stop="editScreenKey(item.intScreenNo, item.strScreenName)">
                  <font-awesome-icon :icon="['far', 'pen-to-square']" />
                </button>
              </p>
              <p
                v-else-if="item.new == true"
                @click="addScreenKey(index)"
                class="mk-screen-key-label mk-screen-key-add">
                <img src="../../assets/ic_add_gray_24.png" alt="" /> 화면키 추가
              </p>
              <p v-else class="flex items-center justify-center"></p>
            </div>
          </div>
          <!-- 화면키 페이지 막대 (한 페이지 10개) -->
          <div class="mk-pager" :class="{ 'mk-hidden': !afterSearch }">
            <button
              type="button"
              class="mk-pager-step"
              :disabled="mkScreenPager.page <= 1"
              @click="showPrev">
              ‹ 이전
            </button>
            <div class="mk-pager-pages">
              <button
                v-for="n in mkScreenPager.pages"
                :key="n"
                type="button"
                class="mk-pager-num"
                :class="{
                  'mk-pager-num--on': n == mkScreenPager.page,
                  'mk-pager-num--open': mkOpenScreen && n == mkOpenScreen.page,
                }"
                :title="
                  mkOpenScreen && n == mkOpenScreen.page
                    ? `열린 화면: ${mkOpenScreen.name}`
                    : `${n} 페이지`
                "
                @click="mkGoScreenPage(n)">
                {{ n }}
              </button>
            </div>
            <button
              type="button"
              class="mk-pager-step"
              :disabled="mkScreenPager.page >= mkScreenPager.pages"
              @click="showNext">
              다음 ›
            </button>
            <button type="button" class="mk-pager-step" @click="showScreenKeysOrder">
              순서 변경
            </button>
            <span class="mk-pager-text">
              <template v-if="mkScreenPager.total == 0">화면키 없음</template>
              <template v-else
                >화면키 <b>{{ mkScreenPager.from }}–{{ mkScreenPager.to }}</b> / 총
                {{ mkScreenPager.total }}개</template
              >
            </span>
          </div>
          <div class="mk-menu-keys-wrap" :class="{ 'mk-hidden': !afterSearch }">
            <!-- 아래 메뉴키가 어느 화면키 것인지 — 위 화면키를 다른 페이지로 넘겨도 유지 -->
            <div class="mk-open-screen">
              <template v-if="mkOpenScreen">
                <span class="mk-open-screen-label">현재 화면</span>
                <span class="mk-open-screen-name">{{ mkOpenScreen.name }}</span>
                <button
                  v-if="mkOpenScreen.page != mkScreenPager.page"
                  type="button"
                  class="mk-open-screen-go"
                  @click="mkGoScreenPage(mkOpenScreen.page)">
                  화면키 위치로 ({{ mkOpenScreen.page }}페이지)
                </button>
              </template>
              <template v-else>위에서 화면키를 선택하면 메뉴키가 표시됩니다.</template>
            </div>
            <!-- 메뉴키 5칸 x 6줄 — 코드 / 메뉴명 / 가격 -->
            <VueDraggableNext
              v-model="items"
              :move="onMove"
              @end="onEnd"
              animation="200"
              class="mk-menu-keys">
              <div
                v-for="(item, index) in items"
                :key="index"
                class="screen-muuri-sort-empty mk-menu-key"
                :class="{
                  'mk-menu-key--selected':
                    clickedMenuKey == index && clickedScreenOrMenu == true,
                }"
                @click="
                  saveMenuKeyposition(index);
                  clickedMenuKey = index;
                  clickedMenukeys();
                ">
                <span class="mk-menu-key-body"
                  ><span class="mk-menu-key-code">{{
                    item.lngKeyscrNo ? item.lngKeyscrNo : ""
                  }}</span
                  ><span class="mk-menu-key-name">{{
                    item.lngKeyscrNo ? getCurrentMenuNm(item) : ""
                  }}</span
                  ><span class="mk-menu-key-price">{{
                    item.lngPrice !== null &&
                    item.lngPrice !== undefined &&
                    item.lngPrice !== "" &&
                    item.lngPrice !== " "
                      ? formatNumber(item.lngPrice) + "원"
                      : ""
                  }}</span></span
                >
              </div>
            </VueDraggableNext>
            <!-- 메뉴키 페이지 (한 페이지 30개, 최대 33페이지) -->
            <div class="mk-pager">
              <button
                type="button"
                class="mk-pager-step"
                :disabled="currmenuKeyPage <= 1"
                @click="prevMenuKey">
                ‹ 이전
              </button>
              <span class="mk-pager-count"
                >메뉴키 <b>{{ currmenuKeyPage }}</b> / 33 페이지</span
              >
              <button
                type="button"
                class="mk-pager-step"
                :disabled="currmenuKeyPage >= 33"
                @click="nextMenuKey">
                다음 ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- 드래그 영역 -->
</template>

<script setup>
import {
  getMenuKeyList,
  getMenuList,
  getScreenList,
  getTLUList,
  saveAllMenuKey,
  saveScreenKeys,
} from "@/api/master";
/**
 *  복사 팝업 컴포넌트
 *  */

import DupliPopUp from "@/components/dupliPopUp.vue";
/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
/**
 * 매장 공통 컴포넌트
 */

import PickStore from "@/components/pickStore.vue";
/**
 * 	그리드 생성
 */

import Realgrid from "@/components/realgrid.vue";
/**
 *  페이지로그 자동 입력
 *  */

import { insertPageLog } from "@/customFunc/customFunc";
/**
 * 	그리드 생성
 */

/**
 *  리얼그리드 라이브러리 호출
 *  */

import RealGrid from "realgrid";
/**
 *  경고창 호출 라이브러리
 *  */

import Swal from "sweetalert2";
/*
 * 공통 표준  Function
 */

import { computed, onMounted, ref, watch } from "vue";
/*
 * 드래그 라이브러리 호출
 */

import { VueDraggableNext } from "vue-draggable-next";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";

/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
});

// 더미 데이터
const items = ref([
  { intKeySeq: 1 },
  { intKeySeq: 2 },
  { intKeySeq: 3 },
  { intKeySeq: 4 },
  { intKeySeq: 5 },
  { intKeySeq: 6 },
  { intKeySeq: 7 },
  { intKeySeq: 8 },
  { intKeySeq: 9 },
  { intKeySeq: 10 },
  { intKeySeq: 11 },
  { intKeySeq: 12 },
  { intKeySeq: 13 },
  { intKeySeq: 14 },
  { intKeySeq: 15 },
  { intKeySeq: 16 },
  { intKeySeq: 17 },
  { intKeySeq: 18 },
  { intKeySeq: 19 },
  { intKeySeq: 20 },
  { intKeySeq: 21 },
  { intKeySeq: 22 },
  { intKeySeq: 23 },
  { intKeySeq: 24 },
  { intKeySeq: 25 },
  { intKeySeq: 26 },
  { intKeySeq: 27 },
  { intKeySeq: 28 },
  { intKeySeq: 29 },
  { intKeySeq: 30 },
]);

const clickedScreenKeyIndex = ref();
const ScreenKeyOrigin = ref([]);
const clickedMenuKey = ref();
const ScreenKeys = ref();
const currentMenuorTLU = ref(false);
const forsearchMain = ref(-1);
const forsearchSub = ref(-1);
const addscreenKey = ref(false);
const searchWord = ref("");
const searchWord2 = ref("");
// 드래그 가능한 요소를 설정하는 메서드
const currentsubPage = ref(1);
const changeMode = ref(false);
const changingMode = (data) => {
  if (data == 1) {
    changeMode.value = false;
  } else {
    changeMode.value = true;
  }
};
const clickedStoreNm = ref();
/**
 * 페이지 매장명 세팅
 */

const handlestoreNm = (newData) => {
  clickedStoreNm.value = newData;
};
const showPopup2 = ref(false);
const showChangeScreenKey = ref(false);

const confirmitem = ref([]);
const confirmitem2 = ref([]);

const currentscreenKeyNm = ref("");
const maxSubCode = ref();
/**
 * 선택한 포스 번호 호출 함수
 */

const posNo = ref();
const changeScreenKey = ref(false);
const currmenuKeyPage = ref(1);
const AllscreenKeyPage = ref(1);
const currentSelectedMenuNm = ref("");

const isNew = ref(false);
const currentMenu = ref(false);

/**
 * 복사 함수
 */

const copyButton = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고.",
      text: "조회를 먼저 해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  showPopup2.value = true;
};

const searchMenuList2 = (e) => {
  searchword3.value = e.target.value;
};
const realgrid2Name = ref("");
const realgridname = (e) => {
  realgrid2Name.value = e;
};
const realgrid3Name = ref("");
const realgridname2 = (e) => {
  realgrid3Name.value = e;
};
const realgrid4Name = ref("");
const realgridname3 = (e) => {
  realgrid4Name.value = e;
};

watch(currentMenu, () => {
  const reagrid2 = document.getElementById(realgrid2Name.value);
  setTimeout(() => {
    RealGrid.getGridInstance(reagrid2).resetSize();
    RealGrid.getGridInstance(reagrid2).refresh(true);
  }, 100);

  const realgrid3 = document.getElementById(realgrid3Name.value);
  setTimeout(() => {
    RealGrid.getGridInstance(realgrid3).resetSize();
    RealGrid.getGridInstance(realgrid3).refresh(true);
  }, 100);

  const realgrid4 = document.getElementById(realgrid4Name.value);
  setTimeout(() => {
    RealGrid.getGridInstance(realgrid4).resetSize();
    RealGrid.getGridInstance(realgrid4).refresh(true);
  }, 100);
});

/** 화면키 페이지 막대 — 한 페이지 10개 (표시 전용, 이동은 기존 showPrev/showNext) */
const mkScreenPager = computed(() => {
  const total = (ScreenKeyOrigin.value || []).filter(
    (item) => item && item.intScreenNo !== "" && item.intScreenNo != null
  ).length;
  const page = Number(currentsubPage.value) || 1;
  return {
    page,
    pages: Math.max(1, Number(AllscreenKeyPage.value) || 1, Math.ceil(total / 10)),
    total,
    from: Math.min(total, (page - 1) * 10 + 1),
    to: Math.min(total, page * 10),
  };
});

/** 아래 메뉴키가 펼쳐진 화면키(이름, 몇 페이지) — 다른 페이지로 넘겨도 어느 화면키 것인지 표시 */
const mkOpenScreen = computed(() => {
  if (!items.value.length) return null;
  const list = (ScreenKeyOrigin.value || []).filter(
    (item) => item && item.intScreenNo !== "" && item.intScreenNo != null
  );
  const idx = list.findIndex(
    (item) => item.intScreenNo == clickedintScreenNo.value
  );
  if (idx < 0) return null;
  return {
    name: list[idx].strScreenName,
    page: Math.floor(idx / 10) + 1,
  };
});

/** 페이지 번호 클릭 — 기존 이전/다음(showPrev/showNext)을 필요한 횟수만큼 호출 */
const mkGoScreenPage = (n) => {
  let guard = 50;
  while (Number(currentsubPage.value) < n && guard-- > 0) {
    const before = currentsubPage.value;
    showNext();
    if (currentsubPage.value == before) break;
  }
  while (Number(currentsubPage.value) > n && guard-- > 0) {
    const before = currentsubPage.value;
    showPrev();
    if (currentsubPage.value == before) break;
  }
};

const showNext = () => {
  if (currentsubPage.value >= AllscreenKeyPage.value) {
    return;
  }
  currentsubPage.value++;

  addfor10ScreenKey();
};
const showPrev = () => {
  //comsole.log(ScreenKeyOrigin.value);
  if (currentsubPage.value == 1) {
    return;
  }
  currentsubPage.value--;
  ScreenKeys.value = ScreenKeyOrigin.value.slice(
    10 * (currentsubPage.value - 1),
    10 * (currentsubPage.value - 1) + 10
  );
};
const updateMenuKey = ref(false);
let dupliitems = [];

// const saveMenuKeys = () => {
//   let dupliitems = [...items.value];
//   for (var i = 0; i < dupliitems.length; i++) {
//     if (dupliitems[i].lngKeyscrNo != "") {
//       dupliitems[i].intKeySeq = (i + 1).toString();
//     }
//   }
//   const updatedMenuKeys = dupliitems.filter((item) => item.lngKeyscrNo != "");
//   //comsole.log(updatedMenuKeys);
// };
const nowStoreAreaCd = ref();
/**
 *  pickStore - 지역코드 세팅
 */

const handleStoreAreaCd = (newValue) => {
  nowStoreAreaCd.value = newValue;
  //comsole.log(nowStoreAreaCd.value);
};

const searchMenuList = (e) => {
  searchword1.value = e.target.value;
};
const nowStoreCd = ref();
const afterCategory = ref(false);
/**
 * 페이지 매장 코드 세팅
 */

const handleStoreCd = async (newValue) => {
  nowStoreCd.value = newValue;
  if (store.state.userData.lngCommonMenu == "1") {
    const res2 = await getMenuList(groupCd.value, 0);

    //comsole.log(res2);
    MenuList.value = res2.data.menuList;
    MenuGroup.value = res2.data.menuGroup;
    SubMenuGroup.value = res2.data.submenuGroup;
  } else {
    const res2 = await getMenuList(groupCd.value, nowStoreCd.value);

    console.log(res2);
    MenuList.value = res2.data.menuList;
    MenuGroup.value = res2.data.menuGroup;
    SubMenuGroup.value = res2.data.submenuGroup;
  }

  if (newValue == "0") {
    afterSearch.value = false;
    if (MenuList.value.length > 0) {
      MenuList.value = [];
    }
  }

  MenuList.value = MenuList.value.map((item) => {
    return {
      ...item,
      add: "추가",
    };
  });
  // 공통메뉴 그룹(lngCommonMenu=1)은 TLU 메뉴 등록(MST01_010INS)에서 매장코드 0 으로 저장하므로
  // 메뉴 목록(getMenuList(그룹, 0))과 같이 매장코드 0 으로 조회
  const tluStoreCd =
    store.state.userData.lngCommonMenu == "1" ? 0 : nowStoreCd.value;
  const res5 = await getTLUList(groupCd.value, tluStoreCd);
  console.log(res5);
  TLUList.value = res5.data.TLUList;
  TLUList.value = TLUList.value.map((item) => {
    return {
      ...item,
      add: "추가",
    };
  });
};
const selectedButton = ref();
const Category = ref([]);
const getMultiLang = ref([]);
const MenuGroup = ref([]);
const SubMenuGroup = ref([]);

const store = useStore();
/**
 * 브랜드 관리자 여부 (True일 때와 아닐 때 조회 파라미터 구분용)
 */
const isBrandAdmin = computed(
  () => store.state.userData?.blnBrandAdmin == "True"
);
/**
 *  그리드 검색어 세팅
 */

const searchword1 = ref();
/**
 *  그리드 검색어 세팅
 */

const searchword3 = ref();
const userData = store.state.userData;
const groupCd = ref(userData.lngStoreGroup);
const modified = ref(false);
const afterSearch = ref(false);
const MenuList = ref([]);
const MenuKeyList = ref([]);
const clickedScreenOrMenu = ref(false);
const TLUList = ref([]);
const clickedScreenNo = ref();
/**
 *  조회 함수
 */

const searchButton = async () => {
  changeMode.value = false;
  Category.value = [];
  items.value = [];

  if (nowStoreCd.value == "0" || nowStoreCd.value == undefined) {
    Swal.fire({
      title: "경고",
      text: "매장을 선택하세요.",
      icon: "warning",
      showCancelButton: false,
      confirmButtonColor: "#3085d6",
      allowOutsideClick: false,
    });
    return;
  }
  if (nowStoreAreaCd.value == "0" || nowStoreAreaCd.value == undefined) {
    Swal.fire({
      title: "경고",
      text: "포스번호를 선택하세요.",
      icon: "warning",
      showCancelButton: false,
      confirmButtonColor: "#3085d6",
      allowOutsideClick: false,
    });
    return;
  }
  store.state.loading = true;
  try {
    const res3 = await getScreenList(
      groupCd.value,
      nowStoreCd.value,
      nowStoreAreaCd.value,
      posNo.value
    );
    const res4 = await getMenuKeyList(
      groupCd.value,
      nowStoreCd.value,
      nowStoreAreaCd.value
    );
    ////console.log(res4);
    MenuKeyList.value = res4.data.MenuKeyList;
    ScreenKeyOrigin.value = res3.data.ScreenList;
    //comsole.log(ScreenKeyOrigin.value);
    //comsole.log(MenuKeyList.value);
    addfor10ScreenKey();
    AllscreenKeyPage.value = Math.ceil(ScreenKeyOrigin.value.length / 10);

    confirmitem.value = JSON.parse(JSON.stringify(MenuKeyList.value));
    confirmitem2.value = JSON.parse(JSON.stringify(ScreenKeyOrigin.value));

    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
  } finally {
    store.state.loading = false; // 로딩 상태 종료
    modified.value = false;
    afterCategory.value = false;
    changeMode.value = false;
  }

  calculateMaxSubCode();
};
const filteredSubMenuGroup = ref([]);
const searchValue = ref([-1, -1]);
const setSubCd = (e) => {
  const name = e.target.name;
  const value = e.target.value;
  //comsole.log(SubMenuGroup.value);
  //comsole.log(MenuGroup.value);
  if (name == "majorGroupCd") {
    filteredSubMenuGroup.value = SubMenuGroup.value.filter(
      (item) => item.sublngMajor == value
    );
    forsearchSub.value = -1;
    searchValue.value = [value, forsearchSub.value];
  } else if (name == "subGroupCd") {
    searchValue.value = [forsearchMain.value, value];
  }
};
const clickedintScreenNo = ref();
const calculateMaxSubCode = () => {
  maxSubCode.value = Math.max(
    ...Category.value
      .filter((item) => item.SubCategory && item.SubCategory.length > 0)
      .flatMap((item) => item.SubCategory.map((sub) => Number(sub.SubCode)))
  );
};

const TLUSubList = ref([]);
/**
 * 데이터셋 상세정보 셋팅
 */

const clickedRowData = (e) => {
  TLUSubList.value = [];
  for (let i = 1; i <= 29; i++) {
    if (MenuList.value.filter((item) => item.menuCd == e[i]).length > 0) {
      TLUSubList.value.push({
        lngCode: e[i],
        strName: MenuList.value.filter((item) => item.menuCd == e[i])[0].menuNm,
      });
    }
  }
};
/**
 * 선택한 행의 상세정보 셋팅
 */

const selcetedrowData = (e) => {
  if (clickedRealIndex.value == null) {
    return;
  }
  //comsole.log(e);
  TLUorNot.value = false;
  currentSelectedMenuNm.value = e[1];
  currentSelectedMenuCode.value = e[0];
  currentSelectedMenuPrice.value = e[2];
  addMenuKey();
};

/**
 * 선택한 행의 상세정보 셋팅
 */

const TLUorNot = ref(false);
const selcetedrowData2 = (e) => {
  if (clickedRealIndex.value == null) {
    return;
  }
  //comsole.log(e);
  TLUorNot.value = true;
  currentSelectedMenuNm.value = e[1];
  currentSelectedMenuCode.value = e[0];
  currentSelectedMenuPrice.value = "";
  addMenuKey();
};
const showMenuKey = (value) => {
  if (clickedintScreenNo.value != value) {
    currmenuKeyPage.value = 1;
  }
  clickedintScreenNo.value = value;
  items.value = Array.from({ length: 30 }, (_, index) => ({
    intKeySeq: index + 1,
  }));

  MenuKeyList.value
    .filter((item) => item.intPosNo == posNo.value && item.intScreenNo == value)
    .forEach((item) => {
      const position = item.intKeySeq - (currmenuKeyPage.value - 1) * 30 - 1;
      if (position >= 0 && position < 30) {
        items.value[position] = item;
      }
    });
};
watch(ScreenKeys, (newvalue) => {
  //comsole.log(ScreenKeys.value);

  AllscreenKeyPage.value = Math.floor(ScreenKeyOrigin.value.length / 10) + 1;
});
const showScreenKeysOrder = () => {
  showChangeScreenKey.value = !showChangeScreenKey.value;
};

let targetItemIndex2;
const onMove = (evt) => {
  // 예: 드래그 중 이동할 때의 조건 등을 설정할 수 있음
  if (changeMode.value == false) {
    targetItemIndex2 = Array.from(evt.from.children).indexOf(evt.related);
    return false;
  } else {
    return true;
  }
};
let targetItemIndex3;
let dupliScreenKeyOrigin;
const onMove2 = (evt) => {
  // 예: 드래그 중 이동할 때의 조건 등을 설정할 수 있음
  targetItemIndex3 = Array.from(evt.from.children).indexOf(evt.related);

  dupliScreenKeyOrigin = [...ScreenKeyOrigin.value];
  return true;
};

const onEnd = (evt) => {
  if (targetItemIndex2 == undefined) {
    targetItemIndex2 = evt.oldIndex;
  }
  // Swap을 처리할 조건
  if (changeMode.value === false) {
    const oldIndex = evt.oldIndex; // 드래그된 아이템의 기존 인덱스
    const swappedItems = [...items.value]; // items를 복사
    const temp = swappedItems[oldIndex];

    swappedItems[oldIndex] = swappedItems[targetItemIndex2];

    swappedItems[targetItemIndex2] = temp;

    // 배열을 업데이트
    items.value = swappedItems;

    //comsole.log(items.value);
  } else {
    updateMenuKey.value = true;
  }

  clickedMenuKey.value =
    changeMode.value == false ? targetItemIndex2 : evt.newIndex;

  //comsole.log(items.value);
};
function formatNumber(value) {
  if (value === null || value === undefined || value === "") return "";
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function covertKeyName(e) {
  if (e.includes("/")) {
    return e.split("/")[1];
  } else {
    return e;
  }
}

const getCurrentMenuNm = (item) => {
  if (!item.lngKeyscrNo) return "";
  if (item.intKeyNo == 7) {
    const found = TLUList.value.find((t) => t.lngCode == item.lngKeyscrNo);
    return found ? found.strName : covertKeyName(item.strKeyName || "");
  } else {
    const found = MenuList.value.find((m) => m.menuCd == item.lngKeyscrNo);
    return found ? found.menuNm : covertKeyName(item.strKeyName || "");
  }
};
const onEnd2 = (evt) => {
  const originScreenNo = dupliScreenKeyOrigin[evt.oldIndex].intScreenNo;
  const targetScreenNo = dupliScreenKeyOrigin[targetItemIndex3].intScreenNo;
  //comsole.log(originScreenNo);
  //comsole.log(targetScreenNo);
  //comsole.log(ScreenKeyOrigin.value);
  //comsole.log(MenuKeyList.value);
  let temparr = [];
  ScreenKeyOrigin.value.forEach((item, index) => {
    const tempScreenNo = item.intScreenNo;
    const targetScreenNo2 = index + 1;
    temparr.push(tempScreenNo);
    item.intScreenNo = targetScreenNo2;
  });

  MenuKeyList.value
    .filter((item) => item.intPosNo == posNo.value)
    .forEach((item, index) => {
      const targetindex = temparr.findIndex(
        (item2) => item2 == item.intScreenNo
      );
      item.intScreenNo = targetindex + 1;
    });

  addfor10ScreenKey();

  showMenuKey(clickedScreenKeyIndex.value + 1);
};
watch(items, (newvalue) => {
  items.value.forEach((item, index) => {
    if (item) {
      item.intKeySeq = index + (currmenuKeyPage.value - 1) * 30 + 1;
    }
  });
});
/**
 * 저장 함수
 */
const saveButton = async () => {
  //comsole.log(MenuKeyList.value);

  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 진행해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  if (
    JSON.stringify(confirmitem.value) === JSON.stringify(MenuKeyList.value) &&
    JSON.stringify(confirmitem2.value) === JSON.stringify(ScreenKeyOrigin.value)
  ) {
    Swal.fire({
      title: "경고",
      text: "변경된 사항이 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  Swal.fire({
    title: "저장",
    text: "저장 하시겠습니까?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "저장",
    cancelButtonText: "취소",
  }).then(async (result) => {
    if (result.isConfirmed) {
      store.state.loading = true;
      try {
        const screenKeyNoarr = ScreenKeyOrigin.value.map(
          (item) => item.intScreenNo
        );
        const screenKeyNamearr = ScreenKeyOrigin.value.map(
          (item) => item.strScreenName
        );
        //comsole.log(screenKeyNoarr.join(","));
        //comsole.log(screenKeyNamearr.join(","));
        const res = await saveScreenKeys(
          groupCd.value,
          nowStoreCd.value,
          nowStoreAreaCd.value,
          posNo.value,
          screenKeyNoarr.join("\u200B"),
          screenKeyNamearr.join("\u200B")
        );

        const saveScreenInt = ScreenKeyOrigin.value.map(
          (item) => item.intScreenNo
        );
        console.log(MenuKeyList.value);
        const intKeySeqs = MenuKeyList.value
          .filter((item) => item.intPosNo == posNo.value)
          .filter((item2) => saveScreenInt.includes(item2.intScreenNo))
          .map((item) => item.intKeySeq);
        const screenNumarr = MenuKeyList.value
          .filter((item) => item.intPosNo == posNo.value)
          .filter((item2) => saveScreenInt.includes(item2.intScreenNo))
          .map((item) => item.intScreenNo);
        const lngScrarr = MenuKeyList.value
          .filter((item) => item.intPosNo == posNo.value)
          .filter((item2) => saveScreenInt.includes(item2.intScreenNo))
          .map((item) => item.lngKeyscrNo);
        const menuKeyNmarr = MenuKeyList.value
          .filter((item) => item.intPosNo == posNo.value)
          .filter((item2) => saveScreenInt.includes(item2.intScreenNo))
          .map((item) => item.strKeyName);

        const intKeyNos = MenuKeyList.value
          .filter((item) => item.intPosNo == posNo.value)
          .filter((item2) => saveScreenInt.includes(item2.intScreenNo))
          .map((item) => item.intKeyNo);
        //comsole.log(posNo.value);
        //comsole.log(intKeySeqs.join(","));
        //comsole.log(screenNumarr.join(","));
        //comsole.log(lngScrarr.join(","));
        //comsole.log(menuKeyNmarr.join(","));
        const res2 = await saveAllMenuKey(
          groupCd.value,
          nowStoreCd.value,
          nowStoreAreaCd.value,
          posNo.value,
          intKeySeqs.join("\u200B"),
          screenNumarr.join("\u200B"),
          lngScrarr.join("\u200B"),
          menuKeyNmarr.join("\u200B"),
          intKeyNos.join("\u200b")
        );

        console.log(res);
        console.log(res2);
      } catch (error) {
      } finally {
        store.state.loading = false;
        Swal.fire({
          title: "저장 되었습니다.",
          confirmButtonText: "확인",
        });

        // 저장 후 재조회해도 보던 화면키(와 그 페이지)를 다시 열어 둠
        const keepNo = items.value.length ? clickedintScreenNo.value : null;
        const keepName = (ScreenKeyOrigin.value || []).find(
          (item) => item && item.intScreenNo == keepNo
        )?.strScreenName;
        searchButton().then(() => reopenScreenKey(keepNo, keepName));
      }
    }
  });

  // 빈공간 데이터를 넣으려고하는데 안 들어가고 조회가 안됨 // 빈 칸에 대한 것도 데이터를 불러와야 메뉴키위치를 정할 수 있음.
};

const currentSelectedMenuCode = ref("");
const currentSelectedMenuPrice = ref("");

const handlePosNo = (newValue) => {
  posNo.value = newValue;
  //comsole.log(posNo.value);
  if (
    nowStoreAreaCd.value != undefined ||
    (posNo.value != undefined && posNo.value != 0)
  ) {
    searchButton().then(openFirstScreenKey);
  }
};

/** 조회 버튼 — 조회 후 첫 번째 화면키를 바로 열어 메뉴키를 보여줌 */
const searchAndOpenFirst = () => searchButton().then(openFirstScreenKey);

/** 조회되면 첫 번째 화면키를 바로 열어 메뉴키를 보여줌 (화면키 클릭과 같은 순서) */
const openFirstScreenKey = () => {
  const index = ScreenKeys.value.findIndex(
    (item) => item && item.strScreenName != ""
  );
  if (index < 0) return;
  showMenuKey(ScreenKeys.value[index].intScreenNo);
  clickedScreenKeyIndex.value = index;
  clickedScreenKeys();
};

/**
 * 저장 후 재조회 — 저장 전에 열려 있던 화면키를 찾아(번호 우선, 번호가 바뀌었으면 이름) 그 페이지로 가서 다시 엶.
 * 못 찾으면 첫 번째 화면키를 엶.
 */
const reopenScreenKey = (screenNo, screenName) => {
  if (screenNo == null || screenNo === "") {
    openFirstScreenKey();
    return;
  }
  const list = (ScreenKeyOrigin.value || []).filter(
    (item) => item && item.intScreenNo !== "" && item.intScreenNo != null
  );
  let idx = list.findIndex(
    (item) =>
      item.intScreenNo == screenNo &&
      (screenName == null || item.strScreenName == screenName)
  );
  if (idx < 0 && screenName != null) {
    idx = list.findIndex((item) => item.strScreenName == screenName);
  }
  if (idx < 0) {
    openFirstScreenKey();
    return;
  }
  currentsubPage.value = Math.floor(idx / 10) + 1;
  addfor10ScreenKey();
  showMenuKey(list[idx].intScreenNo);
  clickedScreenKeyIndex.value = idx % 10;
  clickedScreenKeys();
};

// watch(
//   () => MenuList.value,
//   () => {
//     showMenuKeys();
//   }
// );
// watch(
//   () => TLUList.value,
//   () => {
//     showMenuKeys2();
//   }
// );

const editScreenKey = (value, value2) => {
  currentscreenKeyNm.value = value2;
  clickedScreenNo.value = value;
  changeScreenKey.value = true;
};

const exitScreenKey = () => {
  changeScreenKey.value = false;
  addscreenKey.value = false;
};
const confirmScreenKey = () => {
  const index = ScreenKeyOrigin.value.findIndex(
    (item) => item.intScreenNo == clickedScreenNo.value
  );
  ScreenKeyOrigin.value[index].strScreenName = currentscreenKeyNm.value;
  changeScreenKey.value = false;
  //comsole.log(ScreenKeyOrigin.value);
  addfor10ScreenKey();
  currentscreenKeyNm.value = "";
  clickedScreenNo.value = "";
};

const addfor10ScreenKey = () => {
  ScreenKeys.value = [
    ...ScreenKeyOrigin.value.slice(
      10 * (currentsubPage.value - 1),
      10 * (currentsubPage.value - 1) + 10
    ),
  ];
  const validateScreenKeys = ScreenKeys.value.filter(
    (item) => item.intScreenNo != ""
  );
  if (validateScreenKeys.length < 10) {
    ScreenKeys.value.push({ strScreenName: "", intScreenNo: "", new: true });
    for (var i = 0; i < 9 - validateScreenKeys.length; i++) {
      ScreenKeys.value.push({ strScreenName: "", intScreenNo: "" });
    }
  }
};

const addfor30MenuKeys = () => {
  const length = items.value.length;
  if (length < 30) {
    for (var i = 0; i < 30 - length; i++) {
      items.value.push({ strScreenName: "", intScreenNo: "" });
    }
  }
};

const addScreenKey = (value) => {
  currentscreenKeyNm.value = "";
  addscreenKey.value = true;
  //comsole.log(value);
  clickedScreenNo.value = value + 1;
};

const confirmaddScreenKey = () => {
  if (currentscreenKeyNm.value == "" || currentscreenKeyNm.value == null) {
    Swal.fire({
      title: "오류",
      text: "화면키 이름을 입력하세요.",
      icon: "error",
      confirmButtonText: "확인",
    });
    return;
  }
  let newScreenNo;
  if (ScreenKeyOrigin.value.length == 0) {
    newScreenNo = 1;
  } else {
    newScreenNo =
      ScreenKeyOrigin.value[ScreenKeyOrigin.value.length - 1].intScreenNo + 1;
  }

  ScreenKeyOrigin.value.push({
    strScreenName: currentscreenKeyNm.value,
    intScreenNo: newScreenNo,
  });
  addscreenKey.value = false;
  addfor10ScreenKey();
  //comsole.log(ScreenKeyOrigin.value);
  currentscreenKeyNm.value = "";
  //comsole.log(clickedScreenNo.value);
  showMenuKey(clickedScreenNo.value + (currentsubPage.value - 1) * 10);
};

const prevMenuKey = () => {
  if (currmenuKeyPage.value == 1) {
    return;
  }
  currmenuKeyPage.value--;
  items.value = Array.from({ length: 30 }, (_, index) => ({
    intKeySeq: index + 1,
  }));
  MenuKeyList.value
    .filter(
      (item) =>
        item.intPosNo == posNo.value &&
        item.intScreenNo == clickedintScreenNo.value
    )
    .forEach((item) => {
      //comsole.log(item);

      const position = item.intKeySeq - (currmenuKeyPage.value - 1) * 30 - 1;
      if (position >= 0 && position < 30) {
        items.value[position] = item;
      }
    });
};
const nextMenuKey = () => {
  if (currmenuKeyPage.value == 33) {
    return;
  }
  currmenuKeyPage.value++;

  items.value = Array.from({ length: 30 }, (_, index) => ({
    intKeySeq: index + 1,
  }));

  MenuKeyList.value
    .filter(
      (item) =>
        item.intPosNo == posNo.value &&
        item.intScreenNo == clickedintScreenNo.value
    )
    .forEach((item) => {
      //comsole.log(item);
      const position = item.intKeySeq - (currmenuKeyPage.value - 1) * 30 - 1;
      if (position >= 0 && position < 30) {
        items.value[position] = item;
      }
    });
};
const existMenuKey = ref(false);
const clickedRealIndex = ref();
const clickedMenuKeyIndex = ref();
const saveMenuKeyposition = (index) => {
  //comsole.log(clickedintScreenNo.value);
  //comsole.log(index);
  //comsole.log(items.value);
  clickedMenuKeyIndex.value = index + 1;
  clickedRealIndex.value = (currmenuKeyPage.value - 1) * 30 + index + 1;
  //comsole.log(clickedRealIndex.value);
};

const addMenuKey = () => {
  //comsole.log(clickedMenuKeyIndex.value);
  if (clickedMenuKeyIndex.value == null) {
    return;
  }
  //comsole.log(items.value);
  items.value[clickedMenuKeyIndex.value] = {
    intKeyNo: TLUorNot.value == false ? 6 : 7,
    intKeySeq: clickedRealIndex.value,
    intPosNo: posNo.value,
    intScreenNo: clickedintScreenNo.value,
    lngKeyscrNo: Number(currentSelectedMenuCode.value),
    strKeyName: currentSelectedMenuNm.value,
    lngPrice: currentSelectedMenuPrice.value.substring(
      0,
      currentSelectedMenuPrice.value.length - 1
    ),
  };
  //comsole.log(items.value);
  //comsole.log(MenuKeyList.value);
  //comsole.log(posNo.value);
  //comsole.log(clickedintScreenNo.value);
  //comsole.log(clickedRealIndex.value);
  const foraddIndex = MenuKeyList.value.find(
    (item) =>
      item.intPosNo == posNo.value &&
      item.intScreenNo == clickedintScreenNo.value &&
      item.intKeySeq == clickedRealIndex.value
  );

  //comsole.log(foraddIndex);
  if (foraddIndex == undefined) {
    MenuKeyList.value.push({
      intKeyNo: TLUorNot.value == false ? 6 : 7,
      intKeySeq: clickedRealIndex.value,
      intPosNo: posNo.value,
      intScreenNo: clickedintScreenNo.value,
      lngKeyscrNo: Number(currentSelectedMenuCode.value),
      strKeyName: currentSelectedMenuNm.value,
      lngPrice: currentSelectedMenuPrice.value.substring(
        0,
        currentSelectedMenuPrice.value.length - 1
      ),
    });
  } else {
    foraddIndex.lngKeyscrNo = Number(currentSelectedMenuCode.value);
    foraddIndex.strKeyName = currentSelectedMenuNm.value;
    foraddIndex.lngPrice = currentSelectedMenuPrice.value.substring(
      0,
      currentSelectedMenuPrice.value.length - 1
    );
    foraddIndex.intKeyNo = TLUorNot.value == false ? 6 : 7;
  }

  showMenuKey(clickedintScreenNo.value);
  //comsole.log(MenuKeyList.value);
};

// const addTLUKey = () => {
//   //comsole.log(MenuKeyList.value);
//   const foraddIndex = MenuKeyList.value.findIndex(
//     (item) => item.intKeySeq == clickedRealIndex.value
//   );
//   //comsole.log(foraddIndex);
//   if (foraddIndex == -1) {
//     MenuKeyList.value.push({
//       intKeyNo: 6,
//       intKeySeq: clickedRealIndex.value,
//       intPosNo: posNo.value,
//       intScreenNo: clickedintScreenNo.value,
//       lngKeyscrNo: Number(clickedTLUCD.value),
//       strKeyName: clickedTLUNM.value,
//     });
//   } else {
//     MenuKeyList.value[foraddIndex] = {
//       intKeyNo: 6,
//       intKeySeq: clickedRealIndex.value,
//       intPosNo: posNo.value,
//       intScreenNo: clickedintScreenNo.value,
//       lngKeyscrNo: Number(clickedTLUCD.value),
//       strKeyName: clickedTLUNM.value,
//     };
//   }
//   showMenuKey(clickedintScreenNo.value);
// };

const showMenus = (value) => {
  if (value == 1) {
    currentMenuorTLU.value = false;
    currentMenu.value = false;
  } else {
    currentMenuorTLU.value = true;
    currentMenu.value = true;
    //showMenuKeys2();
    // showMenuKeys3();
  }
};
/**
 * 삭제 버튼
 */

const deletekey = () => {
  if (clickedScreenOrMenu.value == false) {
    //comsole.log(ScreenKeyOrigin.value);
    ScreenKeyOrigin.value = ScreenKeyOrigin.value
      .filter((item) => item.intScreenNo != clickedintScreenNo.value)
      .map((item, index) => ({
        ...item,
        intScreenNo: index + 1,
      }));

    addscreenKey.value = false;
    addfor10ScreenKey();

    MenuKeyList.value = MenuKeyList.value
      .filter((item) => item.intScreenNo != clickedintScreenNo.value)
      .map((item, index) => ({
        ...item,
        intScreenNo:
          item.intScreenNo > clickedintScreenNo.value
            ? item.intScreenNo - 1
            : item.intScreenNo,
      }));
    currentscreenKeyNm.value = "";

    clickedintScreenNo.value = clickedintScreenNo.value;
    showMenuKey(clickedintScreenNo.value);
  } else {
    MenuKeyList.value = MenuKeyList.value.filter(
      (item) =>
        item.intScreenNo != clickedintScreenNo.value ||
        item.intKeySeq != clickedRealIndex.value
    );
    //comsole.log(MenuKeyList.value);
    showMenuKey(clickedintScreenNo.value);
  }
};

const clickedMenukeys = () => {
  clickedScreenOrMenu.value = true;
};
const clickedScreenKeys = () => {
  clickedScreenOrMenu.value = false;
};
/**
 * 조회 초기화
 */

const handleinitAll = (newvalue) => {
  MenuGroup.value = [];
  SubMenuGroup.value = [];
  MenuKeyList.value = [];
  ScreenKeyOrigin.value = [];
  TLUList.value = [];
  AllscreenKeyPage.value = "1";
  MenuList.value = [];
  ScreenKeys.value = [];
  items.value = [];
  forsearchMain.value = "-1";
  forsearchSub.value = "-1";
  filteredSubMenuGroup.value = [];
  searchword1.value = "";
  searchword3.value = "";
  afterSearch.value = false;
};

/** 메뉴관리 "추가" — 실제 쓰는 메뉴 코드 등록(MST01_003INS)으로 이동. 프로그램 번호는 계정 메뉴마다 달라 메뉴 목록에서 찾음 (MST57_003INS 와 동일) */
const movePage1 = () => {
  const MENU_URL = "MIMASTER::MST01_003INS.xml";
  const menu = (store.state.minorCategory || []).find(
    (item) => item && item.strUrl == MENU_URL
  );
  store.state.moveOtherTab = {
    strUrl: MENU_URL,
    lngProgramID: menu?.lngProgramID ?? 73762,
    strTitle: menu?.strTitle ?? "메뉴 코드 등록.",
  };
};

/** TLU관리 "추가" — TLU 메뉴 등록(MST01_010INS). 프로그램 번호는 메뉴 목록에서 찾고 없으면 기존 값 */
const movePage2 = () => {
  const TLU_URL = "MIMASTER::MST01_010INS.xml";
  const menu = (store.state.minorCategory || []).find(
    (item) => item && item.strUrl == TLU_URL
  );
  store.state.moveOtherTab = {
    strUrl: TLU_URL,
    lngProgramID: menu?.lngProgramID ?? 73712,
    strTitle: menu?.strTitle ?? "TLU 메뉴 등록.",
  };
};
</script>

<style scoped>
/* ===== 팝업 (화면키 수정·추가·MEALTICKET) — body 로 Teleport, 덮개 z-index 10050 ===== */
.mk-pop-mask {
  position: fixed;
  inset: 0;
  z-index: 10050;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(15, 23, 42, 0.45);
}
.mk-pop {
  display: flex;
  flex-direction: column;
  width: 28rem;
  max-width: 100%;
  max-height: calc(100vh - 2rem);
  border-radius: 0.75rem;
  background: #fff;
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.25);
  overflow: hidden;
}
.mk-pop--order {
  width: 32rem;
}
.mk-pop-head {
  padding: 1.125rem 1.5rem 0.875rem;
  border-bottom: 1px solid #e2e8f0;
}
.mk-pop-head::before {
  content: "";
  display: inline-block;
  width: 4px;
  height: 1.125rem;
  margin-right: 0.5rem;
  border-radius: 2px;
  background: #2563eb;
  vertical-align: -2px;
}
.mk-pop-title {
  display: inline;
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f172a;
}
.mk-pop-desc {
  margin-top: 0.375rem;
  font-size: 0.8125rem;
  color: #64748b;
}
.mk-pop-body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
}
.mk-pop-body--scroll {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
}
.mk-pop-field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}
.mk-pop-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #334155;
}
.mk-pop-input {
  height: 2.5rem;
  padding: 0 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  font-size: 0.9375rem;
}
.mk-pop-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}
.mk-pop-foot {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
}


/* ===== 조회 AREA — MST57_003INS 와 같은 수치 =====
   콤보 8.5rem·매장 콤보 14rem·높이 2rem·테두리 #cbd5e1, 항목명→콤보 1rem, 앞 공백 = 뒤 공백 */
.mk-search {
  --mk-ctl-border: #cbd5e1;
  --mk-ctl-w: 9.1rem; /* 8.5rem × 1.07 */
  --mk-label-gap: 1rem;
  --mk-ctl-gap: 0.5rem;
  --mk-group-gap: 2.5rem;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  min-height: 3.25rem;
  margin: 0.75rem 0.5rem 0 1.25rem;
  padding: 0.5rem 0;
  background: #e5e7eb;
  border-radius: 0.5rem;
  /* 공통 .w-right 가 1440px 이하에서 width:auto → 내용 폭만큼 밀리지 않게 */
  container-type: inline-size;
}
.mk-search :deep(> div) {
  /* 넓으면 6.8cqi(최대 6.8rem), 좁아지면 한 줄(항목 합계 약 920px)이 유지되는 만큼만 줄어듦 */
  --mk-pad: min(8.8rem, 8.8cqi, max(2.5rem, calc((100cqi - 880px) / 2)));
  flex-wrap: wrap;
  justify-content: flex-start;
  column-gap: var(--mk-ctl-gap);
  row-gap: 0.5rem;
  width: 100%;
  padding-inline: var(--mk-pad);
  white-space: nowrap;
}
.mk-search :deep(> div > div:first-child) {
  margin-right: calc(var(--mk-label-gap) - var(--mk-ctl-gap));
}
.mk-search :deep(#storeGroup),
.mk-search :deep(> div > div:nth-child(3) > select) {
  width: var(--mk-ctl-w);
}
.mk-search :deep(> div > div.relative.flex-1) {
  flex: 0 0 auto;
  width: 15rem; /* 14rem × 1.07 */
}
/* KIOSK번호 블록 */
.mk-search :deep(> div > div.ml-5) {
  display: flex;
  align-items: center;
  gap: var(--mk-label-gap);
  margin-left: 0;
  padding-left: var(--mk-group-gap);
  flex-shrink: 0;
  min-height: 2rem;
}
.mk-search :deep(> div > div.ml-5 > span) {
  font-size: 1rem;
  font-weight: 600;
}
.mk-search :deep(> div > div.ml-5 select) {
  width: var(--mk-ctl-w);
  height: 2rem;
  margin-left: 0;
  padding: 0 0.5rem;
}
.mk-search :deep(select),
.mk-search :deep(.pickstore-vs-shell) {
  border: 1px solid var(--mk-ctl-border) !important;
}
.mk-search :deep(select:focus) {
  border-color: #3b82f6 !important;
}
/* 좁을 때: 둘째 줄에 KIOSK번호 ("매장명"과 시작선 맞춤) */
@container (max-width: 999.98px) {
  .mk-search :deep(> div)::after {
    content: "";
    order: 1;
    flex-basis: 100%;
    height: 0;
  }
  .mk-search :deep(> div > div.ml-5) {
    order: 2;
    padding-left: 0;
  }
}
/* 넓을 때: 한 줄, KIOSK번호는 오른쪽 끝 */
@container (min-width: 1000px) {
  .mk-search :deep(> div) {
    flex-wrap: nowrap;
  }
  .mk-search :deep(> div > div.ml-5) {
    margin-left: auto !important;
  }
}

/* ===== 본문 — 좌(메뉴 리스트)는 줄어들고, 우(키 영역)는 키 크기 유지·좁으면 가로 스크롤 ===== */
.mk-body {
  display: grid;
  /* 우측은 키 영역 폭(856px)+여유, 좌측은 남는 폭(최소 320px) */
  grid-template-columns: minmax(320px, 1fr) minmax(0, 890px);
  grid-template-rows: minmax(0, 1fr);
  column-gap: 1.5rem;
  /* 높이 = 화면 아래 끝까지(왼쪽 그리드·오른쪽 메뉴키가 남는 높이를 채움), 화면이 낮으면 안에서 스크롤 */
  flex: 1 1 auto;
  min-height: 0;
  align-items: stretch;
  margin-top: 0.75rem;
  padding: 0 0.5rem 0.5rem 1.25rem;
}
.mk-left,
.mk-right {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
}
.mk-panel-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  min-height: 2.5rem;
  padding-bottom: 0.375rem;
  border-bottom: 1px solid #d1d5db;
}
.mk-left-body {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1 1 auto;
  min-height: 0;
  padding-top: 0.5rem;
}
.mk-filter {
  display: grid;
  grid-template-columns: 7rem minmax(0, 1fr);
  grid-auto-rows: 2.5rem;
}
.mk-filter-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  padding: 0.25rem 0.5rem;
}
.mk-filter-select,
.mk-filter-input {
  flex: 1 1 0;
  min-width: 0;
  height: 2rem;
  padding: 0 0.5rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  background: #fff;
}
.mk-left-grid {
  flex: 1 1 auto;
  min-height: 200px;
}
.mk-right-scroll {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-height: 0;
  overflow: auto;
  padding-top: 0.75rem;
  contain: inline-size;
}
/* 키 영역 끝선 = 메뉴키 5칸 폭. 제목 줄·화면키·페이지 막대도 같은 끝선 */
.mk-right {
  --mk-key-w: 168px;
  --mk-key-gap: 0.5rem;
  --mk-keys-w: calc(var(--mk-key-w) * 5 + var(--mk-key-gap) * 4);
  /* 키 높이 — 메뉴키 6줄이 화면 아래 끝까지 남는 높이를 나눠 가짐 (최소 40px ~ 최대 84px).
     화면키는 화면 높이에 맞춰 36~60px. 화면이 아주 낮으면 최소 높이에서 멈추고 안에서 스크롤 */
  --mk-screen-row: clamp(36px, calc((100vh - 510px) / 9.2), 60px);
  --mk-menu-row-min: 40px;
  --mk-menu-row-max: 84px;
}
.mk-right > .mk-panel-head {
  width: 100%;
  max-width: var(--mk-keys-w);
  /* 좁을 때 순서변경·삭제가 잘리지 않고 다음 줄로 */
  flex-wrap: wrap;
  row-gap: 0.25rem;
}
.mk-key-area {
  display: flex;
  flex-direction: column;
  flex: 1 0 0;
  width: max-content;
}
.mk-hidden {
  visibility: hidden;
}
/* 화면키(카테고리) 4칸 x 2줄 */
.mk-screen-keys {
  display: grid;
  grid-template-columns: repeat(5, var(--mk-key-w));
  grid-template-rows: repeat(2, var(--mk-screen-row));
  gap: var(--mk-key-gap);
  width: var(--mk-keys-w);
}
.mk-screen-key {
  display: flex;
  width: 100%;
  height: 100%;
  border-radius: 0.5rem;
  cursor: pointer;
}
.mk-screen-key-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.125rem;
  width: 100%;
  height: 100%;
  padding: 0 0.5rem;
  text-align: center;
}
/* 위: 대카테고리 (작은 회색) / 아래: 서브카테고리 (굵게) */
.mk-screen-major {
  font-size: 0.75rem;
  color: #64748b;
}
.mk-screen-sub {
  font-size: 0.9375rem;
  font-weight: 700;
  color: #0f172a;
}
/* 선택 색 — 상단 현재 화면(남색) / 하단 선택 키(주황) */
.mk-screen-key.mk-screen-key--current {
  background: #eef2ff;
  border: 2px solid #6366f1;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
}
.mk-screen-key--current .mk-screen-major {
  color: #6366f1;
}
.mk-screen-key--current .mk-screen-sub {
  color: #3730a3;
}
.mk-screen-key.mk-screen-key--target {
  outline: 3px solid #c7d2fe;
  outline-offset: 1px;
}
/* 페이지 막대 */
.mk-pager {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: var(--mk-keys-w);
  margin-top: 0.5rem;
  padding: 0.375rem 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background: #f8fafc;
}
.mk-pager-step {
  height: 1.75rem;
  padding: 0 0.625rem;
  border: 1px solid #c7d2fe;
  border-radius: 0.375rem;
  background: #fff;
  color: #4338ca;
  font-size: 0.8125rem;
  font-weight: 600;
  white-space: nowrap;
}
.mk-pager-step:hover:not(:disabled) {
  background: #eef2ff;
}
.mk-pager-step:disabled {
  border-color: #e2e8f0;
  color: #cbd5e1;
  cursor: default;
}
.mk-pager-pages {
  display: flex;
  gap: 0.25rem;
}
.mk-pager-num {
  position: relative;
  min-width: 1.75rem;
  height: 1.75rem;
  padding: 0 0.375rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  background: #fff;
  color: #475569;
  font-size: 0.8125rem;
  font-weight: 600;
}
.mk-pager-num:hover {
  border-color: #a5b4fc;
}
.mk-pager-num--on {
  border-color: #6366f1;
  background: #6366f1;
  color: #fff;
}
/* 아래 메뉴키가 열린 카테고리가 있는 페이지 — 번호 아래 점 */
.mk-pager-num--open::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: -5px;
  width: 5px;
  height: 5px;
  margin-left: -2.5px;
  border-radius: 9999px;
  background: #6366f1;
}
.mk-pager-text,
.mk-pager-count {
  font-size: 0.8125rem;
  color: #64748b;
  white-space: nowrap;
}
.mk-pager-text {
  margin-left: auto;
}
.mk-pager-text b,
.mk-pager-count b {
  color: #3730a3;
}
/* 메뉴키 */
.mk-menu-keys-wrap {
  display: flex;
  flex-direction: column;
  flex: 1 0 0;
  margin-top: 0.625rem;
}
.mk-open-screen {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  min-height: 1.75rem;
  margin-bottom: 0.375rem;
  font-size: 0.875rem;
  color: #475569;
}
.mk-open-screen-label {
  color: #4f46e5;
  font-weight: 600;
}
.mk-open-screen-name {
  padding: 0.125rem 0.5rem;
  border: 1px solid #c7d2fe;
  border-radius: 0.375rem;
  background: #eef2ff;
  color: #3730a3;
  font-weight: 700;
}
.mk-open-screen-major {
  font-weight: 500;
  color: #6366f1;
}
.mk-open-screen-go {
  margin-left: 0.25rem;
  font-size: 0.8125rem;
  color: #4f46e5;
  text-decoration: underline;
}
.mk-menu-keys {
  display: grid;
  grid-template-columns: repeat(5, var(--mk-key-w));
  /* 5칸 x 6줄 = 한 페이지 30개 */
  /* 6줄이 남는 높이를 똑같이 나눔 — 최대 높이를 넘으면 그 아래는 여백 */
  flex: 1 0 0;
  min-height: calc(var(--mk-menu-row-min) * 6 + var(--mk-key-gap) * 5);
  grid-template-rows: repeat(6, minmax(var(--mk-menu-row-min), 1fr));
  max-height: calc(var(--mk-menu-row-max) * 6 + var(--mk-key-gap) * 5);
  gap: var(--mk-key-gap);
  width: var(--mk-keys-w);
}
.mk-menu-key {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 0.5rem;
  font-size: 0.8125rem;
  cursor: pointer;
}
/* 메뉴키 안: 위 코드(작게) / 가운데 메뉴명(굵게) / 아래 가격(오른쪽) */
/* 윗줄: 코드(왼쪽)·가격(오른쪽) / 아래: 메뉴명(가운데, 최대 2줄) — 키가 낮아져도 3줄이 겹치지 않게 */
.mk-menu-key-body {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  grid-template-rows: auto minmax(0, 1fr);
  grid-template-areas:
    "code price"
    "name name";
  column-gap: 0.25rem;
  width: 100%;
  height: 100%;
  padding: 0.1875rem 0.375rem;
  line-height: 1.2;
}
.mk-menu-key-code {
  grid-area: code;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 0.6875rem;
  color: #94a3b8;
}
.mk-menu-key-name {
  grid-area: name;
  align-self: center;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #0f172a;
  text-align: center;
}
.mk-menu-key-price {
  grid-area: price;
  white-space: nowrap;
  font-size: 0.6875rem;
  color: #475569;
}
.mk-menu-key--selected .mk-menu-key-code,
.mk-menu-key--selected .mk-menu-key-name,
.mk-menu-key--selected .mk-menu-key-price {
  color: #9a3412;
}
.mk-menu-key.mk-menu-key--selected {
  background: #fff7ed;
  border: 2px solid #f97316;
  color: #9a3412;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.25);
}
.mk-menu-keys-wrap > .mk-pager .mk-pager-count {
  margin: 0 auto;
}
/* 키오스크 화면키 — 이름 + 연필(이름 수정), 빈 칸은 화면키 추가 */
.mk-screen-key-label {
  position: relative;
  flex-direction: row;
  gap: 0.375rem;
}
/* 이름은 가운데, 수정(연필) 버튼은 오른쪽 위 모서리 */
.mk-screen-name {
  max-width: 100%;
  padding: 0 2.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.9375rem;
  font-weight: 700;
  color: #0f172a;
}
/* 결제키 설정(MST44_054INS)의 화면키 수정 버튼과 같은 모양·위치 */
.mk-screen-edit {
  position: absolute;
  top: 0.375rem;
  right: 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.625rem;
  height: 1.625rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  background: #fff;
  color: #64748b;
  font-size: 0.75rem;
}
.mk-screen-edit:hover {
  border-color: #fda4af;
  background: #fff1f2;
  color: #be123c;
}
.mk-screen-key--current .mk-screen-name {
  color: #3730a3;
}
.mk-screen-key-add {
  color: #94a3b8;
  font-size: 0.875rem;
}
.mk-screen-key-add img {
  width: 1.125rem;
  height: 1.125rem;
}
/* 왼쪽 탭 (메뉴관리 / TLU관리) — 선택 탭은 주황 밑줄 */
.mk-tabs {
  display: flex;
  align-items: flex-end;
  gap: 0.25rem;
  align-self: stretch;
  margin-bottom: -0.4375rem;
}
.mk-tab {
  padding: 0.375rem 0.875rem;
  border-bottom: 3px solid transparent;
  font-size: 1.125rem;
  font-weight: 700;
  color: #94a3b8;
  white-space: nowrap;
}
.mk-tab:hover {
  color: #475569;
}
.mk-tab.mk-tab--on {
  border-bottom-color: #f97316;
  color: #0f172a;
}
/* TLU관리 탭 — 위 TLU 목록 / 아래 구성 메뉴, 남는 높이를 6:4 로 나눔 */
.mk-tlu-grids {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-height: 0;
  gap: 0.375rem;
}
.mk-tlu-grid {
  min-height: 120px;
}
.mk-tlu-grid--main {
  flex: 6 1 0;
}
.mk-tlu-grid--sub {
  flex: 4 1 0;
}
.mk-tlu-sub-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #334155;
}
.mk-tlu-sub-title::before {
  content: "";
  display: inline-block;
  width: 3px;
  height: 0.875rem;
  margin-right: 0.375rem;
  border-radius: 2px;
  background: #2563eb;
  vertical-align: -1px;
}
/* 화면키 순서 변경 팝업 — body 로 Teleport */
.mk-order-mask {
  position: fixed;
  inset: 0;
  z-index: 10050;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(15, 23, 42, 0.45);
}
.mk-order-pop {
  display: flex;
  flex-direction: column;
  width: 32rem;
  max-width: 100%;
  max-height: calc(100vh - 2rem);
  border-radius: 0.75rem;
  background: #fff;
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.25);
  overflow: hidden;
}
.mk-order-head {
  padding: 1.125rem 1.5rem 0.875rem;
  border-bottom: 1px solid #e2e8f0;
}
.mk-order-head::before {
  content: "";
  display: inline-block;
  width: 4px;
  height: 1.125rem;
  margin-right: 0.5rem;
  border-radius: 2px;
  background: #2563eb;
  vertical-align: -2px;
}
.mk-order-title {
  display: inline;
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f172a;
}
.mk-order-desc {
  margin-top: 0.375rem;
  font-size: 0.8125rem;
  line-height: 1.45;
  color: #64748b;
}
.mk-order-body {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  padding: 1rem 1.5rem;
  background: #f8fafc;
}
.mk-order-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.mk-order-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  height: 3rem;
  padding: 0 0.875rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background: #fff;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.06);
  font-size: 0.9375rem;
  color: #0f172a;
  cursor: grab;
  user-select: none;
  transition: border-color 0.15s, background-color 0.15s, box-shadow 0.15s;
}
.mk-order-item:hover {
  border-color: #a5b4fc;
  background: #f8faff;
}
.mk-order-item:active {
  cursor: grabbing;
}
.mk-order-grip {
  width: 1.125rem;
  height: 1.125rem;
  flex-shrink: 0;
  fill: #94a3b8;
}
.mk-order-no {
  min-width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
  border-radius: 9999px;
  background: #eef2ff;
  color: #4338ca;
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1.5rem;
  text-align: center;
}
.mk-order-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/* 끌고 있는 항목이 놓일 자리 */
.mk-order-ghost {
  border: 1px dashed #3b82f6;
  background: #eff6ff;
  box-shadow: none;
}
.mk-order-ghost > * {
  opacity: 0.35;
}
/* 잡은 항목 */
.mk-order-chosen {
  border-color: #3b82f6;
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.18);
}
.mk-order-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.875rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  background: #fff;
}
.mk-order-hint {
  font-size: 0.8125rem;
  color: #64748b;
}
</style>
