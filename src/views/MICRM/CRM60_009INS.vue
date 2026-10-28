<!-- /*--############################################################################
# Filename : CRM60_009INS.vue
# Description : 고객관리 > 전자상품권 마스터 관리 > 전자상품권 거래처 등록.
# Date :2025-06-23
# Author : 권맑음
################################################################################*/ -->
<template>
  <!--
    배치(참조): 좌 그룹 | 우 고객 — 각 패널 상단 폼 + 하단 그리드 전체 높이
    디자인: 기존 crm6009 타이틀바·폼·버튼 유지
  -->
  <div
    class="crm6009-page box-border flex h-full max-w-full min-h-0 flex-col overflow-hidden pl-5 pr-5"
    @click="handleParentClick">
    <div
      class="flex w-full shrink-0 items-center justify-between overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center space-x-2"></div>
    </div>

    <div class="crm6009-workspace mt-3 min-h-0 min-w-0 flex-1">
      <div class="crm6009-dual">
        <!-- 좌측: 그룹 — 타이틀·버튼은 바디(폼 영역) 안, 상단 탑바 아님 -->
        <section class="crm6009-side">
          <div class="crm6009-body shrink-0">
            <div class="crm6009-side-head">
              <h2 class="crm6009-sec-title">그룹정보</h2>
              <div class="crm6009-side-actions">
                <button type="button" class="pnc-sub-btn" @click="addButton">
                  <svg
                    class="pnc-sub-btn__icon"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    focusable="false">
                    <path
                      d="M12 5v14M5 12h14"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round" />
                  </svg>
                  신규
                </button>
                <button type="button" class="pnc-sub-btn" @click="saveButton">
                  <svg
                    class="pnc-sub-btn__icon"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    focusable="false">
                    <path
                      d="M5 13l4 4L19 7"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round" />
                  </svg>
                  저장
                </button>
              </div>
            </div>

            <div class="crm6009-form-grid crm6009-form-grid--left w-full">
              <div class="crm6009-form-label">그룹코드</div>
              <div class="crm6009-form-value">
              <input
                v-model="cond"
                type="number"
                class="crm6009-control"
                name="lngCode"
                :disabled="disable1" />
            </div>
            <div class="crm6009-form-label">그룹명</div>
            <div class="crm6009-form-value">
              <input
                v-model="cond2"
                type="text"
                class="crm6009-control"
                name="strName"
                :disabled="groupEditMode === 'none'" />
            </div>
            </div>
          </div>

          <div class="crm6009-grid-wrap">
            <Realgrid
              class="h-full min-h-0 w-full"
              :progname="'CRM60_009INS_VUE'"
              :progid="1"
              :rowData="rowData"
              :reload="reload"
              @clickedRowData="clickedRowData"
              :rowStateeditable="false"
              :exporttoExcel="exportExcel">
            </Realgrid>
          </div>
        </section>

        <!-- 우측: 고객 — 타이틀·버튼은 바디(폼 영역) 안 -->
        <section class="crm6009-side">
          <div class="crm6009-body shrink-0">
            <div class="crm6009-side-head">
              <h2 class="crm6009-sec-title">고객정보</h2>
              <div class="crm6009-side-actions">
                <button type="button" class="pnc-sub-btn" @click="addButton2">
                  <svg
                    class="pnc-sub-btn__icon"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    focusable="false">
                    <path
                      d="M12 5v14M5 12h14"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round" />
                  </svg>
                  신규
                </button>
                <button type="button" class="pnc-sub-btn" @click="saveButton2">
                  <svg
                    class="pnc-sub-btn__icon"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    focusable="false">
                    <path
                      d="M5 13l4 4L19 7"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round" />
                  </svg>
                  저장
                </button>
              </div>
            </div>

            <div class="crm6009-form-grid crm6009-form-grid--right w-full">
              <!-- 1행: 그룹코드 | 그룹명 -->
              <div class="crm6009-form-label">그룹코드</div>
              <div class="crm6009-form-value">
                <input
                  v-model="cond3"
                  type="number"
                  class="crm6009-control"
                  :disabled="true" />
              </div>
              <div class="crm6009-form-label">그룹명</div>
              <div class="crm6009-form-value">
                <input
                  v-model="cond3Name"
                  type="text"
                  class="crm6009-control"
                  :disabled="true" />
              </div>
              <!-- 2행: 고객카드 | 고객명 -->
              <div class="crm6009-form-label">고객카드</div>
              <div class="crm6009-form-value">
                <input
                  v-model="cond4"
                  type="number"
                  class="crm6009-control"
                  name="lngCode"
                  :disabled="disable2" />
              </div>
              <div class="crm6009-form-label">고객명</div>
              <div class="crm6009-form-value">
                <input
                  v-model="cond5"
                  type="text"
                  class="crm6009-control"
                  name="strName"
                  :disabled="custEditMode === 'none'" />
              </div>
            </div>
          </div>

          <div class="crm6009-grid-wrap">
            <Realgrid
              class="h-full min-h-0 w-full"
              :progname="'CRM60_009INS_VUE'"
              :progid="2"
              :rowData="rowData2"
              :reload="reload"
              @clickedRowData="clickedRowData2"
              :rowStateeditable="false"
              :exporttoExcel="exportExcel">
            </Realgrid>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  getGFTMaster,
  getGFTMaster2,
  saveGftCardClientEnroll,
} from "@/api/micrm";
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
/**
 *  경고창 호출 라이브러리
 *  */

import Swal from "sweetalert2";
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
  await insertPageLog(store.state.activeTab2);
  await searchButton();
});

const reload = ref(false);
const rowData = ref([]);
const rowData2 = ref([]);
const afterSearch = ref(false);
const selectedCond = ref(0);
const condValue = ref(0);
const cond = ref("");
const cond2 = ref("");
const cond3 = ref("");
/** 고객정보 표시용 그룹명 — 그룹 그리드 선택 시에만 세팅 */
const cond3Name = ref("");
const cond4 = ref("");
const cond5 = ref("");

const disable1 = ref(true);
const disable2 = ref(true);
const pcond21 = ref(0);
const pcond22 = ref("");
const pcond23 = ref("");
const pcond24 = ref("");
const today = ref(new Date());
const pcond1 = ref();
const pcond2 = ref("0");
const pcond3 = ref("");
const pcond4 = ref("");

const store = useStore();
const optionList = ref([]);
const optionList2 = ref([]);
const optionList3 = ref([]);
const optionList4 = ref([]);
const datepicker = ref(null);
const closePopUp = ref(false);

const sd = ref("");
const sd2 = ref("");
const ed = ref("");
const ed2 = ref("");
const selectedDate = ref("");
const startDate = (e) => {
  sd.value = e;
};
const endDate = (e) => {
  ed.value = e;
};

const excelDate = (e) => {
  selectedDate.value = e;
};

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

/**
 *  조회 함수
 */
/** none | create | update — 입력창 기준 저장 (그리드 행추가 없음) */
const groupEditMode = ref("none");
const custEditMode = ref("none");

const warn = (text) =>
  Swal.fire({
    title: "경고",
    text,
    icon: "warning",
    confirmButtonText: "확인",
  });

const clearGroupForm = () => {
  cond.value = "";
  cond2.value = "";
};

const clearCustForm = () => {
  cond4.value = "";
  cond5.value = "";
};

/** 그룹 신규 — 좌측 입력창만 오픈. 고객정보(우측)는 건드리지 않음 */
const addButton = () => {
  groupEditMode.value = "create";
  clearGroupForm();
  disable1.value = false;
};

/** 고객 신규 — 그룹 선택 후 입력창만 오픈 */
const addButton2 = () => {
  if (cond3.value === "" || cond3.value == null) {
    warn("좌측에서 그룹을 먼저 선택해주세요.");
    return;
  }
  custEditMode.value = "create";
  clearCustForm();
  disable2.value = false;
};

const searchButton = async () => {
  try {
    store.state.loading = true;
    initGrid();

    const res = await getGFTMaster(store.state.userData.lngStoreGroup);

    rowData.value = Array.isArray(res?.data?.List) ? res.data.List : [];

    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
  } finally {
    store.state.loading = false;
  }
};

/** 그룹 선택 유지한 채 고객 목록만 재조회 */
const reloadCustList = async () => {
  if (cond3.value === "" || cond3.value == null) {
    rowData2.value = [];
    return;
  }
  const res = await getGFTMaster2(
    store.state.userData.lngStoreGroup,
    cond3.value
  );
  rowData2.value = Array.isArray(res?.data?.List) ? res.data.List : [];
};

/* 매장 컴포넌트 관련 함수 */
const selectedGroup = ref();
const selectedStores = ref();
const selectedStores2 = ref();
const selectedStoreAttrs = ref();

const saveButton = async () => {
  const code = String(cond.value ?? "").trim();
  const name = String(cond2.value ?? "").trim();
  if (!code) {
    await warn("그룹코드를 입력해주세요.");
    return;
  }
  if (!name) {
    await warn("그룹명을 입력해주세요.");
    return;
  }
  if (groupEditMode.value !== "create" && groupEditMode.value !== "update") {
    await warn("신규 또는 수정할 그룹을 선택해주세요.");
    return;
  }

  const flag = groupEditMode.value === "create" ? "I" : "U";
  try {
    store.state.loading = true;
    await saveGftCardClientEnroll(
      store.state.userData.lngStoreGroup,
      code,
      "",
      name,
      1,
      flag
    );
    await Swal.fire({
      title: "성공",
      text: "저장에 성공하였습니다.",
      icon: "success",
      confirmButtonText: "확인",
    });
    groupEditMode.value = "none";
    disable1.value = true;
    clearGroupForm();
    /* 고객정보는 그룹 그리드 선택으로만 갱신 — 여기서 비우지 않음 */
    await searchButton();
  } catch (error) {
    await Swal.fire({
      title: "오류 발생",
      text: "저장 중 오류가 발생했습니다.",
      icon: "error",
      confirmButtonText: "확인",
    });
  } finally {
    store.state.loading = false;
  }
};

const saveButton2 = async () => {
  if (cond3.value === "" || cond3.value == null) {
    await warn("좌측에서 그룹을 먼저 선택해주세요.");
    return;
  }
  const code = String(cond4.value ?? "").trim();
  const name = String(cond5.value ?? "").trim();
  if (!code) {
    await warn("고객카드를 입력해주세요.");
    return;
  }
  if (!name) {
    await warn("고객명을 입력해주세요.");
    return;
  }
  if (custEditMode.value !== "create" && custEditMode.value !== "update") {
    await warn("신규 또는 수정할 고객을 선택해주세요.");
    return;
  }

  const flag = custEditMode.value === "create" ? "I" : "U";
  try {
    store.state.loading = true;
    await saveGftCardClientEnroll(
      store.state.userData.lngStoreGroup,
      cond3.value,
      code,
      name,
      2,
      flag
    );
    await Swal.fire({
      title: "성공",
      text: "저장에 성공하였습니다.",
      icon: "success",
      confirmButtonText: "확인",
    });
    custEditMode.value = "none";
    disable2.value = true;
    clearCustForm();
    await reloadCustList();
  } catch (error) {
    await Swal.fire({
      title: "오류 발생",
      text: "저장 중 오류가 발생했습니다.",
      icon: "error",
      confirmButtonText: "확인",
    });
  } finally {
    store.state.loading = false;
  }
};
/**
 * 페이지 매장 코드 세팅
 */

const lngStoreCode = async (e) => {
  //initGrid();
  selectedStores.value = e;
  ////console.log(e);
};
const lngStoreCode2 = async (e) => {
  //initGrid();
  selectedStores2.value = e;
  ////console.log(e);
};

/**
 * 그리드 초기화
 */

const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
  pcond21.value = 0;
  pcond22.value = today.value.toISOString().split("T")[0];
  pcond23.value = "";
  pcond24.value = "";
  pcond1.value = today.value.toISOString().split("T")[0];
  pcond2.value = 0;
  pcond3.value = "";
  pcond4.value = "";
};

//엑셀 버튼 처리 함수
const exportExcel = ref(false);
/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  documentSubTitle.value = selectedDate.value;

  exportExcel.value = !exportExcel.value;
};

// 엑셀 추출
const documentSubTitle = ref("");
const selectedExcelList = ref("");

const selectedExcelStore = ref("");
/**
 * 엑셀용 매장 세팅 함수
 */
const selectedCardNo = ref("");
const selectedDate2 = ref("");
const selectedStoreCd = ref("");
const rowField = (row, key, idx) => {
  if (row == null) return "";
  if (typeof row === "object" && !Array.isArray(row)) {
    return row[key] ?? "";
  }
  return Array.isArray(row) ? row[idx] ?? "" : "";
};

/** 그룹 행 클릭 → 좌측 수정모드 + 우측 그룹코드/명·고객목록 반영 (이때만 고객정보 갱신) */
const clickedRowData = async (e) => {
  const gCode = rowField(e, "lngCode", 0);
  const gName = rowField(e, "strName", 1);
  groupEditMode.value = "update";
  cond.value = gCode;
  cond2.value = gName;
  disable1.value = true;
  cond3.value = gCode;
  cond3Name.value = gName;
  clearCustForm();
  custEditMode.value = "none";
  disable2.value = true;
  try {
    store.state.loading = true;
    await reloadCustList();
  } finally {
    store.state.loading = false;
  }
};

/** 고객 행 클릭 → 폼에 담고 수정모드 */
const clickedRowData2 = (e) => {
  custEditMode.value = "update";
  cond4.value = rowField(e, "lngCode", 1);
  cond5.value = rowField(e, "strName", 2);
  disable2.value = true;
};
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
/* MST36_006 이중 패널과 동일: workspace가 남은 높이를 먹고 그리드가 flex-1로 채움 */
.crm6009-workspace {
  position: relative;
  min-height: 0;
  flex: 1 1 0%;
  overflow: hidden;
}

.crm6009-dual {
  display: grid;
  box-sizing: border-box;
  height: 100%;
  min-height: 0;
  min-width: 0;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 1.25rem;
}

.crm6009-side {
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  min-height: 0;
  min-width: 0;
  height: 100%;
  overflow: hidden;
}

/* 타이틀·서브버튼·폼 = 바디 (파란 탑바 아님) */
.crm6009-body {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  padding: 0.75rem 0.875rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background: #f9fafb;
}

.crm6009-side-head {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin: 0;
  padding: 0;
  background: transparent;
  border: none;
}

.crm6009-side-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.crm6009-sec-title {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin: 0;
  padding: 0;
  flex-shrink: 0;
  font-size: 1.0625rem;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.01em;
  color: #1a3c70;
  white-space: nowrap;
}

.crm6009-sec-title::before {
  content: "";
  display: inline-block;
  flex-shrink: 0;
  width: 0.25rem;
  height: 0.9em;
  border-radius: 999px;
  background: #2563eb;
}

.crm6009-form-grid {
  --crm6009-form-label-col: 5.5rem;
  --crm6009-form-row-h: 2.5rem;
  --crm6009-form-cell-py: 0.4375rem;
  --crm6009-form-font: 0.8125rem;
  --crm6009-form-control-h: 1.625rem;
  display: grid;
  grid-template-columns: var(--crm6009-form-label-col) minmax(0, 1fr);
  grid-auto-rows: var(--crm6009-form-row-h);
  width: 100%;
  max-width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  overflow: hidden;
  background: #fff;
  flex-shrink: 0;
}

/* 고객정보: 그룹코드 | 그룹명 한 행 */
.crm6009-form-grid--right {
  grid-template-columns:
    var(--crm6009-form-label-col)
    minmax(0, 0.9fr)
    var(--crm6009-form-label-col)
    minmax(0, 1.3fr);
}

.crm6009-form-grid > * {
  box-sizing: border-box;
  min-height: var(--crm6009-form-row-h);
  align-self: stretch;
}

.crm6009-form-label {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: var(--crm6009-form-row-h);
  padding: var(--crm6009-form-cell-py) 0.375rem;
  border: 1px solid #e5e7eb;
  background: #edf2f7;
  color: #5c5c5c;
  font-size: var(--crm6009-form-font);
  font-weight: 600;
  line-height: 1.25;
  text-align: center;
  word-break: keep-all;
}

.crm6009-form-value {
  display: flex;
  align-items: center;
  min-height: var(--crm6009-form-row-h);
  min-width: 0;
  padding: var(--crm6009-form-cell-py) 0.375rem;
  border: 1px solid #e5e7eb;
  background: #fff;
}

.crm6009-control {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  height: var(--crm6009-form-control-h);
  min-height: var(--crm6009-form-control-h);
  max-height: var(--crm6009-form-control-h);
  padding: 0 0.5rem;
  font-size: var(--crm6009-form-font);
  line-height: 1;
  color: #1e293b;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  background: #fff;
}

.crm6009-control:disabled {
  background: #f3f4f6;
  color: #6b7280;
}

.crm6009-control:focus,
.crm6009-control:focus-visible {
  border-color: #3b82f6;
  outline: none;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.25);
}

.crm6009-grid-wrap {
  position: relative;
  flex: 1 1 0;
  min-height: 10rem;
  min-width: 0;
  width: 100%;
  margin-top: 0.5rem;
  overflow: hidden;
}

@media (max-width: 1100px) {
  .crm6009-dual {
    grid-template-columns: minmax(0, 1fr);
    grid-auto-rows: minmax(18rem, 1fr);
    overflow: auto;
  }
}
</style>
