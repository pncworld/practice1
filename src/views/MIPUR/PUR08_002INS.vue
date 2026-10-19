<!-- /*--############################################################################
# Filename : PUR08_002INS.vue                                                  
# Description : 구매관리2 > 구매 관리 > 매장간 입고 확정                   
# Date :2025-09-29                                                             
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
        <button @click="confirmButton" class="button save w-auto xcel">
          확정
        </button>
        <button
          type="button"
          @click="cancelButton"
          class="button primary confirm-cancel w-auto">
          <svg
            class="pur802-confirm-cancel-icon"
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false">
            <!-- ⨂ 원 + X -->
            <circle
              cx="12"
              cy="12"
              r="8.25"
              fill="none"
              stroke="currentColor"
              stroke-width="2" />
            <path
              d="M9.2 9.2l5.6 5.6M14.8 9.2l-5.6 5.6"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round" />
          </svg>
          확정취소
        </button>
        <button @click="excelButton" class="button save w-auto excel">
          엑셀
        </button>
      </div>
    </div>
    <div
      class="pur802-search-panel z-10 mt-3 w-full min-h-0 shrink-0 rounded-lg bg-gray-200">
      <div
        class="pur802-wire-grid min-w-0"
        :style="{
          '--pur802-control-border': pur802ControlBorder,
          '--pur802-col-gutter': pur802ColGutter,
          '--pur802-row-gap': pur802RowGap,
          '--pur802-label-col': pur802LabelCol,
        }">
        <div class="pur802-wire-cell min-w-0">
          <div class="pur802-wire-label">보낸 매장</div>
          <div class="pur802-wire-field min-w-0">
            <div class="pur802-pick-slot min-h-0 min-w-0">
              <PickStore
                compact-search-bar
                unlock-store-combo-only
                @update:store-group="lngStoreGroup"
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
        <div class="pur802-wire-cell min-w-0">
          <div class="pur802-wire-label">받는 매장</div>
          <div class="pur802-wire-field min-w-0">
            <div class="pur802-pick-slot min-h-0 min-w-0">
              <PickStore
                compact-search-bar
                :default-store-nm="'전체'"
                :default-store="true"
                :main-name="'받는 매장'"
                @store-nm="excelStore2"
                :hide-attr="false"
                :hide-group="false"
                @update:store-cd="lngStoreCode2" />
            </div>
          </div>
        </div>
        <div class="pur802-wire-cell min-w-0">
          <div class="pur802-wire-label">이동기간</div>
          <div class="pur802-wire-field pur802-date-slot min-w-0 overflow-hidden">
            <Datepicker2
              ref="datepicker"
              omit-main-label
              filter-bar-align
              :main-name="'이동기간'"
              :close-pop-up="closePopUp"
              @start-date="startDate"
              @excel-date="excelDate"
              @end-date="endDate" />
          </div>
        </div>
        <div class="pur802-wire-cell min-w-0">
          <div class="pur802-wire-label">확정여부</div>
          <div class="pur802-wire-field min-w-0">
            <div class="pur802-confirm-row">
              <select
                id="pur08-002-confirm"
                v-model="cond2"
                class="pur802-confirm-select h-8 w-full min-w-0 rounded-md border border-solid bg-white px-1.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <!-- OPTION = getStoreStockMoveList lngOption: 9 전체, 0 미확정, 1 확정 (공통코드 24 와 API 값 불일치) -->
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
      <div class="relative h-full min-h-[min(40vh,18rem)] min-w-0 flex-1">
        <Realgrid
        :progname="'PUR08_002INS_VUE'"
        :progid="1"
        :rowData="rowData"
        :setNumberformatColumn="'dblQty,dblMoveQty'"
        :setStateBar="false"
        :documentTitle="'PUR08_002INS'"
        @updatedRowData="updatedRowData"
        :checkedRowData2Col="'Selected'"
        @selectedIndex="selectedIndex"
        @checkedRowData2="checkedRowData2"
        :documentSubTitle="documentSubTitle"
        :checkAbleExpressionVal="'1,2'"
        :checkAbleExpressionCol2="'SelectableChk'"
        :headerCheckBar="'cancled'"
        :checkAbleExpressionCol="'cancled,Selected'"
        :checkAbleExpressionVal2="'0,2'"
        :checkAbleExpressionCol3="'SelectableChk'"
        :setAllCheck="setAllCheck"
        :checkRenderEditable="true"
        :checkRowAuto="true"
        :rowStateeditable="false"
        :changeRow="changeRow"
        :changeColid="changeColid"
        :changeNow="changeNow"
        :changeValue2="changeValue2"
        hover-tooltip-fields="strStockName"
        :hover-tooltip-max-length="0"
        :exporttoExcel="exportExcel">
      </Realgrid>
      </div>
    </div>
  </div>

  <Teleport to="body">
    <div
      v-if="open"
      class="pur802-overlay"
      @mousedown.self.prevent>
      <div class="pur802-pop" :style="confirmPop.style" @mousedown.stop>
      <div class="pur802-pop-bar" @mousedown="confirmPop.startDrag">
        <h2 class="text-base font-bold text-gray-900">입고 확정일자</h2>
        <div class="flex shrink-0 gap-2" @mousedown.stop>
          <button type="button" class="pnc-sub-btn" @click="setValue">
            <svg class="pnc-sub-btn__icon" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M3.2 8.2 6.4 11.2 12.8 4.4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            선택
          </button>
          <button type="button" class="pnc-sub-btn" @click="setFalse">
            <svg class="pnc-sub-btn__icon" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M4 4l8 8M12 4 4 12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
            </svg>
            닫기
          </button>
        </div>
      </div>
      <div class="min-h-0 flex-1 p-4">
        <div class="grid grid-cols-[6.75rem_minmax(0,1fr)] overflow-hidden rounded border border-slate-300 text-sm">
          <div class="flex min-h-[2.5rem] items-center justify-center border-r border-slate-300 bg-slate-100 px-2 font-semibold text-gray-900">
            입고 확정일자
          </div>
          <div class="flex min-h-[2.5rem] items-center bg-white px-2">
            <input
              type="date"
              class="h-8 w-full rounded-md border border-slate-300 px-2 text-sm"
              v-model="changeValue2" />
          </div>
        </div>
      </div>
      <div class="pur802-pop-resize" title="크기 조절" @mousedown.stop="confirmPop.startResize"></div>
    </div>
    </div>
  </Teleport>
  <!-- 그리드 영역 -->
</template>

<script setup>
import {
  cancelStoreMoveConfirmList,
  confirmStoreMoveConfirmList,
  getStoreStockMoveList,
} from "@/api/mipur";
import { getLossMasterPartList } from "@/api/mistock";
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

import { onMounted, ref, watch } from "vue";
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
/** 헤더·행 체크 원복 (Realgrid setAllCheck watch) */
const setAllCheck = ref(false);
const clearGridChecks = () => {
  setAllCheck.value = !setAllCheck.value;
};

const cond = ref("0");
/** getStoreStockMoveList @lngOption — 9 전체, 0 미확정, 1 확정 */
const cond2 = ref("9");
const cond3 = ref(0);
const cond4 = ref("");
const cond5 = ref(0);
const cond6 = ref(0);
const store = useStore();

const pur802ControlBorder = "#cbd5e1";
const pur802ColGutter = "1.125rem";
const pur802RowGap = "0.875rem";
const pur802LabelCol = "8.75rem";

const datepicker = ref(null);
const closePopUp = ref(false);
const optionList = ref([]);
const optionList3 = ref([]);
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

const storeCode = ref();
const lngStoreCode = async (e) => {
  initGrid();
  storeCode.value = e;

  // const res2 = await getLossMasterPartList(
  //   store.state.userData.lngStoreGroup,
  //   storeCode.value
  // );

  // optionList3.value = res2.data.List;
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

    const res = await getStoreStockMoveList(
      groupCd.value,
      storeCode.value,
      storeCode2.value,
      sDate.value,
      eDate.value,
      cond2.value
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
    selectedDate.value +
    "\n" +
    "보낸 매장명 :" +
    selectedExcelStore.value +
    "\n" +
    "받는 매장명 :" +
    selectedExcelStore2.value;
  exportExcel.value = !exportExcel.value;
};

// 엑셀 추출
const documentSubTitle = ref("");
const selectedExcelList = ref("");

const selectedExcelStore = ref("");
const selectedExcelStore2 = ref("");
/**
 * 엑셀용 매장 세팅 함수
 */

const excelStore = (e) => {
  selectedExcelStore.value = e;
  //comsole.log(e);
};
const excelStore2 = (e) => {
  selectedExcelStore2.value = e;
  //comsole.log(e);
};
const excelList = (e) => {
  selectedExcelList.value = e;
  //comsole.log(e);
};
const storeCode2 = ref("");
const lngStoreCode2 = async (e) => {
  storeCode2.value = e;

  const res2 = await getLossMasterPartList(
    store.state.userData.lngStoreGroup,
    storeCode2.value
  );

  optionList.value = res2.data.List;
};

const open = ref(false);
const confirmPop = useFloatPopup({
  width: 420,
  height: 210,
  minWidth: 320,
  minHeight: 180,
});
watch(open, (shown) => {
  if (shown) confirmPop.place();
});
const changeNow = ref(false);
const changeValue2 = ref("");
const changeColid = ref("strConfirmDate");
const tempMoveDate = ref("");
const tempCloseDate = ref("");
const checkedRowData2 = async (e) => {
  console.log(e);

  tempMoveDate.value = formatLocalDate(e[2]).replaceAll("-", "");
  tempCloseDate.value = e[21];
  if (e[0] == true) {
    changeColid.value = "strConfirmDate";
    changeValue2.value = formatLocalDate(new Date());
    open.value = true;
  } else if (e[0] == false) {
    changeColid.value = "strConfirmDate";
    changeValue2.value = "";
    changeNow.value = !changeNow.value;
  }
};

const changeRow = ref(0);

const selectedIndex = (e) => {
  changeRow.value = e;
};
const setFalse = () => {
  changeColid.value = "Selected";
  changeValue2.value = "0";
  changeNow.value = !changeNow.value;
  open.value = false;
};

const setValue = () => {
  if (
    parseInt(changeValue2.value.replaceAll("-", "")) <
    parseInt(tempCloseDate.value)
  ) {
    Swal.fire({
      title: "경고",
      text: "월마감 이전으로 입고확정 할 수 없습니다.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }

  if (
    parseInt(changeValue2.value.replaceAll("-", "")) <
    parseInt(tempMoveDate.value)
  ) {
    Swal.fire({
      title: "경고",
      text: "출고확정 이전으로 입고확정 할 수 없습니다.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }

  changeNow.value = !changeNow.value;
  open.value = false;
};

const updatedrowdata = ref([]);
const updatedRowData = (e) => {
  updatedrowdata.value = e;
};

const cancelButton = async () => {
  console.log(updatedrowdata.value);
  if (
    updatedrowdata.value.filter((item) => item.cancled == true).length == 0
  ) {
    await Swal.fire({
      title: "경고",
      text: "확정취소할 자재를 체크해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    clearGridChecks();
    return;
  }
  try {
    const fstorecds = updatedrowdata.value
      .filter((item) => item.cancled == true)
      .map((item) => item.lngFromStoreCode)
      .join("\u200b");
    const moveseqs = updatedrowdata.value
      .filter((item) => item.cancled == true)
      .map((item) => item.strMoveSeqID)
      .join("\u200b");
    const tstorecds = updatedrowdata.value
      .filter((item) => item.cancled == true)
      .map((item) => item.lngToStoreCode)
      .join("\u200b");
    const movedate = updatedrowdata.value
      .filter((item) => item.cancled == true)
      .map((item) => item.strMoveDate)
      .join("\u200b");

    const supplier = updatedrowdata.value
      .filter((item) => item.cancled == true)
      .map((item) => item.lngSupplierID)
      .join("\u200b");

    const stockids = updatedrowdata.value
      .filter((item) => item.cancled == true)
      .map((item) => item.lngStockID)
      .join("\u200b");

    const confirmdate = updatedrowdata.value
      .filter((item) => item.cancled == true)
      .map((item) => item.strConfirmDate)
      .join("\u200b");
    const res = await cancelStoreMoveConfirmList(
      groupCd.value,
      fstorecds,
      moveseqs,
      tstorecds,
      movedate,
      supplier,
      stockids,
      confirmdate,
      1
    );
    //  console.log(res);
    if (res.data.RESULT_CD == "00") {
      await Swal.fire({
        title: "성공",
        text: "확정 취소를 완료하였습니다.",
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
    }
  } catch (error) {
    console.log(error);
  } finally {
    clearGridChecks();
    await searchButton();
  }
};

const confirmButton = async () => {
  if (
    updatedrowdata.value.filter((item) => item.Selected == true).length == 0
  ) {
    await Swal.fire({
      title: "경고",
      text: "확정할 자재를 체크해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }
  try {
    const fstorecds = updatedrowdata.value
      .filter((item) => item.Selected == true)
      .map((item) => item.lngFromStoreCode)
      .join("\u200b");
    const moveseqs = updatedrowdata.value
      .filter((item) => item.Selected == true)
      .map((item) => item.strMoveSeqID)
      .join("\u200b");
    const tstorecds = updatedrowdata.value
      .filter((item) => item.Selected == true)
      .map((item) => item.lngToStoreCode)
      .join("\u200b");
    const movedate = updatedrowdata.value
      .filter((item) => item.Selected == true)
      .map((item) => item.strMoveDate)
      .join("\u200b");

    const supplier = updatedrowdata.value
      .filter((item) => item.Selected == true)
      .map((item) => item.lngSupplierID)
      .join("\u200b");

    const stockids = updatedrowdata.value
      .filter((item) => item.Selected == true)
      .map((item) => item.lngStockID)
      .join("\u200b");

    const confirmdate = updatedrowdata.value
      .filter((item) => item.Selected == true)
      .map((item) => formatLocalDate(item.strConfirmDate).replaceAll("-", ""))
      .join("\u200b");
    const res = await confirmStoreMoveConfirmList(
      groupCd.value,
      fstorecds,
      moveseqs,
      tstorecds,
      movedate,
      supplier,
      stockids,
      store.state.userData.lngSequence,
      confirmdate,
      1
    );

    console.log(res);
    if (res.data.RESULT_CD == "00") {
      await Swal.fire({
        title: "성공",
        text: "확정을 완료하였습니다.",
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
    }
  } catch (error) {
    console.log(error);
  } finally {
    clearGridChecks();
    await searchButton();
  }
};
</script>

<style scoped>
.pur802-confirm-cancel-icon {
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.3rem;
  flex-shrink: 0;
  color: #fff;
}

.pur802-search-panel {
  --pur802-panel-pad-x: 2rem;
  --pur802-control-h: 2rem;
  --pur802-row-min-h: 2rem;
  padding: 0.75rem 0;
  box-sizing: border-box;
}

@media (min-width: 768px) {
  .pur802-search-panel {
    --pur802-panel-pad-x: 3rem;
  }
}

.pur802-wire-grid {
  display: grid;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  align-items: center;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: var(--pur802-col-gutter);
  row-gap: var(--pur802-row-gap);
  padding-left: var(--pur802-panel-pad-x);
  padding-right: var(--pur802-panel-pad-x);
}

.pur802-wire-cell {
  display: flex;
  min-width: 0;
  min-height: var(--pur802-row-min-h);
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}

.pur802-wire-label {
  flex: 0 0 var(--pur802-label-col);
  width: var(--pur802-label-col);
  min-width: 0;
  max-width: var(--pur802-label-col);
  min-height: var(--pur802-row-min-h);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
  text-align: center;
}

.pur802-wire-field {
  /* 기존 63%의 70% — 보낸 매장 기준, 나머지 칸 동일 */
  display: flex;
  width: 44%;
  max-width: 44%;
  min-width: 0;
  flex: 0 1 auto;
  align-items: center;
  box-sizing: border-box;
}

.pur802-pick-slot {
  width: 100%;
  min-width: 0;
}

.pur802-pick-slot :deep(> div.flex.text-base) {
  width: 100%;
  min-width: 0;
}

.pur802-pick-slot :deep(> div.flex > div:first-child) {
  display: none;
}

.pur802-search-panel .pur802-pick-slot :deep(select),
.pur802-confirm-select {
  height: var(--pur802-control-h) !important;
  min-height: var(--pur802-control-h) !important;
  max-height: var(--pur802-control-h) !important;
  box-sizing: border-box;
  border: 1px solid var(--pur802-control-border) !important;
}

.pur802-search-panel .pur802-pick-slot :deep(div.relative.min-w-0.flex-1) {
  max-width: 100% !important;
  width: 100% !important;
  min-width: 0;
}

.pur802-confirm-row {
  width: 100%;
  max-width: 100%;
  min-width: 0;
}

.pur802-search-panel .pur802-date-slot :deep(> div.flex.justify-start.items-center) {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0;
  gap: 0.25rem !important;
}

.pur802-search-panel .pur802-date-slot :deep(> div.flex > div.inline-flex.h-8) {
  flex: 1 1 auto;
  min-width: 0;
  width: 100%;
  height: var(--pur802-control-h);
  gap: 0.125rem !important;
}

.pur802-search-panel .pur802-date-slot :deep(input[type="date"]) {
  border: 1px solid var(--pur802-control-border) !important;
  box-sizing: border-box;
  height: var(--pur802-control-h) !important;
  min-height: var(--pur802-control-h) !important;
  width: auto !important;
  flex: 1 1 0;
  min-width: 0;
  padding-left: 0.45rem;
  padding-right: 0.25rem;
}

.pur802-overlay {
  position: fixed;
  inset: 0;
  z-index: 10050;
  background: rgb(0 0 0 / 0.5);
  pointer-events: auto;
}

.pur802-pop {
  position: fixed;
  z-index: 1;
  display: flex;
  min-width: 0;
  min-height: 0;
  flex-direction: column;
  overflow: hidden;
  border-radius: 0.5rem;
  border: 1px solid #cbd5e1;
  background: #fff;
  box-shadow: 0 12px 32px rgb(15 23 42 / 28%);
}

.pur802-pop-bar {
  display: flex;
  shrink: 0;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
  padding: 0.75rem 1rem;
  cursor: move;
  user-select: none;
}

.pur802-pop-resize {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 16px;
  height: 16px;
  cursor: nwse-resize;
  background:
    linear-gradient(135deg, transparent 50%, #94a3b8 50%, #94a3b8 62%, transparent 62%, transparent 74%, #94a3b8 74%);
}
</style>
