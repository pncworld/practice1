<!-- /*--############################################################################
# Filename : STKN07_016RPT.vue                                                  
# Description : 자재관리 > 실사 관리 > 파트별 실사 등록.               
# Date :2025-09-17                                                            
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <!-- 조회조건 -->
  <div class="h-full" @click="handleParentClick">
    <div class="flex justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center mr-9 space-x-2 pr-5">
        <button @click="uploadButton" class="button save w-44 excel">
          실사시트 업로드
        </button>
        <button @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <button @click="deleteButton" class="button delete md:w-auto w-14">
          삭제
        </button>
        <button @click="saveButton" class="button save md:w-auto w-14">
          저장
        </button>
        <button @click="excelButton" class="button excel md:w-auto w-14">
          엑셀
        </button>
      </div>
    </div>
    <div
      class="grid grid-cols-3 grid-rows-3 justify-between bg-gray-200 rounded-lg h-32 items-start z-10">
      <div class="flex ml-24">
        <Datepicker1 :mainName="'일자'" @dateValue="dateValue"></Datepicker1>
      </div>
      <div class="mt-2">
        <PickStoreRenew
          @lngStoreCode="lngStoreCode"
          @excelStore="excelStore"
          :hideit2="false"
          :hideit="false"></PickStoreRenew>
      </div>

      <div class="flex items-center space-x-5 mt-2 ml-5">
        <div class="text-base font-semibold">파트</div>
        <div>
          <select
            name=""
            id=""
            class="border border-black w-32 h-8"
            @change="setCond"
            v-model="cond">
            <option :value="i.lngPartCode" v-for="i in optionList">
              {{ i.strPartName }}
            </option>
          </select>
        </div>
      </div>
      <div class="flex ml-12 space-x-5 mt-2 items-center col-span-2">
        <div class="text-base font-semibold">자재코드/명</div>
        <div class="flex space-x-5">
          <input
            type="text"
            class="w-32 h-8 border border-black"
            v-model="cond2" />
          <input
            type="text"
            class="w-48 h-8 border border-black"
            v-model="cond3" />
        </div>
      </div>
      <div class="flex items-center justify-start text-base font-bold ml-1">
        <div>거래처</div>
        <select
          name=""
          id=""
          class="w-48 h-8 ml-5 border border-black"
          v-model="cond4">
          <option value="0">전체</option>
          <option :value="i.lngSupplierID" v-for="i in optionList2">
            {{ i.strSupplierName }}
          </option>
        </select>
      </div>
      <div
        class="flex justify-start items-center text-base text-nowrap font-semibold ml-16 pl-1 space-x-5">
        자재그룹
        <div class="flex space-x-5 ml-5">
          <select
            name=""
            id=""
            class="w-48 h-8 border border-black"
            v-model="cond5">
            <option value="0">전체</option>
            <option :value="i.lngStockGroupID" v-for="i in optionList3">
              {{ i.strStockGroupName }}
            </option>
          </select>
        </div>
      </div>
      <div class="flex items-center justify-start text-base font-bold ml-20">
        <div>자재분류</div>
        <select
          name=""
          id=""
          class="w-48 h-8 ml-5 border border-black"
          v-model="cond6">
          <option value="0">전체</option>
          <option :value="i.lngCategoryID" v-for="i in optionList4">
            {{ i.strCategoryName }}
          </option>
        </select>
      </div>
      <div
        class="flex items-center justify-start text-base font-bold space-x-5 -ml-3">
        <div>자재특성</div>
        <select
          name=""
          id=""
          class="w-48 h-8 border border-black"
          v-model="cond7">
          <option value="0">전체</option>
          <option :value="i.lngGenericID" v-for="i in optionList5">
            {{ i.strGenericName }}
          </option>
        </select>

        <div>
          <label for="check"
            ><input type="checkbox" id="check" v-model="cond8" />전체보기</label
          >
        </div>
      </div>
    </div>
    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="w-full h-[82%]">
      <div class="flex text-red-400 text-nowrap">
        ※월마감인 경우는 실사일자를 반드시 월의 마지막날로 선택해야 합니다.
      </div>
      <Realgrid
        :progname="'STKN07_016RPT_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :documentTitle="'STKN07_016RPT'"
        :editableColId="'dblTakeQty'"
        :checkRenderEditable="true"
        :checkRowAuto="true"
        :checkRowAuto2="false"
        @updatedRowData="updatedRowData"
        @allStateRows="allStateRows"
        :inputOnlyNumberColumn="'dblTakeQty'"
        :documentSubTitle="documentSubTitle"
        :rowStateeditable="false"
        :exporttoExcel="exportExcel">
      </Realgrid>
    </div>
  </div>
  <!-- 그리드 영역 -->
  <div v-if="open">
    <div class=""></div>
  </div>
</template>

<script setup>
import {
  deleteStockTakeByPart,
  getLossMasterPartList,
  getStockTakeCountListbyPart,
  saveStockTakeCountByPart,
} from "@/api/mistock";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
import PickStoreRenew from "@/components/pickStoreRenew.vue";
/**
 *  단일 매장  컴포넌트
 *  */

/**
 * 	그리드 생성
 */

import Realgrid from "@/components/realgrid.vue";
/**
 *  페이지로그 자동 입력
 *  */

import { insertPageLog } from "@/customFunc/customFunc";
/*
 * 공통 표준  Function
 */

import { onMounted, ref } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */
import Swal from "sweetalert2";

import {
  getStockCategory,
  getStockGeneric,
  getStockGroup,
  getSuppliers,
} from "@/api/master";
import Datepicker1 from "@/components/Datepicker1.vue";
import { useStore } from "vuex";

const optionList = ref([]);
const optionList2 = ref([]);
const optionList3 = ref([]);
const optionList4 = ref([]);
const optionList5 = ref([]);

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

/**
 * 선택한 매출 시작일자
 */

const cond = ref(0);
const cond2 = ref("");
const cond3 = ref("");
const cond4 = ref("0");
const cond5 = ref("0");
const cond6 = ref("0");
const cond7 = ref("0");
const cond8 = ref(false);

const store = useStore();

const datepicker = ref(null);
const closePopUp = ref(false);
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
const searchButton = async () => {
  if (selectedStore.value == "0") {
    Swal.fire({
      title: "경고",
      text: "매장을 먼저 선택해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }

  if (cond.value == "0") {
    Swal.fire({
      title: "경고",
      text: "파트를 먼저 선택해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }
  try {
    initGrid();

    store.state.loading = true;
    const res = await getStockTakeCountListbyPart(
      store.state.userData.lngStoreGroup,
      selectedStore.value,
      sdate.value.replaceAll("-", ""),
      1,
      5,
      cond8.value == true ? "02" : "01",
      cond.value
    );
    console.log(res);
    rowData.value = res.data.List;
    updatedrowdata.value = res.data.List;
    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    //comsole.log(error);
  } finally {
    store.state.loading = false;
  }
};

/* 매장 컴포넌트 관련 함수 */

const selectedStore = ref(0);

const selectedWeekDay = ref("");

/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
  //   const res = await getCommonList("07");

  //   optionList.value = res.data.List;

  const res4 = await getSuppliers(store.state.userData.lngStoreGroup);

  optionList2.value = res4.data.List;

  const res = await getStockGroup(store.state.userData.lngStoreGroup);

  optionList3.value = res.data.List;

  const res5 = await getStockCategory(store.state.userData.lngStoreGroup);

  optionList4.value = res5.data.List;

  const res6 = await getStockGeneric(store.state.userData.lngStoreGroup);

  optionList5.value = res6.data.List;

  //comsole.log(weekDay.value);
});

const saveButton = async () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
  }
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
    const updatedrows = updatedrowdata.value.filter((item, index) =>
      allstaterows.value.includes(index)
    );

    const res = await saveStockTakeCountByPart(
      "01",
      store.state.userData.lngStoreGroup,
      selectedStore.value,
      sdate.value.replaceAll("-", ""),
      updatedrows.map((item) => item.lngStockID).join("\u200b"),
      updatedrows.map((item) => item.dblTakeQty).join("\u200b"),
      5,
      cond.value
    );
    //console.log(res);

    if (res.data.RESULT_CD != "00") {
      Swal.fire({
        title: "실패",
        text: `${res.data.RESULT_NM}`,
        icon: "error",

        confirmButtonText: "확인",
      });
    } else {
      Swal.fire({
        title: "성공",
        text: `저장하였습니다.`,
        icon: "success",

        confirmButtonText: "확인",
      });
    }
  } catch (error) {
  } finally {
    searchButton();
  }
};

/**
 * 그리드 초기화
 */

const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
};

//엑셀 버튼 처리 함수
const exportExcel = ref(false);
/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  documentSubTitle.value =
    selectedExcelDate.value + "\n" + selectedExcelStore.value;
  //comsole.log(documentSubTitle.value); // 맑음 소스 pickStorePlural.vue 소스의 excelStore 받아야 함.
  // 엑셀 기능 실행
  exportExcel.value = !exportExcel.value;
};

// 엑셀 추출
const documentSubTitle = ref("");
const selectedExcelDate = ref("");
/**
 * 엑셀용 일자 세팅 함수
 */

const excelDate = (e) => {
  selectedExcelDate.value = e;
  //comsole.log(e);
};

const lngStoreCode = async (e) => {
  selectedStore.value = e;
  const res2 = await getLossMasterPartList(
    store.state.userData.lngStoreGroup,
    selectedStore.value
  );

  optionList.value = res2.data.List;
  afterSearch.value = false;
};
const selectedExcelStore = ref("");
/**
 * 엑셀용 매장 세팅 함수
 */

const excelStore = (e) => {
  selectedExcelStore.value = e;
  //comsole.log(e);
};

const sdate = ref("");
const dateValue = (e) => {
  sdate.value = e;
  console.log(e);
};

const updatedrowdata = ref([]);
const updatedRowData = (e) => {
  console.log(e);
  updatedrowdata.value = e;
};

const allstaterows = ref([]);
const allStateRows = (e) => {
  allstaterows.value = e.updated;
};

const setCond = (e) => {
  cond.value = e.target.value;
  afterSearch.value = false;
};

const deleteButton = async () => {
  const result = updatedrowdata.value.filter((item) => item.lngCheck == true);

  if (result.length == 0) {
    Swal.fire({
      title: "경고",
      text: `삭제할 대상을 선택해주세요.`,
      icon: "warning",

      confirmButtonText: "확인",
    });
  }

  try {
    const stockids = result.map((item) => item.lngStockID).join("\u200b");
    const res = await deleteStockTakeByPart(
      store.state.userData.lngStoreGroup,
      selectedStore.value,
      sdate.value.replaceAll("-", ""),
      stockids,
      cond.value
    );

    if (res.data.RESULT_CD != "00") {
      await Swal.fire({
        title: "실패",
        text: `삭제에 실패하였습니다.`,
        icon: "error",

        confirmButtonText: "확인",
      });
    } else {
      await Swal.fire({
        title: "성공",
        text: `삭제 완료하였습니다.`,
        icon: "success",

        confirmButtonText: "확인",
      });
    }
  } catch (error) {
  } finally {
    searchButton();
  }
};

const open = ref(false);
const uploadButton = () => {
  open.value = true;
};
</script>
