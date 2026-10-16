<!-- /*--############################################################################
# Filename : PUR02_029RPT_02.vue                                                  
# Description : 구매관리2 > 매입 관리 > 매장별/업체별 매입 집계Ⅱ                      
# Date :2025-09-24                                                             
# Author : 권맑음                     
################################################################################*/ -->
<template>
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
      class="pur02902-search-panel z-10 mt-3 w-full min-w-0 shrink-0 rounded-lg bg-gray-200"
      :style="{
        '--pur02902-control-border': pur02902ControlBorder,
        '--pur02902-col-gap': pur02902ColGap,
        '--pur02902-row-gap': pur02902RowGap,
        '--pur02902-group-gap': pur02902GroupGap,
        '--pur02902-left-field-max': pur02902LeftFieldMax,
        '--pur02902-right-field-max': pur02902RightFieldMax,
        '--pur02902-row-min-h': pur02902RowMinH,
        '--pur02902-control-h': pur02902ControlH,
      }">
      <div class="pur02902-search-grid min-w-0">
        <div class="pur02902-label">선택기간</div>
        <div class="pur02902-field pur02902-period min-w-0">
          <DatePicker4
            class="pur02902-ym"
            main-name=""
            :init-months-ago="1"
            @month="month"
            @year="year" />
          <span class="pur02902-tilde">~</span>
          <DatePicker4
            class="pur02902-ym"
            main-name=""
            @month="month2"
            @year="year2" />
        </div>
        <div class="pur02902-spacer" aria-hidden="true"></div>

        <div class="pur02902-label">매장명</div>
        <div class="pur02902-field pur02902-pick-slot min-w-0">
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

        <div class="pur02902-label">거래처</div>
        <div class="pur02902-field pur02902-bc-slot min-w-0">
          <BusinessClient
            compact-search-bar
            :default-nm="'전체'"
            @SupplierId="SupplierId" />
        </div>
        <div class="pur02902-spacer" aria-hidden="true"></div>

        <div class="pur02902-label">조회유형</div>
        <div class="pur02902-field pur02902-radios min-w-0">
            <label class="pur02902-radio" for="pur02902-cond-0">
              <input
                id="pur02902-cond-0"
                type="radio"
                name="pur02902-cond"
                v-model="cond"
                value="0" />
              전체
            </label>
            <label class="pur02902-radio" for="pur02902-cond-1">
              <input
                id="pur02902-cond-1"
                type="radio"
                name="pur02902-cond"
                v-model="cond"
                value="1" />
              매장별 매입집계
            </label>
            <label class="pur02902-radio" for="pur02902-cond-2">
              <input
                id="pur02902-cond-2"
                type="radio"
                name="pur02902-cond"
                v-model="cond"
                value="2" />
              거래처별 매입집계
            </label>
        </div>
      </div>
      <div v-if="cond != 0" class="pur02902-tree-bar">
        <button
          type="button"
          class="pur02902-tree-all"
          :title="treeAllOpen ? '모두 접기' : '모두 펼치기'"
          @click="toggleTreeExpandAll">
          <img
            :src="treeAllOpen ? '/icon/folder-collapse.svg?v=6' : '/icon/folder-expand.svg?v=6'"
            alt="" />
        </button>
      </div>
    </div>

    <div class="mt-2 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <Realgrid
        v-if="cond == 0"
        class="pur02902-grid-body min-h-0 w-full flex-1"
        :progname="'PUR02_029RPT_02_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :setStateBar="false"
        :setFooter="true"
        :footer-label-on-first-visible="true"
        :footer-use-cell-number-format="true"
        :setFooterColID="pur02902SumCols"
        :setFooterExpressions="pur02902SumExprs"
        :setFooterCustomText="['합계']"
        :documentTitle="'PUR02_029RPT_02'"
        :documentSubTitle="documentSubTitle"
        :exporttoExcel="exportExcel" />
      <Realgrid
        v-else
        ref="treeGridRef"
        :key="'pur02902-tree-' + progid"
        class="pur02902-grid-body min-h-0 w-full flex-1"
        :tree-square-expander="true"
        :setFooter="true"
        :footer-sum-root-only="true"
        :footer-label-on-first-visible="true"
        :footer-use-cell-number-format="true"
        :setFooterColID="pur02902SumCols"
        :setFooterExpressions="pur02902SumExprs"
        :setFooterCustomText="['합계']"
        :progname="'PUR02_029RPT_02_VUE'"
        :progid="progid"
        :rowData="rowData2"
        :reload="reload"
        :setTreeView="true"
        :tree-icon-images="['folder-close.svg?v=6', 'folder-open.svg?v=6']"
        :setStateBar="false"
        :rowStateeditable="false"
        :documentTitle="'PUR02_029RPT_02'"
        :checkRenderEditable="false"
        :checkRowAuto="false"
        :dynamicRowHeight2="true"
        :documentSubTitle="documentSubTitle"
        :exporttoExcel="exportExcel2" />
    </div>
  </div>
</template>

<script setup>
import { getNbiCornTotalSumList } from "@/api/mipur";
import BusinessClient from "@/components/businessClient2.vue";
import DatePicker4 from "@/components/DatePicker4.vue";
import PageName from "@/components/pageName.vue";
import PickStore from "@/components/pickStore.vue";
import Realgrid from "@/components/realgrid.vue";
import { insertPageLog } from "@/customFunc/customFunc";
import { onMounted, ref, watch } from "vue";
import Swal from "sweetalert2";
import { useStore } from "vuex";

const pur02902SumCols = [
  "rawMatTax",
  "rawMatDeTax",
  "productTax",
  "productDeTax",
  "expendablesTax",
  "curTotalSum",
];
const pur02902SumExprs = ["sum", "sum", "sum", "sum", "sum", "sum"];

const pur02902ControlBorder = "#cbd5e1";
const pur02902ColGap = "1.25rem";
const pur02902RowGap = "0.75rem";
const pur02902GroupGap = "3.75rem";
const pur02902LeftFieldMax = "22rem";
const pur02902RightFieldMax = "28rem";
const pur02902RowMinH = "2rem";
const pur02902ControlH = "2rem";

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  //   const res = await getCommonList(27);

  //   optionList.value = res.data.List.filter((item) => item.strDCode != "01");

  //   const res2 = await getCommonList(24);

  //   optionList2.value = res2.data.List;
});

const reload = ref(false);
const treeGridRef = ref(null);
const treeAllOpen = ref(false);
const toggleTreeExpandAll = () => {
  const grid = treeGridRef.value;
  if (!grid) return;
  if (treeAllOpen.value) {
    grid.collapseAllTree();
    treeAllOpen.value = false;
  } else {
    grid.expandAllTree();
    treeAllOpen.value = true;
  }
};
const rowData = ref([]);
const afterSearch = ref(false);

const cond = ref("0");
const cond2 = ref("");

const cond5 = ref(0);
const store = useStore();

const datepicker = ref(null);
const closePopUp = ref(false);
const optionList = ref([]);
const optionList2 = ref([]);
/**
 * 매출 일자 안 라디오박스 닫기 위한 외부 클릭 감지 함수
 */

const handleParentClick = (e) => {
  const datepickerEl = datepicker.value?.$el;
  if (datepickerEl && datepickerEl.contains(e.target)) {
    return;
  }
  closePopUp.value = !closePopUp.value;
};

const sDate = ref("");
const eDate = ref("");

const selectedDate = ref();
const excelDate = (e) => {
  selectedDate.value = e;
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
const supplierid = ref(0);
const SupplierId = (e) => {
  supplierid.value = e === "" || e == null ? 0 : e;
};
/**
 *  조회 함수
 */
const hideColumnsId = ref([]);
const searchButton = async () => {
  try {
    store.state.loading = true;
    treeAllOpen.value = false;
    initGrid();

    const res = await getNbiCornTotalSumList(
      groupCd.value,
      storeCode.value,
      supplierid.value,
      y.value + m.value,
      y2.value + m2.value,
      cond.value
    );
    console.log(res);
    const resultCd = String(res?.data?.RESULT_CD ?? "");
    if (resultCd && resultCd !== "00") {
      Swal.fire({
        title: "조회",
        text: res?.data?.RESULT_NM || "조회에 실패했습니다.",
        icon: "warning",
      });
    }
    const list = Array.isArray(res?.data?.List) ? res.data.List : [];

    if (String(cond.value) === "0") {
      rowData.value = list;
    } else {
      rowData2.value = withTreeNum(list);
    }

    //console.log(res);
    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    //comsole.log(error);
  } finally {
    store.state.loading = false;
  }
};

/**
 * 페이지 매장 코드 세팅
 */

/**
 * 그리드 초기화
 */

const disabled1 = ref(false);
const progid = ref("2");
watch(cond, () => {
  treeAllOpen.value = false;
  initGrid();
});
const withTreeNum = (rows) => {
  const list = Array.isArray(rows) ? rows : [];
  const hasTree = list.some((row) => String(row?.TreeNum ?? "").trim() !== "");
  if (hasTree) return list;
  return list.map((row, index) => ({
    ...row,
    TreeNum: String(index + 1),
  }));
};
const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
  if (rowData2.value.length > 0) {
    rowData2.value = [];
  }

  progid.value = String(cond.value) === "1" ? "2" : "3";
  reload.value = !reload.value;
};

//엑셀 버튼 처리 함수
const exportExcel = ref(false);
const exportExcel2 = ref(false);
/**
 * 엑셀 내보내기 함수
 */

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

const documentSubTitle2 = ref("");

// 엑셀 추출
const documentSubTitle = ref("");
const selectedExcelList = ref("");

const selectedExcelStore = ref("");
/**
 * 엑셀용 매장 세팅 함수
 */

const excelStore = (e) => {
  selectedExcelStore.value = e;
  //comsole.log(e);
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
.pur02902-search-panel {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  --pur02902-panel-pad-x: 2rem;
  padding-left: var(--pur02902-panel-pad-x);
  padding-right: var(--pur02902-panel-pad-x);
  padding-block: 0.75rem;
}

@media (min-width: 640px) {
  .pur02902-search-panel {
    --pur02902-panel-pad-x: 2.875rem;
  }
}

@media (min-width: 768px) {
  .pur02902-search-panel {
    --pur02902-panel-pad-x: 4.875rem;
  }
}

@media (min-width: 1024px) {
  .pur02902-search-panel {
    --pur02902-panel-pad-x: 5.5rem;
  }
}

.pur02902-search-grid {
  display: grid;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  align-items: center;
  grid-template-columns:
    max-content
    minmax(0, var(--pur02902-left-field-max))
    minmax(var(--pur02902-group-gap), 1fr)
    max-content
    minmax(0, var(--pur02902-right-field-max));
  column-gap: 0;
  row-gap: var(--pur02902-row-gap);
  padding-left: 0;
  padding-right: 0;
}

.pur02902-label {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: var(--pur02902-row-min-h);
  box-sizing: content-box;
  padding-right: var(--pur02902-col-gap);
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
  text-align: center;
  white-space: nowrap;
}

.pur02902-spacer {
  min-width: 0;
}

.pur02902-field {
  display: flex;
  align-items: center;
  min-width: 0;
  min-height: var(--pur02902-row-min-h);
  width: 100%;
}

.pur02902-period {
  gap: 0.35rem;
}

.pur02902-tilde {
  flex: 0 0 auto;
  line-height: 1;
  color: rgb(55 65 81);
}

.pur02902-ym {
  display: flex;
  flex: 1 1 0;
  align-items: center;
  min-width: 0;
  gap: 0.35rem;
}

.pur02902-ym:deep(> div) {
  margin-left: 0 !important;
  margin-inline-start: 0 !important;
}

.pur02902-ym:deep(> div:first-child) {
  display: none;
}

.pur02902-ym:deep(> div:nth-child(2)) {
  flex: 1.35 1 0;
  min-width: 0;
}

.pur02902-ym:deep(> div:nth-child(3)) {
  flex: 0.85 1 0;
  min-width: 0;
}

.pur02902-ym:deep(select) {
  box-sizing: border-box;
  width: 100% !important;
  min-width: 0;
  height: var(--pur02902-control-h);
  min-height: var(--pur02902-control-h);
  max-height: var(--pur02902-control-h);
  padding: 0 0.35rem;
  border: 1px solid var(--pur02902-control-border);
  border-radius: 0.375rem;
  background: #fff;
  font-size: 0.875rem;
  color: rgb(55 65 81);
}

.pur02902-ym:deep(select:focus) {
  outline: none;
  border-color: #3b82f6;
}

.pur02902-radios {
  display: flex;
  min-width: 0;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 1.25rem;
  min-height: var(--pur02902-row-min-h);
}

.pur02902-radio {
  display: inline-flex;
  align-items: center;
  min-height: var(--pur02902-row-min-h);
  gap: 0.375rem;
  font-size: 0.875rem;
  line-height: 1.25;
  white-space: nowrap;
  cursor: pointer;
}

.pur02902-radio input[type="radio"] {
  margin: 0;
  flex-shrink: 0;
}

.pur02902-pick-slot :deep(> div.flex.text-base) {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.3fr) minmax(0, 2.125fr);
  align-items: center;
  width: 100%;
  min-width: 0;
  margin: 0 !important;
  gap: 0.5rem !important;
}

.pur02902-pick-slot :deep(> div.flex.text-base > div) {
  min-width: 0;
  width: 100%;
  max-width: 100%;
}

.pur02902-pick-slot :deep(> div.flex > div:first-child) {
  display: none;
}

.pur02902-pick-slot :deep(select),
.pur02902-pick-slot :deep(.pickstore-vs-shell) {
  box-sizing: border-box !important;
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important;
  height: var(--pur02902-control-h) !important;
  min-height: var(--pur02902-control-h) !important;
  max-height: var(--pur02902-control-h) !important;
  margin-left: 0 !important;
  border: 1px solid var(--pur02902-control-border) !important;
  border-radius: 0.375rem !important;
  background: #fff !important;
  font-size: 0.875rem !important;
}

.pur02902-pick-slot :deep(select) {
  padding-left: 0.375rem !important;
  padding-right: 0.375rem !important;
}

.pur02902-pick-slot :deep(select:focus),
.pur02902-pick-slot :deep(.pickstore-vs-shell:focus-within) {
  border-color: #3b82f6 !important;
  outline: none;
}

.pur02902-pick-slot :deep(div.relative.min-w-0.flex-1) {
  flex: none !important;
  width: 100% !important;
  min-width: 0 !important;
  max-width: 100% !important;
}

.pur02902-pick-slot :deep(.vs__dropdown-toggle) {
  height: 100% !important;
  min-height: 0 !important;
  border: none !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

.pur02902-bc-slot :deep(> div.flex) {
  margin: 0 !important;
  width: 100%;
  min-width: 0;
  gap: 0 !important;
  align-items: center;
}

.pur02902-bc-slot :deep(.pickstore-vs-shell) {
  box-sizing: border-box;
  width: 100% !important;
  max-width: 100%;
  min-width: 0;
  height: var(--pur02902-control-h) !important;
  min-height: var(--pur02902-control-h) !important;
  max-height: var(--pur02902-control-h) !important;
  border: 1px solid var(--pur02902-control-border) !important;
  border-radius: 0.375rem !important;
  background: #fff !important;
}

.pur02902-bc-slot :deep(.pickstore-vs-shell:focus-within) {
  border-color: #3b82f6 !important;
}

.pur02902-bc-slot :deep(.style-chooser) {
  width: 100% !important;
  height: 100% !important;
}

.pur02902-bc-slot :deep(.vs__dropdown-toggle) {
  box-sizing: border-box;
  height: var(--pur02902-control-h) !important;
  min-height: var(--pur02902-control-h) !important;
  max-height: var(--pur02902-control-h) !important;
  padding: 0 0.25rem 0 0.5rem !important;
  display: flex !important;
  align-items: center !important;
  flex-wrap: nowrap !important;
  border: none !important;
}

.pur02902-bc-slot :deep(.vs__selected-options) {
  flex: 1 1 auto !important;
  min-width: 0 !important;
  position: relative !important;
  height: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
  overflow: hidden !important;
}

.pur02902-bc-slot :deep(.vs__selected) {
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

.pur02902-bc-slot :deep(.vs__search) {
  margin: 0 !important;
  padding: 0 !important;
  height: calc(var(--pur02902-control-h) - 2px) !important;
  line-height: calc(var(--pur02902-control-h) - 2px) !important;
  font-size: 0.875rem !important;
}

.pur02902-tree-bar {
  position: absolute;
  left: 0.85rem;
  top: calc(
    0.75rem + var(--pur02902-row-min-h) + var(--pur02902-row-gap)
  );
  display: flex;
  align-items: center;
  height: var(--pur02902-row-min-h);
}

.pur02902-tree-all {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.6rem;
  height: var(--pur02902-row-min-h);
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.pur02902-tree-all img {
  width: 2.5rem;
  height: 1.92rem;
  display: block;
}

.pur02902-grid-body {
  min-height: 12rem;
}
</style>
