<!-- /*--############################################################################
# Filename : SYS50_002INS.vue                                                  
# Description : 마스터관리 > 프로그램 관리 > 프로그램 보안 권한 설정.                              
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

        <button @click="saveButton" class="button save md:w-auto w-14">
          저장
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
          <select name="" id="" class="w-32 h-8" v-model="cond">
            <option :value="i.lngUserAdminID" v-for="i in optionList">
              {{ i.strName }}
            </option>
          </select>
        </div>
      </div>
    </div>
    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="w-full h-[80%] mt-2">
      <div class="flex flex-col w-full h-full">
        <div class="flex justify-start items-center text-xl font-semibold ml-2">
          보안 권한 정보
        </div>
        <Realgrid
          :progname="'SYS50_002INS_VUE'"
          :progid="1"
          :rowData="rowData"
          :reload="reload"
          :checkRowAuto="false"
          :checkRenderEditable="true"
          :headerCheckBar="'checkbox'"
          :setRowGroupSpan2="'strMajor,strSub'"
          :mergeMask="'strMajor'"
          @allStateRows="allStateRows"
          @sendRowState="sendRowState"
          @selectedIndex="selectedIndex"
          @updatedRowData="updatedRowData"
          @checkedRowData="checkedRowData"
          :documentTitle="'SYS50_002INS'"
          :dynamicRowHeight="true"
          :documentSubTitle="documentSubTitle"
          :rowStateeditable="false"
          :exporttoExcel="exportExcel">
        </Realgrid>
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

import {
  deleteSecureGroup,
  getProgAuthGroup,
  getSecureList,
  saveProgPriv,
  saveProgSecureGroup,
} from "@/api/system";
import PickGroup from "@/components/pickGroup.vue";
import { useStore } from "vuex";
/**
 * 	화면 Load시 실행 스크립트
 */

const optionList = ref([]);

const gridvalue1 = ref("");
const gridvalue2 = ref("");
const gridvalue3 = ref("");
const gridvalue4 = ref("");

const cond = ref("0");
const cond2 = ref("");
onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  //reload.value = !reload.value;
  //console.log(store.state.userData);
  const res = await getSecureList(store.state.userData.lngStoreGroup);
  //console.log(res);
  optionList.value = res.data.List;

  cond.value = optionList.value[0].lngUserAdminID;
  // console.log(cond.value);
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

    const res = await getProgAuthGroup(
      store.state.userData.lngStoreGroup,
      cond.value,
      "01"
    );
    // console.log(res);
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

  try {
    store.state.loading = true;

    const groups = updateRow.value
      .filter(
        (item, index) =>
          updateStateRow.value.created.includes(index) ||
          updateStateRow.value.updated.includes(index)
      )
      .map((item) => item.lngStoreGroup)
      .join("\u200b");
    const progids = updateRow.value
      .filter(
        (item, index) =>
          updateStateRow.value.created.includes(index) ||
          updateStateRow.value.updated.includes(index)
      )
      .map((item) => item.lngProgramID)
      .join("\u200b");
    const progmajor = updateRow.value
      .filter(
        (item, index) =>
          updateStateRow.value.created.includes(index) ||
          updateStateRow.value.updated.includes(index)
      )
      .map((item) => item.lngProgramMajor)
      .join("\u200b");

    const progsub = updateRow.value
      .filter(
        (item, index) =>
          updateStateRow.value.created.includes(index) ||
          updateStateRow.value.updated.includes(index)
      )
      .map((item) => item.lngProgramSub)
      .join("\u200b");

    const useradminids = updateRow.value
      .filter(
        (item, index) =>
          updateStateRow.value.created.includes(index) ||
          updateStateRow.value.updated.includes(index)
      )
      .map((item) => item.lngUserAdminID)
      .join("\u200b");

    const checkboxs = updateRow.value
      .filter(
        (item, index) =>
          updateStateRow.value.created.includes(index) ||
          updateStateRow.value.updated.includes(index)
      )
      .map((item) => (item.checkbox == true ? 1 : 0))
      .join("\u200b");

    const res = await saveProgPriv(
      groups,
      progids,
      progmajor,
      progsub,
      useradminids,
      checkboxs
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

  //cond.value = "";
  cond2.value = "";
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
    optionList.value.filter((item) => item.lngUserAdminID)[0].strName;

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

const checkedRowData = (e) => {
  console.log(e);
};
</script>
