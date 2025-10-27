<!-- /*--############################################################################
# Filename : PUR01_099RPT.vue
# Description : 구매관리II > 단가 관리 > 매입단가쉬트출력(본사용)
# Date :2025-09-30
# Author : 권지안
################################################################################*/ -->
<template>
  <!-- 기본버튼 -->
  <div class="flex justify-between items-center w-full overflow-y-hidden">
    <PageName></PageName>
    <div class="flex justify-center mr-9 space-x-2 pr-5">
      <button @click="searchButton" class="button search md:w-auto w-14">조회</button>
      <button @click="excelButton" class="button excel w-auto">엑셀</button>
    </div>
  </div>
  <br />
  <!-- 조회조건 -->
  <div class="flex space-x-96 bg-gray-200 rounded-lg md:h-16 h-24 items-center">
    <div class="flex items-center justify-center space-x-5">
      <div class="justify-start flex ml-12">
        <Datepicker1
          :mainName="'기준일자'"
          ref="datepicker"
          :initToday="1"
          :closePopUp="closePopUp"
          @excelDate="excelDate"
          @dateValue="dateValue">
        </Datepicker1>
      </div>
      <PickStoreRenew3
        :setDynamicStoreClass="'!h-10 !p-0'"
        :defaultStoreNm="'전체'"
        @excelStore="excelStoreGrid1"
        @update:storeCd="handleStoreCd"
        @storeNm="storeNm"
        :hideit="false"
        :hideit2="false" />
      <div class="flex justify-start pl-16 items-center mt-2 space-x-5">
        <div class="font-semibold text-base">단위</div>
        <div>
          <select
            name=""
            id=""
            class="w-48 h-8 border border-black"
            v-model="cond"
            @change="excelUnitType"
            >
            <option :value="i.strDCode" v-for="i in optionList">
              {{ i.strDName }}
            </option>
          </select>
        </div>
      </div>
    </div>
  </div>
  <br/>
  <div>
    <label for="cond2" class="text-sm pl-6">
      <input type="checkbox" id="cond2" v-model="cond2" />전체보기
    </label>
  </div>
  <!-- 그리드 영역 -->
  <div class="flex justify-center w-[97%] h-[70vh] gap-5 ml-5">
    <Realgrid
      class="w-full h-full mt-2"
      :progname="'PUR01_099RPT_VUE'"
      :progid="1"
      :rowData="rowData"
      :documentTitle="'PUR01_099RPT'"
      :rowStateeditable="false"
      :selectionStyle="'block'" 
      :exporttoExcel="exportExcelGrid1"
      :documentSubTitle="documentSubTitleGrid1"
    />
  </div> 
<!-- 그리드 영역 -->
</template>

<script setup>

import { getCommonList } from "@/api/common";
import { getPrintPurchasePriceSheet } from "@/api/mipur";
/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";

/**
 *  매장 선택 컴포넌트
 *  */

import PickStoreRenew3 from "@/components/pickStoreRenew.vue";
import Datepicker1 from "@/components/Datepicker1.vue";

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

const rowData  = ref([]);

/**
 * 그리드1 초기화
 */

const initGrid = () => {
  if (rowData.value.length != 0) {
    rowData.value = [];
  }
};

/**
 * 	매출 일자 가져오는 함수
 */

const selectedDate = ref();
const dateValue = (e) => {
  selectedDate.value = e;
  initGrid();
  // console.log(selectedDate.value);
};

/**
 * 선택한 매장 코드 호출 함수
 */
const storeCd = ref("");  // 기본값 ""
const handleStoreCd = (e) => {
  // console.log(e);
  storeCd.value = e;
  initGrid();
};

const cond = ref("02");
const cond2 = ref(true);
const optionList = ref([]);

/**
 * 	화면 Load시 실행 스크립트
 */
onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getCommonList(27);
  optionList.value = res.data.List.filter((item) => item.strDCode != "01");

});

/**
 *  그리드 검색어 세팅
 */
const store = useStore();

/**
 *  조회 함수
 */

const searchButton = async () => {

  const AllYn = ref("");
  AllYn.value = cond2.value ? "1" : "0";

  // console.log(cond.value);

  try {
    const res = await getPrintPurchasePriceSheet(
      store.state.userData.lngStoreGroup,
      storeCd.value,
      selectedDate.value.replaceAll("-", ""),
      AllYn.value,
      cond.value,
      '',
      'ASC',
    );

    // console.log(res);

    rowData.value = res.data.List;
  } catch (error) {}
};

const exportExcelGrid1 = ref(false);
const selectedExcelStoreGrid1 = ref("");
const documentSubTitleGrid1 = ref("");

/**
 * 엑셀용 매장 세팅 함수
 */

const excelStoreGrid1 = (e) => {
  selectedExcelStoreGrid1.value = e;
};

const unitTypeNm = ref("발주/매입단위");    // 선택된 이름

function excelUnitType() {
  const selected = optionList.value.find(i => i.strDCode === cond.value);
  unitTypeNm.value = selected ? selected.strDName : "";
  // console.log(unitTypeNm.value);
}

/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  documentSubTitleGrid1.value =
  "기준일자 : " + selectedDate.value + "\n" +
  selectedExcelStoreGrid1.value + "\n" +
  "단위 : " + unitTypeNm.value
  ;

  exportExcelGrid1.value = !exportExcelGrid1.value;

};

</script>

<style></style>