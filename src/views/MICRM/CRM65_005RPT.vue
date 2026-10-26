<!-- /*--############################################################################
# Filename : CRM65_005RPT.vue
# Description : 고객관리 > 전자상품권 현황 > 전자상품권 재고현황.
# Date :2025-06-19
# Author : 권맑음
################################################################################*/ -->
<template>
  <div class="flex h-full min-h-0 flex-col pl-5" @click="handleParentClick">
    <div
      class="flex w-full shrink-0 items-center justify-between overflow-y-hidden">
      <PageName></PageName>
      <div class="mr-9 flex justify-center space-x-2 pr-5">
        <button type="button" class="button search md:w-auto w-14" @click="searchButton">
          조회
        </button>
        <button type="button" class="button save w-auto excel" @click="excelButton">
          엑셀
        </button>
      </div>
    </div>

    <div
      class="crm6505-search-panel z-10 mt-3 w-full min-h-0 shrink-0 overflow-visible rounded-lg bg-gray-200"
      :style="{
        '--crm6505-control-border': crm6505ControlBorder,
        '--crm6505-col-gap': crm6505ColGutter,
        '--crm6505-item-gap': crm6505ItemGap,
        '--crm6505-label-col': crm6505LabelCol,
        '--crm6505-panel-pad-x': crm6505PanelPadX,
        '--crm6505-control-h': crm6505ControlH,
        '--crm6505-row-min-h': crm6505RowMinH,
      }">
      <!-- 조회기간 | 상품권선택 -->
      <div class="crm6505-search-grid min-w-0">
        <div class="crm6505-edge" aria-hidden="true"></div>
        <div class="crm6505-cell crm6505-cell--date">
          <div class="crm6505-lbl">조회기간</div>
          <div class="crm6505-field crm6505-date-slot min-w-0">
            <Datepicker2
              ref="datepicker"
              :main-name="'조회 기간'"
              omit-main-label
              filter-bar-align
              :close-pop-up="closePopUp"
              @excel-date="excelDate"
              @start-date="startDate"
              @end-date="endDate"></Datepicker2>
          </div>
        </div>
        <div class="crm6505-gutter" aria-hidden="true"></div>
        <div class="crm6505-cell">
          <div class="crm6505-lbl">조회 상품권 선택</div>
          <div class="crm6505-field min-w-0">
            <button
              type="button"
              class="pnc-sub-btn"
              :class="{ 'crm6505-gft-btn--blink': giftSelectBlink }"
              @click="visible = true">
              <svg
                class="pnc-sub-btn__icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false">
                <path
                  d="M4 7h16M4 12h16M4 17h10"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round" />
              </svg>
              상품권선택
            </button>
          </div>
        </div>
        <div class="crm6505-edge" aria-hidden="true"></div>
      </div>
    </div>

    <div class="mt-2 flex min-h-0 min-w-0 flex-1 flex-col">
      <div class="relative min-h-0 w-full flex-1">
        <Realgrid
          class="h-full min-h-0 w-full"
          :progname="'CRM65_005RPT_VUE'"
          :progid="1"
          :rowData="rowData"
          :reload="reload"
          :setDynamicGrid4="true"
          :setDynamicGrid4Cond="setDynamicGrid4Cond"
          :mergeColumns3="true"
          :setFooter="true"
          :showCheckBar="false"
          :mergeColumnGroupName3="mergeColumnGroupName3"
          :mergeColumnGroupSubList3="mergeColumnGroupSubList3"
          :mergeColumnGroupName4="mergeColumnGroupName4"
          :setFooterCustomColumnId="['strStore']"
          :setFooterCustomText="['합계']"
          :documentTitle="'CRM65_005RPT'"
          :documentSubTitle="documentSubTitle"
          :rowStateeditable="false"
          :exporttoExcel="exportExcel">
        </Realgrid>
      </div>
    </div>
  </div>

  <Teleport to="body">
    <div
      v-show="visible"
      class="crm6505-popup-mask"
      @click.self="setInitCheck">
      <div class="crm6505-popup" role="dialog" aria-modal="true">
        <div class="crm6505-popup-head">
          <h2 class="crm6505-popup-title">상품권 선택</h2>
          <div class="crm6505-popup-actions">
            <button type="button" class="pnc-sub-btn" @click="setSearchCond">
              <svg
                class="pnc-sub-btn__icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false">
                <path
                  d="M5 13l4 4L19 7"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
              선택
            </button>
            <button
              type="button"
              class="pnc-sub-btn pnc-sub-btn--gray"
              @click="setInitCheck">
              <svg
                class="pnc-sub-btn__icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round" />
              </svg>
              닫기
            </button>
          </div>
        </div>

        <div class="crm6505-popup-grid">
          <Realgrid
            :progname="'CRM65_005RPT_VUE'"
            :progid="2"
            @realgridname="realgridname"
            @checkedRowData="checkedRowData"
            @checkedRowIndex="checkedRowIndex"
            :setStateBar="false"
            :initCheckRows="initCheckRows"
            :initCheckRowNow="initCheckRowNow"
            :rowData="rowData2"></Realgrid>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import {
  getGftCardStockList,
  getGftLedgerTradeAggList,
  getGftList,
} from "@/api/micrm";
import Datepicker2 from "@/components/Datepicker2.vue";
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

import { insertPageLog } from "@/customFunc/customFunc";
import RealGrid from "realgrid";
/**
 *  경고창 호출 라이브러리
 *  */

import Swal from "sweetalert2";
/*
 * 공통 표준  Function
 */

import { onMounted, ref, watch } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";

const store = useStore();
const crm6505ControlBorder = "#cbd5e1";
const crm6505ColGutter = "1.5rem";
const crm6505ItemGap = "0.75rem";
const crm6505LabelCol = "5.5rem";
const crm6505PanelPadX = "7rem";
const crm6505ControlH = "2rem";
const crm6505RowMinH = "2rem";

/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getGftList(store.state.userData.lngStoreGroup);

  rowData2.value = res.data.List;
});

const reload = ref(false);
const rowData = ref([]);
const rowData2 = ref([]);
const afterSearch = ref(false);
const selectedCond = ref(0);
const condValue = ref(0);
const cond = ref([]);
const cond2 = ref(0);
const cond3 = ref(0);
const visible = ref(false);
const optionList = ref([]);
const optionList2 = ref([]);
const optionList3 = ref([]);
const datepicker = ref(null);
const closePopUp = ref(false);
const custId = ref("");
const initCheckRowNow = ref(false);
const checkedRows = ref([]);
const checkedRowData = (e) => {
  checkedRows.value = e;
};

const checkedIndex = ref([]);
const savedcheckedIndex = ref([]);
const checkedRowIndex = (e) => {
  ////console.log(e);
  checkedIndex.value = e;
};

const initCheckRows = ref([]);
const setDynamicGrid4Cond = ref(0);
const giftSelectBlink = ref(false);
const setSearchCond = () => {
  initGrid();
  cond.value = checkedRows.value;
  ////console.log(cond.value);
  savedcheckedIndex.value = checkedIndex.value;

  mergeColumnGroupName4.value = [
    "상품권 구분",
    ...cond.value.map((item) => item.strGftType),
  ];

  for (let i = 0; i < cond.value.length; i++) {
    const group = [];
    for (let j = 1 + i * 7; j <= 7 + i * 7; j++) {
      group.push(`column${j}`);
    }
    mergeColumnGroupSubList3.value.push([group]); // 대괄호 한 번 더 감싸는 거 잊지 마
  }
  mergeColumnGroupName3.value = [[""]];
  mergeColumnGroupSubList3.value.push([`column${cond.value.length * 7 + 1}`]);
  for (let i = 1; i <= cond.value.length + 1; i++) {
    const group = ["", "", "출고", "출고", " ", " ", " "];
    mergeColumnGroupName3.value.push(group);
  }
  mergeColumnGroupName3.value.push(["합계"]);

  setDynamicGrid4Cond.value = cond.value.length;
  if (cond.value.length > 0) {
    giftSelectBlink.value = false;
  }
  reload.value = !reload.value;
  visible.value = false;
};

const setInitCheck = () => {
  cond.value = rowData2.value.filter((item, index) =>
    savedcheckedIndex.value.includes(index)
  );
  ////console.log(cond.value);
  initCheckRows.value = savedcheckedIndex.value;
  initCheckRowNow.value = !initCheckRowNow.value;
  visible.value = false;
};
const mergeColumnGroupName4 = ref(["상품권구분"]);
const mergeColumnGroupName3 = ref([[""]]);
const mergeColumnGroupSubList3 = ref([[["strStore"]]]);
const gridName = ref("");
const realgridname = (e) => {
  gridName.value = e;
  ////console.log(e);
};

watch(visible, () => {
  const reagrid2 = document.getElementById(gridName.value);
  if (reagrid2) {
    setTimeout(() => {
      RealGrid.getGridInstance(reagrid2).resetSize();
      RealGrid.getGridInstance(reagrid2).refresh(true);
    }, 10);
  }
});
const custNm = ref("");
const strSaleCustName = (e) => {
  custNm.value = e;
};
const sd = ref("");
const groupCd = ref("");
const ed = ref("");
const storeCds = ref("");
const selectedDate = ref("");
const startDate = (e) => {
  sd.value = e;
};
const endDate = (e) => {
  ed.value = e;
};
const lngStoreGroup = (e) => {
  groupCd.value = e;
};
const lngStoreCodes = (e) => {
  storeCds.value = e;
};

const excelDate = (e) => {
  selectedDate.value = e;
};
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

/**
 *  조회 함수
 */

const hideColumnsId = ref(["strStoreName"]);
const searchButton = async () => {
  if (sd.value == null || ed.value == null) {
    Swal.fire({
      title: "경고",
      text: "일자을 선택하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  if (!Array.isArray(cond.value) || cond.value.length === 0) {
    giftSelectBlink.value = true;
    Swal.fire({
      title: "안내",
      text: "먼저 상품권을 선택해 주세요.",
      icon: "info",
      confirmButtonText: "확인",
    });
    return;
  }

  try {
    store.state.loading = true;
    initGrid();
    ////console.log(cond.value.map((item) => item.lngGftType + "|"));
    const res = await getGftCardStockList(
      store.state.userData.lngStoreGroup,
      0,
      sd.value,
      ed.value,
      cond.value.map((item) => item.lngGftType).join("|")
    );
    ////console.log(res);
    rowData.value = res.data.List;

    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    ////console.log(error);
  } finally {
    store.state.loading = false;
  }
};

/* 매장 컴포넌트 관련 함수 */
const selectedGroup = ref();
const selectedStores = ref();
const selectedStoreAttrs = ref();

/**
 * 페이지 매장 코드 세팅
 */

const lngStoreCode = async (e) => {
  initGrid();
  selectedStores.value = e;
  ////console.log(e);
};

/**
 * 그리드 초기화
 */

const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
};

//엑셀 버튼 처리 함수
const exportExcel = ref(false);
/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  documentSubTitle.value = selectedDate.value;

  exportExcel.value = !exportExcel.value;
};

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
const excelList = (e) => {
  selectedExcelList.value = e;
  //comsole.log(e);
};
</script>

<style scoped>
.crm6505-search-panel {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  padding-block: 0.75rem;
  padding-inline: 0;
  overflow-x: visible;
}

.crm6505-search-grid {
  box-sizing: border-box;
  display: grid;
  width: 100%;
  min-width: 0;
  align-items: center;
  column-gap: 0;
  grid-template-columns:
    var(--crm6505-panel-pad-x)
    max-content
    minmax(var(--crm6505-col-gap), 1fr)
    max-content
    var(--crm6505-panel-pad-x);
}

.crm6505-edge,
.crm6505-gutter {
  min-width: 0;
  pointer-events: none;
}

.crm6505-cell {
  box-sizing: border-box;
  display: grid;
  width: max-content;
  max-width: 100%;
  min-width: 0;
  min-height: var(--crm6505-row-min-h);
  grid-template-columns: max-content max-content;
  column-gap: var(--crm6505-item-gap);
  align-items: center;
}

.crm6505-lbl {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: max-content;
  min-height: var(--crm6505-row-min-h);
  font-size: 0.9375rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
  white-space: nowrap;
}

.crm6505-field {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  width: max-content;
  max-width: 100%;
  min-width: 0;
  min-height: var(--crm6505-row-min-h);
}

.crm6505-date-slot :deep(> div.flex.justify-start.items-center) {
  margin: 0 !important;
  width: max-content !important;
  max-width: 100%;
  min-height: var(--crm6505-row-min-h);
  align-items: center;
}

.crm6505-date-slot :deep(input[type="date"]) {
  box-sizing: border-box;
  height: var(--crm6505-control-h);
  min-height: var(--crm6505-control-h);
  max-height: var(--crm6505-control-h);
  border: 1px solid var(--crm6505-control-border, #cbd5e1);
  border-radius: 0.375rem;
  background: #fff;
}

.crm6505-date-slot :deep(input[type="date"]:focus) {
  border-color: #3b82f6;
}

.crm6505-date-slot :deep(div.inline-flex.h-8),
.crm6505-date-slot :deep(button) {
  height: var(--crm6505-control-h) !important;
  min-height: var(--crm6505-control-h) !important;
}

.crm6505-popup-mask {
  position: fixed;
  inset: 0;
  z-index: 10050;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(0 0 0 / 0.45);
}

.crm6505-popup {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: min(44rem, 94vw);
  height: min(32rem, 80vh);
  padding: 1rem 1.25rem 1.25rem;
  border-radius: 0.75rem;
  background: #fff;
  box-shadow: 0 12px 28px rgb(15 23 42 / 0.18);
  overflow: hidden;
}

.crm6505-popup-head {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.crm6505-popup-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.25rem;
  color: #111827;
}

.crm6505-popup-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.crm6505-popup-grid {
  position: relative;
  flex: 1 1 auto;
  min-height: 0;
  min-width: 0;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
}

@media (max-width: 1100px) {
  .crm6505-search-panel {
    --crm6505-panel-pad-x: 2rem;
  }

  .crm6505-search-grid {
    grid-template-columns: minmax(0, 1fr);
    justify-content: stretch;
    row-gap: 0.75rem;
    padding-left: var(--crm6505-panel-pad-x);
    padding-right: var(--crm6505-panel-pad-x);
  }

  .crm6505-edge,
  .crm6505-gutter {
    display: none;
  }

  .crm6505-cell {
    width: 100%;
    max-width: 100%;
    grid-template-columns: max-content minmax(0, 1fr);
  }

  .crm6505-field {
    width: 100%;
    max-width: 100%;
  }

  .crm6505-date-slot :deep(> div.flex.justify-start.items-center) {
    width: 100% !important;
  }
}

@keyframes crm6505-gft-btn-blink {
  0%,
  100% {
    opacity: 1;
    border-color: #fca5a5;
    box-shadow: 0 0 0 0 rgb(248 113 113 / 0.55);
  }
  50% {
    opacity: 0.88;
    border-color: #dc2626;
    box-shadow: 0 0 0 0.35rem rgb(248 113 113 / 0.35);
  }
}

.crm6505-gft-btn--blink {
  border-color: #f87171;
  animation: crm6505-gft-btn-blink 1.1s ease-in-out infinite;
}
</style>
