<template>
  <div class="flex flex-col w-full overflow-y-auto">
    <div class="flex justify-between w-full pl-10 pt-5">
      <div class="flex justify-between">
        <h1 class="font-bold text-sm md:text-2xl w-full">메뉴키 설정</h1>
      </div>
      <div class="flex space-x-6 pr-12">
        <button class="button search" @click="searchMenu">조회</button
        ><button class="button save" @click="saveMenuKey">저장</button
        ><button class="button copy" @click="showPopupf">
          <font-awesome-icon icon="copy" />&nbsp;&nbsp;메뉴키&nbsp;복사
        </button>
        <button class="button primary" @click="SpecificMenuDupli">
          <font-awesome-icon icon="copy" />&nbsp;&nbsp;메뉴키화면키&nbsp;복사
        </button>
      </div>
    </div>

    <div class="flex bg-gray-200 rounded-lg h-16 w-full items-center mt-5">
      <PickStore
        @areaCd="handleStoreAreaCd"
        @update:storeCd="handleStoreCd"
        @posNo="handlePosNo"
        :showPosNo="true"
        :showScreenNo="true"
        @storeNm="handlestoreNm"
        @update:ischanged="handleinitAll"
        @screenNo="handleScreenNo"
        @changed2="changed2">
      </PickStore>
    </div>
  </div>
  <br />
  <div class="z-50">
    <DupliPopUp
      :isVisible="showPopup2"
      @close="showPopup2 = false"
      :storeCd="nowStoreCd"
      :storeNm="clickedStoreNm"
      :areaCd="nowStoreAreaCd"
      :posNo="posNo"
      :progname="'MST01_004INS_VUE'"
      :dupliapiname="'dupliPos'"
      :progid="2"
      :poskiosk="'getStoreAndPosList'"
      :naming="'POS번호'">
    </DupliPopUp>
    <DupliPopUp2
      :isVisible="showSpecificMenukey"
      @close="showSpecificMenukey = false"
      :storeCd="nowStoreCd"
      :storeNm="clickedStoreNm"
      :areaCd="nowStoreAreaCd"
      :posNo="posNo"
      :progname="'MST01_004INS_VUE'"
      :progid="2"
      :dupliapiname="'dupliPos2'"
      :nowscreenNo="nowscreenNo"></DupliPopUp2>
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
    v-if="showScreenNm == true"
    class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-white p-6 rounded shadow-lg w-[25%] h-[40%]">
      <h2 class="text-lg font-bold">화면명을 입력하세요</h2>
      <div class="flex flex-col justify-start h-12">
        <div>
          <p>화면키명</p>
        </div>
        <div class="h-full w-full rounded-sm">
          <input
            type="text"
            class="border border-gray-400 pl-1 h-14 w-full rounded-sm"
            v-model="currentSelectedMenuNm" />
        </div>
      </div>
      <div class="flex justify-center space-x-3 w-full h-16 mt-28">
        <button
          @click="addScreenKeyf()"
          class="mt-4 p-2 bg-blue-500 text-white rounded">
          확인
        </button>
        <button
          @click="showScreenNm = false"
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
          class="p-4 bg-gray-200 rounded-lg shadow-md cursor-move h-14"
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
    class="h-5 -mt-1 flex justify-between items-center w-[930px] ml-[680px] z-40">
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
            :class="{ 'text-blue-600': currentMenu == 1 }"
            @click="showMenus(1)">
            메뉴관리
          </button>
          <button
            class="contents_tab-button"
            :class="{ 'text-blue-600': currentMenu == 2 }"
            @click="showMenus(2)">
            TLU관리
          </button>
          <!-- <button
            class="contents_tab-button"
            :class="{ 'text-blue-600': currentMenu == 3 }"
            @click="showMenus(3)">
            화면관리
          </button> -->
        </div>
        <div class="mt-3">
          <!-- <button class="whitebutton" @click="searchMenuList3">조회</button> -->
          <button class="whitebutton" v-if="currentMenu != 3">추가</button>
        </div>
      </div>
      <div class="h-4/6" v-show="currentMenu == 1">
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
        <div class="ml-10 mt-5 w-full h-[170%]">
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

      <div class="h-4/6" v-show="currentMenu == 2">
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
      <div class="h-full" v-show="currentMenu == 3">
        <div class="mt-7 ml-10 w-full h-[160%]">
          <Realgrid
            class="h-full"
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
    </div>
    <div class="grid grid-rows-1 grid-cols-1 ml-10 w-full h-full z-20">
      <div class="flex h-[760px] w-[950px] mt-10 ml-8" v-show="afterSearch">
        <VueDraggableNext
          v-model="items"
          :move="onMove"
          @end="onEnd"
          animation="200"
          class="grid grid-cols-5 grid-rows-9 gap-1 w-[950px] h-[760px]">
          <div
            v-for="(item, index) in items"
            class="flex items-center justify-center h-20 w-44 rounded-2xl shadow-sm border border-gray-500"
            :class="{ '!bg-orange-500': clickedMenuKey == index }"
            @click="
              saveMenuKeyposition(index);
              clickedMenuKey = index;
              clickedMenukeys();
            ">
            <span class="flex flex-col">
              <span v-if="item.intKeyNo == 1"
                >(Screen. {{ item.lngKeyscrNo }} )</span
              >
              <span v-if="item.intKeyNo == 6"
                >{{ item.lngKeyscrNo }} <br />{{ item.strKeyName }}</span
              >
              <span v-if="item.intKeyNo == 7"
                >{{ item.lngKeyscrNo }} <br />{{ item.strKeyName }}</span
              >
              <span v-if="item.intKeyNo == 1">{{
                item ? formatStrKeyName(item.strKeyName).part1 : ""
              }}</span>
              <span class="ml-16" v-if="item.intKeyNo == 6">{{
                item.lngKeyscrNo
                  ? Number(item.lngPrice).toLocaleString() + "원"
                  : ""
              }}</span>
            </span>
          </div>
        </VueDraggableNext>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  getMenuKeyList2,
  getMenuList,
  getScreenList2,
  getTLUList,
  saveAllMenuKey,
  saveMenuKey2,
  saveScreenKeys,
} from "@/api/master";
import DupliPopUp from "@/components/dupliPopUp.vue";
import DupliPopUp2 from "@/components/dupliPopUp2.vue";
import PickStore from "@/components/pickStore.vue";
import Realgrid from "@/components/realgrid.vue";
import RealGrid, { GridView, LocalDataProvider } from "realgrid";
import Swal from "sweetalert2";
import { onMounted, ref, watch } from "vue";
import { VueDraggableNext } from "vue-draggable-next";
import { useStore } from "vuex";

// 더미 데이터
const items = ref([]);
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
const changePopup = ref(false);
const deleteAllitems = ref([]);
const popupData = ref([]);
const confirmitem = ref([]);
const languageName0 = ref("");
const languageName1 = ref("");
const languageName2 = ref("");
const languageName3 = ref("");
const languageName4 = ref("");
const currentscreenKeyNm = ref("");
const clickedSubCode = ref();
const maxSubCode = ref();
const posNo = ref();
const changeScreenKey = ref(false);
const currmenuKeyPage = ref(1);
const AllscreenKeyPage = ref(1);
const currentSelectedMenuNm = ref("");
const showSpecificMenukey = ref(false);
const searchword3 = ref("");
const rowData = ref([
  { screenName: "화면1", add: "추가", screenNo: 1 },
  { screenName: "화면2", add: "추가", screenNo: 2 },
  { screenName: "화면3", add: "추가", screenNo: 3 },
  { screenName: "화면4", add: "추가", screenNo: 4 },
  { screenName: "화면5", add: "추가", screenNo: 5 },
  { screenName: "화면6", add: "추가", screenNo: 6 },
  { screenName: "화면7", add: "추가", screenNo: 7 },
  { screenName: "화면8", add: "추가", screenNo: 8 },
  { screenName: "화면9", add: "추가", screenNo: 9 },
  { screenName: "화면10", add: "추가", screenNo: 10 },
  { screenName: "화면11", add: "추가", screenNo: 11 },
  { screenName: "화면12", add: "추가", screenNo: 12 },
  { screenName: "화면13", add: "추가", screenNo: 13 },
  { screenName: "화면14", add: "추가", screenNo: 14 },
  { screenName: "화면15", add: "추가", screenNo: 15 },
  { screenName: "화면16", add: "추가", screenNo: 16 },
  { screenName: "화면17", add: "추가", screenNo: 17 },
  { screenName: "화면18", add: "추가", screenNo: 18 },
  { screenName: "화면19", add: "추가", screenNo: 19 },
  { screenName: "화면20", add: "추가", screenNo: 20 },
]);

const isNew = ref(false);
const currentMenu = ref("1");
const SpecificMenuDupli = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고.",
      text: "조회를 먼저 해주세요",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  showSpecificMenukey.value = true;
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
const showScreenNm = ref(false);
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
const currentSelectedMenuCode = ref();
const currentSelectedMenuPrice = ref();

const selcetedrowData = (e) => {
  if (clickedRealIndex.value == null) {
    return;
  }
  //console.log(e);
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
  addMenuKey2();
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

const searchword1 = ref("");
function formatStrKeyName(strKeyName) {
  // 첫 번째 파싱: '/' 기준으로 분리
  if (strKeyName == null || strKeyName == undefined) {
    return "";
  }
  const firstSplit = strKeyName.split("/");

  // 두 번째 파싱: '(' 기준으로 분리
  const secondSplit = firstSplit[1] ? firstSplit[1].split("(") : [null];

  // 결과 반환
  return {
    part1: firstSplit[0], // 첫 번째 부분 ("/" 기준)
    part2: secondSplit[0], // 두 번째 부분 ("(" 기준)
    part3: secondSplit[1] ? secondSplit[1].replace(")", "") : null, // 괄호 안 내용
  };
}
const changed2 = (newvalue) => {
  MenuKeyList.value = [];
  items.value = [];
};

const updateMenuKey = ref(false);
let dupliitems = [];

const saveMenuKey = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고.",
      text: "조회를 먼저 해주세요.",
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
  const keyseq = MenuKeyList.value.map((item) => item.intKeySeq);
  const keyname = MenuKeyList.value.map((item) => item.strKeyName);
  const keyscrno = MenuKeyList.value.map((item) => item.lngKeyscrNo);
  const keycolor = MenuKeyList.value.map((item) => item.lngKeyColor);
  const keyno = MenuKeyList.value.map((item) => item.intKeyNo);
  Swal.fire({
    title: "저장",
    text: "저장 하시겠습니까?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "저장",
    cancelButtonText: "취소",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        store.state.loading = true;
        const res = await saveMenuKey2(
          groupCd.value,
          nowStoreCd.value,
          nowStoreAreaCd.value,
          posNo.value,
          keyseq.join(","),
          keyname.join(","),
          keyscrno.join(","),
          keycolor.join(","),
          keyno.join(",")
        );
        console.log(res);
        if (res.data.RESULT_CD == "00") {
          Swal.fire({
            title: "저장 되었습니다.",
            confirmButtonText: "확인",
          });
        }
      } catch (error) {
      } finally {
        store.state.loading = false;
        searchMenu();
      }
    }
  });
};
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
  const res2 = await getMenuList(groupCd.value, nowStoreCd.value);
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
const screenNoList = ref([]);
const MenuGroup = ref([]);
const SubMenuGroup = ref([]);

const store = useStore();

const showMenuKeyList = ref([]);
const userData = store.state.userData;
const groupCd = ref(userData.lngStoreGroup);
const modified = ref(false);
const afterSearch = ref(false);
const MenuList = ref([]);
const MenuKeyList = ref([]);
const clickedScreenOrMenu = ref(false);
const TLUList = ref([]);
const confirmitem2 = ref([]);
const clickedScreenNo = ref();
const changePage = ref(false);
const searchMenu = async () => {
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
  if (posNo.value == "0" || posNo.value == undefined) {
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
  if (nowscreenNo.value == "0" || nowscreenNo.value == undefined) {
    Swal.fire({
      title: "경고",
      text: "화면번호를 선택하세요.",
      icon: "warning",
      showCancelButton: false,
      confirmButtonColor: "#3085d6",
      allowOutsideClick: false,
    });
    return;
  }
  store.state.loading = true;
  try {
    MenuKeyList.value = [];
    items.value = [];

    const res3 = await getScreenList2(
      groupCd.value,
      nowStoreCd.value,
      nowStoreAreaCd.value,
      posNo.value
    );

    console.log(res3);
    const res4 = await getMenuKeyList2(
      groupCd.value,
      nowStoreCd.value,
      nowStoreAreaCd.value,
      posNo.value
    );

    MenuKeyList.value = res4.data.MenukeyList;
    screenNoList.value = res3.data.ScreenList;

    confirmitem.value = JSON.parse(JSON.stringify(MenuKeyList.value));
    confirmitem2.value = JSON.parse(JSON.stringify(ScreenKeyOrigin.value));
    AllscreenKeyPage.value = Math.ceil(ScreenKeyOrigin.value.length / 10);

    const filteredList = MenuKeyList.value.filter(
      (item) =>
        item.intKeySeq >= (nowscreenNo.value - 1) * 45 &&
        item.intKeySeq <= nowscreenNo.value * 45
    );

    const startIndex = (nowscreenNo.value - 1) * 45;
    const endIndex = nowscreenNo.value * 45;
    // 중간에 비어 있는 번호 확인 및 채우기
    for (let i = startIndex; i < endIndex; i++) {
      // 해당 번호가 없는 경우 기본값 추가
      const existingItem = filteredList.find(
        (item) => item.intKeySeq === i + 1
      );
      if (existingItem) {
        items.value.push(existingItem);
      } else {
        items.value.push({
          intKeySeq: i,
          strKeyName: ``, // 기본값 또는 placeholder
        });
      }
    }
    console.log(MenuKeyList.value);

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
const showMenuKey = (value) => {
  items.value = Array.from({ length: 45 }, (_, index) => ({
    intKeySeq: index + 1,
  }));
  console.log(MenuKeyList.value);
  console.log(nowscreenNo.value);
  const filteredList = MenuKeyList.value.filter(
    (item) =>
      item.intKeySeq >= (nowscreenNo.value - 1) * 45 + 1 &&
      item.intKeySeq <= nowscreenNo.value * 45
  );
  console.log(filteredList);
  const startIndex = (nowscreenNo.value - 1) * 45 + 1;
  const endIndex = nowscreenNo.value * 45;
  // 중간에 비어 있는 번호 확인 및 채우기
  for (let i = startIndex; i <= endIndex; i++) {
    // 해당 번호가 없는 경우 기본값 추가
    const existingItem = filteredList.find((item) => item.intKeySeq === i);

    const targetIndex = items.value.findIndex(
      (item) => item.intKeySeq === i - startIndex + 1
    );

    if (targetIndex !== -1 && existingItem) {
      items.value[targetIndex] = existingItem;
    } else {
    }
  }

  // if (clickedintScreenNo.value != value) {
  //   currmenuKeyPage.value = 1;
  // }
  // clickedintScreenNo.value = value;
  // items.value = Array.from({ length: 30 }, (_, index) => ({
  //   intKeySeq: index + 1,
  // }));

  // MenuKeyList.value
  //   .filter((item) => item.intPosNo == posNo.value && item.intScreenNo == value)
  //   .forEach((item) => {
  //     const position = item.intKeySeq - (currmenuKeyPage.value - 1) * 30 - 1;
  //     if (position >= 0 && position < 30) {
  //       items.value[position] = item;
  //     }
  //   });
};
watch(ScreenKeys, (newvalue) => {
  if (ScreenKeys.value.length > 10) {
    AllscreenKeyPage.value = Math.ceil(ScreenKeys.value.length / 10);
  }
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
    console.log(MenuKeyList.value);
    const oldIndex = evt.oldIndex; // 드래그된 아이템의 기존 인덱스
    const swappedItems = [...items.value]; // items를 복사
    const temp = swappedItems[oldIndex];

    swappedItems[oldIndex] = swappedItems[targetItemIndex2];

    swappedItems[targetItemIndex2] = temp;

    items.value = swappedItems.map((item, index) => ({
      ...item, // 기존 객체의 다른 속성 유지
      intKeySeq: index + (nowscreenNo.value - 1) * 45 + 1, // 배열 순서대로 intKeySeq 재정렬
    }));
  } else {
    updateMenuKey.value = true;
    items.value = items.value.map((item, index) => ({
      ...item, // 기존 객체의 다른 속성 유지
      intKeySeq: index + (nowscreenNo.value - 1) * 45 + 1, // 배열 순서대로 intKeySeq 재정렬
    }));
  }

  console.log(items.value);
};
function formatNumber(value) {
  if (!value) return "";
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
const onEnd2 = (evt) => {
  console.log(ScreenKeyOrigin.value);
  const originScreenNo = dupliScreenKeyOrigin[evt.oldIndex].intScreenNo;
  const targetScreenNo = dupliScreenKeyOrigin[targetItemIndex3].intScreenNo;
  ScreenKeyOrigin.value.forEach((item, index) => {
    item.intScreenNo = index + 1;
  });
  MenuKeyList.value
    .filter((item) => item.intPosNo == posNo.value)
    .forEach((item, index) => {
      if (item.intScreenNo == originScreenNo) {
        item.intScreenNo = targetItemIndex3 + 1;
      } else if (item.intScreenNo == targetScreenNo) {
        item.intScreenNo = evt.oldIndex + 1;
      }
    });
  addfor10ScreenKey();

  showMenuKey(clickedintScreenNo.value);
};
watch(items, (newvalue) => {
  console.log(newvalue);
  items.value.forEach((item) => {
    const index = MenuKeyList.value.findIndex(
      (m) => m.intKeySeq == item.intKeySeq
    );

    if (index !== -1) {
      MenuKeyList.value[index] = item; // 💥 여기서 items 걸로 덮어씌움
    } else {
      MenuKeyList.value.push(item); // 💥 없으면 추가
    }
  });
  console.log(MenuKeyList.value);
});

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

  if (JSON.stringify(confirmitem.value) === JSON.stringify(MenuList.value)) {
    Swal.fire({
      title: "경고",
      text: "변경된 항목이 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  Swal.fire({
    title: "저장하시겠습니까?",
    text: "변경사항을 저장하시겠습니까?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "저장",
    cancelButtonText: "취소",
    allowOutsideClick: false,
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        store.state.loading = true;
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
          title: "저장 성공",
          text: "변경 사항이 저장되었습니다.",
          icon: "success",
          confirmButtonText: "확인",
        });

        searchMenu();
      }
    }
  });

  // 빈공간 데이터를 넣으려고하는데 안 들어가고 조회가 안됨 // 빈 칸에 대한 것도 데이터를 불러와야 메뉴키위치를 정할 수 있음.
};

const searchMenuList = (e) => {
  searchword1.value = e.target.value;
};
// const searchMenuList3 = (e) => {
//   searchword3.value = e.target.value;
// };

const searchMenuList2 = (e) => {
  searchWord2 = e.target.value;
};

const handlePosNo = (newValue) => {
  posNo.value = newValue;
  console.log(posNo.value);
};
const nowscreenNo = ref();
const handleScreenNo = (newValue) => {
  nowscreenNo.value = newValue;
  console.log(nowscreenNo.value);
  showMenuKey(newValue);
};
watch(nowscreenNo, (newvalue) => {
  changePage.value = true;
  if (afterSearch.value) {
    showMenuKey(newvalue);
  }
  changePage.value = false;
});
// watch(
//   () => MenuList.value,
//   () => {
//     showMenuKeys(); // MenuKeyList 값이 변경될 때마다 그리드 업데이트
//   }
// );

const editScreenKey = (value) => {
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
  const length = ScreenKeys.value.length;
  if (length < 10) {
    ScreenKeys.value.push({ strScreenName: "", intScreenNo: "", new: true });
    for (var i = 0; i < 9 - length; i++) {
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
  const newScreenNo =
    ScreenKeyOrigin.value[ScreenKeyOrigin.value.length - 1].intScreenNo + 1;
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
  items.value = [...Array(30).fill(null)];
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

  items.value = [...Array(30).fill(null)];
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
const saveMenuKeyposition = (index) => {
  clickedScreenOrMenu.value = true;
  clickedMenuKeyIndex.value = index + 1 + (nowscreenNo.value - 1) * 45;
  clickedRealIndex.value = (nowscreenNo.value - 1) * 45 + index;
};

const clickedMenuKeyIndex = ref(null);
const addMenuKey = () => {
  console.log(clickedMenuKeyIndex.value);
  if (clickedMenuKeyIndex.value == null) {
    return;
  }
  console.log(items.value);
  const onScreenKey =
    nowscreenNo.value * 45 - clickedMenuKeyIndex.value >= 0 &&
    nowscreenNo.value * 45 - clickedMenuKeyIndex.value <= 10;
  console.log(clickedMenuKeyIndex.value);
  const a = items.value.find(
    (item) => item.intKeySeq == clickedMenuKeyIndex.value
  );
  if (a !== undefined) {
    a.intKeyNo = onScreenKey ? 1 : 6;
    a.intKeySeq = clickedMenuKeyIndex.value;
    a.intPosNo = posNo.value;
    a.lngKeyColor = "16769216";
    a.lngKeyscrNo = Number(currentSelectedMenuCode.value);
    a.strKeyName = currentSelectedMenuNm.value;
  }
  console.log(items.value);
  console.log(posNo.value);
  console.log(clickedMenuKeyIndex.value);
  console.log(MenuKeyList.value);
  const b = MenuKeyList.value.find(
    (item) =>
      item.intKeySeq == clickedMenuKeyIndex.value &&
      item.intPosNo == posNo.value
  );

  console.log(b);

  if (b !== undefined) {
    b.intKeyNo = onScreenKey ? 1 : 6;
    b.intKeySeq = clickedMenuKeyIndex.value;
    b.intPosNo = posNo.value;
    b.lngKeyColor = "16769216";
    b.lngKeyscrNo = Number(currentSelectedMenuCode.value);
    b.strKeyName = currentSelectedMenuNm.value;
  } else {
    MenuKeyList.value.push({
      intKeyNo: onScreenKey ? 1 : 6,
      intKeySeq: clickedMenuKeyIndex.value,
      intPosNo: posNo.value,
      lngKeyColor: "16769216",
      lngKeyscrNo: Number(currentSelectedMenuCode.value),
      strKeyName: currentSelectedMenuNm.value,
    });
  }

  // const foraddIndex = MenuKeyList.value.find(
  //   (item) =>
  //     item.intPosNo == posNo.value &&
  //     item.intKeySeq == clickedMenuKeyIndex.value
  // );

  // console.log(foraddIndex);
  // if (foraddIndex == undefined) {
  //   MenuKeyList.value.push({
  //     intKeyNo: 6,
  //     intKeySeq: clickedRealIndex.value,
  //     intPosNo: posNo.value,
  //     lngKeyscrNo: Number(currentSelectedMenuCode.value),
  //     strKeyName: currentSelectedMenuNm.value,
  //   });
  // } else {
  //   foraddIndex.lngKeyscrNo = Number(currentSelectedMenuCode.value);
  //   foraddIndex.strKeyName = currentSelectedMenuNm.value;
  // }

  showMenuKey(nowscreenNo.value);
  console.log(MenuKeyList.value);
};

const addMenuKey2 = () => {
  console.log(clickedMenuKeyIndex.value);
  if (clickedMenuKeyIndex.value == null) {
    return;
  }
  console.log(items.value);

  console.log(clickedMenuKeyIndex.value);
  const a = items.value.find(
    (item) => item.intKeySeq == clickedMenuKeyIndex.value
  );
  if (a !== undefined) {
    a.intKeyNo = 7;
    a.intKeySeq = clickedMenuKeyIndex.value;
    a.intPosNo = posNo.value;
    a.lngKeyColor = "16769216";
    a.lngKeyscrNo = Number(currentSelectedMenuCode.value);
    a.strKeyName = currentSelectedMenuNm.value;
  }
  console.log(items.value);
  console.log(posNo.value);
  console.log(clickedMenuKeyIndex.value);
  console.log(MenuKeyList.value);
  const b = MenuKeyList.value.find(
    (item) =>
      item.intKeySeq == clickedMenuKeyIndex.value &&
      item.intPosNo == posNo.value
  );

  console.log(b);

  if (b !== undefined) {
    b.intKeyNo = 7;
    b.intKeySeq = clickedMenuKeyIndex.value;
    b.intPosNo = posNo.value;
    b.lngKeyColor = "16769216";
    b.lngKeyscrNo = Number(currentSelectedMenuCode.value);
    b.strKeyName = currentSelectedMenuNm.value;
  } else {
    MenuKeyList.value.push({
      intKeyNo: 7,
      intKeySeq: clickedMenuKeyIndex.value,
      intPosNo: posNo.value,
      lngKeyColor: "16769216",
      lngKeyscrNo: Number(currentSelectedMenuCode.value),
      strKeyName: currentSelectedMenuNm.value,
    });
  }

  // const foraddIndex = MenuKeyList.value.find(
  //   (item) =>
  //     item.intPosNo == posNo.value &&
  //     item.intKeySeq == clickedMenuKeyIndex.value
  // );

  // console.log(foraddIndex);
  // if (foraddIndex == undefined) {
  //   MenuKeyList.value.push({
  //     intKeyNo: 6,
  //     intKeySeq: clickedRealIndex.value,
  //     intPosNo: posNo.value,
  //     lngKeyscrNo: Number(currentSelectedMenuCode.value),
  //     strKeyName: currentSelectedMenuNm.value,
  //   });
  // } else {
  //   foraddIndex.lngKeyscrNo = Number(currentSelectedMenuCode.value);
  //   foraddIndex.strKeyName = currentSelectedMenuNm.value;
  // }

  showMenuKey(nowscreenNo.value);
  console.log(MenuKeyList.value);
};

const addScreenKeyf = () => {
  console.log(MenuKeyList.value);
  console.log(clickedRealIndex.value);
  const foraddIndex = MenuKeyList.value.findIndex(
    (item) =>
      item.intKeySeq ==
      (nowscreenNo.value - 1) * 45 + clickedRealIndex.value + 1
  );
  console.log(foraddIndex);
  if (foraddIndex == -1) {
    MenuKeyList.value.push({
      intKeyNo: 1,
      intKeySeq: (nowscreenNo.value - 1) * 45 + clickedRealIndex.value + 1,
      intPosNo: posNo.value,
      lngKeyscrNo: Number(currentSelectedMenuCode.value),
      strKeyName: currentSelectedMenuNm.value,
      lngKeyColor: "16769216",
    });
  } else {
    MenuKeyList.value[foraddIndex] = {
      intKeyNo: 1,
      intKeySeq: (nowscreenNo.value - 1) * 45 + clickedRealIndex.value + 1,
      intPosNo: posNo.value,
      lngKeyscrNo: Number(currentSelectedMenuCode.value),
      strKeyName: currentSelectedMenuNm.value,
      lngKeyColor: "16769216",
    };
  }
  console.log(MenuKeyList.value);
  showScreenNm.value = false;
  showMenuKey();
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
      intKeySeq: clickedRealIndex.value + 1,
      intPosNo: posNo.value,
      intScreenNo: clickedintScreenNo.value,
      lngKeyscrNo: Number(clickedTLUCD.value),
      strKeyName: clickedTLUNM.value,
    });
  } else {
    MenuKeyList.value[foraddIndex] = {
      intKeyNo: 6,
      intKeySeq: clickedRealIndex.value + 1,
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
    currentMenu.value = value;
  } else if (value == 2) {
    currentMenuorTLU.value = true;
    currentMenu.value = value;
  } else {
    currentMenu.value = value;
  }
};
const deletekey = () => {
  if (clickedScreenOrMenu.value == true) {
    const filteredMenuKeyList = MenuKeyList.value.filter(
      (item) => item.intKeySeq != clickedRealIndex.value + 1
    );
    MenuKeyList.value = filteredMenuKeyList;
    showMenuKey();
  }
};

const clickedMenukeys = () => {
  clickedScreenOrMenu.value = true;
};
const clickedScreenKeys = () => {
  clickedScreenOrMenu.value = false;
};
const handleinitAll = (newvalue) => {
  afterSearch.value = false;
  MenuList.value = [];
  MenuGroup.value = [];
  SubMenuGroup.value = [];
  MenuKeyList.value = [];
  ScreenKeyOrigin.value = [];
  TLUList.value = [];
  AllscreenKeyPage.value = "1";
  MenuList.value = [];
  ScreenKeys.value = [];
  items.value = [];
  items.value = [];
  nowStoreAreaCd.value = "0";
  posNo.value = "0";
};
// watch(forsearchSub, (newvalue) => {
//   searchMenuList3();
// });
</script>

<style scoped></style>
