<!-- /*--############################################################################
# Filename : PUR01_010RPT.vue                                                  
# Description : 구매관리2 > 매장간 재고이동 관리 > 매장/파트간 출고 등록                      
# Date :2025-09-23                                                             
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <!-- 조회 패널(pur235/pur803) 가로·콤보 너비 등은 확정. 별도 요청 없으면 변경하지 말 것. -->
  <!-- 조회 + 그리드: 탭 영역 내 flex-1로 높이 채움 -->
  <div class="flex h-full min-h-0 flex-col" @click="handleParentClick">
    <div
      class="flex shrink-0 justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center mr-9 space-x-2 pr-5">
        <button @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <button @click="addButton" class="button new w-auto">신규</button>
        <button @click="deleteButton" class="button delete w-auto">삭제</button>
        <button @click="excelButton" class="button save w-auto excel">
          엑셀
        </button>
      </div>
    </div>
    <div
      class="pur235-search-panel pur803-search-shrink z-10 mt-3 w-full min-h-0 shrink-0 overflow-x-auto rounded-lg bg-gray-200 px-8 py-3 md:px-12">
      <div
        class="pur235-wire-grid pur803-wire-grid min-w-0"
        :style="{
          '--pur235-control-border': pur235ControlBorder,
          '--pur235-col-gutter': pur235ColGutter,
          '--pur235-row-gap': pur235RowGap,
          '--pur235-label-col': pur235LabelCol,
        }">
        <div class="pur235-wire-cell min-w-0">
          <div class="pur235-wire-label">보낸 매장/파트</div>
          <div class="pur235-wire-field min-w-0">
            <div class="pur803-store-part-pair">
              <div class="pur235-pick-slot pur803-pick-in-pair min-h-0 min-w-0">
                <PickStore
                  compact-search-bar
                  @update:storeGroup="lngStoreGroup"
                  :default-store-nm="'전체'"
                  :main-name="'보낸 매장/파트'"
                  :default-store="true"
                  @store-nm="excelStore"
                  :hide-attr="false"
                  :hide-group="false"
                  @update:store-cd="lngStoreCode" />
              </div>
              <span class="pur803-store-slash" aria-hidden="true">/</span>
              <select
                id="pur08-003-from-part"
                v-model="cond"
                :disabled="partFromDisabled"
                class="pur235-sg-select pur803-part-in-pair h-8 min-w-0 rounded-md border border-solid bg-white px-1.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500">
                <option
                  v-for="i in optionList"
                  :key="i.lngPartCode"
                  :value="i.lngPartCode">
                  {{ i.strPartName }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="pur235-wire-cell min-w-0">
          <div class="pur235-wire-label">받는 매장/파트</div>
          <div class="pur235-wire-field min-w-0">
            <div class="pur803-store-part-pair">
              <div class="pur235-pick-slot pur803-pick-in-pair min-h-0 min-w-0">
                <PickStore
                  compact-search-bar
                  unlock-store-combo-only
                  :default-store-nm="'전체'"
                  :default-store="true"
                  :main-name="'받는 매장/파트'"
                  @store-nm="excelStore"
                  :hide-attr="false"
                  :hide-group="false"
                  @update:store-cd="lngStoreCode2" />
              </div>
              <span class="pur803-store-slash" aria-hidden="true">/</span>
              <select
                id="pur08-003-to-part"
                v-model="cond2"
                :disabled="partToDisabled"
                class="pur235-sg-select pur803-part-in-pair h-8 min-w-0 rounded-md border border-solid bg-white px-1.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500">
                <option
                  v-for="i in optionList3"
                  :key="i.lngPartCode"
                  :value="i.lngPartCode">
                  {{ i.strPartName }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="pur235-wire-cell min-w-0">
          <div class="pur235-wire-label">이동기간</div>
          <div class="pur235-wire-field pur235-date-slot min-w-0 overflow-hidden">
            <Datepicker2
              ref="datepicker"
              omit-main-label
              filter-bar-align
              :main-name="'이동기간'"
              @end-date="endDate"
              :close-pop-up="closePopUp"
              @excel-date="excelDate"
              @start-date="startDate" />
          </div>
        </div>
        <div class="pur235-wire-cell min-w-0">
          <div class="pur235-wire-label">확정여부</div>
          <div class="pur235-wire-field min-w-0">
            <div class="pur803-confirm-row">
              <select
                id="pur08-003-confirm"
                v-model="cond3"
                class="pur235-sg-select pur803-confirm-select h-8 w-full min-w-0 rounded-md border border-solid bg-white px-1.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <!-- COND = getStoreMoveListBypart lngOption: 9 전체, 0 미확정, 1 확정 (공통코드 24 미사용) -->
                <option value="9">전체</option>
                <option value="0">미확정</option>
                <option value="1">확정</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-2 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <div class="relative h-full min-h-0 min-w-0 flex-1">
        <Realgrid
          :progname="'PUR08_003INS_VUE'"
          :progid="1"
          :rowData="rowData"
          :documentTitle="'PUR08_003INS'"
          @updatedRowData="updatedRowData"
          :checkRenderEditable="true"
          :checkRowAuto="false"
          :checkRowAuto2="true"
          :checkRowAuto2Col="'Selected'"
          :headerCheckBar="'Selected'"
          :checkAbleExpressionCol="'Selected'"
          :checkAbleExpressionCol2="'strConfirm'"
          :checkAbleExpressionVal="'확정'"
          :checkAbleExpressionCol3="'strConfirm'"
          :checkAbleExpressionVal2="'미확정'"
          :documentSubTitle="documentSubTitle"
          :rowStateeditable="false"
          :exporttoExcel="exportExcel">
        </Realgrid>
      </div>
    </div>
  </div>
  <!-- 오버레이 -->
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    v-if="open">
    <div
      :key="pur803NewPopupKey"
      class="pur803-newpop-shell flex h-[min(88vh,56rem)] max-h-[92vh] min-h-0 w-[min(92vw,72rem)] flex-col rounded-lg bg-white p-5 shadow-lg"
      @click.stop>
      <div
        class="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-3">
        <h2 class="shrink-0 text-xl font-bold text-gray-900">매장간 출고 신규 등록</h2>
        <div class="flex shrink-0 flex-wrap gap-2">
          <button
            type="button"
            class="shrink-0 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            @click="saveButton">
            출고
          </button>
          <button
            type="button"
            class="shrink-0 rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
            @click="onPur803NewPopupClose">
            닫기
          </button>
        </div>
      </div>

      <!-- 매장/파트·일자·거래처: 스크롤 밖 고정 — 하단 Realgrid 페인트·히트 영역과 분리 -->
      <div class="pur803-newpop-master-strip mt-3 shrink-0">
        <div class="pur803-newpop-master-wrap shrink-0 border border-slate-500 bg-white shadow-sm">
        <div
          class="pur803-newpop-master-grid grid grid-cols-[6.75rem_1fr_6.75rem_1fr] text-sm leading-tight text-gray-900">
          <div
            class="pur803-newpop-lbl-master flex items-center justify-center border-b border-r border-slate-400 px-1.5 py-2 font-semibold">
            보내는 매장/파트
          </div>
          <div
            class="pur803-newpop-fld pur803-newpop-store-part-row flex min-w-0 gap-1.5 border-b border-r border-slate-400 bg-white px-2 py-1.5">
            <div class="pur803-newpop-pick pur803-newpop-store-slot min-w-0">
              <PickStore
                :compactSearchBar="true"
                :compactStoreComboMaxRem="20"
                :defaultStoreNm="'전체'"
                :defaultStore="true"
                :mainName="''"
                :hideAttr="false"
                :hideGroup="false"
                :disabledAll="disabled"
                :setDynamicStoreClass="'!h-7 !min-h-[1.75rem] !w-full !min-w-0 !p-0 !rounded-md !border !border-slate-300 !text-sm !shadow-none'"
                :setDynamicStoreClass2="'!ml-0 !mt-0 !gap-0'"
                @update:storeCd="lngStoreCode3"></PickStore>
            </div>
            <span class="shrink-0 px-0.5 text-base font-semibold text-gray-600">/</span>
            <select
              class="pur803-newpop-select pur803-newpop-part-slot h-7 shrink-0 rounded-md border border-slate-300 px-1.5 text-sm disabled:bg-[#e8e8e8]"
              :disabled="disabled"
              v-model="scond">
              <option :value="i.lngPartCode" v-for="i in optionList4" :key="i.lngPartCode">
                {{ i.strPartName }}
              </option>
            </select>
          </div>
          <div
            class="pur803-newpop-lbl-master flex items-center justify-center border-b border-r border-slate-400 px-1.5 py-2 font-semibold">
            받는 매장/파트
          </div>
          <div
            class="pur803-newpop-fld pur803-newpop-store-part-row flex min-w-0 gap-1.5 border-b border-slate-400 bg-white px-2 py-1.5">
            <div class="pur803-newpop-pick pur803-newpop-store-slot min-w-0">
              <PickStore
                :compactSearchBar="true"
                :compactStoreComboMaxRem="20"
                :unlockStoreComboOnly="true"
                :defaultStoreNm="'전체'"
                :defaultStore="true"
                :mainName="''"
                :hideAttr="false"
                :hideGroup="false"
                :disabledAll="disabled"
                :setDynamicStoreClass="'!h-7 !min-h-[1.75rem] !w-full !min-w-0 !p-0 !rounded-md !border !border-slate-300 !text-sm !shadow-none'"
                :setDynamicStoreClass2="'!ml-0 !mt-0 !gap-0'"
                @update:storeCd="lngStoreCode4"></PickStore>
            </div>
            <span class="shrink-0 px-0.5 text-base font-semibold text-gray-600">/</span>
            <select
              class="pur803-newpop-select pur803-newpop-part-slot h-7 shrink-0 rounded-md border border-slate-300 px-1.5 text-sm disabled:bg-[#e8e8e8]"
              :disabled="disabled"
              v-model="scond2">
              <option :value="i.lngPartCode" v-for="i in optionList5" :key="i.lngPartCode">
                {{ i.strPartName }}
              </option>
            </select>
          </div>
          <div
            class="pur803-newpop-lbl-master flex items-center justify-center border-b border-r border-slate-400 px-1.5 py-2 font-semibold">
            이동 일자
          </div>
          <div
            class="pur803-newpop-fld flex items-center justify-start border-b border-r border-slate-400 bg-white px-2 py-1.5">
            <input
              type="date"
              :disabled="disabled"
              class="pur803-newpop-input h-7 w-[10.5rem] shrink-0 rounded-md border border-slate-300 px-1.5 text-sm disabled:bg-[#e8e8e8]"
              v-model="scond3" />
          </div>
          <div
            class="pur803-newpop-lbl-master flex items-center justify-center border-b border-r border-slate-400 px-1.5 py-2 font-semibold">
            거래처
          </div>
          <div
            class="pur803-newpop-fld flex min-w-0 items-center border-b border-slate-400 bg-white px-2 py-1.5">
            <BusinessClient
              :defaultName="''"
              :defaultNm="'전체'"
              :toolbarStretch="true"
              :setDynamicClass="'!h-7 !min-w-0 !w-full !max-w-none shrink border border-slate-300 px-2 text-sm'"
              :setDynamicClass2="'!mt-0 !items-center !gap-0 min-w-0 w-full [&>div:first-child]:hidden'"
              @SupplierId="SupplierId"></BusinessClient>
          </div>
        </div>
        </div>
      </div>

      <!-- 자재 입력만 세로 스크롤 (매장 블록과 분리) -->
      <div
        class="pur803-newpop-upper-scroll mt-2 min-h-0 max-h-[min(36vh,20rem)] shrink-0 overflow-y-auto overflow-x-hidden">
        <div class="pur803-newpop-formwrap flex min-h-0 shrink-0 flex-col gap-0">
        <div class="pur803-newpop-midrule shrink-0 bg-slate-50 px-0.5 py-2.5" aria-hidden="true">
          <div class="h-0 border-t-2 border-slate-500 shadow-sm"></div>
        </div>

        <div
          class="pur803-newpop-detail-wrap shrink-0 border border-slate-500 bg-white shadow-sm">
        <div
          class="pur803-newpop-detail grid grid-cols-[6.75rem_minmax(0,1fr)_6.75rem_minmax(0,1.02fr)_8.5rem_minmax(0,1.12fr)] text-sm leading-tight text-gray-900">
          <div
            class="pur803-newpop-lbl-detail flex items-center justify-center border-r border-b border-slate-400 px-1.5 py-2 font-semibold">
            자재검색
          </div>
          <div
            class="pur803-newpop-fld flex min-w-0 items-center gap-2 border-r border-b border-slate-400 bg-white px-2 py-1.5">
            <input
              ref="pur803InputScond4"
              type="text"
              class="pur803-newpop-input h-7 min-w-0 flex-1 border border-slate-300 px-1.5 text-sm"
              v-model="scond4"
              @keydown.enter.prevent="searchButton2" />
            <button type="button" :class="pur803NewPopBtnClass" @click="searchButton2">
              조회
            </button>
          </div>
          <div
            class="pur803-newpop-lbl-detail flex items-center justify-center border-r border-b border-slate-400 px-1.5 py-2 font-semibold">
            자재명
          </div>
          <div
            class="pur803-newpop-fld flex min-w-0 items-center border-r border-b border-slate-400 bg-white px-2 py-1.5">
            <input
              type="text"
              class="pur803-newpop-input pur803-newpop-input-readonly h-7 w-full min-w-0 border border-slate-300 px-1.5 text-sm"
              v-model="scond5"
              disabled />
          </div>
          <div
            class="pur803-newpop-lbl-detail flex items-center justify-center whitespace-nowrap border-r border-b border-slate-400 px-1.5 py-2 text-center text-[13px] font-semibold leading-tight">
            단위(반품/이동단위)
          </div>
          <div
            class="pur803-newpop-fld flex min-w-0 items-center border-b border-slate-400 bg-white px-2 py-1.5">
            <input
              type="text"
              v-model="scond6"
              class="pur803-newpop-input pur803-newpop-input-readonly h-7 w-full min-w-0 border border-slate-300 px-1.5 text-sm"
              disabled />
          </div>

          <div
            class="pur803-newpop-lbl-detail flex items-center justify-center border-r border-b border-slate-400 px-1.5 py-2 font-semibold">
            매입단가
          </div>
          <div
            class="pur803-newpop-fld flex min-w-0 items-center border-r border-b border-slate-400 bg-white px-2 py-1.5">
            <input
              ref="pur803InputScond7"
              type="text"
              name="scond7"
              class="pur803-newpop-input h-7 w-full max-w-[11rem] border border-slate-300 px-1.5 text-sm"
              @input="onlyNumber2"
              @keydown.enter.prevent="pur803OnAmountEnter"
              v-model="scond7" />
          </div>
          <div
            class="pur803-newpop-lbl-detail flex items-center justify-center border-r border-b border-slate-400 px-1.5 py-2 font-semibold">
            이동수량
          </div>
          <div
            class="pur803-newpop-fld flex min-w-0 items-center border-r border-b border-slate-400 bg-white px-2 py-1.5">
            <input
              ref="pur803InputScond8"
              type="text"
              name="scond8"
              class="pur803-newpop-input h-7 w-full min-w-0 border border-slate-300 px-1.5 text-sm"
              @input="onlyNumber"
              @keydown.enter.prevent="pur803OnAmountEnter"
              v-model="scond8" />
          </div>
          <div
            class="col-span-2 min-h-[2.25rem] border-b border-l border-r-0 border-slate-400 bg-white box-border"
            aria-hidden="true"></div>

          <div
            class="pur803-newpop-lbl-detail flex items-center justify-center border-r border-b border-slate-400 px-1.5 py-2 font-semibold">
            공급가
          </div>
          <div
            class="pur803-newpop-fld flex min-w-0 items-center border-r border-b border-slate-400 bg-white px-2 py-1.5">
            <input
              ref="pur803InputScond9"
              type="text"
              name="scond9"
              class="pur803-newpop-input h-7 w-full max-w-[11rem] border border-slate-300 px-1.5 text-sm"
              @input="onlyNumber2"
              @keydown.enter.prevent="pur803OnAmountEnter"
              v-model="scond9" />
          </div>
          <div
            class="pur803-newpop-lbl-detail flex items-center justify-center border-r border-b border-slate-400 px-1.5 py-2 font-semibold">
            부가세
          </div>
          <div
            class="pur803-newpop-fld flex min-w-0 items-center border-r border-b border-slate-400 bg-white px-2 py-1.5">
            <input
              ref="pur803InputScond10"
              type="text"
              name="scond10"
              class="pur803-newpop-input h-7 w-full min-w-0 border border-slate-300 px-1.5 text-sm"
              @input="onlyNumber2"
              @keydown.enter.prevent="pur803OnAmountEnter"
              v-model="scond10" />
          </div>
          <div
            class="pur803-newpop-lbl-detail flex items-center justify-center border-r border-b border-slate-400 px-1.5 py-2 font-semibold">
            합계금액
          </div>
          <div
            class="pur803-newpop-fld flex min-w-0 items-center gap-2 border-b border-slate-400 bg-white px-2 py-1.5">
            <input
              ref="pur803InputScond11"
              type="text"
              name="scond11"
              class="pur803-newpop-input h-7 min-w-0 flex-1 border border-slate-300 px-1.5 text-sm"
              @input="onlyNumber2"
              @keydown.enter.prevent="pur803OnAmountEnter"
              v-model="scond11" />
            <button
              ref="pur803BtnAddRow"
              type="button"
              :class="pur803NewPopBtnAddClass"
              @click="addRowData3"
              @keydown.enter.prevent="addRowData3">
              추가
            </button>
          </div>
        </div>
        </div>
      </div>
      </div>

      <div
        class="pur803-newpop-grid-gap mt-2 flex min-h-0 flex-1 flex-col overflow-hidden border-t-2 border-slate-500 pt-3">
        <div class="pur803-newpop-grid-host h-full min-h-0 w-full flex-1 basis-0 overflow-hidden">
          <Realgrid
            :progname="'PUR08_003INS_VUE'"
            :progid="2"
            :rowData="rowData3"
            :setStateBar="false"
            :suppressEdit="true"
            @updatedRowData="onDetailGridUpdatedRowData"
            @dblclickedRowData="pur803OnDetailGridDblClicked"></Realgrid>
        </div>
        <p
          class="shrink-0 px-1 pt-2 text-left text-sm font-bold leading-snug text-red-600">
          ※삭제 할 자재품목을 더블클릭 하시면 삭제가 가능합니다.
        </p>
      </div>

      <div
        class="fixed inset-0 z-[60] flex items-center justify-center bg-black/50"
        v-if="open2">
        <div
          class="flex h-[min(88vh,36rem)] w-[min(92vw,40rem)] flex-col border border-slate-300 bg-white p-2 shadow-lg">
          <p
            v-if="stockListPopupNoData"
            class="shrink-0 px-2 pb-2 text-center text-sm font-semibold text-red-600">
            조회 조건의 자재가 존재하지 않습니다.
          </p>
          <div class="flex shrink-0 justify-end pb-2">
            <button type="button" :class="pur803NewPopBtnClass" @click="closeStockListPopup">
              닫기
            </button>
          </div>
          <div class="min-h-0 flex-1">
            <Realgrid
              :progname="'PUR08_003INS_VUE'"
              :progid="3"
              :setStateBar="false"
              enter-key-emits-dbl-clicked
              :move-focusby-index="stockListMoveFocus"
              @dblclickedRowData="clickedRowData"
              :rowData="rowData2"></Realgrid>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 그리드 영역 -->
</template>

<script setup>
import {
  deleteStoreMoveListbyPart,
  getStockListByPart,
  getStoreMoveListBypart,
  saveMoveStorePartList,
} from "@/api/mipur";
import { getLossMasterPartList } from "@/api/mistock";
import BusinessClient from "@/components/businessClient.vue";
import Datepicker2 from "@/components/Datepicker2.vue";
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

import { formatLocalDate, insertPageLog } from "@/customFunc/customFunc";
import Swal from "sweetalert2";
/**
 *  경고창 호출 라이브러리
 *  */

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

onMounted(async () => {
  await insertPageLog(store.state.activeTab2);
});

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

const cond = ref("0");
const cond2 = ref(0);
/** 확정여부 → 조회 API COND(lngOption): 9 전체, 0 미확정, 1 확정 */
const cond3 = ref(9);
const cond4 = ref("");
const cond5 = ref(0);
const store = useStore();

/** 조회 AREA — PUR02_035 등과 동일 pur235 와이어 토큰 */
const pur235ControlBorder = "#cbd5e1";
const pur235ColGutter = "1.125rem";
const pur235RowGap = "0.875rem";
const pur235LabelCol = "8.75rem";

/** 신규 등록 팝업 [조회] — 발주 whitebutton 톤, 높이는 입력(h-7)과 맞춤 */
const pur803NewPopBtnClass =
  "whitebutton !h-7 !min-h-[1.75rem] !px-3 !py-0 !text-sm !font-semibold !leading-none !border-slate-400 !text-gray-700 hover:!bg-blue-50 hover:!border-blue-400 disabled:opacity-50 disabled:pointer-events-none";

/** [추가] — 파란 테두리, 동일 높이 */
const pur803NewPopBtnAddClass =
  "whitebutton !h-7 !min-h-[1.75rem] !px-3 !py-0 !text-sm !font-semibold !leading-none !border-blue-500 !text-gray-700 hover:!bg-blue-50 hover:!border-blue-600 disabled:opacity-50 disabled:pointer-events-none";

const datepicker = ref(null);
const closePopUp = ref(false);
const optionList = ref([]);
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

const sDate = ref();
const eDate = ref();
const startDate = (e) => {
  initGrid();
  sDate.value = e;
};
const endDate = (e) => {
  initGrid();
  eDate.value = e;
};

const selectedDate = ref();
const excelDate = (e) => {
  selectedDate.value = e;
};
const optionList3 = ref([]);
const optionList4 = ref([]);
const optionList5 = ref([]);

/** PickStore `전체` → storeCd 0/`0` — 파트 콤보 비활성 */
const isWholeStore = (storeCd) => {
  if (storeCd === undefined || storeCd === null) return true;
  const s = String(storeCd).trim();
  return s === "" || s === "0";
};

const storeCode = ref();
const partFromDisabled = computed(() => isWholeStore(storeCode.value));
const lngStoreCode = async (e) => {
  initGrid();
  storeCode.value = e;
  if (isWholeStore(e)) {
    try {
      const res2 = await getLossMasterPartList(
        store.state.userData.lngStoreGroup,
        "0"
      );
      const list = res2?.data?.List;
      if (Array.isArray(list) && list.length > 0) {
        optionList.value = list;
      }
    } catch {
      /* 기존 optionList 유지 */
    }
    cond.value = "0";
    return;
  }
  const res2 = await getLossMasterPartList(
    store.state.userData.lngStoreGroup,
    storeCode.value
  );

  optionList.value = res2.data.List;
};
const storeCode2 = ref();
const partToDisabled = computed(() => isWholeStore(storeCode2.value));
const lngStoreCode2 = async (e) => {
  initGrid();
  storeCode2.value = e;
  if (isWholeStore(e)) {
    try {
      const res2 = await getLossMasterPartList(
        store.state.userData.lngStoreGroup,
        "0"
      );
      const list = res2?.data?.List;
      if (Array.isArray(list) && list.length > 0) {
        optionList3.value = list;
      }
    } catch {
      /* 기존 optionList3 유지 */
    }
    cond2.value = 0;
    return;
  }
  const res2 = await getLossMasterPartList(
    store.state.userData.lngStoreGroup,
    storeCode2.value
  );

  optionList3.value = res2.data.List;
};

const storeCode3 = ref();
const lngStoreCode3 = async (e) => {
  storeCode3.value = e;

  const res2 = await getLossMasterPartList(
    store.state.userData.lngStoreGroup,
    storeCode3.value
  );

  optionList4.value = res2.data.List;
  scond.value = 0;
};

const storeCode4 = ref();
const lngStoreCode4 = async (e) => {
  storeCode4.value = e;

  const res2 = await getLossMasterPartList(
    store.state.userData.lngStoreGroup,
    storeCode4.value
  );

  optionList5.value = res2.data.List;
  scond2.value = 0;
};

const groupCd = ref();
const lngStoreGroup = (e) => {
  groupCd.value = e;
};

/**
 *  조회 함수
 */
const hideColumnsId = ref([]);
const searchButton = async () => {
  try {
    store.state.loading = true;
    initGrid();

    const res = await getStoreMoveListBypart(
      groupCd.value,
      storeCode.value,
      cond.value,
      storeCode2.value,
      cond2.value,
      sDate.value.replaceAll("-", ""),
      eDate.value.replaceAll("-", ""),
      cond3.value
    );

    rowData.value = res.data.List;
    console.log(res);
    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    //comsole.log(error);
  } finally {
    store.state.loading = false;
  }
};

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
};

//엑셀 버튼 처리 함수
const exportExcel = ref(false);
/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  documentSubTitle.value =
    selectedDate.value + "\n" + "매장명 :" + selectedExcelStore.value;
  exportExcel.value = !exportExcel.value;
};

// 엑셀 추출
const documentSubTitle = ref("");
const selectedExcelList = ref("");

const selectedExcelStore = ref("");
/**
 * 엑셀용 매장 세팅 함수
 */

const excelStore = (e) => {
  selectedExcelStore.value = e;
  //comsole.log(e);
};
const excelList = (e) => {
  selectedExcelList.value = e;
  //comsole.log(e);
};

const updatedrowdata = ref([]);
const updatedRowData = (e) => {
  console.log(e);
  updatedrowdata.value = e;
};

const open = ref(false);
/** append-to-body 매장 콤보: 전역 style에서 .vs__dropdown-menu z-index:40 → 모달 fixed z-50 뒤로 깔림. 팝업 열릴 때만 body 플래그로 올림 */
const PUR803_NEWPOP_BODY_CLASS = "pur803-newpop-active";

watch(open, (isOpen) => {
  if (typeof document === "undefined") return;
  document.body.classList.toggle(PUR803_NEWPOP_BODY_CLASS, !!isOpen);
});

onUnmounted(() => {
  if (typeof document !== "undefined") {
    document.body.classList.remove(PUR803_NEWPOP_BODY_CLASS);
  }
});
/** 팝업 내부 PickStore 등 완전 초기화용 remount 키 */
const pur803NewPopupKey = ref(0);
const open2 = ref(false);
/** 자재 조회 팝업: 검색 결과 0건일 때 상단 붉은 안내 */
const stockListPopupNoData = ref(false);

const closeStockListPopup = () => {
  open2.value = false;
  stockListPopupNoData.value = false;
  stockListMoveFocus.value = -1;
};

/** 신규 등록 팝업: 하단 그리드·입력·매장/파트 선택 등 초기화 (닫기·재오픈·저장 후 공통) */
const resetPur803NewPopup = async () => {
  closeStockListPopup();
  pur803SaveLines.value = [];
  rowData3.value = [];
  updatedrowdata2.value = [];
  disabled.value = false;
  scond4.value = "";
  scond5.value = "";
  scond6.value = "";
  scond7.value = "";
  scond8.value = "";
  scond9.value = "";
  scond10.value = "";
  scond11.value = "";
  scond.value = 0;
  scond2.value = 0;
  supplierid.value = "0";
  tempRowData2.value = [];
  tempTaxType.value = "01";
  rowData2.value = [];
  storeCode3.value = "0";
  storeCode4.value = "0";
  pur803NewPopupKey.value += 1;
  try {
    const res2 = await getLossMasterPartList(
      store.state.userData.lngStoreGroup,
      "0"
    );
    const list = res2?.data?.List;
    if (Array.isArray(list)) {
      optionList4.value = list;
      optionList5.value = list;
    }
  } catch (_) {
    /* 파트 목록 실패 시 기존 optionList 유지 */
  }
};

const onPur803NewPopupClose = async () => {
  await resetPur803NewPopup();
  open.value = false;
};

const addButton = async () => {
  await resetPur803NewPopup();
  scond3.value = formatLocalDate(new Date());
  open.value = true;
};

const searchButton2 = async () => {
  if (storeCode3.value == "0") {
    Swal.fire({
      title: "경고",
      text: "보내는 매장을 선택해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }

  if (scond.value == "0") {
    Swal.fire({
      title: "경고",
      text: "보내는 매장의 파트를 선택해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }

  if (storeCode4.value == "0") {
    Swal.fire({
      title: "경고",
      text: "받는 매장을 선택해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }

  if (scond2.value == "0") {
    Swal.fire({
      title: "경고",
      text: "받는 매장의 파트를 선택해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }

  if (storeCode3.value == storeCode4.value && scond.value == scond2.value) {
    Swal.fire({
      title: "경고",
      text: "보내는 매장과 받는 매장이 같습니다. 확인해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }

  try {
    store.state.loading = true;
    const res = await getStockListByPart(
      groupCd.value,
      storeCode3.value,
      scond.value,
      supplierid.value,
      scond3.value.replaceAll("-", ""),
      scond4.value
    );

    console.log(res);

    const rawList = res.data?.List;
    const list = Array.isArray(rawList) ? rawList : [];
    rowData2.value = list;
    stockListPopupNoData.value = list.length === 0;
    open2.value = true;
    await nextTick();
    await nextTick();
    if (list.length > 0) {
      stockListMoveFocus.value = -1;
      await nextTick();
      setTimeout(() => {
        stockListMoveFocus.value = 0;
      }, 100);
    } else {
      stockListMoveFocus.value = -1;
    }
  } catch (error) {
    console.error("[PUR08_003INS] searchButton2", error);
  } finally {
    store.state.loading = false;
  }
};

const rowData2 = ref([]);
/** 자재 조회 그리드: 조회 후 첫 행 포커스용 (-1 이면 무시) */
const stockListMoveFocus = ref(-1);
const scond = ref(0);
const scond2 = ref(0);
const supplierid = ref("0");
const scond3 = ref("");
const scond4 = ref("");
const scond5 = ref("");
const scond6 = ref("");
const scond7 = ref("");
const scond8 = ref("");
const scond9 = ref("");
const scond10 = ref("");
const scond11 = ref("");
const SupplierId = (e) => {
  supplierid.value = e;
};

const pur803InputScond4 = ref(null);
const pur803InputScond7 = ref(null);
const pur803InputScond8 = ref(null);
const pur803InputScond9 = ref(null);
const pur803InputScond10 = ref(null);
const pur803InputScond11 = ref(null);
const pur803BtnAddRow = ref(null);

/** 숫자·소수점(.)만 허용, 콤마 제거 */
const pur803SanitizeDecimal = (raw) => {
  const s = String(raw ?? "").replace(/,/g, "").replace(/[^0-9.]/g, "");
  let out = "";
  let dot = false;
  for (const ch of s) {
    if (ch >= "0" && ch <= "9") out += ch;
    else if (ch === "." && !dot) {
      out += ".";
      dot = true;
    }
  }
  return out;
};

const pur803FmtDecimal = (san) => {
  if (san === "" || san === undefined || san === null) return "";
  if (san === ".") return ".";
  if (san.endsWith(".")) {
    const base = san.slice(0, -1);
    if (base === "") return ".";
    const n = Number(base);
    if (Number.isNaN(n)) return san;
    return (
      new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 10 }).format(n) +
      "."
    );
  }
  const n = Number(san);
  if (Number.isNaN(n)) return "";
  return new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 10 }).format(n);
};

const pur803ParseFloat = (s) => {
  const san = pur803SanitizeDecimal(String(s ?? "").replace(/,/g, ""));
  if (san === "" || san === ".") return 0;
  const n = Number(san);
  return Number.isNaN(n) ? 0 : n;
};

const tempTaxType = ref("01");
const tempRowData2 = ref([]);
const clickedRowData = (e) => {
  console.log(e);
  tempRowData2.value = e;
  scond4.value = e[0];
  scond5.value = e[1];
  scond6.value = e[3];
  scond7.value = pur803FmtDecimal(pur803SanitizeDecimal(String(e[4] ?? "")));
  scond8.value = pur803FmtDecimal("0");
  scond9.value = pur803FmtDecimal("0");
  scond10.value = pur803FmtDecimal("0");
  scond11.value = pur803FmtDecimal("0");
  tempTaxType.value = e[5];
  closeStockListPopup();
  nextTick(() => {
    nextTick(() => {
      pur803InputScond7.value?.focus?.();
    });
  });
};

const onlyNumber = (e) => {
  const san = pur803SanitizeDecimal(e.target.value);
  scond8.value = pur803FmtDecimal(san);
  const n7 = pur803ParseFloat(scond7.value);
  const n8 = san === "" ? 0 : pur803ParseFloat(san);
  const n9 = n8 * n7;
  scond9.value = pur803FmtDecimal(String(n9));
  let n10 = 0;
  if (tempTaxType.value == "01") {
    n10 = n9 * 0.1;
  }
  scond10.value = pur803FmtDecimal(String(n10));
  const n11 = n9 + n10;
  scond11.value = pur803FmtDecimal(String(n11));
};

const onlyNumber2 = (e) => {
  const name = e.target.name;
  const san = pur803SanitizeDecimal(e.target.value);
  const v = pur803FmtDecimal(san);
  if (name == "scond9") {
    scond9.value = v;
  } else if (name == "scond11") {
    scond11.value = v;
  } else if (name == "scond7") {
    scond7.value = v;
  } else if (name == "scond10") {
    scond10.value = v;
  }
};

/** 자재조회 더블클릭 값 — 배열 인덱스 또는 Json 행 객체 모두 허용 */
const pur803PickerRowToFields = (snap) => {
  if (snap == null)
    return {
      lngStockID: "",
      strStockName: "",
      strSupplierName: "",
      strUnitName: "",
      lngTaxType: "01",
    };
  if (Array.isArray(snap)) {
    return {
      lngStockID: snap[0],
      strStockName: snap[1],
      strSupplierName: snap[2],
      strUnitName: snap[3],
      lngTaxType: snap[5],
    };
  }
  const o = snap;
  return {
    lngStockID:
      o.lngStockID ?? o.LngStockID ?? o.lngStockId ?? o.strStockCode ?? "",
    strStockName: o.strStockName ?? o.StrStockName ?? "",
    strSupplierName: o.strSupplierName ?? o.StrSupplierName ?? "",
    strUnitName: o.strUnitName ?? o.strUnit ?? "",
    lngTaxType: o.lngTaxType ?? o.LngTaxType ?? "01",
  };
};

/** 출고 저장 전용 행 — 그리드에 넘긴 객체를 내부에서 수정해도 여기는 추가 시점 스냅샷만 유지 */
const pur803SaveLines = ref([]);
const rowData3 = ref([]);
const disabled = ref(false);

/** Swal 종료 후 포커스 — 기본 returnFocus(트리거 입력으로 복귀)가 다른 필드 포커스를 덮어쓰지 않게 함 */
const pur803FocusInputAfterSwal = async (inputRef) => {
  await nextTick();
  await nextTick();
  inputRef.value?.focus?.();
};

const addRowData3 = async (e) => {
  /** 그리드 추가 시에만 — 자재 검색(조회) 버튼 경로에서는 검사하지 않음 */
  const pur803AddCode = String(scond4.value ?? "").trim();
  const pur803AddName = String(scond5.value ?? "").trim();
  if (
    (!pur803AddCode && !pur803AddName) ||
    scond5.value == "" ||
    scond6.value == ""
  ) {
    await Swal.fire({
      title: "알림",
      text: "출고할 자재 품목을 선택해 주십시오!",
      icon: "warning",
      confirmButtonText: "확인",
      returnFocus: false,
    });
    await pur803FocusInputAfterSwal(pur803InputScond4);
    return;
  }
  const qtySan = pur803SanitizeDecimal(scond8.value);
  const qtyNum = pur803ParseFloat(scond8.value);
  if (!String(scond8.value ?? "").trim() || qtySan === "" || qtyNum <= 0) {
    await Swal.fire({
      title: "알림",
      text: "이동수량을 입력해 주십시오.",
      icon: "warning",
      confirmButtonText: "확인",
      returnFocus: false,
    });
    await pur803FocusInputAfterSwal(pur803InputScond8);
    return;
  }
  const snap = tempRowData2.value;
  const pick = pur803PickerRowToFields(snap);
  const sidNorm = String(pick.lngStockID ?? "").trim();
  if (!sidNorm) {
    await Swal.fire({
      title: "알림",
      text: "자재를 다시 조회·선택한 뒤 추가해 주십시오.",
      icon: "warning",
      confirmButtonText: "확인",
      returnFocus: false,
    });
    await pur803FocusInputAfterSwal(pur803InputScond4);
    return;
  }
  const cRowData3 = {
    lngStockID: sidNorm,
    strStockName: pick.strStockName,
    lngTaxType: pick.lngTaxType,
    strSupplierName: pick.strSupplierName,
    strUnitName: pick.strUnitName,
    curUnitPrice: pur803ParseFloat(scond7.value),
    dblQty: pur803ParseFloat(scond8.value),
    curSupply: pur803ParseFloat(scond9.value),
    curTax: pur803ParseFloat(scond10.value),
    curTotal: pur803ParseFloat(scond11.value),
  };

  pur803SaveLines.value = [...pur803SaveLines.value, { ...cRowData3 }];
  rowData3.value = pur803SaveLines.value.map((r) => ({ ...r }));

  updatedrowdata2.value = rowData3.value;
  scond4.value = "";
  scond5.value = "";
  scond6.value = "";
  scond7.value = "";
  scond8.value = "";
  scond9.value = "";
  scond10.value = "";
  scond11.value = "";
  disabled.value = true;
  nextTick(() => {
    nextTick(() => {
      pur803InputScond4.value?.focus?.();
    });
  });
  // rowData3.value =
};

const pur803OnAmountEnter = (e) => {
  const key = e.target?.name;
  if (key === "scond11") {
    e.preventDefault();
    void addRowData3();
    return;
  }
  const map = {
    scond7: pur803InputScond8,
    scond8: pur803InputScond9,
    scond9: pur803InputScond10,
    scond10: pur803InputScond11,
  };
  const next = map[key];
  if (!next) return;
  e.preventDefault();
  nextTick(() => {
    next.value?.focus?.();
  });
};

/** 저단 상세 그리드 행에서 자재키 추출(저장·병합 공통) */
const pur803StockId = (item) => {
  if (!item || typeof item !== "object") return "";
  const v =
    item.lngStockID ??
    item.LngStockID ??
    item.lngStockId ??
    item.strStockCode ??
    item.StrStockCode ??
    "";
  return String(v).trim();
};

const updatedrowdata2 = ref([]);
/** 하단 출고 그리드 — 표시용 동기화만. 저장 원본(pur803SaveLines)은 추가·행삭제·초기화만 변경. */
const onDetailGridUpdatedRowData = (e) => {
  const list = Array.isArray(e) ? [...e] : [];
  updatedrowdata2.value = list;
};

/** 하단 그리드 더블클릭 — 출고 대기 행(pur803SaveLines)에서 동일 인덱스 제거 후 그리드 갱신 */
const pur803OnDetailGridDblClicked = async (row) => {
  if (!row || typeof row !== "object") return;
  const lines = pur803SaveLines.value;
  if (!Array.isArray(lines) || lines.length === 0) return;

  let dr = row.dataRow;
  if (dr === undefined || dr === null) return;
  dr = Number(dr);
  if (!Number.isFinite(dr) || dr < 0 || dr >= lines.length) return;

  const line = lines[dr];
  if (!line) return;
  const idFromRow = pur803StockId(row);
  const idFromLine = pur803StockId(line);
  if (idFromRow && idFromLine && idFromRow !== idFromLine) {
    return;
  }

  const name = String(
    row.strStockName ?? row.StrStockName ?? line.strStockName ?? ""
  ).trim();
  const code = (idFromRow || idFromLine).trim() || "—";
  const label = name ? `${name} (${code})` : `(${code})`;

  const result = await Swal.fire({
    title: "확인",
    text: `${label} 를 삭제하시겠습니까?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "확인",
    cancelButtonText: "취소",
    returnFocus: false,
  });
  if (!result.isConfirmed) return;

  const next = lines.filter((_, i) => i !== dr);
  pur803SaveLines.value = next;
  rowData3.value = next.map((r) => ({ ...r }));
  updatedrowdata2.value = rowData3.value;
  if (next.length === 0) {
    disabled.value = false;
  }

  await Swal.fire({
    title: "알림",
    text: "삭제가 완료되었습니다.",
    icon: "success",
    confirmButtonText: "확인",
    returnFocus: false,
  });
};

/** 출고 API 단건 필드 문자열화 */
const pur803SaveFieldStr = (v) =>
  v === undefined || v === null ? "" : String(v);

const saveButton = async (e) => {
  try {
    const rows = Array.isArray(pur803SaveLines.value)
      ? [...pur803SaveLines.value].filter(
          (r) => r && String(pur803StockId(r)).trim() !== ""
        )
      : [];
    if (rows.length === 0) {
      await Swal.fire({
        title: "알림",
        text: "출고할 자재가 없습니다. 추가로 등록한 뒤 출고해 주십시오.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }

    store.state.loading = true;

    /** 행마다 단건 호출 — STOCKIDS 등 구분자 일괄 문자열이 서버에서 첫 건만 처리되는 경우 우회 */
    for (let idx = 0; idx < rows.length; idx++) {
      const row = rows[idx];
      const res = await saveMoveStorePartList(
        groupCd.value,
        storeCode3.value,
        scond.value,
        storeCode4.value,
        scond2.value,
        scond3.value.replaceAll("-", ""),
        supplierid.value,
        pur803StockId(row),
        pur803SaveFieldStr(row.curUnitPrice),
        pur803SaveFieldStr(row.dblQty),
        pur803SaveFieldStr(row.curSupply),
        pur803SaveFieldStr(row.curTax),
        store.state.userData.lngSequence
      );

      if (res.data.RESULT_CD != "00") {
        const msg = res.data.RESULT_NM ?? "";
        await Swal.fire({
          title: "실패",
          text:
            rows.length > 1
              ? `${idx + 1}번째 자재 처리 중 오류입니다.\n${msg}`
              : `${msg}`,
          icon: "error",
          confirmButtonText: "확인",
        });
        return;
      }
    }

    await Swal.fire({
      title: "성공",
      text: "출고를 완료하였습니다",
      icon: "success",

      confirmButtonText: "확인",
    });

    await resetPur803NewPopup();
    open.value = false;
    await searchButton();
  } catch (error) {
  } finally {
    store.state.loading = false;
  }
};

const deleteButton = async () => {
  const list = Array.isArray(rowData.value) ? rowData.value : [];
  const filtered = Array.isArray(updatedrowdata.value)
    ? updatedrowdata.value.filter((item) => item.Selected == true)
    : [];

  if (list.length === 0 || filtered.length === 0) {
    await Swal.fire({
      title: "알림",
      text: "삭제 할 출고내역이 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  try {
    const fromstorecd = filtered
      .map((item) => item.lngFromStoreCode)
      .join("\u200b");
    const frompartcd = filtered
      .map((item) => item.lngFromPartCode)
      .join("\u200b");
    const moveseqids = filtered.map((item) => item.strMoveSeqID).join("\u200b");
    const tostorecd = filtered
      .map((item) => item.lngToStoreCode)
      .join("\u200b");
    const topartcd = filtered.map((item) => item.lngToPartCode).join("\u200b");
    const movedates = filtered
      .map((item) => formatLocalDate(item.strMoveDate).replaceAll("-", ""))
      .join("\u200b");
    const supplierids = filtered
      .map((item) => item.lngSupplierID)
      .join("\u200b");
    const stockids = filtered.map((item) => item.lngStockID).join("\u200b");
    const res = await deleteStoreMoveListbyPart(
      groupCd.value,
      fromstorecd,
      frompartcd,
      moveseqids,
      tostorecd,
      topartcd,
      movedates,
      supplierids,
      stockids
    );

    if (res.data.RESULT_CD == "00") {
      await Swal.fire({
        title: "성공",
        text: "삭제를 완료하였습니다.",
        icon: "success",

        confirmButtonText: "확인",
      });
    } else {
      await Swal.fire({
        title: "실패",
        text: `${res.data.RESULT_NM}`,
        icon: "error",

        confirmButtonText: "확인",
      });
    }
  } catch (error) {
  } finally {
    searchButton();
  }
};
</script>

<style scoped>
/* 2열 와이어 — 보낸/받는 | 이동기간/확정여부 */
.pur803-wire-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

/* 필드 영역만 가로 70% (약 30% 축소) — 라벨 열·셀·콤보 시작 위치 유지 */
.pur235-search-panel.pur803-search-shrink .pur235-wire-cell > .pur235-wire-field {
  width: 63%;
  max-width: 63%;
  flex: 0 1 auto;
  min-width: 0;
  box-sizing: border-box;
}

/* 매장 | / | 파트 — 1·3열 동일 비율, 매장은 칸 내 오른쪽 정렬로 `/` 직전 끝선에 맞춤 */
.pur803-store-part-pair {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  column-gap: 0.125rem;
  width: 100%;
  min-width: 0;
}

.pur803-store-slash {
  font-size: 1rem;
  font-weight: 600;
  line-height: 1;
  color: rgb(75 85 99);
  padding: 0;
  margin: 0;
  user-select: none;
}

.pur803-pick-in-pair {
  justify-self: stretch;
  width: 100%;
  max-width: 100%;
  min-width: 0;
}

/* compact PickStore 인라인 max-width 제거 — 1fr 칸을 파트 select 와 동일하게 채움 */
.pur803-store-part-pair .pur803-pick-in-pair :deep(div.relative.min-w-0.flex-1) {
  max-width: 100% !important;
  width: 100% !important;
}

.pur803-store-part-pair .pur803-pick-in-pair :deep(.pickstore-vs-shell) {
  width: 100% !important;
  max-width: 100% !important;
}

.pur803-part-in-pair {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  justify-self: stretch;
}

/* 확정여부 — 위 행 매장/파트 한 칸(1fr)과 비슷한 가로 */
.pur803-confirm-row {
  width: 100%;
  max-width: calc(50% - 0.25rem);
  min-width: 0;
  box-sizing: border-box;
}

.pur803-confirm-select {
  box-sizing: border-box;
}

.pur235-wire-grid {
  display: grid;
  width: 100%;
  min-width: 0;
  align-items: center;
  column-gap: var(--pur235-col-gutter);
  row-gap: var(--pur235-row-gap);
}

.pur235-wire-cell {
  display: flex;
  min-width: 0;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}

.pur235-wire-label {
  flex: 0 0 var(--pur235-label-col);
  width: var(--pur235-label-col);
  min-width: 0;
  max-width: var(--pur235-label-col);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
  text-align: center;
  white-space: normal;
  overflow: visible;
  hyphens: none;
  padding-left: 0.125rem;
  padding-right: 0.125rem;
}

.pur235-wire-field {
  display: flex;
  min-width: 0;
  max-width: 100%;
  flex: 1 1 auto;
  align-items: center;
}

.pur235-wire-field:not(.pur235-mat-row) > * {
  min-width: 0;
  width: 100%;
}

.pur235-sg-select {
  box-sizing: border-box;
}

.pur235-search-panel select.pur235-sg-select {
  border: 1px solid var(--pur235-control-border) !important;
}

.pur235-search-panel select.pur235-sg-select:focus {
  border-color: #3b82f6 !important;
}

.pur235-search-panel .pur235-pick-slot :deep(select) {
  border: 1px solid var(--pur235-control-border) !important;
}

.pur235-search-panel .pur235-pick-slot :deep(select:focus) {
  border-color: #3b82f6 !important;
}

.pur235-search-panel .pur235-pick-slot :deep(.pickstore-vs-shell),
.pur235-search-panel .pur235-bc-slot :deep(.pickstore-vs-shell) {
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
  border: 1px solid var(--pur235-control-border) !important;
}

.pur235-search-panel .pur235-pick-slot :deep(div.relative.min-w-0.flex-1) {
  max-width: 100% !important;
}

.pur235-pick-slot :deep(> div.flex.text-base) {
  width: 100%;
  min-width: 0;
}

.pur235-pick-slot :deep(> div.flex > div:first-child) {
  display: none;
}

.pur235-search-panel .pur235-date-slot :deep(input[type="date"]:focus) {
  border-color: #3b82f6 !important;
}

.pur235-search-panel .pur235-date-slot :deep(> div.flex.justify-start.items-center) {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0;
  gap: 0.25rem !important;
}

.pur235-search-panel .pur235-date-slot :deep(> div.flex > div.inline-flex.h-8) {
  flex: 1 1 auto;
  min-width: 0;
  max-width: 100%;
  width: 100%;
  gap: 0.125rem !important;
}

.pur235-search-panel .pur235-date-slot :deep(input[type="date"]) {
  border: 1px solid var(--pur235-control-border) !important;
  box-sizing: border-box;
  width: auto !important;
  flex: 1 1 0;
  min-width: 5.25rem;
  max-width: none;
  padding-left: 0.45rem;
  padding-right: 0.25rem;
}

.pur235-search-panel .pur235-date-slot :deep(div.inline-flex.h-8 > span) {
  flex-shrink: 0;
  padding-left: 0.05rem;
  padding-right: 0.05rem;
}

.pur235-search-panel .pur235-date-slot :deep(div.inline-flex.h-8 > button) {
  flex-shrink: 0;
  width: 1.65rem !important;
  height: 1.65rem !important;
  min-width: 1.65rem;
  margin-left: 0 !important;
}

.pur235-search-panel .pur235-date-slot :deep(div.inline-flex.h-8 > button img) {
  max-width: 85%;
  max-height: 85%;
}

.pur803-newpop-shell {
  box-sizing: border-box;
  overflow: visible;
  isolation: isolate;
}

/* 매장/파트 블록: 스크롤 영역 밖에 두고 z-index로 그리드 히트 영역보다 위에 고정 */
.pur803-newpop-master-strip {
  position: relative;
  z-index: 40;
  isolation: isolate;
  pointer-events: auto;
  transform: translateZ(0);
}

/* 자재 입력 스크롤 영역 */
.pur803-newpop-upper-scroll {
  position: relative;
  z-index: 20;
  background-color: #fff;
  isolation: isolate;
}

.pur803-newpop-grid-gap {
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  isolation: isolate;
}

.pur803-newpop-grid-host {
  position: relative;
  z-index: 0;
  box-sizing: border-box;
  min-height: 12rem;
}

.pur803-newpop-formwrap {
  box-sizing: border-box;
  overflow: visible;
}

.pur803-newpop-master-grid {
  overflow: visible;
}

.pur803-newpop-master-wrap {
  overflow: visible;
  padding-bottom: 2px;
}

.pur803-newpop-midrule {
  box-sizing: border-box;
}

.pur803-newpop-lbl-master {
  background-color: #e6eef7;
  min-height: 2.25rem;
}

.pur803-newpop-lbl-detail {
  background-color: #e9e4db;
  min-height: 2.25rem;
}

.pur803-newpop-fld {
  min-height: 2.25rem;
  box-sizing: border-box;
}

/* 매장 PickStore 하단 테두리가 잘리지 않도록 */
.pur803-newpop-master-wrap .pur803-newpop-fld {
  overflow: visible;
}

.pur803-newpop-input-readonly,
.pur803-newpop-input-readonly:disabled {
  background-color: #e8e8e8 !important;
  color: #374151;
}

/* 포커스 링: 신규등록 팝업 공통 */
.pur803-newpop-input:focus,
.pur803-newpop-select:focus {
  outline: none;
  box-shadow: inset 0 0 0 1px #2563eb;
}

/* 분홍 배경: 상단 2열(master) 제외, 하단 상세(detail) 입력만 */
.pur803-newpop-detail-wrap .pur803-newpop-input:focus,
.pur803-newpop-detail-wrap .pur803-newpop-select:focus {
  background-color: #fce7f3;
}

.pur803-newpop-store-part-row {
  display: flex;
  align-items: stretch;
  overflow: visible;
  min-height: 2.5rem;
}
.pur803-newpop-store-part-row > .pur803-newpop-pick {
  overflow: visible;
  display: flex;
  align-items: center;
  min-height: 1.75rem;
}
.pur803-newpop-store-part-row :deep(.pickstore-vs-shell) {
  overflow: visible;
  box-sizing: border-box;
}

/* 매장 60% : 파트 40% (슬래시·gap 제외한 가로 기준 flex 비율) */
.pur803-newpop-store-part-row > .pur803-newpop-store-slot {
  flex: 6 1 0%;
  min-width: 0;
}

.pur803-newpop-store-part-row > .pur803-newpop-part-slot {
  flex: 4 1 0%;
  min-width: 0;
}

.pur803-newpop-pick :deep(div.relative.min-w-0.flex-1) {
  max-width: 100% !important;
}

.pur803-newpop-pick :deep(.pickstore-vs-shell) {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  height: 1.75rem !important;
  min-height: 1.75rem !important;
  /* 파트 select 와 동일: border-slate-300 (#cbd5e1) */
  border: 1px solid #cbd5e1 !important;
  border-radius: 0.375rem;
  box-sizing: border-box;
  box-shadow: none !important;
  background-color: #fff !important;
}

.pur803-newpop-pick :deep(.pickstore-vs-shell .vs__dropdown-toggle) {
  min-height: 1.75rem !important;
  border: none !important;
  background: transparent !important;
}

.pur235-date-slot :deep(> div.flex.justify-start.items-center) {
  margin-left: 0;
  padding-left: 0;
}
</style>
<!-- append-to-body 드롭다운은 scoped 미적용 — 모달·그리드보다 위 -->
<style>
body.pur803-newpop-active .style-chooser .vs__dropdown-menu {
  z-index: 10060 !important;
}
body.pur803-newpop-active .style-chooser .vs__dropdown-toggle {
  position: relative;
  z-index: 10061 !important;
}
</style>
