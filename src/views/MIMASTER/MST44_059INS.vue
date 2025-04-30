<template>
  <div class="flex justify-between items-center w-full overflow-y-hidden">
    <PageName></PageName>
    <div class="flex justify-center mr-9 space-x-2 pr-5">
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
      :showPayType="true"
      @storeNm="handlestoreNm"
      @update:ischanged="handleinitAll"
      @update:ischanged2="searchinit"
      @updatePaymentType="updatePaymentType"></PickStore>
  </div>
  <div class="z-50">
    <DupliPopUp
      :isVisible="showPopup2"
      @close="showPopup2 = false"
      :storeCd="nowStoreCd"
      :poskiosk="'getStoreAndPosList'"
      :storeNm="clickedStoreNm"
      :areaCd="nowStoreAreaCd"
      :posNo="posNo"
      :screenType="currentpaymentCd"
      :screenList="screenList"
      :progname="'MST01_011INS_VUE'"
      :dupliapiname="'DUPLIFUNCKEY'"
      :progid="1"
      :naming="'POS번호'"
      :naming2="'기능키'">
    </DupliPopUp>
  </div>

  <div
    v-if="changeScreenKey"
    class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
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
            v-model="currentscreenKeyNm" />
        </div>
      </div>

      <div
        v-if="currentpaymentCd == 3"
        class="flex flex-col justify-start h-12">
        <div>
          <p>화면키 유형</p>
        </div>
        <div class="h-full w-full rounded-lg">
          <select
            name=""
            id=""
            class="border border-gray-400 pl-1 h-full w-full rounded-lg"
            v-model="currentProduct"
            :disabled="showEditProduct">
            <option :value="0">기본</option>
            <option :value="1">품목할인</option>
          </select>
        </div>
      </div>
      <div
        v-if="currentpaymentCd == 3"
        class="flex flex-col mt-5 justify-start items-start">
        <div>※ 화면키는 기본 또는 품목할인으로 유형을 선택할 수 있습니다.</div>
        <div>※ 품목할인은 매장 당 하나의 화면키만 설정할 수 있습니다.</div>
        <div>
          ※ 화면키 유형이 품목할인인 경우, 결제코드를 등록하거나 수정할 수
          없으며, 품목할인 결제코드가 자동으로 노출됩니다.
        </div>
      </div>
      <div class="flex justify-center space-x-3 w-full h-16">
        <button
          @click="confirmScreenKey()"
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
    v-if="addscreenKey"
    class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-white p-6 rounded shadow-lg w-[25%] h-[40%]">
      <h2 class="text-lg font-bold">화면키 추가</h2>
      <div class="flex flex-col justify-start h-12">
        <div>
          <p>화면키명</p>
        </div>
        <div class="h-full w-full rounded-sm">
          <input
            type="text"
            class="border border-gray-400 pl-1 h-14 w-full rounded-sm"
            v-model="currentscreenKeyNm" />
        </div>
      </div>
      <div class="flex justify-center space-x-3 w-full h-16 mt-28">
        <button
          @click="confirmaddScreenKey()"
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

  <div class="grid grid-rows-1 grid-cols-[1fr,1.5fr] h-5/6 w-full mt-5">
    <div class="flex flex-col w-[95%] h-5/6">
      <div
        class="flex justify-between mt-0 ml-10 w-full border-b border-b-gray-300">
        <div class="font-bold text-xl w-auto">기능키 목록</div>
      </div>
      <div class="h-full z-30" v-show="currentMenu == false">
        <div
          class="mt-3 ml-10 grid grid-cols-[1fr,3fr] grid-rows-2 gap-0 w-full">
          <div class="customtableIndex border border-gray-400 rounded-l-lg">
            기능키코드/명
          </div>
          <div class="px-1 py-1 border border-gray-300 rounded-r-lg">
            <input
              type="text"
              class="border w-full h-full px-1 border-gray-400 rounded-lg"
              @input="searchAmountList" />
          </div>
        </div>
        <div class="ml-10 mt-0 w-full h-full z-30">
          <Realgrid
            class="w-full h-full"
            :progname="'MST44_043INS_VUE'"
            :progid="1"
            :rowData="rowData"
            :showGrid="showGrid"
            :showCheckBar="false"
            :initFocus="initFocus"
            @selcetedrowData="selcetedrowData"
            :searchWord="searchword1"
            :searchColId="'lngDCode,strDName'"></Realgrid>
        </div>
      </div>
    </div>
    <div class="h-full w-full">
      <span class="flex justify-between items-start h-[5%] w-full z-40">
        <h1 class="font-bold text-xl z-40 ml-20">
          {{ currentpaymentType }} 기능키 설정
        </h1>
        <span class="flex space-x-3 ml-32 pl-56 items-center"
          >순서변경 &nbsp; &nbsp;<label class="z-40"
            ><input
              type="radio"
              :value="false"
              v-model="changeMode" />교체하기 </label
          ><label class="z-40"
            ><input
              type="radio"
              name="changingMode"
              :value="true"
              v-model="changeMode" />밀어내기</label
          ><button class="whitebutton z-40" @click.stop="deletekey">
            삭제
          </button></span
        >
      </span>
      <div
        v-if="showOtherKeys == false"
        class="grid grid-rows-[1fr,4fr] grid-cols-1 mt-5 w-full h-[80%] z-20">
        <div
          class="flex h-full w-full items-start justify-center"
          v-show="afterSearch">
          <VueDraggableNext
            v-model="subsubKeyList1"
            :move="onMove"
            @end="onEnd"
            animation="200"
            class="grid grid-cols-5 grid-rows-1 mt-8 ml-6 w-[87%] h-[50%] gap-1">
            <div
              v-for="(item, index) in subsubKeyList1"
              class="custom-grid-style"
              :class="{
                '!bg-orange-500 !border-blue-700':
                  clickedKey1 == index && clickedScreenOrMenu == true,
              }"
              @click="
                saveMenuKeyposition1(index, item.lngDCode),
                  (clickedKey1 = index),
                  clickedMenukeys()
              ">
              <span
                class="flex flex-col items-center justify-center w-full h-full rounded-lg"
                ><span class="flex justify-center items-center">{{
                  item ? item.lngDCode : ""
                }}</span
                ><span class="flex justify-center items-center">{{
                  item ? item.strDName : ""
                }}</span></span
              >
            </div>
          </VueDraggableNext>
        </div>

        <div
          v-show="showOtherKeys == false"
          class="flex flex-col mt-4 w-11/12 h-5/6">
          <h1 class="font-bold text-xl ml-20 w-auto flex justify-start">
            기능 선택키 설정
          </h1>
          <div class="flex w-[99%] h-full ml-10">
            <VueDraggableNext
              v-model="subsubKeyList2"
              :move="onMove2"
              @end="onEnd2"
              animation="200"
              class="grid grid-cols-5 grid-rows-6 ml-10 mt-4 w-full h-full gap-1">
              <div
                v-for="(item, index) in subsubKeyList2"
                class="custom-grid-style"
                :class="{
                  '!bg-orange-500 !border-blue-700':
                    clickedKey2 == index && clickedScreenOrMenu == true,
                }"
                @click="
                  item.disable != true &&
                    (saveMenuKeyposition2(index),
                    (clickedKey2 = index),
                    clickedMenukeys())
                ">
                <span
                  class="flex flex-col items-center justify-center w-full h-full rounded-lg"
                  :class="{ '!bg-gray-300': item.disable == true }"
                  ><span class="flex justify-center items-center">{{
                    item ? item.lngDCode : ""
                  }}</span
                  ><span class="flex justify-center items-center">{{
                    item ? item.strDName : ""
                  }}</span></span
                >
              </div>
            </VueDraggableNext>
          </div>
        </div>
      </div>

      <div
        v-if="showOtherKeys == true"
        class="grid grid-rows-[1fr,4fr] grid-cols-1 mt-5 w-full h-[80%] z-20">
        <div
          class="flex h-full w-full items-start justify-center"
          v-show="afterSearch">
          <VueDraggableNext
            v-model="subsubKeyList3"
            :move="onMove"
            @end="onEnd3"
            animation="200"
            class="grid grid-cols-5 grid-rows-1 mt-8 ml-6 w-[87%] h-[50%] gap-1">
            <div
              v-for="(item, index) in subsubKeyList3"
              class="custom-grid-style"
              :class="{
                '!bg-orange-500 !border-blue-700':
                  clickedKey1 == index && clickedScreenOrMenu == true,
              }"
              @click="
                saveMenuKeyposition3(index, item.lngDCode),
                  (clickedKey1 = index),
                  clickedMenukeys2()
              ">
              <span
                class="flex flex-col items-center justify-center w-full h-full rounded-lg"
                ><span class="flex justify-center items-center">{{
                  item ? item.lngDCode : ""
                }}</span
                ><span class="flex justify-center items-center">{{
                  item ? item.strDName : ""
                }}</span></span
              >
            </div>
          </VueDraggableNext>
        </div>

        <div
          v-show="showOtherKeys == true"
          class="flex flex-col mt-4 ml-10 w-11/12 h-5/6">
          <h1 class="font-bold text-xl w-auto flex justify-start ml-10">
            기능 선택키 설정
          </h1>
          <div class="flex w-[99%] h-full">
            <VueDraggableNext
              v-model="subsubKeyList4"
              :move="onMove2"
              @end="onEnd4"
              animation="200"
              class="grid grid-cols-5 grid-rows-6 ml-10 mt-4 w-full h-full gap-1">
              <div
                v-for="(item, index) in subsubKeyList4"
                class="custom-grid-style"
                :class="{
                  '!bg-orange-500 !border-blue-700':
                    clickedKey2 == index && clickedScreenOrMenu == true,
                }"
                @click="
                  item.disable != true &&
                    (saveMenuKeyposition4(index),
                    (clickedKey2 = index),
                    clickedMenukeys2())
                ">
                <span
                  class="flex flex-col items-center justify-center w-full h-full rounded-lg"
                  :class="{ '!bg-gray-300': item.disable == true }"
                  ><span class="flex justify-center items-center">{{
                    item ? item.lngDCode : ""
                  }}</span
                  ><span class="flex justify-center items-center">{{
                    item ? item.strDName : ""
                  }}</span></span
                >
              </div>
            </VueDraggableNext>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  getAllScreenList,
  getFuncKeyList,
  getFuncKeys,
  saveAllFuncKey2,
} from "@/api/master";
import Realgrid from "@/components/realgrid.vue";
import Swal from "sweetalert2";
import { onMounted, ref, watch } from "vue";
import { VueDraggableNext } from "vue-draggable-next";
import { useStore } from "vuex";

import DupliPopUp from "@/components/dupliPopUp.vue";
import PickStore from "@/components/pickStore.vue";
import { insertPageLog } from "@/customFunc/customFunc";
import PageName from "@/components/pageName.vue";

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
});

// 더미 데이터
const items = ref([]);
const initFocus = ref(false);
const ScreenKeyOrigin = ref([]);
const clickedFuncSelection = ref(false);
const clickedFuncSelection2 = ref(false);
const ScreenKeys = ref([]);
const currentMenuorTLU = ref(false);
const searchword1 = ref();
const searchword3 = ref();
const forsearchMain = ref("0");
const forsearchSub = ref("0");
const addscreenKey = ref(false);
const searchWord = ref("");
const searchWord2 = ref("");
const afterSearch2 = ref(false);
// 드래그 가능한 요소를 설정하는 메서드
const currentsubPage = ref(1);
const changeMode = ref(false);

const clickedKey1 = ref();
const clickedKey2 = ref();
const subsubKeyList3 = ref();
const subsubKeyList4 = ref();
const confirmitem4 = ref();
const clickedStoreNm = ref();
const handlestoreNm = (newData) => {
  clickedStoreNm.value = newData;
};
const showPopup2 = ref(false);
const showChangeScreenKey = ref(false);
const confirmitem1 = ref([]);
const currentscreenKeyNm = ref("");
const maxSubCode = ref();
const posNo = ref();
const changeScreenKey = ref(false);
const currmenuKeyPage = ref(1);
const AllscreenKeyPage = ref(1);

const currentMenu = ref(false);

onMounted(async () => {
  const res4 = await getFuncKeyList();
  //comsole.log(res4);
  commonKeyList.value = res4.data.FuncKeyList;
  commonKeyList.value = commonKeyList.value.map((item) => {
    return {
      ...item,
      add: "선택",
    };
  });
  rowData.value = [...commonKeyList.value];
  //comsole.log(commonKeyList.value);
});
const copyButton = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고.",
      text: "조회를 먼저 해주세요",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  showPopup2.value = true;
};

const updateMenuKey = ref(false);

const nowStoreAreaCd = ref();
const handleStoreAreaCd = (newValue) => {
  nowStoreAreaCd.value = newValue;
  //comsole.log(nowStoreAreaCd.value);
};

const nowStoreCd = ref();
const afterCategory = ref(false);
const handleStoreCd = async (newValue) => {
  if (newValue == "0") {
    afterSearch.value = false;
  }
  nowStoreCd.value = newValue;
};
const Category = ref([]);

const MenuGroup = ref([]);
const confirmitem2 = ref([]);
const confirmitem3 = ref([]);
const SubMenuGroup = ref([]);
const rowData = ref([]);

const store = useStore();
const currentProduct = ref("0");
const showEditProduct = ref(false);
const userData = store.state.userData;
const groupCd = ref(userData.lngStoreGroup);
const modified = ref(false);
const afterSearch = ref(false);
const commonKeyList = ref([]);
const KeyList = ref([]);
const subKeyList1 = ref([]);
const subsubKeyList1 = ref([]);
const subsubKeyList2 = ref([]);
const subKeyList8 = ref([]);
const screenList = ref([]);
const clickedScreenOrMenu = ref(false);
const TLUList = ref([]);
const clickedScreenNo = ref();
const searchButton = async () => {
  changeMode.value = false;
  Category.value = [];
  items.value = [];

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
    const res4 = await getFuncKeys(
      groupCd.value,
      nowStoreCd.value,
      nowStoreAreaCd.value,
      posNo.value
    );
    KeyList.value = res4.data.FuncKeys;

    //comsole.log(KeyList.value);
    const res2 = await getAllScreenList(
      groupCd.value,
      nowStoreCd.value,
      nowStoreAreaCd.value,
      posNo.value
    );
    screenList.value = res2.data.ALLScreenList;
    //comsole.log(screenList.value);
    //comsole.log(KeyList.value);

    AllscreenKeyPage.value = Math.ceil(ScreenKeyOrigin.value.length / 4);
  } catch (error) {
    afterSearch.value = false;
  } finally {
    //comsole.log(KeyList.value);
    if (
      KeyList.value == null ||
      KeyList.value == {} ||
      KeyList.value.length == 0
    ) {
      KeyList.value = [
        {
          intKeySeq: 1,
          lngKeyNo1: 0,
          lngKeyNo2: 0,
          lngKeyNo3: 0,
          lngKeyNo4: 0,
          lngKeyNo5: 0,
          lngKeyNo6: 0,
          lngKeyNo7: 0,
          lngKeyNo8: 0,
          lngKeyNo9: 0,
          lngKeyNo10: 0,
          lngKeyNo11: 0,
          lngKeyNo12: 0,
          lngKeyNo13: 0,
          lngKeyNo14: 0,
          lngKeyNo15: 0,
          lngKeyNo16: 0,
          lngKeyNo17: 0,
          lngKeyNo18: 0,
          lngKeyNo19: 0,
        },
        {
          intKeySeq: 8,
          lngKeyNo1: 0,
          lngKeyNo2: 0,
          lngKeyNo3: 0,
          lngKeyNo4: 0,
          lngKeyNo5: 0,
          lngKeyNo6: 0,
          lngKeyNo7: 0,
          lngKeyNo8: 0,
          lngKeyNo9: 0,
          lngKeyNo10: 0,
          lngKeyNo11: 0,
          lngKeyNo12: 0,
          lngKeyNo13: 0,
          lngKeyNo14: 0,
          lngKeyNo15: 0,
          lngKeyNo16: 0,
          lngKeyNo17: 0,
          lngKeyNo18: 0,
          lngKeyNo19: 0,
        },
      ];
    }
    subKeyList1.value = Object.keys(KeyList.value[0]).reduce((result, key) => {
      //comsole.log(key);
      if (key == "intKeySeq") {
        result[key] = KeyList.value[0][key];
        return result;
      }
      const keyValue = KeyList.value[0][key];
      const mappeditem = commonKeyList.value.find(
        (item) => item.lngDCode == keyValue
      );

      result[key] = {
        ...mappeditem,
      };

      return result;
    }, {});
    //comsole.log(subKeyList1.value);
    const keysToExtract = [
      "lngKeyNo1",
      "lngKeyNo2",
      "lngKeyNo3",
      "lngKeyNo4",
      "lngKeyNo5",
    ]; // 뽑고 싶은 속성들
    subsubKeyList1.value = Object.keys(subKeyList1.value).reduce((acc, key) => {
      if (keysToExtract.includes(key)) {
        acc[key] = subKeyList1.value[key];
      }
      return acc;
    }, {});

    const keysToExtract2 = [
      "lngKeyNo6",
      "lngKeyNo7",
      "lngKeyNo8",
      "lngKeyNo9",
      "lngKeyNo10",
      "lngKeyNo11",
      "lngKeyNo12",
      "lngKeyNo13",
      "lngKeyNo14",
      "lngKeyNo15",
      "lngKeyNo16",
      "lngKeyNo17",
      "lngKeyNo18",
      "lngKeyNo19",
    ]; // 뽑고 싶은 속성들
    subsubKeyList2.value = Object.keys(subKeyList1.value).reduce((acc, key) => {
      if (keysToExtract2.includes(key)) {
        acc[key] = subKeyList1.value[key];
      }
      return acc;
    }, {});

    subsubKeyList2.value.lngKeyNo20 = { disable: true };
    subsubKeyList1.value = Object.values(subsubKeyList1.value);
    subsubKeyList2.value = Object.values(subsubKeyList2.value);

    // asdf
    subKeyList8.value = Object.keys(KeyList.value[1]).reduce((result, key) => {
      //comsole.log(key);
      if (key == "intKeySeq") {
        result[key] = KeyList.value[1][key];
        return result;
      }
      const keyValue = KeyList.value[1][key];
      const mappeditem = commonKeyList.value.find(
        (item) => item.lngDCode == keyValue
      );

      result[key] = {
        ...mappeditem,
      };

      return result;
    }, {});
    //comsole.log(subKeyList8.value);

    subsubKeyList3.value = Object.keys(subKeyList8.value).reduce((acc, key) => {
      if (keysToExtract.includes(key)) {
        acc[key] = subKeyList8.value[key];
      }
      return acc;
    }, {});

    subsubKeyList4.value = Object.keys(subKeyList8.value).reduce((acc, key) => {
      if (keysToExtract2.includes(key)) {
        acc[key] = subKeyList8.value[key];
      }
      return acc;
    }, {});

    subsubKeyList4.value.lngKeyNo20 = { disable: true };
    subsubKeyList3.value = Object.values(subsubKeyList3.value);
    subsubKeyList4.value = Object.values(subsubKeyList4.value);
    store.state.loading = false; // 로딩 상태 종료
    modified.value = false;
    afterCategory.value = false;
    afterSearch.value = true;
    clickedKey1.value = -1;
    clickedKey2.value = -1;
    initFocus.value = !initFocus.value;
  }
  confirmitem1.value = JSON.parse(JSON.stringify(subsubKeyList1.value));
  confirmitem2.value = JSON.parse(JSON.stringify(subsubKeyList2.value));
  confirmitem3.value = JSON.parse(JSON.stringify(subsubKeyList3.value));
  confirmitem4.value = JSON.parse(JSON.stringify(subsubKeyList4.value));
  calculateMaxSubCode();
};
const filteredSubMenuGroup = ref([]);

watch(forsearchSub, (newValue) => {
  searchAmountList3();
});
const clickedintScreenNo = ref();
const calculateMaxSubCode = () => {
  maxSubCode.value = Math.max(
    ...Category.value
      .filter((item) => item.SubCategory && item.SubCategory.length > 0)
      .flatMap((item) => item.SubCategory.map((sub) => Number(sub.SubCode)))
  );
};
const showKeys = (value) => {
  if (clickedintScreenNo.value != value) {
    currmenuKeyPage.value = 1;
  }
  clickedintScreenNo.value = value;
  const thisProduct = ScreenKeyOrigin.value.filter(
    (item) => item.itemDiscYn == 1 && item.intScreenNo == value
  ).length;
  if (thisProduct > 0) {
    clickedRealIndex.value = "";
    items.value = Array.from({ length: 30 }, (_, index) => ({
      intKeySeq: index + 1, // 인덱스에 1을 더하여 값 설정
      itemDiscYn: 1,
    }));
  } else {
    items.value = Array.from({ length: 30 }, (_, index) => ({
      intKeySeq: index + 1, // 인덱스에 1을 더하여 값 설정
      itemDiscYn: 0,
    }));
  }

  KeyList.value
    .filter((item) => item.intScreenNo == value)
    .forEach((item) => {
      const position = item.intKeySeq - (currmenuKeyPage.value - 1) * 30 - 1;
      if (position >= 0 && position < 30) {
        items.value[position] = item;
      }
    });

  afterSearch2.value = true;
};
watch(ScreenKeys, (newvalue) => {
  AllscreenKeyPage.value = Math.floor(ScreenKeyOrigin.value.length / 4) + 1;
});

let targetItemIndex2;
const onMove = (evt) => {
  // 예: 드래그 중 이동할 때의 조건 등을 설정할 수 있음
  if (changeMode.value == false) {
    targetItemIndex2 = Array.from(evt.from.children).indexOf(evt.related);
    //comsole.log(targetItemIndex2);
    return false;
  } else {
    return true;
  }
};
const onMove2 = (evt) => {
  // 예: 드래그 중 이동할 때의 조건 등을 설정할 수 있음
  targetItemIndex2 = Array.from(evt.from.children).indexOf(evt.related);
  if (changeMode.value == false) {
    //comsole.log(targetItemIndex2);
    return false;
  } else {
    //comsole.log(targetItemIndex2);
    //comsole.log(evt.draggedContext.index);
    if (
      targetItemIndex2 == undefined ||
      targetItemIndex2 == 14 ||
      evt.draggedContext.index == 14
    ) {
      return false;
    }
    return true;
  }
};
let targetItemIndex3;
let dupliScreenKeyOrigin;

const onMove3 = (evt) => {
  // 예: 드래그 중 이동할 때의 조건 등을 설정할 수 있음
  targetItemIndex3 = Array.from(evt.from.children).indexOf(evt.related);

  dupliScreenKeyOrigin = [...ScreenKeyOrigin.value];
  //comsole.log(dupliScreenKeyOrigin);
  return true;
};
const clickedMove = ref(false);
const onEnd = (evt) => {
  // Swap을 처리할 조건
  if (changeMode.value === false) {
    const oldIndex = evt.oldIndex; // 드래그된 아이템의 기존 인덱스
    //comsole.log(subsubKeyList1.value);
    const swappedItems = [...subsubKeyList1.value]; // items를 복사
    //comsole.log(oldIndex);
    //comsole.log(targetItemIndex2);
    const temp = swappedItems[oldIndex];

    swappedItems[oldIndex] = swappedItems[targetItemIndex2];

    swappedItems[targetItemIndex2] = temp;

    //comsole.log(swappedItems);
    // 배열을 업데이트
    //   items.value = swappedItems;

    subsubKeyList1.value = swappedItems.map((item, index) => ({
      ...item, // 기존 객체의 다른 속성 유지
      intKeySeq: index + 1, // 배열 순서대로 intKeySeq 재정렬
    }));
  } else {
    updateMenuKey.value = true;
    subsubKeyList1.value = subsubKeyList1.value.map((item, index) => ({
      ...item, // 기존 객체의 다른 속성 유지
      intKeySeq: index + 1, // 배열 순서대로 intKeySeq 재정렬
    }));
  }
  clickedKey1.value = targetItemIndex2;
  //comsole.log("subsubKeyList1:", subsubKeyList1.value);
};

const onEnd2 = (evt) => {
  // Swap을 처리할 조건
  //comsole.log(evt.oldIndex);
  if (
    evt.oldIndex == 14 ||
    targetItemIndex2 == undefined ||
    targetItemIndex2 == 14
  ) {
    return;
  }
  if (changeMode.value === false) {
    const oldIndex = evt.oldIndex; // 드래그된 아이템의 기존 인덱스
    //comsole.log(subsubKeyList1.value);
    const swappedItems = [...subsubKeyList2.value]; // items를 복사
    //comsole.log(oldIndex);
    //comsole.log(targetItemIndex2);
    const temp = swappedItems[oldIndex];

    swappedItems[oldIndex] = swappedItems[targetItemIndex2];

    swappedItems[targetItemIndex2] = temp;

    //comsole.log(swappedItems);
    // 배열을 업데이트
    //   items.value = swappedItems;

    subsubKeyList2.value = swappedItems.map((item, index) => ({
      ...item, // 기존 객체의 다른 속성 유지
      intKeySeq: index + 1, // 배열 순서대로 intKeySeq 재정렬
    }));
  } else {
    updateMenuKey.value = true;
    subsubKeyList2.value = subsubKeyList2.value.map((item, index) => ({
      ...item, // 기존 객체의 다른 속성 유지
      intKeySeq: index + 1, // 배열 순서대로 intKeySeq 재정렬
    }));
  }
  clickedKey2.value = targetItemIndex2;
  //comsole.log("subsubKeyList2:", subsubKeyList2.value);
};
const onEnd3 = (evt) => {
  if (
    evt.oldIndex == 14 ||
    targetItemIndex2 == undefined ||
    targetItemIndex2 == 14
  ) {
    return;
  }
  if (changeMode.value === false) {
    const oldIndex = evt.oldIndex; // 드래그된 아이템의 기존 인덱스

    const swappedItems = [...subsubKeyList3.value]; // items를 복사
    //comsole.log(oldIndex);
    //comsole.log(targetItemIndex2);
    const temp = swappedItems[oldIndex];

    swappedItems[oldIndex] = swappedItems[targetItemIndex2];

    swappedItems[targetItemIndex2] = temp;

    //comsole.log(swappedItems);
    // 배열을 업데이트
    //   items.value = swappedItems;

    subsubKeyList3.value = swappedItems.map((item, index) => ({
      ...item, // 기존 객체의 다른 속성 유지
      intKeySeq: index + 1, // 배열 순서대로 intKeySeq 재정렬
    }));
  } else {
    updateMenuKey.value = true;
    subsubKeyList3.value = subsubKeyList3.value.map((item, index) => ({
      ...item, // 기존 객체의 다른 속성 유지
      intKeySeq: index + 1, // 배열 순서대로 intKeySeq 재정렬
    }));
  }
  clickedKey1.value = targetItemIndex2;
  //comsole.log("subsubKeyList3:", subsubKeyList3.value);
};

const onEnd4 = (evt) => {
  if (
    evt.oldIndex == 14 ||
    targetItemIndex2 == undefined ||
    targetItemIndex2 == 14
  ) {
    return;
  }
  if (changeMode.value === false) {
    const oldIndex = evt.oldIndex; // 드래그된 아이템의 기존 인덱스

    const swappedItems = [...subsubKeyList4.value]; // items를 복사
    //comsole.log(oldIndex);
    //comsole.log(targetItemIndex2);
    const temp = swappedItems[oldIndex];

    swappedItems[oldIndex] = swappedItems[targetItemIndex2];

    swappedItems[targetItemIndex2] = temp;

    subsubKeyList4.value = swappedItems.map((item, index) => ({
      ...item, // 기존 객체의 다른 속성 유지
      intKeySeq: index + 1, // 배열 순서대로 intKeySeq 재정렬
    }));
  } else {
    updateMenuKey.value = true;
    subsubKeyList4.value = subsubKeyList4.value.map((item, index) => ({
      ...item, // 기존 객체의 다른 속성 유지
      intKeySeq: index + 1, // 배열 순서대로 intKeySeq 재정렬
    }));
  }
  clickedKey2.value = targetItemIndex2;
  //comsole.log("subsubKeyList4:", subsubKeyList4.value);
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
  if (
    JSON.stringify(confirmitem1.value) ==
      JSON.stringify(subsubKeyList1.value) &&
    JSON.stringify(confirmitem2.value) ==
      JSON.stringify(subsubKeyList2.value) &&
    JSON.stringify(confirmitem3.value) == JSON.stringify(subKeyList8.value)
  ) {
    Swal.fire({
      title: "경고",
      text: "변경된 사항이 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
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
      const lngDCodes = subsubKeyList1.value.map((item) => item.lngDCode);
      const lngDCodes2 = subsubKeyList2.value.map((item) => item.lngDCode);
      const lngDCodes3 = subsubKeyList3.value.map((item) => item.lngDCode);
      const lngDCodes4 = subsubKeyList4.value.map((item) => item.lngDCode);
      //comsole.log(lngDCodes.join(",") + "," + lngDCodes2.join(","));
      //comsole.log(lngDCodes3.join(",") + "," + lngDCodes4.join(","));

      try {
        const res2 = await saveAllFuncKey2(
          groupCd.value,
          nowStoreCd.value,
          nowStoreAreaCd.value,
          posNo.value,
          lngDCodes.join(",") + "," + lngDCodes2.join(","),
          lngDCodes3.join(",") + "," + lngDCodes4.join(",")
        );
        //comsole.log(res2);
      } catch (error) {
        console.error("API 호출 중 오류 발생:", error);
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

let dataProvider;

// onMounted(() => {
//   showMenuKeys();
// });

// const showMenuKeys = () => {};

const showOtherKeys = ref(false);
let dataProvider2;
const clickedTLUCD = ref();
const clickedTLUNM = ref();
const clickedstrName = ref();
const clickedCode = ref();
const selcetedrowData = (newValue) => {
  //comsole.log(newValue);
  clickedstrName.value = newValue[1];
  clickedCode.value = newValue[0];
  addKey();
};

const searchAmountList = (e) => {
  searchword1.value = e.target.value;
};
const searchAmountList3 = (e) => {
  if (currentMenuorTLU.value == false) {
    const filteredList = commonKeyList.value.filter(
      (item) =>
        (forsearchMain.value === "0" ||
          item.majorGroupCd === forsearchMain.value) &&
        (forsearchSub.value === "0" ||
          item.subGroupCd === forsearchSub.value) &&
        (item.menuCd.includes(searchWord.value) ||
          item.menuNm.includes(searchWord.value))
    );
    dataProvider.setRows(filteredList);
  } else {
    const filteredList = TLUList.value.filter(
      (item) =>
        item.lngCode.toString().includes(searchWord2.value) ||
        item.strName.includes(searchWord2.value)
    );
    dataProvider2.setRows(filteredList);
  }
};

const currentpaymentType = ref("기본");
const currentpaymentCd = ref(3);
const updatePaymentType = (newValue) => {
  currentpaymentCd.value = newValue;
  clickedFuncSelection.value = false;
  clickedFuncSelection2.value = false;
  if (newValue == 3) {
    showOtherKeys.value = false;
    currentpaymentType.value = "기본";
  } else {
    showOtherKeys.value = true;
    currentpaymentType.value = "결제";
  }
  ScreenKeyOrigin.value = [];
  ScreenKeys.value = [];

  clickedKey1.value = -1;
  clickedKey2.value = -1;
};

const handlePosNo = (newValue) => {
  posNo.value = newValue;
  //comsole.log(posNo.value);
  //comsole.log(nowStoreAreaCd.value);
  if (
    nowStoreAreaCd.value != undefined &&
    posNo.value != undefined &&
    posNo.value != 0
  ) {
    searchButton();
  }
};

// watch(
//   () => commonKeyList.value,
//   () => {
//     showMenuKeys(); // MenuKeyList 값이 변경될 때마다 그리드 업데이트
//   }
// );

const exitScreenKey = () => {
  changeScreenKey.value = false;
  addscreenKey.value = false;
};
const confirmScreenKey = () => {
  const index = ScreenKeyOrigin.value.findIndex(
    (item) => item.intScreenNo == clickedScreenNo.value
  );
  if (
    currentpaymentCd.value == 3 &&
    ScreenKeyOrigin.value[index].itemDiscYn != currentProduct.value
  ) {
    Swal.fire({
      title: "변경",
      text: "화면키 유형을 변경하시면 해당 화면키의 결제키가 모두 초기화됩니다.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "변경",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        //comsole.log(ScreenKeyOrigin.value[index].itemDiscYn);
        //comsole.log(currentProduct.value);
        if (ScreenKeyOrigin.value[index].itemDiscYn != currentProduct.value) {
          KeyList.value = KeyList.value.filter(
            (item) => item.intScreenNo !== clickedScreenNo.value
          );
        }

        ScreenKeyOrigin.value[index].strScreenName = currentscreenKeyNm.value;
        ScreenKeyOrigin.value[index].itemDiscYn = currentProduct.value;

        changeScreenKey.value = false;
        //comsole.log(ScreenKeyOrigin.value);
        addfor4ScreenKey();
        currentscreenKeyNm.value = "";
        showKeys(clickedScreenNo.value);
        currentProduct.value = "0";
      }
    });
  } else if (
    currentpaymentCd.value == 3 &&
    ScreenKeyOrigin.value[index].itemDiscYn == currentProduct.value
  ) {
    ScreenKeyOrigin.value[index].strScreenName = currentscreenKeyNm.value;
    changeScreenKey.value = false;
    //comsole.log(ScreenKeyOrigin.value);
    addfor4ScreenKey();
    currentscreenKeyNm.value = "";
    showKeys(clickedScreenNo.value);
    currentProduct.value = "0";
  } else {
    ScreenKeyOrigin.value[index].strScreenName = currentscreenKeyNm.value;
    changeScreenKey.value = false;
    //comsole.log(ScreenKeyOrigin.value);
    addfor4ScreenKey();
    currentscreenKeyNm.value = "";
    showKeys(clickedScreenNo.value);
    currentProduct.value = "0";
  }
};

const addfor4ScreenKey = () => {
  ScreenKeys.value = [
    ...ScreenKeyOrigin.value.slice(
      4 * (currentsubPage.value - 1),
      4 * (currentsubPage.value - 1) + 4
    ),
  ];
  const validateScreenKeys = ScreenKeys.value.filter(
    (item) => item.intScreenNo != ""
  );
  if (validateScreenKeys.length < 4) {
    ScreenKeys.value.push({ strScreenName: "", intScreenNo: "", new: true });
    for (var i = 0; i < 3 - validateScreenKeys.length; i++) {
      ScreenKeys.value.push({ strScreenName: "", intScreenNo: "" });
    }
  }
};

const confirmaddScreenKey = () => {
  if (currentscreenKeyNm.value == "" || currentscreenKeyNm.value == null) {
    Swal.fire({
      title: "오류",
      text: "화면키 이름을 입력하세요.",
      icon: "error",
      confirmButtonText: "확인",
    });
    return;
  }
  const newScreenNo =
    ScreenKeyOrigin.value[ScreenKeyOrigin.value.length - 1].intScreenNo + 1;
  ScreenKeyOrigin.value.push({
    strScreenName: currentscreenKeyNm.value,
    intScreenNo: newScreenNo,
    intScreenType: currentpaymentCd.value,
  });
  addscreenKey.value = false;
  addfor4ScreenKey();
  //comsole.log(ScreenKeyOrigin.value);
  currentscreenKeyNm.value = "";
  //comsole.log(clickedScreenNo.value);
  showKeys(clickedScreenNo.value + (currentsubPage.value - 1) * 10);
};

const existMenuKey = ref(false);
const clickedSection = ref(1);
const clickedRealIndex = ref();
const saveMenuKeyposition1 = (index, code) => {
  if (code == 2) {
    clickedFuncSelection.value = true;
  } else {
    clickedFuncSelection.value = false;
  }

  clickedSection.value = 1;
  clickedRealIndex.value = index;
};
const saveMenuKeyposition2 = (index) => {
  clickedSection.value = 2;
  clickedRealIndex.value = index;
  //comsole.log(clickedRealIndex.value);
};
const saveMenuKeyposition3 = (index, code) => {
  if (code == 2) {
    clickedFuncSelection2.value = true;
  } else {
    clickedFuncSelection2.value = false;
  }
  clickedSection.value = 3;
  clickedRealIndex.value = index;
  //comsole.log(clickedRealIndex.value);
};
const saveMenuKeyposition4 = (index) => {
  clickedSection.value = 4;
  clickedRealIndex.value = index;
  //comsole.log(clickedRealIndex.value);
};

const addKey = () => {
  if (clickedSection.value == 1) {
    //comsole.log(subsubKeyList1.value);
    subsubKeyList1.value[clickedRealIndex.value] = {
      strDName: clickedstrName.value,
      lngDCode: clickedCode.value,
    };
  } else if (clickedSection.value == 2) {
    subsubKeyList2.value[clickedRealIndex.value] = {
      strDName: clickedstrName.value,
      lngDCode: clickedCode.value,
    };
  } else if (clickedSection.value == 3) {
    subsubKeyList3.value[clickedRealIndex.value] = {
      strDName: clickedstrName.value,
      lngDCode: clickedCode.value,
    };
  } else if (clickedSection.value == 4) {
    subsubKeyList4.value[clickedRealIndex.value] = {
      strDName: clickedstrName.value,
      lngDCode: clickedCode.value,
    };
  }

  //comsole.log(KeyList.value);
};

const deletekey = () => {
  if (clickedSection.value == 1) {
    subsubKeyList1.value[clickedRealIndex.value] = "";
  } else if (clickedSection.value == 2) {
    //comsole.log(subsubKeyList2.value);
    subsubKeyList2.value[clickedRealIndex.value] = "";
  } else if (clickedSection.value == 3) {
    subsubKeyList3.value[clickedRealIndex.value] = "";
  } else if (clickedSection.value == 4) {
    subsubKeyList4.value[clickedRealIndex.value] = "";
  }
};

const clickedMenukeys = () => {
  clickedFuncSelection.value = true;
  clickedScreenOrMenu.value = true;
  //comsole.log(subsubKeyList2.value);
};

const clickedMenukeys2 = () => {
  clickedFuncSelection2.value = true;
  clickedScreenOrMenu.value = true;
  //comsole.log(subsubKeyList2.value);
};

const handleinitAll = (newvalue) => {
  MenuGroup.value = [];
  SubMenuGroup.value = [];
  KeyList.value = [];
  ScreenKeyOrigin.value = [];
  TLUList.value = [];
  AllscreenKeyPage.value = "1";
  ScreenKeys.value = [];
  forsearchMain.value = "0";
  forsearchSub.value = "0";
  searchword1.value = "";
  searchword3.value = "";
  afterSearch.value = false;
};
const searchinit = (newvalue) => {
  afterSearch.value = false;
};
</script>

<style scoped></style>
