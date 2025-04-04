<template>
  <div class="flex justify-between items-center w-full overflow-y-auto">
    <div class="flex justify-start w-full pl-12 pt-4">
      <div class="flex justify-start">
        <h1 class="font-bold text-sm md:text-2xl w-full">메뉴키 설정(#)</h1>
      </div>
    </div>
    <div class="flex justify-center mr-10 space-x-2 pr-5">
      <button @click="searchButton" class="button search md:w-auto w-14">
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
      @storeNm="handlestoreNm"
      @update:ischanged="handleinitAll"
      :showPosNo="true"></PickStore>
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
      :dupliapiname="'DUPLIALLPOSDATA'"
      :progid="1"
      :poskiosk="'getStoreAndPosList'"
      :naming="'POS번호'">
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
        <div class="h-full w-full">
          <input
            type="text"
            class="border border-gray-400 pl-1 h-full w-full"
            v-model="currentscreenKeyNm" />
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
    <h1 class="font-bold text-xl z-40">메뉴키 설정</h1>
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
    <div class="flex flex-col w-3/5 h-4/6">
      <div
        class="flex justify-between mt-0 ml-10 w-full border-b border-b-gray-300">
        <div>
          <button
            class="contents_tab-button"
            :class="{ 'text-blue-600': currentMenu == false }"
            @click="showMenus(1)">
            메뉴관리
          </button>
          <button
            class="contents_tab-button"
            :class="{ 'text-blue-600': currentMenu == true }"
            @click="showMenus(2)">
            TLU관리
          </button>
        </div>
        <div class="mt-3">
          <!-- <button class="whitebutton" @click="searchMenuList3">조회</button> -->
          <button class="whitebutton">추가</button>
        </div>
      </div>
      <div class="h-4/6" v-show="currentMenu == false">
        <div
          class="mt-3 ml-10 grid grid-cols-[1fr,3fr] grid-rows-2 gap-0 w-full">
          <div class="customtableIndex border border-gray-400 rounded-tl-lg">
            메뉴분류
          </div>
          <div class="px-4 py-2 border border-gray-300 rounded-tr-lg flex">
            <select
              name="majorGroupCd"
              id=""
              class="flex-1"
              @change="setSubCd"
              v-model="forsearchMain">
              <option value="-1">전체</option>
              <option :value="i.GroupCd" v-for="i in MenuGroup">
                [{{ i.GroupCd }}]{{ i.majorGroupNm }}
              </option>
            </select>
            <select
              name="subGroupCd"
              id=""
              class="flex-1"
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
              @input="searchMenuList"
              v-model="searchword1" />
          </div>
        </div>
        <div class="ml-10 mt-5 w-full h-[180%]">
          <Realgrid
            :progname="'MST05_011INS_VUE'"
            :progid="1"
            :rowData="MenuList"
            @selcetedrowData="selcetedrowData"
            :searchColId="'menuCd,menuNm'"
            :searchColId3="['majorGroupCd', 'subGroupCd']"
            :searchValue="searchValue"
            :searchWord3="searchword1"></Realgrid>
        </div>
      </div>

      <div class="h-4/6" v-show="currentMenu">
        <div
          class="mt-3 ml-10 grid grid-cols-[1fr,3fr] grid-rows-1 gap-0 w-full">
          <div class="customtableIndex border border-gray-400 rounded-tl-lg">
            TLU명/코드
          </div>
          <div class="px-1 py-1 border border-gray-300 rounded-br-lg">
            <input
              type="text"
              class="border w-full h-full px-1 border-gray-400 rounded-lg"
              @input="searchMenuList2"
              v-model="searchword3" />
          </div>
        </div>
        <div class="ml-10 mt-5 w-full h-full">
          <Realgrid
            class="h-[120%]"
            :progname="'MST05_011INS_VUE'"
            :progid="2"
            :rowData="TLUList"
            @selcetedrowData="selcetedrowData2"
            @clickedRowData="clickedRowData"
            @realgridname="realgridname"
            :searchColId="'lngCode,strName'"
            :searchWord3="searchword3"></Realgrid>
          <Realgrid
            class="h-[70%] mt-5"
            :progname="'MST05_011INS_VUE'"
            :progid="3"
            :rowData="TLUSubList"
            @realgridname="realgridname2"></Realgrid>
        </div>
      </div>
    </div>
    <div class="grid grid-rows-[2fr,5fr] grid-cols-1 ml-10 w-full h-full z-20">
      <div class="flex h-full w-[950px] mt-10" v-show="afterSearch">
        <div
          class="grid grid-cols-5 grid-rows-2 gap-1 ml-10 mt-0 w-full h-[80%]">
          <div
            v-for="(item, index) in ScreenKeys"
            class="screen-muuri-sort-empty flex justify-center items-center w-full h-full"
            :class="{
              '!bg-orange-500 !border-blue-700': clickedScreenKeyIndex == index,
            }"
            @click="
              clickedScreenKeyIndex = index;
              clickedScreenKeys();
            ">
            <p
              v-if="item.strScreenName != ''"
              @click="showMenuKey(item.intScreenNo)"
              class="flex items-center justify-center w-full h-full">
              <button class="">{{ item.strScreenName }}</button
              ><button
                @click.stop="
                  editScreenKey(item.intScreenNo, item.strScreenName)
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
        <div class="flex flex-col mt-1 ml-2 w-10 h-5/6">
          <button
            class="border border-[#CCCCCC] w-full h-full rounded-md"
            @click="showPrev">
            <img src="../../assets/arrow_up_wo_border.svg" alt="" /></button
          ><button
            class="border border-[#CCCCCC] h-full rounded-md"
            @click="showScreenKeysOrder">
            <img src="../../assets/table-change_2.svg" alt="" /></button
          ><button
            class="border border-[#CCCCCC] w-full h-full rounded-md"
            @click="showNext">
            <img src="../../assets/arrow_down_wo_border.svg" alt="" />
          </button>
          {{ currentsubPage }}/{{ AllscreenKeyPage }}
        </div>
      </div>
      <div v-show="afterSearch" class="flex -mt-2 w-[950px] h-[95%]">
        <div class="flex w-full h-full">
          <VueDraggableNext
            v-model="items"
            :move="onMove"
            @end="onEnd"
            animation="200"
            class="grid grid-cols-5 grid-rows-6 ml-10 mt-4 w-full h-full gap-1">
            <div
              v-for="(item, index) in items"
              :key="index"
              class="screen-muuri-sort-empty flex items-center justify-center"
              :class="{ ' !border-blue-700': clickedMenuKey == index }"
              @click="
                saveMenuKeyposition(index);
                clickedMenuKey = index;
                clickedMenukeys();
              ">
              <span class="flex flex-col w-full h-full"
                ><span class="mt-3">{{ item ? item.lngKeyscrNo : "" }}</span
                ><span>{{ item ? item.strKeyName : "" }}</span
                ><span class="flex justify-end pr-3">{{
                  item.lngPrice ? formatNumber(item.lngPrice) + "원" : ""
                }}</span></span
              >
            </div>
          </VueDraggableNext>
          <div
            class="flex flex-col ml-3 w-10 h-full mt-5 items-center justify-center">
            <div
              class="border flex items-center border-[#CCCCCC] w-full h-full rounded-md"
              @click="prevMenuKey">
              <img src="../../assets/arrow_up_wo_border.svg" alt="" />
            </div>
            <div
              class="border border-[#CCCCCC] w-full h-full rounded-md flex items-center"
              @click="nextMenuKey">
              <img src="../../assets/arrow_down_wo_border.svg" alt="" />
            </div>
            <div>{{ currmenuKeyPage }} /33</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  getMenuKeyList,
  getMenuList,
  getScreenList,
  getTLUList,
  saveAllMenuKey,
  saveScreenKeys,
} from "@/api/master";
import DupliPopUp from "@/components/dupliPopUp.vue";
import PickStore from "@/components/pickStore.vue";
import Realgrid from "@/components/realgrid.vue";
import RealGrid from "realgrid";
import Swal from "sweetalert2";
import { ref, watch } from "vue";
import { VueDraggableNext } from "vue-draggable-next";
import { useStore } from "vuex";

// 더미 데이터
const items = ref([
  { intKeySeq: 1 },
  { intKeySeq: 2 },
  { intKeySeq: 3 },
  { intKeySeq: 4 },
  { intKeySeq: 5 },
  { intKeySeq: 6 },
  { intKeySeq: 7 },
  { intKeySeq: 8 },
  { intKeySeq: 9 },
  { intKeySeq: 10 },
  { intKeySeq: 11 },
  { intKeySeq: 12 },
  { intKeySeq: 13 },
  { intKeySeq: 14 },
  { intKeySeq: 15 },
  { intKeySeq: 16 },
  { intKeySeq: 17 },
  { intKeySeq: 18 },
  { intKeySeq: 19 },
  { intKeySeq: 20 },
  { intKeySeq: 21 },
  { intKeySeq: 22 },
  { intKeySeq: 23 },
  { intKeySeq: 24 },
  { intKeySeq: 25 },
  { intKeySeq: 26 },
  { intKeySeq: 27 },
  { intKeySeq: 28 },
  { intKeySeq: 29 },
  { intKeySeq: 30 },
]);

const clickedScreenKeyIndex = ref();
const ScreenKeyOrigin = ref([]);
const clickedMenuKey = ref();
const ScreenKeys = ref();
const currentMenuorTLU = ref(false);
const forsearchMain = ref(-1);
const forsearchSub = ref(-1);
const addscreenKey = ref(false);
const searchWord = ref("");
const searchWord2 = ref("");
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
const clickedStoreNm = ref();
const handlestoreNm = (newData) => {
  clickedStoreNm.value = newData;
};
const showPopup2 = ref(false);
const showChangeScreenKey = ref(false);

const confirmitem = ref([]);
const confirmitem2 = ref([]);

const currentscreenKeyNm = ref("");
const maxSubCode = ref();
const posNo = ref();
const changeScreenKey = ref(false);
const currmenuKeyPage = ref(1);
const AllscreenKeyPage = ref(1);
const currentSelectedMenuNm = ref("");

const isNew = ref(false);
const currentMenu = ref(false);

const showPopupf = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고.",
      text: "조회를 먼저 해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  showPopup2.value = true;
};

const searchMenuList2 = (e) => {
  searchword3.value = e.target.value;
};
const realgrid2Name = ref("");
const realgridname = (e) => {
  realgrid2Name.value = e;
};
const realgrid3Name = ref("");
const realgridname2 = (e) => {
  realgrid3Name.value = e;
};

watch(currentMenu, () => {
  const reagrid2 = document.getElementById(realgrid2Name.value);
  setTimeout(() => {
    RealGrid.getGridInstance(reagrid2).resetSize();
    RealGrid.getGridInstance(reagrid2).refresh(true);
  }, 100);

  const realgrid3 = document.getElementById(realgrid3Name.value);
  setTimeout(() => {
    RealGrid.getGridInstance(realgrid3).resetSize();
    RealGrid.getGridInstance(realgrid3).refresh(true);
  }, 100);
});

const showNext = () => {
  if (currentsubPage.value >= AllscreenKeyPage.value) {
    return;
  }
  currentsubPage.value++;

  addfor10ScreenKey();
};
const showPrev = () => {
  console.log(ScreenKeyOrigin.value);
  if (currentsubPage.value == 1) {
    return;
  }
  currentsubPage.value--;
  ScreenKeys.value = ScreenKeyOrigin.value.slice(
    10 * (currentsubPage.value - 1),
    10 * (currentsubPage.value - 1) + 10
  );
};
const updateMenuKey = ref(false);
let dupliitems = [];

// const saveMenuKeys = () => {
//   let dupliitems = [...items.value];
//   for (var i = 0; i < dupliitems.length; i++) {
//     if (dupliitems[i].lngKeyscrNo != "") {
//       dupliitems[i].intKeySeq = (i + 1).toString();
//     }
//   }
//   const updatedMenuKeys = dupliitems.filter((item) => item.lngKeyscrNo != "");
//   console.log(updatedMenuKeys);
// };
const nowStoreAreaCd = ref();
const handleStoreAreaCd = (newValue) => {
  nowStoreAreaCd.value = newValue;
  console.log(nowStoreAreaCd.value);
};

const searchMenuList = (e) => {
  searchword1.value = e.target.value;
};
const nowStoreCd = ref();
const afterCategory = ref(false);
const handleStoreCd = async (newValue) => {
  if (newValue == "0") {
    afterSearch.value = false;
  }
  nowStoreCd.value = newValue;
  const res2 = await getMenuList(groupCd.value, nowStoreCd.value);

  console.log(res2);
  MenuList.value = res2.data.menuList;
  MenuGroup.value = res2.data.menuGroup;
  SubMenuGroup.value = res2.data.submenuGroup;

  MenuList.value = MenuList.value.map((item) => {
    return {
      ...item,
      add: "추가",
    };
  });
  const res5 = await getTLUList(groupCd.value, nowStoreCd.value);
  console.log(res5);
  TLUList.value = res5.data.TLUList;
  TLUList.value = TLUList.value.map((item) => {
    return {
      ...item,
      add: "추가",
    };
  });
};
const selectedButton = ref();
const Category = ref([]);
const getMultiLang = ref([]);
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
      text: "포스번호를 선택하세요.",
      icon: "warning",
      showCancelButton: false,
      confirmButtonColor: "#3085d6",
      allowOutsideClick: false,
    });
    return;
  }
  store.state.loading = true;
  try {
    const res3 = await getScreenList(
      groupCd.value,
      nowStoreCd.value,
      nowStoreAreaCd.value,
      posNo.value
    );
    const res4 = await getMenuKeyList(
      groupCd.value,
      nowStoreCd.value,
      nowStoreAreaCd.value
    );
    MenuKeyList.value = res4.data.MenuKeyList;
    ScreenKeyOrigin.value = res3.data.ScreenList;
    console.log(ScreenKeyOrigin.value);
    console.log(MenuKeyList.value);
    addfor10ScreenKey();
    AllscreenKeyPage.value = Math.ceil(ScreenKeyOrigin.value.length / 10);

    confirmitem.value = JSON.parse(JSON.stringify(MenuKeyList.value));
    confirmitem2.value = JSON.parse(JSON.stringify(ScreenKeyOrigin.value));

    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
  } finally {
    store.state.loading = false; // 로딩 상태 종료
    modified.value = false;
    afterCategory.value = false;
  }

  calculateMaxSubCode();
};
const filteredSubMenuGroup = ref([]);
const searchValue = ref([]);
const setSubCd = (e) => {
  const name = e.target.name;
  const value = e.target.value;
  console.log(SubMenuGroup.value);
  console.log(MenuGroup.value);
  if (name == "majorGroupCd") {
    filteredSubMenuGroup.value = SubMenuGroup.value.filter(
      (item) => item.sublngMajor == value
    );
    searchValue.value = [value, forsearchSub.value];
    forsearchSub.value = -1;
  } else if (name == "subGroupCd") {
    searchValue.value = [forsearchMain.value, value];
  }
};
const clickedintScreenNo = ref();
const calculateMaxSubCode = () => {
  maxSubCode.value = Math.max(
    ...Category.value
      .filter((item) => item.SubCategory && item.SubCategory.length > 0)
      .flatMap((item) => item.SubCategory.map((sub) => Number(sub.SubCode)))
  );
};

const TLUSubList = ref([]);
const clickedRowData = (e) => {
  TLUSubList.value = [];
  for (let i = 1; i <= 29; i++) {
    if (MenuList.value.filter((item) => item.menuCd == e[i]).length > 0) {
      TLUSubList.value.push({
        lngCode: e[i],
        strName: MenuList.value.filter((item) => item.menuCd == e[i])[0].menuNm,
      });
    }
  }
};
const selcetedrowData = (e) => {
  if (clickedRealIndex.value == null) {
    return;
  }
  console.log(e);
  currentSelectedMenuNm.value = e[1];
  currentSelectedMenuCode.value = e[0];
  currentSelectedMenuPrice.value = e[2];
  addMenuKey();
};

const selcetedrowData2 = (e) => {
  if (clickedRealIndex.value == null) {
    return;
  }
  console.log(e);
  currentSelectedMenuNm.value = e[1];
  currentSelectedMenuCode.value = e[0];
  currentSelectedMenuPrice.value = "";
  addMenuKey();
};
const showMenuKey = (value) => {
  if (clickedintScreenNo.value != value) {
    currmenuKeyPage.value = 1;
  }
  clickedintScreenNo.value = value;
  items.value = Array.from({ length: 30 }, (_, index) => ({
    intKeySeq: index + 1,
  }));

  MenuKeyList.value
    .filter((item) => item.intPosNo == posNo.value && item.intScreenNo == value)
    .forEach((item) => {
      const position = item.intKeySeq - (currmenuKeyPage.value - 1) * 30 - 1;
      if (position >= 0 && position < 30) {
        items.value[position] = item;
      }
    });
};
watch(ScreenKeys, (newvalue) => {
  console.log(ScreenKeys.value);

  AllscreenKeyPage.value = Math.floor(ScreenKeyOrigin.value.length / 10) + 1;
});
const showScreenKeysOrder = () => {
  showChangeScreenKey.value = !showChangeScreenKey.value;
};

let targetItemIndex2;
const onMove = (evt) => {
  // 예: 드래그 중 이동할 때의 조건 등을 설정할 수 있음
  if (changeMode.value == false) {
    targetItemIndex2 = Array.from(evt.from.children).indexOf(evt.related);
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
  return true;
};

const onEnd = (evt) => {
  // Swap을 처리할 조건
  if (changeMode.value === false) {
    const oldIndex = evt.oldIndex; // 드래그된 아이템의 기존 인덱스
    const swappedItems = [...items.value]; // items를 복사
    const temp = swappedItems[oldIndex];

    swappedItems[oldIndex] = swappedItems[targetItemIndex2];

    swappedItems[targetItemIndex2] = temp;

    // 배열을 업데이트
    items.value = swappedItems;

    console.log(items.value);
  } else {
    updateMenuKey.value = true;
  }

  console.log(items.value);
};
function formatNumber(value) {
  if (!value) return "";
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
const onEnd2 = (evt) => {
  const originScreenNo = dupliScreenKeyOrigin[evt.oldIndex].intScreenNo;
  const targetScreenNo = dupliScreenKeyOrigin[targetItemIndex3].intScreenNo;
  console.log(originScreenNo);
  console.log(targetScreenNo);
  console.log(ScreenKeyOrigin.value);
  console.log(MenuKeyList.value);
  let temparr = [];
  ScreenKeyOrigin.value.forEach((item, index) => {
    const tempScreenNo = item.intScreenNo;
    const targetScreenNo2 = index + 1;
    temparr.push(tempScreenNo);
    item.intScreenNo = targetScreenNo2;
  });

  MenuKeyList.value
    .filter((item) => item.intPosNo == posNo.value)
    .forEach((item, index) => {
      const targetindex = temparr.findIndex(
        (item2) => item2 == item.intScreenNo
      );
      item.intScreenNo = targetindex + 1;
    });

  addfor10ScreenKey();

  showMenuKey(clickedScreenKeyIndex.value + 1);
};
watch(items, (newvalue) => {
  // console.log(newvalue);
  // newvalue.forEach((item, index) => {
  //   if (item == null || item.lngKeyscrNo == null || item.lngKeyscrNo == "") {
  //     newvalue[index] = {
  //       intKeySeq: index + (currmenuKeyPage.value - 1) * 30 + 1,
  //     };
  //   } else {
  //     item.intKeySeq = index + (currmenuKeyPage.value - 1) * 30 + 1;
  //   }
  // });

  items.value.forEach((item, index) => {
    item.intKeySeq = index + (currmenuKeyPage.value - 1) * 30 + 1;
  });
  // items.value.forEach((item, index) => {
  //   if (item.lngKeyscrNo == null || item.lngKeyscrNo == undefined) {
  //     const a = MenuKeyList.value.find(
  //       (item2) =>
  //         item2.intKeySeq == item.intKeySeq + (currmenuKeyPage.value - 1) * 30
  //     );
  //     a.intKeySeq = (index+1) + (currmenuKeyPage.value - 1) * 30;

  //   } else {

  //   }

  // });
  console.log(items.value);
  console.log(MenuKeyList.value);
});
const savePosMenu = async () => {
  console.log(MenuKeyList.value);
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
    JSON.stringify(confirmitem.value) === JSON.stringify(MenuKeyList.value) &&
    JSON.stringify(confirmitem2.value) === JSON.stringify(ScreenKeyOrigin.value)
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
        console.log(screenKeyNoarr.join(","));
        console.log(screenKeyNamearr.join(","));
        const res = await saveScreenKeys(
          groupCd.value,
          nowStoreCd.value,
          nowStoreAreaCd.value,
          posNo.value,
          screenKeyNoarr.join(","),
          screenKeyNamearr.join(",")
        );

        const intKeySeqs = MenuKeyList.value
          .filter((item) => item.intPosNo == posNo.value)
          .map((item) => item.intKeySeq);
        const screenNumarr = MenuKeyList.value
          .filter((item) => item.intPosNo == posNo.value)
          .map((item) => item.intScreenNo);
        const lngScrarr = MenuKeyList.value
          .filter((item) => item.intPosNo == posNo.value)
          .map((item) => item.lngKeyscrNo);
        const menuKeyNmarr = MenuKeyList.value
          .filter((item) => item.intPosNo == posNo.value)
          .map((item) => item.strKeyName);
        console.log(posNo.value);
        console.log(intKeySeqs.join(","));
        console.log(screenNumarr.join(","));
        console.log(lngScrarr.join(","));
        console.log(menuKeyNmarr.join(","));
        const res2 = await saveAllMenuKey(
          groupCd.value,
          nowStoreCd.value,
          nowStoreAreaCd.value,
          posNo.value,
          intKeySeqs.join(","),
          screenNumarr.join(","),
          lngScrarr.join(","),
          menuKeyNmarr.join(",")
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

        searchButton();
      }
    }
  });

  // 빈공간 데이터를 넣으려고하는데 안 들어가고 조회가 안됨 // 빈 칸에 대한 것도 데이터를 불러와야 메뉴키위치를 정할 수 있음.
};

const currentSelectedMenuCode = ref("");
const currentSelectedMenuPrice = ref("");

//   watch(clickedTLUCD, (newValue) => {
//     const TLUMenuCd = TLUList.value
//       .filter(item => item.lngCode == newValue)  // lngCode가 newValue와 일치하는 항목 필터링
//       .map(item => {
//         // 객체의 모든 키를 가져오고 'lngMenu'로 시작하는 키들만 필터링
//         const filteredMenus = Object.keys(item)
//           .filter(key => key.startsWith('lngMenu') && item[key] !== 0)   // 'lngMenu'로 시작하는 키들만 필터링
//           .reduce((result, key) => {
//             result[key] = item[key];  // 필터링된 속성만 포함
//             return result;
//           }, {});
//         return filteredMenus;  // 필터링된 항목 반환
//       });

//     console.log(TLUMenuCd[0])
//     const newTLUMenus = [];

//     Object.keys(TLUMenuCd[0]).forEach(key => {

//       const menuValue = TLUMenuCd[0][key]; // menu1, menu2, ..., menu29 값 가져오기

//       const filteredMenus = MenuList.value.filter(menuItem => menuItem.menuCd === menuValue.toString());
//       newTLUMenus.push(...filteredMenus); // 결과 배열에 필터링된 메뉴들을 추가
//     });

//     console.log(newTLUMenus);

//     dataProvider3.setRows(newTLUMenus);
//   })
// }
// const searchMenuList = (e) => {
//   const searchWord1 = e.target.value;
//   searchWord.value = e.target.value;
//   const filteredList = MenuList.value.filter(
//     (item) =>
//       (forsearchMain.value === "0" ||
//         item.majorGroupCd === forsearchMain.value) &&
//       (forsearchSub.value === "0" || item.subGroupCd === forsearchSub.value) &&
//       (item.menuCd.includes(searchWord1) || item.menuNm.includes(searchWord1))
//   );
//   dataProvider.setRows(filteredList);
// };
// const searchMenuList3 = (e) => {
//   if (currentMenuorTLU.value == false) {
//     const filteredList = MenuList.value.filter(
//       (item) =>
//         (forsearchMain.value === "0" ||
//           item.majorGroupCd === forsearchMain.value) &&
//         (forsearchSub.value === "0" ||
//           item.subGroupCd === forsearchSub.value) &&
//         (item.menuCd.includes(searchWord.value) ||
//           item.menuNm.includes(searchWord.value))
//     );
//     dataProvider.setRows(filteredList);
//   } else {
//     const filteredList = TLUList.value.filter(
//       (item) =>
//         item.lngCode.toString().includes(searchWord2.value) ||
//         item.strName.includes(searchWord2.value)
//     );
//     dataProvider2.setRows(filteredList);
//   }
// };
// watch(forsearchSub, (newValue) => {
//   searchMenuList3();
// });
// const searchMenuList2 = (e) => {
//   const searchword2 = e.target.value;
//   searchWord2.value = e.target.value;
//   const filteredList = TLUList.value.filter(
//     (item) =>
//       item.lngCode.toString().includes(searchword2) ||
//       item.strName.includes(searchword2)
//   );

//   dataProvider2.setRows(filteredList);
// };

const handlePosNo = (newValue) => {
  posNo.value = newValue;
  console.log(posNo.value);
  if (
    nowStoreAreaCd.value != undefined ||
    (posNo.value != undefined && posNo.value != 0)
  ) {
    searchButton();
  }
};

// watch(
//   () => MenuList.value,
//   () => {
//     showMenuKeys();
//   }
// );
// watch(
//   () => TLUList.value,
//   () => {
//     showMenuKeys2();
//   }
// );

const editScreenKey = (value, value2) => {
  currentscreenKeyNm.value = value2;
  clickedScreenNo.value = value;
  changeScreenKey.value = true;
};

const exitScreenKey = () => {
  changeScreenKey.value = false;
  addscreenKey.value = false;
};
const confirmScreenKey = () => {
  const index = ScreenKeyOrigin.value.findIndex(
    (item) => item.intScreenNo == clickedScreenNo.value
  );
  ScreenKeyOrigin.value[index].strScreenName = currentscreenKeyNm.value;
  changeScreenKey.value = false;
  console.log(ScreenKeyOrigin.value);
  addfor10ScreenKey();
  currentscreenKeyNm.value = "";
  clickedScreenNo.value = "";
};

const addfor10ScreenKey = () => {
  ScreenKeys.value = [
    ...ScreenKeyOrigin.value.slice(
      10 * (currentsubPage.value - 1),
      10 * (currentsubPage.value - 1) + 10
    ),
  ];
  const validateScreenKeys = ScreenKeys.value.filter(
    (item) => item.intScreenNo != ""
  );
  if (validateScreenKeys.length < 10) {
    ScreenKeys.value.push({ strScreenName: "", intScreenNo: "", new: true });
    for (var i = 0; i < 9 - validateScreenKeys.length; i++) {
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
  });
  addscreenKey.value = false;
  addfor10ScreenKey();
  console.log(ScreenKeyOrigin.value);
  currentscreenKeyNm.value = "";
  console.log(clickedScreenNo.value);
  showMenuKey(clickedScreenNo.value + (currentsubPage.value - 1) * 10);
};

const prevMenuKey = () => {
  if (currmenuKeyPage.value == 1) {
    return;
  }
  currmenuKeyPage.value--;
  items.value = Array.from({ length: 30 }, (_, index) => ({
    intKeySeq: index + 1,
  }));
  MenuKeyList.value
    .filter(
      (item) =>
        item.intPosNo == posNo.value &&
        item.intScreenNo == clickedintScreenNo.value
    )
    .forEach((item) => {
      console.log(item);

      const position = item.intKeySeq - (currmenuKeyPage.value - 1) * 30 - 1;
      if (position >= 0 && position < 30) {
        items.value[position] = item;
      }
    });
};
const nextMenuKey = () => {
  if (currmenuKeyPage.value == 33) {
    return;
  }
  currmenuKeyPage.value++;

  items.value = Array.from({ length: 30 }, (_, index) => ({
    intKeySeq: index + 1,
  }));

  MenuKeyList.value
    .filter(
      (item) =>
        item.intPosNo == posNo.value &&
        item.intScreenNo == clickedintScreenNo.value
    )
    .forEach((item) => {
      console.log(item);
      const position = item.intKeySeq - (currmenuKeyPage.value - 1) * 30 - 1;
      if (position >= 0 && position < 30) {
        items.value[position] = item;
      }
    });
};
const existMenuKey = ref(false);
const clickedRealIndex = ref();
const clickedMenuKeyIndex = ref();
const saveMenuKeyposition = (index) => {
  console.log(clickedintScreenNo.value);
  console.log(index);
  console.log(items.value);
  clickedMenuKeyIndex.value = index + 1;
  clickedRealIndex.value = (currmenuKeyPage.value - 1) * 30 + index + 1;
  console.log(clickedRealIndex.value);
};

const addMenuKey = () => {
  console.log(clickedMenuKeyIndex.value);
  if (clickedMenuKeyIndex.value == null) {
    return;
  }
  console.log(items.value);
  items.value[clickedMenuKeyIndex.value] = {
    intKeyNo: 6,
    intKeySeq: clickedRealIndex.value,
    intPosNo: posNo.value,
    intScreenNo: clickedintScreenNo.value,
    lngKeyscrNo: Number(currentSelectedMenuCode.value),
    strKeyName: currentSelectedMenuNm.value,
    lngPrice: currentSelectedMenuPrice.value.substring(
      0,
      currentSelectedMenuPrice.value.length - 1
    ),
  };
  console.log(items.value);
  console.log(MenuKeyList.value);
  console.log(posNo.value);
  console.log(clickedintScreenNo.value);
  console.log(clickedRealIndex.value);
  const foraddIndex = MenuKeyList.value.find(
    (item) =>
      item.intPosNo == posNo.value &&
      item.intScreenNo == clickedintScreenNo.value &&
      item.intKeySeq == clickedRealIndex.value
  );

  console.log(foraddIndex);
  if (foraddIndex == undefined) {
    MenuKeyList.value.push({
      intKeyNo: 6,
      intKeySeq: clickedRealIndex.value,
      intPosNo: posNo.value,
      intScreenNo: clickedintScreenNo.value,
      lngKeyscrNo: Number(currentSelectedMenuCode.value),
      strKeyName: currentSelectedMenuNm.value,
      lngPrice: currentSelectedMenuPrice.value.substring(
        0,
        currentSelectedMenuPrice.value.length - 1
      ),
    });
  } else {
    foraddIndex.lngKeyscrNo = Number(currentSelectedMenuCode.value);
    foraddIndex.strKeyName = currentSelectedMenuNm.value;
    foraddIndex.lngPrice = currentSelectedMenuPrice.value.substring(
      0,
      currentSelectedMenuPrice.value.length - 1
    );
  }

  showMenuKey(clickedintScreenNo.value);
  console.log(MenuKeyList.value);
};

const addTLUKey = () => {
  console.log(MenuKeyList.value);
  const foraddIndex = MenuKeyList.value.findIndex(
    (item) => item.intKeySeq == clickedRealIndex.value
  );
  console.log(foraddIndex);
  if (foraddIndex == -1) {
    MenuKeyList.value.push({
      intKeyNo: 6,
      intKeySeq: clickedRealIndex.value,
      intPosNo: posNo.value,
      intScreenNo: clickedintScreenNo.value,
      lngKeyscrNo: Number(clickedTLUCD.value),
      strKeyName: clickedTLUNM.value,
    });
  } else {
    MenuKeyList.value[foraddIndex] = {
      intKeyNo: 6,
      intKeySeq: clickedRealIndex.value,
      intPosNo: posNo.value,
      intScreenNo: clickedintScreenNo.value,
      lngKeyscrNo: Number(clickedTLUCD.value),
      strKeyName: clickedTLUNM.value,
    };
  }
  showMenuKey(clickedintScreenNo.value);
};

const showMenus = (value) => {
  if (value == 1) {
    currentMenuorTLU.value = false;
    currentMenu.value = false;
  } else {
    currentMenuorTLU.value = true;
    currentMenu.value = true;
    //showMenuKeys2();
    // showMenuKeys3();
  }
};
const deletekey = () => {
  if (clickedScreenOrMenu.value == false) {
    console.log(ScreenKeyOrigin.value);
    ScreenKeyOrigin.value = ScreenKeyOrigin.value.filter(
      (item) => item.intScreenNo != clickedintScreenNo.value
    );
    addscreenKey.value = false;
    addfor10ScreenKey();

    MenuKeyList.value = MenuKeyList.value.filter(
      (item) => item.intScreenNo != clickedintScreenNo.value
    );
    currentscreenKeyNm.value = "";

    clickedintScreenNo.value = clickedintScreenNo.value + 1;
    showMenuKey(clickedintScreenNo.value);
  } else {
    MenuKeyList.value = MenuKeyList.value.filter(
      (item) =>
        item.intScreenNo != clickedintScreenNo.value ||
        item.intKeySeq != clickedRealIndex.value
    );
    console.log(MenuKeyList.value);
    showMenuKey(clickedintScreenNo.value);
  }
};

const clickedMenukeys = () => {
  clickedScreenOrMenu.value = true;
};
const clickedScreenKeys = () => {
  clickedScreenOrMenu.value = false;
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
  forsearchMain.value = "-1";
  forsearchSub.value = "-1";
  filteredSubMenuGroup.value = [];
  searchword1.value = "";
  searchword3.value = "";
  afterSearch.value = false;
};
</script>

<style scoped></style>
