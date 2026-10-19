<template>
  <div
    :class="
      props.filterBarAlign
        ? 'pbc-bar flex min-w-0 flex-wrap items-center gap-2'
        : 'flex h-10 w-32 space-x-5 mt-2'
    ">
    <div
      v-if="!props.omitLabel"
      class="text-base text-nowrap font-semibold">
      {{ mainName }}
    </div>
    <input
      type="text"
      disabled
      :class="
        props.filterBarAlign
          ? 'pbc-bar__code disabled:bg-gray-100'
          : 'disabled: bg-gray-100'
      "
      v-model="lngCode" />
    <input
      type="text"
      disabled
      :class="
        props.filterBarAlign
          ? 'pbc-bar__name disabled:bg-white'
          : 'disabled:bg-white'
      "
      v-model="strName" />
    <button
      type="button"
      :class="props.filterBarAlign ? 'pbc-bar__btn whitebutton bg-white' : 'whitebutton bg-white'"
      @click="showPopUp">
      조회
    </button>
    <button
      type="button"
      :class="props.filterBarAlign ? 'pbc-bar__btn whitebutton bg-white' : 'whitebutton bg-white'"
      @click="reset">
      초기화
    </button>
  </div>

  <Teleport to="body">
    <div
      v-if="showing"
      class="fixed inset-0 z-[10050] flex items-center justify-center bg-black/50 p-2 sm:p-3"
      @click.self="closePopUp">
      <div
        class="flex h-[min(70dvh,576px)] max-h-[min(calc(100dvh-16px),608px)] w-[80%] max-w-4xl min-h-0 flex-col overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-slate-900/10 sm:rounded-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pbc-pop-title"
        @click.stop>
        <div
          class="shrink-0 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100/80 px-3 py-2 sm:px-4 sm:py-2.5">
          <h2
            id="pbc-pop-title"
            class="text-base font-bold leading-tight tracking-tight text-slate-900 sm:text-lg">
            거래처 조회
          </h2>
          <p class="mt-0.5 text-xs leading-snug text-slate-600 sm:text-sm">
            조회 후 목록에서 행을 더블클릭하면 선택됩니다.
          </p>
        </div>

        <div class="shrink-0 px-2.5 py-2 sm:px-3 sm:py-2.5">
          <div
            class="pbc-pop-search-panel rounded-lg bg-gray-200 px-2.5 py-2.5 sm:px-3 sm:py-3"
            :style="{
              '--pbc-pop-label-col': pbcPopLabelCol,
              '--pbc-pop-border': pbcPopBorder,
            }">
            <div class="pbc-pop-wire-row">
              <div class="pbc-pop-wire-label">거래처명</div>
              <div class="pbc-pop-wire-field min-w-0 pbc-pop-field-actions">
                <input
                  id="pbc-pop-keyword"
                  v-model="searchword"
                  type="text"
                  class="pbc-pop-input h-8 min-h-8 min-w-0 flex-1 rounded-md border border-solid bg-white px-2 text-sm text-gray-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="거래처명 입력"
                  autocomplete="off"
                  @keydown.enter="searchButton" />
                <button type="button" class="pnc-sub-btn shrink-0" @click="searchButton">
                  <svg
                    class="pnc-sub-btn__icon"
                    viewBox="0 0 16 16"
                    aria-hidden="true">
                    <circle
                      cx="7"
                      cy="7"
                      r="4.2"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.6" />
                    <path
                      d="M10.2 10.2 13.2 13.2"
                      stroke="currentColor"
                      stroke-width="1.6"
                      stroke-linecap="round" />
                  </svg>
                  조회
                </button>
                <button
                  type="button"
                  class="pnc-sub-btn pnc-sub-btn--gray shrink-0"
                  @click="closePopUp">
                  <svg
                    class="pnc-sub-btn__icon"
                    viewBox="0 0 16 16"
                    aria-hidden="true">
                    <path
                      d="M4 4l8 8M12 4 4 12"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.6"
                      stroke-linecap="round" />
                  </svg>
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          class="pbc-pop-grid-wrap flex min-h-0 flex-1 flex-col overflow-hidden px-2.5 pb-2.5 sm:px-3 sm:pb-3">
          <div class="relative min-h-0 w-full flex-1">
            <Realgrid
              :progname="'CRM20_005RPT_VUE'"
              :progid="2"
              :rowData="rowData"
              :row-stateeditable="false"
              @dblclickedRowData="dblclickedRowData"
              :setStateBar="false"></Realgrid>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import Swal from "sweetalert2";
import Realgrid from "./realgrid.vue";
import store from "@/store";
import { getBelongCust } from "@/api/micrm";

const pbcPopLabelCol = "5rem";
const pbcPopBorder = "#cbd5e1";

const lngCode = ref("");
const strName = ref("");
const searchword = ref("");
const showing = ref(false);
const mainName = ref("");

const props = defineProps({
  lngStoreCode: {
    type: [String, Number],
    default: "",
  },
  mainName: {
    type: String,
    default: "거래처",
  },
  type: {
    type: String,
    default: "1",
  },
  /** 조회 패널 라벨을 화면에서 직접 표시할 때 true */
  omitLabel: {
    type: Boolean,
    default: false,
  },
  /** 조회 AREA용 — 높이·가로 정렬 (기본 레이아웃 유지) */
  filterBarAlign: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["strSaleCustID", "strSaleCustName", "excelList"]);
const rowData = ref([]);
const currlngStoreCode = ref("");
const TYPE = ref("");

/** 사업장 콤보 선택값 — 0/빈값이면 미선택 */
const isStoreSelected = () => {
  const v = props.lngStoreCode;
  if (v === null || v === undefined || v === "") return false;
  if (v === 0 || v === "0") return false;
  return true;
};

const showPopUp = async () => {
  if (showing.value) {
    showing.value = false;
    return;
  }
  if (!isStoreSelected()) {
    Swal.fire({
      title: "경고",
      text: "사업장을 먼저 선택하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  showing.value = true;
  await searchButton();
};

onMounted(() => {
  currlngStoreCode.value = store.state.lngPosition;

  mainName.value = props.mainName;
  emit("excelList", mainName.value + ":   ");
  TYPE.value = props.type;
});
watch(
  () => props.lngStoreCode,
  async () => {
    currlngStoreCode.value = props.lngStoreCode;
    const res = await getBelongCust(
      currlngStoreCode.value,
      searchword.value,
      TYPE.value
    );

    strName.value = "";
    lngCode.value = "";
    emit("strSaleCustID", lngCode.value);
    emit("strSaleCustName", strName.value);
    rowData.value = res.data.List;
  }
);

const searchButton = async () => {
  const res = await getBelongCust(
    currlngStoreCode.value,
    searchword.value,
    TYPE.value
  );

  rowData.value = res.data.List;
};
const closePopUp = async () => {
  searchword.value = "";

  const res = await getBelongCust(
    currlngStoreCode.value,
    searchword.value,
    TYPE.value
  );
  rowData.value = res.data.List;

  showing.value = false;
};

const getRowValue = (row, keys, fallbackIndex) => {
  if (!row) return "";
  if (Array.isArray(row)) {
    return row[fallbackIndex] ?? "";
  }
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== null) {
      return row[key];
    }
  }
  return "";
};

const dblclickedRowData = (e) => {
  lngCode.value = getRowValue(
    e,
    ["strSaleCustID", "lngSaleCustID", "strCustID", "lngCode"],
    0
  );
  strName.value = getRowValue(
    e,
    ["strSaleCustName", "strCustName", "strName"],
    1
  );
  emit("strSaleCustID", lngCode.value);
  emit("strSaleCustName", strName.value);
  emit("excelList", mainName.value + ": " + strName.value);
  closePopUp();
};

const reset = () => {
  strName.value = "";
  lngCode.value = "";
  searchword.value = "";
  emit("strSaleCustID", "");
  emit("strSaleCustName", "");
  emit("excelList", mainName.value + ": ");
};
</script>

<style scoped>
.pbc-bar__code {
  box-sizing: border-box;
  width: 5.5rem;
  min-width: 4.5rem;
  height: 2rem;
  min-height: 2rem;
  padding: 0 0.4rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.pbc-bar__name {
  box-sizing: border-box;
  width: 9rem;
  min-width: 6rem;
  max-width: 11rem;
  flex: 0 1 9rem;
  height: 2rem;
  min-height: 2rem;
  padding: 0 0.4rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.pbc-bar__btn {
  box-sizing: border-box;
  height: 2rem !important;
  min-height: 2rem !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  line-height: 1;
}

.pbc-pop-wire-row {
  display: flex;
  min-width: 0;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}

.pbc-pop-wire-label {
  flex: 0 0 var(--pbc-pop-label-col);
  width: var(--pbc-pop-label-col);
  min-width: 0;
  max-width: var(--pbc-pop-label-col);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: 0.9375rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
  white-space: nowrap;
}

.pbc-pop-wire-field {
  display: flex;
  min-width: 0;
  flex: 1 1 auto;
  align-items: center;
}

.pbc-pop-field-actions {
  flex-wrap: wrap;
  gap: 0.5rem;
}

.pbc-pop-search-panel .pbc-pop-input {
  border: 1px solid var(--pbc-pop-border) !important;
  box-sizing: border-box;
}

.pbc-pop-search-panel .pbc-pop-input:focus {
  border-color: #3b82f6 !important;
}

.pbc-pop-grid-wrap {
  display: flex;
  flex-direction: column;
  flex: 1 1 0%;
  min-height: 0;
}

.pbc-pop-grid-wrap > .relative {
  flex: 1 1 0%;
  min-height: 0;
}
</style>
