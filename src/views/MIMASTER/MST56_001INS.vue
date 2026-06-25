<!-- /*--############################################################################
# Filename : MST56_001INS.vue                                                  
# Description : 마스터관리 > 품절관리 > 품절정보등록.             #
#Date :2025-07-21                                                              #
#Author : 권맑음                     
################################################################################*/ -->
<template>
  <div class="flex h-full min-h-0 flex-col">
    <div class="flex shrink-0 justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
    </div>

    <div class="mst56-body mt-6 flex min-h-0 flex-1 flex-col">
    <div
      v-if="sortTypeReady"
      class="mst56-main-grid grid min-h-0 flex-1 gap-3 grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
      <!-- 좌: 코너 선택( Vue 클릭 ) + 영업정보 Realgrid( sortType 0 편집 ) -->
      <div class="mst56-panel">
        <div class="mst56-panel-head shrink-0">
          <span class="mst56-panel-title">◎ 코너 영업정보 설정</span>
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="button mst56-toolbar-btn mst56-toolbar-btn--refresh"
              @click="sortType == 2 ? searchButton4() : searchButton()">
              새로고침
            </button>
            <button
              type="button"
              class="button mst56-toolbar-btn mst56-toolbar-btn--save"
              :disabled="sortType != 0"
              @click="saveButton">
              저장
            </button>
          </div>
        </div>
        <div class="mst56-panel-body min-h-0 flex-1">
          <!-- sortType 0: 영업정보 Realgrid (편집) -->
          <div
            v-if="sortType === 0"
            class="mst56-left-split flex min-h-0 flex-1">
            <div class="mst56-left-grid-host min-h-0 min-w-0 flex-1">
              <Realgrid
                :progname="'MST56_001INS_VUE'"
                :grid-row-height="mst56GridRowHeight"
                :grid-header-height="mst56GridHeaderHeight"
                :grid-font-size="mst56GridFontSize"
                :grid-body-line-alignment="mst56GridBodyLineAlignment"
                :skip-clear-current-after-set-rows="true"
                :emit-clicked-row-on-row-change="true"
                :selectionStyle="'single'"
                :progid="1"
                :rowData="rowData"
                :reload="reload"
                :cell-font-color-by-value="mst56LeftCellFontColorRules"
                @realgridname="onMst56LeftGridName"
                @gridReady="onMst56LeftGridReady"
                @clickedRowData="onLeftGridCornerSelect"
                @updatedRowData="updatedRowData"
                @allStateRows="allStateRows3"
                :mergeColumns2="true"
                :mergeColumnGroupSubList2="[
                  ['lngOpenHour', 'lngOpenMin'],
                  ['lngCloseHour', 'lngCloseMin'],
                ]"
                :mergeColumnGroupName2="['영업시작 시간', '영업종료 시간']"
                :labelingColumns="'lngStkType,lngOpenHour,lngOpenMin,lngCloseHour,lngCloseMin'"
                :valuesData="[
                  ['1', '2', '3'],
                  [
                    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
                    '10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
                    '20', '21', '22', '23',
                  ],
                  ['0', '10', '20', '30', '40', '50'],
                  [
                    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
                    '10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
                    '20', '21', '22', '23',
                  ],
                  ['0', '10', '20', '30', '40', '50'],
                ]"
                :labelsData="[
                  ['영업중', '영업 준비중', '영업시간 선택'],
                  [
                    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
                    '10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
                    '20', '21', '22', '23',
                  ],
                  ['0', '10', '20', '30', '40', '50'],
                  [
                    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
                    '10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
                    '20', '21', '22', '23',
                  ],
                  ['0', '10', '20', '30', '40', '50'],
                ]"
                :hideColumnsId="hideColumnsId"
                :rowStateeditable="false"
                :editableColId="'lngStkType,lngOpenHour,lngOpenMin,lngCloseHour,lngCloseMin'"
                :exporttoExcel="exportExcel">
              </Realgrid>
            </div>
          </div>
          <!-- sortType 1: progid=1 (타입0 동일) — 코너명 컬럼만 표시 -->
          <div
            v-else-if="sortType === 1"
            class="mst56-left-split flex min-h-0 flex-1">
            <div class="mst56-left-grid-host min-h-0 min-w-0 flex-1">
              <Realgrid
                :key="'mst56-left-type1'"
                :progname="'MST56_001INS_VUE'"
                :grid-row-height="mst56GridRowHeight"
                :grid-header-height="mst56GridHeaderHeight"
                :grid-font-size="mst56GridFontSize"
                :grid-body-line-alignment="mst56GridBodyLineAlignment"
                :preserve-column-layout-on-refresh="true"
                :force-column-layout="MST56_TYPE1_COLUMN_LAYOUT"
                :skip-clear-current-after-set-rows="true"
                :emit-clicked-row-on-row-change="true"
                :selectionStyle="'single'"
                :progid="1"
                :rowData="rowData"
                :reload="reload"
                :hideColumnsId="MST56_TYPE1_HIDE_COLUMNS"
                :rowStateeditable="false"
                :exporttoExcel="exportExcel"
                @realgridname="onMst56LeftGridName"
                @gridReady="onMst56LeftGridReady"
                @clickedRowData="onLeftGridCornerSelect">
              </Realgrid>
            </div>
          </div>
          <!-- sortType 2: 좌측 Realgrid (rowData4 — 서브그룹 코드/명) -->
          <div
            v-else-if="sortType === 2"
            class="mst56-left-split flex min-h-0 flex-1">
            <div class="mst56-left-grid-host min-h-0 min-w-0 flex-1">
              <Realgrid
                :progname="'MST56_001INS_VUE'"
                :grid-row-height="mst56GridRowHeight"
                :grid-header-height="mst56GridHeaderHeight"
                :grid-font-size="mst56GridFontSize"
                :grid-body-line-alignment="mst56GridBodyLineAlignment"
                :skip-clear-current-after-set-rows="true"
                :emit-clicked-row-on-row-change="true"
                :selectionStyle="'single'"
                :progid="4"
                :rowData="rowData4"
                :reload="reload"
                :rowStateeditable="false"
                :exporttoExcel="exportExcel"
                @realgridname="onMst56LeftGridName"
                @gridReady="onMst56LeftGridReady">
              </Realgrid>
            </div>
          </div>
        </div>
      </div>

      <!-- 우: 메뉴 품절처리 -->
      <div class="mst56-panel">
        <div class="mst56-panel-head shrink-0">
          <span class="mst56-panel-title">◎ 메뉴 품절처리</span>
          <div class="flex items-center gap-2">
            <button
              v-if="sortType != 2"
              type="button"
              class="button mst56-toolbar-btn mst56-toolbar-btn--search"
              @click="searchButton2">
              조회
            </button>
            <button
              v-if="sortType == 2"
              type="button"
              class="button mst56-toolbar-btn mst56-toolbar-btn--search"
              @click="searchButton5">
              조회
            </button>
            <button
              v-if="sortType != 2"
              type="button"
              class="button mst56-toolbar-btn mst56-toolbar-btn--save"
              @click="saveButton2">
              저장
            </button>
            <button
              v-if="sortType == 2"
              type="button"
              class="button mst56-toolbar-btn mst56-toolbar-btn--save"
              @click="saveButton4">
              저장
            </button>
          </div>
        </div>

        <div class="mst56-panel-body min-h-0 flex-1 flex flex-col">
        <div
          class="mst56-search-panel shrink-0 w-full min-w-0 rounded-lg bg-gray-200 px-6 py-3 md:px-8"
          :style="{
            '--mst56-control-border': mst56ControlBorder,
            '--mst56-item-gap': mst56ItemGap,
            '--mst56-label-col': mst56LabelCol,
          }">
          <div class="mst56-search-grid min-w-0">
            <div class="mst56-cell">
              <div class="mst56-sg-label">메뉴명</div>
              <div class="mst56-cell-field min-w-0">
                <input
                  id="mst56-menu-name"
                  v-model="cond"
                  type="text"
                  class="mst56-sg-input h-8 w-full min-w-0 rounded-md border border-solid bg-white px-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  @keyup.enter="onMenuSalesStatusChange" />
              </div>
            </div>
            <div class="mst56-cell">
              <div class="mst56-sg-label">판매상태</div>
              <div class="mst56-cell-field mst56-status-cap min-w-0">
                <select
                  id="mst56-sales-status"
                  v-model="cond2"
                  class="mst56-sg-select h-8 w-full min-w-0 rounded-md border border-solid bg-white px-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  @change="onMenuSalesStatusChange">
                  <option value="9">전체</option>
                  <option value="0">판매중</option>
                  <option value="1">당일품절</option>
                  <option value="2">계속품절</option>
                </select>
              </div>
            </div>
            <div class="mst56-cell mst56-cell--corner">
              <span class="mst56-corner-name">{{ clickedCornerNm }}</span>
            </div>
          </div>
        </div>

        <div class="mst56-grid-host min-h-0 flex-1 mt-2" v-if="sortType != 2">
          <Realgrid
            :progname="'MST56_001INS_VUE'"
            :grid-row-height="mst56GridRowHeight"
            :grid-header-height="mst56GridHeaderHeight"
            :grid-font-size="mst56GridFontSize"
            :grid-body-line-alignment="mst56GridBodyLineAlignment"
            :selectionStyle="'single'"
            @realgridname="onMst56RightGridName"
            @gridReady="onMst56RightGridReady"
            :progid="2"
            :rowData="rowData2"
            :reload="reload"
            :cell-font-color-by-value="mst56RightCellFontColorRules"
            :editableColId="'lngStkStsType'"
            :labelingColumns="'lngStkStsType'"
            :valuesData="[['0', '1', '2']]"
            @buttonClicked="mst56OnChainButtonClicked"
            @updatedRowData="updatedRowData2"
            @allStateRows="mst56OnRightGridAllStateRows"
            :labelsData="[['판매중', '당일품절', '계속품절']]"
            :searchColId="'strMenuName'"
            :searchColId3="['lngStkStsType']"
            :searchValue="mst56MenuSearchValue"
            :searchWord3="cond"
            :rowStateeditable="false"
            :exporttoExcel="exportExcel">
          </Realgrid>
        </div>

        <div class="mst56-grid-host min-h-0 flex-1 mt-2" v-if="sortType == 2">
          <Realgrid
            :progname="'MST56_001INS_VUE'"
            :grid-row-height="mst56GridRowHeight"
            :grid-header-height="mst56GridHeaderHeight"
            :grid-font-size="mst56GridFontSize"
            :grid-body-line-alignment="mst56GridBodyLineAlignment"
            :selectionStyle="'single'"
            @realgridname="onMst56RightGridName"
            @gridReady="onMst56RightGridReady"
            :progid="5"
            :rowData="rowData5"
            :reload="reload"
            :cell-font-color-by-value="mst56RightCellFontColorRules"
            :editableColId="'lngStkStsType,lngOpenHour,lngOpenMin,lngCloseHour,lngCloseMin'"
            @buttonClicked="mst56OnChainButtonClicked"
            @updatedRowData="updatedRowData5"
            @allStateRows="mst56OnRightGridAllStateRows"
            :mergeColumns2="true"
            :mergeColumnGroupSubList2="[
              ['lngOpenHour', 'lngOpenMin'],
              ['lngCloseHour', 'lngCloseMin'],
            ]"
            :mergeColumnGroupName2="['판매시작 시간', '판매종료 시간']"
            :labelingColumns="'lngStkStsType,lngOpenHour,lngOpenMin,lngCloseHour,lngCloseMin'"
            :valuesData="[
              ['0', '1', '2', '3'],
              [
                '0',
                '1',
                '2',
                '3',
                '4',
                '5',
                '6',
                '7',
                '8',
                '9',
                '10',
                '11',
                '12',
                '13',
                '14',
                '15',
                '16',
                '17',
                '18',
                '19',
                '20',
                '21',
                '22',
                '23',
              ],
              ['0', '10', '20', '30', '40', '50'],
              [
                '0',
                '1',
                '2',
                '3',
                '4',
                '5',
                '6',
                '7',
                '8',
                '9',
                '10',
                '11',
                '12',
                '13',
                '14',
                '15',
                '16',
                '17',
                '18',
                '19',
                '20',
                '21',
                '22',
                '23',
              ],
              ['0', '10', '20', '30', '40', '50'],
            ]"
            :labelsData="[
              ['판매중', '당일품절', '계속품절', '판매시간 선택'],
              [
                '0',
                '1',
                '2',
                '3',
                '4',
                '5',
                '6',
                '7',
                '8',
                '9',
                '10',
                '11',
                '12',
                '13',
                '14',
                '15',
                '16',
                '17',
                '18',
                '19',
                '20',
                '21',
                '22',
                '23',
              ],
              ['0', '10', '20', '30', '40', '50'],
              [
                '0',
                '1',
                '2',
                '3',
                '4',
                '5',
                '6',
                '7',
                '8',
                '9',
                '10',
                '11',
                '12',
                '13',
                '14',
                '15',
                '16',
                '17',
                '18',
                '19',
                '20',
                '21',
                '22',
                '23',
              ],
              ['0', '10', '20', '30', '40', '50'],
            ]"
            :searchColId="'strMenuName'"
            :searchColId3="['lngStkStsType']"
            :searchValue="mst56MenuSearchValue"
            :searchWord3="cond"
            :rowStateeditable="false"
            :exporttoExcel="exportExcel">
          </Realgrid>
        </div>
        </div>
      </div>
    </div>
    <div v-else class="flex flex-1 items-center justify-center text-gray-400 text-sm">
      불러오는 중...
    </div>
    </div>
  </div>

  <Teleport to="body">
    <div
      v-if="visible"
      class="mst56-popup-backdrop fixed inset-0 z-[9999] flex items-center justify-center bg-black/50"
      @click.self.prevent>
      <div
        class="mst56-popup-dialog flex h-[70vh] max-h-[85vh] w-[min(48rem,92vw)] flex-col rounded-xl bg-white p-6 shadow-lg"
        @click.stop>
        <div class="shrink-0 flex items-start justify-between gap-4">
          <h2 class="text-lg font-bold text-gray-900">선택메뉴 품절처리</h2>
          <div class="flex shrink-0 items-center gap-2">
            <button
              type="button"
              class="button mst56-toolbar-btn mst56-toolbar-btn--search"
              @click="searchButton3">
              조회
            </button>
            <button
              type="button"
              class="button mst56-toolbar-btn mst56-toolbar-btn--save"
              @click="saveButton3">
              저장
            </button>
            <button
              type="button"
              class="button mst56-toolbar-btn mst56-toolbar-btn--close"
              @click="closePopUp2">
              닫기
            </button>
          </div>
        </div>

        <div class="mt-3 shrink-0 space-y-1">
          <div class="text-base font-semibold text-gray-800">{{ clickedCornerNm }}</div>
          <div class="text-base font-bold text-red-500">{{ clickedMenuNm }}</div>
        </div>

        <div
          class="mst56-search-panel mst56-search-panel--popup shrink-0 mt-3 rounded-lg bg-gray-200 px-4 py-3"
          :style="{
            '--mst56-control-border': mst56ControlBorder,
            '--mst56-item-gap': mst56ItemGap,
            '--mst56-label-col': mst56LabelCol,
          }">
          <div class="mst56-search-grid min-w-0">
            <div class="mst56-cell">
              <div class="mst56-sg-label">메뉴명</div>
              <div class="mst56-cell-field min-w-0">
                <input
                  id="mst56-popup-menu-name"
                  v-model="pcond"
                  type="text"
                  class="mst56-sg-input h-8 w-full min-w-0 rounded-md border border-solid bg-white px-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  @keyup.enter="searchButton3" />
              </div>
            </div>
            <div class="mst56-cell">
              <div class="mst56-sg-label">판매상태</div>
              <div class="mst56-cell-field mst56-status-cap min-w-0">
                <select
                  v-model="pcond2"
                  class="mst56-sg-select h-8 w-full min-w-0 rounded-md border border-solid bg-white px-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  @change="searchSoldOut2">
                  <option value="9">전체</option>
                  <option value="0">판매중</option>
                  <option value="1">당일품절</option>
                  <option value="2">계속품절</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div class="mst56-popup-grid-host min-h-0 flex-1 mt-3">
          <Realgrid
            v-if="visible && popupGridMount"
            :key="`mst56-popup-grid-${popupGridEpoch}`"
            :progname="'MST56_001INS_POP_VUE'"
            :grid-row-height="mst56GridRowHeight"
            :grid-header-height="mst56GridHeaderHeight"
            :grid-font-size="mst56GridFontSize"
            :grid-body-line-alignment="mst56GridBodyLineAlignment"
            :selectionStyle="'single'"
            :progid="1"
            :setStateBar="false"
            :labelingColumns="'lngStkStsType'"
            :valuesData="[['0', '1', '2']]"
            :labelsData="[['판매중', '당일품절', '계속품절']]"
            :searchColId="'strMenuName'"
            :searchColId3="['lngStkStsType']"
            :searchValue="mst56PopupSearchValue"
            :searchWord3="pcond"
            @realgridname="onMst56PopupGridName"
            @gridReady="onMst56PopupGridReady"
            @updatedRowData="updatedRowData3"
            @allStateRows="allStateRows4"
            :rowStateeditable="false"
            :editableColId="'lngStkStsType'"
            :rowData="rowData3"></Realgrid>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { getCommonList } from "@/api/common";
import {
  getMenuConList,
  getSalesInfoByCorner,
  getSoldMenuList,
  getSoldMenuList3,
  saveCornerInfoList,
  saveCornerInfoList2,
  saveMenuInfo,
} from "@/api/master";
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
import { rgGetInstance } from "@/components/realgridInstanceRegistry.js";
/**
 *  페이지로그 자동 입력
 *  */

import { insertPageLog } from "@/customFunc/customFunc";
import Swal from "sweetalert2";
/*
 * 공통 표준  Function
 */

import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";
/**
 * 	화면 Load시 실행 스크립트
 */
const sortType = ref(0);
const sortTypeReady = ref(false);

const mst56ControlBorder = "#374151";
const mst56ItemGap = "0.375rem";
const mst56LabelCol = "4.25rem";
const mst56GridRowHeight = 40;
const mst56GridHeaderHeight = 52;
const mst56GridFontSize = 16;
const mst56GridBodyLineAlignment = "center";
/** 좌측 영업정보 — 준비중(2) 빨강, 영업시간 선택(3) 파랑 + 시분 빨강 */
const mst56LeftCellFontColorRules = [
  { field: "lngStkType", values: ["2"], color: "#FF0000" },
  { field: "lngStkType", values: ["3"], color: "#1D4ED8" },
  {
    field: "lngOpenHour",
    whenField: "lngStkType",
    whenValues: ["3"],
    color: "#FF0000",
  },
  {
    field: "lngOpenMin",
    whenField: "lngStkType",
    whenValues: ["3"],
    color: "#FF0000",
  },
  {
    field: "lngCloseHour",
    whenField: "lngStkType",
    whenValues: ["3"],
    color: "#FF0000",
  },
  {
    field: "lngCloseMin",
    whenField: "lngStkType",
    whenValues: ["3"],
    color: "#FF0000",
  },
];
/** 우측 판매상태 — 당일품절(1) 빨강, 계속품절(2)·판매시간선택(3) 파랑 + 시분 빨강 */
const mst56RightCellFontColorRules = [
  { field: "lngStkStsType", values: ["1"], color: "#FF0000" },
  { field: "lngStkStsType", values: ["2"], color: "#1D4ED8" },
  { field: "lngStkStsType", values: ["3"], color: "#1D4ED8" },
  {
    field: "lngOpenHour",
    whenField: "lngStkStsType",
    whenValues: ["3"],
    color: "#FF0000",
  },
  {
    field: "lngOpenMin",
    whenField: "lngStkStsType",
    whenValues: ["3"],
    color: "#FF0000",
  },
  {
    field: "lngCloseHour",
    whenField: "lngStkStsType",
    whenValues: ["3"],
    color: "#FF0000",
  },
  {
    field: "lngCloseMin",
    whenField: "lngStkStsType",
    whenValues: ["3"],
    color: "#FF0000",
  },
];

const hideColumnsId = ref([]);

const MST56_CHAIN_BUTTON_COL = "strChainBtn";

const mst56IsChainButtonColumn = (clickData) => {
  const field = clickData?.fieldName ?? clickData?.column;
  return field === MST56_CHAIN_BUTTON_COL;
};

const mst56RightMenuRowSource = () =>
  sortType.value === 2 ? rowData5.value : rowData2.value;

/** Realgrid getRows 배열 행 → API 원본 객체 (progid 2·5 컬럼 순서 차이 대응) */
const mst56ArrayRowToObject = (row) => {
  if (!Array.isArray(row)) {
    return row;
  }
  const menuCd = row[1];
  if (menuCd == null || menuCd === "") {
    return null;
  }
  const found = mst56RightMenuRowSource().find((item) => {
    if (Array.isArray(item)) {
      return item[1] == menuCd;
    }
    const code = item?.lngMenuCode ?? item?.lngMenuCd;
    return code != null && String(code) === String(menuCd);
  });
  if (!found || Array.isArray(found)) {
    return null;
  }
  return found;
};

const mst56ResolveChainRow = (row, dp, dataRow) => {
  if (row == null) {
    return null;
  }
  if (!Array.isArray(row)) {
    return row;
  }
  if (dp && dataRow != null && dataRow >= 0) {
    try {
      const json = dp.getJsonRow?.(dataRow);
      if (json && !Array.isArray(json)) {
        return json;
      }
    } catch (_) {
      void 0;
    }
  }
  return mst56ArrayRowToObject(row);
};

/** 선택메뉴 설정 버튼이 있는 행인지 (lngChain·strChainBtn 기준) */
const mst56RowHasChainButton = (row, dp, dataRow) => {
  const data = mst56ResolveChainRow(row, dp, dataRow);
  if (!data) {
    return false;
  }
  const chain = data.lngChain ?? data.LngChain;
  if (chain != null && chain !== "" && Number(chain) !== 0) {
    return true;
  }
  const btn = data.strChainBtn ?? data.StrChainBtn;
  return btn != null && String(btn).trim() !== "";
};

const mst56MenuCodeFromRow = (row, dp, dataRow) => {
  const data = mst56ResolveChainRow(row, dp, dataRow);
  return data?.lngMenuCode ?? data?.lngMenuCd ?? row?.[1] ?? "";
};

const mst56MenuNameFromRow = (row, dp, dataRow) => {
  const data = mst56ResolveChainRow(row, dp, dataRow);
  return data?.strMenuName ?? data?.strMenuNm ?? row?.[2] ?? "";
};

const mst56OnChainButtonClicked = (row, clickData) => {
  if (clickData && !mst56IsChainButtonColumn(clickData)) {
    return;
  }
  if (!mst56RowHasChainButton(row)) {
    return;
  }
  buttonClicked(row);
};

const mst56ScheduleRightGridButtonBind = (gridId, delayMs = 120) => {
  setTimeout(() => bindMst56RightGridButtonClick(gridId), delayMs);
};

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getCommonList(367);
  const res2 = await getCommonList(368);

  let lp = store.state.userData.lngPosition;
  if (res.data.List.filter((item) => lp == item.strDCode).length > 0) {
    sortType.value = 1;
    hideColumnsId.value = MST56_TYPE1_HIDE_COLUMNS;
  } else if (res2.data.List.filter((item) => lp == item.strDCode).length > 0) {
    sortType.value = 2;
    hideColumnsId.value = [];
  } else {
    sortType.value = 0;
    hideColumnsId.value = [];
  }
  sortTypeReady.value = true;
  await nextTick();
  if (sortType.value === 2) {
    await searchButton4();
  } else {
    await searchButton();
  }
});

onUnmounted(() => {
  document.body.classList.remove(MST56_POPUP_BODY_CLASS);
});

const rowData4 = ref([]);

const MST56_CORNER_HINT = "왼쪽에서 코너를 선택해 주세요.";
const clickedCornerCd = ref(0);
const clickedCornerNm = ref(MST56_CORNER_HINT);
const clickedMenuNm = ref("");
const clickedRow = ref(false);

/** sortType 0 rail / sortType 1·2 목록 — Vue @click */
const onCornerListSelect = async (row) => {
  const cornerId = row?.lngCornerCD ?? row?.lngCornerCd;
  const cornerNm = row?.strCornerNM ?? row?.strCornerNm ?? "";
  if (cornerId == null || cornerId === "") {
    return;
  }
  if (
    clickedRow.value &&
    String(clickedCornerCd.value) === String(cornerId)
  ) {
    return;
  }
  try {
    await loadRightMenuByCorner(cornerId, cornerNm);
  } catch (error) {
    console.error(error);
  }
};

const MST56_LEFT_GRID_KEY = /^realgrid-MST56_001INS_VUE-[134]-/;
const mst56LeftGridId = ref("");

const onMst56LeftGridName = (id) => {
  if (id && MST56_LEFT_GRID_KEY.test(String(id))) {
    mst56LeftGridId.value = id;
  }
};

const mst56ResolveGridDataRow = (grid, clickData, current) => {
  if (clickData?.dataRow != null && clickData.dataRow >= 0) {
    return clickData.dataRow;
  }
  if (current?.dataRow != null && current.dataRow >= 0) {
    return current.dataRow;
  }
  const ii = clickData?.itemIndex ?? current?.itemIndex;
  if (ii != null && ii >= 0 && grid?.getDataRow) {
    try {
      const dr = grid.getDataRow(ii);
      if (dr != null && dr >= 0) {
        return dr;
      }
    } catch (_) {
      void 0;
    }
  }
  return -1;
};

const mst56OnLeftGridRow = (dataRow) => {
  if (dataRow == null || dataRow < 0) {
    return;
  }
  const src = sortType.value === 2 ? rowData4.value : rowData.value;
  const row = src[dataRow];
  if (row) {
    onCornerListSelect(row);
  }
};

/** 유형1 좌측(코너명만) 그리드인지 — 우측·팝업에 setColumnLayout 오적용 방지 */
const mst56IsType1LeftGridView = (gv) => {
  if (!gv || sortType.value !== 1) {
    return false;
  }
  const leftId = mst56LeftGridId.value;
  if (!leftId) {
    return false;
  }
  return rgGetInstance(leftId)?.gridView === gv;
};

/** applyCustomSize=true 면 mst56 전용 행높이·헤더높이 적용, false 면 resetSize 만 */
const mst56SyncLeftGridLayout = (gv, applyCustomSize = true) => {
  if (!gv) {
    return;
  }
  const run = () => {
    try {
      if (applyCustomSize) {
        if (mst56GridRowHeight > 0) {
          gv.displayOptions.rowHeight = mst56GridRowHeight;
        }
        if (mst56GridHeaderHeight > 0) {
          gv.header.height = mst56GridHeaderHeight;
        }
      }
      if (mst56IsType1LeftGridView(gv)) {
        mst56ApplyType1LeftColumnLayout(gv);
      }
      mst56FinalizeGridScroll(gv);
    } catch (_) {
      void 0;
    }
  };
  if (sortType.value === 1) {
    run();
    return;
  }
  requestAnimationFrame(() => {
    requestAnimationFrame(run);
  });
};

/** 컨테이너 높이에 맞추고 바디 영역 세로 스크롤 사용 */
const mst56FinalizeGridScroll = (gv) => {
  if (!gv) {
    return;
  }
  // 로우가 많아질 때 내부 스크롤이 생기도록 고정 높이 동기화를 끈다.
  gv.displayOptions.syncGridHeight = "none";
  if (mst56IsType1LeftGridView(gv)) {
    mst56ApplyType1LeftColumnLayout(gv);
  }
  try {
    gv.resetSize();
  } catch (_) {
    void 0;
  }
};

const MST56_TYPE1_HIDE_FIELDS = [
  "lngStkType",
  "lngOpenHour",
  "lngOpenMin",
  "lngCloseHour",
  "lngCloseMin",
];
const MST56_TYPE1_HIDE_COLUMNS = [...MST56_TYPE1_HIDE_FIELDS];
const MST56_TYPE1_KEEP_FIELD = "strCornerNM";
const MST56_TYPE1_COLUMN_LAYOUT = [
  {
    name: MST56_TYPE1_KEEP_FIELD,
    column: MST56_TYPE1_KEEP_FIELD,
    width: 360,
    visible: true,
    header: { visible: true },
  },
];

/** sortType 1 — 코너명(strCornerNM)만 표시 */
const mst56ApplyType1LeftColumnLayout = (gv) => {
  if (!gv || sortType.value !== 1) {
    return;
  }
  const host = gv.getContainer?.()?.parentElement;
  const hostW = host?.clientWidth ?? 0;
  const cornerWidth = hostW > 80 ? Math.max(280, hostW - 48) : 360;

  try {
    gv.setColumnLayout([
      {
        name: MST56_TYPE1_KEEP_FIELD,
        column: MST56_TYPE1_KEEP_FIELD,
        width: cornerWidth,
        visible: true,
        header: { visible: true },
      },
    ]);
  } catch (_) {
    void 0;
  }

  for (const field of MST56_TYPE1_HIDE_FIELDS) {
    try {
      const col = gv.columnByField?.(field) ?? gv.columnByName?.(field);
      if (col) {
        col.visible = false;
      }
    } catch (_) {
      void 0;
    }
  }
  for (const groupName of ["영업시작 시간", "영업종료 시간", "영업정보선택"]) {
    try {
      const group = gv.layoutByName?.(groupName);
      if (group) {
        group.visible = false;
      }
    } catch (_) {
      void 0;
    }
  }
  try {
    for (const col of gv.getColumns?.() ?? []) {
      const fieldName = col.fieldName || col.name;
      if (!fieldName || fieldName === MST56_TYPE1_KEEP_FIELD) {
        continue;
      }
      col.visible = false;
    }
  } catch (_) {
    void 0;
  }
  try {
    const cornerCol =
      gv.columnByField?.(MST56_TYPE1_KEEP_FIELD) ??
      gv.columnByName?.(MST56_TYPE1_KEEP_FIELD);
    if (cornerCol) {
      cornerCol.visible = true;
      cornerCol.width = cornerWidth;
    }
  } catch (_) {
    void 0;
  }
};

const mst56BindType1LeftGridAfterLoad = (gv) => {
  if (!gv || sortType.value !== 1 || gv.__mst56Type1AfterLoadBound) {
    return;
  }
  gv.__mst56Type1AfterLoadBound = true;
  const prevOnDataLoadComplated = gv.onDataLoadComplated;
  gv.onDataLoadComplated = function (grid) {
    if (typeof prevOnDataLoadComplated === "function") {
      try {
        prevOnDataLoadComplated(grid);
      } catch (_) {
        void 0;
      }
    }
    mst56ApplyType1LeftColumnLayout(grid);
  };
};

const mst56ScheduleType1LeftLayout = (gridId) => {
  if (sortType.value !== 1) {
    return;
  }
  nextTick(() => {
    const id = gridId || mst56LeftGridId.value;
    const gv = rgGetInstance(id)?.gridView;
    if (gv) {
      mst56ApplyType1LeftColumnLayout(gv);
      mst56BindType1LeftGridAfterLoad(gv);
    }
    bindMst56LeftGridCornerClick(gridId);
  });
};

/** 좌측 코너 그리드 — rowData를 RealGrid에 직접 반영 (초기 로드·조회 공통) */
const mst56FlushLeftGridData = (gridId) => {
  const id = gridId || mst56LeftGridId.value;
  const inst = id ? rgGetInstance(id) : null;
  const dp = inst?.dataProvider;
  const gv = inst?.gridView;
  if (!dp || !gv) {
    return false;
  }
  const list =
    sortType.value === 2
      ? Array.isArray(rowData4.value)
        ? rowData4.value
        : []
      : Array.isArray(rowData.value)
        ? rowData.value
        : [];
  if (!list.length) {
    return false;
  }
  try {
    dp.setRows(list);
    if (sortType.value === 1) {
      mst56ApplyType1LeftColumnLayout(gv);
    }
    mst56FinalizeGridScroll(gv);
    return true;
  } catch (_) {
    return false;
  }
};

const mst56RetryFlushLeftGridData = (gridId, delays = [0, 150, 400]) => {
  for (const ms of delays) {
    setTimeout(() => mst56FlushLeftGridData(gridId), ms);
  }
};

/** gridReady 후 좌측 그리드에 코너 선택 핸들러 직접 연결 (다중 그리드·편집 셀 대응) */
const bindMst56LeftGridCornerClick = (gridId) => {
  const id = gridId || mst56LeftGridId.value;
  if (!id || !MST56_LEFT_GRID_KEY.test(String(id))) {
    return;
  }

  const gv = rgGetInstance(id)?.gridView;
  if (!gv) {
    return;
  }

  // 타입0·1(progid=1)은 커스텀 row/header 높이 적용, 타입2(progid=4)는 MSTGRIDINFO 기본값
  const useCustomSize = sortType.value === 0 || sortType.value === 1;
  if (sortType.value === 1) {
    mst56BindType1LeftGridAfterLoad(gv);
  }
  const dp = rgGetInstance(id)?.dataProvider;
  if (sortType.value === 0 && dp) {
    mst56BindLeftGridCellEdited(id, gv, dp);
  }
  if (gv.__mst56CornerClickBound === id) {
    mst56SyncLeftGridLayout(gv, useCustomSize);
    return;
  }
  gv.__mst56CornerClickBound = id;

  const prevCurrentChanged = gv.onCurrentChanged;
  gv.onCurrentChanged = function (grid, newIndex) {
    if (typeof prevCurrentChanged === "function") {
      try {
        prevCurrentChanged(grid, newIndex);
      } catch (_) {
        void 0;
      }
    }
    if (newIndex?.cellType === "header") {
      return;
    }
    const dr = newIndex?.dataRow;
    if (dr != null && dr >= 0) {
      mst56OnLeftGridRow(dr);
    }
  };

  const prevCellClicked = gv.onCellClicked;
  gv.onCellClicked = function (grid, clickData) {
    if (typeof prevCellClicked === "function") {
      try {
        prevCellClicked(grid, clickData);
      } catch (_) {
        void 0;
      }
    }
    if (clickData?.cellType === "header" || clickData?.cellType === "check") {
      return;
    }
    const cur = grid.getCurrent();
    const dr = mst56ResolveGridDataRow(grid, clickData, cur);
    if (dr >= 0) {
      mst56OnLeftGridRow(dr);
    }
  };

  mst56SyncLeftGridLayout(gv, useCustomSize);
};

const onMst56LeftGridReady = (gridId) => {
  nextTick(() => {
    mst56FlushLeftGridData(gridId);
    if (sortType.value === 1) {
      mst56ScheduleType1LeftLayout(gridId);
    }
    bindMst56LeftGridCornerClick(gridId);
    mst56RetryFlushLeftGridData(gridId);
  });
};

const MST56_RIGHT_GRID_KEY = /^realgrid-MST56_001INS_VUE-[25]-/;
const mst56RightGridId = ref("");

const onMst56RightGridName = (id) => {
  if (id && MST56_RIGHT_GRID_KEY.test(String(id))) {
    mst56RightGridId.value = id;
  }
};

const mst56RightGridSnapshot = ref([]);
const mst56LeftGridSnapshot = ref([]);
const MST56_LEFT_CORNER_EDIT_FIELDS = [
  "lngStkType",
  "lngOpenHour",
  "lngOpenMin",
  "lngCloseHour",
  "lngCloseMin",
];
const MST56_RIGHT_MENU_EDIT_FIELDS_TYPE0 = ["lngStkStsType"];
const MST56_RIGHT_MENU_EDIT_FIELDS_TYPE2 = [
  "lngStkStsType",
  "lngOpenHour",
  "lngOpenMin",
  "lngCloseHour",
  "lngCloseMin",
];

const mst56MenuRowKey = (row) => {
  if (!row) {
    return "";
  }
  if (Array.isArray(row)) {
    return String(row[1] ?? "");
  }
  return String(row.lngMenuCode ?? row.lngMenuCd ?? "");
};

const mst56CornerRowKey = (row) => {
  if (!row) {
    return "";
  }
  if (Array.isArray(row)) {
    return String(row[0] ?? "");
  }
  return String(row.lngCornerCD ?? row.lngCornerCd ?? "");
};

const mst56CloneCornerRowSnapshot = (row) => {
  if (Array.isArray(row)) {
    return {
      lngCornerCD: row[0],
      lngStkType: row[2],
      lngOpenHour: row[3],
      lngOpenMin: row[4],
      lngCloseHour: row[5],
      lngCloseMin: row[6],
    };
  }
  return {
    lngCornerCD: row.lngCornerCD ?? row.lngCornerCd,
    lngStkType: row.lngStkType,
    lngOpenHour: row.lngOpenHour,
    lngOpenMin: row.lngOpenMin,
    lngCloseHour: row.lngCloseHour,
    lngCloseMin: row.lngCloseMin,
  };
};

const mst56RememberLeftGridSnapshot = (list) => {
  mst56LeftGridSnapshot.value = (list ?? []).map((row) =>
    mst56CloneCornerRowSnapshot(row)
  );
};

const mst56CloneMenuRowSnapshot = (row) => {
  if (Array.isArray(row)) {
    return {
      lngMenuCode: row[1],
      lngStkStsType: row[4],
      lngOpenHour: row[6],
      lngOpenMin: row[7],
      lngCloseHour: row[8],
      lngCloseMin: row[9],
    };
  }
  return {
    lngMenuCode: row.lngMenuCode ?? row.lngMenuCd,
    lngStkStsType: row.lngStkStsType,
    lngOpenHour: row.lngOpenHour,
    lngOpenMin: row.lngOpenMin,
    lngCloseHour: row.lngCloseHour,
    lngCloseMin: row.lngCloseMin,
  };
};

const mst56RememberRightGridSnapshot = (list) => {
  mst56RightGridSnapshot.value = (list ?? []).map((row) =>
    mst56CloneMenuRowSnapshot(row)
  );
};

const mst56SetRightGridRowData = (list) => {
  const rows = Array.isArray(list) ? list : [];
  mst56RememberRightGridSnapshot(rows);
  if (sortType.value === 2) {
    rowData5.value = rows;
  } else {
    rowData2.value = rows;
  }
};

const mst56SyncRightGridChangedRefs = (gridId) => {
  const id = gridId || mst56RightGridId.value;
  const dp = rgGetInstance(id)?.dataProvider;
  if (!dp) {
    return;
  }
  let updated = [];
  try {
    updated = dp.getAllStateRows?.()?.updated ?? [];
  } catch (_) {
    void 0;
  }
  if (!updated.length) {
    try {
      updated = dp.getStateRows?.("updated") ?? [];
    } catch (_) {
      void 0;
    }
  }
  if (sortType.value === 2) {
    allstaterow2.value = updated;
  } else {
    allstaterow.value = updated;
  }
};

/** 메뉴 품절처리 우측 그리드 — 변경 행 수집 (다중 그리드 환경에서 인스턴스 직접 조회) */
const mst56CollectChangedMenuRows = (gridId) => {
  const id = gridId || mst56RightGridId.value;
  const inst = rgGetInstance(id);
  const dp = inst?.dataProvider;
  const gv = inst?.gridView;
  if (!dp || !gv) {
    return [];
  }

  try {
    gv.commit?.(true);
  } catch (_) {
    void 0;
  }

  let indices = [];
  try {
    indices = dp.getAllStateRows?.()?.updated ?? [];
  } catch (_) {
    void 0;
  }
  if (!indices.length) {
    try {
      indices = dp.getStateRows?.("updated") ?? [];
    } catch (_) {
      void 0;
    }
  }

  let rows = indices.map((i) => dp.getJsonRow(i)).filter(Boolean);

  if (!rows.length && mst56RightGridSnapshot.value.length) {
    const current = dp.getJsonRows?.() ?? [];
    const snapMap = new Map(
      mst56RightGridSnapshot.value.map((row) => [mst56MenuRowKey(row), row])
    );
    const fields =
      sortType.value === 2
        ? MST56_RIGHT_MENU_EDIT_FIELDS_TYPE2
        : MST56_RIGHT_MENU_EDIT_FIELDS_TYPE0;
    rows = current.filter((row) => {
      const orig = snapMap.get(mst56MenuRowKey(row));
      if (!orig) {
        return false;
      }
      return fields.some(
        (field) => String(orig[field] ?? "") !== String(row[field] ?? "")
      );
    });
  }

  return rows;
};

/** 코너 영업정보 좌측 그리드 — 변경 행 수집 */
const mst56CollectChangedCornerRows = (gridId) => {
  const id = gridId || mst56LeftGridId.value;
  const inst = rgGetInstance(id);
  const dp = inst?.dataProvider;
  const gv = inst?.gridView;
  if (!dp || !gv || sortType.value !== 0) {
    return [];
  }

  try {
    gv.commit?.(true);
  } catch (_) {
    void 0;
  }

  let indices = [];
  try {
    indices = dp.getAllStateRows?.()?.updated ?? [];
  } catch (_) {
    void 0;
  }
  if (!indices.length) {
    try {
      indices = dp.getStateRows?.("updated") ?? [];
    } catch (_) {
      void 0;
    }
  }

  let rows = indices.map((i) => dp.getJsonRow(i)).filter(Boolean);

  if (!rows.length && mst56LeftGridSnapshot.value.length) {
    const current = dp.getJsonRows?.() ?? [];
    const snapMap = new Map(
      mst56LeftGridSnapshot.value.map((row) => [mst56CornerRowKey(row), row])
    );
    rows = current.filter((row) => {
      const orig = snapMap.get(mst56CornerRowKey(row));
      if (!orig) {
        return false;
      }
      return MST56_LEFT_CORNER_EDIT_FIELDS.some(
        (field) => String(orig[field] ?? "") !== String(row[field] ?? "")
      );
    });
  }

  return rows;
};

const mst56BindLeftGridCellEdited = (gridId, gv, dp) => {
  if (!gv || !dp || sortType.value !== 0) {
    return;
  }
  if (gv.__mst56LeftCellEditedBound === gridId) {
    return;
  }
  gv.__mst56LeftCellEditedBound = gridId;
  const prevOnCellEdited = gv.onCellEdited;
  gv.onCellEdited = function (grid, itemIndex, row, field) {
    if (typeof prevOnCellEdited === "function") {
      try {
        prevOnCellEdited(grid, itemIndex, row, field);
      } catch (_) {
        void 0;
      }
    }
    try {
      updatedrowdata.value = dp.getJsonRows?.() ?? [];
    } catch (_) {
      void 0;
    }
  };
};

const mst56BindRightGridCellEdited = (gridId, gv, dp) => {
  if (!gv || !dp) {
    return;
  }
  gv.onCellEdited = function (grid) {
    try {
      grid.commit?.(true);
    } catch (_) {
      void 0;
    }
    mst56SyncRightGridChangedRefs(gridId);
    try {
      updatedrowdata2.value = dp.getJsonRows?.() ?? [];
    } catch (_) {
      void 0;
    }
  };
};

const mst56OnRightGridAllStateRows = (states) => {
  const updated = states?.updated ?? [];
  if (sortType.value === 2) {
    allstaterow2.value = updated;
  } else {
    allstaterow.value = updated;
  }
};

/** 우측 그리드(progid=2·5) — gridReady 후 크기 동기화 + 버튼 클릭 핸들러 직접 바인딩 */
const bindMst56RightGridButtonClick = (gridId) => {
  const id = gridId || mst56RightGridId.value;
  if (!id || !MST56_RIGHT_GRID_KEY.test(String(id))) return;

  const inst = rgGetInstance(id);
  const gv = inst?.gridView;
  const dp = inst?.dataProvider;
  if (!gv) return;

  const applySizing = () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        try {
          if (mst56GridRowHeight > 0) gv.displayOptions.rowHeight = mst56GridRowHeight;
          if (mst56GridHeaderHeight > 0) gv.header.height = mst56GridHeaderHeight;
          mst56FinalizeGridScroll(gv);
        } catch (_) { void 0; }
      });
    });
  };

  if (gv.__mst56RightClickBound === id) {
    mst56BindRightGridCellEdited(id, gv, dp);
    applySizing();
    return;
  }
  gv.__mst56RightClickBound = id;

  mst56BindRightGridCellEdited(id, gv, dp);

  let _lastButtonClickTime = 0;

  const prevCellItemClicked = gv.onCellItemClicked;
  gv.onCellItemClicked = function (grid, clickData) {
    if (typeof prevCellItemClicked === "function") {
      try { prevCellItemClicked(grid, clickData); } catch (_) { void 0; }
    }
    if (!mst56IsChainButtonColumn(clickData)) {
      return;
    }
    if (!dp) return;
    const dr = (clickData?.dataRow ?? -1) >= 0
      ? clickData.dataRow
      : (grid.getCurrent()?.dataRow ?? -1);
    if (dr < 0) return;
    const row = dp.getRows?.()?.[dr];
    if (!row || !mst56RowHasChainButton(row, dp, dr)) return;
    const now = Date.now();
    if (now - _lastButtonClickTime < 300) return;
    _lastButtonClickTime = now;
    buttonClicked(row);
  };

  const prevCellClicked = gv.onCellClicked;
  gv.onCellClicked = function (grid, clickData) {
    if (typeof prevCellClicked === "function") {
      try { prevCellClicked(grid, clickData); } catch (_) { void 0; }
    }
    if (clickData?.cellType === "header" || clickData?.cellType === "check") return;
    if (!mst56IsChainButtonColumn(clickData)) return;
    try {
      const colDef = grid.columnByName?.(clickData?.fieldName);
      if (colDef?.renderer?.type !== "button") return;
    } catch (_) { return; }
    if (!dp) return;
    const cur = grid.getCurrent();
    const dr = mst56ResolveGridDataRow(grid, clickData, cur);
    if (dr < 0) return;
    const row = dp.getRows?.()?.[dr];
    if (!row || !mst56RowHasChainButton(row, dp, dr)) return;
    const now = Date.now();
    if (now - _lastButtonClickTime < 300) return;
    _lastButtonClickTime = now;
    buttonClicked(row);
  };

  applySizing();
};

const onMst56RightGridReady = (gridId) => {
  if (!gridId) return;
  nextTick(() => mst56ScheduleRightGridButtonBind(gridId, 120));
};

const mst56MenuSearchValue = computed(() => [
  cond2.value === "9" || cond2.value === 9 ? -1 : cond2.value,
]);
const mst56PopupSearchValue = computed(() => [
  pcond2.value === "9" || pcond2.value === 9 ? -1 : pcond2.value,
]);

const mst56GetMenuRowName = (item) => {
  if (Array.isArray(item)) {
    return item[2] ?? "";
  }
  return item?.strMenuName ?? item?.strMenuNm ?? "";
};

const mst56GetMenuRowStatus = (item) => {
  if (Array.isArray(item)) {
    return item[4] ?? "";
  }
  return item?.lngStkStsType ?? item?.LngStkStsType ?? "";
};

/** API 결과 + 메뉴명·판매상태 클라이언트 필터 (COND 미적용 대비) */
const mst56FilterSoldMenuList = (list, menuName, status) => {
  let rows = Array.isArray(list) ? list : [];
  const kw = String(menuName ?? "").trim().toLowerCase();
  if (kw) {
    rows = rows.filter((item) =>
      String(mst56GetMenuRowName(item)).toLowerCase().includes(kw)
    );
  }
  if (status != null && status !== "" && status !== "9" && status !== 9) {
    rows = rows.filter(
      (item) => String(mst56GetMenuRowStatus(item)) === String(status)
    );
  }
  return rows;
};

const mst56ApplyRightGridSearchFilters = () => {
  const id = mst56RightGridId.value;
  if (!id) {
    return;
  }
  const gv = rgGetInstance(id)?.gridView;
  if (!gv) {
    return;
  }
  try {
    if (cond2.value === "9" || cond2.value === 9) {
      gv.setColumnFilters?.("lngStkStsType", []);
    }
    const kw = String(cond.value ?? "").trim();
    if (kw) {
      gv.setColumnFilters?.("strMenuName", [
        {
          name: "mst56MenuName",
          criteria: `(value ilike '%${kw.replace(/'/g, "''")}%')`,
          active: true,
        },
      ]);
    } else {
      gv.setColumnFilters?.("strMenuName", []);
    }
  } catch (_) {
    void 0;
  }
};
const mst56PopupGridId = ref("");
const popupGridMount = ref(false);
const popupGridEpoch = ref(0);
const MST56_POPUP_BODY_CLASS = "mst56-popup-active";
const MST56_POPUP_STK_FIELD = "lngStkStsType";
const MST56_POPUP_STK_VALUES = ["0", "1", "2"];
const MST56_POPUP_STK_LABELS = ["판매중", "당일품절", "계속품절"];

const mst56PopupEditorConfig = () => ({
  type: "dropdown",
  domainOnly: false,
  textReadOnly: true,
  dropDownWhenClick: true,
  commitOnSelect: true,
  dropDownCount: 3,
  dropDownPosition: "editor",
  values: [...MST56_POPUP_STK_VALUES],
  labels: [...MST56_POPUP_STK_LABELS],
});

/** 팝업 모달 안 RealGrid 드롭다운 — overflow/z-index 클리핑 해제 */
const mst56ElevatePopupDropdownList = () => {
  if (!document.body.classList.contains(MST56_POPUP_BODY_CLASS)) {
    return;
  }
  const lists = document.querySelectorAll(".rg-dropdownlist");
  for (const el of lists) {
    const rect = el.getBoundingClientRect();
    el.style.position = "fixed";
    el.style.left = `${rect.left}px`;
    el.style.top = `${rect.top}px`;
    el.style.minWidth = `${Math.max(rect.width, 96)}px`;
    el.style.zIndex = "10050";
    el.style.maxHeight = "none";
    el.style.overflow = "visible";
    el.style.pointerEvents = "auto";
  }
};

const mst56ApplyPopupStatusCombo = (gridId) => {
  const id = gridId || mst56PopupGridId.value;
  if (!id) {
    return;
  }
  const gv = rgGetInstance(id)?.gridView;
  if (!gv) {
    return;
  }
  const editor = mst56PopupEditorConfig();
  try {
    gv.setColumnProperty?.(MST56_POPUP_STK_FIELD, "lookupDisplay", true);
    gv.setColumnProperty?.(MST56_POPUP_STK_FIELD, "values", [
      ...MST56_POPUP_STK_VALUES,
    ]);
    gv.setColumnProperty?.(MST56_POPUP_STK_FIELD, "labels", [
      ...MST56_POPUP_STK_LABELS,
    ]);
    gv.setColumnProperty?.(MST56_POPUP_STK_FIELD, "editor", editor);
  } catch (_) {
    void 0;
  }
  try {
    const col = gv.columnByField?.(MST56_POPUP_STK_FIELD);
    if (col) {
      col.lookupDisplay = true;
      col.values = [...MST56_POPUP_STK_VALUES];
      col.labels = [...MST56_POPUP_STK_LABELS];
      col.editor = editor;
    }
  } catch (_) {
    void 0;
  }
  if (gv.__mst56PopupStatusEditorBound) {
    return;
  }
  gv.__mst56PopupStatusEditorBound = true;
  const prevOnShowEditor = gv.onShowEditor;
  gv.onShowEditor = function (grid, index, editProps, attrs) {
    let allow = true;
    if (typeof prevOnShowEditor === "function") {
      const ret = prevOnShowEditor(grid, index, editProps, attrs);
      if (ret === false) {
        return false;
      }
      if (typeof ret === "boolean") {
        allow = ret;
      }
    }
    const fieldKey = String(index?.fieldName ?? index?.column ?? "");
    if (fieldKey === MST56_POPUP_STK_FIELD) {
      Object.assign(editProps, mst56PopupEditorConfig());
      mst56ApplyPopupStatusCombo(id);
      requestAnimationFrame(() => {
        requestAnimationFrame(mst56ElevatePopupDropdownList);
      });
    }
    return allow;
  };
};

const onMst56PopupGridName = (id) => {
  if (id) {
    mst56PopupGridId.value = id;
  }
};

const mst56SyncPopupGridLayout = (gridId) => {
  const id = gridId || mst56PopupGridId.value;
  if (!id) {
    return;
  }
  const gv = rgGetInstance(id)?.gridView;
  if (!gv) {
    return;
  }
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      try {
        if (mst56GridRowHeight > 0) {
          gv.displayOptions.rowHeight = mst56GridRowHeight;
        }
        if (mst56GridHeaderHeight > 0) {
          gv.header.height = mst56GridHeaderHeight;
        }
        if (pcond2.value === "9" || pcond2.value === 9) {
          try {
            gv.setColumnFilters?.("lngStkStsType", []);
          } catch (_) {
            void 0;
          }
        }
        try {
          gv.resetSize();
        } catch (_) {
          void 0;
        }
      } catch (_) {
        void 0;
      }
    });
  });
};

const onMst56PopupGridReady = (gridId) => {
  nextTick(() => {
    mst56ApplyPopupStatusCombo(gridId);
    mst56SyncPopupGridLayout(gridId);
  });
};

const normalizeCornerRowPayload = (payload) => {
  if (payload == null) {
    return null;
  }
  if (Array.isArray(payload)) {
    return {
      lngCornerCD: payload[0],
      strCornerNM: payload[1] ?? "",
    };
  }
  if (typeof payload === "object") {
    return payload;
  }
  return null;
};

/** sortType 0 좌측 Realgrid — 셀 클릭 시 rail 과 동일하게 우측 조회 */
const onLeftGridCornerSelect = async (payload) => {
  let row = normalizeCornerRowPayload(payload);
  if (
    row &&
    row.lngCornerCD == null &&
    row.lngCornerCd == null &&
    row.dataRow != null &&
    row.dataRow >= 0
  ) {
    row = rowData.value[row.dataRow] ?? row;
  }
  if (!row) {
    return;
  }
  await onCornerListSelect(row);
};

const reload = ref(false);
const rowData = ref([]);
const rowData2 = ref([]);
const rowData3 = ref([]);
const rowData5 = ref([]);
const afterSearch = ref(false);

watch(
  () => rowData.value,
  () => {
    if (!sortTypeReady.value || sortType.value !== 1) {
      return;
    }
    mst56ScheduleType1LeftLayout();
  }
);

watch(
  () => rowData5.value,
  () => {
    if (!sortTypeReady.value || sortType.value !== 2) {
      return;
    }
    mst56ScheduleRightGridButtonBind(undefined, 120);
  }
);

/**
 * 선택한 매출 시작일자
 */

const cond = ref("");
const cond2 = ref("9");

const pcond = ref("");
const pcond2 = ref("9");
const store = useStore();

const datepicker = ref(null);
const closePopUp = ref(false);
const allstaterow = ref([]);
const allstaterow2 = ref([]);
const allstaterow3 = ref([]);
const allstaterow4 = ref([]);
const allStateRows = (e) => {
  allstaterow.value = e.updated;
};
const allStateRows2 = (e) => {
  allstaterow2.value = e.updated;
};
const allStateRows3 = (e) => {
  allstaterow3.value = e.updated;
};
const allStateRows4 = (e) => {
  allstaterow4.value = e.updated;
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
  store.state.loading = true;
  try {
    resetMst56AfterLeftRefresh();
    const res = await getSalesInfoByCorner(
      store.state.userData.lngStoreGroup,
      store.state.userData.lngPositionType,
      store.state.userData.lngPosition,
      store.state.userData.lngSuperAttrCd
    );
    console.log(res);
    rowData.value = res.data?.List ?? [];

    afterSearch.value = true;
    await nextTick();
    mst56FlushLeftGridData();
    mst56RetryFlushLeftGridData();
    if (sortType.value === 1) {
      mst56ScheduleType1LeftLayout();
    } else if (sortType.value === 0) {
      setTimeout(() => {
        const dp = rgGetInstance(mst56LeftGridId.value)?.dataProvider;
        mst56RememberLeftGridSnapshot(
          dp?.getJsonRows?.() ?? rowData.value
        );
        bindMst56LeftGridCornerClick();
      }, 120);
    } else {
      setTimeout(() => bindMst56LeftGridCornerClick(), 120);
    }
  } catch (error) {
    afterSearch.value = false;
    //comsole.log(error);
  } finally {
    store.state.loading = false;
  }
};

const searchButton4 = async () => {
  store.state.loading = true;
  try {
    resetMst56AfterLeftRefresh();
    const res = await getSoldMenuList3(
      store.state.userData.lngStoreGroup,
      store.state.userData.lngPositionType,
      store.state.userData.lngPosition,
      store.state.userData.lngSuperAttrCd,
      sortType.value
    );

    console.log(res);

    rowData4.value = res.data?.List ?? [];

    afterSearch.value = true;
    await nextTick();
    mst56FlushLeftGridData();
    mst56RetryFlushLeftGridData();
    setTimeout(() => bindMst56LeftGridCornerClick(), 120);
  } catch (error) {
    afterSearch.value = false;
    //comsole.log(error);
  } finally {
    store.state.loading = false;
  }
};

/** 좌측 코너 선택 → 우측 메뉴 조회 */
const loadRightMenuByCorner = async (cornerId, cornerNm) => {
  if (cornerId == null || cornerId === "") {
    return;
  }

  clickedRow.value = true;
  clickedCornerCd.value = cornerId;
  clickedCornerNm.value = cornerNm || MST56_CORNER_HINT;

  if (sortType.value == 2) {
    initGrid5();
  } else {
    initGrid2();
  }

  const res = await getSoldMenuList(
    store.state.userData.lngStoreGroup,
    store.state.userData.lngPosition,
    cornerId,
    cond.value,
    cond2.value,
    sortType.value
  );

  if (sortType.value == 2) {
    mst56SetRightGridRowData(
      mst56FilterSoldMenuList(
        res.data?.List ?? [],
        cond.value,
        cond2.value
      )
    );
    await nextTick();
    mst56ScheduleRightGridButtonBind(undefined, 120);
    mst56ApplyRightGridSearchFilters();
  } else {
    mst56SetRightGridRowData(
      mst56FilterSoldMenuList(
        res.data?.List ?? [],
        cond.value,
        cond2.value
      )
    );
    await nextTick();
    mst56ScheduleRightGridButtonBind(undefined, 120);
    mst56ApplyRightGridSearchFilters();
  }
};

const searchButton2 = async () => {
  if (clickedRow.value == false) {
    Swal.fire({
      title: "경고",
      text: "왼쪽 코너를 먼저 클릭하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  if (clickedCornerCd.value == null || clickedCornerCd.value == undefined) {
    Swal.fire({
      title: "경고",
      text: "코너를 먼저 선택하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  try {
    store.state.loading = true;
    const res = await getSoldMenuList(
      store.state.userData.lngStoreGroup,
      store.state.userData.lngPosition,
      clickedCornerCd.value,
      cond.value,
      cond2.value,
      sortType.value
    );
    let list = res.data?.List ?? [];
    if (String(cond.value ?? "").trim() && list.length === 0) {
      const resAll = await getSoldMenuList(
        store.state.userData.lngStoreGroup,
        store.state.userData.lngPosition,
        clickedCornerCd.value,
        "",
        cond2.value,
        sortType.value
      );
      list = resAll.data?.List ?? [];
    }
    rowData2.value = mst56FilterSoldMenuList(list, cond.value, cond2.value);
    mst56RememberRightGridSnapshot(rowData2.value);
    await nextTick();
    mst56ScheduleRightGridButtonBind(undefined, 120);
    mst56ApplyRightGridSearchFilters();
  } catch (error) {
  } finally {
    store.state.loading = false;
  }
};

const searchButton5 = async () => {
  if (clickedRow.value == false) {
    Swal.fire({
      title: "경고",
      text: "왼쪽 코너를 먼저 클릭하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  if (clickedCornerCd.value == null || clickedCornerCd.value == undefined) {
    Swal.fire({
      title: "경고",
      text: "코너를 먼저 선택하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  try {
    store.state.loading = true;
    const res = await getSoldMenuList(
      store.state.userData.lngStoreGroup,
      store.state.userData.lngPosition,
      clickedCornerCd.value,
      cond.value,
      cond2.value,
      sortType.value
    );

    let list = res.data?.List ?? [];
    if (String(cond.value ?? "").trim() && list.length === 0) {
      const resAll = await getSoldMenuList(
        store.state.userData.lngStoreGroup,
        store.state.userData.lngPosition,
        clickedCornerCd.value,
        "",
        cond2.value,
        sortType.value
      );
      list = resAll.data?.List ?? [];
    }
    rowData5.value = mst56FilterSoldMenuList(list, cond.value, cond2.value);
    mst56RememberRightGridSnapshot(rowData5.value);
    await nextTick();
    mst56ScheduleRightGridButtonBind(undefined, 120);
    mst56ApplyRightGridSearchFilters();
  } catch (error) {
  } finally {
    store.state.loading = false;
  }
};

const onMenuSalesStatusChange = () => {
  if (sortType.value == 2) {
    searchButton5();
  } else {
    searchButton2();
  }
};

const visible = ref(false);
const clickedMenuCd = ref("");

watch(visible, (open) => {
  document.body.style.overflow = open ? "hidden" : "";
  document.body.classList.toggle(MST56_POPUP_BODY_CLASS, !!open);
});

watch([visible, rowData3], async ([open]) => {
  if (!open) {
    return;
  }
  await nextTick();
  mst56ApplyPopupStatusCombo();
  mst56SyncPopupGridLayout();
});
const buttonClicked = async (e) => {
  if (!mst56RowHasChainButton(e)) {
    return;
  }
  clickedMenuNm.value = mst56MenuNameFromRow(e);
  clickedMenuCd.value = mst56MenuCodeFromRow(e);
  pcond.value = "";
  pcond2.value = "9";
  popupGridEpoch.value += 1;
  popupGridMount.value = false;
  rowData3.value = [];
  visible.value = true;

  try {
    const res = await getMenuConList(
      store.state.userData.lngStoreGroup,
      store.state.userData.lngPosition,
      clickedCornerCd.value,
      clickedMenuCd.value,
      pcond.value,
      pcond2.value
    );

    rowData3.value = res.data?.List ?? [];
    popupGridMount.value = true;
    await nextTick();
    mst56ApplyPopupStatusCombo();
    mst56SyncPopupGridLayout();
  } catch (error) {}
};

const closePopUp2 = () => {
  popupGridMount.value = false;
  //clickedCornerCd.value = 0;
  clickedMenuNm.value = "";
  pcond.value = "";
  visible.value = false;
};

const updatedrowdata3 = ref([]);
const updatedRowData3 = (e) => {
  updatedrowdata3.value = e;
};
const saveButton2 = async () => {
  const changedRows = mst56CollectChangedMenuRows();
  if (changedRows.length === 0) {
    Swal.fire({
      title: "경고",
      text: "변경된 사항이 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  try {
    const menucds = changedRows
      .map((item) => item.lngMenuCode)
      .join("\u200b");
    const stss = changedRows
      .map((item) => item.lngStkStsType)
      .join("\u200b");
    const res = await saveMenuInfo(
      store.state.userData.lngStoreGroup,
      store.state.userData.lngPosition,
      menucds,
      stss,
      store.state.userData.lngSequence
    );

    if (res.data.RESULT_CD == "00") {
      Swal.fire({
        title: "성공",
        text: "메뉴별 품절처리를 저장하였습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
    } else {
      Swal.fire({
        title: "실패",
        text: "메뉴별 품절처리 저장에 실패하였습니다.",
        icon: "error",
        confirmButtonText: "확인",
      });
    }
    //console.log(res);
  } catch (error) {
  } finally {
    searchButton2();
  }
};

const searchButton3 = async () => {
  try {
    store.state.loading = true;
    const res = await getMenuConList(
      store.state.userData.lngStoreGroup,
      store.state.userData.lngPosition,
      clickedCornerCd.value,
      clickedMenuCd.value,
      pcond.value,
      pcond2.value
    );

    rowData3.value = res.data?.List ?? [];
    store.state.loading = false;
    await nextTick();
    mst56ApplyPopupStatusCombo();
    mst56SyncPopupGridLayout();
  } catch (error) {
  } finally {
    store.state.loading = false;
  }
};
const resetMst56AfterLeftRefresh = () => {
  if (rowData2.value.length > 0) {
    rowData2.value = [];
  }
  if (rowData5.value.length > 0) {
    rowData5.value = [];
  }
  mst56LeftGridSnapshot.value = [];
  mst56RightGridSnapshot.value = [];
  cond2.value = "9";
  cond.value = "";
  clickedRow.value = false;
  clickedCornerCd.value = 0;
  clickedCornerNm.value = MST56_CORNER_HINT;
};

const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
  resetMst56AfterLeftRefresh();
};

const initGrid2 = () => {
  if (rowData2.value.length > 0) {
    rowData2.value = [];
  }
  mst56RightGridSnapshot.value = [];
  cond2.value = "9";
  cond.value = "";
};
const initGrid5 = () => {
  if (rowData5.value.length > 0) {
    rowData5.value = [];
  }
  mst56RightGridSnapshot.value = [];
  cond2.value = "9";
  cond.value = "";
};
const initGrid4 = () => {
  if (rowData4.value.length > 0) {
    rowData4.value = [];
  }
  resetMst56AfterLeftRefresh();
};

//엑셀 버튼 처리 함수
const exportExcel = ref(false);

const updatedrowdata = ref([]);
const updatedRowData = (e) => {
  //console.log(e)
  updatedrowdata.value = e;
};

/** 영업시간 선택(3) — 시작·종료 시분 동일 시 코너명 반환 */
const mst56FindInvalidCornerBusinessHours = (rows) => {
  const list = Array.isArray(rows) ? rows : [];
  for (const item of list) {
    if (String(item?.lngStkType ?? "") !== "3") {
      continue;
    }
    const openHour = String(item?.lngOpenHour ?? "");
    const closeHour = String(item?.lngCloseHour ?? "");
    const openMin = String(item?.lngOpenMin ?? "");
    const closeMin = String(item?.lngCloseMin ?? "");
    if (openHour === closeHour && openMin === closeMin) {
      return item?.strCornerNM ?? item?.strCornerNm ?? "코너";
    }
  }
  return null;
};

/** 판매시간 선택(3) — 시작·종료 시분 동일 시 메뉴명 반환 */
const mst56FindInvalidMenuSalesHours = (rows) => {
  const list = Array.isArray(rows) ? rows : [];
  for (const item of list) {
    if (String(item?.lngStkStsType ?? "") !== "3") {
      continue;
    }
    const openHour = String(item?.lngOpenHour ?? "");
    const closeHour = String(item?.lngCloseHour ?? "");
    const openMin = String(item?.lngOpenMin ?? "");
    const closeMin = String(item?.lngCloseMin ?? "");
    if (openHour === closeHour && openMin === closeMin) {
      return item?.strMenuName ?? item?.strMenuNm ?? "메뉴";
    }
  }
  return null;
};

const updatedrowdata5 = ref([]);
const updatedRowData5 = (e) => {
  //console.log(e)
  updatedrowdata5.value = e;
};
const saveButton = async () => {
  const changedRows = mst56CollectChangedCornerRows();
  if (changedRows.length === 0) {
    Swal.fire({
      title: "경고",
      text: "변경된 사항이 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  const invalidCornerNm = mst56FindInvalidCornerBusinessHours(changedRows);
  if (invalidCornerNm) {
    Swal.fire({
      title: "경고",
      text: `${invalidCornerNm} 코너 영업시간을 확인 해 주십시오.`,
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  try {
    const cornercds = changedRows
      .map((item) => item.lngCornerCD)
      .join("\u200b");
    const stktypes = changedRows
      .map((item) => item.lngStkType)
      .join("\u200b");
    const openhours = changedRows
      .map((item) => item.lngOpenHour)
      .join("\u200b");
    const openmins = changedRows
      .map((item) => item.lngOpenMin)
      .join("\u200b");
    const closehours = changedRows
      .map((item) => item.lngCloseHour)
      .join("\u200b");
    const closemins = changedRows
      .map((item) => item.lngCloseMin)
      .join("\u200b");
    const res = await saveCornerInfoList(
      store.state.userData.lngStoreGroup,
      store.state.userData.lngPosition,
      cornercds,
      stktypes,
      openhours,
      openmins,
      closehours,
      closemins,
      store.state.userData.lngSequence
    );

    if (res.data.RESULT_CD == "00") {
      Swal.fire({
        title: "성공",
        text: "수정하신 영업정보를 저장하였습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
    } else {
      Swal.fire({
        title: "실패",
        text: "수정하신 영업정보 저장에 실패하였습니다.",
        icon: "error",
        confirmButtonText: "확인",
      });
    }
  } catch (error) {
  } finally {
    searchButton();
  }
};

const saveButton4 = async () => {
  const changedRows = mst56CollectChangedMenuRows();
  if (changedRows.length === 0) {
    Swal.fire({
      title: "경고",
      text: "변경된 사항이 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  const invalidMenuNm = mst56FindInvalidMenuSalesHours(changedRows);
  if (invalidMenuNm) {
    Swal.fire({
      title: "경고",
      text: `${invalidMenuNm} 메뉴 판매시간을 확인 해 주십시오.`,
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  try {
    const cornercds = changedRows
      .map((item) => item.lngMenuCode)
      .join("\u200b");
    const stktypes = changedRows
      .map((item) => item.lngStkStsType)
      .join("\u200b");
    const openhours = changedRows
      .map((item) => item.lngOpenHour)
      .join("\u200b");
    const openmins = changedRows
      .map((item) => item.lngOpenMin)
      .join("\u200b");
    const closehours = changedRows
      .map((item) => item.lngCloseHour)
      .join("\u200b");
    const closemins = changedRows
      .map((item) => item.lngCloseMin)
      .join("\u200b");
    const res = await saveCornerInfoList2(
      store.state.userData.lngStoreGroup,
      store.state.userData.lngPosition,
      cornercds,
      stktypes,
      openhours,
      openmins,
      closehours,
      closemins,
      store.state.userData.lngSequence
    );
    //  console.log(res);
    if (res.data.RESULT_CD == "00") {
      await Swal.fire({
        title: "성공",
        text: "수정하신 영업정보를 저장하였습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
    } else {
      await Swal.fire({
        title: "실패",
        text: "수정하신 영업정보 저장에 실패하였습니다.",
        icon: "error",
        confirmButtonText: "확인",
      });
    }
  } catch (error) {
  } finally {
    searchButton5();
  }
};

const updatedrowdata2 = ref([]);
const updatedRowData2 = (e) => {
  updatedrowdata2.value = e;
};
const saveButton3 = async () => {
  if (allstaterow4.value.length == 0) {
    Swal.fire({
      title: "경고",
      text: "변경된 사항이 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  try {
    const menucds = updatedrowdata3.value
      .map((item) => item.lngMenuCode)
      .join("\u200b");
    const stss = updatedrowdata3.value
      .map((item) => item.lngStkStsType)
      .join("\u200b");
    const res = await saveMenuInfo(
      store.state.userData.lngStoreGroup,
      store.state.userData.lngPosition,
      menucds,
      stss,
      store.state.userData.lngSequence
    );

    if (res.data.RESULT_CD == "00") {
      Swal.fire({
        title: "성공",
        text: "선택메뉴별 품절처리를 저장하였습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
    } else {
      Swal.fire({
        title: "실패",
        text: "선택메뉴별 품절처리 저장에 실패하였습니다.",
        icon: "error",
        confirmButtonText: "확인",
      });
    }
    //console.log(res);
  } catch (error) {}
};

const searchSoldOut2 = async () => {
  await searchButton3();
};
</script>

<style scoped>
.mst56-body {
  display: flex;
  min-height: 0;
  flex-direction: column;
}

.mst56-main-grid {
  width: 100%;
  flex: 1 1 auto;
  min-height: 0;
  height: 100%;
}


.mst56-left-split {
  display: flex;
  flex: 1 1 auto;
  width: 100%;
  min-height: 0;
  height: 100%;
  overflow: hidden;
}


.mst56-left-grid-host {
  position: relative;
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-height: 0;
  min-width: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.mst56-left-grid-host :deep(.realgrid) {
  width: 100% !important;
  flex: 1 1 auto;
  height: 100% !important;
  min-height: 0;
}

.mst56-grid-host {
  position: relative;
  display: flex;
  min-height: 0;
  flex: 1 1 auto;
  flex-direction: column;
  overflow: hidden;
}

.mst56-grid-host :deep(.realgrid) {
  flex: 1 1 auto;
  min-height: 0;
  height: 100% !important;
}

.mst56-panel {
  display: flex;
  min-height: 0;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  background: #fff;
}

.mst56-panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-shrink: 0;
  padding: 0.625rem 1rem;
  background-color: #fff;
  border-bottom: 1px solid #e5e7eb;
}

.mst56-panel-title {
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.25;
  color: #545876;
}

.mst56-panel-body {
  display: flex;
  min-height: 0;
  flex: 1 1 auto;
  flex-direction: column;
  height: 100%;
  padding: 0.5rem;
  overflow: hidden;
}

.mst56-panel-body :deep(.rg-body-cell),
.mst56-panel-body :deep(.rg-data-cell) {
  vertical-align: middle !important;
}

.mst56-panel-head .mst56-toolbar-btn {
  height: 2rem;
  min-width: auto;
  padding: 0 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  background-color: #545876;
  color: #fff;
  border: none;
  border-radius: 0.375rem;
}

.mst56-panel-head .mst56-toolbar-btn::before {
  content: "";
  width: 1.125rem;
  height: 1.125rem;
  margin-right: 0.25rem;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}

.mst56-panel-head .mst56-toolbar-btn--refresh::before {
  background-image: url("@/assets/images/button/refresh_w.svg");
}

.mst56-panel-head .mst56-toolbar-btn--search::before {
  background-image: url("@/assets/ic_search_fff.svg");
}

.mst56-panel-head .mst56-toolbar-btn--save::before {
  background-image: url("@/assets/ic_save.svg");
}

.mst56-panel-head .mst56-toolbar-btn:disabled {
  background-color: #d1d5db;
  color: #9ca3af;
  cursor: not-allowed;
}

.mst56-panel-head .mst56-toolbar-btn:disabled::before {
  opacity: 0.65;
}

.mst56-popup-dialog .mst56-toolbar-btn {
  height: 2rem;
  min-width: auto;
  padding: 0 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  background-color: #545876;
  color: #fff;
  border: none;
  border-radius: 0.375rem;
}

.mst56-popup-dialog .mst56-toolbar-btn::before {
  content: "";
  width: 1.125rem;
  height: 1.125rem;
  margin-right: 0.25rem;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}

.mst56-popup-dialog .mst56-toolbar-btn--search::before {
  background-image: url("@/assets/ic_search_fff.svg");
}

.mst56-popup-dialog .mst56-toolbar-btn--save::before {
  background-image: url("@/assets/ic_save.svg");
}

.mst56-popup-dialog .mst56-toolbar-btn--close::before {
  background-image: url("@/assets/images/ico_close.svg");
  filter: brightness(0) invert(1);
}

.mst56-search-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.85fr) minmax(0, 1fr);
  gap: 0.75rem 1.25rem;
  align-items: center;
}

.mst56-search-panel--popup .mst56-search-grid {
  grid-template-columns: minmax(0, 1fr) minmax(0, 0.85fr);
}

.mst56-cell {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: var(--mst56-item-gap);
}

.mst56-cell--corner {
  justify-content: center;
}

.mst56-sg-label {
  flex: 0 0 var(--mst56-label-col);
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.25;
  color: #111827;
  white-space: nowrap;
}

.mst56-cell-field {
  min-width: 0;
  flex: 1 1 auto;
}

.mst56-corner-name {
  width: 100%;
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.25;
  color: #ef4444;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mst56-search-panel .mst56-sg-input,
.mst56-search-panel .mst56-sg-select {
  box-sizing: border-box;
  border-color: var(--mst56-control-border) !important;
}

.mst56-search-panel .mst56-sg-input:focus,
.mst56-search-panel .mst56-sg-select:focus {
  border-color: #3b82f6 !important;
}

.mst56-status-cap > .mst56-sg-select {
  max-width: 10rem;
}

@media (max-width: 1024px) {
  .mst56-search-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .mst56-cell--corner {
    justify-content: center;
  }

  .mst56-corner-name {
    text-align: center;
  }
}

.mst56-popup-backdrop {
  pointer-events: auto;
}

.mst56-popup-dialog {
  pointer-events: auto;
  overflow: visible !important;
}

.mst56-popup-grid-host {
  position: relative;
  display: flex;
  flex: 1 1 0;
  min-height: 0;
  height: 0;
  overflow: hidden;
  flex-direction: column;
  z-index: 1;
}

.mst56-popup-grid-host :deep(.realgrid) {
  width: 100% !important;
  flex: 1 1 auto;
  min-height: 0;
  height: 100% !important;
}

.mst56-popup-grid-host :deep(.rg-body-cell),
.mst56-popup-grid-host :deep(.rg-data-cell) {
  vertical-align: middle !important;
}

/* RealGrid 드롭다운 — Teleport 모달 안에서 잘리지 않도록 */
body.mst56-popup-active .mst56-popup-backdrop,
body.mst56-popup-active .mst56-popup-dialog,
body.mst56-popup-active .mst56-popup-grid-host {
  overflow: visible !important;
}

/* RealGrid 실제 클래스명: .rg-dropdownlist (하이픈 없음) */
body.mst56-popup-active .rg-dropdownlist,
body.mst56-popup-active [class*="rg-dropdown-list"] {
  z-index: 10050 !important;
  pointer-events: auto !important;
}

body.mst56-popup-active .rg-dropdown-item {
  pointer-events: auto !important;
}
</style>
