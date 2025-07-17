/*--############################################################################
# Filename : CRM20_002RPT.vue                                                  
# Description : 고객관리 > 고객 실적 관리 > 고객 실적 조회                      
# Date :2025-06-12                                                             
# Author : 권맑음                     
################################################################################*/
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
      class="grid grid-cols-2 grid-rows-2 bg-gray-200 rounded-lg h-24 items-center z-10">
      <div class="justify-start flex">
        <Datepicker2
          :mainName="'기간'"
          @endDate="endDate"
          ref="datepicker"
          :closePopUp="closePopUp"
          @excelDate="excelDate"
          @startDate="startDate">
        </Datepicker2>
        <div class="items-center space-x-5 flex justify-start ml-20">
          <label for="cond"
            ><input
              type="checkbox"
              id="cond"
              name="condtype"
              @change="cond = !cond"
              v-model="cond" />전체기간</label
          >
          <label for="cond2"
            ><input
              type="checkbox"
              id="cond2"
              name="condtype"
              @change="cond = !cond"
              v-model="cond2" />집계내역</label
          >
        </div>
      </div>
      <div class="ml-5 justify-start flex">
        <PickCustomers
          @Name="Name"
          @ID="ID"
          @CustId="CustId"
          @excelList="excelList"></PickCustomers>
      </div>
      <div class="flex justify-start font-semibold text-base ml-1">
        <div>누적포인트</div>
        <div>
          <input
            type="text"
            class="pl-1 disabled:bg-white ml-5"
            disabled
            v-model="point1" />
        </div>
        <div class="ml-5">사용포인트</div>
        <div>
          <input
            type="text"
            class="pl-1 disabled:bg-white ml-5"
            disabled
            v-model="point2" />
        </div>
      </div>

      <div class="flex justify-start items-center -ml-2">
        <div class="text-base font-semibold">잔여포인트</div>
        <div>
          <input
            type="text"
            class="pl-1 ml-5 disabled:bg-white"
            disabled
            v-model="point3" />
        </div>

        <div class="ml-5 font-semibold text-base">보너스포인트</div>
        <div>
          <input
            type="text"
            class="pl-1 ml-5 disabled:bg-white"
            disabled
            v-model="point4" />
        </div>
      </div>
    </div>
    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="grid grid-rows-1 grid-cols-[3fr,1fr] w-full h-[75vh]">
      <div class="w-full h-[80%]">
        <Realgrid
          :progname="'CRM02_002RPT_VUE'"
          :progid="1"
          :rowData="rowData"
          :reload="reload"
          :setFooterCustomColumnId="['strCCardID']"
          :setFooterCustomText="['합계']"
          :setFooter="true"
          :hideColumnsId="hideColumnsId"
          :documentTitle="'CRM02_002RPT'"
          @clickedRowData="clickedRowData"
          :documentSubTitle="documentSubTitle"
          :rowStateeditable="false"
          :exporttoExcel="exportExcel">
        </Realgrid>
      </div>
      <div
        class="grid grid-rows-[1fr,4fr,1fr,4fr,1fr,4fr] grid-cols-1 border border-black h-[80%]">
        <div class="flex justify-start items-center">※고객정보</div>
        <div class="h-full w-full">
          <Realgrid
            :progname="'CRM02_002RPT_VUE_Popup'"
            :progid="1"
            :rowData="rowData2"
            :rowStateeditable="false"
            :setStateBar="false"></Realgrid>
        </div>
        <div class="flex justify-start items-center">※주문내역</div>
        <div class="h-full w-full">
          <Realgrid
            :progname="'CRM02_002RPT_VUE_Popup'"
            :progid="2"
            :rowData="rowData3"
            :rowStateeditable="false"
            :setStateBar="false"></Realgrid>
        </div>
        <div class="flex justify-start items-center">※결재내역</div>
        <div class="h-full w-full">
          <Realgrid
            :progname="'CRM02_002RPT_VUE_Popup'"
            :progid="3"
            :rowData="rowData4"
            :rowStateeditable="false"
            :setStateBar="false"></Realgrid>
        </div>
      </div>
    </div>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import {
  getBelongCustList,
  getCustPointInfo,
  getCustRecord,
  getReceiptDataDetail2,
} from "@/api/micrm";
import Datepicker1 from "@/components/Datepicker1.vue";
import Datepicker2 from "@/components/Datepicker2.vue";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
import PickBelongCust from "@/components/pickBelongCust.vue";
import PickCustCompany from "@/components/pickCustCompany.vue";
import PickCustomers from "@/components/pickCustomers.vue";
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
});

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

const rowData2 = ref([]);
const rowData3 = ref([]);
const rowData4 = ref([]);
const condValue = ref(0);
const store = useStore();
const cond = ref(false);
const cond2 = ref(false);
const datepicker = ref(null);
const closePopUp = ref(false);

const point1 = ref();
const point2 = ref();
const point3 = ref();
const point4 = ref();

watch(cond2, () => {
  if (cond2.value == true) {
    hideColumnsId.value = ["dtmAddDate", "lngReceipt", "strReason"];
  } else {
    hideColumnsId.value = [];
  }
  initGrid();
});
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

const Name = (e) => {
  //console.log(e);
};
const searchNum = ref("");
const ID = (e) => {
  initGrid();
  searchNum.value = e;
};

const custID = ref();
const CustId = (e) => {
  custID.value = e;
};
const sDate = ref();
const eDate = ref();
const startDate = (e) => {
  sDate.value = e;
};
const endDate = (e) => {
  eDate.value = e;
};

const selectedDate = ref();
const excelDate = (e) => {
  selectedDate.value = e;
};
/**
 *  조회 함수
 */
const hideColumnsId = ref([]);
const searchButton = async () => {
  try {
    store.state.loading = true;
    initGrid();

    const res = await getCustRecord(
      store.state.userData.lngStoreGroup,
      searchNum.value,
      sDate.value,
      eDate.value,
      cond.value == true ? 1 : 0,
      cond2.value == true ? 1 : 0
    );
    if (custID.value != "" && custID.value != undefined) {
      const res = await getCustPointInfo(
        store.state.userData.lngStoreGroup,
        custID.value
      );

      point1.value = res.data.List[0].lngSalePoint;
      point2.value = res.data.List[0].lngUsedPoint;
      point3.value = res.data.List[0].lngRemPoint;
      point4.value = res.data.List[0].lngBonusPoint;
    }
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

const clickedRowData = async (e) => {
  const res = await getReceiptDataDetail2(e[1], e[2], e[0]);
  //console.log(res);
  rowData2.value = res.data.List;
  rowData3.value = res.data.List2;
  rowData4.value = res.data.List3;
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
  if (rowData2.value.length > 0) {
    rowData2.value = [];
  }
  if (rowData3.value.length > 0) {
    rowData3.value = [];
  }
  if (rowData4.value.length > 0) {
    rowData4.value = [];
  }
  point1.value = "";
  point2.value = "";
  point3.value = "";
  point4.value = "";
};

//엑셀 버튼 처리 함수
const exportExcel = ref(false);
/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  documentSubTitle.value = selectedDate.value + "\n" + selectedExcelList.value;

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
