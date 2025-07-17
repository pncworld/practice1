/*--############################################################################
# Filename : MST37_068INS.vue                                                  
# Description : 마스터관리 > 메뉴 마스터 > 멀티단가 등록                       
# Date :2025-05-23                                                             
# Author : 권맑음                     
################################################################################*/
<template>
  <!-- 조회조건 -->
  <div class="h-full" @click="handleParentClick">
    <div class="flex justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>

      <div class="flex justify-center mr-9 space-x-2 pr-5">
        <button @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <button @click="saveButton" class="button save md:w-auto w-14">
          <!-- 여기서부터 -->
          저장
        </button>
        <button @click="excelButton" class="button excel w-auto excel">
          엑셀
        </button>
      </div>
    </div>

    <div
      class="grid grid-cols-1 grid-rows-2 bg-gray-200 rounded-lg h-24 items-center z-10">
      <div
        class="flex justify-start mr-40 items-center text-base font-semibold space-x-20 ml-12">
        <div class="flex justify-start items-center">
          <div>매장명</div>
          <select name="" id="" class="w-40 h-8 ml-5" v-model="selectedStore">
            <option value="0">선택</option>
            <option :value="i.lngStoreCode" v-for="i in GroupList">
              {{ i.strStoreName }}
            </option>
          </select>
        </div>
        <div class="flex justify-center items-center">
          <div>멀티단가그룹</div>
          <div>
            <select
              name=""
              id=""
              class="w-40 h-8 ml-5"
              v-model="selectedMultiGroup">
              <option value="0">전체</option>
              <option :value="i.lngCode" v-for="i in MultiGroupList">
                {{ i.strName }}
              </option>
            </select>
          </div>
        </div>
        <div class="flex justify-center items-center">
          <div>메뉴서브그룹</div>
          <div>
            <select
              name=""
              id=""
              class="w-40 h-8 ml-5"
              v-model="selectedSubGroup">
              <option value="0">전체</option>
              <option :value="i.lngCode" v-for="i in MultiSubList">
                {{ i.strName }}
              </option>
            </select>
          </div>
        </div>
        <div class="flex justify-center items-center">
          <div>메뉴검색</div>
          <div><input type="text" class="w-40 h-8 ml-5" v-model="cond" /></div>
        </div>
      </div>

      <div class="flex justify-center -ml-2 space-x-20 items-center">
        <!-- <div>
          <label for="cond"
            ><input type="checkbox" id="cond" v-model="cond2" />전체 선택</label
          >
        </div> -->
        <div class="flex space-x-2 pl-96 items-center">
          <div>
            기준단가 : <input type="number" v-model="cond3" class="w-10" />
          </div>
          <div>
            %로 일괄적용. (단
            <input type="number" v-model="cond4" class="w-10" />
          </div>
          <div>
            자리 수에서
            <select name="" id="" v-model="cond5">
              <option value="0">절사</option>
              <option value="1">반올림</option>
              <option value="2">올림</option></select
            >)
          </div>
          <button class="whitebutton bg-white" @click="changeMultiPrice">
            적용
          </button>
          <button class="whitebutton bg-white" @click="deleteMultiPrice">
            삭제
          </button>
        </div>
      </div>
    </div>
    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="w-full h-[80%]">
      <Realgrid
        :progname="'MST37_068INS_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :setStateBar="false"
        :documentTitle="'MST37_068INS'"
        :documentSubTitle="documentSubTitle"
        :rowStateeditable="false"
        :showCheckBar="false"
        :checkRenderEditable="false"
        :changeNow3="changeNow"
        :changeRow="changeRow"
        :changeColid="changeColid"
        :changeValue2="changeValue2"
        @checkedRowData="checkedRowData"
        @checkedRowIndex="checkedRowIndex"
        @updatedRowData="updatedRowData"
        @allStateRows="allStateRows"
        :getRowChanged="getRowChanged"
        :exporttoExcel="exportExcel">
      </Realgrid>
    </div>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import {
  getMenuStoreList,
  getMultiGroup,
  getMultiPrice,
  getSubGroup,
  saveMultiPrice,
} from "@/api/master";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
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
import Swal from "sweetalert2";
/**
 *  경고창 호출 라이브러리
 *  */

/*
 * 공통 표준  Function
 */

import { nextTick, onMounted, ref, watch } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";
/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const userGroup = store.state.storeGroup[0].lngStoreGroup;
  const res = await getMenuStoreList(userGroup);
  GroupList.value = res.data.List;
  reload.value = !reload.value;

  const res2 = await getMultiGroup(userGroup);

  MultiGroupList.value = res2.data.List;
  const res3 = await getSubGroup(userGroup);

  MultiSubList.value = res3.data.List;
});

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);
const GroupList = ref([]);
const cond = ref("");
const cond2 = ref(false);
const cond3 = ref("100");
const cond4 = ref("0");
const cond5 = ref("1");
const store = useStore();
const MultiSubList = ref([]);
const selectedSubGroup = ref(0);
const MultiGroupList = ref([]);
const selectedMultiGroup = ref(0);
const datepicker = ref(null);
const closePopUp = ref(false);
const searchType = ref("0");

const selectedSubCode = ref(0);
const subCode = (e) => {
  selectedSubCode.value = e;
};
const selectedMainCode = ref(0);
const mainCode = (e) => {
  selectedMainCode.value = e;
};

const checkedDatas = ref([]);
const checkedRowData = (e) => {
  //console.log(e);
  checkedDatas.value = e.map((item) => item.lngMenuPrice);
  //console.log(checkedDatas.value);
};
const checkedIndexs = ref([]);
const checkedRowIndex = (e) => {
  checkedIndexs.value = e;
  // //console.log(e);
};

const updateRowData = ref([]);
const updatedRowData = (e) => {
  updateRowData.value = e;
};

const getRowChanged = ref(false);
const updatedRows = ref([]);
const allStateRows = (e) => {
  updatedRows.value = e.updated;
};

const changeNow = ref(false);
const changeValue2 = ref("");
const changeColid = ref("lngMultiPrice");
const changeRow = ref(0);

const changeMultiPrice = async (e) => {
  if (checkedIndexs.value.length == 0) return;

  for (let i = 0; i < checkedIndexs.value.length; i++) {
    changeRow.value = checkedIndexs.value[i];
    changeValue2.value =
      checkedDatas.value[i] == undefined ? 0 : checkedDatas.value[i];

    changeValue2.value =
      cond5.value == "0"
        ? Math.floor(changeValue2.value * (cond3.value / 100), cond4.value)
        : cond5.value == "1"
        ? Math.round(changeValue2.value * (cond3.value / 100), cond4.value)
        : Math.ceil(changeValue2.value * (cond3.value / 100), cond4.value);
    changeNow.value = !changeNow.value;
    await nextTick();
  }

  getRowChanged.value = !getRowChanged.value;
};

const deleteMultiPrice = async () => {
  if (checkedIndexs.value.length == 0) return;

  for (let i = 0; i < checkedIndexs.value.length; i++) {
    changeRow.value = checkedIndexs.value[i];
    changeValue2.value = undefined;

    changeNow.value = !changeNow.value;
    await nextTick();
  }

  getRowChanged.value = !getRowChanged.value;
};
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
  //   if (selectedStore.value == 0) {
  //     Swal.fire({
  //       title: "경고",
  //       text: "매장명을 먼저 선택하세요.",
  //       icon: "warning",
  //       confirmButtonText: "확인",
  //     });
  //     return;
  //   }
  try {
    store.state.loading = true;
    // initGrid();
    reload.value = !reload.value;
    const res = await getMultiPrice(
      store.state.userData.lngStoreGroup,
      selectedMultiGroup.value,
      selectedSubGroup.value,
      cond.value
    );
    //console.log(res);
    rowData.value = res.data.List;
    updateRowData.value = JSON.parse(JSON.stringify(res.data.List));
    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    //comsole.log(error);
  } finally {
    store.state.loading = false;
  }
};

const saveButton = async (e) => {
  // if (selectedStore.value == 0) {
  //   Swal.fire({
  //     title: "경고",
  //     text: "매장명을 먼저 선택하세요.",
  //     icon: "warning",
  //     confirmButtonText: "확인",
  //   });
  //   return;
  // }
  //console.log(updateRowData.value);
  // const filteredData = updateRowData.value.filter(
  //   (item) => item.lngMultiPrice != undefined
  // );
  // //console.log(filteredData);
  // //console.log(store.state.userData.lngStoreGroup);
  try {
    store.state.loading = true;
    // initGrid();
    // reload.value = !reload.value;
    const multipricecodes = updateRowData.value
      .filter((i, index) => updatedRows.value.includes(index))
      .map((item) => item.lngMultiPriceGroupCode)
      .join("\u200B");
    const lngMenucodes = updateRowData.value
      .filter((i, index) => updatedRows.value.includes(index))
      .map((item) => item.lngMenuCode)
      .join("\u200B");
    const lngMultiPrice = updateRowData.value
      .filter((i, index) => updatedRows.value.includes(index))
      .map((item) =>
        item.lngMultiPrice == undefined ? -1 : item.lngMultiPrice
      )
      .join("\u200B");
    const res = await saveMultiPrice(
      store.state.userData.lngStoreGroup,
      multipricecodes,
      lngMenucodes,
      lngMultiPrice
    );
    //console.log(res);
    store.state.loading = false;
  } catch (error) {
    //console.log(error);
  } finally {
    store.state.loading = false;
  }
};

/* 매장 컴포넌트 관련 함수 */
const selectedGroup = ref();
const selectedStores = ref();
const selectedStore = ref(0);
const selectedStoreAttrs = ref();

/**
 * 페이지 매장 코드 세팅
 */

const lngStoreCode = async (e) => {
  initGrid();
  selectedStores.value = e;
  //console.log(e);
};
const lngStoreGroup = async (e) => {
  //initGrid();
  selectedGroup.value = e;
  //console.log(e);
};

/**
 * 그리드 초기화
 */

const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
  cond.value = "";
};

watch([selectedSubGroup, selectedMultiGroup, selectedStore], () => {
  initGrid();
});

//엑셀 버튼 처리 함수
const exportExcel = ref(false);
/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  let storeNm;
  if (selectedStore.value == 0) {
    storeNm = "선택";
  } else {
    storeNm = GroupList.value.filter(
      (item) => item.lngStoreCode == selectedStore.value
    )[0].strStoreName;
  }

  let storeGroup;
  if (selectedStore.value == 0) {
    storeGroup = "전체";
  } else {
    storeGroup = MultiGroupList.value.filter(
      (item) => item.lngCode == selectedMultiGroup.value
    )[0].strName;
  }

  let menuSubGroup;
  if (selectedStore.value == 0) {
    menuSubGroup = "전체";
  } else {
    menuSubGroup = MultiSubList.value.filter(
      (item) => item.lngCode == selectedSubGroup.value
    )[0].strName;
  }

  documentSubTitle.value =
    "매장명 : " +
    storeNm +
    "\n" +
    "멀티단가그룹 : " +
    storeGroup +
    "\n" +
    "메뉴서브그룹 : " +
    menuSubGroup;

  //documentSubTitle.value += "\n";
  exportExcel.value = !exportExcel.value;
};

// 엑셀 추출
const documentSubTitle = ref("");
const selectedExcelList = ref("");
const selectedExcelDate = ref("");

const selectedExcelStore = ref("");
/**
 * 엑셀용 매장 세팅 함수
 */

const excelStore = (e) => {
  selectedExcelStore.value = "매장명 : " + e;
  //comsole.log(e);
};
const excelDate = (e) => {
  selectedExcelDate.value = e;
  //comsole.log(e);
};
</script>
