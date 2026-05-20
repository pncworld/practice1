<!-- /*--############################################################################
# Filename : CRM01_008INS.vue                                                  
# Description : 고객관리 > 고객 신상 정보 > 고객 카드 교체                      
# Date :2025-06-17                                                             
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
      class="crm08-search-panel z-10 mt-3 w-full max-w-[min(100%,1680px)] min-w-0 shrink-0 self-center overflow-x-auto rounded-lg bg-gray-200 px-5 py-3 sm:px-8 md:px-12 lg:px-14 xl:px-16 xl:py-3.5 2xl:px-20">
      <div
        class="crm08-wire-grid min-w-0"
        :style="{
          '--crm08-control-border': crm08ControlBorder,
          '--crm08-col-gutter': crm08ColGutter,
          '--crm08-row-gap': crm08RowGap,
          '--crm08-label-col': crm08LabelCol,
        }">
        <div class="crm08-wire-cell">
          <div class="crm08-wire-label">고객카드번호</div>
          <div class="crm08-wire-field min-w-0 crm08-field-with-btn">
            <input
              id="crm08-old-card"
              v-model="pcond"
              type="text"
              disabled
              class="crm08-sg-input h-8 min-h-8 min-w-0 flex-1 rounded-md border border-solid bg-slate-100 px-2 text-sm text-slate-700"
              autocomplete="off" />
            <button
              type="button"
              class="crm08-secondary-btn shrink-0"
              @click="showPopup = true">
              조회
            </button>
          </div>
        </div>

        <div class="crm08-wire-cell">
          <div class="crm08-wire-label">신규카드번호</div>
          <div class="crm08-wire-field min-w-0 crm08-field-with-btn">
            <input
              id="crm08-new-card"
              v-model="pcond2"
              type="text"
              class="crm08-sg-input h-8 min-h-8 min-w-0 flex-1 rounded-md border border-solid bg-white px-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autocomplete="off"
              @input="checkCard = false" />
            <button type="button" class="crm08-secondary-btn shrink-0" @click="checkCardNo">
              중복검사
            </button>
          </div>
        </div>

        <div class="crm08-wire-cell crm08-hint-cell">
          <p class="crm08-inline-hint">
            ※ 기존 카드에서 미등록 신규 카드로만 교체 가능합니다.
          </p>
        </div>

        <div class="crm08-wire-cell">
          <div class="crm08-wire-label">고객명</div>
          <div class="crm08-wire-field min-w-0">
            <input
              id="crm08-cust-name"
              v-model="pcond3"
              type="text"
              disabled
              class="crm08-sg-input h-8 min-h-8 w-full min-w-0 rounded-md border border-solid bg-slate-100 px-2 text-sm text-slate-700" />
          </div>
        </div>

        <div class="crm08-wire-cell">
          <div class="crm08-wire-label">카드변경사유</div>
          <div class="crm08-wire-field min-w-0">
            <select
              id="crm08-change-reason"
              v-model="pcond4"
              class="crm08-sg-select h-8 w-full min-w-0 rounded-md border border-solid bg-white text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="0">카드사용중지</option>
              <option value="1">카드분실</option>
              <option value="2">카드손상</option>
              <option value="3">기타</option>
              <option value="4">이관복구</option>
              <option value="5">회원탈퇴</option>
            </select>
          </div>
        </div>

        <div class="crm08-wire-cell">
          <div class="crm08-wire-label">전화번호</div>
          <div class="crm08-wire-field min-w-0">
            <input
              id="crm08-phone"
              v-model="pcond5"
              type="text"
              disabled
              class="crm08-sg-input h-8 min-h-8 w-full min-w-0 rounded-md border border-solid bg-slate-100 px-2 text-sm text-slate-700" />
          </div>
        </div>

        <div class="crm08-wire-cell">
          <div class="crm08-wire-label">방문횟수</div>
          <div class="crm08-wire-field min-w-0">
            <input
              id="crm08-visit"
              v-model="pcond6"
              type="text"
              disabled
              class="crm08-sg-input h-8 min-h-8 w-full min-w-0 rounded-md border border-solid bg-slate-100 px-2 text-sm text-slate-700" />
          </div>
        </div>

        <div class="crm08-wire-cell">
          <div class="crm08-wire-label">실매출액</div>
          <div class="crm08-wire-field min-w-0">
            <input
              id="crm08-act-amt"
              v-model="pcond7"
              type="text"
              inputmode="decimal"
              disabled
              class="crm08-sg-input h-8 min-h-8 w-full min-w-0 rounded-md border border-solid bg-slate-100 px-2 text-sm text-slate-700" />
          </div>
        </div>

        <div class="crm08-wire-cell">
          <div class="crm08-wire-label">누적포인트</div>
          <div class="crm08-wire-field min-w-0">
            <input
              id="crm08-sale-pt"
              v-model="pcond8"
              type="text"
              inputmode="decimal"
              disabled
              class="crm08-sg-input h-8 min-h-8 w-full min-w-0 rounded-md border border-solid bg-slate-100 px-2 text-sm text-slate-700" />
          </div>
        </div>

        <div class="crm08-wire-cell">
          <div class="crm08-wire-label">보너스포인트</div>
          <div class="crm08-wire-field min-w-0">
            <input
              id="crm08-bonus-pt"
              v-model="pcond9"
              type="text"
              inputmode="decimal"
              disabled
              class="crm08-sg-input h-8 min-h-8 w-full min-w-0 rounded-md border border-solid bg-slate-100 px-2 text-sm text-slate-700" />
          </div>
        </div>

        <div class="crm08-wire-cell">
          <div class="crm08-wire-label">사용포인트</div>
          <div class="crm08-wire-field min-w-0">
            <input
              id="crm08-used-pt"
              v-model="pcond10"
              type="text"
              inputmode="decimal"
              disabled
              class="crm08-sg-input h-8 min-h-8 w-full min-w-0 rounded-md border border-solid bg-slate-100 px-2 text-sm text-slate-700" />
          </div>
        </div>

        <div class="crm08-wire-cell">
          <div class="crm08-wire-label">잔여포인트</div>
          <div class="crm08-wire-field min-w-0">
            <input
              id="crm08-rem-pt"
              v-model="pcond11"
              type="text"
              inputmode="decimal"
              disabled
              class="crm08-sg-input h-8 min-h-8 w-full min-w-0 rounded-md border border-solid bg-slate-100 px-2 text-sm text-slate-700" />
          </div>
        </div>

        <div class="crm08-wire-cell crm08-span-full">
          <div class="crm08-wire-label">비고</div>
          <div class="crm08-wire-field min-w-0">
            <input
              id="crm08-remark"
              v-model="pcond12"
              type="text"
              class="crm08-sg-input h-8 min-h-8 w-full min-w-0 rounded-md border border-solid bg-white px-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      </div>
    </div>

    <div
      class="mx-auto mt-2 flex min-h-0 min-w-0 max-w-[min(100%,1680px)] flex-1 flex-col overflow-hidden px-1 pb-1 w-full">
      <div class="relative min-h-0 w-full flex-1 basis-0">
        <Realgrid
          :progname="'CRM01_008INS_VUE'"
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

  <!-- 그리드 영역 -->
</template>

<script setup>
import {
  changeCardNo,
  getCardChangeInfo,
  getCardChangeList,
  validCardNo,
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

import { onMounted, ref } from "vue";
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

/** 카드 교체 폼 — 고객정보(001) 조회 패널과 동일 톤·와이어 변수 */
const crm08ControlBorder = "#cbd5e1";
const crm08ColGutter = "1.25rem";
const crm08RowGap = "0.6875rem";
const crm08LabelCol = "8rem";

const cond = ref(0);
const cond2 = ref("");
const datepicker = ref(null);
const closePopUp = ref(false);

const pcond = ref();
const pcond2 = ref();
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
    const res = await getCardChangeList(
      store.state.userData.lngStoreGroup,
      selectedCustNo.value
    );

    rowData.value = res.data.List;
  } catch (error) {
  } finally {
    store.state.loading = false;
  }
};

const checkCard = ref(false);
const checkCardNo = async () => {
  if (pcond2.value.length != 16) {
    Swal.fire({
      title: "경고",
      text: "카드번호 16자리를 입력해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  try {
    const res = await validCardNo(
      store.state.userData.lngStoreGroup,
      pcond2.value
    );

    if (res.data.List[0].lngCustNo == "") {
      Swal.fire({
        title: "확인",
        text: "사용가능한 카드번호입니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
      checkCard.value = true;
      return;
    } else {
      Swal.fire({
        title: "경고",
        text: "이미 사용중인 카드번호입니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      checkCard.value = false;
      return;
    }
  } catch (error) {}
};

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

  if (checkCard.value == false) {
    Swal.fire({
      title: "경고",
      text: "카드 중복검사를 먼저 해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });

    return;
  }

  try {
    store.state.loading = true;
    const res = await changeCardNo(
      store.state.userData.lngStoreGroup,
      selectedStoreCd.value,
      store.state.userData.lngSequence,
      selectedCustNo.value,
      pcond.value,
      pcond2.value,
      pcond4.value,
      pcond12.value
    );
    ////console.log(res);
    Swal.fire({
      title: "성공",
      text: "카드 번호 변경 완료하였습니다.",
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
.crm08-wire-grid {
  display: grid;
  width: 100%;
  min-width: 0;
  align-items: center;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  column-gap: var(--crm08-col-gutter);
  row-gap: var(--crm08-row-gap);
}

.crm08-wire-cell {
  display: flex;
  min-width: 0;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}

.crm08-wire-cell.crm08-span-full {
  grid-column: 1 / -1;
}

.crm08-wire-label {
  flex: 0 0 var(--crm08-label-col);
  width: var(--crm08-label-col);
  min-width: 0;
  max-width: var(--crm08-label-col);
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

.crm08-wire-field {
  display: flex;
  min-width: 0;
  max-width: 100%;
  flex: 1 1 auto;
  align-items: center;
}

.crm08-wire-field:not(.crm08-field-with-btn) > * {
  min-width: 0;
  width: 100%;
}

.crm08-field-with-btn {
  flex-wrap: nowrap;
  gap: 0.5rem;
}

.crm08-field-with-btn > .crm08-sg-input {
  width: auto;
  flex: 1 1 0%;
  min-width: 0;
}

/* 첫 행 3열: 신규카드 옆(우측 칸) 안내 — 고객명 이후 항목이 한 칸씩 밀림 */
.crm08-hint-cell {
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  min-width: 0;
}

.crm08-inline-hint {
  margin: 0;
  min-width: 0;
  font-size: 0.75rem;
  line-height: 1.35;
  font-weight: 600;
  color: rgb(220 38 38);
}

@media (max-width: 1023px) {
  .crm08-inline-hint {
    font-size: 0.6875rem;
  }
}

.crm08-sg-select {
  box-sizing: border-box;
}

.crm08-search-panel select.crm08-sg-select {
  border: 1px solid var(--crm08-control-border) !important;
}

.crm08-search-panel select.crm08-sg-select:focus {
  border-color: #3b82f6 !important;
}

.crm08-search-panel .crm08-sg-input {
  border: 1px solid var(--crm08-control-border) !important;
  box-sizing: border-box;
}

.crm08-search-panel .crm08-sg-input:focus {
  border-color: #3b82f6 !important;
}

.crm08-secondary-btn {
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

.crm08-secondary-btn:hover {
  background-color: rgb(248 250 252);
}

@media (max-height: 900px) {
  .crm08-search-panel {
    padding-top: 0.5rem !important;
    padding-bottom: 0.5rem !important;
    margin-top: 0.25rem !important;
  }

  .crm08-search-panel .crm08-wire-grid {
    row-gap: 0.4375rem;
  }
}
</style>
