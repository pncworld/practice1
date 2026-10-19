<!-- /*--############################################################################
# Filename : MST36_005RPT.vue
# Description : 시스템관리 > PNC관리 > 매장검색
# Date :2026-10-08
# Author : 권지안
################################################################################*/ -->
<template>
  <div class="h-[80%]">
    <div class="flex shrink-0 justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center mr-9 space-x-2 pr-5">
        <button class="button search md:w-auto w-14" @click="searchButton">조회</button>
        <button class="button save w-auto excel" @click="excelButton">엑셀</button>
      </div>
    </div>

    <div class="bg-gray-200 rounded-lg z-10 mt-3 px-5 py-3">
      <div class="flex flex-wrap items-center gap-3 min-w-0 ml-10">
        <span class="rpt-label">매장그룹</span>
        <input
          type="text"
          class="rpt-input w-40"
          v-model="cond.storeGroup"
          @keydown.enter="searchButton" />
        <span class="rpt-label rpt-label-gap">매장명</span>
        <input
          type="text"
          class="rpt-input w-40"
          v-model="cond.storeName"
          @keydown.enter="searchButton" />
        <span class="rpt-check">
          <input id="mst36005-only-upload" v-model="cond.onlyUpload" type="checkbox" />
          <label for="mst36005-only-upload">업로드가능매장만 보기</label>
        </span>
        <!-- <button type="button" class="rpt-action" @click="storeCheckButton">매장정보점검</button> -->
        <button type="button" class="rpt-action" @click="menuCheckButton">메뉴점검</button>
        <button type="button" class="rpt-action" @click="ftpUploadButton">FTP Upload</button>
      </div>
    </div>

    <div class="h-[68vh] min-h-[420px] mt-3">
      <Realgrid
        :progname="'MST36_005RPT_VUE'"
        :progid="1"
        :rowData="rowData"
        :setStateBar="false"
        :rowStateeditable="false"
        :selectionStyle="'singleRow'"
        :fixedColumn="true"
        :exporttoExcel="exportExcel"
        :documentTitle="'MST36_005RPT'"
        :documentSubTitle="documentSubTitle"
        @clickedRowData="clickedRowData"
        @selectedIndex="onSelectedIndex"
        @dblclickedRowData="dblclickedRowData">
      </Realgrid>
    </div>
  </div>
</template>

<script setup>
import { menuCheckStore, searchStoreList, storeCheckStore, uploadSetStore } from "@/api/master";
import PageName from "@/components/pageName.vue";
import Realgrid from "@/components/realgrid.vue";
import { insertPageLog } from "@/customFunc/customFunc";
import Swal from "sweetalert2";
import { onMounted, reactive, ref } from "vue";
import { useStore } from "vuex";

const store = useStore();
const rowData = ref([]);
const selectedRow = ref(null);
const exportExcel = ref(false);
const documentSubTitle = ref("");

const cond = reactive({
  storeGroup: "",
  storeName: "",
  onlyUpload: false,
});

const readPayload = (data) => {
  let payload = data;
  if (payload && typeof payload === "object" && "d" in payload) {
    payload = payload.d;
  }
  if (typeof payload === "string") {
    try {
      payload = JSON.parse(payload);
    } catch (error) {
      payload = {};
    }
  }
  return payload && typeof payload === "object" ? payload : {};
};

const formatDateTimeText = (value) => {
  if (value == null || String(value).trim() === "") {
    return "";
  }
  const text = String(value).trim();
  const pad = (n) => String(n).padStart(2, "0");
  const microsoft = text.match(/^\/Date\((-?\d+)\)\/$/);
  const parsed = microsoft ? new Date(Number(microsoft[1])) : null;
  if (parsed && !Number.isNaN(parsed.getTime())) {
    return `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())} ${pad(parsed.getHours())}:${pad(parsed.getMinutes())}:${pad(parsed.getSeconds())}`;
  }
  const matched = text.match(
    /^(\d{4})[-/.]?(\d{2})[-/.]?(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?/
  );
  if (!matched) {
    return text;
  }
  const date = `${matched[1]}-${matched[2]}-${matched[3]}`;
  if (!matched[4]) {
    return `${date} 00:00:00`;
  }
  return `${date} ${matched[4]}:${matched[5]}:${matched[6] || "00"}`;
};

const formatGridDate = (value) => {
  if (value == null || String(value).trim() === "") {
    return null;
  }
  const text = String(value).trim();
  const microsoft = text.match(/^\/Date\((-?\d+)\)\/$/);
  const parsed = microsoft ? new Date(Number(microsoft[1])) : null;
  if (parsed && !Number.isNaN(parsed.getTime())) {
    const month = String(parsed.getMonth() + 1).padStart(2, "0");
    const day = String(parsed.getDate()).padStart(2, "0");
    return `${parsed.getFullYear()}-${month}-${day}`;
  }
  const digits = text.replace(/\D/g, "");
  if (digits.length >= 8) {
    return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
  }
  return null;
};

const normalizeRowDates = (row) => {
  const next = { ...row };
  Object.keys(next).forEach((key) => {
    const value = next[key];
    if (/^dtmUpdate$/i.test(key)) {
      next[key] = formatDateTimeText(value);
      return;
    }
    if (/^dtmUpload$/i.test(key)) {
      return;
    }
    const microsoft =
      typeof value === "string" && /^\/Date\((-?\d+)\)\/$/.test(String(value).trim());
    if (!microsoft && !/dtm|date/i.test(key)) {
      return;
    }
    next[key] = formatGridDate(value);
  });
  return next;
};

const rowValue = (row, key) => {
  if (!row || typeof row !== "object") {
    return "";
  }
  const value = row[key];
  return value == null ? "" : String(value);
};

let acceptClickedIndex = false;

const applySelectedIndex = (index) => {
  const rowIndex = Number(index);
  if (!Number.isInteger(rowIndex) || rowIndex < 0) {
    return;
  }
  const row = rowData.value[rowIndex];
  if (row && typeof row === "object") {
    selectedRow.value = row;
  }
};

const clickedRowData = (row) => {
  if (Array.isArray(row)) {
    acceptClickedIndex = true;
    queueMicrotask(() => {
      acceptClickedIndex = false;
    });
    return;
  }
  const index = row?.index ?? row?.dataRow;
  if (index != null && rowData.value[index]) {
    selectedRow.value = rowData.value[index];
    acceptClickedIndex = false;
    return;
  }
  if (
    row &&
    typeof row === "object" &&
    (row.lngStoreGroup != null || row.lngStoreCode != null)
  ) {
    selectedRow.value = row;
    acceptClickedIndex = false;
  }
};

const onSelectedIndex = (index) => {
  if (!acceptClickedIndex) {
    return;
  }
  acceptClickedIndex = false;
  applySelectedIndex(index);
};

const dblclickedRowData = async (row) => {
  clickedRowData(row);
  const text = row?.cellValue ?? row?.value;
  if (text == null || String(text) === "") {
    return;
  }
  try {
    await navigator.clipboard.writeText(String(text));
  } catch (error) {
    return;
  }
};

const requireSelectedRow = () => {
  if (!selectedRow.value) {
    Swal.fire({
      title: "경고",
      text: "매장을 선택하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return null;
  }
  return selectedRow.value;
};

const showResult = (payload, fallback) => {
  if (payload.RESULT_CD && String(payload.RESULT_CD) !== "00") {
    Swal.fire({
      title: "경고",
      text: payload.RESULT_NM || fallback,
      icon: "warning",
      confirmButtonText: "확인",
    });
    return false;
  }
  return true;
};

onMounted(async () => {
  await insertPageLog(store.state.activeTab2);
});

const searchButton = async () => {
  store.state.loading = true;
  try {
    const res = await searchStoreList(
      cond.storeGroup,
      cond.storeName,
      cond.onlyUpload ? "1" : "0"
    );
    const payload = readPayload(res?.data);
    if (!showResult(payload, "매장 조회에 실패했습니다.")) {
      rowData.value = [];
      selectedRow.value = null;
      return;
    }
    const list = Array.isArray(payload.List) ? payload.List : [];
    rowData.value = list.map((row) => normalizeRowDates(row));
    selectedRow.value = null;
  } catch (error) {
    rowData.value = [];
    selectedRow.value = null;
    Swal.fire({
      title: "경고",
      text: "매장 조회에 실패했습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
  } finally {
    store.state.loading = false;
  }
};

const menuCheckButton = async () => {
  const row = requireSelectedRow();
  if (!row) {
    return;
  }
  store.state.loading = true;
  try {
    const res = await menuCheckStore(rowValue(row, "lngStoreGroup"));
    const payload = readPayload(res?.data);
    if (!showResult(payload, "메뉴점검에 실패했습니다.")) {
      return;
    }
    if (Array.isArray(payload.List)) {
      rowData.value = payload.List.map((item) => normalizeRowDates(item));
      selectedRow.value = null;
    }
    Swal.fire({
      title: "확인",
      text: "처리가 완료 되었습니다.",
      icon: "success",
      confirmButtonText: "확인",
    });
  } catch (error) {
    Swal.fire({
      title: "경고",
      text: "메뉴점검에 실패했습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
  } finally {
    store.state.loading = false;
  }
};

const storeCheckButton = async () => {
  const row = requireSelectedRow();
  if (!row) {
    return;
  }
  store.state.loading = true;
  try {
    const res = await storeCheckStore(
      rowValue(row, "lngStoreGroup"),
      rowValue(row, "lngStoreCode")
    );
    const payload = readPayload(res?.data);
    if (!showResult(payload, "매장정보점검에 실패했습니다.")) {
      return;
    }
    if (Array.isArray(payload.List)) {
      rowData.value = payload.List.map((item) => normalizeRowDates(item));
      selectedRow.value = null;
    }
    Swal.fire({
      title: "확인",
      text: "매장정보 처리가 완료 되었습니다.",
      icon: "success",
      confirmButtonText: "확인",
    });
  } catch (error) {
    Swal.fire({
      title: "경고",
      text: "매장정보점검에 실패했습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
  } finally {
    store.state.loading = false;
  }
};

const ftpUploadButton = async () => {
  const row = requireSelectedRow();
  if (!row) {
    return;
  }
  if (rowValue(row, "dtmUpdate").trim() === "") {
    Swal.fire({
      title: "경고",
      text: "POS접속시간이 확인되지 않아 자동 UPLOAD를 할수 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  store.state.loading = true;
  try {
    const res = await uploadSetStore(
      rowValue(row, "lngStoreGroup"),
      rowValue(row, "lngStoreCode")
    );
    const payload = readPayload(res?.data);
    if (!showResult(payload, "FTP Upload 설정에 실패했습니다.")) {
      return;
    }
    await searchButton();
  } catch (error) {
    Swal.fire({
      title: "경고",
      text: "FTP Upload 설정에 실패했습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
  } finally {
    store.state.loading = false;
  }
};

const excelButton = () => {
  documentSubTitle.value = "";
  exportExcel.value = !exportExcel.value;
};
</script>

<style scoped>
.rpt-label {
  width: 4.5rem;
  flex-shrink: 0;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1;
  color: #374151;
  white-space: nowrap;
}

.rpt-label-gap {
  text-align: right;
}

.rpt-check {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  flex-shrink: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  white-space: nowrap;
  cursor: pointer;
}

.rpt-check input {
  cursor: pointer;
}

.rpt-input {
  height: 2rem;
  flex-shrink: 0;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: #fff;
  padding: 0 0.5rem;
  font-size: 0.875rem;
}

.rpt-action {
  height: 2rem;
  flex-shrink: 0;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: #fff;
  padding: 0 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}
</style>
