<!-- /*--############################################################################
# Filename : PUR01_032INS.vue
# Description : 구매관리II > 발주 관리 > 발주마감관리 II
# Date :2025-09-25
# Author : 권맑음
################################################################################*/ -->
<template>
  <!-- pl-5: 셸 w-right가 pl0이라 그리드가 좌측 메뉴에 붙음 → 우측 pd20과 맞춤 -->
  <div class="flex h-full min-h-0 flex-col pl-5">
    <div class="flex shrink-0 justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center space-x-2 pr-5">
        <button type="button" @click="saveButton" class="button save md:w-auto w-14">
          저장
        </button>
        <button type="button" @click="excelButton" class="button excel">엑셀</button>
      </div>
    </div>

    <div
      class="pur032-search-panel z-10 mt-3 w-full min-h-0 shrink-0 rounded-lg bg-gray-200"
      :style="{
        '--pur032-control-border': pur032ControlBorder,
        '--pur032-col-gutter': pur032ColGutter,
        '--pur032-row-gap': pur032RowGap,
        '--pur032-label-col': pur032LabelCol,
        '--pur032-row-min-h': pur032RowMinH,
        '--pur032-control-h': pur032ControlH,
      }">
      <div class="pur032-wire-grid min-w-0">
        <div class="pur032-wire-cell">
          <div class="pur032-wire-label">지역</div>
          <div class="pur032-wire-field min-w-0">
            <select
              id="pur01-032-area"
              class="pur032-sg-select"
              v-model="cond"
              @change="setStoreArea">
              <option
                v-for="i in optionList"
                :key="String(i.lngCode)"
                :value="i.lngCode">
                {{ i.strName }}
              </option>
            </select>
          </div>
        </div>

        <div class="pur032-wire-cell pur032-wire-cell--span2 min-w-0">
          <div class="pur032-wire-label">입고예정일</div>
          <div class="pur032-wire-field pur032-close-row min-w-0">
            <div class="pur032-close-item">
              <input
                id="pur01-032-pre-date"
                type="text"
                class="pur032-sg-input"
                inputmode="numeric"
                pattern="[0-9]*"
                lang="en"
                autocomplete="off"
                :value="cond2"
                @keydown="digitsPre.onKeydown"
                @beforeinput="digitsPre.onBeforeInput"
                @paste="digitsPre.onPaste"
                @compositionstart="digitsPre.onCompositionStart"
                @compositionupdate="digitsPre.onCompositionUpdate"
                @compositionend="digitsPre.onCompositionEnd"
                @input="digitsPre.onInput" />
              <span class="pur032-close-unit">일전</span>
            </div>
            <div class="pur032-close-item">
              <input
                id="pur01-032-hour"
                type="text"
                class="pur032-sg-input"
                inputmode="numeric"
                pattern="[0-9]*"
                lang="en"
                autocomplete="off"
                :value="cond3"
                @keydown="digitsHour.onKeydown"
                @beforeinput="digitsHour.onBeforeInput"
                @paste="digitsHour.onPaste"
                @compositionstart="digitsHour.onCompositionStart"
                @compositionupdate="digitsHour.onCompositionUpdate"
                @compositionend="digitsHour.onCompositionEnd"
                @input="digitsHour.onInput" />
              <span class="pur032-close-unit">시</span>
            </div>
            <div class="pur032-close-item">
              <input
                id="pur01-032-min"
                type="text"
                class="pur032-sg-input"
                inputmode="numeric"
                pattern="[0-9]*"
                lang="en"
                autocomplete="off"
                :value="cond4"
                @keydown="digitsMin.onKeydown"
                @beforeinput="digitsMin.onBeforeInput"
                @paste="digitsMin.onPaste"
                @compositionstart="digitsMin.onCompositionStart"
                @compositionupdate="digitsMin.onCompositionUpdate"
                @compositionend="digitsMin.onCompositionEnd"
                @input="digitsMin.onInput" />
              <span class="pur032-close-unit">분</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-2 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <Realgrid
        class="pur032-grid-body min-h-0 w-full flex-1"
        :progname="'PUR01_032INS_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :documentTitle="'PUR01_032INS'"
        @updatedRowData="updatedRowData"
        :checkRenderEditable="true"
        :checkRowAuto="false"
        :checkRowAuto2="true"
        :checkRowAuto2Col="'Selected'"
        :documentSubTitle="documentSubTitle"
        :rowStateeditable="false"
        :fixedColumn="true"
        :exporttoExcel="exportExcel" />
    </div>
  </div>
</template>

<script setup>
import { getOrderCloseTime, getOrderAuditList, setOrderCloseAndAuditList } from "@/api/mipur";
import { getStoreArea } from "@/api/misales";
import PageName from "@/components/pageName.vue";
import Realgrid from "@/components/realgrid.vue";
import { insertPageLog } from "@/customFunc/customFunc";
import { makeDigitsOnlyHandlers } from "@/utils/inputRestrict";
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
import Swal from "sweetalert2";

const pur032ControlBorder = "#cbd5e1";
const pur032ColGutter = "1.25rem";
const pur032RowGap = "0.75rem";
const pur032LabelCol = "5.75rem";
const pur032RowMinH = "2rem";
const pur032ControlH = "2rem";

const optionList = ref([]);
const reload = ref(false);
const rowData = ref([]);

const cond = ref("10");
const cond2 = ref("");
const cond3 = ref("");
const cond4 = ref("");

const digitsPre = makeDigitsOnlyHandlers({
  setValue: (v) => {
    cond2.value = v;
  },
});
const digitsHour = makeDigitsOnlyHandlers({
  setValue: (v) => {
    cond3.value = v;
  },
});
const digitsMin = makeDigitsOnlyHandlers({
  setValue: (v) => {
    cond4.value = v;
  },
});

const store = useStore();

onMounted(async () => {
  await insertPageLog(store.state.activeTab2);

  const res = await getStoreArea(store.state.userData.lngStoreGroup, 0);

  optionList.value = res.data.List;
  if (optionList.value.length > 0) {
    cond.value = optionList.value[0].lngCode;
  }

  const res2 = await getOrderCloseTime(
    store.state.userData.lngStoreGroup,
    cond.value
  );

  if (res2?.data?.List?.[0]) {
    cond2.value = res2.data.List[0].pre_date;
    cond3.value = res2.data.List[0].dtmClosehour;
    cond4.value = res2.data.List[0].dtmCloseMin;
  }

  const res3 = await getOrderAuditList(store.state.userData.lngStoreGroup);
  rowData.value = res3.data.List;
});

const exportExcel = ref(false);
const documentSubTitle = ref("");
const selectedExcelDate = ref("");
const selectedExcelStore = ref("");

const excelButton = () => {
  documentSubTitle.value =
    selectedExcelDate.value + "\n" + selectedExcelStore.value;
  exportExcel.value = !exportExcel.value;
};

const setStoreArea = async () => {
  const res2 = await getOrderCloseTime(
    store.state.userData.lngStoreGroup,
    cond.value
  );

  if (res2?.data?.List?.length > 0) {
    cond2.value = res2.data.List[0].pre_date;
    cond3.value = res2.data.List[0].dtmClosehour;
    cond4.value = res2.data.List[0].dtmCloseMin;
  }
};

const updatedrowdata = ref([]);
const updatedRowData = (e) => {
  updatedrowdata.value = e;
};

const saveButton = async () => {
  try {
    const storecds = updatedrowdata.value
      .map((item) => item.lngStoreCode)
      .join("\u200b");
    const permissions = updatedrowdata.value
      .map((item) => (item.Selected == true ? "1" : "0"))
      .join("\u200b");
    const res = await setOrderCloseAndAuditList(
      store.state.userData.lngStoreGroup,
      cond.value,
      String(cond3.value).padStart(2, "0"),
      String(cond4.value).padStart(2, "0"),
      cond2.value,
      storecds,
      permissions
    );
    if (res.data.RESULT_CD == "00") {
      await Swal.fire({
        title: "성공",
        text: "발주마감 관리가 저장 되었습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
    } else {
      await Swal.fire({
        title: "경고",
        text: "발주마감 저장을 실패하였습니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
    }
  } catch (error) {
  } finally {
    const res3 = await getOrderAuditList(store.state.userData.lngStoreGroup);
    rowData.value = res3.data.List;
  }
};
</script>

<style scoped>
.pur032-search-panel {
  --pur032-panel-pad-x: 2rem;
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  padding-left: 0;
  padding-right: 0;
  padding-block: 0.75rem;
  overflow-x: auto;
}

@media (min-width: 640px) {
  .pur032-search-panel {
    --pur032-panel-pad-x: 2.5rem;
  }
}

@media (min-width: 768px) {
  .pur032-search-panel {
    --pur032-panel-pad-x: 3rem;
  }
}

@media (min-width: 1024px) {
  .pur032-search-panel {
    --pur032-panel-pad-x: 3.5rem;
  }
}

.pur032-wire-grid {
  display: grid;
  width: max(100%, max-content);
  min-width: 100%;
  box-sizing: border-box;
  padding-left: var(--pur032-panel-pad-x);
  padding-right: var(--pur032-panel-pad-x);
  align-items: center;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  column-gap: var(--pur032-col-gutter);
  row-gap: var(--pur032-row-gap);
}

.pur032-wire-cell {
  display: flex;
  min-width: 0;
  min-height: var(--pur032-row-min-h);
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}

.pur032-wire-cell--span2 {
  grid-column: span 2;
}

.pur032-wire-label {
  flex: 0 0 var(--pur032-label-col);
  width: var(--pur032-label-col);
  min-width: 0;
  max-width: var(--pur032-label-col);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: var(--pur032-row-min-h);
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pur032-wire-field {
  display: flex;
  min-width: 0;
  max-width: 100%;
  flex: 1 1 auto;
  align-items: center;
  min-height: var(--pur032-row-min-h);
}

.pur032-wire-field:not(.pur032-close-row) > * {
  min-width: 0;
  width: 100%;
}

.pur032-close-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem 1rem;
  min-width: 0;
  max-width: 100%;
}

.pur032-close-item {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  min-width: 0;
}

.pur032-close-item .pur032-sg-input {
  width: 4.5rem;
  flex: 0 0 4.5rem;
}

.pur032-close-unit {
  flex-shrink: 0;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.25;
  color: rgb(55 65 81);
  white-space: nowrap;
}

.pur032-sg-select,
.pur032-sg-input {
  box-sizing: border-box;
  height: var(--pur032-control-h);
  min-height: var(--pur032-control-h);
  max-height: var(--pur032-control-h);
  width: 100%;
  min-width: 0;
  padding: 0 0.375rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: rgb(55 65 81);
  background: #fff;
  border: 1px solid var(--pur032-control-border);
  border-radius: 0.375rem;
}

.pur032-sg-select:focus,
.pur032-sg-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.2);
}

.pur032-grid-body {
  min-height: 12rem;
}
</style>
