<!-- /*--############################################################################
# Filename : SLS11_024RPT.vue                                                  
# Description : 매출관리 > 분류별 매출 현황 > 주문구분 현황.           
# Date :2025-07-21                                                            
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
      class="grid grid-cols-2 grid-rows-4 justify-between bg-gray-200 rounded-lg h-40 items-start z-10 pb-3">
      <div class="">
        <Datepicker2
          @endDate="endDate"
          @startDate="startDate"
          :closePopUp="closePopUp"
          ref="datepicker"
          class=""
          :mainName="'일자'"
          @excelDate="excelDate"
          :initToday="0"></Datepicker2>
      </div>
      <div class="">
        <PickStorePlural
          @lngStoreCodes="lngStoreCodes"
          @lngStoreGroup="lngStoreGroup"
          @excelStore="excelStore"
          @changeInit="changeInit">
        </PickStorePlural>
      </div>
      <div class="flex justify-start ml-5 mt-5 space-x-5 col-span-4">
        <div class="text-base font-semibold">거래구분</div>
        <div class="w-[15%]">
          <select name="" id="" class="w-full" v-model="cond">
            <option value="0">전체</option>
            <option :value="i.strDCode" v-for="i in optionList">
              {{ i.strDName }}
            </option>
          </select>
        </div>

        <div class="text-base font-semibold pl-6">결재구분</div>
        <div class="w-[15%]">
          <select name="" id="" class="w-full" v-model="cond2">
            <option value="0">전체</option>
            <option :value="i.strDCode" v-for="i in optionList2">
              {{ i.strDName }}
            </option>
          </select>
        </div>
      </div>

      <div class="flex justify-start ml-5 mt-5 space-x-5 col-span-4">
        <div class="text-base font-semibold">매출구분</div>
        <div class="w-[15%]">
          <select name="" id="" class="w-full" v-model="cond3">
            <option value="9">전체</option>
            <option :value="i.strDCode" v-for="i in optionList3">
              {{ i.strDName }}
            </option>
          </select>
        </div>

        <div class="text-base font-semibold pl-2">상품권번호</div>
        <div class="w-[15%]">
          <input type="text" class="w-full" v-model="cond4" />
        </div>

        <div class="text-base font-semibold">회수구분</div>
        <div class="w-[15%]">
          <select name="" id="" class="w-full" v-model="cond5">
            <option :value="i.intCardLen" v-for="i in optionList7">
              {{ i.strNameE }}
            </option>
          </select>
        </div>
      </div>
      <div class="flex justify-start ml-12 pl-1 mt-5 space-x-5 col-span-4">
        <div class="text-base font-semibold">권종</div>
        <div class="w-[15%]">
          <select name="" id="" class="w-full" v-model="cond6">
            <option value="0">전체</option>
            <option :value="i.strDCode" v-for="i in optionList5">
              {{ i.strDName }}
            </option>
          </select>
        </div>

        <div class="text-base font-semibold -pl-1">할인명(차수)</div>
        <div class="w-[15%]">
          <select name="" id="" class="w-full" v-model="cond7">
            <option value="0">전체</option>
            <option :value="i.strDCode" v-for="i in optionList6">
              {{ i.strDName }}
            </option>
          </select>
        </div>

        <div class="text-base font-semibold pl-1">관리주체</div>
        <div class="w-[15%]">
          <select name="" id="" class="w-full" v-model="cond8">
            <option value="0">전체</option>
            <option :value="i.strDCode" v-for="i in optionList4">
              {{ i.strDName }}
            </option>
          </select>
        </div>
      </div>
    </div>
    <!-- 조회 조건 -->
    <!--그리드 영역 -->
    <div class="w-full h-[70vh]">
      <Realgrid
        :progname="'SLS12_002RPT_M_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :setFooter="true"
        :documentTitle="'SLS12_002RPT'"
        :documentSubTitle="documentSubTitle"
        :exporttoExcel="exportExcel"
        :rowStateeditable="false">
      </Realgrid>
    </div>
  </div>
  <!--그리드 영역 -->
</template>

<script setup>
import { getCommonList } from "@/api/common";
import { getGftCardTranDetailList, getGftCardTypeList } from "@/api/misales";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

import Datepicker2 from "@/components/Datepicker2.vue";
/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
import PickStorePlural from "@/components/pickStorePlural.vue";
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
const cond2 = ref(0);
const cond3 = ref(9);
const cond4 = ref("");
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
const optionList4 = ref([]);
const optionList5 = ref([]);
const optionList6 = ref([]);

const optionList7 = ref([]);
onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getCommonList(993);

  optionList.value = res.data.List;
  const res2 = await getCommonList(994);
  optionList2.value = res2.data.List;
  const res3 = await getCommonList(995);
  optionList3.value = res3.data.List;
  const res4 = await getCommonList(996);
  optionList4.value = res4.data.List;

  const res5 = await getCommonList(210);
  optionList5.value = res5.data.List;
  const res6 = await getCommonList(211);
  optionList6.value = res6.data.List;
  ////console.log(formattedDate.value);

  const res7 = await getGftCardTypeList(store.state.userData.lngStoreGroup);
  console.log(res7);
  optionList7.value = res7.data.List;

  if (optionList7.value.length > 0) {
    cond5.value = optionList7.value[0].intCardLen;
  }
});

/**
 *  조회 함수
 */

const filteredrowData = ref([]);
const searchButton = async () => {
  store.state.loading = true;
  try {
    initGrid();

    const res = await getGftCardTranDetailList(
      selectedGroup.value,
      selectedStores.value,
      selectedstartDate.value.replaceAll("-", ""),
      selectedendDate.value.replaceAll("-", ""),
      cond.value,
      cond2.value,
      cond3.value,
      cond4.value,
      cond5.value,
      cond6.value,
      cond7.value,
      cond8.value
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
  console.log(e);
};

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

  if (rowData2.value.length > 0) {
    rowData2.value = [];
  }
  if (filteredrowData.value.length > 0) {
    filteredrowData.value = [];
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
