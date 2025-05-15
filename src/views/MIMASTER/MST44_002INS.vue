/*--############################################################################
# Filename : MST44_002INS.vue                                                  
# Description : 마스터관리 > POS 마스터 > 객층키 설정.                         #
Date :2025-05-14                                                              #
Author : 권맑음                     
################################################################################*/
<template>
  <!-- 조회 조건 -->
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
      @storeNm="handlestoreNm"
      @update:ischanged="handleinitAll"
      @update:ischanged2="searchinit"
      :showPosNo="true"></PickStore>
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
      :dupliapiname="'DUPLICUSTOMORKEY'"
      :progid="1"
      :naming="'POS번호'"
      :naming2="'객층키'">
    </DupliPopUp>
  </div>
  <!-- 조회 조건 -->
  <!-- 그리드 영역 -->
  <span
    class="h-5 mt-3 flex justify-between items-center w-[900px] ml-[700px] z-40">
    <h1 class="font-bold text-xl z-40">
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;객체키 설정
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
  <div class="flex h-5/6 w-full -mt-5">
    <div class="flex flex-col w-3/5 h-5/6">
      <div
        class="flex justify-between mt-0 ml-10 w-full border-b border-b-gray-300">
        <div class="font-bold text-xl w-auto">객층키 목록</div>
        <div>
          <button class="whitebutton" @click="addRow">추가</button>
          <button class="whitebutton" @click="deleteRow">삭제</button>
        </div>
      </div>
      <div class="h-full z-30" v-show="currentMenu == false">
        <div
          class="mt-3 ml-10 grid grid-cols-[1fr,3fr] grid-rows-2 gap-0 w-full">
          <div class="customtableIndex border border-gray-400 rounded-l-lg">
            객층키코드/명
          </div>
          <div class="px-1 py-1 border border-gray-300 rounded-r-lg">
            <input
              type="text"
              class="border w-full h-full px-1 border-gray-400 rounded-lg"
              @input="searchAmountList" />
          </div>
        </div>

        <div class="ml-10 -mt-8 w-full h-full z-30">
          <Realgrid
            class="w-full h-full"
            :progname="'MST44_002INS_VUE'"
            :progid="1"
            :rowData="rowData"
            :showGrid="showGrid"
            :showCheckBar="false"
            @selcetedrowData="selcetedrowData"
            :searchWord="searchword1"
            :searchColId="'lngCode,strName'"
            :addRow="addRows"
            @updatedRowData="updatedRowData"
            :deleteRow="deleteRows"
            @clickedRowData="clickedRowData"
            :inputOnlyNumberColumn="'lngCode'"
            :editableColId="'strName'"></Realgrid>
        </div>
        <div class="flex justify-start ml-10">
          ※ 법인용코드는 삭제되지 않습니다.
        </div>
      </div>
    </div>
    <!-- 그리드 영역 -->
    <!-- 드래그 영역 -->
    <div
      v-if="showOtherKeys == false"
      class="grid grid-rows-[1fr,4fr] grid-cols-1 mt-5 w-full h-full z-20">
      <div
        class="flex h-full w-full items-start justify-center"
        v-show="afterSearch">
        <VueDraggableNext
          v-model="KeyList"
          :move="onMove"
          @end="onEnd"
          animation="200"
          class="grid grid-cols-4 grid-rows-4 mt-16 ml-6 w-[80%] h-full gap-1">
          <div
            v-for="(item, index) in KeyList"
            class="custom-grid-style"
            :class="{
              '!bg-orange-500 !border-blue-700':
                clickedKey1 == index && clickedScreenOrMenu == true,
            }"
            @click="
              saveMenuKeyposition1(index),
                (clickedKey1 = index),
                clickedMenukeys()
            ">
            <span
              class="flex flex-col items-center justify-center w-full h-full rounded-lg"
              ><span class="flex justify-center items-center">{{
                item ? item.lngKeyscrNo : ""
              }}</span
              ><span class="flex justify-center items-center">{{
                item ? item.strKeyName : ""
              }}</span></span
            >
          </div>
        </VueDraggableNext>
      </div>
    </div>
  </div>
  <!-- 드래그 영역 -->
</template>

<script setup>
import {
  getAllScreenList,
  getCustomorList,
  saveAllCustomor,
} from "@/api/master";
/**
 *  복사 팝업 컴포넌트
 *  */

import DupliPopUp from "@/components/dupliPopUp.vue";
/**
 * 	그리드 생성
 */

import Realgrid from "@/components/realgrid.vue";
/**
 *  경고창 호출 라이브러리
 *  */

import Swal from "sweetalert2";
/*
 * 공통 표준  Function
 */

import { onMounted, ref, watch } from "vue";
/*
 * 드래그 라이브러리 호출
 */

import { VueDraggableNext } from "vue-draggable-next";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";

/**
 * 매장 공통 컴포넌트
 */

import PickStore from "@/components/pickStore.vue";
/**
 *  페이지로그 자동 입력
 *  */

import { insertPageLog } from "@/customFunc/customFunc";
/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";

// 더미 데이터
const items = ref([]);
const ScreenKeyOrigin = ref([]);
const clickedFuncSelection = ref(false);
const clickedFuncSelection2 = ref(false);
const ScreenKeys = ref([]);
const currentMenuorTLU = ref(false);
/**
 *  그리드 검색어 세팅
 */

const searchword1 = ref();
/**
 *  그리드 검색어 세팅
 */

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
/**
 * 그리드 행 삭제 버튼 함수
 */

const deleteRows = ref(false);
const clickedKey1 = ref();
const clickedKey2 = ref();
const subsubKeyList3 = ref();
const subsubKeyList4 = ref();
const confirmitem4 = ref();
const clickedStoreNm = ref();
/**
 * 페이지 매장명 세팅
 */

const handlestoreNm = (newData) => {
  clickedStoreNm.value = newData;
};
const showPopup2 = ref(false);

const confirmitem1 = ref([]);

const maxSubCode = ref();
/**
 * 선택한 포스 번호 호출 함수
 */

const posNo = ref();

const currmenuKeyPage = ref(1);
const AllscreenKeyPage = ref(1);
/**
 * 추가 버튼 함수
 */

const addRows = ref(false);
const currentMenu = ref(false);

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

const updateMenuKey = ref(false);

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
};
const nowStoreAreaCd = ref();
/**
 *  pickStore - 지역코드 세팅
 */

const handleStoreAreaCd = (newValue) => {
  nowStoreAreaCd.value = newValue;
  ////comsole.log(nowStoreAreaCd.value)
};

const nowStoreCd = ref();
const afterCategory = ref(false);
/**
 * 페이지 매장 코드 세팅
 */

const handleStoreCd = async (newValue) => {
  afterSearch.value = false;

  rowData.value = [];
  items.value = [];

  nowStoreCd.value = newValue;
};
const Category = ref([]);
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

  if (deleteException.value == true) {
    Swal.fire({
      title: "경고.",
      text: "법인용코드는 삭제할 수 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  deleteRows.value = !deleteRows.value;
};
const MenuGroup = ref([]);
const confirmitem2 = ref([]);
const SubMenuGroup = ref([]);
const rowData = ref([]);

const store = useStore();

const userData = store.state.userData;
const groupCd = ref(userData.lngStoreGroup);
const modified = ref(false);
const afterSearch = ref(false);
const commonKeyList = ref([]);
const KeyList = ref([]);

const subsubKeyList1 = ref([]);
const subsubKeyList2 = ref([]);

const screenList = ref([]);
const clickedScreenOrMenu = ref(false);
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
    const res = await getCustomorList(
      groupCd.value,
      nowStoreCd.value,
      nowStoreAreaCd.value,
      posNo.value
    );

    commonKeyList.value = res.data.CUSTOMOR;

    commonKeyList.value = commonKeyList.value.map((item) => {
      return {
        ...item,
        add: "추가",
      };
    });
    rowData.value = [...commonKeyList.value];
    updatedrowData.value = [...commonKeyList.value];
    KeyList.value = res.data.CUSTOMORKEY;
    //comsole.log(KeyList.value);
    if (KeyList.value.length < 16) {
      for (var i = 0; i < 16; i++) {
        const tindex = KeyList.value.findIndex(
          (item) => item.intKeySeq == i + 1
        );
        if (tindex == -1) {
          KeyList.value.splice(i, 0, { intKeySeq: undefined });
        }
      }
    }
    //comsole.log(KeyList.value);
    confirmitem1.value = JSON.parse(JSON.stringify(commonKeyList.value));
    confirmitem2.value = JSON.parse(JSON.stringify(KeyList.value));
    const res2 = await getAllScreenList(
      groupCd.value,
      nowStoreCd.value,
      nowStoreAreaCd.value,
      posNo.value
    );
    screenList.value = res2.data.ALLScreenList;

    AllscreenKeyPage.value = Math.ceil(ScreenKeyOrigin.value.length / 4);
  } catch (error) {
    afterSearch.value = false;
  } finally {
    ////comsole.log(KeyList.value)
    deleteException.value = false;
    store.state.loading = false; // 로딩 상태 종료
    modified.value = false;
    afterCategory.value = false;
    afterSearch.value = true;
    clickedKey1.value = -1;
  }

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
const updatedrowData = ref([]);
/**
 * 입력창 수정 데이터 갱신
 */

const updatedRowData = (newValue) => {
  updatedrowData.value = newValue;
  //comsole.log(updatedrowData.value);
};

let targetItemIndex2;
const onMove = (evt) => {
  // 예: 드래그 중 이동할 때의 조건 등을 설정할 수 있음
  if (changeMode.value == false) {
    targetItemIndex2 = Array.from(evt.from.children).indexOf(evt.related);
    ////comsole.log(targetItemIndex2)
    return false;
  } else {
    return true;
  }
};

const onEnd = (evt) => {
  // Swap을 처리할 조건
  if (changeMode.value === false) {
    const oldIndex = evt.oldIndex; // 드래그된 아이템의 기존 인덱스

    const swappedItems = [...KeyList.value]; // items를 복사
    //comsole.log(oldIndex);
    //comsole.log(targetItemIndex2);
    const temp = swappedItems[oldIndex];

    swappedItems[oldIndex] = swappedItems[targetItemIndex2];

    swappedItems[targetItemIndex2] = temp;

    //comsole.log(swappedItems);
    // 배열을 업데이트
    //   items.value = swappedItems;

    KeyList.value = swappedItems.map((item, index) => ({
      ...item, // 기존 객체의 다른 속성 유지
      intKeySeq: index + 1, // 배열 순서대로 intKeySeq 재정렬
    }));
  } else {
    updateMenuKey.value = true;
    KeyList.value = KeyList.value.map((item, index) => ({
      ...item, // 기존 객체의 다른 속성 유지
      intKeySeq: index + 1, // 배열 순서대로 intKeySeq 재정렬
    }));
  }
  clickedKey1.value = targetItemIndex2;
  //comsole.log("KeyList:", KeyList.value);
};

/**
 *  저장 버튼 함수
 */

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
      JSON.stringify(updatedrowData.value) &&
    JSON.stringify(confirmitem2.value) == JSON.stringify(KeyList.value)
  ) {
    Swal.fire({
      title: "경고",
      text: "변경된 사항이 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  const notyeslength = updatedrowData.value.filter(
    (item) => item.lngCode == undefined || item.lngCode == ""
  ).length;
  const notyeslength2 = updatedrowData.value.filter(
    (item) => item.strName == undefined || item.strName == ""
  ).length;
  if (notyeslength >= 1) {
    Swal.fire({
      title: "경고",
      text: "객층키코드에 빈 항목이 있습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (notyeslength2 >= 1) {
    Swal.fire({
      title: "경고",
      text: "객층키명에 빈 항목이 있습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  const validate = new Set(updatedrowData.value.map((item) => item.lngCode));
  //comsole.log(validate);
  //comsole.log(updatedrowData.value);
  if (validate.size !== updatedrowData.value.length) {
    Swal.fire({
      title: "경고",
      text: "중복된 객층키코드가 있습니다.",
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
      ////comsole.log(updatedrowData.value)
      const lngCodes = updatedrowData.value
        .filter((item) => item.sort != "법인용" && item.deleted != true)
        .map((item) => item.lngCode);
      const strNames = updatedrowData.value
        .filter((item) => item.sort != "법인용" && item.deleted != true)
        .map((item) => item.strName);
      const intKeySeqs = KeyList.value
        .filter((item) => item.lngKeyscrNo != undefined)
        .map((item) => item.intKeySeq);
      const strKeyNames = KeyList.value
        .filter((item) => item.lngKeyscrNo != undefined)
        .map((item) => item.strKeyName);
      const lngKeyscrNos = KeyList.value
        .filter((item) => item.lngKeyscrNo != undefined)
        .map((item) => item.lngKeyscrNo);

      //comsole.log(intKeySeqs.join(","));
      //comsole.log(strKeyNames.join(","));
      //comsole.log(lngKeyscrNos.join(","));

      try {
        const res2 = await saveAllCustomor(
          groupCd.value,
          nowStoreCd.value,
          nowStoreAreaCd.value,
          posNo.value,
          lngCodes.join("\u200B"),
          strNames.join("\u200B"),
          intKeySeqs.join("\u200B"),
          strKeyNames.join("\u200B"),
          lngKeyscrNos.join("\u200B")
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

/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  showMenuKeys();
});

const showMenuKeys = () => {};

const showOtherKeys = ref(false);
let dataProvider2;
const clickedTLUCD = ref();
const deleteException = ref(false);
const clickedstrName = ref();
const clickedCode = ref();
/**
 * 선택한 행의 상세정보 셋팅
 */

const selcetedrowData = (newValue) => {
  //comsole.log(newValue);
  clickedstrName.value = newValue[2];
  clickedCode.value = newValue[1];
  addKey();
};

/**
 * 데이터셋 상세정보 셋팅
 */

const clickedRowData = (newValue) => {
  //comsole.log(newValue);
  if (newValue[0] == "법인용") {
    deleteException.value = true;
  } else {
    deleteException.value = false;
  }
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

/**
 * pickStore - 포스번호 세팅
 */

const handlePosNo = (newValue) => {
  posNo.value = newValue;
  // //comsole.log(posNo.value)
  // //comsole.log(nowStoreAreaCd.value)
  if (
    nowStoreAreaCd.value != undefined ||
    (posNo.value != undefined && posNo.value != 0)
  ) {
    searchButton();
  }
};

watch(
  () => commonKeyList.value,
  () => {
    showMenuKeys(); // MenuKeyList 값이 변경될 때마다 그리드 업데이트
  }
);

const existMenuKey = ref(false);
const clickedSection = ref(1);
const clickedRealIndex = ref();
const saveMenuKeyposition1 = (index) => {
  clickedSection.value = 1;
  clickedRealIndex.value = index;
};

const addKey = () => {
  KeyList.value[clickedRealIndex.value] = {
    intKeySeq: clickedRealIndex.value + 1,
    strKeyName: clickedstrName.value,
    lngKeyscrNo: clickedCode.value,
  };

  //comsole.log(KeyList.value);
};

/**
 * 삭제 버튼
 */

const deletekey = () => {
  KeyList.value[clickedRealIndex.value] = "";
};

const clickedMenukeys = () => {
  clickedScreenOrMenu.value = true;
};

/**
 * 조회 초기화
 */

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
/**
 * 조회 상태 초기화
 */

const searchinit = (newvalue) => {
  afterSearch.value = false;
};
</script>

<style scoped></style>
