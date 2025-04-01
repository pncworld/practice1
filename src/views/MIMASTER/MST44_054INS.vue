<template>
  <div class="flex justify-between items-center w-full overflow-y-auto">
    <div class="flex justify-start w-full pl-12 pt-4">
      <div class="flex justify-start">
        <h1 class="font-bold text-sm md:text-2xl w-full">결제키 설정(#)</h1>
      </div>
    </div>
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
      :showPayType="true"
      @storeNm="handlestoreNm"
      @update:ischanged="handleinitAll"
      @update:ischanged2="searchinit"
      @updatePaymentType="updatePaymentType"></PickStore>
  </div>
  <div class="z-50">
    <DupliPopUp3
      :isVisible="showPopup2"
      @close="showPopup2 = false"
      :storeCd="nowStoreCd"
      :poskiosk="'getStoreDistinctList'"
      :storeNm="clickedStoreNm"
      :areaCd="nowStoreAreaCd"
      :posNo="posNo"
      :screenType="currentpaymentCd"
      :screenList="screenList"
      :progname="'MST44_054INS_VUE'"
      :dupliapiname="'DUPLIPAYKEY'"
      :progid="2"
      :naming="'POS번호'">
    </DupliPopUp3>
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
    <h1 class="font-bold text-xl z-40">결제키 설정</h1>
    <span class="flex space-x-3 ml-32 pl-56 items-center"
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
    <div class="flex flex-col w-3/5 h-5/6">
      <div
        class="flex justify-between mt-0 ml-10 w-full border-b border-b-gray-300">
        <div class="font-bold text-xl w-auto">
          <!-- <button class="contents_tab-button " :class="{'text-blue-600' : currentMenu==false }" @click="showMenus(1)">메뉴관리</button> -->
          {{ currentpaymentType }}&nbsp;결제키선택
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
            :progname="'MST44_054INS_VUE'"
            :progid="1"
            :rowData="rowData"
            :showGrid="showGrid"
            :showCheckBar="false"
            @selcetedrowData="selcetedrowData"
            :searchWord="searchword1"
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
    <div class="grid grid-rows-[1fr,4fr] grid-cols-1 ml-10 w-full h-full z-20">
      <div
        class="flex h-full w-[86%] mt-10 items-start justify-center"
        v-show="afterSearch">
        <div
          class="grid grid-cols-4 grid-rows-1 gap-x-1 ml-10 mt-0 w-full h-full">
          <div
            v-for="(item, index) in ScreenKeys"
            class="custom-grid-style w-[174px] h-[80px]"
            :class="{
              '!bg-orange-500 !border-blue-700':
                clickedScreenKeyIndex == index && clickedScreenOrMenu == false,
            }"
            @click="
              clickedScreenKeyIndex = index;
              clickedScreenKeys();
            ">
            <p
              v-if="item.strScreenName != ''"
              @click="showKeys(item.intScreenNo)"
              class="flex items-center justify-center w-full h-full">
              <button class="">{{ item.strScreenName }}</button
              ><button
                @click.stop="
                  editScreenKey(
                    item.intScreenNo,
                    item.strScreenName,
                    item.itemDiscYn
                  )
                ">
                <font-awesome-icon :icon="['far', 'pen-to-square']" />
              </button>
            </p>
            <p
              v-else-if="item.new == true"
              @click="addScreenKey(index)"
              class="flex items-center justify-center w-full h-full">
              <button
                class="w-full h-full text-gray-300 flex justify-center items-center">
                <img src="../../assets/ic_add_gray_24.png" alt="" /> 화면키 추가
              </button>
            </p>
            <p v-else class="flex items-center justify-center"></p>
          </div>
        </div>
        <div class="flex mt-5 ml-2 w-36 h-1/5">
          <button
            class="border border-[#CCCCCC] w-full h-full rounded-md flex justify-center items-center"
            @click="showPrev">
            <img
              src="../../assets/table-left.svg"
              alt=""
              class="w-full h-full object-cover rounded-md" /></button
          ><button
            class="border border-[#CCCCCC] h-full w-full rounded-md flex justify-center items-center"
            @click="showScreenKeysOrder">
            <img src="../../assets/table-change_2.svg" alt="" /></button
          ><button
            class="border border-[#CCCCCC] w-full h-full rounded-md flex justify-center items-center"
            @click="showNext">
            <img
              src="../../assets/table-right.svg"
              alt=""
              class="w-full h-full object-cover rounded-md" />
          </button>
        </div>
      </div>

      <div v-show="afterSearch" class="flex mt-4 w-11/12 h-5/6">
        <div class="flex w-full h-full">
          <VueDraggableNext
            v-model="items"
            :move="onMove"
            @end="onEnd"
            animation="200"
            class="grid grid-cols-5 grid-rows-6 ml-10 mt-4 w-full h-full gap-1">
            <div
              v-for="(item, index) in items"
              class="custom-grid-style"
              :class="{
                '!bg-orange-500 !border-blue-700':
                  clickedMenuKey == index && clickedScreenOrMenu == true,
              }"
              @click="
                index !== 29 &&
                  item.itemDiscYn == 0 &&
                  (saveMenuKeyposition(index),
                  (clickedMenuKey = index),
                  clickedMenukeys())
              ">
              <span
                class="flex flex-col items-center justify-center w-full h-full rounded-lg"
                :class="{ '!bg-gray-300': index == 29 || item.itemDiscYn == 1 }"
                ><span class="flex justify-center items-center">{{
                  item ? item.lngKeyScrNo : ""
                }}</span
                ><span class="flex justify-center items-center">{{
                  item ? item.strName : ""
                }}</span></span
              >
            </div>
          </VueDraggableNext>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  getAllScreenList,
  getAmountList,
  saveAllMenuKey2,
  saveScreenKeys2,
} from "@/api/master";
import Swal from "sweetalert2";
import { onMounted, ref, watch } from "vue";
import { VueDraggableNext } from "vue-draggable-next";
import { useStore } from "vuex";

import DupliPopUp3 from "@/components/dupliPopUp3.vue";
import PickStore from "@/components/pickStore.vue";
import Realgrid from "@/components/realgrid.vue";
import router from "@/router";

// 더미 데이터
const items = ref([]);
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

const movePage = () => {
  store.state.moveOtherTab = {
    strUrl: "MIMASTER::MST36_001INS.xml",
    lngProgramID: 73645,
    strTitle: "결제 코드 등록.",
  };
};
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
  if (currentsubPage.value >= AllscreenKeyPage.value) {
    return;
  }
  currentsubPage.value++;

  addfor4ScreenKey();
};
const showPrev = () => {
  console.log(ScreenKeyOrigin.value);
  if (currentsubPage.value == 1) {
    return;
  }
  currentsubPage.value--;
  ScreenKeys.value = ScreenKeyOrigin.value.slice(
    4 * (currentsubPage.value - 1),
    4 * (currentsubPage.value - 1) + 4
  );
};
const updateMenuKey = ref(false);

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
const Category = ref([]);

const MenuGroup = ref([]);
const confirmitem2 = ref([]);
const SubMenuGroup = ref([]);
const rowData = ref([]);

const store = useStore();
const currentProduct = ref("0");
const showEditProduct = ref(false);
const userData = store.state.userData;
const groupCd = ref(userData.lngStoreGroup);
const modified = ref(false);
const afterSearch = ref(false);
const AmountList = ref([]);
const KeyList = ref([]);
const screenList = ref([]);
const clickedScreenOrMenu = ref(false);
const TLUList = ref([]);
const clickedScreenNo = ref();
const searchAmount = async () => {
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
    console.log(groupCd.value);
    console.log(nowStoreCd.value);
    console.log(nowStoreAreaCd.value);
    console.log(posNo.value);
    console.log(currentpaymentCd.value);

    const res4 = await getAmountList(
      groupCd.value,
      nowStoreCd.value,
      nowStoreAreaCd.value,
      posNo.value,
      Number(currentpaymentCd.value)
    );
    console.log(res4);
    AmountList.value = res4.data.AmountList;
    ScreenKeyOrigin.value = res4.data.AmountScreenList;
    console.log(ScreenKeyOrigin.value);
    KeyList.value = res4.data.AmountKeyList;
    if (KeyList.value == null) {
      KeyList.value = ["1"];
    }
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
    console.log(screenList.value);
    console.log(KeyList.value);

    addfor4ScreenKey();
    console.log(ScreenKeyOrigin.value);
    AllscreenKeyPage.value = Math.ceil(ScreenKeyOrigin.value.length / 4);
    confirmitem.value = JSON.parse(JSON.stringify(KeyList.value));
    confirmitem2.value = JSON.parse(JSON.stringify(ScreenKeyOrigin.value));
  } catch (error) {
    afterSearch.value = false;
  } finally {
    store.state.loading = false; // 로딩 상태 종료
    modified.value = false;
    afterCategory.value = false;
    afterSearch.value = true;
    clickedMenuKey.value = -1;
  }

  calculateMaxSubCode();
};
const filteredSubMenuGroup = ref([]);
const setSubCd = () => {
  console.log(forsearchMain.value);
  console.log(SubMenuGroup.value);
  filteredSubMenuGroup.value = SubMenuGroup.value.filter(
    (item) => item.sublngMajor == forsearchMain.value
  );
  console.log(filteredSubMenuGroup.value);
  forsearchSub.value = "0";
  searchAmountList3();
};
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

const showScreenKeysOrder = () => {
  showChangeScreenKey.value = !showChangeScreenKey.value;
};

let targetItemIndex2;
const onMove = (evt) => {
  // 예: 드래그 중 이동할 때의 조건 등을 설정할 수 있음
  if (changeMode.value == false) {
    targetItemIndex2 = Array.from(evt.from.children).indexOf(evt.related);
    console.log(targetItemIndex2);
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
  console.log(dupliScreenKeyOrigin);
  return true;
};
const clickedMove = ref(false);
const onEnd = (evt) => {
  // Swap을 처리할 조건
  if (changeMode.value === false) {
    const oldIndex = evt.oldIndex; // 드래그된 아이템의 기존 인덱스
    const swappedItems = [...items.value]; // items를 복사
    console.log(oldIndex);
    console.log(targetItemIndex2);
    const temp = swappedItems[oldIndex];

    swappedItems[oldIndex] = swappedItems[targetItemIndex2];

    swappedItems[targetItemIndex2] = temp;

    console.log(swappedItems);
    // 배열을 업데이트
    //   items.value = swappedItems;

    items.value = swappedItems.map((item, index) => ({
      ...item, // 기존 객체의 다른 속성 유지
      intKeySeq: index + (currmenuKeyPage.value - 1) * 30 + 1, // 배열 순서대로 intKeySeq 재정렬
    }));
  } else {
    updateMenuKey.value = true;
    items.value = items.value.map((item, index) => ({
      ...item, // 기존 객체의 다른 속성 유지
      intKeySeq: index + (currmenuKeyPage.value - 1) * 30 + 1, // 배열 순서대로 intKeySeq 재정렬
    }));
  }
  console.log(clickedintScreenNo.value);
  console.log(KeyList.value);
  console.log(currmenuKeyPage.value);
  KeyList.value = KeyList.value.filter(
    (item) => item.intScreenNo != clickedintScreenNo.value
  );
  console.log(KeyList.value);
  items.value.forEach((item) => {
    if (item.lngKeyScrNo != undefined) {
      KeyList.value.push(item);
    }
  });
  console.log("Items:", items.value);
  console.log("KeyList:", KeyList.value);
};
function formatNumber(value) {
  if (!value) return "";
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
const onEnd2 = (evt) => {
  const originScreenNo = dupliScreenKeyOrigin[evt.oldIndex].intScreenNo;
  const targetScreenNo = dupliScreenKeyOrigin[targetItemIndex3].intScreenNo;

  addfor4ScreenKey();
  console.log(items.value);
  console.log(KeyList.value);
  console.log(ScreenKeyOrigin.value);
  showKeys(targetScreenNo);
};

const savePosMenu = async () => {
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
        const screenKeyNoarr = ScreenKeyOrigin.value.map(
          (item) => item.intScreenNo
        );
        const screenKeyNamearr = ScreenKeyOrigin.value.map(
          (item) => item.strScreenName
        );
        const screenKeyDisc = ScreenKeyOrigin.value.map(
          (item) => item.itemDiscYn
        );

        console.log(screenKeyNoarr.join(","));
        console.log(screenKeyNamearr.join(","));
        console.log(currentpaymentCd.value);
        const res = await saveScreenKeys2(
          groupCd.value,
          nowStoreCd.value,
          nowStoreAreaCd.value,
          posNo.value,
          screenKeyNoarr.join(","),
          screenKeyNamearr.join(","),
          screenKeyDisc.join(","),
          currentpaymentCd.value
        );

        const intKeySeqs = KeyList.value.map((item) => item.intKeySeq);
        const screenNumarr = KeyList.value.map((item) => item.intScreenNo);
        const lngScrarr = KeyList.value.map((item) => item.lngKeyScrNo);
        const menuKeyNmarr = KeyList.value.map((item) => item.strName);
        const itemDiscYnarr = KeyList.value.map((item) => item.itemDiscYn);
        console.log(posNo.value);
        console.log(intKeySeqs.join(","));
        console.log(screenNumarr.join(","));
        console.log(lngScrarr.join(","));
        console.log(menuKeyNmarr.join(","));
        const res2 = await saveAllMenuKey2(
          groupCd.value,
          nowStoreCd.value,
          nowStoreAreaCd.value,
          posNo.value,
          intKeySeqs.join(","),
          screenNumarr.join(","),
          lngScrarr.join(","),
          menuKeyNmarr.join(","),
          currentpaymentCd.value,
          itemDiscYnarr.join(",")
        );

        console.log(res);
        console.log(res2);
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
onMounted(() => {
  showMenuKeys();
});

const showMenuKeys = () => {};

let gridView2;
let dataProvider2;
const clickedTLUCD = ref();
const clickedTLUNM = ref();
const clickedstrName = ref();
const clickedCode = ref();
const selcetedrowData = (newValue) => {
  clickedstrName.value = newValue[1];
  clickedCode.value = newValue[0];
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
const updatePaymentType = (newValue) => {
  console.log(newValue);
  currentpaymentCd.value = newValue;
  if (newValue == 3) {
    currentpaymentType.value = "할인";
  } else {
    currentpaymentType.value = "지불";
  }
  ScreenKeyOrigin.value = [];
  ScreenKeys.value = [];
  KeyList.value = [];
  rowData.value = [];
  items.value = [];
};

const handlePosNo = (newValue) => {
  posNo.value = newValue;
  console.log(posNo.value);
  console.log(nowStoreAreaCd.value);
  if (
    nowStoreAreaCd.value != undefined &&
    posNo.value != undefined &&
    posNo.value != 0
  ) {
    searchAmount();
  }
};

watch(
  () => AmountList.value,
  () => {
    showMenuKeys(); // MenuKeyList 값이 변경될 때마다 그리드 업데이트
  }
);

const editScreenKey = (value, value2, value3) => {
  currentscreenKeyNm.value = value2;
  console.log(value3);
  currentProduct.value = value3;
  clickedScreenNo.value = value;
  changeScreenKey.value = true;
  const disclength = ScreenKeyOrigin.value.filter(
    (item) => item.itemDiscYn == 1
  ).length;
  console.log(ScreenKeyOrigin.value);
  console.log(disclength);
  if (disclength == 1 && currentProduct.value == 0) {
    showEditProduct.value = true;
  } else if (disclength == 1 && currentProduct.value == 1) {
    showEditProduct.value = false;
  }
};

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
        console.log(ScreenKeyOrigin.value[index].itemDiscYn);
        console.log(currentProduct.value);
        if (ScreenKeyOrigin.value[index].itemDiscYn != currentProduct.value) {
          KeyList.value = KeyList.value.filter(
            (item) => item.intScreenNo !== clickedScreenNo.value
          );
        }

        ScreenKeyOrigin.value[index].strScreenName = currentscreenKeyNm.value;
        ScreenKeyOrigin.value[index].itemDiscYn = currentProduct.value;

        changeScreenKey.value = false;
        console.log(ScreenKeyOrigin.value);
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
    console.log(ScreenKeyOrigin.value);
    addfor4ScreenKey();
    currentscreenKeyNm.value = "";
    showKeys(clickedScreenNo.value);
    currentProduct.value = "0";
  } else {
    ScreenKeyOrigin.value[index].strScreenName = currentscreenKeyNm.value;
    changeScreenKey.value = false;
    console.log(ScreenKeyOrigin.value);
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

const addfor30MenuKeys = () => {
  const length = items.value.length;
  if (length < 30) {
    for (var i = 0; i < 30 - length; i++) {
      items.value.push({ strScreenName: "", intScreenNo: "" });
    }
  }
};

const addScreenKey = (value) => {
  currentscreenKeyNm.value = "";
  addscreenKey.value = true;
  console.log(value);
  clickedScreenNo.value = value + 1;
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
  let newScreenNo;
  if (ScreenKeyOrigin.value.length == 0) {
    newScreenNo = 1;
  } else {
    newScreenNo =
      ScreenKeyOrigin.value[ScreenKeyOrigin.value.length - 1].intScreenNo + 1;
  }

  ScreenKeyOrigin.value.push({
    strScreenName: currentscreenKeyNm.value,
    intScreenNo: newScreenNo,
    intScreenType: currentpaymentCd.value,
  });
  addscreenKey.value = false;
  addfor4ScreenKey();
  console.log(ScreenKeyOrigin.value);
  currentscreenKeyNm.value = "";
  console.log(clickedScreenNo.value);
  showKeys(clickedScreenNo.value + (currentsubPage.value - 1) * 10);
};

const existMenuKey = ref(false);
const clickedRealIndex = ref();
const saveMenuKeyposition = (index) => {
  console.log(clickedintScreenNo.value);
  console.log(index);
  console.log(items.value);
  clickedRealIndex.value = (currmenuKeyPage.value - 1) * 16 + index + 1;
  console.log(clickedRealIndex.value);
};

const addKey = () => {
  const foraddIndex = KeyList.value.findIndex(
    (item) =>
      item.intPosNo == posNo.value &&
      item.intScreenNo == clickedintScreenNo.value &&
      item.intKeySeq == clickedRealIndex.value
  );

  console.log(clickedintScreenNo.value);
  if (foraddIndex == -1) {
    KeyList.value.push({
      intKeyNo: currentpaymentCd.value,
      intKeySeq: clickedRealIndex.value,
      intPosNo: posNo.value,
      intScreenNo: clickedintScreenNo.value,
      lngKeyScrNo: Number(clickedCode.value),
      strName: clickedstrName.value,
      itemDiscYn: 0,
    });
  } else {
    KeyList.value[foraddIndex] = {
      intKeyNo: currentpaymentCd.value,
      intKeySeq: clickedRealIndex.value,
      intPosNo: posNo.value,
      intScreenNo: clickedintScreenNo.value,
      lngKeyScrNo: Number(clickedCode.value),
      strName: clickedstrName.value,
      itemDiscYn: 0,
    };
  }
  showKeys(clickedintScreenNo.value);
  console.log(KeyList.value);
};

const addTLUKey = () => {
  console.log(KeyList.value);
  const foraddIndex = KeyList.value.findIndex(
    (item) => item.intKeySeq == clickedRealIndex.value
  );
  console.log(foraddIndex);
  if (foraddIndex == -1) {
    KeyList.value.push({
      intKeyNo: 6,
      intKeySeq: clickedRealIndex.value,
      intPosNo: posNo.value,
      intScreenNo: clickedintScreenNo.value,
      lngKeyscrNo: Number(clickedTLUCD.value),
      strKeyName: clickedTLUNM.value,
    });
  } else {
    KeyList.value[foraddIndex] = {
      intKeyNo: 6,
      intKeySeq: clickedRealIndex.value,
      intPosNo: posNo.value,
      intScreenNo: clickedintScreenNo.value,
      lngKeyscrNo: Number(clickedTLUCD.value),
      strKeyName: clickedTLUNM.value,
    };
  }
  showKeys(clickedintScreenNo.value);
};

const deletekey = () => {
  if (clickedScreenOrMenu.value == false) {
    ScreenKeyOrigin.value = ScreenKeyOrigin.value.filter(
      (item) => item.intScreenNo != clickedintScreenNo.value
    );
    addscreenKey.value = false;
    addfor4ScreenKey();

    KeyList.value = KeyList.value.filter(
      (item) => item.intScreenNo != clickedintScreenNo.value
    );
    currentscreenKeyNm.value = "";

    clickedintScreenNo.value = clickedintScreenNo.value + 1;
    showKeys(clickedintScreenNo.value);
  } else {
    KeyList.value = KeyList.value.filter(
      (item) =>
        item.intScreenNo != clickedintScreenNo.value ||
        item.intKeySeq != clickedRealIndex.value
    );
    console.log(KeyList.value);
    showKeys(clickedintScreenNo.value);
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
