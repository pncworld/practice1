/*--############################################################################
# Filename : CRM20_002RPT.vue                                                  
# Description : 고객관리 > 고객 실적 관리 > 고객 실적 조회                      
# Date :2025-06-12                                                             
# Author : 권맑음                     
################################################################################*/
<template>
  <!-- 조회조건 -->
  <div class="flex h-full min-h-0 flex-col" @click="handleParentClick">
    <div
      class="flex shrink-0 items-center justify-between gap-3 overflow-y-hidden pr-1">
      <PageName></PageName>
      <div class="flex shrink-0 items-center justify-end space-x-2 pr-5">
        <!-- 직원할인 월별 사용 현황 : 갓잇(3287, 직원할인 설정 그룹)의 본사 계정에서만 (매장 계정은 숨김) -->
        <button
          v-if="staffDcGroup && isHqUser"
          type="button"
          class="button save w-auto"
          @click="openStaffDcMonthly">
          직원할인 월별
        </button>
        <button type="button" class="button search md:w-auto w-14" @click="searchButton">
          조회
        </button>
        <button type="button" class="button save w-auto excel" @click="excelButton">
          엑셀
        </button>
      </div>
    </div>

    <div
      class="crm02-search-panel z-10 mt-3 w-full max-w-[min(100%,1680px)] min-w-0 shrink-0 self-center overflow-x-auto rounded-md border border-slate-500/70 bg-gray-200 shadow-sm">
      <div
        class="crm02-search-body min-w-0 text-slate-800"
        :style="{ '--crm02-control-border': crm02ControlBorder }">
        <!-- 참고: 1행 — 기간 · 체크 · 고객명 · 조회 -->
        <div
          class="crm02-search-r1 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-slate-500/45 px-4 py-2.5 sm:px-5">
          <!-- 1행 라벨 열 = 2행 .crm02-r2-cell 첫 열 -->
          <div class="crm02-r1-left flex min-w-0 flex-1 items-center gap-x-2">
            <div class="crm02-r1-label-slot shrink-0">
              <span class="crm02-r2-label">기간</span>
            </div>
            <div
              class="crm02-r1-cluster flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2 sm:flex-nowrap sm:gap-x-4 sm:gap-y-0">
              <div class="crm02-r1-period flex min-h-8 shrink-0 items-center">
                <div class="crm02-date-field min-w-0 shrink-0">
                  <Datepicker2
                    :main-name="'기간'"
                    :omit-main-label="true"
                    :filter-bar-align="true"
                    ref="datepicker"
                    :initToday="1"
                    :closePopUp="closePopUp"
                    @excelDate="excelDate"
                    @endDate="endDate"
                    @startDate="startDate"></Datepicker2>
                </div>
              </div>
              <div class="crm02-r1-checks flex min-h-8 shrink-0 items-center gap-x-4 sm:gap-x-5">
                <label class="crm02-check-label shrink-0" for="crm02-cond-all">
                  <input
                    id="crm02-cond-all"
                    v-model="cond"
                    type="checkbox"
                    name="condtype"
                    class="crm02-check"
                    @change="setCond" />
                  전체기간
                </label>
                <label class="crm02-check-label shrink-0" for="crm02-cond-agg">
                  <input
                    id="crm02-cond-agg"
                    v-model="cond2"
                    type="checkbox"
                    name="condtype"
                    class="crm02-check"
                    @change="setCond2" />
                  집계내역
                </label>
              </div>
            </div>
          </div>
          <div
            class="crm02-r1-cust flex min-h-8 w-full min-w-0 shrink-0 items-center justify-end gap-2 sm:w-auto sm:max-w-[min(100%,42rem)]">
            <span class="crm02-inline-lbl shrink-0">고객명</span>
            <div class="crm02-cust-pick flex min-w-0 flex-1 flex-wrap items-center gap-2 sm:min-w-[12rem]">
              <input
                id="crm02-pick-card"
                v-model="pickedCardDisplay"
                type="text"
                disabled
                autocomplete="off"
                class="crm02-sg-input crm02-cust-pick-input h-8 min-h-8 min-w-0 flex-1 rounded-md border border-solid bg-slate-100 px-2 text-sm text-slate-700 sm:max-w-[7rem]"
              />
              <input
                id="crm02-pick-name"
                v-model="pickedCustName"
                type="text"
                disabled
                autocomplete="off"
                class="crm02-sg-input crm02-cust-pick-input h-8 min-h-8 min-w-0 flex-1 rounded-md border border-solid bg-white px-2 text-sm text-slate-800 sm:min-w-[6rem]"
              />
              <button
                type="button"
                class="crm02-cust-pick-btn shrink-0"
                @click="openCustSearch">
                조회
              </button>
              <button
                type="button"
                class="crm02-cust-pick-btn shrink-0"
                @click="resetCustPick">
                초기화
              </button>
            </div>
          </div>
        </div>
        <!-- 참고: 2행 — 포인트 4종 균등 -->
        <div
          class="crm02-search-r2 grid grid-cols-1 gap-x-3 gap-y-2 px-4 py-2.5 sm:grid-cols-2 sm:px-5 lg:gap-x-3"
          :class="showStaffDcRemain ? 'lg:grid-cols-5' : 'lg:grid-cols-4'">
          <div class="crm02-r2-cell">
            <span class="crm02-r2-label">누적포인트</span>
            <input
              id="crm02-pt-sale"
              v-model="point1"
              type="text"
              disabled
              autocomplete="off"
              class="crm02-sg-input crm02-pt-readonly h-8 min-h-8 min-w-0 w-full rounded-md border border-solid bg-slate-100 px-2 text-sm text-slate-700" />
          </div>
          <div class="crm02-r2-cell">
            <span class="crm02-r2-label">사용포인트</span>
            <input
              id="crm02-pt-used"
              v-model="point2"
              type="text"
              disabled
              autocomplete="off"
              class="crm02-sg-input crm02-pt-readonly h-8 min-h-8 min-w-0 w-full rounded-md border border-solid bg-slate-100 px-2 text-sm text-slate-700" />
          </div>
          <div class="crm02-r2-cell">
            <span class="crm02-r2-label">잔여포인트</span>
            <input
              id="crm02-pt-rem"
              v-model="point3"
              type="text"
              disabled
              autocomplete="off"
              class="crm02-sg-input crm02-pt-readonly h-8 min-h-8 min-w-0 w-full rounded-md border border-solid bg-slate-100 px-2 text-sm text-slate-700" />
          </div>
          <div class="crm02-r2-cell">
            <span class="crm02-r2-label">보너스포인트</span>
            <input
              id="crm02-pt-bonus"
              v-model="point4"
              type="text"
              disabled
              autocomplete="off"
              class="crm02-sg-input crm02-pt-readonly h-8 min-h-8 min-w-0 w-full rounded-md border border-solid bg-slate-100 px-2 text-sm text-slate-700" />
          </div>
          <!-- 임직원할인 잔여횟수 : 직원할인 설정 그룹(공통코드 448) + 대상 등급 고객일 때만 -->
          <div v-if="showStaffDcRemain" class="crm02-r2-cell">
            <span class="crm02-r2-label">잔여할인횟수</span>
            <input
              id="crm02-staffdc-remain"
              :value="staffDcRemainText"
              type="text"
              disabled
              autocomplete="off"
              class="crm02-sg-input crm02-pt-readonly h-8 min-h-8 min-w-0 w-full rounded-md border border-solid bg-slate-100 px-2 text-center text-sm text-slate-700" />
          </div>
        </div>
      </div>
    </div>
    <!-- 그리드: 노트북 뷰포트에 맞춤 — flex-1 + min-h-0 체인 (Realgrid h-full) -->
    <div
      class="crm02-grid-shell mx-auto mt-2 grid min-h-0 min-w-0 w-full max-w-[min(100%,1680px)] flex-1 basis-0 grid-cols-[minmax(0,2.7fr)_minmax(0,1.3fr)] grid-rows-1 gap-2 overflow-hidden px-1 pb-1">
      <section class="crm02-grid-main flex min-h-0 min-w-0 flex-col">
        <div
          class="crm02-main-grid-frame flex w-full min-w-0 flex-1 flex-col overflow-hidden rounded-sm border border-gray-400 bg-white">
          <div class="relative min-h-0 w-full flex-1">
            <Realgrid
              :progname="'CRM02_002RPT_VUE'"
              :progid="1"
              :rowData="rowData"
              :reload="reload"
              :setFooterCustomColumnId="['strCCardID']"
              :setFooterCustomText="['합계']"
              :setFooter="true"
              :hideColumnsId="hideColumnsId"
              :documentTitle="'CRM02_002RPT'"
              @clickedRowData="clickedRowData"
              :documentSubTitle="documentSubTitle"
              :rowStateeditable="false"
              :exporttoExcel="exportExcel">
            </Realgrid>
          </div>
        </div>
      </section>
      <section
        class="crm02-grid-side grid h-full min-h-0 min-w-0 grid-cols-1 grid-rows-[1fr,4fr,1fr,4fr,1fr,4fr] border border-black">
        <div class="flex items-center justify-start">※고객정보</div>
        <div class="h-full min-h-0 w-full overflow-hidden">
          <Realgrid
            :progname="'CRM02_002RPT_VUE_Popup'"
            :progid="1"
            :rowData="rowData2"
            :rowStateeditable="false"
            :setStateBar="false"></Realgrid>
        </div>
        <div class="flex items-center justify-start">※주문내역</div>
        <div class="h-full min-h-0 w-full overflow-hidden">
          <Realgrid
            :progname="'CRM02_002RPT_VUE_Popup'"
            :progid="2"
            :rowData="rowData3"
            :rowStateeditable="false"
            :setStateBar="false"></Realgrid>
        </div>
        <div class="flex items-center justify-start">※결재내역</div>
        <div class="h-full min-h-0 w-full overflow-hidden">
          <Realgrid
            :progname="'CRM02_002RPT_VUE_Popup'"
            :progid="3"
            :rowData="rowData4"
            :rowStateeditable="false"
            :setStateBar="false"></Realgrid>
        </div>
      </section>
    </div>
  </div>

  <!-- 직원할인 월별 사용 현황 팝업 (갓잇 3287 전용) : 행 = 직원할인 등급 고객, 열 = 월, 칸 = 사용 / 전체 -->
  <Teleport to="body">
    <Transition name="crm02-sdm">
    <div
      v-if="showStaffDcPop"
      class="crm02-sdm-backdrop"
      @mousedown.self="showStaffDcPop = false">
      <div
        class="crm02-sdm-popup"
        role="dialog"
        aria-modal="true"
        aria-label="직원할인 월별 사용 현황"
        :style="sdmPop.style"
        @keydown.esc="showStaffDcPop = false">
        <!-- 제목 줄을 끌어 이동 (useFloatPopup) -->
        <div class="crm02-sdm-head" title="끌어서 이동" @mousedown="sdmPop.startDrag">
          <h2 class="crm02-sdm-title">직원할인 월별 사용 현황</h2>
          <div class="crm02-sdm-actions" @mousedown.stop>
            <button type="button" class="pnc-sub-btn" @click="loadStaffDcMonthly">
              <svg class="pnc-sub-btn__icon" viewBox="0 0 16 16" aria-hidden="true">
                <circle cx="7" cy="7" r="4.2" fill="none" stroke="currentColor" stroke-width="1.6" />
                <path d="M10.2 10.2 13.5 13.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
              </svg>
              조회
            </button>
            <button
              type="button"
              class="pnc-sub-btn"
              :disabled="sdmFilteredRows.length === 0"
              @click="exportStaffDcMonthly">
              <svg class="pnc-sub-btn__icon" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M8 2.5v7.5M4.8 7 8 10.2 11.2 7M3 12.5h10" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              엑셀
            </button>
            <button type="button" class="pnc-sub-btn pnc-sub-btn--gray" @click="showStaffDcPop = false">
              <svg class="pnc-sub-btn__icon" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M4 4l8 8M12 4 4 12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
              </svg>
              닫기
            </button>
          </div>
        </div>

        <!-- 조회 줄 3칸 : 왼쪽 조회월 | 가운데 필터 | 오른쪽 사용 / 전체 -->
        <div class="crm02-sdm-cond">
          <div class="crm02-sdm-cond-left">
            <span class="crm02-sdm-lbl">조회월</span>
            <input v-model="sdmFrom" type="month" class="crm02-sdm-month" />
            <span>~</span>
            <input v-model="sdmTo" type="month" class="crm02-sdm-month" />
          </div>
          <div class="crm02-sdm-cond-center">
          <span class="crm02-sdm-lbl">카드번호 / 사원명</span>
          <!-- 초성 필터 규칙(choseong-name-filter, PUR02_031INS 방식) : v-model 은 한글 조합 중 값을 안 넘기므로
               composition·input 이벤트마다 event.target.value 로 바로 거름 -->
          <input
            :value="sdmKeyword"
            type="text"
            class="crm02-sdm-filter"
            @compositionstart="onSdmKeyword"
            @compositionupdate="onSdmKeyword"
            @compositionend="onSdmKeyword"
            @input="onSdmKeyword"
            placeholder="카드번호 OR 사원명"
            autocomplete="off" />
          </div>
          <span class="crm02-sdm-note">사용 / 전체</span>
        </div>

        <div class="crm02-sdm-table-wrap">
          <table v-if="sdmFilteredRows.length > 0" class="crm02-sdm-table">
            <thead>
              <tr>
                <th class="crm02-sdm-col-card">카드번호</th>
                <th class="crm02-sdm-col-name">사원명</th>
                <th
                  v-for="ym in sdmMonths"
                  :key="ym"
                  :class="{ 'is-this-month': ym === thisYM }">
                  {{ fmtYM(ym) }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in sdmFilteredRows" :key="r.lngCustNo">
                <td class="crm02-sdm-col-card">{{ r.strCCardID }}</td>
                <td class="crm02-sdm-col-name">{{ r.strCustName }}</td>
                <td
                  v-for="ym in sdmMonths"
                  :key="ym"
                  :class="{
                    'is-this-month': ym === thisYM,
                    'is-full': r.cells[ym] && r.cells[ym].limit != null && r.cells[ym].used >= r.cells[ym].limit && r.cells[ym].used > 0,
                    'is-zero': !r.cells[ym] || r.cells[ym].used == 0 || r.cells[ym].limit == null,
                  }"
                  :title="r.cells[ym] ? `결제 ${r.cells[ym].pay}건 · 취소 ${r.cells[ym].cancel}건` : ''">
                  {{ sdmCellText(r.cells[ym]) }}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td class="crm02-sdm-col-card" colspan="2">사용 합계</td>
                <td
                  v-for="ym in sdmMonths"
                  :key="ym"
                  :class="{ 'is-this-month': ym === thisYM }">
                  {{ sdmMonthSum[ym] ?? 0 }}
                </td>
              </tr>
            </tfoot>
          </table>
          <div v-else class="crm02-sdm-empty">
            {{ sdmRows.length > 0 ? "카드번호 / 사원명에 맞는 직원이 없습니다." : sdmSearched ? "조회 결과가 없습니다." : "조회월을 정하고 [조회]를 누르세요." }}
          </div>
        </div>

        <!-- 오른쪽 아래 모서리를 끌어 크기 조절 -->
        <div
          class="crm02-sdm-resize"
          title="크기 조절"
          @mousedown.stop="sdmPop.startResize"></div>

        <!-- 공통 로딩(레이아웃 z-index 100)은 body 로 옮긴 팝업 뒤에 가려지므로 팝업 안에 표시 -->
        <div v-if="sdmLoading" class="crm02-sdm-loading" role="status">조회 중…</div>
      </div>
    </div>
    </Transition>
  </Teleport>

  <CustomerSearch
    v-if="showCustPopup"
    join-sts="1"
    @strCCardID="onPickCard"
    @strCustName="onPickCustName"
    @lngCustNo="onPickCustNo"
    @closePopUp="showCustPopup = false"
  />
  <!-- 그리드 영역 -->
</template>

<script setup>
import {
  getCustPointInfo,
  getCustRecord,
  getCustRecord2,
  getReceiptDataDetail2,
  getStaffDcInfo,
  getStaffDcMonthly,
} from "@/api/micrm";
import Datepicker2 from "@/components/Datepicker2.vue";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
import CustomerSearch from "@/components/customerSearch.vue";
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

/*
 * 공통 표준  Function
 */

import { computed, onMounted, ref, watch } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";
import Swal from "sweetalert2";
import { utils, writeFile } from "xlsx-js-style";
import { useFloatPopup } from "@/utils/floatPopup";
import { matchNameWithChoseong } from "@/utils/choseongFilter";
/**
 * 	화면 Load시 실행 스크립트
 */

const store = useStore();

const crm02ControlBorder = "#cbd5e1";

onMounted(async () => {
  await insertPageLog(store.state.activeTab2);
  syncExcelListLabel();
  await loadStaffDcGroup();
});

/**
 * 임직원할인 (공통코드 448 설정 그룹 전용, 2026-11-05)
 * - 설정 그룹이 아니면 기존 조회(getCustRecord)·기존 그리드 그대로, 직원할인 칸은 숨김
 * - 설정 그룹이면 getCustRecord2 로 POS번호·할인금액·할인차감을 함께 조회
 */
const STAFF_DC_COLS = ["intRegNo", "lngDcAmt", "intDcUseCnt", "strDcYM"];
const staffDcGroup = ref(false);
// 본사 계정 : 매장 선택 공통 컴포넌트(pickStore·pickStoreRenew)와 같은 기준 (브랜드 관리자 또는 lngPositionType 1), 그 밖은 매장 계정
const isHqUser = computed(
  () =>
    store.state.userData?.blnBrandAdmin == "True" ||
    store.state.userData?.lngPositionType == "1"
);
const staffDcRemain = ref(null);

// 직원할인 설정 그룹(3287)이면 항목은 항상 보이고, 값은 조회 후 채움
//  - 대상 등급 고객 : "잔여 / 전체" (예 1 / 2)
//  - 대상이 아닌 고객 : "대상 아님",  고객 미선택·조회 전 : 빈칸
const staffDcNotTarget = ref(false);
const showStaffDcRemain = computed(() => staffDcGroup.value);
const staffDcRemainText = computed(() =>
  staffDcRemain.value
    ? `${staffDcRemain.value.intRemainCnt} / ${staffDcRemain.value.intLimitCnt}`
    : staffDcNotTarget.value
    ? "대상 아님"
    : ""
);

const loadStaffDcGroup = async () => {
  try {
    const res = await getStaffDcInfo(store.state.userData.lngStoreGroup, "");
    staffDcGroup.value =
      res?.data?.RESULT_CD == "00" && (res.data.List ?? []).length > 0;
  } catch (error) {
    staffDcGroup.value = false;
  }
  applyHideColumns();
};

/**
 * 직원할인 월별 사용 현황 팝업 (갓잇 3287 전용 — 버튼이 staffDcGroup 일 때만 보임)
 * 서버는 직원 x 월 행을 주고, 화면에서 직원별 한 줄 + 월별 칸으로 펼친다
 */
const pad2 = (n) => String(n).padStart(2, "0");
const toYM = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}`; // YYYY-MM (input month)
const nowDate = new Date();
const thisYM = `${nowDate.getFullYear()}${pad2(nowDate.getMonth() + 1)}`; // YYYYMM
const showStaffDcPop = ref(false);
const sdmLoading = ref(false);
// 팝업 이동·크기 조절 (공통 유틸 그대로 사용 — STK32_001INS 등과 같은 방식)
const sdmPop = useFloatPopup({
  width: 1152, // 72rem
  height: 704, // 44rem
  minWidth: 640,
  minHeight: 360,
  maxWidthRatio: 0.96,
  maxHeightRatio: 0.9,
});
// 기본 조회월 = 최근 6개월 (시작 = 5개월 전, 종료 = 당월)
const sdmFrom = ref(
  toYM(new Date(nowDate.getFullYear(), nowDate.getMonth() - 5, 1))
);
const sdmTo = ref(toYM(nowDate));
const sdmRows = ref([]);
const sdmMonths = ref([]);
const sdmSearched = ref(false);
// 카드번호 / 사원명 필터 (화면에서 바로 거름, 이름은 초성 검색 — choseongFilter 공통 유틸)
const sdmKeyword = ref("");
const onSdmKeyword = (event) => {
  sdmKeyword.value = event?.target?.value ?? "";
};
const sdmFilteredRows = computed(() => {
  const k = String(sdmKeyword.value ?? "").trim();
  if (!k) return sdmRows.value;
  return sdmRows.value.filter(
    (r) =>
      String(r.strCCardID ?? "").includes(k) ||
      matchNameWithChoseong(r.strCustName, k)
  );
});

const fmtYM = (ym) => `${ym.slice(0, 4)}-${ym.slice(4, 6)}`;
// 칸 표시 : 사용 / 전체, 전체 횟수가 없는 달(직원할인 횟수 관리 시작 전)은 "-"
const sdmCellText = (cell) => {
  if (!cell) return "";
  if (cell.limit == null) return cell.used ? `${cell.used} / -` : "-";
  return `${cell.used} / ${cell.limit}`;
};
const sdmMonthSum = computed(() => {
  const sum = {};
  for (const r of sdmFilteredRows.value) {
    for (const ym of sdmMonths.value) {
      sum[ym] = (sum[ym] ?? 0) + (r.cells[ym]?.used ?? 0);
    }
  }
  return sum;
});

const openStaffDcMonthly = () => {
  if (!staffDcGroup.value || !isHqUser.value) return;
  sdmPop.place(); // 열 때마다 화면 가운데·기본 크기
  showStaffDcPop.value = true;
  loadStaffDcMonthly();
};

const loadStaffDcMonthly = async () => {
  const from = String(sdmFrom.value ?? "").replace("-", "");
  const to = String(sdmTo.value ?? "").replace("-", "");
  if (from.length !== 6 || to.length !== 6 || from > to) {
    Swal.fire({
      icon: "warning",
      text: "조회월을 확인해 주세요. (시작월 ≤ 종료월)",
      confirmButtonText: "확인",
    });
    return;
  }
  // 조회월 최대 12개월 (프로시저도 12개월로 자름)
  const monthCnt =
    (Number(to.slice(0, 4)) - Number(from.slice(0, 4))) * 12 +
    (Number(to.slice(4, 6)) - Number(from.slice(4, 6))) +
    1;
  if (monthCnt > 12) {
    Swal.fire({
      icon: "warning",
      text: "조회월은 최대 12개월까지 선택할 수 있습니다.",
      confirmButtonText: "확인",
    });
    return;
  }
  try {
    sdmLoading.value = true;
    const res = await getStaffDcMonthly(
      store.state.userData.lngStoreGroup,
      from,
      to
    );
    const list = res?.data?.List ?? [];
    const byCust = new Map();
    const months = new Set();
    for (const x of list) {
      months.add(x.strYM);
      if (!byCust.has(x.lngCustNo)) {
        byCust.set(x.lngCustNo, {
          lngCustNo: x.lngCustNo,
          strCCardID: x.strCCardID,
          strCustName: x.strCustName,
          cells: {},
        });
      }
      byCust.get(x.lngCustNo).cells[x.strYM] = {
        used: Number(x.intUsedCnt) || 0,
        // 전체 횟수가 없는 달(운영 전) = null → 화면·엑셀 "-"
        limit: x.intLimitCnt === "" || x.intLimitCnt == null ? null : Number(x.intLimitCnt),
        pay: Number(x.intPayCnt) || 0,
        cancel: Number(x.intCancelCnt) || 0,
      };
    }
    sdmMonths.value = [...months].sort();
    sdmRows.value = [...byCust.values()];
  } catch (error) {
    sdmRows.value = [];
    sdmMonths.value = [];
  } finally {
    sdmSearched.value = true;
    sdmLoading.value = false;
  }
};

/**
 * 월별 표 엑셀 저장 (팝업 표와 같은 모양 : 제목 / 조회월 / 머리글 / 직원별 줄 / 사용 합계)
 */
const exportStaffDcMonthly = () => {
  if (sdmFilteredRows.value.length === 0) return;
  const rows = sdmFilteredRows.value;
  const months = sdmMonths.value;
  const header = ["카드번호", "사원명", ...months.map(fmtYM)];
  const body = rows.map((r) => [
    r.strCCardID,
    r.strCustName,
    ...months.map((ym) =>
      sdmCellText(r.cells[ym])
    ),
  ]);
  const sumRow = ["사용 합계", "", ...months.map((ym) => sdmMonthSum.value[ym] ?? 0)];
  const aoa = [
    ["직원할인 월별 사용 현황"],
    [`조회월 : ${sdmFrom.value} ~ ${sdmTo.value}   (칸 = 사용 / 전체)${String(sdmKeyword.value ?? "").trim() ? `   필터 : ${String(sdmKeyword.value).trim()}` : ""}`],
    [],
    header,
    ...body,
    sumRow,
  ];
  const ws = utils.aoa_to_sheet(aoa);
  const lastCol = header.length - 1;
  const headRow = 3; // 0-based 머리글 행
  const sumRowIdx = aoa.length - 1;
  const base = { font: { name: "맑은 고딕", sz: 10 }, alignment: { vertical: "center" } };
  const border = {
    top: { style: "thin", color: { rgb: "CBD5E1" } },
    bottom: { style: "thin", color: { rgb: "CBD5E1" } },
    left: { style: "thin", color: { rgb: "CBD5E1" } },
    right: { style: "thin", color: { rgb: "CBD5E1" } },
  };
  for (let r = headRow; r <= sumRowIdx; r++) {
    for (let c = 0; c <= lastCol; c++) {
      const ref = utils.encode_cell({ r, c });
      if (!ws[ref]) ws[ref] = { t: "s", v: "" };
      const isHead = r === headRow;
      const isSum = r === sumRowIdx;
      const ym = months[c - 2];
      const cell = r > headRow && !isSum && c >= 2 ? rows[r - headRow - 1].cells[ym] : null;
      ws[ref].s = {
        ...base,
        border,
        alignment: { vertical: "center", horizontal: c < 2 ? "left" : "center" },
        font: {
          ...base.font,
          bold: isHead || isSum || (cell && cell.limit != null && cell.used > 0 && cell.used >= cell.limit),
          color: isHead
            ? { rgb: "FFFFFF" }
            : cell && cell.limit != null && cell.used > 0 && cell.used >= cell.limit
            ? { rgb: "DC2626" }
            : undefined,
        },
        fill: isHead
          ? { fgColor: { rgb: "545876" } }
          : isSum
          ? { fgColor: { rgb: "CFE8F5" } }
          : ym === thisYM && c >= 2
          ? { fgColor: { rgb: "FEFCE8" } }
          : undefined,
      };
    }
  }
  ws["A1"].s = { font: { name: "맑은 고딕", sz: 14, bold: true } };
  ws["A2"].s = { font: { name: "맑은 고딕", sz: 10, color: { rgb: "475569" } } };
  ws["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: lastCol } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: lastCol } },
    { s: { r: sumRowIdx, c: 0 }, e: { r: sumRowIdx, c: 1 } },
  ];
  ws["!cols"] = [{ wch: 22 }, { wch: 14 }, ...months.map(() => ({ wch: 10 }))];
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, "직원할인 월별");
  writeFile(
    wb,
    `직원할인_월별사용현황_${sdmFrom.value.replace("-", "")}_${sdmTo.value.replace("-", "")}.xlsx`
  );
};

const loadStaffDcRemain = async () => {
  staffDcRemain.value = null;
  staffDcNotTarget.value = false;
  if (!staffDcGroup.value || custID.value == "" || custID.value == undefined) {
    return;
  }
  try {
    const res = await getStaffDcInfo(
      store.state.userData.lngStoreGroup,
      custID.value
    );
    const row = (res?.data?.List ?? [])[0];
    if (row && row.blnTargetCust == "1" && row.intRemainCnt !== "") {
      staffDcRemain.value = row;
    } else if (row) {
      staffDcNotTarget.value = true;
    }
  } catch (error) {
    staffDcRemain.value = null;
  }
};

const showCustPopup = ref(false);
const pickedCardDisplay = ref("");
const pickedCustName = ref("");
const searchNum = ref("");
const custID = ref();

const syncExcelListLabel = () => {
  selectedExcelList.value = pickedCustName.value
    ? `고객명: ${pickedCustName.value}`
    : "고객명:   ";
};

const openCustSearch = () => {
  showCustPopup.value = true;
};

const normalizeCardDisplay = (v) =>
  String(v ?? "")
    .replace(/[\[\]]/g, "")
    .trim();

const onPickCard = (v) => {
  searchNum.value = String(v ?? "").trim();
  pickedCardDisplay.value = normalizeCardDisplay(v);
  initGrid();
};

const onPickCustName = (v) => {
  pickedCustName.value = String(v ?? "").trim();
  syncExcelListLabel();
};

const onPickCustNo = (v) => {
  custID.value = v;
};

const resetCustPick = () => {
  searchNum.value = "";
  custID.value = "";
  pickedCardDisplay.value = "";
  pickedCustName.value = "";
  syncExcelListLabel();
  initGrid();
};

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

const rowData2 = ref([]);
const rowData3 = ref([]);
const rowData4 = ref([]);
const condValue = ref(0);
const cond = ref(false);
const cond2 = ref(false);
const datepicker = ref(null);
const closePopUp = ref(false);

const point1 = ref();
const point2 = ref();
const point3 = ref();
const point4 = ref();

watch(cond2, () => {
  applyHideColumns();
  initGrid();
});
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
  sDate.value = e;
};
const endDate = (e) => {
  eDate.value = e;
};

const selectedDate = ref();
const excelDate = (e) => {
  selectedDate.value = e;
};
/**
 *  조회 함수
 */
// 직원할인 칸은 설정 그룹 확인 전까지 숨김 (설정 그룹이 아니면 계속 숨김)
const hideColumnsId = ref([...STAFF_DC_COLS]);
const applyHideColumns = () => {
  const aggCols =
    cond2.value == true ? ["dtmAddDate", "lngReceipt", "strReason"] : [];
  const staffCols = !staffDcGroup.value
    ? STAFF_DC_COLS
    : cond2.value == true
    ? ["intRegNo", "strDcYM"]
    : [];
  hideColumnsId.value = [...aggCols, ...staffCols];
};
const searchButton = async () => {
  try {
    store.state.loading = true;
    initGrid();

    // 직원할인 설정 그룹만 새 조회, 다른 그룹은 기존 조회 그대로
    const fetchRecord = staffDcGroup.value ? getCustRecord2 : getCustRecord;
    const res = await fetchRecord(
      store.state.userData.lngStoreGroup,
      searchNum.value,
      sDate.value,
      eDate.value,
      cond.value == true ? 1 : 0,
      cond2.value == true ? 1 : 0
    );
    await loadStaffDcRemain();
    if (custID.value != "" && custID.value != undefined) {
      const resPt = await getCustPointInfo(
        store.state.userData.lngStoreGroup,
        custID.value
      );

      point1.value = resPt.data.List[0].lngSalePoint;
      point2.value = resPt.data.List[0].lngUsedPoint;
      point3.value = resPt.data.List[0].lngRemPoint;
      point4.value = resPt.data.List[0].lngBonusPoint;
    }
    const list = res.data.List ?? [];
    rowData.value = list;
    ////console.log(res);
    afterSearch.value = true;
    Swal.fire({
      icon: "info",
      text: `조회가 완료되었습니다.조회건수:${list.length}`,
      confirmButtonText: "확인",
    });
  } catch (error) {
    afterSearch.value = false;
    //comsole.log(error);
  } finally {
    store.state.loading = false;
  }
};

const clickedRowData = async (e) => {
  const res = await getReceiptDataDetail2(e[1], e[2], e[0]);
  ////console.log(res);
  rowData2.value = res.data.List;
  rowData3.value = res.data.List2;
  rowData4.value = res.data.List3;
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
  if (rowData2.value.length > 0) {
    rowData2.value = [];
  }
  if (rowData3.value.length > 0) {
    rowData3.value = [];
  }
  if (rowData4.value.length > 0) {
    rowData4.value = [];
  }
  point1.value = "";
  point2.value = "";
  point3.value = "";
  point4.value = "";
  staffDcRemain.value = null;
  staffDcNotTarget.value = false;
};

//엑셀 버튼 처리 함수
const exportExcel = ref(false);
/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  documentSubTitle.value = selectedDate.value + "\n" + selectedExcelList.value;

  //documentSubTitle.value += "\n";
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

const setCond2 = (e) => {
  cond2.value = !cond2.value;
};
const setCond = (e) => {
  cond.value = !cond.value;
};
</script>

<style scoped>
/* 메인 그리드: 고정 vh 대신 뷰포트·노트북에 맞는 최소 높이 (MST/CRM10류) */
.crm02-main-grid-frame {
  min-height: min(65vh, 420px);
}

@media (max-height: 800px) {
  .crm02-main-grid-frame {
    min-height: min(52vh, 300px);
  }
}

.crm02-inline-lbl {
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(30 41 59);
  white-space: nowrap;
}

/* 1행 '기간' 라벨: 2행 .crm02-r2-cell 첫 열과 동일 폭 → 누적포인트 칸 왼쪽선과 일치 */
.crm02-r1-label-slot {
  display: grid;
  min-width: 0;
  min-height: 2rem;
  align-items: center;
  grid-template-columns: minmax(5.25rem, 6.75rem);
}

/* 2행: 4열 균등 + 셀 안 라벨|입력 2열 그리드(간격 통일) */
.crm02-search-r2 {
  align-items: stretch;
}

.crm02-r2-cell {
  display: grid;
  min-width: 0;
  min-height: 2rem;
  align-items: center;
  column-gap: 0.5rem;
  grid-template-columns: minmax(5.25rem, 6.75rem) minmax(0, 1fr);
}

.crm02-r2-label {
  display: flex;
  min-width: 0;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(30 41 59);
  text-align: center;
  white-space: nowrap;
}

.crm02-date-field :deep(> div.flex.justify-start.items-center) {
  min-height: 2rem;
  align-items: center;
}

.crm02-cust-pick {
  min-width: 0;
}

.crm02-cust-pick-input {
  border: 1px solid var(--crm02-control-border) !important;
  box-sizing: border-box;
}

.crm02-cust-pick-btn {
  box-sizing: border-box;
  display: inline-flex;
  height: 2rem;
  min-height: 2rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  border: 1px solid rgb(203 213 225);
  background-color: #fff;
  padding: 0 0.75rem;
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(55 65 81);
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

.crm02-cust-pick-btn:hover {
  background-color: rgb(248 250 252);
}

.crm02-check-label {
  display: inline-flex;
  min-height: 2rem;
  cursor: pointer;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: rgb(55 65 81);
}

.crm02-check {
  height: 1rem;
  width: 1rem;
  flex-shrink: 0;
  border-radius: 0.25rem;
  border: 1px solid rgb(148 163 184);
}

.crm02-search-panel .crm02-sg-input {
  border: 1px solid var(--crm02-control-border) !important;
  box-sizing: border-box;
}

.crm02-search-panel .crm02-sg-input:focus {
  border-color: #3b82f6 !important;
}

/* 조회 결과 전용 — 비활성 톤 유지(브라우저 기본 흐림 완화) */
.crm02-search-panel .crm02-pt-readonly:disabled {
  cursor: default;
  opacity: 1;
}

.crm02-search-panel .crm02-date-field :deep(input[type="date"]) {
  border: 1px solid var(--crm02-control-border) !important;
  box-sizing: border-box;
}

.crm02-search-panel .crm02-date-field :deep(input[type="date"]:focus) {
  border-color: #3b82f6 !important;
}

@media (max-height: 900px) {
  .crm02-search-panel {
    margin-top: 0.25rem !important;
  }

  .crm02-search-r1,
  .crm02-search-r2 {
    padding-top: 0.5rem !important;
    padding-bottom: 0.5rem !important;
  }

  .crm02-search-r2 {
    gap: 0.5rem !important;
  }
}

/* ── 직원할인 월별 사용 현황 팝업 (body Teleport, z-index 10050) ── */
.crm02-sdm-backdrop {
  position: fixed;
  inset: 0;
  z-index: 10050;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgb(15 23 42 / 0.45);
}

/* 위치·크기는 useFloatPopup 이 style 로 줌 (기본 72rem x 44rem, 끌어서 이동·모서리로 크기 조절) */
.crm02-sdm-popup {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 0.75rem;
  background: #fff;
  box-shadow: 0 20px 40px -12px rgb(15 23 42 / 0.35);
}

.crm02-sdm-head {
  cursor: move;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid rgb(226 232 240);
  background: linear-gradient(to right, rgb(248 250 252), rgb(241 245 249));
}

.crm02-sdm-title {
  font-size: 1.0625rem;
  font-weight: 700;
  color: rgb(15 23 42);
}

.crm02-sdm-actions {
  display: flex;
  gap: 0.5rem;
  cursor: default;
}

/* 열기·닫기 효과 : 배경은 서서히, 창은 살짝 커지며 떠오름 */
.crm02-sdm-enter-active,
.crm02-sdm-leave-active {
  transition: opacity 0.2s ease;
}

.crm02-sdm-enter-active .crm02-sdm-popup,
.crm02-sdm-leave-active .crm02-sdm-popup {
  transition: transform 0.24s cubic-bezier(0.2, 0.9, 0.3, 1.15), opacity 0.2s ease;
}

.crm02-sdm-enter-from,
.crm02-sdm-leave-to {
  opacity: 0;
}

.crm02-sdm-enter-from .crm02-sdm-popup,
.crm02-sdm-leave-to .crm02-sdm-popup {
  opacity: 0;
  transform: translateY(14px) scale(0.94);
}

/* 오른쪽 아래 크기 조절 손잡이 (STK32_001INS 와 같은 모양) */
.crm02-sdm-resize {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 16px;
  height: 16px;
  cursor: nwse-resize;
  background: linear-gradient(
    135deg,
    transparent 50%,
    #94a3b8 50%,
    #94a3b8 62%,
    transparent 62%,
    transparent 74%,
    #94a3b8 74%
  );
}

.crm02-sdm-loading {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(255 255 255 / 0.6);
  font-size: 0.9375rem;
  font-weight: 600;
  color: rgb(30 64 175);
}

/* 3칸 : 왼쪽 조회월·오른쪽 사용 / 전체 = 내용 폭, 가운데 = 남은 폭 → 필터가 두 항목 사이 가운데 (월 입력칸이 필터와 겹치지 않음) */
.crm02-sdm-cond {
  display: grid;
  grid-template-columns: max-content minmax(0, 1fr) max-content;
  align-items: center;
  column-gap: 1rem;
  margin: 0.75rem 1rem 0;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  background: rgb(229 231 235);
  font-size: 0.875rem;
}

.crm02-sdm-lbl {
  margin-right: 0.25rem;
  white-space: nowrap;
  font-weight: 600;
  color: rgb(30 41 59);
}

.crm02-sdm-month {
  box-sizing: border-box;
  height: 2rem;
  width: 9.5rem;
  padding: 0 0.5rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  background: #fff;
}

.crm02-sdm-cond-left,
.crm02-sdm-cond-center {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
}

.crm02-sdm-cond-left {
  justify-self: start;
}

.crm02-sdm-cond-center {
  justify-self: center;
  max-width: 100%;
}

.crm02-sdm-filter {
  box-sizing: border-box;
  height: 2rem;
  width: 14rem;
  min-width: 8rem;
  flex: 0 1 14rem;
  padding: 0 0.5rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  background: #fff;
}

.crm02-sdm-filter:focus,
.crm02-sdm-month:focus {
  border-color: #3b82f6;
  outline: none;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.25);
}


/* 사용 / 전체 : 오른쪽 끝 */
.crm02-sdm-note {
  justify-self: end;
  white-space: nowrap;
  font-size: 0.8125rem;
  color: rgb(71 85 105);
}

.crm02-sdm-table-wrap {
  flex: 1 1 auto;
  min-height: 0;
  margin: 0.75rem 1rem 1rem;
  overflow: auto;
  border: 1px solid rgb(203 213 225);
}

.crm02-sdm-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.crm02-sdm-table th {
  position: sticky;
  top: 0;
  z-index: 1;
  padding: 0.375rem 0.5rem;
  border-right: 1px solid rgb(255 255 255 / 0.28);
  background: #545876;
  color: #fff;
  font-weight: 600;
  white-space: nowrap;
}

/* 세로 줄 : 칸마다 오른쪽 선, 사원명 뒤(월 시작)는 진하게 */
.crm02-sdm-table td {
  padding: 0.3rem 0.5rem;
  border-right: 1px solid rgb(226 232 240);
  border-bottom: 1px solid rgb(226 232 240);
  text-align: center;
  white-space: nowrap;
}

.crm02-sdm-table th:last-child,
.crm02-sdm-table td:last-child {
  border-right: none;
}

.crm02-sdm-table th.crm02-sdm-col-name,
.crm02-sdm-table td.crm02-sdm-col-name {
  border-right: 2px solid rgb(148 163 184);
}

.crm02-sdm-table tfoot td[colspan] {
  border-right: 2px solid rgb(148 163 184);
}

.crm02-sdm-table .crm02-sdm-col-card,
.crm02-sdm-table .crm02-sdm-col-name {
  text-align: left;
}

.crm02-sdm-table tbody tr:hover td {
  background: rgb(239 246 255);
}

.crm02-sdm-table td.is-this-month {
  background: rgb(254 252 232);
}

.crm02-sdm-table th.is-this-month {
  background: #3b4466;
}

.crm02-sdm-table td.is-full {
  font-weight: 700;
  color: rgb(220 38 38);
}

.crm02-sdm-table td.is-zero {
  color: rgb(148 163 184);
}

.crm02-sdm-table tfoot td {
  position: sticky;
  bottom: 0;
  background: rgb(207 232 245);
  font-weight: 700;
}

.crm02-sdm-empty {
  padding: 3rem 1rem;
  text-align: center;
  color: rgb(100 116 139);
}
</style>
