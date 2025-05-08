<template>
  <div class="flex justify-between items-center w-full overflow-y-hidden">
    <PageName></PageName>
    <div class="flex justify-center mr-10 space-x-2 pr-5">
      <button @click="searchButton" class="button search md:w-auto w-14">
        조회
      </button>
      <button @click="saveButton" class="button save w-auto">저장</button>
      <button @click="copyButton" class="button copy w-auto">복사</button>
    </div>
  </div>
  <br />
  <div
    class="flex justify-start space-x-5 bg-gray-200 rounded-lg md:h-16 h-24 items-center">
    <PickStore
      @areaCd="handleStoreAreaCd"
      @update:storeCd="handleStoreCd"
      @posNo="handlePosNo"
      :showPosNo="true"
      @storeNm="handlestoreNm"
      @update:ischanged="handleinitAll"></PickStore>
  </div>
  <div class="z-[90]">
    <DupliPopUp6
      :isVisible="showPopup2"
      @close="showPopup2 = false"
      :storeCd="nowStoreCd"
      :storeNm="clickedStoreNm"
      :areaCd="nowStoreAreaCd"
      :posNo="posNo"
      :progname="'MST01_004INS_VUE'"
      :dupliapiname="'DUPLITABLEKEY'"
      :progid="2"
      :poskiosk="'getStoreAndPosList3'"
      naming2="테이블">
    </DupliPopUp6>
  </div>
  <div
    v-if="showSetScreenKey"
    class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-[89]">
    <div class="bg-white p-6 rounded shadow-lg w-[25%] h-[40%]">
      <h2 class="text-lg font-bold">화면키 설정</h2>
      <div class="flex flex-col justify-start h-12">
        <div>
          <p>화면키명</p>
        </div>
        <div class="h-full w-full rounded-lg">
          <input
            type="text"
            class="border border-gray-400 pl-1 h-full w-full rounded-lg"
            v-model="currScreenNm" />
        </div>
      </div>

      <div class="flex justify-center space-x-3 w-full h-16">
        <button
          @click="confirmScreenKey"
          class="mt-4 p-2 bg-blue-500 text-white rounded">
          확인
        </button>
        <button
          @click="exitScreenKey"
          class="mt-4 p-2 bg-blue-500 text-white rounded">
          닫기
        </button>
      </div>
    </div>
  </div>

  <div
    v-if="showModifyScreenKey"
    class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-[89]">
    <div class="bg-white p-6 rounded shadow-lg w-[25%] h-[40%]">
      <h2 class="text-lg font-bold">화면키 수정</h2>
      <div class="flex flex-col justify-start h-12">
        <div>
          <p>화면키명</p>
        </div>
        <div class="h-full w-full rounded-lg">
          <input
            type="text"
            class="border border-gray-400 pl-1 h-full w-full rounded-lg"
            v-model="currScreenNm" />
        </div>
      </div>

      <div class="flex justify-center space-x-3 w-full h-16">
        <button
          @click="confirmModifyScreenKey"
          class="mt-4 p-2 bg-blue-500 text-white rounded">
          확인
        </button>
        <button
          @click="exitModifyScreenKey"
          class="mt-4 p-2 bg-blue-500 text-white rounded">
          닫기
        </button>
      </div>
    </div>
  </div>
  <div class="flex ml-10 -mt-4 w-[60%] flex-row justify-between z-[88]">
    <div class="flex flex-row w-[79%] items-center">
      <button class="w-10 flex-shrink-0 flex items-center" @click="scrollLeft">
        <img src="../../assets/ic_before.svg" alt="" />
      </button>
      <div
        class="flex gap-2 w-[1000px] z-[88] h-32 items-center relative overflow-hidden"
        ref="scrollContainer">
        <div
          v-for="(i, index) in ScreenKeyOrigin"
          :value="i.intScreenNo"
          class="bg-gray-100 rounded-lg w-[200px] h-10 flex-shrink-0 flex justify-center font-bold"
          :class="
            clickScreenButton == i.intScreenNo
              ? 'text-blue-800 border-blue-500 border-2'
              : 'black'
          ">
          <button @click="showOtherScreen(i.intScreenNo)" class="w-[80%]">
            {{ i.strScreenName }}
          </button>
          <button
            @click="showModifyButton(index, i.intScreenNo)"
            class="w-[15%]">
            <img src="../../assets/ic_kebap.svg" alt="" />
          </button>
          <div
            v-show="
              clickedShowModifyButton == index && showModifyButton2 == true
            "
            class="flex flex-col absolute bg-white z-[88] ml-36 mt-8 rounded-lg gap-2 w-12 border border-gray-600"
            ref="scrollContainer">
            <button
              class="text-black"
              @click="modifyScreenKey(i.strScreenName, i.intScreenNo)">
              수정
            </button>
            <button class="text-black" @click="deleteScreenKey(i.intScreenNo)">
              삭제
            </button>
          </div>
        </div>
      </div>

      <button class="w-10 flex-shrink-0 flex items-center" @click="scrollRight">
        <img src="../../assets/ic_after.svg" alt="" />
      </button>
      <button
        class="w-10 flex-shrink-0 flex items-center"
        @click="addScreenKey">
        <img src="../../assets/Btn_46_add.svg" alt="" />
      </button>
      <button
        class="w-10 flex-shrink-0 flex items-center"
        @click="initAllTable">
        <img src="../../assets/Btn_46_refresh.svg" alt="" />
      </button>
    </div>
    <div class="ml-[57%] h-14 w-[200px] mt-7 flex items-center">
      <button
        :disabled="afterSearch == false"
        class="button primary w-[130px] h-[40px] flex justify-center"
        @click="addNewWidget()">
        테이블 추가
      </button>
    </div>
  </div>

  <div class="flex z-81 -mt-7">
    <div
      class="grid-stack table_style overflow-hidden !w-[1000px] !h-[630px]"></div>
    <div
      class="grid grid-rows-[1fr,3fr,1fr,1fr,1fr,1fr,1fr,1fr,4fr,1fr] grid-cols-1 border border-gray-200 w-[25%] ml-20 rounded-lg">
      <div class="bg-gray-100 font-semibold flex items-center justify-center">
        테이블 속성
      </div>
      <div class="flex justify-center items-center gap-3">
        <button
          :disabled="clickTable == false"
          @click="shapeclick(0)"
          :class="clickedShape == 0 ? 'bg-blue-200' : 'bg-white'"
          class="h-full w-[25%] flex justify-center items-center">
          <img src="../../assets/palette1.svg" alt="" />
        </button>
        <button
          :disabled="clickTable == false"
          @click="shapeclick(1)"
          :class="clickedShape == 1 ? 'bg-blue-200' : 'bg-white'"
          class="h-full w-[25%] flex justify-center items-center">
          <img src="../../assets/palette2.svg" alt="" />
        </button>
        <button
          :disabled="clickTable == false"
          @click="shapeclick(2)"
          :class="clickedShape == 2 ? 'bg-blue-200' : 'bg-white'"
          class="h-full w-[25%] flex justify-center items-center">
          <img src="../../assets/palette3.svg" alt="" />
        </button>
        <button
          :disabled="clickTable == false"
          @click="shapeclick(3)"
          class="h-full w-[25%] flex justify-center items-center"
          :class="clickedShape == 3 ? 'bg-blue-200' : 'bg-white'">
          <img src="../../assets/palette4.svg" alt="" />
        </button>
      </div>
      <div class="grid grid-cols-2">
        <div class="bg-gray-100 font-semibold flex justify-center items-center">
          테이블 코드
        </div>
        <div class="flex justify-center items-center">
          <input
            v-if="!clickedtableCode.toString().includes('new')"
            type="text"
            class="border rounded-lg border-gray-200 px-2"
            v-model="clickedtableCode"
            disabled /><input
            v-if="clickedtableCode.toString().includes('new')"
            type="text"
            class="border rounded-lg border-gray-200 px-2"
            value=""
            disabled />
        </div>
      </div>
      <div class="grid grid-cols-2">
        <div class="bg-gray-100 font-semibold flex justify-center items-center">
          테이블 명
        </div>
        <div class="flex justify-center items-center">
          <input
            type="text"
            class="border rounded-lg border-gray-200 px-2"
            v-model="clickedtableNm"
            @input="changetableProperty" />
        </div>
      </div>
      <div class="grid grid-cols-2">
        <div class="bg-gray-100 font-semibold flex justify-center items-center">
          좌석 수
        </div>
        <div class="flex justify-center items-center">
          <input
            type="text"
            class="border rounded-lg border-gray-200 px-2"
            v-model="clickedtableSeats"
            @input="changetableProperty" />
        </div>
      </div>
      <div class="grid grid-cols-4">
        <div class="bg-gray-100 font-semibold flex justify-center items-center">
          가로 위치(x)
        </div>
        <div class="flex justify-center items-center">
          <input
            type="text"
            class="border rounded-lg border-gray-200 px-2 w-full"
            v-model="clickedtableX"
            disabled />
        </div>
        <div class="bg-gray-100 font-semibold flex justify-center items-center">
          세로 위치(Y)
        </div>
        <div class="flex justify-center items-center">
          <input
            type="text"
            class="border rounded-lg border-gray-200 px-2 w-full"
            v-model="clickedtableY"
            disabled />
        </div>
      </div>
      <div class="grid grid-cols-4">
        <div class="bg-gray-100 font-semibold flex justify-center items-center">
          너비
        </div>
        <div class="flex justify-center items-center">
          <input
            type="text"
            class="border rounded-lg border-gray-200 px-2 w-full"
            v-model="clickedtableW"
            disabled />
        </div>
        <div class="bg-gray-100 font-semibold flex justify-center items-center">
          높이
        </div>
        <div class="flex justify-center items-center">
          <input
            type="text"
            class="border rounded-lg border-gray-200 px-2 w-full"
            v-model="clickedtableH"
            disabled />
        </div>
      </div>
      <div class="bg-gray-100 font-semibold flex items-center justify-center">
        테이블 색상
      </div>
      <div>
        <div class="grid grid-rows-2 grid-cols-7 gap-1 mt-5 ml-5">
          <button
            class="bg-white w-10 h-10 border border-gray-300 rounded-lg"
            :class="clickedtableColor == '#FFFFFF' ? '!border-black' : ''"
            @click="setColor(1)"></button>
          <button
            class="bg-[#BACCFF] w-10 h-10 border border-gray-300 rounded-lg"
            :class="clickedtableColor == '#BACCFF' ? '!border-black' : ''"
            @click="setColor(2)"></button>
          <button
            class="bg-[#B3EAFF] w-10 h-10 border border-gray-300 rounded-lg"
            :class="clickedtableColor == '#B3EAFF' ? '!border-black' : ''"
            @click="setColor(3)"></button>
          <button
            class="bg-[#CFFFAB] w-10 h-10 border border-gray-300 rounded-lg"
            :class="clickedtableColor == '#CFFFAB' ? '!border-black' : ''"
            @click="setColor(4)"></button>
          <button
            class="bg-[#FFDDBA] w-10 h-10 border border-gray-300 rounded-lg"
            :class="clickedtableColor == '#FFDDBA' ? '!border-black' : ''"
            @click="setColor(5)"></button>
          <button
            class="bg-[#FFC5C5] w-10 h-10 border border-gray-300 rounded-lg"
            :class="clickedtableColor == '#FFC5C5' ? '!border-black' : ''"
            @click="setColor(6)"></button>
          <button
            class="bg-[#D5C5FF] w-10 h-10 border border-gray-300 rounded-lg"
            :class="clickedtableColor == '#D5C5FF' ? '!border-black' : ''"
            @click="setColor(7)"></button>
          <button
            class="bg-[#C3C3C3] w-10 h-10 border border-gray-300 rounded-lg"
            :class="clickedtableColor == '#C3C3C3' ? '!border-black' : ''"
            @click="setColor(8)"></button>
          <button
            class="bg-[#7699FF] w-10 h-10 border border-gray-300 rounded-lg"
            :class="clickedtableColor == '#7699FF' ? '!border-black' : ''"
            @click="setColor(9)"></button>
          <button
            class="bg-[#5DD2FF] w-10 h-10 border border-gray-300 rounded-lg"
            :class="clickedtableColor == '#5DD2FF' ? '!border-black' : ''"
            @click="setColor(10)"></button>
          <button
            class="bg-[#9CFA55] w-10 h-10 border border-gray-300 rounded-lg"
            :class="clickedtableColor == '#9CFA55' ? '!border-black' : ''"
            @click="setColor(11)"></button>
          <button
            class="bg-[#FFB162] w-10 h-10 border border-gray-300 rounded-lg"
            :class="clickedtableColor == '#FFB162' ? '!border-black' : ''"
            @click="setColor(12)"></button>
          <button
            class="bg-[#FF9191] w-10 h-10 border border-gray-300 rounded-lg"
            :class="clickedtableColor == '#FF9191' ? '!border-black' : ''"
            @click="setColor(13)"></button>
          <button
            class="bg-[#AB8CFF] w-10 h-10 border border-gray-300 rounded-lg"
            :class="clickedtableColor == '#AB8CFF' ? '!border-black' : ''"
            @click="setColor(14)"></button>
        </div>
      </div>
      <div class="grid grid-cols-2 border border-y-black">
        <div
          @click="duplicateTable"
          class="border border-x-black flex justify-center items-center"
          :disabled="clickTable == false">
          <button class="w-full h-full">복사</button>
        </div>
        <div
          @click="deleteTable"
          class="flex justify-center items-center border border-x-black"
          :disabled="clickTable == false">
          <button class="w-full h-full">삭제</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  getTableList,
  getTableScreenKeys,
  saveScreenKeys3,
  saveTables,
} from "@/api/master";
import DupliPopUp6 from "@/components/dupliPopUp6.vue";
import PageName from "@/components/pageName.vue";
import PickStore from "@/components/pickStore.vue";
import { insertPageLog } from "@/customFunc/customFunc";

import { GridStack } from "gridstack";
import "gridstack/dist/gridstack.min.css";

import Swal from "sweetalert2";
import { onActivated, onDeactivated, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";

const ScreenKeyOrigin = ref([]);
const changeMode = ref(false);
const Category = ref([]);

const store = useStore();
const userData = store.state.userData;
const groupCd = ref(userData.lngStoreGroup);
const nowStoreCd = ref("0");
const currentMenu = ref(1);
const clickTable = ref(false);
const posNo = ref("");
const afterSearch = ref(false);
const nowStoreAreaCd = ref("0");
const clickScreenButton = ref(1);
const modified = ref(false);
const afterCategory = ref(false);
const clickedNo = ref("");
const clickedNm = ref("");
const confirmitem = ref("");
const clickedStoreNm = ref("");
const showPopup2 = ref(false);
const tableList = ref([]);
const clickedShape = ref(1);
const shapeclick = (value) => {
  clickedShape.value = value;
  const widgetElement = document.querySelector(
    `[gs-id="${clickedtableCode.value}"]`
  );
  const resizeHandle = widgetElement.querySelector(".grid-stack-item-content");
  resizeHandle.classList.remove("rectangle", "circle", "diamond", "triangle");

  if (clickedShape.value == 0) {
    resizeHandle.classList.add("rectangle");
  } else if (clickedShape.value == 1) {
    resizeHandle.classList.add("circle");
  } else if (clickedShape.value == 2) {
    resizeHandle.classList.add("diamond");
  } else if (clickedShape.value == 3) {
    resizeHandle.classList.add("triangle");
  }
  const findit = filteredtableList.value.find(
    (item) => item.lngKeyscrNo == clickedtableCode.value
  );
  //comsole.log(findit);
  //comsole.log(clickedtableCode.value);
  findit.lngShape = clickedShape.value;
};
const clickedColor = ref(1);
const setColor = (value) => {
  //comsole.log(value);
  if (value == 1) {
    clickedtableColor.value = "#FFFFFF";
  } else if (value == 2) {
    clickedtableColor.value = "#BACCFF";
  } else if (value == 3) {
    clickedtableColor.value = "#B3EAFF";
  } else if (value == 4) {
    clickedtableColor.value = "#CFFFAB";
  } else if (value == 5) {
    clickedtableColor.value = "#FFDDBA";
  } else if (value == 6) {
    clickedtableColor.value = "#FFC5C5";
  } else if (value == 7) {
    clickedtableColor.value = "#D5C5FF";
  } else if (value == 8) {
    clickedtableColor.value = "#C3C3C3";
  } else if (value == 9) {
    clickedtableColor.value = "#7699FF";
  } else if (value == 10) {
    clickedtableColor.value = "#5DD2FF";
  } else if (value == 11) {
    clickedtableColor.value = "#9CFA55";
  } else if (value == 12) {
    clickedtableColor.value = "#FFB162";
  } else if (value == 13) {
    clickedtableColor.value = "#FF9191";
  } else if (value == 14) {
    clickedtableColor.value = "#AB8CFF";
  }
  //comsole.log(clickedtableColor.value);
  const widgetElement = document.querySelector(
    `[gs-id="${clickedtableCode.value}"]`
  );

  if (widgetElement == undefined || widgetElement == null) {
    Swal.fire({
      title: "경고",
      text: "테이블을 먼저 생성한 후 색상을 선택해주세요.",
      icon: "warning",
      showCancelButton: false,
      confirmButtonColor: "#3085d6",
      allowOutsideClick: false,
    });
    return;
  }
  const resizeHandle = widgetElement.querySelector(".grid-stack-item-content");
  resizeHandle.style.backgroundColor = clickedtableColor.value;

  const findit = filteredtableList.value.find(
    (item) => item.lngKeyscrNo == clickedtableCode.value
  );
  findit.lngKeyColor = RGBToDecimal(clickedtableColor.value);

  const findit2 = tableList.value.find(
    (item) => item.lngKeyscrNo == clickedtableCode.value
  );
  findit2.lngKeyColor = RGBToDecimal(clickedtableColor.value);
};
const filteredtableList = ref([]);
const handleStoreCd = async (newValue) => {
  afterSearch.value = false;

  nowStoreCd.value = newValue;
};

const handlestoreNm = (newValue) => {
  clickedStoreNm.value = newValue;
};

const handlePosNo = (newValue) => {
  posNo.value = newValue;
  //comsole.log(posNo.value);
  if (
    nowStoreAreaCd.value != undefined &&
    posNo.value != undefined &&
    posNo.value != 0
  ) {
    searchButton();
  }
};

const handleStoreAreaCd = (newValue) => {
  nowStoreAreaCd.value = newValue;
  //comsole.log(nowStoreAreaCd.value);
};
let grid = null; // DO NOT use ref(null) as proxies GS will break all logic when comparing structures... see https://github.com/gridstack/gridstack.js/issues/2115

const searchButton = async () => {
  items.value = [];
  if (grid != null) {
    grid.removeAll();
  }

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
  if (nowStoreAreaCd.value == "0" || nowStoreAreaCd.value == undefined) {
    Swal.fire({
      title: "경고",
      text: "POS번호를 선택하세요.",
      icon: "warning",
      showCancelButton: false,
      confirmButtonColor: "#3085d6",
      allowOutsideClick: false,
    });
    return;
  }

  store.state.loading = true;
  try {
    let res;

    res = await getTableScreenKeys(
      groupCd.value,
      nowStoreCd.value,
      posNo.value,
      nowStoreAreaCd.value
    );
    ScreenKeyOrigin.value = res.data.SCREENKEYS;

    //comsole.log(ScreenKeyOrigin.value);
    let res2 = await getTableList(
      groupCd.value,
      nowStoreCd.value,
      posNo.value,
      nowStoreAreaCd.value
    );
    tableList.value = res2.data.TABLELISTS;
    //comsole.log(tableList.value);
    filteredtableList.value = tableList.value
      .filter((item) => item.intScreenNo == "1")
      .map((item) => ({
        ...item,
        x: Math.round(item.lngX / 125),
        y: Math.round(item.lngY / 125),
        w: Math.round(item.lngWidth / 120),
        h: Math.round(item.lngHeight / 120),
        id: item.lngKeyscrNo,
      }));
    afterSearch.value = true;
    //comsole.log(filteredtableList.value);
  } catch (error) {
    afterSearch.value = false;
  } finally {
    store.state.loading = false; // 로딩 상태 종료
    modified.value = false;
    afterCategory.value = false;
    clickedNo.value = "";
    clickedNm.value = "";
    clickTable.value = false;
    clickedtableCode.value = "";
    showModifyButton2.value = false;
    showOtherScreen(clickScreenButton.value);
  }
};

const RGBToDecimal = (hex) => {
  // Remove '#' if present
  const cleanHex = hex.startsWith("#") ? hex.slice(1) : hex;

  // Parse the RGB components from the hex string
  const r = parseInt(cleanHex.slice(0, 2), 16);
  const g = parseInt(cleanHex.slice(2, 4), 16);
  const b = parseInt(cleanHex.slice(4, 6), 16);

  // Combine the RGB components into a single decimal value
  return (r << 16) | (g << 8) | b;
};
const decimalToRGB = (decimal) => {
  const r = ((decimal >> 16) & 255).toString(16).padStart(2, "0").toUpperCase();
  const g = ((decimal >> 8) & 255).toString(16).padStart(2, "0").toUpperCase();
  const b = (decimal & 255).toString(16).padStart(2, "0").toUpperCase();
  return `#${r}${g}${b}`;
};

watch(tableList, () => {
  //comsole.log(tableList.value);
});

const clickedtableCode = ref("");
const clickedtableNm = ref("");
const clickedtableSeats = ref("");
const clickedtableX = ref("");
const clickedtableY = ref("");
const clickedtableW = ref("");
const clickedtableH = ref("");
const clickedtableShape = ref("1");
const clickedtableColor = ref("");
let count = ref(0);
let info = ref("");
let items = ref([]);
// Initialize GridStack on mount
// onMounted(() => {

//             grid = GridStack.init({ // DO NOT use grid.value = GridStack.init(), see above
//               float: true,
//               cellHeight: 'auto',
//               column : 90 ,
//               resizable: { handles: 'e,se' },
//               minRow : 56 ,
//               maxRow: 56
//             })

//             grid.on("dragstop", function (event, element) {
//               const node = element.gridstackNode;
//               info.value = `you just dragged node #${node.id} to ${node.x},${node.y} – good job!`;
//               const findtableindex = filteredtableList.value.findIndex(item => item.id == node.id)
//               filteredtableList.value[findtableindex].x = node.x
//               filteredtableList.value[findtableindex].y = node.y

//               grid.getGridItems().forEach(item => {
//            // 현재 그리드에 있는 모든 아이템들 순회
//                if (item.gridstackNode.id !== node.id) { // 드래그된 요소를 제외한 나머지
//                 const itemIndex = filteredtableList.value.findIndex(e => e.id == item.gridstackNode.id);
//                  if (itemIndex !== -1) {
//         // 밀린 요소의 새로운 위치 업데이트
//         filteredtableList.value[itemIndex].x = item.gridstackNode.x;
//         filteredtableList.value[itemIndex].y = item.gridstackNode.y;
//       }
//     }
//   });

//   filteredtableList.value.forEach(item => {
//     const tableItem = tableList.value.find(item2 => item2.intScreenNo == item.intScreenNo && item2.lngKeyscrNo == item.lngKeyscrNo )
//     if(tableItem){
//       Object.keys(item).forEach(key => {
//         if(key =='w'){
//           tableItem['w'] = item['w']
//         } else if(key == 'h'){
//           tableItem['h'] = item['h']
//         } else if(key =='x') {
//           tableItem['x'] = item['x']
//         } else if (key =='y'){
//           tableItem['y'] = item['y']
//         } else {
//           tableItem[key] = item[key]
//         }
//       })
//     }
//   })

//    //comsole.log(tableList.value)
//               const widgetElement = document.querySelector(`[gs-id="${node.id}"]`);
//                  if (widgetElement) {
//                  widgetElement.click(); // 클릭 이벤트 발생
//                }

//             });

//             grid.on("resizestop", function (event, element) {
//   const node = element.gridstackNode;
//   info.value = `you just resized node #${node.id} to width: ${node.w}, height: ${node.h} – good job!`;

//   // 리사이즈된 아이템의 정보 업데이트
//   const findtableindex = filteredtableList.value.findIndex(item => item.id == node.id);
//   if (findtableindex !== -1) {
//     filteredtableList.value[findtableindex].w = node.w;
//     filteredtableList.value[findtableindex].h = node.h;
//   }

//   grid.getGridItems().forEach(item => {
//            // 현재 그리드에 있는 모든 아이템들 순회
//                if (item.gridstackNode.id !== node.id) { // 드래그된 요소를 제외한 나머지
//                 const itemIndex = filteredtableList.value.findIndex(e => e.id == item.gridstackNode.id);
//                  if (itemIndex !== -1) {
//         // 밀린 요소의 새로운 위치 업데이트
//         filteredtableList.value[itemIndex].x = item.gridstackNode.x;
//         filteredtableList.value[itemIndex].y = item.gridstackNode.y;
//       }
//     }
//   });

//   filteredtableList.value.forEach(item => {
//     const tableItem = tableList.value.find(item2 => item2.intScreenNo == item.intScreenNo && item2.lngKeyscrNo == item.lngKeyscrNo )
//     if(tableItem){
//       Object.keys(item).forEach(key => {
//         if(key =='w'){
//           tableItem['w'] = item['w']
//         } else if(key == 'h'){
//           tableItem['h'] = item['h']
//         } else if(key =='x') {
//           tableItem['x'] = item['x']
//         } else if (key =='y'){
//           tableItem['y'] = item['y']
//         } else {
//           tableItem[key] = item[key]
//         }
//       })
//     }
//   })
//   //comsole.log(tableList.value)
// });

//           });

function initializeGrid() {
  const grid = GridStack.init({
    float: true,
    cellHeight: "auto",
    column: 90,
    resizable: { handles: "e,se" },
    minRow: 56,
    maxRow: 56,
  });

  if (grid) {
    grid.on("dragstop", (event, element) => handleDragStop(grid, element));
    grid.on("resizestop", (event, element) => handleResizeStop(grid, element));
  }
  return grid;
}

function handleDragStop(grid, element) {
  const node = element.gridstackNode;
  info.value = `You just dragged node #${node.id} to ${node.x},${node.y} – good job!`;

  updateNodePosition(grid, node);
  syncFilteredTableList();
  updateTableListFromFiltered();
  //comsole.log(tableList.value);

  const widgetElement = document.querySelector(`[gs-id="${node.id}"]`);
  if (widgetElement) {
    widgetElement.click(); // Trigger a click event
  }
}

function handleResizeStop(grid, element) {
  const node = element.gridstackNode;
  info.value = `You just resized node #${node.id} to width: ${node.w}, height: ${node.h} – good job!`;

  updateNodeSize(node);
  syncFilteredTableList();
  updateTableListFromFiltered();
  //comsole.log(tableList.value);
}

function updateNodePosition(grid, node) {
  const findtableindex = filteredtableList.value.findIndex(
    (item) => item.id === node.id
  );
  if (findtableindex !== -1) {
    filteredtableList.value[findtableindex].x = node.x;
    filteredtableList.value[findtableindex].y = node.y;
  }

  grid.getGridItems().forEach((item) => {
    if (item.gridstackNode.id !== node.id) {
      const itemIndex = filteredtableList.value.findIndex(
        (e) => e.id === item.gridstackNode.id
      );
      if (itemIndex !== -1) {
        filteredtableList.value[itemIndex].x = item.gridstackNode.x;
        filteredtableList.value[itemIndex].y = item.gridstackNode.y;
      }
    }
  });
}

function updateNodeSize(node) {
  const findtableindex = filteredtableList.value.findIndex(
    (item) => item.id === node.id
  );
  if (findtableindex !== -1) {
    filteredtableList.value[findtableindex].w = node.w;
    filteredtableList.value[findtableindex].h = node.h;
  }
}

function syncFilteredTableList() {
  filteredtableList.value.forEach((item) => {
    const tableItem = tableList.value.find(
      (item2) =>
        item2.intScreenNo === item.intScreenNo &&
        item2.lngKeyscrNo === item.lngKeyscrNo
    );
    if (tableItem) {
      Object.keys(item).forEach((key) => {
        if (["w", "h", "x", "y"].includes(key)) {
          tableItem[key] = item[key];
        } else {
          tableItem[key] = item[key];
        }
      });
    }
  });
}

function updateTableListFromFiltered() {
  filteredtableList.value.forEach((item) => {
    const tableItem = tableList.value.find(
      (item2) =>
        item2.intScreenNo === item.intScreenNo &&
        item2.lngKeyscrNo === item.lngKeyscrNo
    );
    if (tableItem) {
      Object.keys(item).forEach((key) => {
        if (["w", "h", "x", "y"].includes(key)) {
          tableItem[key] = item[key];
        } else {
          tableItem[key] = item[key];
        }
      });
    }
  });
}

// Usage in onMounted
onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  grid = initializeGrid();
});

const sequence = ref(1);
function addNewWidget() {
  // filteredtableList에서 아이템을 가져옴, 없으면 기본 값 설정
  const node = {
    w: 5, // 너비
    h: 5,
    intScreenNo: clickScreenButton.value,
    lngCount: 0,
    lngKeyColor: "16777215",
    lngKeyscrNo: "new" + sequence.value,
    lngShape: 0,
    strName: "신규" + sequence.value,
  };
  // id는 count 값을 사용
  node.id = String("new" + ++sequence.value);

  // autoPosition을 true로 설정하여 겹치지 않게 자동으로 위치 배치
  const result = grid.addWidget(node); // true로 설정하면 GridStack이 자동으로 위치를 계산
  //comsole.log(result);
  grid.commit();

  const validate = result.gridstackNode;
  const validate2 =
    validate.x + validate.w > 90 || validate.y + validate.h > 56;
  //comsole.log(validate);
  const gridItems = grid.getGridItems();
  const addedWidget = gridItems.find(
    (item) => item.gridstackNode.id === node.id
  );
  if (validate2 == true) {
    grid.removeWidget(addedWidget);
    Swal.fire({
      title: "오류",
      text: "더이상 위치할 공간이 없습니다.",
      icon: "error",
      confirmButtonText: "확인",
    });
    return;
  }
  filteredtableList.value.push({
    intScreenNo: Number(clickScreenButton.value),
    strName: "신규" + sequence.value,
    lngShape: 0,
    lngKeyColor: 16777215,
    lngKeyscrNo: "new" + sequence.value,
    lngCount: 0,
    w: 5,
    h: 5,
    id: node.id,
    x: addedWidget.gridstackNode.x,
    y: addedWidget.gridstackNode.y,
  });
  tableList.value.push({
    intScreenNo: clickScreenButton.value,
    strName: "신규" + sequence.value,
    lngShape: 0,
    lngKeyColor: 16777215,
    lngKeyscrNo: "new" + sequence.value,
    lngCount: 0,
    w: 5,
    h: 5,
    id: node.id,
    x: addedWidget.gridstackNode.x,
    y: addedWidget.gridstackNode.y,
  });
  const widgetElement = document.querySelector(`[gs-id="${node.id}"]`);
  if (widgetElement) {
    widgetElement.style.backgroundColor = "";
    const resizeHandle = widgetElement.querySelector(
      ".grid-stack-item-content"
    );
    resizeHandle.style.backgroundColor = decimalToRGB("16777215");
    resizeHandle.classList.add("rectangle");
  }
  const textElement = widgetElement.querySelector(".grid-stack-item-content");
  if (textElement) {
    const newDiv = document.createElement("div");
    newDiv.innerText = "신규" + sequence.value; // 텍스트 설정
    newDiv.style.position = "absolute";
    newDiv.style.left = "0";
    newDiv.style.zIndex = "81";
    textElement.insertAdjacentElement("afterend", newDiv);
  }
  widgetElement.addEventListener("click", function () {
    const finditem = filteredtableList.value.find(
      (item2) => item2.id == node.id
    );
    const widgetElements = document.querySelectorAll("[gs-id]");

    // 각 요소에 대해 스타일 변경
    widgetElements.forEach((widgetElement) => {
      // 원하는 스타일 변경
      widgetElement.style.border = "";
    });
    widgetElement.style.border = "2px solid black";

    //comsole.log("아이템 클릭됨!");
    //comsole.log(`아이템 ID: ${finditem.id}`);
    clickedtableColor.value = decimalToRGB(finditem.lngKeyColor);
    clickedtableShape.value = finditem.lngShape;
    clickedShape.value = Number(finditem.lngShape);
    clickedtableCode.value = finditem.id;
    clickedtableNm.value = finditem.strName;
    clickedtableX.value = finditem.x * 125;
    clickedtableY.value = finditem.y * 125;
    clickedtableW.value = finditem.w * 120;
    clickedtableH.value = finditem.h * 120;
    clickTable.value = true;
    clickedtableSeats.value = finditem.lngCount;
    //comsole.log(`x: ${finditem.x}, y: ${finditem.y}`);
    //comsole.log(`너비: ${finditem.w}, 높이: ${finditem.h}`);
    //comsole.log(clickedtableColor.value);
    // 원하는 추가 작업을 여기에 작성
  });
  widgetElement.click();
  //comsole.log(tableList.value);
}

watch(
  filteredtableList,
  (newList) => {
    if (newList.length > 0) {
      for (var i = 0; i < filteredtableList.value.length; i++) {
        const item = filteredtableList.value[i];
        const node = {
          x: item.x,
          y: item.y,
          w: item.w,
          h: item.h,
          id: item.id,
        };
        grid.addWidget(node); // Add widget to the grid

        const widgetElement = document.querySelector(`[gs-id="${item.id}"]`);
        if (widgetElement) {
          widgetElement.style.backgroundColor = "";
          const resizeHandle = widgetElement.querySelector(
            ".grid-stack-item-content"
          );
          resizeHandle.style.backgroundColor = decimalToRGB(item.lngKeyColor);
          if (item.lngShape == "0") {
            resizeHandle.classList.add("rectangle");
          } else if (item.lngShape == "1") {
            resizeHandle.classList.add("circle");
          } else if (item.lngShape == "2") {
            resizeHandle.classList.add("diamond");
          } else if (item.lngShape == "3") {
            resizeHandle.classList.add("triangle");
          }
        }
        const textElement = widgetElement.querySelector(
          ".grid-stack-item-content"
        );
        if (textElement) {
          const newDiv = document.createElement("div");
          newDiv.innerText = item.strName; // 텍스트 설정
          newDiv.style.position = "absolute";
          newDiv.style.left = "0";
          newDiv.style.zIndex = "81";
          textElement.insertAdjacentElement("afterend", newDiv);
        }
        if (widgetElement) {
          widgetElement.addEventListener("click", function () {
            const finditem = filteredtableList.value.find(
              (item2) => item2.id == item.id
            );
            const widgetElements = document.querySelectorAll("[gs-id]");

            // 각 요소에 대해 스타일 변경
            widgetElements.forEach((widgetElement) => {
              // 원하는 스타일 변경
              widgetElement.style.border = "";
            });
            widgetElement.style.border = "2px solid black";

            //comsole.log("아이템 클릭됨!");
            //comsole.log(`아이템 ID: ${finditem.id}`);
            clickedtableColor.value = decimalToRGB(finditem.lngKeyColor);
            clickedtableShape.value = finditem.lngShape;
            clickedShape.value = Number(finditem.lngShape);
            clickedtableCode.value = finditem.id;
            clickedtableNm.value = finditem.strName;
            clickedtableX.value = finditem.x * 125;
            clickedtableY.value = finditem.y * 125;
            clickedtableW.value = finditem.w * 120;
            clickedtableH.value = finditem.h * 120;
            clickTable.value = true;
            clickedtableSeats.value = finditem.lngCount;
            //comsole.log(`x: ${finditem.x}, y: ${finditem.y}`);
            //comsole.log(`너비: ${finditem.w}, 높이: ${finditem.h}`);
            //comsole.log(clickedtableColor.value);
            //comsole.log(clickedShape.value);
            // 원하는 추가 작업을 여기에 작성
          });
        }
      }
    }
  },
  { immediate: false } // tableList가 처음 정의되었을 때는 실행하지 않음
);

const showOtherScreen = (newValue) => {
  //comsole.log(filteredtableList.value);
  //comsole.log(tableList.value);
  //comsole.log(newValue);
  clickTable.value = false;
  filteredtableList.value.forEach((item) => {
    const tableItem = tableList.value.find(
      (item2) =>
        item2.intScreenNo == item.intScreenNo &&
        item2.lngKeyscrNo == item.lngKeyscrNo
    );
    if (tableItem) {
      Object.keys(item).forEach((key) => {
        if (key == "w") {
          tableItem["lngWidth"] = item["w"] * 120;
        } else if (key == "h") {
          tableItem["lngHeight"] = item["h"] * 120;
        } else if (key == "x") {
          tableItem["lngX"] = item["x"] * 125;
        } else if (key == "y") {
          tableItem["lngY"] = item["y"] * 125;
        } else {
          tableItem[key] = item[key];
        }
      });
    }
  });
  //comsole.log(tableList.value);
  //comsole.log(grid);
  if (grid != null) {
    //comsole.log(grid.nodes);
    if (grid == undefined) {
      return;
    }
    grid.removeAll();
  }
  filteredtableList.value = tableList.value
    .filter((item) => item.intScreenNo == newValue)
    .map((item) => ({
      ...item,
      x: Math.round(item.lngX / 125),
      y: Math.round(item.lngY / 125),
      w: Math.round(item.lngWidth / 120),
      h: Math.round(item.lngHeight / 120),
      id: item.lngKeyscrNo,
    }));
  clickScreenButton.value = newValue;
  clickedShowModifyButton.value = -1;
};
const scrollContainer = ref(null);
const scrollRight = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollLeft += 200; // 오른쪽으로 200px 이동
  }
};
const scrollLeft = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollLeft -= 200; // 오른쪽으로 200px 이동
  }
};
const deleteTable = () => {
  const finditem = filteredtableList.value.find(
    (item) => item.id == clickedtableCode.value
  );
  if (finditem) {
    const index = filteredtableList.value.indexOf(finditem);
    if (index > -1) {
      filteredtableList.value.splice(index, 1);
    }
  }
  //comsole.log(filteredtableList.value);
  const finditem2 = tableList.value.find(
    (item) =>
      item.lngKeyscrNo == clickedtableCode.value &&
      item.intScreenNo == clickScreenButton.value
  );
  if (finditem2) {
    const index = tableList.value.indexOf(finditem2);
    if (index > -1) {
      tableList.value.splice(index, 1);
    }
  }
  //comsole.log(tableList.value);

  const widgetElement = document.querySelector(
    `[gs-id="${clickedtableCode.value}"]`
  );
  if (widgetElement) {
    grid.removeWidget(widgetElement);
  }
};

const duplicateTable = () => {
  if (clickedtableCode.value != "") {
    const node = {
      w: Number(clickedtableW.value / 120), // 너비
      h: Number(clickedtableH.value / 120),
      intScreenNo: clickScreenButton.value,
      lngCount: clickedtableSeats.value,
      lngKeyColor: RGBToDecimal(clickedtableColor.value),
      lngKeyscrNo: "new" + ++sequence.value,
      lngShape: Number(clickedShape.value),
      strName: "신규" + sequence.value,
    };
    // id는 count 값을 사용
    //comsole.log(node);
    node.id = String("new" + sequence.value);

    // autoPosition을 true로 설정하여 겹치지 않게 자동으로 위치 배치
    const result = grid.addWidget(node); // true로 설정하면 GridStack이 자동으로 위치를 계산
    grid.commit();
    const validate = result.gridstackNode;
    const validate2 =
      validate.x + validate.w > 90 || validate.y + validate.h > 56;
    //comsole.log(validate);
    const gridItems = grid.getGridItems();
    const addedWidget = gridItems.find(
      (item) => item.gridstackNode.id === node.id
    );
    if (validate2 == true) {
      grid.removeWidget(addedWidget);
      Swal.fire({
        title: "오류",
        text: "더이상 위치할 공간이 없습니다.",
        icon: "error",
        confirmButtonText: "확인",
      });
      return;
    }

    filteredtableList.value.push({
      intScreenNo: clickScreenButton.value,
      strName: "신규" + sequence.value,
      lngShape: clickedShape.value,
      lngKeyColor: RGBToDecimal(clickedtableColor.value),
      lngKeyscrNo: "new" + sequence.value,
      lngCount: clickedtableSeats.value,
      w: clickedtableW.value / 120,
      h: clickedtableH.value / 120,
      id: node.id,
      x: addedWidget.gridstackNode.x,
      y: addedWidget.gridstackNode.y,
    });
    tableList.value.push({
      intScreenNo: clickScreenButton.value,
      strName: "신규" + sequence.value,
      lngShape: clickedShape.value,
      lngKeyColor: RGBToDecimal(clickedtableColor.value),
      lngKeyscrNo: "new" + sequence.value,
      lngCount: clickedtableSeats.value,
      w: clickedtableW.value / 120,
      h: clickedtableH.value / 120,
      id: node.id,
      x: addedWidget.gridstackNode.x,
      y: addedWidget.gridstackNode.y,
    });
    const widgetElement = document.querySelector(`[gs-id="${node.id}"]`);
    if (widgetElement) {
      widgetElement.style.backgroundColor = "";
      const resizeHandle = widgetElement.querySelector(
        ".grid-stack-item-content"
      );
      resizeHandle.style.backgroundColor = clickedtableColor.value;
      if (clickedShape.value == 0) {
        resizeHandle.classList.add("rectangle");
      } else if (clickedShape.value == 1) {
        resizeHandle.classList.add("circle");
      } else if (clickedShape.value == 2) {
        resizeHandle.classList.add("diamond");
      } else if (clickedShape.value == 3) {
        resizeHandle.classList.add("triangle");
      }
    }

    const textElement = widgetElement.querySelector(".grid-stack-item-content");
    if (textElement) {
      const newDiv = document.createElement("div");
      newDiv.innerText = "신규" + sequence.value; // 텍스트 설정
      newDiv.style.position = "absolute";
      newDiv.style.left = "0";
      newDiv.style.zIndex = "81";
      textElement.insertAdjacentElement("afterend", newDiv);
    }
    widgetElement.addEventListener("click", function () {
      const finditem = filteredtableList.value.find(
        (item2) => item2.id == node.id
      );
      const widgetElements = document.querySelectorAll("[gs-id]");

      // 각 요소에 대해 스타일 변경
      widgetElements.forEach((widgetElement) => {
        // 원하는 스타일 변경
        widgetElement.style.border = "";
      });
      widgetElement.style.border = "2px solid black";

      //comsole.log("아이템 클릭됨!");
      //comsole.log(`아이템 ID: ${finditem.id}`);
      clickedtableColor.value = decimalToRGB(finditem.lngKeyColor);
      clickedtableShape.value = finditem.lngShape;
      clickedShape.value = Number(finditem.lngShape);
      clickedtableCode.value = finditem.id;
      clickedtableNm.value = finditem.strName;
      clickedtableX.value = finditem.x * 125;
      clickedtableY.value = finditem.y * 125;
      clickedtableW.value = finditem.w * 120;
      clickedtableH.value = finditem.h * 120;
      clickedtableSeats.value = finditem.lngCount;
      //comsole.log(`x: ${finditem.x}, y: ${finditem.y}`);
      //comsole.log(`너비: ${finditem.w}, 높이: ${finditem.h}`);
      //comsole.log(clickedtableColor.value);
      // 원하는 추가 작업을 여기에 작성
    });
    widgetElement.click();
    //comsole.log(filteredtableList.value);
  } else {
    Swal.fire({
      title: "오류",
      text: "복사할 대상을 선택해주세요.",
      icon: "error",
      confirmButtonText: "확인",
    });
    return;
  }
};
const showSetScreenKey = ref(false);
const addScreenKey = () => {
  showSetScreenKey.value = true;
};

const exitScreenKey = () => {
  showSetScreenKey.value = false;
};
const currScreenNm = ref("");

const confirmScreenKey = () => {
  if (currScreenNm.value == "") {
    Swal.fire({
      title: "오류",
      text: "화면명을 입력하세요.",
      icon: "error",
      confirmButtonText: "확인",
    });
    return;
  }
  const nextKeyno = Math.max(
    ...ScreenKeyOrigin.value.map((item) => item.intScreenNo)
  );

  //comsole.log(nextKeyno);
  ScreenKeyOrigin.value.push({
    strScreenName: currScreenNm.value,
    intScreenNo: nextKeyno + 1,
    intScreenKeySeq: 1,
  });
  showSetScreenKey.value = false;
};
const clickedShowModifyButton = ref(-1);
const showModifyButton2 = ref(false);
const showModifyButton = (newValue, newValue2) => {
  showOtherScreen(newValue2);
  clickedShowModifyButton.value = newValue;
  showModifyButton2.value = true;
};
const showModifyScreenKey = ref(false);

const modifyScreenNo = ref("0");
const modifyScreenKey = (value, value2) => {
  showModifyScreenKey.value = true;
  currScreenNm.value = value;
  modifyScreenNo.value = value2;
};
const exitModifyScreenKey = () => {
  showModifyScreenKey.value = false;
};
const confirmModifyScreenKey = () => {
  const findit = ScreenKeyOrigin.value.find(
    (item) => item.intScreenNo == modifyScreenNo.value
  );
  findit.strScreenName = currScreenNm.value;
  showModifyScreenKey.value = false;
  showModifyButton2.value = false;
};
const deleteScreenKey = (newValue) => {
  Swal.fire({
    title: "확인",
    text: "정말 삭제하시겠습니까?",
    icon: "error",
    confirmButtonText: "확인",
    showCancelButton: true,
    cancelButtonText: "취소",
  }).then((result) => {
    if (result.isConfirmed) {
      ScreenKeyOrigin.value = ScreenKeyOrigin.value.filter(
        (item) => item.intScreenNo !== newValue
      );
      filteredtableList.value = filteredtableList.value.filter(
        (item) => item.intScreenNo !== newValue
      );
      tableList.value = tableList.value.filter(
        (item) => item.intScreenNo !== newValue
      );
      if (grid != null) {
        grid.removeAll();
      }
      showModifyButton2.value = false;
    }
  });
};

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
  //comsole.log(filteredtableList.value);
  //comsole.log(tableList.value);
  // if(JSON.stringify(confirmitem.value) === JSON.stringify(updatedList.value) ) {
  //   Swal.fire({
  //     title: '경고',
  //     text: '변경된 사항이 없습니다.',
  //     icon: 'warning',
  //     confirmButtonText: '확인'
  //   })
  //   return ;
  // }

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
        let res2;
        let res3;

        const ScreenKeyNms = ScreenKeyOrigin.value.map(
          (item) => item.strScreenName
        );
        const ScreenKeyNos = ScreenKeyOrigin.value.map(
          (item) => item.intScreenNo
        );
        res = await saveScreenKeys3(
          groupCd.value,
          nowStoreCd.value,
          posNo.value,
          nowStoreAreaCd.value,
          ScreenKeyNms.join(","),
          ScreenKeyNos.join(",")
        );
        //comsole.log(res);
        //comsole.log(tableList.value);
        const intScreenNos = tableList.value.map((item) => item.intScreenNo);
        const ids = tableList.value.map((item) =>
          typeof item.lngKeyscrNo == "string" ? 0 : item.lngKeyscrNo
        );
        const lngKeyColors = tableList.value.map((item) => item.lngKeyColor);
        const lngShapes = tableList.value.map((item) => item.lngShape);
        const strNames = tableList.value.map((item) => item.strName);
        const lngCounts = tableList.value.map((item) => item.lngCount);
        const xs = tableList.value.map((item) => {
          return item.x !== undefined && item.x !== null
            ? item.x * 125
            : item.lngX; // x가 없으면 lngX를 사용
        });
        const ys = tableList.value.map((item) => {
          return item.y !== undefined && item.y !== null
            ? item.y * 125
            : item.lngY; // x가 없으면 lngX를 사용
        });
        const ws = tableList.value.map((item) => {
          return item.w !== undefined && item.w !== null
            ? item.w * 120
            : item.lngWidth; // x가 없으면 lngX를 사용
        });

        const hs = tableList.value.map((item) => {
          return item.h !== undefined && item.h !== null
            ? item.h * 120
            : item.lngHeight; // x가 없으면 lngX를 사용
        });

        const newtableNm = tableList.value
          .filter((item) => item.lngKeyscrNo.toString().includes("new"))
          .map((item) => item.strName);
        const newtableCount = tableList.value
          .filter((item) => item.lngKeyscrNo.toString().includes("new"))
          .map((item) => item.lngCount);

        //comsole.log(intScreenNos);
        //comsole.log(ids);
        //comsole.log(lngKeyColors);
        //comsole.log(lngShapes);
        //comsole.log(strNames);
        //comsole.log(lngCounts);
        //comsole.log(xs);
        //comsole.log(ys);
        //comsole.log(ws);
        //comsole.log(hs);
        //comsole.log(newtableNm);
        //comsole.log(newtableCount);

        res2 = await saveTables(
          groupCd.value,
          nowStoreCd.value,
          posNo.value,
          nowStoreAreaCd.value,
          intScreenNos.join(","),
          ids.join(","),
          lngKeyColors.join(","),
          lngShapes.join(","),
          strNames.join(","),
          lngCounts.join(","),
          xs.join(","),
          ys.join(","),
          ws.join(","),
          hs.join(","),
          newtableNm.join(","),
          newtableCount.join(",")
        );

        //comsole.log(res2);
      } catch (error) {
        //comsole.log(error);
      } finally {
        store.state.loading = false;
        Swal.fire({
          title: "저장 되었습니다.",
          confirmButtonText: "확인",
        });

        searchButton().then(() => {
          //comsole.log(clickScreenButton.value);
          showOtherScreen(clickScreenButton.value);
        });
      }
    }
  });
};
const changetableProperty = (e) => {
  clickedtableCode.value;
  clickScreenButton.value;

  const findtableindex = filteredtableList.value.findIndex(
    (item) => item.id == clickedtableCode.value
  );
  if (findtableindex !== -1) {
    filteredtableList.value[findtableindex].strName = clickedtableNm.value;
    filteredtableList.value[findtableindex].lngCount = clickedtableSeats.value;
  }

  const tableItem = tableList.value.find(
    (item2) =>
      item2.intScreenNo == clickScreenButton.value &&
      item2.lngKeyscrNo == clickedtableCode.value
  );
  if (tableItem) {
    tableItem.lngCount = clickedtableSeats.value;
    tableItem.strName = clickedtableNm.value;
  }

  //comsole.log(filteredtableList.value);
  //comsole.log(tableList.value);

  grid.getGridItems().forEach((item) => {
    if (item.gridstackNode.id == clickedtableCode.value) {
      //comsole.log(item.gridstackNode.id);
      const gridItem = item.gridstackNode.el;
      //comsole.log(gridItem);
      const label = gridItem.querySelector(
        ".grid-stack-item-content"
      ).nextElementSibling;
      label.innerText = clickedtableNm.value;
    }
  });
};
const initAllTable = () => {
  Swal.fire({
    title: "테이블 초기화",
    text: "테이블을 초기화하시겠습니까?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "확인",
    cancelButtonText: "취소",
  }).then((result) => {
    if (result.isConfirmed) {
      if (grid != null) {
        grid.removeAll();
      }
      tableList.value = tableList.value.filter(
        (item) => item.intScreenNo !== clickScreenButton.value
      );
    }
  });
};

const copyButton = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "복사",
      text: "조회를 먼저 해주세요.",
      confirmButtonText: "확인",
    });
    return;
  }
  showPopup2.value = true;
};
let savedGrid = null;
onActivated(() => {
  if (savedGrid != null) {
    grid = GridStack.init({
      // DO NOT use grid.value = GridStack.init(), see above
      float: true,
      cellHeight: "auto",
      column: 90,
      resizable: { handles: "e,se" },
      minRow: 56,
      maxRow: 56,
    });
    grid.load(savedGrid);
    grid.on("dragstop", function (event, element) {
      const node = element.gridstackNode;
      info.value = `you just dragged node #${node.id} to ${node.x},${node.y} – good job!`;
      const findtableindex = filteredtableList.value.findIndex(
        (item) => item.id == node.id
      );
      filteredtableList.value[findtableindex].x = node.x;
      filteredtableList.value[findtableindex].y = node.y;

      grid.getGridItems().forEach((item) => {
        // 현재 그리드에 있는 모든 아이템들 순회
        if (item.gridstackNode.id !== node.id) {
          // 드래그된 요소를 제외한 나머지
          const itemIndex = filteredtableList.value.findIndex(
            (e) => e.id == item.gridstackNode.id
          );
          if (itemIndex !== -1) {
            // 밀린 요소의 새로운 위치 업데이트
            filteredtableList.value[itemIndex].x = item.gridstackNode.x;
            filteredtableList.value[itemIndex].y = item.gridstackNode.y;
          }
        }
      });
      filteredtableList.value.forEach((item) => {
        const tableItem = tableList.value.find(
          (item2) =>
            item2.intScreenNo == item.intScreenNo &&
            item2.lngKeyscrNo == item.lngKeyscrNo
        );
        if (tableItem) {
          Object.keys(item).forEach((key) => {
            if (key == "w") {
              tableItem["w"] = item["w"];
            } else if (key == "h") {
              tableItem["h"] = item["h"];
            } else if (key == "x") {
              tableItem["x"] = item["x"];
            } else if (key == "y") {
              tableItem["y"] = item["y"];
            } else {
              tableItem[key] = item[key];
            }
          });
        }
      });
      //comsole.log(tableList.value);
      const widgetElement = document.querySelector(`[gs-id="${node.id}"]`);
      if (widgetElement) {
        widgetElement.click(); // 클릭 이벤트 발생
      }
    });
    grid.on("resizestop", function (event, element) {
      const node = element.gridstackNode;
      info.value = `you just resized node #${node.id} to width: ${node.w}, height: ${node.h} – good job!`;
      // 리사이즈된 아이템의 정보 업데이트
      const findtableindex = filteredtableList.value.findIndex(
        (item) => item.id == node.id
      );
      if (findtableindex !== -1) {
        filteredtableList.value[findtableindex].w = node.w;
        filteredtableList.value[findtableindex].h = node.h;
      }

      grid.getGridItems().forEach((item) => {
        // 현재 그리드에 있는 모든 아이템들 순회
        if (item.gridstackNode.id !== node.id) {
          // 드래그된 요소를 제외한 나머지
          const itemIndex = filteredtableList.value.findIndex(
            (e) => e.id == item.gridstackNode.id
          );
          if (itemIndex !== -1) {
            // 밀린 요소의 새로운 위치 업데이트
            filteredtableList.value[itemIndex].x = item.gridstackNode.x;
            filteredtableList.value[itemIndex].y = item.gridstackNode.y;
          }
        }
      });
      filteredtableList.value.forEach((item) => {
        const tableItem = tableList.value.find(
          (item2) =>
            item2.intScreenNo == item.intScreenNo &&
            item2.lngKeyscrNo == item.lngKeyscrNo
        );
        if (tableItem) {
          Object.keys(item).forEach((key) => {
            if (key == "w") {
              tableItem["w"] = item["w"];
            } else if (key == "h") {
              tableItem["h"] = item["h"];
            } else if (key == "x") {
              tableItem["x"] = item["x"];
            } else if (key == "y") {
              tableItem["y"] = item["y"];
            } else {
              tableItem[key] = item[key];
            }

            //comsole.log(tableList.value);
          });
        }
        showOtherScreen(clickScreenButton.value);
      });
    });
  }
});

onDeactivated(() => {
  //comsole.log(grid);
  if (grid) {
    savedGrid = grid.save();
    grid.destroy(false);
  }
});
</script>
<style>
.grid-stack {
  background: #ffffff;
}

.grid-stack-item {
  position: relative;
  background-color: rgba(0, 0, 0, 0);
  /* 아이템 배경색 */
  width: 100%;
  height: 100%;
  overflow: hidden !important;
}

.grid-stack-item-content {
  width: 100% !important;
  height: 100% !important;
  position: absolute !important;
  top: 0 !important;
  /* 상단에서 0px 위치로 설정 */
  left: 0 !important;
  /* 좌측에서 0px 위치로 설정 */
  z-index: 50 !important;
  overflow: hidden !important;
  text-align: left;
}

.table_style {
  width: 900px;
  height: 600px !important;
  border: 1px solid #e4e4e4;
  border-radius: 10px;
  background-image: url("../../assets/tablegrid-bg.jpg");
  background-size: 106%;
  margin-right: 30px;
  background-repeat: no-repeat;
}

.diamond {
  position: absolute;
  z-index: 0;
  width: 100%;
  height: 100%;
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
}

.rectangle {
  width: 100%;
  height: 100%;
}

.circle {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.ellipse {
  border-radius: 30% / 60%;
}

.triangle {
  position: absolute;
  z-index: 0;
  width: 100%;
  height: 100%;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  /* 삼각형 */
}

/* 위치 정의 (gs-x) */
.gs-90 > .grid-stack-item[gs-x="1"] {
  left: 1.11%;
}

.gs-90 > .grid-stack-item[gs-x="2"] {
  left: 2.22%;
}

.gs-90 > .grid-stack-item[gs-x="3"] {
  left: 3.33%;
}

.gs-90 > .grid-stack-item[gs-x="4"] {
  left: 4.44%;
}

.gs-90 > .grid-stack-item[gs-x="5"] {
  left: 5.56%;
}

.gs-90 > .grid-stack-item[gs-x="6"] {
  left: 6.67%;
}

.gs-90 > .grid-stack-item[gs-x="7"] {
  left: 7.78%;
}

.gs-90 > .grid-stack-item[gs-x="8"] {
  left: 8.89%;
}

.gs-90 > .grid-stack-item[gs-x="9"] {
  left: 10%;
}

.gs-90 > .grid-stack-item[gs-x="10"] {
  left: 11.11%;
}

.gs-90 > .grid-stack-item[gs-x="11"] {
  left: 12.22%;
}

.gs-90 > .grid-stack-item[gs-x="12"] {
  left: 13.33%;
}

.gs-90 > .grid-stack-item[gs-x="13"] {
  left: 14.44%;
}

.gs-90 > .grid-stack-item[gs-x="14"] {
  left: 15.56%;
}

.gs-90 > .grid-stack-item[gs-x="15"] {
  left: 16.67%;
}

.gs-90 > .grid-stack-item[gs-x="16"] {
  left: 17.78%;
}

.gs-90 > .grid-stack-item[gs-x="17"] {
  left: 18.89%;
}

.gs-90 > .grid-stack-item[gs-x="18"] {
  left: 20%;
}

.gs-90 > .grid-stack-item[gs-x="19"] {
  left: 21.11%;
}

.gs-90 > .grid-stack-item[gs-x="20"] {
  left: 22.22%;
}

.gs-90 > .grid-stack-item[gs-x="21"] {
  left: 23.33%;
}

.gs-90 > .grid-stack-item[gs-x="22"] {
  left: 24.44%;
}

.gs-90 > .grid-stack-item[gs-x="23"] {
  left: 25.56%;
}

.gs-90 > .grid-stack-item[gs-x="24"] {
  left: 26.67%;
}

.gs-90 > .grid-stack-item[gs-x="25"] {
  left: 27.78%;
}

.gs-90 > .grid-stack-item[gs-x="26"] {
  left: 28.89%;
}

.gs-90 > .grid-stack-item[gs-x="27"] {
  left: 30%;
}

.gs-90 > .grid-stack-item[gs-x="28"] {
  left: 31.11%;
}

.gs-90 > .grid-stack-item[gs-x="29"] {
  left: 32.22%;
}

.gs-90 > .grid-stack-item[gs-x="30"] {
  left: 33.33%;
}

.gs-90 > .grid-stack-item[gs-x="31"] {
  left: 34.44%;
}

.gs-90 > .grid-stack-item[gs-x="32"] {
  left: 35.56%;
}

.gs-90 > .grid-stack-item[gs-x="33"] {
  left: 36.67%;
}

.gs-90 > .grid-stack-item[gs-x="34"] {
  left: 37.78%;
}

.gs-90 > .grid-stack-item[gs-x="35"] {
  left: 38.89%;
}

.gs-90 > .grid-stack-item[gs-x="36"] {
  left: 40%;
}

.gs-90 > .grid-stack-item[gs-x="37"] {
  left: 41.11%;
}

.gs-90 > .grid-stack-item[gs-x="38"] {
  left: 42.22%;
}

.gs-90 > .grid-stack-item[gs-x="39"] {
  left: 43.33%;
}

.gs-90 > .grid-stack-item[gs-x="40"] {
  left: 44.44%;
}

.gs-90 > .grid-stack-item[gs-x="41"] {
  left: 45.56%;
}

.gs-90 > .grid-stack-item[gs-x="42"] {
  left: 46.67%;
}

.gs-90 > .grid-stack-item[gs-x="43"] {
  left: 47.78%;
}

.gs-90 > .grid-stack-item[gs-x="44"] {
  left: 48.89%;
}

.gs-90 > .grid-stack-item[gs-x="45"] {
  left: 50%;
}

.gs-90 > .grid-stack-item[gs-x="46"] {
  left: 51.11%;
}

.gs-90 > .grid-stack-item[gs-x="47"] {
  left: 52.22%;
}

.gs-90 > .grid-stack-item[gs-x="48"] {
  left: 53.33%;
}

.gs-90 > .grid-stack-item[gs-x="49"] {
  left: 54.44%;
}

.gs-90 > .grid-stack-item[gs-x="50"] {
  left: 55.56%;
}

.gs-90 > .grid-stack-item[gs-x="51"] {
  left: 56.67%;
}

.gs-90 > .grid-stack-item[gs-x="52"] {
  left: 57.78%;
}

.gs-90 > .grid-stack-item[gs-x="53"] {
  left: 58.89%;
}

.gs-90 > .grid-stack-item[gs-x="54"] {
  left: 60%;
}

.gs-90 > .grid-stack-item[gs-x="55"] {
  left: 61.11%;
}

.gs-90 > .grid-stack-item[gs-x="56"] {
  left: 62.22%;
}

.gs-90 > .grid-stack-item[gs-x="57"] {
  left: 63.33%;
}

.gs-90 > .grid-stack-item[gs-x="58"] {
  left: 64.44%;
}

.gs-90 > .grid-stack-item[gs-x="59"] {
  left: 65.56%;
}

.gs-90 > .grid-stack-item[gs-x="60"] {
  left: 66.67%;
}

.gs-90 > .grid-stack-item[gs-x="61"] {
  left: 67.78%;
}

.gs-90 > .grid-stack-item[gs-x="62"] {
  left: 68.89%;
}

.gs-90 > .grid-stack-item[gs-x="63"] {
  left: 70%;
}

.gs-90 > .grid-stack-item[gs-x="64"] {
  left: 71.11%;
}

.gs-90 > .grid-stack-item[gs-x="65"] {
  left: 72.22%;
}

.gs-90 > .grid-stack-item[gs-x="66"] {
  left: 73.33%;
}

.gs-90 > .grid-stack-item[gs-x="67"] {
  left: 74.44%;
}

.gs-90 > .grid-stack-item[gs-x="68"] {
  left: 75.56%;
}

.gs-90 > .grid-stack-item[gs-x="69"] {
  left: 76.67%;
}

.gs-90 > .grid-stack-item[gs-x="70"] {
  left: 77.78%;
}

.gs-90 > .grid-stack-item[gs-x="71"] {
  left: 78.89%;
}

.gs-90 > .grid-stack-item[gs-x="72"] {
  left: 80%;
}

.gs-90 > .grid-stack-item[gs-x="73"] {
  left: 81.11%;
}

.gs-90 > .grid-stack-item[gs-x="74"] {
  left: 82.22%;
}

.gs-90 > .grid-stack-item[gs-x="75"] {
  left: 83.33%;
}

.gs-90 > .grid-stack-item[gs-x="76"] {
  left: 84.44%;
}

.gs-90 > .grid-stack-item[gs-x="77"] {
  left: 85.56%;
}

.gs-90 > .grid-stack-item[gs-x="78"] {
  left: 86.67%;
}

.gs-90 > .grid-stack-item[gs-x="79"] {
  left: 87.78%;
}

.gs-90 > .grid-stack-item[gs-x="80"] {
  left: 88.89%;
}

.gs-90 > .grid-stack-item[gs-x="81"] {
  left: 90%;
}

.gs-90 > .grid-stack-item[gs-x="82"] {
  left: 91.11%;
}

.gs-90 > .grid-stack-item[gs-x="83"] {
  left: 92.22%;
}

.gs-90 > .grid-stack-item[gs-x="84"] {
  left: 93.33%;
}

.gs-90 > .grid-stack-item[gs-x="85"] {
  left: 94.44%;
}

.gs-90 > .grid-stack-item[gs-x="86"] {
  left: 95.56%;
}

.gs-90 > .grid-stack-item[gs-x="87"] {
  left: 96.67%;
}

.gs-90 > .grid-stack-item[gs-x="88"] {
  left: 97.78%;
}

.gs-90 > .grid-stack-item[gs-x="89"] {
  left: 98.89%;
}

.gs-90 > .grid-stack-item[gs-x="90"] {
  left: 100%;
}

/* 너비 정의 (gs-w) */
.gs-90 > .grid-stack-item[gs-w="1"] {
  width: 1.11%;
}

.gs-90 > .grid-stack-item[gs-w="2"] {
  width: 2.22%;
}

.gs-90 > .grid-stack-item[gs-w="3"] {
  width: 3.33%;
}

.gs-90 > .grid-stack-item[gs-w="4"] {
  width: 4.44%;
}

.gs-90 > .grid-stack-item[gs-w="5"] {
  width: 5.56%;
}

.gs-90 > .grid-stack-item[gs-w="6"] {
  width: 6.67%;
}

.gs-90 > .grid-stack-item[gs-w="7"] {
  width: 7.78%;
}

.gs-90 > .grid-stack-item[gs-w="8"] {
  width: 8.89%;
}

.gs-90 > .grid-stack-item[gs-w="9"] {
  width: 10%;
}

.gs-90 > .grid-stack-item[gs-w="10"] {
  width: 11.11%;
}

.gs-90 > .grid-stack-item[gs-w="11"] {
  width: 12.22%;
}

.gs-90 > .grid-stack-item[gs-w="12"] {
  width: 13.33%;
}

.gs-90 > .grid-stack-item[gs-w="13"] {
  width: 14.44%;
}

.gs-90 > .grid-stack-item[gs-w="14"] {
  width: 15.56%;
}

.gs-90 > .grid-stack-item[gs-w="15"] {
  width: 16.67%;
}

.gs-90 > .grid-stack-item[gs-w="16"] {
  width: 17.78%;
}

.gs-90 > .grid-stack-item[gs-w="17"] {
  width: 18.89%;
}

.gs-90 > .grid-stack-item[gs-w="18"] {
  width: 20%;
}

.gs-90 > .grid-stack-item[gs-w="19"] {
  width: 21.11%;
}

.gs-90 > .grid-stack-item[gs-w="20"] {
  width: 22.22%;
}

.gs-90 > .grid-stack-item[gs-w="21"] {
  width: 23.33%;
}

.gs-90 > .grid-stack-item[gs-w="22"] {
  width: 24.44%;
}

.gs-90 > .grid-stack-item[gs-w="23"] {
  width: 25.56%;
}

.gs-90 > .grid-stack-item[gs-w="24"] {
  width: 26.67%;
}

.gs-90 > .grid-stack-item[gs-w="25"] {
  width: 27.78%;
}

.gs-90 > .grid-stack-item[gs-w="26"] {
  width: 28.89%;
}

.gs-90 > .grid-stack-item[gs-w="27"] {
  width: 30%;
}

.gs-90 > .grid-stack-item[gs-w="28"] {
  width: 31.11%;
}

.gs-90 > .grid-stack-item[gs-w="29"] {
  width: 32.22%;
}

.gs-90 > .grid-stack-item[gs-w="30"] {
  width: 33.33%;
}

.gs-90 > .grid-stack-item[gs-w="31"] {
  width: 34.44%;
}

.gs-90 > .grid-stack-item[gs-w="32"] {
  width: 35.56%;
}

.gs-90 > .grid-stack-item[gs-w="33"] {
  width: 36.67%;
}

.gs-90 > .grid-stack-item[gs-w="34"] {
  width: 37.78%;
}

.gs-90 > .grid-stack-item[gs-w="35"] {
  width: 38.89%;
}

.gs-90 > .grid-stack-item[gs-w="36"] {
  width: 40%;
}

.gs-90 > .grid-stack-item[gs-w="37"] {
  width: 41.11%;
}

.gs-90 > .grid-stack-item[gs-w="38"] {
  width: 42.22%;
}

.gs-90 > .grid-stack-item[gs-w="39"] {
  width: 43.33%;
}

.gs-90 > .grid-stack-item[gs-w="40"] {
  width: 44.44%;
}

.gs-90 > .grid-stack-item[gs-w="41"] {
  width: 45.56%;
}

.gs-90 > .grid-stack-item[gs-w="42"] {
  width: 46.67%;
}

.gs-90 > .grid-stack-item[gs-w="43"] {
  width: 47.78%;
}

.gs-90 > .grid-stack-item[gs-w="44"] {
  width: 48.89%;
}

.gs-90 > .grid-stack-item[gs-w="45"] {
  width: 50%;
}

.gs-90 > .grid-stack-item[gs-w="46"] {
  width: 51.11%;
}

.gs-90 > .grid-stack-item[gs-w="47"] {
  width: 52.22%;
}

.gs-90 > .grid-stack-item[gs-w="48"] {
  width: 53.33%;
}

.gs-90 > .grid-stack-item[gs-w="49"] {
  width: 54.44%;
}

.gs-90 > .grid-stack-item[gs-w="50"] {
  width: 55.56%;
}

.gs-90 > .grid-stack-item[gs-w="51"] {
  width: 56.67%;
}

.gs-90 > .grid-stack-item[gs-w="52"] {
  width: 57.78%;
}

.gs-90 > .grid-stack-item[gs-w="53"] {
  width: 58.89%;
}

.gs-90 > .grid-stack-item[gs-w="54"] {
  width: 60%;
}

.gs-90 > .grid-stack-item[gs-w="55"] {
  width: 61.11%;
}

.gs-90 > .grid-stack-item[gs-w="56"] {
  width: 62.22%;
}

.gs-90 > .grid-stack-item[gs-w="57"] {
  width: 63.33%;
}

.gs-90 > .grid-stack-item[gs-w="58"] {
  width: 64.44%;
}

.gs-90 > .grid-stack-item[gs-w="59"] {
  width: 65.56%;
}

.gs-90 > .grid-stack-item[gs-w="60"] {
  width: 66.67%;
}

.gs-90 > .grid-stack-item[gs-w="61"] {
  width: 67.78%;
}

.gs-90 > .grid-stack-item[gs-w="62"] {
  width: 68.89%;
}

.gs-90 > .grid-stack-item[gs-w="63"] {
  width: 70%;
}

.gs-90 > .grid-stack-item[gs-w="64"] {
  width: 71.11%;
}

.gs-90 > .grid-stack-item[gs-w="65"] {
  width: 72.22%;
}

.gs-90 > .grid-stack-item[gs-w="66"] {
  width: 73.33%;
}

.gs-90 > .grid-stack-item[gs-w="67"] {
  width: 74.44%;
}

.gs-90 > .grid-stack-item[gs-w="68"] {
  width: 75.56%;
}

.gs-90 > .grid-stack-item[gs-w="69"] {
  width: 76.67%;
}

.gs-90 > .grid-stack-item[gs-w="70"] {
  width: 77.78%;
}

.gs-90 > .grid-stack-item[gs-w="71"] {
  width: 78.89%;
}

.gs-90 > .grid-stack-item[gs-w="72"] {
  width: 80%;
}

.gs-90 > .grid-stack-item[gs-w="73"] {
  width: 81.11%;
}

.gs-90 > .grid-stack-item[gs-w="74"] {
  width: 82.22%;
}

.gs-90 > .grid-stack-item[gs-w="75"] {
  width: 83.33%;
}

.gs-90 > .grid-stack-item[gs-w="76"] {
  width: 84.44%;
}

.gs-90 > .grid-stack-item[gs-w="77"] {
  width: 85.56%;
}

.gs-90 > .grid-stack-item[gs-w="78"] {
  width: 86.67%;
}

.gs-90 > .grid-stack-item[gs-w="79"] {
  width: 87.78%;
}

.gs-90 > .grid-stack-item[gs-w="80"] {
  width: 88.89%;
}

.gs-90 > .grid-stack-item[gs-w="81"] {
  width: 90%;
}

.gs-90 > .grid-stack-item[gs-w="82"] {
  width: 91.11%;
}

.gs-90 > .grid-stack-item[gs-w="83"] {
  width: 92.22%;
}

.gs-90 > .grid-stack-item[gs-w="84"] {
  width: 93.94%;
}

.gs-90 > .grid-stack-item[gs-w="85"] {
  width: 94.44%;
}

.gs-90 > .grid-stack-item[gs-w="86"] {
  width: 95.56%;
}

.gs-90 > .grid-stack-item[gs-w="87"] {
  width: 96.67%;
}

.gs-90 > .grid-stack-item[gs-w="88"] {
  width: 97.78%;
}

.gs-90 > .grid-stack-item[gs-w="89"] {
  width: 98.89%;
}

.gs-90 > .grid-stack-item[gs-w="90"] {
  width: 100%;
}
</style>
