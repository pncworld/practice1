<!-- /*--############################################################################
# Filename : SYS90_001RPT.vue
# Description : 시스템관리 > PNC관리 > 사용자 관리
# Date :2026-10-08
# Author : 권지안
################################################################################*/ -->
<template>
  <div class="h-[80%]">
    <div class="flex shrink-0 justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center mr-9 space-x-2 pr-5">
        <button class="button primary" type="button" @click="resetButton">초기화</button>
        <!-- <button class="button primary" type="button" @click="resetAppButton">APP인증 초기화</button> -->
        <button class="button search md:w-auto w-14" type="button" @click="searchButton">조회</button>
        <button class="button save w-auto excel" type="button" @click="excelButton">엑셀</button>
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
        <span class="rpt-label">매장</span>
        <input
          type="text"
          class="rpt-input w-40"
          v-model="cond.store"
          @keydown.enter="searchButton" />
        <span class="rpt-label">사용자권한</span>
        <input
          type="text"
          class="rpt-input w-40"
          v-model="cond.userAdmin"
          @keydown.enter="searchButton" />
        <span class="rpt-label">사용자</span>
        <input
          type="text"
          class="rpt-input w-40"
          v-model="cond.user"
          @keydown.enter="searchButton" />
      </div>
    </div>

    <div class="h-[68vh] min-h-[420px] mt-3" @contextmenu.prevent="copySelectedLogin">
      <Realgrid
        :progname="'SYS90_001RPT_VUE'"
        :progid="1"
        :rowData="rowData"
        :setStateBar="false"
        :rowStateeditable="false"
        :selectionStyle="'singleRow'"
        :fixedColumn="true"
        :exporttoExcel="exportExcel"
        :documentTitle="'SYS90_001RPT'"
        :documentSubTitle="documentSubTitle"
        @clickedRowData="clickedRowData"
        @selectedIndex="onSelectedIndex"
        @dblclickedRowData="dblclickedRowData">
      </Realgrid>
    </div>
  </div>
</template>

<script setup>
import { resetAppNo, searchSysUserList } from "@/api/system";
import PageName from "@/components/pageName.vue";
import Realgrid from "@/components/realgrid.vue";
import { insertPageLog } from "@/customFunc/customFunc";
import Swal from "sweetalert2";
import { onMounted, reactive, ref } from "vue";
import { useStore } from "vuex";

const store = useStore();
const rowData = ref([]);
const selectedRow = ref(null);
const selectedIndexNo = ref(-1);
const exportExcel = ref(false);
const documentSubTitle = ref("");

const cond = reactive({
  storeGroup: "",
  store: "",
  userAdmin: "",
  user: "",
});

let acceptClickedIndex = false;

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

const formatGridDate = (value) => {
  if (value == null || String(value).trim() === "") {
    return null;
  }
  const text = String(value).trim();
  const microsoft = text.match(/^\/Date\((-?\d+)\)\/$/);
  const parsed = microsoft ? new Date(Number(microsoft[1])) : null;
  if (parsed && !Number.isNaN(parsed.getTime())) {
    const pad = (n) => String(n).padStart(2, "0");
    const date = `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())}`;
    if (parsed.getHours() || parsed.getMinutes() || parsed.getSeconds()) {
      return `${date} ${pad(parsed.getHours())}:${pad(parsed.getMinutes())}:${pad(parsed.getSeconds())}`;
    }
    return date;
  }
  return text;
};

const normalizeRow = (row) => {
  const next = { ...row };
  Object.keys(next).forEach((key) => {
    const value = next[key];
    const microsoft =
      typeof value === "string" && /^\/Date\((-?\d+)\)\/$/.test(String(value).trim());
    if (microsoft || /dtm|date/i.test(key)) {
      next[key] = formatGridDate(value);
    }
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

const clearSelection = () => {
  selectedRow.value = null;
  selectedIndexNo.value = -1;
};

const applySelectedIndex = (index) => {
  const rowIndex = Number(index);
  if (!Number.isInteger(rowIndex) || rowIndex < 0) {
    return;
  }
  const row = rowData.value[rowIndex];
  if (row && typeof row === "object") {
    selectedRow.value = row;
    selectedIndexNo.value = rowIndex;
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
    applySelectedIndex(index);
    acceptClickedIndex = false;
    return;
  }
  if (row && typeof row === "object" && (row.lngSequence != null || row.strUserId != null)) {
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

const warn = (text) => {
  Swal.fire({
    title: "경고",
    text,
    icon: "warning",
    confirmButtonText: "확인",
  });
};

const requireSelectedRow = () => {
  if (!selectedRow.value) {
    warn("사용자를 선택하세요.");
    return null;
  }
  return selectedRow.value;
};

const copyLoginText = async (row) => {
  const text = `${rowValue(row, "strUserId")}\t${rowValue(row, "strPassWord")}`;
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    warn("로그인 정보를 클립보드에 복사하지 못했습니다.");
  }
};

const copySelectedLogin = async () => {
  const row = requireSelectedRow();
  if (!row) {
    return;
  }
  await copyLoginText(row);
};

const dblclickedRowData = async (row) => {
  const index = row?.dataRow ?? row?.index;
  if (index != null) {
    applySelectedIndex(index);
  }
  const target = selectedRow.value;
  if (!target) {
    return;
  }
  await copyLoginText(target);
};

const showResult = (payload, fallback) => {
  if (payload.RESULT_CD && String(payload.RESULT_CD) !== "00") {
    warn(payload.RESULT_NM || fallback);
    return false;
  }
  return true;
};

onMounted(async () => {
  await insertPageLog(store.state.activeTab2);
});

const resetButton = () => {
  cond.storeGroup = "";
  cond.store = "";
  cond.userAdmin = "";
  cond.user = "";
};

const searchButton = async () => {
  store.state.loading = true;
  try {
    const res = await searchSysUserList(
      cond.storeGroup,
      cond.store,
      cond.userAdmin,
      cond.user
    );
    const payload = readPayload(res?.data);
    if (!showResult(payload, "사용자 조회에 실패했습니다.")) {
      rowData.value = [];
      clearSelection();
      return;
    }
    const list = Array.isArray(payload.List) ? payload.List : [];
    rowData.value = list.map((row) => normalizeRow(row));
    clearSelection();
  } catch (error) {
    rowData.value = [];
    clearSelection();
    warn("사용자 조회에 실패했습니다.");
  } finally {
    store.state.loading = false;
  }
};

const resetAppButton = async () => {
  const row = requireSelectedRow();
  if (!row) {
    return;
  }
  store.state.loading = true;
  try {
    const res = await resetAppNo(rowValue(row, "lngSequence"));
    const payload = readPayload(res?.data);
    if (!showResult(payload, "APP 인증번호 초기화에 실패했습니다.")) {
      return;
    }
    const index = selectedIndexNo.value;
    if (index >= 0 && rowData.value[index]) {
      const next = rowData.value.slice();
      next[index] = { ...next[index], strCPhone: "" };
      rowData.value = next;
      selectedRow.value = next[index];
    } else if (selectedRow.value) {
      selectedRow.value = { ...selectedRow.value, strCPhone: "" };
    }
    Swal.fire({
      title: "확인",
      text: "APP 인증번호 초기화 완료되었습니다",
      icon: "success",
      confirmButtonText: "확인",
    });
  } catch (error) {
    warn("APP 인증번호 초기화에 실패했습니다.");
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
  flex-shrink: 0;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1;
  color: #374151;
  white-space: nowrap;
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
</style>
