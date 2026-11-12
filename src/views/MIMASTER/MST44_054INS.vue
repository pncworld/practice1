/*--############################################################################
# Filename : MST44_054INS.vue                                                  
# Description : 마스터관리 > POS 마스터 > 결제키 설정(#)                        
# Date :2025-05-14                                                             
# Author : 권맑음                     
################################################################################*/
<template>
  <!-- 조회 조건 -->
  <div class="flex justify-between items-center w-full overflow-y-hidden">
    <PageName></PageName>
    <div class="flex justify-center mr-10 space-x-2 pr-5">
      <button @click="searchButton" class="button search md:w-auto w-14">
        조회
      </button>

      <button @click="saveButton" class="button save w-auto">저장</button>
      <button @click="copyButton" class="button copy w-auto">복사</button>
    </div>
  </div>
  <!-- 조회 AREA: 한 줄 고정(줄바꿈 금지), 좁으면 이 영역만 가로 스크롤 -->
  <div class="mst54-search">
    <PickStore
      compact-search-bar
      :compact-store-combo-max-rem="mst54StoreComboRem"
      @areaCd="handleStoreAreaCd"
      @update:storeCd="handleStoreCd"
      @posNo="handlePosNo"
      :showPosNo="true"
      :showPayType="true"
      @storeNm="handlestoreNm"
      @update:ischanged="handleinitAll"
      @update:ischanged2="searchinit"
      @updatePaymentType="updatePaymentType"></PickStore>
  </div>

  <div class="z-50">
    <DupliPopUp3
      :isVisible="showPopup2"
      @close="showPopup2 = false"
      :storeCd="nowStoreCd"
      :poskiosk="'getStoreDistinctList'"
      :storeNm="clickedStoreNm"
      :areaCd="nowStoreAreaCd"
      :posNo="posNo"
      :screenType="currentpaymentCd"
      :screenList="screenList"
      :progname="'MST44_054INS_VUE'"
      :dupliapiname="'DUPLIPAYKEY'"
      :progid="2"
      :naming="'POS번호'">
    </DupliPopUp3>
  </div>

  <!-- 화면키 수정 팝업 -->
  <Teleport to="body">
    <div v-if="changeScreenKey" class="mst54-pop-mask">
      <div class="mst54-pop" role="dialog" aria-modal="true">
        <div class="mst54-pop-head">
          <h2 class="mst54-pop-title">화면키 수정</h2>
        </div>
        <div class="mst54-pop-body">
          <label class="mst54-pop-field">
            <span class="mst54-pop-label">화면키명</span>
            <input
              type="text"
              class="mst54-pop-input"
              v-model="currentscreenKeyNm" />
          </label>
          <label v-if="currentpaymentCd == 3" class="mst54-pop-field">
            <span class="mst54-pop-label">화면키 유형</span>
            <select
              name=""
              id=""
              class="mst54-pop-input"
              v-model="currentProduct"
              :disabled="showEditProduct">
              <option :value="0">기본</option>
              <option :value="1">품목할인</option>
            </select>
          </label>
          <ul v-if="currentpaymentCd == 3" class="mst54-pop-notes">
            <li>화면키는 기본 또는 품목할인으로 유형을 선택할 수 있습니다.</li>
            <li>품목할인은 매장 당 하나의 화면키만 설정할 수 있습니다.</li>
            <li>
              화면키 유형이 품목할인인 경우, 결제코드를 등록하거나 수정할 수
              없으며, 품목할인 결제코드가 자동으로 노출됩니다.
            </li>
          </ul>
        </div>
        <div class="mst54-pop-foot">
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
    <div v-if="addscreenKey" class="mst54-pop-mask">
      <div class="mst54-pop" role="dialog" aria-modal="true">
        <div class="mst54-pop-head">
          <h2 class="mst54-pop-title">화면키 추가</h2>
        </div>
        <div class="mst54-pop-body">
          <label class="mst54-pop-field">
            <span class="mst54-pop-label">화면키명</span>
            <input
              type="text"
              class="mst54-pop-input"
              v-model="currentscreenKeyNm" />
          </label>
          <label v-if="currentpaymentCd == 3" class="mst54-pop-field">
            <span class="mst54-pop-label">화면키 유형</span>
            <select class="mst54-pop-input" v-model="currentProduct">
              <option :value="0">기본</option>
              <option :value="1">품목할인</option>
            </select>
          </label>
        </div>
        <div class="mst54-pop-foot">
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
  <!-- 그리드 영역-->
  <!-- 드래그 영역-->
  <!-- 화면키 순서 변경 팝업 -->
  <Teleport to="body">
    <div v-show="showChangeScreenKey" class="mst54-pop-mask">
      <div class="mst54-pop mst54-pop--order" role="dialog" aria-modal="true">
        <div class="mst54-pop-head">
          <h2 class="mst54-pop-title">화면키 순서 변경</h2>
          <p class="mst54-pop-desc">화면키를 끌어서 이동하면 순서가 변경됩니다.</p>
        </div>
        <div class="mst54-pop-body mst54-pop-body--scroll">
          <!-- VueDraggableNext 사용 -->
          <VueDraggableNext
            v-model="ScreenKeyOrigin"
            :group="{ name: 'subCategory', pull: 'clone', put: true }"
            class="mst54-order-list"
            :move="onMove2"
            @end="onEnd2">
            <div
              v-for="(item, index) in ScreenKeyOrigin"
              class="mst54-order-item"
              v-show="item && item.strScreenName !== ''">
              <svg class="mst54-order-grip" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <circle cx="9" cy="6" r="1.6" /><circle cx="15" cy="6" r="1.6" />
                <circle cx="9" cy="12" r="1.6" /><circle cx="15" cy="12" r="1.6" />
                <circle cx="9" cy="18" r="1.6" /><circle cx="15" cy="18" r="1.6" />
              </svg>
              <span class="mst54-order-no">{{ index + 1 }}</span>
              <p>{{ item.strScreenName }}</p>
            </div>
          </VueDraggableNext>
        </div>
        <div class="mst54-pop-foot">
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
  <!-- 본문: 좌(결제코드 목록) / 우(결제키 설정). 키 크기는 고정, 좁아지면 우측 패널만 가로 스크롤 -->
  <div class="mst54-body">
    <div class="mst54-left">
      <div class="mst54-panel-head">
        <div class="font-bold text-xl">
          <!-- <button class="contents_tab-button " :class="{'text-blue-600' : currentMenu==false }" @click="showMenus(1)">메뉴관리</button> -->
          할인/결제 코드 선택
        </div>
        <!-- <button class="whitebutton" @click="searchAmountList3">조회</button> -->
        <button class="whitebutton" @click="movePage">추가</button>
      </div>
      <div class="mst54-left-body" v-show="currentMenu == false">
        <div class="grid grid-cols-[1fr,3fr] gap-0 w-full">
          <div class="customtableIndex border border-gray-400 rounded-l-lg">
            결제코드/명
          </div>
          <div class="px-1 py-1 border border-gray-300 rounded-r-lg">
            <input
              type="text"
              class="border w-full h-full px-1 border-gray-400 rounded-lg"
              @input="searchAmountList" />
          </div>
        </div>
        <div class="mst54-left-grid">
          <Realgrid
            class="w-full h-full"
            :progname="'MST44_054INS_VUE'"
            :progid="1"
            :rowData="rowData"
            :showGrid="showGrid"
            :showCheckBar="false"
            @selcetedrowData="selcetedrowData"
            :searchWord="searchword1"
            :searchColId="'lngCode,strName'"></Realgrid>
        </div>
        <div class="mst54-notes">
          <div title="※ 사용여부가 미사용인 결제코드는 목록에서 노출되지 않습니다.">
            ※ 사용여부가 미사용인 결제코드는 목록에서 노출되지 않습니다.
          </div>
          <div title="※ 복사시 결제코드 항목을 추가해야 결제키 화면에 노출됩니다.">
            ※ 복사시 결제코드 항목을 추가해야 결제키 화면에 노출됩니다.
          </div>
        </div>
      </div>
    </div>
    <div class="mst54-right">
      <div class="mst54-panel-head">
        <div class="flex items-center gap-4">
          <h1 class="font-bold text-xl whitespace-nowrap">결제키 설정</h1>
          <!-- 화면키 순서 변경 — 이전/다음은 화면키 아래 페이지 막대로 옮김 -->
          <div class="mst54-screen-nav" v-show="afterSearch">
            <button
              class="border border-[#CCCCCC] h-full w-full rounded-md flex justify-center items-center"
              title="화면키 순서 변경"
              @click="showScreenKeysOrder">
              <img src="../../assets/table-change_2.svg" alt="" />
            </button>
          </div>
        </div>
        <span class="flex items-center gap-3 whitespace-nowrap"
          >순서변경<label class="flex items-center gap-1"
            ><input
              type="radio"
              name="changingMode"
              @click.stop="changingMode(1)"
              checked />교체하기</label
          ><label class="flex items-center gap-1"
            ><input
              type="radio"
              name="changingMode"
              @click.stop="changingMode(2)" />밀어내기</label
          ><button class="whitebutton" @click.stop="deletekey">
            삭제
          </button></span
        >
      </div>
      <div class="mst54-right-scroll">
      <div class="mst54-key-area">
      <!-- 조회 전에는 보이지 않게만 하고 자리는 유지(visibility) — 시작할 때부터 본문 높이가 같도록 -->
      <div class="mst54-screen-row" :class="{ 'mst54-hidden': !afterSearch }">
        <div class="mst54-screen-keys">
          <div
            v-for="(item, index) in ScreenKeys"
            class="custom-grid-style mst54-screen-key"
            :class="{
              'mst54-screen-key--current':
                items.length > 0 &&
                item.intScreenNo !== '' &&
                item.intScreenNo != null &&
                item.intScreenNo == clickedintScreenNo,
              'mst54-screen-key--target':
                clickedScreenKeyIndex == index &&
                clickedScreenOrMenu == false &&
                item.intScreenNo == clickedintScreenNo,
            }"
            @click="
              clickedScreenKeyIndex = index;
              clickedScreenKeys();
            ">
            <p
              v-if="item.strScreenName != ''"
              @click="showKeys(item.intScreenNo)"
              class="flex items-center justify-center w-full h-full">
              <button class="">{{ item.strScreenName }}</button
              ><button
                type="button"
                class="mst54-screen-edit"
                title="화면키 수정"
                @click.stop="
                  editScreenKey(
                    item.intScreenNo,
                    item.strScreenName,
                    item.itemDiscYn
                  )
                ">
                <font-awesome-icon :icon="['far', 'pen-to-square']" />
              </button>
            </p>
            <p
              v-else-if="item.new == true"
              @click="addScreenKey(index)"
              class="flex items-center justify-center w-full h-full">
              <button
                class="w-full h-full text-gray-300 flex justify-center items-center">
                <img src="../../assets/ic_add_gray_24.png" alt="" /> 화면키 추가
              </button>
            </p>
            <p v-else class="flex items-center justify-center"></p>
          </div>
        </div>
      </div>
      <!-- 화면키 페이지 막대 — 화면키는 4개씩 보이므로 지금 몇 번째 묶음인지·전체 몇 개인지 표시, 번호로 바로 이동 -->
      <div class="mst54-screen-pager" :class="{ 'mst54-hidden': !afterSearch }">
        <button
          type="button"
          class="mst54-pager-step"
          :disabled="mst54ScreenPager.page <= 1"
          @click="showPrev">
          ‹ 이전
        </button>
        <div class="mst54-pager-pages">
          <button
            v-for="n in mst54ScreenPager.pages"
            :key="n"
            type="button"
            class="mst54-pager-num"
            :class="{
              'mst54-pager-num--on': n == mst54ScreenPager.page,
              'mst54-pager-num--open': mst54OpenScreen && n == mst54OpenScreen.page,
            }"
            :title="
              mst54OpenScreen && n == mst54OpenScreen.page
                ? `열린 화면: ${mst54OpenScreen.name}`
                : `${n} 페이지`
            "
            @click="mst54GoScreenPage(n)">
            {{ n }}
          </button>
        </div>
        <button
          type="button"
          class="mst54-pager-step"
          :disabled="mst54ScreenPager.page >= mst54ScreenPager.pages"
          @click="showNext">
          다음 ›
        </button>
        <span class="mst54-pager-text">
          <template v-if="mst54ScreenPager.total == 0">화면키 없음</template>
          <template v-else-if="mst54ScreenPager.from > mst54ScreenPager.total"
            >새 화면키 추가 칸 · 총 {{ mst54ScreenPager.total }}개</template
          >
          <template v-else
            >화면키 <b>{{ mst54ScreenPager.from }}–{{ mst54ScreenPager.to }}</b> /
            총 {{ mst54ScreenPager.total }}개</template
          >
        </span>
      </div>

      <div class="mst54-menu-keys-wrap" :class="{ 'mst54-hidden': !afterSearch }">
        <!-- 아래 결제키가 어느 화면키 것인지 — 위 화면키를 다른 페이지로 넘겨도 유지 -->
        <div class="mst54-open-screen">
          <template v-if="mst54OpenScreen">
            <span class="mst54-open-screen-label">현재 화면</span>
            <span class="mst54-open-screen-name">{{ mst54OpenScreen.name }}</span>
            <button
              v-if="mst54OpenScreen.page != mst54ScreenPager.page"
              type="button"
              class="mst54-open-screen-go"
              @click="mst54GoScreenPage(mst54OpenScreen.page)">
              화면키 위치로 ({{ mst54OpenScreen.page }}페이지)
            </button>
          </template>
          <template v-else>위에서 화면키를 선택하면 결제키가 표시됩니다.</template>
        </div>
        <div>
          <VueDraggableNext
            v-model="items"
            :move="onMove"
            @end="onEnd"
            animation="200"
            class="mst54-menu-keys">
            <div
              v-for="(item, index) in items"
              class="custom-grid-style mst54-menu-key"
              :class="{
                'mst54-menu-key--selected':
                  clickedMenuKey == index && clickedScreenOrMenu == true,
              }"
              @click="
                index !== 29 &&
                  item.itemDiscYn == 0 &&
                  (saveMenuKeyposition(index),
                  (clickedMenuKey = index),
                  clickedMenukeys())
              ">
              <span
                class="flex flex-col items-center justify-center w-full h-full rounded-lg"
                :class="{ '!bg-gray-300': index == 29 || item.itemDiscYn == 1 }"
                ><span class="flex justify-center items-center">{{
                  item ? item.lngKeyScrNo : ""
                }}</span
                ><span class="flex justify-center items-center">{{
                  item ? item.strName : ""
                }}</span></span
              >
            </div>
          </VueDraggableNext>
        </div>
      </div>
      </div>
      </div>
    </div>
  </div>
  <!-- 드래그 영역-->
</template>

<script setup>
import {
  getAllScreenList,
  getAmountList,
  saveAllMenuKey2,
  saveScreenKeys2,
} from "@/api/master";
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

import DupliPopUp3 from "@/components/dupliPopUp3.vue";
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
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
import Autocompletecomponet from "@/components/autocompletecomponet.vue";

/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
});
// 더미 데이터
const items = ref([]);
const clickedScreenKeyIndex = ref();
const ScreenKeyOrigin = ref([]);
const clickedMenuKey = ref();
const ScreenKeys = ref([]);
/** 조회 AREA 매장 콤보 폭(rem) — PickStore compact 기본 12rem 대신 매장명이 다 보이도록 */
const mst54StoreComboRem = 14;
const currentMenuorTLU = ref(false);
/**
 *  그리드 검색어 세팅
 */

const searchword1 = ref();
/**
 *  그리드 검색어 세팅
 */

const searchword3 = ref();
const forsearchMain = ref("0");
const forsearchSub = ref("0");
const addscreenKey = ref(false);
const searchWord = ref("");
const searchWord2 = ref("");
const afterSearch2 = ref(false);
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

const movePage = () => {
  store.state.moveOtherTab = {
    strUrl: "MIMASTER::MST36_001INS.xml",
    lngProgramID: 73645,
    strTitle: "결제 코드 등록.",
  };
};
const nowscreenNo = ref();
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
const currentMenu = ref(false);

/**
 * 복사 함수
 */

const copyButton = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고.",
      text: "조회를 먼저 해주세요",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  showPopup2.value = true;
};

/** 상단 화면키 안내(표시 전용) — 한 번에 4개씩 보이므로 앞·뒤 페이지에 남은 화면키 수 */
const mst54ScreenPager = computed(() => {
  const total = (ScreenKeyOrigin.value || []).filter(
    (item) => item && item.intScreenNo !== "" && item.intScreenNo != null
  ).length;
  const page = Number(currentsubPage.value) || 1;
  // 넘김 한계는 기존 showNext 와 같은 AllscreenKeyPage (4의 배수일 때 '화면키 추가' 칸 페이지 포함)
  const pages = Math.max(
    1,
    Math.ceil(total / 4),
    Number(AllscreenKeyPage.value) || 1
  );
  return {
    page,
    pages,
    total,
    from: (page - 1) * 4 + 1,
    to: Math.min(total, page * 4),
  };
});

/** 아래 결제키가 펼쳐진 화면키(이름·몇 페이지에 있는지) — 다른 페이지로 넘겨도 어느 화면 것인지 알리기 위함 (표시 전용) */
const mst54OpenScreen = computed(() => {
  if (!items.value.length) return null;
  const list = (ScreenKeyOrigin.value || []).filter(
    (item) => item && item.intScreenNo !== "" && item.intScreenNo != null
  );
  const idx = list.findIndex(
    (item) => item.intScreenNo == clickedintScreenNo.value
  );
  if (idx < 0) return null;
  return { name: list[idx].strScreenName, page: Math.floor(idx / 4) + 1 };
});

/** 페이지 점 클릭 — 기존 이전/다음(showPrev/showNext)을 필요한 횟수만큼 호출 */
const mst54GoScreenPage = (n) => {
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

  addfor4ScreenKey();
};
const showPrev = () => {
  //comsole.log(ScreenKeyOrigin.value);
  if (currentsubPage.value == 1) {
    return;
  }
  currentsubPage.value--;
  ScreenKeys.value = ScreenKeyOrigin.value.slice(
    4 * (currentsubPage.value - 1),
    4 * (currentsubPage.value - 1) + 4
  );
};
const updateMenuKey = ref(false);

const nowStoreAreaCd = ref();
/**
 *  pickStore - 지역코드 세팅
 */

const handleStoreAreaCd = (newValue) => {
  nowStoreAreaCd.value = newValue;
  //comsole.log(nowStoreAreaCd.value);
};

const nowStoreCd = ref();
const afterCategory = ref(false);
/**
 * 페이지 매장 코드 세팅
 */

const handleStoreCd = async (newValue) => {
  if (newValue == "0") {
    afterSearch.value = false;
  }
  nowStoreCd.value = newValue;
};
const Category = ref([]);

const MenuGroup = ref([]);
const confirmitem2 = ref([]);
const SubMenuGroup = ref([]);
const rowData = ref([]);

const store = useStore();
const currentProduct = ref(0);
const showEditProduct = ref(false);
const userData = store.state.userData;
const groupCd = ref(userData.lngStoreGroup);
const modified = ref(false);
const afterSearch = ref(false);
const AmountList = ref([]);
const KeyList = ref([]);
const screenList = ref([]);
const clickedScreenOrMenu = ref(false);
const TLUList = ref([]);
const clickedScreenNo = ref();

const toNum = (value, fallback = 0) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const getScreenOption = (item) =>
  toNum(item?.intScreenOption ?? item?.itemDiscYn, 0) === 1 ? 1 : 0;

const isItemDiscountPayCode = (item) => {
  if (!item) return false;
  return toNum(item.lngDiscType) === 1;
};

const uniqueItemDiscountCodes = (screenNo) => {
  const map = new Map();
  const addCode = (code, name, extra) => {
    if (code == null || code === "") return;
    const key = String(code);
    if (!map.has(key)) {
      map.set(key, {
        ...(extra || {}),
        lngCode: code,
        strName: name || extra?.strName || extra?.strKeyName || "",
      });
    }
  };

  (AmountList.value || []).forEach((item) => {
    if (!isItemDiscountPayCode(item)) return;
    addCode(item.lngCode, item.strName, item);
  });

  if (map.size === 0) {
    (KeyList.value || []).forEach((item) => {
      if (screenNo != null && item.intScreenNo != screenNo) return;
      addCode(
        item.lngKeyScrNo ?? item.lngCode,
        item.strName || item.strKeyName,
        item
      );
    });
  }

  return [...map.values()];
};

const applyPayCodeListByScreen = (isItemDiscScreen, screenNo) => {
  const list = AmountList.value || [];
  if (!isItemDiscScreen) {
    rowData.value = list;
    return;
  }
  rowData.value = uniqueItemDiscountCodes(screenNo);
};

const getScreenNoGroup = (type) => {
  const t = toNum(type);
  if (t === 3 || t === 4) return "3-4";
  return String(t);
};

const isSameScreenNoGroup = (item, type = currentpaymentCd.value) => {
  if (!item) return false;
  if (item.intScreenType == null || item.intScreenType === "") return true;
  return getScreenNoGroup(item.intScreenType) === getScreenNoGroup(type);
};

const nextScreenNoForType = () => {
  const nos = [...(ScreenKeyOrigin.value || []), ...(screenList.value || [])]
    .filter(
      (item) =>
        item &&
        item.intScreenNo !== "" &&
        item.intScreenNo != null &&
        isSameScreenNoGroup(item)
    )
    .map((item) => toNum(item.intScreenNo, 0))
    .filter((num) => num > 0);
  return (nos.length ? Math.max(...nos) : 0) + 1;
};

/**
 * 조회 함수
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
      text: "POS번호를 선택하세요.",
      icon: "warning",
      showCancelButton: false,
      confirmButtonColor: "#3085d6",
      allowOutsideClick: false,
    });
    return;
  }
  store.state.loading = true;
  try {
    const res4 = await getAmountList(
      groupCd.value,
      nowStoreCd.value,
      nowStoreAreaCd.value,
      posNo.value,
      Number(currentpaymentCd.value)
    );
    //comsole.log(res4);
    AmountList.value = res4.data.AmountList || [];
    ScreenKeyOrigin.value = (res4.data.AmountScreenList || []).map((item) => {
      const option = getScreenOption(item);
      return {
        ...item,
        intScreenOption: option,
        itemDiscYn: option,
      };
    });
    //comsole.log(ScreenKeyOrigin.value);
    KeyList.value = res4.data.AmountKeyList;
    if (KeyList.value == null) {
      KeyList.value = [];
    }
    AmountList.value = AmountList.value.map((item) => {
      return {
        ...item,
        add: "추가",
      };
    });
    applyPayCodeListByScreen(false);

    const res2 = await getAllScreenList(
      groupCd.value,
      nowStoreCd.value,
      nowStoreAreaCd.value,
      posNo.value
    );
    screenList.value = res2.data.ALLScreenList;
    //comsole.log(screenList.value);
    //comsole.log(KeyList.value);

    addfor4ScreenKey();
    //comsole.log(ScreenKeyOrigin.value);
    AllscreenKeyPage.value = Math.ceil(ScreenKeyOrigin.value.length / 4);
    confirmitem.value = JSON.parse(JSON.stringify(KeyList.value));
    confirmitem2.value = JSON.parse(JSON.stringify(ScreenKeyOrigin.value));

    ////console.log(res4);
    ////console.log(res2);
  } catch (error) {
    afterSearch.value = false;
  } finally {
    store.state.loading = false; // 로딩 상태 종료
    modified.value = false;
    afterCategory.value = false;
    afterSearch.value = true;
    clickedMenuKey.value = -1;
  }

  calculateMaxSubCode();
};
const filteredSubMenuGroup = ref([]);
const setSubCd = () => {
  //comsole.log(forsearchMain.value);
  //comsole.log(SubMenuGroup.value);
  filteredSubMenuGroup.value = SubMenuGroup.value.filter(
    (item) => item.sublngMajor == forsearchMain.value
  );
  //comsole.log(filteredSubMenuGroup.value);
  forsearchSub.value = "0";
  searchAmountList3();
};
watch(forsearchSub, (newValue) => {
  searchAmountList3();
});
const clickedintScreenNo = ref();
const calculateMaxSubCode = () => {
  maxSubCode.value = Math.max(
    ...Category.value
      .filter((item) => item.SubCategory && item.SubCategory.length > 0)
      .flatMap((item) => item.SubCategory.map((sub) => Number(sub.SubCode)))
  );
};
const showKeys = (value) => {
  if (clickedintScreenNo.value != value) {
    currmenuKeyPage.value = 1;
  }
  //comsole.log(value);
  clickedintScreenNo.value = value;
  const currentScreen = ScreenKeyOrigin.value.find(
    (item) => item.intScreenNo == value
  );
  const thisProduct = getScreenOption(currentScreen) === 1;
  applyPayCodeListByScreen(thisProduct, value);
  if (thisProduct) {
    clickedRealIndex.value = "";
    const discCodes = uniqueItemDiscountCodes(value);
    items.value = Array.from({ length: 30 }, (_, index) => {
      const code = discCodes[index];
      if (code) {
        return {
          intKeySeq: index + 1,
          itemDiscYn: 1,
          lngKeyScrNo: code.lngCode,
          strName: code.strName,
        };
      }
      return {
        intKeySeq: index + 1,
        itemDiscYn: 1,
      };
    });
  } else {
    items.value = Array.from({ length: 30 }, (_, index) => ({
      intKeySeq: index + 1,
      itemDiscYn: 0,
    }));
    KeyList.value
      .filter((item) => item.intScreenNo == value)
      .forEach((item) => {
        const position = item.intKeySeq - (currmenuKeyPage.value - 1) * 30 - 1;
        if (position >= 0 && position < 30) {
          items.value[position] = item;
        }
      });
  }
  afterSearch2.value = true;
};
watch(ScreenKeys, (newvalue) => {
  AllscreenKeyPage.value = Math.floor(ScreenKeyOrigin.value.length / 4) + 1;
});

const showScreenKeysOrder = () => {
  showChangeScreenKey.value = !showChangeScreenKey.value;
};

let targetItemIndex2;
const onMove = (evt) => {
  // 예: 드래그 중 이동할 때의 조건 등을 설정할 수 있음
  if (changeMode.value == false) {
    targetItemIndex2 = Array.from(evt.from.children).indexOf(evt.related);
    //comsole.log(targetItemIndex2);

    return false;
  } else {
    return true;
  }
};
let dupliScreenKeyOrigin;
const onMove2 = () => {
  dupliScreenKeyOrigin = [...ScreenKeyOrigin.value];
  return true;
};
const clickedMove = ref(false);
const onEnd = (evt) => {
  if (targetItemIndex2 == undefined) {
    targetItemIndex2 = evt.oldIndex;
  }
  ////console.log(targetItemIndex2);
  ////console.log(items.value);
  const discyn = items.value.filter((item) => item.itemDiscYn == 1).length;
  if (evt.oldIndex == 29 || targetItemIndex2 == 29 || discyn > 0) {
    return;
  }
  // Swap을 처리할 조건
  if (changeMode.value === false) {
    const oldIndex = evt.oldIndex; // 드래그된 아이템의 기존 인덱스
    const swappedItems = [...items.value]; // items를 복사
    //comsole.log(oldIndex);
    //comsole.log(targetItemIndex2);
    const temp = swappedItems[oldIndex];

    swappedItems[oldIndex] = swappedItems[targetItemIndex2];

    swappedItems[targetItemIndex2] = temp;

    //comsole.log(swappedItems);
    // 배열을 업데이트
    //   items.value = swappedItems;

    items.value = swappedItems.map((item, index) => ({
      ...item, // 기존 객체의 다른 속성 유지
      intKeySeq: index + (currmenuKeyPage.value - 1) * 30 + 1, // 배열 순서대로 intKeySeq 재정렬
    }));
  } else {
    updateMenuKey.value = true;
    items.value = items.value.map((item, index) => ({
      ...item, // 기존 객체의 다른 속성 유지
      intKeySeq: index + (currmenuKeyPage.value - 1) * 30 + 1, // 배열 순서대로 intKeySeq 재정렬
    }));
  }
  //comsole.log(clickedintScreenNo.value);
  //comsole.log(KeyList.value);
  //comsole.log(currmenuKeyPage.value);
  KeyList.value = KeyList.value.filter(
    (item) => item.intScreenNo != clickedintScreenNo.value
  );
  //comsole.log(KeyList.value);
  items.value.forEach((item) => {
    if (item.lngKeyScrNo != undefined) {
      KeyList.value.push(item);
    }
  });

  clickedMenuKey.value =
    changeMode.value == false ? targetItemIndex2 : evt.newIndex;
  //comsole.log("Items:", items.value);
  //comsole.log("KeyList:", KeyList.value);
};
function formatNumber(value) {
  if (!value) return "";
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
const onEnd2 = (evt) => {
  const previous = Array.isArray(dupliScreenKeyOrigin)
    ? dupliScreenKeyOrigin
    : [];
  const current = ScreenKeyOrigin.value || [];
  const dragged = previous[evt?.oldIndex];

  // 저장값은 배열 순서가 아니라 intScreenNo다. 조회도 이 번호 순으로 돌아오므로
  // 드래그로 바뀐 위치에 기존 화면번호를 오름차순으로 다시 붙인다.
  if (previous.length > 0 && previous.length === current.length) {
    const sortedNos = previous
      .map((item) => toNum(item.intScreenNo, 0))
      .sort((a, b) => a - b);
    const oldToNew = new Map();

    current.forEach((item, index) => {
      const oldNo = toNum(item.intScreenNo, 0);
      const newNo = sortedNos[index];
      if (oldNo !== newNo) oldToNew.set(oldNo, newNo);
      item.intScreenNo = newNo;
    });

    if (oldToNew.size > 0) {
      (KeyList.value || []).forEach((item) => {
        const oldNo = toNum(item.intScreenNo, 0);
        if (oldToNew.has(oldNo)) item.intScreenNo = oldToNew.get(oldNo);
      });
      (screenList.value || []).forEach((item) => {
        if (toNum(item.intScreenType) !== toNum(currentpaymentCd.value)) return;
        const oldNo = toNum(item.intScreenNo, 0);
        if (oldToNew.has(oldNo)) item.intScreenNo = oldToNew.get(oldNo);
      });
      const clickedNo = toNum(clickedintScreenNo.value, 0);
      if (oldToNew.has(clickedNo)) {
        clickedintScreenNo.value = oldToNew.get(clickedNo);
      }
    }
  }

  addfor4ScreenKey();
  const focusNo = dragged
    ? toNum(dragged.intScreenNo, 0)
    : clickedintScreenNo.value;
  if (focusNo) showKeys(focusNo);
};
/**
 * 저장 함수
 */
const saveButton = async () => {
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
    JSON.stringify(confirmitem.value) == JSON.stringify(KeyList.value) &&
    JSON.stringify(confirmitem2.value) == JSON.stringify(ScreenKeyOrigin.value)
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
        const screenKeyDisc = ScreenKeyOrigin.value.map((item) =>
          getScreenOption(item) === 1 ? "1" : "0"
        );

        const res = await saveScreenKeys2(
          groupCd.value,
          nowStoreCd.value,
          nowStoreAreaCd.value,
          posNo.value,
          screenKeyNoarr.join("\u200B"),
          screenKeyNamearr.join("\u200B"),
          screenKeyDisc.join("\u200B"),
          currentpaymentCd.value
        );

        const saveKeys = [...(KeyList.value || [])];
        ScreenKeyOrigin.value.forEach((screen) => {
          if (getScreenOption(screen) !== 1) return;
          if (saveKeys.some((item) => item.intScreenNo == screen.intScreenNo)) {
            return;
          }
          saveKeys.push({
            intKeySeq: 1,
            intScreenNo: screen.intScreenNo,
            lngKeyScrNo: 0,
            strName: "",
            itemDiscYn: 1,
          });
        });
        // 번호가 바뀌어 결제키가 빠진 화면은 삭제만 하도록 표시한다.
        // itemDiscYn 1 은 서버에서 해당 화면 키를 지우고 다시 넣지 않는다.
        ScreenKeyOrigin.value.forEach((screen) => {
          const screenNo = toNum(screen.intScreenNo, 0);
          if (!screenNo) return;
          if (saveKeys.some((item) => toNum(item.intScreenNo, 0) === screenNo)) {
            return;
          }
          saveKeys.push({
            intKeySeq: 1,
            intScreenNo: screenNo,
            lngKeyScrNo: 0,
            strName: "",
            itemDiscYn: 1,
          });
        });

        const intKeySeqs = saveKeys.map((item) => item.intKeySeq);
        const screenNumarr = saveKeys.map((item) => item.intScreenNo);
        const lngScrarr = saveKeys.map((item) => item.lngKeyScrNo);
        const menuKeyNmarr = saveKeys.map((item) => item.strName);
        const itemDiscYnarr = saveKeys.map((item) =>
          toNum(item.itemDiscYn) === 1 ? 1 : 0
        );
        //comsole.log(posNo.value);
        //comsole.log(intKeySeqs.join(","));
        //comsole.log(screenNumarr.join(","));
        //comsole.log(lngScrarr.join(","));
        //comsole.log(menuKeyNmarr.join(","));
        const res2 = await saveAllMenuKey2(
          groupCd.value,
          nowStoreCd.value,
          nowStoreAreaCd.value,
          posNo.value,
          intKeySeqs.join("\u200B"),
          screenNumarr.join("\u200B"),
          lngScrarr.join("\u200B"),
          menuKeyNmarr.join("\u200B"),
          currentpaymentCd.value,
          itemDiscYnarr.join("\u200B")
        );

        //comsole.log(res);
        //comsole.log(res2);
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
let gridView;
let dataProvider;
const currentSelectedMenuCode = ref("");
const currentSelectedMenuImgUrl = ref("");
/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(() => {
  showMenuKeys();
});

const showMenuKeys = () => {};

let gridView2;
let dataProvider2;
const clickedTLUCD = ref();
const clickedTLUNM = ref();
const clickedstrName = ref();
const clickedCode = ref();
/**
 * 선택한 행의 상세정보 셋팅
 */

const selcetedrowData = (newValue) => {
  const currentScreen = ScreenKeyOrigin.value.find(
    (item) => item.intScreenNo == clickedintScreenNo.value
  );
  if (getScreenOption(currentScreen) === 1) {
    return;
  }
  clickedstrName.value = newValue[1];
  clickedCode.value = newValue[0];
  addKey();
};

const searchAmountList = (e) => {
  searchword1.value = e.target.value;
};
const searchAmountList3 = (e) => {
  if (currentMenuorTLU.value == false) {
    const filteredList = AmountList.value.filter(
      (item) =>
        (forsearchMain.value === "0" ||
          item.majorGroupCd === forsearchMain.value) &&
        (forsearchSub.value === "0" ||
          item.subGroupCd === forsearchSub.value) &&
        (item.menuCd.includes(searchWord.value) ||
          item.menuNm.includes(searchWord.value))
    );
    dataProvider.setRows(filteredList);
  } else {
    const filteredList = TLUList.value.filter(
      (item) =>
        item.lngCode.toString().includes(searchWord2.value) ||
        item.strName.includes(searchWord2.value)
    );
    dataProvider2.setRows(filteredList);
  }
};

const currentpaymentType = ref("할인");
const currentpaymentCd = ref(3);
/**
 * 결제키 구분 세팅
 */

const updatePaymentType = (newValue) => {
  //comsole.log(newValue);
  currentpaymentCd.value = newValue;
  if (newValue == 3) {
    currentpaymentType.value = "할인";
  } else {
    currentpaymentType.value = "지불";
  }
  ScreenKeyOrigin.value = [];
  ScreenKeys.value = [];
  KeyList.value = [];
  rowData.value = [];
  items.value = [];
};

/**
 * pickStore - 포스번호 세팅
 */

const handlePosNo = (newValue) => {
  posNo.value = newValue;
  //comsole.log(posNo.value);
  //comsole.log(nowStoreAreaCd.value);
  if (
    nowStoreAreaCd.value != undefined &&
    posNo.value != undefined &&
    posNo.value != 0
  ) {
    searchButton().then(openFirstScreenKey);
  }
};

/**
 * 저장 후 재조회 — 저장 전에 열려 있던 화면키를 찾아(번호 우선, 순서 변경으로 번호가 바뀌었으면 이름) 그 페이지로 가서 다시 엶.
 * 못 찾으면(삭제 등) 첫 번째 화면키를 엶.
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
  currentsubPage.value = Math.floor(idx / 4) + 1;
  addfor4ScreenKey();
  showKeys(list[idx].intScreenNo);
  clickedScreenKeyIndex.value = idx % 4;
  clickedScreenKeys();
};

/** POS번호 선택 후 조회되면 첫 번째 화면키를 바로 열어 결제키를 보여줌 (화면키 클릭과 같은 순서) */
const openFirstScreenKey = () => {
  const index = ScreenKeys.value.findIndex(
    (item) => item && item.strScreenName != ""
  );
  if (index < 0) return;
  showKeys(ScreenKeys.value[index].intScreenNo);
  clickedScreenKeyIndex.value = index;
  clickedScreenKeys();
};

watch(
  () => AmountList.value,
  () => {
    showMenuKeys(); // MenuKeyList 값이 변경될 때마다 그리드 업데이트
  }
);

const editScreenKey = (value, value2, value3) => {
  currentscreenKeyNm.value = value2;
  //comsole.log(value3);
  currentProduct.value = toNum(value3) === 1 ? 1 : 0;
  clickedScreenNo.value = value;
  changeScreenKey.value = true;
  const disclength = ScreenKeyOrigin.value.filter(
    (item) => getScreenOption(item) === 1
  ).length;
  //comsole.log(ScreenKeyOrigin.value);
  //comsole.log(disclength);
  showEditProduct.value = disclength >= 1 && currentProduct.value !== 1;
};

const exitScreenKey = () => {
  changeScreenKey.value = false;
  addscreenKey.value = false;
};
const confirmScreenKey = () => {
  const index = ScreenKeyOrigin.value.findIndex(
    (item) => item.intScreenNo == clickedScreenNo.value
  );
  const nextOption =
    currentpaymentCd.value == 3 && toNum(currentProduct.value) === 1 ? 1 : 0;
  const applyScreenOption = () => {
    ScreenKeyOrigin.value[index].strScreenName = currentscreenKeyNm.value;
    ScreenKeyOrigin.value[index].itemDiscYn = nextOption;
    ScreenKeyOrigin.value[index].intScreenOption = nextOption;
    changeScreenKey.value = false;
    addfor4ScreenKey();
    currentscreenKeyNm.value = "";
    showKeys(clickedScreenNo.value);
    currentProduct.value = 0;
  };
  if (
    currentpaymentCd.value == 3 &&
    getScreenOption(ScreenKeyOrigin.value[index]) !== nextOption
  ) {
    Swal.fire({
      title: "변경",
      text: "화면키 유형을 변경하시면 해당 화면키의 결제키가 모두 초기화됩니다.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "변경",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        KeyList.value = KeyList.value.filter(
          (item) => item.intScreenNo != clickedScreenNo.value
        );
        applyScreenOption();
      }
    });
  } else {
    applyScreenOption();
  }
};

const addfor4ScreenKey = () => {
  ScreenKeys.value = [
    ...ScreenKeyOrigin.value.slice(
      4 * (currentsubPage.value - 1),
      4 * (currentsubPage.value - 1) + 4
    ),
  ];
  //comsole.log(ScreenKeys.value);
  const validateScreenKeys = ScreenKeys.value.filter(
    (item) => item.intScreenNo != ""
  );
  if (validateScreenKeys.length < 4) {
    ScreenKeys.value.push({ strScreenName: "", intScreenNo: "", new: true });
    for (var i = 0; i < 3 - validateScreenKeys.length; i++) {
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
  currentProduct.value = 0;
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
  const newScreenNo = nextScreenNoForType();
  const newScreenType = toNum(currentpaymentCd.value);
  const option =
    newScreenType === 3 && toNum(currentProduct.value) === 1 ? 1 : 0;

  ScreenKeyOrigin.value.push({
    strScreenName: currentscreenKeyNm.value,
    intScreenNo: newScreenNo,
    intScreenType: newScreenType,
    itemDiscYn: option,
    intScreenOption: option,
  });
  screenList.value = [
    ...(screenList.value || []),
    {
      strScreenName: currentscreenKeyNm.value,
      intScreenNo: newScreenNo,
      intScreenType: newScreenType,
      itemDiscYn: option,
      intScreenOption: option,
    },
  ];
  addscreenKey.value = false;
  addfor4ScreenKey();
  //comsole.log(ScreenKeyOrigin.value);
  currentscreenKeyNm.value = "";
  currentProduct.value = 0;
  clickedintScreenNo.value = newScreenNo;
  //comsole.log(clickedScreenNo.value);
  showKeys(newScreenNo);
};

const existMenuKey = ref(false);
const clickedRealIndex = ref();
const saveMenuKeyposition = (index) => {
  //comsole.log(clickedintScreenNo.value);
  //comsole.log(index);
  //comsole.log(items.value);
  clickedRealIndex.value = (currmenuKeyPage.value - 1) * 16 + index + 1;
  //comsole.log(clickedRealIndex.value);
};

const addKey = () => {
  const foraddIndex = KeyList.value.findIndex(
    (item) =>
      item.intPosNo == posNo.value &&
      item.intScreenNo == clickedintScreenNo.value &&
      item.intKeySeq == clickedRealIndex.value
  );

  //comsole.log(clickedintScreenNo.value);
  if (foraddIndex == -1) {
    KeyList.value.push({
      intKeyNo: currentpaymentCd.value,
      intKeySeq: clickedRealIndex.value,
      intPosNo: posNo.value,
      intScreenNo: clickedintScreenNo.value,
      lngKeyScrNo: Number(clickedCode.value),
      strName: clickedstrName.value,
      itemDiscYn: 0,
    });
  } else {
    KeyList.value[foraddIndex] = {
      intKeyNo: currentpaymentCd.value,
      intKeySeq: clickedRealIndex.value,
      intPosNo: posNo.value,
      intScreenNo: clickedintScreenNo.value,
      lngKeyScrNo: Number(clickedCode.value),
      strName: clickedstrName.value,
      itemDiscYn: 0,
    };
  }
  showKeys(clickedintScreenNo.value);
  //comsole.log(KeyList.value);
};

const addTLUKey = () => {
  //comsole.log(KeyList.value);
  const foraddIndex = KeyList.value.findIndex(
    (item) => item.intKeySeq == clickedRealIndex.value
  );
  //comsole.log(foraddIndex);
  if (foraddIndex == -1) {
    KeyList.value.push({
      intKeyNo: 6,
      intKeySeq: clickedRealIndex.value,
      intPosNo: posNo.value,
      intScreenNo: clickedintScreenNo.value,
      lngKeyscrNo: Number(clickedTLUCD.value),
      strKeyName: clickedTLUNM.value,
    });
  } else {
    KeyList.value[foraddIndex] = {
      intKeyNo: 6,
      intKeySeq: clickedRealIndex.value,
      intPosNo: posNo.value,
      intScreenNo: clickedintScreenNo.value,
      lngKeyscrNo: Number(clickedTLUCD.value),
      strKeyName: clickedTLUNM.value,
    };
  }
  showKeys(clickedintScreenNo.value);
};

/**
 * 삭제 버튼
 */

const deletekey = () => {
  if (clickedScreenOrMenu.value == false) {
    ScreenKeyOrigin.value = ScreenKeyOrigin.value.filter(
      (item) => item.intScreenNo != clickedintScreenNo.value
    );
    screenList.value = (screenList.value || []).filter(
      (item) =>
        !(
          item.intScreenNo == clickedintScreenNo.value &&
          toNum(item.intScreenType) === toNum(currentpaymentCd.value)
        )
    );
    addscreenKey.value = false;
    addfor4ScreenKey();

    KeyList.value = KeyList.value.filter(
      (item) => item.intScreenNo != clickedintScreenNo.value
    );
    currentscreenKeyNm.value = "";

    clickedintScreenNo.value = clickedintScreenNo.value + 1;
    showKeys(clickedintScreenNo.value);
  } else {
    KeyList.value = KeyList.value.filter(
      (item) =>
        item.intScreenNo != clickedintScreenNo.value ||
        item.intKeySeq != clickedRealIndex.value
    );
    //comsole.log(KeyList.value);
    showKeys(clickedintScreenNo.value);
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
  AmountList.value = [];
  MenuGroup.value = [];
  SubMenuGroup.value = [];
  KeyList.value = [];
  ScreenKeyOrigin.value = [];
  TLUList.value = [];
  AllscreenKeyPage.value = "1";
  ScreenKeys.value = [];
  items.value = [];
  forsearchMain.value = "0";
  forsearchSub.value = "0";
  afterSearch.value = false;
  searchword1.value = "";
  searchword3.value = "";
  afterSearch.value = false;
};
/**
 * 조회 상태 초기화
 */

const searchinit = (newvalue) => {
  afterSearch.value = false;
};
</script>

<style scoped>
/* 팝업 (화면키 수정·추가·순서 변경) — body 로 Teleport, 덮개 z-index 10050 */
.mst54-pop-mask {
  position: fixed;
  inset: 0;
  z-index: 10050;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(15, 23, 42, 0.45);
}
.mst54-pop {
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
.mst54-pop--order {
  width: 32rem;
}
.mst54-pop-head {
  padding: 1.125rem 1.5rem 0.875rem;
  border-bottom: 1px solid #e2e8f0;
}
.mst54-pop-head::before {
  content: "";
  display: inline-block;
  width: 4px;
  height: 1.125rem;
  margin-right: 0.5rem;
  border-radius: 2px;
  background: #2563eb;
  vertical-align: -2px;
}
.mst54-pop-title {
  display: inline;
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f172a;
}
.mst54-pop-desc {
  margin-top: 0.375rem;
  font-size: 0.8125rem;
  color: #64748b;
}
.mst54-pop-body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
}
.mst54-pop-body--scroll {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
}
.mst54-pop-field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}
.mst54-pop-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #334155;
}
.mst54-pop-input {
  height: 2.5rem;
  padding: 0 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  background: #fff;
  font-size: 0.9375rem;
  color: #0f172a;
}
.mst54-pop-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}
.mst54-pop-input:disabled {
  background: #f1f5f9;
  color: #94a3b8;
}
.mst54-pop-notes {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.75rem 0.875rem 0.75rem 1.75rem;
  border-radius: 0.5rem;
  background: #f8fafc;
  list-style: "※ ";
  font-size: 0.8125rem;
  line-height: 1.45;
  color: #475569;
}
.mst54-pop-foot {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
}
.mst54-order-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.mst54-order-item {
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
}
.mst54-order-item:hover {
  border-color: #a5b4fc;
  background: #f8faff;
}
.mst54-order-grip {
  width: 1.125rem;
  height: 1.125rem;
  flex-shrink: 0;
  fill: #94a3b8;
}
.mst54-order-no {
  min-width: 1.5rem;
  height: 1.5rem;
  border-radius: 9999px;
  background: #eef2ff;
  color: #4338ca;
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1.5rem;
  text-align: center;
}

/* 조회 AREA — 매장명·포스번호·결제키구분. 숫자 고정·통일
   - 콤보(그룹·속성·포스번호) 8.5rem, 매장 콤보 14rem, 높이 2rem, 테두리 #cbd5e1
   - 항목명 → 콤보 1rem, 같은 항목 안 콤보끼리 0.5rem
   - 앞 공백 = 뒤 공백 (--mst54-pad, 패널 폭에 따라 2.5~6.8rem) */
.mst54-search {
  --mst54-ctl-border: #cbd5e1;
  --mst54-ctl-w: 8.5rem;
  --mst54-store-w: 14rem;
  --mst54-label-gap: 1rem;
  --mst54-ctl-gap: 0.5rem;
  --mst54-group-gap: 2.5rem;
  display: flex;
  align-items: center;
  min-height: 3.25rem;
  flex-shrink: 0;
  margin: 0.75rem 0.5rem 0 1.25rem;
  padding: 0.5rem 0;
  background: #e5e7eb;
  border-radius: 0.5rem;
  /* 1440px 이하에서 공통 .w-right 가 width:auto 라 내용 폭만큼 늘어나 화면 밖으로 밀림
     → 이 영역은 폭을 주장하지 않음(inline-size 컨테이너) + 아래 @container 로 줄 배치 결정 */
  container-type: inline-size;
}
/* PickStore 루트 — 앞뒤 여백은 여기 padding 하나로 (cqi = 조회 패널 폭 기준) */
.mst54-search :deep(> div) {
  /* 넓으면 6.8cqi(최대 6.8rem), 패널이 좁아지면 한 줄(항목 합계 약 1100px)이 유지되는 만큼만 줄어듦(최소 2.5rem) */
  --mst54-pad: min(6.8rem, 6.8cqi, max(2.5rem, calc((100cqi - 1100px) / 2)));
  flex-wrap: wrap;
  justify-content: flex-start;
  column-gap: var(--mst54-ctl-gap);
  row-gap: 0.5rem;
  width: 100%;
  padding-inline: var(--mst54-pad);
  white-space: nowrap;
}
/* 항목명 "매장명" → 첫 콤보 간격 = 1rem */
.mst54-search :deep(> div > div:first-child) {
  margin-right: calc(var(--mst54-label-gap) - var(--mst54-ctl-gap));
}
/* 좁을 때: 결제키구분은 둘째 줄 맨 앞 — "매장명"과 시작선 맞춤 */
/* 좁을 때: 1줄 = 매장명 + 콤보 3개, 2줄 = 포스번호 + 결제키구분 ("매장명"과 시작선 맞춤)
   ::after 를 줄바꿈 전용 항목(order 1, 폭 100%)으로 써서 두 덩어리를 둘째 줄로 보냄 */
@container (max-width: 1179.98px) {
  .mst54-search :deep(> div)::after {
    content: "";
    order: 1;
    flex-basis: 100%;
    height: 0;
  }
  .mst54-search :deep(> div > div.ml-5) {
    order: 2;
    justify-content: flex-start;
  }
  /* 매장 콤보 바로 다음 블록(포스번호) = 둘째 줄 첫 항목 */
  .mst54-search :deep(> div > div.relative.flex-1 + div.ml-5) {
    padding-left: 0;
  }
}
/* 넓을 때: 한 줄. 덩어리 3개(매장 / 포스번호 / 결제키구분) 사이만 균등하게 벌림 (앞뒤 여백은 padding 으로 동일) */
@container (min-width: 1180px) {
  .mst54-search :deep(> div) {
    flex-wrap: nowrap;
  }
  .mst54-search :deep(> div > div.ml-5) {
    margin-left: auto !important;
  }
}
/* 매장그룹·매장속성 콤보 — 같은 폭 (compact 기본 5.75rem / 4.5rem 은 너무 작음) */
.mst54-search :deep(#storeGroup),
.mst54-search :deep(> div > div:nth-child(3) > select) {
  width: var(--mst54-ctl-w);
}
/* 매장 콤보 래퍼(flex-1 + min-w-0)가 찌그러지지 않게 고정 폭 */
.mst54-search :deep(> div > div.relative.flex-1) {
  flex: 0 0 auto;
  width: var(--mst54-store-w);
}
/* 포스번호·결제키구분 블록 (PickStore 안 ml-5 블록) — 앞 덩어리와 최소 간격은 padding 으로 */
.mst54-search :deep(> div > div.ml-5) {
  display: flex;
  align-items: center;
  gap: var(--mst54-label-gap);
  margin-left: 0;
  padding-left: var(--mst54-group-gap);
  flex-shrink: 0;
  min-height: 2rem;
}
.mst54-search :deep(> div > div.ml-5 > span) {
  font-size: 1rem;
  font-weight: 600;
}
.mst54-search :deep(> div > div.ml-5 select) {
  width: var(--mst54-ctl-w);
  height: 2rem;
  margin-left: 0;
  padding: 0 0.5rem;
}
.mst54-search :deep(> div > div.ml-5 label) {
  gap: 0.25rem;
  margin-left: 0;
  white-space: nowrap;
}
.mst54-search :deep(select),
.mst54-search :deep(.pickstore-vs-shell) {
  border: 1px solid var(--mst54-ctl-border) !important;
}
.mst54-search :deep(select:focus) {
  border-color: #3b82f6 !important;
}

/* 본문 — 좌측 목록은 줄어들고, 우측 키 영역은 키 크기를 유지한 채 좁으면 가로 스크롤 */
.mst54-body {
  display: grid;
  /* 우측은 키 영역 폭(약 790px)만큼, 좌측은 남는 폭(최소 320px). 더 좁으면 우측만 가로 스크롤 */
  grid-template-columns: minmax(320px, 1fr) minmax(0, 800px);
  column-gap: 1.5rem;
  /* 높이 = 오른쪽 키 영역 높이(왼쪽 그리드가 채워 아래 끝선이 결제키 끝과 같아짐).
     화면이 낮으면 화면 안으로 줄어들고 키 영역만 안에서 스크롤 */
  --mst54-notes-h: 2.5rem;
  grid-template-rows: minmax(0, 1fr);
  flex: 0 1 auto;
  min-height: 0;
  align-items: stretch;
  margin-top: 0.75rem;
  padding: 0 0.5rem 0.5rem 1.25rem;
}
.mst54-left,
.mst54-right {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
}
.mst54-panel-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  min-height: 2.5rem;
  padding-bottom: 0.375rem;
  border-bottom: 1px solid #d1d5db;
}
.mst54-left-body {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1 1 auto;
  min-height: 0;
  padding-top: 0.5rem;
}
.mst54-left-grid {
  flex: 1 1 auto;
  min-height: 200px;
}
/* 안내문 높이 고정(한 줄씩, 넘치면 … + 마우스 올리면 전체) — 오른쪽 아래 여백과 같은 값이라 끝선이 맞음 */
.mst54-notes {
  height: var(--mst54-notes-h);
  font-size: 0.8125rem;
  line-height: 1.25rem;
  color: #4b5563;
}
.mst54-notes > div {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.mst54-right-scroll {
  flex: 1 1 auto;
  min-height: 0;
  overflow: auto;
  padding-top: 0.75rem;
  /* 왼쪽 안내문(높이 + 위 간격 0.5rem)만큼 — 결제키 아래 끝 = 왼쪽 그리드 아래 끝 */
  padding-bottom: calc(var(--mst54-notes-h) + 0.5rem);
  contain: inline-size;
}
/* 키 영역 끝선 = 아래 결제키 5칸 폭. 제목 줄·화면키 4칸·페이지 막대도 같은 끝선 */
.mst54-right {
  --mst54-menu-key-w: 150px;
  --mst54-menu-key-gap: 0.375rem;
  --mst54-screen-key-gap: 0.5rem;
  --mst54-keys-w: calc(var(--mst54-menu-key-w) * 5 + var(--mst54-menu-key-gap) * 4);
}
.mst54-right > .mst54-panel-head {
  width: 100%;
  max-width: var(--mst54-keys-w);
}
.mst54-key-area {
  width: max-content;
}
.mst54-screen-row {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  min-height: 80px;
}
/* 조회 전: 안 보이고 클릭도 안 되지만 자리는 차지 */
.mst54-hidden {
  visibility: hidden;
}
.mst54-screen-keys {
  display: flex;
  gap: var(--mst54-screen-key-gap);
  width: var(--mst54-keys-w);
}
/* 화면키 수정 버튼 — 이름 옆이 아니라 오른쪽 위 구석에 따로 (이름 누르다 잘못 열리지 않게) */
.mst54-screen-key {
  position: relative;
}
.mst54-screen-edit {
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
.mst54-screen-edit:hover {
  border-color: #fda4af;
  background: #fff1f2;
  color: #be123c;
}
.mst54-screen-key {
  flex: 0 0 auto;
  width: calc((var(--mst54-keys-w) - var(--mst54-screen-key-gap) * 3) / 4);
  height: 80px;
}
/* 선택 셀 색 — 상단(현재 화면, 남색 계열) / 하단(선택 키, 주황 계열)을 서로 다른 색으로
   진한 단색 대신 옅은 바탕 + 2px 테두리 + 진한 글자 */
.mst54-screen-key.mst54-screen-key--current {
  background: #eef2ff;
  border: 2px solid #6366f1;
  color: #3730a3;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
}
/* 상단 화면키가 수정·삭제·순서 대상으로 선택된 상태 */
.mst54-screen-key.mst54-screen-key--target {
  outline: 3px solid #c7d2fe;
  outline-offset: 1px;
}
.mst54-menu-key.mst54-menu-key--selected {
  background: #fff7ed;
  border: 2px solid #f97316;
  color: #9a3412;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.25);
}
.mst54-screen-nav {
  display: flex;
  flex: 0 0 auto;
  width: 36px;
  height: 32px;
}
/* 화면키 페이지 막대 (화면키 줄 아래, 화면키 4칸 폭에 맞춤) */
.mst54-screen-pager {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: var(--mst54-keys-w);
  margin-top: 0.5rem;
  padding: 0.375rem 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background: #f8fafc;
}
.mst54-pager-step {
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
.mst54-pager-step:hover:not(:disabled) {
  background: #eef2ff;
}
.mst54-pager-step:disabled {
  border-color: #e2e8f0;
  color: #cbd5e1;
  cursor: default;
}
.mst54-pager-pages {
  display: flex;
  gap: 0.25rem;
}
.mst54-pager-num {
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
.mst54-pager-num:hover {
  border-color: #a5b4fc;
}
.mst54-pager-num--on {
  border-color: #6366f1;
  background: #6366f1;
  color: #fff;
}
/* 아래 결제키가 열린 화면키가 있는 페이지 — 번호 아래 점 */
.mst54-pager-num--open {
  position: relative;
}
.mst54-pager-num--open::after {
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
/* 아래 결제키 제목 줄 */
.mst54-open-screen {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  min-height: 1.75rem;
  margin-bottom: 0.375rem;
  font-size: 0.875rem;
  color: #475569;
}
.mst54-open-screen-label {
  color: #4f46e5;
  font-weight: 600;
}
.mst54-open-screen-name {
  padding: 0.125rem 0.5rem;
  border: 1px solid #c7d2fe;
  border-radius: 0.375rem;
  background: #eef2ff;
  color: #3730a3;
  font-weight: 700;
}
.mst54-open-screen-go {
  margin-left: 0.25rem;
  font-size: 0.8125rem;
  color: #4f46e5;
  text-decoration: underline;
}
.mst54-pager-text {
  margin-left: auto;
  font-size: 0.8125rem;
  color: #64748b;
  white-space: nowrap;
}
.mst54-pager-text b {
  color: #3730a3;
}
.mst54-menu-keys-wrap {
  margin-top: 0.875rem;
}
.mst54-menu-keys {
  display: grid;
  grid-template-columns: repeat(5, var(--mst54-menu-key-w));
  grid-template-rows: repeat(6, 70px);
  gap: var(--mst54-menu-key-gap);
  width: max-content;
}
</style>
