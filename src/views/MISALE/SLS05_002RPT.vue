/*--############################################################################
# Filename : SLS05_002RPT.vue                                                  
# Description : 매출관리 > 카드별 매출 현황 > 카드 매출 세부 현황.                        
# Date :2025-05-14                                                             
# Author : 권맑음                     
################################################################################*/
<template>
  <div class="flex h-full min-h-0 flex-col" @click="handleParentClick">
    <!-- 상단 버튼 영역 -->
    <div class="flex shrink-0 justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center mr-9 space-x-2 pr-5">
        <button @click="searchButton" class="button search md:w-auto w-14">조회</button>
        <button @click="excelButton" class="button save w-auto excel">엑셀</button>
      </div>
    </div>
    <!-- 조회조건 영역 -->
    <div
      class="sls05-search-panel relative z-10 mt-2 w-full min-w-0 shrink-0 overflow-visible rounded-lg bg-gray-200 py-2.5 xl:py-3"
      :style="{
        '--sls05-control-border': sls05ControlBorder,
        '--sls05-item-gap': sls05ItemGap,
        '--sls05-row-gap': sls05RowGap,
        '--sls05-col-gap': sls05ColGap,
        '--sls05-label-col': sls05LabelCol,
        '--sls05-pick-gap-col': sls05PickGapCol,
        '--sls05-pick-scale': sls05PickScale,
      }">
      <div class="sls05-search-grid min-w-0">
        <!-- 좌: 일자·매입사·승인여부 (1열) -->
        <div class="sls05-left-stack">
          <div class="sls05-left-row">
            <div class="sls05-sg-label">일자</div>
            <div class="sls05-input-col sls05-date-slot min-w-0">
              <Datepicker2
                ref="datepicker"
                omit-main-label
                filter-bar-align
                :closePopUp="closePopUp"
                @endDate="endDate"
                @startDate="startDate"
                @excelDate="excelDate" />
            </div>
          </div>

          <div class="sls05-left-row">
            <div class="sls05-sg-label">매입사</div>
            <div class="sls05-input-col min-w-0">
              <v-select
                v-model="selectCardCorp"
                :options="cardCorp"
                placeholder="전체"
                label="strBuyName"
                class="custom-select2 sls05-buy-vselect"
                append-to-body
                :clearable="true" />
            </div>
          </div>

          <div class="sls05-left-row">
            <div class="sls05-sg-label">승인여부</div>
            <div class="sls05-input-col min-w-0">
              <div class="flex items-center gap-4">
                <label class="flex items-center gap-1.5 text-sm font-normal cursor-pointer">
                  <input type="radio" value="0" v-model="selectedRadioBox" /> 승인
                </label>
                <label class="flex items-center gap-1.5 text-sm font-normal cursor-pointer">
                  <input type="radio" value="1" v-model="selectedRadioBox" /> 취소
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- 3열: 매장명 (우측·확대) -->
        <div class="sls05-col2-gap" aria-hidden="true"></div>
        <div class="sls05-pick-span">
          <pickStoreSingle
            @lngStoreCode="lngStoreCodes"
            @lngStoreGroup="lngStoreGroup"
            @lngStoreAttrs="lngStoreAttrs"
            @lngSupervisor="lngSupervisor"
            @excelStore="excelStore" />
        </div>
      </div>
    </div>
    <!-- 그리드 영역 -->
    <div class="w-full flex-1 min-h-0 mt-2">
      <Realgrid
        :progname="'SLS05_002RPT_VUE'"
        :progid="progid"
        :rowData="rowData"
        :reload="reload"
        :rowStateeditable="false"
        :setFooter="true"
        :setGroupFooter="true"
        :setGroupColumnId="'strStore'"
        :exporttoExcel="exportExcel"
        :documentTitle="'SLS05_002RPT'"
        :documentSubTitle="documentSubTitle" />
    </div>
  </div>
</template>
  
  <script setup>
  import { getCardCorp, getCardSalesDetailReport } from '@/api/misales';
/**
 *  매출일자 조회 컴포넌트
 */
import Datepicker2 from '@/components/Datepicker2.vue';

/**
 *  리얼그리드 컴포넌트
 */

import Realgrid from '@/components/realgrid.vue';

/**
 *  매장 단일 호출 컴포넌트
 */

import pickStoreSingle from '@/components/pickStoreSingle.vue';

/*
 * 공통 표준  Function
 */

import { onMounted, ref, watch } from 'vue';
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from 'vuex';

/**
 *  페이지로그 자동 입력
 *  */

import { insertPageLog } from '@/customFunc/customFunc';

/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from '@/components/pageName.vue';

const sls05ControlBorder = '#cbd5e1';
const sls05ItemGap = '0.75rem';
const sls05RowGap = '0.5625rem';
const sls05ColGap = '1.25rem';
const sls05LabelCol = '5.25rem';
const sls05PickGapCol = '3.75rem';
const sls05PickScale = 0.857375;
  
  const setFooterColID = ref(['lngAmount'])
  const setFooterExpressions = ref(['sum'])
  const progid = ref(1)
  const reload = ref(false)
  const rowData = ref([])
  const afterSearch = ref(false)
  const selectedstartDate = ref()
  const selectedendDate = ref()
  /**
 * 선택한 매출 시작일자
 */

const startDate = (e) => {
    //comsole.log(e)
    selectedstartDate.value = e
  }
  /**
 * 선택한 매출 종료일자
 */

const endDate = (e) => {
    selectedendDate.value = e
  }
  const store = useStore()
  const loginedstrLang = store.state.userData.lngLanguage

  const datepicker = ref(null)
  const closePopUp = ref(false)
  /**
 * 매출 일자 안 라디오박스 닫기 위한 외부 클릭 감지 함수
 */

const handleParentClick = (e) => {
    const datepickerEl = datepicker.value?.$el;
    if (datepickerEl && datepickerEl.contains(e.target)) {
        return;
    }
    closePopUp.value = !closePopUp.value
  }
  
  // 조회조건 라디오박스(승인, 취소)
  const selectedRadioBox = ref('0') // 기본 선택값


  /**
 *  조회 함수
 */

 
const searchButton= async () => {
    store.state.loading = true;
    try {
      initGrid()

      //그리드 갱신
      reload.value = !reload.value

      //매장 선택
      // let selectedStorearr;
      // if (selectedStores.value == undefined || selectedStores.value.length == 0 || selectedStores.value == 0) {
      //   selectedStorearr = 0
      // } else {
      //   selectedStorearr = selectedStores.value
      // }

      // //comsole.log(selectedStorearr)
      
      //매입사코드 선택 콤보박스
      let selectedBuyCodeValue;
      if (selectedBuyCode.value == undefined || selectedBuyCode.value.length == 0 || selectedBuyCode.value == 0) {
        selectedBuyCodeValue = 0
      } else {
        selectedBuyCodeValue = selectedBuyCode.value
      }

      //comsole.log(selectedBuyCodeValue)

      const res = await getCardSalesDetailReport(
          selectedGroup.value, selectedStoreAttrs.value, selectedSupervisor.value, selectedStores.value
        , selectedstartDate.value, selectedendDate.value, 0, selectedRadioBox.value, selectedBuyCodeValue
      )
      ////console.log(res)
      rowData.value = res.data.cardSalesDetail
  
      afterSearch.value = true
  
    } catch (error) {
      afterSearch.value = false
      //comsole.log(error);
    } finally {
      store.state.loading = false;
  
    }
  
  }
  
  /* 매장 컴포넌트 관련 함수 */
  const selectedGroup = ref()
  const selectedStores = ref()
  const selectedStoreAttrs = ref()
  const selectedSupervisor = ref()
  /**
 * 페이지 매장 그룹 세팅
 */

const lngStoreGroup = (e) => {
    initGrid()
    selectedGroup.value = e
  }
  /**
 * 페이지 매장 코드 세팅
 */

const lngStoreCodes = (e) => {
    initGrid()
    selectCardCorp.value = null
    selectedStores.value = e
  }


  

const lngStoreAttrs = (e) => {
    initGrid()
    selectedStoreAttrs.value = e
    //comsole.log(e)
  }
  /**
 * 페이지 매장 슈퍼바이저 세팅
 */

const lngSupervisor = (e) => {
    initGrid()
    selectedSupervisor.value = e
    //comsole.log(e)
  }

  
  
  /* 매입사 콤보박스 */
  const selectCardCorp = ref(null)
  const cardCorp = ref([])
  const selectedBuyCode = ref("")

  const loadCardCorpList = async () => {
    if (selectedGroup.value == null || selectedStores.value == null) {
      cardCorp.value = []
      return
    }
    try {
      const res = await getCardCorp(selectedGroup.value, selectedStores.value, 1)
      cardCorp.value = res.data.cardCorpList ?? []
    } catch {
      cardCorp.value = []
    }
  }

  /**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  await insertPageLog(store.state.activeTab2)
})

watch([selectedGroup, selectedStores], () => {
  loadCardCorpList()
})
  
  watch(selectCardCorp, (newValue) => {
    selectedBuyCode.value = newValue ? newValue.strBuyCode : ""
    //comsole.log(selectedBuyCode.value)
  })
  

  /**
 * 그리드 초기화
 */

const initGrid = () => {
    if (rowData.value.length > 0) {
      rowData.value = []
    }
  }
  
  //엑셀 버튼 처리 함수
  const exportExcel = ref(false)
  /**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
    if(selectedExcelStore.value == '매장명 : 선택'){
      documentSubTitle.value = selectedExcelDate.value +'\n'+ '매장명 : 전체'
    } else {
      documentSubTitle.value = selectedExcelDate.value +'\n'+ selectedExcelStore.value
    }
    //comsole.log(documentSubTitle.value);
    // 엑셀 기능 실행
    exportExcel.value = !exportExcel.value
  }
  
  // 엑셀 추출
  const documentSubTitle = ref('')
  const selectedExcelDate = ref('')
  /**
 * 엑셀용 일자 세팅 함수
 */

const excelDate = (e)=> {
   selectedExcelDate.value = e
   //comsole.log(e)
  }
  const selectedExcelStore = ref('')
  /**
 * 엑셀용 매장 세팅 함수
 */

const excelStore = (e) =>{
    selectedExcelStore.value = e
    //comsole.log(e)
  }
  </script>

<style scoped>
/* 패널 좌·우 여백 — 앞(일자 앞)=뒤(매장명 뒤), 항상 동일 값 유지 */
.sls05-search-panel {
  --sls05-panel-pad-x: 2rem;
  padding-inline: var(--sls05-panel-pad-x);
}

@media (min-width: 640px) {
  .sls05-search-panel {
    --sls05-panel-pad-x: 2.875rem;
  }
}

@media (min-width: 768px) {
  .sls05-search-panel {
    --sls05-panel-pad-x: 4.875rem;
  }
}

@media (min-width: 1024px) {
  .sls05-search-panel {
    --sls05-panel-pad-x: 5.5rem;
  }
}

/* 3열 AREA — 1열: 조건 / 2열: 간격 / 3열: 매장명(우측·확대) */
.sls05-search-grid {
  display: grid;
  width: 100%;
  min-width: 0;
  align-items: center;
  overflow: visible;
  grid-template-columns: max-content var(--sls05-pick-gap-col) minmax(0, 1fr);
  column-gap: var(--sls05-col-gap);
  row-gap: var(--sls05-row-gap);
}

.sls05-left-stack {
  grid-column: 1;
  grid-row: 1 / 4;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: var(--sls05-row-gap);
  align-self: stretch;
  width: max-content;
  max-width: 100%;
  min-width: 0;
}

.sls05-left-row {
  display: grid;
  grid-template-columns: var(--sls05-label-col) auto;
  column-gap: var(--sls05-item-gap);
  align-items: center;
  min-width: 0;
}

.sls05-input-col {
  display: flex;
  align-items: center;
  min-width: 0;
  width: 100%;
}

.sls05-pick-span {
  grid-column: 3;
  grid-row: 1 / 3;
  align-self: center;
  justify-self: end;
  min-width: 0;
  width: calc(100% * var(--sls05-pick-scale));
  max-width: calc(100% * var(--sls05-pick-scale));
  overflow-x: hidden;
}

.sls05-col2-gap {
  grid-column: 2;
  grid-row: 1 / 4;
  min-width: 0;
  pointer-events: none;
}

.sls05-pick-span :deep(.pss-root) {
  width: 100%;
  max-width: 100%;
  gap: var(--sls05-row-gap);
}

.sls05-pick-span :deep(.pss-grid) {
  --pss-grp-col: calc(11rem * var(--sls05-pick-scale));
  width: 100%;
  max-width: 100%;
  row-gap: var(--sls05-row-gap);
  column-gap: var(--sls05-item-gap);
  grid-template-columns:
    auto
    var(--pss-grp-col)
    minmax(calc(6.5rem * var(--sls05-pick-scale)), 1fr)
    minmax(calc(6.5rem * var(--sls05-pick-scale)), 1fr);
}

.sls05-pick-span :deep(.pss-brand) {
  width: calc(4.5rem * var(--sls05-pick-scale)) !important;
  min-width: calc(3.5rem * var(--sls05-pick-scale)) !important;
}

.sls05-pick-span :deep(.pss-mid-pair) {
  width: 100%;
  min-width: 0;
}

.sls05-pick-span :deep(.pss-col-store) {
  min-width: 0;
  width: 100%;
}

.sls05-sg-label {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 0.9375rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
}

.sls05-buy-vselect {
  width: 100% !important;
  min-width: 0;
}

.sls05-input-col :deep(.custom-select2 .vs__dropdown-toggle) {
  height: 2rem !important;
  min-height: 2rem !important;
  border: 1px solid var(--sls05-control-border) !important;
  border-radius: 0.375rem !important;
  padding: 0 0.5rem !important;
}

.sls05-input-col :deep(.custom-select2 .vs__selected-options) {
  padding: 0 !important;
  flex-wrap: nowrap;
}

.sls05-input-col :deep(.custom-select2 .vs__selected),
.sls05-input-col :deep(.custom-select2 .vs__placeholder),
.sls05-input-col :deep(.custom-select2 .vs__search) {
  font-size: 0.875rem !important;
  line-height: 1.25rem !important;
  color: rgb(55 65 81) !important;
  margin: 0 !important;
  padding: 0 !important;
}

.sls05-input-col :deep(.custom-select2 .vs__actions) {
  padding: 0 0 0 0.25rem !important;
}

.sls05-search-panel .sls05-date-slot :deep(> div.flex.justify-start.items-center) {
  width: auto !important;
  max-width: none !important;
  min-width: 0;
  gap: 0.25rem !important;
  margin-left: 0;
  padding-left: 0;
}

.sls05-search-panel .sls05-date-slot :deep(> div.flex > div.inline-flex.h-8) {
  flex: 0 0 auto;
  width: auto !important;
  max-width: none;
  gap: 0.125rem !important;
}

.sls05-search-panel .sls05-date-slot :deep(input[type="date"]) {
  border: 1px solid var(--sls05-control-border) !important;
  box-sizing: border-box;
  flex: 0 0 9rem;
  width: 9rem !important;
  min-width: 9rem;
  max-width: 9rem;
  height: 2rem !important;
  min-height: 2rem !important;
  padding-left: 0.45rem;
  padding-right: 0.25rem;
  font-size: 0.875rem !important;
  line-height: 1.25rem !important;
  border-radius: 0.375rem;
}

.sls05-search-panel .sls05-date-slot :deep(input[type="date"]:focus) {
  border-color: #3b82f6 !important;
}

.sls05-search-panel .sls05-date-slot :deep(div.inline-flex.h-8 > span) {
  flex-shrink: 0;
}

.sls05-search-panel .sls05-date-slot :deep(div.inline-flex.h-8 > button) {
  flex-shrink: 0;
  width: 2rem !important;
  height: 2rem !important;
  min-width: 2rem;
  margin-left: 0.125rem !important;
}

.sls05-pick-span :deep(.pss-select),
.sls05-pick-span :deep(.vs__dropdown-toggle) {
  border: 1px solid var(--sls05-control-border) !important;
  box-sizing: border-box;
}
</style>