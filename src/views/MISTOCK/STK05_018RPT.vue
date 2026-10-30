<!-- /*--############################################################################
# Filename : STK05_018RPT.vue                                                  
# Description : 자재관리 > 주문/반품 관리 > 조회유형별 주문반품 현황.               
# Date :2025-08-07                                                            
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <!-- 조회조건 -->
  <!-- pl-5: 셸 w-right가 pl0이라 그리드가 좌측 메뉴에 붙음 → 우측 pd20과 맞춤 -->
  <div class="stk518-page flex h-full min-h-0 flex-col pl-5" @click="handleParentClick">
    <div class="flex shrink-0 justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center space-x-2 pr-5">
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
      class="stk518-search-panel z-10 mt-3 w-full min-w-0 shrink-0 rounded-lg bg-gray-200">
      <div class="stk518-search-grid min-w-0">
      <!-- 1행: 일자 | 자재분류 -->
      <div class="stk518-cell">
        <div class="stk518-sg-label">일자</div>
        <div class="stk518-cell-field stk518-range-slot min-w-0">
          <Datepicker2
            omit-main-label
            filter-bar-align
            @endDate="endDate"
            @startDate="startDate"
            :mainName="'일자'"
            :initToday="1"
            @excelDate="excelDate"></Datepicker2>
        </div>
      </div>

      <div class="stk518-cell stk518-cell--span2">
        <div class="stk518-sg-label">자재분류</div>
        <div class="stk518-cell-field stk518-inline min-w-0">
          <select
            class="stk518-control stk518-select"
            aria-label="자재분류 대분류"
            @change="changeOption"
            v-model="cond">
            <option value="0">전체</option>
            <option :value="i.strDCode" v-for="i in optionList" :key="i.strDCode">
              {{ i.strDName }}
            </option>
          </select>
          <select
            class="stk518-control stk518-select"
            aria-label="자재분류 소분류"
            v-model="cond2">
            <option value="0">전체</option>
            <option :value="i.lngDetail" v-for="i in optionList2" :key="i.lngDetail">
              {{ i.strDetail }}
            </option>
          </select>
          <input
            type="text"
            class="stk518-control stk518-text"
            aria-label="자재코드/명"
            v-model="cond3" />
        </div>
      </div>

      <!-- 2행: 이동매장 (매장 콤보 2세트) -->
      <div class="stk518-cell stk518-cell--full">
        <div class="stk518-sg-label">이동매장</div>
        <div class="stk518-cell-field stk518-move-slot min-w-0">
          <!-- <PickStoreRenew
            @lngStoreCode="lngStoreCode"
            @excelStore="excelStore"
            :mainName="'이동매장'"
            :disableStore="true"
            :hideit2="false"
            :hideit="false"></PickStoreRenew> -->

          <div class="stk518-pick-slot">
            <PickStore
              compact-search-bar
              :compact-store-combo-max-rem="96"
              main-name=""
              :hideGroup="false"
              :hideAttr="false"
              :mainName="'이동매장'"
              @update:storeCd="lngStoreCode"></PickStore>
          </div>

          <div class="stk518-renew-slot">
            <PickStoreRenew
              compact
              combo-fill
              omit-main-label
              @lngStoreCode="lngStoreCode2"
              @excelStore="excelStore"
              :mainName="''"></PickStoreRenew>
          </div>
        </div>
      </div>

      <!-- 3행: 단위 | 단가 -->
      <div class="stk518-cell">
        <label class="stk518-sg-label" for="stk05-018-unit">단위</label>
        <div class="stk518-cell-field min-w-0">
          <select
            id="stk05-018-unit"
            class="stk518-control"
            v-model="cond4">
            <option :value="i.strDCode" v-for="i in optionList4" :key="i.strDCode">
              {{ i.strDName }}
            </option>
          </select>
        </div>
      </div>
      <div class="stk518-cell stk518-cell--span2">
        <label class="stk518-sg-label" for="stk05-018-price">단가</label>
        <div class="stk518-cell-field stk518-half min-w-0">
          <select
            id="stk05-018-price"
            class="stk518-control"
            v-model="cond5">
            <option :value="i.strDCode" v-for="i in optionList5" :key="i.strDCode">
              {{ i.strDName }}
            </option>
          </select>
        </div>
      </div>

      <!-- 4행: 주문/반품유형 | 조회유형 -->
      <div class="stk518-cell">
        <div class="stk518-sg-label">주문/반품유형</div>
        <div class="stk518-cell-field stk518-radios min-w-0">

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
      </div>
      <div class="stk518-cell stk518-cell--span2">
        <div class="stk518-sg-label">조회유형</div>
        <div class="stk518-cell-field stk518-radios min-w-0">

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
      </div>
    </div>
    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="mt-3 min-h-0 w-full flex-1">
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

<style scoped>
.stk518-page {
  --stk518-label-col: 7rem; /* 가장 긴 항목명: 주문/반품유형 */
  --stk518-item-gap: 1rem;
  --stk518-col-gap: 1.75rem;
  --stk518-row-gap: 0.625rem;
  --stk518-panel-pad-x: 2rem; /* 조회 항목 많음 — 앞·뒤 동일 */
  --stk518-row-min-h: 2rem;
  --stk518-control-border: #cbd5e1;
  --stk518-control-h: 2rem;
}

/* 조회 AREA — 반응형 3열, 앞·뒤 pad 동일, 항목 사이 column-gap 하나 */
.stk518-search-panel {
  box-sizing: border-box;
  padding-block: 0.75rem;
  padding-inline: var(--stk518-panel-pad-x);
}

.stk518-search-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  column-gap: var(--stk518-col-gap);
  row-gap: var(--stk518-row-gap);
  align-items: center;
  width: 100%;
  min-width: 0;
}

.stk518-cell {
  display: flex;
  min-width: 0;
  min-height: var(--stk518-row-min-h);
  align-items: center;
  gap: var(--stk518-item-gap);
}

.stk518-cell--span2 {
  grid-column: span 2;
}

.stk518-cell--full {
  grid-column: 1 / -1;
}

.stk518-sg-label {
  flex: 0 0 var(--stk518-label-col);
  width: var(--stk518-label-col);
  min-height: var(--stk518-row-min-h);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
  white-space: nowrap;
}

.stk518-cell-field {
  flex: 1 1 auto;
  min-width: 0;
  min-height: var(--stk518-row-min-h);
  display: flex;
  align-items: center;
  width: 100%;
}

.stk518-control {
  box-sizing: border-box;
  height: var(--stk518-control-h);
  min-height: var(--stk518-control-h);
  max-height: var(--stk518-control-h);
  width: 100%;
  min-width: 0;
  border: 1px solid var(--stk518-control-border);
  border-radius: 0.375rem;
  background: #fff;
  padding: 0 0.5rem;
  font-size: 0.875rem;
  color: rgb(55 65 81);
}

.stk518-control:focus {
  border-color: #3b82f6;
  outline: none;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.25);
}

/* 자재분류: 대분류·소분류·자재코드/명 한 줄 */
.stk518-inline {
  gap: 0.5rem;
}

.stk518-select {
  flex: 1 1 0;
  max-width: 12rem;
}

.stk518-text {
  flex: 2 1 0;
  max-width: 20rem;
}

/* 단가: 3행 둘째 칸이 2칸을 차지하므로 컨트롤은 단위와 같은 폭 정도로 */
.stk518-half > .stk518-control {
  max-width: calc(50% - var(--stk518-col-gap) / 2);
}

/* 라디오 묶음 */
.stk518-radios {
  flex-wrap: wrap;
  gap: 0.375rem 1.25rem;
  font-size: 0.875rem;
  color: rgb(17 24 39);
}

.stk518-radios label {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  white-space: nowrap;
  cursor: pointer;
}

/* 일자 Datepicker2 (filterBarAlign) — 칸 폭 채움·높이 2rem·테두리 통일 */
.stk518-range-slot > * {
  width: 100%;
  min-width: 0;
}

.stk518-range-slot :deep(> div.flex.justify-start.items-center) {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0;
  margin: 0 !important;
  gap: 0.25rem !important;
}

.stk518-range-slot :deep(> div.flex > div.inline-flex.h-8) {
  flex: 1 1 auto;
  min-width: 0;
  width: 100%;
  gap: 0.125rem !important;
}

.stk518-range-slot :deep(input[type="date"]) {
  box-sizing: border-box;
  height: var(--stk518-control-h) !important;
  border: 1px solid var(--stk518-control-border) !important;
  width: auto !important;
  flex: 1 1 0;
  min-width: 5.25rem;
  padding-left: 0.45rem;
  padding-right: 0.25rem;
  font-size: 0.875rem;
}

.stk518-range-slot :deep(input[type="date"]:focus) {
  border-color: #3b82f6 !important;
}

.stk518-range-slot :deep(div.inline-flex.h-8 > span),
.stk518-range-slot :deep(div.inline-flex.h-8 > button) {
  flex-shrink: 0;
}

/* 이동매장: PickStore(3콤보) + PickStoreRenew 한 줄 */
.stk518-move-slot {
  gap: var(--stk518-col-gap);
}

.stk518-pick-slot {
  flex: 3 1 0;
  min-width: 0;
}

.stk518-renew-slot {
  flex: 2 1 0;
  min-width: 0;
}

.stk518-pick-slot :deep(> div.flex.text-base) {
  width: 100%;
  min-width: 0;
  align-items: center;
  gap: var(--stk518-item-gap) !important;
}

.stk518-pick-slot :deep(> div.flex > div:first-child) {
  display: none;
}

.stk518-pick-slot :deep(.relative.min-w-0.flex-1) {
  flex: 1 1 auto !important;
  min-width: 11rem !important;
  max-width: none !important;
}

.stk518-pick-slot :deep(select),
.stk518-renew-slot :deep(select) {
  box-sizing: border-box;
  height: var(--stk518-control-h) !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  border: 1px solid var(--stk518-control-border) !important;
}

.stk518-renew-slot :deep(select) {
  margin-left: 0 !important;
}

.stk518-renew-slot :deep(> div.flex) {
  gap: 0.5rem;
}

.stk518-pick-slot :deep(.pickstore-vs-shell),
.stk518-renew-slot :deep(.pickstore-vs-shell) {
  box-sizing: border-box;
  width: 100% !important;
  max-width: none !important;
  height: var(--stk518-control-h) !important;
  border: 1px solid var(--stk518-control-border) !important;
}

@media (max-width: 1280px) {
  .stk518-search-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .stk518-move-slot {
    flex-wrap: wrap;
  }

  .stk518-pick-slot,
  .stk518-renew-slot {
    flex-basis: 100%;
  }

  .stk518-half > .stk518-control {
    max-width: none;
  }
}
</style>
