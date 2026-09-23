<!-- /*--############################################################################
# Filename : STK01_011INS_01.vue
# Description : 모바일 > 자재관리 > 청구 등록
# Date :2026-09-18
################################################################################*/ -->
<template>
  <div class="h-full w-full bg-slate-50" @click="resetScreen">
    <div class="h-[16vh] w-full shrink-0"></div>

    <div
      class="relative z-0 mx-3 mb-2 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
      <div class="text-sm font-bold text-slate-800">
        청구
        <span class="text-sky-600">{{ rowData.length.toLocaleString() }}</span>건
      </div>
      <div class="flex gap-2">
        <button
          type="button"
          class="stk-list-btn stk-list-btn-new"
          :disabled="!canAddDemand"
          @click="addButton">
          신규
        </button>
        <button type="button" class="stk-list-btn stk-list-btn-del" @click="deleteButton">
          삭제
        </button>
      </div>
    </div>

    <div
      v-if="rowData.length == 0"
      class="mx-3 mt-2 rounded-2xl border border-dashed border-slate-300 bg-white py-14 text-center text-sm text-slate-400">
      조회된 청구가 없습니다.
    </div>

    <div class="relative z-0 px-3 space-y-2">
      <div
        v-for="(i, index) in rowData"
        :key="i.strDemandNo + '-' + index"
        class="rounded-2xl border bg-white p-3 shadow-sm active:scale-[0.99] transition"
        :class="isUnissuedDemand(i) ? 'border-amber-200' : 'border-slate-200'"
        @click="openDetail(i)">
        <div class="flex items-start gap-3">
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2">
              <span class="text-sm font-bold text-slate-800 truncate">
                {{ i.strDemandNo }}
              </span>
              <span
                class="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold"
                :class="statusBadgeClass(i)">
                {{ i.strStatus || i.lngStatus }}
              </span>
            </div>
            <div class="mt-1 text-xs text-slate-500">
              {{ i.strStoreName || storeNameOf(i.lngStoreCode) }}
              <span class="mx-1 text-slate-300">·</span>
              {{ displayDate(i.dtmDemandDate) }}
            </div>
            <div class="mt-2 grid grid-cols-3 gap-1 rounded-xl bg-slate-50 px-2 py-2 text-[11px]">
              <div>
                <div class="text-slate-400">공급가</div>
                <div class="mt-0.5 text-right font-semibold text-slate-800">
                  {{ formatAmt(i.curSupply) }}
                </div>
              </div>
              <div>
                <div class="text-slate-400">부가세</div>
                <div class="mt-0.5 text-right font-semibold text-slate-800">
                  {{ formatAmt(i.curTax) }}
                </div>
              </div>
              <div>
                <div class="text-slate-400">합계</div>
                <div class="mt-0.5 text-right font-semibold text-sky-700">
                  {{ formatAmt(i.curTotal ?? toNumber(i.curSupply) + toNumber(i.curTax)) }}
                </div>
              </div>
            </div>
            <div class="mt-1.5 flex flex-wrap gap-x-3 text-[11px] text-slate-400">
              <span v-if="datetimeOf(i, 'addedDate', 'AddedDate', 'dtmAddedDate')">
                입력 {{ datetimeOf(i, "addedDate", "AddedDate", "dtmAddedDate") }}
              </span>
              <span v-if="datetimeOf(i, 'updatedDate', 'UpdatedDate', 'dtmUpdatedDate')">
                수정 {{ datetimeOf(i, "updatedDate", "UpdatedDate", "dtmUpdatedDate") }}
              </span>
            </div>
          </div>
          <label class="pt-1" @click.stop>
            <input
              type="checkbox"
              class="h-4 w-4 accent-sky-600"
              v-model="i.Selected"
              :disabled="!isUnissuedDemand(i)"
              true-value="true"
              false-value="false" />
          </label>
        </div>
      </div>
    </div>
    <div class="!h-[20vh] w-full"></div>
  </div>

  <MobileDateStore
    @click.stop
    class="z-[10]"
    :changeState="changeState"
    @currState="currState"
    @SEARCHNOW="SEARCHNOW"
    @startDate="startDate"
    @endDate="endDate"
    @GROUP_CD="GROUP_CD"
    @STORE_CD="STORE_CD"
    @STORE_NM="STORE_NM"
    select-store-label="선택"></MobileDateStore>

  <div class="fixed inset-0 z-[70] flex flex-col bg-slate-50" v-if="open">
    <div class="flex h-full w-full flex-col overflow-hidden bg-slate-50">
      <div class="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200">
        <div>
          <h2 class="text-lg font-bold text-slate-800">청구 등록</h2>
          <p class="text-[11px] text-slate-500">
            입력 {{ enteredCount.toLocaleString() }}건
            <span v-if="!canEditDemand"> · 수정 불가</span>
          </p>
        </div>
        <div class="flex gap-2">
          <button
            type="button"
            class="stk-list-btn stk-list-btn-save"
            :disabled="!canEditDemand"
            @click="saveButton">
            저장
          </button>
          <button
            type="button"
            class="stk-list-btn stk-list-btn-close"
            @click="open = false">
            닫기
          </button>
        </div>
      </div>

      <div class="mx-3 mb-2 rounded-2xl bg-white p-3 shadow-sm border border-slate-200">
        <div class="grid grid-cols-2 gap-2 text-xs">
          <label class="block">
            <span class="mb-1 block text-slate-500">청구일자</span>
            <input
              type="date"
              class="stk-field"
              v-model="scond"
              :disabled="disabled"
              @change="searchButton2" />
          </label>
          <label class="block">
            <span class="mb-1 block text-slate-500">청구번호</span>
            <input type="text" class="stk-field bg-slate-100" v-model="scond3" disabled />
          </label>
          <label class="col-span-2 block">
            <span class="mb-1 block text-slate-500">청구매장</span>
            <select class="stk-field bg-slate-100" disabled v-model="scond2">
              <option
                v-for="i in optionList"
                :key="'p-' + i.lngStoreCode"
                :value="i.lngStoreCode">
                {{ i.strName }}
              </option>
            </select>
          </label>
        </div>
      </div>

      <div class="stk-item-head">
        <div class="stk-tabs">
          <button
            type="button"
            class="stk-tab"
            :class="{ 'is-on': itemTab === 'all' }"
            @click="itemTab = 'all'">
            전체
          </button>
          <button
            type="button"
            class="stk-tab"
            :class="{ 'is-on': itemTab === 'entered' }"
            @click="itemTab = 'entered'">
            청구 품목
          </button>
        </div>
        <div class="stk-item-count">{{ visibleItems.length.toLocaleString() }}</div>
      </div>

      <label class="stk-search">
        <span class="stk-search-inner">
          <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
          <input
            v-model="itemKeyword"
            type="search"
            placeholder="품목 검색"
            enterkeyhint="search" />
        </span>
      </label>

      <div class="flex-1 min-h-0 overflow-y-auto bg-white">
        <div
          v-if="visibleItems.length === 0"
          class="py-14 text-center text-sm text-slate-400">
          검색된 품목이 없습니다.
        </div>
        <div
          v-for="(item, idx) in visibleItems"
          :key="item.lngStockID + '-' + idx"
          class="stk-item"
          :class="{ 'is-on': toInt(item.dblDemandQty) > 0 }">
          <div class="stk-item-left">
            <input
              type="checkbox"
              class="stk-check"
              :checked="toInt(item.dblDemandQty) > 0"
              :disabled="!canEditDemand"
              @change="onItemCheck(item, $event)" />
            <div class="min-w-0">
              <div class="stk-code">{{ stockCodeOf(item) }}</div>
              <div class="stk-name">{{ stockNameOf(item) }}</div>
              <div v-if="packOf(item)" class="stk-meta">{{ packOf(item) }}</div>
              <div v-if="unitOf(item)" class="stk-unit">
                <span>단위</span>
                <strong>{{ unitOf(item) }}</strong>
              </div>
              <div v-if="specOf(item)" class="stk-meta">규격 {{ specOf(item) }}</div>
              <div v-if="traitOf(item)" class="stk-meta">특성 {{ traitOf(item) }}</div>
            </div>
          </div>
          <div class="stk-item-right">
            <div class="stk-price-row">
              <span>단가</span>
              <strong>{{ formatAmt(unitPriceOf(item)) }}원</strong>
            </div>
            <div class="stk-price-row">
              <span>수량</span>
              <div class="stk-stepper">
                <button
                  type="button"
                  :disabled="!canEditDemand"
                  @click="stepQty(item, -1)">
                  −
                </button>
                <input
                  type="text"
                  inputmode="numeric"
                  :value="toInt(item.dblDemandQty)"
                  :disabled="!canEditDemand"
                  @input="onDemandQtyInput(item, $event)" />
                <button
                  type="button"
                  :disabled="!canEditDemand"
                  @click="stepQty(item, 1)">
                  +
                </button>
              </div>
            </div>
            <div class="stk-price-row is-sum">
              <span>공급가</span>
              <strong>{{ formatAmt(item.curSupply) }}원</strong>
            </div>
            <div class="stk-price-row is-sum">
              <span>부가세</span>
              <strong>{{ formatAmt(item.curTax) }}원</strong>
            </div>
          </div>
        </div>
      </div>

      <div class="border-t bg-white p-3">
        <div class="mb-1 text-xs font-semibold text-slate-500">코멘트</div>
        <textarea
          v-model="scond4"
          class="w-full h-16 rounded-xl border border-slate-200 p-2 text-sm"
          :disabled="!canEditDemand"
          placeholder="메모를 입력하세요"></textarea>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  deleteDemandMaster2,
  getDemandStoreList2,
  getStockDemandList22,
  getStockDetail22,
  InsertDemandMasterDetail2,
  UpdateDemandMasterDetail2,
} from "@/api/vuepos";
import { formatLocalDate } from "@/customFunc/customFunc";
import Swal from "sweetalert2";
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import MobileDateStore from "../component/mobileDateStore.vue";

const store = useStore();
const changeState = ref(true);
const resetScreen = async () => {
  changeState.value = false;
  store.state.inActiveBackGround = false;
};

const currState = (e) => {
  changeState.value = e;
};

const selectStartDate = ref(formatLocalDate(new Date()));
const selectEndDate = ref(formatLocalDate(new Date()));
const selectGroupCd = ref("");
const selectStoreCd = ref("0");
const selectStoreName = ref("선택");
const startDate = (e) => {
  selectStartDate.value = e;
};
const endDate = (e) => {
  selectEndDate.value = e;
};
const GROUP_CD = (e) => {
  selectGroupCd.value = e;
};
const STORE_CD = (e) => {
  selectStoreCd.value = e;
};
const STORE_NM = (e) => {
  selectStoreName.value = e;
};

const isAllStoreSelected = () => {
  const name = String(selectStoreName.value ?? "").replace(/\s/g, "");
  const code = String(selectStoreCd.value ?? "").trim();
  if (!name || name === "선택" || name === "전체") return true;
  return code !== "" && Number(code) === 0;
};

const canAddDemand = computed(() => !isAllStoreSelected());

const optionList = ref([]);
const rowData = ref([]);
const rowData2 = ref([]);
const open = ref(false);
const disabled = ref(false);
const canEditDemand = ref(false);
const scond = ref("");
const scond2 = ref("");
const scond3 = ref("");
const scond4 = ref("");
const itemKeyword = ref("");
const itemTab = ref("all");

const lngStoreGroup = () =>
  selectGroupCd.value || store.state.userData.GROUP_CD;
const lngStoreCode = () =>
  selectStoreCd.value || store.state.userData.STORE_CD;
const lngOperator = () => store.state.userData.USER_NO;

const toNumber = (value) => {
  const num = Number(String(value ?? "").replace(/,/g, ""));
  return Number.isFinite(num) ? num : 0;
};

const toInt = (value) => Math.trunc(toNumber(value));

const formatAmt = (value) => toNumber(value).toLocaleString();

const toDateInput = (raw) => {
  if (raw == null || raw === "") return "";
  if (raw instanceof Date && !Number.isNaN(raw.getTime())) {
    return formatLocalDate(raw);
  }
  const text = String(raw).trim();
  const msMatch = text.match(/\/Date\((-?\d+)(?:[+-]\d+)?\)\//);
  if (msMatch) return formatLocalDate(new Date(Number(msMatch[1])));
  if (/^\d{4}-\d{2}-\d{2}/.test(text)) return text.slice(0, 10);
  const digits = text.replace(/\D/g, "");
  if (digits.length >= 8 && digits.length <= 14) {
    return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
  }
  const parsed = new Date(text);
  if (!Number.isNaN(parsed.getTime())) return formatLocalDate(parsed);
  return "";
};

const displayDate = (raw) => toDateInput(raw) || raw || "";

const pad2 = (value) => String(value).padStart(2, "0");

const formatDateTimeParts = (year, month, day, hour, minute) =>
  `${year}-${pad2(month)}-${pad2(day)} ${pad2(hour)}:${pad2(minute)}`;

const fromDateObject = (d) =>
  formatDateTimeParts(
    d.getFullYear(),
    d.getMonth() + 1,
    d.getDate(),
    d.getHours(),
    d.getMinutes()
  );

const displayDateTime = (raw) => {
  if (raw == null || raw === "") return "";
  if (raw instanceof Date && !Number.isNaN(raw.getTime())) {
    return fromDateObject(raw);
  }
  const text = String(raw).trim();
  const msMatch = text.match(/\/Date\((-?\d+)(?:[+-]\d+)?\)\//);
  if (msMatch) {
    const d = new Date(Number(msMatch[1]));
    if (!Number.isNaN(d.getTime())) return fromDateObject(d);
  }

  const datePart = toDateInput(text);
  if (!datePart) {
    const parsed = new Date(text.replace(/-/g, "/"));
    return Number.isNaN(parsed.getTime()) ? "" : fromDateObject(parsed);
  }

  /** 오후 4:57:09 / 16:57 / PM 4:57 — 날짜 뒤 시각만 따로 읽어 12시간제 보정 */
  const timePart = text.match(/(\d{1,2}):(\d{2})/);
  if (!timePart) return datePart;

  let hour = Number(timePart[1]);
  const minute = Number(timePart[2]);
  if (/오후|PM/i.test(text) && hour < 12) hour += 12;
  if (/오전|AM/i.test(text) && hour === 12) hour = 0;

  return `${datePart} ${pad2(hour)}:${pad2(minute)}`;
};

const datetimeOf = (row, ...keys) => {
  for (const key of keys) {
    const value = row?.[key];
    if (value != null && String(value).trim() !== "") {
      const formatted = displayDateTime(value);
      if (formatted) return formatted;
    }
  }
  return "";
};

const parseDemandDate = (raw) => toDateInput(raw);

const storeNameOf = (code) =>
  optionList.value.find(
    (item) => String(item.lngStoreCode) === String(code)
  )?.strName || "";

const textOf = (item, ...keys) => {
  for (const key of keys) {
    const value = item?.[key];
    if (value != null && String(value).trim() !== "") return String(value).trim();
  }
  return "";
};

const stockCodeOf = (item) =>
  textOf(item, "strStockCode", "lngStockID", "strItemCode");
const stockNameOf = (item) =>
  textOf(item, "strStockName", "strItemName", "strName") || stockCodeOf(item);
const unitOf = (item) => textOf(item, "strDemandUOMName");
const specOf = (item) =>
  textOf(item, "strStandardName", "strSpec", "strStandard");
const packOf = (item) =>
  textOf(item, "strPackName", "strBoxName", "strInUnitName", "strUnitQtyName");
const traitOf = (item) =>
  textOf(item, "strProperty", "strCharName", "strTraitName", "strClassName");

const visibleItems = computed(() => {
  const word = itemKeyword.value.trim().toLowerCase();
  return (rowData2.value || []).filter((item) => {
    if (itemTab.value === "entered" && toInt(item.dblDemandQty) <= 0) return false;
    if (!word) return true;
    const blob = [
      stockCodeOf(item),
      stockNameOf(item),
      unitOf(item),
      specOf(item),
      packOf(item),
      traitOf(item),
    ]
      .join(" ")
      .toLowerCase();
    return blob.includes(word);
  });
});

const resetItemFinder = () => {
  itemKeyword.value = "";
  itemTab.value = "all";
};

const stepQty = (item, delta) => {
  if (!canEditDemand.value) return;
  item.dblDemandQty = Math.max(0, toInt(item.dblDemandQty) + delta);
  recalcDemandRow(item);
};

const onItemCheck = (item, event) => {
  if (!canEditDemand.value) return;
  item.dblDemandQty = event.target.checked ? Math.max(1, toInt(item.dblDemandQty)) : 0;
  recalcDemandRow(item);
};

const expectedQtyOf = (item) =>
  toNumber(
    item?.dblExpectedQty ?? item?.dblPreQty ?? item?.dblPreExpectedQty
  );

const unitPriceOf = (item) =>
  toNumber(
    item?.curUnitPrice ?? item?.curPrice ?? item?.curCost ?? item?.curUnitCost
  );

const recalcDemandRow = (item) => {
  if (!item) return;
  const qty = toInt(item.dblDemandQty);
  item.dblDemandQty = qty;
  const unitp = unitPriceOf(item);
  const supply = Math.floor(unitp * qty);
  const taxType = String(item.lngTaxType ?? item.strTaxType ?? "01");
  item.curSupply = supply;
  item.curTax =
    taxType === "01" || taxType === "1" ? Math.floor(supply * 0.1) : 0;
};

const onDemandQtyInput = (item, event) => {
  const digits = String(event.target.value ?? "").replace(/\D/g, "");
  item.dblDemandQty = digits === "" ? 0 : parseInt(digits, 10);
  event.target.value = digits === "" ? "0" : String(item.dblDemandQty);
  recalcDemandRow(item);
};

const applyDetailList = (list) => {
  rowData2.value = (list || []).map((item) => {
    const row = { ...item };
    row.dtmPreExpectedDate = toDateInput(row.dtmPreExpectedDate);
    row.dblDemandQty = toInt(row.dblDemandQty);
    row.originDemandQty = row.dblDemandQty;
    if (unitPriceOf(row) || row.dblDemandQty) {
      recalcDemandRow(row);
    }
    return row;
  });
};

const enteredCount = computed(
  () => (rowData2.value || []).filter((item) => toInt(item.dblDemandQty) > 0).length
);

const isUnissuedDemand = (row) => {
  if (row == null) return false;
  const lng = String(row.lngStatus ?? "").trim();
  const str = String(row.strStatus ?? "").trim();
  return (
    lng === "01" ||
    lng === "1" ||
    lng.includes("미발주") ||
    str.includes("미발주")
  );
};

const statusBadgeClass = (row) =>
  isUnissuedDemand(row)
    ? "bg-amber-100 text-amber-700"
    : "bg-emerald-100 text-emerald-700";

const ensureSearchDates = (extraDate) => {
  const today = formatLocalDate(new Date());
  const extra = toDateInput(extraDate);
  if (!selectStartDate.value) selectStartDate.value = extra || today;
  if (!selectEndDate.value) selectEndDate.value = extra || today;
  if (extra) {
    if (extra < selectStartDate.value) selectStartDate.value = extra;
    if (extra > selectEndDate.value) selectEndDate.value = extra;
  }
};

const SEARCHNOW = async (extraDate) => {
  if (isAllStoreSelected()) {
    await Swal.fire({
      title: "알림",
      text: "매장을 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  ensureSearchDates(extraDate);
  try {
    store.state.loading2 = true;
    const res = await getStockDemandList22(
      lngStoreGroup(),
      lngStoreCode(),
      "01",
      String(selectStartDate.value).replaceAll("-", ""),
      String(selectEndDate.value).replaceAll("-", "")
    );
    rowData.value = (res.data.List || []).map((item) => ({
      ...item,
      Selected: false,
    }));
  } catch (error) {
  } finally {
    store.state.loading2 = false;
  }
};

const openDetail = async (e) => {
  const unissued = isUnissuedDemand(e);
  disabled.value = true;
  canEditDemand.value = unissued;
  scond.value = parseDemandDate(e.dtmDemandDate);
  scond2.value = e.lngStoreCode;
  scond3.value = e.strDemandNo;
  try {
    store.state.loading2 = true;
    const res = await getStockDetail22(
      lngStoreGroup(),
      scond2.value,
      "01",
      scond3.value,
      String(e.dtmDemandDate ?? "").replaceAll("-", "")
    );
    applyDetailList(res.data.List || []);
    scond4.value = res.data.List2?.[0]?.strComments || "";
    resetItemFinder();
    open.value = true;
  } catch (error) {
  } finally {
    store.state.loading2 = false;
  }
};

const addButton = async () => {
  if (!canAddDemand.value) return;
  disabled.value = false;
  canEditDemand.value = true;
  scond.value = formatLocalDate(new Date());
  scond2.value = lngStoreCode();
  scond3.value = "";
  scond4.value = "";
  rowData2.value = [];
  try {
    store.state.loading2 = true;
    const res = await getStockDetail22(
      lngStoreGroup(),
      lngStoreCode(),
      "01",
      "",
      formatLocalDate(new Date()).replaceAll("-", "")
    );
    applyDetailList(res.data.List || []);
    resetItemFinder();
    open.value = true;
  } catch (error) {
  } finally {
    store.state.loading2 = false;
  }
};

const searchButton2 = async (e) => {
  rowData2.value = [];
  try {
    store.state.loading2 = true;
    const res = await getStockDetail22(
      lngStoreGroup(),
      lngStoreCode(),
      "01",
      "",
      String(e.target.value).replaceAll("-", "")
    );
    applyDetailList(res.data.List || []);
    scond4.value = res.data.List2?.[0]?.strComments || "";
  } catch (error) {
  } finally {
    store.state.loading2 = false;
  }
};

const saveButton = async () => {
  if (!canEditDemand.value) {
    return;
  }
  const isExistingDemand = String(scond3.value || "").trim() !== "";
  try {
    store.state.loading2 = true;
    const saveRows = isExistingDemand
      ? (rowData2.value || []).filter(
          (item) =>
            toInt(item.dblDemandQty) > 0 || toInt(item.originDemandQty) > 0
        )
      : rowData2.value || [];
    const ddate = saveRows
      .map((item) =>
        String(item.dtmEndDate || "").split(" ")[0].replaceAll("-", "")
      )
      .join("\u200b");
    const edate = saveRows
      .map((item) =>
        String(toDateInput(item.dtmPreExpectedDate) || "").replaceAll("-", "")
      )
      .join("\u200b");
    const lngstocks = saveRows.map((item) => item.lngStockID).join("\u200b");
    const qtys = saveRows.map((item) => toInt(item.dblDemandQty)).join("\u200b");
    const demandDate = scond.value.replaceAll("-", "");
    const res = isExistingDemand
      ? await UpdateDemandMasterDetail2(
          lngStoreGroup(),
          scond2.value,
          demandDate,
          scond3.value,
          scond4.value,
          1,
          ddate,
          edate,
          lngstocks,
          qtys,
          lngOperator(),
          0,
          "",
          ""
        )
      : await InsertDemandMasterDetail2(
          lngStoreGroup(),
          scond2.value,
          demandDate,
          scond4.value,
          1,
          ddate,
          edate,
          lngstocks,
          qtys,
          lngOperator(),
          0,
          "",
          ""
        );
    if (res.data.RESULT_CD == "00") {
      await Swal.fire({
        title: "성공",
        text: isExistingDemand
          ? "청구등록이 수정 되었습니다."
          : "신규 청구등록이 저장 되었습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
    } else {
      await Swal.fire({
        title: "경고",
        text: res.data.RESULT_NM || "청구등록 저장을 실패하였습니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
    }
  } catch (error) {
    await Swal.fire({
      title: "경고",
      text: "청구등록 저장을 실패하였습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
  } finally {
    store.state.loading2 = false;
    open.value = false;
    await SEARCHNOW(scond.value);
  }
};

const deleteButton = async () => {
  const filtered = rowData.value.filter(
    (item) => item.Selected == true || item.Selected === "true"
  );
  if (filtered.length == 0) {
    Swal.fire({
      title: "경고",
      text: "삭제할 청구 사항을 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  try {
    store.state.loading2 = true;
    const storecds = filtered.map((item) => item.lngStoreCode).join("\u200b");
    const demandnos = filtered.map((item) => item.strDemandNo).join("\u200b");
    const demanddates = filtered
      .map((item) => item.dtmDemandDate)
      .join("\u200b");
    const res = await deleteDemandMaster2(
      lngStoreGroup(),
      storecds,
      demandnos,
      demanddates,
      lngOperator()
    );
    if (res.data.RESULT_CD == "00") {
      await Swal.fire({
        title: "성공",
        text: "청구 사항이 삭제 되었습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
    } else {
      await Swal.fire({
        title: "경고",
        text: "청구 사항이 삭제를 실패하였습니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
    }
  } catch (error) {
  } finally {
    store.state.loading2 = false;
    SEARCHNOW();
  }
};

onMounted(async () => {
  store.state.loading = false;
  store.state.loading2 = false;
  try {
    const res = await getDemandStoreList2(store.state.userData.GROUP_CD, 0);
    const list = res.data.List || [];
    const currentStore = list.filter(
      (item) =>
        String(item.lngStoreCode) === String(store.state.userData.STORE_CD)
    );
    optionList.value =
      currentStore.length > 0
        ? currentStore
        : list.length > 0
        ? list
        : [
            {
              lngStoreCode: store.state.userData.STORE_CD,
              strName: store.state.userData.STORE_NM,
            },
          ];
  } catch (error) {
    optionList.value = [
      {
        lngStoreCode: store.state.userData.STORE_CD,
        strName: store.state.userData.STORE_NM,
      },
    ];
  }
});
</script>

<style scoped>
.stk-field {
  width: 100%;
  height: 2.25rem;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
  padding: 0 0.75rem;
  background: #fff;
  color: #1e293b;
}

.stk-field:disabled {
  color: #64748b;
}

.stk-list-btn {
  height: 2rem;
  padding: 0 0.75rem;
  border-radius: 0.75rem;
  font-size: 0.8125rem;
  font-weight: 600;
}

.stk-list-btn-new {
  background: #5782ff;
  color: #fff;
}

.stk-list-btn-new:disabled {
  background: #cbd5e1;
  color: #fff;
}

.stk-list-btn-del {
  background: #ef4444;
  color: #fff;
}

.stk-list-btn-save {
  background: #5782ff;
  color: #fff;
}

.stk-list-btn-save:disabled {
  background: #cbd5e1;
  color: #fff;
}

.stk-list-btn-close {
  background: #fff;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.stk-item-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0 0.75rem 0.45rem;
}

.stk-tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  flex: 1;
  border: 1px solid #e2e8f0;
  border-radius: 0.65rem;
  overflow: hidden;
  background: #fff;
}

.stk-tab {
  height: 2.15rem;
  font-size: 0.82rem;
  font-weight: 700;
  color: #64748b;
  background: #fff;
}

.stk-tab.is-on {
  background: #eff4ff;
  color: #5782ff;
}

.stk-item-count {
  min-width: 1.5rem;
  text-align: right;
  font-size: 0.8rem;
  font-weight: 700;
  color: #94a3b8;
}

.stk-search {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 0.75rem 0.55rem;
  height: 2.6rem;
  padding: 0 0.85rem;
  border-radius: 0.55rem;
  background: #5782ff;
  color: #fff;
}

.stk-search-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  max-width: 100%;
}

.stk-search input {
  width: auto;
  min-width: 5.2rem;
  max-width: min(70vw, 16rem);
  field-sizing: content;
  padding: 0;
  border: 0;
  background: transparent;
  color: #fff;
  font-size: 0.95rem;
  font-weight: 700;
}

.stk-search input::placeholder {
  color: rgba(255, 255, 255, 0.92);
}

.stk-search input:focus {
  outline: none;
}

.stk-item {
  display: grid;
  grid-template-columns: 1.25fr 1fr;
  border-bottom: 1px solid #e2e8f0;
  background: #fff;
}

.stk-item.is-on {
  background: #f8fbff;
}

.stk-item-left {
  display: flex;
  gap: 0.4rem;
  min-width: 0;
  padding: 0.7rem 0.45rem 0.7rem 0.7rem;
}

.stk-check {
  margin-top: 0.15rem;
  accent-color: #5782ff;
}

.stk-code {
  font-size: 0.78rem;
  font-weight: 700;
  color: #334155;
}

.stk-name {
  margin-top: 0.1rem;
  font-size: 0.82rem;
  font-weight: 700;
  line-height: 1.3;
  color: #0f172a;
  word-break: keep-all;
}

.stk-meta {
  margin-top: 0.1rem;
  font-size: 0.72rem;
  line-height: 1.3;
  color: #64748b;
}

.stk-unit {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin-top: 0.4rem;
  padding-top: 0.35rem;
  border-top: 1px solid #e2e8f0;
  font-size: 0.72rem;
  color: #64748b;
}

.stk-unit strong {
  color: #0f172a;
  font-size: 0.78rem;
  font-weight: 700;
}

.stk-item-right {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.28rem;
  padding: 0.65rem 0.7rem 0.65rem 0.55rem;
  border-left: 1px solid #e2e8f0;
}

.stk-price-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.35rem;
  font-size: 0.72rem;
  color: #64748b;
}

.stk-price-row strong {
  font-size: 0.78rem;
  color: #1e293b;
}

.stk-price-row.is-sum strong {
  color: #5782ff;
}

.stk-stepper {
  display: flex;
  align-items: center;
  border: 1px solid #e2e8f0;
  border-radius: 0.35rem;
  overflow: hidden;
  background: #fff;
}

.stk-stepper button {
  width: 1.55rem;
  height: 1.55rem;
  color: #334155;
  font-size: 0.95rem;
}

.stk-stepper button:disabled {
  color: #cbd5e1;
}

.stk-stepper input {
  width: 2rem;
  height: 1.55rem;
  border: 0;
  border-left: 1px solid #e2e8f0;
  border-right: 1px solid #e2e8f0;
  text-align: center;
  font-size: 0.78rem;
  font-weight: 700;
  color: #0f172a;
}
</style>
