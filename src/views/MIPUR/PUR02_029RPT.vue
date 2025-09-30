<!-- /*--############################################################################
# Filename : PUR02_029RPT.vue                                                  
# Description : 구매관리2 > 매입 관리 > 매장별/업체별 매입 집계                      
# Date :2025-09-30                                                             
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <!-- 조회조건 -->
  <div class="h-full" @click="handleParentClick">
    <div class="flex justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center mr-9 space-x-2 pr-5">
        <button @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <button @click="excelButton" class="button w-auto excel">엑셀</button>
      </div>
    </div>
    <div
      class="grid grid-cols-2 grid-rows-2 bg-gray-200 rounded-lg h-24 items-start z-10">
      <div class="justify-start flex ml-12 mt-2">
        <DatePicker4 @month="month" @year="year" :mainName="'선택기간'">
        </DatePicker4>
        <div class="flex justify-center items-center ml-2">~</div>
        <DatePicker4 @month="month2" @year="year2" :mainName="''">
        </DatePicker4>
      </div>
      <div class="flex justify-start items-center">
        <PickStore
          @update:storeGroup="lngStoreGroup"
          :defaultStoreNm="'전체'"
          @storeNm="excelStore"
          :defaultStoreType2="true"
          :defaultStore="true"
          @update:storeCd="lngStoreCode"></PickStore>
      </div>
      <div class="flex ml-16 space-x-5 mt-0 items-center">
        <BusinessClient
          @SupplierId="SupplierId"
          :defaultNm="'전체'"></BusinessClient>
      </div>
      <div class="flex justify-start pl-12 items-center mt-2 space-x-5">
        <div class="font-semibold text-base">조회유형</div>
        <div class="flex space-x-3">
          <label for="cond"
            ><input
              type="radio"
              id="cond"
              name="cond"
              v-model="cond"
              @input="cond = 0"
              value="0" />전체</label
          >
          <label for="cond2"
            ><input
              type="radio"
              id="cond2"
              name="cond"
              @input="progid = 2"
              v-model="cond"
              value="1" />매장별 매입집계</label
          >
          <label for="cond3"
            ><input
              type="radio"
              id="cond3"
              name="cond"
              @input="progid = 3"
              v-model="cond"
              value="2" />거래처별 매입집계</label
          >
        </div>
      </div>
    </div>

    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="w-full h-[65vh]" v-if="cond == 0">
      <Realgrid
        :progname="'PUR02_029RPT_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :setStateBar="false"
        :documentTitle="'PUR02_029RPT'"
        :documentSubTitle="documentSubTitle"
        :exporttoExcel="exportExcel">
      </Realgrid>
    </div>

    <div class="w-full h-[65vh]" v-if="cond != '0'">
      <Realgrid
        :progname="'PUR02_029RPT_VUE'"
        :progid="progid"
        :rowData="rowData2"
        :reload="reload"
        :setTreeView="true"
        :setStateBar="false"
        :rowStateeditable="false"
        :documentTitle="'PUR02_029RPT'"
        :dynamicRowHeight2="true"
        :documentSubTitle="documentSubTitle"
        :exporttoExcel="exportExcel2">
      </Realgrid>
    </div>
  </div>

  <!-- 그리드 영역 -->
</template>

<script setup>
import { getTotalSumList } from "@/api/mipur";
import BusinessClient from "@/components/businessClient.vue";
import DatePicker4 from "@/components/DatePicker4.vue";
import PageName from "@/components/pageName.vue";
import PickStore from "@/components/pickStore.vue";
import Realgrid from "@/components/realgrid.vue";
import { insertPageLog } from "@/customFunc/customFunc";
import { onMounted, ref } from "vue";
import { useStore } from "vuex";

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  //   const res = await getCommonList(27);

  //   optionList.value = res.data.List.filter((item) => item.strDCode != "01");

  //   const res2 = await getCommonList(24);

  //   optionList2.value = res2.data.List;
});

const reload = ref(false);
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

    const res = await getTotalSumList(
      groupCd.value,
      storeCode.value,
      supplierid.value,
      y.value + m.value,
      y2.value + m2.value,
      cond.value
    );
    console.log(res);

    if (cond.value == 0) {
      rowData.value = res.data.List;
    } else {
      rowData2.value = res.data.List;
    }

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
const progid = ref(2);
const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }

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
    "매장명 :" +
    selectedExcelStore.value;
  if (cond.value == 0) {
    exportExcel.value = !exportExcel.value;
  } else {
    exportExcel2.value = !exportExcel2.value;
  }
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
