<!-- /*--############################################################################
# Filename : STK05_013RPT.vue                                                  
# Description : 자재관리 > 주문 관리 > 주문출고서발행.               
# Date :2025-09-29                                                           
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <!-- 조회조건 -->
  <!-- pl-5: 셸 w-right가 pl0이라 그리드가 좌측 메뉴에 붙음 → 우측 pd20과 맞춤 -->
  <div class="stk513-page flex h-full min-h-0 flex-col pl-5" @click="handleParentClick">
    <div class="flex shrink-0 justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center space-x-2 pr-5">
        <button @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>

        <button @click="excelButton" class="button excel">엑셀</button>
        <button @click="printButton" class="button print md:w-auto w-14">
          인쇄
        </button>
      </div>
    </div>
    <div
      class="stk513-search-panel z-10 mt-3 w-full min-w-0 shrink-0 rounded-lg bg-gray-200">
      <div class="stk513-search-grid min-w-0">
        <div class="stk513-cell">
          <div class="stk513-sg-label">청구일자</div>
          <div class="stk513-cell-field stk513-range-slot min-w-0">
            <Datepicker2
              omit-main-label
              filter-bar-align
              :mainName="'청구일자'"
              @endDate="endDate"
              :initToday="1"
              @startDate="startDate"></Datepicker2>
          </div>
        </div>
        <div class="stk513-cell">
          <label class="stk513-sg-label" for="stk05-013-driver">배송기사</label>
          <div class="stk513-cell-field min-w-0">
            <select
              id="stk05-013-driver"
              class="stk513-control"
              v-model="cond3">
              <option value="0">전체</option>
              <option :value="i.lngShippingCode" v-for="i in optionList" :key="i.lngShippingCode">
                {{ i.strShippingName }}
              </option>
            </select>
          </div>
        </div>

        <div class="stk513-cell">
          <div class="stk513-sg-label">출고매장</div>
          <div class="stk513-cell-field stk513-pick-slot min-w-0">
            <PickStore
              compact-search-bar
              :compact-store-combo-max-rem="96"
              main-name=""
              :hideGroup="false"
              :hideAttr="false"
              @update:storeCd="lngStoreCode"
              :defaultStore="true"
              :defaultStoreNm="'전체'"
              :setDynamicStoreClass="'!h-8 !p-0'"
              :mainName="'출고매장'"></PickStore>
          </div>
        </div>
        <div class="stk513-cell">
          <div class="stk513-sg-label">입고매장</div>
          <div class="stk513-cell-field stk513-pick-slot min-w-0">
            <PickStore
              compact-search-bar
              :compact-store-combo-max-rem="96"
              main-name=""
              :hideGroup="false"
              :hideAttr="false"
              @update:storeCd="lngStoreCode2"
              :defaultStore="true"
              :defaultStoreNm="'전체'"
              :setDynamicStoreClass="'!h-8 !p-0'"
              :mainName="'입고매장'"></PickStore>
          </div>
        </div>
      </div>
    </div>
    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="mt-3 min-h-0 w-full flex-1">
      <Realgrid
        :progname="'STK05_013RPT_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :setStateBar="false"
        :documentTitle="'STK05_013RPT'"
        @updatedRowData="updatedRowData"
        @clickedButtonCol="clickedButtonCol"
        @dblclickedRowData="dblclickedRowData"
        :checkRenderEditable="true"
        :checkRowAuto="false"
        :checkRowAuto2="true"
        :checkRowAuto2Col="'chk'"
        :documentSubTitle="documentSubTitle"
        :rowStateeditable="false"
        :exporttoExcel="exportExcel">
      </Realgrid>
    </div>
  </div>

  <Teleport to="body">
  <div
    v-if="open"
    class="stk513-popup-backdrop"
    @mousedown.self.prevent>
    <div
      class="stk513-popup"
      role="dialog"
      aria-modal="true"
      aria-label="출고내역상세"
      :style="detailPop.style"
      @mousedown.stop
      @keydown.esc="open = false">
      <div class="stk513-popup-head" @mousedown="onDetailHeadDown">
        <h2 class="stk513-popup-title">출고내역상세</h2>
        <div class="stk513-popup-actions" @mousedown.stop>
          <button type="button" class="pnc-sub-btn pnc-sub-btn--gray" @click="open = false">
            <svg class="pnc-sub-btn__icon" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M4 4l8 8M12 4 4 12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
            </svg>
            닫기
          </button>
        </div>
      </div>

      <div class="stk513-form-grid">
        <label class="stk513-form-label" for="stk05-013-pop-out">출고매장</label>
        <div class="stk513-form-value">
          <input
            id="stk05-013-pop-out"
            type="text"
            class="stk513-pop-control"
            v-model="scond"
            disabled />
        </div>
        <label class="stk513-form-label" for="stk05-013-pop-in">입고매장</label>
        <div class="stk513-form-value">
          <input
            id="stk05-013-pop-in"
            type="text"
            class="stk513-pop-control"
            v-model="scond2"
            disabled />
        </div>
        <label class="stk513-form-label" for="stk05-013-pop-no">출고번호</label>
        <div class="stk513-form-value">
          <input
            id="stk05-013-pop-no"
            type="text"
            class="stk513-pop-control"
            v-model="scond3"
            disabled />
        </div>
      </div>

      <div class="stk513-popup-grid">
        <Realgrid
          :progname="'STK05_013RPT_VUE'"
          :progid="2"
          :rowData="rowData2"
          :documentTitle="'STK05_013RPT'"
          :rowStateeditable="false"
          @realgridname="onPopupGridName"
          :setStateBar="false"></Realgrid>
      </div>

      <div
        class="stk513-popup-resize"
        title="크기 조절"
        @mousedown.stop="onDetailResizeDown"></div>

      <!-- 공통 로딩(BasicLayout, z-index 100)은 body 로 옮긴 팝업 뒤에 가려지므로 팝업 안에 표시 -->
      <div v-if="store.state.loading" class="stk513-popup-loading" role="status" aria-label="처리 중">
        <img :src="loadingGif" alt="" />
      </div>
    </div>
  </div>
  </Teleport>
  <!-- 그리드 영역 -->
</template>

<script setup>
import {
  getOrderOutList,
  getOutDetailList,
  getShippingInfo,
  saveStockConfirm,
  saveStockConfirmAll,
} from "@/api/mistock";
import PageName from "@/components/pageName.vue";
import Realgrid from "@/components/realgrid.vue";
import { rgGetInstance } from "@/components/realgridInstanceRegistry.js";
import { insertPageLog } from "@/customFunc/customFunc";
import { useFloatPopup } from "@/utils/floatPopup";
import loadingGif from "@/assets/images/loading.gif";
import { nextTick, onMounted, ref, watch } from "vue";

import Datepicker2 from "@/components/Datepicker2.vue";
import PickStore from "@/components/pickStore.vue";
import Swal from "sweetalert2";
import { useStore } from "vuex";

/** 출고내역상세 팝업 — 이동·크기 조절 (STK01_011INS 청구 등록 팝업과 같은 방식) */
const detailPop = useFloatPopup({
  width: 1100,
  height: 620,
  minWidth: 640,
  minHeight: 400,
  maxWidthRatio: 0.95,
  maxHeightRatio: 0.9,
});

const popupGridName = ref("");
const onPopupGridName = (name) => {
  popupGridName.value = name;
};

const onDetailHeadDown = (event) => {
  detailPop.startDrag(event);
};

const refreshPopupGridSize = () => {
  try {
    rgGetInstance(popupGridName.value)?.gridView?.resetSize?.();
  } catch (_) {
    /* ignore */
  }
  try {
    window.dispatchEvent(new Event("resize"));
  } catch (_) {
    /* ignore */
  }
};

const onDetailResizeDown = (event) => {
  detailPop.startResize(event);
  const onUp = () => {
    window.removeEventListener("mouseup", onUp);
    nextTick(() => refreshPopupGridSize());
  };
  window.addEventListener("mouseup", onUp);
};

const optionList = ref([]);
const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

/**
 * 선택한 매출 시작일자
 */

const cond = ref("0");
const cond2 = ref("0");
const cond3 = ref("0");
const cond4 = ref("");
const cond5 = ref("0");
const tempSeeStore = ref(false);
const reportCheckData = ref("0");
const progId = ref("1");
const mdate = ref("");
const dateValue = (e) => {
  mdate.value = e.replaceAll("-", "");
};
const lngStoreCode = (e) => {
  cond2.value = e;
};
const lngStoreCode2 = (e) => {
  cond3.value = e;
};
const store = useStore();
const loginedstrLang = store.state.userData.lngLanguage;

const datepicker = ref(null);
const closePopUp = ref(false);
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

const cond6 = ref(true);
const checkCond = (e) => {
  cond6.value = e.target.checked;
};

/* 매장 컴포넌트 관련 함수 */
const selectedGroup = ref();
const selectedStore = ref(0);

/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getShippingInfo(store.state.userData.lngStoreGroup);

  optionList.value = res.data.List;

  if (res.data.List.length > 0) {
    cond.value = res.data.List[0].lngStoreCode;
  }

  //console.log(store.state.storeCd);
});

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
  const filterd =
    store.state.storeCd.filter((item) => item.lngStoreCode == cond.value)[0]
      ?.strName || "전체";

  const filterd2 =
    store.state.storeCd.filter((item) => item.lngStoreCode == cond2.value)[0]
      ?.strName || "전체";
  documentSubTitle.value =
    "청구일자 :" +
    sdate.value +
    "~" +
    edate.value +
    "\n" +
    "출고매장 : " +
    filterd +
    "\n" +
    "입고매장 : " +
    filterd2;

  // 엑셀 기능 실행
  exportExcel.value = !exportExcel.value;
};

const documentSubTitle2 = ref("");

// 엑셀 추출
const documentSubTitle = ref("");
const selectedExcelDate = ref("");

const selectedExcelStore = ref("");

const excelStore = (e) => {
  selectedExcelStore.value = e;
  //comsole.log(e);
};

const updatedrowdata = ref([]);
const updatedRowData = (e) => {
  console.log(e);
  updatedrowdata.value = e;
};

const searchButton = async () => {
  try {
    store.state.loading = true;
    const res = await getOrderOutList(
      store.state.userData.lngStoreGroup,
      cond.value,
      cond2.value,
      sdate.value.replaceAll("-", ""),
      edate.value.replaceAll("-", ""),
      cond3.value
    );

    console.log(res);

    store.state.loading = false;
    rowData.value = res.data.List;
    updatedrowdata.value = res.data.List.map((item) => ({
      ...item,
      Selected: false,
    }));
    afterSearch.value = true;
  } catch (error) {}
};

const sdate = ref("");
const startDate = (e) => {
  sdate.value = e;
};
const edate = ref("");
const endDate = (e) => {
  edate.value = e;
};

const tempColID = ref("");
const clickedButtonCol = (e) => {
  console.log(e);
  tempColID.value = e;
};

const clickedrowdata = ref("");

const open = ref(false);
watch(open, (isOpen) => {
  if (isOpen) {
    detailPop.place();
    nextTick(() => refreshPopupGridSize());
  }
});
const disabled = ref(false);

const rowData2 = ref([]);
const scond4 = ref("");
const scond5 = ref("");

const editableColId = ref("");
const tempStoreCd = ref("");
const tempStoreCd2 = ref("");
const dblclickedRowData = async (e) => {
  console.log(e);
  //   console.log(tempColID.value);

  tempStoreCd.value = e[1];
  tempStoreCd2.value = e[2];
  //tempMoveDate.value = e[4];

  editableColId.value = "";
  if (tempColID.value == "strMoveNo") {
    if (e[11] == "01") {
      disabled.value = false;
    } else {
      disabled.value = true;
    }

    //disabled.value = false;

    scond.value = e[3];
    scond2.value = e[5];
    scond3.value = e[6];

    try {
      store.state.loading = true;
      const res = await getOutDetailList(
        store.state.userData.lngStoreGroup,
        e[2],
        e[4],
        e[6]
      );

      console.log(res);

      store.state.loading = false;
      rowData2.value = res.data.List;
    } catch (error) {}
    open.value = true;
  }
};

const scond = ref("");
const scond2 = ref("");
const scond3 = ref("");

const printButton = () => {
  const filtered = updatedrowdata.value.filter((item) => item.chk == true);
  if (filtered.length == 0) {
    Swal.fire({
      title: "경고",
      text: "선택한 출고번호가 존재하지 않습니다.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }
  const storecds = filtered.map((item) => item.lngStoreCode).join(",");
  const storecds2 = filtered.map((item) => item.lngDesStoreCode).join(",");
  const ordercds = filtered.map((item) => item.strMoveNo).join(",");
  window.open(
    `http://222.231.31.99/Report/CRPrint.aspx?pCount=10&Report=STK05_013RPT_RPT&@P_lngStoreGroup=${
      store.state.userData.lngStoreGroup
    }&@P_lngStoreCode=${cond.value}&@P_lngDesStoreCode=${
      cond2.value
    }&@P_dtmFromDate=${sdate.value.replaceAll(
      "-",
      ""
    )}&@P_dtmToDate=${edate.value.replaceAll(
      "-",
      ""
    )}&@P_flag=1&@P_strMoveOutNoList=${ordercds}&@P_strSrcStoreCodeList=${storecds}&@P_strDesStoreCodeList=${storecds2}&@P_lngShippingCode=${
      cond3.value
    }`,
    "_blank",
    "width=1600,height=1200"
  );
};
</script>

<style scoped>
.stk513-page {
  --stk513-item-gap: 1.25rem; /* 항목명 ↔ 콤보 */
  --stk513-col-gap: 2.5rem;
  --stk513-row-gap: 0.625rem;
  /* 앞·뒤 공백: 패널 끝 → 첫 항목명 글자 = 마지막 콤보 끝 → 패널 끝 (기존 앞 공백의 약 1.8배) */
  --stk513-panel-pad-x: 6.5rem;
  --stk513-row-min-h: 2rem;
  --stk513-control-border: #cbd5e1;
  --stk513-control-h: 2rem;
  /* 날짜 칸 한 개 크기 (청구일자의 시작·끝 날짜 칸) */
  --stk513-date-w: 9.6rem; /* 12rem 의 80% — 날짜 칸·콤보 전체가 함께 약 80%로 줄어듦 */
  --stk513-range-tilde-w: 0.75rem;
  --stk513-range-btn-w: 2rem;
  --stk513-range-gap: 0.25rem;
  /* 청구일자 전체 폭(계산값) = 출고매장 = 배송기사 = 입고매장 → 시작선·끝선 일치 */
  --stk513-field-w: calc(
    var(--stk513-date-w) * 2 + var(--stk513-range-tilde-w) + var(--stk513-range-btn-w) +
      var(--stk513-range-gap) * 3
  );
  --stk513-pick-sub-w: 5.25rem; /* 매장 그룹·속성 콤보(계정에 따라 표시) */
}

/* 조회 AREA — 2열(1행: 청구일자·배송기사 / 2행: 출고매장·입고매장), 열 시작선 정렬, 앞·뒤 pad 동일 */
.stk513-search-panel {
  box-sizing: border-box;
  padding-block: 0.75rem;
  padding-inline: var(--stk513-panel-pad-x);
}

.stk513-search-grid {
  display: grid;
  grid-template-columns: repeat(2, max-content);
  justify-content: space-between;
  column-gap: var(--stk513-col-gap);
  row-gap: var(--stk513-row-gap);
  align-items: center;
  width: 100%;
  min-width: 0;
}

.stk513-cell {
  display: flex;
  min-width: 0;
  min-height: var(--stk513-row-min-h);
  align-items: center;
  gap: var(--stk513-item-gap);
}

/* 항목명은 4글자로 모두 같아 글자 폭만큼만 차지 — 칸 안 숨은 여백 없이 앞 공백 = 패널 pad */
.stk513-sg-label {
  flex: 0 0 auto;
  width: max-content;
  min-height: var(--stk513-row-min-h);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
  white-space: nowrap;
}

.stk513-cell-field {
  flex: 0 0 auto;
  min-width: 0;
  min-height: var(--stk513-row-min-h);
  display: flex;
  align-items: center;
}

/* 모든 칸(청구일자·배송기사·출고매장·입고매장) 같은 폭 → 시작선·끝선 모두 맞음 */
.stk513-cell-field > * {
  min-width: 0;
  width: var(--stk513-field-w);
}

.stk513-control {
  box-sizing: border-box;
  height: var(--stk513-control-h);
  min-height: var(--stk513-control-h);
  max-height: var(--stk513-control-h);
  width: var(--stk513-field-w);
  min-width: 0;
  border: 1px solid var(--stk513-control-border);
  border-radius: 0.375rem;
  background: #fff;
  padding: 0 0.5rem;
  font-size: 0.875rem;
  color: rgb(55 65 81);
}

.stk513-control:focus {
  border-color: #3b82f6;
  outline: none;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.25);
}

/*
 * 청구일자 Datepicker2 (filterBarAlign) — 구성 요소를 모두 고정 크기로 두어 전체 폭을 계산값(--stk513-field-w)으로 확정
 * (100% 는 바깥 칸이 내용 크기라 0에 가깝게 계산되므로 쓰지 않음)
 */
.stk513-range-slot :deep(> div.flex.justify-start.items-center) {
  width: var(--stk513-field-w) !important;
  max-width: none !important;
  min-width: 0;
  margin: 0 !important;
  gap: 0 !important;
}

.stk513-range-slot :deep(> div.flex > div.inline-flex.h-8) {
  flex: 0 0 auto;
  width: var(--stk513-field-w);
  min-width: 0;
  margin: 0 !important;
  padding: 0 !important;
  gap: var(--stk513-range-gap) !important;
}

.stk513-range-slot :deep(input[type="date"]) {
  box-sizing: border-box;
  flex: 0 0 var(--stk513-date-w);
  width: var(--stk513-date-w) !important;
  min-width: 0;
  max-width: none !important;
  height: var(--stk513-control-h) !important;
  margin: 0 !important;
  border: 1px solid var(--stk513-control-border) !important;
  padding-left: 0.75rem;
  padding-right: 0.5rem;
  font-size: 0.875rem;
}

.stk513-range-slot :deep(input[type="date"]:focus) {
  border-color: #3b82f6 !important;
}

.stk513-range-slot :deep(div.inline-flex.h-8 > span) {
  flex: 0 0 var(--stk513-range-tilde-w);
  width: var(--stk513-range-tilde-w);
  margin: 0 !important;
  padding: 0 !important;
  text-align: center;
}

.stk513-range-slot :deep(div.inline-flex.h-8 > button) {
  flex: 0 0 var(--stk513-range-btn-w);
  width: var(--stk513-range-btn-w) !important;
  min-width: var(--stk513-range-btn-w) !important;
  height: var(--stk513-control-h) !important;
  margin: 0 !important;
  padding: 0 !important;
}

/* 출고·입고매장 PickStore (compact) — 안쪽 제목 숨김. 전체 폭 = 칸 폭(값 직접), 그룹·속성은 작게, 매장 콤보가 나머지 */
.stk513-pick-slot :deep(> div.flex.text-base) {
  width: var(--stk513-field-w) !important;
  max-width: none !important;
  min-width: 0;
  margin: 0 !important;
  align-items: center;
  gap: 0.5rem !important;
}

.stk513-pick-slot :deep(> div.flex > div:first-child) {
  display: none;
}

.stk513-pick-slot :deep(select) {
  box-sizing: border-box;
  width: var(--stk513-pick-sub-w) !important;
  height: var(--stk513-control-h) !important;
  border: 1px solid var(--stk513-control-border) !important;
}

.stk513-pick-slot :deep(.relative.min-w-0.flex-1) {
  flex: 1 1 auto !important;
  width: auto !important;
  min-width: 0 !important;
  max-width: none !important;
}

.stk513-pick-slot :deep(.pickstore-vs-shell) {
  box-sizing: border-box;
  width: 100% !important;
  max-width: none !important;
  height: var(--stk513-control-h) !important;
  border: 1px solid var(--stk513-control-border) !important;
}

@media (max-width: 1280px) {
  .stk513-search-grid {
    grid-template-columns: max-content;
  }
}

/* ── 출고내역상세 팝업: body Teleport + Swal(13050) 아래 — 이동·크기 조절(floatPopup) ── */
.stk513-popup-backdrop {
  position: fixed;
  inset: 0;
  z-index: 11000;
  background: rgb(0 0 0 / 0.5);
  pointer-events: auto;
}

.stk513-popup {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.5rem;
  background: #fff;
  border-radius: 0.75rem;
  box-shadow: 0 20px 40px rgb(15 23 42 / 0.18);
  overflow: hidden;
  pointer-events: auto;
}

/* 팝업 padding 위·좌우 여백까지 끌기 영역 — 맨 위를 잡아도 이동 */
.stk513-popup-head {
  display: flex;
  flex-shrink: 0;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin: -1.5rem -1.5rem 0;
  padding: 1.5rem 1.5rem 0.75rem;
  border-bottom: 1px solid #d1d5db;
  cursor: move;
  user-select: none;
}

.stk513-popup-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: rgb(17 24 39);
}

.stk513-popup-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  cursor: default;
}

/* 팝업 안 로딩 표시 — 처리 중에는 팝업 전체를 덮어 추가 클릭도 막음 */
.stk513-popup-loading {
  position: absolute;
  inset: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(255 255 255 / 0.55);
  cursor: progress;
}

.stk513-popup-loading img {
  max-width: 80px;
  max-height: 80px;
}

.stk513-form-grid {
  display: grid;
  flex-shrink: 0;
  grid-template-columns: 6.25rem minmax(0, 1fr) 6.25rem minmax(0, 1fr) 6.25rem minmax(0, 1fr);
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  overflow: hidden;
}

.stk513-form-label {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 2.5rem;
  padding: 0.25rem 0.375rem;
  border: 1px solid #e5e7eb;
  background: #edf2f7;
  color: #374151;
  font-size: 0.8125rem;
  font-weight: 600;
  text-align: center;
  word-break: keep-all;
}

.stk513-form-value {
  display: flex;
  align-items: center;
  min-width: 0;
  min-height: 2.5rem;
  padding: 0.25rem 0.5rem;
  border: 1px solid #e5e7eb;
}

.stk513-pop-control {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  height: 2rem;
  padding: 0 0.5rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  background: #f3f4f6;
  font-size: 0.875rem;
  color: #4b5563;
  cursor: not-allowed;
}

.stk513-popup-grid {
  flex: 1 1 auto;
  min-height: 0;
  width: 100%;
}

.stk513-popup-resize {
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
</style>
