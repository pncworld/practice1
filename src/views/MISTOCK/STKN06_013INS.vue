<!-- /*--############################################################################
# Filename : STKN06_013INS.vue                                                  
# Description : 자재관리2 > 손실 관리 > 파트별 손실 등록.                      
# Date :2025-09-17                                                             
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
        <button @click="addButton" class="button w-auto new">신규</button>
        <button @click="deleteButton" class="button w-auto delete">삭제</button>
        <button @click="excelButton" class="button w-auto excel">엑셀</button>
      </div>
    </div>
    <div
      class="grid grid-cols-3 grid-rows-1 bg-gray-200 rounded-lg h-16 items-start z-10">
      <div class="justify-start flex">
        <Datepicker2
          :mainName="'기간'"
          ref="datepicker"
          :initToday="1"
          :initToday2="-31"
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
          :defaultStoreType2="defaultStoreType2"
          :defaultStore="defaultStore"
          :disabledAll2="disabledAll2"
          @update:storeCd="lngStoreCode"></PickStore>
      </div>
      <div class="flex justify-start items-center mt-3 ml-[40%] space-x-5">
        <div class="text-base font-semibold">파트</div>
        <select name="" id="" class="w-[50%] h-full" v-model="cond">
          <option :value="i.lngPartCode" v-for="i in optionList2">
            {{ i.strPartName }}
          </option>
        </select>
      </div>
    </div>

    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="w-full h-[70vh]">
      <div class="grid grid-rows-1 grid-cols-[0.9fr,1.1fr] w-full h-full gap-2">
        <Realgrid
          :progname="'STKN06_013INS_VUE'"
          :progid="1"
          :rowData="rowData"
          :reload="reload"
          :setStateBar="false"
          :documentTitle="'STKN06_013INS'"
          @dblclickedRowData="dblclickedRowData"
          @clickedRowData="clickedRowData"
          :documentSubTitle="documentSubTitle"
          :rowStateeditable="false"
          :exporttoExcel="exportExcel">
        </Realgrid>

        <Realgrid
          :progname="'STKN06_013INS_VUE'"
          :progid="2"
          :rowData="rowData2"
          :reload="reload"
          :setStateBar="false"
          :documentTitle="'STKN06_012INS'"
          :rowStateeditable="false">
        </Realgrid>
      </div>
    </div>
  </div>
  <div
    v-if="open"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg p-6 w-[50vw] h-[70vh]">
      <h2 class="text-xl font-bold mb-4">손실 등록</h2>
      <div class="flex justify-end space-x-4">
        <button class="whitebutton" @click="searchButton2">조회</button>
        <button class="whitebutton" @click="saveButton2">저장</button>
        <button @click="open = false" class="whitebutton">닫기</button>
      </div>
      <div class="grid grid-rows-3 grid-cols-[1fr,3fr,1fr,3fr] h-[20%]">
        <div
          class="border-l border-t border-black flex justify-center items-center font-semibold text-base">
          일자
        </div>
        <div
          class="border-l border-t border-black flex justify-start pl-2 items-center">
          <input
            type="date"
            class="border border-black w-[80%] h-[80%]"
            v-model="scond" />
        </div>

        <div
          class="border-l border-t border-black flex justify-center items-center font-semibold text-base">
          매장
        </div>
        <div
          class="border-l border-t border-r border-black flex justify-center items-center">
          <PickStore
            :mainName="''"
            class="!ml-0"
            :hideGroup="false"
            :hideAttr="false"
            :defaultStoreNm="'전체'"
            :setDynamicStoreClass="'!w-[150%] !-ml-[70%] h-[90%] !p-0  text-center'"
            :defaultStoreType2="defaultStoreType2"
            :defaultStore="defaultStore"
            :disabledAll2="disabledAll2"
            @update:storeGroup="lngStoreGroup2"
            @update:storeCd="lngStoreCode2"></PickStore>
        </div>

        <div
          class="border-l border-t border-b border-black flex justify-center items-center font-semibold text-base">
          품목구분
        </div>
        <div
          class="border-l border-t border-b border-black flex justify-start pl-2 items-center">
          <select
            name=""
            id=""
            class="w-[80%] h-[80%] border border-black"
            v-model="scond2"
            disabled
            @change="setLossType">
            <option :value="i.strDCode" v-for="i in optionList">
              {{ i.strDName }}
            </option>
          </select>
        </div>

        <div
          class="border-l border-t border-b border-black flex justify-center items-center font-semibold text-base">
          품목명
        </div>
        <div
          class="border-l border-t border-b border-r border-black flex justify-start pl-2 items-center">
          <input
            type="text"
            class="w-[80%] h-[80%] border border-black"
            v-model="scond3" />
        </div>

        <div
          class="border-l border-t border-b border-black flex justify-center items-center font-semibold text-base">
          파트
        </div>
        <div class="flex border border-black justify-start items-center pl-2">
          <select
            name=""
            id=""
            class="w-[80%] h-[80%] border border-black"
            v-model="scond5">
            <option :value="i.lngPartCode" v-for="i in optionList3">
              {{ i.strPartName }}
            </option>
          </select>
        </div>
        <div
          class="border-b border-black flex justify-center items-center font-semibold text-base">
          손실번호
        </div>
        <div
          class="flex border-b border-r border-l border-black justify-start items-center pl-2">
          <input
            type="text"
            v-model="scond6"
            disabled
            class="disabled:bg-white border border-black h-[80%] w-[80%]" />
        </div>
      </div>
      <div class="h-[60%] w-full mt-2">
        <realgrid
          :progname="'STKN06_012INS_VUE'"
          :progid="3"
          :rowStateeditable="false"
          :editableColId="'lngQty,lngLossCode'"
          :labelingColumns="'lngLossCode'"
          :valuesData="valuesData"
          :labelsData="labelsData"
          @allStateRows="allStateRows2"
          @updatedRowData="updatedRowData2"
          :inputOnlyNumberColumn="'lngQty'"
          :rowData="rowData3"></realgrid>
      </div>
    </div>
  </div>

  <div
    v-if="open2"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg p-6 w-[50vw] h-[75vh]">
      <h2 class="text-xl font-bold mb-4">손실 등록</h2>
      <div class="flex justify-end space-x-4">
        <button
          class="whitebutton disabled:opacity-30"
          @click="searchButton2"
          disabled>
          조회
        </button>
        <button class="whitebutton" @click="saveButton3">저장</button>
        <button @click="open2 = false" class="whitebutton">닫기</button>
      </div>
      <div class="grid grid-rows-3 grid-cols-[1fr,3fr,1fr,3fr] h-[20%] mt-2">
        <div
          class="border-l border-t border-black flex justify-center items-center font-semibold text-base">
          일자
        </div>
        <div
          class="border-l border-t border-black flex justify-start pl-2 items-center">
          <input
            type="date"
            class="border border-black w-[80%] h-[80%]"
            disabled
            v-model="scond" />
        </div>

        <div
          class="border-l border-t border-black flex justify-center items-center font-semibold text-base">
          매장
        </div>
        <div
          class="border-l border-t border-r border-black flex justify-center items-center">
          <PickStore
            :mainName="''"
            :disabledAll="true"
            :hideGroup="false"
            :hideAttr="false"
            :setDefaultStoreCd="tempStoreCd"
            :setDynamicStoreClass="'!w-[100%] !-ml-[95%] h-[90%] !p-0  text-center'"
            @update:storeGroup="lngStoreGroup2"
            @update:storeCd="lngStoreCode2"></PickStore>
        </div>

        <div
          class="border-l border-t border-black flex justify-center items-center font-semibold text-base">
          품목구분
        </div>
        <div
          class="border-l border-t border-black flex justify-start pl-2 items-center">
          <select
            name=""
            id=""
            disabled
            class="w-[80%] h-[80%] border border-black"
            v-model="scond2"
            @change="setLossType">
            <option :value="i.strDCode" v-for="i in optionList">
              {{ i.strDName }}
            </option>
          </select>
        </div>

        <div
          class="border-l border-t border-b border-black flex justify-center items-center font-semibold text-base">
          품목명
        </div>
        <div
          class="border-l border-t border-b border-r border-black flex justify-start pl-2 items-center">
          <input
            type="text"
            @input="searchRow"
            class="w-[80%] h-[80%] border border-black"
            v-model="scond3" />
        </div>

        <div
          class="border-l border-t border-b border-black flex justify-center items-center font-semibold text-base">
          파트
        </div>
        <div
          class="flex col-span-1 border border-black items-center pl-2 justify-start">
          <select
            name=""
            id=""
            disabled
            class="w-[80%] h-[80%] border border-black"
            v-model="scond4">
            <option :value="i.lngPartCode" v-for="i in optionList3">
              {{ i.strPartName }}
            </option>
          </select>
        </div>
        <div
          class="border-b border-black flex justify-center items-center font-semibold text-base">
          손실번호
        </div>
        <div
          class="flex border-b border-r border-l border-black justify-start items-center pl-2">
          <input
            type="text"
            v-model="scond6"
            disabled
            class="disabled:bg-white border border-black h-[80%] w-[80%]" />
        </div>
      </div>
      <div class="h-[60%] w-full mt-2">
        <realgrid
          :progname="'STKN06_012INS_VUE'"
          :progid="3"
          :rowStateeditable="false"
          :editableColId="'lngQty,lngLossCode'"
          :labelingColumns="'lngLossCode'"
          :valuesData="valuesData"
          :labelsData="labelsData"
          @allStateRows="allStateRows3"
          @updatedRowData="updatedRowData3"
          :inputOnlyNumberColumn="'lngQty'"
          :searchColId="'strItemName'"
          :searchWord3="scond3"
          :rowData="rowData4"></realgrid>
      </div>
    </div>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import { getCommonList } from "@/api/common";
import {
  deleteLossStock,
  getLossMasterListbyPart,
  getLossMasterPartList,
  getLossStockDetailbyPart,
  getLossStockItemDetailList,
  getLossStockItemList,
  getLossTypeList,
  getStockCheckLossByUpdate,
  saveLossMasterbyPart,
  updateLossMasterDetailbyPart,
} from "@/api/mistock";
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
const defaultStoreType2 = ref(true);
const defaultStore = ref(true);

onMounted(async () => {
  if (store.state.userData.lngPositionType == "1") {
    defaultStore.value = true;
  } else {
    defaultStore.value = false;
  }
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getCommonList(52);

  optionList.value = res.data.List;

  scond.value = formatLocalDate(new Date());
});

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

const cond = ref("0");
const cond2 = ref("01");

const cond5 = ref(0);
const store = useStore();

const datepicker = ref(null);
const closePopUp = ref(false);
const optionList = ref([]);
const optionList2 = ref([]);
const optionList3 = ref([]);

const scond = ref("");
const scond2 = ref("01");
const scond3 = ref("");
const scond4 = ref("0");
const scond5 = ref("0");
const scond6 = ref("");
/**
 * 매출 일자 안 라디오박스 닫기 위한 외부 클릭 감지 함수
 */
const disabledAll2 = ref(false);
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

const storeCode = ref();
const lngStoreCode = async (e) => {
  initGrid();
  storeCode.value = e;

  const res2 = await getLossMasterPartList(
    store.state.userData.lngStoreGroup,
    storeCode.value
  );

  optionList2.value = res2.data.List;
};

const groupCd = ref();
const lngStoreGroup = (e) => {
  groupCd.value = e;
};

const storeCode2 = ref();
const lngStoreCode2 = async (e) => {
  initGrid2();
  storeCode2.value = e;

  const res2 = await getLossMasterPartList(
    store.state.userData.lngStoreGroup,
    storeCode2.value
  );

  optionList3.value = res2.data.List;
};

const groupCd2 = ref(store.state.userData.lngStoreGroup);
const lngStoreGroup2 = (e) => {
  groupCd2.value = e;
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

    const res = await getLossMasterListbyPart(
      groupCd.value,
      storeCode.value,
      cond.value,
      sDate.value.replaceAll("-", ""),
      eDate.value.replaceAll("-", "")
    );
    console.log(res);
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

const rowData3 = ref([]);
const labelsData = ref([[]]);
const valuesData = ref([[]]);
const searchButton2 = async () => {
  try {
    store.state.loading = true;
    initGrid2();

    try {
      const res = await getLossTypeList(groupCd2.value, scond2.value);

      //console.log(res);
      labelsData.value = [res.data.List.map((item) => item.strLossName)];
      valuesData.value = [res.data.List.map((item) => item.lngLossCode)];
    } catch (error) {}

    const res = await getLossStockItemList(
      groupCd2.value,
      storeCode2.value,
      scond2.value,
      scond3.value
    );

    rowData3.value = res.data.List;
    //console.log(res);
    afterSearch2.value = true;
  } catch (error) {
    afterSearch2.value = false;
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

  reload.value = !reload.value;
};

const afterSearch2 = ref(false);
const initGrid2 = () => {
  if (rowData3.value.length > 0) {
    rowData3.value = [];
  }
  afterSearch2.value = false;
  reload.value = !reload.value;
};

const initGrid3 = () => {
  if (rowData4.value.length > 0) {
    rowData4.value = [];
  }
  afterSearch3.value = false;
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

const startDate = (e) => {
  sDate.value = e;
};
const endDate = (e) => {
  eDate.value = e;
};

const rowData2 = ref([]);

const tempDeleteLoss = ref("");
const clickedRowData = async (e) => {
  scond6.value = e[5];
  try {
    const res = await getLossStockDetailbyPart(e[0], e[1], e[5]);

    rowData2.value = res.data.List;
    tempDeleteLoss.value = e;
  } catch (error) {}
  //console.log(e);
};

const open = ref(false);
const addButton = async () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 진행해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }
  scond6.value = "";
  open.value = true;
  ////console.log(groupCd2.value);
  try {
    const res = await getLossTypeList(groupCd2.value, scond2.value);

    //console.log(res);

    labelsData.value = [res.data.List.map((item) => item.strLossName)];
    valuesData.value = [res.data.List.map((item) => item.lngLossCode)];
  } catch (error) {}
};

const setLossType = async (e) => {
  scond2.value = e.target.value;
  initGrid2();
};

const saveButton2 = async () => {
  if (allstaterows2.value.length == 0) {
    Swal.fire({
      title: "경고",
      text: "저장할 사항이 존재하지 않습니다.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }
  // if (storeCode2.value == "0") {
  //   Swal.fire({
  //     title: "경고",
  //     text: "매장을 선택해주세요.",
  //     icon: "warning",

  //     confirmButtonText: "확인",
  //   });
  //   return;
  // }

  const filtered = updatedrowdata2.value
    .filter((item, index) => allstaterows2.value.includes(index))
    .filter(
      (item) =>
        item.lngLossCode == undefined ||
        item.lngLossCode == 0 ||
        item.lngQty == 0 ||
        item.lngQty == undefined
    );

  if (filtered.length > 0) {
    Swal.fire({
      title: "경고",
      text: "코드와 수량은 필히 입력하셔야 합니다.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }

  if (scond5.value == "0") {
    Swal.fire({
      title: "경고",
      text: "파트를 선택해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }

  Swal.fire({
    title: "알림",
    text: "저장 하시겠습니까?",
    icon: "question",

    confirmButtonText: "확인",
    cancelButtonText: "취소",
    showCancelButton: true,
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const itemids = updatedrowdata2.value
          .filter((item, index) => allstaterows2.value.includes(index))
          .map((item) => item.lngItemID)
          .join("\u200b");
        const qtys = updatedrowdata2.value
          .filter((item, index) => allstaterows2.value.includes(index))
          .map((item) => item.lngQty)
          .join("\u200b");
        const losscodes = updatedrowdata2.value
          .filter((item, index) => allstaterows2.value.includes(index))
          .map((item) => item.lngLossCode)
          .join("\u200b");
        const res = await saveLossMasterbyPart(
          groupCd2.value,
          storeCode2.value,
          scond.value.replaceAll("-", ""),
          itemids,
          qtys,
          losscodes,
          store.state.userData.lngSequence,
          scond2.value,
          scond5.value
        );

        if (res.data.RESULT_CD == "00") {
          await Swal.fire({
            title: "성공",
            text: "저장을 완료하였습니다.",
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
          return;
        }
        //console.log(res);
      } catch (error) {
      } finally {
        open.value = false;
        searchButton();
      }
    } else {
      return;
    }
  });
};

const allstaterows2 = ref([]);
const allStateRows2 = (e) => {
  // //console.log(e);
  allstaterows2.value = e.updated;
};

const allstaterows3 = ref([]);
const allStateRows3 = (e) => {
  // //console.log(e);
  allstaterows3.value = e.updated;
};

const updatedrowdata2 = ref([]);
const updatedRowData2 = (e) => {
  // //console.log(e);
  updatedrowdata2.value = e;
};

const updatedrowdata3 = ref([]);
const updatedRowData3 = (e) => {
  // //console.log(e);
  updatedrowdata3.value = e;
};

const open2 = ref(false);
const rowData4 = ref([]);
const afterSearch3 = ref(false);

const tempLossNo = ref("");
const tempStoreCd = ref("");
const dblclickedRowData = async (e) => {
  tempStoreCd.value = e[1];
  open2.value = true;
  tempLossNo.value = e[5];
  scond4.value = e[6];
  try {
    store.state.loading = true;
    initGrid3();

    try {
      const res = await getLossTypeList(groupCd2.value, scond2.value);

      console.log(res);
      labelsData.value = [res.data.List.map((item) => item.strLossName)];
      valuesData.value = [res.data.List.map((item) => item.lngLossCode)];
    } catch (error) {}

    const res = await getLossStockItemDetailList(e[0], e[1], e[5]);

    rowData4.value = res.data.List;
    console.log(res);
    afterSearch3.value = true;
  } catch (error) {
    afterSearch3.value = false;
    //comsole.log(error);
  } finally {
    store.state.loading = false;
  }
};

const searchRow = (e) => {
  //console.log(e.target.value);
  scond3.value = e.target.value;
};

const saveButton3 = async () => {
  if (allstaterows3.value.length == 0) {
    Swal.fire({
      title: "경고",
      text: "저장할 사항이 존재하지 않습니다.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }

  const filtered = updatedrowdata3.value
    .filter((item, index) => allstaterows3.value.includes(index))
    .filter(
      (item) =>
        item.lngLossCode == undefined ||
        item.lngLossCode == 0 ||
        item.lngQty == 0 ||
        item.lngQty == undefined
    );

  if (filtered.length > 0) {
    Swal.fire({
      title: "경고",
      text: "코드와 수량은 필히 입력하셔야 합니다.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }

  Swal.fire({
    title: "알림",
    text: "저장 하시겠습니까?",
    icon: "question",

    confirmButtonText: "확인",
    cancelButtonText: "취소",
    showCancelButton: true,
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const res = await getStockCheckLossByUpdate(
          groupCd2.value,
          storeCode2.value,
          tempLossNo.value
        );
        console.log(res);

        if (res.data.List[0].blnClosed != "False") {
          await Swal.fire({
            title: "경고",
            text: "해당 일자는 이미 마감되어 수정하실 수 없습니다.",
            icon: "warning",

            confirmButtonText: "확인",
          });
          return;
        }
      } catch (error) {}

      try {
        const itemids = updatedrowdata3.value
          .filter((item, index) => allstaterows3.value.includes(index))
          .map((item) => item.lngItemID)
          .join("\u200b");
        const qtys = updatedrowdata3.value
          .filter((item, index) => allstaterows3.value.includes(index))
          .map((item) => item.lngQty)
          .join("\u200b");
        const losscodes = updatedrowdata3.value
          .filter((item, index) => allstaterows3.value.includes(index))
          .map((item) => item.lngLossCode)
          .join("\u200b");
        const res = await updateLossMasterDetailbyPart(
          groupCd2.value,
          storeCode2.value,
          tempLossNo.value,
          itemids,
          losscodes,
          qtys,
          store.state.userData.lngSequence
        );

        console.log(res);
        if (res.data.RESULT_CD == "00") {
          await Swal.fire({
            title: "성공",
            text: "저장을 완료하였습니다.",
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
        //console.log(res);
      } catch (error) {
      } finally {
        open2.value = false;
        searchButton();
      }
    } else {
      return;
    }
  });
};

const deleteButton = async () => {
  if (
    tempDeleteLoss.value.length == 0 ||
    tempDeleteLoss.value == undefined ||
    afterSearch.value == false
  ) {
    Swal.fire({
      title: "경고",
      text: "삭제할 대상을 선택해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }
  //console.log(tempDeleteLoss.value);

  Swal.fire({
    title: "알림",
    text: "삭제하시겠습니까?",
    icon: "question",

    confirmButtonText: "확인",
    cancelButtonText: "취소",
    showCancelButton: true,
  }).then(async (result) => {
    if (result.isconfirmed) {
      try {
        const res = await deleteLossStock(
          tempDeleteLoss.value[0],
          tempDeleteLoss.value[1],
          tempDeleteLoss.value[5]
        );

        //console.log(res);

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
            text: "삭제에 실패하였습니다.",
            icon: "error",

            confirmButtonText: "확인",
          });
        }
      } catch (error) {
      } finally {
        rowData2.value = [];
        searchButton();
      }
    } else {
      return;
    }
  });
};
</script>
