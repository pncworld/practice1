/*--############################################################################
# Filename : MST01_033INS.vue                                                  
# Description : 마스터관리 > 메뉴 마스터 > 메뉴코드등록                        
# Date :2025-05-14                                                             
# Author : 권맑음                     
################################################################################*/
<template>
  <div class="mu-page" style="--mu-cols: 2fr 2fr auto" @click="resetScreen">
    <div class="mu-head" style="--mu-filter: 0.625rem">
      <div class="mu-toolbar">
        <!-- 매장 선택: 누르면 아래에서 검색 가능한 매장 목록 시트 (초성 가능). 매장이 1개면 고정 표시 -->
        <button
          type="button"
          class="mu-field tr-store-btn"
          aria-label="매장 선택"
          :disabled="StoreList.length <= 1"
          @click.stop="openStoreSheet">
          <span class="truncate">{{ selectedStoreName || "매장을 선택하세요" }}</span>
          <font-awesome-icon
            v-if="StoreList.length > 1"
            :icon="['fas', 'chevron-down']"
            class="tr-store-chev" />
        </button>
        <div class="mu-seg" role="group" aria-label="좌석 사용 구분">
          <button
            type="button"
            class="mu-seg-btn"
            :class="{ 'is-on': selectSeat == 0 }"
            @click="selectSeat = 0">
            전체
          </button>
          <button
            type="button"
            class="mu-seg-btn"
            :class="{ 'is-on': selectSeat == 2 }"
            @click="selectSeat = 2">
            사용
          </button>
          <button
            type="button"
            class="mu-seg-btn"
            :class="{ 'is-on': selectSeat == 1 }"
            @click="selectSeat = 1">
            미사용
          </button>
        </div>
      </div>
      <div class="mu-thead">
        <div>매장명</div>
        <div>좌석명</div>
        <div class="mu-center">상태</div>
      </div>
    </div>
    <div v-if="rowData.length == 0" class="mu-empty">
      {{
        loaded ? "조회된 좌석이 없습니다." : "좌석 정보를 불러오는 중입니다."
      }}
    </div>
    <div v-for="(i, idx) in rowData" :key="idx" class="mu-row">
      <div class="mu-wrap mu-sub">{{ i.STORE_NM }}</div>
      <div class="mu-wrap">
        <span class="font-bold text-blue-600">{{ i.TABLE_NM }}</span>
        <span class="mu-sub">&nbsp;{{ i.TABLE_CNT }}</span>
      </div>
      <div>
        <span class="mu-badge" :class="{ 'is-off': i.SEATIN_TY == '미사용' }">
          {{ i.SEATIN_TY }}
        </span>
      </div>
    </div>

    <!-- 매장 선택 시트 (높이 고정: 검색 결과 수가 바뀌어도 검색창이 움직이지 않음) -->
    <Teleport to="body">
      <div v-if="storeSheet" class="tr-dim" @click.self="storeSheet = false">
        <div class="tr-sheet" @click.stop>
          <div class="tr-sheet-grab"></div>
          <div class="tr-sheet-title">매장 선택</div>
          <div class="tr-search">
            <font-awesome-icon :icon="['fas', 'magnifying-glass']" class="tr-search-ico" />
            <input
              :value="storeWord"
              type="text"
              class="tr-search-input"
              placeholder="매장명 검색 (초성 가능)"
              enterkeyhint="search"
              @input="onStoreWord"
              @compositionupdate="onStoreWord"
              @compositionend="onStoreWord" />
            <button
              v-if="storeWord"
              type="button"
              class="tr-search-clear"
              aria-label="검색어 지우기"
              @click="storeWord = ''">
              <font-awesome-icon icon="xmark" />
            </button>
          </div>
          <div class="tr-list">
            <button
              v-for="i in filteredStoreList"
              :key="i.GROUP_CD + '-' + i.STORE_CD"
              type="button"
              class="tr-item"
              :class="{ 'is-on': isPicked(i) }"
              @click="pickStore(i)">
              <span class="truncate">{{ i.STORE_NM }}</span>
              <font-awesome-icon v-if="isPicked(i)" :icon="['fas', 'check']" class="tr-check" />
            </button>
            <div v-if="filteredStoreList.length === 0" class="tr-empty">검색된 매장이 없습니다.</div>
          </div>
          <button type="button" class="tr-close" @click="storeSheet = false">닫기</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { getAppStoreList, getMobileSeatInfo } from "@/api/mobile";
/*
 * 공통 표준  Function
 */

import { computed, onMounted, ref, watch } from "vue";
import { matchNameWithChoseong } from "@/utils/choseongFilter";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";
import "../mobileUi.css";

const store = useStore();
const changeState = ref(true);
const resetScreen = async (e) => {
  changeState.value = false;

  // changeState.value = !changeState.value;
  store.state.inActiveBackGround = false;
};

const selectStartDate = ref("");
const selectEndDate = ref("");
const selectGroupCd = ref(store.state.userData.GROUP_CD);
const selectStoreCd = ref("");
const selectSeat = ref(0);

const StoreList = ref([]);
/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const res = await getAppStoreList(
    store.state.userData.GROUP_CD,
    store.state.userData.STORE_CD,
    store.state.userData.USER_NO
  );

  //comsole.log(res);

  StoreList.value = res?.data?.List || [];

  /*
   * 본사 계정(목록에 「전체」 행이 있고 매장이 2개 이상): 첫 선택 = 「전체」
   * (usp_AppTableUseInfo 가 매장코드 0 = 전체 매장을 처리함). 그 외는 기존처럼 로그인 매장
   */
  const allRow = StoreList.value.find((i) => isAllStoreRow(i));
  const concreteCnt = StoreList.value.filter((i) => !isAllStoreRow(i)).length;
  /* 이 화면은 조회 버튼이 따로 없으므로 본사도 들어오자마자 「전체」로 조회한다 (값이 정해지면 아래 watch 가 조회) */
  selectStoreCd.value =
    allRow && concreteCnt > 1
      ? { STORE_CD: allRow.STORE_CD, GROUP_CD: allRow.GROUP_CD }
      : {
          STORE_CD: store.state.userData.STORE_CD,
          GROUP_CD: store.state.userData.GROUP_CD,
        };
});

/* ───── 매장 선택 시트 (초성 검색) ───── */
const isAllStoreRow = (item) => {
  const name = String(item?.STORE_NM ?? "").replace(/\s/g, "");
  const code = String(item?.STORE_CD ?? "").trim();
  return name === "전체" || (code !== "" && Number(code) === 0);
};
const storeSheet = ref(false);
const storeWord = ref("");
const onStoreWord = (e) => {
  storeWord.value = e?.target?.value ?? "";
};
const filteredStoreList = computed(() => {
  const w = storeWord.value.trim();
  return w
    ? StoreList.value.filter((i) => matchNameWithChoseong(String(i.STORE_NM ?? ""), w))
    : StoreList.value;
});
const isPicked = (i) =>
  Boolean(selectStoreCd.value) &&
  String(selectStoreCd.value.STORE_CD) === String(i.STORE_CD) &&
  String(selectStoreCd.value.GROUP_CD) === String(i.GROUP_CD);
const selectedStoreName = computed(() => {
  const hit = StoreList.value.find((i) => isPicked(i));
  return hit ? hit.STORE_NM : "";
});
const openStoreSheet = () => {
  if (StoreList.value.length <= 1) return;
  storeWord.value = "";
  storeSheet.value = true;
};
/* 고르면 selectStoreCd 가 바뀌고 기존 watch 가 그대로 조회한다 */
const pickStore = (i) => {
  storeSheet.value = false;
  if (isPicked(i)) return;
  selectStoreCd.value = { STORE_CD: i.STORE_CD, GROUP_CD: i.GROUP_CD };
};

const rowData = ref([]);
const loaded = ref(false);

watch(
  () => store.state.mobileReSearch,
  async () => {
    try {
      store.state.loading2 = true;
      const res = await getMobileSeatInfo(
        selectGroupCd.value,
        selectStoreCd.value.STORE_CD,
        store.state.userData.USER_NO,
        selectSeat.value
      );

      rowData.value = res.data.List.map((item) => ({
        ...item,
        SEAT_CNT: item.SEAT_CNT.toLocaleString(),
      }));
    } catch (error) {
    } finally {
      store.state.loading2 = false;
      loaded.value = true;
    }
  }
);
watch([selectStoreCd, selectSeat], async () => {
  try {
    store.state.loading2 = true;
    const res = await getMobileSeatInfo(
      selectGroupCd.value,
      selectStoreCd.value.STORE_CD,
      store.state.userData.USER_NO,
      selectSeat.value
    );

    rowData.value = res.data.List.map((item) => ({
      ...item,
      SEAT_CNT: item.SEAT_CNT.toLocaleString(),
    }));
  } catch (error) {
  } finally {
    store.state.loading2 = false;
    loaded.value = true;
  }

  //comsole.log(rowData.value);
});

/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(() => {});
</script>

<style scoped>
/* 매장 선택 버튼 (select 와 같은 모양) — 일반 CSS (이 프로젝트에는 sass-loader 가 없다) */
.tr-store-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  text-align: left;
}

.tr-store-btn:disabled {
  opacity: 1;
}

.tr-store-chev {
  flex-shrink: 0;
  color: var(--m-text-4, #94a3b8);
  font-size: calc(0.75rem * var(--m-fs, 1));
}

/* 아래에서 올라오는 매장 시트 */
.tr-dim {
  position: fixed;
  inset: 0;
  z-index: 10050;
  display: flex;
  align-items: flex-end;
  background: rgb(15 23 42 / 0.45);
  overscroll-behavior: contain;
}

.tr-sheet {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 70vh;
  height: 70dvh;
  padding: 0.5rem 1rem calc(1rem + env(safe-area-inset-bottom));
  border-radius: 1.25rem 1.25rem 0 0;
  background: var(--m-surface, #fff);
  box-shadow: 0 -12px 32px rgba(15, 23, 42, 0.2);
}

.tr-sheet > :not(.tr-list) {
  flex-shrink: 0;
}

.tr-sheet-grab {
  width: 2.5rem;
  height: 0.3rem;
  margin: 0 auto 0.75rem;
  border-radius: 999px;
  background: var(--m-border-strong, #cbd5e1);
}

.tr-sheet-title {
  font-size: calc(1.0625rem * var(--m-fs, 1));
  font-weight: 700;
  color: var(--m-text, #0f172a);
}

.tr-search {
  position: relative;
  display: flex;
  align-items: center;
  height: 2.75rem;
  margin: 0.625rem 0;
}

.tr-search-ico {
  position: absolute;
  left: 0.875rem;
  color: var(--m-text-4, #94a3b8);
  pointer-events: none;
}

.tr-search-input {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 0 2.75rem 0 2.5rem;
  border: 1px solid var(--m-border-strong, #cbd5e1);
  border-radius: 0.75rem;
  font-size: calc(1rem * var(--m-fs, 1));
  outline: none;
}

.tr-search-input:focus {
  border-color: #2563eb;
}

.tr-search-clear {
  position: absolute;
  right: 0.375rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 999px;
  background: var(--m-surface-2, #f1f5f9);
  color: var(--m-text-3, #64748b);
}

.tr-list {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
}

.tr-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  width: 100%;
  min-height: 3rem;
  padding: 0 0.5rem;
  border-bottom: 1px solid var(--m-border, #f1f5f9);
  font-size: calc(1rem * var(--m-fs, 1));
  color: var(--m-text, #1e293b);
  text-align: left;
  -webkit-tap-highlight-color: transparent;
}

.tr-item:active {
  background: var(--m-bg, #f8fafc);
}

.tr-item.is-on {
  font-weight: 700;
  color: var(--m-accent, #2563eb);
}

.tr-check {
  flex-shrink: 0;
  color: var(--m-accent, #2563eb);
}

.tr-empty {
  padding: 1.5rem 0;
  font-size: calc(0.875rem * var(--m-fs, 1));
  color: var(--m-text-4, #94a3b8);
  text-align: center;
}

.tr-close {
  height: 3rem;
  margin-top: 0.75rem;
  border-radius: 0.875rem;
  background: var(--m-surface-2, #f1f5f9);
  font-size: calc(1rem * var(--m-fs, 1));
  font-weight: 600;
  color: var(--m-text-2, #334155);
}
</style>
