<!-- /*--############################################################################
# Filename : PUR02_017INS.vue                                                  
# Description : 구매관리2 > 매입 관리 > 매입 확정(파트별).                      
# Date :2025-09-19                                                             
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <!-- 조회조건 -->
  <div class="flex h-full min-h-0 flex-col" @click="handleParentClick">
    <div class="flex shrink-0 justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center mr-9 space-x-2 pr-5">
        <button
          @click="confirmButton"
          class="button primary w-32 justify-center text-center">
          선택 전표 확정
        </button>
        <button @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <button @click="excelButton" class="button w-auto excel">엑셀</button>
      </div>
    </div>
    <div
      class="pur017-search-panel z-10 mt-3 w-full min-w-0 shrink-0 overflow-x-auto rounded-lg bg-gray-200 px-6 py-3 md:px-10 lg:px-12">
      <div
        class="pur017-search-grid min-w-0"
        :style="{
          '--pur017-control-border': pur017ControlBorder,
          '--pur017-item-gap': pur017ItemGap,
          '--pur017-label-col': pur017LabelCol,
        }">
        <div class="pur017-cell">
          <div class="pur017-sg-label">발주일자</div>
          <div class="pur017-cell-field pur017-date-slot min-w-0">
            <Datepicker2
              ref="datepicker"
              omit-main-label
              filter-bar-align
              :mainName="'발주일자'"
              :initToday2="-7"
              :initToday="0"
              :closePopUp="closePopUp"
              @excelDate="excelDate"
              @endDate="endDate"
              @startDate="startDate"
              @dateValue="dateValue" />
          </div>
        </div>
        <div class="pur017-cell">
          <div class="pur017-sg-label">매장</div>
          <div class="pur017-cell-field pur017-pick-slot min-w-0">
            <PickStore
              compact-search-bar
              :compact-store-combo-max-rem="pur017PickStoreComboMaxRem"
              main-name=""
              @update:storeGroup="lngStoreGroup"
              :defaultStoreNm="'전체'"
              @storeNm="excelStore"
              :hide-group="false"
              :hide-attr="false"
              :default-store-type2="true"
              :default-store="true"
              @update:storeCd="lngStoreCode" />
          </div>
        </div>
        <div class="pur017-cell">
          <div class="pur017-sg-label">파트</div>
          <div class="pur017-cell-field min-w-0">
            <select
              id="pur02-017-part"
              v-model="cond2"
              class="pur017-sg-select h-8 w-full min-w-0 rounded-md border border-solid bg-white text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option
                v-for="i in optionList2"
                :key="i.lngPartCode"
                :value="i.lngPartCode">
                {{ i.strPartName }}
              </option>
            </select>
          </div>
        </div>
        <div class="pur017-cell">
          <div class="pur017-sg-label">상태</div>
          <div class="pur017-cell-field pur017-status-combo-cap min-w-0">
            <select
              id="pur02-017-status"
              v-model="cond"
              class="pur017-sg-select h-8 min-w-0 rounded-md border border-solid bg-white text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option
                v-for="i in optionList"
                :key="i.strDCode"
                :value="i.strDCode">
                {{ i.strDName }}
              </option>
            </select>
          </div>
        </div>
        <div class="pur017-cell">
          <div class="pur017-sg-label">거래처</div>
          <div class="pur017-cell-field pur017-bc-slot pur017-vendor-combo-cap min-w-0">
            <BusinessClient compact-search-bar @SupplierId="SupplierId" />
          </div>
        </div>
        <div class="pur017-cell pur017-grid-filler" aria-hidden="true" />
      </div>
    </div>

    <!-- 조회조건 -->
    <!-- 그리드 영역: 탭 높이 내 flex-1 (고정 vh 제거 — 노트북 하단 잘림 방지) -->
    <div class="mt-2 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <div class="shrink-0 font-semibold ml-2 text-sm leading-snug">
        [미입고]: 입고수량이 발주수량보다 적게 입고되었거나 입고가 안된 경우.
        [입고완료] : 입고수량이 발주수량과 같거나 많이 입고된 경우
      </div>
      <div class="relative min-h-0 flex-1">
        <PUR02_017MainGrid
          ref="mainGridRef"
          progname="PUR02_017INS_VUE"
          :progid="1"
          :exporttoExcel="exportExcel"
          :documentTitle="'PUR02_017INS'"
          :documentSubTitle="documentSubTitle"
          @checkedRowData="checkedRowData"
          @dblclickedRowData="dblclickedRowData" />
      </div>
    </div>
  </div>

  <div
    v-if="openPopUp"
    class="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
    <div class="relative z-50 rounded-2xl bg-white p-6 shadow-xl w-[75vw] h-[80vh]">
      <div class="flex justify-between">
        <h2 class="text-xl font-bold mb-4">매입확정 상세</h2>
        <div class="flex flex-wrap items-center justify-end gap-2">
          <button
            class="button primary md:w-auto w-14 justify-center text-center disabled:opacity-30"
            type="button"
            @click="saveButton"
            :disabled="disabled1 || popupConfirmLocked">
            확정
          </button>
          <button
            class="button primary md:w-auto min-w-[5.5rem] justify-center px-3 text-center disabled:opacity-30"
            type="button"
            @click="cancelButton"
            :disabled="!disabled1 || popupConfirmLocked">
            확정취소
          </button>
          <button
            class="button primary md:w-auto w-14 justify-center text-center"
            type="button"
            @click="excelButton2">
            엑셀
          </button>
          <button
            class="button primary md:w-auto w-14 justify-center text-center"
            type="button"
            @click="openPopUp = false">
            닫기
          </button>
        </div>
      </div>
      <!-- 발주 확인/출고(팝업) PUR01_019INS와 동일 패턴 -->
      <div
        class="pur017-popup-fields mb-3 min-w-0 rounded-lg bg-gray-100 px-6 py-4"
        :style="{
          '--pur017-popup-border': pur017PopupBorder,
          '--pur017-popup-label': pur017PopupLabelCol,
          '--pur017-popup-gap': pur017PopupFieldGap,
        }">
        <div class="pur017-popup-grid">
          <div class="pur017-popup-label">
            <div class="pur017-popup-label-inner">매장 / 파트</div>
          </div>
          <div class="pur017-popup-cell">
            <input
              type="text"
              class="pur017-popup-input"
              v-model="scond"
              disabled />
          </div>
          <div class="pur017-popup-label">
            <div class="pur017-popup-label-inner">전표번호</div>
          </div>
          <div class="pur017-popup-cell">
            <input
              type="text"
              class="pur017-popup-input"
              v-model="scond2"
              disabled />
          </div>

          <div class="pur017-popup-label">
            <div class="pur017-popup-label-inner">배송(입고)일</div>
          </div>
          <div class="pur017-popup-cell">
            <input
              type="text"
              class="pur017-popup-input"
              v-model="scond3"
              disabled />
          </div>
          <div class="pur017-popup-label">
            <div class="pur017-popup-label-inner">거래처</div>
          </div>
          <div class="pur017-popup-cell">
            <input
              type="text"
              class="pur017-popup-input"
              v-model="scond4"
              disabled />
          </div>

          <div class="pur017-popup-label">
            <div class="pur017-popup-label-inner">코멘트(발주)</div>
          </div>
          <div class="pur017-popup-cell">
            <input
              type="text"
              class="pur017-popup-input"
              v-model="scond5"
              disabled />
          </div>
          <div class="pur017-popup-label">
            <div class="pur017-popup-label-inner">코멘트(출고)</div>
          </div>
          <div class="pur017-popup-cell">
            <input
              type="text"
              class="pur017-popup-input"
              v-model="scond6"
              disabled />
          </div>

          <div class="pur017-popup-label">
            <div class="pur017-popup-label-inner">입고확정일</div>
          </div>
          <div class="pur017-popup-cell">
            <input
              type="date"
              class="pur017-popup-input"
              :class="{ 'pur017-popup-input--editable': !disabled1 }"
              :disabled="disabled1"
              v-model="scond7" />
          </div>
          <div class="pur017-popup-label">
            <div class="pur017-popup-label-inner">검수자</div>
          </div>
          <div class="pur017-popup-cell">
            <input
              type="text"
              class="pur017-popup-input"
              :class="{ 'pur017-popup-input--editable': !disabled1 }"
              :disabled="disabled1"
              v-model="scond8" />
          </div>

          <div class="pur017-popup-label">
            <div class="pur017-popup-label-inner">코멘트입고</div>
          </div>
          <div class="pur017-popup-cell pur017-popup-cell--span">
            <input
              type="text"
              class="pur017-popup-input"
              :class="{ 'pur017-popup-input--editable': !disabled1 }"
              :disabled="disabled1"
              v-model="scond9" />
          </div>
        </div>
      </div>
      <div class="h-[60%] w-full flex justify-center items-center mt-2">
        <Realgrid
          :progname="'PUR02_017INS_VUE'"
          :progid="2"
          :documentTitle="'PUR02_017INS'"
          :exporttoExcel="exportExcel2"
          @updatedRowData="updatedRowData2"
          :rowStateeditable="false"
          :inputSignedDecimalColumn="'dblCheckQty'"
          :setNumberformatColumn="'dblBefCheckQty'"
          :CalculateTaxColId="'curTax'"
          :editableColId="'dblCheckQty'"
          :suppressEdit="isPopupDetailReadOnly"
          :AutoCalculateDataMainColId="['curSupply', 'curTotal']"
          :AutoCalculateDataSubColId="[
            `values['dblCheckQty'] * values['curUnitPrice']`,
            `values['curSupply'] + values['curTax']`,
          ]"
          :setFooter="true"
          :documentSubTitle="documentSubTitle2"
          :rowData="rowData2"></Realgrid>
      </div>
    </div>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import { getCommonList } from "@/api/common";
import {
  cancelStockConfirm,
  checkStockCloseDate,
  getStockOrderCheckListByPart,
  getStockOrderDetails,
  saveStockCheckedAllByPart,
  saveStockCheckMasterDetailByPart,
} from "@/api/mipur";
import { getLossMasterPartList } from "@/api/mistock";
import BusinessClient from "@/components/businessClient2.vue";
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

import PUR02_017MainGrid from "@/views/MIPUR/PUR02_017MainGrid.vue";

const Realgrid = defineAsyncComponent(() =>
  import("@/components/realgrid.vue")
);
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

import {
  computed,
  defineAsyncComponent,
  markRaw,
  nextTick,
  onMounted,
  ref,
  shallowRef,
} from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";
/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getCommonList(19);

  optionList.value = res.data.List;
});

const mainGridRef = ref(null);
const rowData = shallowRef([]);
const afterSearch = ref(false);

const cond = ref("01");
const cond2 = ref(0);
const cond3 = ref(0);
const cond4 = ref("");
const cond5 = ref(0);
const store = useStore();

/** 조회 AREA — 3열×2행, 좁은 화면에서 발주일자 우선 확보 */
const pur017ControlBorder = "#cbd5e1";
const pur017ItemGap = "0.5rem";
const pur017LabelCol = "5.25rem";
/** 매장 v-select 열 너비 — 셀 안에서만 확장 */
const pur017PickStoreComboMaxRem = 96;

/** 매입 상세(팝업) 상단 필드 — PUR01_019INS 발주 확인/출고(팝업)과 동일 */
const pur017PopupBorder = "#cbd5e1";
const pur017PopupLabelCol = "7rem";
const pur017PopupFieldGap = "0.5rem";

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

const sDate = ref("");
const eDate = ref("");

const selectedDate = ref();
const excelDate = (e) => {
  selectedDate.value = e;
};
const optionList2 = ref([]);

/** YYYYMMDD → YYYY-MM-DD (그리드 displayCallback 대신 1회 전처리) */
function formatYmdForGrid(v) {
  if (v == null || v === "") return "";
  const s = String(v).trim().replace(/-/g, "");
  if (s.length === 8 && /^\d{8}$/.test(s)) {
    return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
  }
  return String(v);
}

/** API·날짜 비교용 — YYYY-MM-DD / YYYYMMDD → YYYYMMDD */
function toYmdDigits(v) {
  if (v == null || v === "") return "";
  return String(v).trim().replace(/-/g, "");
}

function isPur017RowCheckable(blnChk) {
  return blnChk === 0 || blnChk === "0" || blnChk === false;
}

/** 6천 행+ — Vue deep reactive·객체 복사 없이 in-place 전처리 */
function preprocessPur017Rows(list) {
  if (!Array.isArray(list) || list.length === 0) return [];
  for (let i = 0; i < list.length; i++) {
    const row = list[i];
    if (row == null || typeof row !== "object") continue;
    row.dtmOrderDate = formatYmdForGrid(row.dtmOrderDate);
    row.dtmExpectedDate = formatYmdForGrid(row.dtmExpectedDate);
    row.dtmCheckDate = formatYmdForGrid(row.dtmCheckDate);
    if (isPur017RowCheckable(row.blnChk)) {
      row._purLocked = 0;
    } else {
      row._purLocked = 1;
      row.lngCheck = false;
    }
    markRaw(row);
  }
  return list;
}

const storeCode = ref();
const lngStoreCode = async (e) => {
  initGrid();
  storeCode.value = e;

  const res2 = await getLossMasterPartList(
    store.state.userData.lngStoreGroup,
    storeCode.value
  );

  optionList2.value = res2.data.List;
};

const groupCd = ref();
const lngStoreGroup = (e) => {
  groupCd.value = e;
};

const supplierid = ref("");
const SupplierId = (e) => {
  supplierid.value = e;
};
/**
 *  조회 함수
 */
const hideColumnsId = ref([]);
const searchButton = async () => {
  const t0 = performance.now();
  try {
    store.state.loading = true;

    const res = await getStockOrderCheckListByPart(
      groupCd.value,
      storeCode.value,
      cond2.value,
      supplierid.value,
      sDate.value.replaceAll("-", ""),
      eDate.value.replaceAll("-", ""),
      cond.value
    );

    const apiMs = Math.round(performance.now() - t0);
    store.state.loading = false;

    const raw = Array.isArray(res.data?.List) ? res.data.List : [];
    const processed = preprocessPur017Rows(raw);
    rowData.value = processed;
    afterSearch.value = processed.length > 0;

    const t1 = performance.now();
    await nextTick();
    mainGridRef.value?.loadRows(processed);
    const gridMs = Math.round(performance.now() - t1);

    if (import.meta.env.DEV) {
      console.info(
        `[PUR02_017] API ${apiMs}ms · Grid ${gridMs}ms · rows ${processed.length}`
      );
    }
  } catch (error) {
    afterSearch.value = false;
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
/** API blnChk === 1 이면 팝업에서 확정·확정취소 비활성 */
const popupConfirmLocked = ref(false);
/** 확정 전표(strStatus !== '01') 또는 blnChk 잠금 시 상세 그리드 입고수량 수정 불가 */
const isPopupDetailReadOnly = computed(
  () => disabled1.value || popupConfirmLocked.value
);

const progid = ref(1);
const initGrid = () => {
  rowData.value = [];
  mainGridRef.value?.clearRows?.();

  if (cond5.value == 0) {
    progid.value = 1;
  } else if (cond5.value == 1) {
    progid.value = 2;
  } else if (cond5.value == 2) {
    progid.value = 3;
  } else if (cond5.value == 3) {
    progid.value = 4;
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

const rowData2 = ref([]);
const forPopupOrderStoreCd = ref("");
const forPopupOrderNo = ref("");
const tempGroup = ref("");
const tempStore = ref("");
const tempBClient = ref("");
const tempCheckNo = ref("");
const tempCheckDate = ref("");
const tempPart = ref("");
const scond5 = ref("");
const scond6 = ref("");
const scond8 = ref("");
const scond9 = ref("");

/** 그리드/서버 YYYYMMDD(또는 8자리 숫자문자) → 화면 표시 YYYY-MM-DD */
function formatYmdDigitsToIsoDate(v) {
  if (v == null || v === "") return "";
  const raw = String(v).trim().replace(/-/g, "");
  if (raw.length === 8 && /^\d{8}$/.test(raw)) {
    return `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`;
  }
  return String(v);
}

function isBlnChkLockedApiValue(v) {
  if (v === true) return true;
  if (v === 1 || v === "1") return true;
  const n = Number(v);
  return !Number.isNaN(n) && n === 1;
}

function rowHasBlnChkLocked(row) {
  if (row == null || typeof row !== "object") return false;
  return isBlnChkLockedApiValue(row.blnChk);
}

const dblclickedRowData = async (row) => {
  if (!row || typeof row !== "object") return;

  popupConfirmLocked.value = false;

  if (row.strStatus === "01") {
    disabled1.value = false;
    scond7.value = toYmdDigits(row.dtmCheckDate)
      ? formatYmdDigitsToIsoDate(row.dtmCheckDate)
      : formatLocalDate(new Date());
  } else {
    disabled1.value = true;
    scond7.value = toYmdDigits(row.dtmCheckDate)
      ? formatYmdDigitsToIsoDate(row.dtmCheckDate)
      : formatYmdDigitsToIsoDate(row.dtmOrderDate);
  }
  scond.value = `${row.strStoreName} / ${row.strPartName}`;
  scond2.value = row.strOrderNo;
  scond3.value = formatYmdDigitsToIsoDate(row.dtmExpectedDate);
  scond4.value = row.strSupplierName;
  scond5.value = row.strComments ?? "";
  openPopUp.value = true;
  tempGroup.value = row.lngStoreGroup;
  tempStore.value = row.lngStoreCode;
  tempCheckNo.value = row.strCheckNo;
  tempBClient.value = row.lngSupplierID;
  tempCheckDate.value = toYmdDigits(row.dtmCheckDate);
  tempPart.value = row.lngPartCode;
  scond8.value = row.strCheckEmpName ?? "";
  scond9.value = row.strStoreCheckComments ?? "";
  scond6.value = row.strCheckComments ?? "";

  const lockedFromMain = rowHasBlnChkLocked(row);

  rowData2.value = [];
  try {
    const res = await getStockOrderDetails(
      row.lngStoreGroup,
      row.lngStoreCode,
      row.strOrderNo,
      row.lngSupplierID,
      toYmdDigits(row.dtmExpectedDate),
      store.state.userData.strLanguage
    );
    rowData2.value = res.data.List;
    updatedrowdata2.value = res.data.List;
    const lockedFromDetail =
      Array.isArray(res.data.List) &&
      res.data.List.some((r) => rowHasBlnChkLocked(r));
    popupConfirmLocked.value = lockedFromMain || lockedFromDetail;
  } catch (error) {
    popupConfirmLocked.value = lockedFromMain;
  }
};

const checkedrowdata = ref([]);

const checkedRowData = (e) => {
  checkedrowdata.value = e;
};
const startDate = (e) => {
  sDate.value = e;
};
const endDate = (e) => {
  eDate.value = e;
};

const scond = ref("");
const scond2 = ref("");
const scond3 = ref("");
const scond4 = ref("");
const scond7 = ref("");

const exportExcel2 = ref(false);
const excelButton2 = () => {
  documentSubTitle2.value = "입고확정일 : " + scond7.value;
  exportExcel2.value = !exportExcel2.value;
};

const saveButton = async () => {
  if (
    parseInt(toYmdDigits(tempCheckDate.value), 10) >
    parseInt(toYmdDigits(scond7.value), 10)
  ) {
    await Swal.fire({
      title: "경고",
      text: "발주일보다 빠른 날짜로 매입확정을 하실 수 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  try {
    const lngstockids = updatedrowdata2.value
      .map((item) => item.lngStockID)
      .join("\u200b");
    const qtys = updatedrowdata2.value
      .map((item) => item.dblCheckQty)
      .join("\u200b");
    const unitprices = updatedrowdata2.value
      .map((item) => item.curUnitPrice)
      .join("\u200b");
    const supply = updatedrowdata2.value
      .map((item) => item.curSupply)
      .join("\u200b");
    const taxs = updatedrowdata2.value
      .map((item) => item.curTax)
      .join("\u200b");
    const ordernos = updatedrowdata2.value
      .map((item) => item.strOrderNo)
      .join("\u200b");
    const orderseqs = updatedrowdata2.value
      .map((item) => item.lngOrderSeq)
      .join("\u200b");
    const comments = updatedrowdata2.value
      .map((item) => item.strCheckComments)
      .join("\u200b");

    console.log(tempPart.value);
    const res = await saveStockCheckMasterDetailByPart(
      tempGroup.value,
      tempStore.value,
      scond7.value.replaceAll("-", ""),
      scond9.value,
      1,
      scond8.value,
      tempPart.value,
      tempBClient.value,

      lngstockids,
      qtys,
      unitprices,
      supply,
      taxs,
      ordernos,
      orderseqs,
      store.state.userData.lngSequence,
      comments
    );

    console.log(res);
    if (res.data.RESULT_CD == "00") {
      await Swal.fire({
        title: "성공",
        text: "확정이 완료되었습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
      openPopUp.value = false;
    } else {
      await Swal.fire({
        title: "경고",
        text: "저장에 실패하였습니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      openPopUp.value = false;
    }
  } catch (error) {
    console.log(error);
  } finally {
    searchButton();
  }
};

const updatedrowdata2 = ref([]);
const updatedRowData2 = (e) => {
  updatedrowdata2.value = e;
};

const cancelButton = async () => {
  try {
    const res = await checkStockCloseDate(
      tempGroup.value,
      tempStore.value,
      scond7.value.replaceAll("-", "")
    );

    ////console.log(res);

    const result = res.data.List.filter((item) =>
      item.dtmMonth.includes(scond7.value.replaceAll("-", "").slice(0, 6))
    );

    if (result[0].strClosed == "Y") {
      await Swal.fire({
        title: "경고",
        text: "해당 매입 사항은 마감되어 취소할 수 없습니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }
    //console.log(result);
  } catch (error) {}
  try {
    const res = await cancelStockConfirm(
      tempGroup.value,
      tempStore.value,
      scond2.value,
      tempCheckDate.value,
      tempCheckNo.value,
      toYmdDigits(scond7.value),
      tempBClient.value,
      store.state.userData.lngSequence
    );

    if (res.data.RESULT_CD == "00") {
      await Swal.fire({
        title: "성공",
        text: "확정 취소가 완료되었습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
      openPopUp.value = false;
    } else {
      await Swal.fire({
        title: "경고",
        text: "확정 취소가 실패하였습니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      openPopUp.value = false;
    }
  } catch (error) {
  } finally {
    searchButton();
  }
};

const confirmButton = async () => {
  const hasGridData = Array.isArray(rowData.value) && rowData.value.length > 0;
  const hasChecked =
    Array.isArray(checkedrowdata.value) && checkedrowdata.value.length > 0;

  if (!hasGridData || !hasChecked) {
    await Swal.fire({
      title: "알림",
      text: "확정할 전표가 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  try {
    await Swal.fire({
      title: "알림",
      text: "선택된 전표를 매입확정 하시겠습니까?",
      icon: "success",
      confirmButtonText: "확인",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const groupCd = checkedrowdata.value
          .map((item) => item.lngStoreGroup)
          .join("\u200b");
        const storecds = checkedrowdata.value
          .map((item) => item.lngStoreCode)
          .join("\u200b");
        const partcds = checkedrowdata.value
          .map((item) => item.lngPartCode)
          .join("\u200b");
        const ordernos = checkedrowdata.value
          .map((item) => item.strOrderNo)
          .join("\u200b");
        const orderdates = checkedrowdata.value
          .map((item) => toYmdDigits(item.dtmOrderDate))
          .join("\u200b");
        const dtmExpectedDate = checkedrowdata.value
          .map((item) => toYmdDigits(item.dtmExpectedDate))
          .join("\u200b");
        const res = await saveStockCheckedAllByPart(
          groupCd,
          storecds,
          partcds,
          ordernos,
          orderdates,
          dtmExpectedDate
        );

        console.log(res);

        if (res.data.RESULT_CD == "00") {
          Swal.fire({
            title: "성공",
            text: "선택된 전표가 저장되었습니다.",
            icon: "success",
            confirmButtonText: "확인",
          });
        } else {
          Swal.fire({
            title: "실패",
            text: "선택된 전표의 저장이 실패하였습니다.",
            icon: "error",
            confirmButtonText: "확인",
          });
        }
      } else {
        return;
      }
    });
  } catch (error) {
  } finally {
    searchButton();
  }
  //try
};
</script>

<style scoped>
/*
 * 조회 AREA — 3열×2행(2행: 상태 · 거래처 · 빈칸)
 * 발주일자 열 가중치↑, 패널 좌우 패딩 축소.
 */
.pur017-search-grid {
  --pur017-col-fr-date: 1.28;
  --pur017-col-fr-part: 0.88;
  /* Datepicker2 From~To: date 2개 flex 1 + ~ + 달력버튼 — 첫 date 칸 너비 */
  --pur017-date-inline-gap: 0.125rem;
  --pur017-date-span-chrome: 0.625rem;
  --pur017-date-btn-chrome: 1.65rem;
  --pur017-date-peer-fixed: calc(
    var(--pur017-date-span-chrome) + var(--pur017-date-btn-chrome) +
      3 * var(--pur017-date-inline-gap)
  );
  --pur017-date-single-input-width: calc(
    (100% - var(--pur017-date-peer-fixed)) / 2
  );
  display: grid;
  width: 100%;
  min-width: 0;
  align-items: center;
  /* 1열(발주일자)에 가로 여유 — 좁아질 때 일자가 덜 잘리도록 */
  grid-template-columns: minmax(0, 1.28fr) minmax(0, 1fr) minmax(0, 0.88fr);
  column-gap: var(--pur017-item-gap);
  row-gap: var(--pur017-item-gap);
}

.pur017-cell {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: var(--pur017-item-gap);
}

.pur017-cell--span-2 {
  grid-column: span 2;
}

.pur017-grid-filler {
  visibility: hidden;
  pointer-events: none;
  min-height: 2rem;
}

.pur017-sg-label {
  flex: 0 0 var(--pur017-label-col);
  width: var(--pur017-label-col);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 0.9375rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
}

.pur017-cell-field {
  min-width: 0;
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  width: 100%;
}

.pur017-cell-field > * {
  min-width: 0;
  width: 100%;
}

.pur017-search-panel .pur017-search-grid select.pur017-sg-select {
  box-sizing: border-box;
  border: 1px solid var(--pur017-control-border) !important;
}

.pur017-search-panel .pur017-search-grid select.pur017-sg-select:focus {
  border-color: #3b82f6 !important;
}

/* 상태 — 1행 발주일자 첫 date input과 동일 가로, 위치(1열) 유지 */
.pur017-status-combo-cap {
  justify-content: flex-start;
}

.pur017-cell-field.pur017-status-combo-cap > select.pur017-sg-select {
  flex: 0 0 auto;
  width: var(--pur017-date-single-input-width);
  max-width: 100%;
}

.pur017-search-panel .pur017-pick-slot :deep(select) {
  border: 1px solid var(--pur017-control-border) !important;
}

.pur017-search-panel .pur017-pick-slot :deep(select:focus) {
  border-color: #3b82f6 !important;
}

.pur017-search-panel .pur017-pick-slot :deep(.pickstore-vs-shell),
.pur017-search-panel .pur017-bc-slot :deep(.pickstore-vs-shell) {
  border: 1px solid var(--pur017-control-border) !important;
  box-sizing: border-box;
  max-width: 100%;
  min-width: 0;
}

/* 거래처 v-select — PickStore 매장명 콤보(flex-1)와 동일 가로 */
.pur017-vendor-combo-cap :deep(.pickstore-vs-shell) {
  width: 100%;
  max-width: calc(100% - 5.75rem - 4.5rem - 2 * var(--pur017-item-gap));
}

.pur017-search-panel .pur017-pick-slot :deep(.pickstore-vs-shell) {
  width: 100%;
}

.pur017-search-panel .pur017-pick-slot :deep(div.relative.min-w-0.flex-1) {
  max-width: 100% !important;
  width: 100% !important;
}

.pur017-bc-slot :deep(> div.flex.text-base) {
  width: 100%;
  min-width: 0;
}

/* Datepicker2 루트: 값 칸 가로 채움 */
.pur017-date-slot :deep(> div.flex.justify-start.items-center) {
  margin-left: 0;
  padding-left: 0;
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  gap: 0.25rem !important;
}

/* From~To: flex 행으로 두 date가 동일 비율 확장(한쪽만 비대 방지) */
.pur017-date-slot :deep(> div.flex > div.inline-flex) {
  display: flex !important;
  flex: 1 1 auto;
  width: 100%;
  min-width: 0;
  flex-wrap: nowrap;
  align-items: center;
  gap: 0.125rem !important;
}

.pur017-search-panel .pur017-date-slot :deep(input[type="date"]) {
  box-sizing: border-box;
  flex: 0 0 auto;
  width: var(--pur017-date-single-input-width);
  min-width: 5rem;
  max-width: var(--pur017-date-single-input-width);
  height: 2rem;
  min-height: 2rem;
  padding-left: 0.4rem;
  padding-right: 0.25rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  border-radius: 0.375rem;
  border: 1px solid var(--pur017-control-border) !important;
}

.pur017-search-panel .pur017-date-slot :deep(input[type="date"]:focus) {
  border-color: #3b82f6 !important;
}

.pur017-date-slot :deep(> div.flex > div.inline-flex > span),
.pur017-date-slot :deep(> div.flex > div.inline-flex > button) {
  flex-shrink: 0;
}

.pur017-date-slot :deep(> div.flex > div.inline-flex > span) {
  padding-left: 0.05rem;
  padding-right: 0.05rem;
}

.pur017-date-slot :deep(> div.flex > div.inline-flex > button) {
  width: 1.65rem !important;
  height: 1.65rem !important;
  min-width: 1.65rem;
  margin-left: 0 !important;
}

.pur017-date-slot :deep(> div.flex > div.inline-flex > button img) {
  max-width: 85%;
  max-height: 85%;
}

@media (max-width: 1280px) {
  .pur017-search-grid {
    --pur017-col-fr-date: 1.35;
    --pur017-col-fr-part: 0.8;
    grid-template-columns: minmax(0, 1.35fr) minmax(0, 0.95fr) minmax(0, 0.8fr);
  }
}

.pur017-pick-slot {
  overflow-x: auto;
  scrollbar-width: thin;
}

.pur017-pick-slot :deep(> div.flex.text-base) {
  width: 100%;
  min-width: 0;
  gap: var(--pur017-item-gap) !important;
}

.pur017-pick-slot :deep(> div.flex > div:first-child) {
  display: none;
}

.pur017-bc-slot :deep(> div.flex.items-center) {
  margin-top: 0;
}

/* 매입 상세(팝업) 상단 항목 — PUR01_019INS 발주 확인/출고(팝업)과 동일 구조 */
.pur017-popup-fields {
  box-sizing: border-box;
}

.pur017-popup-grid {
  display: grid;
  width: 100%;
  min-width: 0;
  grid-template-columns:
    minmax(0, var(--pur017-popup-label)) minmax(0, 1fr)
    minmax(0, var(--pur017-popup-label)) minmax(0, 1fr);
  column-gap: 0.75rem;
  row-gap: var(--pur017-popup-gap);
  align-items: center;
}

.pur017-popup-label {
  min-width: 0;
  max-width: var(--pur017-popup-label);
}

.pur017-popup-label-inner {
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

.pur017-popup-cell {
  display: flex;
  min-width: 0;
  align-items: center;
}

.pur017-popup-cell--span {
  grid-column: 2 / -1;
}

.pur017-popup-input {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  height: 2rem;
  min-height: 2rem;
  border-radius: 0.375rem;
  border: 1px solid var(--pur017-popup-border) !important;
  background-color: #fff;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: rgb(55 65 81);
}

.pur017-popup-input:disabled {
  background-color: rgb(229 231 235);
  color: rgb(75 85 99);
}

.pur017-popup-input--editable:focus {
  border-color: #3b82f6 !important;
  outline: none;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.35);
}
</style>
