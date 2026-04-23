<!-- /*--############################################################################
# Filename : PUR03_035INS.vue                                                  
# Description : 마스터관리 > 발주 관리 > 발주 등록Ⅱ(파트별)                     
# Date :2025-09-18                                                           
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <!-- 조회조건 -->
  <div class="flex justify-between items-center w-full overflow-y-hidden">
    <PageName></PageName>
    <div class="flex justify-center mr-9 space-x-2 pr-5">
      <button @click="addButton" class="button new md:w-auto w-14">신규</button>

      <button @click="searchButton" class="button search w-auto">조회</button>
      <button @click="excelButton" class="button excel w-auto">엑셀</button>
    </div>
  </div>
  <div v-if="orderTimeInfo" class="text-sm text-blue-700 font-semibold px-2 py-1">
    {{ orderTimeInfo }}
  </div>
  <br />
  <div
    class="parent-search-bar grid min-h-14 w-full grid-cols-1 items-center gap-x-[clamp(1.35rem,3.5vw,2.5rem)] gap-y-3 bg-gray-200 rounded-lg px-7 md:grid-cols-2 md:gap-y-3 md:px-10 xl:h-14 xl:grid-cols-[minmax(0,1.28fr)_minmax(0,0.91fr)_minmax(0,0.91fr)_minmax(0,0.91fr)] xl:gap-y-0">
    <div class="flex min-w-0 items-center">
      <Datepicker_Order
        compactRow
        class="w-full min-w-0"
        @endDate="endDate"
        @startDate="startDate"
        :initToday="0"        
        :initToday2="-7"></Datepicker_Order>
    </div>
    <div class="flex min-w-0 items-center">
      <PickStore
        compactSearchBar
        :defaultStoreNm="'전체'"
        @update:storeCd="handleStoreCd"
        @storeNm="storeNm"
        :hideGroup="false"
        :hideAttr="false"></PickStore>
    </div>
    <div class="flex min-w-0 items-center gap-4">
      <div class="text-base font-semibold whitespace-nowrap shrink-0">파트</div>
      <select
        name=""
        id=""
        class="h-8 min-h-8 min-w-0 max-w-[12rem] flex-1 rounded-md border border-black bg-white px-2 text-sm"
        v-model="cond"
        @change="getSelectedValue">
        <option :value="i.lngPartCode" v-for="i in optionList">
          {{ i.strPartName }}
        </option>
      </select>
    </div>
    <div class="flex min-w-0 items-center">
      <BusinessClient
        toolbarStretch
        :setDynamicClass="'!h-8 !min-h-8 !w-[12rem] !max-w-[12rem] rounded-md border border-black px-2 text-sm'"
        :setDynamicClass2="'!mt-0'"
        @SupplierNm="SupplierNm"
        @SupplierId="SupplierId"
        :defaultNm="'전체'"></BusinessClient>
    </div>
  </div>

  <!-- 조회조건 -->
  <!-- 그리드 영역 -->
  <div class="w-full h-[80%]">
     <Realgrid
      :progid="1"
      :setFooter="true"
      :rowStateeditable="false"
      :progname="'PUR03_035INS_VUE'"
      :exporttoExcel="exporttoExcel"
      :documentSubTitle="documentSubTitle"
      :documentTitle="'PUR03_035INS'"
      @clickedRowData="clickedRowData"
      @clickedButtonCol="clickedButtonCol"
      @dblclickedRowData="dblclickedRowData"
      :rowData="rowData">
    </Realgrid>
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
          :checkRowAuto="false"
          :setFooter="true"
          :checkRowAuto2="true"
          :checkRenderEditable="true"
          :suppressEdit="isPopupToolbarLocked"
          :rowStateeditable="false"
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
          :CalculateTaxColId="'curTax'"
          :searchColId3="['lngSupplierID']"
          :searchValue="searchValue2"
          :inputOnlyNumberColumn="'dblOrderQty'"
          :CalculateTaxColId2="'curSupply'"
          :editableColId="'dblOrderQty,strOrderComments'"
          :syncRowDataPulse="bottomGridSyncPulse"
          @updatedRowData="updatedRowData3"
          :checkRowAuto="false"
          :checkRowAuto2="true"
          :checkRenderEditable="true"
          :suppressEdit="isPopupToolbarLocked"
          :searchColId="'lngStockID,strStockName'"
          :searchWord3="scond6"
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
          @click="closeStockPickerPopup">
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
              @SupplierId="SupplierId3"></BusinessClient>
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
          :emitCheckedRowData2AsJson="true"
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
  searchValue.value = [searchValue.value[0], e == "0" ? "-1" : e];
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
/** 상단 발주내역 그리드 emit — 상→하 동기화 */
const updatedRowData2 = (newValue) => {
  const arr = Array.isArray(newValue) ? newValue : [];
  updatedrowdata2.value = arr;
  rowData2.value = arr.map((r) => ({ ...r }));
  rebuildOrderBookFromRows(rowData2.value);
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
      ""
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

/** 자재추가 팝업: 즐겨찾기(lngFavorites) 토글 시마다 API 호출 */
const checkedRowData2 = async (row) => {
  if (!row || typeof row !== "object") return;
  const stockId = getStockId(row);
  if (!stockId) return;
  const favRaw = getRowVal(row, "lngFavorites", "LngFavorites");
  const isFavoriteOn =
    favRaw === true ||
    favRaw === 1 ||
    favRaw === "1" ||
    String(favRaw).trim() === "1";
  /** 기존 로직 유지: 체크됨(true) → VALUE 0, 해제 → 1 */
  const value = isFavoriteOn ? 0 : 1;
  try {
    await saveFavoriteStockItemBypart(
      store.state.userData.lngStoreGroup,
      popupSessionStoreCd.value,
      stockId,
      value,
      scond4.value
    );
  } catch (_) {}
};

const selectedRowForPopup = ref(null);
const clickedRowData = (row) => {
  selectedRowForPopup.value = row && typeof row === "object" ? row : null;
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
  const rowIdx = row?.index;
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

const updatedrowdata4 = ref([]);
const updatedRowData4 = (e) => {
  updatedrowdata4.value = e.filter((item) => item.lngCheck == true);
  console.log(updatedrowdata4.value);
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
  try {
    const res = await getStockItemListWithFavorite(
      store.state.userData.lngStoreGroup,
      popupSessionStoreCd.value,
      scond4.value,
      mode,
      ""
    );
    updatedrowdata3.value = res.data.List;
    rowData3.value = res.data.List;
  } catch (error) {}
};

/** 자재추가 팝업에서 [추가]로 넣은 행 표시 — 즐겨찾기 재조회 시 선택 추가분만 목록 밖 행으로 유지 */
const isStockPickerPopupAddedRow = (row) =>
  row?.lngFromStockPickerAdd === 1 ||
  row?.lngFromStockPickerAdd === true ||
  row?.lngFromStockPickerAdd === "1";

/** 즐겨찾기만 서버 목록으로 새로 깔고, 입력수량 등은 같은 자재코드(prev)와 병합 */
function mergeFavoriteReloadWithExistingBottomRows(freshList, prevRows) {
  const prevBySid = {};
  for (const r of prevRows || []) {
    const sid = getStockId(r);
    if (sid) prevBySid[sid] = r;
  }
  const freshSids = new Set(
    (freshList || []).map((r) => getStockId(r)).filter(Boolean)
  );

  const out = (freshList || []).map((row) => {
    const sid = getStockId(row);
    const prev = sid ? prevBySid[sid] : null;
    if (!sid || !prev) return { ...row };
    const merged = {
      ...row,
      dblOrderQty: prev.dblOrderQty,
      curSupply: prev.curSupply,
      curTax: prev.curTax,
      curTotal: prev.curTotal,
      strOrderComments: prev.strOrderComments ?? row.strOrderComments,
      lngCheck: prev.lngCheck,
      ...(Object.prototype.hasOwnProperty.call(prev, "checkbox")
        ? { checkbox: prev.checkbox }
        : {}),
    };
    if (isStockPickerPopupAddedRow(prev)) merged.lngFromStockPickerAdd = 1;
    return merged;
  });

  /** 즐겨찾기 API에 없어진 줄은 버리되, 팝업 [추가]로만 넣은 품목은 계속 표시 */
  for (const r of prevRows || []) {
    const sid = getStockId(r);
    if (!sid || freshSids.has(sid)) continue;
    if (!isStockPickerPopupAddedRow(r)) continue;
    out.push({ ...r });
  }
  return out;
}

/** 하단 자재목록이 즐겨찾기일 때 자재추가 팝업 닫기 후 목록만 최신화 */
const reloadFavoriteListPreservingBottomRows = async () => {
  store.state.loading = true;
  try {
    const prevRows = rowData3.value || [];
    const res = await getStockItemListWithFavorite(
      store.state.userData.lngStoreGroup,
      popupSessionStoreCd.value,
      scond4.value,
      "2",
      ""
    );
    const freshList = res?.data?.List ?? [];
    const merged = mergeFavoriteReloadWithExistingBottomRows(freshList, prevRows);
    rowData3.value = merged;
    updatedrowdata3.value = merged.map((r) => ({ ...r }));
    await nextTick();
    updatedRowData3(merged);
  } catch (_) {
    /* noop */
  } finally {
    store.state.loading = false;
  }
};

const closeStockPickerPopup = async () => {
  openpopup2.value = false;
  if (isPopupToolbarLocked.value) return;
  if (isOrderDetailView.value) return;
  if (scond4.value === "0" || scond4.value === 0) return;
  if (String(scond7.value) !== "2") return;
  await reloadFavoriteListPreservingBottomRows();
};

/** 자재추가: 기존 하단 목록 유지 + 선택 품목만 추가(동일 자재는 건너뜀) */
const addButton2 = async () => {
  if (updatedrowdata4.value.length == 0) {
    Swal.fire({
      title: "경고",
      text: "추가하실 자재를 선택해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }

  const existing = [...(rowData3.value || [])];
  const existingSids = new Set(
    existing.map((r) => getStockId(r)).filter(Boolean)
  );
  const additions = [];
  for (const item of updatedrowdata4.value) {
    const sid = getStockId(item);
    if (!sid || existingSids.has(sid)) continue;
    existingSids.add(sid);
    additions.push({
      ...item,
      dblOrderQty: 0,
      curSupply: 0,
      lngCheck: "0",
      lngFromStockPickerAdd: 1,
    });
  }

  if (additions.length === 0) {
    await Swal.fire({
      title: "안내",
      text: "선택한 품목은 이미 자재목록에 있습니다.",
      icon: "info",
      confirmButtonText: "확인",
    });
    return;
  }

  rowData3.value = [...existing, ...additions];
  updatedrowdata3.value = rowData3.value.map((r) => ({ ...r }));
  await nextTick();
  updatedRowData3(rowData3.value);
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
    const merged = assignDefined(
      prevBook,
      stripBottomGridCheckFieldsForBookMerge(row)
    );

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
  for (const item of targetRows) {
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
      const supplierid = updatedrowdata2.value
        .map((item) => {
          const sid = getStockId(item);
          return (
            getSupplierIdFromRow(item) ||
            (sid ? newOrderSupplierByStockId.value[sid] : "") ||
            ""
          );
        })
        .join("\u200b");
      const stockids = updatedrowdata2.value
        .map((item) => item.lngStockID)
        .join("\u200b");
      const qty = updatedrowdata2.value
        .map((item) => item.dblOrderQty)
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
