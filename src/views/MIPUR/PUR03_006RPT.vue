<!-- /*--############################################################################
# Filename : PUR03_006RPT.vue                                                  
# Description : 구매관리2 > 반품 관리 > 조회유형별 반품현황                      
# Date :2025-08-28                                                             
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
        <button @click="excelButton" class="button save w-auto excel">
          엑셀
        </button>
      </div>
    </div>
    <div
      class="grid grid-cols-3 grid-rows-3 bg-gray-200 rounded-lg h-32 items-start z-10">
      <div class="justify-start flex">
        <Datepicker2
          :mainName="'선택일자'"
          @endDate="endDate"
          ref="datepicker"
          :initToday="1"
          :closePopUp="closePopUp"
          @excelDate="excelDate"
          @startDate="startDate">
        </Datepicker2>
      </div>
      <div class="flex justify-start items-center">
        <PickStore
          @update:storeGroup="lngStoreGroup"
          :defaultStoreNm="'전체'"
          :hideGroup="false"
          class="space-x-3"
          @storeNm="excelStore"
          @update:storeCd="lngStoreCode"></PickStore>
      </div>
      <div class="flex justify-start pl-16 items-center">
        <BusinessClient
          @SupplierId="SupplierId"
          :defaultNm="'전체'"></BusinessClient>
      </div>

      <div class="flex space-x-5 ml-20 mt-3 items-center">
        <div class="font-semibold text-base">단위</div>
        <div>
          <select name="" id="" class="w-64 h-7" v-model="cond">
            <option :value="i.strDCode" v-for="i in optionList">
              {{ i.strDName }}
            </option>
          </select>
        </div>
      </div>
      <div class="flex space-x-5 ml-12 mt-3 col-span-2 items-center">
        <div class="text-base font-semibold">자재명</div>
        <div>
          <select name="" id="" class="w-32 h-7" v-model="cond2">
            <option value="0">전체</option>
            <option value="1">분류</option>
            <option value="2">그룹</option>
            <option value="3">특성</option>
            <option value="4">재고조사주기</option>
          </select>
        </div>
        <div>
          <select name="" id="" class="w-32 h-7" v-model="cond3">
            <option value="0">전체</option>
            <option :value="i.strDCode" v-for="i in optionList2">
              {{ i.strDName }}
            </option>
          </select>
        </div>
        <div>
          <input type="text" class="w-56 h-7" v-model="cond4" />
        </div>
      </div>

      <div class="flex ml-12 items-center mt-3 space-x-5">
        <div class="text-base font-semibold">조회유형</div>
        <div class="flex space-x-4">
          <label for="cond51"
            ><input
              type="radio"
              v-model="cond5"
              id="cond51"
              value="0" />자재별</label
          >
          <label for="cond52"
            ><input type="radio" v-model="cond5" id="cond52" value="1" />일자별
            자재별</label
          >
          <label for="cond53"
            ><input type="radio" v-model="cond5" id="cond53" value="2" />매장별
            자재별</label
          >
        </div>
      </div>
    </div>
    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="w-full h-[75vh]">
      <div class="w-full h-[80%]">
        <Realgrid
          :progname="'PUR03_006RPT_VUE'"
          :progid="progid"
          :rowData="rowData"
          :reload="reload"
          :documentTitle="'PUR03_006RPT'"
          @clickedRowData="clickedRowData"
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
import { getCommonList } from "@/api/common";
import { getStockCategory, getStockGeneric, getStockGroup } from "@/api/master";
import { getOrderListByType, getReturnListByType } from "@/api/mipur";
import BusinessClient from "@/components/businessClient.vue";
import Datepicker2 from "@/components/Datepicker2.vue";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
import PickStore from "@/components/pickStore.vue";
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

  const res = await getCommonList(27);

  optionList.value = res.data.List.filter((item) => item.strDCode !== "01");
});

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

const cond = ref("02");
const cond2 = ref(0);
const cond3 = ref(0);
const cond4 = ref("");
const cond5 = ref(0);
const store = useStore();

const datepicker = ref(null);
const closePopUp = ref(false);
const optionList = ref([]);
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

const sDate = ref();
const eDate = ref();
const startDate = (e) => {
  initGrid();
  sDate.value = e;
};
const endDate = (e) => {
  initGrid();
  eDate.value = e;
};

const selectedDate = ref();
const excelDate = (e) => {
  selectedDate.value = e;
};
const optionList2 = ref([]);
watch(cond2, async () => {
  if (cond2.value == 1) {
    const res2 = await getStockCategory(store.state.userData.lngStoreGroup);

    optionList2.value = res2.data.List;

    optionList2.value = optionList2.value.map((item) => ({
      ...item,
      strDCode: item.lngCategoryID,
      strDName: item.strCategoryName,
    }));
  } else if (cond2.value == 2) {
    const res = await getStockGroup(store.state.userData.lngStoreGroup);

    optionList2.value = res.data.List;

    optionList2.value = optionList2.value.map((item) => ({
      ...item,
      strDCode: item.lngStockGroupID,
      strDName: item.strStockGroupName,
    }));
  } else if (cond2.value == 3) {
    const res3 = await getStockGeneric(store.state.userData.lngStoreGroup);

    optionList2.value = res3.data.List;

    optionList2.value = optionList2.value.map((item) => ({
      ...item,
      strDCode: item.lngGenericID,
      strDName: item.strGenericName,
    }));
  } else {
    optionList2.value = [];
  }
  ////console.log(optionList2.value);
  cond3.value = 0;
});

const teamcode = ref();
const lngTeamCode = (e) => {
  teamcode.value = e;
};
const supervisor = ref();
const lngSupervisor = (e) => {
  supervisor.value = e;
};
const storeCode = ref();
const lngStoreCode = (e) => {
  initGrid();
  storeCode.value = e;
};

const storeAttr = ref();
const lngStoreAttrs = (e) => {
  storeAttr.value = e;
};

const groupCd = ref();
const lngStoreGroup = (e) => {
  groupCd.value = e;
};

const supplierid = ref("");
const SupplierId = (e) => {
  supplierid.value = e;
};
/**
 *  조회 함수
 */
const hideColumnsId = ref([]);
const searchButton = async () => {
  try {
    store.state.loading = true;
    initGrid();

    const res = await getReturnListByType(
      groupCd.value,
      storeCode.value,
      sDate.value.replaceAll("-", ""),
      eDate.value.replaceAll("-", ""),
      supplierid.value,
      cond2.value,
      cond3.value,
      cond4.value,
      cond.value,
      0,
      cond5.value
    );

    rowData.value = res.data.List;
    //console.log(res);
    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    //comsole.log(error);
  } finally {
    store.state.loading = false;
  }
};

/**
 * 페이지 매장 코드 세팅
 */

/**
 * 그리드 초기화
 */

const progid = ref(1);
const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }

  if (cond5.value == 0) {
    progid.value = 1;
  } else if (cond5.value == 1) {
    progid.value = 2;
  } else if (cond5.value == 2) {
    progid.value = 3;
  }

  reload.value = !reload.value;
};

//엑셀 버튼 처리 함수
const exportExcel = ref(false);
/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  documentSubTitle.value =
    selectedDate.value + "\n" + "매장명 :" + selectedExcelStore.value;
  exportExcel.value = !exportExcel.value;
};

// 엑셀 추출
const documentSubTitle = ref("");
const selectedExcelList = ref("");

const selectedExcelStore = ref("");
/**
 * 엑셀용 매장 세팅 함수
 */

const excelStore = (e) => {
  selectedExcelStore.value = e;
  //comsole.log(e);
};
const excelList = (e) => {
  selectedExcelList.value = e;
  //comsole.log(e);
};
</script>
