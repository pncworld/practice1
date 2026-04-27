<!-- /*--############################################################################
# Filename : MST04_014INS.vue                                                  
# Description : 마스터관리 > 자재마스터 > 손실 유형 등록.                          
# Date :2025-08-19                                                             
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <!-- MST45 계열: 상단 버튼 · 좌 목록 그리드 / 우 상세(안내 · 연보라 라벨) -->
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
        <button type="button" @click="excelButton" class="button save w-auto excel">
          엑셀
        </button>
      </div>
    </div>

    <div
      class="grid min-h-0 min-w-0 flex-1 grid-cols-1 gap-6 px-2 pb-4 lg:grid-cols-[minmax(0,7fr)_minmax(17rem,4fr)] lg:items-stretch lg:gap-8 lg:px-6">
      <!-- 좌: 목록 그리드 (제목 제거 후에도 예전 제목줄 높이 유지) -->
      <div class="flex min-h-0 min-w-0 flex-col">
        <div class="mb-2 min-h-[2.75rem] flex-none shrink-0 w-full" aria-hidden="true" />
        <div
          class="flex h-[65vh] min-h-[280px] w-full min-w-0 flex-col overflow-hidden rounded-sm border border-gray-400 bg-white">
          <div class="relative min-h-0 w-full flex-1">
            <Realgrid
              :progname="'MST04_014INS_VUE'"
              :progid="1"
              :rowData="rowData"
              :reload="reload"
              :checkRowAuto="false"
              :headerCheckBar="'checkbox2'"
              @clickedRowData="clickedRowData"
              @allStateRows="allStateRows"
              @sendRowState="sendRowState"
              @selectedIndex="selectedIndex"
              @updatedRowData="updatedRowData"
              :addRow4="addRow4"
              :addrowProp="'strItemType,strItemTypeName,lngLossCode,strLossName,strUseFlag'"
              :addrowDefault="'01,자재, , ,Y'"
              :documentTitle="'MST04_014INS'"
              :changeValue2="changeValue2"
              :changeColid="changeColid"
              :changeRow="changeRow"
              :changeNow="changeNow"
              :documentSubTitle="documentSubTitle"
              :rowStateeditable="false"
              :checkRenderEditable="true"
              :exporttoExcel="exportExcel">
            </Realgrid>
          </div>
        </div>
      </div>

      <!-- 우: 상세 입력 (좌측과 동일 제목줄 스페이서로 상단 정렬 맞춤) -->
      <div class="flex min-w-0 flex-col">
        <div class="mb-2 min-h-[2.75rem] flex-none shrink-0 w-full" aria-hidden="true" />
        <div class="w-full overflow-visible rounded-none border border-gray-600 bg-white">
          <div class="border-b border-gray-600 bg-gray-50 px-3 py-2.5">
            <p class="text-sm leading-relaxed text-gray-800">
              ※ 손실분류가 ‘메뉴’일 경우 ‘4’로 시작하는 4자리 코드를 생성해야합니다.
            </p>
          </div>
          <div class="grid grid-cols-[minmax(7rem,9.5rem)_1fr] border-b border-gray-600">
            <div
              class="flex min-h-[2.5rem] items-center justify-center border-r border-gray-600 bg-[#dfe3f5] px-2 py-2 text-center text-sm font-semibold text-gray-900">
              <span class="text-red-600">*</span>
              손실분류
            </div>
            <div class="flex min-h-[2.5rem] items-center bg-white px-3 py-2">
              <select
                name="strItemType"
                class="h-8 w-full max-w-full border border-black bg-white px-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                v-model="gridvalue1"
                @change="changeValue">
                <option :value="i.strDCode" v-for="i in optionList" :key="'item-' + i.strDCode">
                  {{ i.strDName }}
                </option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-[minmax(7rem,9.5rem)_1fr] border-b border-gray-600">
            <div
              class="flex min-h-[2.5rem] items-center justify-center border-r border-gray-600 bg-[#dfe3f5] px-2 py-2 text-center text-sm font-semibold text-gray-900">
              <span class="text-red-600">*</span>
              손실코드
            </div>
            <div class="flex min-h-[2.5rem] items-center bg-white px-3 py-2">
              <input
                type="text"
                name="lngLossCode"
                :disabled="disabled"
                autocomplete="off"
                @input="changeValue"
                v-model="gridvalue2"
                class="h-8 w-full rounded-none border border-black bg-white px-2 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-600" />
            </div>
          </div>

          <div class="grid grid-cols-[minmax(7rem,9.5rem)_1fr] border-b border-gray-600">
            <div
              class="flex min-h-[2.5rem] items-center justify-center border-r border-gray-600 bg-[#dfe3f5] px-2 py-2 text-center text-sm font-semibold text-gray-900">
              손실명
            </div>
            <div class="flex min-h-[2.5rem] items-center bg-white px-3 py-2">
              <input
                type="text"
                name="strLossName"
                autocomplete="off"
                class="h-8 w-full rounded-none border border-black bg-white px-2 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-500"
                v-model="gridvalue3"
                @input="changeValue" />
            </div>
          </div>
          <div class="grid grid-cols-[minmax(7rem,9.5rem)_1fr]">
            <div
              class="flex min-h-[2.5rem] items-center justify-center border-r border-gray-600 bg-[#dfe3f5] px-2 py-2 text-center text-sm font-semibold text-gray-900">
              사용구분
            </div>
            <div class="flex min-h-[2.5rem] items-center bg-white px-3 py-2">
              <select
                name="strUseFlag"
                class="h-8 w-full max-w-full border border-black bg-white px-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                v-model="gridvalue4"
                @change="changeValue">
                <option :value="i.strDCode" v-for="i in optionList2" :key="'use-' + i.strDCode">
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

import { nextTick, onMounted, ref } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { getCommonList } from "@/api/common";
import { getLossType, saveLossType } from "@/api/master";
import { deleteWorkLocation, saveWorkLocation } from "@/api/miattend";
import { useStore } from "vuex";
/**
 * 	화면 Load시 실행 스크립트
 */

const optionList = ref([]);
const optionList2 = ref([]);

const gridvalue1 = ref("01");
const gridvalue2 = ref();
const gridvalue3 = ref("");
const gridvalue4 = ref("1");
const gridvalue5 = ref("");
const gridvalue6 = ref("");
const gridvalue7 = ref("");
const gridvalue8 = ref("");
const cond = ref(1);
onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  //reload.value = !reload.value;

  searchButton();

  const res = await getCommonList(52);

  optionList.value = res.data.List;
  ////console.log(res.data.List);
  const res2 = await getCommonList(130);

  optionList2.value = res2.data.List;

  gridvalue4.value = 1;
  gridvalue1.value = "01";
});

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);
const disabled = ref(true);
const store = useStore();

const clickedRowData = (e) => {
  //console.log(e);
  gridvalue1.value = e[0];
  gridvalue2.value = e[2];
  gridvalue3.value = e[3];
  gridvalue4.value = e[4] == "Y" ? 1 : 2;
};

const updateStateRow = ref([]);
const allStateRows = (e) => {
  updateStateRow.value = e;
};
const sendRowState = (e) => {
  ////console.log(e);
  if (e == "created") {
    disabled.value = false;
  } else {
    disabled.value = true;
  }
};

const changeRow = ref(0);
const selectedIndex = (e) => {
  changeRow.value = e;
};
const changeNow = ref(false);
const changeColid = ref("");
const changeValue2 = ref("");

const changeValue = async (e) => {
  if (e.target.name == "lngLossCode") {
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
  }
  if (e.target.name == "strUseFlag") {
    changeColid.value = "strUseFlag";
    changeValue2.value = e.target.value == "1" ? "Y" : "N";

    changeNow.value = !changeNow.value;

    return;
  }

  changeColid.value = e.target.name;
  changeValue2.value = e.target.value;

  changeNow.value = !changeNow.value;

  await nextTick();

  if (changeColid.value == "strItemType") {
    changeColid.value = "strItemTypeName";
    changeValue2.value =
      e.target.value == "01"
        ? "자재"
        : e.target.value == "02"
        ? "제품"
        : e.target.value == "03"
        ? "메뉴"
        : "제조";

    changeNow.value = !changeNow.value;
  }
};

const updateRow = ref([]);
const updatedRowData = (e) => {
  updateRow.value = e;
};
/**
 *  조회 함수
 */

const searchButton = async () => {
  try {
    store.state.loading = true;
    initGrid();
    reload.value = !reload.value;
    const res = await getLossType(
      store.state.userData.lngStoreGroup,
      store.state.userData.strLanguage
    );
    rowData.value = res.data.List;

    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    //comsole.log(error);
  } finally {
    store.state.loading = false;
  }
};
const disablegrid = ref(true);
const insertupdatedelete = ref(1);
const addRow4 = ref(false);
const addButton = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  addRow4.value = !addRow4.value;
};

const saveButton = async () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  // ////console.log(updateStateRow.value);
  if (
    updateStateRow.value.updated.length == 0 &&
    updateStateRow.value.created.length == 0
  ) {
    Swal.fire({
      title: "경고",
      text: "변경된 사항이 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  const hashstate = new Set(updateRow.value.map((item) => item.lngLossCode));
  const size = updateRow.value.length;
  const setsize = hashstate.size;
  if (size != setsize) {
    Swal.fire({
      title: "경고",
      text: "중복된 손실코드가 존재합니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  const leng = updateRow.value.filter(
    (item) => item.lngLossCode == "" || item.lngLossCode == undefined
  );

  if (leng.length > 0) {
    Swal.fire({
      title: "경고",
      text: "입력이 되지 않은 손실코드가 존재합니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  try {
    store.state.loading = true;

    // const result = await fetch("https://api64.ipify.org", { timeout: 3000 });
    // const data = await result.text();
    // let userIp = data;

    let res;
    if (updateStateRow.value.created.length > 0) {
      const itemtypes = updateRow.value
        .filter((item, index) => updateStateRow.value.created.includes(index))
        .map((item) => item.strItemType);

      const losscodes = updateRow.value
        .filter((item, index) => updateStateRow.value.created.includes(index))
        .map((item) => item.lngLossCode);

      const losscnames = updateRow.value
        .filter((item, index) => updateStateRow.value.created.includes(index))
        .map((item) => item.strLossName);

      const useFlags = updateRow.value
        .filter((item, index) => updateStateRow.value.created.includes(index))
        .map((item) => item.strUseFlag);

      res = await saveLossType(
        store.state.userData.lngStoreGroup,
        0,
        itemtypes.join("\u200b"),
        losscodes.join("\u200b"),
        losscnames.join("\u200b"),
        useFlags.join("\u200b"),
        "I"
      );
    }

    if (updateStateRow.value.updated.length > 0) {
      const itemtypes = updateRow.value
        .filter((item, index) => updateStateRow.value.updated.includes(index))
        .map((item) => item.strItemType);

      const losscodes = updateRow.value
        .filter((item, index) => updateStateRow.value.updated.includes(index))
        .map((item) => item.lngLossCode);

      const losscnames = updateRow.value
        .filter((item, index) => updateStateRow.value.updated.includes(index))
        .map((item) => item.strLossName);

      const useFlags = updateRow.value
        .filter((item, index) => updateStateRow.value.updated.includes(index))
        .map((item) => item.strUseFlag);

      res = await saveLossType(
        store.state.userData.lngStoreGroup,
        0,
        itemtypes.join("\u200b"),
        losscodes.join("\u200b"),
        losscnames.join("\u200b"),
        useFlags.join("\u200b"),
        "U"
      );
    }

    ////console.log(res);
    if (res.data.RESULT_CD == "99") {
      Swal.fire({
        title: "실패",
        text: "저장에 실패하였습니다.",
        icon: "error",
        confirmButtonText: "확인",
      });
    } else {
      Swal.fire({
        title: "성공",
        text: "저장이 완료되었습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
    }

    ////console.log(res);
  } catch (error) {
  } finally {
    store.state.loading = false;
    searchButton();
  }
};

const deleteButton = async () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  // ////console.log(updateStateRow.value);
  if (updateRow.value.filter((item) => item.checkbox == true).length == 0) {
    Swal.fire({
      title: "경고",
      text: "삭제할 대상을 체크해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  try {
    store.state.loading = true;

    const result = await fetch("https://api64.ipify.org", { timeout: 3000 });
    const data = await result.text();
    let userIp = data;

    const rankcode = updateRow.value
      .filter((item) => item.checkbox == true)
      .map((item) => item.lngAreaCode);
    const userID = store.state.userData.lngSequence;
    const userIP = userIp;

    const res = await deleteWorkLocation(
      store.state.userData.lngStoreGroup,
      rankcode.join("\u200b"),

      userID,
      userIP
    );

    ////console.log(res);
    if (res.data.RESULT_CD == "99") {
      Swal.fire({
        title: "실패",
        text: "삭제에 실패하였습니다.",
        icon: "error",
        confirmButtonText: "확인",
      });
    } else {
      Swal.fire({
        title: "성공",
        text: "삭제가 완료되었습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
    }

    ////console.log(res);
  } catch (error) {
  } finally {
    store.state.loading = false;
    searchButton();
  }
};
/* 매장 컴포넌트 관련 함수 */

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
  afterSearch.value = false;

  gridvalue1.value = "01";
  gridvalue2.value = "";
  gridvalue3.value = "";
  gridvalue4.value = "1";
};

//엑셀 버튼 처리 함수
const exportExcel = ref(false);
/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  documentSubTitle.value = "";

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
