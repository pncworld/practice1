<!-- /*--############################################################################
# Filename : PUR03_018RPT.vue
# Description : 구매관리2 > 발주 관리 > 발주메일전송현황.
# Date :2025-09-24
# Author : 권맑음
################################################################################*/ -->
<template>
  <!-- pl-5: 셸 w-right가 pl0이라 그리드가 좌측 메뉴에 붙음 → 우측 pd20과 맞춤 -->
  <div class="flex h-full min-h-0 flex-col pl-5" @click="handleParentClick">
    <div class="flex shrink-0 justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center space-x-2 pr-5">
        <button type="button" @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <button type="button" @click="reSendButton" class="button w-auto primary">
          재발송
        </button>
        <button type="button" @click="excelButton" class="button w-auto excel">엑셀</button>
      </div>
    </div>

    <div
      class="pur018-search-panel z-10 mt-3 w-full min-h-0 shrink-0 rounded-lg bg-gray-200"
      :style="{
        '--pur018-control-border': pur018ControlBorder,
        '--pur018-item-gap': pur018ItemGap,
        '--pur018-col-gap': pur018ColGap,
        '--pur018-panel-pad-x': pur018PanelPadX,
        '--pur018-date-field-w': pur018DateFieldW,
        '--pur018-bc-field-w': pur018BcFieldW,
        '--pur018-row-min-h': pur018RowMinH,
        '--pur018-control-h': pur018ControlH,
      }">
      <!-- [edge5] 날짜고정 [spacer] 거래처고정 [spacer] 라디오 [edge5] — 앞=뒤, 선택기간 늘리지 않음 -->
      <div class="pur018-wire-grid min-w-0">
        <div class="pur018-edge" aria-hidden="true"></div>
        <div class="pur018-wire-cell">
          <div class="pur018-wire-label">선택기간</div>
          <div class="pur018-wire-field pur018-date-slot min-w-0 overflow-hidden">
            <Datepicker2
              ref="datepicker"
              omit-main-label
              filter-bar-align
              :mainName="'선택기간'"
              :initToday="1"
              :closePopUp="closePopUp"
              @excelDate="excelDate"
              @endDate="endDate"
              @startDate="startDate" />
          </div>
        </div>
        <div class="pur018-spacer" aria-hidden="true"></div>
        <div class="pur018-wire-cell">
          <div class="pur018-wire-label">거래처</div>
          <div class="pur018-wire-field pur018-bc-slot min-w-0">
            <BusinessClient
              compact-search-bar
              :default-nm="'전체'"
              @SupplierId="SupplierId" />
          </div>
        </div>
        <div class="pur018-spacer" aria-hidden="true"></div>
        <div class="pur018-wire-cell pur018-wire-cell--radio">
          <div class="pur018-wire-label">조회유형</div>
          <div class="pur018-wire-field pur018-radio-row min-w-0">
            <label class="pur018-radio" for="pur03-018-cond-0">
              <input
                id="pur03-018-cond-0"
                type="radio"
                name="pur03-018-cond"
                v-model="cond"
                value="0" />
              전체
            </label>
            <label class="pur018-radio" for="pur03-018-cond-1">
              <input
                id="pur03-018-cond-1"
                type="radio"
                name="pur03-018-cond"
                v-model="cond"
                value="1" />
              정상
            </label>
            <label class="pur018-radio" for="pur03-018-cond-2">
              <input
                id="pur03-018-cond-2"
                type="radio"
                name="pur03-018-cond"
                v-model="cond"
                value="2" />
              실패
            </label>
          </div>
        </div>
        <div class="pur018-edge" aria-hidden="true"></div>
      </div>
    </div>

    <div class="mt-2 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <div class="pur018-notice shrink-0 text-sm text-indigo-600">
        <div class="pur018-notice-item">
          <img
            src="@/assets/images/ic-info.svg"
            alt=""
            class="pur018-notice-icon"
            aria-hidden="true" />
          <span>메일 제목을 더블클릭하시면 메일 내용 확인이 가능합니다.</span>
        </div>
      </div>
      <Realgrid
        class="pur018-grid-body min-h-0 w-full flex-1"
        :progname="'PUR03_018RPT_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :setStateBar="false"
        :selectionStyle="'block'"
        @dblclickedRowData="dblclickedRowData"
        @updatedRowData="updatedRowData"
        @buttonClicked="buttonClicked"
        @clickedButtonCol="clickedButtonCol"
        :checkRenderEditable="true"
        :checkRowAuto="false"
        :checkRowAuto2="true"
        :checkRowAuto2Col="'lngCheck'"
        :documentTitle="'PUR03_018RPT'"
        :documentSubTitle="documentSubTitle"
        :rowStateeditable="false"
        :exporttoExcel="exportExcel" />
    </div>
  </div>

  <Teleport to="body">
    <div v-if="open" class="pur018-popup-backdrop" @click.self="open = false">
      <div
        class="pur018-popup-dialog pur018-popup-dialog--mail"
        :style="mailDialogStyle"
        @click.stop>
        <div
          class="pur018-popup-head pur018-popup-head--drag"
          @pointerdown="onMailDragStart">
          <h3 class="pur018-popup-title">메일 내용</h3>
          <button
            type="button"
            class="whitebutton !h-9 !px-5 !py-2 !text-sm !font-semibold !border-gray-500 !text-gray-700 hover:!bg-blue-50 hover:!border-blue-400"
            @click="open = false">
            닫기
          </button>
        </div>
        <div class="pur018-mail-body" v-html="mailBodyHtml"></div>
        <div
          class="pur018-popup-resize"
          aria-hidden="true"
          @pointerdown.stop="onMailResizeStart"></div>
      </div>
    </div>
  </Teleport>

  <Teleport to="body">
    <div v-if="open2" class="pur018-popup-backdrop" @click.self.prevent>
      <div class="pur018-popup-dialog pur018-popup-dialog--resend" @click.stop>
        <div class="pur018-popup-head">
          <h3 class="pur018-popup-title">메일 재발송</h3>
          <div class="pur018-popup-actions">
            <button
              type="button"
              class="whitebutton !h-9 !px-5 !py-2 !text-sm !font-semibold !border-gray-500 !text-gray-700 hover:!bg-blue-50 hover:!border-blue-400"
              @click="reSendButton2">
              재발송
            </button>
            <button
              type="button"
              class="whitebutton !h-9 !px-5 !py-2 !text-sm !font-semibold !border-gray-500 !text-gray-700 hover:!bg-blue-50 hover:!border-blue-400"
              @click="open2 = false">
              닫기
            </button>
          </div>
        </div>
        <div
          class="pur018-popup-fields"
          :style="{
            '--pur018-popup-border': pur018ControlBorder,
            '--pur018-popup-label': pur018PopupLabelCol,
            '--pur018-popup-gap': pur018PopupFieldGap,
          }">
          <div class="pur018-popup-grid">
            <div class="pur018-popup-label">
              <div class="pur018-popup-label-inner">거래처</div>
            </div>
            <div class="pur018-popup-cell">
              <input type="text" class="pur018-popup-input" disabled v-model="scond" />
            </div>
            <div class="pur018-popup-label">
              <div class="pur018-popup-label-inner">제목</div>
            </div>
            <div class="pur018-popup-cell">
              <input type="text" class="pur018-popup-input" disabled v-model="scond2" />
            </div>
            <div class="pur018-popup-label">
              <div class="pur018-popup-label-inner">발송일자</div>
            </div>
            <div class="pur018-popup-cell">
              <input type="text" class="pur018-popup-input" disabled v-model="scond3" />
            </div>
            <div class="pur018-popup-label">
              <div class="pur018-popup-label-inner">변경 메일주소</div>
            </div>
            <div class="pur018-popup-cell">
              <input
                type="text"
                class="pur018-popup-input pur018-popup-input--editable"
                v-model="scond4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { getOrderMailSendList, resendMail, resendMail2 } from "@/api/mipur";
import BusinessClient from "@/components/businessClient2.vue";
import Datepicker2 from "@/components/Datepicker2.vue";
import PageName from "@/components/pageName.vue";
import Realgrid from "@/components/realgrid.vue";
import { insertPageLog } from "@/customFunc/customFunc";
import Swal from "sweetalert2";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useStore } from "vuex";

const pur018ControlBorder = "#cbd5e1";
const pur018ItemGap = "2rem"; /* 라벨↔컨트롤 */
const pur018ColGap = "1.75rem";
/* 앞·뒤 동일 (기존 2.5rem × 2) — edge 박스로 보장 */
const pur018PanelPadX = "7rem"; /* 앞·뒤만 확대 → 항목 사이 spacer 줄어 모임 */
/* 선택기간: 이전에 괜찮던 고정 폭 (1fr로 늘리지 않음) */
const pur018DateFieldW = "21.6rem"; /* 18rem × 1.2 */
/* 거래처: 축소 고정 */
const pur018BcFieldW = "17.94rem"; /* 14.95rem × 1.2 */
const pur018RowMinH = "2rem";
const pur018ControlH = "2rem";
const pur018PopupLabelCol = "7rem";
const pur018PopupFieldGap = "0.5rem";

onMounted(async () => {
  await insertPageLog(store.state.activeTab2);
});

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

const cond = ref("0");

const store = useStore();

const datepicker = ref(null);
const closePopUp = ref(false);

const handleParentClick = (e) => {
  const datepickerEl = datepicker.value?.$el;
  if (datepickerEl && datepickerEl.contains(e.target)) {
    return;
  }
  closePopUp.value = !closePopUp.value;
};

const sDate = ref("");
const eDate = ref("");

const selectedDate = ref();
const excelDate = (e) => {
  selectedDate.value = e;
};

const storeCode = ref();
const lngStoreCode = (e) => {
  initGrid();
  storeCode.value = e;
};

const supplierid = ref("");
const SupplierId = (e) => {
  supplierid.value = e;
};

const searchButton = async () => {
  try {
    store.state.loading = true;
    initGrid();

    const res = await getOrderMailSendList(
      store.state.userData.lngStoreGroup,
      supplierid.value,
      sDate.value.replaceAll("-", ""),
      eDate.value.replaceAll("-", ""),
      cond.value
    );

    rowData.value = res.data.List;
    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
  } finally {
    store.state.loading = false;
  }
};

const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
  reload.value = !reload.value;
};

const exportExcel = ref(false);

const excelButton = () => {
  documentSubTitle.value = selectedDate.value;
  exportExcel.value = !exportExcel.value;
};

const documentSubTitle = ref("");
const selectedExcelStore = ref("");

const excelStore = (e) => {
  selectedExcelStore.value = e;
};

const startDate = (e) => {
  sDate.value = e;
};
const endDate = (e) => {
  eDate.value = e;
};

const open = ref(false);
const tempBody = ref("");
const mailBodyHtml = computed(() => {
  let html = String(tempBody.value ?? "");
  html = html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
  html = html.replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, "");
  html = html.replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");
  return html;
});

const MAIL_W0 = () => Math.min(window.innerWidth * 0.6, 57.6 * 16);
const MAIL_H0 = () => Math.min(window.innerHeight * 0.5, 28 * 16);
const MAIL_MIN_W = 360;
const MAIL_MIN_H = 220;
const mailBox = ref({ left: 0, top: 0, w: 480, h: 320 });
const mailDialogStyle = computed(() => ({
  left: `${mailBox.value.left}px`,
  top: `${mailBox.value.top}px`,
  width: `${mailBox.value.w}px`,
  height: `${mailBox.value.h}px`,
}));

const resetMailBox = () => {
  const w = MAIL_W0();
  const h = MAIL_H0();
  mailBox.value = {
    left: Math.max(0, (window.innerWidth - w) / 2),
    top: Math.max(0, (window.innerHeight - h) / 2),
    w,
    h,
  };
};

watch(open, (v) => {
  if (v) resetMailBox();
});

let mailDrag = null;
const onMailDragStart = (e) => {
  if (e.button !== 0) return;
  if (e.target.closest("button")) return;
  e.preventDefault();
  mailDrag = {
    kind: "move",
    x: e.clientX,
    y: e.clientY,
    left: mailBox.value.left,
    top: mailBox.value.top,
  };
  window.addEventListener("pointermove", onMailPointerMove);
  window.addEventListener("pointerup", onMailPointerUp);
};

const onMailResizeStart = (e) => {
  if (e.button !== 0) return;
  e.preventDefault();
  mailDrag = {
    kind: "resize",
    x: e.clientX,
    y: e.clientY,
    w: mailBox.value.w,
    h: mailBox.value.h,
  };
  window.addEventListener("pointermove", onMailPointerMove);
  window.addEventListener("pointerup", onMailPointerUp);
};

const onMailPointerMove = (e) => {
  if (!mailDrag) return;
  const dx = e.clientX - mailDrag.x;
  const dy = e.clientY - mailDrag.y;
  if (mailDrag.kind === "move") {
    mailBox.value = {
      ...mailBox.value,
      left: Math.min(
        window.innerWidth - 80,
        Math.max(0, mailDrag.left + dx)
      ),
      top: Math.min(
        window.innerHeight - 48,
        Math.max(0, mailDrag.top + dy)
      ),
    };
    return;
  }
  mailBox.value = {
    ...mailBox.value,
    w: Math.min(window.innerWidth - mailBox.value.left, Math.max(MAIL_MIN_W, mailDrag.w + dx)),
    h: Math.min(window.innerHeight - mailBox.value.top, Math.max(MAIL_MIN_H, mailDrag.h + dy)),
  };
};

const onMailPointerUp = () => {
  mailDrag = null;
  window.removeEventListener("pointermove", onMailPointerMove);
  window.removeEventListener("pointerup", onMailPointerUp);
};

onUnmounted(() => {
  onMailPointerUp();
});

const dblclickedRowData = (e) => {
  if (tempColId.value == "subject") {
    tempBody.value = e[10];
    open.value = true;
  }
};

const tempColId = ref("");
const clickedButtonCol = (e) => {
  tempColId.value = e;
};

const open2 = ref(false);

const scond = ref("");
const scond2 = ref("");
const scond3 = ref("");
const scond4 = ref("");

const tempMailItemID = ref("");
const buttonClicked = (e) => {
  tempMailItemID.value = e[1];
  scond.value = e[3];
  scond2.value = e[5];
  scond3.value = e[2];
  scond4.value = e[4];
  open2.value = true;
};

const reSendButton2 = async () => {
  try {
    const res = await resendMail(scond4.value, tempMailItemID.value);

    if (res.data.RESULT_CD == "00") {
      await Swal.fire({
        title: "성공",
        text: "메일을 재전송 하였습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
    } else {
      await Swal.fire({
        title: "실패",
        text: "메일 재전송에 실패하였습니다.",
        icon: "error",
        confirmButtonText: "확인",
      });
    }
  } catch (error) {}

  open2.value = false;
};

const reSendButton = async () => {
  try {
    const filtered = updatedrowdata.value
      .filter((item) => item.lngCheck == true)
      .map((item) => item.mailitem_id)
      .join("\u200b");
    const res = await resendMail2(filtered);

    if (res.data.RESULT_CD == "00") {
      await Swal.fire({
        title: "성공",
        text: "메일을 재전송 하였습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
    } else {
      await Swal.fire({
        title: "실패",
        text: "메일 재전송에 실패하였습니다.",
        icon: "error",
        confirmButtonText: "확인",
      });
    }
  } catch (error) {}

  open2.value = false;
};

const updatedrowdata = ref([]);
const updatedRowData = (e) => {
  updatedrowdata.value = e;
};
</script>

<style scoped>
.pur018-search-panel {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  padding-left: 0;
  padding-right: 0;
  padding-block: 0.75rem;
  overflow-x: visible;
}

.pur018-wire-grid {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  padding-left: 0;
  padding-right: 0;
  column-gap: 0;
}

/* 앞·뒤 동일 --pur018-panel-pad-x(7rem) — 남는 폭이 뒤로 몰리지 않게 edge로 고정 */
.pur018-edge {
  flex: 0 0 var(--pur018-panel-pad-x);
  width: var(--pur018-panel-pad-x);
  min-width: var(--pur018-panel-pad-x);
  max-width: var(--pur018-panel-pad-x);
  align-self: stretch;
}

/* 항목 사이만 여열 분배 (선택기간·거래처 폭은 건드리지 않음) */
.pur018-spacer {
  flex: 1 1 0;
  min-width: var(--pur018-col-gap);
  align-self: stretch;
}

.pur018-wire-cell {
  display: flex;
  flex: 0 0 auto;
  min-width: 0;
  min-height: var(--pur018-row-min-h);
  flex-direction: row;
  align-items: center;
  gap: var(--pur018-item-gap);
}

.pur018-wire-label {
  flex: 0 0 auto;
  width: max-content;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: var(--pur018-row-min-h);
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
  text-align: left;
  white-space: nowrap;
}

.pur018-wire-field {
  display: flex;
  flex: 0 0 auto;
  min-width: 0;
  align-items: center;
  justify-content: flex-start;
  min-height: var(--pur018-row-min-h);
}

.pur018-radio-row {
  display: flex;
  flex: 0 0 auto;
  flex-wrap: nowrap;
  align-items: center;
  gap: 0.75rem 1rem;
  min-width: 0;
  overflow: visible;
}

.pur018-radio {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  min-height: var(--pur018-row-min-h);
  font-size: 0.875rem;
  font-weight: 500;
  color: rgb(55 65 81);
  white-space: nowrap;
  cursor: pointer;
}

.pur018-radio input[type="radio"] {
  width: 0.9rem;
  height: 0.9rem;
  margin: 0;
  flex-shrink: 0;
  accent-color: #3b82f6;
}

/* 선택기간 — 고정 (1fr로 늘리지 않음) */
.pur018-date-slot {
  width: var(--pur018-date-field-w);
  max-width: var(--pur018-date-field-w);
}

/* 거래처 — 축소 고정 */
.pur018-bc-slot {
  width: var(--pur018-bc-field-w);
  max-width: var(--pur018-bc-field-w);
}

.pur018-bc-slot :deep(> div.flex.text-base) {
  margin: 0 !important;
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0;
  gap: 0 !important;
}

.pur018-search-panel .pur018-bc-slot :deep(.pickstore-vs-shell) {
  box-sizing: border-box !important;
  height: var(--pur018-control-h) !important;
  min-height: var(--pur018-control-h) !important;
  max-height: var(--pur018-control-h) !important;
  border: 1px solid var(--pur018-control-border) !important;
  border-radius: 0.375rem !important;
  font-size: 0.875rem !important;
  background: #fff !important;
  width: 100% !important;
  max-width: 100%;
  min-width: 0;
}

.pur018-bc-slot :deep(.vs__dropdown-toggle) {
  height: 100% !important;
  min-height: 0 !important;
  border: none !important;
}

.pur018-search-panel .pur018-date-slot :deep(> div.flex.justify-start.items-center) {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0;
  margin: 0 !important;
  gap: 0.25rem !important;
}

.pur018-search-panel .pur018-date-slot :deep(> div.flex > div.inline-flex.h-8) {
  flex: 1 1 auto;
  min-width: 0;
  max-width: 100%;
  width: 100%;
  gap: 0.125rem !important;
}

.pur018-search-panel .pur018-date-slot :deep(input[type="date"]) {
  box-sizing: border-box;
  height: var(--pur018-control-h) !important;
  min-height: var(--pur018-control-h) !important;
  max-height: var(--pur018-control-h) !important;
  border: 1px solid var(--pur018-control-border) !important;
  width: auto !important;
  flex: 1 1 0;
  min-width: 6.5rem;
  max-width: none;
  padding-left: 0.45rem;
  padding-right: 0.25rem;
  font-size: 0.875rem;
}

.pur018-search-panel .pur018-date-slot :deep(input[type="date"]:focus) {
  border-color: #3b82f6 !important;
}

.pur018-search-panel .pur018-date-slot :deep(div.inline-flex.h-8 > span) {
  flex-shrink: 0;
}

.pur018-search-panel .pur018-date-slot :deep(div.inline-flex.h-8 > button) {
  flex-shrink: 0;
  width: 1.65rem !important;
  height: 1.65rem !important;
  min-width: 1.65rem;
  margin-left: 0 !important;
}

.pur018-notice {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  margin-bottom: 0.375rem;
}

.pur018-notice-item {
  display: flex;
  align-items: flex-start;
  min-width: 0;
}

.pur018-notice-icon {
  flex-shrink: 0;
  width: 1rem;
  height: 1rem;
  margin-top: 0.125rem;
  margin-right: 0.25rem;
}

.pur018-grid-body {
  min-height: 12rem;
}

.pur018-popup-backdrop {
  position: fixed;
  inset: 0;
  z-index: 11000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(0 0 0 / 0.5);
}

.pur018-popup-dialog {
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: 1.25rem 1.5rem;
  border-radius: 1rem;
  background: #fff;
  box-shadow: 0 20px 40px rgb(0 0 0 / 0.2);
  overflow: hidden;
}

.pur018-popup-dialog--mail {
  position: fixed;
  margin: 0;
  /* 가로 기존 min(50vw, 48rem) × 1.2 */
  min-width: 22.5rem;
  min-height: 13.75rem;
}

.pur018-popup-head--drag {
  cursor: move;
  user-select: none;
}

.pur018-popup-resize {
  position: absolute;
  right: 0.25rem;
  bottom: 0.25rem;
  width: 0.9rem;
  height: 0.9rem;
  cursor: nwse-resize;
  background:
    linear-gradient(135deg, transparent 50%, #94a3b8 50%, #94a3b8 62%, transparent 62%),
    linear-gradient(135deg, transparent 70%, #94a3b8 70%, #94a3b8 82%, transparent 82%);
}

.pur018-popup-dialog--resend {
  width: min(30vw, 28rem);
  min-height: 16rem;
}

.pur018-popup-head {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.pur018-popup-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: rgb(17 24 39);
}

.pur018-popup-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.pur018-mail-body {
  box-sizing: border-box;
  width: 100%;
  min-height: 0;
  flex: 1 1 auto;
  overflow: auto;
  padding: 0.75rem;
  border: 1px solid var(--pur018-control-border, #cbd5e1);
  border-radius: 0.375rem;
  font-size: 0.875rem;
  line-height: 1.5;
  color: rgb(17 24 39);
  background: #fff;
}

.pur018-mail-body :deep(table) {
  border-collapse: collapse;
  max-width: 100%;
  margin: 0.5rem 0;
}

.pur018-mail-body :deep(td),
.pur018-mail-body :deep(th) {
  border: 1px solid #cbd5e1;
  padding: 0.25rem 0.5rem;
  font-size: 0.8125rem;
}

.pur018-popup-fields {
  box-sizing: border-box;
  min-width: 0;
  padding: 0.875rem 1rem;
  border-radius: 0.5rem;
  background: #f3f4f6;
}

.pur018-popup-grid {
  display: grid;
  width: 100%;
  min-width: 0;
  grid-template-columns: minmax(0, var(--pur018-popup-label)) minmax(0, 1fr);
  column-gap: 0.75rem;
  row-gap: var(--pur018-popup-gap);
  align-items: center;
}

.pur018-popup-label {
  min-width: 0;
  max-width: var(--pur018-popup-label);
}

.pur018-popup-label-inner {
  display: flex;
  width: 100%;
  min-height: 2rem;
  align-items: center;
  justify-content: center;
  padding: 0.125rem 0.25rem;
  text-align: center;
  font-size: 0.875rem;
  font-weight: 600;
  color: rgb(17 24 39);
}

.pur018-popup-cell {
  display: flex;
  min-width: 0;
  align-items: center;
}

.pur018-popup-input {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  height: 2rem;
  min-height: 2rem;
  border-radius: 0.375rem;
  border: 1px solid var(--pur018-popup-border) !important;
  background-color: #fff;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  font-size: 0.875rem;
  color: rgb(55 65 81);
}

.pur018-popup-input:disabled {
  background-color: rgb(229 231 235);
  color: rgb(75 85 99);
}

.pur018-popup-input--editable:focus {
  border-color: #3b82f6 !important;
  outline: none;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.35);
}
</style>
