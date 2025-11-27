<!-- /*--############################################################################
# Filename : PUR01_019INS.vue
# Description : 구매관리2 > 발주 관리 > 발주 확인/출고
# Date :2025-09-22
# Author : 권지안
# Editor : 권맑음
################################################################################*/ -->
<template>
  <!-- 기본버튼 -->
  <div class="flex justify-between items-center w-full overflow-y-hidden">
    <PageName></PageName>
    <div class="flex justify-center mr-9 space-x-2 pr-5">
      <button @click="searchButton" class="button search md:w-auto w-14">
        조회
      </button>
      <button @click="excelButton" class="button excel w-auto">엑셀</button>
    </div>
  </div>
  <br />
  <!-- 조회조건 -->
  <div class="flex space-x-96 bg-gray-200 rounded-lg md:h-16 h-24 items-center">
    <div class="flex items-center justify-center space-x-5">
      <div class="justify-start flex ml-12">
        <Datepicker1
          :mainName="mainName"
          ref="datepicker"
          :initToday="1"
          :closePopUp="closePopUp"
          @excelDate="excelDate"
          @dateValue="dateValue">
        </Datepicker1>
      </div>
      <PickStoreRenew3
        :setDynamicStoreClass="'!h-10 !p-0'"
        :defaultStoreNm="'전체'"
        @excelStore="excelStoreGrid1"
        @update:storeCd="handleStoreCd"
        @storeNm="storeNm"
        :hideit="false"
        :hideit2="false" />
      <!-- <BusinessClient @SupplierId="SupplierId" @SupplierNm="SupplierNm" /> -->
      <BusinessClient
        :setDynamicClass2="''"
        :setDynamicClass="'w-[100%]'"
        :defaultNm="'전체'"
        @SupplierId="SupplierId"
        @SupplierNm="SupplierNm"
        >></BusinessClient
      >
    </div>
  </div>
  <!-- 그리드 영역 -->
  <div class="flex justify-center w-[97%] h-[60vh] gap-5 ml-5">
    <Realgrid
      class="w-full h-full mt-2"
      :progname="'PUR01_019INS_VUE'"
      :progid="1"
      :rowData="rowData"
      :documentTitle="'PUR01_019INS'"
      :rowStateeditable="false"
      :selectionStyle="'block'"
      :exporttoExcel="exportExcelGrid1"
      :documentSubTitle="documentSubTitleGrid1"
      @clickedRowData="clickedRowData"
      @dblclickedRowData="dblclickedRowData" />
  </div>
  <div
    v-if="popupButton"
    class="fixed inset-0 w-full h-full flex bg-black/20 z-40">
    <div
      class="bg-white p-6 rounded-xl shadow-lg w-[80%] h-[80%] absolute top-[10%] left-[15%] border border-black">
      <div class="flex items-center justify-between mb-4">
        <!-- 왼쪽 제목 -->
        <h2 class="text-lg font-bold">발주 확인/출고(팝업)</h2>
        <!-- 오른쪽 버튼들 -->
        <div class="flex space-x-2">
          <button @click="saveButton" class="button save md:w-auto w-14">
            저장
          </button>
          <button @click="excelButtonGrid2" class="button excel w-auto">
            엑셀
          </button>
          <button @click="closePopup" class="button primary">닫기</button>
        </div>
      </div>
      <div class="border border-gray-300">
        <!-- 1행 -->
        <div class="grid grid-cols-4 border-b border-gray-300">
          <div class="bg-gray-100 px-2 py-1 border-r border-gray-300">매장</div>
          <div class="px-2 py-1">
            <input
              type="text"
              class="border border-black h-[80%] w-[100%] disabled:bg-gray-200"
              disabled
              v-model="scond" />
          </div>
          <div class="bg-gray-100 px-2 py-1 border-x border-gray-300">
            전표번호
          </div>
          <div class="px-2 py-1">
            <input
              type="text"
              class="border border-black h-[80%] w-[100%] disabled:bg-gray-200"
              disabled
              v-model="scond2" />
          </div>
        </div>

        <!-- 2행 -->
        <div class="grid grid-cols-4 border-b border-gray-300">
          <div class="bg-gray-100 px-2 py-1 border-r border-gray-300">
            {{ mainName }}
          </div>
          <div class="px-2 py-1">
            <input
              type="text"
              class="border border-black h-[80%] w-[100%] disabled:bg-gray-200"
              disabled
              v-model="formatscond3" />
          </div>
          <div class="bg-gray-100 px-2 py-1 border-x border-gray-300">
            거래처
          </div>
          <div class="px-2 py-1">
            <input
              type="text"
              class="border border-black h-[80%] w-[100%] disabled:bg-gray-200"
              disabled
              v-model="scond4" />
          </div>
        </div>

        <!-- 3행 -->
        <div class="grid grid-cols-4 border-b border-gray-300">
          <div class="bg-gray-100 px-2 py-1 border-r border-gray-300">
            메모(발주)
          </div>
          <div class="col-span-3 px-2 py-1">
            <input
              type="text"
              class="border border-black h-[80%] w-[100%] disabled:bg-gray-200"
              disabled
              v-model="scond5" />
          </div>
        </div>
        <!-- 4행 -->
        <div class="grid grid-cols-4">
          <div class="bg-gray-100 px-2 py-1 border-r border-gray-300">
            메모(출고)
          </div>
          <div class="col-span-3 px-2 py-1">
            <input
              type="text"
              class="border border-black h-[80%] w-[100%] disabled:bg-gray-200"
              v-model="scond6"
              name="strCheckComments" />
          </div>
        </div>
      </div>
      <br />
      <div class="h-[60%] w-full">
        <Realgrid
          :progid="2"
          :progname="'PUR01_019INS_VUE'"
          @allStateRows="allStateRows"
          @updatedRowData="updatedRowData"
          @updatedRowData2="updatedRowData"
          @clickedRowData="clickedRowData2"
          :editableColId="editableColId"
          :inputOnlyNumberColumn="'dblCheckQty'"
          :CalculateSupplyPrice="'curSupply'"
          :CalculateVatPrice="'curTax'"
          :CalculateTotalPrice="'curTotalAmt'"
          :setFooter="true"
          :setFooterCustomColumnId="['curUnitPrice']"
          :setFooterCustomText="['합계']"
          :rowStateeditable="false"
          :rowData="rowData2"
          @selectedIndex="selectedIndex"
          :changeRow="changeRow"
          :changeColid="changeColid"
          :changeValue2="changeValue2"
          :changeNow2="changeNow"
          :documentTitle="'PUR01_019INS'"
          :exporttoExcel="exportExcelGrid2"
          :documentSubTitle="documentSubTitleGrid2" />
      </div>
      <br />
    </div>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import {
  getOrderConfirmDelivery,
  getOrderConfirmDeliveryDetail,
  setOrderConfirmDelivery,
} from "@/api/mipur";
/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";

/**
 *  매장 선택 컴포넌트
 *  */

import Datepicker1 from "@/components/Datepicker1.vue";
import PickStoreRenew3 from "@/components/pickStoreRenew.vue";

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

import { onMounted, ref } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";
import BusinessClient from "@/components/businessClient.vue";

const rowData = ref([]);
const rowData2 = ref([]);

/**
 * 그리드1 초기화
 */

const initGrid = () => {
  if (rowData.value.length != 0) {
    rowData.value = [];
  }
};

/**
 * 그리드2 초기화
 */

const initGrid2 = () => {
  if (rowData2.value.length != 0) {
    rowData2.value = [];
  }
};

/**
 * 	매출 일자 가져오는 함수
 */

const selectedDate = ref();
const dateValue = (e) => {
  initGrid();
  selectedDate.value = e;
  // console.log(selectedDate.value);
};

/**
 * 선택한 매장 코드 호출 함수
 */
const storeCd = ref(""); // 기본값 ""
const handleStoreCd = (e) => {
  // console.log(e);
  storeCd.value = e;
  initGrid();
};

const supplierid = ref("");
const SupplierId = (e) => {
  initGrid();
  supplierid.value = e;
  // console.log(supplierid.value);
};

const Suppliernm = ref("");
const SupplierNm = (e) => {
  initGrid();
  Suppliernm.value = e;
  // console.log(Suppliernm.value);
};

const scond = ref("");
const scond2 = ref("");
const scond3 = ref("");
const scond4 = ref("");
const scond5 = ref("");
const scond6 = ref("");
const status = ref("");

/**
 * 	화면 Load시 실행 스크립트
 */
const mainName = ref("배송(입고)일");
onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  if (
    store.state.userData.lngStoreGroup == "3183" ||
    store.state.userData.lngStoreGroup == "3264"
  ) {
    mainName.value = "발주일자";
  }

  console.log(mainName.value);
});

const popupButton = ref(false);

/**
 *  그리드 클릭 이벤트
 */

const clickedrowData = ref([]);
const formatscond3 = ref("");
const clickedRowData = (newValue) => {
  // console.log(newValue);
  clickedrowData.value = newValue;
  let date =
    store.state.userData.lngStoreGroup == "3183" ||
    store.state.userData.lngStoreGroup == "3264"
      ? newValue[3]
      : newValue[4];
  scond.value = clickedrowData.value[0];
  scond2.value = clickedrowData.value[2];
  scond3.value = date;
  formatscond3.value =
    date.slice(0, 4) + "-" + date.slice(4, 6) + "-" + date.slice(6);
  scond4.value = clickedrowData.value[1];
  scond5.value = clickedrowData.value[10];
  scond6.value = clickedrowData.value[11];
};

/**
 *  그리드 클릭 이벤트
 */

const isDisabled = ref(true);

const clickedrowData2 = ref([]);
const editableColId = ref("dblCheckQty,strCheckComments");
const clickedRowData2 = (newValue) => {
  if (newValue[14] != "01") {
    Swal.fire({
      title: "경고",
      text: "입고확정된 발주데이터는 수정이 불가능합니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    editableColId.value = "";
    return;
  } else {
    editableColId.value = "dblCheckQty,strCheckComments";
  }

  clickedrowData2.value = newValue;
  //scond6.value = clickedrowData2.value[11];
  status.value = clickedrowData2.value[14];
  isDisabled.value = false;
};

/**
 *  그리드 더블클릭 이벤트
 */

const dblclickedRowData = async (e) => {
  popupButton.value = true;
  searchButtonPopup(e);
};

const changeRow = ref(0);
const selectedIndex = (e) => {
  changeRow.value = e;
};
const changeNow = ref(false);
const changeColid = ref("");
const changeValue2 = ref("");

// const updateGridValue = (e) => {
//   // changeColid.value = e.target.name;
//   // changeValue2.value = e.target.value;
//   // // console.log(status.value);
//   // changeNow.value = !changeNow.value;
//   // // if(status.value != "01"){
//   // //   Swal.fire({
//   // //     title: "경고",
//   // //     text: "입고확정된 발주데이터는 수정이 불가능합니다.",
//   // //     icon: "warning",
//   // //     confirmButtonText: "확인",
//   // //   });
//   // //   scond6.value = ""
//   // // 	return;
//   // // } else {
//   // //   changeNow.value = !changeNow.value;
//   // // }
// };

const updatedrowdata = ref([]);
const updatedRowData = (newvalue) => {
  updatedrowdata.value = newvalue;
};

const allstaterows = ref([]);
const allStateRows = (e) => {
  // console.log(e);
  allstaterows.value = e.updated;
  // console.log(allstaterows.value);
};

/**
 *  그리드 검색어 세팅
 */
const store = useStore();

/**
 *  조회 함수
 */

const searchButton = async () => {
  // console.log(selectedDate.value.replaceAll("-", ""));

  try {
    store.state.loading = true;
    const res = await getOrderConfirmDelivery(
      store.state.userData.lngStoreGroup,
      storeCd.value,
      supplierid.value,
      selectedDate.value.replaceAll("-", "")
    );

    rowData.value = res.data.List;
    store.state.loading = false;
  } catch (error) {
    console.log(error);
  }
};

/**
 *  조회 함수
 */

const tempscond6 = ref("");
const searchButtonPopup = async (e) => {
  tempscond6.value = e[11];

  try {
    const res = await getOrderConfirmDeliveryDetail(
      store.state.userData.lngStoreGroup,
      e[12],
      e[13],
      scond2.value,
      e[4]
    );

    console.log(res);

    rowData2.value = res.data.List2;
  } catch (error) {}
};

const resetFlag = ref(false);

const closePopup = () => {
  popupButton.value = false;

  // ✅ 닫을 때만 데이터 초기화
  initGrid2();
  storeCd.value = ""; // 기본값 ""

  resetFlag.value = !resetFlag.value; // 토글 → 자식에서 watch됨
  // console.log("resetFlag 토글됨:", resetFlag.value);  // ← 값이 변하는지 확인

  isDisabled.value = true;
};

/**
 *  저장 버튼 함수
 */

const saveButton = async () => {
  if (allstaterows.value.length == 0 && tempscond6.value == scond6.value) {
    Swal.fire({
      title: "경고",
      text: "변경된 사항이 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  try {
    await Swal.fire({
      title: "확인",
      text: "저장하시겠습니까?",
      icon: "warning", // 'success', 'error', 'warning', 'info', 'question'
      showCancelButton: true, // 취소 버튼 표시
      confirmButtonText: "확인",
      cancelButtonText: "취소",
    }).then(async (result) => {
      if (result.isConfirmed) {
        store.state.loading = true;

        // console.log(updatedrowdata.value);

        const dblCheckQtys = updatedrowdata.value
          .filter((_, index) => allstaterows.value.includes(index))
          .map((item) => item.dblCheckQty)
          .join("\u200b");

        const seqs = updatedrowdata.value
          .filter((_, index) => allstaterows.value.includes(index))
          .map((item) => item.lngOrderSeq)
          .join("\u200b");

        const checkcomments = updatedrowdata.value
          .filter((_, index) => allstaterows.value.includes(index))
          .map((item) => item.strCheckComments)
          .join("\u200b");

        const res = await setOrderConfirmDelivery(
          store.state.userData.lngStoreGroup,
          clickedrowData.value[12],
          scond2.value,
          seqs,
          dblCheckQtys,
          scond6.value,
          checkcomments
        );

        console.log(res);

        store.state.loading = false;

        if (res.data.RESULT_CD == "00") {
          Swal.fire({
            title: "성공",
            text: "저장에 성공하였습니다.",
            icon: "success", // 'success', 'error', 'warning', 'info', 'question'
            confirmButtonText: "확인",
          });
        } else {
          Swal.fire({
            title: "실패",
            text: "저장에 실패하였습니다.",
            icon: "error", // 'success', 'error', 'warning', 'info', 'question'
            confirmButtonText: "확인",
          });
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  } catch (error) {
  } finally {
    // searchButtonPopup();
    searchButton();
  }
};

const exportExcelGrid1 = ref(false);
const selectedExcelStoreGrid1 = ref("");
const documentSubTitleGrid1 = ref("");

/**
 * 엑셀용 매장 세팅 함수
 */

const excelStoreGrid1 = (e) => {
  // console.log(e);
  selectedExcelStoreGrid1.value = e;
};

/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  documentSubTitleGrid1.value =
    "배송(입고)일 : " +
    selectedDate.value +
    "\n" +
    selectedExcelStoreGrid1.value +
    "\n" +
    "거래처명 : " +
    Suppliernm.value;

  // console.log(documentSubTitleGrid1.value);

  exportExcelGrid1.value = !exportExcelGrid1.value;
};

const exportExcelGrid2 = ref(false);
const documentSubTitleGrid2 = ref("");

/**
 * 엑셀 내보내기 함수
 */

const excelButtonGrid2 = () => {
  documentSubTitleGrid2.value =
    "배송(입고)일 : " +
    selectedDate.value +
    "\n" +
    "매장명 : " +
    clickedrowData.value[0] +
    "\n" +
    "거래처명 : " +
    clickedrowData.value[1];

  // console.log(documentSubTitleGrid2.value);

  exportExcelGrid2.value = !exportExcelGrid2.value;
};
</script>

<style></style>
