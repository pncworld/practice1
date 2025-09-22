<!-- /*--############################################################################
# Filename : HR02_003INS.vue                                                   
# Description : 인사관리 > 근태 관리 > 급여확정                           
# Date :2025-09-09                                                              
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
        <button @click="saveButton" class="button save w-auto">근태확정</button>
        <button @click="cancelButton" class="button save w-auto">
          확정취소
        </button>

        <button @click="excelButton" class="button save w-auto">엑셀</button>
      </div>
    </div>
    <div
      class="grid grid-cols-4 grid-rows-1 bg-gray-200 rounded-lg h-16 items-center z-10 justify-center">
      <div class="ml-12">
        <PickStoreRenew
          @storeNm="storeNm"
          @lngStoreGroup="lngStoreGroup"
          @lngStoreCode="lngStoreCode"></PickStoreRenew>
      </div>
      <div class="flex space-x-5 text-nowrap items-center ml-48">
        <div class="font-semibold text-base">해당월</div>
        <div>
          <select
            name=""
            id=""
            class="w-32 h-8 border border-black"
            v-model="cond">
            <option value="2030">2030</option>
            <option value="2029">2029</option>
            <option value="2028">2028</option>
            <option value="2027">2027</option>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
            <option value="2020">2020</option>
          </select>
        </div>
        <div>
          <select
            name=""
            id=""
            class="w-14 h-8 border border-black"
            v-model="cond2">
            <option value="01">1</option>
            <option value="02">2</option>
            <option value="03">3</option>
            <option value="04">4</option>
            <option value="05">5</option>
            <option value="06">6</option>
            <option value="07">7</option>
            <option value="08">8</option>
            <option value="09">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
          </select>
        </div>
      </div>
      <div class="flex items-center space-x-5 ml-28">
        <div class="font-semibold text-base">사원 구분</div>
        <select
          name=""
          id=""
          class="border border-black w-48 h-8"
          v-model="cond3">
          <option value="0">전체</option>
          <option value="1">정직원</option>
          <option value="2">PT</option>
        </select>
      </div>
      <div class="flex items-center space-x-5">
        <div class="font-semibold text-base">사원명/사원코드</div>
        <div>
          <input
            type="text"
            class="border border-black h-8 w-48"
            v-model="cond4" />
        </div>
      </div>
    </div>
    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="h-[75vh] flex justify-center mt-2">
      <Realgrid
        :progname="'HR02_003INS_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :mergeColumnGroupName2="['근태', '수당', '공제']"
        :mergeColumnGroupSubList2="[
          [
            'strSTime',
            'strRealTime',
            'strWHTime',
            'strWTime',
            'strPayWTime',
            'strOTime',
            'strNTime',
            'strHTime',
            'lngHDate',
          ],
          ['G16', 'G17', 'G18', 'G19', 'G20', 'G21', 'G22', 'G23', 'G24'],
          ['G34', 'G35', 'G36', 'G37', 'G38', 'G39', 'G40', 'G41'],
        ]"
        :mergeColumns2="true"
        :setDynamicGrid6="true"
        :fixedColumn="true"
        :documentTitle="'HR02_003INS'"
        :documentSubTitle="documentSubTitle"
        :exporttoExcel="exporttoExcel"
        :setDynamicGrid6Cond="setDynamicGrid6Cond">
      </Realgrid>
    </div>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import {
  cancelWorkConfirm,
  getEmpPayList,
  setFinalWorkConfirm,
} from "@/api/mihr";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
import PickStoreRenew from "@/components/pickStoreRenew.vue";
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

import { useStore } from "vuex";
/**
 * 	화면 Load시 실행 스크립트
 */

const setDynamicGrid6Cond = ref("");
onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  setDynamicGrid6Cond.value = store.state.userData.lngStoreGroup;

  cond.value = formatLocalDate(new Date()).split("-")[0];
  cond2.value = formatLocalDate(new Date()).split("-")[1];
});

const reload = ref(false);
const rowData = ref([]);
const rowData2 = ref([]);
const filteredrowData2 = ref([]);
const rowData3 = ref([]);
const afterSearch = ref(false);
const clickedRow = ref(false);
const clickedLngCode = ref();

const updatedRow = ref([]);

const updatedRow2 = ref([]);

const rowData1State = ref([]);
const allStateRows = (e) => {
  ////console.log(e);
  rowData1State.value = e;

  ////console.log(rowData1State.value);
};
const cond = ref("");
const cond2 = ref("");
const cond3 = ref("0");
const cond4 = ref("");
const TimeArray = ref([]);
const store = useStore();
const status = ref(99);
const datepicker = ref(null);
const closePopUp = ref(false);
const custId = ref("");

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
  if (selectedStores.value == 0) {
    Swal.fire({
      title: "경고",
      text: "매장명을 먼저 선택하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  try {
    store.state.loading = true;
    initGrid();

    const res = await getEmpPayList(
      selectedGroup.value,
      selectedStores.value,
      cond.value + "-" + cond2.value + "-01",
      cond3.value,
      cond4.value,
      0,
      store.state.userData.lngUserAdminID
    );
    console.log(res);
    rowData.value = res.data.List2;
    const list3 = res.data.List3;
    const columnindex = res.data.List;
    for (let i = 0; i < list3.length; i++) {
      const fintindex = columnindex.findIndex(
        (item) => item.lngCode == list3[i].lngPayItemCode
      );

      let total = 0;
      for (var j = 0; j < parseInt(list3[i].lngPayItemCls); j++) {
        if (list3[i].lngPayItemCode != "0") {
          total += columnindex.filter(
            (item) => item.lngItemCls == j + 1
          ).length;
        }
      }

      //console.log((parseInt(list3[i].lngPayItemCls) - 1) * 10 + 16 + total);
      if (fintindex != -1) {
        const findit = rowData.value.find(
          (item) => item.lngCharger == list3[i].lngCharger
        );
        findit[
          "G" + ((parseInt(list3[i].lngPayItemCls) - 1) * 10 + fintindex + 16)
        ] = list3[i].lngPayAmt;
      } else if (fintindex == -1 && list3[i].lngPayItemCls == "0") {
        const findit = rowData.value.find(
          (item) => item.lngCharger == list3[i].lngCharger
        );
        findit["G50"] = list3[i].lngPayAmt;
      } else {
        const findit = rowData.value.find(
          (item) => item.lngCharger == list3[i].lngCharger
        );
        findit[
          "G" + ((parseInt(list3[i].lngPayItemCls) - 1) * 10 + 16 + total)
        ] = list3[i].lngPayAmt;
      }
    }
    rowData.value = [...rowData.value];
    console.log(rowData.value);
    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    //comsole.log(error);
  } finally {
    store.state.loading = false;
  }
};

const saveButton = async (e) => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  try {
    store.state.loading = true;

    const res = await setFinalWorkConfirm(
      selectedGroup.value,
      selectedStores.value,
      cond.value + "-" + cond2.value + "-01"
    );

    console.log(res);

    if (res.data.RESULT_CD == "00") {
      await Swal.fire({
        title: "성공",
        text: "근태확정이 되었습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
    } else {
      await Swal.fire({
        title: "실패",
        text: `${res.data.RESULT_NM}`,
        icon: "warning",
        confirmButtonText: "확인",
      });
    }
    store.state.loading = false;
  } catch (error) {
  } finally {
    store.state.loading = false;
    searchButton();
  }
};

const cancelButton = async (e) => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  try {
    store.state.loading = true;

    const res = await cancelWorkConfirm(
      selectedGroup.value,
      selectedStores.value,
      cond.value + "-" + cond2.value + "-01"
    );

    console.log(res);

    if (res.data.RESULT_CD == "00") {
      await Swal.fire({
        title: "성공",
        text: "근태취소가 완료 되었습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
    } else {
      await Swal.fire({
        title: "실패",
        text: `${res.data.RESULT_NM}`,
        icon: "warning",
        confirmButtonText: "확인",
      });
    }
    store.state.loading = false;
  } catch (error) {
  } finally {
    store.state.loading = false;
    searchButton();
  }
};

/* 매장 컴포넌트 관련 함수 */
const selectedGroup = ref();
const selectedStores = ref();
const selectedStoreNm = ref();

/**
 * 페이지 매장 코드 세팅
 */

const lngStoreCode = async (e) => {
  initGrid();
  selectedStores.value = e;
  ////console.log(e);
};
const lngStoreGroup = async (e) => {
  //initGrid();
  selectedGroup.value = e;
  setDynamicGrid6Cond.value = store.state.userData.lngStoreGroup;
  ////console.log(e);
};
const storeNm = (e) => {
  selectedStoreNm.value = e;
  ////console.log(e);
};
/**
 * 그리드 초기화
 */

const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
  if (rowData2.value.length > 0) {
    rowData2.value = [];
  }
  if (rowData3.value.length > 0) {
    rowData3.value = [];
  }
  if (filteredrowData2.value.length > 0) {
    filteredrowData2.value = [];
  }

  afterSearch.value = false;
};

const exporttoExcel = ref(false);
const documentSubTitle = ref("");
const excelButton = () => {
  documentSubTitle.value =
    "매장명 : " +
    selectedStoreNm.value +
    "\n" +
    "년월 :" +
    cond.value +
    "-" +
    cond2.value;
  exporttoExcel.value = !exporttoExcel.value;
};
</script>
