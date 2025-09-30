<!-- /*--############################################################################
# Filename : PUR01_010RPT.vue                                                  
# Description : 구매관리2 > 매장간 재고이동 관리 > 매장/파트간 출고 등록                      
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
        <button @click="addButton" class="button new w-auto">신규</button>
        <button @click="deleteButton" class="button delete w-auto">삭제</button>
        <button @click="excelButton" class="button save w-auto excel">
          엑셀
        </button>
      </div>
    </div>
    <div
      class="grid grid-cols-2 grid-rows-2 bg-gray-200 rounded-lg h-24 items-start z-10">
      <div class="flex justify-start items-center space-x-5">
        <PickStore
          @update:storeGroup="lngStoreGroup"
          :defaultStoreNm="'전체'"
          :mainName="'보낸 매장/파트'"
          :defaultStore="true"
          @storeNm="excelStore"
          :hideAttr="false"
          :hideGroup="false"
          :setDynamicStoreClass="'!h-8 !p-0'"
          @update:storeCd="lngStoreCode"></PickStore>
        <select
          name=""
          id=""
          class="border border-black w-32 h-8 mt-2"
          v-model="cond">
          <option :value="i.lngPartCode" v-for="i in optionList">
            {{ i.strPartName }}
          </option>
        </select>
      </div>
      <div class="flex justify-start items-center space-x-5">
        <PickStore
          :defaultStoreNm="'전체'"
          :defaultStore="true"
          :mainName="'보낸 매장/파트'"
          @storeNm="excelStore"
          :hideAttr="false"
          :hideGroup="false"
          :setDynamicStoreClass="'!h-8 !p-0'"
          @update:storeCd="lngStoreCode2"></PickStore>
        <select
          name=""
          id=""
          class="border border-black w-32 h-8 mt-2"
          v-model="cond2">
          <option :value="i.lngPartCode" v-for="i in optionList3">
            {{ i.strPartName }}
          </option>
        </select>
      </div>
      <div class="justify-start flex ml-10 -mt-2">
        <Datepicker2
          :mainName="'이동기간'"
          @endDate="endDate"
          ref="datepicker"
          :closePopUp="closePopUp"
          @excelDate="excelDate"
          @startDate="startDate">
        </Datepicker2>
      </div>

      <div class="flex justify-start pl-20 ml-2 items-center space-x-5">
        <div class="text-base font-semibold">확정여부</div>
        <div>
          <select
            name=""
            id=""
            class="h-8 w-48 border border-black"
            v-model="cond3">
            <option value="0">전체</option>
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
      <div class="w-full h-[80%]">
        <Realgrid
          :progname="'PUR08_003INS_VUE'"
          :progid="1"
          :rowData="rowData"
          :documentTitle="'PUR08_003INS'"
          @updatedRowData="updatedRowData"
          :checkRenderEditable="true"
          :checkRowAuto="false"
          :checkRowAuto2="true"
          :checkRowAuto2Col="'Selected'"
          :documentSubTitle="documentSubTitle"
          :rowStateeditable="false"
          :exporttoExcel="exportExcel">
        </Realgrid>
      </div>
    </div>
  </div>
  <!-- 오버레이 -->
  <div
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    v-if="open">
    <!-- 팝업 박스 -->
    <div class="bg-white rounded-lg w-[60vw] h-[65vh] p-5">
      <div class="flex justify-between">
        <h2 class="text-xl font-bold mb-4">팝업 제목</h2>

        <div class="space-x-3">
          <button
            class="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            @click="saveButton">
            출고
          </button>
          <button
            class="mt-4 px-4 py-2 bg-gray-500 text-white rounded"
            @click="open = false">
            닫기
          </button>
        </div>
      </div>
      <div class="grid grid-rows-2 grid-cols-[1fr,3fr,1fr,3fr]">
        <div
          class="text-base font-semibold flex items-center justify-center border-l border-t border-black bg-gray-100">
          보내는 매장/파트
        </div>
        <div class="flex items-center border-l border-t border-black space-x-3">
          <PickStore
            :defaultStoreNm="'전체'"
            :defaultStore="true"
            :mainName="''"
            :hideAttr="false"
            :hideGroup="false"
            :disabledAll="disabled"
            :setDynamicStoreClass="'!h-8 !p-0 !ml-0 !-ml-3 !w-48 !-mt-2'"
            :setDynamicStoreClass2="'!ml-2'"
            @update:storeCd="lngStoreCode3"></PickStore>
          <select
            name=""
            id=""
            class="h-8 w-48 border border-black disabled:bg-gray-200"
            :disabled="disabled"
            v-model="scond">
            <option :value="i.lngPartCode" v-for="i in optionList4">
              {{ i.strPartName }}
            </option>
          </select>
        </div>
        <div
          class="text-base font-semibold flex items-center justify-center border-l border-t border-black bg-gray-100">
          받는 매장/파트
        </div>
        <div class="flex items-center border-l border-t border-black space-x-3">
          <PickStore
            :defaultStoreNm="'전체'"
            :defaultStore="true"
            :mainName="''"
            :hideAttr="false"
            :hideGroup="false"
            :disabledAll="disabled"
            :setDynamicStoreClass="'!h-8 !p-0 !ml-0 !-ml-3 !w-48 !-mt-2'"
            :setDynamicStoreClass2="'!ml-2'"
            @update:storeCd="lngStoreCode4"></PickStore>
          <select
            name=""
            id=""
            class="h-8 w-48 border border-black disabled:bg-gray-200"
            :disabled="disabled"
            v-model="scond2">
            <option :value="i.lngPartCode" v-for="i in optionList5">
              {{ i.strPartName }}
            </option>
          </select>
        </div>
        <div
          class="text-base font-semibold flex items-center justify-center border-l border-t border-b border-black bg-gray-100">
          이동 일자
        </div>
        <div
          class="flex justify-start pl-2 items-center border-l border-t border-b border-black">
          <input
            type="date"
            :disabled="disabled"
            class="border border-black w-32 h-8 disabled:bg-gray-200"
            v-model="scond3" />
        </div>
        <div
          class="text-base font-semibold flex items-center justify-center border-l border-t border-b border-black bg-gray-100">
          거래처
        </div>
        <div
          class="flex justify-start items-center border-l border-b border-t border-black">
          <BusinessClient
            :defaultName="''"
            :setDynamicClass="'!-mt-2'"
            @SupplierId="SupplierId"></BusinessClient>
        </div>
      </div>
      <div class="grid grid-rows-3 grid-cols-[1fr,3fr,1fr,3fr,2fr,2fr]">
        <div
          class="text-base font-semibold flex items-center justify-center border-l border-t border-b border-black bg-orange-100">
          자재검색
        </div>
        <div
          class="text-base font-semibold flex items-center justify-start pl-3 border-l border-t border-b border-black">
          <input
            type="text"
            class="border border-black h-[80%] w-[50%]"
            v-model="scond4" />
          <button class="whitebutton" @click="searchButton2">조회</button>
        </div>
        <div
          class="text-base font-semibold flex items-center justify-center border-l border-t border-b border-black bg-orange-100">
          자재명
        </div>
        <div
          class="text-base font-semibold flex items-center justify-start pl-3 border-l border-t border-b border-black">
          <input
            type="text"
            class="border border-black w-[80%] h-[80%]"
            v-model="scond5"
            disabled />
        </div>
        <div
          class="text-base font-semibold flex items-center justify-center border-l border-t border-b border-black bg-orange-100">
          단위(반품/이동단위)
        </div>
        <div
          class="text-base font-semibold flex items-center justify-start pl-3 border-l border-t border-b border-black">
          <input
            type="text"
            v-model="scond6"
            class="border border-black w-[80%] h-[80%]"
            disabled />
        </div>
        <div
          class="text-base font-semibold flex items-center justify-center border-l border-t border-b border-black bg-orange-100">
          매입단가
        </div>
        <div
          class="text-base font-semibold flex items-center justify-start pl-3 border-l border-t border-b border-black">
          <input
            type="text"
            name="scond7"
            class="border border-black w-[50%] h-[80%]"
            @input="onlyNumber2"
            v-model="scond7" />
        </div>
        <div
          class="text-base font-semibold flex items-center justify-center border-l border-t border-b border-black bg-orange-100">
          이동수량
        </div>
        <div
          class="text-base font-semibold flex items-center justify-start pl-3 border-l border-t border-b border-black col-span-3">
          <input
            type="text"
            class="border border-black w-[21%] h-[80%]"
            @input="onlyNumber"
            v-model="scond8" />
        </div>

        <div
          class="text-base font-semibold flex items-center justify-center border-l border-t border-b border-black bg-orange-100">
          공급가
        </div>
        <div
          class="text-base font-semibold flex items-center justify-start pl-3 border-l border-t border-b border-black">
          <input
            type="text"
            name="scond9"
            @input="onlyNumber2"
            class="border border-black w-[50%] h-[80%]"
            v-model="scond9" />
        </div>
        <div
          class="text-base font-semibold flex items-center justify-center border-l border-t border-b border-black bg-orange-100">
          부가세
        </div>
        <div
          class="text-base font-semibold flex items-center justify-start pl-3 border-l border-t border-b border-black">
          <input
            type="text"
            name="scond10"
            @input="onlyNumber2"
            class="border border-black w-[50%] h-[80%]"
            v-model="scond10" />
        </div>
        <div
          class="text-base font-semibold flex items-center justify-center border-l border-t border-b border-black bg-orange-100">
          합계금액
        </div>
        <div
          class="text-base font-semibold flex items-center justify-start pl-3 border-l border-t border-b border-black">
          <input
            type="text"
            name="scond11"
            @input="onlyNumber2"
            class="border border-black w-[50%] h-[80%]"
            v-model="scond11" />
          <button class="whitebutton" @click="addRowData3">추가</button>
        </div>
      </div>

      <div class="h-[65%]">
        <Realgrid
          :progname="'PUR08_003INS_VUE'"
          :progid="2"
          :rowData="rowData3"
          :setStateBar="false"></Realgrid>
      </div>

      <div
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        v-if="open2">
        <div
          class="flex flex-col bg-white border border-black w-[40vw] h-[35vh] p-2">
          <div class="flex justify-end">
            <button class="whitebutton" @click="open2 = false">닫기</button>
          </div>
          <div class="flex h-[80%]">
            <Realgrid
              :progname="'PUR08_003INS_VUE'"
              :progid="3"
              :setStateBar="false"
              @updatedRowData="updatedRowData2"
              @dblclickedRowData="clickedRowData"
              :rowData="rowData2"></Realgrid>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 그리드 영역 -->
</template>

<script setup>
import { getCommonList } from "@/api/common";
import {
  deleteStoreMoveListbyPart,
  getStockListByPart,
  getStoreMoveListBypart,
  saveMoveStorePartList,
} from "@/api/mipur";
import { getLossMasterPartList } from "@/api/mistock";
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

  const res = await getCommonList(24);

  optionList2.value = res.data.List;
});

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

const cond = ref("0");
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
const optionList3 = ref([]);
const optionList4 = ref([]);
const optionList5 = ref([]);

const storeCode = ref();
const lngStoreCode = async (e) => {
  initGrid();
  storeCode.value = e;

  const res2 = await getLossMasterPartList(
    store.state.userData.lngStoreGroup,
    storeCode.value
  );

  optionList.value = res2.data.List;
};
const storeCode2 = ref();
const lngStoreCode2 = async (e) => {
  initGrid();
  storeCode2.value = e;

  const res2 = await getLossMasterPartList(
    store.state.userData.lngStoreGroup,
    storeCode2.value
  );

  optionList3.value = res2.data.List;
};

const storeCode3 = ref();
const lngStoreCode3 = async (e) => {
  storeCode3.value = e;

  const res2 = await getLossMasterPartList(
    store.state.userData.lngStoreGroup,
    storeCode3.value
  );

  optionList4.value = res2.data.List;
};

const storeCode4 = ref();
const lngStoreCode4 = async (e) => {
  storeCode4.value = e;

  const res2 = await getLossMasterPartList(
    store.state.userData.lngStoreGroup,
    storeCode4.value
  );

  optionList5.value = res2.data.List;
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

    const res = await getStoreMoveListBypart(
      groupCd.value,
      storeCode.value,
      cond.value,
      storeCode2.value,
      cond2.value,
      sDate.value.replaceAll("-", ""),
      eDate.value.replaceAll("-", ""),
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

const updatedrowdata = ref([]);
const updatedRowData = (e) => {
  console.log(e);
  updatedrowdata.value = e;
};

const open = ref(false);
const open2 = ref(false);
const addButton = () => {
  scond3.value = formatLocalDate(new Date());
  open.value = true;
};

const searchButton2 = async () => {
  if (storeCode3.value == "0") {
    Swal.fire({
      title: "경고",
      text: "보내는 매장을 선택해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }

  if (scond.value == "0") {
    Swal.fire({
      title: "경고",
      text: "보내는 매장의 파트를 선택해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }

  if (storeCode4.value == "0") {
    Swal.fire({
      title: "경고",
      text: "받는 매장을 선택해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }

  if (scond2.value == "0") {
    Swal.fire({
      title: "경고",
      text: "받는 매장의 파트를 선택해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }

  if (storeCode3.value == storeCode4.value && scond.value == scond2.value) {
    Swal.fire({
      title: "경고",
      text: "보내는 매장과 받는 매장이 같습니다. 확인해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }
  try {
    const res = await getStockListByPart(
      groupCd.value,
      storeCode3.value,
      scond.value,
      supplierid.value,
      scond3.value.replaceAll("-", ""),
      scond4.value
    );

    console.log(res);

    rowData2.value = res.data.List;
    open2.value = true;
  } catch (error) {}
};

const rowData2 = ref([]);
const scond = ref(0);
const scond2 = ref(0);
const supplierid = ref("0");
const scond3 = ref("");
const scond4 = ref("");
const scond5 = ref("");
const scond6 = ref("");
const scond7 = ref("");
const scond8 = ref("");
const scond9 = ref("");
const scond10 = ref("");
const scond11 = ref("");
const SupplierId = (e) => {
  supplierid.value = e;
};

const tempTaxType = ref("01");
const tempRowData2 = ref([]);
const clickedRowData = (e) => {
  console.log(e);
  tempRowData2.value = e;
  scond4.value = e[0];
  scond5.value = e[1];
  scond6.value = e[3];
  scond7.value = e[4];
  scond8.value = 0;
  scond9.value = 0;
  scond10.value = 0;
  scond11.value = 0;
  tempTaxType.value = e[5];
  open2.value = false;
};

const onlyNumber = (e) => {
  scond8.value = e.target.value.replace(/[^0-9]/g, "");

  scond9.value = parseInt(scond8.value) * parseInt(scond7.value);

  if (tempTaxType.value == "01") {
    scond10.value = scond9.value * 0.1;
  } else {
    scond10.value = 0;
  }

  scond11.value = scond9.value + scond10.value;
};

const onlyNumber2 = (e) => {
  if (e.target.name == "scond9") {
    scond9.value = e.target.value.replace(/[^0-9]/g, "");
  } else if (e.target.name == "scond11") {
    scond11.value = e.target.value.replace(/[^0-9]/g, "");
  } else if (e.target.name == "scond7") {
    scond7.value = e.target.value.replace(/[^0-9]/g, "");
  } else if (e.target.name == "scond10") {
    scond10.value = e.target.value.replace(/[^0-9]/g, "");
  }
};

const rowData3 = ref([]);
const disabled = ref(false);
const addRowData3 = (e) => {
  if (scond5.value == "" || scond6.value == "") {
    return;
  }
  const cRowData3 = {
    lngStockID: tempRowData2.value[0],
    strStockName: tempRowData2.value[1],
    lngTaxType: tempRowData2.value[5],
    strSupplierName: tempRowData2.value[2],
    strUnitName: tempRowData2.value[3],
    curUnitPrice: scond7.value,
    dblQty: scond8.value,
    curSupply: scond9.value,
    curTax: scond10.value,
    curTotal: scond11.value,
  };

  rowData3.value = rowData3.value.concat(cRowData3);

  updatedrowdata2.value = rowData3.value;
  scond4.value = "";
  scond5.value = "";
  scond6.value = "";
  scond7.value = "";
  scond8.value = "";
  scond9.value = "";
  scond10.value = "";
  scond11.value = "";
  disabled.value = true;
  // rowData3.value =
};

const updatedrowdata2 = ref([]);
const updatedRowData2 = (e) => {
  updatedrowdata2.value = e;
};

const saveButton = async (e) => {
  try {
    const stockids = updatedrowdata2.value
      .map((item) => item.lngStockID)
      .join("\u200b");
    const unitprices = updatedrowdata2.value
      .map((item) => item.curUnitPrice)
      .join("\u200b");
    const qtys = updatedrowdata2.value
      .map((item) => item.dblQty)
      .join("\u200b");
    const supplys = updatedrowdata2.value
      .map((item) => item.curSupply)
      .join("\u200b");
    const taxs = updatedrowdata2.value
      .map((item) => item.curTax)
      .join("\u200b");
    const res = await saveMoveStorePartList(
      groupCd.value,
      storeCode3.value,
      scond.value,
      storeCode4.value,
      scond2.value,
      scond3.value.replaceAll("-", ""),
      supplierid.value,
      stockids,
      unitprices,
      qtys,
      supplys,
      taxs,
      store.state.userData.lngSequence
    );

    console.log(res);

    if (res.data.RESULT_CD == "00") {
      await Swal.fire({
        title: "성공",
        text: "출고를 완료하였습니다",
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

    open.value = false;
    open2.value = false;
  } catch (error) {}
};

const deleteButton = async () => {
  console.log(updatedrowdata.value);

  const filtered = updatedrowdata.value.filter((item) => item.Selected == true);
  try {
    const fromstorecd = filtered
      .map((item) => item.lngFromStoreCode)
      .join("\u200b");
    const frompartcd = filtered
      .map((item) => item.lngFromPartCode)
      .join("\u200b");
    const moveseqids = filtered.map((item) => item.strMoveSeqID).join("\u200b");
    const tostorecd = filtered
      .map((item) => item.lngToStoreCode)
      .join("\u200b");
    const topartcd = filtered.map((item) => item.lngToPartCode).join("\u200b");
    const movedates = filtered
      .map((item) => formatLocalDate(item.strMoveDate).replaceAll("-", ""))
      .join("\u200b");
    const supplierids = filtered
      .map((item) => item.lngSupplierID)
      .join("\u200b");
    const stockids = filtered.map((item) => item.lngStockID).join("\u200b");
    const res = await deleteStoreMoveListbyPart(
      groupCd.value,
      fromstorecd,
      frompartcd,
      moveseqids,
      tostorecd,
      topartcd,
      movedates,
      supplierids,
      stockids
    );

    if (res.data.RESULT_CD == "00") {
      await Swal.fire({
        title: "성공",
        text: "삭제를 완료하였습니다.",
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
  } finally {
    searchButton();
  }
};
</script>
