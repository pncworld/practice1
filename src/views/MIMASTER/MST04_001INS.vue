<!-- /*--############################################################################
# Filename : MST04_001INS.vue                                                  
# Description : 마스터관리 > 자재 마스터 > 자재 마스터 등록          
# Date :2025-08-19                                                            
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <!-- 조회 조건 -->
  <div class="h-full" @click="handleParentClick">
    <div class="flex justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center mr-9 space-x-2 pr-5">
        <button @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <button @click="addButton" class="button save w-auto excel">
          신규
        </button>
        <button @click="deleteButton" class="button save w-auto excel">
          삭제
        </button>
        <button @click="excelButton" class="button save w-auto excel">
          엑셀
        </button>
      </div>
    </div>
    <div
      class="grid grid-cols-3 grid-rows-3 justify-between bg-gray-200 rounded-lg h-32 items-start z-10">
      <div class="flex ml-12 mt-2 items-center">
        <div class="font-semibold text-base">자재코드</div>
        <input
          type="text"
          class="ml-5 h-7 border border-black"
          v-model="cond" />
      </div>
      <div class="flex ml-24 mt-2 items-center">
        <div class="font-semibold text-base">자재명</div>
        <input
          type="text"
          class="ml-5 h-7 border border-black"
          v-model="cond2" />
      </div>
      <div></div>
      <div
        class="flex justify-start items-center text-base text-nowrap font-semibold ml-12 space-x-5">
        자재그룹
        <div class="flex space-x-5 ml-5">
          <select name="" id="" class="w-48 h-8" v-model="cond3">
            <option value="0">선택</option>
            <option :value="i.lngStockGroupID" v-for="i in optionList">
              {{ i.strStockGroupName }}
            </option>
          </select>
        </div>
      </div>
      <div class="flex items-center justify-start text-base font-bold ml-20">
        <div>자재분류</div>
        <select name="" id="" class="w-48 h-8 ml-5" v-model="cond4">
          <option value="0">선택</option>
          <option :value="i.lngCategoryID" v-for="i in optionList2">
            {{ i.strCategoryName }}
          </option>
        </select>
      </div>
      <div class="flex items-center justify-start text-base font-bold ml-24">
        <div>자재특성</div>
        <select name="" id="" class="w-48 h-8 ml-5" v-model="cond5">
          <option value="0">선택</option>
          <option :value="i.lngGenericID" v-for="i in optionList3">
            {{ i.strGenericName }}
          </option>
        </select>
      </div>

      <div class="flex items-center justify-start text-base font-bold ml-16">
        <div>거래처</div>
        <select name="" id="" class="w-48 h-8 ml-5" v-model="cond6">
          <option value="0">선택</option>
          <option :value="i.lngSupplierID" v-for="i in optionList4">
            {{ i.strSupplierName }}
          </option>
        </select>
      </div>

      <div class="flex items-center justify-start text-base font-bold ml-16">
        <div>구분(주/부)</div>
        <select name="" id="" class="w-48 h-8 ml-5" v-model="cond7">
          <option value="0">선택</option>
          <option :value="i.strDCode" v-for="i in optionList5">
            {{ i.strDName }}
          </option>
        </select>
      </div>

      <div class="flex items-center justify-start text-base font-bold ml-16">
        <div>과세면세구분</div>
        <select name="" id="" class="w-48 h-8 ml-5" v-model="cond8">
          <option :value="''">선택</option>
          <option :value="i.strDCode" v-for="i in optionList6">
            {{ i.strDName }}
          </option>
        </select>
      </div>
    </div>
    <!-- 조회 조건 -->
    <!--그리드 영역 -->
    <div class="w-[100%] h-[70vh] grid-rows-2 grid-cols-1">
      <Realgrid
        :progname="'MST04_001INS_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :setGroupCustomLevel="2"
        :mergeColumns2="true"
        :mergeColumnGroupName2="[['단위'], ['단가']]"
        :mergeColumnGroupSubList2="[
          [
            'strOrderNCheck',
            'strDemandUOM',
            'strReturnNMoveUOM',
            'strRealNreportUOM',
            'strUseNLossUOM',
          ],
          ['curUnitPrice', 'curSalesUnitPrice'],
        ]"
        :documentTitle="'MST04_001INS'"
        :documentSubTitle="documentSubTitle"
        :exporttoExcel="exportExcel"
        :rowStateeditable="false">
      </Realgrid>
    </div>
  </div>

  <div v-if="addRow" class="fixed top-64 right-96 w-[30vw] h-[50vh]">
    <div class="bg-white border border-black w-full h-full">
      <div class="flex justify-end space-x-2">
        <div><button class="whitebutton">신규</button></div>
        <div><button class="whitebutton">저장</button></div>
        <div><button class="whitebutton">닫기</button></div>
      </div>
      <div class="grid grid-rows-4 grid-cols-[1fr,2fr,1fr,2fr]">
        <div
          class="border-l border-t border-black bg-gray-100 justify-center items-center text-center">
          자재코드
        </div>
        <div
          class="border-l border-t border-black flex justify-start items-center pl-1">
          <input type="text" class="h-[80%] w-[80%] border-black border" />
        </div>
        <div
          class="border-l border-t border-black bg-gray-100 justify-center items-center text-center">
          자재명
        </div>
        <div
          class="border-l border-t border-black flex justify-start items-center pl-1">
          <input type="text" class="h-[80%] w-[80%] border-black border" />
        </div>
        <div
          class="border-l border-t border-black bg-gray-100 justify-center items-center text-center">
          자재그룹
        </div>
        <div
          class="border-l border-t border-black flex justify-start pl-1 items-center">
          <select
            name=""
            id=""
            class="w-[70%] h-[80%] border border-black"
            v-model="scond">
            <option value="0">선택</option>
            <option :value="i.lngStockGroupID" v-for="i in optionList">
              {{ i.strStockGroupName }}
            </option>
          </select>
          <button class="whitebutton !h-[80%]" @click="addRow2 = true">
            +
          </button>
        </div>
        <div
          class="border-l border-t border-black bg-gray-100 justify-center items-center text-center">
          자재분류
        </div>
        <div
          class="border-l border-t border-black flex justify-start pl-1 items-center">
          <select
            name=""
            id=""
            class="w-[70%] h-[80%] border border-black"
            v-model="scond2">
            <option value="0">선택</option>
            <option :value="i.lngCategoryID" v-for="i in optionList2">
              {{ i.strCategoryName }}
            </option>
          </select>
          <button class="whitebutton !h-[80%]" @click="addRow3 = true">
            +
          </button>
        </div>
        <div
          class="border-l border-t border-black bg-gray-100 justify-center items-center text-center">
          자재특성
        </div>
        <div
          class="border-l border-t border-black flex justify-start pl-1 items-center">
          <select
            name=""
            id=""
            class="w-[70%] h-[80%] border border-black"
            v-model="scond3">
            <option value="0">선택</option>
            <option :value="i.lngGenericID" v-for="i in optionList3">
              {{ i.strGenericName }}
            </option>
          </select>
          <button class="whitebutton !h-[80%]">+</button>
        </div>
        <div
          class="border-l border-t border-black bg-gray-100 justify-center items-center text-center">
          실사주기
        </div>
        <div
          class="border-l border-t border-black flex justify-start pl-1 items-center">
          <select
            name=""
            id=""
            class="w-[70%] h-[80%] border border-black"
            v-model="scond4">
            <option value="0">선택</option>
            <option :value="i.strDCode" v-for="i in optionList7">
              {{ i.strDName }}
            </option>
          </select>
        </div>
        <div
          class="border-l border-t border-b border-black bg-gray-100 justify-center items-center text-center">
          과세면세구분
        </div>
        <div
          class="border-l border-t border-b border-black flex justify-start pl-1 items-center">
          <select
            name=""
            id=""
            class="w-[70%] h-[80%] border border-black"
            v-model="scond5">
            <option value="0">선택</option>
            <option :value="i.strDCode" v-for="i in optionList6">
              {{ i.strDName }}
            </option>
          </select>
        </div>
        <div
          class="border-l border-t border-b border-black bg-gray-100 justify-center items-center text-center">
          의제매입
        </div>
        <div
          class="border-l border-t border-b border-black flex justify-start pl-1 items-center">
          <select
            name=""
            id=""
            class="w-[70%] h-[80%] border border-black"
            v-model="scond6">
            <option value="0">선택</option>
            <option :value="i.strDCode" v-for="i in optionList8">
              {{ i.strDName }}
            </option>
          </select>
        </div>
      </div>
      <div class="flex text-red-500">
        ex : 1ea 에 100g 자재를 1box 매입하여 1ea 단위로 출고. 1box에 12ea가
        들어있음. <br />
        발주매입:1box , 청구:12ea , 반품/이동:12ea , 실사/재고:1200g , 사용/손실
        : 1200g
      </div>

      <div class="grid grid-rows-6 grid-cols-[1fr,2fr]">
        <div
          class="border-l border-t border-black bg-gray-100 justify-center items-center text-center">
          규격
        </div>
        <div
          class="border-l border-t border-black flex justify-start pl-1 items-center">
          <select
            name=""
            id=""
            class="w-[70%] h-[80%] border border-black"
            v-model="sscond">
            <option value="0">선택</option>
            <option :value="i.lngStandardID" v-for="i in optionList9">
              {{ i.strStandardName }}
            </option>
          </select>
          <button class="whitebutton !h-[80%]">+</button>
        </div>
        <div
          class="border-l border-t border-black bg-gray-100 justify-center items-center text-center">
          발주매입단위
        </div>
        <div
          class="border-l border-t border-black flex justify-start pl-1 items-center">
          <select
            name=""
            id=""
            class="w-[40%] h-[80%] border border-black"
            v-model="sscond2">
            <option value="0">선택</option>
            <option :value="i.lngUnitID" v-for="i in optionList10">
              {{ i.strUnitName }}
            </option>
          </select>
          <input
            type="text"
            class="h-[80%] w-[29%] border border-black ml-1"
            v-model="sscond3" />
        </div>
        <div
          class="border-l border-t border-black bg-gray-100 justify-center items-center text-center">
          청구단위
        </div>
        <div
          class="border-l border-t border-black flex justify-start pl-1 items-center">
          <select
            name=""
            id=""
            class="w-[40%] h-[80%] border border-black"
            v-model="sscond4">
            <option value="0">선택</option>
            <option :value="i.lngUnitID" v-for="i in optionList10">
              {{ i.strUnitName }}
            </option>
          </select>
          <input
            type="text"
            class="h-[80%] w-[29%] border border-black ml-1"
            v-model="sscond5" />
        </div>
        <div
          class="border-l border-t border-black bg-gray-100 justify-center items-center text-center">
          반품/이동단위
        </div>
        <div
          class="border-l border-t border-black flex justify-start pl-1 items-center">
          <select
            name=""
            id=""
            class="w-[40%] h-[80%] border border-black"
            v-model="sscond6">
            <option value="0">선택</option>
            <option :value="i.lngUnitID" v-for="i in optionList10">
              {{ i.strUnitName }}
            </option>
          </select>
          <input
            type="text"
            class="h-[80%] w-[29%] border border-black ml-1"
            v-model="sscond7" />
        </div>
        <div
          class="border-l border-t border-black bg-gray-100 justify-center items-center text-center">
          실사/재고단위
        </div>
        <div
          class="border-l border-t border-black flex justify-start pl-1 items-center">
          <select
            name=""
            id=""
            class="w-[40%] h-[80%] border border-black"
            v-model="sscond8">
            <option value="0">선택</option>
            <option :value="i.lngUnitID" v-for="i in optionList10">
              {{ i.strUnitName }}
            </option>
          </select>
          <input
            type="text"
            class="h-[80%] w-[29%] border border-black ml-1"
            v-model="sscond9" />
        </div>
        <div
          class="border-l border-t border-b border-black bg-gray-100 justify-center items-center text-center">
          사용/손실단위
        </div>
        <div
          class="border-l border-t border-b border-black flex justify-start pl-1 items-center">
          <select
            name=""
            id=""
            class="w-[40%] h-[80%] border border-black disabled:bg-gray-300"
            disabled
            v-model="sscond8">
            <option value="0">선택</option>
            <option :value="i.lngUnitID" v-for="i in optionList10">
              {{ i.strUnitName }}
            </option>
          </select>
          <input
            type="text"
            disabled
            class="h-[80%] w-[29%] border border-b border-black ml-1 disabled:bg-gray-300"
            v-model="sscond9" />
        </div>
      </div>
      <div class="flex text-red-500">
        ※매입단가 : 발주/매입 단위 금액, 판매단가 : 반품/이동 단위 금액.
      </div>

      <div class="grid grid-rows-5 grid-cols-[3fr,4fr,3fr,4fr]">
        <div
          class="border-l border-t border-black bg-gray-100 justify-center items-center text-center">
          주거래처
        </div>
        <div
          class="border-l border-t border-black flex justify-start pl-1 items-center col-span-3">
          <select
            name=""
            id=""
            class="w-[70%] h-[80%] border border-black"
            v-model="ssscond">
            <option value="0">선택</option>
            <option :value="i.lngSupplierID" v-for="i in optionList4">
              {{ i.strSupplierName }}
            </option>
          </select>
        </div>
        <div
          class="border-l border-t border-black bg-gray-100 justify-center items-center text-center">
          부가세 구분
        </div>
        <div
          class="border-l border-t border-black flex justify-start pl-1 items-center col-span-3">
          <label for="ssscond2"
            ><input
              type="checkbox"
              id="ssscond2"
              v-model="ssscond2" />포함</label
          >
        </div>
        <div
          class="border-l border-t border-black bg-gray-100 justify-center items-center text-center">
          매입단가
        </div>
        <div
          class="border-l border-t border-black flex justify-start pl-1 items-center">
          <input
            type="number"
            class="h-[80%] w-[29%] border border-black"
            v-model="ssscond3" />
        </div>
        <div
          class="border-l border-t border-black bg-gray-100 justify-center items-center text-center">
          판매단가
        </div>
        <div
          class="border-l border-t border-black flex justify-start pl-1 items-center">
          <input
            type="number"
            class="h-[80%] w-[29%] border border-black"
            v-model="ssscond4" />
        </div>
        <div
          class="border-l border-t border-black bg-gray-100 justify-center items-center text-center">
          매입단가(VAT포함)
        </div>
        <div
          class="border-l border-t border-black flex justify-start pl-1 items-center">
          <input
            type="text"
            disabled
            class="h-[80%] w-[29%] border border-black disabled:bg-gray-300"
            v-model="ssscond5" />
        </div>
        <div
          class="border-l border-t border-b border-black bg-gray-100 justify-center items-center text-center">
          판매단가(VAT포함)
        </div>
        <div
          class="border-l border-t border-b border-black flex justify-start pl-1 items-center">
          <input
            type="text"
            disabled
            class="h-[80%] w-[29%] border border-black disabled:bg-gray-300"
            v-model="ssscond6" />
        </div>

        <div
          class="border-l border-t border-b border-black bg-gray-100 justify-center items-center text-center">
          바코드
        </div>
        <div
          class="border-l border-t border-b border-black flex justify-start pl-1 items-center">
          <input
            type="text"
            class="h-[80%] w-[29%] border border-black disabled:bg-gray-300"
            v-model="ssscond7" />
        </div>
        <div
          class="border-l border-t border-b border-black bg-gray-100 justify-center items-center text-center">
          사용여부
        </div>
        <div
          class="border-l border-t border-b border-black flex justify-start pl-1 items-center">
          <select
            name=""
            id=""
            class="w-[29%] h-[80%] border border-black"
            v-model="ssscond8">
            <option value="0">Y</option>
            <option value="1">N</option>
          </select>
        </div>
      </div>
    </div>
  </div>

  <div v-if="addRow2" class="fixed top-64 right-12 w-[16vw] h-[50vh]">
    <div class="bg-white border border-black w-full h-full">
      <div class="flex justify-end space-x-2">
        <div><button class="whitebutton">신규</button></div>
        <div><button class="whitebutton">저장</button></div>
        <div><button class="whitebutton">삭제</button></div>
        <div><button class="whitebutton">닫기</button></div>
      </div>
      <div class="grid grid-rows-2 grid-cols-2 w-[60%]">
        <div class="border-l border-t border-black">자재그룹코드</div>
        <div class="border-l border-t border-black pl-1">
          <input type="number" class="border border-black" />
        </div>

        <div class="border-l border-t border-black">자재그룹명</div>
        <div class="border-l border-t border-black pl-1">
          <input type="text" class="border border-black" />
        </div>
      </div>
    </div>
  </div>
  <!--그리드 영역 -->
</template>

<script setup>
import { getCommonList } from "@/api/common";
import {
  getStandardList,
  getStockCategory,
  getStockGeneric,
  getStockGroup,
  getStockItemList,
  getSuppliers,
  getUnitList,
} from "@/api/master";
import { getMenuDistinct, getMenuEngineer } from "@/api/misales";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
/**
 *  매장  단일 선택 컴포넌트
 *  */

/**
 * 	그리드 생성
 */

import Realgrid from "@/components/realgrid.vue";
/**
 *  페이지로그 자동 입력
 *  */

import { insertPageLog } from "@/customFunc/customFunc";
import Swal from "sweetalert2";
/*
 * 공통 표준  Function
 */

import { onMounted, ref, watch } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";

const reload = ref(false);
const rowData = ref([]);
const rowData2 = ref([]);
const afterSearch = ref(false);
const selectedstartDate = ref();
const selectedendDate = ref();
const cond = ref("");
const cond2 = ref("");
const cond3 = ref(0);
const cond4 = ref(0);
const cond5 = ref(0);
const cond6 = ref(0);
const cond7 = ref(0);
const cond8 = ref("");

const scond = ref("");
const scond2 = ref("");
const scond3 = ref("0");
const scond4 = ref("0");
const scond5 = ref("0");
const scond6 = ref("0");

const sscond = ref("0");
const sscond2 = ref("0");
const sscond3 = ref("");
const sscond4 = ref("0");
const sscond5 = ref("");
const sscond6 = ref("0");
const sscond7 = ref("");
const sscond8 = ref("0");
const sscond9 = ref("");

const ssscond = ref("0");
const ssscond2 = ref(false);
const ssscond3 = ref("");
const ssscond4 = ref("");
const ssscond5 = ref("");
const ssscond6 = ref("");
const ssscond7 = ref("");
const ssscond8 = ref("0");

const optionList = ref([]);
const optionList2 = ref([]);
const optionList3 = ref([]);
const optionList4 = ref([]);
const optionList5 = ref([]);
const optionList6 = ref([]);
const optionList7 = ref([]);
const optionList8 = ref([]);
const optionList9 = ref([]);
const optionList10 = ref([]);
const setGroupColumnId = ref("");

const addRow2 = ref(false);
const addRow3 = ref(false);
/**
 * 선택한 매출 시작일자
 */

const startDate = (e) => {
  //comsole.log(e);
  selectedstartDate.value = e;
};
/**
 * 선택한 매출 종료일자
 */

const endDate = (e) => {
  selectedendDate.value = e;
};

const setGroupFooter = ref(true);

const store = useStore();
const clickedRowData = (e) => {
  // console.log(e);

  filteredrowData.value = rowData.value.filter((item) =>
    item.strStoreName.includes(e[0])
  );
};
/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getStockGroup(store.state.userData.lngStoreGroup);

  optionList.value = res.data.List;

  console.log(optionList.value);

  const res2 = await getStockCategory(store.state.userData.lngStoreGroup);

  optionList2.value = res2.data.List;

  const res3 = await getStockGeneric(store.state.userData.lngStoreGroup);

  optionList3.value = res3.data.List;

  const res4 = await getSuppliers(store.state.userData.lngStoreGroup);

  optionList4.value = res4.data.List;

  const res5 = await getCommonList(35);

  optionList5.value = res5.data.List;

  const res6 = await getCommonList(99);

  optionList6.value = res6.data.List;

  const res7 = await getCommonList(8);

  optionList7.value = res7.data.List;

  const res8 = await getCommonList(109);

  optionList8.value = res8.data.List;

  const res9 = await getStandardList(store.state.userData.lngStoreGroup);

  optionList9.value = res9.data.List;

  const res10 = await getUnitList(store.state.userData.lngStoreGroup);

  optionList10.value = res10.data.List;

  //optionList3;
  //console.log(formattedDate.value);
});

/**
 *  조회 함수
 */

const filteredrowData = ref([]);
const searchButton = async () => {
  store.state.loading = true;
  try {
    initGrid();

    reload.value = !reload.value;

    const res = await getStockItemList(
      store.state.userData.lngStoreGroup,
      cond.value,
      cond2.value,
      cond3.value,
      cond4.value,
      cond5.value,
      cond6.value,
      cond7.value,
      cond8.value,
      store.state.userData.strLanguage
    );
    console.log(res);

    rowData.value = res.data.List;

    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
  } finally {
    store.state.loading = false;
  }
};

const selectedGroup = ref();
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

  addRow.value = !addRow.value;
};
/**
 * 페이지 매장 그룹 세팅
 */

/**
 * 페이지 매장 분류 세팅
 */

/**
 * 페이지 매장 슈퍼바이저 세팅
 */

/**
 * 그리드 초기화
 */

const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
};

const exportExcel = ref(false);

//comsole.log(store.state.minorCategory);

/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  documentSubTitle.value =
    selectedExcelDate.value + "\n" + selectedExcelStore.value + "\n";

  exportExcel.value = !exportExcel.value;
};

const datepicker = ref(null);
const closePopUp = ref(false);
/**
 * 매출 일자 안 라디오박스 닫기 위한 외부 클릭 감지 함수
 */

const documentSubTitle = ref("");
const selectedExcelDate = ref("");
/**
 * 엑셀용 일자 세팅 함수
 */

/**
 * 엑셀용 매장 세팅 함수
 */

/**
 *  컴포넌트 변동시 감지 함수
 */
</script>

<style></style>
