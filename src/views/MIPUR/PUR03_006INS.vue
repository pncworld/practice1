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
        :editableColId="'lngLeadTime'"
        :rowStateeditable="false"
        :checkRenderEditable="true"
        :selectionStyle="'block'"
        :inputOnlyNumberColumn="'lngLeadTime'">
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
          <button class="whitebutton bg-white">저장</button>
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
        :editableColId="'lngLeadTime'"
        :rowStateeditable="false"
        :checkRenderEditable="true"
        :selectionStyle="'block'"
        :setFooter="true"
        :notsoftDelete="true"
        :checkRowAuto="false"
        :deleteRow7="deleteRow7"
        :inputOnlyNumberColumn="'lngLeadTime'">
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
  saveFavoriteStockItem,
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

import { onMounted, ref } from "vue";
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
const addrowDefault = ref();
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
const confirmData2 = ref();
const rowData = ref([]);
const rowData2 = ref([]);

const allStateRows = (e) => {
  console.log(e);
  allstaterows.value = e.updated;
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
  if (allstaterows.value.length == 0) {
    Swal.fire({
      title: "경고",
      text: "변경된 사항이 없습니다.",
      icon: "warning",

      confirmButtonText: "확인",
    });
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
        const storecds = updatedrowdata.value
          .filter((_, index) => allstaterows.value.includes(index))
          .map((item) => item.lngStoreCode)
          .join("\u200b");
        const leadtimes = updatedrowdata.value
          .filter((_, index) => allstaterows.value.includes(index))
          .map((item) => item.lngLeadTime)
          .join("\u200b");
        const blnsun = updatedrowdata.value
          .filter((_, index) => allstaterows.value.includes(index))
          .map((item) => (item.blnSunday == true ? 1 : 0))
          .join("\u200b");
        const blnmon = updatedrowdata.value
          .filter((_, index) => allstaterows.value.includes(index))
          .map((item) => (item.blnMonday == true ? 1 : 0))
          .join("\u200b");
        const blntue = updatedrowdata.value
          .filter((_, index) => allstaterows.value.includes(index))
          .map((item) => (item.blnThuesday == true ? 1 : 0))
          .join("\u200b");
        const blnwed = updatedrowdata.value
          .filter((_, index) => allstaterows.value.includes(index))
          .map((item) => (item.blnWednesday == true ? 1 : 0))
          .join("\u200b");
        const blnthur = updatedrowdata.value
          .filter((_, index) => allstaterows.value.includes(index))
          .map((item) => (item.blnThursday == true ? 1 : 0))
          .join("\u200b");
        const blnfri = updatedrowdata.value
          .filter((_, index) => allstaterows.value.includes(index))
          .map((item) => (item.blnFriday == true ? 1 : 0))
          .join("\u200b");
        const blnsat = updatedrowdata.value
          .filter((_, index) => allstaterows.value.includes(index))
          .map((item) => (item.blnSaturday == true ? 1 : 0))
          .join("\u200b");
        const res = await saveStockCycle2(
          store.state.userData.lngStoreGroup,
          storecds,
          0,
          leadtimes,
          blnsun,
          blnmon,
          blntue,
          blnwed,
          blnthur,
          blnfri,
          blnsat
        );
        store.state.loading = false;
        console.log(res);

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
        // 취소 눌렀을 때 실행할 코드
        //console.log("취소 버튼 클릭됨");
      }
    });
  } catch (error) {
  } finally {
    searchButton();
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

const addButton = async () => {
  const set1 = new Set(updatedrowdata.value.map((item) => item.lngStockID));

  const hasDupli = rowData2.value.some((item) => set1.has(item.lngStockID));

  if (hasDupli == true) {
    Swal.fire({
      title: "경고",
      text: "중복된 자재코드가 존재합니다. 확인해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }

  updatedrowdata.value = updatedrowdata.value
    .filter((item) => item.lngCheck == true)
    .map((item) => ({
      ...item,
      lngCheck: false,
    }));
  rowData2.value = rowData2.value.concat(updatedrowdata.value);
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
