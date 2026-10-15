<!-- /*--############################################################################
# Filename : PUR02_031INS.vue                                                  
# Description : 구매관리2 > 매입 관리 > 매입등록                      
# Date :2025-08-26                                                             
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
        <button type="button" @click="addButton" class="button new md:w-auto w-14">
          신규
        </button>
        <button type="button" @click="saveButton" class="button save md:w-auto w-14">
          저장
        </button>
        <button type="button" @click="deleteButton" class="button delete md:w-auto w-14">
          삭제
        </button>
        <button type="button" @click="excelButton" class="button save w-auto excel">
          엑셀
        </button>
      </div>
    </div>

    <div
      class="pur031-search-panel z-10 mt-3 w-full min-w-0 shrink-0 rounded-lg bg-gray-200"
      :style="{
        '--pur031-control-border': pur031ControlBorder,
        '--pur031-item-gap': pur031ItemGap,
        '--pur031-col-gap': pur031ColGap,
        '--pur031-panel-pad-x': pur031PanelPadX,
        '--pur031-date-field-w': pur031DateFieldW,
        '--pur031-label-col': pur031LabelCol,
        '--pur031-row-min-h': pur031RowMinH,
        '--pur031-control-h': pur031ControlH,
      }">
      <div class="pur031-search-grid min-w-0">
        <div class="pur031-sg-label">조회기간</div>
        <div class="pur031-cell-field pur031-date-slot min-w-0">
          <Datepicker2
            ref="datepicker"
            omit-main-label
            filter-bar-align
            :mainName="'조회기간'"
            :initToday="1"
            :closePopUp="closePopUp"
            @excelDate="excelDate"
            @endDate="endDate"
            @startDate="startDate" />
        </div>
        <div class="pur031-spacer" aria-hidden="true"></div>
        <div class="pur031-sg-label">매장명</div>
        <div class="pur031-cell-field pur031-pick-slot min-w-0">
          <PickStore
            compact-search-bar
            main-name=""
            @update:storeGroup="lngStoreGroup"
            :hideGroup="false"
            :defaultStoreType2="true"
            :hideAttr="false"
            @storeNm="excelStore"
            @update:storeCd="lngStoreCode" />
        </div>
        <div class="pur031-spacer" aria-hidden="true"></div>
        <div class="pur031-sg-label">거래처</div>
        <div class="pur031-cell-field pur031-bc-slot min-w-0">
          <BusinessClient
            compact-search-bar
            :default-nm="'전체'"
            @SupplierId="SupplierId"
            @SupplierNm="SupplierNm" />
        </div>
      </div>
    </div>

    <div class="mt-2 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <div class="pur031-pane-master flex min-h-0 min-w-0 flex-col overflow-hidden">
        <Realgrid
          class="pur031-grid-body min-h-0 w-full flex-1"
          :progname="'PUR02_031INS_VUE'"
          :progid="1"
          :rowData="rowData"
          :reload="reload"
          :setFooter="true"
          :documentTitle="'PUR02_031INS'"
          @clickedRowData="clickedRowData"
          @checkedRowData="checkedRowData"
          :checkRowAuto="false"
          :checkRowAuto2="true"
          :checkRowAuto2Col="'Selected'"
          :checkRenderEditable="true"
          :documentSubTitle="documentSubTitle"
          :rowStateeditable="false"
          :exporttoExcel="exportExcel" />
      </div>

      <div
        class="pur031-search-panel pur031-sub-panel z-10 mt-2 w-full min-w-0 shrink-0 rounded-lg bg-gray-200"
        :style="{
          '--pur031-control-border': pur031ControlBorder,
          '--pur031-item-gap': pur031ItemGap,
          '--pur031-col-gap': pur031ColGap,
          '--pur031-panel-pad-x': pur031PanelPadX,
          '--pur031-date-field-w': pur031DateFieldW,
          '--pur031-label-col': pur031LabelCol,
          '--pur031-row-min-h': pur031RowMinH,
          '--pur031-control-h': pur031ControlH,
        }">
        <div class="pur031-sub-grid min-w-0">
          <div class="pur031-sg-label">거래처</div>
          <div class="pur031-cell-field pur031-bc-slot min-w-0">
            <BusinessClient
              compact-search-bar
              :disable="true"
              :select-supplier-id="selectSupplierId"
              :default-nm="'선택'"
              @SupplierId="SupplierId2"
              @SupplierNm="onSubSupplierNm" />
          </div>
          <div class="pur031-spacer" aria-hidden="true"></div>
          <div class="pur031-sg-label">자재명</div>
          <div class="pur031-cell-field pur031-item-slot min-w-0">
            <input
              id="pur02-031-cond2"
              v-model="cond2"
              class="pur031-item-input"
              type="text"
              autocomplete="off"
              :disabled="!masterRowSelected"
              @keyup.enter="searchButton2" />
          </div>
          <div class="pur031-spacer pur031-spacer--btn">
            <button
              type="button"
              class="pur031-sub-btn"
              :disabled="!masterRowSelected"
              @click.stop="searchButton2">
              조회
            </button>
            <button
              type="button"
              class="pur031-sub-btn pur031-sub-btn--reset"
              :disabled="!masterRowSelected"
              @click.stop="resetSelectedDetail">
              초기화
            </button>
          </div>
        </div>
      </div>

      <div class="pur031-pane-detail mt-2 flex min-h-0 min-w-0 flex-col overflow-hidden">
        <div
          v-if="masterRowSelected"
          class="pur031-detail-legend shrink-0">
          <span class="pur031-legend-item">
            <i class="pur031-swatch pur031-swatch--added" aria-hidden="true"></i>
            신규 추가
          </span>
          <span class="pur031-legend-item">
            <i class="pur031-swatch pur031-swatch--edited" aria-hidden="true"></i>
            수량 수정
          </span>
        </div>
        <Realgrid
          class="pur031-grid-body min-h-0 w-full flex-1"
          :progname="'PUR02_031INS_VUE'"
          :progid="2"
          :rowStateeditable="false"
          :editableColId="'dblCheckQty'"
          :AutoCalculateDataMainColId="['curSupply']"
          :AutoCalculateDataSubColId="[
            `values['curUnitPrice'] * values['dblCheckQty']`,
          ]"
          :inputOnlyNumberColumn="'curSupply'"
          :input-unsigned-decimal-column="'dblCheckQty'"
          :CalculateTaxColId="'curTax'"
          :setFooter="true"
          @realgridname="onDetailGridName"
          @gridReady="onDetailGridName"
          @updatedRowData="updatedRowData2"
          @allStateRows="allStateRows"
          :rowData="rowData2" />
      </div>

      <div class="pur031-memo shrink-0">
        <div class="pur031-memo-label">메모</div>
        <textarea v-model="memo" class="pur031-memo-text"></textarea>
      </div>
    </div>
  </div>

  <Teleport to="body">
    <div
      v-if="showp"
      class="pur031-popup-backdrop"
      @click.self.prevent>
      <div
        class="pur031-popup-dialog pur031-popup-dialog--list"
        role="dialog"
        aria-modal="true"
        :style="listPopupStyle"
        @click.stop>
        <div
          class="pur031-popup-list-bar pur031-popup-head--drag"
          @pointerdown="onListPopupDragStart">
          <h2 class="pur031-popup-list-title">자재리스트 추가</h2>
        </div>
        <div class="pur031-popup-list-tools">
          <div class="pur031-popup-supplier">
            거래처 : {{ selectedMasterSupplierNm || "선택" }}
          </div>
          <div class="pur031-popup-list-search">
            <span class="pur031-popup-list-search-label">자재명</span>
            <input
              type="text"
              class="pur031-popup-list-search-input"
              :value="listPopupNameKeyword"
              @compositionstart="onListPopupNameCompositionStart"
              @compositionupdate="onListPopupNameLiveInput"
              @compositionend="onListPopupNameCompositionEnd"
              @input="onListPopupNameLiveInput"
              @keydown.enter.prevent="applyListPopupNameFilter" />
          </div>
          <div class="pur031-popup-actions">
            <button
              type="button"
              class="pur031-sub-btn pur031-sub-btn--icon pur031-sub-btn--add"
              @click="addPopupCheckedToDetail">
              추가
            </button>
            <button
              type="button"
              class="pur031-sub-btn pur031-sub-btn--icon pur031-sub-btn--close"
              @click="showp = false">
              닫기
            </button>
          </div>
        </div>
        <div class="pur031-popup-grid-wrap">
          <Realgrid
            class="pur031-grid-body min-h-0 h-full w-full"
            :progname="'PUR02_031INS_Popup_VUE'"
            :progid="1"
            :rowStateeditable="false"
            :showCheckBar="true"
            :checkRowAuto="true"
            selectionStyle="singleRow"
            @realgridname="onListPopupGridName"
            @gridReady="onListPopupGridReady"
            @checkedRowData="popupCheckedRowData"
            :rowData="rowData3" />
        </div>
      </div>
    </div>
  </Teleport>

  <Teleport to="body">
    <div
      v-if="showp2"
      class="pur031-popup-backdrop"
      @click.self.prevent>
      <div
        class="pur031-popup-dialog"
        role="dialog"
        aria-modal="true"
        :style="newPopupStyle"
        @click.stop>
        <div
          class="pur031-popup-head pur031-popup-head--drag"
          @pointerdown="onNewPopupDragStart">
          <h2 class="pur031-popup-title">매입등록 신규</h2>
          <div class="pur031-popup-actions">
            <button
              type="button"
              class="pur031-sub-btn pur031-sub-btn--icon pur031-sub-btn--search"
              @click.stop="searchButton3">
              조회
            </button>
            <button
              type="button"
              class="pur031-sub-btn pur031-sub-btn--icon pur031-sub-btn--save"
              @click.stop="saveButton3">
              저장
            </button>
            <button
              type="button"
              class="pur031-sub-btn pur031-sub-btn--icon pur031-sub-btn--close"
              @click.stop="showp2 = false">
              닫기
            </button>
          </div>
        </div>
        <div class="pur031-popup-hint">
          <span class="text-red-500"
            >신규매입상품에 대해서 {매입단가},{매입수량} 을 조정할 수
            있습니다.</span>
          <div>{공급가액} = {매입단가} * {매입수량}</div>
          <div>{합계금액} = {공급가액} + {부가세액}</div>
        </div>
        <div
          class="pur031-popup-fields"
          :style="{
            '--pur031-popup-border': pur031ControlBorder,
            '--pur031-popup-label': pur031PopupLabelCol,
            '--pur031-popup-gap': pur031PopupFieldGap,
          }">
          <div class="pur031-popup-grid">
            <div class="pur031-popup-label">
              <div class="pur031-popup-label-inner">매입일자</div>
            </div>
            <div class="pur031-popup-cell">
              <input type="date" class="pur031-popup-input" v-model="scond" />
            </div>
            <div class="pur031-popup-label">
              <div class="pur031-popup-label-inner">매장명</div>
            </div>
            <div class="pur031-popup-cell">
              <input
                type="text"
                class="pur031-popup-input"
                :value="popupStoreDisplay"
                disabled />
            </div>
            <div class="pur031-popup-label">
              <div class="pur031-popup-label-inner">자재명</div>
            </div>
            <div class="pur031-popup-cell">
              <input
                type="text"
                class="pur031-popup-input"
                :value="newPopupNameKeyword"
                @compositionstart="onNewPopupNameCompositionStart"
                @compositionupdate="onNewPopupNameLiveInput"
                @compositionend="onNewPopupNameCompositionEnd"
                @input="onNewPopupNameLiveInput"
                @keydown.enter.prevent="applyNewPopupNameFilter" />
            </div>
            <div class="pur031-popup-label">
              <div class="pur031-popup-label-inner">거래처</div>
            </div>
            <div class="pur031-popup-cell pur031-popup-bc">
              <BusinessClient
                :key="'new-bc-' + newPopupBcKey + '-' + String(newPopupSupplierId)"
                compact-search-bar
                :default-nm="'선택'"
                :disable="newPopupSupplierLocked"
                :select-supplier-id="newPopupSupplierId"
                :select-supplier-label="newPopupSupplierNm"
                @SupplierId="SupplierId3" />
            </div>
          </div>
        </div>
        <div class="pur031-popup-grid-wrap">
          <Realgrid
            class="pur031-grid-body min-h-0 h-full w-full"
            :progname="'PUR02_031INS_VUE'"
            :progid="2"
            :rowStateeditable="false"
            @realgridname="onNewPopupGridName"
            @updatedRowData="updatedRowData3"
            :editableColId="'dblCheckQty'"
            :AutoCalculateDataMainColId="['curSupply']"
            :AutoCalculateDataSubColId="[
              `values['curUnitPrice'] * values['dblCheckQty']`,
            ]"
            :inputOnlyNumberColumn="'curSupply'"
            :input-unsigned-decimal-column="'dblCheckQty'"
            :CalculateTaxColId="'curTax'"
            :rowData="rowData4" />
        </div>
        <div class="pur031-popup-memo">
          <div class="pur031-memo-label">메모</div>
          <textarea
            v-model="scond2"
            placeholder="최대 2000자까지 메모를 남길 수 있습니다."
            class="pur031-popup-memo-text"></textarea>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { commonUrl2, getCommonList } from "@/api/common";
import {
  deleteCheckDetailMasters,
  deleteCheckDetails,
  getCloseDtmDate,
  getPurChaseEnrollList,
  getStockItemDetail,
  getStockItemList4,
  getStockMasterComment,
  insertCheckDetailNew,
  insertStockPriceHistory,
  saveStockMasterDetail,
  updateCheckMasterDetails,
} from "@/api/mipur";
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
import { rgGetInstance } from "@/components/realgridInstanceRegistry.js";
/**
 *  페이지로그 자동 입력
 *  */

import { formatLocalDate, insertPageLog } from "@/customFunc/customFunc";
import {
  matchNameWithChoseong,
  stockDisplayName,
} from "@/utils/choseongFilter";
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

const pur031ControlBorder = "#cbd5e1";
const pur031ItemGap = "2rem";
const pur031ColGap = "1.75rem";
const pur031PanelPadX = "7rem";
const pur031DateFieldW = "21.6rem";
const pur031LabelCol = "6.5rem";
const pur031RowMinH = "2rem";
const pur031ControlH = "2rem";
const pur031PopupLabelCol = "8.5rem";
const pur031PopupFieldGap = "0.5rem";

/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getCommonList(27);

  optionList.value = res.data.List.filter((item) => item.strDCode !== "01");

  const today = formatLocalDate(new Date());

  scond.value = today;
});

const reload = ref(false);
const rowData = ref([]);
const rowData3 = ref([]);
const listPopupStockAll = ref([]);
const listPopupNameKeyword = ref("");
const listPopupNameComposing = ref(false);
const listPopupGridName = ref("");
const detailGridName = ref("");
const afterSearch = ref(false);

const disabledBusiness = ref(false);
const masterRowSelected = ref(false);
const cond2 = ref("");
const cond3 = ref("");
const newPopupNameKeyword = ref("");
const newPopupNameComposing = ref(false);
const newPopupGridName = ref("");
const updatedrowdata3 = ref([]);
const newPopupStockAll = ref([]);
const cond4 = ref("");
const cond5 = ref(0);
const store = useStore();

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
const storeAccountSearched = ref(false);
const isStoreAccount = () => {
  const u = store.state.userData || {};
  return u.blnBrandAdmin != "True" && String(u.lngPositionType) != "1";
};
const trySearchIfStoreAccountReady = () => {
  if (storeAccountSearched.value) {
    return;
  }
  if (!isStoreAccount()) {
    return;
  }
  if (!sDate.value || !eDate.value) {
    return;
  }
  if (
    storeCode.value == null ||
    storeCode.value === "" ||
    storeCode.value == 0
  ) {
    return;
  }
  storeAccountSearched.value = true;
  searchButton();
};
let dateSearchTimer = null;
const trySearchOnDateChange = () => {
  if (!sDate.value || !eDate.value) {
    return;
  }
  if (
    storeCode.value == null ||
    storeCode.value === "" ||
    storeCode.value == 0
  ) {
    return;
  }
  if (dateSearchTimer) {
    clearTimeout(dateSearchTimer);
  }
  dateSearchTimer = setTimeout(() => {
    dateSearchTimer = null;
    searchButton();
  }, 200);
};
const startDate = (e) => {
  const prev = sDate.value;
  if (prev === e) {
    return;
  }
  sDate.value = e;
  if (prev == null || prev === "") {
    trySearchIfStoreAccountReady();
    return;
  }
  trySearchOnDateChange();
};
const endDate = (e) => {
  const prev = eDate.value;
  if (prev === e) {
    return;
  }
  eDate.value = e;
  if (prev == null || prev === "") {
    trySearchIfStoreAccountReady();
    return;
  }
  trySearchOnDateChange();
};

const selectedDate = ref();
const excelDate = (e) => {
  selectedDate.value = e;
};
const optionList2 = ref([]);

const teamcode = ref();
const lngTeamCode = (e) => {
  teamcode.value = e;
};
const supervisor = ref();
const lngSupervisor = (e) => {
  supervisor.value = e;
};
const storeCode = ref();
const lngStoreCode = (e) => {
  const prev = storeCode.value;
  const changed = prev !== e;
  storeCode.value = e;
  if (!changed) {
    return;
  }
  const empty = e == null || e === "" || e == 0 || e === "0";
  if (empty) {
    initGrid();
    afterSearch.value = false;
    return;
  }
  if (prev == null || prev === "") {
    trySearchIfStoreAccountReady();
    return;
  }
  searchButton();
};

const storeAttr = ref();
const lngStoreAttrs = (e) => {
  storeAttr.value = e;
};

const groupCd = ref();
const lngStoreGroup = (e) => {
  groupCd.value = e;
};

const supplierid = ref("");
const supplierNm = ref("");
const SupplierId = (e) => {
  const prev = supplierid.value;
  if (String(prev ?? "") === String(e ?? "")) {
    return;
  }
  supplierid.value = e;
  if (
    storeCode.value == null ||
    storeCode.value === "" ||
    storeCode.value == 0
  ) {
    return;
  }
  searchButton();
};
const SupplierNm = (e) => {
  supplierNm.value = e;
};
/**
 *  조회 함수
 */
const hideColumnsId = ref([]);
const searchButton = async () => {
  if (storeCode.value == 0) {
    Swal.fire({
      title: "경고",
      text: "매장을 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  try {
    store.state.loading = true;
    initGrid();
    //console.log(store.state.userData);
    const res = await getPurChaseEnrollList(
      groupCd.value,
      storeCode.value,
      store.state.userData.strLanguage,
      sDate.value.replaceAll("-", ""),
      eDate.value.replaceAll("-", ""),
      supplierid.value
    );

    rowData.value = res.data.List;

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

const progid = ref(1);
const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
  if (rowData2.value.length > 0) {
    rowData2.value = [];
  }
  updatedrowdata2.value = [];
  selectSupplierId.value = 0;
  masterRowSelected.value = false;
  disabledBusiness.value = false;
  selectedMasterGroup.value = "";
  selectedMasterStore.value = "";
  selectedMasterSupplier.value = "";
  selectedMasterSupplierNm.value = "";
  selectedMasterOrderNo.value = "";
  lastMasterClick.value = null;
  selectedSupplierid2.value = "";
  cond2.value = "";
  memo.value = "";
  originmemo.value = "";
  dtmDate.value = "";
  originDetailRows.value = [];

  //   if (cond5.value == 0) {
  //     progid.value = 1;
  //   } else if (cond5.value == 1) {
  //     progid.value = 2;
  //   } else if (cond5.value == 2) {
  //     progid.value = 3;
  //   } else if (cond5.value == 3) {
  //     progid.value = 4;
  //   }

  //   reload.value = !reload.value;
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

// 엑셀 추출
const documentSubTitle = ref("");
const selectedExcelList = ref("");

const selectedExcelStore = ref("");
const isRealStoreNm = (name) => {
  const n = name == null ? "" : String(name).trim();
  return n !== "" && n !== "선택" && n !== "전체";
};
const popupStoreDisplay = computed(() => {
  if (isRealStoreNm(selectedExcelStore.value)) {
    return selectedExcelStore.value;
  }
  const sessionNm = store.state.userData?.strStoreName;
  if (isRealStoreNm(sessionNm)) {
    return sessionNm;
  }
  return "";
});
/**
 * 엑셀용 매장 세팅 함수
 */

const excelStore = (e) => {
  if (isRealStoreNm(e)) {
    selectedExcelStore.value = e;
  }
};
const excelList = (e) => {
  selectedExcelList.value = e;
  //comsole.log(e);
};

const rowData2 = ref([]);

const updatedrowdata2 = ref([]);
const hideDetailUnitPriceFooterSum = () => {
  const gv = rgGetInstance(detailGridName.value)?.gridView;
  if (!gv) {
    return;
  }
  try {
    const col = gv.columnByField?.("curUnitPrice");
    if (!col) {
      return;
    }
    col.footer = {
      ...(col.footer || {}),
      expression: "",
      text: "",
      valueCallback: () => "",
    };
    gv.refresh?.();
  } catch (_) {}
};
const onDetailGridName = (name) => {
  if (name) {
    detailGridName.value = name;
  }
  bindDetailRowHighlight();
  bindDetailQtyNav();
  nextTick(() => {
    hideDetailUnitPriceFooterSum();
  });
};
const refreshDetailRowStyle = () => {
  const gv = rgGetInstance(detailGridName.value)?.gridView;
  try {
    gv?.refresh?.();
  } catch (_) {}
};
const bindDetailRowHighlight = () => {
  const gv = rgGetInstance(detailGridName.value)?.gridView;
  if (!gv?.setRowStyleCallback) {
    return;
  }
  gv.setRowStyleCallback((grid, item) => {
    try {
      const dp = grid.getDataSource?.();
      const row =
        dp?.getJsonRow?.(item.dataRow) ||
        dp?.getJsonRow?.(item.index) ||
        {};
      const id = stockIdOf(row);
      if (!id) {
        return "";
      }
      const origin = originByStockId().get(id);
      if (!origin) {
        return "pur031-row-added";
      }
      const nowQty = detailQtyOf(row);
      const wasQty = detailQtyOf(origin);
      if (nowQty != null && wasQty != null && nowQty !== wasQty) {
        return "pur031-row-edited";
      }
    } catch (_) {}
    return "";
  });
  refreshDetailRowStyle();
};
const qtyEditorText = (grid, event) => {
  try {
    const v = grid.getEditValue?.();
    if (v !== undefined && v !== null) {
      return String(v);
    }
  } catch (_) {}
  const el =
    event?.target && typeof event.target.value === "string"
      ? event.target
      : document.activeElement;
  return el && typeof el.value === "string" ? el.value : "";
};
const isQtyDecimalKeyAllowed = (grid, event) => {
  const key = event?.key ?? "";
  if (!key || key.length !== 1) {
    return true;
  }
  if (event?.ctrlKey || event?.metaKey || event?.altKey) {
    return true;
  }
  const text = qtyEditorText(grid, event);
  const el =
    event?.target?.selectionStart != null
      ? event.target
      : document.activeElement;
  const start = typeof el?.selectionStart === "number" ? el.selectionStart : text.length;
  const end = typeof el?.selectionEnd === "number" ? el.selectionEnd : text.length;
  const next = text.slice(0, start) + key + text.slice(end);
  if (key === ".") {
    return next.split(".").length <= 2;
  }
  if (key >= "0" && key <= "9") {
    const dot = next.indexOf(".");
    if (dot >= 0 && next.slice(dot + 1).length > 2) {
      return false;
    }
    return true;
  }
  return false;
};
const openDetailQtyEditor = (grid, dataRow) => {
  try {
    grid.setCurrent({ dataRow, fieldName: "dblCheckQty" });
  } catch (_) {}
  requestAnimationFrame(() => {
    try {
      grid.showEditor?.();
    } catch (_) {}
  });
};
const bindDetailQtyNav = () => {
  const gv = rgGetInstance(detailGridName.value)?.gridView;
  if (!gv) {
    return;
  }
  try {
    if (gv.editOptions) {
      gv.editOptions.enterToNextRow = false;
      gv.editOptions.crossWhenExitLast = false;
    }
  } catch (_) {}
  gv.onKeyDown = function (grid, event) {
    const key = event?.key ?? event?.keyCode ?? event;
    const cur = grid.getCurrent?.() || {};
    const field = cur.fieldName || cur.column || "";
    if (field === "dblCheckQty" && !isQtyDecimalKeyAllowed(grid, event)) {
      if (event?.preventDefault) {
        event.preventDefault();
      }
      return false;
    }
    const isEnter = key === "Enter" || key === 13;
    const isUp = key === "ArrowUp" || key === 38;
    const isDown = key === "ArrowDown" || key === 40;
    if (!isEnter && !isUp && !isDown) {
      return true;
    }
    if (field !== "dblCheckQty") {
      return true;
    }
    let dataRow = cur.dataRow;
    if (dataRow == null || dataRow < 0) {
      try {
        dataRow = grid.getDataRow?.(cur.itemIndex);
      } catch (_) {
        dataRow = -1;
      }
    }
    const dp = grid.getDataSource?.();
    const count = dp?.getRowCount?.() ?? 0;
    let next = dataRow;
    if (isEnter || isDown) {
      next = dataRow + 1;
    } else if (isUp) {
      next = dataRow - 1;
    }
    try {
      grid.commit?.();
    } catch (_) {}
    if (next < 0 || next >= count) {
      openDetailQtyEditor(grid, dataRow);
      if (event?.preventDefault) {
        event.preventDefault();
      }
      return false;
    }
    openDetailQtyEditor(grid, next);
    if (event?.preventDefault) {
      event.preventDefault();
    }
    return false;
  };
};
const updatedRowData2 = (e) => {
  const incoming = Array.isArray(e) ? e : [];
  const originIds = new Set(
    (Array.isArray(originDetailRows.value) ? originDetailRows.value : [])
      .map(stockIdOf)
      .filter(Boolean)
  );
  const prevMap = new Map();
  for (const item of Array.isArray(rowData2.value) ? rowData2.value : []) {
    const id = stockIdOf(item);
    if (id) {
      prevMap.set(id, item);
    }
  }
  updatedrowdata2.value = incoming.map((row) => {
    const id = stockIdOf(row);
    const prev = id ? prevMap.get(id) : null;
    return {
      ...(prev || {}),
      ...row,
      _pur031Added: Boolean(
        prev?._pur031Added || (id && !originIds.has(id))
      ),
    };
  });
  refreshDetailRowStyle();
};

const allstaterows = ref([]);
const allStateRows = (e) => {
  const updated = Array.isArray(e?.updated) ? e.updated : [];
  const created = Array.isArray(e?.created) ? e.created : [];
  allstaterows.value = [...updated, ...created];
};
const selectedSupplierid2 = ref("");
const selectedMasterGroup = ref("");
const selectedMasterStore = ref("");
const selectedMasterSupplier = ref("");
const selectedMasterSupplierNm = ref("");
const selectedMasterOrderNo = ref("");
const SupplierId2 = (e) => {
  ////console.log(e);
  selectedSupplierid2.value = e;
};
const onSubSupplierNm = (e) => {
  if (e && e !== "선택") {
    selectedMasterSupplierNm.value = e;
  }
};

const searchButton2 = async () => {
  if (!masterRowSelected.value) {
    return;
  }
  const group = selectedMasterGroup.value || groupCd.value;
  const store = selectedMasterStore.value || storeCode.value;
  const supplier =
    selectedMasterSupplier.value || selectedSupplierid2.value || selectSupplierId.value;
  if (supplier === "" || supplier == null) {
    Swal.fire({
      title: "경고",
      text: "메인 그리드에서 매입 전표를 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  try {
    const res = await getStockItemList4(
      group,
      store,
      supplier,
      "strStock",
      "",
      "0",
      ""
    );

    //console.log(res);
    listPopupStockAll.value = filterPopupList(res.data.List || []);
    listPopupNameKeyword.value = cond2.value || "";
    clearListPopupChecks();
    showp.value = true;
    await nextTick();
    applyListPopupNameFilter();
  } catch (error) {
    Swal.fire({
      title: "경고",
      text: "자재 조회에 실패했습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
  }
};

const showp = ref(false);
const showp2 = ref(false);

const makeMovePopup = (getSize) => {
  const box = ref({ left: 0, top: 0, w: 480, h: 320 });
  const style = computed(() => ({
    position: "fixed",
    left: `${box.value.left}px`,
    top: `${box.value.top}px`,
    width: `${box.value.w}px`,
    height: `${box.value.h}px`,
    margin: "0",
    maxHeight: "none",
  }));
  const reset = () => {
    const { w, h } = getSize();
    box.value = {
      left: Math.max(0, (window.innerWidth - w) / 2),
      top: Math.max(0, (window.innerHeight - h) / 2),
      w,
      h,
    };
  };
  let drag = null;
  const onPointerMove = (e) => {
    if (!drag) {
      return;
    }
    const dx = e.clientX - drag.x;
    const dy = e.clientY - drag.y;
    box.value = {
      ...box.value,
      left: Math.min(window.innerWidth - 80, Math.max(0, drag.left + dx)),
      top: Math.min(window.innerHeight - 48, Math.max(0, drag.top + dy)),
    };
  };
  const onPointerUp = () => {
    drag = null;
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
  };
  const onDragStart = (e) => {
    if (e.button !== 0) {
      return;
    }
    if (e.target.closest("button")) {
      return;
    }
    e.preventDefault();
    drag = {
      x: e.clientX,
      y: e.clientY,
      left: box.value.left,
      top: box.value.top,
    };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };
  return { style, reset, onDragStart, onPointerUp };
};

const listPopup = makeMovePopup(() => ({
  w: Math.min(window.innerWidth * 0.75, 72 * 16),
  h: Math.min(window.innerHeight * 0.6, 40 * 16),
}));
const newPopup = makeMovePopup(() => ({
  w: Math.min(window.innerWidth * 0.75, 72 * 16),
  h: Math.min(window.innerHeight * 0.8, 52 * 16),
}));
const listPopupStyle = listPopup.style;
const newPopupStyle = newPopup.style;
const onListPopupDragStart = listPopup.onDragStart;
const onNewPopupDragStart = newPopup.onDragStart;

watch(showp, (open) => {
  if (open) {
    listPopup.reset();
  }
});
watch(showp2, (open) => {
  document.body.classList.toggle("pur031-new-popup-open", open);
  if (open) {
    newPopup.reset();
  }
});
onUnmounted(() => {
  document.body.classList.remove("pur031-new-popup-open");
  listPopup.onPointerUp();
  newPopup.onPointerUp();
});

const stockIdOf = (item) => {
  if (item == null) {
    return "";
  }
  if (Array.isArray(item)) {
    const v = item.lngStockID ?? item[0];
    return v == null || v === "" ? "" : String(v);
  }
  const v = item.lngStockID ?? item.LngStockID;
  return v == null || v === "" ? "" : String(v);
};

const subGridStockIds = () => {
  const ids = new Set();
  const rows = Array.isArray(rowData2.value) ? rowData2.value : [];
  for (const row of rows) {
    const id = stockIdOf(row);
    if (id) {
      ids.add(id);
    }
  }
  return ids;
};

const filterPopupList = (list) => {
  const ids = subGridStockIds();
  return (Array.isArray(list) ? list : []).filter((item) => {
    const id = stockIdOf(item);
    return id !== "" && !ids.has(id);
  });
};

const popupCheckedRows = ref([]);
const listPopupCheckedIds = ref(new Set());
let listPopupRestoringChecks = false;
const syncPopupCheckedRowsFromIds = () => {
  const ids = listPopupCheckedIds.value;
  popupCheckedRows.value = (Array.isArray(listPopupStockAll.value)
    ? listPopupStockAll.value
    : []
  ).filter((item) => ids.has(stockIdOf(item)));
};
const clearListPopupChecks = () => {
  listPopupCheckedIds.value = new Set();
  popupCheckedRows.value = [];
};
const refreshListPopupRowStyle = () => {
  const gv = rgGetInstance(listPopupGridName.value)?.gridView;
  try {
    gv?.refresh?.();
  } catch (_) {}
};
const bindListPopupCheckedStyle = () => {
  const gv = rgGetInstance(listPopupGridName.value)?.gridView;
  if (!gv?.setRowStyleCallback) {
    return;
  }
  gv.setRowStyleCallback((grid, item) => {
    try {
      if (grid.isCheckedRow(item.index)) {
        return "pur031-row-checked";
      }
    } catch (_) {}
    return "";
  });
};
const restoreListPopupChecks = () => {
  const inst = rgGetInstance(listPopupGridName.value);
  if (!inst?.gridView || !inst.dataProvider) {
    listPopupRestoringChecks = false;
    return;
  }
  const ids = listPopupCheckedIds.value;
  listPopupRestoringChecks = true;
  try {
    const count = inst.dataProvider.getRowCount?.() ?? 0;
    const rows = [];
    for (let i = 0; i < count; i += 1) {
      const row = inst.dataProvider.getJsonRow(i);
      if (ids.has(stockIdOf(row))) {
        rows.push(i);
      }
    }
    if (rows.length > 0) {
      if (typeof inst.gridView.checkRows === "function") {
        inst.gridView.checkRows(rows, true);
      } else {
        for (const row of rows) {
          inst.gridView.checkRow(row, true);
        }
      }
    }
  } catch (_) {}
  nextTick(() => {
    listPopupRestoringChecks = false;
    refreshListPopupRowStyle();
  });
};
const popupCheckedRowData = (e) => {
  if (listPopupRestoringChecks) {
    return;
  }
  const visibleIds = new Set(
    (Array.isArray(rowData3.value) ? rowData3.value : [])
      .map(stockIdOf)
      .filter(Boolean)
  );
  const nowChecked = new Set(
    (Array.isArray(e) ? e : []).map(stockIdOf).filter(Boolean)
  );
  const next = new Set(listPopupCheckedIds.value);
  for (const id of visibleIds) {
    if (nowChecked.has(id)) {
      next.add(id);
    } else {
      next.delete(id);
    }
  }
  listPopupCheckedIds.value = next;
  syncPopupCheckedRowsFromIds();
  refreshListPopupRowStyle();
};

const nextDetailCheckSeq = (rows) => {
  let max = 0;
  for (const row of Array.isArray(rows) ? rows : []) {
    const s = Number(row?.lngCheckSeq);
    if (!Number.isNaN(s) && s > max) {
      max = s;
    }
  }
  return max + 1;
};
const stampAddedDetailRow = (item, seq) => {
  const next =
    item && typeof item === "object" && !Array.isArray(item) ? { ...item } : {};
  next.strCheckNo = selectedMasterOrderNo.value || next.strCheckNo || "";
  next.lngSupplierID =
    selectedMasterSupplier.value || next.lngSupplierID || "";
  next.lngStoreGroup = selectedMasterGroup.value || next.lngStoreGroup || "";
  next.lngStoreCode = selectedMasterStore.value || next.lngStoreCode || "";
  next.lngCheckSeq = seq;
  if (next.dblCheckQty == null || next.dblCheckQty === "") {
    next.dblCheckQty = 0;
  }
  next._pur031Added = true;
  return next;
};
const originByStockId = () => {
  const map = new Map();
  for (const item of Array.isArray(originDetailRows.value)
    ? originDetailRows.value
    : []) {
    const id = stockIdOf(item);
    if (id) {
      map.set(id, item);
    }
  }
  return map;
};
const detailQtyOf = (item) => {
  const raw = item?.dblCheckQty ?? item?.DblCheckQty;
  if (raw === "" || raw == null) {
    return null;
  }
  const q = Number(String(raw).replace(/,/g, "").trim());
  return Number.isNaN(q) ? null : q;
};
const detailSeqOf = (item) => {
  const raw = item?.lngCheckSeq ?? item?.LngCheckSeq;
  if (raw === "" || raw == null) {
    return "";
  }
  return String(raw);
};
const isExistingDetailRow = (item) => {
  const id = stockIdOf(item);
  return Boolean(id && originByStockId().has(id));
};
const collectDetailSaveRows = () => {
  const inst = rgGetInstance(detailGridName.value);
  try {
    inst?.gridView?.commit?.();
  } catch (_) {}
  let live = [];
  try {
    const dp = inst?.dataProvider;
    const count = dp?.getRowCount?.() ?? 0;
    if (count > 0 && typeof dp.getJsonRow === "function") {
      for (let i = 0; i < count; i += 1) {
        const row = { ...(dp.getJsonRow(i) || {}) };
        try {
          const q = dp.getValue(i, "dblCheckQty");
          if (q !== undefined) {
            row.dblCheckQty = q;
          }
        } catch (_) {}
        live.push(row);
      }
    } else {
      live = dp?.getJsonRows?.() ?? [];
    }
  } catch (_) {
    live = [];
  }
  if (!Array.isArray(live) || live.length === 0) {
    live =
      Array.isArray(updatedrowdata2.value) && updatedrowdata2.value.length > 0
        ? updatedrowdata2.value
        : rowData2.value;
  }
  const originMap = originByStockId();
  const prevMap = new Map();
  for (const item of Array.isArray(rowData2.value) ? rowData2.value : []) {
    const id = stockIdOf(item);
    if (id) {
      prevMap.set(id, item);
    }
  }
  const checkNo = selectedMasterOrderNo.value || "";
  return (Array.isArray(live) ? live : [])
    .map((item) => {
      const id = stockIdOf(item);
      const prev = id ? prevMap.get(id) : null;
      const origin = id ? originMap.get(id) : null;
      const qty = detailQtyOf(item);
      return {
        ...(prev || {}),
        ...item,
        strCheckNo:
          item.strCheckNo ||
          prev?.strCheckNo ||
          origin?.strCheckNo ||
          checkNo,
        lngCheckSeq:
          origin?.lngCheckSeq ?? item.lngCheckSeq ?? prev?.lngCheckSeq,
        lngSupplierID:
          item.lngSupplierID ||
          prev?.lngSupplierID ||
          origin?.lngSupplierID ||
          selectedMasterSupplier.value ||
          "",
        lngStockID: item.lngStockID ?? prev?.lngStockID ?? origin?.lngStockID,
        dblCheckQty: qty != null ? qty : detailQtyOf(prev) ?? 0,
        strOrderNo:
          item.strOrderNo || prev?.strOrderNo || origin?.strOrderNo || "",
        lngOrderSeq:
          item.lngOrderSeq ?? prev?.lngOrderSeq ?? origin?.lngOrderSeq ?? 0,
      };
    })
    .filter((item) => stockIdOf(item));
};
const splitDetailSaveRows = (rows) => {
  const originMap = originByStockId();
  const currentById = new Map();
  for (const row of Array.isArray(rows) ? rows : []) {
    const id = stockIdOf(row);
    if (id) {
      currentById.set(id, row);
    }
  }
  const updateRows = [];
  const deleteRows = [];
  const addedRows = [];
  for (const [id, origin] of originMap) {
    const cur = currentById.get(id);
    const qty = cur == null ? 0 : detailQtyOf(cur);
    const merged = {
      ...origin,
      ...(cur || {}),
      strCheckNo:
        origin.strCheckNo || cur?.strCheckNo || selectedMasterOrderNo.value,
      lngCheckSeq: origin.lngCheckSeq ?? cur?.lngCheckSeq,
      lngStockID: origin.lngStockID ?? cur?.lngStockID,
      dblCheckQty: qty == null ? 0 : qty,
    };
    if (qty == null || qty === 0) {
      deleteRows.push(merged);
    } else {
      updateRows.push(merged);
    }
  }
  for (const row of Array.isArray(rows) ? rows : []) {
    const id = stockIdOf(row);
    if (!id || originMap.has(id)) {
      continue;
    }
    addedRows.push(row);
  }
  return { updateRows, deleteRows, addedRows };
};
const isMainQtyEntered = (item) => {
  const q = detailQtyOf(item);
  return q != null && q !== 0;
};
const addRowsToDetail = (items) => {
  const incoming = Array.isArray(items) ? items : [];
  const live = collectDetailSaveRows();
  const current =
    live.length > 0
      ? live
      : Array.isArray(rowData2.value)
        ? [...rowData2.value]
        : [];
  const existing = new Set(current.map(stockIdOf).filter(Boolean));
  let seq = nextDetailCheckSeq(current);
  const toAdd = [];
  for (const item of incoming) {
    const id = stockIdOf(item);
    if (!id || existing.has(id)) {
      continue;
    }
    toAdd.push(stampAddedDetailRow(item, seq));
    seq += 1;
    existing.add(id);
  }
  if (toAdd.length === 0) {
    return false;
  }
  rowData2.value = [...current, ...toAdd];
  updatedrowdata2.value = rowData2.value;
  listPopupStockAll.value = filterPopupList(listPopupStockAll.value);
  applyListPopupNameFilter();
  clearListPopupChecks();
  nextTick(() => {
    bindDetailRowHighlight();
    hideDetailUnitPriceFooterSum();
  });
  return true;
};

const addPopupCheckedToDetail = () => {
  syncPopupCheckedRowsFromIds();
  const checked = Array.isArray(popupCheckedRows.value)
    ? popupCheckedRows.value
    : [];
  if (checked.length === 0) {
    Swal.fire({
      title: "경고",
      text: "추가하실 자재를 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  const added = addRowsToDetail(checked);
  if (!added) {
    Swal.fire({
      title: "경고",
      text: "이미 등록된 자재입니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
  }
};

const dtmDate = ref("");
const selectSupplierId = ref("0");
const originmemo = ref("");
const originDetailRows = ref([]);
const lastMasterClick = ref(null);
const clickedRowData = async (e) => {
  //console.log(e);
  masterRowSelected.value = true;
  selectedMasterGroup.value = e[1];
  selectedMasterStore.value = e[2];
  selectedMasterOrderNo.value = e[4];
  selectedMasterSupplier.value = e[7] ?? e.lngSupplierID ?? "";
  selectedSupplierid2.value = selectedMasterSupplier.value;
  const rowSupplierNm = e.strSupplierName ?? e[8];
  if (typeof rowSupplierNm === "string" && rowSupplierNm.trim() !== "") {
    selectedMasterSupplierNm.value = rowSupplierNm.trim();
  }
  lastMasterClick.value = [e[0], e[1], e[2], e[3], e[4], e[5], e[6], e[7]];
  try {
    dtmDate.value = formatLocalDate(e[6]);
  } catch (error) {
    dtmDate.value = e[6] || "";
  }
  store.state.loading = true;
  try {
    const res = await getStockItemDetail(e[1], e[2], e[4], e[7]);
    rowData2.value = res.data.List;
    updatedrowdata2.value = JSON.parse(JSON.stringify(res.data.List));
    originDetailRows.value = JSON.parse(JSON.stringify(res.data.List || []));
    disabledBusiness.value = true;
    selectSupplierId.value = e[7];
    nextTick(() => {
      hideDetailUnitPriceFooterSum();
    });
  } catch (error) {
    //console.log(error);
  }
  try {
    const res = await getStockMasterComment(e[1], e[2], e[4]);
    memo.value = res.data.List[0].strComments;
    originmemo.value = res.data.List[0].strComments;
  } catch (error) {}
  store.state.loading = false;
};

const resetSelectedDetail = async () => {
  if (!lastMasterClick.value) {
    return;
  }
  cond2.value = "";
  showp.value = false;
  rowData3.value = [];
  await clickedRowData(lastMasterClick.value);
};

const addButton = () => {
  if (
    storeCode.value == null ||
    storeCode.value === "" ||
    storeCode.value == 0
  ) {
    Swal.fire({
      title: "경고",
      text: "매장을 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  const sid = supplierid.value;
  const emptyMainSupplier =
    sid === "" ||
    sid == null ||
    sid === 0 ||
    sid === "0" ||
    sid === "전체" ||
    typeof sid === "object";
  newPopupSupplierId.value = emptyMainSupplier ? "" : sid;
  newPopupSupplierNm.value =
    emptyMainSupplier || !supplierNm.value || supplierNm.value === "전체"
      ? ""
      : supplierNm.value;
  selectedSupplier3.value = newPopupSupplierId.value;
  newPopupSupplierLocked.value = !emptyMainSupplier;
  newPopupBcKey.value += 1;
  newPopupStockAll.value = [];
  rowData4.value = [];
  updatedrowdata3.value = [];
  cond3.value = "";
  newPopupNameKeyword.value = "";
  showp2.value = false;
  nextTick(async () => {
    showp2.value = true;
    if (!emptyMainSupplier) {
      await nextTick();
      await searchButton3();
    }
  });
};

const scond = ref("");
const newPopupSupplierId = ref("");
const newPopupSupplierNm = ref("");
const newPopupSupplierLocked = ref(false);
const newPopupBcKey = ref(0);

const selectedSupplier3 = ref("");
const isSameSupplierId = (a, b) => String(a ?? "") === String(b ?? "");
const isEmptySupplierId = (v) =>
  v === "" || v == null || v === 0 || v === "0" || v === "선택";
const newPopupStockDisplayName = (item) => stockDisplayName(item);
const matchListPopupStock = (item, keyword) => {
  const k = String(keyword || "").trim();
  if (!k) {
    return true;
  }
  if (matchNameWithChoseong(newPopupStockDisplayName(item), k)) {
    return true;
  }
  const code = String(item?.lngStockID ?? "");
  return code.toLowerCase().includes(k.toLowerCase());
};
const onListPopupGridName = (name) => {
  listPopupGridName.value = name || "";
};
const onListPopupGridReady = (name) => {
  if (name) {
    listPopupGridName.value = name;
  }
  bindListPopupCheckedStyle();
  restoreListPopupChecks();
};
const bindListPopupGridRows = (rows) => {
  const next = (Array.isArray(rows) ? rows : []).map((row) => ({ ...row }));
  rowData3.value = next;
  const inst = rgGetInstance(listPopupGridName.value);
  if (!inst?.dataProvider) {
    return;
  }
  listPopupRestoringChecks = true;
  try {
    inst.gridView?.commit?.();
  } catch (_) {}
  try {
    inst.dataProvider.beginUpdate?.();
    inst.dataProvider.setRows(next);
    inst.dataProvider.endUpdate?.(true);
  } catch (_) {
    try {
      inst.dataProvider.setRows(next);
    } catch (__) {}
  }
  restoreListPopupChecks();
};
const applyListPopupNameFilter = () => {
  const all = Array.isArray(listPopupStockAll.value)
    ? listPopupStockAll.value
    : [];
  bindListPopupGridRows(
    all.filter((item) => matchListPopupStock(item, listPopupNameKeyword.value))
  );
};
const onListPopupNameCompositionStart = () => {
  listPopupNameComposing.value = true;
};
const onListPopupNameLiveInput = (event) => {
  const value = event.target?.value ?? "";
  listPopupNameKeyword.value = value;
  applyListPopupNameFilter();
};
const onListPopupNameCompositionEnd = (event) => {
  listPopupNameComposing.value = false;
  listPopupNameKeyword.value = event.target?.value ?? "";
  applyListPopupNameFilter();
};
const newPopupStockKey = (item) => String(item?.lngStockID ?? "");
const mergeNewPopupQty = (rows) => {
  if (!Array.isArray(rows) || !Array.isArray(newPopupStockAll.value)) {
    return;
  }
  const map = new Map(
    newPopupStockAll.value.map((row) => [newPopupStockKey(row), row])
  );
  for (const row of rows) {
    const key = newPopupStockKey(row);
    if (!key || !map.has(key)) {
      continue;
    }
    map.set(key, { ...map.get(key), ...row });
  }
  newPopupStockAll.value = Array.from(map.values());
};
const bindNewPopupGridRows = (rows) => {
  const next = (Array.isArray(rows) ? rows : []).map((row) => ({ ...row }));
  rowData4.value = next;
  const inst = rgGetInstance(newPopupGridName.value);
  if (!inst?.dataProvider) {
    return;
  }
  try {
    inst.gridView?.commit?.();
  } catch (_) {}
  try {
    inst.dataProvider.beginUpdate?.();
    inst.dataProvider.setRows(next);
    inst.dataProvider.endUpdate?.(true);
  } catch (_) {
    try {
      inst.dataProvider.setRows(next);
    } catch (__) {}
  }
};
const applyNewPopupNameFilter = () => {
  mergeNewPopupQty(updatedrowdata3.value);
  const all = Array.isArray(newPopupStockAll.value)
    ? newPopupStockAll.value
    : [];
  const keyword = newPopupNameKeyword.value || cond3.value;
  bindNewPopupGridRows(
    all.filter((item) =>
      matchNameWithChoseong(newPopupStockDisplayName(item), keyword)
    )
  );
};
const onNewPopupGridName = (name) => {
  newPopupGridName.value = name || "";
};
const onNewPopupNameCompositionStart = () => {
  newPopupNameComposing.value = true;
};
const onNewPopupNameLiveInput = (event) => {
  const value = event.target?.value ?? "";
  newPopupNameKeyword.value = value;
  if (!event.isComposing && !newPopupNameComposing.value) {
    cond3.value = value;
  }
  applyNewPopupNameFilter();
};
const onNewPopupNameCompositionEnd = (event) => {
  newPopupNameComposing.value = false;
  const value = event.target?.value ?? "";
  cond3.value = value;
  newPopupNameKeyword.value = value;
  applyNewPopupNameFilter();
};
const isNewPopupQtyEntered = (item) => {
  const raw = item?.dblCheckQty;
  if (raw === "" || raw == null) {
    return false;
  }
  const q = Number(raw);
  return !Number.isNaN(q) && q !== 0;
};
const newPopupHasEnteredQty = () => {
  const rows =
    Array.isArray(newPopupStockAll.value) && newPopupStockAll.value.length > 0
      ? newPopupStockAll.value
      : Array.isArray(updatedrowdata3.value) && updatedrowdata3.value.length > 0
        ? updatedrowdata3.value
        : rowData4.value;
  return (Array.isArray(rows) ? rows : []).some(isNewPopupQtyEntered);
};
const clearNewPopupGrid = () => {
  newPopupStockAll.value = [];
  rowData4.value = [];
  updatedrowdata3.value = [];
  newPopupNameKeyword.value = "";
};
const applyNewPopupSupplierAndSearch = async (next) => {
  selectedSupplier3.value = next;
  newPopupSupplierId.value = isEmptySupplierId(next) ? "" : next;
  clearNewPopupGrid();
  if (!isEmptySupplierId(next)) {
    await searchButton3();
  }
};
const SupplierId3 = async (e) => {
  const next = e;
  const prev = selectedSupplier3.value;
  if (isSameSupplierId(next, prev)) {
    return;
  }
  if (newPopupSupplierLocked.value) {
    return;
  }
  if (!isEmptySupplierId(prev) && newPopupHasEnteredQty()) {
    const result = await Swal.fire({
      title: "경고",
      html: "거래처를 변경하면 입력한 수량이 초기화됩니다.<br>거래처를 변경하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "확인",
      cancelButtonText: "취소",
    });
    if (!result.isConfirmed) {
      newPopupBcKey.value += 1;
      newPopupSupplierId.value = prev;
      selectedSupplier3.value = prev;
      return;
    }
  }
  await applyNewPopupSupplierAndSearch(next);
};
const isNewPopupSupplierSelected = () => {
  const v = selectedSupplier3.value;
  if (v === "" || v == null || v === "선택") {
    return false;
  }
  if (v === 0 || v === "0") {
    return false;
  }
  return true;
};

const rowData4 = ref([]);
const searchButton3 = async () => {
  await getclosedtmdate(groupCd.value, storeCode.value);

  if (scond.value < closeDtmDate.value) {
    Swal.fire({
      title: "경고",
      text: "마감되었습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    const today = new Date();
    scond.value = formatLocalDate(today);
    return;
  }

  if (!isNewPopupSupplierSelected()) {
    Swal.fire({
      title: "경고",
      text: "거래처를 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  try {
    store.state.loading = true;
    const res = await getStockItemList4(
      groupCd.value,
      storeCode.value,
      selectedSupplier3.value,
      "strStock",
      "",
      "0",
      ""
    );

    //console.log(res);
    const list = Array.isArray(res?.data?.List) ? res.data.List : [];
    newPopupStockAll.value = list;
    updatedrowdata3.value = list;
    applyNewPopupNameFilter();
  } catch (error) {
    Swal.fire({
      title: "경고",
      text: "자재 조회에 실패했습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
  } finally {
    store.state.loading = false;
  }
};

const scond2 = ref("");
const saveButton3 = async () => {
  await getclosedtmdate(groupCd.value, storeCode.value);

  if (scond.value < closeDtmDate.value) {
    Swal.fire({
      title: "경고",
      text: "마감되었습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    const today = new Date();
    scond.value = formatLocalDate(today);
    return;
  }

  mergeNewPopupQty(updatedrowdata3.value);
  const allRows = Array.isArray(newPopupStockAll.value)
    ? newPopupStockAll.value
    : updatedrowdata3.value;
  const saveRows = (Array.isArray(allRows) ? allRows : []).filter(
    isNewPopupQtyEntered
  );
  if (saveRows.length === 0) {
    Swal.fire({
      title: "경고",
      text: "매입수량을 입력해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  try {
    store.state.loading = true;
    const supplierids = saveRows
      .map((item) => item.lngSupplierID)
      .join("\u200b");
    const stockids = saveRows
      .map((item) => item.lngStockID)
      .join("\u200b");
    const dblcheckqty = saveRows
      .map((item) => item.dblCheckQty)
      .join("\u200b");
    const unitprices = saveRows
      .map((item) => item.curUnitPrice)
      .join("\u200b");
    const supplys = saveRows
      .map((item) => item.curSupply)
      .join("\u200b");
    const taxs = saveRows.map((item) => item.curTax).join("\u200b");
    const res = await saveStockMasterDetail(
      groupCd.value,
      storeCode.value,
      storeCode.value,
      scond.value.replaceAll("-", ""),
      supplierids,
      stockids,
      dblcheckqty,
      unitprices,
      supplys,
      taxs,
      "",
      0,
      "0",
      store.state.userData.lngSequence,
      scond2.value
    );

    ////console.log(res);
    store.state.loading = false;
    if (res.data.RESULT_CD == "00") {
      Swal.fire({
        title: "성공",
        text: "저장을 완료하였습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
    } else {
      Swal.fire({
        title: "실패",
        text: "저장에 실패하였습니다.",
        icon: "error",
        confirmButtonText: "확인",
      });
    }
  } catch (error) {
  } finally {
    showp2.value = false;
    searchButton();
  }
};

const updatedRowData3 = (e) => {
  updatedrowdata3.value = e;
  mergeNewPopupQty(e);
};


const memo = ref("");

const joinZw = (rows, pick) =>
  rows.map((item) => pick(item) ?? "").join("\u200b");
const post031Save = async (path, body) => {
  const res = await fetch(`${commonUrl2}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${store.state.StoreToken || ""}`,
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (_) {
    throw new Error(
      res.ok
        ? "저장 응답을 확인할 수 없습니다."
        : `저장 API 오류 (${res.status})`
    );
  }
  if (!res.ok) {
    throw new Error(data?.RESULT_NM || `저장 API 오류 (${res.status})`);
  }
  return { data };
};
const showSaveFailSwal = (detail) => {
  const text = String(detail || "").trim();
  return Swal.fire({
    title: "실패",
    text: text ? `저장에 실패하였습니다. ${text}` : "저장에 실패하였습니다.",
    icon: "error",
    confirmButtonText: "확인",
  });
};
const isSaveClose = (res) =>
  res?.data?.RESULT_CD == "89" || res?.data?.RESULT_CD2 == "Y";
const showSaveCloseSwal = () =>
  Swal.fire({
    title: "경고",
    text: "마감된 정보는 수정하실 수 없습니다.",
    icon: "warning",
    confirmButtonText: "확인",
  });
const checkDateYmd = () => {
  const fromDate = String(dtmDate.value || "").replaceAll("-", "").slice(0, 8);
  if (fromDate.length === 8) {
    return fromDate;
  }
  const no = String(selectedMasterOrderNo.value || "");
  if (no.length >= 12) {
    return no.slice(-12, -4);
  }
  return "";
};

const saveButton = async () => {
  await getclosedtmdate(groupCd.value, storeCode.value);

  if (dtmDate.value && closeDtmDate.value && dtmDate.value < closeDtmDate.value) {
    await showSaveCloseSwal();
    return;
  }

  const checkNo = selectedMasterOrderNo.value;
  if (!checkNo) {
    Swal.fire({
      title: "경고",
      text: "변경된 사항이 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  const rows = collectDetailSaveRows().map((item) => ({
    ...item,
    strCheckNo: item.strCheckNo || checkNo,
    lngSupplierID: item.lngSupplierID || selectedMasterSupplier.value || "",
  }));
  const split = splitDetailSaveRows(rows);
  const addedRows = split.addedRows;
  const updateRows = split.updateRows;
  const deleteRows = split.deleteRows.filter((item) => detailSeqOf(item));
  const insertRows = addedRows.filter(isMainQtyEntered);
  if (split.deleteRows.length > 0 && deleteRows.length === 0) {
    Swal.fire({
      title: "실패",
      text: "삭제할 행 순번을 확인할 수 없습니다.",
      icon: "error",
      confirmButtonText: "확인",
    });
    return;
  }
  const originMap = new Map(
    (Array.isArray(originDetailRows.value) ? originDetailRows.value : []).map(
      (item) => [`${item?.lngStockID}|${item?.lngCheckSeq}`, item]
    )
  );
  const priceRows = [
    ...updateRows.filter((item) => {
      const origin = originMap.get(`${item.lngStockID}|${item.lngCheckSeq}`);
      return (
        origin != null &&
        Number(origin.curUnitPrice) !== Number(item.curUnitPrice)
      );
    }),
    ...insertRows,
  ];
  const hasGridChange =
    Array.isArray(allstaterows.value) && allstaterows.value.length > 0;
  const memoChanged = originmemo.value != memo.value;
  if (
    !hasGridChange &&
    addedRows.length === 0 &&
    deleteRows.length === 0 &&
    !memoChanged
  ) {
    Swal.fire({
      title: "경고",
      text: "변경된 사항이 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  if (addedRows.length > 0 && insertRows.length === 0 && !hasGridChange && !memoChanged && deleteRows.length === 0) {
    Swal.fire({
      title: "경고",
      text: "추가한 자재의 매입수량을 입력해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  const saveGroup = selectedMasterGroup.value || groupCd.value;
  const saveStore = selectedMasterStore.value || storeCode.value;
  const userid = store.state.userData.lngSequence;
  const ymd = checkDateYmd();
  let saveOk = false;

  try {
    store.state.loading = true;
    if (deleteRows.length > 0) {
      const resDel = await post031Save(
        "/MIPUR/PUR02_031INS.asmx/deleteCheckDetails",
        {
          GROUP_CD: saveGroup,
          STORE_CD: saveStore,
          STORE_CD2: saveStore,
          CHECKNOS: joinZw(deleteRows, (item) => item.strCheckNo),
          CHECKSEQS: joinZw(deleteRows, (item) => detailSeqOf(item)),
          ORDERNOS: joinZw(deleteRows, (item) => item.strOrderNo || ""),
          ORDERSEQS: joinZw(deleteRows, (item) => item.lngOrderSeq || 0),
          CHECKQTYS: joinZw(deleteRows, (item) => item.dblCheckQty || 0),
          TYPE: "0",
          USERID: userid,
        }
      );
      if (isSaveClose(resDel)) {
        store.state.loading = false;
        await showSaveCloseSwal();
        return;
      }
      if (resDel?.data?.RESULT_CD != "00") {
        store.state.loading = false;
        await showSaveFailSwal(resDel?.data?.RESULT_NM);
        return;
      }
    }

    const resMaster = await post031Save(
      "/MIPUR/PUR02_031INS.asmx/updateCheckMasterDetails",
      {
        GROUP_CD: saveGroup,
        STORE_CD: saveStore,
        STORE_CD2: saveStore,
        CHECKNOS: updateRows.length
          ? joinZw(updateRows, (item) => item.strCheckNo)
          : checkNo,
        CHECKSEQS: updateRows.length
          ? joinZw(updateRows, (item) => item.lngCheckSeq)
          : "",
        CHECKQTYS: updateRows.length
          ? joinZw(updateRows, (item) => item.dblCheckQty)
          : "",
        UNITPRICES: updateRows.length
          ? joinZw(updateRows, (item) => item.curUnitPrice)
          : "",
        SUPPLYS: updateRows.length
          ? joinZw(updateRows, (item) => item.curSupply)
          : "",
        TAXS: updateRows.length
          ? joinZw(updateRows, (item) => item.curTax)
          : "",
        ORDERNO: "",
        ORDERSEQ: 0,
        TYPE: "0",
        USERID: userid,
        COMMENTS: memo.value,
      }
    );
    if (isSaveClose(resMaster)) {
      store.state.loading = false;
      await showSaveCloseSwal();
      return;
    }
    if (resMaster?.data?.RESULT_CD != "00") {
      store.state.loading = false;
      await showSaveFailSwal(resMaster?.data?.RESULT_NM);
      return;
    }

    if (insertRows.length > 0) {
      const resIns = await post031Save(
        "/MIPUR/PUR02_031INS.asmx/insertCheckDetailNew",
        {
          GROUP_CD: saveGroup,
          STORE_CD: saveStore,
          STORE_CD2: saveStore,
          CHECKNO: checkNo,
          DATE: ymd,
          SUPPLIERIDS: joinZw(insertRows, (item) => item.lngSupplierID),
          STOCKIDS: joinZw(insertRows, (item) => item.lngStockID),
          CHECKQTYS: joinZw(insertRows, (item) => item.dblCheckQty),
          UNITPRICES: joinZw(insertRows, (item) => item.curUnitPrice),
          SUPPLYS: joinZw(insertRows, (item) => item.curSupply),
          TAXS: joinZw(insertRows, (item) => item.curTax),
          ORDERNOS: joinZw(insertRows, (item) => item.strOrderNo || ""),
          ORDERSEQS: joinZw(insertRows, (item) => item.lngOrderSeq || 0),
          TYPE: "0",
          USERID: userid,
        }
      );
      if (isSaveClose(resIns)) {
        store.state.loading = false;
        await showSaveCloseSwal();
        return;
      }
      if (resIns?.data?.RESULT_CD != "00") {
        store.state.loading = false;
        await showSaveFailSwal(resIns?.data?.RESULT_NM);
        return;
      }
    }

    if (priceRows.length > 0 && ymd) {
      const resPrice = await post031Save(
        "/MIPUR/PUR02_031INS.asmx/insertStockPriceHistory",
        {
          GROUP_CD: saveGroup,
          STORE_CD: saveStore,
          SUPPLIERIDS: joinZw(priceRows, (item) => item.lngSupplierID),
          STOCKIDS: joinZw(priceRows, (item) => item.lngStockID),
          FROMDATES: joinZw(priceRows, () => ymd),
          TODATES: joinZw(priceRows, () => "99991231"),
          UNITPRICES: joinZw(priceRows, (item) => item.curUnitPrice),
          MAINSUPPLIERS: joinZw(priceRows, () => "Y"),
          USERID: userid,
        }
      );
      if (resPrice?.data?.RESULT_CD != "00") {
        store.state.loading = false;
        await showSaveFailSwal(resPrice?.data?.RESULT_NM);
        return;
      }
    }

    saveOk = true;
    store.state.loading = false;
    await Swal.fire({
      title: "성공",
      text: "저장을 완료하였습니다.",
      icon: "success",
      confirmButtonText: "확인",
    });
  } catch (error) {
    store.state.loading = false;
    await showSaveFailSwal(error?.message);
  } finally {
    store.state.loading = false;
  }
  if (saveOk) {
    await searchButton();
  }
};

const closeDtmDate = ref("");
const getclosedtmdate = async (groupcd, storecd) => {
  try {
    const res = await getCloseDtmDate(groupcd, storecd);

    //console.log(res);
    closeDtmDate.value = res.data.List[0].dtmDate;
  } catch (error) {}
};

const checkedrowdata = ref([]);
const checkedRowData = (e) => {
  checkedrowdata.value = e;
  //console.log(e);
};

const deleteButton = async () => {
  if (checkedrowdata.value.length == 0) {
    Swal.fire({
      title: "경고",
      html: "삭제할 정보가 없습니다.<br>삭제할 매입내역을 선택 후 삭제 해 주십시오",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  await getclosedtmdate(groupCd.value, storeCode.value);
  const dtmdates = checkedrowdata.value.filter((item) => {
    const checkDate = new Date(formatLocalDate(item.dtmCheckDate)); // item의 날짜
    const closeDate = new Date(closeDtmDate.value.split(" ")[0]); // 기준 날짜

    return checkDate < closeDate;
  });

  if (dtmdates.length > 0) {
    Swal.fire({
      title: "경고",
      text: "마감된 정보는 삭제하실 수 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  try {
    const checknos = checkedrowdata.value
      .map((item) => item.strCheckNo)
      .join("\u200b");

    const res = await deleteCheckDetailMasters(
      groupCd.value,
      storeCode.value,
      checknos,
      store.state.userData.lngSequence
    );

    //console.log(res);

    if (res.data.RESULT_CD == "00") {
      await Swal.fire({
        title: "성공",
        text: "해당 정보를 삭제하였습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
      return;
    } else {
      await Swal.fire({
        title: "에러",
        text: "삭제에 실패하였습니다. 피앤시월드에 문의해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
    }
  } catch (error) {
  } finally {
    searchButton();
  }
};
</script>

<style scoped>
.pur031-search-panel {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  padding-left: 0;
  padding-right: 0;
  padding-block: 0.75rem;
  overflow-x: visible;
  position: relative;
  z-index: 20;
}

.pur031-search-grid,
.pur031-sub-grid {
  display: grid;
  align-items: center;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  column-gap: 0;
  padding-left: var(--pur031-panel-pad-x);
  padding-right: var(--pur031-panel-pad-x);
  grid-template-columns:
    var(--pur031-label-col)
    var(--pur031-date-field-w)
    minmax(var(--pur031-col-gap), 1fr)
    var(--pur031-label-col)
    calc(var(--pur031-date-field-w) - 2.25rem)
    minmax(var(--pur031-col-gap), 1fr)
    var(--pur031-label-col)
    calc(var(--pur031-date-field-w) - 2.25rem);
}

.pur031-spacer {
  min-width: var(--pur031-col-gap);
  align-self: stretch;
  pointer-events: none;
}

.pur031-sg-label {
  justify-self: stretch;
  box-sizing: border-box;
  width: var(--pur031-label-col);
  min-width: var(--pur031-label-col);
  max-width: var(--pur031-label-col);
  padding-right: var(--pur031-item-gap);
  min-height: var(--pur031-row-min-h);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
  white-space: nowrap;
}

.pur031-cell-field {
  display: flex;
  min-width: 0;
  min-height: var(--pur031-row-min-h);
  align-items: center;
}

.pur031-date-slot {
  width: 100%;
  max-width: var(--pur031-date-field-w);
  justify-self: stretch;
}

.pur031-bc-slot,
.pur031-pick-slot,
.pur031-item-slot {
  width: calc(var(--pur031-date-field-w) - 2.25rem);
  max-width: calc(var(--pur031-date-field-w) - 2.25rem);
  justify-self: start;
}

.pur031-sub-panel {
  box-sizing: border-box;
  padding-block: 0.75rem;
}

.pur031-spacer--btn {
  grid-column: 6 / -1;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5rem;
  padding-left: 0.5rem;
  min-width: 0;
  position: relative;
  z-index: 3;
  pointer-events: auto;
}

.pur031-sub-btn {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  pointer-events: auto;
  flex-shrink: 0;
  height: var(--pur031-control-h);
  min-height: var(--pur031-control-h);
  max-height: var(--pur031-control-h);
  min-width: 4.5rem;
  padding: 0 0.75rem;
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

.pur031-sub-btn:hover {
  background-color: rgb(219 234 254);
  border-color: rgb(96 165 250);
}

.pur031-sub-btn--reset {
  color: rgb(154 52 18);
  border-color: rgb(253 186 116);
  background-color: rgb(255 247 237);
  box-shadow: 0 1px 2px 0 rgb(234 88 12 / 0.08);
}

.pur031-sub-btn--reset:hover {
  background-color: rgb(255 237 213);
  border-color: rgb(251 146 60);
}

.pur031-popup-actions .pur031-sub-btn--icon {
  gap: 0.25rem;
}

.pur031-popup-actions .pur031-sub-btn--icon::before {
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

.pur031-popup-actions .pur031-sub-btn--search::before {
  -webkit-mask-image: url("../../assets/ic_search.svg");
  mask-image: url("../../assets/ic_search.svg");
}

.pur031-popup-actions .pur031-sub-btn--add::before {
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='black' d='M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='black' d='M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z'/%3E%3C/svg%3E");
}

.pur031-popup-actions .pur031-sub-btn--save {
  color: rgb(21 128 61);
  border-color: rgb(134 239 172);
  background-color: rgb(240 253 244);
  box-shadow: 0 1px 2px 0 rgb(22 163 74 / 0.08);
}

.pur031-popup-actions .pur031-sub-btn--save:hover {
  background-color: rgb(220 252 231);
  border-color: rgb(74 222 128);
}

.pur031-popup-actions .pur031-sub-btn--save::before {
  -webkit-mask-image: url("../../assets/ic_save.svg");
  mask-image: url("../../assets/ic_save.svg");
}

.pur031-popup-actions .pur031-sub-btn--close {
  color: rgb(55 65 81);
  border-color: rgb(209 213 219);
  background-color: rgb(249 250 251);
  box-shadow: 0 1px 2px 0 rgb(107 114 128 / 0.08);
}

.pur031-popup-actions .pur031-sub-btn--close:hover {
  background-color: rgb(243 244 246);
  border-color: rgb(156 163 175);
}

.pur031-popup-actions .pur031-sub-btn--close::before {
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='black' d='M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='black' d='M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'/%3E%3C/svg%3E");
}

.pur031-sub-btn--reset:disabled {
  opacity: 0.45;
}

.pur031-item-input {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  height: var(--pur031-control-h);
  min-height: var(--pur031-control-h);
  max-height: var(--pur031-control-h);
  padding: 0 0.5rem;
  border: 1px solid var(--pur031-control-border);
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background: #fff;
}

.pur031-item-input:focus {
  outline: none;
  border-color: #3b82f6;
}

.pur031-item-input:disabled {
  background-color: rgb(229 231 235);
  color: rgb(75 85 99);
  cursor: not-allowed;
}

.pur031-sub-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  box-shadow: none;
}

.pur031-pick-slot :deep(> div.flex.text-base) {
  width: 100%;
  min-width: 0;
  min-height: var(--pur031-row-min-h);
  align-items: center;
  gap: 0 !important;
}

.pur031-pick-slot :deep(> div.flex > div:first-child) {
  display: none;
}

.pur031-pick-slot :deep(.relative.min-w-0.flex-1) {
  flex: 1 1 auto !important;
  min-width: 0 !important;
  max-width: 100% !important;
  width: 100% !important;
}

.pur031-search-panel .pur031-pick-slot :deep(.pickstore-vs-shell),
.pur031-search-panel .pur031-bc-slot :deep(.pickstore-vs-shell),
.pur031-popup-bc :deep(.pickstore-vs-shell) {
  box-sizing: border-box;
  height: var(--pur031-control-h, 2rem) !important;
  min-height: var(--pur031-control-h, 2rem) !important;
  max-height: var(--pur031-control-h, 2rem) !important;
  width: 100% !important;
  max-width: 100% !important;
  border: 1px solid var(--pur031-control-border, #cbd5e1) !important;
  overflow: hidden !important;
  position: relative !important;
}

.pur031-search-panel .pur031-pick-slot :deep(.style-chooser),
.pur031-search-panel .pur031-bc-slot :deep(.style-chooser),
.pur031-popup-bc :deep(.style-chooser) {
  width: 100% !important;
  height: 100% !important;
}

.pur031-search-panel .pur031-pick-slot :deep(.vs__dropdown-toggle),
.pur031-search-panel .pur031-bc-slot :deep(.vs__dropdown-toggle),
.pur031-popup-bc :deep(.vs__dropdown-toggle) {
  box-sizing: border-box;
  min-height: var(--pur031-control-h, 2rem) !important;
  height: var(--pur031-control-h, 2rem) !important;
  max-height: var(--pur031-control-h, 2rem) !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  padding-left: 0.5rem !important;
  padding-right: 0.25rem !important;
  display: flex !important;
  align-items: center !important;
  flex-wrap: nowrap !important;
}

.pur031-search-panel .pur031-pick-slot :deep(.vs__selected-options),
.pur031-search-panel .pur031-bc-slot :deep(.vs__selected-options),
.pur031-popup-bc :deep(.vs__selected-options) {
  flex: 1 1 auto !important;
  min-width: 0 !important;
  position: relative !important;
  height: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
  overflow: hidden !important;
}

.pur031-search-panel .pur031-pick-slot :deep(.vs__selected),
.pur031-search-panel .pur031-bc-slot :deep(.vs__selected),
.pur031-popup-bc :deep(.vs__selected) {
  position: absolute !important;
  left: 0 !important;
  right: 1.5rem !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  margin: 0 !important;
  padding: 0 !important;
  height: auto !important;
  max-width: 100% !important;
  line-height: 1.25 !important;
  font-size: 0.875rem !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  display: block !important;
  background: transparent !important;
}

.pur031-search-panel .pur031-pick-slot :deep(.vs__search),
.pur031-search-panel .pur031-bc-slot :deep(.vs__search),
.pur031-popup-bc :deep(.vs__search) {
  margin: 0 !important;
  padding: 0 !important;
  height: calc(var(--pur031-control-h, 2rem) - 2px) !important;
  line-height: calc(var(--pur031-control-h, 2rem) - 2px) !important;
  font-size: 0.875rem !important;
}

.pur031-search-panel .pur031-pick-slot :deep(.vs__actions),
.pur031-search-panel .pur031-bc-slot :deep(.vs__actions),
.pur031-popup-bc :deep(.vs__actions) {
  display: flex !important;
  align-items: center !important;
  padding: 0 2px 0 0 !important;
  flex-shrink: 0 !important;
  margin-left: auto !important;
}

.pur031-search-panel .pur031-date-slot :deep(> div.flex.justify-start.items-center) {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0;
  margin: 0 !important;
  gap: 0.25rem !important;
}

.pur031-search-panel .pur031-date-slot :deep(> div.flex > div.inline-flex.h-8) {
  flex: 1 1 auto;
  min-width: 0;
  max-width: 100%;
  width: 100%;
  gap: 0.125rem !important;
}

.pur031-search-panel .pur031-date-slot :deep(input[type="date"]) {
  box-sizing: border-box;
  height: var(--pur031-control-h) !important;
  min-height: var(--pur031-control-h) !important;
  max-height: var(--pur031-control-h) !important;
  border: 1px solid var(--pur031-control-border) !important;
  width: auto !important;
  flex: 1 1 0;
  min-width: 6.5rem;
  max-width: none;
  padding-left: 0.45rem;
  padding-right: 0.25rem;
  font-size: 0.875rem;
}

.pur031-search-panel .pur031-date-slot :deep(input[type="date"]:focus) {
  border-color: #3b82f6 !important;
}

.pur031-search-panel .pur031-date-slot :deep(div.inline-flex.h-8 > button) {
  flex-shrink: 0;
  width: 1.65rem !important;
  height: 1.65rem !important;
  min-width: 1.65rem;
  margin-left: 0 !important;
}

.pur031-bc-slot :deep(> div.flex.text-base),
.pur031-popup-bc :deep(> div.flex.text-base) {
  margin: 0 !important;
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0;
  gap: 0 !important;
}

.pur031-pane-master {
  position: relative;
  z-index: 0;
  flex: 2.5 1 0;
  min-height: 8rem;
}

.pur031-pane-detail {
  flex: 3.5 1 0;
  min-height: 10rem;
}

.pur031-detail-legend {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem 1.25rem;
  margin-bottom: 0.35rem;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.2;
  color: rgb(55 65 81);
}

.pur031-legend-item {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.pur031-swatch {
  display: inline-block;
  width: 0.85rem;
  height: 0.85rem;
  border: 1px solid rgb(156 163 175);
  border-radius: 0.15rem;
}

.pur031-swatch--added {
  background: #dcfce7;
}

.pur031-swatch--edited {
  background: #fef3c7;
}

.pur031-grid-body {
  min-height: 8rem;
}

.pur031-memo {
  margin-top: 0.5rem;
  min-width: 0;
}

.pur031-memo-label {
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: rgb(17 24 39);
}

.pur031-memo-text,
.pur031-popup-memo-text {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  border: 1px solid #9ca3af;
  border-radius: 0.25rem;
  padding: 0.5rem;
  font-size: 0.875rem;
  resize: none;
}

.pur031-memo-text {
  height: 6.5rem;
}

.pur031-popup-memo {
  flex-shrink: 0;
  margin-top: 0.5rem;
}

.pur031-popup-memo-text {
  height: 5rem;
}

.pur031-popup-backdrop {
  position: fixed;
  inset: 0;
  z-index: 11000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(0 0 0 / 0.5);
  pointer-events: auto;
}

.pur031-popup-dialog {
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: min(75vw, 72rem);
  height: min(80vh, 52rem);
  max-height: 90vh;
  padding: 1.25rem 1.5rem;
  border-radius: 1rem;
  background: #fff;
  box-shadow: 0 20px 40px rgb(0 0 0 / 0.2);
  overflow: hidden;
  pointer-events: auto;
}

.pur031-popup-dialog--list {
  height: min(70vh, 44rem);
  padding: 0;
}

.pur031-popup-list-bar {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  min-height: 3rem;
  padding: 0.5rem 1rem;
  background: var(--gradient-primary);
}

.pur031-popup-list-title {
  margin: 0;
  text-align: center;
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.4;
  color: #fff;
}

.pur031-popup-list-tools {
  display: grid;
  flex-shrink: 0;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr);
  align-items: center;
  column-gap: 0.75rem;
  min-width: 0;
  padding: 0.75rem 1.25rem 0.25rem;
}

.pur031-popup-list-tools .pur031-popup-supplier {
  justify-self: start;
}

.pur031-popup-list-tools .pur031-popup-actions {
  justify-self: end;
}

.pur031-popup-list-search {
  display: flex;
  min-width: 0;
  width: 100%;
  max-width: 22rem;
  align-items: center;
  justify-content: center;
  justify-self: center;
  gap: 0.5rem;
}

.pur031-popup-list-search-label {
  flex-shrink: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: rgb(17 24 39);
}

.pur031-popup-list-search-input {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  height: 2rem;
  padding: 0 0.5rem;
  border: 1px solid rgb(107 114 128);
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

.pur031-popup-dialog--list .pur031-popup-grid-wrap {
  padding: 0.5rem 1.25rem 1rem;
}

.pur031-popup-head--drag {
  cursor: move;
  user-select: none;
}

.pur031-popup-head {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.pur031-popup-head-text {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.25rem;
}

.pur031-popup-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.4;
  color: rgb(17 24 39);
}

.pur031-popup-supplier {
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.3;
  color: rgb(30 64 175);
}

.pur031-popup-actions {
  display: flex;
  flex-wrap: nowrap;
  flex-shrink: 0;
  align-items: center;
  gap: 0.5rem;
}

.pur031-popup-actions .pur031-sub-btn {
  height: 2rem;
  min-height: 2rem;
  max-height: 2rem;
  min-width: 5.75rem;
  padding: 0 0.9rem;
  flex-shrink: 0;
}

.pur031-popup-hint {
  flex-shrink: 0;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.4;
  color: rgb(55 65 81);
}

.pur031-popup-fields {
  box-sizing: border-box;
  flex-shrink: 0;
  margin-bottom: 0.75rem;
  min-width: 0;
  padding: 0.875rem 1.25rem;
  border-radius: 0.5rem;
  background: #f3f4f6;
}

.pur031-popup-grid {
  display: grid;
  width: 100%;
  min-width: 0;
  grid-template-columns:
    minmax(0, var(--pur031-popup-label)) minmax(0, 1fr)
    minmax(0, var(--pur031-popup-label)) minmax(0, 1fr);
  column-gap: 0.75rem;
  row-gap: var(--pur031-popup-gap);
  align-items: center;
}

.pur031-popup-label {
  min-width: 0;
  max-width: var(--pur031-popup-label);
}

.pur031-popup-label-inner {
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

.pur031-popup-cell {
  display: flex;
  min-width: 0;
  align-items: center;
}

.pur031-popup-input {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  height: 2rem;
  min-height: 2rem;
  border-radius: 0.375rem;
  border: 1px solid var(--pur031-popup-border) !important;
  background-color: #fff;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: rgb(55 65 81);
}

.pur031-popup-input:disabled {
  background-color: rgb(229 231 235);
  color: rgb(75 85 99);
}

.pur031-popup-input:focus {
  border-color: #3b82f6 !important;
  outline: none;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.35);
}

.pur031-popup-grid-wrap {
  display: flex;
  min-height: 0;
  min-width: 0;
  flex: 1 1 auto;
  flex-direction: column;
  overflow: hidden;
}
</style>

<style>
body.pur031-new-popup-open .vs__dropdown-menu {
  z-index: 12050 !important;
}

.pur031-row-checked {
  background: #dbeafe !important;
}

.pur031-row-added {
  background: #dcfce7 !important;
}

.pur031-row-edited {
  background: #fef3c7 !important;
}
</style>
