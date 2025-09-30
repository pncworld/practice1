<!-- /*--############################################################################
# Filename : PUR08_004INS.vue                                                  
# Description : 구매관리2 > 구매 관리 > 매장/파트간 입고 확정                   
# Date :2025-09-23                                                             
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
        <button @click="confirmButton" class="button save w-auto xcel">
          확정
        </button>
        <button @click="cancelButton" class="button primary w-auto">
          확정취소
        </button>
        <button @click="excelButton" class="button save w-auto excel">
          엑셀
        </button>
      </div>
    </div>
    <div
      class="grid grid-cols-2 grid-rows-2 bg-gray-200 rounded-lg h-24 items-start z-10">
      <div class="justify-start flex">
        <PickStore
          @update:storeGroup="lngStoreGroup"
          :defaultStoreNm="'전체'"
          :mainName="'보낸 매장'"
          @storeNm="excelStore"
          :hideAttr="false"
          :hideGroup="false"
          :setDynamicStoreClass="'!h-8 !p-0'"
          :defaultStore="true"
          @update:storeCd="lngStoreCode"></PickStore>
      </div>
      <div class="flex justify-start items-center">
        <div class="text-base font-semibold">받는 매장/파트</div>
        <div class="flex items-center space-x-2">
          <PickStore
            :defaultStoreNm="'전체'"
            :mainName="''"
            @storeNm="excelStore2"
            :hideAttr="false"
            :hideGroup="false"
            :setDynamicStoreClass="'!h-8 !p-0'"
            :setDynamicStoreClass2="'!ml-0'"
            :defaultStore="true"
            @update:storeCd="lngStoreCode2"></PickStore>
          <select
            name=""
            id=""
            class="w-32 h-8 border border-black mt-2"
            v-model="cond">
            <option :value="i.lngPartCode" v-for="i in optionList">
              {{ i.strPartName }}
            </option>
          </select>
        </div>
      </div>
      <div class="flex justify-start items-center -mt-2 space-x-5">
        <Datepicker2
          :mainName="'이동기간'"
          @startDate="startDate"
          @excelDate="excelDate"
          @endDate="endDate"></Datepicker2>
      </div>
      <div class="flex justify-start pl-10 mt-2 items-center space-x-5">
        <div class="text-base font-semibold">확정기간</div>
        <div>
          <select
            name=""
            id=""
            class="w-48 h-8 border border-black"
            v-model="cond2">
            <option value="9">전체</option>
            <option :value="i.strDCode" v-for="i in optionList2">
              {{ i.strDName }}
            </option>
          </select>
        </div>
      </div>
    </div>
    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="w-full h-[75vh]">
      <Realgrid
        :progname="'PUR08_004INS_VUE'"
        :progid="1"
        :rowData="rowData"
        :setStateBar="false"
        :documentTitle="'PUR08_004INS'"
        @updatedRowData="updatedRowData"
        :checkedRowData2Col="'Selected'"
        @selectedIndex="selectedIndex"
        @checkedRowData2="checkedRowData2"
        :documentSubTitle="documentSubTitle"
        :checkAbleExpressionVal="'1'"
        :checkAbleExpressionCol2="'lngConfirm'"
        :headerCheckBar="'cancled,Selected'"
        :checkAbleExpressionCol="'cancled,Selected'"
        :checkRenderEditable="true"
        :checkRowAuto="true"
        :rowStateeditable="false"
        :changeRow="changeRow"
        :changeColid="changeColid"
        :changeNow="changeNow"
        :changeValue2="changeValue2"
        :exporttoExcel="exportExcel">
      </Realgrid>
    </div>
  </div>

  <div
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    v-if="open">
    <div
      class="flex flex-col bg-white border border-black w-[40vw] h-[15vh] p-2">
      <div class="flex justify-end space-x-3">
        <button class="whitebutton" @click="setValue">선택</button>
        <button class="whitebutton" @click="setFalse">닫기</button>
      </div>
      <div class="grid grid-rows-1 grid-cols-[1fr,2fr] h-[50%]">
        <div
          class="text-base font-semibold border border-black flex justify-center items-center bg-gray-50">
          입고 확정일자
        </div>
        <div
          class="text-base font-semibold border border-black flex justify-center items-center">
          <input
            type="date"
            class="border border-black h-[80%] w-[80%]"
            v-model="changeValue2" />
        </div>
      </div>
    </div>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import { getCommonList } from "@/api/common";
import {
  cancelStoreMoveConfirmList,
  confirmStoreMoveConfirmList,
  getStoreStockMoveListByPart,
} from "@/api/mipur";
import { getLossMasterPartList } from "@/api/mistock";
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

import { formatLocalDate, insertPageLog } from "@/customFunc/customFunc";
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

  const res = await getCommonList(24);

  optionList2.value = res.data.List;
});

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

const cond = ref("0");
const cond2 = ref(9);
const cond3 = ref(0);
const cond4 = ref("");
const cond5 = ref(0);
const cond6 = ref(0);
const store = useStore();

const datepicker = ref(null);
const closePopUp = ref(false);
const optionList = ref([]);
const optionList2 = ref([]);
const optionList3 = ref([]);
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

const storeCode = ref();
const lngStoreCode = async (e) => {
  initGrid();
  storeCode.value = e;

  const res2 = await getLossMasterPartList(
    store.state.userData.lngStoreGroup,
    storeCode.value
  );

  optionList3.value = res2.data.List;
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
  try {
    store.state.loading = true;
    initGrid();

    const res = await getStoreStockMoveListByPart(
      groupCd.value,
      storeCode.value,
      0,
      storeCode2.value,
      cond.value,
      sDate.value,
      eDate.value,
      cond2.value
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

const setRowStyleCallsDefaultCol = ref("strTaxType");
const setRowStyleCallsDefaultCol2 = ref("strStockName");
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
    selectedDate.value +
    "\n" +
    "보낸 매장명 :" +
    selectedExcelStore.value +
    "\n" +
    "받는 매장명 :" +
    selectedExcelStore2.value;
  exportExcel.value = !exportExcel.value;
};

// 엑셀 추출
const documentSubTitle = ref("");
const selectedExcelList = ref("");

const selectedExcelStore = ref("");
const selectedExcelStore2 = ref("");
/**
 * 엑셀용 매장 세팅 함수
 */

const excelStore = (e) => {
  selectedExcelStore.value = e;
  //comsole.log(e);
};
const excelStore2 = (e) => {
  selectedExcelStore2.value = e;
  //comsole.log(e);
};
const excelList = (e) => {
  selectedExcelList.value = e;
  //comsole.log(e);
};
const storeCode2 = ref("");
const lngStoreCode2 = async (e) => {
  storeCode2.value = e;

  const res2 = await getLossMasterPartList(
    store.state.userData.lngStoreGroup,
    storeCode2.value
  );

  optionList.value = res2.data.List;
};

const open = ref(false);
const changeNow = ref(false);
const changeValue2 = ref("");
const changeColid = ref("strConfirmDate");
const tempMoveDate = ref("");
const tempCloseDate = ref("");
const checkedRowData2 = async (e) => {
  console.log(e);

  tempMoveDate.value = formatLocalDate(e[2]).replaceAll("-", "");
  tempCloseDate.value = e[23];
  if (e[0] == true) {
    changeColid.value = "strConfirmDate";
    changeValue2.value = formatLocalDate(new Date());
    open.value = true;
  } else if (e[0] == false) {
    changeColid.value = "strConfirmDate";
    changeValue2.value = "";
    changeNow.value = !changeNow.value;
  }
};

const changeRow = ref(0);

const selectedIndex = (e) => {
  changeRow.value = e;
};
const setFalse = () => {
  changeColid.value = "Selected";
  changeValue2.value = "0";
  changeNow.value = !changeNow.value;
  open.value = false;
};

const setValue = () => {
  if (
    parseInt(changeValue2.value.replaceAll("-", "")) <
    parseInt(tempCloseDate.value)
  ) {
    Swal.fire({
      title: "경고",
      text: "월마감 이전으로 입고확정 할 수 없습니다.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }

  if (
    parseInt(changeValue2.value.replaceAll("-", "")) <
    parseInt(tempMoveDate.value)
  ) {
    Swal.fire({
      title: "경고",
      text: "출고확정 이전으로 입고확정 할 수 없습니다.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }

  changeNow.value = !changeNow.value;
  open.value = false;
};

const updatedrowdata = ref([]);
const updatedRowData = (e) => {
  updatedrowdata.value = e;
};

const cancelButton = async () => {
  try {
    const fstorecds = updatedrowdata.value
      .filter((item) => item.cancled == true)
      .map((item) => item.lngFromStoreCode)
      .join("\u200b");
    const moveseqs = updatedrowdata.value
      .filter((item) => item.cancled == true)
      .map((item) => item.strMoveSeqID)
      .join("\u200b");
    const tstorecds = updatedrowdata.value
      .filter((item) => item.cancled == true)
      .map((item) => item.lngToStoreCode)
      .join("\u200b");
    const movedate = updatedrowdata.value
      .filter((item) => item.cancled == true)
      .map((item) => formatLocalDate(item.strMoveDate).replaceAll("-", ""))
      .join("\u200b");

    const supplier = updatedrowdata.value
      .filter((item) => item.cancled == true)
      .map((item) => item.lngSupplierID)
      .join("\u200b");

    const stockids = updatedrowdata.value
      .filter((item) => item.cancled == true)
      .map((item) => item.lngStockID)
      .join("\u200b");

    const confirmdate = updatedrowdata.value
      .filter((item) => item.cancled == true)
      .map((item) => item.strConfirmDate)
      .join("\u200b");
    const res = await cancelStoreMoveConfirmList(
      groupCd.value,
      fstorecds,
      moveseqs,
      tstorecds,
      movedate,
      supplier,
      stockids,
      confirmdate,
      1
    );

    if (res.data.RESULT_CD == "00") {
      await Swal.fire({
        title: "성공",
        text: "확정 취소를 완료하였습니다.",
        icon: "success",

        confirmButtonText: "확인",
      });
    } else {
      await Swal.fire({
        title: "실패",
        text: `${res.data.RESULT_NM}`,
        icon: "error",

        confirmButtonText: "확인",
      });
    }
  } catch (error) {
    console.log(error);
  } finally {
    searchButton();
  }
};

const confirmButton = async () => {
  if (
    updatedrowdata.value.filter((item) => item.Selected == true).length == 0
  ) {
    Swal.fire({
      title: "경고",
      text: "확정할 자재를 체크해주세요.",
      icon: "success",

      confirmButtonText: "확인",
    });
  }
  try {
    const fstorecds = updatedrowdata.value
      .filter((item) => item.Selected == true)
      .map((item) => item.lngFromStoreCode)
      .join("\u200b");
    const moveseqs = updatedrowdata.value
      .filter((item) => item.Selected == true)
      .map((item) => item.strMoveSeqID)
      .join("\u200b");
    const tstorecds = updatedrowdata.value
      .filter((item) => item.Selected == true)
      .map((item) => item.lngToStoreCode)
      .join("\u200b");
    const movedate = updatedrowdata.value
      .filter((item) => item.Selected == true)
      .map((item) => formatLocalDate(item.strMoveDate).replaceAll("-", ""))
      .join("\u200b");

    const supplier = updatedrowdata.value
      .filter((item) => item.Selected == true)
      .map((item) => item.lngSupplierID)
      .join("\u200b");

    const stockids = updatedrowdata.value
      .filter((item) => item.Selected == true)
      .map((item) => item.lngStockID)
      .join("\u200b");

    const confirmdate = updatedrowdata.value
      .filter((item) => item.Selected == true)
      .map((item) => formatLocalDate(item.strConfirmDate).replaceAll("-", ""))
      .join("\u200b");
    const res = await confirmStoreMoveConfirmList(
      groupCd.value,
      fstorecds,
      moveseqs,
      tstorecds,
      movedate,
      supplier,
      stockids,
      store.state.userData.lngSequence,
      confirmdate,
      1
    );

    if (res.data.RESULT_CD == "00") {
      await Swal.fire({
        title: "성공",
        text: "확정을 완료하였습니다.",
        icon: "success",

        confirmButtonText: "확인",
      });
    } else {
      await Swal.fire({
        title: "실패",
        text: `${res.data.RESULT_NM}`,
        icon: "error",

        confirmButtonText: "확인",
      });
    }
  } catch (error) {
    console.log(error);
  } finally {
    searchButton();
  }
};
</script>
