<!-- /*--############################################################################
# Filename : MST45_030INS.vue                                                  
# Description : 마스터관리 > 자재 마스터2 > 거래처별 배송주기 관리                     
# Date :2025-08-22                                                           
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <!-- 조회조건 -->
  <div class="flex justify-between items-center w-full overflow-y-hidden">
    <PageName></PageName>
    <div class="flex justify-center mr-9 space-x-2 pr-5">
      <button @click="searchButton" class="button search md:w-auto w-14">
        조회
      </button>

      <button @click="saveButton" class="button save w-auto">저장</button>
      <button @click="excelButton" class="button excel w-auto">엑셀</button>
    </div>
  </div>
  <br />
  <div class="flex flex-col bg-gray-200 rounded-lg h-24 items-start">
    <div class="flex space-x-96">
      <PickStore
        @update:storeCd="handleStoreCd"
        @storeNm="handlestoreNm"
        :hideAttr="false"
        :hideGroup="false"
        :defaultStoreNm="'전체'"
        class="ml-20"
        :defaultStore="true"></PickStore>

      <div class="flex items-start justify-center space-x-5">
        <BusinessClient
          @SupplierId="SupplierId"
          @SupplierNm="SupplierNm"></BusinessClient>
      </div>
    </div>
    <div class="ml-12 mt-2 flex space-x-5">
      <div class="text-base font-semibold">소요일수 일괄적용</div>
      <div class="flex space-x-5">
        <input type="text" @input="setValue" v-model="cond" />
        <button class="whitebutton bg-white" @click="setLeadTime">적용</button>
      </div>
    </div>
  </div>
  <div class="text-blue-600 ml-5">
    ※소요일수를 더블클릭하시면 수정하실 수 있습니다.
  </div>
  <!-- 조회조건 -->
  <!-- 그리드 영역 -->
  <div class="flex justify-center w-[97%] h-[60vh] gap-5 ml-5">
    <Realgrid
      class="w-full h-full mt-2"
      :progname="'MST45_030INS_VUE'"
      :progid="2"
      :rowData="rowData"
      @updatedRowData="updatedRowData"
      @clickedRowData="clickedRowData"
      @allStateRows="allStateRows"
      :getRowChanged="getRowChanged"
      :exporttoExcel="exporttoExcel"
      :documentTitle="'MST45_030INS'"
      :documentSubTitle="documentSubTitle"
      :editableColId="'lngLeadTime'"
      :rowStateeditable="false"
      :changeRow="changeRow"
      :changeColid="changeColid"
      :changeValue2="changeValue2"
      :changeNow3="changeNow3"
      :checkRenderEditable="true"
      :selectionStyle="'block'"
      :setRowGroupSpan2="'strSupplierName'"
      :inputOnlyNumberColumn="'lngLeadTime'">
    </Realgrid>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import {
  getStockCycle2,
  getStockCycle3,
  saveStockCycle2,
  saveStockCycle3,
} from "@/api/master";
import { getStockDetail } from "@/api/mistock";
import BusinessClient from "@/components/businessClient.vue";
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

import { nextTick, onMounted, ref } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";

/**
 * 	화면 Load시 실행 스크립트
 */

const hidesub = ref(true);
const hideAttr = ref(true);
onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
  let groupcds = [
    "1640",
    "1737",
    "1751",
    "1777",
    "1871",
    "1894",
    "3100",
    "1782",
    "1814",
    "1954",
    "1260",
    "3183",
  ];

  if (groupcds.includes(store.state.userData.lngStoreGroup)) {
    disabled.value = false;

    const res = await getStockDetail(store.state.userData.lngStoreGroup, "01");

    optionList.value = res.data.List;
  } else {
    disabled.value = true;
  }
  //   if (store.state.userData.lngCommonMenu == "1") {
  //     hidesub.value = false;
  //     hideAttr.value = false;
  //   } else {
  //     hidesub.value = true;
  //     hideAttr.value = true;
  //   }
});
const optionList = ref([]);
const nowStoreAreaCd = ref();
const nowStoreCd = ref(0);
/**
 * 선택한 포스 번호 호출 함수
 */

const posNo = ref();
const deleteAll = ref(false);
/**
 *  그리드 검색어 세팅
 */

const afterSearch = ref(false);
const clickedStoreNm = ref();
const addrowDefault = ref();
const commitAll = ref(false);
const store = useStore();
const userData = store.state.userData;

/**
 * 페이지 매장 코드 세팅
 */

const handleStoreCd = async (newValue) => {
  //   if (newValue == "0" && store.state.userData.lngCommonMenu == "0") {
  //     afterSearch.value = false;
  //   }
  nowStoreCd.value = newValue;
  afterSearch.value = false;
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
  //searchButton();
};

/**
 * 페이지 매장명 세팅
 */

const handlestoreNm = (newData) => {
  clickedStoreNm.value = newData;
};

/**
 * 조회 상태 초기화
 */

/**
 * 조회 초기화
 */

const allstaterows = ref([]);
const confirmData2 = ref();
const rowData = ref([]);
const rowData2 = ref([]);

const allStateRows = (e) => {
  allstaterows.value = e.updated;
};
/**
 *  조회 함수
 */

const searchButton = async () => {
  if (selectedSupplier.value == 0) {
    Swal.fire({
      title: "경고",
      text: "거래처를 먼저 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  try {
    store.state.loading = true;
    const res = await getStockCycle3(
      store.state.userData.lngStoreGroup,
      nowStoreCd.value,
      selectedSupplier.value
    );
    store.state.loading = false;
    rowData.value = res.data.List;
    afterSearch.value = true;
  } catch (error) {
    //console.log(error);
  }
};
const addbutton = ref(false);
/**
 * 추가 버튼 함수
 */

const addbutton2 = ref(false);
/**
 * 추가 버튼 함수
 */

const filteredRowData2 = ref([]);
const selectedlngCode = ref();
const changeValue = ref("0");
/**
 * 데이터셋 상세정보 셋팅
 */

const clickFirst = ref(false);
const clickedRowData = (newValue) => {
  //comsole.log(newValue);
  clickFirst.value = true;
  filteredRowData2.value = rowData2.value.filter(
    (item) => item.lngMajor == newValue[0]
  );
  selectedlngCode.value = newValue[0];
  changeRow.value = newValue.index;
  //comsole.log(changeRow.value);
};
/**
 * 데이터셋 상세정보 셋팅
 */

/**
 * 입력창 수정 데이터 갱신
 */

const updatedrowdata = ref([]);
/**
 * 입력창 수정 데이터 갱신
 */
const disabled = ref(false);
const updatedRowData = (newValue) => {
  ////console.log(newValue);
  updatedrowdata.value = newValue;
};

const deleterow2 = ref(false);
/**
 * 그리드 행 삭제 버튼 함수
 */

/**
 * 그리드 행 삭제 버튼 함수
 */

/**
 *  저장 버튼 함수
 */

const saveButton = async () => {
  if (allstaterows.value.length == 0) {
    Swal.fire({
      title: "경고",
      text: "변경된 사항이 없습니다.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }
  try {
    await Swal.fire({
      title: "확인",
      text: "저장하시겠습니까?",
      icon: "question", // 'success', 'error', 'warning', 'info', 'question'
      showCancelButton: true, // 취소 버튼 표시
      confirmButtonText: "확인",
      cancelButtonText: "취소",
    }).then(async (result) => {
      if (result.isConfirmed) {
        store.state.loading = true;
        const storecds = updatedrowdata.value
          .filter((_, index) => allstaterows.value.includes(index))
          .map((item) => item.lngStoreCode)
          .join("\u200b");

        const supplierids = updatedrowdata.value
          .filter((_, index) => allstaterows.value.includes(index))
          .map((item) => item.lngSupplierID)
          .join("\u200b");
        const leadtimes = updatedrowdata.value
          .filter((_, index) => allstaterows.value.includes(index))
          .map((item) => item.lngLeadTime)
          .join("\u200b");
        const blnsun = updatedrowdata.value
          .filter((_, index) => allstaterows.value.includes(index))
          .map((item) => (item.blnSunday == true ? 1 : 0))
          .join("\u200b");
        const blnmon = updatedrowdata.value
          .filter((_, index) => allstaterows.value.includes(index))
          .map((item) => (item.blnMonday == true ? 1 : 0))
          .join("\u200b");
        const blntue = updatedrowdata.value
          .filter((_, index) => allstaterows.value.includes(index))
          .map((item) => (item.blnThuesday == true ? 1 : 0))
          .join("\u200b");
        const blnwed = updatedrowdata.value
          .filter((_, index) => allstaterows.value.includes(index))
          .map((item) => (item.blnWednesday == true ? 1 : 0))
          .join("\u200b");
        const blnthur = updatedrowdata.value
          .filter((_, index) => allstaterows.value.includes(index))
          .map((item) => (item.blnThursday == true ? 1 : 0))
          .join("\u200b");
        const blnfri = updatedrowdata.value
          .filter((_, index) => allstaterows.value.includes(index))
          .map((item) => (item.blnFriday == true ? 1 : 0))
          .join("\u200b");
        const blnsat = updatedrowdata.value
          .filter((_, index) => allstaterows.value.includes(index))
          .map((item) => (item.blnSaturday == true ? 1 : 0))
          .join("\u200b");
        const res = await saveStockCycle3(
          store.state.userData.lngStoreGroup,
          storecds,
          supplierids,
          leadtimes,
          blnsun,
          blnmon,
          blntue,
          blnwed,
          blnthur,
          blnfri,
          blnsat
        );
        store.state.loading = false;
        //console.log(res);

        if (res.data.RESULT_CD == "00") {
          Swal.fire({
            title: "성공",
            text: "저장에 성공하였습니다.",
            icon: "success", // 'success', 'error', 'warning', 'info', 'question'

            confirmButtonText: "확인",
          });
        } else {
          Swal.fire({
            title: "실패",
            text: "저장에 실패하였습니다.",
            icon: "error", // 'success', 'error', 'warning', 'info', 'question'

            confirmButtonText: "확인",
          });
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // 취소 눌렀을 때 실행할 코드
        ////console.log("취소 버튼 클릭됨");
      }
    });
  } catch (error) {
  } finally {
    searchButton();
  }
};
const exporttoExcel = ref(false);
/**
 * 엑셀 내보내기 함수
 */
const documentSubTitle = ref("");
const excelButton = () => {
  documentSubTitle.value =
    "매장명 :" +
    clickedStoreNm.value +
    "\n" +
    "거래처 : " +
    selectedSupplierNm.value;

  exporttoExcel.value = !exporttoExcel.value;
};

const selectedSupplier = ref("");
const SupplierId = (e) => {
  selectedSupplier.value = e;
  afterSearch.value = false;
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
  ////console.log(e);
};

const selectedSupplierNm = ref("");
const SupplierNm = (e) => {
  //console.log(e);
  selectedSupplierNm.value = e;
};

const cond = ref("");
const setValue = (e) => {
  cond.value = e.target.value.replace(/[^0-9]/g, "");
};

const getRowChanged = ref(false);
const changeValue2 = ref("");
const changeColid = ref("lngLeadTime");
const changeRow = ref("");
const changeNow3 = ref(false);
const setLeadTime = async () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (cond.value == "" || cond.value == undefined) {
    Swal.fire({
      title: "경고",
      text: "정확한 소요일수를 입력해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  changeValue2.value = cond.value;
  const alllength = rowData.value.length;
  for (var i = 0; i < alllength; i++) {
    changeRow.value = i;
    changeNow3.value = !changeNow3.value;
    await nextTick();
  }
  getRowChanged.value = !getRowChanged.value;
};
</script>

<style></style>
