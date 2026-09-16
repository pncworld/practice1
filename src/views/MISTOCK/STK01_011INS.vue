<!-- /*--############################################################################
# Filename : STK01_011INS.vue                                                  
# Description : 자재관리 > 청구 관리 > 청구 등록               
# Date :2025-09-25                                                            
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <div
    class="stk011-page box-border flex h-full max-w-full min-h-0 flex-col gap-3 overflow-hidden pb-1"
    @click="handleParentClick">
    <div
      class="flex shrink-0 flex-wrap items-center justify-between gap-3 overflow-y-hidden">
      <PageName></PageName>
      <div class="flex flex-wrap items-center justify-end gap-2 pr-5 mr-9">
        <button @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <button
          @click="addButton"
          class="button new md:w-auto w-14 disabled:bg-opacity-50"
          :disabled="limitStore == '2'">
          신규
        </button>
        <button @click="deleteButton" class="button delete md:w-auto w-14">
          삭제
        </button>
        <button @click="excelButton" class="button excel">엑셀</button>
      </div>
    </div>

    <div
      class="z-10 w-full min-w-0 shrink-0 overflow-x-auto rounded-lg bg-gray-200 px-12 py-4">
      <div class="stk011-search-grid min-w-0">
        <div class="stk011-cell">
          <span class="stk011-sg-label">청구일자</span>
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
        </div>
        <div class="stk011-cell">
          <span class="stk011-sg-label">청구매장</span>
          <div class="stk011-cell-field min-w-0">
            <select
              id="stk01-011-store"
              class="stk011-control"
              v-model="cond">
              <option
                v-for="i in optionList"
                :key="i.lngStoreCode"
                :value="i.lngStoreCode">
                {{ i.strName }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div class="min-h-0 min-w-0 w-full flex-1 px-4 pb-2 lg:px-6">
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
        :exporttoExcel="exportExcel">
      </Realgrid>
    </div>
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
            :disabled="limitStore == '2'"
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
          <select id="stk01-011-popup-store" disabled v-model="scond2" class="stk011-control">
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
          :CalculateTaxColId4="'curTax'"
          :CalculateSumColId2="'curSupply'"
          :documentSubTitle="documentSubTitle2"
          :exporttoExcel="exporttoExcel2"
          :setStateBar="false"></Realgrid>
      </div>

      <div class="stk011-comment">
        <div class="stk011-form-label">코멘트</div>
        <textarea
          v-model="scond4"
          :disabled="disabled2"
          class="stk011-comment-field"></textarea>
      </div>
    </div>
  </div>
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
  updateDemandMaster,
} from "@/api/mistock";
import PageName from "@/components/pageName.vue";
import Realgrid from "@/components/realgrid.vue";
import {
  formatLocalDate,
  insertPageLog,
  formatDateTime2,
} from "@/customFunc/customFunc";
import { onMounted, ref } from "vue";

import Datepicker2 from "@/components/Datepicker2.vue";
import Swal from "sweetalert2";
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

const limitStore = ref("0");
onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getDemandStoreList(store.state.userData.lngStoreGroup, 0);

  optionList.value = res.data.List;

  if (res.data.List.length > 0) {
    cond.value = res.data.List[0].lngStoreCode;
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
const disabled2 = ref(false);
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
const saveButton = async () => {
  if (disabled.value == true) {
    try {
      store.state.loading = true;

      const res = await updateDemandMaster(
        store.state.userData.lngStoreGroup,
        scond2.value,
        scond.value.replaceAll("-", ""),
        scond3.value,
        scond4.value,
        tempdtmEndDate.value + ":00"
      );

      store.state.loading = false;
      if (res.data.RESULT_CD == "00") {
        await Swal.fire({
          title: "성공",
          text: "청구등록이 저장 되었습니다.",
          icon: "success",
          confirmButtonText: "확인",
        });
        openPopUp.value = false;
      } else {
        await Swal.fire({
          title: "경고",
          text: `${res.data.RESULT_NM}`,
          icon: "warning",
          confirmButtonText: "확인",
        });
      }
    } catch (error) {
    } finally {
      open.value = false;
      searchButton();
    }
  } else {
    try {
      const ddate = updatedrowdata2.value
        .map((item) => item.dtmEndDate.split(" ")[0].replaceAll("-", ""))
        .join("\u200b");
      const edate = updatedrowdata2.value
        .map((item) =>
          formatLocalDate(item.dtmPreExpectedDate).replaceAll("-", "")
        )
        .join("\u200b");
      const lngstocks = updatedrowdata2.value
        .map((item) => item.lngStockID)
        .join("\u200b");
      const qtys = updatedrowdata2.value
        .map((item) => item.dblDemandQty)
        .join("\u200b");
      store.state.loading = true;

      const res = await InsertDemandMasterDetail(
        store.state.userData.lngStoreGroup,
        scond2.value,
        scond.value.replaceAll("-", ""),
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
      console.log(res);
      store.state.loading = false;
      if (res.data.RESULT_CD == "00") {
        await Swal.fire({
          title: "성공",
          text: "신규 청구등록이 저장 되었습니다.",
          icon: "success",
          confirmButtonText: "확인",
        });
        openPopUp.value = false;
      } else {
        await Swal.fire({
          title: "경고",
          text: "신규  청구등록 저장을 실패하였습니다.",
          icon: "warning",
          confirmButtonText: "확인",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      open.value = false;
      searchButton();
    }
  }
};

const searchButton = async () => {
  try {
    store.state.loading = true;
    const res = await getStockDemandList2(
      store.state.userData.lngStoreGroup,
      cond.value,
      store.state.userData.strLanguage,
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

const rowData2 = ref([]);
const scond4 = ref("");

const editableColId = ref("");
const tempdtmEndDate = ref("");
const dblclickedRowData = async (e) => {
  console.log(e);
  //   console.log(tempColID.value);

  editableColId.value = "";
  if (tempColID.value == "strStoreName" || tempColID.value == "strDemandNo") {
    disabled.value = true;
    scond.value =
      e[3].slice(0, 4) + "-" + e[3].slice(4, 6) + "-" + e[3].slice(6, 8);
    scond2.value = e[11];
    scond3.value = e[2];

    try {
      store.state.loading = true;
      const res = await getStockDetail2(
        store.state.userData.lngStoreGroup,
        e[11],
        store.state.userData.strLanguage,
        e[2],
        e[3]
      );

      console.log(res);

      store.state.loading = false;
      rowData2.value = res.data.List;
      scond4.value = res.data.List2[0].strComments;

      disabled2.value =
        new Date(formatDateTime2(new Date()).slice(0, 16)) >
        new Date(rowData2.value[0].dtmEndDate);

      tempdtmEndDate.value = rowData2.value[0].dtmEndDate;
    } catch (error) {}
    open.value = true;
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
  disabled.value = false;

  scond.value = formatLocalDate(new Date());
  scond2.value = cond.value;
  scond3.value = "";
  editableColId.value = "dblDemandQty";
  rowData2.value = [];

  try {
    store.state.loading = true;
    const res = await getStockDetail2(
      store.state.userData.lngStoreGroup,
      cond.value,
      store.state.userData.strLanguage,
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
    const res = await getStockDetail2(
      store.state.userData.lngStoreGroup,
      cond.value,
      store.state.userData.strLanguage,
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
  --stk011-label-col: 6.5rem;
  --stk011-item-gap: 0.75rem;
  --stk011-control-border: #cbd5e1;
  --stk011-control-focus-border: #3b82f6;
  --stk011-control-h: 2rem;
  --stk011-control-radius: 0.375rem;
}

.stk011-search-grid {
  display: flex;
  width: 100%;
  min-width: 0;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.25rem 1.75rem;
}

.stk011-cell {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: var(--stk011-item-gap);
}

.stk011-search-grid .stk011-cell:first-child {
  flex: 0 1 auto;
}

.stk011-search-grid .stk011-cell:last-child {
  flex: 0 1 20rem;
  max-width: 22rem;
}

.stk011-sg-label {
  flex: 0 0 var(--stk011-label-col);
  width: var(--stk011-label-col);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
}

.stk011-cell-field {
  min-width: 0;
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  width: 100%;
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
  margin: 0 !important;
  width: auto !important;
  max-width: 100%;
}

.stk011-date-slot :deep(input[type="date"]) {
  box-sizing: border-box;
  height: 2rem;
  min-height: 2rem;
  border: 1px solid var(--stk011-control-border) !important;
  border-radius: 0.375rem;
  background: #fff;
}

.stk011-date-slot :deep(input[type="date"]:focus) {
  border-color: var(--stk011-control-focus-border) !important;
  outline: none;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.25);
}

.stk011-popup {
  --stk011-control-border: #cbd5e1;
  --stk011-control-focus-border: #3b82f6;
  --stk011-control-h: 2rem;
  --stk011-control-radius: 0.375rem;
  display: flex;
  flex-direction: column;
  width: min(56rem, 92vw);
  height: min(44rem, 88vh);
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
</style>
