<!-- /*--############################################################################
# Filename : PUR02_030RPT_02.vue                                                  
# Description : 구매관리2 > 매입 관리 > 매장별 매입원가율Ⅱ                      
# Date :2025-09-25                                                             
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <!-- 조회조건 -->
  <!-- pl-5: 셸 w-right가 pl0이라 그리드가 좌측 메뉴에 붙음 → 우측 pd20과 맞춤 -->
  <div class="pur0302-page flex h-full min-h-0 flex-col pl-5" @click="handleParentClick">
    <div class="flex shrink-0 justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center space-x-2 pr-5">
        <button @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <button @click="excelButton" class="button w-auto excel">엑셀</button>
      </div>
    </div>
    <div
      class="pur0302-search-panel z-10 mt-3 w-full min-w-0 shrink-0 rounded-lg bg-gray-200">
      <div class="pur0302-search-grid min-w-0">
        <div class="pur0302-cell">
          <div class="pur0302-sg-label">선택기간</div>
          <div class="pur0302-cell-field pur0302-period">
            <div class="pur0302-ym-slot">
              <DatePicker4 @month="month" @year="year" :mainName="'선택기간'">
              </DatePicker4>
            </div>
            <span class="pur0302-tilde">~</span>
            <div class="pur0302-ym-slot">
              <DatePicker4 @month="month2" @year="year2" :mainName="''">
              </DatePicker4>
            </div>
          </div>
        </div>
        <div class="pur0302-cell">
          <div class="pur0302-sg-label">매장</div>
          <div class="pur0302-cell-field pur0302-pick-slot">
            <PickStore
              compact-search-bar
              :compact-store-combo-max-rem="96"
              main-name=""
              @update:storeGroup="lngStoreGroup"
              :defaultStoreNm="'전체'"
              @storeNm="excelStore"
              :defaultStoreType2="true"
              :defaultStore="true"
              @update:storeCd="lngStoreCode"></PickStore>
          </div>
        </div>
      </div>
    </div>

    <!-- 조회조건 -->
    <!-- 트리 일괄 펼치기/접기 — PUR02_029RPT_02 와 같은 아이콘 -->
    <div class="pur0302-tree-bar">
      <button
        type="button"
        class="pur0302-tree-all"
        :title="treeAllOpen ? '모두 접기' : '모두 펼치기'"
        :aria-label="treeAllOpen ? '모두 접기' : '모두 펼치기'"
        @click="toggleTreeExpandAll">
        <img
          :src="treeAllOpen ? '/icon/folder-collapse.svg?v=6' : '/icon/folder-expand.svg?v=6'"
          alt="" />
      </button>
    </div>
    <!-- 그리드 영역 -->
    <div class="min-h-0 w-full flex-1">
      <Realgrid
        ref="treeGridRef"
        :tree-square-expander="true"
        :tree-icon-images="['folder-close.svg?v=6', 'folder-open.svg?v=6']"
        :progname="'PUR02_030RPT_02_VUE'"
        :progid="3"
        :rowData="rowData"
        :reload="reload"
        :mergeColumns2="true"
        :mergeColumnGroupSubList2="[
          ['lngCostPrice', 'lngCostRate'],
          [
            'lngFoodTotal',
            'lngFoodRate',
            'rawMatTax',
            'rawMatDeTax',
            'productTax',
            'productDeTax',
          ],
          ['expendablesTax', 'lngExpendablesRate'],
          ['curResultCost', 'curTakeCost'],
        ]"
        :mergeColumnGroupName2="['매입원가', '식재', '소모품', '재고']"
        :setStateBar="false"
        :setTreeView="true"
        :documentTitle="'PUR02_030RPT_02'"
        :setFooter="true"
        :dynamicRowHeight2="true"
        :documentSubTitle="documentSubTitle"
        :exporttoExcel="exportExcel">
      </Realgrid>
    </div>
  </div>

  <!-- 그리드 영역 -->
</template>

<script setup>
import { getNbiCornProductCostRate } from "@/api/mipur";
import DatePicker4 from "@/components/DatePicker4.vue";
import PageName from "@/components/pageName.vue";
import PickStore from "@/components/pickStore.vue";
import Realgrid from "@/components/realgrid.vue";
import { insertPageLog } from "@/customFunc/customFunc";
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
import Swal from "sweetalert2";

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  //   const res = await getCommonList(27);

  //   optionList.value = res.data.List.filter((item) => item.strDCode != "01");

  //   const res2 = await getCommonList(24);

  //   optionList2.value = res2.data.List;
});

const reload = ref(false);
/** 트리 일괄 펼치기/접기 (PUR02_029RPT_02 와 같은 방식) */
const treeGridRef = ref(null);
const treeAllOpen = ref(false);
const toggleTreeExpandAll = () => {
  const grid = treeGridRef.value;
  if (!grid) return;
  if (treeAllOpen.value) {
    grid.collapseAllTree();
    treeAllOpen.value = false;
  } else {
    grid.expandAllTree();
    treeAllOpen.value = true;
  }
};
const rowData = ref([]);
const afterSearch = ref(false);

const cond = ref("0");
const cond2 = ref("");

const cond5 = ref(0);
const store = useStore();

const datepicker = ref(null);
const closePopUp = ref(false);
const optionList = ref([]);
const optionList2 = ref([]);
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

const storeCode = ref();
const lngStoreCode = (e) => {
  initGrid();
  storeCode.value = e;
};

const groupCd = ref();
const lngStoreGroup = (e) => {
  groupCd.value = e;
};

const rowData2 = ref([]);

/**
 *  조회 함수
 */
const hideColumnsId = ref([]);
const searchButton = async () => {
  try {
    store.state.loading = true;
    initGrid();

    const res = await getNbiCornProductCostRate(
      groupCd.value,
      storeCode.value,
      y.value + m.value,
      y2.value + m2.value
    );
    console.log(res);

    // 서버 오류(RESULT_CD 99 등)면 빈 그리드만 보이지 않게 알림 (기존: 오류 무시)
    if (res?.data?.RESULT_CD && res.data.RESULT_CD !== "00") {
      rowData.value = [];
      afterSearch.value = false;
      await Swal.fire({
        title: "조회 실패",
        text: res.data.RESULT_NM || "조회 중 오류가 발생했습니다.",
        icon: "error",
        confirmButtonText: "확인",
      });
      return;
    }

    rowData.value = res.data.List;

    //console.log(res);
    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    await Swal.fire({
      title: "조회 실패",
      text: "조회 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
      icon: "error",
      confirmButtonText: "확인",
    });
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
const progid = ref(2);
const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
  treeAllOpen.value = false; // 다시 조회하면 트리는 접힌 상태로 시작

  if (cond.value == "1") {
    progid.value = "2";
  } else {
    progid.value = "3";
  }
  reload.value = !reload.value;
};

//엑셀 버튼 처리 함수
const exportExcel = ref(false);
const exportExcel2 = ref(false);
/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  documentSubTitle.value =
    "선택기간: " +
    y.value +
    m.value +
    "~" +
    y2.value +
    m2.value +
    "\n" +
    "\n" +
    "매장명 :" +
    selectedExcelStore.value;
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
const y2 = ref("");
const year2 = (e) => {
  y2.value = e;
};

const m2 = ref("");
const month2 = (e) => {
  m2.value = e;
};
const y = ref("");
const m = ref("");
const year = (e) => {
  y.value = e;
};

const month = (e) => {
  m.value = e;
};
</script>

<style scoped>
/*
 * 조회 AREA — 확정 스타일(STK32_001INS·STK05_013RPT 기준)
 *  · 콤보 크기 숫자 고정·통일, 앞·뒤 공백 = --pur0302-panel-pad-x (항목명 글자 기준)
 *  · 2칸 max-content + space-between
 */
.pur0302-page {
  --pur0302-item-gap: 1.25rem; /* 항목명 ↔ 콤보 */
  --pur0302-col-gap: 2.5rem;
  --pur0302-panel-pad-x: 6.5rem;
  --pur0302-row-min-h: 2rem;
  --pur0302-control-border: #cbd5e1;
  --pur0302-control-h: 2rem;
  --pur0302-year-w: 6rem; /* 년 콤보 */
  --pur0302-month-w: 4.5rem; /* 월 콤보 */
  --pur0302-ctl-w: 12rem; /* 매장 콤보 */
  --pur0302-pick-sub-w: 7.5rem; /* 매장 그룹·속성 콤보 (그룹명 잘림 방지: 5.25rem → 7.5rem) */
  --pur0302-inline-gap: 0.5rem;
}

.pur0302-search-panel {
  box-sizing: border-box;
  padding-block: 0.75rem;
  padding-inline: var(--pur0302-panel-pad-x);
}

.pur0302-search-grid {
  display: grid;
  grid-template-columns: repeat(2, max-content);
  justify-content: space-between;
  column-gap: var(--pur0302-col-gap);
  row-gap: 0.625rem;
  align-items: center;
  width: 100%;
  min-width: 0;
}

.pur0302-cell {
  display: flex;
  min-width: 0;
  min-height: var(--pur0302-row-min-h);
  align-items: center;
  gap: var(--pur0302-item-gap);
}

/* 항목명은 글자 폭만큼 — 숨은 앞 여백 없이 앞 공백 = 패널 pad */
.pur0302-sg-label {
  flex: 0 0 auto;
  width: max-content;
  min-height: var(--pur0302-row-min-h);
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
  white-space: nowrap;
}

.pur0302-cell-field {
  flex: 0 0 auto;
  min-width: 0;
  min-height: var(--pur0302-row-min-h);
  display: flex;
  align-items: center;
}

/* 선택기간: [년][월] ~ [년][월] */
.pur0302-period {
  gap: var(--pur0302-inline-gap);
}

.pur0302-tilde {
  font-size: 0.875rem;
  color: rgb(55 65 81);
}

/* DatePicker4 — 바깥 항목명 사용: 안쪽 제목·숨은 여백 제거, 콤보 크기·테두리 통일 */
.pur0302-ym-slot :deep(> div.flex) {
  gap: 0.25rem;
}

.pur0302-ym-slot :deep(> div.flex > *) {
  margin-left: 0 !important;
  margin-right: 0 !important;
}

.pur0302-ym-slot :deep(> div.flex > div:first-child) {
  display: none;
}

.pur0302-ym-slot :deep(select) {
  box-sizing: border-box;
  height: var(--pur0302-control-h) !important;
  padding: 0 0.375rem;
  border: 1px solid var(--pur0302-control-border) !important;
  border-radius: 0.375rem;
  background: #fff;
  font-size: 0.875rem;
  color: rgb(55 65 81);
}

.pur0302-ym-slot :deep(> div.flex > div:nth-child(2) select) {
  width: var(--pur0302-year-w) !important;
}

.pur0302-ym-slot :deep(> div.flex > div:nth-child(3) select) {
  width: var(--pur0302-month-w) !important;
}

.pur0302-ym-slot :deep(select:focus) {
  border-color: #3b82f6 !important;
  outline: none;
}

/* 매장 PickStore (compact) — 안쪽 제목 숨김, 그룹·속성은 작게, 매장 콤보 = --pur0302-ctl-w */
.pur0302-pick-slot :deep(> div.flex.text-base) {
  width: auto !important;
  max-width: none !important;
  min-width: 0;
  margin: 0 !important;
  align-items: center;
  gap: var(--pur0302-inline-gap) !important;
}

.pur0302-pick-slot :deep(> div.flex > div:first-child) {
  display: none;
}

.pur0302-pick-slot :deep(select) {
  box-sizing: border-box;
  width: var(--pur0302-pick-sub-w) !important;
  height: var(--pur0302-control-h) !important;
  border: 1px solid var(--pur0302-control-border) !important;
}

.pur0302-pick-slot :deep(.relative.min-w-0.flex-1) {
  flex: 0 0 var(--pur0302-ctl-w) !important;
  width: var(--pur0302-ctl-w) !important;
  min-width: 0 !important;
  max-width: var(--pur0302-ctl-w) !important;
}

.pur0302-pick-slot :deep(.pickstore-vs-shell) {
  box-sizing: border-box;
  width: 100% !important;
  max-width: none !important;
  height: var(--pur0302-control-h) !important;
  border: 1px solid var(--pur0302-control-border) !important;
}

/* 트리 일괄 펼치기 버튼 줄 — 그리드 바로 위 왼쪽 (아이콘·크기는 PUR02_029RPT_02 와 동일) */
.pur0302-tree-bar {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  height: var(--pur0302-row-min-h);
  margin: 0.5rem 0 0.25rem;
}

.pur0302-tree-all {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.6rem;
  height: var(--pur0302-row-min-h);
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.pur0302-tree-all img {
  width: 2.5rem;
  height: 1.92rem;
  display: block;
}

@media (max-width: 1100px) {
  .pur0302-page {
    --pur0302-panel-pad-x: 2rem;
  }

  .pur0302-search-grid {
    grid-template-columns: max-content;
  }
}
</style>
