<!-- /*--############################################################################
# Filename : MST04_014INS.vue                                                  
# Description : 마스터관리 > 자재마스터 > 손실 유형 등록.                          
# Date :2025-08-19                                                             
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <!-- 조회조건 -->
  <div class="h-full" @click="handleParentClick">
    <div class="flex justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center mr-9 space-x-2 pr-5">
        <button @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <button @click="addButton" class="button new md:w-auto w-14">
          신규
        </button>
        <button @click="saveButton" class="button save md:w-auto w-14">
          저장
        </button>
        <!-- <button @click="deleteButton" class="button delete md:w-auto w-14">
          삭제
        </button> -->
        <button @click="excelButton" class="button save w-auto excel">
          엑셀
        </button>
      </div>
    </div>

    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="w-full h-[80%] grid grid-rows-1 grid-cols-[7fr,5fr] mt-5">
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
        :dynamicRowHeight="true"
        :documentSubTitle="documentSubTitle"
        :rowStateeditable="false"
        :checkRenderEditable="true"
        :exporttoExcel="exportExcel">
      </Realgrid>
      <div class="w-[70%] h-[20vh] ml-10">
        <div>
          ※손실분류가 '메뉴'일 경우 '4'로 시작하는 4자리 코드를 생성해야합니다.
        </div>
        <div
          class="grid grid-rows-4 grid-cols-[1fr,3fr] border w-full h-full border-black">
          <div
            class="border border-black flex justify-center items-center bg-orange-100">
            손실분류
            <span class="text-red-400 flex justify-center items-center">*</span>
          </div>
          <div class="border border-black flex justify-center items-center">
            <select
              name="strItemType"
              id=""
              class="w-64 border border-black"
              v-model="gridvalue1"
              @change="changeValue">
              <option :value="i.strDCode" v-for="i in optionList">
                {{ i.strDName }}
              </option>
            </select>
          </div>
          <div
            class="border border-black flex justify-center items-center bg-orange-100">
            손실코드
            <span class="text-red-400 flex justify-center items-center">*</span>
          </div>
          <div class="border border-black flex justify-center items-center">
            <input
              type="text"
              name="lngLossCode"
              :disabled="disabled"
              @input="changeValue"
              v-model="gridvalue2"
              class="w-[70%] h-[70%] border border-black pl-1 disabled:bg-gray-300" />
          </div>

          <div class="border border-black flex justify-center items-center">
            손실명
          </div>
          <div class="border border-black flex justify-center items-center">
            <input
              type="text"
              name="strLossName"
              class="w-[70%] h-[70%] border border-black pl-1 disabled:bg-white"
              v-model="gridvalue3"
              @input="changeValue" />
          </div>
          <div class="border border-black flex justify-center items-center">
            사용구분
          </div>
          <div class="border border-black flex justify-center items-center">
            <select
              name="strUseFlag"
              id=""
              class="w-64 border border-black"
              v-model="gridvalue4"
              @change="changeValue">
              <option :value="i.strDCode" v-for="i in optionList2">
                {{ i.strDName }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import "vue3-timepicker/dist/VueTimepicker.css";
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

const optionList3 = ref([]);
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
  //console.log(res.data.List);
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
  console.log(e);
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
  //console.log(e);
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
    //console.log(res);
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
  // //console.log(updateStateRow.value);
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

    //console.log(res);
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

    //console.log(res);
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
  // //console.log(updateStateRow.value);
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

    //console.log(res);
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

    //console.log(res);
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
