<!-- /*--############################################################################
# Filename : MST44_066INS.vue                                                  
# Description : 마스터관리 > POS 마스터 > 다국어관리           
# Date :2025-12-05                                                            
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <!-- 조회 조건 -->
  <div class="h-full" @click="handleParentClick">
    <div class="flex justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center mr-9 space-x-2 pr-5">
        <button @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <button @click="saveButton" class="button save md:w-auto w-14">
          저장
        </button>
        <!-- <button @click="excelButton" class="button save w-auto excel">
          엑셀
        </button> -->
      </div>
    </div>
    <div
      class="flex justify-start bg-gray-200 rounded-lg h-14 items-center z-10 pb-3">
      <PickStore
        @update:storeCd="lngStoreCode"
        :showPosNo="showPosNo"
        @posNo="posNo"
        @update:storeAreaCd="lngAreaCode"></PickStore>
    </div>

    <div class="flex ml-10 mt-5">
      <button
        :class="selected == 1 ? 'bg-blue-100 text-blue-400' : 'bg-gray-100'"
        @click="selected = 1"
        class="bg-gray-100 h-12 rounded-t-lg font-bold p-2 border w-20">
        메뉴코드
      </button>
      <button
        :class="selected == 2 ? 'bg-blue-100 text-blue-400' : 'bg-gray-100'"
        @click="selected = 2"
        class="bg-gray-100 h-12 rounded-t-lg font-bold p-2 border w-20">
        화면키
      </button>
    </div>
    <div class="h-[70vh] w-full ml-10 mt-1 flex flex-col" v-if="selected == 1">
      <div class="text-xl font-semibold">메뉴코드 목록</div>
      <div class="mt-3 grid grid-cols-[1fr,3fr] grid-rows-2 gap-0 w-[30%]">
        <div class="customtableIndex border border-gray-400 rounded-tl-lg">
          메뉴분류
        </div>
        <div class="border border-gray-300 rounded-tr-lg flex p-1">
          <select
            name="lngMainGroup"
            id=""
            class="flex-1 border rounded-lg w-[80%] h-full"
            @change="setSubCd"
            v-model="forsearchMain">
            <option value="-1">전체</option>
            <option :value="i.GroupCd" v-for="i in MenuGroup">
              [{{ i.GroupCd }}]{{ i.majorGroupNm }}
            </option>
          </select>
          <select
            name="lngSubGroup"
            id=""
            class="flex-1 border rounded-lg w-full h-full"
            v-model="forsearchSub"
            @change="setSubCd">
            <option value="-1">전체</option>
            <option :value="i.GroupCd" v-for="i in filteredSubMenuGroup">
              [{{ i.GroupCd }}]{{ i.subGroupNm }}
            </option>
          </select>
        </div>
        <div class="customtableIndex border border-gray-400 rounded-bl-lg">
          메뉴명/코드
        </div>
        <div class="px-1 py-1 border border-gray-300 rounded-br-lg">
          <input
            type="text"
            class="border w-full h-full px-1 border-gray-400 rounded-lg"
            @input="setSearchWord"
            v-model="searchWord" />
        </div>
      </div>
      <div class="grid grid-rows-1 grid-cols-[3fr,7fr] w-full h-full">
        <Realgrid
          :progname="'MST44_066INS_VUE'"
          :progid="1"
          :setStateBar="false"
          :searchWord3="searchWord"
          :searchColId3="['lngMainGroup', 'lngSubGroup']"
          :searchValue="searchValue"
          :searchColId="'lngCode,strName'"
          @clickedRowData="clickedRowData"
          :rowData="rowData"
          :rowStateeditable="false">
        </Realgrid>

        <div class="flex flex-col ml-10 w-[90%] space-y-2 -mt-28 pt-3">
          <div class="flex flex-col h-[40%]">
            <div class="flex justify-between">
              <div class="flex text-xl font-semibold">메뉴명</div>
              <div class="flex space-x-2">
                <button class="whitebutton" @click="addButton">추가</button>
                <button class="whitebutton" @click="deleteButton">삭제</button>
              </div>
            </div>
            <div class="h-full">
              <Realgrid
                :progname="'MST44_066INS_VUE'"
                :progid="2"
                :rowData="rowData2"
                :addRow4="addRow"
                :labelsData="[['한국어', '영어', '중국어', '일본어']]"
                :valuesData="[['0', '1', '2', '4']]"
                @updatedRowData="updatedRowData"
                @allStateRows="allStateRows"
                :labelingColumns="'lngLanguageID'"
                :editableColId="'lngLanguageID,strManageName'"
                :addrowProp="'lngStoreGroup,lngStoreCode,lngType,lngManageCode,strManageName'"
                :addrowDefault="addrowDefault"
                :deleteRow6="deleterow"
                :rowStateeditable="false"></Realgrid>
            </div>
          </div>
          <div class="flex flex-col h-[40%]">
            <div class="flex justify-between">
              <div class="flex text-xl font-semibold">메뉴설명</div>
              <div class="flex space-x-2">
                <button class="whitebutton" @click="addButton2">추가</button>
                <button class="whitebutton" @click="deleteButton2">삭제</button>
              </div>
            </div>
            <div class="h-full">
              <Realgrid
                :progname="'MST44_066INS_VUE'"
                :progid="3"
                :rowData="rowData3"
                :addRow4="addRow2"
                @updatedRowData="updatedRowData2"
                @allStateRows="allStateRows2"
                :labelsData="[['한국어', '영어', '중국어', '일본어']]"
                :valuesData="[['0', '1', '2', '4']]"
                :labelingColumns="'lngLanguageID'"
                :editableColId="'lngLanguageID,strManageName'"
                :addrowProp="'lngStoreGroup,lngStoreCode,lngType,lngManageCode,strManageName'"
                :addrowDefault="addrowDefault2"
                :deleteRow6="deleterow2"
                :rowStateeditable="false"></Realgrid>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="h-[60vh] w-full ml-10 mt-1 flex" v-if="selected == 2">
      <div class="flex w-[30%] h-full flex-col">
        <div class="text-xl font-semibold">화면키 목록</div>

        <div class="grid rounded-lg grid-rows-1 grid-cols-[1fr,3fr] w-[100%]">
          <div
            class="border rounded-tl-lg rounded-bl-lg customtableIndex border-gray-300">
            화면명
          </div>
          <div
            class="bg-white border rounded-tr-lg rounded-br-lg border-gray-300 flex justify-center items-center">
            <input
              type="text"
              class="h-[80%] w-[90%] border border-gray-300 rounded-lg"
              @input="setsearchWord2" />
          </div>
        </div>
        <Realgrid
          :progname="'MST44_066INS_VUE'"
          :progid="4"
          :rowData="rowData4"
          :searchColId="'strScreenName'"
          :searchWord3="searchword2"
          @clickedRowData="clickedRowData2"
          :rowStateeditable="false">
        </Realgrid>
      </div>

      <div class="flex w-[60%] h-full ml-10 flex-col">
        <div class="flex justify-between w-full">
          <div class="text-xl font-semibold">화면명</div>
          <div class="flex space-x-1">
            <button class="whitebutton" @click="addButton3">추가</button>
            <button class="whitebutton" @click="deleteButton3">삭제</button>
          </div>
        </div>
        <div class="w-full h-[30%]">
          <Realgrid
            :progname="'MST44_066INS_VUE'"
            :progid="5"
            :rowData="rowData5"
            :labelsData="[['한국어', '영어', '중국어', '일본어']]"
            :valuesData="[['0', '1', '2', '4']]"
            :labelingColumns="'lngLanguageID'"
            :addrowDefault="addrowDefault3"
            :addRow4="addRow3"
            :deleteRow6="deleterow3"
            @updatedRowData="updatedRowData3"
            @allStateRows="allStateRows3"
            :editableColId="'lngLanguageID,strManageName'"
            :addrowProp="'lngStoreGroup,lngStoreCode,lngType,lngManageCode,strManageName'"
            :rowStateeditable="false">
          </Realgrid>
        </div>
      </div>
    </div>
  </div>
  <!--그리드 영역 -->
</template>

<script setup>
import {
  getMenuList,
  getMenuList5,
  getMultiLingual2,
  getMultiLingual3,
  getScreenList5,
  saveMultiLang,
} from "@/api/master";
import { getMenuCdList } from "@/api/misales";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
import PickStore from "@/components/pickStore.vue";
/**
 *  매장  단일 선택 컴포넌트
 *  */

/**
 * 	그리드 생성
 */

import Realgrid from "@/components/realgrid.vue";
/**
 *  페이지로그 자동 입력
 *  */

import { insertPageLog } from "@/customFunc/customFunc";
import Swal from "sweetalert2";
/*
 * 공통 표준  Function
 */

import { onMounted, ref, watch } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";

const reload = ref(false);
const rowData = ref([]);
const rowData2 = ref([]);
const rowData3 = ref([]);
const selected = ref(1);

const afterSearch = ref(false);
const selectedstartDate = ref();
const selectedendDate = ref();
const cond = ref(0);
const cond2 = ref(1);
const cond3 = ref(0);
const cond4 = ref(0);

const store = useStore();

/**
 * 	화면 Load시 실행 스크립트
 */

const optionList = ref([]);
const optionList2 = ref([]);
const optionList3 = ref([]);
const filteredOptionList = ref([]);
const filteredOptionList2 = ref([]);

const optionList7 = ref([]);
onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getMenuList5(store.state.userData.lngStoreGroup, 0);
  console.log(res);
  rowData.value = res.data.List;

  const res2 = await getMenuList(store.state.userData.lngStoreGroup, 0);
  //rowData2.value = res2.data.menuList
  SubMenuGroup.value = res2.data.submenuGroup;
  MenuGroup.value = res2.data.menuGroup;
});

/**
 *  조회 함수
 */

const filteredrowData = ref([]);
const searchButton = async () => {
  if (selected.value == 1) {
    try {
      initGrid();
      store.state.loading = true;
      const res = await getMenuList5(
        store.state.userData.lngStoreGroup,
        selectedStore.value
      );
      //console.log(res);
      rowData.value = res.data.List;

      afterSearch.value = true;
    } catch (error) {
      afterSearch.value = false;
    } finally {
      store.state.loading = false;
    }
  } else {
    if (selectedStore.value == "0") {
      Swal.fire({
        title: "경고",
        text: "매장을 먼저 선택해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }
    if (posno.value == undefined || posno.value == "0") {
      Swal.fire({
        title: "경고",
        text: "포스번호를 먼저 선택해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }

    try {
      store.state.loading = true;
      initGrid();
      const res3 = await getScreenList5(
        store.state.userData.lngStoreGroup,
        selectedStore.value,
        lngareacd.value,
        posno.value
      );

      //console.log(res3);

      rowData4.value = res3.data.List;
      store.state.loading = false;
    } catch (error) {
      //console.log(error);
      store.state.loading = false;
    } finally {
      store.state.loading = false;
    }
  }
};

const saveButton = async () => {
  if (selected.value == "1") {
    const langids = updatedrowdata.value
      .filter((item) => item.lngLanguageID)
      .map((item) => item.lngLanguageID);

    const hasDuplicate = langids.length !== new Set(langids).size;
    if (hasDuplicate) {
      Swal.fire({
        title: "경고",
        text: "메뉴명에 중복되는 언어가 존재합니다. 확인해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }

    const langids2 = updatedrowdata2.value
      .filter((item) => item.lngLanguageID)
      .map((item) => item.lngLanguageID);

    const hasDuplicate2 = langids2.length !== new Set(langids2).size;
    if (hasDuplicate2) {
      Swal.fire({
        title: "경고",
        text: "메뉴설명에 중복되는 언어가 존재합니다. 확인해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }
    try {
      store.state.loading = true;
      const concats = updatedrowdata.value.concat(updatedrowdata2.value);
      const concats2 = updatedrowdata.value
        .filter((_, index) => allstaterows.value.includes(index))
        .concat(
          updatedrowdata2.value.filter((_, index) =>
            allstaterows2.value.includes(index)
          )
        );
      //console.log(concats);
      const lngStoreGroup = concats
        .map((item) => item.lngStoreGroup)
        .join("\u200b");
      const lngStoreCode = concats
        .map((item) => item.lngStoreCode)
        .join("\u200b");
      const lngType = concats.map((item) => item.lngType).join("\u200b");
      const lngManageCode = concats
        .map((item) => item.lngManageCode)
        .join("\u200b");
      const lngLanguageID = concats
        .map((item) => item.lngLanguageID)
        .join("\u200b");
      const strManageName = concats
        .map((item) => item.strManageName)
        .join("\u200b");

      const dlngStoreGroup = concats2
        .map((item) => item.lngStoreGroup)
        .join("\u200b");
      const dlngStoreCode = concats2
        .map((item) => item.lngStoreCode)
        .join("\u200b");
      const dlngType = concats2.map((item) => item.lngType).join("\u200b");
      const dlngManageCode = concats2
        .map((item) => item.lngManageCode)
        .join("\u200b");
      const dlngLanguageID = concats2
        .map((item) => item.lngLanguageID)
        .join("\u200b");

      const res = await saveMultiLang(
        lngStoreGroup,
        lngStoreCode,
        lngType,
        lngManageCode,
        lngLanguageID,
        strManageName,
        dlngStoreGroup,
        dlngStoreCode,
        dlngType,
        dlngManageCode,
        dlngLanguageID
      );
      //console.log(res);

      if (res.data.RESULT_CD == "00") {
        await Swal.fire({
          title: "성공",
          text: "저장되었습니다.",
          icon: "success",
          confirmButtonText: "확인",
        });
      } else {
        await Swal.fire({
          title: "실패",
          text: "저장에 실패하였습니다.",
          icon: "error",
          confirmButtonText: "확인",
        });
      }
      // rowData.value = res.data.List;

      afterSearch.value = true;
    } catch (error) {
      afterSearch.value = false;
    } finally {
      const res = await getMultiLingual2(
        store.state.userData.lngStoreGroup,
        selectedStore.value,
        tempMenuCode.value
      );

      rowData2.value = res.data.List;
      rowData3.value = res.data.List2;
      store.state.loading = false;
    }
  } else {
    const langids = updatedrowdata3.value
      .filter((item) => item.lngLanguageID)
      .map((item) => item.lngLanguageID);

    const hasDuplicate = langids.length !== new Set(langids).size;
    if (hasDuplicate) {
      Swal.fire({
        title: "경고",
        text: "화면명에 중복되는 언어가 존재합니다. 확인해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }

    try {
      store.state.loading = true;
      const concats = updatedrowdata3.value;
      const concats2 = updatedrowdata3.value.filter((_, index) =>
        allstaterows3.value.includes(index)
      );
      //console.log(concats);
      const lngStoreGroup = concats
        .map((item) => item.lngStoreGroup)
        .join("\u200b");
      const lngStoreCode = concats
        .map((item) => item.lngStoreCode)
        .join("\u200b");
      const lngType = concats.map((item) => item.lngType).join("\u200b");
      const lngManageCode = concats
        .map((item) => item.lngManageCode)
        .join("\u200b");
      const lngLanguageID = concats
        .map((item) => item.lngLanguageID)
        .join("\u200b");
      const strManageName = concats
        .map((item) => item.strManageName)
        .join("\u200b");

      const dlngStoreGroup = concats2
        .map((item) => item.lngStoreGroup)
        .join("\u200b");
      const dlngStoreCode = concats2
        .map((item) => item.lngStoreCode)
        .join("\u200b");
      const dlngType = concats2.map((item) => item.lngType).join("\u200b");
      const dlngManageCode = concats2
        .map((item) => item.lngManageCode)
        .join("\u200b");
      const dlngLanguageID = concats2
        .map((item) => item.lngLanguageID)
        .join("\u200b");

      const res = await saveMultiLang(
        lngStoreGroup,
        lngStoreCode,
        lngType,
        lngManageCode,
        lngLanguageID,
        strManageName,
        dlngStoreGroup,
        dlngStoreCode,
        dlngType,
        dlngManageCode,
        dlngLanguageID
      );
      console.log(res);

      if (res.data.RESULT_CD == "00") {
        await Swal.fire({
          title: "성공",
          text: "저장되었습니다.",
          icon: "success",
          confirmButtonText: "확인",
        });
      } else {
        await Swal.fire({
          title: "실패",
          text: "저장에 실패하였습니다.",
          icon: "error",
          confirmButtonText: "확인",
        });
      }
      store.state.loading = false;
      afterSearch2.value = true;
    } catch (error) {
      afterSearch2.value = false;
      store.state.loading = false;
    } finally {
      const res = await getMultiLingual3(
        store.state.userData.lngStoreGroup,
        selectedStore.value,
        tempScreenNo.value
      );
      console.log(res);
      rowData5.value = res.data.List;
      store.state.loading = false;
    }
  }
};
const afterSearch2 = ref(false);
const selectedGroup = ref(store.state.userData.lngStoreGroup);
const selectedStore = ref(0);

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
  if (rowData5.value.length > 0) {
    rowData5.value = [];
  }
  if (rowData4.value.length > 0) {
    rowData4.value = [];
  }
};

const lngStoreCode = async (e) => {
  const res = await getMenuList5(store.state.userData.lngStoreGroup, e);
  rowData.value = res.data.List;
  //console.log(res);
  const res2 = await getMenuList(store.state.userData.lngStoreGroup, e);
  //rowData2.value = res2.data.menuList
  SubMenuGroup.value = res2.data.submenuGroup;
  MenuGroup.value = res2.data.menuGroup;
  selectedStore.value = e;
};

const lngareacd = ref("");
const lngAreaCode = async (e) => {
  lngareacd.value = e;

  //console.log(e);
};

const posno = ref(0);
const posNo = (e) => {
  posno.value = e;
  console.log(e);
};
const tempMenuCode = ref("");
const afterClicked = ref(false);
const clickedRowData = async (e) => {
  //console.log(e);

  tempMenuCode.value = e[0];
  try {
    store.state.loading = true;
    const res = await getMultiLingual2(
      store.state.userData.lngStoreGroup,
      selectedStore.value,
      e[0]
    );

    rowData2.value = res.data.List;
    rowData3.value = res.data.List2;
    afterClicked.value = true;
    store.state.loading = false;
  } catch (error) {
    store.state.loading = false;
  } finally {
    store.state.loading = false;
  }
};

const addRow = ref(false);
const addrowDefault = ref("");
const addButton = () => {
  if (afterClicked.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회후 메뉴코드를 먼저 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
  }
  addrowDefault.value =
    store.state.userData.lngStoreGroup +
    "," +
    selectedStore.value +
    ",1," +
    tempMenuCode.value +
    ", ";
  addRow.value = !addRow.value;
};
const addRow2 = ref(false);
const addrowDefault2 = ref("");
const addButton2 = () => {
  if (afterClicked.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회후 메뉴코드를 먼저 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
  }
  addrowDefault2.value =
    store.state.userData.lngStoreGroup +
    "," +
    selectedStore.value +
    ",6," +
    tempMenuCode.value +
    ", ";
  addRow2.value = !addRow2.value;
};

const addRow3 = ref(false);
const addrowDefault3 = ref("");
const afterClicked2 = ref(false);
const addButton3 = () => {
  if (afterClicked2.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회후 화면을 먼저 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
  }
  addrowDefault3.value =
    store.state.userData.lngStoreGroup +
    "," +
    selectedStore.value +
    ",3," +
    tempScreenNo.value +
    ", ";

  console.log(addrowDefault3.value);
  addRow3.value = !addRow3.value;
};

const updatedrowdata = ref([]);
const updatedRowData = (e) => {
  //console.log(e);
  updatedrowdata.value = e;
};
const updatedrowdata2 = ref([]);
const updatedRowData2 = (e) => {
  //
  updatedrowdata2.value = e;
};
const updatedrowdata3 = ref([]);
const updatedRowData3 = (e) => {
  //
  updatedrowdata3.value = e;
};

const deleterow = ref(false);
const deleteButton = () => {
  deleterow.value = !deleterow.value;
};
const deleterow2 = ref(false);
const deleteButton2 = () => {
  deleterow2.value = !deleterow2.value;
};
const deleterow3 = ref(false);
const deleteButton3 = () => {
  deleterow3.value = !deleterow3.value;
};

const allstaterows = ref([]);
const allStateRows = (e) => {
  allstaterows.value = e.deleted;
  //console.log(allstaterows.value);
};
const allstaterows2 = ref([]);
const allStateRows2 = (e) => {
  allstaterows2.value = e.deleted;
};
const allstaterows3 = ref([]);
const allStateRows3 = (e) => {
  allstaterows3.value = e.deleted;
};

const searchWord = ref("");
const setSearchWord = (e) => {
  searchWord.value = e.target.value;
  //console.log(searchWord.value);
};

const MenuGroup = ref("");
const SubMenuGroup = ref("");
const filteredSubMenuGroup = ref([]);
const forsearchMain = ref(-1);
const forsearchSub = ref(-1);
const searchValue = ref([-1, -1]);
const setSubCd = (e) => {
  const name = e.target.name;
  const value = e.target.value;
  if (name == "lngMainGroup") {
    //comsole.log(SubMenuGroup.value);
    filteredSubMenuGroup.value = SubMenuGroup.value.filter(
      (item) => item.sublngMajor == forsearchMain.value
    );
    forsearchSub.value = "-1";
    forsearchMain.value = value;
    searchValue.value = [value, forsearchSub.value];
  } else {
    forsearchSub.value = value;
    searchValue.value = [forsearchMain.value, value];
  }
};

const rowData4 = ref([]);
const rowData5 = ref([]);

const searchword2 = ref("");
const setsearchWord2 = (e) => {
  searchword2.value = e.target.value;
};

const tempPosNo = ref("");
const tempScreenNo = ref("");
const clickedRowData2 = async (e) => {
  //console.log(e);
  tempPosNo.value = e[0];
  tempScreenNo.value = e[2];
  //tempMenuCode.value = e[0];
  try {
    store.state.loading = true;
    const res = await getMultiLingual3(
      store.state.userData.lngStoreGroup,
      selectedStore.value,
      e[2]
    );
    console.log(res);
    rowData5.value = res.data.List;
    // rowData2.value = res.data.List;
    // rowData3.value = res.data.List2;
    afterClicked2.value = true;
    store.state.loading = false;
  } catch (error) {
    store.state.loading = false;
  } finally {
    store.state.loading = false;
  }
};

const showPosNo = ref(false);
watch(selected, () => {
  if (selected.value == 1) {
    showPosNo.value = false;
  } else {
    showPosNo.value = true;
  }
});
</script>

<style></style>
