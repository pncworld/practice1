<!-- /*--############################################################################
# Filename : HR02_003INS.vue                                                   
# Description : 인사관리 > 근태 관리 > 급여확정                           
# Date :2025-09-09                                                              
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
        <button @click="saveButton" class="button save w-auto">근태확정</button>
        <button @click="cancelButton" class="button save w-auto">
          확정취소
        </button>
        <button @click="cancelButton2" class="button copy w-auto">
          전표취소
        </button>
        <button @click="excelButton" class="button save w-auto">엑셀</button>
      </div>
    </div>
    <div
      class="grid grid-cols-4 grid-rows-1 bg-gray-200 rounded-lg h-16 items-center z-10 justify-center">
      <div class="ml-12">
        <PickStoreRenew
          @storeNm="storeNm"
          @lngStoreGroup="lngStoreGroup"
          @lngStoreCode="lngStoreCode"></PickStoreRenew>
      </div>
      <div class="flex space-x-5 text-nowrap items-center ml-48">
        <div class="font-semibold text-base">해당월</div>
        <div>
          <select name="" id="" class="w-32 h-8 border border-black">
            <option value="2030">2030</option>
            <option value="2029">2029</option>
            <option value="2028">2028</option>
            <option value="2027">2027</option>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
            <option value="2020">2020</option>
          </select>
        </div>
        <div>
          <select name="" id="" class="w-14 h-8 border border-black">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
          </select>
        </div>
      </div>
      <div class="flex items-center space-x-5 ml-28">
        <div class="font-semibold text-base">사원 구분</div>
        <select name="" id="" class="border border-black w-48 h-8">
          <option value="0">전체</option>
          <option value="1">정직원</option>
          <option value="2">PT</option>
        </select>
      </div>
      <div class="flex items-center space-x-5">
        <div class="font-semibold text-base">사원명/사원코드</div>
        <div><input type="text" class="border border-black h-8 w-48" /></div>
      </div>
    </div>
    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="h-[75vh] flex justify-center mt-2">
      <Realgrid
        :progname="'HR01_006INS_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        @clickedRowData="clickedRowData"
        @updatedRowData="updatedRowData"
        :addRow4="addRow4"
        @allStateRows="allStateRows"
        :addrowProp="'checkbox,lngCode,lngStoreCode,lngStoreGroup,storeName,strWorkGupName'"
        :addrowDefault="addrowDefault"
        :editableColId="'strWorkGupName'"
        :setStateBar="false"
        :checkRowAuto="false"
        :checkRenderEditable="true"
        :rowStateeditable="false"
        :dynamicRowHeight="true">
      </Realgrid>
    </div>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import {
  deleteWorkShifts,
  deleteWorkShifts2,
  getWorkShiftList,
  saveWorkShift,
  saveWorkShiftDetail,
  updateWorkShift,
  updateWorkShiftDetail,
} from "@/api/mihr";
import Datepicker2 from "@/components/Datepicker2.vue";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
import PickStoreRenew from "@/components/pickStoreRenew.vue";
/**
 * 	매장 단일 선택 컴포넌트
 */
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

import { onMounted, ref } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";
/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
});

const reload = ref(false);
const rowData = ref([]);
const rowData2 = ref([]);
const filteredrowData2 = ref([]);
const rowData3 = ref([]);
const afterSearch = ref(false);
const clickedRow = ref(false);
const clickedLngCode = ref();
const clickedRowData = (e) => {
  filteredrowData2.value = rowData2.value.filter(
    (item) => item.lngWorkGroupCode == e[3]
  );
  TimeArray.value = filteredrowData2.value.map((item) => [
    Number(item.strSTime.split(":")[0]),
    Number(item.strETime.split(":")[0]),
  ]);
  ////console.log(TimeArray.value);
  clickedLngCode.value = e[3];
  clickedRow.value = true;
};

const clickedRowData2 = (e) => {
  ////console.log(e);
};

const updatedRow = ref([]);
const updatedRowData = (e) => {
  updatedRow.value = e;
};
const updatedRow2 = ref([]);
const updatedRowData2 = (e) => {
  for (let i = 0; i < e.length; i++) {
    const neworupdate = rowData2.value.find(
      (item) =>
        item.lngCode == e[i].lngCode &&
        item.lngWorkGroupCode == e[i].lngWorkGroupCode
    );

    if (neworupdate) {
      neworupdate.strSTime = e[i].strSTime;
      neworupdate.strETime = e[i].strETime;
    } else {
      rowData2.value.push({
        lngStoreGroup: e[i].lngStoreGroup,
        lngStoreCode: e[i].lngStoreCode,
        lngCode: e[i].lngCode,
        lngWorkGroupCode: e[i].lngWorkGroupCode,
        rowStated: e[i].rowStated,
        strETime: e[i].strETime,
        strSTime: e[i].strSTime,
      });
    }
  }

  ////console.log(rowData2.value);
  // ////console.log(rowData2.value);
  updatedRow2.value = e;
  // for(let i=0 ; i < e.length ; i++){
  //   if(e[i].rowStated == 'C'){
  //   }
  // }
};

const rowData1State = ref([]);
const allStateRows = (e) => {
  ////console.log(e);
  rowData1State.value = e;

  ////console.log(rowData1State.value);
};
const cond = ref("");
const TimeArray = ref([]);
const store = useStore();
const status = ref(99);
const datepicker = ref(null);
const closePopUp = ref(false);
const custId = ref("");

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

const searchButton = async () => {
  if (selectedStores.value == 0) {
    Swal.fire({
      title: "경고",
      text: "매장명을 먼저 선택하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  try {
    store.state.loading = true;
    initGrid();

    const res = await getWorkShiftList(
      selectedGroup.value,
      selectedStores.value
    );
    ////console.log(res);
    rowData.value = res.data.List;
    rowData2.value = res.data.List2;
    rowData3.value = res.data.List3;
    updatedRow.value = JSON.parse(JSON.stringify(res.data.List));
    updatedRow2.value = JSON.parse(JSON.stringify(res.data.List2));
    // TimeArray.value = rowData2.value.map(item => Number(item.strSTime))
    // TimeArray.value = rowData2.value.map(item => Number(item.strETime))

    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    //comsole.log(error);
  } finally {
    store.state.loading = false;
  }
};

const saveButton = async (e) => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  try {
    store.state.loading = true;
    if (rowData1State.value.created.length > 0) {
      const groups = updatedRow.value
        .filter((item, index) => rowData1State.value.created.includes(index))
        .map((item) => item.lngStoreGroup);
      const stores = updatedRow.value
        .filter((item, index) => rowData1State.value.created.includes(index))
        .map((item) => item.lngStoreCode);
      const wgupname = updatedRow.value
        .filter((item, index) => rowData1State.value.created.includes(index))
        .map((item) => item.strWorkGupName);
      try {
        const res = await saveWorkShift(
          groups.join("\u200b"),
          stores.join("\u200b"),
          wgupname.join("\u200b")
        );
        ////console.log(res);
      } catch (error) {
      } finally {
      }
    }

    if (rowData1State.value.updated.length > 0) {
      const groups = updatedRow.value
        .filter((item, index) => rowData1State.value.updated.includes(index))
        .map((item) => item.lngStoreGroup);
      const stores = updatedRow.value
        .filter((item, index) => rowData1State.value.updated.includes(index))
        .map((item) => item.lngStoreCode);
      const wgupname = updatedRow.value
        .filter((item, index) => rowData1State.value.updated.includes(index))
        .map((item) => item.strWorkGupName);
      const lngcode = updatedRow.value
        .filter((item, index) => rowData1State.value.updated.includes(index))
        .map((item) => item.lngCode);
      try {
        const res = await updateWorkShift(
          groups.join("\u200b"),
          stores.join("\u200b"),
          wgupname.join("\u200b"),
          lngcode.join("\u200b")
        );
        ////console.log(res);
      } catch (error) {
      } finally {
      }
    }
    if (rowData2.value.filter((item) => item.rowStated == "C").length > 0) {
      try {
        const groups = rowData2.value
          .filter((item) => item.rowStated == "C")
          .map((item) => item.lngStoreGroup);
        const stores = rowData2.value
          .filter((item) => item.rowStated == "C")
          .map((item) => item.lngStoreCode);
        const workgroupcode = rowData2.value
          .filter((item) => item.rowStated == "C")
          .map((item) => item.lngWorkGroupCode);

        const strsTime = rowData2.value
          .filter((item) => item.rowStated == "C")
          .map((item) => item.strSTime);
        const streTime = rowData2.value
          .filter((item) => item.rowStated == "C")
          .map((item) => item.strETime);

        const res = await saveWorkShiftDetail(
          groups.join("\u200b"),
          stores.join("\u200b"),
          workgroupcode.join("\u200b"),
          strsTime.join("\u200b"),
          streTime.join("\u200b")
        );
        ////console.log(res);
      } catch (error) {
        ////console.log(error);
      } finally {
      }
    }

    if (rowData2.value.filter((item) => item.rowStated !== "C").length > 0) {
      try {
        const groups = rowData2.value
          .filter((item) => item.rowStated !== "C")
          .map((item) => item.lngStoreGroup);
        const stores = rowData2.value
          .filter((item) => item.rowStated !== "C")
          .map((item) => item.lngStoreCode);
        const lngcodes = rowData2.value
          .filter((item) => item.rowStated !== "C")
          .map((item) => item.lngCode);

        const strsTime = rowData2.value
          .filter((item) => item.rowStated !== "C")
          .map((item) => item.strSTime);
        const streTime = rowData2.value
          .filter((item) => item.rowStated !== "C")
          .map((item) => item.strETime);

        const res = await updateWorkShiftDetail(
          groups.join("\u200b"),
          stores.join("\u200b"),
          lngcodes.join("\u200b"),
          strsTime.join("\u200b"),
          streTime.join("\u200b")
        );
        ////console.log(res);
      } catch (error) {
        ////console.log(error);
      } finally {
      }
    }

    store.state.loading = false;
  } catch (error) {
  } finally {
    store.state.loading = false;
    searchButton();
  }
};
/* 매장 컴포넌트 관련 함수 */
const selectedGroup = ref();
const selectedStores = ref();
const selectedStoreNm = ref();
const addRow4 = ref(false);
const addRow5 = ref(false);
/**
 * 페이지 매장 코드 세팅
 */

const lngStoreCode = async (e) => {
  initGrid();
  selectedStores.value = e;
  ////console.log(e);
};
const lngStoreGroup = async (e) => {
  //initGrid();
  selectedGroup.value = e;
  ////console.log(e);
};
const storeNm = (e) => {
  selectedStoreNm.value = e;
  ////console.log(e);
};
/**
 * 그리드 초기화
 */

const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
  if (rowData2.value.length > 0) {
    rowData2.value = [];
  }
  if (rowData3.value.length > 0) {
    rowData3.value = [];
  }
  if (filteredrowData2.value.length > 0) {
    filteredrowData2.value = [];
  }

  afterSearch.value = false;
};

const addrowDefault = ref("");
const addrowDefault2 = ref("");
const addButton = () => {
  if (afterSearch.value == false) {
    return;
  }

  addrowDefault.value =
    "false, ," +
    selectedStores.value +
    "," +
    selectedGroup.value +
    "," +
    selectedStoreNm.value +
    ", ,";
  addRow4.value = !addRow4.value;
};

const newlngCode = ref("신규");
const newlngCode2 = ref(1);
const addButton2 = () => {
  if (afterSearch.value == false) {
    return;
  }
  if (clickedRow.value == false) {
    return;
  }
  if (clickedLngCode.value == null || clickedLngCode.value == undefined) {
    return;
  }
  newlngCode2.value = newlngCode2.value + 1;
  addrowDefault2.value =
    "false, , , ," +
    (newlngCode.value + newlngCode2.value) +
    "," +
    clickedLngCode.value +
    "," +
    selectedGroup.value +
    "," +
    selectedStores.value +
    ",C";

  addRow5.value = !addRow5.value;
};
const deleteButton = async () => {
  if (updatedRow.value.filter((item) => item.checkbox == true).length == 0) {
    Swal.fire({
      title: "경고",
      text: "삭제 대상을 먼저 체크하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  Swal.fire({
    title: "경고",
    text: "정말 삭제하시겠습니까?",
    icon: "warning",
    confirmButtonText: "확인",
    cancelButtonText: "취소",
    showCancelButton: true,
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        store.state.loading = true;
        const groups = updatedRow.value
          .filter((item) => item.checkbox == true)
          .map((item) => item.lngStoreGroup)
          .join("\u200b");
        const stores = updatedRow.value
          .filter((item) => item.checkbox == true)
          .map((item) => item.lngStoreCode)
          .join("\u200b");
        const lngcodes = updatedRow.value
          .filter((item) => item.checkbox == true)
          .map((item) => item.lngCode)
          .join("\u200b");
        const res = await deleteWorkShifts(groups, stores, lngcodes);

        ////console.log(res);
        store.state.loading = false;
      } catch (error) {
      } finally {
        searchButton();
      }
    } else {
      return;
    }
  });
};
const deleteButton2 = async () => {
  if (updatedRow2.value.filter((item) => item.checkbox == true).length == 0) {
    Swal.fire({
      title: "경고",
      text: "삭제 대상을 먼저 체크하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  Swal.fire({
    title: "경고",
    text: "정말 삭제하시겠습니까?",
    icon: "warning",
    confirmButtonText: "확인",
    cancelButtonText: "취소",
    showCancelButton: true,
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        store.state.loading = true;
        const groups = updatedRow2.value
          .filter((item) => item.checkbox == true)
          .map((item) => item.lngStoreGroup)
          .join("\u200b");
        const stores = updatedRow2.value
          .filter((item) => item.checkbox == true)
          .map((item) => item.lngStoreCode)
          .join("\u200b");
        const lngcodes = updatedRow2.value
          .filter((item) => item.checkbox == true)
          .map((item) => item.lngCode)
          .join("\u200b");
        const res = await deleteWorkShifts2(groups, stores, lngcodes);

        ////console.log(res);
        store.state.loading = false;
      } catch (error) {
      } finally {
        searchButton();
      }
    } else {
      return;
    }
  });
};

const selectedExcelDate = ref("");

const selectedExcelStore = ref("");
</script>
