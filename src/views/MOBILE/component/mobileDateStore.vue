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
      <div class="mds-select-wrap">
        <font-awesome-icon :icon="['fas', 'store']" class="mds-select-ico" />
        <select class="mds-select" v-model="selectedStoreCd2">
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

      <button type="button" class="mds-search" @click="sendSearch">조회</button>
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

import { onMounted, ref, watch } from "vue";

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
});

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
const showStoreAndDate = () => {
  if (show.value) {
    closePanel();
    return;
  }
  show.value = true;
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

  const pickedRow =
    (lockedToOneStore ? mine : null) ||
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
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  background: #fff;
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
  font-size: 0.8125rem;
  font-weight: 700;
  color: #1e293b;
  white-space: nowrap;
}

.mds-summary-store {
  margin-top: 0.1rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #64748b;
}

.mds-ico {
  width: 0.85rem;
  color: #5782ff;
}

.mds-summary-store .mds-ico {
  color: #94a3b8;
}

.mds-filter-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.75rem;
  background: #eff4ff;
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
  padding: 1rem;
  border-radius: 1.25rem;
  background: #fff;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.18);
}

.mds-sheet-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 0.9rem;
}

.mds-sheet-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #0f172a;
}

.mds-sheet-sub {
  margin-top: 0.15rem;
  font-size: 0.7rem;
  color: #94a3b8;
}

.mds-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
  background: #f1f5f9;
  color: #64748b;
}

.mds-label {
  margin-bottom: 0.4rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
}

.mds-date-box {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.6rem;
  padding: 0.35rem 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.85rem;
  background: #f8fafc;
}

.mds-date {
  flex: 1;
  min-width: 0;
  height: 2.1rem;
  border: 0;
  background: transparent;
  font-size: 0.8125rem;
  color: #1e293b;
}

.mds-date::-webkit-calendar-picker-indicator {
  opacity: 0.55;
  cursor: pointer;
}

.mds-tilde {
  flex-shrink: 0;
  color: #94a3b8;
  font-weight: 600;
}

.mds-chips {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.35rem;
  margin-bottom: 1rem;
  padding: 0.25rem;
  border-radius: 0.85rem;
  background: #f1f5f9;
}

.mds-chip {
  height: 2rem;
  border-radius: 0.65rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
}

.mds-chip.is-on {
  background: #fff;
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
  color: #94a3b8;
  transform: translateY(-50%);
  pointer-events: none;
}

.mds-select {
  width: 100%;
  height: 2.75rem;
  padding: 0 2.2rem 0 2.2rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.85rem;
  background: #fff;
  font-size: 0.875rem;
  color: #1e293b;
  appearance: none;
}

.mds-select-chevron {
  position: absolute;
  top: 50%;
  right: 0.85rem;
  width: 0.7rem;
  color: #94a3b8;
  transform: translateY(-50%);
  pointer-events: none;
}

.mds-search {
  width: 100%;
  height: 2.75rem;
  border-radius: 0.85rem;
  background: #5782ff;
  color: #fff;
  font-size: 0.95rem;
  font-weight: 700;
}
</style>
