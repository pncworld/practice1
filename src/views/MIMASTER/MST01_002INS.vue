/*--############################################################################
# Filename : MST01_002INS.vue                                                  
# Description : 마스터관리 > 매장 마스터 > 매장정보등록                        
# Date :2025-05-14                                                             
# Author : 권맑음                     
################################################################################*/
<template>
  <div class="mst002-page box-border flex h-full max-w-full min-h-0 flex-col gap-2 overflow-hidden pb-1">
    <!-- 상단: 페이지명 + 액션 -->
    <div class="flex shrink-0 flex-wrap items-center justify-between gap-2">
      <PageName />
      <div class="flex flex-wrap items-center justify-end gap-2">
        <button type="button" @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <button type="button" @click="saveButton" class="button save md:w-auto w-auto">
          저장
        </button>
        <button type="button" @click="exportToExcel" class="button excel md:w-auto w-auto">
          엑셀
        </button>
      </div>
    </div>

    <!-- 조회 AREA -->
    <div class="mst002-search-panel z-10 w-full min-w-0 shrink-0 rounded-lg bg-gray-200">
      <div class="mst002-search-grid min-w-0">
        <div class="mst002-cell">
          <div class="mst002-sg-label">매장명</div>
          <div class="mst002-cell-field mst002-pick-slot min-w-0">
            <PickStore
              compact-search-bar
              main-name=""
              :compact-store-combo-max-rem="15.6"
              :defaultStoreNm="'전체'"
              @update:storeGroup="handleGroupCd"
              @update:storeType="handleStoreType"
              @update:storeCd="handleStoreCd" />
          </div>
        </div>
      </div>
    </div>

    <!-- 그리드 -->
    <div class="mst002-grid-section min-h-0 min-w-0 w-full">
      <div class="mst002-section-head">
        <div class="mst002-section-title">매장 목록</div>
        <div class="flex gap-2">
          <button type="button" class="mst002-action-btn mst002-action-btn--add" @click="addButton">
            <font-awesome-icon :icon="['fas', 'plus']" />
            추가
          </button>
          <button type="button" class="mst002-action-btn mst002-action-btn--del" @click="deleteButton">
            <font-awesome-icon :icon="['fas', 'trash']" />
            삭제
          </button>
        </div>
      </div>
      <div class="mst002-grid-wrap">
        <Realgrid
          class="h-full w-full"
          :progname="'MST01_002INS_VUE'"
          :progid="1"
          :rowData="rowData"
          @clickedRowData="clickedRowData3"
          @selcetedrowData="selcetedrowData"
          :selectionStyle="'singleRow'"
          :initFocus="initFocus"
          :labelingColumns="'lngSupervisor,lngSaleType,lngMultiPriceGroupCode,lngJoinType,lngSubLease,lngStoreAttr,lngStoreArea'"
          @updatedRowData2="updatedRowData"
          :valuesData="valuesData"
          :labelsData="labelsData"
          :deleteRow="deleted"
          :changeColid="changeColid"
          :changeRow="changeRow"
          :changeValue2="changeValue"
          :changeNow2="changeNow"
          @selectedIndex="selectedIndex2"
          @sendRowState="sendRowState"
          @allStateRows="allStateRows"
          :useCheckboxfordelete="true"
          :addRow4="addRow4"
          :addrowDefault="addrowDefault"
          :addrowProp="addrowProp"
          :addField="'new'"
          :rowStateeditable="false"
          :exporttoExcel="exExcel"
          :ExcelNm="exExcelNm" />
      </div>
    </div>

    <!-- 상세 입력 -->
    <div class="mst002-detail-panel min-h-0 min-w-0 w-full overflow-x-hidden overflow-y-auto px-1">
      <div class="mst002-section-title">매장 정보</div>
      <fieldset
        class="mst002-form-grid mt-2 w-full"
        :class="{ 'mst002-form-grid--locked': !detailReady }"
        :disabled="!detailReady">
        <div class="mst002-form-label mst002-form-label--required">*매장코드</div>
        <div class="mst002-form-value">
          <input
            type="text"
            id="storeCode"
            class="mst002-control"
            v-model="lngStoreCode"
            :disabled="!detailReady || rowstate != 'created'"
            name="lngStoreCode"
            @input="updateGridValue" />
        </div>
        <div class="mst002-form-label mst002-form-label--required">*매장명</div>
        <div class="mst002-form-value">
          <input
            type="text"
            class="mst002-control"
            v-model="strName"
            name="strName"
            @input="updateGridValue" />
        </div>
        <div class="mst002-form-label">사업자번호</div>
        <div class="mst002-form-value">
          <input
            type="text"
            class="mst002-control"
            v-model="strRegistNo"
            name="strRegistNo"
            @input="updateGridValue" />
        </div>

        <div class="mst002-form-label mst002-form-label--required">*가맹유형</div>
        <div class="mst002-form-value">
          <select
            class="mst002-control"
            v-model="lngJoinType"
            name="lngJoinType"
            @change="updateGridValue">
            <option value="-1">선택</option>
            <option
              v-for="item in lngJoinTypes"
              :key="item.lngCode"
              :value="item.lngCode">
              {{ item.strName }}
            </option>
          </select>
        </div>
        <div class="mst002-form-label mst002-form-label--required">*멀티단가 그룹</div>
        <div class="mst002-form-value">
          <select
            class="mst002-control"
            v-model="lngMultiPriceGroupCode"
            name="lngMultiPriceGroupCode"
            @change="updateGridValue">
            <option value="-1">선택</option>
            <option
              v-for="item in lngMultiPriceGroupCodes"
              :key="item.lngMultiPriceGroupCode"
              :value="item.lngMultiPriceGroupCode">
              {{ item.strMultiPriceGroupName }}
            </option>
          </select>
        </div>
        <div class="mst002-form-label mst002-grid-void" aria-hidden="true"></div>
        <div class="mst002-form-value mst002-grid-void" aria-hidden="true"></div>

        <div class="mst002-form-label mst002-form-label--required">*매장구분</div>
        <div class="mst002-form-value">
          <select
            class="mst002-control"
            v-model="lngStoreAttr"
            name="lngStoreAttr"
            @change="updateGridValue">
            <option value="-1">선택</option>
            <option
              v-for="item in lngStoreAttrs"
              :key="item.lngStoreAttr"
              :value="item.lngStoreAttr">
              {{ item.strName }}
            </option>
          </select>
        </div>
        <div class="mst002-form-label mst002-form-label--required">*매장유형</div>
        <div class="mst002-form-value">
          <select
            class="mst002-control"
            v-model="lngSubLease"
            name="lngSubLease"
            @change="updateGridValue">
            <option value="-1">선택</option>
            <option
              v-for="item in lngSubLeases"
              :key="item.lngCode"
              :value="item.lngCode">
              {{ item.strName }}
            </option>
          </select>
        </div>
        <div class="mst002-form-label mst002-form-label--required">*지역</div>
        <div class="mst002-form-value">
          <select
            class="mst002-control"
            v-model="lngStoreArea"
            name="lngStoreArea"
            @change="updateGridValue">
            <option value="-1">선택</option>
            <option
              v-for="item in lngStoreAreas"
              :key="item.lngStoreArea"
              :value="item.lngStoreArea">
              {{ item.strName }}
            </option>
          </select>
        </div>

        <div class="mst002-form-label">대표자명</div>
        <div class="mst002-form-value">
          <input
            type="text"
            class="mst002-control"
            v-model="strDirector"
            name="strDirector"
            @input="updateGridValue" />
        </div>
        <div class="mst002-form-label">업종</div>
        <div class="mst002-form-value">
          <input
            type="text"
            class="mst002-control"
            v-model="strDealType"
            name="strDealType"
            @input="updateGridValue" />
        </div>
        <div class="mst002-form-label">업태</div>
        <div class="mst002-form-value">
          <input
            type="text"
            class="mst002-control"
            v-model="strDealKind"
            name="strDealKind"
            @input="updateGridValue" />
        </div>

        <div class="mst002-form-label">오픈일자</div>
        <div class="mst002-form-value">
          <input
            type="date"
            v-model="dtmOpenDate"
            max="9999-12-31"
            name="dtmOpenDate"
            @input="updateGridValue"
            class="mst002-control" />
        </div>
        <div class="mst002-form-label">폐점일자</div>
        <div class="mst002-form-value">
          <input
            type="date"
            v-model="dtmStop"
            name="dtmStop"
            @input="updateGridValue"
            max="9999-12-31"
            class="mst002-control" />
        </div>
        <div class="mst002-form-label">변환코드</div>
        <div class="mst002-form-value">
          <input
            type="text"
            class="mst002-control"
            v-model="strConvCode"
            name="strConvCode"
            @input="updateGridValue" />
        </div>

        <div class="mst002-form-label">우편번호</div>
        <div class="mst002-form-value">
          <input
            type="text"
            class="mst002-control"
            v-model="strZipCode"
            name="strZipCode"
            @input="updateGridValue" />
        </div>
        <div class="mst002-form-label">주소</div>
        <div class="mst002-form-value">
          <input
            type="text"
            class="mst002-control"
            v-model="strAddress"
            name="strAddress"
            @input="updateGridValue" />
        </div>
        <div class="mst002-form-label">상세주소</div>
        <div class="mst002-form-value">
          <input
            type="text"
            class="mst002-control"
            v-model="strAddressEtc"
            name="strAddressEtc"
            @input="updateGridValue" />
        </div>

        <div class="mst002-form-label">전화번호</div>
        <div class="mst002-form-value">
          <input
            type="text"
            class="mst002-control"
            v-model="strTel"
            name="strTel"
            @input="updateGridValue" />
        </div>
        <div class="mst002-form-label">휴대폰번호</div>
        <div class="mst002-form-value">
          <input
            type="text"
            class="mst002-control"
            v-model="strPhone"
            name="strPhone"
            @input="updateGridValue" />
        </div>
        <div class="mst002-form-label">팩스번호</div>
        <div class="mst002-form-value">
          <input
            type="text"
            class="mst002-control"
            v-model="strFax"
            name="strFax"
            @input="updateGridValue" />
        </div>

        <div class="mst002-form-label">평수</div>
        <div class="mst002-form-value">
          <input
            type="number"
            class="mst002-control"
            v-model="lngFloorSpace"
            name="lngFloorSpace"
            @input="updateGridValue" />
        </div>
        <div class="mst002-form-label">임차조건</div>
        <div class="mst002-form-value">
          <input
            type="number"
            class="mst002-control"
            v-model="lngLease"
            name="lngLease"
            @input="updateGridValue" />
        </div>
        <div class="mst002-form-label">BEP</div>
        <div class="mst002-form-value">
          <input
            type="number"
            class="mst002-control"
            v-model="lngBEP"
            name="lngBEP"
            @input="updateGridValue" />
        </div>

        <div class="mst002-form-label">상권</div>
        <div class="mst002-form-value">
          <select
            class="mst002-control"
            v-model="lngSaleType"
            name="lngSaleType"
            @change="updateGridValue">
            <option value="-1">선택</option>
            <option value="0">없음</option>
            <option
              v-for="item in lngSaleTypes"
              :key="item.lngSaleType"
              :value="item.lngSaleType">
              {{ item.strSaleType }}
            </option>
          </select>
        </div>
        <div class="mst002-form-label">담당 S/C</div>
        <div class="mst002-form-value">
          <select
            class="mst002-control"
            v-model="lngSupervisor"
            name="lngSupervisor"
            @change="updateGridValue">
            <option value="-1">선택</option>
            <option
              v-for="item in lngSupervisors"
              :key="item.lngSupervisor"
              :value="item.lngSupervisor">
              {{ item.strName }}
            </option>
          </select>
        </div>
        <div class="mst002-form-label">배송기사명</div>
        <div class="mst002-form-value">
          <input
            type="text"
            class="mst002-control"
            v-model="strDev1"
            name="strDev1"
            @input="updateGridValue" />
        </div>

        <div class="mst002-form-label">좌석수</div>
        <div class="mst002-form-value">
          <input
            type="number"
            class="mst002-control"
            v-model="lngTable"
            name="lngTable"
            @input="updateGridValue" />
        </div>
        <div class="mst002-form-label">매장이력</div>
        <div class="mst002-form-value mst002-field-span3">
          <input
            type="text"
            class="mst002-control mst002-control--wide"
            v-model="strStoreHistory"
            name="strStoreHistory"
            @input="updateGridValue" />
        </div>
      </fieldset>
    </div>
  </div>
</template>

<script setup>
import { get_store_list, getGridInfoList } from "@/api/common";
import { getstoreInfo, saveStoreInfo } from "@/api/master";
/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
/**
 * 매장 공통 컴포넌트
 */

import PickStore from "@/components/pickStore.vue";
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
});

const result = ref([]);
const store = useStore();
const groupCd = ref();
const searchStoreName = ref("");
const disableStoreCode = ref(true);
/**
 * 추가 버튼 함수
 */

const addRow4 = ref(false);
const labelsData = ref([]);
const valuesData = ref([]);
const afterSearch = ref(false);
const storeType = ref("0");
const storeCd = ref("0");
const allstrore = ref(false);
/**
 * 페이지 매장 코드 세팅
 */

const handleStoreCd = (newValue) => {
  storeCd.value = newValue;
  //comsole.log(newValue);
  if (storeCd.value == 0) {
    allstrore.value = false;
  } else {
    allstrore.value = true;
    searchstore.value = "";
  }
};
const inputValue = ref("");
/**
 * 페이지 매장 그룹 세팅
 */

const handleStoreType = (newValue) => {
  storeType.value = newValue;
};
const handleGroupCd = (newValue) => {
  //comsole.log(newValue);
  groupCd.value = newValue;
};
const exExcel = ref(false);
const exExcelNm = ref("매장정보등록");
/**
 * 엑셀 Export 버튼
 */

const exportToExcel = () => {
  exExcel.value = !exExcel.value;
};
const searchstore = ref("");

const gridApi = ref();
const GridInfo_PROG_ID = "MST01_002INS_VUE";
const GridInfo_GRID_ID = "1";
// API 호출 (설정값 호출)
const tabInitSetArray = ref([]);
(async () => {
  try {
    const result = await getGridInfoList(GridInfo_PROG_ID, GridInfo_GRID_ID);
    tabInitSetArray.value = result;
  } catch (error) {
    //console.error("Failed to fetch data:", error); // 오류 로그 출력
  } finally {
  }
})();
const colDefs2 = ref([]);

const rowData = ref([]);
const lngMultiPriceGroupCodes = ref([]);

/**
 * 페이지 매장 분류 세팅
 */

const lngStoreAttrs = ref([]);
const initlngStoreAttr = ref(-1);
const lngJoinTypes = ref([]);
const initlngJoinType = ref(-1);
const lngSubLeases = ref([]);
const initlngSubLease = ref(-1);
const lngStoreAreas = ref([]);
const initlngStoreArea = ref(-1);
const lngSaleTypes = ref([]);
const initlngSaleType = ref(-1);
/**
 * 페이지 매장 슈퍼바이저 세팅
 */

const lngSupervisors = ref([]);
const initlngSupervisor = ref(-1);
const initlngMultiPriceGroupCode = ref(-1);

/**
 *  조회 함수
 */

/** 상세 폼 편집 가능 여부 — 행 선택 또는 신규 추가 후에만 true */
const detailReady = ref(false);

const clearDetailForm = () => {
  lngStoreCode.value = "";
  strName.value = "";
  strRegistNo.value = "";
  strDirector.value = "";
  strDealType.value = "";
  strDealKind.value = "";
  lngJoinType.value = "-1";
  lngSubLease.value = "-1";
  lngStoreAttr.value = "-1";
  lngStoreArea.value = "-1";
  dtmOpenDate.value = "";
  strTel.value = "";
  strFax.value = "";
  strZipCode.value = "";
  strAddress.value = "";
  strAddressEtc.value = "";
  strConvCode.value = "";
  strPhone.value = "";
  lngBEP.value = "";
  lngFloorSpace.value = "";
  lngLease.value = "";
  lngSupervisor.value = "-1";
  lngSaleType.value = "-1";
  dtmStop.value = "";
  strDev1.value = "";
  lngTable.value = "";
  lngMultiPriceGroupCode.value = "-1";
  strStoreHistory.value = "";
};

const lockDetailForm = () => {
  detailReady.value = false;
  rowstate.value = "none";
  changeRow.value = null;
  changeColid.value = "";
  changeValue.value = "";
  clearDetailForm();
};

const searchButton = async () => {
  lockDetailForm();

  lngMultiPriceGroupCodes.value = [];
  lngStoreAttrs.value = [];
  lngJoinTypes.value = [];
  lngSubLeases.value = [];
  lngStoreAreas.value = [];
  lngSaleTypes.value = [];
  lngSupervisors.value = [];
  valuesData.value = [];
  labelsData.value = [];

  try {
    store.dispatch("convertLoading", true);

    const res = await getstoreInfo(
      groupCd.value,
      storeType.value || "0",
      storeCd.value ?? "0",
      searchStoreName.value || ""
    );

  //comsole.log(res);
  lngJoinTypes.value = res.data.JOINTYPE;
  lngMultiPriceGroupCodes.value = res.data.STOREMULTI;
  lngStoreAttrs.value = res.data.STOREATTR;
  lngSubLeases.value = res.data.STORETYPE;
  lngStoreAreas.value = res.data.STOREAREA;
  lngSaleTypes.value = res.data.SALETYPE;
  lngSupervisors.value = res.data.SUPERVISOR;

  if (lngJoinTypes.value.length > 0) {
    initlngJoinType.value = lngJoinTypes.value[0].lngCode;
  }
  if (lngMultiPriceGroupCodes.value.length > 0) {
    initlngMultiPriceGroupCode.value =
      lngMultiPriceGroupCodes.value[0].lngMultiPriceGroupCode;
  }
  if (lngStoreAttrs.value.length > 0) {
    initlngStoreAttr.value = lngStoreAttrs.value[0].lngStoreAttr;
  }

  if (lngSubLeases.value.length > 0) {
    initlngSubLease.value = lngSubLeases.value[0].lngCode;
  }

  if (lngStoreAreas.value.length > 0) {
    initlngStoreArea.value = lngStoreAreas.value[0].lngStoreArea;
  }

  // if(lngSaleTypes.value.length >0){
  //   lngSaleType.value = lngSaleTypes.value[0].lngSaleType

  // }
  // if(lngSupervisors.value.length >0){
  //   lngSupervisor.value = lngSupervisors.value[0].lngSupervisor

  // }

  // labelsData.value.push()
  // valuesData
  //comsole.log(lngSupervisors.value);
  //comsole.log(lngSaleTypes.value);
  //comsole.log(lngMultiPriceGroupCodes.value);
  let sublabelarr = [];
  let subvaluearr = [];
  for (var i = 0; i < lngSupervisors.value.length; i++) {
    sublabelarr.push(lngSupervisors.value[i].strName);
    subvaluearr.push(lngSupervisors.value[i].lngSupervisor);
  }
  sublabelarr.push(" ");
  subvaluearr.push(-1);
  sublabelarr.push(" ");
  subvaluearr.push(0);
  labelsData.value.push(sublabelarr);
  valuesData.value.push(subvaluearr);
  sublabelarr = [];
  subvaluearr = [];
  for (var i = 0; i < lngSaleTypes.value.length; i++) {
    sublabelarr.push(lngSaleTypes.value[i].strSaleType);
    subvaluearr.push(lngSaleTypes.value[i].lngSaleType);
  }
  sublabelarr.push("없음");
  subvaluearr.push(0);
  sublabelarr.push(" ");
  subvaluearr.push(-1);
  labelsData.value.push(sublabelarr);
  valuesData.value.push(subvaluearr);
  sublabelarr = [];
  subvaluearr = [];
  for (var i = 0; i < lngMultiPriceGroupCodes.value.length; i++) {
    sublabelarr.push(lngMultiPriceGroupCodes.value[i].strMultiPriceGroupName);
    subvaluearr.push(lngMultiPriceGroupCodes.value[i].lngMultiPriceGroupCode);
  }
  sublabelarr.push(" ");
  subvaluearr.push(-1);
  labelsData.value.push(sublabelarr);
  valuesData.value.push(subvaluearr);

  sublabelarr = [];
  subvaluearr = [];
  for (var i = 0; i < lngJoinTypes.value.length; i++) {
    sublabelarr.push(lngJoinTypes.value[i].strName);
    subvaluearr.push(lngJoinTypes.value[i].lngCode);
  }
  sublabelarr.push(" ");
  subvaluearr.push(-1);
  sublabelarr.push(" ");
  subvaluearr.push(0);
  labelsData.value.push(sublabelarr);
  valuesData.value.push(subvaluearr);

  sublabelarr = [];
  subvaluearr = [];
  for (var i = 0; i < lngSubLeases.value.length; i++) {
    sublabelarr.push(lngSubLeases.value[i].strName);
    subvaluearr.push(lngSubLeases.value[i].lngCode);
  }
  sublabelarr.push(" ");
  subvaluearr.push(-1);
  labelsData.value.push(sublabelarr);
  valuesData.value.push(subvaluearr);

  sublabelarr = [];
  subvaluearr = [];
  for (var i = 0; i < lngStoreAttrs.value.length; i++) {
    sublabelarr.push(lngStoreAttrs.value[i].strName);
    subvaluearr.push(lngStoreAttrs.value[i].lngStoreAttr);
  }
  sublabelarr.push(" ");
  subvaluearr.push(-1);
  sublabelarr.push(" ");
  subvaluearr.push(0);
  labelsData.value.push(sublabelarr);
  valuesData.value.push(subvaluearr);

  sublabelarr = [];
  subvaluearr = [];
  for (var i = 0; i < lngStoreAreas.value.length; i++) {
    sublabelarr.push(lngStoreAreas.value[i].strName);
    subvaluearr.push(lngStoreAreas.value[i].lngStoreArea);
  }
  sublabelarr.push(" ");
  subvaluearr.push(-1);
  sublabelarr.push(" ");
  subvaluearr.push(0);
  labelsData.value.push(sublabelarr);
  valuesData.value.push(subvaluearr);

  //comsole.log(labelsData.value);
  //comsole.log(valuesData.value);
  rowData.value = res.data.store;
  updateRowData.value = JSON.parse(JSON.stringify(rowData.value));
  afterSearch.value = true;
  //comsole.log(lngStoreArea.value);
  } catch (error) {
    afterSearch.value = false;
    Swal.fire({
      title: "조회 실패",
      text: "매장 정보 조회 중 오류가 발생했습니다.",
      icon: "error",
      confirmButtonText: "확인",
    });
  } finally {
    lockDetailForm();
    store.dispatch("convertLoading", false);
  }
};

const deleted = ref(false);

/**
 * 삭제 버튼
 */

const deleteButton = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 진행해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  deleted.value = !deleted.value;
};
const addrowDefault = ref("");
const addrowProp = ref("");
/**
 *  추가 버튼
 */

const addButton = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 진행해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  addrowProp.value = `lngStoreCode,strName,strRegistNo,strDirector,strDealType,strDealKind,lngJoinType,lngSubLease,lngStoreAttr,lngStoreArea,dtmOpenDate,strTel,strFax,strZipCode,strAddress,strAddressEtc,strConvCode,strPhone,lngBEP,lngFloorSpace,lngLease,lngSupervisor,lngSaleType,dtmStop,strDev1,lngTable,lngMultiPriceGroupCode,strStoreHistory`;
  const currdate = new Date().toISOString().split("T")[0];
  addrowDefault.value =
    `,,,,,,` +
    initlngJoinType.value +
    `,` +
    initlngSubLease.value +
    `,` +
    initlngStoreAttr.value +
    `,` +
    initlngStoreArea.value +
    `,` +
    currdate +
    `,,,,,,,,,,,-1,-1,9999-12-31,,,` +
    initlngMultiPriceGroupCode.value +
    `, ,`;

  addRow4.value = !addRow4.value;
};

/**
 *  저장 버튼 함수
 */

const saveButton = async () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 진행해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  if (JSON.stringify(updateRowData.value) === JSON.stringify(rowData.value)) {
    Swal.fire({
      title: "경고",
      text: "변경된 사항이 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  console.log(updateRowData.value);

  const validateRow = updateRowData.value.filter(
    (item) =>
      item.strName == "" ||
      item.strName == " " ||
      item.strName == undefined ||
      item.lngStoreCode == "" ||
      item.lngStoreCode == " " ||
      item.lngStoreCode == undefined ||
      item.lngMultiPriceGroupCode == undefined ||
      item.lngMultiPriceGroupCode == "-1" ||
      item.lngJoinType == "-1" ||
      item.lngSubLease == "-1" ||
      item.lngStoreArea == "-1"
  ).length;
  if (validateRow > 0) {
    Swal.fire({
      title: "경고",
      text: "필수값이 누락되었습니다. 확인해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  const validateRow2 =
    new Set(updateRowData.value.map((item) => item.lngStoreCode)).size !==
    updateRowData.value.length;
  if (validateRow2 == true) {
    Swal.fire({
      title: "경고",
      text: "이미 등록되어 있는 매장코드입니다. 다른 숫자를 입력해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  Swal.fire({
    title: "저장",
    text: "저장 하시겠습니까?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "저장",
    cancelButtonText: "취소",
  }).then(async (result) => {
    if (result.isConfirmed) {
      store.state.loading = true;
      try {
        //comsole.log(updateRowData.value);
        const deleteStore = updateRowData.value
          .filter((item, index) => allstaterows.value.deleted.includes(index))
          .map((item) => item.lngStoreCode);
        const updateStoreCd = updateRowData.value
          .filter((item, index) => allstaterows.value.updated.includes(index))
          .map((item) => item.lngStoreCode);
        const updateStoreNm = updateRowData.value
          .filter((item, index) => allstaterows.value.updated.includes(index))
          .map((item) => item.strName);
        const updatestrRegistNo = updateRowData.value
          .filter((item, index) => allstaterows.value.updated.includes(index))
          .map((item) => item.strRegistNo);
        const updatestrDirector = updateRowData.value
          .filter((item, index) => allstaterows.value.updated.includes(index))
          .map((item) => item.strDirector);
        const updatestrDealType = updateRowData.value
          .filter((item, index) => allstaterows.value.updated.includes(index))
          .map((item) => item.strDealType);
        const updatestrDealKind = updateRowData.value
          .filter((item, index) => allstaterows.value.updated.includes(index))
          .map((item) => item.strDealKind);
        const updatelngJoinType = updateRowData.value
          .filter((item, index) => allstaterows.value.updated.includes(index))
          .map((item) => item.lngJoinType);
        const updatelngSubLease = updateRowData.value
          .filter((item, index) => allstaterows.value.updated.includes(index))
          .map((item) => item.lngSubLease);
        const updatelngStoreAttr = updateRowData.value
          .filter((item, index) => allstaterows.value.updated.includes(index))
          .map((item) => item.lngStoreAttr);
        const updatelngStoreArea = updateRowData.value
          .filter((item, index) => allstaterows.value.updated.includes(index))
          .map((item) => item.lngStoreArea);
        const updatedtmOpenDate = updateRowData.value
          .filter((item, index) => allstaterows.value.updated.includes(index))
          .map((item) => item.dtmOpenDate);
        const updatedtmStop = updateRowData.value
          .filter((item, index) => allstaterows.value.updated.includes(index))
          .map((item) => item.dtmStop);
        const updatestrConvCode = updateRowData.value
          .filter((item, index) => allstaterows.value.updated.includes(index))
          .map((item) => item.strConvCode);
        const updatestrZipCode = updateRowData.value
          .filter((item, index) => allstaterows.value.updated.includes(index))
          .map((item) => item.strZipCode);
        const updatestrAddress = updateRowData.value
          .filter((item, index) => allstaterows.value.updated.includes(index))
          .map((item) => item.strAddress);
        const updatestrAddressETC = updateRowData.value
          .filter((item, index) => allstaterows.value.updated.includes(index))
          .map((item) => item.strAddressEtc);
        const updatestrTel = updateRowData.value
          .filter((item, index) => allstaterows.value.updated.includes(index))
          .map((item) => item.strTel);
        const updatestrPhone = updateRowData.value
          .filter((item, index) => allstaterows.value.updated.includes(index))
          .map((item) => item.strPhone);
        const updatestrFax = updateRowData.value
          .filter((item, index) => allstaterows.value.updated.includes(index))
          .map((item) => item.strFax);
        const updatelngFloorSpace = updateRowData.value
          .filter((item, index) => allstaterows.value.updated.includes(index))
          .map((item) => item.lngFloorSpace);
        const updatelngLease = updateRowData.value
          .filter((item, index) => allstaterows.value.updated.includes(index))
          .map((item) => item.lngLease);
        const updatelngBEP = updateRowData.value
          .filter((item, index) => allstaterows.value.updated.includes(index))
          .map((item) => item.lngBEP);
        const updatelngSaleType = updateRowData.value
          .filter((item, index) => allstaterows.value.updated.includes(index))
          .map((item) => item.lngSaleType);
        const updatelngSupervisor = updateRowData.value
          .filter((item, index) => allstaterows.value.updated.includes(index))
          .map((item) => item.lngSupervisor);
        const updatestrDev1 = updateRowData.value
          .filter((item, index) => allstaterows.value.updated.includes(index))
          .map((item) => item.strDev1);
        const updatelngTable = updateRowData.value
          .filter((item, index) => allstaterows.value.updated.includes(index))
          .map((item) => item.lngTable);
        const updatestrStoreHistory = updateRowData.value
          .filter((item, index) => allstaterows.value.updated.includes(index))
          .map((item) => item.strStoreHistory);
        const updatelngMultiPriceGroupCode = updateRowData.value
          .filter((item, index) => allstaterows.value.updated.includes(index))
          .map((item) => item.lngMultiPriceGroupCode);

        const insertStoreCd = updateRowData.value
          .filter((item, index) => allstaterows.value.created.includes(index))
          .map((item) => item.lngStoreCode);
        const insertStoreNm = updateRowData.value
          .filter((item, index) => allstaterows.value.created.includes(index))
          .map((item) => item.strName);
        const insertstrRegistNo = updateRowData.value
          .filter((item, index) => allstaterows.value.created.includes(index))
          .map((item) => item.strRegistNo);
        const insertstrDirector = updateRowData.value
          .filter((item, index) => allstaterows.value.created.includes(index))
          .map((item) => item.strDirector);
        const insertstrDealType = updateRowData.value
          .filter((item, index) => allstaterows.value.created.includes(index))
          .map((item) => item.strDealType);
        const insertstrDealKind = updateRowData.value
          .filter((item, index) => allstaterows.value.created.includes(index))
          .map((item) => item.strDealKind);
        const insertlngJoinType = updateRowData.value
          .filter((item, index) => allstaterows.value.created.includes(index))
          .map((item) => item.lngJoinType);
        const insertlngSubLease = updateRowData.value
          .filter((item, index) => allstaterows.value.created.includes(index))
          .map((item) => item.lngSubLease);
        const insertlngStoreAttr = updateRowData.value
          .filter((item, index) => allstaterows.value.created.includes(index))
          .map((item) => item.lngStoreAttr);
        const insertlngStoreArea = updateRowData.value
          .filter((item, index) => allstaterows.value.created.includes(index))
          .map((item) => item.lngStoreArea);
        const insertedtmOpenDate = updateRowData.value
          .filter((item, index) => allstaterows.value.created.includes(index))
          .map((item) => item.dtmOpenDate);
        const insertedtmStop = updateRowData.value
          .filter((item, index) => allstaterows.value.created.includes(index))
          .map((item) => item.dtmStop);
        const insertstrConvCode = updateRowData.value
          .filter((item, index) => allstaterows.value.created.includes(index))
          .map((item) => item.strConvCode);
        const insertstrZipCode = updateRowData.value
          .filter((item, index) => allstaterows.value.created.includes(index))
          .map((item) => item.strZipCode);
        const insertstrAddress = updateRowData.value
          .filter((item, index) => allstaterows.value.created.includes(index))
          .map((item) => item.strAddress);
        const insertstrAddressETC = updateRowData.value
          .filter((item, index) => allstaterows.value.created.includes(index))
          .map((item) => item.strAddressEtc);
        const insertstrTel = updateRowData.value
          .filter((item, index) => allstaterows.value.created.includes(index))
          .map((item) => item.strTel);
        const insertstrPhone = updateRowData.value
          .filter((item, index) => allstaterows.value.created.includes(index))
          .map((item) => item.strPhone);
        const insertstrFax = updateRowData.value
          .filter((item, index) => allstaterows.value.created.includes(index))
          .map((item) => item.strFax);
        const insertlngFloorSpace = updateRowData.value
          .filter((item, index) => allstaterows.value.created.includes(index))
          .map((item) => item.lngFloorSpace);
        const insertlngLease = updateRowData.value
          .filter((item, index) => allstaterows.value.created.includes(index))
          .map((item) => item.lngLease);
        const insertlngBEP = updateRowData.value
          .filter((item, index) => allstaterows.value.created.includes(index))
          .map((item) => item.lngBEP);
        const insertlngSaleType = updateRowData.value
          .filter((item, index) => allstaterows.value.created.includes(index))
          .map((item) => item.lngSaleType);
        const insertlngSupervisor = updateRowData.value
          .filter((item, index) => allstaterows.value.created.includes(index))
          .map((item) => item.lngSupervisor);
        const insertstrDev1 = updateRowData.value
          .filter((item, index) => allstaterows.value.created.includes(index))
          .map((item) => item.strDev1);
        const insertlngTable = updateRowData.value
          .filter((item, index) => allstaterows.value.created.includes(index))
          .map((item) => item.lngTable);
        const insertstrStoreHistory = updateRowData.value
          .filter((item, index) => allstaterows.value.created.includes(index))
          .map((item) => item.strStoreHistory);
        const insertlngMultiPriceGroupCode = updateRowData.value
          .filter((item, index) => allstaterows.value.created.includes(index))
          .map((item) => item.lngMultiPriceGroupCode);

        const id = store.state.userData.strUserID;

        //comsole.log(updatelngLease);
        const res = await saveStoreInfo(
          id,
          groupCd.value,
          deleteStore.join(","),

          // update 변수들
          updateStoreCd.join(","),
          updateStoreNm.join(","),
          updatestrRegistNo.join(","),
          updatestrDirector.join(","),
          updatestrDealType.join(","),
          updatestrDealKind.join(","),
          updatelngJoinType.join(","),
          updatelngSubLease.join(","),
          updatelngStoreAttr.join(","),
          updatelngStoreArea.join(","),
          updatedtmOpenDate.join(","),
          updatedtmStop.join(","),
          updatestrConvCode.join(","),
          updatestrZipCode.join(","),
          updatestrAddress.join(","),
          updatestrAddressETC.join(","),
          updatestrTel.join(","),
          updatestrPhone.join(","),
          updatestrFax.join(","),
          updatelngFloorSpace.join(","),
          updatelngLease.join(","),
          updatelngBEP.join(","),
          updatelngSaleType.join(","),
          updatelngSupervisor.join(","),
          updatestrDev1.join(","),
          updatelngTable.join(","),
          updatestrStoreHistory.join(","),
          updatelngMultiPriceGroupCode.join(","),
          // insert 변수들
          insertStoreCd.join(","),
          insertStoreNm.join(","),
          insertstrRegistNo.join(","),
          insertstrDirector.join(","),
          insertstrDealType.join(","),
          insertstrDealKind.join(","),
          insertlngJoinType.join(","),
          insertlngSubLease.join(","),
          insertlngStoreAttr.join(","),
          insertlngStoreArea.join(","),
          insertedtmOpenDate.join(","),
          insertedtmStop.join(","),
          insertstrConvCode.join(","),
          insertstrZipCode.join(","),
          insertstrAddress.join(","),
          insertstrAddressETC.join(","),
          insertstrTel.join(","),
          insertstrPhone.join(","),
          insertstrFax.join(","),
          insertlngFloorSpace.join(","),
          insertlngLease.join(","),
          insertlngBEP.join(","),
          insertlngSaleType.join(","),
          insertlngSupervisor.join(","),
          insertstrDev1.join(","),
          insertlngTable.join(","),
          insertstrStoreHistory.join(","),
          insertlngMultiPriceGroupCode.join(",")
        );
        //comsole.log(res);

        const response2 = await get_store_list(
          store.state.userData.lngStoreGroup,
          store.state.userData.lngPositionType,
          store.state.userData.blnBrandAdmin == "False" ? 0 : 1,
          store.state.userData.lngPosition,
          store.state.userData.lngJoinType,
          store.state.userData.lngTeamCode,
          store.state.userData.lngSupervisor
        );

        //comsole.log(response2.data);

        const result0 = response2.data.storeGroup;
        const result1 = response2.data.storeAttr;
        const result2 = response2.data.store;
        const result3 = response2.data.storeSupervisorTeam;
        const result4 = response2.data.storeSupervisor;
        const result5 = response2.data.storeArea;

        store.dispatch("StoreGroup", result0);
        store.dispatch("StoreType", result1);
        store.dispatch("StoreCd", result2);
        store.dispatch("StoreTeamCode", result3);
        store.dispatch("StoreSupervisor", result4);
        store.dispatch("StoreAreaCd", result5);

        Swal.fire({
          title: "저장 되었습니다.",
          confirmButtonText: "확인",
        });
      } catch (error) {
        Swal.fire({
          title: "저장이 실패되었습니다.",
          confirmButtonText: "확인",
        });
      } finally {
        store.state.loading = false;
        searchButton();
      }
    }
  });
};

/**
 * 수정용 데이터 행 설정
 */

const selectedIndex2 = (e) => {
  changeRow.value = e;
};
/**
 * 데이터셋 상세정보 셋팅
 */

const clickedRowData3 = (newValue) => {
  //comsole.log(newValue);
  //comsole.log(rowData.value);
  detailReady.value = true;
  lngStoreCode.value = newValue[0]; // 1 -> 0
  strName.value = newValue[1]; // 2 -> 1
  strRegistNo.value = newValue[2]; // 3 -> 2
  strDirector.value = newValue[3]; // 4 -> 3
  strDealType.value = newValue[4]; // 5 -> 4
  strDealKind.value = newValue[5]; // 6 -> 5
  lngJoinType.value = newValue[6]; // 7 -> 6
  lngSubLease.value = newValue[8]; // 9 -> 8
  lngStoreAttr.value = newValue[10]; // 11 -> 10
  lngStoreArea.value = newValue[12]; // 13 -> 12
  dtmOpenDate.value = newValue[14]; // 15 -> 14
  strTel.value = newValue[15]; // 16 -> 15
  strFax.value = newValue[16]; // 17 -> 16
  strZipCode.value = newValue[17]; // 18 -> 17
  strAddress.value = newValue[18]; // 19 -> 18
  strAddressEtc.value = newValue[19]; // 20 -> 19
  strConvCode.value = newValue[20]; // 21 -> 20
  strPhone.value = newValue[21]; // 22 -> 21
  lngBEP.value = newValue[22]; // 23 -> 22
  lngFloorSpace.value = newValue[23]; // 24 -> 23
  lngLease.value = newValue[24]; // 25 -> 24
  lngSupervisor.value = newValue[25]; // 26 -> 25
  lngSaleType.value = newValue[26]; // 27 -> 26
  dtmStop.value = newValue[27]; // 28 -> 27
  strDev1.value = newValue[28]; // 29 -> 28
  lngTable.value = newValue[29]; // 30 -> 29
  lngMultiPriceGroupCode.value = newValue[30]; // 31 -> 30
  strStoreHistory.value = newValue[31]; // 32 -> 31

  if (newValue[33] == true) {
    disableStoreCode.value = false;
  } else {
    disableStoreCode.value = true;
  }
};
/**
 * 페이지 매장 코드 세팅
 */

const lngStoreCode = ref();
const strName = ref();
const strRegistNo = ref();
const strDirector = ref();
const strDealType = ref();
const strDealKind = ref();
const lngJoinType = ref();
const lngSubLease = ref(" ");
/**
 * 페이지 매장 분류 세팅
 */

const lngStoreAttr = ref();
const lngStoreArea = ref();
const dtmOpenDate = ref("");
const strTel = ref();
const strFax = ref();
const strZipCode = ref();
const strAddress = ref();
const strAddressEtc = ref();
const strConvCode = ref();
const strPhone = ref();
const lngBEP = ref();
const lngFloorSpace = ref();
const lngLease = ref();
const lngSaleType = ref();
/**
 * 페이지 매장 슈퍼바이저 세팅
 */

const lngSupervisor = ref();
const dtmStop = ref("");
const strDev1 = ref();
const strStoreHistory = ref();
const lngTable = ref();
const lngMultiPriceGroupCode = ref();

const changeValue = ref();
const changeRow = ref();
const changeColid = ref();
const changeNow = ref(false);
const updateGridValue = (e) => {
  if (!detailReady.value) {
    return;
  }
  if (changeRow.value === null || changeRow.value === undefined || changeRow.value === "") {
    return;
  }
  const name = e.target.name;
  const value = e.target.value;

  changeColid.value = name;
  changeValue.value = value;
  changeNow.value = !changeNow.value;
};
const updateRowData = ref([]);

/**
 * 입력창 수정 데이터 갱신
 */

const updatedRowData = (newvalue) => {
  updateRowData.value = newvalue;
  console.log(newvalue);
};

watch(dtmOpenDate, () => {
  //comsole.log(dtmOpenDate.value);
});
watch(dtmStop, () => {
  //comsole.log(dtmStop.value);
});

const rowstate = ref("none");
const sendRowState = (e) => {
  rowstate.value = e;
  if (e === "created") {
    detailReady.value = true;
  }
};

const allstaterows = ref([]);
const allStateRows = (e) => {
  allstaterows.value = e;
  console.log(e);
};
</script>

<style scoped>
/* 조회 AREA */
.mst002-search-panel {
  --mst002-panel-pad-x: 2rem;
  --mst002-col-gap: 1.5rem;
  --mst002-item-gap: 0.75rem;
  --mst002-label-col: 6.5rem;
  --mst002-row-min-h: 2rem;
  --mst002-control-h: 2rem;
  --mst002-control-border: #cbd5e1;
  --mst002-control-focus-border: #3b82f6;
  --mst002-control-radius: 0.375rem;
  box-sizing: border-box;
  padding-left: 0;
  padding-right: 0;
  padding-block: 0.75rem;
}

.mst002-search-grid {
  display: grid;
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  align-items: center;
  grid-template-columns: minmax(0, 1fr);
  max-width: 58rem;
  column-gap: var(--mst002-col-gap);
  padding-left: var(--mst002-panel-pad-x);
  padding-right: var(--mst002-panel-pad-x);
}

.mst002-cell {
  display: flex;
  min-width: 0;
  min-height: var(--mst002-row-min-h);
  align-items: center;
  gap: var(--mst002-item-gap);
}

.mst002-sg-label {
  flex: 0 0 var(--mst002-label-col);
  width: var(--mst002-label-col);
  min-height: var(--mst002-row-min-h);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
  color: rgb(17 24 39);
}

.mst002-cell-field {
  min-width: 0;
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  width: 100%;
}

.mst002-pick-slot :deep(> .flex) {
  width: 100%;
  min-width: 0;
  margin-left: 0 !important;
  gap: 0.5rem !important;
}

.mst002-pick-slot :deep(> .flex > div.shrink-0.font-semibold) {
  display: none !important;
}

/* 1번째(그룹) 현재 5.75rem → 2배, 2번째(속성) 동일 */
.mst002-pick-slot :deep(#storeGroup) {
  width: 11.5rem !important;
  min-width: 11.5rem !important;
  max-width: 11.5rem !important;
}

.mst002-pick-slot :deep(> .flex > div:has(> select:not(#storeGroup)) > select),
.mst002-pick-slot :deep(> .flex > div > select:not(#storeGroup)) {
  width: 11.5rem !important;
  min-width: 11.5rem !important;
  max-width: 11.5rem !important;
}

/* 3번째(매장) 현재 12rem → 1.3배 */
.mst002-pick-slot :deep(> .flex > div:has(.pickstore-vs-shell)),
.mst002-pick-slot :deep(> .flex > div.relative.min-w-0.flex-1) {
  flex: 0 0 15.6rem !important;
  width: 15.6rem !important;
  max-width: 15.6rem !important;
}

.mst002-pick-slot :deep(select),
.mst002-pick-slot :deep(.pickstore-vs-shell) {
  box-sizing: border-box;
  height: var(--mst002-control-h) !important;
  min-height: var(--mst002-control-h) !important;
  max-height: var(--mst002-control-h) !important;
  border: 1px solid var(--mst002-control-border) !important;
  border-radius: var(--mst002-control-radius) !important;
}

.mst002-pick-slot :deep(.pickstore-vs-shell) {
  width: 100% !important;
  max-width: 100% !important;
}

.mst002-grid-section {
  display: flex;
  flex-direction: column;
  flex: 1 1 0;
  min-height: 10rem;
  min-width: 0;
}

.mst002-section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.375rem;
  min-height: 1.75rem;
}

.mst002-section-title {
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.4rem;
  color: #111827;
}

.mst002-grid-wrap {
  flex: 1 1 0;
  min-height: 9rem;
  overflow: hidden;
}

.mst002-sub-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 1.875rem;
  padding: 0 0.875rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #374151;
  border: 1px solid #6b7280;
  border-radius: 0.375rem;
  background: #fff;
  cursor: pointer;
}

.mst002-sub-btn:hover {
  background: #eff6ff;
  border-color: #60a5fa;
  color: #1d4ed8;
}

.mst002-action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  height: 2rem;
  min-width: 4.25rem;
  padding: 0 1rem;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1;
  border: 1px solid #6b7280;
  border-radius: 0.375rem;
  color: #374151;
  background: #fff;
  cursor: pointer;
  box-shadow: 0 1px 2px rgb(15 23 42 / 10%);
}

.mst002-action-btn--add:hover {
  background: #eff6ff;
  border-color: #60a5fa;
  color: #1d4ed8;
}

.mst002-action-btn--del:hover {
  background: #fef2f2;
  border-color: #ef4444;
  color: #dc2626;
}

/* 상세 폼 — MST01_003 / MST42 톤, 3쌍(6열) */
.mst002-detail-panel {
  flex: 0 0 auto;
  margin-top: 0.75rem;
  --mst002-label-col: 6.75rem;
  --mst002-control-border: #cbd5e1;
  --mst002-control-focus-border: #3b82f6;
  --mst002-control-h: 1.5rem;
  --mst002-control-radius: 0.375rem;
  --mst002-detail-font: 0.8125rem;
  --mst002-detail-row-h: 2rem;
  --mst002-detail-cell-py: 0.25rem;
}

.mst002-form-grid {
  display: grid;
  margin: 0;
  min-inline-size: 0;
  padding: 0;
  grid-template-columns:
    var(--mst002-label-col) minmax(0, 1fr)
    var(--mst002-label-col) minmax(0, 1fr)
    var(--mst002-label-col) minmax(0, 1fr);
  grid-auto-rows: var(--mst002-detail-row-h);
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  overflow: hidden;
  background: #fff;
}

.mst002-form-grid--locked {
  pointer-events: none;
  opacity: 0.72;
}

.mst002-form-grid--locked .mst002-control,
.mst002-form-grid:disabled .mst002-control {
  background: #f3f4f6;
  color: #6b7280;
  cursor: not-allowed;
}

.mst002-form-grid > * {
  box-sizing: border-box;
  min-height: var(--mst002-detail-row-h);
  align-self: stretch;
}

.mst002-form-label {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--mst002-detail-cell-py) 0.375rem;
  border: 1px solid #e5e7eb;
  background: #edf2f7;
  color: #5c5c5c;
  font-size: var(--mst002-detail-font);
  font-weight: 600;
  text-align: center;
  word-break: keep-all;
}

.mst002-form-label--required {
  color: #2563eb;
  font-weight: 700;
}

.mst002-form-value {
  display: flex;
  align-items: center;
  min-width: 0;
  padding: var(--mst002-detail-cell-py) 0.375rem;
  border: 1px solid #e5e7eb;
  background: #fff;
}

.mst002-field-span3 {
  grid-column: span 3;
  min-width: 0;
}

.mst002-grid-void {
  border: none !important;
  background: transparent !important;
  visibility: hidden;
  pointer-events: none;
  padding: 0 !important;
}

.mst002-control {
  box-sizing: border-box;
  height: var(--mst002-control-h);
  min-height: var(--mst002-control-h);
  max-height: var(--mst002-control-h);
  width: 60%;
  max-width: 60%;
  min-width: 0;
  border-radius: var(--mst002-control-radius);
  border: 1px solid var(--mst002-control-border);
  background: #fff;
  padding: 0 0.5rem;
  font-size: var(--mst002-detail-font);
  line-height: 1;
}

.mst002-control--wide {
  width: 100%;
  max-width: 100%;
}

.mst002-control:focus,
.mst002-control:focus-visible {
  border-color: var(--mst002-control-focus-border);
  outline: none;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.25);
}

.mst002-control:disabled {
  background: #f3f4f6;
  color: #374151;
}

@media (max-width: 1100px) {
  .mst002-form-grid {
    grid-template-columns:
      var(--mst002-label-col) minmax(0, 1fr)
      var(--mst002-label-col) minmax(0, 1fr);
  }

  .mst002-field-span3 {
    grid-column: span 1;
  }

  .mst002-grid-void {
    display: none;
  }
}

@media (max-width: 700px) {
  .mst002-form-grid {
    grid-template-columns: var(--mst002-label-col) minmax(0, 1fr);
  }
}

@media (max-height: 900px) {
  .mst002-detail-panel {
    --mst002-detail-row-h: 1.875rem;
    --mst002-control-h: 1.375rem;
    margin-top: 0.625rem;
    max-height: 42vh;
  }

  .mst002-section-title {
    font-size: 1.0625rem;
  }
}

@media (min-width: 1280px) {
  .mst002-search-panel {
    --mst002-panel-pad-x: 2.5rem;
  }
}

@media (min-width: 1536px) {
  .mst002-search-panel {
    --mst002-panel-pad-x: 3rem;
  }
}
</style>
