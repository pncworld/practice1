/*--############################################################################
# Filename : MST37_071INS.vue                                                  
# Description : 마스터관리 > 메뉴 마스터 > 메뉴 재고 등록                       
# Date :2025-05-26                                                             
# Author : 권맑음                     
################################################################################*/
<template>
  <div class="mst71-page flex h-full min-h-0 flex-col pt-8">
    <div
      class="mb-3 flex shrink-0 items-center justify-between w-full overflow-y-hidden">
      <PageName></PageName>
    </div>

    <div
      class="mst71-body mt-2 grid min-h-0 flex-1 grid-cols-[minmax(0,11fr)_minmax(0,9fr)] gap-x-6 px-10 pb-6">
      <div class="flex h-full min-h-0 flex-col overflow-hidden">
        <div
          class="z-10 w-full shrink-0 overflow-x-auto rounded-lg bg-gray-200 px-6 py-3 md:px-8">
          <div class="mst71-search-grid min-w-0">
            <div class="mst71-cell">
              <span class="mst71-sg-label">메뉴명 검색</span>
              <div class="mst71-cell-field mst71-search-field">
                <input
                  id="mst37-071-menu-search"
                  type="text"
                  class="mst71-control"
                  v-model="searchWord3"
                  @keyup.enter="searchButton" />
                <button
                  @click="searchButton"
                  class="button search shrink-0 md:w-auto w-14">
                  조회
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="relative mt-3 min-h-0 flex-1 overflow-hidden">
          <Realgrid
            :progname="'MST37_071INS_VUE'"
            :progid="1"
            :rowData="rowData"
            :reload="reload"
            :rowStateeditable="false"
            :changeRow="changeRow"
            :changeColid="changeColid"
            :changeNow="changeNow"
            :changeValue2="changeValue"
            @updatedRowData="updatedRowData"
            @selectedIndex="selectedIndex"
            @clickedRowData="clickedRowData">
          </Realgrid>
        </div>
      </div>

      <div class="mst71-detail-panel flex h-full min-h-0 flex-col gap-16 overflow-y-auto pr-1">
        <section class="mst71-area w-full min-w-0">
          <div class="mst71-form-grid w-full">
            <div class="mst71-area-title-row">메뉴정보</div>
            <div class="mst71-form-label">매장명</div>
            <div class="mst71-form-value">
              <select
                id="mst37-071-store"
                class="mst71-control w-full disabled:bg-gray-100 disabled:cursor-not-allowed"
                v-model="selectedStore"
                :disabled="disableStoreSelect">
                <option
                  :value="i.lngStoreCode"
                  v-for="i in rowData2"
                  :key="i.lngStoreCode">
                  {{ i.strName }}
                </option>
              </select>
            </div>

            <div class="mst71-form-label">메뉴코드</div>
            <div class="mst71-form-value">
              <input
                type="text"
                class="mst71-control w-full disabled:bg-gray-100"
                v-model="gridvalue1"
                disabled />
            </div>

            <div class="mst71-form-label">메뉴명</div>
            <div class="mst71-form-value">
              <input
                type="text"
                class="mst71-control w-full disabled:bg-gray-100"
                v-model="gridvalue2"
                disabled />
            </div>
          </div>
        </section>

        <section class="mst71-area mst71-area--stock w-full min-w-0">
          <div class="mst71-form-grid w-full">
            <div class="mst71-area-title-row mst71-area-title-row--stock">
              <span>재고수량</span>
              <button class="button save" @click="saveButton">저장</button>
            </div>
            <div class="mst71-form-label">판매수량</div>
            <div class="mst71-form-value">
              <div
                class="mst71-qty-input-wrap"
                :class="{ 'mst71-qty-input-wrap--idle': !hasMenuSelected }">
                <input
                  type="text"
                  class="mst71-control mst71-qty-input disabled:bg-gray-100"
                  v-model="gridvalue3"
                  disabled />
              </div>
            </div>

            <div class="mst71-form-label mst71-form-label--stock">
              <span class="text-red-500">*</span>금일재고 수량
            </div>
            <div class="mst71-form-value mst71-form-value--inline">
              <div
                class="mst71-qty-input-wrap"
                :class="{ 'mst71-qty-input-wrap--idle': !hasMenuSelected }">
                <input
                  type="text"
                  inputmode="numeric"
                  class="mst71-control mst71-qty-input disabled:bg-gray-100"
                  :disabled="!hasMenuSelected"
                  @input="setQty1"
                  @blur="commitQty1"
                  v-model="gridvalue4" />
              </div>
              <button
                type="button"
                class="mst71-step-btn mst71-step-btn--minus"
                :disabled="!hasMenuSelected"
                @click="minusButton"
                aria-label="금일재고 수량 감소">
                －
              </button>
              <button
                type="button"
                class="mst71-step-btn mst71-step-btn--plus"
                :disabled="!hasMenuSelected"
                @click="plusButton"
                aria-label="금일재고 수량 증가">
                ＋
              </button>
            </div>

            <div class="mst71-form-label mst71-form-label--stock">
              <span class="text-red-500">*</span>자동갱신 수량
            </div>
            <div class="mst71-form-value mst71-form-value--inline">
              <div
                class="mst71-qty-input-wrap"
                :class="{ 'mst71-qty-input-wrap--idle': !hasMenuSelected }">
                <input
                  type="text"
                  inputmode="numeric"
                  class="mst71-control mst71-qty-input disabled:bg-gray-100"
                  :disabled="!hasMenuSelected"
                  @input="setQty2"
                  @blur="commitQty2"
                  v-model="gridvalue5" />
              </div>
              <button
                type="button"
                class="mst71-step-btn mst71-step-btn--minus"
                :disabled="!hasMenuSelected"
                @click="minusButton2"
                aria-label="자동갱신 수량 감소">
                －
              </button>
              <button
                type="button"
                class="mst71-step-btn mst71-step-btn--plus"
                :disabled="!hasMenuSelected"
                @click="plusButton2"
                aria-label="자동갱신 수량 증가">
                ＋
              </button>
            </div>
          </div>
        </section>

        <div class="mst71-notice space-y-1.5 leading-snug text-red-500">
          <p>◎'자동갱신 수량'에 입력된 수로 매일 자동 초기화 됩니다.(오전 04시 초기화)</p>
          <p>◎금일재고 수량이 선점 · 판매 수량보다 작으면 등록할 수 없습니다.</p>
          <p>◎가급적 개점 전 등록을 권장 드립니다.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getStoreList } from "@/api/common";
import { getMenuStock, saveMenuStock } from "@/api/master";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
/**
 * 	매장 단일 선택 컴포넌트
 */
/**
 * 	그리드 생성
 */

import Realgrid from "@/components/realgrid.vue";
/**
 *  페이지로그 자동 입력
 *  */

import { formatNumberWithCommas, insertPageLog } from "@/customFunc/customFunc";
import Swal from "sweetalert2";
/**
 *  경고창 호출 라이브러리
 *  */

/*
 * 공통 표준  Function
 */

import { computed, onMounted, ref, watch } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";
/**
 * 	화면 Load시 실행 스크립트
 */

const rowData3 = ref([]);
const MenuGroupList = ref([]);
const cond10 = ref(false);

const clicked = ref(false);
const gridvalue1 = ref("");
const gridvalue2 = ref("");
const gridvalue3 = ref("");
const gridvalue4 = ref("");
const gridvalue5 = ref("");

const changeRow = ref();
const selectedIndex = (e) => {
  changeRow.value = e;
};

const changeColid = ref("lngStkQty");
const changeNow = ref(false);
const changeValue = ref("");

const hasMenuSelected = computed(
  () => String(gridvalue1.value ?? "").trim() !== ""
);

const clearMenuDetail = () => {
  clicked.value = false;
  changeRow.value = undefined;
  gridvalue1.value = "";
  gridvalue2.value = "";
  gridvalue3.value = "";
  gridvalue4.value = "";
  gridvalue5.value = "";
};

const clickedRowData = (e) => {
  ////console.log(e);
  const menuCode = e?.[0];
  if (menuCode === null || menuCode === undefined || String(menuCode).trim() === "") {
    clearMenuDetail();
    return;
  }
  clicked.value = true;
  gridvalue1.value = e[0];
  gridvalue2.value = e[1];
  gridvalue3.value = formatSaleQty(e[5]);
  gridvalue4.value = formatPositiveIntegerQty(e[3]);
  gridvalue5.value = formatPositiveIntegerQty(e[4]);
};

const updatedRowData = (e) => {
  updateRowData.value = e;
  // ////console.log(e);
};
onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const userGroup = store.state.storeGroup[0].lngStoreGroup;
  // const res = await getMenuStoreList(userGroup);
  // GroupList.value = res.data.List;
  // reload.value = !reload.value;

  const res2 = await getStoreList(userGroup, 0);
  ////console.log(res2);

  rowData2.value = res2.data.store.sort((a, b) =>
    a.strName.localeCompare(b.strName)
  );

  applyStoreSelectLock();
  const res = await getMenuStock(
    userGroup,
    selectedStore.value,
    searchWord3.value
  );

  rowData.value = res.data.List;
});

const cond8 = ref("");
const searchWord3 = ref("");
const cond9 = ref(false);
const cond12 = ref("");
const cond11 = ref("");

const excludeCheck = ref(true);
watch(cond9, () => {
  searchSpecialCond.value = !cond9.value;
});

const selectedType = ref(0);

watch(selectedType, () => {
  if (selectedType.value == 0) {
    excludeCheck.value = true;
  } else {
    excludeCheck.value = false;
  }
});
const disableStoreSelect = ref(false);
const reload = ref(false);
const rowData = ref([]);
const rowData2 = ref([]);
const afterSearch = ref(false);
const GroupList = ref([]);
const cond = ref(false);
const cond2 = ref("");
const cond3 = ref("0");
const cond4 = ref("0");
const cond5 = ref("0");
const cond6 = ref("");
const cond7 = ref("");
const store = useStore();

/** 본사 계정만 매장명 선택 가능 (pickStore / pickStoreRenew 동일 기준) */
const applyStoreSelectLock = () => {
  const ud = store.state.userData;
  const isHqAccount =
    ud?.blnBrandAdmin == "True" || ud?.lngPositionType == "1";
  disableStoreSelect.value = !isHqAccount;
  if (!isHqAccount) {
    selectedStore.value = ud.lngPosition;
  } else if (!selectedStore.value) {
    selectedStore.value = ud.lngPosition;
  }
};

const MultiSubList = ref([]);
const selectedSubGroup = ref(0);
const MultiGroupList = ref([]);
const selectedMultiGroup = ref(0);

const searchSpecialCond = ref(false);

const updateRowData = ref([]);

const getRowChanged = ref(false);
const updatedRows = ref([]);

const openPopUp = ref(false);

/** 판매수량 — 없으면 0, 음수·소수 없음, 천단위 표시 */
const formatSaleQty = (val) => {
  if (val === null || val === undefined || val === "") {
    return formatNumberWithCommas(0);
  }
  const n = parseInt(String(val).replace(/[^\d]/g, ""), 10);
  return formatNumberWithCommas(Number.isNaN(n) ? 0 : n);
};

/** 금일재고·자동갱신 — 0 이상 정수만 */
const sanitizePositiveIntegerQty = (raw) =>
  String(raw ?? "").replace(/[^0-9]/g, "");

const parsePositiveIntegerQty = (val) => {
  const n = parseInt(sanitizePositiveIntegerQty(val), 10);
  return Number.isNaN(n) ? 0 : Math.max(0, n);
};

const formatPositiveIntegerQty = (val) =>
  formatNumberWithCommas(parsePositiveIntegerQty(val));

const canEditStockQty = () =>
  hasMenuSelected.value &&
  clicked.value &&
  changeRow.value != null &&
  changeRow.value !== "" &&
  changeRow.value != -1;

const syncStockQtyToGrid = (colId, fieldRef, rawValue) => {
  const sanitized = sanitizePositiveIntegerQty(rawValue);
  fieldRef.value = sanitized === "" ? "" : formatNumberWithCommas(parsePositiveIntegerQty(sanitized));
  if (sanitized === "") return;

  const n = parsePositiveIntegerQty(sanitized);
  changeColid.value = colId;
  changeValue.value = n;
  changeNow.value = !changeNow.value;
};

const stepStockQty = (colId, fieldRef, delta) => {
  if (!canEditStockQty()) return;

  const next = Math.max(0, parsePositiveIntegerQty(fieldRef.value) + delta);
  fieldRef.value = formatPositiveIntegerQty(next);
  changeColid.value = colId;
  changeValue.value = next;
  changeNow.value = !changeNow.value;
};

const minusButton = () => stepStockQty("lngStkQty", gridvalue4, -1);

const minusButton2 = () => stepStockQty("lngBaseQty", gridvalue5, -1);

const plusButton = () => stepStockQty("lngStkQty", gridvalue4, 1);

const plusButton2 = () => stepStockQty("lngBaseQty", gridvalue5, 1);
/**
 *  조회 함수
 */

const searchButton = async () => {
  //   if (selectedStore.value == 0) {
  //     Swal.fire({
  //       title: "경고",
  //       text: "매장명을 먼저 선택하세요.",
  //       icon: "warning",
  //       confirmButtonText: "확인",
  //     });
  //     return;
  //   }
  try {
    store.state.loading = true;
    // initGrid();
    reload.value = !reload.value;
    const res = await getMenuStock(
      store.state.userData.lngStoreGroup,
      selectedStore.value,
      searchWord3.value
    );
    ////console.log(res);
    clearMenuDetail();
    rowData.value = res.data.List;
    updateRowData.value = JSON.parse(JSON.stringify(res.data.List));
    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    //comsole.log(error);
  } finally {
    store.state.loading = false;
  }
};

const saveButton = async (e) => {
  if (!hasMenuSelected.value) {
    await Swal.fire({
      title: "경고",
      text: "메뉴를 선택 후 저장해 주십시오.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  try {
    store.state.loading = true;
    // initGrid();
    // reload.value = !reload.value;
    const uni1 = updateRowData.value.map((item) => item.lngCode);
    const uni2 = updateRowData.value.map((item) => item.lngStkQty);
    const uni3 = updateRowData.value.map((item) => item.lngBaseQty);

    let contain = [];
    for (let i = 0; i < uni1.length; i++) {
      if (i == uni1.length - 1) {
        let str = uni1[i] + "+" + uni2[i] + "+" + uni3[i] + "|";
        contain.push(str);
      } else {
        let str = uni1[i] + "+" + uni2[i] + "+" + uni3[i];
        contain.push(str);
      }
    }
    const res = await saveMenuStock(
      store.state.userData.lngStoreGroup,
      selectedStore.value,
      contain.join("|")
    );
    ////console.log(res);
    store.state.loading = false;

    await Swal.fire({
      title: "성공",
      text: "저장하였습니다.",
      icon: "success",
      confirmButtonText: "확인",
    });
  } catch (error) {
    ////console.log(error);
  } finally {
    store.state.loading = false;
    searchButton();
  }
};

/* 매장 컴포넌트 관련 함수 */
const selectedGroup = ref();
const selectedStores = ref();
const selectedStore = ref(0);
const selectedStoreAttrs = ref();

/**
 * 페이지 매장 코드 세팅
 */

const lngStoreCode = async (e) => {
  initGrid();
  selectedStores.value = e;
  ////console.log(e);
};
const lngStoreGroup = async (e) => {
  //initGrid();
  selectedGroup.value = e;
  ////console.log(e);
};

/**
 * 그리드 초기화
 */

const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
  cond.value = "";
  clearMenuDetail();
};

watch([selectedSubGroup, selectedMultiGroup, selectedStore], () => {
  initGrid();
});

//엑셀 버튼 처리 함수
const exportExcel = ref(false);
/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  let storeNm;
  if (selectedStore.value == 0) {
    storeNm = "선택";
  } else {
    storeNm = GroupList.value.filter(
      (item) => item.lngStoreCode == selectedStore.value
    )[0].strStoreName;
  }

  let storeGroup;
  if (selectedStore.value == 0) {
    storeGroup = "전체";
  } else {
    storeGroup = MultiGroupList.value.filter(
      (item) => item.lngCode == selectedMultiGroup.value
    )[0].strName;
  }

  let menuSubGroup;
  if (selectedStore.value == 0) {
    menuSubGroup = "전체";
  } else {
    menuSubGroup = MultiSubList.value.filter(
      (item) => item.lngCode == selectedSubGroup.value
    )[0].strName;
  }

  documentSubTitle.value =
    "매장명 : " +
    storeNm +
    "\n" +
    "멀티단가그룹 : " +
    storeGroup +
    "\n" +
    "메뉴서브그룹 : " +
    menuSubGroup;

  //documentSubTitle.value += "\n";
  exportExcel.value = !exportExcel.value;
};

// 엑셀 추출
const documentSubTitle = ref("");
const selectedExcelList = ref("");
const selectedExcelDate = ref("");

const selectedExcelStore = ref("");
/**
 * 엑셀용 매장 세팅 함수
 */

const excelStore = (e) => {
  selectedExcelStore.value = "매장명 : " + e;
  //comsole.log(e);
};
const excelDate = (e) => {
  selectedExcelDate.value = e;
  //comsole.log(e);
};

const setQty1 = (e) => {
  if (!canEditStockQty()) return;
  syncStockQtyToGrid("lngStkQty", gridvalue4, e.target.value);
};

const commitQty1 = () => {
  if (!canEditStockQty()) return;
  if (sanitizePositiveIntegerQty(gridvalue4.value) === "") {
    syncStockQtyToGrid("lngStkQty", gridvalue4, "0");
  }
};

const setQty2 = (e) => {
  if (!canEditStockQty()) return;
  syncStockQtyToGrid("lngBaseQty", gridvalue5, e.target.value);
};

const commitQty2 = () => {
  if (!canEditStockQty()) return;
  if (sanitizePositiveIntegerQty(gridvalue5.value) === "") {
    syncStockQtyToGrid("lngBaseQty", gridvalue5, "0");
  }
};
</script>

<style scoped>
.mst71-page {
  --mst71-label-col: 7rem;
  --mst71-item-gap: 0.75rem;
  --mst71-control-border: #cbd5e1;
  --mst71-control-focus-border: #3b82f6;
  --mst71-control-h: 2rem;
  --mst71-control-radius: 0.375rem;
  --mst71-detail-row-h: 2.5rem;
  --mst71-detail-font: 0.8125rem;
  --mst71-detail-cell-py: 0.1875rem;
}

.mst71-detail-panel {
  --mst71-label-col: 9.5rem;
  --mst71-control-h: 2.75rem;
  --mst71-detail-row-h: 3.25rem;
  --mst71-detail-font: 1.125rem;
  --mst71-detail-input-font: 1.125rem;
  --mst71-detail-cell-py: 0.3125rem;
}

.mst71-area-title-row {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: var(--mst71-detail-row-h);
  padding: var(--mst71-detail-cell-py) 0.875rem;
  border: 1px solid #e5e7eb;
  background: #edf2f7;
  font-size: 1.1875rem;
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: 0.01em;
  color: #1f2a44;
  text-align: center;
}

.mst71-area-title-row--stock {
  position: relative;
  background: #eaf6ff;
  border-color: #b6def6;
  color: #1e5f86;
}

.mst71-area-title-row--stock > span {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: auto;
  pointer-events: none;
}

.mst71-area-title-row--stock .button.save {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
}

.mst71-area--stock {
  margin-top: 1rem;
}

.mst71-search-grid .mst71-cell {
  max-width: 52rem;
}

.mst71-cell {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: var(--mst71-item-gap);
}

.mst71-sg-label {
  flex: 0 0 var(--mst71-label-col);
  width: var(--mst71-label-col);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
}

.mst71-cell-field {
  min-width: 0;
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  width: 100%;
}

.mst71-search-field {
  gap: 0.5rem;
}

.mst71-control {
  box-sizing: border-box;
  height: var(--mst71-control-h);
  min-height: var(--mst71-control-h);
  max-height: var(--mst71-control-h);
  width: 100%;
  min-width: 0;
  border-radius: var(--mst71-control-radius);
  border: 1px solid var(--mst71-control-border);
  background: #fff;
  padding: 0 0.5rem;
  font-size: 0.875rem;
  line-height: 1;
}

.mst71-page select.mst71-control,
.mst71-page input.mst71-control {
  border: 1px solid var(--mst71-control-border) !important;
  border-radius: var(--mst71-control-radius) !important;
}

.mst71-control:focus,
.mst71-control:focus-visible {
  border-color: var(--mst71-control-focus-border) !important;
  outline: none;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.25);
}

.mst71-control:disabled {
  background: #f3f4f6;
}

.mst71-form-grid {
  display: grid;
  grid-template-columns: var(--mst71-label-col) minmax(0, 1fr);
  grid-auto-rows: var(--mst71-detail-row-h);
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  overflow: hidden;
  background: #fff;
}

.mst71-form-grid > * {
  box-sizing: border-box;
  min-height: var(--mst71-detail-row-h);
  align-self: stretch;
}

.mst71-form-label {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: var(--mst71-detail-row-h);
  padding: var(--mst71-detail-cell-py) 0.375rem;
  border: 1px solid #e5e7eb;
  background: #edf2f7;
  color: #5c5c5c;
  font-size: var(--mst71-detail-font);
  font-weight: 600;
  line-height: 1.25;
  text-align: center;
  word-break: keep-all;
}

.mst71-area--stock .mst71-form-label {
  color: #111827;
}

.mst71-area--stock .mst71-form-label--stock,
.mst71-area--stock .mst71-form-value--inline .mst71-control {
  font-weight: 700;
}

.mst71-form-label--stock {
  background: rgb(255 237 213);
}

.mst71-form-value {
  display: flex;
  align-items: center;
  min-height: var(--mst71-detail-row-h);
  min-width: 0;
  padding: var(--mst71-detail-cell-py) 0.375rem;
  border: 1px solid #e5e7eb;
  background: #fff;
}

.mst71-form-value--inline {
  flex-wrap: nowrap;
  align-items: center;
  gap: 0.5rem;
}

.mst71-detail-panel .mst71-form-value--inline {
  gap: 0.75rem;
}

.mst71-detail-panel .mst71-form-grid .mst71-control {
  height: var(--mst71-control-h) !important;
  min-height: var(--mst71-control-h) !important;
  max-height: var(--mst71-control-h) !important;
  font-size: var(--mst71-detail-input-font) !important;
  line-height: 1.25 !important;
  padding: 0 0.75rem !important;
}

.mst71-detail-panel .mst71-form-value {
  padding: var(--mst71-detail-cell-py) 0.625rem;
}

.mst71-qty-input {
  box-sizing: border-box;
  width: 14rem;
  max-width: 14rem;
  flex: 0 0 auto;
}

.mst71-qty-input-wrap {
  position: relative;
  box-sizing: border-box;
  width: 14rem;
  max-width: 14rem;
  flex: 0 0 auto;
}

.mst71-qty-input-wrap .mst71-qty-input {
  width: 100%;
  max-width: 100%;
}

.mst71-qty-input-wrap--idle::after {
  content: "0";
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: var(--mst71-detail-input-font, 1.125rem);
  font-weight: inherit;
  pointer-events: none;
  line-height: 1.25;
}

.mst71-form-value--inline .mst71-qty-input-wrap--idle::after {
  font-weight: 700;
}

.mst71-qty-input-wrap--idle .mst71-qty-input {
  color: transparent;
  -webkit-text-fill-color: transparent;
}

.mst71-step-btn {
  box-sizing: border-box;
  display: inline-flex;
  width: var(--mst71-control-h);
  height: var(--mst71-control-h);
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: var(--mst71-control-radius);
  border: 1px solid var(--mst71-control-border);
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1;
  color: rgb(255 255 255);
}

.mst71-step-btn--minus {
  background-color: rgb(248 113 113);
  margin-left: 0.75rem;
}

.mst71-step-btn--plus {
  background-color: rgb(96 165 250);
  margin-left: 1.5rem;
}

.mst71-step-btn:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.mst71-notice {
  font-size: 1rem;
}

.mst71-notice p {
  margin: 0;
}

@media (max-width: 1024px) {
  .mst71-body {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>
