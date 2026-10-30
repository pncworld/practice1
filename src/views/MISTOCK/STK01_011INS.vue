<!-- /*--############################################################################
# Filename : STK01_011INS.vue                                                  
# Description : 자재관리 > 청구 관리 > 청구 등록               
# Date :2025-09-25                                                            
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <!-- pl-5: 셸 w-right가 pl0이라 그리드가 좌측 메뉴에 붙음 → 우측 pd20과 맞춤 -->
  <div
    class="stk011-page box-border flex h-full max-w-full min-h-0 flex-col overflow-hidden pb-1 pl-5"
    @click="handleParentClick">
    <div
      class="flex shrink-0 flex-wrap items-center justify-between gap-3 overflow-y-hidden">
      <PageName></PageName>
      <div class="flex flex-wrap items-center justify-end gap-2 pr-5">
        <button @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <button
          @click="addButton"
          class="button new md:w-auto w-14 disabled:bg-opacity-50"
          :disabled="!canAddDemand">
          신규
        </button>
        <button @click="deleteButton" class="button delete md:w-auto w-14">
          삭제
        </button>
        <button @click="excelButton" class="button excel">엑셀</button>
      </div>
    </div>

    <div
      class="stk011-search-panel z-10 mt-3 w-full min-w-0 shrink-0 rounded-lg bg-gray-200">
      <div class="stk011-search-grid min-w-0">
        <div class="stk011-sg-label">청구일자</div>
        <div class="stk011-cell-field stk011-date-slot min-w-0">
          <Datepicker2
            ref="datepicker"
            omit-main-label
            filter-bar-align
            :mainName="'청구일자'"
            :initToday="0"
            :initToday2="0"
            :closePopUp="closePopUp"
            @endDate="endDate"
            @startDate="startDate" />
        </div>
        <div class="stk011-spacer" aria-hidden="true"></div>
        <label class="stk011-sg-label" for="stk01-011-store">청구매장</label>
        <div class="stk011-cell-field stk011-store-slot min-w-0">
          <select
            id="stk01-011-store"
            class="stk011-control"
            v-model="cond"
            :disabled="storeLocked">
            <option
              v-for="i in optionList"
              :key="i.lngStoreCode"
              :value="i.lngStoreCode">
              {{ storeOptionLabel(i) }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <p class="stk011-dblclick-hint">
      매장명 또는 청구번호를 더블클릭하면 상세가 열립니다.
    </p>
    <div class="min-h-0 min-w-0 w-full flex-1 pb-2">
      <Realgrid
        :progname="'STK01_011INS_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :documentTitle="'STK01_011INS'"
        @updatedRowData="updatedRowData"
        @clickedButtonCol="clickedButtonCol"
        @dblclickedRowData="dblclickedRowData"
        :checkRenderEditable="true"
        :checkRowAuto="false"
        :checkRowAuto2="true"
        :checkRowAuto2Col="'Selected'"
        :checkAbleExpressionCol="'Selected'"
        :checkAbleExpressionCol2="'lngStatus'"
        :checkAbleExpressionVal="'02,07,06,05,04'"
        :checkAbleExpressionCol3="'lngStatus'"
        :checkAbleExpressionVal2="'01'"
        :documentSubTitle="documentSubTitle"
        :rowStateeditable="false"
        :exporttoExcel="exportExcel"
        dblclickShadeColumns="strStoreName,strDemandNo"
        timeDateColumns="addedDate,updatedDate">
      </Realgrid>
    </div>
  </div>

  <Teleport to="body">
  <div
    v-if="open"
    class="stk011-popup-backdrop"
    @mousedown.self.prevent>
    <div
      class="stk011-popup"
      role="dialog"
      aria-modal="true"
      aria-label="청구 등록"
      :style="demandPop.style"
      @mousedown.stop
      @keydown.esc="open = false">
      <div class="stk011-popup-head" @mousedown="onDemandHeadDown">
        <h2 class="text-xl font-bold tracking-tight text-gray-900">청구 등록</h2>
        <div class="stk011-popup-actions flex flex-wrap items-center gap-2" @mousedown.stop>
          <button
            type="button"
            class="pnc-sub-btn"
            :disabled="!canEditDemand || saving"
            @click="saveButton">
            <svg class="pnc-sub-btn__icon" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M3.2 8.4 6.4 11.4 12.8 4.8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            저장
          </button>
          <button type="button" class="pnc-sub-btn" @click="excelButton2">
            <svg class="pnc-sub-btn__icon" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M8 2.8v7.4M5 7.4 8 10.4 11 7.4M3 12.8h10" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            엑셀
          </button>
          <button type="button" class="pnc-sub-btn pnc-sub-btn--gray" @click="open = false">
            <svg class="pnc-sub-btn__icon" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M4 4l8 8M12 4 4 12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
            </svg>
            닫기
          </button>
        </div>
      </div>

      <div class="stk011-form-grid">
        <div class="stk011-form-label">청구일자</div>
        <div class="stk011-form-value">
          <input
            type="date"
            class="stk011-control"
            v-model="scond"
            @change="searchButton2"
            :disabled="disabled" />
        </div>
        <div class="stk011-form-label">청구매장</div>
        <div class="stk011-form-value">
          <select id="stk01-011-popup-store" disabled v-model="scond2" class="stk011-control">
            <option
              v-for="i in optionList"
              :key="'p-' + i.lngStoreCode"
              :value="i.lngStoreCode">
              {{ storeOptionLabel(i) }}
            </option>
          </select>
        </div>
        <div class="stk011-form-label">청구번호</div>
        <div class="stk011-form-value">
          <input
            type="text"
            class="stk011-control"
            v-model="scond3"
            disabled />
        </div>
      </div>

      <div class="stk011-popup-grid">
        <Realgrid
          :progname="'STK01_011INS_VUE'"
          :progid="2"
          :rowData="rowData2"
          :documentTitle="'STK01_011INS'"
          :rowStateeditable="false"
          :editableColId="editableColId"
          @updatedRowData="updatedRowData2"
          :editableColByCondition="true"
          :inputOnlyNumberColumn="'dblDemandQty'"
          :CalculateTaxColId2="'curSupply'"
          :CalculateTaxColId="'curTax'"
          :highlightColId="'dblDemandQty'"
          :demandDetailColColors="true"
          :documentSubTitle="documentSubTitle2"
          :exporttoExcel="exporttoExcel2"
          @realgridname="onPopupGridName"
          :setStateBar="false"></Realgrid>
      </div>

      <div class="stk011-comment">
        <div class="stk011-form-label">코멘트</div>
        <textarea
          v-model="scond4"
          :disabled="!canEditDemand"
          class="stk011-comment-field"></textarea>
      </div>

      <div
        class="stk011-popup-resize"
        title="크기 조절"
        @mousedown.stop="onDemandResizeDown"></div>

      <!-- 공통 로딩(BasicLayout, z-index 100)은 body 로 옮긴 팝업 뒤에 가려지므로 팝업 안에 표시 -->
      <div v-if="store.state.loading" class="stk011-popup-loading" role="status" aria-label="처리 중">
        <img :src="loadingGif" alt="" />
      </div>
    </div>
  </div>
  </Teleport>
</template>

<script setup>
import {
  deleteDemandMaster,
  getCheckAbility,
  getDemandStoreList,
  getDemCloseTime,
  getStockDemandList2,
  getStockDetail2,
  InsertDemandMasterDetail,
} from "@/api/mistock";
import { UpdateDemandMasterDetail2 } from "@/api/vuepos";
import PageName from "@/components/pageName.vue";
import Realgrid from "@/components/realgrid.vue";
import { rgGetInstance } from "@/components/realgridInstanceRegistry.js";
import { formatLocalDate, insertPageLog } from "@/customFunc/customFunc";
import { useFloatPopup } from "@/utils/floatPopup";
import loadingGif from "@/assets/images/loading.gif";
import { computed, nextTick, onMounted, ref, watch } from "vue";

import Datepicker2 from "@/components/Datepicker2.vue";
import Swal from "sweetalert2";
import { useStore } from "vuex";

/** 청구 등록 팝업 — 이동·크기 조절 (PUR02_015INS 매입 상세 팝업과 같은 방식) */
const demandPop = useFloatPopup({
  width: 1536,
  height: 768,
  minWidth: 720,
  minHeight: 420,
  maxWidthRatio: 0.98,
  maxHeightRatio: 0.9,
});

const popupGridName = ref("");
const onPopupGridName = (name) => {
  popupGridName.value = name;
};

const onDemandHeadDown = (event) => {
  demandPop.startDrag(event);
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

const onDemandResizeDown = (event) => {
  demandPop.startResize(event);
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
const cond2 = ref("");
const cond3 = ref("");
const cond4 = ref("");
const cond5 = ref("0");
const tempSeeStore = ref(false);
const reportCheckData = ref("0");
const progId = ref("1");

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

const limitStore = ref("0");

const isAllStoreRow = (item) => {
  const name = String(item?.strName ?? "").replace(/\s/g, "");
  const code = Number(item?.lngStoreCode);
  return name === "전체" || name === "선택" || code === 0;
};

const storeOptionLabel = (item) => (isAllStoreRow(item) ? "선택" : item.strName);

const isStoreUnselected = () => {
  const current = optionList.value.find(
    (item) => String(item.lngStoreCode) === String(cond.value)
  );
  if (!current) return true;
  return isAllStoreRow(current);
};

const canAddDemand = computed(
  () => limitStore.value != "2" && !isStoreUnselected()
);

const canEditDemand = ref(false);

/** 매장 계정(브랜드 관리자·본사 아님)이면 청구매장을 자기 매장으로 고정 — pickStore.vue 와 같은 기준 */
const isStoreAccount = () =>
  String(store.state.userData.blnBrandAdmin) !== "True" &&
  String(store.state.userData.lngPositionType) !== "1";
const storeLocked = ref(false);

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getDemandStoreList(store.state.userData.lngStoreGroup, 0);
  const list = res.data.List || [];
  const concrete = list.filter((item) => !isAllStoreRow(item));
  // 세션 매장코드는 lngPosition (userData.lngStoreCode 는 세션에 없음)
  const myStoreCode = String(store.state.userData.lngPosition ?? "");
  const mine = concrete.find(
    (item) => String(item.lngStoreCode) === myStoreCode
  );

  if (isStoreAccount()) {
    storeLocked.value = true;
    optionList.value = [
      mine || {
        lngStoreCode: myStoreCode,
        strName: store.state.userData.strStoreName || myStoreCode,
      },
    ];
    cond.value = optionList.value[0].lngStoreCode;
  }

  const lockedToOneStore =
    storeLocked.value || (concrete.length === 1 && Boolean(mine));
  let allRow = list.find((item) => isAllStoreRow(item));

  if (storeLocked.value) {
    // 위에서 자기 매장 하나로 고정함
  } else if (!lockedToOneStore && !allRow) {
    allRow = { lngStoreCode: 0, strName: "선택" };
    optionList.value = [allRow, ...list];
  } else {
    optionList.value = list;
  }

  if (storeLocked.value) {
    // cond 는 위에서 자기 매장으로 설정함
  } else if (lockedToOneStore) {
    cond.value = mine.lngStoreCode;
  } else if (allRow) {
    cond.value = allRow.lngStoreCode;
  } else if (concrete.length === 1) {
    cond.value = concrete[0].lngStoreCode;
  } else {
    cond.value = 0;
  }

  const res2 = await getCheckAbility(
    store.state.userData.lngStoreGroup,
    store.state.userData.lngPosition
  );
  limitStore.value = res2.data.List[0].lngChk;

  if (limitStore.value == "2") {
    await Swal.fire({
      title: "경고",
      text: "현재 매장은 청구 제한 매장입니다. 조회만 가능합니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
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
    optionList.value.filter((item) => item.lngStoreCode == cond.value)[0]
      ?.strName || "";
  documentSubTitle.value =
    "청구일자 :" +
    sdate.value +
    "~" +
    edate.value +
    "\n" +
    "청구매장 : " +
    filterd;

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

const setStoreArea = async (e) => {
  const res2 = await getDemCloseTime(
    store.state.userData.lngStoreGroup,
    e.target.value
  );

  if (res2.data.List.length > 0) {
    cond2.value = res2.data.List[0].dtmClosehour;
    cond3.value = res2.data.List[0].dtmCloseMin;
    cond4.value = res2.data.List[0].pre_date;
  }
};

const onlyNumber = (e) => {
  if (e.target.name == "cond2") {
    cond2.value = e.target.value.replace(/[^0-9]/g, "");
  } else if (e.target.name == "cond3") {
    cond3.value = e.target.value.replace(/[^0-9]/g, "");
  } else if (e.target.name == "cond4") {
    cond4.value = e.target.value.replace(/[^0-9]/g, "");
  }
};

const updatedrowdata = ref([]);
const updatedRowData = (e) => {
  updatedrowdata.value = e;
};

const toInt = (value) => {
  const num = Number(String(value ?? "").replace(/,/g, ""));
  return Number.isFinite(num) ? Math.trunc(num) : 0;
};

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

const pad2 = (value) => String(value).padStart(2, "0");

const displayDateTime = (raw) => {
  if (raw == null || raw === "") return "";
  if (raw instanceof Date && !Number.isNaN(raw.getTime())) {
    return `${raw.getFullYear()}-${pad2(raw.getMonth() + 1)}-${pad2(
      raw.getDate()
    )} ${pad2(raw.getHours())}:${pad2(raw.getMinutes())}`;
  }
  const text = String(raw).trim();
  const msMatch = text.match(/\/Date\((-?\d+)(?:[+-]\d+)?\)\//);
  if (msMatch) {
    const d = new Date(Number(msMatch[1]));
    if (!Number.isNaN(d.getTime())) return displayDateTime(d);
  }
  const datePart = toDateInput(text);
  if (!datePart) return "";
  const timePart = text.match(/(\d{1,2}):(\d{2})/);
  if (!timePart) return datePart;
  let hour = Number(timePart[1]);
  const minute = Number(timePart[2]);
  if (/오후|PM/i.test(text) && hour < 12) hour += 12;
  if (/오전|AM/i.test(text) && hour === 12) hour = 0;
  return `${datePart} ${pad2(hour)}:${pad2(minute)}`;
};

const formatGridDateTime = (raw) => {
  const shown = displayDateTime(raw);
  if (!shown) return "";
  const [date, time] = shown.split(" ");
  if (!time) return `${date.replaceAll("-", "/")} 00:00`;
  return `${date.replaceAll("-", "/")} ${time}`;
};

const originQtyByStock = ref({});

const applyDetailList = (list) => {
  const map = {};
  rowData2.value = (list || []).map((item) => {
    const qty = toInt(item.dblDemandQty);
    map[String(item.lngStockID)] = qty;
    return { ...item, dblDemandQty: qty };
  });
  originQtyByStock.value = map;
};

const isUnissuedDemand = (row) => {
  if (row == null) return false;
  const lng = String(row.lngStatus ?? row[10] ?? "").trim();
  const str = String(row.strStatus ?? row[7] ?? "").trim();
  return (
    lng === "01" ||
    lng === "1" ||
    lng.includes("미발주") ||
    str.includes("미발주")
  );
};

const rowText = (row, name, index) => {
  const named = row?.[name];
  if (named != null && String(named).trim() !== "") return named;
  const indexed = row?.[index];
  return indexed == null ? "" : indexed;
};

/** 저장 요청 중 — 버튼 중복 클릭으로 같은 청구가 두 번 저장되는 것 방지 */
const saving = ref(false);

const saveButton = async () => {
  if (!canEditDemand.value || saving.value) return;
  const isExistingDemand = String(scond3.value || "").trim() !== "";
  // 신규: 청구수량을 하나도 입력하지 않았으면 저장하지 않음
  if (!isExistingDemand) {
    const newRows =
      updatedrowdata2.value && updatedrowdata2.value.length
        ? updatedrowdata2.value
        : rowData2.value || [];
    if (!newRows.some((item) => toInt(item.dblDemandQty) > 0)) {
      await Swal.fire({
        title: "알림",
        html: "청구수량을 입력한 자재가 없습니다.<br>청구수량을 입력한 뒤 저장해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }
  }
  saving.value = true;
  try {
    store.state.loading = true;
    const source =
      updatedrowdata2.value && updatedrowdata2.value.length
        ? updatedrowdata2.value
        : rowData2.value || [];
    const saveRows = isExistingDemand
      ? source.filter(
          (item) =>
            toInt(item.dblDemandQty) > 0 ||
            toInt(originQtyByStock.value[String(item.lngStockID)]) > 0
        )
      : source;
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
    const demandDate = String(scond.value || "").replaceAll("-", "");
    const res = isExistingDemand
      ? await UpdateDemandMasterDetail2(
          store.state.userData.lngStoreGroup,
          scond2.value,
          demandDate,
          scond3.value,
          scond4.value,
          1,
          ddate,
          edate,
          lngstocks,
          qtys,
          store.state.userData.lngSequence,
          0,
          "",
          ""
        )
      : await InsertDemandMasterDetail(
          store.state.userData.lngStoreGroup,
          scond2.value,
          demandDate,
          scond4.value,
          1,
          ddate,
          edate,
          lngstocks,
          qtys,
          store.state.userData.lngSequence,
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
    store.state.loading = false;
    saving.value = false;
    open.value = false;
    searchButton();
  }
};

const searchButton = async () => {
  if (isStoreUnselected()) {
    await Swal.fire({
      title: "알림",
      text: "매장을 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  try {
    store.state.loading = true;
    const res = await getStockDemandList2(
      store.state.userData.lngStoreGroup,
      cond.value,
      store.state.userData.strLanguage,
      sdate.value.replaceAll("-", ""),
      edate.value.replaceAll("-", "")
    );
    rowData.value = (res.data.List || []).map((item) => ({
      ...item,
      Selected: false,
      addedDate: formatGridDateTime(
        item.addedDate ?? item.AddedDate ?? item.dtmAddedDate
      ),
      updatedDate: formatGridDateTime(
        item.updatedDate ?? item.UpdatedDate ?? item.dtmUpdatedDate
      ),
    }));
    afterSearch.value = true;
  } catch (error) {
  } finally {
    store.state.loading = false;
  }
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
  tempColID.value = e;
};

const clickedrowdata = ref("");

const open = ref(false);
watch(open, (isOpen) => {
  if (isOpen) {
    demandPop.place();
    nextTick(() => refreshPopupGridSize());
  }
});
const disabled = ref(false);

const rowData2 = ref([]);
const scond4 = ref("");

const editableColId = ref("");
const tempdtmEndDate = ref("");
const dblclickedRowData = async (e) => {
  editableColId.value = "";
  if (tempColID.value == "strStoreName" || tempColID.value == "strDemandNo") {
    const demandDate = rowText(e, "dtmDemandDate", 3);
    const storeCode = rowText(e, "lngStoreCode", 11);
    const demandNo = rowText(e, "strDemandNo", 2);
    const unissued = isUnissuedDemand(e) && limitStore.value != "2";
    disabled.value = true;
    canEditDemand.value = unissued;
    editableColId.value = unissued ? "dblDemandQty" : "";
    scond.value = toDateInput(demandDate);
    scond2.value = storeCode;
    scond3.value = demandNo;
    updatedrowdata2.value = [];

    try {
      store.state.loading = true;
      const res = await getStockDetail2(
        store.state.userData.lngStoreGroup,
        storeCode,
        store.state.userData.strLanguage,
        demandNo,
        toDateInput(demandDate).replaceAll("-", "")
      );
      applyDetailList(res.data.List || []);
      scond4.value = res.data.List2?.[0]?.strComments || "";
      tempdtmEndDate.value = rowData2.value[0]?.dtmEndDate || "";
      open.value = true;
    } catch (error) {
    } finally {
      store.state.loading = false;
    }
  }
};

const scond = ref("");
const scond2 = ref("");
const scond3 = ref("");

const exporttoExcel2 = ref(false);
const excelButton2 = () => {
  const storeNm = optionList.value.filter(
    (item) => item.lngStoreCode == scond2.value
  )[0].strName;
  documentSubTitle2.value =
    "청구일자 :" +
    scond.value +
    "\n" +
    "매장명 :" +
    storeNm +
    "\n" +
    "청구번호 :" +
    scond3.value;

  exporttoExcel2.value = !exporttoExcel2.value;
};

const addButton = async () => {
  if (!canAddDemand.value) return;
  disabled.value = false;
  canEditDemand.value = true;
  scond.value = formatLocalDate(new Date());
  scond2.value = cond.value;
  scond3.value = "";
  scond4.value = "";
  editableColId.value = "dblDemandQty";
  rowData2.value = [];
  updatedrowdata2.value = [];

  try {
    store.state.loading = true;
    const res = await getStockDetail2(
      store.state.userData.lngStoreGroup,
      cond.value,
      store.state.userData.strLanguage,
      "",
      formatLocalDate(new Date()).replaceAll("-", "")
    );
    applyDetailList(res.data.List || []);
    open.value = true;
  } catch (error) {
  } finally {
    store.state.loading = false;
  }
};

const updatedrowdata2 = ref([]);
const updatedRowData2 = (e) => {
  console.log(e);
  updatedrowdata2.value = e;
};

const searchButton2 = async (e) => {
  rowData2.value = [];
  updatedrowdata2.value = [];
  try {
    store.state.loading = true;
    const res = await getStockDetail2(
      store.state.userData.lngStoreGroup,
      scond2.value || cond.value,
      store.state.userData.strLanguage,
      "",
      String(e.target.value).replaceAll("-", "")
    );
    applyDetailList(res.data.List || []);
    scond4.value = res.data.List2?.[0]?.strComments || "";
  } catch (error) {
  } finally {
    store.state.loading = false;
  }
};

const deleteButton = async () => {
  const filtered = updatedrowdata.value.filter(
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
    const storecds = filtered.map((item) => item.lngStoreCode).join("\u200b");
    const demandnos = filtered.map((item) => item.strDemandNo).join("\u200b");
    const demanddates = filtered
      .map((item) => item.dtmDemandDate)
      .join("\u200b");

    const res = await deleteDemandMaster(
      store.state.userData.lngStoreGroup,
      storecds,
      demandnos,
      demanddates,
      store.state.userData.lngSequence
    );

    console.log(res);

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
    searchButton();
  }
};
</script>

<style scoped>
.stk011-dblclick-hint {
  flex-shrink: 0;
  margin: 0.5rem 0 0.25rem 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #3b5bdb;
}

.stk011-page {
  --stk011-label-col: 6.5rem;
  --stk011-item-gap: 2rem;
  --stk011-col-gap: 1.75rem;
  --stk011-panel-pad-x: 7rem; /* 조회 항목 2개 — 앞·뒤 동일 (search-area-pad-flexible) */
  --stk011-date-field-w: 21.6rem;
  --stk011-store-field-w: 18rem;
  --stk011-row-min-h: 2rem;
  --stk011-control-border: #cbd5e1;
  --stk011-control-focus-border: #3b82f6;
  --stk011-control-h: 2rem;
  --stk011-control-radius: 0.375rem;
}

/* 조회 AREA — PUR02_015INS 패턴: 앞·뒤 pad 동일, 남는 가로는 가운데 spacer 만 흡수 */
.stk011-search-panel {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  padding-block: 0.75rem;
  padding-inline: var(--stk011-panel-pad-x);
}

.stk011-search-grid {
  display: grid;
  grid-template-columns:
    max-content
    minmax(0, var(--stk011-date-field-w))
    minmax(var(--stk011-col-gap), 1fr)
    max-content
    minmax(0, var(--stk011-store-field-w));
  align-items: center;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  column-gap: 0;
}

.stk011-spacer {
  min-width: var(--stk011-col-gap);
  align-self: stretch;
}

.stk011-sg-label {
  justify-self: stretch;
  box-sizing: content-box;
  min-width: var(--stk011-label-col);
  padding-right: var(--stk011-item-gap);
  min-height: var(--stk011-row-min-h);
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

.stk011-cell-field {
  min-width: 0;
  min-height: var(--stk011-row-min-h);
  display: flex;
  align-items: center;
  width: 100%;
}

.stk011-date-slot,
.stk011-store-slot {
  justify-self: stretch;
}

.stk011-control {
  box-sizing: border-box;
  height: var(--stk011-control-h);
  min-height: var(--stk011-control-h);
  max-height: var(--stk011-control-h);
  width: 100%;
  min-width: 0;
  border-radius: var(--stk011-control-radius);
  border: 1px solid var(--stk011-control-border);
  background: #fff;
  padding: 0 0.5rem;
  font-size: 0.875rem;
  line-height: 1;
  color: rgb(55 65 81);
}

.stk011-page select.stk011-control,
.stk011-popup select.stk011-control {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  padding-right: 1.75rem;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='none' stroke='%236b7280' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' d='M3 4.5 6 7.5 9 4.5'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 0.75rem;
}

.stk011-control:focus,
.stk011-control:focus-visible {
  border-color: var(--stk011-control-focus-border) !important;
  outline: none;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.25);
}

.stk011-control:disabled {
  background: #f3f4f6;
  color: #6b7280;
  cursor: not-allowed;
}

.stk011-date-slot :deep(> div.flex.justify-start.items-center) {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0;
  margin: 0 !important;
  gap: 0.25rem !important;
}

.stk011-date-slot :deep(> div.flex > div.inline-flex.h-8) {
  flex: 1 1 auto;
  min-width: 0;
  max-width: 100%;
  width: 100%;
  gap: 0.125rem !important;
}

.stk011-date-slot :deep(input[type="date"]) {
  box-sizing: border-box;
  height: var(--stk011-control-h) !important;
  min-height: var(--stk011-control-h) !important;
  max-height: var(--stk011-control-h) !important;
  border: 1px solid var(--stk011-control-border) !important;
  border-radius: 0.375rem;
  background: #fff;
  width: auto !important;
  flex: 1 1 0;
  min-width: 5.25rem;
  max-width: none;
  padding-left: 0.45rem;
  padding-right: 0.25rem;
  font-size: 0.875rem;
}

.stk011-date-slot :deep(div.inline-flex.h-8 > span) {
  flex-shrink: 0;
}

.stk011-date-slot :deep(div.inline-flex.h-8 > button) {
  flex-shrink: 0;
  width: 1.65rem !important;
  height: 1.65rem !important;
  min-width: 1.65rem;
  margin-left: 0 !important;
}

@media (max-width: 1100px) {
  .stk011-page {
    --stk011-panel-pad-x: 2rem;
  }
}

.stk011-date-slot :deep(input[type="date"]:focus) {
  border-color: var(--stk011-control-focus-border) !important;
  outline: none;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.25);
}

/* 팝업: body Teleport + Swal(13050) 아래 — 이동·크기 조절(floatPopup) */
.stk011-popup-backdrop {
  position: fixed;
  inset: 0;
  z-index: 11000;
  background: rgb(0 0 0 / 0.5);
  pointer-events: auto;
}

.stk011-popup {
  --stk011-control-border: #cbd5e1;
  --stk011-control-focus-border: #3b82f6;
  --stk011-control-h: 2rem;
  --stk011-control-radius: 0.375rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  background: #fff;
  border-radius: 0.75rem;
  box-shadow: 0 20px 40px rgb(15 23 42 / 0.18);
  overflow: hidden;
  pointer-events: auto;
}

.stk011-popup-resize {
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

.stk011-popup-actions {
  cursor: default;
}

/* 팝업 안 로딩 표시 — 처리 중에는 팝업 전체를 덮어 추가 클릭도 막음 */
.stk011-popup-loading {
  position: absolute;
  inset: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(255 255 255 / 0.55);
  cursor: progress;
}

.stk011-popup-loading img {
  max-width: 80px;
  max-height: 80px;
}

.stk011-popup-head {
  cursor: move;
  user-select: none;
  display: flex;
  flex-shrink: 0;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  /* 팝업 padding(1.5rem) 위·좌우 여백까지 끌기 영역으로 — 맨 위를 잡아도 이동 */
  margin: -1.5rem -1.5rem 0.75rem;
  padding: 1.5rem 1.5rem 0.75rem;
  border-bottom: 1px solid #d1d5db;
}

.stk011-form-grid {
  display: grid;
  flex-shrink: 0;
  grid-template-columns: 6.25rem minmax(0, 1fr) 6.25rem minmax(0, 1fr) 6.25rem minmax(0, 1fr);
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  overflow: hidden;
  background: #fff;
}

.stk011-form-label {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 2.5rem;
  padding: 0.25rem 0.375rem;
  border: 1px solid #e5e7eb;
  background: #edf2f7;
  color: #5c5c5c;
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1.25;
  text-align: center;
  word-break: keep-all;
}

.stk011-form-value {
  display: flex;
  align-items: center;
  min-width: 0;
  min-height: 2.5rem;
  padding: 0.25rem 0.5rem;
  border: 1px solid #e5e7eb;
  background: #fff;
}

.stk011-form-value .stk011-control {
  width: 100%;
}

.stk011-popup-grid {
  min-height: 0;
  flex: 1 1 auto;
  width: 100%;
  margin-top: 0.75rem;
}

.stk011-comment {
  display: grid;
  flex-shrink: 0;
  grid-template-columns: 6.25rem minmax(0, 1fr);
  min-height: 5.5rem;
  margin-top: 0.75rem;
  overflow: hidden;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background: #fff;
}

.stk011-comment .stk011-form-label {
  align-self: stretch;
  min-height: 100%;
}

.stk011-comment-field {
  box-sizing: border-box;
  width: 100%;
  min-height: 5.5rem;
  height: 100%;
  padding: 0.5rem 0.75rem;
  border: 0;
  resize: none;
  font-size: 0.875rem;
  line-height: 1.4;
  color: rgb(55 65 81);
  background: #fff;
}

.stk011-comment-field:focus {
  outline: none;
}

.stk011-comment-field:disabled {
  background: #f3f4f6;
  color: #6b7280;
}
</style>
