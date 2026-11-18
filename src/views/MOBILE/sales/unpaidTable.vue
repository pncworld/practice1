/*--############################################################################
# Filename : unpaidTable.vue
# Description : 모바일 > 매출 > 미결제 테이블 주문 조회 (/m/20018)
#   - 웹 SLS02_033RPT 와 같은 API(getUnpaidTableOrder / getTableLayout)를 쓴다
#   - 모바일은 매장 1개를 골라야 조회 (전체 없음)
#   - 목록: 테이블 카드, 누르면 주문 메뉴 펼침 / 배치도: POS 1번 테이블 화면, 테이블 누르면 메뉴 시트
# Date : 2026-11-17
################################################################################*/
<template>
  <div class="mut-page" :class="{ 'is-layout': viewMode === 'layout' }">
    <!-- 요약 카드: 매장 선택(1개) + 새로고침 + 미결제 합계 (한 카드로 묶어 첫 화면 세로 공간을 줄인다) -->
    <div class="mut-summary">
      <div class="mut-summary__row">
        <button
          type="button"
          class="mut-store"
          :class="{ 'is-locked': storeLocked }"
          @click="openStoreSheet">
          <font-awesome-icon :icon="['fas', 'location-dot']" class="mut-store__ico" />
          <span class="mut-store__name">{{ selectedStore ? selectedStore.STORE_NM : "매장을 선택하세요" }}</span>
          <font-awesome-icon
            v-if="!storeLocked"
            :icon="['fas', 'chevron-down']"
            class="mut-store__chev" />
        </button>
        <button
          type="button"
          class="mut-refresh"
          :disabled="!selectedStore || loading"
          aria-label="새로고침"
          @click="search">
          <font-awesome-icon :icon="['fas', 'rotate-right']" :class="{ 'fa-spin': loading }" />
        </button>
      </div>
      <div class="mut-summary__row mut-summary__row--main">
        <span class="mut-summary__amt">{{ searchedTime ? won(summary.orderAmt) : "-" }}<small>원</small></span>
        <span class="mut-summary__side">
          <span>미결제 <b>{{ summary.tableCnt }}</b>테이블 · 고객 {{ summary.custCnt }}명</span>
          <span class="mut-summary__time">{{ searchedTime ? searchedTime + " 기준" : "" }}</span>
        </span>
      </div>
    </div>

    <!-- 보기 전환 (목록을 내려도 화면 위에 붙어 있다) -->
    <div class="mut-segbar">
      <div class="mut-seg" :class="{ 'is-second': viewMode === 'layout' }" role="tablist">
        <button
          type="button"
          role="tab"
          :aria-selected="viewMode === 'list'"
          :class="{ 'is-on': viewMode === 'list' }"
          @click="viewMode = 'list'">
          목록
        </button>
        <button
          type="button"
          role="tab"
          :aria-selected="viewMode === 'layout'"
          :class="{ 'is-on': viewMode === 'layout' }"
          @click="viewMode = 'layout'">
          배치도
        </button>
      </div>
    </div>

    <!-- 안내 문구 + (목록 보기) 전체 펼치기/접기: 같은 줄에 두어 세로 공간을 더 쓰지 않는다 -->
    <div class="mut-noticebar">
      <p class="mut-notice">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <circle cx="12" cy="12" r="10" fill="currentColor" />
          <path d="M12 10.5v6M12 7.2v.3" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" />
        </svg>
        <span>메뉴 단가 기준 금액이며, 선할인이 있을 경우 미반영된 금액입니다.</span>
      </p>
      <button
        v-if="viewMode === 'list' && orders.length > 0"
        type="button"
        class="mut-allbtn"
        :class="{ 'is-on': allOpen }"
        :aria-pressed="allOpen"
        @click="toggleAll">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path
            :d="allOpen ? 'M7 11l5-5 5 5M7 18l5-5 5 5' : 'M7 6l5 5 5-5M7 13l5 5 5-5'"
            fill="none"
            stroke="currentColor"
            stroke-width="2.2"
            stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
        {{ allOpen ? "전체 접기" : "전체 펼치기" }}
      </button>
    </div>

    <!-- 목록 -->
    <template v-if="viewMode === 'list'">
      <!-- 처음 불러오는 동안: 카드 모양 자리 표시 (빈 화면·문구 깜빡임 방지) -->
      <div v-if="!storeReady || (loading && !searchedTime)" class="mut-list" aria-hidden="true">
        <div v-for="n in 4" :key="n" class="mut-skel"></div>
      </div>
      <div v-else-if="!selectedStore" class="mut-empty">매장을 선택하면 미결제 테이블을 보여 줍니다.</div>
      <div v-else-if="searchError" class="mut-empty mut-empty--err">
        {{ searchError }}
        <button type="button" class="mut-retry" @click="search">다시 시도</button>
      </div>
      <div v-else-if="searchedTime && orders.length === 0" class="mut-empty">
        미결제 테이블이 없습니다.
      </div>
      <div v-else class="mut-list">
        <div
          v-for="o in orders"
          :key="o.key"
          class="mut-card"
          :class="{ 'is-open': openKeys.has(o.key), 'is-long': o.elapsedMin >= 60 }">
          <button
            type="button"
            class="mut-card__head"
            :aria-expanded="openKeys.has(o.key)"
            @click="toggleCard(o.key)">
            <div class="mut-card__left">
              <div class="mut-card__table">테이블 {{ o.tableName }}</div>
              <div class="mut-card__meta">
                {{ o.inTimeShort }} ·
                <span class="mut-card__elapsed">{{ o.elapsedText }}</span>
                <template v-if="o.custCnt > 0"> · {{ o.custCnt }}명</template>
              </div>
            </div>
            <div class="mut-card__right">
              <div class="mut-card__amt">{{ won(o.orderAmt) }}<small>원</small></div>
              <font-awesome-icon :icon="['fas', 'chevron-down']" class="mut-card__chev" />
            </div>
          </button>
          <!-- 펼침: 높이가 부드럽게 열리고 닫힌다 (grid 0fr → 1fr) -->
          <Transition name="mut-acc">
            <div v-if="openKeys.has(o.key)" class="mut-card__body">
              <div class="mut-card__inner">
                <ul v-if="o.menus.length > 0" class="mut-menu">
                  <li v-for="m in o.menus" :key="m.seq">
                    <div class="mut-menu__main">
                      <span>{{ m.name }}</span>
                      <span>× {{ m.count }}</span>
                    </div>
                    <div v-for="s in m.subs" :key="s.seq" class="mut-menu__sub">
                      └ {{ s.name }}<template v-if="s.count > 1"> × {{ s.count }}</template>
                    </div>
                  </li>
                </ul>
                <div v-else class="mut-menu__none">메뉴 상세가 들어오지 않은 테이블입니다.</div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </template>

    <!-- 배치도 -->
    <template v-else>
      <div v-if="!selectedStore" class="mut-empty">매장을 선택하면 배치도를 보여 줍니다.</div>
      <div v-else-if="searchError" class="mut-empty mut-empty--err">
        {{ searchError }}
        <button type="button" class="mut-retry" @click="search">다시 시도</button>
      </div>
      <!-- 새로고침 때는 이미 그린 배치도를 그대로 두고 값만 바꾼다 (처음 불러올 때만 안내 문구) -->
      <div v-else-if="(layoutLoading || loading) && layoutRows.length === 0" class="mut-empty">
        배치도를 불러오는 중입니다…
      </div>
      <div v-else-if="layoutError" class="mut-empty mut-empty--err">{{ layoutError }}</div>
      <div v-else-if="layoutScreens.length === 0" class="mut-empty">
        POS 1번 테이블 화면 배치가 없습니다.
      </div>
      <template v-else>
        <!--
          화면(층) 탭: 한 줄 전체를 쓴다. 넘치면 가로로 넘기고, 가려진 쪽 끝을 흐리게 해 더 있다는 걸 보여 준다.
          미결제가 있는 화면이 앞에 온다. 아래 줄에 현재 화면 요약 + 세로/전체/크게
        -->
        <div
          ref="tabsRef"
          class="mut-tabs"
          :class="{ 'fade-left': tabsFade.left, 'fade-right': tabsFade.right }"
          role="tablist"
          @scroll="updateTabsFade">
          <button
            v-for="sc in sortedScreens"
            :key="sc.no"
            type="button"
            role="tab"
            class="mut-tab"
            :class="{ 'is-on': sc.no === layoutScreenNo, 'has-unpaid': sc.unpaidCnt > 0 }"
            :aria-selected="sc.no === layoutScreenNo"
            :data-no="sc.no"
            @click="layoutScreenNo = sc.no">
            {{ sc.name || "화면 " + sc.no }}
            <span v-if="sc.unpaidCnt > 0" class="mut-tab__cnt">{{ sc.unpaidCnt }}</span>
          </button>
        </div>
        <div class="mut-tabs-row">
          <div class="mut-screen-info">
            <template v-if="currentScreen">
              좌석 {{ currentScreen.tableCnt }} ·
              <b :class="{ 'is-zero': currentScreen.unpaidCnt === 0 }">미결제 {{ currentScreen.unpaidCnt }}</b>
            </template>
          </div>
          <div class="mut-zoombar">
            <button
              type="button"
              :class="{ 'is-on': isVertical }"
              :aria-pressed="isVertical"
              :title="isVertical ? '가로로 보기' : '세로로 보기'"
              @click="toggleVertical">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <rect x="7" y="3" width="10" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="2" />
                <path d="M3 9a6 6 0 0 1 3-4M3 9l-.5-3M3 9l3-.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              {{ isVertical ? "세로" : "가로" }}
            </button>
            <button type="button" :class="{ 'is-on': !needsMinimap }" @click="setZoom('fit')">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2" />
                <path d="M15.5 15.5L20 20M7.5 10.5h6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              </svg>
              전체
            </button>
            <button type="button" :class="{ 'is-on': needsMinimap }" @click="setZoom('large')">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2" />
                <path d="M15.5 15.5L20 20M7.5 10.5h6M10.5 7.5v6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              </svg>
              크게
            </button>
          </div>
        </div>
        <div class="mut-canvas-wrap">
          <div
            ref="canvasRef"
            class="mut-canvas"
            :class="{ 'is-zoomed': needsMinimap, 'is-dragging': mouseDrag.moved }"
            @scroll="onCanvasScroll"
            @pointerdown="onCanvasPointerDown"
            @pointermove="onCanvasPointerMove"
            @pointerup="onCanvasPointerUp"
            @pointercancel="onCanvasPointerUp"
            @click.capture="onCanvasClickCapture">
            <div
              class="mut-stage"
              :style="{
                width: stage.w + 'px',
                height: stage.h + 'px',
                marginLeft: stageOffset.x + 'px',
                marginRight: stageOffset.x + 'px',
                marginTop: stageOffset.y + 'px',
              }">
              <template v-for="k in layoutKeys" :key="k.id">
                <button
                  v-if="k.keyNo === 1"
                  type="button"
                  class="mut-move"
                  :style="k.style"
                  @click="moveScreen(k.target)">
                  {{ k.name }}
                </button>
                <button
                  v-else
                  type="button"
                  class="mut-tbl"
                  :class="['shape-' + k.shape, k.order ? 'is-unpaid' : 'is-idle', k.compact ? 'is-compact' : '']"
                  :style="{ ...k.style, '--key-color': k.color }"
                  @click="k.order && openSheet(k.order)">
                  <span class="mut-tbl__name">{{ k.name }}</span>
                  <span v-if="k.order" class="mut-tbl__amt">{{ won(k.order.orderAmt) }}</span>
                  <span v-if="k.order && !k.compact" class="mut-tbl__meta">{{ k.order.elapsedText }}</span>
                </button>
              </template>
            </div>
          </div>
          <div
            v-if="needsMinimap"
            class="mut-minimap"
            :style="{ width: minimap.w + 'px', height: minimap.h + 'px' }"
            @pointerdown="onMinimapDown"
            @pointermove="onMinimapMove"
            @pointerup="onMinimapUp"
            @pointercancel="onMinimapUp">
            <span
              v-for="m in minimap.keys"
              :key="m.id"
              class="mut-minimap__key"
              :class="m.cls"
              :style="m.style"></span>
            <span class="mut-minimap__view" :style="minimap.view"></span>
          </div>
        </div>
        <div v-if="orphans.length > 0" class="mut-orphans">
          <span>배치도에 없는 미결제 테이블</span>
          <button v-for="o in orphans" :key="o.key" type="button" @click="openSheet(o)">
            {{ o.tableName }} · {{ won(o.orderAmt) }}원
          </button>
        </div>
      </template>
    </template>

    <!-- 매장 선택 시트 -->
    <Teleport to="body">
      <Transition name="mut-sheet" :duration="{ enter: 350, leave: 300 }">
        <div
          v-if="storeSheet"
          class="mut-dim"
          :style="kbInset ? { paddingBottom: kbInset + 'px' } : null"
          @click.self="storeSheet = false">
          <!-- 높이 고정: 검색 결과 수가 바뀌어도 검색창이 위아래로 움직이지 않게 -->
          <div class="mut-sheet mut-sheet--fixed" role="dialog" aria-modal="true" aria-label="매장 선택">
            <!-- 손잡이·제목을 아래로 끌면 닫힌다 -->
            <div
              class="mut-sheet__drag"
              @pointerdown="onGrabDown"
              @pointermove="onGrabMove"
              @pointerup="onGrabUp($event, closeStoreSheet)"
              @pointercancel="onGrabUp($event, null)">
              <div class="mut-sheet__grab"></div>
              <div class="mut-sheet__title">매장 선택</div>
            </div>
            <!-- 한글 조합 중에도 바로 걸리게 event.target.value 로 받는다 (초성 검색 포함) -->
            <div class="mut-sheet__searchbox">
              <font-awesome-icon :icon="['fas', 'magnifying-glass']" class="mut-sheet__searchico" />
              <input
                :value="storeWord"
                type="text"
                class="mut-sheet__search"
                placeholder="매장명 검색 (초성 가능)"
                enterkeyhint="search"
                autocomplete="off"
                autocapitalize="off"
                spellcheck="false"
                @input="onStoreWord"
                @compositionupdate="onStoreWord"
                @compositionend="onStoreWord" />
              <button
                v-if="storeWord"
                type="button"
                class="mut-sheet__clear"
                aria-label="검색어 지우기"
                @click="storeWord = ''">
                <font-awesome-icon :icon="['fas', 'xmark']" />
              </button>
            </div>
            <div class="mut-sheet__list">
              <button
                v-for="s in filteredStores"
                :key="s.GROUP_CD + '-' + s.STORE_CD"
                type="button"
                class="mut-sheet__item"
                :class="{ 'is-on': selectedStore && String(selectedStore.STORE_CD) === String(s.STORE_CD) }"
                @click="pickStore(s)">
                {{ s.STORE_NM }}
              </button>
              <div v-if="filteredStores.length === 0" class="mut-menu__none">검색된 매장이 없습니다.</div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- 테이블 메뉴 시트 (배치도에서 테이블을 누르면) -->
    <Teleport to="body">
      <Transition name="mut-sheet" :duration="{ enter: 350, leave: 300 }">
        <div v-if="sheetOrder" class="mut-dim" @click.self="sheetOrder = null">
          <div class="mut-sheet" role="dialog" aria-modal="true" aria-label="테이블 주문 메뉴">
            <!-- 손잡이·머리글을 아래로 끌면 닫힌다 -->
            <div
              class="mut-sheet__drag"
              @pointerdown="onGrabDown"
              @pointermove="onGrabMove"
              @pointerup="onGrabUp($event, closeOrderSheet)"
              @pointercancel="onGrabUp($event, null)">
              <div class="mut-sheet__grab"></div>
              <div class="mut-sheet__head">
                <div>
                  <div class="mut-sheet__title">테이블 {{ sheetOrder.tableName }}</div>
                  <div class="mut-card__meta">
                    입장 {{ sheetOrder.inTimeShort }} ({{ sheetOrder.elapsedText }})
                    <template v-if="sheetOrder.custCnt > 0"> · 고객 {{ sheetOrder.custCnt }}명</template>
                  </div>
                </div>
                <div class="mut-card__amt">{{ won(sheetOrder.orderAmt) }}<small>원</small></div>
              </div>
            </div>
            <div class="mut-sheet__list">
              <ul v-if="sheetOrder.menus.length > 0" class="mut-menu">
                <li v-for="m in sheetOrder.menus" :key="m.seq">
                  <div class="mut-menu__main">
                    <span>{{ m.name }}</span>
                    <span>× {{ m.count }} · {{ won(m.amt) }}원</span>
                  </div>
                  <div v-for="s in m.subs" :key="s.seq" class="mut-menu__sub">
                    └ {{ s.name }}<template v-if="s.count > 1"> × {{ s.count }}</template>
                    <template v-if="s.amt"> · {{ won(s.amt) }}원</template>
                  </div>
                </li>
              </ul>
              <div v-else class="mut-menu__none">메뉴 상세가 들어오지 않은 테이블입니다.</div>
            </div>
            <button type="button" class="mut-sheet__close" @click="sheetOrder = null">닫기</button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { getAppStoreList } from "@/api/mobile";
import { getUnpaidTableLayout, getUnpaidTableOrder } from "@/api/misales";
import { formatTime } from "@/customFunc/customFunc";
import { matchNameWithChoseong } from "@/utils/choseongFilter";
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import { useStore } from "vuex";

const store = useStore();

/** 금액 표시: 브라우저 언어와 상관없이 항상 1,234 형식 */
const won = (n) => Number(n || 0).toLocaleString("ko-KR");

const toNum = (v) => {
  if (v === null || v === undefined || v === "") return 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};
const pad2 = (n) => String(n).padStart(2, "0");

/* ───── 매장 (1개만) ───── */
const storeList = ref([]);
const selectedStore = ref(null);
const storeSheet = ref(false);
const storeWord = ref("");
const isAllStoreRow = (item) => {
  const name = String(item?.STORE_NM ?? "").replace(/\s/g, "");
  const code = String(item?.STORE_CD ?? "").trim();
  return name === "전체" || (code !== "" && Number(code) === 0);
};
const storeLocked = computed(() => storeList.value.length <= 1);
/** 매장명 검색: 부분 일치 + 초성 (공통 choseongFilter) */
const filteredStores = computed(() => {
  const w = storeWord.value.trim();
  return w
    ? storeList.value.filter((s) => matchNameWithChoseong(String(s.STORE_NM ?? ""), w))
    : storeList.value;
});
const onStoreWord = (e) => {
  storeWord.value = e?.target?.value ?? "";
};
const openStoreSheet = () => {
  if (storeLocked.value) return;
  storeWord.value = "";
  storeSheet.value = true;
};
const pickStore = (s) => {
  storeSheet.value = false;
  if (selectedStore.value && String(selectedStore.value.STORE_CD) === String(s.STORE_CD)) return;
  selectedStore.value = s;
  /* 다른 매장: 앞 매장 값·배치도를 지우고 처음 불러오는 상태(자리 표시)로 */
  openKeys.value = new Set();
  sourceRows.value = [];
  searchedTime.value = "";
  layoutRows.value = [];
  layoutLoadedFor.value = "";
  layoutScreenNo.value = "";
  zoom.value = "auto";
  vertical.value = "auto";
  search();
};
const closeStoreSheet = () => {
  storeSheet.value = false;
};

/* ───── 조회 ───── */
const sourceRows = ref([]);
const searchedTime = ref("");
const loading = ref(false);
const storeReady = ref(false);
const searchError = ref("");
const nowTick = ref(Date.now());

const search = async () => {
  if (!selectedStore.value) return;
  loading.value = true;
  searchError.value = "";
  try {
    const res = await getUnpaidTableOrder(
      selectedStore.value.GROUP_CD,
      String(selectedStore.value.STORE_CD)
    );
    if (res.data.RESULT_CD !== "00") throw new Error(res.data.RESULT_NM);
    sourceRows.value = Array.isArray(res.data.List) ? res.data.List : [];
    searchedTime.value = formatTime(new Date());
    nowTick.value = Date.now();
    openKeys.value = new Set();
    layoutLoadedFor.value = "";
    if (viewMode.value === "layout") await loadLayout();
  } catch (error) {
    sourceRows.value = [];
    searchedTime.value = "";
    searchError.value = "미결제 테이블을 불러오지 못했습니다. 다시 시도해 주세요.";
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  try {
    const u = store.state.userData || {};
    const res = await getAppStoreList(u.GROUP_CD, u.STORE_CD, u.USER_NO);
    const raw = Array.isArray(res?.data?.List) ? res.data.List : [];
    storeList.value = raw.filter((s) => !isAllStoreRow(s));
    /*
     * 본사 계정(목록에 「전체」 행 + 매장 2개 이상)은 매장을 직접 골라야 한다(미결제는 매장 1개 기준).
     * 본사 자기 코드(테이블 없음)를 자동 선택하지 않고, 매장 선택 시트를 바로 연다.
     */
    const isHq = raw.some((s) => isAllStoreRow(s)) && storeList.value.length > 1;
    selectedStore.value = isHq
      ? null
      : storeList.value.find((s) => String(s.STORE_CD) === String(u.STORE_CD)) ||
        (storeList.value.length === 1 ? storeList.value[0] : null);
    storeReady.value = true;
    if (selectedStore.value) {
      await search();
    } else if (storeList.value.length > 1) {
      storeSheet.value = true;
    }
  } catch (error) {
    storeList.value = [];
  } finally {
    storeReady.value = true;
  }
});

/* ───── 테이블별 주문 ───── */
const parseInTime = (s) => {
  if (!s) return null;
  const d = new Date(String(s).replace(" ", "T"));
  return Number.isNaN(d.getTime()) ? null : d;
};
const orders = computed(() => {
  const map = new Map();
  for (const r of sourceRows.value) {
    let o = map.get(r.strTableKey);
    if (!o) {
      const d = parseInTime(r.dtmInTime);
      const min = d ? Math.max(0, Math.floor((nowTick.value - d.getTime()) / 60000)) : 0;
      o = {
        key: r.strTableKey,
        tableId: String(r.lngTableID),
        tableName: r.strTableName,
        orderAmt: toNum(r.lngOrderAmt),
        custCnt: toNum(r.lngCustCount),
        inTimeShort: d ? pad2(d.getHours()) + ":" + pad2(d.getMinutes()) : "",
        inMs: d ? d.getTime() : 0,
        elapsedMin: min,
        elapsedText: min < 60 ? min + "분 경과" : Math.floor(min / 60) + "시간 " + (min % 60) + "분 경과",
        menus: [],
        _mainNo: null,
      };
      map.set(r.strTableKey, o);
    }
    if (r.lngMenuSeq === "" || r.lngMenuSeq == null) continue;
    const item = {
      seq: toNum(r.lngMenuSeq),
      name: r.strMenuName,
      count: toNum(r.lngMenuCount),
      amt: toNum(r.lngAmt),
      subs: [],
    };
    if (r.lngMainNo !== o._mainNo || o.menus.length === 0) {
      o._mainNo = r.lngMainNo;
      o.menus.push(item);
    } else {
      o.menus[o.menus.length - 1].subs.push(item);
    }
  }
  /* 오래 기다린 테이블(입장 빠른 순) 먼저 */
  return [...map.values()].sort((a, b) => a.inMs - b.inMs);
});
const orderByTable = computed(() => new Map(orders.value.map((o) => [o.tableId, o])));
const summary = computed(() => ({
  tableCnt: orders.value.length,
  custCnt: orders.value.reduce((s, o) => s + o.custCnt, 0),
  orderAmt: orders.value.reduce((s, o) => s + o.orderAmt, 0),
}));

/* 펼친 카드들 (여러 개 동시에 펼칠 수 있다). 새로 조회하거나 매장을 바꾸면 모두 접는다 */
const openKeys = ref(new Set());
const toggleCard = (key) => {
  const next = new Set(openKeys.value);
  if (next.has(key)) next.delete(key);
  else next.add(key);
  openKeys.value = next;
};
const allOpen = computed(
  () => orders.value.length > 0 && orders.value.every((o) => openKeys.value.has(o.key))
);
const toggleAll = () => {
  openKeys.value = allOpen.value ? new Set() : new Set(orders.value.map((o) => o.key));
};

const tickTimer = setInterval(() => {
  nowTick.value = Date.now();
}, 60000);

/* ───── 보기 전환 ───── */
const viewMode = ref("list");
watch(viewMode, (m) => {
  if (m === "layout") loadLayout();
});

/* ───── 배치도 ───── */
const layoutRows = ref([]);
const layoutLoadedFor = ref("");
const layoutLoading = ref(false);
const layoutError = ref("");
const layoutScreenNo = ref("");
const canvasRef = ref(null);
const canvasSize = ref({ w: 0, h: 0 });
const scrollPos = ref({ left: 0, top: 0, w: 0, h: 0 });
const zoom = ref("auto");
const sheetOrder = ref(null);
const PAD = 12;

const loadLayout = async () => {
  if (!selectedStore.value || !searchedTime.value) return;
  const key = String(selectedStore.value.STORE_CD) + "|" + searchedTime.value;
  if (layoutLoadedFor.value !== key) {
    layoutLoading.value = true;
    layoutError.value = "";
    try {
      const res = await getUnpaidTableLayout(
        selectedStore.value.GROUP_CD,
        String(selectedStore.value.STORE_CD)
      );
      if (res.data.RESULT_CD !== "00") throw new Error(res.data.RESULT_NM);
      layoutRows.value = Array.isArray(res.data.List) ? res.data.List : [];
      layoutLoadedFor.value = key;
      /* 새로고침: 보고 있던 화면(층)이 그대로 있으면 유지 → 확대·위치가 처음으로 돌아가지 않는다 */
      if (!layoutScreens.value.some((s) => s.no === layoutScreenNo.value)) {
        const first = layoutScreens.value.find((s) => s.unpaidCnt > 0) || layoutScreens.value[0];
        layoutScreenNo.value = first ? first.no : "";
      }
    } catch (error) {
      layoutRows.value = [];
      layoutError.value = "배치도를 불러오지 못했습니다. " + (error?.message || "");
    } finally {
      layoutLoading.value = false;
    }
  }
  await nextTick();
  observeCanvas();
};

const layoutScreens = computed(() => {
  const map = new Map();
  for (const r of layoutRows.value) {
    const no = String(r.intScreenNo);
    if (!map.has(no)) {
      map.set(no, { no, name: r.strScreenName, seq: toNum(r.intScreenKeySeq), unpaidCnt: 0, tableCnt: 0 });
    }
    if (String(r.intKeyNo) === "13") {
      map.get(no).tableCnt += 1;
      if (orderByTable.value.has(String(r.lngKeyscrNo))) map.get(no).unpaidCnt += 1;
    }
  }
  return [...map.values()].sort((a, b) => a.seq - b.seq || toNum(a.no) - toNum(b.no));
});
/** 탭 표시 순서: 미결제가 있는 화면 먼저, 같은 그룹 안에서는 POS 화면 순서 */
const sortedScreens = computed(() =>
  [...layoutScreens.value].sort((a, b) => (b.unpaidCnt > 0) - (a.unpaidCnt > 0))
);
const currentScreen = computed(
  () => layoutScreens.value.find((s) => s.no === layoutScreenNo.value) || null
);

/* 탭 줄 넘침 표시 (가려진 쪽 끝을 흐리게) + 선택 탭이 보이게 스크롤 */
const tabsRef = ref(null);
const tabsFade = ref({ left: false, right: false });
const updateTabsFade = () => {
  const el = tabsRef.value;
  if (!el) return;
  const max = el.scrollWidth - el.clientWidth;
  tabsFade.value = { left: el.scrollLeft > 2, right: el.scrollLeft < max - 2 };
};
const revealActiveTab = () => {
  const el = tabsRef.value;
  if (!el) return;
  const btn = el.querySelector(`[data-no="${layoutScreenNo.value}"]`);
  if (btn) {
    const left = btn.offsetLeft - (el.clientWidth - btn.offsetWidth) / 2;
    el.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
  }
  updateTabsFade();
};
watch([layoutScreenNo, tabsRef, () => sortedScreens.value.length], async () => {
  await nextTick();
  revealActiveTab();
});
const moveScreen = (target) => {
  const no = String(target);
  if (layoutScreens.value.some((s) => s.no === no)) layoutScreenNo.value = no;
};
const screenRows = computed(() =>
  layoutRows.value.filter((r) => String(r.intScreenNo) === layoutScreenNo.value && r.intKeyNo !== "")
);
const decimalToHex = (dec) => {
  const n = toNum(dec);
  if (!n) return "#94a3b8";
  return "#" + [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => v.toString(16).padStart(2, "0")).join("");
};
/** POS 원래 좌표 범위 */
const rawBounds = computed(() => {
  let maxX = 0;
  let maxY = 0;
  for (const r of screenRows.value) {
    maxX = Math.max(maxX, toNum(r.lngX) + toNum(r.lngWidth));
    maxY = Math.max(maxY, toNum(r.lngY) + toNum(r.lngHeight));
  }
  return { maxX: maxX || 1, maxY: maxY || 1 };
});
/**
 * 세로 보기: 가로로 넓은 POS 배치를 시계 방향 90° 돌려 세로로 긴 휴대폰 화면에 크게 맞춘다
 * (테이블 안 글자는 돌리지 않고 위치·크기만 돌린다. POS 화면 위쪽 → 오른쪽)
 * auto = 휴대폰을 세로로 들고 있고 배치가 가로로 넓으면 세로 보기
 */
const vertical = ref("auto");
const isVertical = computed(() => {
  if (vertical.value !== "auto") return vertical.value === "on";
  const { w, h } = canvasSize.value;
  const { maxX, maxY } = rawBounds.value;
  return h > w && maxX > maxY * 1.15;
});
const toggleVertical = async () => {
  vertical.value = isVertical.value ? "off" : "on";
  zoom.value = "auto";
  await nextTick();
  scrollToFirstUnpaid();
};
/** 화면에 그릴 좌표 (세로 보기면 90° 돌린 좌표) */
const dispRows = computed(() => {
  const H = rawBounds.value.maxY;
  return screenRows.value.map((r) => {
    const x = toNum(r.lngX);
    const y = toNum(r.lngY);
    const w = toNum(r.lngWidth);
    const h = toNum(r.lngHeight);
    return isVertical.value
      ? { r, x: H - (y + h), y: x, w: h, h: w }
      : { r, x, y, w, h };
  });
});
const bounds = computed(() => {
  const { maxX, maxY } = rawBounds.value;
  return isVertical.value ? { maxX: maxY, maxY: maxX } : { maxX, maxY };
});
/* 가로 보기는 폭에 맞춤(세로 스크롤), 세로 보기는 배치 전체가 한 화면에 들어가게 */
const fitScale = computed(() => {
  const { w, h } = canvasSize.value;
  if (!w) return 0.03;
  const byW = (w - PAD * 2) / bounds.value.maxX;
  if (!isVertical.value || !h) return Math.max(0.01, byW);
  return Math.max(0.01, Math.min(byW, (h - PAD * 2) / bounds.value.maxY));
});
/* '전체' 버튼: 가로·세로 보기 모두 배치 전체가 한 화면(폭·높이)에 들어가게 (세로로 긴 매장 배치 넘침 방지) */
const wholeScale = computed(() => {
  const { w, h } = canvasSize.value;
  if (!w || !h) return fitScale.value;
  const byH = (h - PAD * 2) / bounds.value.maxY;
  return Math.max(0.01, Math.min(fitScale.value, byH));
});
const readableScale = computed(() => {
  let minH = 0;
  for (const d of dispRows.value) {
    if (String(d.r.intKeyNo) !== "13") continue;
    if (d.h > 0 && (minH === 0 || d.h < minH)) minH = d.h;
  }
  return minH ? 64 / minH : fitScale.value;
});
const scale = computed(() => {
  const fit = fitScale.value;
  const large = Math.max(fit * 1.8, readableScale.value);
  if (zoom.value === "fit") return wholeScale.value;
  if (zoom.value === "large") return large;
  return fit * (64 / readableScale.value) < 48 ? large : wholeScale.value;
});
const needsMinimap = computed(() => scale.value > fitScale.value * 1.05);
const stage = computed(() => ({
  w: Math.round(bounds.value.maxX * scale.value),
  h: Math.round(bounds.value.maxY * scale.value),
}));
/** 배치 판 여백: 화면보다 작으면 가로·세로 가운데, 크면 12px (쏠림 방지) */
const stageOffset = computed(() => {
  const { w, h } = canvasSize.value;
  return {
    x: Math.max(PAD, Math.floor((w - stage.value.w) / 2)),
    y: Math.max(PAD, Math.floor((h - stage.value.h) / 2)),
  };
});
const layoutKeys = computed(() => {
  const sc = scale.value;
  return dispRows.value.map((d) => {
    const r = d.r;
    const keyNo = toNum(r.intKeyNo);
    const w = Math.max(12, d.w * sc);
    const h = Math.max(12, d.h * sc);
    return {
      id: r.intScreenNo + "_" + r.intKeySeq,
      keyNo,
      name: r.strKeyName,
      target: r.lngKeyscrNo,
      shape: toNum(r.lngShape),
      color: decimalToHex(r.lngKeyColor),
      compact: w < 80 || h < 60,
      order: keyNo === 13 ? orderByTable.value.get(String(r.lngKeyscrNo)) || null : null,
      style: {
        left: Math.round(d.x * sc) + "px",
        top: Math.round(d.y * sc) + "px",
        width: Math.round(w) + "px",
        height: Math.round(h) + "px",
        fontSize: Math.max(10, Math.min(14, Math.round(Math.min(h, w * 0.8) / 5))) + "px",
      },
    };
  });
});
const orphans = computed(() => {
  const placed = new Set(
    layoutRows.value.filter((r) => String(r.intKeyNo) === "13").map((r) => String(r.lngKeyscrNo))
  );
  return orders.value.filter((o) => !placed.has(o.tableId));
});
const openSheet = (o) => {
  sheetOrder.value = o;
};
const closeOrderSheet = () => {
  sheetOrder.value = null;
};

/**
 * 시트 손잡이를 아래로 끌어 닫기
 * - 끄는 동안은 손가락을 그대로 따라오고, 96px 넘게 내리거나 빠르게 내리면 닫는다. 아니면 제자리로 돌아온다
 */
let grab = null;
const onGrabDown = (e) => {
  if (e.pointerType === "mouse" && e.button !== 0) return;
  const el = e.currentTarget.closest(".mut-sheet");
  if (!el) return;
  grab = { el, y: e.clientY, t: e.timeStamp, dy: 0 };
  e.currentTarget.setPointerCapture?.(e.pointerId);
  el.style.transition = "none";
};
const onGrabMove = (e) => {
  if (!grab) return;
  grab.dy = Math.max(0, e.clientY - grab.y);
  grab.el.style.transform = "translateY(" + grab.dy + "px)";
};
const onGrabUp = (e, close) => {
  if (!grab) return;
  const { el, dy, t } = grab;
  grab = null;
  const speed = dy / Math.max(1, e.timeStamp - t); /* px/ms */
  if (close && (dy > 96 || (dy > 24 && speed > 0.5))) {
    el.style.transition = "transform 0.22s cubic-bezier(0.4, 0, 1, 1)";
    el.style.transform = "translateY(100%)";
    close();
  } else {
    el.style.transition = "transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1)";
    el.style.transform = "";
  }
};

/**
 * 화면 키보드가 올라오면 매장 선택 시트를 키보드 위로 올린다
 * (키보드가 검색 결과 목록을 가려 아래쪽 매장을 누를 수 없는 문제 방지)
 */
const kbInset = ref(0);
const onViewportChange = () => {
  const vv = window.visualViewport;
  if (!vv) return;
  const gap = Math.round(window.innerHeight - vv.height - vv.offsetTop);
  kbInset.value = gap > 120 ? gap : 0; /* 주소창 높이 변화(작은 값)는 키보드로 보지 않는다 */
};

/* 휴대폰 「뒤로」: 시트가 열려 있으면 화면을 떠나지 않고 시트만 닫는다 (로그인 화면으로 가는 이동은 막지 않는다) */
onBeforeRouteLeave((to) => {
  if (to.path === "/") return true;
  if (sheetOrder.value || (storeSheet.value && selectedStore.value)) {
    sheetOrder.value = null;
    storeSheet.value = false;
    return false;
  }
  return true;
});

/* 캔버스 크기·스크롤 */
let ro = null;
const observeCanvas = () => {
  const el = canvasRef.value;
  if (!el) return;
  if (!ro) {
    let raf = 0;
    ro = new ResizeObserver((entries) => {
      const r = entries[0].contentRect;
      const next = { w: Math.floor(r.width), h: Math.floor(r.height) };
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const cur = canvasSize.value;
        if (cur.w !== next.w || cur.h !== next.h) canvasSize.value = next;
      });
    });
  }
  ro.disconnect();
  ro.observe(el);
};
watch(canvasRef, () => observeCanvas());

/*
 * 배치도 높이는 CSS 가 정한다: 배치도 보기에서는 화면 전체(.mut-page.is-layout)를 보이는 화면 높이(100dvh)로 고정하고
 * 배치도(.mut-canvas-wrap)가 남은 높이를 모두 차지한다 (flex: 1).
 * → 위쪽 안내 문구가 두 줄이 되거나 아래에 「배치도에 없는 미결제 테이블」이 생겨도 바깥 스크롤이 생기지 않는다.
 * 배치도 안쪽 크기 변화는 위 ResizeObserver(observeCanvas)가 받아 배율을 다시 계산한다.
 */

/**
 * 마우스로 끌어 이동 (PC 브라우저에서 모바일 화면을 볼 때). 손가락 터치는 브라우저 기본 스크롤을 쓴다.
 * 4px 넘게 끌었으면 놓을 때 테이블 클릭(메뉴 시트 열기)으로 처리하지 않는다.
 */
const mouseDrag = ref({ on: false, moved: false, x: 0, y: 0, left: 0, top: 0 });
const onCanvasPointerDown = (e) => {
  if (e.pointerType !== "mouse" || e.button !== 0) return;
  const el = canvasRef.value;
  mouseDrag.value = { on: true, moved: false, x: e.clientX, y: e.clientY, left: el.scrollLeft, top: el.scrollTop };
};
const onCanvasPointerMove = (e) => {
  const d = mouseDrag.value;
  if (!d.on) return;
  const dx = e.clientX - d.x;
  const dy = e.clientY - d.y;
  if (!d.moved && Math.abs(dx) + Math.abs(dy) > 4) {
    d.moved = true;
    canvasRef.value.setPointerCapture?.(e.pointerId);
  }
  if (d.moved) canvasRef.value.scrollTo({ left: d.left - dx, top: d.top - dy });
};
const onCanvasPointerUp = () => {
  mouseDrag.value.on = false;
  /* moved 는 다음 click 캡처에서 확인 후 지운다 */
  setTimeout(() => {
    mouseDrag.value.moved = false;
  }, 0);
};
const onCanvasClickCapture = (e) => {
  if (mouseDrag.value.moved) {
    e.stopPropagation();
    e.preventDefault();
  }
};
onMounted(() => {
  window.visualViewport?.addEventListener("resize", onViewportChange);
  window.visualViewport?.addEventListener("scroll", onViewportChange);
});
const onCanvasScroll = (e) => {
  const el = e.target;
  scrollPos.value = { left: el.scrollLeft, top: el.scrollTop, w: el.clientWidth, h: el.clientHeight };
};
const syncScroll = () => {
  if (canvasRef.value) onCanvasScroll({ target: canvasRef.value });
};
const scrollToFirstUnpaid = () => {
  const el = canvasRef.value;
  if (!el) return;
  const t = needsMinimap.value ? layoutKeys.value.find((k) => k.order) : null;
  if (t) {
    el.scrollTo({
      left: parseFloat(t.style.left) + stageOffset.value.x - el.clientWidth / 3,
      top: parseFloat(t.style.top) + stageOffset.value.y - el.clientHeight / 3,
    });
  } else {
    el.scrollTo({ left: 0, top: 0 });
  }
  syncScroll();
};
const setZoom = async (mode) => {
  zoom.value = mode;
  await nextTick();
  scrollToFirstUnpaid();
};
watch(layoutScreenNo, async () => {
  zoom.value = "auto";
  vertical.value = "auto";
  await nextTick();
  scrollToFirstUnpaid();
});
watch(canvasSize, () => syncScroll());

/* 미니맵 */
const minimap = computed(() => {
  const { maxX, maxY } = bounds.value;
  let w = 120;
  let h = (w * maxY) / maxX;
  if (h > 90) {
    h = 90;
    w = (h * maxX) / maxY;
  }
  const k = w / maxX;
  const keys = dispRows.value.map((d) => {
    const r = d.r;
    const isTable = String(r.intKeyNo) === "13";
    return {
      id: r.intScreenNo + "_" + r.intKeySeq,
      cls: !isTable ? "is-move" : orderByTable.value.has(String(r.lngKeyscrNo)) ? "is-unpaid" : "is-idle",
      style: {
        left: d.x * k + "px",
        top: d.y * k + "px",
        width: Math.max(2, d.w * k) + "px",
        height: Math.max(2, d.h * k) + "px",
      },
    };
  });
  const sc = scale.value;
  const s = scrollPos.value;
  const vw = Math.min(w, (s.w / sc) * k);
  const vh = Math.min(h, (s.h / sc) * k);
  const vx = Math.max(0, (s.left - stageOffset.value.x) / sc) * k;
  const vy = Math.max(0, (s.top - stageOffset.value.y) / sc) * k;
  return {
    w: Math.round(w),
    h: Math.round(h),
    k,
    keys,
    view: {
      left: Math.min(vx, w - vw) + "px",
      top: Math.min(vy, h - vh) + "px",
      width: vw + "px",
      height: vh + "px",
    },
  };
});
let dragging = false;
const moveTo = (e) => {
  const el = canvasRef.value;
  if (!el) return;
  const rect = e.currentTarget.getBoundingClientRect();
  const inner = 4;
  const mm = minimap.value;
  const sc = scale.value;
  const x = (e.clientX - rect.left - inner) / mm.k;
  const y = (e.clientY - rect.top - inner) / mm.k;
  el.scrollTo({
    left: x * sc + stageOffset.value.x - el.clientWidth / 2,
    top: y * sc + stageOffset.value.y - el.clientHeight / 2,
  });
};
const onMinimapDown = (e) => {
  dragging = true;
  e.currentTarget.setPointerCapture?.(e.pointerId);
  moveTo(e);
};
const onMinimapMove = (e) => {
  if (dragging) moveTo(e);
};
const onMinimapUp = () => {
  dragging = false;
};

onBeforeUnmount(() => {
  window.visualViewport?.removeEventListener("resize", onViewportChange);
  window.visualViewport?.removeEventListener("scroll", onViewportChange);
  clearInterval(tickTimer);
  if (ro) ro.disconnect();
});
</script>

<style scoped>
.mut-page {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  /* 레이아웃이 화면에 mt-1(4px)을 붙이므로 그만큼 빼야 바깥 스크롤이 생기지 않는다 */
  min-height: calc(100% - 0.25rem);
  /* 아래 여백 = 하단 탭(3.6rem + 홈 표시줄 영역) 위로 내용이 보이게 */
  padding: 3.75rem 0.75rem calc(4.75rem + env(safe-area-inset-bottom));
  /* 레이아웃이 붙이는 overflow-y-auto 를 풀어야 보기 전환 줄(sticky)이 화면 위에 붙는다 */
  overflow: visible;
  background: var(--m-bg, #f8fafc);
}

/*
 * 배치도 보기: 화면 전체를 보이는 화면 높이로 고정하고 배치도가 남은 높이를 모두 차지한다.
 * (주소창·키보드에 따라 변하는 높이는 dvh 가 따라간다. dvh 를 모르는 브라우저는 vh)
 */
.mut-page.is-layout {
  height: calc(100vh - 0.25rem);
  height: calc(100dvh - 0.25rem);
  min-height: 0;
}

/* 버튼 공통: 누를 때 회색 사각형 깜빡임 제거, 두 번 눌러 확대 방지 */
.mut-page button,
.mut-dim button {
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

/* 요약 카드 (매장 선택 + 새로고침 + 합계) */
.mut-summary {
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  gap: 0.375rem;
  padding: 0.5rem 0.5rem 0.5rem;
  border-radius: 1rem;
  background: linear-gradient(135deg, #1e40af, #2563eb);
  box-shadow: 0 6px 16px rgb(37 99 235 / 0.2);
  color: #dbeafe;
  font-size: calc(0.8125rem * var(--m-fs, 1));
}

.mut-summary__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.mut-summary__row--main {
  align-items: flex-end;
  padding: 0 0.25rem;
}

/* 매장 선택 */
.mut-store {
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  height: 2.5rem;
  padding: 0 0.75rem;
  border: none;
  border-radius: 0.75rem;
  background: rgb(255 255 255 / 0.16);
  color: #fff;
  text-align: left;
  transition: background-color 0.15s ease;
}

.mut-store:active {
  background: rgb(255 255 255 / 0.28);
}

/* 매장이 1개뿐인 계정: 누를 수 없으므로 버튼 모양을 뺀다 */
.mut-store.is-locked,
.mut-store.is-locked:active {
  padding-left: 0.25rem;
  background: transparent;
}

.mut-store__ico {
  flex: 0 0 auto;
  color: #bfdbfe;
}

.mut-store__name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  font-size: calc(1rem * var(--m-fs, 1));
  font-weight: 700;
  color: #fff;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mut-store__chev {
  flex: 0 0 auto;
  color: #bfdbfe;
  font-size: calc(0.75rem * var(--m-fs, 1));
}

.mut-refresh {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  border-radius: 0.75rem;
  background: rgb(255 255 255 / 0.16);
  color: #fff;
  font-size: calc(1rem * var(--m-fs, 1));
  transition: background-color 0.15s ease;
}

.mut-refresh:active {
  background: rgb(255 255 255 / 0.28);
}

.mut-refresh:disabled {
  opacity: 0.6;
}

.mut-summary__amt {
  flex: 0 0 auto;
  font-size: calc(1.5rem * var(--m-fs, 1));
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  line-height: 1.15;
  letter-spacing: -0.01em;
  color: #fff;
  white-space: nowrap;
}

.mut-summary__amt small {
  margin-left: 0.15rem;
  font-size: calc(0.875rem * var(--m-fs, 1));
  font-weight: 600;
}

.mut-summary__side {
  display: flex;
  flex: 0 1 auto;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.1rem;
  min-width: 0;
  padding-bottom: 0.15rem;
  font-variant-numeric: tabular-nums;
  text-align: right;
  word-break: keep-all;
}

.mut-summary__side b {
  color: #fff;
  font-size: calc(0.9375rem * var(--m-fs, 1));
}

.mut-summary__time {
  min-height: 1rem;
  font-size: calc(0.75rem * var(--m-fs, 1));
  color: #bfdbfe;
}

/* 보기 전환: 목록을 내려도 상단 바(3.25rem) 바로 아래에 붙는다 */
.mut-segbar {
  position: sticky;
  top: 3.25rem;
  z-index: 6;
  flex: 0 0 auto;
  margin: -0.3125rem -0.75rem;
  padding: 0.3125rem 0.75rem;
  background: var(--m-bg, #f8fafc);
}

.mut-seg {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 0.1875rem;
  border-radius: 0.75rem;
  background: var(--m-surface-3, #e2e8f0);
}

/* 선택 표시(흰 판)가 좌우로 미끄러진다 */
.mut-seg::before {
  content: "";
  position: absolute;
  top: 0.1875rem;
  bottom: 0.1875rem;
  left: 0.1875rem;
  width: calc(50% - 0.1875rem);
  border-radius: 0.5625rem;
  background: var(--m-surface, #fff);
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.1);
  transition: transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.mut-seg.is-second::before {
  transform: translateX(100%);
}

.mut-seg button {
  position: relative;
  z-index: 1;
  height: 2.25rem;
  border: none;
  border-radius: 0.5625rem;
  background: transparent;
  font-size: calc(0.9375rem * var(--m-fs, 1));
  font-weight: 600;
  color: var(--m-text-3, #64748b);
  transition: color 0.2s ease;
}

.mut-seg button.is-on {
  color: var(--m-accent-strong, #1e40af);
}

.mut-noticebar {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 0.5rem;
}

/* 전체 펼치기 / 전체 접기: 보이는 높이 2.25rem, 누르는 영역은 위아래로 넓혀 44px */
.mut-allbtn {
  position: relative;
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 0.25rem;
  height: 2.25rem;
  padding: 0 0.7rem 0 0.55rem;
  border: 1px solid var(--m-border-strong, #cbd5e1);
  border-radius: 999px;
  background: var(--m-surface, #fff);
  font-size: calc(0.8125rem * var(--m-fs, 1));
  font-weight: 600;
  color: var(--m-text-2, #334155);
  white-space: nowrap;
  transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}

.mut-allbtn::after {
  content: "";
  position: absolute;
  inset: -0.25rem 0;
}

.mut-allbtn svg {
  width: 0.95rem;
  height: 0.95rem;
}

.mut-allbtn:active {
  background: var(--m-surface-2, #f1f5f9);
}

.mut-allbtn.is-on {
  border-color: #2563eb;
  background: var(--m-accent-weak, #eff6ff);
  color: var(--m-accent-strong, #1e40af);
}

.mut-notice {
  display: flex;
  flex: 1 1 auto;
  align-items: flex-start;
  gap: 0.35rem;
  min-width: 0;
  margin: 0;
  font-size: calc(0.75rem * var(--m-fs, 1));
  line-height: 1.15rem;
  color: var(--m-danger, #dc2626);
  word-break: keep-all;
}

.mut-notice svg {
  flex: 0 0 auto;
  width: 0.95rem;
  height: 0.95rem;
  margin-top: 0.1rem;
}

.mut-empty {
  flex: 0 0 auto;
  padding: 2.5rem 1rem;
  border: 1px solid var(--m-border, #e2e8f0);
  border-radius: 1rem;
  background: var(--m-surface, #fff);
  font-size: calc(0.875rem * var(--m-fs, 1));
  line-height: 1.5;
  color: var(--m-text-3, #64748b);
  text-align: center;
  word-break: keep-all;
}

.mut-empty--err {
  color: var(--m-danger, #dc2626);
}

.mut-retry {
  display: block;
  height: 2.75rem;
  margin: 0.75rem auto 0;
  padding: 0 1.25rem;
  border: none;
  border-radius: 0.75rem;
  background: #2563eb;
  font-size: calc(0.9375rem * var(--m-fs, 1));
  font-weight: 700;
  color: #fff;
}

.mut-retry:active {
  background: #1d4ed8;
}

/* 처음 불러오는 동안의 자리 표시 카드 */
.mut-skel {
  height: 4.125rem;
  border-radius: 0.875rem;
  background: linear-gradient(90deg, #eef2f6 25%, var(--m-bg, #f8fafc) 37%, #eef2f6 63%) 100% 0 / 400% 100%;
  animation: mut-shimmer 1.4s linear infinite;
}

@keyframes mut-shimmer {
  to {
    background-position: 0 0;
  }
}

/* 목록 카드 */
.mut-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.mut-card {
  overflow: hidden;
  border: 1px solid var(--m-border, #e2e8f0);
  border-left: 4px solid #3b82f6;
  border-radius: 0.875rem;
  background: var(--m-surface, #fff);
}

.mut-card.is-long {
  border-left-color: #f97316;
}

.mut-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  width: 100%;
  min-height: 4rem;
  padding: 0.625rem 0.875rem;
  border: none;
  background: transparent;
  text-align: left;
  transition: background-color 0.15s ease;
}

.mut-card__head:active {
  background: var(--m-surface-2, #f1f5f9);
}

.mut-card__left {
  min-width: 0;
}

.mut-card__table {
  overflow: hidden;
  font-size: calc(1rem * var(--m-fs, 1));
  font-weight: 700;
  color: var(--m-text, #0f172a);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mut-card__meta {
  margin-top: 0.15rem;
  font-size: calc(0.8125rem * var(--m-fs, 1));
  font-variant-numeric: tabular-nums;
  color: var(--m-text-3, #64748b);
}

.mut-card.is-long .mut-card__elapsed {
  font-weight: 700;
  color: var(--m-warm-text, #ea580c);
}

.mut-card__right {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 0.5rem;
}

.mut-card__amt {
  font-size: calc(1.125rem * var(--m-fs, 1));
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  color: var(--m-danger, #dc2626);
  white-space: nowrap;
}

.mut-card__amt small {
  margin-left: 0.1rem;
  font-size: calc(0.75rem * var(--m-fs, 1));
}

.mut-card__chev {
  color: var(--m-text-4, #94a3b8);
  transition: transform 0.26s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.mut-card.is-open .mut-card__chev {
  transform: rotate(180deg);
}

/* 펼침 영역: grid 행 높이 0fr ↔ 1fr 로 부드럽게 열고 닫는다 */
.mut-card__body {
  display: grid;
  grid-template-rows: 1fr;
}

.mut-card__inner {
  min-height: 0;
  overflow: hidden;
}

.mut-card__inner > .mut-menu,
.mut-card__inner > .mut-menu__none {
  margin: 0 0.875rem;
  padding: 0.5rem 0 0.75rem;
  border-top: 1px dashed var(--m-border, #e2e8f0);
}

.mut-acc-enter-active,
.mut-acc-leave-active {
  transition: grid-template-rows 0.26s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.2s ease;
}

.mut-acc-enter-from,
.mut-acc-leave-to {
  grid-template-rows: 0fr;
  opacity: 0;
}

.mut-menu {
  margin: 0;
  padding: 0.5rem 0 0;
  list-style: none;
  font-size: calc(0.875rem * var(--m-fs, 1));
}

.mut-menu li + li {
  margin-top: 0.4rem;
}

.mut-menu__main {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  font-weight: 600;
  color: var(--m-text, #1e293b);
}

.mut-menu__main span:last-child {
  flex: 0 0 auto;
  font-variant-numeric: tabular-nums;
}

.mut-menu__sub {
  padding-left: 0.75rem;
  font-size: calc(0.8125rem * var(--m-fs, 1));
  color: var(--m-text-3, #64748b);
}

.mut-menu__none {
  padding: 0.5rem 0;
  font-size: calc(0.8125rem * var(--m-fs, 1));
  color: var(--m-text-3, #64748b);
}

/* 배치도: 1줄 = 화면(층) 탭 전체 폭, 2줄 = 현재 화면 요약 + 세로/전체/크게 */
.mut-tabs-row {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.mut-screen-info {
  min-width: 0;
  overflow: hidden;
  font-size: calc(0.8125rem * var(--m-fs, 1));
  color: var(--m-text-2, #475569);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mut-screen-info b {
  color: var(--m-danger, #dc2626);
}

.mut-screen-info b.is-zero {
  color: var(--m-text-3, #64748b);
}

.mut-tabs {
  display: flex;
  flex: 0 0 auto;
  gap: 0.375rem;
  min-width: 0;
  /* 위아래 0.25rem 은 탭을 누르는 영역(44px)을 넓히는 자리 */
  margin: -0.25rem 0;
  padding: 0.25rem 0;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scrollbar-width: none;
  scroll-padding: 0 1rem;
}

/* 가려진 탭이 있는 쪽 끝을 흐리게 → 옆으로 넘기면 더 있다는 표시 */
.mut-tabs.fade-right {
  -webkit-mask-image: linear-gradient(to right, #000 calc(100% - 2.5rem), transparent);
  mask-image: linear-gradient(to right, #000 calc(100% - 2.5rem), transparent);
}

.mut-tabs.fade-left {
  -webkit-mask-image: linear-gradient(to left, #000 calc(100% - 2.5rem), transparent);
  mask-image: linear-gradient(to left, #000 calc(100% - 2.5rem), transparent);
}

.mut-tabs.fade-left.fade-right {
  -webkit-mask-image: linear-gradient(
    to right,
    transparent,
    #000 2.5rem,
    #000 calc(100% - 2.5rem),
    transparent
  );
  mask-image: linear-gradient(to right, transparent, #000 2.5rem, #000 calc(100% - 2.5rem), transparent);
}

.mut-tab.has-unpaid:not(.is-on) {
  border-color: var(--m-danger-border, #fca5a5);
  color: var(--m-text, #1e293b);
  font-weight: 600;
}

.mut-tabs::-webkit-scrollbar {
  display: none;
}

.mut-tab {
  position: relative;
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 0.3rem;
  height: 2.25rem;
  padding: 0 0.875rem;
  border: 1px solid var(--m-border-strong, #cbd5e1);
  border-radius: 999px;
  background: var(--m-surface, #fff);
  font-size: calc(0.8125rem * var(--m-fs, 1));
  color: var(--m-text-2, #475569);
  transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}

/* 보이는 크기는 그대로, 누르는 영역만 위아래로 넓힌다 (44px) */
.mut-tab::after,
.mut-zoombar button::after,
.mut-orphans button::after {
  content: "";
  position: absolute;
  inset: -0.25rem 0;
}

.mut-tab.is-on {
  border-color: #2563eb;
  background: #2563eb;
  color: #fff;
}

.mut-tab__cnt {
  min-width: 1.1rem;
  padding: 0 0.3rem;
  border-radius: 999px;
  background: #ef4444;
  color: #fff;
  font-size: calc(0.6875rem * var(--m-fs, 1));
  line-height: 1.1rem;
  text-align: center;
}

/* 높이: 배치도 보기에서 남은 화면 높이를 모두 차지 (.mut-page.is-layout 참고). 너무 작아지지 않게 최소 15rem */
.mut-canvas-wrap {
  position: relative;
  flex: 1 1 0;
  min-height: 15rem;
}

.mut-canvas.is-zoomed {
  cursor: grab;
}

.mut-canvas.is-dragging {
  cursor: grabbing;
  user-select: none;
}

.mut-canvas {
  position: absolute;
  inset: 0;
  overflow: auto;
  border: 1px solid var(--m-border, #e2e8f0);
  border-radius: 1rem;
  background:
    radial-gradient(circle, var(--m-surface-3, #e2e8f0) 1px, transparent 1px) 0 0 / 1rem 1rem,
    var(--m-surface, #fff);
  -webkit-overflow-scrolling: touch;
  /* 위치는 미니맵으로 보이므로 안쪽 스크롤바는 숨긴다 (손가락으로 끌어 이동은 그대로) */
  scrollbar-width: none;
  /* 끝까지 끌어도 바깥 화면이 따라 스크롤되지 않게 (하단 메뉴 숨김/표시 까딱임 방지) */
  overscroll-behavior: contain;
}

.mut-canvas::-webkit-scrollbar {
  display: none;
}

.mut-stage {
  position: relative;
  margin: 12px;
}

.mut-canvas.is-zoomed .mut-stage {
  margin-bottom: 7.5rem;
}

.mut-tbl {
  position: absolute;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.1em;
  padding: 0.2em;
  overflow: hidden;
  border-radius: 0.5rem;
  line-height: 1.15;
  text-align: center;
  transition: transform 0.12s ease;
}

.mut-tbl.shape-1 {
  border-radius: 50%;
}

.mut-tbl.is-idle {
  border: 1px dashed color-mix(in srgb, var(--key-color) 55%, #94a3b8);
  background: color-mix(in srgb, var(--key-color) 8%, var(--m-bg, #f8fafc));
  color: var(--m-text-3, #64748b);
}

.mut-tbl.is-unpaid {
  z-index: 1;
  border: 2px solid #ef4444;
  border-top: 0.35em solid var(--key-color);
  background: var(--m-surface, #fff);
  box-shadow: 0 4px 10px rgb(239 68 68 / 0.2);
  color: var(--m-text, #1e293b);
}

.mut-tbl.is-unpaid:active {
  transform: scale(0.96);
}

.mut-tbl__name {
  max-width: 100%;
  overflow: hidden;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mut-tbl__amt {
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  color: var(--m-danger, #dc2626);
  white-space: nowrap;
}

.mut-tbl__meta {
  font-size: 0.8em;
  color: var(--m-text-3, #64748b);
  white-space: nowrap;
}

.mut-move {
  position: absolute;
  box-sizing: border-box;
  overflow: hidden;
  border: 1px solid var(--m-border-strong, #cbd5e1);
  border-radius: 0.4rem;
  background: var(--m-surface-2, #f1f5f9);
  color: var(--m-text-2, #475569);
  font-weight: 600;
  white-space: nowrap;
}

.mut-move:active {
  background: var(--m-surface-3, #e2e8f0);
}

.mut-zoombar {
  display: flex;
  flex: 0 0 auto;
  border: 1px solid var(--m-border-strong, #cbd5e1);
  border-radius: 0.625rem;
  background: var(--m-surface, #fff);
}

.mut-zoombar button {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  height: 2.25rem;
  padding: 0 0.6rem;
  border: none;
  background: transparent;
  font-size: calc(0.8125rem * var(--m-fs, 1));
  color: var(--m-text-2, #475569);
  transition: background-color 0.15s ease, color 0.15s ease;
}

.mut-zoombar button:first-child {
  border-radius: 0.5625rem 0 0 0.5625rem;
}

.mut-zoombar button:last-child {
  border-radius: 0 0.5625rem 0.5625rem 0;
}

.mut-zoombar button + button {
  border-left: 1px solid var(--m-border, #e2e8f0);
}

.mut-zoombar button:active {
  background: var(--m-surface-2, #f1f5f9);
}

.mut-zoombar button.is-on {
  background: var(--m-accent-weak, #eff6ff);
  font-weight: 700;
  color: var(--m-accent-strong, #1e40af);
}

.mut-zoombar svg {
  width: 0.9rem;
  height: 0.9rem;
}

.mut-minimap {
  position: absolute;
  right: 0.5rem;
  bottom: 0.5rem;
  z-index: 5;
  box-sizing: content-box;
  padding: 4px;
  border: 1px solid var(--m-border-strong, #cbd5e1);
  border-radius: 0.5rem;
  background: rgb(255 255 255 / 0.95);
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.18);
  touch-action: none;
}

.mut-minimap__key {
  position: absolute;
  margin: 4px;
  border-radius: 1px;
  pointer-events: none;
}

.mut-minimap__key.is-idle {
  background: var(--m-surface-3, #cbd5e1);
}

.mut-minimap__key.is-unpaid {
  background: #ef4444;
}

.mut-minimap__key.is-move {
  background: var(--m-surface-3, #e2e8f0);
}

.mut-minimap__view {
  position: absolute;
  box-sizing: border-box;
  margin: 4px;
  border: 2px solid #2563eb;
  border-radius: 2px;
  background: rgb(37 99 235 / 0.08);
  pointer-events: none;
}

.mut-orphans {
  display: flex;
  flex: 0 0 auto;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 0.375rem;
  font-size: calc(0.8125rem * var(--m-fs, 1));
  color: var(--m-text-2, #475569);
}

.mut-orphans button {
  position: relative;
  height: 2.25rem;
  padding: 0 0.75rem;
  border: 1px solid var(--m-danger-border, #fca5a5);
  border-radius: 999px;
  background: var(--m-surface, #fff);
  font-variant-numeric: tabular-nums;
  color: var(--m-danger, #b91c1c);
}

.mut-orphans button:active {
  background: var(--m-danger-weak, #fef2f2);
}

/* 아래에서 올라오는 시트 */
.mut-dim {
  position: fixed;
  inset: 0;
  z-index: 10050;
  box-sizing: border-box;
  display: flex;
  align-items: flex-end;
  background: rgb(15 23 42 / 0.45);
  /* 시트가 열려 있는 동안 뒤 화면이 끌려 스크롤되지 않게 */
  overscroll-behavior: contain;
  touch-action: none;
}

.mut-sheet {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 78vh;
  /* 키보드가 올라와 남은 높이가 줄면 그 안에 맞춘다 (100% = 키보드 위 남은 높이) */
  max-height: min(78dvh, 100%);
  padding: 0.5rem 1rem calc(1rem + env(safe-area-inset-bottom));
  border-radius: 1.25rem 1.25rem 0 0;
  background: var(--m-surface, #fff);
  box-shadow: 0 -12px 32px rgba(15, 23, 42, 0.2);
  touch-action: pan-y;
  will-change: transform;
}

/* 매장 선택 시트: 높이 고정 (검색 결과가 줄어도 검색창 위치가 그대로) */
.mut-sheet--fixed {
  height: 70vh;
  height: 70dvh;
  max-height: 100%;
}

/* 시트 안에서 목록만 줄어들고 손잡이·제목·검색창·닫기 버튼은 크기를 지킨다 */
.mut-sheet > :not(.mut-sheet__list) {
  flex-shrink: 0;
}

/* 손잡이 + 제목: 아래로 끌어 닫는 영역 (시트 폭 전체) */
.mut-sheet__drag {
  margin: -0.5rem -1rem 0;
  padding: 0.5rem 1rem 0;
  cursor: grab;
  touch-action: none;
  user-select: none;
}

.mut-sheet__grab {
  width: 2.5rem;
  height: 0.3rem;
  margin: 0.125rem auto 0.75rem;
  border-radius: 999px;
  background: var(--m-surface-3, #cbd5e1);
}

.mut-sheet__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  padding-bottom: 0.625rem;
  border-bottom: 1px solid var(--m-border, #e2e8f0);
}

.mut-sheet__title {
  font-size: calc(1.0625rem * var(--m-fs, 1));
  font-weight: 700;
  color: var(--m-text, #0f172a);
}

.mut-sheet__searchbox {
  position: relative;
  display: flex;
  align-items: center;
  height: 2.75rem;
  min-height: 2.75rem;
  margin: 0.625rem 0;
}

.mut-sheet__searchico {
  position: absolute;
  left: 0.875rem;
  color: var(--m-text-4, #94a3b8);
  pointer-events: none;
}

.mut-sheet__search {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 0 2.75rem 0 2.5rem;
  border: 1px solid var(--m-border-strong, #cbd5e1);
  border-radius: 0.75rem;
  background: var(--m-surface, #fff);
  font-size: calc(1rem * var(--m-fs, 1));
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.mut-sheet__search:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgb(59 130 246 / 0.15);
}

.mut-sheet__clear {
  position: absolute;
  right: 0.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border: none;
  border-radius: 999px;
  background: var(--m-surface-2, #f1f5f9);
  color: var(--m-text-3, #64748b);
}

/* 보이는 크기는 그대로, 누르는 영역만 44px 로 */
.mut-sheet__clear::after {
  content: "";
  position: absolute;
  inset: -0.5rem;
}

.mut-sheet__list {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.mut-sheet__list::-webkit-scrollbar {
  display: none;
}

.mut-sheet__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  width: 100%;
  min-height: 3.25rem;
  padding: 0 0.5rem;
  border: none;
  border-bottom: 1px solid var(--m-border, #f1f5f9);
  border-radius: 0.5rem;
  background: transparent;
  font-size: calc(1rem * var(--m-fs, 1));
  color: var(--m-text, #1e293b);
  text-align: left;
  transition: background-color 0.15s ease;
}

.mut-sheet__item:active {
  background: var(--m-surface-2, #f1f5f9);
}

.mut-sheet__item.is-on {
  font-weight: 700;
  color: var(--m-accent, #2563eb);
}

.mut-sheet__item.is-on::after {
  content: "✓";
  flex: 0 0 auto;
}

.mut-sheet__close {
  height: 3rem;
  margin-top: 0.75rem;
  border: none;
  border-radius: 0.875rem;
  background: var(--m-surface-2, #f1f5f9);
  font-size: calc(1rem * var(--m-fs, 1));
  font-weight: 600;
  color: var(--m-text-2, #334155);
  transition: background-color 0.15s ease;
}

.mut-sheet__close:active {
  background: var(--m-surface-3, #e2e8f0);
}

/* 시트: 아래에서 부드럽게 올라오고 내려감 */
.mut-sheet-enter-active,
.mut-sheet-leave-active {
  transition: background-color 0.3s ease;
}

.mut-sheet-enter-active .mut-sheet {
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.mut-sheet-leave-active .mut-sheet {
  transition: transform 0.25s cubic-bezier(0.4, 0, 1, 1);
}

.mut-sheet-enter-from,
.mut-sheet-leave-to {
  background-color: rgb(15 23 42 / 0);
}

.mut-sheet-enter-from .mut-sheet,
.mut-sheet-leave-to .mut-sheet {
  transform: translateY(100%);
}

/* 「동작 줄이기」를 켠 기기: 움직이는 효과를 끈다 (배경 흐려짐만 남김) */
@media (prefers-reduced-motion: reduce) {
  .mut-seg::before,
  .mut-card__chev,
  .mut-tbl,
  .mut-acc-enter-active,
  .mut-acc-leave-active,
  .mut-sheet-enter-active .mut-sheet,
  .mut-sheet-leave-active .mut-sheet {
    transition: none;
  }

  .mut-skel {
    animation: none;
  }
}
</style>
