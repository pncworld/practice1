/*--############################################################################
# Filename : MST01_010INS.vue                                                  
# Description : 마스터관리 > 메뉴 마스터 > TLU 메뉴 등록.                       
# Date :2025-05-14                                                             
# Author : 권맑음                     
################################################################################*/
<template>
  <!-- 조회 조건 -->
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
      @GroupNm="handleGroupNm">
    </PickStore>
  </div>
  <!-- 조회 조건 -->
  <!-- 그리드 및 버튼 영역 -->
  <span
    class="h-5 mt-3 flex justify-between items-center w-[900px] ml-[700px] z-40">
    <h1 class="font-bold text-xl z-40">TLU 설정</h1>
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
    <div class="flex flex-col w-3/5 h-full">
      <div
        class="flex justify-between mt-0 ml-10 w-full border-b border-b-gray-300">
        <div>
          <h1 class="font-bold text-xl z-40">TLU 목록</h1>
        </div>
        <div class="mt-3 gap-1">
          <button class="whitebutton" @click="addTLU" :disabled="!afterSearch">
            추가
          </button>
          <button
            class="whitebutton"
            @click="deleteTLU"
            :disabled="!afterSearch">
            삭제
          </button>
        </div>
      </div>
      <div class="flex flex-col h-full">
        <div
          class="mt-3 ml-10 grid grid-cols-[1fr,3fr] grid-rows-1 gap-0 w-full">
          <div class="customtableIndex border border-gray-400 rounded-tl-lg">
            TLU명/코드
          </div>
          <div class="px-1 py-1 border border-gray-300 rounded-br-lg">
            <input
              type="text"
              class="border w-full h-full px-1 border-gray-400 rounded-lg"
              @input="searchTLU"
              v-model="searchword" />
          </div>
        </div>
        <div class="ml-10 w-full h-full">
          <Realgrid
            class="w-full h-full mt-2"
            :progname="'MST01_010INS_VUE'"
            :progid="2"
            :rowData="TLUList"
            @clickedRowData="clickedRowData"
            @selectedIndex2="selectedIndex2"
            :changeRow="changeRow"
            :changeValue2="changeValue"
            :changeColid="changeColid"
            :changeNow2="changeNow"
            :changeNow="changeNow2"
            :searchWord3="searchword"
            :searchColId="'lngCode,strName'"
            :selectionStyle="'singleRow'"
            :addrowProp="'lngCode,strName,lngMenu1,lngMenu2,lngMenu3,lngMenu4,lngMenu5,lngMenu6,lngMenu7,lngMenu8,lngMenu9,lngMenu10,lngMenu11,lngMenu12,lngMenu13,lngMenu14,lngMenu15,lngMenu16,lngMenu17,lngMenu18,lngMenu19,lngMenu20,lngMenu21,lngMenu22,lngMenu23,lngMenu24,lngMenu25,lngMenu26,lngMenu27,lngMenu28,lngMenu29'"
            :addRow4="addRow3"
            :addrowDefault="addrowDefault"
            :rowStateeditable="false"
            :editableColId="'strName'"
            :deleteRow2="deleteRow"
            :initFocus="initFocus"
            @updatedRowData="updatedRowData"
            :addField="'new'">
          </Realgrid>
        </div>
        <div class="flex justify-start ml-10 mt-5">
          <h1 class="font-bold text-xl z-40">메뉴 목록</h1>
        </div>
        <div
          class="mt-3 ml-10 grid grid-cols-[1fr,3fr] grid-rows-3 gap-0 w-full">
          <div class="customtableIndex border border-gray-400 rounded-tl-lg">
            메뉴분류
          </div>
          <div
            class="px-2 py-1 border border-gray-300 rounded-tr-lg flex gap-2">
            <select
              name=""
              id=""
              class="flex-1 border border-gray-300 rounded-lg"
              @change="setSubCd"
              v-model="forsearchMain">
              <option value="0">전체</option>
              <option :value="i.lngCode" v-for="i in MenuGroup">
                [{{ i.lngCode }}]{{ i.strName }}
              </option>
            </select>
            <select
              name=""
              id=""
              class="flex-1 border border-gray-300 rounded-lg"
              v-model="forsearchSub">
              <option value="0">전체</option>
              <option :value="i.lngCode" v-for="i in filteredSubMenuGroup">
                [{{ i.lngCode }}]{{ i.strName }}
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
        <div class="ml-10 -mt-8 w-full h-full">
          <Realgrid
            class="w-full h-[70%]"
            :progname="'MST01_010INS_VUE'"
            :progid="1"
            :rowData="filteredMenuList"
            @clickedRowData="clickedRowData3"
            :searchWord3="searchword1"
            :searchColId="'lngCode,strName'"
            :searchColId2="'mainLngCode,subLngCode'"
            :searchColValue2="searchColValue2"
            @selcetedrowData="selcetedrowData"
            :selectionStyle="'singleRow'"
            :initFocus="initFocus"></Realgrid>
        </div>
      </div>
    </div>
    <!-- 그리드 및 버튼 영역 -->
    <!-- 드래그 영역 -->
    <div class="grid grid-rows-[2fr,5fr] grid-cols-1 ml-10 w-full h-full z-20">
      <div v-show="afterSearch" class="flex mt-8 w-[950px] h-[95%]">
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
              :class="{
                'bg-gray-400': item.inactivate == true,
                ' !bg-orange-400 !border-blue-700':
                  clickedMenuKey == index && index != 29,
              }"
              @click="
                saveKey(index);
                clickedMenuKey = index;
              "
              :disabled="item.inactivate == true">
              <span class="flex flex-col w-full h-20"
                ><span class="mt-3">{{ item.lngCode ? item.lngCode : "" }}</span
                ><span>{{ item ? item.strName : "" }}</span
                ><span class="flex justify-end pr-3">{{
                  item.lngPrice ? formatNumber(item.lngPrice) + "원" : ""
                }}</span></span
              >
            </div>
          </VueDraggableNext>
        </div>
      </div>
    </div>
  </div>
  <!-- 드래그 영역 -->
</template>

<script setup>
import { getTLUManageInfo, saveTLUList } from "@/api/master";
/**
 *  경고창 호출 라이브러리
 *  */

import Swal from "sweetalert2";
/*
 * 공통 표준  Function
 */

import { nextTick, onMounted, ref, watch } from "vue";

/*
 * 드래그 라이브러리 호출
 */

import { VueDraggableNext } from "vue-draggable-next";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";
/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";

/**
 * 매장 공통 컴포넌트
 */

import PickStore from "@/components/pickStore.vue";
/**
 * 	그리드 생성
 */

import Realgrid from "@/components/realgrid.vue";
/**
 *  페이지로그 자동 입력
 *  */

import { insertPageLog } from "@/customFunc/customFunc";

/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
});

// 더미 데이터
const items = ref([]);
const clickedTLUCd = ref();
const ScreenKeyOrigin = ref([]);
const clickedMenuKey = ref();
const ScreenKeys = ref();
const currentMenuorTLU = ref(false);
const forsearchMain = ref("0");
const forsearchSub = ref("0");
const filteredMenuList = ref([]);
const searchWord = ref("");
const initFocus = ref(false);
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
/**
 *  그리드 검색어 세팅
 */

const searchword = ref("");
const clickedStoreNm = ref();
/**
 * 페이지 매장명 세팅
 */

const handlestoreNm = (newData) => {
  clickedStoreNm.value = newData;
};
const showChangeScreenKey = ref(false);
const addrowDefault = ref("");
const confirmitem = ref([]);

/**
 * 추가 버튼 함수
 */

const addRow3 = ref(false);

const AllscreenKeyPage = ref(1);
/**
 * 그리드 행 삭제 버튼 함수
 */

const deleteRow = ref(false);

const nowStoreCd = ref();
const afterCategory = ref(false);
/**
 * 페이지 매장 코드 세팅
 */

const handleStoreCd = async (newValue) => {
  if (newValue == "0") {
    afterSearch.value = false;
    nowStoreCd.value = newValue;
    return;
  }
  nowStoreCd.value = newValue;
  searchButton();
};
const Category = ref([]);

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
const searchColValue2 = ref("0");
const TLUList = ref([]);

/**
 *  조회 함수
 */

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

  store.state.loading = true;
  try {
    const res3 = await getTLUManageInfo(groupCd.value, nowStoreCd.value);

    //comsole.log(res3);
    TLUList.value = res3.data.TLULIST;
    MenuList.value = res3.data.MENULIST;
    filteredMenuList.value = [...MenuList.value];
    MenuGroup.value = res3.data.MAINGROUP;
    SubMenuGroup.value = res3.data.SUBGROUP;
    //comsole.log(MenuList.value);
    updatedRowData2.value = JSON.parse(JSON.stringify(TLUList.value));

    afterSearch.value = true;
  } catch (error) {
    //comsole.log(error);
    afterSearch.value = false;
  } finally {
    initFocus.value = !initFocus.value;
    store.state.loading = false; // 로딩 상태 종료
    modified.value = false;
    afterCategory.value = false;
  }
};
const filteredSubMenuGroup = ref([]);
const setSubCd = () => {
  filteredSubMenuGroup.value = SubMenuGroup.value.filter(
    (item) => item.lngMajor == forsearchMain.value
  );
  forsearchSub.value = "0";
};

let targetItemIndex2;
const onMove = (evt) => {
  // 예: 드래그 중 이동할 때의 조건 등을 설정할 수 있음
  if (changeMode.value == false) {
    targetItemIndex2 = Array.from(evt.from.children).indexOf(evt.related);
    return false;
  } else {
    targetItemIndex2 = Array.from(evt.from.children).indexOf(evt.related);
    return true;
  }
};

const onEnd = async (evt) => {
  // Swap을 처리할 조건

  if (
    evt.oldIndex == 29 ||
    targetItemIndex2 == undefined ||
    targetItemIndex2 == 29
  ) {
    return;
  }
  //comsole.log(items.value);
  if (changeMode.value == false) {
    const oldIndex = evt.oldIndex; // 드래그된 아이템의 기존 인덱스
    const swappedItems = [...items.value]; // items를 복사
    const temp = swappedItems[oldIndex];

    swappedItems[oldIndex] = swappedItems[targetItemIndex2];

    swappedItems[targetItemIndex2] = temp;

    // 배열을 업데이트
    items.value = swappedItems;
    //comsole.log(TLUList.value);

    clickedMenuKey.value = targetItemIndex2;
    //comsole.log(TLUList.value);
  }
};

watch(items, async () => {
  //comsole.log(items.value);
  if (items.value.length == 0) return;

  changeValue.value = items.value[0].lngCode;
  changeColid.value = "lngMenu1";
  changeNow.value = !changeNow.value;

  await nextTick();

  changeValue.value = items.value[1].lngCode;
  changeColid.value = "lngMenu2";
  changeNow.value = !changeNow.value;

  await nextTick();

  changeValue.value = items.value[2].lngCode;
  changeColid.value = "lngMenu3";
  changeNow.value = !changeNow.value;

  await nextTick();

  changeValue.value = items.value[3].lngCode;
  changeColid.value = "lngMenu4";
  changeNow.value = !changeNow.value;

  await nextTick();

  changeValue.value = items.value[4].lngCode;
  changeColid.value = "lngMenu5";
  changeNow.value = !changeNow.value;

  await nextTick();

  changeValue.value = items.value[5].lngCode;
  changeColid.value = "lngMenu6";
  changeNow.value = !changeNow.value;

  await nextTick();

  changeValue.value = items.value[6].lngCode;
  changeColid.value = "lngMenu7";
  changeNow.value = !changeNow.value;

  await nextTick();

  changeValue.value = items.value[7].lngCode;
  changeColid.value = "lngMenu8";
  changeNow.value = !changeNow.value;

  await nextTick();

  changeValue.value = items.value[8].lngCode;
  changeColid.value = "lngMenu9";
  changeNow.value = !changeNow.value;

  await nextTick();

  changeValue.value = items.value[9].lngCode;
  changeColid.value = "lngMenu10";
  changeNow.value = !changeNow.value;

  await nextTick();

  changeValue.value = items.value[10].lngCode;
  changeColid.value = "lngMenu11";
  changeNow.value = !changeNow.value;

  await nextTick();

  changeValue.value = items.value[11].lngCode;
  changeColid.value = "lngMenu12";
  changeNow.value = !changeNow.value;

  await nextTick();

  changeValue.value = items.value[12].lngCode;
  changeColid.value = "lngMenu13";
  changeNow.value = !changeNow.value;

  await nextTick();

  changeValue.value = items.value[13].lngCode;
  changeColid.value = "lngMenu14";
  changeNow.value = !changeNow.value;

  await nextTick();

  changeValue.value = items.value[14].lngCode;
  changeColid.value = "lngMenu15";
  changeNow.value = !changeNow.value;

  await nextTick();

  changeValue.value = items.value[15].lngCode;
  changeColid.value = "lngMenu16";
  changeNow.value = !changeNow.value;

  await nextTick();

  changeValue.value = items.value[16].lngCode;
  changeColid.value = "lngMenu17";
  changeNow.value = !changeNow.value;

  await nextTick();

  changeValue.value = items.value[17].lngCode;
  changeColid.value = "lngMenu18";
  changeNow.value = !changeNow.value;

  await nextTick();

  changeValue.value = items.value[18].lngCode;
  changeColid.value = "lngMenu19";
  changeNow.value = !changeNow.value;

  await nextTick();

  changeValue.value = items.value[19].lngCode;
  changeColid.value = "lngMenu20";
  changeNow.value = !changeNow.value;

  await nextTick();

  changeValue.value = items.value[20].lngCode;
  changeColid.value = "lngMenu21";
  changeNow.value = !changeNow.value;

  await nextTick();

  changeValue.value = items.value[21].lngCode;
  changeColid.value = "lngMenu22";
  changeNow.value = !changeNow.value;

  await nextTick();

  changeValue.value = items.value[22].lngCode;
  changeColid.value = "lngMenu23";
  changeNow.value = !changeNow.value;

  await nextTick();

  changeValue.value = items.value[23].lngCode;
  changeColid.value = "lngMenu24";
  changeNow.value = !changeNow.value;

  await nextTick();

  changeValue.value = items.value[24].lngCode;
  changeColid.value = "lngMenu25";
  changeNow.value = !changeNow.value;

  await nextTick();

  changeValue.value = items.value[25].lngCode;
  changeColid.value = "lngMenu26";
  changeNow.value = !changeNow.value;

  await nextTick();

  changeValue.value = items.value[26].lngCode;
  changeColid.value = "lngMenu27";
  changeNow.value = !changeNow.value;

  await nextTick();

  changeValue.value = items.value[27].lngCode;
  changeColid.value = "lngMenu28";
  changeNow.value = !changeNow.value;

  await nextTick();

  changeValue.value = items.value[28].lngCode;
  changeColid.value = "lngMenu29";
  changeNow.value = !changeNow.value;

  await nextTick();
});

function formatNumber(value) {
  if (!value) return "";
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 *  저장 버튼 함수
 */

const saveButton = async () => {
  //comsole.log(updatedRowData2.value);
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
    JSON.stringify(confirmitem.value) === JSON.stringify(updatedRowData2.value)
  ) {
    Swal.fire({
      title: "경고",
      text: "변경된 사항이 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  const strNames = updatedRowData2.value.filter(
    (item) =>
      item.deleted !== true &&
      (item.strName == undefined || item.strName == " " || item.strName == "")
  );
  if (strNames.length > 0) {
    Swal.fire({
      title: "경고",
      text: "TLU명에 빈 칸이 존재합니다.",
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
        const lngCodes = updatedRowData2.value
          .filter((item) => item.deleted !== true)
          .map((item) => item.lngCode);
        const strNames = updatedRowData2.value
          .filter((item) => item.deleted !== true)
          .map((item) => item.strName);
        const lngMenu1 = updatedRowData2.value
          .filter((item) => item.deleted !== true)
          .map((item) => item.lngMenu1);
        const lngMenu2 = updatedRowData2.value
          .filter((item) => item.deleted !== true)
          .map((item) => item.lngMenu2);
        const lngMenu3 = updatedRowData2.value
          .filter((item) => item.deleted !== true)
          .map((item) => item.lngMenu3);
        const lngMenu4 = updatedRowData2.value
          .filter((item) => item.deleted !== true)
          .map((item) => item.lngMenu4);
        const lngMenu5 = updatedRowData2.value
          .filter((item) => item.deleted !== true)
          .map((item) => item.lngMenu5);
        const lngMenu6 = updatedRowData2.value
          .filter((item) => item.deleted !== true)
          .map((item) => item.lngMenu6);
        const lngMenu7 = updatedRowData2.value
          .filter((item) => item.deleted !== true)
          .map((item) => item.lngMenu7);
        const lngMenu8 = updatedRowData2.value
          .filter((item) => item.deleted !== true)
          .map((item) => item.lngMenu8);
        const lngMenu9 = updatedRowData2.value
          .filter((item) => item.deleted !== true)
          .map((item) => item.lngMenu9);
        const lngMenu10 = updatedRowData2.value
          .filter((item) => item.deleted !== true)
          .map((item) => item.lngMenu10);
        const lngMenu11 = updatedRowData2.value
          .filter((item) => item.deleted !== true)
          .map((item) => item.lngMenu11);
        const lngMenu12 = updatedRowData2.value
          .filter((item) => item.deleted !== true)
          .map((item) => item.lngMenu12);
        const lngMenu13 = updatedRowData2.value
          .filter((item) => item.deleted !== true)
          .map((item) => item.lngMenu13);
        const lngMenu14 = updatedRowData2.value
          .filter((item) => item.deleted !== true)
          .map((item) => item.lngMenu14);
        const lngMenu15 = updatedRowData2.value
          .filter((item) => item.deleted !== true)
          .map((item) => item.lngMenu15);
        const lngMenu16 = updatedRowData2.value
          .filter((item) => item.deleted !== true)
          .map((item) => item.lngMenu16);
        const lngMenu17 = updatedRowData2.value
          .filter((item) => item.deleted !== true)
          .map((item) => item.lngMenu17);
        const lngMenu18 = updatedRowData2.value
          .filter((item) => item.deleted !== true)
          .map((item) => item.lngMenu18);
        const lngMenu19 = updatedRowData2.value
          .filter((item) => item.deleted !== true)
          .map((item) => item.lngMenu19);
        const lngMenu20 = updatedRowData2.value
          .filter((item) => item.deleted !== true)
          .map((item) => item.lngMenu20);
        const lngMenu21 = updatedRowData2.value
          .filter((item) => item.deleted !== true)
          .map((item) => item.lngMenu21);
        const lngMenu22 = updatedRowData2.value
          .filter((item) => item.deleted !== true)
          .map((item) => item.lngMenu22);
        const lngMenu23 = updatedRowData2.value
          .filter((item) => item.deleted !== true)
          .map((item) => item.lngMenu23);
        const lngMenu24 = updatedRowData2.value
          .filter((item) => item.deleted !== true)
          .map((item) => item.lngMenu24);
        const lngMenu25 = updatedRowData2.value
          .filter((item) => item.deleted !== true)
          .map((item) => item.lngMenu25);
        const lngMenu26 = updatedRowData2.value
          .filter((item) => item.deleted !== true)
          .map((item) => item.lngMenu26);
        const lngMenu27 = updatedRowData2.value
          .filter((item) => item.deleted !== true)
          .map((item) => item.lngMenu27);
        const lngMenu28 = updatedRowData2.value
          .filter((item) => item.deleted !== true)
          .map((item) => item.lngMenu28);
        const lngMenu29 = updatedRowData2.value
          .filter((item) => item.deleted !== true)
          .map((item) => item.lngMenu29);

        const res = await saveTLUList(
          groupCd.value,
          nowStoreCd.value,
          lngCodes.join(","),
          strNames.join(","),
          lngMenu1.join(","),
          lngMenu2.join(","),
          lngMenu3.join(","),
          lngMenu4.join(","),
          lngMenu5.join(","),
          lngMenu6.join(","),
          lngMenu7.join(","),
          lngMenu8.join(","),
          lngMenu9.join(","),
          lngMenu10.join(","),
          lngMenu11.join(","),
          lngMenu12.join(","),
          lngMenu13.join(","),
          lngMenu14.join(","),
          lngMenu15.join(","),
          lngMenu16.join(","),
          lngMenu17.join(","),
          lngMenu18.join(","),
          lngMenu19.join(","),
          lngMenu20.join(","),
          lngMenu21.join(","),
          lngMenu22.join(","),
          lngMenu23.join(","),
          lngMenu24.join(","),
          lngMenu25.join(","),
          lngMenu26.join(","),
          lngMenu27.join(","),
          lngMenu28.join(","),
          lngMenu29.join(",")
        );
        //comsole.log(res);
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

const searchMenuList = (e) => {
  searchword1.value = e.target.value;
};

/**
 * 데이터셋 상세정보 셋팅
 */

const clickedRowData = (newValue) => {
  //comsole.log(newValue);
  clickedTLUCd.value = newValue[0];
  items.value = [];
  for (var i = 2; i < 31; i++) {
    const filtereddata = MenuList.value.filter(
      (item) => Number(item.lngCode) == Number(newValue[i])
    );
    //comsole.log(filtereddata);
    if (filtereddata[0] != undefined) {
      items.value.push({
        lngCode: filtereddata[0].lngCode,
        strName: filtereddata[0].strName,
        lngPrice: filtereddata[0].lngPrice,
      });
    } else {
      items.value.push({ lngCode: 0, strName: "", lngPrice: "" });
    }
  }
  items.value.push({ lngCode: 0, strName: "", lngPrice: "", inactivate: true });
  //comsole.log(items.value);
};

const searchTLU = (e) => {
  searchword.value = e.target.value;
};
const addTLU = () => {
  let newTLU;
  if (TLUList.value.length == 0) {
    newTLU = 1;
  } else {
    newTLU = Math.max(...TLUList.value.map((item) => item.lngCode)) + 1;
  }

  clickedTLUCd.value = newTLU;
  addrowDefault.value = newTLU;
  addrowDefault.value +=
    ", ,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0";
  //comsole.log(addrowDefault.value);
  addRow3.value = !addRow3.value;
};
const deleteTLU = () => {
  deleteRow.value = !deleteRow.value;
};
const currIndexKey = ref();
const saveKey = (index) => {
  currIndexKey.value = index;
  //comsole.log(currIndexKey.value);
};

/**
 * 삭제 버튼
 */

const deletekey = () => {
  // const filtered = TLUList.value.find((item,index) => item.lngCode == Number(clickedTLUCd.value)).find((item,index) => index == currIndexKey.value+2)

  // const finditem = TLUList.value.find(
  //   (item, index) => item.lngCode == Number(clickedTLUCd.value)
  // );
  // if (currIndexKey.value >= 0 && currIndexKey.value <= 28) {
  //   finditem[`lngMenu${currIndexKey.value + 1}`] = 0;
  // }

  // TLUList.value = [...TLUList.value];

  changeValue.value = 0;
  changeColid.value = `lngMenu${currIndexKey.value + 1}`;
  changeNow.value = !changeNow.value;
  const finditem2 = items.value.find(
    (item, index) => index == currIndexKey.value
  );
  finditem2.lngCode = "";
  finditem2.strName = "";
  finditem2.lngPrice = "";
};

watch(forsearchMain, () => {
  searchColValue2.value = forsearchMain.value + ",0";
  //comsole.log(searchColValue2.value);
});
watch(forsearchSub, () => {
  searchColValue2.value = forsearchMain.value + "," + forsearchSub.value;
  //comsole.log(searchColValue2.value);
});

const changeRow = ref();
const changeValue = ref();
const changeColid = ref();
const changeNow = ref(false);
const changeNow2 = ref(false);

/**
 * 수정용 데이터 행 설정
 */

const selectedIndex2 = (e) => {
  changeRow.value = e;
};
/**
 * 선택한 행의 상세정보 셋팅
 */

const selcetedrowData = (newValue) => {
  //comsole.log(currIndexKey.value);
  //comsole.log(newValue);
  if (
    currIndexKey.value === undefined ||
    currIndexKey.value === "" ||
    clickedTLUCd.value === undefined ||
    clickedTLUCd.value === ""
  ) {
    Swal.fire({
      title: "경고",
      text: "추가할 항목을 선택하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  changeValue.value = newValue[0];
  changeColid.value = "lngMenu" + (currIndexKey.value + 1);
  //comsole.log(changeColid.value);
  changeNow2.value = !changeNow2.value;
  // const finditem = TLUList.value.find(
  //   (item, index) => item.lngCode == Number(clickedTLUCd.value)
  // );
  // finditem[`lngMenu${currIndexKey.value + 1}`] = Number(newValue[0]);
  // //comsole.log(finditem);
  // //comsole.log(TLUList.value);
  // TLUList.value = [...TLUList.value];
  // const finditem2 = items.value.find(
  //   (item, index) => index == currIndexKey.value
  // );
  // //comsole.log(finditem2);
  // finditem2.lngCode = newValue[0];
  // finditem2.strName = newValue[1];
  // finditem2.lngPrice = newValue[2];
};

/**
 * 입력창 수정 데이터 갱신
 */

const updatedRowData2 = ref([]);
/**
 * 입력창 수정 데이터 갱신
 */

const updatedRowData = (newvalue) => {
  //comsole.log(newvalue);
  // const updatename = newvalue.filter(item => Number(item.lngCode) == Number(clickedTLUCd.value))[0].strName
  // const findname = TLUList.value.find(item => item.lngCode == clickedTLUCd.value)
  // if(findname != undefined){
  //     findname.strName = updatename
  // }
  updatedRowData2.value = newvalue;
  //comsole.log(TLUList.value);
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
