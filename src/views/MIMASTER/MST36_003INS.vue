/*--############################################################################
# Filename : MST36_003INS.vue                                                  
# Description : 마스터관리 > 매장 마스터 > 결제그룹등록                        
# Date :2025-05-14                                                             
# Author : 권맑음                     
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
      <PickGroup @update:storeGroup="handleGroupCd"> </PickGroup>
    </div>
    <span class="grid grid-rows-1 grid-cols-2 mt-5">
      <div class="ml-10 flex justify-start font-bold text-xl">
        결제그룹 정보
      </div>
      <div class="flex justify-between ml-44">
        <div class="flex justify-start font-bold text-xl">상세정보</div>
        <div class="mr-20">
          <button class="whitebutton" @click="addButton">추가</button
          ><button class="whitebutton" @click="deleteButton">삭제</button>
        </div>
      </div>
    </span>
    <!-- 조회 조건 -->
    <!-- 그리드 영역 -->
    <div
      class="grid grid-rows-1 grid-cols-2 h-[65vh] w-full justify-center mt-2">
      <div class="w-[110%] ml-10 h-[65vh]">
        <Realgrid
          :progname="'MST36_003INS_VUE'"
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
          :deleteRow2="deleteRow"
          :addrowDefault="addrowDefault"
          :addrowProp="addrowProp"
          :rowStateeditable="false"
          :addField="'new'"
          :exporttoExcel="exporttoExcel"
          :ExcelNm="'결제그룹등록'"></Realgrid>
      </div>
      <!-- 그리드 영역 -->
      <!-- 연동 데이터 영역 -->
      <div class="grid grid-cols-[2fr,6fr] grid-rows-3 w-[70%] ml-44 h-[15%]">
        <div
          class="border flex h-full items-center text-sm font-semibold justify-center bg-gray-100 text-blue-500 rounded-tl-lg">
          *결제그룹코드
        </div>
        <div
          class="border flex h-full items-center text-sm font-semibold justify-center rounded-tr-lg">
          <input
            type="number"
            class="border text-sm rounded-md w-full pl-2 h-full disabled:bg-gray-200"
            v-model="gridvalue1"
            name="gridvalue1"
            @input="changeInfo"
            :disabled="addNew" />
        </div>
        <div
          class="border flex h-full items-center text-sm font-semibold justify-center bg-gray-100">
          결제그룹명
        </div>
        <div
          class="border flex h-full items-center text-sm font-semibold justify-center">
          <input
            type="text"
            class="border text-sm rounded-md w-full pl-2 h-full disabled:bg-gray-200"
            v-model="gridvalue2"
            name="gridvalue2"
            @input="changeInfo" />
        </div>
        <div
          class="border flex h-full items-center text-sm font-semibold justify-center bg-gray-100 rounded-bl-lg">
          비고
        </div>
        <div
          class="border flex h-full items-center text-sm font-semibold justify-center bg-gray-100 rounded-br-lg">
          <input
            type="text"
            class="h-full w-full rounded-lg pl-2"
            v-model="gridvalue3"
            name="gridvalue3"
            @input="changeInfo" />
        </div>
      </div>
    </div>
  </div>
  <!-- 연동 데이터 영역 -->
</template>

<script setup>
import { getAmountGroup, savePayGroup } from "@/api/master";
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

/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
});
const rowData = ref([]);
const groupCd = ref();
const storeCd = ref(0);
const afterSearch = ref(false);

const addNew = ref(true);

const addRow = ref(false);
const changeNow = ref(false);
const changeValue2 = ref();
const changeColid = ref();
const changeRow = ref();
const gridvalue1 = ref();
const gridvalue2 = ref();
const gridvalue3 = ref();
const gridvalue4 = ref(false);
const gridvalue5 = ref();

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
  deleteRow.value = !deleteRow.value;
};
const disableCd = ref(false);
/**
 * 데이터셋 상세정보 셋팅
 */

const clickedRowData = (newValue) => {
  gridvalue1.value = newValue[0];
  gridvalue2.value = newValue[1];
  gridvalue3.value = newValue[2];
  gridvalue4.value = newValue[3] == 1 ? true : false;
  //comsole.log(newValue);
  if (newValue[5] == true) {
    addNew.value = false;
  } else {
    addNew.value = true;
  }
};
/**
 * 페이지 매장 그룹 세팅
 */

const handleGroupCd = (newValue) => {
  groupCd.value = newValue;
  rowData.value = [];
  gridvalue1.value = "";
  gridvalue2.value = "";
  gridvalue3.value = "";
  gridvalue4.value = "";
  gridvalue5.value = "";
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
    changeColid.value = "lngGroupCode";
    changeValue2.value = rowValue;
  } else if (rowName == "gridvalue2") {
    changeValue2.value = rowValue;
    changeColid.value = "strGroupName";
  } else if (rowName == "gridvalue3") {
    changeValue2.value = rowValue;
    changeColid.value = "strRemark";
  }
  changeNow.value = !changeNow.value;
};

const addrowDefault = ref();
const exporttoExcel = ref(false);
const addrowProp = ref("lngStoreGroup");
const store = useStore();

/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "조회를 먼저 해주세요.",
      confirmButtonText: "확인",
    });
    return;
  }
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
    gridvalue3.value = "";

    let res;
    //comsole.log(groupCd.value);
    res = await getAmountGroup(groupCd.value);

    rowData.value = res.data.AMOUNTGROUP;
    updateRow.value = JSON.parse(JSON.stringify(rowData.value));
    //comsole.log(res);
    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
  } finally {
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
  if (JSON.stringify(updateRow.value) === JSON.stringify(rowData.value)) {
    Swal.fire({
      title: "경고",
      text: "변경된 사항이 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  const validateRow = updateRow.value.filter(
    (item) =>
      item.new == true &&
      (item.lngGroupCode == "" || item.lngGroupCode == undefined)
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
    new Set(updateRow.value.map((item) => item.lngGroupCode)).size ==
    updateRow.value.map((item) => item.lngGroupCode).length;

  if (validateRow2 == false) {
    Swal.fire({
      title: "경고",
      text: "중복된 계정코드가 존재합니다. 확인해주세요.",
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
        const lngGroupCode = updateRow.value
          .filter((item) => item.deleted !== true)
          .map((item) => item.lngGroupCode);
        /**
         * 페이지 매장 그룹 세팅
         */

        const lngStoreGroup = updateRow.value
          .filter((item) => item.deleted !== true)
          .map((item) => item.lngStoreGroup);
        const strGroupName = updateRow.value
          .filter((item) => item.deleted !== true)
          .map((item) => item.strGroupName);
        const strRemark = updateRow.value
          .filter((item) => item.deleted !== true)
          .map((item) => item.strRemark);

        const dlngGroupCode = updateRow.value
          .filter((item) => item.deleted == true)
          .map((item) => item.lngGroupCode);

        const res = await savePayGroup(
          groupCd.value,
          lngStoreGroup.join(","),
          lngGroupCode.join(","),
          strGroupName.join(","),
          strRemark.join(","),
          dlngGroupCode.join(",")
        );
        //comsole.log(res);

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
