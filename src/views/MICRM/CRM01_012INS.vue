<!-- /*--############################################################################
# Filename : CRM01_012INS.vue                                                  
# Description : 마스터관리 > 직원후불 마스터> 직원후불 기준정보 관리                     
  # Date :2025-07-10                                                           
  # Author : 권맑음                     
################################################################################*/ -->
<template>
  <!-- 조회조건 -->
  <div class="flex justify-between items-center w-full overflow-y-hidden">
    <PageName></PageName>
    <div class="flex justify-center mr-9 space-x-2 pr-5">
      <button @click="searchButton" class="button search md:w-auto w-14">
        조회
      </button>

      <button @click="saveButton" class="button save w-auto">저장</button>
      <!-- <button @click="excelButton" class="button excel w-auto">엑셀</button> -->
    </div>
  </div>
  <br />
  <div
    class="flex justify-start space-x-5 bg-gray-200 rounded-lg h-16 items-center mt-3">
    <div class="flex justify-start ml-12">
      <div class="text-lg font-semibold">고객사명</div>
      <select
        name=""
        id=""
        class="border border-gray-500 w-48 ml-5"
        v-model="cond">
        <option :value="i.strSaleCompCode" v-for="i in optionList">
          {{ i.strSaleCompName }}
        </option>
      </select>
    </div>
  </div>
  <!-- 조회조건 -->
  <!-- 그리드 영역 -->
  <div
    class="grid-cols-[3fr,2fr] grid-rows-1 grid justify-center w-[90%] h-[60vh] gap-5 ml-10 mt-5">
    <div class="w-full h-full">
      <Realgrid
        class="w-full h-full mt-2"
        :progname="'CRM01_012INS_VUE'"
        :progid="1"
        :rowData="rowData"
        :showCheckBar="false"
        :changeRow="changeRow"
        :changeColid="changeColid"
        :changeValue2="changeValue2"
        :changeNow="changeNow"
        :rowStateeditable="false"
        @allStateRows="allStateRows"
        @selectedIndex="selectedIndex"
        @updatedRowData="updatedRowData1"
        @clickedRowData="clickedRowData">
      </Realgrid>
    </div>
    <div class="w-full h-full">
      <div
        class="grid grid-rows-6 grid-cols-[2fr,4fr] border border-l border-t border-black h-[50%] mt-2">
        <div class="bg-gray-100 flex justify-center items-center border-black">
          한도구분
        </div>
        <div class="flex justify-center items-center border-l border-black">
          <select
            name="strLimitGubun"
            id=""
            :disabled="disabled"
            class="w-[80%] h-[80%] border border-black disabled:bg-gray-400"
            v-model="gridvalue1"
            @change="changeValue">
            <option value="0">한도없음</option>
            <option value="1">한도제한</option>
            <option value="2">한도제한 + 급여공제</option>
          </select>
        </div>
        <div
          class="bg-gray-100 flex justify-center items-center border-t border-black">
          한도금액
        </div>
        <div
          class="flex justify-center items-center border-t border-l border-black">
          <input
            type="number"
            :disabled="disabled"
            name="dblLimitAmt"
            @input="changeValue"
            v-model="gridvalue2"
            class="w-[80%] h-[80%] border border-black disabled:bg-gray-400" />
        </div>

        <div
          class="bg-gray-50 flex justify-center items-center border-t border-black">
          한도초기화주기
        </div>
        <div
          class="flex justify-center items-center border-t border-l border-black">
          <select
            name="strLimitResetPeriod"
            id=""
            :disabled="disabled"
            @change="changeValue"
            class="w-[80%] h-[80%] border border-black disabled:bg-gray-400"
            v-model="gridvalue3">
            <option value="1">1개월</option>
            <option value="2">2개월</option>
            <option value="3">3개월</option>
            <option value="4">4개월</option>
            <option value="5">5개월</option>
            <option value="6">6개월</option>
            <option value="7">7개월</option>
            <option value="8">8개월</option>
            <option value="9">9개월</option>
            <option value="10">10개월</option>
            <option value="11">11개월</option>
            <option value="12">12개월</option>
          </select>
        </div>

        <div
          class="bg-gray-50 flex justify-center items-center border-t border-black">
          초기화예정일자
        </div>
        <div
          class="flex justify-center items-center border-t border-l border-black">
          <input
            type="date"
            :disabled="disabled"
            @input="changeValue"
            name="dtmApplyDate"
            class="w-[80%] h-[80%] border border-black disabled:bg-gray-400"
            v-model="gridvalue4" />
        </div>

        <div
          class="bg-gray-50 flex justify-center items-center border-t border-black">
          사용가능시간대
        </div>
        <div
          class="flex justify-start pl-10 space-x-5 items-center border-t border-l border-black">
          <input
            type="time"
            :disabled="disabled"
            name="strSaleStartTime"
            v-model="gridvalue5"
            @change="changeValue"
            class="w-[30%] h-[80%] border border-black disabled:bg-gray-400" />~
          <input
            type="time"
            :disabled="disabled"
            name="strSaleEndTime"
            v-model="gridvalue6"
            @change="changeValue"
            class="w-[30%] h-[80%] border border-black disabled:bg-gray-400" />
        </div>

        <div
          class="bg-gray-50 flex justify-center items-center border-t border-black">
          한도금액수정여부
        </div>
        <div
          class="flex justify-center space-x-5 items-center border-t border-l border-black">
          <label for="cond"
            ><input
              type="radio"
              v-model="gridvalue7"
              value="0"
              :disabled="disabled"
              @change="changeValue"
              name="strLimitModify"
              id="cond" />가능</label
          >
          <label for="cond2"
            ><input
              type="radio"
              v-model="gridvalue7"
              :disabled="disabled"
              value="1"
              @change="changeValue"
              name="strLimitModify"
              id="cond2" />불가능</label
          >
        </div>
      </div>
    </div>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import { getStoreInfoList, saveCompInfo } from "@/api/master";
import {
  getBasisOfEmpPay,
  getCompanyforpay,
  saveCustCompInfo,
} from "@/api/micrm";
/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
/**
 * 매장 공통 컴포넌트
 */

/**
 * 	그리드 생성
 */

import Realgrid from "@/components/realgrid.vue";
/**
 *  페이지로그 자동 입력
 *  */

import {
  formatLocalDate,
  formatTime,
  insertPageLog,
} from "@/customFunc/customFunc";
/**
 *  경고창 호출 라이브러리
 *  */

import Swal from "sweetalert2";
/*
 * 공통 표준  Function
 */

import { nextTick, onMounted, ref, watch } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";

/**
 * 	화면 Load시 실행 스크립트
 */

const hideAll = ref(true);
const disabled = ref(true);
onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
  if (store.state.userData.lngCommonMenu == "1") {
    hideAll.value = false;
  } else {
    hideAll.value = true;
  }

  const res = await getCompanyforpay(store.state.userData.lngStoreGroup);
  ////console.log(res);
  optionList.value = res.data.List;
  if (optionList.value.length > 0) {
    cond.value = optionList.value[0].strSaleCompCode;
  } else {
    cond.value = "";
  }
});

const optionList = ref([]);
const cond = ref();
const nowStoreCd = ref();
/**
 * 선택한 포스 번호 호출 함수
 */

const deleteAll = ref(false);
/**
 *  그리드 검색어 세팅
 */

const afterSearch = ref(false);
const clickedStoreNm = ref();

const commitAll = ref(false);
const store = useStore();
const userData = store.state.userData;
const groupCd = ref(userData.lngStoreGroup);
const currentsubNo = ref();

const gridvalue1 = ref("");
const gridvalue2 = ref("");
const gridvalue3 = ref("");
const gridvalue4 = ref("");
const gridvalue5 = ref("");
const gridvalue6 = ref("");
const gridvalue7 = ref("");
/**
 * 페이지 매장 코드 세팅
 */

/**
 * 페이지 매장명 세팅
 */

/**
 * 조회 상태 초기화
 */

/**
 * 조회 초기화
 */

const confirmData = ref();
const confirmData2 = ref();
const rowData = ref([]);
const rowData2 = ref([]);
/**
 *  조회 함수
 */

const searchButton = async () => {
  try {
    store.state.loading = true;
    initGrid();
    let res = await getBasisOfEmpPay(cond.value);
    rowData.value = res.data.List;
    updatedRows.value = res.data.List;
    ////console.log(rowData.value);
  } catch (error) {
    afterSearch.value = false;
  } finally {
    store.state.loading = false; // 로딩 상태 종료

    afterSearch.value = true;
  }
};

/**
 * 추가 버튼 함수
 */

/**
 * 추가 버튼 함수
 */
watch(gridvalue5, () => {
  ////console.log(gridvalue5.value);
});
const selectedlngCode = ref();
const changeRow = ref(0);
const changeValue2 = ref("");
const changeColid = ref("");
const changeNow = ref(false);
const changeValue = async (e) => {
  changeColid.value = e.target.name;
  changeValue2.value = e.target.value;

  if (changeColid.value == "strSaleStartTime") {
    changeValue2.value =
      e.target.value.split(":")[0] + e.target.value.split(":")[1];

    changeNow.value = !changeNow.value;

    await nextTick();

    changeColid.value = "strSaleTime";
    // ////console.log(e.target.value);
    changeValue2.value = e.target.value + "~" + gridvalue6.value;
    // ////console.log(changeValue2.value);

    changeNow.value = !changeNow.value;
    await nextTick();
    return;
  }

  if (changeColid.value == "strSaleEndTime") {
    changeValue2.value =
      e.target.value.split(":")[0] + e.target.value.split(":")[1];

    changeNow.value = !changeNow.value;

    await nextTick();

    changeColid.value = "strSaleTime";
    // ////console.log(e.target.value);
    changeValue2.value = gridvalue5.value + "~" + e.target.value;
    // ////console.log(changeValue2.value);

    changeNow.value = !changeNow.value;
    await nextTick();
    return;
  }

  changeNow.value = !changeNow.value;

  await nextTick();
  if (changeColid.value == "strLimitGubun") {
    changeColid.value = "strLimitGubunTxt";
    ////console.log(e.target.value);
    changeValue2.value =
      e.target.value == "0"
        ? "한도제한"
        : e.target.value == "1"
        ? "한도제한"
        : "한도제한 + 급여공제";

    changeNow.value = !changeNow.value;
  }

  if (changeColid.value == "strLimitResetPeriod") {
    changeColid.value = "strLimitResetPeriodTxt";
    ////console.log(e.target.value);
    let period = "";
    if (e.target.value == "1") {
      period = "1개월";
    } else if (e.target.value == "2") {
      period = "2개월";
    } else if (e.target.value == "3") {
      period = "3개월";
    } else if (e.target.value == "4") {
      period = "4개월";
    } else if (e.target.value == "5") {
      period = "5개월";
    } else if (e.target.value == "6") {
      period = "6개월";
    } else if (e.target.value == "7") {
      period = "7개월";
    } else if (e.target.value == "8") {
      period = "8개월";
    } else if (e.target.value == "9") {
      period = "9개월";
    } else if (e.target.value == "10") {
      period = "10개월";
    } else if (e.target.value == "11") {
      period = "11개월";
    } else if (e.target.value == "12") {
      period = "12개월";
    }

    changeValue2.value = period;

    changeNow.value = !changeNow.value;
  }

  if (changeColid.value == "strLimitModify") {
    changeColid.value = "strLimitModifyTxt";

    changeValue2.value = e.target.value == 0 ? "가능" : "불가";

    changeNow.value = !changeNow.value;
  }
};

const selectedIndex = (e) => {
  changeRow.value = e;
};
/**
 * 데이터셋 상세정보 셋팅
 */

const clickFirst = ref(false);
const clickedRowData = async (e) => {
  ////console.log(formatLocalDate(e[3]));
  disabled.value = false;
  gridvalue1.value = e[7];
  gridvalue2.value = e[1];
  gridvalue3.value = e[8];
  gridvalue4.value =
    e[3] != undefined && e[3] != "" ? formatLocalDate(e[3]) : "";
  gridvalue5.value = e[9].substring(0, 2) + ":" + e[9].substring(2);
  gridvalue6.value = e[10].substring(0, 2) + ":" + e[10].substring(2);
  gridvalue7.value = e[11];
  try {
    const res = await getStoreInfoList(
      store.state.userData.lngStoreGroup,
      e[0]
    );

    // ////console.log(res);

    rowData2.value = res.data.List;
  } catch (error) {
  } finally {
  }
};

const stateRows = ref([]);
const allStateRows = (e) => {
  stateRows.value = e;
};
/**
 * 데이터셋 상세정보 셋팅
 */

/**
 * 입력창 수정 데이터 갱신
 */

const forsaveRowData = ref();
/**
 * 입력창 수정 데이터 갱신
 */

const updatedRows = ref([]);
const updatedRowData1 = (newValue) => {
  ////console.log(newValue);
  updatedRows.value = newValue;
};
const deleterow = ref(false);
const deleterow2 = ref(false);
/**
 * 그리드 행 삭제 버튼 함수
 */

/**
 * 그리드 행 삭제 버튼 함수
 */

/**
 *  저장 버튼 함수
 */
//저장부터
const saveButton = async () => {
  try {
    store.state.loading = true;
    const compcds = updatedRows.value
      .filter((item, index) => stateRows.value.updated.includes(index))
      .map((item) => item.strSaleCompCode)
      .join("\u200b");
    const custtypes = updatedRows.value
      .filter((item, index) => stateRows.value.updated.includes(index))
      .map((item) => item.strSaleCustType)
      .join("\u200b");
    const limitgubuns = updatedRows.value
      .filter((item, index) => stateRows.value.updated.includes(index))
      .map((item) => item.strLimitGubun)
      .join("\u200b");
    const limitamts = updatedRows.value
      .filter((item, index) => stateRows.value.updated.includes(index))
      .map((item) => item.dblLimitAmt)
      .join("\u200b");

    const resetperiods = updatedRows.value
      .filter((item, index) => stateRows.value.updated.includes(index))
      .map((item) => item.strLimitResetPeriod)
      .join("\u200b");

    const resetdays = updatedRows.value
      .filter((item, index) => stateRows.value.updated.includes(index))
      .map((item) => item.strLimitResetDay)
      .join("\u200b");

    const applydates = updatedRows.value
      .filter((item, index) => stateRows.value.updated.includes(index))
      .map((item) =>
        item.dtmApplyDate
          ? formatLocalDate(item.dtmApplyDate).split(" ")[0]
          : ""
      )
      .join("\u200b");
    ////console.log(applydates);
    const starttimes = updatedRows.value
      .filter((item, index) => stateRows.value.updated.includes(index))
      .map((item) => item.strSaleStartTime)
      .join("\u200b");

    const endtimes = updatedRows.value
      .filter((item, index) => stateRows.value.updated.includes(index))
      .map((item) => item.strSaleEndTime)
      .join("\u200b");

    const limitmodify = updatedRows.value
      .filter((item, index) => stateRows.value.updated.includes(index))
      .map((item) => item.strLimitModify)
      .join("\u200b");

    const res = await saveCustCompInfo(
      compcds,
      custtypes,
      limitgubuns,
      limitamts,
      resetperiods,
      resetdays,
      applydates,
      starttimes,
      endtimes,
      limitmodify,
      store.state.userData.lngSequence
    );

    ////console.log(res);
    store.state.loading = false;

    if (res.data.RESULT_CD == "00") {
      Swal.fire({
        title: "성공",
        text: "저장하였습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
      return;
    } else {
      Swal.fire({
        title: "실패",
        text: `저장을 실패하였습니다. ${res.data.RESULT_NM}`,
        icon: "error",
        confirmButtonText: "확인",
      });
      return;
    }
  } catch (error) {
    // ////console.log(error);
  } finally {
    searchButton();
  }
};
const initGrid = () => {
  gridvalue1.value = "";
  gridvalue2.value = "";
  gridvalue3.value = "";
  gridvalue4.value = "";
  gridvalue5.value = "";
  gridvalue6.value = "";
  gridvalue7.value = "";

  if (rowData2.value.length > 0) {
    rowData2.value = [];
  }
  disabled.value = true;
};
/**
 * 엑셀 내보내기 함수
 */
</script>

<style></style>
