<!-- /*--############################################################################
# Filename : STK08_021MAN.vue                                                  
# Description : 자재 관리 > 월마감 관리 > 월마감 관리.            
# Date :2025-09-02                                                             
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <!-- 조회 조건 -->
  <div class="flex justify-between items-center w-full overflow-y-hidden">
    <PageName></PageName>
    <div class="flex justify-center mr-9 space-x-2 pr-5">
      <button @click="searchButton" class="button search md:w-auto w-14">
        조회
      </button>
      <button @click="excelButton" class="button w-auto excel">엑셀</button>
      <button @click="saveButton" class="button save w-auto">저장</button>
    </div>
  </div>
  <div
    class="flex justify-start bg-gray-200 rounded-lg h-16 items-center z-10 space-x-96">
    <div class="flex space-x-5 items-center ml-12">
      <div class="font-semibold text-base">조회기간</div>
      <select name="" id="" class="w-32 h-8 border border-black" v-model="cond">
        <option :value="i.lngCode" v-for="i in optionList">
          {{ i.strName }}
        </option>
      </select>
      <div>~</div>
      <select
        name=""
        id=""
        class="w-20 h-8 border border-black"
        v-model="cond2">
        <option :value="i.lngCode" v-for="i in optionList2">
          {{ i.strName }}
        </option>
      </select>
    </div>

    <PickStore
      @update:storeCd="lngStoreCode"
      @storeNm="storeNm"
      :hideAttr="false"
      :hideGroup="false"
      :defaultStore="true"
      :defaultStoreNm="'전체'"
      @update:storeGroup="lngStoreGroup"></PickStore>
  </div>
  <!-- 조회 조건 -->
  <!-- 그리드 영역-->
  <div class="h-[80%]">
    <div class="flex text-red-500">
      ※월마감 관리 기능은 마감 해지 관리기능만 있습니다. 수정하시고 재마감을
      해야 할 경우 마감관리> 월마감 작업에서 하셔야 합니다.
    </div>
    <Realgrid
      :progname="'STK08_021MAN_VUE'"
      :progid="1"
      :rowData="rowData"
      :setStateBar="false"
      :fixedColumn="true"
      @updatedRowData="updatedRowData"
      @allStateRows="allStateRows"
      :documentTitle="'STK08_021MAN'"
      :rowStateeditable="false"
      :checkRenderEditable="true"
      :headerCheckBar="'Selected'"
      :checkOnlyFalse="true"
      :selectionStyle="'block'"
      :documentSubTitle="documentSubTitle"
      :exporttoExcel="exporttoExcel"></Realgrid>
  </div>
  <!-- 그리드 영역-->
</template>

<script setup>
/**
 *  매출 일자 호출 컴포넌트
 *  */

import { getMonthCloseList, saveMonthCloseUpdate } from "@/api/mistock";
/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
import PickStore from "@/components/pickStore.vue";
/**
 *  매장 단일 선택 컴포넌트
 *  */

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

  optionList.value = [
    { lngCode: 2030, strName: 2030 },
    { lngCode: 2029, strName: 2029 },
    { lngCode: 2028, strName: 2028 },
    { lngCode: 2027, strName: 2027 },
    { lngCode: 2026, strName: 2026 },
    { lngCode: 2025, strName: 2025 },
    { lngCode: 2024, strName: 2024 },
    { lngCode: 2023, strName: 2023 },
    { lngCode: 2022, strName: 2022 },
    { lngCode: 2021, strName: 2021 },
    { lngCode: 2020, strName: 2020 },
  ];

  optionList2.value = [
    { lngCode: "01", strName: 1 },
    { lngCode: "02", strName: 2 },
    { lngCode: "03", strName: 3 },
    { lngCode: "04", strName: 4 },
    { lngCode: "05", strName: 5 },
    { lngCode: "06", strName: 6 },
    { lngCode: "07", strName: 7 },
    { lngCode: "08", strName: 8 },
    { lngCode: "09", strName: 9 },
    { lngCode: "10", strName: 10 },
    { lngCode: "11", strName: 11 },
    { lngCode: "12", strName: 12 },
  ];
  const today = new Date();
  cond.value = today.getFullYear();

  cond2.value = String(today.getMonth()).padStart(2, "0");
});

const selectedDate = ref();
const documentSubTitle = ref();
const selectedExcelDate = ref();
const selectedExcelStore = ref();
const Project = ref(null);

/**
 * 	매출 일자 가져오는 함수
 */

const cond = ref("");
const cond2 = ref("");
const lngstoregroup = ref();
const optionList = ref([]);
const optionList2 = ref([]);
const lngstorecode = ref();
const checked = ref([0]);
const hideColumnsId = ref(["strStoreName"]);
/**
 * 페이지 매장 그룹 세팅
 */

const lngStoreGroup = (e) => {
  lngstoregroup.value = e;
  //comsole.log(e);
};

/**
 * 페이지 매장 분류 세팅
 */

/**
 * 페이지 매장 슈퍼바이저 세팅
 */

const sYear = ref("");
const startYear = (e) => {
  sYear.value = e;
  //console.log(e);
};
/**
 * 페이지 매장 코드 세팅
 */

const lngStoreCode = (e) => {
  lngstorecode.value = e;
  //comsole.log(e);
};

const receiptNo = ref();
const initCheckBox = ref(false);
const initSearchWord = ref(false);
const store = useStore();
const loginedstrLang = store.state.userData.lngLanguage;
//comsole.log(store);

const afterSearch = ref(false);
/**
 *  조회 함수
 */

const searchButton = async () => {
  store.state.loading = true;
  try {
    initGrid();

    const res = await getMonthCloseList(
      lngstoregroup.value,
      lngstorecode.value,
      cond.value + cond2.value
    );
    //console.log(res);

    rowData.value = res.data.List;
    updatedrowdata.value = res.data.List;
    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
  } finally {
    store.state.loading = false;
  }
};

/**
 * 선택한 매장 코드 호출 함수
 */

/**
 * 선택한 매장 그룹 코드 호출 함수
 */

const rowData = ref([]);

/**
 * 선택한 할인 코드 호출 함수
 */

const payCd = ref("");
/**
 * 선택한 결제 코드 호출 함수
 */

const exporttoExcel = ref(false);
/**
 * 엑셀 내보내기 함수
 */
const storename = ref("");
const storeNm = (e) => {
  storename.value = e;
};
const excelButton = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 진행해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  documentSubTitle.value =
    selectedExcelDate.value + "\n" + "매장명 :" + storename.value;
  exporttoExcel.value = !exporttoExcel.value;
};
/**
 * 그리드 초기화
 */

const initGrid = () => {
  //comsole.log(rowData.value);
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
};

const updatedrowdata = ref([]);
const updatedRowData = (e) => {
  updatedrowdata.value = e;
};

const allstaterows = ref([]);
const allStateRows = (e) => {
  allstaterows.value = e.updated;
};
watch([cond, cond2], () => {
  selectedExcelDate.value =
    "조회기간 : " + cond.value + "년" + cond2.value + "월";
});
const saveButton = async () => {
  if (allstaterows.value.length == 0) {
    Swal.fire({
      title: "경고",
      text: "수정하신 사항이 존재하지 않습니다.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }

  try {
    const lngCds = updatedrowdata.value
      .filter((item, index) => allstaterows.value.includes(index))
      .map((item) => item.lngStoreCode)
      .join("\u200b");
    // const checkbln = updatedrowdata.value
    //   .filter((item, index) => allstaterows.value.includes(index))
    //   .map((item) => (item.Selected == true ? 1 : 0))
    //   .join("\u200b");
    const res = await saveMonthCloseUpdate(
      store.state.userData.lngStoreGroup,
      lngCds,
      cond.value + cond2.value,
      0,
      store.state.userData.lngSequence
    );

    //console.log(res);

    if (res.data.RESULT_CD == "00") {
      await Swal.fire({
        title: "성공",
        text: "저장을 완료하였습니다.",
        icon: "success",

        confirmButtonText: "확인",
      });
    } else {
      await Swal.fire({
        title: "실패",
        text: "저장에 실패하였습니다.",
        icon: "error",

        confirmButtonText: "확인",
      });
    }
  } catch (error) {}
};
</script>
