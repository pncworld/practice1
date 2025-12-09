<!-- /*--############################################################################
# Filename : MST44_065INS.vue                                                  
# Description : 마스터관리 > POS 마스터 > 고객화면구성관리                  
# Date :2025-10-29                                                             
# Author : 권맑음                     
################################################################################*/ -->
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
        :showPosNo="true"
        @update:storeCd="lngStoreCode"
        @posNo="posNo"
        @update:storeGroup="lngStoreGroup"
        @update:storeAreaCd="lngAreaCode"></PickStore>
    </div>
    <span class="grid grid-rows-1 grid-cols-2 mt-5">
      <div class="ml-10 flex justify-start font-bold text-xl">
        고객 화면 정보
      </div>
      <div class="flex justify-between ml-44">
        <div class="flex justify-start font-bold text-xl">상세정보</div>
        <div class="mr-20 space-x-2">
          <button class="whitebutton" @click="addButton">추가</button>
          <!-- <button class="whitebutton" @click="deleteButton">삭제</button> -->
        </div>
      </div>
    </span>
    <!-- 조회 조건 -->
    <!-- 그리드 영역 -->
    <div
      class="grid grid-rows-1 grid-cols-2 h-[65vh] w-full justify-center mt-2">
      <div class="w-[110%] ml-10 h-full">
        <Realgrid
          :progname="'MST44_065INS_VUE'"
          :progid="1"
          :rowData="rowData"
          @clickedRowData="clickedRowData"
          :labelingColumns="'lngOperType,lngDispType'"
          :valuesData="valuesData"
          :labelsData="labelsData"
          :changeNow="changeNow"
          :changeValue2="changeValue2"
          :changeColid="changeColid"
          :changeRow="changeRow"
          @sendRowState="sendRowState"
          @selectedIndex="selectedIndex"
          @updatedRowData="updatedRowData"
          @allStateRows="allStateRows"
          :selectionStyle="'singleRow'"
          :addRow4="addRow"
          :addrowDefault="addrowDefault"
          :addrowProp="addrowProp"
          :rowStateeditable="false"></Realgrid>
      </div>
      <!-- 그리드 영역 -->
      <!-- 연동 데이터 영역 -->
      <div class="grid grid-cols-[1fr,6fr] grid-rows-5 w-[70%] ml-44 h-[30%]">
        <div
          class="border flex h-full items-center text-sm font-semibold justify-center bg-gray-100 text-blue-500 rounded-tl-lg">
          *표시화면
        </div>
        <div
          class="border flex h-full items-center text-sm font-semibold justify-center rounded-tr-lg">
          <select
            name="gridvalue1"
            id=""
            class="border text-sm rounded-md w-full pl-2 h-full disabled:bg-gray-200"
            v-model="gridvalue1"
            :disabled="!afterClick || !isNew"
            @change="changeInfo">
            <option :value="i.strDCode" v-for="i in optionList">
              {{ i.strDName }}
            </option>
          </select>
        </div>
        <div
          class="border flex h-full items-center text-sm font-semibold justify-center bg-gray-100 text-blue-500">
          *순번
        </div>
        <div
          class="border flex h-full items-center text-sm font-semibold justify-center">
          <input
            type="text"
            class="border text-sm rounded-md w-full pl-2 h-full disabled:bg-gray-200"
            v-model="gridvalue2"
            name="gridvalue2"
            :disabled="!afterClick || !isNew"
            @input="changeInfo" />
        </div>
        <div
          class="border flex h-full items-center text-sm font-semibold justify-center bg-gray-100 text-blue-500">
          *파일유형
        </div>
        <div
          class="border flex h-full items-center text-sm font-semibold justify-center">
          <select
            name="gridvalue3"
            id=""
            class="border text-sm rounded-md w-full pl-2 h-full disabled:bg-gray-200"
            v-model="gridvalue3"
            :disabled="!afterClick"
            @change="changeInfo">
            <option :value="i.strDCode" v-for="i in optionList2">
              {{ i.strDName }}
            </option>
          </select>
        </div>

        <div
          class="border flex h-full items-center text-sm font-semibold justify-center bg-gray-100 text-blue-500">
          *표시시간(초)
        </div>
        <div
          class="border flex h-full items-center text-sm font-semibold justify-center">
          <input
            type="text"
            class="border text-sm rounded-md w-full pl-2 h-full disabled:bg-gray-200"
            :disabled="!afterClick"
            v-model="gridvalue4"
            name="gridvalue4"
            @input="changeInfo" />
        </div>

        <div
          class="border flex h-full items-center text-sm font-semibold justify-center bg-gray-100">
          파일명
        </div>
        <div
          class="border flex h-full items-center text-sm font-semibold justify-center">
          <input
            type="text"
            class="border text-sm rounded-md w-full pl-2 h-full disabled:bg-gray-200"
            :disabled="!afterClick"
            v-model="gridvalue5"
            name="gridvalue5"
            @input="changeInfo" />
        </div>
      </div>
    </div>
  </div>
  <!-- 연동 데이터 영역 -->
</template>

<script setup>
import { getCustomerControlDisp, saveCustDispInfo } from "@/api/master";
/**
 *  페이지명 매장 그룹 호출 컴포넌트
 *  */

/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
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

import { getCommonList } from "@/api/common";
import PickStore from "@/components/pickStore.vue";
import { useStore } from "vuex";

/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getCommonList(991);

  optionList.value = res.data.List;

  valuesData.value = [optionList.value.map((item) => item.strDCode)];
  labelsData.value = [optionList.value.map((item) => item.strDName)];

  const res2 = await getCommonList(992);

  optionList2.value = res2.data.List;

  valuesData.value.push(optionList2.value.map((item) => item.strDCode));
  labelsData.value.push(optionList2.value.map((item) => item.strDName));
});
const rowData = ref([]);
const groupCd = ref();
const storeCd = ref(0);
const afterSearch = ref(false);
const afterClick = ref(false);
const changedRows = ref([]);
/**
 * 상태 변화된 행 세팅
 */

const allStateRows = (e) => {
  changedRows.value = e;
  //comsole.log(changedRows.value);
};
const clickStoreCd = ref(0);
const clickStoreNm = ref();
const addNew = ref(true);
const valuesData = ref([]);
const labelsData = ref([]);
/**
 * 추가 버튼 함수
 */

const addRow = ref(false);
const changeNow = ref(false);
const changeValue2 = ref();
const changeColid = ref();
const changeRow = ref();
const gridvalue1 = ref(0);
const gridvalue2 = ref("");
const gridvalue3 = ref(0);
const gridvalue4 = ref("");
const gridvalue5 = ref("");

const optionList = ref([]);
const optionList2 = ref([]);

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

  addrowDefault.value =
    lngStoreGp.value +
    "," +
    lngStoreCd.value +
    "," +
    lngAreaCd.value +
    "," +
    posno.value;
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

const clickedRowData = (e) => {
  console.log(e);
  afterClick.value = true;

  gridvalue1.value = e[4];
  gridvalue2.value = e[5];
  gridvalue3.value = e[6];
  gridvalue4.value = e[7];
  gridvalue5.value = e[8];
};
/**
 * 페이지 매장 그룹 세팅
 */
const lngStoreCd = ref("");
const lngStoreCode = (e) => {
  lngStoreCd.value = e;
};
const posno = ref("");
const posNo = (e) => {
  posno.value = e;
};
const lngStoreGp = ref("");
const lngStoreGroup = (e) => {
  lngStoreGp.value = e;
};
const lngAreaCd = ref("");
const lngAreaCode = (e) => {
  lngAreaCd.value = e;
};

const updateRow = ref([]);
/**
 * 입력창 수정 데이터 갱신
 */

const updatedRowData = (newValue) => {
  updateRow.value = newValue;
  //console.log(newValue);
};

/**
 * INPUT , SELECT 수정 데이터 갱신
 */

const changeInfo = (e) => {
  const rowName = e.target.name;
  const rowValue = e.target.value;

  if (rowName == "gridvalue1") {
    changeColid.value = "lngOperType";
    changeValue2.value = rowValue;
  } else if (rowName == "gridvalue2") {
    gridvalue2.value = rowValue.replace(/[^0-9]/g, "");
    changeValue2.value = gridvalue2.value;
    changeColid.value = "lngSeq";
  } else if (rowName == "gridvalue3") {
    changeValue2.value = rowValue;
    changeColid.value = "lngDispType";
  } else if (rowName == "gridvalue4") {
    gridvalue4.value = rowValue.replace(/[^0-9]/g, "");
    changeValue2.value = gridvalue4.value;
    changeColid.value = "lngDispTime";
  } else {
    changeValue2.value = rowValue;
    changeColid.value = "strName";
  }
  changeNow.value = !changeNow.value;
};

const addrowDefault = ref("");
const exporttoExcel = ref(false);
const addrowProp = ref("lngStoreGroup,lngStoreCode,lngAreaCode,intPosNo");
const store = useStore();
/**
 * 엑셀 내보내기 함수
 */
const isNew = ref(true);

const sendRowState = (e) => {
  if (e == "created") {
    isNew.value = true;
  } else {
    isNew.value = false;
  }
};
/**
 *  조회 함수
 */

const searchButton = async () => {
  if (lngStoreCd.value == "0") {
    Swal.fire({
      title: "경고",
      text: "매장을 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (posno.value == "0") {
    Swal.fire({
      title: "경고",
      text: "포스를 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  try {
    store.state.loading = true;
    rowData.value = [];
    gridvalue1.value = "0";
    gridvalue2.value = "";
    gridvalue3.value = "0";
    gridvalue4.value = "";
    gridvalue5.value = "";
    let res;
    //comsole.log(groupCd.value);
    res = await getCustomerControlDisp(
      lngStoreGp.value,
      lngStoreCd.value,
      lngAreaCd.value,
      posno.value
    );

    rowData.value = res.data.List;
    updateRow.value = JSON.parse(JSON.stringify(rowData.value));
    //comsole.log(res);
    afterSearch.value = true;
    store.state.loading = false;
  } catch (error) {
    afterSearch.value = false;
    store.state.loading = false;
  } finally {
    store.state.loading = false;
    afterClick.value = false;
  }
};
const storeNm = (newValue) => {
  clickStoreNm.value = newValue;
};

/**
 *  저장 버튼 함수
 */

const saveButton = async () => {
  //comsole.log(updateRow.value);
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 진행해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  let b = changedRows.value.created.length;
  let c = changedRows.value.updated.length;
  if (b + c == 0) {
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
      item.lngOperType == "" ||
      item.lngOperType == undefined ||
      item.lngSeq == undefined ||
      item.lngSeq == "" ||
      item.lngDispType == undefined ||
      item.lngDispType == "" ||
      item.lngDispTime == undefined ||
      item.lngDispTime == ""
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
    new Set(updateRow.value.map((item) => item.lngSeq)).size ==
    updateRow.value.map((item) => item.lngSeq).length;

  if (validateRow2 == false) {
    Swal.fire({
      title: "경고",
      text: "중복된 순번이 존재합니다. 확인해주세요.",
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
        const storeGroup = updateRow.value
          .filter(
            (item, index) =>
              changedRows.value.updated.includes(index) ||
              changedRows.value.created.includes(index)
          )
          .map((item) => item.lngStoreGroup)
          .join("\u200b");

        const storeCd = updateRow.value
          .filter(
            (item, index) =>
              changedRows.value.updated.includes(index) ||
              changedRows.value.created.includes(index)
          )
          .map((item) => item.lngStoreCode)
          .join("\u200b");

        const areaCds = updateRow.value
          .filter(
            (item, index) =>
              changedRows.value.updated.includes(index) ||
              changedRows.value.created.includes(index)
          )
          .map((item) => item.lngAreaCode)
          .join("\u200b");

        const posNos = updateRow.value
          .filter(
            (item, index) =>
              changedRows.value.updated.includes(index) ||
              changedRows.value.created.includes(index)
          )
          .map((item) => item.intPosNo)
          .join("\u200b");

        const lngOperTypes = updateRow.value
          .filter(
            (item, index) =>
              changedRows.value.updated.includes(index) ||
              changedRows.value.created.includes(index)
          )
          .map((item) => item.lngOperType)
          .join("\u200b");

        const lngSeqs = updateRow.value
          .filter(
            (item, index) =>
              changedRows.value.updated.includes(index) ||
              changedRows.value.created.includes(index)
          )
          .map((item) => item.lngSeq)
          .join("\u200b");

        const lngDispTypes = updateRow.value
          .filter(
            (item, index) =>
              changedRows.value.updated.includes(index) ||
              changedRows.value.created.includes(index)
          )
          .map((item) => item.lngDispType)
          .join("\u200b");

        const lngDispTimes = updateRow.value
          .filter(
            (item, index) =>
              changedRows.value.updated.includes(index) ||
              changedRows.value.created.includes(index)
          )
          .map((item) => item.lngDispTime)
          .join("\u200b");

        const strNames = updateRow.value
          .filter(
            (item, index) =>
              changedRows.value.updated.includes(index) ||
              changedRows.value.created.includes(index)
          )
          .map((item) => item.strName)
          .join("\u200b");

        //   const strNames = updateRow.value
        //   .filter((item ,index) => changedRows.value.updated.includes(index) || changedRows.value.created.includes(index) )
        //   .map((item) => item.strName);

        const res = await saveCustDispInfo(
          storeGroup,
          storeCd,
          areaCds,
          posNos,
          lngOperTypes,
          lngSeqs,
          lngDispTypes,
          lngDispTimes,
          strNames
        );
        console.log(res);
        if (res.data.RESULT_CD == "00") {
          Swal.fire({
            title: "성공",
            text: "변경사항을 저장하였습니다.",
            icon: "success",
            confirmButtonText: "확인",
          });
        } else {
          Swal.fire({
            title: "실패",
            text: "변경사항 저장에 실패하였습니다.",
            icon: "error",
            confirmButtonText: "확인",
          });
        }
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
