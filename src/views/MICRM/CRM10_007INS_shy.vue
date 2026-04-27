/*--############################################################################
# Filename : CRM10_007INS_shy.vue                                              
# Description : 마스터관리 > 예약 관리 > 예약타임테이블.                        
# Date :2025-06-04                                                             
# Author : 권맑음                     
################################################################################*/
<template>
  <!-- MST45_033INS 계열: 상단 버튼 · 회색 조회바 · 좌 그리드 / 우 상세 -->
  <div class="flex h-full max-w-full min-h-0 flex-col gap-3 overflow-hidden pb-1 box-border">
    <div class="flex shrink-0 flex-wrap items-center justify-between gap-3 overflow-y-hidden">
      <PageName />
      <div class="flex flex-wrap items-center justify-end gap-2 pr-2">
        <button type="button" @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <button type="button" @click="addButton" class="button new md:w-auto w-14">
          신규
        </button>
        <button type="button" @click="saveButton" class="button save md:w-auto w-14">
          저장
        </button>
        <button type="button" @click="deleteButton" class="button delete md:w-auto w-14">
          삭제
        </button>
        <button type="button" @click="excelButton" class="button save w-auto excel">
          엑셀
        </button>
      </div>
    </div>

    <div class="flex shrink-0 justify-start rounded-lg bg-gray-200 px-4 py-3">
      <PickStore
        :compactSearchBar="true"
        :compact-store-combo-max-rem="14.4"
        :hideGroup="false"
        :hideAttr="false"
        @update:storeCd="lngStoreCode"
        @update:storeGroup="lngStoreGroup"
        @storeNm="excelStore">
      </PickStore>
    </div>

    <div
      class="grid min-h-0 min-w-0 flex-1 grid-cols-1 gap-6 px-2 pb-4 lg:grid-cols-[minmax(0,7fr)_minmax(17rem,4fr)] lg:items-stretch lg:gap-8 lg:px-6">
      <!-- 좌: 목록 그리드 -->
      <div class="flex min-h-0 min-w-0 flex-col">
        <div class="mb-2 flex min-h-[2.75rem] flex-none items-center">
          <h2 class="text-lg font-bold leading-none tracking-tight text-gray-900">
            예약 타임테이블
          </h2>
        </div>
        <div
          class="flex h-[65vh] min-h-[280px] w-full min-w-0 flex-col overflow-hidden rounded-sm border border-gray-400 bg-white">
          <div class="relative min-h-0 w-full flex-1">
            <Realgrid
              :progname="'CRM10_007INS_VUE_shy'"
              :progid="1"
              :rowData="rowData"
              :reload="reload"
              :setStateBar="false"
              @clickedRowData="clickedRowData"
              :documentTitle="'CRM10_007INS_shy'"
              :dynamicRowHeight="true"
              :documentSubTitle="documentSubTitle"
              :rowStateeditable="false"
              :exporttoExcel="exportExcel">
            </Realgrid>
          </div>
        </div>
      </div>

      <!-- 우: 상세 입력 -->
      <div class="flex min-w-0 flex-col">
        <div class="mb-2 flex min-h-[2.75rem] flex-none items-center">
          <h2 class="text-lg font-bold leading-none tracking-tight text-gray-900">상세정보</h2>
        </div>
        <!-- overflow-visible: vue3-timepicker 드롭다운(absolute)이 잘리지 않도록 -->
        <div class="w-full overflow-visible rounded-none border border-gray-600 bg-white">
          <div class="grid grid-cols-[minmax(7rem,9.5rem)_1fr] border-b border-gray-600">
            <div
              class="flex min-h-[2.5rem] items-center justify-center border-r border-gray-600 bg-[#dfe3f5] px-2 py-2 text-center text-sm font-semibold text-gray-900">
              휴일구분
            </div>
            <div class="flex min-h-[2.5rem] items-center bg-white px-3 py-2">
              <select
                class="h-8 w-full max-w-full border border-black bg-white px-2 text-sm disabled:bg-gray-100"
                :disabled="disableCoreDetailFields"
                v-model="gridvalue1">
                <option value="0">평일</option>
                <option value="1">휴일</option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-[minmax(7rem,9.5rem)_1fr] border-b border-gray-600">
            <div
              class="flex min-h-[2.5rem] items-center justify-center border-r border-gray-600 bg-[#dfe3f5] px-2 py-2 text-center text-sm font-semibold text-gray-900">
              식사구분
            </div>
            <div class="flex min-h-[2.5rem] items-center bg-white px-3 py-2">
              <select
                class="h-8 w-full max-w-full border border-black bg-white px-2 text-sm disabled:bg-gray-100"
                :disabled="disableCoreDetailFields"
                v-model="gridvalue2">
                <option value="0">선택</option>
                <option :value="i.strDCode" v-for="i in optionList" :key="'ml-' + i.strDCode">
                  {{ i.strDName }}
                </option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-[minmax(7rem,9.5rem)_1fr] border-b border-gray-600">
            <div
              class="flex min-h-[2.5rem] items-center justify-center border-r border-gray-600 bg-[#dfe3f5] px-2 py-2 text-center text-sm font-semibold text-gray-900">
              회차
            </div>
            <div class="flex min-h-[2.5rem] items-center bg-white px-3 py-2">
              <select
                class="h-8 w-full max-w-full border border-black bg-white px-2 text-sm disabled:bg-gray-100"
                :disabled="disableCoreDetailFields"
                v-model="gridvalue3">
                <option value="0">선택</option>
                <option :value="i.strDCode" v-for="i in optionList2" :key="'rn-' + i.strDCode">
                  {{ i.strDName }}
                </option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-[minmax(7rem,9.5rem)_1fr] border-b border-gray-600">
            <div
              class="flex min-h-[2.5rem] items-center justify-center border-r border-gray-600 bg-[#dfe3f5] px-2 py-2 text-center text-sm font-semibold text-gray-900">
              시간대코드
            </div>
            <div class="flex min-h-[2.5rem] items-center bg-white px-3 py-2">
              <input
                type="text"
                :disabled="disableCoreDetailFields"
                v-model="gridvalue4"
                class="h-8 w-full rounded-none border border-black bg-white px-2 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100" />
            </div>
          </div>
          <div class="grid grid-cols-[minmax(7rem,9.5rem)_1fr] border-b border-gray-600">
            <div
              class="flex min-h-[2.75rem] items-center justify-center border-r border-gray-600 bg-[#dfe3f5] px-2 py-2 text-center text-sm font-semibold text-gray-900">
              시간대
            </div>
            <div class="flex min-h-[2.75rem] items-center bg-white px-3 py-2">
              <div class="crm10-timepicker-wrap w-full min-w-0">
                <TimePicker
                  v-model="gridvalue5"
                  format="HH:mm"
                  :hour12="false"
                  manual-input
                  :disabled="disableTimeAndUseFields"
                  :key="setGridValue5"
                  input-width="100%"
                  fixed-dropdown-button
                  drop-direction="auto"
                  :minute-interval="1"
                  :input-class="timePickerInputClass"
                />
              </div>
            </div>
          </div>
          <div class="grid grid-cols-[minmax(7rem,9.5rem)_1fr]">
            <div
              class="flex min-h-[2.5rem] items-center justify-center border-r border-gray-600 bg-[#dfe3f5] px-2 py-2 text-center text-sm font-semibold text-gray-900">
              사용여부
            </div>
            <div class="flex min-h-[2.5rem] items-center bg-white px-3 py-2">
              <select
                class="h-8 w-full max-w-full border border-black bg-white px-2 text-sm disabled:bg-gray-100"
                :disabled="disableTimeAndUseFields"
                v-model="gridvalue6">
                <option :value="i.strDCode" v-for="i in optionList3" :key="'use-' + i.strDCode">
                  {{ i.strDName }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getCommonList } from "@/api/common";
import {
  getReservedChangeHistory,
  getReservedTimeTable,
  saveReserveTimeTable,
} from "@/api/micrm";
import TimePicker from "vue3-timepicker";
import "vue3-timepicker/dist/VueTimepicker.css";
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

import { insertPageLog } from "@/customFunc/customFunc";
/**
 *  경고창 호출 라이브러리
 *  */

import Swal from "sweetalert2";
/*
 * 공통 표준  Function
 */

import { computed, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";

/** vue3-timepicker 입력칸을 행 다른 필드(h-8·테두리)와 맞춤 */
const timePickerInputClass =
  "!box-border !h-8 !min-h-[2rem] !rounded-none !border !border-black !bg-white !px-2 !text-sm !outline-none focus:!border-blue-600 focus:!ring-1 focus:!ring-blue-500 disabled:!bg-gray-100 disabled:!text-gray-700";

/** 그리드/ API에서 온 값 → "HH:mm" (숫자만 3~4자리는 930→09:30, 1430→14:30) */
function normalizePickerTime(v) {
  if (v == null || v === "") return "00:00";
  if (v instanceof Date && !Number.isNaN(+v)) {
    return `${String(v.getHours()).padStart(2, "0")}:${String(
      v.getMinutes()
    ).padStart(2, "0")}`;
  }
  const s = String(v).trim();
  const m24 = s.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (m24) {
    const hh = Math.min(23, parseInt(m24[1], 10));
    const mm = Math.min(59, parseInt(m24[2], 10));
    return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
  }
  const digits = s.replace(/\D/g, "");
  if (digits.length === 3 || digits.length === 4) {
    const pad = digits.padStart(4, "0").slice(-4);
    const hh = Math.min(23, parseInt(pad.slice(0, 2), 10));
    const mm = Math.min(59, parseInt(pad.slice(2), 10));
    return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
  }
  return s;
}

/** 상세 미선택 시 전부 비활성 · 그리드 행 선택 시 핵심칸만 잠금 */
const detailInactive = ref(true);
const editingExistingRow = ref(false);

const disableCoreDetailFields = computed(
  () => detailInactive.value || editingExistingRow.value
);
const disableTimeAndUseFields = computed(() => detailInactive.value);

const optionList = ref([]);
const optionList2 = ref([]);
const optionList3 = ref([]);

const gridvalue1 = ref(0);
const gridvalue2 = ref(0);
const gridvalue3 = ref(0);
const gridvalue4 = ref("");
const gridvalue5 = ref("00:00");
const setGridValue5 = ref(1);
const gridvalue6 = ref(1);

const reload = ref(false);

const store = useStore();

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
  const res = await getCommonList(231);
  const res2 = await getCommonList(232);
  const res3 = await getCommonList(45);

  optionList.value = res.data.List;
  optionList2.value = res2.data.List;
  optionList3.value = res3.data.List;
  ////console.log(optionList2.value);
  reload.value = !reload.value;
});
const rowData = ref([]);
const afterSearch = ref(false);

const cond = ref("");
const cond2 = ref("");

/** PickStore @update:storeCd — 미선택·전체(0)이면 버튼 동작 차단 */
const selectedGroup = ref();
const selectedStores = ref();
const selectedStoreAttrs = ref();

function warnIfNoStoreSelected() {
  const code = selectedStores.value;
  if (
    code === null ||
    code === undefined ||
    code === "" ||
    code === "0" ||
    code === 0
  ) {
    Swal.fire({
      title: "경고",
      text: "매장을 선택해 주십시오.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return true;
  }
  return false;
}

const clickedRowData = (e) => {
  detailInactive.value = false;
  editingExistingRow.value = true;
  insertupdatedelete.value = 2;
  ////console.log(e);
  gridvalue1.value = e[6];
  gridvalue2.value = e[7];
  gridvalue3.value = e[8];
  gridvalue4.value = e[3];
  ////console.log(e[4]);
  gridvalue5.value = normalizePickerTime(e[4]);
  gridvalue6.value = e[9];
  setGridValue5.value = setGridValue5.value + 1;
};

/**
 *  조회 함수
 */

const searchButton = async () => {
  if (warnIfNoStoreSelected()) return;
  try {
    store.state.loading = true;
    initGrid();
    reload.value = !reload.value;
    const res = await getReservedTimeTable(
      selectedGroup.value,
      selectedStores.value
    );
    ////console.log(res);
    rowData.value = res.data.List;

    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    //comsole.log(error);
  } finally {
    store.state.loading = false;
  }
};
const insertupdatedelete = ref(1);
const addButton = () => {
  if (warnIfNoStoreSelected()) return;
  insertupdatedelete.value = 1;
  detailInactive.value = false;
  editingExistingRow.value = false;
  gridvalue1.value = 1;
  gridvalue2.value = 0;
  gridvalue3.value = 0;
  gridvalue4.value = "";
  gridvalue5.value = "00:00";
  gridvalue6.value = 1;

  setGridValue5.value = setGridValue5.value + 1;
};

const saveButton = async () => {
  if (warnIfNoStoreSelected()) return;
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  if (insertupdatedelete.value === 3 && !editingExistingRow.value) {
    Swal.fire({
      title: "경고",
      text: "삭제할 항목을 선택해 주십시오.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  if (gridvalue2.value == 0) {
    Swal.fire({
      title: "경고",
      text: "식사구분을 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  if (gridvalue3.value == 0) {
    Swal.fire({
      title: "경고",
      text: "회차를 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (gridvalue4.value == "" || gridvalue4.value.trim() === "") {
    Swal.fire({
      title: "경고",
      text: "시간대코드를 입력해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (gridvalue5.value == "00:00") {
    Swal.fire({
      title: "경고",
      text: "시간대를 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  try {
    store.state.loading = true;
    const res = await saveReserveTimeTable(
      selectedGroup.value,
      selectedStores.value,
      gridvalue1.value,
      gridvalue2.value,
      gridvalue3.value,
      gridvalue4.value,
      gridvalue5.value,
      gridvalue6.value,
      insertupdatedelete.value == 1
        ? "I"
        : insertupdatedelete.value == 2
        ? "U"
        : "D"
    );

    Swal.fire({
      title: "성공",
      text: "저장이 완료되었습니다.",
      icon: "success",
      confirmButtonText: "확인",
    });
    ////console.log(res);
  } catch (error) {
  } finally {
    store.state.loading = false;
    searchButton();
  }
};

const deleteButton = async () => {
  if (warnIfNoStoreSelected()) return;

  const confirm = await Swal.fire({
    title: "삭제 확인",
    text: "선택한 항목을 삭제하시겠습니까?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "삭제",
    cancelButtonText: "취소",
  });

  if (!confirm.isConfirmed) return;

  insertupdatedelete.value = 3;
  await saveButton();
};

/**
 * 페이지 매장 코드 세팅
 */

const lngStoreCode = async (e) => {
  initGrid();
  selectedStores.value = e;
};
const lngStoreGroup = async (e) => {
  //initGrid();
  selectedGroup.value = e;
};

/**
 * 그리드 초기화
 */

const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
  afterSearch.value = false;
  detailInactive.value = true;
  editingExistingRow.value = false;
  gridvalue1.value = 0;
  gridvalue2.value = 0;
  gridvalue3.value = 0;
  gridvalue4.value = "";
  gridvalue5.value = "00:00";
  setGridValue5.value = setGridValue5.value + 1;
  gridvalue6.value = 0;
};

//엑셀 버튼 처리 함수
const exportExcel = ref(false);
/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  if (warnIfNoStoreSelected()) return;
  documentSubTitle.value = selectedExcelStore.value + "\n";

  //documentSubTitle.value += "\n";
  exportExcel.value = !exportExcel.value;
};

// 엑셀 추출
const documentSubTitle = ref("");
const selectedExcelList = ref("");
const selectedExcelDate = ref("");

const selectedExcelStore = ref("");
/**
 * 엑셀용 매장 세팅 함수
 */

const excelStore = (e) => {
  selectedExcelStore.value = "매장명 : " + e;
  //comsole.log(e);
};
const excelDate = (e) => {
  selectedExcelDate.value = e;
  //comsole.log(e);
};
</script>

<style scoped>
/* 시간대 선택 패널: 라이브러리 기본(10em)보다 크게 노출 — 가로는 셀에 맞춤 */
.crm10-timepicker-wrap :deep(.vue__time-picker) {
  display: block;
  width: 100%;
}
.crm10-timepicker-wrap :deep(.vue__time-picker .dropdown),
.crm10-timepicker-wrap :deep(.vue__time-picker .dropdown .select-list) {
  width: 100% !important;
  height: min(42vh, 17.5rem) !important;
  max-height: none;
}
.crm10-timepicker-wrap :deep(.vue__time-picker .dropdown ul) {
  flex: 1 1 auto;
}
</style>
