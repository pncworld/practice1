/*--############################################################################
# Filename : ATT07_001INS.vue                                                  
# Description : 인사관리 > 사원 마스터 > 직위등록.                              
# Date :2025-06-04                                                             
# Author : 권맑음                     
################################################################################*/
<template>
  <div class="att07-page box-border flex h-full max-w-full min-h-0 flex-col gap-2 overflow-hidden pb-1" @click="handleParentClick">
    <!-- 상단: 프로그램명 + 액션 (파란 배경 영역) -->
    <div class="att07-toolbar flex shrink-0 flex-wrap items-center justify-between gap-2">
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
        <button type="button" @click="deleteButton" class="button delete md:w-auto w-auto">
          삭제
        </button>
        <button type="button" @click="excelButton" class="button excel md:w-auto w-auto">
          엑셀
        </button>
      </div>
    </div>

    <!-- 바디: 목록 / 상세 (흰 영역) -->
    <div class="att07-body min-h-0 min-w-0 flex-1">
      <div class="att07-workspace min-h-0 min-w-0 h-full">
        <div class="att07-left flex min-h-0 min-w-0 flex-col">
          <div class="att07-section-title shrink-0">직위 목록</div>
          <div class="att07-grid-wrap mt-2 min-h-0 min-w-0 flex-1">
            <Realgrid
              class="h-full w-full"
              :progname="'ATT07_001INS_M_VUE'"
              :progid="1"
              :rowData="rowData"
              :reload="reload"
              :setStateBar="false"
              :checkRowAuto="false"
              :headerCheckBar="'checkbox'"
              @clickedRowData="clickedRowData"
              @allStateRows="allStateRows"
              @sendRowState="sendRowState"
              @selectedIndex="selectedIndex"
              @updatedRowData="updatedRowData"
              :addRow4="addRow4"
              :addrowProp="'checkbox,lngRankCode,strRank,lngOrder,lngPOSSecurityRating,checkbox2,lngEmpInsert,dtmInsert,strInsertIP,lngEmpEdit,dtmEdit,strEditIP'"
              :addrowDefault="addrowDefault"
              :documentTitle="'ATT07_001INS'"
              :changeValue2="changeValue2"
              :changeColid="changeColid"
              :changeRow="changeRow"
              :changeNow="changeNow"
              :dynamicRowHeight="true"
              :documentSubTitle="documentSubTitle"
              :rowStateeditable="false"
              :checkRenderEditable="true"
              :checkRenderEditable2Col="'checkbox2'"
              :exporttoExcel="exportExcel" />
          </div>
        </div>

        <div class="att07-right flex min-h-0 min-w-0 flex-col">
          <div class="att07-section-title shrink-0">직위 정보</div>
          <div class="att07-form-grid mt-2 w-full">
            <div class="att07-form-label att07-form-label--required">*직위코드</div>
            <div class="att07-form-value">
              <input
                ref="codeInput"
                type="text"
                inputmode="numeric"
                pattern="[0-9]*"
                lang="en"
                autocomplete="off"
                name="lngRankCode"
                class="att07-control"
                :disabled="disablegrid"
                v-model="gridvalue1"
                @keydown="codeDigits.onKeydown"
                @beforeinput="codeDigits.onBeforeInput"
                @paste="codeDigits.onPaste"
                @compositionstart="codeDigits.onCompositionStart"
                @compositionupdate="codeDigits.onCompositionUpdate"
                @compositionend="codeDigits.onCompositionEnd"
                @input="codeDigits.onInput" />
            </div>

            <div class="att07-form-label att07-form-label--required">*직위명</div>
            <div class="att07-form-value">
              <input
                type="text"
                name="strRank"
                class="att07-control"
                :disabled="disablegrid2"
                v-model="gridvalue2"
                @input="changeValue" />
            </div>

            <div class="att07-form-label">구 분</div>
            <div class="att07-form-value att07-form-value--radio">
              <label class="att07-radio-label" for="cond">
                <input
                  type="radio"
                  id="cond"
                  name="intGrade"
                  :disabled="disablegrid2"
                  :value="1"
                  v-model="gridvalue3"
                  @change="changeValue" />
                정직원
              </label>
              <label class="att07-radio-label" for="cond2">
                <input
                  type="radio"
                  id="cond2"
                  name="intGrade"
                  :disabled="disablegrid2"
                  :value="2"
                  v-model="gridvalue3"
                  @change="changeValue" />
                PT
              </label>
            </div>

            <div class="att07-form-label">정렬</div>
            <div class="att07-form-value">
              <input
                type="text"
                inputmode="numeric"
                pattern="[0-9]*"
                lang="en"
                autocomplete="off"
                name="lngOrder"
                class="att07-control"
                :disabled="disablegrid2"
                v-model="gridvalue4"
                @keydown="orderDigits.onKeydown"
                @beforeinput="orderDigits.onBeforeInput"
                @paste="orderDigits.onPaste"
                @compositionstart="orderDigits.onCompositionStart"
                @compositionupdate="orderDigits.onCompositionUpdate"
                @compositionend="orderDigits.onCompositionEnd"
                @input="orderDigits.onInput" />
            </div>

            <div class="att07-form-label">등록자</div>
            <div class="att07-form-value">
              <input type="text" class="att07-control" v-model="gridvalue5" disabled />
            </div>

            <div class="att07-form-label">등록일자</div>
            <div class="att07-form-value">
              <input type="text" class="att07-control" v-model="gridvalue6" disabled />
            </div>

            <div class="att07-form-label">수정자</div>
            <div class="att07-form-value">
              <input type="text" class="att07-control" v-model="gridvalue7" disabled />
            </div>

            <div class="att07-form-label">수정일자</div>
            <div class="att07-form-value">
              <input type="text" class="att07-control" v-model="gridvalue8" disabled />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { saveReserveTeamTable } from "@/api/micrm";
import "vue3-timepicker/dist/VueTimepicker.css";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
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

import { onMounted, ref } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { deletePosition, getPositionList, savePosition } from "@/api/miattend";
import { makeDigitsOnlyHandlers } from "@/utils/inputRestrict";
import { useStore } from "vuex";
/**
 * 	화면 Load시 실행 스크립트
 */

const optionList3 = ref([]);

const codeInput = ref(null);
const gridvalue1 = ref();
const gridvalue2 = ref();
const gridvalue3 = ref(1);
const gridvalue4 = ref("");
const gridvalue5 = ref("");
const gridvalue6 = ref("");
const gridvalue7 = ref("");
const gridvalue8 = ref("");
const cond = ref(1);

/** 코드 잠금 / 상세(직위명·구분·정렬) 잠금 — 핸들러보다 먼저 선언 */
const disablegrid = ref(true);
const disablegrid2 = ref(true);
const insertupdatedelete = ref(1);
/** 현재 선택 행이 삭제(비활성) 상태인지 */
const isDeletedRow = ref(false);

const isBlankCode = (v) =>
  v === null || v === undefined || String(v).trim() === "";

/** 0, 00 처럼 숫자 0만 있는 코드 */
const isZeroCode = (v) => /^0+$/.test(String(v ?? "").trim());

const ADDROW_BASE = "false, , , , ,false, , , , , , ,";
const addrowDefault = ref(ADDROW_BASE);
let lastValidCode = "";

/** 조회·그리드에 있는 코드 중 가장 큰 정수 + 1. 없으면 1 */
const nextMasterCode = (field) => {
  let max = 0;
  for (const list of [rowData.value, updateRow.value]) {
    if (!Array.isArray(list)) continue;
    for (const row of list) {
      if (row == null || Array.isArray(row)) continue;
      const n = Number(String(row[field] ?? "").trim());
      if (Number.isInteger(n) && n > max) max = n;
    }
  }
  return String(max + 1);
};

/** checkbox2(삭제체크) → lngDelete. 체크일 때만 1 */
const toLngDelete = (checkbox2) =>
  checkbox2 === true ||
  checkbox2 === 1 ||
  checkbox2 === "1" ||
  checkbox2 === "true" ||
  checkbox2 === "Y"
    ? 1
    : 0;

/** addrowProp 기준 checkbox2 인덱스 (getRows 배열용, 보조) */
const CHECKBOX2_IDX = 5;

const isRowDeleted = (row) => {
  if (row == null) return false;
  if (!Array.isArray(row)) {
    return toLngDelete(row.checkbox2 ?? row.lngDelete) === 1;
  }
  if (row.checkbox2 !== undefined) return toLngDelete(row.checkbox2) === 1;
  if (row.lngDelete !== undefined) return toLngDelete(row.lngDelete) === 1;

  const code = row[1];
  const fromList = Array.isArray(rowData.value)
    ? rowData.value.find(
        (r) =>
          r != null &&
          !Array.isArray(r) &&
          String(r.lngRankCode ?? "") === String(code ?? "")
      )
    : null;
  if (fromList) {
    return toLngDelete(fromList.checkbox2 ?? fromList.lngDelete) === 1;
  }
  const fromUpdate =
    Array.isArray(updateRow.value) &&
    changeRow.value !== "" &&
    changeRow.value != null &&
    changeRow.value >= 0
      ? updateRow.value[changeRow.value]
      : null;
  if (fromUpdate && !Array.isArray(fromUpdate)) {
    return toLngDelete(fromUpdate.checkbox2 ?? fromUpdate.lngDelete) === 1;
  }
  return toLngDelete(row[CHECKBOX2_IDX]) === 1;
};

/**
 * 신규: 코드+상세 개방
 * 기존 활성: 코드 잠금, 상세 개방
 * 기존 삭제: 코드·상세 모두 잠금
 */
const applyFormEditLock = (isNewRow, isDeleted = false) => {
  if (isNewRow) {
    isDeletedRow.value = false;
    disablegrid.value = false;
    disablegrid2.value = false;
    return;
  }
  isDeletedRow.value = !!isDeleted;
  disablegrid.value = true;
  disablegrid2.value = !!isDeleted;
};

const handleParentClick = () => {};

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  //reload.value = !reload.value;
  searchButton();
});

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

const store = useStore();

const afterClick = ref(false);
const clickedRowData = (e) => {
  if (e == null) return;

  // 원본과 동일: 코드(disablegrid)는 여기서 건드리지 않음 — sendRowState(created)가 연 상태를 유지
  const deleted = isRowDeleted(e);
  isDeletedRow.value = deleted;
  disablegrid2.value = deleted;
  afterClick.value = true;
  if (e?.rowState !== "created") {
    insertupdatedelete.value = 2;
  }

  gridvalue1.value = e[1];
  gridvalue2.value = e[2];
  gridvalue3.value = e[12];
  gridvalue4.value = e[3];

  gridvalue5.value = e[6];
  gridvalue6.value = e[7];
  gridvalue7.value = e[9];
  gridvalue8.value = e[10];
};

const updateStateRow = ref([]);
const allStateRows = (e) => {
  updateStateRow.value = e;
};
const sendRowState = (e) => {
  if (e == "created") {
    insertupdatedelete.value = 1;
    applyFormEditLock(true);
  } else {
    insertupdatedelete.value = 2;
    // 코드는 잠그고, 상세는 삭제 행만 잠금 (원본: clickedRowData가 상세를 다시 연 것과 동일)
    disablegrid.value = true;
    disablegrid2.value = isDeletedRow.value;
  }
};

const changeRow = ref(0);
const selectedIndex = (e) => {
  changeRow.value = e;
};
const changeNow = ref(false);
const changeColid = ref("");
const changeValue2 = ref("");

/** 직위코드 — 정수만 (잔상 없이 차단) */
const codeDigits = makeDigitsOnlyHandlers({
  setValue: (v) => {
    if (disablegrid.value || isDeletedRow.value) return;
    if (isZeroCode(v)) {
      gridvalue1.value = lastValidCode;
      return;
    }
    gridvalue1.value = v;
  },
  onCommit: (v) => {
    if (disablegrid.value || isDeletedRow.value) return;
    if (isZeroCode(v)) {
      gridvalue1.value = lastValidCode;
      return;
    }
    lastValidCode = v;
    changeColid.value = "lngRankCode";
    changeValue2.value = v;
    changeNow.value = !changeNow.value;
  },
});

/** 정렬 — 정수만 (잔상 없이 차단) */
const orderDigits = makeDigitsOnlyHandlers({
  setValue: (v) => {
    if (isDeletedRow.value) return;
    gridvalue4.value = v;
  },
  onCommit: (v) => {
    if (isDeletedRow.value) return;
    changeColid.value = "lngOrder";
    changeValue2.value = v;
    changeNow.value = !changeNow.value;
  },
});

const changeValue = (e) => {
  if (isDeletedRow.value) return;
  changeColid.value = e.target.name;
  changeValue2.value = e.target.value;
  changeNow.value = !changeNow.value;
};

const updateRow = ref([]);
const updatedRowData = (e) => {
  updateRow.value = e;
  if (
    !Array.isArray(e) ||
    changeRow.value === "" ||
    changeRow.value == null ||
    changeRow.value < 0
  ) {
    return;
  }
  const row = e[changeRow.value];
  if (row == null || disablegrid.value !== true) return;
  const deleted = isRowDeleted(row);
  isDeletedRow.value = deleted;
  disablegrid2.value = deleted;
};
/**
 *  조회 함수
 */

const searchButton = async () => {
  try {
    store.state.loading = true;
    initGrid();
    reload.value = !reload.value;
    const res = await getPositionList(store.state.userData.lngStoreGroup, 0);
    ////console.log(res);
    rowData.value = res.data.List;

    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    //comsole.log(error);
  } finally {
    store.state.loading = false;
  }
};
const addRow4 = ref(false);
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

  const unsavedCreated = updateStateRow.value?.created ?? [];
  if (unsavedCreated.length > 0) {
    Swal.fire({
      title: "경고",
      text: "신규 행을 저장한 뒤 다시 등록해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  insertupdatedelete.value = 1;
  applyFormEditLock(true);
  const nextCode = nextMasterCode("lngRankCode");
  const parts = ADDROW_BASE.split(",");
  parts[1] = nextCode;
  addrowDefault.value = parts.join(",");
  lastValidCode = nextCode;
  gridvalue1.value = nextCode;
  gridvalue2.value = "";
  gridvalue3.value = "1";
  gridvalue4.value = "";
  gridvalue5.value = "";
  gridvalue6.value = "";
  gridvalue7.value = "";
  gridvalue8.value = "";
  addRow4.value = !addRow4.value;
};

const saveButton = async () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  // ////console.log(updateStateRow.value);
  if (
    updateStateRow.value.deleted.length == 0 &&
    updateStateRow.value.updated.length == 0 &&
    updateStateRow.value.created.length == 0
  ) {
    Swal.fire({
      title: "경고",
      text: "변경된 사항이 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  const createdIndexes = updateStateRow.value.created ?? [];
  const createdRows = updateRow.value.filter((item, index) =>
    createdIndexes.includes(index)
  );
  if (createdRows.some((item) => isBlankCode(item?.lngRankCode))) {
    Swal.fire({
      title: "경고",
      text: "직위코드를 입력해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  if (createdRows.some((item) => isZeroCode(item?.lngRankCode))) {
    Swal.fire({
      title: "경고",
      text: "직위코드는 0으로 등록할 수 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  if (createdRows.some((item) => isBlankCode(item?.strRank))) {
    Swal.fire({
      title: "경고",
      text: "직위명을 입력해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  const rankCodes = updateRow.value.map((item) =>
    String(item?.lngRankCode ?? "").trim()
  );
  const filledCodes = rankCodes.filter((c) => c !== "");
  const dupRankCodes = [
    ...new Set(filledCodes.filter((c, i) => filledCodes.indexOf(c) !== i)),
  ];
  if (dupRankCodes.length > 0) {
    const dupText = dupRankCodes.join(", ");
    const targetIndex = updateRow.value.findIndex((item, index) => {
      const code = String(item?.lngRankCode ?? "").trim();
      return createdIndexes.includes(index) && dupRankCodes.includes(code);
    });
    if (targetIndex >= 0) {
      const row = updateRow.value[targetIndex];
      changeRow.value = targetIndex;
      insertupdatedelete.value = 1;
      applyFormEditLock(true);
      gridvalue1.value = row?.lngRankCode ?? "";
      gridvalue2.value = row?.strRank ?? "";
      gridvalue3.value = row?.intGrade ?? gridvalue3.value;
      gridvalue4.value = row?.lngOrder ?? "";
    }
    await Swal.fire({
      title: "경고",
      text: `이미 등록 된 직위 코드 [${dupText}] 번이 존재합니다. 직위 코드를 수정해 주십시오.`,
      icon: "warning",
      confirmButtonText: "확인",
      returnFocus: false,
      didClose: () => {
        const focusCode = () => {
          const el = codeInput.value;
          if (!el || el.disabled) return;
          el.focus();
          el.select?.();
        };
        focusCode();
        setTimeout(focusCode, 150);
      },
    });
    return;
  }
  try {
    store.state.loading = true;
    let res;
    const result = await fetch("https://api64.ipify.org", { timeout: 3000 });
    const data = await result.text();
    let userIp = data;

    if (updateStateRow.value.created.length > 0) {
      const rankcode = updateRow.value
        .filter((item, index) => updateStateRow.value.created.includes(index))
        .map((item) => item.lngRankCode);
      const strrank = updateRow.value
        .filter((item, index) => updateStateRow.value.created.includes(index))
        .map((item) => item.strRank);
      const lngOrder = updateRow.value
        .filter((item, index) => updateStateRow.value.created.includes(index))
        .map((item) => item.lngOrder);
      const checkbox2 = updateRow.value
        .filter((item, index) => updateStateRow.value.created.includes(index))
        .map((item) => toLngDelete(item.checkbox2));
      const userID = store.state.userData.lngSequence;
      const userIP = userIp;

      const intGrade = updateRow.value
        .filter((item, index) => updateStateRow.value.created.includes(index))
        .map((item) => item.intGrade);

      res = await savePosition(
        store.state.userData.lngStoreGroup,
        rankcode.join("\u200b"),
        strrank.join("\u200b"),
        lngOrder.join("\u200b"),
        checkbox2.join("\u200b"),
        userID,
        userIP,
        "I",
        intGrade.join("\u200b")
      );

      ////console.log(res);
    }

    if (updateStateRow.value.updated.length > 0) {
      const updatedRows = updateStateRow.value.updated;
      const activeUpdatedIndexes = updatedRows.filter((index) => {
        const item = updateRow.value[index];
        return item != null && toLngDelete(item.checkbox2) === 0;
      });

      if (activeUpdatedIndexes.length === 0) {
        store.state.loading = false;
        Swal.fire({
          title: "경고",
          text: "삭제된 항목은 수정할 수 없습니다. 활성화된 항목만 저장 가능합니다.",
          icon: "warning",
          confirmButtonText: "확인",
        });
        return;
      }

      const rankcode = updateRow.value
        .filter((item, index) => activeUpdatedIndexes.includes(index))
        .map((item) => item.lngRankCode);
      const strrank = updateRow.value
        .filter((item, index) => activeUpdatedIndexes.includes(index))
        .map((item) => item.strRank);
      const lngOrder = updateRow.value
        .filter((item, index) => activeUpdatedIndexes.includes(index))
        .map((item) => item.lngOrder);
      const checkbox2 = updateRow.value
        .filter((item, index) => activeUpdatedIndexes.includes(index))
        .map((item) => toLngDelete(item.checkbox2));
      const userID = store.state.userData.lngSequence;
      const userIP = userIp;

      const intGrade = updateRow.value
        .filter((item, index) => activeUpdatedIndexes.includes(index))
        .map((item) => item.intGrade);

      res = await savePosition(
        store.state.userData.lngStoreGroup,
        rankcode.join("\u200b"),
        strrank.join("\u200b"),
        lngOrder.join("\u200b"),
        checkbox2.join("\u200b"),
        userID,
        userIP,
        "U",
        intGrade.join("\u200b")
      );

      console.log(res);
    }

    if (res.data.RESULT_CD == "99") {
      Swal.fire({
        title: "실패",
        text: "저장에 실패하였습니다.",
        icon: "error",
        confirmButtonText: "확인",
      });
    } else {
      Swal.fire({
        title: "성공",
        text: "저장이 완료되었습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
    }

    ////console.log(res);
  } catch (error) {
  } finally {
    store.state.loading = false;
    searchButton();
  }
};

const deleteButton = async () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  // ////console.log(updateStateRow.value);
  if (updateRow.value.filter((item) => item.checkbox == true).length == 0) {
    Swal.fire({
      title: "경고",
      text: "삭제할 대상을 체크해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  try {
    store.state.loading = true;

    const result = await fetch("https://api64.ipify.org", { timeout: 3000 });
    const data = await result.text();
    let userIp = data;

    const rankcode = updateRow.value
      .filter((item) => item.checkbox == true)
      .map((item) => item.lngRankCode);
    const userID = store.state.userData.lngSequence;
    const userIP = userIp;

    const res = await deletePosition(
      store.state.userData.lngStoreGroup,
      rankcode.join("\u200b"),

      userID,
      userIP
    );

    ////console.log(res);
    if (res.data.RESULT_CD == "99") {
      Swal.fire({
        title: "실패",
        text: "삭제에 실패하였습니다.",
        icon: "error",
        confirmButtonText: "확인",
      });
    } else {
      Swal.fire({
        title: "성공",
        text: "삭제가 완료되었습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
    }

    ////console.log(res);
  } catch (error) {
  } finally {
    store.state.loading = false;
    searchButton();
  }
};
/* 매장 컴포넌트 관련 함수 */

/**
 * 페이지 매장 코드 세팅
 */

/**
 * 그리드 초기화
 */

const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
  afterSearch.value = false;

  gridvalue1.value = "";
  gridvalue2.value = "";
  gridvalue3.value = "1";
  gridvalue4.value = "";
  gridvalue5.value = "";
  gridvalue6.value = "";
  gridvalue7.value = "";
  gridvalue8.value = "";
  isDeletedRow.value = false;
  disablegrid.value = true;
  disablegrid2.value = true;
};

//엑셀 버튼 처리 함수
const exportExcel = ref(false);
/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  documentSubTitle.value = "";

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
</script>

<style scoped>
.att07-page {
  position: relative;
  z-index: 1;
  min-height: 0;
  /* 좌측 메뉴와 간격 */
  padding-left: 1.25rem;
  padding-right: 0.75rem;
  box-sizing: border-box;
}

.att07-toolbar {
  min-height: 2.5rem;
}

/* 본문만 흰 배경 — 항목명이 상단 파란 배경에 들어가지 않도록 */
.att07-body {
  display: flex;
  flex-direction: column;
  min-height: 0;
  background: #fff;
  border-radius: 0.75rem 0.75rem 0 0;
  box-shadow: 0 2px 8px rgb(15 23 42 / 8%);
  padding: 1rem 1.25rem 1rem;
  overflow: hidden;
}

.att07-workspace {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1.5rem;
  min-height: 0;
  overflow: hidden;
}

@media (min-width: 1024px) {
  .att07-workspace {
    grid-template-columns: minmax(0, 1.55fr) minmax(22rem, 0.85fr);
  }
}

.att07-left,
.att07-right {
  min-height: 0;
  min-width: 0;
}

.att07-section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.4rem;
  color: #111827;
}

.att07-section-title::before {
  content: "";
  flex: 0 0 0.25rem;
  width: 0.25rem;
  height: 1.05em;
  border-radius: 999px;
  background: #2563eb;
}

.att07-grid-wrap {
  position: relative;
  flex: 1 1 0;
  min-height: 12rem;
  overflow: hidden;
  width: 100%;
}

.att07-form-grid {
  --att07-label-col: 6.75rem;
  --att07-control-border: #cbd5e1;
  --att07-control-focus-border: #3b82f6;
  --att07-control-h: 1.5rem;
  --att07-control-radius: 0.375rem;
  --att07-detail-font: 0.8125rem;
  --att07-detail-row-h: 2rem;
  --att07-detail-cell-py: 0.25rem;
  display: grid;
  grid-template-columns: var(--att07-label-col) minmax(0, 1fr);
  grid-auto-rows: var(--att07-detail-row-h);
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  overflow: hidden;
  background: #fff;
  width: 100%;
  max-width: 100%;
}

.att07-form-grid > * {
  box-sizing: border-box;
  min-height: var(--att07-detail-row-h);
  align-self: stretch;
}

.att07-form-label {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: var(--att07-detail-row-h);
  padding: var(--att07-detail-cell-py) 0.375rem;
  border: 1px solid #e5e7eb;
  background: #edf2f7;
  color: #5c5c5c;
  font-size: var(--att07-detail-font);
  font-weight: 600;
  line-height: 1.25;
  text-align: center;
  word-break: keep-all;
}

.att07-form-label--required {
  color: #2563eb;
  font-weight: 700;
}

.att07-form-value {
  display: flex;
  align-items: center;
  min-height: var(--att07-detail-row-h);
  min-width: 0;
  padding: var(--att07-detail-cell-py) 0.5rem;
  border: 1px solid #e5e7eb;
  background: #fff;
}

.att07-form-value--radio {
  gap: 1.25rem;
}

.att07-radio-label {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: var(--att07-detail-font);
  font-weight: 600;
  color: #374151;
  white-space: nowrap;
  cursor: pointer;
}

.att07-radio-label input[type="radio"] {
  margin: 0;
  cursor: pointer;
}

.att07-radio-label:has(input:disabled) {
  cursor: not-allowed;
  color: #9ca3af;
}

.att07-control {
  box-sizing: border-box;
  height: var(--att07-control-h);
  min-height: var(--att07-control-h);
  max-height: var(--att07-control-h);
  width: 100%;
  max-width: 100%;
  min-width: 0;
  border-radius: var(--att07-control-radius);
  border: 1px solid var(--att07-control-border);
  background: #fff;
  padding: 0 0.5rem;
  font-size: var(--att07-detail-font);
  line-height: 1;
}

.att07-control:focus,
.att07-control:focus-visible {
  border-color: var(--att07-control-focus-border);
  outline: none;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.25);
}

.att07-control:disabled {
  background: #f3f4f6;
  color: #374151;
  cursor: default;
}

@media (max-height: 900px) {
  .att07-body {
    padding: 0.75rem 1rem;
  }

  .att07-form-grid {
    --att07-detail-row-h: 1.875rem;
    --att07-control-h: 1.375rem;
    --att07-detail-cell-py: 0.1875rem;
  }

  .att07-section-title {
    font-size: 1.0625rem;
  }
}
</style>
