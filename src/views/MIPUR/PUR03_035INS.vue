<!-- /*--############################################################################
# Filename : PUR03_035INS.vue                                                  
# Description : 마스터관리 > 발주 관리 > 발주 등록Ⅱ(파트별)                     
# Date :2025-09-18                                                           
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <!-- 조회조건 -->
  <div class="flex justify-between items-center w-full overflow-y-hidden">
    <PageName></PageName>
    <div class="flex justify-center mr-9 space-x-2 pr-5">
      <button @click="addButton" class="button new md:w-auto w-14">신규</button>

      <button @click="searchButton" class="button search w-auto">조회</button>
      <button @click="excelButton" class="button excel w-auto">엑셀</button>
    </div>
  </div>
  <br />
  <div
    class="grid grid-rows-1 grid-cols-4 bg-gray-200 rounded-lg h-14 items-start justify-start">
    <div class="flex justify-start">
      <Datepicker_Order
        @endDate="endDate"
        @startDate="startDate"
        :initToday="0"        
        :initToday2="-7"></Datepicker_Order>
    </div>
    <div class="flex items-center justify-start space-x-5 ml-20">
      <PickStore
        :setDynamicStoreClass="'!h-8 !p-0'"
        :defaultStoreNm="'전체'"
        @update:storeCd="handleStoreCd"
        @storeNm="storeNm"
        :hideGroup="false"
        :hideAttr="false"></PickStore>
    </div>
    <div class="flex justify-start ml-20 mt-2 space-x-5 items-center">
      <div class="text-base font-semibold">파트</div>
      <div>
        <select
          name=""
          id=""
          class="border border-black w-32 h-8"
          v-model="cond">
          <option :value="i.lngPartCode" v-for="i in optionList">
            {{ i.strPartName }}
          </option>
        </select>
      </div>
    </div>

    <div class="flex justify-start ml-12 space-x-5 items-center">
      <BusinessClient
        :setDynamicClass="'!h-8'"
        @SupplierNm="SupplierNm"
        @SupplierId="SupplierId"
        :defaultNm="'전체'"></BusinessClient>
    </div>
  </div>

  <!-- 조회조건 -->
  <!-- 그리드 영역 -->
  <div class="w-full h-[80%]">
    <Realgrid
      :progid="1"
      :setFooter="true"
      :rowStateeditable="false"
      :progname="'PUR03_035INS_VUE'"
      :exporttoExcel="exporttoExcel"
      :documentSubTitle="documentSubTitle"
      :documentTitle="'PUR03_035INS'"
      :rowData="rowData"></Realgrid>
  </div>

  <div
    v-if="openpopup"
    class="fixed bottom-2 right-2 w-[87%] h-[85%] flex items-center justify-center bg-black/100 z-40">
    <!-- 팝업 컨텐츠 박스 -->
    <div
      class="bg-white p-6 rounded-xl shadow-lg w-full h-full border border-black">
      <div class="flex justify-between">
        <h2 class="text-lg font-bold mb-4">신규 발주(파트별)</h2>

        <button
          @click="closeOpenpopup"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          닫기
        </button>
      </div>
      <div
        class="grid grid-rows-3 grid-cols-[1fr,2fr,1fr,2fr,1fr,2fr,1fr,2fr] h-[10vh]">
        <div
          class="bg-gray-100 text-base font-semibold flex justify-center items-center border-l border-t border-black">
          발주마감
        </div>
        <div
          class="flex justify-center items-center border-l border-t border-black">
          <input
            type="text"
            class="border border-black h-[80%] w-[80%] disabled:bg-gray-200"
            disabled
            v-model="scond" />
        </div>
        <div
          class="flex justify-start items-center border-l border-t border-r border-black text-red-500 col-span-6">
          발주 등록시 파트를 먼저 선택해주세요.
        </div>
        <div
          class="bg-gray-100 text-base font-semibold flex justify-center items-center border-l border-t border-black">
          매장명
        </div>
        <div
          class="flex justify-center items-center border-l border-t border-black">
          <pickStore
            :hideGroup="false"
            :hideAttr="false"
            :disabledAll="true"
            :setDefaultStoreCd="storeCd"
            :setDynamicStoreClass="'!h-7 !p-0 !-ml-6 !-mt-1'"
            :mainName="''"></pickStore>
        </div>
        <div
          class="bg-gray-100 text-base font-semibold flex justify-center items-center border-l border-t border-black">
          발주일
        </div>
        <div
          class="flex justify-center items-center border-l border-t border-black">
          <input
            type="date"
            class="border border-black h-[80%] w-[80%]"
            @change="setScond3"
            v-model="scond2" />
        </div>
        <div
          class="bg-gray-100 text-base font-semibold flex justify-center items-center border-l border-t border-black">
          납기예정일
        </div>
        <div
          class="flex justify-center items-center border-l border-t border-black">
          <input
            type="date"
            class="border border-black h-[80%] w-[80%]"
            v-model="scond3" />
        </div>

        <div
          class="flex justify-center items-center border-l border-t border-r border-black col-span-2 space-x-3">
          <button class="whitebutton" @click="saveButton2">저장</button>
          <button class="whitebutton">전표삭제</button>
          <button class="whitebutton" @click="deleteStock2">자재제거</button>
        </div>
        <div
          class="bg-orange-200 text-base font-semibold flex justify-center items-center border-l border-t border-b border-black">
          파트명
        </div>
        <div
          class="flex justify-center items-center border-l border-t border-b border-black">
          <select
            name=""
            id=""
            class="border border-black w-[80%] h-[80%]"
            v-model="scond4"
            @change="searchButton4">
            <option :value="i.lngPartCode" v-for="i in optionList">
              {{ i.strPartName }}
            </option>
          </select>
        </div>
        <div
          class="bg-gray-100 text-base font-semibold flex justify-center items-center border-l border-t border-b border-black">
          코멘트
        </div>
        <div
          class="border-l border-t border-r border-b border-black col-span-5 flex justify-center items-center">
          <input
            type="text"
            class="border border-black w-[80%] h-[80%]"
            v-model="scond5" />
        </div>
      </div>
      <div class="h-[35%] w-full">
        <Realgrid
          :progid="2"
          :progname="'PUR03_035INS_VUE'"
          @updatedRowData="updatedRowData2"
          :editableColId="'dblOrderQty,strOrderComments'"
          :checkRowAuto="false"
          :setFooter="true"
          :checkRowAuto2="true"
          :checkRenderEditable="true"
          :rowStateeditable="false"
          :rowData="rowData2"></Realgrid>
      </div>
      <div class="flex justify-between mt-2 space-x-3">
        <div class="flex items-center justify-center space-x-3">
          <div class="text-base font-semibold">자재목록</div>
          <div>
            <select
              name=""
              id=""
              class="border border-black w-48 h-8"
              v-model="scond7"
              @change="searchButton3">
              <option value="1">최근등록</option>
              <option value="2">즐겨찾기</option>
            </select>
          </div>

          <div class="-mt-1">
            <businessClient
              :setDynamicClass="'-mt-1 h-8'"
              @SupplierId="SupplierId2"></businessClient>
          </div>
          <div class="text-base font-semibold">자재코드/이름</div>
          <div>
            <input
              type="text"
              class="border border-black w-[80%] h-8"
              v-model="scond6"
              @input="setScond6" />
          </div>
        </div>
        <div class="space-x-3">
          <button class="whitebutton" @click="showStockList">자재추가</button>
          <button class="whitebutton" @click="deleteStock">자재제거</button>
        </div>
      </div>
      <div class="h-[35%] mt-5">
        <Realgrid
          :progid="3"
          :progname="'PUR03_035INS_VUE'"
          :rowStateeditable="false"
          :setFooter="true"
          :CalculateTaxColId="'curTax'"
          :searchColId3="['lngSupplierID']"
          :searchValue="searchValue2"
          :inputOnlyNumberColumn="'dblOrderQty'"
          :CalculateTaxColId2="'curSupply'"
          :editableColId="'dblOrderQty,strOrderComments'"
          @updatedRowData="updatedRowData3"
          :checkRowAuto="false"
          :checkRowAuto2="true"
          :checkRenderEditable="true"
          :searchColId="'lngStockID,strStockName'"
          :searchWord3="scond6"
          :rowData="rowData3"></Realgrid>
      </div>
    </div>
  </div>

  <div
    v-if="openpopup2"
    class="fixed bottom-2 right-2 w-[52%] h-[85%] flex items-center justify-center bg-black/100 z-50">
    <div
      class="bg-white p-6 rounded-xl shadow-lg w-full h-full border border-black">
      <div class="flex justify-end space-x-2">
        <button class="whitebutton" @click="addButton2">추가</button>
        <button class="whitebutton" @click="openpopup2 = false">닫기</button>
      </div>
      <div class="grid grid-rows-2 grid-cols-[1fr,2fr,1fr,2fr]">
        <div
          class="bg-gray-100 text-base font-semibold flex justify-center items-center border-l border-t border-black">
          자재특성
        </div>
        <div
          class="border-l border-t border-black flex justify-center items-center">
          <select
            name=""
            id=""
            class="w-[80%] h-[80%] border border-black"
            @change="setSearchValue"
            v-model="sscond">
            <option value="-1">전체</option>
            <option :value="i.lngGenericID" v-for="i in optionList2">
              {{ i.strGenericName }}
            </option>
          </select>
        </div>
        <div
          class="bg-gray-100 text-base font-semibold flex justify-center items-center border-l border-t border-b border-black">
          거래처
        </div>
        <div class="border-l border-t border-r border-black">
          <BusinessClient
            :defaultName="''"
            :defaultNm="'전체'"
            @SupplierId="SupplierId"
            :setDynamicClass="'!-mt-1 -ml-2 h-[80%] w-[80%]'"></BusinessClient>
        </div>
        <div
          class="bg-gray-100 text-base font-semibold flex justify-center items-center border-l border-t border-b border-black">
          자재코드/이름
        </div>
        <div
          class="flex border border-black col-span-3 space-x-3 items-center justify-start pl-6">
          <input
            type="text"
            class="w-[30%] h-[80%] border border-black"
            @input="searchWord"
            v-model="sscond2" />
        </div>
      </div>
      <div class="w-full h-[90%] mt-1">
        <Realgrid
          :progname="'PUR03_035INS_VUE'"
          :progid="4"
          :searchWord3="sscond2"
          :headerCheckBar="'lngCheck,lngFavorites'"
          @updatedRowData="updatedRowData4"
          :rowStateeditable="false"
          :checkRenderEditable="true"
          :checkRowAuto="false"
          :checkRowAuto2="true"
          @clickedRowData="clickedRowData"
          @checkedRowData2="checkedRowData2"
          :checkedRowData2Col="'lngFavorites'"
          :searchColId="'lngStockID,strStockName'"
          :searchColId3="['lngGenericID', 'lngSupplierID']"
          :searchValue="searchValue"
          :rowData="rowData4"></Realgrid>
      </div>
    </div>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import { getStockGeneric } from "@/api/master";
import {
  getCloseDtmDate2,
  getStockItemListWithFavorite,
  saveFavoriteStockItemBypart,
  saveOrderMasterDetailByPart,
} from "@/api/mipur";
import { getLossMasterPartList, getStockOrderList } from "@/api/mistock";
import BusinessClient from "@/components/businessClient.vue";
import Datepicker_Order from "@/components/Datepicker_Order.vue";
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

import { formatLocalDate, insertPageLog } from "@/customFunc/customFunc";
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

const hidesub = ref(true);
const hideAttr = ref(true);
const cond = ref("0");
const cond2 = ref("");

const cond7 = ref("0");
const cond9 = ref("0");
const cond10 = ref("0");
const cond11 = ref("0");
const cond12 = ref("");
const cond13 = ref("");

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  console.log(store.state.userData);

  const res3 = await getStockGeneric(store.state.userData.lngStoreGroup);

  optionList2.value = res3.data.List;
});

const nowStoreAreaCd = ref();
const nowStoreCd = ref(0);
/**
 * 선택한 포스 번호 호출 함수
 */

/**
 *  그리드 검색어 세팅
 */
const sdate = ref("");
const edate = ref("");
const startDate = (e) => {
  sdate.value = e;
};
const endDate = (e) => {
  edate.value = e;
};
const clickedStoreNm = ref();
const commitAll = ref(false);
const store = useStore();
const userData = store.state.userData;
const groupCd = ref(store.state.userData.lngStoreGroup);
const cond3 = ref("");
const cond4 = ref("");
const cond5 = ref("");
const cond6 = ref("");
const storeCd = ref(0);
const optionList = ref([]);
const optionList2 = ref([]);
const handleStoreCd = async (e) => {
  storeCd.value = e;
  const res2 = await getLossMasterPartList(
    store.state.userData.lngStoreGroup,
    storeCd.value
  );

  optionList.value = res2.data.List;
};

const allstaterows2 = ref([]);

const rowData = ref([]);
const rowData2 = ref([]);

/**
 *  조회 함수
 */
const supplierid = ref("0");
const suppliernm = ref("");
const SupplierId = (e) => {
  searchValue.value = [searchValue.value[0], e == "0" ? "-1" : e];
};
const SupplierNm = (e) => {
  suppliernm.value = e;
};
const searchButton = async () => {
  try {
    store.state.loading = true;
    const res = await getStockOrderList(
      groupCd.value,
      storeCd.value,
      sdate.value.replaceAll("-", ""),
      edate.value.replaceAll("-", ""),
      supplierid.value,
      cond.value,
      store.state.userData.strLanguage
    );
    store.state.loading = false;
    rowData.value = res.data.List;
  } catch (error) {}
};

const updatedrowdata = ref([]);
const updatedrowdata2 = ref([]);
/**

/**
 * 입력창 수정 데이터 갱신
 */
const disabled = ref(false);
const updatedRowData = (newValue) => {
  //console.log(newValue);
  updatedrowdata.value = newValue;
};
const updatedRowData2 = (newValue) => {
  //console.log(newValue);
  updatedrowdata2.value = newValue;
};

/**
 * 그리드 행 삭제 버튼 함수
 */

const exporttoExcel = ref(false);

/**
 * 엑셀 내보내기 함수
 */
const documentSubTitle = ref("");

const storeNm = (e) => {
  clickedStoreNm.value = e;
};
const excelButton = () => {
  documentSubTitle.value =
    "매장명 :" +
    clickedStoreNm.value +
    "\n" +
    "발주일자 : " +
    sdate.value +
    "~" +
    edate.value +
    "\n파트 : " +
    optionList.value.filter((item) => item.lngPartCode == cond.value)[0]
      .strPartName;

  exporttoExcel.value = !exporttoExcel.value;
};

const openpopup = ref(false);
const addButton = async () => {
  if (storeCd.value == "0") {
    Swal.fire({
      title: "경고",
      text: "매장을 선택해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }
  scond2.value = formatLocalDate(new Date());
  scond3.value = formatLocalDate(new Date().setDate(new Date().getDate() + 1));

  try {
    const res = await getCloseDtmDate2(
      store.state.userData.lngStoreGroup,
      storeCd.value,
      scond3.value.replaceAll("-", ""),
      0
    );
    console.log(res);

    scond.value =
      res.data.List[0].dtmOrderCloseDate.slice(0, 4) +
      "년" +
      res.data.List[0].dtmOrderCloseDate.slice(4, 6) +
      "월" +
      res.data.List[0].dtmOrderCloseDate.slice(6, 8) +
      "일" +
      " " +
      res.data.List[0].dtmOrderCloseDate.slice(8, 10) +
      ":" +
      res.data.List[0].dtmOrderCloseDate.slice(10, 12);
  } catch (error) {}

  openpopup.value = true;
};

const scond = ref("");
const scond2 = ref("");
const scond3 = ref("");
const scond4 = ref("0");
const scond5 = ref("");
const openpopup2 = ref(false);
const showStockList = () => {
  if (scond4.value == "0") {
    Swal.fire({
      title: "경고",
      text: "파트를 먼저 선택해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }

  openpopup2.value = true;
  searchButton2();
};

const sscond = ref("-1");
const sscond2 = ref("");

const rowData4 = ref([]);

const searchButton2 = async () => {
  try {
    store.state.loading = true;
    const res = await getStockItemListWithFavorite(
      store.state.userData.lngStoreGroup,
      storeCd.value,
      scond4.value,
      3,
      ""
    );

    console.log(res);
    store.state.loading = false;
    updatedrowdata4.value = [];
    rowData4.value = res.data.List;
  } catch (error) {
    store.state.loading = false;
  } finally {
    store.state.loading = false;
  }
};

const searchValue = ref(["-1", "-1"]);

const setSearchValue = (e) => {
  searchValue.value = [e.target.value, searchValue.value[1]];
};

const searchWord = (e) => {
  sscond2.value = e.target.value;
};

const checkedRowData2 = async (e) => {
  const res = await saveFavoriteStockItemBypart(
    store.state.userData.lngStoreGroup,
    storeCd.value,
    e[3],
    e[1] == true ? 0 : 1,
    scond4.value
  );
  console.log(res);
};
const tempColId = ref("");
const clickedButtonCol = (e) => {
  console.log(e);
  tempColId.value = e;
};

const updatedrowdata4 = ref([]);
const updatedRowData4 = (e) => {
  updatedrowdata4.value = e.filter((item) => item.lngCheck == true);
  console.log(updatedrowdata4.value);
};

const rowData3 = ref([]);
const addButton2 = () => {
  if (updatedrowdata4.value.length == 0) {
    Swal.fire({
      title: "경고",
      text: "추가하실 자재를 선택해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }

  rowData3.value = updatedrowdata4.value.map((item) => ({
    ...item,
    dblOrderQty: 0,
    curSupply: 0,
    lngCheck: "0",
  }));
  openpopup2.value = false;
};

const searchButton3 = async (e) => {
  if (scond4.value == "0") {
    Swal.fire({
      title: "경고",
      text: "파트를 먼저 선택해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }
  try {
    const res = await getStockItemListWithFavorite(
      store.state.userData.lngStoreGroup,
      storeCd.value,
      scond4.value,
      e.target.value,
      ""
    );
    console.log(res);
    updatedrowdata3.value = res.data.List;
    rowData3.value = res.data.List;
  } catch (error) {}
};

const searchValue2 = ref(["-1"]);

const SupplierId2 = (e) => {
  if (e == "0") {
    searchValue2.value = ["-1"];
  } else {
    searchValue2.value = [e];
  }
};

const scond6 = ref("");

const setScond6 = (e) => {
  scond6.value = e.target.value;
};

const updatedrowdata3 = ref([]);
const updatedRowData3 = (e) => {
  console.log(e);
  updatedrowdata3.value = e;

  const filtered = e.filter((item) => item.dblOrderQty != "0");

  updatedrowdata2.value = filtered;
  rowData2.value = filtered;
};

const deleteStock = () => {
  rowData3.value = updatedrowdata3.value.filter(
    (item) => item.lngCheck == false
  );
};

const deleteStock2 = () => {
  rowData2.value = updatedrowdata2.value.filter(
    (item) => item.lngCheck == false
  );
};

const saveButton2 = async () => {
  try {
    const supplierid = updatedrowdata2.value
      .map((item) => item.lngSupplierID)
      .join("\u200b");
    const stockids = updatedrowdata2.value
      .map((item) => item.lngStockID)
      .join("\u200b");
    const qty = updatedrowdata2.value
      .map((item) => item.dblOrderQty)
      .join("\u200b");
    const unitprice = updatedrowdata2.value
      .map((item) => item.curUnitPrice)
      .join("\u200b");
    const supplys = updatedrowdata2.value
      .map((item) => item.curSupply)
      .join("\u200b");
    const taxs = updatedrowdata2.value
      .map((item) => item.curTax)
      .join("\u200b");
    const comments = updatedrowdata2.value
      .map((item) => item.strOrderComments)
      .join("\u200b");
    const res = await saveOrderMasterDetailByPart(
      store.state.userData.lngStoreGroup,
      storeCd.value,
      scond2.value.replaceAll("-", ""),
      scond3.value.replaceAll("-", ""),
      scond5.value,
      store.state.userData.lngSequence,
      "N",
      supplierid,
      stockids,
      qty,
      unitprice,
      supplys,
      taxs,
      comments,
      scond4.value
    );

    console.log(res);

    if (res.data.RESULT_CD == "00") {
      await Swal.fire({
        title: "성공",
        text: "저장에 성공하였습니다.",
        icon: "success",

        confirmButtonText: "확인",
      });
    } else {
      await Swal.fire({
        title: "실패",
        text: "저장에 실패하였습니다.",
        icon: "error",

        confirmButtonText: "확인",
      });
    }
    initGrid2();
    openpopup.value = false;
    openpopup2.value = false;
    searchButton();
  } catch (error) {}
};

const setScond3 = (e) => {
  if (
    parseInt(e.target.value.replaceAll("-", "")) >=
    parseInt(scond3.value.replaceAll("-", ""))
  ) {
    const date = new Date(e.target.value);
    date.setDate(date.getDate() + 1);

    scond3.value = date.toISOString().slice(0, 10);
  }
};

watch(scond3, async () => {
  try {
    const res = await getCloseDtmDate2(
      store.state.userData.lngStoreGroup,
      storeCd.value,
      scond3.value.replaceAll("-", ""),
      0
    );
    console.log(res);

    scond.value =
      res.data.List[0].dtmOrderCloseDate.slice(0, 4) +
      "년" +
      res.data.List[0].dtmOrderCloseDate.slice(4, 6) +
      "월" +
      res.data.List[0].dtmOrderCloseDate.slice(6, 8) +
      "일" +
      " " +
      res.data.List[0].dtmOrderCloseDate.slice(8, 10) +
      ":" +
      res.data.List[0].dtmOrderCloseDate.slice(10, 12);
  } catch (error) {}
});

const scond7 = ref(1);
const searchButton4 = async (e) => {
  if (scond4.value == "0") {
    Swal.fire({
      title: "경고",
      text: "파트를 먼저 선택해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }
  try {
    const res = await getStockItemListWithFavorite(
      store.state.userData.lngStoreGroup,
      storeCd.value,
      scond4.value,
      scond7.value,
      ""
    );
    console.log(res);
    updatedrowdata3.value = res.data.List;
    rowData3.value = res.data.List;
  } catch (error) {}
};

const initGrid2 = () => {
  scond.value = "";
  scond2.value = "";
  scond3.value = "";
  scond4.value = "0";
  scond5.value = "";

  scond7.value = "1";
  scond6.value = "";

  rowData2.value = [];

  rowData3.value = [];

  rowData4.value = [];
};

const closeOpenpopup = () => {
  initGrid2();
  openpopup.value = false;
  openpopup2.value = false;
};
</script>

<style></style>
