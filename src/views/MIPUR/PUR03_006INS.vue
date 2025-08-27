<!-- /*--############################################################################
# Filename : PUR03_006INS.vue                                                  
# Description : 마스터관리 > 발주 관리 > 발주 등록Ⅱ(발주일기준)                     
# Date :2025-08-25                                                           
  # Author : 권맑음                     
################################################################################*/ -->
<template>
  <!-- 조회조건 -->
  <div class="flex justify-between items-center w-full overflow-y-hidden">
    <PageName></PageName>
    <div class="flex justify-center mr-9 space-x-2 pr-5">
      <!-- <button @click="searchButton" class="button search md:w-auto w-14">
        조회
      </button>

      <button @click="saveButton" class="button save w-auto">저장</button>
      <button @click="excelButton" class="button excel w-auto">엑셀</button> -->
    </div>
  </div>
  <br />
  <div
    class="grid grid-rows-5 grid-cols-3 bg-gray-200 rounded-lg h-56 items-start justify-start">
    <div class="flex justify-start ml-10">
      <PickStore
        @update:storeGroup="handleStoreGroup"
        @update:storeCd="handleStoreCd"
        @storeNm="handlestoreNm"
        :defaultStoreNm="'선택'"
        :defaultStoreType2="true"
        :defaultStore="true"></PickStore>
    </div>
    <div
      class="flex items-center justify-start space-x-5 mt-2 col-span-2 ml-20">
      <div class="text-base font-semibold text-red-500">발주일자</div>
      <div class="flex space-x-3">
        <input type="date" class="h-7" v-model="cond" @change="searchButton" />
        <button class="whitebutton bg-white" @click="searchButton">
          발주조회
        </button>
      </div>
    </div>
    <div class="flex justify-start ml-12 mt-3 space-x-5 items-center">
      <div class="text-base font-semibold">발주마감일시</div>
      <div>
        <input
          type="text"
          class="border border-black h-7 disabled:bg-white text-red-500"
          v-model="cond2"
          disabled />
      </div>
    </div>

    <div
      class="flex justify-start mt-3 space-x-5 items-center col-span-2 ml-14">
      <div class="text-base font-semibold">코멘트(발주)</div>
      <div>
        <input
          type="text"
          class="border border-black h-7 w-[300%]"
          v-model="cond3" />
      </div>
    </div>

    <div class="flex ml-20 pl-3 mt-2 space-x-5">
      <div class="text-base font-semibold">공급가</div>
      <div>
        <input
          type="text"
          class="border border-black h-7 disabled:bg-white"
          v-model="cond4"
          disabled />
      </div>
    </div>

    <div class="flex ml-20 pl-4 mt-2 space-x-5">
      <div class="text-base font-semibold">부가세</div>
      <div>
        <input
          type="text"
          class="border border-black h-7 disabled:bg-white"
          v-model="cond5"
          disabled />
      </div>
    </div>

    <div class="flex ml-20 pl-4 mt-2 space-x-5">
      <div class="text-base font-semibold">합계</div>
      <div>
        <input
          type="text"
          class="border border-black h-7 disabled:bg-white"
          v-model="cond6"
          disabled />
      </div>
    </div>

    <div class="flex ml-20 mt-2 items-center col-span-3 space-x-20">
      <div class="flex space-x-5 items-center">
        <div class="text-base font-semibold">자재목록</div>
        <div>
          <select
            name=""
            id=""
            class="w-48 border border-black h-7"
            v-model="cond7">
            <option value="0">전체</option>
            <option :value="i.strDCode" v-for="i in optionList">
              {{ i.strDName }}
            </option>
          </select>
        </div>
      </div>
      <div class="flex space-x-5 items-start -mt-1">
        <BusinessClient
          :defaultNm="'전체'"
          class="w-64"
          @SupplierId="SupplierId"></BusinessClient>
      </div>

      <div class="flex space-x-5 items-center">
        <div class="text-base font-semibold">자재분류</div>
        <div>
          <select
            name=""
            id=""
            class="w-48 border border-black h-7"
            v-model="cond9">
            <option value="0">전체</option>
            <option :value="i.lngCategoryID" v-for="i in optionList3">
              {{ i.strCategoryName }}
            </option>
          </select>
        </div>
      </div>

      <div class="flex space-x-5 items-center">
        <div class="text-base font-semibold">자재그룹</div>
        <div>
          <select
            name=""
            id=""
            class="w-48 border border-black h-7"
            v-model="cond10">
            <option value="0">전체</option>
            <option :value="i.lngStockGroupID" v-for="i in optionList4">
              {{ i.strStockGroupName }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div class="flex space-x-5 items-center ml-20">
      <div class="text-base font-semibold">자재특성</div>
      <div>
        <select
          name=""
          id=""
          class="w-48 border border-black h-7"
          v-model="cond11">
          <option value="0">전체</option>
          <option :value="i.lngGenericID" v-for="i in optionList5">
            {{ i.strGenericName }}
          </option>
        </select>
      </div>
    </div>

    <div class="flex space-x-5 items-center col-span-2">
      <div class="text-base font-semibold">자재코드/명</div>
      <div class="flex space-x-5">
        <input
          type="text"
          class="w-48 border border-black h-7"
          v-model="cond12" />
        <input
          type="text"
          class="w-96 border border-black h-7"
          v-model="cond13" />

        <button class="whitebutton bg-white" @click="searchButton2">
          조회
        </button>
      </div>
    </div>
  </div>

  <!-- 조회조건 -->
  <!-- 그리드 영역 -->
  <div
    class="grid grid-rows-1 grid-cols-[7fr,1fr,7fr] justify-center w-[97%] h-[50vh] gap-5 ml-5">
    <div class="mt-2">
      <div class="flex justify-between bg-yellow-100">
        <div class="text-base font-semibold">검색 자재</div>
        <div class="space-x-5">
          <button class="whitebutton bg-white" @click="addButton">추가</button>
          <button class="whitebutton bg-white" @click="excelButton">
            엑셀
          </button>
        </div>
      </div>
      <Realgrid
        class="w-full h-full mt-2"
        :progname="'PUR03_006INS_VUE'"
        :progid="1"
        :rowData="rowData"
        @updatedRowData="updatedRowData"
        @clickedRowData="clickedRowData"
        @allStateRows="allStateRows"
        @clickedButtonCol="clickedButtonCol"
        @checkAllorNot="checkAllorNot"
        @checkedRowData="checkedRowData"
        :exporttoExcel="exporttoExcel"
        :documentTitle="'PUR03_006INS'"
        :documentSubTitle="documentSubTitle"
        :editableColId="'dblOrderQty,strOrderComments'"
        :rowStateeditable="false"
        :checkRowAuto="false"
        :checkRowAuto2="true"
        :checkRenderEditable="true"
        :selectionStyle="'block'"
        :inputOnlyNumberColumn="'dblOrderQty'">
      </Realgrid>
    </div>
    <div class="flex flex-col items-center justify-center space-y-5">
      <div class="whitebutton !font-extrabold !text-black" @click="addButton">
        >
      </div>
      <div class="whitebutton !font-extrabold !text-black"><</div>
    </div>
    <div class="mt-2">
      <div class="flex justify-between bg-yellow-100">
        <div class="text-base font-semibold">발주 자재</div>
        <div class="space-x-5">
          <button class="whitebutton bg-white" @click="deleteButton">
            삭제
          </button>
          <button class="whitebutton bg-white" @click="saveButton">저장</button>
          <button class="whitebutton bg-white" @click="excelButton2">
            엑셀
          </button>
        </div>
      </div>
      <Realgrid
        class="w-full h-full mt-2"
        :progname="'PUR03_006INS_VUE'"
        :progid="2"
        :rowData="rowData2"
        @updatedRowData="updatedRowData2"
        @clickedRowData="clickedRowData2"
        @allStateRows="allStateRows2"
        :exporttoExcel="exporttoExcel2"
        :documentTitle="'PUR03_006INS'"
        :documentSubTitle="documentSubTitle"
        :editableColId="'dblOrderQty,strOrderComments'"
        :rowStateeditable="false"
        :checkRenderEditable="true"
        :selectionStyle="'block'"
        :setFooter="true"
        :notsoftDelete="true"
        :checkRowAuto="false"
        :checkRowAuto2="true"
        :deleteRow7="deleteRow7"
        :addRow4="addRow4"
        :addrowProp="'lngStockID,strStockName,strStandardName,strUnitName,curUnitPrice,dblOrderQty,curSupply,curTax,curTotal,strOrderComments,strGenericName,strSupplierName,dtmExpectedDate,lngStoreGroup,lngStoreCode,strOrderNo,lngOrderSeq,lngSupplierID,dblCheckQty,strStatus,strDemandNo,strCheckComments,lngGenericID,lngOrderAble,lngTaxType,dtmOrderDate'"
        :addrowDefault="addrowDefault"
        :inputOnlyNumberColumn="'dblOrderQty'">
      </Realgrid>
    </div>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import { getCommonList } from "@/api/common";
import {
  getStockCategory,
  getStockGeneric,
  getStockGroup,
  saveStockCycle2,
} from "@/api/master";
import {
  deleteStockOrderItem,
  getOrderDataByDate,
  getOrderDate,
  getStockItemList3,
  getSubSequence,
  saveFavoriteStockItem,
  saveNewOrderTmp,
  saveNewOrderTmp2,
  updateOrderTmp,
} from "@/api/mipur";
import BusinessClient from "@/components/businessClient.vue";
/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
/**
 * 매장 공통 컴포넌트
 */

import PickStore from "@/components/pickStore.vue";
/**
 * 	그리드 생성
 */

import Realgrid from "@/components/realgrid.vue";
/**
 *  페이지로그 자동 입력
 *  */

import {
  formatLocalDate,
  formatNumberWithCommas,
  insertPageLog,
} from "@/customFunc/customFunc";
/**
 *  경고창 호출 라이브러리
 *  */

import Swal from "sweetalert2";
/*
 * 공통 표준  Function
 */

import { nextTick, onMounted, ref } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";

/**
 * 	화면 Load시 실행 스크립트
 */

const hidesub = ref(true);
const hideAttr = ref(true);
const cond = ref("");
const cond2 = ref("");

const optionList = ref([]);
const cond7 = ref("0");
const cond9 = ref("0");
const cond10 = ref("0");
const cond11 = ref("0");
const cond12 = ref("");
const cond13 = ref("");
const optionList2 = ref([]);
const optionList3 = ref([]);
const optionList4 = ref([]);
const optionList5 = ref([]);
onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
  const today = new Date();
  today.setDate(today.getDate() + 1);
  cond.value = formatLocalDate(today);
  const res = await getOrderDate(
    groupCd.value,
    store.state.userData.lngPosition,
    cond.value.replaceAll("-", ""),
    0
  );

  //console.log(res);

  cond.value =
    res.data.List[0].dtmOrderDate.slice(0, 4) +
    "-" +
    res.data.List[0].dtmOrderDate.slice(4, 6) +
    "-" +
    res.data.List[0].dtmOrderDate.slice(6, 8);

  cond2.value =
    res.data.List[0].dtmOrderCloseTime == ""
      ? cond.value + " 12:00"
      : res.data.List[0].dtmOrderCloseTime.slice(0, 4) +
        "-" +
        res.data.List[0].dtmOrderCloseTime.slice(4, 6) +
        "-" +
        res.data.List[0].dtmOrderCloseTime.slice(6, 8) +
        " " +
        res.data.List[0].dtmOrderCloseTime.slice(8, 10) +
        ":" +
        res.data.List[0].dtmOrderCloseTime.slice(10, 12);

  const res2 = await getCommonList(242);

  optionList.value = res2.data.List;

  const res3 = await getStockCategory(store.state.userData.lngStoreGroup);

  optionList3.value = res3.data.List;

  const res4 = await getStockGroup(store.state.userData.lngStoreGroup);

  optionList4.value = res4.data.List;

  const res5 = await getStockGeneric(store.state.userData.lngStoreGroup);

  optionList5.value = res5.data.List;
});

const nowStoreAreaCd = ref();
const nowStoreCd = ref(0);
/**
 * 선택한 포스 번호 호출 함수
 */

/**
 *  그리드 검색어 세팅
 */

const clickedStoreNm = ref();
const commitAll = ref(false);
const store = useStore();
const userData = store.state.userData;
const groupCd = ref("");
const cond3 = ref("");
const cond4 = ref("");
const cond5 = ref("");
const cond6 = ref("");

/**
 * 페이지 매장 코드 세팅
 */
const selectedSupplier = ref("");
const SupplierId = (e) => {
  selectedSupplier.value = e;
  // /console.log(e);
};
const handleStoreGroup = (e) => {
  groupCd.value = e;
};
const first = ref(false);
const handleStoreCd = async (newValue) => {
  //   if (newValue == "0" && store.state.userData.lngCommonMenu == "0") {
  //     afterSearch.value = false;
  //   }
  nowStoreCd.value = newValue;
  searchButton();
};

const checkAllorNot = async (e, e2) => {
  // console.log(e);
  // console.log(e2);
  const stockids = updatedrowdata.value
    .map((item) => item.lngStockID)
    .join("\u200b");
  if (e2 == "lngCheckFovorites") {
    try {
      const res = await saveFavoriteStockItem(
        store.state.userData.lngStoreGroup,
        store.state.userData.lngPosition,
        stockids,
        e == true ? 1 : 0
      );

      // console.log(res);
    } catch (error) {}
  }
};
/**
 * 페이지 매장명 세팅
 */

const handlestoreNm = (newData) => {
  clickedStoreNm.value = newData;
};

/**
 * 조회 상태 초기화
 */

/**
 * 조회 초기화
 */

const allstaterows = ref([]);
const allstaterows2 = ref([]);
const confirmData2 = ref();
const rowData = ref([]);
const rowData2 = ref([]);

const allStateRows = (e) => {
  console.log(e);
  allstaterows.value = e.updated;
};
const allStateRows2 = (e) => {
  console.log(e);
  allstaterows2.value = e;
};
/**
 *  조회 함수
 */

const searchButton = async () => {
  if (first.value == false) {
    first.value = true;
    return;
  }
  if (nowStoreCd.value == 0) {
    Swal.fire({
      title: "경고",
      text: "매장을 선택해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }
  const res = await getOrderDate(
    groupCd.value,
    nowStoreCd.value,
    cond.value.replaceAll("-", ""),
    1
  );

  if (res.data.List[0].strMsg == 9) {
    Swal.fire({
      title: "경고",
      text: "본사에 발주마감 시간 설정을 확인 해 주십시오.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }

  try {
    const res = await getOrderDataByDate(
      groupCd.value,
      nowStoreCd.value,
      cond.value.replaceAll("-", "")
    );
    console.log(res);
    rowData2.value = res.data.List;
    cond3.value = res.data.List2[0].strMComments;

    cond4.value = rowData2.value.reduce((sum, item) => {
      return sum + parseInt(item.curSupply || 0, 10);
    }, 0);
    cond4.value = formatNumberWithCommas(cond4.value);
    cond5.value = rowData2.value.reduce((sum, item) => {
      return sum + parseInt(item.curTax || 0, 10);
    }, 0);
    cond5.value = formatNumberWithCommas(cond5.value);
    cond6.value = rowData2.value.reduce((sum, item) => {
      return sum + parseInt(item.curTotal || 0, 10);
    }, 0);

    cond6.value = formatNumberWithCommas(cond6.value);
  } catch (error) {
    console.log(error);
  }
};

const searchButton2 = async () => {
  if (nowStoreCd.value == 0) {
    Swal.fire({
      title: "경고",
      text: "매장을 선택해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }
  // const res = await getOrderDate(
  //   groupCd.value,
  //   nowStoreCd.value,
  //   cond.value.replaceAll("-", ""),
  //   1
  // );

  // if (res.data.List[0].strMsg == 9) {
  //   Swal.fire({
  //     title: "경고",
  //     text: "본사에 발주마감 시간 설정을 확인 해 주십시오.",
  //     icon: "warning",

  //     confirmButtonText: "확인",
  //   });
  //   return;
  // }

  try {
    store.state.loading = true;
    const res = await getStockItemList3(
      groupCd.value,
      nowStoreCd.value,
      store.state.userData.lngPosition,
      cond.value.replaceAll("-", ""),
      cond7.value,
      selectedSupplier.value,
      cond9.value,
      cond10.value,
      cond11.value,
      cond12.value,
      cond13.value
    );
    store.state.loading = false;
    console.log(res);
    rowData.value = res.data.List;
  } catch (error) {
    console.log(error);
  }
};

/**
 * 데이터셋 상세정보 셋팅
 */

const clickFirst = ref(false);
const clickedButtonCol = async (e) => {
  console.log(e);
  //saveFavoriteId.value = e;
  if (e == "lngCheckFovorites") {
    try {
      const res = await saveFavoriteStockItem(
        store.state.userData.lngStoreGroup,
        store.state.userData.lngPosition,
        saveFavoriteId.value,
        saveFavoriteValue.value == true ? 1 : 0
      );

      console.log(res);
    } catch (error) {}
  }
};
const saveFavoriteGroup = ref("");
const saveFavoriteStore = ref("");
const saveFavoriteId = ref("");
const saveFavoriteValue = ref("");
const clickedRowData = async (newValue) => {
  console.log(newValue);

  saveFavoriteGroup.value = newValue[15];
  saveFavoriteStore.value = newValue[16];
  saveFavoriteId.value = newValue[2];
  saveFavoriteValue.value = newValue[1];
  // try {
  //   const res =await saveFavoriteStockItem(newValue[15] , newValue[16] , )
  // } catch (error) {

  // }
};
/**
 * 데이터셋 상세정보 셋팅
 */

/**
 * 입력창 수정 데이터 갱신
 */

const updatedrowdata = ref([]);
const updatedrowdata2 = ref([]);
/**

/**
 * 입력창 수정 데이터 갱신
 */
const disabled = ref(false);
const updatedRowData = (newValue) => {
  console.log(newValue);
  updatedrowdata.value = newValue;
};
const updatedRowData2 = (newValue) => {
  console.log(newValue);
  updatedrowdata2.value = newValue;
};
const deleterow = ref(false);
const deleterow2 = ref(false);
/**
 * 그리드 행 삭제 버튼 함수
 */

const deleteRow2 = () => {
  deleterow2.value = !deleterow2.value;
};

/**
 * 그리드 행 삭제 버튼 함수
 */

/**
 *  저장 버튼 함수
 */

const saveButton = async () => {
  const filteredLen = updatedrowdata2.value.filter(
    (item) => item.dblOrderQty == 0
  ).length;

  //console.log(updatedrowdata2.value);
  if (filteredLen > 0) {
    Swal.fire({
      title: "경고",
      text: "발주수량은 0보다 커야합니다.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }

  if (allstaterows2.value.created == 0 && allstaterows2.value.updated == 0) {
    Swal.fire({
      title: "경고",
      text: "변경된 사항이 존재하지 않습니다. 확인해주세요.",
      icon: "warning", // 'success', 'error', 'warning', 'info', 'question'

      confirmButtonText: "확인",
    });
    return;
  }

  try {
    const res = await getOrderDate(
      groupCd.value,
      nowStoreCd.value,
      cond.value.replaceAll("-", ""),
      2
    );
    console.log(res);
    if (res.data.List[0].strMsg == "1") {
      Swal.fire({
        title: "실패",
        text: "해당 발주일자는 마감 되었습니다. 다른 발주일자로 변경해 주십시오.",
        icon: "error", // 'success', 'error', 'warning', 'info', 'question'

        confirmButtonText: "확인",
      });
      return;
    } else if (res.data.List[0].strMsg !== "0") {
      Swal.fire({
        title: "실패",
        text: "발주등록 오류. 피앤시월드에 문의해 주십시오.",
        icon: "error", // 'success', 'error', 'warning', 'info', 'question'

        confirmButtonText: "확인",
      });
      return;
    } else {
      // return;
    }

    // if(res.data)
  } catch (error) {
    console.log(error);
  }
  try {
    await Swal.fire({
      title: "확인",
      text: "저장하시겠습니까?",
      icon: "question", // 'success', 'error', 'warning', 'info', 'question'
      showCancelButton: true, // 취소 버튼 표시
      confirmButtonText: "확인",
      cancelButtonText: "취소",
    }).then(async (result) => {
      if (result.isConfirmed) {
        store.state.loading = true;
        let result = 0;
        const res2 = await getSubSequence(
          store.state.userData.lngSequence,
          groupCd.value,
          nowStoreCd.value,
          cond.value.replaceAll("-", "")
        );

        const subsequence = res2.data.List[0].lngSubSequence;
        console.log(subsequence);

        if (allstaterows2.value.created.length > 0) {
          const groupcds = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.created.includes(index))
            .map((item) => item.lngStoreGroup)
            .join("\u200b");
          const storecds = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.created.includes(index))
            .map((item) => item.lngStoreCode)
            .join("\u200b");
          const stockids = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.created.includes(index))
            .map((item) => item.lngStockID)
            .join("\u200b");
          const expecteddates = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.created.includes(index))
            .map((item) => item.dtmExpectedDate)
            .join("\u200b");
          const orderdates = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.created.includes(index))
            .map((item) => item.dtmOrderDate)
            .join("\u200b");
          const supplierids = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.created.includes(index))
            .map((item) => item.lngSupplierID)
            .join("\u200b");
          const orderqtys = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.created.includes(index))
            .map((item) => item.dblOrderQty)
            .join("\u200b");
          const curunitprices = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.created.includes(index))
            .map((item) => item.curUnitPrice)
            .join("\u200b");
          const cursupplys = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.created.includes(index))
            .map((item) => item.curSupply)
            .join("\u200b");

          const curtaxs = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.created.includes(index))
            .map((item) => item.curTax)
            .join("\u200b");

          const comments = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.created.includes(index))
            .map((item) => item.strOrderComments)
            .join("\u200b");

          const res = await saveNewOrderTmp(
            groupcds,
            storecds,
            store.state.userData.lngSequence,
            subsequence,
            stockids,
            expecteddates,
            orderdates,
            supplierids,
            orderqtys,
            curunitprices,
            cursupplys,
            curtaxs,
            comments
          );
          console.log(res); // 애매 ?
          const res2 = await saveNewOrderTmp2(
            groupCd.value,
            nowStoreCd.value,
            store.state.userData.lngSequence,
            subsequence,
            cond.value.replaceAll("-", ""),
            cond3.value
          );
          console.log(res2);

          if (res2.data.RESULT_CD == "00") {
            result += 1;
          }
        }

        if (allstaterows2.value.updated.length > 0) {
          const groupcds = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.updated.includes(index))
            .map((item) => item.lngStoreGroup)
            .join("\u200b");
          const storecds = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.updated.includes(index))
            .map((item) => item.lngStoreCode)
            .join("\u200b");
          const orderNos = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.updated.includes(index))
            .map((item) => item.strOrderNo)
            .join("\u200b");
          const orderseqs = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.updated.includes(index))
            .map((item) => item.lngOrderSeq)
            .join("\u200b");
          const supplierids = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.updated.includes(index))
            .map((item) => item.lngSupplierID)
            .join("\u200b");

          const stockids = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.updated.includes(index))
            .map((item) => item.lngStockID)
            .join("\u200b");
          const dblorderqty = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.updated.includes(index))
            .map((item) => item.dblOrderQty)
            .join("\u200b");
          const cursupplys = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.updated.includes(index))
            .map((item) => item.curSupply)
            .join("\u200b");

          const curtaxs = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.updated.includes(index))
            .map((item) => item.curTax)
            .join("\u200b");

          const curtotals = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.updated.includes(index))
            .map((item) => item.curTotal)
            .join("\u200b");

          const comments1 = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.updated.includes(index))
            .map((item) => item.strCheckComments)
            .join("\u200b");

          const comments2 = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.updated.includes(index))
            .map((item) => item.strOrderComments)
            .join("\u200b");

          const res = await updateOrderTmp(
            groupcds,
            storecds,
            orderNos,
            orderseqs,
            supplierids,
            stockids,
            dblorderqty,
            cursupplys,
            curtaxs,
            comments1,
            comments2,
            store.state.userData.lngSequence
          );
          console.log(res); // 애매 ?
          if (res.data.RESULT_CD == "00") {
            result += 1;
          }
        }

        // console.log(result);
        // console.log(allstaterows2.value);
        if (
          allstaterows2.value.updated.length > 0 &&
          allstaterows2.value.created.length > 0 &&
          result == 2
        ) {
          Swal.fire({
            title: "성공",
            text: "저장을 완료하였습니다.",
            icon: "success",

            confirmButtonText: "확인",
          });
        } else if (
          allstaterows2.value.updated.length > 0 &&
          allstaterows2.value.created.length == 0 &&
          result == 1
        ) {
          Swal.fire({
            title: "성공",
            text: "저장을 완료하였습니다.",
            icon: "success",

            confirmButtonText: "확인",
          });
        } else if (
          allstaterows2.value.updated.length == 0 &&
          allstaterows2.value.created.length > 0 &&
          result == 1
        ) {
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
        store.state.loading = false;

        searchButton();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // 취소 눌렀을 때 실행할 코드
        //console.log("취소 버튼 클릭됨");
      }
    });
  } catch (error) {
    console.log(error);
  } finally {
  }
};
const exporttoExcel = ref(false);
const exporttoExcel2 = ref(false);
/**
 * 엑셀 내보내기 함수
 */
const documentSubTitle = ref("");
const excelButton = () => {
  documentSubTitle.value =
    "매장명 :" + clickedStoreNm.value + "\n" + "발주일자 : " + cond.value;

  exporttoExcel.value = !exporttoExcel.value;
};

const excelButton2 = () => {
  documentSubTitle.value =
    "매장명 :" + clickedStoreNm.value + "\n" + "발주일자 : " + cond.value;

  exporttoExcel2.value = !exporttoExcel2.value;
};

const addrowDefault = ref("");
const addRow4 = ref(false);
const addButton = async () => {
  const set1 = new Set(
    updatedrowdata.value
      .filter((item) => item.lngCheck == true)
      .map((item) => item.lngStockID)
  );

  const hasDupli = updatedrowdata2.value.some((item) =>
    set1.has(item.lngStockID)
  );

  // console.log(updatedrowdata.value);
  // console.log(rowData2.value);
  if (hasDupli == true) {
    Swal.fire({
      title: "경고",
      text: "중복된 자재코드가 존재합니다. 확인해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }
  console.log(updatedrowdata.value);
  updatedrowdata.value = updatedrowdata.value
    .filter((item) => item.lngCheck == true)
    .map((item) => ({
      ...item,
      lngCheck: false,
      dtmOrderDate: cond.value.replaceAll("-", ""),
    }));

  for (let i = 0; i < updatedrowdata.value.length; i++) {
    addrowDefault.value =
      updatedrowdata.value[i].lngStockID +
      "," +
      updatedrowdata.value[i].strStockName +
      "," +
      updatedrowdata.value[i].strStandardName +
      "," +
      updatedrowdata.value[i].strUnitName +
      "," +
      updatedrowdata.value[i].curUnitPrice +
      "," +
      updatedrowdata.value[i].dblOrderQty +
      "," +
      updatedrowdata.value[i].curSupply +
      "," +
      updatedrowdata.value[i].curTax +
      "," +
      updatedrowdata.value[i].curTotal +
      "," +
      updatedrowdata.value[i].strOrderComments +
      "," +
      updatedrowdata.value[i].strGenericName +
      "," +
      updatedrowdata.value[i].strSupplierName +
      "," +
      formatLocalDate(updatedrowdata.value[i].dtmExpectedDate).replaceAll(
        "-",
        ""
      ) +
      "," +
      updatedrowdata.value[i].lngStoreGroup +
      "," +
      updatedrowdata.value[i].lngStoreCode +
      "," +
      updatedrowdata.value[i].strOrderNo +
      "," +
      updatedrowdata.value[i].lngOrderSeq +
      "," +
      updatedrowdata.value[i].lngSupplierID +
      "," +
      updatedrowdata.value[i].dblCheckQty +
      "," +
      updatedrowdata.value[i].strStatus +
      "," +
      updatedrowdata.value[i].strDemandNo +
      "," +
      updatedrowdata.value[i].strCheckComments +
      "," +
      updatedrowdata.value[i].lngGenericID +
      "," +
      updatedrowdata.value[i].lngOrderAble +
      "," +
      updatedrowdata.value[i].lngTaxType +
      "," +
      updatedrowdata.value[i].dtmOrderDate;

    console.log(addrowDefault.value);
    addRow4.value = !addRow4.value;

    await nextTick();
  }

  // rowData2.value = rowData2.value.concat(updatedrowdata.value);

  // updatedrowdata2.value = JSON.parse(JSON.stringify(rowData2.value));
  rowData.value = rowData.value.map((item) => ({
    ...item,
    lngCheck: false,
  }));
};

const deleteRow7 = ref(false);
const deleteButton = async () => {
  console.log(updatedrowdata2.value);

  const checkedRows = updatedrowdata2.value.filter(
    (item) => item.lngCheck == true
  );

  try {
    store.state.loading = true;

    const groupcds = checkedRows
      .map((item) => item.lngStoreGroup)
      .join("\u200b");
    const storecds = checkedRows
      .map((item) => item.lngStoreCode)
      .join("\u200b");
    const ordernos = checkedRows.map((item) => item.strOrderNo).join("\u200b");
    const orderseqs = checkedRows
      .map((item) => item.lngOrderSeq)
      .join("\u200b");
    const stockids = checkedRows.map((item) => item.lngStockID).join("\u200b");
    const supplierids = checkedRows
      .map((item) => item.lngSupplierID)
      .join("\u200b");

    const res = await deleteStockOrderItem(
      groupcds,
      storecds,
      ordernos,
      orderseqs,
      stockids,
      supplierids,
      store.state.userData.lngSequence
    );

    console.log(res);
    store.state.loading = false;
    deleteRow7.value = !deleteRow7.value;
  } catch (error) {}
};
</script>

<style></style>
