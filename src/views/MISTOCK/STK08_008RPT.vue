<!-- /*--############################################################################
# Filename : STK08_008RPT.vue                                                  
# Description : 자재관리2 > 재고 현황 > 월수불 현황                      
# Date :2025-09-01                                                             
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
        <button @click="excelButton" class="button save w-auto excel">
          엑셀
        </button>
      </div>
    </div>
    <div
      class="grid grid-cols-3 grid-rows-3 bg-gray-200 rounded-lg h-36 items-start z-10">
      <div class="justify-start flex ml-28 space-x-5 mt-2 items-center">
        <div class="font-semibold text-base">일자</div>
        <select
          name=""
          id=""
          class="w-32 border border-black h-8"
          v-model="sdate">
          <option value="2030">2030</option>
          <option value="2029">2029</option>
          <option value="2028">2028</option>
          <option value="2027">2027</option>
          <option value="2026">2026</option>
          <option value="2025">2025</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
          <option value="2021">2021</option>
          <option value="2020">2020</option>
        </select>
        <div>~</div>
        <select
          name=""
          id=""
          class="w-32 border border-black h-8"
          v-model="edate">
          <option value="01">1</option>
          <option value="02">2</option>
          <option value="03">3</option>
          <option value="04">4</option>
          <option value="05">5</option>
          <option value="06">6</option>
          <option value="07">7</option>
          <option value="08">8</option>
          <option value="09">9</option>
          <option value="10">10</option>
          <option value="11">11</option>
          <option value="12">12</option>
        </select>
      </div>
      <div class="flex justify-start items-center !-ml-5">
        <PickStore
          :setDynamicStoreClass="'w-[100%]'"
          @update:storeGroup="lngStoreGroup"
          :defaultStoreNm="'전체'"
          class=""
          @storeNm="excelStore"
          @update:storeCd="lngStoreCode"></PickStore>
      </div>
      <div class="flex justify-start items-center mt-2 ml-20 space-x-5">
        <div class="text-base font-semibold">바코드</div>
        <div>
          <input type="text" class="border border-black h-8" v-model="cond" />
        </div>
      </div>
      <div class="flex justify-start pl-20 items-center mt-2 space-x-5">
        <div class="text-base font-semibold">자재분류</div>
        <div>
          <select
            name=""
            id=""
            class="w-64 h-8 border border-black"
            v-model="cond2">
            <option value="0">전체</option>
            <option :value="i.lngDetail" v-for="i in optionList">
              {{ i.strDetail }}
            </option>
          </select>
        </div>
      </div>

      <div class="flex space-x-5 ml-4 mt-3 items-center">
        <div class="font-semibold text-base">자재그룹</div>
        <div>
          <select
            name=""
            id=""
            class="w-64 h-8 border border-black"
            v-model="cond3">
            <option value="0">전체</option>
            <option :value="i.lngStockGroupID" v-for="i in optionList2">
              {{ i.strStockGroupName }}
            </option>
          </select>
        </div>
      </div>
      <div class="flex space-x-5 ml-12 mt-3 items-center">
        <div class="text-base font-semibold">자재특성</div>
        <div>
          <select
            name=""
            id=""
            class="w-64 h-8 border border-black"
            v-model="cond4">
            <option value="0">전체</option>
            <option :value="i.lngGenericID" v-for="i in optionList3">
              {{ i.strGenericName }}
            </option>
          </select>
        </div>
      </div>
      <div class="flex space-x-5 ml-12 mt-3 items-center">
        <div class="font-semibold text-base text-nowrap">자재코드/이름</div>
        <div class="flex space-x-3">
          <input
            type="text"
            class="h-8 w-[60%] border border-black"
            v-model="cond5" />

          <input
            type="text"
            class="h-8 w-[60%] border border-black"
            v-model="cond6" />
        </div>
      </div>

      <div class="flex ml-10 pl-1 items-center mt-3 space-x-5">
        <div class="text-base font-semibold">단위</div>
        <div class="flex space-x-4">
          <select
            name=""
            id=""
            class="border border-black w-64 h-8"
            v-model="cond7">
            <option :value="i.strDCode" v-for="i in optionList4">
              {{ i.strDName }}
            </option>
          </select>
        </div>
      </div>

      <div class="flex ml-20 items-center mt-3 space-x-5">
        <div class="text-base font-semibold">단가</div>
        <div class="flex space-x-4">
          <select
            name=""
            id=""
            class="border border-black w-[120%] h-8"
            v-model="cond8">
            <option :value="i.strDCode" v-for="i in optionList5">
              {{ i.strDName }}
            </option>
          </select>
        </div>
        <div>
          <label for="cond9"
            ><input
              type="checkbox"
              id="cond9"
              @change="setCond9" />전체보기</label
          >
        </div>
      </div>
    </div>
    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="w-full h-[70vh]">
      <Realgrid
        :progname="'STK08_008RPT_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :setStateBar="false"
        :mergeColumnGroupName2="[
          '기초',
          '매입',
          '반품',
          '주문입고',
          '반품출고',
          '매장간입고',
          '매장간출고',
          '입고 계',
          '주문출고',
          '반품입고',
          '사용',
          '손실',
          '과부족',
          '출고 계',
          '계산 재고',
          '재고',
        ]"
        :mergeColumnGroupSubList2="[
          ['dblInitQty', 'curInitCost'],
          ['dblCheckQty', 'curCheckCost'],
          ['dblReturnQty', 'curReturnCost'],
          ['dblMoveInQty', 'curMoveInCost'],
          ['dblReturnOutQty', 'curReturnOutCost'],
          ['dblStoreMoveInQty', 'curStoreMoveInCost'],
          ['dblStoreMoveOutQty', 'curStoreMoveOutCost'],
          ['dblInTotQty', 'curInTotCost'],
          ['dblMoveOutQty', 'curMoveOutCost'],
          ['dblReturnInQty', 'curReturnInCost'],
          ['dblUsageQty', 'curUsageCost'],
          ['dblLossQty', 'curLossCost'],
          ['dblShortQty', 'curShortCost'],
          ['dblOutTotQty', 'curOutTotCost'],
          ['calculateStock', 'calculateCost'],
          ['dblResultQty', 'curResultCost', 'curResultPrice'],
        ]"
        :mergeColumns2="true"
        :documentTitle="'STK08_008RPT'"
        @clickedRowData="clickedRowData"
        :setFooter="true"
        :setGroupFooter="true"
        :setMergeMode="false"
        :setGroupColumnId="'lngStoreCode'"
        :documentSubTitle="documentSubTitle"
        :rowStateeditable="false"
        :exporttoExcel="exportExcel">
      </Realgrid>
    </div>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import { getCommonList } from "@/api/common";
import { getStockGeneric, getStockGroup } from "@/api/master";
import { getStockDetail, getStockMonthlyInOutList } from "@/api/mistock";
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

import { insertPageLog } from "@/customFunc/customFunc";
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

const optionList3 = ref([]);
onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getStockDetail(store.state.userData.lngStoreGroup, "01");

  //console.log(res);
  optionList.value = res.data.List;

  const res2 = await getStockGroup(store.state.userData.lngStoreGroup);

  optionList2.value = res2.data.List;

  const res3 = await getStockGeneric(store.state.userData.lngStoreGroup);

  optionList3.value = res3.data.List;

  const res4 = await getCommonList(166);

  optionList4.value = res4.data.List;

  const res5 = await getCommonList(172);

  optionList5.value = res5.data.List;

  const today = new Date();
  sdate.value = today.getFullYear();

  edate.value = String(today.getMonth()).padStart(2, "0");
});
const optionList4 = ref([]);
const optionList5 = ref([]);
const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

const edate = ref("01");
const sdate = ref(2025);
const cond = ref("");
const cond2 = ref("0");
const cond3 = ref("0");
const cond4 = ref("0");
const cond5 = ref("");
const cond6 = ref("");
const cond7 = ref("05");
const cond8 = ref("01");

const store = useStore();

const datepicker = ref(null);
const closePopUp = ref(false);
const optionList = ref([]);
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
  initGrid();
  sDate.value = e;
};
const endDate = (e) => {
  initGrid();
  eDate.value = e;
};

const selectedDate = ref();
const excelDate = (e) => {
  selectedDate.value = e;
};
const optionList2 = ref([]);

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
  initGrid();
  storeCode.value = e;
};

const storeAttr = ref();
const lngStoreAttrs = (e) => {
  storeAttr.value = e;
};

const groupCd = ref();
const lngStoreGroup = (e) => {
  groupCd.value = e;
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
  if (storeCode.value == "0") {
    Swal.fire({
      title: "경고",
      text: "매장을 먼저 선택해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }
  try {
    store.state.loading = true;
    initGrid();

    const res = await getStockMonthlyInOutList(
      groupCd.value,
      storeCode.value,
      sdate.value + edate.value,
      cond2.value,
      cond3.value,
      cond4.value,
      cond.value,
      cond7.value,
      cond8.value,
      cond9.value == true ? "02" : "01",
      cond5.value,
      cond6.value,
      0,
      "M"
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

const progid = ref(1);

const setRowStyleCallsDefaultCol2 = ref("strTaxType");
const setRowStyleCallsDefaultCol = ref("strTaxType");
const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }

  reload.value = !reload.value;
};

//엑셀 버튼 처리 함수
const exportExcel = ref(false);
/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  documentSubTitle.value =
    "일자 :" +
    sdate.value +
    "년" +
    edate.value +
    "월" +
    "\n" +
    "매장명 :" +
    selectedExcelStore.value;
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

const cond9 = ref(false);
const setCond9 = (e) => {
  cond9.value = e.target.checked;
};
</script>
