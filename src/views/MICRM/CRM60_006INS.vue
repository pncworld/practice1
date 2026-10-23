<!-- /*--############################################################################
# Filename : CRM60_006INS.vue
# Description : 고객관리 > 전자상품권 마스터 관리 > 전자상품권 판매
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
        <!-- 5001: 판매·증정 둘 다 테스트 / 그 외: 기존처럼 신규(판매) 1개 -->
        <template v-if="isTestDualPopup">
          <button
            type="button"
            class="button new md:w-auto w-auto px-3"
            @click="addSaleButton">
            판매등록
          </button>
          <button
            type="button"
            class="button new md:w-auto w-auto px-3"
            @click="addPrsntButton">
            증정등록
          </button>
        </template>
        <button
          v-else
          type="button"
          class="button new md:w-auto w-14"
          @click="addSaleButton">
          신규
        </button>
        <button type="button" class="button delete md:w-auto w-14" @click="deleteButton">
          취소
        </button>
        <button type="button" class="button save w-auto excel" @click="excelButton">
          엑셀
        </button>
      </div>
    </div>

    <div
      class="crm6006-search-panel z-10 mt-3 w-full min-h-0 shrink-0 overflow-visible rounded-lg bg-gray-200"
      :style="{
        '--crm6006-control-border': crm6006ControlBorder,
        '--crm6006-col-gap': crm6006ColGutter,
        '--crm6006-item-gap': crm6006ItemGap,
        '--crm6006-label-col': crm6006LabelCol,
        '--crm6006-panel-pad-x': crm6006PanelPadX,
        '--crm6006-select-w': crm6006SelectW,
        '--crm6006-control-h': crm6006ControlH,
        '--crm6006-row-min-h': crm6006RowMinH,
      }">
      <!--
        1) 배치: 생성일자 | 상품권구분 | 권종
        2) 사이즈: 콤보 11rem × 1.2
        3) 균등: 앞===뒤 pad, 사이 동일 1fr gutter
      -->
      <div class="crm6006-search-grid min-w-0">
        <div class="crm6006-edge" aria-hidden="true"></div>
        <div class="crm6006-cell crm6006-cell--date">
          <div class="crm6006-lbl">생성일자</div>
          <div class="crm6006-field crm6006-date-slot min-w-0">
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
        <div class="crm6006-gutter" aria-hidden="true"></div>
        <div class="crm6006-cell">
          <div class="crm6006-lbl">상품권구분</div>
          <div class="crm6006-field min-w-0">
            <select v-model="cond" class="crm6006-select">
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
        <div class="crm6006-gutter" aria-hidden="true"></div>
        <div class="crm6006-cell">
          <div class="crm6006-lbl">권종</div>
          <div class="crm6006-field min-w-0">
            <select v-model="cond3" class="crm6006-select">
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
        <div class="crm6006-gutter" aria-hidden="true"></div>
        <div class="crm6006-cell crm6006-cell--check">
          <label class="crm6006-exclude-label" @click.stop>
            <input
              v-model="excludeCancelled"
              type="checkbox"
              class="crm6006-exclude-chk" />
            취소제외
          </label>
        </div>
        <div class="crm6006-edge" aria-hidden="true"></div>
      </div>
    </div>

    <div class="mt-2 flex min-h-0 min-w-0 flex-1 flex-col">
      <div class="relative min-h-0 w-full flex-1">
        <Realgrid
          class="h-full min-h-0 w-full"
          :progname="'CRM60_006INS_VUE'"
          :progid="1"
          :rowData="rowData"
          :reload="reload"
          :showCheckBar="true"
          :checkRenderEditable="true"
          :checkRowAuto="false"
          :checkAbleExpressionCol2="'lngVoid'"
          :checkAbleExpressionVal="'0'"
          checkBarCheckableExpression="values['lngVoid'] = '0'"
          :setAllCheck="setAllCheck"
          @checkedRowData="onCheckedSaleRows"
          @updatedRowData="onSaleGridUpdated"
          :documentTitle="'CRM60_006INS'"
          :documentSubTitle="documentSubTitle"
          :rowStateeditable="false"
          :exporttoExcel="exportExcel">
        </Realgrid>
      </div>
    </div>
  </div>

  <Teleport to="body">
    <div v-if="visible" class="crm6006-popup-mask">
      <div class="crm6006-popup" role="dialog" aria-modal="true">
        <div class="crm6006-popup-head">
          <h2 class="crm6006-popup-title">전자상품권 판매등록</h2>
          <div class="crm6006-popup-actions">
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
              @click="
                visible = false;
                initGrid();
              ">
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

        <div class="crm6006-form-grid w-full">
          <div class="crm6006-form-label crm6006-form-label--required">
            <span class="crm6006-req" aria-hidden="true">*</span>매장명
          </div>
          <div class="crm6006-form-value crm6006-form-value--pick">
            <PickStore
              compact-search-bar
              :compact-store-combo-max-rem="40"
              :hide-group="false"
              :hide-attr="false"
              :main-name="''"
              @update:store-cd="lngStoreCode"></PickStore>
          </div>

          <div class="crm6006-form-label crm6006-form-label--required">
            <span class="crm6006-req" aria-hidden="true">*</span>출고일자
          </div>
          <div class="crm6006-form-value">
            <input v-model="pcond1" type="date" class="crm6006-control" />
          </div>

          <div class="crm6006-form-label crm6006-form-label--required">
            <span class="crm6006-req" aria-hidden="true">*</span>시작번호
          </div>
          <div class="crm6006-form-value">
            <input v-model="pcond2" type="number" class="crm6006-control" />
          </div>

          <div class="crm6006-form-label crm6006-form-label--required">
            <span class="crm6006-req" aria-hidden="true">*</span>끝번호
          </div>
          <div class="crm6006-form-value">
            <input v-model="pcond3" type="number" class="crm6006-control" />
          </div>

          <div class="crm6006-form-label crm6006-form-label--required">
            <span class="crm6006-req" aria-hidden="true">*</span>결제구분
          </div>
          <div class="crm6006-form-value">
            <select v-model="pcond5" class="crm6006-control">
              <option value="0">선택</option>
              <option value="1">현금</option>
              <option value="2">카드</option>
              <option value="3">기타</option>
            </select>
          </div>

          <div class="crm6006-form-label">매입사</div>
          <div class="crm6006-form-value">
            <select
              v-model="pcond4"
              class="crm6006-control"
              @mousedown="onBuyCompanyPointer"
              @focus="onBuyCompanyFocus">
              <option value="0">선택</option>
              <option
                v-for="i in optionList3"
                :key="i.strBuyCode"
                :value="i.strBuyCode">
                {{ i.strBuyName }}
              </option>
            </select>
          </div>

          <div class="crm6006-form-label">신용카드</div>
          <div class="crm6006-form-value">
            <input v-model="pcond6" type="text" class="crm6006-control" />
          </div>

          <div class="crm6006-form-label">승인구분</div>
          <div class="crm6006-form-value">
            <input v-model="pcond7" type="text" class="crm6006-control" />
          </div>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- Popup2: 상품권 증정 등록 (1871 / 테스트 5001) -->
  <Teleport to="body">
    <div v-if="visiblePrsnt" class="crm6006-popup-mask">
      <div class="crm6006-popup" role="dialog" aria-modal="true">
        <div class="crm6006-popup-head">
          <h2 class="crm6006-popup-title">상품권 증정 등록</h2>
          <div class="crm6006-popup-actions">
            <button type="button" class="pnc-sub-btn" @click="savePrsntButton">
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
              @click="closePrsntPopup">
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

        <div class="crm6006-form-grid w-full">
          <div class="crm6006-form-label crm6006-form-label--required">
            <span class="crm6006-req" aria-hidden="true">*</span>거래처 그룹
          </div>
          <div class="crm6006-form-value">
            <select
              v-model="prsntGroupCd"
              class="crm6006-control"
              @change="onPrsntGroupChange">
              <option value="0">선택</option>
              <option
                v-for="i in prsntGroupList"
                :key="'pg-' + i.lngCode"
                :value="i.lngCode">
                {{ i.strName }}
              </option>
            </select>
          </div>

          <div class="crm6006-form-label crm6006-form-label--required">
            <span class="crm6006-req" aria-hidden="true">*</span>고객
          </div>
          <div class="crm6006-form-value">
            <select v-model="prsntCustCd" class="crm6006-control">
              <option value="0">선택</option>
              <option
                v-for="i in prsntCustList"
                :key="'pc-' + i.lngCode"
                :value="i.lngCode">
                {{ i.strName }}
              </option>
            </select>
          </div>

          <div class="crm6006-form-label crm6006-form-label--required">
            <span class="crm6006-req" aria-hidden="true">*</span>증정일자
          </div>
          <div class="crm6006-form-value">
            <input v-model="prsntDate" type="date" class="crm6006-control" />
          </div>

          <div class="crm6006-form-label crm6006-form-label--required">
            <span class="crm6006-req" aria-hidden="true">*</span>시작번호
          </div>
          <div class="crm6006-form-value">
            <input v-model="prsntCardFrom" type="text" class="crm6006-control" />
          </div>

          <div class="crm6006-form-label crm6006-form-label--required">
            <span class="crm6006-req" aria-hidden="true">*</span>끝번호
          </div>
          <div class="crm6006-form-value">
            <input v-model="prsntCardTo" type="text" class="crm6006-control" />
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import {
  cancelGftCardSale,
  getCreditCompanyList,
  getGftCustGroup,
  getGftLedgerSaleList,
  getGftPrsntCheck,
  getGftStkSaleCheck,
  getInitGftData,
  saveGftCardSaleEnroll,
  setGftPrsnt,
} from "@/api/micrm";
import Datepicker2 from "@/components/Datepicker2.vue";
import PageName from "@/components/pageName.vue";
import PickStore from "@/components/pickStore.vue";
import Realgrid from "@/components/realgrid.vue";
import { insertPageLog } from "@/customFunc/customFunc";
import Swal from "sweetalert2";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useStore } from "vuex";

const store = useStore();

/** 테스트 회사/그룹 5001 — 판매·증정 팝업 둘 다 버튼으로 열어 검증 */
const isTestDualPopup = computed(() => {
  const u = store.state.userData || {};
  return [u.lngStoreGroup, u.lngCompanyCode, u.lngCompany].some(
    (v) => String(v ?? "") === "5001"
  );
});
const crm6006ControlBorder = "#cbd5e1";
const crm6006ColGutter = "1.5rem";
const crm6006ItemGap = "0.75rem";
const crm6006LabelCol = "5.5rem";
/* 조회 항목 4개(취소제외 포함) → pad 축소 */
const crm6006PanelPadX = "2rem";
const crm6006SelectW = "13.2rem";
const crm6006ControlH = "2rem";
const crm6006RowMinH = "2rem";

/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  /* 매입사(optionList3)는 팝업에서 매장 선택 후 getCreditCompanyList 로만 채움 */
  const res2 = await getInitGftData(store.state.userData.lngStoreGroup);

  optionList.value = res2.data.List;
  optionList2.value = res2.data.List2;

  pcond1.value = todayYmd();
});

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);
const selectedCond = ref(0);
const condValue = ref(0);
const cond = ref(0);
const cond2 = ref(null);

const today = ref(new Date());
/** 로컬 오늘(YYYY-MM-DD). toISOString은 UTC라 한국에서 전날로 나갈 수 있음 */
const todayYmd = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};
const cond3 = ref(0);
/** 취소제외 — 기본 체크, 토글 시 즉시 그리드 반영 (v-model 반영 후 watch) */
const excludeCancelled = ref(true);
/** 조회 원본(취소제외 필터 전) */
const saleListAll = ref([]);
/** 조회 직후 applyExcludeFilter와 watch 중복 방지 */
let skipExcludeWatch = false;
const pcond1 = ref(todayYmd());
const pcond2 = ref("");
const pcond3 = ref("");
const pcond4 = ref(0);
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

const FileChange = (e) => {
  const file = event.target.files[0];
  if (file) {
    cond2.value = file; // cond2에 파일 객체 저장
    ////console.log("선택한 파일:", cond2.value);
  }
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
const visiblePrsnt = ref(false);
/** PickStore append-to-body 메뉴 z-index:40 → 팝업(10050) 뒤로 깔림. 팝업 열릴 때만 올림 */
const CRM6006_SALEPOP_BODY_CLASS = "crm6006-salepop-active";

watch([visible, visiblePrsnt], () => {
  if (typeof document === "undefined") return;
  const anyOpen = !!(visible.value || visiblePrsnt.value);
  document.body.classList.toggle(CRM6006_SALEPOP_BODY_CLASS, anyOpen);
});

onUnmounted(() => {
  if (typeof document !== "undefined") {
    document.body.classList.remove(CRM6006_SALEPOP_BODY_CLASS);
  }
});

const ensureAfterSearch = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return false;
  }
  return true;
};

/** Popup1 판매등록 */
const addSaleButton = () => {
  if (!ensureAfterSearch()) return;
  pcond1.value = todayYmd();
  pcond5.value = 2; /* 레거시 기본: 카드 */
  visible.value = true;
};

/** Popup2 증정등록 */
const addPrsntButton = async () => {
  if (!ensureAfterSearch()) return;
  resetPrsntForm();
  prsntDate.value = todayYmd();
  visiblePrsnt.value = true;
  await loadPrsntGroups();
};

const closePrsntPopup = () => {
  visiblePrsnt.value = false;
  resetPrsntForm();
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

    const res = await getGftLedgerSaleList(
      store.state.userData.lngStoreGroup,
      cond.value,
      cond3.value,
      sd.value,
      ed.value
    );
    ////console.log(res);
    const list = Array.isArray(res?.data?.List) ? res.data.List : [];
    /* 체크바 조건 values['lngVoid']='0' — 없으면 미취소로 취급 */
    saleListAll.value = list.map((r) => {
      const rawVoid = r?.lngVoid;
      let lngVoid = "0";
      if (rawVoid === 0 || rawVoid === "0") lngVoid = "0";
      else if (rawVoid != null && rawVoid !== "") lngVoid = String(rawVoid);
      else {
        /* lngVoid 없으면 표시문자로 보정 */
        const sv = String(r?.strVoid ?? "").trim();
        if (sv === "취소" || sv.includes("취소")) lngVoid = "1";
      }
      return { ...r, lngVoid };
    });
    skipExcludeWatch = true;
    applyExcludeFilter();
    skipExcludeWatch = false;

    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    //comsole.log(error);
  } finally {
    store.state.loading = false;
  }
};

/* 매장 컴포넌트 관련 함수 */
const selectedGroup = ref();
const selectedStores = ref();
const selectedStoreAttrs = ref();

const saveButton = async () => {
  ////console.log(optionList3.value, optionList4.value);
  const missing = [];
  if (
    selectedStores.value == null ||
    selectedStores.value === "" ||
    selectedStores.value === 0 ||
    selectedStores.value === "0"
  ) {
    missing.push("매장명");
  }
  if (pcond1.value == null || pcond1.value === "") {
    missing.push("출고일자");
  }
  if (pcond2.value == null || pcond2.value === undefined || pcond2.value === "") {
    missing.push("시작번호");
  }
  if (pcond3.value == null || pcond3.value === undefined || pcond3.value === "") {
    missing.push("끝번호");
  }
  if (pcond5.value === 0 || pcond5.value === "0" || pcond5.value == null) {
    missing.push("결제구분");
  }
  if (missing.length > 0) {
    Swal.fire({
      title: "경고",
      html: `다음 필수 항목을 입력해 주세요.<br><b>${missing.join(", ")}</b>`,
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  /* 매입사(pcond4)는 선택 — 미선택(0)이면 빈 값 전달 */
  const buyCode =
    pcond4.value == null || pcond4.value === "" || pcond4.value === 0 || pcond4.value === "0"
      ? ""
      : pcond4.value;

  try {
    store.state.loading = true;
    const chk = await getGftStkSaleCheck(
      store.state.userData.lngStoreGroup,
      selectedStores.value,
      pcond2.value,
      pcond3.value
    );
    const chkRow = Array.isArray(chk?.data?.List) ? chk.data.List[0] : null;
    const checkCode = String(chkRow?.strCheckCode ?? "");
    if (checkCode !== "0000") {
      const msgByCode = {
        1001: "출고 되지 않은 상품권이거나 이미 판매된 상품권이 존재 합니다.",
        1002: "출고 처리된 매장과 판매 매장이 상이한 상품권이 존재 합니다.",
        2001: "이미 판매, 사용된 전자상품권이 있어 판매할수 없습니다.",
      };
      await Swal.fire({
        title: "안내",
        text: msgByCode[checkCode] || "판매 유효 상품권이 없음",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }

    const res = await saveGftCardSaleEnroll(
      store.state.userData.lngStoreGroup,
      selectedStores.value,
      pcond1.value,
      pcond2.value,
      pcond3.value,
      pcond5.value,
      buyCode,
      store.state.userData.lngSequence,
      pcond6.value == null ? "" : pcond6.value,
      pcond7.value == null ? "" : pcond7.value
    );
    if (res?.data?.RESULT_CD != null && String(res.data.RESULT_CD) !== "00") {
      await Swal.fire({
        title: "오류",
        text: res?.data?.RESULT_NM || "저장에 실패했습니다.",
        icon: "error",
        confirmButtonText: "확인",
      });
      return;
    }
    await Swal.fire({
      title: "완료",
      text: "저장되었습니다.",
      icon: "success",
      confirmButtonText: "확인",
    });
    visible.value = false;
    initGrid();
    await searchButton();
  } catch (error) {
    await Swal.fire({
      title: "오류",
      text: error?.message || "저장 중 오류가 발생했습니다.",
      icon: "error",
      confirmButtonText: "확인",
    });
  } finally {
    store.state.loading = false;
  }
};

/* —— Popup2 증정 —— */
const prsntGroupList = ref([]);
const prsntCustList = ref([]);
const prsntGroupCd = ref("0");
const prsntCustCd = ref("0");
const prsntDate = ref(todayYmd());
const prsntCardFrom = ref("");
const prsntCardTo = ref("");

const resetPrsntForm = () => {
  prsntGroupCd.value = "0";
  prsntCustCd.value = "0";
  prsntDate.value = todayYmd();
  prsntCardFrom.value = "";
  prsntCardTo.value = "";
  prsntCustList.value = [];
};

const loadPrsntGroups = async () => {
  try {
    const res = await getGftCustGroup(
      store.state.userData.lngStoreGroup,
      "0",
      "1"
    );
    prsntGroupList.value = Array.isArray(res?.data?.List) ? res.data.List : [];
    prsntCustList.value = [];
    prsntCustCd.value = "0";
  } catch (e) {
    prsntGroupList.value = [];
  }
};

const onPrsntGroupChange = async () => {
  prsntCustCd.value = "0";
  prsntCustList.value = [];
  if (
    prsntGroupCd.value == null ||
    prsntGroupCd.value === "" ||
    prsntGroupCd.value === 0 ||
    prsntGroupCd.value === "0"
  ) {
    return;
  }
  try {
    const res = await getGftCustGroup(
      store.state.userData.lngStoreGroup,
      prsntGroupCd.value,
      "2"
    );
    prsntCustList.value = Array.isArray(res?.data?.List) ? res.data.List : [];
  } catch (e) {
    prsntCustList.value = [];
  }
};

const savePrsntButton = async () => {
  const missing = [];
  if (
    prsntGroupCd.value == null ||
    prsntGroupCd.value === "" ||
    prsntGroupCd.value === 0 ||
    prsntGroupCd.value === "0"
  ) {
    missing.push("거래처 그룹");
  }
  if (
    prsntCustCd.value == null ||
    prsntCustCd.value === "" ||
    prsntCustCd.value === 0 ||
    prsntCustCd.value === "0"
  ) {
    missing.push("고객");
  }
  if (!prsntDate.value) missing.push("증정일자");
  if (!prsntCardFrom.value) missing.push("시작번호");
  if (!prsntCardTo.value) missing.push("끝번호");
  if (missing.length > 0) {
    await Swal.fire({
      title: "경고",
      html: `다음 필수 항목을 입력해 주세요.<br><b>${missing.join(", ")}</b>`,
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  try {
    store.state.loading = true;
    const chk = await getGftPrsntCheck(
      store.state.userData.lngStoreGroup,
      prsntCardFrom.value,
      prsntCardTo.value
    );
    const chkRow = Array.isArray(chk?.data?.List) ? chk.data.List[0] : null;
    const checkCode = String(chkRow?.strCheckCode ?? "");
    if (checkCode !== "0000") {
      const msgByCode = {
        1001: "생성 되지 않은 상품권 번호가 존재 합니다.",
        2001: "이미 판매, 사용된 전자상품권이 있어 증정처리 할 수 없습니다.",
        2002: "증정 가능하지 않은 상품권 번호가 존재 합니다.",
      };
      await Swal.fire({
        title: "안내",
        text: msgByCode[checkCode] || "판매 유효 상품권이 없음",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }

    const res = await setGftPrsnt(
      store.state.userData.lngStoreGroup,
      prsntGroupCd.value,
      prsntCustCd.value,
      prsntDate.value,
      prsntCardFrom.value,
      prsntCardTo.value,
      store.state.userData.lngSequence
    );
    if (res?.data?.RESULT_CD != null && String(res.data.RESULT_CD) !== "00") {
      await Swal.fire({
        title: "오류",
        text: res?.data?.RESULT_NM || "증정 저장에 실패했습니다.",
        icon: "error",
        confirmButtonText: "확인",
      });
      return;
    }
    await Swal.fire({
      title: "완료",
      text: "판매(증정) 처리가 완료 되었습니다.",
      icon: "success",
      confirmButtonText: "확인",
    });
    closePrsntPopup();
    await searchButton();
  } catch (error) {
    await Swal.fire({
      title: "오류",
      text: error?.message || "증정 저장 중 오류가 발생했습니다.",
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

/** 판매등록 팝업 — 매장 선택 여부 (매입사 목록은 매장 기준) */
const hasSaleStore = () => {
  const v = selectedStores.value;
  return v != null && v !== "" && v !== 0 && v !== "0";
};

const guideSelectStoreFirst = () => {
  Swal.fire({
    title: "안내",
    text: "매장을 먼저 선택해 주세요.",
    icon: "warning",
    confirmButtonText: "확인",
  });
};

const onBuyCompanyPointer = (e) => {
  if (hasSaleStore()) return;
  e.preventDefault();
  guideSelectStoreFirst();
};

const onBuyCompanyFocus = (e) => {
  if (hasSaleStore()) return;
  e.target?.blur?.();
  guideSelectStoreFirst();
};

watch(selectedStores, async () => {
  if (!hasSaleStore()) {
    optionList3.value = [];
    pcond4.value = 0;
    return;
  }
  try {
    const res = await getCreditCompanyList(
      store.state.userData.lngStoreGroup,
      selectedStores.value
    );

    optionList3.value = res.data.List;
    pcond4.value = 0;
  } catch (error) {}
});
/**
 * 그리드 초기화
 */

const initGrid = () => {
  saleListAll.value = [];
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
  pcond1.value = todayYmd();
  pcond2.value = null;
  pcond3.value = null;
  pcond4.value = 0;
  pcond5.value = 0; /* 「선택」 option value="0" — null이면 콤보가 비어 보임 */
  pcond6.value = null;
  optionList3.value = [];
  selectedStores.value = null;
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
/** 체크된 판매 행 (이미 취소 lngVoid!=0 은 체크바에서 차단 + 여기서도 필터) */
const checkedSaleRows = ref([]);
const saleGridRows = ref([]);
/** 헤더·행 체크 원복 (Realgrid setAllCheck watch) — PUR08 동일 */
const setAllCheck = ref(false);
const clearGridChecks = () => {
  setAllCheck.value = !setAllCheck.value;
  checkedSaleRows.value = [];
};

const isCancellableSaleRow = (row) => {
  if (!row || typeof row !== "object") return false;
  const v = row.lngVoid;
  return v === 0 || v === "0" || v == null || v === "";
};

/** 취소제외 ON → lngVoid!=0 행 숨김. 토글 시 즉시 반영 */
const applyExcludeFilter = () => {
  const all = Array.isArray(saleListAll.value) ? saleListAll.value : [];
  rowData.value = excludeCancelled.value
    ? all.filter(isCancellableSaleRow)
    : all.map((r) => ({ ...r }));
  clearGridChecks();
};

/* @change는 v-model보다 먼저 돌 수 있음 → watch로 반영 후 필터 */
watch(excludeCancelled, () => {
  if (skipExcludeWatch) return;
  applyExcludeFilter();
});

const onCheckedSaleRows = (rows) => {
  const list = Array.isArray(rows) ? rows : [];
  checkedSaleRows.value = list.filter(isCancellableSaleRow);
};

const onSaleGridUpdated = (rows) => {
  saleGridRows.value = Array.isArray(rows) ? rows : [];
};

const deleteButton = async () => {
  const targets = (checkedSaleRows.value || []).filter(isCancellableSaleRow);
  if (targets.length === 0) {
    await Swal.fire({
      title: "경고",
      html:
        '취소할 대상을 <svg style="display:inline-block;width:1.15em;height:1.15em;vertical-align:-0.2em;margin:0 0.2em 0 0.1em;color:#1e40af" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3.5" y="3.5" width="17" height="17" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M7.5 12.2l3.1 3.1 5.9-6.4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>선택해주세요.',
      icon: "warning",
      confirmButtonText: "확인",
    });
    clearGridChecks();
    return;
  }

  const confirm = await Swal.fire({
    title: "확인",
    html: `선택한 <b>${targets.length}</b>건을 판매 취소하시겠습니까?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "확인",
    cancelButtonText: "닫기",
  });
  if (!confirm.isConfirmed) return;

  let ok = 0;
  let fail = 0;
  try {
    store.state.loading = true;
    for (const row of targets) {
      try {
        const res = await cancelGftCardSale(
          store.state.userData.lngStoreGroup,
          row.lngStoreCode,
          row.dtmSale,
          row.lngApprovalNo,
          store.state.userData.lngSequence
        );
        if (res?.data?.RESULT_CD != null && String(res.data.RESULT_CD) !== "00") {
          fail += 1;
        } else {
          ok += 1;
        }
      } catch (_) {
        fail += 1;
      }
    }
    if (fail === 0) {
      await Swal.fire({
        title: "성공",
        text: `${ok}건 취소가 완료되었습니다.`,
        icon: "success",
        confirmButtonText: "확인",
      });
    } else {
      await Swal.fire({
        title: "안내",
        html: `성공 <b>${ok}</b>건 / 실패 <b>${fail}</b>건`,
        icon: "warning",
        confirmButtonText: "확인",
      });
    }
  } finally {
    store.state.loading = false;
    clearGridChecks();
    await searchButton();
  }
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
.crm6006-search-panel {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  padding-block: 0.75rem;
  padding-inline: 0;
  overflow-x: visible;
}

.crm6006-search-grid {
  box-sizing: border-box;
  display: grid;
  width: 100%;
  min-width: 0;
  align-items: center;
  column-gap: 0;
  grid-template-columns:
    var(--crm6006-panel-pad-x)
    max-content
    minmax(var(--crm6006-col-gap), 1fr)
    max-content
    minmax(var(--crm6006-col-gap), 1fr)
    max-content
    minmax(var(--crm6006-col-gap), 1fr)
    max-content
    var(--crm6006-panel-pad-x);
  padding-left: 0;
  padding-right: 0;
}

.crm6006-edge,
.crm6006-gutter {
  min-width: 0;
  pointer-events: none;
}

.crm6006-cell {
  box-sizing: border-box;
  display: grid;
  width: max-content;
  max-width: 100%;
  min-width: 0;
  min-height: var(--crm6006-row-min-h);
  grid-template-columns: max-content max-content;
  column-gap: var(--crm6006-item-gap);
  align-items: center;
}

.crm6006-cell--check {
  grid-template-columns: max-content;
}

.crm6006-exclude-label {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  min-height: var(--crm6006-row-min-h);
  font-size: 0.9375rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
}

.crm6006-exclude-chk {
  width: 1rem;
  height: 1rem;
  margin: 0;
  accent-color: #2563eb;
  cursor: pointer;
}

.crm6006-lbl {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: max-content;
  min-height: var(--crm6006-row-min-h);
  font-size: 0.9375rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
  white-space: nowrap;
}

.crm6006-field {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  width: max-content;
  max-width: 100%;
  min-width: 0;
  min-height: var(--crm6006-row-min-h);
}

.crm6006-select {
  box-sizing: border-box;
  width: var(--crm6006-select-w);
  min-width: 0;
  height: var(--crm6006-control-h);
  min-height: var(--crm6006-control-h);
  max-height: var(--crm6006-control-h);
  padding: 0 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: rgb(30 41 59);
  background: #fff;
  border: 1px solid var(--crm6006-control-border, #cbd5e1);
  border-radius: 0.375rem;
}

.crm6006-select:focus {
  border-color: #3b82f6;
  outline: none;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.35);
}

.crm6006-date-slot :deep(> div.flex.justify-start.items-center) {
  margin: 0 !important;
  width: max-content !important;
  max-width: 100%;
  min-height: var(--crm6006-row-min-h);
  align-items: center;
}

.crm6006-date-slot :deep(input[type="date"]) {
  box-sizing: border-box;
  height: var(--crm6006-control-h);
  min-height: var(--crm6006-control-h);
  max-height: var(--crm6006-control-h);
  border: 1px solid var(--crm6006-control-border, #cbd5e1);
  border-radius: 0.375rem;
  background: #fff;
}

.crm6006-date-slot :deep(input[type="date"]:focus) {
  border-color: #3b82f6;
}

.crm6006-date-slot :deep(div.inline-flex.h-8),
.crm6006-date-slot :deep(button) {
  height: var(--crm6006-control-h) !important;
  min-height: var(--crm6006-control-h) !important;
}

.crm6006-popup-mask {
  position: fixed;
  inset: 0;
  z-index: 10050;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(0 0 0 / 0.45);
}

.crm6006-popup {
  --crm6006-form-label-col: 6.5rem;
  --crm6006-form-row-h: 2.5rem;
  --crm6006-form-cell-py: 0.4375rem;
  --crm6006-form-font: 0.8125rem;
  --crm6006-form-control-h: 1.625rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: min(36rem, 94vw);
  max-height: min(90vh, 42rem);
  padding: 1rem 1.25rem 1.25rem;
  border-radius: 0.75rem;
  background: #fff;
  box-shadow: 0 12px 28px rgb(15 23 42 / 0.18);
  overflow: auto;
}

.crm6006-popup-head {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.crm6006-popup-title {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.25rem;
  color: #111827;
}

.crm6006-popup-title::before {
  content: "";
  display: inline-block;
  flex-shrink: 0;
  width: 0.25rem;
  height: 0.9em;
  border-radius: 999px;
  background: #2563eb;
}

.crm6006-popup-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.crm6006-form-grid {
  display: grid;
  grid-template-columns: var(--crm6006-form-label-col) minmax(0, 1fr);
  grid-auto-rows: var(--crm6006-form-row-h);
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  overflow: hidden;
  background: #fff;
  flex-shrink: 0;
}

.crm6006-form-grid > * {
  box-sizing: border-box;
  min-height: var(--crm6006-form-row-h);
  align-self: stretch;
}

.crm6006-form-label {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: var(--crm6006-form-row-h);
  padding: var(--crm6006-form-cell-py) 0.375rem;
  border: 1px solid #e5e7eb;
  background: #edf2f7;
  color: #5c5c5c;
  font-size: var(--crm6006-form-font);
  font-weight: 600;
  line-height: 1.25;
  text-align: center;
  word-break: keep-all;
}

.crm6006-form-label--required {
  font-weight: 700;
}

.crm6006-req {
  color: #dc2626;
  margin-right: 0.1rem;
}

.crm6006-form-value {
  display: flex;
  align-items: center;
  min-height: var(--crm6006-form-row-h);
  min-width: 0;
  padding: var(--crm6006-form-cell-py) 0.375rem;
  border: 1px solid #e5e7eb;
  background: #fff;
}

.crm6006-form-value--pick {
  overflow: visible;
}

.crm6006-form-value--pick :deep(> div.flex.text-base),
.crm6006-form-value--pick :deep(> div) {
  width: 100%;
  min-width: 0;
  align-items: center;
  gap: 0.35rem !important;
}

/* 외부 라벨만 쓰고 PickStore 내부 빈 라벨 숨김 */
.crm6006-form-value--pick :deep(> div.flex > div:first-child) {
  display: none;
}

.crm6006-form-value--pick :deep(.relative.min-w-0.flex-1) {
  flex: 1 1 auto !important;
  min-width: 0 !important;
  max-width: 100% !important;
  width: 100% !important;
}

/* 결제구분·매입사(.crm6006-control)와 동일 테두리·높이 */
.crm6006-form-value--pick :deep(select),
.crm6006-form-value--pick :deep(.pickstore-vs-shell) {
  box-sizing: border-box !important;
  width: 100% !important;
  min-width: 0 !important;
  height: var(--crm6006-form-control-h) !important;
  min-height: var(--crm6006-form-control-h) !important;
  max-height: var(--crm6006-form-control-h) !important;
  border: 1px solid #cbd5e1 !important;
  border-radius: 0.375rem !important;
  background: #fff !important;
  font-size: var(--crm6006-form-font) !important;
  line-height: 1 !important;
  overflow: hidden !important;
}

.crm6006-form-value--pick :deep(.style-chooser),
.crm6006-form-value--pick :deep(.pickstore-chooser) {
  width: 100% !important;
  height: 100% !important;
}

.crm6006-form-value--pick :deep(.vs__dropdown-toggle) {
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

.crm6006-form-value--pick :deep(.vs__selected-options) {
  display: flex !important;
  align-items: center !important;
  flex-wrap: nowrap !important;
  overflow: hidden !important;
  padding: 0 0.25rem !important;
}

.crm6006-form-value--pick :deep(.vs__selected) {
  margin: 0 !important;
  padding: 0 !important;
  font-size: var(--crm6006-form-font) !important;
  line-height: 1.25 !important;
  white-space: nowrap !important;
  color: #1e293b !important;
}

.crm6006-form-value--pick :deep(.vs__search) {
  margin: 0 !important;
  padding: 0 !important;
  height: 1rem !important;
  font-size: var(--crm6006-form-font) !important;
}

.crm6006-form-value--pick :deep(.vs__actions) {
  padding: 0 0.25rem !important;
}

.crm6006-form-value--pick :deep(.vs__open-indicator) {
  transform: scale(0.75);
  fill: #64748b;
}

.crm6006-form-value--pick :deep(select:focus),
.crm6006-form-value--pick :deep(.pickstore-vs-shell:focus-within) {
  border-color: #3b82f6 !important;
  outline: none;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.25);
}

.crm6006-control {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  height: var(--crm6006-form-control-h);
  min-height: var(--crm6006-form-control-h);
  max-height: var(--crm6006-form-control-h);
  padding: 0 0.5rem;
  font-size: var(--crm6006-form-font);
  line-height: 1;
  color: #1e293b;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  background: #fff;
}

.crm6006-control:focus,
.crm6006-control:focus-visible {
  border-color: #3b82f6;
  outline: none;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.25);
}

@media (max-width: 1100px) {
  .crm6006-search-panel {
    --crm6006-panel-pad-x: 2rem;
  }

  .crm6006-search-grid {
    grid-template-columns: minmax(0, 1fr);
    justify-content: stretch;
    row-gap: 0.75rem;
    padding-left: var(--crm6006-panel-pad-x);
    padding-right: var(--crm6006-panel-pad-x);
  }

  .crm6006-edge,
  .crm6006-gutter {
    display: none;
  }

  .crm6006-cell {
    width: 100%;
    max-width: 100%;
    grid-template-columns: max-content minmax(0, 1fr);
  }

  .crm6006-field,
  .crm6006-select {
    width: 100%;
    max-width: 100%;
  }

  .crm6006-date-slot :deep(> div.flex.justify-start.items-center) {
    width: 100% !important;
  }
}
</style>
<!-- append-to-body 드롭다운은 scoped 미적용 — 판매등록 팝업(10050)보다 위 -->
<style>
body.crm6006-salepop-active .vs__dropdown-menu {
  z-index: 10060 !important;
}
</style>
