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
      class="bg-white p-4 rounded-lg shadow-lg w-full h-full border border-black">
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
        <div class="flex items-center justify-end gap-3 px-2 py-1 border-b border-r border-black col-span-2">
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
      <div class="h-[35%] w-full mt-2">
        <Realgrid
          :progid="2"
          :progname="'PUR03_035INS_VUE'"
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
      <div class="flex justify-between items-center mt-2 border border-black bg-[#e8e4f0]">
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
      <div class="h-[35%] mt-2">
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
    class="fixed bottom-2 right-2 w-[52%] h-[85%] flex items-center justify-center bg-black/100 z-50">
    <div
      class="bg-white p-6 rounded-xl shadow-lg w-full h-full border border-black">
      <div class="flex justify-end space-x-2">
        <button class="whitebutton" @click="addButton2">추가</button>
        <button class="whitebutton" @click="openpopup2 = false">닫기</button>
      </div>
      <div class="grid grid-rows-2 grid-cols-[1fr,2fr,1fr,2fr]">
        <div
          class="bg-gray-100 text-base font-semibold flex justify-center items-center border-l border-t border-black">
          자재특성
        </div>
        <div
          class="border-l border-t border-black flex justify-center items-center">
          <select
            name=""
            id=""
            class="w-[80%] h-[80%] border border-black"
            @change="setSearchValue"
            v-model="sscond">
            <option value="-1">전체</option>
            <option :value="i.lngGenericID" v-for="i in optionList2">
              {{ i.strGenericName }}
            </option>
          </select>
        </div>
        <div
          class="bg-gray-100 text-base font-semibold flex justify-center items-center border-l border-t border-b border-black">
          거래처
        </div>
        <div class="border-l border-t border-r border-black">
          <BusinessClient
            :defaultName="''"
            :defaultNm="'전체'"
            @SupplierId="SupplierId3"
            :setDynamicClass="'!-mt-1 -ml-2 h-[80%] w-[80%]'"></BusinessClient>
        </div>
        <div
          class="bg-gray-100 text-base font-semibold flex justify-center items-center border-l border-t border-b border-black">
          자재코드/이름
        </div>
        <div
          class="flex border border-black col-span-3 space-x-3 items-center justify-start pl-6">
          <input
            type="text"
            class="w-[30%] h-[80%] border border-black"
            @input="searchWord"
            v-model="sscond2" />
        </div>
      </div>
      <div class="w-full h-[90%] mt-1">
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
          :searchColId="'lngStockID,strStockName'"
          :searchColId3="['lngGenericID', 'lngSupplierID']"
          :searchValue="searchValue"
          :rowData="rowData4"></Realgrid>
      </div>
    </div>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import { getStockGeneric } from "@/api/master";
import {
  deleteStockOrderItem,
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
 * @param {number} lngEventType 1:페이지로드 2:신규버튼 3:저장버튼 4:전표삭제버튼 5:자재제거버튼
 * @returns {boolean|undefined} type 2~5: true=허용, false=차단 / type 1: undefined
 */
const GetOrderTimeCheck = async (lngEventType) => {
  if (!storeCd.value || storeCd.value == 0) {
    orderTimeInfo.value = "";
    return lngEventType === 1 ? undefined : true;
  }
  try {
    const res = await getOrderTimeCheck(
      store.state.userData.lngStoreGroup,
      storeCd.value
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
/** 신규 발주: lngStockID 기준 주문 품목 (하단 그리드 emit이 검색·필터로 일부 행만 올 때 상단 주문 유실 방지) */
const orderBookByStock = ref({});
/** 상단 자재제거 후 하단 emit 한 번: 의도적으로 0으로 만든 품목만 버킷에서 삭제 허용 (오동작으로 전 행이 0으로 오는 경우 방지) */
const allowZeroFromBottomThisRound = ref(null);

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

/** 상단 그리드: 내장 체크바는 checkbox 필드, 파트 설정에 따라 lngCheck 도 사용 */
const isTopRowCheckedForRemove = (item) => {
  if (item == null || typeof item !== "object") return false;
  const cb = item.checkbox;
  if (cb === true || cb === 1 || cb === "1" || String(cb).trim() === "1")
    return true;
  const lc = item.lngCheck;
  if (lc === true || lc === 1 || lc === "1") return true;
  return false;
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
  for (const [k, v] of Object.entries(patch)) {
    if (v !== undefined) out[k] = v;
  }
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
};

/** 상단 orderBook 기준으로 하단 목록 발주수량·금액 재맞춤 (자재제거 후 그리드 참조 공유로 0만 보이는 현상 완화) */
const patchRowData3QtyFromOrderBook = () => {
  const book = orderBookByStock.value || {};
  rowData3.value = (rowData3.value || []).map((row) => {
    const sid = getStockId(row);
    const base = { ...row };
    if (!sid) return base;
    const br = book[sid];
    if (br != null && hasOrderQty(br)) {
      return {
        ...base,
        dblOrderQty: br.dblOrderQty,
        curSupply: br.curSupply,
        curTax: br.curTax,
        curTotal: br.curTotal,
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
const updatedRowData2 = (newValue) => {
  const arr = Array.isArray(newValue) ? newValue : [];
  updatedrowdata2.value = arr;
  rowData2.value = arr.map((r) => ({ ...r }));
  rebuildOrderBookFromRows(rowData2.value);
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
/** 동일 전표(GetstkOrderDetail) 품목별 검수수량 스냅샷 — 자재제거 가능 여부 판단용 */
const orderDetailCheckQtyByStockId = ref({});
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
  scond2.value = formatLocalDate(new Date());
  scond3.value = formatLocalDate(new Date().setDate(new Date().getDate() + 1));
  const closeDtmOk = await refreshOrderCloseDtmFromExpectedDate();
  if (!closeDtmOk) return;

  isOrderDetailView.value = false;
  orderDetailLngStatus.value = "";
  popupExtraStoreOption.value = null;
  orderDetailCheckQtyByStockId.value = {};
  orderBookByStock.value = {};
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

const checkedRowData2 = async (e) => {
  const res = await saveFavoriteStockItemBypart(
    store.state.userData.lngStoreGroup,
    popupSessionStoreCd.value,
    e[3],
    e[1] == true ? 0 : 1,
    scond4.value
  );
  console.log(res);
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
      for (const item of list) {
        const sid = String(item.lngStockID ?? item.LngStockID ?? "").trim();
        if (!sid) continue;
        const q = item.dblCheckQty ?? item.DblCheckQty;
        const n =
          typeof q === "number"
            ? q
            : Number(String(q ?? "").replaceAll(",", ""));
        m[sid] = Number.isNaN(n) ? 0 : n;
      }
      orderDetailCheckQtyByStockId.value = m;
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

/** 하단 자재목록(최근등록·즐겨찾기) — 잠금 시 미호출 */
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

  rowData3.value = updatedrowdata4.value.map((item) => ({
    ...item,
    dblOrderQty: 0,
    curSupply: 0,
    lngCheck: "0",
  }));
  openpopup2.value = false;
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
 * 하단 그리드 emit(e): orderBook 기준으로만 갱신 → 이번 emit에 없는 품목은 유지.
 * patch 에 undefined 가 오면 assignDefined 로 기존 수량 유지.
 * 버킷에 주문이 있는데 들어온 값만 0인 경우: 자재제거 직후(set된 allowZeroFromBottomThisRound)에만 버킷 삭제 허용.
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

    const merged = assignDefined(book[sid], row);

    if (!hasOrderQty(merged)) {
      const hadBookOrder = book[sid] != null && hasOrderQty(book[sid]);
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
  const mergedRows = Object.values(book).filter(hasOrderQty);
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
  const canDelete = await GetOrderTimeCheck(4);
  if (!canDelete) return;
  // TODO: 전표삭제 로직 구현
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
      text: "제거할 자재를 선택해 주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (isOrderDetailView.value) {
    const snap = orderDetailCheckQtyByStockId.value || {};
    const anyCheckQtyOnSlip = Object.values(snap).some((n) => Number(n) > 0);
    if (anyCheckQtyOnSlip) {
      alert("발주상태가 변경되어 삭제가 불가능합니다");
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
    const orderSeqJoined = checkedRows
      .map((item) =>
        String(
          item.lngOrderSeq != null && item.lngOrderSeq !== ""
            ? item.lngOrderSeq
            : popupSessionOrderSeq.value ?? ""
        )
      )
      .join(zw);
    const stockIds = checkedRows
      .map((item) => String(item.lngStockID ?? item.lngStockId ?? ""))
      .join(zw);
    const supplierIds = checkedRows
      .map((item) =>
        String(item.lngSupplierId ?? item.lngSupplierID ?? "")
      )
      .join(zw);

    store.state.loading = true;
    try {
      const res = await deleteStockOrderItem(
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
      const snapNext = { ...orderDetailCheckQtyByStockId.value };
      for (const id of removedIds) {
        delete snapNext[String(id)];
      }
      orderDetailCheckQtyByStockId.value = snapNext;
    } catch (_) {
      store.state.loading = false;
      await Swal.fire({
        title: "오류",
        text: "품목 삭제 중 오류가 발생하였습니다.",
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

  // lngSupplierId는 그리드 emit에서 누락되므로 원본 rowData2에서 lngStockID 기준으로 매핑
  const origMap = Object.fromEntries(
    (rowData2.value || []).map((r) => [String(r.lngStockID ?? ""), r])
  );

  const sourceRows = (updatedrowdata2.value?.length > 0)
    ? updatedrowdata2.value
    : rowData2.value;
  // lngStockID 기준 중복 제거
  const seen = new Set();
  const targetRows = sourceRows.filter((item) => {
    const key = String(item.lngStockID ?? "");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  let lastRes = null;
  for (const item of targetRows) {
    const orig = origMap[String(item.lngStockID ?? "")];
    const supplierId = orig?.lngSupplierId ?? item.lngSupplierId ?? "";
    const itemOrderSeq = String(orig?.lngOrderSeq ?? item.lngOrderSeq ?? orderSeq);
    lastRes = await updateOrderStockDetail(
      store.state.userData.lngStoreGroup,
      popupSessionStoreCd.value,
      orderNo,
      itemOrderSeq,
      supplierId,
      String(item.lngStockID ?? ""),
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
        .map((item) => item.lngSupplierId ?? item.lngSupplierID ?? "")
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

watch(scond3, () => {
  void refreshOrderCloseDtmFromExpectedDate(false);
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
  orderDetailCheckQtyByStockId.value = {};
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
