<!-- /*--############################################################################
# Filename : STK01_011INS.vue                                                  
# Description : 자재관리 > 청구 관리 > 청구 등록               
# Date :2025-09-25                                                            
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <div class="stk011-page" @click="handleParentClick">
    <header class="stk011-top">
      <div class="stk011-top-copy">
        <p class="stk011-kicker">자재 청구</p>
        <h1>청구 등록</h1>
        <p class="stk011-lead">조회 후 청구번호를 더블클릭하면 상세가 열립니다.</p>
      </div>
      <div class="stk011-actions">
        <button type="button" class="stk011-btn stk011-btn--primary" @click="searchButton">
          조회
        </button>
        <button type="button" class="stk011-btn stk011-btn--dark" @click="addButton">
          신규
        </button>
        <button type="button" class="stk011-btn stk011-btn--ghost" @click="deleteButton">
          삭제
        </button>
        <button type="button" class="stk011-btn stk011-btn--ghost" @click="excelButton">
          엑셀
        </button>
      </div>
    </header>

    <section class="stk011-filter">
      <span class="stk011-field-label">청구일자</span>
      <div class="stk011-date-slot">
        <Datepicker2
          ref="datepicker"
          omit-main-label
          filter-bar-align
          :mainName="'청구일자'"
          :initToday="1"
          :closePopUp="closePopUp"
          @endDate="endDate"
          @startDate="startDate" />
      </div>
      <span class="stk011-field-label">청구매장</span>
      <select
        id="stk01-011-pos-store"
        class="stk011-control stk011-filter-control"
        v-model="cond"
        disabled>
        <option
          v-for="i in optionList"
          :key="i.lngStoreCode"
          :value="i.lngStoreCode">
          {{ i.strName }}
        </option>
      </select>
    </section>

    <section class="stk011-grid-card">
      <div class="stk011-grid-head">
        <strong>청구 목록</strong>
        <span>청구번호 더블클릭 시 상세 열림</span>
      </div>
      <div class="stk011-grid-body">
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
          :highlightColId="'strStoreName,strDemandNo'"
          :exporttoExcel="exportExcel">
        </Realgrid>
      </div>
    </section>
  </div>

  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    v-if="open">
    <div class="stk011-popup">
      <div class="stk011-popup-head">
        <h2 class="text-xl font-bold tracking-tight text-gray-900">청구 등록</h2>
        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            class="whitebutton"
            :disabled="!canEditDemand"
            @click="saveButton">
            저장
          </button>
          <button type="button" class="whitebutton" @click="excelButton2">
            엑셀
          </button>
          <button type="button" class="whitebutton" @click="open = false">
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
          <select
            id="stk01-011-pos-popup-store"
            disabled
            v-model="scond2"
            class="stk011-control">
            <option
              v-for="i in optionList"
              :key="'p-' + i.lngStoreCode"
              :value="i.lngStoreCode">
              {{ i.strName }}
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
          :setStateBar="false"></Realgrid>
      </div>

      <div class="stk011-comment">
        <div class="stk011-form-label">코멘트</div>
        <textarea v-model="scond4" class="stk011-comment-field"></textarea>
      </div>
    </div>
  </div>
</template>

<script setup>
import Realgrid from "@/components/realgrid.vue";
import { formatLocalDate, insertPageLog2 } from "@/customFunc/customFunc";
import { onMounted, ref } from "vue";

import {
  deleteDemandMaster2,
  getDemandStoreList2,
  getDemCloseTime2,
  getStockDemandList22,
  getStockDetail22,
  InsertDemandMasterDetail2,
  UpdateDemandMasterDetail2,
} from "@/api/vuepos";
import Datepicker2 from "@/components/Datepicker2.vue";
import Swal from "sweetalert2";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

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

const route = useRoute();

const path = ref("");
const lngStoreGroup = ref("");
const lngStoreCode = ref("");
const lngOperator = ref("");
onMounted(async () => {
  path.value = route.path.split("/")[2];
  lngStoreGroup.value = route.query.lngStoreGroup;
  lngStoreCode.value = route.query.lngStoreCode;
  lngOperator.value = route.query.lngOperator;
  const pageLog = await insertPageLog2(
    path.value,
    lngStoreGroup.value,
    lngStoreCode.value,
    lngOperator.value
  );
  const res = await getDemandStoreList2(lngStoreGroup.value, 0);
  const list = res.data.List || [];
  const currentStore = list.filter(
    (item) => String(item.lngStoreCode) === String(lngStoreCode.value)
  );

  optionList.value = currentStore;
  cond.value =
    currentStore.length > 0
      ? currentStore[0].lngStoreCode
      : lngStoreCode.value;
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
  const res2 = await getDemCloseTime2(
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
const saveButton = async () => {
  if (!canEditDemand.value) {
    return;
  }
  const isExistingDemand = String(scond3.value || "").trim() !== "";
  try {
    store.state.loading = true;
    const saveRows = isExistingDemand
      ? (updatedrowdata2.value || []).filter(
          (item) => Number(item.dblDemandQty) > 0
        )
      : updatedrowdata2.value || [];
    const ddate = saveRows
      .map((item) => item.dtmEndDate.split(" ")[0].replaceAll("-", ""))
      .join("\u200b");
    const edate = saveRows
      .map((item) =>
        formatLocalDate(item.dtmPreExpectedDate).replaceAll("-", "")
      )
      .join("\u200b");
    const lngstocks = saveRows.map((item) => item.lngStockID).join("\u200b");
    const qtys = saveRows.map((item) => item.dblDemandQty).join("\u200b");

    const demandDate = scond.value.replaceAll("-", "");
    const res = isExistingDemand
      ? await UpdateDemandMasterDetail2(
          lngStoreGroup.value,
          scond2.value,
          demandDate,
          scond3.value,
          scond4.value,
          1,
          ddate,
          edate,
          lngstocks,
          qtys,
          lngOperator.value,
          0,
          "",
          ""
        )
      : await InsertDemandMasterDetail2(
          lngStoreGroup.value,
          scond2.value,
          demandDate,
          scond4.value,
          1,
          ddate,
          edate,
          lngstocks,
          qtys,
          lngOperator.value,
          0,
          "",
          ""
        );

    console.log(res);

    store.state.loading = false;
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
    console.log(error);
    store.state.loading = false;
    await Swal.fire({
      title: "경고",
      text: "청구등록 저장을 실패하였습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
  } finally {
    open.value = false;
    searchButton();
  }
};

const searchButton = async () => {
  try {
    store.state.loading = true;
    const res = await getStockDemandList22(
      lngStoreGroup.value,
      cond.value,
      "01",
      sdate.value.replaceAll("-", ""),
      edate.value.replaceAll("-", "")
    );

    console.log(res);

    store.state.loading = false;
    rowData.value = res.data.List;
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
  tempColID.value = e;
};

const clickedrowdata = ref("");

const open = ref(false);
const disabled = ref(false);
const canEditDemand = ref(false);

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

const parseDemandDate = (raw) => {
  const value = String(raw ?? "").replaceAll("-", "");
  if (value.length < 8) return "";
  return (
    value.slice(0, 4) + "-" + value.slice(4, 6) + "-" + value.slice(6, 8)
  );
};

const rowData2 = ref([]);
const scond4 = ref("");

const editableColId = ref("");
const dblclickedRowData = async (e) => {
  editableColId.value = "";
  if (tempColID.value == "strStoreName" || tempColID.value == "strDemandNo") {
    const unissued =
      isUnissuedDemand(e) ||
      isUnissuedDemand(
        (rowData.value || []).find(
          (row) =>
            String(row.strDemandNo ?? "") ===
            String(e.strDemandNo ?? e[2] ?? "")
        )
      );
    disabled.value = true;
    canEditDemand.value = unissued;
    editableColId.value = unissued ? "dblDemandQty" : "";
    scond.value = parseDemandDate(e.dtmDemandDate ?? e[3]);
    scond2.value = e.lngStoreCode ?? e[11];
    scond3.value = e.strDemandNo ?? e[2];

    try {
      store.state.loading = true;
      const res = await getStockDetail22(
        lngStoreGroup.value,
        scond2.value,
        "01",
        scond3.value,
        String(e.dtmDemandDate ?? e[3] ?? "").replaceAll("-", "")
      );

      console.log(res);

      store.state.loading = false;
      rowData2.value = res.data.List;
      scond4.value = res.data.List2[0].strComments;
    } catch (error) {}
    open.value = true;
  }
};

const scond = ref("");
const scond2 = ref("");
const scond3 = ref("");

const exporttoExcel2 = ref(false);
const excelButton2 = () => {
  const storeNm =
    optionList.value.filter((item) => item.lngStoreCode == scond2.value)[0]
      ?.strName || "";
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
  disabled.value = false;
  canEditDemand.value = true;

  scond.value = formatLocalDate(new Date());
  scond2.value = cond.value;
  scond3.value = "";
  editableColId.value = "dblDemandQty";
  rowData2.value = [];

  try {
    store.state.loading = true;
    const res = await getStockDetail22(
      lngStoreGroup.value,
      cond.value,
      lngOperator.value,
      "",
      formatLocalDate(new Date()).replaceAll("-", "")
    );

    //console.log(res);

    store.state.loading = false;
    rowData2.value = res.data.List;

    scond4.value = "";
  } catch (error) {}
  open.value = true;
};

const updatedrowdata2 = ref([]);
const updatedRowData2 = (e) => {
  console.log(e);
  updatedrowdata2.value = e;
};

const searchButton2 = async (e) => {
  rowData2.value = [];

  try {
    store.state.loading = true;
    const res = await getStockDetail22(
      lngStoreGroup.value,
      cond.value,
      "01",
      "",
      String(e.target.value).replaceAll("-", "")
    );

    console.log(res);

    store.state.loading = false;
    rowData2.value = res.data.List;
    scond4.value = res.data.List2[0].strComments;
  } catch (error) {}
};

const deleteButton = async () => {
  const filtered = updatedrowdata.value.filter((item) => item.Selected == true);

  if (filtered.length == 0) {
    Swal.fire({
      title: "경고",
      text: "삭제할 청구 사항을 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
  }

  try {
    const storecds = filtered.map((item) => item.lngStoreCode).join("\u200b");
    const demandnos = filtered.map((item) => item.strDemandNo).join("\u200b");
    const demanddates = filtered
      .map((item) => item.dtmDemandDate)
      .join("\u200b");

    const res = await deleteDemandMaster2(
      lngStoreGroup.value,
      storecds,
      demandnos,
      demanddates,
      lngOperator.value
    );

    console.log(res);

    if (res.data.RESULT_CD == "00") {
      await Swal.fire({
        title: "성공",
        text: "청구 사항이 삭제 되었습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
      openPopUp.value = false;
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
.stk011-page {
  --stk011-control-border: #d7dde6;
  --stk011-control-focus-border: #2563eb;
  --stk011-control-h: 2.25rem;
  --stk011-control-radius: 0.5rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  height: 100vh;
  max-width: 100%;
  overflow: hidden;
  padding: 1.25rem 1.5rem 1.5rem;
  background: #eef1f6;
  color: #111827;
}

.stk011-top {
  display: flex;
  flex-shrink: 0;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem 1.5rem;
  margin-bottom: 1rem;
}

.stk011-kicker {
  margin: 0 0 0.2rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #64748b;
}

.stk011-top h1 {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.15;
  color: #0f172a;
}

.stk011-lead {
  margin: 0.35rem 0 0;
  font-size: 0.875rem;
  color: #64748b;
}

.stk011-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.stk011-btn {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 4.5rem;
  height: 2.5rem;
  padding: 0 1rem;
  border-radius: 0.625rem;
  border: 1px solid transparent;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}

.stk011-btn--primary {
  background: #2563eb;
  color: #fff;
}

.stk011-btn--primary:hover {
  background: #1d4ed8;
}

.stk011-btn--dark {
  background: #111827;
  color: #fff;
}

.stk011-btn--dark:hover {
  background: #000;
}

.stk011-btn--ghost {
  background: #fff;
  border-color: #d1d5db;
  color: #374151;
}

.stk011-btn--ghost:hover {
  background: #f8fafc;
  border-color: #94a3b8;
}

.stk011-filter {
  display: grid;
  flex-shrink: 0;
  grid-template-columns: auto auto auto 16rem;
  justify-content: start;
  align-items: center;
  column-gap: 0.75rem;
  row-gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.85rem 1.15rem;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  box-shadow: 0 1px 2px rgb(15 23 42 / 0.04);
}

.stk011-field-label {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 0.15rem;
  height: 2.5rem;
  font-size: 0.8125rem;
  font-weight: 700;
  color: #475569;
  letter-spacing: 0.02em;
  white-space: nowrap;
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
  padding: 0 0.75rem;
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

.stk011-filter-control {
  height: 2.5rem;
  min-height: 2.5rem;
  max-height: 2.5rem;
}

.stk011-control:focus,
.stk011-control:focus-visible {
  border-color: var(--stk011-control-focus-border) !important;
  outline: none;
  box-shadow: 0 0 0 3px rgb(37 99 235 / 0.15);
}

.stk011-control:disabled {
  background: #f3f4f6;
  color: #6b7280;
  cursor: not-allowed;
}

.stk011-date-slot {
  min-width: 0;
  display: flex;
  align-items: center;
}

.stk011-date-slot :deep(> div.flex.justify-start.items-center) {
  margin: 0 !important;
  width: 100% !important;
  max-width: 100%;
}

.stk011-date-slot :deep(input[type="date"]) {
  box-sizing: border-box;
  height: 2.5rem !important;
  min-height: 2.5rem !important;
  width: 10.25rem;
  border: 1px solid var(--stk011-control-border) !important;
  border-radius: 0.5rem !important;
  background: #fff;
  padding-left: 0.75rem !important;
  font-size: 0.875rem;
}

.stk011-date-slot :deep(input[type="date"]:focus) {
  border-color: var(--stk011-control-focus-border) !important;
  outline: none;
  box-shadow: 0 0 0 3px rgb(37 99 235 / 0.15);
}

.stk011-date-slot :deep(.datepicker2-period-btn) {
  width: 2.5rem !important;
  height: 2.5rem !important;
  border-radius: 0.5rem !important;
  border: 1px solid var(--stk011-control-border) !important;
  background: #fff !important;
}

.stk011-grid-card {
  display: flex;
  min-height: 0;
  flex: 1 1 auto;
  flex-direction: column;
  overflow: hidden;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  box-shadow: 0 8px 24px rgb(15 23 42 / 0.06);
}

.stk011-grid-head {
  display: flex;
  flex-shrink: 0;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.85rem 1.15rem;
  border-bottom: 1px solid #eef2f7;
}

.stk011-grid-head strong {
  font-size: 0.9375rem;
  font-weight: 700;
  color: #0f172a;
}

.stk011-grid-head span {
  font-size: 0.75rem;
  color: #94a3b8;
}

.stk011-grid-body {
  min-height: 0;
  flex: 1 1 auto;
  width: 100%;
}

.stk011-popup {
  --stk011-control-border: #cbd5e1;
  --stk011-control-focus-border: #3b82f6;
  --stk011-control-h: 2rem;
  --stk011-control-radius: 0.375rem;
  display: flex;
  flex-direction: column;
  width: min(96rem, 98vw);
  height: min(48rem, 90vh);
  padding: 1.5rem;
  background: #fff;
  border-radius: 0.75rem;
  box-shadow: 0 20px 40px rgb(15 23 42 / 0.18);
}

.stk011-popup-head {
  display: flex;
  flex-shrink: 0;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
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

.stk011-popup .whitebutton:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
