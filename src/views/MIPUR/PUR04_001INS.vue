<!-- /*--############################################################################
# Filename : PUR04_001INS.vue                                                  
# Description : 구매관리2 > 단가 관리 > 매입 단가 등록                      
# Date :2025-08-28                                                             
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <!-- 조회조건 + 좌우 그리드: 시작선 맞춤, 하단은 flex-1로 동일 높이 -->
  <div class="flex h-full min-h-0 flex-col" @click="handleParentClick">
    <div class="flex shrink-0 justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center mr-9 space-x-2 pr-5">
        <button @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <button
          @click="copyButton"
          class="button copy w-auto excel disabled:opacity-90"
          :disabled="disabled2">
          복사
        </button>
      </div>
    </div>

    <div
      class="pur235-search-panel pur401-search-wrap z-10 mt-3 w-full min-h-0 shrink-0 overflow-x-auto rounded-lg bg-gray-200 px-8 py-3 md:px-12">
      <div
        class="pur235-wire-grid pur235-wire-grid-401 min-w-0"
        :style="{
          '--pur235-control-border': pur235ControlBorder,
          '--pur235-col-gutter': pur235ColGutter,
          '--pur235-row-gap': pur235RowGap,
          '--pur235-label-col': pur235LabelCol,
        }">
        <div class="pur235-wire-cell">
          <div class="pur235-wire-label">매장선택</div>
          <div
            class="pur235-wire-field pur235-pick-slot pur235-pick-narrow min-w-0 w-full">
            <!-- 본 화면은 매장 1콤보만(그룹·구분 숨김) — 유형 임의 변경 금지 -->
            <PickStore
              @update:storeGroup="lngStoreGroup"
              :default-store-nm="'공통'"
              @storeNm="excelStore"
              :hide-group="false"
              :hide-attr="false"
              :default-store="true"
              @update:storeCd="lngStoreCode" />
          </div>
        </div>
        <div class="pur235-wire-cell">
          <div class="pur235-wire-label">거래처</div>
          <div class="pur235-wire-field pur235-bc-slot min-w-0 w-full">
            <BusinessClient compact-search-bar @SupplierId="SupplierId" />
          </div>
        </div>
        <div class="pur235-wire-cell min-w-0">
          <div class="pur235-wire-label">자재코드</div>
          <div class="pur235-wire-field min-w-0">
            <input
              id="pur04-001-cond"
              v-model="cond"
              type="text"
              class="pur235-sg-input h-8 min-h-8 w-full min-w-0 rounded-md border border-solid bg-white px-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              @input="onlyNumber" />
          </div>
        </div>
        <div class="pur235-wire-cell min-w-0">
          <div class="pur235-wire-label">자재명</div>
          <div class="pur235-wire-field min-w-0">
            <input
              id="pur04-001-cond2"
              v-model="cond2"
              type="text"
              class="pur235-sg-input h-8 min-h-8 w-full min-w-0 rounded-md border border-solid bg-white px-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      </div>
    </div>

    <div class="mt-2 grid min-h-0 flex-1 grid-cols-2 gap-2">
      <div class="flex min-h-0 min-w-0 flex-col">
        <div class="relative min-h-0 flex-1">
          <Realgrid
            :progname="'PUR04_001INS_VUE'"
            :progid="1"
            :rowData="rowData"
            :reload="reload"
            :setStateBar="false"
            :documentTitle="'PUR01_009RPT'"
            @updatedRowData="updatedRowData"
            @dblclickedRowData="dblclickedRowData"
            @clickedRowData="dblclickedRowData"
            :checkRenderEditable="true"
            :documentSubTitle="documentSubTitle"
            :rowStateeditable="false"
            :exporttoExcel="exportExcel">
          </Realgrid>
        </div>
      </div>

      <div class="flex min-h-0 min-w-0 flex-col">
        <div class="shrink-0 flex flex-col gap-2 pb-2">
          <div
            class="pur235-search-panel flex flex-wrap items-center justify-between gap-2 rounded-lg px-4 py-2.5 md:px-6">
            <p class="min-w-0 text-sm font-bold text-red-500">
              ※매입단가 : 발주/매입 금액 단위 금액
            </p>
            <div class="flex shrink-0 flex-wrap justify-end gap-2">
              <button
                type="button"
                class="whitebutton !h-9 !px-5 !py-2 !text-sm !font-semibold !border-gray-500 !text-gray-700 hover:!bg-blue-50 hover:!border-blue-400 disabled:opacity-50 disabled:pointer-events-none"
                @click="addButton">
                신규
              </button>
              <button
                type="button"
                class="whitebutton !h-9 !px-5 !py-2 !text-sm !font-semibold !border-gray-500 !text-gray-700 hover:!bg-blue-50 hover:!border-blue-400 disabled:opacity-50 disabled:pointer-events-none"
                @click="saveButton">
                저장
              </button>
              <button
                type="button"
                class="whitebutton !h-9 !px-5 !py-2 !text-sm !font-semibold !border-gray-500 !text-gray-700 hover:!bg-blue-50 hover:!border-blue-400 disabled:opacity-50 disabled:pointer-events-none"
                @click="deleteButton">
                삭제
              </button>
            </div>
          </div>

          <div
            class="pur235-search-panel pur401-grid2-form rounded-lg px-5 py-2.5 md:px-6"
            :style="{
              '--pur235-control-border': pur235ControlBorder,
              '--pur235-col-gutter': '0.625rem',
              '--pur235-row-gap': '0.5rem',
              '--pur235-label-col': '7rem',
              '--pur401-detail-field-max': '10.25rem',
            }">
            <div class="pur235-wire-grid pur235-wire-grid-401 min-w-0">
              <div class="pur235-wire-cell min-w-0">
                <div class="pur235-wire-label">거래처</div>
                <div class="pur235-wire-field pur235-bc-slot pur401-detail-control min-w-0 w-full">
                  <BusinessClient
                    compact-search-bar
                    :select-supplier-id="supplierid2"
                    :default-name="''"
                    @SupplierId="SupplierId2" />
                </div>
              </div>
              <div class="pur235-wire-cell min-w-0">
                <div class="pur235-wire-label">부가세 구분</div>
                <div class="pur235-wire-field min-w-0">
                  <label
                    class="flex cursor-pointer items-center gap-2.5 text-sm text-gray-800"
                    for="scond">
                    <input
                      id="scond"
                      v-model="scond"
                      type="checkbox"
                      class="h-5 w-5 shrink-0 cursor-pointer rounded border-gray-400 text-blue-600 focus:ring-blue-500" />
                    <span>포함</span>
                  </label>
                </div>
              </div>

              <div class="pur235-wire-cell min-w-0">
                <div class="pur235-wire-label">단가</div>
                <div class="pur235-wire-field pur401-detail-control min-w-0">
                  <input
                    v-model="scond2"
                    type="text"
                    name="curUnitPrice"
                    class="pur235-sg-input h-8 min-h-8 w-full min-w-0 rounded-md border border-solid bg-white px-1.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200"
                    @input="onlyNumber2"
                    :disabled="disabled" />
                </div>
              </div>
              <div class="pur235-wire-cell min-w-0">
                <div class="pur235-wire-label">단가(VAT포함)</div>
                <div class="pur235-wire-field pur401-detail-control min-w-0">
                  <input
                    v-model="scond3"
                    type="text"
                    name="curUnitPrice2"
                    class="pur235-sg-input h-8 min-h-8 w-full min-w-0 rounded-md border border-solid bg-white px-1.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200"
                    @input="onlyNumber2"
                    :disabled="!disabled" />
                </div>
              </div>

              <div class="pur235-wire-cell min-w-0">
                <div class="pur235-wire-label">적용일</div>
                <div class="pur235-wire-field pur401-detail-control min-w-0">
                  <input
                    v-model="scond4"
                    type="date"
                    class="pur235-sg-input h-8 min-h-8 w-full min-w-0 rounded-md border border-solid bg-white px-1.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200" />
                </div>
              </div>
              <div class="pur235-wire-cell min-w-0">
                <div class="pur235-wire-label">구분(주/부)</div>
                <div class="pur235-wire-field pur401-detail-control min-w-0">
                  <select
                    id="pur04-001-scond5"
                    v-model="scond5"
                    class="pur235-sg-select h-8 w-full min-w-0 rounded-md border border-solid bg-white px-1.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="0">선택</option>
                    <option
                      v-for="i in optionList"
                      :key="i.strDCode"
                      :value="i.strDCode">
                      {{ i.strDName }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="relative mt-1 min-h-0 flex-1">
          <Realgrid
            :progname="'PUR04_001INS_VUE'"
            :progid="2"
            :rowStateeditable="false"
            @clickedRowData="clickedRowData2"
            :rowData="rowData2">
          </Realgrid>
        </div>
      </div>
    </div>
  </div>
  <div
    v-if="openCopy"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <!-- 팝업 박스 -->
    <div class="bg-white rounded-2xl shadow-lg w-[60vw] h-[70vh] p-6 relative">
      <div class="flex justify-between">
        <h2 class="text-xl font-bold mb-4">복사</h2>
        <!-- 버튼 영역 -->
        <div class="flex justify-end space-x-2">
          <button
            class="px-4 py-2 bg-blue-600 text-white rounded-lg"
            @click="copyButton2">
            복사
          </button>
          <button
            class="px-4 py-2 bg-gray-300 rounded-lg"
            @click="openCopy = false">
            닫기
          </button>
        </div>
      </div>
      <div class="flex items-center space-x-5">
        <div class="!-ml-12">
          <PickStore
            @update:storeGroup="lngStoreGroup2"
            :defaultStoreNm="'공통'"
            :mainName="'원본 매장'"
            @storeNm="excelStore2"
            :hideGroup="false"
            :hideAttr="false"
            :defaultStore="true"
            @update:storeCd="lngStoreCode2"></PickStore>
        </div>
      </div>
      <div class="grid grid-rows-1 grid-cols-[6fr,1fr,6fr] mt-2 h-[80%]">
        <div class="h-full w-full">
          <Realgrid
            :progname="'PUR04_001INS_VUE'"
            :progid="3"
            :rowStateeditable="false"
            :checkRenderEditable="true"
            :setStateBar="false"
            @updatedRowData="updatedRowData2"
            :rowData="rowData3"></Realgrid>
        </div>
        <div>&nbsp;</div>
        <div class="h-full w-full">
          <Realgrid
            :progname="'PUR04_001INS_VUE'"
            :progid="4"
            :rowData="rowData4"></Realgrid>
        </div>
      </div>
    </div>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import { getCommonList } from "@/api/common";
import {
  copyPurchasePrice,
  deleteStockPriceHistory,
  getCheckStoreList,
  getStockUnitPriceList,
  getUnitPriceDetailList,
  saveStockPriceHistory,
} from "@/api/mipur";
import BusinessClient from "@/components/businessClient2.vue";
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

import { nextTick, onMounted, ref, watch } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";
/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getCommonList(35);

  optionList.value = res.data.List;

  scond4.value = formatLocalDate(new Date());

  if (store.state.userData.lngPositionType == "0") {
    disabled2.value = true;
  }

  if (
    store.state.userData.lngStoreGroup == "3183" ||
    store.state.userData.lngStoreGroup == "5001"
  ) {
    disabled2.value = true;
  }
  //하드코딩
});

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

const cond = ref("");
const cond2 = ref("");
const disabled2 = ref(false);
const cond5 = ref(0);
const store = useStore();

/** 조회 AREA — PUR02_014/035과 동일 pur235 와이어 토큰 */
const pur235ControlBorder = "#cbd5e1";
const pur235ColGutter = "1.125rem";
const pur235RowGap = "0.875rem";
const pur235LabelCol = "6.25rem";

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
const optionList2 = ref([]);

const storeCode = ref();
const lngStoreCode = (e) => {
  initGrid();
  storeCode.value = e;
};
const storeCode2 = ref();
const lngStoreCode2 = (e) => {
  storeCode2.value = e;
};

const storeAttr = ref();
const lngStoreAttrs = (e) => {
  storeAttr.value = e;
};

const groupCd = ref();
const lngStoreGroup = (e) => {
  groupCd.value = e;
};

const groupCd2 = ref();
const lngStoreGroup2 = (e) => {
  groupCd2.value = e;
};

const supplierid = ref("");
const SupplierId = (e) => {
  supplierid.value = e;
};

const supplierid2 = ref("");
const SupplierId2 = (e) => {
  supplierid2.value = e;
};
/**
 *  조회 함수
 */
const hideColumnsId = ref([]);
const searchButton = async () => {
  try {
    store.state.loading = true;
    initGrid();

    const res = await getStockUnitPriceList(
      groupCd.value,
      storeCode.value,
      supplierid.value,
      cond.value,
      cond2.value,
      store.state.userData.strLanguage
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
  afterSearch.value = false;
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

const onlyNumber = (e) => {
  e.target.value = e.target.value.replace(/[^0-9]/g, "");
};

const onlyNumber2 = (e) => {
  e.target.value = e.target.value.replace(/[^0-9]/g, "");

  if (e.target.name == "curUnitPrice") {
    if (isNaN(scond2.value)) {
      scond3.value = "";
    } else {
      scond3.value =
        parseInt(scond2.value) + Math.floor(parseInt(scond2.value) * 0.1);
    }
  } else if (e.target.name == "curUnitPrice2") {
    if (isNaN(scond3.value)) {
      scond2.value = "";
    } else {
      scond2.value = Math.round((parseInt(scond3.value) * 10) / 11);
    }
  }
};

const rowData2 = ref([]);
const afterDblClick = ref(false);

const scond = ref(false);
const scond2 = ref("");
const scond3 = ref("");
const scond4 = ref("");
const scond5 = ref(0);
const tempStockId = ref("");
const dblclickedRowData = async (e) => {
  //console.log(e);

  const clickedStockId = e[1];
  if (String(clickedStockId ?? "") !== String(tempStockId.value ?? "")) {
    supplierid2.value = 0;
  }

  try {
    const res = await getUnitPriceDetailList(
      groupCd.value,
      storeCode.value,
      supplierid.value,
      clickedStockId,
      store.state.userData.strLanguage
    );

    //console.log(res);

    rowData2.value = res.data.List;
    afterDblClick.value = true;
    tempStockId.value = clickedStockId;
    tempFromDate.value = "";
    tempTodate.value = "";
    tempSupplierId.value = "";
  } catch (error) {}
};

/** 2번 그리드 상단 — 거래처·부가세·단가·적용일·구분 디폴트(신규와 동일) */
const resetDetailFormDefaults = () => {
  supplierid2.value = 0;
  scond.value = false;
  scond2.value = "";
  scond3.value = "";
  scond4.value = formatLocalDate(new Date());
  scond5.value = 0;
};

const addButton = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }

  if (afterDblClick.value == false) {
    Swal.fire({
      title: "경고",
      text: "자재코드를 먼저 선택해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }

  resetDetailFormDefaults();
};

const disabled = ref(false);
watch(scond, () => {
  if (scond.value == false) {
    disabled.value = false;
  } else {
    disabled.value = true;
  }
});

const saveButton = async () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }

  if (afterDblClick.value == false) {
    Swal.fire({
      title: "경고",
      text: "자재코드를 먼저 선택해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }

  if (supplierid2.value == 0) {
    Swal.fire({
      title: "경고",
      text: "거래처를 선택해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }

  if (supplierid2.value == 0) {
    Swal.fire({
      title: "경고",
      text: "거래처를 선택해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }

  if (
    scond2.value == false &&
    (scond3.value == "" || scond3.value == undefined)
  ) {
    Swal.fire({
      title: "경고",
      text: "단가를 입력해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }

  if (
    scond2.value == true &&
    (scond4.value == "" || scond4.value == undefined)
  ) {
    Swal.fire({
      title: "경고",
      text: "단가를 입력해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }

  if (scond5.value == 0) {
    Swal.fire({
      title: "경고",
      text: "구분을 선택해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }

  try {
    const res = await saveStockPriceHistory(
      groupCd.value,
      storeCode.value,
      supplierid2.value,
      tempStockId.value,
      scond2.value,
      scond4.value.replaceAll("-", ""),
      scond5.value,
      store.state.userData.lngSequence
    );

    //console.log(res);

    if (res.data.RESULT_CD == "00") {
      resetDetailFormDefaults();
      Swal.fire({
        title: "성공",
        text: "저장을 완료하였습니다.",
        icon: "success",

        confirmButtonText: "확인",
      });
    } else {
      Swal.fire({
        title: "실패",
        text: "저장에 실패하였습니다. 적용일을 확인해주세요.",
        icon: "error",

        confirmButtonText: "확인",
      });
    }
  } catch (error) {
  } finally {
    try {
      const res = await getUnitPriceDetailList(
        groupCd.value,
        storeCode.value,
        supplierid.value,
        tempStockId.value,
        store.state.userData.strLanguage
      );

      //console.log(res);

      rowData2.value = res.data.List;
      afterDblClick.value = true;
    } catch (error) {}
  }
};

const tempFromDate = ref("");
const tempTodate = ref("");
const tempSupplierId = ref("");

const clickedRowData2 = (e) => {
  ////console.log(e);
  tempSupplierId.value = e[0];
  tempFromDate.value = e[3];
  tempTodate.value = e[5];
};

const deleteButton = async () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }

  if (tempSupplierId.value == "" || tempSupplierId.value == undefined) {
    Swal.fire({
      title: "경고",
      text: "삭제할 항목을 선택해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }

  try {
    store.state.loading = true;
    const res = await deleteStockPriceHistory(
      groupCd.value,
      storeCode.value,
      tempSupplierId.value,
      tempStockId.value,
      tempFromDate.value,
      tempTodate.value
    );
    store.state.loading = false;
    if (res.data.RESULT_CD == "00") {
      Swal.fire({
        title: "성공",
        text: "삭제를 완료하였습니다.",
        icon: "success",

        confirmButtonText: "확인",
      });
    } else {
      Swal.fire({
        title: "실패",
        text: "삭제를 실패하였습니다.",
        icon: "error",

        confirmButtonText: "확인",
      });
    }
  } catch (error) {
  } finally {
    try {
      const res = await getUnitPriceDetailList(
        groupCd.value,
        storeCode.value,
        supplierid.value,
        tempStockId.value,
        store.state.userData.strLanguage
      );

      //console.log(res);

      rowData2.value = res.data.List;
      afterDblClick.value = true;
    } catch (error) {}
  }
};

const openCopy = ref(false);
const copyButton = async () => {
  openCopy.value = true;

  try {
    const res = await getCheckStoreList(groupCd.value, 0);

    rowData3.value = JSON.parse(JSON.stringify(res.data.List));
  } catch (error) {}
};

const rowData3 = ref([]);
const rowData4 = ref([]);

const copyButton2 = async () => {
  console.log(updatedrowdata.value);
  const checkedStock = updatedrowdata.value
    .filter((item) => item.lngCheck == true)
    .map((item) => item.lngStockID);

  if (checkedStock.length == 0) {
    Swal.fire({
      title: "경고",
      text: "복사하실 자재코드를 먼저 선택해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }
  // if (storeCode2.value == "0") {
  //   Swal.fire({
  //     title: "경고",
  //     text: "원본매장을 먼저 선택해주세요.",
  //     icon: "warning",

  //     confirmButtonText: "확인",
  //   });
  //   return;
  // }
  try {
    let res = "";
    const storecds = updatedrowdata2.value
      .filter((item) => item.lngCheck == true)
      .map((item) => item.lngStoreCode);

    rowData4.value = updatedrowdata2.value.filter(
      (item) => item.lngCheck == true
    );
    for (let i = 0; i < storecds.length; i++) {
      res = await copyPurchasePrice(
        groupCd2.value,
        storeCode2.value,
        storecds[i],
        checkedStock.join(";")
      );

      rowData4.value = rowData4.value.filter(
        (item) => item.lngStoreCode != storecds[i]
      );
    }

    console.log(res);

    if (res.data.RESULT_CD == "00") {
      await Swal.fire({
        title: "성공",
        text: "매입단가 복사에 성공하였습니다.",
        icon: "success",

        confirmButtonText: "확인",
      });
    } else {
      await Swal.fire({
        title: "실패",
        text: "매입단가 복사에 실패하였습니다.",
        icon: "error",

        confirmButtonText: "확인",
      });
    }
  } catch (error) {
  } finally {
    openCopy.value = false;
    searchButton();
  }
};
const updatedrowdata = ref([]);
const updatedRowData = (e) => {
  updatedrowdata.value = e;
  //console.log(e);
};

const updatedrowdata2 = ref([]);
const updatedRowData2 = (e) => {
  updatedrowdata2.value = e;
  //console.log(e);
};
</script>

<style scoped>
/* PUR02_035RPT와 동일 와이어 — 401만 2열(매장|거래처 / 자재코드|자재명) */
.pur235-wire-grid {
  display: grid;
  width: 100%;
  min-width: 0;
  align-items: center;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  column-gap: var(--pur235-col-gutter);
  row-gap: var(--pur235-row-gap);
}

.pur235-wire-grid-401 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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

/* 상단 조회 — 매장·거래처·자재 필드 가로 = 매장 콤보 기준(14rem) 통일 */
.pur401-search-wrap .pur235-wire-cell > .pur235-wire-field {
  max-width: 14rem;
  width: 100%;
  min-width: 0;
  align-self: flex-start;
  box-sizing: border-box;
}

/* 조회 AREA — 자재코드/명 입력 세로 = 매장·거래처 콤보(2rem)와 동일 */
.pur401-search-wrap .pur235-sg-input {
  height: 2rem !important;
  min-height: 2rem !important;
  max-height: 2rem !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  line-height: 1.25rem !important;
}

/* 2번 그리드 폼 — 거래처(11rem)와 단가(9.5rem) 중간(10.25rem), 부가세 행 제외 */
.pur401-grid2-form .pur401-detail-control {
  max-width: var(--pur401-detail-field-max, 10.25rem);
  width: 100%;
  min-width: 0;
  align-self: flex-start;
  box-sizing: border-box;
}

.pur401-grid2-form .pur401-detail-control .pur235-sg-input,
.pur401-grid2-form .pur401-detail-control .pur235-sg-select {
  max-width: 100%;
}

.pur235-search-panel .pur235-sg-input {
  border: 1px solid var(--pur235-control-border) !important;
  box-sizing: border-box;
}

.pur235-search-panel .pur235-sg-input:focus {
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

/* 매장 1콤보 — 세로 h-8 정렬(:deep), 가로는 .pur401-search-wrap 이 wire-field에 14rem 적용 */
.pur235-search-panel .pur235-pick-narrow {
  width: 100%;
  align-self: flex-start;
}

.pur235-pick-narrow :deep(> div.flex.text-base) {
  margin-top: 0;
  margin-left: 0;
  width: 100%;
  justify-content: flex-start;
}

.pur235-pick-narrow :deep(> div.flex.text-base > div:nth-child(4)) {
  width: 100% !important;
  max-width: 100% !important;
  margin-left: 0 !important;
}

.pur235-pick-narrow :deep(> div.flex.text-base > div:nth-child(4) > div:first-child) {
  width: 100% !important;
  max-width: 100%;
  height: 2rem !important;
  min-height: 2rem !important;
  max-height: 2rem !important;
  border-radius: 0.375rem;
  font-size: 0.875rem !important;
  line-height: 1.25rem;
  box-sizing: border-box;
}

.pur235-pick-narrow
  :deep(> div.flex.text-base > div:nth-child(4) > div:first-child .style-chooser) {
  height: 100% !important;
  min-height: 0;
}

.pur235-bc-slot :deep(> div.flex) {
  justify-content: flex-start;
  width: 100%;
  margin-left: 0;
  padding-left: 0;
}

/* 2번 그리드 상단 폼 — 라벨 잘림 방지(폰트는 상단 조회와 동일 1rem) */
.pur401-grid2-form .pur235-wire-label {
  white-space: normal;
  overflow: visible;
  text-overflow: clip;
  line-height: 1.2;
  font-size: 1rem;
  hyphens: none;
  padding-left: 0.125rem;
  padding-right: 0.125rem;
}
</style>
