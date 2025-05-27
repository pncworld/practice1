/*--############################################################################
# Filename : MST01_014INS.vue                                                  
# Description : 마스터관리 > 메뉴 마스터 > 매장별 판매단가 변경                
# Date :2025-05-23                                                             
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
        <button @click="saveButton" class="button search md:w-auto w-14">
          저장
        </button>
        <button @click="excelButton" class="button save w-auto excel">
          엑셀
        </button>
      </div>
    </div>
    <div class="text-red-400 flex justify-start ml-10">
      ※검색된 내용 판매가 변경 후 재 조회시에 저장 후 조회 하셔야 변경된 내용이
      반영 됩니다.
    </div>
    <div
      class="grid grid-cols-2 grid-rows-2 bg-gray-200 rounded-lg h-24 items-center z-10">
      <div class="flex justify-center mr-40">
        <PickStore
          :hideGroup="false"
          :hideAttr="false"
          @update:storeCd="lngStoreCode"
          @update:storeGroup="lngStoreGroup"
          @storeNm="excelStore">
        </PickStore>
      </div>
      <div class="flex justify-center mr-96">
        <MenuGroup
          :storeCd="selectedStores"
          :groupCd="selectedGroup"
          @mainCode="mainCode"
          @mainNm="mainNm"
          @subNm="subNm"
          @subCode="subCode"></MenuGroup>
      </div>
      <div class="flex justify-center ml-20 space-x-2 items-center">
        <div class="text-base font-semibold">검색 :</div>
        <div>
          <select
            name=""
            id=""
            class="w-40 border border-black h-8"
            v-model="searchType">
            <option value="0">메뉴명</option>
            <option value="1">바코드</option>
          </select>
        </div>
        <div>
          <input
            type="text"
            v-model="cond"
            class="w-40 border border-black pl-1 h-8" />
        </div>
      </div>
      <div class="flex space-x-3 items-center ml-10">
        <div class="text-base font-semibold">할인율 :</div>
        <div><input type="number" class="pl-1" v-model="cond2" /></div>
        <div>%</div>
        <div>
          <button class="whitebutton bg-white" @click="setDiscountPrice">
            적용
          </button>
        </div>
      </div>
    </div>
    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="w-full h-[80%]">
      <Realgrid
        :progname="'MST01_014INS_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :setStateBar="false"
        :documentTitle="'MST01_014INS'"
        :documentSubTitle="documentSubTitle"
        :rowStateeditable="false"
        :editableColId="'lngPrice'"
        :changeNow="changeNow"
        :changeRow="changeRow"
        :changeColid="'lngPrice'"
        :changeValue2="changeValue2"
        @updatedRowData="updatedRowData"
        :inputOnlyNumberColumn="'lngPrice'"
        :suffixColumnPercent="['lngMargin', 'lngRateD']"
        :exporttoExcel="exportExcel">
      </Realgrid>
    </div>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import { getSalesUnitbyStore, saveUpdatelngPrice } from "@/api/master";
import MenuGroup from "@/components/menuGroup.vue";
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

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const userGroup = store.state.storeGroup[0].lngStoreGroup;
  reload.value = !reload.value;
});

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

const cond = ref("");
const cond2 = ref(0);
const store = useStore();

const datepicker = ref(null);
const closePopUp = ref(false);
const searchType = ref("0");

const selectedSubCode = ref(0);
const subCode = (e) => {
  selectedSubCode.value = e;
};
const selectedMainCode = ref(0);
const mainCode = (e) => {
  selectedMainCode.value = e;
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
    // initGrid();
    reload.value = !reload.value;
    const res = await getSalesUnitbyStore(
      selectedGroup.value,
      selectedStores.value,
      selectedMainCode.value,
      selectedSubCode.value,
      searchType.value,
      cond.value
    );
    //console.log(res);
    rowData.value = res.data.List;

    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    //comsole.log(error);
  } finally {
    store.state.loading = false;
  }
};

const saveButton = async () => {
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
    //updaterowdata.value;
    store.state.loading = true;
    const MenuCds = updaterowdata.value
      .map((item) => item.lngMenuCode)
      .join("\u200B");
    const lngPrices = updaterowdata.value
      .map((item) => item.lngPrice)
      .join("\u200B");
    const res = await saveUpdatelngPrice(
      selectedGroup.value,
      selectedStores.value,
      MenuCds,
      lngPrices
    );
    console.log(res);

    Swal.fire({
      title: "성공",
      text: "저장이 완료되었습니다.",
      icon: "success",
      confirmButtonText: "확인",
    });
  } catch (error) {
  } finally {
    store.state.loading = false;
  }
};

/* 매장 컴포넌트 관련 함수 */
const selectedGroup = ref();
const selectedStores = ref();
const selectedStoreAttrs = ref();

/**
 * 페이지 매장 코드 세팅
 */

const lngStoreCode = async (e) => {
  initGrid();
  selectedStores.value = e;
  console.log(e);
};
const lngStoreGroup = async (e) => {
  //initGrid();
  selectedGroup.value = e;
  console.log(e);
};

/**
 * 그리드 초기화
 */

const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
  cond.value = "";
  cond2.value = 0;
};

//엑셀 버튼 처리 함수
const exportExcel = ref(false);
/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  documentSubTitle.value =
    selectedExcelStore.value +
    "\n" +
    " 메뉴그룹명 :" +
    MainName.value +
    "," +
    SubName.value;

  //documentSubTitle.value += "\n";
  exportExcel.value = !exportExcel.value;
};

// 엑셀 추출
const documentSubTitle = ref("");
const selectedExcelList = ref("");
const selectedExcelDate = ref("");

const selectedExcelStore = ref("");
/**
 * 엑셀용 매장 세팅 함수
 */

const excelStore = (e) => {
  selectedExcelStore.value = "매장명 : " + e;
  //comsole.log(e);
};
const excelDate = (e) => {
  selectedExcelDate.value = e;
  //comsole.log(e);
};

const changeNow = ref(false);
const changeRow = ref(0);
const changeValue2 = ref("");

const setDiscountPrice = async () => {
  let n = rowData.value.length;
  for (let i = 0; i < n; i++) {
    changeRow.value = i;
    changeValue2.value = parseInt(
      rowData.value[i].lngDCPrice * ((100 - cond2.value) / 100)
    );

    changeNow.value = !changeNow.value;

    await nextTick();
  }
};

const updaterowdata = ref([]);
const updatedRowData = (e) => {
  //console.log(e);
  updaterowdata.value = e;
};

const MainName = ref("");
const mainNm = (e) => {
  MainName.value = e;
};
const SubName = ref("");
const subNm = (e) => {
  SubName.value = e;
};
</script>
