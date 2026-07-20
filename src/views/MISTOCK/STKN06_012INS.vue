<!-- /*--############################################################################
# Filename : STKN06_012INS.vue                                                  
# Description : 자재관리2 > 손실 관리 > 손실 등록.                      
# Date :2025-09-01                                                             
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <!-- 조회조건 -->
  <div class="flex h-full min-h-0 flex-col" @click="handleParentClick">
    <div
      class="flex w-full shrink-0 items-center justify-between overflow-y-hidden">
      <PageName></PageName>
      <div class="mr-9 flex justify-center space-x-2 pr-5">
        <button @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <button @click="addButton" class="button w-auto new">신규</button>
        <button @click="deleteButton" class="button w-auto delete">삭제</button>
        <button @click="excelButton" class="button w-auto excel">엑셀</button>
      </div>
    </div>

    <div
      class="stkn0612-search-panel z-10 mt-3 w-full min-h-0 shrink-0 rounded-lg bg-gray-200"
      :style="{
        '--stkn0612-control-border': stkn0612ControlBorder,
        '--stkn0612-item-gap': stkn0612ItemGap,
        '--stkn0612-col-gap': stkn0612ColGap,
        '--stkn0612-row-gap': stkn0612RowGap,
        '--stkn0612-label-col': stkn0612LabelCol,
      }">
      <div class="stkn0612-search-grid min-w-0">
        <div class="stkn0612-cell min-w-0">
          <div class="stkn0612-sg-label">기간</div>
          <div class="stkn0612-cell-field stkn0612-date-slot min-w-0">
            <Datepicker2
              :mainName="'기간'"
              omit-main-label
              filter-bar-align
              ref="datepicker"
              :initToday="1"
              :closePopUp="closePopUp"
              @excelDate="excelDate"
              @endDate="endDate"
              @startDate="startDate" />
          </div>
        </div>
        <div class="stkn0612-cell stkn0612-cell--store min-w-0">
          <div class="stkn0612-sg-label">매장</div>
          <div
            class="stkn0612-cell-field stkn0612-pick-slot stkn0612-pick-slot--store-grid min-w-0">
            <PickStoreRenew
              compact
              omit-main-label
              combo-fill
              main-name="매장"
              :placeholder-name="'전체'"
              @lngStoreGroup="lngStoreGroup"
              @storeNm="excelStore"
              @lngStoreCode="lngStoreCode" />
          </div>
        </div>
      </div>
    </div>

    <!-- 그리드 영역 -->
    <div class="mt-2 min-h-0 w-full flex-1">
      <div
        class="grid h-full min-h-0 w-full grid-cols-[0.9fr,1.1fr] grid-rows-1 gap-2">
        <Realgrid
          class="h-full min-h-0 w-full"
          :progname="'STKN06_012INS_VUE'"
          :progid="1"
          :rowData="rowData"
          :reload="reload"
          :setStateBar="false"
          :documentTitle="'STKN06_012INS'"
          @dblclickedRowData="dblclickedRowData"
          @clickedRowData="clickedRowData"
          :documentSubTitle="documentSubTitle"
          :rowStateeditable="false"
          :exporttoExcel="exportExcel" />

        <Realgrid
          class="h-full min-h-0 w-full"
          :progname="'STKN06_012INS_VUE'"
          :progid="2"
          :rowData="rowData2"
          :reload="reload"
          :setStateBar="false"
          :documentTitle="'STKN06_012INS'"
          :rowStateeditable="false" />
      </div>
    </div>
  </div>
  <Teleport to="body">
  <div
    v-if="open"
    class="stkn0612-modal-overlay"
    @mousedown.self.prevent
    @click.self.prevent>
    <div
      class="stkn0612-modal flex h-[70vh] w-[min(90vw,56rem)] flex-col rounded-lg bg-white p-5 shadow-lg"
      @mousedown.stop
      @click.stop>
      <div class="mb-3 flex shrink-0 items-center justify-between gap-3">
        <h2 class="text-xl font-bold">손실 등록</h2>
        <div class="flex space-x-2">
          <button type="button" class="stkn0612-sub-btn" @click="searchButton2">
            조회
          </button>
          <button type="button" class="stkn0612-sub-btn" @click="saveButton2">
            저장
          </button>
          <button type="button" class="stkn0612-sub-btn" @click="open = false">
            닫기
          </button>
        </div>
      </div>

      <div
        class="stkn0612-modal-panel shrink-0 rounded-lg bg-gray-200"
        :style="{
          '--stkn0612-control-border': stkn0612ControlBorder,
          '--stkn0612-item-gap': stkn0612ItemGap,
          '--stkn0612-col-gap': stkn0612ColGap,
          '--stkn0612-row-gap': stkn0612RowGap,
          '--stkn0612-label-col': stkn0612LabelCol,
        }">
        <div class="stkn0612-modal-grid min-w-0">
          <div class="stkn0612-cell stkn0612-cell--narrow min-w-0">
            <div class="stkn0612-sg-label">일자</div>
            <div class="stkn0612-cell-field min-w-0">
              <input
                type="date"
                class="stkn0612-sg-input"
                v-model="scond" />
            </div>
          </div>
          <div class="stkn0612-cell stkn0612-cell--store min-w-0">
            <div class="stkn0612-sg-label">매장</div>
            <div
              class="stkn0612-cell-field stkn0612-pick-slot stkn0612-pick-slot--store-grid min-w-0">
              <PickStoreRenew
                compact
                omit-main-label
                combo-fill
                :append-to-body="false"
                main-name="매장"
                :placeholder-name="'전체'"
                :set-default-store-cd="popupDefaultStoreCd"
                @lngStoreGroup="lngStoreGroup2"
                @lngStoreCode="lngStoreCode2" />
            </div>
          </div>
          <div class="stkn0612-cell stkn0612-cell--narrow min-w-0">
            <div class="stkn0612-sg-label">품목구분</div>
            <div class="stkn0612-cell-field min-w-0">
              <select
                class="stkn0612-sg-select"
                v-model="scond2"
                @change="setLossType">
                <option
                  :value="i.strDCode"
                  v-for="i in optionList"
                  :key="i.strDCode">
                  {{ i.strDName }}
                </option>
              </select>
            </div>
          </div>
          <div class="stkn0612-cell min-w-0">
            <div class="stkn0612-sg-label">품목명</div>
            <div class="stkn0612-cell-field min-w-0">
              <input type="text" class="stkn0612-sg-input" v-model="scond3" />
            </div>
          </div>
        </div>
      </div>

      <div class="mt-3 min-h-0 w-full flex-1">
        <realgrid
          class="h-full min-h-0 w-full"
          :progname="'STKN06_012INS_VUE'"
          :progid="3"
          :rowStateeditable="false"
          :editableColId="'lngQty,lngLossCode'"
          :labelingColumns="'lngLossCode'"
          :fixLabelingDropdownOnShow="true"
          :hideColumnsId="popupHideLossNameColumns"
          :valuesData="valuesData"
          :labelsData="labelsData"
          @allStateRows="allStateRows2"
          @updatedRowData="updatedRowData2"
          :inputOnlyNumberColumn="'lngQty'"
          :rowData="rowData3"></realgrid>
      </div>
    </div>
  </div>
  </Teleport>

  <Teleport to="body">
  <div
    v-if="open2"
    class="stkn0612-modal-overlay"
    @mousedown.self.prevent
    @click.self.prevent>
    <div
      class="stkn0612-modal flex h-[70vh] w-[min(90vw,56rem)] flex-col rounded-lg bg-white p-5 shadow-lg"
      @mousedown.stop
      @click.stop>
      <div class="mb-3 flex shrink-0 items-center justify-between gap-3">
        <h2 class="text-xl font-bold">
          손실 등록
          <span v-if="scond4" class="ml-2 text-base font-semibold text-gray-600"
            >(손실번호 {{ scond4 }})</span
          >
        </h2>
        <div class="flex space-x-2">
          <button
            type="button"
            class="stkn0612-sub-btn disabled:opacity-30"
            @click="searchButton2"
            disabled>
            조회
          </button>
          <button type="button" class="stkn0612-sub-btn" @click="saveButton3">
            저장
          </button>
          <button type="button" class="stkn0612-sub-btn" @click="open2 = false">
            닫기
          </button>
        </div>
      </div>

      <div
        class="stkn0612-modal-panel shrink-0 rounded-lg bg-gray-200"
        :style="{
          '--stkn0612-control-border': stkn0612ControlBorder,
          '--stkn0612-item-gap': stkn0612ItemGap,
          '--stkn0612-col-gap': stkn0612ColGap,
          '--stkn0612-row-gap': stkn0612RowGap,
          '--stkn0612-label-col': stkn0612LabelCol,
        }">
        <div class="stkn0612-modal-grid min-w-0">
          <div class="stkn0612-cell stkn0612-cell--narrow min-w-0">
            <div class="stkn0612-sg-label">일자</div>
            <div class="stkn0612-cell-field min-w-0">
              <input
                type="date"
                class="stkn0612-sg-input"
                disabled
                v-model="scond" />
            </div>
          </div>
          <div class="stkn0612-cell stkn0612-cell--store min-w-0">
            <div class="stkn0612-sg-label">매장</div>
            <div
              class="stkn0612-cell-field stkn0612-pick-slot stkn0612-pick-slot--store-grid stkn0612-pick-slot--modal-legacy min-w-0">
              <PickStore
                compact-search-bar
                :compact-store-combo-max-rem="40"
                main-name=""
                :hideGroup="false"
                :hideAttr="false"
                :setDefaultStoreCd="tempStoreCd"
                :disabledAll="true"
                @update:storeGroup="lngStoreGroup2"
                @update:storeCd="lngStoreCode2" />
            </div>
          </div>
          <div class="stkn0612-cell stkn0612-cell--narrow min-w-0">
            <div class="stkn0612-sg-label">품목구분</div>
            <div class="stkn0612-cell-field min-w-0">
              <select
                class="stkn0612-sg-select"
                disabled
                v-model="scond2"
                @change="setLossType">
                <option
                  :value="i.strDCode"
                  v-for="i in optionList"
                  :key="i.strDCode">
                  {{ i.strDName }}
                </option>
              </select>
            </div>
          </div>
          <div class="stkn0612-cell min-w-0">
            <div class="stkn0612-sg-label">품목명</div>
            <div class="stkn0612-cell-field min-w-0">
              <input
                type="text"
                class="stkn0612-sg-input"
                @input="searchRow"
                v-model="scond3" />
            </div>
          </div>
        </div>
      </div>

      <div class="mt-3 min-h-0 w-full flex-1">
        <realgrid
          class="h-full min-h-0 w-full"
          :progname="'STKN06_012INS_VUE'"
          :progid="3"
          :rowStateeditable="false"
          :editableColId="'lngQty,lngLossCode'"
          :labelingColumns="'lngLossCode'"
          :fixLabelingDropdownOnShow="true"
          :hideColumnsId="popupHideLossNameColumns"
          :valuesData="valuesData"
          :labelsData="labelsData"
          @allStateRows="allStateRows3"
          @updatedRowData="updatedRowData3"
          :inputOnlyNumberColumn="'lngQty'"
          :searchColId="'strItemName'"
          :searchWord3="scond3"
          :rowData="rowData4"></realgrid>
      </div>
    </div>
  </div>
  </Teleport>
  <!-- 그리드 영역 -->
</template>

<script setup>
import { getCommonList } from "@/api/common";
import {
  deleteLossStock,
  getLossMasterList,
  getLossStockDetail,
  getLossStockItemDetailList,
  getLossStockItemList,
  getLossTypeList,
  getStockCheckLossByUpdate,
  saveLossMaster,
  updateLossMasterDetail,
} from "@/api/mistock";
import Datepicker2 from "@/components/Datepicker2.vue";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
import PickStore from "@/components/pickStore.vue";
import PickStoreRenew from "@/components/pickStoreRenew.vue";
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

import { onMounted, onUnmounted, ref, watch } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";

const stkn0612ControlBorder = "#cbd5e1";
const stkn0612ItemGap = "0.75rem";
const stkn0612ColGap = "1.25rem";
const stkn0612RowGap = "0.5625rem";
const stkn0612LabelCol = "5.5rem";

/**
 * 	화면 Load시 실행 스크립트
 */
const disabledAll2 = ref(false);
const defaultStore = ref(false);
const defaultStoreType2 = ref(true);
onMounted(async () => {
  if (store.state.userData.lngPositionType == "1") {
    defaultStore.value = true;
  } else {
    defaultStore.value = false;
  }
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getCommonList(52);

  optionList.value = res.data.List;

  scond.value = formatLocalDate(new Date());
});

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

const cond = ref("02");
const cond2 = ref("01");

const cond5 = ref(0);
const store = useStore();

const datepicker = ref(null);
const closePopUp = ref(false);
const optionList = ref([]);
const optionList2 = ref([]);

const scond = ref("");
const scond2 = ref("01");
const scond3 = ref("");
const scond4 = ref("");
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

const storeCode = ref();
const lngStoreCode = (e) => {
  initGrid();
  storeCode.value = e;
};

const groupCd = ref();
const lngStoreGroup = (e) => {
  groupCd.value = e;
};

const storeCode2 = ref();
const lngStoreCode2 = (e) => {
  initGrid2();
  storeCode2.value = e;
};

const groupCd2 = ref(store.state.userData.lngStoreGroup);
const lngStoreGroup2 = (e) => {
  groupCd2.value = e;
};

const supplierid = ref("");
const SupplierId = (e) => {
  supplierid.value = e;
};
/**
 *  조회 함수
 */
const hideColumnsId = ref([]);
/** 팝업 — 손실명 중복컬럼 숨김. 선택은 lngLossCode(lookupDisplay=명칭) */
const popupHideLossNameColumns = ["strLossName"];

const searchButton = async () => {
  try {
    store.state.loading = true;
    initGrid();

    const res = await getLossMasterList(
      groupCd.value,
      storeCode.value,
      sDate.value.replaceAll("-", ""),
      eDate.value.replaceAll("-", "")
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

const rowData3 = ref([]);
const labelsData = ref([[]]);
const valuesData = ref([[]]);
const searchButton2 = async () => {
  if (storeCode2.value == 0) {
    Swal.fire({
      title: "경고",
      text: "매장을 먼저 선택해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }
  try {
    store.state.loading = true;
    initGrid2();

    try {
      const res = await getLossTypeList(groupCd2.value, scond2.value);

      //console.log(res);
      labelsData.value = [res.data.List.map((item) => item.strLossName)];
      valuesData.value = [res.data.List.map((item) => item.lngLossCode)];
    } catch (error) {}

    const res = await getLossStockItemList(
      groupCd2.value,
      storeCode2.value,
      scond2.value,
      scond3.value
    );

    rowData3.value = res.data.List;
    //console.log(res);
    afterSearch2.value = true;
  } catch (error) {
    afterSearch2.value = false;
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
const progid = ref(1);
const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }

  reload.value = !reload.value;
};

const afterSearch2 = ref(false);
const initGrid2 = () => {
  if (rowData3.value.length > 0) {
    rowData3.value = [];
  }
  afterSearch2.value = false;
  reload.value = !reload.value;
};

const initGrid3 = () => {
  if (rowData4.value.length > 0) {
    rowData4.value = [];
  }
  afterSearch3.value = false;
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

const startDate = (e) => {
  sDate.value = e;
};
const endDate = (e) => {
  eDate.value = e;
};

const rowData2 = ref([]);

const tempDeleteLoss = ref("");
const clickedRowData = async (e) => {
  try {
    const res = await getLossStockDetail(e[0], e[1], e[4]);

    rowData2.value = res.data.List;
    tempDeleteLoss.value = e;
  } catch (error) {}
  //console.log(e);
};

const open = ref(false);
/** 신규 팝업 매장 초기값 (부모 조회 AREA에서 선택한 매장) */
const popupDefaultStoreCd = ref("");
const addButton = async () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 진행해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }
  scond4.value = "";
  // 부모에서 선택한 매장·그룹을 팝업에 반영 (관리자는 이후 수정 가능)
  groupCd2.value = groupCd.value ?? store.state.userData.lngStoreGroup;
  storeCode2.value =
    storeCode.value === undefined || storeCode.value === null
      ? 0
      : storeCode.value;
  popupDefaultStoreCd.value = storeCode2.value;
  try {
    const res = await getLossTypeList(groupCd2.value, scond2.value);

    //console.log(res);

    labelsData.value = [res.data.List.map((item) => item.strLossName)];
    valuesData.value = [res.data.List.map((item) => item.lngLossCode)];
  } catch (error) {}
  // 손실명 콤보 values/labels 준비 후 팝업 오픈 (그리드 초기화 시 목록 반영)
  open.value = true;
};

const setLossType = async (e) => {
  scond2.value = e.target.value;
  initGrid2();
  try {
    const res = await getLossTypeList(groupCd2.value, scond2.value);
    labelsData.value = [res.data.List.map((item) => item.strLossName)];
    valuesData.value = [res.data.List.map((item) => item.lngLossCode)];
  } catch (error) {}
};

/** 팝업 저장 전 — 손실명/수량 검증. 실패 시 true */
const validatePopupLossSaveRows = (rows, changedIndexes) => {
  const targets = (rows || []).filter((_, index) =>
    changedIndexes.includes(index)
  );
  const lossSelectedQtyMissing = targets.some((item) => {
    const hasLoss =
      item.lngLossCode != null &&
      item.lngLossCode !== "" &&
      item.lngLossCode != 0;
    const qtyMissing = item.lngQty == null || item.lngQty === "" || item.lngQty == 0;
    return hasLoss && qtyMissing;
  });
  if (lossSelectedQtyMissing) {
    Swal.fire({
      title: "경고",
      text: "항목을 표시하고 손실 수량을 입력해 주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return true;
  }
  const incomplete = targets.some(
    (item) =>
      item.lngLossCode == undefined ||
      item.lngLossCode == 0 ||
      item.lngQty == 0 ||
      item.lngQty == undefined
  );
  if (incomplete) {
    Swal.fire({
      title: "경고",
      text: "손실명과 수량은 필히 입력하셔야 합니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return true;
  }
  return false;
};

const saveButton2 = async () => {
  if (allstaterows2.value.length == 0) {
    Swal.fire({
      title: "경고",
      text: "저장할 사항이 존재하지 않습니다.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }
  // if (storeCode2.value == 0) {
  //   Swal.fire({
  //     title: "경고",
  //     text: "매장을 먼저 선택해주세요.",
  //     icon: "warning",

  //     confirmButtonText: "확인",
  //   });
  //   return;
  // }

  if (validatePopupLossSaveRows(updatedrowdata2.value, allstaterows2.value)) {
    return;
  }

  Swal.fire({
    title: "알림",
    text: "저장 하시겠습니까?",
    icon: "question",

    confirmButtonText: "확인",
    cancelButtonText: "취소",
    showCancelButton: true,
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const itemids = updatedrowdata2.value
          .filter((item, index) => allstaterows2.value.includes(index))
          .map((item) => item.lngItemID)
          .join("\u200b");
        const qtys = updatedrowdata2.value
          .filter((item, index) => allstaterows2.value.includes(index))
          .map((item) => item.lngQty)
          .join("\u200b");
        const losscodes = updatedrowdata2.value
          .filter((item, index) => allstaterows2.value.includes(index))
          .map((item) => item.lngLossCode)
          .join("\u200b");
        const res = await saveLossMaster(
          groupCd2.value,
          storeCode2.value,
          scond.value.replaceAll("-", ""),
          itemids,
          qtys,
          losscodes,
          store.state.userData.lngSequence,
          scond2.value
        );
        console.log(res);
        if (res.data.RESULT_CD == "00") {
          await Swal.fire({
            title: "성공",
            text: "저장을 완료하였습니다.",
            icon: "success",

            confirmButtonText: "확인",
          });
        } else {
          await Swal.fire({
            title: "실패",
            text: `${res.data.RESULT_NM}`,
            icon: "error",

            confirmButtonText: "확인",
          });
          return;
        }
        //console.log(res);
      } catch (error) {
      } finally {
        open.value = false;
        searchButton();
      }
    } else {
      return;
    }
  });
};

const allstaterows2 = ref([]);
const allStateRows2 = (e) => {
  // //console.log(e);
  allstaterows2.value = e.updated;
};

const allstaterows3 = ref([]);
const allStateRows3 = (e) => {
  // //console.log(e);
  allstaterows3.value = e.updated;
};

const updatedrowdata2 = ref([]);
const updatedRowData2 = (e) => {
  // //console.log(e);
  updatedrowdata2.value = e;
};

const updatedrowdata3 = ref([]);
const updatedRowData3 = (e) => {
  // //console.log(e);
  updatedrowdata3.value = e;
};

const open2 = ref(false);

/** 품절(MST56)과 동일 — 모달 안 RealGrid 드롭다운(.rg-dropdownlist)이 뒤에 가려지지 않게 */
let stkn0612DropdownObserver = null;
const elevatePopupLossDropdownList = () => {
  if (!document.body.classList.contains("stkn0612-modal-open")) return;
  const lists = document.querySelectorAll(".rg-dropdownlist");
  for (const el of lists) {
    const rect = el.getBoundingClientRect();
    el.style.position = "fixed";
    el.style.left = `${rect.left}px`;
    el.style.top = `${rect.top}px`;
    el.style.minWidth = `${Math.max(rect.width, 120)}px`;
    el.style.zIndex = "10100";
    el.style.maxHeight = "240px";
    el.style.overflow = "auto";
    el.style.pointerEvents = "auto";
  }
};

const renamePopupLossCodeHeader = () => {
  document
    .querySelectorAll(".stkn0612-modal [class*='rg-header']")
    .forEach((el) => {
      const t = el.textContent?.trim();
      if (t === "손실코드") {
        el.childNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE && node.textContent?.includes("손실코드")) {
            node.textContent = node.textContent.replace("손실코드", "손실명");
          }
        });
        if (el.textContent?.trim() === "손실코드") {
          el.textContent = "손실명";
        }
      }
    });
};

const startPopupDropdownGuard = () => {
  stopPopupDropdownGuard();
  stkn0612DropdownObserver = new MutationObserver(() => {
    requestAnimationFrame(() => {
      elevatePopupLossDropdownList();
      renamePopupLossCodeHeader();
    });
  });
  stkn0612DropdownObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
  requestAnimationFrame(renamePopupLossCodeHeader);
  setTimeout(renamePopupLossCodeHeader, 300);
  setTimeout(renamePopupLossCodeHeader, 800);
};

const stopPopupDropdownGuard = () => {
  if (stkn0612DropdownObserver) {
    stkn0612DropdownObserver.disconnect();
    stkn0612DropdownObserver = null;
  }
};

/** 팝업 열림 시 뒤 화면 스크롤·포커스 차단 */
const syncModalLock = () => {
  const locked = open.value || open2.value;
  document.body.classList.toggle("stkn0612-modal-open", locked);
  document.documentElement.classList.toggle("stkn0612-modal-open", locked);
  if (locked) {
    startPopupDropdownGuard();
  } else {
    stopPopupDropdownGuard();
  }
};
watch([open, open2], syncModalLock, { immediate: true });
onUnmounted(() => {
  stopPopupDropdownGuard();
  document.body.classList.remove("stkn0612-modal-open");
  document.documentElement.classList.remove("stkn0612-modal-open");
});

const rowData4 = ref([]);
const afterSearch3 = ref(false);

const tempLossNo = ref("");
const tempStoreCd = ref("");
const dblclickedRowData = async (e) => {
  //console.log(e);
  scond4.value = e[4];
  tempStoreCd.value = e[1];
  groupCd2.value = e[0];
  storeCode2.value = e[1];
  tempLossNo.value = e[4];
  try {
    store.state.loading = true;
    initGrid3();

    try {
      const res = await getLossTypeList(groupCd2.value, scond2.value);

      //console.log(res);
      labelsData.value = [res.data.List.map((item) => item.strLossName)];
      valuesData.value = [res.data.List.map((item) => item.lngLossCode)];
    } catch (error) {}

    const res = await getLossStockItemDetailList(e[0], e[1], e[4]);

    rowData4.value = res.data.List;
    //console.log(res);
    afterSearch3.value = true;
    // 손실명 콤보 목록 준비 후 팝업 오픈
    open2.value = true;
  } catch (error) {
    afterSearch3.value = false;
    //comsole.log(error);
  } finally {
    store.state.loading = false;
  }
};

const searchRow = (e) => {
  //console.log(e.target.value);
  scond3.value = e.target.value;
};

const saveButton3 = async () => {
  if (allstaterows3.value.length == 0) {
    Swal.fire({
      title: "경고",
      text: "저장할 사항이 존재하지 않습니다.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }

  if (validatePopupLossSaveRows(updatedrowdata3.value, allstaterows3.value)) {
    return;
  }

  Swal.fire({
    title: "알림",
    text: "저장 하시겠습니까?",
    icon: "question",

    confirmButtonText: "확인",
    cancelButtonText: "취소",
    showCancelButton: true,
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const res = await getStockCheckLossByUpdate(
          groupCd2.value,
          storeCode2.value,
          tempLossNo.value
        );
        console.log(res);

        if (res.data.List[0].blnClosed != "False") {
          await Swal.fire({
            title: "경고",
            text: "해당 일자는 이미 마감되어 수정하실 수 없습니다.",
            icon: "warning",

            confirmButtonText: "확인",
          });
          return;
        }
      } catch (error) {}

      try {
        const itemids = updatedrowdata3.value
          .filter((item, index) => allstaterows3.value.includes(index))
          .map((item) => item.lngItemID)
          .join("\u200b");
        const qtys = updatedrowdata3.value
          .filter((item, index) => allstaterows3.value.includes(index))
          .map((item) => item.lngQty)
          .join("\u200b");
        const losscodes = updatedrowdata3.value
          .filter((item, index) => allstaterows3.value.includes(index))
          .map((item) => item.lngLossCode)
          .join("\u200b");
        const res = await updateLossMasterDetail(
          groupCd2.value,
          storeCode2.value,
          tempLossNo.value,
          itemids,
          losscodes,
          qtys,
          store.state.userData.lngSequence
        );

        if (res.data.RESULT_CD == "00") {
          await Swal.fire({
            title: "성공",
            text: "저장을 완료하였습니다.",
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
        //console.log(res);
      } catch (error) {
      } finally {
        open2.value = false;
        searchButton();
      }
    } else {
      return;
    }
  });
};

const deleteButton = async () => {
  if (
    tempDeleteLoss.value.length == 0 ||
    tempDeleteLoss.value == undefined ||
    afterSearch.value == false
  ) {
    Swal.fire({
      title: "경고",
      text: "삭제할 대상을 선택해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }
  //console.log(tempDeleteLoss.value);

  Swal.fire({
    title: "알림",
    text: "삭제 하시겠습니까?",
    icon: "question",

    confirmButtonText: "확인",
    cancelButtonText: "취소",
    showCancelButton: true,
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const res = await deleteLossStock(
          tempDeleteLoss.value[0],
          tempDeleteLoss.value[1],
          tempDeleteLoss.value[4]
        );

        //console.log(res);

        if (res.data.RESULT_CD == "00") {
          await Swal.fire({
            title: "성공",
            text: "삭제를 완료하였습니다.",
            icon: "success",

            confirmButtonText: "확인",
          });
        } else {
          await Swal.fire({
            title: "실패",
            text: "삭제에 실패하였습니다.",
            icon: "error",

            confirmButtonText: "확인",
          });
        }
      } catch (error) {
      } finally {
        rowData2.value = [];
        searchButton();
      }
    } else {
      return;
    }
  });
};
</script>

<style scoped>
/* STKN06_016과 동일 — 반응형 wire 조회 AREA */
.stkn0612-search-panel {
  --stkn0612-panel-pad-x: 2rem;
  box-sizing: border-box;
  padding-left: 0;
  padding-right: 0;
  padding-block: 0.75rem;
  overflow-x: auto;
}

@media (min-width: 640px) {
  .stkn0612-search-panel {
    --stkn0612-panel-pad-x: 2.5rem;
  }
}

@media (min-width: 768px) {
  .stkn0612-search-panel {
    --stkn0612-panel-pad-x: 3rem;
  }
}

@media (min-width: 1024px) {
  .stkn0612-search-panel {
    --stkn0612-panel-pad-x: 3.5rem;
  }
}

.stkn0612-search-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.35fr);
  column-gap: var(--stkn0612-col-gap);
  row-gap: var(--stkn0612-row-gap);
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  padding-left: var(--stkn0612-panel-pad-x);
  padding-right: var(--stkn0612-panel-pad-x);
  --stkn0612-row-min-h: 2rem;
  --stkn0612-control-h: 2rem;
  --stkn0612-left-field-w: calc(
    9rem + 9rem + 2rem + 0.125rem * 3 + 0.125rem + 0.9rem
  );
}

.stkn0612-cell {
  display: flex;
  min-width: 0;
  min-height: var(--stkn0612-row-min-h);
  align-items: center;
  gap: var(--stkn0612-item-gap);
  width: 100%;
  max-width: 100%;
}

.stkn0612-cell--store {
  min-width: 0;
}

.stkn0612-sg-label {
  flex: 0 0 var(--stkn0612-label-col);
  width: var(--stkn0612-label-col);
  min-width: 0;
  max-width: var(--stkn0612-label-col);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 0.9375rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stkn0612-cell-field {
  min-width: 0;
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 100%;
}

.stkn0612-date-slot {
  width: 100%;
  max-width: min(100%, var(--stkn0612-left-field-w));
  min-width: 0;
}

.stkn0612-pick-slot {
  flex: 1 1 auto;
  width: 100%;
  max-width: 100%;
  min-width: 0;
}

.stkn0612-date-slot :deep(> div.flex.justify-start.items-center) {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0;
  gap: 0.25rem !important;
  margin-left: 0;
  padding-left: 0;
}

.stkn0612-date-slot :deep(> div.flex > div.inline-flex.h-8) {
  flex: 1 1 auto;
  min-width: 0;
  width: auto !important;
  max-width: 100%;
  gap: 0.125rem !important;
}

.stkn0612-date-slot :deep(input[type="date"]) {
  border: 1px solid var(--stkn0612-control-border) !important;
  box-sizing: border-box;
  flex: 1 1 0;
  width: 9rem !important;
  min-width: 0;
  max-width: 9rem;
  height: var(--stkn0612-control-h) !important;
  min-height: var(--stkn0612-control-h) !important;
  max-height: var(--stkn0612-control-h) !important;
  padding-left: 0.45rem;
  padding-right: 0.25rem;
  font-size: 0.875rem !important;
  line-height: 1.25rem !important;
  border-radius: 0.375rem;
}

.stkn0612-date-slot :deep(input[type="date"]:focus) {
  border-color: #3b82f6 !important;
}

.stkn0612-pick-slot :deep(> div.flex) {
  margin: 0 !important;
  margin-top: 0 !important;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  flex-wrap: nowrap;
  align-items: center;
  gap: var(--stkn0612-item-gap) !important;
  justify-content: flex-start !important;
}

.stkn0612-pick-slot :deep(> div.flex > div:has(select)) {
  flex: 1 1 0;
  min-width: 0;
}

.stkn0612-pick-slot :deep(> div.flex > div:nth-child(1) select),
.stkn0612-pick-slot :deep(> div.flex > div:nth-child(2) select) {
  box-sizing: border-box;
  height: var(--stkn0612-control-h) !important;
  min-height: var(--stkn0612-control-h) !important;
  max-height: var(--stkn0612-control-h) !important;
  margin-left: 0 !important;
  padding: 0 0.375rem !important;
  font-family: inherit !important;
  font-size: 0.875rem !important;
  font-weight: 400 !important;
  line-height: 1.25rem !important;
  color: rgb(55 65 81) !important;
  background-color: #fff !important;
  border-radius: 0.375rem !important;
  border: 1px solid var(--stkn0612-control-border) !important;
  width: 100% !important;
  max-width: 100% !important;
  -webkit-appearance: none !important;
  appearance: none !important;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%236b7280' d='M1.4 0.6L6 5.2 10.6 0.6 12 2 6 8 0 2z'/%3E%3C/svg%3E") !important;
  background-repeat: no-repeat !important;
  background-position: right 0.4rem center !important;
  background-size: 0.65rem 0.45rem !important;
  padding-right: 1.25rem !important;
}

.stkn0612-pick-slot :deep(> div.flex > div:nth-child(2) select) {
  padding-left: 0.25rem !important;
  padding-right: 1.25rem !important;
}

.stkn0612-pick-slot :deep(> div.flex > div:last-child) {
  flex: 1 1 0;
  min-width: 0;
  max-width: 100%;
}

.stkn0612-pick-slot :deep(.custom-select) {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important;
  margin-left: 0 !important;
  font-size: 0.875rem !important;
  font-weight: 400 !important;
  line-height: 1.25rem !important;
  color: rgb(55 65 81) !important;
}

.stkn0612-pick-slot
  :deep(.custom-select.custom-select--compact .vs__dropdown-toggle) {
  box-sizing: border-box;
  height: var(--stkn0612-control-h) !important;
  min-height: var(--stkn0612-control-h) !important;
  max-height: var(--stkn0612-control-h) !important;
  padding: 0 0.375rem !important;
  border: 1px solid var(--stkn0612-control-border) !important;
  border-radius: 0.375rem !important;
  background-color: #fff !important;
  overflow: hidden !important;
  flex-wrap: nowrap !important;
  align-items: center !important;
}

.stkn0612-pick-slot
  :deep(.custom-select.custom-select--compact .vs__selected-options) {
  flex: 1 1 auto !important;
  flex-wrap: nowrap !important;
  min-width: 0 !important;
  max-width: 100% !important;
  overflow: hidden !important;
  padding: 0 !important;
  margin: 0 !important;
  align-items: center !important;
}

.stkn0612-pick-slot
  :deep(.custom-select.custom-select--compact .vs__selected),
.stkn0612-pick-slot
  :deep(.custom-select.custom-select--compact .vs__search),
.stkn0612-pick-slot
  :deep(.custom-select.custom-select--compact .pickstore-selected-text) {
  display: block !important;
  box-sizing: border-box !important;
  font-family: inherit !important;
  font-size: 0.875rem !important;
  font-weight: 400 !important;
  line-height: calc(var(--stkn0612-control-h) - 2px) !important;
  height: auto !important;
  min-height: 0 !important;
  min-width: 0 !important;
  max-width: 100% !important;
  margin: 0 !important;
  margin-top: 0 !important;
  padding: 0 !important;
  padding-top: 0 !important;
  color: rgb(55 65 81) !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}

.stkn0612-pick-slot
  :deep(.custom-select.custom-select--compact .vs__search::placeholder),
.stkn0612-pick-slot
  :deep(.custom-select.custom-select--compact .vs__selected) {
  color: rgb(55 65 81) !important;
}

.stkn0612-pick-slot
  :deep(.custom-select.custom-select--compact .vs__dropdown-menu) {
  font-size: 0.875rem !important;
  font-weight: 400 !important;
}

.stkn0612-pick-slot
  :deep(.custom-select.custom-select--compact .vs__dropdown-option) {
  font-size: 0.875rem !important;
  font-weight: 400 !important;
  line-height: 1.25rem !important;
  padding: 0.35rem 0.5rem !important;
}

/* 3번째(v-select) 화살표를 1·2번 native select 톤에 맞춤 */
.stkn0612-pick-slot :deep(.custom-select .vs__actions) {
  padding: 0 2px 0 0 !important;
}

.stkn0612-pick-slot :deep(.custom-select .vs__clear) {
  display: none !important;
}

.stkn0612-pick-slot :deep(.custom-select .vs__open-indicator) {
  fill: rgb(107 114 128) !important;
  transform: scale(0.55) !important;
  transition: transform 0.15s ease;
}

.stkn0612-pick-slot :deep(.custom-select.vs--open .vs__open-indicator) {
  transform: scale(0.55) rotate(180deg) !important;
}

/* 매장 3콤보 — 비율 유지하며 열 폭에 맞춰 축소 */
.stkn0612-pick-slot--store-grid :deep(> div.flex) {
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.3fr) minmax(0, 1.7fr) !important;
  width: 100% !important;
  min-width: 0 !important;
  max-width: 100% !important;
  flex-wrap: unset !important;
  align-items: stretch !important;
  gap: var(--stkn0612-item-gap) !important;
}

.stkn0612-pick-slot--store-grid
  :deep(> div.flex > div:nth-child(1) select),
.stkn0612-pick-slot--store-grid
  :deep(> div.flex > div:nth-child(2) select) {
  width: 100% !important;
  max-width: 100% !important;
}

.stkn0612-pick-slot--store-grid :deep(> div.flex > div:last-child) {
  flex: unset !important;
  width: 100% !important;
  min-width: 0 !important;
  max-width: 100% !important;
}

.stkn0612-pick-slot--store-grid
  :deep(> div.flex > div:last-child .custom-select) {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important;
  margin-left: 0 !important;
}

/* 보조버튼 — ACT09 / PUR 서브 버튼 톤 */
.stkn0612-sub-btn {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  height: 2rem;
  min-height: 2rem;
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

.stkn0612-sub-btn:hover:not(:disabled) {
  background-color: rgb(219 234 254);
  border-color: rgb(96 165 250);
}

.stkn0612-sub-btn:disabled {
  cursor: not-allowed;
}

/* 팝업 — 뒤 화면 클릭/조작 차단 (헤더·그리드보다 위) */
.stkn0612-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 10050;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(0 0 0 / 0.5);
  pointer-events: auto;
  touch-action: none;
}

.stkn0612-modal {
  position: relative;
  z-index: 1;
  pointer-events: auto;
  touch-action: auto;
  overflow: visible;
}

.stkn0612-pick-slot :deep(.custom-select .vs__dropdown-menu) {
  z-index: 20 !important;
}

@media (max-width: 1023px) {
  .stkn0612-search-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}

/* ───── 팝업 조회 AREA (이 화면 전용, 공통 컴포넌트 아님) ───── */
.stkn0612-modal-panel {
  --stkn0612-panel-pad-x: 1.25rem;
  --stkn0612-row-min-h: 2rem;
  --stkn0612-control-h: 2rem;
  box-sizing: border-box;
  padding-block: 0.75rem;
  /* 매장 콤보 드롭다운이 잘리지 않도록 (가로 스크롤은 그리드에서 처리) */
  overflow: visible;
}

.stkn0612-modal-grid {
  display: grid;
  /* 좌(일자·품목구분) 고정 축소, 우(매장·품목명)이 나머지 */
  grid-template-columns: minmax(0, 15.5rem) minmax(0, 1fr);
  column-gap: var(--stkn0612-col-gap);
  row-gap: var(--stkn0612-row-gap);
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  padding-left: var(--stkn0612-panel-pad-x);
  padding-right: var(--stkn0612-panel-pad-x);
}

/* 일자·품목구분 — 날짜 입력 폭에 맞춰 축소 (매장과 겹침 방지) */
.stkn0612-cell--narrow > .stkn0612-cell-field {
  flex: 0 0 9rem;
  width: 9rem;
  max-width: 9rem;
}

.stkn0612-sg-input,
.stkn0612-sg-select {
  box-sizing: border-box;
  height: var(--stkn0612-control-h);
  min-height: var(--stkn0612-control-h);
  max-height: var(--stkn0612-control-h);
  width: 100%;
  min-width: 0;
  padding: 0 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: rgb(55 65 81);
  background: #fff;
  border: 1px solid var(--stkn0612-control-border);
  border-radius: 0.375rem;
}

.stkn0612-sg-input:focus,
.stkn0612-sg-select:focus {
  outline: none;
  border-color: #3b82f6;
}

.stkn0612-sg-input:disabled,
.stkn0612-sg-select:disabled {
  background: #f8fafc;
  color: rgb(71 85 105);
}

/* 수정 팝업 — PickStore compact를 신규(PickStoreRenew)와 같은 3콤보 그리드로 */
.stkn0612-pick-slot--modal-legacy :deep(> div.flex) {
  margin: 0 !important;
  margin-top: 0 !important;
  margin-left: 0 !important;
  width: 100% !important;
  min-width: 0 !important;
  max-width: 100% !important;
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.3fr) minmax(0, 1.7fr) !important;
  gap: var(--stkn0612-item-gap) !important;
  align-items: center !important;
  justify-content: flex-start !important;
}

/* 빈 mainName 라벨 칸 제거 → 3콤보만 배치 */
.stkn0612-pick-slot--modal-legacy :deep(> div.flex > div:first-child) {
  display: none !important;
}

.stkn0612-pick-slot--modal-legacy :deep(> div.flex > div:nth-child(2)),
.stkn0612-pick-slot--modal-legacy :deep(> div.flex > div:nth-child(3)),
.stkn0612-pick-slot--modal-legacy :deep(> div.flex > div:nth-child(4)) {
  display: block !important;
  width: 100% !important;
  min-width: 0 !important;
  max-width: 100% !important;
  margin: 0 !important;
}

.stkn0612-pick-slot--modal-legacy :deep(select) {
  display: block !important;
  box-sizing: border-box !important;
  height: var(--stkn0612-control-h) !important;
  min-height: var(--stkn0612-control-h) !important;
  max-height: var(--stkn0612-control-h) !important;
  width: 100% !important;
  min-width: 0 !important;
  max-width: 100% !important;
  margin: 0 !important;
  padding: 0 1.25rem 0 0.375rem !important;
  border: 1px solid var(--stkn0612-control-border) !important;
  border-radius: 0.375rem !important;
  font-family: inherit !important;
  font-size: 0.875rem !important;
  font-weight: 400 !important;
  line-height: 1.25rem !important;
  color: rgb(55 65 81) !important;
  background-color: #f8fafc !important;
  -webkit-appearance: none !important;
  appearance: none !important;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%236b7280' d='M1.4 0.6L6 5.2 10.6 0.6 12 2 6 8 0 2z'/%3E%3C/svg%3E") !important;
  background-repeat: no-repeat !important;
  background-position: right 0.4rem center !important;
  background-size: 0.65rem 0.45rem !important;
}

/* 3번 v-select — 1·2번 native select와 동일 톤 (disabled #000 덮어쓰기) */
.stkn0612-pick-slot--modal-legacy :deep(.pickstore-vs-shell) {
  box-sizing: border-box !important;
  height: var(--stkn0612-control-h) !important;
  min-height: var(--stkn0612-control-h) !important;
  max-height: var(--stkn0612-control-h) !important;
  width: 100% !important;
  min-width: 0 !important;
  max-width: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
  border: 1px solid var(--stkn0612-control-border) !important;
  border-radius: 0.375rem !important;
  background: #f8fafc !important;
  overflow: hidden !important;
}

.stkn0612-pick-slot--modal-legacy :deep(.custom-select),
.stkn0612-pick-slot--modal-legacy :deep(.v-select),
.stkn0612-pick-slot--modal-legacy :deep(.style-chooser) {
  width: 100% !important;
  min-width: 0 !important;
  max-width: 100% !important;
  margin: 0 !important;
  font-size: 0.875rem !important;
  font-weight: 400 !important;
  color: rgb(55 65 81) !important;
  --vs-selected-color: rgb(55 65 81);
  --vs-search-input-color: rgb(55 65 81);
  --vs-controls-color: rgb(107 114 128);
  --vs-border-color: transparent;
}

.stkn0612-pick-slot--modal-legacy :deep(.style-chooser.vs--disabled) {
  --vs-state-disabled-color: rgb(55 65 81);
  --vs-disabled-color: rgb(55 65 81);
  --vs-selected-color: rgb(55 65 81);
  --vs-search-input-color: rgb(55 65 81);
  --vs-colors--light: rgb(55 65 81);
  opacity: 1 !important;
}

.stkn0612-pick-slot--modal-legacy :deep(.vs__dropdown-toggle) {
  box-sizing: border-box !important;
  height: 100% !important;
  min-height: 0 !important;
  max-height: 100% !important;
  width: 100% !important;
  padding: 0 0.375rem !important;
  border: none !important;
  border-radius: 0.375rem !important;
  background: transparent !important;
  box-shadow: none !important;
}

.stkn0612-pick-slot--modal-legacy :deep(.vs__selected),
.stkn0612-pick-slot--modal-legacy :deep(.style-chooser.vs--disabled .vs__selected),
.stkn0612-pick-slot--modal-legacy :deep(.vs__search),
.stkn0612-pick-slot--modal-legacy :deep(.pickstore-selected-text),
.stkn0612-pick-slot--modal-legacy
  :deep(.style-chooser.vs--disabled .vs__dropdown-toggle),
.stkn0612-pick-slot--modal-legacy
  :deep(.style-chooser.vs--disabled .vs__selected-options) {
  font-family: inherit !important;
  font-size: 0.875rem !important;
  font-weight: 400 !important;
  line-height: calc(var(--stkn0612-control-h) - 2px) !important;
  margin: 0 !important;
  padding: 0 !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  color: rgb(55 65 81) !important;
  -webkit-text-fill-color: rgb(55 65 81) !important;
  background: transparent !important;
  background-color: transparent !important;
  opacity: 1 !important;
}

.stkn0612-pick-slot--modal-legacy :deep(.vs__actions) {
  padding: 0 2px 0 0 !important;
}

.stkn0612-pick-slot--modal-legacy :deep(.vs__clear) {
  display: none !important;
}

.stkn0612-pick-slot--modal-legacy :deep(.vs__open-indicator),
.stkn0612-pick-slot--modal-legacy :deep(.style-chooser .vs__open-indicator) {
  fill: rgb(107 114 128) !important;
  transform: scale(0.55) !important;
}

@media (max-width: 767px) {
  .stkn0612-modal-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>

<style>
/* 팝업 열림 시 뒤 레이어 스크롤 잠금 (body overflow는 append-to-body 콤보를 가릴 수 있어 html만) */
html.stkn0612-modal-open {
  overflow: hidden !important;
}
body.stkn0612-modal-open {
  touch-action: none;
}

/*
 * compact PickStoreRenew는 append-to-body라 메뉴가 .custom-select 밖으로 나감.
 * 모달(z:10050)보다 위에 두어야 매장명 리스트가 보임.
 */
body.stkn0612-modal-open .vs__dropdown-menu {
  z-index: 10100 !important;
}

/* 품절(MST56)과 동일 — RealGrid 손실 콤보 목록이 모달 뒤로 깔리지 않게 */
body.stkn0612-modal-open .stkn0612-modal {
  overflow: visible !important;
}

body.stkn0612-modal-open .rg-dropdownlist,
body.stkn0612-modal-open [class*="rg-dropdown-list"] {
  z-index: 10100 !important;
  pointer-events: auto !important;
}

body.stkn0612-modal-open .rg-dropdown-item {
  pointer-events: auto !important;
}
</style>
