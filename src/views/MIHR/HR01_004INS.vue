/*--############################################################################
# Filename : HR01_004INS.vue                                                   
# Description : 인사관리 > 마스터 관리 > 급여기준 등록                         
# Date :2025-06-11                                                              
# Author : 권맑음                     
################################################################################*/
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
        <button @click="excelButton" class="button excel w-auto">엑셀</button>
      </div>
    </div>

    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div
      class="grid grid-rows-1 grid-cols-[2fr,1fr] w-[99%] h-[80vh] space-x-3 mt-10">
      <div class="w-full h-[85%] space-y-1">
        <Realgrid
          :progname="'HR01_004INS_VUE'"
          :progid="1"
          :rowData="rowData"
          :reload="reload"
          @clickedRowData="clickedRowData"
          @updatedRowData="updatedRowData"
          @selectedIndex="selectedIndex"
          :addRow4="addRow4"
          :changeRow="changeRow"
          :changeColid="changeColid"
          :changeValue2="changeValue2"
          :changeNow2="changeNow"
          @allStateRows="allStateRows"
          :addrowProp="'strStndName,lngWorkType,strWorkType,lngOTPayRate,lngHWPayRate,lngNWPayRate,timNWStime'"
          :addrowDefault="addrowDefault"
          :editableColId="'strWorkGupName'"
          :setStateBar="false"
          :checkRowAuto="false"
          :mergeColumns3="true"
          :documentTitle="'HR01_004INS'"
          :exporttoExcel="exporttoExcel"
          :mergeColumnGroupName4="['탄력근무제 관련']"
          :mergeColumnGroupName3="[
            ['기본', '연장제한시간'],
            ['야간근무시간', '급여기산일'],
          ]"
          :mergeColumnGroupSubList3="[
            [
              ['strPeriod', 'dtmApplyDate', 'timFixWorkHour'],
              ['timLimitHourWeek', 'timLimitHourWeekAvg', 'timLimitHourDay'],
            ],
            [
              ['timNWStime', 'timNWETime'],
              ['lngPayAcntS', 'lngPayAcntE'],
            ],
          ]"
          :checkRenderEditable="true"
          :rowStateeditable="false"
          :dynamicRowHeight="true">
        </Realgrid>
      </div>
      <div class="w-full h-full">
        <div class="grid grid-rows-[15] grid-cols-[2fr,4fr] w-full h-[80%]">
          <div
            class="bg-gray-200 border-l border-t border-black flex justify-center items-center">
            급여 기준명
          </div>
          <div
            class="flex justify-center items-center border-l border-t border-black">
            <input
              type="text"
              class="border border-black w-[80%] h-[80%]"
              name="strStndName"
              @input="changeInfo"
              v-model="gridvalue1" />
          </div>
          <div
            class="bg-gray-200 border-l border-t border-black flex justify-center items-center">
            근무 형태
          </div>
          <div
            class="flex justify-start items-center border-l border-t border-black pl-10 space-x-3">
            <label for="cond"
              ><input
                type="radio"
                id="cond"
                name="lngWorkType"
                @change="changeInfo"
                v-model="gridvalue2"
                value="1" />정직원</label
            >
            <label for="cond2"
              ><input
                type="radio"
                id="cond2"
                name="lngWorkType"
                @change="changeInfo"
                v-model="gridvalue2"
                value="2" />P/T</label
            >
          </div>
          <div
            class="bg-gray-200 border-l border-t border-black flex justify-center items-center">
            연장 근무수당
          </div>
          <div
            class="flex justify-start items-center border-l border-t border-black pl-10">
            <input
              type="number"
              name="lngOTPayRate"
              @change="changeInfo"
              class="border border-black w-[40%] h-[80%]"
              v-model="gridvalue3" />%
          </div>
          <div
            class="bg-gray-200 border-l border-t border-black flex justify-center items-center">
            휴일 근무수당
          </div>
          <div
            class="flex justify-start items-center border-l border-t border-black pl-10">
            <input
              type="number"
              name="lngHWPayRate"
              @change="changeInfo"
              class="border border-black w-[40%] h-[80%]"
              v-model="gridvalue4" />%
          </div>
          <div
            class="bg-gray-200 border-l border-t border-black flex justify-center items-center">
            야간 근무수당
          </div>
          <div
            class="flex justify-start items-center border-l border-t border-black pl-10">
            <input
              type="number"
              name="lngNWPayRate"
              @change="changeInfo"
              class="border border-black w-[40%] h-[80%]"
              v-model="gridvalue5" />%
          </div>
          <div
            class="bg-gray-200 border-l border-t border-black flex justify-center items-center">
            야간 근무 시간
          </div>
          <div
            class="flex justify-start items-center border-l border-t border-black pl-10">
            <div class="flex">
              <input
                type="number"
                name="timNWStime"
                @change="changeInfo"
                class="border border-black w-[10%] h-[80%]"
                v-model="gridvalue6" />~
              <input
                type="number"
                name="timNWETime"
                @change="changeInfo"
                class="border border-black w-[10%] h-[80%]"
                v-model="gridvalue7" />
            </div>
          </div>
          <div
            class="bg-gray-200 border-l border-t border-black flex justify-center items-center">
            주휴 수당
          </div>
          <div
            class="flex justify-start items-center border-l border-t border-black pl-10">
            <input
              type="number"
              name="lngWHPayRate"
              @change="changeInfo"
              class="border border-black w-[40%] h-[80%]"
              v-model="gridvalue8" />%
          </div>
          <div
            class="bg-gray-200 border-l border-t border-black flex justify-center items-center">
            급여 기산일
          </div>
          <div
            class="flex justify-start items-center border-l border-t border-black pl-10">
            <div class="flex">
              <input
                type="number"
                name="lngPayAcntS"
                @change="changeInfo"
                class="border border-black w-[10%] h-[80%]"
                v-model="gridvalue9" />~
              <input
                type="number"
                name="lngPayAcntE"
                @change="changeInfo"
                class="border border-black w-[10%] h-[80%]"
                v-model="gridvalue10" />
            </div>
          </div>
          <div
            class="bg-gray-200 border-l border-t border-black flex justify-center items-center">
            급여일
          </div>
          <div
            class="flex justify-start items-center border-l border-t border-black pl-10">
            <input
              type="number"
              name="lngPayDay"
              @change="changeInfo"
              class="border border-black w-[40%] h-[80%]"
              v-model="gridvalue11" />
          </div>
          <div
            class="bg-gray-200 border-l border-t border-black flex justify-center items-center">
            수당 지급일
          </div>
          <div
            class="flex justify-start items-center border-l border-t border-black pl-10">
            <input
              type="number"
              name="lngEPayDay"
              @change="changeInfo"
              class="border border-black w-[40%] h-[80%]"
              v-model="gridvalue12" />
          </div>
          <div
            class="bg-gray-200 border-l border-t border-black flex justify-center items-center">
            주기
          </div>
          <div
            class="flex justify-start items-center border-l border-t border-black pl-10">
            <input
              type="number"
              name="lngPeriod"
              @change="changeInfo"
              class="border border-black w-[40%] h-[80%]"
              v-model="gridvalue13" />
            <select
              id=""
              name="lngPeriodCls"
              @change="changeInfo"
              class="border border-black w-16 ml-5"
              v-model="gridvalue14">
              <option value="1">월</option>
              <option value="2">주</option>
              <option value="3">일</option>
            </select>
          </div>
          <div
            class="bg-gray-200 border-l border-t border-black flex justify-center items-center">
            소정 근로 시간(week)
          </div>
          <div
            class="flex justify-start items-center border-l border-t border-black pl-10">
            <input
              type="number"
              name="timFixWorkHour"
              @change="changeInfo"
              class="border border-black w-[40%] h-[80%]"
              v-model="gridvalue15" />
          </div>
          <div
            class="bg-gray-200 border-l border-t border-black flex justify-center items-center">
            시작일
          </div>
          <div
            class="flex justify-start items-center border-l border-t border-black pl-10">
            <input
              type="date"
              name="dtmApplyDate"
              @change="changeInfo"
              class="border border-black w-[40%] h-[80%]"
              v-model="gridvalue16" />
          </div>
          <div
            class="bg-gray-200 border-l border-t border-black flex justify-center items-center">
            연장 제한(Week Avg)
          </div>
          <div
            class="flex justify-start items-center border-l border-t border-black pl-10">
            <input
              type="number"
              name="timLimitHourWeekAvg"
              @change="changeInfo"
              class="border border-black w-[40%] h-[80%]"
              v-model="gridvalue17" />
          </div>
          <div
            class="bg-gray-200 border-l border-t border-black flex justify-center items-center">
            연장 제한(Week)
          </div>
          <div
            class="flex justify-start items-center border-l border-t border-black pl-10">
            <input
              type="number"
              name="timLimitHourWeek"
              @change="changeInfo"
              class="border border-black w-[40%] h-[80%]"
              v-model="gridvalue18" />
          </div>
          <div
            class="bg-gray-200 border-l border-t border-black flex justify-center items-center">
            연장 제한(day)
          </div>
          <div
            class="flex justify-start items-center border-l border-t border-black pl-10">
            <input
              type="number"
              name="timLimitHourDay"
              @change="changeInfo"
              class="border border-black w-[40%] h-[80%]"
              v-model="gridvalue19" />
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import {
  deleteSalaryPolicy,
  deleteWorkShifts,
  deleteWorkShifts2,
  getSalaryPolicy,
  getWorkShiftList,
  saveSalaryPolicy,
  saveWorkShift,
  saveWorkShiftDetail,
  updateSalaryPolicy,
  updateWorkShift,
  updateWorkShiftDetail,
} from "@/api/mihr";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
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

  searchButton();
});

const reload = ref(false);
const rowData = ref([]);
const rowData2 = ref([]);
const filteredrowData2 = ref([]);
const rowData3 = ref([]);
const afterSearch = ref(false);
const clickedRow = ref(false);
const clickedLngCode = ref();

const gridvalue1 = ref();
const gridvalue2 = ref();
const gridvalue3 = ref();
const gridvalue4 = ref();
const gridvalue5 = ref();
const gridvalue6 = ref();
const gridvalue7 = ref();
const gridvalue8 = ref();
const gridvalue9 = ref();
const gridvalue10 = ref();
const gridvalue11 = ref();
const gridvalue12 = ref();
const gridvalue13 = ref();
const gridvalue14 = ref();
const gridvalue15 = ref();
const gridvalue16 = ref();
const gridvalue17 = ref();
const gridvalue18 = ref();
const gridvalue19 = ref();

const changeRow = ref();
const selectedIndex = (e) => {
  changeRow.value = e;
};
const clickedRowData = (e) => {
  ////console.log(e);
  gridvalue1.value = e[1];
  gridvalue2.value = e[21];
  gridvalue3.value = e[3];
  gridvalue4.value = e[4];
  gridvalue5.value = e[5];
  gridvalue6.value = e[6];
  gridvalue7.value = e[7];
  gridvalue8.value = e[8];
  gridvalue9.value = e[9];
  gridvalue10.value = e[10];
  gridvalue11.value = e[11];
  gridvalue12.value = e[12];
  gridvalue13.value = e[19];
  gridvalue14.value = e[20];
  gridvalue15.value = e[15];
  gridvalue16.value = e[14];
  gridvalue17.value = e[16];
  gridvalue18.value = e[17];
  gridvalue19.value = e[18];
};

const updatedRow = ref([]);
const updatedRowData = (e) => {
  updatedRow.value = e;
};
const updatedRow2 = ref([]);

const rowData1State = ref([]);
const allStateRows = (e) => {
  ////console.log(e);
  rowData1State.value = e;

  ////console.log(rowData1State.value);
};
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

const searchButton = async () => {
  try {
    store.state.loading = true;
    initGrid();

    const res = await getSalaryPolicy(store.state.userData.lngStoreGroup);
    ////console.log(res);
    rowData.value = res.data.List;
    updatedRow.value = JSON.parse(JSON.stringify(res.data.List));
    // TimeArray.value = rowData2.value.map(item => Number(item.strSTime))
    // TimeArray.value = rowData2.value.map(item => Number(item.strETime))

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
  try {
    ////console.log(rowData1State.value);
    store.state.loading = true;
    if (rowData1State.value.created.length > 0) {
      const strStndName = updatedRow.value
        .filter((item, index) => rowData1State.value.created.includes(index))
        .map((item) => item.strStndName)
        .join("\u200b");
      const lngWorkType = updatedRow.value
        .filter((item, index) => rowData1State.value.created.includes(index))
        .map((item) => item.lngWorkType)
        .join("\u200b");
      const lngOTPayRate = updatedRow.value
        .filter((item, index) => rowData1State.value.created.includes(index))
        .map((item) => item.lngOTPayRate)
        .join("\u200b");
      const lngHWPayRate = updatedRow.value
        .filter((item, index) => rowData1State.value.created.includes(index))
        .map((item) => item.lngHWPayRate)
        .join("\u200b");
      const lngNWPayRate = updatedRow.value
        .filter((item, index) => rowData1State.value.created.includes(index))
        .map((item) => item.lngNWPayRate)
        .join("\u200b");
      const timNWStime = updatedRow.value
        .filter((item, index) => rowData1State.value.created.includes(index))
        .map((item) => item.timNWStime)
        .join("\u200b");
      const timNWETime = updatedRow.value
        .filter((item, index) => rowData1State.value.created.includes(index))
        .map((item) => item.timNWETime)
        .join("\u200b");
      const lngWHPayRate = updatedRow.value
        .filter((item, index) => rowData1State.value.created.includes(index))
        .map((item) => item.lngWHPayRate)
        .join("\u200b");
      const lngPayAcntS = updatedRow.value
        .filter((item, index) => rowData1State.value.created.includes(index))
        .map((item) => item.lngPayAcntS)
        .join("\u200b");
      const lngPayAcntE = updatedRow.value
        .filter((item, index) => rowData1State.value.created.includes(index))
        .map((item) => item.lngPayAcntE)
        .join("\u200b");
      const lngPayDay = updatedRow.value
        .filter((item, index) => rowData1State.value.created.includes(index))
        .map((item) => item.lngPayDay)
        .join("\u200b");
      const lngEPayDay = updatedRow.value
        .filter((item, index) => rowData1State.value.created.includes(index))
        .map((item) => item.lngEPayDay)
        .join("\u200b");
      const dtmApplyDate = updatedRow.value
        .filter((item, index) => rowData1State.value.created.includes(index))
        .map((item) => item.dtmApplyDate)
        .join("\u200b");
      const timFixWorkHour = updatedRow.value
        .filter((item, index) => rowData1State.value.created.includes(index))
        .map((item) => item.timFixWorkHour)
        .join("\u200b");
      const timLimitHourWeek = updatedRow.value
        .filter((item, index) => rowData1State.value.created.includes(index))
        .map((item) => item.timLimitHourWeek)
        .join("\u200b");

      const timLimitHourWeekAvg = updatedRow.value
        .filter((item, index) => rowData1State.value.created.includes(index))
        .map((item) => item.timLimitHourWeekAvg)
        .join("\u200b");
      const timLimitHourDay = updatedRow.value
        .filter((item, index) => rowData1State.value.created.includes(index))
        .map((item) => item.timLimitHourDay)
        .join("\u200b");
      const lngPeriod = updatedRow.value
        .filter((item, index) => rowData1State.value.created.includes(index))
        .map((item) => item.lngPeriod)
        .join("\u200b");
      const lngPeriodCls = updatedRow.value
        .filter((item, index) => rowData1State.value.created.includes(index))
        .map((item) => item.lngPeriodCls)
        .join("\u200b");
      try {
        const res = await saveSalaryPolicy(
          store.state.userData.lngStoreGroup,
          strStndName,
          lngWorkType,
          lngOTPayRate,
          lngHWPayRate,
          lngNWPayRate,
          timNWStime,
          timNWETime,
          lngWHPayRate,
          lngPayAcntS,
          lngPayAcntE,
          lngPayDay,
          lngEPayDay,
          dtmApplyDate,
          timFixWorkHour,
          timLimitHourWeek,
          timLimitHourWeekAvg,
          timLimitHourDay,
          lngPeriod,
          lngPeriodCls
        );
        ////console.log(res);
      } catch (error) {
        ////console.log(error);
      } finally {
      }
    }

    if (rowData1State.value.updated.length > 0) {
      const strStndName = updatedRow.value
        .filter((item, index) => rowData1State.value.updated.includes(index))
        .map((item) => item.strStndName)
        .join("\u200b");

      const lngCode = updatedRow.value
        .filter((item, index) => rowData1State.value.updated.includes(index))
        .map((item) => item.lngCode)
        .join("\u200b");

      const lngWorkType = updatedRow.value
        .filter((item, index) => rowData1State.value.updated.includes(index))
        .map((item) => item.lngWorkType)
        .join("\u200b");
      const lngOTPayRate = updatedRow.value
        .filter((item, index) => rowData1State.value.updated.includes(index))
        .map((item) => item.lngOTPayRate)
        .join("\u200b");
      const lngHWPayRate = updatedRow.value
        .filter((item, index) => rowData1State.value.updated.includes(index))
        .map((item) => item.lngHWPayRate)
        .join("\u200b");
      const lngNWPayRate = updatedRow.value
        .filter((item, index) => rowData1State.value.updated.includes(index))
        .map((item) => item.lngNWPayRate)
        .join("\u200b");
      const timNWStime = updatedRow.value
        .filter((item, index) => rowData1State.value.updated.includes(index))
        .map((item) => item.timNWStime)
        .join("\u200b");
      const timNWETime = updatedRow.value
        .filter((item, index) => rowData1State.value.updated.includes(index))
        .map((item) => item.timNWETime)
        .join("\u200b");
      const lngWHPayRate = updatedRow.value
        .filter((item, index) => rowData1State.value.updated.includes(index))
        .map((item) => item.lngWHPayRate)
        .join("\u200b");
      const lngPayAcntS = updatedRow.value
        .filter((item, index) => rowData1State.value.updated.includes(index))
        .map((item) => item.lngPayAcntS)
        .join("\u200b");
      const lngPayAcntE = updatedRow.value
        .filter((item, index) => rowData1State.value.updated.includes(index))
        .map((item) => item.lngPayAcntE)
        .join("\u200b");
      const lngPayDay = updatedRow.value
        .filter((item, index) => rowData1State.value.updated.includes(index))
        .map((item) => item.lngPayDay)
        .join("\u200b");
      const lngEPayDay = updatedRow.value
        .filter((item, index) => rowData1State.value.updated.includes(index))
        .map((item) => item.lngEPayDay)
        .join("\u200b");
      const dtmApplyDate = updatedRow.value
        .filter((item, index) => rowData1State.value.updated.includes(index))
        .map((item) => item.dtmApplyDate)
        .join("\u200b");
      const timFixWorkHour = updatedRow.value
        .filter((item, index) => rowData1State.value.updated.includes(index))
        .map((item) => item.timFixWorkHour)
        .join("\u200b");
      const timLimitHourWeek = updatedRow.value
        .filter((item, index) => rowData1State.value.updated.includes(index))
        .map((item) => item.timLimitHourWeek)
        .join("\u200b");

      const timLimitHourWeekAvg = updatedRow.value
        .filter((item, index) => rowData1State.value.updated.includes(index))
        .map((item) => item.timLimitHourWeekAvg)
        .join("\u200b");
      const timLimitHourDay = updatedRow.value
        .filter((item, index) => rowData1State.value.updated.includes(index))
        .map((item) => item.timLimitHourDay)
        .join("\u200b");
      const lngPeriod = updatedRow.value
        .filter((item, index) => rowData1State.value.updated.includes(index))
        .map((item) => item.lngPeriod)
        .join("\u200b");
      const lngPeriodCls = updatedRow.value
        .filter((item, index) => rowData1State.value.updated.includes(index))
        .map((item) => item.lngPeriodCls)
        .join("\u200b");
      try {
        const res = await updateSalaryPolicy(
          store.state.userData.lngStoreGroup,
          strStndName,
          lngCode,
          lngWorkType,
          lngOTPayRate,
          lngHWPayRate,
          lngNWPayRate,
          timNWStime,
          timNWETime,
          lngWHPayRate,
          lngPayAcntS,
          lngPayAcntE,
          lngPayDay,
          lngEPayDay,
          dtmApplyDate,
          timFixWorkHour,
          timLimitHourWeek,
          timLimitHourWeekAvg,
          timLimitHourDay,
          lngPeriod,
          lngPeriodCls
        );
        ////console.log(res);
      } catch (error) {
        ////console.log(error);
      } finally {
      }
    }

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

/**
 * 그리드 초기화
 */

const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
  gridvalue1.value = "";
  gridvalue2.value = "";
  gridvalue3.value = "";
  gridvalue4.value = "";
  gridvalue5.value = "";
  gridvalue6.value = "";
  gridvalue7.value = "";
  gridvalue8.value = "";
  gridvalue9.value = "";
  gridvalue10.value = "";
  gridvalue11.value = "";
  gridvalue12.value = "";
  gridvalue13.value = "";
  gridvalue14.value = "";
  gridvalue15.value = "";
  gridvalue16.value = "";
  gridvalue17.value = "";
  gridvalue18.value = "";
  gridvalue19.value = "";

  afterSearch.value = false;
};

const addrowDefault = ref("");
const addrowDefault2 = ref("");
const addButton = () => {
  if (afterSearch.value == false) {
    return;
  }

  addrowDefault.value = ",1,정직원,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,";
  addRow4.value = !addRow4.value;
};

const newlngCode = ref("신규");
const newlngCode2 = ref(1);

const changeNow = ref(false);
const changeColid = ref("");
const changeValue2 = ref();
const changeInfo = (e) => {
  if (changeRow.value == null || changeRow.value == undefined) {
    return;
  }
  const name = e.target.name;
  const value = e.target.value;
  if (name == "lngWorkType") {
    setTimeout(() => {
      changeColid.value = "strWorkType";
      changeValue2.value = value == 1 ? "정직원" : "P/T";

      changeNow.value = !changeNow.value;
    }, 5);
  }

  if (name == "lngPeriod") {
    setTimeout(() => {
      changeColid.value = "strPeriod";
      changeValue2.value =
        value +
        (gridvalue14.value == 1 ? "월" : gridvalue14.value == 2 ? "주" : "일");

      changeNow.value = !changeNow.value;
    }, 5);
  }
  if (name == "lngPeriodCls") {
    setTimeout(() => {
      changeColid.value = "strPeriod";
      changeValue2.value =
        gridvalue13.value +
        (gridvalue14.value == 1 ? "월" : gridvalue14.value == 2 ? "주" : "일");

      changeNow.value = !changeNow.value;
    }, 5);
  }

  changeColid.value = name;
  changeValue2.value = value;

  changeNow.value = !changeNow.value;
};
const deleteButton = async () => {
  if (updatedRow.value.filter((item) => item.checkbox == true).length == 0) {
    Swal.fire({
      title: "경고",
      text: "삭제 대상을 먼저 체크하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  Swal.fire({
    title: "경고",
    text: "정말 삭제하시겠습니까?",
    icon: "warning",
    confirmButtonText: "확인",
    cancelButtonText: "취소",
    showCancelButton: true,
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        store.state.loading = true;

        const lngcodes = updatedRow.value
          .filter((item) => item.checkbox == true)
          .map((item) => item.lngCode)
          .join("\u200b");
        const res = await deleteSalaryPolicy(
          store.state.userData.lngStoreGroup,
          lngcodes
        );

        ////console.log(res);
        store.state.loading = false;
      } catch (error) {
      } finally {
        searchButton();
      }
    } else {
      return;
    }
  });
};
const deleteButton2 = async () => {
  if (updatedRow2.value.filter((item) => item.checkbox == true).length == 0) {
    Swal.fire({
      title: "경고",
      text: "삭제 대상을 먼저 체크하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  Swal.fire({
    title: "경고",
    text: "정말 삭제하시겠습니까?",
    icon: "warning",
    confirmButtonText: "확인",
    cancelButtonText: "취소",
    showCancelButton: true,
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        store.state.loading = true;
        const groups = updatedRow2.value
          .filter((item) => item.checkbox == true)
          .map((item) => item.lngStoreGroup)
          .join("\u200b");
        const stores = updatedRow2.value
          .filter((item) => item.checkbox == true)
          .map((item) => item.lngStoreCode)
          .join("\u200b");
        const lngcodes = updatedRow2.value
          .filter((item) => item.checkbox == true)
          .map((item) => item.lngCode)
          .join("\u200b");
        const res = await deleteWorkShifts2(groups, stores, lngcodes);

        ////console.log(res);
        store.state.loading = false;
      } catch (error) {
      } finally {
        searchButton();
      }
    } else {
      return;
    }
  });
};

const exporttoExcel = ref(false);
const excelButton = () => {
  exporttoExcel.value = !exporttoExcel.value;
};
</script>
