<!-- /*--############################################################################
# Filename : HR02_002INS.vue                                                   
# Description : 인사관리 > 근태 관리 > 출퇴근 확정                           
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

        <button @click="excelButton" class="button excel w-auto">엑셀</button>
      </div>
    </div>
    <div
      class="grid grid-cols-4 grid-rows-2 bg-gray-200 rounded-lg h-28 items-center z-10 justify-center">
      <div class="ml-12">
        <PickStoreRenew
          @storeNm="storeNm"
          @lngStoreGroup="lngStoreGroup"
          @lngStoreCode="lngStoreCode"></PickStoreRenew>
      </div>
      <div class="flex space-x-5 text-nowrap items-center ml-56">
        <Datepicker2
          @endDate="endDate"
          @startDate="startDate"
          :mainName="'기간'"></Datepicker2>
      </div>
      <div class="flex items-center space-x-5 ml-72 col-span-2">
        <div class="font-semibold text-base">정렬 순서</div>
        <select
          name=""
          id=""
          class="border border-black w-48 h-8"
          v-model="scond">
          <option value="1">일자</option>
          <option value="2">사원명</option>
        </select>
      </div>
      <div class="flex items-center space-x-5 ml-12">
        <div class="font-semibold text-base">사원명</div>
        <div>
          <input
            type="text"
            class="border border-black h-8 w-48"
            v-model="scond2" />
        </div>
      </div>
      <div class="flex items-center space-x-5 ml-12">
        <div class="font-semibold text-base">직책</div>
        <div>
          <select
            name=""
            id=""
            class="border border-black w-48 h-8"
            v-model="scond3">
            <option value="0">전체</option>
            <option :value="i.lngClassCode" v-for="i in optionList">
              {{ i.strClass }}
            </option>
          </select>
        </div>
      </div>
      <div class="flex items-center space-x-5 ml-12">
        <div class="font-semibold text-base">직위</div>
        <div>
          <select
            name=""
            id=""
            class="border border-black w-48 h-8"
            v-model="scond4">
            <option value="0">전체</option>
            <option :value="i.lngRankCode" v-for="i in optionList2">
              {{ i.strRank }}
            </option>
          </select>
        </div>
      </div>
      <div class="flex items-center space-x-5 ml-12">
        <div class="font-semibold text-base">근무장소</div>
        <div>
          <select
            name=""
            id=""
            class="border border-black w-48 h-8"
            v-model="scond5">
            <option value="0">전체</option>
            <option :value="i.lngAreaCode" v-for="i in optionList3">
              {{ i.strArea }}
            </option>
          </select>
        </div>
      </div>
    </div>
    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="grid grid-rows-1 grid-cols-[3fr,1fr,1fr,1fr] w-full h-[75vh]">
      <div class="h-full w-full">
        <Realgrid
          :progname="'HR02_002INS_VUE'"
          :progid="1"
          :rowData="rowData"
          :setStateBar="false"
          :mergeColumnGroupName2="['스케쥴', '기록', '확정']"
          @clickedRowData="clickedRowData"
          :mergeColumnGroupSubList2="[
            ['strPSTime', 'strPETime', 'strPTTime', 'strPWTime', 'strPRTime'],
            ['strWSTime', 'strWETime', 'strWTTime', 'strWWTime', 'strWRTime'],
            ['strRSTime', 'strRETime', 'strRTTime', 'strRWTime', 'strRRTime'],
          ]"
          :mergeColumns2="true"
          :editableColId="'strWorkGupName'"
          :setCellStyleColId2="[
            'strPSTime',
            'strPETime',
            'strPTTime',
            'strPWTime',
            'strPRTime',
            'strWSTime',
            'strWETime',
            'strWTTime',
            'strWWTime',
            'strWRTime',
            'strRSTime',
            'strRETime',
            'strRTTime',
            'strRWTime',
            'strRRTime',
          ]"
          :rowStateeditable="false">
        </Realgrid>
      </div>
      <div class="h-full w-full">
        <Realgrid
          :progname="'HR02_002INS_VUE'"
          :progid="2"
          :rowData="filteredrowData2"
          :setStateBar="false"
          :mergeColumnGroupName2="['스케쥴']"
          :mergeColumnGroupSubList2="[
            ['lngAtndType', 'strSTime', 'strETime', 'strWTime'],
          ]"
          :labelsData="labelsData"
          :valuesData="valuesData"
          :labelingColumns="'lngAtndType'"
          :mergeColumns2="true"
          :rowStateeditable="false">
        </Realgrid>
      </div>
      <div class="h-full w-full">
        <Realgrid
          :progname="'HR02_002INS_VUE'"
          :progid="3"
          :rowData="filteredrowData3"
          :labelsData="labelsData"
          :valuesData="valuesData"
          :labelingColumns="'lngAtndType'"
          :mergeColumnGroupName2="['기록']"
          :mergeColumnGroupSubList2="[
            ['lngAtndType', 'strSTime', 'strETime', 'strWTime'],
          ]"
          :mergeColumns2="true"
          :editableColId="'strWorkGupName'"
          :setStateBar="false"
          :rowStateeditable="false">
        </Realgrid>
      </div>
      <div class="h-[95%] w-full space-y-1">
        <div class="flex justify-end space-x-5 items-center mt-1">
          <div>
            <button class="whitebutton" @click="addButton">신규</button>
          </div>
          <div>
            <button class="whitebutton" @click="deleteButton">삭제</button>
          </div>
        </div>
        <Realgrid
          :progname="'HR02_002INS_VUE'"
          :progid="4"
          :rowData="filteredrowData4"
          :labelsData="labelsData"
          :valuesData="valuesData"
          :labelingColumns="'lngAtndType'"
          @clickedRowData="clickedRowData2"
          @updatedRowData="updatedRowData2"
          :setStateBar="false"
          :addRow5="addRow"
          :deleteRow6="deleteRow"
          :notsoftDelete="true"
          :addrowDefault="'0,00:00,00:00,,'"
          :addrowProp="'lngAtndType,strSTime,strETime,strWTime'"
          :mergeColumnGroupName2="['확정']"
          :mergeColumnGroupSubList2="[
            ['lngAtndType', 'strSTime', 'strETime', 'strWTime'],
          ]"
          :mergeColumns2="true"
          :CalculateTimeColId="['strWTime']"
          :editableColId="'lngAtndType,strSTime,strETime'"
          :rowStateeditable="false">
        </Realgrid>
      </div>
    </div>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import { getInitEmpInfo } from "@/api/miattend";
import {
  getWorkEmpList,
  getWorkTypeList,
  saveWorkDetail,
  saveWorkShift,
  saveWorkShiftDetail,
  updateWorkShift,
  updateWorkShiftDetail,
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

import { insertPageLog } from "@/customFunc/customFunc";
import { es } from "date-fns/locale";
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

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getInitEmpInfo(store.state.userData.lngStoreGroup);

  optionList.value = res.data.List2;
  optionList2.value = res.data.List3;
  optionList3.value = res.data.List;

  const res2 = await getWorkTypeList(store.state.userData.lngStoreGroup);

  valuesData.value = [res2.data.List.map((item) => item.lngCode)];
  labelsData.value = [res2.data.List.map((item) => item.strName)];
});

const valuesData = ref([]);
const labelsData = ref([]);
const optionList = ref([]);
const optionList2 = ref([]);
const optionList3 = ref([]);

const reload = ref(false);
const rowData = ref([]);
const rowData2 = ref([]);
const filteredrowData2 = ref([]);
const filteredrowData3 = ref([]);
const filteredrowData4 = ref([]);
const rowData3 = ref([]);
const afterSearch = ref(false);
const clickedRow = ref(false);
const clickedLngCode = ref();

const updatedRow = ref([]);

const updatedRow2 = ref([]);

const rowData1State = ref([]);

const cond = ref("");
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

    const res = await getWorkEmpList(
      selectedGroup.value,
      selectedStores.value,
      sdate.value,
      edate.value,
      scond2.value,
      scond3.value,
      scond4.value,
      scond5.value,
      scond.value
    );
    console.log(res);
    rowData.value = res.data.List2;
    rowData2.value = res.data.List3;
    rowData3.value = res.data.List4;
    rowData4.value = res.data.List5;
    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    //comsole.log(error);
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

  const updatedlength = rowData3.value.filter((item) => item.updated == true);

  if (updatedlength == 0 && deleterows.value.length == 0) {
    Swal.fire({
      title: "경고",
      text: "수정된 사항이 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  try {
    store.state.loading = true;

    const lngCodes = rowData3.value
      .filter((item) => item.updated == true)
      .map((item) => item.lngCode)
      .join("\u200b");
    const dtmDates = rowData3.value
      .filter((item) => item.updated == true)
      .map((item) => item.dtmDate)
      .join("\u200b");
    const lngChargers = rowData3.value
      .filter((item) => item.updated == true)
      .map((item) => item.lngCharger)
      .join("\u200b");
    const AtndTypes = rowData3.value
      .filter((item) => item.updated == true)
      .map((item) => item.lngAtndType)
      .join("\u200b");
    const stimes = rowData3.value
      .filter((item) => item.updated == true)
      .map((item) => item.strSTime)
      .join("\u200b");
    const etimes = rowData3.value
      .filter((item) => item.updated == true)
      .map((item) => item.strETime)
      .join("\u200b");

    const lngCodes2 = deleterows.value
      .map((item) => item.lngCode)
      .join("\u200b");
    const dtmDate2 = deleterows.value
      .map((item) => item.dtmDate)
      .join("\u200b");
    const lngChargers2 = deleterows.value
      .map((item) => item.lngCharger)
      .join("\u200b");
    const res = await saveWorkDetail(
      selectedGroup.value,
      selectedStores.value,
      lngCodes,
      dtmDates,
      3,
      lngChargers,
      AtndTypes,
      stimes,
      etimes,
      lngCodes2,
      dtmDate2,
      lngChargers2
    );

    console.log(res);

    store.state.loading = false;
  } catch (error) {
  } finally {
    store.state.loading = false;
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

const lngStoreCode = async (e) => {
  initGrid();
  selectedStores.value = e;
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
  if (filteredrowData2.value.length > 0) {
    filteredrowData2.value = [];
  }

  afterSearch.value = false;
  tempEmpId.value = "";
};

const sdate = ref("");
const startDate = (e) => {
  sdate.value = e;
};

const edate = ref("");
const endDate = (e) => {
  edate.value = e;
};

const scond = ref("1");
const scond2 = ref("");
const scond3 = ref("0");
const scond4 = ref("0");
const scond5 = ref("0");

const tempEmpId = ref("");
const tempdtmDate = ref("");
const clickedRowData = (e) => {
  console.log(e);
  tempEmpId.value = e[21];
  tempdtmDate.value = e[3];
  filteredrowData2.value = rowData2.value.filter(
    (item) => item.dtmDate == e[3] && item.lngCharger == e[21]
  );
  filteredrowData3.value = rowData3.value.filter(
    (item) =>
      item.dtmDate == e[3] && item.lngCharger == e[21] && item.lngType == "2"
  );
  filteredrowData4.value = rowData3.value.filter(
    (item) =>
      item.dtmDate == e[3] && item.lngCharger == e[21] && item.lngType == "3"
  );

  updatedrowdata2.value = filteredrowData4.value;
};

const addRow = ref(false);
const addButton = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (tempEmpId.value == false) {
    Swal.fire({
      title: "경고",
      text: "추가하실 스케쥴을 먼저 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  rowData3.value.push({
    dtmDate: tempdtmDate.value,
    lngCharger: tempEmpId.value,
    lngType: 3,
    lngAtndType: 0,
    lngCode: "",
    lngStoreGroup: selectedGroup.value,
    lngStoreCode: selectedStores.value,
    strETime: "00:00",
    strSTime: "00:00",
    strWTime: "",
  });
  addRow.value = !addRow.value;
};

const tempAtndType = ref(false);

const tempAtndType1 = ref("");
const tempsTime = ref("");
const tempeTime = ref("");
const tempLngCode = ref("");
const clickedRowData2 = (e) => {
  console.log(e);
  tempAtndType.value = true;
  tempAtndType1.value = e[0];
  tempsTime.value = e[1];
  tempeTime.value = e[2];
  tempLngCode.value = e[4];
};

const deleteRow = ref(false);
const deleterows = ref([]);
const deleteButton = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (tempEmpId.value == false) {
    Swal.fire({
      title: "경고",
      text: "추가하실 스케쥴을 먼저 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (tempAtndType.value == false) {
    Swal.fire({
      title: "경고",
      text: "삭제하실 스케쥴을 먼저 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  rowData3.value = rowData3.value.filter(
    (item) =>
      item.lngCharger != tempEmpId.value &&
      item.dtmDate != tempdtmDate.value &&
      item.lngAtndType != tempAtndType1.value &&
      item.strSTime != tempsTime.value &&
      item.strETime != tempeTime.value
  );

  deleterows.value.push({
    lngStoreGroup: selectedGroup.value,
    lngStoreCode: selectedStores.value,
    lngCode: tempLngCode.value,
    dtmDate: tempdtmDate.value,
    lngType: 3,
    lngCharger: tempEmpId.value,
  });
  deleteRow.value = !deleteRow.value;
};

const updatedrowdata2 = ref([]);
const updatedRowData2 = (e) => {
  console.log(e);
  rowData3.value = rowData3.value.filter(
    (item) =>
      item.lngCharger != tempEmpId.value && item.dtmDate != tempdtmDate.value
  );

  for (let i = 0; i < e.length; i++) {
    rowData3.value.push({
      dtmDate: tempdtmDate.value,
      lngCharger: tempEmpId.value,
      lngType: 3,
      lngAtndType: e[i].lngAtndType,
      lngCode: e[i].lngCode || "0",
      lngStoreGroup: selectedGroup.value,
      lngStoreCode: selectedStores.value,
      strETime: e[i].strETime,
      strSTime: e[i].strSTime,
      strWTime: e[i].strWTime,
      updated: true,
    });
  }

  console.log(
    rowData3.value.filter(
      (item) => item.lngType == 3 && item.lngCharger == "169107"
    )
  );
  updatedrowdata2.value = e;
};
</script>
