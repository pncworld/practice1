<!-- /*--############################################################################
# Filename : MST90_003INS.vue
# Description : 관리자 > 현황조회 > 카드결제월별현황
# Date :2026-10-14
# Author : 권지안
################################################################################*/ -->
<template>
  <div class="relative h-[80%]">
    <div class="flex shrink-0 justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center mr-9 space-x-2 pr-5">
        <button class="button primary" type="button" @click="openRegister">등록</button>
        <button class="button search md:w-auto w-14" type="button" @click="searchButton">조회</button>
        <button class="button save w-auto excel" type="button" @click="excelButton">엑셀</button>
      </div>
    </div>

    <div class="bg-gray-200 rounded-lg z-10 mt-3 px-5 py-3">
      <div class="flex flex-wrap items-center gap-3 min-w-0 ml-10">
        <span class="rpt-label">조회기간</span>
        <select class="rpt-input w-24" v-model="cond.fromYear">
          <option v-for="year in years" :key="'from-y-' + year" :value="year">{{ year }}</option>
        </select>
        <select class="rpt-input w-20" v-model="cond.fromMonth">
          <option v-for="month in months" :key="'from-m-' + month" :value="month">{{ month }}</option>
        </select>
        <span class="rpt-tilde">~</span>
        <select class="rpt-input w-24" v-model="cond.toYear">
          <option v-for="year in years" :key="'to-y-' + year" :value="year">{{ year }}</option>
        </select>
        <select class="rpt-input w-20" v-model="cond.toMonth">
          <option v-for="month in months" :key="'to-m-' + month" :value="month">{{ month }}</option>
        </select>
        <span class="rpt-label ml-6">매장명</span>
        <ComStoreBizSelect
          v-model:adminCode="cond.adminCode"
          v-model:storeGroup="cond.storeGroup"
          v-model:storeCode="cond.storeCode" />
        <!-- <span class="rpt-label">적용율</span>
        <select class="rpt-input w-28" v-model="cond.rate">
          <option v-for="rate in rates" :key="rate" :value="String(rate)">{{ rate }}%</option>
        </select> -->
      </div>
    </div>

    <div class="h-[68vh] min-h-[420px] mt-3">
      <Realgrid
        :progname="'MST90_003INS'"
        :progid="1"
        :rowData="rowData"
        :setStateBar="false"
        :rowStateeditable="false"
        :selectionStyle="'singleRow'"
        :fixedColumn="true"
        :freezeUntilHeader="'합계'"
        :exporttoExcel="exportExcel"
        :documentTitle="'MST90_003INS'"
        :documentSubTitle="documentSubTitle">
      </Realgrid>
    </div>

    <div v-if="registerOpen" class="register-pop">
      <div class="flex shrink-0 justify-between items-center">
        <div class="register-title">※ 조회대상 매장등록</div>
        <div class="flex space-x-2">
          <button class="button search md:w-auto w-14" type="button" @click="searchStoreButton">조회</button>
          <button class="button primary" type="button" @click="saveStoreButton">저장</button>
          <button class="button save w-auto excel" type="button" @click="excelStoreButton">엑셀</button>
          <button class="button primary" type="button" @click="closeRegister">닫기</button>
        </div>
      </div>
      <div class="flex flex-wrap items-center gap-3 mt-3">
        <span class="rpt-label">매장명</span>
        <ComStoreBizSelect
          v-model:adminCode="popup.adminCode"
          v-model:storeGroup="popup.storeGroup"
          v-model:storeCode="popup.storeCode" />
      </div>
      <div class="h-[52vh] min-h-[320px] mt-3">
        <Realgrid
          :progname="'MST90_003INS'"
          :progid="2"
          :rowData="storeRows"
          :rowStateeditable="true"
          :selectionStyle="'singleRow'"
          :fixedColumn="true"
          :checkedRowData2Col="'lngAdminCode'"
          :emitCheckedRowData2AsJson="true"
          :exporttoExcel="exportStoreExcel"
          :documentTitle="'MST90_003INS_STORE'"
          :documentSubTitle="''"
          @updatedRowData="updatedStoreRows"
          @checkedRowData2="adminCodeChanged">
        </Realgrid>
      </div>
    </div>
  </div>
</template>

<script setup>
import { saveMst90StoreInfo, selectMasterRate, selectStoreInfo } from "@/api/master";
import ComStoreBizSelect from "@/components/comStoreBizSelect.vue";
import PageName from "@/components/pageName.vue";
import Realgrid from "@/components/realgrid.vue";
import { insertPageLog } from "@/customFunc/customFunc";
import Swal from "sweetalert2";
import { onMounted, reactive, ref } from "vue";
import { useStore } from "vuex";

const store = useStore();
const now = new Date();
const thisYear = now.getFullYear();
const thisMonth = String(now.getMonth() + 1).padStart(2, "0");
const prevMonthDate = new Date(thisYear, now.getMonth() - 1, 1);
const prevYear = String(prevMonthDate.getFullYear());
const prevMonth = String(prevMonthDate.getMonth() + 1).padStart(2, "0");
const years = [];
for (let year = 2020; year <= thisYear + 2; year += 1) {
  years.push(String(year));
}
const months = Array.from({ length: 12 }, (_, index) => String(index + 1).padStart(2, "0"));
const rates = [10, 20, 30, 40, 50, 60, 70, 80, 90];

const rowData = ref([]);
const storeRows = ref([]);
const storeOrigin = ref([]);
const currentStoreRows = ref([]);
const registerOpen = ref(false);
const exportExcel = ref(false);
const exportStoreExcel = ref(false);
const documentSubTitle = ref("");

const cond = reactive({
  fromYear: prevYear,
  fromMonth: prevMonth,
  toYear: String(thisYear),
  toMonth: thisMonth,
  adminCode: "0",
  storeGroup: "0",
  storeCode: "0",
  rate: "80",
});

const popup = reactive({
  adminCode: "0",
  storeGroup: "0",
  storeCode: "0",
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

const formatGridDate = (value) => {
  if (value == null || String(value).trim() === "") {
    return null;
  }
  const text = String(value).trim();
  const microsoft = text.match(/^\/Date\((-?\d+)\)\/$/);
  const parsed = microsoft ? new Date(Number(microsoft[1])) : null;
  if (parsed && !Number.isNaN(parsed.getTime())) {
    const pad = (n) => String(n).padStart(2, "0");
    return `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())}`;
  }
  const digits = text.replace(/\D/g, "");
  if (digits.length >= 8) {
    return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
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

const warn = (text) => {
  Swal.fire({
    title: "경고",
    text,
    icon: "warning",
    confirmButtonText: "확인",
  });
};

const showResult = (payload, fallback) => {
  if (payload.RESULT_CD && String(payload.RESULT_CD) !== "00") {
    warn(payload.RESULT_NM || fallback);
    return false;
  }
  return true;
};

const sessionValue = (key) => {
  const user = store.state.userData;
  if (!user || typeof user !== "object") {
    return "";
  }
  const value = user[key];
  return value == null ? "" : String(value);
};

const monthText = (year, month) => `${year}${month}`;

onMounted(async () => {
  await insertPageLog(store.state.activeTab2);
});

const searchButton = async () => {
  store.state.loading = true;
  try {
    const res = await selectMasterRate(
      cond.storeGroup,
      cond.storeCode,
      cond.adminCode,
      monthText(cond.fromYear, cond.fromMonth),
      monthText(cond.toYear, cond.toMonth),
      cond.rate
    );
    const payload = readPayload(res?.data);
    if (!showResult(payload, "조회에 실패했습니다.")) {
      rowData.value = [];
      return;
    }
    const list = Array.isArray(payload.List) ? payload.List : [];
    rowData.value = list.map((row) => normalizeRow(row));
  } catch (error) {
    rowData.value = [];
    warn("조회에 실패했습니다.");
  } finally {
    store.state.loading = false;
  }
};

const openRegister = () => {
  registerOpen.value = true;
};

const closeRegister = () => {
  registerOpen.value = false;
};

const searchStoreButton = async () => {
  store.state.loading = true;
  try {
    const res = await selectStoreInfo(popup.adminCode, popup.storeGroup, popup.storeCode);
    const payload = readPayload(res?.data);
    if (!showResult(payload, "매장 조회에 실패했습니다.")) {
      storeRows.value = [];
      storeOrigin.value = [];
      currentStoreRows.value = [];
      return;
    }
    const list = Array.isArray(payload.List) ? payload.List : [];
    const rows = list.map((row) => normalizeRow(row));
    storeRows.value = rows;
    storeOrigin.value = rows.map((row) => ({ ...row }));
    currentStoreRows.value = rows.map((row) => ({ ...row }));
  } catch (error) {
    storeRows.value = [];
    storeOrigin.value = [];
    currentStoreRows.value = [];
    warn("매장 조회에 실패했습니다.");
  } finally {
    store.state.loading = false;
  }
};

const updatedStoreRows = (rows) => {
  if (Array.isArray(rows)) {
    currentStoreRows.value = rows.map((row) => ({ ...row }));
  }
};

const adminCodeChanged = (row, fieldName, rowIndex, oldValue, newValue) => {
  if (fieldName !== "lngAdminCode") {
    return;
  }
  const group = row?.lngStoreGroup;
  if (group == null || group === "") {
    return;
  }
  const source = currentStoreRows.value.length ? currentStoreRows.value : storeRows.value;
  const next = source.map((item) =>
    String(item.lngStoreGroup) === String(group) ? { ...item, lngAdminCode: newValue } : { ...item }
  );
  storeRows.value = next;
  currentStoreRows.value = next.map((item) => ({ ...item }));
};

const changedStoreRows = () => {
  const current = currentStoreRows.value.length ? currentStoreRows.value : storeRows.value;
  return current.filter((row, index) => {
    return JSON.stringify(row) !== JSON.stringify(storeOrigin.value[index] || {});
  });
};

const saveStoreButton = async () => {
  const rows = changedStoreRows();
  if (!rows.length) {
    warn("저장할 내용이 없습니다.");
    return;
  }
  store.state.loading = true;
  try {
    const res = await saveMst90StoreInfo(sessionValue("lngStoreGroup"), sessionValue("lngSequence"), rows);
    const payload = readPayload(res?.data);
    if (!showResult(payload, "저장에 실패했습니다.")) {
      return;
    }
    await searchStoreButton();
    Swal.fire({
      title: "확인",
      text: "저장되었습니다.",
      icon: "success",
      confirmButtonText: "확인",
    });
  } catch (error) {
    warn("저장에 실패했습니다.");
  } finally {
    store.state.loading = false;
  }
};

const excelButton = () => {
  documentSubTitle.value = "";
  exportExcel.value = !exportExcel.value;
};

const excelStoreButton = () => {
  exportStoreExcel.value = !exportStoreExcel.value;
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

.rpt-tilde {
  font-weight: 700;
  color: #374151;
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

.register-pop {
  position: absolute;
  z-index: 30;
  left: 1rem;
  right: 1rem;
  top: 4.5rem;
  padding: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background: #fff;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.register-title {
  font-size: 1.05rem;
  font-weight: 700;
}
</style>
