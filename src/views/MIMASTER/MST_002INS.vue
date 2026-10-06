/*--############################################################################
# Filename : MST_002INS.vue                                                    
# Description : 마스터관리 > 매장 마스터 > 좌석정보등록(#)                     
# Date :2025-05-14                                                             
# Author : 권맑음                     
################################################################################*/
<template>
  <div class="mst002s-page box-border flex h-full max-w-full min-h-0 flex-col gap-1 overflow-hidden bg-white pb-1">
    <!-- 상단: 페이지명 + 액션 -->
    <div class="flex shrink-0 flex-wrap items-center justify-between gap-2 px-1">
      <PageName />
      <div class="flex flex-wrap items-center justify-end gap-2">
        <button type="button" @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <button type="button" @click="saveButton" class="button save md:w-auto w-auto">
          저장
        </button>
        <button type="button" @click="copyButton" class="button copy md:w-auto w-auto">
          복사
        </button>
      </div>
    </div>

    <!-- 조회 AREA -->
    <div class="mst002s-search-panel w-full min-w-0 shrink-0 rounded-lg bg-gray-200">
      <div class="mst002s-search-grid min-w-0">
        <div class="mst002s-cell">
          <div class="mst002s-sg-label">매장명</div>
          <div class="mst002s-cell-field mst002s-pick-slot min-w-0">
            <PickStore
              compact-search-bar
              main-name=""
              :compact-store-combo-max-rem="15.6"
              :showPosNo="true"
              @areaCd="handleStoreAreaCd"
              @update:storeCd="handleStoreCd"
              @posNo="handlePosNo"
              @storeNm="handlestoreNm"
              @update:ischanged="handleinitAll" />
          </div>
        </div>
      </div>
    </div>
    <!-- 조회 AREA -->
    <!-- 팝업 및 gridStack 태그 -->
    <DupliPopUp6
      :isVisible="showPopup2"
      @close="showPopup2 = false"
      :storeCd="nowStoreCd"
      :storeNm="clickedStoreNm"
      :areaCd="nowStoreAreaCd"
      :posNo="posNo"
      :progname="'MST01_004INS_VUE'"
      :dupliapiname="'DUPLITABLEKEY'"
      :progid="2"
      :poskiosk="'getStoreAndPosList3'"
      naming2="테이블" />
  <div
    v-if="showSetScreenKey"
    class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-[89]">
    <div class="bg-white p-6 rounded shadow-lg w-[25%] h-[40%]">
      <h2 class="text-lg font-bold">화면키 설정</h2>
      <div class="flex flex-col justify-start h-12">
        <div>
          <p>화면키명</p>
        </div>
        <div class="h-full w-full rounded-lg">
          <input
            type="text"
            class="border border-gray-400 pl-1 h-full w-full rounded-lg"
            v-model="currScreenNm" />
        </div>
      </div>

      <div class="flex justify-center space-x-3 w-full h-16">
        <button
          @click="confirmScreenKey"
          class="mt-4 p-2 bg-blue-500 text-white rounded">
          확인
        </button>
        <button
          @click="exitScreenKey"
          class="mt-4 p-2 bg-blue-500 text-white rounded">
          닫기
        </button>
      </div>
    </div>
  </div>

  <div
    v-if="showModifyScreenKey"
    class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-[89]">
    <div class="bg-white p-6 rounded shadow-lg w-[25%] h-[40%]">
      <h2 class="text-lg font-bold">화면키 수정</h2>
      <div class="flex flex-col justify-start h-12">
        <div>
          <p>화면키명</p>
        </div>
        <div class="h-full w-full rounded-lg">
          <input
            type="text"
            class="border border-gray-400 pl-1 h-full w-full rounded-lg"
            v-model="currScreenNm" />
        </div>
      </div>

      <div class="flex justify-center space-x-3 w-full h-16">
        <button
          @click="confirmModifyScreenKey"
          class="mt-4 p-2 bg-blue-500 text-white rounded">
          확인
        </button>
        <button
          @click="exitModifyScreenKey"
          class="mt-4 p-2 bg-blue-500 text-white rounded">
          닫기
        </button>
      </div>
    </div>
  </div>
  <div class="ml-10 flex max-w-full shrink-0 flex-row items-center">
    <div class="mst002s-screen-bar flex w-[1000px] max-w-full min-w-0 flex-row items-center">
      <button type="button" class="flex w-10 flex-shrink-0 items-center" @click="scrollLeft">
        <img src="../../assets/ic_before.svg" alt="" />
      </button>
      <div
        class="mst002s-screen-scroll relative z-[1] flex h-12 min-w-0 flex-1 items-center gap-2 overflow-hidden"
        ref="scrollContainer">
        <div
          v-for="(i, index) in ScreenKeyOrigin"
          :value="i.intScreenNo"
          class="bg-gray-100 rounded-lg w-[200px] h-10 flex-shrink-0 flex justify-center font-bold"
          :class="
            clickScreenButton == i.intScreenNo
              ? 'text-blue-800 border-blue-500 border-2'
              : 'black'
          ">
          <button type="button" @click="showOtherScreen(i.intScreenNo)" class="w-[80%]">
            {{ i.strScreenName }}
          </button>
          <button
            type="button"
            @click="showModifyButton(index, i.intScreenNo)"
            class="w-[15%]">
            <img src="../../assets/ic_kebap.svg" alt="" />
          </button>
          <div
            v-show="
              clickedShowModifyButton == index && showModifyButton2 == true
            "
            class="flex flex-col absolute bg-white z-[88] ml-36 mt-8 rounded-lg gap-2 w-12 border border-gray-600"
            ref="scrollContainer">
            <button
              type="button"
              class="text-black"
              @click="modifyScreenKey(i.strScreenName, i.intScreenNo)">
              수정
            </button>
            <button
              type="button"
              class="text-black"
              @click="deleteScreenKey(i.intScreenNo)">
              삭제
            </button>
          </div>
        </div>
      </div>

      <button type="button" class="flex w-10 flex-shrink-0 items-center" @click="scrollRight">
        <img src="../../assets/ic_after.svg" alt="" />
      </button>
      <button
        type="button"
        class="flex w-10 flex-shrink-0 items-center"
        @click="addScreenKey">
        <img src="../../assets/Btn_46_add.svg" alt="" />
      </button>
      <button
        type="button"
        class="flex w-10 flex-shrink-0 items-center"
        @click="initAllTable">
        <img src="../../assets/Btn_46_refresh.svg" alt="" />
      </button>
    </div>
    <!-- 액션 버튼: 속성 패널(표) 가로폭에 맞춰 3등분 -->
    <div class="mst002s-prop-col ml-4 flex h-12 w-[28%] min-w-[20rem] max-w-[30rem] shrink-0 items-center">
      <div class="mst002s-action-row">
        <button
          type="button"
          :disabled="afterSearch == false"
          class="mst002s-action-btn mst002s-action-btn--add"
          @click="addNewWidget()">
          <font-awesome-icon :icon="['fas', 'plus']" />
          테이블 추가
        </button>
        <button
          type="button"
          class="mst002s-action-btn mst002s-action-btn--copy"
          :disabled="clickTable == false"
          @click="duplicateTable">
          <font-awesome-icon :icon="['fas', 'copy']" />
          테이블 복사
        </button>
        <button
          type="button"
          class="mst002s-action-btn mst002s-action-btn--del"
          :disabled="clickTable == false"
          @click="deleteTable">
          <font-awesome-icon :icon="['fas', 'trash']" />
          테이블 삭제
        </button>
      </div>
    </div>
  </div>
  <!-- 팝업 및 gridStack 태그 -->
  <!-- input 태그 데이터 세팅  — 캔버스 위치·크기는 기존 유지 -->
  <div class="mst002s-workspace ml-10 flex shrink-0 items-start z-[1]">
    <!-- 모눈: 기존 좌표/사이즈 기준 고정(1000×630). 크기 변경 금지 -->
    <div
      class="grid-stack table_style mst002s-canvas shrink-0 overflow-hidden !w-[1000px] !h-[630px]"></div>

    <aside class="mst002s-prop-panel mst002s-prop-col ml-4 min-w-[20rem] max-w-[30rem] w-[28%] shrink-0">
      <div class="mst002s-section-head">
        <div class="mst002s-section-title">테이블 속성</div>
      </div>

      <fieldset
        class="mst002s-form-grid mt-2 w-full"
        :class="{ 'mst002s-form-grid--locked': clickTable == false }"
        :disabled="clickTable == false">
        <div class="mst002s-form-label mst002s-form-label--tall">형태</div>
        <div class="mst002s-form-value mst002s-field-span3 mst002s-form-value--shape">
          <div class="mst002s-shape-row">
            <button
              type="button"
              :disabled="clickTable == false"
              @click="shapeclick(0)"
              class="mst002s-shape-btn"
              :class="{ 'mst002s-shape-btn--on': clickedShape == 0 }">
              <img src="../../assets/palette1.svg" alt="사각형" />
            </button>
            <button
              type="button"
              :disabled="clickTable == false"
              @click="shapeclick(1)"
              class="mst002s-shape-btn"
              :class="{ 'mst002s-shape-btn--on': clickedShape == 1 }">
              <img src="../../assets/palette2.svg" alt="원" />
            </button>
            <button
              type="button"
              :disabled="clickTable == false"
              @click="shapeclick(2)"
              class="mst002s-shape-btn"
              :class="{ 'mst002s-shape-btn--on': clickedShape == 2 }">
              <img src="../../assets/palette3.svg" alt="타원" />
            </button>
            <button
              type="button"
              :disabled="clickTable == false"
              @click="shapeclick(3)"
              class="mst002s-shape-btn"
              :class="{ 'mst002s-shape-btn--on': clickedShape == 3 }">
              <img src="../../assets/palette4.svg" alt="기타" />
            </button>
          </div>
        </div>

        <div class="mst002s-form-label">테이블 코드</div>
        <div class="mst002s-form-value mst002s-field-span3">
          <input
            type="text"
            class="mst002s-control mst002s-control--wide"
            :value="
              String(clickedtableCode ?? '').includes('new')
                ? ''
                : clickedtableCode
            "
            disabled />
        </div>

        <div class="mst002s-form-label">테이블 명</div>
        <div class="mst002s-form-value mst002s-field-span3">
          <input
            type="text"
            class="mst002s-control mst002s-control--wide"
            v-model="clickedtableNm"
            @input="changetableProperty" />
        </div>

        <div class="mst002s-form-label">좌석 수</div>
        <div class="mst002s-form-value mst002s-field-span3">
          <input
            type="text"
            class="mst002s-control mst002s-control--wide"
            v-model="clickedtableSeats"
            @input="changetableProperty" />
        </div>

        <div class="mst002s-form-label">가로 위치(X)</div>
        <div class="mst002s-form-value">
          <input
            type="text"
            class="mst002s-control"
            v-model="clickedtableX"
            disabled />
        </div>
        <div class="mst002s-form-label">세로 위치(Y)</div>
        <div class="mst002s-form-value">
          <input
            type="text"
            class="mst002s-control"
            v-model="clickedtableY"
            disabled />
        </div>

        <div class="mst002s-form-label">너비</div>
        <div class="mst002s-form-value">
          <input
            type="text"
            class="mst002s-control"
            v-model="clickedtableW"
            disabled />
        </div>
        <div class="mst002s-form-label">높이</div>
        <div class="mst002s-form-value">
          <input
            type="text"
            class="mst002s-control"
            v-model="clickedtableH"
            disabled />
        </div>

        <div class="mst002s-form-label mst002s-form-label--tall">테이블 색상</div>
        <div class="mst002s-form-value mst002s-field-span3 mst002s-form-value--palette">
          <div class="mst002s-color-grid">
            <button
              type="button"
              class="mst002s-color-btn bg-white"
              :class="{ 'mst002s-color-btn--on': clickedtableColor == '#FFFFFF' }"
              @click="setColor(1)"></button>
            <button
              type="button"
              class="mst002s-color-btn bg-[#BACCFF]"
              :class="{ 'mst002s-color-btn--on': clickedtableColor == '#BACCFF' }"
              @click="setColor(2)"></button>
            <button
              type="button"
              class="mst002s-color-btn bg-[#B3EAFF]"
              :class="{ 'mst002s-color-btn--on': clickedtableColor == '#B3EAFF' }"
              @click="setColor(3)"></button>
            <button
              type="button"
              class="mst002s-color-btn bg-[#CFFFAB]"
              :class="{ 'mst002s-color-btn--on': clickedtableColor == '#CFFFAB' }"
              @click="setColor(4)"></button>
            <button
              type="button"
              class="mst002s-color-btn bg-[#FFDDBA]"
              :class="{ 'mst002s-color-btn--on': clickedtableColor == '#FFDDBA' }"
              @click="setColor(5)"></button>
            <button
              type="button"
              class="mst002s-color-btn bg-[#FFC5C5]"
              :class="{ 'mst002s-color-btn--on': clickedtableColor == '#FFC5C5' }"
              @click="setColor(6)"></button>
            <button
              type="button"
              class="mst002s-color-btn bg-[#D5C5FF]"
              :class="{ 'mst002s-color-btn--on': clickedtableColor == '#D5C5FF' }"
              @click="setColor(7)"></button>
            <button
              type="button"
              class="mst002s-color-btn bg-[#C3C3C3]"
              :class="{ 'mst002s-color-btn--on': clickedtableColor == '#C3C3C3' }"
              @click="setColor(8)"></button>
            <button
              type="button"
              class="mst002s-color-btn bg-[#7699FF]"
              :class="{ 'mst002s-color-btn--on': clickedtableColor == '#7699FF' }"
              @click="setColor(9)"></button>
            <button
              type="button"
              class="mst002s-color-btn bg-[#5DD2FF]"
              :class="{ 'mst002s-color-btn--on': clickedtableColor == '#5DD2FF' }"
              @click="setColor(10)"></button>
            <button
              type="button"
              class="mst002s-color-btn bg-[#9CFA55]"
              :class="{ 'mst002s-color-btn--on': clickedtableColor == '#9CFA55' }"
              @click="setColor(11)"></button>
            <button
              type="button"
              class="mst002s-color-btn bg-[#FFB162]"
              :class="{ 'mst002s-color-btn--on': clickedtableColor == '#FFB162' }"
              @click="setColor(12)"></button>
            <button
              type="button"
              class="mst002s-color-btn bg-[#FF9191]"
              :class="{ 'mst002s-color-btn--on': clickedtableColor == '#FF9191' }"
              @click="setColor(13)"></button>
            <button
              type="button"
              class="mst002s-color-btn bg-[#AB8CFF]"
              :class="{ 'mst002s-color-btn--on': clickedtableColor == '#AB8CFF' }"
              @click="setColor(14)"></button>
          </div>
        </div>
      </fieldset>
    </aside>
  </div>
  <!-- input 태그 데이터 세팅  -->
  </div>
</template>

<script setup>
import {
  getTableList,
  getTableScreenKeys,
  saveScreenKeys3,
  saveTables_test,
} from "@/api/master";
import DupliPopUp6 from "@/components/dupliPopUp6.vue";
/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
/**
 * 매장 공통 컴포넌트
 */

import PickStore from "@/components/pickStore.vue";
/**
 *  페이지로그 자동 입력
 *  */

import { insertPageLog } from "@/customFunc/customFunc";

import { GridStack } from "gridstack";
import "gridstack/dist/gridstack.min.css";

/**
 *  경고창 호출 라이브러리
 *  */

import Swal from "sweetalert2";
/*
 * 공통 표준  Function
 */
import { onActivated, onDeactivated, onMounted, ref, watch } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";

/** 조회 직후 tableList 스냅샷 — 저장 시 ADD/UPD/DEL diff 기준 */
const tableListBaseline = ref([]);

function isMst002TempTableRow(row) {
  if (!row) return false;
  const id = row.id != null ? String(row.id) : "";
  if (id && /^new/i.test(id)) return true;
  const k = row.lngKeyscrNo;
  if (k == null) return false;
  const ks = String(k);
  return ks.toLowerCase().includes("new");
}

function mst002RowPersistKey(row) {
  return `${String(row.intScreenNo)}_${String(row.lngKeyscrNo)}`;
}

function mst002PxDimToIntStr(v) {
  const n = Number(v);
  return Number.isFinite(n) ? String(Math.round(n)) : "0";
}

/** 모눈 위젯 표기용 테이블 코드 — 신규(new*)는 속성 패널과 같이 비움 */
function mst002DisplayTableCode(code) {
  if (code == null || code === "") return "";
  const s = String(code);
  return s.toLowerCase().includes("new") ? "" : s;
}

/** 테이블명(상단) + 테이블코드(왼쪽 하단) 라벨 */
function mst002AppendTableLabels(widgetElement, { name, code }) {
  if (!widgetElement) return;
  const content = widgetElement.querySelector(".grid-stack-item-content");
  if (!content) return;

  widgetElement
    .querySelectorAll(".mst002s-table-name, .mst002s-table-code")
    .forEach((el) => el.remove());

  const nameDiv = document.createElement("div");
  nameDiv.className = "mst002s-table-name";
  nameDiv.innerText = name != null ? String(name) : "";
  content.insertAdjacentElement("afterend", nameDiv);

  const codeDiv = document.createElement("div");
  codeDiv.className = "mst002s-table-code";
  codeDiv.innerText = mst002DisplayTableCode(code);
  content.insertAdjacentElement("afterend", codeDiv);
}

/** SP @x,@y,@w,@h 는 INT — 그리드 배율 곱의 소수 제거 */
function mst002RowToSaveGeometry(item) {
  const rawX =
    item.x !== undefined && item.x !== null ? item.x * 125 : item.lngX;
  const rawY =
    item.y !== undefined && item.y !== null ? item.y * 125 : item.lngY;
  const rawW =
    item.w !== undefined && item.w !== null ? item.w * 120 : item.lngWidth;
  const rawH =
    item.h !== undefined && item.h !== null ? item.h * 120 : item.lngHeight;
  return {
    x: mst002PxDimToIntStr(rawX),
    y: mst002PxDimToIntStr(rawY),
    w: mst002PxDimToIntStr(rawW),
    h: mst002PxDimToIntStr(rawH),
  };
}

function mst002TableRowEqualsForSave(cur, base) {
  const g1 = mst002RowToSaveGeometry(cur);
  const g2 = mst002RowToSaveGeometry(base);
  return (
    String(cur.lngKeyColor) === String(base.lngKeyColor) &&
    String(cur.lngShape) === String(base.lngShape) &&
    String(cur.strName ?? "") === String(base.strName ?? "") &&
    String(cur.lngCount ?? "") === String(base.lngCount ?? "") &&
    g1.x === g2.x &&
    g1.y === g2.y &&
    g1.w === g2.w &&
    g1.h === g2.h
  );
}

/**
 * saveTables(as-is ADD/UPD/DEL)용 delta — master.saveTables_test 두 번째 인자
 *
 * 백엔드는 ADD_* / UPD_* / DEL_* 파라미터를 콤마로 split 한 뒤 각 인덱스끼리 1행으로 묶기 때문에
 *  - 모든 parallel 배열의 길이가 같아야 한다
 *  - 빈 문자열("")은 0개로 해석되므로, 행이 1개라도 어떤 칼럼이 비어 있으면 "parallel array length mismatch" 발생
 * 따라서 push 시점에 숫자(좌석수 등)는 "0", 문자열(테이블명 등)은 공백("\u00A0")으로 정규화한다.
 */
function buildMst002TableSaveDelta(currentList, baselineList) {
  const base = Array.isArray(baselineList) ? baselineList : [];
  const cur = Array.isArray(currentList) ? currentList : [];

  /** 빈 값 → "0" (숫자 칼럼: 좌석수·색상·도형·좌표·크기) */
  const toIntStr = (v) => {
    if (v == null || v === "") return "0";
    const n = Number(v);
    return Number.isFinite(n) ? String(Math.trunc(n)) : "0";
  };
  /** 빈 값 → " " (문자열 칼럼: 테이블명) — 빈 문자열은 split에서 0개로 처리되므로 공백으로 대체 */
  const toSafeStr = (v) => {
    const s = v == null ? "" : String(v);
    return s.length === 0 ? " " : s;
  };

  const baselineMap = new Map();
  for (const b of base) {
    if (!isMst002TempTableRow(b)) {
      baselineMap.set(mst002RowPersistKey(b), b);
    }
  }

  const currentPersistedKeys = new Set();
  for (const r of cur) {
    if (!isMst002TempTableRow(r)) {
      currentPersistedKeys.add(mst002RowPersistKey(r));
    }
  }

  const delScreenNos = [];
  const delKeyscrNos = [];
  for (const b of base) {
    if (isMst002TempTableRow(b)) continue;
    const pk = mst002RowPersistKey(b);
    if (!currentPersistedKeys.has(pk)) {
      delScreenNos.push(toIntStr(b.intScreenNo));
      delKeyscrNos.push(toIntStr(b.lngKeyscrNo));
    }
  }

  const addClientIds = [];
  const addScreenNos = [];
  const addKeyColors = [];
  const addKeyShapes = [];
  const addKeyNames = [];
  const addKeyLngCounts = [];
  const addXs = [];
  const addYs = [];
  const addWs = [];
  const addHs = [];

  const updScreenNos = [];
  const updKeyscrNos = [];
  const updKeyColors = [];
  const updKeyShapes = [];
  const updKeyNames = [];
  const updKeyLngCounts = [];
  const updXs = [];
  const updYs = [];
  const updWs = [];
  const updHs = [];

  for (const r of cur) {
    if (isMst002TempTableRow(r)) {
      const geo = mst002RowToSaveGeometry(r);
      addClientIds.push(toSafeStr(r.id != null ? r.id : r.lngKeyscrNo));
      addScreenNos.push(toIntStr(r.intScreenNo));
      addKeyColors.push(toIntStr(r.lngKeyColor));
      addKeyShapes.push(toIntStr(r.lngShape));
      addKeyNames.push(toSafeStr(r.strName));
      addKeyLngCounts.push(toIntStr(r.lngCount));
      addXs.push(toIntStr(geo.x));
      addYs.push(toIntStr(geo.y));
      addWs.push(toIntStr(geo.w));
      addHs.push(toIntStr(geo.h));
    } else {
      const pk = mst002RowPersistKey(r);
      const baseRow = baselineMap.get(pk);
      if (!baseRow || !mst002TableRowEqualsForSave(r, baseRow)) {
        const geo = mst002RowToSaveGeometry(r);
        updScreenNos.push(toIntStr(r.intScreenNo));
        updKeyscrNos.push(toIntStr(r.lngKeyscrNo));
        updKeyColors.push(toIntStr(r.lngKeyColor));
        updKeyShapes.push(toIntStr(r.lngShape));
        updKeyNames.push(toSafeStr(r.strName));
        updKeyLngCounts.push(toIntStr(r.lngCount));
        updXs.push(toIntStr(geo.x));
        updYs.push(toIntStr(geo.y));
        updWs.push(toIntStr(geo.w));
        updHs.push(toIntStr(geo.h));
      }
    }
  }

  return {
    addClientIds,
    addScreenNos,
    addKeyColors,
    addKeyShapes,
    addKeyNames,
    addKeyLngCounts,
    addXs,
    addYs,
    addWs,
    addHs,
    updScreenNos,
    updKeyscrNos,
    updKeyColors,
    updKeyShapes,
    updKeyNames,
    updKeyLngCounts,
    updXs,
    updYs,
    updWs,
    updHs,
    delScreenNos,
    delKeyscrNos,
  };
}

const ScreenKeyOrigin = ref([]);
const changeMode = ref(false);
const Category = ref([]);

const store = useStore();
const userData = store.state.userData;
const groupCd = ref(userData.lngStoreGroup);
const nowStoreCd = ref("0");
const currentMenu = ref(1);
const clickTable = ref(false);
/**
 * 선택한 포스 번호 호출 함수
 */

const posNo = ref("");
const afterSearch = ref(false);
const nowStoreAreaCd = ref("0");
const clickScreenButton = ref(1);
const modified = ref(false);
const afterCategory = ref(false);
const clickedNo = ref("");
const clickedNm = ref("");
const confirmitem = ref("");
const clickedStoreNm = ref("");
const showPopup2 = ref(false);
const tableList = ref([]);
const clickedShape = ref(1);
const shapeclick = (value) => {
  clickedShape.value = value;
  const widgetElement = document.querySelector(
    `[gs-id="${clickedtableCode.value}"]`
  );
  const resizeHandle = widgetElement.querySelector(".grid-stack-item-content");
  if (resizeHandle != undefined) {
    resizeHandle.classList.remove("rectangle", "circle", "diamond", "triangle");

    if (clickedShape.value == 0) {
      resizeHandle.classList.add("rectangle");
    } else if (clickedShape.value == 1) {
      resizeHandle.classList.add("circle");
    } else if (clickedShape.value == 2) {
      resizeHandle.classList.add("diamond");
    } else if (clickedShape.value == 3) {
      resizeHandle.classList.add("triangle");
    }
    const finditFiltered = filteredtableList.value.find(
      (item) => item.lngKeyscrNo == clickedtableCode.value
    );
    if (finditFiltered) {
      finditFiltered.lngShape = clickedShape.value;
    }
    const findit = tableList.value.find(
      (item) =>
        item.lngKeyscrNo == clickedtableCode.value &&
        item.intScreenNo == clickScreenButton.value
    );
    //comsole.log(findit);
    //comsole.log(clickedtableCode.value);
    if (findit) {
      findit.lngShape = clickedShape.value;
    }
  }
};
const clickedColor = ref(1);
const setColor = (value) => {
  //comsole.log(value);
  if (value == 1) {
    clickedtableColor.value = "#FFFFFF";
  } else if (value == 2) {
    clickedtableColor.value = "#BACCFF";
  } else if (value == 3) {
    clickedtableColor.value = "#B3EAFF";
  } else if (value == 4) {
    clickedtableColor.value = "#CFFFAB";
  } else if (value == 5) {
    clickedtableColor.value = "#FFDDBA";
  } else if (value == 6) {
    clickedtableColor.value = "#FFC5C5";
  } else if (value == 7) {
    clickedtableColor.value = "#D5C5FF";
  } else if (value == 8) {
    clickedtableColor.value = "#C3C3C3";
  } else if (value == 9) {
    clickedtableColor.value = "#7699FF";
  } else if (value == 10) {
    clickedtableColor.value = "#5DD2FF";
  } else if (value == 11) {
    clickedtableColor.value = "#9CFA55";
  } else if (value == 12) {
    clickedtableColor.value = "#FFB162";
  } else if (value == 13) {
    clickedtableColor.value = "#FF9191";
  } else if (value == 14) {
    clickedtableColor.value = "#AB8CFF";
  }
  //comsole.log(clickedtableColor.value);
  const widgetElement = document.querySelector(
    `[gs-id="${clickedtableCode.value}"]`
  );

  if (widgetElement == undefined || widgetElement == null) {
    Swal.fire({
      title: "경고",
      text: "테이블을 먼저 생성한 후 색상을 선택해주세요.",
      icon: "warning",
      showCancelButton: false,
      confirmButtonColor: "#3085d6",
      allowOutsideClick: false,
    });
    return;
  }
  const resizeHandle = widgetElement.querySelector(".grid-stack-item-content");
  resizeHandle.style.backgroundColor = clickedtableColor.value;

  const findit = filteredtableList.value.find(
    (item) => item.lngKeyscrNo == clickedtableCode.value
  );
  findit.lngKeyColor = RGBToDecimal(clickedtableColor.value);

  const findit2 = tableList.value.find(
    (item) => item.lngKeyscrNo == clickedtableCode.value
  );
  findit2.lngKeyColor = RGBToDecimal(clickedtableColor.value);
};
const filteredtableList = ref([]);
/**
 * 페이지 매장 코드 세팅
 */

const handleStoreCd = async (newValue) => {
  afterSearch.value = false;

  nowStoreCd.value = newValue;
};

/**
 * 페이지 매장명 세팅
 */

const handlestoreNm = (newValue) => {
  clickedStoreNm.value = newValue;
};

/**
 * pickStore - 포스번호 세팅
 */

const handlePosNo = (newValue) => {
  posNo.value = newValue;
  //comsole.log(posNo.value);
  if (
    nowStoreAreaCd.value != undefined &&
    posNo.value != undefined &&
    posNo.value != 0
  ) {
    searchButton();
  }
};

/**
 *  pickStore - 지역코드 세팅
 */

const handleStoreAreaCd = (newValue) => {
  nowStoreAreaCd.value = newValue;
  //comsole.log(nowStoreAreaCd.value);
};
let grid = null; // DO NOT use ref(null) as proxies GS will break all logic when comparing structures... see https://github.com/gridstack/gridstack.js/issues/2115

/**
 *  조회 함수
 */

const searchButton = async () => {
  items.value = [];
  if (grid != null) {
    grid.removeAll();
  }

  if (nowStoreCd.value == "0" || nowStoreCd.value == undefined) {
    Swal.fire({
      title: "경고",
      text: "매장을 선택하세요.",
      icon: "warning",
      showCancelButton: false,
      confirmButtonColor: "#3085d6",
      allowOutsideClick: false,
    });
    return;
  }
  if (nowStoreAreaCd.value == "0" || nowStoreAreaCd.value == undefined) {
    Swal.fire({
      title: "경고",
      text: "POS번호를 선택하세요.",
      icon: "warning",
      showCancelButton: false,
      confirmButtonColor: "#3085d6",
      allowOutsideClick: false,
    });
    return;
  }

  store.state.loading = true;
  try {
    let res;

    res = await getTableScreenKeys(
      groupCd.value,
      nowStoreCd.value,
      posNo.value,
      nowStoreAreaCd.value
    );
    ScreenKeyOrigin.value = Array.isArray(res.data.SCREENKEYS)
      ? res.data.SCREENKEYS
      : [];

    //comsole.log(ScreenKeyOrigin.value);
    let res2 = await getTableList(
      groupCd.value,
      nowStoreCd.value,
      posNo.value,
      nowStoreAreaCd.value
    );

    ////console.log(res2);
    tableList.value = Array.isArray(res2.data.TABLELISTS)
      ? res2.data.TABLELISTS
      : [];
    tableListBaseline.value = JSON.parse(JSON.stringify(tableList.value));
    //comsole.log(tableList.value);
    filteredtableList.value = tableList.value
      .filter((item) => item.intScreenNo == "1")
      .map((item) => ({
        ...item,
        x: Math.round(item.lngX / 125),
        y: Math.round(item.lngY / 125),
        w: Math.round(item.lngWidth / 120),
        h: Math.round(item.lngHeight / 120),
        id: item.lngKeyscrNo,
      }));
    afterSearch.value = true;
    //comsole.log(filteredtableList.value);
  } catch (error) {
    afterSearch.value = false;
  } finally {
    store.state.loading = false; // 로딩 상태 종료
    modified.value = false;
    afterCategory.value = false;
    clickedNo.value = "";
    clickedNm.value = "";
    clickTable.value = false;
    clickedtableCode.value = "";
    showModifyButton2.value = false;
    showOtherScreen(clickScreenButton.value);
  }
};

const RGBToDecimal = (hex) => {
  // Remove '#' if present
  const cleanHex = hex.startsWith("#") ? hex.slice(1) : hex;

  // Parse the RGB components from the hex string
  const r = parseInt(cleanHex.slice(0, 2), 16);
  const g = parseInt(cleanHex.slice(2, 4), 16);
  const b = parseInt(cleanHex.slice(4, 6), 16);

  // Combine the RGB components into a single decimal value
  return (r << 16) | (g << 8) | b;
};
const decimalToRGB = (decimal) => {
  const r = ((decimal >> 16) & 255).toString(16).padStart(2, "0").toUpperCase();
  const g = ((decimal >> 8) & 255).toString(16).padStart(2, "0").toUpperCase();
  const b = (decimal & 255).toString(16).padStart(2, "0").toUpperCase();
  return `#${r}${g}${b}`;
};

watch(tableList, () => {
  //comsole.log(tableList.value);
});

const clickedtableCode = ref("");
const clickedtableNm = ref("");
const clickedtableSeats = ref("");
const clickedtableX = ref("");
const clickedtableY = ref("");
const clickedtableW = ref("");
const clickedtableH = ref("");
const clickedtableShape = ref("1");
const clickedtableColor = ref("");
let count = ref(0);
let info = ref("");
let items = ref([]);

function initializeGrid() {
  const el =
    document.querySelector(".mst002s-workspace .grid-stack") ||
    document.querySelector(".grid-stack");
  const grid = GridStack.init(
    {
      float: true,
      cellHeight: "auto",
      column: 90,
      margin: 0,
      alwaysShowResizeHandle: false,
      resizable: { handles: "e,se", autoHide: true },
      minRow: 56,
      maxRow: 56,
    },
    el
  );

  if (grid) {
    grid.on("dragstop", (event, element) => handleDragStop(grid, element));
    grid.on("resizestop", (event, element) => handleResizeStop(grid, element));
  }
  return grid;
}

function handleDragStop(grid, element) {
  const node = element?.gridstackNode;
  if (!node || !grid) return;

  const apply = () => {
    if (!element?.isConnected || !element.gridstackNode) return;

    let changed = false;
    if (node.w <= 3) {
      node.w = 3;
      changed = true;
    }
    if (node.h <= 3) {
      node.h = 3;
      changed = true;
    }
    if (changed) {
      grid.update(element, {
        w: node.w,
        h: node.h,
        minW: 3,
        minH: 3,
      });
    }

    updateNodePosition(grid, node);
    syncFilteredTableList();
    updateTableListFromFiltered();

    const widgetElement = document.querySelector(`[gs-id="${node.id}"]`);
    if (widgetElement) {
      widgetElement.click();
    }
  };

  // DDResizable/Draggable stop 콜백 안에서 DOM을 바꾸면 el.classList 오류 발생 → 다음 프레임에 반영
  requestAnimationFrame(apply);
}

function handleResizeStop(grid, element) {
  const node = element?.gridstackNode;
  if (!node || !grid) return;

  const apply = () => {
    if (!element?.isConnected || !element.gridstackNode) return;

    let changed = false;
    if (node.w <= 3) {
      node.w = 3;
      changed = true;
    }
    if (node.h <= 3) {
      node.h = 3;
      changed = true;
    }
    if (changed) {
      grid.update(element, {
        w: node.w,
        h: node.h,
        minW: 3,
        minH: 3,
      });
    }

    updateNodeSize(node);
    syncFilteredTableList();
    updateTableListFromFiltered();
  };

  requestAnimationFrame(apply);
}

function updateNodePosition(grid, node) {
  const findtableindex = filteredtableList.value.findIndex(
    (item) => item.id === node.id
  );
  if (findtableindex !== -1) {
    filteredtableList.value[findtableindex].x = node.x;
    filteredtableList.value[findtableindex].y = node.y;
  }

  grid.getGridItems().forEach((item) => {
    if (item.gridstackNode.id !== node.id) {
      const itemIndex = filteredtableList.value.findIndex(
        (e) => e.id === item.gridstackNode.id
      );
      if (itemIndex !== -1) {
        filteredtableList.value[itemIndex].x = item.gridstackNode.x;
        filteredtableList.value[itemIndex].y = item.gridstackNode.y;
      }
    }
  });
}

function updateNodeSize(node) {
  const findtableindex = filteredtableList.value.findIndex(
    (item) => item.id === node.id
  );
  if (findtableindex !== -1) {
    filteredtableList.value[findtableindex].w = node.w <= 3 ? 3 : node.w;
    filteredtableList.value[findtableindex].h = node.h <= 3 ? 3 : node.h;
  }
}

function syncFilteredTableList() {
  filteredtableList.value.forEach((item) => {
    const tableItem = tableList.value.find(
      (item2) =>
        item2.intScreenNo === item.intScreenNo &&
        item2.lngKeyscrNo === item.lngKeyscrNo
    );
    if (tableItem) {
      Object.keys(item).forEach((key) => {
        if (["w", "h", "x", "y"].includes(key)) {
          tableItem[key] = item[key];
        } else {
          tableItem[key] = item[key];
        }
      });
    }
  });
}

function updateTableListFromFiltered() {
  filteredtableList.value.forEach((item) => {
    const tableItem = tableList.value.find(
      (item2) =>
        item2.intScreenNo === item.intScreenNo &&
        item2.lngKeyscrNo === item.lngKeyscrNo
    );
    if (tableItem) {
      Object.keys(item).forEach((key) => {
        if (["w", "h", "x", "y"].includes(key)) {
          tableItem[key] = item[key];
        } else {
          tableItem[key] = item[key];
        }
      });
    }
  });
}

// Usage in onMounted
/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  grid = initializeGrid();
});

const sequence = ref(1);
function addNewWidget() {
  const n = sequence.value;
  // filteredtableList에서 아이템을 가져옴, 없으면 기본 값 설정
  const node = {
    w: 5, // 너비
    h: 5,
    intScreenNo: clickScreenButton.value,
    lngCount: 0,
    lngKeyColor: "16777215",
    lngKeyscrNo: "new" + n,
    lngShape: 0,
    strName: "신규" + n,
  };
  // id는 count 값을 사용 (++sequence 하면 표시/키가 한 칸 밀림)
  node.id = String("new" + n);

  // autoPosition을 true로 설정하여 겹치지 않게 자동으로 위치 배치
  const result = grid.addWidget(node); // true로 설정하면 GridStack이 자동으로 위치를 계산
  //comsole.log(result);
  grid.commit();

  const validate = result.gridstackNode;
  const validate2 =
    validate.x + validate.w > 90 || validate.y + validate.h > 56;
  //comsole.log(validate);
  const gridItems = grid.getGridItems();
  const addedWidget = gridItems.find(
    (item) => item.gridstackNode.id === node.id
  );
  if (validate2 == true) {
    grid.removeWidget(addedWidget);
    Swal.fire({
      title: "오류",
      text: "더이상 위치할 공간이 없습니다.",
      icon: "error",
      confirmButtonText: "확인",
    });
    return;
  }
  sequence.value = n + 1;
  filteredtableList.value.push({
    intScreenNo: Number(clickScreenButton.value),
    strName: "신규" + n,
    lngShape: 0,
    lngKeyColor: 16777215,
    lngKeyscrNo: "new" + n,
    lngCount: 0,
    w: 5,
    h: 5,
    id: node.id,
    x: addedWidget.gridstackNode.x,
    y: addedWidget.gridstackNode.y,
  });
  tableList.value.push({
    intScreenNo: clickScreenButton.value,
    strName: "신규" + n,
    lngShape: 0,
    lngKeyColor: 16777215,
    lngKeyscrNo: "new" + n,
    lngCount: 0,
    w: 5,
    h: 5,
    id: node.id,
    x: addedWidget.gridstackNode.x,
    y: addedWidget.gridstackNode.y,
  });
  const widgetElement = document.querySelector(`[gs-id="${node.id}"]`);
  if (widgetElement) {
    widgetElement.style.backgroundColor = "";
    const resizeHandle = widgetElement.querySelector(
      ".grid-stack-item-content"
    );
    resizeHandle.style.backgroundColor = decimalToRGB("16777215");
    resizeHandle.classList.add("rectangle");
  }
  const textElement = widgetElement.querySelector(".grid-stack-item-content");
  if (textElement) {
    mst002AppendTableLabels(widgetElement, {
      name: "신규" + n,
      code: node.id,
    });
  }
  widgetElement.addEventListener("click", function () {
    const finditem = filteredtableList.value.find(
      (item2) => item2.id == node.id
    );
    const widgetElements = document.querySelectorAll("[gs-id]");

    // 각 요소에 대해 스타일 변경
    widgetElements.forEach((widgetElement) => {
      // 원하는 스타일 변경
      widgetElement.style.border = "";
    });
    widgetElement.style.border = "2px solid black";

    //comsole.log("아이템 클릭됨!");
    //comsole.log(`아이템 ID: ${finditem.id}`);
    clickedtableColor.value = decimalToRGB(finditem.lngKeyColor);
    clickedtableShape.value = finditem.lngShape;
    clickedShape.value = Number(finditem.lngShape);
    clickedtableCode.value = finditem.id;
    clickedtableNm.value = finditem.strName;
    clickedtableX.value = finditem.x * 125;
    clickedtableY.value = finditem.y * 125;
    clickedtableW.value = finditem.w * 120 <= 360 ? 360 : finditem.w * 120;
    clickedtableH.value = finditem.h * 120 <= 360 ? 360 : finditem.h * 120;
    clickTable.value = true;
    clickedtableSeats.value = finditem.lngCount;
  });
  widgetElement.click();
  //comsole.log(tableList.value);
}

watch(
  filteredtableList,
  (newList) => {
    if (newList.length > 0) {
      for (var i = 0; i < filteredtableList.value.length; i++) {
        const item = filteredtableList.value[i];
        const node = {
          x: item.x,
          y: item.y,
          w: item.w,
          h: item.h,
          id: item.id,
        };

        if (grid == null) {
          return;
        }
        // 이미 그리드에 있으면 재추가하지 않음 (리사이즈 중 DOM 파괴 방지)
        if (
          grid.engine?.nodes?.some((n) => String(n.id) === String(item.id)) ||
          document.querySelector(`[gs-id="${item.id}"]`)
        ) {
          continue;
        }
        grid.addWidget(node); // Add widget to the grid

        const widgetElement = document.querySelector(`[gs-id="${item.id}"]`);
        if (widgetElement) {
          widgetElement.style.backgroundColor = "";
          const resizeHandle = widgetElement.querySelector(
            ".grid-stack-item-content"
          );
          resizeHandle.style.backgroundColor = decimalToRGB(item.lngKeyColor);
          if (item.lngShape == "0") {
            resizeHandle.classList.add("rectangle");
          } else if (item.lngShape == "1") {
            resizeHandle.classList.add("circle");
          } else if (item.lngShape == "2") {
            resizeHandle.classList.add("diamond");
          } else if (item.lngShape == "3") {
            resizeHandle.classList.add("triangle");
          }
        }
        const textElement = widgetElement?.querySelector(
          ".grid-stack-item-content"
        );
        if (textElement) {
          mst002AppendTableLabels(widgetElement, {
            name: item.strName,
            code: item.lngKeyscrNo ?? item.id,
          });
        }
        if (widgetElement) {
          widgetElement.addEventListener("click", function () {
            const finditem = filteredtableList.value.find(
              (item2) => item2.id == item.id
            );
            const widgetElements = document.querySelectorAll("[gs-id]");

            // 각 요소에 대해 스타일 변경
            widgetElements.forEach((widgetElement) => {
              // 원하는 스타일 변경
              widgetElement.style.border = "";
            });
            widgetElement.style.border = "2px solid black";

            //comsole.log("아이템 클릭됨!");
            //comsole.log(`아이템 ID: ${finditem.id}`);
            clickedtableColor.value = decimalToRGB(finditem.lngKeyColor);
            clickedtableShape.value = finditem.lngShape;
            clickedShape.value = Number(finditem.lngShape);
            clickedtableCode.value = finditem.id;
            clickedtableNm.value = finditem.strName;
            clickedtableX.value = finditem.x * 125;
            clickedtableY.value = finditem.y * 125;
            clickedtableW.value =
              finditem.w * 120 <= 360 ? 360 : finditem.w * 120;
            clickedtableH.value =
              finditem.h * 120 <= 360 ? 360 : finditem.h * 120;
            clickTable.value = true;
            clickedtableSeats.value = finditem.lngCount;
            //comsole.log(`x: ${finditem.x}, y: ${finditem.y}`);
            //comsole.log(`너비: ${finditem.w}, 높이: ${finditem.h}`);
            //comsole.log(clickedtableColor.value);
            //comsole.log(clickedShape.value);
            // 원하는 추가 작업을 여기에 작성
          });
        }
      }
    }
  },
  { immediate: false } // tableList가 처음 정의되었을 때는 실행하지 않음
);

const showOtherScreen = (newValue) => {
  //comsole.log(filteredtableList.value);
  //comsole.log(tableList.value);
  //comsole.log(newValue);
  clickTable.value = false;
  filteredtableList.value.forEach((item) => {
    const tableItem = tableList.value.find(
      (item2) =>
        item2.intScreenNo == item.intScreenNo &&
        item2.lngKeyscrNo == item.lngKeyscrNo
    );
    if (tableItem) {
      Object.keys(item).forEach((key) => {
        if (key == "w") {
          tableItem["lngWidth"] = item["w"] * 120;
        } else if (key == "h") {
          tableItem["lngHeight"] = item["h"] * 120;
        } else if (key == "x") {
          tableItem["lngX"] = item["x"] * 125;
        } else if (key == "y") {
          tableItem["lngY"] = item["y"] * 125;
        } else {
          tableItem[key] = item[key];
        }
      });
    }
  });
  //comsole.log(tableList.value);
  //comsole.log(grid);
  if (grid != null) {
    //comsole.log(grid.nodes);
    if (grid == undefined) {
      return;
    }
    grid.removeAll();
  }
  filteredtableList.value = tableList.value
    .filter((item) => item.intScreenNo == newValue)
    .map((item) => ({
      ...item,
      x: Math.round(item.lngX / 125),
      y: Math.round(item.lngY / 125),
      w: Math.round(item.lngWidth / 120),
      h: Math.round(item.lngHeight / 120),
      id: item.lngKeyscrNo,
    }));
  clickScreenButton.value = newValue;
  clickedShowModifyButton.value = -1;
};
const scrollContainer = ref(null);
const scrollRight = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollLeft += 200; // 오른쪽으로 200px 이동
  }
};
const scrollLeft = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollLeft -= 200; // 오른쪽으로 200px 이동
  }
};
const deleteTable = () => {
  const finditem = filteredtableList.value.find(
    (item) => item.id == clickedtableCode.value
  );
  if (finditem) {
    const index = filteredtableList.value.indexOf(finditem);
    if (index > -1) {
      filteredtableList.value.splice(index, 1);
    }
  }
  //comsole.log(filteredtableList.value);
  const finditem2 = tableList.value.find(
    (item) =>
      item.lngKeyscrNo == clickedtableCode.value &&
      item.intScreenNo == clickScreenButton.value
  );
  if (finditem2) {
    const index = tableList.value.indexOf(finditem2);
    if (index > -1) {
      tableList.value.splice(index, 1);
    }
  }
  //comsole.log(tableList.value);

  const widgetElement = document.querySelector(
    `[gs-id="${clickedtableCode.value}"]`
  );
  if (widgetElement) {
    grid.removeWidget(widgetElement);
  }
};

const duplicateTable = () => {
  if (clickedtableCode.value != "") {
    const node = {
      w: Number(clickedtableW.value / 120), // 너비
      h: Number(clickedtableH.value / 120),
      intScreenNo: clickScreenButton.value,
      lngCount: clickedtableSeats.value,
      lngKeyColor: RGBToDecimal(clickedtableColor.value),
      lngKeyscrNo: "new" + ++sequence.value,
      lngShape: Number(clickedShape.value),
      strName: "신규" + sequence.value,
    };
    // id는 count 값을 사용
    //comsole.log(node);
    node.id = String("new" + sequence.value);

    // autoPosition을 true로 설정하여 겹치지 않게 자동으로 위치 배치
    const result = grid.addWidget(node); // true로 설정하면 GridStack이 자동으로 위치를 계산
    grid.commit();
    const validate = result.gridstackNode;
    const validate2 =
      validate.x + validate.w > 90 || validate.y + validate.h > 56;
    //comsole.log(validate);
    const gridItems = grid.getGridItems();
    const addedWidget = gridItems.find(
      (item) => item.gridstackNode.id === node.id
    );
    if (validate2 == true) {
      grid.removeWidget(addedWidget);
      Swal.fire({
        title: "오류",
        text: "더이상 위치할 공간이 없습니다.",
        icon: "error",
        confirmButtonText: "확인",
      });
      return;
    }

    filteredtableList.value.push({
      intScreenNo: clickScreenButton.value,
      strName: "신규" + sequence.value,
      lngShape: clickedShape.value,
      lngKeyColor: RGBToDecimal(clickedtableColor.value),
      lngKeyscrNo: "new" + sequence.value,
      lngCount: clickedtableSeats.value,
      w: clickedtableW.value / 120,
      h: clickedtableH.value / 120,
      id: node.id,
      x: addedWidget.gridstackNode.x,
      y: addedWidget.gridstackNode.y,
    });
    tableList.value.push({
      intScreenNo: clickScreenButton.value,
      strName: "신규" + sequence.value,
      lngShape: clickedShape.value,
      lngKeyColor: RGBToDecimal(clickedtableColor.value),
      lngKeyscrNo: "new" + sequence.value,
      lngCount: clickedtableSeats.value,
      w: clickedtableW.value / 120,
      h: clickedtableH.value / 120,
      id: node.id,
      x: addedWidget.gridstackNode.x,
      y: addedWidget.gridstackNode.y,
    });
    const widgetElement = document.querySelector(`[gs-id="${node.id}"]`);
    if (widgetElement) {
      widgetElement.style.backgroundColor = "";
      const resizeHandle = widgetElement.querySelector(
        ".grid-stack-item-content"
      );
      resizeHandle.style.backgroundColor = clickedtableColor.value;
      if (clickedShape.value == 0) {
        resizeHandle.classList.add("rectangle");
      } else if (clickedShape.value == 1) {
        resizeHandle.classList.add("circle");
      } else if (clickedShape.value == 2) {
        resizeHandle.classList.add("diamond");
      } else if (clickedShape.value == 3) {
        resizeHandle.classList.add("triangle");
      }
    }

    const textElement = widgetElement.querySelector(".grid-stack-item-content");
    if (textElement) {
      mst002AppendTableLabels(widgetElement, {
        name: "신규" + sequence.value,
        code: node.id,
      });
    }
    widgetElement.addEventListener("click", function () {
      const finditem = filteredtableList.value.find(
        (item2) => item2.id == node.id
      );
      const widgetElements = document.querySelectorAll("[gs-id]");

      // 각 요소에 대해 스타일 변경
      widgetElements.forEach((widgetElement) => {
        // 원하는 스타일 변경
        widgetElement.style.border = "";
      });
      widgetElement.style.border = "2px solid black";

      //comsole.log("아이템 클릭됨!");
      //comsole.log(`아이템 ID: ${finditem.id}`);
      clickedtableColor.value = decimalToRGB(finditem.lngKeyColor);
      clickedtableShape.value = finditem.lngShape;
      clickedShape.value = Number(finditem.lngShape);
      clickedtableCode.value = finditem.id;
      clickedtableNm.value = finditem.strName;
      clickedtableX.value = finditem.x * 125;
      clickedtableY.value = finditem.y * 125;
      clickedtableW.value = finditem.w * 120 <= 360 ? 360 : finditem.w * 120;
      clickedtableH.value = finditem.h * 120 <= 360 ? 360 : finditem.h * 120;
      clickedtableSeats.value = finditem.lngCount;
      //comsole.log(`x: ${finditem.x}, y: ${finditem.y}`);
      //comsole.log(`너비: ${finditem.w}, 높이: ${finditem.h}`);
      //comsole.log(clickedtableColor.value);
      // 원하는 추가 작업을 여기에 작성
    });
    widgetElement.click();
    //comsole.log(filteredtableList.value);
  } else {
    Swal.fire({
      title: "오류",
      text: "복사할 대상을 선택해주세요.",
      icon: "error",
      confirmButtonText: "확인",
    });
    return;
  }
};
const showSetScreenKey = ref(false);
const addScreenKey = () => {
  showSetScreenKey.value = true;
};

const exitScreenKey = () => {
  showSetScreenKey.value = false;
};
const currScreenNm = ref("");

const confirmScreenKey = () => {
  if (currScreenNm.value == "") {
    Swal.fire({
      title: "오류",
      text: "화면명을 입력하세요.",
      icon: "error",
      confirmButtonText: "확인",
    });
    return;
  }
  const existingNos = ScreenKeyOrigin.value
    .map((item) => Number(item.intScreenNo))
    .filter((n) => Number.isFinite(n));
  const nextKeyno = existingNos.length > 0 ? Math.max(...existingNos) : 0;

  //comsole.log(nextKeyno);
  ScreenKeyOrigin.value.push({
    strScreenName: currScreenNm.value,
    intScreenNo: nextKeyno + 1,
    intScreenKeySeq: 1,
  });
  showSetScreenKey.value = false;
};
const clickedShowModifyButton = ref(-1);
const showModifyButton2 = ref(false);
const showModifyButton = (newValue, newValue2) => {
  showOtherScreen(newValue2);
  clickedShowModifyButton.value = newValue;
  showModifyButton2.value = true;
};
const showModifyScreenKey = ref(false);

const modifyScreenNo = ref("0");
const modifyScreenKey = (value, value2) => {
  showModifyScreenKey.value = true;
  currScreenNm.value = value;
  modifyScreenNo.value = value2;
};
const exitModifyScreenKey = () => {
  showModifyScreenKey.value = false;
};
const confirmModifyScreenKey = () => {
  const findit = ScreenKeyOrigin.value.find(
    (item) => item.intScreenNo == modifyScreenNo.value
  );
  findit.strScreenName = currScreenNm.value;
  showModifyScreenKey.value = false;
  showModifyButton2.value = false;
};
const deleteScreenKey = (newValue) => {
  Swal.fire({
    title: "확인",
    text: "정말 삭제하시겠습니까?",
    icon: "error",
    confirmButtonText: "확인",
    showCancelButton: true,
    cancelButtonText: "취소",
  }).then((result) => {
    if (result.isConfirmed) {
      ScreenKeyOrigin.value = ScreenKeyOrigin.value.filter(
        (item) => item.intScreenNo !== newValue
      );
      filteredtableList.value = filteredtableList.value.filter(
        (item) => item.intScreenNo !== newValue
      );
      tableList.value = tableList.value.filter(
        (item) => item.intScreenNo !== newValue
      );
      if (grid != null) {
        grid.removeAll();
      }
      showModifyButton2.value = false;
    }
  });
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
  //comsole.log(filteredtableList.value);
  //comsole.log(tableList.value);
  // if(JSON.stringify(confirmitem.value) === JSON.stringify(updatedList.value) ) {
  //   Swal.fire({
  //     title: '경고',
  //     text: '변경된 사항이 없습니다.',
  //     icon: 'warning',
  //     confirmButtonText: '확인'
  //   })
  //   return ;
  // }

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
        const ScreenKeyNms = ScreenKeyOrigin.value.map(
          (item) => item.strScreenName
        );
        const ScreenKeyNos = ScreenKeyOrigin.value.map(
          (item) => item.intScreenNo
        );
        const res = await saveScreenKeys3(
          groupCd.value,
          nowStoreCd.value,
          posNo.value,
          nowStoreAreaCd.value,
          ScreenKeyNms.join(","),
          ScreenKeyNos.join(",")
        );
        if (res.data?.RESULT_CD != null && res.data.RESULT_CD !== "00") {
          throw new Error(res.data.RESULT_NM || "화면키 저장에 실패했습니다.");
        }

        updateTableListFromFiltered();
        const delta = buildMst002TableSaveDelta(
          tableList.value,
          tableListBaseline.value
        );
        const res2 = await saveTables_test(
          groupCd.value,
          nowStoreCd.value,
          posNo.value,
          nowStoreAreaCd.value,
          delta
        );
        if (res2.data?.RESULT_CD != null && res2.data.RESULT_CD !== "00") {
          throw new Error(res2.data.RESULT_NM || "테이블 저장에 실패했습니다.");
        }

        await Swal.fire({
          title: "저장 되었습니다.",
          confirmButtonText: "확인",
        });
        await searchButton();
        showOtherScreen(clickScreenButton.value);
      } catch (error) {
        const msg =
          error?.response?.data?.RESULT_NM ||
          error?.response?.data?.message ||
          error?.message ||
          "저장 중 오류가 발생했습니다.";
        Swal.fire({
          title: "저장 실패",
          text: String(msg),
          icon: "error",
          confirmButtonText: "확인",
        });
      } finally {
        store.state.loading = false;
      }
    }
  });
};
const changetableProperty = (e) => {
  clickedtableCode.value;
  clickScreenButton.value;

  const findtableindex = filteredtableList.value.findIndex(
    (item) => item.id == clickedtableCode.value
  );
  if (findtableindex !== -1) {
    filteredtableList.value[findtableindex].strName = clickedtableNm.value;
    filteredtableList.value[findtableindex].lngCount = clickedtableSeats.value;
  }

  const tableItem = tableList.value.find(
    (item2) =>
      item2.intScreenNo == clickScreenButton.value &&
      item2.lngKeyscrNo == clickedtableCode.value
  );
  if (tableItem) {
    tableItem.lngCount = clickedtableSeats.value;
    tableItem.strName = clickedtableNm.value;
  }

  //comsole.log(filteredtableList.value);
  //comsole.log(tableList.value);

  grid.getGridItems().forEach((item) => {
    if (item.gridstackNode.id == clickedtableCode.value) {
      //comsole.log(item.gridstackNode.id);
      const gridItem = item.gridstackNode.el;
      //comsole.log(gridItem);
      const nameLabel = gridItem.querySelector(".mst002s-table-name");
      if (nameLabel) {
        nameLabel.innerText = clickedtableNm.value;
      }
      const codeLabel = gridItem.querySelector(".mst002s-table-code");
      if (codeLabel) {
        codeLabel.innerText = mst002DisplayTableCode(clickedtableCode.value);
      }
    }
  });
};
/**
 * 페이지 초기화
 */

const initAllTable = () => {
  Swal.fire({
    title: "테이블 초기화",
    text: "테이블을 초기화하시겠습니까?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "확인",
    cancelButtonText: "취소",
  }).then((result) => {
    if (result.isConfirmed) {
      if (grid != null) {
        grid.removeAll();
      }
      tableList.value = tableList.value.filter(
        (item) => item.intScreenNo !== clickScreenButton.value
      );
    }
  });
};

/**
 * 복사 팝업 - 복사 함수
 */
const copyButton = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "복사",
      text: "조회를 먼저 해주세요.",
      confirmButtonText: "확인",
    });
    return;
  }
  showPopup2.value = true;
};
let savedGrid = null;
/**
 * 재활성화시 기존 정보 재로딩
 */

onActivated(() => {
  if (savedGrid != null) {
    const el =
      document.querySelector(".mst002s-workspace .grid-stack") ||
      document.querySelector(".grid-stack");
    grid = GridStack.init(
      {
        float: true,
        cellHeight: "auto",
        column: 90,
        margin: 0,
        alwaysShowResizeHandle: false,
        resizable: { handles: "e,se", autoHide: true },
        minRow: 56,
        maxRow: 56,
      },
      el
    );
    grid.load(savedGrid);
    grid.on("dragstop", (event, element) => handleDragStop(grid, element));
    grid.on("resizestop", (event, element) => handleResizeStop(grid, element));
  }
});
/**
 * 컴포넌트 비활성화시
 */
onDeactivated(() => {
  //comsole.log(grid);
  if (grid) {
    savedGrid = grid.save();
    grid.destroy(false);
  }
});
</script>
<style>
.grid-stack {
  background: #ffffff;
}

.grid-stack-item {
  position: relative;
  background-color: rgba(0, 0, 0, 0);
  /* 아이템 배경색 */
  width: 100%;
  height: 100%;
  /* 리사이즈 핸들이 모서리에서 잘리지 않도록 */
  overflow: visible !important;
  /* 이동 가능 영역 — 커서 오버 시 십자(이동) 화살표 */
  cursor: move;
}

.grid-stack-item-content {
  width: 100% !important;
  height: 100% !important;
  position: absolute !important;
  top: 0 !important;
  /* 상단에서 0px 위치로 설정 */
  left: 0 !important;
  /* 좌측에서 0px 위치로 설정 */
  right: 0 !important;
  bottom: 0 !important;
  z-index: 50 !important;
  overflow: hidden !important;
  text-align: left;
  cursor: move;
}

/* 테이블 명 — 좌상단, 크게·눈에 띄게 */
.mst002s-table-name {
  position: absolute;
  left: 3px;
  top: 2px;
  z-index: 81;
  max-width: calc(100% - 6px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 18px;
  font-weight: 800;
  line-height: 1.25;
  pointer-events: none;
  color: #0f172a;
  text-shadow: 0 0 2px #fff, 0 1px 2px rgb(255 255 255 / 90%);
}

/* 테이블 코드(lngKeyscrNo) — 중앙, 사각 배지(은은한 음영) */
.mst002s-table-code {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 81;
  box-sizing: border-box;
  min-width: 1.5rem;
  min-height: 1.25rem;
  max-width: 85%;
  padding: 0.15rem 0.4rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  pointer-events: none;
  color: #1e3a8a;
  background: rgb(255 255 255 / 82%);
  border: 1px solid rgb(30 58 138 / 22%);
  border-radius: 3px;
  box-shadow: 0 1px 2px rgb(15 23 42 / 12%);
}
.mst002s-table-code:empty {
  display: none;
}

/*
 * 리사이즈 화살표:
 * - 평소 숨김
 * - 테이블(아이템) 마우스 오버 시에만 표시
 * - 이동 영역 커서는 move, 핸들 위에서는 se/e-resize
 */
.grid-stack-item > .ui-resizable-handle {
  z-index: 200 !important;
  display: none;
}
.grid-stack-item:hover > .ui-resizable-handle,
.grid-stack-item.ui-resizable-autohide:hover > .ui-resizable-handle {
  display: block !important;
}
.grid-stack-item.ui-draggable-dragging > .ui-resizable-handle,
.grid-stack-item.ui-resizable-resizing > .ui-resizable-handle {
  display: none !important;
}
.grid-stack-item > .ui-resizable-se {
  right: 0 !important;
  bottom: 0 !important;
  width: 20px !important;
  height: 20px !important;
  cursor: se-resize !important;
}
.grid-stack-item > .ui-resizable-e {
  right: 0 !important;
  width: 10px !important;
  top: 15px !important;
  bottom: 15px !important;
  cursor: e-resize !important;
}

.table_style {
  width: 900px;
  height: 622px !important;
  border: 1px solid #e4e4e4;
  border-radius: 1px;
  background-image: url("../../assets/tablegrid-bg.jpg");
  background-size: 106%;
  margin-right: 30px;
  background-repeat: no-repeat;
}

.diamond {
  position: absolute;
  z-index: 0;
  width: 100%;
  height: 100%;
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
}

.rectangle {
  width: 100%;
  height: 100%;
}

.circle {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.ellipse {
  border-radius: 30% / 60%;
}

.triangle {
  position: absolute;
  z-index: 0;
  width: 100%;
  height: 100%;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  /* 삼각형 */
}

/* 위치 정의 (gs-x) */
.gs-90 > .grid-stack-item[gs-x="1"] {
  left: 1.11%;
}

.gs-90 > .grid-stack-item[gs-x="2"] {
  left: 2.22%;
}

.gs-90 > .grid-stack-item[gs-x="3"] {
  left: 3.33%;
}

.gs-90 > .grid-stack-item[gs-x="4"] {
  left: 4.44%;
}

.gs-90 > .grid-stack-item[gs-x="5"] {
  left: 5.56%;
}

.gs-90 > .grid-stack-item[gs-x="6"] {
  left: 6.67%;
}

.gs-90 > .grid-stack-item[gs-x="7"] {
  left: 7.78%;
}

.gs-90 > .grid-stack-item[gs-x="8"] {
  left: 8.89%;
}

.gs-90 > .grid-stack-item[gs-x="9"] {
  left: 10%;
}

.gs-90 > .grid-stack-item[gs-x="10"] {
  left: 11.11%;
}

.gs-90 > .grid-stack-item[gs-x="11"] {
  left: 12.22%;
}

.gs-90 > .grid-stack-item[gs-x="12"] {
  left: 13.33%;
}

.gs-90 > .grid-stack-item[gs-x="13"] {
  left: 14.44%;
}

.gs-90 > .grid-stack-item[gs-x="14"] {
  left: 15.56%;
}

.gs-90 > .grid-stack-item[gs-x="15"] {
  left: 16.67%;
}

.gs-90 > .grid-stack-item[gs-x="16"] {
  left: 17.78%;
}

.gs-90 > .grid-stack-item[gs-x="17"] {
  left: 18.89%;
}

.gs-90 > .grid-stack-item[gs-x="18"] {
  left: 20%;
}

.gs-90 > .grid-stack-item[gs-x="19"] {
  left: 21.11%;
}

.gs-90 > .grid-stack-item[gs-x="20"] {
  left: 22.22%;
}

.gs-90 > .grid-stack-item[gs-x="21"] {
  left: 23.33%;
}

.gs-90 > .grid-stack-item[gs-x="22"] {
  left: 24.44%;
}

.gs-90 > .grid-stack-item[gs-x="23"] {
  left: 25.56%;
}

.gs-90 > .grid-stack-item[gs-x="24"] {
  left: 26.67%;
}

.gs-90 > .grid-stack-item[gs-x="25"] {
  left: 27.78%;
}

.gs-90 > .grid-stack-item[gs-x="26"] {
  left: 28.89%;
}

.gs-90 > .grid-stack-item[gs-x="27"] {
  left: 30%;
}

.gs-90 > .grid-stack-item[gs-x="28"] {
  left: 31.11%;
}

.gs-90 > .grid-stack-item[gs-x="29"] {
  left: 32.22%;
}

.gs-90 > .grid-stack-item[gs-x="30"] {
  left: 33.33%;
}

.gs-90 > .grid-stack-item[gs-x="31"] {
  left: 34.44%;
}

.gs-90 > .grid-stack-item[gs-x="32"] {
  left: 35.56%;
}

.gs-90 > .grid-stack-item[gs-x="33"] {
  left: 36.67%;
}

.gs-90 > .grid-stack-item[gs-x="34"] {
  left: 37.78%;
}

.gs-90 > .grid-stack-item[gs-x="35"] {
  left: 38.89%;
}

.gs-90 > .grid-stack-item[gs-x="36"] {
  left: 40%;
}

.gs-90 > .grid-stack-item[gs-x="37"] {
  left: 41.11%;
}

.gs-90 > .grid-stack-item[gs-x="38"] {
  left: 42.22%;
}

.gs-90 > .grid-stack-item[gs-x="39"] {
  left: 43.33%;
}

.gs-90 > .grid-stack-item[gs-x="40"] {
  left: 44.44%;
}

.gs-90 > .grid-stack-item[gs-x="41"] {
  left: 45.56%;
}

.gs-90 > .grid-stack-item[gs-x="42"] {
  left: 46.67%;
}

.gs-90 > .grid-stack-item[gs-x="43"] {
  left: 47.78%;
}

.gs-90 > .grid-stack-item[gs-x="44"] {
  left: 48.89%;
}

.gs-90 > .grid-stack-item[gs-x="45"] {
  left: 50%;
}

.gs-90 > .grid-stack-item[gs-x="46"] {
  left: 51.11%;
}

.gs-90 > .grid-stack-item[gs-x="47"] {
  left: 52.22%;
}

.gs-90 > .grid-stack-item[gs-x="48"] {
  left: 53.33%;
}

.gs-90 > .grid-stack-item[gs-x="49"] {
  left: 54.44%;
}

.gs-90 > .grid-stack-item[gs-x="50"] {
  left: 55.56%;
}

.gs-90 > .grid-stack-item[gs-x="51"] {
  left: 56.67%;
}

.gs-90 > .grid-stack-item[gs-x="52"] {
  left: 57.78%;
}

.gs-90 > .grid-stack-item[gs-x="53"] {
  left: 58.89%;
}

.gs-90 > .grid-stack-item[gs-x="54"] {
  left: 60%;
}

.gs-90 > .grid-stack-item[gs-x="55"] {
  left: 61.11%;
}

.gs-90 > .grid-stack-item[gs-x="56"] {
  left: 62.22%;
}

.gs-90 > .grid-stack-item[gs-x="57"] {
  left: 63.33%;
}

.gs-90 > .grid-stack-item[gs-x="58"] {
  left: 64.44%;
}

.gs-90 > .grid-stack-item[gs-x="59"] {
  left: 65.56%;
}

.gs-90 > .grid-stack-item[gs-x="60"] {
  left: 66.67%;
}

.gs-90 > .grid-stack-item[gs-x="61"] {
  left: 67.78%;
}

.gs-90 > .grid-stack-item[gs-x="62"] {
  left: 68.89%;
}

.gs-90 > .grid-stack-item[gs-x="63"] {
  left: 70%;
}

.gs-90 > .grid-stack-item[gs-x="64"] {
  left: 71.11%;
}

.gs-90 > .grid-stack-item[gs-x="65"] {
  left: 72.22%;
}

.gs-90 > .grid-stack-item[gs-x="66"] {
  left: 73.33%;
}

.gs-90 > .grid-stack-item[gs-x="67"] {
  left: 74.44%;
}

.gs-90 > .grid-stack-item[gs-x="68"] {
  left: 75.56%;
}

.gs-90 > .grid-stack-item[gs-x="69"] {
  left: 76.67%;
}

.gs-90 > .grid-stack-item[gs-x="70"] {
  left: 77.78%;
}

.gs-90 > .grid-stack-item[gs-x="71"] {
  left: 78.89%;
}

.gs-90 > .grid-stack-item[gs-x="72"] {
  left: 80%;
}

.gs-90 > .grid-stack-item[gs-x="73"] {
  left: 81.11%;
}

.gs-90 > .grid-stack-item[gs-x="74"] {
  left: 82.22%;
}

.gs-90 > .grid-stack-item[gs-x="75"] {
  left: 83.33%;
}

.gs-90 > .grid-stack-item[gs-x="76"] {
  left: 84.44%;
}

.gs-90 > .grid-stack-item[gs-x="77"] {
  left: 85.56%;
}

.gs-90 > .grid-stack-item[gs-x="78"] {
  left: 86.67%;
}

.gs-90 > .grid-stack-item[gs-x="79"] {
  left: 87.78%;
}

.gs-90 > .grid-stack-item[gs-x="80"] {
  left: 88.89%;
}

.gs-90 > .grid-stack-item[gs-x="81"] {
  left: 90%;
}

.gs-90 > .grid-stack-item[gs-x="82"] {
  left: 91.11%;
}

.gs-90 > .grid-stack-item[gs-x="83"] {
  left: 92.22%;
}

.gs-90 > .grid-stack-item[gs-x="84"] {
  left: 93.33%;
}

.gs-90 > .grid-stack-item[gs-x="85"] {
  left: 94.44%;
}

.gs-90 > .grid-stack-item[gs-x="86"] {
  left: 95.56%;
}

.gs-90 > .grid-stack-item[gs-x="87"] {
  left: 96.67%;
}

.gs-90 > .grid-stack-item[gs-x="88"] {
  left: 97.78%;
}

.gs-90 > .grid-stack-item[gs-x="89"] {
  left: 98.89%;
}

.gs-90 > .grid-stack-item[gs-x="90"] {
  left: 100%;
}

/* 너비 정의 (gs-w) */
.gs-90 > .grid-stack-item[gs-w="1"] {
  width: 1.11%;
}

.gs-90 > .grid-stack-item[gs-w="2"] {
  width: 2.22%;
}

.gs-90 > .grid-stack-item[gs-w="3"] {
  width: 3.33%;
}

.gs-90 > .grid-stack-item[gs-w="4"] {
  width: 4.44%;
}

.gs-90 > .grid-stack-item[gs-w="5"] {
  width: 5.56%;
}

.gs-90 > .grid-stack-item[gs-w="6"] {
  width: 6.67%;
}

.gs-90 > .grid-stack-item[gs-w="7"] {
  width: 7.78%;
}

.gs-90 > .grid-stack-item[gs-w="8"] {
  width: 8.89%;
}

.gs-90 > .grid-stack-item[gs-w="9"] {
  width: 10%;
}

.gs-90 > .grid-stack-item[gs-w="10"] {
  width: 11.11%;
}

.gs-90 > .grid-stack-item[gs-w="11"] {
  width: 12.22%;
}

.gs-90 > .grid-stack-item[gs-w="12"] {
  width: 13.33%;
}

.gs-90 > .grid-stack-item[gs-w="13"] {
  width: 14.44%;
}

.gs-90 > .grid-stack-item[gs-w="14"] {
  width: 15.56%;
}

.gs-90 > .grid-stack-item[gs-w="15"] {
  width: 16.67%;
}

.gs-90 > .grid-stack-item[gs-w="16"] {
  width: 17.78%;
}

.gs-90 > .grid-stack-item[gs-w="17"] {
  width: 18.89%;
}

.gs-90 > .grid-stack-item[gs-w="18"] {
  width: 20%;
}

.gs-90 > .grid-stack-item[gs-w="19"] {
  width: 21.11%;
}

.gs-90 > .grid-stack-item[gs-w="20"] {
  width: 22.22%;
}

.gs-90 > .grid-stack-item[gs-w="21"] {
  width: 23.33%;
}

.gs-90 > .grid-stack-item[gs-w="22"] {
  width: 24.44%;
}

.gs-90 > .grid-stack-item[gs-w="23"] {
  width: 25.56%;
}

.gs-90 > .grid-stack-item[gs-w="24"] {
  width: 26.67%;
}

.gs-90 > .grid-stack-item[gs-w="25"] {
  width: 27.78%;
}

.gs-90 > .grid-stack-item[gs-w="26"] {
  width: 28.89%;
}

.gs-90 > .grid-stack-item[gs-w="27"] {
  width: 30%;
}

.gs-90 > .grid-stack-item[gs-w="28"] {
  width: 31.11%;
}

.gs-90 > .grid-stack-item[gs-w="29"] {
  width: 32.22%;
}

.gs-90 > .grid-stack-item[gs-w="30"] {
  width: 33.33%;
}

.gs-90 > .grid-stack-item[gs-w="31"] {
  width: 34.44%;
}

.gs-90 > .grid-stack-item[gs-w="32"] {
  width: 35.56%;
}

.gs-90 > .grid-stack-item[gs-w="33"] {
  width: 36.67%;
}

.gs-90 > .grid-stack-item[gs-w="34"] {
  width: 37.78%;
}

.gs-90 > .grid-stack-item[gs-w="35"] {
  width: 38.89%;
}

.gs-90 > .grid-stack-item[gs-w="36"] {
  width: 40%;
}

.gs-90 > .grid-stack-item[gs-w="37"] {
  width: 41.11%;
}

.gs-90 > .grid-stack-item[gs-w="38"] {
  width: 42.22%;
}

.gs-90 > .grid-stack-item[gs-w="39"] {
  width: 43.33%;
}

.gs-90 > .grid-stack-item[gs-w="40"] {
  width: 44.44%;
}

.gs-90 > .grid-stack-item[gs-w="41"] {
  width: 45.56%;
}

.gs-90 > .grid-stack-item[gs-w="42"] {
  width: 46.67%;
}

.gs-90 > .grid-stack-item[gs-w="43"] {
  width: 47.78%;
}

.gs-90 > .grid-stack-item[gs-w="44"] {
  width: 48.89%;
}

.gs-90 > .grid-stack-item[gs-w="45"] {
  width: 50%;
}

.gs-90 > .grid-stack-item[gs-w="46"] {
  width: 51.11%;
}

.gs-90 > .grid-stack-item[gs-w="47"] {
  width: 52.22%;
}

.gs-90 > .grid-stack-item[gs-w="48"] {
  width: 53.33%;
}

.gs-90 > .grid-stack-item[gs-w="49"] {
  width: 54.44%;
}

.gs-90 > .grid-stack-item[gs-w="50"] {
  width: 55.56%;
}

.gs-90 > .grid-stack-item[gs-w="51"] {
  width: 56.67%;
}

.gs-90 > .grid-stack-item[gs-w="52"] {
  width: 57.78%;
}

.gs-90 > .grid-stack-item[gs-w="53"] {
  width: 58.89%;
}

.gs-90 > .grid-stack-item[gs-w="54"] {
  width: 60%;
}

.gs-90 > .grid-stack-item[gs-w="55"] {
  width: 61.11%;
}

.gs-90 > .grid-stack-item[gs-w="56"] {
  width: 62.22%;
}

.gs-90 > .grid-stack-item[gs-w="57"] {
  width: 63.33%;
}

.gs-90 > .grid-stack-item[gs-w="58"] {
  width: 64.44%;
}

.gs-90 > .grid-stack-item[gs-w="59"] {
  width: 65.56%;
}

.gs-90 > .grid-stack-item[gs-w="60"] {
  width: 66.67%;
}

.gs-90 > .grid-stack-item[gs-w="61"] {
  width: 67.78%;
}

.gs-90 > .grid-stack-item[gs-w="62"] {
  width: 68.89%;
}

.gs-90 > .grid-stack-item[gs-w="63"] {
  width: 70%;
}

.gs-90 > .grid-stack-item[gs-w="64"] {
  width: 71.11%;
}

.gs-90 > .grid-stack-item[gs-w="65"] {
  width: 72.22%;
}

.gs-90 > .grid-stack-item[gs-w="66"] {
  width: 73.33%;
}

.gs-90 > .grid-stack-item[gs-w="67"] {
  width: 74.44%;
}

.gs-90 > .grid-stack-item[gs-w="68"] {
  width: 75.56%;
}

.gs-90 > .grid-stack-item[gs-w="69"] {
  width: 76.67%;
}

.gs-90 > .grid-stack-item[gs-w="70"] {
  width: 77.78%;
}

.gs-90 > .grid-stack-item[gs-w="71"] {
  width: 78.89%;
}

.gs-90 > .grid-stack-item[gs-w="72"] {
  width: 80%;
}

.gs-90 > .grid-stack-item[gs-w="73"] {
  width: 81.11%;
}

.gs-90 > .grid-stack-item[gs-w="74"] {
  width: 82.22%;
}

.gs-90 > .grid-stack-item[gs-w="75"] {
  width: 83.33%;
}

.gs-90 > .grid-stack-item[gs-w="76"] {
  width: 84.44%;
}

.gs-90 > .grid-stack-item[gs-w="77"] {
  width: 85.56%;
}

.gs-90 > .grid-stack-item[gs-w="78"] {
  width: 86.67%;
}

.gs-90 > .grid-stack-item[gs-w="79"] {
  width: 87.78%;
}

.gs-90 > .grid-stack-item[gs-w="80"] {
  width: 88.89%;
}

.gs-90 > .grid-stack-item[gs-w="81"] {
  width: 90%;
}

.gs-90 > .grid-stack-item[gs-w="82"] {
  width: 91.11%;
}

.gs-90 > .grid-stack-item[gs-w="83"] {
  width: 92.22%;
}

.gs-90 > .grid-stack-item[gs-w="84"] {
  width: 93.94%;
}

.gs-90 > .grid-stack-item[gs-w="85"] {
  width: 94.44%;
}

.gs-90 > .grid-stack-item[gs-w="86"] {
  width: 95.56%;
}

.gs-90 > .grid-stack-item[gs-w="87"] {
  width: 96.67%;
}

.gs-90 > .grid-stack-item[gs-w="88"] {
  width: 97.78%;
}

.gs-90 > .grid-stack-item[gs-w="89"] {
  width: 98.89%;
}

.gs-90 > .grid-stack-item[gs-w="90"] {
  width: 100%;
}
</style>

<style scoped>
/* 페이지 — 세로 스크롤 없음(잘림 허용). 모눈 크기 자체는 변경하지 않음 */
.mst002s-page {
  position: relative;
  z-index: 1;
  min-height: 0;
  overflow: hidden;
}

/* 조회 AREA — 확정본 유지 (노트북 수정 시 건드리지 않음) */
.mst002s-search-panel {
  --mst002s-panel-pad-x: 2rem;
  --mst002s-col-gap: 1.5rem;
  --mst002s-item-gap: 0.75rem;
  --mst002s-label-col: 6.5rem;
  --mst002s-row-min-h: 2rem;
  --mst002s-control-h: 2rem;
  --mst002s-control-border: #cbd5e1;
  --mst002s-control-focus-border: #3b82f6;
  --mst002s-control-radius: 0.375rem;
  box-sizing: border-box;
  padding-left: 0;
  padding-right: 0;
  padding-block: 0.75rem;
}

.mst002s-search-grid {
  display: grid;
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  align-items: center;
  grid-template-columns: minmax(0, 1fr);
  max-width: 72rem;
  column-gap: var(--mst002s-col-gap);
  padding-left: var(--mst002s-panel-pad-x);
  padding-right: var(--mst002s-panel-pad-x);
}

.mst002s-cell {
  display: flex;
  min-width: 0;
  min-height: var(--mst002s-row-min-h);
  align-items: center;
  gap: var(--mst002s-item-gap);
}

.mst002s-sg-label {
  flex: 0 0 var(--mst002s-label-col);
  width: var(--mst002s-label-col);
  min-height: var(--mst002s-row-min-h);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
  color: rgb(17 24 39);
}

.mst002s-cell-field {
  min-width: 0;
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  width: 100%;
}

.mst002s-pick-slot :deep(> .flex) {
  width: 100%;
  min-width: 0;
  margin-left: 0 !important;
  gap: 0.5rem !important;
  flex-wrap: wrap;
  align-items: center;
}

.mst002s-pick-slot :deep(> .flex > div.shrink-0.font-semibold) {
  display: none !important;
}

/* 그룹 · 매장구분 */
.mst002s-pick-slot :deep(#storeGroup) {
  width: 11.5rem !important;
  min-width: 0 !important;
  max-width: 11.5rem !important;
}

.mst002s-pick-slot :deep(> .flex > div:has(> select:not(#storeGroup)):not(.ml-5) > select) {
  width: 11.5rem !important;
  min-width: 0 !important;
  max-width: 11.5rem !important;
}

/* 매장 v-select */
.mst002s-pick-slot :deep(> .flex > div:has(.pickstore-vs-shell)),
.mst002s-pick-slot :deep(> .flex > div.relative.min-w-0.flex-1) {
  flex: 0 1 15.6rem !important;
  width: 15.6rem !important;
  max-width: 15.6rem !important;
  min-width: 0 !important;
}

/* 포스번호 — 매장명과 간격 + 동일 라벨 폰트 */
.mst002s-pick-slot :deep(> .flex > .ml-5) {
  margin-left: 2.5rem !important;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-height: var(--mst002s-row-min-h);
  min-width: 0;
}

.mst002s-pick-slot :deep(> .flex > .ml-5 > span) {
  flex: 0 0 auto;
  font-size: 1rem !important;
  font-weight: 600 !important;
  line-height: 1.25rem !important;
  color: rgb(17 24 39) !important;
  white-space: nowrap;
}

.mst002s-pick-slot :deep(> .flex > .ml-5 > select) {
  width: 8rem !important;
  min-width: 0 !important;
  max-width: 8rem !important;
  margin-left: 0 !important;
  padding: 0 0.5rem !important;
}

.mst002s-pick-slot :deep(select),
.mst002s-pick-slot :deep(.pickstore-vs-shell) {
  box-sizing: border-box;
  height: var(--mst002s-control-h) !important;
  min-height: var(--mst002s-control-h) !important;
  max-height: var(--mst002s-control-h) !important;
  border: 1px solid var(--mst002s-control-border) !important;
  border-radius: var(--mst002s-control-radius) !important;
  background-color: #fff;
}

.mst002s-pick-slot :deep(.pickstore-vs-shell) {
  width: 100% !important;
  max-width: 100% !important;
}

.mst002s-pick-slot :deep(.pickstore-vs-shell .vs__dropdown-toggle) {
  box-sizing: border-box;
  height: 100% !important;
  min-height: 100% !important;
  padding: 0 0.5rem !important;
  border: none !important;
}

.mst002s-pick-slot :deep(.pickstore-vs-shell .vs__selected),
.mst002s-pick-slot :deep(.pickstore-vs-shell .vs__search) {
  margin: 0 !important;
  line-height: 1.25rem;
  font-size: 0.875rem;
}

.mst002s-pick-slot :deep(select:focus),
.mst002s-pick-slot :deep(.pickstore-vs-shell:focus-within) {
  border-color: var(--mst002s-control-focus-border) !important;
  outline: none;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.25);
}

@media (min-width: 1280px) {
  .mst002s-search-panel {
    --mst002s-panel-pad-x: 2.5rem;
  }
}

@media (min-width: 1536px) {
  .mst002s-search-panel {
    --mst002s-panel-pad-x: 3rem;
  }
}

/* 우측 테이블 속성 — 캔버스 옆. 페이지 스크롤 대신 영역 안에서 맞춤 */
.mst002s-workspace {
  align-items: flex-start;
  flex: 0 0 auto;
  overflow: hidden;
}

/* 모눈(좌석 배치) — 기존 1000×630 고정. 좌표/사이즈 기준이므로 크기 변경 금지 */
.mst002s-workspace .mst002s-canvas.table_style,
.mst002s-workspace .mst002s-canvas.grid-stack {
  box-sizing: border-box;
  width: 1000px !important;
  height: 630px !important;
  min-width: 1000px !important;
  min-height: 630px !important;
  max-width: 1000px !important;
  max-height: 630px !important;
  margin-right: 0 !important;
  overflow: hidden !important;
  flex-shrink: 0 !important;
}

.mst002s-prop-col {
  flex: 0 0 auto;
  box-sizing: border-box;
}

/* 속성 패널만 모눈 높이에 맞춤 — 페이지 스크롤 유발 방지 */
.mst002s-workspace .mst002s-prop-panel {
  max-height: 630px;
  overflow-x: hidden;
  overflow-y: auto;
}

.mst002s-action-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.625rem;
  width: 100%;
  align-items: center;
}

.mst002s-action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  box-sizing: border-box;
  width: 100%;
  height: 2.25rem;
  min-height: 2.25rem;
  max-height: 2.25rem;
  min-width: 0;
  padding: 0 0.5rem;
  font-size: 0.9375rem;
  font-weight: 700;
  line-height: 1;
  white-space: nowrap;
  border: 1px solid #6b7280;
  border-radius: 0.375rem;
  color: #374151;
  background: #fff;
  cursor: pointer;
  box-shadow: 0 1px 2px rgb(15 23 42 / 10%);
}

.mst002s-action-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  box-shadow: none;
}

.mst002s-action-btn--add:hover:not(:disabled) {
  background: #eff6ff;
  border-color: #60a5fa;
  color: #1d4ed8;
}

.mst002s-action-btn--copy:hover:not(:disabled) {
  background: #eff6ff;
  border-color: #60a5fa;
  color: #1d4ed8;
}

.mst002s-action-btn--del:hover:not(:disabled) {
  background: #fef2f2;
  border-color: #ef4444;
  color: #dc2626;
}

.mst002s-prop-panel {
  --mst002s-label-col: 6.75rem;
  --mst002s-control-border: #cbd5e1;
  --mst002s-control-focus-border: #3b82f6;
  --mst002s-control-h: 2rem;
  --mst002s-control-radius: 0.375rem;
  --mst002s-detail-font: 0.9375rem;
  --mst002s-detail-row-h: 2.25rem;
  --mst002s-detail-cell-py: 0.3rem;
}

.mst002s-section-head {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.75rem;
  min-height: 1.75rem;
  margin-bottom: 0.25rem;
}

.mst002s-section-title {
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.4rem;
  color: #111827;
}

.mst002s-form-grid {
  display: grid;
  margin: 0;
  min-inline-size: 0;
  padding: 0;
  grid-template-columns:
    var(--mst002s-label-col) minmax(0, 1fr)
    var(--mst002s-label-col) minmax(0, 1fr);
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  overflow: hidden;
  background: #fff;
}

.mst002s-form-grid--locked {
  pointer-events: none;
  opacity: 0.72;
}

.mst002s-form-grid--locked .mst002s-control,
.mst002s-form-grid:disabled .mst002s-control {
  background: #f3f4f6;
  color: #6b7280;
  cursor: not-allowed;
}

.mst002s-form-grid > * {
  box-sizing: border-box;
  min-height: var(--mst002s-detail-row-h);
  align-self: stretch;
}

.mst002s-form-label {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--mst002s-detail-cell-py) 0.375rem;
  border: 1px solid #e5e7eb;
  background: #edf2f7;
  color: #5c5c5c;
  font-size: var(--mst002s-detail-font);
  font-weight: 600;
  text-align: center;
  word-break: keep-all;
}

.mst002s-form-value {
  display: flex;
  align-items: center;
  min-width: 0;
  padding: var(--mst002s-detail-cell-py) 0.375rem;
  border: 1px solid #e5e7eb;
  background: #fff;
}

.mst002s-form-label--tall {
  min-height: 5.5rem;
}

.mst002s-form-value--shape {
  min-height: 5.5rem;
  padding: 0.625rem 0.75rem;
}

.mst002s-form-value--palette {
  min-height: 9rem;
  align-items: center;
  padding: 0.875rem 0.875rem;
}

.mst002s-field-span3 {
  grid-column: span 3;
  min-width: 0;
}

.mst002s-control {
  box-sizing: border-box;
  height: var(--mst002s-control-h);
  min-height: var(--mst002s-control-h);
  max-height: var(--mst002s-control-h);
  width: 100%;
  max-width: 100%;
  min-width: 0;
  border-radius: var(--mst002s-control-radius);
  border: 1px solid var(--mst002s-control-border);
  background: #fff;
  padding: 0 0.5rem;
  font-size: var(--mst002s-detail-font);
  line-height: 1;
}

.mst002s-control--wide {
  width: 100%;
  max-width: 100%;
}

.mst002s-control:focus {
  border-color: var(--mst002s-control-focus-border);
  outline: none;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.2);
}

.mst002s-shape-row {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  width: 100%;
  gap: 0.75rem;
  align-items: stretch;
}

.mst002s-shape-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  height: 4.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background: #fff;
  cursor: pointer;
}

.mst002s-shape-btn img {
  max-height: 3.25rem;
  width: auto;
}

.mst002s-shape-btn--on {
  background: #dbeafe;
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px #3b82f6;
}

.mst002s-color-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 0.625rem;
  width: 100%;
}

.mst002s-color-btn {
  box-sizing: border-box;
  width: 100%;
  aspect-ratio: 1;
  min-height: 3.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  cursor: pointer;
}

.mst002s-color-btn--on {
  border: 2px solid #111827;
  box-shadow: 0 0 0 1px #fff inset;
}
</style>
