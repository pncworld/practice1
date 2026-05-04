<!-- /*--############################################################################
# Filename : PUR02_018INS.vue                                                  
# Description : 마스터관리 > 매입 관리 > 매입 등록(파트별)                     
# Date :2025-09-18                                                           
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <!-- 조회조건 -->
  <div class="h-full" @click="handleParentClick">
    <div class="flex justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center mr-9 space-x-2 pr-5">
        <button @click="searchButton" class="button search w-auto">조회</button>
        <button @click="addButton" class="button new md:w-auto w-14">신규</button>
        <button @click="deleteButton" class="button delete md:w-auto w-14">
          삭제
        </button>
        <button @click="excelButton" class="button excel w-auto">엑셀</button>
      </div>
    </div>
    <div
      class="pur018-search-panel z-10 mt-3 w-full min-w-0 overflow-x-auto rounded-lg bg-gray-200 px-24 py-4">
      <div
        class="pur018-search-grid min-w-0"
        :style="{
          '--pur018-control-border': pur018ControlBorder,
          '--pur018-item-gap': pur018ItemGap,
        }">
        <div class="pur018-cell">
          <div class="pur018-sg-label">조회기간</div>
          <div class="pur018-cell-field pur018-date-slot min-w-0">
            <Datepicker2
              ref="datepicker"
              omit-main-label
              filter-bar-align
              :mainName="'조회기간'"
              :initToday="1"
              :initToday2="-7"
              :closePopUp="closePopUp"
              @endDate="endDate"
              @startDate="startDate" />
          </div>
        </div>
        <div class="pur018-cell">
          <div class="pur018-sg-label">매장</div>
          <div class="pur018-cell-field pur018-pick-slot min-w-0">
            <PickStore
              compact-search-bar
              :compact-store-combo-max-rem="pur018PickStoreComboMaxRem"
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
        <div class="pur018-cell">
          <div class="pur018-sg-label">파트</div>
          <div class="pur018-cell-field min-w-0">
            <select
              id="pur02-018-part"
              v-model="cond"
              class="pur018-sg-select h-8 w-full min-w-0 rounded-md border border-solid bg-white text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option
                v-for="i in optionList"
                :key="i.lngPartCode"
                :value="i.lngPartCode">
                {{ i.strPartName }}
              </option>
            </select>
          </div>
        </div>
        <div class="pur018-cell">
          <div class="pur018-sg-label">거래처</div>
          <div class="pur018-cell-field pur018-bc-slot min-w-0">
            <BusinessClient2
              compact-search-bar
              @SupplierNm="SupplierNm"
              @SupplierId="SupplierId" />
          </div>
        </div>
        <div class="pur018-cell">
          <div class="pur018-sg-label">검수자</div>
          <div class="pur018-cell-field min-w-0">
            <input
              id="pur02-018-inspector"
              v-model="cond2"
              type="text"
              class="pur018-sg-input h-8 w-full min-w-0 rounded-md border border-solid bg-white px-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div class="pur018-cell pur018-grid-filler" aria-hidden="true" />
      </div>
    </div>

    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="mt-2 w-full h-[80%]">
      <Realgrid
      :progid="1"
      :setFooter="true"
      :rowStateeditable="false"
      :progname="'PUR02_018INS_VUE'"
      :exporttoExcel="exporttoExcel"
      :setStateBar="false"
      :checkRenderEditable="true"
      :checkRowAuto="false"
      :checkRowAuto2="true"
      @dblclickedRowData="dblclickedRowData"
      @updatedRowData="updatedRowData"
      :documentSubTitle="documentSubTitle"
      :documentTitle="'PUR02_018INS'"
      :rowData="rowData"></Realgrid>
    </div>
  </div>

  <div
    v-if="openpopup"
    class="fixed bottom-2 right-2 w-[87%] h-[85%] flex items-center justify-center bg-black/100 z-40">
    <!-- 팝업 컨텐츠 박스 — PUR03_035INS 팝업 상단 레이아웃 패턴 -->
    <div
      class="bg-white p-4 rounded-lg shadow-lg w-full h-full border border-black"
      @mousedown.capture="onPopupMouseDownSyncBottomGrid">
      <div class="flex justify-between items-center mb-2">
        <h2 class="text-lg font-bold">매입 등록 상세 (파트별)</h2>
        <button
          type="button"
          @click="closeOpenpopup"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          닫기
        </button>
      </div>
      <div
        class="grid grid-cols-[minmax(4rem,1fr),minmax(6rem,1.2fr),minmax(4rem,1fr),minmax(7rem,1.5fr),minmax(4.5rem,1fr),minmax(7rem,1.5fr),auto,auto] text-sm border border-black">
        <!-- Row 1: 단가구분 -->
        <div
          class="bg-gray-100 font-semibold flex items-center justify-center px-2 py-1 border-b border-r border-black">
          단가구분
        </div>
        <div class="flex items-center px-2 py-1 border-b border-r border-black">
          <select
            id="pur02-018-popup-close-type"
            v-model="scond"
            class="border border-black h-7 w-full px-2 text-sm disabled:bg-gray-200"
            :disabled="currentEdit"
            @change="setRowData2">
            <option
              v-for="i in optionList3"
              :key="i.strDCode"
              :value="i.strDCode">
              {{ i.strDName }}
            </option>
          </select>
        </div>
        <div
          class="flex items-center px-2 py-1 border-b border-r border-black text-red-600 text-sm col-span-6">
          * 매입 등록 시 파트를 먼저 선택 해 주십시오.
        </div>

        <!-- Row 2: 매장명, 매입일, 단가적용일, 버튼 -->
        <div
          class="bg-gray-100 font-semibold flex items-center justify-center px-2 py-1 border-b border-r border-black">
          매장명
        </div>
        <div
          class="store-name-cell flex items-center justify-start px-2 py-1 border-b border-r border-black overflow-hidden min-w-0">
          <pickStore
            :hideGroup="false"
            :hideAttr="false"
            :disabledAll="true"
            :setDefaultStoreCd="storeCd2"
            :setDynamicStoreClass="'!h-7 !w-full !min-w-0 !p-0 !-ml-0 !border-black !rounded-none !text-left'"
            :setDynamicStoreClass2="'!w-full !min-w-0 !-ml-0 !mt-0 !justify-start'"
            :mainName="''"
            @storeNm="storeNm2" />
        </div>
        <div
          class="bg-gray-100 font-semibold flex items-center justify-center px-2 py-1 border-b border-r border-black">
          매입일
        </div>
        <div class="flex items-center px-2 py-1 border-b border-r border-black">
          <input
            v-model="scond2"
            type="date"
            class="border border-black h-7 w-full px-2 text-sm disabled:bg-gray-200"
            :disabled="!currentEdit"
            @change="setScond3" />
        </div>
        <div
          class="bg-gray-100 font-semibold flex items-center justify-center px-2 py-1 border-b border-r border-black">
          단가적용일
        </div>
        <div class="flex items-center px-2 py-1 border-b border-r border-black">
          <input
            v-model="scond3"
            type="date"
            class="border border-black h-7 w-full px-2 text-sm disabled:bg-gray-200"
            :disabled="!currentEdit"
            @change="onScond3DateInputChange" />
        </div>
        <div
          ref="popupOrderHeaderActionsWrap"
          class="flex items-center justify-end gap-3 px-2 py-1 border-b border-r border-black col-span-2">
          <button
            type="button"
            class="whitebutton !h-9 !px-5 !py-2 !text-sm !font-semibold !border-gray-500 !text-gray-700 hover:!bg-blue-50 hover:!border-blue-400 disabled:opacity-50 disabled:pointer-events-none"
            @click="saveButton2">
            저장
          </button>
          <button
            type="button"
            class="whitebutton !h-9 !px-5 !py-2 !text-sm !font-semibold !border-gray-500 !text-gray-700 hover:!bg-blue-50 hover:!border-blue-400 disabled:opacity-50 disabled:pointer-events-none"
            :disabled="currentEdit"
            @click="deleteStock3">
            전표삭제
          </button>
          <button
            type="button"
            class="whitebutton !h-9 !px-5 !py-2 !text-sm !font-semibold !border-gray-500 !text-gray-700 hover:!bg-blue-50 hover:!border-blue-400 disabled:opacity-50 disabled:pointer-events-none"
            @click="deleteStock2">
            자재제거
          </button>
          <button
            type="button"
            class="whitebutton !h-9 !px-5 !py-2 !text-sm !font-semibold !border-gray-500 !text-gray-700 hover:!bg-blue-50 hover:!border-blue-400 disabled:opacity-50 disabled:pointer-events-none"
            @click="excelButton2">
            엑셀
          </button>
        </div>

        <!-- Row 3: 파트명, 검수자, 코멘트 -->
        <div
          class="bg-orange-200 font-semibold flex items-center justify-center px-2 py-1 border-b border-r border-black">
          파트명
        </div>
        <div class="flex items-center px-2 py-1 border-b border-r border-black">
          <select
            id="pur02-018-popup-part"
            v-model="scond4"
            class="border border-black h-7 w-full px-2 text-sm disabled:bg-gray-200"
            :disabled="!currentEdit"
            @change="searchButton4">
            <option
              v-for="i in optionList"
              :key="i.lngPartCode"
              :value="i.lngPartCode">
              {{ i.strPartName }}
            </option>
          </select>
        </div>
        <div
          class="bg-gray-100 font-semibold flex items-center justify-center px-2 py-1 border-b border-r border-black">
          검수자
        </div>
        <div class="flex items-center px-2 py-1 border-b border-r border-black">
          <input
            id="pur02-018-popup-inspector"
            v-model="scond6"
            type="text"
            class="border border-black h-7 w-full px-2 text-sm" />
        </div>
        <div
          class="bg-gray-100 font-semibold flex items-center justify-center px-2 py-1 border-b border-r border-black">
          코멘트
        </div>
        <div class="flex items-center px-2 py-1 border-b border-r border-black col-span-3">
          <input
            id="pur02-018-popup-comment"
            v-model="scond5"
            type="text"
            class="border border-black h-7 w-full px-2 text-sm" />
        </div>
      </div>
      <div ref="popupTopOrderGridWrap" class="h-[35%] w-full mt-2">
        <Realgrid
          :progid="2"
          :progname="'PUR02_018INS_VUE'"
          checkBarFieldName="chkTopRemove"
          :syncRowDataPulse="topGridSyncPulse"
          @updatedRowData="updatedRowData2"
          :editableColId="'dblCheckQty,strComments'"
          :inputOnlyNumberColumn="'dblCheckQty'"
          :CalculateTaxColId="'curTax'"
          :CalculateTaxColId2="'curSupply'"
          :CalculateTaxColId3="'curTotal'"
          :checkRowAuto="false"
          :setFooter="true"
          :checkRowAuto2="true"
          :exporttoExcel="exporttoExcel2"
          :documentSubTitle="documentSubTitle2"
          :documentTitle="'PUR02_018INS'"
          :checkRenderEditable="true"
          :rowStateeditable="false"
          :rowData="filteredrowData2"></Realgrid>
      </div>
      <div
        ref="popupMaterialToolbarWrap"
        class="flex justify-between items-center mt-2 border border-black bg-[#e8e4f0]">
        <div class="flex flex-wrap items-center py-2 pl-4 pr-2 gap-y-2">
          <div class="flex items-center gap-2 shrink-0">
            <span class="text-sm font-semibold text-gray-800 w-28 shrink-0">자재목록</span>
            <select
              class="border border-gray-600 h-7 px-2 text-sm w-40 shrink-0 disabled:bg-gray-200"
              :value="String(scond7)"
              :disabled="!currentEdit"
              @change="onPopupToolbarScond7Change">
              <option value="1">최근등록</option>
              <option value="2">즐겨찾기</option>
            </select>
          </div>
          <div class="w-16 shrink-0" aria-hidden="true"></div>
          <businessClient
            inlineToolbar
            defaultName="거래처"
            :disable="!currentEdit"
            @SupplierId="SupplierId2" />
          <div class="w-16 shrink-0" aria-hidden="true"></div>
          <div class="flex items-center gap-2 shrink-0">
            <span class="text-sm font-semibold text-gray-800 w-28 shrink-0">자재코드/이름</span>
            <input
              type="text"
              class="border border-gray-600 h-7 px-2 text-sm w-40 shrink-0 disabled:bg-gray-200"
              :value="scond9"
              :disabled="!currentEdit"
              @input="setScond6" />
          </div>
        </div>
        <div class="flex gap-3 py-2 pr-4">
          <button
            type="button"
            class="whitebutton !h-9 !px-5 !py-2 !text-sm !font-semibold !border-gray-500 !text-gray-700 hover:!bg-blue-50 hover:!border-blue-400 disabled:opacity-50 disabled:pointer-events-none"
            :disabled="!currentEdit"
            @click="showStockList">
            자재추가
          </button>
          <button
            type="button"
            class="whitebutton !h-9 !px-5 !py-2 !text-sm !font-semibold !border-gray-500 !text-gray-700 hover:!bg-blue-50 hover:!border-blue-400 disabled:opacity-50 disabled:pointer-events-none"
            :disabled="!currentEdit"
            @click="deleteStock">
            자재제거
          </button>
        </div>
      </div>
      <div ref="popupBottomMaterialGridWrap" class="h-[35%] mt-2">
        <Realgrid
          :progid="3"
          :progname="'PUR02_018INS_VUE'"
          :showCheckBar="true"
          :syncRowDataPulse="bottomGridSyncPulse"
          :rowStateeditable="false"
          :setFooter="true"
          :CalculateTaxColId="'curTax'"
          :CalculateTaxColId2="'curSupply'"
          :CalculateTaxColId3="'curTotal'"
          :searchColId3="['lngSupplierID']"
          :searchValue="searchValue2"
          :inputOnlyNumberColumn="'dblCheckQty'"
          :editableColId="'dblCheckQty,strComments,lngCheck,checkbox'"
          @updatedRowData="updatedRowData3"
          :checkRowAuto="false"
          :checkRowAuto2="true"
          :checkRenderEditable="true"
          :searchColId="'lngStockID,strStockName'"
          :searchWord3="scond9"
          :rowData="rowData3"></Realgrid>
      </div>
    </div>
  </div>

  <div
    v-if="openpopup2"
    class="fixed bottom-2 right-2 w-[52%] h-[85%] flex items-stretch justify-center bg-black/100 z-50 p-2 box-border">
    <div
      class="bg-white p-6 rounded-xl shadow-lg w-full h-full max-h-full border border-black flex flex-col min-h-0 min-w-0 box-border">
      <div class="flex shrink-0 justify-end gap-3">
        <button
          type="button"
          class="whitebutton !h-9 !px-5 !py-2 !text-sm !font-semibold !border-gray-500 !text-gray-700 hover:!bg-blue-50 hover:!border-blue-400 disabled:opacity-50 disabled:pointer-events-none"
          @click="addButton2">
          추가
        </button>
        <button
          type="button"
          class="whitebutton !h-9 !px-5 !py-2 !text-sm !font-semibold !border-gray-500 !text-gray-700 hover:!bg-blue-50 hover:!border-blue-400 disabled:opacity-50 disabled:pointer-events-none"
          @click="openpopup2 = false">
          닫기
        </button>
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
            <select
              name=""
              id=""
              class="w-full h-7 border border-gray-600 px-2 text-sm min-w-0"
              @change="setSearchValue"
              v-model="sscond">
              <option value="-1">전체</option>
              <option :value="i.lngGenericID" v-for="i in optionList2">
                {{ i.strGenericName }}
              </option>
            </select>
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
            <BusinessClient
              :defaultName="''"
              :defaultNm="'전체'"
              :toolbarStretch="true"
              :setDynamicClass="'!w-full !min-w-0 !max-w-none !h-7 shrink border border-gray-600 px-2 text-sm'"
              :setDynamicClass2="'!mt-0 !items-center !gap-0 min-w-0 w-full [&>div:first-child]:hidden'"
              @SupplierId="SupplierId"></BusinessClient>
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
        <div class="h-full min-h-0 w-full min-w-0">
        <Realgrid
          :key="stockPickerRealgridKey"
          :progname="'PUR03_035INS_VUE'"
          :progid="4"
          :searchWord3="sscond2"
          :headerCheckBar="'lngCheck,lngFavorites'"
          @updatedRowData="updatedRowData4"
          :rowStateeditable="false"
          :checkRenderEditable="true"
          :checkRowAuto="false"
          :checkRowAuto2="true"
          @clickedRowData="clickedRowData"
          @checkedRowData2="checkedRowData2"
          :checkedRowData2Col="'lngFavorites'"
          :searchColId="'lngStockID,strStockName'"
          :searchColId3="['lngGenericID', 'lngSupplierID']"
          :searchValue="searchValue"
          :rowData="rowData4"></Realgrid>
        </div>
      </div>
    </div>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import { getCommonList } from "@/api/common";
import { getStockGeneric } from "@/api/master";
import {
  deleteStockListBypart,
  getCloseDtmDate,
  getCloseDtmDate2,
  getStockCheckDetail,
  getStockCloseDate,
  getStockItemListWithFavorite,
  getStockItemListWithFavorite2,
  getStockMasterListByPart,
  saveFavoriteStockItem,
  saveFavoriteStockItem2,
  saveFavoriteStockItemBypart,
  saveOrderMasterDetailByPart,
  saveStockMasterDetailByPart,
  saveStockMasterDetailByPart2,
} from "@/api/mipur";
import { getLossMasterPartList, getStockOrderList } from "@/api/mistock";
import BusinessClient from "@/components/businessClient.vue";
import BusinessClient2 from "@/components/businessClient2.vue";
import Datepicker2 from "@/components/Datepicker2.vue";
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

import { nextTick, onMounted, ref, watch } from "vue";
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

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  console.log(store.state.userData);

  const res3 = await getStockGeneric(store.state.userData.lngStoreGroup);

  optionList2.value = res3.data.List;

  const res4 = await getCommonList(172);

  optionList3.value = res4.data.List;
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

/** 조회 AREA — PUR02_017INS·search-area-layout 패턴(3열×2행) */
const pur018ControlBorder = "#cbd5e1";
const pur018ItemGap = "0.75rem";
const pur018PickStoreComboMaxRem = 96;

const datepicker = ref(null);
const closePopUp = ref(false);
const handleParentClick = (e) => {
  const datepickerEl = datepicker.value?.$el;
  if (datepickerEl && datepickerEl.contains(e.target)) {
    return;
  }
  closePopUp.value = !closePopUp.value;
};

const cond3 = ref("");
const cond4 = ref("");
const cond5 = ref("");
const cond6 = ref("");
const storeCd = ref(0);
const optionList = ref([]);
const optionList2 = ref([]);
const optionList3 = ref([]);
const handleStoreCd = async (e) => {
  storeCd.value = e;
  cond.value = "0";
  const res2 = await getLossMasterPartList(
    store.state.userData.lngStoreGroup,
    storeCd.value
  );

  optionList.value = res2.data.List;
};

const allstaterows2 = ref([]);

const rowData = ref([]);
const rowData2 = ref([]);
const filteredrowData2 = ref([]);

/**
 *  조회 함수
 */
const supplierid = ref("0");
const suppliernm = ref("");
const SupplierId = (e) => {
  supplierid.value = e;
  searchValue.value = [searchValue.value[0], e == "0" ? "-1" : e];
};
const SupplierNm = (e) => {
  suppliernm.value = e;
};
const searchButton = async () => {
  try {
    store.state.loading = true;
    const res = await getStockMasterListByPart(
      groupCd.value,
      storeCd.value,
      cond.value,
      sdate.value.replaceAll("-", ""),
      edate.value.replaceAll("-", ""),
      supplierid.value,
      cond2.value
    );
    store.state.loading = false;
    /** 메인 그리드 + 더블클릭 시 팝업 검수자/코멘트(strComments·strCheckEmpName 등) 출처 */
    rowData.value = res.data.List;
  } catch (error) {}
};

const updatedrowdata = ref([]);
const updatedrowdata2 = ref([]);
/**

/**
 * 입력창 수정 데이터 갱신
 */
const disabled = ref(false);
const updatedRowData = (newValue) => {
  console.log(newValue);
  updatedrowdata.value = newValue;
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
    "매출일자 : " +
    sdate.value +
    "~" +
    edate.value +
    "\n파트 : " +
    optionList.value.filter((item) => item.lngPartCode == cond.value)[0]
      .strPartName;

  exporttoExcel.value = !exporttoExcel.value;
};

const openpopup = ref(false);

/** 팝업에서 파트 미선택(전체)일 때 공통 안내 */
const MSG_POPUP_PART_FIRST = "파트를 먼저 선택 해 주십시오.";
const isPopupPartAll = () => {
  const v = scond4.value;
  return (
    v === "0" ||
    v === 0 ||
    v === "" ||
    v === null ||
    v === undefined
  );
};
const swalPopupPartFirst = () =>
  Swal.fire({
    title: "경고",
    text: MSG_POPUP_PART_FIRST,
    icon: "warning",
    confirmButtonText: "확인",
  });

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
  orderBookByStock.value = {};
  allowZeroFromBottomThisRound.value = null;
  newOrderSupplierByStockId.value = {};
  editModeDetailSnapshot2.value = [];
  if (suppressBottomOrderBookMergeTimer != null) {
    clearTimeout(suppressBottomOrderBookMergeTimer);
    suppressBottomOrderBookMergeTimer = null;
  }
  suppressOrderBookMergeFromBottomGrid.value = false;
  rowData2.value = [];
  filteredrowData2.value = [];
  updatedrowdata2.value = [];
  rowData3.value = [];
  updatedrowdata3.value = [];
  scond2.value = formatLocalDate(new Date());
  scond3.value = formatLocalDate(new Date());

  tempGroupCd.value = store.state.userData.lngStoreGroup;
  tempStoreCd.value = storeCd.value;

  //console.log(optionList3.value);
  storeCd2.value = storeCd.value;
  currentEdit.value = true;
  try {
    const res = await getStockCloseDate(
      store.state.userData.lngStoreGroup,
      storeCd.value,
      scond2.value.replaceAll("-", "")
    );

    if (res.data.List[0].blnClosed == "1") {
      Swal.fire({
        title: "경고",
        text: "마감된 일자는 매입 등록이 불가능합니다.",
        icon: "warning",

        confirmButtonText: "확인",
      });
    }
  } catch (error) {
  }
  scond.value = "01";
  if (cond.value != "0" && cond.value != 0 && String(cond.value).trim() !== "") {
    scond4.value = String(cond.value);
    try {
      await searchButton4();
    } catch (error) {
      console.log(error);
    }
  } else {
    scond4.value = "0";
  }
  openpopup.value = true;
};

const scond = ref("01");
const scond2 = ref("");
const scond3 = ref("");
const scond4 = ref("0");
const scond5 = ref("");
const openpopup2 = ref(false);
/** 자재추가 팝업 Realgrid — 동일 컨테이너에 GridView 중복 생성 방지 */
const stockPickerRealgridKey = ref(0);
const showStockList = async () => {
  if (isPopupPartAll()) {
    await swalPopupPartFirst();
    return;
  }
  rowData4.value = [];
  updatedrowdata4.value = [];
  stockPickerRealgridKey.value += 1;
  openpopup2.value = true;
  await nextTick();
  await searchButton2();
};

const sscond = ref("-1");
const sscond2 = ref("");

const rowData4 = ref([]);

const searchButton2 = async () => {
  try {
    store.state.loading = true;
    const res = await getStockItemListWithFavorite2(
      store.state.userData.lngStoreGroup,
      storeCd2.value,
      3,
      scond3.value.replaceAll("-", "")
    );

    console.log(res);
    store.state.loading = false;
    updatedrowdata4.value = [];
    rowData4.value = res.data.List;
  } catch (error) {
    store.state.loading = false;
  } finally {
    store.state.loading = false;
  }
};

const searchValue = ref(["-1", "-1"]);

const setSearchValue = (e) => {
  searchValue.value = [e.target.value, searchValue.value[1]];
};

const searchWord = (e) => {
  sscond2.value = e.target.value;
};

const checkedRowData2 = async (e) => {
  if (!Array.isArray(e) || e.length < 4) return;
  console.log(e);
  const res = await saveFavoriteStockItem2(
    store.state.userData.lngStoreGroup,
    storeCd.value,
    e[3],
    e[1] == true ? 0 : 1
  );
  console.log(res);
};
const tempColId = ref("");
const clickedButtonCol = (e) => {
  console.log(e);
  tempColId.value = e;
};

/** 자재추가 팝업 그리드 행 클릭 — Realgrid `clickedRowData` emit (PUR03_035INS와 동일 역할) */
const clickedRowData = (row) => {
  void row;
};

/** 자재추가 팝업에서 발주에 넣을 행 — lngCheck·checkbox 등 체크 상태 반영 */
const isMaterialPickerRowSelected = (item) => {
  if (item == null || typeof item !== "object" || Array.isArray(item))
    return false;
  const lc = item.lngCheck ?? item.LngCheck;
  if (lc === true || lc === 1 || lc === "1") return true;
  const cb = item.checkbox;
  if (cb === true || cb === 1 || cb === "1") return true;
  return false;
};

const updatedrowdata4 = ref([]);
const updatedRowData4 = (e) => {
  const incoming = Array.isArray(e) ? e : [];
  updatedrowdata4.value = incoming.filter(isMaterialPickerRowSelected);
  console.log(updatedrowdata4.value);
};

const rowData3 = ref([]);
const addButton2 = () => {
  if (updatedrowdata4.value.length == 0) {
    Swal.fire({
      title: "경고",
      text: "추가하실 자재를 선택해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }

  const temprow = updatedrowdata4.value
    .filter((item) => item && typeof item === "object" && !Array.isArray(item))
    .map((item) => ({
      ...item,
      dblCheckQty: 0,
      curSupply: 0,
      curTax: 0,
      curTotal: 0,
      lngCheck: "0",
      checkbox: false,
    }));

  rowData3.value = [...rowData3.value, ...temprow];
  openpopup2.value = false;
  nextTick(() => {
    updatedRowData3(rowData3.value);
  });
};

const searchButton3 = async (e) => {
  if (isPopupPartAll()) {
    await swalPopupPartFirst();
    return;
  }
  try {
    /** 최근등록·즐겨찾기 — searchButton4와 동일 PART 기준 (Favorite2는 PART 미전달로 즐겨찾기 실패) */
    const res = await getStockItemListWithFavorite(
      store.state.userData.lngStoreGroup,
      storeCd2.value,
      scond4.value,
      e.target.value,
      getFavoriteListUdate()
    );
    const list = res.data?.List ?? [];
    if (list.length > 0) {
      updatedrowdata3.value = list.map((item) => ({
        ...item,
        dblCheckQty: item.dblOrderQty,
        lngCheck: item.lngCheck ?? item.LngCheck ?? "0",
        checkbox: item.checkbox ?? false,
      }));
      rowData3.value = list.map((item) => ({
        ...item,
        dblCheckQty: item.dblOrderQty,
        lngCheck: item.lngCheck ?? item.LngCheck ?? "0",
        checkbox: item.checkbox ?? false,
      }));
    } else {
      updatedrowdata3.value = list;
      rowData3.value = list;
    }
  } catch (error) {}
};

const onPopupToolbarScond7Change = async (e) => {
  const v = e.target.value;
  if (isPopupPartAll()) {
    await swalPopupPartFirst();
    return;
  }
  scond7.value = v;
  await searchButton3(e);
};

const searchValue2 = ref(["-1"]);

const SupplierId2 = async (e) => {
  if (isPopupPartAll() && e != "0" && e != 0) {
    await swalPopupPartFirst();
    return;
  }
  if (e == "0") {
    searchValue2.value = ["-1"];
  } else {
    searchValue2.value = [e];
  }
};

const scond6 = ref("");
const scond9 = ref("");

const setScond6 = async (e) => {
  if (isPopupPartAll()) {
    e.target.value = scond9.value;
    await swalPopupPartFirst();
    return;
  }
  scond9.value = e.target.value;
};

/**
 * PUR03_035INS 팝업과 동일 패턴 — 매입수량(dblCheckQty) 기준 orderBook, 상·하 동기, chkTopRemove 분리
 */
const orderBookByStock = ref({});
const allowZeroFromBottomThisRound = ref(null);
const newOrderSupplierByStockId = ref({});
const bottomGridSyncPulse = ref(0);
const topGridSyncPulse = ref(0);
/** 단가적용일 변경 등으로 하단 목록만 갱신할 때 Realgrid emit(0수량)이 orderBook·상단을 비우지 않게 함 */
let suppressBottomOrderBookMergeTimer = null;
const suppressOrderBookMergeFromBottomGrid = ref(false);
const popupTopOrderGridWrap = ref(null);
const popupOrderHeaderActionsWrap = ref(null);
const popupMaterialToolbarWrap = ref(null);
const popupBottomMaterialGridWrap = ref(null);
/** 수정(더블클릭) 시 getStockCheckDetail 원본 행 — 하단·상단이 orderBook 축약으로 비지 않게 유지 */
const editModeDetailSnapshot2 = ref([]);

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

const getStockId = (row) => {
  if (!row || typeof row !== "object") return "";
  const candidates = [
    row.lngStockID,
    row.lngStockId,
    row.LngStockID,
    row.LngStockId,
    row.STOCK_ID,
    row.stockId,
    row.StockID,
  ];
  for (const v of candidates) {
    if (v !== undefined && v !== null && v !== "") return String(v).trim();
  }
  return "";
};

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

/**
 * 더블클릭 시 메인 목록(getStockMasterListByPart)에서 헤더용 행 찾기.
 * e.index 만 쓰면 정렬/스크롤 후 다른 행과 엇갈릴 수 있어 strCheckNo(+매장) 우선.
 */
function resolveMasterRowFromDblclick(e) {
  const checkNoRaw = Array.isArray(e)
    ? e[4]
    : getRowVal(e, "strCheckNo", "StrCheckNo");
  const checkNo =
    checkNoRaw != null && checkNoRaw !== ""
      ? String(checkNoRaw).trim()
      : "";
  const storeRaw = Array.isArray(e)
    ? e[13]
    : getRowVal(e, "lngStoreCode", "LngStoreCode");
  const storeCd =
    storeRaw != null && storeRaw !== "" ? String(storeRaw).trim() : "";

  const list =
    rowData.value && rowData.value.length > 0
      ? rowData.value
      : updatedrowdata.value || [];

  if (checkNo) {
    const found = list.find((r) => {
      if (!r || typeof r !== "object" || Array.isArray(r)) return false;
      const cn = String(getRowVal(r, "strCheckNo", "StrCheckNo") ?? "").trim();
      if (cn !== checkNo) return false;
      if (!storeCd) return true;
      const sc = String(
        getRowVal(r, "lngStoreCode", "LngStoreCode") ?? ""
      ).trim();
      return sc === storeCd || sc === "";
    });
    if (found) return found;
  }

  if (e && typeof e.index === "number") {
    const byIdx = list[e.index];
    if (byIdx && typeof byIdx === "object" && !Array.isArray(byIdx)) {
      return byIdx;
    }
  }
  return null;
}

/**
 * 더블클릭(기존 전표) 팝업 검수자·코멘트 — getStockMasterListByPart 목록 행만 사용.
 * 행이 없거나 필드가 없으면 scond5/scond6 는 호출 전에 비운 뒤 그대로 공백.
 */
function fillPopupInspectorAndComment(masterRow) {
  const z = (v) =>
    v === null || v === undefined ? "" : String(v).trim();
  let c5 = "";
  let c6 = "";
  if (masterRow && typeof masterRow === "object" && !Array.isArray(masterRow)) {
    c5 = z(
      getRowVal(
        masterRow,
        "strComments",
        "StrComments",
        "strCheckComment",
        "StrCheckComment",
        "strHeaderComment",
        "StrHeaderComment"
      )
    );
    c6 = z(
      getRowVal(
        masterRow,
        "strCheckEmpName",
        "StrCheckEmpName",
        "strCheckEmp",
        "StrCheckEmp",
        "strEmpName",
        "StrEmpName",
        "strEmpnm",
        "StrEmpnm",
        "strEname",
        "StrEname"
      )
    );
  }
  scond5.value = c5;
  scond6.value = c6;
}

/** YYYYMMDD 또는 YYYY-MM-DD → 표시용 YYYY-MM-DD */
function formatYmdDigitsToIsoDate(v) {
  if (v == null || v === "") return "";
  const s = String(v).trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  const raw = s.replace(/-/g, "");
  if (raw.length === 8 && /^\d{8}$/.test(raw)) {
    return `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`;
  }
  return "";
}

/**
 * 팝업 단가적용일(scond3).
 * 메인(getStockMasterListByPart) 행 또는 상세(getStockCheckDetail) 첫 행에서 아래 필드 순으로 조회.
 * 서버에 없으면 getStockMasterListByPart / getStockCheckDetail 응답에 동일 의미 컬럼 추가 후 getRowVal 키만 보강하면 됨.
 */
function fillPopupPriceApplyDate(masterRow, detailRow) {
  const keys = [
    "dtmUnitPriceDate",
    "DtmUnitPriceDate",
    "dtmPriceApplyDate",
    "DtmPriceApplyDate",
    "dtmStockPriceDate",
    "DtmStockPriceDate",
    "dtmEDate",
    "DtmEDate",
    "dtmExpectedDate",
    "DtmExpectedDate",
    "strUnitPriceYmd",
    "StrUnitPriceYmd",
    "strPriceApplyYmd",
    "StrPriceApplyYmd",
  ];
  const pick = (r) => {
    if (!r || typeof r !== "object") return "";
    return formatYmdDigitsToIsoDate(getRowVal(r, ...keys));
  };
  const d = pick(masterRow) || pick(detailRow);
  if (d) scond3.value = d;
}

function patchNewOrderSupplierSnap(book) {
  const b = book || {};
  const prev = newOrderSupplierByStockId.value || {};
  const snap = {};
  for (const [sid, row] of Object.entries(b)) {
    const sup = getSupplierIdFromRow(row);
    snap[sid] = sup || prev[sid] || "";
  }
  newOrderSupplierByStockId.value = snap;
}

/** 매입수량이 0이 아닌지 (PUR03 hasOrderQty — dblCheckQty 기준) */
const hasCheckQty = (item) => {
  const q = item?.dblCheckQty;
  if (q === "" || q === null || q === undefined) return false;
  if (q === "0" || q === 0) return false;
  const n = Number(q);
  return !Number.isNaN(n)
    ? n !== 0
    : String(q).trim() !== "" && String(q).trim() !== "0";
};

const assignDefined = (base, patch) => {
  const out = { ...(base || {}) };
  if (!patch || typeof patch !== "object") return out;
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

const stripBottomGridCheckFieldsForBookMerge = (patch) => {
  if (!patch || typeof patch !== "object") return patch;
  const out = { ...patch };
  delete out.checkbox;
  delete out.lngCheck;
  return out;
};

/**
 * 하단 행이 "발주 확정 양수 수량"을 전달하는지 (빈 값·0·"0" 등은 false).
 */
const bottomRowAssertsPositiveOrderQty = (row) => {
  const patch = stripBottomGridCheckFieldsForBookMerge(row);
  const q = patch?.dblCheckQty;
  if (q === undefined || q === null || q === "") return false;
  const s = typeof q === "string" ? String(q).trim() : String(q);
  if (s === "" || s === "0") return false;
  const n = Number(s);
  if (!Number.isNaN(n)) return n > 0;
  return hasCheckQty({ dblCheckQty: q });
};

/**
 * orderBook에 이미 주문이 있는데, 하단 emit이 해당 품목을 0/빈 수량으로 보내는 경우
 * (단가일 변경 후 API가 0으로 준 채로 두고 다른 품목만 추가 주문할 때 전체 행이 함께 옴)
 * assignDefined가 기존 수량·금액을 0으로 덮어 상단이 초기화되지 않게 함.
 * 하단에서 실제 양수 수량을 넣은 경우에만 patch를 반영.
 */
const mergeBottomRowIntoBookBase = (prevBook, row) => {
  if (
    prevBook != null &&
    hasCheckQty(prevBook) &&
    !bottomRowAssertsPositiveOrderQty(row)
  ) {
    return { ...prevBook };
  }
  const patch = { ...stripBottomGridCheckFieldsForBookMerge(row) };
  return assignDefined(prevBook, patch);
};

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
    if (!sid || !hasCheckQty(row)) continue;
    next[sid] = { ...row };
  }
  orderBookByStock.value = next;
  patchNewOrderSupplierSnap(next);
};

/** 단가구분(scond) — rowData2 → 상단 표시·updatedrowdata2 (요청: 매번 재적용) */
const applyScondPriceToDisplayOnly = () => {
  if (String(scond.value) === "02") {
    filteredrowData2.value = (rowData2.value || []).map((item) => ({
      ...item,
      curUnitPrice: item.curSalesUnitPrice,
      curTotal: item.curSalesTotal,
      curTax: item.curSalesTax,
      curSupply: item.curSalesSupply,
    }));
  } else {
    filteredrowData2.value = (rowData2.value || []).map((r) => ({ ...r }));
  }
  updatedrowdata2.value = filteredrowData2.value.map((r) => ({ ...r }));
};

const patchRowData3QtyFromOrderBook = () => {
  const book = orderBookByStock.value || {};
  rowData3.value = (rowData3.value || []).map((row) => {
    const sid = getStockId(row);
    const base = { ...row };
    if (!sid) return base;
    const br = book[sid];
    if (br != null && hasCheckQty(br)) {
      const sup = getSupplierIdFromRow(br);
      return {
        ...base,
        dblCheckQty: br.dblCheckQty,
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

const isFocusInsideTopOrderGrid = () => {
  const wrap = popupTopOrderGridWrap.value;
  const ae = document.activeElement;
  return wrap != null && ae != null && ae instanceof Node && wrap.contains(ae);
};

const isFocusInsideBottomMaterialGrid = () => {
  const wrap = popupBottomMaterialGridWrap.value;
  const ae = document.activeElement;
  return wrap != null && ae != null && ae instanceof Node && wrap.contains(ae);
};

const onPopupMouseDownSyncBottomGrid = (ev) => {
  const t = ev?.target;
  if (!t || !(t instanceof Node)) return;

  const inTopGrid = popupTopOrderGridWrap.value?.contains(t) === true;

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

/** 상단 자재제거 체크 — chkTopRemove 우선(035와 동일), 없으면 lngCheck */
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

const updatedrowdata3 = ref([]);

/** 하단 emit — 하→상 (orderBook) */
const updatedRowData3 = (e) => {
  const incoming = Array.isArray(e) ? e : [];
  if (suppressOrderBookMergeFromBottomGrid.value) {
    /** rowData3는 searchButton4 등에서 이미 세팅됨. 재할당만 하면 Realgrid watch 재진입 위험 */
    updatedrowdata3.value = incoming.map((r) => ({ ...r }));
    return;
  }
  updatedrowdata3.value = incoming;
  /** 신규: :rowData="rowData3" 가 stale 이면 체크 직후 patchRowData3 가 이전 행으로 덮어 체크가 풀림 → incoming 과 동기화 */
  if (currentEdit.value === true) {
    rowData3.value = incoming.map((r) => ({ ...r }));
  }

  const book = { ...orderBookByStock.value };
  const allowZeroSet = allowZeroFromBottomThisRound.value;

  for (const row of incoming) {
    const sid = getStockId(row);
    if (!sid) continue;

    const prevBook = book[sid];
    const merged = mergeBottomRowIntoBookBase(prevBook, row);

    if (!hasCheckQty(merged)) {
      const hadBookOrder = prevBook != null && hasCheckQty(prevBook);
      if (
        hadBookOrder &&
        allowZeroSet != null &&
        !allowZeroSet.has(sid)
      ) {
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

  if (currentEdit.value === false) {
    const incomingBySid = {};
    for (const r of incoming) {
      const sid = getStockId(r);
      if (sid) incomingBySid[sid] = r;
    }
    const snap = editModeDetailSnapshot2.value || [];
    if (snap.length === 0) {
      const mergedRows = Object.values(book)
        .filter(hasCheckQty)
        .map(sanitizeBookRowForTopGrid);
      rowData2.value = mergedRows.map((r) => ({ ...r }));
      applyScondPriceToDisplayOnly();
      rebuildOrderBookFromRows(filteredrowData2.value);
      rowData3.value = [];
      updatedrowdata3.value = [];
      patchRowData3QtyFromOrderBook();
      return;
    }
    const row2BySid = {};
    for (const r of rowData2.value || []) {
      const sid = getStockId(r);
      if (sid) row2BySid[sid] = r;
    }
    const mergedTop = snap.map((row) => {
      const sid = getStockId(row);
      if (!sid) return { ...row };
      const baseRow = { ...row, ...(row2BySid[sid] ? row2BySid[sid] : {}) };
      const br = book[sid];
      const inc = incomingBySid[sid];
      if (br != null) {
        const sup = getSupplierIdFromRow(br);
        return {
          ...baseRow,
          dblCheckQty: br.dblCheckQty,
          curSupply: br.curSupply,
          curTax: br.curTax,
          curTotal: br.curTotal,
          ...(sup ? { lngSupplierID: sup } : {}),
        };
      }
      if (inc != null) {
        return assignDefined(
          { ...baseRow },
          stripBottomGridCheckFieldsForBookMerge(inc)
        );
      }
      return { ...baseRow };
    });
    rowData2.value = mergedTop.map((r) => ({ ...r }));
    updatedrowdata2.value = mergedTop.map((r) => ({ ...r }));
    applyScondPriceToDisplayOnly();
    rebuildOrderBookFromRows(filteredrowData2.value);
    /** 수정: 035 발주상세와 같이 하단 자재목록(rowData3)은 비움 */
    rowData3.value = [];
    updatedrowdata3.value = [];
    patchRowData3QtyFromOrderBook();
    return;
  }

  const mergedRows = Object.values(book)
    .filter(hasCheckQty)
    .map(sanitizeBookRowForTopGrid);
  rowData2.value = mergedRows.map((r) => ({ ...r }));
  applyScondPriceToDisplayOnly();
  rebuildOrderBookFromRows(filteredrowData2.value);
  patchRowData3QtyFromOrderBook();
};

/** 상단 emit — 상→하 */
const updatedRowData2 = (newValue) => {
  const arr = Array.isArray(newValue) ? newValue : [];
  updatedrowdata2.value = arr;
  rowData2.value = arr.map((r) => ({ ...r }));
  rebuildOrderBookFromRows(rowData2.value);
  patchRowData3QtyFromOrderBook();
  applyScondPriceToDisplayOnly();
  rebuildOrderBookFromRows(filteredrowData2.value);
};

const isBottomMaterialRemoveChecked = (item) => {
  if (item == null || typeof item !== "object") return false;
  const cb = item.checkbox;
  if (cb === true || cb === 1 || cb === "1") return true;
  const lc = item.lngCheck;
  if (lc === true || lc === 1 || lc === "1") return true;
  return false;
};

const deleteStock = async () => {
  if (isPopupPartAll()) {
    await swalPopupPartFirst();
    return;
  }
  rowData3.value = updatedrowdata3.value.filter(
    (item) => !isBottomMaterialRemoveChecked(item)
  );
  updatedrowdata3.value = rowData3.value.map((r) => ({ ...r }));
  nextTick(() => {
    updatedRowData3(rowData3.value);
  });
};

/** 상단 자재제거(신규) — 035 applyLocalDeleteStock2, 매입수량·금액 필드 */
const applyLocalDeleteStock2_PUR02 = async (rows, removedIds) => {
  allowZeroFromBottomThisRound.value = new Set(removedIds);

  rowData2.value = rows.filter((item) => !isTopRowCheckedForRemove(item));
  updatedrowdata2.value = [...rowData2.value];

  const zeroQtyIfRemoved = (row) => {
    const sid = getStockId(row);
    if (!sid || !removedIds.has(sid)) return { ...row };
    return {
      ...row,
      dblCheckQty: 0,
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
  applyScondPriceToDisplayOnly();
  rebuildOrderBookFromRows(filteredrowData2.value);
};

const deleteStock2 = async () => {
  if (isPopupPartAll()) {
    await swalPopupPartFirst();
    return;
  }
  const rows = updatedrowdata2.value || [];
  const checkedRows = rows.filter(isTopRowCheckedForRemove);
  const removedIds = new Set(
    checkedRows.map((item) => getStockId(item)).filter((id) => id !== "")
  );

  if (removedIds.size === 0) {
    await Swal.fire({
      title: "경고",
      text: "제거할 자재를 선택해 주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (currentEdit.value == false) {
    const tempRowDataLength = filteredrowData2.value.length;
    try {
      const checkseqs = checkedRows.map((item) => item.lngCheckSeq).join("\u200b");
      const orderseqs = checkedRows.map((item) => item.lngOrderSeq).join("\u200b");
      const res = await deleteStockListBypart(
        tempGroupCd.value,
        tempStoreCd.value,
        tempCheckNo.value,
        checkseqs,
        tempOrderNo.value,
        orderseqs,
        store.state.userData.lngSequence,
        tempRowDataLength,
        checkedRows.length
      );

      console.log(res);
      if (res.data.RESULT_CD == "00") {
        await Swal.fire({
          title: "성공",
          text: "삭제에 성공하였습니다.",
          icon: "success",

          confirmButtonText: "확인",
        });
        openpopup.value = false;
        openpopup2.value = false;
        searchButton();
      } else {
        await Swal.fire({
          title: "실패",
          text: "삭제에 실패하였습니다.",
          icon: "error",

          confirmButtonText: "확인",
        });
      }
    } catch (error) {}
  } else {
    await applyLocalDeleteStock2_PUR02(rows, removedIds);
  }
};

const deleteStock3 = async () => {
  console.log(updatedrowdata2.value);

  try {
    const res = await deleteStockListBypart(
      tempGroupCd.value,
      tempStoreCd.value,
      tempCheckNo.value,
      "",
      tempOrderNo.value,
      "",
      store.state.userData.lngSequence,
      1,
      1
    );

    console.log(res);

    if (res.data.RESULT_CD == "00") {
      await Swal.fire({
        title: "성공",
        text: "삭제에 성공하였습니다.",
        icon: "success",

        confirmButtonText: "확인",
      });
      openpopup.value = false;
      openpopup2.value = false;
      searchButton();
    } else {
      await Swal.fire({
        title: "실패",
        text: "삭제에 실패하였습니다.",
        icon: "error",

        confirmButtonText: "확인",
      });
    }
  } catch (error) {}
};

const saveButton2 = async () => {
  if (isPopupPartAll()) {
    await swalPopupPartFirst();
    return;
  }
  try {
    const res = await getStockCloseDate(
      store.state.userData.lngStoreGroup,
      storeCd2.value,
      scond2.value.replaceAll("-", "")
    );

    if (res.data.List[0].blnClosed == "1") {
      Swal.fire({
        title: "경고",
        text: "마감된 일자는 매입 등록이 불가능합니다.",
        icon: "warning",

        confirmButtonText: "확인",
      });
      return;
    }
  } catch (error) {
    console.log(error);
  } finally {
  }

  if (updatedrowdata2.value.length == 0) {
    Swal.fire({
      title: "경고",
      text: "매입 확정할 데이터가 존재하지 않습니다. 확인해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }

  if (currentEdit.value == false) {
    try {
      const checkseqs = updatedrowdata2.value
        .map((item) => item.lngCheckSeq)
        .join("\u200b");
      const dblcheckqtys = updatedrowdata2.value
        .map((item) => item.dblCheckQty)
        .join("\u200b");
      const unitprice = updatedrowdata2.value
        .map((item) => item.curUnitPrice)
        .join("\u200b");
      const supplys = updatedrowdata2.value
        .map((item) => item.curSupply)
        .join("\u200b");
      const taxs = updatedrowdata2.value
        .map((item) => item.curTax)
        .join("\u200b");
      const comments = updatedrowdata2.value
        .map((item) => item.strComments)
        .join("\u200b");
      const res = await saveStockMasterDetailByPart(
        tempGroupCd.value,
        tempStoreCd.value,
        tempCheckNo.value,
        scond5.value,
        scond6.value,
        checkseqs,
        dblcheckqtys,
        unitprice,
        supplys,
        taxs,
        comments,
        store.state.userData.lngSequence
      );

      console.log(res);

      if (res.data.RESULT_CD == "00") {
        await Swal.fire({
          title: "성공",
          text: "저장에 성공하였습니다.",
          icon: "success",

          confirmButtonText: "확인",
        });
      } else {
        await Swal.fire({
          title: "실패",
          text: "저장에 실패하였습니다.",
          icon: "error",

          confirmButtonText: "확인",
        });
      }
      initGrid2();
      openpopup.value = false;
      openpopup2.value = false;
      searchButton();
    } catch (error) {}
  } else {
    try {
      const supplierids = updatedrowdata2.value
        .map((item) => item.lngSupplierID)
        .join("\u200b");
      const stockids = updatedrowdata2.value
        .map((item) => item.lngStockID)
        .join("\u200b");
      const orderqtys = updatedrowdata2.value
        .map((item) => item.dblCheckQty)
        .join("\u200b");
      const unitprices = updatedrowdata2.value
        .map((item) => item.curUnitPrice)
        .join("\u200b");
      const supplys = updatedrowdata2.value
        .map((item) => item.curSupply)
        .join("\u200b");
      const taxes = updatedrowdata2.value
        .map((item) => item.curTax)
        .join("\u200b");
      const orderComments = updatedrowdata2.value
        .map((item) => item.strComments)
        .join("\u200b");
      const res = await saveStockMasterDetailByPart2(
        tempGroupCd.value,
        tempStoreCd.value,
        scond2.value.replaceAll("-", ""),
        scond5.value,
        scond6.value,
        store.state.userData.lngSequence,
        supplierids,
        stockids,
        orderqtys,
        unitprices,
        supplys,
        taxes,
        orderComments,
        scond4.value,
        scond3.value.replaceAll("-", "")
      );
      console.log(res);
      if (res.data.RESULT_CD == "00") {
        await Swal.fire({
          title: "성공",
          text: "저장에 성공하였습니다.",
          icon: "success",

          confirmButtonText: "확인",
        });
      } else {
        await Swal.fire({
          title: "실패",
          text: "저장에 실패하였습니다.",
          icon: "error",

          confirmButtonText: "확인",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      openpopup.value = false;
      openpopup2.value = false;
      searchButton();
    }
  }
};

const setScond3 = async (e) => {
  if (
    parseInt(e.target.value.replaceAll("-", "")) >=
    parseInt(scond3.value.replaceAll("-", ""))
  ) {
    const date = new Date(e.target.value);
    date.setDate(date.getDate() + 1);

    scond3.value = date.toISOString().slice(0, 10);
  }

  try {
    const res = await getStockCloseDate(
      store.state.userData.lngStoreGroup,
      storeCd2.value,
      scond2.value.replaceAll("-", "")
    );

    if (res.data.List[0].blnClosed == "1") {
      Swal.fire({
        title: "경고",
        text: "마감된 일자는 매입 등록이 불가능합니다.",
        icon: "warning",

        confirmButtonText: "확인",
      });
    }
  } catch (error) {
  } finally {
  }
};

/**
 * type="date" 달력: change만 오거나 v-model과 순서가 어긋나 watch가 안 도는 경우가 있어,
 * watch + @change 모두에서 동일 스케줄러로 마감일 조회·하단 재조회를 한 번만 실행.
 */
let scond3PopupEffectFlushId = 0;
const applyScond3PopupSideEffects = async () => {
  try {
    const res = await getCloseDtmDate2(
      store.state.userData.lngStoreGroup,
      storeCd.value,
      scond3.value.replaceAll("-", ""),
      0
    );
    console.log(res);
  } catch (error) {}

  if (!openpopup.value || !currentEdit.value) return;
  if (isPopupPartAll()) return;
  try {
    await searchButton4(undefined, { preserveTopOrders: true });
  } catch (_) {}
};

const scheduleScond3PopupEffects = () => {
  const id = ++scond3PopupEffectFlushId;
  nextTick(async () => {
    if (id !== scond3PopupEffectFlushId) return;
    await applyScond3PopupSideEffects();
  });
};

const onScond3DateInputChange = (e) => {
  const v = e?.target?.value ?? "";
  if ((scond3.value || "") !== v) {
    scond3.value = v;
  }
  scheduleScond3PopupEffects();
};

watch(scond3, () => {
  scheduleScond3PopupEffects();
});

/** getStockItemListWithFavorite 의 UDATE — 단가적용일(scond3) YYYYMMDD */
const getFavoriteListUdate = () =>
  (scond3.value || "").trim().replaceAll("-", "");

const scond7 = ref("1");
const searchButton4 = async (e, opts = {}) => {
  if (isPopupPartAll()) {
    await swalPopupPartFirst();
    return;
  }
  const preserveTopOrders =
    opts?.preserveTopOrders === true && currentEdit.value === true;
  if (preserveTopOrders) {
    suppressOrderBookMergeFromBottomGrid.value = true;
    if (suppressBottomOrderBookMergeTimer != null) {
      clearTimeout(suppressBottomOrderBookMergeTimer);
      suppressBottomOrderBookMergeTimer = null;
    }
  }
  try {
    const res = await getStockItemListWithFavorite(
      store.state.userData.lngStoreGroup,
      storeCd2.value,
      scond4.value,
      scond7.value,
      getFavoriteListUdate()
    );
    //console.log(res);
    if (res.data.List.length > 0) {
      updatedrowdata3.value = res.data.List.map((item) => ({
        ...item,
        dblCheckQty: item.dblOrderQty,
        lngCheck: item.lngCheck ?? item.LngCheck ?? "0",
        checkbox: item.checkbox ?? false,
      }));

      rowData3.value = res.data.List.map((item) => ({
        ...item,
        dblCheckQty: item.dblOrderQty,
        lngCheck: item.lngCheck ?? item.LngCheck ?? "0",
        checkbox: item.checkbox ?? false,
      }));
    } else {
      updatedrowdata3.value = (res.data.List || []).map((item) => ({
        ...item,
        lngCheck: item.lngCheck ?? item.LngCheck ?? "0",
        checkbox: item.checkbox ?? false,
      }));
      rowData3.value = (res.data.List || []).map((item) => ({
        ...item,
        lngCheck: item.lngCheck ?? item.LngCheck ?? "0",
        checkbox: item.checkbox ?? false,
      }));
    }
  } catch (error) {
  } finally {
    if (preserveTopOrders) {
      await nextTick();
      suppressBottomOrderBookMergeTimer = setTimeout(() => {
        suppressOrderBookMergeFromBottomGrid.value = false;
        suppressBottomOrderBookMergeTimer = null;
      }, 150);
    }
  }
};

const initGrid2 = () => {
  scond.value = "01";
  scond2.value = "";
  scond3.value = "";
  scond4.value = "0";
  scond5.value = "";

  scond7.value = "1";
  scond6.value = "";

  orderBookByStock.value = {};
  allowZeroFromBottomThisRound.value = null;
  newOrderSupplierByStockId.value = {};
  editModeDetailSnapshot2.value = [];
  if (suppressBottomOrderBookMergeTimer != null) {
    clearTimeout(suppressBottomOrderBookMergeTimer);
    suppressBottomOrderBookMergeTimer = null;
  }
  suppressOrderBookMergeFromBottomGrid.value = false;
  rowData2.value = [];
  filteredrowData2.value = [];
  updatedrowdata2.value = [];

  rowData3.value = [];
  updatedrowdata3.value = [];

  rowData4.value = [];
};

const closeOpenpopup = () => {
  initGrid2();
  openpopup.value = false;
  openpopup2.value = false;
};

const storeCd2 = ref(0);
const currentEdit = ref(false);
const tempGroupCd = ref("");
const tempStoreCd = ref("");
const tempCheckNo = ref("");
const tempOrderNo = ref("");
const dblclickedRowData = async (e) => {
  editModeDetailSnapshot2.value = [];
  console.log(e);

  try {
    const res = await getStockCloseDate(e[12], e[13], e[6]);

    console.log(res);

    if (res.data.List[0].blnClosed == "1") {
      Swal.fire({
        title: "경고",
        text: "마감된 일자는 매입 등록이 불가능합니다.",
        icon: "warning",

        confirmButtonText: "확인",
      });
    }
  } catch (error) {}
  try {
    const res = await getStockCheckDetail(
      e[12],
      e[13],
      e[4],
      e[14],
      e[6],
      store.state.userData.lngLanguage
    );

    storeCd2.value = e[13];
    rowData2.value = res.data.List;
    filteredrowData2.value = res.data.List;
    currentEdit.value = false;
    editModeDetailSnapshot2.value = (res.data.List || []).map((r) => ({ ...r }));

    scond2.value =
      e[6].slice(0, 4) + "-" + e[6].slice(4, 6) + "-" + e[6].slice(6, 8);
    console.log(res);

    scond4.value = e[15];
    tempGroupCd.value = e[12];
    tempStoreCd.value = e[13];
    tempCheckNo.value = e[4];
    tempOrderNo.value = e[5];
    scond.value = "01";
  } catch (error) {}

  const masterRow = resolveMasterRowFromDblclick(e);
  const detailFirst =
    Array.isArray(filteredrowData2.value) && filteredrowData2.value.length > 0
      ? filteredrowData2.value[0]
      : null;
  /** 검수자·코멘트: getStockMasterListByPart 목록 행만. 없거나 필드 없으면 공백 */
  scond5.value = "";
  scond6.value = "";
  fillPopupInspectorAndComment(masterRow);
  scond3.value = "";
  fillPopupPriceApplyDate(masterRow, detailFirst);
  /** 하단 그리드 거래처 컬럼 필터 해제 */
  searchValue2.value = ["-1"];

  rebuildOrderBookFromRows(filteredrowData2.value);
  applyScondPriceToDisplayOnly();
  rebuildOrderBookFromRows(filteredrowData2.value);
  /** 수정: 035 발주상세와 같이 하단 자재목록(rowData3)은 비움 */
  rowData3.value = [];
  updatedrowdata3.value = [];
  patchRowData3QtyFromOrderBook();

  openpopup.value = true;
};

const exporttoExcel2 = ref(false);
const documentSubTitle2 = ref("");

const clickedStoreNm2 = ref("");
const storeNm2 = (e) => {
  clickedStoreNm2.value = e;
};
const excelButton2 = async () => {
  if (isPopupPartAll()) {
    await swalPopupPartFirst();
    return;
  }
  documentSubTitle2.value = "매장명 :" + clickedStoreNm2.value;
  exporttoExcel2.value = !exporttoExcel2.value;
};

const setRowData2 = (e) => {
  console.log(rowData2.value);
  applyScondPriceToDisplayOnly();
  rebuildOrderBookFromRows(filteredrowData2.value);
  patchRowData3QtyFromOrderBook();
};

const deleteButton = async () => {
  try {
    const groupcds = updatedrowdata.value
      .filter((item) => item.lngCheck == true)
      .map((item) => item.lngStoreGroup)
      .join("\u200b");
    const storeCds = updatedrowdata.value
      .filter((item) => item.lngCheck == true)
      .map((item) => item.lngStoreCode)
      .join("\u200b");
    const checknos = updatedrowdata.value
      .filter((item) => item.lngCheck == true)
      .map((item) => item.strCheckNo)
      .join("\u200b");
    const ordernos = updatedrowdata.value
      .filter((item) => item.lngCheck == true)
      .map((item) => item.strOrderNo)
      .join("\u200b");

    const res = await deleteStockListBypart(
      groupcds,
      storeCds,
      checknos,
      "",
      ordernos,
      "",
      "",
      1,
      1
    );

    console.log(res);
    if (res.data.RESULT_CD == "00") {
      await Swal.fire({
        title: "성공",
        text: "삭제에 성공하였습니다.",
        icon: "success",

        confirmButtonText: "확인",
      });
      openpopup.value = false;
      openpopup2.value = false;
      searchButton();
    } else {
      await Swal.fire({
        title: "실패",
        text: "삭제에 실패하였습니다.",
        icon: "error",

        confirmButtonText: "확인",
      });
    }
  } catch (error) {}
};
</script>

<style scoped>
/*
 * PUR02_017INS·search-area-layout — 3열×2행
 * repeat(3, minmax(0, 1fr)) + column-gap/row-gap 동일 변수로 열 간격 통일.
 */
.pur018-search-grid {
  --pur018-label-col: 6.5rem;
  display: grid;
  width: 100%;
  min-width: 0;
  align-items: center;
  /* 1열: 조회기간·거래처 — 날짜 두 칸이 잘리지 않도록 최소 가로 확보, 2·3열은 나머지 */
  grid-template-columns: minmax(21rem, 1.32fr) minmax(0, 1fr) minmax(0, 1fr);
  column-gap: var(--pur018-item-gap);
  row-gap: var(--pur018-item-gap);
}

.pur018-cell {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: var(--pur018-item-gap);
}

.pur018-grid-filler {
  visibility: hidden;
  pointer-events: none;
  min-height: 2rem;
}

.pur018-sg-label {
  flex: 0 0 var(--pur018-label-col);
  width: var(--pur018-label-col);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
}

.pur018-cell-field {
  min-width: 0;
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  width: 100%;
}

.pur018-cell-field > * {
  min-width: 0;
  width: 100%;
}

.pur018-search-panel .pur018-search-grid select.pur018-sg-select {
  box-sizing: border-box;
  border: 1px solid var(--pur018-control-border) !important;
}

.pur018-search-panel .pur018-search-grid select.pur018-sg-select:focus {
  border-color: #3b82f6 !important;
}

.pur018-search-panel .pur018-search-grid input.pur018-sg-input {
  box-sizing: border-box;
  border: 1px solid var(--pur018-control-border) !important;
}

.pur018-search-panel .pur018-search-grid input.pur018-sg-input:focus {
  border-color: #3b82f6 !important;
}

.pur018-search-panel .pur018-pick-slot :deep(select) {
  border: 1px solid var(--pur018-control-border) !important;
}

.pur018-search-panel .pur018-pick-slot :deep(select:focus) {
  border-color: #3b82f6 !important;
}

.pur018-search-panel .pur018-pick-slot :deep(.pickstore-vs-shell),
.pur018-search-panel .pur018-bc-slot :deep(.pickstore-vs-shell) {
  border: 1px solid var(--pur018-control-border) !important;
  box-sizing: border-box;
  max-width: 100%;
  min-width: 0;
}

.pur018-bc-slot :deep(> div.flex.text-base) {
  width: 100%;
  min-width: 0;
}

.pur018-date-slot :deep(> div.flex.justify-start.items-center) {
  margin-left: 0;
  padding-left: 0;
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
}

.pur018-date-slot :deep(> div.flex > div.inline-flex) {
  display: flex !important;
  flex: 1 1 auto;
  width: 100%;
  min-width: 0;
  flex-wrap: nowrap;
  align-items: center;
}

.pur018-search-panel .pur018-date-slot :deep(input[type="date"]) {
  box-sizing: border-box;
  flex: 1 1 9.25rem;
  min-width: 9.25rem;
  width: 100%;
  max-width: none;
  height: 2rem;
  min-height: 2rem;
  padding-left: 0.75rem;
  padding-right: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  border-radius: 0.375rem;
  border: 1px solid var(--pur018-control-border) !important;
}

.pur018-search-panel .pur018-date-slot :deep(input[type="date"]:focus) {
  border-color: #3b82f6 !important;
}

.pur018-date-slot :deep(> div.flex > div.inline-flex > span),
.pur018-date-slot :deep(> div.flex > div.inline-flex > button) {
  flex-shrink: 0;
}

.pur018-pick-slot {
  overflow-x: auto;
  scrollbar-width: thin;
}

.pur018-pick-slot :deep(> div.flex.text-base) {
  width: 100%;
  min-width: 0;
  gap: var(--pur018-item-gap) !important;
}

.pur018-pick-slot :deep(> div.flex > div:first-child) {
  display: none;
}

.pur018-bc-slot :deep(> div.flex.items-center) {
  margin-top: 0;
}

/* 팝업 매장명 — PUR03_035INS .store-name-cell (disabled v-select 검정·좌측 정렬) */
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
