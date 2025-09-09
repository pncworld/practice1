<!-- /*--############################################################################
# Filename : CRM60_009INS.vue                                                  
# Description : 고객관리 > 전자상품권 마스터 관리 > 전자상품권 거래처 등록.     
# Date :2025-06-23                                                            
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <!-- 조회조건 -->
  <div class="h-full" @click="handleParentClick">
    <div class="flex justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center mr-9 space-x-2 pr-5">
        <!-- <button @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <button @click="addButton" class="button new md:w-auto w-14">
          출고
        </button>
        <button @click="deleteButton" class="button delete md:w-auto w-14">
          취소처리
        </button>
        <button @click="excelButton" class="button save w-auto excel">
          엑셀
        </button> -->
      </div>
    </div>
    <div
      class="grid grid-cols-[1fr,1fr] grid-rows-1 bg-gray-200 rounded-lg h-12 items-center pt-1 z-10 space-x-2 justify-end">
      <div class="space-x-3 flex justify-end">
        <button class="button new" @click="addButton">신규</button
        ><button class="button save" @click="saveButton">저장</button>
      </div>

      <div class="space-x-3 flex justify-end !pr-2">
        <button class="button new" @click="addButton2">신규</button
        ><button class="button save" @click="saveButton2">저장</button>
      </div>
    </div>
    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="flex justify-between">
      <div class="grid grid-rows-2 grid-cols-[1fr,3fr] h-24 w-96 mt-3">
        <div
          class="text-base font-semibold border-l border-t border-black flex justify-center items-center">
          그룹코드
        </div>
        <div
          class="text-base font-semibold border-l border-t border-black flex justify-center items-center">
          <input
            type="number"
            class="h-[80%] w-[80%] border border-black"
            :disabled="disable1"
            name="lngCode"
            @input="changeValue"
            v-model="cond" />
        </div>
        <div
          class="text-base font-semibold border-l border-t border-b border-black flex justify-center items-center">
          그룹명
        </div>
        <div
          class="text-base font-semibold border-l border-t border-b border-black flex justify-center items-center">
          <input
            type="text"
            name="strName"
            @input="changeValue"
            class="h-[80%] w-[80%] border border-black"
            v-model="cond2" />
        </div>
      </div>

      <div class="grid grid-rows-3 grid-cols-[1fr,3fr] h-32 w-96 mr-96 mt-3">
        <div
          class="text-base font-semibold border-l border-t border-black flex justify-center items-center">
          그룹코드
        </div>
        <div
          class="text-base font-semibold border-l border-t border-black flex justify-center items-center">
          <input
            type="number"
            :disabled="true"
            class="h-[80%] w-[80%] border border-black"
            v-model="cond3" />
        </div>
        <div
          class="text-base font-semibold border-l border-t border-black flex justify-center items-center">
          고객카드
        </div>
        <div
          class="text-base font-semibold border-l border-t border-black flex justify-center items-center">
          <input
            type="number"
            name="lngCode"
            :disabled="disable2"
            @input="changeValue2"
            class="h-[80%] w-[80%] border border-black"
            v-model="cond4" />
        </div>
        <div
          class="text-base font-semibold border-l border-t border-b border-black flex justify-center items-center">
          고객명
        </div>
        <div
          class="text-base font-semibold border-l border-t border-b border-black flex justify-center items-center">
          <input
            type="text"
            name="strName"
            @input="changeValue2"
            class="h-[80%] w-[80%] border border-black"
            v-model="cond5" />
        </div>
      </div>
    </div>
    <div class="w-full h-[60%] mt-3">
      <div class="flex h-full space-x-10">
        <Realgrid
          :progname="'CRM60_009INS_VUE'"
          :progid="1"
          :rowData="rowData"
          :reload="reload"
          @clickedRowData="clickedRowData"
          @selectedIndex="selectedIndex"
          @updatedRowData="updatedRowData"
          :rowStateeditable="false"
          :addRow4="addRow"
          :changeValue2="changeValue3"
          :changeRow="changeRow"
          :changeColid="changeColid"
          :changeNow="changeNow"
          :addrowDefault="addrowDefault"
          :addrowProp="addrowProp"
          @allStateRows="allStateRows"
          @sendRowState="sendRowState"
          :exporttoExcel="exportExcel">
        </Realgrid>

        <Realgrid
          :progname="'CRM60_009INS_VUE'"
          :progid="2"
          :rowData="rowData2"
          :reload="reload"
          @clickedRowData="clickedRowData2"
          @selectedIndex="selectedIndex2"
          @sendRowState="sendRowState2"
          @updatedRowData="updatedRowData2"
          @allStateRows="allStateRows2"
          :changeValue2="changeValue4"
          :changeRow="changeRow2"
          :changeColid="changeColid2"
          :changeNow="changeNow2"
          :addrowDefault="addrowDefault"
          :addrowProp="addrowProp"
          :addRow4="addRow2"
          :rowStateeditable="false"
          :exporttoExcel="exportExcel">
        </Realgrid>
      </div>
    </div>
  </div>

  <!-- 그리드 영역 -->
</template>

<script setup>
import {
  getGFTMaster,
  getGFTMaster2,
  saveGftCardClientEnroll,
  saveGftCardReleaseCancel,
} from "@/api/micrm";
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

import { onMounted, ref, watch } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";
/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getGFTMaster(store.state.userData.lngStoreGroup);

  rowData.value = res.data.List;
  updatedRow.value = JSON.parse(JSON.stringify(res.data.List));
});

const reload = ref(false);
const rowData = ref([]);
const rowData2 = ref([]);
const afterSearch = ref(false);
const selectedCond = ref(0);
const condValue = ref(0);
const cond = ref("");
const cond2 = ref("");
const cond3 = ref("");
const cond4 = ref("");
const cond5 = ref("");

const disable1 = ref(true);
const disable2 = ref(true);
const pcond21 = ref(0);
const pcond22 = ref("");
const pcond23 = ref("");
const pcond24 = ref("");
const today = ref(new Date());
const pcond1 = ref();
const pcond2 = ref("0");
const pcond3 = ref("");
const pcond4 = ref("");

const store = useStore();
const optionList = ref([]);
const optionList2 = ref([]);
const optionList3 = ref([]);
const optionList4 = ref([]);
const datepicker = ref(null);
const closePopUp = ref(false);

const sd = ref("");
const sd2 = ref("");
const ed = ref("");
const ed2 = ref("");
const selectedDate = ref("");
const startDate = (e) => {
  sd.value = e;
};
const endDate = (e) => {
  ed.value = e;
};

const excelDate = (e) => {
  selectedDate.value = e;
};

/**
 * 매출 일자 안 라디오박스 닫기 위한 외부 클릭 감지 함수
 */

const handleParentClick = (e) => {
  const datepickerEl = datepicker.value?.$el;
  if (datepickerEl && datepickerEl.contains(e.target)) {
    return;
  }
  closePopUp.value = !closePopUp.value;
};

/**
 *  조회 함수
 */
const visible = ref(false);
const visible2 = ref(false);

const addRow = ref(false);
const addRow2 = ref(false);
const addrowProp = ref("");
const addrowDefault = ref("");
const addButton = () => {
  addRow.value = !addRow.value;
};
const addButton2 = () => {
  addRow2.value = !addRow2.value;
};
const searchButton = async () => {
  try {
    store.state.loading = true;
    initGrid();

    const res = await getGFTMaster(store.state.userData.lngStoreGroup);

    rowData.value = res.data.List;
    updatedRow.value = JSON.parse(JSON.stringify(res.data.List));

    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    //comsole.log(error);
  } finally {
    store.state.loading = false;
  }
};

/* 매장 컴포넌트 관련 함수 */
const selectedGroup = ref();
const selectedStores = ref();
const selectedStores2 = ref();
const selectedStoreAttrs = ref();

const saveButton = async () => {
  if (JSON.stringify(updatedRow.value) == JSON.stringify(rowData.value)) {
    Swal.fire({
      title: "경고",
      text: "변경된 사항이 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  ////console.log(cAllStateRow.value);
  try {
    if (cAllStateRow.value.created.length > 0) {
      const IlngCode = updatedRow.value
        .filter((item, index) => cAllStateRow.value.created.includes(index))
        .map((item) => item.lngCode);
      const IstrName = updatedRow.value
        .filter((item, index) => cAllStateRow.value.created.includes(index))
        .map((item) => item.strName);
      const res = await saveGftCardClientEnroll(
        store.state.userData.lngStoreGroup,
        IlngCode.join("\u200b"),
        "",
        IstrName.join("\u200b"),
        1,
        "I"
      );
      ////console.log(res);
    }

    if (cAllStateRow.value.updated.length > 0) {
      const IlngCode = updatedRow.value
        .filter((item, index) => cAllStateRow.value.updated.includes(index))
        .map((item) => item.lngCode);
      const IstrName = updatedRow.value
        .filter((item, index) => cAllStateRow.value.updated.includes(index))
        .map((item) => item.strName);
      const res = await saveGftCardClientEnroll(
        store.state.userData.lngStoreGroup,
        IlngCode.join("\u200b"),
        "",
        IstrName.join("\u200b"),
        1,
        "U"
      );
      ////console.log(res);
    }
    Swal.fire({
      title: "성공",
      text: "저장에 성공하였습니다.",
      icon: "success",
      confirmButtonText: "확인",
    });

    ////console.log(res);
  } catch (error) {
    ////console.log(error);
  } finally {
    visible.value = false;
    initGrid();
    searchButton();
  }
};
const saveButton2 = async () => {
  if (JSON.stringify(updatedRow2.value) == JSON.stringify(rowData2.value)) {
    Swal.fire({
      title: "경고",
      text: "변경된 사항이 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  ////console.log(cAllStateRow2.value);
  try {
    if (cAllStateRow2.value.created.length > 0) {
      const IlngCode = updatedRow2.value
        .filter((item, index) => cAllStateRow2.value.created.includes(index))
        .map((item) => item.lngCode);
      const IstrName = updatedRow2.value
        .filter((item, index) => cAllStateRow2.value.created.includes(index))
        .map((item) => item.strName);
      const res = await saveGftCardClientEnroll(
        store.state.userData.lngStoreGroup,
        cond3.value,
        IlngCode.join("\u200b"),
        IstrName.join("\u200b"),
        2,
        "I"
      );
      ////console.log(res);
    }

    if (cAllStateRow2.value.updated.length > 0) {
      const IlngCode = updatedRow2.value
        .filter((item, index) => cAllStateRow2.value.updated.includes(index))
        .map((item) => item.lngCode);
      const IstrName = updatedRow2.value
        .filter((item, index) => cAllStateRow2.value.updated.includes(index))
        .map((item) => item.strName);
      const res = await saveGftCardClientEnroll(
        store.state.userData.lngStoreGroup,
        cond3.value,
        IlngCode.join("\u200b"),
        IstrName.join("\u200b"),
        2,
        "U"
      );
      ////console.log(res);
    }
    Swal.fire({
      title: "성공",
      text: "저장에 성공하였습니다.",
      icon: "success",
      confirmButtonText: "확인",
    });

    ////console.log(res);
  } catch (error) {
    ////console.log(error);
  } finally {
    visible.value = false;
    initGrid();
    searchButton();
  }
};
/**
 * 페이지 매장 코드 세팅
 */

const lngStoreCode = async (e) => {
  //initGrid();
  selectedStores.value = e;
  ////console.log(e);
};
const lngStoreCode2 = async (e) => {
  //initGrid();
  selectedStores2.value = e;
  ////console.log(e);
};

/**
 * 그리드 초기화
 */

const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
  pcond21.value = 0;
  pcond22.value = today.value.toISOString().split("T")[0];
  pcond23.value = "";
  pcond24.value = "";
  pcond1.value = today.value.toISOString().split("T")[0];
  pcond2.value = 0;
  pcond3.value = "";
  pcond4.value = "";
};

//엑셀 버튼 처리 함수
const exportExcel = ref(false);
/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  documentSubTitle.value = selectedDate.value;

  exportExcel.value = !exportExcel.value;
};

// 엑셀 추출
const documentSubTitle = ref("");
const selectedExcelList = ref("");

const selectedExcelStore = ref("");
/**
 * 엑셀용 매장 세팅 함수
 */
const selectedCardNo = ref("");
const selectedDate2 = ref("");
const selectedStoreCd = ref("");
const clickedRowData = async (e) => {
  cond.value = e[0];
  cond2.value = e[1];

  const res = await getGFTMaster2(store.state.userData.lngStoreGroup, e[0]);
  ////console.log(res);
  rowData2.value = res.data.List;
  updatedRow2.value = JSON.parse(JSON.stringify(res.data.List));
  cond3.value = e[0];
};
const clickedRowData2 = async (e) => {
  ////console.log(e);
  cond4.value = e[1];
  cond5.value = e[2];
};
const updatedRow = ref([]);
const updatedRow2 = ref([]);
const updatedRowData = (e) => {
  updatedRow.value = e;
};

const updatedRowData2 = (e) => {
  updatedRow2.value = e;
};
const currentGroupRowState = ref("");
const sendRowState = (e) => {
  currentGroupRowState.value = e;
};
const sendRowState2 = (e) => {
  if (e == "created") {
    disable2.value = false;
  } else {
    disable2.value = true;
  }
};
const cAllStateRow = ref("");
const allStateRows = (e) => {
  cAllStateRow.value = e;
};
const cAllStateRow2 = ref("");
const allStateRows2 = (e) => {
  cAllStateRow2.value = e;
};

const cRowIndex = ref("-1");
const selectedIndex = (e) => {
  cRowIndex.value = e;
};
const cRowIndex2 = ref("-1");
const selectedIndex2 = (e) => {
  cRowIndex2.value = e;
};
const changeRow = ref("-1");
const changeRow2 = ref("-1");
watch(currentGroupRowState, () => {
  if (currentGroupRowState.value == "created") {
    disable1.value = false;
  } else {
    disable1.value = true;
  }
});

const changeNow = ref(false);
const changeColid = ref("");
const changeValue3 = ref("");
const changeValue = (e) => {
  if (cRowIndex.value == "-1") {
    return;
  }
  changeRow.value = cRowIndex.value;
  changeColid.value = e.target.name;
  changeValue3.value = e.target.value;

  changeNow.value = !changeNow.value;
};

const changeNow2 = ref(false);
const changeColid2 = ref("");
const changeValue4 = ref("");
const changeValue2 = (e) => {
  if (cRowIndex2.value == "-1") {
    return;
  }
  changeRow2.value = cRowIndex2.value;
  changeColid2.value = e.target.name;
  changeValue4.value = e.target.value;

  changeNow2.value = !changeNow2.value;
};
const deleteButton = async (e) => {
  visible2.value = true;
};
const excelStore = (e) => {
  selectedExcelStore.value = e;
  //comsole.log(e);
};
const excelList = (e) => {
  selectedExcelList.value = e;
  //comsole.log(e);
};
</script>
