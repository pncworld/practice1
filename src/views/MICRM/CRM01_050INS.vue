<!-- /*--############################################################################
# Filename : CRM01_050INS.vue                                                  
# Description : 고객관리 > 직원후불 마스터 > 직원후불 고객정보관리(050)            
# Date :2025-07-09                                                             
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <div
    class="crm050-page box-border flex h-full max-w-full min-h-0 flex-col gap-2 overflow-hidden pb-1">
    <div
      class="flex shrink-0 flex-wrap items-center justify-between gap-3 overflow-y-hidden">
    <PageName></PageName>
      <div class="mr-9 flex flex-wrap items-center justify-end gap-2 pr-5">
      <button
        @click="receiveButton"
        class="button received !w-44 !text-nowrap"
        v-if="disableButton">
        수동고객정보수신
      </button>
        <button @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <button
          type="button"
          @click="addButton"
          class="button new md:w-auto w-14"
          :disabled="disableButton">
          추가
        </button>
        <button
          @click="saveButton"
          class="button save md:w-auto w-14"
          :disabled="disableButton">
        저장
      </button>
        <button
          type="button"
          @click="deleteButton"
          class="button delete md:w-auto w-14"
          :disabled="disableButton">
          삭제
        </button>
        <button @click="exportToExcel" class="button excel md:w-auto w-14">
          엑셀
        </button>
    </div>
  </div>

    <div class="crm050-search-bar mt-3 w-full shrink-0 rounded-lg bg-gray-200 py-2">
      <div class="crm050-search-group crm050-search-group--cust">
        <span class="crm050-search-label">고객사명</span>
        <div class="crm050-search-field min-w-0">
    <PickCustCompany
            :setAPI="'2'"
            omit-label
            filter-bar-align
      @excelStore="excelStore"
      @lngIFChk="lngIFChk"
      @BP_ID="BP_ID"
      @lngStoreCode="setCompanyCode"></PickCustCompany>
        </div>
      </div>
      <div class="crm050-search-group crm050-search-group--affiliate">
        <span class="crm050-search-label">소속사</span>
        <select
          class="crm050-search-control crm050-search-control--affiliate"
          v-model="affiliateCompCode"
          :disabled="affiliateCompLocked"
          @change="onTopAffiliateChange">
          <option
            v-for="item in affiliateCompList"
            :key="item.value"
            :value="item.value">
            {{ item.label }}
          </option>
        </select>
      </div>
      <div class="crm050-search-group crm050-search-group--cond">
        <span class="crm050-search-label">조회조건</span>
        <div class="crm050-search-field crm050-search-field--pair min-w-0">
          <select
            class="crm050-search-control crm050-search-control--cond"
          v-model="cond">
          <option value="1">카드번호</option>
          <option value="2">사원번호</option>
          <option value="3">사원명</option>
          <option value="4">부서명</option>
          <option value="5">소속사명</option>
        </select>
        <input
          type="text"
            class="crm050-search-control crm050-search-control--grow"
          v-model="cond2" />
      </div>
        </div>
      <div class="crm050-search-group crm050-search-group--checks">
        <div class="crm050-search-checks-grid">
          <label class="crm050-search-check" for="crm01-050-fire"
            ><input
              type="checkbox"
              v-model="cond3"
              id="crm01-050-fire" />퇴사자 제외</label
          >
          <label class="crm050-search-check" for="crm01-050-leave"
            ><input
              type="checkbox"
              v-model="condLeave"
              id="crm01-050-leave" />휴직자 제외</label
          >
          <label class="crm050-search-check" for="crm01-050-lost"
            ><input
              type="checkbox"
              v-model="cond4"
              id="crm01-050-lost" />분실/교체 제외</label
          >
        </div>
      </div>
    </div>

    <!-- 그리드: 고정 높이로 항상 표시 (013INS 동일) -->
    <div class="h-[32vh] min-h-[11rem] w-full shrink-0 px-2">
    <Realgrid
        class="h-full w-full"
        :progname="'CRM01_050INS_VUE'"
      :progid="1"
      :rowData="rowData"
      :showCheckBar="true"
      :checkRowAuto="false"
      @clickedRowData="clickedRowData3"
      @selcetedrowData="selcetedrowData"
      @updatedRowData2="updatedRowData"
      @allStateRows="allStateRows"
      @checkedRowData="checkedRowData"
      @sendRowState="sendRowState"
      :valuesData="valuesData"
      :labelsData="labelsData"
      :deleteRow7="deleted"
      :changeColid="changeColid"
      :changeRow="changeRow"
      :changeValue2="changeValue"
      :changeNow2="changeNow"
      @selectedIndex2="selectedIndex2"
      :useCheckboxfordelete="true"
      :addRow4="addRow4"
      :addrowDefault="addrowDefault"
      :addrowProp="addrowProp"
      :addField="'new'"
      :rowStateeditable="false"
      :documentSubTitle="documentSubTitle"
        :documentTitle="'CRM01_050INS'"
      :exporttoExcel="exExcel"></Realgrid>
  </div>

    <!-- 상세 + 엑셀: 남은 높이 — 상세 폼 확장, 엑셀은 하단 고정 -->
    <div
      class="crm050-lower-body flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto px-2 pb-1">
      <div class="crm050-detail-section flex min-h-0 min-w-0 flex-1 flex-col">
        <div class="crm050-detail-panel flex min-h-0 flex-1 flex-col pt-0">
          <div class="crm050-form-grid min-h-0 w-full flex-1">
            <div class="crm050-form-label crm050-form-label--required">
              <span class="crm050-form-label__asterisk" aria-hidden="true">*</span>
              카드번호
      </div>
            <div class="crm050-form-value crm050-form-value--card">
        <input
          type="text"
                class="crm050-control crm050-control--field disabled:bg-gray-100"
          v-model="gridvalue1"
          :disabled="disabled"
          name="strSaleCardNo"
          @input="updateGridValue" />
        <button
                type="button"
                class="whitebutton crm050-sub-btn shrink-0"
          @click="cardChange"
          :disabled="disableButton">
          카드변경
        </button>
      </div>
            <div class="crm050-form-label">한도금액</div>
            <div class="crm050-form-value">
        <input
                type="text"
                inputmode="numeric"
                class="crm050-control crm050-control--field crm050-control--amount w-full"
          v-model="gridvalue2"
          name="dblLimitAmt"
                @input="onLimitAmtInput" />
      </div>

            <div class="crm050-form-label crm050-form-label--required">
              <span class="crm050-form-label__asterisk" aria-hidden="true">*</span>
              사원번호
      </div>
            <div class="crm050-form-value">
        <input
          type="text"
                class="crm050-control crm050-control--field w-full disabled:bg-gray-100"
          v-model="gridvalue3"
          :disabled="disabled"
          name="strSaleCustID"
          @input="updateGridValue" />
      </div>
            <div class="crm050-form-label">사용금액</div>
            <div class="crm050-form-value">
        <input
          type="text"
                class="crm050-control crm050-control--field crm050-control--amount w-full disabled:bg-gray-100"
          v-model="gridvalue4"
          disabled
          name="dblSaleAmt"
                readonly />
      </div>

            <div class="crm050-form-label crm050-form-label--required">
              <span class="crm050-form-label__asterisk" aria-hidden="true">*</span>
              사원명
      </div>
            <div class="crm050-form-value">
        <input
          type="text"
                class="crm050-control crm050-control--field w-full disabled:bg-gray-100"
          v-model="gridvalue5"
          name="strSaleCustName"
          @input="updateGridValue" />
      </div>
            <div class="crm050-form-label">잔여금액</div>
            <div class="crm050-form-value">
        <input
          type="text"
                class="crm050-control crm050-control--field crm050-control--amount w-full disabled:bg-gray-100"
          v-model="gridvalue6"
          disabled
          name="dblRemAmt"
                readonly />
      </div>

            <div class="crm050-form-label crm050-form-label--required">
              <span class="crm050-form-label__asterisk" aria-hidden="true">*</span>
              소속사
      </div>
            <div class="crm050-form-value">
              <select
                class="crm050-control crm050-control--field w-full"
                v-model="gridvalue9"
                name="strCustCompCode"
                :disabled="detailAffCompLocked"
                @change="onDetailAffiliateChange">
                <option
                  v-for="item in detailAffCompList"
                  :key="item.value"
                  :value="item.value">
                  {{ item.label }}
                </option>
              </select>
      </div>
            <div class="crm050-form-label">등록일자</div>
            <div class="crm050-form-value">
        <input
          type="text"
          name="dtmInsDateTime"
          v-model="gridvalue8"
                class="crm050-control crm050-control--field w-full disabled:bg-gray-100"
          disabled />
      </div>

            <div class="crm050-form-label">부서코드</div>
            <div class="crm050-form-value">
        <input
          type="text"
                class="crm050-control crm050-control--field w-full"
                v-model="gridvalue13"
                name="strCustDeptCode"
          @input="updateGridValue" />
      </div>
            <div class="crm050-form-label">퇴사여부</div>
            <div class="crm050-form-value crm050-form-value--radio">
        <label for="cond"
          ><input
            type="radio"
            v-model="gridvalue10"
            name="strSaleCustStatus"
            @input="updateGridValue"
            id="cond"
            :disabled="!disabled"
            value="0" />정상</label
        >
        <label for="cond2"
          ><input
            type="radio"
            v-model="gridvalue10"
            name="strSaleCustStatus"
            @input="updateGridValue"
            id="cond2"
            value="1" />퇴사</label
        >
              <label for="cond2-leave"
                ><input
                  type="radio"
                  v-model="gridvalue10"
                  name="strSaleCustStatus"
                  @input="updateGridValue"
                  id="cond2-leave"
                  value="2" />휴직</label
              >
      </div>

            <div class="crm050-form-label">부서명</div>
            <div class="crm050-form-value">
        <input
          type="text"
                class="crm050-control crm050-control--field w-full"
                v-model="gridvalue15"
                name="strCustDeptName"
          @input="updateGridValue" />
      </div>
            <div class="crm050-form-label">사원카드 분실여부</div>
            <div class="crm050-form-value crm050-form-value--radio">
        <label for="cond4"
          ><input
            type="radio"
            name="strSaleCardStatus"
            id="cond4"
            disabled
            value="0"
            v-model="gridvalue12" />정상</label
        >
        <label for="cond5"
          ><input
            type="radio"
            name="strSaleCardStatus"
            id="cond5"
            disabled
            value="1"
            v-model="gridvalue12" />교체</label
        >
        <label for="cond6"
          ><input
            type="radio"
            name="strSaleCardStatus"
            id="cond6"
            disabled
            value="2"
            v-model="gridvalue12" />분실</label
        >
      </div>

            <div class="crm050-form-label">전화번호</div>
            <div class="crm050-form-value">
        <input
          type="text"
                class="crm050-control crm050-control--field w-full"
                v-model="gridvalue7"
                name="strTelNo"
          @input="updateGridValue" />
      </div>
            <div class="crm050-form-label">주소</div>
            <div class="crm050-form-value">
        <input
          type="text"
                class="crm050-control crm050-control--field w-full"
          v-model="gridvalue14"
          name="strAddress"
          @input="updateGridValue" />
      </div>
      </div>
          <p class="crm050-detail-note">
            <svg
              class="crm050-detail-note__icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true">
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clip-rule="evenodd" />
            </svg>
            <span class="crm050-detail-note__text">
              직원후불 기준정보 관리에 한도구분이 '한도없음' 이면 한도금액을 등록
              해도 한도금액이 0으로 반영됩니다.
            </span>
          </p>
    </div>
  </div>

      <div class="crm050-excel-upload crm050-excel-upload--pinned shrink-0">
        <p class="crm050-excel-upload-title mb-2 text-base font-semibold text-gray-900">
          <span class="crm050-excel-upload-icon" aria-hidden="true"></span>
          후불 고객 정보 엑셀 업로드
        </p>
        <div class="crm050-excel-row">
          <div class="crm050-excel-group">
            <span class="crm050-excel-label">파일 선택</span>
            <input
              type="text"
              class="crm050-excel-input crm050-excel-input--path shrink-0 disabled:bg-white"
              v-model="excelFileName"
              disabled />
    <button
              type="button"
              :class="[
                popupToolbarBtnClass,
                { 'crm050-excel-btn--blocked': crm050ExcelUploadBlocked },
              ]"
              class="shrink-0"
              :disabled="disableButton"
              @click="beforeFileSelect">
              찾아보기...
    </button>
          </div>
          <div class="crm050-excel-group crm050-excel-group--sheet">
            <span class="crm050-excel-label">Sheet :</span>
      <select
              class="crm050-excel-control crm050-excel-control--sheet shrink-0"
              v-model="excelcond"
              :disabled="crm050ExcelActionDisabled"
              @change="onExcelSheetChange">
              <option :value="i.lngCode" v-for="i in SheetList" :key="i.lngCode">
          {{ i.strName }}
        </option>
      </select>
      <button
              type="button"
              class="button save shrink-0 md:w-auto"
              :disabled="crm050ExcelUploadBtnDisabled"
              @click="saveButton3">
        업로드
      </button>
    </div>
          <button
            type="button"
            :class="popupToolbarBtnClass"
            class="crm050-excel-sample-btn shrink-0"
            @click="downloadFile">
            <span class="crm050-excel-sample-icon" aria-hidden="true"></span>
    샘플 다운로드
  </button>
          <input
            type="file"
            ref="fileInput"
            accept=".xls,.xlsx"
            class="hidden"
            @change="handleFileChange" />
        </div>
      </div>
    </div>

  <div
    v-if="visible"
    class="crm050-card-modal"
    @click.self="visible = false">
    <div
      class="crm050-card-modal__dialog"
      role="dialog"
      aria-labelledby="crm050-card-modal-title">
      <h2 id="crm050-card-modal-title" class="crm050-card-modal__title">
        직원후불 고객카드 변경(분실/교체)
      </h2>
      <div class="crm050-card-modal__body">
        <div class="crm050-card-modal__grid">
          <div class="crm050-form-label">사원명</div>
          <div class="crm050-form-value">
            <input
              type="text"
              class="crm050-control crm050-control--field"
              v-model="pcond"
              disabled />
          </div>

          <div class="crm050-form-label">사원번호</div>
          <div class="crm050-form-value">
            <input
              type="text"
              class="crm050-control crm050-control--field"
              v-model="pcond2"
              disabled />
          </div>

          <div class="crm050-form-label">현재 카드번호</div>
          <div class="crm050-form-value">
            <input
              type="text"
              class="crm050-control crm050-control--field"
              v-model="pcond3"
              disabled />
          </div>

          <div class="crm050-form-label crm050-form-label--required">
            <span class="crm050-form-label__asterisk" aria-hidden="true">*</span>
            신규 카드번호
          </div>
          <div class="crm050-form-value">
            <input
              type="text"
              class="crm050-control crm050-control--field"
              v-model="pcond4" />
          </div>

          <div class="crm050-form-label crm050-form-label--required">
            <span class="crm050-form-label__asterisk" aria-hidden="true">*</span>
            변경 유형
          </div>
          <div class="crm050-form-value crm050-form-value--radio">
            <label for="crm050-card-change-type-1">
              <input
                type="radio"
                id="crm050-card-change-type-1"
                v-model="pcond5"
                value="1" />
              교체
            </label>
            <label for="crm050-card-change-type-2">
              <input
                type="radio"
                id="crm050-card-change-type-2"
                v-model="pcond5"
                value="2" />
              분실
            </label>
          </div>
        </div>

        <div class="crm050-card-modal__actions">
          <button
            type="button"
            class="whitebutton crm050-sub-btn crm050-card-modal__btn"
            @click="saveButton2">
            저장
          </button>
          <button
            type="button"
            class="whitebutton crm050-sub-btn crm050-card-modal__btn"
            @click="visible = false">
            닫기
          </button>
        </div>
      </div>
    </div>
  </div>

  <div
    v-if="openpopup2"
    class="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
    <div class="bg-white rounded-2xl shadow-lg p-6 w-[30vw] h-[40vh]">
      <h2 class="text-lg font-bold mb-4 text-center">고객정보 수신 작업</h2>
      <div
        class="grid grid-rows-[1fr,1fr,1fr,1fr,1fr] grid-cols-[1fr,3fr] h-[60%]">
        <div
          class="text-base font-semibold border-l border-t border-black flex justify-center items-center bg-gray-100">
          사업장명
        </div>
        <div
          class="text-base font-semibold border-l border-t border-black flex justify-start pl-3 items-center">
          <input
            type="text"
            class="border border-black h-[80%] w-[80%]"
            v-model="p2cond"
            disabled />
        </div>
        <div
          class="text-base font-semibold border-l border-t border-black flex justify-center bg-gray-100 items-center">
          수신유형
        </div>
        <div
          class="text-base font-semibold border-l border-t border-black flex justify-start pl-3 items-center space-x-3">
          <label for="p2cond2"
            ><input
              type="radio"
              v-model="p2cond2"
              value="1"
              id="p2cond2" />수정내역 수신</label
          >
          <label for="p2cond22"
            ><input
              type="radio"
              v-model="p2cond2"
              value="0"
              id="p2cond22" />전체 수신</label
          >
        </div>
        <div
          class="text-base font-semibold border-l border-t border-b border-black flex justify-center items-center bg-gray-100">
          수정일자
        </div>
        <div
          class="text-base font-semibold border-l border-t border-b border-black flex justify-start pl-3 items-center">
          <input
            type="date"
            class="border border-black"
            v-model="p2cond3"
            :disabled="disabled2" />
        </div>
      </div>

      <div class="flex space-x-2">
        <button
          class="mt-4 w-full bg-gray-800 text-white py-2 rounded-xl"
          @click="receiveButton2">
          수신
        </button>

        <button
          class="mt-4 w-full bg-gray-800 text-white py-2 rounded-xl"
          @click="openpopup2 = false">
          닫기
        </button>
      </div>
    </div>
  </div>

  </div>
</template>

<script setup>
import { setEmployeeInfo, setEmployeeInfo2 } from "@/api/etc";
import {
  deleteCustomors050,
  getAccCust050,
  getAffComp,
  buildAffCompCombos,
  saveCustomorsInfo050,
  saveEmployeeCustInfo050,
} from "@/api/micrm";
/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
import PickCustCompany from "@/components/pickCustCompany.vue";
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

import { formatNumberWithCommas, insertPageLog } from "@/customFunc/customFunc";
/**
 *  경고창 호출 라이브러리
 *  */

import Swal from "sweetalert2";
/*
 * 공통 표준  Function
 */

import { computed, nextTick, onMounted, ref, watch } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";
import { read, utils, writeFile } from "xlsx-js-style";
/**
 * 	화면 Load시 실행 스크립트
 */

const disableButton = ref(false);
const store = useStore();
const groupCd = ref();

/** 엑셀 업로드 패널 · MST04_002INS와 동일한 흰 버튼 형식 */
const popupToolbarBtnClass =
  "whitebutton !h-9 !px-5 !py-2 !text-sm !font-semibold !border-gray-500 !text-gray-700 hover:!bg-blue-50 hover:!border-blue-400 disabled:opacity-50 disabled:pointer-events-none";
const excelFileName = ref("");
const excelDataLoaded = ref(false);

const disableStoreCode = ref(true);
/**
 * 추가 버튼 함수
 */

const addRow4 = ref(false);
const labelsData = ref([]);
const valuesData = ref([]);
const afterSearch = ref(false);
const storeType = ref("0");

/**
 * 페이지 매장 코드 세팅
 */

/**
 * 페이지 매장 그룹 세팅
 */

const gridvalue1 = ref("");
const gridvalue2 = ref("");
const gridvalue3 = ref("");
const gridvalue4 = ref("");
const gridvalue5 = ref("");
const gridvalue6 = ref("");
const gridvalue7 = ref("");
const gridvalue8 = ref("");
const gridvalue9 = ref("");
const gridvalue10 = ref("0");
const gridvalue11 = ref("");
const gridvalue12 = ref("0");
const gridvalue13 = ref("");
const gridvalue14 = ref("");
const gridvalue15 = ref("");
const gridvalue16 = ref("");
const gridvalue17 = ref("");

const openCardChange = ref(false);
const exExcel = ref(false);
const exExcelNm = ref("매장정보등록");
/**
 * 엑셀 Export 버튼
 */
const documentSubTitle = ref("");

const excelStore = (e) => {
  exExcelNm.value = e;
  p2cond.value = e.split("사업장명 : ")[1];

  ////console.log(p2cond.value);
};
const exportToExcel = () => {
  documentSubTitle.value = exExcelNm.value + "\n" + "조회조건 :";
  documentSubTitle.value +=
    (cond3.value == true ? "퇴사자 제외 ," : "") +
    (condLeave.value == true ? "휴직자 제외 ," : "") +
    (cond4.value == true ? "분실/교체 제외" : "");

  exExcel.value = !exExcel.value;
};

// API 호출 (설정값 호출)

const rowData = ref([]);

/**
 * 페이지 매장 분류 세팅
 */

/**
 * 페이지 매장 슈퍼바이저 세팅
 */

const initlngMultiPriceGroupCode = ref(-1);

const showReceive = ref(false);

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  if (store.state.userData.lngStoreGroup == "3069") {
    showReceive.value = true;
  }
});

/**
 *  조회 함수
 */
const cond = ref(1);
const cond2 = ref("");
const cond3 = ref(true);
const cond4 = ref(true);
const condLeave = ref(true);

/** 소속사 콤보 — API 목록 기준, 상단(전체)/하단(선택)은 건수에 따라 Vue 처리 */
const affiliateCompList = ref([]);
const detailAffCompList = ref([]);
const affiliateCompCode = ref("");
const affiliateCompLocked = ref(false);
const detailAffCompLocked = ref(false);

const isTopAffiliateAll = () => {
  const v = affiliateCompCode.value;
  return v === "" || v === "0" || v === 0;
};

/** 상단 소속사 전체(0) 시 엑셀 업로드 차단 (샘플 다운로드 제외) */
const crm050ExcelUploadBlocked = computed(() => isTopAffiliateAll());

const crm050ExcelActionDisabled = computed(
  () => disableButton.value || crm050ExcelUploadBlocked.value
);

/** 파일 경로 + Sheet 불러오기 완료 시에만 업로드 활성화 */
const crm050ExcelUploadBtnDisabled = computed(
  () =>
    crm050ExcelActionDisabled.value ||
    !excelFileName.value?.trim() ||
    !excelDataLoaded.value
);

const getTopAffiliateOption = () => {
  if (isTopAffiliateAll()) {
    return null;
  }
  return (
    affiliateCompList.value.find(
      (item) => String(item.value) === String(affiliateCompCode.value)
    ) ?? {
      value: String(affiliateCompCode.value),
      label: "",
    }
  );
};

/** 엑셀 양식 컬럼 (소속사는 상단 선택값 사용) */
const CRM050_EXCEL_SAMPLE_LABELS = [
  "카드번호",
  "사원번호",
  "고객명",
  "전화번호",
  "부서코드",
  "부서명",
  "한도금액",
];
const CRM050_EXCEL_COLUMN_COUNT = CRM050_EXCEL_SAMPLE_LABELS.length;

const CRM050_EXCEL_HEADERS = [
  "strSaleCardNo",
  "strSaleCustID",
  "strSaleCustName",
  "strTelNo",
  "strCustDeptCode",
  "strCustDeptName",
  "dblLimitAmt",
];

const crm050CountExcelRowCols = (row) => {
  if (!Array.isArray(row)) {
    return 0;
  }
  let lastIdx = -1;
  for (let i = 0; i < row.length; i++) {
    if (row[i] != null && String(row[i]).trim() !== "") {
      lastIdx = i;
    }
  }
  return lastIdx + 1;
};

const crm050ValidateExcelTemplate = (jsonData) => {
  if (!Array.isArray(jsonData) || jsonData.length === 0) {
    return false;
  }
  let maxCols = 0;
  for (const row of jsonData) {
    const colCount = crm050CountExcelRowCols(row);
    if (colCount > maxCols) {
      maxCols = colCount;
    }
  }
  return maxCols === CRM050_EXCEL_COLUMN_COUNT;
};

const crm050ExcelSampleFileStamp = () => {
  const d = new Date();
  const yy = String(d.getFullYear()).slice(-2);
  const MM = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const HH = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${yy}${MM}${dd}${HH}${mm}${ss}`;
};

const crm050ResetExcelGrid = () => {
  rowData.value = [];
  updateRowData.value = [];
  excelDataLoaded.value = false;
};

const crm050ApplyTopAffiliateToRows = (rows) => {
  const topAff = getTopAffiliateOption();
  const compCode = topAff?.value ?? String(affiliateCompCode.value ?? "");
  const compName = topAff?.label ?? "";
  return rows.map((item) => ({
    ...item,
    strCustCompCode: compCode,
    strCustCompName: compName,
  }));
};

const crm050MapExcelRows = (jsonData) => {
  const rows = jsonData.slice(1);

  return rows
    .filter((row) =>
      Array.isArray(row) ? row.some((c) => c != null && String(c).trim() !== "") : false
    )
    .map((row) => {
      const obj = {};
      CRM050_EXCEL_HEADERS.forEach((key, i) => {
        obj[key] = row[i];
      });
      return obj;
    });
};

/** 상단 전체(0)일 때만 하단 소속사 선택 가능 */
const applyDetailAffCompEditState = () => {
  if (affiliateCompLocked.value) {
    detailAffCompLocked.value = true;
    const topAff = getTopAffiliateOption();
    if (topAff) {
      gridvalue9.value = topAff.value;
      gridvalue11.value = topAff.label;
    }
    return;
  }
  detailAffCompLocked.value = !isTopAffiliateAll();
  if (!isTopAffiliateAll()) {
    const topAff = getTopAffiliateOption();
    if (topAff) {
      gridvalue9.value = topAff.value;
      gridvalue11.value = topAff.label;
    }
  }
};

const onTopAffiliateChange = () => {
  applyDetailAffCompEditState();
  if (CompanyCode.value != 0 && CompanyCode.value !== "0") {
    searchButton();
  }
};

/** 조회 REPORT_TYPE — 레거시와 동일: 퇴사(1)·분실/교체(2)·휴직(3) */
const crm01050BuildReportType = () => {
  let type = "";
  if (cond3.value) type += "1";
  if (cond4.value) type += "2";
  if (condLeave.value) type += "3";
  return type || "0";
};
const disabled = ref(true);
const disabled2 = ref(false);
const searchButton = async () => {
  if (CompanyCode.value == 0) {
    Swal.fire({
      title: "경고",
      text: "고객사명을 먼저 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  try {
    initGrid();
    store.state.loading = true;
    let pcond = "";
    let pcond2 = "";
    let pcond3 = "";
    let pcond4 = "";
    let pcond5 = "";

    if (cond.value == 1) {
      pcond = cond2.value;
    } else if (cond.value == 2) {
      pcond2 = cond2.value;
    } else if (cond.value == 3) {
      pcond3 = cond2.value;
    } else if (cond.value == 4) {
      pcond4 = cond2.value;
    } else if (cond.value == 5) {
      pcond5 = cond2.value;
    }
    const pcond6 = crm01050BuildReportType();
    const res = await getAccCust050(
      CompanyCode.value,
      pcond,
      pcond2,
      pcond3,
      pcond4,
      pcond5,
      pcond6,
      affiliateCompCode.value
    );

    rowData.value = res.data.List;
    updateRowData.value = res.data.List;
    store.state.loading = false;
    afterSearch.value = true;
  } catch (error) {
  } finally {
    store.state.loading = false;
  }
};

const openpopup2 = ref(false);
const receiveButton = async (e) => {
  if (currIFCHK.value == 1) {
    //http://www.pncoffice.com:8081/CJFWBaeminEmpSaleService.asmx/GET_EMP_CUST_LIST
    openpopup2.value = true;
    const currDate = new Date().toISOString().split("T")[0];
    p2cond3.value = currDate;
  } else if (currIFCHK.value == 2) {
    const currDate = new Date().toISOString().split("T")[0];
    try {
      store.state.loading = true;
      const res = await setEmployeeInfo(
        CompanyCode.value,
        currDate,
        store.state.userData.lngSequence
      );

      store.state.loading = false;
      if (res.data.d == "success") {
        Swal.fire({
          title: "성공",
          text: "수신을 성공하였습니다.",
          icon: "success",
          confirmButtonText: "확인",
        });
        return;
      } else {
        Swal.fire({
          title: "실패",
          text: "수신에 실패하였습니다. 피앤시월드로 문의해주세요.",
          icon: "error",
          confirmButtonText: "확인",
        });
        return;
      }
    } catch (error) {}
  }
};

const receiveButton2 = async () => {
  // strRcvID , strDate , strRegID , strBpID
  const currDate = new Date().toISOString().split("T")[0];
  let regId = "";
  if (p2cond2.value == 0) {
    regId = "";
  } else {
    regId = p2cond3.value;
  }
  const res = await setEmployeeInfo2(
    CompanyCode.value,
    currDate,
    store.state.userData.lngSequence,
    regId,
    currBPID.value
  );
  openpopup2.value = false;
  if (res.data.d == "성공했습니다.") {
    Swal.fire({
      title: "성공",
      text: "수신 완료하였습니다.",
      icon: "success",
      confirmButtonText: "확인",
    });
    return;
  } else {
    Swal.fire({
      title: "실패",
      text: "수신에 실패하였습니다. 피앤시월드로 문의 바랍니다.",
      icon: "error",
      confirmButtonText: "확인",
    });
    return;
  }
};
const deleted = ref(false);

/**
 * 삭제 버튼
 */

const addrowDefault = ref("");
const addrowProp = ref("");
/**
 *  추가 버튼
 */
const CompanyCode = ref("");
const setCompanyCode = (e) => {
  CompanyCode.value = e;
  afterSearch.value = false;
  initGrid();
  affiliateCompCode.value = "";
  affiliateCompList.value = [];
  detailAffCompList.value = [];
  affiliateCompLocked.value = false;
  detailAffCompLocked.value = false;
  if (e && e !== 0 && e !== "0") {
    loadAffComp();
  }
};

/** 소속사 콤보 — 고객사 변경 시 1회 조회 */
const resetAffCompCombos = () => {
  affiliateCompList.value = [];
  detailAffCompList.value = [];
  affiliateCompLocked.value = false;
  detailAffCompLocked.value = false;
  affiliateCompCode.value = "";
};

const loadAffComp = async () => {
  if (!CompanyCode.value || CompanyCode.value === 0) {
    return;
  }
  try {
    const res = await getAffComp(
      CompanyCode.value,
      store.state.userData.lngStoreGroup,
      store.state.userData.lngSequence
    );
    if (res.data?.RESULT_CD !== "00") {
      resetAffCompCombos();
      Swal.fire({
        title: "경고",
        text:
          res.data?.RESULT_MSG ||
          "소속사 목록 조회에 실패했습니다. 피앤시월드에 문의하세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }
    const combo = buildAffCompCombos(res.data?.List ?? []);
    affiliateCompLocked.value = combo.singleLocked;
    affiliateCompList.value = combo.topOptions;
    detailAffCompList.value = combo.detailOptions;
    affiliateCompCode.value = combo.topValue;
    applyDetailAffCompEditState();
  } catch (error) {
    resetAffCompCombos();
    console.error("소속사 목록 조회 오류:", error);
  }
};

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
  applyDetailAffCompEditState();
  addrowProp.value = `strSaleCardNo,strSaleCustID,strSaleCustName,strTelNo,strCustCompCode,strCustCompName,strCustDeptCode,strCustDeptName,strAddress,dtmInsDateTime,strSaleCustStatusTxt,strSaleCardStatusTxt,dblLimitAmt,dblSaleAmt,dblRemAmt,strSaleCustStatus,strSaleCardStatus,strLimitModify`;
  const currdate = new Date().toISOString().split("T")[0];
  const topAff = getTopAffiliateOption();
  const compCode = topAff?.value ?? "";
  const compName = topAff?.label ?? "";
  addrowDefault.value = `,,,,${compCode},${compName},,,,${currdate},정상,정상,0,0,0,0,0,0`;

  disabled.value = false;
  openCardChange.value = false;
  addRow4.value = !addRow4.value;
};

/** 저장·업로드 대상 행 소속사(strCustCompCode) 필수 */
const crm050IsBlank = (v) =>
  v === "" || v == null || v === undefined || String(v).trim() === "";

const crm050GetStateRows = () => {
  const s = stateRows.value;
  if (s && typeof s === "object" && !Array.isArray(s)) {
    return {
      updated: s.updated ?? [],
      created: s.created ?? [],
      deleted: s.deleted ?? [],
    };
  }
  return { updated: [], created: [], deleted: [] };
};

const crm050GetSaveTargetRows = () => {
  const { updated, created } = crm050GetStateRows();
  return updateRowData.value.filter(
    (item, index) => updated.includes(index) || created.includes(index)
  );
};

/** 저장 대상 행 필수값 검증 — 카드번호·사원번호·사원명·소속사 */
const crm050PatchUpdateRowField = (field, value) => {
  const idx = Number(changeRow.value);
  if (Number.isNaN(idx) || idx < 0 || !updateRowData.value[idx]) {
    return;
  }
  updateRowData.value[idx][field] = value;
};

const crm050MarkRowUpdated = () => {
  const idx = Number(changeRow.value);
  if (Number.isNaN(idx) || idx < 0) {
    return;
  }
  const state = crm050GetStateRows();
  if (state.created.includes(idx) || state.updated.includes(idx)) {
    return;
  }
  stateRows.value = { ...state, updated: [...state.updated, idx] };
};

const crm050NormalizeLimitAmt = (value) => {
  if (value === "" || value == null || value === undefined) {
    return 0;
  }
  const n = Number(String(value).replace(/,/g, ""));
  return Number.isNaN(n) ? 0 : n;
};

const crm050ValidateSaveTargets = (rows) => {
  if (!rows.length) {
    return true;
  }
  const missingRequired = rows.some(
    (item) =>
      crm050IsBlank(item.strSaleCardNo) ||
      crm050IsBlank(item.strSaleCustID) ||
      crm050IsBlank(item.strSaleCustName)
  );
  if (missingRequired) {
    Swal.fire({
      title: "경고",
      text: "미입력된 필수값이 존재합니다. 확인해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return false;
  }
  const missingAff = rows.some(
    (item) =>
      crm050IsBlank(item.strCustCompCode) || String(item.strCustCompCode) === "0"
  );
  if (missingAff) {
    Swal.fire({
      title: "경고",
      text: "소속사를 선택 해 주십시오.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return false;
  }
  return true;
};

const crm050RequireDetailAffComp = (rows) => crm050ValidateSaveTargets(rows);

const crm050NormalizeRegKey = (v) =>
  String(v ?? "")
    .replace(/\s/g, "")
    .trim();

/** 신규(created) 행 — 사원번호·카드번호 그리드/서버 기등록 검증 */
const crm050ValidateCreatedDuplicates = async (createdIndices, deletedIndices) => {
  if (!createdIndices?.length) {
    return true;
  }

  const deletedSet = new Set(deletedIndices ?? []);
  const gridRows = updateRowData.value;
  const keysByIndex = createdIndices.map((idx) => ({
    idx,
    custId: crm050NormalizeRegKey(gridRows[idx]?.strSaleCustID),
    cardNo: crm050NormalizeRegKey(gridRows[idx]?.strSaleCardNo),
  }));

  const custSeen = new Map();
  const cardSeen = new Map();
  for (const { custId, cardNo } of keysByIndex) {
    if (custId) {
      if (custSeen.has(custId)) {
        await Swal.fire({
          title: "경고",
          text: `입력하신 사원번호가 중복됩니다. (${custId})`,
          icon: "warning",
          confirmButtonText: "확인",
        });
        return false;
      }
      custSeen.set(custId, true);
    }
    if (cardNo) {
      if (cardSeen.has(cardNo)) {
        await Swal.fire({
          title: "경고",
          text: `입력하신 카드번호가 중복됩니다. (${cardNo})`,
          icon: "warning",
          confirmButtonText: "확인",
        });
        return false;
      }
      cardSeen.set(cardNo, true);
    }
  }

  for (const { idx, custId, cardNo } of keysByIndex) {
    for (let otherIdx = 0; otherIdx < gridRows.length; otherIdx++) {
      if (otherIdx === idx || deletedSet.has(otherIdx)) {
        continue;
      }
      const other = gridRows[otherIdx];
      if (custId && crm050NormalizeRegKey(other?.strSaleCustID) === custId) {
        await Swal.fire({
          title: "경고",
          text: `이미 목록에 존재하는 사원번호입니다. (${custId})`,
          icon: "warning",
          confirmButtonText: "확인",
        });
        return false;
      }
      if (cardNo && crm050NormalizeRegKey(other?.strSaleCardNo) === cardNo) {
        await Swal.fire({
          title: "경고",
          text: `이미 목록에 존재하는 카드번호입니다. (${cardNo})`,
          icon: "warning",
          confirmButtonText: "확인",
        });
        return false;
      }
    }
  }

  for (const { custId, cardNo } of keysByIndex) {
    if (custId) {
      const res = await getAccCust050(
        CompanyCode.value,
        "",
        custId,
        "",
        "",
        "",
        "0",
        "0"
      );
      if ((res.data?.List ?? []).length > 0) {
        await Swal.fire({
          title: "경고",
          text: `이미 등록된 사원번호입니다. (${custId})`,
          icon: "warning",
          confirmButtonText: "확인",
        });
        return false;
      }
    }
    if (cardNo) {
      const res = await getAccCust050(
        CompanyCode.value,
        cardNo,
        "",
        "",
        "",
        "",
        "0",
        "0"
      );
      if ((res.data?.List ?? []).length > 0) {
        await Swal.fire({
          title: "경고",
          text: `이미 등록된 카드번호입니다. (${cardNo})`,
          icon: "warning",
          confirmButtonText: "확인",
        });
        return false;
      }
    }
  }

  return true;
};

const deleteButton = () => {
  deleted.value = !deleted.value;
};
/**
 *  저장 버튼 함수
 */

const saveButton = async () => {
  if (CompanyCode.value == 0 || CompanyCode.value === "0") {
    Swal.fire({
      title: "경고",
      text: "고객사명을 먼저 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  const rowState = crm050GetStateRows();
  if (
    rowState.updated.length === 0 &&
    rowState.created.length === 0 &&
    rowState.deleted.length === 0
  ) {
    Swal.fire({
      title: "경고",
      text: `변경된 사항이 없습니다.`,
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  const saveTargetRows = crm050GetSaveTargetRows();
  const hasSaveRows =
    rowState.updated.length > 0 || rowState.created.length > 0;

  if (hasSaveRows && !crm050ValidateSaveTargets(saveTargetRows)) {
    return;
  }

  if (rowState.created.length > 0) {
    try {
      store.state.loading = true;
      const dupOk = await crm050ValidateCreatedDuplicates(
        rowState.created,
        rowState.deleted
      );
      if (!dupOk) {
        return;
      }
    } finally {
      store.state.loading = false;
    }
  }

  if (rowState.deleted.length > 0) {
    const custSts = updateRowData.value
      .filter((item, index) => rowState.deleted.includes(index))
      .map((item) => item.strSaleCustStatus)
      .filter((item) => item == 0);

    if (custSts.length > 0) {
      Swal.fire({
        title: "경고",
        text: `퇴사 처리된 고객만 삭제가 가능합니다.`,
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }
  }

  try {
    store.state.loading = true;
    if (rowState.deleted.length > 0) {
      const compcds = updateRowData.value
        .filter((item, index) => rowState.deleted.includes(index))
        .map((item) => item.strSaleCustID)
        .join("\u200b");
      const cardNos = updateRowData.value
        .filter((item, index) => rowState.deleted.includes(index))
        .map((item) => item.strSaleCardNo)
        .join("\u200b");

      await Swal.fire({
        title: "경고",
        text: `고객 삭제시 복구가 불가능합니다. 정말 삭제하시겠습니까? `,
        icon: "warning",
        confirmButtonText: "확인",
        cancelButtonText: "취소",
        showCancelButton: true, // ← 취소 버튼 표시
      }).then(async (result) => {
        if (result.isConfirmed) {
          const res = await deleteCustomors050(
            CompanyCode.value,
            compcds,
            cardNos,
            store.state.userData.lngSequence,
            ""
          );
        } else {
          //searchButton();
          throw new Error();
        }
      });
    }

    const isSaveTarget = (_item, index) =>
      rowState.updated.includes(index) || rowState.created.includes(index);

    if (hasSaveRows) {
    const custids = updateRowData.value
        .filter(isSaveTarget)
      .map((item) => item.strSaleCustID)
      .join("\u200b");
    const limitAmt = updateRowData.value
        .filter(isSaveTarget)
        .map((item) => crm050NormalizeLimitAmt(item.dblLimitAmt))
      .join("\u200b");
    const custStatus = updateRowData.value
        .filter(isSaveTarget)
      .map((item) => item.strSaleCustStatus)
      .join("\u200b");
    const cardStatus = updateRowData.value
        .filter(isSaveTarget)
      .map((item) => item.strSaleCardStatus)
      .join("\u200b");
    const cardNos = updateRowData.value
        .filter(isSaveTarget)
      .map((item) => item.strSaleCardNo)
      .join("\u200b");
    const custNms = updateRowData.value
        .filter(isSaveTarget)
      .map((item) => item.strSaleCustName)
      .join("\u200b");
    const deptCds = updateRowData.value
        .filter(isSaveTarget)
      .map((item) => item.strCustDeptCode)
      .join("\u200b");
    const deptNms = updateRowData.value
        .filter(isSaveTarget)
      .map((item) => item.strCustDeptName)
      .join("\u200b");
    const telNos = updateRowData.value
        .filter(isSaveTarget)
      .map((item) => item.strTelNo)
      .join("\u200b");
    const compCds = updateRowData.value
        .filter(isSaveTarget)
      .map((item) => item.strCustCompCode)
      .join("\u200b");
    const address = updateRowData.value
        .filter(isSaveTarget)
      .map((item) => item.strAddress)
      .join("\u200b");
      const res = await saveCustomorsInfo050(
      CompanyCode.value,
      custids,
      limitAmt,
      custStatus,
      cardStatus,
      cardNos,
      custNms,
      deptCds,
      deptNms,
      telNos,
      compCds,
      address,
      store.state.userData.lngSequence
    );
    if (res.data.RESULT_CD == "00") {
      Swal.fire({
        title: "성공",
        text: `저장이 완료되었습니다.`,
        icon: "success",
        confirmButtonText: "확인",
      });
      } else {
        Swal.fire({
          title: "실패",
          text:
            res.data.RESULT_MSG ||
            res.data.RESULT_NM ||
            `저장에 실패했습니다. (코드: ${res.data.RESULT_CD})`,
          icon: "error",
          confirmButtonText: "확인",
        });
        return;
      }
    }
    searchButton();
  } catch (error) {
    if (error?.message) {
      Swal.fire({
        title: "오류",
        text: error.message,
        icon: "error",
        confirmButtonText: "확인",
      });
    }
    return;
  } finally {
    store.state.loading = false;
  }
};

const saveButton2 = async () => {
  if (crm050IsBlank(pcond4.value)) {
    await Swal.fire({
      title: "경고",
      text: "신규 카드번호를 입력해 주십시오!",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  try {
    store.state.loading = true;
    const res = await saveEmployeeCustInfo050(
      CompanyCode.value,
      pcond2.value,
      pcond3.value,
      pcond4.value,
      pcond5.value,
      store.state.userData.lngSequence
    );
    ////console.log(res);

    if (res.data.List[0].strErr == "0000") {
      await Swal.fire({
        title: "성공",
        text: `${res.data.List[0].strErrMsg}`,
        icon: "success",
        confirmButtonText: "확인",
      });
      await searchButton();
      return;
    } else {
      Swal.fire({
        title: "실패",
        text: `${res.data.List[0].strErrMsg} 피앤시월드로 문의부탁드립니다.`,
        icon: "error",
        confirmButtonText: "확인",
      });
      return;
    }
  } catch (error) {
  } finally {
    store.state.loading = false;
    visible.value = false;
  }
};

/** 엑셀 업로드 시 상단 소속사 선택 여부 (전체 불가) */
const crm050RequireAffiliateForUpload = () => {
  if (isTopAffiliateAll()) {
    Swal.fire({
      title: "경고",
      text: "소속사를 선택후 업로드 가능합니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return false;
  }
  return true;
};

const saveButton3 = async () => {
  if (!crm050RequireAffiliateForUpload()) {
    return;
  }

  if (updateRowData.value.length === 0) {
    Swal.fire({
      title: "경고",
      text: "업로드할 데이터가 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  // 필수 필드 검증
  const custidsl = updateRowData.value
    .map((item) => item.strSaleCustID)
    .filter(
      (item2) => item2 == "" || item2 == undefined || item2 == null
    ).length;

  const cardnos = updateRowData.value
    .map((item) => item.strSaleCardNo)
    .filter(
      (item2) => item2 == "" || item2 == undefined || item2 == null
    ).length;

  const custnms = updateRowData.value
    .map((item) => item.strSaleCustName)
    .filter(
      (item2) => item2 == "" || item2 == undefined || item2 == null
    ).length;

  if (custidsl + cardnos + custnms > 0) {
    Swal.fire({
      title: "경고",
      text: `미입력된 필수값이 존재합니다. 확인해주세요.`,
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (!crm050RequireDetailAffComp(updateRowData.value)) {
    return;
  }

  updateRowData.value = crm050ApplyTopAffiliateToRows(updateRowData.value);
  rowData.value = JSON.parse(JSON.stringify(updateRowData.value));

  const excelRowIndices = updateRowData.value.map((_, index) => index);
  try {
    store.state.loading = true;
    const dupOk = await crm050ValidateCreatedDuplicates(excelRowIndices, []);
    if (!dupOk) {
      return;
    }
  } finally {
    store.state.loading = false;
  }

  const result = await Swal.fire({
    title: "확인",
    text: "업로드 하시겠습니까?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "확인",
    cancelButtonText: "취소",
  });

  if (!result.isConfirmed) {
    return;
  }

  try {
    store.state.loading = true;

    const custids = updateRowData.value
      .map((item) => item.strSaleCustID || "")
      .join("\u200b");
    const limitAmt = updateRowData.value
      .map((item) => crm050NormalizeLimitAmt(item.dblLimitAmt))
      .join("\u200b");
    const custStatus = updateRowData.value
      .map((item) => item.strSaleCustStatus || 0)
      .join("\u200b");
    const cardStatus = updateRowData.value
      .map((item) => item.strSaleCardStatus || 0)
      .join("\u200b");
    const cardNos = updateRowData.value
      .map((item) => item.strSaleCardNo || "")
      .join("\u200b");
    const custNms = updateRowData.value
      .map((item) => item.strSaleCustName || "")
      .join("\u200b");
    const deptCds = updateRowData.value
      .map((item) => item.strCustDeptCode || "")
      .join("\u200b");
    const deptNms = updateRowData.value
      .map((item) => item.strCustDeptName || "")
      .join("\u200b");
    const telNos = updateRowData.value
      .map((item) => item.strTelNo || "")
      .join("\u200b");
    const compCds = updateRowData.value
      .map((item) => item.strCustCompCode || "")
      .join("\u200b");
    const address = updateRowData.value
      .map((item) => item.strAddress || "")
      .join("\u200b");
    const res = await saveCustomorsInfo050(
      CompanyCode.value,
      custids,
      limitAmt,
      custStatus,
      cardStatus,
      cardNos,
      custNms,
      deptCds,
      deptNms,
      telNos,
      compCds,
      address,
      store.state.userData.lngSequence
    );
    console.log("API 응답:", res.data);
    if (res.data.RESULT_CD == "00") {
      Swal.fire({
        title: "성공",
        text: `처리되었습니다.`,
        icon: "success",
        confirmButtonText: "확인",
      });
      resetExcelUploadControls();
      searchButton();
    } else {
      Swal.fire({
        title: "실패",
        text: res.data.RESULT_MSG || `업로드에 실패했습니다. (코드: ${res.data.RESULT_CD})`,
        icon: "error",
        confirmButtonText: "확인",
      });
      searchButton();
    }
  } catch (error) {
    console.error("업로드 오류:", error);
    Swal.fire({
      title: "오류",
      text: error.response?.data?.message || `업로드 중 오류가 발생했습니다.`,
      icon: "error",
      confirmButtonText: "확인",
    });
    searchButton();
  } finally {
    store.state.loading = false;
  }
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

const formatAmountDisplay = (value) => {
  if (value === "" || value === null || value === undefined) {
    return "";
  }
  const digits = String(value).replace(/,/g, "").replace(/\D/g, "");
  if (digits === "") {
    return "";
  }
  return formatNumberWithCommas(digits);
};

const onLimitAmtInput = async (e) => {
  const digits = String(e.target.value ?? "")
    .replace(/,/g, "")
    .replace(/\D/g, "");
  const numVal = digits === "" ? 0 : Number(digits);
  gridvalue2.value =
    digits === "" ? "" : formatNumberWithCommas(digits);

  changeColid.value = "dblLimitAmt";
  changeValue.value = numVal;
  changeNow.value = !changeNow.value;
  await nextTick();

  crm050PatchUpdateRowField("dblLimitAmt", numVal);
  crm050MarkRowUpdated();
};

const onDetailAffiliateChange = async () => {
  const selected = detailAffCompList.value.find(
    (item) => String(item.value) === String(gridvalue9.value)
  );
  gridvalue11.value = selected?.label ?? "";

  changeColid.value = "strCustCompCode";
  changeValue.value = gridvalue9.value;
  changeNow.value = !changeNow.value;
  await nextTick();

  changeColid.value = "strCustCompName";
  changeValue.value = gridvalue11.value;
  changeNow.value = !changeNow.value;
};

const clickedRowData3 = (e) => {
  ////console.log(e);
  gridvalue1.value = e[0];
  gridvalue2.value = formatAmountDisplay(e[12]);
  gridvalue3.value = e[1];
  gridvalue4.value = formatAmountDisplay(e[13]);
  gridvalue5.value = e[2];
  gridvalue6.value = formatAmountDisplay(e[14]);
  gridvalue7.value = e[3];
  gridvalue8.value =
    e[9] != undefined && e[9] != "" ? e[9].toISOString().split("T")[0] : "";
  gridvalue9.value = e[4];
  gridvalue10.value = e[15];
  gridvalue11.value = e[5];
  if (!isTopAffiliateAll()) {
    const topAff = getTopAffiliateOption();
    if (topAff) {
      gridvalue9.value = topAff.value;
      gridvalue11.value = topAff.label;
    }
  }
  gridvalue12.value = String(e[16] ?? "0");
  gridvalue13.value = e[6];
  gridvalue14.value = e[8];
  gridvalue15.value = e[7];
};
/**
 * 페이지 매장 코드 세팅
 */
const visible = ref(false);

const crm050FillCardChangePopup = () => {
  const idx = Number(changeRow.value);
  if (Number.isNaN(idx) || idx < 0 || !updateRowData.value[idx]) {
    return false;
  }
  const row = updateRowData.value[idx];
  pcond.value = row.strSaleCustName ?? "";
  pcond2.value = row.strSaleCustID ?? "";
  pcond3.value = row.strSaleCardNo ?? "";
  pcond4.value = "";
  pcond5.value = "1";
  return true;
};

const cardChange = () => {
  if (!openCardChange.value) {
    return;
  }
  if (!crm050FillCardChangePopup()) {
    Swal.fire({
      title: "경고",
      text: "변경할 고객을 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  visible.value = true;
};

const pcond = ref("");
const pcond2 = ref("");
const pcond3 = ref("");
const pcond4 = ref("");
const pcond5 = ref("");
/**
 * 페이지 매장 분류 세팅
 */

const dtmOpenDate = ref(new Date().toISOString().split("T")[0]);

/**
 * 페이지 매장 슈퍼바이저 세팅
 */

const dtmStop = ref(new Date("9999-12-31").toISOString().split("T")[0]);

const changeValue = ref();
const changeRow = ref();
const changeColid = ref();
const changeNow = ref(false);
const updateGridValue = async (e) => {
  const name = e.target.name;
  const value = e.target.value;

  if (name == "dblLimitAmt") {
    await onLimitAmtInput(e);
    return;
  }

  if (name == "strSaleCustStatus") {
    changeColid.value = "strSaleCustStatusTxt";
    changeValue.value =
      value == 0 ? "정상" : value == 1 ? "퇴사" : value == 2 ? "휴직" : "";
    changeNow.value = !changeNow.value;
    await nextTick();
    changeColid.value = name;
    changeValue.value = value;
    changeNow.value = !changeNow.value;
    await nextTick();
    crm050PatchUpdateRowField(name, value);
    crm050MarkRowUpdated();
    return;
  }

  // if (name == "strSaleCardStatus") {
  //   changeColid.value = "strSaleCardStatusTxt";
  //   changeValue.value = value == 0 ? "정상" : value == 1 ? "교체" : "분실";
  //   changeNow.value = !changeNow.value;
  //   await nextTick();
  // }
  changeColid.value = name;
  changeValue.value = value;
  changeNow.value = !changeNow.value;
  await nextTick();
  crm050PatchUpdateRowField(name, value);
  crm050MarkRowUpdated();
};
const updateRowData = ref([]);

/**
 * 입력창 수정 데이터 갱신
 */
const stateRows = ref({ updated: [], created: [], deleted: [] });
const allStateRows = (e) => {
  ////console.log(e);
  stateRows.value = e;
};

const sendRowState = (e) => {
  if (e == "created") {
    disabled.value = false;
    openCardChange.value = false;
  } else {
    disabled.value = true;
    openCardChange.value = true;
  }
};

const checkedRows = ref([]);
const checkedRowData = (e) => {
  ////console.log(e);

  checkedRows.value = e;
};
const updatedRowData = (newvalue) => {
  updateRowData.value = newvalue;
  ////console.log(updateRowData.value);

  ////console.log(rowData.value);
};

watch(dtmOpenDate, () => {
  //comsole.log(dtmOpenDate.value);
});
watch(dtmStop, () => {
  //comsole.log(dtmStop.value);
});

const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
  gridvalue1.value = "";
  gridvalue2.value = "";
  gridvalue3.value = "";
  gridvalue4.value = "";
  gridvalue5.value = "";
  gridvalue6.value = "";
  gridvalue7.value = "";
  gridvalue8.value = "";
  gridvalue9.value = "";
  gridvalue10.value = "0";
  gridvalue11.value = "";
  gridvalue12.value = "0";
  gridvalue13.value = "";
  gridvalue14.value = "";
  gridvalue15.value = "";

  disabled.value = true;
  openCardChange.value = true;

  resetExcelUploadControls();
};
const fileInput = ref(null);
const SheetList = ref([]);

/** 엑셀 업로드 패널 — 최초 로드 상태로 초기화 */
const resetExcelUploadControls = () => {
  SheetList.value = [];
  excelFileName.value = "";
  excelDataLoaded.value = false;
  excelcond.value = 1;
  currentFile.value = null;
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};
const beforeFileSelect = () => {
  // 여기서 점검: 권한, 사용자 상태 등
  if (CompanyCode.value == 0 || afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: `조회를 먼저 해주세요.`,
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  if (!crm050RequireAffiliateForUpload()) {
    return;
  }
  fileInput.value.click();
};

const excelcond = ref(1);
const onExcelSheetChange = async () => {
  if (!currentFile.value) {
    excelDataLoaded.value = false;
    return;
  }
  await readFileWithArrayBuffer(currentFile.value);
};
const handleFileChange = async (e) => {
  const file = e.target.files[0];
  ////console.log(file);
  currentFile.value = file;
  excelFileName.value = file?.name ?? "";
  excelcond.value = 1;
  excelDataLoaded.value = false;
  SheetList.value = [];
  if (file) {
    const arrayBuffer = await file.arrayBuffer();
    // XLSX 라이브러리에서 arrayBuffer 사용 가능
    const workbook = read(arrayBuffer, { type: "array" });

    const sheetLength = workbook.SheetNames.length;

    for (let i = 0; i < sheetLength; i++) {
      SheetList.value.push({ lngCode: i + 1, strName: workbook.SheetNames[i] });
    }

    await readFileWithArrayBuffer(currentFile.value);
  }
  e.target.value = "";
};

const currentFile = ref();

async function readFileWithArrayBuffer(file) {
  const arrayBuffer = await file.arrayBuffer();
  // XLSX 라이브러리에서 arrayBuffer 사용 가능
  const workbook = read(arrayBuffer, { type: "array" });

  const sheetName = workbook.SheetNames[excelcond.value - 1];
  const sheet = workbook.Sheets[sheetName];
  const jsonData = utils.sheet_to_json(sheet, { header: 1 });

  if (!crm050ValidateExcelTemplate(jsonData)) {
    await Swal.fire({
      title: "경고",
      text: "양식을 확인해 주십시오!\n샘플 업로드 양식과 다릅니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    crm050ResetExcelGrid();
    return null;
  }

  rowData.value = crm050ApplyTopAffiliateToRows(
    crm050MapExcelRows(jsonData).map((item) => ({
      ...item,
      strSaleCustStatus: 0,
      strSaleCustStatusTxt: "정상",
      strSaleCardStatus: 0,
      strSaleCardStatusTxt: "정상",
      strAddress: item.strAddress || "",
      dblSaleAmt: item.dblSaleAmt || 0,
      dblRemAmt: item.dblRemAmt || 0,
    }))
  );
  updateRowData.value = JSON.parse(JSON.stringify(rowData.value));
  excelDataLoaded.value = true;
  ////console.log(updateRowData.value);
  return jsonData;
}

const CRM050_EXCEL_SAMPLE_BORDER = {
  top: { style: "thin", color: { rgb: "FFB4B4B4" } },
  left: { style: "thin", color: { rgb: "FFB4B4B4" } },
  bottom: { style: "thin", color: { rgb: "FFB4B4B4" } },
  right: { style: "thin", color: { rgb: "FFB4B4B4" } },
};

const CRM050_EXCEL_SAMPLE_HEADER_STYLE = {
  font: { name: "맑은 고딕", sz: 11, bold: true, color: { rgb: "FFFFFFFF" } },
  fill: { patternType: "solid", fgColor: { rgb: "FF4472C4" } },
  alignment: { horizontal: "center", vertical: "center", wrapText: true },
  border: CRM050_EXCEL_SAMPLE_BORDER,
};

const CRM050_EXCEL_SAMPLE_BODY_STYLE = {
  font: { name: "맑은 고딕", sz: 11, color: { rgb: "FF000000" } },
  fill: { patternType: "solid", fgColor: { rgb: "FFFFFFFF" } },
  alignment: { horizontal: "center", vertical: "center" },
  border: CRM050_EXCEL_SAMPLE_BORDER,
};

const crm050ApplyExcelTextCell = (cell) => {
  cell.t = "s";
  cell.v = cell.v == null || cell.v === undefined ? "" : String(cell.v);
  cell.z = "@";
};

const crm050StyleExcelSampleSheet = (ws, colCount, rowCount) => {
  ws["!cols"] = [
    { wch: 20 },
    { wch: 14 },
    { wch: 14 },
    { wch: 16 },
    { wch: 12 },
    { wch: 16 },
    { wch: 12 },
  ];
  ws["!rows"] = Array.from({ length: rowCount }, (_, i) => ({
    hpt: i === 0 ? 24 : 20,
    customHeight: true,
  }));

  for (let r = 0; r < rowCount; r++) {
    for (let c = 0; c < colCount; c++) {
      const addr = utils.encode_cell({ r, c });
      if (!ws[addr]) {
        ws[addr] = { t: "s", v: "", z: "@" };
      } else {
        crm050ApplyExcelTextCell(ws[addr]);
      }
      ws[addr].s =
        r === 0 ? CRM050_EXCEL_SAMPLE_HEADER_STYLE : CRM050_EXCEL_SAMPLE_BODY_STYLE;
    }
  }
};

const downloadFile = () => {
  const headers = CRM050_EXCEL_SAMPLE_LABELS;
  const emptyRowCount = 1;
  const rows = [
    headers,
    ...Array.from({ length: emptyRowCount }, () =>
      headers.map(() => "")
    ),
  ];
  const ws = utils.aoa_to_sheet(rows);
  crm050StyleExcelSampleSheet(ws, headers.length, rows.length);

  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, "Sheet1");
  writeFile(wb, `후불 고객 업로드 양식_${crm050ExcelSampleFileStamp()}.xlsx`);
};

const currIFCHK = ref(0);
const currBPID = ref(0);
const lngIFChk = (e) => {
  currIFCHK.value = e;
  if (e == 0) {
    disableButton.value = false;
  } else if (e == 1 || e == 2) {
    disableButton.value = true;
  }
};
const BP_ID = (e) => {
  ////console.log(e);
  currBPID.value = e;
};

const p2cond = ref("");
const p2cond2 = ref("1");
const p2cond3 = ref("");

watch(p2cond2, () => {
  if (p2cond2.value == 1) {
    disabled2.value = false;
  } else {
    disabled2.value = true;
  }
});
</script>

<style scoped>
/* MST01_003INS(메뉴코드 등록) 레이아웃 계열 — CRM01_050INS 전용 */
.crm050-page {
  --crm050-label-col: 7rem;
  --crm050-item-gap: 0.75rem;
  --crm050-control-border: #cbd5e1;
  --crm050-control-focus-border: #3b82f6;
  --crm050-control-h: 1.75rem;
  --crm050-control-radius: 0.375rem;
  --crm050-input-w-scale: 0.7;
  --crm050-excel-path-w-scale: 2;
  --crm050-bar-control-h: 2rem;
}

/* 상단 조회 — 전체 너비 4열 균등 + 조회조건 콤보 120% / 입력 110% */
.crm050-search-bar {
  --crm050-search-control-h: var(--crm050-bar-control-h);
  --crm050-search-gap: 0.5rem;
  --crm050-bar-width-scale: 0.8;
  --crm050-cust-field-scale: 0.8;
  --crm050-affiliate-control-w: 16rem;
  --crm050-cond-input-scale: 0.75;
  --crm050-cond-input-boost: 1.6;
  --crm050-cond-combo-scale: 1.2;
  --crm050-cond-input-extra-scale: 1.1;
  --crm050-bar-inset-start: 3.5rem;
  padding-inline-start: var(--crm050-bar-inset-start);
  padding-inline-end: 1rem;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  column-gap: 1rem;
  align-items: center;
  width: 100%;
  min-height: 4rem;
}

.crm050-search-group {
  display: flex;
  align-items: center;
  gap: var(--crm050-search-gap);
  min-width: 0;
  width: 100%;
}

.crm050-search-group--cust {
  min-width: 0;
}

.crm050-search-group--affiliate {
  min-width: 0;
}

.crm050-search-group--cond {
  min-width: 0;
}

.crm050-search-group--checks {
  align-self: center;
  justify-content: flex-start;
  margin-inline-start: 2.75rem;
}

.crm050-search-label {
  flex-shrink: 0;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
  white-space: nowrap;
}

.crm050-search-group--cust .crm050-search-field {
  flex: 0 1
    calc(
      22rem * var(--crm050-cust-field-scale) * var(--crm050-bar-width-scale)
    );
  width: calc(
    22rem * var(--crm050-cust-field-scale) * var(--crm050-bar-width-scale)
  );
  max-width: calc(
    22rem * var(--crm050-cust-field-scale) * var(--crm050-bar-width-scale)
  );
  min-width: calc(
    11rem * var(--crm050-cust-field-scale) * var(--crm050-bar-width-scale)
  );
}

.crm050-search-group--cond .crm050-search-field--pair {
  flex: 1 1 auto;
  min-width: 0;
  max-width: 100%;
}

.crm050-search-field--pair {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex: 1 1 auto;
  min-width: 0;
}

.crm050-search-bar .crm050-search-control {
  box-sizing: border-box;
  height: var(--crm050-search-control-h);
  min-height: var(--crm050-search-control-h);
  max-height: var(--crm050-search-control-h);
  border: 1px solid var(--crm050-control-border) !important;
  border-radius: var(--crm050-control-radius);
  background-color: #fff;
  padding: 0 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: #374151;
}

.crm050-search-bar select.crm050-search-control {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  padding-right: 1.75rem !important;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='none' stroke='%236b7280' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' d='M3 4.5 6 7.5 9 4.5'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 0.75rem;
}

.crm050-search-bar .crm050-search-control:focus {
  border-color: var(--crm050-control-focus-border) !important;
  outline: none;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.25);
}

.crm050-search-control--affiliate {
  flex: 0 0 auto;
  width: calc(
    var(--crm050-affiliate-control-w) * var(--crm050-bar-width-scale)
  );
  max-width: calc(
    var(--crm050-affiliate-control-w) * var(--crm050-bar-width-scale)
  );
}

/* 조회조건 — 콤보 120%, 입력 110% */
.crm050-search-control--cond {
  flex: 0 0
    calc(
      6.5rem * var(--crm050-bar-width-scale) * var(--crm050-cond-combo-scale)
    );
  width: calc(
    6.5rem * var(--crm050-bar-width-scale) * var(--crm050-cond-combo-scale)
  );
  max-width: calc(
    7.5rem * var(--crm050-bar-width-scale) * var(--crm050-cond-combo-scale)
  );
}

.crm050-search-control--grow {
  flex: 1 1 auto;
  width: calc(
    10rem * var(--crm050-cond-input-scale) * var(--crm050-cond-input-boost) *
      var(--crm050-bar-width-scale) * var(--crm050-cond-input-extra-scale)
  );
  min-width: calc(
    6rem * var(--crm050-cond-input-scale) * var(--crm050-cond-input-boost) *
      var(--crm050-bar-width-scale) * var(--crm050-cond-input-extra-scale)
  );
  max-width: calc(
    16rem * var(--crm050-cond-input-scale) * var(--crm050-cond-input-boost) *
      var(--crm050-bar-width-scale) * var(--crm050-cond-input-extra-scale)
  );
}

.crm050-search-group--cust .crm050-search-field :deep(> .flex) {
  width: 100% !important;
  min-width: 0 !important;
  margin: 0 !important;
  align-items: center !important;
}

.crm050-search-group--cust .crm050-search-field :deep(.custom-select) {
  position: relative !important;
  width: 100% !important;
  min-width: 0 !important;
  height: var(--crm050-search-control-h) !important;
  min-height: var(--crm050-search-control-h) !important;
  max-height: var(--crm050-search-control-h) !important;
  margin: 0 !important;
  font-size: 0.875rem !important;
}

.crm050-search-group--cust .crm050-search-field :deep(> .flex > div) {
  width: 100% !important;
  flex: 1 1 auto !important;
  min-width: 0 !important;
}

.crm050-search-group--cust
  .crm050-search-field
  :deep(.custom-select .vs__dropdown-toggle) {
  box-sizing: border-box;
  display: flex !important;
  align-items: center !important;
  height: var(--crm050-search-control-h) !important;
  min-height: var(--crm050-search-control-h) !important;
  max-height: var(--crm050-search-control-h) !important;
  padding: 0 0.5rem !important;
  border: 1px solid var(--crm050-control-border) !important;
  border-radius: var(--crm050-control-radius) !important;
  background-color: #fff !important;
  overflow: hidden !important;
  box-shadow: none !important;
}

.crm050-search-group--cust
  .crm050-search-field
  :deep(.custom-select.vs--open .vs__dropdown-toggle),
.crm050-search-group--cust
  .crm050-search-field
  :deep(.custom-select .vs__dropdown-toggle:focus) {
  border-color: var(--crm050-control-focus-border) !important;
  outline: none !important;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.25) !important;
}

.crm050-search-group--cust .crm050-search-field :deep(.custom-select .vs__selected),
.crm050-search-group--cust
  .crm050-search-field
  :deep(.custom-select.vs--disabled .vs__selected) {
  display: block !important;
  min-width: 0 !important;
  max-width: 100% !important;
  width: auto !important;
  height: auto !important;
  margin: 0 !important;
  padding: 0 !important;
  font-size: 0.875rem !important;
  line-height: 1.25rem !important;
  color: #374151 !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}

.crm050-search-group--cust
  .crm050-search-field
  :deep(.custom-select .vs__selected-options) {
  flex: 1 1 auto !important;
  min-width: 0 !important;
  max-width: 100% !important;
  padding: 0 !important;
  margin: 0 !important;
  overflow: hidden !important;
}

.crm050-search-group--cust .crm050-search-field :deep(.custom-select .vs__search) {
  flex: 1 1 auto !important;
  width: 100% !important;
  max-width: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
  font-size: 0.875rem !important;
  line-height: 1.25rem !important;
}

.crm050-search-group--cust .crm050-search-field :deep(.custom-select .vs__placeholder) {
  margin: 0 !important;
  padding: 0 !important;
  font-size: 0.875rem !important;
  line-height: 1.25rem !important;
  color: #9ca3af !important;
}

.crm050-search-group--cust .crm050-search-field :deep(.custom-select .vs__actions) {
  flex: 0 0 auto !important;
  padding: 0 0 0 0.125rem !important;
  margin: 0 !important;
}

.crm050-search-group--cust .crm050-search-field :deep(.custom-select .vs__open-indicator) {
  fill: #6b7280 !important;
  transform: scale(0.85) !important;
}

.crm050-search-group--cust .crm050-search-field :deep(.custom-select .vs__clear) {
  margin-right: 0.125rem !important;
}

/* 드롭다운 — 콤보와 동일 너비, 상단 여백 제거 */
.crm050-search-group--cust .crm050-search-field :deep(.custom-select .vs__dropdown-menu) {
  top: 100% !important;
  left: 0 !important;
  right: auto !important;
  width: 100% !important;
  min-width: 100% !important;
  margin-top: 2px !important;
  padding: 0 !important;
  box-sizing: border-box !important;
  border: 1px solid var(--crm050-control-border) !important;
  border-radius: var(--crm050-control-radius) !important;
  box-shadow: 0 4px 6px rgb(0 0 0 / 0.08) !important;
}

.crm050-search-group--cust .crm050-search-field :deep(.custom-select .vs__dropdown-option) {
  padding: 0.375rem 0.5rem !important;
  font-size: 0.875rem !important;
  line-height: 1.25rem !important;
}

.crm050-search-group--cust
  .crm050-search-field
  :deep(.custom-select.vs--disabled .vs__dropdown-toggle) {
  background-color: #fff !important;
  border-color: var(--crm050-control-border) !important;
  opacity: 1 !important;
  cursor: default !important;
}

.crm050-search-group--cust
  .crm050-search-field
  :deep(.custom-select.vs--disabled .vs__selected) {
  color: #374151 !important;
}

.crm050-search-group--cust
  .crm050-search-field
  :deep(.custom-select.vs--disabled .vs__open-indicator),
.crm050-search-group--cust
  .crm050-search-field
  :deep(.custom-select.vs--disabled .vs__clear) {
  display: none !important;
}

/* 체크박스 2열 — 퇴사/휴직 상단, 분실/교체 하단 좌측 */
.crm050-search-checks-grid {
  display: grid;
  grid-template-columns: max-content max-content;
  column-gap: var(--crm050-search-gap);
  row-gap: 0.125rem;
  align-items: center;
}

.crm050-search-check {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  white-space: nowrap;
  font-size: 0.8125rem;
  line-height: 1.25;
  color: #374151;
}

.crm050-search-check input[type="checkbox"] {
  width: 0.875rem;
  height: 0.875rem;
  margin: 0;
  flex-shrink: 0;
}

.crm050-excel-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 1rem;
  min-width: 0;
}

.crm050-excel-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
}

.crm050-excel-group--sheet {
  margin-inline-start: 1.25rem;
}

.crm050-excel-label {
  flex-shrink: 0;
  font-size: 1rem;
  font-weight: 600;
  color: rgb(17 24 39);
  white-space: nowrap;
}

.crm050-excel-sample-btn {
  display: inline-flex !important;
  align-items: center;
  gap: 0.375rem;
  margin-left: auto;
}

.crm050-excel-btn--blocked:not(:disabled) {
  opacity: 0.55;
  cursor: not-allowed;
}

.crm050-excel-sample-icon {
  display: inline-block;
  flex-shrink: 0;
  width: 1rem;
  height: 1rem;
  background-color: #217346;
  mask: url("@/assets/images/button/excel_w.svg") no-repeat center / contain;
  -webkit-mask: url("@/assets/images/button/excel_w.svg") no-repeat center /
    contain;
}

.crm050-excel-input,
.crm050-excel-control {
  box-sizing: border-box;
  height: var(--crm050-bar-control-h);
  min-height: var(--crm050-bar-control-h);
  max-height: var(--crm050-bar-control-h);
  border: 1px solid var(--crm050-control-border) !important;
  border-radius: var(--crm050-control-radius);
  background: #fff;
  padding: 0 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: #374151;
}

.crm050-excel-input:focus,
.crm050-excel-control:focus {
  border-color: var(--crm050-control-focus-border) !important;
  outline: none;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.25);
}

.crm050-excel-input--path {
  min-width: calc(
    14rem * var(--crm050-input-w-scale) * var(--crm050-excel-path-w-scale)
  );
  max-width: calc(
    32rem * var(--crm050-input-w-scale) * var(--crm050-excel-path-w-scale)
  );
}

.crm050-excel-control--sheet {
  width: calc(9rem * var(--crm050-input-w-scale) * 2);
}

.crm050-excel-control {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  padding-right: 1.75rem;
  background-color: #fff;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='none' stroke='%236b7280' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' d='M3 4.5 6 7.5 9 4.5'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 0.75rem;
}

.crm050-control {
  box-sizing: border-box;
  height: var(--crm050-control-h);
  min-height: var(--crm050-control-h);
  max-height: var(--crm050-control-h);
  width: 100%;
  min-width: 0;
  border-radius: var(--crm050-control-radius);
  border: 1px solid var(--crm050-control-border);
  background: #fff;
  padding: 0 0.5rem;
  font-size: 0.875rem;
  line-height: 1;
}

.crm050-page select.crm050-control,
.crm050-page input.crm050-control {
  border: 1px solid var(--crm050-control-border) !important;
  border-radius: var(--crm050-control-radius) !important;
}

.crm050-control:focus,
.crm050-control:focus-visible {
  border-color: var(--crm050-control-focus-border) !important;
  outline: none;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.25);
}

.crm050-control:disabled {
  background: #f3f4f6;
}

.crm050-page select.crm050-control {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  padding-right: 1.75rem !important;
  background-color: #fff;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='none' stroke='%236b7280' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' d='M3 4.5 6 7.5 9 4.5'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 0.75rem;
}

.crm050-check-inline label {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  white-space: nowrap;
  color: #374151;
}

.crm050-lower-body {
  min-height: 0;
  overflow-y: hidden;
}

.crm050-detail-section {
  flex: 1 1 auto;
  min-height: 0;
  overflow: visible;
  display: flex;
  flex-direction: column;
}

.crm050-detail-panel {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-height: 0;
  --crm050-detail-row-min: 2.125rem;
  --crm050-detail-font: 0.875rem;
  --crm050-detail-cell-py: 0.25rem;
  --crm050-detail-input-w-scale: 0.7;
  scrollbar-width: auto;
  scrollbar-color: #1e40af #e8eef7;
}

.crm050-excel-upload--pinned {
  margin-top: auto;
  padding-top: 1rem;
  padding-bottom: 0.25rem;
}

.crm050-detail-panel::-webkit-scrollbar {
  width: 0.75rem;
}

.crm050-detail-panel::-webkit-scrollbar-track {
  background: #e8eef7;
  border-radius: 0.375rem;
}

.crm050-detail-panel::-webkit-scrollbar-thumb {
  background: #1e40af;
  border-radius: 0.375rem;
  border: 2px solid #e8eef7;
}

.crm050-form-grid {
  display: grid;
  grid-template-columns: minmax(5rem, 2fr) minmax(0, 3fr) minmax(5rem, 2fr) minmax(
      0,
      3fr
    );
  grid-template-rows: repeat(7, minmax(var(--crm050-detail-row-min), 1fr));
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  overflow: visible;
  background: #fff;
}

.crm050-detail-panel .crm050-form-grid > * {
  box-sizing: border-box;
  min-height: var(--crm050-detail-row-min);
  align-self: stretch;
  overflow: visible;
}

.crm050-form-label {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  height: 100%;
  min-height: var(--crm050-detail-row-min);
  padding: var(--crm050-detail-cell-py) 0.375rem;
  border: 1px solid #e5e7eb;
  background: #edf2f7;
  color: #5c5c5c;
  font-size: var(--crm050-detail-font, 0.875rem);
  font-weight: 600;
  line-height: 1.25;
  text-align: center;
  word-break: keep-all;
}

.crm050-form-label--required {
  color: #1d4ed8;
  font-weight: 700;
  background: #fffbeb;
}

.crm050-form-label__asterisk {
  color: #dc2626;
  font-weight: 700;
  margin-right: 0.25rem;
}

.crm050-excel-upload-title {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
}

.crm050-excel-upload-icon {
  display: inline-block;
  flex-shrink: 0;
  width: 1.125rem;
  height: 1.125rem;
  background-color: #217346;
  mask: url("@/assets/images/button/excel_w.svg") no-repeat center / contain;
  -webkit-mask: url("@/assets/images/button/excel_w.svg") no-repeat center /
    contain;
}

.crm050-form-value {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  height: 100%;
  min-height: var(--crm050-detail-row-min);
  min-width: 0;
  padding: var(--crm050-detail-cell-py) 0.375rem;
  border: 1px solid #e5e7eb;
  background: #fff;
  overflow: visible;
}

.crm050-form-value--inline {
  flex-wrap: nowrap;
  align-items: center;
  gap: 0.5rem 0.875rem;
}

.crm050-form-value--card {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: var(--crm050-detail-cell-py) 0.375rem;
}

.crm050-form-value--card .crm050-control--field {
  flex: 0 1 calc(100% * var(--crm050-detail-input-w-scale));
  min-width: 0;
  max-width: calc(100% * var(--crm050-detail-input-w-scale));
  width: auto;
}

.crm050-detail-panel .crm050-form-value:not(.crm050-form-value--card):not(
    .crm050-form-value--radio
  ):not(.crm050-form-value--inline)
  .crm050-control--field,
.crm050-detail-panel
  .crm050-form-value:not(.crm050-form-value--radio)
  select.crm050-control--field {
  width: calc(100% * var(--crm050-detail-input-w-scale));
  max-width: calc(100% * var(--crm050-detail-input-w-scale));
  box-sizing: border-box;
}

.crm050-form-value--radio {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  align-items: center;
  justify-items: center;
  width: 100%;
  padding: 0 0.25rem;
}

.crm050-detail-note {
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  gap: 0.375rem;
  flex-shrink: 0;
  width: 100%;
  margin-top: auto;
  margin-bottom: 0;
  padding: 0.625rem 0.375rem 0.25rem 0;
  font-size: var(--crm050-detail-font);
  font-weight: 700;
  line-height: 1.5;
  color: #6d28d9;
  word-break: keep-all;
}

.crm050-detail-note__icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  margin-top: 0.125rem;
  color: #6d28d9;
}

.crm050-detail-note__text {
  text-align: right;
}

.crm050-detail-panel .crm050-form-value--radio label {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  width: 100%;
  font-size: var(--crm050-detail-font);
  line-height: 1.25;
  white-space: nowrap;
  color: #374151;
}

.crm050-detail-panel .crm050-form-value--inline label {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: var(--crm050-detail-font);
  line-height: 1.25;
  white-space: nowrap;
  color: #374151;
  flex-shrink: 0;
}

.crm050-detail-panel .crm050-form-value--radio input[type="radio"],
.crm050-detail-panel .crm050-form-value--inline input[type="radio"],
.crm050-detail-panel .crm050-form-value--inline input[type="checkbox"] {
  width: 0.875rem;
  height: 0.875rem;
  margin: 0;
  flex-shrink: 0;
}

.crm050-detail-panel .crm050-form-grid .crm050-control,
.crm050-detail-panel .crm050-form-grid .crm050-control--field {
  box-sizing: border-box;
  flex-shrink: 0;
  height: min(
    2.25rem,
    calc(100% - (var(--crm050-detail-cell-py) * 2) - 2px)
  );
  min-height: 1.625rem;
  font-size: var(--crm050-detail-font);
  line-height: 1.2;
  border: 1px solid var(--crm050-control-border) !important;
  border-radius: var(--crm050-control-radius) !important;
}

.crm050-detail-panel .crm050-form-grid .crm050-control--field,
.crm050-detail-panel
  .crm050-form-grid
  select.crm050-control--field {
  width: calc(100% * var(--crm050-detail-input-w-scale));
  max-width: calc(100% * var(--crm050-detail-input-w-scale));
}

.crm050-control--amount {
  text-align: right !important;
}

.crm050-sub-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  height: min(
    2.25rem,
    calc(100% - (var(--crm050-detail-cell-py) * 2) - 2px)
  );
  min-height: 1.625rem;
  padding: 0 0.625rem;
  font-size: var(--crm050-detail-font);
  font-weight: 600;
  line-height: 1.2;
  white-space: nowrap;
  color: #374151;
  border: 1px solid #6b7280;
  border-radius: 0.375rem;
  background: #fff;
}

.crm050-sub-btn:hover:not(:disabled) {
  background: #eff6ff;
  border-color: #60a5fa;
  color: #1d4ed8;
}

/* 카드변경 팝업 */
.crm050-card-modal {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(0 0 0 / 0.4);
}

.crm050-card-modal__dialog {
  width: min(28rem, 92vw);
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  overflow: hidden;
  box-shadow: 0 10px 25px rgb(0 0 0 / 0.15);
}

.crm050-card-modal__title {
  margin: 0;
  padding: 0.625rem 1rem;
  background: #e2d9e2;
  border-bottom: 1px solid #c8bcc8;
  color: #374151;
  font-size: 0.9375rem;
  font-weight: 600;
  text-align: center;
  line-height: 1.4;
}

.crm050-card-modal__body {
  padding: 1rem;
}

.crm050-card-modal__grid {
  display: grid;
  grid-template-columns: minmax(5.5rem, 1fr) minmax(0, 2.2fr);
  grid-auto-rows: minmax(2.125rem, auto);
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  overflow: hidden;
  background: #fff;
}

.crm050-card-modal__grid > .crm050-form-label,
.crm050-card-modal__grid > .crm050-form-value {
  min-height: 2.125rem;
}

.crm050-card-modal__grid .crm050-form-value .crm050-control--field {
  width: 100%;
  max-width: 100%;
}

.crm050-card-modal__grid .crm050-form-value--radio label {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  width: 100%;
  font-size: var(--crm050-detail-font, 0.875rem);
  line-height: 1.25;
  white-space: nowrap;
  color: #374151;
}

.crm050-card-modal__actions {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.crm050-card-modal__btn {
  min-width: 5.5rem;
  height: 2.25rem;
  min-height: 2.25rem;
}

/* 노트북 등 세로 공간 부족 — 폼 행 고정·안내 문구 하단 우측 배치 */
@media (max-height: 920px) {
  .crm050-detail-panel {
    --crm050-detail-row-min: 1.75rem;
    --crm050-detail-cell-py: 0.1875rem;
  }

  .crm050-form-grid {
    flex: 0 0 auto;
    grid-template-rows: repeat(7, minmax(var(--crm050-detail-row-min), auto));
  }

  .crm050-detail-panel .crm050-form-grid .crm050-control,
  .crm050-detail-panel .crm050-form-grid .crm050-control--field,
  .crm050-sub-btn {
    height: 1.625rem;
    min-height: 1.5rem;
  }

  .crm050-detail-note {
    padding-top: 0.75rem;
    padding-bottom: 0.375rem;
  }

  .crm050-excel-upload--pinned {
    padding-top: 0.75rem;
  }
}
</style>
