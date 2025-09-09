<!-- /*--############################################################################
# Filename : MST37_001INS.vue                                                
  # Description : 마스터관리 > 메뉴 마스터 > 서브 타이틀 등록.           
  # Date :2025-07-15                                                           
  # Author : 권맑음                     
################################################################################*/ -->
<template>
  <!-- 조회 조건  -->
  <div class="flex justify-between items-center w-full overflow-y-hidden">
    <PageName></PageName>
    <div class="flex justify-center mr-10 space-x-2 pr-5">
      <button @click="searchButton" class="button search md:w-auto w-14">
        조회
      </button>

      <button @click="saveButton" class="button save w-auto">저장</button>
    </div>
  </div>
  <br />
  <div
    class="flex justify-start space-x-5 bg-gray-200 rounded-lg md:h-16 h-24 items-center">
    <PickStore
      @update:storeGroup="handleGroupCd"
      @update:storeCd="handleStoreCd"
      @storeNm="handlestoreNm"
      @GroupNm="handleGroupNm"
      @update:ischanged="handleinitAll">
    </PickStore>
  </div>
  <!-- 조회 조건  -->
  <!--그리드 영역 및 연동 데이터 영역 -->
  <div
    v-if="addMenu"
    class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-white p-6 rounded shadow-lg w-[60%] h-[60%]">
      <h1 class="text-2xl font-bold flex justify-start">메뉴 조회 팝업</h1>
      <div class="flex flex-col justify-start h-12">
        <div class="flex flex-col justify-start space-x-4 text-sm">
          <div
            class="flex items-center justify-start font-bold text-sm pl-1 mt-3 gap-5">
            <div>
              법인 :
              <select
                disabled
                class="border border-gray-800 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>[{{ groupCd }}]{{ selectedGroupNm }}</option>
              </select>
            </div>
            <div>
              매장명 :
              <select
                disabled
                class="border border-gray-800 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>[{{ nowStoreCd }}]{{ clickedStoreNm }}</option>
              </select>
            </div>
            <div>
              메뉴구분 :
              <select
                class="border border-gray-800 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                v-model="menuSort">
                <option value="0">전체</option>
                <option value="일반">일반메뉴</option>
                <option value="세트">세트메뉴</option>
              </select>
            </div>
            <div>
              배달구분 :
              <select
                class="border border-gray-800 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                v-model="deliverySort">
                <option value="0">전체</option>
                <option value="일반">일반</option>
                <option value="배달">배달</option>
              </select>
            </div>
          </div>
          <div
            class="flex items-center justify-start font-bold text-sm mt-3 gap-5">
            <div
              class="flex gap-5 items-center justify-start font-bold text-sm -ml-3">
              메뉴분류 :
              <select
                name=""
                id=""
                class="border border-gray-800 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                v-model="mainCategory">
                <option value="0">전체</option>
                <option :value="i.lngCode" v-for="i in MenuGroup">
                  {{ i.strName }}
                </option>
              </select>
              <select
                name=""
                id=""
                class="border border-gray-800 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                v-model="subCategory">
                <option value="0">전체</option>
                <option :value="i.lngCode" v-for="i in filteredSubMenuGroup">
                  {{ i.strName }}
                </option>
              </select>
              메뉴명 :
              <input
                type="text"
                v-model="searchword3"
                @input="searchWord3"
                class="border border-gray-800 rounded-lg shadow-lg pl-1 h-8" />
            </div>
          </div>
        </div>
      </div>
      <div class="w-[100%] h-[60%] mt-16">
        <Realgrid
          class="w-full h-full mt-2"
          :progname="'MST01_011INS_01_VUE'"
          :progid="5"
          :rowData="rowData5"
          @clickedRowData="clickedRowData3"
          :searchWord="searchword3"
          :searchColId="'lngCode,strName'"
          :searchColId2="'blnSetMenu,blnDeliveryYN,mainLngCode,subLngCode'"
          :searchColValue2="searchColValue2"
          @dblclickedRowData="dblclickedRowData"
          :selectionStyle="'singleRow'"></Realgrid>
      </div>
      <div class="flex justify-center space-x-3 w-full h-16 mt-5">
        <button
          @click="clickaddMenu1(selectedaddMenu)"
          class="mt-4 p-2 bg-blue-500 text-white rounded">
          추가
        </button>
        <button
          @click="closeMenus"
          class="mt-4 p-2 bg-blue-500 text-white rounded">
          닫기
        </button>
      </div>
    </div>
  </div>

  <!-- <div
    v-if="selectMenuGroup"
    class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-white p-6 rounded shadow-lg w-[60%] h-[60%]">
      <h1 class="text-2xl font-bold flex justify-start">메뉴 조회 팝업</h1>
      <div class="flex flex-col justify-start h-12">
        <div class="flex flex-col justify-start space-x-4 text-sm">
          <div
            class="flex items-center justify-start font-bold text-sm pl-1 mt-3 gap-5">
            <div>
              법인 :
              <select
                disabled
                class="border border-gray-800 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>[{{ groupCd }}]{{ selectedGroupNm }}</option>
              </select>
            </div>
            <div>
              매장명 :
              <select
                disabled
                class="border border-gray-800 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>[{{ nowStoreCd }}]{{ clickedStoreNm }}</option>
              </select>
            </div>
            <div>
              그룹코드/그룹명:
              <input
                type="text"
                @input="searchWord4"
                class="border border-gray-800 rounded-lg shadow-lg pl-1 h-8" />
            </div>
          </div>
        </div>
      </div>
      <div class="w-[100%] h-[60%] mt-16">
        <Realgrid
          class="w-full h-full mt-2"
          :progname="'MST01_011INS_01_VUE'"
          :progid="1"
          :rowData="rowData6"
          @clickedRowData="clickedRowData4"
          :searchWord3="searchword4"
          :searchColId="'lngCode,strName'"
          :searchColValues="searchColValues"
          @dblclickedRowData="dblclickedRowData2"
          :selectionStyle="'singleRow'"
          :rowStateeditable="false"></Realgrid>
      </div>
      <div class="flex justify-center space-x-3 w-full h-16 mt-5">
        <button
          @click="clickaddMenu2(selectedaddMenu2)"
          class="mt-4 p-2 bg-blue-500 text-white rounded">
          추가
        </button>
        <button
          @click="closeMenus2"
          class="mt-4 p-2 bg-blue-500 text-white rounded">
          닫기
        </button>
      </div>
    </div>
  </div> -->

  <span
    class="h-5 mt-3 flex justify-between items-center w-[900px] ml-[70%] z-40">
    <h1 class="font-bold text-xl z-40">상세 정보</h1>
  </span>
  <div class="flex h-4/5 w-full -mt-5">
    <div class="flex flex-col w-full h-full">
      <div
        class="flex justify-between mt-0 ml-10 w-[65%] border-b border-b-gray-300">
        <div class="text-xl font-semibold">서브 타이틀 목록</div>
        <div class="mt-3 gap-1 flex">
          <!-- <button class="whitebutton" @click="searchMenuList3">조회</button> -->
          <button
            class="whitebutton"
            v-if="currentMenu == false"
            @click="addRowData1">
            추가
          </button>
          <button
            class="whitebutton"
            v-if="currentMenu == false"
            @click="deleteRowData1">
            삭제
          </button>
        </div>
      </div>
      <div class="flex h-full w-full gap-10">
        <div class="h-4/6 w-2/3" v-show="currentMenu == false">
          <div
            class="mt-3 ml-10 grid grid-cols-[1fr,3fr] grid-rows-1 gap-0 w-full">
            <div class="customtableIndex border border-gray-400 rounded-l-lg">
              서브타이틀코드/서브타이틀명
            </div>
            <div class="px-1 py-1 border border-gray-300 rounded-r-lg">
              <input
                type="text"
                class="border w-full h-full px-1 border-gray-400 rounded-lg"
                @input="searchOption"
                v-model="searchword1" />
            </div>
          </div>
          <div class="ml-10 mt-5 w-full h-[125%]">
            <!-- 옵션관리 그리드-->
            <Realgrid
              class="w-full h-full mt-2"
              :progname="'MST37_001INS_VUE'"
              :progid="1"
              :rowData="rowData1"
              @clickedRowData="clickedRowData"
              @updatedRowData="updatedRowData3"
              :changeRow="changeRow"
              :changeNow="changeNow"
              :changeColid="changeColid"
              :changeValue2="changeValue"
              :searchWord3="searchword1"
              :searchColId="'lngCode,strName'"
              :deleteRow6="deleterow1"
              :addRow5="addrow1"
              @allStateRows="allStateRows"
              @selectedIndex2="selectedIndex"
              @realgridname="realgridname"
              :addrowProp="addrowProp"
              :addrowDefault="addrowDefault"
              @sendRowState="sendRowState"
              :selectionStyle="'singleRow'"
              :rowStateeditable="false"
              :initSelect="initSelect"
              :addField="'new'">
            </Realgrid>
          </div>
        </div>

        <div
          class="h-full w-1/3 flex flex-col pl-10"
          v-show="currentMenu == false">
          <div
            class="grid grid-cols-[1fr,3fr] grid-rows-2 items-center w-full h-20 rounded-lg">
            <div
              class="border border-black p-2 w-full h-full rounded-tl-lg flex items-center justify-center text-blue-500 font-semibold bg-gray-100">
              *서브타이틀코드
            </div>
            <div
              class="border border-black p-2 w-full h-full rounded-tr-lg flex items-center justify-center">
              <input
                type="number"
                name="lngCode"
                class="border border-gray-300 rounded-lg w-full h-full p-2"
                v-model="optionCd"
                :disabled="isNewColumn"
                @input="changeOptionManage1" />
            </div>
            <div
              class="border border-black p-2 w-full h-full flex items-center justify-center text-blue-500 font-semibold bg-gray-100 rounded-bl-lg">
              *서브타이틀명
            </div>
            <div
              class="border border-black p-2 w-full h-full flex items-center justify-center rounded-br-lg">
              <input
                type="text"
                class="border border-gray-300 rounded-lg w-full h-full p-2"
                v-model="optionNm"
                name="strName"
                @input="changeOptionManage1"
                :disabled="!clickrowData1" />
            </div>
          </div>
          <div class="mt-5 w-full h-[73%]">
            <div class="flex justify-between">
              <span class="font-bold text-xl flex justify-start"
                >대상선택메뉴</span
              >
              <div class="flex gap-1">
                <button class="whitebutton" @click="addMenus">추가</button
                ><button class="whitebutton" @click="deleteRowData2">
                  삭제</button
                ><button class="whitebutton" @click="deleteAll">초기화</button>
              </div>
            </div>
            <Realgrid
              :progname="'MST01_011INS_01_VUE'"
              :progid="4"
              :rowData="filteredrowData2"
              class="mt-5"
              :dragOn="true"
              @updatedRowData="updatedRowData"
              @selectedIndex2="selectedIndex4"
              :notsoftDelete="true"
              @realgridname="realgridname3"
              :rowStateeditable="false"
              :deleteRow="deleterow3"
              :deleteAll="deleteAll1"
              :initSelect="initSelect"></Realgrid>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--그리드 영역 및 연동 데이터 영역 -->
</template>

<script setup>
import {
  deleteSubTitles,
  getMostColumnMenuList,
  getSubTitleList,
  saveOptions,
  saveOptions2,
  saveSubTitle,
} from "@/api/master";
/*
 * 공통 표준  Function
 */

import { nextTick, onMounted, ref, watch } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";

/**
 * 매장 공통 컴포넌트
 */

import PickStore from "@/components/pickStore.vue";
/**
 * 	그리드 생성
 */

import Realgrid from "@/components/realgrid.vue";
/**
 *  경고창 호출 라이브러리
 *  */

import Swal from "sweetalert2";
/**
 * 	그리드 생성
 */

/**
 *  리얼그리드 라이브러리 호출
 *  */

/**
 *  페이지로그 자동 입력
 *  */

import { insertPageLog } from "@/customFunc/customFunc";
/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";

/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
});

// 더미 데이터
const labelData = ref([["필수", "선택"]]);
const valueData = ref([["0", "1"]]);
const currentMenu = ref(false);
const items = ref([]);
const selectedOptionCd = ref();
const ScreenKeyOrigin = ref([]);
const rowData1 = ref([]);
/**
 * 입력창 수정 데이터 갱신
 */

const updatedRowData4 = ref([]);
const rowData2 = ref([]);
const rowData3 = ref([]);
const filteredrowData2 = ref([]);
const rowData4 = ref([]);
const rowData5 = ref([]);
const rowData6 = ref([]);
const filteredrowData4 = ref([]);
const ScreenKeys = ref();
const initFocus = ref(false);
const searchColValue2 = ref("0,0,0,0");
const forsearchMain = ref("0");
const forsearchSub = ref("0");
/**
 *  그리드 검색어 세팅
 */

const searchword2 = ref();
/**
 *  그리드 검색어 세팅
 */

const searchword4 = ref();
const optionGroupCd = ref("");
const optionGroupNm = ref("");
const selectedOption = ref();
// 드래그 가능한 요소를 설정하는 메서드

const selectedGroupNm = ref();
const selectedStoreNm = ref();
const menuSort = ref(0);
const deliverySort = ref(0);
const subCategory = ref(0);
const mainCategory = ref(0);

const addMenu = ref(false);
const clickedStoreNm = ref();
/**
 * 페이지 매장명 세팅
 */

const handlestoreNm = (newData) => {
  clickedStoreNm.value = newData;
};

const confirmitem = ref([]);
const confirmitem2 = ref([]);
// const realgridName = ref();
// const realgridname = (e) => {
//   realgridName.value = e;
// };
// const realgridName2 = ref();
// const realgridname2 = (e) => {
//   realgridName2.value = e;
// };
// const realgridName3 = ref();
// const realgridname3 = (e) => {
//   realgridName3.value = e;
// };
// const realgridName4 = ref();
// const realgridname4 = (e) => {
//   realgridName4.value = e;
// };

// watch(currentMenu, () => {
//   const reagrid2 = document.getElementById(realgridName.value);
//   setTimeout(() => {
//     RealGrid.getGridInstance(reagrid2).resetSize();
//     RealGrid.getGridInstance(reagrid2).refresh(true);
//   }, 100);
//   const reagrid3 = document.getElementById(realgridName2.value);
//   setTimeout(() => {
//     RealGrid.getGridInstance(reagrid3).resetSize();
//     RealGrid.getGridInstance(reagrid3).refresh(true);
//   }, 100);
//   const reagrid4 = document.getElementById(realgridName3.value);
//   setTimeout(() => {
//     RealGrid.getGridInstance(reagrid4).resetSize();
//     RealGrid.getGridInstance(reagrid4).refresh(true);
//   }, 100);
//   const reagrid5 = document.getElementById(realgridName4.value);
//   setTimeout(() => {
//     RealGrid.getGridInstance(reagrid5).resetSize();
//     RealGrid.getGridInstance(reagrid5).refresh(true);
//   }, 100);
// });

/**
 * 선택한 포스 번호 호출 함수
 */

const posNo = ref();

const AllscreenKeyPage = ref(1);

watch(selectedOption, () => {
  //comsole.log(selectedOption.value);
});

const selectMenuGroup = ref(false);
let dupliitems = [];

const nowStoreAreaCd = ref();
/**
 *  pickStore - 지역코드 세팅
 */

const handleStoreAreaCd = (newValue) => {
  nowStoreAreaCd.value = newValue;
  //comsole.log(nowStoreAreaCd.value);
};

const nowStoreCd = ref();
const afterCategory = ref(false);
/**
 * 페이지 매장 코드 세팅
 */

const handleStoreCd = async (newValue) => {
  if (newValue == "0") {
    afterSearch.value = false;
  }
  ////console.log(newValue);
  nowStoreCd.value = newValue;
  addrowDefault.value = `${groupCd.value},${nowStoreCd.value},,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,`;
};
const selectedButton = ref();
const Category = ref([]);
const searchWord4 = (e) => {
  searchword4.value = e.target.value;
};
const MenuGroup = ref([]);
const SubMenuGroup = ref([]);

const store = useStore();
/**
 *  그리드 검색어 세팅
 */

const searchword1 = ref();
/**
 *  그리드 검색어 세팅
 */

const searchword3 = ref();
const userData = store.state.userData;
const groupCd = ref(userData.lngStoreGroup);
const modified = ref(false);
const afterSearch = ref(false);
const MenuList = ref([]);
const MenuKeyList = ref([]);
const clickedScreenOrMenu = ref(false);
const TLUList = ref([]);
const optionCd = ref();
const optionNm = ref();
const optionNo = ref();
const addrowProp = ref(
  "lngStoreGroup,lngStoreCode,lngCode,strName,lngMenu1,strMenuName1,lngPrice1,lngMenu2,strMenuName2,lngPrice2,lngMenu3,strMenuName3,lngPrice3,lngMenu4,strMenuName4,lngPrice4,lngMenu5,strMenuName5,lngPrice5,lngMenu6,strMenuName6,lngPrice6,lngMenu7,strMenuName7,lngPrice7,lngMenu8,strMenuName8,lngPrice8"
);

const addrowDefault = ref(
  `${groupCd.value},${nowStoreCd.value},null,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,`
);

const initSelect = ref(false);
const isNewColumn = ref(true);
const isNewColumn2 = ref(false);
const clickrowData1 = ref(false);
/**
 * 데이터셋 상세정보 셋팅
 */

const clickedRowData = (newValue) => {
  clickrowData1.value = true;
  ////console.log(newValue);
  if (newValue == undefined) {
    return;
  }
  selectedOptionCd.value = newValue[3] == "" ? "" : Number(newValue[3]);

  filteredrowData2.value = [];
  for (var i = 0; i < 8; i++) {
    if (newValue[5 + 3 * i] != "0" && newValue[5 + 3 * i] != "") {
      filteredrowData2.value.push({
        lngCode: newValue[5 + 3 * i],
        strName: newValue[6 + 3 * i],
        lngPrice: newValue[7 + 3 * i],
      });

      //comsole.log(filteredrowData2.value);
    }
  }

  optionCd.value = newValue[3] == "" ? "" : Number(newValue[3]);
  optionNm.value = newValue[4];
};
const selectedOptionGroupCd = ref();
const clickrowData2 = ref(false);
/**
 * 데이터셋 상세정보 셋팅
 */

const selectedaddMenu = ref();
const selectedaddMenu2 = ref();
/**
 * 데이터셋 상세정보 셋팅
 */

const clickedRowData3 = (newValue) => {
  selectedaddMenu.value = newValue;
};
/**
 * 데이터셋 상세정보 셋팅
 */

const clickedRowData4 = (newValue) => {
  selectedaddMenu2.value = newValue;
};
/**
 * 데이터셋 상세정보 셋팅
 */

const searchWord3 = (e) => {
  searchword3.value = e.target.value;
};

watch(rowData3, () => {
  //comsole.log(rowData3.value);
});
/**
 *  조회 함수
 */

const searchButton = async () => {
  filteredrowData2.value = [];
  rowData1.value = [];
  rowData2.value = [];
  rowData3.value = [];
  rowData4.value = [];

  if (nowStoreCd.value == "0" || nowStoreCd.value == undefined) {
    Swal.fire({
      title: "경고",
      text: "매장을 선택하세요.",
      icon: "warning",
      showCancelButton: false,
      confirmButtonColor: "#3085d6",
      allowOutsideClick: false,
    });
    return;
  }

  store.state.loading = true;
  try {
    optionNo.value = "";
    selectedOption.value = "";
    optionNm.value = "";
    optionCd.value = "";
    optionGroupNm.value = "";
    optionGroupCd.value = "";

    filteredrowData2.value = [];
    filteredrowData4.value = [];

    //const res3 = await getAllOptionManageData(groupCd.value, nowStoreCd.value);
    const res3 = await getSubTitleList(groupCd.value, nowStoreCd.value);
    const res4 = await getMostColumnMenuList(groupCd.value, nowStoreCd.value);
    ////console.log(res3);
    ////console.log(res4);
    rowData1.value = res3.data.List;
    // rowData2.value = res3.data.MENULIST;
    // rowData3.value = res3.data.OPTIONGROUPMANAGE;
    // rowData4.value = res3.data.OPTIONGROUPCOMPOSITION;
    rowData5.value = res4.data.MENULIST;
    // rowData6.value = res3.data.OPTIONMANAGE;
    MenuGroup.value = res4.data.MAINGROUP;
    SubMenuGroup.value = res4.data.SUBGROUP;
    afterSearch.value = true;
    confirmitem.value = JSON.parse(JSON.stringify(rowData1.value));
    updatedRowData4.value = JSON.parse(JSON.stringify(rowData1.value));
    confirmitem2.value = JSON.parse(JSON.stringify(rowData3.value));
    updatedRowData5.value = JSON.parse(JSON.stringify(rowData3.value));
  } catch (error) {
    afterSearch.value = false;
  } finally {
    initFocus.value = !initFocus.value;
    store.state.loading = false; // 로딩 상태 종료
    modified.value = false;
    initSelect.value = !initSelect.value;
    afterCategory.value = false;
    clickrowData1.value = false;
  }
};
const filteredSubMenuGroup = ref([]);

watch(mainCategory, () => {
  filteredSubMenuGroup.value = SubMenuGroup.value.filter(
    (item) => item.lngMajor == mainCategory.value
  );
  subCategory.value = 0;
});

/**
 *  저장 버튼 함수
 */

const saveButton = async () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 진행해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  const sums =
    allStateRowArr.value.updated.length +
    allStateRowArr.value.created.length +
    allStateRowArr.value.deleted.length;
  if (sums == 0) {
    Swal.fire({
      title: "경고",
      text: "변경된 사항이 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  const undefinededrowlength = updatedRowData4.value
    .filter((item) => item.deleted != true)
    .filter(
      (item) =>
        item.lngCode == "" ||
        item.lngCode == undefined ||
        item.strName == undefined ||
        item.strName == ""
    ).length;

  if (undefinededrowlength > 0) {
    Swal.fire({
      title: "경고",
      text: "상세 정보에 빈 값이 존재합니다",
      icon: "warning",
      confirmButtonText: "확인",
    });
    currentMenu.value = false;
    return;
  }

  Swal.fire({
    title: "저장",
    text: "저장 하시겠습니까?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "저장",
    cancelButtonText: "취소",
  }).then(async (result) => {
    if (result.isConfirmed) {
      store.state.loading = true;
      try {
        //comsole.log(updatedRowData4.value);
        //comsole.log(rowData3.value);

        if (allStateRowArr.value.deleted.length > 0) {
          const lngCodes = updatedRowData4.value
            .filter((item, index) =>
              allStateRowArr.value.deleted.includes(index)
            )
            .map((item) => item.lngCode)
            .join("\u200b");
          const groupCds = updatedRowData4.value
            .filter((item, index) =>
              allStateRowArr.value.deleted.includes(index)
            )
            .map((item) => item.lngStoreGroup)
            .join("\u200b");
          const storeCds = updatedRowData4.value
            .filter((item, index) =>
              allStateRowArr.value.deleted.includes(index)
            )
            .map((item) => item.lngStoreCode)
            .join("\u200b");

          const res = await deleteSubTitles(groupCds, storeCds, lngCodes);

          ////console.log(res);
        }

        if (currentMenu.value == false) {
          const lngCodes = updatedRowData4.value
            .filter(
              (item, index) =>
                allStateRowArr.value.created.includes(index) ||
                allStateRowArr.value.updated.includes(index)
            )
            .map((item) => item.lngCode)
            .join("\u200b");
          const groupCds = updatedRowData4.value
            .filter(
              (item, index) =>
                allStateRowArr.value.created.includes(index) ||
                allStateRowArr.value.updated.includes(index)
            )
            .map((item) => item.lngStoreGroup)
            .join("\u200b");
          const storeCds = updatedRowData4.value
            .filter(
              (item, index) =>
                allStateRowArr.value.created.includes(index) ||
                allStateRowArr.value.updated.includes(index)
            )
            .map((item) => item.lngStoreCode)
            .join("\u200b");
          const strNames = updatedRowData4.value
            .filter(
              (item, index) =>
                allStateRowArr.value.created.includes(index) ||
                allStateRowArr.value.updated.includes(index)
            )
            .map((item) => item.strName)
            .join("\u200b");
          const lngMenu1s = updatedRowData4.value
            .filter(
              (item, index) =>
                allStateRowArr.value.created.includes(index) ||
                allStateRowArr.value.updated.includes(index)
            )
            .map((item) =>
              item.lngMenu1 == null || item.lngMenu1 == undefined
                ? 0
                : item.lngMenu1
            )
            .join("\u200b");

          const lngMenu2s = updatedRowData4.value
            .filter(
              (item, index) =>
                allStateRowArr.value.created.includes(index) ||
                allStateRowArr.value.updated.includes(index)
            )
            .map((item) =>
              item.lngMenu2 == null || item.lngMenu2 == undefined
                ? 0
                : item.lngMenu2
            )
            .join("\u200b");

          const lngMenu3s = updatedRowData4.value
            .filter(
              (item, index) =>
                allStateRowArr.value.created.includes(index) ||
                allStateRowArr.value.updated.includes(index)
            )
            .map((item) =>
              item.lngMenu3 == null || item.lngMenu3 == undefined
                ? 0
                : item.lngMenu3
            )
            .join("\u200b");

          const lngMenu4s = updatedRowData4.value
            .filter(
              (item, index) =>
                allStateRowArr.value.created.includes(index) ||
                allStateRowArr.value.updated.includes(index)
            )
            .map((item) =>
              item.lngMenu4 == null || item.lngMenu4 == undefined
                ? 0
                : item.lngMenu4
            )
            .join("\u200b");

          const lngMenu5s = updatedRowData4.value
            .filter(
              (item, index) =>
                allStateRowArr.value.created.includes(index) ||
                allStateRowArr.value.updated.includes(index)
            )
            .map((item) =>
              item.lngMenu5 == null || item.lngMenu5 == undefined
                ? 0
                : item.lngMenu5
            )
            .join("\u200b");

          const lngMenu6s = updatedRowData4.value
            .filter(
              (item, index) =>
                allStateRowArr.value.created.includes(index) ||
                allStateRowArr.value.updated.includes(index)
            )
            .map((item) =>
              item.lngMenu6 == null || item.lngMenu6 == undefined
                ? 0
                : item.lngMenu6
            )
            .join("\u200b");

          const lngMenu7s = updatedRowData4.value
            .filter(
              (item, index) =>
                allStateRowArr.value.created.includes(index) ||
                allStateRowArr.value.updated.includes(index)
            )
            .map((item) =>
              item.lngMenu7 == null || item.lngMenu7 == undefined
                ? 0
                : item.lngMenu7
            )
            .join("\u200b");

          const lngMenu8s = updatedRowData4.value
            .filter(
              (item, index) =>
                allStateRowArr.value.created.includes(index) ||
                allStateRowArr.value.updated.includes(index)
            )
            .map((item) =>
              item.lngMenu8 == null || item.lngMenu8 == undefined
                ? 0
                : item.lngMenu8
            )
            .join("\u200b");

          const res = await saveSubTitle(
            groupCds,
            storeCds,
            lngCodes,
            strNames,
            lngMenu1s,
            lngMenu2s,
            lngMenu3s,
            lngMenu4s,
            lngMenu5s,
            lngMenu6s,
            lngMenu7s,
            lngMenu8s
          );

          ////console.log(res);
        }
      } catch (error) {
      } finally {
        store.state.loading = false;
        Swal.fire({
          title: "저장 되었습니다.",
          confirmButtonText: "확인",
        });

        searchButton();
      }
    }
  });

  // 빈공간 데이터를 넣으려고하는데 안 들어가고 조회가 안됨 // 빈 칸에 대한 것도 데이터를 불러와야 메뉴키위치를 정할 수 있음.
};

/**
 * 입력창 수정 데이터 갱신
 */

const updatedRowData3 = (e) => {
  ////console.log(e);
  updatedRowData4.value = e;
};

/**
 * 입력창 수정 데이터 갱신
 */

const updatedRowData5 = ref([]);

/**
 * 입력창 수정 데이터 갱신
 */

/**
 * 입력창 수정 데이터 갱신
 */

const updatedFilteredRow = ref([]);
const updatedRowData = async (newValue) => {
  //comsole.log(optionCd.value);
  updatedFilteredRow.value = newValue;
  // const change = updatedRowData4.value.find(
  //   (item) => item.lngCode == Number(optionCd.value)
  // );

  // ////console.log(change);

  if (updatedFilteredRow.value.length > 0) {
    for (let i = 0; i < updatedFilteredRow.value.length; i++) {
      changeColid.value = `lngMenu${i + 1}`;
      changeValue.value = updatedFilteredRow.value[i].lngCode;
      changeNow.value = !changeNow.value;

      await nextTick();
      changeColid.value = `strMenuName${i + 1}`;
      changeValue.value = updatedFilteredRow.value[i].strName;
      changeNow.value = !changeNow.value;

      await nextTick();

      changeColid.value = `lngPrice${i + 1}`;
      changeValue.value = updatedFilteredRow.value[i].lngPrice;
      changeNow.value = !changeNow.value;

      await nextTick();
    }
  }
  // rowData1.value = [...rowData1.value];
  //comsole.log(newValue);
};

/**
 * 입력창 수정 데이터 갱신
 */

const changeColid = ref("");
const changeValue = ref("");
const changeValue2 = ref("");
const changeRow = ref(0);
const changeNow = ref(false);
const changeNow2 = ref(false);
const changeOptionManage1 = (e) => {
  changeColid.value = e.target.name;
  changeValue.value = e.target.value;

  changeNow.value = !changeNow.value;
};

// const changeOptionManage3 = (e) => {
//   const confirmdata = e.target.value.replace(/[^0-9]/g, "");
//   const change = rowData1.value.find(
//     (item, index) => index == selectedindex.value
//   );

//   if (change) {
//     change.intMultiple = confirmdata;
//   }
//   rowData1.value = [...rowData1.value];
// };
// const changeOptionManage4 = (e) => {
//   //comsole.log(rowData1.value);
//   const confirmdata = e.target.value.replace(/[^0-9]/g, "");
//   const duplicate = rowData1.value.find((item) => item.lngCode == confirmdata);
//   if (duplicate) {
//     Swal.fire({
//       title: "중복된 옵션코드",
//       text: "이미 존재하는 코드입니다.",
//       icon: "error",
//       confirmButtonText: "확인",
//     });
//     optionCd.value = "";
//     return;
//   }
//   const change = rowData1.value.find(
//     (item, index) => index == selectedindex.value
//   );
//   if (change) {
//     change.lngCode = confirmdata;
//   }
//   rowData1.value = [...rowData1.value];
//   // optionCd.value = e.target.value
//   // //comsole.log(optionCd.value)
// };

const searchOption = (e) => {
  searchword1.value = e.target.value;
};

const deleteAll1 = ref(false);
const deleteAll = async () => {
  changeColid.value = "lngMenu1";
  changeValue.value = 0;
  changeNow.value = !changeNow.value;

  await nextTick();

  changeColid.value = "strMenuName1";
  changeValue.value = "";
  changeNow.value = !changeNow.value;

  await nextTick();

  changeColid.value = "lngPrice1";
  changeValue.value = 0;
  changeNow.value = !changeNow.value;

  await nextTick();

  changeColid.value = "lngMenu2";
  changeValue.value = "0";
  changeNow.value = !changeNow.value;

  await nextTick();

  changeColid.value = "strMenuName2";
  changeValue.value = "";
  changeNow.value = !changeNow.value;

  await nextTick();

  changeColid.value = "lngPrice2";
  changeValue.value = "";
  changeNow.value = !changeNow.value;

  await nextTick();

  changeColid.value = "lngMenu3";
  changeValue.value = 0;
  changeNow.value = !changeNow.value;

  await nextTick();

  changeColid.value = "strMenuName3";
  changeValue.value = "";
  changeNow.value = !changeNow.value;

  await nextTick();

  changeColid.value = "lngPrice3";
  changeValue.value = "";
  changeNow.value = !changeNow.value;

  await nextTick();

  changeColid.value = "lngMenu4";
  changeValue.value = 0;
  changeNow.value = !changeNow.value;

  await nextTick();

  changeColid.value = "strMenuName4";
  changeValue.value = "";
  changeNow.value = !changeNow.value;

  await nextTick();

  changeColid.value = "lngPrice4";
  changeValue.value = "";
  changeNow.value = !changeNow.value;

  await nextTick();

  changeColid.value = "lngMenu5";
  changeValue.value = 0;
  changeNow.value = !changeNow.value;

  await nextTick();

  changeColid.value = "strMenuName5";
  changeValue.value = "";
  changeNow.value = !changeNow.value;

  await nextTick();

  changeColid.value = "lngPrice5";
  changeValue.value = "";
  changeNow.value = !changeNow.value;

  await nextTick();
  changeColid.value = "lngMenu6";
  changeValue.value = 0;
  changeNow.value = !changeNow.value;

  await nextTick();

  changeColid.value = "strMenuName6";
  changeValue.value = "";
  changeNow.value = !changeNow.value;

  await nextTick();

  changeColid.value = "lngPrice6";
  changeValue.value = "";
  changeNow.value = !changeNow.value;

  await nextTick();

  changeColid.value = "lngMenu7";
  changeValue.value = 0;
  changeNow.value = !changeNow.value;

  await nextTick();

  changeColid.value = "strMenuName7";
  changeValue.value = "";
  changeNow.value = !changeNow.value;

  await nextTick();

  changeColid.value = "lngPrice7";
  changeValue.value = "";
  changeNow.value = !changeNow.value;

  await nextTick();

  changeColid.value = "lngMenu8";
  changeValue.value = 0;
  changeNow.value = !changeNow.value;

  await nextTick();

  changeColid.value = "strMenuName8";
  changeValue.value = "";
  changeNow.value = !changeNow.value;

  await nextTick();

  changeColid.value = "lngPrice8";
  changeValue.value = "";
  changeNow.value = !changeNow.value;

  await nextTick();
};

// const updateOptionNm = (e) => {
//   const confirmdata = e.target.value;
//   const change = rowData3.value.find(
//     (item, index) => index == selectedindex2.value
//   );
//   if (change) {
//     change.strName = confirmdata;
//   }
//   rowData3.value = [...rowData3.value];
// };
// const changeOptionGroupCd = (e) => {
//   const Nm = e.target.value;
//   const dupli = rowData3.value.find((item) => item.lngCode == Nm);
//   if (dupli) {
//     Swal.fire({
//       title: "중복된 옵션 그룹코드",
//       text: "이미 존재하는 코드입니다.",
//       icon: "error",
//       confirmButtonText: "확인",
//     });
//     optionGroupCd.value = "";
//     return;
//   }
//   const change = rowData3.value.find(
//     (item, index) => index == selectedindex2.value
//   );
//   if (change) {
//     change.lngCode = Nm;
//   }
//   rowData3.value = [...rowData3.value];
// };
const addrow1 = ref(false);
const addrow2 = ref(false);
const addrow3 = ref(false);

const deleterow1 = ref(false);
const deleterow2 = ref(false);
const deleterow3 = ref(false);
const deleterow4 = ref(false);

/**
 * 추가 버튼 함수
 */

const addRowData1 = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "조회를 먼저 해주세요.",
      confirmButtonText: "확인",
    });
    return;
  }

  // isNewColumn.value = true;
  optionNo.value = "";
  selectedOption.value = "";
  optionNm.value = "";
  optionCd.value = "";
  filteredrowData2.value = [];
  clickrowData1.value = true;
  addrow1.value = !addrow1.value;
};

const sendRowState = (e) => {
  if (e == "created") {
    isNewColumn.value = false;
  } else {
    isNewColumn.value = true;
  }
  // ////console.log(e);
};

const allStateRowArr = ref([]);
const allStateRows = (e) => {
  allStateRowArr.value = e;
};
/**
 * 그리드 행 삭제 버튼 함수
 */

const deleteRowData1 = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "조회를 먼저 해주세요.",
      confirmButtonText: "확인",
    });
    return;
  }
  deleterow1.value = !deleterow1.value;
};
/**
 * 그리드 행 삭제 버튼 함수
 */

/**
 * 그리드 행 삭제 버튼 함수
 */

const deleteRowData2 = async () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "조회를 먼저 해주세요.",
      confirmButtonText: "확인",
    });
    return;
  }

  if (changeRow2.value == null || changeRow2.value == undefined) {
    Swal.fire({
      title: "삭제하실 대상을 선택해주세요.",
      confirmButtonText: "확인",
    });
    return;
  }

  ////console.log(filteredrowData2.value);

  const updateLngCode = filteredrowData2.value
    .filter((item, index) => index != changeRow2.value)
    .map((item) => item.lngCode);

  const updatemenuNm = filteredrowData2.value
    .filter((item, index) => index != changeRow2.value)
    .map((item) => item.strName);

  const updatePrice = filteredrowData2.value
    .filter((item, index) => index != changeRow2.value)
    .map((item) => item.lngPrice);

  for (let i = 0; i < updateLngCode.length; i++) {
    changeColid.value = "lngMenu" + (i + 1);
    changeValue.value = updateLngCode[i];
    changeNow.value = !changeNow.value;
    await nextTick();

    changeColid.value = "strMenuName" + (i + 1);
    changeValue.value = updatemenuNm[i];
    changeNow.value = !changeNow.value;
    await nextTick();

    changeColid.value = "lngPrice" + (i + 1);
    changeValue.value = updatePrice[i];
    changeNow.value = !changeNow.value;
    await nextTick();
  }
  for (let j = 0; j < 8 - updateLngCode.length; j++) {
    changeColid.value = "lngMenu" + (8 - j);
    changeValue.value = 0;
    changeNow.value = !changeNow.value;
    await nextTick();

    changeColid.value = "strMenuName" + (8 - j);
    changeValue.value = "";
    changeNow.value = !changeNow.value;
    await nextTick();

    changeColid.value = "lngPrice" + (8 - j);
    changeValue.value = "";
    changeNow.value = !changeNow.value;
    await nextTick();
  }

  //changeNow
  //deleterow3.value = !deleterow3.value;
};
/**
 * 그리드 행 삭제 버튼 함수
 */

const addMenus = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "조회를 먼저 해주세요.",
      confirmButtonText: "확인",
    });
    return;
  }
  if (optionCd.value == "" || optionCd.value == undefined) {
    Swal.fire({
      title: "서브 타이틀을 먼저 선택하세요.",
      confirmButtonText: "확인",
    });
    return;
  }

  if (filteredrowData2.value.length == 8) {
    Swal.fire({
      title: "대상선택메뉴는 최대 8개까지 설정할 수 있습니다.",
      confirmButtonText: "확인",
    });
    return;
  }

  if (isNewColumn.value == false) {
    Swal.fire({
      title: "먼저 서브타이틀 코드를 생성해주세요.",
      confirmButtonText: "확인",
    });
    return;
  }

  addMenu.value = true;
};
const closeMenus = () => {
  subCategory.value = 0;
  mainCategory.value = 0;
  deliverySort.value = 0;
  menuSort.value = 0;
  searchword3.value = "";
  addMenu.value = false;
};
const closeMenus2 = () => {
  selectMenuGroup.value = false;
};
/**
 * 페이지 매장 그룹 이름 세팅
 */

const handleGroupNm = (newValue) => {
  selectedGroupNm.value = newValue;
  //comsole.log(selectedGroupNm.value);
};
/**
 * 페이지 매장 그룹 세팅
 */

const handleGroupCd = (newValue) => {
  groupCd.value = newValue;
};
watch(
  () => [
    menuSort.value,
    deliverySort.value,
    mainCategory.value,
    subCategory.value,
  ], // 감시 대상
  ([newMenuSort, newDeliverySort, newMainCategory, newSubCategory]) => {
    // 값이 변경될 때 실행될 로직
    searchColValue2.value =
      newMenuSort +
      "," +
      newDeliverySort +
      "," +
      newMainCategory +
      "," +
      newSubCategory;
  }
);

const clickaddMenu1 = (newValue) => {
  if (newValue == undefined || newValue == "") {
    Swal.fire({
      title: "메뉴를 선택하세요.",
      confirmButtonText: "확인",
    });
    return;
  }
  ////console.log(filteredrowData2.value.length);
  if (filteredrowData2.value.length == 8) {
    Swal.fire({
      title: "대상선택메뉴는 최대 8개까지 설정할 수 있습ㄴ디ㅏ.",
      confirmButtonText: "확인",
    });
    return;
  }
  subCategory.value = 0;
  mainCategory.value = 0;
  deliverySort.value = 0;
  menuSort.value = 0;
  searchword3.value = "";
  dblclickedRowData(newValue);
};

/**
 * 행 더블 클릭시 작동 함수
 */

const dblclickedRowData = async (newValue) => {
  ////console.log(newValue);
  const a = updatedRowData4.value.find(
    (item) => item.lngCode == optionCd.value
  );
  ////console.log(a);
  let key2 = "";
  let key3 = "";
  for (let i = 1; i <= 8; i++) {
    const key = `lngMenu${i}`;
    //comsole.log(a[key]);
    if (a[key] == "0" || a[key] === undefined) {
      changeColid.value = key;
      key2 = `strMenuName${i}`;
      key3 = `lngPrice${i}`;
      break; // 첫 번째로 조건 맞는 값만 처리할 경우
    }
  }

  ////console.log(changeColid.value);
  changeValue.value = newValue[2];
  changeNow.value = !changeNow.value;

  await nextTick();
  changeColid.value = key2;
  changeValue.value = newValue[3];
  changeNow.value = !changeNow.value;

  await nextTick();
  changeColid.value = key3;
  changeValue.value = newValue[7];
  changeNow.value = !changeNow.value;

  closeMenus();
};
/**
 * 행 더블 클릭시 작동 함수
 */

const selectedindex = ref(0);
const selectedindex2 = ref(0);
/**
 * 수정용 데이터 행 설정
 */

const selectedIndex = (newValue) => {
  changeRow.value = newValue;
  selectedindex.value = newValue;
  //comsole.log(selectedindex.value);
};
/**
 * 수정용 데이터 행 설정
 */

const changeRow2 = ref();
/**
 * 수정용 데이터 행 설정
 */

const selectedIndex4 = (newValue) => {
  changeRow2.value = newValue;
};
const changeRow3 = ref();
/**
 * 수정용 데이터 행 설정
 */

const selectedIndex3 = (newValue) => {
  changeRow3.value = newValue;
};
/**
 * 조회 초기화
 */

const handleinitAll = (newvalue) => {
  MenuGroup.value = [];
  SubMenuGroup.value = [];
  MenuKeyList.value = [];
  ScreenKeyOrigin.value = [];
  TLUList.value = [];
  AllscreenKeyPage.value = "1";
  MenuList.value = [];
  ScreenKeys.value = [];
  items.value = [];
  forsearchMain.value = "0";
  forsearchSub.value = "0";
  filteredSubMenuGroup.value = [];
  searchword1.value = "";
  searchword3.value = "";
  afterSearch.value = false;
};
</script>

<style scoped></style>
