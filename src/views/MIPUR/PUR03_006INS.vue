<!-- /*--############################################################################
# Filename : PUR03_006INS.vue                                                  
# Description : 마스터관리 > 발주 관리 > 발주 등록Ⅱ(발주일기준)                     
# Date :2025-08-25                                                           
  # Author : 권맑음                     
################################################################################*/ -->
<template>
  <!-- 조회조건 -->
  <div class="br12 po-page">
    <div class="pd24 flex-between sub-header">
      <PageName></PageName>
      <div class="flex justify-center space-x-2 pr-5">
        <!-- <button @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <button @click="saveButton" class="button save w-auto">저장</button>
        <button @click="excelButton" class="button excel w-auto">엑셀</button> -->
      </div>
    </div>

    <div class="page-scroll pd24 pt0 flex min-h-0 flex-1 flex-col">
      <div
        class="pur306-search-panel shrink-0"
        :style="{
          '--pur306-control-border': pur306ControlBorder,
          '--pur306-label-col': pur306LabelCol,
          '--pur306-item-gap': pur306ItemGap,
          '--pur306-col-gap': pur306ColGap,
          '--pur306-row-gap': pur306RowGap,
          '--pur306-pair-gap': pur306PairGap,
        }">
        <div class="pur306-search-grid min-w-0">
          <div class="pur306-block pur306-block--order min-w-0">
            <div class="pur306-row pur306-row--order1 min-w-0">
              <div class="pur306-sg-label pur306-req">매장</div>
              <div
                class="pur306-cell-field pur306-pick-slot pur306-pick-slot--store-grid min-w-0">
                <PickStore
                  compact-search-bar
                  :compact-store-combo-max-rem="pur306PickStoreComboMaxRem"
                  main-name=""
                  @update:storeGroup="handleStoreGroup"
                  @update:storeCd="handleStoreCd"
                  @storeNm="handlestoreNm"
                  :defaultStoreNm="'선택'"
                  :defaultStoreType2="true"
                  :defaultStore="true" />
              </div>
              <div class="pur306-sg-label pur306-req pur306-sg-label--danger">
                발주일자
              </div>
              <div class="pur306-cell-field pur306-inline-field pur306-date-field min-w-0">
                <input
                  type="date"
                  class="pur306-sg-input pur306-sg-input--date"
                  v-model="cond"
                  @change="searchButton" />
                <button type="button" class="pur306-sub-btn" @click="searchButton">
                  발주조회
                </button>
              </div>
            </div>

            <div class="pur306-row pur306-row--order2 min-w-0">
              <div class="pur306-sg-label pur306-sg-label--danger">발주마감일시</div>
              <div class="pur306-cell-field pur306-deadline-field min-w-0">
                <input
                  type="text"
                  class="pur306-sg-input pur306-sg-input--danger pur306-sg-input--deadline"
                  v-model="cond2"
                  disabled />
              </div>
              <div class="pur306-order2-tail min-w-0">
                <div class="pur306-sg-label">코멘트(발주)</div>
                <div class="pur306-cell-field min-w-0">
                  <input type="text" class="pur306-sg-input" v-model="cond3" />
                </div>
              </div>
            </div>

            <div class="pur306-row pur306-row--order3 min-w-0">
              <div class="pur306-sg-label">공급가</div>
              <div class="pur306-cell-field min-w-0">
                <input type="text" class="pur306-sg-input" v-model="cond4" disabled />
              </div>
              <div class="pur306-sg-label">부가세</div>
              <div class="pur306-cell-field min-w-0">
                <input type="text" class="pur306-sg-input" v-model="cond5" disabled />
              </div>
              <div class="pur306-sg-label">합계</div>
              <div class="pur306-cell-field min-w-0">
                <input type="text" class="pur306-sg-input" v-model="cond6" disabled />
              </div>
            </div>
          </div>

          <div class="pur306-block pur306-block--mat min-w-0">
            <div class="pur306-row pur306-row--mat1 min-w-0">
              <div class="pur306-sg-label pur306-req">자재목록</div>
              <div class="pur306-cell-field min-w-0">
                <select class="pur306-sg-select" v-model="cond7">
                  <option value="0">전체</option>
                  <option :value="i.strDCode" v-for="i in optionList" :key="i.strDCode">
                    {{ i.strDName }}
                  </option>
                </select>
              </div>
              <div class="pur306-sg-label">거래처</div>
              <div class="pur306-cell-field pur306-bc-slot min-w-0">
                <BusinessClient2
                  compact-search-bar
                  :default-nm="'전체'"
                  @SupplierId="SupplierId" />
              </div>
              <div class="pur306-sg-label">자재분류</div>
              <div class="pur306-cell-field min-w-0">
                <select class="pur306-sg-select" v-model="cond9">
                  <option value="0">전체</option>
                  <option
                    :value="i.lngCategoryID"
                    v-for="i in optionList3"
                    :key="i.lngCategoryID">
                    {{ i.strCategoryName }}
                  </option>
                </select>
              </div>
              <div class="pur306-sg-label">자재그룹</div>
              <div class="pur306-cell-field min-w-0">
                <select class="pur306-sg-select" v-model="cond10">
                  <option value="0">전체</option>
                  <option
                    :value="i.lngStockGroupID"
                    v-for="i in optionList4"
                    :key="i.lngStockGroupID">
                    {{ i.strStockGroupName }}
                  </option>
                </select>
              </div>
            </div>

            <div class="pur306-row pur306-row--mat2 min-w-0">
              <div class="pur306-sg-label">자재특성</div>
              <div class="pur306-cell-field min-w-0">
                <select class="pur306-sg-select" v-model="cond11">
                  <option value="0">전체</option>
                  <option
                    :value="i.lngGenericID"
                    v-for="i in optionList5"
                    :key="i.lngGenericID">
                    {{ i.strGenericName }}
                  </option>
                </select>
              </div>
              <div class="pur306-mat2-code-pair min-w-0">
                <div class="pur306-sg-label">자재코드/명</div>
                <div class="pur306-cell-field pur306-inline-field pur306-mat-code-field min-w-0">
                  <input
                    type="text"
                    class="pur306-sg-input pur306-sg-input--code"
                    v-model="cond12" />
                  <input
                    type="text"
                    class="pur306-sg-input pur306-sg-input--name"
                    v-model="cond13" />
                  <button type="button" class="pur306-sub-btn" @click="searchButton2">
                    조회
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 그리드 영역 -->
      <div
        class="pur306-grid-layout mt-1 grid min-h-0 min-w-0 flex-1 grid-cols-[12fr,1fr,12fr] grid-rows-1 justify-center">
      <div class="mt-0 flex min-h-0 min-w-0 flex-col">
        <div class="pur306-grid-bar flex shrink-0 justify-between bg-yellow-100">
          <div class="text-base font-semibold">검색 자재</div>
          <div class="pur306-grid-actions">
            <button type="button" class="pur306-sub-btn pur306-sub-btn--grid" @click="addButton">추가</button>
            <button type="button" class="pur306-sub-btn pur306-sub-btn--grid" @click="excelButton">
              엑셀
            </button>
          </div>
        </div>
        <Realgrid
          class="pur306-grid-body min-h-0 w-full flex-1"
          :progname="'PUR03_006INS_VUE'"
          :progid="1"
          :rowData="rowData"
          @updatedRowData="updatedRowData"
          @sendRowState="sendRowState"
          @clickedRowData="clickedRowData"
          @allStateRows="allStateRows"
          @clickedButtonCol="clickedButtonCol"
          @checkAllorNot="checkAllorNot"
          :cellEditthenCheck="true"
          :exporttoExcel="exporttoExcel"
          :documentTitle="'PUR03_006INS'"
          :documentSubTitle="documentSubTitle"
          :editableColId="'dblOrderQty,strOrderComments'"
          :rowStateeditable="false"
          :checkRowAuto="false"
          :checkRowAuto2="true"
          :checkRenderEditable="true"
          :selectionStyle="'block'"
          :CalculateTaxColId="'curTax'"
          :CalculateTaxColId2="'curSupply'"
          :CalculateTaxColId3="'curTotal'"
          :inputOnlyNumberColumn="'dblOrderQty'" />
      </div>
      <div class="pur306-grid-transfer">
        <button
          type="button"
          class="pur306-transfer-btn"
          title="발주 자재로 추가"
          aria-label="발주 자재로 추가"
          @click="addButton">
          <svg class="pur306-transfer-icon" viewBox="0 0 640 640" aria-hidden="true">
            <path
              fill="currentColor"
              d="M566.6 342.6C579.1 330.1 579.1 309.8 566.6 297.3L406.6 137.3C394.1 124.8 373.8 124.8 361.3 137.3C348.8 149.8 348.8 170.1 361.3 182.6L466.7 288L96 288C78.3 288 64 302.3 64 320C64 337.7 78.3 352 96 352L466.7 352L361.3 457.4C348.8 469.9 348.8 490.2 361.3 502.7C373.8 515.2 394.1 515.2 406.6 502.7L566.6 342.7z" />
          </svg>
        </button>
        <button
          type="button"
          class="pur306-transfer-btn"
          title="검색 자재로 되돌리기"
          aria-label="검색 자재로 되돌리기"
          @click="deleteButton">
          <svg class="pur306-transfer-icon" viewBox="0 0 640 640" aria-hidden="true">
            <path
              fill="currentColor"
              d="M73.4 297.4C60.9 309.9 60.9 330.2 73.4 342.7L233.4 502.7C245.9 515.2 266.2 515.2 278.7 502.7C291.2 490.2 291.2 469.9 278.7 457.4L173.3 352L544 352C561.7 352 576 337.7 576 320C576 302.3 561.7 288 544 288L173.3 288L278.7 182.6C291.2 170.1 291.2 149.8 278.7 137.3C266.2 124.8 245.9 124.8 233.4 137.3L73.4 297.3z" />
          </svg>
        </button>
      </div>
      <div class="mt-0 flex min-h-0 min-w-0 flex-col">
        <div class="pur306-grid-bar flex shrink-0 justify-between bg-yellow-100">
          <div class="text-base font-semibold">발주 자재</div>
          <div class="pur306-grid-actions">
            <button type="button" class="pur306-sub-btn pur306-sub-btn--grid" @click="deleteButton">
              삭제
            </button>
            <button type="button" class="pur306-sub-btn pur306-sub-btn--grid" @click="saveButton">저장</button>
            <button type="button" class="pur306-sub-btn pur306-sub-btn--grid" @click="excelButton2">
              엑셀
            </button>
          </div>
        </div>
        <Realgrid
          class="pur306-grid-body min-h-0 w-full flex-1"
          :progname="'PUR03_006INS_VUE'"
          :progid="2"
          :rowData="rowData2"
          @updatedRowData="updatedRowData2"
          @clickedRowData="clickedRowData2"
          @allStateRows="allStateRows2"
          :exporttoExcel="exporttoExcel2"
          :documentTitle="'PUR03_006INS'"
          :documentSubTitle="documentSubTitle"
          :editableColId="'dblOrderQty,strOrderComments'"
          :rowStateeditable="false"
          :checkRenderEditable="true"
          :selectionStyle="'block'"
          :setFooter="true"
          :notsoftDelete="true"
          :checkRowAuto="false"
          :checkRowAuto2="true"
          :CalculateTaxColId="'curTax'"
          :CalculateTaxColId2="'curSupply'"
          :CalculateTaxColId3="'curTotal'"
          :deleteRow7="deleteRow7"
          :addRow4="addRow4"
          :addrowProp="'lngStockID,strStockName,strStandardName,strUnitName,curUnitPrice,dblOrderQty,curSupply,curTax,curTotal,strOrderComments,strGenericName,strSupplierName,dtmExpectedDate,lngStoreGroup,lngStoreCode,strOrderNo,lngOrderSeq,lngSupplierID,dblCheckQty,strStatus,strDemandNo,strCheckComments,lngGenericID,lngOrderAble,lngTaxType,dtmOrderDate'"
          :addrowDefault="addrowDefault"
          :inputOnlyNumberColumn="'dblOrderQty'" />
      </div>
    </div>
    </div>
  </div>
</template>

<script setup>
import { getCommonList } from "@/api/common";
import {
  getStockCategory,
  getStockGeneric,
  getStockGroup,
  saveStockCycle2,
} from "@/api/master";
import {
  deleteStockOrderItem,
  getOrderDataByDate,
  getOrderDate,
  getStockItemList3,
  getSubSequence,
  saveFavoriteStockItem,
  saveNewOrderTmp,
  saveNewOrderTmp2,
  updateOrderTmp,
} from "@/api/mipur";
import BusinessClient2 from "@/components/businessClient2.vue";
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

import {
  formatLocalDate,
  formatNumberWithCommas,
  insertPageLog,
} from "@/customFunc/customFunc";
/**
 *  경고창 호출 라이브러리
 *  */

import Swal from "sweetalert2";
/*
 * 공통 표준  Function
 */

import { nextTick, onMounted, ref } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";

/** 조회 AREA — wire 그리드 (PUR02/STKN06 패턴) */
const pur306ControlBorder = "#cbd5e1";
const pur306LabelCol = "5.5rem";
const pur306ItemGap = "0.375rem";
const pur306ColGap = "1.25rem";
const pur306RowGap = "0.375rem";
const pur306PairGap = "0.25rem";
const pur306PickStoreComboMaxRem = 14;

/**
 * 	화면 Load시 실행 스크립트
 */

const hidesub = ref(true);
const hideAttr = ref(true);
const cond = ref("");
const cond2 = ref("");

const optionList = ref([]);
const cond7 = ref("0");
const cond9 = ref("0");
const cond10 = ref("0");
const cond11 = ref("0");
const cond12 = ref("");
const cond13 = ref("");
const optionList2 = ref([]);
const optionList3 = ref([]);
const optionList4 = ref([]);
const optionList5 = ref([]);
onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
  const today = new Date();
  today.setDate(today.getDate() + 1);
  cond.value = formatLocalDate(today);
  const res = await getOrderDate(
    groupCd.value,
    store.state.userData.lngPosition,
    cond.value.replaceAll("-", ""),
    0
  );

  ////console.log(res);

  cond.value =
    res.data.List[0].dtmOrderDate.slice(0, 4) +
    "-" +
    res.data.List[0].dtmOrderDate.slice(4, 6) +
    "-" +
    res.data.List[0].dtmOrderDate.slice(6, 8);

  cond2.value =
    res.data.List[0].dtmOrderCloseTime == ""
      ? cond.value + " 12:00"
      : res.data.List[0].dtmOrderCloseTime.slice(0, 4) +
        "-" +
        res.data.List[0].dtmOrderCloseTime.slice(4, 6) +
        "-" +
        res.data.List[0].dtmOrderCloseTime.slice(6, 8) +
        " " +
        res.data.List[0].dtmOrderCloseTime.slice(8, 10) +
        ":" +
        res.data.List[0].dtmOrderCloseTime.slice(10, 12);

  const res2 = await getCommonList(242);

  optionList.value = res2.data.List;

  const res3 = await getStockCategory(store.state.userData.lngStoreGroup);

  optionList3.value = res3.data.List;

  const res4 = await getStockGroup(store.state.userData.lngStoreGroup);

  optionList4.value = res4.data.List;

  const res5 = await getStockGeneric(store.state.userData.lngStoreGroup);

  optionList5.value = res5.data.List;
});

const nowStoreAreaCd = ref();
const nowStoreCd = ref(0);
/**
 * 선택한 포스 번호 호출 함수
 */

/**
 *  그리드 검색어 세팅
 */

const clickedStoreNm = ref();
const commitAll = ref(false);
const store = useStore();
const userData = store.state.userData;
const groupCd = ref("");
const cond3 = ref("");
const cond4 = ref("");
const cond5 = ref("");
const cond6 = ref("");

/**
 * 페이지 매장 코드 세팅
 */
const selectedSupplier = ref("");
const SupplierId = (e) => {
  selectedSupplier.value = e;
  // ///console.log(e);
};
const handleStoreGroup = (e) => {
  groupCd.value = e;
};
const first = ref(false);
const handleStoreCd = async (newValue) => {
  //   if (newValue == "0" && store.state.userData.lngCommonMenu == "0") {
  //     afterSearch.value = false;
  //   }
  initAll();
  nowStoreCd.value = newValue;

  const res = await getOrderDate(
    groupCd.value,
    nowStoreCd.value,
    cond.value.replaceAll("-", ""),
    1
  );
  // console.log(res);
  cond2.value =
    res.data.List[0].dtmOrderCloseTime == ""
      ? cond.value + " 12:00"
      : res.data.List[0].dtmOrderCloseTime.slice(0, 4) +
        "-" +
        res.data.List[0].dtmOrderCloseTime.slice(4, 6) +
        "-" +
        res.data.List[0].dtmOrderCloseTime.slice(6, 8) +
        " " +
        res.data.List[0].dtmOrderCloseTime.slice(8, 10) +
        ":" +
        res.data.List[0].dtmOrderCloseTime.slice(10, 12);
  //searchButton();
};

const checkAllorNot = async (e, e2) => {
  // //console.log(e);
  // //console.log(e2);
  const stockids = updatedrowdata.value
    .map((item) => item.lngStockID)
    .join("\u200b");
  if (e2 == "lngCheckFovorites") {
    try {
      const res = await saveFavoriteStockItem(
        store.state.userData.lngStoreGroup,
        store.state.userData.lngPosition,
        stockids,
        e == true ? 1 : 0
      );

      // //console.log(res);
    } catch (error) {}
  }
};
/**
 * 페이지 매장명 세팅
 */

const handlestoreNm = (newData) => {
  clickedStoreNm.value = newData;
};

/**
 * 조회 상태 초기화
 */

/**
 * 조회 초기화
 */

const allstaterows = ref([]);
const allstaterows2 = ref([]);
const confirmData2 = ref();
const rowData = ref([]);
const rowData2 = ref([]);

const allStateRows = (e) => {
  //console.log(e);
  allstaterows.value = e.updated;
};
const allStateRows2 = (e) => {
  //console.log(e);
  allstaterows2.value = e;
};
/**
 *  조회 함수
 */

const searchButton = async () => {
  const res2 = await getOrderDate(
    groupCd.value,
    nowStoreCd.value,
    cond.value.replaceAll("-", ""),
    1
  );

  cond2.value =
    res2.data.List[0].dtmOrderCloseTime == ""
      ? cond.value + " 12:00"
      : res2.data.List[0].dtmOrderCloseTime.slice(0, 4) +
        "-" +
        res2.data.List[0].dtmOrderCloseTime.slice(4, 6) +
        "-" +
        res2.data.List[0].dtmOrderCloseTime.slice(6, 8) +
        " " +
        res2.data.List[0].dtmOrderCloseTime.slice(8, 10) +
        ":" +
        res2.data.List[0].dtmOrderCloseTime.slice(10, 12);

  if (first.value == false) {
    first.value = true;
    return;
  }
  if (nowStoreCd.value == 0) {
    Swal.fire({
      title: "경고",
      text: "매장을 선택해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }
  const res = await getOrderDate(
    groupCd.value,
    nowStoreCd.value,
    cond.value.replaceAll("-", ""),
    1
  );

  if (res.data.List[0].strMsg == 9) {
    Swal.fire({
      title: "경고",
      text: "본사에 발주마감 시간 설정을 확인 해 주십시오.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }

  try {
    const res = await getOrderDataByDate(
      groupCd.value,
      nowStoreCd.value,
      cond.value.replaceAll("-", "")
    );
    //console.log(res);
    rowData2.value = res.data.List;
    updatedrowdata2.value = res.data.List;
    cond3.value = res.data.List2[0].strMComments;

    cond4.value = rowData2.value.reduce((sum, item) => {
      return sum + parseInt(item.curSupply || 0, 10);
    }, 0);
    cond4.value = formatNumberWithCommas(cond4.value);
    cond5.value = rowData2.value.reduce((sum, item) => {
      return sum + parseInt(item.curTax || 0, 10);
    }, 0);
    cond5.value = formatNumberWithCommas(cond5.value);
    cond6.value = rowData2.value.reduce((sum, item) => {
      return sum + parseInt(item.curTotal || 0, 10);
    }, 0);

    cond6.value = formatNumberWithCommas(cond6.value);
  } catch (error) {
    console.log(error);
  }
};

const searchButton2 = async () => {
  if (nowStoreCd.value == 0) {
    Swal.fire({
      title: "경고",
      text: "매장을 선택해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }
  // const res = await getOrderDate(
  //   groupCd.value,
  //   nowStoreCd.value,
  //   cond.value.replaceAll("-", ""),
  //   1
  // );

  // if (res.data.List[0].strMsg == 9) {
  //   Swal.fire({
  //     title: "경고",
  //     text: "본사에 발주마감 시간 설정을 확인 해 주십시오.",
  //     icon: "warning",

  //     confirmButtonText: "확인",
  //   });
  //   return;
  // }

  try {
    store.state.loading = true;
    const res = await getStockItemList3(
      groupCd.value,
      nowStoreCd.value,
      store.state.userData.lngPosition,
      cond.value.replaceAll("-", ""),
      cond7.value,
      selectedSupplier.value,
      cond9.value,
      cond10.value,
      cond11.value,
      cond12.value,
      cond13.value
    );
    store.state.loading = false;
    //console.log(res);
    rowData.value = res.data.List;
  } catch (error) {
    //console.log(error);
  }
};

/**
 * 데이터셋 상세정보 셋팅
 */

const clickFirst = ref(false);
const clickedButtonCol = async (e) => {
  if (e == "lngCheckFovorites") {
    try {
      const res = await saveFavoriteStockItem(
        store.state.userData.lngStoreGroup,
        store.state.userData.lngPosition,
        saveFavoriteId.value,
        saveFavoriteValue.value == true ? 1 : 0
      );

      //console.log(res);
    } catch (error) {}
  }
};
const saveFavoriteGroup = ref("");
const saveFavoriteStore = ref("");
const saveFavoriteId = ref("");
const saveFavoriteValue = ref("");
const clickedRowData = async (newValue) => {
  console.log(newValue);

  saveFavoriteGroup.value = newValue[15];
  saveFavoriteStore.value = newValue[16];
  saveFavoriteId.value = newValue[2];
  saveFavoriteValue.value = newValue[1];
  // try {
  //   const res =await saveFavoriteStockItem(newValue[15] , newValue[16] , )
  // } catch (error) {

  // }
};
/**
 * 데이터셋 상세정보 셋팅
 */

/**
 * 입력창 수정 데이터 갱신
 */

const updatedrowdata = ref([]);
const updatedrowdata2 = ref([]);
/**

/**
 * 입력창 수정 데이터 갱신
 */
const rowstate = ref("");
const updatedRowData = (newValue) => {
  updatedrowdata.value = newValue;
};

const sendRowState = (e) => {
  rowstate.value = e;
};
const updatedRowData2 = (newValue) => {
  //console.log(newValue);
  updatedrowdata2.value = newValue;
};
const deleterow = ref(false);
const deleterow2 = ref(false);
/**
 * 그리드 행 삭제 버튼 함수
 */

const deleteRow2 = () => {
  deleterow2.value = !deleterow2.value;
};

/**
 * 그리드 행 삭제 버튼 함수
 */

/**
 *  저장 버튼 함수
 */

const saveButton = async () => {
  const filteredLen = updatedrowdata2.value.filter(
    (item) => item.dblOrderQty == 0
  ).length;

  ////console.log(updatedrowdata2.value);
  if (filteredLen > 0) {
    Swal.fire({
      title: "경고",
      text: "발주수량은 0보다 커야합니다.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }

  if (allstaterows2.value.created == 0 && allstaterows2.value.updated == 0) {
    Swal.fire({
      title: "경고",
      text: "변경된 사항이 존재하지 않습니다. 확인해주세요.",
      icon: "warning", // 'success', 'error', 'warning', 'info', 'question'

      confirmButtonText: "확인",
    });
    return;
  }

  try {
    const res = await getOrderDate(
      groupCd.value,
      nowStoreCd.value,
      cond.value.replaceAll("-", ""),
      2
    );
    //console.log(res);
    if (res.data.List[0].strMsg == "1") {
      Swal.fire({
        title: "실패",
        text: "해당 발주일자는 마감 되었습니다. 다른 발주일자로 변경해 주십시오.",
        icon: "error", // 'success', 'error', 'warning', 'info', 'question'

        confirmButtonText: "확인",
      });
      return;
    } else if (res.data.List[0].strMsg !== "0") {
      Swal.fire({
        title: "실패",
        text: "발주등록 오류. 피앤시월드에 문의해 주십시오.",
        icon: "error", // 'success', 'error', 'warning', 'info', 'question'

        confirmButtonText: "확인",
      });
      return;
    } else {
      // return;
    }

    // if(res.data)
  } catch (error) {
    //console.log(error);
  }
  try {
    await Swal.fire({
      title: "확인",
      text: "저장하시겠습니까?",
      icon: "question", // 'success', 'error', 'warning', 'info', 'question'
      showCancelButton: true, // 취소 버튼 표시
      confirmButtonText: "확인",
      cancelButtonText: "취소",
    }).then(async (result) => {
      if (result.isConfirmed) {
        store.state.loading = true;
        let result = 0;
        const res2 = await getSubSequence(
          store.state.userData.lngSequence,
          groupCd.value,
          nowStoreCd.value,
          cond.value.replaceAll("-", "")
        );

        const subsequence = res2.data.List[0].lngSubSequence;
        //console.log(subsequence);

        if (allstaterows2.value.created.length > 0) {
          const groupcds = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.created.includes(index))
            .map((item) => item.lngStoreGroup)
            .join("\u200b");
          const storecds = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.created.includes(index))
            .map((item) => item.lngStoreCode)
            .join("\u200b");
          const stockids = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.created.includes(index))
            .map((item) => item.lngStockID)
            .join("\u200b");
          const expecteddates = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.created.includes(index))
            .map((item) => item.dtmExpectedDate)
            .join("\u200b");
          const orderdates = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.created.includes(index))
            .map((item) => item.dtmOrderDate)
            .join("\u200b");
          const supplierids = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.created.includes(index))
            .map((item) => item.lngSupplierID)
            .join("\u200b");
          const orderqtys = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.created.includes(index))
            .map((item) => item.dblOrderQty)
            .join("\u200b");
          const curunitprices = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.created.includes(index))
            .map((item) => item.curUnitPrice)
            .join("\u200b");
          const cursupplys = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.created.includes(index))
            .map((item) => item.curSupply)
            .join("\u200b");

          const curtaxs = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.created.includes(index))
            .map((item) => item.curTax)
            .join("\u200b");

          const comments = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.created.includes(index))
            .map((item) => item.strOrderComments)
            .join("\u200b");

          const res = await saveNewOrderTmp(
            groupcds,
            storecds,
            store.state.userData.lngSequence,
            subsequence,
            stockids,
            expecteddates,
            orderdates,
            supplierids,
            orderqtys,
            curunitprices,
            cursupplys,
            curtaxs,
            comments
          );
          //console.log(res); // 애매 ?
          const res2 = await saveNewOrderTmp2(
            groupCd.value,
            nowStoreCd.value,
            store.state.userData.lngSequence,
            subsequence,
            cond.value.replaceAll("-", ""),
            cond3.value
          );
          //console.log(res2);

          if (res2.data.RESULT_CD == "00") {
            result += 1;
          }
        }

        if (allstaterows2.value.updated.length > 0) {
          const groupcds = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.updated.includes(index))
            .map((item) => item.lngStoreGroup)
            .join("\u200b");
          const storecds = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.updated.includes(index))
            .map((item) => item.lngStoreCode)
            .join("\u200b");
          const orderNos = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.updated.includes(index))
            .map((item) => item.strOrderNo)
            .join("\u200b");
          const orderseqs = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.updated.includes(index))
            .map((item) => item.lngOrderSeq)
            .join("\u200b");
          const supplierids = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.updated.includes(index))
            .map((item) => item.lngSupplierID)
            .join("\u200b");

          const stockids = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.updated.includes(index))
            .map((item) => item.lngStockID)
            .join("\u200b");
          const dblorderqty = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.updated.includes(index))
            .map((item) => item.dblOrderQty)
            .join("\u200b");
          const cursupplys = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.updated.includes(index))
            .map((item) => item.curSupply)
            .join("\u200b");

          const curtaxs = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.updated.includes(index))
            .map((item) => item.curTax)
            .join("\u200b");

          const curtotals = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.updated.includes(index))
            .map((item) => item.curTotal)
            .join("\u200b");

          const comments1 = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.updated.includes(index))
            .map((item) => item.strCheckComments)
            .join("\u200b");

          const comments2 = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.updated.includes(index))
            .map((item) => item.strOrderComments)
            .join("\u200b");

          const res = await updateOrderTmp(
            groupcds,
            storecds,
            orderNos,
            orderseqs,
            supplierids,
            stockids,
            dblorderqty,
            cursupplys,
            curtaxs,
            comments1,
            comments2,
            store.state.userData.lngSequence
          );
          //console.log(res); // 애매 ?
          if (res.data.RESULT_CD == "00") {
            result += 1;
          }
        }

        // //console.log(result);
        // //console.log(allstaterows2.value);
        if (
          allstaterows2.value.updated.length > 0 &&
          allstaterows2.value.created.length > 0 &&
          result == 2
        ) {
          Swal.fire({
            title: "성공",
            text: "저장을 완료하였습니다.",
            icon: "success",

            confirmButtonText: "확인",
          });
        } else if (
          allstaterows2.value.updated.length > 0 &&
          allstaterows2.value.created.length == 0 &&
          result == 1
        ) {
          Swal.fire({
            title: "성공",
            text: "저장을 완료하였습니다.",
            icon: "success",

            confirmButtonText: "확인",
          });
        } else if (
          allstaterows2.value.updated.length == 0 &&
          allstaterows2.value.created.length > 0 &&
          result == 1
        ) {
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
        store.state.loading = false;

        searchButton();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // 취소 눌렀을 때 실행할 코드
        ////console.log("취소 버튼 클릭됨");
      }
    });
  } catch (error) {
    //console.log(error);
  } finally {
  }
};
const exporttoExcel = ref(false);
const exporttoExcel2 = ref(false);
/**
 * 엑셀 내보내기 함수
 */
const documentSubTitle = ref("");
const excelButton = () => {
  documentSubTitle.value =
    "매장명 :" + clickedStoreNm.value + "\n" + "발주일자 : " + cond.value;

  exporttoExcel.value = !exporttoExcel.value;
};

const excelButton2 = () => {
  documentSubTitle.value =
    "매장명 :" + clickedStoreNm.value + "\n" + "발주일자 : " + cond.value;

  exporttoExcel2.value = !exporttoExcel2.value;
};

const addrowDefault = ref("");
const addRow4 = ref(false);
const addButton = async () => {
  const set1 = new Set(
    updatedrowdata.value
      .filter((item) => item.lngCheck == true)
      .map((item) => item.lngStockID)
  );

  const hasDupli = updatedrowdata2.value.some((item) =>
    set1.has(item.lngStockID)
  );

  if (hasDupli == true) {
    Swal.fire({
      title: "경고",
      text: "중복된 자재코드가 존재합니다. 확인해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }
  //console.log(updatedrowdata.value);
  updatedrowdata.value = updatedrowdata.value
    .filter((item) => item.lngCheck == true)
    .map((item) => ({
      ...item,
      lngCheck: false,
      dtmOrderDate: cond.value.replaceAll("-", ""),
    }));

  for (let i = 0; i < updatedrowdata.value.length; i++) {
    addrowDefault.value =
      updatedrowdata.value[i].lngStockID +
      "," +
      updatedrowdata.value[i].strStockName +
      "," +
      updatedrowdata.value[i].strStandardName +
      "," +
      updatedrowdata.value[i].strUnitName +
      "," +
      updatedrowdata.value[i].curUnitPrice +
      "," +
      updatedrowdata.value[i].dblOrderQty +
      "," +
      updatedrowdata.value[i].curSupply +
      "," +
      updatedrowdata.value[i].curTax +
      "," +
      updatedrowdata.value[i].curTotal +
      "," +
      updatedrowdata.value[i].strOrderComments +
      "," +
      updatedrowdata.value[i].strGenericName +
      "," +
      updatedrowdata.value[i].strSupplierName +
      "," +
      formatLocalDate(updatedrowdata.value[i].dtmExpectedDate).replaceAll(
        "-",
        ""
      ) +
      "," +
      updatedrowdata.value[i].lngStoreGroup +
      "," +
      updatedrowdata.value[i].lngStoreCode +
      "," +
      updatedrowdata.value[i].strOrderNo +
      "," +
      updatedrowdata.value[i].lngOrderSeq +
      "," +
      updatedrowdata.value[i].lngSupplierID +
      "," +
      updatedrowdata.value[i].dblCheckQty +
      "," +
      updatedrowdata.value[i].strStatus +
      "," +
      updatedrowdata.value[i].strDemandNo +
      "," +
      updatedrowdata.value[i].strCheckComments +
      "," +
      updatedrowdata.value[i].lngGenericID +
      "," +
      updatedrowdata.value[i].lngOrderAble +
      "," +
      updatedrowdata.value[i].lngTaxType +
      "," +
      updatedrowdata.value[i].dtmOrderDate;

    //console.log(addrowDefault.value);
    addRow4.value = !addRow4.value;

    await nextTick();
  }

  // rowData2.value = rowData2.value.concat(updatedrowdata.value);

  // updatedrowdata2.value = JSON.parse(JSON.stringify(rowData2.value));
  rowData.value = rowData.value.map((item) => ({
    ...item,
    lngCheck: false,
  }));
};

const deleteRow7 = ref(false);
const deleteButton = async () => {
  //console.log(updatedrowdata2.value);

  const checkedRows = updatedrowdata2.value.filter(
    (item) => item.lngCheck == true
  );

  if (checkedRows.length == 0) {
    Swal.fire({
      title: "경고",
      text: "삭제할 품목이 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  Swal.fire({
    title: "경고",
    text: "정말 삭제하시겠습니까?",
    icon: "warning",
    confirmButtonText: "확인",
    cancelButtonText: "취소",
    showCancelButton: true,
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        store.state.loading = true;

        const groupcds = checkedRows
          .map((item) => item.lngStoreGroup)
          .join("\u200b");
        const storecds = checkedRows
          .map((item) => item.lngStoreCode)
          .join("\u200b");
        const ordernos = checkedRows
          .map((item) => item.strOrderNo)
          .join("\u200b");
        const orderseqs = checkedRows
          .map((item) => item.lngOrderSeq)
          .join("\u200b");
        const stockids = checkedRows
          .map((item) => item.lngStockID)
          .join("\u200b");
        const supplierids = checkedRows
          .map((item) => item.lngSupplierID)
          .join("\u200b");

        const res = await deleteStockOrderItem(
          groupcds,
          storecds,
          ordernos,
          orderseqs,
          stockids,
          supplierids,
          store.state.userData.lngSequence
        );

        //console.log(res);
        store.state.loading = false;

        deleteRow7.value = !deleteRow7.value;

        if (res.data.RESULT_CD == "00") {
          Swal.fire({
            title: "삭제 성공",
            text: "선택 하신 사항이 삭제되었습니다.",
            icon: "success",
            confirmButtonText: "확인",
          });
        } else {
          Swal.fire({
            title: "삭제 실패",
            text: "선택 사항 삭제가 실패되었습니다.",
            icon: "error",
            confirmButtonText: "확인",
          });
        }
      } catch (error) {
        console.log(error);
        return;
      }
    } else {
      return;
    }
  });
};

const initAll = () => {
  rowData.value = [];
  rowData2.value = [];
  updatedrowdata2.value = [];
  updatedrowdata.value = [];
};
</script>

<style scoped>
/* ── 조회 AREA wire (PUR02/STKN06 패턴) ── */
.pur306-search-panel {
  --pur306-panel-pad-x: 2rem;
  --pur306-row-min-h: 2rem;
  --pur306-control-h: 2rem;
  /* 2번 콤보(11.5rem) 기준 — 1번을 2번과 동일 폭으로 */
  --pur306-store-combo-2: 11.5rem;
  --pur306-store-combo-w: var(--pur306-store-combo-2);
  /* 매장 3번째 콤보 왼쪽선 (1행 pick-slot 기준) */
  --pur306-store-combo3-left: calc(
    var(--pur306-label-col) + var(--pur306-pair-gap) + var(--pur306-store-combo-w) +
      var(--pur306-item-gap) + var(--pur306-store-combo-w) + var(--pur306-item-gap)
  );
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  margin-top: 0;
  padding-left: 0;
  padding-right: 0;
  padding-block: 0.5rem;
  border-radius: 0.5rem;
  background-color: rgb(229 231 235);
  overflow: hidden;
}

@media (min-width: 640px) {
  .pur306-search-panel {
    --pur306-panel-pad-x: 2.5rem;
  }
}

@media (min-width: 768px) {
  .pur306-search-panel {
    --pur306-panel-pad-x: 3rem;
  }
}

@media (min-width: 1024px) {
  .pur306-search-panel {
    --pur306-panel-pad-x: 3.5rem;
  }
}

.pur306-search-grid {
  display: flex;
  flex-direction: column;
  gap: var(--pur306-row-gap);
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  padding-left: var(--pur306-panel-pad-x);
  padding-right: var(--pur306-panel-pad-x);
}

.pur306-block {
  display: flex;
  flex-direction: column;
  gap: var(--pur306-row-gap);
  width: 100%;
  min-width: 0;
}

.pur306-block--mat {
  margin-top: 0;
  padding-top: var(--pur306-row-gap);
  border-top: 2px solid #94a3b8;
}

.pur306-row {
  display: grid;
  width: 100%;
  min-width: 0;
  column-gap: var(--pur306-pair-gap);
  align-items: center;
  min-height: var(--pur306-row-min-h);
}

/* 1행 — 매장 | 발주일자(우측 정렬) */
.pur306-row--order1 {
  grid-template-columns:
    var(--pur306-label-col) minmax(0, 1fr)
    var(--pur306-label-col) minmax(0, max-content);
}

.pur306-row--order1 > .pur306-pick-slot {
  justify-self: start;
}

.pur306-row--order1 > .pur306-date-field {
  justify-content: flex-end;
  justify-self: end;
  width: max-content;
  max-width: 100%;
}

/* 2행 — 발주마감 | 코멘트(매장 3번 콤보 left 정렬) */
.pur306-row--order2 {
  grid-template-columns:
    var(--pur306-label-col) max-content minmax(0, 1fr);
}

.pur306-order2-tail {
  display: grid;
  grid-template-columns: var(--pur306-label-col) minmax(0, 1fr);
  column-gap: var(--pur306-pair-gap);
  align-items: center;
  min-width: 0;
  min-height: var(--pur306-row-min-h);
  padding-left: calc(
    var(--pur306-store-combo3-left) -
      (var(--pur306-label-col) + var(--pur306-pair-gap) + var(--pur306-store-combo-w) +
        var(--pur306-pair-gap))
  );
}

.pur306-order2-tail > .pur306-sg-label,
.pur306-order2-tail > .pur306-cell-field {
  min-height: var(--pur306-row-min-h);
}

.pur306-row--order2 > .pur306-deadline-field {
  width: var(--pur306-store-combo-w);
  max-width: var(--pur306-store-combo-w);
  flex: 0 0 auto;
}

.pur306-deadline-field {
  justify-self: start;
}

.pur306-sg-input--deadline {
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  text-align: center;
}

.pur306-sg-input--deadline:disabled {
  color: rgb(220 38 38) !important;
  -webkit-text-fill-color: rgb(220 38 38);
  font-weight: 600;
  text-align: center;
}

/* 3행 — 공급가 | 부가세 | 합계 (행 독립 레이아웃) */
.pur306-row--order3 {
  grid-template-columns:
    var(--pur306-label-col) max-content
    var(--pur306-label-col) max-content
    var(--pur306-label-col) max-content;
}

.pur306-row--order3 > .pur306-cell-field {
  width: var(--pur306-store-combo-w);
  max-width: var(--pur306-store-combo-w);
  flex: 0 0 auto;
}

.pur306-row--mat1 {
  grid-template-columns:
    var(--pur306-label-col) minmax(0, 1fr)
    var(--pur306-label-col) minmax(0, 1fr)
    var(--pur306-label-col) minmax(0, 1fr)
    var(--pur306-label-col) minmax(0, 1fr);
}

.pur306-row--mat2 {
  grid-template-columns:
    var(--pur306-label-col) minmax(0, 1fr)
    var(--pur306-label-col) minmax(0, 1fr)
    var(--pur306-label-col) minmax(0, 1fr)
    var(--pur306-label-col) minmax(0, 1fr);
}

/* 자재코드/명 — mat1 자재분류(3번째 쌍)와 left 정렬 */
.pur306-row--mat2 > .pur306-sg-label:nth-child(1) {
  grid-column: 1;
}

.pur306-row--mat2 > .pur306-cell-field:nth-child(2) {
  grid-column: 2;
}

.pur306-mat2-code-pair {
  grid-column: 5 / -1;
  display: grid;
  grid-template-columns: var(--pur306-label-col) minmax(0, 1fr);
  column-gap: var(--pur306-item-gap);
  align-items: center;
  min-width: 0;
  min-height: var(--pur306-row-min-h);
}

.pur306-mat2-code-pair > .pur306-sg-label {
  margin-left: 0;
}

.pur306-mat2-code-pair > .pur306-mat-code-field {
  display: grid;
  grid-template-columns: minmax(0, 4fr) minmax(0, 6fr) max-content;
  column-gap: var(--pur306-pair-gap);
  align-items: center;
  min-width: 0;
}

.pur306-mat-code-field .pur306-sg-input--code,
.pur306-mat-code-field .pur306-sg-input--name {
  width: 100%;
  max-width: 100%;
  flex: none;
  min-width: 0;
}

.pur306-row > .pur306-sg-label:not(:first-child) {
  margin-left: calc(var(--pur306-col-gap) - var(--pur306-pair-gap));
}

.pur306-row > .pur306-sg-label,
.pur306-row > .pur306-cell-field {
  min-height: var(--pur306-row-min-h);
}

.pur306-sg-label {
  box-sizing: border-box;
  width: var(--pur306-label-col);
  min-width: var(--pur306-label-col);
  max-width: var(--pur306-label-col);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pur306-sg-label--danger {
  color: rgb(220 38 38);
}

.pur306-req::before {
  content: "*";
  color: rgb(220 38 38);
  margin-right: 0.15rem;
  font-weight: 700;
}

.pur306-cell-field {
  min-width: 0;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}

.pur306-inline-field {
  flex-wrap: nowrap;
  gap: 0.375rem;
}

.pur306-sg-input,
.pur306-sg-select {
  box-sizing: border-box;
  height: var(--pur306-control-h);
  min-height: var(--pur306-control-h);
  max-height: var(--pur306-control-h);
  width: 100%;
  min-width: 0;
  padding: 0 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: rgb(55 65 81);
  background: #fff;
  border: 1px solid var(--pur306-control-border);
  border-radius: 0.375rem;
}

.pur306-sg-input:focus,
.pur306-sg-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.2);
}

.pur306-sg-input:disabled {
  background: rgb(241 245 249);
  color: rgb(71 85 105);
}

.pur306-sg-input--danger {
  color: rgb(220 38 38);
  font-weight: 600;
}

.pur306-sg-input--date {
  flex: 0 1 9rem;
  width: 9rem;
  max-width: 100%;
  min-width: 0;
}

.pur306-sg-input--code {
  flex: 0 0 5.5rem;
  width: 5.5rem;
  max-width: 5.5rem;
}

.pur306-sg-input--name {
  flex: 1 1 auto;
  min-width: 0;
}

.pur306-sub-btn {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  height: var(--pur306-control-h);
  min-height: var(--pur306-control-h);
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

.pur306-sub-btn:hover {
  background-color: rgb(219 234 254);
  border-color: rgb(96 165 250);
}

/* 그리드 헤더 — whitebutton(26px) 높이 + 서브버튼 톤 */
.pur306-sub-btn--grid {
  height: 1.625rem;
  min-height: 1.625rem;
  max-height: 1.625rem;
  min-width: auto;
  padding: 0 0.875rem;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1;
}

/* 그리드 헤더 — 서브버튼 + 컴팩트 바 */
.pur306-grid-bar {
  align-items: center;
  min-height: 1.875rem;
  padding: 0.125rem 0.5rem;
}

.pur306-grid-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.875rem;
}

.pur306-grid-body {
  margin-top: 0.25rem;
}

.pur306-grid-layout {
  min-height: 0;
}

.pur306-grid-transfer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  min-width: 0;
  padding: 0 0.125rem;
}

.pur306-transfer-btn {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  padding: 0;
  color: rgb(37 99 235);
  border: 1px solid rgb(147 197 253);
  border-radius: 0.5rem;
  background: linear-gradient(180deg, rgb(239 246 255) 0%, rgb(219 234 254) 100%);
  box-shadow: 0 1px 3px 0 rgb(59 130 246 / 0.18);
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.15s ease;
}

.pur306-transfer-btn:hover {
  color: rgb(29 78 216);
  border-color: rgb(96 165 250);
  background: rgb(219 234 254);
  box-shadow: 0 2px 6px 0 rgb(59 130 246 / 0.22);
  transform: translateY(-1px);
}

.pur306-transfer-btn:active {
  transform: translateY(0);
  box-shadow: 0 1px 2px 0 rgb(59 130 246 / 0.15);
}

.pur306-transfer-icon {
  display: block;
  width: 1.125rem;
  height: 1.125rem;
  pointer-events: none;
}

/* PickStore — STKN06_012 store-grid (3콤보 한 세트) */
.pur306-pick-slot {
  min-width: 0;
  overflow: hidden;
}

.pur306-pick-slot :deep(> div.flex.text-base) {
  margin: 0 !important;
  width: 100% !important;
  min-width: 0 !important;
  max-width: 100% !important;
  flex-wrap: nowrap !important;
  align-items: center !important;
  justify-content: flex-start !important;
}

.pur306-pick-slot :deep(> div.flex > div:first-child) {
  display: none;
}

/* 매장 3콤보 — 1행 전용 내부 그리드 */
.pur306-pick-slot--store-grid :deep(> div.flex) {
  display: grid !important;
  grid-template-columns:
    var(--pur306-store-combo-w)
    var(--pur306-store-combo-w)
    minmax(0, 1fr) !important;
  width: max-content !important;
  max-width: 100% !important;
  min-width: 0 !important;
  flex-wrap: unset !important;
  align-items: stretch !important;
  gap: var(--pur306-item-gap) !important;
}

.pur306-pick-slot--store-grid :deep(> div.flex > div) {
  min-width: 0 !important;
  width: 100% !important;
  max-width: 100% !important;
}

.pur306-pick-slot--store-grid :deep(> div.flex > div:last-child) {
  flex: unset !important;
  width: 50% !important;
  min-width: 0 !important;
  max-width: 50% !important;
  justify-self: start;
}

.pur306-pick-slot--store-grid :deep(> div.flex > div:last-child > div) {
  max-width: 100% !important;
  width: 100% !important;
}

.pur306-search-panel .pur306-pick-slot :deep(select) {
  box-sizing: border-box;
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important;
  height: var(--pur306-control-h) !important;
  min-height: var(--pur306-control-h) !important;
  max-height: var(--pur306-control-h) !important;
  margin-left: 0 !important;
  padding: 0 0.375rem !important;
  font-size: 0.875rem !important;
  border: 1px solid var(--pur306-control-border) !important;
  border-radius: 0.375rem !important;
}

.pur306-search-panel .pur306-pick-slot :deep(select:focus) {
  border-color: #3b82f6 !important;
}

.pur306-search-panel .pur306-pick-slot :deep(.pickstore-vs-shell) {
  box-sizing: border-box;
  height: var(--pur306-control-h) !important;
  min-height: var(--pur306-control-h) !important;
  max-height: var(--pur306-control-h) !important;
  width: 100% !important;
  max-width: 100% !important;
  border: 1px solid var(--pur306-control-border) !important;
  border-radius: 0.375rem !important;
  font-size: 0.875rem !important;
  background: #fff !important;
}

.pur306-pick-slot :deep(.vs__dropdown-toggle) {
  height: 100% !important;
  min-height: 0 !important;
  border: none !important;
}

/* BusinessClient2 — PUR02 패턴 */
.pur306-bc-slot :deep(> div.flex.text-base) {
  margin: 0 !important;
  width: 100% !important;
  min-width: 0 !important;
  gap: 0 !important;
}

.pur306-search-panel .pur306-bc-slot :deep(.pickstore-vs-shell) {
  box-sizing: border-box;
  height: var(--pur306-control-h) !important;
  min-height: var(--pur306-control-h) !important;
  border: 1px solid var(--pur306-control-border) !important;
  border-radius: 0.375rem !important;
  font-size: 0.875rem !important;
  background: #fff !important;
  max-width: 100%;
  min-width: 0;
}

@media (max-width: 1279px) {
  .pur306-row--mat1 {
    grid-template-columns:
      var(--pur306-label-col) minmax(0, 1fr)
      var(--pur306-label-col) minmax(0, 1fr);
  }

  .pur306-row--mat1 > .pur306-sg-label:nth-child(5),
  .pur306-row--mat1 > .pur306-cell-field:nth-child(6),
  .pur306-row--mat1 > .pur306-sg-label:nth-child(7),
  .pur306-row--mat1 > .pur306-cell-field:nth-child(8) {
    margin-top: var(--pur306-row-gap);
  }

  .pur306-row--mat1 > .pur306-sg-label:nth-child(5) {
    margin-left: 0;
  }

  .pur306-row--mat2 {
    grid-template-columns:
      var(--pur306-label-col) minmax(0, 1fr)
      var(--pur306-label-col) minmax(0, 1fr);
  }

  .pur306-row--mat2 > .pur306-mat2-code-pair {
    grid-column: auto;
  }
}

@media (max-width: 1023px) {
  .pur306-row--order1,
  .pur306-row--order2,
  .pur306-row--order3,
  .pur306-row--mat1,
  .pur306-row--mat2 {
    grid-template-columns: var(--pur306-label-col) minmax(0, 1fr);
  }

  .pur306-row--order1 > .pur306-date-field,
  .pur306-row--order2 > .pur306-deadline-field,
  .pur306-row--order3 > .pur306-cell-field {
    justify-self: stretch;
    width: 100%;
    max-width: 100%;
  }

  .pur306-order2-tail {
    padding-left: 0;
    grid-template-columns: var(--pur306-label-col) minmax(0, 1fr);
  }

  .pur306-row--mat2 > .pur306-mat2-code-pair {
    grid-column: auto;
    grid-template-columns: var(--pur306-label-col) minmax(0, 1fr);
  }

  .pur306-mat-code-field {
    grid-template-columns: minmax(0, 1fr);
  }

  .pur306-row > .pur306-sg-label:not(:first-child) {
    margin-left: 0;
    margin-top: var(--pur306-row-gap);
  }

  .pur306-row > .pur306-cell-field:not(:first-of-type) {
    margin-top: 0;
  }
}
</style>
