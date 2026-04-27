/*--############################################################################
# Filename : MST45_033INS.vue                                                  
# Description : 마스터관리 > 자재 마스터Ⅱ > 자재 단위 등록                      
  # Date :2025-08-20                                                           
  # Author : 권지안                  
################################################################################*/
<template>
  <!-- 조회 조건 -->
  <div class="h-[80%]">
    <div class="flex justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center mr-10 space-x-2 pr-5">
        <button @click="searchButton" class="button search">조회</button>
        <button @click="saveButton" class="button save">저장</button>
        <button @click="excelButton" class="button excel">엑셀</button>
      </div>
    </div>
    <div
      class="flex justify-start space-x-5 bg-gray-200 rounded-lg h-16 items-center mt-3">
      <PickGroup @update:storeGroup="handleGroupCd" @GroupNm="GroupNm">
      </PickGroup>
    </div>
    <!-- 마스터-디테일: 좌 목록 그리드 / 우 상세 입력 — 제목줄·박스 상단 라인 동일 -->
    <div
      class="mt-5 grid min-h-0 w-full grid-cols-1 gap-6 px-4 pb-6 lg:grid-cols-[minmax(0,7fr)_minmax(17rem,4fr)] lg:items-stretch lg:gap-8 lg:px-10">
      <!-- 좌측: 자재 단위 목록 — Realgrid는 부모 높이 체인(h-full) 필요 -->
      <div class="flex min-h-0 min-w-0 flex-col">
        <div class="mb-2 flex min-h-[2.75rem] flex-none items-center">
          <h2 class="text-lg font-bold leading-none tracking-tight text-gray-900">
            자재 단위 정보
          </h2>
        </div>
        <div
          class="flex h-[65vh] min-h-[280px] w-full min-w-0 flex-col overflow-hidden rounded-sm border border-gray-400 bg-white">
          <div class="relative min-h-0 w-full flex-1">
            <Realgrid
            :progname="'MST45_033INS_VUE'"
            :progid="1"
            :rowData="rowData"
            @clickedRowData="clickedRowData"
            :changeNow="changeNow"
            :changeValue2="changeValue2"
            :changeColid="changeColid"
            :changeRow="changeRow"
            @selectedIndex="selectedIndex"
            @selcetedrowData="selcetedrowData"
            @updatedRowData="updatedRowData"
            :selectionStyle="'singleRow'"
            :addRow4="addRow"
            @allStateRows="allStateRows"
            :deleteRow6="deleteRow"
            :addrowDefault="addrowDefault"
            @sendRowState="sendRowState"
            :addrowProp="addrowProp"
            :rowStateeditable="false"
            :addField="'new'"
            :documentTitle="'MST45_033INS'"
            :documentSubTitle="documentSubTitle"
            :exporttoExcel="exporttoExcel"
            :ExcelNm="'자재 단위 등록'"></Realgrid>
          </div>
        </div>
      </div>

      <!-- 우측: 상세정보 — 제목줄 높이·mb는 좌측과 동일 → 입력 박스 상단 = 그리드 상단 -->
      <div class="flex min-w-0 flex-col">
        <div
          class="mb-2 flex min-h-[2.75rem] flex-none flex-wrap items-center justify-between gap-x-3 gap-y-2 lg:flex-nowrap">
          <h2 class="text-lg font-bold leading-none tracking-tight text-gray-900">상세정보</h2>
          <div class="flex shrink-0 items-center gap-2">
            <button type="button" :class="popupToolbarBtnClass" @click="addButton">
              추가
            </button>
            <button type="button" :class="popupToolbarBtnClass" @click="deleteButton">
              삭제
            </button>
          </div>
        </div>
        <div class="w-full flex-1 overflow-hidden rounded-none border border-gray-600 bg-white">
          <div class="grid grid-cols-[minmax(7rem,9.5rem)_1fr] border-b border-gray-600">
            <div
              class="flex min-h-[2.5rem] items-center justify-center border-r border-gray-600 bg-[#dfe3f5] px-2 py-2 text-center text-sm font-semibold text-gray-900">
              <span class="text-red-600">*</span>
              자재단위코드
            </div>
            <div class="flex min-h-[2.5rem] items-center bg-white px-3 py-2">
              <input
                type="number"
                name="gridvalue1"
                class="gridvalue1 h-8 w-full rounded-none border border-black bg-white px-2 text-sm text-gray-900 outline-none focus:z-10 focus:border-blue-600 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                v-model="gridvalue1"
                @input="changeInfo"
                :disabled="isNewColumn" />
            </div>
          </div>
          <div class="grid grid-cols-[minmax(7rem,9.5rem)_1fr]">
            <div
              class="flex min-h-[2.5rem] items-center justify-center border-r border-gray-600 bg-[#dfe3f5] px-2 py-2 text-center text-sm font-semibold text-gray-900">
              자재단위명
            </div>
            <div class="flex min-h-[2.5rem] items-center bg-white px-3 py-2">
              <input
                type="text"
                name="gridvalue2"
                class="gridvalue2 h-8 w-full rounded-none border border-black bg-white px-2 text-sm text-gray-900 outline-none focus:z-10 focus:border-blue-600 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                v-model="gridvalue2"
                @input="changeInfo"
                :disabled="!clickrowData1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- 연동 데이터 영역 -->
</template>

<script setup>
import { getMaterialUnit, saveMaterialUnit } from "@/api/master";
/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";

/**
 *  페이지명 매장 그룹 호출 컴포넌트
 *  */

import PickGroup from "@/components/pickGroup.vue";

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

/** PUR03_035INS 발주등록 팝업 · MST04_001INS 신규팝업과 동일 흰 버튼 */
const popupToolbarBtnClass =
  "whitebutton !h-9 !px-5 !py-2 !text-sm !font-semibold !border-gray-500 !text-gray-700 hover:!bg-blue-50 hover:!border-blue-400 disabled:opacity-50 disabled:pointer-events-none";

/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
});
const rowData = ref([]);
const groupCd = ref();

const afterSearch = ref(false);

const isNewColumn = ref(true);
const clickrowData1 = ref(false);

const addRow = ref(false);
const changeNow = ref(false);
const changeValue2 = ref();
const changeColid = ref();
const changeRow = ref();
const gridvalue1 = ref();
const gridvalue2 = ref();

/**
 * 수정용 데이터 행 설정
 */

const selectedIndex = (newValue) => {
  changeRow.value = newValue;
  //comsole.log(changeRow.value);
};
/**
 *  추가 버튼
 */

const addButton = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "조회를 먼저 해주세요.",
      confirmButtonText: "확인",
    });
    return;
  }
  clickrowData1.value = true;
  addRow.value = !addRow.value;
};
/**
 * 그리드 행 삭제 버튼 함수
 */

const deleteRow = ref(false);
/**
 * 삭제 버튼
 */

const deleteButton = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "조회를 먼저 해주세요.",
      confirmButtonText: "확인",
    });
    return;
  }

  /*
  if (isNewColumn.value == false) {
    Swal.fire({
      title: "먼저 자재단위코드를 생성해주세요.",
      confirmButtonText: "확인",
    });
    return;
  }
  */

  deleteRow.value = !deleteRow.value;
};

const disableCd = ref(false);
/**
 * 데이터셋 상세정보 셋팅
 */

const clickedRowData = (newValue) => {
  clickrowData1.value = true;
  gridvalue1.value = newValue[0];
  gridvalue2.value = newValue[1];
};

const sendRowState = (e) => {
  if (e == "created") {
    isNewColumn.value = false;
  } else {
    isNewColumn.value = true;
  }
  // ////console.log(e);
};

/**
 * 페이지 매장 그룹 세팅
 */

const handleGroupCd = (newValue) => {
  groupCd.value = newValue;
  rowData.value = [];
  gridvalue1.value = "";
  gridvalue2.value = "";
  addrowDefault.value = newValue;
};

const updateRow = ref([]);
/**
 * 입력창 수정 데이터 갱신
 */

const updatedRowData = (newValue) => {
  updateRow.value = newValue;
  //comsole.log(newValue);
};

/**
 * INPUT , SELECT 수정 데이터 갱신
 */

const changeInfo = (e) => {
  const rowName = e.target.name;
  const rowValue = e.target.value;

  if (rowName == "gridvalue1") {
    changeColid.value = "lngUnitID";
    changeValue2.value = rowValue;
  } else if (rowName == "gridvalue2") {
    changeColid.value = "strUnitName";
    changeValue2.value = rowValue;
  }
  changeNow.value = !changeNow.value;
};

const addrowDefault = ref();
const exporttoExcel = ref(false);
const addrowProp = ref("lngStoreGroup");
const store = useStore();
const documentSubTitle = ref("");

const allstaterows = ref([]);
const allStateRows = (e) => {
  allstaterows.value = e;
};

/**
 * 엑셀 내보내기 함수
 */

const storeGroupNm = ref();

const GroupNm = (newValue) => {
  storeGroupNm.value = newValue;
};

const excelButton = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "조회를 먼저 해주세요.",
      confirmButtonText: "확인",
    });
    return;
  }
  documentSubTitle.value = "매장그룹 : " + storeGroupNm.value;
  exporttoExcel.value = !exporttoExcel.value;
};
/**
 *  조회 함수
 */

const searchButton = async () => {
  if (groupCd.value == 0) {
    Swal.fire({
      title: "경고",
      text: "매장그룹을 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  store.state.loading = true;
  try {
    rowData.value = [];
    gridvalue1.value = "";
    gridvalue2.value = "";

    let res;
    //comsole.log(groupCd.value);
    res = await getMaterialUnit(groupCd.value);

    rowData.value = res.data.materialGroup;
    updateRow.value = JSON.parse(JSON.stringify(rowData.value));
    //comsole.log(res);
    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
  } finally {
    isNewColumn.value = true;
    clickrowData1.value = false;
    store.state.loading = false;
  }
};

/**
 *  저장 버튼 함수
 */

const saveButton = async () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 진행해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  const ulength =
    allstaterows.value.created.length +
    allstaterows.value.updated.length +
    allstaterows.value.deleted.length;

  if (ulength == 0) {
    Swal.fire({
      title: "경고",
      text: "변경된 사항이 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  const validateRow = updateRow.value.filter(
    (item, index) =>
      allstaterows.value.created.includes(index) &&
      (item.lngUnitID == "" || item.lngUnitID == undefined)
  ).length;
  if (validateRow > 0) {
    Swal.fire({
      title: "경고",
      text: "미입력된 필수값이 존재합니다. 확인해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  const validateRow2 =
    new Set(updateRow.value.map((item) => item.lngUnitID)).size ==
    updateRow.value.map((item) => item.lngUnitID).length;

  if (validateRow2 == false) {
    Swal.fire({
      title: "경고",
      text: "중복된 자재단위코드가 존재합니다. 확인해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  Swal.fire({
    title: "저장",
    text: "저장 하시겠습니까?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "저장",
    cancelButtonText: "취소",
  }).then(async (result) => {
    if (result.isConfirmed) {
      store.state.loading = true;
      try {
        /**
         * 페이지 매장 그룹 세팅
         */
        const lngUnitID = updateRow.value
          .filter((item, index) => !allstaterows.value.deleted.includes(index))
          .map((item) => item.lngUnitID);
        const strUnitName = updateRow.value
          .filter((item, index) => !allstaterows.value.deleted.includes(index))
          .map((item) => item.strUnitName);
        const groupCds = updateRow.value
          .filter((item, index) => !allstaterows.value.deleted.includes(index))
          .map(() => groupCd.value);
        const dlngUnitID = updateRow.value
          .filter((item, index) => allstaterows.value.deleted.includes(index))
          .map((item) => item.lngUnitID);

        const res = await saveMaterialUnit(
          groupCd.value,
          lngUnitID.join(","),
          strUnitName.join(","),
          groupCds.join(","),
          dlngUnitID.join(",")
        );
        ////console.log(res);

        Swal.fire({
          title: "저장 되었습니다.",
          confirmButtonText: "확인",
        });
        store.state.loading = false;
      } catch (error) {
        Swal.fire({
          title: "저장이 실패되었습니다.",
          confirmButtonText: "확인",
        });
      } finally {
        store.state.loading = false;
        searchButton();
      }
    }
  });
};
</script>

<style scoped></style>
