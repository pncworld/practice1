<template>
  <div>
    <!-- <div class="flex items-center w-full space-x-10">
      <h1 class="flex-grow text-center ml-72 text-xl">마스터자동다운로드 등록 </h1>
      <div class="flex justify-end space-x-10 pr-16">
        <button class="flex justify-center" @click="searchButton">
          조회
        </button>
        <button class="flex justify-center" @click="saveButton">
          저장
        </button>
        <button class="flex justify-center" @click="deleteButton">
          삭제
        </button>
      </div>
    </div> -->
    <div class="flex justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center mr-9 space-x-2 pr-5">
        <button @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <button @click="saveButton" class="button save w-auto save">
          저장
        </button>
        <button @click="deleteButton" class="button save w-auto delete">
          삭제
        </button>
      </div>
    </div>
    <br />
    <!-- <div class="space-x-0 flex justify-start items-center w-full ml-14">
      <div class="items-center w-3/12 justify-start flex whitespace-nowrap">매장 : &nbsp;&nbsp;<select
          class="border border-gray-800 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-48 h-8 text-xs"
          v-model="storeCd" @change="getPosNo">
          <option value="0">전체</option>
          <option v-for="item in stores" :key="item.id" :value="item.lngStoreCode">{{ item.strName }}</option>
        </select>
      </div>
      <div class="items-center w-3/12 whitespace-nowrap">포스번호 : <select
          class="border  border-gray-800 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-48 h-8 text-xs"
          v-model="posNo" @change="getAreaCd">
          <option value="0">전체</option>
          <option v-for="item in posNos" :key="item.id" :value="item.lngCode">{{ item.strName }}</option>
        </select></div>
      <div class="items-center w-3/12 whitespace-nowrap">지역 : <select
          class="border  border-gray-800 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-48 h-8 text-xs"
          v-model="lngAreaCd">
          <option value="0">전체</option>
          <option v-for="item in areaCd" :key="item.id" :value="item.lngCode">{{ item.strName }}</option>
        </select></div>
      <div class="items-center flex space-x-5 w-2/12">
        
    </div> -->
    <div
      class="flex justify-between bg-gray-200 rounded-lg h-16 items-center z-10 text-base">
      <div class="flex justify-center space-x-32 ml-36">
        <div
          class="items-center w-3/12 justify-start flex whitespace-nowrap text-base">
          매장 : &nbsp;&nbsp;<select
            class="text-base border border-gray-800 rounded-md pl-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-48 h-8"
            v-model="storeCd"
            @change="getPosNo">
            <option value="0">전체</option>
            <option
              v-for="item in stores"
              :key="item.id"
              :value="item.lngStoreCode">
              {{ item.strName }}
            </option>
          </select>
        </div>
        <div class="items-center w-3/12 whitespace-nowrap">
          포스번호 :
          <select
            class="border border-gray-800 rounded-md pl-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-48 h-8 text-base"
            v-model="posNo"
            @change="getAreaCd">
            <option value="0">전체</option>
            <option v-for="item in posNos" :key="item.id" :value="item.lngCode">
              {{ item.strName }}
            </option>
          </select>
        </div>
        <div class="items-center w-3/12 whitespace-nowrap">
          지역 :
          <select
            class="border border-gray-800 rounded-md pl-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-48 h-8 text-base"
            v-model="lngAreaCd">
            <option value="0">전체</option>
            <option v-for="item in areaCd" :key="item.id" :value="item.lngCode">
              {{ item.strName }}
            </option>
          </select>
        </div>

        <div class="whitespace-nowrap flex items-center space-x-3">
          <Datepicker1_1 @dateValue="dateValue"></Datepicker1_1>
        </div>
      </div>

      <div></div>
    </div>
  </div>
  <div
    class="grid grid-cols-[1fr,2fr] grid-rows-1 justify-between h-[85%] space-x-10 w-[97%] mt-1">
    <Realgrid
      :progname="'MST01_032INS_VUE'"
      :progid="1"
      :rowData="rowData"
      :rowStateeditable="false"
      @checkedRowData="checkedRowData"></Realgrid>
    <Realgrid
      :progname="'MST01_032INS_VUE'"
      :progid="2"
      :rowData="rowData2"
      :rowStateeditable="false"
      @checkedRowData="checkedRowData2"></Realgrid>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";

import { useStore } from "vuex";

import Swal from "sweetalert2";

import {
  deleteMasterList,
  getAreaList,
  getMaster2List,
  getMasterList,
  getPosList,
  insertMasterList,
} from "@/api/master";
import Datepicker1_1 from "@/components/Datepicker1_1.vue";
import Realgrid from "@/components/realgrid.vue";
import { insertPageLog } from "@/customFunc/customFunc";
import PageName from "@/components/pageName.vue";

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
});
const store = useStore();
// 그리드에 다중 선택 혹은 개별 선택 설정 변수
const selection = ref({ mode: "cell" });
// vuex에 저장된 로그인된 정보 호출
const userData = store.state.userData;
// 그리드안에 들어갈 행 데이터 배열 선언
const rowData = ref([]);
// 로그인한 사람의 groupCd를 초기화하려는 목적(조회용)
const groupCd = ref(userData.lngStoreGroup);
// 로그인한 사람의 typeCd를 초기화하려는 목적(조회용)
const typeCd = ref();
// 로그인한 사람의 storeCd를 초기화하려는 목적 (조회용)
const storeCd = ref(0);
// 상세보기 기능을 위한 변수
const detailViewtf = ref(true);
// 조회 후를 감지하기 위한 변수
const afterSearch = ref(false);
// 셀병합 기능을 위한 변수
const cellUnitedtf = ref(false);
// 그리드 설정 값을 불러오기 위한 하드코딩

const stores = ref([]);
const rowData2 = ref([]);
const lngAreaCd = ref(0);

stores.value = store.state.storeCd;
// 조회 값 설정 함수 선언

// 상세보기 눌렀을때 실행하는 함수

// 그리드 설정을 위한 속성 설정

// 행이 생성될 컬럼을 설정 (field, headerName 등등)
const colDefs = ref([]);
const colDefs2 = ref([]);

const gridApi = ref(null);
const gridApi2 = ref(null);

const posNos = ref([]);
const getPosNo = async () => {
  const response = await getPosList(groupCd.value, storeCd.value);

  posNos.value = response.data.pos;
  posNo.value = 0;
  lngAreaCd.value = 0;
  areaCd.value = [];
};
const posNo = ref(0);
const areaCd = ref(0);
const getAreaCd = async (e) => {
  if (e.target.value == 0) {
    areaCd.value = [];
    lngAreaCd.value = 0;
    return;
  }
  const response = await getAreaList(groupCd.value, storeCd.value, posNo.value);
  areaCd.value = response.data.area;
  lngAreaCd.value = 0;
};
const selectedDate = ref();
const dateValue = (e) => {
  console.log(e);
  selectedDate.value = e;
};

// 조회 함수.
const searchButton = async () => {
  store.state.loading = true;
  try {
    initGrid();

    const res = await getMasterList(1, 100);

    rowData.value = res.data.master;

    const res2 = await getMaster2List(
      groupCd.value,
      storeCd.value,
      lngAreaCd.value,
      posNo.value,
      selectedDate.value
    );

    rowData2.value = res2.data.master2;

    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
  } finally {
    store.state.loading = false;
    //areaCd.value = [];
  }
};
const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
  if (rowData2.value.length > 0) {
    rowData2.value = [];
  }
};

const saveTables = ref([]);
const deleteTables = ref([]);
const deleteTablesStoreCds = ref([]);
const deleteTablesAreaCds = ref([]);
const deleteTablesPosNos = ref([]);
const checkedRowData = (e) => {
  saveTables.value = e.map((item) => item.lngTableID);
};
const checkedRowData2 = (e) => {
  console.log(e);
  deleteTables.value = e.map((item) => item.lngTableID);
  deleteTablesStoreCds.value = e.map((item) => item.lngStoreCode);
  deleteTablesAreaCds.value = e.map((item) => item.lngAreaCode);
  deleteTablesPosNos.value = e.map((item) => item.intPosNO);
};

const saveButton = async () => {
  if (!afterSearch.value) {
    Swal.fire({
      title: "조회를 먼저 해주세요.",

      confirmButtonText: "저장",
    });
    return;
  }
  try {
    store.state.loading = true;

    const res = await insertMasterList(
      groupCd.value,
      storeCd.value,
      lngAreaCd.value,
      posNo.value,
      saveTables.value.join(","),
      selectedDate.value
    );
    console.log(res);
  } catch (error) {}

  searchButton();
};
const deleteButton = async () => {
  if (!afterSearch.value) {
    Swal.fire({
      title: "조회를 먼저 해주세요.",

      confirmButtonText: "저장",
    });
    return;
  }
  try {
    store.state.loading = true;

    const res = await deleteMasterList(
      groupCd.value,
      deleteTablesStoreCds.value.join(","),
      deleteTablesAreaCds.value.join(","),
      deleteTablesPosNos.value.join(","),
      deleteTables.value.join(","),
      selectedDate.value
    );
    console.log(res);
  } catch (error) {
  } finally {
    Swal.fire({
      title: "삭제.",
      text: "삭제되었습니다.",
      icon: "success",

      confirmButtonColor: "#3085d6",

      confirmButtonText: "확인",
    });
  }

  searchButton();
};
</script>

<style></style>
