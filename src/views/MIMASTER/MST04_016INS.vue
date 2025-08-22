<!-- /*--############################################################################
# Filename : MST04_016INS.vue                                                  
# Description : 마스터관리 > 자재 마스터 > 청구 사용 자재 등록                        
# Date :2025-08-22                                                             
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
        <button @click="excelButton" class="button excel">엑셀</button>
        <button @click="copyButton" class="button copy">복사</button>
      </div>
    </div>
    <div
      class="flex justify-start space-x-5 bg-gray-200 rounded-lg h-16 items-center mt-3">
      <PickType2 @SubLease="SubLease" @SubLeaseName="SubLeaseName"></PickType2>
    </div>

    <!-- 조회 조건 -->
    <!-- 그리드 영역 -->
    <div class="h-[65vh] w-full justify-center mt-2">
      <Realgrid
        :progname="'MST04_016INS_VUE'"
        :progid="1"
        :rowData="rowData"
        @clickedRowData="clickedRowData"
        @selectedIndex="selectedIndex"
        @selcetedrowData="selcetedrowData"
        @updatedRowData="updatedRowData"
        @allStateRows="allStateRows"
        :selectionStyle="'block'"
        :rowStateeditable="false"
        :checkRenderEditable="true"
        :documentTitle="'MST04_016INS'"
        :documentSubTitle="documentSubTitle"
        :exporttoExcel="exporttoExcel"
        :ExcelNm="'결제그룹등록'"></Realgrid>

      <!-- 그리드 영역 -->
      <!-- 연동 데이터 영역 -->
    </div>
  </div>
  <!-- 연동 데이터 영역 -->
  <DupliStocks v-if="openCopy" @close="close"></DupliStocks>
</template>

<script setup>
import { getStockDemandList, saveStockDemandList } from "@/api/master";
import DupliStocks from "@/components/dupliStocks.vue";
/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";

/**
 *  페이지명 매장 그룹 호출 컴포넌트
 *  */

import PickType2 from "@/components/pickType2.vue";

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

const selectedSubLease = ref("");
const SubLease = (e) => {
  selectedSubLease.value = e;
  console.log(e);

  if (rowData.value.length > 0) {
    rowData.value = [];
  }
};
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

const allstaterows = ref([]);
const allStateRows = (e) => {
  console.log(e);
  allstaterows.value = e.updated;
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
const documentSubTitle = ref("");
const store = useStore();

const lngStoreType = (e) => {
  console.log(e);
};
/**
 * 엑셀 내보내기 함수
 */
const SubLeaseName = (e) => {
  documentSubTitle.value = "매장 유형 :" + e;
};
const excelButton = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "조회를 먼저 해주세요.",
      confirmButtonText: "확인",
    });
    return;
  }
  // documentSubTitle.value =
  exporttoExcel.value = !exporttoExcel.value;
};
/**
 *  조회 함수
 */

const searchButton = async () => {
  try {
    store.state.loading = true;
    rowData.value = [];

    //comsole.log(groupCd.value);
    const res = await getStockDemandList(
      store.state.userData.lngStoreGroup,
      selectedSubLease.value
    );

    rowData.value = res.data.List;
    updateRow.value = JSON.parse(JSON.stringify(rowData.value));
    console.log(res);
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
  console.log(updateRow.value);
  if (allstaterows.value.length == 0) {
    Swal.fire({
      title: "경고",
      text: "변경된 사항이 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  //console.log(updateRow.value);
  await Swal.fire({
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
        const lngStockids = updateRow.value
          .filter((item) => item.blnValid == "1")
          .map((item) => item.lngStockID)
          .join("\u200b");
        /**
         * 페이지 매장 그룹 세팅
         */

        const res = await saveStockDemandList(
          store.state.userData.lngStoreGroup,
          selectedSubLease.value,
          lngStockids
        );
        console.log(res);

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

const openCopy = ref(false);
const copyButton = (e) => {
  openCopy.value = true;
};

const close = (e) => {
  openCopy.value = e;
};
</script>

<style scoped></style>
