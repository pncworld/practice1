<!-- /*--############################################################################
# Filename : CRM05_007INS.vue                                                  
# Description : 고객관리 > 고객 포인트 관리> 보너스포인트                      
# Date :2025-06-18                                                             
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <div class="flex h-full min-h-0 flex-col" @click="handleParentClick">
    <div
      class="flex shrink-0 items-center justify-between gap-3 overflow-y-hidden">
      <PageName></PageName>
      <div class="flex shrink-0 items-center justify-end space-x-2 pr-5">
        <button type="button" class="button save md:w-auto w-14" @click="saveButton">
          저장
        </button>
      </div>
    </div>

    <div
      class="crm05-search-panel z-10 mt-3 w-full max-w-[min(100%,1680px)] min-w-0 shrink-0 self-center overflow-x-auto rounded-lg bg-gray-200 px-5 py-3 sm:px-8 md:px-12 lg:px-14 xl:px-16 xl:py-3.5 2xl:px-20">
      <div
        class="crm05-wire-grid min-w-0"
        :style="{
          '--crm05-control-border': crm05ControlBorder,
          '--crm05-col-gutter': crm05ColGutter,
          '--crm05-row-gap': crm05RowGap,
          '--crm05-label-col': crm05LabelCol,
        }">
        <div class="crm05-wire-cell">
          <div class="crm05-wire-label">고객카드번호</div>
          <div class="crm05-wire-field min-w-0 crm05-field-with-btn">
            <input
              id="crm05-card"
              v-model="pcond"
              type="text"
              disabled
              class="crm05-sg-input h-8 min-h-8 min-w-0 flex-1 rounded-md border border-solid bg-slate-100 px-2 text-sm text-slate-700"
              autocomplete="off" />
            <button type="button" class="crm05-secondary-btn shrink-0" @click="showPopup = true">
              조회
            </button>
          </div>
        </div>

        <div
          class="crm05-wire-cell crm05-bonus-required rounded-lg border-2 border-amber-400 bg-amber-50 px-2 py-1 shadow-sm ring-2 ring-amber-300/70 sm:px-2.5">
          <div class="crm05-wire-label text-amber-950">보너스포인트</div>
          <div class="crm05-wire-field min-w-0">
            <input
              id="crm05-bonus-edit"
              ref="bonusPointInputRef"
              type="text"
              inputmode="numeric"
              lang="en"
              autocomplete="off"
              class="crm05-sg-input h-8 min-h-8 w-full min-w-0 rounded-md border-2 border-amber-500 bg-white px-2 text-sm text-gray-800 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-400"
              @focus="onBonusPointFocus"
              @beforeinput="onBonusPointBeforeInput"
              @compositionend="onBonusPointCompositionEnd"
              @compositionupdate="onBonusPointCompositionUpdate"
              @keydown="onBonusPointKeydown"
              @keyup="onBonusPointKeyup"
              @paste="onBonusPointPaste"
              @input="onBonusPointInput" />
          </div>
        </div>

        <div class="crm05-wire-cell">
          <div class="crm05-wire-label">고객명</div>
          <div class="crm05-wire-field min-w-0">
            <input
              id="crm05-name"
              v-model="pcond3"
              type="text"
              disabled
              class="crm05-sg-input h-8 min-h-8 w-full min-w-0 rounded-md border border-solid bg-slate-100 px-2 text-sm text-slate-700" />
          </div>
        </div>

        <div class="crm05-wire-cell">
          <div class="crm05-wire-label">전화번호</div>
          <div class="crm05-wire-field min-w-0">
            <input
              id="crm05-phone"
              v-model="pcond5"
              type="text"
              disabled
              class="crm05-sg-input h-8 min-h-8 w-full min-w-0 rounded-md border border-solid bg-slate-100 px-2 text-sm text-slate-700" />
          </div>
        </div>

        <div class="crm05-wire-cell">
          <div class="crm05-wire-label">방문횟수</div>
          <div class="crm05-wire-field min-w-0">
            <input
              id="crm05-visit"
              v-model="pcond6"
              type="text"
              disabled
              class="crm05-sg-input h-8 min-h-8 w-full min-w-0 rounded-md border border-solid bg-slate-100 px-2 text-sm text-slate-700" />
          </div>
        </div>

        <div class="crm05-wire-cell">
          <div class="crm05-wire-label">실매출액</div>
          <div class="crm05-wire-field min-w-0">
            <input
              id="crm05-act"
              v-model="pcond7"
              type="text"
              inputmode="decimal"
              disabled
              class="crm05-sg-input h-8 min-h-8 w-full min-w-0 rounded-md border border-solid bg-slate-100 px-2 text-sm text-slate-700" />
          </div>
        </div>

        <div class="crm05-wire-cell">
          <div class="crm05-wire-label">누적포인트</div>
          <div class="crm05-wire-field min-w-0">
            <input
              id="crm05-sale-pt"
              v-model="pcond8"
              type="text"
              inputmode="decimal"
              disabled
              class="crm05-sg-input h-8 min-h-8 w-full min-w-0 rounded-md border border-solid bg-slate-100 px-2 text-sm text-slate-700" />
          </div>
        </div>

        <div class="crm05-wire-cell">
          <div class="crm05-wire-label">보너스포인트</div>
          <div class="crm05-wire-field min-w-0">
            <input
              id="crm05-bonus-cur"
              v-model="pcond9"
              type="text"
              inputmode="decimal"
              disabled
              class="crm05-sg-input h-8 min-h-8 w-full min-w-0 rounded-md border border-solid bg-slate-100 px-2 text-sm text-slate-700" />
          </div>
        </div>

        <div class="crm05-wire-cell">
          <div class="crm05-wire-label">사용포인트</div>
          <div class="crm05-wire-field min-w-0">
            <input
              id="crm05-used"
              v-model="pcond10"
              type="text"
              inputmode="decimal"
              disabled
              class="crm05-sg-input h-8 min-h-8 w-full min-w-0 rounded-md border border-solid bg-slate-100 px-2 text-sm text-slate-700" />
          </div>
        </div>

        <div class="crm05-wire-cell">
          <div class="crm05-wire-label">잔여포인트</div>
          <div class="crm05-wire-field min-w-0">
            <input
              id="crm05-rem"
              v-model="pcond11"
              type="text"
              inputmode="decimal"
              disabled
              class="crm05-sg-input h-8 min-h-8 w-full min-w-0 rounded-md border border-solid bg-slate-100 px-2 text-sm text-slate-700" />
          </div>
        </div>

        <div class="crm05-wire-cell crm05-span-full">
          <div class="crm05-wire-label">적립사유</div>
          <div class="crm05-wire-field min-w-0">
            <input
              id="crm05-earn-reason"
              v-model="pcond12"
              type="text"
              class="crm05-sg-input h-8 min-h-8 w-full min-w-0 rounded-md border border-solid bg-white px-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      </div>
    </div>

    <div
      class="mx-auto mt-2 flex min-h-0 min-w-0 max-w-[min(100%,1680px)] flex-1 flex-col overflow-hidden px-1 pb-1 w-full">
      <div class="relative min-h-0 w-full flex-1 basis-0">
        <Realgrid
          :progname="'CRM05_007INS_VUE'"
          :progid="1"
          :rowData="rowData"
          :reload="reload"
          :rowStateeditable="false">
        </Realgrid>
      </div>
    </div>
  </div>

  <CustomerSearch
    v-if="showPopup"
    @strCCardID="strCCardID"
    @strCustName="strCustName"
    @strMobile="strMobile"
    @strHomeAddr1="strHomeAddr1"
    @lngVisitCnt="lngVisitCnt"
    @lngActAmt="lngActAmt"
    @lngSalePoint="lngSalePoint"
    @lngBonusPoint="lngBonusPoint"
    @lngUsedPoint="lngUsedPoint"
    @lngRemPoint="lngRemPoint"
    @lngStoreCode="lngStoreCode"
    @lngCustNo="lngCustNo"
    @closePopUp="showPopup = false"></CustomerSearch>
</template>
<script setup>
import {
  getCardChangeInfo,
  getPointHistoryList,
  updateBonusPoint,
} from "@/api/micrm";
import CustomerSearch from "@/components/customerSearch.vue";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
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

import { insertPageLog } from "@/customFunc/customFunc";
import Swal from "sweetalert2";
/**
 *  경고창 호출 라이브러리
 *  */

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

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
});

const reload = ref(false);
const rowData = ref([]);
const rowData2 = ref([]);
const afterSearch = ref(false);

const rowData3 = ref([]);
const rowData4 = ref([]);
const condValue = ref(0);
const store = useStore();

/** 보너스포인트 폼 — CRM01_008 카드교체와 동일 톤 */
const crm05ControlBorder = "#cbd5e1";
const crm05ColGutter = "1.25rem";
const crm05RowGap = "0.6875rem";
const crm05LabelCol = "8rem";

const cond = ref(0);
const cond2 = ref("");
const datepicker = ref(null);
const closePopUp = ref(false);

const pcond = ref();
/** 보너스포인트 입력값 — 숫자만(문자열). 표시는 비제어 input에 콤마 마스킹으로 반영 */
const pcond2 = ref("");
const pcond3 = ref();
const pcond4 = ref(0);
const pcond5 = ref();
const pcond6 = ref();
const pcond7 = ref();
const pcond8 = ref();
const pcond9 = ref();
const pcond10 = ref();
const pcond11 = ref();
const pcond12 = ref();

const showPopup = ref(false);

/** 비제어 input과 동기 — Vue는 IME 조합 중 :value를 갱신하지 않아 한글이 남는 문제가 있음 */
const bonusPointInputRef = ref(null);

const bonusPointDisplay = computed(() => {
  const d = String(pcond2.value ?? "").replace(/\D/g, "");
  if (!d) return "";
  return d.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
});

const applyBonusInputFromDom = (el) => {
  if (!el) return;
  const digits = String(el.value ?? "").replace(/\D/g, "");
  pcond2.value = digits;
  const formatted = bonusPointDisplay.value;
  if (el.value !== formatted) {
    el.value = formatted;
  }
};

const onBonusPointFocus = (e) => {
  const el = e.target;
  el.value = bonusPointDisplay.value;
};

const onBonusPointInput = (e) => {
  applyBonusInputFromDom(e.target);
};

const onBonusPointKeyup = (e) => {
  applyBonusInputFromDom(e.target);
};

/** 표시 문자열 기준 커서 위치 → 숫자만 있는 문자열에서의 인덱스 */
const displayCaretToDigitIndex = (display, caret) => {
  let n = 0;
  const upto = Math.min(Math.max(0, caret), display.length);
  for (let i = 0; i < upto; i++) {
    if (display[i] !== ",") n++;
  }
  return n;
};

const mergeBonusPaste = (el, pasteDigits) => {
  if (pasteDigits == null || pasteDigits === "") return;
  const display = bonusPointDisplay.value;
  const start = el.selectionStart ?? 0;
  const end = el.selectionEnd ?? start;
  const d = String(pcond2.value ?? "").replace(/\D/g, "");
  const a = displayCaretToDigitIndex(display, start);
  const b = displayCaretToDigitIndex(display, end);
  pcond2.value = d.slice(0, a) + pasteDigits + d.slice(b);
  nextTick(() => {
    if (el) el.value = bonusPointDisplay.value;
  });
};

const onBonusPointBeforeInput = (e) => {
  const t = e.inputType || "";
  if (t === "deleteCompositionText") {
    return;
  }
  /** 숫자 전용: IME 조합으로 들어오는 텍스트는 모두 차단(숫자만 insertCompositionText는 사실상 없음) */
  if (t === "insertCompositionText") {
    e.preventDefault();
    return;
  }
  if (t === "insertText" && e.data != null && /\D/.test(e.data)) {
    e.preventDefault();
  }
};

const onBonusPointCompositionEnd = (e) => {
  applyBonusInputFromDom(e.target);
};

/** 조합 중에도 DOM을 직접 덮어 한글 조합이 화면에 남지 않게 함 */
const onBonusPointCompositionUpdate = (e) => {
  applyBonusInputFromDom(e.target);
};

const onBonusPointKeydown = (e) => {
  /** isComposing일 때 return 하면 한글 조합 키가 그대로 통과함 */
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  const passKeys = new Set([
    "Tab",
    "Backspace",
    "Delete",
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown",
    "Home",
    "End",
    "Escape",
    "Enter",
  ]);
  if (passKeys.has(e.key)) return;
  if (e.key.length === 1 && e.key >= "0" && e.key <= "9") return;
  e.preventDefault();
};

const onBonusPointPaste = (e) => {
  e.preventDefault();
  const raw =
    e.clipboardData?.getData("text/plain") ??
    (typeof window !== "undefined" ? window.clipboardData?.getData("Text") : "") ??
    "";
  mergeBonusPaste(e.target, String(raw).replace(/\D/g, ""));
};

watch(pcond2, () => {
  nextTick(() => {
    const el = bonusPointInputRef.value;
    if (!el || document.activeElement === el) return;
    const f = bonusPointDisplay.value;
    if (el.value !== f) el.value = f;
  });
});

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

const searchNum = ref(0);

/**
 *  조회 함수
 */

const searchButton = async () => {
  try {
    store.state.loading = true;
    initGrid();
    let res;
    if (cond.value == 0) {
      res = await getCardChangeInfo(
        store.state.userData.lngStoreGroup,
        null,
        cond2.value,
        null
      );
    } else if (cond.value == 1) {
      res = await getCardChangeInfo(
        store.state.userData.lngStoreGroup,
        null,
        null,
        cond2.value
      );
    } else {
      res = await getCardChangeInfo(
        store.state.userData.lngStoreGroup,
        null,
        null,
        null,
        "1",
        cond2.value
      );
    }
    ////console.log(res);

    rowData2.value = res.data.List;
    ////console.log(res);
    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    //comsole.log(error);
  } finally {
    store.state.loading = false;
  }
};

const selectedStoreCd = ref();
const selectedCustNo = ref();

const strCCardID = (e) => {
  pcond.value = e;
};
const strCustName = (e) => {
  pcond3.value = e;
};
const strMobile = (e) => {
  pcond5.value = e;
};
const lngVisitCnt = (e) => {
  pcond6.value = e;
};
const lngActAmt = (e) => {
  pcond7.value = e;
};
const lngSalePoint = (e) => {
  pcond8.value = e;
};
const lngBonusPoint = (e) => {
  pcond9.value = e;
};
const lngUsedPoint = (e) => {
  pcond10.value = e;
};
const lngRemPoint = (e) => {
  pcond11.value = e;
};
const lngStoreCode = (e) => {
  selectedStoreCd.value = e;
};
const lngCustNo = async (e) => {
  selectedCustNo.value = e;

  try {
    store.state.loading = true;
    const res = await getPointHistoryList(
      store.state.userData.lngStoreGroup,
      selectedCustNo.value,
      pcond.value
    );

    rowData.value = res.data.List;
  } catch (error) {
  } finally {
    store.state.loading = false;
  }
};

const checkCard = ref(false);

const saveButton = async () => {
  if (selectedCustNo.value == null || selectedCustNo.value == undefined) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });

    return;
  }

  if (pcond2.value === undefined || pcond2.value === null || pcond2.value === "") {
    Swal.fire({
      title: "경고",
      text: "보너스포인트를 먼저 입력해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });

    return;
  }

  try {
    store.state.loading = true;
    const res = await updateBonusPoint(
      store.state.userData.lngStoreGroup,
      selectedStoreCd.value,
      selectedCustNo.value,
      store.state.userData.lngSequence,
      Number(pcond2.value),
      pcond12.value
    );

    Swal.fire({
      title: "성공",
      text: "보너스포인트 변경 완료하였습니다.",
      icon: "success",
      confirmButtonText: "확인",
    });
  } catch (error) {
  } finally {
    store.state.loading = false;
    initGrid();
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
  pcond.value = "";
  pcond2.value = "";
  pcond3.value = "";
  pcond4.value = "0";
  pcond5.value = "";
  pcond6.value = "";
  pcond7.value = "";
  pcond8.value = "";
  pcond9.value = "";
  pcond10.value = "";
  pcond11.value = "";
  pcond12.value = "";
  nextTick(() => {
    const el = bonusPointInputRef.value;
    if (el) el.value = "";
  });
};

//엑셀 버튼 처리 함수
const exportExcel = ref(false);
/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  documentSubTitle.value = selectedDate.value + "\n" + selectedExcelList.value;

  //documentSubTitle.value += "\n";
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
</script>

<style scoped>
.crm05-wire-grid {
  display: grid;
  width: 100%;
  min-width: 0;
  align-items: center;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  column-gap: var(--crm05-col-gutter);
  row-gap: var(--crm05-row-gap);
}

.crm05-wire-cell {
  display: flex;
  min-width: 0;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}

.crm05-wire-cell.crm05-span-full {
  grid-column: 1 / -1;
}

.crm05-wire-label {
  flex: 0 0 var(--crm05-label-col);
  width: var(--crm05-label-col);
  min-width: 0;
  max-width: var(--crm05-label-col);
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

.crm05-wire-field {
  display: flex;
  min-width: 0;
  max-width: 100%;
  flex: 1 1 auto;
  align-items: center;
}

.crm05-wire-field:not(.crm05-field-with-btn) > * {
  min-width: 0;
  width: 100%;
}

.crm05-field-with-btn {
  flex-wrap: nowrap;
  gap: 0.5rem;
}

.crm05-field-with-btn > .crm05-sg-input {
  width: auto;
  flex: 1 1 0%;
  min-width: 0;
}

.crm05-sg-select {
  box-sizing: border-box;
}

.crm05-search-panel select.crm05-sg-select {
  border: 1px solid var(--crm05-control-border) !important;
}

.crm05-search-panel select.crm05-sg-select:focus {
  border-color: #3b82f6 !important;
}

.crm05-search-panel .crm05-sg-input {
  border: 1px solid var(--crm05-control-border) !important;
  box-sizing: border-box;
}

.crm05-search-panel .crm05-sg-input:focus {
  border-color: #3b82f6 !important;
}

.crm05-secondary-btn {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  border: 1px solid rgb(203 213 225);
  background-color: #fff;
  padding: 0.375rem 0.75rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: rgb(55 65 81);
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  transition: background-color 0.15s ease;
}

.crm05-secondary-btn:hover {
  background-color: rgb(248 250 252);
}

@media (max-height: 900px) {
  .crm05-search-panel {
    padding-top: 0.5rem !important;
    padding-bottom: 0.5rem !important;
    margin-top: 0.25rem !important;
  }

  .crm05-search-panel .crm05-wire-grid {
    row-gap: 0.4375rem;
  }
}
</style>
