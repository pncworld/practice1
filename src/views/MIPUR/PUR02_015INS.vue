<!-- /*--############################################################################
# Filename : PUR02_015INS.vue                                                  
# Description : 구매관리2 > 매입 관리 > 매입 확정.                      
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
        <button @click="excelButton" class="button w-auto excel">엑셀</button>
      </div>
    </div>
    <div
      class="grid grid-cols-2 grid-rows-2 bg-gray-200 rounded-lg h-24 items-start z-10">
      <div class="justify-start flex">
        <Datepicker2
          :mainName="'발주일자'"
          ref="datepicker"
          :initToday="1"
          :closePopUp="closePopUp"
          @excelDate="excelDate"
          @endDate="endDate"
          @startDate="startDate"
          @dateValue="dateValue">
        </Datepicker2>
      </div>
      <div class="flex justify-start items-center">
        <PickStore
          @update:storeGroup="lngStoreGroup"
          :defaultStoreNm="'전체'"
          @storeNm="excelStore"
          :hideGroup="false"
          :hideAttr="false"
          :defaultStoreType2="true"
          :defaultStore="true"
          @update:storeCd="lngStoreCode"></PickStore>
      </div>
      <div class="flex ml-20 space-x-5 mt-2 items-center">
        <div class="text-base font-semibold">상태</div>
        <div>
          <select
            name=""
            id=""
            class="w-48 border border-black h-7"
            v-model="cond">
            <option :value="i.strDCode" v-for="i in optionList">
              {{ i.strDName }}
            </option>
          </select>
        </div>
      </div>
      <div class="flex justify-start pl-12 items-center mt-1">
        <BusinessClient
          @SupplierId="SupplierId"
          :defaultNm="'전체'"></BusinessClient>
      </div>
    </div>

    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="w-full h-[65vh]">
      <div class="font-semibold ml-2">
        [미입고]: 입고수량이 발주수량보다 적게 입고되었거나 입고가 안된 경우.
        [입고완료] : 입고수량이 발주수량과 같거나 많이 입고된 경우
      </div>
      <Realgrid
        :progname="'PUR02_015INS_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :setStateBar="false"
        :setFooter="true"
        :documentTitle="'PUR02_015INS'"
        :selectionStyle="'block'"
        @dblclickedRowData="dblclickedRowData"
        :documentSubTitle="documentSubTitle"
        :rowStateeditable="false"
        :exporttoExcel="exportExcel">
      </Realgrid>
    </div>
  </div>

  <div
    v-if="openPopUp"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white p-6 rounded-2xl shadow-xl w-[75vw] h-[80vh]">
      <div class="flex justify-between">
        <h2 class="text-xl font-bold mb-4">매입 상세</h2>
        <div class="flex space-x-5">
          <button
            class="whitebutton disabled:opacity-30"
            @click="saveButton"
            :disabled="disabled1">
            저장
          </button>
          <button
            class="whitebutton disabled:opacity-30"
            @click="cancelButton"
            :disabled="!disabled1">
            확정취소
          </button>
          <button class="whitebutton" @click="excelButton2">엑셀</button>
          <button class="whitebutton" @click="openPopUp = false">닫기</button>
        </div>
      </div>
      <div class="grid grid-rows-5 grid-cols-[1fr,4fr,1fr,4fr] h-[20vh]">
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
          배송(입고)일
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
          거래처
        </div>
        <div
          class="flex space-x-5 items-center border-l border-t border-black justify-start pl-2 border-r">
          <input
            type="text"
            v-model="scond4"
            class="border border-black w-[80%] disabled:bg-gray-300"
            disabled />
        </div>
        <div
          class="flex space-x-5 items-center border-l border-t border-black justify-center">
          코멘트(발주)
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
          코멘트(출고)
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
          class="flex space-x-5 items-center border-l border-t border-black justify-center">
          입고확정일
        </div>
        <div
          class="flex space-x-5 items-center border-l border-t border-black justify-start pl-2">
          <input
            type="date"
            :disabled="disabled1"
            class="border border-black w-[80%]"
            v-model="scond7" />
        </div>
        <div
          class="flex space-x-5 items-center border-l border-t border-black justify-center">
          검수자
        </div>
        <div
          class="flex space-x-5 items-center border-l border-t border-black justify-start pl-2 border-r">
          <input
            type="text"
            class="border border-black w-[80%]"
            :disabled="disabled1"
            v-model="scond8" />
        </div>
        <div
          class="flex space-x-5 items-center border-l border-t border-b border-black justify-center">
          코멘트입고
        </div>
        <div
          class="flex space-x-5 items-center border-l border-t border-b border-r border-black justify-start pl-2 col-span-3">
          <input
            type="text"
            class="border border-black w-[80%]"
            :disabled="disabled1"
            v-model="scond9" />
        </div>
      </div>
      <div class="h-[60%] w-full flex justify-center items-center mt-2">
        <Realgrid
          :progname="'PUR02_015INS_VUE'"
          :progid="2"
          :documentTitle="'PUR02_015INS'"
          :exporttoExcel="exportExcel2"
          @updatedRowData="updatedRowData2"
          :rowStateeditable="false"
          :inputOnlyNumberColumn="'dblCheckQty'"
          :CalculateTaxColId="'curTax'"
          :editableColId="'dblCheckQty'"
          :AutoCalculateDataMainColId="['curSupply', 'curTotal']"
          :AutoCalculateDataSubColId="[
            `values['dblCheckQty'] * values['curUnitPrice']`,
            `values['curSupply'] + values['curTax']`,
          ]"
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
  cancelStockConfirm,
  checkStockCloseDate,
  getStockOrderCheckList,
  getStockOrderDetails,
  saveStockCheckMasterDetail,
} from "@/api/mipur";
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

  const res = await getCommonList(19);

  optionList.value = res.data.List;
});

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

const cond = ref("01");
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

const sDate = ref("");
const eDate = ref("");

const selectedDate = ref();
const excelDate = (e) => {
  selectedDate.value = e;
};
const optionList2 = ref([]);

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

    const res = await getStockOrderCheckList(
      groupCd.value,
      storeCode.value,
      supplierid.value,
      sDate.value.replaceAll("-", ""),
      eDate.value.replaceAll("-", ""),
      cond.value
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

const disabled1 = ref(false);
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

const documentSubTitle2 = ref("");

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

const rowData2 = ref([]);
const forPopupOrderStoreCd = ref("");
const forPopupOrderNo = ref("");
const tempGroup = ref("");
const tempStore = ref("");
const tempBClient = ref("");
const tempCheckNo = ref("");
const tempCheckDate = ref("");
const scond5 = ref("");
const scond6 = ref("");
const scond8 = ref("");
const scond9 = ref("");
const dblclickedRowData = async (e) => {
  console.log(e);

  if (e[6] == "" || e[6] == undefined) {
    disabled1.value = false;
    scond7.value =
      e[5].slice(0, 4) + "-" + e[5].slice(4, 6) + "-" + e[5].slice(6, 8);
  } else {
    disabled1.value = true;
    scond7.value =
      e[6].slice(0, 4) + "-" + e[6].slice(4, 6) + "-" + e[6].slice(6, 8);
  }
  scond.value = e[0];
  scond2.value = e[2];
  scond3.value = e[5];
  scond4.value = e[1];
  scond5.value = e[15];
  openPopUp.value = true;
  tempGroup.value = e[13];
  tempStore.value = e[14];
  tempCheckNo.value = e[3];
  tempBClient.value = e[12];
  tempCheckDate.value = e[4];
  scond8.value = e[18];
  scond9.value = e[17];
  scond6.value = e[16];

  console.log(scond7.value);
  try {
    const res = await getStockOrderDetails(
      e[13],
      e[14],
      e[2],
      e[12],
      e[5],
      store.state.userData.strLanguage
    );
    console.log(res);
    rowData2.value = res.data.List;
    updatedrowdata2.value = res.data.List;
  } catch (error) {}
};

const checkedrowdata = ref([]);

const startDate = (e) => {
  sDate.value = e;
};
const endDate = (e) => {
  eDate.value = e;
};

const scond = ref("");
const scond2 = ref("");
const scond3 = ref("");
const scond4 = ref("");
const scond7 = ref("");

const exportExcel2 = ref(false);
const excelButton2 = () => {
  documentSubTitle2.value = "입고확정일 : " + scond7.value;
  exportExcel2.value = !exportExcel2.value;
};

const saveButton = async () => {
  if (
    parseInt(tempCheckDate.value) > parseInt(scond7.value.replaceAll("-", ""))
  ) {
    await Swal.fire({
      title: "경고",
      text: "발주일보다 빠른 날짜로 매입확정을 하실 수 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  try {
    const res = await checkStockCloseDate(
      tempGroup.value,
      tempStore.value,
      scond7.value.replaceAll("-", "")
    );

    //console.log(res);

    const result = res.data.List.filter((item) =>
      item.dtmMonth.includes(scond7.value.replaceAll("-", "").slice(0, 6))
    );

    if (result[0].strClosed == "Y") {
      await Swal.fire({
        title: "경고",
        text: "해당 입고확정일은 마감되었습니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }
    console.log(result);
  } catch (error) {}

  try {
    const stockids = updatedrowdata2.value
      .map((item) => item.lngStockID)
      .join("\u200b");
    const checkqtys = updatedrowdata2.value
      .map((item) => item.dblCheckQty)
      .join("\u200b");
    const unitprices = updatedrowdata2.value
      .map((item) => item.curUnitPrice)
      .join("\u200b");
    const supplys = updatedrowdata2.value
      .map((item) => item.curSupply)
      .join("\u200b");
    const taxs = updatedrowdata2.value
      .map((item) => item.curTax)
      .join("\u200b");
    const ordernos = updatedrowdata2.value
      .map((item) => item.strOrderNo)
      .join("\u200b");
    const orderseqs = updatedrowdata2.value
      .map((item) => item.lngOrderSeq)
      .join("\u200b");
    const res = await saveStockCheckMasterDetail(
      tempGroup.value,
      tempStore.value,
      scond7.value.replaceAll("-", ""),
      scond9.value,
      1,
      scond8.value,

      scond2.value,
      scond7.value.replaceAll("-", ""),
      tempBClient.value,
      stockids,
      checkqtys,
      unitprices,
      supplys,
      taxs,
      ordernos,
      orderseqs,
      store.state.userData.lngSequence
    );

    if (res.data.RESULT_CD == "00") {
      await Swal.fire({
        title: "성공",
        text: "저장되었습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
      openPopUp.value = false;
    } else {
      await Swal.fire({
        title: "경고",
        text: "저장에 실패하였습니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      openPopUp.value = false;
    }
  } catch (error) {
  } finally {
    searchButton();
  }
};

const updatedrowdata2 = ref([]);
const updatedRowData2 = (e) => {
  updatedrowdata2.value = e;
};

const cancelButton = async () => {
  try {
    const res = await checkStockCloseDate(
      tempGroup.value,
      tempStore.value,
      scond7.value.replaceAll("-", "")
    );

    //console.log(res);

    const result = res.data.List.filter((item) =>
      item.dtmMonth.includes(scond7.value.replaceAll("-", "").slice(0, 6))
    );

    if (result[0].strClosed == "Y") {
      await Swal.fire({
        title: "경고",
        text: "해당 매입 사항은 마감되어 취소할 수 없습니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }
    console.log(result);
  } catch (error) {}
  try {
    const res = await cancelStockConfirm(
      tempGroup.value,
      tempStore.value,
      scond2.value,
      tempCheckDate.value,
      tempCheckNo.value,
      scond7.value.replaceAll("-", ""),
      tempBClient.value,
      store.state.userData.lngSequence
    );

    if (res.data.RESULT_CD == "00") {
      await Swal.fire({
        title: "성공",
        text: "확정 취소가 완료되었습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
      openPopUp.value = false;
    } else {
      await Swal.fire({
        title: "경고",
        text: "확정 취소가 실패하였습니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      openPopUp.value = false;
    }
  } catch (error) {
  } finally {
    searchButton();
  }
};
</script>
