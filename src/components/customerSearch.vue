<template>
  <div
    class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-2 sm:p-3">
    <div
      class="flex h-[min(70dvh,576px)] max-h-[min(calc(100dvh-16px),608px)] w-[80%] max-w-4xl min-h-0 flex-col overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-slate-900/10 sm:rounded-2xl"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cs-pop-title">
      <div
        class="shrink-0 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100/80 px-3 py-2 sm:px-4 sm:py-2.5">
        <h2
          id="cs-pop-title"
          class="text-base font-bold leading-tight tracking-tight text-slate-900 sm:text-lg">
          고객 카드번호 확인
        </h2>
        <p class="mt-0.5 text-xs leading-snug text-slate-600 sm:text-sm">
          조회 후 목록에서 행을 더블클릭하면 선택됩니다.
        </p>
      </div>

      <div class="shrink-0 px-2.5 py-2 sm:px-3 sm:py-2.5">
        <div
          class="cs-pop-search-panel rounded-lg bg-gray-200 px-2.5 py-2.5 sm:px-3 sm:py-3"
          :style="{
            '--cs-pop-label-col': csPopLabelCol,
            '--cs-pop-border': csPopBorder,
          }">
          <div class="cs-pop-wire-row">
            <div class="cs-pop-wire-label">검색</div>
            <div class="cs-pop-wire-field min-w-0 cs-pop-field-actions">
              <select
                id="cs-pop-type"
                v-model="cond"
                class="cs-pop-select h-8 min-h-8 w-[7.75rem] shrink-0 rounded-md border border-solid bg-white px-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="0">카드번호</option>
                <option value="1">고객명</option>
                <option value="2">휴대폰</option>
              </select>
              <input
                id="cs-pop-keyword"
                v-model="cond2"
                type="text"
                class="cs-pop-input h-8 min-h-8 min-w-0 flex-1 rounded-md border border-solid bg-white px-2 text-sm text-gray-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                :placeholder="keywordPlaceholder"
                autocomplete="off"
                @keydown.enter="searchButton" />
              <button
                type="button"
                class="cs-pop-btn-primary shrink-0"
                @click="searchButton">
                조회
              </button>
              <button
                type="button"
                class="cs-pop-btn-secondary shrink-0"
                @click="emit('closePopUp', false)">
                닫기
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        class="cs-pop-grid-wrap flex min-h-0 flex-1 flex-col overflow-hidden px-2.5 pb-2.5 sm:px-3 sm:pb-3">
        <div class="relative min-h-0 flex-1 w-full">
          <Realgrid
            :progname="'CRM01_008INS_VUE'"
            :progid="2"
            :rowData="rowData2"
            :rowStateeditable="false"
            @dblclickedRowData="dblclickedRowData"></Realgrid>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getCardChangeInfo } from "@/api/micrm";
import store from "@/store";
import { ref, computed } from "vue";
import Realgrid from "./realgrid.vue";

const props = defineProps({
  openPopUp: {
    type: Boolean,
    default: false,
  },
  joinSts: {
    type: String,
    default: "1",
  },
});

const emit = defineEmits([
  "strCCardID",
  "strCustName",
  "strMobile",
  "strHomeAddr1",
  "lngVisitCnt",
  "lngActAmt",
  "lngSalePoint",
  "lngBonusPoint",
  "lngUsedPoint",
  "lngRemPoint",
  "lngStoreCode",
  "lngCustNo",
  "closePopUp",
]);

/** 검색 줄 라벨 폭·테두리 (고객정보 조회 패널과 동일 톤) */
const csPopLabelCol = "4.5rem";
const csPopBorder = "#cbd5e1";

const cond2 = ref("");
const rowData2 = ref([]);
const cond = ref(0);
const afterSearch = ref(false);

/** 휴대폰(값 2)일 때만 전화 형식 힌트 */
const keywordPlaceholder = computed(() =>
  cond.value == 2 ? "000-0000-0000" : "검색어 입력"
);

const searchButton = async () => {
  try {
    store.state.loading = true;
    initGrid();
    const kw = String(cond2.value ?? "").trim();
    const group = store.state.userData.lngStoreGroup;
    const join = props.joinSts != null ? String(props.joinSts).trim() : "1";
    let res;
    /** 카드/고객명도 휴대폰과 동일하게 JOIN_STS·MOBILE 키를 항상 채워 ASMX 6인자 바인딩 유지 */
    if (cond.value == 0) {
      res = await getCardChangeInfo(group, "", kw, "", join, "");
    } else if (cond.value == 1) {
      res = await getCardChangeInfo(group, "", "", kw, join, "");
    } else {
      res = await getCardChangeInfo(group, "", "", "", join, kw);
    }

    rowData2.value = res.data.List;
    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
  } finally {
    store.state.loading = false;
  }
};

const initGrid = () => {};

/**
 * 더블클릭 행이 순수 배열이거나, RealGrid에서 병합된 `{ 0:…, strCustName:… }` 형태일 수 있다.
 * API 필드명이 있으면 우선하고(빈 문자열 포함), 없을 때만 레거시 컬럼 인덱스로 폴백한다.
 */
function gridRowField(row, fieldNames, indexFallback) {
  if (row == null) return undefined;
  if (Array.isArray(row)) return row[indexFallback];
  for (const name of fieldNames) {
    if (Object.prototype.hasOwnProperty.call(row, name)) {
      return row[name];
    }
  }
  return row[indexFallback];
}

const dblclickedRowData = async (e) => {
  emit("strCCardID", gridRowField(e, ["strCCardID"], 0));
  emit("strCustName", gridRowField(e, ["strCustName", "strCustNm"], 1));
  emit("strMobile", gridRowField(e, ["strMobile", "strHpNo", "strTelNo"], 2));
  emit("strHomeAddr1", gridRowField(e, ["strHomeAddr1", "strAddr", "strHomeAddr"], 3));
  emit("lngVisitCnt", gridRowField(e, ["lngVisitCnt"], 4));
  emit("lngActAmt", gridRowField(e, ["lngActAmt"], 5));
  emit("lngSalePoint", gridRowField(e, ["lngSalePoint"], 6));
  emit("lngBonusPoint", gridRowField(e, ["lngBonusPoint"], 7));
  emit("lngUsedPoint", gridRowField(e, ["lngUsedPoint"], 8));
  emit("lngRemPoint", gridRowField(e, ["lngRemPoint"], 9));
  emit("lngStoreCode", gridRowField(e, ["lngStoreCode"], 11));
  emit("lngCustNo", gridRowField(e, ["lngCustNo"], 12));
  emit("closePopUp", false);
};
</script>

<style scoped>
.cs-pop-wire-row {
  display: flex;
  min-width: 0;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}

.cs-pop-wire-label {
  flex: 0 0 var(--cs-pop-label-col);
  width: var(--cs-pop-label-col);
  min-width: 0;
  max-width: var(--cs-pop-label-col);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
  text-align: center;
  white-space: nowrap;
}

.cs-pop-wire-field {
  display: flex;
  min-width: 0;
  flex: 1 1 auto;
  align-items: center;
}

.cs-pop-field-actions {
  flex-wrap: wrap;
  gap: 0.5rem;
}

.cs-pop-search-panel .cs-pop-select {
  border: 1px solid var(--cs-pop-border) !important;
  box-sizing: border-box;
}

.cs-pop-search-panel .cs-pop-select:focus {
  border-color: #3b82f6 !important;
}

.cs-pop-search-panel .cs-pop-input {
  border: 1px solid var(--cs-pop-border) !important;
  box-sizing: border-box;
}

.cs-pop-search-panel .cs-pop-input:focus {
  border-color: #3b82f6 !important;
}

.cs-pop-btn-primary {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  background-color: #2563eb;
  padding: 0.375rem 0.875rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #fff;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  transition: background-color 0.15s ease;
}

.cs-pop-btn-primary:hover {
  background-color: #1d4ed8;
}

.cs-pop-btn-secondary {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  border: 1px solid rgb(203 213 225);
  background-color: #fff;
  padding: 0.375rem 0.875rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: rgb(55 65 81);
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  transition: background-color 0.15s ease;
}

.cs-pop-btn-secondary:hover {
  background-color: rgb(248 250 252);
}

.cs-pop-grid-wrap {
  display: flex;
  flex-direction: column;
  flex: 1 1 0%;
  min-height: 0;
}

.cs-pop-grid-wrap > .relative {
  flex: 1 1 0%;
  min-height: 0;
}
</style>
