<template>
  <div class="flex justify-between items-center w-full overflow-y-auto">
    <div class="flex justify-start w-full pl-12 pt-4">
      <div class="flex justify-start">
        <h1 class="font-bold text-sm md:text-2xl w-full">옵션관리</h1>
      </div>
    </div>
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

  <div
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
          :searchWord="searchword4"
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
  </div>

  <span
    class="h-5 mt-3 flex justify-between items-center w-[900px] ml-[70%] z-40">
    <h1 class="font-bold text-xl z-40">
      옵션 {{ currentMenu == true ? "그룹" : "" }} 정보
    </h1>
  </span>
  <div class="flex h-4/5 w-full -mt-5">
    <div class="flex flex-col w-full h-full">
      <div
        class="flex justify-between mt-0 ml-10 w-[65%] border-b border-b-gray-300">
        <div>
          <button
            class="contents_tab-button"
            :class="{ 'text-blue-600': currentMenu == false }"
            @click="showMenus(1)">
            옵션관리
          </button>
          <button
            class="contents_tab-button"
            :class="{ 'text-blue-600': currentMenu == true }"
            @click="showMenus(2)">
            옵션그룹관리
          </button>
        </div>
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
          <button
            class="whitebutton"
            v-if="currentMenu == true"
            @click="addRowData3">
            추가
          </button>
          <button
            class="whitebutton"
            v-if="currentMenu == true"
            @click="deleteRowData3">
            삭제
          </button>
        </div>
      </div>
      <div class="flex h-full w-full gap-10">
        <div class="h-4/6 w-2/3" v-show="currentMenu == false">
          <div
            class="mt-3 ml-10 grid grid-cols-[1fr,3fr] grid-rows-1 gap-0 w-full">
            <div class="customtableIndex border border-gray-400 rounded-l-lg">
              옵션코드/옵션명
            </div>
            <div class="px-1 py-1 border border-gray-300 rounded-r-lg">
              <input
                type="text"
                class="border w-full h-full px-1 border-gray-400 rounded-lg"
                @input="searchOption"
                v-model="searchword1" />
            </div>
          </div>
          <div class="ml-10 mt-5 w-full h-[140%]">
            <!-- 옵션관리 그리드-->
            <Realgrid
              class="w-full h-full mt-2"
              :progname="'MST01_011INS_01_VUE'"
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
              :deleteRow="deleterow1"
              :addRow3="addrow1"
              @selectedIndex2="selectedIndex"
              @realgridname="realgridname"
              :addrowProp="addrowProp"
              :selectionStyle="'singleRow'"
              :rowStateeditable="false"
              :initSelect="initSelect"
              :addField="'new'">
            </Realgrid>
          </div>
        </div>

        <div class="h-4/6 w-2/3" v-show="currentMenu == true">
          <div
            class="mt-3 ml-10 grid grid-cols-[1fr,3fr] grid-rows-1 gap-0 w-full">
            <div class="customtableIndex border border-gray-400 rounded-l-lg">
              옵션그룹코드/옵션그룹명
            </div>
            <div class="px-1 py-1 border border-gray-300 rounded-r-lg">
              <input
                type="text"
                class="border w-full h-full px-1 border-gray-400 rounded-lg"
                @input="searchOption2"
                v-model="searchword2" />
            </div>
          </div>
          <div class="ml-10 mt-5 w-full h-[140%]">
            <!-- 옵션그룹관리 그리드-->
            <Realgrid
              class="w-full h-full mt-2"
              :progname="'MST01_011INS_01_VUE'"
              :progid="2"
              :rowData="rowData3"
              @clickedRowData="clickedRowData2"
              @updatedRowData="updatedRowData6"
              :deleteRow="deleterow2"
              :searchColId="'lngCode,strName'"
              :searchWord3="searchword2"
              :changeRow="changeRow"
              :changeValue2="changeValue2"
              :changeNow="changeNow2"
              :changeColid="changeColid"
              :addRow3="addrow3"
              @selectedIndex2="selectedIndex2"
              :addrowProp="addrowProp2"
              :selectionStyle="'singleRow'"
              :rowStateeditable="false"
              :initSelect="initSelect"
              @realgridname="realgridname2"
              :addField="'new'"></Realgrid>
          </div>
        </div>

        <div
          class="h-full w-1/3 flex flex-col pl-10"
          v-show="currentMenu == false">
          <div
            class="grid grid-cols-[1fr,3fr] grid-rows-4 items-center w-full h-1/5 rounded-lg">
            <div
              class="border border-black p-2 w-full h-full rounded-tl-lg flex items-center justify-center text-blue-500 font-semibold bg-gray-100">
              *옵션코드
            </div>
            <div
              class="border border-black p-2 w-full h-full rounded-tr-lg flex items-center justify-center">
              <input
                type="number"
                name="lngCode"
                class="border border-gray-300 rounded-lg w-full h-full p-2"
                v-model="optionCd"
                :disabled="!(isNewColumn && clickrowData1)"
                @input="changeOptionManage1" />
            </div>
            <div
              class="border border-black p-2 w-full h-full flex items-center justify-center text-blue-500 font-semibold bg-gray-100">
              *옵션명
            </div>
            <div
              class="border border-black p-2 w-full h-full flex items-center justify-center">
              <input
                type="text"
                class="border border-gray-300 rounded-lg w-full h-full p-2"
                v-model="optionNm"
                name="strName"
                @input="changeOptionManage1"
                :disabled="!clickrowData1" />
            </div>
            <div
              class="border border-black p-2 w-full h-full flex items-center justify-center text-blue-500 font-semibold bg-gray-100">
              *필수/선택
            </div>
            <div
              class="border border-black p-2 w-full h-full flex items-center justify-start">
              <label
                ><input
                  type="radio"
                  name="blnMustSel"
                  v-model="selectedOption"
                  value="0"
                  @input="changeOptionManage1"
                  :disabled="!clickrowData1" />필수</label
              >
              <label
                ><input
                  type="radio"
                  name="blnMustSel"
                  v-model="selectedOption"
                  value="1"
                  @input="changeOptionManage1"
                  :disabled="!clickrowData1" />선택</label
              >
            </div>
            <div
              class="border border-black p-2 w-full h-full rounded-bl-lg flex items-center justify-center text-blue-500 font-semibold bg-gray-100">
              *옵션 선택갯수
            </div>
            <div
              class="border border-black p-2 w-full h-full rounded-br-lg flex items-center justify-center">
              <input
                type="number"
                name="intMultiple"
                class="border border-gray-300 rounded-lg w-full h-full p-2"
                v-model="optionNo"
                @input="changeOptionManage1"
                :disabled="!clickrowData1" />
            </div>
          </div>
          <div class="mt-5 w-full h-[73%]">
            <div class="flex justify-between">
              <span class="font-bold text-xl flex justify-start"
                >옵션 구성</span
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
              :notsoftDelete="true"
              @realgridname="realgridname3"
              :deleteRow="deleterow3"
              :deleteAll="deleteAll1"
              :initSelect="initSelect"
              :addrowProp="addrowProp2"
              :addRow3="addrow4"></Realgrid>
          </div>
        </div>

        <div
          class="h-full w-1/3 flex flex-col pl-10"
          v-show="currentMenu == true">
          <div
            class="grid grid-cols-[1fr,3fr] grid-rows-3 items-center w-full h-[15%] rounded-lg">
            <div
              class="border border-black p-2 w-full h-full rounded-tl-lg flex items-center justify-center text-blue-500 font-semibold bg-gray-100">
              *옵션그룹코드
            </div>
            <div
              class="border border-black p-2 w-full h-full rounded-tr-lg flex items-center justify-center">
              <input
                type="number"
                class="border border-gray-300 rounded-lg w-full h-full p-2"
                name="lngCode"
                v-model="optionGroupCd"
                :disabled="!isNewColumn2 || !clickrowData2"
                @input="changeOptionManage2" />
            </div>
            <div
              class="border border-black p-2 w-full h-full flex items-center justify-center text-blue-500 font-semibold bg-gray-100 rounded-bl-lg">
              *옵션그룹명
            </div>
            <div
              class="border border-black p-2 w-full h-full flex items-center justify-center rounded-br-lg">
              <input
                type="text"
                name="strName"
                class="border border-gray-300 rounded-lg w-full h-full p-2"
                v-model="optionGroupNm"
                @input="changeOptionManage2"
                :disabled="!clickrowData2" />
            </div>
          </div>
          <div class="mt-11 w-full h-[73%]">
            <div class="flex justify-between">
              <span class="font-bold text-xl flex justify-start"
                >옵션그룹 구성</span
              >
              <div class="flex gap-1">
                <button class="whitebutton" @click="addRowData4">추가</button
                ><button class="whitebutton" @click="deleteRowData4">
                  삭제</button
                ><button class="whitebutton" @click="deleteAlls">초기화</button>
              </div>
            </div>
            <Realgrid
              :progname="'MST01_011INS_01_VUE'"
              :progid="3"
              :rowData="filteredrowData4"
              @updatedRowData="updatedRowData2"
              @realgridname="realgridname4"
              :initSelect="initSelect"
              class="mt-5"
              :dragOn="true"
              :notsoftDelete="true"
              :deleteRow="deleterow4"
              :deleteAll="deleteAll2"
              :addRow="addrow2"></Realgrid>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  getAllOptionManageData,
  getMostColumnMenuList,
  saveOptions,
  saveOptions2,
} from "@/api/master";
import { ref, watch } from "vue";
import { useStore } from "vuex";

import PickStore from "@/components/pickStore.vue";
import Realgrid from "@/components/realgrid.vue";
import Swal from "sweetalert2";
import RealGrid from "realgrid";

// 더미 데이터
const currentMenu = ref(false);
const items = ref([]);
const selectedOptionCd = ref();
const ScreenKeyOrigin = ref([]);
const rowData1 = ref([]);
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
const searchword2 = ref();
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
const handlestoreNm = (newData) => {
  clickedStoreNm.value = newData;
};

const confirmitem = ref([]);
const confirmitem2 = ref([]);
const realgridName = ref();
const realgridname = (e) => {
  realgridName.value = e;
};
const realgridName2 = ref();
const realgridname2 = (e) => {
  realgridName2.value = e;
};
const realgridName3 = ref();
const realgridname3 = (e) => {
  realgridName3.value = e;
};
const realgridName4 = ref();
const realgridname4 = (e) => {
  realgridName4.value = e;
};

watch(currentMenu, () => {
  const reagrid2 = document.getElementById(realgridName.value);
  setTimeout(() => {
    RealGrid.getGridInstance(reagrid2).resetSize();
    RealGrid.getGridInstance(reagrid2).refresh(true);
  }, 100);
  const reagrid3 = document.getElementById(realgridName2.value);
  setTimeout(() => {
    RealGrid.getGridInstance(reagrid3).resetSize();
    RealGrid.getGridInstance(reagrid3).refresh(true);
  }, 100);
  const reagrid4 = document.getElementById(realgridName3.value);
  setTimeout(() => {
    RealGrid.getGridInstance(reagrid4).resetSize();
    RealGrid.getGridInstance(reagrid4).refresh(true);
  }, 100);
  const reagrid5 = document.getElementById(realgridName4.value);
  setTimeout(() => {
    RealGrid.getGridInstance(reagrid5).resetSize();
    RealGrid.getGridInstance(reagrid5).refresh(true);
  }, 100);
});

const posNo = ref();

const AllscreenKeyPage = ref(1);

watch(selectedOption, () => {
  console.log(selectedOption.value);
});

const selectMenuGroup = ref(false);
let dupliitems = [];

const nowStoreAreaCd = ref();
const handleStoreAreaCd = (newValue) => {
  nowStoreAreaCd.value = newValue;
  console.log(nowStoreAreaCd.value);
};

const nowStoreCd = ref();
const afterCategory = ref(false);
const handleStoreCd = async (newValue) => {
  if (newValue == "0") {
    afterSearch.value = false;
  }
  nowStoreCd.value = newValue;
};
const selectedButton = ref();
const Category = ref([]);
const searchWord4 = (e) => {
  searchword4.value = e.target.value;
};
const MenuGroup = ref([]);
const SubMenuGroup = ref([]);

const store = useStore();
const searchword1 = ref();
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
  "lngCode,strName,blnMustSel,intMultiple,lngChainMenu1,lngChainMenu2,lngChainMenu3,lngChainMenu4,lngChainMenu5,lngChainMenu6,lngChainMenu7,lngChainMenu8,lngChainMenu9,lngChainMenu10,lngChainMenu11,lngChainMenu12,lngChainMenu13,lngChainMenu14,lngChainMenu15,lngChainMenu16,lngChainMenu17,lngChainMenu18,lngChainMenu19,lngChainMenu20,lngChainMenu21"
);
const addrowProp2 = ref(
  "lngCode,strName,lngChainGroup1,lngChainGroup2,lngChainGroup3,lngChainGroup4,lngChainGroup5,lngChainGroup6,lngChainGroup7,lngChainGroup8,lngChainGroup9,lngChainGroup10,lngChainGroup11,lngChainGroup12,lngChainGroup13,lngChainGroup14,lngChainGroup15,lngChainGroup16,lngChainGroup17,lngChainGroup18,lngChainGroup19,lngChainGroup20"
);

const showMenus = (newValue) => {
  if (newValue == 1) {
    currentMenu.value = false;
  } else if (newValue == 2) {
    currentMenu.value = true;
  }
};

const initSelect = ref(false);
const isNewColumn = ref(false);
const isNewColumn2 = ref(false);
const clickrowData1 = ref(false);
const clickedRowData = (newValue) => {
  clickrowData1.value = true;
  console.log(newValue);
  selectedOptionCd.value = Number(newValue[0]);
  isNewColumn.value = newValue[26] == true ? true : false;
  filteredrowData2.value = [];
  for (var i = 0; i < 21; i++) {
    if (newValue[4 + i] != "0") {
      const seleced = rowData2.value.find(
        (item) => item.lngCode == Number(newValue[4 + i])
      );
      if (seleced != undefined) {
        filteredrowData2.value.push({
          lngCode: seleced.lngCode,
          strName: seleced.strName,
          lngPrice: seleced.lngPrice,
        });
      }

      console.log(filteredrowData2.value);
    }
  }
  selectedOption.value = newValue[2] == "필수" ? 0 : 1;
  optionCd.value = Number(newValue[0]);
  optionNm.value = newValue[1];
  optionNo.value = newValue[3];
};
const selectedOptionGroupCd = ref();
const clickrowData2 = ref(false);
const clickedRowData2 = (newValue) => {
  console.log(newValue);

  clickrowData2.value = true;
  selectedOptionGroupCd.value = newValue[0];
  isNewColumn2.value = newValue[23] == true ? true : false;
  filteredrowData4.value = [];
  for (var i = 0; i < 20; i++) {
    if (newValue[2 + i] != "0") {
      console.log(rowData4.value);
      const seleced = rowData4.value.find(
        (item) => item.lngCode == Number(newValue[2 + i])
      );
      if (seleced != undefined) {
        filteredrowData4.value.push({
          lngCode: seleced.lngCode,
          strName: seleced.strName,
        });
      }
      console.log(filteredrowData4.value);
    }
  }
  optionGroupCd.value = newValue[0];
  optionGroupNm.value = newValue[1];
};
const selectedaddMenu = ref();
const selectedaddMenu2 = ref();
const clickedRowData3 = (newValue) => {
  selectedaddMenu.value = newValue;
};
const clickedRowData4 = (newValue) => {
  selectedaddMenu2.value = newValue;
};
const searchWord3 = (e) => {
  searchword3.value = e.target.value;
};

watch(rowData3, () => {
  console.log(rowData3.value);
});
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

    const res3 = await getAllOptionManageData(groupCd.value, nowStoreCd.value);
    const res4 = await getMostColumnMenuList(groupCd.value, nowStoreCd.value);
    console.log(res3);
    console.log(res4);
    rowData1.value = res3.data.OPTIONMANAGE;
    rowData2.value = res3.data.MENULIST;
    rowData3.value = res3.data.OPTIONGROUPMANAGE;
    rowData4.value = res3.data.OPTIONGROUPCOMPOSITION;
    rowData5.value = res4.data.MENULIST;
    rowData6.value = res3.data.OPTIONMANAGE;
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
  if (currentMenu.value == false) {
    if (
      JSON.stringify(confirmitem.value) ===
      JSON.stringify(updatedRowData4.value)
    ) {
      Swal.fire({
        title: "경고",
        text: "변경된 사항이 없습니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }
  } else {
    if (
      JSON.stringify(confirmitem2.value) ===
      JSON.stringify(updatedRowData5.value)
    ) {
      Swal.fire({
        title: "경고",
        text: "변경된 사항이 없습니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }
  }

  const undefinededrowlength = updatedRowData4.value
    .filter((item) => item.deleted != true)
    .filter(
      (item) =>
        item.lngCode == "" ||
        item.lngCode == undefined ||
        item.strName == undefined ||
        item.strName == "" ||
        item.intMultiple == undefined ||
        item.intMultiple == "" ||
        item.blnMustSel == undefined ||
        item.blnMustSel == ""
    ).length;
  const undefinededrow2length = updatedRowData5.value
    .filter((item) => item.deleted != true)
    .filter(
      (item) =>
        item.lngCode == "" ||
        item.lngCode == undefined ||
        item.strName == undefined ||
        item.strName == ""
    ).length;

  if (currentMenu.value == false) {
    if (undefinededrowlength > 0) {
      Swal.fire({
        title: "경고",
        text: "옵션 정보에 빈 값이 존재합니다",
        icon: "warning",
        confirmButtonText: "확인",
      });
      currentMenu.value = false;
      return;
    }
  } else {
    if (undefinededrow2length > 0) {
      Swal.fire({
        title: "경고",
        text: "옵션 그룹 정보에 빈 값이 존재합니다",
        icon: "warning",
        confirmButtonText: "확인",
      });
      currentMenu.value = true;
      return;
    }
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
        console.log(updatedRowData4.value);
        console.log(rowData3.value);

        if (currentMenu.value == false) {
          const lngCodes = updatedRowData4.value
            .filter((item) => item.deleted != true)
            .map((item) => item.lngCode);
          const strNames = updatedRowData4.value
            .filter((item) => item.deleted != true)
            .map((item) => item.strName);
          const blnMustSels = updatedRowData4.value
            .filter((item) => item.deleted != true)
            .map((item) => (item.blnMustSel == "필수" ? 0 : 1));
          const intMultiples = updatedRowData4.value
            .filter((item) => item.deleted != true)
            .map((item) => item.intMultiple);
          const lngChainMenu1 = updatedRowData4.value
            .filter((item) => item.deleted != true)
            .map((item) => item.lngChainMenu1);
          const lngChainMenu2 = updatedRowData4.value
            .filter((item) => item.deleted != true)
            .map((item) => item.lngChainMenu2);
          const lngChainMenu3 = updatedRowData4.value
            .filter((item) => item.deleted != true)
            .map((item) => item.lngChainMenu3);
          const lngChainMenu4 = updatedRowData4.value
            .filter((item) => item.deleted != true)
            .map((item) => item.lngChainMenu4);
          const lngChainMenu5 = updatedRowData4.value
            .filter((item) => item.deleted != true)
            .map((item) => item.lngChainMenu5);
          const lngChainMenu6 = updatedRowData4.value
            .filter((item) => item.deleted != true)
            .map((item) => item.lngChainMenu6);
          const lngChainMenu7 = updatedRowData4.value
            .filter((item) => item.deleted != true)
            .map((item) => item.lngChainMenu7);
          const lngChainMenu8 = updatedRowData4.value
            .filter((item) => item.deleted != true)
            .map((item) => item.lngChainMenu8);
          const lngChainMenu9 = updatedRowData4.value
            .filter((item) => item.deleted != true)
            .map((item) => item.lngChainMenu9);
          const lngChainMenu10 = updatedRowData4.value
            .filter((item) => item.deleted != true)
            .map((item) => item.lngChainMenu10);
          const lngChainMenu11 = updatedRowData4.value
            .filter((item) => item.deleted != true)
            .map((item) => item.lngChainMenu11);
          const lngChainMenu12 = updatedRowData4.value
            .filter((item) => item.deleted != true)
            .map((item) => item.lngChainMenu12);
          const lngChainMenu13 = updatedRowData4.value
            .filter((item) => item.deleted != true)
            .map((item) => item.lngChainMenu13);
          const lngChainMenu14 = updatedRowData4.value
            .filter((item) => item.deleted != true)
            .map((item) => item.lngChainMenu14);
          const lngChainMenu15 = updatedRowData4.value
            .filter((item) => item.deleted != true)
            .map((item) => item.lngChainMenu15);
          const lngChainMenu16 = updatedRowData4.value
            .filter((item) => item.deleted != true)
            .map((item) => item.lngChainMenu16);
          const lngChainMenu17 = updatedRowData4.value
            .filter((item) => item.deleted != true)
            .map((item) => item.lngChainMenu17);
          const lngChainMenu18 = updatedRowData4.value
            .filter((item) => item.deleted != true)
            .map((item) => item.lngChainMenu18);
          const lngChainMenu19 = updatedRowData4.value
            .filter((item) => item.deleted != true)
            .map((item) => item.lngChainMenu19);
          const lngChainMenu20 = updatedRowData4.value
            .filter((item) => item.deleted != true)
            .map((item) => item.lngChainMenu20);
          const lngChainMenu21 = updatedRowData4.value
            .filter((item) => item.deleted != true)
            .map((item) => item.lngChainMenu21);

          const res = await saveOptions(
            groupCd.value,
            nowStoreCd.value,
            lngCodes.join(","),
            strNames.join(","),
            blnMustSels.join(","),
            intMultiples.join(","),
            lngChainMenu1.join(","),
            lngChainMenu2.join(","),
            lngChainMenu3.join(","),
            lngChainMenu4.join(","),
            lngChainMenu5.join(","),
            lngChainMenu6.join(","),
            lngChainMenu7.join(","),
            lngChainMenu8.join(","),
            lngChainMenu9.join(","),
            lngChainMenu10.join(","),
            lngChainMenu11.join(","),
            lngChainMenu12.join(","),
            lngChainMenu13.join(","),
            lngChainMenu14.join(","),
            lngChainMenu15.join(","),
            lngChainMenu16.join(","),
            lngChainMenu17.join(","),
            lngChainMenu18.join(","),
            lngChainMenu19.join(","),
            lngChainMenu20.join(","),
            lngChainMenu21.join(",")
          );
        } else {
          const lngCodes2 = updatedRowData5.value
            .filter((item) => item.deleted != true)
            .map((item) => item.lngCode);
          const strNames2 = updatedRowData5.value
            .filter((item) => item.deleted != true)
            .map((item) => item.strName);
          const lngChainGroup1 = updatedRowData5.value
            .filter((item) => item.deleted != true)
            .map((item) => item.lngChainGroup1);
          const lngChainGroup2 = updatedRowData5.value
            .filter((item) => item.deleted != true)
            .map((item) => item.lngChainGroup2);
          const lngChainGroup3 = updatedRowData5.value
            .filter((item) => item.deleted != true)
            .map((item) => item.lngChainGroup3);
          const lngChainGroup4 = updatedRowData5.value
            .filter((item) => item.deleted != true)
            .map((item) => item.lngChainGroup4);
          const lngChainGroup5 = updatedRowData5.value
            .filter((item) => item.deleted != true)
            .map((item) => item.lngChainGroup5);
          const lngChainGroup6 = updatedRowData5.value
            .filter((item) => item.deleted != true)
            .map((item) => item.lngChainGroup6);
          const lngChainGroup7 = updatedRowData5.value
            .filter((item) => item.deleted != true)
            .map((item) => item.lngChainGroup7);
          const lngChainGroup8 = updatedRowData5.value
            .filter((item) => item.deleted != true)
            .map((item) => item.lngChainGroup8);
          const lngChainGroup9 = updatedRowData5.value
            .filter((item) => item.deleted != true)
            .map((item) => item.lngChainGroup9);
          const lngChainGroup10 = updatedRowData5.value
            .filter((item) => item.deleted != true)
            .map((item) => item.lngChainGroup10);
          const lngChainGroup11 = updatedRowData5.value
            .filter((item) => item.deleted != true)
            .map((item) => item.lngChainGroup11);
          const lngChainGroup12 = updatedRowData5.value
            .filter((item) => item.deleted != true)
            .map((item) => item.lngChainGroup12);
          const lngChainGroup13 = updatedRowData5.value
            .filter((item) => item.deleted != true)
            .map((item) => item.lngChainGroup13);
          const lngChainGroup14 = updatedRowData5.value
            .filter((item) => item.deleted != true)
            .map((item) => item.lngChainGroup14);
          const lngChainGroup15 = updatedRowData5.value
            .filter((item) => item.deleted != true)
            .map((item) => item.lngChainGroup15);
          const lngChainGroup16 = updatedRowData5.value
            .filter((item) => item.deleted != true)
            .map((item) => item.lngChainGroup16);
          const lngChainGroup17 = updatedRowData5.value
            .filter((item) => item.deleted != true)
            .map((item) => item.lngChainGroup17);
          const lngChainGroup18 = updatedRowData5.value
            .filter((item) => item.deleted != true)
            .map((item) => item.lngChainGroup18);
          const lngChainGroup19 = updatedRowData5.value
            .filter((item) => item.deleted != true)
            .map((item) => item.lngChainGroup19);
          const lngChainGroup20 = updatedRowData5.value
            .filter((item) => item.deleted != true)
            .map((item) => item.lngChainGroup20);

          const res = await saveOptions2(
            groupCd.value,
            nowStoreCd.value,
            lngCodes2.join(","),
            strNames2.join(","),
            lngChainGroup1.join(","),
            lngChainGroup2.join(","),
            lngChainGroup3.join(","),
            lngChainGroup4.join(","),
            lngChainGroup5.join(","),
            lngChainGroup6.join(","),
            lngChainGroup7.join(","),
            lngChainGroup8.join(","),
            lngChainGroup9.join(","),
            lngChainGroup10.join(","),
            lngChainGroup11.join(","),
            lngChainGroup12.join(","),
            lngChainGroup13.join(","),
            lngChainGroup14.join(","),
            lngChainGroup15.join(","),
            lngChainGroup16.join(","),
            lngChainGroup17.join(","),
            lngChainGroup18.join(","),
            lngChainGroup19.join(","),
            lngChainGroup20.join(",")
          );
        }

        console.log(res);
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

const updatedRowData3 = (e) => {
  updatedRowData4.value = e;
};

const updatedRowData5 = ref([]);

const updatedRowData6 = (e) => {
  updatedRowData5.value = e;
};
const updatedRowData = (newValue) => {
  console.log(optionCd.value);

  const change = updatedRowData4.value.find(
    (item) => item.lngCode == Number(optionCd.value)
  );

  if (change) {
    change.lngChainMenu1 = newValue[0] == undefined ? 0 : newValue[0].lngCode;
    change.lngChainMenu2 = newValue[1] == undefined ? 0 : newValue[1].lngCode;
    change.lngChainMenu3 = newValue[2] == undefined ? 0 : newValue[2].lngCode;
    change.lngChainMenu4 = newValue[3] == undefined ? 0 : newValue[3].lngCode;
    change.lngChainMenu5 = newValue[4] == undefined ? 0 : newValue[4].lngCode;
    change.lngChainMenu6 = newValue[5] == undefined ? 0 : newValue[5].lngCode;
    change.lngChainMenu7 = newValue[6] == undefined ? 0 : newValue[6].lngCode;
    change.lngChainMenu8 = newValue[7] == undefined ? 0 : newValue[7].lngCode;
    change.lngChainMenu9 = newValue[8] == undefined ? 0 : newValue[8].lngCode;
    change.lngChainMenu10 = newValue[9] == undefined ? 0 : newValue[9].lngCode;
    change.lngChainMenu11 =
      newValue[10] == undefined ? 0 : newValue[10].lngCode;
    change.lngChainMenu12 =
      newValue[11] == undefined ? 0 : newValue[11].lngCode;
    change.lngChainMenu13 =
      newValue[12] == undefined ? 0 : newValue[12].lngCode;
    change.lngChainMenu14 =
      newValue[13] == undefined ? 0 : newValue[13].lngCode;
    change.lngChainMenu15 =
      newValue[14] == undefined ? 0 : newValue[14].lngCode;
    change.lngChainMenu16 =
      newValue[15] == undefined ? 0 : newValue[15].lngCode;
    change.lngChainMenu17 =
      newValue[16] == undefined ? 0 : newValue[16].lngCode;
    change.lngChainMenu18 =
      newValue[17] == undefined ? 0 : newValue[17].lngCode;
    change.lngChainMenu19 =
      newValue[18] == undefined ? 0 : newValue[18].lngCode;
    change.lngChainMenu20 =
      newValue[19] == undefined ? 0 : newValue[19].lngCode;
    change.lngChainMenu21 =
      newValue[20] == undefined ? 0 : newValue[20].lngCode;
    console.log(change);
  }
  rowData1.value = [...rowData1.value];
  console.log(newValue);
};

const updatedRowData2 = (newValue) => {
  console.log(newValue);

  const change = updatedRowData5.value.find(
    (item) => item.lngCode == Number(selectedOptionGroupCd.value)
  );
  if (change) {
    change.lngChainGroup1 = newValue[0] == undefined ? 0 : newValue[0].lngCode;
    change.lngChainGroup2 = newValue[1] == undefined ? 0 : newValue[1].lngCode;
    change.lngChainGroup3 = newValue[2] == undefined ? 0 : newValue[2].lngCode;
    change.lngChainGroup4 = newValue[3] == undefined ? 0 : newValue[3].lngCode;
    change.lngChainGroup5 = newValue[4] == undefined ? 0 : newValue[4].lngCode;
    change.lngChainGroup6 = newValue[5] == undefined ? 0 : newValue[5].lngCode;
    change.lngChainGroup7 = newValue[6] == undefined ? 0 : newValue[6].lngCode;
    change.lngChainGroup8 = newValue[7] == undefined ? 0 : newValue[7].lngCode;
    change.lngChainGroup9 = newValue[8] == undefined ? 0 : newValue[8].lngCode;
    change.lngChainGroup10 = newValue[9] == undefined ? 0 : newValue[9].lngCode;
    change.lngChainGroup11 =
      newValue[10] == undefined ? 0 : newValue[10].lngCode;
    change.lngChainGroup12 =
      newValue[11] == undefined ? 0 : newValue[11].lngCode;
    change.lngChainGroup13 =
      newValue[12] == undefined ? 0 : newValue[12].lngCode;
    change.lngChainGroup14 =
      newValue[13] == undefined ? 0 : newValue[13].lngCode;
    change.lngChainGroup15 =
      newValue[14] == undefined ? 0 : newValue[14].lngCode;
    change.lngChainGroup16 =
      newValue[15] == undefined ? 0 : newValue[15].lngCode;
    change.lngChainGroup17 =
      newValue[16] == undefined ? 0 : newValue[16].lngCode;
    change.lngChainGroup18 =
      newValue[17] == undefined ? 0 : newValue[17].lngCode;
    change.lngChainGroup19 =
      newValue[18] == undefined ? 0 : newValue[18].lngCode;
    change.lngChainGroup20 =
      newValue[19] == undefined ? 0 : newValue[19].lngCode;
    console.log(change);
  }
  // rowData3.value = [...rowData3.value];
  console.log(newValue);
};

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
const changeOptionManage2 = (e) => {
  changeColid.value = e.target.name;
  changeValue2.value = e.target.value;

  changeNow2.value = !changeNow2.value;
};

const changeOptionManage3 = (e) => {
  const confirmdata = e.target.value.replace(/[^0-9]/g, "");
  const change = rowData1.value.find(
    (item, index) => index == selectedindex.value
  );

  if (change) {
    change.intMultiple = confirmdata;
  }
  rowData1.value = [...rowData1.value];
};
const changeOptionManage4 = (e) => {
  console.log(rowData1.value);
  const confirmdata = e.target.value.replace(/[^0-9]/g, "");
  const duplicate = rowData1.value.find((item) => item.lngCode == confirmdata);
  if (duplicate) {
    Swal.fire({
      title: "중복된 옵션코드",
      text: "이미 존재하는 코드입니다.",
      icon: "error",
      confirmButtonText: "확인",
    });
    optionCd.value = "";
    return;
  }
  const change = rowData1.value.find(
    (item, index) => index == selectedindex.value
  );
  if (change) {
    change.lngCode = confirmdata;
  }
  rowData1.value = [...rowData1.value];
  // optionCd.value = e.target.value
  // console.log(optionCd.value)
};

const searchOption = (e) => {
  searchword1.value = e.target.value;
};
const searchOption2 = (e) => {
  searchword2.value = e.target.value;
};
const deleteAll1 = ref(false);
const deleteAll = () => {
  deleteAll1.value = !deleteAll1.value;
};
const deleteAll2 = ref(false);
const deleteAlls = () => {
  deleteAll2.value = !deleteAll2.value;
};
const updateOptionNm = (e) => {
  const confirmdata = e.target.value;
  const change = rowData3.value.find(
    (item, index) => index == selectedindex2.value
  );
  if (change) {
    change.strName = confirmdata;
  }
  rowData3.value = [...rowData3.value];
};
const changeOptionGroupCd = (e) => {
  const Nm = e.target.value;
  const dupli = rowData3.value.find((item) => item.lngCode == Nm);
  if (dupli) {
    Swal.fire({
      title: "중복된 옵션 그룹코드",
      text: "이미 존재하는 코드입니다.",
      icon: "error",
      confirmButtonText: "확인",
    });
    optionGroupCd.value = "";
    return;
  }
  const change = rowData3.value.find(
    (item, index) => index == selectedindex2.value
  );
  if (change) {
    change.lngCode = Nm;
  }
  rowData3.value = [...rowData3.value];
};
const addrow1 = ref(false);
const addrow2 = ref(false);
const addrow3 = ref(false);
const addrow4 = ref(false);
const deleterow1 = ref(false);
const deleterow2 = ref(false);
const deleterow3 = ref(false);
const deleterow4 = ref(false);

const addRowData1 = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "조회를 먼저 해주세요.",
      confirmButtonText: "확인",
    });
    return;
  }
  isNewColumn.value = true;
  optionNo.value = "";
  selectedOption.value = "";
  optionNm.value = "";
  optionCd.value = "";
  filteredrowData2.value = [];
  clickrowData1.value = true;
  addrow1.value = !addrow1.value;
};
const addRowData2 = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "조회를 먼저 해주세요.",
      confirmButtonText: "확인",
    });
    return;
  }
  addrow4.value = !addrow4.value;
};
const addRowData3 = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "조회를 먼저 해주세요.",
      confirmButtonText: "확인",
    });
    return;
  }
  optionGroupNm.value = "";
  optionGroupCd.value = "";
  filteredrowData4.value = [];
  isNewColumn2.value = true;
  clickrowData2.value = true;
  addrow3.value = !addrow3.value;
};
const addRowData4 = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "조회를 먼저 해주세요.",
      confirmButtonText: "확인",
    });
    return;
  }
  if (optionGroupCd.value == "" || optionGroupCd.value == undefined) {
    Swal.fire({
      title: "옵션그룹코드를 먼저 선택하세요.",
      confirmButtonText: "확인",
    });
    return;
  }

  selectMenuGroup.value = true;
};
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
const deleteRowData3 = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "조회를 먼저 해주세요.",
      confirmButtonText: "확인",
    });
    return;
  }
  deleterow2.value = !deleterow2.value;
};
const deleteRowData2 = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "조회를 먼저 해주세요.",
      confirmButtonText: "확인",
    });
    return;
  }
  deleterow3.value = !deleterow3.value;
};
const deleteRowData4 = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "조회를 먼저 해주세요.",
      confirmButtonText: "확인",
    });
    return;
  }
  deleterow4.value = !deleterow4.value;
};

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
      title: "옵션을 먼저 선택하세요.",
      confirmButtonText: "확인",
    });
    return;
  }

  addMenu.value = true;
};
const closeMenus = () => {
  addMenu.value = false;
};
const closeMenus2 = () => {
  selectMenuGroup.value = false;
};
const handleGroupNm = (newValue) => {
  selectedGroupNm.value = newValue;
  console.log(selectedGroupNm.value);
};
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
  dblclickedRowData(newValue);
};
const clickaddMenu2 = (newValue) => {
  if (newValue == undefined || newValue == "") {
    Swal.fire({
      title: "메뉴그룹을 선택하세요.",
      confirmButtonText: "확인",
    });
    return;
  }
  dblclickedRowData2(newValue);
};
const dblclickedRowData = (newValue) => {
  console.log(newValue);
  const a = updatedRowData4.value.find(
    (item) => item.lngCode == optionCd.value
  );
  for (let i = 1; i <= 21; i++) {
    const key = `lngChainMenu${i}`;
    if (a[key] === "0" || a[key] === undefined) {
      changeColid.value = key;
      break; // 첫 번째로 조건 맞는 값만 처리할 경우
    }
  }

  changeValue.value = newValue[2];
  changeNow.value = !changeNow.value;
  // const rollbackdata = [...filteredrowData2.value];
  // filteredrowData2.value = [];
  // console.log(a);

  // const keys = Object.keys(a);
  // for (const key of keys) {
  //   if (key.startsWith("lngChainMenu")) {
  //     if (a[key] == Number(newValue[2])) {
  //       Swal.fire({
  //         title: "이미 등록된 메뉴코드입니다.",
  //         confirmButtonText: "확인",
  //       });
  //       filteredrowData2.value = rollbackdata;
  //       return;
  //     }

  //     if (a[key] == "0" || a[key] == undefined || a[key] == NaN) {
  //       a[key] = Number(newValue[2]);
  //       const seleced = rowData2.value.find(
  //         (item) => item.lngCode == Number(newValue[2])
  //       );
  //       if (seleced != undefined) {
  //         filteredrowData2.value.push({
  //           lngCode: seleced.lngCode,
  //           strName: seleced.strName,
  //           lngPrice: seleced.lngPrice,
  //         });
  //         break;
  //       }
  //     } else {
  //       const seleced = rowData2.value.find((item) => item.lngCode == a[key]);
  //       if (seleced != undefined) {
  //         filteredrowData2.value.push({
  //           lngCode: seleced.lngCode,
  //           strName: seleced.strName,
  //           lngPrice: seleced.lngPrice,
  //         });
  //       }
  //     }
  //   }
  // }
  // rowData1.value = [...rowData1.value];

  closeMenus();
};
const dblclickedRowData2 = (newValue) => {
  console.log(newValue);
  console.log(updatedRowData5.value);
  const a = updatedRowData5.value.find(
    (item) => item.lngCode == optionGroupCd.value
  );
  for (let i = 1; i <= 20; i++) {
    const key = `lngChainGroup${i}`;
    if (a[key] == 0 || a[key] === undefined || a[key] == "0") {
      changeColid.value = key;
      break; // 첫 번째로 조건 맞는 값만 처리할 경우
    }
  }

  changeValue2.value = newValue[0];
  changeNow2.value = !changeNow2.value;

  // const a = rowData3.value.find((item) => item.lngCode == optionGroupCd.value);

  // filteredrowData4.value = [];
  // const keys = Object.keys(a);
  // for (const key of keys) {
  //   if (key.startsWith("lngChainGroup")) {
  //     console.log(a[key]);
  //     if (a[key] == "0" || a[key] == undefined || a[key] == NaN) {
  //       a[key] = Number(newValue[0]);
  //       filteredrowData4.value.push({
  //         lngCode: newValue[0],
  //         strName: newValue[1],
  //       });
  //       break;
  //     } else {
  //       const seleced = rowData4.value.find((item) => item.lngCode == a[key]);
  //       if (seleced != undefined) {
  //         filteredrowData4.value.push({
  //           lngCode: seleced.lngCode,
  //           strName: seleced.strName,
  //         });
  //       }
  //     }
  //   }
  // }
  // rowData3.value = [...rowData3.value];

  // console.log(a);

  closeMenus2();
};
const selectedindex = ref(0);
const selectedindex2 = ref(0);
const selectedIndex = (newValue) => {
  changeRow.value = newValue;
  selectedindex.value = newValue;
  console.log(selectedindex.value);
};
const selectedIndex2 = (newValue) => {
  changeRow.value = newValue;
  selectedindex2.value = newValue;
  console.log(selectedindex2.value);
};
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
