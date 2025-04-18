<template>
  <div class="h-full" @click="handleParentClick">
    <div class="flex justify-between items-center w-full overflow-y-hidden">
      <div class="flex justify-start w-full pl-12 pt-4">
        <div class="flex justify-start">
          <h1 class="font-bold text-sm md:text-2xl w-full">
            월별 일자별 매출현황.
          </h1>
        </div>
      </div>
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
      class="grid grid-cols-3 grid-rows-2 bg-gray-200 rounded-lg h-24 items-center z-10 space-x-5">
      <div class="mt-1 justify-start flex">
        <Datepicker2
          @startDate="startDate"
          @endDate="endDate"
          :closePopUp="closePopUp"
          ref="datepicker"
          class="pr-24"
          :selectedGroup="selectedGroup"
          @excelDate="excelDate" />
      </div>
      <div class="h-[75%] ml-5 mt-1 justify-start flex">
        <pickStoreRenew
          @lngStoreCode="lngStoreCode"
          @lngStoreGroup="lngStoreGroup"
          @excelStore="excelStore"
          class="pl-8"
          @lngStoreAttrs="lngStoreAttrs"
          :placeholderName="'선택'"></pickStoreRenew>
      </div>
      <div class="flex justify-center items-center">
        <div class="text-base font-semibold">포스선택 :</div>
        <select name="" id="" class="w-32 rounded-lg h-8" v-model="selectedPos">
          <option :value="0">전체</option>
          <option :value="i.lngCode" v-for="i in posList">
            {{ i.lngCode }}
          </option>
        </select>
      </div>
      <div class="flex justify-center items-center space-x-2 ml-6">
        <div class="text-base font-semibold">조회조건 :</div>
        <select
          name=""
          id=""
          class="w-64 h-8 rounded-lg"
          v-model="selectedCond">
          <option :value="0">전체</option>
          <option :value="1">개인후불</option>
          <option :value="2">부서후불</option>
          <option :value="3">개인카드</option>
          <option :value="4">부서카드</option>
        </select>
      </div>
      <div class="flex justify-start items-center h-8 space-x-1">
        <div class="text-base font-semibold w-24 text-nowrap pr-10">
          검색조건 :
        </div>
        <select
          name=""
          id=""
          class="w-20 h-8 rounded-lg flex justify-start"
          v-model="selectedCond2">
          <option :value="0">카드번호</option>
          <option :value="1">사원번호</option>
          <option :value="2">사원명</option>
          <option :value="3">부서명</option>
          <option :value="4">소속사명</option>
        </select>

        <input
          type="text"
          class="w-64 h-8 rounded-lg"
          v-model="cond2Text"
          v-if="selectedCond2 !== 3 && selectedCond2 !== 4" />
        <select
          name=""
          id=""
          class="w-64 h-8 rounded-lg"
          v-model="selectedCond4"
          v-if="selectedCond2 == 3 || selectedCond2 == 4">
          <option :value="i.strBelongNM" v-for="i in condition4List">
            {{ i.strBelongNM }}
          </option>
        </select>
        <button
          @click="searchCondition"
          class="button primary"
          v-if="selectedCond2 == 3 || selectedCond2 == 4">
          새로고침
        </button>
      </div>
      <div class="flex justify-center items-center pr-10">
        <div class="text-base font-semibold w-24 text-nowrap">조회옵션 :</div>
        <label for="retire"
          ><input
            type="checkbox"
            id="retire"
            @click="exceptRetire" />퇴직자제외</label
        >
      </div>
    </div>
    <div class="w-full h-[82%]">
      <Realgrid
        :progname="'SLS02_006RPT_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :setFooter="true"
        :documentTitle="'SLS02_006RPT'"
        :setGroupFooter="true"
        :setGroupColumnId="'strAmountName'"
        :setMergeMode="false"
        :setFooterCustomColumnId="['lngEmpNo']"
        :setFooterCustomText="['합계']"
        :setGroupSumCustomColumnId2="['strCompName']"
        :documentSubTitle="documentSubTitle"
        :exporttoExcel="exportExcel">
      </Realgrid>
    </div>
  </div>
</template>

<script setup>
import { getPosList2 } from "@/api/common";
import {
  getCondition4List,
  getSalesByBuyType,
  getSalesbyDateAndMonth,
} from "@/api/misales";
import Datepicker2 from "@/components/Datepicker2.vue";
import pickStoreRenew from "@/components/pickStoreRenew.vue";
import Realgrid from "@/components/realgrid.vue";
import { insertPageLog } from "@/customFunc/customFunc";
import Swal from "sweetalert2";
import { watch } from "vue";
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
});
const setFooterColID = ref(["strStoreName"]);
const setFooterExpressions = ref(["custom"]);

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);
const selectedstartDate = ref();
const selectedendDate = ref();
const selectedStartTime = ref({ value: 0, strName: "00:00" });
const selectedEndTime = ref({ value: 23, strName: "23:00" });
const posList = ref([]);
const selectedPos = ref(0);
const selectedCond = ref(0);
const selectedCond2 = ref(2);
const cond2Text = ref("");
const selectedCond3 = ref(1);
const selectedCond4 = ref("전체");
const condition4List = ref([]);

const exceptRetire = (e) => {
  if (e.target.checked) {
    selectedCond3.value = 0;
  } else {
    selectedCond3.value = 1;
  }
};
const startDate = (e) => {
  console.log(e);
  selectedstartDate.value = e;
};

const endDate = (e) => {
  console.log(e);
  selectedendDate.value = e;
};

const tempSeeDaily = ref(false);
const tempSeeStore = ref(false);

const store = useStore();
const loginedstrLang = store.state.userData.lngLanguage;

const datepicker = ref(null);
const closePopUp = ref(false);
const handleParentClick = (e) => {
  const datepickerEl = datepicker.value?.$el;
  if (datepickerEl && datepickerEl.contains(e.target)) {
    return;
  }
  closePopUp.value = !closePopUp.value;
};

/*
 *조회 처리 함수
 */
const searchButton = async () => {
  if (selectedStores.value == 0) {
    Swal.fire({
      title: "경고",
      text: "매장을 선택하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  try {
    store.state.loading = true;
    initGrid();

    let cardNo = "";
    let empCode = "";
    let empName = "";
    let custDeptName = "";
    let custCompName = "";
    if (selectedCond2.value == 0) {
      cardNo = cond2Text.value;
    } else if (selectedCond2.value == 1) {
      empCode = cond2Text.value;
    } else if (selectedCond2.value == 2) {
      empName = cond2Text.value;
    } else if (selectedCond2.value == 3) {
      custDeptName = selectedCond4.value;
      if (selectedCond4.value == "전체") {
        custDeptName = "";
      }
    } else if (selectedCond2.value == 4) {
      custCompName = selectedCond4.value;
      if (selectedCond4.value == "전체") {
        custCompName = "";
      }
    }

    const res = await getSalesbyDateAndMonth(
      selectedGroup.value,
      selectedStores.value,
      selectedstartDate.value,
      selectedendDate.value,
      selectedCond.value,
      cardNo,
      empCode,
      empName,
      custDeptName,
      custCompName,
      selectedCond3.value,
      selectedPos.value
    );
    console.log(res);
    rowData.value = res.data.List;

    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    console.log(error);
  } finally {
    store.state.loading = false;
  }
};

/* 매장 컴포넌트 관련 함수 */
const selectedGroup = ref();
const selectedStores = ref();
const selectedStoreAttrs = ref();
const lngStoreGroup = (e) => {
  initGrid();
  console.log(e);
  selectedGroup.value = e;
};
const lngStoreCode = async (e) => {
  initGrid();
  selectedStores.value = e;
  const res = await getPosList2(selectedGroup.value, selectedStores.value);
  posList.value = res.data.pos;
  console.log(res);
};
const lngStoreAttrs = (e) => {
  initGrid();
  selectedStoreAttrs.value = e;
  console.log(e);
};

/*
그리드 초기화
*/
const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
};

//엑셀 버튼 처리 함수
const exportExcel = ref(false);
const excelButton = () => {
  let cond =
    "포스 선택 : " + (selectedPos.value == 0 ? "전체" : selectedPos.value);

  let cond2 = "조회 조건 :";

  if (selectedCond.value == 0) {
    cond2 += "전체";
  } else if (selectedCond.value == 1) {
    cond2 += "개인후불";
  } else if (selectedCond.value == 2) {
    cond2 += "부서후불";
  } else if (selectedCond.value == 3) {
    cond2 += "개인카드";
  } else if (selectedCond.value == 4) {
    cond2 += "부서카드";
  }

  let cond3 = "검색조건 : ";
  if (selectedCond2.value == 0) {
    cond3 += "카드번호 , " + cond2Text.value;
  } else if (selectedCond2.value == 1) {
    cond3 += "사원번호 , " + cond2Text.value;
  } else if (selectedCond2.value == 2) {
    cond3 += "사원명 , " + cond2Text.value;
  } else if (selectedCond2.value == 3) {
    cond3 += "부서명 , " + cond2Text.value;
  } else if (selectedCond2.value == 4) {
    cond3 += "소속사명 , " + cond2Text.value;
  }

  let cond4 = "조회옵션 :";
  if (selectedCond3.value == 0) {
    cond4 += "퇴직자제외";
  } else {
    cond4 += "퇴직자포함";
  }

  documentSubTitle.value =
    selectedExcelDate.value +
    "\n" +
    selectedExcelStore.value +
    "\n" +
    cond +
    "\n" +
    cond2 +
    "\n" +
    cond3 +
    "\n" +
    cond4;

  exportExcel.value = !exportExcel.value;
};

// 엑셀 추출
const documentSubTitle = ref("");
const selectedExcelDate = ref("");
const excelDate = (e) => {
  selectedExcelDate.value = e;
  console.log(e);
};
const selectedExcelStore = ref("");
const excelStore = (e) => {
  selectedExcelStore.value = e;
  console.log(e);
};
watch(selectedCond2, async () => {
  if (selectedCond2.value == 3) {
    const res2 = await getCondition4List(
      selectedGroup.value,
      selectedStores.value,
      4
    );
    condition4List.value = res2.data.List;
  } else if (selectedCond2.value == 4) {
    const res2 = await getCondition4List(
      selectedGroup.value,
      selectedStores.value,
      5
    );
    condition4List.value = res2.data.List;
  }
  selectedCond4.value = "전체";
});

const searchCondition = async (e) => {
  if (selectedCond2.value == 3) {
    const res2 = await getCondition4List(
      selectedGroup.value,
      selectedStores.value,
      4
    );
    condition4List.value = res2.data.List;
  } else if (selectedCond2.value == 4) {
    const res2 = await getCondition4List(
      selectedGroup.value,
      selectedStores.value,
      5
    );
    condition4List.value = res2.data.List;
  }
  selectedCond4.value = "전체";
};
</script>
