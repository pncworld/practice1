<template>
  <div class="flex justify-between items-center w-full overflow-y-auto">
    <div class="flex justify-start w-full pl-12 pt-4">
      <div class="flex justify-start">
        <h1 class="font-bold text-sm md:text-2xl w-full">출력기기관리</h1>
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
      @update:storeGroup="handleStoreGroup"
      @update:storeAreaCd="handleStoreAreaCd"
      @update:storeCd="handleStoreCd"
      @posNo="handlePosNo"
      @storeNm="handlestoreNm"
      @update:ischanged="handleinitAll"></PickStore>
  </div>
  <div class="z-50">
    <DupliPopUp5
      :isVisible="showPopup2"
      @close="showPopup2 = false"
      :storeCd="nowStoreCd"
      :storeNm="clickedStoreNm"
      :areaCd="nowStoreAreaCd"
      :posNo="posNo"
      :progname="'MST44_061INS_VUE'"
      :dupliapiname="'DUPLIALLKDS'"
      :progid="3"
      :poskiosk="'getStoreList'"
      naming2="KDS">
    </DupliPopUp5>
  </div>
  <div class="mt-5 flex justify-start ml-10">
    <button
      class="contents_tab-button"
      :class="{ 'text-blue-600': currentMenu == 1 }"
      @click="showMenus(1)">
      POS정보
    </button>
    <button
      class="contents_tab-button"
      :class="{ 'text-blue-600': currentMenu == 2 }"
      @click="showMenus(2)">
      포트기본정보
    </button>
    <button
      class="contents_tab-button"
      :class="{ 'text-blue-600': currentMenu == 3 }"
      @click="showMenus(3)">
      포트연결구성
    </button>
    <button
      class="contents_tab-button"
      :class="{ 'text-blue-600': currentMenu == 4 }"
      @click="showMenus(4)">
      출력기본구성
    </button>
  </div>
  <div class="flex h-4/6 w-full mt-5">
    <div class="flex flex-col w-full h-4/6">
      <div
        class="flex justify-between mt-0 ml-10 w-[95%] border-b border-b-gray-300">
        <div
          class="flex justify-between rounded-tl-lg text-xl -mt-1 font-bold w-full"
          v-if="currentMenu == 1">
          <div>POS정보 목록</div>
          <div>
            <button class="whitebutton">추가</button
            ><button class="whitebutton">삭제</button>
          </div>
        </div>
        <div
          class="flex justify-between rounded-tl-lg text-xl -mt-1 font-bold w-full"
          v-if="currentMenu == 2">
          <div>상세정보</div>
          <div>
            <button class="whitebutton">추가</button
            ><button class="whitebutton">삭제</button>
          </div>
        </div>
        <div
          class="flex justify-between rounded-tl-lg text-xl -mt-1 font-bold w-full"
          v-if="currentMenu == 3">
          <div>포트연결 목록</div>
          <div>
            <button class="whitebutton" @click="addRow3">추가</button
            ><button class="whitebutton" @click="deleteRow3">삭제</button>
          </div>
        </div>
        <div
          class="flex justify-between rounded-tl-lg text-xl -mt-1 font-bold w-full"
          v-if="currentMenu == 4">
          <div>출력기본 목록</div>
          <div>
            <button class="whitebutton">추가</button
            ><button class="whitebutton">삭제</button>
          </div>
        </div>
        <!-- <div class="flex justify-start rounded-tl-lg text-xl -mt-1 font-bold space-x-1 " v-if="currentMenu == 4"><button
              class="whitebutton" @click="initAllSection">초기화</button><button class="whitebutton"
              @click="dupliData">복사</button><button class="whitebutton" @click="dupliAllData">붙여넣기</button></div> -->
      </div>
      <div class="w-full h-full" v-show="currentMenu == 1">
        <div class="ml-10 mt-5 w-full h-full">
          <Realgrid
            class="w-[95%] h-[150%]"
            :progname="'MST44_062INS_VUE'"
            :progid="1"
            :rowData="rowData"
            :showCheckBar="false"
            @selcetedrowData="selcetedrowData"
            :changeRow="changeRow"
            :changeNow="changeNow"
            :changeColid="changeColid"
            :changeValue2="changeValue"
            @updatedRowData="updatedRowData"
            @selectedIndex="selectedIndex"
            @clickedRowData="clickedRowData"
            @realgridname="realgridname"></Realgrid>
        </div>
      </div>
      <!-- <div class="h-full mt-64" v-show="currentMenu == 1">
          <div class="flex justify-start rounded-tl-lg  text-xl -mt-1 font-bold ml-10 " v-if="currentMenu == false">POS별
            출력코너명 목록</div>
          <div class="ml-10 mt-5 w-full h-full">
            <Realgrid class="w-full h-[400%]" :progname="'MST44_062INS_VUE'" :progid="2" :rowData="rowData2"
              :showGrid="showGrid" :showCheckBar="false" @realgridname="realgridname2"></Realgrid>
          </div>
        </div> -->

      <div class="h-2/6 w-[80vw]" v-show="currentMenu == 2">
        <div
          class="grid grid-rows-3 grid-cols-[1fr,3fr,1fr,3fr,1fr,3fr] h-full w-full ml-10 mt-5 items-center gap-0">
          <div class="text-blue-500 font-semibold text-center">*POS 번호</div>
          <div>
            <select
              name=""
              id=""
              class="w-full h-8 border border-gray-500 rounded-lg"></select>
          </div>
          <div class="text-blue-500 font-semibold text-center">*PORT 번호</div>
          <div>
            <input
              type="text"
              class="w-full h-8 border border-gray-500 rounded-lg" />
          </div>
          <div class="text-blue-500 font-semibold text-center">*PORT명</div>
          <div>
            <input
              type="text"
              class="w-full h-8 border border-gray-500 rounded-lg" />
          </div>
          <div class="text-blue-500 font-semibold text-center">*PORT설정값</div>
          <div>
            <input
              type="text"
              class="w-full h-8 border border-gray-500 rounded-lg" />
          </div>
          <div class="text-blue-500 font-semibold text-center">*PORT구분</div>
          <div>
            <select
              name=""
              id=""
              class="w-full h-8 border border-gray-500 rounded-lg"></select>
          </div>
          <div class="text-blue-500 font-semibold text-center">
            *연결장비유형
          </div>
          <div>
            <select
              name=""
              id=""
              class="w-full h-8 border border-gray-500 rounded-lg"></select>
          </div>
          <div class="text-blue-500 font-semibold text-center">
            *PORT오픈여부
          </div>
          <div>
            <select
              name=""
              id=""
              class="w-full h-8 border border-gray-500 rounded-lg"></select>
          </div>
          <div class="text-blue-500 font-semibold text-center">
            *PORT공유여부
          </div>
          <div>
            <select
              name=""
              id=""
              class="w-full h-8 border border-gray-500 rounded-lg"></select>
          </div>
          <div>연결장비종류</div>
          <div>
            <select
              name=""
              id=""
              class="w-full h-8 border font-semibold border-gray-500 rounded-lg"></select>
          </div>
        </div>
        <div class="ml-10 mt-5 w-full h-full">
          <div class="font-semibold w-full flex justify-start text-xl">
            포트기본 목록
          </div>
          <Realgrid
            class="w-[103%] h-[300%]"
            :progname="'MST44_062INS_VUE'"
            :progid="4"
            :reload="reload"
            :rowData="rowData3"
            :showGrid="showGrid"
            :showCheckBar="false"
            @selcetedrowData="selcetedrowData"
            @updatedRowData="updatedRowData2"
            :mergeColumns2="true"
            :mergeColumnGroupName2="['메뉴정보']"
            :mergeColumnGroupSubList2="[
              ['mainName', 'subName', 'lngCode', 'strName', 'lngPrice'],
            ]"
            :setDynamicGrid3="true"
            :dynamicStoreCd="nowStoreCd"
            @realgridname="realgridname2"></Realgrid>
        </div>
      </div>

      <div class="h-full w-[95%]" v-show="currentMenu == 3">
        <div class="h-full w-full ml-10 mt-5" v-show="currentMenu == 3">
          <div class="w-full h-full">
            <Realgrid
              class="w-full h-[150%]"
              :progname="'MST44_063INS_VUE'"
              :progid="3"
              :reload="reload"
              :rowStateeditable="true"
              :selectionStyle="'cell'"
              :rowData="rowData3"
              :addRow4="addrow3"
              :addrowDefault="addrowDefault3"
              :addrowProp="addrowProp3"
              :deleteRow6="deleterow3"
              :labelingColumns="'intPosNo,lngPos'"
              :labelsData="[labelsData1, labelsData1]"
              :valuesData="[valueData1, valueData1]"
              @clickedRowData="clickedRowData3"
              @realgridname="realgridname3"
              @selectedIndex2="selectedIndex3"
              @updatedRowData="updatedRowData3"
              @allStateRows="allStateRows3"
              :changeColid="changeColid"
              :changeRow="changeRow"
              :changeNow="changeNow2"
              :changeValue2="changeValue"
              :initSelect="initSelect"></Realgrid>
          </div>
        </div>
      </div>

      <div class="w-full h-full flex" v-show="currentMenu == 4">
        <div class="ml-10 mt-5 w-[75%] h-full">
          <Realgrid
            class="w-[95%] h-[150%]"
            :progname="'MST44_062INS_VUE'"
            :progid="1"
            :rowData="rowData"
            :showCheckBar="false"
            @selcetedrowData="selcetedrowData"
            :changeRow="changeRow"
            :changeNow="changeNow"
            :changeColid="changeColid"
            :changeValue2="changeValue"
            @updatedRowData="updatedRowData"
            @selectedIndex="selectedIndex"
            @clickedRowData="clickedRowData"
            @realgridname="realgridname4"></Realgrid>
        </div>
        <div class="font-semibold">
          <div class="flex justify-start -ml-9 mt-2 text-xl">상세정보</div>
          <div
            class="grid grid-rows-11 grid-cols-[1fr,2fr] h-full w-full -ml-10 mt-5 items-center gap-0">
            <div
              class="bg-gray-100 rounded-tl-lg h-full w-full font-semibold items-center text-center border-t border-l border-gray-300 flex justify-center">
              주문서 발행횟수
            </div>
            <div
              class="bg-white rounded-tr-lg h-full w-full font-semibold items-center text-center border-t border-r border-l border-gray-300 flex justify-start pl-1">
              <input
                type="number"
                class="bg-gray-50 border rounded-lg w-[50%] h-[80%]" />회
            </div>
            <div
              class="text-blue-500 font-semibold bg-gray-100 h-full w-full items-center text-center border-t border-l border-gray-300 flex justify-center">
              *주문서 발행유형
            </div>
            <div
              class="bg-white h-full w-full font-semibold items-center text-center border-t border-r border-l border-gray-300 flex justify-start pl-1">
              <select
                name=""
                id=""
                class="bg-gray-50 border rounded-lg w-[90%] h-[80%]">
                <option value=""></option>
              </select>
            </div>
            <div
              class="text-blue-500 font-semibold bg-gray-100 h-full w-full items-center text-center border-t border-l border-gray-300 flex justify-center">
              *주문서 개요유형
            </div>
            <div
              class="bg-white h-full w-full font-semibold items-center text-center border-t border-r border-l border-gray-300 flex justify-start pl-1">
              <select
                name=""
                id=""
                class="bg-gray-50 border rounded-lg w-[90%] h-[80%]">
                <option value=""></option>
              </select>
            </div>
            <div
              class="text-blue-500 font-semibold bg-gray-100 h-full w-full items-center text-center border-t border-l border-gray-300 flex justify-center">
              *영수증 발행횟수
            </div>
            <div
              class="bg-white rounded-tr-lg h-full w-full font-semibold items-center text-center border-t border-r border-l border-gray-300 flex justify-start pl-1">
              <input
                type="number"
                class="bg-gray-50 border rounded-lg w-[50%] h-[80%]" />회
            </div>
            <div
              class="text-blue-500 font-semibold bg-gray-100 h-full w-full items-center text-center border-t border-l border-gray-300 flex justify-center">
              *영수증 개요유형
            </div>
            <div
              class="bg-white h-full w-full font-semibold items-center text-center border-t border-r border-l border-gray-300 flex justify-start pl-1">
              <select
                name=""
                id=""
                class="bg-gray-50 border rounded-lg w-[90%] h-[80%]">
                <option value=""></option>
              </select>
            </div>
            <div
              class="font-semibold bg-gray-100 h-full w-full items-center text-center border-t border-l border-gray-300 flex justify-center">
              주방출력 주문취소
            </div>
            <div
              class="bg-white h-full w-full font-semibold items-center text-center border-t border-r border-l border-gray-300 flex justify-start pl-1">
              <select
                name=""
                id=""
                class="bg-gray-50 border rounded-lg w-[90%] h-[80%]">
                <option value=""></option>
              </select>
            </div>
            <div
              class="font-semibold bg-gray-100 h-full w-full items-center text-center border-t border-l border-gray-300 flex justify-center">
              주방출력 메뉴정정
            </div>
            <div
              class="bg-white h-full w-full font-semibold items-center text-center border-t border-r border-l border-gray-300 flex justify-start pl-1">
              <select
                name=""
                id=""
                class="bg-gray-50 border rounded-lg w-[90%] h-[80%]">
                <option value=""></option>
              </select>
            </div>
            <div
              class="text-blue-500 font-semibold bg-gray-100 h-full w-full items-center text-center border-t border-l border-gray-300 flex justify-center">
              *주방전표 상위공백
            </div>
            <div
              class="bg-white rounded-tr-lg h-full w-full font-semibold items-center text-center border-t border-r border-l border-gray-300 flex justify-start pl-1">
              <input
                type="number"
                class="bg-gray-50 border rounded-lg w-[50%] h-[80%]" />줄
            </div>
            <div
              class="text-blue-500 font-semibold bg-gray-100 h-full w-full items-center text-center border-t border-l border-gray-300 flex justify-center">
              *주방전표 하위공백
            </div>
            <div
              class="bg-white rounded-tr-lg h-full w-full font-semibold items-center text-center border-t border-r border-l border-gray-300 flex justify-start pl-1">
              <input
                type="number"
                class="bg-gray-50 border rounded-lg w-[50%] h-[80%]" />줄
            </div>
            <div
              class="text-blue-500 font-semibold bg-gray-100 h-full w-full items-center text-center border-t border-l border-gray-300 flex justify-center">
              *주문전표 출력
            </div>
            <div
              class="bg-white rounded-tr-lg h-full w-full font-semibold items-center text-center border-t border-r border-l border-gray-300 flex justify-start pl-1">
              <input
                type="number"
                class="bg-gray-50 border rounded-lg w-[50%] h-[80%]" />줄
            </div>
            <div
              class="text-blue-500 font-semibold bg-gray-100 h-full w-full rounded-bl-lg items-center flex text-center border-t border-l border-b border-gray-300 justify-center">
              *영수증로고 출력유형
            </div>
            <div
              class="bg-white h-full w-full font-semibold items-center text-center border-t border-r border-l border-gray-300 flex justify-start pl-1">
              <select
                name=""
                id=""
                class="bg-gray-50 border rounded-lg w-[90%] h-[80%]">
                <option value=""></option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  getKitchenSettingList,
  getPortConnectionList,
  getPrintList,
  saveKitchenSettingAll,
  savePortConfig,
  savePrintNm,
  saveReceiptData,
} from "@/api/master";
import { ref, watch } from "vue";
import { useStore } from "vuex";

import DupliPopUp5 from "@/components/dupliPopUp5.vue";
import PickStore from "@/components/pickStore.vue";
import Realgrid from "@/components/realgrid.vue";
import RealGrid from "realgrid";
import Swal from "sweetalert2";
import { onMounted } from "vue";
import { getPosList } from "@/api/common";
const store = useStore();
// 더미 데이터
const labelsData1 = ref(["선택"]);

const valueData1 = ref([""]);

const settingPosList = async (e1, e2) => {
  labelsData1.value = ["선택"];
  valueData1.value = [0];
  const res = await getPosList(e1, e2);

  const datas = res.data.pos;

  for (let i = 0; i < datas.length; i++) {
    valueData1.value.push(datas[i].lngCode);
    labelsData1.value.push(datas[i].strName);
  }
};
// onMounted(async () => {
//   const e2 = store.state.userData.lngPosition;
//   const e1 = store.state.userData.lngStoreGroup;
//   settingPosList(e1, e2);
// });
const disabled = ref(true);
const items = ref([]);
const ScreenKeyOrigin = ref([]);
const ScreenKeys = ref();
const updatedList = ref();
const updatedList2 = ref();
const forsearchMain = ref("0");
const forsearchSub = ref("0");
const ischecked = ref(false);
const rowData4 = ref([]);
const changeMode = ref(false);
const fixedColumn = ref(true);
const PrintList = ref([]);
const clickedNm = ref("");
const clickedNo = ref();
const clickedStoreNm = ref();
const handlestoreNm = (newData) => {
  clickedStoreNm.value = newData;
};
const showPopup2 = ref(false);
const confirmitem = ref([]);
const reloadit = ref(true);
const receiptU = ref("");
const receiptD1 = ref("");
const receiptD2 = ref("");
const receiptD3 = ref("");
const receiptD4 = ref("");
const receiptD5 = ref("");
const posNo = ref();
const addrowDefault = ref();
const currmenuKeyPage = ref(1);
const AllscreenKeyPage = ref(1);
const rowData = ref([]);
const rowData2 = ref([]);
const rowData3 = ref([]);
const showMenus = (value) => {
  if (value == 1) {
    currentMenu.value = 1;
    hidesub.value = false;
  } else if (value == 2) {
    currentMenu.value = 2;
    hidesub.value = true;
  } else if (value == 3) {
    currentMenu.value = 3;
  } else if (value == 4) {
    currentMenu.value = 4;
  }
};

const currentMenu = ref("1");

const realgrid2Name = ref("");
const realgrid3Name = ref("");
const realgrid4Name = ref("");
const realgrid5Name = ref("");
const realgridname = (e) => {
  realgrid2Name.value = e;
};
const realgridname2 = (e) => {
  realgrid3Name.value = e;
};
const realgridname3 = (e) => {
  realgrid4Name.value = e;
};
const realgridname4 = (e) => {
  console.log(e);
  realgrid5Name.value = e;
};

watch(currentMenu, () => {
  if (currentMenu.value == 1) {
    const reagrid2 = document.getElementById(realgrid2Name.value);
    setTimeout(() => {
      RealGrid.getGridInstance(reagrid2).resetSize();
      RealGrid.getGridInstance(reagrid2).refresh(true);
    }, 100);
  } else if (currentMenu.value == 2) {
    const reagrid3 = document.getElementById(realgrid3Name.value);
    setTimeout(() => {
      RealGrid.getGridInstance(reagrid3).resetSize();
      RealGrid.getGridInstance(reagrid3).refresh(true);
    }, 100);
  } else if (currentMenu.value == 3) {
    const reagrid4 = document.getElementById(realgrid4Name.value);
    setTimeout(() => {
      RealGrid.getGridInstance(reagrid4).resetSize();
      RealGrid.getGridInstance(reagrid4).refresh(true);
    }, 100);
  } else if (currentMenu.value == 4) {
    const reagrid5 = document.getElementById(realgrid5Name.value);
    setTimeout(() => {
      RealGrid.getGridInstance(reagrid5).resetSize();
      RealGrid.getGridInstance(reagrid5).refresh(true);
    }, 100);
  }
});

const hidesub = ref(false);

const nowStoreAreaCd = ref();
const handleStoreAreaCd = (newValue) => {
  nowStoreAreaCd.value = newValue;
  console.log(nowStoreAreaCd.value);
};
const updatedRowData = (newValue) => {
  updatedList.value = newValue;
  console.log(updatedList.value);
};

const forSaveMenu = ref([]);
const updatedRowData2 = (newValue) => {
  if (currentMenu.value == 2) {
    forSaveMenu.value = [];
    updatedList2.value = newValue;
    SettingList.value.forEach((item, index) => {
      const matchedItem = updatedList2.value.find(
        (Item) => Item.lngCode == item.lngCode
      );
      if (matchedItem) {
        SettingList.value[index] = { ...matchedItem };
      }
    });

    const length = printNameList.value.length;
    for (var i = 0; i < length; i++) {
      forSaveMenu.value.push(
        SettingList.value
          .filter((item) => item["checkbox" + (i + 1)] == true)
          .map((item2) => Number(item2.lngCode))
      );
    }
    console.log(updatedList2.value);
  }
};

const updatedList3 = ref([]);
const updatedRowData3 = (newValue) => {
  updatedList3.value = newValue;
  console.log(updatedList3.value);
};
const nowStoreCd = ref();
const afterCategory = ref(false);
const handleStoreGroup = (e) => {
  groupCd.value = e;
};
const handleStoreCd = async (newValue) => {
  afterSearch.value = false;
  rowData.value = [];
  rowData2.value = [];

  SettingList.value = [];
  checked.value = [];
  printNameList.value = [];
  MenuGroup.value = [];
  SubMenuGroup.value = [];
  ischecked.value = false;

  nowStoreCd.value = newValue;
  settingPosList(groupCd.value, nowStoreCd.value);
  console.log(nowStoreCd.value);
  reload.value = !reload.value;
};

let isSwalOpen = false;
const selectIndex3 = ref();

const selectedIndex3 = (e) => {
  selectIndex3.value = e;
};
const addrow3 = ref(false);
const addrowProp3 = ref(
  "strName,intPosNo,lngPosition,lngPos,lngPort,cornerNm,portIdVlu,lngStoreCode,lngAreaCode"
);
const addrowDefault3 = ref("");
const addRow3 = () => {
  const newMax =
    Math.max(...rowData3.value.map((item) => Number(item.portIdVlu))) * 2;

  addrowDefault3.value =
    clickedStoreNm.value +
    "," +
    "0, ,0, , ," +
    newMax +
    "," +
    nowStoreCd.value +
    "," +
    nowStoreAreaCd.value;
  addrow3.value = !addrow3.value;
};

const deleterow3 = ref(false);
const allstaterow3 = ref([]);
const allStateRows3 = (e) => {
  console.log(e);
  allstaterow3.value = e;
};
const deleteRow3 = () => {
  if (afterSearch3.value == false) {
    Swal.fire({
      title: "경고",
      text: "먼저 조회해주세요.",
    });
    return;
  }
  deleterow3.value = !deleterow3.value;
};

const reload = ref(false);
const SettingList = ref();
const Category = ref([]);
const changeValue = ref("");
const MenuGroup = ref([]);
const SubMenuGroup = ref([]);
const changeNow = ref(false);
const changeNow2 = ref(false);

const searchword1 = ref();
const searchword3 = ref();
const userData = store.state.userData;

const groupCd = ref(userData.lngStoreGroup);
const modified = ref(false);
const afterSearch = ref(false);
const afterSearch2 = ref(false);
const afterSearch3 = ref(false);
const MenuList = ref([]);
const MenuKeyList = ref([]);
const clickedScreenOrMenu = ref(false);
const TLUList = ref([]);
const checked = ref();
const addRows = ref(false);
const deleteRows = ref(false);
const addRow = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고.",
      text: "조회를 먼저 해주세요",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  addRows.value = !addRows.value;
  addrowDefault.value = userData.strStoreGroupName;
  console.log(updatedList.value);
  if (updatedList.value == undefined || updatedList.value[0] == undefined) {
    addrowDefault.value += "," + 1;
  } else {
    const maxKdsCornerNum = Math.max(
      ...updatedList.value.map((item) => item.kdsCornerNum)
    );
    console.log(maxKdsCornerNum);
    addrowDefault.value += "," + (maxKdsCornerNum + 1);
    console.log(addrowDefault.value);
  }
};

const printNameList = ref([]);
const deleteRow = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고.",
      text: "조회를 먼저 해주세요",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  deleteRows.value = !deleteRows.value;
};

const selcetedrowData = (newValue) => {
  console.log(newValue);
  if (currentMenu.value == 3) {
  }
};

const initSelect = ref(false);
const searchButton = async () => {
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

  try {
    store.state.loading = true;
    let res;
    if (currentMenu.value == 1) {
      res = await getPrintList(groupCd.value, nowStoreCd.value);
      console.log(res);
      rowData.value = res.data.Print;
      rowData2.value = res.data.Print2;

      console.log(rowData2.value);
      afterSearch.value = true;
    } else if (currentMenu.value == 2) {
      res = await getKitchenSettingList(groupCd.value, nowStoreCd.value);
      console.log(res);

      SettingList.value = [...res.data.KITCHENMENU];
      MenuGroup.value = res.data.MAINGROUP;
      SubMenuGroup.value = res.data.SUBGROUP;
      checked.value = res.data.SAVED;
      PrintList.value = res.data.PRINTLIST;
      printNameList.value = res.data.KITCHENPRINT;
      console.log(checked.value);
      console.log(printNameList.value);
      console.log(SettingList.value);
      for (var i = 0; i < checked.value.length; i++) {
        const tlngCode = checked.value[i].lngCode;
        const portid = checked.value[i].portId;
        const index = SettingList.value.findIndex(
          (item) => item.lngCode == tlngCode
        );
        if (index != -1) {
          SettingList.value[index][portid] = true;
        }
      }

      // rowData3.value = [...SettingList.value];
      updatedList2.value = [...SettingList.value];

      confirmitem.value = JSON.parse(JSON.stringify(SettingList.value));
      afterSearch2.value = true;
    } else if (currentMenu.value == 3) {
      res = await getPortConnectionList(
        groupCd.value,
        nowStoreCd.value,
        nowStoreAreaCd.value
      );
      console.log(res);
      rowData3.value = res.data.List;
      updatedList3.value = JSON.parse(JSON.stringify(res.data.List));
      afterSearch3.value = true;
    }
  } catch (error) {
    console.log(error);
    afterSearch.value = false;
    afterSearch2.value = false;
    afterSearch3.value = false;
  } finally {
    if (currentMenu.value == 2) {
      if (ischecked.value == true) {
        ischecked.value = false;
        setTimeout(() => {
          ischecked.value = true;
        }, 10);
      } else {
        ischecked.value = true;
        setTimeout(() => {
          ischecked.value = false;
        }, 10);
      }

      const temp1 = forsearchMain.value;
      forsearchMain.value = "0";
      setTimeout(() => {
        forsearchMain.value = temp1;
      }, 1);
      const temp2 = forsearchSub.value;
      forsearchSub.value = "0";
      setTimeout(() => {
        forsearchSub.value = temp2;
      }, 1);
    }

    store.state.loading = false; // 로딩 상태 종료
    modified.value = false;
    afterCategory.value = false;
    clickedNo.value = "";
    clickedNm.value = "";
    initSelect.value = !initSelect.value;
  }
};
const filteredSubMenuGroup = ref([]);
const alreadyCheckedList = ref([]);
const forSaveMenu2 = ref([]);

const saveButton = async () => {
  if (currentMenu.value == 1) {
    if (afterSearch.value == false) {
      Swal.fire({
        title: "경고",
        text: "조회를 먼저 진행해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }
  } else if (currentMenu.value == 2) {
    if (afterSearch2.value == false) {
      Swal.fire({
        title: "경고",
        text: "조회를 먼저 진행해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }
  } else if (currentMenu.value == 3) {
    if (afterSearch3.value == false) {
      Swal.fire({
        title: "경고",
        text: "조회를 먼저 진행해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }
  }

  if (currentMenu.value == 1) {
    if (
      JSON.stringify(confirmitem.value) === JSON.stringify(updatedList.value)
    ) {
      Swal.fire({
        title: "경고",
        text: "변경된 사항이 없습니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }
  } else if (currentMenu.value == 2) {
    if (
      JSON.stringify(confirmitem.value) === JSON.stringify(updatedList2.value)
    ) {
      Swal.fire({
        title: "경고",
        text: "변경된 사항이 없습니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }
  } else if (currentMenu.value == 3) {
    const a = allstaterow3.value.deleted.length;
    const b = allstaterow3.value.created.length;
    const c = allstaterow3.value.updated.length;
    if (a + b + c == 0) {
      Swal.fire({
        title: "경고",
        text: "변경된 사항이 없습니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }
  }

  if (currentMenu.value == 3) {
    const length = new Set(updatedList3.value.map((item) => item.lngPosition))
      .size;
    const length2 = updatedList3.value.map((item) => item.lngPosition).length;
    if (length != length2) {
      Swal.fire({
        title: "경고",
        text: "Port연결ID가 중복되었습니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
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
        let res;

        if (currentMenu.value == 1) {
          const printNo = updatedList.value.map((item) => item.lngPosition);
          const printNm = updatedList.value.map((item) => item.cornerNm);
          res = await savePrintNm(
            groupCd.value,
            nowStoreCd.value,
            printNo.join(","),
            printNm.join(",")
          );
          console.log(res);
        } else if (currentMenu.value == 2) {
          let totalSum = [];
          const calculateArr = ref([]);
          console.log(SettingList.value);
          SettingList.value.forEach((obj) => {
            let sum = 0;
            Object.keys(obj)
              .filter((key) => key.startsWith("checkbox") && obj[key] == true)
              .forEach((key) => {
                const index = parseInt(key.replace("checkbox", ""));
                sum += Math.pow(2, index - 1);
              });
            totalSum.push(sum);
          });

          totalSum = totalSum.filter((item) => item != 0);

          const uniqueArray = [...new Set(totalSum)].sort((a, b) => a - b);

          SettingList.value.forEach((obj) => {
            let sum = 0;
            let index;
            let checkedColumn = [];

            // 'checkbox'로 시작하는 키 중에서 값이 true인 항목들을 필터링
            Object.keys(obj)
              .filter((key) => key.startsWith("checkbox") && obj[key] === true)
              .forEach((key) => {
                index = parseInt(key.replace("checkbox", "")); // index 계산
                checkedColumn.push(index); // 체크된 열 인덱스를 배열에 추가
                sum += Math.pow(2, index - 1); // sum에 값을 더함
              });

            // checkedColumn에 있는 모든 인덱스에 대해 sum 값을 추가
            checkedColumn.forEach((colIndex) => {
              // calculateArr.value[colIndex]가 배열이 아닌 경우 초기화
              if (!Array.isArray(calculateArr.value[colIndex])) {
                calculateArr.value[colIndex] = []; // 해당 index에 배열을 생성
              }
              calculateArr.value[colIndex].push(sum); // 해당 열의 배열에 sum을 추가
            });
          });

          // calculateArr.value의 각 속성 배열에 대해 중복을 제거

          Object.keys(calculateArr.value).forEach((key) => {
            if (Array.isArray(calculateArr.value[key])) {
              // Set을 사용하여 중복을 제거하고 배열로 변환
              calculateArr.value[key] = [...new Set(calculateArr.value[key])];
            }
          });

          calculateArr.value = calculateArr.value.slice(1);
          calculateArr.value = calculateArr.value.map((item) =>
            Array.from(item)
          );
          for (var i = 0; i < calculateArr.value.length; i++) {
            if (calculateArr.value[i] == null) {
              calculateArr.value[i] = [0];
            }
          }
          console.log(JSON.stringify(calculateArr.value));
          console.log(JSON.stringify(forSaveMenu.value));
          console.log(uniqueArray.join(","));

          console.log(updatedList2.value);

          res = await saveKitchenSettingAll(
            groupCd.value,
            nowStoreCd.value,
            JSON.stringify(forSaveMenu.value),
            uniqueArray.join(","),
            JSON.stringify(calculateArr.value),
            userData.loginID
          );
          console.log(res);
        } else if (currentMenu.value == 3) {
          const posNos = updatedList3.value.map((item) => item.intPosNo);
          const lngpositions = updatedList3.value.map(
            (item) => item.lngPosition
          );
          const lngposs = updatedList3.value.map((item) => item.lngPos);
          const lngports = updatedList3.value.map((item) => item.lngPort);
          const areaCds = updatedList3.value.map((item) => item.lngAreaCode);
          const cornernms = updatedList3.value.map((item) => item.cornerNm);
          const portIdVlus = updatedList3.value.map((item) => item.portIdVlu);
          const lngstorecodes = updatedList3.value.map(
            (item) => item.lngStoreCode
          );

          console.log(allstaterow3.value);
          const deletePoss = updatedList3.value
            .filter((_, index) => allstaterow3.value.deleted.includes(index))
            .map((item2) => item2.intPosNo);
          const deletedStoreCodes = updatedList3.value
            .filter((_, index) => allstaterow3.value.deleted.includes(index))
            .map((item2) => item2.lngStoreCode);
          const deletedPosition = updatedList3.value
            .filter((_, index) => allstaterow3.value.deleted.includes(index))
            .map((item2) => item2.lngPosition);

          const deletedAreaCodes = updatedList3.value
            .filter((_, index) => allstaterow3.value.deleted.includes(index))
            .map((item2) => item2.lngAreaCode);

          console.log(deleterow3);
          res = await savePortConfig(
            groupCd.value,
            nowStoreCd.value,
            posNos.join(","),
            lngpositions.join(","),
            lngposs.join(","),
            lngports.join(","),
            cornernms.join(","),
            portIdVlus.join(","),
            lngstorecodes.join(","),
            areaCds.join(","),
            deletePoss.join(","),
            deletedStoreCodes.join(","),
            deletedPosition.join(","),
            deletedAreaCodes.join(",")
          );
        }

        console.log(res);
      } catch (error) {
      } finally {
        store.state.loading = false;
        changeValue.value = null;
        Swal.fire({
          title: "저장 되었습니다.",
          confirmButtonText: "확인",
        });

        searchButton();
        reload.value = !reload.value;
      }
    }
  });
};

const selectedIndex = (e) => {
  changeRow.value = e;
};
const changeRow = ref();
const clickedRowData = (newValue) => {
  disabled.value = false;
  clickedNo.value = newValue[2];
  clickedNm.value = newValue[3];

  //changeRow.value = newValue.index
  changeColid.value = "cornerNm";
};

const changeColid = ref("");

const clickedRowData3 = (newValue) => {
  console.log(newValue);
};

const handlePosNo = (newValue) => {
  posNo.value = newValue;
  console.log(posNo.value);
  if (nowStoreAreaCd.value != undefined || posNo.value != undefined) {
    searchButton();
  }
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
