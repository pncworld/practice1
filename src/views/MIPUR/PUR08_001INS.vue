<!-- /*--############################################################################
# Filename : PUR08_001INS.vue                                                  
# Description : 구매관리2 > 매장간 재고이동 관리 > 매장간 출고 등록                      
# Date :2025-09-23                                                             
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <!-- 조회조건 -->
  <div class="flex h-full min-h-0 flex-col pl-5" @click="handleParentClick">
    <div
      class="flex shrink-0 justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center mr-9 space-x-2 pr-5">
        <button @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <button @click="addButton" class="button new w-auto">신규</button>
        <button @click="deleteButton" class="button delete w-auto">삭제</button>
        <button @click="excelButton" class="button save w-auto excel">
          엑셀
        </button>
      </div>
    </div>
    <div
      class="pur801-search-panel z-10 mt-3 w-full min-h-0 shrink-0 rounded-lg bg-gray-200">
      <div
        class="pur801-wire-grid min-w-0"
        :style="{
          '--pur801-control-border': pur801ControlBorder,
          '--pur801-col-gutter': pur801ColGutter,
          '--pur801-row-gap': pur801RowGap,
          '--pur801-label-col': pur801LabelCol,
        }">
        <div class="pur801-wire-cell min-w-0">
          <div class="pur801-wire-label">보낸 매장</div>
          <div class="pur801-wire-field min-w-0">
            <div class="pur801-pick-slot min-h-0 min-w-0">
              <PickStore
                compact-search-bar
                @update:storeGroup="lngStoreGroup"
                :default-store-nm="'전체'"
                :main-name="'보낸 매장'"
                :default-store="true"
                @store-nm="excelStore"
                :hide-attr="false"
                :hide-group="false"
                @update:store-cd="lngStoreCode" />
            </div>
          </div>
        </div>
        <div class="pur801-wire-cell min-w-0">
          <div class="pur801-wire-label">받는 매장</div>
          <div class="pur801-wire-field min-w-0">
            <div class="pur801-pick-slot min-h-0 min-w-0">
              <PickStore
                compact-search-bar
                unlock-store-combo-only
                :default-store-nm="'전체'"
                :default-store="true"
                :main-name="'받는 매장'"
                @store-nm="excelStore"
                :hide-attr="false"
                :hide-group="false"
                @update:store-cd="lngStoreCode2" />
            </div>
          </div>
        </div>
        <div class="pur801-wire-cell min-w-0">
          <div class="pur801-wire-label">이동기간</div>
          <div class="pur801-wire-field pur801-date-slot min-w-0 overflow-hidden">
            <Datepicker2
              ref="datepicker"
              omit-main-label
              filter-bar-align
              :main-name="'이동기간'"
              @end-date="endDate"
              :close-pop-up="closePopUp"
              @excel-date="excelDate"
              @start-date="startDate" />
          </div>
        </div>
        <div class="pur801-wire-cell min-w-0">
          <div class="pur801-wire-label">확정여부</div>
          <div class="pur801-wire-field min-w-0">
            <div class="pur801-confirm-row">
              <select
                id="pur08-001-confirm"
                v-model="cond3"
                class="pur801-confirm-select h-8 w-full min-w-0 rounded-md border border-solid bg-white px-1.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <!-- COND = getStoreMoveList lngOption: 9 전체, 0 미확정, 1 확정 (공통코드 24 미사용) -->
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
      <div class="relative h-full min-h-0 min-w-0 flex-1">
        <Realgrid
          :progname="'PUR08_001INS_VUE'"
          :progid="1"
          :rowData="rowData"
          :setStateBar="false"
          :documentTitle="'PUR08_001INS'"
          @updatedRowData="updatedRowData"
          :checkRenderEditable="true"
          :checkRowAuto="false"
          :checkRowAuto2="true"
          :checkRowAuto2Col="'Selected'"
          :headerCheckBar="'Selected'"
          :setAllCheck="setAllCheck"
          :checkAbleExpressionCol="'Selected'"
          :checkAbleExpressionVal="'1,2'"
          :checkAbleExpressionCol2="'SelectableChk'"
          :documentSubTitle="documentSubTitle"
          :rowStateeditable="false"
          hover-tooltip-fields="strStockName"
          :hover-tooltip-max-length="0"
          :exporttoExcel="exportExcel">
        </Realgrid>
      </div>
    </div>
  </div>
  <Teleport to="body">
    <div v-if="open" class="pur801-overlay" @mousedown.self.prevent>
      <div
        class="pur801-shell"
        :style="shipPop.style"
        @mousedown.stop>
        <div class="pur801-head" @mousedown="onShipHeadDown">
          <h2 class="shrink-0 text-xl font-bold text-gray-900">매장간 출고 신규 등록</h2>
          <div class="flex shrink-0 gap-2" @mousedown.stop>
            <button type="button" class="pnc-sub-btn" @click="saveButton">
              <svg class="pnc-sub-btn__icon" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M3 8h10M9.2 4.4 12.8 8 9.2 11.6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              출고
            </button>
            <button type="button" class="pnc-sub-btn pnc-sub-btn--gray" @click="closeShipPopup">
              <svg class="pnc-sub-btn__icon" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M4 4l8 8M12 4 4 12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
              </svg>
              닫기
            </button>
          </div>
        </div>

        <div class="pur801-master mt-3 shrink-0">
          <div class="pur801-master-wrap shrink-0 border border-slate-500 bg-white">
            <div class="grid grid-cols-[6.75rem_1fr_6.75rem_1fr] text-sm leading-tight text-gray-900">
              <div class="pur801-lbl-master flex items-center justify-center border-b border-r border-slate-400 px-1.5 py-2 font-semibold">보내는 매장</div>
              <div class="pur801-fld flex min-w-0 items-center border-b border-r border-slate-400 bg-white px-2 py-1.5">
                <div class="pur801-master-ctrl">
                  <div class="pur801-pick min-w-0 w-full">
                    <PickStore
                      compact-search-bar
                      :default-store-nm="'전체'"
                      :default-store="true"
                      :main-name="''"
                      :hide-attr="false"
                      :hide-group="false"
                      :disabled-all="disabled"
                      :set-dynamic-store-class="'!h-8 !min-h-[2rem] !w-full !min-w-0 !p-0 !rounded-md !border !border-slate-300 !text-sm !shadow-none'"
                      :set-dynamic-store-class2="'!ml-0 !mt-0 !w-full !gap-0'"
                      @update:store-cd="lngStoreCode3" />
                  </div>
                </div>
              </div>
              <div class="pur801-lbl-master flex items-center justify-center border-b border-r border-slate-400 px-1.5 py-2 font-semibold">받는 매장</div>
              <div class="pur801-fld flex min-w-0 items-center border-b border-slate-400 bg-white px-2 py-1.5">
                <div class="pur801-master-ctrl">
                  <div class="pur801-pick min-w-0 w-full">
                    <PickStore
                      compact-search-bar
                      unlock-store-combo-only
                      :default-store-nm="'전체'"
                      :default-store="true"
                      :main-name="''"
                      :hide-attr="false"
                      :hide-group="false"
                      :disabled-all="disabled"
                      :set-dynamic-store-class="'!h-8 !min-h-[2rem] !w-full !min-w-0 !p-0 !rounded-md !border !border-slate-300 !text-sm !shadow-none'"
                      :set-dynamic-store-class2="'!ml-0 !mt-0 !w-full !gap-0'"
                      @update:store-cd="lngStoreCode4" />
                  </div>
                </div>
              </div>
              <div class="pur801-lbl-master flex items-center justify-center border-b border-r border-slate-400 px-1.5 py-2 font-semibold">이동 일자</div>
              <div class="pur801-fld flex min-w-0 items-center justify-start border-b border-r border-slate-400 bg-white px-2 py-1.5">
                <input
                  type="date"
                  :disabled="disabled"
                  class="pur801-master-ctrl h-8 rounded-md border border-slate-300 px-1.5 text-sm disabled:bg-[#e8e8e8]"
                  v-model="scond3" />
              </div>
              <div class="pur801-lbl-master flex items-center justify-center border-b border-r border-slate-400 px-1.5 py-2 font-semibold">거래처</div>
              <div class="pur801-fld flex min-w-0 items-center border-b border-slate-400 bg-white px-2 py-1.5">
                <div class="pur801-master-ctrl pur801-master-client">
                  <BusinessClient
                    compact-search-bar
                    :default-name="''"
                    :default-nm="'전체'"
                    @SupplierId="SupplierId" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-2 shrink-0">
          <div class="pur801-mid-sep" aria-hidden="true"></div>
          <div class="shrink-0 border border-slate-500 bg-white">
            <div class="grid grid-cols-[6.75rem_minmax(0,1fr)_6.75rem_minmax(0,1.02fr)_8.5rem_minmax(0,1.12fr)] text-sm leading-tight text-gray-900">
              <div class="pur801-lbl-detail flex items-center justify-center border-b border-r border-slate-400 px-1.5 py-2 font-semibold">자재검색</div>
              <div class="pur801-fld flex min-w-0 items-center gap-2 border-b border-r border-slate-400 bg-white px-2 py-1.5">
                <input type="text" class="h-7 min-w-0 flex-1 border border-slate-300 px-1.5 text-sm" v-model="scond4" @keydown.enter.prevent="searchButton2" />
                <button type="button" class="pnc-sub-btn" @click="searchButton2">
                  <svg class="pnc-sub-btn__icon" viewBox="0 0 16 16" aria-hidden="true">
                    <circle cx="7" cy="7" r="4.2" fill="none" stroke="currentColor" stroke-width="1.6"/>
                    <path d="M10.2 10.2 13.2 13.2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
                  </svg>
                  조회
                </button>
              </div>
              <div class="pur801-lbl-detail flex items-center justify-center border-b border-r border-slate-400 px-1.5 py-2 font-semibold">자재명</div>
              <div class="pur801-fld flex min-w-0 items-center border-b border-r border-slate-400 bg-white px-2 py-1.5">
                <input type="text" class="h-7 w-full min-w-0 border border-slate-300 bg-[#e8e8e8] px-1.5 text-sm" v-model="scond5" disabled />
              </div>
              <div class="pur801-lbl-detail flex items-center justify-center whitespace-nowrap border-b border-r border-slate-400 px-1.5 py-2 text-center text-[13px] font-semibold leading-tight">단위(반품/이동단위)</div>
              <div class="pur801-fld flex min-w-0 items-center border-b border-slate-400 bg-white px-2 py-1.5">
                <input type="text" class="h-7 w-full min-w-0 border border-slate-300 bg-[#e8e8e8] px-1.5 text-sm" v-model="scond6" disabled />
              </div>
              <div class="pur801-lbl-detail flex items-center justify-center border-b border-r border-slate-400 px-1.5 py-2 font-semibold">매입단가</div>
              <div class="pur801-fld flex min-w-0 items-center border-b border-r border-slate-400 bg-white px-2 py-1.5">
                <input type="text" name="scond7" class="pur801-amt-left h-7 w-full border border-slate-300 px-1.5 text-sm" @input="onlyNumber2" v-model="scond7" />
              </div>
              <div class="pur801-lbl-detail flex items-center justify-center border-b border-r border-slate-400 px-1.5 py-2 font-semibold">이동수량</div>
              <div class="pur801-fld flex min-w-0 items-center border-b border-r border-slate-400 bg-white px-2 py-1.5">
                <input type="text" class="h-7 w-full min-w-0 border border-slate-300 px-1.5 text-sm" @input="onlyNumber" v-model="scond8" />
              </div>
              <div class="col-span-2 min-h-[2.25rem] border-b border-l border-slate-400 bg-white"></div>
              <div class="pur801-lbl-detail flex items-center justify-center border-r border-slate-400 px-1.5 py-2 font-semibold">공급가</div>
              <div class="pur801-fld flex min-w-0 items-center border-r border-slate-400 bg-white px-2 py-1.5">
                <input type="text" name="scond9" class="pur801-amt-left h-7 w-full border border-slate-300 bg-[#e8e8e8] px-1.5 text-sm" v-model="scond9" disabled readonly tabindex="-1" />
              </div>
              <div class="pur801-lbl-detail flex items-center justify-center border-r border-slate-400 px-1.5 py-2 font-semibold">부가세</div>
              <div class="pur801-fld flex min-w-0 items-center border-r border-slate-400 bg-white px-2 py-1.5">
                <input type="text" name="scond10" class="h-7 w-full min-w-0 border border-slate-300 bg-[#e8e8e8] px-1.5 text-sm" v-model="scond10" disabled readonly tabindex="-1" />
              </div>
              <div class="pur801-lbl-detail flex items-center justify-center border-r border-slate-400 px-1.5 py-2 font-semibold">합계금액</div>
              <div class="pur801-fld flex min-w-0 items-center gap-2 px-2 py-1.5">
                <input type="text" name="scond11" class="h-7 min-w-0 flex-1 border border-slate-300 bg-[#e8e8e8] px-1.5 text-sm" v-model="scond11" disabled readonly tabindex="-1" />
                <button type="button" class="pnc-sub-btn pnc-sub-btn--rose" @click="addRowData3">
                  <svg class="pnc-sub-btn__icon" viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M8 3.2v9.6M3.2 8h9.6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
                  </svg>
                  추가
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-2 flex min-h-0 flex-1 flex-col overflow-hidden border-t-2 border-slate-500 pt-3">
          <div class="pur801-grid h-full min-h-[12rem] w-full flex-1 overflow-hidden">
            <Realgrid
              :progname="'PUR08_003INS_VUE'"
              :progid="2"
              :rowData="rowData3"
              :setStateBar="false"
              :checkRenderEditable="true"
              :rowStateeditable="false"
              :editableColId="'dblQty,curUnitPrice'"
              :inputOnlyNumberColumn="'dblQty,curUnitPrice'"
              :CalculateTaxColId="'curTax'"
              :CalculateTaxColId2="'curSupply'"
              :CalculateTaxColId3="'curTotal'"
              :persistCalculateTax="true"
              :syncRowDataPulse="shipDetailSyncPulse"
              @updatedRowData="onShipDetailUpdated"
              @dblclickedRowData="removeDetailLine" />
          </div>
          <p class="shrink-0 px-1 pt-2 text-left text-sm font-bold leading-snug text-red-600">
            ※삭제 할 자재품목을 더블클릭 하시면 삭제가 가능합니다.
          </p>
        </div>
        <div class="pur801-resize" title="크기 조절" @mousedown.stop="shipPop.startResize"></div>
      </div>

      <div v-if="open2" class="pur801-overlay pur801-overlay--front" @mousedown.self.prevent>
        <div class="flex h-[min(88vh,36rem)] w-[min(92vw,40rem)] flex-col border border-slate-300 bg-white p-2 shadow-lg" @mousedown.stop>
          <div class="flex shrink-0 justify-end pb-2">
            <button type="button" class="pnc-sub-btn pnc-sub-btn--gray" @click="open2 = false">
              <svg class="pnc-sub-btn__icon" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M4 4l8 8M12 4 4 12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
              </svg>
              닫기
            </button>
          </div>
          <div class="min-h-0 flex-1">
            <Realgrid
              :progname="'PUR08_003INS_VUE'"
              :progid="3"
              :setStateBar="false"
              :rowStateeditable="false"
              @dblclickedRowData="clickedRowData"
              :rowData="rowData2" />
          </div>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- 그리드 영역 -->
</template>

<script setup>
import {
  deleteStoreMoveList,
  getStockList,
  getStoreMoveList,
  saveMoveStoreList,
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

import { formatLocalDate, insertPageLog } from "@/customFunc/customFunc";
import Swal from "sweetalert2";
/**
 *  경고창 호출 라이브러리
 *  */

/*
 * 공통 표준  Function
 */

import { nextTick, onMounted, onUnmounted, ref, watch } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";
import { useFloatPopup } from "@/utils/floatPopup";
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
const cond2 = ref(0);
/** getStoreMoveList @lngOption — 9 전체, 0 미확정, 1 확정 */
const cond3 = ref("9");
const cond4 = ref("");
const cond5 = ref(0);
const store = useStore();

const pur801ControlBorder = "#cbd5e1";
const pur801ColGutter = "1.125rem";
const pur801RowGap = "0.875rem";
const pur801LabelCol = "8.75rem";

const datepicker = ref(null);
const closePopUp = ref(false);
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
const optionList = ref([]);
const optionList3 = ref([]);
const optionList4 = ref([]);
const optionList5 = ref([]);

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
const storeCode2 = ref();
const lngStoreCode2 = async (e) => {
  initGrid();
  storeCode2.value = e;

  const res2 = await getLossMasterPartList(
    store.state.userData.lngStoreGroup,
    storeCode2.value
  );

  optionList3.value = res2.data.List;
};

const storeCode3 = ref();
const lngStoreCode3 = async (e) => {
  storeCode3.value = e;

  const res2 = await getLossMasterPartList(
    store.state.userData.lngStoreGroup,
    storeCode3.value
  );

  optionList4.value = res2.data.List;
};

const storeCode4 = ref();
const lngStoreCode4 = async (e) => {
  storeCode4.value = e;

  const res2 = await getLossMasterPartList(
    store.state.userData.lngStoreGroup,
    storeCode4.value
  );

  optionList5.value = res2.data.List;
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
    initGrid();

    const res = await getStoreMoveList(
      groupCd.value,
      storeCode.value,
      storeCode2.value,
      sDate.value.replaceAll("-", ""),
      eDate.value.replaceAll("-", ""),
      cond3.value
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

const updatedrowdata = ref([]);
const setAllCheck = ref(false);
const updatedRowData = (e) => {
  console.log(e);
  updatedrowdata.value = e;
};

/** 이동일자 → yyyyMMdd (이미 8자리면 그대로, formatLocalDate('20261016')→NaN 방지) */
const toMoveYmd = (v) => {
  if (v == null || v === "") return "";
  const s = String(v).trim();
  if (/^\d{8}$/.test(s)) return s;
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10).replaceAll("-", "");
  const formatted = formatLocalDate(v).replaceAll("-", "");
  return /^\d{8}$/.test(formatted) ? formatted : s.replaceAll(/[^\d]/g, "").slice(0, 8);
};

const isRowSelected = (v) =>
  v === true ||
  v === 1 ||
  v === "1" ||
  String(v ?? "").trim().toLowerCase() === "true";

const pickDeleteVal = (row, ...keys) => {
  if (!row || typeof row !== "object") return "";
  for (const k of keys) {
    const v = row[k];
    if (v !== undefined && v !== null && String(v).trim() !== "") return v;
  }
  return "";
};

/** 그리드 updatedRowData에 키 컬럼이 빠질 수 있어 조회 원본(rowData)과 병합 */
const collectDeleteTargets = () => {
  const list = Array.isArray(rowData.value) ? rowData.value : [];
  const updated = Array.isArray(updatedrowdata.value) ? updatedrowdata.value : [];
  const targets = [];
  for (let i = 0; i < updated.length; i++) {
    const u = updated[i];
    if (!u || !isRowSelected(u.Selected)) continue;
    const src = list[i] && typeof list[i] === "object" ? list[i] : {};
    const merged = { ...src, ...u };
    targets.push({
      lngFromStoreCode: pickDeleteVal(
        merged,
        "lngFromStoreCode",
        "LngFromStoreCode"
      ),
      strMoveSeqID: pickDeleteVal(merged, "strMoveSeqID", "StrMoveSeqID"),
      lngToStoreCode: pickDeleteVal(
        merged,
        "lngToStoreCode",
        "LngToStoreCode"
      ),
      strMoveDate: pickDeleteVal(merged, "strMoveDate", "StrMoveDate"),
      lngSupplierID: pickDeleteVal(merged, "lngSupplierID", "LngSupplierID"),
      lngStockID: pickDeleteVal(merged, "lngStockID", "LngStockID"),
    });
  }
  return targets;
};

const open = ref(false);
const open2 = ref(false);
const shipPop = useFloatPopup({
  width: 1152,
  height: 896,
  minWidth: 880,
  minHeight: 520,
});

const onShipHeadDown = (event) => {
  if (event.button !== 0) return;
  if (event.target.closest("button")) return;
  shipPop.startDrag(event);
};

/**
 * 매장 v-select는 append-to-body라 메뉴가 body 직속으로 붙음.
 * pickStore 기본 z-index:40 → 팝업(10050) 뒤에 깔림. 열릴 때 메뉴를 팝업 위로.
 */
const PUR801_NEWPOP_BODY_CLASS = "pur801-newpop-active";
const PUR801_DROPDOWN_Z = "11000";
let pur801MenuObserver = null;

const raisePur801StoreMenus = () => {
  document.querySelectorAll("body > .vs__dropdown-menu, body .vs__dropdown-menu").forEach((el) => {
    el.style.setProperty("z-index", PUR801_DROPDOWN_Z, "important");
  });
};

const stopPur801MenuObserver = () => {
  if (pur801MenuObserver) {
    pur801MenuObserver.disconnect();
    pur801MenuObserver = null;
  }
};

const startPur801MenuObserver = () => {
  stopPur801MenuObserver();
  if (typeof MutationObserver === "undefined" || typeof document === "undefined") return;
  raisePur801StoreMenus();
  pur801MenuObserver = new MutationObserver(() => raisePur801StoreMenus());
  pur801MenuObserver.observe(document.body, { childList: true, subtree: true });
};

watch(open, (shown) => {
  if (typeof document === "undefined") return;
  document.body.classList.toggle(PUR801_NEWPOP_BODY_CLASS, !!shown);
  if (shown) {
    shipPop.place();
    startPur801MenuObserver();
  } else {
    stopPur801MenuObserver();
  }
});

onUnmounted(() => {
  stopPur801MenuObserver();
  if (typeof document !== "undefined") {
    document.body.classList.remove(PUR801_NEWPOP_BODY_CLASS);
  }
});
const addButton = () => {
  scond3.value = formatLocalDate(new Date());
  scond.value = 0;
  scond2.value = 0;
  scond4.value = "";
  scond5.value = "";
  scond6.value = "";
  scond7.value = "";
  scond8.value = "";
  scond9.value = "";
  scond10.value = "";
  scond11.value = "";
  syncShipDetailView([]);
  disabled.value = false;
  open.value = true;
};

const searchButton2 = async () => {
  if (storeCode3.value == "0") {
    Swal.fire({
      title: "경고",
      text: "보내는 매장을 선택해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }

  if (storeCode4.value == "0") {
    Swal.fire({
      title: "경고",
      text: "받는 매장을 선택해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }

  if (storeCode3.value == storeCode4.value) {
    Swal.fire({
      title: "경고",
      text: "보내는 매장과 받는 매장이 같습니다. 확인해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }
  try {
    const res = await getStockList(
      groupCd.value,
      storeCode3.value,
      supplierid.value,
      scond3.value.replaceAll("-", ""),
      scond4.value
    );

    console.log(res);

    rowData2.value = res.data.List;
    open2.value = true;
  } catch (error) {}
};

const rowData2 = ref([]);
const scond = ref(0);
const scond2 = ref(0);
const supplierid = ref("0");
const scond3 = ref("");
const scond4 = ref("");
const scond5 = ref("");
const scond6 = ref("");
const scond7 = ref("");
const scond8 = ref("");
const scond9 = ref("");
const scond10 = ref("");
const scond11 = ref("");
const SupplierId = (e) => {
  supplierid.value =
    e === "" || e === null || e === undefined ? "0" : String(e);
};

const tempTaxType = ref("01");
const tempRowData2 = ref({});

/** USP_VUE_STK_STORE_MOVE_SAVE: curUnitPrice/curSupply/curTax = INT */
const toSaveIntStr = (v) => {
  const n = Math.round(Number(String(v ?? "").replace(/,/g, "").trim()));
  return Number.isFinite(n) ? String(n) : "0";
};

const clickedRowData = (e) => {
  const row = e && typeof e === "object" ? e : {};
  const stockId = row.lngStockID ?? row[0] ?? "";
  const stockName = row.strStockName ?? row[1] ?? "";
  const supplierName = row.strSupplierName ?? row[2] ?? "";
  const unitName = row.strUnitName ?? row[3] ?? "";
  const unitPrice = row.curUnitPrice ?? row[4] ?? "";
  const taxType = row.lngTaxType ?? row[5] ?? "01";
  const lineSupplier =
    row.lngSupplierID ?? row.LngSupplierID ?? supplierid.value ?? "0";

  tempRowData2.value = {
    lngStockID: stockId,
    strStockName: stockName,
    strSupplierName: supplierName,
    strUnitName: unitName,
    curUnitPrice: unitPrice,
    lngTaxType: taxType,
    lngSupplierID: lineSupplier,
  };
  scond4.value = stockId;
  scond5.value = stockName;
  scond6.value = unitName;
  scond7.value = unitPrice;
  scond8.value = 0;
  scond9.value = 0;
  scond10.value = 0;
  scond11.value = 0;
  tempTaxType.value = taxType;
  open2.value = false;
};

/** 매입단가·이동수량 → 공급가/부가세/합계 (세구분 01=과세 10%, 정수) */
const pur801RecalcAmounts = () => {
  const qty = parseInt(String(scond8.value || "0").replace(/,/g, ""), 10) || 0;
  const price =
    parseInt(String(scond7.value || "0").replace(/,/g, ""), 10) || 0;
  scond9.value = qty * price;
  scond10.value =
    tempTaxType.value == "01" ? Math.round(Number(scond9.value) * 0.1) : 0;
  scond11.value = Number(scond9.value) + Number(scond10.value);
};

const onlyNumber = (e) => {
  scond8.value = e.target.value.replace(/[^0-9]/g, "");
  pur801RecalcAmounts();
};

const onlyNumber2 = (e) => {
  if (e.target.name !== "scond7") return;
  scond7.value = e.target.value.replace(/[^0-9]/g, "");
  pur801RecalcAmounts();
};

const rowData3 = ref([]);
/** 출고 대기 원본 — 그리드 표시(rowData3)와 분리. 편집·저장은 이 배열 기준 */
const shipSaveLines = ref([]);
const disabled = ref(false);

const syncShipDetailView = (lines) => {
  const next = Array.isArray(lines) ? lines.map((r) => ({ ...r })) : [];
  shipSaveLines.value = next;
  rowData3.value = next.map((r) => ({ ...r }));
  updatedrowdata2.value = next;
};

const addRowData3 = async () => {
  if (scond5.value == "" || scond6.value == "") {
    await Swal.fire({
      title: "알림",
      text: "출고할 자재 품목을 선택해 주십시오.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  const qtyNum = Number(String(scond8.value ?? "").replace(/,/g, "").trim());
  if (!String(scond8.value ?? "").trim() || !Number.isFinite(qtyNum) || qtyNum <= 0) {
    await Swal.fire({
      title: "알림",
      text: "이동수량을 입력해 주십시오.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  const pick = tempRowData2.value || {};
  const cRowData3 = {
    lngStockID: pick.lngStockID ?? pick[0],
    strStockName: pick.strStockName ?? pick[1],
    lngTaxType: pick.lngTaxType ?? pick[5],
    strSupplierName: pick.strSupplierName ?? pick[2],
    strUnitName: pick.strUnitName ?? pick[3],
    lngSupplierID: pick.lngSupplierID ?? supplierid.value ?? "0",
    curUnitPrice: toSaveIntStr(scond7.value),
    dblQty: scond8.value,
    curSupply: toSaveIntStr(scond9.value),
    curTax: toSaveIntStr(scond10.value),
    curTotal: toSaveIntStr(scond11.value),
  };

  syncShipDetailView([...shipSaveLines.value, cRowData3]);
  scond4.value = "";
  scond5.value = "";
  scond6.value = "";
  scond7.value = "";
  scond8.value = "";
  scond9.value = "";
  scond10.value = "";
  scond11.value = "";
  disabled.value = true;
};

const removeDetailLine = async (row) => {
  const lines = shipSaveLines.value;
  if (!Array.isArray(lines) || lines.length === 0) return;
  let index = -1;
  if (row && typeof row === "object" && !Array.isArray(row) && row.dataRow != null) {
    index = Number(row.dataRow);
  } else if (Array.isArray(row)) {
    index = lines.findIndex((line) => String(line.lngStockID) === String(row[0] ?? ""));
  } else if (row && typeof row === "object") {
    index = lines.findIndex(
      (line) => String(line.lngStockID) === String(row.lngStockID ?? "")
    );
  }
  if (!Number.isFinite(index) || index < 0 || index >= lines.length) return;
  const name = lines[index].strStockName || "";
  const result = await Swal.fire({
    title: "확인",
    text: name ? `${name} 자재를 삭제하시겠습니까?` : "선택한 자재를 삭제하시겠습니까?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "삭제",
    cancelButtonText: "취소",
  });
  if (!result.isConfirmed) return;
  const next = lines.slice();
  next.splice(index, 1);
  syncShipDetailView(next);
  if (next.length === 0) disabled.value = false;
};

const updatedrowdata2 = ref([]);
const shipDetailSyncPulse = ref(0);
const updatedRowData2 = (e) => {
  updatedrowdata2.value = e;
};

/**
 * 그리드 수량 편집 → persistCalculateTax 로 공급가·부가세·합계 기록 후 emit.
 * shipSaveLines 만 갱신 (rowData3 재할당 시 setRows 로 편집이 되돌아가는 문제 방지).
 */
const onShipDetailUpdated = (e) => {
  const list = Array.isArray(e) ? e : [];
  const prev = shipSaveLines.value;
  if (list.length === 0 && prev.length === 0) return;
  shipSaveLines.value = list.map((row, i) => {
    const p = prev[i] || {};
    return {
      ...p,
      ...row,
      lngStockID: row.lngStockID ?? row.LngStockID ?? p.lngStockID,
      strStockName: row.strStockName ?? row.StrStockName ?? p.strStockName,
      lngTaxType: row.lngTaxType ?? row.LngTaxType ?? p.lngTaxType,
      strSupplierName:
        row.strSupplierName ?? row.StrSupplierName ?? p.strSupplierName,
      strUnitName: row.strUnitName ?? row.StrUnitName ?? p.strUnitName,
      lngSupplierID:
        row.lngSupplierID ?? row.LngSupplierID ?? p.lngSupplierID,
      curUnitPrice: row.curUnitPrice ?? row.CurUnitPrice ?? p.curUnitPrice,
      dblQty: row.dblQty ?? row.DblQty ?? row.dblMoveQty ?? p.dblQty,
      curSupply: row.curSupply ?? row.CurSupply ?? p.curSupply,
      curTax: row.curTax ?? row.CurTax ?? p.curTax,
      curTotal: row.curTotal ?? row.CurTotal ?? p.curTotal,
    };
  });
  updatedrowdata2.value = shipSaveLines.value.map((r) => ({ ...r }));
};

const lineMoveQty = (r) => {
  if (!r || typeof r !== "object") return 0;
  const raw = r.dblQty ?? r.DblQty ?? r.dblMoveQty ?? r.DblMoveQty ?? "";
  if (raw === null || raw === undefined || String(raw).trim() === "") return 0;
  const q = parseFloat(String(raw).replace(/,/g, "").trim());
  return Number.isFinite(q) ? q : 0;
};

const collectShipLinesForSave = () =>
  (Array.isArray(shipSaveLines.value) ? shipSaveLines.value : []).filter(
    (r) => r && String(r.lngStockID ?? r.LngStockID ?? "").trim() !== ""
  );

const closeShipPopup = async () => {
  open2.value = false;
  open.value = false;
  await searchButton();
};

const saveFieldStr = (v) => (v === undefined || v === null ? "" : String(v));

const moveRowKey = (r) =>
  [
    pickDeleteVal(r, "strMoveSeqID", "StrMoveSeqID"),
    pickDeleteVal(r, "lngStockID", "LngStockID"),
    pickDeleteVal(r, "lngFromStoreCode", "LngFromStoreCode"),
    pickDeleteVal(r, "lngToStoreCode", "LngToStoreCode"),
    toMoveYmd(pickDeleteVal(r, "strMoveDate", "StrMoveDate")),
  ].join("|");

/** 출고 직전 스냅샷 대비 새로 생긴 행만 삭제 — 중간 실패 시 부분 등록 되돌림 */
const rollbackNewMoveRows = async (beforeKeys, stockIdSet, ymd) => {
  try {
    const res = await getStoreMoveList(
      groupCd.value,
      storeCode3.value,
      storeCode4.value,
      ymd,
      ymd,
      9
    );
    const list = Array.isArray(res?.data?.List) ? res.data.List : [];
    const victims = list.filter((r) => {
      const sid = String(pickDeleteVal(r, "lngStockID", "LngStockID"));
      if (!stockIdSet.has(sid)) return false;
      const key = moveRowKey(r);
      return key && !beforeKeys.has(key);
    });
    if (victims.length === 0) return 0;
    await deleteStoreMoveList(
      groupCd.value,
      victims
        .map((r) => saveFieldStr(pickDeleteVal(r, "lngFromStoreCode", "LngFromStoreCode")))
        .join("\u200b"),
      victims
        .map((r) => saveFieldStr(pickDeleteVal(r, "strMoveSeqID", "StrMoveSeqID")))
        .join("\u200b"),
      victims
        .map((r) => saveFieldStr(pickDeleteVal(r, "lngToStoreCode", "LngToStoreCode")))
        .join("\u200b"),
      victims
        .map((r) => toMoveYmd(pickDeleteVal(r, "strMoveDate", "StrMoveDate")))
        .join("\u200b"),
      victims
        .map((r) => saveFieldStr(pickDeleteVal(r, "lngSupplierID", "LngSupplierID")))
        .join("\u200b"),
      victims
        .map((r) => saveFieldStr(pickDeleteVal(r, "lngStockID", "LngStockID")))
        .join("\u200b")
    );
    return victims.length;
  } catch (_) {
    return -1;
  }
};

const saveButton = async () => {
  /** 그리드 셀 편집(수량 0)이 rowData3에 안 반영된 채 저장되던 문제 방지 */
  shipDetailSyncPulse.value += 1;
  await nextTick();
  await nextTick();

  const lines = collectShipLinesForSave();
  if (lines.length === 0) {
    await Swal.fire({
      title: "알림",
      text: "출고할 자재가 없습니다. 추가로 등록한 뒤 출고해 주십시오.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  const zeroQtyLines = lines.filter((r) => lineMoveQty(r) <= 0);
  if (zeroQtyLines.length > 0) {
    const esc = (s) =>
      String(s ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    const listHtml = zeroQtyLines
      .map((r, i) => {
        const code = esc(
          String(r.lngStockID ?? r.LngStockID ?? "").trim() || "—"
        );
        const name = esc(
          String(r.strStockName ?? r.StrStockName ?? "").trim() || "—"
        );
        return `${i + 1}. [${code}] ${name}`;
      })
      .join("<br>");
    await Swal.fire({
      title: "알림",
      html:
        `이동수량이 0인 품목이 있습니다.<br>` +
        `해당 품목을 더블클릭으로 삭제하시거나<br>` +
        `이동 수량을 입력하여 출고해 주십시오.<br><br>` +
        `<div style="text-align:left;max-height:16rem;overflow:auto;line-height:1.5;">${listHtml}</div>`,
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  const ymd = scond3.value.replaceAll("-", "");
  const stockIdSet = new Set(lines.map((r) => String(r.lngStockID).trim()));
  let beforeKeys = new Set();

  try {
    const beforeRes = await getStoreMoveList(
      groupCd.value,
      storeCode3.value,
      storeCode4.value,
      ymd,
      ymd,
      9
    );
    beforeKeys = new Set(
      (Array.isArray(beforeRes?.data?.List) ? beforeRes.data.List : [])
        .map((r) => moveRowKey(r))
        .filter(Boolean)
    );
  } catch (_) {
    beforeKeys = new Set();
  }

  try {
    /**
     * asmx는 SUPPLIER.Split 길이로 루프 → 행별 거래처·금액을 같은 길이로 결합.
     * SP는 curUnitPrice/curSupply/curTax INT — 소수(부가세*0.1)면 Proc_Execute 실패.
     * 서버 트랜잭션이 없어 중간 실패 시 아래 보상 삭제로 부분 등록을 되돌림.
     */
    const supplierJoined = lines
      .map((item) =>
        saveFieldStr(item.lngSupplierID ?? supplierid.value ?? "0")
      )
      .join("\u200b");
    const res = await saveMoveStoreList(
      groupCd.value,
      storeCode3.value,
      storeCode4.value,
      ymd,
      supplierJoined,
      lines.map((item) => saveFieldStr(item.lngStockID)).join("\u200b"),
      lines.map((item) => toSaveIntStr(item.curUnitPrice)).join("\u200b"),
      lines.map((item) => saveFieldStr(item.dblQty)).join("\u200b"),
      lines.map((item) => toSaveIntStr(item.curSupply)).join("\u200b"),
      lines.map((item) => toSaveIntStr(item.curTax)).join("\u200b"),
      store.state.userData.lngSequence
    );

    if (res.data.RESULT_CD != "00") {
      const rolled = await rollbackNewMoveRows(beforeKeys, stockIdSet, ymd);
      const msg = res.data.RESULT_NM ?? "";
      await Swal.fire({
        title: "실패",
        text:
          rolled > 0
            ? `${msg}\n이미 저장된 출고 ${rolled}건은 취소했습니다.`
            : rolled < 0
              ? `${msg}\n부분 등록 취소에 실패했습니다. 목록을 확인해 주십시오.`
              : `${msg}`,
        icon: "error",
        confirmButtonText: "확인",
      });
      return;
    }

    await Swal.fire({
      title: "성공",
      text: "출고를 완료하였습니다",
      icon: "success",
      confirmButtonText: "확인",
    });

    /** 추가로 등록할 수 있도록 팝업은 유지하고 상세 행·매장 잠금만 해제 */
    syncShipDetailView([]);
    disabled.value = false;
  } catch (error) {
    const rolled = await rollbackNewMoveRows(beforeKeys, stockIdSet, ymd);
    await Swal.fire({
      title: "실패",
      text:
        rolled > 0
          ? `출고 중 오류가 발생했습니다.\n이미 저장된 출고 ${rolled}건은 취소했습니다.`
          : rolled < 0
            ? "출고 중 오류가 발생했습니다.\n부분 등록 취소에 실패했습니다. 목록을 확인해 주십시오."
            : "출고 중 오류가 발생했습니다.",
      icon: "error",
      confirmButtonText: "확인",
    });
  }
};

const deleteButton = async () => {
  const list = Array.isArray(rowData.value) ? rowData.value : [];
  const targets = collectDeleteTargets();

  if (list.length === 0 || targets.length === 0) {
    await Swal.fire({
      title: "알림",
      text: "삭제 할 출고내역이 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  const badIdx = targets.findIndex((t) => {
    const ymd = toMoveYmd(t.strMoveDate);
    return (
      !t.lngFromStoreCode ||
      !t.strMoveSeqID ||
      !t.lngToStoreCode ||
      !ymd ||
      !t.lngStockID
    );
  });
  if (badIdx >= 0) {
    await Swal.fire({
      title: "실패",
      text: "삭제 키가 없는 행이 있습니다. 조회 후 다시 선택해 주십시오.",
      icon: "error",
      confirmButtonText: "확인",
    });
    return;
  }

  try {
    /** asmx는 STORE_CD 등을 ZWSP로 분할한 뒤 USP_VUE_STK_STORE_MOVE_DELETE 호출 */
    const res = await deleteStoreMoveList(
      groupCd.value,
      targets.map((t) => saveFieldStr(t.lngFromStoreCode)).join("\u200b"),
      targets.map((t) => saveFieldStr(t.strMoveSeqID)).join("\u200b"),
      targets.map((t) => saveFieldStr(t.lngToStoreCode)).join("\u200b"),
      targets.map((t) => toMoveYmd(t.strMoveDate)).join("\u200b"),
      targets.map((t) => saveFieldStr(t.lngSupplierID)).join("\u200b"),
      targets.map((t) => saveFieldStr(t.lngStockID)).join("\u200b")
    );

    if (res.data.RESULT_CD == "00") {
      await Swal.fire({
        title: "성공",
        text: "삭제를 완료하였습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
      updatedrowdata.value = [];
      setAllCheck.value = !setAllCheck.value;
    } else {
      await Swal.fire({
        title: "실패",
        text: `${res.data.RESULT_NM}`,
        icon: "error",
        confirmButtonText: "확인",
      });
    }
  } catch (error) {
    await Swal.fire({
      title: "실패",
      text: "삭제 중 오류가 발생했습니다.",
      icon: "error",
      confirmButtonText: "확인",
    });
  } finally {
    await searchButton();
  }
};
</script>

<style scoped>
.pur801-search-panel {
  --pur801-panel-pad-x: 2rem;
  --pur801-control-h: 2rem;
  --pur801-row-min-h: 2rem;
  padding: 0.75rem 0;
  box-sizing: border-box;
}

@media (min-width: 768px) {
  .pur801-search-panel {
    --pur801-panel-pad-x: 3rem;
  }
}

.pur801-wire-grid {
  display: grid;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  align-items: center;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: var(--pur801-col-gutter);
  row-gap: var(--pur801-row-gap);
  padding-left: var(--pur801-panel-pad-x);
  padding-right: var(--pur801-panel-pad-x);
}

.pur801-wire-cell {
  display: flex;
  min-width: 0;
  min-height: var(--pur801-row-min-h);
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}

.pur801-wire-label {
  flex: 0 0 var(--pur801-label-col);
  width: var(--pur801-label-col);
  min-width: 0;
  max-width: var(--pur801-label-col);
  min-height: var(--pur801-row-min-h);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
  text-align: center;
}

.pur801-wire-field {
  /* 기존 63%의 70% — 보낸 매장 기준, 나머지 칸 동일 */
  display: flex;
  width: 44%;
  max-width: 44%;
  min-width: 0;
  flex: 0 1 auto;
  align-items: center;
  box-sizing: border-box;
}

.pur801-pick-slot {
  width: 100%;
  min-width: 0;
}

.pur801-pick-slot :deep(> div.flex.text-base) {
  width: 100%;
  min-width: 0;
}

.pur801-pick-slot :deep(> div.flex > div:first-child) {
  display: none;
}

.pur801-search-panel .pur801-pick-slot :deep(select),
.pur801-confirm-select {
  height: var(--pur801-control-h) !important;
  min-height: var(--pur801-control-h) !important;
  max-height: var(--pur801-control-h) !important;
  box-sizing: border-box;
  border: 1px solid var(--pur801-control-border) !important;
}

.pur801-search-panel .pur801-pick-slot :deep(div.relative.min-w-0.flex-1) {
  max-width: 100% !important;
  width: 100% !important;
  min-width: 0;
}

.pur801-confirm-row {
  width: 100%;
  max-width: 100%;
  min-width: 0;
}

.pur801-search-panel .pur801-date-slot :deep(> div.flex.justify-start.items-center) {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0;
  gap: 0.25rem !important;
}

.pur801-search-panel .pur801-date-slot :deep(> div.flex > div.inline-flex.h-8) {
  flex: 1 1 auto;
  min-width: 0;
  width: 100%;
  height: var(--pur801-control-h);
  gap: 0.125rem !important;
}

.pur801-search-panel .pur801-date-slot :deep(input[type="date"]) {
  border: 1px solid var(--pur801-control-border) !important;
  box-sizing: border-box;
  height: var(--pur801-control-h) !important;
  min-height: var(--pur801-control-h) !important;
  width: auto !important;
  flex: 1 1 0;
  min-width: 0;
  padding-left: 0.45rem;
  padding-right: 0.25rem;
}

.pur801-overlay {
  position: fixed;
  inset: 0;
  z-index: 10050;
  background: rgb(0 0 0 / 0.5);
  pointer-events: auto;
}

.pur801-overlay--front {
  z-index: 10060;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pur801-shell {
  position: fixed;
  z-index: 1;
  box-sizing: border-box;
  display: flex;
  min-width: 0;
  min-height: 0;
  flex-direction: column;
  overflow: hidden;
  border-radius: 0.5rem;
  background: #fff;
  padding: 1.25rem;
  box-shadow: 0 12px 32px rgb(15 23 42 / 28%);
}

.pur801-head {
  display: flex;
  shrink: 0;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.75rem;
  cursor: move;
  user-select: none;
}

.pur801-lbl-master {
  min-height: 2.25rem;
  background: #e6eef7;
}

.pur801-lbl-detail {
  min-height: 2.25rem;
  background: #e9e4db;
}

.pur801-fld {
  min-height: 2.25rem;
  box-sizing: border-box;
}

/* 매장 AREA ↔ 자재 AREA — 타이틀 밑줄과 동일 두께·색 */
.pur801-mid-sep {
  flex-shrink: 0;
  height: 0;
  margin: 0.75rem 0;
  border-bottom: 1px solid #e5e7eb;
}

/* 매입단가·공급가 오른쪽 끝 = 자재검색 조회 버튼 오른쪽 끝 (같은 열 칸 채움) */
.pur801-amt-left {
  width: 100%;
  max-width: none;
  box-sizing: border-box;
}

/* 보내는 매장 현재 칸 폭의 70% — 받는 매장·이동일자·거래처 동일 */
.pur801-master-ctrl {
  width: 70%;
  max-width: 70%;
  min-width: 0;
  box-sizing: border-box;
}

.pur801-pick :deep(> div.flex.text-base) {
  display: flex !important;
  width: 100%;
  min-width: 0;
  align-items: center;
}

.pur801-pick :deep(> div.flex > div:first-child) {
  display: none;
}

.pur801-pick :deep(div.relative.min-w-0),
.pur801-pick :deep(.pickstore-vs-shell) {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0;
  flex: 1 1 auto;
  height: 2rem !important;
  min-height: 2rem !important;
  max-height: 2rem !important;
  box-sizing: border-box;
  border: 1px solid #cbd5e1 !important;
  border-radius: 0.375rem;
  background: #fff !important;
  box-shadow: none !important;
}

.pur801-pick :deep(.pickstore-vs-shell .vs__dropdown-toggle) {
  height: 100% !important;
  min-height: 0 !important;
  border: none !important;
  background: transparent !important;
}

.pur801-pick :deep(.vs__selected),
.pur801-pick :deep(.vs__search),
.pur801-pick :deep(.vs__search::placeholder) {
  color: #111827 !important;
  -webkit-text-fill-color: #111827 !important;
}

.pur801-master-client :deep(> div) {
  margin: 0 !important;
  width: 100% !important;
  min-width: 0;
}

.pur801-master-client :deep(.pickstore-vs-shell) {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0;
  height: 2rem !important;
  min-height: 2rem !important;
  max-height: 2rem !important;
  box-sizing: border-box;
  border: 1px solid #cbd5e1 !important;
  border-radius: 0.375rem;
  background: #fff !important;
  box-shadow: none !important;
}

.pur801-master-client :deep(.pickstore-vs-shell .vs__dropdown-toggle) {
  height: 100% !important;
  min-height: 0 !important;
  border: none !important;
  background: transparent !important;
}

/* 매장 콤보(pickstore-chooser)와 동일: 화살표·글자 */
.pur801-master-client :deep(.pickstore-chooser .vs__selected),
.pur801-master-client :deep(.pickstore-chooser .vs__search),
.pur801-master-client :deep(.pickstore-chooser .vs__search::placeholder) {
  font-size: 0.875rem !important;
  font-weight: 400 !important;
  color: #111827 !important;
}

.pur801-master-client :deep(.pickstore-chooser .vs__open-indicator) {
  fill: #6b7280 !important;
  transform: scale(0.72) !important;
}

.pur801-master-client :deep(.pickstore-chooser.vs--open .vs__open-indicator) {
  fill: #6b7280 !important;
  transform: scale(0.72) rotate(180deg) !important;
}

.pur801-grid {
  min-height: 12rem;
}

.pur801-resize {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 16px;
  height: 16px;
  cursor: nwse-resize;
  background: linear-gradient(135deg, transparent 50%, #94a3b8 50%, #94a3b8 62%, transparent 62%, transparent 74%, #94a3b8 74%);
}

</style>
<!-- append-to-body 메뉴는 .style-chooser 밖(body 직속)에 붙음 — 팝업(10050)보다 위 -->
<style>
body.pur801-newpop-active .vs__dropdown-menu {
  z-index: 11000 !important;
}
</style>
