<!-- /*--############################################################################
# Filename : MST45_031INS.vue                                                  
# Description : 마스터관리 > 자재 마스터Ⅱ > 매장별 발주파트 등록
# Date :2025-08-25                                                             
# Author : 권지안
################################################################################*/ -->
<template>
  <!-- 조회 조건 -->
  <div class="h-[80%]">
    <div class="flex justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
    </div>
    <!-- 조회 조건 -->
    <div class="flex gap-2">
      <div class="grid grid-cols-1 grid-rows-1 bg-gray-200 rounded-lg h-12 w-[50%] z-10 mt-2">
        <div class="flex items-center justify-between">
          <div class="ml-12">발주 파트 관리</div>
          <div class="flex gap-2 mr-12">
            <button class="whitebutton bg-white" @click="searchButton">조회</button>
            <button class="whitebutton bg-white" @click="saveButton">저장</button>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1 grid-rows-1 bg-gray-200 rounded-lg h-12 w-[50%] z-10 mt-2">
        <div class="flex items-center justify-between">
          <div class="ml-12">매장 선택</div>
          <div class="flex gap-2 mr-20">
            <input type="text" class="border rounded-md px-2 py-1 text-sm w-32 bg-white disabled:bg-white text-red-600 font-bold" v-model="gridvalue1" disabled/>
            <input type="text" class="border rounded-md px-2 py-1 text-sm w-48 bg-white disabled:bg-white text-red-600 font-bold" v-model="gridvalue2" disabled/>
          </div>
          <div class="flex gap-2 mr-12">
            <button class="whitebutton bg-white" @click="saveButton2">저장</button>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="mt-2 flex gap-2 justify-center mr-40">
      <button class="whitebutton" @click="addButton">신규</button>
      <button class="whitebutton" @click="deleteButton">삭제</button>
    </div> -->
    <div class="mt-2 flex w-full">
      <!-- 왼쪽 50% -->
      <div class="w-1/2 flex justify-end pr-4">
        <button class="whitebutton" @click="addButton">신규</button>
        <button class="whitebutton ml-2" @click="deleteButton">삭제</button>
      </div>
      <!-- 오른쪽 문구 -->
      <div class="w-1/2 flex justify-start pl-4">
        <div class="text-red-600 font-bold">
        ◎ 신규로 생성 된 매장이 있을 경우 발주 파트를 설정해 주셔야 발주가 가능합니다.
        </div>
      </div>
    </div>
    <!-- 그리드 영역 -->
    <div class="flex gap-2">
      <div class="h-[65vh] w-[50%] justify-center mt-2">
        <Realgrid
          :progname="'MST45_031INS_VUE'"
          :progid="1"
          :rowData="rowData"
          :addrowDefault="addrowDefault"
          :addRow4="addRow"
          :addrowProp="addrowProp"
          @clickedRowData="clickedRowData"
          @selectedIndex="selectedIndex"
          @selcetedrowData="selcetedrowData"
          @updatedRowData="updatedRowData"
          @allStateRows="allStateRows"
          :deleteRow6="deleteRow"
          :selectionStyle="'singleRow'"
          @sendRowState="sendRowState"
          :rowStateeditable="false"
          :checkRenderEditable="true"
          :documentTitle="'MST45_031INS'"
          :documentSubTitle="documentSubTitle"
          :editableColId="['strPartName']"
          @checkedRowData="checkedRowData">
        </Realgrid>
      </div>
      <div class="h-[65vh] w-[50%] justify-center mt-2">
        <Realgrid
          :progname="'MST45_031INS_VUE'"
          :progid="2"
          :rowData="rowData2"
          @clickedRowData="clickedRowData2"
          @selectedIndex="selectedIndex"
          @selcetedrowData="selcetedrowData"
          @updatedRowData="updatedRowData2"
          @allStateRows="allStateRows2"
          :selectionStyle="'singleRow'"
          :rowStateeditable="false"
          :checkRenderEditable="true"
          :documentTitle="'MST45_031INS'"
          :documentSubTitle="documentSubTitle">
        </Realgrid>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getStockPartInfo, getStockStoreInfo, saveStockPartInfo, saveStockStoreInfo } from "@/api/master";
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

import { useStore } from "vuex";

/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
});
const rowData = ref([]);
const rowData2 = ref([]);
const afterSearch = ref(false);

const addNew = ref(true);
const addRow = ref(false);
const addrowProp = ref("lngStoreGroup");
const addrowDefault = ref('');

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
  // console.log(afterSearch.value);
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

const currentRowState = ref('')
const sendRowState = (e) =>{
  // console.log(e)
  currentRowState.value = e
}
const deleteButton = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "조회를 먼저 해주세요.",
      confirmButtonText: "확인",
    });
    return;
  }

  if(currentRowState.value != 'created'){
    Swal.fire({
      title: "신규행만 삭제 가능합니다.",
      confirmButtonText: "확인",
    });
    return;
  }

  deleteRow.value = !deleteRow.value;

};

/**
 * 데이터셋 상세정보 셋팅
 */
const clickedRowData = async (e) => {
  gridvalue1.value = e[0];
  gridvalue2.value = e[1];

  try {
    const res = await getStockStoreInfo(
      store.state.userData.lngStoreGroup,
      gridvalue1.value
    );

    rowData2.value = res.data.stockStoreInfo;

  } catch (error) {

  }

};

/**
 * 데이터셋 상세정보 셋팅
 */
const clickedRowData2 = async (e) => {
  gridvalue3.value = e[0];
  gridvalue4.value = e[1];
};

/**
 * 페이지 매장 그룹 세팅
 */

const allstaterows = ref([]);
const allStateRows = (e) => {
  // console.log(e);
  allstaterows.value = e;
};

const allStaterows2 = ref([]);
const allStateRows2 = (e) => {
  // console.log(e);
  allStaterows2.value = e;
};

/**
 * 입력창 수정 데이터 갱신
 */

const updatedrowdata = ref([]);
const updatedRowData = (newValue) => {
  // console.log(newValue);
  updatedrowdata.value = newValue;
};

/**
 * 입력창 수정 데이터 갱신
 */

const updatedrowdata2 = ref([]);
const updatedRowData2 = (newValue) => {
  // console.log(newValue);
  updatedrowdata2.value = newValue;
};

const checkedrowdata = ref([]);
const checkedRowData = (e) => {
  checkedrowdata.value = e;
  // console.log(e);
};

/**
 *  조회 함수
 */

const store = useStore();

const searchButton = async () => {
  try {
    store.state.loading = true;
    rowData.value = [];

    let res;
    res = await getStockPartInfo(
      store.state.userData.lngStoreGroup
    );

    rowData.value = res.data.stockPartInfo;
    updateRow.value = JSON.parse(JSON.stringify(rowData.value));
    // console.log(res);

  } catch (error) {
    afterSearch.value = false;
  } finally {
    store.state.loading = false;
    afterSearch.value = true;
    rowData2.value = [];
    gridvalue1.value = [];
    gridvalue2.value = [];
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

  // console.log(ulength);

  if (ulength == 0) {
    Swal.fire({
      title: "경고",
      text: "변경된 사항이 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  // console.log(updatedrowdata.value);

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
        /**
         * 페이지 매장 그룹 세팅
         */
        const partCds = updatedrowdata.value
          .map((item) => item.lngPartCode)
          .join("\u200b");
        const partNms = updatedrowdata.value
          .map((item) => item.strPartName)
          .join("\u200b");
        const blnUseYN = updatedrowdata.value
          .map((item) => (item.blnUseYN == true ? 1 : 0))
          .join("\u200b");

        const res = await saveStockPartInfo(
          store.state.userData.lngStoreGroup,
          partCds,
          partNms,
          blnUseYN,
          store.state.userData.lngSequence
        );

        // console.log(res);

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
        rowData2.value = [];
      }
    }
  });
};


/**
 *  저장 버튼 함수
 */

const saveButton2 = async () => {
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
    allStaterows2.value.created.length +
    allStaterows2.value.updated.length +
    allStaterows2.value.deleted.length;

  // console.log(ulength);

  if (ulength == 0) {
    Swal.fire({
      title: "경고",
      text: "변경된 사항이 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  // console.log(updatedrowdata2.value);

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
        /**
         * 페이지 매장 그룹 세팅
         */
        const storeCds = updatedrowdata2.value
          .map((item) => item.lngStoreCode)
          .join("\u200b");
        const lngCheck = updatedrowdata2.value
          .map((item) => (item.lngCheck == true ? 1 : 0))
          .join("\u200b");

        // console.log(gridvalue1.value);

        const res = await saveStockStoreInfo(
          store.state.userData.lngStoreGroup,
          gridvalue1.value,
          storeCds,
          lngCheck,
          store.state.userData.lngSequence
        );

        // console.log(res);

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
        rowData2.value = [];
      }
    }
  });
};

</script>

<style scoped></style>
