<template>
  <Teleport to="body">
    <div
      v-if="showPopUp"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-2 sm:p-3"
      @click.self="closeButton">
      <div
        class="flex h-[min(70dvh,576px)] max-h-[min(calc(100dvh-16px),608px)] w-[80%] max-w-4xl min-h-0 flex-col overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-slate-900/10 sm:rounded-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="emp-pop-title"
        @click.stop>
        <div
          class="shrink-0 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100/80 px-3 py-2 sm:px-4 sm:py-2.5">
          <h2
            id="emp-pop-title"
            class="text-base font-bold leading-tight tracking-tight text-slate-900 sm:text-lg">
            사원 조회
          </h2>
          <p class="mt-0.5 text-xs leading-snug text-slate-600 sm:text-sm">
            조회 후 목록에서 행을 더블클릭하면 선택됩니다.
          </p>
        </div>

        <div class="shrink-0 px-2.5 py-2 sm:px-3 sm:py-2.5">
          <div
            class="emp-pop-search-panel rounded-lg bg-gray-200 px-2.5 py-2.5 sm:px-3 sm:py-3"
            :style="{
              '--emp-pop-label-col': empPopLabelCol,
              '--emp-pop-border': empPopBorder,
            }">
            <div class="emp-pop-wire-row">
              <template v-if="showAffiliateCombo">
                <div class="emp-pop-wire-label emp-pop-wire-label--aff">소속사</div>
                <select
                  id="emp-pop-aff-comp"
                  v-model="popAffiliateCompCode"
                  :disabled="
                    isPopupAffiliateLocked ||
                    affiliateCompList.length === 0 ||
                    affiliateCompLoading
                  "
                  class="emp-pop-select emp-pop-aff-select h-8 min-h-8 shrink-0 rounded-md border border-solid bg-white px-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100">
                  <option v-if="affiliateCompList.length === 0" disabled value="">
                    {{
                      affiliateCompLoading ? "불러오는 중..." : "소속사 없음"
                    }}
                  </option>
                  <option
                    v-for="item in affiliateCompList"
                    :key="item.value"
                    :value="item.value">
                    {{ item.label }}
                  </option>
                </select>
                <div
                  class="emp-pop-section-divider"
                  aria-hidden="true">
                  |
                </div>
              </template>
              <div class="emp-pop-wire-label">검색</div>
              <div class="emp-pop-wire-field min-w-0 emp-pop-field-actions">
                <select
                  id="emp-pop-type"
                  v-model="searchType"
                  class="emp-pop-select h-8 min-h-8 w-[7.75rem] shrink-0 rounded-md border border-solid bg-white px-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option :value="1">사원번호</option>
                  <option :value="2">사원명</option>
                  <option :value="3">부서명</option>
                  <option v-if="!showAffiliateCombo" :value="4">소속사명</option>
                </select>
                <input
                  id="emp-pop-keyword"
                  v-model="searchText"
                  type="text"
                  class="emp-pop-input emp-pop-keyword-input h-8 min-h-8 min-w-0 flex-1 rounded-md border border-solid bg-white px-2 text-sm text-gray-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="검색어 입력"
                  autocomplete="off"
                  @keydown.enter="searchButton" />
                <button
                  type="button"
                  class="emp-pop-btn-primary shrink-0"
                  @click="searchButton">
                  조회
                </button>
                <button
                  type="button"
                  class="emp-pop-btn-secondary shrink-0"
                  @click="closeButton">
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          class="emp-pop-grid-wrap flex min-h-0 flex-1 flex-col overflow-hidden px-2.5 pb-2.5 sm:px-3 sm:pb-3">
          <div class="relative min-h-0 w-full flex-1">
            <Realgrid
              :progname="'ACT09_001RPT_VUE'"
              :progid="1"
              :rowData="rowData"
              :setStateBar="false"
              :rowStateeditable="false"
              @dblclickedRowData="dblclickedRowData" />
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { getEmployeesData, getEmployeesData003 } from "@/api/account";
import { computed, ref, watch } from "vue";
import { useStore } from "vuex";
import Realgrid from "./realgrid.vue";

const emit = defineEmits(["custId", "custName", "updateOpen"]);
const rowData = ref([]);
const searchType = ref(1);
const searchText = ref("");
const store = useStore();
const groupCd = ref(store.state.userData.lngStoreGroup);

const empPopLabelCol = "4.5rem";
const empPopBorder = "#cbd5e1";

const popAffiliateCompCode = ref("");

const EMPLOYEES_DATA_003_PROGRAM_IDS = ["ACT09_003RPT", "ACT09_004RPT"];

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  /** ACT09_003RPT / ACT09_004RPT → ACT09_003RPT.asmx/getEmployeesData, 그 외 → 001 공유 */
  employeesProgramId: {
    type: String,
    default: "ACT09_001RPT",
  },
  affiliateCompList: {
    type: Array,
    default: () => [],
  },
  affiliateCompCode: {
    type: String,
    default: "",
  },
  affiliateCompLocked: {
    type: Boolean,
    default: false,
  },
  affiliateCompLoading: {
    type: Boolean,
    default: false,
  },
});

const showAffiliateCombo = computed(() =>
  EMPLOYEES_DATA_003_PROGRAM_IDS.includes(props.employeesProgramId)
);

/** 메인에서 특정 소속사 선택 시 팝업 콤보 고정 (전체=0 이면 변경 가능) */
const isPopupAffiliateLocked = computed(
  () =>
    props.affiliateCompLocked ||
    Boolean(props.affiliateCompCode && props.affiliateCompCode !== "0")
);

const showPopUp = ref(false);

const searchButton = async () => {
  try {
    const res = EMPLOYEES_DATA_003_PROGRAM_IDS.includes(
      props.employeesProgramId
    )
      ? await getEmployeesData003(
          groupCd.value,
          searchType.value,
          searchText.value,
          popAffiliateCompCode.value
        )
      : await getEmployeesData(
          groupCd.value,
          searchType.value,
          searchText.value
        );
    rowData.value = res.data.List;
  } catch (error) {}
};

const dblclickedRowData = (e) => {
  emit("custId", e[0]);
  emit("custName", e[1]);
  emit("updateOpen", false);
  showPopUp.value = false;
};

const closeButton = () => {
  emit("updateOpen", false);
  showPopUp.value = false;
};

watch(
  () => props.open,
  () => {
    if (props.open == false) {
      showPopUp.value = false;
    } else {
      searchType.value = 1;
      searchText.value = "";
      popAffiliateCompCode.value = props.affiliateCompCode ?? "";
      if (rowData.value.length > 0) {
        rowData.value = [];
      }
      showPopUp.value = true;
    }
  }
);

watch(
  () => props.affiliateCompCode,
  (code) => {
    if (!showPopUp.value || !isPopupAffiliateLocked.value) return;
    popAffiliateCompCode.value = code ?? "";
  }
);
</script>

<style scoped>
.emp-pop-wire-row {
  display: flex;
  min-width: 0;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}

.emp-pop-wire-label {
  flex: 0 0 var(--emp-pop-label-col);
  width: var(--emp-pop-label-col);
  min-width: 0;
  max-width: var(--emp-pop-label-col);
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

.emp-pop-wire-label--aff {
  flex: 0 0 3.25rem;
  width: 3.25rem;
  max-width: 3.25rem;
}

.emp-pop-aff-select {
  box-sizing: border-box;
  width: 10.25rem;
  min-width: 9rem;
  max-width: 11rem;
}

.emp-pop-section-divider {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  margin: 0 0.625rem;
  padding: 0 0.125rem;
  font-size: 1.125rem;
  font-weight: 300;
  line-height: 1;
  color: rgb(148 163 184);
  user-select: none;
}

.emp-pop-keyword-input {
  box-sizing: border-box;
  flex: 1 1 0;
  min-width: 0;
  width: 100%;
  max-width: none;
}

.emp-pop-wire-field {
  display: flex;
  min-width: 0;
  flex: 1 1 0;
  align-items: center;
}

.emp-pop-field-actions {
  flex: 1 1 0;
  flex-wrap: nowrap;
  gap: 0.5rem;
  min-width: 0;
  width: 100%;
}

.emp-pop-search-panel .emp-pop-select {
  border: 1px solid var(--emp-pop-border) !important;
  box-sizing: border-box;
}

.emp-pop-search-panel .emp-pop-select:focus {
  border-color: #3b82f6 !important;
}

.emp-pop-search-panel .emp-pop-input {
  border: 1px solid var(--emp-pop-border) !important;
  box-sizing: border-box;
}

.emp-pop-search-panel .emp-pop-input:focus {
  border-color: #3b82f6 !important;
}

.emp-pop-btn-primary {
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

.emp-pop-btn-primary:hover {
  background-color: #1d4ed8;
}

.emp-pop-btn-secondary {
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

.emp-pop-btn-secondary:hover {
  background-color: rgb(248 250 252);
}

.emp-pop-grid-wrap {
  display: flex;
  flex-direction: column;
  flex: 1 1 0%;
  min-height: 0;
}

.emp-pop-grid-wrap > .relative {
  flex: 1 1 0%;
  min-height: 0;
}
</style>
