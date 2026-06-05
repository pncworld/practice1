<!-- /*--############################################################################
# Filename : PUR08_004INS.vue                                                  
# Description : 구매관리2 > 구매 관리 > 매장/파트간 입고 확정                   
# Date :2025-09-23                                                             
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <!-- 조회 패널·그리드 레이아웃: PUR08_003INS 와 동일 pur235 와이어 + flex-1 그리드 -->
  <div class="flex h-full min-h-0 flex-col" @click="handleParentClick">
    <div
      class="flex shrink-0 justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center mr-9 space-x-2 pr-5">
        <button @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <button @click="confirmButton" class="button save w-auto xcel">
          확정
        </button>
        <button @click="cancelButton" class="button primary w-auto">
          확정취소
        </button>
        <button @click="excelButton" class="button save w-auto excel">
          엑셀
        </button>
      </div>
    </div>
    <div
      class="pur235-search-panel pur803-search-shrink z-10 mt-3 w-full min-h-0 shrink-0 overflow-x-auto rounded-lg bg-gray-200 px-8 py-3 md:px-12">
      <div
        class="pur235-wire-grid pur803-wire-grid min-w-0"
        :style="{
          '--pur235-control-border': pur235ControlBorder,
          '--pur235-col-gutter': pur235ColGutter,
          '--pur235-row-gap': pur235RowGap,
          '--pur235-label-col': pur235LabelCol,
        }">
        <div class="pur235-wire-cell min-w-0">
          <div class="pur235-wire-label">보낸 매장</div>
          <div class="pur235-wire-field min-w-0">
            <div class="pur803-store-part-pair">
              <div class="pur235-pick-slot pur803-pick-in-pair min-h-0 min-w-0">
                <PickStore
                  compact-search-bar
                  unlock-store-combo-only
                  @update:store-group="lngStoreGroup"
                  :default-store-nm="'전체'"
                  :main-name="'보낸 매장'"
                  :default-store="true"
                  @store-nm="excelStore"
                  :hide-attr="false"
                  :hide-group="false"
                  @update:store-cd="lngStoreCode" />
              </div>
              <span
                class="pur803-store-slash pur804-from-store-pair-slash select-none"
                aria-hidden="true"
                >/</span>
              <div
                class="pur235-sg-select pur803-part-in-pair pur804-from-store-pair-spacer h-8 min-w-0 border border-transparent bg-transparent"
                aria-hidden="true" />
            </div>
          </div>
        </div>
        <div class="pur235-wire-cell min-w-0">
          <div class="pur235-wire-label">받는 매장/파트</div>
          <div class="pur235-wire-field min-w-0">
            <div class="pur803-store-part-pair">
              <div class="pur235-pick-slot pur803-pick-in-pair min-h-0 min-w-0">
                <PickStore
                  compact-search-bar
                  :default-store-nm="'전체'"
                  :default-store="true"
                  :main-name="'받는 매장/파트'"
                  @store-nm="excelStore2"
                  :hide-attr="false"
                  :hide-group="false"
                  @update:store-cd="lngStoreCode2" />
              </div>
              <span class="pur803-store-slash" aria-hidden="true">/</span>
              <select
                id="pur08-004-to-part"
                v-model="cond"
                :disabled="partToDisabled"
                class="pur235-sg-select pur803-part-in-pair h-8 min-w-0 rounded-md border border-solid bg-white px-1.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500">
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
        <div class="pur235-wire-cell min-w-0">
          <div class="pur235-wire-label">이동기간</div>
          <div class="pur235-wire-field pur235-date-slot min-w-0 overflow-hidden">
            <Datepicker2
              ref="datepicker"
              omit-main-label
              filter-bar-align
              :init-today2="-7"
              :main-name="'이동기간'"
              :close-pop-up="closePopUp"
              @start-date="startDate"
              @excel-date="excelDate"
              @end-date="endDate" />
          </div>
        </div>
        <div class="pur235-wire-cell min-w-0">
          <div class="pur235-wire-label">확정여부</div>
          <div class="pur235-wire-field min-w-0">
            <div class="pur803-confirm-row">
              <select
                id="pur08-004-confirm-period"
                v-model="cond2"
                class="pur235-sg-select pur803-confirm-select h-8 w-full min-w-0 rounded-md border border-solid bg-white px-1.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <!-- OPTION: 9 전체, 0 미확정, 1 확정 (공통코드 24 와 API 값 불일치 — PUR08_003INS 동일) -->
                <option value="9">전체</option>
                <option value="0">미확정</option>
                <option value="1">확정</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-2 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <div
        class="relative h-full min-h-[min(40vh,18rem)] min-w-0 flex-1">
        <Realgrid
          :progname="'PUR08_004INS_VUE'"
          :progid="1"
          :rowData="rowData"
          :setNumberformatColumn="'dblQty,dblMoveQty'"
          :setStateBar="false"
          :documentTitle="'PUR08_004INS'"
          @updatedRowData="updatedRowData"
          :checkedRowData2Col="'Selected,cancled'"
          @selectedIndex="selectedIndex"
          @checkedRowData2="checkedRowData2"
          :documentSubTitle="documentSubTitle"
          :headerCheckBar="'cancled,Selected'"
          :checkAbleExpressionCol="'cancled,Selected'"
          :checkAbleExpressionCol2="'SelectableChk'"
          :checkAbleExpressionVal="'1,2'"
          :checkAbleExpressionCol3="'SelectableChk'"
          :checkAbleExpressionVal2="'0,2'"
          :checkRenderEditable="true"
          :checkRowAuto="true"
          :rowStateeditable="false"
          :changeRow="changeRow"
          :changeColid="changeColid"
          :changeNow="changeNow"
          :changeValue2="changeValue2"
          :emitCheckedRowData2AsJson="true"
          :exporttoExcel="exportExcel">
        </Realgrid>
      </div>
    </div>
  </div>

  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    v-if="open">
    <div
      class="flex min-h-[12rem] w-[min(92vw,24rem)] flex-col rounded-lg border border-slate-300 bg-white p-4 shadow-lg"
      @click.stop>
      <div class="flex shrink-0 justify-end gap-2 pb-3">
        <button type="button" class="whitebutton" @click="setValue">선택</button>
        <button type="button" class="whitebutton" @click="setFalse">닫기</button>
      </div>
      <div
        class="grid min-h-0 flex-1 grid-cols-[6.75rem_1fr] gap-0 overflow-hidden rounded border border-slate-300 text-sm">
        <div
          class="flex items-center justify-center border-b border-r border-slate-300 bg-slate-100 px-2 py-2 font-semibold text-gray-900">
          입고 확정일자
        </div>
        <div
          class="flex items-center justify-center border-b border-slate-300 bg-white px-2 py-2">
          <input
            type="date"
            class="h-8 w-full max-w-full rounded-md border border-slate-300 px-2 text-sm"
            v-model="changeValue2" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  cancelStoreMoveConfirmList,
  confirmStoreMoveConfirmList,
  getStoreStockMoveListByPart,
} from "@/api/mipur";
import { getLossMasterPartList } from "@/api/mistock";
import Datepicker2 from "@/components/Datepicker2.vue";
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
/**
 *  페이지로그 자동 입력
 *  */

import { formatLocalDate, insertPageLog } from "@/customFunc/customFunc";
import Swal from "sweetalert2";
/**
 *  경고창 호출 라이브러리
 *  */

/*
 * 공통 표준  Function
 */

import { computed, nextTick, onMounted, ref } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";

const store = useStore();

/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  await insertPageLog(store.state.activeTab2);
});

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

const cond = ref("0");
/** 확정여부 → 조회 API OPTION: 9 전체, 0 미확정, 1 확정 */
const cond2 = ref(9);
const cond3 = ref(0);
const cond4 = ref("");
const cond5 = ref(0);
const cond6 = ref(0);

/** 조회 AREA — PUR08_003INS 와 동일 pur235 와이어 토큰 */
const pur235ControlBorder = "#cbd5e1";
const pur235ColGutter = "1.125rem";
const pur235RowGap = "0.875rem";
const pur235LabelCol = "8.75rem";

const datepicker = ref(null);
const closePopUp = ref(false);
const optionList = ref([]);
const optionList3 = ref([]);
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
const startDate = (e) => {
  initGrid();
  sDate.value = e;
};
const endDate = (e) => {
  initGrid();
  eDate.value = e;
};

const selectedDate = ref();
const excelDate = (e) => {
  selectedDate.value = e;
};

/** PickStore `전체` → storeCd 0/`0` — 받는 파트 콤보 비활성 (PUR08_003INS 와 동일) */
const isWholeStore = (storeCd) => {
  if (storeCd === undefined || storeCd === null) return true;
  const s = String(storeCd).trim();
  return s === "" || s === "0";
};

const storeCode = ref();
const lngStoreCode = async (e) => {
  initGrid();
  storeCode.value = e;

  const res2 = await getLossMasterPartList(
    store.state.userData.lngStoreGroup,
    storeCode.value
  );

  optionList3.value = res2.data.List;
};

const groupCd = ref();
const lngStoreGroup = (e) => {
  groupCd.value = e;
};

/**
 *  조회 함수
 */
const hideColumnsId = ref([]);
const searchButton = async () => {
  try {
    store.state.loading = true;

    const res = await getStoreStockMoveListByPart(
      groupCd.value,
      storeCode.value,
      0,
      storeCode2.value,
      cond.value,
      sDate.value,
      eDate.value,
      cond2.value
    );

    /** List가 null/비배열이면 Realgrid setRows 오류·헤더 깨짐 방지 */
    rowData.value = mapPur08RowsWithSelectableChk(res?.data?.List);
    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    rowData.value = [];
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

const setRowStyleCallsDefaultCol = ref("strTaxType");
const setRowStyleCallsDefaultCol2 = ref("strStockName");
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
    selectedDate.value +
    "\n" +
    "보낸 매장명 :" +
    selectedExcelStore.value +
    "\n" +
    "받는 매장명 :" +
    selectedExcelStore2.value;
  exportExcel.value = !exportExcel.value;
};

// 엑셀 추출
const documentSubTitle = ref("");
const selectedExcelList = ref("");

const selectedExcelStore = ref("");
const selectedExcelStore2 = ref("");
/**
 * 엑셀용 매장 세팅 함수
 */

const excelStore = (e) => {
  selectedExcelStore.value = e;
  //comsole.log(e);
};
const excelStore2 = (e) => {
  selectedExcelStore2.value = e;
  //comsole.log(e);
};
const excelList = (e) => {
  selectedExcelList.value = e;
  //comsole.log(e);
};
const storeCode2 = ref();
/** 받는 매장이 전체일 때 파트 콤보 비활성 */
const partToDisabled = computed(() => isWholeStore(storeCode2.value));

const lngStoreCode2 = async (e) => {
  initGrid();
  storeCode2.value = e;
  if (isWholeStore(e)) {
    try {
      const res2 = await getLossMasterPartList(
        store.state.userData.lngStoreGroup,
        "0"
      );
      const list = res2?.data?.List;
      if (Array.isArray(list) && list.length > 0) {
        optionList.value = list;
      }
    } catch {
      /* 기존 optionList 유지 */
    }
    cond.value = "0";
    return;
  }
  const res2 = await getLossMasterPartList(
    store.state.userData.lngStoreGroup,
    storeCode2.value
  );

  optionList.value = Array.isArray(res2?.data?.List) ? res2.data.List : [];
};

const open = ref(false);
const changeNow = ref(false);
const changeValue2 = ref("");
const changeColid = ref("strConfirmDate");
const tempMoveDate = ref("");
const tempCloseDate = ref("");
/** Realgrid `changeNow` 되돌리기로 인한 onValueChanged 재진입 방지 */
const skipCheckedRowData2Sync = ref(false);

const isConfirmedRow = (v) => {
  const s = String(v ?? "")
    .replace(/\s/g, "")
    .trim();
  return s === "확정" || s === "1" || s === "Y" || s === "y" || v === 1;
};

const normField = (f) => String(f ?? "").trim();

const isTruthyCheck = (v) =>
  v === true || v === 1 || v === "1" || String(v).toLowerCase() === "true";

/** emitCheckedRowData2AsJson 행 — getRows 배열 인덱스와 Selected 위치가 다를 수 있음 */
const readMonthCloseRaw = (row) => {
  if (!row || typeof row !== "object") return "";
  const keys = [
    "strMonthCloseDate",
    "StrMonthCloseDate",
    "strStockCloseDate",
    "StrStockCloseDate",
    "strCloseDate",
    "StrCloseDate",
    "strCloseDt",
    "StrCloseDt",
    "lngMonthClose",
    "LngMonthClose",
  ];
  for (const k of keys) {
    const v = row[k];
    if (v != null && v !== "") return v;
  }
  return "";
};

/** PUR08_002 구 프로그램 SelectableChk: 0 미확정, 1 확정, 2 마감(월마감 이전 이동) */
const resolvePur08SelectableChk = (row) => {
  if (!row || typeof row !== "object") return "0";
  const existing = row.SelectableChk ?? row.selectableChk;
  if (existing != null && String(existing).trim() !== "") {
    return String(existing).trim();
  }
  const strConfirm = String(row.strConfirm ?? row.StrConfirm ?? "").trim();
  const confirmed =
    strConfirm === "확정" ||
    strConfirm === "1" ||
    strConfirm === "Y" ||
    strConfirm === "y";
  const closeRaw = readMonthCloseRaw(row);
  const closeYmd =
    closeRaw !== "" && closeRaw != null
      ? String(closeRaw).replace(/\D/g, "")
      : "";
  const moveRaw = row.strMoveDate ?? row.StrMoveDate;
  const moveYmd = toYmdDigits(moveRaw);
  if (
    closeYmd &&
    moveYmd &&
    parseInt(moveYmd, 10) <= parseInt(closeYmd, 10)
  ) {
    return "2";
  }
  return confirmed ? "1" : "0";
};

const pickPur08RowVal = (row, ...keys) => {
  if (!row || typeof row !== "object") return "";
  for (const k of keys) {
    const v = row[k];
    if (v !== undefined && v !== null && String(v).trim() !== "") return v;
  }
  return "";
};

const normalizePur08GridDate = (val) => {
  if (val === undefined || val === null || String(val).trim() === "") return "";
  const raw = String(val).trim();

  const msMatch = raw.match(/\/Date\((-?\d+)\)\//);
  if (msMatch) {
    const d = new Date(parseInt(msMatch[1], 10));
    if (!Number.isNaN(d.getTime())) return formatLocalDate(d);
  }

  const digits = raw.replace(/\D/g, "");
  if (digits.length === 8) {
    return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
  }
  if (/^\d{13}$/.test(digits)) {
    const d = new Date(parseInt(digits, 10));
    if (!Number.isNaN(d.getTime())) return formatLocalDate(d);
  }

  const d = new Date(raw);
  if (!Number.isNaN(d.getTime())) return formatLocalDate(d);
  return raw;
};

/** 그리드 @@@@-@@-@@ 텍스트 컬럼 — YYYYMMDD 8자리 */
const toRealGridMaskDateValue = (val) => {
  if (val === undefined || val === null || String(val).trim() === "") return "";
  const raw = String(val).trim();
  if (/^\d{8}$/.test(raw)) return raw;
  const ymd = normalizePur08GridDate(val);
  if (!ymd || ymd.includes("NaN")) return "";
  return ymd.replaceAll("-", "");
};

const toYmdDigits = (val) => toRealGridMaskDateValue(val);

const normalizePur08GridQty = (val) => {
  if (val === undefined || val === null || val === "") return val;
  const n = Number(String(val).replace(/,/g, ""));
  return Number.isFinite(n) ? n : val;
};

const mapPur08GridListRow = (row) => {
  const strConfirmDateRaw = pickPur08RowVal(
    row,
    "strConfirmDate",
    "StrConfirmDate",
    "strCofirmDate",
    "StrCofirmDate",
    "dtmConfirmDate",
    "DtmConfirmDate",
    "strInConfirmDate",
    "StrInConfirmDate",
    "strInDate",
    "StrInDate",
    "dtmInDate",
    "DtmInDate"
  );
  const strMoveDateRaw = pickPur08RowVal(
    row,
    "strMoveDate",
    "StrMoveDate",
    "dtmMoveDate",
    "DtmMoveDate"
  );
  const dblQtyRaw = pickPur08RowVal(
    row,
    "dblQty",
    "DblQty",
    "dblMoveQty",
    "DblMoveQty"
  );
  const strConfirmDate = toRealGridMaskDateValue(
    strConfirmDateRaw !== ""
      ? strConfirmDateRaw
      : row.strConfirmDate ?? row.StrConfirmDate
  );
  const strMoveDate = toRealGridMaskDateValue(
    strMoveDateRaw !== "" ? strMoveDateRaw : row.strMoveDate ?? row.StrMoveDate
  );
  const dblQty = normalizePur08GridQty(
    dblQtyRaw !== "" ? dblQtyRaw : row.dblQty ?? row.DblQty
  );
  const enriched = {
    ...row,
    strConfirmDate,
    StrConfirmDate: strConfirmDate,
    strInConfirmDate: strConfirmDate,
    StrInConfirmDate: strConfirmDate,
    strInDate: strConfirmDate,
    StrInDate: strConfirmDate,
    strMoveDate,
    StrMoveDate: strMoveDate,
    dblQty,
    DblQty: dblQty,
    dblMoveQty: dblQty,
    DblMoveQty: dblQty,
  };
  return {
    ...enriched,
    SelectableChk: resolvePur08SelectableChk(enriched),
  };
};

const mapPur08RowsWithSelectableChk = (list) =>
  Array.isArray(list) ? list.map((row) => mapPur08GridListRow(row)) : [];

/** RealGrid onCellEdited 직후 Swal이 가려지거나 미표시되는 경우 방지 */
const showSwalAfterGrid = (options) =>
  new Promise((resolve) => {
    setTimeout(() => {
      void Swal.fire(options).then(resolve);
    }, 0);
  });

const revertGridCheckbox = (dataRow, colid, value) => {
  if (typeof dataRow !== "number" || dataRow < 0) return;
  skipCheckedRowData2Sync.value = true;
  changeRow.value = dataRow;
  changeColid.value = colid;
  changeValue2.value = value;
  changeNow.value = !changeNow.value;
  void nextTick(() => {
    void nextTick(() => {
      skipCheckedRowData2Sync.value = false;
    });
  });
};

const checkedRowData2 = async (
  payload,
  editedField,
  dataRow,
  oldVal,
  newVal
) => {
  if (skipCheckedRowData2Sync.value) return;
  await nextTick();

  const field = normField(editedField);
  const isSelectedCol = field === "Selected" || field === "selected";
  const isCancledCol =
    field === "cancled" || field === "Cancled" || field === "canceled";

  const base =
    payload && typeof payload === "object" && !Array.isArray(payload)
      ? payload
      : {};
  const live =
    typeof dataRow === "number" &&
    dataRow >= 0 &&
    Array.isArray(updatedrowdata.value) &&
    updatedrowdata.value[dataRow]
      ? updatedrowdata.value[dataRow]
      : null;
  const row =
    live && Object.keys(base).length
      ? { ...base, ...live }
      : live ?? (Object.keys(base).length ? base : null);

  if (!row) return;

  const strConfirm = String(
    row.strConfirm ?? row.StrConfirm ?? ""
  ).trim();
  /** 편집 직후 payload/행과 그리드 값이 어긋날 수 있어 emit의 newVal·동기화된 행을 우선 */
  const selectedOn = isSelectedCol
    ? newVal !== undefined
      ? isTruthyCheck(newVal)
      : isTruthyCheck(row.Selected)
    : isTruthyCheck(row.Selected);
  const cancledOn = isCancledCol
    ? newVal !== undefined
      ? isTruthyCheck(newVal)
      : isTruthyCheck(row.cancled)
    : isTruthyCheck(row.cancled);

  if (isSelectedCol && selectedOn && isConfirmedRow(strConfirm)) {
    await showSwalAfterGrid({
      title: "알림",
      text: "이미 확정 되어 있습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    revertGridCheckbox(dataRow, "Selected", "0");
    return;
  }

  if (isCancledCol && cancledOn && !isConfirmedRow(strConfirm)) {
    await showSwalAfterGrid({
      title: "알림",
      text: "확정되지 않은 입고 건 입니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    revertGridCheckbox(dataRow, "cancled", false);
    return;
  }

  if (!isSelectedCol) {
    return;
  }

  const moveRaw = row.strMoveDate ?? row.StrMoveDate;
  tempMoveDate.value = toYmdDigits(moveRaw);

  const closeRaw = readMonthCloseRaw(row);
  tempCloseDate.value =
    closeRaw !== "" && closeRaw != null
      ? String(closeRaw).replace(/\D/g, "") || closeRaw
      : "";

  if (selectedOn) {
    changeColid.value = "strConfirmDate";
    changeValue2.value = formatLocalDate(new Date());
    open.value = true;
  } else {
    changeColid.value = "strConfirmDate";
    changeValue2.value = "";
    changeNow.value = !changeNow.value;
  }
};

const changeRow = ref(0);

const selectedIndex = (e) => {
  changeRow.value = e;
};
const setFalse = () => {
  changeColid.value = "Selected";
  changeValue2.value = "0";
  changeNow.value = !changeNow.value;
  open.value = false;
};

const setValue = () => {
  if (
    parseInt(changeValue2.value.replaceAll("-", "")) <
    parseInt(tempCloseDate.value)
  ) {
    Swal.fire({
      title: "경고",
      text: "월마감 이전으로 입고확정 할 수 없습니다.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }

  if (
    parseInt(changeValue2.value.replaceAll("-", "")) <
    parseInt(tempMoveDate.value)
  ) {
    Swal.fire({
      title: "경고",
      text: "출고확정 이전으로 입고확정 할 수 없습니다.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }

  changeNow.value = !changeNow.value;
  open.value = false;
};

const updatedrowdata = ref([]);
const updatedRowData = (e) => {
  updatedrowdata.value = e;
};

const cancelButton = async () => {
  const cancelRows = Array.isArray(updatedrowdata.value)
    ? updatedrowdata.value.filter((item) => item.cancled == true)
    : [];
  if (cancelRows.length === 0) {
    await Swal.fire({
      title: "알림",
      text: "확정취소할 항목을 선택해 주십시오.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  try {
    const fstorecds = cancelRows
      .map((item) => item.lngFromStoreCode)
      .join("\u200b");
    const moveseqs = cancelRows
      .map((item) => item.strMoveSeqID)
      .join("\u200b");
    const tstorecds = cancelRows
      .map((item) => item.lngToStoreCode)
      .join("\u200b");
    const movedate = cancelRows
      .map((item) => toYmdDigits(item.strMoveDate))
      .join("\u200b");

    const supplier = cancelRows
      .map((item) => item.lngSupplierID)
      .join("\u200b");

    const stockids = cancelRows
      .map((item) => item.lngStockID)
      .join("\u200b");

    const confirmdate = cancelRows
      .map((item) => toYmdDigits(item.strConfirmDate))
      .join("\u200b");
    const res = await cancelStoreMoveConfirmList(
      groupCd.value,
      fstorecds,
      moveseqs,
      tstorecds,
      movedate,
      supplier,
      stockids,
      confirmdate,
      1
    );

    if (res.data.RESULT_CD == "00") {
      await Swal.fire({
        title: "성공",
        text: "확정 취소를 완료하였습니다.",
        icon: "success",

        confirmButtonText: "확인",
      });
    } else {
      await Swal.fire({
        title: "실패",
        text: `${res.data.RESULT_NM}`,
        icon: "error",

        confirmButtonText: "확인",
      });
    }
  } catch (error) {
    console.log(error);
  } finally {
    searchButton();
  }
};

const confirmButton = async () => {
  const selectedRows = Array.isArray(updatedrowdata.value)
    ? updatedrowdata.value.filter((item) => item.Selected == true)
    : [];
  if (selectedRows.length === 0) {
    await Swal.fire({
      title: "알림",
      text: "확정할 항목을 선택해주십시오.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  try {
    const fstorecds = selectedRows
      .map((item) => item.lngFromStoreCode)
      .join("\u200b");
    const moveseqs = selectedRows
      .map((item) => item.strMoveSeqID)
      .join("\u200b");
    const tstorecds = selectedRows
      .map((item) => item.lngToStoreCode)
      .join("\u200b");
    const movedate = selectedRows
      .map((item) => toYmdDigits(item.strMoveDate))
      .join("\u200b");

    const supplier = selectedRows
      .map((item) => item.lngSupplierID)
      .join("\u200b");

    const stockids = selectedRows
      .map((item) => item.lngStockID)
      .join("\u200b");

    const confirmdate = selectedRows
      .map((item) => toYmdDigits(item.strConfirmDate))
      .join("\u200b");
    const res = await confirmStoreMoveConfirmList(
      groupCd.value,
      fstorecds,
      moveseqs,
      tstorecds,
      movedate,
      supplier,
      stockids,
      store.state.userData.lngSequence,
      confirmdate,
      1
    );

    if (res.data.RESULT_CD == "00") {
      await Swal.fire({
        title: "성공",
        text: "확정을 완료하였습니다.",
        icon: "success",

        confirmButtonText: "확인",
      });
    } else {
      await Swal.fire({
        title: "실패",
        text: `${res.data.RESULT_NM}`,
        icon: "error",

        confirmButtonText: "확인",
      });
    }
  } catch (error) {
    console.log(error);
  } finally {
    searchButton();
  }
};
</script>

<style scoped>
/* 2열 와이어 — PUR08_003INS 와 동일 */
.pur803-wire-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.pur235-search-panel.pur803-search-shrink .pur235-wire-cell > .pur235-wire-field {
  width: 63%;
  max-width: 63%;
  flex: 0 1 auto;
  min-width: 0;
  box-sizing: border-box;
}

.pur803-store-part-pair {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  column-gap: 0.125rem;
  width: 100%;
  min-width: 0;
}

.pur803-store-slash {
  font-size: 1rem;
  font-weight: 600;
  line-height: 1;
  color: rgb(75 85 99);
  padding: 0;
  margin: 0;
  user-select: none;
}

/* 보낸 매장: 받는 매장과 동일 1fr | / | 1fr 비율 — 매장 콤보만 첫 칸에 배치 */
.pur804-from-store-pair-slash {
  color: transparent;
}

.pur804-from-store-pair-spacer {
  pointer-events: none;
  visibility: hidden;
}

.pur803-pick-in-pair {
  justify-self: stretch;
  width: 100%;
  max-width: 100%;
  min-width: 0;
}

.pur803-store-part-pair .pur803-pick-in-pair :deep(div.relative.min-w-0.flex-1) {
  max-width: 100% !important;
  width: 100% !important;
}

.pur803-store-part-pair .pur803-pick-in-pair :deep(.pickstore-vs-shell) {
  width: 100% !important;
  max-width: 100% !important;
}

.pur803-part-in-pair {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  justify-self: stretch;
}

.pur803-confirm-row {
  width: 100%;
  max-width: calc(50% - 0.25rem);
  min-width: 0;
  box-sizing: border-box;
}

.pur803-confirm-select {
  box-sizing: border-box;
}

.pur235-wire-grid {
  display: grid;
  width: 100%;
  min-width: 0;
  align-items: center;
  column-gap: var(--pur235-col-gutter);
  row-gap: var(--pur235-row-gap);
}

.pur235-wire-cell {
  display: flex;
  min-width: 0;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}

.pur235-wire-label {
  flex: 0 0 var(--pur235-label-col);
  width: var(--pur235-label-col);
  min-width: 0;
  max-width: var(--pur235-label-col);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
  text-align: center;
  white-space: normal;
  overflow: visible;
  hyphens: none;
  padding-left: 0.125rem;
  padding-right: 0.125rem;
}

.pur235-wire-field {
  display: flex;
  min-width: 0;
  max-width: 100%;
  flex: 1 1 auto;
  align-items: center;
}

.pur235-wire-field:not(.pur235-mat-row) > * {
  min-width: 0;
  width: 100%;
}

.pur235-sg-select {
  box-sizing: border-box;
}

.pur235-search-panel select.pur235-sg-select {
  border: 1px solid var(--pur235-control-border) !important;
}

.pur235-search-panel select.pur235-sg-select:focus {
  border-color: #3b82f6 !important;
}

.pur235-search-panel .pur235-pick-slot :deep(select) {
  border: 1px solid var(--pur235-control-border) !important;
}

.pur235-search-panel .pur235-pick-slot :deep(select:focus) {
  border-color: #3b82f6 !important;
}

.pur235-search-panel .pur235-pick-slot :deep(.pickstore-vs-shell),
.pur235-search-panel .pur235-bc-slot :deep(.pickstore-vs-shell) {
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
  border: 1px solid var(--pur235-control-border) !important;
}

.pur235-search-panel .pur235-pick-slot :deep(div.relative.min-w-0.flex-1) {
  max-width: 100% !important;
}

.pur235-pick-slot :deep(> div.flex.text-base) {
  width: 100%;
  min-width: 0;
}

.pur235-pick-slot :deep(> div.flex > div:first-child) {
  display: none;
}

.pur235-search-panel .pur235-date-slot :deep(input[type="date"]:focus) {
  border-color: #3b82f6 !important;
}

.pur235-search-panel .pur235-date-slot :deep(> div.flex.justify-start.items-center) {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0;
  gap: 0.25rem !important;
}

.pur235-search-panel .pur235-date-slot :deep(> div.flex > div.inline-flex.h-8) {
  flex: 1 1 auto;
  min-width: 0;
  max-width: 100%;
  width: 100%;
  gap: 0.125rem !important;
}

.pur235-search-panel .pur235-date-slot :deep(input[type="date"]) {
  border: 1px solid var(--pur235-control-border) !important;
  box-sizing: border-box;
  width: auto !important;
  flex: 1 1 0;
  min-width: 5.25rem;
  max-width: none;
  padding-left: 0.45rem;
  padding-right: 0.25rem;
}

.pur235-search-panel .pur235-date-slot :deep(div.inline-flex.h-8 > span) {
  flex-shrink: 0;
  padding-left: 0.05rem;
  padding-right: 0.05rem;
}

.pur235-search-panel .pur235-date-slot :deep(div.inline-flex.h-8 > button) {
  flex-shrink: 0;
  width: 1.65rem !important;
  height: 1.65rem !important;
  min-width: 1.65rem;
  margin-left: 0 !important;
}

.pur235-search-panel .pur235-date-slot :deep(div.inline-flex.h-8 > button img) {
  max-width: 85%;
  max-height: 85%;
}

.pur235-date-slot :deep(> div.flex.justify-start.items-center) {
  margin-left: 0;
  padding-left: 0;
}
</style>
