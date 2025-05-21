/*--############################################################################
# Filename : MST44_061INS.vue                                                  
# Description : 마스터관리 > POS 마스터 > KDS관리                              
# Date :2025-05-14                                                             
# Author : 권맑음                     
################################################################################*/
<template>
  <!-- 조회조건 -->
  <div class="flex justify-between items-center w-full overflow-y-hidden">
    <PageName></PageName>
    <div class="flex justify-center mr-10 space-x-2 pr-5">
      <button @click="searchButton" class="button search md:w-auto w-14">
        조회
      </button>

      <button @click="saveButton" class="button save w-auto">저장</button>
      <button
        @click="copyButton"
        class="button copy w-auto"
        v-if="currentMenu == true">
        복사
      </button>
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
      :hidesub="hidesub"></PickStore>
  </div>
  <!-- 조회조건 -->
  <!-- 그리드 영역 -->
  <div class="mt-5 flex justify-start ml-10">
    <button
      class="contents_tab-button"
      :class="{ 'text-blue-600': currentMenu == false }"
      @click="showMenus(1)">
      KDS설정
    </button>
    <button
      class="contents_tab-button"
      :class="{ 'text-blue-600': currentMenu == true }"
      @click="showMenus(2)">
      매장별 KDS설정
    </button>
  </div>
  <div class="flex h-[55vh] w-full mt-5">
    <div class="flex flex-col w-3/5 h-4/6">
      <div
        class="flex justify-between mt-0 ml-10 border-b border-b-gray-300"
        :class="currentMenu == false ? 'w-full' : 'w-[54%]'">
        <div
          class="flex justify-start rounded-tl-lg text-xl -mt-1 font-bold"
          v-if="currentMenu == false">
          KDS 목록
        </div>
        <div
          class="flex justify-start rounded-tl-lg text-xl -mt-1 font-bold"
          v-if="currentMenu == true">
          메뉴별 KDS 설정
        </div>

        <div class="mt-3">
          <button
            class="whitebutton"
            :disabled="!(afterSearch == true)"
            @click="addRow"
            v-if="currentMenu == false">
            추가
          </button>
          <button
            class="whitebutton"
            @click="deleteRow"
            :disabled="!(afterClick == true && afterSearch == true)"
            v-if="currentMenu == false">
            삭제
          </button>
        </div>
      </div>

      <div class="h-4/6" v-show="currentMenu == false">
        <div class="ml-10 mt-5 w-full h-full">
          <Realgrid
            class="w-full h-[230%]"
            :progname="'MST44_061INS_VUE'"
            :progid="1"
            :rowData="rowData"
            :showGrid="showGrid"
            :showCheckBar="false"
            @selcetedrowData="selcetedrowData"
            :searchWord="searchword1"
            :searchColId="'lngCode,strName'"
            :addRow2="addRows"
            @selectedIndex2="selectedIndex2"
            :addrowProp="'strName,kdsCornerNum'"
            :addrowDefault="addrowDefault"
            @updatedRowData="updatedRowData"
            @clickedRowData="clickedRowData"
            :deleteRow="deleteRows"
            :changeColid="'kdsCornerNm'"
            :changeRow="changeRow"
            :changeValue2="changeValue"
            :changeNow="changeNow"
            @realgridname="realgridname2"
            :rowStateeditable="false"></Realgrid>
        </div>
      </div>

      <div class="h-4/6 w-[80vw]" v-show="currentMenu == true">
        <div
          class="mt-3 ml-10 grid grid-cols-[1fr,3fr] grid-rows-2 gap-0 w-[35%]">
          <div class="customtableIndex border border-gray-400 rounded-tl-lg">
            메뉴분류
          </div>
          <div
            class="px-2 py-1 border border-gray-400 rounded-tr-lg flex space-x-2">
            <select
              name=""
              id=""
              class="flex-1 border border-gray-400 rounded-lg"
              @change="setSubCd"
              v-model="forsearchMain">
              <option value="-1">전체</option>
              <option :value="i.mainCode" v-for="i in MenuGroup">
                {{ i.mainName }}
              </option>
            </select>
            <select
              name=""
              id=""
              class="flex-1 border border-gray-400 rounded-lg"
              v-model="forsearchSub">
              <option value="-1">전체</option>
              <option :value="i.subCode" v-for="i in filteredSubMenuGroup">
                {{ i.subName }}
              </option>
            </select>
          </div>

          <div class="customtableIndex border border-gray-400 rounded-bl-lg">
            메뉴명/코드
          </div>
          <div class="px-2 py-1 border border-gray-400 rounded-br-lg">
            <input
              type="text"
              class="border w-full h-full px-1 border-gray-400 rounded-lg"
              @input="searchMenuList"
              v-model="searchword1" />
          </div>
        </div>
        <div class="ml-10 mt-5 w-full h-full">
          <Realgrid
            class="w-[103%] h-[200%]"
            :progname="'MST44_061INS_VUE'"
            :progid="2"
            :reload="reload"
            :rowData="rowData2"
            :showGrid="showGrid"
            :showCheckBar="false"
            :searchWord3="searchword1"
            :searchColId="'lngCode,strName'"
            :searchColId3="['mainCode', 'subCode']"
            :searchSpecialColId="searchSpecialColId"
            :searchSpecialCond="searchSpecialCond"
            :activeSearchSpecial="true"
            :searchValue="[forsearchMain, forsearchSub]"
            :selectionStyle="'block'"
            @updatedRowData="updatedRowData2"
            @realgridname="realgridname"
            :rowStateeditable="false"
            :fixedColumn="fixedColumn"
            :checkRenderEditable="true"
            :setDynamicGrid2="true"></Realgrid>
        </div>
      </div>
    </div>
    <!-- 그리드 영역 -->
    <!-- 데이터 영역 -->
    <div
      class="w-[52%] h-[20%] grid grid-rows-2 grid-cols-1 ml-28 -mt-2"
      v-if="currentMenu == false">
      <div class="font-bold text-xl flex justify-start items-center">
        상세정보
      </div>
      <div class="w-full h-full flex justify-start items-center">
        <div class="grid grid-rows-2 grid-cols-[1fr,3fr] w-[93%] h-full">
          <div
            class="rounded-tl-lg border border-gray-600 flex justify-center items-center">
            KDS번호
          </div>
          <div
            class="rounded-tr-lg border border-gray-600 h-full py-1 px-1 flex items-center">
            <input
              type="text"
              class="w-full border border-gray-600 rounded-lg disabled:bg-gray-300"
              v-model="clickedNo"
              disabled />
          </div>
          <div
            class="rounded-bl-lg border border-gray-600 flex justify-center items-center">
            KDS명
          </div>
          <div
            class="rounded-br-lg border border-gray-600 h-full py-1 px-1 flex items-center">
            <input
              type="text"
              class="w-full border border-gray-600 rounded-lg"
              v-model="clickedNm"
              @input="changeValues" />
          </div>
        </div>
      </div>
    </div>
    <label v-if="currentMenu == true" class="mt-20 relative right-96 top-1 h-2">
      <input type="checkbox" v-model="ischecked" />
      미설정메뉴보기
    </label>
  </div>
  <!-- 데이터 영역 -->
</template>

<script setup>
import {
  getKDSList,
  getKDSSettingList,
  saveKDSList,
  saveKDSSettingAll,
} from "@/api/master";
/*
 * 공통 표준  Function
 */

import { onMounted, ref, watch } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";

/**
 *  경고창 호출 라이브러리
 *  */

import Swal from "sweetalert2";

/**
 * 매장 공통 컴포넌트
 */

import PickStore from "@/components/pickStore.vue";
/**
 * 	그리드 생성
 */

import Realgrid from "@/components/realgrid.vue";
/**
 * 	그리드 생성
 */

/**
 *  리얼그리드 라이브러리 호출
 *  */

import RealGrid from "realgrid";
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

const currentMenu = ref(false);
const realgrid2Name = ref("");
const realgrid3Name = ref("");
const realgridname = (e) => {
  realgrid2Name.value = e;
};
const realgridname2 = (e) => {
  realgrid3Name.value = e;
};

const searchSpecialColId = ref([]);
const searchSpecialCond = ref(true);
watch(currentMenu, () => {
  const reagrid2 = document.getElementById(realgrid2Name.value);
  setTimeout(() => {
    RealGrid.getGridInstance(reagrid2).resetSize();
    RealGrid.getGridInstance(reagrid2).refresh(true);
  }, 100);
  const reagrid3 = document.getElementById(realgrid3Name.value);
  setTimeout(() => {
    RealGrid.getGridInstance(reagrid3).resetSize();
    RealGrid.getGridInstance(reagrid3).refresh(true);
  }, 100);
});

// 더미 데이터
const items = ref([]);
const afterClick = ref(false);
const ScreenKeyOrigin = ref([]);
const ScreenKeys = ref();
const updatedList = ref();
const updatedList2 = ref();
const forsearchMain = ref("-1");
const forsearchSub = ref("-1");
const ischecked = ref(false);
const rowStateeditable = ref(false);
const changeMode = ref(false);
const fixedColumn = ref(true);

const clickedNm = ref("");
const clickedNo = ref();
const clickedStoreNm = ref();
/**
 * 페이지 매장명 세팅
 */

const handlestoreNm = (newData) => {
  clickedStoreNm.value = newData;
};
const showPopup2 = ref(false);
const showPopup3 = ref(false);

const confirmitem = ref([]);
const reloadit = ref(true);

/**
 * 선택한 포스 번호 호출 함수
 */

const posNo = ref();
const addrowDefault = ref();
const currmenuKeyPage = ref(1);
const AllscreenKeyPage = ref(1);

const showMenus = (value) => {
  if (value == 1) {
    currentMenu.value = false;
    hidesub.value = false;
  } else {
    currentMenu.value = true;
    hidesub.value = true;
  }
};

const hidesub = ref(false);

const nowStoreAreaCd = ref();
/**
 *  pickStore - 지역코드 세팅
 */

const handleStoreAreaCd = (newValue) => {
  nowStoreAreaCd.value = newValue;
  //comsole.log(nowStoreAreaCd.value);
};
/**
 * 입력창 수정 데이터 갱신
 */

const updatedRowData = (newValue) => {
  updatedList.value = newValue;
};

const forSaveMenu = ref([]);
/**
 * 입력창 수정 데이터 갱신
 */

const updatedRowData2 = (newValue) => {
  //comsole.log(newValue);
  if (currentMenu.value == true) {
    forSaveMenu.value = [];
    updatedList2.value = newValue;
    KDSSettingList.value.forEach((item, index) => {
      const matchedItem = updatedList2.value.find(
        (kdsItem) => kdsItem.lngCode == item.lngCode
      );
      if (matchedItem) {
        KDSSettingList.value[index] = { ...matchedItem };
      }
    });

    const kdslength = kdsList.value.length;
    for (var i = 0; i < kdslength; i++) {
      forSaveMenu.value.push(
        KDSSettingList.value
          .filter((item) => item["checkbox" + (i + 1)] == true)
          .map((item2) => item2.lngCode)
      );
    }
  }
};
const nowStoreCd = ref();
const afterCategory = ref(false);
/**
 * 페이지 매장 코드 세팅
 */

const handleStoreCd = async (newValue) => {
  afterSearch.value = false;
  rowData2.value = [];

  KDSSettingList.value = [];
  checked.value = [];
  kdsList.value = [];
  MenuGroup.value = [];
  SubMenuGroup.value = [];
  ischecked.value = false;

  nowStoreCd.value = newValue;
};
const KDSList = ref();
const reload = ref(false);
const KDSSettingList = ref();
const Category = ref([]);
const changeValue = ref("");
const MenuGroup = ref([]);
const SubMenuGroup = ref([]);
const changeNow = ref(false);

/**
 * 수정용 데이터 행 설정
 */

const selectedIndex2 = (e) => {
  changeRow.value = e;
};
const changeValues = (e) => {
  changeValue.value = e.target.value;
  changeNow.value = !changeNow.value;
};
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
const afterSearch2 = ref(false);
const MenuList = ref([]);
const MenuKeyList = ref([]);
const clickedScreenOrMenu = ref(false);
const TLUList = ref([]);
const checked = ref();
/**
 * 추가 버튼 함수
 */

const addRows = ref(false);
/**
 * 그리드 행 삭제 버튼 함수
 */

const deleteRows = ref(false);
/**
 * 추가 버튼 함수
 */

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
  //comsole.log(updatedList.value);
  if (updatedList.value == undefined || updatedList.value[0] == undefined) {
    addrowDefault.value += "," + 1;
  } else {
    const maxKdsCornerNum = Math.max(
      ...updatedList.value.map((item) => item.kdsCornerNum)
    );
    //comsole.log(maxKdsCornerNum);
    addrowDefault.value += "," + (maxKdsCornerNum + 1);
    //comsole.log(addrowDefault.value);
  }
};
const rowData = ref([]);
const rowData2 = ref([]);
const kdsList = ref([]);
const originRowData2 = ref([]);
/**
 * 그리드 행 삭제 버튼 함수
 */

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
/**
 * 복사 팝업 - 복사 함수
 */

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

/**
 * 선택한 행의 상세정보 셋팅
 */

const selcetedrowData = (newValue) => {
  //comsole.log(newValue);
};
/**
 *  조회 함수
 */

const searchButton = async () => {
  changeMode.value = false;
  Category.value = [];
  items.value = [];
  if (currentMenu.value == true) {
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
  }
  store.state.loading = true;
  try {
    let res;
    if (currentMenu.value == false) {
      res = await getKDSList(groupCd.value);
      KDSList.value = res.data.KDS;
      rowData.value = [...KDSList.value];
      updatedList.value = [...KDSList.value];
      confirmitem.value = JSON.parse(JSON.stringify(KDSList.value));
      afterSearch.value = true;
    } else {
      res = await getKDSSettingList(groupCd.value, nowStoreCd.value);
      KDSSettingList.value = res.data.KDSSETTINGLIST;
      checked.value = res.data.CHECK;
      kdsList.value = res.data.KDS;
      //comsole.log(KDSSettingList.value);
      for (var i = 0; i < checked.value.length; i++) {
        const tlngCode = checked.value[i].lngCode;
        const tCornerNm = checked.value[i].kdsCornerNum;
        const index = KDSSettingList.value.findIndex(
          (item) => item.lngCode == tlngCode
        );
        if (KDSSettingList.value[index]) {
          KDSSettingList.value[index][tCornerNm] = true;
        }
      }

      rowData2.value = [...KDSSettingList.value];
      originRowData2.value = [...KDSSettingList.value];
      updatedList2.value = [...KDSSettingList.value];
      confirmitem.value = JSON.parse(JSON.stringify(KDSSettingList.value));

      MenuGroup.value = res.data.MAINGROUP;
      SubMenuGroup.value = res.data.SUBGROUP;

      //comsole.log(MenuGroup.value);
      //comsole.log(SubMenuGroup.value);
      //comsole.log(checked.value);
      afterSearch2.value = true;
    }
  } catch (error) {
    //comsole.log(error);
  } finally {
    //comsole.log(KDSList.value);
    // if (ischecked.value == true) {
    //   ischecked.value = false;
    //   setTimeout(() => {
    //     ischecked.value = true;
    //   }, 10);
    // } else {
    //   ischecked.value = true;
    //   setTimeout(() => {
    //     ischecked.value = false;
    //   }, 10);
    // }
    ischecked.value = false;

    // const temp1 = forsearchMain.value;
    // forsearchMain.value = "0";
    // setTimeout(() => {
    //   forsearchMain.value = temp1;
    // }, 1);
    // const temp2 = forsearchSub.value;
    // forsearchSub.value = "0";
    // setTimeout(() => {
    //   forsearchSub.value = temp2;
    // }, 1);
    store.state.loading = false; // 로딩 상태 종료
    modified.value = false;
    afterCategory.value = false;
    clickedNo.value = "";
    clickedNm.value = "";
  }
};
const filteredSubMenuGroup = ref([]);
const alreadyCheckedList = ref([]);
const forSaveMenu2 = ref([]);

watch(ischecked, () => {
  searchSpecialColId.value = [];
  for (let i = 1; i <= KDSList.value.length; i++) {
    searchSpecialColId.value.push("checkbox" + i);
  }
  if (ischecked.value == true) {
    //comsole.log(searchSpecialColId.value);

    searchSpecialCond.value = false;
  } else {
    searchSpecialCond.value = true;
  }
});
// watch(ischecked, (newvalue) => {
//   if (ischecked.value == false && afterSearch.value) {
//     rowData2.value = KDSSettingList.value.filter((item) => {
//       if (forsearchMain.value == "0") {
//         return item;
//       } else if (forsearchMain.value != "0" && forsearchSub.value != "0") {
//         return (
//           item.mainCode == forsearchMain.value &&
//           item.subCode == forsearchSub.value
//         );
//       } else if (forsearchMain.value != "0" && forsearchSub.value == "0") {
//         return item.mainCode == forsearchMain.value;
//       }
//     });
//   } else if (ischecked.value == true && afterSearch.value) {
//     forSaveMenu2.value = [];
//     rowData2.value = KDSSettingList.value.filter((item) => {
//       if (forsearchMain.value == "0") {
//         forsearchSub.value = "0";
//         return !Object.values(item).includes(true);
//       } else if (forsearchMain.value != "0" && forsearchSub.value != "0") {
//         return (
//           !Object.values(item).includes(true) &&
//           item.mainCode == forsearchMain.value &&
//           item.subCode == forsearchSub.value
//         );
//       } else {
//         return (
//           !Object.values(item).includes(true) &&
//           item.mainCode == forsearchMain.value
//         );
//       }
//     });
//   }
//   const temp1 = searchword1.value;
//   searchword1.value = "";
//   setTimeout(() => {
//     searchword1.value = temp1;
//   }, 1);
// });
const setSubCd = () => {
  forsearchSub.value = "-1";
  filteredSubMenuGroup.value = SubMenuGroup.value.filter(
    (item) => item.mainCode == forsearchMain.value
  );
  searchword1.value = "";
};
// watch(forsearchMain, () => {
//   if (forsearchMain.value != "0") {
//     if (ischecked.value == false && afterSearch.value) {
//       rowData2.value = KDSSettingList.value.filter((item) => {
//         if (forsearchMain.value == "0") {
//           return item;
//         } else if (forsearchMain.value != "0" && forsearchSub.value != "0") {
//           return (
//             item.mainCode == forsearchMain.value &&
//             item.subCode == forsearchSub.value
//           );
//         } else if (forsearchMain.value != "0" && forsearchSub.value == "0") {
//           return item.mainCode == forsearchMain.value;
//         }
//       });
//     } else if (ischecked.value == true && afterSearch.value) {
//       forSaveMenu2.value = [];
//       rowData2.value = KDSSettingList.value.filter((item) => {
//         if (forsearchMain.value == "0") {
//           forsearchSub.value = "0";
//           return !Object.values(item).includes(true);
//         } else if (forsearchMain.value != "0" && forsearchSub.value != "0") {
//           return (
//             !Object.values(item).includes(true) &&
//             item.mainCode == forsearchMain.value &&
//             item.subCode == forsearchSub.value
//           );
//         } else {
//           return (
//             !Object.values(item).includes(true) &&
//             item.mainCode == forsearchMain.value
//           );
//         }
//       });
//     }
//   } else {
//     if (ischecked.value == false && afterSearch.value) {
//       rowData2.value = KDSSettingList.value.filter((item) => {
//         if (forsearchMain.value == "0") {
//           return item;
//         } else if (forsearchMain.value != "0" && forsearchSub.value != "0") {
//           return (
//             item.mainCode == forsearchMain.value &&
//             item.subCode == forsearchSub.value
//           );
//         } else if (forsearchMain.value != "0" && forsearchSub.value == "0") {
//           return item.mainCode == forsearchMain.value;
//         }
//       });
//     } else if (ischecked.value == true && afterSearch.value) {
//       forSaveMenu2.value = [];
//       rowData2.value = KDSSettingList.value.filter((item) => {
//         if (forsearchMain.value == "0") {
//           forsearchSub.value = "0";
//           return !Object.values(item).includes(true);
//         } else if (forsearchMain.value != "0" && forsearchSub.value != "0") {
//           return (
//             !Object.values(item).includes(true) &&
//             item.mainCode == forsearchMain.value &&
//             item.subCode == forsearchSub.value
//           );
//         } else {
//           return (
//             !Object.values(item).includes(true) &&
//             item.mainCode == forsearchMain.value
//           );
//         }
//       });
//     }
//   }
// });

// watch(forsearchSub, () => {
//   if (forsearchSub.value != "0") {
//     if (ischecked.value == true) {
//       rowData2.value = KDSSettingList.value.filter((item) => {
//         if (forsearchMain.value == "0") {
//           forsearchSub.value = "0";
//           return !Object.values(item).includes(true);
//         } else if (forsearchMain.value != "0" && forsearchSub.value != "0") {
//           return (
//             !Object.values(item).includes(true) &&
//             item.mainCode == forsearchMain.value &&
//             item.subCode == forsearchSub.value
//           );
//         } else {
//           return (
//             !Object.values(item).includes(true) &&
//             item.mainCode == forsearchMain.value
//           );
//         }
//       });
//     } else {
//       rowData2.value = KDSSettingList.value.filter((item) => {
//         if (forsearchMain.value == "0") {
//           return item;
//         } else if (forsearchMain.value != "0" && forsearchSub.value != "0") {
//           return (
//             item.mainCode == forsearchMain.value &&
//             item.subCode == forsearchSub.value
//           );
//         } else if (forsearchMain.value != "0" && forsearchSub.value == "0") {
//           return item.mainCode == forsearchMain.value;
//         }
//       });
//     }
//   } else {
//     if (forsearchMain.value != "0") {
//       if (ischecked.value == true) {
//         rowData2.value = KDSSettingList.value.filter((item) => {
//           if (forsearchMain.value == "0") {
//             forsearchSub.value = "0";
//             return !Object.values(item).includes(true);
//           } else if (forsearchMain.value != "0" && forsearchSub.value != "0") {
//             return (
//               !Object.values(item).includes(true) &&
//               item.mainCode == forsearchMain.value &&
//               item.subCode == forsearchSub.value
//             );
//           } else {
//             return (
//               !Object.values(item).includes(true) &&
//               item.mainCode == forsearchMain.value
//             );
//           }
//         });
//       } else {
//         rowData2.value = KDSSettingList.value.filter((item) => {
//           if (forsearchMain.value == "0") {
//             return item;
//           } else if (forsearchMain.value != "0" && forsearchSub.value != "0") {
//             return (
//               item.mainCode == forsearchMain.value &&
//               item.subCode == forsearchSub.value
//             );
//           } else if (forsearchMain.value != "0" && forsearchSub.value == "0") {
//             return item.mainCode == forsearchMain.value;
//           }
//         });
//       }
//     }
//   }

//   const temp = searchword1.value;
//   searchword1.value = "";
//   setTimeout(() => {
//     searchword1.value = temp;
//   }, 10);
// });

const searchMenuList = (e) => {
  searchword1.value = e.target.value;
};

/**
 *  저장 버튼 함수
 */

const saveButton = async () => {
  if (currentMenu.value == false) {
    if (afterSearch.value == false) {
      Swal.fire({
        title: "경고",
        text: "조회를 먼저 진행해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }
  } else {
    if (afterSearch2.value == false) {
      Swal.fire({
        title: "경고",
        text: "조회를 먼저 진행해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }
  }
  if (currentMenu.value == false) {
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
  } else if (currentMenu.value == true) {
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

        if (currentMenu.value == false) {
          const kdsNo = updatedList.value
            .filter((item) => item.deleted != true)
            .map((item) => item.kdsCornerNum);
          const kdsNm = updatedList.value
            .filter((item) => item.deleted != true)
            .map((item) => item.kdsCornerNm);
          const deleteNo = updatedList.value
            .filter((item) => item.deleted == true)
            .map((item) => item.kdsCornerNum);
          //comsole.log(kdsNo);
          //comsole.log(kdsNm);

          //comsole.log(deleteNo);
          res = await saveKDSList(
            groupCd.value,
            kdsNo.join(","),
            kdsNm.join(","),
            userData.loginID,
            deleteNo.join(",")
          );
        } else {
          //comsole.log(forSaveMenu.value);
          res = await saveKDSSettingAll(
            groupCd.value,
            nowStoreCd.value,
            JSON.stringify(forSaveMenu.value),
            userData.loginID
          );
        }

        //comsole.log(res);
      } catch (error) {
      } finally {
        store.state.loading = false;
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

const changeRow = ref();
/**
 * 데이터셋 상세정보 셋팅
 */

const clickedRowData = (newValue) => {
  afterClick.value = true;
  //comsole.log(newValue);
  clickedNo.value = newValue[1];
  clickedNm.value = newValue[2];
  //changeRow.value = newValue.index;
  //comsole.log(changeRow.value);
};

/**
 * pickStore - 포스번호 세팅
 */

const handlePosNo = (newValue) => {
  posNo.value = newValue;
  //comsole.log(posNo.value);
  if (nowStoreAreaCd.value != undefined || posNo.value != undefined) {
    searchButton();
  }
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
