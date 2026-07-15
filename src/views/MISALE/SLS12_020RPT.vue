/*--############################################################################
# Filename : SLS12_020RPT.vue
# Description : 매출관리 > 상세 매출 현황 > 결제 세부 내역
# Date :2025-05-14
# Author : 권맑음
################################################################################*/
<template>
  <div class="flex h-full min-h-0 flex-col" @click="handleParentClick">
    <div class="flex shrink-0 justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center mr-9 space-x-2 pr-5">
        <button
          @click="searchButton"
          class="button search md:w-auto w-14"
          :disabled="searchActionsDisabled">
          조회
        </button>
        <button
          @click="excelButton"
          class="button save w-auto excel"
          :disabled="searchActionsDisabled">
          엑셀
        </button>
      </div>
    </div>

    <div
      class="sls12-search-panel z-10 mt-3 w-full min-h-0 shrink-0 overflow-visible rounded-lg bg-gray-200"
      :style="{
        '--sls12-panel-pad-x': '2rem',
        '--sls12-control-border': sls12ControlBorder,
        '--sls12-col-gutter': sls12ColGutter,
        '--sls12-row-gap': sls12RowGap,
        '--sls12-label-col': sls12LabelCol,
        '--sls12-ctrl-w': sls12CtrlW,
      }">
      <div class="sls12-search-layout min-w-0">
        <div class="sls12-left-stack min-w-0">
          <div class="sls12-row">
            <span class="sls12-lbl shrink-0">기간</span>
            <div class="sls12-date-slot min-w-0 flex-1">
              <Datepicker2
                ref="datepicker"
                omit-main-label
                filter-bar-align
                :mainName="'기간'"
                :closePopUp="closePopUp"
                @endDate="endDate"
                @startDate="startDate"
                @excelDate="excelDate" />
            </div>
          </div>

          <div class="sls12-row sls12-row--pay-aff">
            <span class="sls12-lbl shrink-0">결제코드</span>
            <div class="sls12-ctrl-slot">
              <v-select
                v-model="selectedCode"
                :options="codeList"
                placeholder="전체"
                label="strName"
                class="custom-select2 sls12-vselect"
                clearable="true"
                @click="resetVselect2"
                @update:modelValue="onPayCodeChange" />
            </div>
            <template v-if="isAffPayCode">
              <div class="sls12-row-spacer" aria-hidden="true"></div>
              <span class="sls12-lbl shrink-0">소속사</span>
              <div class="sls12-ctrl-slot">
                <select
                  id="sls12-020-aff-comp"
                  v-model="affiliateCompCode"
                  :disabled="
                    affiliateCompLocked ||
                    affiliateCompList.length === 0 ||
                    affiliateCompLoading
                  "
                  class="sls12-sg-select"
                  @change="onAffiliateCompChange">
                  <option v-if="affiliateCompList.length === 0" disabled value="">
                    {{ affiliateCompLoading ? "불러오는 중..." : "소속사 없음" }}
                  </option>
                  <option
                    v-for="item in affiliateCompList"
                    :key="item.value"
                    :value="item.value">
                    {{ item.label }}
                  </option>
                </select>
              </div>
            </template>
          </div>
        </div>

        <div class="sls12-right-store min-w-0">
          <div class="sls12-row sls12-row--store">
            <span class="sls12-lbl shrink-0">매장선택</span>
            <div class="sls12-pick-slot min-w-0 flex-1">
              <PickStoreSingle2
                @lngStoreCode="lngStoreCodes"
                @lngStoreGroup="lngStoreGroup"
                @excelStore="excelStore"
                @changeInit="changeInit"
                @lngSupervisor="lngSupervisor"
                @lngStoreTeam="lngStoreTeam"
                @lngStoreAttrs="lngStoreAttrs" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-2 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <div class="relative h-full min-h-0 min-w-0 flex-1">
        <Realgrid
          :progname="'SLS12_020RPT_VUE'"
          :progid="progid"
          :rowData="rowData"
          :reload="reload"
          :setFooter="true"
          :mergeMask="''"
          :setMergeMode="false"
          :setGroupFooter="setGroupFooter"
          :setGroupColumnId="setGroupColumnId"
          :setGroupSumCustomColumnId="['strStoreName']"
          :setGroupSumCustomText="[' 소계']"
          :setGroupSumCustomNameField="'strStoreName'"
          :setFooterCustomColumnId="['strStoreName']"
          :setFooterCustomText="['총합계']"
          :documentTitle="'SLS12_020RPT'"
          :rowStateeditable="false"
          :documentSubTitle="documentSubTitle"
          :exporttoExcel="exportExcel">
        </Realgrid>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getpayCodeList_020, getSalesDetail_020 } from "@/api/misales";
import {
  buildAffCompCombos,
  getAffComp,
  getCustCompany050,
} from "@/api/micrm";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

import Datepicker2 from "@/components/Datepicker2.vue";
/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
/**
 *  매장  단일 선택 컴포넌트
 *  */

import PickStoreSingle2 from "@/components/pickStoreSingle.vue";
/**
 * 	그리드 생성
 */

import Realgrid from "@/components/realgrid.vue";
/**
 *  페이지로그 자동 입력
 *  */

import { insertPageLog } from "@/customFunc/customFunc";
/*
 * 공통 표준  Function
 */

import { computed, onMounted, ref } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import Swal from "sweetalert2";
import { useStore } from "vuex";

/** 소속사 콤보 표시 대상 결제코드 */
const AFF_PAY_CODE = 2304;

const orderPay = ref(1);
const setFooterColID = ref(["lngCount", "lngPreAmt", "lngAmt", "lngChange"]);
const setGroupFooterColID = ref(["lngStoreCode"]);
const setFooterExpressions = ref(["sum", "sum", "sum", "sum"]);
const setGroupFooterExpressions = ref(["sum", "sum", "sum", "sum"]);
const codeList = ref([]);
const selectedCode = ref(null);
const progid = ref(1);
const setRowGroupSpan = ref("lngStoreCode,strName");
const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);
const selectedstartDate = ref();
const selectedendDate = ref();
const hideColumnNow = ref(true);
const setGroupColumnId = ref("lngStoreCode");
const hideColumnsId = ref(["strStore"]);
/**
 * 선택한 매출 시작일자
 */

const startDate = (e) => {
  //comsole.log(e);
  selectedstartDate.value = e;
};
/**
 * 선택한 매출 종료일자
 */

const endDate = (e) => {
  selectedendDate.value = e;
};
const startTime = ref(0);
const endTime = ref(23);
const setGroupFooter = ref(true);
const selectedCause = ref(null);
const store = useStore();
const causeList = ref([]);
const mergeMask = ref();

const strSaleCompCode = ref("");
const strSaleCompName = ref("");
const affiliateCompList = ref([]);
const affiliateCompCode = ref("");
const affiliateCompLocked = ref(false);
const affiliateCompLoading = ref(true);
/** getAffComp 실패 시 — 결제코드 2304일 때만 조회·엑셀 제한 */
const affCompAccessDenied = ref(true);
/** 로드 성공 시 기본 선택값 (콤보 초기화 후 복원용) */
const affiliateCompDefaultCode = ref("");

const isAffPayCode = computed(
  () => Number(selectedCode.value?.lngCode) === AFF_PAY_CODE
);
const searchActionsDisabled = computed(
  () => isAffPayCode.value && affCompAccessDenied.value
);

const sls12ControlBorder = "#cbd5e1";
const sls12ColGutter = "1.5rem";
const sls12RowGap = "0.875rem";
const sls12LabelCol = "5.5rem";
/** 기간 첫 일자 콤보(w-36)와 동일 */
const sls12CtrlW = "9rem";

const resetAffCompCombos = () => {
  strSaleCompCode.value = "";
  strSaleCompName.value = "";
  affiliateCompList.value = [];
  affiliateCompCode.value = "";
  affiliateCompLocked.value = false;
  affiliateCompDefaultCode.value = "";
};

/** 결제코드가 2304가 아니면 소속사를 「전체」(0)로 초기화 */
const clearAffiliateSelection = () => {
  affiliateCompCode.value = "0";
};

const restoreAffiliateSelection = () => {
  if (affiliateCompList.value.length === 0) {
    affiliateCompCode.value = "0";
    return;
  }
  affiliateCompCode.value =
    affiliateCompDefaultCode.value || affiliateCompList.value[0].value;
};

const onPayCodeChange = (code) => {
  if (Number(code?.lngCode) === AFF_PAY_CODE) {
    restoreAffiliateSelection();
  } else {
    clearAffiliateSelection();
  }
  initGrid();
};

const loadAffComp = async () => {
  if (!strSaleCompCode.value || strSaleCompCode.value === "0") {
    affCompAccessDenied.value = true;
    resetAffCompCombos();
    return;
  }
  affCompAccessDenied.value = true;
  try {
    const res = await getAffComp(
      strSaleCompCode.value,
      store.state.userData.lngStoreGroup,
      store.state.userData.lngSequence
    );
    if (res.data?.RESULT_CD !== "00") {
      resetAffCompCombos();
      affCompAccessDenied.value = true;
      Swal.fire({
        title: "경고",
        text:
          res.data?.RESULT_MSG ||
          "소속사 목록 조회에 실패했습니다. 피앤시월드에 문의하세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }
    affCompAccessDenied.value = false;
    const combo = buildAffCompCombos(res.data?.List ?? []);
    affiliateCompLocked.value = combo.singleLocked;
    affiliateCompList.value = combo.topOptions;
    affiliateCompDefaultCode.value = combo.topValue;
    // 결제코드 2304일 때만 기본값 유지, 아니면 「전체」(0)
    affiliateCompCode.value = isAffPayCode.value ? combo.topValue : "0";
  } catch (error) {
    affCompAccessDenied.value = true;
    resetAffCompCombos();
  }
};

/** ACT09_003RPT와 동일 — 로그인 매장그룹·포지션으로 고객사 조회 후 소속사 로드 */
const loadCustCompanyAndAffComp = async () => {
  affiliateCompLoading.value = true;
  affCompAccessDenied.value = true;
  resetAffCompCombos();
  try {
    const res = await getCustCompany050(
      store.state.userData.lngStoreGroup,
      store.state.userData.lngPosition
    );
    const list = res.data?.List ?? [];
    if (list.length === 0) {
      return;
    }
    const comp = list[0];
    strSaleCompCode.value = comp.strSaleCompCode ?? "";
    strSaleCompName.value = comp.strSaleCompName ?? "";
    if (strSaleCompCode.value) {
      await loadAffComp();
    }
  } catch (error) {
    affCompAccessDenied.value = true;
    resetAffCompCombos();
  } finally {
    affiliateCompLoading.value = false;
  }
};

const getAffCompCdParam = () => {
  // 결제코드 2304가 아니면 소속사 전체(0)
  if (!isAffPayCode.value) {
    return "0";
  }
  const code = affiliateCompCode.value;
  if (!code || code === "0" || code === "") {
    return "0";
  }
  return String(code);
};

const getAffiliateExcelLabel = () => {
  const affCode = affiliateCompCode.value;
  if (!affCode || affCode === "0" || affiliateCompList.value.length === 0) {
    return "전체";
  }
  const aff = affiliateCompList.value.find((i) => i.value === affCode);
  return aff?.label ?? "전체";
};

const onAffiliateCompChange = () => {
  initGrid();
};

/**
 * 결제코드 콤보 로드 (매장코드 기준)
 * SLS12_020RPT.asmx 미배포 시에도 화면이 멈추지 않도록 실패를 삼킨다.
 */
const loadPayCodeList = async (storeCd) => {
  try {
    const userGroup = store.state.storeGroup[0].lngStoreGroup;
    const res = await getpayCodeList_020(userGroup, storeCd ?? 0);
    codeList.value = res.data.List ?? [];
  } catch (error) {
    codeList.value = [];
    console.error("SLS12_020RPT getpayCodeList 오류:", error);
  }
  selectedCode.value = null;
};

/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  // 결제코드(SLS12_020 asmx)와 소속사(CRM01_050)는 독립 — 020 미배포 시에도 소속사 로드
  await Promise.all([
    loadPayCodeList(store.state.userData.lngPosition),
    loadCustCompanyAndAffComp(),
  ]);
});

const loginedstrLang = store.state.userData.lngLanguage;
/**
 *  조회 함수
 */

const searchButton = async () => {
  if (searchActionsDisabled.value) {
    Swal.fire({
      title: "경고",
      text: "소속사 정보를 조회할 수 없어 조회가 제한됩니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  store.state.loading = true;
  try {
    initGrid();
    let code;
    if (selectedCode.value == null || selectedCode.value == undefined) {
      code = 0;
    } else {
      code = selectedCode.value.lngCode;
    }

    reload.value = !reload.value;

    const res = await getSalesDetail_020(
      selectedGroup.value,
      selectedStoreAttrs.value,
      selectedStoreTeam.value,
      selectedStoreSuperVisor.value,
      selectedStores.value,
      selectedstartDate.value,
      selectedendDate.value,
      code,
      getAffCompCdParam()
    );
    //comsole.log(res);
    rowData.value = res.data.List;

    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
  } finally {
    store.state.loading = false;
  }
};

const selectedGroup = ref();
const selectedStores = ref();
const selectedStoreAttrs = ref();
const selectedStoreTeam = ref();
const selectedStoreSuperVisor = ref();
/**
 * 페이지 매장 그룹 세팅
 */

const lngStoreGroup = (e) => {
  //comsole.log(e);
  selectedGroup.value = e;
};
/**
 * 페이지 매장 코드 세팅
 */

const lngStoreCodes = async (e) => {
  selectedStores.value = e;
  // 매장 선택 변경 시 결제코드 재로드
  await loadPayCodeList(selectedStores.value);
};

/**
 * 페이지 매장 분류 세팅
 */

const lngStoreAttrs = (e) => {
  selectedStoreAttrs.value = e;
  //comsole.log(e);
};
/**
 * 페이지 매장 슈퍼바이저 세팅
 */

const lngSupervisor = (e) => {
  selectedStoreSuperVisor.value = e;
  //comsole.log(e);
};
/**
 * 페이지 매장 팀 세팅
 */

const lngStoreTeam = (e) => {
  selectedStoreTeam.value = e;
  //comsole.log(e);
};

/**
 * 그리드 초기화
 */

const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
};

const exportExcel = ref(false);

/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  if (searchActionsDisabled.value) {
    Swal.fire({
      title: "경고",
      text: "소속사 정보를 조회할 수 없어 엑셀 내려받기가 제한됩니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  let codestr = "결제코드 :";
  if (selectedCode.value == null || selectedCode.value == undefined) {
    codestr += "전체";
  } else {
    codestr += selectedCode.value.strName;
  }

  documentSubTitle.value =
    selectedExcelDate.value +
    "\n" +
    selectedExcelStore.value +
    "\n" +
    codestr +
    (isAffPayCode.value ? "\n소속사 : " + getAffiliateExcelLabel() : "");
  //comsole.log(documentSubTitle.value);
  exportExcel.value = !exportExcel.value;
};

const resetVselect2 = () => {
  endTime.value = 23;
};
const datepicker = ref(null);
const closePopUp = ref(false);
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
const documentSubTitle = ref("");
const selectedExcelDate = ref("");
/**
 * 엑셀용 일자 세팅 함수
 */

const excelDate = (e) => {
  selectedExcelDate.value = e;
};
const selectedExcelStore = ref("");
/**
 * 엑셀용 매장 세팅 함수
 */

const excelStore = (e) => {
  selectedExcelStore.value = e;
};
const tempHideStore = ref(false);
const showStore = (e) => {
  if (e.target.checked) {
    tempHideStore.value = true;
  } else {
    tempHideStore.value = false;
  }
};
const tempCellUnite = ref(false);
const cellUnite = (e) => {
  if (e.target.checked) {
    tempCellUnite.value = true;
  } else {
    tempCellUnite.value = false;
  }
};
const tempSum = ref(false);
const showSum = (e) => {
  if (e.target.checked) {
    setGroupColumnId.value = "strName";
    setGroupFooter.value = true;
    reload.value = !reload.value;
  } else {
    setGroupColumnId.value = "";
    setGroupFooter.value = false;
    reload.value = !reload.value;
  }
};
/**
 *  컴포넌트 변동시 감지 함수
 */

const changeInit = (e) => {
  initGrid();
};
</script>

<style scoped>
.sls12-search-panel {
  box-sizing: border-box;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  padding-left: var(--sls12-panel-pad-x, 2rem);
  padding-right: var(--sls12-panel-pad-x, 2rem);
}

@media (min-width: 768px) {
  .sls12-search-panel {
    --sls12-panel-pad-x: 3rem;
  }
}

.sls12-search-layout {
  display: grid;
  grid-template-columns: max-content minmax(0, 1fr);
  column-gap: var(--sls12-col-gutter, 1.5rem);
  align-items: start;
  min-width: 0;
  width: 100%;
}

.sls12-left-stack {
  display: flex;
  flex-direction: column;
  gap: var(--sls12-row-gap, 0.875rem);
  min-width: 0;
  width: max-content;
  max-width: 100%;
}

.sls12-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  width: 100%;
  min-height: 2rem;
}

.sls12-row--store {
  align-items: stretch;
  min-height: 0;
}

.sls12-lbl {
  box-sizing: border-box;
  flex: 0 0 var(--sls12-label-col, 5.5rem);
  width: var(--sls12-label-col, 5.5rem);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
  text-align: center;
  white-space: nowrap;
}

.sls12-date-slot {
  flex: 0 1 auto;
  width: auto;
  min-width: 0;
  max-width: 100%;
}

.sls12-date-slot :deep(> div.flex.justify-start.items-center) {
  margin: 0 !important;
  width: auto !important;
  max-width: 100%;
}

.sls12-date-slot :deep(> div.flex > div.inline-flex.h-8) {
  flex: 0 1 auto;
  width: auto;
  max-width: 100%;
}

/* 기간 — 이전 크기(Datepicker2 w-36) 유지 */
.sls12-date-slot :deep(input[type="date"]) {
  box-sizing: border-box;
  height: 2rem;
  min-height: 2rem;
  flex: 0 0 9rem;
  width: 9rem !important;
  min-width: 9rem;
  max-width: 9rem;
  border: 1px solid var(--sls12-control-border, #cbd5e1);
  border-radius: 0.375rem;
  background: #fff;
}

/* 기간 첫 일자 · 결제코드 · 소속사 동일 폭 */
.sls12-ctrl-slot {
  box-sizing: border-box;
  flex: 0 0 var(--sls12-ctrl-w, 9rem);
  width: var(--sls12-ctrl-w, 9rem);
  min-width: 0;
  max-width: var(--sls12-ctrl-w, 9rem);
}

.sls12-row--pay-aff {
  flex-wrap: nowrap;
}

.sls12-row-spacer {
  flex: 1 1 auto;
  min-width: 1.5rem;
}

.sls12-sg-select {
  box-sizing: border-box;
  width: 100%;
  height: 2rem;
  min-height: 2rem;
  padding: 0 0.5rem;
  font-size: 0.875rem;
  color: rgb(55 65 81);
  border: 1px solid var(--sls12-control-border, #cbd5e1);
  border-radius: 0.375rem;
  background: #fff;
}

.sls12-sg-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.25);
}

.sls12-sg-select:disabled {
  cursor: not-allowed;
  background: #f3f4f6;
  color: #6b7280;
}

.sls12-search-panel :deep(.sls12-vselect) {
  width: 100%;
  min-width: 0;
  height: 2rem;
  min-height: 2rem;
}

.sls12-search-panel :deep(.sls12-vselect .vs__dropdown-toggle) {
  box-sizing: border-box;
  height: 2rem !important;
  min-height: 2rem !important;
  padding: 0 0.5rem !important;
  border: 1px solid var(--sls12-control-border, #cbd5e1) !important;
  border-radius: 0.375rem !important;
  background: #fff !important;
  overflow: hidden;
}

.sls12-search-panel :deep(.sls12-vselect .vs__selected-options) {
  display: flex;
  align-items: center;
  flex-wrap: nowrap !important;
  padding: 0 !important;
  margin: 0 !important;
  overflow: hidden;
  min-width: 0;
}

.sls12-search-panel :deep(.sls12-vselect .vs__selected),
.sls12-search-panel :deep(.sls12-vselect .vs__placeholder) {
  margin: 0 !important;
  padding: 0 !important;
  border: none;
  background: none;
  display: block;
  font-size: 0.875rem !important;
  line-height: 1.25rem !important;
  color: rgb(55 65 81);
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis;
  max-width: 100%;
  min-width: 0;
}

.sls12-search-panel :deep(.sls12-vselect .vs__search) {
  margin: 0 !important;
  padding: 0 !important;
  height: 1.25rem;
  line-height: 1.25rem;
  font-size: 0.875rem;
  min-width: 4px !important;
}

.sls12-search-panel :deep(.sls12-vselect .vs__actions) {
  padding: 0 0 0 0.25rem !important;
}

.sls12-right-store {
  /* 직전 80%의 90% → 약 72%, 우측 끝(패널 pad)에 맞춤 */
  width: 72%;
  max-width: 72%;
  min-width: 0;
  justify-self: end;
}

.sls12-pick-slot {
  min-width: 0;
  width: 100%;
  max-width: 100%;
}

/* 외곽 라벨(매장선택) 사용 — 컴포넌트 내부 매장명 라벨 숨김 */
.sls12-pick-slot :deep(.pss-brand) {
  display: none;
}

.sls12-pick-slot :deep(.pss-root) {
  width: 100%;
  max-width: 100%;
  min-width: 0;
}

/* 1열(그룹): 조금 더 확대 → 증가분은 2열에서 차감 */
.sls12-pick-slot :deep(.pss-grid) {
  width: 100%;
  min-width: 0;
  align-items: center;
  grid-template-columns:
    minmax(4.75rem, auto)
    minmax(0, 0.9fr)
    minmax(0, 1.6fr)
    minmax(0, 1.5fr);
}

/* 직/가맹 · 팀/SC — 열 가운데 정렬 */
.sls12-pick-slot :deep(.pss-radio) {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  justify-self: center;
  width: 100%;
  margin: 0;
  text-align: center;
  gap: 0.25rem;
}

.sls12-pick-slot :deep(.pss-col-grp) {
  width: 100% !important;
  min-width: 0 !important;
  max-width: 100% !important;
}

.sls12-pick-slot :deep(.pss-col-mid),
.sls12-pick-slot :deep(.pss-col-store),
.sls12-pick-slot :deep(.pss-mid-pair) {
  min-width: 0;
  width: 100%;
  max-width: 100%;
}

.sls12-pick-slot :deep(.pss-select),
.sls12-pick-slot :deep(.vs__dropdown-toggle) {
  border-color: var(--sls12-control-border, #cbd5e1) !important;
  box-sizing: border-box;
}

.sls12-pick-slot :deep(.pss-select) {
  height: 2rem;
  min-height: 2rem;
  width: 100%;
  min-width: 0;
}

.sls12-pick-slot :deep(.vs__dropdown-toggle) {
  height: 2rem !important;
  min-height: 2rem !important;
  width: 100%;
}

.sls12-pick-slot :deep(.custom-select2) {
  width: 100% !important;
  min-width: 0 !important;
  max-width: 100% !important;
}

@media (max-width: 1100px) {
  .sls12-search-layout {
    grid-template-columns: minmax(0, 1fr);
    row-gap: var(--sls12-row-gap, 0.875rem);
  }

  .sls12-left-stack {
    width: 100%;
  }

  .sls12-row--pay-aff {
    flex-wrap: wrap;
    row-gap: 0.5rem;
  }

  .sls12-row-spacer {
    flex-basis: 100%;
    min-width: 0;
    height: 0;
  }

  .sls12-right-store {
    width: 100%;
    max-width: 100%;
  }
}
</style>
