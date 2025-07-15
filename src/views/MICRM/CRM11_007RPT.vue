<!-- /*--############################################################################
# Filename : CRM11_007RPT.vue                                                  
# Description : 고객관리 > 프로모션 관리 > 문자전송조회                      
# Date :2025-06-25                                                             
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
      class="grid grid-cols-2 grid-rows-3 bg-gray-200 rounded-lg h-36 items-start z-10">
      <div class="justify-start flex items-center">
        <div class="z-[60] pl-2 mt-2">
          <select
            name=""
            id=""
            class="w-20 h-8 border border-black"
            v-model="cond">
            <option value="0">요청일자</option>
            <option value="1">응답일자</option>
          </select>
        </div>
        <Datepicker2
          :mainName="'기간'"
          @endDate="endDate"
          class="-ml-9"
          ref="datepicker"
          :closePopUp="closePopUp"
          @excelDate="excelDate"
          @startDate="startDate">
        </Datepicker2>
      </div>
      <div class="ml-5 justify-start flex">
        <PickStoreSingle
          @lngStoreGroup="lngStoreGroup"
          @lngStoreAttrs="lngStoreAttrs"
          @lngStoreCode="lngStoreCode"
          @lngSupervisor="lngSupervisor"
          @lngStoreTeam="lngTeamCode"
          @excelStore="excelStore"></PickStoreSingle>
      </div>
      <div
        class="flex justify-start pl-12 space-x-5 mt-2 items-center col-span-2">
        <div class="text-base font-semibold">수신 번호</div>
        <div>
          <input
            type="number"
            class="w-32 h-8 border border-black"
            v-model="cond2" />
        </div>

        <div class="text-base font-semibold">발신 번호</div>
        <div>
          <input
            type="number"
            class="w-32 h-8 border border-black"
            v-model="cond3" />
        </div>
      </div>
      <div class="flex justify-start pl-12 space-x-5 items-center">
        <div class="text-base font-semibold">전송 결과</div>
        <div>
          <select
            name=""
            id=""
            class="w-32 h-8 border border-black"
            v-model="cond4">
            <option value="1">성공</option>
            <option value="2">실패</option>
          </select>
        </div>
      </div>
      <div class="flex justify-start pl-3 space-x-5 items-center">
        <div class="text-base font-semibold">SMS 유형</div>
        <div>
          <select
            name=""
            id=""
            class="w-32 h-8 border border-black"
            v-model="cond5">
            <option value="0">전체</option>
            <option value="1">SMS</option>
            <option value="2">LMS</option>
            <option value="3">MMS</option>
          </select>
        </div>
      </div>
    </div>
    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="w-full h-[70vh]">
      <div class="w-full h-[90%]">
        <Realgrid
          :progname="'CRM11_007RPT_VUE'"
          :progid="1"
          :rowData="rowData"
          :reload="reload"
          :setFooterCustomColumnId="['strName']"
          :setFooterCustomText="['합계']"
          :setFooter="true"
          :setGroupFooter="true"
          :setGroupColumnId="'strName'"
          :hideColumnsId="hideColumnsId"
          :documentTitle="'CRM11_007RPT'"
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
import { getCustBuyList, getSMSSendList } from "@/api/micrm";
import Datepicker2 from "@/components/Datepicker2.vue";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
import PickStoreSingle from "@/components/pickStoreSingle.vue";
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
import Swal from "sweetalert2";
/**
 *  경고창 호출 라이브러리
 *  */

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

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

const rowData2 = ref([]);
const rowData3 = ref([]);
const rowData4 = ref([]);
const condValue = ref(0);
const store = useStore();
const cond = ref(0);
const cond2 = ref("");
const cond3 = ref("");
const cond4 = ref(1);
const cond5 = ref(0);
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

const sDate = ref();
const eDate = ref();
const startDate = (e) => {
  initGrid();
  sDate.value = e;
};
const endDate = (e) => {
  eDate.value = e;
};

const selectedDate = ref();
const excelDate = (e) => {
  selectedDate.value = e;
};

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
  storeCode.value = e;
  initGrid();
};

const storeAttr = ref();
const lngStoreAttrs = (e) => {
  storeAttr.value = e;
};

const groupCd = ref();
const lngStoreGroup = (e) => {
  groupCd.value = e;
};
/**
 *  조회 함수
 */
const hideColumnsId = ref([]);
const searchButton = async () => {
  if (
    sDate.value.split("-")[0] + sDate.value.split("-")[1] !==
    eDate.value.split("-")[0] + eDate.value.split("-")[1]
  ) {
    Swal.fire({
      title: "경고",
      text: "시작년월과 종료년월이 같아야합니다. ",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  const strYM = sDate.value.split("-")[0] + sDate.value.split("-")[1];
  try {
    store.state.loading = true;
    initGrid();

    const res = await getSMSSendList(
      groupCd.value,
      storeCode.value,
      storeAttr.value,
      teamcode.value,
      supervisor.value,
      strYM,
      cond.value,
      sDate.value,
      eDate.value,
      cond2.value,
      cond4.value,
      cond5.value,
      cond3.value
    );

    rowData.value = res.data.List;
    console.log(res);
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
  documentSubTitle.value = selectedDate.value + "\n" + selectedExcelStore.value;

  //documentSubTitle.value += "\n";
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
