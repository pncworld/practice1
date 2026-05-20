<template>
  <div class="flex w-32 items-center">
    <div class="text-base text-nowrap font-semibold">{{ mainName }}</div>
    <div>
      <input
        type="text"
        disabled
        class="disabled: bg-gray-100 ml-5"
        v-model="lngCode" />
    </div>
    <div>
      <input
        type="text"
        v-model="strName"
        disabled
        class="disabled:bg-white ml-5" />
    </div>
    <div>
      <button type="button" class="whitebutton bg-white ml-5" @click="showPopUp">조회</button>
    </div>
    <div>
      <button type="button" class="whitebutton bg-white" @click="reset">초기화</button>
    </div>
  </div>

  <Teleport to="body">
    <div
      v-if="showing"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-2 sm:p-3"
      @click.self="closePopUp">
      <div
        class="flex h-[min(70dvh,576px)] max-h-[min(calc(100dvh-16px),608px)] w-[80%] max-w-4xl min-h-0 flex-col overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-slate-900/10 sm:rounded-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pc-pop-title"
        @click.stop>
        <div
          class="shrink-0 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100/80 px-3 py-2 sm:px-4 sm:py-2.5">
          <h2
            id="pc-pop-title"
            class="text-base font-bold leading-tight tracking-tight text-slate-900 sm:text-lg">
            고객 조회
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
                  id="pc-pop-type"
                  v-model="searchOption"
                  class="cs-pop-select h-8 min-h-8 w-[7.75rem] shrink-0 rounded-md border border-solid bg-white px-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="0">카드번호</option>
                  <option value="1">고객명</option>
                  <option value="2">휴대폰</option>
                </select>
                <input
                  id="pc-pop-keyword"
                  v-model="searchword"
                  type="text"
                  class="cs-pop-input h-8 min-h-8 min-w-0 flex-1 rounded-md border border-solid bg-white px-2 text-sm text-gray-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="검색어 입력"
                  autocomplete="off"
                  @keydown.enter="searchButton" />
                <button type="button" class="cs-pop-btn-primary shrink-0" @click="searchButton">
                  조회
                </button>
                <button type="button" class="cs-pop-btn-secondary shrink-0" @click="closePopUp">
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          class="cs-pop-grid-wrap flex min-h-0 flex-1 flex-col overflow-hidden px-2.5 pb-2.5 sm:px-3 sm:pb-3">
          <div class="relative min-h-0 w-full flex-1">
            <Realgrid
              :progname="'CRM02_002RPT_VUE'"
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
import Realgrid from "./realgrid.vue";
import store from "@/store";
import { getBelongCust, getCustInfo2 } from "@/api/micrm";

const csPopLabelCol = "4.5rem";
const csPopBorder = "#cbd5e1";

const lngCode = ref("");
const strName = ref("");
const searchword = ref("");
const searchOption = ref(0);
const showing = ref(false);
const showPopUp = () => {
  showing.value = !showing.value;
};

const mainName = ref("");
const props = defineProps({
  lngStoreCode: {
    type: String,
    default: "",
  },
  mainName: {
    type: String,
    default: "고객명",
  },
  type: {
    type: String,
    default: "1",
  },
});

const emit = defineEmits(["ID", "Name", "excelList", "CustId"]);
const rowData = ref([]);
const currlngStoreCode = ref("");
const TYPE = ref("");
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
    lngCode.value = 0;
    emit("ID", lngCode.value);
    emit("CustId", "");
    emit("Name", strName.value);
    ////console.log(res);
    rowData.value = res.data.List;
  }
);

const searchButton = async () => {
  const res = await getCustInfo2(
    store.state.userData.lngStoreGroup,
    searchOption.value,
    searchword.value
  );
  ////console.log(res);
  rowData.value = res.data.List;
};
const closePopUp = async () => {
  searchword.value = "";

  showing.value = false;
};

const dblclickedRowData = (e) => {
  strName.value = e[1];
  lngCode.value = e[0];
  emit("ID", lngCode.value);
  emit("Name", strName.value);
  emit("CustId", e[4]);
  emit("excelList", mainName.value + ": " + strName.value);
  closePopUp();
};

const reset = () => {
  strName.value = "";
  lngCode.value = "";
  searchword.value = "";
  emit("ID", 0);
  emit("Name", "");
  emit("CustId", "");
  emit("excelList", mainName.value + ": ");
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
