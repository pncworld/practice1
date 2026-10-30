<!-- /*--############################################################################
# Filename : STK32_001INS.vue                                                  
# Description : 자재관리 > 주문 관리 > 주문출고확정.               
# Date :2025-09-25                                                            
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <!-- 조회조건 -->
  <!-- pl-5: 셸 w-right가 pl0이라 그리드가 좌측 메뉴에 붙음 → 우측 pd20과 맞춤 -->
  <div class="stk321-page flex h-full min-h-0 flex-col pl-5" @click="handleParentClick">
    <div class="flex shrink-0 justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center space-x-2 pr-5">
        <button @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>

        <button @click="deleteButton" class="button delete md:w-auto w-14">
          삭제
        </button>
        <button @click="excelButton" class="button excel">엑셀</button>
        <button
          @click="saveButton2"
          class="button new md:w-auto w-14"
          :disabled="bulkConfirming">
          일괄확정
        </button>
      </div>
    </div>
    <div
      class="stk321-search-panel z-10 mt-3 w-full min-w-0 shrink-0 rounded-lg bg-gray-200">
      <div class="stk321-search-grid min-w-0">
        <div class="stk321-cell">
          <div class="stk321-sg-label">청구일자</div>
          <div class="stk321-cell-field stk321-range-slot min-w-0">
            <Datepicker2
              omit-main-label
              filter-bar-align
              :mainName="'청구일자'"
              @endDate="endDate"
              :initToday="1"
              :initToday2="-30"
              @startDate="startDate"></Datepicker2>
          </div>
        </div>
        <div class="stk321-cell">
          <div class="stk321-sg-label">출고일자</div>
          <div class="stk321-cell-field stk321-date-slot min-w-0">
            <Datepicker1
              :mainName="'출고일자'"
              :initToday="1"
              @dateValue="dateValue"></Datepicker1>
          </div>
        </div>
        <div class="stk321-cell">
          <label class="stk321-sg-label" for="stk32-001-status">출고상태</label>
          <div class="stk321-cell-field min-w-0">
            <select
              id="stk32-001-status"
              class="stk321-control"
              v-model="cond3">
              <option value="01">미출고</option>
              <option value="02">출고완료</option>
            </select>
          </div>
        </div>

        <!-- 2행: 출고매장 | 입고매장(3콤보, 2칸) -->
        <div class="stk321-cell">
          <label class="stk321-sg-label" for="stk32-001-out-store">출고매장</label>
          <div class="stk321-cell-field min-w-0">
            <select
              id="stk32-001-out-store"
              class="stk321-control"
              v-model="cond">
              <option :value="i.lngStoreCode" v-for="i in optionList" :key="i.lngStoreCode">
                {{ i.strName }}
              </option>
            </select>
          </div>
        </div>

        <div class="stk321-cell">
          <div class="stk321-sg-label">입고매장</div>
          <div class="stk321-cell-field stk321-pick-slot min-w-0">
            <PickStore
              compact-search-bar
              :compact-store-combo-max-rem="96"
              main-name=""
              :hideGroup="false"
              :hideAttr="false"
              @update:storeCd="lngStoreCode"
              :defaultStore="true"
              :defaultStoreNm="'전체'"
              :setDynamicStoreClass="'!h-8 !p-0'"
              :mainName="'입고매장'"></PickStore>
          </div>
        </div>
      </div>
    </div>
    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="mt-3 min-h-0 w-full flex-1">
      <Realgrid
        :progname="'STK32_001INS_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :setStateBar="false"
        :documentTitle="'STK32_001INS'"
        @updatedRowData="updatedRowData"
        @clickedButtonCol="clickedButtonCol"
        @dblclickedRowData="dblclickedRowData"
        :checkRenderEditable="true"
        :checkRowAuto="false"
        :checkRowAuto2="true"
        :checkRowAuto2Col="'Selected'"
        :documentSubTitle="documentSubTitle"
        :rowStateeditable="false"
        :exporttoExcel="exportExcel">
      </Realgrid>
    </div>
  </div>

  <Teleport to="body">
  <div
    v-if="open"
    class="stk321-popup-backdrop"
    @mousedown.self.prevent>
    <div
      class="stk321-popup"
      role="dialog"
      aria-modal="true"
      aria-label="주문출고확정"
      :style="confirmPop.style"
      @mousedown.stop
      @keydown.esc="open = false">
      <div class="stk321-popup-head" @mousedown="onConfirmHeadDown">
        <h2 class="stk321-popup-title">주문출고확정</h2>
        <div class="stk321-popup-actions" @mousedown.stop>
          <button
            type="button"
            class="pnc-sub-btn"
            :disabled="disabled"
            @click="saveButton">
            <svg class="pnc-sub-btn__icon" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M3.2 8.4 6.4 11.4 12.8 4.8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            저장
          </button>
          <button type="button" class="pnc-sub-btn pnc-sub-btn--gray" @click="open = false">
            <svg class="pnc-sub-btn__icon" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M4 4l8 8M12 4 4 12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
            </svg>
            닫기
          </button>
        </div>
      </div>

      <div class="stk321-form-grid">
        <label class="stk321-form-label" for="stk32-001-pop-date">출고일자</label>
        <div class="stk321-form-value">
          <input
            id="stk32-001-pop-date"
            type="date"
            class="stk321-pop-control"
            v-model="scond"
            :disabled="disabled"
            @change="searchButton2" />
        </div>
        <label class="stk321-form-label" for="stk32-001-pop-out">출고매장</label>
        <div class="stk321-form-value">
          <input
            id="stk32-001-pop-out"
            type="text"
            class="stk321-pop-control"
            v-model="scond2"
            disabled />
        </div>
        <label class="stk321-form-label" for="stk32-001-pop-in">입고매장</label>
        <div class="stk321-form-value">
          <input
            id="stk32-001-pop-in"
            type="text"
            class="stk321-pop-control"
            v-model="scond3"
            disabled />
        </div>
      </div>

      <div class="stk321-popup-grid">
        <Realgrid
          :progname="'STK32_001INS_VUE'"
          :progid="2"
          :rowData="rowData2"
          :documentTitle="'STK32_001INS'"
          :rowStateeditable="false"
          :editableColId="'dblMoveQty'"
          @updatedRowData="updatedRowData2"
          @realgridname="onPopupGridName"
          :documentSubTitle="documentSubTitle2"
          :exporttoExcel="exporttoExcel2"
          :setStateBar="false"></Realgrid>
      </div>

      <div class="stk321-memo">
        <div class="stk321-memo-row">
          <label class="stk321-form-label" for="stk32-001-pop-memo">본사메모</label>
          <textarea
            id="stk32-001-pop-memo"
            class="stk321-memo-field"
            :disabled="disabled"
            @input="setCond4"
            v-model="scond4"></textarea>
        </div>
        <div class="stk321-memo-row">
          <label class="stk321-form-label" for="stk32-001-pop-demand-memo">청구메모</label>
          <textarea
            id="stk32-001-pop-demand-memo"
            class="stk321-memo-field"
            v-model="scond5"
            disabled></textarea>
        </div>
      </div>

      <div
        class="stk321-popup-resize"
        title="크기 조절"
        @mousedown.stop="onConfirmResizeDown"></div>

      <!-- 공통 로딩(BasicLayout, z-index 100)은 body 로 옮긴 팝업 뒤에 가려지므로 팝업 안에 표시 -->
      <div v-if="store.state.loading" class="stk321-popup-loading" role="status" aria-label="처리 중">
        <img :src="loadingGif" alt="" />
      </div>
    </div>
  </div>
  </Teleport>
  <!-- 그리드 영역 -->
</template>

<script setup>
import {
  deleteDemandMaster,
  deleteStockConfirmList,
  getOptionStoreList,
  getStockDetail2,
  getStockDetail3,
  getStockOrderReleaseList,
  saveStockConfirm,
  saveStockConfirmAll,
} from "@/api/mistock";
import PageName from "@/components/pageName.vue";
import Realgrid from "@/components/realgrid.vue";
import { rgGetInstance } from "@/components/realgridInstanceRegistry.js";
import { formatLocalDate, insertPageLog } from "@/customFunc/customFunc";
import { useFloatPopup } from "@/utils/floatPopup";
import loadingGif from "@/assets/images/loading.gif";
import { nextTick, onMounted, ref, watch } from "vue";

import Datepicker1 from "@/components/Datepicker1.vue";
import Datepicker2 from "@/components/Datepicker2.vue";
import PickStore from "@/components/pickStore.vue";
import Swal from "sweetalert2";
import { useStore } from "vuex";

/** 주문출고확정 팝업 — 이동·크기 조절 (STK01_011INS 청구 등록 팝업과 같은 방식) */
const confirmPop = useFloatPopup({
  width: 1536, // 가로: 청구 등록(STK01_011INS) 팝업과 동일
  height: 760,
  minWidth: 720,
  minHeight: 480,
  maxWidthRatio: 0.98,
  maxHeightRatio: 0.9,
});

const popupGridName = ref("");
const onPopupGridName = (name) => {
  popupGridName.value = name;
};

const onConfirmHeadDown = (event) => {
  confirmPop.startDrag(event);
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

const onConfirmResizeDown = (event) => {
  confirmPop.startResize(event);
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
const cond2 = ref("0");
const cond3 = ref("01");
const cond4 = ref("");
const cond5 = ref("0");
const tempSeeStore = ref(false);
const reportCheckData = ref("0");
const progId = ref("1");
const mdate = ref("");
const dateValue = (e) => {
  mdate.value = e.replaceAll("-", "");
  scond.value = e;
};
const lngStoreCode = (e) => {
  cond2.value = e;
};
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

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getOptionStoreList(store.state.userData.lngStoreGroup, 0);

  optionList.value = res.data.List;

  if (res.data.List.length > 0) {
    cond.value = res.data.List[0].lngStoreCode;
  }

  //console.log(store.state.storeCd);
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
    "출고매장 : " +
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

const updatedrowdata = ref([]);
const updatedRowData = (e) => {
  console.log(e);
  updatedrowdata.value = e;
};
const saveButton = async () => {
  try {
    const itemids = updatedrowdata2.value
      .map((item) => item.lngStockID)
      .join("\u200b");
    const qtys = updatedrowdata2.value
      .map((item) => item.dblMoveQty)
      .join("\u200b");
    const unitprices = updatedrowdata2.value
      .map((item) => item.curUnitPrice)
      .join("\u200b");
    const cursupplys = updatedrowdata2.value
      .map((item) => item.curSupply)
      .join("\u200b");
    const curtaxes = updatedrowdata2.value
      .map((item) => item.curTax)
      .join("\u200b");
    const demandnos = updatedrowdata2.value
      .map((item) => item.strDemandNo)
      .join("\u200b");
    const demandseqs = updatedrowdata2.value
      .map((item) => item.lngDemandSeq)
      .join("\u200b");
    store.state.loading = true;
    const res = await saveStockConfirm(
      store.state.userData.lngStoreGroup,
      tempStoreCd.value,
      tempStoreCd2.value,
      scond.value.replaceAll("-", ""),
      itemids,
      qtys,
      unitprices,
      cursupplys,
      curtaxes,
      demandnos,
      demandseqs,
      store.state.userData.lngSequence,
      scond4.value
    );

    store.state.loading = false;
    if (res.data.RESULT_CD == "00") {
      await Swal.fire({
        title: "성공",
        text: "설정하신 출고수량으로 출고를 확정하였습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
    } else {
      await Swal.fire({
        title: "실패",
        text: "설정하신 출고수량으로 출고확정을 실패하였습니다.",
        icon: "error",
        confirmButtonText: "확인",
      });
    }
    disabled.value = true;
  } catch (error) {
  } finally {
    open.value = false;
    searchButton();
  }
};

const searchButton = async () => {
  try {
    store.state.loading = true;
    const res = await getStockOrderReleaseList(
      store.state.userData.lngStoreGroup,
      cond.value,
      cond2.value,
      sdate.value.replaceAll("-", ""),
      edate.value.replaceAll("-", ""),
      mdate.value,
      cond3.value,
      store.state.userData.strLanguage
    );

    console.log(res);

    store.state.loading = false;
    rowData.value = res.data.List;
    updatedrowdata.value = res.data.List.map((item) => ({
      ...item,
      Selected: false,
    }));
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
  console.log(e);
  tempColID.value = e;
};

const clickedrowdata = ref("");

const open = ref(false);
watch(open, (isOpen) => {
  if (isOpen) {
    confirmPop.place();
    nextTick(() => refreshPopupGridSize());
  }
});
const disabled = ref(false);

const rowData2 = ref([]);
const scond4 = ref("");
const scond5 = ref("");

const editableColId = ref("");
const tempStoreCd = ref("");
const tempStoreCd2 = ref("");
const dblclickedRowData = async (e) => {
  console.log(e);
  //   console.log(tempColID.value);

  tempStoreCd.value = e[1];
  tempStoreCd2.value = e[2];
  //tempMoveDate.value = e[4];

  editableColId.value = "";
  if (
    tempColID.value == "strStoreName" ||
    tempColID.value == "strDemandNo_Dummy"
  ) {
    if (e[11] == "01" || e[11] == "04") {
      disabled.value = false;
    } else {
      disabled.value = true;
    }

    //disabled.value = false;

    //scond.value = formatLocalDate(new Date());
    scond2.value =
      store.state.storeCd.filter((item) => item.lngStoreCode == e[1])[0]
        ?.strName || "";
    scond3.value =
      store.state.storeCd.filter((item) => item.lngStoreCode == e[2])[0]
        ?.strName || "";

    try {
      store.state.loading = true;
      const res = await getStockDetail3(
        store.state.userData.lngStoreGroup,
        e[2],
        e[6],
        e[7],
        e[14]
      );

      console.log(res);

      store.state.loading = false;
      rowData2.value = res.data.List;
      updatedrowdata2.value = res.data.List;
      scond4.value = res.data.List2[0]?.strComments || "";
      scond5.value = res.data.List3[0]?.strComments || "";
    } catch (error) {}
    open.value = true;
  }
};

const scond = ref("");
const scond2 = ref("");
const scond3 = ref("");

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

    console.log(res);

    store.state.loading = false;
    rowData2.value = res.data.List;
    scond4.value = res.data.List2[0].strComments;
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
      text: "삭제할 출고 사항을 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  try {
    const storecds = filtered.map((item) => item.lngStoreCode).join("\u200b");
    const dstorecds = filtered
      .map((item) => item.lngDesStoreCode)
      .join("\u200b");
    const demandnos = filtered.map((item) => item.strDemandNo).join("\u200b");
    const mdates = filtered.map((item) => item.strMoveDate).join("\u200b");
    const edates = filtered.map((item) => item.strExpectedDate).join("\u200b");

    const res = await deleteStockConfirmList(
      store.state.userData.lngStoreGroup,
      storecds,
      dstorecds,
      demandnos,
      mdates,
      edates,
      store.state.userData.lngSequence
    );

    console.log(res);

    if (res.data.RESULT_CD == "00") {
      await Swal.fire({
        title: "성공",
        text: "주문 출고 확정이 삭제 되었습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
    } else {
      await Swal.fire({
        title: "경고",
        text: "주문 출고 확정삭제를 실패하였습니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
    }
  } catch (error) {
  } finally {
    searchButton();
  }
};

const setCond4 = (e) => {
  scond4.value = e.target.value;
};

/** 일괄확정 처리 중 — 중복 클릭 방지 */
const bulkConfirming = ref(false);

const saveButton2 = async () => {
  if (bulkConfirming.value) return;
  const filtered = updatedrowdata.value.filter((item) => item.Selected == true);

  if (filtered.length == 0) {
    Swal.fire({
      title: "경고",
      text: "일괄 확정할 사항을 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  bulkConfirming.value = true;
  store.state.loading = true;
  try {
    const storecds = filtered.map((item) => item.lngStoreCode).join("\u200b");

    const dstorecds = filtered
      .map((item) => item.lngDesStoreCode)
      .join("\u200b");
    const demandnos = filtered.map((item) => item.strDemandNo).join("\u200b");
    const mdates = filtered.map((item) => item.strMoveDate).join("\u200b");
    const edates = filtered.map((item) => item.strExpectedDate).join("\u200b");
    const res = await saveStockConfirmAll(
      store.state.userData.lngStoreGroup,
      storecds,
      dstorecds,
      demandnos,
      mdates,
      edates,
      store.state.userData.lngSequence
    );

    console.log(res);
    store.state.loading = false;

    if (res.data.RESULT_CD == "00") {
      await Swal.fire({
        title: "성공",
        text: "선택하신 주문 출고 확정이 완료되었습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
    } else {
      await Swal.fire({
        title: "경고",
        text: "선택하신 주문 출고 확정을 실패하였습니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
    }
  } catch (error) {
  } finally {
    store.state.loading = false;
    await searchButton();
    bulkConfirming.value = false;
  }
};
</script>

<style scoped>
.stk321-page {
  --stk321-item-gap: 1.25rem; /* 항목명 ↔ 콤보 */
  --stk321-col-gap: 2.5rem;
  --stk321-row-gap: 0.625rem;
  /* 앞·뒤 공백: 패널 끝 → 첫 항목명 글자 = 마지막 콤보 끝 → 패널 끝 (STK05_013RPT 와 같은 값) */
  --stk321-panel-pad-x: 6.5rem;
  --stk321-row-min-h: 2rem;
  --stk321-control-border: #cbd5e1;
  --stk321-control-h: 2rem;
  /* 날짜 칸 한 개 = 출고일자 = 출고상태 (청구일자의 시작·끝 날짜 칸도 같은 크기) */
  --stk321-ctl-w: 12rem;
  --stk321-range-tilde-w: 0.75rem;
  --stk321-range-btn-w: 2rem;
  --stk321-range-gap: 0.25rem;
  /* 청구일자 전체 폭(계산값). 출고매장·입고매장은 --stk321-ctl-w 로 다른 콤보와 통일 */
  --stk321-field-w: calc(
    var(--stk321-ctl-w) * 2 + var(--stk321-range-tilde-w) + var(--stk321-range-btn-w) +
      var(--stk321-range-gap) * 3
  );
  --stk321-pick-sub-w: 5.25rem; /* 입고매장 그룹·속성 콤보(계정에 따라 표시) */
}

/* 조회 AREA — 3열, 열마다 시작선 정렬(오·열), 열 사이 간격 균등, 앞·뒤 pad 동일 */
.stk321-search-panel {
  box-sizing: border-box;
  padding-block: 0.75rem;
  padding-inline: var(--stk321-panel-pad-x);
}

.stk321-search-grid {
  display: grid;
  grid-template-columns: repeat(3, max-content);
  justify-content: space-between;
  column-gap: var(--stk321-col-gap);
  row-gap: var(--stk321-row-gap);
  align-items: center;
  width: 100%;
  min-width: 0;
}

.stk321-cell {
  display: flex;
  min-width: 0;
  min-height: var(--stk321-row-min-h);
  align-items: center;
  gap: var(--stk321-item-gap);
}

/* 항목명은 4글자로 모두 같아 글자 폭만큼만 차지 — 칸 안 숨은 여백 없이 앞 공백 = 패널 pad */
.stk321-sg-label {
  flex: 0 0 auto;
  width: max-content;
  min-height: var(--stk321-row-min-h);
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

.stk321-cell-field {
  flex: 0 0 auto;
  min-width: 0;
  min-height: var(--stk321-row-min-h);
  display: flex;
  align-items: center;
}

/* 기본: 콤보·날짜 한 개 = --stk321-ctl-w */
.stk321-cell-field > * {
  min-width: 0;
  width: var(--stk321-ctl-w);
}

.stk321-range-slot > * {
  width: var(--stk321-field-w);
}

.stk321-control {
  box-sizing: border-box;
  height: var(--stk321-control-h);
  min-height: var(--stk321-control-h);
  max-height: var(--stk321-control-h);
  width: var(--stk321-ctl-w); /* 출고일자·출고상태·출고매장·입고매장 콤보 같은 폭 */
  min-width: 0;
  border: 1px solid var(--stk321-control-border);
  border-radius: 0.375rem;
  background: #fff;
  padding: 0 0.5rem;
  font-size: 0.875rem;
  color: rgb(55 65 81);
}

.stk321-control:focus {
  border-color: #3b82f6;
  outline: none;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.25);
}

/*
 * 청구일자 Datepicker2 (filterBarAlign) — 구성 요소를 모두 고정 크기로 두어 전체 폭을 계산값으로 확정
 *   날짜 칸 = --stk321-ctl-w (출고일자 날짜 칸과 같은 크기) × 2
 *   「~」 = --stk321-range-tilde-w, 달력 버튼 = --stk321-range-btn-w, 요소 사이 = --stk321-range-gap × 3
 *   합계 = --stk321-field-w → 출고매장·입고매장 폭으로 그대로 사용 (끝선 일치)
 */
.stk321-range-slot :deep(> div.flex.justify-start.items-center) {
  width: var(--stk321-field-w) !important;
  max-width: none !important;
  min-width: 0;
  margin: 0 !important;
  gap: 0 !important;
}

.stk321-range-slot :deep(> div.flex > div.inline-flex.h-8) {
  flex: 0 0 auto;
  width: var(--stk321-field-w);
  min-width: 0;
  margin: 0 !important;
  padding: 0 !important;
  gap: var(--stk321-range-gap) !important;
}

.stk321-range-slot :deep(input[type="date"]) {
  box-sizing: border-box;
  flex: 0 0 var(--stk321-ctl-w);
  width: var(--stk321-ctl-w) !important;
  min-width: 0;
  max-width: none !important;
  height: var(--stk321-control-h) !important;
  margin: 0 !important;
  border: 1px solid var(--stk321-control-border) !important;
  padding-left: 0.75rem;
  padding-right: 0.5rem;
  font-size: 0.875rem;
}

.stk321-range-slot :deep(div.inline-flex.h-8 > span) {
  flex: 0 0 var(--stk321-range-tilde-w);
  width: var(--stk321-range-tilde-w);
  margin: 0 !important;
  padding: 0 !important;
  text-align: center;
}

.stk321-range-slot :deep(div.inline-flex.h-8 > button) {
  flex: 0 0 var(--stk321-range-btn-w);
  width: var(--stk321-range-btn-w) !important;
  min-width: var(--stk321-range-btn-w) !important;
  height: var(--stk321-control-h) !important;
  margin: 0 !important;
  padding: 0 !important;
}

/* 출고일자 Datepicker1 — 바깥 라벨을 쓰므로 안쪽 제목 숨김 */
.stk321-date-slot :deep(div.space-x-5 > span) {
  display: none;
}

.stk321-date-slot :deep(div.space-x-5) {
  margin: 0 !important;
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;
}

/* space-x-5 가 숨긴 제목 다음 입력칸에 남기는 왼쪽 여백(1.25rem) 제거 — 아래 입고매장과 시작선 일치 */
.stk321-date-slot :deep(div.space-x-5 > *) {
  margin-left: 0 !important;
  margin-right: 0 !important;
}

.stk321-date-slot :deep(input[type="date"]) {
  box-sizing: border-box;
  width: var(--stk321-ctl-w) !important;
  max-width: none !important;
  min-width: 0;
  height: var(--stk321-control-h);
  padding-left: 0.75rem;
  padding-right: 0.5rem;
  font-size: 0.875rem;
  border: 1px solid var(--stk321-control-border) !important;
  border-radius: 0.375rem;
}

.stk321-date-slot :deep(input[type="date"]:focus),
.stk321-range-slot :deep(input[type="date"]:focus) {
  border-color: #3b82f6 !important;
}

/* 입고매장 PickStore (compact) — 안쪽 제목 숨김. 매장 콤보 = 출고일자·출고상태·출고매장과 같은 --stk321-ctl-w
   (그룹·속성 콤보가 보이는 계정이면 그 앞에 작게 붙음) */
.stk321-cell-field.stk321-pick-slot > * {
  width: auto;
}

.stk321-pick-slot :deep(> div.flex.text-base) {
  width: auto !important;
  max-width: none !important;
  min-width: 0;
  margin: 0 !important;
  align-items: center;
  gap: 0.5rem !important;
}

.stk321-pick-slot :deep(> div.flex > div:first-child) {
  display: none;
}

.stk321-pick-slot :deep(select) {
  box-sizing: border-box;
  width: var(--stk321-pick-sub-w) !important;
  height: var(--stk321-control-h) !important;
  border: 1px solid var(--stk321-control-border) !important;
}

.stk321-pick-slot :deep(.relative.min-w-0.flex-1) {
  flex: 0 0 var(--stk321-ctl-w) !important;
  width: var(--stk321-ctl-w) !important;
  min-width: 0 !important;
  max-width: var(--stk321-ctl-w) !important;
}

.stk321-pick-slot :deep(.pickstore-vs-shell) {
  box-sizing: border-box;
  width: 100% !important;
  max-width: none !important;
  height: var(--stk321-control-h) !important;
  border: 1px solid var(--stk321-control-border) !important;
}

/* 창이 좁으면 2열로 (열 시작선 정렬은 유지) */
@media (max-width: 1600px) {
  .stk321-search-grid {
    grid-template-columns: repeat(2, max-content);
  }
}

/* ── 주문출고확정 팝업: body Teleport + Swal(13050) 아래 — 이동·크기 조절(floatPopup) ── */
.stk321-popup-backdrop {
  position: fixed;
  inset: 0;
  z-index: 11000;
  background: rgb(0 0 0 / 0.5);
  pointer-events: auto;
}

.stk321-popup {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.5rem;
  background: #fff;
  border-radius: 0.75rem;
  box-shadow: 0 20px 40px rgb(15 23 42 / 0.18);
  overflow: hidden;
  pointer-events: auto;
}

/* 팝업 padding 위·좌우 여백까지 끌기 영역 — 맨 위를 잡아도 이동 */
.stk321-popup-head {
  display: flex;
  flex-shrink: 0;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin: -1.5rem -1.5rem 0;
  padding: 1.5rem 1.5rem 0.75rem;
  border-bottom: 1px solid #d1d5db;
  cursor: move;
  user-select: none;
}

.stk321-popup-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: rgb(17 24 39);
}

.stk321-popup-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  cursor: default;
}

/* 팝업 안 로딩 표시 — 처리 중에는 팝업 전체를 덮어 추가 클릭도 막음 */
.stk321-popup-loading {
  position: absolute;
  inset: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(255 255 255 / 0.55);
  cursor: progress;
}

.stk321-popup-loading img {
  max-width: 80px;
  max-height: 80px;
}

.stk321-form-grid {
  display: grid;
  flex-shrink: 0;
  grid-template-columns: 6.25rem minmax(0, 1fr) 6.25rem minmax(0, 1fr) 6.25rem minmax(0, 1fr);
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  overflow: hidden;
}

.stk321-form-label {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 2.5rem;
  padding: 0.25rem 0.375rem;
  border: 1px solid #e5e7eb;
  background: #edf2f7;
  color: #374151;
  font-size: 0.8125rem;
  font-weight: 600;
  text-align: center;
  word-break: keep-all;
}

.stk321-form-value {
  display: flex;
  align-items: center;
  min-width: 0;
  min-height: 2.5rem;
  padding: 0.25rem 0.5rem;
  border: 1px solid #e5e7eb;
}

.stk321-pop-control {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  height: 2rem;
  padding: 0 0.5rem;
  border: 1px solid var(--stk321-control-border, #cbd5e1);
  border-radius: 0.375rem;
  background: #fff;
  font-size: 0.875rem;
  color: rgb(55 65 81);
}

.stk321-pop-control:focus {
  border-color: #3b82f6;
  outline: none;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.25);
}

.stk321-pop-control:disabled {
  background: #f3f4f6;
  color: #4b5563;
  cursor: not-allowed;
}

.stk321-popup-grid {
  flex: 1 1 auto;
  min-height: 0;
  width: 100%;
}

.stk321-memo {
  display: grid;
  flex-shrink: 0;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

.stk321-memo-row {
  display: grid;
  grid-template-columns: 6.25rem minmax(0, 1fr);
  min-height: 4.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  overflow: hidden;
}

.stk321-memo-row .stk321-form-label {
  align-self: stretch;
}

.stk321-memo-field {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  min-height: 4.5rem;
  padding: 0.5rem 0.75rem;
  border: 0;
  resize: none;
  font-size: 0.875rem;
  line-height: 1.4;
  color: rgb(55 65 81);
  background: #fff;
}

.stk321-memo-field:focus {
  outline: none;
}

.stk321-memo-field:disabled {
  background: #f3f4f6;
  color: #4b5563;
}

.stk321-popup-resize {
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
</style>
