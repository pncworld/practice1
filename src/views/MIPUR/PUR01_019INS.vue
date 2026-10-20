<!-- /*--############################################################################
# Filename : PUR01_019INS.vue
# Description : 구매관리2 > 발주 관리 > 발주 확인/출고
# Date :2025-09-22
# Author : 권지안
# Editor : 권맑음
################################################################################*/ -->
<template>
  <!-- pl-5: 셸 w-right가 pl0이라 그리드가 좌측 메뉴에 붙음 → 우측 pd20과 맞춤 -->
  <div class="flex h-full min-h-0 flex-col pl-5">
    <div class="flex shrink-0 justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center space-x-2 pr-5">
        <button type="button" @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <button type="button" @click="excelButton" class="button excel w-auto">엑셀</button>
      </div>
    </div>

    <div
      class="pur019-search-panel z-10 mt-3 w-full min-h-0 shrink-0 rounded-lg bg-gray-200"
      :style="{
        '--pur019-control-border': pur019ControlBorder,
        '--pur019-col-gutter': pur019ColGutter,
        '--pur019-row-gap': pur019RowGap,
        '--pur019-label-col': pur019LabelCol,
        '--pur019-row-min-h': pur019RowMinH,
        '--pur019-control-h': pur019ControlH,
      }">
      <div class="pur019-wire-grid min-w-0">
        <div class="pur019-wire-cell">
          <div class="pur019-wire-label">{{ mainName }}</div>
          <div class="pur019-wire-field pur019-date-slot min-w-0 overflow-hidden">
            <Datepicker1
              ref="datepicker"
              :mainName="mainName"
              :initToday="1"
              @dateValue="dateValue" />
          </div>
        </div>
        <div class="pur019-wire-cell">
          <div class="pur019-wire-label">매장명</div>
          <div class="pur019-wire-field pur019-mat-row pur019-pick-slot-full min-w-0 w-full">
            <PickStoreRenew3
              compact
              omit-main-label
              combo-fill
              placeholder-name="전체"
              @excelStore="excelStoreGrid1"
              @update:storeCd="handleStoreCd" />
          </div>
        </div>
        <div class="pur019-wire-cell">
          <div class="pur019-wire-label">거래처</div>
          <div class="pur019-wire-field pur019-bc-slot min-w-0 w-full max-w-full">
            <BusinessClient
              compact-search-bar
              :disable="supplierComboDisabled"
              :select-supplier-id="supplierComboPresetId"
              :select-supplier-label="supplierSessionDisplayName"
              @SupplierId="SupplierId"
              @SupplierNm="SupplierNm" />
          </div>
        </div>
      </div>
    </div>

    <div class="mt-2 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <Realgrid
        class="pur019-grid-body min-h-0 w-full flex-1"
        :progname="'PUR01_019INS_VUE'"
        :progid="1"
        :rowData="rowData"
        :documentTitle="'PUR01_019INS'"
        :rowStateeditable="false"
        :selectionStyle="'block'"
        :exporttoExcel="exportExcelGrid1"
        :documentSubTitle="documentSubTitleGrid1"
        @clickedRowData="clickedRowData"
        @dblclickedRowData="dblclickedRowData" />
    </div>
    <div
      v-if="popupButton"
      class="fixed inset-0 z-40 flex h-full w-full bg-black/10">
      <div
        class="absolute left-[15%] top-[10%] h-[80%] w-[80%] rounded-xl border border-gray-300 bg-white p-6 shadow-lg">
        <div class="flex items-center justify-between mb-4">
        <!-- 왼쪽 제목 -->
        <h2 class="text-lg font-bold">발주 확인/출고(팝업)</h2>
        <!-- 오른쪽 버튼들 -->
          <div class="flex space-x-2">
            <button @click="saveButton" class="button save md:w-auto w-14">
              저장
            </button>
            <button @click="excelButtonGrid2" class="button excel w-auto">
              엑셀
            </button>
            <button @click="closePopup" class="button primary">닫기</button>
          </div>
        </div>
        <div
          class="pur019-popup-fields mb-3 min-w-0 rounded-lg bg-gray-100 px-6 py-4"
          :style="{
            '--pur019-popup-border': pur019ControlBorder,
            '--pur019-popup-label': pur019PopupLabelCol,
            '--pur019-popup-gap': pur019PopupFieldGap,
          }">
          <div class="pur019-popup-grid">
            <div class="pur019-popup-label">
              <div class="pur019-popup-label-inner">매장</div>
            </div>
            <div class="pur019-popup-cell">
              <input
                type="text"
                class="pur019-popup-input"
                disabled
                v-model="scond" />
            </div>
            <div class="pur019-popup-label">
              <div class="pur019-popup-label-inner">전표번호</div>
            </div>
            <div class="pur019-popup-cell">
              <input
                type="text"
                class="pur019-popup-input"
                disabled
                v-model="scond2" />
            </div>

            <div class="pur019-popup-label">
              <div class="pur019-popup-label-inner">{{ mainName }}</div>
            </div>
            <div class="pur019-popup-cell">
              <input
                type="text"
                class="pur019-popup-input"
                disabled
                v-model="formatscond3" />
            </div>
            <div class="pur019-popup-label">
              <div class="pur019-popup-label-inner">거래처</div>
            </div>
            <div class="pur019-popup-cell">
              <input
                type="text"
                class="pur019-popup-input"
                disabled
                v-model="scond4" />
            </div>

            <div class="pur019-popup-label">
              <div class="pur019-popup-label-inner">메모(발주)</div>
            </div>
            <div class="pur019-popup-cell pur019-popup-cell--span">
              <input
                type="text"
                class="pur019-popup-input"
                disabled
                v-model="scond5" />
            </div>

            <div class="pur019-popup-label">
              <div class="pur019-popup-label-inner">메모(출고)</div>
            </div>
            <div class="pur019-popup-cell pur019-popup-cell--span">
              <input
                type="text"
                class="pur019-popup-input pur019-popup-input--editable"
                v-model="scond6"
                name="strCheckComments" />
            </div>
          </div>
        </div>
      <br />
      <div class="h-[60%] w-full">
        <Realgrid
          :progid="2"
          :progname="'PUR01_019INS_VUE'"
          @allStateRows="allStateRows"
          @updatedRowData="updatedRowData"
          @updatedRowData2="updatedRowData"
          @clickedRowData="clickedRowData2"
          :editableColId="editableColId"
          :inputOnlyNumberColumn="'dblCheckQty'"
          :CalculateSupplyPrice="'curSupply'"
          :CalculateVatPrice="'curTax'"
          :CalculateTotalPrice="'curTotalAmt'"
          :setFooter="true"
          :setFooterCustomColumnId="['curUnitPrice']"
          :setFooterCustomText="['합계']"
          :rowStateeditable="false"
          :rowData="rowData2"
          @selectedIndex="selectedIndex"
          :changeRow="changeRow"
          :changeColid="changeColid"
          :changeValue2="changeValue2"
          :changeNow2="changeNow"
          :documentTitle="'PUR01_019INS'"
          :exporttoExcel="exportExcelGrid2"
          :documentSubTitle="documentSubTitleGrid2" />
      </div>
      <br />
    </div>
  </div>
  </div>
</template>

<script setup>
import {
  getOrderConfirmDelivery,
  getOrderConfirmDeliveryDetail,
  setOrderConfirmDelivery,
} from "@/api/mipur";
/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";

/**
 *  매장 선택 컴포넌트
 *  */

import Datepicker1 from "@/components/Datepicker1.vue";
import PickStoreRenew3 from "@/components/pickStoreRenew.vue";

/**
 * 	그리드 생성
 */

import Realgrid from "@/components/realgrid.vue";

/**
 *  페이지로그 자동 입력
 *  */
import { insertPageLog } from "@/customFunc/customFunc";

/**
 *  경고창 호출 라이브러리
 *  */

import Swal from "sweetalert2";
/*
 * 공통 표준  Function
 */

import { computed, onMounted, ref } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";
import BusinessClient from "@/components/businessClient2.vue";

const store = useStore();

/** 거래처 계정(lngUserAdminID === 60): 세션 `lngSupplierID` 고정 + 콤보 비활성 — PUR03_036RPT 와 동일 */
const isSupplierPortal = computed(() => store.getters.isSupplierAccountUser);
const supplierComboPresetId = computed(() => {
  if (!isSupplierPortal.value) return "";
  const id = store.getters.sessionLngSupplierID;
  return id != null && id > 0 ? id : "";
});
const supplierComboDisabled = computed(() => isSupplierPortal.value);
/** 로그인 세션에 오는 거래처 표시명 — 콤보 목록에 없을 때 라벨로 사용 */
const supplierSessionDisplayName = computed(() => {
  if (!isSupplierPortal.value) return "";
  const u = store.state.userData;
  if (!u || typeof u !== "object" || Array.isArray(u)) return "";
  const nm =
    u.strSupplierName ??
    u.StrSupplierName ??
    u.strChargerName ??
    u.strStoreName ??
    u.strUserID ??
    "";
  return String(nm).trim();
});

const pur019ControlBorder = "#cbd5e1";
const pur019ColGutter = "1.25rem";
const pur019RowGap = "0.75rem";
const pur019LabelCol = "5.75rem";
const pur019RowMinH = "2rem";
const pur019ControlH = "2rem";
/** 팝업 상단 항목 AREA — 라벨 칸·행 간격 */
const pur019PopupLabelCol = "7rem";
const pur019PopupFieldGap = "0.5rem";

const rowData = ref([]);
const rowData2 = ref([]);

/**
 * 그리드1 초기화
 */

const initGrid = () => {
  if (rowData.value.length != 0) {
    rowData.value = [];
  }
};

/**
 * 그리드2 초기화
 */

const initGrid2 = () => {
  if (rowData2.value.length != 0) {
    rowData2.value = [];
  }
};

/**
 * 	매출 일자 가져오는 함수
 */

const selectedDate = ref();
const dateValue = (e) => {
  initGrid();
  selectedDate.value = e;
  // console.log(selectedDate.value);
};

/**
 * 선택한 매장 코드 호출 함수
 */
const storeCd = ref(""); // 기본값 ""
const handleStoreCd = (e) => {
  // console.log(e);
  storeCd.value = e;
  initGrid();
};

const supplierid = ref("");
const SupplierId = (e) => {
  initGrid();
  if (isSupplierPortal.value) {
    const sid = store.getters.sessionLngSupplierID;
    if (sid != null && sid > 0) {
      supplierid.value = String(sid);
      return;
    }
  }
  supplierid.value = e;
};

const Suppliernm = ref("");
const SupplierNm = (e) => {
  initGrid();
  Suppliernm.value = e;
  // console.log(Suppliernm.value);
};

const scond = ref("");
const scond2 = ref("");
const scond3 = ref("");
const scond4 = ref("");
const scond5 = ref("");
const scond6 = ref("");
const status = ref("");

/**
 * 	화면 Load시 실행 스크립트
 */
const mainName = ref("배송(입고)일");
onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  if (
    store.state.userData.lngStoreGroup == "3183" ||
    store.state.userData.lngStoreGroup == "3264"
  ) {
    mainName.value = "발주일자";
  }

  if (isSupplierPortal.value) {
    const sid = store.getters.sessionLngSupplierID;
    if (sid != null && sid > 0) {
      supplierid.value = String(sid);
    }
  }

  console.log(mainName.value);
});

const popupButton = ref(false);

/**
 *  그리드 클릭 이벤트
 */

const clickedrowData = ref([]);
const formatscond3 = ref("");
const clickedRowData = (newValue) => {
  // console.log(newValue);
  clickedrowData.value = newValue;
  let date =
    store.state.userData.lngStoreGroup == "3183" ||
    store.state.userData.lngStoreGroup == "3264"
      ? newValue[3]
      : newValue[4];
  scond.value = clickedrowData.value[0];
  scond2.value = clickedrowData.value[2];
  scond3.value = date;
  formatscond3.value =
    date.slice(0, 4) + "-" + date.slice(4, 6) + "-" + date.slice(6);
  scond4.value = clickedrowData.value[1];
  scond5.value = clickedrowData.value[10];
  scond6.value = clickedrowData.value[11];
};

/**
 *  그리드 클릭 이벤트
 */

const isDisabled = ref(true);

const clickedrowData2 = ref([]);
const editableColId = ref("dblCheckQty,strCheckComments");
const clickedRowData2 = (newValue) => {
  if (newValue[14] != "01") {
    Swal.fire({
      title: "경고",
      text: "입고확정된 발주데이터는 수정이 불가능합니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    editableColId.value = "";
    return;
  } else {
    editableColId.value = "dblCheckQty,strCheckComments";
  }

  clickedrowData2.value = newValue;
  //scond6.value = clickedrowData2.value[11];
  status.value = clickedrowData2.value[14];
  isDisabled.value = false;
};

/**
 *  그리드 더블클릭 이벤트
 */

const dblclickedRowData = async (e) => {
  popupButton.value = true;
  searchButtonPopup(e);
};

const changeRow = ref(0);
const selectedIndex = (e) => {
  changeRow.value = e;
};
const changeNow = ref(false);
const changeColid = ref("");
const changeValue2 = ref("");

// const updateGridValue = (e) => {
//   // changeColid.value = e.target.name;
//   // changeValue2.value = e.target.value;
//   // // console.log(status.value);
//   // changeNow.value = !changeNow.value;
//   // // if(status.value != "01"){
//   // //   Swal.fire({
//   // //     title: "경고",
//   // //     text: "입고확정된 발주데이터는 수정이 불가능합니다.",
//   // //     icon: "warning",
//   // //     confirmButtonText: "확인",
//   // //   });
//   // //   scond6.value = ""
//   // // 	return;
//   // // } else {
//   // //   changeNow.value = !changeNow.value;
//   // // }
// };

const updatedrowdata = ref([]);
const updatedRowData = (newvalue) => {
  updatedrowdata.value = newvalue;
};

const allstaterows = ref([]);
const allStateRows = (e) => {
  // console.log(e);
  allstaterows.value = e.updated;
  // console.log(allstaterows.value);
};

/**
 *  조회 함수
 */

const searchButton = async () => {
  // console.log(selectedDate.value.replaceAll("-", ""));

  try {
    store.state.loading = true;
    const res = await getOrderConfirmDelivery(
      store.state.userData.lngStoreGroup,
      storeCd.value,
      supplierid.value,
      selectedDate.value.replaceAll("-", "")
    );

    rowData.value = res.data.List;
    store.state.loading = false;
  } catch (error) {
    console.log(error);
  }
};

/**
 *  조회 함수
 */

const tempscond6 = ref("");
const searchButtonPopup = async (e) => {
  tempscond6.value = e[11];

  try {
    const orderNo = e[2] ?? scond2.value;
    const rowDate =
      store.state.userData.lngStoreGroup == "3183" ||
      store.state.userData.lngStoreGroup == "3264"
        ? e[3]
        : e[4];
    const res = await getOrderConfirmDeliveryDetail(
      store.state.userData.lngStoreGroup,
      e[12],
      e[13],
      orderNo,
      rowDate
    );

    console.log(res);

    rowData2.value = res.data.List2;
  } catch (error) {
    console.error(error);
  }
};

const resetFlag = ref(false);

const closePopup = () => {
  popupButton.value = false;

  // ✅ 닫을 때만 데이터 초기화
  initGrid2();
  storeCd.value = ""; // 기본값 ""

  resetFlag.value = !resetFlag.value; // 토글 → 자식에서 watch됨
  // console.log("resetFlag 토글됨:", resetFlag.value);  // ← 값이 변하는지 확인

  isDisabled.value = true;
};

/**
 *  저장 버튼 함수
 */

const saveButton = async () => {
  if (allstaterows.value.length == 0 && tempscond6.value == scond6.value) {
    Swal.fire({
      title: "경고",
      text: "변경된 사항이 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  try {
    await Swal.fire({
      title: "확인",
      text: "저장하시겠습니까?",
      icon: "warning", // 'success', 'error', 'warning', 'info', 'question'
      showCancelButton: true, // 취소 버튼 표시
      confirmButtonText: "확인",
      cancelButtonText: "취소",
    }).then(async (result) => {
      if (result.isConfirmed) {
        store.state.loading = true;

        // console.log(updatedrowdata.value);

        const dblCheckQtys = updatedrowdata.value
          .filter((_, index) => allstaterows.value.includes(index))
          .map((item) => item.dblCheckQty)
          .join("\u200b");

        const seqs = updatedrowdata.value
          .filter((_, index) => allstaterows.value.includes(index))
          .map((item) => item.lngOrderSeq)
          .join("\u200b");

        const checkcomments = updatedrowdata.value
          .filter((_, index) => allstaterows.value.includes(index))
          .map((item) => item.strCheckComments)
          .join("\u200b");

        const res = await setOrderConfirmDelivery(
          store.state.userData.lngStoreGroup,
          clickedrowData.value[12],
          scond2.value,
          seqs,
          dblCheckQtys,
          scond6.value,
          checkcomments
        );

        console.log(res);

        store.state.loading = false;

        if (res.data.RESULT_CD == "00") {
          Swal.fire({
            title: "성공",
            text: "저장에 성공하였습니다.",
            icon: "success", // 'success', 'error', 'warning', 'info', 'question'
            confirmButtonText: "확인",
          });
        } else {
          Swal.fire({
            title: "실패",
            text: "저장에 실패하였습니다.",
            icon: "error", // 'success', 'error', 'warning', 'info', 'question'
            confirmButtonText: "확인",
          });
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  } catch (error) {
  } finally {
    // searchButtonPopup();
    searchButton();
  }
};

const exportExcelGrid1 = ref(false);
const selectedExcelStoreGrid1 = ref("");
const documentSubTitleGrid1 = ref("");

/**
 * 엑셀용 매장 세팅 함수
 */

const excelStoreGrid1 = (e) => {
  // console.log(e);
  selectedExcelStoreGrid1.value = e;
};

/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  documentSubTitleGrid1.value =
    "배송(입고)일 : " +
    selectedDate.value +
    "\n" +
    selectedExcelStoreGrid1.value +
    "\n" +
    "거래처명 : " +
    Suppliernm.value;

  // console.log(documentSubTitleGrid1.value);

  exportExcelGrid1.value = !exportExcelGrid1.value;
};

const exportExcelGrid2 = ref(false);
const documentSubTitleGrid2 = ref("");

/**
 * 엑셀 내보내기 함수
 */

const excelButtonGrid2 = () => {
  documentSubTitleGrid2.value =
    "배송(입고)일 : " +
    selectedDate.value +
    "\n" +
    "매장명 : " +
    clickedrowData.value[0] +
    "\n" +
    "거래처명 : " +
    clickedrowData.value[1];

  // console.log(documentSubTitleGrid2.value);

  exportExcelGrid2.value = !exportExcelGrid2.value;
};
</script>

<style scoped>
.pur019-search-panel {
  --pur019-panel-pad-x: 2rem;
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  padding-left: 0;
  padding-right: 0;
  padding-block: 0.75rem;
  overflow-x: auto;
}

@media (min-width: 640px) {
  .pur019-search-panel {
    --pur019-panel-pad-x: 2.5rem;
  }
}

@media (min-width: 768px) {
  .pur019-search-panel {
    --pur019-panel-pad-x: 3rem;
  }
}

@media (min-width: 1024px) {
  .pur019-search-panel {
    --pur019-panel-pad-x: 3.5rem;
  }
}

.pur019-wire-grid {
  display: grid;
  width: max(100%, max-content);
  min-width: 100%;
  box-sizing: border-box;
  padding-left: var(--pur019-panel-pad-x);
  padding-right: var(--pur019-panel-pad-x);
  align-items: center;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  column-gap: var(--pur019-col-gutter);
  row-gap: var(--pur019-row-gap);
}

.pur019-wire-cell {
  display: flex;
  min-width: 0;
  min-height: var(--pur019-row-min-h);
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}

.pur019-wire-label {
  flex: 0 0 var(--pur019-label-col);
  width: var(--pur019-label-col);
  min-width: 0;
  max-width: var(--pur019-label-col);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: var(--pur019-row-min-h);
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pur019-wire-field {
  display: flex;
  min-width: 0;
  max-width: 100%;
  flex: 1 1 auto;
  align-items: center;
  min-height: var(--pur019-row-min-h);
}

.pur019-wire-field:not(.pur019-mat-row) > * {
  min-width: 0;
  width: 100%;
}

.pur019-mat-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 2fr);
  column-gap: 0.5rem;
  align-items: center;
  min-width: 0;
  max-width: 100%;
}

.pur019-mat-row > * {
  box-sizing: border-box;
  min-width: 0;
  max-width: 100%;
}

/* Datepicker1 내부 제목 숨김 */
.pur019-search-panel .pur019-date-slot :deep(div.space-x-5 > span) {
  display: none;
}

.pur019-search-panel .pur019-date-slot :deep(div.space-x-5) {
  margin-top: 0 !important;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  gap: 0.25rem;
}

.pur019-search-panel .pur019-date-slot :deep(input[type="date"]) {
  box-sizing: border-box;
  height: var(--pur019-control-h) !important;
  min-height: var(--pur019-control-h) !important;
  max-height: var(--pur019-control-h) !important;
  width: auto !important;
  flex: 1 1 0;
  min-width: 5.25rem;
  max-width: none;
  padding-left: 0.45rem;
  padding-right: 0.25rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  border-radius: 0.375rem;
  border: 1px solid var(--pur019-control-border) !important;
  background: #fff;
}

.pur019-search-panel .pur019-date-slot :deep(input[type="date"]:focus) {
  border-color: #3b82f6 !important;
}

/* 매장명: 그룹·구분·매장 3콤보 (1fr 1fr 2fr) */
.pur019-pick-slot-full :deep(> div.flex) {
  display: contents;
  margin: 0;
}

.pur019-pick-slot-full :deep(> div.flex > div:nth-child(1) select),
.pur019-pick-slot-full :deep(> div.flex > div:nth-child(2) select) {
  display: block !important;
  margin-left: 0 !important;
  height: var(--pur019-control-h) !important;
  min-height: var(--pur019-control-h) !important;
  max-height: var(--pur019-control-h) !important;
  padding: 0 0.375rem !important;
  font-size: 0.875rem !important;
  line-height: 1.25rem;
  box-sizing: border-box;
  width: 100% !important;
  max-width: 100%;
  border: 1px solid var(--pur019-control-border) !important;
  border-radius: 0.375rem !important;
  background: #fff !important;
}

.pur019-pick-slot-full :deep(> div.flex > div:nth-child(3)) {
  margin-left: 0 !important;
  width: 100% !important;
  min-width: 0;
  max-width: 100%;
}

.pur019-pick-slot-full :deep(.custom-select) {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important;
  margin-left: 0 !important;
}

.pur019-pick-slot-full :deep(.vs__dropdown-toggle) {
  height: var(--pur019-control-h) !important;
  min-height: var(--pur019-control-h) !important;
  max-height: var(--pur019-control-h) !important;
  border: 1px solid var(--pur019-control-border) !important;
  border-radius: 0.375rem !important;
  box-sizing: border-box;
  background: #fff !important;
}

.pur019-search-panel .pur019-bc-slot :deep(.pickstore-vs-shell) {
  box-sizing: border-box !important;
  height: var(--pur019-control-h) !important;
  min-height: var(--pur019-control-h) !important;
  max-height: var(--pur019-control-h) !important;
  border: 1px solid var(--pur019-control-border) !important;
  border-radius: 0.375rem !important;
  font-size: 0.875rem !important;
  background: #fff !important;
  max-width: 100%;
  min-width: 0;
  width: 100%;
}

.pur019-bc-slot :deep(> div.flex.text-base) {
  margin: 0 !important;
  width: 100%;
  min-width: 0;
  gap: 0 !important;
}

.pur019-bc-slot :deep(.vs__dropdown-toggle) {
  height: 100% !important;
  min-height: 0 !important;
  border: none !important;
}

.pur019-grid-body {
  min-height: 12rem;
}

/* 발주 확인/출고(팝업) 상단 항목 AREA */
.pur019-popup-fields {
  box-sizing: border-box;
}

.pur019-popup-grid {
  display: grid;
  width: 100%;
  min-width: 0;
  grid-template-columns:
    minmax(0, var(--pur019-popup-label)) minmax(0, 1fr)
    minmax(0, var(--pur019-popup-label)) minmax(0, 1fr);
  column-gap: 0.75rem;
  row-gap: var(--pur019-popup-gap);
  align-items: center;
}

.pur019-popup-label {
  min-width: 0;
  max-width: var(--pur019-popup-label);
}

.pur019-popup-label-inner {
  display: flex;
  width: 100%;
  min-height: 2rem;
  align-items: center;
  justify-content: center;
  padding: 0.125rem 0.25rem;
  text-align: center;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.25rem;
  color: rgb(17 24 39);
}

.pur019-popup-cell {
  display: flex;
  min-width: 0;
  align-items: center;
}

.pur019-popup-cell--span {
  grid-column: 2 / -1;
}

.pur019-popup-input {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  height: 2rem;
  min-height: 2rem;
  border-radius: 0.375rem;
  border: 1px solid var(--pur019-popup-border) !important;
  background-color: #fff;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: rgb(55 65 81);
}

.pur019-popup-input:disabled {
  background-color: rgb(229 231 235);
  color: rgb(75 85 99);
}

.pur019-popup-input--editable:focus {
  border-color: #3b82f6 !important;
  outline: none;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.35);
}
</style>
