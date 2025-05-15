/*--############################################################################
# Filename : ATT01_002INS.vue                                                  
# Description : 마스터관리 > 사원 마스터 > 사원 등록.                          
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
      </div>
    </div>
    <div
      class="flex justify-start space-x-5 bg-gray-200 rounded-lg h-16 items-center mt-3">
      <PickStore
        @update:storeGroup="handleGroupCd"
        @update:storeCd="handleStoreCd"
        @update:ischanged="handleinitAll">
      </PickStore>
    </div>
    <!-- 조회 조건 -->
    <!-- 그리드 영역-->
    <span class="grid grid-rows-1 grid-cols-2 mt-5">
      <div class="ml-10 flex justify-start font-bold text-xl">사용자 정보</div>
      <div class="flex justify-between">
        <div class="flex justify-start font-bold text-xl">상세정보</div>
        <div class="mr-20">
          <button class="whitebutton" @click="addButton">추가</button
          ><button class="whitebutton" @click="deleteButton">삭제</button>
        </div>
      </div>
    </span>
    <div
      class="grid grid-rows-1 grid-cols-2 h-[60vh] w-full justify-center mt-2">
      <div class="w-[90%] ml-10 h-[60vh]">
        <Realgrid
          :progname="'ATT01_002INS_VUE'"
          :progid="1"
          :rowData="rowData"
          @clickedRowData="clickedRowData"
          @selcetedrowData="selcetedrowData"
          @updatedRowData="updatedRowData"
          :selectionStyle="'singleRow'"
          :labelingColumns="'blnExpireClass'"
          :valuesData="valuesData"
          :labelsData="labelsData"
          :addRow4="addRow"
          :deleteRow2="deleteRow"
          :addrowDefault="addrowDefault"
          :addrowProp="addrowProp"
          :changeNow="changeNow"
          :changeValue2="changeValue2"
          :changeColid="changeColid"
          :changeRow="changeRow"
          @selectedIndex="selectedIndex"
          :rowStateeditable="false"
          @sendRowState="sendRowState"
          :addField="'new'"></Realgrid>
      </div>
      <!-- 그리드 영역-->
      <!-- 연동 데이터 영역-->
      <div class="grid grid-cols-[1fr,6fr] grid-rows-4 w-[90%] mr-10 h-[18%]">
        <div
          class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100 text-blue-500 rounded-tl-lg">
          *사원코드
        </div>
        <div
          class="border flex h-7 items-center text-sm font-semibold justify-center rounded-tr-lg">
          <input
            type="number"
            class="border text-sm rounded-md w-full pl-2 h-7 disabled:bg-gray-200"
            v-model="empCode"
            name="empCode"
            @input="changeInfo"
            :disabled="isNewRow" />
        </div>
        <div
          class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100 text-blue-500">
          *사원이름
        </div>
        <div
          class="border flex h-7 items-center text-sm font-semibold justify-center">
          <input
            type="text"
            class="border text-sm rounded-md w-full pl-2 h-7"
            v-model="empName"
            name="empName"
            @input="changeInfo" />
        </div>
        <div
          class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100">
          재직구분
        </div>
        <div
          class="border flex h-7 items-center text-sm font-semibold justify-left pl-2 space-x-2">
          <div class="flex items-center space-x-4">
            <label for="empExpire0">
              <input
                type="radio"
                class="border text-sm rounded-md pl-2"
                v-model="empExpire"
                id="empExpire0"
                name="empExpire"
                value="0"
                @input="changeInfo" />
              재직
            </label>
          </div>
          <div class="flex items-center space-x-2">
            <label for="empExpire1">
              <input
                type="radio"
                class="border text-sm rounded-md pl-2"
                v-model="empExpire"
                id="empExpire1"
                name="empExpire"
                value="1"
                @input="changeInfo" />
              퇴직
            </label>
          </div>
          <div class="flex items-center space-x-2">
            <label for="empExpire2">
              <input
                type="radio"
                class="border text-sm rounded-md pl-2"
                v-model="empExpire"
                id="empExpire2"
                name="empExpire"
                value="2"
                @input="changeInfo" />
              휴직
            </label>
          </div>
        </div>
        <div
          class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100 rounded-bl-lg">
          비밀번호
        </div>
        <div
          class="border flex h-7 items-center text-sm font-semibold justify-center rounded-br-lg">
          <input
            type="text"
            class="border text-sm rounded-md w-full pl-2 h-7"
            v-model="password"
            name="password"
            @input="changeInfo" />
        </div>
      </div>
    </div>
  </div>
  <!-- 연동 데이터 영역-->
</template>

<script setup>
import { getChargerInfo, saveEMP } from "@/api/miattend";
/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
/**
 * 매장 공통 컴포넌트
 */

import PickStore from "@/components/pickStore.vue";

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
const storeCd = ref();
const afterSearch = ref(false);
const empCode = ref();
const empName = ref();
const empExpire = ref(0);
const password = ref();
const valuesData = ref([[0, 1, 2]]);
const labelsData = ref([["재직", "퇴직", "휴직"]]);
const isNewRow = ref(true);
/**
 * 추가 버튼 함수
 */

const addRow = ref(false);
const changeNow = ref(false);
const changeValue2 = ref();
const changeColid = ref();
const changeRow = ref();

const sendRowState = (e) => {
  if (e == "created") {
    isNewRow.value = false;
  } else {
    isNewRow.value = true;
  }
};
/**
 * 수정용 데이터 행 설정
 */

const selectedIndex = (newValue) => {
  changeRow.value = newValue;
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
  isNewRow.value = false;
  // const newCode =
  //   Math.max(0, ...updateRow.value.map((item) => item.lngChargerCode)) + 1;
  addrowDefault.value = "0";
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

/**
 * 데이터셋 상세정보 셋팅
 */

const clickedRowData = (newValue) => {
  //comsole.log(newValue);
  empCode.value = newValue[0];
  empName.value = newValue[1];
  empExpire.value = newValue[2];
  password.value = newValue[3];
};
/**
 * 페이지 매장 그룹 세팅
 */

const handleGroupCd = (newValue) => {
  groupCd.value = newValue;
};
/**
 * 페이지 매장 코드 세팅
 */

const handleStoreCd = (newValue) => {
  storeCd.value = newValue;
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

  if (rowName == "empCode") {
    changeValue2.value = rowValue;
    changeColid.value = "lngChargerCode";
  } else if (rowName == "empName") {
    changeValue2.value = rowValue;
    changeColid.value = "strChargerName";
  } else if (rowName == "empExpire") {
    changeValue2.value = rowValue;
    changeColid.value = "blnExpireClass";
  } else {
    changeValue2.value = rowValue;
    changeColid.value = "strPosMngNo";
  }
  changeNow.value = !changeNow.value;
};

const addrowDefault = ref("");
const addrowProp = ref("blnExpireClass");
const store = useStore();
/**
 *  조회 함수
 */

const searchButton = async () => {
  if (storeCd.value == "0" || storeCd.value == undefined) {
    Swal.fire({
      title: "경고",
      text: "매장을 선택하세요.",
      icon: "warning",
      showCancelButton: false,
      confirmButtonColor: "#3085d6",
      allowOutsideClick: false,
    });
    return;
  }

  store.state.loading = true;
  try {
    let res;
    //comsole.log(groupCd.value);
    //comsole.log(storeCd.value);
    res = await getChargerInfo(groupCd.value, storeCd.value);

    rowData.value = res.data.EMPCHARGER;
    updateRow.value = JSON.parse(JSON.stringify(rowData.value));
    //comsole.log(res);
    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
  } finally {
    store.state.loading = false;
    empCode.value = "";
    empName.value = "";
    password.value = "";
    empExpire.value = -1;
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
      item.deleted != true &&
      (item.strChargerName == "" || item.strChargerName == undefined)
  ).length;
  if (validateRow > 0) {
    Swal.fire({
      title: "경고",
      text: "사원이름이 미입력되었습니다. 확인해주세요.",
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
        //comsole.log(updateRow.value);

        const chargerCode = updateRow.value
          .filter((item) => item.deleted != true && item.new != true)
          .map((item) => item.lngChargerCode);
        const chargerName = updateRow.value
          .filter((item) => item.deleted != true && item.new != true)
          .map((item) => item.strChargerName);
        const chargerExpire = updateRow.value
          .filter((item) => item.deleted != true && item.new != true)
          .map((item) => item.blnExpireClass);
        const chargerMngNo = updateRow.value
          .filter((item) => item.deleted != true && item.new != true)
          .map((item) => item.strPosMngNo);

        const chargerCode2 = updateRow.value
          .filter((item) => item.deleted != true && item.new == true)
          .map((item) => item.lngChargerCode);
        const chargerName2 = updateRow.value
          .filter((item) => item.deleted != true && item.new == true)
          .map((item) => item.strChargerName);
        const chargerExpire2 = updateRow.value
          .filter((item) => item.deleted != true && item.new == true)
          .map((item) => item.blnExpireClass);
        const chargerMngNo2 = updateRow.value
          .filter((item) => item.deleted != true && item.new == true)
          .map((item) => item.strPosMngNo);

        const deleteCode = updateRow.value
          .filter((item) => item.deleted == true)
          .map((item) => item.lngChargerCode);
        const res = await saveEMP(
          groupCd.value,
          storeCd.value,
          chargerCode.join(","),
          chargerName.join(","),
          chargerExpire.join(","),
          chargerMngNo.join(","),
          chargerCode2.join(","),
          chargerName2.join(","),
          chargerExpire2.join(","),
          chargerMngNo2.join(","),
          deleteCode.join(",")
        );
        //comsole.log(res);
        Swal.fire({
          title: "저장 되었습니다.",
          confirmButtonText: "확인",
        });
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
