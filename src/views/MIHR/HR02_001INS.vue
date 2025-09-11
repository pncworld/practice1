<!-- /*--############################################################################
# Filename : HR02_001INS.vue                                                   
# Description : 인사관리 > 근태 관리 > 스케쥴 등록                           
# Date :2025-09-09                                                              
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
        <button @click="saveButton" class="button save w-auto">저장</button>

        <button @click="copyButton" class="button copy w-auto">복사</button>
        <button @click="excelButton" class="button excel w-auto">엑셀</button>
      </div>
    </div>
    <div
      class="grid grid-cols-3 grid-rows-1 bg-gray-200 rounded-lg h-16 items-center z-10 justify-center">
      <div class="ml-12">
        <PickStoreRenew
          @storeNm="storeNm"
          :placeholderName="'선택'"
          @lngStoreGroup="lngStoreGroup"
          @lngStoreCode="lngStoreCode"></PickStoreRenew>
      </div>
      <div class="flex space-x-5 text-nowrap items-center ml-16">
        <Datepicker2
          :mainName="'기간'"
          @endDate="endDate"
          @startDate="startDate"></Datepicker2>
      </div>
      <div
        class="ml-1 flex space-x-5 justify-center items-center border border-black bg-zinc-300 w-[100%] rounded-lg h-12">
        <label for="cond"
          ><input
            type="radio"
            id="cond"
            name="cond"
            v-model="cond"
            value="1" />휴무일 자동지정</label
        >
        <label for="cond2"
          ><input
            type="radio"
            id="cond2"
            name="cond"
            v-model="cond"
            value="2" />근무조 자동지정</label
        >
        <label for="cond3"
          ><input
            type="radio"
            id="cond3"
            name="cond"
            v-model="cond"
            value="3" />미지정</label
        >
        <select
          name=""
          id=""
          class="border border-black w-48 h-8"
          v-model="cond2">
          <option :value="i.lngCode" v-for="i in optionList">
            {{ i.strWorkGupName }}
          </option>
        </select>
      </div>
    </div>
    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div
      class="grid grid-rows-1 grid-cols-[5fr,2fr] w-[99%] h-[80vh] space-x-3">
      <div class="w-full h-[90%] space-y-1 mt-2">
        <Realgrid
          :progname="'HR02_001INS_VUE'"
          :progid="1"
          :rowData="rowData"
          :reload="reload"
          @clickedRowData="clickedRowData"
          @clickedButtonCol="clickedButtonCol"
          @selectedIndex="selectedIndex"
          @updatedRowData2="updatedRowData"
          :selectionStyle="'block'"
          :setCellStyleColId3="true"
          :setDynamicGrid5="true"
          :dynamicRowHeight="true"
          :fixedColumn="true"
          :changeValue2="changeValue2"
          :changeNow2="changeNow2"
          :changeColid="changeColid"
          :changeRow="changeRow"
          :exporttoExcel="exporttoExcel"
          :documentTitle="'HR02_001INS'"
          :documentSubTitle="documentSubTitle"
          :setDynamicGrid5Cond="setDynamicGrid5Cond"
          :setDynamicGrid5Cond2="setDynamicGrid5Cond2">
        </Realgrid>
      </div>
      <div class="w-full h-[85%] space-y-1 mt-2">
        <div
          class="flex items-center space-x-3 border border-black bg-slate-300 rounded-lg h-10 justify-center">
          <select
            name=""
            id=""
            class="border border-black w-48 h-8"
            @change="setWorkGroup">
            <option :value="i.lngCode" v-for="i in optionList">
              {{ i.strWorkGupName }}
            </option>
          </select>
          <button class="whitebutton bg-white" @click="setRestDay">
            휴무일 지정
          </button>
          <div class="space-x-5">
            <button class="whitebutton bg-white" @click="addButton">
              신규
            </button>
            <button class="whitebutton bg-white" @click="deleteButton">
              삭제
            </button>
          </div>
        </div>
        <div class="h-[40%]">
          <Realgrid
            :progname="'HR02_001INS_VUE'"
            :progid="2"
            :rowData="filteredRowData2"
            @updatedRowData="updatedRowData2"
            @clickedRowData="clickedRowData2"
            :labelsData="labelsData"
            :valuesData="valuesData"
            :rowStateeditable="false"
            :addrowDefault="addrowDefault2"
            :addRow5="addRow2"
            :deleteRow6="deleteRow2"
            :notsoftDelete="true"
            :addrowProp="'lngAtndType,strSTime,strETime,strWorkTime,lngStoreGroup,lngStoreCode,lngWorkGroupCode,lngCode'"
            :editableColId="'strETime,strSTime,lngAtndType'"
            :CalculateTimeColId="'strWorkTime'"
            :labelingColumns="'lngAtndType'">
          </Realgrid>
        </div>
        <div class="bg-blue-800 text-white flex justify-center">
          일메모 등록
        </div>
        <div class="border border-black h-[55%]">
          <textarea
            name=""
            id=""
            class="h-full w-full"
            @input="changeCond3"
            v-model="cond3"></textarea>
        </div>
      </div>
    </div>
  </div>
  <!-- 그리드 영역 -->

  <div
    v-if="openCopy"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white rounded-2xl shadow-lg p-6 w-[32vw] h-[30vh]">
      <div class="flex justify-between">
        <h2 class="text-xl font-bold mb-4">스케쥴 복사</h2>
        <div class="flex justify-end space-x-2">
          <button
            class="px-4 py-2 bg-blue-600 rounded-lg text-white"
            @click="copyButton2">
            복사
          </button>
          <button
            @click="openCopy = false"
            class="px-4 py-2 bg-gray-300 text-black rounded-lg">
            닫기
          </button>
        </div>
      </div>
      <div class="grid grid-rows-4 grid-cols-[3fr,4fr] mt-1 h-[80%] w-[80%]">
        <div
          class="text-base font-semibold flex justify-center items-center border-l border-t border-black bg-gray-200">
          구분
        </div>
        <div
          class="text-base font-semibold flex justify-center items-center border-l border-t border-r border-black space-x-5">
          <label for="scond"
            ><input
              type="radio"
              id="scond"
              value="1"
              v-model="scond" />전체</label
          >
          <label for="scond2"
            ><input
              type="radio"
              id="scond2"
              value="2"
              v-model="scond" />해당사원</label
          >
        </div>
        <div
          class="text-base font-semibold flex justify-center items-center border-l border-t border-black bg-gray-200">
          사원명
        </div>
        <div
          class="text-base font-semibold flex justify-center items-center border-l border-t border-r border-black">
          <input
            type="text"
            class="h-[80%] w-[80%] border border-black disabled:bg-gray-300"
            v-model="scond2"
            disabled />
        </div>
        <div
          class="text-base font-semibold flex justify-center items-center border-l border-t border-black bg-gray-200">
          원본기간
        </div>
        <div
          class="text-base font-semibold flex justify-start items-center border-l border-t border-r border-black">
          <Datepicker2
            :mainName="''"
            class="!w-[40%]"
            @endDate="endDate2"
            @startDate="startDate2"></Datepicker2>
        </div>
        <div
          class="text-base font-semibold flex justify-center items-center border-l border-t border-b border-black bg-gray-200">
          대상기간
        </div>
        <div
          class="text-base font-semibold flex justify-start items-center border-l border-t border-b border-r border-black">
          <Datepicker2
            :mainName="''"
            class="!w-[40%]"
            @endDate="endDate3"
            @startDate="startDate3"></Datepicker2>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  deleteWorkPlan,
  getEmpScheduleList,
  getInitScheduleData,
  getWorkTypeDetail,
  getWorkTypeList,
  saveWorkPlanAll,
  setCopyWorkPlan,
  setWorkNote,
  setWorkPlanDetail,
} from "@/api/mihr";
import Datepicker2 from "@/components/Datepicker2.vue";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
import PickStoreRenew from "@/components/pickStoreRenew.vue";
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

const optionList = ref([]);
onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getWorkTypeList(store.state.userData.lngStoreGroup);

  labelsData.value = [res.data.List.map((item) => item.strName)];
  valuesData.value = [res.data.List.map((item) => item.lngCode)];
});

const reload = ref(false);
const rowData = ref([]);
const rowData2 = ref([]);
const filteredRowData2 = ref([]);
const rowData3 = ref([]);
const afterSearch = ref(false);
const clickedRow = ref(false);
const labelsData = ref([]);
const valuesData = ref([]);

const tempCharger = ref("");
const tempChargerNm = ref("");
const clickedRowData = (e) => {
  console.log(e);
  tempCharger.value = e[9];
  tempChargerNm.value = e[3];
  //filteredRowData2.value = rowData2.value.filter(item => item.lngCharger == e[9] && item.)
};
const cond2 = ref(0);
const cond3 = ref("");
const changeColid = ref("");
const changeValue2 = ref("");
const changeRow = ref("");
const changeNow2 = ref(false);
const tempColId = ref("");
const selectedIndex = (e) => {
  changeRow.value = e;
};
const clickedButtonCol = (e) => {
  tempColId.value = e;
  const count = parseInt(e.slice(1));

  if (isNaN(count)) {
    return;
  }
  const today = new Date(sdate.value);

  today.setDate(today.getDate() + count - 1);

  const cdate = formatLocalDate(today);

  filteredRowData2.value = rowData2.value.filter(
    (item) => item.lngCharger == tempCharger.value && item.dtmDate == cdate
  );

  cond3.value =
    rowData3.value.filter((item) => item.dtmDate == cdate)[0]?.strNote || "";

  changeColid.value = e;
  if (cond.value == "3") {
    return;
  }
  const filteredOption = optionList.value
    .filter((item) => item.lngCode == cond2.value)[0]
    .strWorkGupName.slice(0, 5);
  const filteredOption2 = optionList.value
    .filter((item) => item.lngCode == cond2.value)[0]
    .strWorkGupName.slice(6, 11);

  if (cond.value == "2") {
    changeValue2.value = filteredOption + filteredOption2;
  } else if (cond.value == "1") {
    changeValue2.value = "휴무";
  }

  // const filtered = rowData2.value.filter(
  //   (item) => item.lngCharger == tempCharger.value && item.dtmDate == cdate
  // );

  for (let i = 0; i < filteredRowData2.value.length; i++) {
    deleteRowData2.value.push(filteredRowData2.value[i]);
  }

  rowData2.value = rowData2.value.filter(
    (item) => !(item.lngCharger == tempCharger.value && item.dtmDate == cdate)
  );

  const filtered2 = optionList2.value.filter(
    (item) => item.lngWorkGroupCode == cond2.value
  );

  for (let i = 0; i < filtered2.length; i++) {
    rowData2.value.push({
      lngStoreGroup: filtered2[i].lngStoreGroup,
      lngStoreCode: filtered2[i].lngStoreCode,
      lngCode: "0",
      lngWorkGroupCode: filtered2[i].lngWorkGroupCode,
      rowStated: "updated",
      strETime: filtered2[i].strETime,
      strSTime: filtered2[i].strSTime,
      lngAtndType: "0",
      lngCharger: tempCharger.value,
      dtmDate: cdate,
      strAlias: "",
      lngType:
        filtered2[i].lngType == "" || filtered2[i].lngType == undefined
          ? 1
          : filtered2[i].lngType,
    });
  }
  const target = rowData4.value.find(
    (item) => item.lngCharger == tempCharger.value && item.dtmDate == cdate
  );

  if (cond.value == "1") {
    target.lngOffyn = 1;
    target.updated = true;
  } else {
    target.lngOffyn = 0;
    target.updated = true;
  }

  changeNow2.value = !changeNow2.value;
};

const templngCode = ref("");
const clickedRowData2 = (e) => {
  console.log(e);

  templngCode.value = e[7];
};

const updatedRow = ref([]);
const updatedRowData = (e) => {
  console.log(e);
  updatedRow.value = e;
};
const updatedRow2 = ref([]);
const updatedRowData2 = (e) => {
  //console.log(e);

  const conclude = e.filter((item) => item.lngAtndType != "0");

  const today = new Date(sdate.value);
  const count = parseInt(tempColId.value.slice(1));
  today.setDate(today.getDate() + count - 1);

  const cdate = formatLocalDate(today);
  rowData2.value = rowData2.value.filter(
    (item) => !(item.lngCharger == tempCharger.value && item.dtmDate == cdate)
  );

  for (let i = 0; i < e.length; i++) {
    rowData2.value.push({
      lngStoreGroup: e[i].lngStoreGroup,
      lngStoreCode: e[i].lngStoreCode,
      lngCode: e[i].lngCode,
      lngWorkGroupCode: e[i].lngWorkGroupCode || "",
      rowStated: "updated",
      strETime: e[i].strETime,
      strSTime: e[i].strSTime,
      lngAtndType: e[i].lngAtndType,
      lngCharger: tempCharger.value,
      dtmDate: cdate,
      strAlias: e[i].strAlias || "",
      lngType:
        e[i].lngType == "" || e[i].lngType == undefined
          ? 1
          : e.value[i].lngType,
    });
  }
  if (conclude.length > 0) {
    changeValue2.value = labelsData.value[0][
      valuesData.value[0].indexOf(String(conclude[0].lngAtndType))
    ].slice(0, 1);

    changeNow2.value = !changeNow2.value;
  } else {
    changeValue2.value = e[0].strSTime + e[e.length - 1].strETime;

    changeNow2.value = !changeNow2.value;
  }
};

const rowData1State = ref([]);
const allStateRows = (e) => {
  ////console.log(e);
  rowData1State.value = e;

  ////console.log(rowData1State.value);
};
const cond = ref(3);
const TimeArray = ref([]);
const store = useStore();
const status = ref(99);
const datepicker = ref(null);
const closePopUp = ref(false);
const custId = ref("");

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
const rowData4 = ref([]);
const searchButton = async () => {
  if (selectedStores.value == 0) {
    Swal.fire({
      title: "경고",
      text: "매장명을 먼저 선택하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  try {
    store.state.loading = true;
    initGrid();
    reload.value = !reload.value;
    const res = await getEmpScheduleList(
      selectedGroup.value,
      selectedStores.value,
      sdate.value,
      edate.value
    );

    rowData.value = res.data.List4;
    let tempRowData = res.data.List4;

    let tempMergeRowData = res.data.List;

    rowData4.value = res.data.List;
    for (let i = 0; i < tempRowData.length; i++) {
      const tempCharger = tempRowData[i].lngSequence;

      const filterData = tempMergeRowData.filter(
        (item) => item.lngCharger == tempCharger
      );
      for (let j = 1; j <= filterData.length; j++) {
        const findit = rowData.value.find(
          (item) => item.lngSequence == tempCharger
        );
        findit[`G${j}`] =
          filterData[j - 1].strAlias != ""
            ? filterData[j - 1].strAlias
            : filterData[j - 1].lngOffyn == "1"
            ? "휴무"
            : filterData[j - 1].strSTime + filterData[j - 1].strETime;
      }
    }

    rowData.value = [...rowData.value];
    rowData2.value = res.data.List2;
    rowData3.value = res.data.List3;
    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    console.log(error);
  } finally {
    store.state.loading = false;
  }
};

const saveButton = async (e) => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  try {
    await Swal.fire({
      title: "확인",
      text: "정말로 저장하시겠습니까?",
      icon: "question",
      confirmButtonText: "확인",
      cancelButtonText: "취소",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        store.state.loading = true;

        if (deleteRowData2.value.length > 0) {
          const groupcd2 = deleteRowData2.value
            .map((item) => item.lngStoreGroup)
            .join("\u200b");
          const storecd2 = deleteRowData2.value
            .map((item) => item.lngStoreCode)
            .join("\u200b");
          const lngcode2 = deleteRowData2.value
            .map((item) => item.lngCode)
            .join("\u200b");
          const dtmdate2 = deleteRowData2.value
            .map((item) => item.dtmDate)
            .join("\u200b");
          const lngtype2 = deleteRowData2.value
            .map((item) => item.lngType)
            .join("\u200b");
          const charger2 = deleteRowData2.value
            .map((item) => item.lngCharger)
            .join("\u200b");
          const res2 = await deleteWorkPlan(
            groupcd2,
            storecd2,
            lngcode2,
            dtmdate2,
            lngtype2,
            charger2
          );
          console.log(res2);
        }

        if (rowData4.value.filter((item) => item.updated == true).length > 0) {
          const groupcds = rowData4.value
            .filter((item) => item.updated == true)
            .map((item) => item.lngStoreGroup)
            .join("\u200b");
          const storecds = rowData4.value
            .filter((item) => item.updated == true)
            .map((item) => item.lngStoreCode)
            .join("\u200b");
          const dtmdates = rowData4.value
            .filter((item) => item.updated == true)
            .map((item) => item.dtmDate)
            .join("\u200b");
          const lngTypes = rowData4.value
            .filter((item) => item.updated == true)
            .map((item) => item.lngType)
            .join("\u200b");
          const lngchargers = rowData4.value
            .filter((item) => item.updated == true)
            .map((item) => item.lngCharger)
            .join("\u200b");
          const lngOffyns = rowData4.value
            .filter((item) => item.updated == true)
            .map((item) => item.lngOffyn)
            .join("\u200b");

          const res = await saveWorkPlanAll(
            groupcds,
            storecds,
            dtmdates,
            lngTypes,
            lngchargers,
            lngOffyns
          );

          console.log(res);
        }

        const rowdata2length = rowData2.value.filter(
          (item) => item.rowStated == "updated"
        );

        if (rowdata2length.length > 0) {
          console.log("여긴온거아니냐");
          const filtered = rowData2.value.filter(
            (item) => item.rowStated == "updated"
          );
          const groupcds = filtered
            .map((item) => item.lngStoreGroup)
            .join("\u200b");
          const storecds = filtered
            .map((item) => item.lngStoreCode)
            .join("\u200b");
          const lngcodes = filtered.map((item) => item.lngCode).join("\u200b");
          const dtmdates = filtered.map((item) => item.dtmDate).join("\u200b");
          const lngtypes = filtered.map((item) => item.lngType).join("\u200b");
          const charger = filtered
            .map((item) => item.lngCharger)
            .join("\u200b");
          const atndtype = filtered
            .map((item) => item.lngAtndType)
            .join("\u200b");
          const stime = filtered.map((item) => item.strSTime).join("\u200b");
          const etime = filtered.map((item) => item.strETime).join("\u200b");

          const res = await setWorkPlanDetail(
            groupcds,
            storecds,
            lngcodes,
            dtmdates,
            lngtypes,
            charger,
            atndtype,
            stime,
            etime
          );

          console.log(res);
        }

        if (rowData3.value.length > 0) {
          const groupcd = rowData3.value
            .map((item) => item.lngStoreGroup)
            .join("\u200b");
          const storecd = rowData3.value
            .map((item) => item.lngStoreCode)
            .join("\u200b");
          const dtmdate = rowData3.value
            .map((item) => item.dtmDate)
            .join("\u200b");
          const lngType = rowData3.value
            .map((item) => item.lngType)
            .join("\u200b");
          const strNote = rowData3.value
            .map((item) => item.strNote)
            .join("\u200b");

          const res = await setWorkNote(
            groupcd,
            storecd,
            dtmdate,
            lngType,
            strNote
          );

          console.log(res);
        }
      }
    });

    store.state.loading = false;
  } catch (error) {
  } finally {
    initGrid();
    searchButton();
  }
};
/* 매장 컴포넌트 관련 함수 */
const selectedGroup = ref();
const selectedStores = ref();
const selectedStoreNm = ref();
const addRow4 = ref(false);
const addRow5 = ref(false);
/**
 * 페이지 매장 코드 세팅
 */

const optionList2 = ref([]);
const lngStoreCode = async (e) => {
  initGrid();
  selectedStores.value = e;

  const res = await getInitScheduleData(store.state.userData.lngStoreGroup, e);
  //console.log(res);
  optionList.value = res.data.List;
  optionList2.value = res.data.List2;

  if (optionList.value.length > 0) {
    cond2.value = optionList.value[0].lngCode;
  }

  ////console.log(e);
};
const lngStoreGroup = async (e) => {
  //initGrid();
  selectedGroup.value = e;
  ////console.log(e);
};
const storeNm = (e) => {
  selectedStoreNm.value = e;
  ////console.log(e);
};
/**
 * 그리드 초기화
 */

const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
  if (rowData2.value.length > 0) {
    rowData2.value = [];
  }
  if (rowData3.value.length > 0) {
    rowData3.value = [];
  }
  if (rowData4.value.length > 0) {
    rowData4.value = [];
  }

  if (deleteRowData2.value.length > 0) {
    deleteRowData2.value = [];
  }
  cond.value = 3;

  afterSearch.value = false;
};

const addrowDefault = ref("");
const addrowDefault2 = ref("");
const addRow2 = ref(false);
const addButton = () => {
  if (afterSearch.value == false) {
    return;
  }

  if (tempColId.value == "" || tempCharger.value == "") {
    return;
  }
  addrowDefault2.value =
    "0,00:00,00:00, , " +
    selectedGroup.value +
    "," +
    selectedStores.value +
    ", , , ";

  addRow2.value = !addRow2.value;
};

const deleteRow2 = ref(false);
const deleteButton = async () => {
  const count = parseInt(tempColId.value.slice(1));

  const today = new Date(sdate.value);

  today.setDate(today.getDate() + count - 1);

  const cdate = formatLocalDate(today);
  const filtered = rowData2.value.filter(
    (item) =>
      item.lngCharger == tempCharger.value &&
      item.dtmDate == cdate &&
      item.lngCode == templngCode.value
  );

  for (let i = 0; i < filtered.length; i++) {
    deleteRowData2.value.push(filtered[i]);
  }

  deleteRow2.value = !deleteRow2.value;
};

const setDynamicGrid5Cond2 = ref("");

const setDynamicGrid5Cond = ref("");

const sdate = ref("");
const edate = ref("");
const startDate = (e) => {
  setDynamicGrid5Cond.value = e;
  sdate.value = e;
};

const endDate = (e) => {
  setDynamicGrid5Cond2.value = e;
  edate.value = e;
};

const setWorkGroup = async (e) => {
  //const count = parseInt(e.slice(1));
  if (tempCharger.value == "" || isNaN(parseInt(tempColId.value.slice(1)))) {
    return;
  }

  try {
    const res = await getWorkTypeDetail(
      selectedGroup.value,
      selectedStores.value,
      e.target.value
    );

    filteredRowData2.value = res.data.List;

    const sTime = filteredRowData2.value[0].strSTime;
    const eTime =
      filteredRowData2.value[filteredRowData2.value.length - 1].strETime;

    changeValue2.value = sTime + eTime;
    changeNow2.value = !changeNow2.value;

    const count = parseInt(tempColId.value.slice(1));

    const today = new Date(sdate.value);

    today.setDate(today.getDate() + count - 1);

    const cdate = formatLocalDate(today);

    const filtered = rowData2.value.filter(
      (item) => item.lngCharger == tempCharger.value && item.dtmDate == cdate
    );

    for (let i = 0; i < filtered.length; i++) {
      deleteRowData2.value.push(filtered[i]);
    }
    rowData2.value = rowData2.value.filter(
      (item) => !(item.lngCharger == tempCharger.value && item.dtmDate == cdate)
    );

    for (let i = 0; i < filteredRowData2.value.length; i++) {
      rowData2.value.push({
        lngStoreGroup: filteredRowData2.value[i].lngStoreGroup,
        lngStoreCode: filteredRowData2.value[i].lngStoreCode,
        lngCode: filteredRowData2.value[i].lngCode,
        lngWorkGroupCode: filteredRowData2.value[i].lngWorkGroupCode,
        rowStated: "updated",
        lngType:
          filteredRowData2.value[i].lngType == "" ||
          filteredRowData2.value[i].lngType == undefined
            ? 1
            : filteredRowData2.value[i].lngType,
        strETime: filteredRowData2.value[i].strETime,
        strSTime: filteredRowData2.value[i].strSTime,
        lngAtndType: filteredRowData2.value[i].lngAtndType,
        lngCharger: tempCharger.value,
        dtmDate: cdate,
        strAlias: "",
      });
    }
  } catch (error) {}
};

const deleteRowData2 = ref([]);
const setRestDay = () => {
  if (tempCharger.value == "" || isNaN(parseInt(tempColId.value.slice(1)))) {
    return;
  }

  filteredRowData2.value = [];

  const count = parseInt(tempColId.value.slice(1));

  const today = new Date(sdate.value);

  today.setDate(today.getDate() + count - 1);

  const cdate = formatLocalDate(today);
  const filtered = rowData2.value.filter(
    (item) => item.lngCharger == tempCharger.value && item.dtmDate == cdate
  );

  for (let i = 0; i < filtered.length; i++) {
    deleteRowData2.value.push(filtered[i]);
  }
  rowData2.value = rowData2.value.filter(
    (item) => !(item.lngCharger == tempCharger.value && item.dtmDate == cdate)
  );

  changeValue2.value = "휴무";
  changeNow2.value = !changeNow2.value;

  const target = rowData4.value.find(
    (item) => item.lngCharger == tempCharger.value && item.dtmDate == cdate
  );
  if (target) {
    target.lngOffyn = 1;
    target.updated = true;
  }
};

const changeCond3 = (e) => {
  const count = parseInt(tempColId.value.slice(1));

  if (isNaN(count)) {
    return;
  }

  const today = new Date(sdate.value);

  today.setDate(today.getDate() + count - 1);

  const cdate = formatLocalDate(today);

  const findit = rowData3.value.find((item) => item.dtmDate == cdate);
  if (findit) {
    findit.strNote = e.target.value;
  } else {
    rowData3.value.push({
      lngStoreGroup: selectedGroup.value,
      lngStoreCode: selectedStores.value,
      dtmDate: cdate,
      lngType: 1,
      strNote: e.target.value,
    });
  }
};

const openCopy = ref(false);

const copyButton = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (tempCharger.value == "") {
    Swal.fire({
      title: "경고",
      text: "복사할 사원을 먼저 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  scond2.value = tempChargerNm.value;
  openCopy.value = true;
};

const scond = ref("2");
const scond2 = ref("");

const tempsDate = ref("");
const tempsDate2 = ref("");
const tempeDate = ref("");
const tempeDate2 = ref("");
const endDate2 = (e) => {
  console.log(e);
  tempeDate.value = e;
};
const endDate3 = (e) => {
  console.log(e);
  tempeDate2.value = e;
};
const startDate3 = (e) => {
  console.log(e);
  tempsDate2.value = e;
};
const startDate2 = (e) => {
  console.log(e);
  tempsDate.value = e;
};

watch(scond, () => {
  if (scond.value == "1") {
    scond2.value = "";
  } else {
    scond2.value = tempChargerNm.value;
  }
});

const copyButton2 = async () => {
  try {
    store.state.loading = true;

    const res = await setCopyWorkPlan(
      selectedGroup.value,
      selectedStores.value,
      scond.value,
      tempCharger.value,
      tempsDate.value,
      tempeDate.value,
      tempsDate2.value,
      tempeDate2.value
    );

    console.log(res);
    store.state.loading = false;

    if (res.data.RESULT_CD == "00") {
      await Swal.fire({
        title: "성공",
        text: "스케쥴 복사에 성공하였습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
    } else {
      await Swal.fire({
        title: "실패",
        text: "스케쥴 복사에 실패하였습니다.",
        icon: "error",
        confirmButtonText: "확인",
      });
    }
  } catch (error) {}
};

const documentSubTitle = ref("");
const exporttoExcel = ref(false);
const excelButton = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  documentSubTitle.value =
    selectedStoreNm.value + "\n기간 :" + sdate.value + "~" + edate.value;
  exporttoExcel.value = !exporttoExcel.value;
};
</script>
