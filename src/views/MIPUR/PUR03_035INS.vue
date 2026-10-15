<!-- /*--############################################################################
# Filename : PUR03_035INS.vue                                                  
# Description : 마스터관리 > 발주 관리 > 발주 등록Ⅱ(파트별)                     
# Date :2025-09-18                                                           
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <div class="h-full" @click="handleParentClick">
    <!-- 조회조건 -->
    <div class="flex justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center mr-9 space-x-2 pr-5">
        <button @click="addButton" class="button new md:w-auto w-14">신규</button>

        <button @click="searchButton" class="button search w-auto">조회</button>
        <button @click="excelButton" class="button excel w-auto">엑셀</button>
      </div>
    </div>
    <div
      v-if="orderTimeInfo"
      class="text-sm text-blue-700 font-semibold px-2 py-1">
      {{ orderTimeInfo }}
    </div>

    <div
      class="pur035-search-panel z-10 mt-3 w-full min-w-0 overflow-x-auto rounded-lg bg-gray-200 px-24 py-3">
      <div
        class="pur035-search-grid min-w-0"
        :style="{
          '--pur035-control-border': pur035ControlBorder,
          '--pur035-item-gap': pur035ItemGap,
          '--pur035-combo-max': pur035ComboMaxCss,
        }">
        <div class="pur035-cell">
          <div class="pur035-sg-label">조회기간</div>
          <div class="pur035-cell-field pur035-date-slot min-w-0">
            <Datepicker_Order
              ref="datepicker"
              compactRow
              class="w-full min-w-0"
              mainName=""
              :closePopUp="closePopUp"
              @endDate="endDate"
              @startDate="startDate"
              :initToday="0"
              :initToday2="-7" />
          </div>
        </div>
        <div class="pur035-cell">
          <div class="pur035-sg-label">매장</div>
          <div class="pur035-cell-field pur035-pick-slot pur035-combo-cap min-w-0">
            <PickStore
              compact-search-bar
              :compact-store-combo-max-rem="pur035ComboMaxRem"
              main-name=""
              :default-store-nm="'전체'"
              :default-store="true"
              :default-store-type2="true"
              :hide-group="false"
              :hide-attr="false"
              @update:store-cd="handleStoreCd"
              @store-nm="storeNm" />
          </div>
        </div>
        <div class="pur035-cell">
          <div class="pur035-sg-label">파트</div>
          <div class="pur035-cell-field pur035-combo-cap min-w-0">
            <select
              id="pur03-035-part"
              v-model="cond"
              class="pur035-sg-select h-8 w-full min-w-0 rounded-md border border-solid bg-white text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              @change="getSelectedValue">
              <option
                v-for="i in optionList"
                :key="i.lngPartCode"
                :value="i.lngPartCode">
                {{ i.strPartName }}
              </option>
            </select>
          </div>
        </div>
        <div class="pur035-cell">
          <div class="pur035-sg-label">거래처</div>
          <div class="pur035-cell-field pur035-bc-slot pur035-combo-cap min-w-0">
            <BusinessClient2
              compact-search-bar
              @SupplierNm="SupplierNm"
              @SupplierId="SupplierId" />
          </div>
        </div>
      </div>
    </div>

    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="mt-2 w-full h-[80%]">
      <Realgrid
        :progid="1"
        :setFooter="true"
        :rowStateeditable="false"
        :progname="'PUR03_035INS_VUE'"
        :exporttoExcel="exporttoExcel"
        :documentSubTitle="documentSubTitle"
        :documentTitle="'PUR03_035INS'"
        @clickedRowData="clickedRowData"
        @selectedIndex2="onMainGridSelectedIndex"
        @clickedButtonCol="clickedButtonCol"
        @dblclickedRowData="dblclickedRowData"
        :rowData="rowData">
      </Realgrid>
    </div>
  </div>

  <div v-if="openpopup"
    class="fixed bottom-2 right-2 w-[87%] h-[85%] flex items-center justify-center bg-black/100 z-40">
    <!-- 팝업 컨텐츠 박스 -->
    <div
      class="bg-white p-4 rounded-lg shadow-lg w-full h-full border border-black"
      @mousedown.capture="onPopupMouseDownSyncBottomGrid">
      <div class="flex justify-between items-center mb-2">
        <h2 class="text-lg font-bold">발주 품목등록(파트별)</h2>
        <button
          @click="closeOpenpopup"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          닫기
        </button>
      </div>
      <div
        class="grid grid-cols-[minmax(4rem,1fr),minmax(6rem,1.2fr),minmax(4rem,1fr),minmax(7rem,1.5fr),minmax(4.5rem,1fr),minmax(7rem,1.5fr),auto,auto] text-sm border border-black">
        <!-- Row 1: 발주마감 -->
        <div class="bg-gray-100 font-semibold flex items-center justify-center px-2 py-1 border-b border-r border-black">
          발주마감
        </div>
        <div class="flex items-center px-2 py-1 border-b border-r border-black">
          <input
            type="text"
            class="border border-black h-7 w-full px-2 text-sm disabled:bg-gray-200"
            disabled
            v-model="scond" />
        </div>
        <div class="flex items-center px-2 py-1 border-b border-r border-black text-red-600 text-sm col-span-6">
          * 발주 등록 시 파트를 먼저 선택 해 주십시오.
        </div>

        <!-- Row 2: 매장명, 발주일, 납기예정일, 버튼 -->
        <div class="bg-gray-100 font-semibold flex items-center justify-center px-2 py-1 border-b border-r border-black">
          매장명
        </div>
        <div class="store-name-cell flex items-center justify-start px-2 py-1 border-b border-r border-black overflow-hidden min-w-0">
          <pickStore
            :hideGroup="false"
            :hideAttr="false"
            :disabledAll="true"
            :extraStoreOption="popupExtraStoreOption"
            :setDefaultStoreCd="popupSessionStoreCd"
            :setDynamicStoreClass="'!h-7 !w-full !min-w-0 !p-0 !-ml-0 !border-black !rounded-none !text-left'"
            :setDynamicStoreClass2="'!w-full !min-w-0 !-ml-0 !mt-0 !justify-start'"
            :mainName="''"></pickStore>
        </div>
        <div class="bg-gray-100 font-semibold flex items-center justify-center px-2 py-1 border-b border-r border-black">
          발주일
        </div>
        <div class="flex items-center px-2 py-1 border-b border-r border-black">
          <input
            type="date"
            class="border border-black h-7 w-full px-2 text-sm disabled:bg-gray-200"
            :disabled="isOrderDetailView"
            @change="setScond3"
            v-model="scond2" />
        </div>
        <div class="bg-gray-100 font-semibold flex items-center justify-center px-2 py-1 border-b border-r border-black">
          납기예정일
        </div>
        <div class="flex items-center px-2 py-1 border-b border-r border-black">
          <input
            type="date"
            class="border border-black h-7 w-full px-2 text-sm disabled:bg-gray-200"
            :disabled="isOrderDetailView"
            v-model="scond3" />
        </div>
        <div
          ref="popupOrderHeaderActionsWrap"
          class="flex items-center justify-end gap-3 px-2 py-1 border-b border-r border-black col-span-2">
          <button
            type="button"
            class="whitebutton !h-9 !px-5 !py-2 !text-sm !font-semibold !border-gray-500 !text-gray-700 hover:!bg-blue-50 hover:!border-blue-400 disabled:opacity-50 disabled:pointer-events-none"
            :disabled="isPopupToolbarLocked"
            @click="saveButton2">
            저장
          </button>
          <button
            type="button"
            class="whitebutton !h-9 !px-5 !py-2 !text-sm !font-semibold !border-gray-500 !text-gray-700 hover:!bg-blue-50 hover:!border-blue-400 disabled:opacity-50 disabled:pointer-events-none"
            :disabled="isPopupToolbarLocked || !isOrderDetailView"
            @click="deleteOrder">
            전표삭제
          </button>
          <button
            type="button"
            class="whitebutton !h-9 !px-5 !py-2 !text-sm !font-semibold !border-gray-500 !text-gray-700 hover:!bg-blue-50 hover:!border-blue-400 disabled:opacity-50 disabled:pointer-events-none"
            :disabled="isPopupToolbarLocked"
            @click="deleteStock2">
            자재제거
          </button>
        </div>

        <!-- Row 3: 파트명, 코멘트 -->
        <div class="bg-orange-200 font-semibold flex items-center justify-center px-2 py-1 border-b border-r border-black">
          파트명
        </div>
        <div class="flex items-center px-2 py-1 border-b border-r border-black">
          <select
            ref="popupPartSelectRef"
            class="border border-black h-7 w-full px-2 text-sm disabled:bg-gray-200"
            :disabled="isOrderDetailView"
            v-model="scond4"
            @change="searchButton4">
            <option :value="i.lngPartCode" v-for="i in optionList">
              {{ i.strPartName }}
            </option>
          </select>
        </div>
        <div class="bg-gray-100 font-semibold flex items-center justify-center px-2 py-1 border-b border-r border-black">
          코멘트
        </div>
        <div class="flex items-center px-2 py-1 border-b border-r border-black col-span-3">
          <input
            type="text"
            class="border border-black h-7 w-full px-2 text-sm"
            v-model="scond5" />
        </div>
      </div>
      <div ref="popupTopOrderGridWrap" class="h-[35%] w-full mt-2">
        <Realgrid
          :progid="2"
          :progname="'PUR03_035INS_VUE'"
          checkBarFieldName="chkTopRemove"
          :syncRowDataPulse="topGridSyncPulse"
          @updatedRowData="updatedRowData2"
          :editableColId="'dblOrderQty,strOrderComments'"
          :input-unsigned-decimal-column="'dblOrderQty'"
          :CalculateTaxColId="'curTax'"
          :CalculateTaxColId2="'curSupply'"
          :CalculateTaxColId3="'curTotal'"
          :persistCalculateTax="true"
          :setFooterColID="['dblOrderQty', 'curSupply', 'curTax', 'curTotal']"
          :setFooterExpressions="['sum', 'sum', 'sum', 'sum']"
          :checkRowAuto="false"
          :setFooter="true"
          :checkRowAuto2="true"
          :checkRenderEditable="true"
          :suppressEdit="isPopupToolbarLocked"
          :rowStateeditable="false"
          @realgridname="onPopupTopGridName"
          @gridReady="onPopupTopGridName"
          :rowData="rowData2"></Realgrid>
      </div>
      <div
        ref="popupMaterialToolbarWrap"
        class="flex justify-between items-center mt-2 border border-black bg-[#e8e4f0]">
        <!-- 같은 묶음(라벨+컨트롤): gap-2로 붙임 / 다른 묶음 사이: 고정 w-16 스페이서로만 간격(항상 동일) -->
        <div class="flex flex-wrap items-center py-2 pl-4 pr-2 gap-y-2">
          <div class="flex items-center gap-2 shrink-0">
            <span class="text-sm font-semibold text-gray-800 w-28 shrink-0">자재목록</span>
            <select
              class="border border-gray-600 h-7 px-2 text-sm w-40 shrink-0 disabled:bg-gray-200"
              v-model="scond7"
              :disabled="isPopupToolbarLocked"
              @change="searchButton3">
              <option value="1">최근등록</option>
              <option value="2">즐겨찾기</option>
            </select>
          </div>
          <div class="w-16 shrink-0" aria-hidden="true"></div>
          <businessClient
            inlineToolbar
            defaultName="거래처"
            @SupplierId="SupplierId2"></businessClient>
          <div class="w-16 shrink-0" aria-hidden="true"></div>
          <div class="flex items-center gap-2 shrink-0">
            <span class="text-sm font-semibold text-gray-800 w-28 shrink-0">자재코드/이름</span>
            <input
              type="text"
              class="border border-gray-600 h-7 px-2 text-sm w-40 shrink-0"
              v-model="scond6"
              @input="setScond6" />
          </div>
        </div>
        <div class="flex gap-3 py-2 pr-4">
          <button
            type="button"
            class="whitebutton !h-9 !px-5 !py-2 !text-sm !font-semibold !border-gray-500 !text-gray-700 hover:!bg-blue-50 hover:!border-blue-400 disabled:opacity-50 disabled:pointer-events-none"
            :disabled="isPopupToolbarLocked || isOrderDetailView"
            @click="showStockList">
            자재추가
          </button>
          <button
            type="button"
            class="whitebutton !h-9 !px-5 !py-2 !text-sm !font-semibold !border-gray-500 !text-gray-700 hover:!bg-blue-50 hover:!border-blue-400 disabled:opacity-50 disabled:pointer-events-none"
            :disabled="isPopupToolbarLocked || isOrderDetailView"
            @click="deleteStock">
            자재제거
          </button>
        </div>
      </div>
      <div ref="popupBottomMaterialGridWrap" class="h-[35%] mt-2">
        <Realgrid
          :progid="3"
          :progname="'PUR03_035INS_VUE'"
          :rowStateeditable="false"
          :setFooter="true"
          :setFooterColID="['dblOrderQty', 'curSupply', 'curTax', 'curTotal']"
          :setFooterExpressions="['sum', 'sum', 'sum', 'sum']"
          :CalculateTaxColId="'curTax'"
          :searchColId3="['lngSupplierID']"
          :searchValue="searchValue2"
          :input-unsigned-decimal-column="'dblOrderQty'"
          :CalculateTaxColId2="'curSupply'"
          :CalculateTaxColId3="'curTotal'"
          :persistCalculateTax="true"
          :editableColId="'dblOrderQty,strOrderComments'"
          :syncRowDataPulse="bottomGridSyncPulse"
          @updatedRowData="updatedRowData3"
          :checkRowAuto="false"
          :checkRowAuto2="true"
          :checkRenderEditable="true"
          :suppressEdit="isPopupToolbarLocked"
          :searchColId="'lngStockID,strStockName'"
          :searchWord3="scond6"
          @realgridname="onPopupBottomGridName"
          @gridReady="onPopupBottomGridName"
          :rowData="rowData3"></Realgrid>
      </div>
    </div>
  </div>

  <div
    v-if="openpopup2"
    class="fixed bottom-2 right-2 w-[52%] h-[85%] flex items-stretch justify-center bg-black/100 z-50 p-2 box-border">
    <div
      class="bg-white p-6 rounded-xl shadow-lg w-full h-full max-h-full border border-black flex flex-col min-h-0 min-w-0 box-border">
      <div class="flex shrink-0 items-center justify-between gap-3">
        <h2 class="text-base font-semibold">
          {{ String(scond7) === "2" ? "즐겨찾기 자재 추가" : "최근등록 자재 추가" }}
        </h2>
        <div class="flex gap-3">
        <button
          type="button"
          class="whitebutton !h-9 !px-5 !py-2 !text-sm !font-semibold !border-gray-500 !text-gray-700 hover:!bg-blue-50 hover:!border-blue-400 disabled:opacity-50 disabled:pointer-events-none"
          @click="addButton2">
          추가
        </button>
        <button
          type="button"
          class="whitebutton !h-9 !px-5 !py-2 !text-sm !font-semibold !border-gray-500 !text-gray-700 hover:!bg-blue-50 hover:!border-blue-400 disabled:opacity-50 disabled:pointer-events-none"
          @click="closeStockPickerPopup">
          닫기
        </button>
        </div>
      </div>
      <div
        class="mt-3 border border-black overflow-hidden shrink-0">
        <!-- 열: 라벨 | 자재특성콤보 | 간격 | 거래처라벨 | 거래처콤보 — 자재코드 입력은 자재특성 콤보 열 너비에만 맞춤 -->
        <div
          class="grid grid-cols-[6.75rem_minmax(0,1fr)_1.5rem_6.75rem_minmax(0,1fr)]">
          <div
            class="bg-gray-100 text-sm font-semibold flex items-center justify-center px-2 py-2 border-b border-r border-black">
            자재특성
          </div>
          <div
            class="flex items-center pl-2 pr-2 py-1.5 border-b border-r border-black bg-white min-w-0 min-h-9">
            <div class="pur-picker-vs min-w-0 w-full">
              <v-select
                v-model="sscond"
                :options="pickerGenericOptions"
                label="strGenericName"
                :reduce="(opt) => String(opt?.lngGenericID ?? '-1')"
                :clearable="false"
                append-to-body
                class="style-chooser h-7 w-full text-sm" />
            </div>
          </div>
          <div
            class="border-b border-r border-black bg-white shrink-0 min-h-9"
            aria-hidden="true"></div>
          <div
            class="bg-gray-100 text-sm font-semibold flex items-center justify-center px-2 py-2 border-b border-r border-black">
            거래처
          </div>
          <div
            class="flex items-center pl-2 pr-2 py-1.5 border-b border-black bg-white min-w-0 min-h-9">
            <div class="pur-picker-vs min-w-0 w-full">
              <BusinessClient2
                compact-search-bar
                :defaultName="''"
                :defaultNm="'전체'"
                @SupplierId="SupplierId3" />
            </div>
          </div>
          <div
            class="bg-gray-100 text-sm font-semibold flex items-center justify-center px-2 py-2 border-b border-r border-black">
            자재코드/이름
          </div>
          <div
            class="flex items-center pl-2 pr-2 py-1.5 border-b border-r border-black bg-white min-w-0 min-h-9">
            <input
              type="text"
              class="w-full h-7 border border-gray-600 px-2 text-sm min-w-0"
              @input="searchWord"
              v-model="sscond2" />
          </div>
          <div
            class="border-b border-r border-black bg-white min-h-9 shrink-0"
            aria-hidden="true"></div>
          <div
            class="col-span-2 border-b border-black bg-white min-h-9"></div>
        </div>
      </div>
      <div
        class="mt-1 flex min-h-0 flex-1 flex-col overflow-hidden pb-1">
        <div
          class="h-full min-h-0 w-full min-w-0"
          @mousedown="onStockPickerMouseDown">
        <Realgrid
          :progname="'PUR03_035INS_VUE'"
          :progid="4"
          :searchWord3="sscond2"
          :headerCheckBar="'lngCheck,lngFavorites'"
          :checkAbleExpressionCol="'lngCheck'"
          :checkAbleExpressionCol2="'lngPickerAddable'"
          :checkAbleExpressionVal="'1'"
          @updatedRowData="updatedRowData4"
          :rowStateeditable="false"
          :checkRenderEditable="true"
          :checkRowAuto="false"
          :checkRowAuto2="true"
          @clickedRowData="clickedRowData"
          @checkedRowData2="checkedRowData2"
          @checkAllorNot="onStockPickerCheckAll"
          :checkedRowData2Col="'lngFavorites'"
          :emitCheckedRowData2AsJson="true"
          :searchColId="'lngStockID,strStockName'"
          :searchColId3="['lngGenericID', 'lngSupplierID']"
          :searchValue="searchValue"
          @realgridname="onStockPickerGridName"
          @gridReady="onStockPickerGridName"
          :rowData="rowData4"></Realgrid>
        </div>
      </div>
    </div>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import { getStockGeneric } from "@/api/master";
import {
  deleteOrderChit,
  deleteOrderStockItem,
  getCloseDtmDate2,
  getOrderTimeCheck,
  getStkOrderDetail,
  getStockItemListWithFavorite,
  saveFavoriteStockItemBypart,
  setStockOrderTemp,
  saveOrderMasterDetailByPart,
  updateOrderStockDetail,
} from "@/api/mipur";
import { getStoreList2 } from "@/api/common";
import { getLossMasterPartList, getStockOrderList } from "@/api/mistock";
import BusinessClient from "@/components/businessClient.vue";
import BusinessClient2 from "@/components/businessClient2.vue";
import Datepicker_Order from "@/components/Datepicker_Order.vue";
/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
/**
 * 매장 공통 컴포넌트
 */

import PickStore from "@/components/pickStore.vue";
/**
 * 	그리드 생성
 */

import Realgrid from "@/components/realgrid.vue";
import { rgGetInstance } from "@/components/realgridInstanceRegistry.js";
/**
 *  페이지로그 자동 입력
 *  */

import { formatLocalDate, insertPageLog } from "@/customFunc/customFunc";
/**
 *  경고창 호출 라이브러리
 *  */

import Swal from "sweetalert2";
/*
 * 공통 표준  Function
 */

import { computed, nextTick, onMounted, ref, watch } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";

/**
 * 	화면 Load시 실행 스크립트
 */

const hidesub = ref(true);
const hideAttr = ref(true);
const cond = ref("0");
const cond2 = ref("");

const cond7 = ref("0");
const cond9 = ref("0");
const cond10 = ref("0");
const cond11 = ref("0");
const cond12 = ref("");
const cond13 = ref("");

/** 발주가능 시간 안내 문구 (Static6.Text) */
const orderTimeInfo = ref("");

/** 조회 AREA(search-area-layout) — PUR03_037RPT·PUR02_018INS 패턴 */
const pur035ControlBorder = "#cbd5e1";
/** 매장·파트·거래처 콤보 동일 비율(가로 상한 rem — PickStore prop + CSS max-width) */
const pur035ComboMaxRem = 20;
const pur035ComboMaxCss = `${pur035ComboMaxRem}rem`;
const pur035ItemGap = "0.5rem";

const datepicker = ref(null);
const closePopUp = ref(false);
const handleParentClick = (e) => {
  const datepickerEl = datepicker.value?.$el;
  if (datepickerEl && datepickerEl.contains(e.target)) {
    return;
  }
  closePopUp.value = !closePopUp.value;
};

/**
 * 발주가능 시간 체크
 * 팝업 오픈 시에는 popupSessionStoreCd(행 매장), 아니면 storeCd 사용.
 * @param {number} lngEventType 1:페이지로드 2:신규버튼 3:저장버튼 4:전표삭제버튼 5:자재제거버튼
 * @returns {boolean|undefined} type 2~5: true=허용, false=차단 / type 1: undefined
 */
const GetOrderTimeCheck = async (lngEventType) => {
  let sc = storeCd.value;
  if (openpopup.value) {
    const p = popupSessionStoreCd.value;
    if (p != null && p !== "" && p !== 0 && p !== "0") {
      sc = p;
    }
  }
  if (!sc || sc == 0) {
    orderTimeInfo.value = "";
    return lngEventType === 1 ? undefined : true;
  }
  try {
    const res = await getOrderTimeCheck(
      store.state.userData.lngStoreGroup,
      sc
    );
    const data = res?.data?.List?.[0];
    if (!data) return lngEventType === 1 ? undefined : true;

    const { OrderAble, StartTime, EndTime, SysTime } = data;

    // 호출 시마다 안내 문구 최신값으로 갱신
    if (OrderAble === "Y" && StartTime === "00" && EndTime === "24") {
      orderTimeInfo.value = "";
    } else {
      orderTimeInfo.value = `▣ 발주 등록은 ${StartTime}시 ~ ${EndTime}시 까지 가능 합니다.`;
    }

    if (lngEventType === 1) {
      if (OrderAble === "N") {
        await Swal.fire({
          title: "안내",
          text: `현재는 발주가능 시간이 아닙니다.\n현재시간 : ${SysTime}`,
          icon: "warning",
          confirmButtonText: "확인",
        });
      }
    } else if (lngEventType === 2) {
      if (OrderAble === "N") {
        await Swal.fire({
          title: "안내",
          text: `현재는 발주가능 시간이 아닙니다.\n현재시간 : ${SysTime}`,
          icon: "warning",
          confirmButtonText: "확인",
        });
        return false;
      }
      return true;
    } else if (lngEventType === 3) {
      if (OrderAble === "N") {
        await Swal.fire({
          title: "안내",
          text: `현재는 발주가능 시간이 아닙니다.\n발주등록은 ${StartTime}시 ~ ${EndTime}시 까지 가능 합니다.`,
          icon: "warning",
          confirmButtonText: "확인",
        });
        return false;
      }
      return true;
    } else if (lngEventType === 4) {
      if (OrderAble === "N") {
        await Swal.fire({
          title: "안내",
          text: `현재는 전표삭제가 불가능 합니다.\n이용시간은 ${StartTime}시 ~ ${EndTime}시 까지 가능 합니다.`,
          icon: "warning",
          confirmButtonText: "확인",
        });
        return false;
      }
      return true;
    } else if (lngEventType === 5) {
      if (OrderAble === "N") {
        await Swal.fire({
          title: "안내",
          text: `현재는 자재제거가 불가능 합니다.\n이용시간은 ${StartTime}시 ~ ${EndTime}시 까지 가능 합니다.`,
          icon: "warning",
          confirmButtonText: "확인",
        });
        return false;
      }
      return true;
    }
  } catch (_) {
    return lngEventType === 1 ? undefined : true;
  }
};

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  console.log(store.state.userData);

  const res3 = await getStockGeneric(store.state.userData.lngStoreGroup);

  optionList2.value = res3.data.List;

  await GetOrderTimeCheck(1);
});

const nowStoreAreaCd = ref();
const nowStoreCd = ref(0);
/**
 * 선택한 포스 번호 호출 함수
 */

/**
 *  그리드 검색어 세팅
 */
const sdate = ref("");
const edate = ref("");
const startDate = (e) => {
  sdate.value = e;
};
const endDate = (e) => {
  edate.value = e;
};
const clickedStoreNm = ref();
const commitAll = ref(false);
const store = useStore();
const userData = store.state.userData;
const groupCd = ref(store.state.userData.lngStoreGroup);
const cond3 = ref("");
const cond4 = ref("");
const cond5 = ref("");
const cond6 = ref("");
const storeCd = ref(0);
const optionList = ref([]);
const optionList2 = ref([]);
const pickerGenericOptions = computed(() => [
  { lngGenericID: "-1", strGenericName: "전체" },
  ...(optionList2.value || []),
]);
const handleStoreCd = async (e) => {
  storeCd.value = e;
  cond.value = "0";
  const res2 = await getLossMasterPartList(
    store.state.userData.lngStoreGroup,
    storeCd.value
  );

  optionList.value = res2.data.List;

  await GetOrderTimeCheck(1);
};

const allstaterows2 = ref([]);

const rowData = ref([]);
const rowData2 = ref([]);

const getSelectedValue = () => {
  const selectedCode = cond.value; 
  console.log("방금 선택된 값은 " + selectedCode + "입니다.");
  
  // 만약 값이 바뀔 때마다 서버 조회를 하고 싶다면 여기서 함수 호출
  // searchButton4(); 
};

/**
 *  조회 함수
 */
const supplierid = ref("0");
const suppliernm = ref("");
const SupplierId = (e) => {
  searchValue.value = [searchValue.value[0], e == "0" ? "-1" : e];
  supplierid.value = e;
};
/** 팝업 하단 자재목록 거래처 필터 전용 — 부모창 supplierid는 건드리지 않음 */
const SupplierId3 = (e) => {
  const v = e == null || e === "" || e == "0" ? "-1" : e;
  searchValue.value = [searchValue.value[0], v];
  if (openpopup2.value) clearStockPickerChecks(true);
};
const SupplierNm = (e) => {
  suppliernm.value = e;
};
const searchButton = async () => {
  try {
    store.state.loading = true;
    const res = await getStockOrderList(
      groupCd.value,
      storeCd.value,
      sdate.value.replaceAll("-", ""),
      edate.value.replaceAll("-", ""),
      supplierid.value,
      cond.value,
      store.state.userData.strLanguage
    );
    store.state.loading = false;
    rowData.value = res.data.List;
  } catch (error) {}
};

const updatedrowdata = ref([]);
const updatedrowdata2 = ref([]);
/**
 * [신규 발주 팝업] 상단·하단 발주수량 동기 구조 (단일 진실 원본: lngStockID → orderBookByStock)
 *
 * • 하단(자재목록) 그리드에 수량 입력 → updatedRowData3 가 행을 orderBook 에 merge → 같은 품목 요약 rows 가
 *   상단(발주내역) 그리드 rowData2 에 반영됨.
 *
 * • 상단 그리드에서 수량 변경 → updatedRowData2 가 rowData2 로 book 재구축 후 patchRowData3QtyFromOrderBook 로
 *   같은 lngStockID 품목 하단 줄의 발주수량·금액 컬럼만 맞춤.
 *
 * • 하단에서 다시 수정 → 역시 updatedRowData3 으로 book·상단 갱신 (emit 데이터가 이미 최신이므로 여기선 patch 불필요).
 *
 * • 팝업 @mousedown.capture 는 편집 커밋 순서만 보조할 뿐, 위 데이터 흐름을 대체하지 않음.
 *
 * • 체크박스: 상단 chkTopRemove 와 하단 checkbox/lngCheck 는 서로 다른 기능이므로 orderBook 병합 시 동기화하지 않음.
 */
const orderBookByStock = ref({});
/** 신규: 품목별 공급사 ID 스냅샷 — 하단 emit 시 공급사가 빈 문자열로 덮일 때 저장 보강 */
const newOrderSupplierByStockId = ref({});
/** 상단 자재제거 후 하단 emit 한 번: 의도적으로 0으로 만든 품목만 버킷에서 삭제 허용 (오동작으로 전 행이 0으로 오는 경우 방지) */
const allowZeroFromBottomThisRound = ref(null);
/** 하단 그리드 편집 커밋 후 상단 반영 — 팝업 내 클릭 시 syncRowDataPulse 증가 (상단·헤더버튼·자재툴바 제외) */
const bottomGridSyncPulse = ref(0);
/** 상단 발주그리드 먼저 커밋 — 하단 클릭 전 미커밋 편집이 orderBook 을 덮지 않도록 */
const topGridSyncPulse = ref(0);
const popupTopOrderGridWrap = ref(null);
const popupOrderHeaderActionsWrap = ref(null);
const popupMaterialToolbarWrap = ref(null);
/** 하단 자재목록 그리드 영역 */
const popupBottomMaterialGridWrap = ref(null);
const popupTopGridName = ref("");
const popupBottomGridName = ref("");
const ORDER_QTY_FIELD = "dblOrderQty";
/** 상단 발주수량 엔터·화살표 이동 중에는 하단 setRows 를 미룸(포커스 탈취 방지) */
let suppressBottomPatchFromTop = false;

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
  const start =
    typeof el?.selectionStart === "number" ? el.selectionStart : text.length;
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

const openOrderQtyEditor = (grid, dataRow) => {
  const open = () => {
    try {
      grid.setCurrent({ dataRow, fieldName: ORDER_QTY_FIELD });
    } catch (_) {}
    requestAnimationFrame(() => {
      try {
        grid.showEditor?.();
      } catch (_) {}
    });
  };
  nextTick(open);
};

const bindOrderQtyNav = (gridName) => {
  const gv = rgGetInstance(gridName)?.gridView;
  if (!gv) return;
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
    if (field === ORDER_QTY_FIELD && !isQtyDecimalKeyAllowed(grid, event)) {
      if (event?.preventDefault) event.preventDefault();
      return false;
    }
    const isEnter = key === "Enter" || key === 13;
    const isUp = key === "ArrowUp" || key === 38;
    const isDown = key === "ArrowDown" || key === 40;
    if (!isEnter && !isUp && !isDown) return true;
    if (field !== ORDER_QTY_FIELD) return true;

    let itemIndex = cur.itemIndex;
    if (itemIndex == null || itemIndex < 0) {
      try {
        itemIndex = grid.getItemIndex?.(cur.dataRow);
      } catch (_) {
        itemIndex = cur.dataRow;
      }
    }
    const itemCount = grid.getItemCount?.() ?? 0;
    let nextItem = itemIndex;
    if (isEnter || isDown) nextItem = itemIndex + 1;
    else nextItem = itemIndex - 1;

    let curDataRow = cur.dataRow;
    if (curDataRow == null || curDataRow < 0) {
      try {
        curDataRow = grid.getDataRow?.(itemIndex);
      } catch (_) {
        curDataRow = itemIndex;
      }
    }
    const isTopGrid = gridName === popupTopGridName.value;
    if (isTopGrid) suppressBottomPatchFromTop = true;
    try {
      grid.commit?.();
    } catch (_) {}
    if (isTopGrid) {
      nextTick(() => {
        suppressBottomPatchFromTop = false;
      });
    }

    if (nextItem < 0 || nextItem >= itemCount) {
      openOrderQtyEditor(grid, curDataRow);
      if (event?.preventDefault) event.preventDefault();
      return false;
    }
    let nextDataRow = nextItem;
    try {
      nextDataRow = grid.getDataRow?.(nextItem);
    } catch (_) {}
    if (nextDataRow == null || nextDataRow < 0) nextDataRow = nextItem;
    openOrderQtyEditor(grid, nextDataRow);
    if (event?.preventDefault) event.preventDefault();
    return false;
  };
};

const onPopupTopGridName = (name) => {
  if (name) popupTopGridName.value = name;
  bindOrderQtyNav(popupTopGridName.value);
};

const onPopupBottomGridName = (name) => {
  if (name) popupBottomGridName.value = name;
  bindOrderQtyNav(popupBottomGridName.value);
};

/** capture 단계 mousedown 시점에 포커스가 상단 발주그리드 안에 있는지 (편집 중인 채 하단으로 옮길 때만 상단 commit 필요) */
const isFocusInsideTopOrderGrid = () => {
  const wrap = popupTopOrderGridWrap.value;
  const ae = document.activeElement;
  return wrap != null && ae != null && ae instanceof Node && wrap.contains(ae);
};

/** 포커스가 하단 자재목록 그리드 안(발주수량 입력 등)인지 — 상단 클릭 전 하단 commit 용 */
const isFocusInsideBottomMaterialGrid = () => {
  const wrap = popupBottomMaterialGridWrap.value;
  const ae = document.activeElement;
  return wrap != null && ae != null && ae instanceof Node && wrap.contains(ae);
};

const onPopupMouseDownSyncBottomGrid = (ev) => {
  const t = ev?.target;
  if (!t || !(t instanceof Node)) return;

  const inTopGrid = popupTopOrderGridWrap.value?.contains(t) === true;

  /**
   * 예전에는 상단 클릭 시 여기서 바로 return 해 하단 편집이 커밋되지 않았음.
   * 하단 수정 직후 상단 클릭: 같은 틱에서 rowData(setRows)와 편집기가 경합하지 않도록 커밋은 다음 틱.
   */
  if (inTopGrid) {
    if (isFocusInsideBottomMaterialGrid()) {
      nextTick(() => {
        bottomGridSyncPulse.value++;
      });
    }
    return;
  }

  if (popupOrderHeaderActionsWrap.value?.contains(t)) return;
  if (popupMaterialToolbarWrap.value?.contains(t)) return;

  const inBottomGrid = popupBottomMaterialGridWrap.value?.contains(t) === true;

  /**
   * 하단을 클릭할 때마다 topGridSyncPulse → 상단 commit·emit → updatedRowData2 → patchRowData3 로
   * rowData3 가 매번 갱신되어 두 번째 칸부터 발주수량 입력이 막힘.
   * 포커스가 실제로 상단 그리드(편집 중)에 있을 때만 상단 commit — 하단 연속 입력은 건드리지 않음.
   * 상단 편집 후 하단으로 올 때는 capture 시점에 보통 아직 포커스가 상단에 있음.
   */
  if (inBottomGrid) {
    if (isFocusInsideTopOrderGrid()) {
      topGridSyncPulse.value++;
    }
    return;
  }

  if (isFocusInsideTopOrderGrid()) {
    topGridSyncPulse.value++;
  }
  nextTick(() => {
    patchRowData3QtyFromOrderBook();
    nextTick(() => {
      bottomGridSyncPulse.value++;
    });
  });
};

const STOCK_ID_KEYS = ["lngstockid", "stock_id", "stockid"];

const getStockId = (row) => {
  if (row == null) return "";
  if (Array.isArray(row)) {
    const v = row.lngStockID ?? row.LngStockID ?? row[0];
    if (v !== undefined && v !== null && v !== "") return String(v).trim();
  }
  if (typeof row !== "object") return "";
  const direct = [
    row.lngStockID,
    row.lngStockId,
    row.LngStockID,
    row.LngStockId,
    row.STOCK_ID,
    row.stockId,
    row.StockID,
  ];
  for (const v of direct) {
    if (v !== undefined && v !== null && v !== "") return String(v).trim();
  }
  for (const [k, v] of Object.entries(row)) {
    if (v === undefined || v === null || v === "") continue;
    if (STOCK_ID_KEYS.includes(String(k).toLowerCase())) return String(v).trim();
  }
  return "";
};

/** 상단 자재제거 체크 — RealGrid 체크바 필드 chkTopRemove(하단 checkbox 와 분리) */
const isTopRowCheckedForRemove = (item) => {
  if (item == null || typeof item !== "object") return false;
  if (Object.prototype.hasOwnProperty.call(item, "chkTopRemove")) {
    const cb = item.chkTopRemove;
    return (
      cb === true ||
      cb === 1 ||
      cb === "1" ||
      String(cb).trim() === "1"
    );
  }
  if (Object.prototype.hasOwnProperty.call(item, "checkbox")) {
    const cb = item.checkbox;
    return (
      cb === true ||
      cb === 1 ||
      cb === "1" ||
      String(cb).trim() === "1"
    );
  }
  const lc = item.lngCheck;
  return lc === true || lc === 1 || lc === "1";
};

/** 하단 발주수량이 0이 아닌지 */
const hasOrderQty = (item) => {
  const q = item?.dblOrderQty;
  if (q === "" || q === null || q === undefined) return false;
  if (q === "0" || q === 0) return false;
  const n = Number(q);
  return !Number.isNaN(n) ? n !== 0 : String(q).trim() !== "" && String(q).trim() !== "0";
};
const assignDefined = (base, patch) => {
  const out = { ...(base || {}) };
  if (!patch || typeof patch !== "object") return out;
  /** 하단 그리드가 공급사 컬럼을 안 줄 때 '' 로 오면 기존 @lngSupplierID 가 지워지는 것 방지 */
  const supplierKeys = new Set([
    "lngSupplierId",
    "lngSupplierID",
    "LngSupplierID",
    "LngSupplierId",
    "SUPPLIERID",
    "SupplierID",
  ]);
  for (const [k, v] of Object.entries(patch)) {
    if (v === undefined) continue;
    if (v === "" && supplierKeys.has(k) && getSupplierIdFromRow(out))
      continue;
    out[k] = v;
  }
  return out;
};

/** 하단 emit → orderBook 병합 시 체크 필드 제외(상단 chkTopRemove 와 무관한 별도 기능) */
const stripBottomGridCheckFieldsForBookMerge = (patch) => {
  if (!patch || typeof patch !== "object") return patch;
  const out = { ...patch };
  delete out.checkbox;
  delete out.lngCheck;
  return out;
};

/** 하단 행이 0이 아닌 발주수량(dblOrderQty)을 전달하는지 — 빈 값·0 은 false, 음수·소수 허용 */
const bottomRowAssertsPositiveOrderQty = (row) => {
  const patch = stripBottomGridCheckFieldsForBookMerge(row);
  const q = patch?.dblOrderQty;
  if (q === undefined || q === null || q === "") return false;
  const s = typeof q === "string" ? String(q).trim() : String(q);
  if (s === "" || s === "0") return false;
  const n = Number(s);
  if (!Number.isNaN(n)) return n !== 0;
  return hasOrderQty({ dblOrderQty: q });
};

/**
 * orderBook 에 이미 발주가 있는데 하단 emit 이 해당 품목을 0/빈 수량으로 보내는 경우
 * (목록 재조회 직후 API 0, 다른 행만 편집 시 전체 행이 함께 옴) 기존 발주가 지워지지 않게 함.
 */
const mergeBottomRowIntoBookBase = (prevBook, row) => {
  if (
    prevBook != null &&
    hasOrderQty(prevBook) &&
    !bottomRowAssertsPositiveOrderQty(row)
  ) {
    return { ...prevBook };
  }
  const patch = { ...stripBottomGridCheckFieldsForBookMerge(row) };
  return assignDefined(prevBook, patch);
};

/** 상단 발주내역 그리드에 줄 행 — book 에 남은 하단 체크 필드 제거 */
const sanitizeBookRowForTopGrid = (row) => {
  if (!row || typeof row !== "object") return row;
  const out = { ...row };
  delete out.checkbox;
  delete out.lngCheck;
  return out;
};
const rebuildOrderBookFromRows = (rows) => {
  const next = {};
  for (const row of rows || []) {
    const sid = getStockId(row);
    if (!sid || !hasOrderQty(row)) continue;
    next[sid] = { ...row };
  }
  orderBookByStock.value = next;
  patchNewOrderSupplierSnap(next);
};

/** 상단 변경 → 하단: orderBook 기준으로 하단 목록 중 같은 자재 행의 발주수량·금액·공급사만 덮어씀 */
const patchRowData3QtyFromOrderBook = () => {
  const book = orderBookByStock.value || {};
  rowData3.value = (rowData3.value || []).map((row) => {
    const sid = getStockId(row);
    const base = { ...row };
    if (!sid) return base;
    const br = book[sid];
    if (br != null && hasOrderQty(br)) {
      const sup = getSupplierIdFromRow(br);
      return {
        ...base,
        dblOrderQty: br.dblOrderQty,
        curSupply: br.curSupply,
        curTax: br.curTax,
        curTotal: br.curTotal,
        ...(sup ? { lngSupplierID: sup } : {}),
      };
    }
    return base;
  });
  updatedrowdata3.value = (rowData3.value || []).map((r) => ({ ...r }));
};

/**
 * 입력창 수정 데이터 갱신
 */
const disabled = ref(false);
const updatedRowData = (newValue) => {
  //console.log(newValue);
  updatedrowdata.value = newValue;
};
/** 상단 발주내역 그리드 emit — 상→하 동기화.
 * rowData2 에 다시 넣지 않음(setRows 되면 발주수량 편집·엔터 이동이 끊김).
 * 엔터·화살표 이동 중에는 하단 patch 도 건너뜀(하단 그리드가 포커스를 가져감). */
const updatedRowData2 = (newValue) => {
  const arr = Array.isArray(newValue) ? newValue : [];
  updatedrowdata2.value = arr;
  rebuildOrderBookFromRows(arr);
  if (suppressBottomPatchFromTop) return;
  patchRowData3QtyFromOrderBook();
};

/**
 * 그리드 행 삭제 버튼 함수
 */

const exporttoExcel = ref(false);

/**
 * 엑셀 내보내기 함수
 */
const documentSubTitle = ref("");

const storeNm = (e) => {
  clickedStoreNm.value = e;
};
const excelButton = () => {
  documentSubTitle.value =
    "매장명 :" +
    clickedStoreNm.value +
    "\n" +
    "발주일자 : " +
    sdate.value +
    "~" +
    edate.value +
    "\n파트 : " +
    optionList.value.filter((item) => item.lngPartCode == cond.value)[0]
      .strPartName;

  exporttoExcel.value = !exporttoExcel.value;
};

const openpopup = ref(false);
const isOrderDetailView = ref(false);
/** 상세 행/상세 API의 발주상태 (lngStatus). 신규는 빈 문자열 */
const orderDetailLngStatus = ref("");
/**
 * 상세에서만: lngStatus 가 없거나 "01"/"1" 일 때 편집 허용.
 * 납기 일자·발주마감 시각 잠금은 isExpectedDeliveryDateNotAllowed / isPastOrderCloseDtm.
 */
const isOrderDetailActionsEnabled = computed(() => {
  if (!isOrderDetailView.value) return true;
  const st = (orderDetailLngStatus.value ?? "").toString().trim();
  if (st === "") return true;
  return st === "01" || st === "1";
});
const isOrderDetailActionsDisabled = computed(
  () => !isOrderDetailActionsEnabled.value
);

/** 발주마감 표시 "YYYY년MM월DD일 HH:MM" → Date (로컬) */
const parseScondDisplayToDate = (scondStr) => {
  if (!scondStr || typeof scondStr !== "string") return null;
  const m = scondStr.match(/^(\d{4})년(\d{2})월(\d{2})일\s+(\d{2}):(\d{2})/);
  if (!m) return null;
  const [, y, mo, d, h, mi] = m;
  const dt = new Date(
    Number(y),
    Number(mo) - 1,
    Number(d),
    Number(h),
    Number(mi),
    0,
    0
  );
  return isNaN(dt.getTime()) ? null : dt;
};

/** 현재 일시가 발주마감 일시보다 이후 */
const isPastOrderCloseDtm = computed(() => {
  if (!openpopup.value) return false;
  const dt = parseScondDisplayToDate(scond.value);
  if (!dt) return false;
  return Date.now() > dt.getTime();
});

/** 오늘(로컬)이 납기예정일과 같거나 그 이후(날짜만 비교) */
const isExpectedDeliveryDateNotAllowed = computed(() => {
  if (!openpopup.value) return false;
  const today = formatLocalDate(new Date());
  const exp = (scond3.value || "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(exp)) return false;
  return today >= exp;
});

/** 마감·납기일·상세상태 불가 시 팝업 내 저장·삭제·자재 버튼 잠금 */
const isPopupToolbarLocked = computed(
  () =>
    isPastOrderCloseDtm.value ||
    isExpectedDeliveryDateNotAllowed.value ||
    isOrderDetailActionsDisabled.value
);

const orderClosePastWarningShown = ref(false);

watch([openpopup, isPastOrderCloseDtm], ([open, past]) => {
  if (!open) {
    orderClosePastWarningShown.value = false;
    return;
  }
  if (past && !orderClosePastWarningShown.value) {
    orderClosePastWarningShown.value = true;
    void Swal.fire({
      title: "안내",
      text: "현재 납기예정일은 마감되어 발주가 불가능합니다!",
      icon: "warning",
      confirmButtonText: "확인",
    });
  }
});

/** 팝업 매장 v-select: Vuex 목록에 없을 때 행 매장명으로 옵션 보강 */
const popupExtraStoreOption = ref(null);
/** 신규/상세 팝업 안에서만 쓰는 매장코드(상세로 조회조건 storeCd를 덮어쓰지 않도록 분리) */
const popupSessionStoreCd = ref(0);
/** 상세 팝업에서 수정 시 사용할 발주번호/발주순번 */
const popupSessionOrderNo = ref("");
const popupSessionOrderSeq = ref("");
/** 상세 조회 시 목록 행 헤더 공급사 — DeleteOrderChit 등 동일 조건식 */
const popupSessionSupplierId = ref("");
/** 동일 전표(GetstkOrderDetail) 품목별 검수수량 스냅샷 — 자재제거 가능 여부 판단용 */
const orderDetailCheckQtyByStockId = ref({});
/** 상세 조회 직후 품목별 공급사 ID — 그리드 emit 후 유실 시 updateOrderStockDetail 보강 */
const orderDetailSupplierByStockId = ref({});
/** 상세 조회 직후 품목별 발주순번 — 그리드 emit 후 유실 시 보강 */
const orderDetailOrderSeqByStockId = ref({});
const addButton = async () => {
  if (storeCd.value == "0") {
    Swal.fire({
      title: "경고",
      text: "매장을 선택해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }
  const canOrder = await GetOrderTimeCheck(2);
  if (!canOrder) return;
  popupSessionStoreCd.value = storeCd.value;
  popupSessionSupplierId.value = "";
  scond2.value = formatLocalDate(new Date());
  scond3.value = formatLocalDate(new Date().setDate(new Date().getDate() + 1));
  const closeDtmOk = await refreshOrderCloseDtmFromExpectedDate();
  if (!closeDtmOk) return;

  isOrderDetailView.value = false;
  orderDetailLngStatus.value = "";
  popupExtraStoreOption.value = null;
  orderDetailCheckQtyByStockId.value = {};
  orderDetailSupplierByStockId.value = {};
  orderDetailOrderSeqByStockId.value = {};
  orderBookByStock.value = {};
  newOrderSupplierByStockId.value = {};
  allowZeroFromBottomThisRound.value = null;
  rowData2.value = [];
  updatedrowdata2.value = [];

  const partCodeRaw = cond.value;
  const isPartAll =
    partCodeRaw == null ||
    partCodeRaw === "" ||
    partCodeRaw === "0" ||
    partCodeRaw === 0;
  if (isPartAll) {
    scond4.value = "0";
  } else {
    const partStr = String(partCodeRaw);
    const ok = optionList.value.some(
      (p) => String(p.lngPartCode ?? p.LngPartCode) === partStr
    );
    scond4.value = ok ? partStr : "0";
  }

  openpopup.value = true;

  if (scond4.value !== "0") {
    await loadPopupStockListForMaterialPane();
  }
};

const scond = ref("");
const scond2 = ref("");
const scond3 = ref("");
const scond4 = ref("0");
const popupPartSelectRef = ref(null);
const scond5 = ref("");
/** 자재목록: 1=최근등록, 2=즐겨찾기 */
const scond7 = ref("1");
const isPopupFavoriteMode = () => String(scond7.value) === "2";
/** getStockItemListWithFavorite UDATE — 발주등록II(018)과 동일, 입고예정일(scond3) YYYYMMDD */
const getFavoriteListUdate = () =>
  (scond3.value || "").trim().replaceAll("-", "");
const openpopup2 = ref(false);
const showStockList = () => {
  if (isPopupToolbarLocked.value) return;
  if (scond4.value == "0") {
    Swal.fire({
      title: "경고",
      text: "파트를 먼저 선택해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }

  openpopup2.value = true;
  searchButton2();
};

const sscond = ref("-1");
watch(sscond, (v) => {
  searchValue.value = [String(v ?? "-1"), searchValue.value[1]];
  if (openpopup2.value) clearStockPickerChecks(true);
});
const sscond2 = ref("");

const rowData4 = ref([]);

const searchButton2 = async () => {
  try {
    store.state.loading = true;
    const res = await getStockItemListWithFavorite(
      store.state.userData.lngStoreGroup,
      popupSessionStoreCd.value,
      scond4.value,
      3,
      getFavoriteListUdate()
    );
    const fav = await loadFavoriteStockList();
    stockPickerFavoriteIds.value = fav.ids;
    console.log(res);
    applyStockPickerRows(res?.data?.List ?? []);
  } catch (error) {
    stockPickerFavoriteIds.value = new Set();
    stockPickerAllRows.value = [];
    rowData4.value = [];
    updatedrowdata4.value = [];
  } finally {
    store.state.loading = false;
  }
};

const searchValue = ref(["-1", "-1"]);

const setSearchValue = (e) => {
  searchValue.value = [e.target.value, searchValue.value[1]];
  if (openpopup2.value) clearStockPickerChecks(true);
};

const searchWord = (e) => {
  sscond2.value = e.target.value;
  if (openpopup2.value) clearStockPickerChecks(true);
};

const isFavoriteCheckOn = (checked) => {
  if (checked === true || checked === 1 || checked === "1") return true;
  const s = String(checked ?? "")
    .trim()
    .toLowerCase();
  return s === "1" || s === "true" || s === "y" || s === "on";
};

const favoriteValueFromChecked = (checked) =>
  isFavoriteCheckOn(checked) ? 0 : 1;

const saveFavoriteForStock = async (stockId, value) => {
  if (!stockId) return;
  await saveFavoriteStockItemBypart(
    store.state.userData.lngStoreGroup,
    popupSessionStoreCd.value,
    stockId,
    value,
    scond4.value
  );
};

/** DIV=2 즐겨찾기 목록 — 팝업에 행·체크 표시 */
const loadFavoriteStockList = async () => {
  try {
    const res = await getStockItemListWithFavorite(
      store.state.userData.lngStoreGroup,
      popupSessionStoreCd.value,
      scond4.value,
      2,
      getFavoriteListUdate()
    );
    const rows = Array.isArray(res?.data?.List) ? res.data.List : [];
    const ids = new Set();
    for (const row of rows) {
      const id = getStockId(row);
      if (id) ids.add(id);
    }
    return { ids, rows };
  } catch (_) {
    return { ids: new Set(), rows: [] };
  }
};

const rememberPickerFavorite = (stockId, checked) => {
  if (!stockId) return;
  const next = new Set(stockPickerFavoriteIds.value);
  if (isFavoriteCheckOn(checked)) {
    next.add(stockId);
    unfavoritedStockIds.value = new Set(
      [...unfavoritedStockIds.value].filter((id) => !stockIdsEqual(id, stockId))
    );
  } else next.delete(stockId);
  stockPickerFavoriteIds.value = next;
};

/** 하단 자재목록을 마지막으로 불러온 유형(1 최근등록 / 2 즐겨찾기) */
const bottomListMode = ref("1");
/** 팝업에서 즐겨찾기 제외한 자재. API가 아직 옛 목록을 줘도 하단에 다시 넣지 않음 */
const unfavoritedStockIds = ref(new Set());

/** 즐겨찾기 제외 후에도 남길 품목: [추가] 한 것, 또는 상단에 발주수량이 있는 것 */
const isBottomStockSelectedToKeep = (row, sid) => {
  if (isStockPickerPopupAddedRow(row)) return true;
  const book = sid ? orderBookByStock.value?.[sid] : null;
  if (book && hasOrderQty(book)) return true;
  return false;
};

const stockIdsEqual = (a, b) => {
  const sa = String(a ?? "").trim();
  const sb = String(b ?? "").trim();
  if (!sa || !sb) return false;
  if (sa === sb) return true;
  const na = Number(sa);
  const nb = Number(sb);
  return Number.isFinite(na) && Number.isFinite(nb) && na === nb;
};

const collectRowStockIds = (row) => {
  const out = [];
  const add = (v) => {
    const s = String(v ?? "").trim();
    if (s && !out.some((x) => stockIdsEqual(x, s))) out.push(s);
  };
  add(getStockId(row));
  if (row && typeof row === "object" && !Array.isArray(row)) {
    add(row.lngStockID);
    add(row.lngStockId);
    add(row.LngStockID);
    add(row.STOCK_ID);
    add(row.stockId);
  }
  return out;
};

const isUnfavoritedStockId = (id) =>
  [...unfavoritedStockIds.value].some((d) => stockIdsEqual(d, id));

const markStocksUnfavorited = (stockIds) => {
  const next = new Set(unfavoritedStockIds.value);
  for (const id of stockIds || []) {
    const s = String(id ?? "").trim();
    if (s) next.add(s);
  }
  unfavoritedStockIds.value = next;
};

/** 018 searchButton3/4와 같이 하단 rowData3 만 갈아끼움. DataProvider 직접 setRows 하지 않음 */
const applyBottomListRows = (rows) => {
  const next = (Array.isArray(rows) ? rows : []).map((r) => ({ ...r }));
  rowData3.value = next;
  updatedrowdata3.value = next.map((r) => ({ ...r }));
};

const isBottomFavoriteList = () =>
  String(scond7.value) === "2" || String(bottomListMode.value) === "2";

/** 즐겨찾기 목록일 때만 하단에서 즉시 제외. API 재조회는 하지 않음(옛 목록이 다시 붙음) */
const dropUnfavoritedFromBottomNow = (stockIds) => {
  if (!isBottomFavoriteList()) return;
  markStocksUnfavorited(stockIds);
  const next = (rowData3.value || []).filter((r) => {
    const ids = collectRowStockIds(r);
    const dropped = ids.some((id) => isUnfavoritedStockId(id));
    if (!dropped) return true;
    return isBottomStockSelectedToKeep(r, getStockId(r) || ids[0]);
  });
  applyBottomListRows(next);
  unlockPickerRowsForAdd(stockIds);
};

/** 하단에서 빠진 품목만 팝업 추가 잠금을 푼다. 선택 체크는 그대로 둔다. */
const unlockPickerRowsForAdd = (stockIds) => {
  const idSet = new Set(
    (stockIds || []).map((id) => String(id ?? "").trim()).filter(Boolean)
  );
  if (idSet.size === 0) return;
  stockPickerAllRows.value = (stockPickerAllRows.value || []).map((r) => {
    const id = getStockId(r);
    if (!id || !idSet.has(id)) return r;
    return { ...r, lngPickerAddable: "1" };
  });
  const dp = rgGetInstance(stockPickerGridName.value)?.dataProvider;
  if (!dp || typeof dp.getRowCount !== "function") return;
  const n = dp.getRowCount();
  for (let i = 0; i < n; i++) {
    try {
      const id = getStockId(dp.getJsonRow(i));
      if (!id || !idSet.has(id)) continue;
      dp.setValue(i, "lngPickerAddable", "1");
    } catch (_) {}
  }
};

const resolvePickerStockId = (payload, dataRow) => {
  if (payload && typeof payload === "object") {
    const fromObj = getStockId(payload);
    if (fromObj) return fromObj;
    if (Array.isArray(payload) && payload.length >= 4) {
      const fromArr = String(payload[3] ?? "").trim();
      if (fromArr) return fromArr;
    }
  }
  if (dataRow == null || dataRow < 0) return "";
  try {
    const row = rgGetInstance(stockPickerGridName.value)?.dataProvider?.getJsonRow?.(
      dataRow
    );
    return getStockId(row);
  } catch (_) {
    return "";
  }
};

let syncingPickerFavoriteCells = false;

const pickerIdIsFavorite = (id) => {
  const s = String(id ?? "").trim();
  if (!s) return false;
  for (const x of stockPickerFavoriteIds.value) {
    if (stockIdsEqual(x, s)) return true;
  }
  return false;
};

/** 즐겨찾기 셀을 저장된 즐겨찾기만 켜 둔다. onlyOutsideFilter면 지금 조건 밖 행만 */
const applyPickerFavoriteCells = (onlyOutsideFilter) => {
  syncingPickerFavoriteCells = true;
  try {
    const inst = rgGetInstance(stockPickerGridName.value);
    const dp = inst?.dataProvider;
    const mapRow = (row) => {
      if (!row) return row;
      if (onlyOutsideFilter && rowMatchesPickerFilter(row)) return row;
      const id = getStockId(row);
      if (!id) return row;
      return { ...row, lngFavorites: pickerIdIsFavorite(id) };
    };
    if (dp && typeof dp.getRowCount === "function") {
      const n = dp.getRowCount();
      try {
        dp.beginUpdate?.();
        for (let i = 0; i < n; i++) {
          let row = null;
          try {
            row = dp.getJsonRow(i);
          } catch (_) {
            continue;
          }
          if (!row) continue;
          if (onlyOutsideFilter && rowMatchesPickerFilter(row)) continue;
          const id = getStockId(row);
          if (!id) continue;
          const on = pickerIdIsFavorite(id);
          try {
            if (isFavoriteCheckOn(dp.getValue(i, "lngFavorites")) !== on) {
              dp.setValue(i, "lngFavorites", on);
            }
          } catch (_) {}
        }
      } finally {
        try {
          dp.endUpdate?.();
        } catch (_) {}
      }
    }
    stockPickerAllRows.value = (stockPickerAllRows.value || []).map(mapRow);
    if (
      Array.isArray(stockPickerLiveRows.value) &&
      stockPickerLiveRows.value.length
    ) {
      stockPickerLiveRows.value = stockPickerLiveRows.value.map(mapRow);
    }
  } finally {
    syncingPickerFavoriteCells = false;
  }
};

/** 자재추가 팝업: 즐겨찾기(lngFavorites) 토글 시마다 API 호출 */
const checkedRowData2 = async (payload, fieldName, dataRow, oldVal, newVal) => {
  const col = String(fieldName || "").trim();
  if (col && col !== "lngFavorites" && col !== "LngFavorites") return;
  if (syncingPickerFavoriteCells) return;
  const rowObj =
    payload && typeof payload === "object" && !Array.isArray(payload)
      ? payload
      : null;
  const stockId = resolvePickerStockId(payload, dataRow);
  let matchesFilter = true;
  if (rowObj) matchesFilter = rowMatchesPickerFilter(rowObj);
  else if (dataRow != null && dataRow >= 0) {
    try {
      const r = rgGetInstance(
        stockPickerGridName.value
      )?.dataProvider?.getJsonRow?.(dataRow);
      if (r) matchesFilter = rowMatchesPickerFilter(r);
    } catch (_) {}
  }
  if (!matchesFilter) return;
  if (!stockId) return;
  const favRaw =
    newVal !== undefined && newVal !== null
      ? newVal
      : payload && typeof payload === "object" && !Array.isArray(payload)
        ? getRowVal(payload, "lngFavorites", "LngFavorites")
        : Array.isArray(payload)
          ? payload[1]
          : undefined;
  try {
    await saveFavoriteForStock(stockId, favoriteValueFromChecked(favRaw));
    rememberPickerFavorite(stockId, favRaw);
    if (!isFavoriteCheckOn(favRaw)) {
      dropUnfavoritedFromBottomNow([stockId]);
    }
  } catch (_) {}
};

/** 헤더 전체선택 — 선택(lngCheck)은 추가용, 즐겨찾기(lngFavorites)는 저장용 */
const onStockPickerCheckAll = async (chk, fieldName) => {
  const col = String(fieldName || "").trim();
  const isOn = chk === true || chk === 1 || chk === "1";
  stockPickerAcceptChecks = true;

  if (col === "lngCheck" || col === "LngCheck") {
    const checked = collectCheckedPickerRowsFromProvider();
    stockPickerCheckedIds.value = new Set(
      checked.map(getStockId).filter(Boolean)
    );
    updatedrowdata4.value = checked;
    return;
  }

  if (col !== "lngFavorites" && col !== "LngFavorites") return;
  const fallback =
    stockPickerLiveRows.value.length > 0
      ? stockPickerLiveRows.value
      : rowData4.value;
  const visible = getPickerVisibleRows(fallback);
  const visibleIds = new Set(visible.map(getStockId).filter(Boolean));
  if (visibleIds.size === 0) return;
  const value = favoriteValueFromChecked(chk);
  if (isOn) {
    unfavoritedStockIds.value = new Set(
      [...unfavoritedStockIds.value].filter((id) => !visibleIds.has(String(id)))
    );
  }
  store.state.loading = true;
  try {
    await Promise.allSettled(
      visible.map((row) => {
        const stockId = getStockId(row);
        return stockId
          ? saveFavoriteForStock(stockId, value)
          : Promise.resolve();
      })
    );
    const next = new Set(stockPickerFavoriteIds.value);
    for (const id of visibleIds) {
      if (isOn) next.add(id);
      else next.delete(id);
    }
    stockPickerFavoriteIds.value = next;
    if (!isOn) {
      dropUnfavoritedFromBottomNow([...visibleIds]);
    }
    applyPickerFavoriteCells(true);
  } finally {
    store.state.loading = false;
  }
};

const selectedRowForPopup = ref(null);
const selectedMainRowIndex = ref(-1);

const onMainGridSelectedIndex = (idx) => {
  selectedMainRowIndex.value =
    typeof idx === "number" && idx >= 0 ? idx : -1;
};

const resolveMainGridRowObject = (row) => {
  if (row && typeof row === "object" && !Array.isArray(row)) {
    return row;
  }
  if (Array.isArray(row)) {
    const orderNoFromArray = String(row[7] ?? "").trim();
    const storeCdFromArray = String(row[1] ?? "").trim();
    if (orderNoFromArray && Array.isArray(rowData.value)) {
      const found = rowData.value.find((r) => {
        const orderNo = String(
          getRowVal(r, "strOrderNo", "StrOrderNo") ?? ""
        ).trim();
        if (orderNo !== orderNoFromArray) return false;
        if (!storeCdFromArray) return true;
        const storeCd = String(
          getRowVal(r, "lngStoreCode", "LngStoreCode") ?? ""
        ).trim();
        return storeCd === storeCdFromArray;
      });
      if (found) {
        return found;
      }
    }
  }
  const rowIdx = Number(row?.dataRow ?? row?.index);
  const idx =
    Number.isInteger(rowIdx) && rowIdx >= 0
      ? rowIdx
      : selectedMainRowIndex.value;
  if (idx >= 0 && Array.isArray(rowData.value) && idx < rowData.value.length) {
    return rowData.value[idx];
  }
  return null;
};

const clickedRowData = (row) => {
  selectedRowForPopup.value = resolveMainGridRowObject(row);
};

const getRowVal = (r, ...keys) => {
  if (!r || typeof r !== "object") return undefined;
  for (const k of keys) {
    const v = r[k];
    if (v != null && v !== "") return v;
  }
  const keysLower = Object.keys(r).map((x) => x.toLowerCase());
  for (const k of keys) {
    const idx = keysLower.indexOf(k.toLowerCase());
    if (idx >= 0) {
      const v = Object.values(r)[idx];
      if (v != null && v !== "") return v;
    }
  }
  return undefined;
};

/** 상세/그리드 행 공급사 ID — API·직렬화 필드명 혼용 */
const getSupplierIdFromRow = (row) => {
  if (!row || typeof row !== "object") return "";
  const v = getRowVal(
    row,
    "lngSupplierId",
    "lngSupplierID",
    "LngSupplierID",
    "LngSupplierId",
    "SUPPLIERID",
    "SupplierID"
  );
  if (v === undefined || v === null || v === "") return "";
  return String(v).trim();
};

/** API 전달용 공급사 ID — 공백·문자열 "0"·숫자 0(예: "00") 제외. 비숫자 코드는 그대로 허용 */
const isValidSupplierIdForApi = (v) => {
  const t = String(v ?? "").trim();
  if (!t) return false;
  const n = Number(String(t).replaceAll(",", ""));
  if (!Number.isNaN(n) && n === 0) return false;
  return true;
};

/** 신규: orderBook 갱신 시 품목별 공급사 스냅샷 유지(빈 값으로 덮어쓰지 않음) */
function patchNewOrderSupplierSnap(book) {
  if (isOrderDetailView.value) return;
  const b = book || {};
  const prev = newOrderSupplierByStockId.value || {};
  const snap = {};
  for (const [sid, row] of Object.entries(b)) {
    const sup = getSupplierIdFromRow(row);
    snap[sid] = sup || prev[sid] || "";
  }
  newOrderSupplierByStockId.value = snap;
}

/** 품목별 발주순번 — API·직렬화 필드명 혼용 (행마다 상이) */
const getOrderSeqFromRow = (row) => {
  if (!row || typeof row !== "object") return "";
  const v = getRowVal(
    row,
    "lngOrderSeq",
    "LngOrderSeq",
    "LNG_ORDER_SEQ",
    "OrderSeq",
    "intOrderSeq"
  );
  if (v === undefined || v === null || v === "") return "";
  return String(v).trim();
};

/** 상세 API 주문일자 파라미터용 yyyyMMdd */
const toOrderDateYyyyMmDd = (val) => {
  if (val == null || val === "") return "";
  const s = String(val).replaceAll("-", "").replace(/\D/g, "");
  return s.length >= 8 ? s.slice(0, 8) : "";
};

const openOrderDetailPopup = async (row) => {
  const rowIdx = row?.index ?? row?.dataRow ?? selectedMainRowIndex.value;
  const originalRow = rowIdx != null && rowData.value?.[rowIdx];
  const r = (originalRow && typeof originalRow === "object")
    ? originalRow
    : (row && typeof row === "object" ? row : {});
  console.log("[openOrderDetailPopup] row fields:", Object.keys(r), r);
  const groupCdVal = getRowVal(r, "lngStoreGroup", "LngStoreGroup") ?? groupCd.value;
  let storeCdVal = getRowVal(r, "lngStoreCode", "LngStoreCode");
  const orderNoVal = getRowVal(r, "strOrderNo", "StrOrderNo");
  const storeNameVal = getRowVal(r, "strStoreName", "StrStoreName");


  if (!orderNoVal) {
    Swal.fire({
      title: "안내",
      text: "발주번호를 찾을 수 없습니다.",
      icon: "warning",
    });
    return;
  }

  if (storeCdVal == null && storeNameVal) {
    try {
      const resStore = await getStoreList2(groupCdVal);
      const storeList = resStore?.data?.List ?? resStore?.data?.store ?? resStore?.data ?? [];
      const arr = Array.isArray(storeList) ? storeList : [];
      const found = arr.find(
        (s) => (s.strName || s.strStoreName || s.StrStoreName || "") === storeNameVal
      );
      storeCdVal = found?.lngStoreCode ?? found?.LngStoreCode;
    } catch (_) {}
  }

  if (storeCdVal == null) {
    Swal.fire({
      title: "안내",
      text: "매장정보를 찾을 수 없습니다. (매장명: " + (storeNameVal || "-") + ")",
      icon: "warning",
    });
    return;
  }

  try {
    store.state.loading = true;

    const supplierIdVal = String(
      getRowVal(r, "lngSupplierID", "LngSupplierID") ?? "0"
    );
    const orderDateVal = toOrderDateYyyyMmDd(
      getRowVal(r, "dtmOrderDate", "DtmOrderDate")
    );
    console.log("lngSupplierID 값은 " + getRowVal(r, "lngSupplierID") + "입니다.");
    console.log("dtmOrderDate 값은 " + orderDateVal + "입니다.");


    const [resDetail, resPart] = await Promise.all([
      getStkOrderDetail(
        groupCdVal,
        storeCdVal,
        orderNoVal,
        supplierIdVal,
        orderDateVal,
        "01"
      ),
      getLossMasterPartList(store.state.userData.lngStoreGroup, storeCdVal),
    ]);

    const list = resDetail.data.List ?? [];
    {
      const m = {};
      const supMap = {};
      const seqMap = {};
      for (const item of list) {
        const sid = getStockId(item);
        if (!sid) continue;
        const q = item.dblCheckQty ?? item.DblCheckQty;
        const n =
          typeof q === "number"
            ? q
            : Number(String(q ?? "").replaceAll(",", ""));
        m[sid] = Number.isNaN(n) ? 0 : n;
        const sup = getSupplierIdFromRow(item);
        if (sup) supMap[sid] = sup;
        const oseq = getOrderSeqFromRow(item);
        if (oseq) seqMap[sid] = oseq;
      }
      orderDetailCheckQtyByStockId.value = m;
      orderDetailSupplierByStockId.value = supMap;
      orderDetailOrderSeqByStockId.value = seqMap;
    }
    console.log("[상세 list] 첫번째 항목 fields:", list[0] ? Object.keys(list[0]) : "없음", list[0]);
    let partList = resPart.data.List ?? [];
    let partCode = getRowVal(r, "lngPartCode", "LngPartCode");
    const partName = getRowVal(r, "strPartName", "StrPartName");

    if (partCode == null && partName) {
      const found = partList.find(
        (p) => (p.strPartName || p.StrPartName || "") === partName
      );
      partCode = found?.lngPartCode ?? found?.LngPartCode;
    }
    if (partCode != null && !partList.some((p) => (p.lngPartCode ?? p.LngPartCode) == partCode)) {
      partList = [{ lngPartCode: partCode, strPartName: partName || "-" }, ...partList];
    }
    optionList.value = partList;
    popupSessionStoreCd.value = storeCdVal;
    popupSessionOrderNo.value = orderNoVal ?? "";
    popupSessionOrderSeq.value = String(list[0]?.lngOrderSeq ?? "");
    popupSessionSupplierId.value = supplierIdVal;
    popupExtraStoreOption.value =
      storeCdVal != null && storeCdVal !== ""
        ? {
            lngStoreCode: storeCdVal,
            strName: storeNameVal || String(storeCdVal),
          }
        : null;

    const fmtDate = (val) =>
      val && String(val).length >= 8 && /^\d{8}$/.test(String(val))
        ? `${String(val).slice(0, 4)}-${String(val).slice(4, 6)}-${String(val).slice(6, 8)}`
        : "";
    scond2.value = fmtDate(getRowVal(r, "dtmOrderDate", "DtmOrderDate"));
    scond3.value = fmtDate(getRowVal(r, "dtmExpectedDate", "DtmExpectedDate"));
    scond4.value = partCode != null ? String(partCode) : "0";
    scond5.value = getRowVal(r, "strHeaderOrderComments", "StrHeaderOrderComments") ?? getRowVal(r, "strOrderComments", "StrOrderComments") ?? "";
    console.log("[scond5] 헤더코멘트:", scond5.value, "| row keys:", Object.keys(r));

    const statusRow = getRowVal(r, "lngStatus", "LngStatus");
    const statusDetail =
      list[0] != null ? getRowVal(list[0], "lngStatus", "LngStatus") : undefined;
    const st =
      statusRow != null && statusRow !== ""
        ? statusRow
        : statusDetail != null && statusDetail !== ""
          ? statusDetail
          : "";
    orderDetailLngStatus.value = st != null && st !== "" ? String(st).trim() : "";

    /** 발주마감: 행 매핑 없이 납기 기준 getCloseDtmDate2만 사용(openpopup 전이므로 popupSessionStoreCd 이미 설정됨) */
    await refreshOrderCloseDtmFromExpectedDate();

    isOrderDetailView.value = true;

    rowData2.value = list.map((item) => {
      const toNum = (v) => {
        if (v === null || v === undefined || v === "") return 0;
        if (typeof v === "number") return v;
        const n = Number(String(v).replaceAll(",", ""));
        return isNaN(n) ? 0 : n;
      };
      return {
        ...item,
        dblOrderQty: toNum(item.dblOrderQty),
        curSupply: toNum(item.curSupply),
        curTax: toNum(item.curTax),
        curTotal: toNum(item.curTotal),
        /** 자재제거 체크만 사용 — 상세 API lngCheck 가 1 이면 미선택인데도 선택으로 오인됨 */
        checkbox: false,
      };
    });
    rebuildOrderBookFromRows(rowData2.value);
    allowZeroFromBottomThisRound.value = null;

    openpopup.value = true;
    await loadPopupStockListForMaterialPane();
  } catch (error) {
    Swal.fire({
      title: "오류",
      text: "발주 상세 조회에 실패했습니다.",
      icon: "error",
    });
  } finally {
    store.state.loading = false;
  }
};

const tempColId = ref("");
const clickedButtonCol = async (e) => {
  tempColId.value = e;
  if (e === "strOrderNo") {
    if (selectedRowForPopup.value) {
      await openOrderDetailPopup(selectedRowForPopup.value);
    } else {
      Swal.fire({
        title: "안내",
        text: "먼저 해당 행을 클릭한 뒤 발주번호를 클릭해주세요.",
        icon: "warning",
      });
    }
  }
};

const dblclickedRowData = async (row) => {
  const r = row && typeof row === "object" ? row : {};
  await openOrderDetailPopup(r);
};

const stockPickerAllRows = ref([]);
const stockPickerFavoriteIds = ref(new Set());
const stockPickerLiveRows = ref([]);
const stockPickerCheckedIds = ref(new Set());
const updatedrowdata4 = ref([]);
/** 조회 emit 의 API lngCheck=1 은 선택이 아님. 팝업에서 마우스로 체크한 뒤만 인정 */
let stockPickerAcceptChecks = false;

const isLngCheckOn = (row) => {
  if (!row || typeof row !== "object") return false;
  const v = row.lngCheck;
  return v === true || v === 1 || v === "1";
};

const onStockPickerMouseDown = () => {
  stockPickerAcceptChecks = true;
};

/** 추가 후·필터 변경 시 선택 체크와 헤더 전체체크만 해제. 즐겨찾기 셀은 유지 */
const clearStockPickerChecks = (releaseFavoriteHeader = false) => {
  stockPickerAcceptChecks = false;
  stockPickerCheckedIds.value = new Set();
  updatedrowdata4.value = [];
  const inst = rgGetInstance(stockPickerGridName.value);
  const gv = inst?.gridView;
  const dp = inst?.dataProvider;
  if (dp && typeof dp.getRowCount === "function") {
    const n = dp.getRowCount();
    try {
      dp.beginUpdate?.();
      for (let i = 0; i < n; i++) {
        try {
          const v = dp.getValue(i, "lngCheck");
          if (v === true || v === 1 || v === "1") {
            dp.setValue(i, "lngCheck", false);
          }
        } catch (_) {}
      }
    } finally {
      try {
        dp.endUpdate?.();
      } catch (_) {}
    }
  }
  if (gv) {
    const headerFields = releaseFavoriteHeader
      ? ["lngCheck", "lngFavorites"]
      : ["lngCheck"];
    for (const field of headerFields) {
      try {
        const col =
          gv.columnByName?.(field) || gv.columnByField?.(field);
        if (col) col.checked = false;
      } catch (_) {}
      try {
        gv.setColumnProperty?.(field, "checked", false);
      } catch (_) {}
    }
  }
  if (releaseFavoriteHeader) applyPickerFavoriteCells(false);
  stockPickerAllRows.value = (stockPickerAllRows.value || []).map((r) => ({
    ...r,
    lngCheck: false,
  }));
  if (Array.isArray(stockPickerLiveRows.value) && stockPickerLiveRows.value.length) {
    stockPickerLiveRows.value = stockPickerLiveRows.value.map((r) => ({
      ...r,
      lngCheck: false,
    }));
  }
};

const stockPickerGridName = ref("");
const onStockPickerGridName = (name) => {
  if (name) stockPickerGridName.value = name;
};

/** 팝업 조회조건(자재특성·거래처·이름)에 맞는 행만 — 그리드 필터와 동일 */
const rowMatchesPickerFilter = (row) => {
  if (!row || typeof row !== "object") return false;
  const generic = String(searchValue.value?.[0] ?? "-1");
  const supplier = String(searchValue.value?.[1] ?? "-1");
  if (generic !== "-1") {
    const g = String(getRowVal(row, "lngGenericID", "LngGenericID") ?? "");
    if (g !== generic) return false;
  }
  if (supplier !== "-1") {
    const s = String(getRowVal(row, "lngSupplierID", "LngSupplierID") ?? "");
    if (s !== supplier) return false;
  }
  const word = String(sscond2.value ?? "").trim();
  if (word) {
    const id = getStockId(row);
    const name = String(getRowVal(row, "strStockName", "StrStockName") ?? "");
    const w = word.toLowerCase();
    if (!id.toLowerCase().includes(w) && !name.toLowerCase().includes(w)) {
      return false;
    }
  }
  return true;
};

/** 화면에 보이는 행만. 그리드 행도 거래처·자재특성 조회조건으로 한 번 더 건다. */
const getPickerVisibleRows = (fallbackRows) => {
  const filtered = (Array.isArray(fallbackRows) ? fallbackRows : []).filter(
    rowMatchesPickerFilter
  );
  const inst = rgGetInstance(stockPickerGridName.value);
  const gv = inst?.gridView;
  const dp = inst?.dataProvider;
  if (gv && dp && typeof gv.getItemCount === "function") {
    const out = [];
    const n = gv.getItemCount();
    for (let i = 0; i < n; i++) {
      let dataRow = -1;
      try {
        dataRow = gv.getDataRow(i);
      } catch (_) {
        continue;
      }
      if (dataRow == null || dataRow < 0) continue;
      let row = null;
      try {
        row = dp.getJsonRow(dataRow);
      } catch (_) {
        continue;
      }
      if (row && rowMatchesPickerFilter(row)) out.push(row);
    }
    if (out.length > 0) return out;
  }
  return filtered;
};

const collectCheckedPickerRowsFromProvider = () => {
  const inst = rgGetInstance(stockPickerGridName.value);
  const dp = inst?.dataProvider;
  const inSub = subGridStockIds();
  const out = [];
  if (!dp || typeof dp.getRowCount !== "function") return out;
  const n = dp.getRowCount();
  for (let i = 0; i < n; i++) {
    let row = null;
    try {
      row = dp.getJsonRow(i);
    } catch (_) {
      continue;
    }
    if (!row || !rowMatchesPickerFilter(row)) continue;
    const id = getStockId(row);
    if (!id || inSub.has(id)) continue;
    if (!isLngCheckOn(row)) continue;
    out.push(row);
  }
  return out;
};

const collectPickerChecked = (rows) => {
  const fromGrid = collectCheckedPickerRowsFromProvider();
  const visible = fromGrid.length > 0 ? fromGrid : getPickerVisibleRows(rows);
  const inSub = subGridStockIds();
  const next = new Set();
  const checkedRows = [];
  for (const row of visible) {
    const id = getStockId(row);
    if (!id || inSub.has(id)) continue;
    if (!isLngCheckOn(row) && fromGrid.length === 0) continue;
    if (fromGrid.length === 0 && String(row?.lngPickerAddable ?? "1") === "0") {
      continue;
    }
    if (!isLngCheckOn(row)) continue;
    next.add(id);
    checkedRows.push(row);
  }
  stockPickerCheckedIds.value = next;
  updatedrowdata4.value = checkedRows;
};

const subGridStockIds = () => {
  const ids = new Set();
  for (const row of rowData3.value || []) {
    const id = getStockId(row);
    if (id) ids.add(id);
  }
  return ids;
};

/** 팝업 행 순서는 DIV=3(전체) 그대로. 즐겨찾기·이미 있는 품목을 맨 아래로 보내지 않는다. */
const unionPickerSourceRows = (allList) =>
  Array.isArray(allList) ? allList : [];

const filterStockPickerList = (list) =>
  (Array.isArray(list) ? list : []).filter((item) => getStockId(item) !== "");

const normalizePickerRow = (item, inSubIds) => {
  const ids = inSubIds || subGridStockIds();
  const id = getStockId(item);
  const fromRow = item?.lngFavorites ?? item?.LngFavorites;
  const marked =
    !isUnfavoritedStockId(id) &&
    ((id !== "" && stockPickerFavoriteIds.value.has(id)) ||
      isFavoriteCheckOn(fromRow));
  const inSub = id !== "" && ids.has(id);
  return {
    ...item,
    lngCheck: false,
    checkbox: false,
    lngFavorites: marked,
    lngPickerAddable: inSub ? "0" : "1",
  };
};

const applyStockPickerRows = (list) => {
  stockPickerAcceptChecks = false;
  stockPickerCheckedIds.value = new Set();
  updatedrowdata4.value = [];
  stockPickerLiveRows.value = [];
  const inSubIds = subGridStockIds();
  stockPickerAllRows.value = unionPickerSourceRows(list).map((item) =>
    normalizePickerRow(item, inSubIds)
  );
  rowData4.value = filterStockPickerList(stockPickerAllRows.value);
};

/** 자재목록(최근등록/즐겨찾기)이 바뀌면, 열린 자재추가 팝업의 이미-있는-품목 잠금만 다시 맞춘다. */
const refreshPickerAddableFromBottomGrid = () => {
  if (!openpopup2.value) return;
  const source =
    stockPickerAllRows.value?.length > 0
      ? stockPickerAllRows.value
      : rowData4.value;
  if (!Array.isArray(source) || source.length === 0) return;
  const inSubIds = subGridStockIds();
  stockPickerAllRows.value = source.map((r) => normalizePickerRow(r, inSubIds));
  rowData4.value = filterStockPickerList(stockPickerAllRows.value);
};

const updatedRowData4 = (e) => {
  const rows = Array.isArray(e) ? e : [];
  stockPickerLiveRows.value = rows;
  if (!stockPickerAcceptChecks) {
    updatedrowdata4.value = [];
    stockPickerCheckedIds.value = new Set();
    return;
  }
  collectPickerChecked(rows);
};

const rowData3 = ref([]);
const updatedrowdata3 = ref([]);

/**
 * 하단 자재목록(최근등록·즐겨찾기).
 * getStockItemListWithFavorite 응답 List 행마다 lngSupplierID(품목별) 포함 — 잠금 시 미호출
 */
const loadPopupStockListForMaterialPane = async (favoriteType) => {
  if (isPopupToolbarLocked.value) return;
  if (isOrderDetailView.value) return;
  if (scond4.value == "0") return;
  const mode =
    favoriteType != null && favoriteType !== ""
      ? favoriteType
      : scond7.value;
  bottomListMode.value = String(mode);
  try {
    const prevRows = (rowData3.value || []).map((r) => ({ ...r }));
    const prevBySid = {};
    for (const r of prevRows) {
      const sid = getStockId(r);
      if (sid) prevBySid[sid] = r;
    }

    const res = await getStockItemListWithFavorite(
      store.state.userData.lngStoreGroup,
      popupSessionStoreCd.value,
      scond4.value,
      mode,
      getFavoriteListUdate()
    );
    const list = res?.data?.List ?? [];

    /** 018 searchButton3/4 — API 목록으로 하단을 통째로 갈아끼움. 예전 행을 다시 붙이지 않음 */
    const next = list
      .filter((item) => {
        const sid = getStockId(item);
        if (!sid || !isUnfavoritedStockId(sid)) return true;
        return isBottomStockSelectedToKeep(prevBySid[sid] || item, sid);
      })
      .map((item) => {
        const sid = getStockId(item);
        const prev = sid ? prevBySid[sid] : null;
        const row = {
          ...item,
          lngCheck: prev?.lngCheck ?? item.lngCheck ?? item.LngCheck ?? "0",
          checkbox: prev?.checkbox ?? item.checkbox ?? false,
        };
        if (prev) {
          if (prev.dblOrderQty != null && prev.dblOrderQty !== "") {
            row.dblOrderQty = prev.dblOrderQty;
            row.curSupply = prev.curSupply;
            row.curTax = prev.curTax;
            row.curTotal = prev.curTotal;
          }
          if (prev.strOrderComments != null) {
            row.strOrderComments = prev.strOrderComments;
          }
          if (isStockPickerPopupAddedRow(prev)) {
            row.lngFromStockPickerAdd = 1;
          }
        }
        return row;
      });

    /** 018 닫기 extras: API에 없는 이전 행. 매입은 [추가]·수량 있는 것만 유지 */
    if (String(mode) === "2") {
      const apiIds = new Set(next.map((r) => getStockId(r)).filter(Boolean));
      for (const r of prevRows) {
        const id = getStockId(r);
        if (!id || apiIds.has(id)) continue;
        if (!isBottomStockSelectedToKeep(r, id)) continue;
        next.push({ ...r });
        apiIds.add(id);
      }
    }

    applyBottomListRows(next);
    await nextTick();
    refreshPickerAddableFromBottomGrid();
  } catch (error) {}
};

/** 자재추가 팝업에서 [추가]로 넣은 행 표시 — 즐겨찾기 재조회 시 선택 추가분만 목록 밖 행으로 유지 */
const isStockPickerPopupAddedRow = (row) =>
  row?.lngFromStockPickerAdd === 1 ||
  row?.lngFromStockPickerAdd === true ||
  row?.lngFromStockPickerAdd === "1";

const closeStockPickerPopup = async () => {
  openpopup2.value = false;
};

/** 018과 동일: 자재추가 팝업을 닫으면 즐겨찾기 목록으로 하단을 다시 조회 */
watch(openpopup2, async (isOpen, wasOpen) => {
  if (isOpen) return;
  if (wasOpen !== true) return;
  if (String(scond7.value) !== "2") return;
  if (!openpopup.value) return;
  if (scond4.value === "0" || scond4.value === 0) return;
  if (isPopupToolbarLocked.value) return;
  store.state.loading = true;
  try {
    await loadPopupStockListForMaterialPane("2");
  } catch (_) {
    /* noop */
  } finally {
    store.state.loading = false;
  }
});

/** 자재추가: 기존 하단 목록 유지 + 선택 품목만 추가(동일 자재는 건너뜀) */
const addButton2 = async () => {
  const fromGrid = collectCheckedPickerRowsFromProvider();
  const source =
    fromGrid.length > 0
      ? fromGrid
      : getPickerVisibleRows(
          stockPickerLiveRows.value.length > 0
            ? stockPickerLiveRows.value
            : rowData4.value
        );
  const selected = source.filter((row) => {
    const id = getStockId(row);
    return (
      id &&
      (stockPickerCheckedIds.value.has(id) || isLngCheckOn(row))
    );
  });
  if (selected.length === 0) {
    Swal.fire({
      title: "경고",
      text: "추가하실 자재를 선택해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }

  const existing = [...(rowData3.value || [])];
  const existingSids = subGridStockIds();
  const additions = [];
  let skippedExist = 0;
  let skippedNoId = 0;
  for (const item of selected) {
    const sid = getStockId(item);
    if (!sid) {
      skippedNoId += 1;
      continue;
    }
    if (existingSids.has(sid)) {
      skippedExist += 1;
      continue;
    }
    existingSids.add(sid);
    additions.push({
      ...item,
      dblOrderQty: 0,
      curSupply: 0,
      lngCheck: "0",
      checkbox: false,
      lngFromStockPickerAdd: 1,
      ...(isPopupFavoriteMode() ? { lngFavorites: true } : {}),
    });
  }

  if (additions.length === 0) {
    await Swal.fire({
      title: "안내",
      text:
        skippedNoId > 0 && skippedExist === 0
          ? "선택한 품목의 자재코드를 확인할 수 없습니다."
          : "선택한 품목은 이미 자재목록에 있습니다.",
      icon: "info",
      confirmButtonText: "확인",
    });
    return;
  }

  rowData3.value = [...existing, ...additions];
  updatedrowdata3.value = rowData3.value.map((r) => ({ ...r }));
  if (isPopupFavoriteMode()) {
    await Promise.allSettled(
      additions.map((row) => {
        const id = getStockId(row);
        if (!id) return Promise.resolve();
        rememberPickerFavorite(id, true);
        return saveFavoriteForStock(id, favoriteValueFromChecked(true));
      })
    );
  }
  await nextTick();
  updatedRowData3(rowData3.value);
  stockPickerAcceptChecks = false;
  stockPickerCheckedIds.value = new Set();
  updatedrowdata4.value = [];
  stockPickerLiveRows.value = [];
  const inSubIds = subGridStockIds();
  stockPickerAllRows.value = (stockPickerAllRows.value || []).map((r) =>
    normalizePickerRow(r, inSubIds)
  );
  rowData4.value = filterStockPickerList(stockPickerAllRows.value);
  await nextTick();
  clearStockPickerChecks();
};

const searchButton3 = async (e) => {
  if (isPopupToolbarLocked.value) return;
  if (isOrderDetailView.value) return;
  if (scond4.value == "0") {
    Swal.fire({
      title: "경고",
      text: "파트를 먼저 선택해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }
  await loadPopupStockListForMaterialPane(e?.target?.value);
};

const searchValue2 = ref(["-1"]);

const SupplierId2 = (e) => {
  if (e == "0") {
    searchValue2.value = ["-1"];
  } else {
    searchValue2.value = [e];
  }
};

const scond6 = ref("");

const setScond6 = (e) => {
  scond6.value = e.target.value;
};

/**
 * 하단 자재목록 그리드 emit — 하→상 동기화.
 * orderBook 에 merge 후 상단 rowData2 만 갱신 (하단은 emit 값 e 가 그대로 유지되어 patch 불필요).
 * 이번 emit 에 없는 품목은 기존 book 유지. assignDefined 로 부분 패치 병합.
 */
const updatedRowData3 = (e) => {
  console.log(e);
  updatedrowdata3.value = e;

  const incoming = Array.isArray(e) ? e : [];
  const book = { ...orderBookByStock.value };
  const allowZeroSet = allowZeroFromBottomThisRound.value;

  for (const row of incoming) {
    const sid = getStockId(row);
    if (!sid) continue;

    const prevBook = book[sid];
    const merged = mergeBottomRowIntoBookBase(prevBook, row);

    if (!hasOrderQty(merged)) {
      const hadBookOrder = prevBook != null && hasOrderQty(prevBook);
      if (
        hadBookOrder &&
        allowZeroSet != null &&
        !allowZeroSet.has(sid)
      ) {
        /** 자재제거 직후 한 번의 emit: 우리가 0으로 바꾼 행 외에 잘못 0으로 들어오면 무시 */
        continue;
      }
      delete book[sid];
    } else {
      book[sid] = merged;
    }
  }

  if (allowZeroSet != null) {
    allowZeroFromBottomThisRound.value = null;
  }

  orderBookByStock.value = book;
  patchNewOrderSupplierSnap(book);
  const mergedRows = Object.values(book)
    .filter(hasOrderQty)
    .map(sanitizeBookRowForTopGrid);
  updatedrowdata2.value = mergedRows;
  rowData2.value = mergedRows.map((r) => ({ ...r }));
};

const deleteStock = () => {
  if (isPopupToolbarLocked.value) return;
  rowData3.value = updatedrowdata3.value.filter(
    (item) => item.lngCheck == false
  );
};

const deleteOrder = async () => {
  if (isPopupToolbarLocked.value) return;
  if (!isOrderDetailView.value) return;

  const snap = orderDetailCheckQtyByStockId.value || {};
  const anyCheckQtyNonZero = Object.values(snap).some((n) => {
    const x = Number(n);
    return !Number.isNaN(x) && x !== 0;
  });
  if (anyCheckQtyNonZero) {
    await Swal.fire({
      title: "안내",
      text: "발주상태가 변경되어 삭제가 불가능합니다",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  const canDelete = await GetOrderTimeCheck(4);
  if (!canDelete) return;

  const confirm = await Swal.fire({
    title: "확인",
    text: "전표를 삭제하시겠습니까?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "확인",
    cancelButtonText: "취소",
  });
  if (!confirm.isConfirmed) return;

  const orderNoVal = String(popupSessionOrderNo.value ?? "").trim();
  if (!orderNoVal) {
    await Swal.fire({
      title: "안내",
      text: "주문번호를 찾을 수 없어 삭제할 수 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  const storeCdVal = popupSessionStoreCd.value;
  if (
    storeCdVal == null ||
    storeCdVal === "" ||
    storeCdVal === 0 ||
    storeCdVal === "0"
  ) {
    await Swal.fire({
      title: "안내",
      text: "매장정보를 찾을 수 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  /** 헤더가 "0"이면 truthy라서 `||` 폴백이 안 됨 → 유효 ID만 채택, 행·스냅샷 순 탐색 */
  const resolveSupplierIdForChit = () => {
    if (isValidSupplierIdForApi(popupSessionSupplierId.value)) {
      return String(popupSessionSupplierId.value).trim();
    }
    for (const row of rowData2.value || []) {
      const s = getSupplierIdFromRow(row);
      if (isValidSupplierIdForApi(s)) return s;
    }
    const snap = orderDetailSupplierByStockId.value || {};
    for (const sid of Object.keys(snap)) {
      const s = snap[sid];
      if (isValidSupplierIdForApi(s)) return String(s).trim();
    }
    return "";
  };

  const supplierIdForChit = resolveSupplierIdForChit();
  if (!isValidSupplierIdForApi(supplierIdForChit)) {
    await Swal.fire({
      title: "안내",
      text: "공급사 정보를 찾을 수 없어 삭제할 수 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  store.state.loading = true;
  try {
    const res = await deleteOrderChit(
      store.state.userData.lngStoreGroup,
      storeCdVal,
      orderNoVal,
      supplierIdForChit,
      store.state.userData.lngSequence
    );
    store.state.loading = false;

    if (res?.data?.RESULT_CD !== "00") {
      await Swal.fire({
        title: "실패",
        text: res?.data?.RESULT_NM ?? "전표 삭제에 실패하였습니다.",
        icon: "error",
        confirmButtonText: "확인",
      });
      return;
    }

    await Swal.fire({
      title: "성공",
      text: "전표삭제가 완료되었습니다.",
      icon: "success",
      confirmButtonText: "확인",
    });
    closeOpenpopup();
    await searchButton();
  } catch (err) {
    store.state.loading = false;
    const errText =
      err?.response?.data?.RESULT_NM ??
      err?.message ??
      "전표 삭제 중 오류가 발생하였습니다.";
    await Swal.fire({
      title: "오류",
      text: errText,
      icon: "error",
      confirmButtonText: "확인",
    });
  }
};

/** 상단 자재제거: UI만 갱신(신규) / API 성공 후에도 동일 경로 */
const applyLocalDeleteStock2 = async (rows, removedIds) => {
  allowZeroFromBottomThisRound.value = new Set(removedIds);

  rowData2.value = rows.filter((item) => !isTopRowCheckedForRemove(item));
  updatedrowdata2.value = [...rowData2.value];

  /** 상단에서 제거한 품목만 하단 발주수량·금액 초기화 */
  const zeroQtyIfRemoved = (row) => {
    const sid = getStockId(row);
    if (!sid || !removedIds.has(sid)) return { ...row };
    return {
      ...row,
      dblOrderQty: 0,
      curSupply: 0,
      curTax: 0,
      curTotal: 0,
    };
  };
  rowData3.value = (rowData3.value || []).map(zeroQtyIfRemoved);
  updatedrowdata3.value = (updatedrowdata3.value || []).map(zeroQtyIfRemoved);

  rebuildOrderBookFromRows(rowData2.value);
  await nextTick();
  patchRowData3QtyFromOrderBook();
};

const deleteStock2 = async () => {
  if (isPopupToolbarLocked.value) return;
  const canDelete = await GetOrderTimeCheck(5);
  if (!canDelete) return;
  const rows = updatedrowdata2.value || [];
  const checkedRows = rows.filter(isTopRowCheckedForRemove);
  const removedIds = new Set(
    checkedRows.map((item) => getStockId(item)).filter((id) => id !== "")
  );

  if (removedIds.size === 0) {
    await Swal.fire({
      title: "안내",
      text: isOrderDetailView.value
        ? "제거할 주문품목을 선택해 주십시오"
        : "제거할 자재를 선택해 주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (isOrderDetailView.value) {
    const snap = orderDetailCheckQtyByStockId.value || {};
    const anyCheckQtyOnSlip = Object.values(snap).some((n) => Number(n) > 0);
    if (anyCheckQtyOnSlip) {
      await Swal.fire({
        title: "안내",
        text: "발주상태가 변경되어 삭제가 불가능합니다",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }
  }

  if (isOrderDetailView.value) {
    const confirm = await Swal.fire({
      title: "확인",
      text: "선택된 품목을 삭제하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "확인",
      cancelButtonText: "취소",
    });
    if (!confirm.isConfirmed) return;

    const orderNoVal = String(popupSessionOrderNo.value ?? "").trim();
    if (!orderNoVal) {
      await Swal.fire({
        title: "안내",
        text: "주문번호를 찾을 수 없어 삭제할 수 없습니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }

    const zw = "\u200b";
    const n = checkedRows.length;
    const groupCd = Array(n).fill(store.state.userData.lngStoreGroup).join(zw);
    const storeCdJoined = Array(n).fill(popupSessionStoreCd.value).join(zw);
    const orderNoJoined = Array(n).fill(orderNoVal).join(zw);
    const seqSnapDel = orderDetailOrderSeqByStockId.value || {};
    const orderSeqJoined = checkedRows
      .map((item) => {
        const sid = getStockId(item);
        const seq =
          getOrderSeqFromRow(item) ||
          (sid ? seqSnapDel[sid] : "") ||
          popupSessionOrderSeq.value ||
          "";
        return String(seq);
      })
      .join(zw);
    const stockIds = checkedRows.map((item) => getStockId(item)).join(zw);
    const supSnapDel = orderDetailSupplierByStockId.value || {};
    const supplierIds = checkedRows
      .map((item) => {
        const sid = getStockId(item);
        const sup =
          getSupplierIdFromRow(item) ||
          (sid ? supSnapDel[sid] : "") ||
          "";
        return String(sup);
      })
      .join(zw);

    store.state.loading = true;
    try {
      const res = await deleteOrderStockItem(
        groupCd,
        storeCdJoined,
        orderNoJoined,
        orderSeqJoined,
        stockIds,
        supplierIds,
        store.state.userData.lngSequence
      );
      store.state.loading = false;

      if (res?.data?.RESULT_CD !== "00") {
        await Swal.fire({
          title: "실패",
          text: res?.data?.RESULT_NM ?? "품목 삭제에 실패하였습니다.",
          icon: "error",
          confirmButtonText: "확인",
        });
        return;
      }
      await Swal.fire({
        title: "성공",
        text: "자재제거가 완료되었습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
      /** 상세 스냅샷에서 제거된 자재 제거 — 팝업 유지 후 추가 수정 가능 */
      const qc = { ...orderDetailCheckQtyByStockId.value };
      const qs = { ...orderDetailSupplierByStockId.value };
      const qo = { ...orderDetailOrderSeqByStockId.value };
      for (const sid of removedIds) {
        delete qc[sid];
        delete qs[sid];
        delete qo[sid];
      }
      orderDetailCheckQtyByStockId.value = qc;
      orderDetailSupplierByStockId.value = qs;
      orderDetailOrderSeqByStockId.value = qo;
      await applyLocalDeleteStock2(rows, removedIds);
      await searchButton();
      return;
    } catch (err) {
      store.state.loading = false;
      const errText =
        err?.response?.data?.RESULT_NM ??
        err?.message ??
        "품목 삭제 중 오류가 발생하였습니다.";
      await Swal.fire({
        title: "오류",
        text: errText,
        icon: "error",
        confirmButtonText: "확인",
      });
      return;
    }
  }

  await applyLocalDeleteStock2(rows, removedIds);
};

/** 화면 계산과 저장값을 맞춤: 공급가=floor(단가×발주수량), 과세(01)만 부가세 10% */
function applyOrderQtyAmounts(item) {
  const unit = Number(item?.curUnitPrice || 0);
  const qty = Number(item?.dblOrderQty || 0);
  const supply = Math.floor(unit * qty);
  let taxType = item?.lngTaxType;
  if (taxType == null || String(taxType).trim() === "") {
    const oldSupply = Number(item?.curSupply || 0);
    const oldTax = Number(item?.curTax || 0);
    taxType = oldSupply !== 0 && oldTax === 0 ? "00" : "01";
  }
  const tax = String(taxType) === "01" ? Math.floor(supply * 0.1) : 0;
  return {
    ...item,
    curSupply: supply,
    curTax: tax,
    curTotal: Math.floor(supply + tax),
  };
}

const UpdateOrderStockDetail = async () => {
  const orderNo = popupSessionOrderNo.value;
  const orderSeq = popupSessionOrderSeq.value;

  /** emit·API 필드명 차이로 lngStockID 만으로는 매칭 실패할 수 있어 getStockId 로 통일 */
  const origMap = {};
  for (const r of rowData2.value || []) {
    const k = getStockId(r);
    if (k) origMap[k] = r;
  }

  const sourceRows = (updatedrowdata2.value?.length > 0)
    ? updatedrowdata2.value
    : rowData2.value;
  const seen = new Set();
  const targetRows = sourceRows.filter((item) => {
    const key = getStockId(item);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  const supSnap = orderDetailSupplierByStockId.value || {};
  const seqSnap = orderDetailOrderSeqByStockId.value || {};
  let lastRes = null;
  for (const raw of targetRows) {
    const item = applyOrderQtyAmounts(raw);
    const sid = getStockId(item);
    const orig = sid ? origMap[sid] : undefined;
    const supplierId =
      getSupplierIdFromRow(orig) ||
      getSupplierIdFromRow(item) ||
      (sid ? supSnap[sid] : "") ||
      "";
    const itemOrderSeq = String(
      getOrderSeqFromRow(orig) ||
        getOrderSeqFromRow(item) ||
        (sid ? seqSnap[sid] : "") ||
        orderSeq
    );
    lastRes = await updateOrderStockDetail(
      store.state.userData.lngStoreGroup,
      popupSessionStoreCd.value,
      orderNo,
      itemOrderSeq,
      supplierId,
      sid,
      String(item.dblOrderQty ?? ""),
      String(item.curSupply ?? ""),
      String(item.curTax ?? ""),
      item.strOrderComments ?? "",
      scond5.value,
      store.state.userData.lngSequence
    );
    if (lastRes?.data?.RESULT_CD !== "00") break;
  }
  return lastRes;
};

const saveButton2 = async () => {
  if (isPopupToolbarLocked.value) return;
  const isPartAll =
    scond4.value == null ||
    scond4.value === "" ||
    scond4.value == "0" ||
    scond4.value === 0;
  if (isPartAll) {
    await Swal.fire({
      title: "경고",
      text: "파트를 먼저 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    popupPartSelectRef.value?.focus();
    return;
  }
  if (!isOrderDetailView.value && (!updatedrowdata2.value || updatedrowdata2.value.length === 0)) {
    Swal.fire({
      title: "경고",
      text: "발주내역을 등록해 주십시오.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  const canSave = await GetOrderTimeCheck(3);
  if (!canSave) return;
  try {
    const closeDtmOk = await refreshOrderCloseDtmFromExpectedDate();
    if (!closeDtmOk) return;
    if (isPastOrderCloseDtm.value) {
      Swal.fire({
        title: "안내",
        text: "현재 납기예정일은 마감되어 발주가 불가능합니다!",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }
    let res;
    if (isOrderDetailView.value) {
      res = await UpdateOrderStockDetail();
    } else {
      const saveRows = (updatedrowdata2.value || []).map(applyOrderQtyAmounts);
      updatedrowdata2.value = saveRows;
      const supplierid = saveRows
        .map((item) => {
          const sid = getStockId(item);
          return (
            getSupplierIdFromRow(item) ||
            (sid ? newOrderSupplierByStockId.value[sid] : "") ||
            ""
          );
        })
        .join("\u200b");
      const stockids = saveRows
        .map((item) => item.lngStockID)
        .join("\u200b");
      const qty = saveRows
        .map((item) => item.dblOrderQty)
        .join("\u200b");
      const unitprice = saveRows
        .map((item) => item.curUnitPrice)
        .join("\u200b");
      const supplys = saveRows
        .map((item) => item.curSupply)
        .join("\u200b");
      const taxs = saveRows
        .map((item) => item.curTax)
        .join("\u200b");
      const comments = saveRows
        .map((item) => item.strOrderComments)
        .join("\u200b");

      const tempRes = await setStockOrderTemp(
        store.state.userData.lngStoreGroup,
        popupSessionStoreCd.value,
        scond2.value.replaceAll("-", ""),
        scond3.value.replaceAll("-", ""),
        supplierid,
        stockids,
        qty,
        unitprice,
        supplys,
        taxs,
        comments,
        scond4.value
      );

      if (tempRes?.data?.RESULT_CD !== "00") {
        await Swal.fire({
          title: "오류",
          text: tempRes?.data?.RESULT_NM ?? "임시 저장 중 오류가 발생하였습니다.",
          icon: "error",
          confirmButtonText: "확인",
        });
        return;
      }

      res = await saveOrderMasterDetailByPart(
        store.state.userData.lngStoreGroup,
        popupSessionStoreCd.value,
        scond2.value.replaceAll("-", ""),
        scond3.value.replaceAll("-", ""),
        scond5.value,
        store.state.userData.lngSequence,
        "N"
      );
    }

    console.log(res);

    if (res.data.RESULT_CD == "00") {
      await Swal.fire({
        title: "성공",
        text: isOrderDetailView.value ? "수정에 성공하였습니다." : "저장에 성공하였습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
    } else {
      await Swal.fire({
        title: "실패",
        text: isOrderDetailView.value ? "수정에 실패하였습니다." : "저장에 실패하였습니다.",
        icon: "error",
        confirmButtonText: "확인",
      });
    }
    initGrid2();
    openpopup.value = false;
    openpopup2.value = false;
    searchButton();
  } catch (error) {}
};

const setScond3 = (e) => {
  if (
    parseInt(e.target.value.replaceAll("-", "")) >=
    parseInt(scond3.value.replaceAll("-", ""))
  ) {
    const date = new Date(e.target.value);
    date.setDate(date.getDate() + 1);

    scond3.value = date.toISOString().slice(0, 10);
  }
};

/** getCloseDtmDate2 응답의 dtmOrderCloseDate → 발주마감 표시 문자열. 값이 있으면 true, 없으면 false */
const applyOrderCloseDtmFromResponse = (res) => {
  const raw = res?.data?.List?.[0]?.dtmOrderCloseDate;
  if (raw == null || raw === "") return false;
  const s = String(raw);
  scond.value =
    s.slice(0, 4) +
    "년" +
    s.slice(4, 6) +
    "월" +
    s.slice(6, 8) +
    "일" +
    " " +
    s.slice(8, 10) +
    ":" +
    s.slice(10, 12);
  return true;
};

/** 납기예정일(scond3) 기준으로 발주마감 일시 API 조회 후 `scond` 갱신.
 *  showAlert=true 일 때 빈값이면 오류 알림 + 팝업 닫기. 정상이면 true, 오류면 false 반환 */
const refreshOrderCloseDtmFromExpectedDate = async (showAlert = true) => {
  const exp = (scond3.value || "").trim();
  if (!exp) return true;
  try {
    const pg = popupSessionStoreCd.value;
    const useSessionStore =
      pg != null &&
      pg !== "" &&
      pg !== 0 &&
      pg !== "0";
    const cd = useSessionStore ? pg : storeCd.value;
    const res = await getCloseDtmDate2(
      store.state.userData.lngStoreGroup,
      cd,
      exp.replaceAll("-", ""),
      0
    );
    const ok = applyOrderCloseDtmFromResponse(res);
    if (!ok && showAlert) {
      await Swal.fire({
        title: "안내",
        text: "관리자에게 문의해 주십시오. (발주마감시간 오류)",
        icon: "warning",
        confirmButtonText: "확인",
      });
      openpopup.value = false;
      openpopup2.value = false;
      return false;
    }
    return ok;
  } catch (_) {
    return true;
  }
};

/** 납기예정일 변경 시: 발주마감시각 갱신 + 발주가능 시간(저장과 동일, type 3) */
watch(scond3, async () => {
  /** 납기 바뀔 때마다 마감 안내 Swal 재표시 가능하게 */
  orderClosePastWarningShown.value = false;
  await refreshOrderCloseDtmFromExpectedDate(false);
  if (!openpopup.value) return;
  const exp = (scond3.value || "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(exp)) return;
  await GetOrderTimeCheck(3);
});

const searchButton4 = async (e) => {
  const isPartAll =
    scond4.value == null ||
    scond4.value === "" ||
    scond4.value == "0" ||
    scond4.value === 0;
  if (isPartAll) {
    rowData3.value = [];
    updatedrowdata3.value = [];
    Swal.fire({
      title: "경고",
      text: "파트를 먼저 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  await loadPopupStockListForMaterialPane();
};

const initGrid2 = () => {
  orderClosePastWarningShown.value = false;
  popupExtraStoreOption.value = null;
  popupSessionStoreCd.value = 0;
  popupSessionOrderNo.value = "";
  popupSessionOrderSeq.value = "";
  popupSessionSupplierId.value = "";
  orderDetailCheckQtyByStockId.value = {};
  orderDetailSupplierByStockId.value = {};
  orderDetailOrderSeqByStockId.value = {};
  orderDetailLngStatus.value = "";
  isOrderDetailView.value = false;
  scond.value = "";
  scond2.value = "";
  scond3.value = "";
  scond4.value = "0";
  scond5.value = "";

  scond7.value = "1";
  bottomListMode.value = "1";
  unfavoritedStockIds.value = new Set();
  scond6.value = "";

  rowData2.value = [];
  orderBookByStock.value = {};
  newOrderSupplierByStockId.value = {};
  allowZeroFromBottomThisRound.value = null;

  rowData3.value = [];
  updatedrowdata3.value = [];

  rowData4.value = [];
};

const closeOpenpopup = () => {
  initGrid2();
  openpopup.value = false;
  openpopup2.value = false;
};

</script>

<style scoped>
/* 2열×2행 — 조회기간·매장 / 파트·거래처 (search-area-layout) */
.pur035-search-grid {
  --pur035-label-col: 5.5rem;
  display: grid;
  width: 100%;
  min-width: 0;
  align-items: center;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: var(--pur035-item-gap);
  row-gap: var(--pur035-item-gap);
}

.pur035-cell {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: var(--pur035-item-gap);
}

.pur035-sg-label {
  flex: 0 0 var(--pur035-label-col);
  width: var(--pur035-label-col);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
}

.pur035-cell-field {
  min-width: 0;
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  width: 100%;
}

/* 조회기간만 넓게, 매장·파트·거래처는 동일 max */
.pur035-cell-field.pur035-date-slot {
  max-width: min(100%, 26rem);
}

.pur035-cell-field.pur035-combo-cap {
  max-width: min(100%, var(--pur035-combo-max));
}

.pur035-cell-field > * {
  min-width: 0;
  width: 100%;
}

.pur035-search-panel .pur035-search-grid select.pur035-sg-select {
  box-sizing: border-box;
  border: 1px solid var(--pur035-control-border) !important;
}

.pur035-search-panel .pur035-search-grid select.pur035-sg-select:focus {
  border-color: #3b82f6 !important;
}

.pur035-search-panel .pur035-pick-slot :deep(select) {
  border: 1px solid var(--pur035-control-border) !important;
}

.pur035-search-panel .pur035-pick-slot :deep(select:focus) {
  border-color: #3b82f6 !important;
}

.pur035-search-panel .pur035-pick-slot :deep(.pickstore-vs-shell),
.pur035-search-panel .pur035-bc-slot :deep(.pickstore-vs-shell) {
  border: 1px solid var(--pur035-control-border) !important;
  box-sizing: border-box;
  max-width: 100%;
  min-width: 0;
}

/* Datepicker_Order(compactRow) — 조회줄 날짜 테두리·가로만 다소 축소 */
.pur035-search-panel .pur035-date-slot :deep(input[type="date"]) {
  box-sizing: border-box;
  flex: 1 1 7.5rem;
  min-width: 7.25rem;
  width: 100%;
  max-width: 9.5rem;
  height: 2rem;
  min-height: 2rem;
  padding-left: 0.75rem;
  padding-right: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  border-radius: 0.375rem;
  border: 1px solid var(--pur035-control-border) !important;
}

.pur035-search-panel .pur035-date-slot :deep(input[type="date"]:focus) {
  border-color: #3b82f6 !important;
}

.pur035-date-slot :deep(> div.flex.w-full.min-w-0.items-center) {
  width: 100%;
  min-width: 0;
  gap: var(--pur035-item-gap) !important;
}

.pur035-date-slot :deep(> div.flex.w-full.min-w-0.items-center > div:first-child) {
  display: none;
}

.pur035-date-slot
  :deep(
    > div.flex.w-full.min-w-0.items-center > div.flex.min-w-0.flex-1.flex-nowrap
  ) {
  flex: 1 1 auto;
  width: 100%;
  min-width: 0;
  flex-wrap: nowrap;
  align-items: center;
}

.pur035-bc-slot :deep(> div.flex.text-base) {
  width: 100%;
  min-width: 0;
}

.pur035-pick-slot {
  overflow-x: auto;
  scrollbar-width: thin;
}

.pur035-pick-slot :deep(> div.flex.text-base) {
  width: 100%;
  min-width: 0;
  gap: var(--pur035-item-gap) !important;
}

.pur035-pick-slot :deep(> div.flex > div:first-child) {
  display: none;
}

.pur035-bc-slot :deep(> div.flex.items-center) {
  margin-top: 0;
}

/* 자재추가 팝업 콤보 — 칸 안 전체 폭·테두리(원래 select와 동일), 펼침 스크롤은 공통 vs 스타일 */
.pur-picker-vs {
  width: 100%;
  min-width: 0;
}
.pur-picker-vs :deep(.flex.text-base) {
  display: block;
  width: 100%;
  min-width: 0;
  margin: 0 !important;
  padding: 0;
  gap: 0 !important;
}
.pur-picker-vs :deep(.pickstore-vs-shell) {
  box-sizing: border-box;
  display: block;
  width: 100%;
  max-width: none;
  height: 1.75rem;
  min-height: 1.75rem;
  max-height: 1.75rem;
  overflow: hidden;
  border: 1px solid #4b5563;
  border-radius: 0;
  background: #fff;
}
.pur-picker-vs :deep(.v-select),
.pur-picker-vs :deep(.style-chooser) {
  display: block;
  width: 100%;
  min-width: 0;
}
.pur-picker-vs :deep(.vs__dropdown-toggle) {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  width: 100%;
  height: 1.75rem;
  min-height: 1.75rem;
  max-height: 1.75rem;
  padding: 0 0.25rem;
  border: 1px solid #4b5563 !important;
  border-radius: 0 !important;
  background: #fff !important;
  box-shadow: none !important;
}
.pur-picker-vs :deep(.pickstore-vs-shell .vs__dropdown-toggle) {
  border: 0 !important;
}
.pur-picker-vs :deep(.vs__selected),
.pur-picker-vs :deep(.vs__search),
.pur-picker-vs :deep(.vs__search::placeholder) {
  margin: 0;
  padding: 0 0.25rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
}

/* 매핑된 매장명: vue-select disabled 기본 회색 → 검정 (CSS 변수 + 자식 상속) */
.store-name-cell :deep(.v-select.style-chooser.vs--disabled),
.store-name-cell :deep(.style-chooser.vs--disabled) {
  --vs-state-disabled-color: #000000;
  --vs-disabled-color: #000000;
  --vs-selected-color: #000000;
  --vs-search-input-color: #000000;
  --vs-colors--light: #000000;
}
.store-name-cell :deep(.vs__dropdown-toggle) {
  justify-content: flex-start !important;
  color: #000 !important;
  -webkit-text-fill-color: #000 !important;
}
.store-name-cell :deep(.vs__selected) {
  justify-content: flex-start !important;
  text-align: left !important;
  color: #000 !important;
  -webkit-text-fill-color: #000 !important;
  opacity: 1 !important;
}
.store-name-cell :deep(.vs__single),
.store-name-cell :deep(.vs__selected-options) {
  color: #000 !important;
  -webkit-text-fill-color: #000 !important;
}
</style>
