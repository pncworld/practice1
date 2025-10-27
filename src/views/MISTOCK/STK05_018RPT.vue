<!-- /*--############################################################################
# Filename : STK05_018RPT.vue                                                  
# Description : 자재관리 > 주문/반품 관리 > 조회유형별 주문반품 현황.               
# Date :2025-08-07                                                            
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
        <!-- 
        <button
          @click="printButton"
          class="button print w-auto"
          v-if="cond7 == '2' && afterSearch">
          인쇄
        </button> -->
      </div>
    </div>
    <div
      class="grid grid-cols-[1fr,1fr,1fr] grid-rows-5 justify-start bg-gray-200 rounded-lg h-48 items-start z-10 w-full gap-3">
      <div class="flex ml-7">
        <Datepicker2
          @endDate="endDate"
          @startDate="startDate"
          :mainName="'일자'"
          :initToday="1"
          @excelDate="excelDate"></Datepicker2>
      </div>

      <div class="flex col-span-2">
        <!-- <PickStoreRenew
          @lngStoreCode="lngStoreCode"
          @excelStore="excelStore"
          :mainName="'이동매장'"
          :disableStore="true"
          :hideit2="false"
          :hideit="false"></PickStoreRenew> -->

        <PickStore
          :hideGroup="false"
          :hideAttr="false"
          :mainName="'이동매장'"
          @update:storeCd="lngStoreCode"></PickStore>

        <PickStoreRenew
          @lngStoreCode="lngStoreCode2"
          @excelStore="excelStore"
          :mainName="''"></PickStoreRenew>
      </div>

      <div
        class="flex justify-start items-center text-base text-nowrap font-semibold ml-12 mt-7 col-span-3">
        자재분류
        <div class="flex ml-5 space-x-3 -mt-1">
          <div>
            <select
              name=""
              id=""
              class="border border-black w-32 h-7"
              @change="changeOption"
              v-model="cond">
              <option value="0">전체</option>
              <option :value="i.strDCode" v-for="i in optionList">
                {{ i.strDName }}
              </option>
            </select>
          </div>
          <div>
            <select
              name=""
              id=""
              class="border border-black w-32 h-7"
              v-model="cond2">
              <option value="0">전체</option>
              <option :value="i.lngDetail" v-for="i in optionList2">
                {{ i.strDetail }}
              </option>
            </select>
          </div>
          <div>
            <input
              type="text"
              class="border border-black w-56 h-7"
              v-model="cond3" />
          </div>
        </div>
      </div>

      <div class="flex mt-6 ml-20 items-center">
        <div class="text-base font-semibold">단위</div>
        <div class="items-center ml-5">
          <select
            name=""
            id=""
            class="w-32 h-7 border border-black"
            v-model="cond4">
            <option :value="i.strDCode" v-for="i in optionList4">
              {{ i.strDName }}
            </option>
          </select>
        </div>
      </div>
      <div class="flex mt-6 ml-20 items-center col-span-2">
        <div class="text-base font-semibold">단가</div>
        <div class="items-center ml-5">
          <select
            name=""
            id=""
            class="w-32 h-7 border border-black"
            v-model="cond5">
            <option :value="i.strDCode" v-for="i in optionList5">
              {{ i.strDName }}
            </option>
          </select>
        </div>
      </div>
      <div class="flex mt-5 ml-4 items-center space-x-5 pl-1 col-span-3">
        <div class="text-base font-semibold">주문/반품유형</div>

        <div>
          <label for="cond6"
            ><input
              type="radio"
              id="cond6"
              name="cond6"
              value="0"
              v-model="cond6" />주문반품현황</label
          >
        </div>
        <div>
          <label for="cond7"
            ><input
              type="radio"
              id="cond7"
              name="cond6"
              value="1"
              v-model="cond6" />주문현황</label
          >
        </div>
        <div>
          <label for="cond8"
            ><input
              type="radio"
              id="cond8"
              name="cond6"
              value="2"
              v-model="cond6" />반품현황</label
          >
        </div>
      </div>
      <div class="flex mt-2 ml-12 items-center space-x-5 pl-1 w-[150%]">
        <div class="text-base font-semibold">조회유형</div>

        <div class="flex items-center text-center">
          <label for="cond9"
            ><input
              type="radio"
              id="cond9"
              name="cond9"
              value="0"
              v-model="cond7" />자재별</label
          >
        </div>
        <div class="flex items-center text-center">
          <label for="cond10"
            ><input
              type="radio"
              id="cond10"
              name="cond9"
              value="1"
              v-model="cond7" />일자별 자재별</label
          >
        </div>
        <div class="flex items-center text-center">
          <label for="cond11"
            ><input
              type="radio"
              id="cond11"
              name="cond9"
              value="2"
              v-model="cond7" />매장별 자재별</label
          >
        </div>
        <div v-if="cond6 == '1'" class="flex items-center text-center">
          <label for="cond12"
            ><input
              type="radio"
              id="cond12"
              name="cond9"
              value="3"
              v-model="cond7" />일자별 매장별</label
          >
        </div>
        <div v-if="cond6 == '1'" class="flex items-center text-center">
          <label for="cond13"
            ><input
              type="radio"
              id="cond13"
              name="cond9"
              value="4"
              v-model="cond7" />자재별 일자별</label
          >
        </div>
        <div v-if="cond6 == '1'">
          <label for="cond14" class="flex items-center text-center"
            ><input
              type="radio"
              id="cond14"
              name="cond9"
              value="5"
              v-model="cond7" />자재별 매장별</label
          >
        </div>
        <div v-if="cond6 != '1' && hagendasz == true">
          <label for="cond15" class="flex items-center text-center"
            ><input
              type="radio"
              id="cond15"
              name="cond9"
              value="6"
              v-model="cond7" />하겐다즈용</label
          >
        </div>
      </div>
    </div>
    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="w-full h-[70%]">
      <Realgrid
        :progname="'STK05_018RPT_M_VUE'"
        :progid="progid"
        :rowData="rowData"
        :reload="reload"
        :documentTitle="'STK05_018RPT'"
        :setRowStyleCallsDefaultCol="setRowStyleCallsDefaultCol"
        :setRowStyleCallsDefaultCol2="setRowStyleCallsDefaultCol"
        :hideColumnsId="hideColumnsId"
        :setRowStyleCalls="true"
        :hardCodeSetRowStyleCalls="true"
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
import { getOrderStockReturnList, getStockDetail } from "@/api/mistock";
import Datepicker2 from "@/components/Datepicker2.vue";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
import PickStore from "@/components/pickStore.vue";
import PickStoreRenew from "@/components/pickStoreRenew.vue";
/**
 *  단일 매장  컴포넌트
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

const optionList = ref([]);
const optionList2 = ref([]);
const optionList3 = ref([]);
const optionList4 = ref([]);
const optionList5 = ref([]);

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);
const selectedstartDate = ref();
const selectedendDate = ref();

/**
 * 선택한 매출 시작일자
 */

const cond = ref(0);
const cond2 = ref(0);
const cond3 = ref("");
const cond4 = ref("03");

const progid = ref("1");

const store = useStore();
const loginedstrLang = store.state.userData.lngLanguage;

const datepicker = ref(null);
const closePopUp = ref(false);
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

const cond5 = ref("1");
const cond6 = ref(0);
const cond7 = ref(2);
const cond8 = ref(0);
const checkCond = (e) => {
  cond6.value = e.target.checked;
};
const hideColumnsId = ref(["lngMoveType"]);
const sdate = ref("");
const edate = ref("");
const endDate = (e) => {
  edate.value = e;
};
const startDate = (e) => {
  sdate.value = e;
};
const searchButton = async () => {
  if (selectedStore.value == "0") {
    Swal.fire({
      title: "경고",
      text: "이동매장을 선택해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }
  store.state.loading = true;
  try {
    initGrid();

    reload.value = !reload.value;
    if (progid.value == "1") {
      setRowStyleCallsDefaultCol.value = "lngMoveType";
    } else {
      setRowStyleCallsDefaultCol.value = "strStoreName";
    }
    const res = await getOrderStockReturnList(
      store.state.userData.lngStoreGroup,
      selectedStore.value,
      sdate.value.replaceAll("-", ""),
      edate.value.replaceAll("-", ""),
      0,
      selectedStore2.value,
      cond.value,
      cond2.value,
      cond3.value,
      cond4.value,
      cond5.value,
      cond6.value,
      store.state.userData.strLanguage,
      cond7.value
    );
    console.log(res);
    rowData.value = res.data.List;

    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    //comsole.log(error);
  } finally {
    store.state.loading = false;
  }
};

/* 매장 컴포넌트 관련 함수 */
const selectedGroup = ref();
const selectedStore = ref(0);
const selectedStore2 = ref(0);

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
 * 페이지 매장 팀 세팅
 */

/* 매입사 콤보박스 */

const selectedWeekDay = ref("");

/**
 * 	화면 Load시 실행 스크립트
 */
const hagendasz = ref(false);
onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
  const res = await getCommonList("07");

  const res4 = await getCommonList("166");
  const res5 = await getCommonList("164");
  const res6 = await getCommonList("170");

  optionList.value = res.data.List;
  optionList3.value = res6.data.List;
  optionList4.value = res4.data.List;
  optionList5.value = res5.data.List;

  if (optionList4.value.length > 0) {
    cond4.value = optionList4.value[0].strDCode;
  }
  if (optionList5.value.length > 0) {
    cond5.value = optionList5.value[0].strDCode;
  }

  if (store.state.userData.lngStoreGroup == "1028") {
    hagendasz.value = true;
  } else {
    hagendasz.value = false;
  }

  //comsole.log(weekDay.value);
});

const changeOption = async (e) => {
  const res = await getStockDetail(
    store.state.userData.lngStoreGroup,
    e.target.value
  );
  //console.log(res);
  optionList2.value = res.data.List;
};

/**
 * 그리드 초기화
 */

const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }

  afterSearch.value = false;
};

//엑셀 버튼 처리 함수
const exportExcel = ref(false);
/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  documentSubTitle.value =
    selectedExcelDate.value + "\n" + selectedExcelStore.value;
  //comsole.log(documentSubTitle.value); // 맑음 소스 pickStorePlural.vue 소스의 excelStore 받아야 함.
  // 엑셀 기능 실행
  exportExcel.value = !exportExcel.value;
};

// 엑셀 추출
const documentSubTitle = ref("");
const selectedExcelDate = ref("");
/**
 * 엑셀용 일자 세팅 함수
 */

const excelDate = (e) => {
  selectedExcelDate.value = e;
  //comsole.log(e);
};

const selectedDate = ref("");
const dateValue = (e) => {
  selectedDate.value = e;
};

const lngStoreCode = (e) => {
  selectedStore.value = e;
};
const lngStoreCode2 = (e) => {
  selectedStore2.value = e;
};
const selectedExcelStore = ref("");
/**
 * 엑셀용 매장 세팅 함수
 */

const excelStore = (e) => {
  selectedExcelStore.value = e;
  //comsole.log(e);
};

watch(cond6, () => {
  cond7.value = "2";
});

const setRowStyleCallsDefaultCol = ref("lngMoveType");
watch([cond7, cond6], () => {
  if (cond7.value == "6" && cond6.value == "0") {
    progid.value = "2";

    return;
  } else {
    progid.value = "1";
  }
  if (cond6.value == "0") {
    if (cond7.value == "0") {
      hideColumnsId.value = [
        "lngMoveType",
        "lngStoreCode",
        "dtmMoveReturnDate",
      ];
    } else if (cond7.value == "1") {
      hideColumnsId.value = ["lngMoveType", "lngStoreCode"];
    } else if (cond7.value == "2") {
      hideColumnsId.value = ["lngMoveType", "dtmMoveReturnDate"];
    }
  } else if (cond6.value == "1") {
    if (cond7.value == "0") {
      hideColumnsId.value = [
        "lngStoreCode",
        "dtmMoveReturnDate",
        "lngReturnQty",
        "strStoreName",
      ];
    } else if (cond7.value == "1") {
      hideColumnsId.value = ["lngStoreCode", "lngReturnQty", "strStoreName"];
    } else if (cond7.value == "2") {
      hideColumnsId.value = [
        "dtmMoveReturnDate",
        "lngReturnQty",
        "lngStoreCode",
      ];
    } else if (cond7.value == "3") {
      hideColumnsId.value = ["lngReturnQty", "lngReturnQty", "lngStoreCode"];
    } else if (cond7.value == "4") {
      hideColumnsId.value = ["lngStoreCode", "lngReturnQty", "strStoreName"];
    } else if (cond7.value == "5") {
      hideColumnsId.value = [
        "lngStoreCode",
        "lngReturnQty",
        "dtmMoveReturnDate",
      ];
    }
  } else if (cond6.value == "2") {
    if (cond7.value == "0") {
      hideColumnsId.value = [
        "strStoreName",
        "lngStoreCode",
        "dtmMoveReturnDate",
        "lngReturnQty",
      ];
    } else if (cond7.value == "1") {
      hideColumnsId.value = ["strStoreName", "lngStoreCode", "lngReturnQty"];
    } else if (cond7.value == "2") {
      hideColumnsId.value = [
        "lngStoreCode",
        "dtmMoveReturnDate",
        "lngReturnQty",
      ];
    } else if (cond7.value == "6") {
      hideColumnsId.value = [
        "lngStoreCode",
        "dtmMoveReturnDate",
        "lngReturnQty",
      ];
    }
  }
});
</script>
