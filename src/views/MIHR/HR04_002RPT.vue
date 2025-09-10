/*--############################################################################
# Filename : HR04_002RPT.vue
# Description : 인사관리 > 근태 현황 > 인원현황
# Date :2025-09-09
# Author : 권지안
################################################################################*/
<template>
  <!-- 조회 조건 -->
  <div class="h-full" @click="handleParentClick">
    <div class="flex justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center mr-9 space-x-2 pr-5">
        <button @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <button @click="excelButton" class="button save w-auto excel">
          엑셀
        </button>
      </div>
    </div>
    <div
      class="grid grid-cols-2 grid-rows-1 justify-between bg-gray-200 rounded-lg h-20 items-start z-10">
      <div class="grid grid-cols-1 grid-rows-2 h-full mt-1">
        <Datepicker2
          @startDate="startDate"
          @endDate="endDate"
          :closePopUp="closePopUp"
          ref="datepicker"
          class="ml-8"
          @excelDate="excelDate"
          :mainName="'기간'" />
        <div class="flex justify-start items-center text-base text-nowrap font-semibold ml-12 h-8 space-x-2">
          조회조건
          <div>
            <label for="month" class="font-normal">
              <input
                type="checkbox"
                id="month"
                class="ml-5"
                checked
                @change="checking" />월별
            </label>
          </div>
          <div>
            <label for="day" class="font-normal">
              <input
                type="checkbox"
                id="day"
                class="ml-5"
                checked
                @change="checking" />일자별
            </label>
          </div>
          <div>
            <label for="storeNm" class="font-normal">
              <input
                type="checkbox"
                id="storeNm"
                class="ml-5"
                checked
                @change="checking" />매장별
            </label>
          </div>
          <div>
            <label for="workClass" class="font-normal">
              <input
                type="checkbox"
                id="workClass"
                class="ml-5"
                checked
                @change="checking" />근무형태별
            </label>
          </div>
          <div>
            <label for="area" class="font-normal">
              <input
                type="checkbox"
                id="area"
                class="ml-5"
                checked
                @change="checking" />근무장소별
            </label>
          </div>
          <div>
            <label for="charger" class="font-normal">
              <input
                type="checkbox"
                id="charger"
                class="ml-5"
                checked
                @change="checking" />사원별
            </label>
          </div>
          <div>
            <label for="LDcls" class="font-normal">
              <input
                type="checkbox"
                id="LDcls"
                class="ml-5"
                checked
                @change="checking" />시간구분별
            </label>
          </div>
        </div>
      </div>
      <div class="flex items-start">
        <PickStorePlural
          @lngStoreCodes="lngStoreCodes"
          @lngStoreGroup="lngStoreGroup"
          @lngSupervisor="lngSupervisor"
          @lngStoreTeam="lngStoreTeam"
          @lngStoreAttr="lngStoreAttr"
          @excelStore="excelStore"
          :setFooterColID="setFooterColID"
          :setFooterExpressions="setFooterExpressions">
        </PickStorePlural>
      </div>
    </div>
    <!-- 조회 조건 -->
    <!-- 그리드 영역 -->
    <div class="w-full h-[80%] mt-1">
      <div id="print-area" class="h-full w-full">
        <Realgrid
          :progname="'HR04_002RPT_VUE'"
          :progid="1"
          :rowData="rowData"
          :reload="reload"
          :exporttoExcel="exportExcel"
          :documentSubTitle="documentSubTitle"
          :documentTitle="'HR04_002RPT'"
          :hideColumnsId="hideColumnsId"
          :setGroupColumnId="setGroupColumnId2"
          :setGroupFooter="setGroupFooter"
          :setFooter="false"
          :setGroupCustomLevel="2"
          :setFooterColID="setFooterColID"
          :setFooterExpressions="setFooterExpressions"
          :setGroupSumCustomColumnId="setGroupSumCustomColumnId"
          :setGroupSumCustomText="setGroupSumCustomText"
          :setGroupSumCustomLevel="setGroupSumCustomLevel"
          :setGroupFooterColID="setGroupFooterColID"
          :setGroupFooterExpressions="setGroupFooterExpressions"
          :setRowGroupSpan="setRowGroupSpan"
          :rowStateeditable="false"
          :setGroupSumCustomLevel2="setGroupSumCustomLevel2"></Realgrid>
      </div>
    </div>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import { getPersonnelStatus } from "@/api/mihr";

/**
 *  매출 일자 세팅 컴포넌트
 *  */
import Datepicker2 from "@/components/Datepicker2.vue";

/**
 *  페이지명 자동 입력 컴포넌트
 *  */
import PageName from "@/components/pageName.vue";

/**
 * 	다중 매장 선택 컴포넌트
 */
import PickStorePlural from "@/components/pickStorePlural.vue";

/**
 * 	그리드 생성
 */
import Realgrid from "@/components/realgrid.vue";

/*
 * 공통 커스텀 Function ( 페이지 로그 , 시간 포맷)
 */
import { formatTime, insertPageLog } from "@/customFunc/customFunc";

/*
/*
 * 공통 표준  Function
 */
import { onMounted, ref, watch } from "vue";

/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */
import { useStore } from "vuex";

/**
 * 	화면 Load시 실행 스크립트
 */
onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  checkedReportTypes = 127;

  hideColumnsId.value = hideColumnsId.value.filter(
    (item) => item !== "dtmMonth"
  );
  setGroupColumnId.value.push("dtmMonth");
  ConditionSet.add(0);

  ConditionSet.add(1);
  hideColumnsId.value = hideColumnsId.value.filter(
    (item) => item !== "dtmDay"
  );
  setGroupColumnId.value.push("dtmDay");
  
  ConditionSet.add(2);
  hideColumnsId.value = hideColumnsId.value.filter(
    (item) => item !== "strStoreName"
  );
  setGroupColumnId.value.push("strStoreName");
  
  ConditionSet.add(3);
  hideColumnsId.value = hideColumnsId.value.filter(
    (item) => item !== "strWorkClass"
  );
  setGroupColumnId.value.push("strWorkClass");
  
  ConditionSet.add(4);
  hideColumnsId.value = hideColumnsId.value.filter(
    (item) => item !== "strArea"
  );
  setGroupColumnId.value.push("strArea");
  
  checkedCharger.value = 1;
  hideColumnsId.value = hideColumnsId.value.filter(
    (item) => item !== "lngEmpID" && item != "strChargerName"
  );
  ConditionSet.add(5);
  
  ConditionSet.add(6);
  hideColumnsId.value = hideColumnsId.value.filter(
    (item) => item !== "lngLDCls"
  );
  setGroupColumnId.value.push("lngLDCls");

});

const setGroupFooter = ref(false);
const setFooterColID = ref([
  "strStore",
  "lngCode",
  "strMajor",
  "strSub",
  "strMenu",
  "dtmDate",
  "lngPrice",
  "dtmDate",
  "lngNMenuCnt",
  "lngGMenuCnt",
  "lngMenuCnt",
  "lngSalAmt",
  "lngGAmount",
  "lngDCAmt",
  "lngActAmt",
  "lngVAT",
  "lngNetAmt",
  "dblDistRate",
  "lngSalCnt",
  "dblPreWeek",
  "dblPreYear",
]);

const setFooterExpressions = ref([
  "custom",
  "custom",
  "custom",
  "custom",
  "custom",
  "custom",
  "custom",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "avg",
  "avg",
]);
const setGroupFooterColID = ref([
  "strStore",
  "strMajor",
  "strSub",
  "dtmDate",
  "lngPrice",
  "dtmDate",
  "lngNMenuCnt",
  "lngGMenuCnt",
  "lngMenuCnt",
  "lngSalAmt",
  "lngGAmount",
  "lngDCAmt",
  "lngActAmt",
  "lngVAT",
  "lngNetAmt",
  "dblDistRate",
  "lngSalCnt",
  "dblPreWeek",
  "dblPreYear",
]);
const setGroupFooterExpressions = ref([
  "custom",
  "custom",
  "custom",
  "custom",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "sum",
  "avg",
  "avg",
]);
const setGroupSumCustomColumnId = ref(["strStore", "strMajor", "strSub"]);
const setGroupSumCustomText = ref(["매장 소계", "", ""]);
const setGroupSumCustomLevel = ref(1);
const setGroupColumnId = ref([""]);
const setGroupColumnId2 = ref("");
const setGroupSumCustomLevel2 = ref(1);
const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);
const selectedstartDate = ref();
const selectedendDate = ref();

/**
 * 선택한 매출 시작일자
 */
const startDate = (e) => {
  //console.log(e);
  selectedstartDate.value = e;
};

/**
 * 선택한 매출 종료일자
 */

const endDate = (e) => {
  selectedendDate.value = e;
};

const setRowGroupSpan = ref("");
const store = useStore();

/**
 *  조회 함수
 */

const searchButton = async () => {
  store.state.loading = true;
  try {
    initGrid();

    reload.value = !reload.value;
    
    const res = await getPersonnelStatus(
      selectedGroup.value,
      selectedStores.value,
      '0',
      selectedstartDate.value,
      selectedendDate.value,
      checkedReportTypes,
    );

    // console.log(res);
    rowData.value = res.data.personnelStatus;
    afterSearch.value = true;
    
  } catch (error) {
    afterSearch.value = false;
  } finally {
    store.state.loading = false;
  }
};

const selectedGroup = ref();
const selectedStores = ref();
const selectedStoreAttrs = ref();


/**
 * 페이지 매장 그룹 세팅
 */

const lngStoreGroup = (e) => {
  initGrid();
  //console.log(e);
  selectedGroup.value = e;
};
/**
 * 페이지 매장 코드 세팅
 */

const lngStoreCodes = (e) => {
  initGrid();
  selectedStores.value = e;

  if (selectedStores.value.includes(",")) {
    // 콤마가 있으면 여러 값 → 0으로
    selectedStores.value = 0;
  } else {
    // 단일 값이면 숫자로 변환
    selectedStores.value = Number(selectedStores.value) || 0;
  }

  // console.log(selectedStores.value);

};

/**
 * 페이지 매장 분류 세팅
 */

const lngStoreAttr = (e) => {
  initGrid();
  selectedStoreAttrs.value = e;
  //console.log(e);
};
/**
 * 페이지 매장 팀 세팅
 */

const lngStoreTeam = (e) => {
  initGrid();
};
/**
 * 페이지 매장 슈퍼바이저 세팅
 */

const lngSupervisor = (e) => {
  initGrid();
};

/**
 * 그리드 초기화
 */

const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
};

/**
 * 엑셀 내보내기 함수
 */

const exportExcel = ref(false);
const documentSubTitle = ref("");

const searchCondition = ref([
  "월별",
  "일자별",
  "매장별",
  "근무형태별",
  "근무장소별",
  "사원별",
  "시간구분별",
]);
const ConditionSet = new Set([]);

const excelButton = () => {

  const newCondarr = [...ConditionSet].sort();
  let searchcond = "";
  for (let i = 0; i < newCondarr.length; i++) {
    searchcond += searchCondition.value[newCondarr[i]] + ",";
  }
  if (searchcond.slice(-1) === ",") {
    searchcond = searchcond.slice(0, -1);
  }

  documentSubTitle.value =
    selectedExcelDate.value +
    "\n" +
    selectedExcelStore.value +
    "\n" +
    "조회조건 : " +
    searchcond;
  exportExcel.value = !exportExcel.value;

};

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
const selectedExcelDate = ref("");
const selectedExcelStore = ref("");
/**
 * 엑셀용 일자 세팅 함수
 */

const excelDate = (e) => {
  selectedExcelDate.value = e;
};
/**
 * 엑셀용 매장 세팅 함수
 */

const excelStore = (e) => {
  selectedExcelStore.value = e;
};

const hideColumnsId = ref([
  "dtmMonth",
  "dtmDay",
  "strStoreName",
  "strWorkClass",
  "strArea",
  "lngEmpID",
  "strChargerName",
  "lngLDCls",
]);

let checkedReportTypes = 0; // 초기값
const checkedCharger = ref(0);
const customOrder = [ "dtmMonth",  "dtmDay",  "strStoreName",  "strWorkClass",  "strArea",  "lngEmpID",  "strChargerName",  "lngLDCls" ];
const checking = (e) => {
  if (e.target.id == "month") {
    if (e.target.checked) {
      checkedReportTypes |= 64;
      hideColumnsId.value = hideColumnsId.value.filter(
        (item) => item !== "dtmMonth"
      );
      setGroupColumnId.value.push("dtmMonth");
      ConditionSet.add(0);
    } else {
      checkedReportTypes &= ~64;
      hideColumnsId.value.push("dtmMonth");
      setGroupColumnId.value = setGroupColumnId.value.filter(
        (item) => item !== "dtmMonth"
      );
      ConditionSet.delete(0);
    }
  } else if (e.target.id == "day") {
    if (e.target.checked) {
      checkedReportTypes |= 1;
      ConditionSet.add(1);
      hideColumnsId.value = hideColumnsId.value.filter(
        (item) => item !== "dtmDay"
      );
      setGroupColumnId.value.push("dtmDay");
    } else {
      checkedReportTypes &= ~1;
      ConditionSet.delete(1);
      hideColumnsId.value.push("dtmDay");
      setGroupColumnId.value = setGroupColumnId.value.filter(
        (item) => item !== "dtmDay"
      );
    }
  } else if (e.target.id == "storeNm") {
    if (e.target.checked) {
      checkedReportTypes |= 2;
      ConditionSet.add(2);
      hideColumnsId.value = hideColumnsId.value.filter(
        (item) => item !== "strStoreName"
      );
      setGroupColumnId.value.push("strStoreName");
    } else {
      checkedReportTypes &= ~2;
      ConditionSet.delete(2);
      hideColumnsId.value.push("strStoreName");
      setGroupColumnId.value = setGroupColumnId.value.filter(
        (item) => item !== "strStoreName"
      );
    }
  } else if (e.target.id == "workClass") {
    if (e.target.checked) {
      checkedReportTypes |= 4;
      ConditionSet.add(3);
      hideColumnsId.value = hideColumnsId.value.filter(
        (item) => item !== "strWorkClass"
      );
      setGroupColumnId.value.push("strWorkClass");
    } else {
      checkedReportTypes &= ~4;
      ConditionSet.delete(3);
      hideColumnsId.value.push("strWorkClass");
      setGroupColumnId.value = setGroupColumnId.value.filter(
        (item) => item !== "strWorkClass"
      );
    }
  } else if (e.target.id == "area") {
    if (e.target.checked) {
      checkedReportTypes |= 8;
      ConditionSet.add(4);
      hideColumnsId.value = hideColumnsId.value.filter(
        (item) => item !== "strArea"
      );
      setGroupColumnId.value.push("strArea");
    } else {
      checkedReportTypes &= ~8;
      ConditionSet.delete(4);
      hideColumnsId.value.push("strArea");
      setGroupColumnId.value = setGroupColumnId.value.filter(
        (item) => item !== "strArea"
      );
    }
  } else if (e.target.id == "charger") {
    if (e.target.checked) {
      checkedReportTypes |= 16;
      checkedCharger.value = 1;
      hideColumnsId.value = hideColumnsId.value.filter(
        (item) => item !== "lngEmpID" && item != "strChargerName"
      );
      ConditionSet.add(5);
    } else {
      checkedReportTypes &= ~16;
      checkedCharger.value = 0;
      hideColumnsId.value.push("lngEmpID");
      hideColumnsId.value.push("strChargerName");
      ConditionSet.delete(5);
    }
  } else if (e.target.id == "LDcls") {
    if (e.target.checked) {
      checkedReportTypes |= 32;
      ConditionSet.add(6);
      hideColumnsId.value = hideColumnsId.value.filter(
        (item) => item !== "lngLDCls"
      );
      setGroupColumnId.value.push("lngLDCls");
    } else {
      checkedReportTypes &= ~32;
      ConditionSet.delete(6);
      hideColumnsId.value.push("lngLDCls");
      setGroupColumnId.value = setGroupColumnId.value.filter(
        (item) => item !== "lngLDCls"
      );
    }
  } 
  // else if (e.target.id == "sum") {
  //   if (e.target.checked) {
  //     checkedlngPrint.value = 1;
  //     setGroupFooter.value = true;
  //     setGroupSumCustomLevel.value = 2;
  //     ConditionSet.add(6);
  //   } else {
  //     ConditionSet.delete(6);
  //     checkedlngPrint.value = 0;
  //     setGroupFooter.value = false;
  //     setGroupSumCustomLevel.value = 1;
  //   }
  // } 
  setGroupColumnId.value.sort((a, b) => {
    // customOrder 배열에서 각 요소의 인덱스를 비교
    const indexA = customOrder.indexOf(a);
    const indexB = customOrder.indexOf(b);

    // 만약 배열에 없는 값이 있다면 -1이 반환되므로, 이를 처리해줍니다.
    if (indexA === -1 && indexB === -1) return 0; // 둘 다 없으면 순서 유지
    if (indexA === -1) return 1; // a가 없으면 뒤로 보냄
    if (indexB === -1) return -1; // b가 없으면 뒤로 보냄

    return indexA - indexB;
  });

  setGroupColumnId2.value = setGroupColumnId.value.join(",");
};


</script>

<style>
</style>
