/*--############################################################################
# Filename : CRM10_019INS.vue                                                  
# Description : 마스터관리 > 예약 관리 > 예약가능인원.                          
# Date :2025-06-04                                                             
# Author : 권맑음                     
################################################################################*/
<template>
  <!-- MST45 / CRM10_007 계열: 상단 버튼 · 회색 조회바 · 좌 그리드 / 우 상세 -->
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
            예약가능인원
          </h2>
        </div>
        <div
          class="flex h-[65vh] min-h-[280px] w-full min-w-0 flex-col overflow-hidden rounded-sm border border-gray-400 bg-white">
          <div class="relative min-h-0 w-full flex-1">
            <Realgrid
              :progname="'CRM10_019INS_VUE'"
              :progid="1"
              :rowData="rowData"
              :reload="reload"
              :setStateBar="false"
              @clickedRowData="clickedRowData"
              :documentTitle="'CRM10_019INS'"
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
          <div class="grid grid-cols-[minmax(7rem,9.5rem)_1fr]">
            <div
              class="flex min-h-[2.5rem] items-center justify-center border-r border-gray-600 bg-[#dfe3f5] px-2 py-2 text-center text-sm font-semibold text-gray-900">
              MAX
            </div>
            <div class="flex min-h-[2.5rem] items-center bg-white px-3 py-2">
              <input
                type="number"
                :disabled="disableMaxField"
                v-model.number="gridvalue4"
                min="0"
                class="h-8 w-full rounded-none border border-black bg-white px-2 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getCommonList } from "@/api/common";
import { getReservedNum, saveReserveNum } from "@/api/micrm";

import PageName from "@/components/pageName.vue";
import PickStore from "@/components/pickStore.vue";

import Realgrid from "@/components/realgrid.vue";

import { insertPageLog } from "@/customFunc/customFunc";

import Swal from "sweetalert2";

import { computed, onMounted, ref } from "vue";

import { useStore } from "vuex";

const optionList = ref([]);
const optionList2 = ref([]);

const gridvalue1 = ref(0);
const gridvalue2 = ref(0);
const gridvalue3 = ref(0);
const gridvalue4 = ref(0);

const reload = ref(false);

const store = useStore();

const selectedGroup = ref();
const selectedStores = ref();

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

/** 상세 미선택 시 전부 비활성 · 그리드 행 선택 시 핵심칸만 잠금(MAX만 수정 가능) */
const detailInactive = ref(true);
/** 그리드 행 선택 후 삭제 검증용 */
const editingExistingRow = ref(false);

const disableCoreDetailFields = computed(
  () => detailInactive.value || editingExistingRow.value
);
const disableMaxField = computed(() => detailInactive.value);

onMounted(async () => {
  await insertPageLog(store.state.activeTab2);
  const res = await getCommonList(231);
  const res2 = await getCommonList(232);

  optionList.value = res.data.List;
  optionList2.value = res2.data.List;

  reload.value = !reload.value;
});

const rowData = ref([]);
const afterSearch = ref(false);

const cond = ref("");
const cond2 = ref("");

const clickedRowData = (e) => {
  detailInactive.value = false;
  editingExistingRow.value = true;
  insertupdatedelete.value = 2;
  gridvalue1.value = e[4];
  gridvalue2.value = e[5];
  gridvalue3.value = e[6];
  gridvalue4.value = e[3];
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
    const res = await getReservedNum(selectedGroup.value, selectedStores.value);
    rowData.value = res.data.List;

    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
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
  gridvalue1.value = 0;
  gridvalue2.value = 0;
  gridvalue3.value = 0;
  gridvalue4.value = 0;
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

  try {
    store.state.loading = true;
    await saveReserveNum(
      selectedGroup.value,
      selectedStores.value,
      gridvalue1.value,
      gridvalue2.value,
      gridvalue3.value,
      gridvalue4.value,

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
  gridvalue4.value = 0;
};

//엑셀 버튼 처리 함수
const exportExcel = ref(false);
/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  if (warnIfNoStoreSelected()) return;
  documentSubTitle.value = selectedExcelStore.value + "\n";

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
};
const excelDate = (e) => {
  selectedExcelDate.value = e;
};
</script>
