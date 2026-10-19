<!-- /*--############################################################################
# Filename : PUR03_037RPT.vue                                                  
# Description : 구매관리2 > 발주 관리 > 발주서 발행(파트별)                     
# Date :2025-08-26                                                             
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <!-- 조회조건 -->
  <!-- pl-5: 셸 w-right가 pl0이라 그리드가 좌측 메뉴에 붙음 → 우측 pd20과 맞춤 -->
  <div class="h-full pl-5" @click="handleParentClick">
    <div class="flex justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center space-x-2 pr-5">
        <button @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <button @click="excelButton" class="button w-auto excel">엑셀</button>
        <button @click="printButton" class="button print w-auto">인쇄</button>
      </div>
    </div>
    <div
      class="pur037-search-panel z-10 mt-3 w-full min-w-0 shrink-0 rounded-lg bg-gray-200"
      :style="{
        '--pur037-control-border': pur037ControlBorder,
        '--pur037-item-gap': pur037ItemGap,
        '--pur037-col-gap': pur037ColGap,
        '--pur037-panel-pad-x': pur037PanelPadX,
      }">
      <div class="pur037-search-grid min-w-0">
        <div class="pur037-cell">
          <div class="pur037-sg-label">입고예정일자</div>
          <div class="pur037-cell-field pur037-date-slot min-w-0">
            <Datepicker1
              ref="datepicker"
              :mainName="'입고예정일자'"
              :initToday="1"
              :closePopUp="closePopUp"
              @excelDate="excelDate"
              @dateValue="dateValue" />
          </div>
        </div>
        <div class="pur037-cell">
          <div class="pur037-sg-label">매장명</div>
          <div class="pur037-cell-field pur037-pick-slot min-w-0">
            <PickStore
              compact-search-bar
              :compact-store-combo-max-rem="pur037PickStoreComboMaxRem"
              :store-dropdown-min-width-rem="pur037StoreDropdownMinRem"
              main-name=""
              @update:storeGroup="lngStoreGroup"
              :defaultStoreNm="'전체'"
              @storeNm="excelStore"
              :hideGroup="false"
              :hideAttr="false"
              :defaultStoreType2="true"
              :defaultStore="true"
              @update:storeCd="lngStoreCode" />
          </div>
        </div>
        <div class="pur037-cell">
          <div class="pur037-sg-label">거래처</div>
          <div class="pur037-cell-field pur037-bc-slot min-w-0">
            <BusinessClient
              compact-search-bar
              :disable="supplierComboDisabled"
              :select-supplier-id="supplierComboPresetId"
              :select-supplier-label="supplierSessionDisplayName"
              @SupplierId="SupplierId" />
          </div>
        </div>
        <div class="pur037-cell">
          <div class="pur037-sg-label">파트</div>
          <div class="pur037-cell-field min-w-0">
            <select
              id="pur03-037-cond-part"
              v-model="cond"
              class="pur037-part-select w-full min-w-0 rounded-md border border-solid bg-white text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option
                v-for="i in optionList"
                :key="i.lngPartCode"
                :value="i.lngPartCode">
                {{ i.strPartName }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- 조회조건 -->
    <!-- 그리드 영역 — 발주등록(80%) 대비 조금 넓게 -->
    <div class="w-full h-[85%]">
      <Realgrid
        :progname="'PUR03_037RPT_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :setNumberformatColumn="'lngOrderQty'"
        :setStateBar="false"
        :setFooter="true"
        :setFooterColID="setFooterColID"
        :setFooterExpressions="setFooterExpressions"
        :setFooterCustomColumnId="setFooterCustomColumnId"
        :setFooterCustomText="setFooterCustomText"
        :setGroupFooter="true"
        :setGroupColumnId="'strStoreName'"
        :setGroupFooterColID="setGroupFooterColID"
        :setGroupFooterExpressions="setGroupFooterExpressions"
        :setGroupSumCustomColumnId="setGroupSumCustomColumnId"
        :setGroupSumCustomText="setGroupSumCustomText"
        :setGroupSumCustomColumnId2="setGroupSumCustomColumnId2"
        :setMergeMode="false"
        :documentTitle="'PUR03_037RPT'"
        :selectionStyle="'singleRow'"
        @clickedRowData="clickedRowData"
        :documentSubTitle="documentSubTitle"
        :rowStateeditable="false"
        @clickedButtonCol="clickedButtonCol"
        @checkedRowData="checkedRowData"
        :checkRowAuto="false"
        :checkRowAuto2="true"
        :checkRenderEditable="true"
        :exporttoExcel="exportExcel">
      </Realgrid>
    </div>
  </div>

  <Teleport to="body">
    <div
      v-if="openPopUp"
      class="pur037-popup-backdrop"
      @click.self.prevent>
      <div
        class="pur037-popup-dialog"
        :style="detailDialogStyle"
        role="dialog"
        aria-modal="true"
        @click.stop>
        <div
          class="pur037-popup-head pur037-popup-head--drag"
          @pointerdown="onDetailDragStart">
          <h2 class="pur037-popup-title">발주서 조회</h2>
          <div class="pur037-popup-actions">
            <button
              type="button"
              class="pur037-sub-btn pur037-sub-btn--icon pur037-sub-btn--excel"
              @click.stop="excelButton2">
              엑셀
            </button>
            <button
              type="button"
              class="pur037-sub-btn pur037-sub-btn--icon pur037-sub-btn--close"
              @click.stop="openPopUp = false">
              닫기
            </button>
          </div>
        </div>
        <div
          class="pur037-popup-fields"
          :style="{ '--pur037-popup-border': pur037ControlBorder }">
          <div class="pur037-popup-field-grid">
            <div class="pur037-popup-label">
              <div class="pur037-popup-label-inner">매장명</div>
            </div>
            <div class="pur037-popup-cell">
              <input
                type="text"
                class="pur037-popup-input"
                disabled
                v-model="forPopupOrderStoreNM" />
            </div>
            <div class="pur037-popup-label">
              <div class="pur037-popup-label-inner">발주번호</div>
            </div>
            <div class="pur037-popup-cell">
              <input
                type="text"
                class="pur037-popup-input"
                disabled
                v-model="forPopupOrderNo" />
            </div>
            <div class="pur037-popup-label">
              <div class="pur037-popup-label-inner">파트명</div>
            </div>
            <div class="pur037-popup-cell pur037-popup-cell--part">
              <select class="pur037-popup-input" disabled v-model="scond">
                <option
                  v-for="i in optionList"
                  :key="i.lngPartCode"
                  :value="i.lngPartCode">
                  {{ i.strPartName }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div ref="popupGridWrapRef" class="pur037-popup-grid-wrap">
          <Realgrid
            class="h-full min-h-0 w-full"
            :progname="'PUR03_016RPT_01POP_VUE'"
            :progid="1"
            :documentTitle="'PUR03_037RPT'"
            :rowStateeditable="false"
            :selectionStyle="'singleRow'"
            :fit-all-columns="true"
            :setNumberformatColumn="'dblOrderQty'"
            @realgridname="onPopupGridName"
            :setFooter="true"
            :setFooterColID="setFooterColID2"
            :setFooterExpressions="setFooterExpressions2"
            :setFooterCustomColumnId="setFooterCustomColumnId2"
            :setFooterCustomText="setFooterCustomText2"
            :exporttoExcel="exportExcel2"
            :documentSubTitle="documentSubTitle2"
            :rowData="rowData2"></Realgrid>
        </div>
        <div
          class="pur037-popup-resize"
          aria-hidden="true"
          @pointerdown.stop="onDetailResizeStart"></div>
      </div>
    </div>
  </Teleport>
  <!-- 그리드 영역 -->

  <ReportPrintShell
    v-model:open="printPreviewOpen"
    title="발주서 인쇄 미리보기"
    :pages="printPages"
    :loading="printLoading">
    <template #page="{ page }">
      <PurchaseOrderPrintSheet :page="page" />
    </template>
  </ReportPrintShell>
</template>

<script setup>
import {
  getOrderInfoDetail,
  getPurchaseOrderList,
  getPurchaseOrderListByPart,
} from "@/api/mipur";
import { getLossMasterPartList } from "@/api/mistock";
import BusinessClient from "@/components/businessClient2.vue";
import ReportPrintShell from "@/components/reportPrint/ReportPrintShell.vue";
import { loadPurchaseOrderPrintPages } from "@/components/reportPrint/loadPurchaseOrderPrintPages";
import PurchaseOrderPrintSheet from "@/components/reportPrint/sheets/PurchaseOrderPrintSheet.vue";
import Datepicker1 from "@/components/Datepicker1.vue";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
import PickStore from "@/components/pickStore.vue";
/**
 * 	매장 단일 선택 컴포넌트
 */
/**
 * 	그리드 생성
 */

import Realgrid from "@/components/realgrid.vue";
import { rgGetInstance } from "@/components/realgridInstanceRegistry.js";
/**
 *  페이지로그 자동 입력
 *  */

import { insertPageLog } from "@/customFunc/customFunc";
import Swal from "sweetalert2";
/**
 *  경고창 호출 라이브러리
 *  */

/*
 * 공통 표준  Function
 */

import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";
/**
 * 	화면 Load시 실행 스크립트
 */

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

// 그룹 푸터 합계를 표시할 컬럼 설정
// 필요한 컬럼 ID를 배열에 추가하고, 각 컬럼에 대한 표현식(sum, avg, count 등)을 지정하세요
const setGroupFooterColID = ref([
  "lngOrderQty",
  "curSupply",
  "curTax",
  "curTotalCost" 
]);
const setGroupFooterExpressions = ref([
  "sum",
  "sum",
  "sum",
  "sum", 
]);

// 전체 푸터(총계) 합계 설정
const setFooterColID = ref([
  "lngOrderQty",
  "curSupply",
  "curTax",
  "curTotalCost",
]);
const setFooterExpressions = ref(["sum", "sum", "sum", "sum"]);
const setFooterCustomColumnId = ref(["strStoreName"]);
const setFooterCustomText = ref(["총계"]);

// 팝업 그리드(발주서 조회) 전체 푸터(총계) 합계 설정
const setFooterColID2 = ref([
  "dblOrderQty",
  "curSupply",
  "curTax",
  "curTotal",
]);
const setFooterExpressions2 = ref(["sum", "sum", "sum", "sum"]);
const setFooterCustomColumnId2 = ref(["strStoreName"]);
const setFooterCustomText2 = ref(["총계"]);

// 그룹 푸터에 표시할 커스텀 텍스트 설정
const setGroupSumCustomColumnId = ref(["strStoreName"]);
const setGroupSumCustomText = ref(["소계"]);

// 그룹 푸터에 "소계" 텍스트를 표시할 컬럼 설정 (setGroupSumCustomColumnId2 사용)
const setGroupSumCustomColumnId2 = ref(["strStoreName"]);

const cond = ref("0");

const store = useStore();

/** 거래처 계정(lngUserAdminID === 60): 세션 `lngSupplierID` 고정 + 콤보 비활성 */
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

/** 조회줄 컨트롤 공통 테두리(search-area-layout) */
const pur037ControlBorder = "#cbd5e1";
/** compact 매장 v-select가 칸 폭을 채우도록 기본 12rem 상한 해제 */
const pur037PickStoreComboMaxRem = 96;
/** 매장 드롭다운 목록 최소 너비(rem) — 긴 매장명 잘림 방지 */
const pur037StoreDropdownMinRem = 22;
/** 라벨↔필드 간격 */
const pur037ItemGap = "1rem";
/** 항목(4블록) 사이 간격 — 앞뒤 여유 */
const pur037ColGap = "1.75rem";
/** 회색 AREA 좌·우 inset 동일 (내용·매장명 폭 확보) */
const pur037PanelPadX = "2.5rem";

const datepicker = ref(null);
const closePopUp = ref(false);
const optionList = ref([]);
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

const sDate = ref();
const eDate = ref();
const dateValue = (e) => {
  initGrid();
  sDate.value = e;
  ////console.log(e);
};

const selectedDate = ref();
const excelDate = (e) => {
  selectedDate.value = e;
};

const storeCode = ref();
const lngStoreCode = async (e) => {
  initGrid();
  storeCode.value = e;

  const res2 = await getLossMasterPartList(
    store.state.userData.lngStoreGroup,
    storeCode.value
  );

  optionList.value = res2.data.List;
};

const groupCd = ref();
const lngStoreGroup = (e) => {
  groupCd.value = e;
};

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

onMounted(async () => {
  await insertPageLog(store.state.activeTab2);
  if (isSupplierPortal.value) {
    const sid = store.getters.sessionLngSupplierID;
    if (sid != null && sid > 0) {
      supplierid.value = String(sid);
    }
  }
});
/**
 *  조회 함수
 */
const hideColumnsId = ref([]);
const searchButton = async () => {
  try {
    store.state.loading = true;
    initGrid();

    const res = await getPurchaseOrderListByPart(
      groupCd.value,
      storeCode.value,
      cond.value,
      String(sDate.value ?? "").replaceAll("-", ""),
      supplierid.value
    );

    rowData.value = res.data.List;
    //console.log(res);
    // 디버깅: 실제 데이터 구조 확인
    if (res.data.List && res.data.List.length > 0) {
      console.log("그리드 컬럼 확인:", Object.keys(res.data.List[0]));
    }
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

const progid = ref(1);
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
  documentSubTitle.value =
    selectedDate.value + "\n" + "매장명 :" + selectedExcelStore.value;
  exportExcel.value = !exportExcel.value;
};

const documentSubTitle2 = ref("");
const exportExcel2 = ref(false);
const excelButton2 = () => {
  documentSubTitle2.value =
    "매장명 :" +
    forPopupOrderStoreNM.value +
    "\n" +
    "발주번호 :" +
    forPopupOrderNo.value +
    "\n" +
    "파트명 : " +
    // optionList.value.filter((item) => item.lngPartCode == cond.value)[0].strPartName;
    forPopupPartNM.value
  exportExcel2.value = !exportExcel2.value;
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

const openPopUp = ref(false);

const DETAIL_W0 = () => Math.max(720, Math.min(window.innerWidth * 0.96, window.innerWidth - 24));
const DETAIL_H0 = () => Math.max(420, Math.min(window.innerHeight * 0.82, window.innerHeight - 24));
const DETAIL_MIN_W = 560;
const DETAIL_MIN_H = 360;
const detailBox = ref({ left: 12, top: 12, w: 720, h: 420 });
const detailDialogStyle = computed(() => ({
  left: `${detailBox.value.left}px`,
  top: `${detailBox.value.top}px`,
  width: `${detailBox.value.w}px`,
  height: `${detailBox.value.h}px`,
}));

const resetDetailBox = () => {
  const w = DETAIL_W0();
  const h = DETAIL_H0();
  detailBox.value = {
    left: 12,
    top: 12,
    w,
    h,
  };
};

const popupGridName = ref("");
const popupGridWrapRef = ref(null);
let popupGridResizeObs = null;

const resetPopupGridSize = () => {
  const name = popupGridName.value;
  if (!name) return;
  const el = document.getElementById(name);
  if (!el || el.clientWidth < 16 || el.clientHeight < 16) return;
  const gv = rgGetInstance(name)?.gridView;
  if (!gv) return;
  try {
    gv.resetSize();
  } catch (_) {}
};

const onPopupGridName = (name) => {
  if (typeof name === "string" && name) popupGridName.value = name;
};

const unbindPopupGridResize = () => {
  if (!popupGridResizeObs) return;
  popupGridResizeObs.disconnect();
  popupGridResizeObs = null;
};

const bindPopupGridResize = () => {
  unbindPopupGridResize();
  const el = popupGridWrapRef.value;
  if (!el || typeof ResizeObserver === "undefined") return;
  popupGridResizeObs = new ResizeObserver(() => {
    requestAnimationFrame(() => resetPopupGridSize());
  });
  popupGridResizeObs.observe(el);
};

watch(openPopUp, async (v) => {
  if (!v) {
    unbindPopupGridResize();
    return;
  }
  resetDetailBox();
  await nextTick();
  bindPopupGridResize();
  requestAnimationFrame(() => {
    requestAnimationFrame(() => resetPopupGridSize());
  });
});

let detailDrag = null;
const onDetailDragStart = (e) => {
  if (e.button !== 0) return;
  if (e.target.closest("button")) return;
  e.preventDefault();
  detailDrag = {
    kind: "move",
    x: e.clientX,
    y: e.clientY,
    left: detailBox.value.left,
    top: detailBox.value.top,
  };
  window.addEventListener("pointermove", onDetailPointerMove);
  window.addEventListener("pointerup", onDetailPointerUp);
};

const onDetailResizeStart = (e) => {
  if (e.button !== 0) return;
  e.preventDefault();
  detailDrag = {
    kind: "resize",
    x: e.clientX,
    y: e.clientY,
    w: detailBox.value.w,
    h: detailBox.value.h,
  };
  window.addEventListener("pointermove", onDetailPointerMove);
  window.addEventListener("pointerup", onDetailPointerUp);
};

const onDetailPointerMove = (e) => {
  if (!detailDrag) return;
  const dx = e.clientX - detailDrag.x;
  const dy = e.clientY - detailDrag.y;
  if (detailDrag.kind === "move") {
    detailBox.value = {
      ...detailBox.value,
      left: Math.min(window.innerWidth - 80, Math.max(0, detailDrag.left + dx)),
      top: Math.min(window.innerHeight - 48, Math.max(0, detailDrag.top + dy)),
    };
    return;
  }
  detailBox.value = {
    ...detailBox.value,
    w: Math.min(
      window.innerWidth - detailBox.value.left,
      Math.max(DETAIL_MIN_W, detailDrag.w + dx)
    ),
    h: Math.min(
      window.innerHeight - detailBox.value.top,
      Math.max(DETAIL_MIN_H, detailDrag.h + dy)
    ),
  };
};

const onDetailPointerUp = () => {
  detailDrag = null;
  window.removeEventListener("pointermove", onDetailPointerMove);
  window.removeEventListener("pointerup", onDetailPointerUp);
  requestAnimationFrame(() => resetPopupGridSize());
};

onUnmounted(() => {
  unbindPopupGridResize();
  onDetailPointerUp();
});

const clickedButtonCol = async (e) => {
  //   //console.log(e);
  //   //console.log(forPopupOrderNo.value);

  if (e == "strOrderNo") {
    const res = await getOrderInfoDetail(
      groupCd.value,
      forPopupOrderStoreCd.value,
      forPopupOrderNo.value
    );

    console.log(res);
    // 팝업 그리드 합계 마스킹(콤마 등) 적용을 위해 합계 대상 필드를 숫자로 보정
    rowData2.value = (res.data.List ?? []).map((row) => {
      const toNum = (v) => {
        if (v === null || v === undefined || v === "") return 0;
        if (typeof v === "number") return v;
        const n = Number(String(v).replaceAll(",", ""));
        return isNaN(n) ? 0 : n;
      };
      return {
        ...row,
        dblOrderQty: toNum(row.dblOrderQty),
        curSupply: toNum(row.curSupply),
        curTax: toNum(row.curTax),
        curTotal: toNum(row.curTotal),
      };
    });
    openPopUp.value = true;
  }
};
const rowData2 = ref([]);
const forPopupOrderStoreCd = ref("");
const forPopupOrderStoreNM = ref("");
const forPopupOrderNo = ref("");
const forPopupPartNM = ref("");

const scond = ref("");
const clickedRowData = (e) => {
  scond.value = e[3];
  forPopupOrderStoreCd.value = e[1];
  forPopupPartNM.value = e[4];
  forPopupOrderStoreNM.value = e[2];
  forPopupOrderNo.value = e[7];  
};

const checkedrowdata = ref([]);
const checkedRowData = (e) => {
  checkedrowdata.value = e;

  //console.log(e);
};

const printPreviewOpen = ref(false);
const printLoading = ref(false);
const printPages = ref([]);

const printButton = async () => {
  if (checkedrowdata.value.length == 0) {
    Swal.fire({
      title: "경고",
      text: "선택한 전표가 존재하지 않습니다.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }

  printPreviewOpen.value = true;
  printLoading.value = true;
  printPages.value = [];
  try {
    printPages.value = await loadPurchaseOrderPrintPages(
      groupCd.value,
      checkedrowdata.value,
      {
        storeCd: storeCode.value,
        orderDate: String(sDate.value ?? "").replaceAll("-", ""),
        flag: "1",
      }
    );
    if (!printPages.value.length) {
      printPreviewOpen.value = false;
      await Swal.fire({
        title: "경고",
        text: "출력할 발주서 상세를 불러오지 못했습니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
    }
  } catch (e) {
    console.error("[PUR03_037RPT] printButton", e);
    printPreviewOpen.value = false;
    await Swal.fire({
      title: "오류",
      text: "발주서 인쇄 데이터를 불러오는 중 오류가 발생했습니다.",
      icon: "error",
      confirmButtonText: "확인",
    });
  } finally {
    printLoading.value = false;
  }
};

</script>

<style scoped>
/*
 * 조회 AREA — layout-equal-spacing / search-area-symmetric-inset / search-area-alignment
 * 시작=끝 inset, 4열 반응형(매장 비중↑), 행·컨트롤 높이 2rem
 */
.pur037-search-panel {
  box-sizing: border-box;
  padding-left: 0;
  padding-right: 0;
  padding-block: 0.75rem;
  /* 기본은 반응형 축소 — overflow는 최후 수단 */
  overflow-x: auto;
}

.pur037-search-grid {
  --pur037-label-col: 6.5rem;
  --pur037-row-min-h: 2rem;
  --pur037-control-h: 2rem;
  display: grid;
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  align-items: center;
  /* 일자: 라벨6.5+간격+YYYY-MM-DD / 파트도 최소폭 확보 */
  grid-template-columns:
    minmax(18rem, 1.2fr)
    minmax(16rem, 1.4fr)
    minmax(14rem, 1.25fr)
    minmax(15rem, 1.1fr);
  column-gap: var(--pur037-col-gap);
  padding-left: var(--pur037-panel-pad-x);
  padding-right: var(--pur037-panel-pad-x);
}

.pur037-cell {
  display: flex;
  min-width: 0;
  min-height: var(--pur037-row-min-h);
  align-items: center;
  gap: var(--pur037-item-gap);
}

.pur037-sg-label {
  flex: 0 0 var(--pur037-label-col);
  width: var(--pur037-label-col);
  min-height: var(--pur037-row-min-h);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
}

.pur037-cell-field {
  min-width: 0;
  min-height: var(--pur037-row-min-h);
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  width: 100%;
}

/* 라벨 제외 나머지 칸을 컨트롤이 가득 채움 → 칸마다 L/R 빈 여백 균형 */
.pur037-cell-field > * {
  min-width: 0;
  width: 100%;
}

.pur037-search-grid select.pur037-part-select {
  box-sizing: border-box;
  height: var(--pur037-control-h);
  min-height: var(--pur037-control-h);
  max-height: var(--pur037-control-h);
  min-width: 7.5rem;
  border: 1px solid var(--pur037-control-border) !important;
}

.pur037-search-grid select.pur037-part-select:focus {
  border-color: #3b82f6 !important;
}

.pur037-search-grid .pur037-pick-slot :deep(select) {
  box-sizing: border-box;
  height: var(--pur037-control-h) !important;
  min-height: var(--pur037-control-h) !important;
  max-height: var(--pur037-control-h) !important;
  border: 1px solid var(--pur037-control-border) !important;
}

.pur037-search-grid .pur037-pick-slot :deep(select:focus) {
  border-color: #3b82f6 !important;
}

.pur037-search-grid .pur037-pick-slot :deep(.pickstore-vs-shell),
.pur037-search-grid .pur037-bc-slot :deep(.pickstore-vs-shell) {
  box-sizing: border-box;
  height: var(--pur037-control-h) !important;
  min-height: var(--pur037-control-h) !important;
  max-height: var(--pur037-control-h) !important;
  border: 1px solid var(--pur037-control-border) !important;
  overflow: hidden !important;
  position: relative !important;
}

.pur037-search-grid .pur037-pick-slot :deep(.style-chooser),
.pur037-search-grid .pur037-bc-slot :deep(.style-chooser) {
  width: 100% !important;
  height: 100% !important;
}

.pur037-search-grid .pur037-pick-slot :deep(.vs__dropdown-toggle),
.pur037-search-grid .pur037-bc-slot :deep(.vs__dropdown-toggle) {
  box-sizing: border-box;
  min-height: var(--pur037-control-h) !important;
  height: var(--pur037-control-h) !important;
  max-height: var(--pur037-control-h) !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  padding-left: 0.5rem !important;
  padding-right: 0.25rem !important;
  display: flex !important;
  align-items: center !important;
  flex-wrap: nowrap !important;
}

/* 전역 position:absolute 유지 + 세로만 가운데 (static으로 바꾸면 텍스트/화살표 레이아웃 붕괴) */
.pur037-search-grid .pur037-pick-slot :deep(.vs__selected-options),
.pur037-search-grid .pur037-bc-slot :deep(.vs__selected-options) {
  flex: 1 1 auto !important;
  min-width: 0 !important;
  position: relative !important;
  height: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
  overflow: hidden !important;
}

.pur037-search-grid .pur037-pick-slot :deep(.vs__selected),
.pur037-search-grid .pur037-bc-slot :deep(.vs__selected) {
  position: absolute !important;
  left: 0 !important;
  right: 1.5rem !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  margin: 0 !important;
  padding: 0 !important;
  height: auto !important;
  max-height: none !important;
  width: auto !important;
  max-width: 100% !important;
  line-height: 1.25 !important;
  font-size: 0.875rem !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  display: block !important;
  background: transparent !important;
}

.pur037-search-grid .pur037-pick-slot :deep(.vs__search),
.pur037-search-grid .pur037-bc-slot :deep(.vs__search) {
  margin: 0 !important;
  padding: 0 !important;
  height: calc(var(--pur037-control-h) - 2px) !important;
  line-height: calc(var(--pur037-control-h) - 2px) !important;
  font-size: 0.875rem !important;
}

.pur037-search-grid .pur037-pick-slot :deep(.vs__actions),
.pur037-search-grid .pur037-bc-slot :deep(.vs__actions) {
  display: flex !important;
  align-items: center !important;
  padding: 0 2px 0 0 !important;
  flex-shrink: 0 !important;
  margin-left: auto !important;
}

/* Datepicker2 filterBarAlign 과 동일 높이 2rem — YYYY-MM-DD 잘리지 않게 최소폭 */
.pur037-search-grid .pur037-date-slot :deep(input[type="date"]) {
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  min-width: 10.5rem;
  height: var(--pur037-control-h);
  min-height: var(--pur037-control-h);
  max-height: var(--pur037-control-h);
  padding-left: 0.75rem;
  padding-right: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  border-radius: 0.375rem;
  border: 1px solid var(--pur037-control-border) !important;
}

.pur037-search-grid .pur037-date-slot :deep(input[type="date"]:focus) {
  border-color: #3b82f6 !important;
}

/* 그리드 바깥 라벨로 쓰므로 Datepicker1 안쪽 제목 숨김 */
.pur037-date-slot :deep(div.space-x-5 > span) {
  display: none;
}

.pur037-date-slot :deep(div.space-x-5) {
  margin-top: 0;
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;
  min-height: var(--pur037-row-min-h);
}

.pur037-bc-slot :deep(> div.flex.text-base) {
  width: 100%;
  min-width: 0;
  min-height: var(--pur037-row-min-h);
  align-items: center;
}

.pur037-pick-slot :deep(> div.flex.text-base) {
  width: 100%;
  min-width: 0;
  min-height: var(--pur037-row-min-h);
  align-items: center;
  gap: var(--pur037-item-gap) !important;
}

.pur037-pick-slot :deep(> div.flex > div:first-child) {
  display: none;
}

/* 매장그룹·속성 고정폭, 매장명 콤보가 나머지 가로 확보 */
.pur037-pick-slot :deep(.relative.min-w-0.flex-1) {
  flex: 1 1 auto !important;
  min-width: 11rem !important;
  max-width: none !important;
}
.pur037-pick-slot :deep(.pickstore-vs-shell) {
  min-width: 0;
  width: 100% !important;
  max-width: none !important;
}

.pur037-bc-slot :deep(> div.flex.items-center) {
  margin-top: 0;
}

.pur037-popup-backdrop {
  position: fixed;
  inset: 0;
  z-index: 11000;
  background: rgb(0 0 0 / 0.5);
}

.pur037-popup-dialog {
  position: fixed;
  z-index: 1;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 22.5rem;
  margin: 0;
  padding: 1.25rem 1.5rem 1.5rem;
  border-radius: 1rem;
  background: #fff;
  box-shadow: 0 20px 40px rgb(0 0 0 / 0.2);
  overflow-x: hidden;
  overflow-y: hidden;
}

.pur037-popup-head {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.pur037-popup-head--drag {
  cursor: move;
  user-select: none;
}

.pur037-popup-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: rgb(17 24 39);
}

.pur037-popup-actions {
  display: flex;
  flex-wrap: nowrap;
  flex-shrink: 0;
  align-items: center;
  gap: 0.5rem;
}

.pur037-sub-btn {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  height: 2rem;
  min-height: 2rem;
  max-height: 2rem;
  min-width: 5.75rem;
  padding: 0 0.9rem;
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1.2;
  white-space: nowrap;
  color: rgb(30 64 175);
  border: 1px solid rgb(147 197 253);
  border-radius: 0.375rem;
  background-color: rgb(239 246 255);
  box-shadow: 0 1px 2px 0 rgb(59 130 246 / 0.08);
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease;
}

.pur037-sub-btn:hover {
  background-color: rgb(219 234 254);
  border-color: rgb(96 165 250);
}

.pur037-sub-btn--icon {
  gap: 0.25rem;
}

.pur037-sub-btn--icon::before {
  content: "";
  display: block;
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  background-color: currentColor;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-position: center;
  mask-position: center;
  -webkit-mask-size: contain;
  mask-size: contain;
}

.pur037-sub-btn--excel {
  color: rgb(21 128 61);
  border-color: rgb(134 239 172);
  background-color: rgb(240 253 244);
  box-shadow: 0 1px 2px 0 rgb(22 163 74 / 0.08);
}

.pur037-sub-btn--excel:hover {
  background-color: rgb(220 252 231);
  border-color: rgb(74 222 128);
}

.pur037-sub-btn--excel::before {
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='black' d='M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9.5 14H7v-2h2.5v2zm0-3H7v-2h2.5v2zm0-3H7V9h2.5v2zm0-3H7V6h2.5v2zM17 17h-6v-2h6v2zm0-3h-6v-2h6v2zm0-3h-6V9h6v2zm0-3h-6V6h6v2z'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='black' d='M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9.5 14H7v-2h2.5v2zm0-3H7v-2h2.5v2zm0-3H7V9h2.5v2zm0-3H7V6h2.5v2zM17 17h-6v-2h6v2zm0-3h-6v-2h6v2zm0-3h-6V9h6v2zm0-3h-6V6h6v2z'/%3E%3C/svg%3E");
}

.pur037-sub-btn--close {
  color: rgb(55 65 81);
  border-color: rgb(209 213 219);
  background-color: rgb(249 250 251);
  box-shadow: 0 1px 2px 0 rgb(107 114 128 / 0.08);
}

.pur037-sub-btn--close:hover {
  background-color: rgb(243 244 246);
  border-color: rgb(156 163 175);
}

.pur037-sub-btn--close::before {
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='black' d='M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='black' d='M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'/%3E%3C/svg%3E");
}

.pur037-popup-fields {
  box-sizing: border-box;
  flex-shrink: 0;
  margin-bottom: 0.75rem;
  min-width: 0;
  padding: 0.875rem 1.25rem;
  border-radius: 0.5rem;
  background: #fff;
  overflow-x: hidden;
}

.pur037-popup-field-grid {
  display: grid;
  width: 100%;
  min-width: 0;
  align-items: center;
  column-gap: 0.75rem;
  overflow-x: hidden;
  grid-template-columns:
    minmax(0, 5.75rem) minmax(0, 1.2fr)
    minmax(0, 5.75rem) minmax(0, 0.8fr)
    minmax(0, 5.75rem) minmax(0, 1.8fr);
}

.pur037-popup-label {
  min-width: 0;
}

.pur037-popup-label-inner {
  display: flex;
  width: 100%;
  min-height: 2rem;
  align-items: center;
  justify-content: center;
  padding: 0.125rem 0.25rem;
  text-align: center;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.25rem;
  color: rgb(17 24 39);
}

.pur037-popup-cell {
  display: flex;
  min-width: 0;
  align-items: center;
}

.pur037-popup-input {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  height: 2rem;
  min-height: 2rem;
  max-height: 2rem;
  border-radius: 0.375rem;
  border: 1px solid var(--pur037-popup-border) !important;
  background-color: #fff;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: rgb(17 24 39);
  -webkit-text-fill-color: rgb(17 24 39);
  opacity: 1;
}

.pur037-popup-input:disabled {
  background-color: #fff;
  color: rgb(17 24 39);
  -webkit-text-fill-color: rgb(17 24 39);
  opacity: 1;
}

select.pur037-popup-input {
  width: 45%;
  max-width: 45%;
  min-width: 0;
}

.pur037-popup-grid-wrap {
  display: flex;
  min-width: 0;
  min-height: 0;
  flex: 1 1 auto;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
}

.pur037-popup-grid-wrap :deep(.realgrid) {
  flex: 1 1 auto;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
}

.pur037-popup-resize {
  position: absolute;
  right: 0.25rem;
  bottom: 0.25rem;
  width: 0.9rem;
  height: 0.9rem;
  cursor: nwse-resize;
  background:
    linear-gradient(135deg, transparent 50%, #94a3b8 50%, #94a3b8 62%, transparent 62%),
    linear-gradient(135deg, transparent 70%, #94a3b8 70%, #94a3b8 82%, transparent 82%);
}
</style>
