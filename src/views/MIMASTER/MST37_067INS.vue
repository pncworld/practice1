<!-- /*--############################################################################
# Filename : MST37_067INS.vue                                                  
# Description : 마스터관리 > 메뉴 마스터 > 멀티단가 그룹 등록                      
# Date :2025-10-27                                                           
# Author : 권맑음                  
################################################################################*/ -->
<template>
  <!-- 조회 조건 -->
  <div class="h-[80%]">
    <div class="flex justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center mr-10 space-x-2 pr-5">
        <button @click="searchButton" class="button search">조회</button>
        <button @click="newButton" class="button new">신규</button>
        <button @click="editButton" class="button edit">수정</button>
        <button @click="deleteButton" class="button delete">삭제</button>
        <button @click="excelButton" class="button excel">엑셀</button>
      </div>
    </div>
    <div
      class="flex justify-start space-x-5 bg-gray-200 rounded-lg h-16 items-center mt-3">
      <div class="flex">
        <div class="ml-12 text-base font-semibold">멀티단가명</div>
        <div class="ml-5">
          <input type="text" class="pl-1 border border-black" v-model="cond" />
        </div>
      </div>
    </div>

    <!-- 조회 조건 -->
    <!-- 그리드 영역 -->
    <div
      class="grid grid-rows-1 grid-cols-2 h-[65vh] w-full justify-center mt-2">
      <div class="w-[110%] ml-5 h-[65vh]">
        <Realgrid
          :progname="'MST37_067INS_VUE'"
          :progid="1"
          :rowData="rowData"
          @clickedRowData="clickedRowData"
          @dblclickedRowData="dblclickedRowData"
          :setStateBar="false"
          :rowStateeditable="false"
          :documentTitle="'MST37_067INS'"
          :documentSubTitle="documentSubTitle"
          :exporttoExcel="exporttoExcel"
          :ExcelNm="'자재 그룹 등록'"></Realgrid>
      </div>
    </div>

    <div
      v-if="openPop"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <!-- 팝업 내용 -->
      <div class="bg-white p-6 rounded shadow-lg w-72 h-64 relative">
        <div class="flex justify-between">
          <h2 class="text-lg font-bold mb-4">멀티단가 그룹등록</h2>
          <!-- 닫기 버튼 -->
          <div class="flex justify-end space-x-2">
            <button
              class="text-black hover:text-gray-700 bg-blue-500 h-8 w-8 rounded-lg"
              @click="saveButton">
              저장
            </button>
            <button
              class="text-white hover:text-gray-700 bg-gray-500 h-8 w-8 rounded-lg"
              @click="openPop = false">
              닫기
            </button>
          </div>
        </div>
        <div class="grid grid-rows-2 grid-cols-[1fr,2fr] h-20">
          <div
            class="font-semibold bg-gray-200 border-l border-t border-black items-center justify-center flex">
            멀티단가명
          </div>
          <div
            class="font-semibold border-l border-t border-black border-r flex justify-center items-center">
            <input
              type="text"
              class="border border-black w-[80%] h-[80%]"
              v-model="scond" />
          </div>
          <div
            class="font-semibold bg-gray-200 border-l border-t border-b border-black items-center justify-center flex">
            정렬순서
          </div>
          <div
            class="font-semibold border-l border-t border-b border-black border-r flex justify-center items-center">
            <input
              type="text"
              class="border border-black w-[80%] h-[80%]"
              @input="onlyNumber"
              v-model="scond2" />
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- 연동 데이터 영역 -->
</template>

<script setup>
import {
  deleteMultiPriceGroup,
  getMultiGroup2,
  saveMaterialGroup,
  saveMultiPrice,
  saveMultiPriceGroup,
} from "@/api/master";
/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";

/**
 *  페이지명 매장 그룹 호출 컴포넌트
 *  */

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

const disableCd = ref(false);
/**
 * 데이터셋 상세정보 셋팅
 */

const clickedRowData = (newValue) => {
  afterClick.value = true;
  tempMultiCode.value = newValue[1];
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
    changeColid.value = "lngStockGroupID";
    changeValue2.value = rowValue;
  } else if (rowName == "gridvalue2") {
    changeColid.value = "strStockGroupName";
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

const cond = ref("");
const excelButton = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "조회를 먼저 해주세요.",
      confirmButtonText: "확인",
    });
    return;
  }
  documentSubTitle.value = "멀티단가명 : " + cond.value;
  exporttoExcel.value = !exporttoExcel.value;
};
/**
 *  조회 함수
 */

const newOrEdit = ref(false);
const searchButton = async () => {
  store.state.loading = true;
  try {
    rowData.value = [];
    gridvalue1.value = "";
    gridvalue2.value = "";

    let res;
    //comsole.log(groupCd.value);
    res = await getMultiGroup2(store.state.userData.lngStoreGroup, cond.value);
    console.log(res);
    rowData.value = res.data.List;
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

  if (scond.value == "") {
    Swal.fire({
      title: "경고",
      text: "멀티단가명을 입력해주세요.",
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
      let res = "";
      try {
        /**
         * 페이지 매장 그룹 세팅
         */

        if (newOrEdit.value == true) {
          res = await saveMultiPriceGroup(
            store.state.userData.lngStoreGroup,
            0,
            scond.value,
            scond2.value
          );
          console.log(res);

          if (res.data.RESULT_CD == "00") {
            Swal.fire({
              title: "성공",
              text: "설정하신 멀티그룹을 등록하였습니다.",
              icon: "success",
              confirmButtonText: "확인",
            });
          } else {
            Swal.fire({
              title: "실패",
              text: "설정하신 멀티그룹 등록에 실패하였습니다.",
              icon: "error",
              confirmButtonText: "확인",
            });
          }
        } else {
          res = await saveMultiPriceGroup(
            store.state.userData.lngStoreGroup,
            tempMultiCode.value,
            scond.value,
            scond2.value
          );
          console.log(res);

          if (res.data.RESULT_CD == "00") {
            Swal.fire({
              title: "성공",
              text: "설정하신 멀티그룹을 등록하였습니다.",
              icon: "success",
              confirmButtonText: "확인",
            });
          } else {
            Swal.fire({
              title: "실패",
              text: "설정하신 멀티그룹 등록에 실패하였습니다.",
              icon: "error",
              confirmButtonText: "확인",
            });
          }
        }

        store.state.loading = false;
      } catch (error) {
      } finally {
        openPop.value = false;
        store.state.loading = false;
        searchButton();
      }
    }
  });
};

const openPop = ref(false);
const afterClick = ref(false);
const tempMultiCode = ref("");
const newButton = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 진행해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  newOrEdit.value = true;
  openPop.value = true;
};
const editButton = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 진행해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  if (afterClick.value == false) {
    Swal.fire({
      title: "경고",
      text: "수정하실 데이터를 클릭해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  newOrEdit.value = false;
  openPop.value = true;
};

const dblclickedRowData = (newValue) => {
  afterClick.value = true;
  tempMultiCode.value = newValue[1];

  newOrEdit.value = false;
  openPop.value = true;
};

const scond = ref("");
const scond2 = ref("0");
const onlyNumber = (e) => {
  scond2.value = e.target.value.replace(/[^0-9]/g, "");
};

const deleteButton = async () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "조회를 먼저 해주세요.",
      confirmButtonText: "확인",
    });
    return;
  }

  if (afterClick.value == false) {
    Swal.fire({
      title: "경고",
      text: "삭제하실 멀티단가 그룹을 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  try {
    const res = await deleteMultiPriceGroup(
      store.state.userData.lngStoreGroup,
      tempMultiCode.value
    );
    console.log(res);
    if (res.data.ERROR_CD == "0000") {
      Swal.fire({
        title: "성공",
        text: "선택하신 멀티그룹을 삭제하였습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
    } else {
      Swal.fire({
        title: "실패",
        text: "이미 사용중인 멀티단가그룹은 삭제할 수 없습니다.",
        icon: "error",
        confirmButtonText: "확인",
      });
    }
  } catch (error) {
  } finally {
    searchButton();
  }
};
</script>

<style scoped></style>
