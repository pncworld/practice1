<!-- /*--############################################################################
# Filename : PUR02_017INS.vue                                                  
# Description : 구매관리2 > 매입 관리 > 매입 확정(파트별).                      
# Date :2025-09-19                                                             
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <!-- 조회조건 -->
  <div class="h-full" @click="handleParentClick">
    <div class="flex justify-between items-center w-full overflow-y-hidden">
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
      class="pur017-search-panel z-10 mt-3 w-full min-w-0 overflow-x-auto rounded-lg bg-gray-200 px-24 py-4">
      <div
        class="pur017-search-grid min-w-0"
        :style="{
          '--pur017-control-border': pur017ControlBorder,
          '--pur017-item-gap': pur017ItemGap,
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
          <div class="pur017-cell-field min-w-0">
            <select
              id="pur02-017-status"
              v-model="cond"
              class="pur017-sg-select h-8 w-full min-w-0 rounded-md border border-solid bg-white text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
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
          <div class="pur017-cell-field pur017-bc-slot min-w-0">
            <BusinessClient compact-search-bar @SupplierId="SupplierId" />
          </div>
        </div>
        <!-- 3열×2행 정렬: 2행 3칸 균등 간격 유지 -->
        <div class="pur017-cell pur017-grid-filler" aria-hidden="true" />
      </div>
    </div>

    <!-- 조회조건 -->
    <!-- 그리드 영역 (조회 AREA와 안내 문구 사이 살짝 여백) -->
    <div class="mt-2 w-full h-[65vh]">
      <div class="font-semibold ml-2">
        [미입고]: 입고수량이 발주수량보다 적게 입고되었거나 입고가 안된 경우.
        [입고완료] : 입고수량이 발주수량과 같거나 많이 입고된 경우
      </div>
      <Realgrid
        :progname="'PUR02_017INS_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :setStateBar="false"
        :setFooter="true"
        :documentTitle="'PUR02_017INS'"
        :selectionStyle="'block'"
        :checkRenderEditable="true"
        :checkRowAuto="false"
        :checkRowAuto2="true"
        :checkAbleExpressionCol="'lngCheck'"
        :checkAbleExpressionCol2="'blnChk'"
        :checkAbleExpressionVal="'0'"
        @checkedRowData="checkedRowData"
        @dblclickedRowData="dblclickedRowData"
        :documentSubTitle="documentSubTitle"
        :rowStateeditable="false"
        :exporttoExcel="exportExcel">
      </Realgrid>
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
          :inputOnlyNumberColumn="'dblCheckQty'"
          :CalculateTaxColId="'curTax'"
          :editableColId="'dblCheckQty'"
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

import Realgrid from "@/components/realgrid.vue";
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

import { onMounted, ref } from "vue";
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

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

const cond = ref("01");
const cond2 = ref(0);
const cond3 = ref(0);
const cond4 = ref("");
const cond5 = ref(0);
const store = useStore();

/** 조회 AREA — PUR03_037RPT·search-area-layout.mdc 패턴(3열×2행) */
const pur017ControlBorder = "#cbd5e1";
const pur017ItemGap = "0.75rem";
/** 매장 v-select가 열을 가로로 채우도록 기본 12rem 상한 해제(규칙 예: 96) */
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
  try {
    store.state.loading = true;
    initGrid();

    const res = await getStockOrderCheckListByPart(
      groupCd.value,
      storeCode.value,
      cond2.value,
      supplierid.value,
      sDate.value.replaceAll("-", ""),
      eDate.value.replaceAll("-", ""),
      cond.value
    );

    rowData.value = res.data.List;
    console.log(res);
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
/** API blnChk === 1 이면 팝업에서 확정·확정취소 비활성 */
const popupConfirmLocked = ref(false);

const progid = ref(1);
const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }

  if (cond5.value == 0) {
    progid.value = 1;
  } else if (cond5.value == 1) {
    progid.value = 2;
  } else if (cond5.value == 2) {
    progid.value = 3;
  } else if (cond5.value == 3) {
    progid.value = 4;
  }

  reload.value = !reload.value;
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

const dblclickedRowData = async (e) => {
  console.log(e);

  popupConfirmLocked.value = false;

  if (e[22] == "01") {
    disabled1.value = false;
    scond7.value =
      e[7].slice(0, 4) + "-" + e[7].slice(4, 6) + "-" + e[7].slice(6, 8);
  } else {
    disabled1.value = true;
    scond7.value =
      e[6].slice(0, 4) + "-" + e[6].slice(4, 6) + "-" + e[6].slice(6, 8);
  }
  scond.value = `${e[1]} / ${e[2]}`;
  scond2.value = e[4];
  scond3.value = formatYmdDigitsToIsoDate(e[7]);
  scond4.value = e[3];
  scond5.value = e[18];
  openPopUp.value = true;
  tempGroup.value = e[15];
  tempStore.value = e[16];
  tempCheckNo.value = e[5];
  tempBClient.value = e[17];
  tempCheckDate.value = e[8];
  tempPart.value = e[23];
  scond8.value = e[21];
  scond9.value = e[20];
  scond6.value = e[19];

  let lockedFromMain = false;
  if (typeof e?.index === "number" && rowData.value?.[e.index]) {
    lockedFromMain = rowHasBlnChkLocked(rowData.value[e.index]);
  }

  //console.log(scond7.value);
  try {
    const res = await getStockOrderDetails(
      e[15],
      e[16],
      e[4],
      e[17],
      e[7],
      store.state.userData.strLanguage
    );
    console.log(res);
    rowData2.value = res.data.List;
    updatedrowdata2.value = res.data.List;
    const lockedFromDetail =
      Array.isArray(res.data.List) &&
      res.data.List.some((row) => rowHasBlnChkLocked(row));
    popupConfirmLocked.value = lockedFromMain || lockedFromDetail;
  } catch (error) {
    popupConfirmLocked.value = lockedFromMain;
  }
};

const checkedrowdata = ref([]);

const checkedRowData = (e) => {
  console.log(e);

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
    parseInt(tempCheckDate.value) > parseInt(scond7.value.replaceAll("-", ""))
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
      scond7.value.replaceAll("-", ""),
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
          .map((item) => item.dtmOrderDate)
          .join("\u200b");
        const dtmExpectedDate = checkedrowdata.value
          .map((item) => item.dtmExpectedDate)
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
 * PUR03_037RPT·search-area-layout.mdc — 3열×2행
 * repeat(3, minmax(0, 1fr)) + column-gap/row-gap 동일 변수로 열 간격 통일.
 * 라벨 통일·가운데 정렬, 값 칸 width:100%로 칸마다 L/R 여백 균형.
 */
.pur017-search-grid {
  --pur017-label-col: 6.5rem;
  display: grid;
  width: 100%;
  min-width: 0;
  align-items: center;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  column-gap: var(--pur017-item-gap);
  row-gap: var(--pur017-item-gap);
}

.pur017-cell {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: var(--pur017-item-gap);
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
  font-size: 1rem;
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
}

/* From~To: flex 행으로 두 date가 동일 비율 확장(한쪽만 비대 방지) */
.pur017-date-slot :deep(> div.flex > div.inline-flex) {
  display: flex !important;
  flex: 1 1 auto;
  width: 100%;
  min-width: 0;
  flex-wrap: nowrap;
  align-items: center;
}

.pur017-search-panel .pur017-date-slot :deep(input[type="date"]) {
  box-sizing: border-box;
  flex: 1 1 0;
  min-width: 0;
  width: 100%;
  max-width: none;
  height: 2rem;
  min-height: 2rem;
  padding-left: 0.75rem;
  padding-right: 0.5rem;
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
