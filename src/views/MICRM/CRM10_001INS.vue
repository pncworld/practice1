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
        :rowStateeditable="false">
      </Realgrid>
    </div>
    <div class="grid grid-rows-[1fr,1fr,5fr] grid-cols-[1fr,2fr,1fr,2fr] mt-1">
      <div
        class="border-l border-t border-black flex justify-center items-center bg-gray-100">
        프로모션코드/명
      </div>
      <div class="flex border-l border-t border-black space-x-2">
        <input type="text" class="border border-black w-[15%]" />
        <input type="text" class="border border-black w-[60%]" />
      </div>
      <div
        class="border-l border-t border-black flex justify-center items-center bg-gray-100">
        프로모션 기간
      </div>
      <div class="border-l border-t border-black">
        <input type="date" class="border border-black" /> ~
        <input type="date" class="border border-black" />
      </div>
      <div
        class="border-l border-t border-black flex justify-center items-center bg-gray-100">
        멤버구분
      </div>
      <div class="col-span-3 border-l border-t border-black space-x-2">
        <label for="mem"
          ><input type="radio" name="member" id="mem" />일반고객</label
        >
        <label for="mem2"
          ><input type="radio" name="member" id="mem2" />멤버쉽</label
        >
      </div>
      <div
        class="border-l border-t border-black flex justify-center items-center border-b bg-gray-100">
        행사정책
      </div>
      <div class="border-l border-t border-black flex border-b">
        <div class="grid grid-rows-6 grid-cols-1 w-[50%]">
          <input type="text" class="border border-black" />
          <input type="text" class="border border-black" />
          <input type="text" class="border border-black" />
          <input type="text" class="border border-black" />
          <input type="text" class="border border-black" />
          <input type="text" class="border border-black" />
        </div>
        <div class="space-y-16">
          <div class="text-red-500 font-semibold">(0)byte</div>
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
          <input type="text" class="border border-black" />
          <input type="text" class="border border-black" />
          <input type="text" class="border border-black" />
          <input type="text" class="border border-black" />
          <input type="text" class="border border-black" />
          <input type="text" class="border border-black" />
        </div>
        <div class="space-y-16">
          <div class="text-red-500 font-semibold">(0)byte</div>
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
        <Realgrid :progname="'CRM10_001INS_VUE'" :progid="3" class="w-[30%]">
        </Realgrid>
        <div><button class="button search">조회</button></div>
      </div>
      <div
        class="bg-gray-100 flex justify-center items-center border-l border-t border-black">
        필수잔수갯수
      </div>
      <div class="flex border-l border-t border-black space-x-5">
        <div class="font-semibold">일반 :</div>
        <div class="w-[20%] h-full">
          <input type="text" class="border w-full" />
        </div>
        <div class="font-semibold">필수 :</div>
        <div class="w-[20%]"><input type="text" class="border w-full" /></div>
      </div>

      <div
        class="bg-gray-100 flex justify-center items-center border-l border-t border-black">
        APP DOWN 프로모션
      </div>
      <div class="flex border-l border-t border-black space-x-5">
        <label for="set"><input type="checkbox" id="set" />적용</label>
      </div>

      <div
        class="bg-gray-100 flex justify-center items-center border-l border-t border-black">
        일반 잔수 메뉴
      </div>
      <div class="flex border-l border-t border-black">
        <Realgrid :progname="'CRM10_001INS_VUE'" :progid="2" class="w-[70%]">
        </Realgrid>
        <div><button class="button search">조회</button></div>
      </div>

      <div
        class="bg-gray-100 flex justify-center items-center border-l border-t border-black">
        필수 잔수 메뉴
      </div>
      <div class="flex border-l border-t border-black">
        <Realgrid :progname="'CRM10_001INS_VUE'" :progid="2" class="w-[70%]">
        </Realgrid>
        <div><button class="button search">조회</button></div>
      </div>

      <div
        class="bg-gray-100 flex justify-center items-center border-l border-t border-black">
        텀블러 메뉴
      </div>
      <div class="flex border-l border-t border-black col-span-1">
        <Realgrid :progname="'CRM10_001INS_VUE'" :progid="2" class="w-[70%]">
        </Realgrid>
        <div><button class="button search">조회</button></div>
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
          ><input type="radio" name="cond" id="cond1" />멤버쉽 쿠폰
        </label>
        <label for="cond2"
          ><input type="radio" name="cond" id="cond2" />프로모션 참여권
        </label>
        <label for="cond3"
          ><input type="radio" name="cond" id="cond3" />프로모션 포인트 부여
        </label>
      </div>
      <div
        class="w-full bg-gray-100 flex justify-center items-center border-l border-t border-black">
        사용쿠폰/서브쿠폰
      </div>
      <div
        class="w-full flex flex-col space-y-2 justify-center items-center border-l border-t border-black">
        <div class="flex justify-center">
          <input type="text" class="w-[10%] border border-black" />
          <input type="text" class="w-[40%] border border-black" />
          <button class="button search">조회</button>
        </div>
        <div class="flex justify-center">
          <input type="text" class="w-[10%] border border-black" />
          <input type="text" class="w-[40%] border border-black" />
          <button class="button search">조회</button>
        </div>
      </div>
      <div
        class="w-full bg-gray-100 flex justify-center items-center border-l border-t border-black">
        혜택적용매장
      </div>
      <div class="flex border-l border-t border-black col-span-1">
        <Realgrid :progname="'CRM10_001INS_VUE'" :progid="3" class="w-[70%]">
        </Realgrid>
        <div><button class="button search">조회</button></div>
      </div>
      <div
        class="w-full bg-gray-100 flex justify-center items-center border-l border-t border-black">
        혜택포인트
      </div>
      <div class="flex border-l border-t border-black space-x-5">
        <input type="text" class="border border-black" />
        <span class="font-semibold">Point</span>
      </div>
      <div
        class="w-full bg-gray-100 flex justify-center items-center border-l border-t border-black">
        혜택유효기간
      </div>
      <div class="flex border-l border-t border-black space-x-5">
        <input type="text" class="border border-black" />
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
          <input type="text" class="border border-black" /> 회(일)
        </div>
      </div>
      <div
        class="w-full bg-gray-100 flex justify-center items-center border-l border-t border-black">
        사이즈변경메뉴
      </div>
      <div class="flex border-l border-t border-black col-span-1">
        <Realgrid :progname="'CRM10_001INS_VUE'" :progid="2" class="w-[70%]">
        </Realgrid>
        <div><button class="button search">조회</button></div>
      </div>
    </div>
  </div>
  <br />
  <br />
  <br />
  <!-- 그리드 영역 -->
</template>

<script setup>
import { getPromotionList, getReceiptEventList } from "@/api/micrm";
import Datepicker2 from "@/components/Datepicker2.vue";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
import PickStoreSingle from "@/components/pickStoreSingle.vue";
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
});

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

const rowData2 = ref([]);
const rowData3 = ref([]);
const rowData4 = ref([]);
const condValue = ref(0);
const store = useStore();
const cond = ref(true);
const cond2 = ref("");
const cond3 = ref("");
const cond4 = ref(1);
const cond5 = ref(0);
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

const sDate = ref();
const eDate = ref();
const startDate = (e) => {
  sDate.value = e;
};
const endDate = (e) => {
  eDate.value = e;
};

const selectedDate = ref();
const excelDate = (e) => {
  selectedDate.value = e;
};

const teamcode = ref();
const lngTeamCode = (e) => {
  teamcode.value = e;
};
const supervisor = ref();
const lngSupervisor = (e) => {
  supervisor.value = e;
};
const storeCode = ref();
const lngStoreCode = (e) => {
  storeCode.value = e;
};

const storeAttr = ref();
const lngStoreAttrs = (e) => {
  storeAttr.value = e;
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
    //console.log(res);
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
</script>
