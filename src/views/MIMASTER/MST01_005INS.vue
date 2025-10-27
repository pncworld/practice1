<!-- /*--############################################################################
# Filename : MST01_005INS.vue                                                  
# Description : 마스터관리 > 매장 마스터 > S/C 팀등록.                              
# Date :2025-07-21                                                             
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
        <button @click="deleteButton" class="button delete md:w-auto w-14">
          삭제
        </button>
        <button @click="excelButton" class="button save w-auto excel">
          엑셀
        </button>
      </div>
    </div>

    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="w-full h-[80%] grid grid-rows-1 grid-cols-[7fr,5fr] mt-5">
      <Realgrid
        :progname="'MST01_005INS_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :setStateBar="false"
        :checkRowAuto="false"
        :headerCheckBar="'checkbox2'"
        @clickedRowData="clickedRowData"
        @allStateRows="allStateRows"
        @sendRowState="sendRowState"
        @selectedIndex="selectedIndex"
        @updatedRowData="updatedRowData"
        :addRow4="addRow4"
        :addrowProp="'checkbox,lngTeamCode,strTeamName,lngInsertUser,dtmInDate,strChargerName'"
        :addrowDefault="addrowDefault"
        :documentTitle="'MST01_005INS'"
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
      <div class="w-[70%] h-[20vh] mt-0 ml-10">
        <div
          class="grid grid-rows-4 grid-cols-[1fr,3fr] border w-full h-full border-black">
          <div
            class="border border-black flex justify-center items-center bg-orange-100">
            S/C 팀 코드
            <span class="text-red-400 flex justify-center items-center">*</span>
          </div>
          <div class="border border-black flex justify-center items-center">
            <input
              type="number"
              :disabled="disablegrid && !clickedRow"
              name="lngTeamCode"
              v-model="gridvalue1"
              @input="changeValue"
              class="w-[70%] h-[70%] border border-black pl-1 disabled:bg-gray-300" />
          </div>
          <div
            class="border border-black flex justify-center items-center bg-orange-100">
            S/C 팀명
            <span class="text-red-400 flex justify-center items-center">*</span>
          </div>
          <div class="border border-black flex justify-center items-center">
            <input
              type="text"
              name="strTeamName"
              :disabled="!clickedRow"
              @input="changeValue"
              v-model="gridvalue2"
              class="w-[70%] h-[70%] border border-black pl-1 disabled:bg-gray-300" />
          </div>
          <div
            class="border border-black flex justify-center items-center bg-gray-100">
            등록자
          </div>
          <div
            class="border border-black flex justify-center items-center space-x-5">
            <input
              type="text"
              name="lngInsertUser"
              @input="changeValue"
              class="w-[70%] h-[70%] border border-black pl-1 disabled:bg-gray-300"
              disabled
              v-model="gridvalue3" />
          </div>
          <div
            class="border border-black flex justify-center items-center bg-gray-100">
            등록일자
          </div>
          <div class="border border-black flex justify-center items-center">
            <input
              type="text"
              name="dtmInDate"
              @input="changeValue"
              class="w-[70%] h-[70%] border border-black pl-1 disabled:bg-gray-300"
              disabled
              v-model="gridvalue4" />
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

import { formatLocalDate, insertPageLog } from "@/customFunc/customFunc";
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

import { deleteSCTeam, getSCTeamList, saveSCTeamList } from "@/api/master";
import { useStore } from "vuex";
/**
 * 	화면 Load시 실행 스크립트
 */

const optionList3 = ref([]);

const gridvalue1 = ref("");
const gridvalue2 = ref("");
const gridvalue3 = ref("");
const gridvalue4 = ref("");

const cond = ref(1);
onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  //reload.value = !reload.value;
  searchButton();
});

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

const store = useStore();

const clickedRow = ref(false);
const clickedRowData = (e) => {
  clickedRow.value = true;
  //disablegrid.value = true;
  //insertupdatedelete.value = 2;

  gridvalue1.value = e[1];
  gridvalue2.value = e[2];
  gridvalue3.value = e[3];
  gridvalue4.value = e[4];
};

const updateStateRow = ref([]);
const allStateRows = (e) => {
  updateStateRow.value = e;
};
const sendRowState = (e) => {
  ////console.log(e);
  if (e == "created") {
    disablegrid.value = false;
  } else {
    disablegrid.value = true;
  }
};

const changeRow = ref(0);
const selectedIndex = (e) => {
  changeRow.value = e;
};
const changeNow = ref(false);
const changeColid = ref("");
const changeValue2 = ref("");

const changeValue = (e) => {
  changeColid.value = e.target.name;
  changeValue2.value = e.target.value;

  changeNow.value = !changeNow.value;
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
    const res = await getSCTeamList(store.state.userData.lngStoreGroup);
    //console.log(res);
    rowData.value = res.data.List;

    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    //comsole.log(error);
  } finally {
    store.state.loading = false;
    clickedRow.value = false;
  }
};
const disablegrid = ref(true);
const addrowDefault = ref("");
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
  const today = formatLocalDate(new Date());
  ////console.log(today);
  addrowDefault.value =
    "0, , ," +
    store.state.userData.lngSequence +
    "," +
    today +
    "," +
    store.state.userData.lngSequence;

  ////console.log(addrowDefault.value);
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
  const hashstate = new Set(updateRow.value.map((item) => item.lngTeamCode));
  const size = updateRow.value.length;
  const setsize = hashstate.size;
  if (size != setsize) {
    Swal.fire({
      title: "경고",
      text: "중복된 S/C팀 코드가 존재합니다.",
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

    const teamcodes = updateRow.value
      .filter(
        (item, index) =>
          updateStateRow.value.created.includes(index) ||
          updateStateRow.value.updated.includes(index)
      )
      .map((item) => item.lngTeamCode)
      .join("\u200b");
    const teamNms = updateRow.value
      .filter(
        (item, index) =>
          updateStateRow.value.created.includes(index) ||
          updateStateRow.value.updated.includes(index)
      )
      .map((item) => item.strTeamName)
      .join("\u200b");
    const userids = updateRow.value
      .filter(
        (item, index) =>
          updateStateRow.value.created.includes(index) ||
          updateStateRow.value.updated.includes(index)
      )
      .map((item) => item.lngInsertUser)
      .join("\u200b");

    const userIP = userIp;

    const res = await saveSCTeamList(
      store.state.userData.lngStoreGroup,
      teamcodes,
      teamNms,
      userids,

      userIP
    );

    //console.log(res);

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

    const teamcodes = updateRow.value
      .filter((item) => item.checkbox == true)
      .map((item) => item.lngTeamCode)
      .join("\u200b");
    const userID = store.state.userData.lngSequence;
    const userIP = userIp;

    const res = await deleteSCTeam(
      store.state.userData.lngStoreGroup,
      teamcodes,

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

  gridvalue1.value = "";
  gridvalue2.value = "";
  gridvalue3.value = "";
  gridvalue4.value = "";
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
