<!-- /*--############################################################################
# Filename : MST44_050RPT.vue
# Description : 마스터관리 > POS 마스터 > 최종버전현황
# Date :2026-10-07
# Author : 권지안
################################################################################*/ -->
<template>
  <div class="h-[80%]" @click="handleParentClick">
    <div class="flex shrink-0 justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center mr-9 space-x-2 pr-5">
        <button class="button search md:w-auto w-14" @click="searchButton">조회</button>
        <button class="button save w-auto excel" @click="excelButton">엑셀</button>
      </div>
    </div>

    <div class="bg-gray-200 rounded-lg z-10 mt-3 px-5 py-3">
      <div class="flex items-center gap-3 min-w-0 ml-10">
        <span class="rpt-label">일자</span>
        <div class="rpt-date">
          <Datepicker2
            ref="datepicker"
            omit-main-label
            filter-bar-align
            :mainName="'일자'"
            :initToday="1"
            :closePopUp="closePopUp"
            @startDate="startDate"
            @endDate="endDate"
            @excelDate="excelDate" />
        </div>
        <!-- <span class="rpt-check" @click.stop>
          <input id="mst44050-date-ignore" v-model="cond.dateIgnore" type="checkbox" />
          <label for="mst44050-date-ignore">기간무시</label>
        </span> -->
      </div>
      <div class="flex items-center gap-3 mt-2 min-w-0 ml-10">
        <span class="rpt-label">매장그룹검색</span>
        <input
          type="text"
          class="rpt-input w-40"
          v-model="cond.storeGroup"
          @keydown.enter="searchButton" />
        <span class="rpt-label rpt-label-gap">매장검색</span>
        <input
          type="text"
          class="rpt-input w-40"
          v-model="cond.storeName"
          @keydown.enter="searchButton" />
        <span class="rpt-label rpt-label-gap">지역코드</span>
        <input
          type="text"
          class="rpt-input w-40"
          v-model="cond.areaCode"
          @keydown.enter="searchButton" />
        <span class="rpt-label rpt-label-gap">포스번호</span>
        <input
          type="text"
          class="rpt-input w-40"
          v-model="cond.posNo"
          @keydown.enter="searchButton" />
      </div>
    </div>

    <div class="h-[68vh] min-h-[420px] mt-3">
      <Realgrid
        :progname="'MST44_050RPT'"
        :progid="1"
        :rowData="rowData"
        :setStateBar="false"
        :rowStateeditable="false"
        :selectionStyle="'singleRow'"
        :exporttoExcel="exportExcel"
        :documentTitle="'MST44_050RPT'"
        :documentSubTitle="documentSubTitle">
      </Realgrid>
    </div>
  </div>
</template>

<script setup>
import { getPosLastVersion } from "@/api/master";
import Datepicker2 from "@/components/Datepicker2.vue";
import PageName from "@/components/pageName.vue";
import Realgrid from "@/components/realgrid.vue";
import { insertPageLog } from "@/customFunc/customFunc";
import Swal from "sweetalert2";
import { onMounted, reactive, ref } from "vue";
import { useStore } from "vuex";

const store = useStore();
const rowData = ref([]);
const exportExcel = ref(false);
const documentSubTitle = ref("");
const selectedExcelDate = ref("");
const datepicker = ref(null);
const closePopUp = ref(false);

const today = () => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
};

const cond = reactive({
  fromDate: today(),
  toDate: today(),
  dateIgnore: false,
  storeGroup: "",
  storeName: "",
  areaCode: "",
  posNo: "",
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
  const pad = (n) => String(n).padStart(2, "0");
  const asDateTime = (date) =>
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  const microsoft = text.match(/^\/Date\((-?\d+)\)\/$/);
  const parsed = microsoft ? new Date(Number(microsoft[1])) : null;
  if (parsed && !Number.isNaN(parsed.getTime())) {
    return asDateTime(parsed);
  }
  const matched = text.match(
    /^(\d{4})[-/.]?(\d{2})[-/.]?(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?/
  );
  if (!matched) {
    return null;
  }
  const date = `${matched[1]}-${matched[2]}-${matched[3]}`;
  if (!matched[4]) {
    return date;
  }
  return `${date} ${matched[4]}:${matched[5]}:${matched[6] || "00"}`;
};

const normalizeRowDates = (row) => {
  const next = { ...row };
  Object.keys(next).forEach((key) => {
    const value = next[key];
    const microsoft =
      typeof value === "string" && /^\/Date\((-?\d+)\)\/$/.test(String(value).trim());
    if (!microsoft && !/dtm|date/i.test(key)) {
      return;
    }
    next[key] = formatGridDate(value);
  });
  return next;
};

onMounted(async () => {
  await insertPageLog(store.state.activeTab2);
});

const startDate = (value) => {
  cond.fromDate = value || "";
};

const endDate = (value) => {
  cond.toDate = value || "";
};

const excelDate = (value) => {
  selectedExcelDate.value = value || "";
};

const handleParentClick = (event) => {
  const datepickerEl = datepicker.value?.$el;
  if (datepickerEl && datepickerEl.contains(event.target)) {
    return;
  }
  closePopUp.value = !closePopUp.value;
};

const searchButton = async () => {
  store.state.loading = true;
  try {
    const res = await getPosLastVersion(
      cond.storeGroup,
      cond.storeName,
      cond.areaCode,
      cond.posNo,
      cond.fromDate,
      cond.toDate,
      "0"
    );
    const payload = readPayload(res?.data);
    if (payload.RESULT_CD && String(payload.RESULT_CD) !== "00") {
      rowData.value = [];
      Swal.fire({
        title: "경고",
        text: payload.RESULT_NM || "최종버전현황 조회에 실패했습니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }
    const list = Array.isArray(payload.List) ? payload.List : [];
    rowData.value = list.map((row) => normalizeRowDates(row));
  } catch (error) {
    rowData.value = [];
    Swal.fire({
      title: "경고",
      text: "최종버전현황 조회에 실패했습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
  } finally {
    store.state.loading = false;
  }
};

const excelButton = () => {
  documentSubTitle.value = selectedExcelDate.value;
  exportExcel.value = !exportExcel.value;
};
</script>

<style scoped>
.rpt-label {
  width: 6.5rem;
  flex-shrink: 0;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1;
  color: #374151;
  white-space: nowrap;
}

.rpt-label-gap {
  width: 4.25rem;
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
}

.rpt-check input,
.rpt-check label {
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

.rpt-date {
  flex-shrink: 0;
}

.rpt-date :deep(> div) {
  margin: 0 !important;
  width: auto !important;
  max-width: 100%;
}
</style>
