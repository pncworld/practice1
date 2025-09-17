<!-- /*--############################################################################
# Filename : CRM10_001INS.vue                                                  
# Description : 고객관리 > 프로모션 관리 > 멤버 프로모션 등록         
# Date :2025-06-25                                                             
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
        <button @click="addButton" class="button new md:w-auto w-14">
          신규
        </button>
        <button @click="saveButton" class="button save w-auto">저장</button>
      </div>
    </div>
    <div class="h-[20vh] w-full">
      <Realgrid
        :progname="'CRM10_001INS_VUE'"
        :progid="1"
        :rowData="rowData"
        @buttonClicked="buttonClicked"
        :rowStateeditable="false">
      </Realgrid>
    </div>
    <div class="grid grid-rows-[1fr,1fr,5fr] grid-cols-[1fr,2fr,1fr,2fr] mt-1">
      <div
        class="border-l border-t border-black flex justify-center items-center bg-gray-100">
        프로모션코드/명
      </div>
      <div class="flex border-l border-t border-black space-x-2">
        <input
          type="text"
          class="border border-black w-[15%] disabled:bg-gray-50"
          v-model="cond"
          disabled />
        <input
          type="text"
          class="border border-black w-[60%]"
          v-model="cond2" />
      </div>
      <div
        class="border-l border-t border-black flex justify-center items-center bg-gray-100">
        프로모션 기간
      </div>
      <div class="border-l border-t border-black">
        <input type="date" class="border border-black" v-model="cond3" /> ~
        <input type="date" class="border border-black" v-model="cond4" />
      </div>
      <div
        class="border-l border-t border-black flex justify-center items-center bg-gray-100">
        멤버구분
      </div>
      <div class="col-span-3 border-l border-t border-black space-x-2">
        <label for="mem"
          ><input
            type="radio"
            name="member"
            id="mem"
            v-model="cond5"
            value="0" />일반고객</label
        >
        <label for="mem2"
          ><input
            type="radio"
            name="member"
            id="mem2"
            v-model="cond5"
            value="1" />멤버쉽</label
        >
      </div>
      <div
        class="border-l border-t border-black flex justify-center items-center border-b bg-gray-100">
        행사정책
      </div>
      <div class="border-l border-t border-black flex border-b">
        <div class="grid grid-rows-6 grid-cols-1 w-[50%]">
          <input
            type="text"
            class="border border-black"
            name="cond6"
            v-model="cond6"
            @input="set42byte" />
          <input
            type="text"
            class="border border-black"
            name="cond7"
            v-model="cond7"
            @input="set42byte" />
          <input
            type="text"
            class="border border-black"
            name="cond8"
            v-model="cond8"
            @input="set42byte" />
          <input
            type="text"
            name="cond9"
            class="border border-black"
            v-model="cond9"
            @input="set42byte" />
          <input
            type="text"
            name="cond10"
            class="border border-black"
            v-model="cond10"
            @input="set42byte" />
          <input
            type="text"
            name="cond11"
            class="border border-black"
            v-model="cond11"
            @input="set42byte" />
          <input
            type="text"
            name="cond111"
            class="border border-black"
            v-model="cond111"
            @input="set42byte" />
        </div>
        <div class="space-y-16">
          <div class="text-red-500 font-semibold">
            ({{ currentbyteleng }})byte
          </div>
          <div class="font-semibold">
            ※행사 정책, 내용 입력시 영수증에 출력됩니다.
          </div>
        </div>
      </div>
      <div
        class="border-l border-t border-black flex justify-center items-center border-b bg-gray-100">
        행사내용
      </div>
      <div class="border-l border-t border-b border-black flex">
        <div class="grid grid-rows-6 grid-cols-1 w-[50%]">
          <input
            type="text"
            class="border border-black"
            name="cond12"
            v-model="cond12"
            @input="set42byte2" />
          <input
            type="text"
            class="border border-black"
            name="cond13"
            v-model="cond13"
            @input="set42byte2" />
          <input
            type="text"
            name="cond14"
            class="border border-black"
            v-model="cond14"
            @input="set42byte2" />
          <input
            type="text"
            name="cond15"
            class="border border-black"
            v-model="cond15"
            @input="set42byte2" />
          <input
            type="text"
            name="cond16"
            class="border border-black"
            v-model="cond16"
            @input="set42byte2" />
          <input
            type="text"
            name="cond17"
            class="border border-black"
            v-model="cond17"
            @input="set42byte2" />
          <input
            type="text"
            name="cond171"
            class="border border-black"
            v-model="cond171"
            @input="set42byte2" />
        </div>
        <div class="space-y-16">
          <div class="text-red-500 font-semibold">
            ({{ currentbyteleng2 }})byte
          </div>
        </div>
      </div>
    </div>
    <div
      class="w-full h-6 bg-gray-400 flex justify-center items-center text-white">
      행사 조건
    </div>
    <div
      class="grid grid-cols-[2.5fr,5fr,2.5fr,5fr] grid-rows-[5fr,1fr,5fr,5fr] h-[40vh]">
      <div
        class="bg-gray-100 flex justify-center items-center border-l border-t border-black">
        적용매장
      </div>
      <div class="flex border-l border-t border-black col-span-3">
        <Realgrid
          :progname="'CRM10_001INS_VUE'"
          :progid="3"
          class="w-[30%]"
          :rowStateeditable="false"
          :rowData="rowData2">
        </Realgrid>
        <div>
          <button class="button search" @click="openStore(1)">조회</button>
        </div>
      </div>
      <div
        class="bg-gray-100 flex justify-center items-center border-l border-t border-black">
        필수잔수갯수
      </div>
      <div class="flex border-l border-t border-black space-x-5">
        <div class="font-semibold">일반 :</div>
        <div class="w-[20%] h-full">
          <input
            type="text"
            class="border w-full"
            v-model="cond18"
            name="cond18"
            @input="onlyNumber" />
        </div>
        <div class="font-semibold">필수 :</div>
        <div class="w-[20%]">
          <input
            type="text"
            class="border w-full"
            v-model="cond19"
            name="cond19"
            @input="onlyNumber" />
        </div>
      </div>

      <div
        class="bg-gray-100 flex justify-center items-center border-l border-t border-black">
        APP DOWN 프로모션
      </div>
      <div class="flex border-l border-t border-black space-x-5">
        <label for="set"
          ><input
            type="checkbox"
            id="set"
            v-model="cond20"
            value="true" />적용</label
        >
      </div>

      <div
        class="bg-gray-100 flex justify-center items-center border-l border-t border-black">
        일반 잔수 메뉴
      </div>
      <div class="flex border-l border-t border-black">
        <Realgrid
          :progname="'CRM10_001INS_VUE'"
          :progid="2"
          class="w-[70%]"
          :rowStateeditable="false"
          :rowData="rowData3">
        </Realgrid>
        <div>
          <button class="button search" @click="openMenu(1)">조회</button>
        </div>
      </div>

      <div
        class="bg-gray-100 flex justify-center items-center border-l border-t border-black">
        필수 잔수 메뉴
      </div>
      <div class="flex border-l border-t border-black">
        <Realgrid
          :progname="'CRM10_001INS_VUE'"
          :progid="2"
          class="w-[70%]"
          :rowStateeditable="false"
          :rowData="rowData4">
        </Realgrid>
        <div>
          <button class="button search" @click="openMenu(2)">조회</button>
        </div>
      </div>

      <div
        class="bg-gray-100 flex justify-center items-center border-l border-t border-black">
        텀블러 메뉴
      </div>
      <div class="flex border-l border-t border-black col-span-1">
        <Realgrid
          :progname="'CRM10_001INS_VUE'"
          :progid="2"
          class="w-[70%]"
          :rowStateeditable="false"
          :rowData="rowData5">
        </Realgrid>
        <div>
          <button class="button search" @click="openMenu(3)">조회</button>
        </div>
      </div>
    </div>
    <div
      class="w-full h-6 bg-gray-400 flex justify-center items-center text-white">
      행사 혜택
    </div>
    <div class="grid grid-rows-[1fr,5fr,1fr] grid-cols-[2.5fr,5fr,2.5fr,5fr]">
      <div
        class="bg-gray-100 flex justify-center items-center border-l border-t border-black">
        혜택 구분
      </div>
      <div
        class="flex space-x-5 pl-2 border-l border-t border-black col-span-3">
        <label for="cond1"
          ><input
            type="radio"
            name="cond"
            id="cond1"
            v-model="cond21"
            value="0" />멤버쉽 쿠폰
        </label>
        <label for="cond2"
          ><input
            type="radio"
            name="cond"
            id="cond2"
            value="1"
            v-model="cond21" />프로모션 참여권
        </label>
        <label for="cond3"
          ><input
            type="radio"
            name="cond"
            id="cond3"
            value="2"
            v-model="cond21" />프로모션 포인트 부여
        </label>
      </div>
      <div
        class="w-full bg-gray-100 flex justify-center items-center border-l border-t border-black">
        사용쿠폰/서브쿠폰
      </div>
      <div
        class="w-full flex flex-col space-y-2 justify-center items-center border-l border-t border-black">
        <div class="flex justify-center">
          <input
            type="text"
            class="w-[10%] border border-black"
            v-model="cond22" />
          <input
            type="text"
            class="w-[40%] border border-black"
            v-model="cond23" />
          <button
            class="button search"
            :disabled="disabled2"
            @click="searchButton4(1)">
            조회
          </button>
        </div>
        <div class="flex justify-center">
          <input
            type="text"
            class="w-[10%] border border-black"
            v-model="cond24" />
          <input
            type="text"
            class="w-[40%] border border-black"
            v-model="cond25" />
          <button
            class="button search"
            :disabled="disabled2"
            @click="searchButton4(2)">
            조회
          </button>
        </div>
      </div>
      <div
        class="w-full bg-gray-100 flex justify-center items-center border-l border-t border-black">
        혜택적용매장
      </div>
      <div class="flex border-l border-t border-black col-span-1">
        <Realgrid
          :progname="'CRM10_001INS_VUE'"
          :progid="3"
          class="w-[70%]"
          :rowStateeditable="false"
          :rowData="rowData6">
        </Realgrid>
        <div>
          <button
            class="button search"
            :disabled="disabled2"
            @click="openStore(2)">
            조회
          </button>
        </div>
      </div>
      <div
        class="w-full bg-gray-100 flex justify-center items-center border-l border-t border-black">
        혜택포인트
      </div>
      <div class="flex border-l border-t border-black space-x-5">
        <input
          type="text"
          class="border border-black"
          :disabled="disabled"
          name="cond26"
          @input="onlyNumber"
          v-model="cond26" />
        <span class="font-semibold">Point</span>
      </div>
      <div
        class="w-full bg-gray-100 flex justify-center items-center border-l border-t border-black">
        혜택유효기간
      </div>
      <div class="flex border-l border-t border-black space-x-5">
        <input
          type="text"
          class="border border-black"
          :disabled="disabled"
          name="cond27"
          @input="onlyNumber"
          v-model="cond27" />
        <span class="font-semibold">Day</span>
      </div>
    </div>
    <div
      class="w-full h-6 bg-gray-400 flex justify-center items-center text-white">
      멤버쉽 기본혜택
    </div>
    <div class="grid grid-rows-1 grid-cols-[2.5fr,5fr,2.5fr,5fr] h-[10vh]">
      <div
        class="w-full bg-gray-100 flex justify-center items-center border-l border-t border-black">
        일일적용횟수
      </div>
      <div
        class="w-full flex flex-col space-y-2 justify-center items-center border-l border-t border-black">
        <div class="flex">
          <input
            type="text"
            class="border border-black"
            v-model="cond28"
            name="cond28"
            @input="onlyNumber" />
          회(일)
        </div>
      </div>
      <div
        class="w-full bg-gray-100 flex justify-center items-center border-l border-t border-black">
        사이즈변경메뉴
      </div>
      <div class="flex border-l border-t border-black col-span-1">
        <Realgrid
          :progname="'CRM10_001INS_VUE'"
          :progid="2"
          class="w-[70%]"
          :rowStateeditable="false"
          :rowData="rowData7">
        </Realgrid>
        <div>
          <button class="button search" @click="openMenu(4)">조회</button>
        </div>
      </div>
    </div>
  </div>
  <br />
  <br />
  <br />

  <div
    v-if="openPopUp"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <!-- 팝업 컨텐츠 -->
    <div class="bg-white p-6 rounded-2xl shadow-lg w-[30vw] h-[30vh]">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-bold mb-4">매장 선택</h2>

        <div>
          <input
            type="text"
            class="w-full h-10 border border-black"
            @input="searchWord" />
        </div>
        <div class="flex space-x-3">
          <!-- <button
            class="px-4 py-2 bg-blue-500 text-white rounded"
            @click="searchButton2">
            조회
          </button> -->
          <button
            class="px-4 py-2 bg-blue-500 text-white rounded"
            @click="saveButton2">
            저장
          </button>
          <button
            class="px-4 py-2 bg-blue-500 text-white rounded"
            @click="openPopUp = false">
            닫기
          </button>
        </div>
      </div>
      <div class="h-[80%] mt-3">
        <Realgrid
          :progname="'CRM10_001INS_VUE'"
          :progid="4"
          :rowData="srowData"
          :searchColId="'strName'"
          :searchWord3="searchword"
          :rowStateeditable="false"
          :checkRenderEditable="true"
          :checkRowAuto="false"
          :checkRowAuto2="true"
          :checkRowAuto2Col="'checkbox'"
          @updatedRowData="updatedRowData2"
          :setStateBar="false"></Realgrid>
      </div>
    </div>
  </div>

  <div
    v-if="openPopUp2"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <!-- 팝업 컨텐츠 -->
    <div class="bg-white p-6 rounded-2xl shadow-lg w-[60vw] h-[70vh]">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-bold mb-4">메뉴 선택</h2>

        <div class="flex space-x-3">
          <!-- <button
            class="px-4 py-2 bg-blue-500 text-white rounded"
            @click="searchButton2">
            조회
          </button> -->
          <button
            class="px-4 py-2 bg-blue-500 text-white rounded"
            @click="saveButton3">
            저장
          </button>
          <button
            class="px-4 py-2 bg-blue-500 text-white rounded"
            @click="openPopUp2 = false">
            닫기
          </button>
        </div>
      </div>
      <div class="flex flex-col space-y-3">
        <div class="flex space-x-5 items-center ml-3">
          <div class="text-base font-bold">대그룹</div>
          <select
            name=""
            id=""
            class="w-64 border border-black h-8"
            @change="setSubGroup"
            v-model="scond">
            <option value="-1">전체</option>
            <option :value="i.lngCode" v-for="i in optionList">
              {{ i.strName }}
            </option>
          </select>
        </div>
        <div class="flex space-x-5 items-center">
          <div class="text-base font-bold">서브그룹</div>
          <select
            name=""
            id=""
            class="w-64 border border-black h-8"
            @change="setMenu"
            v-model="scond2">
            <option value="-1">전체</option>
            <option :value="i.lngCode" v-for="i in filteredoptionList2">
              {{ i.strName }}
            </option>
          </select>
        </div>

        <div class="flex space-x-5 items-center ml-3">
          <div class="text-base font-bold">메뉴명</div>
          <input
            type="text"
            class="w-64 border border-black h-8"
            @input="setScond3"
            v-model="scond3" />
        </div>
      </div>
      <div class="h-full mt-2">
        <div class="flex h-[75%] space-x-3">
          <Realgrid
            :progname="'CRM10_001INS_VUE'"
            :progid="5"
            :rowData="srowData2"
            :searchColId="'strName'"
            :searchWord3="scond3"
            :searchColId3="['lngMajor', 'lngSubGroup']"
            :searchValue="searchValue"
            :rowStateeditable="false"
            :checkRenderEditable="true"
            :checkRowAuto="false"
            :checkRowAuto2="true"
            :checkRowAuto2Col="'checkbox'"
            @updatedRowData="updatedRowData3"
            :setStateBar="false"></Realgrid>

          <div class="flex space-y-5 flex-col justify-center items-center">
            <button class="whitebutton" @click="sendRight">=></button>
            <button class="whitebutton" @click="sendLeft"><=</button>
          </div>
          <Realgrid
            :progname="'CRM10_001INS_VUE'"
            :progid="5"
            :rowData="srowData3"
            :searchColId="'strName'"
            :searchWord3="searchword"
            :rowStateeditable="false"
            :checkRenderEditable="true"
            :checkRowAuto="false"
            :checkRowAuto2="true"
            :checkRowAuto2Col="'checkbox'"
            @updatedRowData="updatedRowData4"
            :setStateBar="false"></Realgrid>
        </div>
      </div>
    </div>
  </div>

  <div
    v-if="openPopUp3"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <!-- 팝업 컨텐츠 -->
    <div class="bg-white p-6 rounded-2xl shadow-lg w-[30vw] h-[30vh]">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-bold mb-4">쿠폰선택</h2>

        <div class="flex space-x-3">
          <!-- <button
            class="px-4 py-2 bg-blue-500 text-white rounded"
            @click="searchButton2">
            조회
          </button> -->
          <button
            class="px-4 py-2 bg-blue-500 text-white rounded"
            @click="openPopUp3 = false">
            닫기
          </button>
        </div>
      </div>
      <div class="h-[80%] mt-3">
        <Realgrid
          :progname="'CRM10_001INS_VUE'"
          :progid="6"
          :rowData="optionList3"
          :searchColId="'strName'"
          :searchWord3="searchword"
          :rowStateeditable="false"
          @dblclickedRowData="dblclickedRowData"
          :setStateBar="false"></Realgrid>
      </div>
    </div>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import { getMenuGroupList } from "@/api/master";
import {
  getCouponList,
  getCrmMenuList,
  getOperateStoreList,
  getPromotionList,
  saveMemberPromotion,
} from "@/api/micrm";
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

import { formatLocalDate, insertPageLog } from "@/customFunc/customFunc";
import Swal from "sweetalert2";
/**
 *  경고창 호출 라이브러리
 *  */

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

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getMenuGroupList(store.state.userData.lngStoreGroup, 0, 1);

  console.log(res);
  optionList.value = res.data.List;
  optionList2.value = res.data.List2;

  const res2 = await getCouponList(store.state.userData.lngStoreGroup);

  optionList3.value = res2.data.List;

  const today = new Date();
  cond3.value = formatLocalDate(today);
  cond4.value = formatLocalDate(today);
});

const optionList = ref([]);
const optionList2 = ref([]);
const optionList3 = ref([]);
const filteredoptionList2 = ref([]);
const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

const rowData2 = ref([]);
const rowData3 = ref([]);
const rowData4 = ref([]);
const rowData5 = ref([]);
const rowData6 = ref([]);
const rowData7 = ref([]);
const condValue = ref(0);
const store = useStore();
const cond = ref("");
const cond2 = ref("");
const cond3 = ref("");
const cond4 = ref("");
const cond5 = ref("");
const cond6 = ref("");
const cond7 = ref("");
const cond8 = ref("");
const cond9 = ref("");
const cond10 = ref("");
const cond11 = ref("");
const cond12 = ref("");
const cond13 = ref("");
const cond14 = ref("");
const cond15 = ref("");
const cond16 = ref("");
const cond17 = ref("");
const cond18 = ref("");
const cond19 = ref("");
const cond20 = ref(false);
const cond21 = ref("0");
const cond22 = ref("");
const cond23 = ref("");
const cond24 = ref("");
const cond25 = ref("");
const cond26 = ref("");
const cond27 = ref("");
const cond28 = ref("");
const cond111 = ref("");
const cond171 = ref("");
const datepicker = ref(null);
const closePopUp = ref(false);

const changeCond = (e) => {
  cond.value = !cond.value;
};
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
const hideColumnsId = ref([]);
const searchButton = async () => {
  try {
    store.state.loading = true;
    initGrid();

    const res = await getPromotionList(
      store.state.userData.lngStoreGroup,
      0,
      0
    );

    rowData.value = res.data.List;

    console.log(cond6.value);
    ////console.log(res);
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
  if (rowData2.value.length > 0) {
    rowData2.value = [];
  }
  if (rowData3.value.length > 0) {
    rowData3.value = [];
  }
  if (rowData4.value.length > 0) {
    rowData4.value = [];
  }
  if (rowData5.value.length > 0) {
    rowData5.value = [];
  }
  if (rowData6.value.length > 0) {
    rowData6.value = [];
  }
  if (rowData7.value.length > 0) {
    rowData7.value = [];
  }

  cond.value = "";
  cond2.value = "";
  cond3.value = formatLocalDate(new Date());
  cond4.value = formatLocalDate(new Date());
  cond5.value = "";
  cond6.value = "";
  cond7.value = "";
  cond8.value = "";
  cond9.value = "";
  cond10.value = "";
  cond11.value = "";
  cond12.value = "";
  cond13.value = "";
  cond14.value = "";
  cond15.value = "";
  cond16.value = "";
  cond17.value = "";
  cond18.value = "";
  cond19.value = "";
  cond20.value = false;
  cond21.value = "0";
  cond22.value = "";
  cond23.value = "";
  cond24.value = "";
  cond25.value = "";
  cond26.value = "";
  cond27.value = "";
  cond28.value = "";
  cond111.value = "";
  cond171.value = "";
};

const initGrid2 = () => {
  if (rowData2.value.length > 0) {
    rowData2.value = [];
  }
  if (rowData3.value.length > 0) {
    rowData3.value = [];
  }
  if (rowData4.value.length > 0) {
    rowData4.value = [];
  }
  if (rowData5.value.length > 0) {
    rowData5.value = [];
  }
  if (rowData6.value.length > 0) {
    rowData6.value = [];
  }
  if (rowData7.value.length > 0) {
    rowData7.value = [];
  }

  cond.value = "";
  cond2.value = "";
  cond3.value = formatLocalDate(new Date());
  cond4.value = formatLocalDate(new Date());
  cond5.value = "";
  cond6.value = "";
  cond7.value = "";
  cond8.value = "";
  cond9.value = "";
  cond10.value = "";
  cond11.value = "";
  cond12.value = "";
  cond13.value = "";
  cond14.value = "";
  cond15.value = "";
  cond16.value = "";
  cond17.value = "";
  cond18.value = "";
  cond19.value = "";
  cond20.value = false;
  cond21.value = "0";
  cond22.value = "";
  cond23.value = "";
  cond24.value = "";
  cond25.value = "";
  cond26.value = "";
  cond27.value = "";
  cond28.value = "";
  cond111.value = "";
  cond171.value = "";
};

//엑셀 버튼 처리 함수
const exportExcel = ref(false);
/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  documentSubTitle.value = selectedDate.value + "\n" + selectedExcelStore.value;

  //documentSubTitle.value += "\n";
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
const disabled = ref(true);
const disabled2 = ref(false);

const tempPromoCode = ref("");
const buttonClicked = async (e) => {
  console.log(e);
  tempPromoCode.value = e[0];
  currentNew.value = false;
  try {
    const res = await getPromotionList(
      store.state.userData.lngStoreGroup,
      e[0],
      1
    );

    console.log(res);

    if (res.data.List.length > 0) {
      cond.value = res.data.List[0].lngPromoCode;
      cond2.value = res.data.List[0].strPromoName;
      cond3.value = res.data.List[0].dtmStart.split(" ")[0];
      cond4.value = res.data.List[0].dtmEnd.split(" ")[0];
      cond5.value = res.data.List[0].intMembershipDiv;
      cond20.value = res.data.List[0].lngAppDown == "1" ? true : false;

      const encoder = new TextEncoder();
      const decoder = new TextDecoder();

      const byte = encoder.encode(res.data.List[0].strCampaign);

      const slice = byte.slice(0, 42);
      const slice2 = byte.slice(42, 84);
      const slice3 = byte.slice(84, 126);
      const slice4 = byte.slice(126, 168);
      const slice5 = byte.slice(168, 210);
      const slice6 = byte.slice(210, 252);
      const slice7 = byte.slice(252, 294);

      cond6.value = decoder.decode(slice);
      cond7.value = decoder.decode(slice2);
      cond8.value = decoder.decode(slice3);
      cond9.value = decoder.decode(slice4);
      cond10.value = decoder.decode(slice5);
      cond11.value = decoder.decode(slice6);
      cond111.value = decoder.decode(slice7);

      const byte2 = encoder.encode(res.data.List[0].strRemark);

      const slice21 = byte2.slice(0, 42);
      const slice22 = byte2.slice(42, 84);
      const slice32 = byte2.slice(84, 126);
      const slice42 = byte2.slice(126, 168);
      const slice52 = byte2.slice(168, 210);
      const slice62 = byte2.slice(210, 252);
      const slice72 = byte2.slice(252, 294);

      cond12.value = decoder.decode(slice21);
      cond13.value = decoder.decode(slice22);
      cond14.value = decoder.decode(slice32);
      cond15.value = decoder.decode(slice42);
      cond16.value = decoder.decode(slice52);
      cond17.value = decoder.decode(slice62);
      cond171.value = decoder.decode(slice72);
    }

    if (res.data.List4.length > 0) {
      cond18.value = res.data.List4[0].strParam1;
      cond19.value = res.data.List4[0].strParam2;
    }

    if (res.data.List8.length > 0) {
      cond22.value = res.data.List8[0].strParam1;
      cond23.value = res.data.List8[0].strCouponName;
    }

    if (res.data.List13.length > 0) {
      cond24.value = res.data.List13[0].strParam1;
      cond25.value = res.data.List13[0].strCouponName;
    }

    if (res.data.List7.length > 0) {
      cond28.value = res.data.List7[0].strParam1;
    }

    rowData2.value = res.data.List3;
    rowData3.value = res.data.List5;
    rowData4.value = res.data.List6;
    rowData5.value = res.data.List2;
    rowData6.value = res.data.List9;
    rowData7.value = res.data.List10;

    cond26.value = res.data.List11[0].strParam1;
    cond27.value = res.data.List11[0].strParam2;
  } catch (error) {
    console.log(error);
  }
};

watch(cond21, () => {
  if (cond21.value == "0") {
    disabled.value = true;
    disabled2.value = false;
  } else if (cond21.value == "1") {
    disabled.value = true;
    disabled2.value = true;
  } else {
    disabled.value = false;
    disabled2.value = true;
  }
});

const openPopUp = ref(false);
const openPopUp2 = ref(false);
const openStore = (e) => {
  openPopUp.value = true;
  searchButton2(e);
};
const openMenu = (e) => {
  openPopUp2.value = true;
  srowData3.value = [];
  tempCheckedList2.value = [];
  tempCheckedList.value = [];
  searchButton3(e);
};

const srowData = ref([]);
const selectedStore = ref(false);
const selectedMenu = ref(1);
const searchButton2 = async (e) => {
  if (e == "1") {
    selectedStore.value = false;
  } else {
    selectedStore.value = true;
  }
  try {
    updatedrowdata.value = [];
    const res = await getOperateStoreList(
      store.state.userData.lngStoreGroup,
      0,
      0
    );

    console.log(res);
    srowData.value = res.data.List;
  } catch (error) {}
};

const srowData2 = ref([]);
const srowData3 = ref([]);
const searchButton3 = async (e) => {
  selectedMenu.value = e;
  try {
    updatedrowdata2.value = [];
    const res = await getCrmMenuList(store.state.userData.lngStoreGroup, 0);

    console.log(res);
    srowData2.value = res.data.List;
  } catch (error) {}
};

const searchword = ref("");
const searchWord = (e) => {
  searchword.value = e.target.value;
};

const saveButton2 = () => {
  console.log(updatedrowdata.value);
  if (selectedStore.value == false) {
    rowData2.value = updatedrowdata.value;
  } else {
    rowData6.value = updatedrowdata.value;
  }

  openPopUp.value = false;
};

const updatedrowdata = ref([]);
const updatedrowdata2 = ref([]);
const updatedRowData2 = (e) => {
  console.log(e);
  updatedrowdata.value = e;
};

const scond = ref("-1");
const scond2 = ref("-1");
const scond3 = ref("");
const setSubGroup = (e) => {
  const value = e.target.value;
  filteredoptionList2.value = optionList2.value.filter(
    (item) => item.lngMajor == value
  );
  scond2.value = "-1";

  scond.value = value;
  searchValue.value = [value, scond2.value];

  //console.log(searchValue.value);
};

const setMenu = (e) => {
  searchValue.value = [scond.value, e.target.value];

  //console.log(searchValue.value);
};

const searchValue = ref(["-1", "-1"]);

const setScond3 = (e) => {
  scond3.value = e.target.value;
};

const tempCheckedList = ref([]);
const tempCheckedList2 = ref([]);
const updatedRowData3 = (e) => {
  tempCheckedList.value = e.filter((item) => item.checkbox == true);
};

const updatedRowData4 = (e) => {
  console.log(e);
  tempCheckedList2.value = e;
};

const sendLeft = () => {
  // srowData3.value = srowData3.value.filter(item => item.checkbox)

  srowData3.value = tempCheckedList2.value.filter(
    (item) => item.checkbox == false
  );
};
const sendRight = () => {
  console.log(tempCheckedList.value);
  srowData3.value = tempCheckedList.value.map((item) => ({
    ...item,
    checkbox: false,
  }));
  tempCheckedList2.value = tempCheckedList.value.map((item) => ({
    ...item,
    checkbox: false,
  }));
};

const saveButton3 = () => {
  console.log(tempCheckedList2.value);
  if (selectedMenu.value == "1") {
    rowData3.value = tempCheckedList2.value;
  } else if (selectedMenu.value == "2") {
    rowData4.value = tempCheckedList2.value;
  } else if (selectedMenu.value == "3") {
    rowData5.value = tempCheckedList2.value;
  } else if (selectedMenu.value == "4") {
    rowData7.value = tempCheckedList2.value;
  }

  openPopUp2.value = false;
};

const setCouponMain = ref(1);

const openPopUp3 = ref(false);
const searchButton4 = (e) => {
  setCouponMain.value = e;

  openPopUp3.value = true;
};

const dblclickedRowData = (e) => {
  // console.log(e);
  if (setCouponMain.value == "1") {
    cond22.value = e[0];
    cond23.value = e[1];
  } else {
    cond24.value = e[0];
    cond25.value = e[1];
  }
  openPopUp3.value = false;
};

const currentNew = ref(false);
const addButton = () => {
  currentNew.value = true;
  initGrid2();
};

const saveButton = async () => {
  console.log(
    rowData2.value,
    rowData3.value,
    rowData4.value,
    rowData5.value,
    rowData6.value
  );
  try {
    let bytelen = getByteLength(cond6.value);
    while (bytelen < 42) {
      cond6.value += " ";
      bytelen = getByteLength(cond6.value);
    }

    let bytelen2 = getByteLength(cond7.value);
    while (bytelen2 < 42) {
      cond7.value += " ";
      bytelen2 = getByteLength(cond7.value);
    }

    let bytelen3 = getByteLength(cond8.value);
    while (bytelen3 < 42) {
      cond8.value += " ";
      bytelen3 = getByteLength(cond8.value);
    }

    let bytelen4 = getByteLength(cond9.value);
    while (bytelen4 < 42) {
      cond9.value += " ";
      bytelen4 = getByteLength(cond9.value);
    }

    let bytelen5 = getByteLength(cond10.value);
    while (bytelen5 < 42) {
      cond10.value += " ";
      bytelen5 = getByteLength(cond10.value);
    }

    let bytelen6 = getByteLength(cond11.value);
    while (bytelen6 < 42) {
      cond11.value += " ";
      bytelen6 = getByteLength(cond11.value);
    }

    let bytelen7 = getByteLength(cond111.value);
    while (bytelen7 < 42) {
      cond111.value += " ";
      bytelen7 = getByteLength(cond111.value);
    }

    let bytelen8 = getByteLength(cond12.value);
    while (bytelen8 < 42) {
      cond12.value += " ";
      bytelen8 = getByteLength(cond12.value);
    }

    let bytelen9 = getByteLength(cond13.value);
    while (bytelen9 < 42) {
      cond13.value += " ";
      bytelen9 = getByteLength(cond13.value);
    }

    let bytelen10 = getByteLength(cond14.value);
    while (bytelen10 < 42) {
      cond14.value += " ";
      bytelen10 = getByteLength(cond14.value);
    }

    let bytelen11 = getByteLength(cond15.value);
    while (bytelen11 < 42) {
      cond15.value += " ";
      bytelen11 = getByteLength(cond15.value);
    }

    let bytelen12 = getByteLength(cond16.value);
    while (bytelen12 < 42) {
      cond16.value += " ";
      bytelen12 = getByteLength(cond16.value);
    }

    let bytelen13 = getByteLength(cond17.value);
    while (bytelen13 < 42) {
      cond17.value += " ";
      bytelen13 = getByteLength(cond17.value);
    }

    let bytelen14 = getByteLength(cond171.value);
    while (bytelen14 < 42) {
      cond171.value += " ";
      bytelen14 = getByteLength(cond171.value);
    }
    const res = await saveMemberPromotion(
      store.state.userData.lngStoreGroup,
      store.state.userData.lngPosition,
      store.state.userData.lngSequence,
      currentNew.value == true ? 0 : tempPromoCode.value,
      cond2.value,
      cond3.value.replaceAll("-", ""),
      cond4.value.replaceAll("-", ""),
      cond5.value,
      cond6.value +
        cond7.value +
        cond8.value +
        cond9.value +
        cond10.value +
        cond11.value +
        cond111.value,
      cond12.value +
        cond13.value +
        cond14.value +
        cond15.value +
        cond16.value +
        cond17.value +
        cond171.value,
      1,
      rowData2.value
        .map((item) => item.lngStoreGroup + "+" + item.lngStoreCode)
        .join("|"),
      cond19.value,
      rowData4.value
        .map(
          (item) =>
            item.lngStoreGroup + "+" + item.lngStoreCode + "+" + item.lngCode
        )
        .join("|"),
      cond18.value,
      rowData3.value
        .map(
          (item) =>
            item.lngStoreGroup + "+" + item.lngStoreCode + "+" + item.lngCode
        )
        .join("|"),
      cond22.value,
      cond24.value,
      rowData6.value
        .map(
          (item) =>
            item.lngStoreGroup +
            "+" +
            item.lngStoreCode +
            "+" +
            item.lngStoreCode
        )
        .join("|"),
      cond26.value,
      cond27.value,
      cond28.value,
      rowData7.value
        .map(
          (item) =>
            item.lngStoreGroup + "+" + item.lngStoreCode + "+" + item.lngCode
        )
        .join("|"),
      rowData5.value
        .map(
          (item) =>
            item.lngStoreGroup + "+" + item.lngStoreCode + "+" + item.lngCode
        )
        .join("|"),
      cond20.value == false ? "0" : "1"
    );

    if (res.data.RESULT_CD == "00") {
      await Swal.fire({
        title: "성공",
        text: "멤버 프로모션이 등록되었습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
    } else {
      await Swal.fire({
        title: "실패",
        text: `멤버 프로모션 등록이 실패되었습니다.`,
        icon: "warning",
        confirmButtonText: "확인",
      });
    }
  } catch (error) {}
};

const currentbyteleng = ref("0");
const currentbyteleng2 = ref("0");
const set42byte = (e) => {
  let value = e.target.value;
  let bytelen = getByteLength(value);

  while (bytelen > 42) {
    value = value.slice(0, -1);
    bytelen = getByteLength(value);
  }
  currentbyteleng.value = bytelen;
  if (e.target.name == "cond6") {
    cond6.value = value;
  } else if (e.target.name == "cond7") {
    cond7.value = value;
  } else if (e.target.name == "cond8") {
    cond8.value = value;
  } else if (e.target.name == "cond9") {
    cond9.value = value;
  } else if (e.target.name == "cond10") {
    cond10.value = value;
  } else if (e.target.name == "cond11") {
    cond11.value = value;
  } else if (e.target.name == "cond111") {
    cond111.value = value;
  }
  // e.target.value = value;
};

const set42byte2 = (e) => {
  let value = e.target.value;
  let bytelen = getByteLength(value);

  while (bytelen > 42) {
    value = value.slice(0, -1);
    bytelen = getByteLength(value);
  }
  currentbyteleng2.value = bytelen;
  if (e.target.name == "cond12") {
    cond12.value = value;
  } else if (e.target.name == "cond13") {
    cond13.value = value;
  } else if (e.target.name == "cond14") {
    cond14.value = value;
  } else if (e.target.name == "cond15") {
    cond15.value = value;
  } else if (e.target.name == "cond16") {
    cond16.value = value;
  } else if (e.target.name == "cond17") {
    cond17.value = value;
  } else if (e.target.name == "cond171") {
    cond171.value = value;
  }
  // e.target.value = value;
};
function getByteLength(str) {
  let byte = 0;
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    if (code <= 0x007f) byte += 1; // 영문, 숫자, 특수문자
    else if (code <= 0x07ff) byte += 2; // 일부 확장
    else byte += 3; // 한글, 한자 등
  }
  return byte;
}

const onlyNumber = (e) => {
  const value = e.target.value.replace(/[^0-9]/g, "");

  if (e.target.name == "cond18") {
    cond18.value = value;
  } else if (e.target.name == "cond19") {
    cond19.value = value;
  } else if (e.target.name == "cond26") {
    cond26.value = value;
  } else if (e.target.name == "cond27") {
    cond27.value = value;
  } else if (e.target.name == "cond28") {
    cond28.value = value;
  }
};
</script>
