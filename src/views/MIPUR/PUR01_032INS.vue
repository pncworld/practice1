<!-- /*--############################################################################
# Filename : PUR01_032INS.vue                                                  
# Description : 구매관리II > 발주 관리 > 발주마감관리 II
# Date :2025-09-25                                                            
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <!-- 조회조건 -->
  <div class="h-full" @click="handleParentClick">
    <div class="flex justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center mr-9 space-x-2 pr-5">
        <button @click="saveButton" class="button save md:w-auto w-14">
          저장
        </button>
        <button @click="excelButton" class="button excel">엑셀</button>
      </div>
    </div>
    <div
      class="grid grid-cols-2 grid-rows-1 justify-between bg-gray-200 rounded-lg h-14 items-start z-10">
      <div class="flex ml-12 space-x-5 mt-2 items-center">
        <div class="font-semibold text-base">지역</div>
        <select
          name=""
          id=""
          class="w-48 h-7"
          v-model="cond"
          @change="setStoreArea">
          <option :value="i.lngCode" v-for="i in optionList">
            {{ i.strName }}
          </option>
        </select>
      </div>
      <div class="flex space-x-5 mt-2">
        <div class="font-semibold text-base">입고예정일</div>
        <div>
          <input
            type="text"
            class="w-20"
            name="cond2"
            v-model="cond2"
            @input="onlyNumber" />일전
        </div>
        <div>
          <input
            type="text"
            class="w-20"
            name="cond3"
            v-model="cond3"
            @input="onlyNumber" />시
        </div>
        <div>
          <input
            type="text"
            class="w-20"
            name="cond4"
            v-model="cond4"
            @input="onlyNumber" />분
        </div>
      </div>
    </div>
    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="w-full h-[82%]">
      <Realgrid
        :progname="'PUR01_032INS_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :documentTitle="'PUR01_032INS'"
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
import { getOrderCloseTime,  getOrderAuditList,  setOrderCloseAndAuditList } from "@/api/mipur";
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

  const res2 = await getOrderCloseTime(
    store.state.userData.lngStoreGroup,
    cond.value
  );

  cond2.value = res2.data.List[0].pre_date;
  cond3.value = res2.data.List[0].dtmClosehour;
  cond4.value = res2.data.List[0].dtmCloseMin;

  const res3 = await getOrderAuditList(store.state.userData.lngStoreGroup);

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
  const res2 = await getOrderCloseTime(
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
  try {
    const storecds = updatedrowdata.value
      .map((item) => item.lngStoreCode)
      .join("\u200b");
    const permissions = updatedrowdata.value
      .map((item) => (item.Selected == true ? "1" : "0"))
      .join("\u200b");
    const res = await setOrderCloseAndAuditList(
      store.state.userData.lngStoreGroup,
      cond.value,
      String(cond3.value).padStart(2, "0"),
      String(cond4.value).padStart(2, "0"),
      cond2.value,
      storecds,
      permissions
    );
    console.log(res);
    if (res.data.RESULT_CD == "00") {
      await Swal.fire({
        title: "성공",
        text: "발주마감 관리가 저장 되었습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
      openPopUp.value = false;
    } else {
      await Swal.fire({
        title: "경고",
        text: "발주마감 저장을 실패하였습니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
    }
  } catch (error) {
  } finally {
    const res3 = await getOrderAuditList(store.state.userData.lngStoreGroup);
    rowData.value = res3.data.List;
  }
};
</script>