<!-- /*--############################################################################
# Filename : PUR02_031INS.vue                                                  
# Description : 구매관리2 > 매입 관리 > 매입등록                      
# Date :2025-08-26                                                             
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
        <button @click="addButton" class="button new md:w-auto w-14">
          신규
        </button>
        <button @click="saveButton" class="button save md:w-auto w-14">
          저장
        </button>
        <button @click="deleteButton" class="button delete md:w-auto w-14">
          삭제
        </button>
        <button @click="excelButton" class="button save w-auto excel">
          엑셀
        </button>
      </div>
    </div>
    <div
      class="grid grid-cols-3 grid-rows-1 bg-gray-200 rounded-lg h-16 items-start z-10">
      <div class="justify-start flex">
        <Datepicker2
          :mainName="'조회기간'"
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
          :hideGroup="false"
          :defaultStoreType2="true"
          :hideAttr="false"
          @storeNm="excelStore"
          @update:storeCd="lngStoreCode"></PickStore>
      </div>
      <div class="flex justify-start pl-16 items-start mt-2">
        <BusinessClient
          @SupplierId="SupplierId"
          :defaultNm="'전체'"></BusinessClient>
      </div>
    </div>
    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="w-full h-[25vh]">
      <div class="w-full h-full">
        <Realgrid
          :progname="'PUR02_031INS_VUE'"
          :progid="1"
          :rowData="rowData"
          :reload="reload"
          :setFooter="true"
          :documentTitle="'PUR02_031INS'"
          @clickedRowData="clickedRowData"
          @checkedRowData="checkedRowData"
          :checkRowAuto="false"
          :checkRowAuto2="true"
          :checkRowAuto2Col="'Selected'"
          :checkRenderEditable="true"
          :documentSubTitle="documentSubTitle"
          :rowStateeditable="false"
          :exporttoExcel="exportExcel">
        </Realgrid>
      </div>
    </div>
    <div class="flex bg-gray-200 rounded-lg h-16 items-start z-10 space-x-5">
      <div class="ml-12 mt-2">
        <BusinessClient
          :disable="disabledBusiness"
          :selectSupplierId="selectSupplierId"
          @SupplierId="SupplierId2"
          :defaultNm="'전체'"></BusinessClient>
      </div>
      <div class="flex items-center space-x-5 mt-4">
        <div class="font-semibold text-base">자재명</div>
        <div>
          <input
            type="text"
            class="w-56 h-7 border border-black"
            v-model="cond2" />
        </div>
      </div>
      <div class="mt-4 ml-5">
        <button class="whitebutton bg-white" @click="searchButton2">
          조회
        </button>
      </div>
    </div>

    <div class="h-[35vh]">
      <Realgrid
        :progname="'PUR02_031INS_VUE'"
        :progid="2"
        :rowStateeditable="false"
        :editableColId="'dblCheckQty'"
        :AutoCalculateDataMainColId="['curSupply']"
        :AutoCalculateDataSubColId="[
          `values['curUnitPrice'] * values['dblCheckQty']`,
        ]"
        :inputOnlyNumberColumn="'curSupply'"
        :CalculateTaxColId="'curTax'"
        :setFooter="true"
        @updatedRowData="updatedRowData2"
        @allStateRows="allStateRows"
        :rowData="rowData2"></Realgrid>
    </div>

    <div class="h-[10vh]">
      <div class="text-base font-semibold">메모</div>

      <textarea
        name=""
        id=""
        v-model="memo"
        class="shadow-lg border border-gray-400 w-full h-full"></textarea>
    </div>
  </div>
  <!-- 그리드 영역 -->

  <div
    v-if="showp"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white p-6 rounded-2xl shadow-xl w-[50vw] h-[50vh]">
      <div class="flex justify-between">
        <h2 class="text-xl font-bold mb-4">자재 리스트</h2>

        <button
          @click="showp = false"
          class="px-4 py-2 bg-gray-700 h-8 text-white rounded-lg">
          닫기
        </button>
      </div>

      <div class="h-[80%] w-full">
        <Realgrid
          :progname="'PUR02_031INS_Popup_VUE'"
          :progid="1"
          :rowStateeditable="false"
          @dblclickedRowData="dblclickedRowData"
          :rowData="rowData3"></Realgrid>
      </div>
    </div>
  </div>

  <div
    v-if="showp2"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white p-6 rounded-2xl shadow-xl w-[50vw] h-[70vh]">
      <div class="flex justify-between">
        <h2 class="text-xl font-bold mb-4">매입등록 신규</h2>

        <div class="flex space-x-3">
          <button
            @click="searchButton3"
            class="px-4 py-2 bg-blue-500 h-8 text-white rounded-lg">
            조회
          </button>
          <button
            @click="saveButton3"
            class="px-4 py-2 bg-blue-500 h-8 text-white rounded-lg">
            저장
          </button>
          <button
            @click="showp2 = false"
            class="px-4 py-2 bg-blue-500 h-8 text-white rounded-lg">
            닫기
          </button>
        </div>
      </div>

      <div class="flex flex-col justify-end">
        <span class="text-red-500"
          >신규매입상품에 대해서 {매입단가},{매입수량} 을 조정할 수
          있습니다.</span
        >
        <div class="flex flex-col">
          <div>{공급가액} = {매입단가} * {매입수량}</div>
          <div>{합계금액} = {공급가액} + {부가세액}</div>
        </div>
      </div>
      <div class="bg-gray-200 h-10 w-full pt-2">
        <div class="grid grid-rows-1 grid-cols-4 gap-3">
          <div class="flex items-center ml-5 space-x-5">
            <div class="font-semibold">매입일자</div>
            <div>
              <input type="date" class="border border-black" v-model="scond" />
            </div>
          </div>

          <div class="flex space-x-5 items-center">
            <div class="font-semibold">매장명</div>
            <input
              type="text"
              class="border border-black disabled:bg-gray-300 w-[60%]"
              v-model="selectedExcelStore"
              disabled />
          </div>

          <div class="flex space-x-5 items-center">
            <div class="font-semibold">자재명</div>
            <input
              type="text"
              class="border border-black w-[60%]"
              v-model="cond3" />
          </div>

          <div class="flex space-x-5 items-center">
            <BusinessClient
              class="w-[50%] !-mt-0"
              @SupplierId="SupplierId3"></BusinessClient>
          </div>
        </div>
      </div>
      <div class="h-[60%] w-full">
        <Realgrid
          :progname="'PUR02_031INS_VUE'"
          :progid="2"
          :rowStateeditable="false"
          @updatedRowData="updatedRowData3"
          :editableColId="'dblCheckQty'"
          :AutoCalculateDataMainColId="['curSupply']"
          :AutoCalculateDataSubColId="[
            `values['curUnitPrice'] * values['dblCheckQty']`,
          ]"
          :inputOnlyNumberColumn="'curSupply'"
          :CalculateTaxColId="'curTax'"
          :rowData="rowData4"></Realgrid>
      </div>

      <div class="flex flex-col">
        <div>메모</div>
        <textarea
          name=""
          id=""
          v-model="scond2"
          placeholder="최대 2000자까지 메모를 남길 수 있습니다."
          class="border border-black shadow-lg h-20"></textarea>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getCommonList } from "@/api/common";
import {
  deleteCheckDetailMasters,
  getCloseDtmDate,
  getPurChaseEnrollList,
  getStockItemDetail,
  getStockItemList4,
  getStockMasterComment,
  saveStockMasterDetail,
  updateCheckMasterDetails,
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

  const res = await getCommonList(27);

  optionList.value = res.data.List.filter((item) => item.strDCode !== "01");

  const today = formatLocalDate(new Date());

  scond.value = today;
});

const reload = ref(false);
const rowData = ref([]);
const rowData3 = ref([]);
const afterSearch = ref(false);

const disabledBusiness = ref(false);
const cond2 = ref("");
const cond3 = ref("");
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
  if (storeCode.value == 0) {
    Swal.fire({
      title: "경고",
      text: "매장을 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  try {
    store.state.loading = true;
    initGrid();
    //console.log(store.state.userData);
    const res = await getPurChaseEnrollList(
      groupCd.value,
      storeCode.value,
      store.state.userData.strLanguage,
      sDate.value.replaceAll("-", ""),
      eDate.value.replaceAll("-", ""),
      supplierid.value
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
  if (rowData2.value.length > 0) {
    rowData2.value = [];
  }
  selectSupplierId.value = 0;

  //   if (cond5.value == 0) {
  //     progid.value = 1;
  //   } else if (cond5.value == 1) {
  //     progid.value = 2;
  //   } else if (cond5.value == 2) {
  //     progid.value = 3;
  //   } else if (cond5.value == 3) {
  //     progid.value = 4;
  //   }

  //   reload.value = !reload.value;
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

const rowData2 = ref([]);

const updatedrowdata2 = ref([]);
const updatedRowData2 = (e) => {
  updatedrowdata2.value = e;
};

const allstaterows = ref([]);
const allStateRows = (e) => {
  //console.log(e);
  allstaterows.value = e.updated;
};
const selectedSupplierid2 = ref("");
const SupplierId2 = (e) => {
  ////console.log(e);
  selectedSupplierid2.value = e;
};
const searchButton2 = async () => {
  try {
    const res = await getStockItemList4(
      groupCd.value,
      storeCode.value,
      selectedSupplierid2.value,
      "strStock",
      "",
      "0",
      cond2.value
    );

    //console.log(res);
    rowData3.value = res.data.List;
    showp.value = true;
  } catch (error) {}
};

const showp = ref(false);
const showp2 = ref(false);

const dblclickedRowData = (e) => {
  //console.log(e);
  const stockcds = updatedrowdata2.value.map((item) =>
    item.lngStockID.includes(e[0])
  );
  if (stockcds.length > 0) {
    return;
  } else {
    rowData2.value = rowData2.value.concat([e]);
    updatedrowdata2.value = rowData2.value;
  }
};

const dtmDate = ref("");
const selectSupplierId = ref("0");
const originmemo = ref("");
const clickedRowData = async (e) => {
  //console.log(e);
  dtmDate.value = formatLocalDate(e[6]);
  try {
    store.state.loading = true;
    const res = await getStockItemDetail(e[1], e[2], e[4], e[7]);
    //console.log(res);
    store.state.loading = false;
    rowData2.value = res.data.List;
    updatedrowdata2.value = JSON.parse(JSON.stringify(res.data.List));
    disabledBusiness.value = true;
    selectSupplierId.value = e[7];
  } catch (error) {
    //console.log(error);
  }

  try {
    store.state.loading = true;
    const res = await getStockMasterComment(e[1], e[2], e[4]);
    memo.value = res.data.List[0].strComments;
    originmemo.value = res.data.List[0].strComments;
    store.state.loading = false;
  } catch (error) {}
};

const addButton = () => {
  showp2.value = true;
};

const scond = ref("");

const selectedSupplier3 = ref("");
const SupplierId3 = (e) => {
  //console.log(e);
  selectedSupplier3.value = e;
};

const rowData4 = ref([]);
const searchButton3 = async () => {
  await getclosedtmdate(groupCd.value, storeCode.value);

  if (scond.value < closeDtmDate.value) {
    Swal.fire({
      title: "경고",
      text: "마감되었습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    const today = new Date();
    scond.value = formatLocalDate(today);
    return;
  }

  if (selectedSupplier3.value == "0") {
    Swal.fire({
      title: "경고",
      text: "거래처를 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  try {
    store.state.loading = true;
    const res = await getStockItemList4(
      groupCd.value,
      storeCode.value,
      selectedSupplier3.value,
      "strStock",
      "",
      "0",
      cond3.value
    );

    //console.log(res);
    store.state.loading = false;
    rowData4.value = res.data.List;
    updatedrowdata3.value = res.data.List;
    //showp.value = true;
  } catch (error) {}
};

const scond2 = ref("");
const saveButton3 = async () => {
  await getclosedtmdate(groupCd.value, storeCode.value);

  if (scond.value < closeDtmDate.value) {
    Swal.fire({
      title: "경고",
      text: "마감되었습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    const today = new Date();
    scond.value = formatLocalDate(today);
    return;
  }

  try {
    updatedrowdata3.value;
    store.state.loading = true;
    const supplierids = updatedrowdata3.value
      .map((item) => item.lngSupplierID)
      .join("\u200b");
    const stockids = updatedrowdata3.value
      .map((item) => item.lngStockID)
      .join("\u200b");
    const dblcheckqty = updatedrowdata3.value
      .map((item) => item.dblCheckQty)
      .join("\u200b");
    const unitprices = updatedrowdata3.value
      .map((item) => item.curUnitPrice)
      .join("\u200b");
    const supplys = updatedrowdata3.value
      .map((item) => item.curSupply)
      .join("\u200b");
    const taxs = updatedrowdata3.value
      .map((item) => item.curTax)
      .join("\u200b");
    const res = await saveStockMasterDetail(
      groupCd.value,
      storeCode.value,
      storeCode.value,
      scond.value.replaceAll("-", ""),
      supplierids,
      stockids,
      dblcheckqty,
      unitprices,
      supplys,
      taxs,
      "",
      0,
      "0",
      store.state.userData.lngSequence,
      scond2.value
    );

    ////console.log(res);
    store.state.loading = false;
    if (res.data.RESULT_CD == "00") {
      Swal.fire({
        title: "성공",
        text: "저장을 완료하였습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
    } else {
      Swal.fire({
        title: "실패",
        text: "저장에 실패하였습니다.",
        icon: "error",
        confirmButtonText: "확인",
      });
    }
  } catch (error) {
  } finally {
    showp2.value = false;
    searchButton();
  }
};

const updatedrowdata3 = ref([]);
const updatedRowData3 = (e) => {
  updatedrowdata3.value = e;

  //console.log(e);
};

const memo = ref("");

const saveButton = async () => {
  await getclosedtmdate(groupCd.value, storeCode.value);

  if (dtmDate.value < closeDtmDate.value) {
    Swal.fire({
      title: "경고",
      text: "마감된 정보는 수정하실 수 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  if (allstaterows.value.length == 0 && originmemo.value == memo.value) {
    Swal.fire({
      title: "경고",
      text: "변경된 사항이 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  try {
    store.state.loading = true;
    const checkNos = updatedrowdata2.value

      .map((item) => item.strCheckNo)
      .join("\u200b");
    const checkSeqs = updatedrowdata2.value

      .map((item) => item.lngCheckSeq)
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

    const res = await updateCheckMasterDetails(
      groupCd.value,
      storeCode.value,
      storeCode.value,
      checkNos,
      checkSeqs,
      checkqtys,
      unitprices,
      supplys,
      taxs,
      "",
      0,
      0,
      store.state.userData.lngSequence,
      memo.value
    );
    store.state.loading = false;
    //console.log(res);
  } catch (error) {
  } finally {
    searchButton();
  }
};

const closeDtmDate = ref("");
const getclosedtmdate = async (groupcd, storecd) => {
  try {
    const res = await getCloseDtmDate(groupcd, storecd);

    //console.log(res);
    closeDtmDate.value = res.data.List[0].dtmDate;
  } catch (error) {}
};

const checkedrowdata = ref([]);
const checkedRowData = (e) => {
  checkedrowdata.value = e;
  //console.log(e);
};

const deleteButton = async () => {
  if (checkedrowdata.value.length == 0) {
    Swal.fire({
      title: "경고",
      text: "삭제할 정보가 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  await getclosedtmdate(groupCd.value, storeCode.value);
  const dtmdates = checkedrowdata.value.filter((item) => {
    const checkDate = new Date(formatLocalDate(item.dtmCheckDate)); // item의 날짜
    const closeDate = new Date(closeDtmDate.value.split(" ")[0]); // 기준 날짜

    return checkDate < closeDate;
  });

  if (dtmdates.length > 0) {
    Swal.fire({
      title: "경고",
      text: "마감된 정보는 삭제하실 수 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  try {
    const checknos = checkedrowdata.value
      .map((item) => item.strCheckNo)
      .join("\u200b");

    const res = await deleteCheckDetailMasters(
      groupCd.value,
      storeCode.value,
      checknos,
      store.state.userData.lngSequence
    );

    //console.log(res);

    if (res.data.RESULT_CD == "00") {
      await Swal.fire({
        title: "성공",
        text: "해당 정보를 삭제하였습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
      return;
    } else {
      await Swal.fire({
        title: "에러",
        text: "삭제에 실패하였습니다. 피앤시월드에 문의해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
    }
  } catch (error) {
  } finally {
    searchButton();
  }
};
</script>
