<!-- /*--############################################################################
# Filename : PUR01_010RPT.vue                                                  
# Description : 구매관리2 > 발주 관리 > 조회유형별 발주현황                      
# Date :2025-08-26                                                             
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <!-- 조회조건 -->
  <div class="h-full" @click="handleParentClick">
    <div class="flex justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center mr-9 space-x-2 pr-5">
        <button @click="confirmButton" class="button primary w-24">
          발주 승인
        </button>
        <button @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <button @click="excelButton" class="button save w-auto excel">
          엑셀
        </button>
      </div>
    </div>
    <div
      class="grid grid-cols-3 grid-rows-1 bg-gray-200 rounded-lg h-16 items-start z-10">
      <div class="justify-start flex ml-12">
        <Datepicker1
          :mainName="'발주일자'"
          @dateValue="dateValue"
          ref="datepicker"
          :initToday="1"
          :closePopUp="closePopUp"
          @excelDate="excelDate">
        </Datepicker1>
      </div>
      <div class="flex justify-start items-center">
        <PickStore
          @update:storeGroup="lngStoreGroup"
          :defaultStoreNm="'전체'"
          :hideAttr="false"
          :hideGroup="false"
          :defaultStore="true"
          @storeNm="excelStore"
          :setDynamicStoreClass="'!h-8 !p-0'"
          @update:storeCd="lngStoreCode"></PickStore>
      </div>
      <div class="flex justify-start pl-3 items-center">
        <BusinessClient
          @SupplierId="SupplierId"
          :defaultNm="'전체'"></BusinessClient>
      </div>
    </div>
    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="w-full h-[75vh]">
      <div class="text-indigo-600 flex flex-col">
        <div>※전표번호를 더블클릭하시면 상세 주문내역 확인이 가능합니다.</div>
        <div>
          ※발주승인은 16시 마감이며, 발주승인 되지 않은 주문내역은 16시 이후에
          삭제 됩니다.(당일 발주일자 기준)
        </div>
      </div>
      <Realgrid
        :progname="'PUR01_034INS_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :setStateBar="false"
        :documentTitle="'PUR01_034INS'"
        @clickedButtonCol="clickedButtonCol"
        @clickedRowData="clickedRowData"
        @dblclickedRowData="dblclickedRowData"
        @updatedRowData="updatedRowData"
        :checkRenderEditable="true"
        :checkRowAuto="false"
        :checkRowAuto2="true"
        :checkRowAuto2Col="'Selected'"
        :checkAbleExpressionCol="'Selected'"
        :checkAbleExpressionCol2="'blnConfm'"
        :checkAbleExpressionVal="'1'"
        :checkAbleExpressionCol3="'blnConfm'"
        :checkAbleExpressionVal2="'0'"
        :documentSubTitle="documentSubTitle"
        :rowStateeditable="false"
        :exporttoExcel="exportExcel">
      </Realgrid>
    </div>
  </div>

  <div
    v-if="openPopUp"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white p-6 rounded-2xl shadow-xl w-[45vw] h-[65vh]">
      <div class="flex justify-between">
        <h2 class="text-xl font-bold mb-4">상세 주문내역</h2>
        <div class="flex space-x-5">
          <button class="whitebutton" @click="reFreshButton">새로고침</button>
          <button class="whitebutton" @click="openPopUp = false">닫기</button>
        </div>
      </div>
      <div class="grid grid-rows-4 grid-cols-[1fr,4fr,1fr,4fr] h-[20vh]">
        <div
          class="flex space-x-5 items-center border-l border-t border-black justify-center">
          매장
        </div>
        <div
          class="flex space-x-5 items-center border-l border-t border-black justify-start pl-2">
          <input
            type="text"
            class="border border-black w-[80%] disabled:bg-gray-300"
            v-model="scond"
            disabled />
        </div>
        <div
          class="flex space-x-5 items-center border-l border-t border-black justify-center">
          전표번호
        </div>
        <div
          class="flex space-x-5 items-center border-l border-t border-black justify-start pl-2 border-r">
          <input
            type="text"
            v-model="scond2"
            class="border border-black w-[80%] disabled:bg-gray-300"
            disabled />
        </div>
        <div
          class="flex space-x-5 items-center border-l border-t border-black justify-center">
          발주일자
        </div>
        <div
          class="flex space-x-5 items-center border-l border-t border-black justify-start pl-2">
          <input
            type="text"
            v-model="scond3"
            class="border border-black w-[80%] disabled:bg-gray-300"
            disabled />
        </div>
        <div
          class="flex space-x-5 items-center border-l border-t border-black justify-center">
          승인여부
        </div>
        <div
          class="flex space-x-5 items-center border-l border-t border-black justify-start pl-2 border-r">
          <input
            type="text"
            v-model="scond4"
            class="border border-black w-[80%] disabled:bg-gray-300 text-red-500"
            disabled />
        </div>
        <div
          class="flex space-x-5 items-center border-l border-t border-black justify-center">
          배송일자
        </div>
        <div
          class="flex space-x-5 items-center border-l border-t border-black justify-start pl-2">
          <input
            type="text"
            class="border border-black w-[80%] disabled:bg-gray-300"
            v-model="scond5"
            disabled />
        </div>
        <div
          class="flex space-x-5 items-center border-l border-t border-black justify-center">
          거래처
        </div>
        <div
          class="flex space-x-5 items-center border-l border-t border-black justify-start pl-2 border-r">
          <input
            type="text"
            class="border border-black w-[80%] disabled:bg-gray-300"
            v-model="scond6"
            disabled />
        </div>
        <div
          class="flex space-x-5 items-center border-l border-t border-b border-black justify-center">
          코멘트(발주)
        </div>
        <div
          class="flex space-x-5 items-center border col-span-3 border-black justify-start pl-2">
          <input
            type="text"
            disabled
            class="border border-black w-[30%] disabled:bg-gray-300"
            v-model="scond7" />
        </div>
      </div>
      <div class="h-[60%] w-full flex justify-center items-center">
        <Realgrid
          :progname="'PUR01_034INS_VUE'"
          :progid="2"
          :documentTitle="'PUR01_034INS'"
          :setStateBar="false"
          :exporttoExcel="exportExcel2"
          @updatedRowData="updatedRowData2"
          :rowStateeditable="false"
          :documentSubTitle="documentSubTitle2"
          :rowData="rowData2"></Realgrid>
      </div>
    </div>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import { getCommonList } from "@/api/common";
import {
  confirmOrderList,
  getOrderConfirmDetail,
  getOrderConfirmList,
} from "@/api/mipur";
import BusinessClient from "@/components/businessClient.vue";
import Datepicker1 from "@/components/Datepicker1.vue";
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
import Swal from "sweetalert2";
/**
 *  경고창 호출 라이브러리
 *  */

/*
 * 공통 표준  Function
 */

import { onMounted, ref, resolveDirective } from "vue";
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

const dateValue = (e) => {
  initGrid();
  //console.log(e);
  sDate.value = e.replaceAll("-", "");
};

const selectedDate = ref();
const excelDate = (e) => {
  selectedDate.value = e;
};

const storeCode = ref();
const lngStoreCode = (e) => {
  initGrid();
  storeCode.value = e;
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
    const res = await getOrderConfirmList(
      groupCd.value,
      storeCode.value,
      supplierid.value,
      sDate.value
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
  } else if (cond5.value == 3) {
    progid.value = 4;
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

const openPopUp = ref(false);

const tempColID = ref("");
const clickedButtonCol = (e) => {
  tempColID.value = e;
};

const scond = ref("");
const scond2 = ref("");
const scond3 = ref("");
const scond4 = ref("");
const scond5 = ref("");
const scond6 = ref("");
const scond7 = ref("");
const rowData2 = ref([]);

const tempStoreCd = ref("");
const tempSupplier = ref("");
const tempOrderNo = ref("");
const tempOrderDate = ref("");
const tempOrderEDate = ref("");
const dblclickedRowData = async (e) => {
  // console.log(e);
  scond.value = e[2];
  scond2.value = e[4];
  scond3.value = e[5];
  scond4.value = e[14] == "0" ? "미승인" : "승인";
  scond5.value = e[6];
  scond6.value = e[3];
  scond7.value = e[11];
  if (tempColID.value == "strOrderNo") {
    openPopUp.value = true;
    try {
      tempStoreCd.value = e[13];
      tempSupplier.value = e[12];
      tempOrderNo.value = e[4];
      tempOrderDate.value = e[5].replaceAll("-", "");
      tempOrderEDate.value = e[6].replaceAll("-", "");
      const res = await getOrderConfirmDetail(
        store.state.userData.lngStoreGroup,
        e[13],
        e[12],
        e[4],
        e[5].replaceAll("-", ""),
        e[6].replaceAll("-", "")
      );

      //console.log(res);

      rowData2.value = res.data.List;
    } catch (error) {
      // console.log(error);
    }
  }
};

const reFreshButton = async () => {
  try {
    store.state.loading = true;
    const res = await getOrderConfirmDetail(
      store.state.userData.lngStoreGroup,
      tempStoreCd.value,
      tempSupplier.value,
      tempOrderNo.value,
      tempOrderDate.value,
      tempOrderEDate.value
    );

    //console.log(res);
    store.state.loading = false;
    rowData2.value = res.data.List;
  } catch (error) {}
};

const confirmButton = async () => {
  const filtered = updatedrowdata.value
    .filter((item) => item.blnConfm == "0")
    .filter((item) => item.Selected == true);

  if (filtered.length == 0) {
    Swal.fire({
      title: "경고",
      text: "발주 승인할 전표를 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  try {
    const storecds = filtered.map((item) => item.lngStoreCode).join("\u200b");
    const suppliers = filtered.map((item) => item.lngSupplierID).join("\u200b");
    const ordernos = filtered.map((item) => item.strOrderNo).join("\u200b");
    const orderdates = filtered
      .map((item) => item.dtmOrderDate.replaceAll("-", ""))
      .join("\u200b");

    const res = await confirmOrderList(
      store.state.userData.lngStoreGroup,
      storecds,
      suppliers,
      ordernos,
      orderdates,
      store.state.userData.lngSequence,
      1
    );

    if (res.data.RESULT_CD == "00") {
      await Swal.fire({
        title: "성공",
        text: "발주확정이 승인 되었습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
      openPopUp.value = false;
    } else {
      await Swal.fire({
        title: "경고",
        text: "발주확정 승인을 실패하였습니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
    }
  } catch (error) {
  } finally {
    searchButton();
  }
};

const updatedrowdata = ref([]);
const updatedRowData = (e) => {
  //console.log(e);
  updatedrowdata.value = e;
};

const clickedRowData = async (e) => {
  // console.log(e);
  if (tempColID.value == "Canceled" && e[1] == "승인취소") {
    await Swal.fire({
      title: "알림",
      text: "선택한 전표를 승인취소 하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "확인",
      cancelButtonText: "취소",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await confirmOrderList(
            store.state.userData.lngStoreGroup,
            e[13],
            e[12],
            e[4],
            e[5],
            store.state.userData.lngSequence,
            0
          );

          if (res.data.RESULT_CD == "00") {
            await Swal.fire({
              title: "성공",
              text: "발주확정이 취소 되었습니다.",
              icon: "success",
              confirmButtonText: "확인",
            });
            openPopUp.value = false;
          } else {
            await Swal.fire({
              title: "경고",
              text: "발주확정 취소에 실패하였습니다.",
              icon: "warning",
              confirmButtonText: "확인",
            });
          }
        } catch (error) {}
      } else {
        return;
      }
    });

    searchButton();
  }
};
</script>
