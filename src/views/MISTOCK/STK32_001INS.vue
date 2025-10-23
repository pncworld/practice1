<!-- /*--############################################################################
# Filename : STK32_001INS.vue                                                  
# Description : 자재관리 > 주문 관리 > 주문출고확정.               
# Date :2025-09-25                                                            
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

        <button @click="deleteButton" class="button delete md:w-auto w-14">
          삭제
        </button>
        <button @click="excelButton" class="button excel">엑셀</button>
        <button @click="saveButton2" class="button new md:w-auto w-14">
          일괄확정
        </button>
      </div>
    </div>
    <div
      class="grid grid-cols-4 grid-rows-2 justify-between bg-gray-200 rounded-lg h-24 items-start z-10">
      <div class="flex space-x-5 items-center col-span-4">
        <Datepicker2
          :mainName="'청구일자'"
          @endDate="endDate"
          :initToday="1"
          :initToday2="-30"
          @startDate="startDate"></Datepicker2>
      </div>

      <div class="flex space-x-5 ml-12 items-center">
        <Datepicker1
          :mainName="'출고일자'"
          :initToday="1"
          @dateValue="dateValue"></Datepicker1>
      </div>
      <div class="flex space-x-5 mt-2 items-center">
        <div class="text-base font-semibold">출고매장</div>
        <div>
          <select
            name=""
            id=""
            class="border border-black w-48 h-7"
            v-model="cond">
            <option :value="i.lngStoreCode" v-for="i in optionList">
              {{ i.strName }}
            </option>
          </select>
        </div>
      </div>

      <div class="flex space-x-5 justify-start items-center">
        <PickStore
          :hideGroup="false"
          :hideAttr="false"
          @update:storeCd="lngStoreCode"
          :defaultStore="true"
          :defaultStoreNm="'전체'"
          :setDynamicStoreClass="'!h-8 !p-0'"
          :mainName="'입고매장'"></PickStore>
      </div>
      <div class="flex space-x-5 justify-start items-center mt-2">
        <select
          name=""
          id=""
          class="w-48 h-8 border border-black"
          v-model="cond3">
          <option value="01">미출고</option>
          <option value="02">출고완료</option>
        </select>
      </div>
    </div>
    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="w-full h-[82%]">
      <Realgrid
        :progname="'STK32_001INS_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :setStateBar="false"
        :documentTitle="'STK32_001INS'"
        @updatedRowData="updatedRowData"
        @clickedButtonCol="clickedButtonCol"
        @dblclickedRowData="dblclickedRowData"
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

  <div
    class="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
    v-if="open">
    <!-- 팝업 내용 -->
    <div class="bg-white p-6 rounded-2xl shadow-lg w-[50vw] h-[70vh]">
      <div class="flex justify-between">
        <h2 class="text-xl font-bold mb-4">주문출고확정</h2>
        <div class="flex space-x-3">
          <button
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            :disabled="disabled"
            @click="saveButton">
            저장
          </button>

          <button
            class="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-blue-600"
            @click="open = false">
            닫기
          </button>
        </div>
      </div>
      <div class="grid grid-rows-1 grid-cols-3 border border-black mt-1">
        <div class="flex">
          <div
            class="text-base font-semibold bg-gray-100 border-r border-black w-[40%] flex items-center justify-center">
            출고일자
          </div>
          <div class="border-r border-black flex justify-center items-center">
            <input
              type="date"
              class="border border-black"
              v-model="scond"
              :disabled="disabled"
              @change="searchButton2" />
          </div>
        </div>
        <div class="flex">
          <div
            class="text-base font-semibold bg-gray-100 border-r border-l border-black w-[40%] flex items-center justify-center">
            출고매장
          </div>
          <div
            class="border-r border-black flex justify-center items-center w-full">
            <input
              type="text"
              v-model="scond2"
              disabled
              class="border border-black w-[80%] h-[80%]" />
          </div>
        </div>
        <div class="flex">
          <div
            class="text-base font-semibold bg-gray-100 border-r border-l border-black w-[40%] flex items-center justify-center">
            입고매장
          </div>
          <div class="border-r border-black flex justify-center items-center">
            <input
              type="text"
              class="border border-black"
              v-model="scond3"
              disabled />
          </div>
        </div>
      </div>
      <div class="h-[60%] w-full mt-2">
        <Realgrid
          :progname="'STK32_001INS_VUE'"
          :progid="2"
          :rowData="rowData2"
          :documentTitle="'STK32_001INS'"
          :rowStateeditable="false"
          :editableColId="'dblMoveQty'"
          @updatedRowData="updatedRowData2"
          :documentSubTitle="documentSubTitle2"
          :exporttoExcel="exporttoExcel2"
          :setStateBar="false"></Realgrid>
      </div>

      <div class="flex flex-col">
        <div class="border border-black text-base font-semibold w-[10%]">
          본사메모
        </div>
        <textarea
          name=""
          id=""
          :disabled="disabled"
          @input="setCond4"
          v-model="scond4"
          class="border border-black w-full h-full"></textarea>
      </div>

      <div class="flex flex-col">
        <div class="border border-black text-base font-semibold w-[10%]">
          청구메모
        </div>
        <textarea
          name=""
          id=""
          v-model="scond5"
          disabled
          class="border border-black w-full h-full"></textarea>
      </div>
    </div>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import {
  deleteDemandMaster,
  deleteStockConfirmList,
  getOptionStoreList,
  getStockDetail2,
  getStockDetail3,
  getStockOrderReleaseList,
  saveStockConfirm,
  saveStockConfirmAll,
} from "@/api/mistock";
import PageName from "@/components/pageName.vue";
import Realgrid from "@/components/realgrid.vue";
import { formatLocalDate, insertPageLog } from "@/customFunc/customFunc";
import { onMounted, ref } from "vue";

import Datepicker1 from "@/components/Datepicker1.vue";
import Datepicker2 from "@/components/Datepicker2.vue";
import PickStore from "@/components/pickStore.vue";
import Swal from "sweetalert2";
import { useStore } from "vuex";

const optionList = ref([]);
const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

/**
 * 선택한 매출 시작일자
 */

const cond = ref("0");
const cond2 = ref("0");
const cond3 = ref("01");
const cond4 = ref("");
const cond5 = ref("0");
const tempSeeStore = ref(false);
const reportCheckData = ref("0");
const progId = ref("1");
const mdate = ref("");
const dateValue = (e) => {
  mdate.value = e.replaceAll("-", "");
  scond.value = e;
};
const lngStoreCode = (e) => {
  cond2.value = e;
};
const store = useStore();
const loginedstrLang = store.state.userData.lngLanguage;

const datepicker = ref(null);
const closePopUp = ref(false);
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

/**
 *  조회 함수
 */

const cond6 = ref(true);
const checkCond = (e) => {
  cond6.value = e.target.checked;
};

/* 매장 컴포넌트 관련 함수 */
const selectedGroup = ref();
const selectedStore = ref(0);

/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getOptionStoreList(store.state.userData.lngStoreGroup, 0);

  optionList.value = res.data.List;

  if (res.data.List.length > 0) {
    cond.value = res.data.List[0].lngStoreCode;
  }

  //console.log(store.state.storeCd);
});

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
  const filterd =
    optionList.value.filter((item) => item.lngStoreCode == cond.value)[0]
      ?.strName || "";
  documentSubTitle.value =
    "청구일자 :" +
    sdate.value +
    "~" +
    edate.value +
    "\n" +
    "출고매장 : " +
    filterd;

  // 엑셀 기능 실행
  exportExcel.value = !exportExcel.value;
};

const documentSubTitle2 = ref("");

// 엑셀 추출
const documentSubTitle = ref("");
const selectedExcelDate = ref("");

const selectedExcelStore = ref("");

const excelStore = (e) => {
  selectedExcelStore.value = e;
  //comsole.log(e);
};

const updatedrowdata = ref([]);
const updatedRowData = (e) => {
  console.log(e);
  updatedrowdata.value = e;
};
const saveButton = async () => {
  try {
    const itemids = updatedrowdata2.value
      .map((item) => item.lngStockID)
      .join("\u200b");
    const qtys = updatedrowdata2.value
      .map((item) => item.dblMoveQty)
      .join("\u200b");
    const unitprices = updatedrowdata2.value
      .map((item) => item.curUnitPrice)
      .join("\u200b");
    const cursupplys = updatedrowdata2.value
      .map((item) => item.curSupply)
      .join("\u200b");
    const curtaxes = updatedrowdata2.value
      .map((item) => item.curTax)
      .join("\u200b");
    const demandnos = updatedrowdata2.value
      .map((item) => item.strDemandNo)
      .join("\u200b");
    const demandseqs = updatedrowdata2.value
      .map((item) => item.lngDemandSeq)
      .join("\u200b");
    store.state.loading = true;
    const res = await saveStockConfirm(
      store.state.userData.lngStoreGroup,
      tempStoreCd.value,
      tempStoreCd2.value,
      scond.value.replaceAll("-", ""),
      itemids,
      qtys,
      unitprices,
      cursupplys,
      curtaxes,
      demandnos,
      demandseqs,
      store.state.userData.lngSequence,
      scond4.value
    );

    store.state.loading = false;
    if (res.data.RESULT_CD == "00") {
      await Swal.fire({
        title: "성공",
        text: "설정하신 출고수량으로 출고를 확정하였습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
    } else {
      await Swal.fire({
        title: "실패",
        text: "설정하신 출고수량으로 출고확정을 실패하였습니다.",
        icon: "error",
        confirmButtonText: "확인",
      });
    }
    disabled.value = true;
  } catch (error) {
  } finally {
    open.value = false;
    searchButton();
  }
};

const searchButton = async () => {
  try {
    store.state.loading = true;
    const res = await getStockOrderReleaseList(
      store.state.userData.lngStoreGroup,
      cond.value,
      cond2.value,
      sdate.value.replaceAll("-", ""),
      edate.value.replaceAll("-", ""),
      mdate.value,
      cond3.value,
      store.state.userData.strLanguage
    );

    console.log(res);

    store.state.loading = false;
    rowData.value = res.data.List;
    updatedrowdata.value = res.data.List.map((item) => ({
      ...item,
      Selected: false,
    }));
    afterSearch.value = true;
  } catch (error) {}
};

const sdate = ref("");
const startDate = (e) => {
  sdate.value = e;
};
const edate = ref("");
const endDate = (e) => {
  edate.value = e;
};

const tempColID = ref("");
const clickedButtonCol = (e) => {
  console.log(e);
  tempColID.value = e;
};

const clickedrowdata = ref("");

const open = ref(false);
const disabled = ref(false);

const rowData2 = ref([]);
const scond4 = ref("");
const scond5 = ref("");

const editableColId = ref("");
const tempStoreCd = ref("");
const tempStoreCd2 = ref("");
const dblclickedRowData = async (e) => {
  console.log(e);
  //   console.log(tempColID.value);

  tempStoreCd.value = e[1];
  tempStoreCd2.value = e[2];
  //tempMoveDate.value = e[4];

  editableColId.value = "";
  if (
    tempColID.value == "strStoreName" ||
    tempColID.value == "strDemandNo_Dummy"
  ) {
    if (e[11] == "01" || e[11] == "04") {
      disabled.value = false;
    } else {
      disabled.value = true;
    }

    //disabled.value = false;

    //scond.value = formatLocalDate(new Date());
    scond2.value =
      store.state.storeCd.filter((item) => item.lngStoreCode == e[1])[0]
        ?.strName || "";
    scond3.value =
      store.state.storeCd.filter((item) => item.lngStoreCode == e[2])[0]
        ?.strName || "";

    try {
      store.state.loading = true;
      const res = await getStockDetail3(
        store.state.userData.lngStoreGroup,
        e[2],
        e[6],
        e[7],
        e[14]
      );

      console.log(res);

      store.state.loading = false;
      rowData2.value = res.data.List;
      updatedrowdata2.value = res.data.List;
      scond4.value = res.data.List2[0]?.strComments || "";
      scond5.value = res.data.List3[0]?.strComments || "";
    } catch (error) {}
    open.value = true;
  }
};

const scond = ref("");
const scond2 = ref("");
const scond3 = ref("");

const addButton = async () => {
  disabled.value = false;

  scond.value = formatLocalDate(new Date());
  scond2.value = cond.value;
  scond3.value = "";
  editableColId.value = "dblDemandQty";
  rowData2.value = [];

  try {
    store.state.loading = true;
    const res = await getStockDetail2(
      store.state.userData.lngStoreGroup,
      cond.value,
      store.state.userData.strLanguage,
      "",
      formatLocalDate(new Date()).replaceAll("-", "")
    );

    console.log(res);

    store.state.loading = false;
    rowData2.value = res.data.List;
    scond4.value = res.data.List2[0].strComments;
  } catch (error) {}
  open.value = true;
};

const updatedrowdata2 = ref([]);
const updatedRowData2 = (e) => {
  console.log(e);
  updatedrowdata2.value = e;
};

const searchButton2 = async (e) => {
  rowData2.value = [];

  try {
    store.state.loading = true;
    const res = await getStockDetail2(
      store.state.userData.lngStoreGroup,
      cond.value,
      store.state.userData.strLanguage,
      "",
      String(e.target.value).replaceAll("-", "")
    );

    console.log(res);

    store.state.loading = false;
    rowData2.value = res.data.List;
    scond4.value = res.data.List2[0].strComments;
  } catch (error) {}
};

const deleteButton = async () => {
  const filtered = updatedrowdata.value.filter((item) => item.Selected == true);

  if (filtered.length == 0) {
    Swal.fire({
      title: "경고",
      text: "삭제할 출고 사항을 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  try {
    const storecds = filtered.map((item) => item.lngStoreCode).join("\u200b");
    const dstorecds = filtered
      .map((item) => item.lngDesStoreCode)
      .join("\u200b");
    const demandnos = filtered.map((item) => item.strDemandNo).join("\u200b");
    const mdates = filtered.map((item) => item.strMoveDate).join("\u200b");
    const edates = filtered.map((item) => item.strExpectedDate).join("\u200b");

    const res = await deleteStockConfirmList(
      store.state.userData.lngStoreGroup,
      storecds,
      dstorecds,
      demandnos,
      mdates,
      edates,
      store.state.userData.lngSequence
    );

    console.log(res);

    if (res.data.RESULT_CD == "00") {
      await Swal.fire({
        title: "성공",
        text: "주문 출고 확정이 삭제 되었습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
      openPopUp.value = false;
    } else {
      await Swal.fire({
        title: "경고",
        text: "주문 출고 확정삭제를 실패하였습니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
    }
  } catch (error) {
  } finally {
    searchButton();
  }
};

const setCond4 = (e) => {
  scond4.value = e.target.value;
};

const saveButton2 = async () => {
  const filtered = updatedrowdata.value.filter((item) => item.Selected == true);

  if (filtered.length == 0) {
    Swal.fire({
      title: "경고",
      text: "일괄 확정할 사항을 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  try {
    const storecds = filtered.map((item) => item.lngStoreCode).join("\u200b");

    const dstorecds = filtered
      .map((item) => item.lngDesStoreCode)
      .join("\u200b");
    const demandnos = filtered.map((item) => item.strDemandNo).join("\u200b");
    const mdates = filtered.map((item) => item.strMoveDate).join("\u200b");
    const edates = filtered.map((item) => item.strExpectedDate).join("\u200b");
    const res = await saveStockConfirmAll(
      store.state.userData.lngStoreGroup,
      storecds,
      dstorecds,
      demandnos,
      mdates,
      edates,
      store.state.userData.lngSequence
    );

    console.log(res);

    if (res.data.RESULT_CD == "00") {
      await Swal.fire({
        title: "성공",
        text: "선택하신 주문 출고 확정이 완료되었습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
      openPopUp.value = false;
    } else {
      await Swal.fire({
        title: "경고",
        text: "선택하신 주문 출고 확정을 실패하였습니다.",
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
