<!-- /*--############################################################################
# Filename : STK01_002INS.vue                                                  
# Description : 자재관리 > 청구 관리 > 청구 마감 관리               
# Date :2025-09-25                                                            
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <!-- 조회조건 -->
  <!-- pl-5: 셸 w-right가 pl0이라 그리드가 좌측 메뉴에 붙음 → 우측 pd20과 맞춤 -->
  <div class="stk002-page flex h-full min-h-0 flex-col pl-5" @click="handleParentClick">
    <div class="flex shrink-0 justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center space-x-2 pr-5">
        <button @click="saveButton" class="button save md:w-auto w-14">
          저장
        </button>
        <button @click="excelButton" class="button excel">엑셀</button>
      </div>
    </div>
    <div
      class="stk002-search-panel z-10 mt-3 w-full min-w-0 shrink-0 rounded-lg bg-gray-200">
      <div class="stk002-search-grid min-w-0">
        <label class="stk002-sg-label" for="stk01-002-area">지역</label>
        <div class="stk002-cell-field stk002-area-slot min-w-0">
          <select
            id="stk01-002-area"
            class="stk002-control"
            v-model="cond"
            @change="setStoreArea">
            <option :value="i.lngCode" v-for="i in optionList" :key="i.lngCode">
              {{ i.strName }}
            </option>
          </select>
        </div>
        <div class="stk002-spacer" aria-hidden="true"></div>
        <div class="stk002-sg-label">납기예정일</div>
        <div class="stk002-cell-field stk002-time-slot">
          <label class="stk002-unit">
            <input
              type="text"
              class="stk002-control stk002-num"
              name="cond2"
              v-model="cond2"
              @input="onlyNumber" />일전
          </label>
          <label class="stk002-unit">
            <input
              type="text"
              class="stk002-control stk002-num"
              name="cond3"
              v-model="cond3"
              @input="onlyNumber" />시
          </label>
          <label class="stk002-unit">
            <input
              type="text"
              class="stk002-control stk002-num"
              name="cond4"
              v-model="cond4"
              @input="onlyNumber" />분
          </label>
        </div>
      </div>
    </div>
    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="mt-3 min-h-0 w-full flex-1">
      <Realgrid
        :progname="'STK01_002INS_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :documentTitle="'STK01_002INS'"
        @updatedRowData="updatedRowData"
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
  <!-- 그리드 영역 -->
</template>

<script setup>
import {
  getDemandAuditList,
  getDemCloseTime,
  saveDemCloseAndAuditList,
} from "@/api/mistock";
import PageName from "@/components/pageName.vue";
import Realgrid from "@/components/realgrid.vue";
import { insertPageLog } from "@/customFunc/customFunc";
import { onMounted, ref } from "vue";

import { getStoreArea } from "@/api/misales";
import { useStore } from "vuex";
import Swal from "sweetalert2";

const optionList = ref([]);
const optionList2 = ref([]);
const optionList3 = ref([]);
const optionList4 = ref([]);
const setGroupSumCustomColumnId = ref(["strWeek"]);
const setGroupColumnId = ref("");
const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);
const selectedstartDate = ref();
const selectedendDate = ref();

/**
 * 선택한 매출 시작일자
 */

const cond = ref("10");
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

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getStoreArea(store.state.userData.lngStoreGroup, 0);

  optionList.value = res.data.List;
  if (optionList.value.length > 0) {
    cond.value = optionList.value[0].lngCode;
  }

  const res2 = await getDemCloseTime(
    store.state.userData.lngStoreGroup,
    cond.value
  );

  cond2.value = res2.data.List[0].pre_date;
  cond3.value = res2.data.List[0].dtmClosehour;
  cond4.value = res2.data.List[0].dtmCloseMin;

  const res3 = await getDemandAuditList(store.state.userData.lngStoreGroup);

  rowData.value = res3.data.List;
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
  documentSubTitle.value =
    selectedExcelDate.value + "\n" + selectedExcelStore.value;

  // 엑셀 기능 실행
  exportExcel.value = !exportExcel.value;
};

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

  // 화면 처음 열 때(onMounted)와 같은 순서: cond2=일전, cond3=시, cond4=분
  if (res2.data.List.length > 0) {
    cond2.value = res2.data.List[0].pre_date;
    cond3.value = res2.data.List[0].dtmClosehour;
    cond4.value = res2.data.List[0].dtmCloseMin;
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
  try {
    const storecds = updatedrowdata.value
      .map((item) => item.lngStoreCode)
      .join("\u200b");
    const permissions = updatedrowdata.value
      .map((item) => (item.Selected == true ? "1" : "0"))
      .join("\u200b");
    const res = await saveDemCloseAndAuditList(
      store.state.userData.lngStoreGroup,
      cond.value,
      String(cond3.value).padStart(2, "0") +
        String(cond4.value).padStart(2, "0"),
      cond2.value,
      storecds,
      permissions
    );
    console.log(res);
    if (res.data.RESULT_CD == "00") {
      await Swal.fire({
        title: "성공",
        text: "청구마감 관리가 저장 되었습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
    } else {
      await Swal.fire({
        title: "경고",
        text: "청구마감 저장을 실패하였습니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
    }
  } catch (error) {
  } finally {
    const res3 = await getDemandAuditList(store.state.userData.lngStoreGroup);

    rowData.value = res3.data.List;
  }
};
</script>

<style scoped>
.stk002-page {
  --stk002-label-col: 6.5rem;
  --stk002-item-gap: 2rem;
  --stk002-col-gap: 1.75rem;
  --stk002-panel-pad-x: 7rem; /* 조회 항목 2개 — 앞·뒤 동일 (search-area-pad-flexible) */
  --stk002-area-field-w: 16rem;
  --stk002-row-min-h: 2rem;
  --stk002-control-border: #cbd5e1;
  --stk002-control-h: 2rem;
}

/* 조회 AREA — 앞·뒤 pad 동일, 남는 가로는 가운데 spacer 만 흡수 */
.stk002-search-panel {
  box-sizing: border-box;
  padding-block: 0.75rem;
  padding-inline: var(--stk002-panel-pad-x);
}

.stk002-search-grid {
  display: grid;
  grid-template-columns:
    max-content
    minmax(0, var(--stk002-area-field-w))
    minmax(var(--stk002-col-gap), 1fr)
    max-content
    max-content;
  align-items: center;
  width: 100%;
  min-width: 0;
}

.stk002-spacer {
  min-width: var(--stk002-col-gap);
  align-self: stretch;
}

.stk002-sg-label {
  box-sizing: content-box;
  min-width: var(--stk002-label-col);
  padding-right: var(--stk002-item-gap);
  min-height: var(--stk002-row-min-h);
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

.stk002-cell-field {
  min-width: 0;
  min-height: var(--stk002-row-min-h);
  display: flex;
  align-items: center;
}

.stk002-area-slot {
  width: 100%;
}

.stk002-control {
  box-sizing: border-box;
  height: var(--stk002-control-h);
  min-height: var(--stk002-control-h);
  max-height: var(--stk002-control-h);
  width: 100%;
  min-width: 0;
  border: 1px solid var(--stk002-control-border);
  border-radius: 0.375rem;
  background: #fff;
  padding: 0 0.5rem;
  font-size: 0.875rem;
  color: rgb(55 65 81);
}

.stk002-control:focus {
  border-color: #3b82f6;
  outline: none;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.25);
}

.stk002-time-slot {
  gap: 0.75rem;
  flex-wrap: nowrap;
}

.stk002-unit {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  color: rgb(17 24 39);
  white-space: nowrap;
}

.stk002-num {
  width: 4.5rem;
  text-align: right;
}

@media (max-width: 1100px) {
  .stk002-page {
    --stk002-panel-pad-x: 2rem;
  }
}
</style>
