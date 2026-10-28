<!-- /*--############################################################################
# Filename : CRM60_008INS.vue
# Description : 고객관리 > 전자상품권 마스터 관리 > 전자상품권 출고
# Date :2025-06-20
# Author : 권맑음
################################################################################*/ -->
<template>
  <div class="flex h-full min-h-0 flex-col pl-5" @click="handleParentClick">
    <div
      class="flex w-full shrink-0 items-center justify-between overflow-y-hidden">
      <PageName></PageName>
      <div class="mr-9 flex justify-center space-x-2 pr-5">
        <button type="button" class="button search md:w-auto w-14" @click="searchButton">
          조회
        </button>
        <button type="button" class="button new md:w-auto w-14" @click="addButton">
          출고
        </button>
        <button type="button" class="button delete md:w-auto w-14" @click="deleteButton">
          취소처리
        </button>
        <button type="button" class="button save w-auto excel" @click="excelButton">
          엑셀
        </button>
      </div>
    </div>

    <div
      class="crm6008-search-panel z-10 mt-3 w-full min-h-0 shrink-0 overflow-visible rounded-lg bg-gray-200"
      :style="{
        '--crm6008-control-border': crm6008ControlBorder,
        '--crm6008-col-gap': crm6008ColGutter,
        '--crm6008-item-gap': crm6008ItemGap,
        '--crm6008-label-col': crm6008LabelCol,
        '--crm6008-panel-pad-x': crm6008PanelPadX,
        '--crm6008-select-w': crm6008SelectW,
        '--crm6008-store-min-w': crm6008StoreMinW,
        '--crm6008-control-h': crm6008ControlH,
        '--crm6008-row-min-h': crm6008RowMinH,
      }">
      <!--
        1) 배치: 출고일자 | 매장(3콤보 넓게) | 출고상태
        2) 균등: 앞===뒤 pad, 사이 동일 gutter
      -->
      <div class="crm6008-search-grid min-w-0">
        <div class="crm6008-edge" aria-hidden="true"></div>
        <div class="crm6008-cell crm6008-cell--date">
          <div class="crm6008-lbl">출고일자</div>
          <div class="crm6008-field crm6008-date-slot min-w-0">
            <Datepicker2
              ref="datepicker"
              :main-name="'출고일자'"
              omit-main-label
              filter-bar-align
              :init-today="1"
              :init-today3="true"
              :close-pop-up="closePopUp"
              @excel-date="excelDate"
              @start-date="startDate"
              @end-date="endDate"></Datepicker2>
          </div>
        </div>
        <div class="crm6008-gutter" aria-hidden="true"></div>
        <div class="crm6008-cell crm6008-cell--store">
          <div class="crm6008-lbl">매장</div>
          <div class="crm6008-field crm6008-pick-slot min-w-0">
            <PickStore
              compact-search-bar
              :hide-group="false"
              :hide-attr="false"
              :default-store-nm="'전체'"
              :default-store="true"
              :main-name="''"
              @update:store-cd="lngStoreCode"></PickStore>
          </div>
        </div>
        <div class="crm6008-gutter" aria-hidden="true"></div>
        <div class="crm6008-cell crm6008-cell--status">
          <div class="crm6008-lbl">출고상태</div>
          <div class="crm6008-field min-w-0">
            <select v-model="cond3" class="crm6008-select">
              <option value="0">전체</option>
              <option
                v-for="i in optionList3"
                :key="i.strDCode"
                :value="i.strDCode">
                {{ i.strDName }}
              </option>
            </select>
          </div>
        </div>
        <div class="crm6008-edge" aria-hidden="true"></div>
      </div>
    </div>

    <div class="mt-2 flex min-h-0 min-w-0 flex-1 flex-col">
      <div class="relative min-h-0 w-full flex-1">
        <Realgrid
          class="h-full min-h-0 w-full"
          :progname="'CRM60_008INS_VUE'"
          :progid="1"
          :rowData="rowData"
          :reload="reload"
          @clickedRowData="clickedRowData"
          :documentTitle="'CRM60_008INS'"
          :documentSubTitle="documentSubTitle"
          :rowStateeditable="false"
          :cellFontColorByValue="statusFontColorRules"
          hyphen-date-mask-as-text
          :exporttoExcel="exportExcel">
        </Realgrid>
      </div>
    </div>
  </div>

  <Teleport to="body">
    <!-- 마스크 클릭으로 닫지 않음 (006 판매등록과 동일 — 닫기 버튼만) -->
    <div v-if="visible" class="crm6008-popup-mask">
      <div
        class="crm6008-popup"
        role="dialog"
        aria-modal="true"
        :style="releasePopupStyle">
        <div
          class="crm6008-popup-head crm6008-popup-head--drag"
          @mousedown="onReleasePopupDrag">
          <h2 class="crm6008-popup-title">상품권 출고(분실) 등록</h2>
          <div class="crm6008-popup-actions">
            <button type="button" class="pnc-sub-btn" @click="saveButton">
              <svg
                class="pnc-sub-btn__icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false">
                <path
                  d="M5 13l4 4L19 7"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
              출고등록
            </button>
            <button
              type="button"
              class="pnc-sub-btn pnc-sub-btn--gray"
              @click="closeReleasePopup">
              <svg
                class="pnc-sub-btn__icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round" />
              </svg>
              닫기
            </button>
          </div>
        </div>

        <div class="crm6008-form-grid w-full">
          <div class="crm6008-form-label crm6008-form-label--required">
            <span class="crm6008-req" aria-hidden="true">*</span>매장
          </div>
          <div class="crm6008-form-value crm6008-form-value--pick">
            <PickStore
              compact-search-bar
              :compact-store-combo-max-rem="40"
              :hide-group="false"
              :hide-attr="false"
              :main-name="''"
              @update:store-cd="lngStoreCode2"></PickStore>
          </div>

          <div class="crm6008-form-label crm6008-form-label--required">
            <span class="crm6008-req" aria-hidden="true">*</span>유형
          </div>
          <div class="crm6008-form-value">
            <select
              v-model="pcond21"
              class="crm6008-control"
              @change="onReleaseStatusChange">
              <option value="0">선택</option>
              <option value="10">출고</option>
              <option value="12">분실</option>
            </select>
          </div>

          <div class="crm6008-form-label crm6008-form-label--required">
            <span class="crm6008-req" aria-hidden="true">*</span>일자
          </div>
          <div class="crm6008-form-value">
            <input v-model="pcond22" type="date" class="crm6008-control" />
          </div>

          <div class="crm6008-form-label crm6008-form-label--required">
            <span class="crm6008-req" aria-hidden="true">*</span>시작번호
          </div>
          <div class="crm6008-form-value">
            <input v-model="pcond23" type="number" class="crm6008-control" />
          </div>

          <div class="crm6008-form-label crm6008-form-label--required">
            <span class="crm6008-req" aria-hidden="true">*</span>끝번호
          </div>
          <div class="crm6008-form-value">
            <input v-model="pcond24" type="number" class="crm6008-control" />
          </div>

          <!-- 레거시: StoreGroup 1954 + 유형 12/13 일 때만 증빙파일 -->
          <template v-if="needReleaseProofFile">
            <div class="crm6008-form-label crm6008-form-label--required">
              <span class="crm6008-req" aria-hidden="true">*</span>증빙파일
            </div>
            <div class="crm6008-form-value crm6008-form-value--file">
              <input
                ref="releaseFileInput"
                type="file"
                class="crm6008-file-input"
                @change="onReleaseFileChange" />
              <span class="crm6008-file-name">{{
                releaseFileName || "파일을 선택해 주십시오."
              }}</span>
            </div>
          </template>
        </div>
      </div>
    </div>
  </Teleport>

  <Teleport to="body">
    <div v-if="visible2" class="crm6008-popup-mask">
      <div
        class="crm6008-popup crm6008-popup--cancel"
        role="dialog"
        aria-modal="true"
        :style="cancelPopupStyle">
        <div
          class="crm6008-popup-head crm6008-popup-head--drag"
          @mousedown="onCancelPopupDrag">
          <h2 class="crm6008-popup-title">상품권 출고(분실) 취소</h2>
          <div class="crm6008-popup-actions">
            <button type="button" class="pnc-sub-btn" @click="saveButton2">
              <!-- 출고취소: 원 + 사선 (아이콘 빨강) -->
              <svg
                class="pnc-sub-btn__icon crm6008-cancel-icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false">
                <circle
                  cx="12"
                  cy="12"
                  r="8.25"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2" />
                <path
                  d="M7.2 7.2l9.6 9.6"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round" />
              </svg>
              출고취소
            </button>
            <button
              type="button"
              class="pnc-sub-btn pnc-sub-btn--gray"
              @click="closeCancelPopup">
              <svg
                class="pnc-sub-btn__icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round" />
              </svg>
              닫기
            </button>
          </div>
        </div>

        <div class="crm6008-form-grid w-full">
          <div class="crm6008-form-label crm6008-form-label--required">
            <span class="crm6008-req" aria-hidden="true">*</span>취소일자
          </div>
          <div class="crm6008-form-value">
            <input v-model="pcond1" type="date" class="crm6008-control" />
          </div>

          <div class="crm6008-form-label crm6008-form-label--required">
            <span class="crm6008-req" aria-hidden="true">*</span>유형
          </div>
          <div class="crm6008-form-value">
            <select v-model="pcond2" class="crm6008-control">
              <option value="0">선택</option>
              <option value="10">출고</option>
              <option value="12">분실</option>
            </select>
          </div>

          <div class="crm6008-form-label crm6008-form-label--required">
            <span class="crm6008-req" aria-hidden="true">*</span>시작번호
          </div>
          <div class="crm6008-form-value">
            <input v-model="pcond3" type="number" class="crm6008-control" />
          </div>

          <div class="crm6008-form-label crm6008-form-label--required">
            <span class="crm6008-req" aria-hidden="true">*</span>끝번호
          </div>
          <div class="crm6008-form-value">
            <input v-model="pcond4" type="number" class="crm6008-control" />
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { getCommonList } from "@/api/common";
import {
  getCreditCompanyList,
  getGftLedgerReleaseList,
  getGftReleaseCancelChk,
  getGftReleaseValidChk,
  saveGftCardReleaseCancel,
  saveGftCardReleaseEnroll,
  saveGftCardSaleEnroll,
} from "@/api/micrm";
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

import { insertPageLog } from "@/customFunc/customFunc";
/**
 *  경고창 호출 라이브러리
 *  */

import Swal from "sweetalert2";
/*
 * 공통 표준  Function
 */

import { computed, onMounted, onUnmounted, ref, watch } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";

const store = useStore();
const crm6008ControlBorder = "#cbd5e1";
const crm6008ColGutter = "1.25rem";
const crm6008ItemGap = "0.75rem";
const crm6008LabelCol = "5.5rem";
/** 조회 AREA 앞·뒤 pad (기존 2rem → 3배) */
const crm6008PanelPadX = "6rem";
const crm6008SelectW = "13.2rem";
/** 매장 PickStore(그룹·속성·매장) 최소 폭 — 기존 28rem의 80% */
const crm6008StoreMinW = "22.4rem";
const crm6008ControlH = "2rem";
const crm6008RowMinH = "2rem";

/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getCommonList(297);

  optionList3.value = res.data.List;
  //   const res2 = await getInitGftData(store.state.userData.lngStoreGroup);

  //   optionList.value = res2.data.List;
  //   optionList2.value = res2.data.List2;

  pcond22.value = today.value.toISOString().split("T")[0];
  pcond1.value = today.value.toISOString().split("T")[0];
});

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);
const selectedCond = ref(0);
const condValue = ref(0);
const cond = ref(0);
const cond2 = ref(null);
/** 로컬 오늘(YYYY-MM-DD). toISOString은 UTC라 한국에서 전날로 나갈 수 있음 */
const todayYmd = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};
const pcond21 = ref(0);
const pcond22 = ref(todayYmd());
const pcond23 = ref("");
const pcond24 = ref("");
const today = ref(new Date());
const cond3 = ref(0);
const pcond1 = ref(todayYmd());
const pcond2 = ref("0");
const pcond3 = ref("");
const pcond4 = ref("");
const pcond5 = ref(0);
const pcond6 = ref("");
const pcond7 = ref("");
const cond4 = ref();
const optionList = ref([]);
const optionList2 = ref([]);
const optionList3 = ref([]);
const optionList4 = ref([]);
const datepicker = ref(null);
const closePopUp = ref(false);

const sd = ref("");
const sd2 = ref("");
const ed = ref("");
const ed2 = ref("");
const selectedDate = ref("");
const startDate = (e) => {
  sd.value = e;
};
const endDate = (e) => {
  ed.value = e;
};

const excelDate = (e) => {
  selectedDate.value = e;
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
const visible = ref(false);
const visible2 = ref(false);

/** PickStore append-to-body 메뉴 z-index — 팝업(10050) 뒤로 깔림 방지 */
const CRM6008_POP_BODY_CLASS = "crm6008-pop-active";
watch([visible, visible2], () => {
  if (typeof document === "undefined") return;
  document.body.classList.toggle(
    CRM6008_POP_BODY_CLASS,
    !!(visible.value || visible2.value)
  );
});
onUnmounted(() => {
  if (typeof document !== "undefined") {
    document.body.classList.remove(CRM6008_POP_BODY_CLASS);
  }
});

/** 레거시 Div0_cmbGftStatus: StoreGroup 1954 + 유형 12/13 → 증빙파일 */
const RELEASE_PROOF_GROUP = "1954";
const RELEASE_PROOF_STATUS = new Set(["12", "13"]);
const releaseFileName = ref("");
const releaseFileInput = ref(null);
const needReleaseProofFile = computed(() => {
  const g = String(store.state.userData?.lngStoreGroup ?? "");
  const st = String(pcond21.value ?? "");
  return g === RELEASE_PROOF_GROUP && RELEASE_PROOF_STATUS.has(st);
});
const releaseStatusLabel = computed(() => {
  const st = String(pcond21.value ?? "");
  if (st === "10") return "출고";
  if (st === "12") return "분실";
  if (st === "13") return "파손";
  return "처리";
});
const cancelStatusLabel = computed(() => {
  const st = String(pcond2.value ?? "");
  if (st === "10") return "출고";
  if (st === "12") return "분실";
  if (st === "13") return "파손";
  return "처리";
});
const clearReleaseFile = () => {
  releaseFileName.value = "";
  if (releaseFileInput.value) releaseFileInput.value.value = "";
};
const onReleaseStatusChange = () => {
  clearReleaseFile();
};
const onReleaseFileChange = (e) => {
  const f = e?.target?.files?.[0];
  releaseFileName.value = f ? f.name : "";
};

const resetReleaseForm = () => {
  selectedStores2.value = null;
  pcond21.value = 0;
  pcond22.value = todayYmd();
  pcond23.value = "";
  pcond24.value = "";
  clearReleaseFile();
};

const resetCancelForm = () => {
  pcond1.value = todayYmd();
  pcond2.value = "0";
  pcond3.value = "";
  pcond4.value = "";
};

/** 팝업 드래그 (제목 줄) */
const releasePopupOffset = ref({ x: 0, y: 0 });
const cancelPopupOffset = ref({ x: 0, y: 0 });
const releasePopupStyle = computed(() => ({
  transform: `translate(${releasePopupOffset.value.x}px, ${releasePopupOffset.value.y}px)`,
}));
const cancelPopupStyle = computed(() => ({
  transform: `translate(${cancelPopupOffset.value.x}px, ${cancelPopupOffset.value.y}px)`,
}));

const startPopupDrag = (event, offsetRef) => {
  if (event.button !== 0) return;
  if (event.target.closest("button")) return;
  event.preventDefault();
  const startX = event.clientX;
  const startY = event.clientY;
  const ox = offsetRef.value.x;
  const oy = offsetRef.value.y;
  const onMove = (ev) => {
    offsetRef.value = {
      x: ox + ev.clientX - startX,
      y: oy + ev.clientY - startY,
    };
  };
  const onUp = () => {
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("mouseup", onUp);
  };
  window.addEventListener("mousemove", onMove);
  window.addEventListener("mouseup", onUp);
};

const onReleasePopupDrag = (e) => startPopupDrag(e, releasePopupOffset);
const onCancelPopupDrag = (e) => startPopupDrag(e, cancelPopupOffset);

const closeReleasePopup = () => {
  visible.value = false;
  resetReleaseForm();
  releasePopupOffset.value = { x: 0, y: 0 };
};

const closeCancelPopup = () => {
  visible2.value = false;
  resetCancelForm();
  cancelPopupOffset.value = { x: 0, y: 0 };
};

const warn = (text) =>
  Swal.fire({
    title: "경고",
    text,
    icon: "warning",
    confirmButtonText: "확인",
  });

const addButton = () => {
  if (afterSearch.value == false) {
    warn("조회를 먼저 해주세요.");
    return;
  }
  resetReleaseForm();
  releasePopupOffset.value = { x: 0, y: 0 };
  visible.value = true;
};
const searchButton = async () => {
  if (sd.value == null || ed.value == null) {
    Swal.fire({
      title: "경고",
      text: "출고일자을 선택하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  try {
    store.state.loading = true;
    initGrid();

    const res = await getGftLedgerReleaseList(
      store.state.userData.lngStoreGroup,
      selectedStores.value ?? 0,
      sd.value,
      ed.value,
      cond3.value
    );
    const list = Array.isArray(res?.data?.List) ? res.data.List : [];
    rowData.value = list.map(normalizeReleaseRow);

    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
  } finally {
    store.state.loading = false;
  }
};

/**
 * 출고일자(dtmRelease)·취소일자(dtmVoid) → yyyy-MM-dd.
 * 그리드 마스크 ####-##-## 는 hyphen-date-mask-as-text 로 문자 표시.
 */
const fmtYmd = (v) => {
  if (v == null || v === "") return "";
  if (typeof v === "number" && Number.isFinite(v)) {
    const digits = String(Math.trunc(v));
    if (digits.length === 8) {
      return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
    }
  }
  if (v instanceof Date && !Number.isNaN(v.getTime())) {
    const y = v.getFullYear();
    const m = String(v.getMonth() + 1).padStart(2, "0");
    const d = String(v.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  const s = String(v).trim();
  if (!s) return "";
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  const msDate = s.match(/\/Date\((-?\d+)\)\//);
  if (msDate) return fmtYmd(new Date(Number(msDate[1])));
  if (/^\d{8}(?:\D|$)/.test(s)) {
    const d8 = s.slice(0, 8);
    const year = Number(d8.slice(0, 4));
    if (year >= 1900 && year <= 2100) {
      return `${d8.slice(0, 4)}-${d8.slice(4, 6)}-${d8.slice(6, 8)}`;
    }
  }
  if (s.includes("T")) return s.split("T")[0];
  const parsed = Date.parse(s);
  if (!Number.isNaN(parsed)) {
    return fmtYmd(new Date(parsed));
  }
  if (s.includes(" ")) return s.split(" ")[0];
  return s.slice(0, 10);
};

const pickRowField = (r, names) => {
  if (!r || typeof r !== "object") return "";
  const keys = Object.keys(r);
  for (const name of names) {
    const hit = keys.find((k) => k.toLowerCase() === String(name).toLowerCase());
    if (hit == null) continue;
    const v = r[hit];
    if (v != null && v !== "") return v;
  }
  return "";
};

const normalizeReleaseRow = (r) => {
  const dtmRelease = fmtYmd(
    pickRowField(r, [
      "dtmRelease",
      "dtmReleaseDate",
      "dtmOutDate",
      "ReleaseDate",
      "dtmReleased",
    ])
  );
  const dtmVoid = fmtYmd(
    pickRowField(r, [
      "dtmVoid",
      "dtmVoidDate",
      "dtmCancel",
      "dtmCancelDate",
      "dtmReleaseVoidDate",
      "CancelDate",
      "VoidDate",
    ])
  );
  return {
    ...r,
    dtmRelease,
    dtmVoid,
    /* mstGridInfo 컬럼명이 Date 접미사인 경우 대비 */
    dtmReleaseDate: dtmRelease || pickRowField(r, ["dtmReleaseDate"]),
    dtmCancelDate: dtmVoid || pickRowField(r, ["dtmCancelDate"]),
    dtmVoidDate: dtmVoid || pickRowField(r, ["dtmVoidDate"]),
  };
};

/** 출고취소 상태 글자 파란색 */
const statusFontColorRules = [
  { field: "strGftStatus", values: ["출고취소"], color: "#2563eb" },
  { field: "strStatus", values: ["출고취소"], color: "#2563eb" },
];

/* 매장 컴포넌트 관련 함수 */
const selectedGroup = ref();
const selectedStores = ref();
const selectedStores2 = ref();
const selectedStoreAttrs = ref();

const askConfirm = (text) =>
  Swal.fire({
    title: "확인",
    text,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "예",
    cancelButtonText: "아니요",
  });

const cardRangeInvalid = (from, to) => {
  const a = String(from ?? "").trim();
  const b = String(to ?? "").trim();
  if (!a || !b) return true;
  try {
    return BigInt(a) > BigInt(b);
  } catch {
    return Number(a) > Number(b);
  }
};

const unwrapAsmx = (res) => {
  const d = res?.data;
  if (d == null) return {};
  if (typeof d.d === "string") {
    try {
      return JSON.parse(d.d);
    } catch {
      return d;
    }
  }
  if (d.d && typeof d.d === "object") return d.d;
  return d;
};

const doReleaseSave = async () => {
  const res = await saveGftCardReleaseEnroll(
    store.state.userData.lngStoreGroup,
    selectedStores2.value,
    pcond21.value,
    pcond23.value,
    pcond24.value,
    pcond22.value,
    store.state.userData.lngSequence
  );
  const payload = unwrapAsmx(res);
  if (payload.RESULT_CD != null && String(payload.RESULT_CD) !== "00") {
    throw new Error(payload.RESULT_NM || "출고 등록에 실패했습니다.");
  }
  const cnt = payload.lngReleaseCnt ?? payload.RELEASE_CNT;
  const statusNm = releaseStatusLabel.value;
  const text =
    cnt != null && cnt !== ""
      ? `${cnt} 건의 상품권이 ${statusNm}처리 되었습니다.`
      : `상품권이 ${statusNm}처리 되었습니다.`;
  await Swal.fire({
    title: "성공",
    text,
    icon: "success",
    confirmButtonText: "확인",
  });
  visible.value = false;
  resetReleaseForm();
  releasePopupOffset.value = { x: 0, y: 0 };
  initGrid();
  await searchButton();
};

const saveButton = async () => {
  if (
    selectedStores2.value == null ||
    selectedStores2.value === "" ||
    selectedStores2.value == 0
  ) {
    await warn("매장을 선택해 주십시오.");
    return;
  }
  if (pcond21.value == null || pcond21.value === "" || pcond21.value == 0) {
    await warn("유형을 선택해주십시오");
    return;
  }
  if (!pcond22.value) {
    await warn("일자를 선택해주세요.");
    return;
  }
  if (pcond23.value === "" || pcond23.value == null) {
    await warn("상품권 번호를 입력 해 주십시오.");
    return;
  }
  if (pcond24.value === "" || pcond24.value == null) {
    await warn("상품권 번호를 입력 해 주십시오.");
    return;
  }
  if (cardRangeInvalid(pcond23.value, pcond24.value)) {
    await warn("상품권 번호를 확인 해 주십시오.");
    return;
  }

  try {
    store.state.loading = true;
    const chkRes = await getGftReleaseValidChk(
      store.state.userData.lngStoreGroup,
      selectedStores2.value,
      pcond21.value,
      pcond23.value,
      pcond24.value
    );
    const chk = unwrapAsmx(chkRes);
    if (chk.RESULT_CD != null && String(chk.RESULT_CD) !== "00") {
      await warn(chk.RESULT_NM || "출고 유효성 확인에 실패했습니다.");
      return;
    }
    const validChk = String(
      chk.VALID_CHK ?? chk.List?.[0]?.VALID_CHK ?? ""
    );

    if (validChk === "1001") {
      const ok = await askConfirm(
        "상품권 번호 범위 중 처리 불가한 번호가 있습니다. 유효한 번호만 출고 하시겠습니까?"
      );
      if (!ok.isConfirmed) return;
      await doReleaseSave();
      return;
    }
    if (needReleaseProofFile.value && !releaseFileName.value) {
      await warn(
        `${releaseStatusLabel.value}처리에 대한 증빙파일를 첨부해 주십시오.`
      );
      return;
    }
    if (validChk === "1002") {
      await warn(
        "상품권 번호 범위 중 증정용 상품권이 존재 합니다. 확인후 다시 등록해 주십시오."
      );
      return;
    }
    if (validChk === "9999") {
      await warn("상품권이 존재하지 않습니다.");
      return;
    }

    const ok = await askConfirm(
      `선택한 매장에 상품권을 ${releaseStatusLabel.value}처리 하시겠습니까?`
    );
    if (!ok.isConfirmed) return;
    await doReleaseSave();
  } catch (error) {
    await Swal.fire({
      title: "오류 발생",
      text:
        error?.message ||
        "출고 등록 중 오류가 발생했습니다. (ValidChk API·SP 확인 필요)",
      icon: "error",
      confirmButtonText: "확인",
    });
  } finally {
    store.state.loading = false;
  }
};

const doCancelSave = async () => {
  const res = await saveGftCardReleaseCancel(
    store.state.userData.lngStoreGroup,
    pcond2.value,
    pcond3.value,
    pcond4.value,
    pcond1.value,
    store.state.userData.lngSequence
  );
  const payload = unwrapAsmx(res);
  if (payload.RESULT_CD != null && String(payload.RESULT_CD) !== "00") {
    throw new Error(payload.RESULT_NM || "출고 취소에 실패했습니다.");
  }
  const cnt = payload.lngReleaseVoidCnt ?? payload.RELEASE_VOID_CNT;
  const text =
    cnt != null && cnt !== ""
      ? `${cnt} 건의 상품권이 취소 처리 되었습니다.`
      : "정상 취소되었습니다.";
  await Swal.fire({
    title: "성공",
    text,
    icon: "success",
    confirmButtonText: "확인",
  });
  visible2.value = false;
  resetCancelForm();
  cancelPopupOffset.value = { x: 0, y: 0 };
  await searchButton();
};

const saveButton2 = async () => {
  if (!pcond1.value) {
    await warn("취소일자를 선택해주세요.");
    return;
  }
  if (pcond2.value == null || pcond2.value === "" || pcond2.value == 0) {
    await warn("유형을 선택해주세요");
    return;
  }
  if (pcond3.value === "" || pcond3.value == null) {
    await warn("상품권 번호를 입력 해 주십시오.");
    return;
  }
  if (pcond4.value === "" || pcond4.value == null) {
    await warn("상품권 번호를 입력 해 주십시오.");
    return;
  }
  if (cardRangeInvalid(pcond3.value, pcond4.value)) {
    await warn("상품권 번호를 확인 해 주십시오.");
    return;
  }

  try {
    store.state.loading = true;
    const chkRes = await getGftReleaseCancelChk(
      store.state.userData.lngStoreGroup,
      pcond2.value,
      pcond3.value,
      pcond4.value
    );
    const chk = unwrapAsmx(chkRes);
    if (chk.RESULT_CD != null && String(chk.RESULT_CD) !== "00") {
      await warn(chk.RESULT_NM || "취소 유효성 확인에 실패했습니다.");
      return;
    }
    const cancleChk = String(
      chk.CANCLE_CHK ?? chk.List?.[0]?.CANCLE_CHK ?? ""
    );

    if (cancleChk === "1001") {
      const ok = await askConfirm(
        `상품권 번호 범위 중 ${cancelStatusLabel.value}취소 불가한 번호가 있습니다. 유효한 번호만 취소 하시겠습니까?`
      );
      if (!ok.isConfirmed) return;
      await doCancelSave();
      return;
    }
    if (cancleChk === "9999") {
      await warn(
        `${cancelStatusLabel.value} 취소 가능한 상품권이 존재하지 않습니다.`
      );
      return;
    }

    const ok = await askConfirm("해당 상품권을 취소 하시겠습니까?");
    if (!ok.isConfirmed) return;
    await doCancelSave();
  } catch (error) {
    await Swal.fire({
      title: "오류 발생",
      text:
        error?.message ||
        "출고 취소 중 오류가 발생했습니다. (CancleChk API·SP 확인 필요)",
      icon: "error",
      confirmButtonText: "확인",
    });
  } finally {
    store.state.loading = false;
  }
};
/**
 * 페이지 매장 코드 세팅
 */

const lngStoreCode = async (e) => {
  //initGrid();
  selectedStores.value = e;
  ////console.log(e);
};
const lngStoreCode2 = async (e) => {
  //initGrid();
  selectedStores2.value = e;
  ////console.log(e);
};

/**
 * 그리드 초기화
 */

const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
  resetReleaseForm();
  resetCancelForm();
};

//엑셀 버튼 처리 함수
const exportExcel = ref(false);
/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  documentSubTitle.value = selectedDate.value;

  exportExcel.value = !exportExcel.value;
};

// 엑셀 추출
const documentSubTitle = ref("");
const selectedExcelList = ref("");

const selectedExcelStore = ref("");
/**
 * 엑셀용 매장 세팅 함수
 */
const selectedCardNo = ref("");
const selectedDate2 = ref("");
const selectedStoreCd = ref("");
const clickedRowData = (e) => {
  ////console.log(e);
  selectedCardNo.value = e[15];
  selectedDate2.value = e[3];
  selectedStoreCd.value = e[14];
};
const deleteButton = () => {
  if (afterSearch.value == false) {
    warn("조회를 먼저 해주세요.");
    return;
  }
  resetCancelForm();
  cancelPopupOffset.value = { x: 0, y: 0 };
  visible2.value = true;
};
const excelStore = (e) => {
  selectedExcelStore.value = e;
  //comsole.log(e);
};
const excelList = (e) => {
  selectedExcelList.value = e;
  //comsole.log(e);
};
</script>

<style scoped>
.crm6008-search-panel {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  padding-block: 0.75rem;
  padding-inline: 0;
  overflow-x: visible;
}

.crm6008-search-grid {
  box-sizing: border-box;
  display: grid;
  width: 100%;
  min-width: 0;
  align-items: center;
  column-gap: 0;
  /* edge | 일자 | gutter | 매장(넓게) | gutter | 상태 | edge */
  grid-template-columns:
    var(--crm6008-panel-pad-x)
    max-content
    minmax(var(--crm6008-col-gap), 1fr)
    minmax(var(--crm6008-store-min-w), 2.2fr)
    minmax(var(--crm6008-col-gap), 1fr)
    max-content
    var(--crm6008-panel-pad-x);
  padding-left: 0;
  padding-right: 0;
}

.crm6008-edge,
.crm6008-gutter {
  min-width: 0;
  pointer-events: none;
}

.crm6008-cell {
  box-sizing: border-box;
  display: grid;
  width: max-content;
  max-width: 100%;
  min-width: 0;
  min-height: var(--crm6008-row-min-h);
  grid-template-columns: max-content max-content;
  column-gap: var(--crm6008-item-gap);
  align-items: center;
}

.crm6008-cell--store {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  grid-template-columns: max-content minmax(0, 1fr);
}

.crm6008-cell--status {
  width: max-content;
}

.crm6008-lbl {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: max-content;
  min-height: var(--crm6008-row-min-h);
  font-size: 0.9375rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
  white-space: nowrap;
}

.crm6008-field {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  width: max-content;
  max-width: 100%;
  min-width: 0;
  min-height: var(--crm6008-row-min-h);
}

.crm6008-cell--store .crm6008-field {
  width: 100%;
}

.crm6008-select {
  box-sizing: border-box;
  width: var(--crm6008-select-w);
  min-width: 0;
  height: var(--crm6008-control-h);
  min-height: var(--crm6008-control-h);
  max-height: var(--crm6008-control-h);
  padding: 0 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: rgb(30 41 59);
  background: #fff;
  border: 1px solid var(--crm6008-control-border, #cbd5e1);
  border-radius: 0.375rem;
}

.crm6008-select:focus {
  border-color: #3b82f6;
  outline: none;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.35);
}

.crm6008-date-slot :deep(> div.flex.justify-start.items-center) {
  margin: 0 !important;
  width: max-content !important;
  max-width: 100%;
  min-height: var(--crm6008-row-min-h);
  align-items: center;
}

.crm6008-date-slot :deep(input[type="date"]) {
  box-sizing: border-box;
  height: var(--crm6008-control-h);
  min-height: var(--crm6008-control-h);
  max-height: var(--crm6008-control-h);
  border: 1px solid var(--crm6008-control-border, #cbd5e1);
  border-radius: 0.375rem;
  background: #fff;
}

.crm6008-date-slot :deep(input[type="date"]:focus) {
  border-color: #3b82f6;
}

.crm6008-date-slot :deep(div.inline-flex.h-8),
.crm6008-date-slot :deep(button) {
  height: var(--crm6008-control-h) !important;
  min-height: var(--crm6008-control-h) !important;
}

.crm6008-pick-slot {
  width: 100%;
  max-width: 100%;
  min-width: 0;
}

.crm6008-pick-slot :deep(> div.flex.text-base) {
  width: 100%;
  min-width: 0;
  min-height: var(--crm6008-row-min-h);
  align-items: center;
  gap: 0.35rem !important;
}

.crm6008-pick-slot :deep(> div.flex > div:first-child) {
  display: none;
}

.crm6008-pick-slot :deep(.relative.min-w-0.flex-1) {
  flex: 1 1 auto !important;
  min-width: 0 !important;
  max-width: 100% !important;
  width: 100% !important;
}

.crm6008-pick-slot :deep(select),
.crm6008-pick-slot :deep(.pickstore-vs-shell),
.crm6008-pick-slot :deep(.vs__dropdown-toggle) {
  box-sizing: border-box;
  width: 100% !important;
  min-width: 0 !important;
  height: var(--crm6008-control-h) !important;
  min-height: var(--crm6008-control-h) !important;
  max-height: var(--crm6008-control-h) !important;
}

.crm6008-pick-slot :deep(.pickstore-vs-shell) {
  border: 1px solid var(--crm6008-control-border, #cbd5e1) !important;
  border-radius: 0.375rem;
  background: #fff;
  overflow: hidden !important;
}

.crm6008-pick-slot :deep(select) {
  border: 1px solid var(--crm6008-control-border, #cbd5e1) !important;
  border-radius: 0.375rem;
  background: #fff;
}

.crm6008-pick-slot :deep(select:focus),
.crm6008-pick-slot :deep(.pickstore-vs-shell:focus-within) {
  border-color: #3b82f6 !important;
}

.crm6008-popup-mask {
  position: fixed;
  inset: 0;
  z-index: 10050;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(0 0 0 / 0.45);
}

.crm6008-popup {
  --crm6008-form-label-col: 6.5rem;
  --crm6008-form-row-h: 2.5rem;
  --crm6008-form-cell-py: 0.4375rem;
  --crm6008-form-font: 0.8125rem;
  --crm6008-form-control-h: 1.625rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: min(34rem, 94vw);
  max-height: min(90vh, 36rem);
  padding: 1rem 1.25rem 1.25rem;
  border-radius: 0.75rem;
  background: #fff;
  box-shadow: 0 12px 28px rgb(15 23 42 / 0.18);
  overflow: auto;
}

.crm6008-popup--cancel {
  width: min(30rem, 94vw);
  max-height: min(90vh, 28rem);
}

.crm6008-popup-head {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.crm6008-popup-head--drag {
  cursor: move;
  user-select: none;
}

.crm6008-cancel-icon {
  color: #dc2626;
}

.crm6008-popup-title {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.25rem;
  color: #111827;
}

.crm6008-popup-title::before {
  content: "";
  display: inline-block;
  flex-shrink: 0;
  width: 0.25rem;
  height: 0.9em;
  border-radius: 999px;
  background: #2563eb;
}

.crm6008-popup-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.crm6008-form-grid {
  display: grid;
  grid-template-columns: var(--crm6008-form-label-col) minmax(0, 1fr);
  grid-auto-rows: var(--crm6008-form-row-h);
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  overflow: hidden;
  background: #fff;
  flex-shrink: 0;
}

.crm6008-form-grid > * {
  box-sizing: border-box;
  min-height: var(--crm6008-form-row-h);
  align-self: stretch;
}

.crm6008-form-label {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: var(--crm6008-form-row-h);
  padding: var(--crm6008-form-cell-py) 0.375rem;
  border: 1px solid #e5e7eb;
  background: #edf2f7;
  color: #5c5c5c;
  font-size: var(--crm6008-form-font);
  font-weight: 600;
  line-height: 1.25;
  text-align: center;
  word-break: keep-all;
}

.crm6008-form-label--required {
  font-weight: 700;
}

.crm6008-req {
  color: #dc2626;
  margin-right: 0.1rem;
}

.crm6008-form-value {
  display: flex;
  align-items: center;
  min-height: var(--crm6008-form-row-h);
  min-width: 0;
  padding: var(--crm6008-form-cell-py) 0.375rem;
  border: 1px solid #e5e7eb;
  background: #fff;
}

.crm6008-form-value--pick {
  overflow: visible;
}

.crm6008-form-value--file {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  min-height: var(--crm6008-form-row-h);
}

.crm6008-file-input {
  max-width: 100%;
  font-size: var(--crm6008-form-font);
}

.crm6008-file-name {
  color: #64748b;
  font-size: var(--crm6008-form-font);
  word-break: break-all;
}

.crm6008-form-value--pick :deep(> div.flex.text-base),
.crm6008-form-value--pick :deep(> div) {
  width: 100%;
  min-width: 0;
  align-items: center;
  gap: 0.35rem !important;
}

.crm6008-form-value--pick :deep(> div.flex > div:first-child) {
  display: none;
}

.crm6008-form-value--pick :deep(.relative.min-w-0.flex-1) {
  flex: 1 1 auto !important;
  min-width: 0 !important;
  max-width: 100% !important;
  width: 100% !important;
}

.crm6008-form-value--pick :deep(select),
.crm6008-form-value--pick :deep(.pickstore-vs-shell) {
  box-sizing: border-box !important;
  width: 100% !important;
  min-width: 0 !important;
  height: var(--crm6008-form-control-h) !important;
  min-height: var(--crm6008-form-control-h) !important;
  max-height: var(--crm6008-form-control-h) !important;
  border: 1px solid #cbd5e1 !important;
  border-radius: 0.375rem !important;
  background: #fff !important;
  font-size: var(--crm6008-form-font) !important;
  line-height: 1 !important;
  overflow: hidden !important;
}

.crm6008-form-value--pick :deep(.vs__dropdown-toggle) {
  box-sizing: border-box !important;
  width: 100% !important;
  height: 100% !important;
  min-height: 0 !important;
  max-height: 100% !important;
  border: 0 !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  background: transparent !important;
  padding: 0 0.25rem !important;
}

.crm6008-form-value--pick :deep(select:focus),
.crm6008-form-value--pick :deep(.pickstore-vs-shell:focus-within) {
  border-color: #3b82f6 !important;
  outline: none;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.25);
}

.crm6008-control {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  height: var(--crm6008-form-control-h);
  min-height: var(--crm6008-form-control-h);
  max-height: var(--crm6008-form-control-h);
  padding: 0 0.5rem;
  font-size: var(--crm6008-form-font);
  line-height: 1;
  color: #1e293b;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  background: #fff;
}

.crm6008-control:focus,
.crm6008-control:focus-visible {
  border-color: #3b82f6;
  outline: none;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.25);
}

.crm6008-control:disabled {
  background: #f3f4f6;
  color: #6b7280;
  cursor: not-allowed;
}

@media (max-width: 1100px) {
  .crm6008-search-panel {
    --crm6008-panel-pad-x: 2rem;
  }

  .crm6008-search-grid {
    grid-template-columns: minmax(0, 1fr);
    justify-content: stretch;
    row-gap: 0.75rem;
    padding-left: var(--crm6008-panel-pad-x);
    padding-right: var(--crm6008-panel-pad-x);
  }

  .crm6008-edge,
  .crm6008-gutter {
    display: none;
  }

  .crm6008-cell {
    width: 100%;
    max-width: 100%;
    grid-template-columns: max-content minmax(0, 1fr);
  }

  .crm6008-field,
  .crm6008-select {
    width: 100%;
    max-width: 100%;
  }

  .crm6008-date-slot :deep(> div.flex.justify-start.items-center) {
    width: 100% !important;
  }
}
</style>
<!-- append-to-body 드롭다운은 scoped 미적용 — 팝업(10050)보다 위 -->
<style>
body.crm6008-pop-active .vs__dropdown-menu {
  z-index: 10060 !important;
}
</style>
