<!-- /*--############################################################################
# Filename : SLS14_043RPT.vue                                                  
# Description : 매출관리 > 기타 매출 현황 > 페이코 상세 현황           
# Date :2025-12-05                                                            
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
      class="grid grid-cols-2 grid-rows-2 justify-start bg-gray-200 rounded-lg h-24 items-center z-10 pb-3">
      <div class="">
        <Datepicker2
          @endDate="endDate"
          @startDate="startDate"
          :closePopUp="closePopUp"
          ref="datepicker"
          class=""
          :mainName="'기간'"
          @excelDate="excelDate"
          :initToday="0"></Datepicker2>
      </div>
      <div class="flex mt-5">
        <PickStorePlural
          @lngStoreCodes="lngStoreCode"
          @excelStore="excelStore"></PickStorePlural>
      </div>
      <div class="flex ml-12 space-x-5 mt-1">
        <div class="text-base font-semibold">결제구분</div>
        <div>
          <select name="" id="" class="w-48 h-7" v-model="cond">
            <option value="0">전체</option>
            <option :value="i.strDCode" v-for="i in optionList">
              {{ i.strDName }}
            </option>
          </select>
        </div>
        <div class="text-base font-semibold !pl-10">승인구분</div>

        <div>
          <label for="cond2"
            ><input
              type="radio"
              id="cond2"
              name="cond"
              v-model="cond2"
              value="1" />승인</label
          >
        </div>
        <div>
          <label for="cond3"
            ><input
              type="radio"
              id="cond3"
              name="cond"
              v-model="cond2"
              value="2" />취소</label
          >
        </div>
      </div>
    </div>
    <!-- 조회 조건 -->
    <!--그리드 영역 -->
    <div class="w-full h-[70vh]">
      <Realgrid
        :progname="'SLS14_043RPT_VUE'"
        :progid="1"
        :rowData="rowData"
        :documentTitle="'SLS14_043RPT'"
        :documentSubTitle="documentSubTitle"
        :setFooter="true"
        :exporttoExcel="exportExcel"
        :rowStateeditable="false">
      </Realgrid>
    </div>
  </div>
  <!--그리드 영역 -->
</template>

<script setup>
import { getCommonList } from "@/api/common";
import {
  getCouponTypeList,
  getMemberCouponDetail,
  getPayCoDetailList,
} from "@/api/misales";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

import Datepicker2 from "@/components/Datepicker2.vue";
/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
import PickStorePlural from "@/components/pickStorePlural.vue";
import PickStoreSingle from "@/components/pickStoreSingle.vue";
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

import { onMounted, ref } from "vue";
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
const cond2 = ref(1);
const cond3 = ref(0);
const cond4 = ref(0);
const cond5 = ref(0);
const cond6 = ref(0);
const cond7 = ref(0);
const cond8 = ref(0);
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

const optionList = ref([]);
const optionList2 = ref([]);
const optionList3 = ref([]);
const filteredOptionList = ref([]);
const filteredOptionList2 = ref([]);

const optionList7 = ref([]);
onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getCommonList(322);

  optionList.value = res.data.List;
});

/**
 *  조회 함수
 */

const filteredrowData = ref([]);
const searchButton = async () => {
  store.state.loading = true;
  try {
    initGrid();

    const res = await getPayCoDetailList(
      selectedGroup.value,
      selectedStore.value,
      selectedstartDate.value,
      selectedendDate.value,
      cond.value,
      cond2.value
    );
    console.log(res);
    rowData.value = res.data.List;

    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
  } finally {
    store.state.loading = false;
  }
};

const selectedGroup = ref(store.state.userData.lngStoreGroup);
const selectedStore = ref(0);

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
    selectedExcelDate.value + "\n" + selectedExcelStore.value;

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

const setFilteredList = (e) => {
  cond3.value = "0";
  cond4.value = "0";
  filteredOptionList2.value = [];
  if (e.target.value == "0") {
    filteredOptionList.value = optionList2.value;
    return;
  }

  filteredOptionList.value = optionList2.value.filter(
    (item) => item.lngCouponGroup == e.target.value
  );
};
const setFilteredList2 = (e) => {
  if (e.target.value == "0") {
    filteredOptionList2.value = optionList3.value;
    return;
  }
  filteredOptionList2.value = optionList3.value.filter(
    (item) => item.lngCouponType == e.target.value
  );
};

const lngStoreCode = (e) => {
  selectedStore.value = e;
};

const excelStore = (e) => {
  selectedExcelStore.value = e;
};
</script>

<style></style>
