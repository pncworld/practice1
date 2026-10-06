/*--############################################################################
# Filename : MST42_001INS.vue                                                  
# Description : 마스터관리 > 거래처 마스터 > 거래처 등록                       
# Date :2025-05-27                                                             
# Author : 권맑음                     
################################################################################*/
<template>
  <div class="mst42-page flex h-full min-h-0 max-w-full flex-col gap-2 overflow-hidden box-border pb-1">
    <!-- 상단: 페이지명 + 액션 -->
    <div class="flex shrink-0 flex-wrap items-center justify-between gap-2">
      <PageName />
      <div class="flex flex-wrap items-center justify-end gap-2">
        <button type="button" @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <button type="button" @click="addButton" class="button new md:w-auto w-auto">
          신규
        </button>
        <button type="button" @click="saveButton" class="button save md:w-auto w-auto">
          저장
        </button>
        <button type="button" @click="exportToExcel" class="button excel md:w-auto w-auto">
          엑셀
        </button>
        <button type="button" @click="deleteButton" class="button delete md:w-auto w-auto">
          삭제
        </button>
      </div>
    </div>

    <!-- 조회 AREA -->
    <div class="mst42-search-panel z-10 w-full min-w-0 shrink-0 rounded-lg bg-gray-200">
      <div class="mst42-search-grid min-w-0">
        <div class="mst42-cell">
          <div class="mst42-sg-label">거래처코드</div>
          <div class="mst42-cell-field min-w-0">
            <input
              type="text"
              inputmode="numeric"
              pattern="[0-9]*"
              autocomplete="off"
              v-model="cond1"
              class="mst42-search-input mst42-search-input--code"
              @input="onSupplierCodeInput"
              @keydown.enter.prevent="searchButton" />
          </div>
        </div>
        <div class="mst42-cell">
          <div class="mst42-sg-label">거래처명</div>
          <div class="mst42-cell-field min-w-0">
            <input
              type="text"
              v-model="cond2"
              class="mst42-search-input mst42-search-input--name"
              @keydown.enter.prevent="searchButton" />
          </div>
        </div>
      </div>
    </div>

    <!-- 그리드 -->
    <div class="mst42-grid-wrap min-h-0 min-w-0 w-full">
      <Realgrid
        class="w-full h-full"
        :progname="'MST42_001INS_VUE'"
        :progid="1"
        :rowData="rowData"
        :rowStateeditable="false"
        :changeNow="changeNow"
        :changeRow="changeRow"
        :changeColid="changeColid"
        :changeValue2="changeValue2"
        :labelingColumns="'lngAccType'"
        :valuesData="[['0', '', '1', '2']]"
        :labelsData="[['선택', '선택', '현금', '어음']]"
        :addRow4="addRow"
        :addrowProp="'lngStoreGroup,lngSupplierID,strSupplierName,strRegistNo,strDirector,strDealType,strDealKind,strAddress,strZipCode,strTelNo,strFaxNo,strManager,strManagerTelNo,strHPNo,strEmail,lngAccType,strConvCode,lngSupplierType'"
        :addrowDefault="addrowDefault"
        :exporttoExcel="exExcel"
        :documentTitle="'MST42_001INS'"
        :documentSubTitle="documentSubTitle"
        :deleteRow6="deleted"
        @sendRowState="sendRowState"
        @allStateRows="allStateRows"
        @clickedRowData="clickedRowData"
        @updatedRowData="updatedRowData"
        @selectedIndex="selectedIndex" />
    </div>

    <!-- 상세 입력 (MST01_003INS 폼 스타일) -->
    <div class="mst42-detail-panel min-h-0 min-w-0 w-full overflow-x-hidden overflow-y-auto px-1">
      <div class="mst42-section-head">
        <div class="mst42-section-title">거래처 정보</div>
        <button
          v-if="showMailEnroll"
          type="button"
          class="mst42-sub-btn mst42-sub-btn--mail"
          @click.stop="MailEnroll"
          :disabled="!afterClick">
          <font-awesome-icon :icon="['fas', 'envelope']" />
          발주내역 전송메일 등록
        </button>
      </div>
      <div class="mst42-form-grid mt-2 w-full">
        <div class="mst42-form-label mst42-form-label--required">*거래처코드</div>
        <div class="mst42-form-value">
          <input
            type="number"
            :disabled="disable"
            name="lngSupplierID"
            @input="changeVal"
            v-model="gridvalue1"
            class="mst42-control mst42-control--supplier-id disabled:bg-gray-100" />
        </div>
        <div class="mst42-form-label mst42-form-label--required">*거래처명</div>
        <div class="mst42-form-value">
          <input
            type="text"
            v-model="gridvalue2"
            name="strSupplierName"
            @input="changeVal"
            class="mst42-control mst42-control--supplier-nm" />
        </div>

        <div class="mst42-form-label">사업자번호</div>
        <div class="mst42-form-value">
          <input
            type="text"
            name="strRegistNo"
            @input="changeVal"
            v-model="gridvalue3"
            class="mst42-control" />
        </div>
        <div class="mst42-form-label">대표자명</div>
        <div class="mst42-form-value">
          <input
            type="text"
            name="strDirector"
            @input="changeVal"
            v-model="gridvalue4"
            class="mst42-control" />
        </div>

        <div class="mst42-form-label">업종</div>
        <div class="mst42-form-value">
          <input
            type="text"
            name="strDealType"
            @input="changeVal"
            v-model="gridvalue5"
            class="mst42-control" />
        </div>
        <div class="mst42-form-label">업태</div>
        <div class="mst42-form-value">
          <input
            type="text"
            name="strDealKind"
            @input="changeVal"
            v-model="gridvalue6"
            class="mst42-control" />
        </div>

        <div class="mst42-form-label">우편번호</div>
        <div class="mst42-form-value mst42-form-value--inline gap-2">
          <input
            type="text"
            name="strZipCode"
            v-model="gridvalue7"
            class="mst42-control mst42-control--zip"
            readonly
            tabindex="-1"
            @keydown.prevent
            @paste.prevent />
          <button
            type="button"
            class="mst42-sub-btn shrink-0"
            @click.stop="getPostAddress">
            <font-awesome-icon :icon="['fas', 'location-dot']" />
            주소 찾기
          </button>
        </div>
        <div class="mst42-form-label">주소</div>
        <div class="mst42-form-value">
          <input
            type="text"
            name="strAddress"
            v-model="gridvalue8"
            @input="changeVal"
            class="mst42-control" />
        </div>

        <div class="mst42-form-label">전화번호</div>
        <div class="mst42-form-value">
          <input
            type="text"
            name="strTelNo"
            v-model="gridvalue9"
            @input="changeVal"
            class="mst42-control" />
        </div>
        <div class="mst42-form-label">팩스번호</div>
        <div class="mst42-form-value">
          <input
            type="text"
            name="strFaxNo"
            v-model="gridvalue10"
            @input="changeVal"
            class="mst42-control" />
        </div>

        <div class="mst42-form-label">담당자명</div>
        <div class="mst42-form-value">
          <input
            type="text"
            name="strManager"
            v-model="gridvalue11"
            @input="changeVal"
            class="mst42-control" />
        </div>
        <div class="mst42-form-label">담당자TEL</div>
        <div class="mst42-form-value">
          <input
            type="text"
            name="strManagerTelNo"
            v-model="gridvalue12"
            @input="changeVal"
            class="mst42-control" />
        </div>

        <div class="mst42-form-label">담당자H.P</div>
        <div class="mst42-form-value">
          <input
            type="text"
            v-model="gridvalue13"
            name="strHPNo"
            @input="changeVal"
            class="mst42-control" />
        </div>
        <div class="mst42-form-label">이메일주소</div>
        <div class="mst42-form-value">
          <input
            type="text"
            name="strEmail"
            v-model="gridvalue14"
            @input="changeVal"
            class="mst42-control" />
        </div>

        <div class="mst42-form-label">결제유형</div>
        <div class="mst42-form-value">
          <select
            name="lngAccType"
            id="lngAccType"
            class="mst42-control"
            @change="changeVal"
            v-model="gridvalue15">
            <option value="">선택</option>
            <option value="1">현금</option>
            <option value="2">어음</option>
          </select>
        </div>
        <div class="mst42-form-label">본사전송코드</div>
        <div class="mst42-form-value">
          <input
            type="text"
            name="strConvCode"
            v-model="gridvalue16"
            @input="changeVal"
            class="mst42-control" />
        </div>
      </div>
    </div>

    <Teleport to="body">
      <GetZipCode
        v-if="openPopUp"
        @closePopUp="closePopUp"
        @zipAndAddress="zipAndAddress" />
    </Teleport>

    <Teleport to="body">
      <div
        v-if="openPopUp3"
        class="mst42-mail-overlay fixed inset-0 z-[11000] flex items-center justify-center bg-black/50 p-4"
        @mousedown.self.prevent
        @click.self.prevent>
        <div
          class="mst42-mail-popup flex h-[min(72vh,38rem)] w-[min(92vw,42rem)] flex-col rounded-lg bg-white shadow-xl"
          role="dialog"
          aria-modal="true"
          @click.stop
          @mousedown.stop>
          <div class="mst42-mail-popup__head shrink-0">
            <h2 class="mst42-mail-popup__title">거래처 발주 메일 주소 등록</h2>
            <div class="flex shrink-0 gap-2">
              <button type="button" class="mst42-mail-popup__btn" @click="checkandAdd">
                추가
              </button>
              <button
                type="button"
                class="mst42-mail-popup__btn mst42-mail-popup__btn--ghost"
                @click="openPopUp3 = false">
                닫기
              </button>
            </div>
          </div>

          <div class="mst42-mail-popup__form shrink-0">
            <div class="mst42-mail-popup__row">
              <div class="mst42-mail-popup__label">거래처코드</div>
              <div class="mst42-mail-popup__value">
                <input
                  type="text"
                  class="mst42-mail-popup__input"
                  v-model="gridvalue1"
                  disabled />
              </div>
              <div class="mst42-mail-popup__label">거래처명</div>
              <div class="mst42-mail-popup__value">
                <input
                  type="text"
                  class="mst42-mail-popup__input"
                  v-model="gridvalue2"
                  disabled />
              </div>
            </div>
            <div class="mst42-mail-popup__row mst42-mail-popup__row--full">
              <div class="mst42-mail-popup__label mst42-mail-popup__label--req">
                *메일주소
              </div>
              <div class="mst42-mail-popup__value">
                <input
                  type="text"
                  class="mst42-mail-popup__input mst42-mail-popup__input--wide"
                  v-model="scond"
                  placeholder="example@email.com"
                  @keydown.enter.prevent="checkandAdd" />
              </div>
            </div>
            <div class="mst42-mail-popup__row mst42-mail-popup__row--full">
              <div class="mst42-mail-popup__label">담당자명/메모</div>
              <div class="mst42-mail-popup__value">
                <input
                  type="text"
                  class="mst42-mail-popup__input mst42-mail-popup__input--wide"
                  v-model="scond2"
                  @keydown.enter.prevent="checkandAdd" />
              </div>
            </div>
          </div>

          <div class="mst42-mail-popup__grid">
            <Realgrid
              class="h-full w-full"
              :progname="'MST42_001INS_VUE'"
              :progid="3"
              :rowData="rowData2"
              @buttonClicked="buttonClicked"
              :setStateBar="false" />
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import {
  deleteClientInfo,
  deleteOrderEmail,
  getClientList,
  getNewSupplierID,
  getOrderEmailList,
  saveClientInfo,
  setSupplierEmail,
} from "@/api/master";
import GetZipCode from "@/components/getZipCode.vue";
/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
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

import { nextTick, onMounted, ref, watch } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";

/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  if (
    store.state.userData.lngStoreGroup == "3183" ||
    store.state.userData.lngStoreGroup == "3264"
  ) {
    showMailEnroll.value = true;
  }
});

const showMailEnroll = ref(false);
const cond1 = ref("");
const cond2 = ref("");

/** 상단 거래처코드 — 정수(숫자)만 입력 */
const onSupplierCodeInput = (e) => {
  const digits = String(e.target.value ?? "").replace(/\D/g, "");
  cond1.value = digits;
  if (e.target.value !== digits) {
    e.target.value = digits;
  }
};
const gridvalue1 = ref("");
const gridvalue2 = ref("");
const gridvalue3 = ref("");
const gridvalue4 = ref("");
const gridvalue5 = ref("");
const gridvalue6 = ref("");
const gridvalue7 = ref("");
const gridvalue8 = ref("");
const gridvalue9 = ref("");
const gridvalue10 = ref("");
const gridvalue11 = ref("");
const gridvalue12 = ref("");
const gridvalue13 = ref("");
const gridvalue14 = ref("");
const gridvalue15 = ref("");
const gridvalue16 = ref("");
const store = useStore();

/**
 * 추가 버튼 함수
 */

const addRow = ref(false);
const labelsData = ref([]);
const valuesData = ref([]);
const afterSearch = ref(false);

/**
 * 페이지 매장 코드 세팅
 */

/**
 * 페이지 매장 그룹 세팅
 */

const exExcel = ref(false);
const documentSubTitle = ref("");
const exExcelNm = ref("매장정보등록");
/**
 * 엑셀 Export 버튼
 */

const exportToExcel = () => {
  documentSubTitle.value =
    "거래처코드 : " + cond1.value + "\n" + "거래처명 :" + cond2.value;
  exExcel.value = !exExcel.value;
};
const searchstore = ref("");

// API 호출 (설정값 호출)

const rowData = ref([]);
const lngMultiPriceGroupCodes = ref([]);

/**
 * 페이지 매장 분류 세팅
 */

/**
 * 페이지 매장 슈퍼바이저 세팅
 */

/**
 *  조회 함수
 */

const searchButton = async () => {
  try {
    store.state.loading = true;
    initGrid();
    const res = await getClientList(
      store.state.userData.lngStoreGroup,
      cond1.value == "" ? 0 : cond1.value,
      cond2.value
    );

    ////console.log(res);

    rowData.value = res.data.List;
    updateRowData.value = JSON.parse(JSON.stringify(res.data.List));
    afterSearch.value = true;
  } catch (error) {
  } finally {
    store.state.loading = false;
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

  if (afterClick.value == false) {
    return;
  }
  deleted.value = !deleted.value;
};
const addrowDefault = ref("");
const addrowProp = ref("");
/**
 *  추가 버튼
 */

const addButton = async () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 진행해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  let newNo = "";
  try {
    const res = await getNewSupplierID(store.state.userData.lngStoreGroup);

    newNo = res.data.List[0].lngSupplierID;
  } catch (error) {}
  addrowDefault.value =
    store.state.userData.lngStoreGroup +
    "," +
    newNo +
    ", , , , , , , , , , , , , , , , ,1";
  addRow.value = !addRow.value;
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
  if (deleterows.value.length + statesrows.value.length == 0) {
    Swal.fire({
      title: "경고",
      text: "변경된 사항이 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  try {
    store.state.loading = true;
    if (statesrows.value.length > 0) {
      const storeGroups = updateRowData.value
        .filter((item, index) => statesrows.value.includes(index))
        .map((item) => item.lngStoreGroup);
      const supplierid = updateRowData.value
        .filter((item, index) => statesrows.value.includes(index))
        .map((item) => item.lngSupplierID);
      const suppliernm = updateRowData.value
        .filter((item, index) => statesrows.value.includes(index))
        .map((item) => item.strSupplierName);
      const registno = updateRowData.value
        .filter((item, index) => statesrows.value.includes(index))
        .map((item) => item.strRegistNo);
      const strdirector = updateRowData.value
        .filter((item, index) => statesrows.value.includes(index))
        .map((item) => item.strDirector);
      const dealtype = updateRowData.value
        .filter((item, index) => statesrows.value.includes(index))
        .map((item) => item.strDealType);
      const dealkind = updateRowData.value
        .filter((item, index) => statesrows.value.includes(index))
        .map((item) => item.strDealKind);
      const straddress = updateRowData.value
        .filter((item, index) => statesrows.value.includes(index))
        .map((item) => item.strAddress);
      const strzipcode = updateRowData.value
        .filter((item, index) => statesrows.value.includes(index))
        .map((item) => item.strZipCode);
      const strtelno = updateRowData.value
        .filter((item, index) => statesrows.value.includes(index))
        .map((item) => item.strTelNo);
      const strfaxno = updateRowData.value
        .filter((item, index) => statesrows.value.includes(index))
        .map((item) => item.strFaxNo);
      const strmanager = updateRowData.value
        .filter((item, index) => statesrows.value.includes(index))
        .map((item) => item.strManager);
      const strmanagertelno = updateRowData.value
        .filter((item, index) => statesrows.value.includes(index))
        .map((item) => item.strManagerTelNo);
      const strhpno = updateRowData.value
        .filter((item, index) => statesrows.value.includes(index))
        .map((item) => item.strHPNo);
      const stremail = updateRowData.value
        .filter((item, index) => statesrows.value.includes(index))
        .map((item) => item.strEmail);
      const lngacctype = updateRowData.value
        .filter((item, index) => statesrows.value.includes(index))
        .map((item) => item.lngAccType);
      const convcode = updateRowData.value
        .filter((item, index) => statesrows.value.includes(index))
        .map((item) => item.strConvCode);
      const suppliertype = updateRowData.value
        .filter((item, index) => statesrows.value.includes(index))
        .map((item) => item.lngSupplierType);
      const res = await saveClientInfo(
        storeGroups.join("\u200b"),
        supplierid.join("\u200b"),
        suppliernm.join("\u200b"),
        registno.join("\u200b"),
        strdirector.join("\u200b"),
        dealtype.join("\u200b"),
        dealkind.join("\u200b"),
        straddress.join("\u200b"),
        strzipcode.join("\u200b"),
        strtelno.join("\u200b"),
        strfaxno.join("\u200b"),
        strmanager.join("\u200b"),
        strmanagertelno.join("\u200b"),
        strhpno.join("\u200b"),
        stremail.join("\u200b"),
        lngacctype.join("\u200b"),
        convcode.join("\u200b"),
        suppliertype.join("\u200b")
      );
    }
    if (deleterows.value.length > 0) {
      const groups = updateRowData.value
        .filter((item, index) => deleterows.value.includes(index))
        .map((item) => item.lngStoreGroup)
        .join("\u200b");
      const supplierid = updateRowData.value
        .filter((item, index) => deleterows.value.includes(index))
        .map((item) => item.lngSupplierID)
        .join("\u200b");
      const suppliertype = updateRowData.value
        .filter((item, index) => deleterows.value.includes(index))
        .map((item) => item.lngSupplierType)
        .join("\u200b");
      const res = await deleteClientInfo(groups, supplierid, suppliertype);

      ////console.log(res);
    }
    Swal.fire({
      title: "성공",
      text: "저장을 완료하였습니다.",
      icon: "success",
      confirmButtonText: "확인",
    });
  } catch (error) {
    ////console.log(error);
  } finally {
    store.state.loading = false;
    searchButton();
  }
  //comsole.log(updateRowData.value);
};

/**
 * 수정용 데이터 행 설정
 */

/**
 * 데이터셋 상세정보 셋팅
 */

const disable = ref(false);
const selectedIndex = (e) => {
  changeRow.value = e;
};
const sendRowState = (e) => {
  if (e == "created") {
    disable.value = false;
  } else {
    disable.value = true;
  }
};
const statesrows = ref([]);
const deleterows = ref([]);
const allStateRows = (e) => {
  ////console.log(e);
  statesrows.value = [...e.updated, ...e.created];
  deleterows.value = e.deleted;
  ////console.log(statesrows.value);
};
const afterClick = ref(false);
const clickedRowData = (e) => {
  ////console.log(e);
  afterClick.value = true;
  gridvalue1.value = e[1];
  gridvalue2.value = e[2];
  gridvalue3.value = e[3];
  gridvalue4.value = e[4];
  gridvalue5.value = e[5];
  gridvalue6.value = e[6];
  gridvalue8.value = e[7];
  gridvalue7.value = e[8];
  gridvalue9.value = e[9];
  gridvalue10.value = e[10];
  gridvalue11.value = e[11];
  gridvalue12.value = e[12];
  gridvalue13.value = e[13];
  gridvalue14.value = e[14];
  gridvalue15.value = e[15];
  gridvalue16.value = e[16];
};

const openPopUp = ref(false);
const getPostAddress = () => {
  if (afterClick.value == false) {
    Swal.fire({
      title: "알림",
      text: "거래처를 먼저 선택하거나 신규 등록 후 행을 선택해 주세요.",
      icon: "info",
      confirmButtonText: "확인",
    });
    return;
  }
  openPopUp.value = true;
};

const closePopUp = (e) => {
  openPopUp.value = e;
};
const changeVal = (e) => {
  if (afterClick.value == false) {
    return;
  }
  const nm = e.target.name;
  const vl = e.target.value;

  changeColid.value = nm;
  changeValue2.value = vl;

  changeNow.value = !changeNow.value;
};

const zipAndAddress = async (e) => {
  const a = e.split(",")[0];
  const b = e.split(",")[1];

  gridvalue7.value = a;
  gridvalue8.value = b;

  changeColid.value = "strZipCode";
  changeValue2.value = a;
  changeNow.value = !changeNow.value;

  await nextTick();

  changeColid.value = "strAddress";
  changeValue2.value = b;
  changeNow.value = !changeNow.value;

  await nextTick();
};

/**
 * 페이지 매장 코드 세팅
 */

/**
 * 페이지 매장 분류 세팅
 */

const changeValue2 = ref();
const changeRow = ref();
const changeColid = ref();
const changeNow = ref(false);
const changeNow2 = ref(false);
const updatedRowData = (e) => {
  ////console.log(e);
  updateRowData.value = e;
};
const updateRowData = ref([]);

/**
 * 입력창 수정 데이터 갱신
 */

const initGrid = () => {
  gridvalue1.value = "";
  gridvalue2.value = "";
  gridvalue3.value = "";
  gridvalue4.value = "";
  gridvalue5.value = "";
  gridvalue6.value = "";
  gridvalue7.value = "";
  gridvalue8.value = "";
  gridvalue9.value = "";
  gridvalue10.value = "";
  gridvalue11.value = "";
  gridvalue12.value = "";
  gridvalue13.value = "";
  gridvalue14.value = "";
  gridvalue15.value = "";
  gridvalue16.value = "";
};

const openPopUp3 = ref(false);
const rowData2 = ref([]);
const MailEnroll = async () => {
  openPopUp3.value = true;

  try {
    const res = await getOrderEmailList(
      store.state.userData.lngStoreGroup,
      gridvalue1.value
    );

    rowData2.value = res.data.List;
  } catch (error) {}
};

const scond2 = ref("");
const scond = ref("");
const checkandAdd = async () => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (scond.value == "" || scond.value == undefined) {
    Swal.fire({
      title: "경고",
      text: "메일주소를 입력해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  if (!re.test(scond.value)) {
    Swal.fire({
      title: "경고",
      text: "올바른 이메일 주소를 적어주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  try {
    const res = await setSupplierEmail(
      store.state.userData.lngStoreGroup,
      gridvalue1.value,
      scond.value,
      scond2.value,
      store.state.userData.lngSequence
    );
    // console.log(res);

    if (res.data.RESULT_CD == "00") {
      await Swal.fire({
        title: "성공",
        text: "메일 주소를 등록하였습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
    } else {
      await Swal.fire({
        title: "실패",
        text: "메일 주소 등록에 실패하였습니다.",
        icon: "error",
        confirmButtonText: "확인",
      });
    }
  } catch (error) {
  } finally {
    scond.value = "";
    scond2.value = "";
    MailEnroll();
  }
};

const buttonClicked = (e) => {
  Swal.fire({
    title: "알림",
    text: "정말로 삭제하시겠습니까?",
    icon: "question",
    confirmButtonText: "확인",
    showCancelButton: true,
    cancelButtonText: "취소",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const res = await deleteOrderEmail(
          store.state.userData.lngStoreGroup,
          gridvalue1.value,
          e[0],
          store.state.userData.lngSequence
        );

        if (res.data.RESULT_CD == "00") {
          await Swal.fire({
            title: "성공",
            text: "메일 주소를 삭제하였습니다.",
            icon: "success",
            confirmButtonText: "확인",
          });
        } else {
          await Swal.fire({
            title: "실패",
            text: "메일 주소 삭제를 실패하였습니다.",
            icon: "error",
            confirmButtonText: "확인",
          });
        }
      } catch (error) {
      } finally {
        MailEnroll();
      }
    }
  });
};
</script>

<style scoped>
/* 조회 AREA — layout-equal-spacing / search-area-symmetric-inset / search-area-alignment */
.mst42-search-panel {
  --mst42-panel-pad-x: 2rem;
  --mst42-col-gap: 1.5rem;
  --mst42-item-gap: 0.75rem;
  --mst42-label-col: 6.5rem;
  --mst42-row-min-h: 2rem;
  --mst42-search-control-h: 2rem;
  --mst42-control-border: #cbd5e1;
  --mst42-control-focus-border: #3b82f6;
  --mst42-control-radius: 0.375rem;
  box-sizing: border-box;
  padding-left: 0;
  padding-right: 0;
  padding-block: 0.75rem;
}

.mst42-search-grid {
  display: grid;
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  align-items: center;
  /* 거래처명 열을 더 넓게 */
  grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.35fr);
  column-gap: var(--mst42-col-gap);
  padding-left: var(--mst42-panel-pad-x);
  padding-right: var(--mst42-panel-pad-x);
}

.mst42-cell {
  display: flex;
  min-width: 0;
  min-height: var(--mst42-row-min-h);
  align-items: center;
  gap: var(--mst42-item-gap);
}

.mst42-sg-label {
  flex: 0 0 var(--mst42-label-col);
  width: var(--mst42-label-col);
  min-height: var(--mst42-row-min-h);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
}

.mst42-cell-field {
  min-width: 0;
  min-height: var(--mst42-row-min-h);
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  width: 100%;
}

/* 조회 입력 — 거래처코드 50% / 거래처명 60% (열·라벨 간격 유지) */
.mst42-search-input {
  box-sizing: border-box;
  min-width: 0;
  height: var(--mst42-search-control-h);
  min-height: var(--mst42-search-control-h);
  max-height: var(--mst42-search-control-h);
  border: 1px solid var(--mst42-control-border);
  border-radius: var(--mst42-control-radius);
  padding: 0 0.5rem;
  font-size: 0.875rem;
  background: #fff;
}

.mst42-search-input--code {
  width: 50%;
  max-width: 50%;
}

.mst42-search-input--name {
  width: 60%;
  max-width: 60%;
}

.mst42-search-input:focus {
  outline: none;
  border-color: var(--mst42-control-focus-border);
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.25);
}

/* 노트북 화면: 그리드가 남는 높이를 쓰고, 상세는 내용 높이만 */
.mst42-grid-wrap {
  position: relative;
  z-index: 0;
  flex: 1 1 0;
  min-height: 10rem;
  max-height: none;
  overflow: hidden;
}

/* 상세 폼 — MST01_003INS 톤, 내용 높이만 (하단 공란 제거) */
.mst42-detail-panel {
  position: relative;
  z-index: 1;
  flex: 0 0 auto;
  margin-top: 0.75rem;
  max-height: none;
  --mst42-label-col: 6.75rem;
  --mst42-control-border: #cbd5e1;
  --mst42-control-focus-border: #3b82f6;
  --mst42-control-h: 1.5rem;
  --mst42-control-radius: 0.375rem;
  --mst42-detail-font: 0.8125rem;
  --mst42-detail-row-h: 2rem;
  --mst42-detail-cell-py: 0.25rem;
}

.mst42-section-head {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.75rem;
  min-height: 1.75rem;
}

.mst42-section-title {
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.4rem;
  color: #111827;
}

.mst42-form-grid {
  display: grid;
  grid-template-columns:
    var(--mst42-label-col) minmax(0, 1fr) var(--mst42-label-col) minmax(0, 1fr);
  grid-auto-rows: var(--mst42-detail-row-h);
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  overflow: hidden;
  background: #fff;
}

.mst42-form-grid--mail {
  grid-template-columns: var(--mst42-label-col) minmax(0, 1fr);
  max-width: 28rem;
}

.mst42-control--supplier-id {
  width: 50%;
  max-width: 50%;
}

.mst42-control--supplier-nm {
  width: 60%;
  max-width: 60%;
}

.mst42-form-grid > * {
  box-sizing: border-box;
  min-height: var(--mst42-detail-row-h);
  align-self: stretch;
}

.mst42-form-label {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: var(--mst42-detail-row-h);
  padding: var(--mst42-detail-cell-py) 0.375rem;
  border: 1px solid #e5e7eb;
  background: #edf2f7;
  color: #5c5c5c;
  font-size: var(--mst42-detail-font);
  font-weight: 600;
  line-height: 1.25;
  text-align: center;
  word-break: keep-all;
}

.mst42-form-label--required {
  color: #2563eb;
  font-weight: 700;
}

.mst42-form-value {
  display: flex;
  align-items: center;
  min-height: var(--mst42-detail-row-h);
  min-width: 0;
  padding: var(--mst42-detail-cell-py) 0.375rem;
  border: 1px solid #e5e7eb;
  background: #fff;
}

.mst42-form-value--inline {
  flex-wrap: nowrap;
  align-items: center;
  gap: 0.5rem;
}

.mst42-field-span3 {
  grid-column: 2 / -1;
  min-width: 0;
}

.mst42-control {
  box-sizing: border-box;
  height: var(--mst42-control-h);
  min-height: var(--mst42-control-h);
  max-height: var(--mst42-control-h);
  width: 60%;
  max-width: 60%;
  min-width: 0;
  border-radius: var(--mst42-control-radius);
  border: 1px solid var(--mst42-control-border);
  background: #fff;
  padding: 0 0.5rem;
  font-size: var(--mst42-detail-font);
  line-height: 1;
}

.mst42-control:focus,
.mst42-control:focus-visible {
  border-color: var(--mst42-control-focus-border);
  outline: none;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.25);
}

.mst42-control:disabled,
.mst42-control[readonly] {
  background: #f3f4f6;
  color: #374151;
  cursor: default;
}

.mst42-control--zip {
  width: 7rem;
  max-width: 7rem;
  flex: 0 0 7rem;
}

.mst42-sub-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  height: var(--mst42-control-h);
  min-height: var(--mst42-control-h);
  padding: 0 0.75rem;
  font-size: var(--mst42-detail-font);
  font-weight: 600;
  line-height: 1.2;
  white-space: nowrap;
  color: #374151;
  border: 1px solid #6b7280;
  border-radius: 0.375rem;
  background: #fff;
  cursor: pointer;
}

.mst42-sub-btn:hover:not(:disabled) {
  background: #eff6ff;
  border-color: #60a5fa;
  color: #1d4ed8;
}

.mst42-sub-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.mst42-sub-btn--mail {
  height: 1.875rem;
  min-height: 1.875rem;
  padding: 0 0.875rem;
  font-size: 0.8125rem;
}

@media (max-width: 900px) {
  .mst42-search-grid {
    grid-template-columns: minmax(0, 1fr);
    row-gap: 0.75rem;
  }

  .mst42-form-grid {
    grid-template-columns: var(--mst42-label-col) minmax(0, 1fr);
  }

  .mst42-field-span3 {
    grid-column: span 1;
  }
}

/* 노트북(~1366x768) 세로 여유 확보 */
@media (max-height: 900px) {
  .mst42-detail-panel {
    --mst42-detail-row-h: 1.875rem;
    --mst42-control-h: 1.375rem;
    --mst42-detail-cell-py: 0.1875rem;
    margin-top: 0.625rem;
    max-height: 48vh;
  }

  .mst42-section-title {
    font-size: 1.0625rem;
  }
}

@media (min-width: 1280px) {
  .mst42-search-panel {
    --mst42-panel-pad-x: 2.5rem;
  }
}

@media (min-width: 1536px) {
  .mst42-search-panel {
    --mst42-panel-pad-x: 3rem;
  }
}

/* 발주 메일 등록 팝업 */
.mst42-mail-overlay {
  pointer-events: auto;
}

.mst42-mail-popup {
  --mail-label-w: 7.5rem;
  --mail-row-h: 2.25rem;
  --mail-control-h: 1.75rem;
  --mail-border: #cbd5e1;
  --mail-focus: #3b82f6;
  box-sizing: border-box;
  overflow: hidden;
}

.mst42-mail-popup__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  background: #f8fafc;
}

.mst42-mail-popup__title {
  margin: 0;
  font-size: 1.0625rem;
  font-weight: 700;
  line-height: 1.3;
  color: #111827;
}

.mst42-mail-popup__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 2rem;
  padding: 0 0.875rem;
  border: none;
  border-radius: 0.375rem;
  background: #5782ff;
  color: #fff;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
}

.mst42-mail-popup__btn:hover {
  background: #3f6cf0;
}

.mst42-mail-popup__btn--ghost {
  background: #fff;
  color: #374151;
  border: 1px solid #6b7280;
}

.mst42-mail-popup__btn--ghost:hover {
  background: #eff6ff;
  border-color: #60a5fa;
  color: #1d4ed8;
}

.mst42-mail-popup__form {
  display: flex;
  flex-direction: column;
  gap: 0;
  margin: 0.875rem 1rem 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  overflow: hidden;
  background: #fff;
}

.mst42-mail-popup__row {
  display: grid;
  grid-template-columns:
    var(--mail-label-w) minmax(0, 1fr) var(--mail-label-w) minmax(0, 1.2fr);
  min-height: var(--mail-row-h);
}

.mst42-mail-popup__row--full {
  grid-template-columns: var(--mail-label-w) minmax(0, 1fr);
}

.mst42-mail-popup__label {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 0.5rem;
  border-right: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
  background: #edf2f7;
  color: #5c5c5c;
  font-size: 0.8125rem;
  font-weight: 600;
  text-align: center;
  word-break: keep-all;
}

.mst42-mail-popup__label--req {
  color: #2563eb;
  font-weight: 700;
}

.mst42-mail-popup__value {
  display: flex;
  align-items: center;
  min-width: 0;
  padding: 0.25rem 0.5rem;
  border-right: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
  background: #fff;
}

.mst42-mail-popup__row > :last-child {
  border-right: none;
}

.mst42-mail-popup__input {
  box-sizing: border-box;
  width: 100%;
  max-width: 12rem;
  height: var(--mail-control-h);
  min-height: var(--mail-control-h);
  border: 1px solid var(--mail-border);
  border-radius: 0.375rem;
  padding: 0 0.5rem;
  font-size: 0.8125rem;
  background: #fff;
}

.mst42-mail-popup__input:disabled {
  background: #f3f4f6;
  color: #374151;
}

.mst42-mail-popup__input--wide {
  max-width: 100%;
}

.mst42-mail-popup__input:focus {
  outline: none;
  border-color: var(--mail-focus);
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.25);
}

.mst42-mail-popup__grid {
  flex: 1 1 0;
  min-height: 14rem;
  margin: 0.5rem 1rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  overflow: hidden;
  position: relative;
}

.mst42-mail-popup__grid :deep(.realgrid),
.mst42-mail-popup__grid :deep(.rg-root),
.mst42-mail-popup__grid > * {
  height: 100% !important;
  min-height: 100%;
}

@media (max-width: 640px) {
  .mst42-mail-popup__row {
    grid-template-columns: var(--mail-label-w) minmax(0, 1fr);
  }

  .mst42-mail-popup__row > .mst42-mail-popup__label:nth-child(3),
  .mst42-mail-popup__row > .mst42-mail-popup__value:nth-child(4) {
    border-top: none;
  }
}
</style>
