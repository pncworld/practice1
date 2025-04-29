<template>
  <div class="flex justify-between items-center w-full overflow-y-hidden">
    <PageName></PageName>
    <div class="flex justify-center mr-10 space-x-2 pr-5">
      <button @click="searchAmount" class="button search md:w-auto w-14">
        조회
      </button>

      <button @click="savePosMenu" class="button save w-auto">저장</button>
      <button @click="showPopupf" class="button copy w-auto">복사</button>
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
      @update:ischanged="handleinitAll"
      @update:ischanged2="searchinit"></PickStore>
  </div>
  <div class="z-50">
    <DupliPopUp
      :isVisible="showPopup2"
      @close="showPopup2 = false"
      :storeCd="nowStoreCd"
      :storeNm="clickedStoreNm"
      :areaCd="nowStoreAreaCd"
      :posNo="posNo"
      :progname="'MST01_011INS_VUE'"
      :dupliapiname="'DUPLIALLPAYKEY'"
      :progid="1"
      :poskiosk="'getStoreAndPosList'"
      :naming="'POS번호'">
    </DupliPopUp>
  </div>

  <div
    v-show="showChangeScreenKey"
    class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-white p-6 rounded shadow-lg w-2/3 h-3/4 overflow-auto">
      <div class="border-gray-500 text-2xl">화면키 순서 변경</div>
      <div class="border-gray-500 text-xl">
        화면키를 끌어서 이동하면 순서가 변경됩니다.
      </div>
      <!-- VueDraggableNext 사용 -->
      <VueDraggableNext
        v-model="ScreenKeyOrigin"
        :group="{ name: 'subCategory', pull: 'clone', put: true }"
        class="space-y-2"
        :move="onMove2"
        @end="onEnd2">
        <div
          v-for="(item, index) in ScreenKeyOrigin"
          class="p-4 bg-gray-200 rounded-lg shadow-md cursor-move h-12"
          v-show="item && item.strScreenName !== ''">
          <p>{{ item.strScreenName }}</p>
        </div>
      </VueDraggableNext>

      <div class="flex justify-center space-x-3">
        <button
          @click="showScreenKeysOrder"
          class="mt-4 p-2 bg-blue-500 text-white rounded">
          닫기
        </button>
      </div>
    </div>
  </div>
  <span
    class="h-5 mt-3 flex justify-between items-center w-[900px] ml-[700px] z-40">
    <h1 class="font-bold text-xl z-40 ml-20 mt-3">결제키 배치</h1>
    <span class="flex space-x-3 ml-32 pl-56 items-center mt-3"
      >순서변경 &nbsp; &nbsp;<label class="z-40"
        ><input
          type="radio"
          name="changingMode"
          @click.stop="changingMode(1)"
          checked />교체하기 </label
      ><label class="z-40"
        ><input
          type="radio"
          name="changingMode"
          @click.stop="changingMode(2)" />밀어내기</label
      ><button class="whitebutton z-40" @click.stop="deletekey">
        삭제
      </button></span
    >
  </span>
  <div class="flex h-5/6 w-full -mt-5">
    <div class="flex flex-col w-2/5 h-5/6">
      <div
        class="flex justify-between mt-0 ml-10 w-full border-b border-b-gray-300">
        <div class="font-bold text-xl w-auto">
          <!-- <button class="contents_tab-button " :class="{'text-blue-600' : currentMenu==false }" @click="showMenus(1)">메뉴관리</button> -->
          결제명선택
        </div>
        <div class="mt-3">
          <!-- <button class="whitebutton" @click="searchAmountList3">조회</button> -->
          <button class="whitebutton" @click="movePage">추가</button>
        </div>
      </div>
      <div class="h-full" v-show="currentMenu == false">
        <div
          class="mt-3 ml-10 grid grid-cols-[1fr,3fr] grid-rows-2 gap-0 w-full">
          <div class="customtableIndex border border-gray-400 rounded-l-lg">
            결제코드/명
          </div>
          <div class="px-1 py-1 border border-gray-300 rounded-r-lg">
            <input
              type="text"
              class="border w-full h-full px-1 border-gray-400 rounded-lg"
              @input="searchAmountList" />
          </div>
        </div>
        <div class="ml-10 mt-0 w-full h-full">
          <Realgrid
            class="w-full h-full"
            :progname="'MST44_055INS_VUE'"
            :progid="1"
            :rowData="rowData"
            :showGrid="showGrid"
            :showCheckBar="false"
            :setStateBar="false"
            @selcetedrowData="selcetedrowData"
            :searchWord3="searchword1"
            :searchColId="'lngCode,strName'"></Realgrid>
          <div class="flex justify-start">
            ※ 사용여부가 미사용인 결제코드는 목록에서 노출되지 않습니다.
          </div>
          <div class="flex justify-start">
            ※ 복사시 결제코드 항목을 추가해야 결제키 화면에 노출됩니다.
          </div>
        </div>
      </div>
    </div>

    <div class="w-5/12 h-[70%] mt-[122px] ml-[122px]">
      <VueDraggableNext
        v-if="changeGrid == false"
        v-model="KeyList"
        :move="onMove"
        @end="onEnd"
        animation="200"
        class="grid grid-rows-5 grid-cols-3 h-full w-full gap-1">
        <div
          v-for="(item, index) in KeyList"
          class="custom-grid-style"
          :class="{
            '!bg-orange-500 !border-blue-700':
              clickedMenuKey == index && clickedScreenOrMenu == true,
          }"
          @click="
            saveMenuKeyposition(index, item),
              (clickedMenuKey = index),
              clickedMenukeys()
          ">
          <span
            class="flex flex-col items-center justify-center w-full h-full rounded-lg border border-gray-500"
            ><span class="flex justify-center items-center" v-if="item.gp == 1"
              >결제그룹코드</span
            ><span class="flex justify-center items-center" v-if="item.gp == 0"
              >결제코드</span
            ><span class="flex justify-center items-center">{{
              item ? item.lngKeyScrNo : ""
            }}</span
            ><span class="flex justify-center items-center">{{
              item ? item.strKeyName : ""
            }}</span></span
          >
        </div>
      </VueDraggableNext>

      <VueDraggableNext
        v-if="changeGrid == true"
        v-model="KeyList2"
        :move="onMove"
        @end="onEnd"
        animation="200"
        class="grid grid-rows-5 grid-cols-5 h-full w-full gap-1">
        <div
          v-for="(item, index) in KeyList2"
          class="custom-grid-style"
          :class="{
            '!bg-orange-500 !border-blue-700':
              clickedMenuKey == index && clickedScreenOrMenu == true,
          }"
          @click="
            saveMenuKeyposition(index, item),
              (clickedMenuKey = index),
              clickedMenukeys()
          ">
          <span
            class="flex flex-col items-center justify-center w-full h-full rounded-lg border border-gray-500"
            ><span class="flex justify-center items-center">{{
              item ? item.lngAmtCode : ""
            }}</span
            ><span class="flex justify-center items-center">{{
              item ? item.strKeyName : ""
            }}</span></span
          >
        </div>
      </VueDraggableNext>
    </div>

    <div
      v-if="changeGrid == true"
      class="flex flex-col ml-3 w-10 h-9/12 mt-[70px] space-y-7">
      <div class="relative w-[50%] right-9">
        <button
          class="whitebutton mr-20"
          @click="
            changeGrid = false;
            changeRowData();
          ">
          돌아가기
        </button>
      </div>
      <div class="flex flex-col ml-2 w-full h-[75%]">
        <button
          class="border border-[#CCCCCC] w-full h-full rounded-md"
          @click="showPrev">
          <img src="../../assets/arrow_up_wo_border.svg" alt="" />
        </button>
        <button
          class="border border-[#CCCCCC] w-full h-full rounded-md"
          @click="showNext">
          <img src="../../assets/arrow_down_wo_border.svg" alt="" />
        </button>
      </div>
      &nbsp;&nbsp;&nbsp;{{ clickedGroupPage }} / 5
    </div>
  </div>
</template>

<script setup>
import {
  getAllScreenList,
  getAmountList3,
  saveGroupPayKey,
  savePayKey,
} from "@/api/master";
import Swal from "sweetalert2";
import { onMounted, ref, watch } from "vue";
import { VueDraggableNext } from "vue-draggable-next";
import { useStore } from "vuex";

import DupliPopUp from "@/components/dupliPopUp.vue";

import Realgrid from "@/components/realgrid.vue";

import PickStore from "@/components/pickStore.vue";
import { insertPageLog } from "@/customFunc/customFunc";
import PageName from "@/components/pageName.vue";

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
});
// 더미 데이터
const items = ref([1, 1, 1, 1, 1, 1]);
const clickedScreenKeyIndex = ref();
const ScreenKeyOrigin = ref([]);
const clickedMenuKey = ref();
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
const changePay = ref(false);
const originGroupKeys = ref([]);
// 드래그 가능한 요소를 설정하는 메서드
const currentsubPage = ref(1);
const changeMode = ref(false);
const changingMode = (data) => {
  if (data == 1) {
    changeMode.value = false;
  } else {
    changeMode.value = true;
  }
};
const clickedGroupPage = ref(1);
const nowscreenNo = ref();
const clickedStoreNm = ref();
const handlestoreNm = (newData) => {
  clickedStoreNm.value = newData;
};
const showPopup2 = ref(false);
const showChangeScreenKey = ref(false);
const confirmitem = ref([]);
const currentscreenKeyNm = ref("");
const maxSubCode = ref();
const posNo = ref();
const changeScreenKey = ref(false);
const currmenuKeyPage = ref(1);
const AllscreenKeyPage = ref(1);
const currentSelectedMenuNm = ref("");
const currentMenu = ref(false);

const movePage = () => {
  store.state.moveOtherTab = {
    strUrl: "MIMASTER::MST36_001INS.xml",
    lngProgramID: 73645,
    strTitle: "결제 코드 등록.",
  };
};
const showPopupf = () => {
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

const showNext = () => {
  if (clickedGroupPage.value == 5) {
    return;
  }
  KeyList2.value = [];
  //console.log(clickedGroupPage.value);
  clickedGroupPage.value++;
  //console.log(clickedGroupPage.value);
  for (
    var i = 25 * (clickedGroupPage.value - 1);
    i < 25 * clickedGroupPage.value;
    i++
  ) {
    const findindex = originGroupKeys.value.findIndex(
      (item) =>
        item.intKeySeq == i + 1 && item.lngGroupCode == clickedGroupCd.value
    );
    if (findindex == -1) {
      KeyList2.value.splice(i, 0, { intKeySeq: i + 1 });
    } else {
      KeyList2.value.splice(i, 0, originGroupKeys.value[findindex]);
    }
  }
  //console.log(KeyList2.value);
};
const showPrev = () => {
  if (clickedGroupPage.value == 1) {
    return;
  }
  KeyList2.value = [];
  clickedGroupPage.value--;
  //console.log(clickedGroupPage.value);
  for (var i = 0; i < 25; i++) {
    const findindex = originGroupKeys.value.findIndex(
      (item) =>
        item.intKeySeq == 25 * (clickedGroupPage.value - 1) + i + 1 &&
        item.lngGroupCode == clickedGroupCd.value
    );
    if (findindex == -1) {
      KeyList2.value.splice(i, 0, {
        intKeySeq: 25 * (clickedGroupPage.value - 1) + i + 1,
      });
    } else {
      KeyList2.value.splice(i, 0, originGroupKeys.value[findindex]);
    }
  }
};
const updateMenuKey = ref(false);

const nowStoreAreaCd = ref();
const handleStoreAreaCd = (newValue) => {
  nowStoreAreaCd.value = newValue;
  //console.log(nowStoreAreaCd.value);
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
const SubMenuGroup = ref([]);
const rowData = ref([]);
const changeGrid = ref(false);
const store = useStore();
const currentProduct = ref("0");
const showEditProduct = ref(false);
const userData = store.state.userData;
const groupCd = ref(userData.lngStoreGroup);
const modified = ref(false);
const afterSearch = ref(false);
const AmountList = ref([]);
const KeyList = ref([]);
const KeyList2 = ref([]);
const screenList = ref([]);
const confirmitem3 = ref([]);
const clickedScreenOrMenu = ref(false);
const TLUList = ref([]);
const clickedScreenNo = ref();
const searchAmount = async () => {
  rowData.value = [];
  KeyList.value = [];
  KeyList2.value = [];
  changeGrid.value = false;
  clickedGroupPage.value = 1;

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
    const res4 = await getAmountList3(
      groupCd.value,
      nowStoreCd.value,
      nowStoreAreaCd.value,
      posNo.value
    );
    //console.log(res4);
    AmountList.value = res4.data.AmountList;
    KeyList.value = res4.data.AmountKeyList;
    originGroupKeys.value = res4.data.GroupList;
    //console.log(AmountList.value);
    //console.log(KeyList.value);
    //console.log(originGroupKeys.value);

    AmountList.value = AmountList.value.map((item) => {
      return {
        ...item,
        add: "추가",
      };
    });
    rowData.value = AmountList.value;

    const res2 = await getAllScreenList(
      groupCd.value,
      nowStoreCd.value,
      nowStoreAreaCd.value,
      posNo.value
    );
    screenList.value = res2.data.ALLScreenList;

    AllscreenKeyPage.value = Math.ceil(ScreenKeyOrigin.value.length / 4);
    confirmitem.value = JSON.parse(JSON.stringify(KeyList.value));
    confirmitem2.value = JSON.parse(JSON.stringify(ScreenKeyOrigin.value));
    confirmitem3.value = JSON.parse(JSON.stringify(originGroupKeys.value));
  } catch (error) {
    afterSearch.value = false;
  } finally {
    store.state.loading = false; // 로딩 상태 종료
    modified.value = false;
    afterCategory.value = false;
    afterSearch.value = true;
    clickedMenuKey.value = -1;
  }
};

watch(forsearchSub, (newValue) => {
  searchAmountList3();
});
const clickedintScreenNo = ref();

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

function changeRowData() {
  //console.log(AmountList.value);
  rowData.value = AmountList.value;
}
const showScreenKeysOrder = () => {
  showChangeScreenKey.value = !showChangeScreenKey.value;
};

let targetItemIndex2;
const onMove = (evt) => {
  // 예: 드래그 중 이동할 때의 조건 등을 설정할 수 있음
  if (changeMode.value == false) {
    targetItemIndex2 = Array.from(evt.from.children).indexOf(evt.related);
    //console.log(targetItemIndex2);
    return false;
  } else {
    return true;
  }
};
let targetItemIndex3;
let dupliScreenKeyOrigin;
const onMove2 = (evt) => {
  // 예: 드래그 중 이동할 때의 조건 등을 설정할 수 있음
  targetItemIndex3 = Array.from(evt.from.children).indexOf(evt.related);

  dupliScreenKeyOrigin = [...ScreenKeyOrigin.value];
  //console.log(dupliScreenKeyOrigin);
  return true;
};

const onEnd = (evt) => {
  // Swap을 처리할 조건
  let oldIndex = evt.oldIndex;
  if (changeMode.value === false) {
    if (changeGrid.value == false) {
      // 드래그된 아이템의 기존 인덱스
      const swappedItems = [...KeyList.value]; // items를 복사
      //console.log(oldIndex);
      //console.log(targetItemIndex2);
      const temp = swappedItems[oldIndex];

      swappedItems[oldIndex] = swappedItems[targetItemIndex2];

      swappedItems[targetItemIndex2] = temp;

      //console.log(swappedItems);
      // 배열을 업데이트
      //   items.value = swappedItems;

      KeyList.value = swappedItems.map((item, index) => ({
        ...item, // 기존 객체의 다른 속성 유지
        intKeySeq: index + 1, // 배열 순서대로 intKeySeq 재정렬
      }));
    } else if (changeGrid.value == true) {
      const oldIndex = evt.oldIndex; // 드래그된 아이템의 기존 인덱스
      const swappedItems = [...KeyList2.value]; // items를 복사
      //console.log(oldIndex);
      //console.log(targetItemIndex2);
      const temp = swappedItems[oldIndex];
      const originindex = originGroupKeys.value.find(
        (item) =>
          item.intKeySeq == oldIndex + (clickedGroupPage.value - 1) * 25 + 1 &&
          item.lngGroupCode == clickedGroupCd.value
      );
      //console.log(originindex);
      if (originindex !== undefined && originindex != -1) {
        originindex.intKeySeq =
          targetItemIndex2 + (clickedGroupPage.value - 1) * 25 + 1;
      }
      swappedItems[oldIndex] = swappedItems[targetItemIndex2];

      swappedItems[targetItemIndex2] = temp;

      //console.log(originGroupKeys.value);
      // 배열을 업데이트
      //   items.value = swappedItems;

      KeyList2.value = swappedItems.map((item, index) => ({
        ...item, // 기존 객체의 다른 속성 유지
        intKeySeq: index + (clickedGroupPage.value - 1) * 25 + 1, // 배열 순서대로 intKeySeq 재정렬
      }));
    }
  } else {
    if (changeGrid.value == false) {
      updateMenuKey.value = true;
      KeyList.value = KeyList.value.map((item, index) => ({
        ...item, // 기존 객체의 다른 속성 유지
        intKeySeq: index + 1, // 배열 순서대로 intKeySeq 재정렬
      }));
    } else if (changeGrid.value == true) {
      KeyList2.value = KeyList2.value.map((item, index) => ({
        ...item, // 기존 객체의 다른 속성 유지
        intKeySeq: index + 1, // 배열 순서대로 intKeySeq 재정렬
      }));

      for (let i = 0; i < KeyList2.value.length; i++) {
        let gc = KeyList2.value[i].lngGroupCode;
        let ac = KeyList2.value[i].lngAmtCode;
        let seq = KeyList2.value[i].intKeySeq;

        const findit = originGroupKeys.value.find(
          (item) => item.lngGroupCode == gc && item.lngAmtCode == ac
        );
        if (findit) {
          findit.intKeySeq = seq;
        }
      }
    }

    //console.log(KeyList2.value);
    // const originindex = originGroupKeys.value.find(
    //   (item) =>
    //     item.intKeySeq ==
    //       evt.oldIndex + (clickedGroupPage.value - 1) * 25 + 1 &&
    //     item.lngGroupCode == clickedGroupCd.value
    // );
    // //console.log(originindex);
    // if (originindex !== undefined && originindex != -1) {
    //   originindex.intKeySeq =
    //     targetItemIndex2 + (clickedGroupPage.value - 1) * 25 + 1;
    // }
  }
  clickedMenuKey.value = targetItemIndex2;
  //console.log(originGroupKeys.value);
};

const onEnd2 = (evt) => {
  const originScreenNo = dupliScreenKeyOrigin[evt.oldIndex].intScreenNo;
  const targetScreenNo = dupliScreenKeyOrigin[targetItemIndex3].intScreenNo;

  addfor4ScreenKey();
  //console.log(items.value);
  //console.log(KeyList.value);
  //console.log(ScreenKeyOrigin.value);
  clickedMenuKey.value = targetItemIndex2;
  showKeys(targetScreenNo);
};

const savePosMenu = async () => {
  //console.log(KeyList.value);
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
    JSON.stringify(confirmitem.value) == JSON.stringify(KeyList.value) &&
    JSON.stringify(confirmitem3.value) ==
      JSON.stringify(originGroupKeys.value) &&
    JSON.stringify(confirmitem2.value) == JSON.stringify(ScreenKeyOrigin.value)
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
      try {
        const intKeySeqs = KeyList.value
          .filter((item) => item.lngKeyScrNo !== undefined)
          .map((item) => item.intKeySeq);
        const keyscrnos = KeyList.value
          .filter((item) => item.lngKeyScrNo !== undefined)
          .map((item) => item.lngKeyScrNo);
        const KeyNmarr = KeyList.value
          .filter((item) => item.lngKeyScrNo !== undefined)
          .map((item) => item.strKeyName);
        const gps = KeyList.value
          .filter((item) => item.lngKeyScrNo !== undefined)
          .map((item) => item.gp);
        const intKeyNos = KeyList.value
          .filter((item) => item.lngKeyScrNo !== undefined)
          .map((item) => item.intKeyNo);

        const intKeySeqs2 = originGroupKeys.value.map((item) => item.intKeySeq);
        const lngAmtcode2 = originGroupKeys.value.map(
          (item) => item.lngAmtCode
        );
        const lngGroupCode2 = originGroupKeys.value.map(
          (item) => item.lngGroupCode
        );
        const strKeyName2 = originGroupKeys.value.map(
          (item) => item.strKeyName
        );

        const res2 = await savePayKey(
          groupCd.value,
          nowStoreCd.value,
          nowStoreAreaCd.value,
          posNo.value,
          intKeySeqs.join("\u200B"),
          keyscrnos.join("\u200B"),
          KeyNmarr.join("\u200B"),
          intKeyNos.join("\u200B"),
          gps.join("\u200B")
        );
        const res3 = await saveGroupPayKey(
          groupCd.value,
          nowStoreCd.value,
          nowStoreAreaCd.value,
          posNo.value,
          intKeySeqs2.join("\u200B"),
          lngAmtcode2.join("\u200B"),
          lngGroupCode2.join("\u200B"),
          strKeyName2.join("\u200B")
        );

        //console.log(res2);
        //console.log(res3);
      } catch (error) {
      } finally {
        store.state.loading = false;
        Swal.fire({
          title: "저장 되었습니다.",
          confirmButtonText: "확인",
        });

        searchAmount();
      }
    }
  });

  // 빈공간 데이터를 넣으려고하는데 안 들어가고 조회가 안됨 // 빈 칸에 대한 것도 데이터를 불러와야 메뉴키위치를 정할 수 있음.
};
let gridView;
let dataProvider;
const currentSelectedMenuCode = ref("");
const currentSelectedMenuImgUrl = ref("");
onMounted(() => {});

let gridView2;
let dataProvider2;
const clickedTLUCD = ref();
const clickedsort = ref();
const clickedstrName = ref();
const clickedCode = ref();
const clickedPrice = ref();
const selcetedrowData = (newValue) => {
  //console.log(newValue);
  if (newValue[0] == "결제코드") {
    clickedsort.value = 0;
  } else if (newValue[0] == "결제그룹코드") {
    clickedsort.value = 1;
  }

  clickedstrName.value = newValue[2];
  clickedCode.value = newValue[1];
  clickedPrice.value = newValue[3];
  addKey();
};

const changeCard = (value) => {
  if (value == 1) {
    clickedstrName.value = "신용카드";
    clickedCode.value = "2001";
  } else if (value == 2) {
    clickedstrName.value = "삼성엘지페이";
    clickedCode.value = "2001";
  }
  changePay.value = false;
  addKey();
};

const searchAmountList = (e) => {
  searchword1.value = e.target.value;
};
const searchAmountList3 = (e) => {
  if (currentMenuorTLU.value == false) {
    const filteredList = AmountList.value.filter(
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

const currentpaymentType = ref("할인");
const currentpaymentCd = ref(3);

const handlePosNo = (newValue) => {
  posNo.value = newValue;
  //console.log(posNo.value);
  //console.log(nowStoreAreaCd.value);
  if (
    nowStoreAreaCd.value !== undefined &&
    posNo.value !== undefined &&
    posNo.value !== 0
  ) {
    searchAmount();
  }
};

// watch(
//   () => AmountList.value,
//   () => {
//     // showMenuKeys(); // MenuKeyList 값이 변경될 때마다 그리드 업데이트
//   }
// );

watch(KeyList, (newvalue) => {
  for (var i = 0; i < 15; i++) {
    if (KeyList.value.findIndex((item) => item.intKeySeq == i + 1) == -1) {
      KeyList.value.splice(i, 0, { intKeySeq: i + 1 });
    }
    //console.log(KeyList.value);
  }
});

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

const clickedRealIndex = ref();
const clickedGroupCd = ref();
const saveMenuKeyposition = (index, item) => {
  if (item.gp == 1) {
    KeyList2.value = [];
    clickedGroupCd.value = item.lngKeyScrNo;
    changeGrid.value = true;
    rowData.value = AmountList.value.filter(
      (item) => item.sort != "결제그룹코드"
    );
    //console.log(originGroupKeys.value);
    //console.log(KeyList2.value);
    for (
      var i = (clickedGroupPage.value - 1) * 25;
      i < clickedGroupPage.value * 25;
      i++
    ) {
      const findindex = originGroupKeys.value.findIndex(
        (item) =>
          item.intKeySeq == (clickedGroupPage.value - 1) * 25 + i + 1 &&
          item.lngGroupCode == clickedGroupCd.value
      );
      if (findindex == -1) {
        KeyList2.value.splice(i, 0, {
          intKeySeq: (clickedGroupPage.value - 1) * 25 + i + 1,
        });
      } else {
        KeyList2.value.splice(i, 0, originGroupKeys.value[findindex]);
      }
    }

    //console.log(KeyList2.value);
    clickedRealIndex.value = (clickedGroupPage.value - 1) * 25 + index + 1;
  } else {
    clickedRealIndex.value = index + 1;
  }
};

const addKey = () => {
  if (changeGrid.value == false) {
    const foraddIndex = KeyList.value.findIndex(
      (item) =>
        item.intKeySeq ==
        (clickedGroupPage.value - 1) * 25 + clickedRealIndex.value
    );
    if (foraddIndex == -1) {
      KeyList.value.push({
        gp: clickedsort.value,
        intKeyNo: 1,
        intKeySeq: clickedRealIndex.value,
        lngKeyColor: 0,
        lngKeyScrNo: Number(clickedCode.value),
        strKeyName: clickedstrName.value,
      });
    } else {
      KeyList.value[foraddIndex] = {
        gp: clickedsort.value,
        intKeyNo: 1,
        intKeySeq: clickedRealIndex.value,
        lngKeyColor: 0,
        lngKeyScrNo: Number(clickedCode.value),
        strKeyName: clickedstrName.value,
      };
    }

    //console.log(KeyList.value);
  } else if (changeGrid.value == true) {
    //console.log(clickedRealIndex.value);
    //console.log(clickedGroupPage.value);
    //console.log(KeyList2.value);
    const foraddIndex = KeyList2.value.findIndex(
      (item) =>
        item.intKeySeq ==
        (clickedGroupPage.value - 1) * 25 + clickedRealIndex.value
    );
    //console.log(foraddIndex);
    if (foraddIndex == -1) {
      KeyList2.value.push({
        intKeySeq: (clickedGroupPage.value - 1) * 25 + clickedRealIndex.value,
        lngGroupCode: clickedGroupCd.value,
        lngAmtCode: Number(clickedCode.value),
        strKeyName: clickedstrName.value,
      });
      originGroupKeys.value.push({
        intKeySeq: (clickedGroupPage.value - 1) * 25 + clickedRealIndex.value,
        lngGroupCode: clickedGroupCd.value,
        lngAmtCode: Number(clickedCode.value),
        strKeyName: clickedstrName.value,
      });
    } else {
      KeyList2.value[foraddIndex] = {
        intKeySeq: (clickedGroupPage.value - 1) * 25 + clickedRealIndex.value,
        lngGroupCode: clickedGroupCd.value,
        lngAmtCode: Number(clickedCode.value),
        strKeyName: clickedstrName.value,
      };
      originGroupKeys.value.push({
        intKeySeq: (clickedGroupPage.value - 1) * 25 + clickedRealIndex.value,
        lngGroupCode: clickedGroupCd.value,
        lngAmtCode: Number(clickedCode.value),
        strKeyName: clickedstrName.value,
      });
    }
  }
  //console.log(originGroupKeys.value);
  //console.log(KeyList2.value);
};

const deletekey = () => {
  if (changeGrid.value == false) {
    KeyList.value = KeyList.value.map((item) => {
      if (item.intKeySeq == clickedRealIndex.value) {
        return {
          intKeySeq: clickedRealIndex.value,
        };
      }
      return item;
    });
    //console.log(KeyList.value);
  } else if (changeGrid.value == true) {
    KeyList2.value = KeyList2.value.map((item) => {
      if (
        item.intKeySeq ==
        clickedRealIndex.value + (clickedGroupPage.value - 1) * 25
      ) {
        return {
          intKeySeq: clickedRealIndex.value + (clickedGroupPage.value - 1) * 25,
        };
      }
      return item;
    });

    originGroupKeys.value = originGroupKeys.value.filter(
      (item) =>
        item.intKeySeq !=
          (clickedGroupPage.value - 1) * 25 + clickedRealIndex.value &&
        item.lngGroupCode == clickedGroupCd.value
    );
    //console.log(KeyList2.value);
    //console.log(originGroupKeys.value);
  }
};

const clickedMenukeys = () => {
  clickedScreenOrMenu.value = true;
};
const clickedScreenKeys = () => {
  clickedScreenOrMenu.value = false;
};
const handleinitAll = (newvalue) => {
  AmountList.value = [];
  MenuGroup.value = [];
  SubMenuGroup.value = [];
  KeyList.value = [];
  ScreenKeyOrigin.value = [];
  TLUList.value = [];
  AllscreenKeyPage.value = "1";
  ScreenKeys.value = [];
  items.value = [];
  forsearchMain.value = "0";
  forsearchSub.value = "0";
  afterSearch.value = false;
  searchword1.value = "";
  searchword3.value = "";
  afterSearch.value = false;
};
const searchinit = (newvalue) => {
  afterSearch.value = false;
};
</script>

<style scoped></style>
