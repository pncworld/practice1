<!-- /*--############################################################################
# Filename : SLS04_023RPT.vue                                                  
# Description : 매출관리 > 메뉴별 매출 현황 > 메뉴엔지니어링           
# Date :2025-07-22                                                            
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <!-- 조회 조건 -->
  <div class="h-full" @click="handleParentClick">
    <div class="flex justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center mr-9 space-x-2 pr-5">
        <button @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <button @click="excelButton" class="button save w-auto excel">
          엑셀
        </button>
      </div>
    </div>
    <div
      class="grid grid-cols-3 grid-rows-2 justify-between bg-gray-200 rounded-lg h-28 items-start z-10">
      <div class="">
        <Datepicker2
          @endDate="endDate"
          @startDate="startDate"
          :closePopUp="closePopUp"
          ref="datepicker"
          class="ml-7"
          :mainName="'기간'"
          @excelDate="excelDate"
          :initToday="1"
          :initToday3="true"></Datepicker2>
      </div>
      <div class="">
        <PickStoreRenew
          @lngStoreCode="lngStoreCodes"
          @lngStoreGroup="lngStoreGroup"
          @excelStore="excelStore"
          @changeInit="changeInit">
        </PickStoreRenew>
      </div>
      <div></div>
      <div
        class="flex justify-start items-center text-base text-nowrap font-semibold ml-12 space-x-5">
        메뉴구분
        <div class="flex space-x-5 ml-5">
          <select name="" id="" class="w-48 h-8" v-model="cond">
            <option value="0">전체</option>
            <option value="1">대그룹</option>
            <option value="2">서브그룹</option>
            <option value="3">메뉴코드</option>
          </select>

          <select name="" id="" class="w-48 h-8" v-model="cond2">
            <option :value="i.lngCode" v-for="i in optionList">
              {{ i.strName }}
            </option>
          </select>
        </div>
      </div>
      <div class="flex items-center justify-start text-base font-bold ml-2">
        <div>ABC</div>
        <select name="" id="" class="w-28 h-8 ml-5" v-model="cond3">
          <option value="0">전체</option>
          <option value="1">A</option>
          <option value="2">B</option>
          <option value="3">C</option>
        </select>
      </div>
      <div class="flex items-center justify-center text-base font-bold">
        <div>평가</div>
        <select name="" id="" class="w-28 h-8 ml-5" v-model="cond4">
          <option value="0">전체</option>
          <option value="1">Star</option>
          <option value="2">Plow Horse</option>
          <option value="3">Puzzle</option>
          <option value="4">Dog</option>
        </select>
      </div>
    </div>
    <!-- 조회 조건 -->
    <!--그리드 영역 -->
    <div class="w-full h-[70vh] grid-rows-2 grid-cols-1">
      <Realgrid
        :progname="'SLS04_023RPT_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :setGroupCustomLevel="2"
        :mergeColumns2="true"
        :mergeColumnGroupName2="[['기본단가 기준']]"
        :mergeColumnGroupSubList2="[['lngPrice', 'oriFloCostRate']]"
        :documentTitle="'SLS04_023RPT'"
        :documentSubTitle="documentSubTitle"
        :exporttoExcel="exportExcel"
        :rowStateeditable="false">
      </Realgrid>
    </div>
  </div>
  <!--그리드 영역 -->
</template>

<script setup>
import { getMenuDistinct, getMenuEngineer } from "@/api/misales";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

import Datepicker2 from "@/components/Datepicker2.vue";
/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
import PickStoreRenew from "@/components/pickStoreRenew.vue";
/**
 *  매장  단일 선택 컴포넌트
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

import { onMounted, ref, watch } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";

const reload = ref(false);
const rowData = ref([]);
const rowData2 = ref([]);
const afterSearch = ref(false);
const selectedstartDate = ref();
const selectedendDate = ref();
const cond = ref(0);
const cond2 = ref(0);
const cond3 = ref(0);
const cond4 = ref(0);
const optionList = ref([{ lngCode: 0, strName: "전체" }]);
const setGroupColumnId = ref("");

/**
 * 선택한 매출 시작일자
 */

const startDate = (e) => {
  //comsole.log(e);
  selectedstartDate.value = e;
};
/**
 * 선택한 매출 종료일자
 */

const endDate = (e) => {
  selectedendDate.value = e;
};

const setGroupFooter = ref(true);

const store = useStore();
const clickedRowData = (e) => {
  // //console.log(e);

  filteredrowData.value = rowData.value.filter((item) =>
    item.strStoreName.includes(e[0])
  );
};
/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  ////console.log(formattedDate.value);
});

/**
 *  조회 함수
 */

const filteredrowData = ref([]);
const searchButton = async () => {
  store.state.loading = true;
  try {
    initGrid();

    reload.value = !reload.value;

    const res = await getMenuEngineer(
      selectedGroup.value,
      selectedstartDate.value,
      selectedendDate.value,
      cond.value,
      cond2.value,
      cond3.value,
      cond4.value
    );
    //console.log(res);

    rowData.value = res.data.List;

    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
  } finally {
    store.state.loading = false;
  }
};

const selectedGroup = ref();
const selectedStores = ref();

/**
 * 페이지 매장 그룹 세팅
 */

const lngStoreGroup = (e) => {
  //comsole.log(e);
  selectedGroup.value = e;
};
/**
 * 페이지 매장 코드 세팅
 */

const lngStoreCodes = (e) => {
  selectedStores.value = e;
  //comsole.log(e);
};

watch(cond, async () => {
  const res = await getMenuDistinct(
    store.state.userData.lngStoreGroup,
    0,
    cond.value
  );
  //console.log(res);
  optionList.value = res.data.List;

  if (optionList.value.length == 0) {
    optionList.value = [{ lngCode: 0, strName: "전체" }];
  }
  cond2.value = 0;
});
/**
 * 페이지 매장 분류 세팅
 */

/**
 * 페이지 매장 슈퍼바이저 세팅
 */

/**
 * 그리드 초기화
 */

const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
};

const exportExcel = ref(false);

//comsole.log(store.state.minorCategory);

/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  documentSubTitle.value =
    selectedExcelDate.value + "\n" + selectedExcelStore.value + "\n";

  exportExcel.value = !exportExcel.value;
};

const datepicker = ref(null);
const closePopUp = ref(false);
/**
 * 매출 일자 안 라디오박스 닫기 위한 외부 클릭 감지 함수
 */

const handleParentClick = (e) => {
  if (e.target && e.target.type === "checkbox") {
    return;
  }
  const datepickerEl = datepicker.value?.$el;

  if (datepickerEl && datepickerEl.contains(e.target)) {
    return;
  }
  closePopUp.value = !closePopUp.value;
};
const documentSubTitle = ref("");
const selectedExcelDate = ref("");
/**
 * 엑셀용 일자 세팅 함수
 */

const excelDate = (e) => {
  selectedExcelDate.value = e;
};
const selectedExcelStore = ref("");
/**
 * 엑셀용 매장 세팅 함수
 */

const excelStore = (e) => {
  selectedExcelStore.value = e;
};

/**
 *  컴포넌트 변동시 감지 함수
 */

const changeInit = (e) => {
  initGrid();
};
</script>

<style></style>
