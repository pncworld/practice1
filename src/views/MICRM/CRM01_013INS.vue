<!-- /*--############################################################################
# Filename : CRM01_013INS.vue                                                  
# Description : 마스터관리 > 직원후불 마스터 > 직원후불 고객정보관리            
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
          :disabled="crm013ToolbarSaveDisabled">
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

    <div
      class="crm050-search-bar crm050-search-bar--013 mt-3 w-full shrink-0 rounded-lg bg-gray-200 py-2">
      <div class="crm050-search-group crm050-search-group--cust">
        <span class="crm050-search-label">고객사명</span>
        <div class="crm050-search-field min-w-0">
          <PickCustCompany
            :setAPI="1"
            omit-label
            filter-bar-align
            @excelStore="excelStore"
            @lngIFChk="lngIFChk"
            @BP_ID="BP_ID"
            @lngStoreCode="setCompanyCode"></PickCustCompany>
        </div>
      </div>
      <div class="crm050-search-group crm050-search-group--cond">
        <span class="crm050-search-label">조회조건</span>
        <div class="crm050-search-field crm050-search-field--pair min-w-0">
          <select class="crm050-search-control crm050-search-control--cond" v-model="cond">
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
        <div class="crm050-search-checks-grid crm050-search-checks-grid--013">
          <label class="crm050-search-check" for="crm01-013-fire"
            ><input type="checkbox" v-model="cond3" id="crm01-013-fire" />퇴사자
            제외</label
          >
          <label class="crm050-search-check" for="crm01-013-lost"
            ><input type="checkbox" v-model="cond4" id="crm01-013-lost" />분실/교체
            제외</label
          >
        </div>
      </div>
    </div>

    <div class="crm050-content min-h-0 flex-1">
    <div class="crm050-grid-wrap px-2">
      <Realgrid
        class="h-full w-full"
        :progname="'CRM01_013INS_VUE'"
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
        :documentTitle="'CRM01_013INS'"
        :exporttoExcel="exExcel"></Realgrid>
    </div>

    <div class="crm050-lower-body px-2">
      <div class="crm050-detail-section shrink-0">
        <div class="crm050-detail-panel shrink-0 flex flex-col gap-2 pt-0">
          <div class="crm050-form-grid crm050-form-grid--013 w-full shrink-0">
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
                :disabled="disableButton || !openCardChange">
                카드변경
              </button>
            </div>
            <div class="crm050-form-label">한도금액</div>
            <div class="crm050-form-value">
              <input
                type="number"
                class="crm050-control crm050-control--field crm050-control--amount w-full"
                v-model="gridvalue2"
                name="dblLimitAmt"
                @input="updateGridValue" />
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

            <div class="crm050-form-label">소속사코드</div>
            <div class="crm050-form-value">
              <input
                type="text"
                class="crm050-control crm050-control--field w-full"
                v-model="gridvalue9"
                name="strCustCompCode"
                @input="updateGridValue" />
            </div>
            <div class="crm050-form-label">소속사명</div>
            <div class="crm050-form-value">
              <input
                type="text"
                class="crm050-control crm050-control--field w-full"
                v-model="gridvalue11"
                name="strCustCompName"
                @input="updateGridValue" />
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
            <div class="crm050-form-label">전화번호</div>
            <div class="crm050-form-value">
              <input
                type="text"
                class="crm050-control crm050-control--field w-full"
                v-model="gridvalue7"
                name="strTelNo"
                @input="updateGridValue" />
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
            <div class="crm050-form-value crm050-form-value--radio crm050-form-value--radio-2">
              <label for="crm013-cond-normal"
                ><input
                  type="radio"
                  v-model="gridvalue10"
                  name="strSaleCustStatus"
                  @input="updateGridValue"
                  id="crm013-cond-normal"
                  :disabled="!disabled"
                  value="0" />정상</label
              >
              <label for="crm013-cond-fire"
                ><input
                  type="radio"
                  v-model="gridvalue10"
                  name="strSaleCustStatus"
                  @input="updateGridValue"
                  id="crm013-cond-fire"
                  value="1" />퇴사</label
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
              <label for="crm013-cond4"
                ><input
                  type="radio"
                  name="strSaleCardStatus"
                  id="crm013-cond4"
                  disabled
                  value="0"
                  v-model="gridvalue12" />정상</label
              >
              <label for="crm013-cond5"
                ><input
                  type="radio"
                  name="strSaleCardStatus"
                  id="crm013-cond5"
                  disabled
                  value="1"
                  v-model="gridvalue12" />교체</label
              >
              <label for="crm013-cond6"
                ><input
                  type="radio"
                  name="strSaleCardStatus"
                  id="crm013-cond6"
                  disabled
                  value="2"
                  v-model="gridvalue12" />분실</label
              >
            </div>

            <div class="crm050-form-label">주소</div>
            <div class="crm050-form-value crm050-form-value--span-3">
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
              직원후불 기준정보 관리에 한도구분이 '한도없음' 이면 한도금액을 등록 해도
              한도금액이 0으로 반영됩니다.
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
              :class="popupToolbarBtnClass"
              class="shrink-0"
              :disabled="crm013ExcelActionDisabled"
              @click="beforeFileSelect">
              찾아보기...
            </button>
          </div>
          <div class="crm050-excel-group crm050-excel-group--sheet">
            <span class="crm050-excel-label">Sheet :</span>
            <select
              class="crm050-excel-control crm050-excel-control--sheet shrink-0"
              v-model="excelcond"
              :disabled="crm013ExcelActionDisabled"
              @change="onExcelSheetChange">
              <option :value="i.lngCode" v-for="i in SheetList" :key="i.lngCode">
                {{ i.strName }}
              </option>
            </select>
            <div class="crm013-excel-upload-wrap shrink-0">
              <div
                v-if="crm013ExcelUploadReady"
                class="crm013-excel-upload-bubble"
                role="status"
                aria-live="polite">
                <span class="crm013-excel-upload-bubble__icon" aria-hidden="true"
                  >✨</span
                >
                업로드 버튼을 눌러주세요.
              </div>
              <button
                type="button"
                class="button save md:w-auto"
                :class="{ 'crm013-excel-upload-btn--blink': crm013ExcelUploadReady }"
                :disabled="crm013ExcelUploadBtnDisabled"
                @click="saveButton3">
                업로드
              </button>
            </div>
            <button
              type="button"
              :class="popupToolbarBtnClass"
              class="shrink-0"
              :disabled="crm013ExcelResetDisabled"
              @click="resetExcelUploadPanel">
              초기화
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
    </div>

    <div v-if="visible" class="crm050-card-modal" @click.self="closeCardChangeModal">
      <div
        class="crm050-card-modal__dialog"
        role="dialog"
        aria-labelledby="crm013-card-modal-title">
        <h2 id="crm013-card-modal-title" class="crm050-card-modal__title">
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
            <div class="crm050-form-value crm050-form-value--card-newno">
              <div class="crm-card-newno-field-wrap">
                <div
                  v-if="cardChangeNewCardWarn"
                  class="crm-card-newno-warn-bubble"
                  role="alert"
                  aria-live="polite">
                  <span class="crm-card-newno-warn-bubble__icon" aria-hidden="true"
                    >⚠️</span
                  >
                  카드번호를 입력해 주시오.
                </div>
                <input
                  type="text"
                  class="crm050-control crm050-control--field"
                  v-model="pcond4"
                  @keydown="onCardChangeNewCardKeydown"
                  @input="onCardChangeNewCardInput"
                  @paste="onCardChangeNewCardPaste" />
              </div>
            </div>
            <div class="crm050-form-label crm050-form-label--required">
              <span class="crm050-form-label__asterisk" aria-hidden="true">*</span>
              변경 유형
            </div>
            <div class="crm050-form-value crm050-form-value--radio crm050-form-value--radio-2">
              <label for="crm013-card-change-type-1">
                <input type="radio" id="crm013-card-change-type-1" v-model="pcond5" value="1" />
                교체
              </label>
              <label for="crm013-card-change-type-2">
                <input type="radio" id="crm013-card-change-type-2" v-model="pcond5" value="2" />
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
              @click="closeCardChangeModal">
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="openpopup2"
      class="crm050-card-modal"
      @click.self="openpopup2 = false">
      <div
        class="crm050-card-modal__dialog crm050-card-modal__dialog--wide"
        role="dialog"
        aria-labelledby="crm013-receive-modal-title">
        <h2 id="crm013-receive-modal-title" class="crm050-card-modal__title">
          고객정보 수신 작업
        </h2>
        <div class="crm050-card-modal__body">
          <div class="crm050-card-modal__grid">
            <div class="crm050-form-label">사업장명</div>
            <div class="crm050-form-value">
              <input
                type="text"
                class="crm050-control crm050-control--field"
                v-model="p2cond"
                disabled />
            </div>
            <div class="crm050-form-label">수신유형</div>
            <div class="crm050-form-value crm050-form-value--radio crm050-form-value--radio-2">
              <label for="crm013-p2cond2"
                ><input type="radio" v-model="p2cond2" value="1" id="crm013-p2cond2" />수정내역
                수신</label
              >
              <label for="crm013-p2cond22"
                ><input type="radio" v-model="p2cond2" value="0" id="crm013-p2cond22" />전체
                수신</label
              >
            </div>
            <div class="crm050-form-label">수정일자</div>
            <div class="crm050-form-value">
              <input
                type="date"
                class="crm050-control crm050-control--field"
                v-model="p2cond3"
                :disabled="disabled2" />
            </div>
          </div>
          <div class="crm050-card-modal__actions">
            <button
              type="button"
              class="whitebutton crm050-sub-btn crm050-card-modal__btn"
              @click="receiveButton2">
              수신
            </button>
            <button
              type="button"
              class="whitebutton crm050-sub-btn crm050-card-modal__btn"
              @click="openpopup2 = false">
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { setEmployeeInfo, setEmployeeInfo2 } from "@/api/etc";
import {
  deleteCustomors2,
  getAccCust,
  saveCustomorsInfo,
  saveEmployeeCustInfo,
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

import { insertPageLog } from "@/customFunc/customFunc";
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
import { read, utils } from "xlsx-js-style";
/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  if (store.state.userData.lngStoreGroup == "3069") {
    showReceive.value = true;
  }
});

const disableButton = ref(false);
const store = useStore();
const groupCd = ref();

/** 엑셀 업로드 패널 — CRM01_050INS와 동일 버튼 형식 */
const popupToolbarBtnClass =
  "whitebutton !h-9 !px-5 !py-2 !text-sm !font-semibold !border-gray-500 !text-gray-700 hover:!bg-blue-50 hover:!border-blue-400 disabled:opacity-50 disabled:pointer-events-none";
const excelFileName = ref("");
const excelDataLoaded = ref(false);
const excelUploading = ref(false);

const crm013ExcelActionDisabled = computed(() => disableButton.value);

/** 엑셀 Sheet 로드 후 업로드 전·업로드 API 진행 중 저장 차단 */
const crm013ToolbarSaveDisabled = computed(
  () =>
    disableButton.value || excelDataLoaded.value || excelUploading.value
);

/** 파일 선택 + Sheet 불러오기 완료 시에만 업로드 활성화 (050과 동일) */
const crm013ExcelUploadBtnDisabled = computed(
  () =>
    crm013ExcelActionDisabled.value ||
    !excelFileName.value?.trim() ||
    !excelDataLoaded.value
);

/** Sheet 데이터 로드 완료 + 업로드 가능 시 버튼 강조 */
const crm013ExcelUploadReady = computed(
  () => excelDataLoaded.value && !crm013ExcelUploadBtnDisabled.value
);

const crm013ExcelResetDisabled = computed(
  () =>
    crm013ExcelActionDisabled.value ||
    (!excelFileName.value?.trim() &&
      SheetList.value.length === 0 &&
      !excelDataLoaded.value)
);

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
const gridvalue12 = ref("");
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
    (cond3.value == true ? "퇴사자 제외 ," : "" + " , ") +
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
/**
 *  조회 함수
 */
const cond = ref(1);
const cond2 = ref("");
const cond3 = ref(true);
const cond4 = ref(true);
const disabled = ref(true);
const disabled2 = ref(false);
const searchButton = async () => {
  if (CompanyCode.value == 0) {
    Swal.fire({
      title: "경고",
      text: "사업장명을 먼저 선택해주세요.",
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
    let pcond6 = "0";
    if (cond3.value == true && cond4.value == true) {
      pcond6 = "12";
    } else if (cond3.value == false && cond4.value == true) {
      pcond6 = "2";
    } else if (cond3.value == true && cond4.value == false) {
      pcond6 = "1";
    } else {
      pcond6 = "0";
    }
    const res = await getAccCust(
      CompanyCode.value,
      pcond,
      pcond2,
      pcond3,
      pcond4,
      pcond5,
      pcond6
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
  addrowProp.value = `strSaleCardNo,strSaleCustID,strSaleCustName,strTelNo,strCustCompCode,strCustCompName,strCustDeptCode,strCustDeptName,strAddress,dtmInsDateTime,strSaleCustStatusTxt,strSaleCardStatusTxt,dblLimitAmt,dblSaleAmt,dblRemAmt,strSaleCustStatus,strSaleCardStatus,strLimitModify`;
  const currdate = new Date().toISOString().split("T")[0];
  addrowDefault.value = `,,,,,,,,,${currdate},정상,정상,0,0,0,0,0,0`;

  disabled.value = false;
  openCardChange.value = false;
  addRow4.value = !addRow4.value;
};

const deleteButton = () => {
  deleted.value = !deleted.value;
};
/**
 *  저장 버튼 함수
 */

const saveButton = async () => {
  if (excelDataLoaded.value || excelUploading.value) {
    await Swal.fire({
      title: "안내",
      text: "엑셀 업로드 대기 중입니다. 하단 「업로드」 버튼을 눌러 주세요.",
      icon: "info",
      confirmButtonText: "확인",
    });
    return;
  }
  if (
    stateRows.value.updated.length == 0 &&
    stateRows.value.created.length == 0 &&
    stateRows.value.deleted.length == 0
  ) {
    Swal.fire({
      title: "경고",
      text: `변경된 사항이 없습니다.`,
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  const custidsl = updateRowData.value
    .filter(
      (item, index) =>
        stateRows.value.updated.includes(index) ||
        stateRows.value.created.includes(index)
    )
    .map((item) => item.strSaleCustID)
    .filter(
      (item2) => item2 == "" || item2 == undefined || item2 == null
    ).length;

  const cardnos = updateRowData.value
    .filter(
      (item, index) =>
        stateRows.value.updated.includes(index) ||
        stateRows.value.created.includes(index)
    )
    .map((item) => item.strSaleCardNo)
    .filter(
      (item2) => item2 == "" || item2 == undefined || item2 == null
    ).length;

  const custnms = updateRowData.value
    .filter(
      (item, index) =>
        stateRows.value.updated.includes(index) ||
        stateRows.value.created.includes(index)
    )
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

  if (stateRows.value.deleted.length > 0) {
    const custSts = updateRowData.value
      .filter((item, index) => stateRows.value.deleted.includes(index))
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
    if (stateRows.value.deleted.length > 0) {
      const compcds = updateRowData.value
        .filter((item, index) => stateRows.value.deleted.includes(index))
        .map((item) => item.strSaleCustID)
        .join("\u200b");
      const cardNos = updateRowData.value
        .filter((item, index) => stateRows.value.deleted.includes(index))
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
          const res = await deleteCustomors2(
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

    const custids = updateRowData.value
      .filter(
        (item, index) =>
          stateRows.value.updated.includes(index) ||
          stateRows.value.created.includes(index)
      )
      .map((item) => item.strSaleCustID)
      .join("\u200b");
    const limitAmt = updateRowData.value
      .filter(
        (item, index) =>
          stateRows.value.updated.includes(index) ||
          stateRows.value.created.includes(index)
      )
      .map((item) => item.dblLimitAmt)
      .join("\u200b");
    const custStatus = updateRowData.value
      .filter(
        (item, index) =>
          stateRows.value.updated.includes(index) ||
          stateRows.value.created.includes(index)
      )
      .map((item) => item.strSaleCustStatus)
      .join("\u200b");
    const cardStatus = updateRowData.value
      .filter(
        (item, index) =>
          stateRows.value.updated.includes(index) ||
          stateRows.value.created.includes(index)
      )
      .map((item) => item.strSaleCardStatus)
      .join("\u200b");
    const cardNos = updateRowData.value
      .filter(
        (item, index) =>
          stateRows.value.updated.includes(index) ||
          stateRows.value.created.includes(index)
      )
      .map((item) => item.strSaleCardNo)
      .join("\u200b");
    const custNms = updateRowData.value
      .filter(
        (item, index) =>
          stateRows.value.updated.includes(index) ||
          stateRows.value.created.includes(index)
      )
      .map((item) => item.strSaleCustName)
      .join("\u200b");
    const deptCds = updateRowData.value
      .filter(
        (item, index) =>
          stateRows.value.updated.includes(index) ||
          stateRows.value.created.includes(index)
      )
      .map((item) => item.strCustDeptCode)
      .join("\u200b");
    const deptNms = updateRowData.value
      .filter(
        (item, index) =>
          stateRows.value.updated.includes(index) ||
          stateRows.value.created.includes(index)
      )
      .map((item) => item.strCustDeptName)
      .join("\u200b");
    const telNos = updateRowData.value
      .filter(
        (item, index) =>
          stateRows.value.updated.includes(index) ||
          stateRows.value.created.includes(index)
      )
      .map((item) => item.strTelNo)
      .join("\u200b");
    const compCds = updateRowData.value
      .filter(
        (item, index) =>
          stateRows.value.updated.includes(index) ||
          stateRows.value.created.includes(index)
      )
      .map((item) => item.strCustCompCode)
      .join("\u200b");
    const compNms = updateRowData.value
      .filter(
        (item, index) =>
          stateRows.value.updated.includes(index) ||
          stateRows.value.created.includes(index)
      )
      .map((item) => item.strCustCompName)
      .join("\u200b");
    const address = updateRowData.value
      .filter(
        (item, index) =>
          stateRows.value.updated.includes(index) ||
          stateRows.value.created.includes(index)
      )
      .map((item) => item.strAddress)
      .join("\u200b");
    const res = await saveCustomorsInfo(
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
      compNms,
      address,
      store.state.userData.lngSequence
    );
    ////console.log(res);
    if (res.data.RESULT_CD == "00") {
      Swal.fire({
        title: "성공",
        text: `저장이 완료되었습니다.`,
        icon: "success",
        confirmButtonText: "확인",
      });
      // return;
    }
    searchButton();
  } catch (error) {
    ////console.log(error);
    return;
  } finally {
    store.state.loading = false;
  }
};

const saveButton2 = async () => {
  if (isCardChangeNewCardBlank(pcond4.value)) {
    cardChangeNewCardWarn.value = true;
    return;
  }

  try {
    store.state.loading = true;
    const res = await saveEmployeeCustInfo(
      CompanyCode.value,
      pcond2.value,
      pcond3.value,
      pcond4.value,
      pcond5.value,
      store.state.userData.lngSequence
    );
    ////console.log(res);

    if (res.data.List[0].strErr == "0000") {
      const custId = pcond2.value;
      await Swal.fire({
        title: "성공",
        text: `${res.data.List[0].strErrMsg}`,
        icon: "success",
        confirmButtonText: "확인",
      });
      applyCardChangeToGrid();
      await searchButton();
      restoreSelectionAfterCardChange(custId);
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
    closeCardChangeModal();
  }
};

const saveButton3 = async () => {
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
    excelUploading.value = true;
    store.state.loading = true;

    const custids = updateRowData.value
      .map((item) => item.strSaleCustID || "")
      .join("\u200b");
    const limitAmt = updateRowData.value
      .map((item) => item.dblLimitAmt || 0)
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
    const compNms = updateRowData.value
      .map((item) => item.strCustCompName || "")
      .join("\u200b");
    const address = updateRowData.value
      .map((item) => item.strAddress || "")
      .join("\u200b");
    const res = await saveCustomorsInfo(
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
      compNms,
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
    excelUploading.value = false;
    store.state.loading = false;
  }
};

const selectedIndex2 = (e) => {
  changeRow.value = e;
};
/**
 * 데이터셋 상세정보 셋팅
 */

const clickedRowData3 = (e) => {
  ////console.log(e);
  gridvalue1.value = e[0];
  gridvalue2.value = e[12];
  gridvalue3.value = e[1];
  gridvalue4.value = e[13];
  gridvalue5.value = e[2];
  gridvalue6.value = e[14];
  gridvalue7.value = e[3];
  gridvalue8.value =
    e[9] != undefined && e[9] != "" ? e[9].toISOString().split("T")[0] : "";
  gridvalue9.value = e[4];
  gridvalue10.value = e[15];
  gridvalue11.value = e[5];
  gridvalue12.value = e[16];
  gridvalue13.value = e[6];
  gridvalue14.value = e[8];
  gridvalue15.value = e[7];
};
/**
 * 페이지 매장 코드 세팅
 */
const visible = ref(false);

const closeCardChangeModal = () => {
  visible.value = false;
  pcond4.value = "";
  pcond5.value = 1;
  cardChangeNewCardWarn.value = false;
};

const getCardChangeStatus = () => {
  if (String(pcond5.value) === "2") {
    return { code: "2", text: "분실" };
  }
  return { code: "1", text: "교체" };
};

/** 카드변경 성공 — 그리드·상세에 신규 카드번호 반영 */
const applyCardChangeToGrid = () => {
  const newCardNo = String(pcond4.value ?? "").trim();
  const custId = String(pcond2.value ?? "").trim();
  if (!newCardNo || !custId) {
    return;
  }
  const { code, text } = getCardChangeStatus();
  const patchRow = (row) => ({
    ...row,
    strSaleCardNo: newCardNo,
    strSaleCardStatus: code,
    strSaleCardStatusTxt: text,
  });

  let idx = Number(changeRow.value);
  if (Number.isNaN(idx) || idx < 0 || !updateRowData.value[idx]) {
    idx = updateRowData.value.findIndex(
      (r) => String(r.strSaleCustID) === custId
    );
  }
  if (idx < 0 || !updateRowData.value[idx]) {
    return;
  }

  updateRowData.value[idx] = patchRow(updateRowData.value[idx]);
  rowData.value = JSON.parse(JSON.stringify(updateRowData.value));
  changeRow.value = idx;
  fillDetailFromRow(updateRowData.value[idx]);
};

const fillDetailFromRow = (row) => {
  if (!row) {
    return;
  }
  gridvalue1.value = row.strSaleCardNo ?? "";
  gridvalue2.value = row.dblLimitAmt ?? "";
  gridvalue3.value = row.strSaleCustID ?? "";
  gridvalue4.value = row.dblSaleAmt ?? "";
  gridvalue5.value = row.strSaleCustName ?? "";
  gridvalue6.value = row.dblRemAmt ?? "";
  gridvalue7.value = row.strTelNo ?? "";
  gridvalue8.value = row.dtmInsDateTime
    ? String(row.dtmInsDateTime).split("T")[0]
    : "";
  gridvalue9.value = row.strCustCompCode ?? "";
  gridvalue10.value = row.strSaleCustStatus ?? "0";
  gridvalue11.value = row.strCustCompName ?? "";
  gridvalue12.value = String(row.strSaleCardStatus ?? "0");
  gridvalue13.value = row.strCustDeptCode ?? "";
  gridvalue14.value = row.strAddress ?? "";
  gridvalue15.value = row.strCustDeptName ?? "";
};

const restoreSelectionAfterCardChange = (custId) => {
  const idx = updateRowData.value.findIndex(
    (r) => String(r.strSaleCustID) === String(custId)
  );
  if (idx < 0) {
    return;
  }
  changeRow.value = idx;
  fillDetailFromRow(updateRowData.value[idx]);
};

const fillCardChangePopup = () => {
  pcond.value = gridvalue5.value;
  pcond2.value = gridvalue3.value;
  pcond3.value = gridvalue1.value;
  pcond4.value = "";
  pcond5.value = 1;
  cardChangeNewCardWarn.value = false;
};

const isCardChangeNewCardBlank = (value) => String(value ?? "").trim() === "";

const sanitizeCardChangeNewCardNo = (value) =>
  String(value ?? "").replace(/\s/g, "");

const cardChangeNewCardWarn = ref(false);

const onCardChangeNewCardKeydown = (event) => {
  if (event.key === " " || event.code === "Space") {
    event.preventDefault();
  }
};

const onCardChangeNewCardInput = () => {
  const sanitized = sanitizeCardChangeNewCardNo(pcond4.value);
  if (pcond4.value !== sanitized) {
    pcond4.value = sanitized;
  }
  if (!isCardChangeNewCardBlank(sanitized)) {
    cardChangeNewCardWarn.value = false;
  }
};

const onCardChangeNewCardPaste = (event) => {
  event.preventDefault();
  const pasteText = sanitizeCardChangeNewCardNo(
    (event.clipboardData || window.clipboardData)?.getData("text") ?? ""
  );
  const input = event.target;
  const start = input.selectionStart ?? 0;
  const end = input.selectionEnd ?? 0;
  const current = sanitizeCardChangeNewCardNo(pcond4.value);
  const next = current.slice(0, start) + pasteText + current.slice(end);
  pcond4.value = next;
  if (!isCardChangeNewCardBlank(next)) {
    cardChangeNewCardWarn.value = false;
  }
  nextTick(() => {
    const pos = start + pasteText.length;
    input.setSelectionRange(pos, pos);
  });
};

const cardChange = () => {
  if (openCardChange.value == false) {
    return;
  }
  fillCardChangePopup();
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

  if (name == "strSaleCustStatus") {
    ////console.log(value);
    changeColid.value = "strSaleCustStatusTxt";
    changeValue.value = value == 0 ? "정상" : "퇴사";
    changeNow.value = !changeNow.value;
    await nextTick();
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
};
const updateRowData = ref([]);

/**
 * 입력창 수정 데이터 갱신
 */
const stateRows = ref([]);
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
  gridvalue12.value = "1";
  gridvalue13.value = "";
  gridvalue14.value = "";
  gridvalue15.value = "";

  openCardChange.value = false;

  resetExcelUploadControls();
};
const fileInput = ref(null);
const SheetList = ref([]);
const currentFile = ref(null);
const excelcond = ref(1);

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

/** 엑셀 업로드 패널 — 페이지 최초 로드와 동일 상태 + 그리드 재조회 */
const resetExcelUploadPanel = async () => {
  resetExcelUploadControls();
  if (afterSearch.value) {
    await searchButton();
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
  fileInput.value.click();
};

const onExcelSheetChange = async () => {
  if (!currentFile.value) {
    excelDataLoaded.value = false;
    return;
  }
  await readFileWithArrayBuffer(currentFile.value);
};

const handleFileChange = async (e) => {
  const file = e.target.files[0];
  currentFile.value = file;
  excelFileName.value = file?.name ?? "";
  excelcond.value = 1;
  excelDataLoaded.value = false;
  SheetList.value = [];
  if (file) {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = read(arrayBuffer, { type: "array" });

    const sheetLength = workbook.SheetNames.length;

    for (let i = 0; i < sheetLength; i++) {
      SheetList.value.push({ lngCode: i + 1, strName: workbook.SheetNames[i] });
    }

    await readFileWithArrayBuffer(currentFile.value);
  }
  e.target.value = "";
};

async function readFileWithArrayBuffer(file) {
  const arrayBuffer = await file.arrayBuffer();
  // XLSX 라이브러리에서 arrayBuffer 사용 가능
  const workbook = read(arrayBuffer, { type: "array" });

  const sheetName = workbook.SheetNames[excelcond.value - 1];
  const sheet = workbook.Sheets[sheetName];
  const jsonData = utils.sheet_to_json(sheet, { header: 1 });

  const header = [
    "strSaleCardNo",
    "strSaleCustID",
    "strSaleCustName",
    "strTelNo",
    "strCustCompCode",
    "strCustCompName",
    "strCustDeptCode",
    "strCustDeptName",
    "dblLimitAmt",
  ];

  const rows = jsonData.slice(1); // 실제 데이터 행들

  rowData.value = rows.map((row) => {
    const obj = {};
    header.forEach((key, i) => {
      obj[key] = row[i];
    });
    return obj;
  });
  rowData.value = rowData.value.map((item) => ({
    ...item,
    strSaleCustStatus: 0,
    strSaleCustStatusTxt: "정상",
    strSaleCardStatus: 0,
    strSaleCardStatusTxt: "정상",
    strAddress: item.strAddress || "",
    dblSaleAmt: item.dblSaleAmt || 0,
    dblRemAmt: item.dblRemAmt || 0,
  }));
  updateRowData.value = JSON.parse(JSON.stringify(rowData.value));
  excelDataLoaded.value = true;
  return jsonData;
}

const downloadFile = () => {
  const link = document.createElement("a");
  link.href = "/SaleCustList.xlsx"; // public 폴더 또는 정적 자원 경로
  link.download = "SaleCustList.xlsx";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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
/* CRM01_013INS — CRM01_050INS 디자인 통일 (공유 스타일) */
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

.crm050-content {
  flex: 1 1 auto;
  min-height: 0;
  display: grid;
  grid-template-rows: minmax(8rem, 1fr) auto;
  overflow: hidden;
}

.crm050-grid-wrap {
  min-height: 0;
  min-width: 0;
  overflow: hidden;
}

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

.crm050-search-bar--013 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.crm050-search-group {
  display: flex;
  align-items: center;
  gap: var(--crm050-search-gap);
  min-width: 0;
  width: 100%;
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
  flex: 0 1 calc(22rem * var(--crm050-cust-field-scale) * var(--crm050-bar-width-scale));
  width: calc(22rem * var(--crm050-cust-field-scale) * var(--crm050-bar-width-scale));
  max-width: calc(22rem * var(--crm050-cust-field-scale) * var(--crm050-bar-width-scale));
  min-width: calc(11rem * var(--crm050-cust-field-scale) * var(--crm050-bar-width-scale));
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

.crm050-search-control--cond {
  flex: 0 0 calc(6.5rem * var(--crm050-bar-width-scale) * var(--crm050-cond-combo-scale));
  width: calc(6.5rem * var(--crm050-bar-width-scale) * var(--crm050-cond-combo-scale));
  max-width: calc(7.5rem * var(--crm050-bar-width-scale) * var(--crm050-cond-combo-scale));
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

.crm050-search-group--cust .crm050-search-field :deep(.custom-select .vs__dropdown-toggle) {
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

.crm050-search-group--cust .crm050-search-field :deep(.custom-select.vs--open .vs__dropdown-toggle),
.crm050-search-group--cust .crm050-search-field :deep(.custom-select .vs__dropdown-toggle:focus) {
  border-color: var(--crm050-control-focus-border) !important;
  outline: none !important;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.25) !important;
}

.crm050-search-group--cust .crm050-search-field :deep(.custom-select .vs__selected),
.crm050-search-group--cust .crm050-search-field :deep(.custom-select.vs--disabled .vs__selected) {
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

.crm050-search-group--cust .crm050-search-field :deep(.custom-select .vs__selected-options) {
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

.crm050-search-group--cust .crm050-search-field :deep(.custom-select.vs--disabled .vs__dropdown-toggle) {
  background-color: #fff !important;
  border-color: var(--crm050-control-border) !important;
  opacity: 1 !important;
  cursor: default !important;
}

.crm050-search-checks-grid {
  display: grid;
  grid-template-columns: max-content max-content;
  column-gap: var(--crm050-search-gap);
  row-gap: 0.125rem;
  align-items: center;
}

.crm050-search-checks-grid--013 {
  grid-template-columns: max-content;
  row-gap: 0.25rem;
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
  overflow: visible;
}

.crm050-excel-upload {
  overflow: visible;
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

/* CRM01_013INS — Sheet 로드 후 업로드 버튼 강조 */
@keyframes crm013-excel-upload-blink {
  0%,
  100% {
    opacity: 1;
    box-shadow: 0 0 0 0 rgb(87 130 255 / 0.55);
  }
  50% {
    opacity: 0.88;
    box-shadow: 0 0 0 0.35rem rgb(87 130 255 / 0.4);
  }
}

.crm013-excel-upload-btn--blink:not(:disabled) {
  animation: crm013-excel-upload-blink 1.1s ease-in-out infinite;
}

.crm013-excel-upload-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.crm013-excel-upload-bubble {
  position: absolute;
  bottom: calc(100% + 0.5rem);
  left: 50%;
  z-index: 20;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  width: max-content;
  max-width: 11rem;
  padding: 0.375rem 0.625rem;
  border: 2px solid #93c5fd;
  border-radius: 1rem;
  background: linear-gradient(180deg, #eff6ff 0%, #fdf2f8 100%);
  box-shadow: 0 4px 12px rgb(59 130 246 / 0.18);
  color: #1e40af;
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1.35;
  text-align: center;
  white-space: nowrap;
  transform: translateX(-50%);
  animation: crm013-excel-bubble-bounce 1.6s ease-in-out infinite;
  pointer-events: none;
}

.crm013-excel-upload-bubble::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  width: 0;
  height: 0;
  border-top: 0.45rem solid #93c5fd;
  border-right: 0.4rem solid transparent;
  border-left: 0.4rem solid transparent;
  transform: translateX(-50%);
}

.crm013-excel-upload-bubble__icon {
  font-size: 0.875rem;
  line-height: 1;
}

@keyframes crm013-excel-bubble-bounce {
  0%,
  100% {
    transform: translateX(-50%) translateY(0);
  }
  50% {
    transform: translateX(-50%) translateY(-0.2rem);
  }
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

.crm050-excel-sample-icon {
  display: inline-block;
  flex-shrink: 0;
  width: 1rem;
  height: 1rem;
  background-color: #217346;
  mask: url("@/assets/images/button/excel_w.svg") no-repeat center / contain;
  -webkit-mask: url("@/assets/images/button/excel_w.svg") no-repeat center / contain;
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
  min-width: calc(14rem * var(--crm050-input-w-scale) * var(--crm050-excel-path-w-scale));
  max-width: calc(32rem * var(--crm050-input-w-scale) * var(--crm050-excel-path-w-scale));
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

.crm050-lower-body {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-height: 0;
  min-width: 0;
  max-height: min(52vh, 32rem);
  overflow-x: hidden;
  overflow-y: auto;
  padding-bottom: 1rem;
  -webkit-overflow-scrolling: touch;
  scrollbar-gutter: stable;
}

.crm050-lower-body::-webkit-scrollbar {
  width: 0.625rem;
}

.crm050-lower-body::-webkit-scrollbar-track {
  background: #eef2f7;
  border-radius: 0.375rem;
}

.crm050-lower-body::-webkit-scrollbar-thumb {
  background: #94a3b8;
  border-radius: 0.375rem;
  border: 2px solid #eef2f7;
}

.crm050-lower-body::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}

.crm050-detail-section {
  flex: 0 0 auto;
  min-width: 0;
  overflow: visible;
  display: flex;
  flex-direction: column;
}

.crm050-detail-panel {
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  min-width: 0;
  gap: 0.5rem;
  --crm050-detail-row-min: 2.125rem;
  --crm050-detail-font: 0.875rem;
  --crm050-detail-cell-py: 0.25rem;
  --crm050-detail-control-h: 1.75rem;
}

.crm050-excel-upload--pinned {
  margin-top: 0;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}

.crm050-form-grid {
  display: grid;
  grid-template-columns: minmax(5rem, 2fr) minmax(0, 3fr) minmax(5rem, 2fr) minmax(0, 3fr);
  grid-auto-rows: minmax(var(--crm050-detail-row-min), auto);
  align-self: start;
  flex: 0 0 auto;
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  overflow: visible;
  background: #fff;
}

.crm050-form-grid--013 {
  /* 행 높이: grid-auto-rows (창 크기와 무관하게 라벨·입력 동행) */
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
  -webkit-mask: url("@/assets/images/button/excel_w.svg") no-repeat center / contain;
}

.crm050-form-value {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  min-height: var(--crm050-detail-row-min);
  min-width: 0;
  padding: var(--crm050-detail-cell-py) 0.375rem;
  border: 1px solid #e5e7eb;
  background: #fff;
  overflow: visible;
}

.crm050-form-value--card {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: var(--crm050-detail-cell-py) 0.375rem;
}

.crm050-form-value--card .crm050-control--field {
  flex: 1 1 auto;
  min-width: 0;
  width: 100%;
  max-width: 100%;
}

.crm050-detail-panel .crm050-form-value:not(.crm050-form-value--card):not(.crm050-form-value--radio) .crm050-control--field {
  width: 100%;
  max-width: 100%;
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

.crm050-form-value--radio-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.crm050-form-value--span-3 {
  grid-column: span 3;
}

.crm050-form-value--span-3 .crm050-control--field {
  width: 100%;
  max-width: 100%;
}

.crm050-detail-note {
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  gap: 0.375rem;
  flex: 0 0 auto;
  width: 100%;
  margin: 0;
  padding: 0.25rem 0.375rem 0 0;
  position: relative;
  z-index: 1;
  clear: both;
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

.crm050-detail-panel .crm050-form-grid .crm050-control,
.crm050-detail-panel .crm050-form-grid .crm050-control--field {
  box-sizing: border-box;
  flex: 1 1 auto;
  width: 100%;
  max-width: 100%;
  height: var(--crm050-detail-control-h);
  min-height: var(--crm050-detail-control-h);
  max-height: var(--crm050-detail-control-h);
  font-size: var(--crm050-detail-font);
  line-height: 1.2;
  border: 1px solid var(--crm050-control-border) !important;
  border-radius: var(--crm050-control-radius) !important;
}

.crm050-control--amount {
  text-align: right !important;
}

.crm050-sub-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  height: var(--crm050-detail-control-h);
  min-height: var(--crm050-detail-control-h);
  max-height: var(--crm050-detail-control-h);
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

.crm050-card-modal__dialog--wide {
  width: min(32rem, 92vw);
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
  overflow: visible;
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

.crm050-card-modal__grid > .crm050-form-value--card-newno {
  overflow: visible;
  position: relative;
  z-index: 2;
}

.crm-card-newno-field-wrap {
  position: relative;
  width: 100%;
}

.crm-card-newno-warn-bubble {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 10;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  width: max-content;
  max-width: 12rem;
  padding: 0.375rem 0.625rem;
  border: 2px solid #fcd34d;
  border-radius: 1rem;
  background: linear-gradient(180deg, #fffbeb 0%, #fef3c7 100%);
  box-shadow: 0 4px 12px rgb(245 158 11 / 0.22);
  color: #b45309;
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1.35;
  white-space: nowrap;
  transform: translateY(calc(-100% - 0.35rem));
  animation: crm-card-newno-warn-bounce 1.5s ease-in-out infinite;
  pointer-events: none;
}

.crm-card-newno-warn-bubble::after {
  content: "";
  position: absolute;
  top: 100%;
  right: 0.85rem;
  width: 0;
  height: 0;
  border-top: 0.45rem solid #fcd34d;
  border-right: 0.4rem solid transparent;
  border-left: 0.4rem solid transparent;
}

.crm-card-newno-warn-bubble__icon {
  font-size: 0.875rem;
  line-height: 1;
}

@keyframes crm-card-newno-warn-bounce {
  0%,
  100% {
    transform: translateY(calc(-100% - 0.35rem));
  }
  50% {
    transform: translateY(calc(-100% - 0.55rem));
  }
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

@media (max-width: 1280px) {
  .crm050-form-grid {
    grid-template-columns: minmax(4.5rem, 1fr) minmax(0, 2.5fr);
  }

  .crm050-form-value--span-3 {
    grid-column: 2;
  }
}

@media (max-height: 920px) {
  .crm050-detail-panel {
    --crm050-detail-row-min: 1.75rem;
    --crm050-detail-cell-py: 0.1875rem;
    --crm050-detail-control-h: 1.625rem;
  }

  .crm050-excel-upload--pinned {
    padding-top: 0.75rem;
  }
}
</style>
