<!-- /*--############################################################################
# Filename : CRM60_004INS.vue
# Description : 고객관리 > 전자상품권 현황 > 전자상품권 생성
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
          신규
        </button>
        <button type="button" class="button save w-auto excel" @click="excelButton">
          엑셀
        </button>
      </div>
    </div>

    <div
      class="crm6004-search-panel z-10 mt-3 w-full min-h-0 shrink-0 overflow-visible rounded-lg bg-gray-200"
      :style="{
        '--crm6004-control-border': crm6004ControlBorder,
        '--crm6004-col-gap': crm6004ColGutter,
        '--crm6004-item-gap': crm6004ItemGap,
        '--crm6004-label-col': crm6004LabelCol,
        '--crm6004-panel-pad-x': crm6004PanelPadX,
        '--crm6004-select-w': crm6004SelectW,
        '--crm6004-control-h': crm6004ControlH,
        '--crm6004-row-min-h': crm6004RowMinH,
      }">
      <!--
        1) 배치: 생성일자 | 상품권구분 | 권종 (항목 블록)
        2) 사이즈: 콤보 11rem×1.2
        3) 균등: 앞===뒤 pad, 사이 동일 1fr gutter
      -->
      <div class="crm6004-search-grid min-w-0">
        <div class="crm6004-edge" aria-hidden="true"></div>
        <div class="crm6004-cell crm6004-cell--date">
          <div class="crm6004-lbl">생성일자</div>
          <div class="crm6004-field crm6004-date-slot min-w-0">
            <Datepicker2
              ref="datepicker"
              :main-name="'생성일자'"
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
        <div class="crm6004-gutter" aria-hidden="true"></div>
        <div class="crm6004-cell">
          <div class="crm6004-lbl">상품권구분</div>
          <div class="crm6004-field min-w-0">
            <select v-model="cond" class="crm6004-select">
              <option value="0">전체</option>
              <option
                v-for="i in optionList"
                :key="i.lngGftCategory"
                :value="i.lngGftCategory">
                {{ i.strGftCategory }}
              </option>
            </select>
          </div>
        </div>
        <div class="crm6004-gutter" aria-hidden="true"></div>
        <div class="crm6004-cell">
          <div class="crm6004-lbl">권종</div>
          <div class="crm6004-field min-w-0">
            <select v-model="cond3" class="crm6004-select">
              <option value="0">전체</option>
              <option
                v-for="i in optionList2"
                :key="i.lngGftType"
                :value="i.lngGftType">
                {{ i.strGftType }}
              </option>
            </select>
          </div>
        </div>
        <div class="crm6004-edge" aria-hidden="true"></div>
      </div>
    </div>

    <div class="mt-2 flex min-h-0 min-w-0 flex-1 flex-col">
      <div class="relative min-h-0 w-full flex-1">
        <Realgrid
          class="h-full min-h-0 w-full"
          :progname="'CRM60_004INS_VUE'"
          :progid="mainGridProgid"
          :rowData="rowData"
          :reload="reload"
          :documentTitle="'CRM60_004INS'"
          :documentSubTitle="documentSubTitle"
          :rowStateeditable="false"
          :exporttoExcel="exportExcel">
        </Realgrid>
      </div>
    </div>
  </div>

  <Teleport to="body">
    <div
      v-if="visible"
      class="crm6004-popup-mask">
      <div
        class="crm6004-popup"
        :class="{ 'crm6004-popup--serial': isSerialGftCreate }"
        role="dialog"
        aria-modal="true">
        <div class="crm6004-popup-head">
          <h2 class="crm6004-popup-title">전자상품권 신규 생성</h2>
          <div class="crm6004-popup-actions">
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
              저장
            </button>
            <button
              type="button"
              class="pnc-sub-btn pnc-sub-btn--gray"
              @click="closePopup">
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
              취소
            </button>
          </div>
        </div>

        <!-- 자동생성(수량) — 기본 -->
        <div v-if="!isSerialGftCreate" class="crm6004-form-grid w-full">
          <div class="crm6004-form-label crm6004-form-label--required">
            <span class="crm6004-req" aria-hidden="true">*</span>구분
          </div>
          <div class="crm6004-form-value">
            <select v-model="pcond" class="crm6004-control">
              <option value="0">선택</option>
              <option
                v-for="i in optionList"
                :key="'p-' + i.lngGftCategory"
                :value="i.lngGftCategory">
                {{ i.strGftCategory }}
              </option>
            </select>
          </div>

          <div class="crm6004-form-label crm6004-form-label--required">
            <span class="crm6004-req" aria-hidden="true">*</span>권종
          </div>
          <div class="crm6004-form-value">
            <select v-model="pcond3" class="crm6004-control">
              <option value="0">선택</option>
              <option
                v-for="i in optionList2"
                :key="'p-' + i.lngGftType"
                :value="i.lngGftType">
                {{ i.strGftType }}
              </option>
            </select>
          </div>

          <div class="crm6004-form-label crm6004-form-label--required">
            <span class="crm6004-req" aria-hidden="true">*</span>생성수량
          </div>
          <div class="crm6004-form-value">
            <input v-model="pcond4" type="number" class="crm6004-control" />
          </div>

          <div class="crm6004-form-label">유효기간</div>
          <div class="crm6004-form-value">
            <input v-model="cond4" type="date" class="crm6004-control" />
          </div>
        </div>

        <!-- 연번생성(from~to) — 회사/매장그룹 1871 (LF) -->
        <template v-else>
          <div
            class="crm6004-form-grid crm6004-form-grid--serial w-full">
            <div class="crm6004-form-label crm6004-form-label--required">
              <span class="crm6004-req" aria-hidden="true">*</span>구분
            </div>
            <div class="crm6004-form-value">
              <select v-model="pcond" class="crm6004-control">
                <option value="0">선택</option>
                <option
                  v-for="i in optionList"
                  :key="'ps-' + i.lngGftCategory"
                  :value="i.lngGftCategory">
                  {{ i.strGftCategory }}
                </option>
              </select>
            </div>

            <div class="crm6004-form-label crm6004-form-label--required">
              <span class="crm6004-req" aria-hidden="true">*</span>권종
            </div>
            <div class="crm6004-form-value">
              <select v-model="pcond3" class="crm6004-control">
                <option value="0">선택</option>
                <option
                  v-for="i in optionList2"
                  :key="'ps-' + i.lngGftType"
                  :value="i.lngGftType">
                  {{ i.strGftType }}
                </option>
              </select>
            </div>

            <div class="crm6004-form-label crm6004-form-label--required">
              <span class="crm6004-req" aria-hidden="true">*</span>상품권 시작번호
            </div>
            <div class="crm6004-form-value">
              <input
                v-model="cardNoFrom"
                class="crm6004-control"
                inputmode="numeric"
                pattern="[0-9]*"
                lang="en"
                autocomplete="off"
                maxlength="20"
                @keydown="digitsFrom.onKeydown"
                @beforeinput="digitsFrom.onBeforeInput"
                @paste="digitsFrom.onPaste"
                @compositionstart="digitsFrom.onCompositionStart"
                @compositionupdate="digitsFrom.onCompositionUpdate"
                @compositionend="digitsFrom.onCompositionEnd"
                @input="digitsFrom.onInput" />
            </div>

            <div class="crm6004-form-label crm6004-form-label--required">
              <span class="crm6004-req" aria-hidden="true">*</span>상품권 끝번호
            </div>
            <div class="crm6004-form-value">
              <input
                v-model="cardNoTo"
                class="crm6004-control"
                inputmode="numeric"
                pattern="[0-9]*"
                lang="en"
                autocomplete="off"
                maxlength="20"
                @keydown="digitsTo.onKeydown"
                @beforeinput="digitsTo.onBeforeInput"
                @paste="digitsTo.onPaste"
                @compositionstart="digitsTo.onCompositionStart"
                @compositionupdate="digitsTo.onCompositionUpdate"
                @compositionend="digitsTo.onCompositionEnd"
                @input="digitsTo.onInput" />
            </div>

            <div class="crm6004-form-label">유효기간</div>
            <div class="crm6004-form-value">
              <input v-model="cond4" type="date" class="crm6004-control" />
            </div>
          </div>

          <div class="crm6004-reg-head">
            <h3 class="crm6004-sec-title">기등록 상품권번호</h3>
            <button
              type="button"
              class="pnc-sub-btn"
              @click="excelRegButton">
              <svg
                class="pnc-sub-btn__icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false">
                <path
                  d="M4 4h10l6 6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linejoin="round" />
                <path
                  d="M14 4v6h6"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linejoin="round" />
              </svg>
              엑셀
            </button>
          </div>
          <div class="crm6004-reg-grid">
            <Realgrid
              class="h-full min-h-0 w-full"
              :progname="'CRM60_004INS_Popup2'"
              :progid="1"
              :rowData="regRowData"
              :reload="regReload"
              :documentTitle="'기등록상품권번호'"
              :documentSubTitle="''"
              :rowStateeditable="false"
              :exporttoExcel="exportRegExcel">
            </Realgrid>
          </div>
        </template>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { getCommonList } from "@/api/common";
import {
  getGftLedgerCreateList,
  getGftValidChk,
  getInitGftData,
  saveNewGftCard,
  setGftCreate,
} from "@/api/micrm";
import Datepicker2 from "@/components/Datepicker2.vue";
import PageName from "@/components/pageName.vue";
import Realgrid from "@/components/realgrid.vue";
import { insertPageLog } from "@/customFunc/customFunc";
import { makeDigitsOnlyHandlers } from "@/utils/inputRestrict";
import Swal from "sweetalert2";
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";

/** LF 푸드(1871) 연번생성(Popup2). 5001=테스트용 임시 */
const SERIAL_GFT_CREATE_GROUPS = new Set(["1871", "5001"]);

const store = useStore();
const crm6004ControlBorder = "#cbd5e1";
const crm6004ColGutter = "1.5rem";
const crm6004ItemGap = "0.75rem";
const crm6004LabelCol = "5.5rem";
const crm6004PanelPadX = "7rem";
/** 상품권구분·권종 콤보 — 기준 11rem × 1.2 */
const crm6004SelectW = "13.2rem";
const crm6004ControlH = "2rem";
const crm6004RowMinH = "2rem";

const isSerialGftCreate = computed(() => {
  const u = store.state.userData || {};
  const keys = [u.lngStoreGroup, u.lngCompanyCode, u.lngCompany];
  return keys.some((v) => SERIAL_GFT_CREATE_GROUPS.has(String(v ?? "")));
});

/**
 * 레거시 1871은 grid "2"(이미지 열 없음).
 * CRM60_004INS_VUE 는 grid 1에 strDesign width=0 이라 progid 1 유지.
 */
const mainGridProgid = 1;

/** YYYY-MM-DD */
const toYmd = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

/**
 * 유효기간 디폴트 — 레거시와 동일
 * 연번(Popup2): 비움 → 저장 시 9999-12-31
 * 수량(Popup): 오늘+12개월
 */
const defaultValidateDate = () => {
  if (isSerialGftCreate.value) return "";
  const d = new Date();
  d.setMonth(d.getMonth() + 12);
  return toYmd(d);
};

onMounted(async () => {
  await insertPageLog(store.state.activeTab2);

  const res = await getCommonList(254);
  optionList3.value = res.data.List;

  const res2 = await getInitGftData(store.state.userData.lngStoreGroup);
  optionList.value = res2.data.List;
  optionList2.value = res2.data.List2;

  cond4.value = defaultValidateDate();
});

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);
const selectedCond = ref(0);
const condValue = ref(0);
const cond = ref(0);
const cond2 = ref(null);

const today = ref(new Date());
const cond3 = ref(0);
const pcond3 = ref(0);
const pcond4 = ref(1);
const pcond = ref(0);
const cond4 = ref();
const cardNoFrom = ref("");
const cardNoTo = ref("");
const regRowData = ref([]);
const regReload = ref(false);
const exportRegExcel = ref(false);

const digitsFrom = makeDigitsOnlyHandlers({
  setValue: (v) => {
    cardNoFrom.value = v;
  },
});
const digitsTo = makeDigitsOnlyHandlers({
  setValue: (v) => {
    cardNoTo.value = v;
  },
});

const optionList = ref([]);
const optionList2 = ref([]);
const optionList3 = ref([]);
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

const FileChange = (e) => {
  const file = event.target.files[0];
  if (file) {
    cond2.value = file;
  }
};

const handleParentClick = (e) => {
  const datepickerEl = datepicker.value?.$el;
  if (datepickerEl && datepickerEl.contains(e.target)) {
    return;
  }
  closePopUp.value = !closePopUp.value;
};

const visible = ref(false);

const resetPopupForm = () => {
  pcond.value = 0;
  pcond3.value = 0;
  pcond4.value = 1;
  cardNoFrom.value = "";
  cardNoTo.value = "";
  regRowData.value = [];
  cond4.value = defaultValidateDate();
};

const closePopup = () => {
  visible.value = false;
  resetPopupForm();
};

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
  resetPopupForm();
  visible.value = true;
};

const searchButton = async () => {
  if (sd.value == null || ed.value == null) {
    Swal.fire({
      title: "경고",
      text: "생성일자을 선택하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  try {
    store.state.loading = true;
    initGrid();

    const res = await getGftLedgerCreateList(
      store.state.userData.lngStoreGroup,
      cond.value,
      cond3.value,
      sd.value,
      ed.value
    );
    rowData.value = res.data.List;

    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
  } finally {
    store.state.loading = false;
  }
};

const selectedGroup = ref();
const selectedStores = ref();
const selectedStoreAttrs = ref();

const warn = (text) =>
  Swal.fire({
    title: "경고",
    text,
    icon: "warning",
    confirmButtonText: "확인",
  });

/** asmx Response.Write JSON / ScriptService { d } / d 문자열 모두 허용 */
const unwrapAsmxPayload = (res) => {
  let raw = res?.data;
  if (raw == null) return {};
  if (typeof raw === "string") {
    try {
      raw = JSON.parse(raw);
    } catch (_) {
      return {};
    }
  }
  if (raw.d != null) {
    let inner = raw.d;
    if (typeof inner === "string") {
      try {
        inner = JSON.parse(inner);
      } catch (_) {
        /* keep string */
      }
    }
    if (inner && typeof inner === "object") raw = inner;
  }
  return raw || {};
};

const asmxList = (res) => {
  const p = unwrapAsmxPayload(res);
  const list = p.List ?? p.list;
  return Array.isArray(list) ? list : [];
};

const asmxStatus = (res) => {
  const p = unwrapAsmxPayload(res);
  return String(
    p.strStatus || p.List?.[0]?.strStatus || (p.RESULT_CD === "00" ? "0000" : "") || ""
  ).trim();
};

/** 기등록 그리드 채우기 + 건수 (레거시 GetGftValidChk → ds_list3) */
const loadRegGrid = async (groupCd, from, to) => {
  const chk = await getGftValidChk(groupCd, from, to);
  const payload = unwrapAsmxPayload(chk);
  if (payload.RESULT_CD && String(payload.RESULT_CD) !== "00") {
    const err = new Error(
      payload.RESULT_NM || "상품권 생성 오류. 관리자에게 문의 하십시오."
    );
    err.asmxPayload = payload;
    throw err;
  }
  const list = asmxList(chk);
  regRowData.value = list;
  regReload.value = !regReload.value;
  return list;
};

const saveQtyCreate = async () => {
  if (pcond.value == 0 || pcond3.value == 0 || pcond4.value == 0) {
    await warn("필수 사항이 누락되었습니다.");
    return;
  }
  try {
    store.state.loading = true;
    let validateDate = cond4.value;
    if (!validateDate) {
      const d = new Date();
      d.setMonth(d.getMonth() + 12);
      validateDate = toYmd(d);
    }
    await saveNewGftCard(
      store.state.userData.lngStoreGroup,
      pcond.value,
      pcond3.value,
      "",
      pcond4.value,
      validateDate,
      store.state.userData.lngSequence || 1
    );
    closePopup();
    await searchButton();
  } catch (error) {
    // keep popup open on error
  } finally {
    store.state.loading = false;
  }
};

const validateSerialInputs = () => {
  const from = String(cardNoFrom.value ?? "").trim();
  const to = String(cardNoTo.value ?? "").trim();

  if (!from) {
    warn("시작번호를 확인해 주십시오.");
    return null;
  }
  if (!to) {
    warn("끝번호를 확인해 주십시오.");
    return null;
  }
  if (from.length !== to.length) {
    warn("시작번호와 끝번호 자릿수가 다릅니다.");
    return null;
  }
  if (from > to) {
    warn("시작번호를 확인해 주십시오.");
    return null;
  }
  if (from.startsWith("0") || to.startsWith("0")) {
    warn("상품권 첫자리 수가 0으로 시작 할 수 없습니다.");
    return null;
  }
  if (from.length !== 16) {
    warn("상품권 시작 번호는 16자리만 등록 가능합니다.");
    return null;
  }
  if (to.length !== 16) {
    warn("상품권 끝 번호는 16자리만 등록 가능합니다.");
    return null;
  }
  if (pcond3.value == 0) {
    warn("권종을 선택 해 주십시오.");
    return null;
  }
  if (pcond.value == 0) {
    warn("구분을 선택 해 주십시오.");
    return null;
  }
  return { from, to };
};

const saveSerialCreate = async () => {
  const nums = validateSerialInputs();
  if (!nums) return;

  const groupCd = store.state.userData.lngStoreGroup;

  // 1) 레거시와 동일: 저장 전 GetGftValidChk → 기등록 그리드 + N건 메시지
  let exists = [];
  try {
    store.state.loading = true;
    exists = await loadRegGrid(groupCd, nums.from, nums.to);
  } catch (e) {
    await warn(
      e?.message || "상품권 생성 오류. 관리자에게 문의 하십시오."
    );
    return;
  } finally {
    store.state.loading = false;
  }

  if (exists.length > 0) {
    await warn(
      `이미 등록 된 상품권 번호가 ${exists.length}건 존재 합니다. 기등록 상품권번호 제외 후 생성 해 주세요.`
    );
    return;
  }

  const fromN = Number(nums.from);
  const toN = Number(nums.to);
  const gap = toN - fromN + 1;
  const confirm = await Swal.fire({
    title: "확인",
    text: `상품권 ${gap}건을 생성 하시겠습니까?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "확인",
    cancelButtonText: "취소",
  });
  if (!confirm.isConfirmed) return;

  let validateDate = cond4.value;
  if (!validateDate) {
    validateDate = "9999-12-31";
  }

  try {
    store.state.loading = true;
    const res = await setGftCreate(
      groupCd,
      pcond.value,
      pcond3.value,
      nums.from,
      nums.to,
      validateDate,
      gap,
      store.state.userData.lngSequence || 1
    );
    const payload = unwrapAsmxPayload(res);
    const status = asmxStatus(res);

    if (status === "0000") {
      await Swal.fire({
        title: "완료",
        text: "정상적으로 생성 되었습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
      closePopup();
      await searchButton();
      return;
    }

    // 생성 실패(1001 등) — 기등록 재조회 후, 있으면 레거시 N건 메시지
    let again = [];
    try {
      again = await loadRegGrid(groupCd, nums.from, nums.to);
    } catch (_) {
      again = [];
    }
    if (again.length > 0) {
      await warn(
        `이미 등록 된 상품권 번호가 ${again.length}건 존재 합니다. 기등록 상품권번호 제외 후 생성 해 주세요.`
      );
    } else {
      await warn(
        payload.RESULT_NM ||
          "상품권 생성 오류. 관리자에게 문의 하십시오."
      );
    }
  } catch (e) {
    await warn(
      e?.response?.data
        ? unwrapAsmxPayload(e.response)?.RESULT_NM ||
            "상품권 생성 오류. 관리자에게 문의 하십시오."
        : e?.message || "상품권 생성 오류. 관리자에게 문의 하십시오."
    );
  } finally {
    store.state.loading = false;
  }
};

const saveButton = async () => {
  if (isSerialGftCreate.value) {
    await saveSerialCreate();
  } else {
    await saveQtyCreate();
  }
};

const excelRegButton = () => {
  if (!Array.isArray(regRowData.value) || regRowData.value.length === 0) {
    Swal.fire({
      title: "안내",
      text: "조회된 중복 상품권번호가 없습니다.",
      icon: "info",
      confirmButtonText: "확인",
    });
    return;
  }
  exportRegExcel.value = !exportRegExcel.value;
};

const lngStoreCode = async (e) => {
  initGrid();
  selectedStores.value = e;
};

const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
};

const exportExcel = ref(false);

const excelButton = () => {
  documentSubTitle.value = selectedDate.value;
  exportExcel.value = !exportExcel.value;
};

const documentSubTitle = ref("");
const selectedExcelList = ref("");
const selectedExcelStore = ref("");

const excelStore = (e) => {
  selectedExcelStore.value = e;
};
const excelList = (e) => {
  selectedExcelList.value = e;
};
</script>

<style scoped>
.crm6004-search-panel {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  padding-block: 0.75rem;
  padding-inline: 0;
  overflow-x: visible;
}

.crm6004-search-grid {
  box-sizing: border-box;
  display: grid;
  width: 100%;
  min-width: 0;
  align-items: center;
  column-gap: 0;
  grid-template-columns:
    var(--crm6004-panel-pad-x)
    max-content
    minmax(var(--crm6004-col-gap), 1fr)
    max-content
    minmax(var(--crm6004-col-gap), 1fr)
    max-content
    var(--crm6004-panel-pad-x);
  padding-left: 0;
  padding-right: 0;
}

.crm6004-edge,
.crm6004-gutter {
  min-width: 0;
  pointer-events: none;
}

.crm6004-cell {
  box-sizing: border-box;
  display: grid;
  width: max-content;
  max-width: 100%;
  min-width: 0;
  min-height: var(--crm6004-row-min-h);
  grid-template-columns: max-content max-content;
  column-gap: var(--crm6004-item-gap);
  align-items: center;
}

.crm6004-lbl {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: max-content;
  min-height: var(--crm6004-row-min-h);
  font-size: 0.9375rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
  white-space: nowrap;
}

.crm6004-field {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  width: max-content;
  max-width: 100%;
  min-width: 0;
  min-height: var(--crm6004-row-min-h);
}

.crm6004-select {
  box-sizing: border-box;
  width: var(--crm6004-select-w);
  min-width: 0;
  height: var(--crm6004-control-h);
  min-height: var(--crm6004-control-h);
  max-height: var(--crm6004-control-h);
  padding: 0 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: rgb(30 41 59);
  background: #fff;
  border: 1px solid var(--crm6004-control-border, #cbd5e1);
  border-radius: 0.375rem;
}

.crm6004-select:focus {
  border-color: #3b82f6;
  outline: none;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.35);
}

.crm6004-date-slot :deep(> div.flex.justify-start.items-center) {
  margin: 0 !important;
  width: max-content !important;
  max-width: 100%;
  min-height: var(--crm6004-row-min-h);
  align-items: center;
}

.crm6004-date-slot :deep(input[type="date"]) {
  box-sizing: border-box;
  height: var(--crm6004-control-h);
  min-height: var(--crm6004-control-h);
  max-height: var(--crm6004-control-h);
  border: 1px solid var(--crm6004-control-border, #cbd5e1);
  border-radius: 0.375rem;
  background: #fff;
}

.crm6004-date-slot :deep(input[type="date"]:focus) {
  border-color: #3b82f6;
}

.crm6004-date-slot :deep(div.inline-flex.h-8),
.crm6004-date-slot :deep(button) {
  height: var(--crm6004-control-h) !important;
  min-height: var(--crm6004-control-h) !important;
}

.crm6004-popup-mask {
  position: fixed;
  inset: 0;
  z-index: 10050;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(0 0 0 / 0.45);
}

.crm6004-popup {
  --crm6004-form-label-col: 6.5rem;
  --crm6004-form-row-h: 2.5rem;
  --crm6004-form-cell-py: 0.4375rem;
  --crm6004-form-font: 0.8125rem;
  --crm6004-form-control-h: 1.625rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: min(32rem, 94vw);
  max-height: min(90vh, 40rem);
  padding: 1rem 1.25rem 1.25rem;
  border-radius: 0.75rem;
  background: #fff;
  box-shadow: 0 12px 28px rgb(15 23 42 / 0.18);
  overflow: hidden;
}

.crm6004-popup--serial {
  --crm6004-form-label-col: 8.5rem;
  width: min(34rem, 94vw);
  height: min(36rem, 90vh);
}

.crm6004-popup-head {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.crm6004-popup-title {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.25rem;
  color: #111827;
}

.crm6004-popup-title::before {
  content: "";
  display: inline-block;
  flex-shrink: 0;
  width: 0.25rem;
  height: 0.9em;
  border-radius: 999px;
  background: #2563eb;
}

.crm6004-popup-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.crm6004-form-grid {
  display: grid;
  grid-template-columns: var(--crm6004-form-label-col) minmax(0, 1fr);
  grid-auto-rows: var(--crm6004-form-row-h);
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  overflow: hidden;
  background: #fff;
  flex-shrink: 0;
}

.crm6004-form-grid > * {
  box-sizing: border-box;
  min-height: var(--crm6004-form-row-h);
  align-self: stretch;
}

.crm6004-form-label {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: var(--crm6004-form-row-h);
  padding: var(--crm6004-form-cell-py) 0.375rem;
  border: 1px solid #e5e7eb;
  background: #edf2f7;
  color: #5c5c5c;
  font-size: var(--crm6004-form-font);
  font-weight: 600;
  line-height: 1.25;
  text-align: center;
  word-break: keep-all;
}

.crm6004-form-label--required {
  font-weight: 700;
}

.crm6004-req {
  color: #dc2626;
  margin-right: 0.1rem;
}

.crm6004-form-value {
  display: flex;
  align-items: center;
  min-height: var(--crm6004-form-row-h);
  min-width: 0;
  padding: var(--crm6004-form-cell-py) 0.375rem;
  border: 1px solid #e5e7eb;
  background: #fff;
}

.crm6004-control {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  height: var(--crm6004-form-control-h);
  min-height: var(--crm6004-form-control-h);
  max-height: var(--crm6004-form-control-h);
  padding: 0 0.5rem;
  font-size: var(--crm6004-form-font);
  line-height: 1;
  color: #1e293b;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  background: #fff;
}

.crm6004-control:focus,
.crm6004-control:focus-visible {
  border-color: #3b82f6;
  outline: none;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.25);
}

.crm6004-reg-head {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 0.75rem;
  margin-bottom: 0.4rem;
}

.crm6004-sec-title {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin: 0;
  padding: 0;
  flex-shrink: 0;
  font-size: 0.9375rem;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.01em;
  color: #1a3c70;
  white-space: nowrap;
}

/* 팝업 타이틀(파란 세로 바)과 모양 구분 — 하위 섹션은 원형 불릿 */
.crm6004-sec-title::before {
  content: "";
  display: inline-block;
  flex-shrink: 0;
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 999px;
  background: #2563eb;
}

.crm6004-reg-grid {
  position: relative;
  flex: 1 1 auto;
  min-height: 10rem;
  min-width: 0;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
}

@media (max-width: 1100px) {
  .crm6004-search-panel {
    --crm6004-panel-pad-x: 2rem;
  }

  .crm6004-search-grid {
    grid-template-columns: minmax(0, 1fr);
    justify-content: stretch;
    row-gap: 0.75rem;
    padding-left: var(--crm6004-panel-pad-x);
    padding-right: var(--crm6004-panel-pad-x);
  }

  .crm6004-edge,
  .crm6004-gutter {
    display: none;
  }

  .crm6004-cell {
    width: 100%;
    max-width: 100%;
    grid-template-columns: max-content minmax(0, 1fr);
  }

  .crm6004-field,
  .crm6004-select {
    width: 100%;
    max-width: 100%;
  }

  .crm6004-date-slot :deep(> div.flex.justify-start.items-center) {
    width: 100% !important;
  }
}
</style>
