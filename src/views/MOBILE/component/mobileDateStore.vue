/*--############################################################################
# Filename : MST01_033INS.vue                                                  
# Description : 마스터관리 > 메뉴 마스터 > 메뉴코드등록                        
# Date :2025-05-14                                                             
# Author : 권맑음                     
################################################################################*/
<template>
  <div class="mds-bar">
    <button type="button" class="mds-summary" @click="showStoreAndDate">
      <div class="mds-summary-body">
        <div class="mds-summary-row">
          <font-awesome-icon :icon="['far', 'calendar']" class="mds-ico" />
          <span>{{ displayDate(startDate) }} ~ {{ displayDate(endDate) }}</span>
        </div>
        <div class="mds-summary-row mds-summary-store">
          <font-awesome-icon :icon="['fas', 'location-dot']" class="mds-ico" />
          <span class="truncate">{{ selectedStoreName }}</span>
        </div>
      </div>
      <span class="mds-filter-btn" :class="{ 'is-open': show }">
        <font-awesome-icon :icon="['fas', 'sliders']" />
      </span>
    </button>
  </div>

  <div v-show="show" class="mds-layer">
    <div class="mds-dim" @click="closePanel"></div>
    <div class="mds-sheet">
      <div class="mds-sheet-head">
        <div>
          <div class="mds-sheet-title">조회 조건</div>
          <div class="mds-sheet-sub">기간과 지점을 선택한 뒤 조회하세요</div>
        </div>
        <button type="button" class="mds-close" @click="closePanel">
          <font-awesome-icon icon="xmark" />
        </button>
      </div>

      <div class="mds-label">조회기간</div>
      <div class="mds-date-box">
        <input
          type="date"
          v-model="startDate"
          class="mds-date"
          @input="resetIcon" />
        <span class="mds-tilde">~</span>
        <input
          type="date"
          v-model="endDate"
          class="mds-date"
          @input="resetIcon" />
      </div>

      <div class="mds-chips">
        <button
          type="button"
          class="mds-chip"
          :class="{ 'is-on': setIcon == 1 }"
          @click="setYesterDay">
          전일
        </button>
        <button
          type="button"
          class="mds-chip"
          :class="{ 'is-on': setIcon == 2 }"
          @click="setLastWeek">
          1주일
        </button>
        <button
          type="button"
          class="mds-chip"
          :class="{ 'is-on': setIcon == 3 }"
          @click="setLastMonth">
          1개월
        </button>
        <button
          type="button"
          class="mds-chip"
          :class="{ 'is-on': setIcon == 4 }"
          @click="setLast3Month">
          3개월
        </button>
      </div>

      <div class="mds-label">지점명</div>
      <!-- 매장이 많으면 검색 + 목록 (초성·한글 조합 중 즉시 반영). 고른 값은 기존 select 와 같은 형태로 selectedStoreCd2 에 넣는다 -->
      <template v-if="StoreList.length > STORE_SEARCH_MIN">
        <div class="mds-store-search">
          <font-awesome-icon :icon="['fas', 'magnifying-glass']" class="mds-store-search-ico" />
          <input
            :value="storeWord"
            type="text"
            class="mds-store-search-input"
            placeholder="매장명 검색 (초성 가능)"
            @input="onStoreWord"
            @compositionupdate="onStoreWord"
            @compositionend="onStoreWord" />
          <button
            v-if="storeWord"
            type="button"
            class="mds-store-search-clear"
            aria-label="검색어 지우기"
            @click="storeWord = ''">
            <font-awesome-icon icon="xmark" />
          </button>
        </div>
        <div class="mds-store-list" role="listbox">
          <button
            v-for="i in filteredStoreList"
            :key="i.GROUP_CD + '-' + i.STORE_CD"
            type="button"
            role="option"
            class="mds-store-item"
            :class="{ 'is-on': isPickedStore(i) }"
            :aria-selected="isPickedStore(i)"
            @click="pickStoreRow(i)">
            <span class="truncate">{{ storeOptionLabel(i) }}</span>
            <font-awesome-icon
              v-if="isPickedStore(i)"
              :icon="['fas', 'check']"
              class="mds-store-check" />
          </button>
          <div v-if="filteredStoreList.length === 0" class="mds-store-empty">
            검색된 매장이 없습니다.
          </div>
        </div>
      </template>
      <div v-else class="mds-select-wrap">
        <font-awesome-icon :icon="['fas', 'store']" class="mds-select-ico" />
        <select class="mds-select" v-model="selectedStoreCd2">
          <option v-if="!selectedStoreCd2" :value="null" disabled>매장을 선택하세요</option>
          <option
            :value="selectStoreLabel ? i._pick : { STORE_CD: i.STORE_CD, GROUP_CD: i.GROUP_CD }"
            v-for="i in StoreList"
            :key="i.GROUP_CD + '-' + i.STORE_CD">
            {{ storeOptionLabel(i) }}
          </option>
        </select>
        <font-awesome-icon
          :icon="['fas', 'chevron-down']"
          class="mds-select-chevron" />
      </div>

      <button
        type="button"
        class="mds-search"
        :disabled="!selectedStoreCd2"
        @click="sendSearch">
        {{ selectedStoreCd2 ? "조회" : "매장을 선택하세요" }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { getAppStoreList } from "@/api/mobile";
import { formatLocalDate } from "@/customFunc/customFunc";
import store from "@/store";
/*
 * 공통 표준  Function
 */

import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { matchNameWithChoseong } from "@/utils/choseongFilter";

/**
 * 선택한 매출 시작일자
 */

const startDate = ref(formatLocalDate(new Date()));
/**
 * 선택한 매출 종료일자
 */

const endDate = ref(formatLocalDate(new Date()));
const selectedStoreName = ref("");
const show = ref(false);

const props = defineProps({
  changeState: {
    type: Boolean,
    default: false,
  },
  /** 청구 등록 전용. 다른 화면은 넘기지 않는다. */
  selectStoreLabel: {
    type: String,
    default: "",
  },
  /**
   * 본사 계정(매장 여러 개, 목록에 「전체」 행이 있을 때) 첫 선택을 「전체」로.
   * 기본 false = 기존처럼 로그인 매장. 저장 프로시저가 매장코드 0(전체)을 처리하는 화면에서만 켠다.
   */
  defaultAllStores: {
    type: Boolean,
    default: false,
  },
  /** 매장 계정이면 화면에 들어오자마자 바로 조회 (본사는 제외). 기본 false = 기존처럼 조회 버튼 */
  autoSearch: {
    type: Boolean,
    default: false,
  },
  /**
   * 주소의 ?from=YYYY-MM-DD&to=YYYY-MM-DD 를 조회기간으로 받아, 들어오자마자 그 기간으로 바로 조회한다
   * (모바일 홈 대시보드의 일·주간·월매출 줄을 눌러 들어온 경우). 기본 false = 주소 값을 보지 않는다.
   * 바로 조회하는 계정: 매장 계정(매장 1개 → 자기 매장), 본사 계정(defaultAllStores 로 「전체」가 선택된 경우)
   * 주소에 값이 없거나 날짜 형식이 아니면 아무것도 바꾸지 않는다.
   */
  queryPeriod: {
    type: Boolean,
    default: false,
  },
});

/* queryPeriod: 주소로 받은 기간 (둘 다 YYYY-MM-DD 이고 시작 ≤ 종료일 때만 사용) */
const route = useRoute();
const periodFromQuery = (() => {
  if (!props.queryPeriod) return null;
  const from = String(route?.query?.from ?? "");
  const to = String(route?.query?.to ?? "");
  const ok = (v) => /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(new Date(v + "T00:00:00").getTime());
  return ok(from) && ok(to) && from <= to ? { from, to } : null;
})();
if (periodFromQuery) {
  startDate.value = periodFromQuery.from;
  endDate.value = periodFromQuery.to;
}

const resetIcon = () => {
  setIcon.value = 0;
};
const displayDate = (value) => String(value || "").replaceAll("-", ".");
const closePanel = () => {
  show.value = false;
};
const setIcon = ref(0);
const setYesterDay = () => {
  const today = new Date();
  today.setDate(today.getDate() - 1);

  startDate.value = formatLocalDate(today);
  endDate.value = formatLocalDate(today);
  setIcon.value = 1;
};
const setLastWeek = () => {
  const today = new Date();
  today.setDate(today.getDate() - 1);
  endDate.value = formatLocalDate(today);

  today.setDate(today.getDate() - 6);
  startDate.value = formatLocalDate(today);
  setIcon.value = 2;
};
const setLastMonth = () => {
  const today = new Date();
  today.setDate(today.getDate() - 1);
  endDate.value = formatLocalDate(today);

  today.setMonth(today.getMonth() - 1);
  today.setDate(today.getDate() + 1);
  startDate.value = formatLocalDate(today);
  setIcon.value = 3;
};
const setLast3Month = () => {
  const today = new Date();
  today.setDate(today.getDate() - 1);
  endDate.value = formatLocalDate(today);

  today.setMonth(today.getMonth() - 3);
  today.setDate(today.getDate() + 1);
  startDate.value = formatLocalDate(today);
  setIcon.value = 4;
};
const isAllStoreRow = (item) => {
  if (!item) return false;
  const name = String(item.STORE_NM ?? "").replace(/\s/g, "");
  const code = String(item.STORE_CD ?? "").trim();
  return name === "전체" || (code !== "" && Number(code) === 0);
};

const storeOptionLabel = (item) => {
  if (props.selectStoreLabel && isAllStoreRow(item)) return props.selectStoreLabel;
  return item.STORE_NM;
};

const emit = defineEmits([
  "currState",
  "startDate",
  "endDate",
  "GROUP_CD",
  "STORE_CD",
  "STORE_NM",
  "SEARCHNOW",
]);
/*
 * 매장 검색 — 매장이 STORE_SEARCH_MIN 개보다 많을 때만 검색창 + 목록으로 보여 준다 (적으면 기존 select).
 * 목록에서 고른 값은 기존 select 의 option value 와 같은 형태로 selectedStoreCd2 에 넣으므로
 * sendSearch·emit(GROUP_CD/STORE_CD/STORE_NM/SEARCHNOW) 동작은 그대로다.
 */
const STORE_SEARCH_MIN = 5;
const storeWord = ref("");
const onStoreWord = (e) => {
  storeWord.value = e?.target?.value ?? "";
};
const filteredStoreList = computed(() => {
  const w = storeWord.value.trim();
  if (!w) return StoreList.value;
  return StoreList.value.filter((i) =>
    matchNameWithChoseong(String(storeOptionLabel(i) ?? ""), w)
  );
});
const storeRowValue = (i) =>
  props.selectStoreLabel ? i._pick : { STORE_CD: i.STORE_CD, GROUP_CD: i.GROUP_CD };
const isPickedStore = (i) => {
  const cur = selectedStoreCd2.value;
  return Boolean(
    cur && String(cur.STORE_CD) === String(i.STORE_CD) && String(cur.GROUP_CD) === String(i.GROUP_CD)
  );
};
const pickStoreRow = (i) => {
  selectedStoreCd2.value = storeRowValue(i);
};

const showStoreAndDate = () => {
  if (show.value) {
    closePanel();
    return;
  }
  show.value = true;
  storeWord.value = "";
  selectedStoreCd2.value = selectedStoreCd.value;
};
/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const res = await getAppStoreList(
    store.state.userData.GROUP_CD,
    store.state.userData.STORE_CD,
    store.state.userData.USER_NO
  );

  ////console.log(store.state.userData);

  const rawList = Array.isArray(res?.data?.List) ? res.data.List : [];
  StoreList.value = rawList.map((item) => ({
    ...item,
    _pick: { STORE_CD: item.STORE_CD, GROUP_CD: item.GROUP_CD },
  }));
  const concrete = StoreList.value.filter((item) => !isAllStoreRow(item));
  const mine = concrete.find(
    (item) => String(item.STORE_CD) === String(store.state.userData?.STORE_CD)
  );
  const lockedToOneStore =
    Boolean(props.selectStoreLabel) && concrete.length === 1 && Boolean(mine);

  /*
   * 본사(매장 2개 이상)인데 이 화면이 「전체」를 지원하지 않으면(defaultAllStores 꺼짐):
   * 「전체」 행을 빼고, 매장을 고르기 전까지는 「매장을 선택하세요」 + 조회 버튼 비활성
   * (청구 등록처럼 selectStoreLabel 을 쓰는 화면은 기존 동작 그대로)
   */
  if (!props.selectStoreLabel && !props.defaultAllStores && concrete.length > 1) {
    StoreList.value = concrete;
    selectedStoreCd.value = null;
    selectedStoreCd2.value = null;
    selectedStoreName.value = "매장을 선택하세요";
    return;
  }

  if (props.selectStoreLabel && !lockedToOneStore) {
    let allRow = StoreList.value.find((item) => isAllStoreRow(item));
    if (!allRow) {
      allRow = {
        STORE_CD: 0,
        GROUP_CD: store.state.userData?.GROUP_CD,
        STORE_NM: "전체",
        _pick: { STORE_CD: 0, GROUP_CD: store.state.userData?.GROUP_CD },
      };
      StoreList.value = [allRow, ...StoreList.value];
    }
    selectedStoreCd.value = allRow._pick;
    selectedStoreCd2.value = allRow._pick;
    selectedStoreName.value = props.selectStoreLabel;
    emit("GROUP_CD", allRow.GROUP_CD);
    emit("STORE_CD", allRow.STORE_CD);
    emit("STORE_NM", props.selectStoreLabel);
    return;
  }

  /* opt-in: 본사(매장 2개 이상 + 「전체」 행 있음)면 첫 선택을 「전체」로 */
  const allStoreRow =
    props.defaultAllStores && !lockedToOneStore && concrete.length > 1
      ? StoreList.value.find((item) => isAllStoreRow(item))
      : null;
  const pickedRow =
    (lockedToOneStore ? mine : null) ||
    allStoreRow ||
    StoreList.value.find(
      (item) => item.STORE_CD == store.state.userData?.STORE_CD
    );
  selectedStoreCd.value = pickedRow?._pick || {
    STORE_CD: store.state.userData?.STORE_CD,
    GROUP_CD: store.state.userData?.GROUP_CD,
  };
  selectedStoreCd2.value = selectedStoreCd.value;
  selectedStoreName.value = pickedRow?.STORE_NM || "";
  if (props.selectStoreLabel && lockedToOneStore && pickedRow) {
    emit("GROUP_CD", pickedRow.GROUP_CD);
    emit("STORE_CD", pickedRow.STORE_CD);
    emit("STORE_NM", pickedRow.STORE_NM);
    emit("startDate", startDate.value);
    emit("endDate", endDate.value);
    emit("SEARCHNOW", true);
    return;
  }
  /*
   * opt-in(autoSearch): 매장 계정(고를 매장이 1개)은 화면에 들어오자마자 오늘 기준으로 바로 조회.
   * 본사(매장 2개 이상)는 자동 조회하지 않는다. 순서는 sendSearch 와 같다.
   *
   * opt-in(queryPeriod): 주소로 기간을 받아 들어온 경우에는 받은 기간으로 바로 조회한다.
   * 매장 계정(매장 1개)과, 「전체」가 선택된 본사 계정만. (매장이 여러 개인데 「전체」가 없으면 바로 조회하지 않는다)
   */
  const searchByQueryPeriod =
    Boolean(periodFromQuery) && (concrete.length <= 1 || Boolean(allStoreRow));
  if (
    ((props.autoSearch && concrete.length <= 1) || searchByQueryPeriod) &&
    !props.selectStoreLabel &&
    selectedStoreCd.value &&
    selectedStoreCd.value.STORE_CD != null
  ) {
    emit("startDate", startDate.value);
    emit("endDate", endDate.value);
    emit("GROUP_CD", selectedStoreCd.value.GROUP_CD);
    emit("STORE_CD", selectedStoreCd.value.STORE_CD);
    emit("SEARCHNOW", true);
  }
});

const StoreList = ref([]);
watch(
  () => props.changeState,
  () => {
    //comsole.log(props.changeState);
    if (props.changeState == false) {
      show.value = props.changeState;
      emit("currState", true);
    }
  }
);

/**
 * 선택한 매장 코드 호출 함수
 */

const selectedStoreCd = ref(0);
/**
 * 선택한 매장 코드 호출 함수
 */

const selectedStoreCd2 = ref(0);
const sendSearch = () => {
  const current = selectedStoreCd2.value;
  if (props.selectStoreLabel) {
    const picked = StoreList.value.find(
      (item) => current && item.STORE_CD == current.STORE_CD
    );
    const placeholder = !picked || isAllStoreRow(picked);
    if (placeholder) {
      selectedStoreName.value = props.selectStoreLabel;
      emit("GROUP_CD", picked?.GROUP_CD);
      emit("STORE_CD", picked?.STORE_CD ?? "0");
      emit("STORE_NM", props.selectStoreLabel);
      emit("startDate", startDate.value);
      emit("endDate", endDate.value);
      emit("SEARCHNOW", true);
      return;
    }
    selectedStoreCd.value = picked._pick || current;
    selectedStoreName.value = picked.STORE_NM;
    emit("startDate", startDate.value);
    emit("endDate", endDate.value);
    emit("GROUP_CD", picked.GROUP_CD);
    emit("STORE_CD", picked.STORE_CD);
    emit("STORE_NM", picked.STORE_NM);
    emit("SEARCHNOW", true);
    show.value = false;
    return;
  }

  if (!current || current.STORE_CD == null) return;
  emit("startDate", startDate.value);
  emit("endDate", endDate.value);
  emit("GROUP_CD", current.GROUP_CD);
  emit("STORE_CD", current.STORE_CD);
  selectedStoreCd.value = current;
  const picked = StoreList.value.find(
    (item) =>
      item.STORE_CD == current.STORE_CD && item.GROUP_CD == current.GROUP_CD
  );
  if (!picked) return;
  selectedStoreName.value = picked.STORE_NM;
  emit("SEARCHNOW", true);
  show.value = false;
};
</script>

<style scoped>
.mds-bar {
  position: absolute;
  top: 3.25rem;
  left: 0;
  z-index: 45;
  display: flex;
  align-items: center;
  width: 100%;
  height: 9vh;
  padding: 0 0.75rem;
}

.mds-summary {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  height: 7.2vh;
  padding: 0 0.85rem;
  border: 1px solid var(--m-border, #e2e8f0);
  border-radius: 1rem;
  background: var(--m-surface, #fff);
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.06);
  text-align: left;
}

.mds-summary-body {
  min-width: 0;
  flex: 1;
}

.mds-summary-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: calc(0.8125rem * var(--m-fs, 1));
  font-weight: 700;
  color: var(--m-text, #1e293b);
  white-space: nowrap;
}

.mds-summary-store {
  margin-top: 0.1rem;
  font-size: calc(0.75rem * var(--m-fs, 1));
  font-weight: 500;
  color: var(--m-text-3, #64748b);
}

.mds-ico {
  width: 0.85rem;
  color: #5782ff;
}

.mds-summary-store .mds-ico {
  color: var(--m-text-4, #94a3b8);
}

.mds-filter-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.75rem;
  background: var(--m-accent-weak, #eff4ff);
  color: #5782ff;
  flex-shrink: 0;
}

.mds-filter-btn.is-open {
  background: #5782ff;
  color: #fff;
}

.mds-layer {
  position: fixed;
  inset: 0;
  z-index: 40;
}

.mds-dim {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
}

.mds-sheet {
  position: absolute;
  left: 0.75rem;
  right: 0.75rem;
  top: 16vh;
  /* 화면이 낮은 휴대폰: 패널이 화면 아래로 넘치지 않게 하고, 넘치는 만큼은 패널 안에서 스크롤 */
  max-height: calc(100vh - 16vh - 0.75rem);
  max-height: calc(100dvh - 16vh - 0.75rem);
  overflow-y: auto;
  overscroll-behavior: contain;
  /* 세로로 쌓고, 화면이 낮으면 매장 목록 칸만 줄여서 [조회] 버튼이 항상 보이게 */
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border-radius: 1.25rem;
  background: var(--m-surface, #fff);
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.18);
}

/* 버튼 공통: 누를 때 회색 사각형 깜빡임 제거 */
.mds-sheet button,
.mds-summary {
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

.mds-sheet-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 0.9rem;
}

.mds-sheet-title {
  font-size: calc(1.05rem * var(--m-fs, 1));
  font-weight: 700;
  color: var(--m-text, #0f172a);
}

.mds-sheet-sub {
  margin-top: 0.15rem;
  font-size: calc(0.7rem * var(--m-fs, 1));
  color: var(--m-text-4, #94a3b8);
}

.mds-close {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 2.75rem;
  height: 2.75rem;
  margin: -0.375rem -0.375rem 0 0;
  border-radius: 999px;
  background: var(--m-surface-2, #f1f5f9);
  color: var(--m-text-3, #64748b);
}

.mds-close:active {
  background: var(--m-surface-3, #e2e8f0);
}

.mds-label {
  margin-bottom: 0.4rem;
  font-size: calc(0.75rem * var(--m-fs, 1));
  font-weight: 600;
  color: var(--m-text-3, #64748b);
}

.mds-date-box {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.6rem;
  padding: 0.35rem 0.5rem;
  border: 1px solid var(--m-border, #e2e8f0);
  border-radius: 0.85rem;
  background: var(--m-bg, #f8fafc);
}

.mds-date {
  flex: 1;
  min-width: 0;
  height: 2.1rem;
  border: 0;
  background: transparent;
  font-size: calc(0.8125rem * var(--m-fs, 1));
  color: var(--m-text, #1e293b);
}

.mds-date::-webkit-calendar-picker-indicator {
  opacity: 0.55;
  cursor: pointer;
}

.mds-tilde {
  flex-shrink: 0;
  color: var(--m-text-4, #94a3b8);
  font-weight: 600;
}

.mds-chips {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.35rem;
  margin-bottom: 1rem;
  padding: 0.25rem;
  border-radius: 0.85rem;
  background: var(--m-surface-2, #f1f5f9);
}

.mds-chip {
  height: 2.75rem;
  border-radius: 0.65rem;
  font-size: calc(0.8125rem * var(--m-fs, 1));
  font-weight: 600;
  color: var(--m-text-3, #64748b);
}

.mds-chip:active {
  background: var(--m-surface-3, #e2e8f0);
}

.mds-chip.is-on {
  background: var(--m-surface, #fff);
  color: #5782ff;
  box-shadow: 0 1px 4px rgba(15, 23, 42, 0.08);
}

.mds-select-wrap {
  position: relative;
  margin-bottom: 1rem;
}

.mds-select-ico {
  position: absolute;
  top: 50%;
  left: 0.85rem;
  width: 0.85rem;
  color: var(--m-text-4, #94a3b8);
  transform: translateY(-50%);
  pointer-events: none;
}

.mds-select {
  width: 100%;
  height: 2.75rem;
  padding: 0 2.2rem 0 2.2rem;
  border: 1px solid var(--m-border, #e2e8f0);
  border-radius: 0.85rem;
  background: var(--m-surface, #fff);
  font-size: calc(0.875rem * var(--m-fs, 1));
  color: var(--m-text, #1e293b);
  appearance: none;
}

.mds-select-chevron {
  position: absolute;
  top: 50%;
  right: 0.85rem;
  width: 0.7rem;
  color: var(--m-text-4, #94a3b8);
  transform: translateY(-50%);
  pointer-events: none;
}

/* 매장 검색 + 목록 */
.mds-store-search {
  position: relative;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  height: 2.75rem;
  margin-bottom: 0.5rem;
}

.mds-store-search-ico {
  position: absolute;
  left: 0.85rem;
  color: var(--m-text-4, #94a3b8);
  pointer-events: none;
}

.mds-store-search-input {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 0 2.6rem 0 2.4rem;
  border: 1px solid var(--m-border, #e2e8f0);
  border-radius: 0.85rem;
  background: var(--m-surface, #fff);
  /* 16px 미만이면 iPhone 에서 입력창을 누를 때 화면이 확대된다 */
  font-size: calc(1rem * var(--m-fs, 1));
  color: var(--m-text, #1e293b);
  outline: none;
}

.mds-store-search-input:focus {
  border-color: #5782ff;
  box-shadow: 0 0 0 3px rgb(87 130 255 / 0.15);
}

.mds-store-search-clear {
  position: absolute;
  right: 0.45rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
  background: var(--m-surface-2, #f1f5f9);
  color: var(--m-text-3, #64748b);
}

/* 보이는 크기는 그대로, 누르는 영역만 44px 로 */
.mds-store-search-clear::after {
  content: "";
  position: absolute;
  inset: -0.375rem;
}

/* 높이 고정: 검색 결과 수가 바뀌어도 아래 [조회] 버튼 위치가 그대로
   (화면이 낮으면 12.5rem 에서 최소 6rem 까지 줄어든다) */
.mds-sheet > * {
  flex-shrink: 0;
}

.mds-sheet > .mds-store-list {
  flex: 0 1 12.5rem;
  min-height: 6rem;
}

.mds-store-list {
  height: 12.5rem;
  margin-bottom: 0.9rem;
  padding: 0.25rem;
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
  border: 1px solid var(--m-border, #e2e8f0);
  border-radius: 0.85rem;
  background: var(--m-surface, #fff);
}

.mds-store-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  width: 100%;
  min-height: 2.75rem;
  padding: 0 0.75rem;
  border-radius: 0.65rem;
  font-size: calc(0.9375rem * var(--m-fs, 1));
  color: var(--m-text, #1e293b);
  text-align: left;
  -webkit-tap-highlight-color: transparent;
}

.mds-store-item:active {
  background: var(--m-surface-2, #f1f5f9);
}

.mds-store-item.is-on {
  background: var(--m-accent-weak, #eef3ff);
  font-weight: 700;
  color: var(--m-accent-strong, #3b63e0);
}

.mds-store-check {
  flex-shrink: 0;
  color: #5782ff;
}

.mds-store-empty {
  padding: 1.5rem 0;
  font-size: calc(0.875rem * var(--m-fs, 1));
  color: var(--m-text-4, #94a3b8);
  text-align: center;
}

.mds-search {
  width: 100%;
  height: 2.75rem;
  border-radius: 0.85rem;
  background: #5782ff;
  color: #fff;
  font-size: calc(0.95rem * var(--m-fs, 1));
  font-weight: 700;
}

.mds-search:active {
  background: #3b63e0;
}

/* 매장을 고르기 전 (본사 + 「전체」 미지원 화면): 안내 문구가 읽히도록 글자를 진하게 */
.mds-search:disabled {
  background: var(--m-surface-3, #e2e8f0);
  color: var(--m-text-3, #64748b);
}
</style>
