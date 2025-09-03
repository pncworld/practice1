/*--############################################################################
# Filename : MST01_008INS.vue                                                  
# Description : 마스터관리 > 메뉴 마스터 > 대그룹코드등록                      
  # Date :2025-05-14                                                           
  # Author : 권맑음                     
################################################################################*/
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

  <!-- 조회조건 -->
  <!-- 그리드 영역 -->
  <div class="flex justify-center w-[80%] h-[60vh] gap-5 ml-10 mt-5">
    <div class="w-full h-full">
      <div class="flex justify-start text-base font-semibold">
        ※사업장 리스트
      </div>
      <Realgrid
        class="w-full h-full mt-2"
        :progname="'MST49_008INS_VUE'"
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
      <div class="flex justify-start text-base font-semibold">
        ※사업장 소속 매장 리스트
      </div>
      <Realgrid
        class="w-full h-[50%] mt-2"
        :progname="'MST49_008INS_VUE'"
        :progid="2"
        :rowData="rowData2"
        :rowStateeditable="false"></Realgrid>
      <div
        class="grid grid-rows-8 grid-cols-[2fr,4fr] border border-l border-t border-black h-[50%]">
        <div class="col-span-2 bg-gray-100 flex justify-center items-center">
          업장 정보 관리
        </div>
        <div
          class="bg-gray-100 flex justify-center items-center border-t border-black">
          사업장 코드
        </div>
        <div
          class="flex justify-center items-center border-t border-l border-black">
          <input
            type="text"
            disabled
            v-model="gridvalue1"
            class="w-[80%] h-[80%] border border-black disabled:bg-gray-400" />
        </div>
        <div
          class="bg-gray-100 flex justify-center items-center border-t border-black">
          사업장 명
        </div>
        <div
          class="flex justify-center items-center border-t border-l border-black">
          <input
            type="text"
            disabled
            v-model="gridvalue2"
            class="w-[80%] h-[80%] border border-black disabled:bg-gray-400" />
        </div>

        <div
          class="bg-gray-50 flex justify-center items-center border-t border-black text-blue-500">
          <span class="text-red-500 flex justify-center text-center">*</span
          >업장코드
        </div>
        <div
          class="flex justify-center items-center border-t border-l border-black">
          <input
            type="text"
            @input="changeValue"
            name="BP_ID"
            class="w-[80%] h-[80%] border border-black"
            v-model="gridvalue3" />
        </div>

        <div
          class="bg-gray-50 flex justify-center items-center border-t border-black text-blue-500">
          <span class="text-red-500 flex justify-center text-center">*</span
          >업장명
        </div>
        <div
          class="flex justify-center items-center border-t border-l border-black">
          <input
            type="text"
            @input="changeValue"
            name="BP_NM"
            class="w-[80%] h-[80%] border border-black"
            v-model="gridvalue4" />
        </div>

        <div
          class="bg-gray-50 flex justify-center items-center border-t border-black">
          연동사용유무
        </div>
        <div
          class="flex justify-start pl-10 space-x-5 items-center border-t border-l border-black">
          <label for="cond"
            ><input
              type="radio"
              v-model="gridvalue5"
              value="1"
              @change="changeValue"
              name="USE_VAL"
              id="cond" />사용</label
          >
          <label for="cond2"
            ><input
              type="radio"
              v-model="gridvalue5"
              value="0"
              @change="changeValue"
              name="USE_VAL"
              id="cond2" />미사용</label
          >
        </div>

        <div
          class="bg-gray-50 flex justify-center items-center border-t border-black">
          등록일자
        </div>
        <div
          class="flex justify-center space-x-5 items-center border-t border-l border-black">
          <input
            type="text"
            disabled
            v-model="gridvalue6"
            class="w-[80%] h-[80%] border border-black disabled:bg-gray-400" />
        </div>

        <div
          class="bg-gray-50 flex justify-center items-center border-t border-black">
          최종 수정일자
        </div>
        <div
          class="flex justify-center space-x-5 items-center border-t border-l border-black">
          <input
            type="text"
            disabled
            v-model="gridvalue7"
            class="w-[80%] h-[80%] border border-black disabled:bg-gray-400" />
        </div>
      </div>
    </div>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import { getCustCompany3, getStoreInfoList, saveCompInfo } from "@/api/master";
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

import { insertPageLog } from "@/customFunc/customFunc";
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

const hideAll = ref(true);
onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
  if (store.state.userData.lngCommonMenu == "1") {
    hideAll.value = false;
  } else {
    hideAll.value = true;
  }
});

const nowStoreAreaCd = ref();
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
    let res = await getCustCompany3(store.state.userData.lngStoreGroup);
    rowData.value = res.data.List;

    //comsole.log(rowData2.value);
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

const selectedlngCode = ref();
const changeRow = ref(0);
const changeValue2 = ref("");
const changeColid = ref("");
const changeNow = ref(false);
const changeValue = async (e) => {
  changeColid.value = e.target.name;
  changeValue2.value = e.target.value;

  changeNow.value = !changeNow.value;

  await nextTick();
  if (changeColid.value == "USE_VAL") {
    changeColid.value = "USE_YN";
    ////console.log(e.target.value);
    changeValue2.value = e.target.value == "1" ? "Y" : "N";

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
  ////console.log(e);
  gridvalue1.value = e[0];
  gridvalue2.value = e[1];
  gridvalue3.value = e[2];
  gridvalue4.value = e[3];
  gridvalue5.value = e[7];
  gridvalue6.value = e[5];
  gridvalue7.value = e[6];
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

const saveButton = async () => {
  const bpids = updatedRows.value
    .map((item) => item.BP_ID)
    .filter((item) => item == undefined || item == "" || item == null).length;
  const bpnms = updatedRows.value
    .map((item) => item.BP_NM)
    .filter((item) => item == undefined || item == "" || item == null).length;

  if (bpids + bpnms > 0) {
    Swal.fire({
      title: "경고",
      text: "누락된 필수값이 존재합니다. 확인해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  try {
    store.state.loading = true;
    const compcds = updatedRows.value
      .filter((item, index) => stateRows.value.updated.includes(index))
      .map((item) => item.strSaleCompCode)
      .join("\u200b");
    const bpids = updatedRows.value
      .filter((item, index) => stateRows.value.updated.includes(index))
      .map((item) => item.BP_ID)
      .join("\u200b");
    const bpnms = updatedRows.value
      .filter((item, index) => stateRows.value.updated.includes(index))
      .map((item) => item.BP_NM)
      .join("\u200b");
    const usevals = updatedRows.value
      .filter((item, index) => stateRows.value.updated.includes(index))
      .map((item) => item.USE_VAL)
      .join("\u200b");

    const res = await saveCompInfo(
      store.state.userData.lngStoreGroup,
      compcds,
      bpids,
      bpnms,
      usevals,
      store.state.userData.lngSequence
    );

    ////console.log(res);
    store.state.loading = false;

    if (res.data.List[0].ERR_CODE == "00") {
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
        text: `저장을 실패하였습니다. ${res.data.List[0].ERR_MSG}`,
        icon: "error",
        confirmButtonText: "확인",
      });
      return;
    }
  } catch (error) {
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
};
/**
 * 엑셀 내보내기 함수
 */
</script>

<style></style>
