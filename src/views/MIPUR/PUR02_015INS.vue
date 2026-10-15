<!-- /*--############################################################################
# Filename : PUR02_015INS.vue                                                  
# Description : 구매관리2 > 매입 관리 > 매입 확정.                      
# Date :2025-08-28                                                             
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <!-- pl-5: 셸 w-right가 pl0이라 그리드가 좌측 메뉴에 붙음 → 우측 pd20과 맞춤 -->
  <div class="flex h-full min-h-0 flex-col pl-5" @click="handleParentClick">
    <div class="flex shrink-0 justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center space-x-2 pr-5">
        <button type="button" @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <button type="button" @click="excelButton" class="button w-auto excel">엑셀</button>
      </div>
    </div>

    <div
      class="pur015-search-panel z-10 mt-3 w-full min-w-0 shrink-0 rounded-lg bg-gray-200"
      :style="{
        '--pur015-control-border': pur015ControlBorder,
        '--pur015-item-gap': pur015ItemGap,
        '--pur015-col-gap': pur015ColGap,
        '--pur015-row-gap': pur015RowGap,
        '--pur015-panel-pad-x': pur015PanelPadX,
        '--pur015-date-field-w': pur015DateFieldW,
        '--pur015-row-min-h': pur015RowMinH,
        '--pur015-control-h': pur015ControlH,
      }">
      <div class="pur015-search-grid min-w-0">
        <div class="pur015-sg-label">발주일자</div>
        <div class="pur015-cell-field pur015-date-slot min-w-0">
          <Datepicker2
            ref="datepicker"
            omit-main-label
            filter-bar-align
            :mainName="'발주일자'"
            :initToday="1"
            :closePopUp="closePopUp"
            @excelDate="excelDate"
            @endDate="endDate"
            @startDate="startDate" />
        </div>
        <div class="pur015-spacer" aria-hidden="true"></div>
        <div class="pur015-sg-label">매장명</div>
        <div class="pur015-cell-field pur015-pick-slot min-w-0">
          <PickStore
            compact-search-bar
            main-name=""
            @update:storeGroup="lngStoreGroup"
            :defaultStoreNm="'전체'"
            @storeNm="excelStore"
            :hideGroup="false"
            :hideAttr="false"
            :defaultStoreType2="true"
            :defaultStore="true"
            @update:storeCd="lngStoreCode" />
        </div>

        <div class="pur015-sg-label">거래처</div>
        <div class="pur015-cell-field pur015-bc-slot min-w-0">
          <BusinessClient
            compact-search-bar
            :default-nm="'전체'"
            @SupplierId="SupplierId" />
        </div>
        <div class="pur015-spacer" aria-hidden="true"></div>
        <div class="pur015-sg-label">상태</div>
        <div class="pur015-cell-field pur015-status-slot min-w-0">
          <select
            id="pur02-015-cond-status"
            class="pur015-sg-select"
            v-model="cond">
            <option
              v-for="i in optionList"
              :key="i.strDCode"
              :value="i.strDCode">
              {{ i.strDName }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div class="mt-2 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <div class="pur015-hint shrink-0 font-semibold">
        [미입고]: 입고수량이 발주수량보다 적게 입고되었거나 입고가 안된 경우.
        [입고완료] : 입고수량이 발주수량과 같거나 많이 입고된 경우
      </div>
      <Realgrid
        class="pur015-grid-body min-h-0 w-full flex-1"
        :progname="'PUR02_015INS_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :setStateBar="false"
        :setFooter="true"
        :documentTitle="'PUR02_015INS'"
        :selectionStyle="'block'"
        @dblclickedRowData="dblclickedRowData"
        :documentSubTitle="documentSubTitle"
        :rowStateeditable="false"
        :exporttoExcel="exportExcel" />
    </div>
  </div>

  <Teleport to="body">
    <div
      v-if="openPopUp"
      class="pur015-popup-backdrop"
      @click.self.prevent>
      <div
        class="pur015-popup-dialog"
        role="dialog"
        aria-modal="true"
        @click.stop
        @keydown.esc="openPopUp = false">
        <div class="pur015-popup-head">
          <h2 class="pur015-popup-title">매입 상세</h2>
          <div class="pur015-popup-actions">
            <button
              type="button"
              class="whitebutton !h-9 !px-5 !py-2 !text-sm !font-semibold !border-gray-500 !text-gray-700 hover:!bg-blue-50 hover:!border-blue-400 disabled:opacity-50 disabled:pointer-events-none"
              @click="saveButton"
              :disabled="disabled1">
              확정
            </button>
            <button
              type="button"
              class="whitebutton !h-9 !px-5 !py-2 !text-sm !font-semibold !border-gray-500 !text-gray-700 hover:!bg-blue-50 hover:!border-blue-400 disabled:opacity-50 disabled:pointer-events-none"
              @click="cancelButton"
              :disabled="!disabled1">
              확정취소
            </button>
            <button
              type="button"
              class="whitebutton !h-9 !px-5 !py-2 !text-sm !font-semibold !border-gray-500 !text-gray-700 hover:!bg-blue-50 hover:!border-blue-400 disabled:opacity-50 disabled:pointer-events-none"
              @click="excelButton2">
              엑셀
            </button>
            <button
              type="button"
              class="whitebutton !h-9 !px-5 !py-2 !text-sm !font-semibold !border-gray-500 !text-gray-700 hover:!bg-blue-50 hover:!border-blue-400 disabled:opacity-50 disabled:pointer-events-none"
              @click="openPopUp = false">
              닫기
            </button>
          </div>
        </div>

        <div
          class="pur015-popup-fields"
          :style="{
            '--pur015-popup-border': pur015ControlBorder,
            '--pur015-popup-label': pur015PopupLabelCol,
            '--pur015-popup-gap': pur015PopupFieldGap,
          }">
          <div class="pur015-popup-grid">
            <div class="pur015-popup-label">
              <div class="pur015-popup-label-inner">매장</div>
            </div>
            <div class="pur015-popup-cell">
              <input type="text" class="pur015-popup-input" disabled v-model="scond" />
            </div>
            <div class="pur015-popup-label">
              <div class="pur015-popup-label-inner">전표번호</div>
            </div>
            <div class="pur015-popup-cell">
              <input type="text" class="pur015-popup-input" disabled v-model="scond2" />
            </div>

            <div class="pur015-popup-label">
              <div class="pur015-popup-label-inner">배송(입고)일</div>
            </div>
            <div class="pur015-popup-cell">
              <input type="text" class="pur015-popup-input" disabled v-model="scond3" />
            </div>
            <div class="pur015-popup-label">
              <div class="pur015-popup-label-inner">거래처</div>
            </div>
            <div class="pur015-popup-cell">
              <input type="text" class="pur015-popup-input" disabled v-model="scond4" />
            </div>

            <div class="pur015-popup-label">
              <div class="pur015-popup-label-inner">코멘트(발주)</div>
            </div>
            <div class="pur015-popup-cell">
              <input type="text" class="pur015-popup-input" disabled v-model="scond5" />
            </div>
            <div class="pur015-popup-label">
              <div class="pur015-popup-label-inner">코멘트(출고)</div>
            </div>
            <div class="pur015-popup-cell">
              <input type="text" class="pur015-popup-input" disabled v-model="scond6" />
            </div>

            <div class="pur015-popup-label">
              <div class="pur015-popup-label-inner">입고확정일</div>
            </div>
            <div class="pur015-popup-cell">
              <input
                type="date"
                class="pur015-popup-input"
                :class="{ 'pur015-popup-input--editable': !disabled1 }"
                :disabled="disabled1"
                v-model="scond7" />
            </div>
            <div class="pur015-popup-label">
              <div class="pur015-popup-label-inner">검수자</div>
            </div>
            <div class="pur015-popup-cell">
              <input
                type="text"
                class="pur015-popup-input"
                :class="{ 'pur015-popup-input--editable': !disabled1 }"
                :disabled="disabled1"
                v-model="scond8" />
            </div>

            <div class="pur015-popup-label">
              <div class="pur015-popup-label-inner">코멘트입고</div>
            </div>
            <div class="pur015-popup-cell pur015-popup-cell--span">
              <input
                type="text"
                class="pur015-popup-input"
                :class="{ 'pur015-popup-input--editable': !disabled1 }"
                :disabled="disabled1"
                v-model="scond9" />
            </div>
          </div>
        </div>

        <div class="pur015-popup-grid-wrap">
          <Realgrid
            class="pur015-popup-grid-body min-h-0 h-full w-full"
            :progname="'PUR02_015INS_VUE'"
            :progid="2"
            :documentTitle="'PUR02_015INS'"
            :exporttoExcel="exportExcel2"
            @updatedRowData="updatedRowData2"
            :rowStateeditable="false"
            :inputOnlyNumberColumn="'dblCheckQty'"
            :CalculateTaxColId="'curTax'"
            :editableColId="'dblCheckQty'"
            :AutoCalculateDataMainColId="['curSupply', 'curTotal']"
            :AutoCalculateDataSubColId="[
              `values['dblCheckQty'] * values['curUnitPrice']`,
              `values['curSupply'] + values['curTax']`,
            ]"
            :documentSubTitle="documentSubTitle2"
            :rowData="rowData2" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { getCommonList } from "@/api/common";
import {
  cancelStockConfirm,
  checkStockCloseDate,
  getStockOrderCheckList,
  getStockOrderDetails,
  saveStockCheckMasterDetail,
} from "@/api/mipur";
import BusinessClient from "@/components/businessClient2.vue";
import Datepicker2 from "@/components/Datepicker2.vue";
import PageName from "@/components/pageName.vue";
import PickStore from "@/components/pickStore.vue";
import Realgrid from "@/components/realgrid.vue";
import { insertPageLog } from "@/customFunc/customFunc";
import Swal from "sweetalert2";
import { onMounted, ref } from "vue";
import { useStore } from "vuex";

const pur015ControlBorder = "#cbd5e1";
const pur015ItemGap = "2rem";
const pur015ColGap = "1.75rem";
const pur015RowGap = "0.75rem";
const pur015PanelPadX = "7rem";
const pur015DateFieldW = "21.6rem";
const pur015RowMinH = "2rem";
const pur015ControlH = "2rem";
const pur015PopupLabelCol = "6.5rem";
const pur015PopupFieldGap = "0.5rem";

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getCommonList(19);

  optionList.value = res.data.List;
});

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

const cond = ref("01");
const cond2 = ref(0);
const cond3 = ref(0);
const cond4 = ref("");
const cond5 = ref(0);
const store = useStore();

const datepicker = ref(null);
const closePopUp = ref(false);
const optionList = ref([]);
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

const sDate = ref("");
const eDate = ref("");

const selectedDate = ref();
const excelDate = (e) => {
  selectedDate.value = e;
};
const optionList2 = ref([]);

const storeCode = ref();
const lngStoreCode = (e) => {
  initGrid();
  storeCode.value = e;
};

const groupCd = ref();
const lngStoreGroup = (e) => {
  groupCd.value = e;
};

const supplierid = ref("");
const SupplierId = (e) => {
  supplierid.value = e;
};
/**
 *  조회 함수
 */
const hideColumnsId = ref([]);
const searchButton = async () => {
  try {
    store.state.loading = true;
    initGrid();

    const res = await getStockOrderCheckList(
      groupCd.value,
      storeCode.value,
      supplierid.value,
      sDate.value.replaceAll("-", ""),
      eDate.value.replaceAll("-", ""),
      cond.value
    );

    rowData.value = res.data.List;
    //console.log(res);
    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    //comsole.log(error);
  } finally {
    store.state.loading = false;
  }
};

/**
 * 페이지 매장 코드 세팅
 */

/**
 * 그리드 초기화
 */

const disabled1 = ref(false);
const progid = ref(1);
const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }

  if (cond5.value == 0) {
    progid.value = 1;
  } else if (cond5.value == 1) {
    progid.value = 2;
  } else if (cond5.value == 2) {
    progid.value = 3;
  } else if (cond5.value == 3) {
    progid.value = 4;
  }

  reload.value = !reload.value;
};

//엑셀 버튼 처리 함수
const exportExcel = ref(false);
/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  documentSubTitle.value =
    selectedDate.value + "\n" + "매장명 :" + selectedExcelStore.value;
  exportExcel.value = !exportExcel.value;
};

const documentSubTitle2 = ref("");

// 엑셀 추출
const documentSubTitle = ref("");
const selectedExcelList = ref("");

const selectedExcelStore = ref("");
/**
 * 엑셀용 매장 세팅 함수
 */

const excelStore = (e) => {
  selectedExcelStore.value = e;
  //comsole.log(e);
};
const excelList = (e) => {
  selectedExcelList.value = e;
  //comsole.log(e);
};

const openPopUp = ref(false);

const rowData2 = ref([]);
const forPopupOrderStoreCd = ref("");
const forPopupOrderNo = ref("");
const tempGroup = ref("");
const tempStore = ref("");
const tempBClient = ref("");
const tempCheckNo = ref("");
const tempCheckDate = ref("");
const scond5 = ref("");
const scond6 = ref("");
const scond8 = ref("");
const scond9 = ref("");
const dblclickedRowData = async (e) => {
  //console.log(e);

  if (e[6] == "" || e[6] == undefined) {
    disabled1.value = false;
    scond7.value =
      e[5].slice(0, 4) + "-" + e[5].slice(4, 6) + "-" + e[5].slice(6, 8);
  } else {
    disabled1.value = true;
    scond7.value =
      e[6].slice(0, 4) + "-" + e[6].slice(4, 6) + "-" + e[6].slice(6, 8);
  }
  scond.value = e[0];
  scond2.value = e[2];
  scond3.value =
    e[5].slice(0, 4) + "-" + e[5].slice(4, 6) + "-" + e[5].slice(6, 8);
  scond4.value = e[1];
  scond5.value = e[15];
  openPopUp.value = true;
  tempGroup.value = e[13];
  tempStore.value = e[14];
  tempCheckNo.value = e[3];
  tempBClient.value = e[12];
  tempCheckDate.value = e[4];
  scond8.value = e[18];
  scond9.value = e[17];
  scond6.value = e[16];

  //console.log(scond7.value);
  try {
    const res = await getStockOrderDetails(
      e[13],
      e[14],
      e[2],
      e[12],
      e[5],
      store.state.userData.strLanguage
    );
    //console.log(res);
    rowData2.value = res.data.List;
    updatedrowdata2.value = res.data.List;
  } catch (error) {}
};

const checkedrowdata = ref([]);

const startDate = (e) => {
  sDate.value = e;
};
const endDate = (e) => {
  eDate.value = e;
};

const scond = ref("");
const scond2 = ref("");
const scond3 = ref("");
const scond4 = ref("");
const scond7 = ref("");

const exportExcel2 = ref(false);
const excelButton2 = () => {
  documentSubTitle2.value = "입고확정일 : " + scond7.value;
  exportExcel2.value = !exportExcel2.value;
};

const saveButton = async () => {
  if (
    parseInt(tempCheckDate.value) > parseInt(scond7.value.replaceAll("-", ""))
  ) {
    await Swal.fire({
      title: "경고",
      text: "발주일보다 빠른 날짜로 매입확정을 하실 수 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  try {
    const res = await checkStockCloseDate(
      tempGroup.value,
      tempStore.value,
      scond7.value.replaceAll("-", "")
    );

    ////console.log(res);

    const result = res.data.List.filter((item) =>
      item.dtmMonth.includes(scond7.value.replaceAll("-", "").slice(0, 6))
    );

    if (result[0].strClosed == "Y") {
      await Swal.fire({
        title: "경고",
        text: "해당 입고확정일은 마감되었습니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }
    //console.log(result);
  } catch (error) {}

  try {
    const stockids = updatedrowdata2.value
      .map((item) => item.lngStockID)
      .join("\u200b");
    const checkqtys = updatedrowdata2.value
      .map((item) => item.dblCheckQty)
      .join("\u200b");
    const unitprices = updatedrowdata2.value
      .map((item) => item.curUnitPrice)
      .join("\u200b");
    const supplys = updatedrowdata2.value
      .map((item) => item.curSupply)
      .join("\u200b");
    const taxs = updatedrowdata2.value
      .map((item) => item.curTax)
      .join("\u200b");
    const ordernos = updatedrowdata2.value
      .map((item) => item.strOrderNo)
      .join("\u200b");
    const orderseqs = updatedrowdata2.value
      .map((item) => item.lngOrderSeq)
      .join("\u200b");
    const res = await saveStockCheckMasterDetail(
      tempGroup.value,
      tempStore.value,
      scond7.value.replaceAll("-", ""),
      scond9.value,
      1,
      scond8.value,

      scond2.value,
      scond7.value.replaceAll("-", ""),
      tempBClient.value,
      stockids,
      checkqtys,
      unitprices,
      supplys,
      taxs,
      ordernos,
      orderseqs,
      store.state.userData.lngSequence
    );

    if (res.data.RESULT_CD == "00") {
      await Swal.fire({
        title: "성공",
        text: "저장되었습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
      openPopUp.value = false;
    } else {
      await Swal.fire({
        title: "경고",
        text: "저장에 실패하였습니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      openPopUp.value = false;
    }
  } catch (error) {
  } finally {
    searchButton();
  }
};

const updatedrowdata2 = ref([]);
const updatedRowData2 = (e) => {
  updatedrowdata2.value = e;
};

const cancelButton = async () => {
  try {
    const res = await checkStockCloseDate(
      tempGroup.value,
      tempStore.value,
      scond7.value.replaceAll("-", "")
    );

    ////console.log(res);

    const result = res.data.List.filter((item) =>
      item.dtmMonth.includes(scond7.value.replaceAll("-", "").slice(0, 6))
    );

    if (result[0].strClosed == "Y") {
      await Swal.fire({
        title: "경고",
        text: "해당 매입 사항은 마감되어 취소할 수 없습니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }
    //console.log(result);
  } catch (error) {}
  try {
    const res = await cancelStockConfirm(
      tempGroup.value,
      tempStore.value,
      scond2.value,
      tempCheckDate.value,
      tempCheckNo.value,
      scond7.value.replaceAll("-", ""),
      tempBClient.value,
      store.state.userData.lngSequence
    );

    if (res.data.RESULT_CD == "00") {
      await Swal.fire({
        title: "성공",
        text: "확정 취소가 완료되었습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
      openPopUp.value = false;
    } else {
      await Swal.fire({
        title: "경고",
        text: "확정 취소가 실패하였습니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      openPopUp.value = false;
    }
  } catch (error) {
  } finally {
    searchButton();
  }
};
</script>

<style scoped>
.pur015-search-panel {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  padding-left: 0;
  padding-right: 0;
  padding-block: 0.75rem;
  overflow-x: visible;
}

.pur015-search-grid {
  display: grid;
  grid-template-columns:
    max-content
    var(--pur015-date-field-w)
    minmax(var(--pur015-col-gap), 1fr)
    max-content
    calc(var(--pur015-date-field-w) - 2.25rem);
  grid-template-rows: auto auto;
  align-items: center;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  column-gap: 0;
  row-gap: var(--pur015-row-gap);
  padding-left: var(--pur015-panel-pad-x);
  padding-right: var(--pur015-panel-pad-x);
}

.pur015-spacer {
  min-width: var(--pur015-col-gap);
  align-self: stretch;
}

.pur015-sg-label {
  justify-self: stretch;
  box-sizing: content-box;
  padding-right: var(--pur015-item-gap);
  min-height: var(--pur015-row-min-h);
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

.pur015-cell-field {
  display: flex;
  min-width: 0;
  min-height: var(--pur015-row-min-h);
  align-items: center;
}

.pur015-date-slot {
  width: 100%;
  max-width: var(--pur015-date-field-w);
  justify-self: stretch;
}

.pur015-bc-slot {
  width: calc(var(--pur015-date-field-w) - 2.25rem);
  max-width: calc(var(--pur015-date-field-w) - 2.25rem);
  justify-self: start;
}

.pur015-pick-slot,
.pur015-status-slot {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  justify-self: stretch;
}

.pur015-sg-select {
  box-sizing: border-box;
  height: var(--pur015-control-h);
  min-height: var(--pur015-control-h);
  max-height: var(--pur015-control-h);
  width: 100%;
  min-width: 0;
  padding: 0 0.375rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: rgb(55 65 81);
  background: #fff;
  border: 1px solid var(--pur015-control-border);
  border-radius: 0.375rem;
}

.pur015-sg-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.2);
}

.pur015-pick-slot :deep(> div.flex.text-base) {
  width: 100%;
  min-width: 0;
  min-height: var(--pur015-row-min-h);
  align-items: center;
  gap: 0 !important;
}

.pur015-pick-slot :deep(> div.flex > div:first-child) {
  display: none;
}

.pur015-pick-slot :deep(.relative.min-w-0.flex-1) {
  flex: 1 1 auto !important;
  min-width: 0 !important;
  max-width: 100% !important;
  width: 100% !important;
}

.pur015-search-grid .pur015-pick-slot :deep(select) {
  box-sizing: border-box;
  height: var(--pur015-control-h) !important;
  min-height: var(--pur015-control-h) !important;
  max-height: var(--pur015-control-h) !important;
  border: 1px solid var(--pur015-control-border) !important;
}

.pur015-search-grid .pur015-pick-slot :deep(select:focus) {
  border-color: #3b82f6 !important;
}

.pur015-search-grid .pur015-pick-slot :deep(.pickstore-vs-shell),
.pur015-search-grid .pur015-bc-slot :deep(.pickstore-vs-shell) {
  box-sizing: border-box;
  height: var(--pur015-control-h) !important;
  min-height: var(--pur015-control-h) !important;
  max-height: var(--pur015-control-h) !important;
  border: 1px solid var(--pur015-control-border) !important;
  overflow: hidden !important;
  position: relative !important;
}

.pur015-search-grid .pur015-pick-slot :deep(.style-chooser),
.pur015-search-grid .pur015-bc-slot :deep(.style-chooser) {
  width: 100% !important;
  height: 100% !important;
}

.pur015-search-grid .pur015-pick-slot :deep(.vs__dropdown-toggle),
.pur015-search-grid .pur015-bc-slot :deep(.vs__dropdown-toggle) {
  box-sizing: border-box;
  min-height: var(--pur015-control-h) !important;
  height: var(--pur015-control-h) !important;
  max-height: var(--pur015-control-h) !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  padding-left: 0.5rem !important;
  padding-right: 0.25rem !important;
  display: flex !important;
  align-items: center !important;
  flex-wrap: nowrap !important;
}

.pur015-search-grid .pur015-pick-slot :deep(.vs__selected-options),
.pur015-search-grid .pur015-bc-slot :deep(.vs__selected-options) {
  flex: 1 1 auto !important;
  min-width: 0 !important;
  position: relative !important;
  height: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
  overflow: hidden !important;
}

.pur015-search-grid .pur015-pick-slot :deep(.vs__selected),
.pur015-search-grid .pur015-bc-slot :deep(.vs__selected) {
  position: absolute !important;
  left: 0 !important;
  right: 1.5rem !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  margin: 0 !important;
  padding: 0 !important;
  height: auto !important;
  max-width: 100% !important;
  line-height: 1.25 !important;
  font-size: 0.875rem !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  display: block !important;
  background: transparent !important;
}

.pur015-search-grid .pur015-pick-slot :deep(.vs__search),
.pur015-search-grid .pur015-bc-slot :deep(.vs__search) {
  margin: 0 !important;
  padding: 0 !important;
  height: calc(var(--pur015-control-h) - 2px) !important;
  line-height: calc(var(--pur015-control-h) - 2px) !important;
  font-size: 0.875rem !important;
}

.pur015-search-grid .pur015-pick-slot :deep(.vs__actions),
.pur015-search-grid .pur015-bc-slot :deep(.vs__actions) {
  display: flex !important;
  align-items: center !important;
  padding: 0 2px 0 0 !important;
  flex-shrink: 0 !important;
  margin-left: auto !important;
}

.pur015-search-panel .pur015-date-slot :deep(> div.flex.justify-start.items-center) {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0;
  margin: 0 !important;
  gap: 0.25rem !important;
}

.pur015-search-panel .pur015-date-slot :deep(> div.flex > div.inline-flex.h-8) {
  flex: 1 1 auto;
  min-width: 0;
  max-width: 100%;
  width: 100%;
  gap: 0.125rem !important;
}

.pur015-search-panel .pur015-date-slot :deep(input[type="date"]) {
  box-sizing: border-box;
  height: var(--pur015-control-h) !important;
  min-height: var(--pur015-control-h) !important;
  max-height: var(--pur015-control-h) !important;
  border: 1px solid var(--pur015-control-border) !important;
  width: auto !important;
  flex: 1 1 0;
  min-width: 5.25rem;
  max-width: none;
  padding-left: 0.45rem;
  padding-right: 0.25rem;
  font-size: 0.875rem;
}

.pur015-search-panel .pur015-date-slot :deep(input[type="date"]:focus) {
  border-color: #3b82f6 !important;
}

.pur015-search-panel .pur015-date-slot :deep(div.inline-flex.h-8 > span) {
  flex-shrink: 0;
}

.pur015-search-panel .pur015-date-slot :deep(div.inline-flex.h-8 > button) {
  flex-shrink: 0;
  width: 1.65rem !important;
  height: 1.65rem !important;
  min-width: 1.65rem;
  margin-left: 0 !important;
}

.pur015-bc-slot :deep(> div.flex.text-base) {
  margin: 0 !important;
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0;
  gap: 0 !important;
}

.pur015-hint {
  margin-left: 0.5rem;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
}

.pur015-grid-body {
  min-height: 12rem;
}

/* 팝업: body Teleport + Swal(13050) 아래, 조회 AREA(z-10) 위 — 배경 클릭 차단 */
.pur015-popup-backdrop {
  position: fixed;
  inset: 0;
  z-index: 11000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(0 0 0 / 0.5);
  pointer-events: auto;
}

.pur015-popup-dialog {
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: min(75vw, 72rem);
  height: min(80vh, 52rem);
  max-height: 90vh;
  padding: 1.25rem 1.5rem;
  border-radius: 1rem;
  background: #fff;
  box-shadow: 0 20px 40px rgb(0 0 0 / 0.2);
  overflow: hidden;
  pointer-events: auto;
}

.pur015-popup-head {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.pur015-popup-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.4;
  color: rgb(17 24 39);
}

.pur015-popup-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.pur015-popup-fields {
  box-sizing: border-box;
  flex-shrink: 0;
  margin-bottom: 0.75rem;
  min-width: 0;
  padding: 0.875rem 1.25rem;
  border-radius: 0.5rem;
  background: #f3f4f6;
}

.pur015-popup-grid {
  display: grid;
  width: 100%;
  min-width: 0;
  grid-template-columns:
    minmax(0, var(--pur015-popup-label)) minmax(0, 1fr)
    minmax(0, var(--pur015-popup-label)) minmax(0, 1fr);
  column-gap: 0.75rem;
  row-gap: var(--pur015-popup-gap);
  align-items: center;
}

.pur015-popup-label {
  min-width: 0;
  max-width: var(--pur015-popup-label);
}

.pur015-popup-label-inner {
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

.pur015-popup-cell {
  display: flex;
  min-width: 0;
  align-items: center;
}

.pur015-popup-cell--span {
  grid-column: 2 / -1;
}

.pur015-popup-input {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  height: 2rem;
  min-height: 2rem;
  border-radius: 0.375rem;
  border: 1px solid var(--pur015-popup-border) !important;
  background-color: #fff;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: rgb(55 65 81);
}

.pur015-popup-input:disabled {
  background-color: rgb(229 231 235);
  color: rgb(75 85 99);
}

.pur015-popup-input--editable:focus {
  border-color: #3b82f6 !important;
  outline: none;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.35);
}

.pur015-popup-grid-wrap {
  display: flex;
  min-height: 0;
  min-width: 0;
  flex: 1 1 auto;
  flex-direction: column;
  overflow: hidden;
}

.pur015-popup-grid-body {
  min-height: 12rem;
}
</style>
