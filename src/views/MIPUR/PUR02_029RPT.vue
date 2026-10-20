<!-- /*--############################################################################
# Filename : PUR02_029RPT.vue
# Description : 구매관리2 > 매입 관리 > 매장별/업체별 매입 집계
# Date :2025-09-30
# Author : 권맑음
################################################################################*/ -->
<template>
  <!-- pl-5: 셸 w-right가 pl0이라 그리드가 좌측 메뉴에 붙음 → 우측 pd20과 맞춤 -->
  <div class="flex h-full min-h-0 flex-col pl-5" @click="handleParentClick">
    <div class="flex shrink-0 justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center space-x-2 pr-5">
        <button type="button" @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <button type="button" @click="excelButton" class="button w-auto excel">엑셀</button>
      </div>
    </div>

    <div
      class="pur029-search-panel z-10 mt-3 w-full min-w-0 shrink-0 rounded-lg bg-gray-200"
      :style="{
        '--pur029-control-border': pur029ControlBorder,
        '--pur029-col-gap': pur029ColGap,
        '--pur029-row-gap': pur029RowGap,
        '--pur029-group-gap': pur029GroupGap,
        '--pur029-left-field-max': pur029LeftFieldMax,
        '--pur029-right-field-max': pur029RightFieldMax,
        '--pur029-row-min-h': pur029RowMinH,
        '--pur029-control-h': pur029ControlH,
      }">
      <div class="pur029-search-grid min-w-0">
        <div class="pur029-label">선택기간</div>
        <div class="pur029-field pur029-period min-w-0">
          <DatePicker4
            class="pur029-ym"
            main-name=""
            :init-months-ago="1"
            @month="month"
            @year="year" />
          <span class="pur029-tilde">~</span>
          <DatePicker4
            class="pur029-ym"
            main-name=""
            @month="month2"
            @year="year2" />
        </div>
        <div class="pur029-spacer" aria-hidden="true"></div>

        <div class="pur029-label">매장명</div>
        <div class="pur029-field pur029-pick-slot min-w-0">
          <PickStore
            compact-search-bar
            main-name=""
            :defaultStoreNm="'전체'"
            :defaultStoreType2="true"
            :defaultStore="true"
            @update:storeGroup="lngStoreGroup"
            @storeNm="excelStore"
            @update:storeCd="lngStoreCode" />
        </div>

        <div class="pur029-label">거래처</div>
        <div class="pur029-field pur029-bc-slot min-w-0">
          <BusinessClient
            compact-search-bar
            :default-nm="'전체'"
            :disable="supplierComboDisabled"
            :select-supplier-id="supplierComboPresetId"
            :select-supplier-label="supplierSessionDisplayName"
            @SupplierId="SupplierId" />
        </div>
        <div class="pur029-spacer" aria-hidden="true"></div>

        <div class="pur029-label">조회유형</div>
        <div class="pur029-field pur029-radios min-w-0">
          <label class="pur029-radio" for="pur029-cond-0">
            <input
              id="pur029-cond-0"
              type="radio"
              name="pur029-cond"
              v-model="cond"
              value="0" />
            전체
          </label>
          <label class="pur029-radio" for="pur029-cond-1">
            <input
              id="pur029-cond-1"
              type="radio"
              name="pur029-cond"
              v-model="cond"
              value="1" />
            매장별 매입집계
          </label>
          <label class="pur029-radio" for="pur029-cond-2">
            <input
              id="pur029-cond-2"
              type="radio"
              name="pur029-cond"
              v-model="cond"
              value="2" />
            거래처별 매입집계
          </label>
        </div>
      </div>
    </div>

    <div class="mt-2 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <Realgrid
        v-if="cond == 0"
        class="pur029-grid-body min-h-0 w-full flex-1"
        :progname="'PUR02_029RPT_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :setStateBar="false"
        :documentTitle="'PUR02_029RPT'"
        :documentSubTitle="documentSubTitle"
        :exporttoExcel="exportExcel" />
      <Realgrid
        v-else
        class="pur029-grid-body min-h-0 w-full flex-1"
        :progname="'PUR02_029RPT_VUE'"
        :progid="progid"
        :rowData="rowData2"
        :reload="reload"
        :setTreeView="true"
        :setStateBar="false"
        :rowStateeditable="false"
        :documentTitle="'PUR02_029RPT'"
        :dynamicRowHeight2="true"
        :documentSubTitle="documentSubTitle"
        :exporttoExcel="exportExcel2" />
    </div>
  </div>
</template>

<script setup>
import { getTotalSumList } from "@/api/mipur";
import BusinessClient from "@/components/businessClient2.vue";
import DatePicker4 from "@/components/DatePicker4.vue";
import PageName from "@/components/pageName.vue";
import PickStore from "@/components/pickStore.vue";
import Realgrid from "@/components/realgrid.vue";
import { insertPageLog } from "@/customFunc/customFunc";
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";

const pur029ControlBorder = "#cbd5e1";
const pur029ColGap = "1.25rem";
const pur029RowGap = "0.75rem";
const pur029GroupGap = "3.75rem";
const pur029LeftFieldMax = "22rem";
const pur029RightFieldMax = "28rem";
const pur029RowMinH = "2rem";
const pur029ControlH = "2rem";

const store = useStore();

/** 거래처 계정(lngUserAdminID === 60): 세션 `lngSupplierID` 고정 + 콤보 비활성 — PUR03_036RPT 와 동일 */
const isSupplierPortal = computed(() => store.getters.isSupplierAccountUser);
const supplierComboPresetId = computed(() => {
  if (!isSupplierPortal.value) return "";
  const id = store.getters.sessionLngSupplierID;
  return id != null && id > 0 ? id : "";
});
const supplierComboDisabled = computed(() => isSupplierPortal.value);
/** 로그인 세션에 오는 거래처 표시명 — 콤보 목록에 없을 때 라벨로 사용 */
const supplierSessionDisplayName = computed(() => {
  if (!isSupplierPortal.value) return "";
  const u = store.state.userData;
  if (!u || typeof u !== "object" || Array.isArray(u)) return "";
  const nm =
    u.strSupplierName ??
    u.StrSupplierName ??
    u.strChargerName ??
    u.strStoreName ??
    u.strUserID ??
    "";
  return String(nm).trim();
});

onMounted(async () => {
  await insertPageLog(store.state.activeTab2);

  if (isSupplierPortal.value) {
    const sid = store.getters.sessionLngSupplierID;
    if (sid != null && sid > 0) {
      supplierid.value = String(sid);
    }
  }
});

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

const cond = ref("0");

const datepicker = ref(null);
const closePopUp = ref(false);

const handleParentClick = (e) => {
  const datepickerEl = datepicker.value?.$el;
  if (datepickerEl && datepickerEl.contains(e.target)) {
    return;
  }
  closePopUp.value = !closePopUp.value;
};

const storeCode = ref();
const lngStoreCode = (e) => {
  initGrid();
  storeCode.value = e;
};

const groupCd = ref();
const lngStoreGroup = (e) => {
  groupCd.value = e;
};

const rowData2 = ref([]);
const supplierid = ref("");
const SupplierId = (e) => {
  if (isSupplierPortal.value) {
    const sid = store.getters.sessionLngSupplierID;
    if (sid != null && sid > 0) {
      supplierid.value = String(sid);
      return;
    }
  }
  supplierid.value = e;
};

const progid = ref(2);
const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }

  if (cond.value == "1") {
    progid.value = "2";
  } else {
    progid.value = "3";
  }
  reload.value = !reload.value;
};

const searchButton = async () => {
  try {
    store.state.loading = true;
    initGrid();

    const res = await getTotalSumList(
      groupCd.value,
      storeCode.value,
      supplierid.value,
      y.value + m.value,
      y2.value + m2.value,
      cond.value
    );

    if (cond.value == 0) {
      rowData.value = res.data.List;
    } else {
      rowData2.value = res.data.List;
    }

    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
  } finally {
    store.state.loading = false;
  }
};

const exportExcel = ref(false);
const exportExcel2 = ref(false);

const excelButton = () => {
  documentSubTitle.value =
    "선택기간: " +
    y.value +
    m.value +
    "~" +
    y2.value +
    m2.value +
    "\n" +
    "매장명 :" +
    selectedExcelStore.value;
  if (cond.value == 0) {
    exportExcel.value = !exportExcel.value;
  } else {
    exportExcel2.value = !exportExcel2.value;
  }
};

const documentSubTitle = ref("");
const selectedExcelStore = ref("");

const excelStore = (e) => {
  selectedExcelStore.value = e;
};

const y2 = ref("");
const year2 = (e) => {
  y2.value = e;
};

const m2 = ref("");
const month2 = (e) => {
  m2.value = e;
};
const y = ref("");
const m = ref("");
const year = (e) => {
  y.value = e;
};

const month = (e) => {
  m.value = e;
};
</script>

<style scoped>
.pur029-search-panel {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  --pur029-panel-pad-x: 2rem;
  padding-left: var(--pur029-panel-pad-x);
  padding-right: var(--pur029-panel-pad-x);
  padding-block: 0.75rem;
}

@media (min-width: 640px) {
  .pur029-search-panel {
    --pur029-panel-pad-x: 2.875rem;
  }
}

@media (min-width: 768px) {
  .pur029-search-panel {
    --pur029-panel-pad-x: 4.875rem;
  }
}

@media (min-width: 1024px) {
  .pur029-search-panel {
    --pur029-panel-pad-x: 5.5rem;
  }
}

.pur029-search-grid {
  display: grid;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  align-items: center;
  grid-template-columns:
    max-content
    minmax(0, var(--pur029-left-field-max))
    minmax(var(--pur029-group-gap), 1fr)
    max-content
    minmax(0, var(--pur029-right-field-max));
  column-gap: 0;
  row-gap: var(--pur029-row-gap);
  padding-left: 0;
  padding-right: 0;
}

.pur029-label {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: var(--pur029-row-min-h);
  box-sizing: content-box;
  padding-right: var(--pur029-col-gap);
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
  text-align: center;
  white-space: nowrap;
}

.pur029-spacer {
  min-width: 0;
}

.pur029-field {
  display: flex;
  align-items: center;
  min-width: 0;
  min-height: var(--pur029-row-min-h);
  width: 100%;
}

.pur029-period {
  gap: 0.35rem;
}

.pur029-tilde {
  flex: 0 0 auto;
  line-height: 1;
  color: rgb(55 65 81);
}

.pur029-ym {
  display: flex;
  flex: 1 1 0;
  align-items: center;
  min-width: 0;
  gap: 0.35rem;
}

.pur029-ym:deep(> div) {
  margin-left: 0 !important;
  margin-inline-start: 0 !important;
}

.pur029-ym:deep(> div:first-child) {
  display: none;
}

.pur029-ym:deep(> div:nth-child(2)) {
  flex: 1.35 1 0;
  min-width: 0;
}

.pur029-ym:deep(> div:nth-child(3)) {
  flex: 0.85 1 0;
  min-width: 0;
}

.pur029-ym:deep(select) {
  box-sizing: border-box;
  width: 100% !important;
  min-width: 0;
  height: var(--pur029-control-h);
  min-height: var(--pur029-control-h);
  max-height: var(--pur029-control-h);
  padding: 0 0.35rem;
  border: 1px solid var(--pur029-control-border);
  border-radius: 0.375rem;
  background: #fff;
  font-size: 0.875rem;
  color: rgb(55 65 81);
}

.pur029-ym:deep(select:focus) {
  outline: none;
  border-color: #3b82f6;
}

.pur029-radios {
  display: flex;
  min-width: 0;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 1.25rem;
  min-height: var(--pur029-row-min-h);
}

.pur029-radio {
  display: inline-flex;
  align-items: center;
  min-height: var(--pur029-row-min-h);
  gap: 0.375rem;
  font-size: 0.875rem;
  line-height: 1.25;
  white-space: nowrap;
  cursor: pointer;
}

.pur029-radio input[type="radio"] {
  margin: 0;
  flex-shrink: 0;
}

.pur029-pick-slot :deep(> div.flex.text-base) {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.3fr) minmax(0, 2.125fr);
  align-items: center;
  width: 100%;
  min-width: 0;
  margin: 0 !important;
  gap: 0.5rem !important;
}

.pur029-pick-slot :deep(> div.flex.text-base > div) {
  min-width: 0;
  width: 100%;
  max-width: 100%;
}

.pur029-pick-slot :deep(> div.flex > div:first-child) {
  display: none;
}

.pur029-pick-slot :deep(select),
.pur029-pick-slot :deep(.pickstore-vs-shell) {
  box-sizing: border-box !important;
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important;
  height: var(--pur029-control-h) !important;
  min-height: var(--pur029-control-h) !important;
  max-height: var(--pur029-control-h) !important;
  margin-left: 0 !important;
  border: 1px solid var(--pur029-control-border) !important;
  border-radius: 0.375rem !important;
  background: #fff !important;
  font-size: 0.875rem !important;
}

.pur029-pick-slot :deep(select) {
  padding-left: 0.375rem !important;
  padding-right: 0.375rem !important;
}

.pur029-pick-slot :deep(select:focus),
.pur029-pick-slot :deep(.pickstore-vs-shell:focus-within) {
  border-color: #3b82f6 !important;
  outline: none;
}

.pur029-pick-slot :deep(div.relative.min-w-0.flex-1) {
  flex: none !important;
  width: 100% !important;
  min-width: 0 !important;
  max-width: 100% !important;
}

.pur029-pick-slot :deep(.vs__dropdown-toggle) {
  height: 100% !important;
  min-height: 0 !important;
  border: none !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

.pur029-bc-slot :deep(> div.flex) {
  margin: 0 !important;
  width: 100%;
  min-width: 0;
  gap: 0 !important;
  align-items: center;
}

.pur029-bc-slot :deep(.pickstore-vs-shell) {
  box-sizing: border-box;
  width: 100% !important;
  max-width: 100%;
  min-width: 0;
  height: var(--pur029-control-h) !important;
  min-height: var(--pur029-control-h) !important;
  max-height: var(--pur029-control-h) !important;
  border: 1px solid var(--pur029-control-border) !important;
  border-radius: 0.375rem !important;
  background: #fff !important;
}

.pur029-bc-slot :deep(.pickstore-vs-shell:focus-within) {
  border-color: #3b82f6 !important;
}

.pur029-bc-slot :deep(.style-chooser) {
  width: 100% !important;
  height: 100% !important;
}

.pur029-bc-slot :deep(.vs__dropdown-toggle) {
  box-sizing: border-box;
  height: var(--pur029-control-h) !important;
  min-height: var(--pur029-control-h) !important;
  max-height: var(--pur029-control-h) !important;
  padding: 0 0.25rem 0 0.5rem !important;
  display: flex !important;
  align-items: center !important;
  flex-wrap: nowrap !important;
  border: none !important;
}

.pur029-bc-slot :deep(.vs__selected-options) {
  flex: 1 1 auto !important;
  min-width: 0 !important;
  position: relative !important;
  height: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
  overflow: hidden !important;
}

.pur029-bc-slot :deep(.vs__selected) {
  position: absolute !important;
  left: 0 !important;
  right: 1.5rem !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  margin: 0 !important;
  padding: 0 !important;
  height: auto !important;
  max-width: 100% !important;
  font-size: 0.875rem !important;
  line-height: 1.25 !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  display: block !important;
  background: transparent !important;
}

.pur029-bc-slot :deep(.vs__search) {
  margin: 0 !important;
  padding: 0 !important;
  height: calc(var(--pur029-control-h) - 2px) !important;
  line-height: calc(var(--pur029-control-h) - 2px) !important;
  font-size: 0.875rem !important;
}

.pur029-grid-body {
  min-height: 12rem;
}
</style>
