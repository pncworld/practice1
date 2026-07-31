<!-- /*--############################################################################
# Filename : PUR01_010RPT.vue                                                  
# Description : 구매관리2 > 발주 관리 > 조회유형별 발주현황                      
# Date :2025-08-26                                                             
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <div class="flex h-full min-h-0 flex-col" @click="handleParentClick">
    <div class="flex shrink-0 justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center mr-9 space-x-2 pr-5">
        <button type="button" @click="confirmButton" class="button save w-auto">
          발주 승인
        </button>
        <button @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <button @click="excelButton" class="button save w-auto excel">
          엑셀
        </button>
      </div>
    </div>

    <div
      class="pur134-search-panel z-10 mt-3 w-full min-h-0 shrink-0 rounded-lg bg-gray-200"
      :style="{
        '--pur134-control-border': pur134ControlBorder,
        '--pur134-label-col': pur134LabelCol,
        '--pur134-col-gap': pur134ColGap,
        '--pur134-row-gap': pur134RowGap,
        '--pur134-combo-max-w': `${pur134ComboMaxRem}rem`,
        '--pur134-store-group-w': '5.75rem',
        '--pur134-store-type-w': '4.5rem',
      }">
      <div class="pur134-search-grid min-w-0">
        <div class="pur134-sg-label">발주일자</div>
        <div class="pur134-cell-field pur134-date-field min-w-0">
          <input
            ref="pur134OrderDateRef"
            type="date"
            class="pur134-sg-input pur134-sg-input--date"
            v-model="pur134OrderDate"
            @change="onPur134DateChange" />
        </div>
        <div class="pur134-sg-label">매장선택</div>
        <div class="pur134-cell-field pur134-pick-slot pur134-pick-slot--store-grid min-w-0">
          <PickStore
            compact-search-bar
            :compact-store-combo-max-rem="18"
            main-name=""
            @update:storeGroup="lngStoreGroup"
            :defaultStoreNm="'전체'"
            :hideAttr="false"
            :hideGroup="false"
            :defaultStore="true"
            @storeNm="excelStore"
            :defaultStoreType2="true"
            @update:storeCd="lngStoreCode" />
        </div>
        <div class="pur134-sg-label">거래처</div>
        <div class="pur134-cell-field pur134-bc-slot min-w-0">
          <BusinessClient2
            compact-search-bar
            :default-nm="'전체'"
            @SupplierId="SupplierId" />
        </div>
      </div>
    </div>

    <div class="mt-2 flex min-h-0 min-w-0 flex-1 flex-col">
      <div class="pur134-notice shrink-0 text-sm text-indigo-600">
        <div class="pur134-notice-item">
          <img
            src="@/assets/images/ic-info.svg"
            alt=""
            class="pur134-notice-icon"
            aria-hidden="true" />
          <span>전표번호를 더블클릭하시면 상세 주문내역 확인이 가능합니다.</span>
        </div>
        <div class="pur134-notice-item">
          <img
            src="@/assets/images/ic-info.svg"
            alt=""
            class="pur134-notice-icon"
            aria-hidden="true" />
          <span>
            발주승인은 16시 마감이며, 발주승인 되지 않은 주문내역은 16시 이후에
            삭제 됩니다.(당일 발주일자 기준)
          </span>
        </div>
      </div>
      <Realgrid
        class="pur134-grid-body min-h-0 w-full flex-1"
        :progname="'PUR01_034INS_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :setStateBar="false"
        :documentTitle="'PUR01_034INS'"
        @clickedButtonCol="clickedButtonCol"
        @clickedRowData="clickedRowData"
        @dblclickedRowData="dblclickedRowData"
        @updatedRowData="updatedRowData"
        :checkRenderEditable="true"
        :checkRowAuto="false"
        :checkRowAuto2="true"
        :checkRowAuto2Col="'Selected'"
        :checkAbleExpressionCol="'Selected'"
        :checkAbleExpressionCol2="'blnConfm'"
        :checkAbleExpressionVal="'1'"
        :checkAbleExpressionCol3="'blnConfm'"
        :checkAbleExpressionVal2="'0'"
        :documentSubTitle="documentSubTitle"
        :rowStateeditable="false"
        :exporttoExcel="exportExcel" />
    </div>
  </div>

  <Teleport to="body">
    <div
      v-if="openPopUp"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-2 sm:p-3"
      @click.self="openPopUp = false">
      <div
        class="flex h-[min(70dvh,640px)] max-h-[min(calc(100dvh-16px),680px)] w-[min(92vw,56rem)] min-h-0 flex-col overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-slate-900/10"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pur134-pop-title"
        @click.stop>
        <div class="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3">
          <h2 id="pur134-pop-title" class="text-lg font-bold text-slate-900">
            상세 주문내역
          </h2>
          <div class="flex gap-2">
            <button type="button" class="whitebutton" @click="reFreshButton">
              새로고침
            </button>
            <button type="button" class="whitebutton" @click="openPopUp = false">
              닫기
            </button>
          </div>
        </div>

        <div class="shrink-0 border-b border-slate-200 bg-slate-50 px-4 py-3">
          <div class="pur134-pop-grid min-w-0">
            <div class="pur134-pop-label">매장</div>
            <div class="pur134-pop-field">
              <input type="text" class="pur134-pop-input" v-model="scond" disabled />
            </div>
            <div class="pur134-pop-label">전표번호</div>
            <div class="pur134-pop-field">
              <input type="text" class="pur134-pop-input" v-model="scond2" disabled />
            </div>
            <div class="pur134-pop-label">발주일자</div>
            <div class="pur134-pop-field">
              <input type="text" class="pur134-pop-input" v-model="scond3" disabled />
            </div>
            <div class="pur134-pop-label">승인여부</div>
            <div class="pur134-pop-field">
              <input
                type="text"
                class="pur134-pop-input pur134-pop-input--danger"
                v-model="scond4"
                disabled />
            </div>
            <div class="pur134-pop-label">배송일자</div>
            <div class="pur134-pop-field">
              <input type="text" class="pur134-pop-input" v-model="scond5" disabled />
            </div>
            <div class="pur134-pop-label">거래처</div>
            <div class="pur134-pop-field">
              <input type="text" class="pur134-pop-input" v-model="scond6" disabled />
            </div>
            <div class="pur134-pop-label">코멘트(발주)</div>
            <div class="pur134-pop-field pur134-pop-field--span3">
              <input type="text" class="pur134-pop-input" v-model="scond7" disabled />
            </div>
          </div>
        </div>

        <div class="min-h-0 flex-1 p-3">
          <Realgrid
            class="h-full min-h-0 w-full"
            :progname="'PUR01_034INS_VUE'"
            :progid="2"
            :documentTitle="'PUR01_034INS'"
            :setStateBar="false"
            :exporttoExcel="exportExcel2"
            @updatedRowData="updatedRowData2"
            :rowStateeditable="false"
            :documentSubTitle="documentSubTitle2"
            :rowData="rowData2" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { getCommonList } from "@/api/common";
import {
  confirmOrderList,
  getOrderConfirmDetail,
  getOrderConfirmList,
} from "@/api/mipur";
import BusinessClient2 from "@/components/businessClient2.vue";
import PageName from "@/components/pageName.vue";
import PickStore from "@/components/pickStore.vue";
import Realgrid from "@/components/realgrid.vue";
import { insertPageLog } from "@/customFunc/customFunc";
import Swal from "sweetalert2";
import { onMounted, ref } from "vue";
import { useStore } from "vuex";

const pur134ControlBorder = "#cbd5e1";
const pur134LabelCol = "5.75rem";
const pur134ColGap = "1.25rem";
const pur134RowGap = "0";
const pur134ComboMaxRem = 18;
const PUR134_APPROVE_DEADLINE_HOUR = 16;

const parsePur134ServerDateTime = (raw) => {
  if (raw == null || raw === "") return null;
  if (raw instanceof Date) {
    return isNaN(raw.getTime()) ? null : raw;
  }
  const text = String(raw).trim();
  if (!text) return null;

  // HTTP Date / ISO — digit-only 파싱보다 먼저 처리 (RFC 문자열 오파싱 방지)
  if (/[a-zA-Z]/.test(text) || text.includes("T")) {
    const parsed = new Date(text);
    if (!isNaN(parsed.getTime())) return parsed;
  }

  const digits = text.replace(/\D/g, "");
  if (digits.length >= 14) {
    const dt = new Date(
      Number(digits.slice(0, 4)),
      Number(digits.slice(4, 6)) - 1,
      Number(digits.slice(6, 8)),
      Number(digits.slice(8, 10)),
      Number(digits.slice(10, 12)),
      Number(digits.slice(12, 14))
    );
    return isNaN(dt.getTime()) ? null : dt;
  }
  if (digits.length >= 8) {
    const dt = new Date(
      Number(digits.slice(0, 4)),
      Number(digits.slice(4, 6)) - 1,
      Number(digits.slice(6, 8)),
      0,
      0,
      0
    );
    return isNaN(dt.getTime()) ? null : dt;
  }
  const parsed = new Date(text);
  return isNaN(parsed.getTime()) ? null : parsed;
};

const fetchPur134ServerNow = async () => {
  try {
    const res = await getCommonList(27);
    const headerDate = parsePur134ServerDateTime(res.headers?.date);
    if (headerDate) return headerDate;
  } catch (_) {}

  return new Date();
};

const getPur134ApprovalDeadline = (orderDateYmd) => {
  if (!orderDateYmd) return null;
  const hour = String(PUR134_APPROVE_DEADLINE_HOUR).padStart(2, "0");
  const deadline = new Date(`${orderDateYmd}T${hour}:00:00+09:00`);
  return isNaN(deadline.getTime()) ? null : deadline;
};

const isPur134ApprovalClosed = (serverNow, orderDateYmd) => {
  const deadline = getPur134ApprovalDeadline(orderDateYmd);
  if (!deadline || !serverNow) return false;
  return serverNow.getTime() >= deadline.getTime();
};

const showPur134ApprovalClosedAlert = () =>
  Swal.fire({
    title: "안내",
    text: "발주승인 시간이 마감 되었습니다.",
    icon: "warning",
    confirmButtonText: "확인",
  });

const ensurePur134ApprovalAllowed = async (orderDateYmd) => {
  const serverNow = await fetchPur134ServerNow();
  return !isPur134ApprovalClosed(serverNow, orderDateYmd);
};

const normalizePur134OrderDateYmd = (value) => {
  if (value == null || value === "") return "";
  const text = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;
  const digits = text.replace(/\D/g, "");
  if (digits.length >= 8) {
    return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
  }
  return text;
};

const store = useStore();
const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);
const optionList = ref([]);
const pur134OrderDateRef = ref(null);
const pur134OrderDate = ref("");
const sDate = ref("");
const selectedDate = ref("");

const formatPur134Date = (date) => date.toISOString().split("T")[0];

const initPur134OrderDate = () => {
  const today = formatPur134Date(new Date());
  pur134OrderDate.value = today;
  sDate.value = today.replaceAll("-", "");
  selectedDate.value = "발주일자: " + today;
};

onMounted(async () => {
  await insertPageLog(store.state.activeTab2);
  initPur134OrderDate();

  const res = await getCommonList(27);
  optionList.value = res.data.List.filter((item) => item.strDCode !== "01");
});

const cond = ref("02");
const cond2 = ref(0);
const cond3 = ref(0);
const cond4 = ref("");
const cond5 = ref(0);

const handleParentClick = () => {};

const onPur134DateChange = (event) => {
  initGrid();
  const value = event.target?.value ?? pur134OrderDate.value;
  if (!value) return;
  pur134OrderDate.value = value;
  sDate.value = value.replaceAll("-", "");
  selectedDate.value = "발주일자: " + value;
};

const storeCode = ref();
const lngStoreCode = (e) => {
  initGrid();
  storeCode.value = e;
};

const groupCd = ref();
const lngStoreGroup = (e) => {
  groupCd.value = e;
};

const supplierid = ref(0);
const SupplierId = (e) => {
  supplierid.value = e === "" || e == null ? 0 : e;
};
/**
 *  조회 함수
 */
const hideColumnsId = ref([]);
const searchButton = async (manageLoading = true) => {
  try {
    if (manageLoading) store.state.loading = true;
    initGrid();
    const res = await getOrderConfirmList(
      groupCd.value,
      storeCode.value,
      supplierid.value,
      sDate.value
    );

    rowData.value = res.data.List;
    console.log(res);
    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    //comsole.log(error);
  } finally {
    if (manageLoading) store.state.loading = false;
  }
};

/**
 * 페이지 매장 코드 세팅
 */

/**
 * 그리드 초기화
 */

const progid = ref(1);
const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }

  if (cond5.value == 0) {
    progid.value = 1;
  } else if (cond5.value == 1) {
    progid.value = 2;
  } else if (cond5.value == 2) {
    progid.value = 3;
  } else if (cond5.value == 3) {
    progid.value = 4;
  }

  reload.value = !reload.value;
};

//엑셀 버튼 처리 함수
const exportExcel = ref(false);
const exportExcel2 = ref(false);
const documentSubTitle2 = ref("");
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

const openPopUp = ref(false);

const tempColID = ref("");
const clickedButtonCol = (e) => {
  tempColID.value = e;
};

const scond = ref("");
const scond2 = ref("");
const scond3 = ref("");
const scond4 = ref("");
const scond5 = ref("");
const scond6 = ref("");
const scond7 = ref("");
const rowData2 = ref([]);

const tempStoreCd = ref("");
const tempSupplier = ref("");
const tempOrderNo = ref("");
const tempOrderDate = ref("");
const tempOrderEDate = ref("");
const dblclickedRowData = async (e) => {
  // console.log(e);
  scond.value = e[2];
  scond2.value = e[4];
  scond3.value = e[5];
  scond4.value = e[14] == "0" ? "미승인" : "승인";
  scond5.value = e[6];
  scond6.value = e[3];
  scond7.value = e[11];
  if (tempColID.value == "strOrderNo") {
    openPopUp.value = true;
    try {
      tempStoreCd.value = e[13];
      tempSupplier.value = e[12];
      tempOrderNo.value = e[4];
      tempOrderDate.value = e[5].replaceAll("-", "");
      tempOrderEDate.value = e[6].replaceAll("-", "");
      const res = await getOrderConfirmDetail(
        store.state.userData.lngStoreGroup,
        e[13],
        e[12],
        e[4],
        e[5].replaceAll("-", ""),
        e[6].replaceAll("-", "")
      );

      //console.log(res);

      rowData2.value = res.data.List;
    } catch (error) {
      // console.log(error);
    }
  }
};

const reFreshButton = async () => {
  try {
    store.state.loading = true;
    const res = await getOrderConfirmDetail(
      store.state.userData.lngStoreGroup,
      tempStoreCd.value,
      tempSupplier.value,
      tempOrderNo.value,
      tempOrderDate.value,
      tempOrderEDate.value
    );

    //console.log(res);
    store.state.loading = false;
    rowData2.value = res.data.List;
  } catch (error) {}
};

const confirmButton = async () => {
  store.state.loading = true;
  let refreshAfterConfirm = false;
  try {
    if (!(await ensurePur134ApprovalAllowed(pur134OrderDate.value))) {
      store.state.loading = false;
      await showPur134ApprovalClosedAlert();
      return;
    }

    const filtered = updatedrowdata.value
      .filter((item) => item.blnConfm == "0")
      .filter((item) => item.Selected == true);

    if (filtered.length == 0) {
      store.state.loading = false;
      await Swal.fire({
        title: "경고",
        text: "승인할 항목이 없습니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }

    const storecds = filtered.map((item) => item.lngStoreCode).join("\u200b");
    const suppliers = filtered.map((item) => item.lngSupplierID).join("\u200b");
    const ordernos = filtered.map((item) => item.strOrderNo).join("\u200b");
    const orderdates = filtered
      .map((item) => item.dtmOrderDate.replaceAll("-", ""))
      .join("\u200b");

    const res = await confirmOrderList(
      store.state.userData.lngStoreGroup,
      storecds,
      suppliers,
      ordernos,
      orderdates,
      store.state.userData.lngSequence,
      1
    );

    store.state.loading = false;

    if (res.data.RESULT_CD == "00") {
      refreshAfterConfirm = true;
      await Swal.fire({
        title: "성공",
        text: "발주확정이 승인 되었습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
      openPopUp.value = false;
    } else {
      await Swal.fire({
        title: "경고",
        text: "발주확정 승인을 실패하였습니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
    }
  } catch (error) {
    store.state.loading = false;
  } finally {
    if (refreshAfterConfirm) {
      store.state.loading = true;
      try {
        await searchButton(false);
      } finally {
        store.state.loading = false;
      }
    } else if (store.state.loading) {
      store.state.loading = false;
    }
  }
};

const updatedrowdata = ref([]);
const updatedRowData = (e) => {
  updatedrowdata.value = e;
};

const updatedRowData2 = () => {};

const clickedRowData = async (e) => {
  // console.log(e);
  if (tempColID.value == "Canceled" && e[1] == "승인취소") {
    const orderDateYmd = normalizePur134OrderDateYmd(e[5]);
    store.state.loading = true;
    let refreshAfterCancel = false;
    try {
      if (!(await ensurePur134ApprovalAllowed(orderDateYmd))) {
        store.state.loading = false;
        await showPur134ApprovalClosedAlert();
        return;
      }
      store.state.loading = false;

      const result = await Swal.fire({
        title: "알림",
        text: "선택한 전표를 승인취소 하시겠습니까?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "확인",
        cancelButtonText: "취소",
      });

      if (!result.isConfirmed) return;

      store.state.loading = true;
      const res = await confirmOrderList(
        store.state.userData.lngStoreGroup,
        e[13],
        e[12],
        e[4],
        e[5],
        store.state.userData.lngSequence,
        0
      );

      store.state.loading = false;

      if (res.data.RESULT_CD == "00") {
        refreshAfterCancel = true;
        await Swal.fire({
          title: "성공",
          text: "발주확정이 취소 되었습니다.",
          icon: "success",
          confirmButtonText: "확인",
        });
        openPopUp.value = false;
      } else {
        await Swal.fire({
          title: "경고",
          text: "발주확정 취소에 실패하였습니다.",
          icon: "warning",
          confirmButtonText: "확인",
        });
      }
    } catch (error) {
      store.state.loading = false;
    } finally {
      if (refreshAfterCancel) {
        store.state.loading = true;
        try {
          await searchButton(false);
        } finally {
          store.state.loading = false;
        }
      } else if (store.state.loading) {
        store.state.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.pur134-search-panel {
  --pur134-panel-pad-x: 2rem;
  --pur134-row-min-h: 2rem;
  --pur134-control-h: 2rem;
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  padding-left: 0;
  padding-right: 0;
  padding-block: 0.75rem;
  overflow: hidden;
}

@media (min-width: 640px) {
  .pur134-search-panel {
    --pur134-panel-pad-x: 2.5rem;
  }
}

@media (min-width: 768px) {
  .pur134-search-panel {
    --pur134-panel-pad-x: 3rem;
  }
}

@media (min-width: 1024px) {
  .pur134-search-panel {
    --pur134-panel-pad-x: 3.5rem;
  }
}

.pur134-search-grid {
  display: grid;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  padding-left: var(--pur134-panel-pad-x);
  padding-right: var(--pur134-panel-pad-x);
  grid-template-columns:
    var(--pur134-label-col) minmax(0, 1fr)
    var(--pur134-label-col) minmax(0, 1fr)
    var(--pur134-label-col) minmax(0, 1fr);
  column-gap: var(--pur134-col-gap);
  row-gap: var(--pur134-row-gap);
  align-items: center;
  min-height: var(--pur134-row-min-h);
}

.pur134-sg-label,
.pur134-cell-field {
  min-height: var(--pur134-row-min-h);
  min-width: 0;
}

.pur134-sg-label {
  box-sizing: border-box;
  width: var(--pur134-label-col);
  min-width: var(--pur134-label-col);
  max-width: var(--pur134-label-col);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pur134-cell-field {
  display: flex;
  align-items: center;
  width: 100%;
}

.pur134-cell-field > * {
  min-width: 0;
  width: 100%;
}

.pur134-pick-slot > *,
.pur134-bc-slot > * {
  width: max-content;
  max-width: 100%;
}

.pur134-date-field > * {
  width: auto;
  flex: 0 1 auto;
}

.pur134-sg-input {
  box-sizing: border-box;
  height: var(--pur134-control-h);
  min-height: var(--pur134-control-h);
  max-height: var(--pur134-control-h);
  width: 100%;
  min-width: 0;
  padding: 0 0.5rem;
  font-size: 0.875rem;
  color: rgb(55 65 81);
  background: #fff;
  border: 1px solid var(--pur134-control-border);
  border-radius: 0.375rem;
}

.pur134-sg-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.2);
}

.pur134-sg-input--date {
  flex: 0 1 9rem;
  width: 9rem;
  max-width: 100%;
  min-width: 0;
}

.pur134-search-panel .pur134-pick-slot :deep(select),
.pur134-search-panel .pur134-pick-slot :deep(.pickstore-vs-shell),
.pur134-search-panel .pur134-bc-slot :deep(.pickstore-vs-shell) {
  box-sizing: border-box !important;
  height: var(--pur134-control-h) !important;
  min-height: var(--pur134-control-h) !important;
  max-height: var(--pur134-control-h) !important;
  border: 1px solid var(--pur134-control-border) !important;
  border-radius: 0.375rem !important;
  font-size: 0.875rem !important;
  line-height: 1.25rem !important;
  background: #fff !important;
  overflow: hidden !important;
}

.pur134-search-panel .pur134-pick-slot :deep(select) {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important;
  margin-left: 0 !important;
  padding: 0 0.375rem !important;
  line-height: var(--pur134-control-h) !important;
}

.pur134-search-panel .pur134-pick-slot :deep(select:focus) {
  border-color: #3b82f6 !important;
}

.pur134-search-panel .pur134-pick-slot :deep(.pickstore-vs-shell) {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important;
}

.pur134-search-panel .pur134-bc-slot :deep(.pickstore-vs-shell) {
  width: var(--pur134-combo-max-w) !important;
  max-width: var(--pur134-combo-max-w) !important;
  min-width: 0 !important;
  flex: 0 0 auto !important;
}

.pur134-pick-slot--store-grid :deep(> div.flex.text-base) {
  display: grid !important;
  grid-template-columns:
    var(--pur134-store-group-w)
    var(--pur134-store-type-w)
    var(--pur134-combo-max-w) !important;
  width: max-content !important;
  max-width: 100% !important;
  min-width: 0 !important;
  flex-wrap: unset !important;
  align-items: center !important;
  gap: var(--pur134-col-gap) !important;
}

.pur134-pick-slot--store-grid :deep(> div.flex.text-base > div) {
  min-width: 0 !important;
  width: 100% !important;
  max-width: 100% !important;
}

.pur134-pick-slot--store-grid :deep(> div.flex.text-base > div.relative.min-w-0) {
  flex: unset !important;
  width: var(--pur134-combo-max-w) !important;
  max-width: var(--pur134-combo-max-w) !important;
  height: var(--pur134-control-h) !important;
  min-height: var(--pur134-control-h) !important;
  max-height: var(--pur134-control-h) !important;
}

.pur134-pick-slot :deep(.pickstore-vs-shell .style-chooser),
.pur134-bc-slot :deep(.pickstore-vs-shell .style-chooser) {
  height: 100% !important;
  min-height: 0 !important;
  max-height: 100% !important;
}

.pur134-pick-slot :deep(.pickstore-vs-shell .style-chooser .vs__dropdown-toggle),
.pur134-bc-slot :deep(.pickstore-vs-shell .style-chooser .vs__dropdown-toggle) {
  height: 100% !important;
  min-height: 0 !important;
  max-height: 100% !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  display: flex !important;
  align-items: center !important;
  border: 0 !important;
  box-shadow: none !important;
}

.pur134-pick-slot :deep(.pickstore-vs-shell .vs__selected-options),
.pur134-bc-slot :deep(.pickstore-vs-shell .vs__selected-options) {
  flex: 1 1 auto;
  min-width: 0;
  min-height: 0 !important;
  padding: 0 0 0 0.375rem !important;
  align-items: center !important;
}

.pur134-pick-slot :deep(.pickstore-vs-shell .vs__selected),
.pur134-bc-slot :deep(.pickstore-vs-shell .vs__selected) {
  font-size: 0.875rem !important;
  line-height: 1.25rem !important;
}

.pur134-pick-slot :deep(.pickstore-vs-shell .vs__actions),
.pur134-bc-slot :deep(.pickstore-vs-shell .vs__actions) {
  align-items: center !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

.pur134-bc-slot :deep(> div.flex.text-base) {
  margin: 0 !important;
  width: max-content !important;
  max-width: 100% !important;
  min-width: 0 !important;
  min-height: var(--pur134-control-h) !important;
  align-items: center !important;
  gap: 0 !important;
}

.pur134-bc-slot :deep(> div.flex.text-base > .pickstore-vs-shell) {
  width: var(--pur134-combo-max-w) !important;
  max-width: var(--pur134-combo-max-w) !important;
  min-width: 0 !important;
  flex: 0 0 auto !important;
}

.pur134-search-panel .pur134-bc-slot :deep(.pickstore-vs-shell:focus-within) {
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.2);
}

.pur134-search-panel .pur134-pick-slot :deep(> div.flex.text-base) {
  min-width: 0;
  margin: 0 !important;
  min-height: var(--pur134-control-h) !important;
  align-items: center !important;
}

.pur134-search-panel .pur134-pick-slot :deep(> div.flex.text-base > div:first-child) {
  display: none;
}

.pur134-search-panel .pur134-pick-slot :deep(> div.flex.text-base > *) {
  min-width: 0;
}

.pur134-notice {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  margin-bottom: 0.375rem;
}

.pur134-notice-item {
  display: flex;
  align-items: flex-start;
  min-width: 0;
}

.pur134-notice-icon {
  flex-shrink: 0;
  width: 1rem;
  height: 1rem;
  margin-top: 0.125rem;
  margin-right: 0.25rem;
}

.pur134-grid-body {
  min-height: 12rem;
}

.pur134-pop-grid {
  display: grid;
  grid-template-columns: 5.5rem minmax(0, 1fr) 5.5rem minmax(0, 1fr);
  gap: 0.5rem 0.75rem;
  align-items: center;
}

.pur134-pop-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: rgb(51 65 85);
  text-align: center;
}

.pur134-pop-field {
  min-width: 0;
}

.pur134-pop-field--span3 {
  grid-column: span 3;
}

.pur134-pop-input {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  height: 2rem;
  padding: 0 0.5rem;
  font-size: 0.875rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  background: rgb(241 245 249);
  color: rgb(51 65 85);
}

.pur134-pop-input--danger {
  color: rgb(220 38 38);
  font-weight: 600;
}
</style>
