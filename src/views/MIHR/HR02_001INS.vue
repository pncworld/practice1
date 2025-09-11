<!-- /*--############################################################################
# Filename : HR02_001INS.vue                                                   
# Description : 인사관리 > 근태 관리 > 스케쥴 등록                           
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
        <button @click="saveButton" class="button save w-auto">저장</button>

        <button @click="copyButton" class="button copy w-auto">복사</button>
        <button @click="excelButton" class="button excel w-auto">엑셀</button>
      </div>
    </div>
    <div
      class="grid grid-cols-3 grid-rows-1 bg-gray-200 rounded-lg h-16 items-center z-10 justify-center">
      <div class="ml-12">
        <PickStoreRenew
          @storeNm="storeNm"
          :placeholderName="'선택'"
          @lngStoreGroup="lngStoreGroup"
          @lngStoreCode="lngStoreCode"></PickStoreRenew>
      </div>
      <div class="flex space-x-5 text-nowrap items-center ml-16">
        <Datepicker2
          :mainName="'기간'"
          @endDate="endDate"
          @startDate="startDate"></Datepicker2>
      </div>
      <div
        class="ml-1 flex space-x-5 justify-center items-center border border-black bg-zinc-300 w-[100%] rounded-lg h-12">
        <label for="cond"
          ><input
            type="radio"
            id="cond"
            name="cond"
            v-model="cond"
            value="1" />휴무일 자동지정</label
        >
        <label for="cond2"
          ><input
            type="radio"
            id="cond2"
            name="cond"
            v-model="cond"
            value="2" />근무조 자동지정</label
        >
        <label for="cond3"
          ><input
            type="radio"
            id="cond3"
            name="cond"
            v-model="cond"
            value="3" />미지정</label
        >
        <select
          name=""
          id=""
          class="border border-black w-48 h-8"
          v-model="cond2">
          <option :value="i.lngCode" v-for="i in optionList">
            {{ i.strWorkGupName }}
          </option>
        </select>
      </div>
    </div>
    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div
      class="grid grid-rows-1 grid-cols-[5fr,2fr] w-[99%] h-[80vh] space-x-3">
      <div class="w-full h-[90%] space-y-1 mt-2">
        <Realgrid
          :progname="'HR02_001INS_VUE'"
          :progid="1"
          :rowData="rowData"
          :reload="reload"
          @clickedRowData="clickedRowData"
          @clickedButtonCol="clickedButtonCol"
          @selectedIndex="selectedIndex"
          :selectionStyle="'block'"
          :setCellStyleColId3="true"
          :setDynamicGrid5="true"
          :dynamicRowHeight="true"
          :fixedColumn="true"
          :changeValue2="changeValue2"
          :changeNow2="changeNow2"
          :changeColid="changeColid"
          :changeRow="changeRow"
          :setDynamicGrid5Cond="setDynamicGrid5Cond"
          :setDynamicGrid5Cond2="setDynamicGrid5Cond2">
        </Realgrid>
      </div>
      <div class="w-full h-[85%] space-y-1 mt-2">
        <div
          class="flex items-center space-x-3 border border-black bg-slate-300 rounded-lg h-10 justify-center">
          <select name="" id="" class="border border-black w-48 h-8">
            <option :value="i.lngCode" v-for="i in optionList">
              {{ i.strWorkGupName }}
            </option>
          </select>
          <label for="scond"
            ><input type="checkbox" id="scond" />휴무일 자동지정</label
          >
          <div class="space-x-5">
            <button class="whitebutton bg-white">신규</button>
            <button class="whitebutton bg-white">삭제</button>
          </div>
        </div>
        <div class="h-[40%]">
          <Realgrid
            :progname="'HR02_001INS_VUE'"
            :progid="2"
            :rowData="filteredRowData2"
            :labelsData="labelsData"
            :valuesData="valuesData"
            :rowStateeditable="false"
            :editableColId="'strETime,strSTime,lngAtndType'"
            :CalculateTimeColId="'strWorkTime'"
            :labelingColumns="'lngAtndType'">
          </Realgrid>
        </div>
        <div class="bg-blue-800 text-white flex justify-center">
          일메모 등록
        </div>
        <div class="border border-black h-[55%]">
          <textarea name="" id="" class="h-full w-full"></textarea>
        </div>
      </div>
    </div>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import {
  deleteWorkShifts,
  deleteWorkShifts2,
  getEmpScheduleList,
  getInitScheduleData,
  getWorkShiftList,
  getWorkTypeList,
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

import { formatLocalDate, insertPageLog } from "@/customFunc/customFunc";
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

const optionList = ref([]);
onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getWorkTypeList(store.state.userData.lngStoreGroup);

  console.log(res);

  labelsData.value = [res.data.List.map((item) => item.strName)];
  valuesData.value = [res.data.List.map((item) => item.lngCode)];
});

const reload = ref(false);
const rowData = ref([]);
const rowData2 = ref([]);
const filteredRowData2 = ref([]);
const rowData3 = ref([]);
const afterSearch = ref(false);
const clickedRow = ref(false);
const labelsData = ref([]);
const valuesData = ref([]);

const tempCharger = ref("");
const clickedRowData = (e) => {
  console.log(e);
  tempCharger.value = e[9];
  //filteredRowData2.value = rowData2.value.filter(item => item.lngCharger == e[9] && item.)
};
const cond2 = ref(0);
const changeColid = ref("");
const changeValue2 = ref("");
const changeRow = ref("");
const changeNow2 = ref(false);

const selectedIndex = (e) => {
  changeRow.value = e;
};
const clickedButtonCol = (e) => {
  const count = parseInt(e.slice(1));

  const today = new Date(sdate.value);
  console.log(today);
  console.log(count);
  today.setDate(today.getDate() + count);
  console.log(today);
  const cdate = formatLocalDate(today);
  console.log(cdate);
  filteredRowData2.value = rowData2.value.filter(
    (item) => item.lngCharger == tempCharger.value && item.dtmDate == cdate
  );
  console.log(filteredRowData2.value);

  changeColid.value = e;
  if (cond.value == "3") {
    return;
  }
  const filteredOption = optionList.value
    .filter((item) => item.lngCode == cond2.value)[0]
    .strWorkGupName.slice(0, 5);
  const filteredOption2 = optionList.value
    .filter((item) => item.lngCode == cond2.value)[0]
    .strWorkGupName.slice(6, 11);
  console.log(cond.value);
  if (cond.value == "2") {
    changeValue2.value = filteredOption + filteredOption2;
  } else if (cond.value == "1") {
    changeValue2.value = "휴무";
  }

  changeNow2.value = !changeNow2.value;
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
const cond = ref(3);
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
    reload.value = !reload.value;
    const res = await getEmpScheduleList(
      selectedGroup.value,
      selectedStores.value,
      sdate.value,
      edate.value
    );
    console.log(res);
    rowData.value = res.data.List4;
    let tempRowData = res.data.List4;

    let tempMergeRowData = res.data.List;
    for (let i = 0; i < tempRowData.length; i++) {
      const tempCharger = tempRowData[i].lngSequence;

      console.log(tempCharger);
      const filterData = tempMergeRowData.filter(
        (item) => item.lngCharger == tempCharger
      );
      for (let j = 1; j <= filterData.length; j++) {
        const findit = rowData.value.find(
          (item) => item.lngSequence == tempCharger
        );
        findit[`G${j}`] =
          filterData[j - 1].strAlias != ""
            ? filterData[j - 1].strAlias
            : filterData[j - 1].lngOffyn == "1"
            ? "휴무"
            : filterData[j - 1].strSTime + filterData[j - 1].strETime;
      }
    }

    rowData.value = [...rowData.value];
    rowData2.value = res.data.List2;
    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    console.log(error);
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

  const res = await getInitScheduleData(store.state.userData.lngStoreGroup, e);
  //console.log(res);
  optionList.value = res.data.List;

  if (optionList.value.length > 0) {
    cond2.value = optionList.value[0].lngCode;
  }

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

const setDynamicGrid5Cond2 = ref("");

const setDynamicGrid5Cond = ref("");

const sdate = ref("");
const edate = ref("");
const startDate = (e) => {
  setDynamicGrid5Cond.value = e;
  sdate.value = e;
};

const endDate = (e) => {
  setDynamicGrid5Cond2.value = e;
  edate.value = e;
};
</script>
