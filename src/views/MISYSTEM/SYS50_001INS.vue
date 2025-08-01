<!-- /*--############################################################################
# Filename : SYS50_001INS.vue                                                  
# Description : 마스터관리 > 프로그램 관리 > 프로그램 보안 그룹 등록.                              
# Date :2025-08-01                                                            
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
    <div
      class="grid grid-cols-3 grid-rows-1 justify-between bg-gray-200 rounded-lg h-14 items-start z-10">
      <div class="flex items-center justify-start mt-2">
        <PickGroup
          :initGroup="true"
          @GroupNm="GroupNm"
          @update:storeGroup="setStoreGroup"></PickGroup>
      </div>
      <div class="flex items-center justify-center mt-3">
        <div class="font-semibold text-base">보안분류</div>
        <div class="flex items-center justify-center ml-2 space-x-2">
          <input type="text" class="h-8" v-model="cond" />
          <input type="text" class="h-8" v-model="cond2" />
        </div>
      </div>
    </div>
    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="w-full h-[80%] grid grid-rows-1 grid-cols-[7fr,5fr] mt-2">
      <div class="flex flex-col">
        <div class="flex justify-start items-center text-xl font-semibold ml-2">
          보안 그룹 정보
        </div>
        <Realgrid
          :progname="'SYS50_001INS_VUE'"
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
          :addrowProp="'lngStoreGroup,checkbox,strStoreGroup,lngUserAdminID,strUserAdminID'"
          :addrowDefault="addrowDefault"
          :documentTitle="'SYS50_001INS'"
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
      </div>
      <div class="w-[70%] h-[15vh] ml-10">
        <div class="flex flex-col h-full w-full">
          <div
            class="flex justify-start items-center text-xl font-semibold ml-2">
            상세 정보
          </div>
          <div
            class="grid grid-rows-3 grid-cols-[1fr,3fr] border w-full h-full border-black">
            <div
              class="border border-black flex justify-center items-center bg-gray-100">
              매장그룹
            </div>
            <div
              class="border border-black flex justify-start items-center space-x-2 pl-2">
              <input
                type="number"
                v-model="gridvalue1"
                class="bg-gray-100 h-6 disabled:bg-gray-300 w-[40%] border border-black"
                disabled />
              <input
                type="text"
                v-model="gridvalue2"
                class="bg-gray-100 h-6 disabled:bg-gray-300 w-[60%] border border-black"
                disabled />
            </div>
            <div
              class="border border-black flex justify-center items-center bg-gray-100">
              보안분류코드
            </div>
            <div
              class="border border-black flex justify-start items-center pl-2">
              <input
                type="number"
                name="lngUserAdminID"
                @input="changeValue"
                :disabled="disablegrid"
                v-model="gridvalue3"
                class="border border-black flex justify-start items-center h-6 disabled:bg-gray-300" />
            </div>
            <div
              class="border border-black flex justify-center items-center bg-gray-100">
              보안분류명
            </div>
            <div
              class="border border-black flex justify-start items-center space-x-5 pl-2">
              <input
                type="text"
                name="strUserAdminID"
                @input="changeValue"
                v-model="gridvalue4"
                class="border border-black flex justify-center items-center" />
            </div>
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
import PickGroup from "@/components/pickGroup.vue";
import PickStore from "@/components/pickStore.vue";
import {
  deleteSecureGroup,
  getProgSecureGroup,
  saveProgSecureGroup,
} from "@/api/system";
/**
 * 	화면 Load시 실행 스크립트
 */

const optionList3 = ref([]);

const gridvalue1 = ref("");
const gridvalue2 = ref("");
const gridvalue3 = ref("");
const gridvalue4 = ref("");

const cond = ref("");
const cond2 = ref("");
onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  //reload.value = !reload.value;
  searchButton();
});

const selectedGroup = ref("");
const selectedGroupNm = ref("");
const setStoreGroup = (e) => {
  //console.log(e);
  selectedGroup.value = e;
};

const GroupNm = (e) => {
  selectedGroupNm.value = e;
};
const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

const store = useStore();

const clickedRowData = (e) => {
  //disablegrid.value = true;
  //insertupdatedelete.value = 2;
  // console.log(e);
  gridvalue1.value = e[0];
  gridvalue2.value = e[2];
  gridvalue3.value = e[3];
  gridvalue4.value = e[4];
};

const updateStateRow = ref([]);
const allStateRows = (e) => {
  updateStateRow.value = e;
};
const sendRowState = (e) => {
  //console.log(e);
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
    //reload.value = !reload.value;
    let cond3 = 0;
    if (cond.value == "" || cond.value == undefined) {
      cond3 = 0;
    } else {
      cond3 = cond.value;
    }
    const res = await getProgSecureGroup(
      store.state.userData.lngStoreGroup,
      cond3,
      cond2.value
    );
    console.log(res);
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
  //console.log(today);
  addrowDefault.value =
    selectedGroup.value + ",false, " + selectedGroupNm.value + ", , ,";

  //console.log(addrowDefault.value);
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
  const hashstate = new Set(updateRow.value.map((item) => item.lngUserAdminID));
  const size = updateRow.value.length;
  const setsize = hashstate.size;
  if (size != setsize) {
    Swal.fire({
      title: "경고",
      text: "중복된 보안분류코드가 존재합니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  try {
    store.state.loading = true;

    const groups = updateRow.value
      .filter((item, index) => updateStateRow.value.created.includes(index))
      .map((item) => item.lngStoreGroup)
      .join("\u200b");
    const lnguseradminids = updateRow.value
      .filter((item, index) => updateStateRow.value.created.includes(index))
      .map((item) => item.lngUserAdminID)
      .join("\u200b");
    const struseradminid = updateRow.value
      .filter((item, index) => updateStateRow.value.created.includes(index))
      .map((item) => item.strUserAdminID)
      .join("\u200b");

    const groups2 = updateRow.value
      .filter((item, index) => updateStateRow.value.updated.includes(index))
      .map((item) => item.lngStoreGroup)
      .join("\u200b");
    const lnguseradminids2 = updateRow.value
      .filter((item, index) => updateStateRow.value.updated.includes(index))
      .map((item) => item.lngUserAdminID)
      .join("\u200b");
    const struseradminid2 = updateRow.value
      .filter((item, index) => updateStateRow.value.updated.includes(index))
      .map((item) => item.strUserAdminID)
      .join("\u200b");

    const res = await saveProgSecureGroup(
      groups,
      lnguseradminids,
      struseradminid,
      groups2,
      lnguseradminids2,
      struseradminid2
    );

    console.log(res);

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

    const groups = updateRow.value
      .filter((item) => item.checkbox == true)
      .map((item) => item.lngStoreGroup)
      .join("\u200b");
    const lngCode = updateRow.value
      .filter((item) => item.checkbox == true)
      .map((item) => item.lngUserAdminID)
      .join("\u200b");

    const res = await deleteSecureGroup(groups, lngCode);

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

  cond.value = "";
  cond2.value = "";
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
  documentSubTitle.value +=
    "매장그룹 : " +
    selectedGroupNm.value +
    "\n" +
    "보안분류 : " +
    cond.value +
    "," +
    cond2.value;
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
