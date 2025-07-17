/*--############################################################################
# Filename : MST57_001INS.vue                                                  
# Description : 마스터관리 > POS 마스터 > 메뉴 카테고리 관리                    
# Date :2025-05-14                                                             
# Author : 권맑음                     
################################################################################*/
<template>
  <!-- 조회 조건 -->
  <div class="flex justify-between items-center w-full overflow-y-hidden">
    <div class="flex justify-start pt-0">
      <PageName></PageName>
      <div class="flex justify-end space-x-2 ml-[1168px]">
        <div class="flex justify-center space-x-2 mt-2">
          <button @click="searchButton" class="button search md:w-auto w-14">
            조회
          </button>

          <button
            @click="saveButton"
            class="button save text-sm md:w-auto w-14">
            저장
          </button>
        </div>
      </div>
    </div>
  </div>
  <br />

  <div
    class="flex justify-start space-x-5 bg-gray-200 rounded-lg md:h-16 h-24 items-center">
    <PickStore
      @update:storeAreaCd="handleStoreAreaCd"
      @update:storeCd="handleStoreCd"
      :showAreaCd="true"></PickStore>
  </div>
  <!-- 조회 조건 -->
  <!-- 데이터 영역 -->
  <div class="inline-block md:flex w-full">
    <span class="md:hidden font-bold flex justify-center w-auto">
      클릭하시면 아래 페이지에서 다국어 정보가 나옵니다.</span
    >
    <div
      class="border border-black md:w-64 w-full h-96 md:ml-5 ml-0 mt-10 overflow-auto">
      <div
        v-for="i in Category"
        :key="i.MajorCode"
        class="ml-5 w-auto flex justify-start items-start flex-col">
        <button
          @click="bringCategory(i.MajorCode)"
          class="font-bold"
          style="font-size: 15px">
          {{ i.MajorName }}
        </button>
        <div
          v-for="x in i.SubCategory"
          :key="x.SubCode"
          class="flex items-start w-auto ml-5"
          :class="{ 'bg-lightblue': selectedButton === x.SubCode }">
          <button
            class="font-thin"
            @click="bringCategory(i.MajorCode)"
            style="font-size: 15px">
            {{ x.SubName }}
          </button>
        </div>
      </div>
    </div>
    <div
      class="h-60 md:ml-8 ml-1 mt-10 border-t border-b border-black md:w-[71%] w-full"
      v-if="afterCategory">
      <div
        class="text-white h-9 w-24 rounded-md flex items-center -mt-9 float-end md:-mr-10 mr-32 space-x-5">
        <button
          class="whitebutton"
          style="font-size: 14px"
          @click="deleteMainCategory">
          삭제
        </button>
      </div>
      <div
        class="grid grid-cols-[1fr_3fr] grid-rows-5 mt-0 h-full divide-x divide-y divide-gray-300 -ml-2">
        <div
          class="bg-gray-200 flex justify-start items-center pl-4 font-bold"
          style="color: #5782ff">
          *메인카테고리명(한국어)
        </div>
        <div class="bg-white md:w-96 w-full">
          <input
            type="text"
            class="border border-gray-300 h-6 mt-2 w-8/12 md:w-96 flex justify-start ml-4 pl-2"
            v-model="languageName0"
            @input="changeMajorName"
            @keyup="afterModifed" />
        </div>
        <div class="bg-gray-200 flex justify-start items-center pl-4">
          메인카테고리명(영어)
        </div>
        <div class="bg-white md:w-96 w-full">
          <input
            type="text"
            class="border border-gray-300 h-6 mt-2 w-8/12 md:w-96 flex justify-start ml-4 pl-2"
            v-model="languageName1"
            @input="changeMajorName1"
            @keyup="afterModifed" />
        </div>
        <div class="bg-gray-200 flex justify-start items-center pl-4">
          메인카테고리명(중국어)
        </div>
        <div class="bg-white md:w-96 w-full">
          <input
            type="text"
            class="border border-gray-300 h-6 mt-2 w-8/12 md:w-96 flex justify-start ml-4 pl-2"
            v-model="languageName2"
            @input="changeMajorName2"
            @keyup="afterModifed" />
        </div>
        <div class="bg-gray-200 flex justify-start items-center pl-4">
          메인카테고리명(일본어)
        </div>
        <div class="bg-white md:w-96 w-full">
          <input
            type="text"
            class="border border-gray-300 h-6 mt-2 w-8/12 md:w-96 flex justify-start ml-4 pl-2"
            v-model="languageName3"
            @input="changeMajorName3"
            @keyup="afterModifed" />
        </div>
        <div class="bg-gray-200 flex justify-start items-center pl-4">
          메인카테고리명(스페인어)
        </div>
        <div class="bg-white md:w-96 w-full">
          <input
            type="text"
            class="border border-gray-300 h-6 mt-2 w-8/12 md:w-96 flex justify-start ml-4 pl-2"
            v-model="languageName4"
            @input="changeMajorName4"
            @keyup="afterModifed" />
        </div>
      </div>
    </div>
  </div>

  <div
    class="justify-start md:ml-5 ml-14 mt-5 space-x-2 hidden md:flex"
    v-show="afterSearch">
    <button
      class="whitebutton"
      style="font-size: 14px"
      @click="addMainCategory">
      메인카테고리추가
    </button>
  </div>
  <div class="flex justify-between -mt-36 ml-5" v-if="afterCategory">
    <div class="rounded-md h-10 w-auto ml-72 flex items-center">
      <button
        class="whitebutton"
        @click="addsubCategory"
        style="font-size: 14px">
        서브카테고리 추가
      </button>
    </div>
    <div class="rounded-md h-10 w-auto flex items-center justify-center mr-44">
      <button
        class="whitebutton"
        style="font-size: 14px"
        @click="deleteAllsubCategory">
        전체 삭제
      </button>
    </div>
  </div>

  <div
    class="border border-neutral-600 -z-20"
    style="margin-left: 307px; width: 71%"
    v-if="afterCategory"></div>
  <div
    class="h-60 mt-10 border-t border-b border-white"
    style="margin-left: 296px; width: 71%"
    v-for="i in subMultiLang"
    v-if="afterCategory">
    <div class="-mt-10" style="margin-left: 1120px">
      <button class="whitebutton" @click="deleteSubCategory(i[0].categoryCode)">
        삭제
      </button>
    </div>
    <div
      class="grid grid-cols-[1fr_3fr] grid-rows-5 mt-0 h-full divide-x divide-y divide-gray-300 ml-3">
      <div
        class="bg-gray-200 flex justify-start items-center pl-4 font-bold"
        style="color: #5782ff">
        *서브카테고리명(한국어)
      </div>
      <div class="bg-white">
        <input
          type="text"
          class="border border-gray-300 h-6 mt-2 w-96 flex justify-start ml-4 pl-2"
          :value="i[0] ? i[0].LanguageName : ''"
          @input="
            (event) => {
              changeSubName(i[0].categoryCode, event);
              subcategorynm(event);
            }
          "
          @keyup="afterModifed" />
      </div>
      <div class="bg-gray-200 flex justify-start items-center pl-4">
        서브카테고리명(영어)
      </div>
      <div class="bg-white">
        <input
          type="text"
          class="border border-gray-300 h-6 mt-2 w-96 flex justify-start ml-4 pl-2"
          :value="i[1] ? i[1].LanguageName : ''"
          @input="(event) => changeSubName1(i[0].categoryCode, event)"
          @keyup="afterModifed" />
      </div>
      <div class="bg-gray-200 flex justify-start items-center pl-4">
        서브카테고리명(중국어)
      </div>
      <div class="bg-white">
        <input
          type="text"
          class="border border-gray-300 h-6 mt-2 w-96 flex justify-start ml-4 pl-2"
          :value="i[2] ? i[2].LanguageName : ''"
          @input="(event) => changeSubName2(i[0].categoryCode, event)"
          @keyup="afterModifed" />
      </div>
      <div class="bg-gray-200 flex justify-start items-center pl-4">
        서브카테고리명(일본어)
      </div>
      <div class="bg-white">
        <input
          type="text"
          class="border border-gray-300 h-6 mt-2 w-96 flex justify-start ml-4 pl-2"
          :value="i[3] ? i[3].LanguageName : ''"
          @input="(event) => changeSubName3(i[0].categoryCode, event)"
          @keyup="afterModifed" />
      </div>
      <div class="bg-gray-200 flex justify-start items-center pl-4">
        서브카테고리명(스페인어)
      </div>
      <div class="bg-white">
        <input
          type="text"
          class="border border-gray-300 h-6 mt-2 w-96 flex justify-start ml-4 pl-2"
          :value="i[4] ? i[4].LanguageName : ''"
          @input="(event) => changeSubName4(i[0].categoryCode, event)"
          @keyup="afterModifed" />
      </div>
    </div>
    <div class="float-right -mr-32 space-y-5"></div>
  </div>
  <div class="flex justify-end mr-40 mt-10" v-show="afterCategory">
    <div class="flex flex-col items-end">
      <div
        class="text-white rounded-md h-8 w-44 flex items-center justify-center">
        <button class="whitebutton" @click="addsubCategory">
          서브카테고리 추가
        </button>
      </div>
      <div
        class="text-white rounded-md h-8 w-28 flex items-center justify-center mt-5 mr-1">
        <button class="button save" @click="saveButton">저장</button>
      </div>
    </div>
  </div>
  <!-- 데이터 영역 -->
  <br />
  <br />
  <br />
</template>

<script setup>
import {
  getCategoryInfo,
  getMultiLingual,
  setMainCategoryDELETE,
  setMainCategoryINSERT,
  setMainCategoryUpdate,
  setSubCategoryDelete,
  setSubCategoryINSERT,
  setSubCategoryUPDATE,
} from "@/api/master";
/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
/**
 * 매장 공통 컴포넌트
 */

import PickStore from "@/components/pickStore.vue";
/**
 *  페이지로그 자동 입력
 *  */

import { insertPageLog } from "@/customFunc/customFunc";
/**
 *  경고창 호출 라이브러리
 *  */

import Swal from "sweetalert2";
/*
 * 공통 표준  Function
 */

import { onMounted, ref, watch } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";

/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
});

const searchStoreName = ref();
const selectedButton = ref();
const Category = ref([]);
const getMultiLang = ref([]);
const mainMultiLang = ref([]);
const subMultiLang = ref([]);
const mainCategoryInsert = ref(false);
const store = useStore();
const nowStoreCd = ref();
const afterCategory = ref(false);
const currentMajorCode = ref();
const newMainCategoryCode = ref([]);
/**
 * 페이지 매장 코드 세팅
 */

const handleStoreCd = (newValue) => {
  // if (newValue == "0") {
  afterSearch.value = false;
  // }
  nowStoreCd.value = newValue;
};
const afterSearch = ref(false);
const modified = ref(false);
const afterModifed = () => {
  modified.value = true;
};
const fillsubCategory = ref(true);
const subcategorynm = (event) => {
  const value = event.target.value;
  if (value == "") {
    fillsubCategory.value = false;
  } else {
    fillsubCategory.value = true;
  }
};
watch(nowStoreCd, (newvalue, oldvalue) => {
  if (newvalue != oldvalue) {
    getMultiLang.value = [];
    mainMultiLang.value = [];
    subMultiLang.value = [];
    Category.value = [];
    languageName0.value = "";
    languageName1.value = "";
    languageName2.value = "";
    languageName3.value = "";
    languageName4.value = "";
    convertedsubMultiLang.value = [];
  }
});
const nowStoreAreaCd = ref();
/**
 *  pickStore - 지역코드 세팅
 */

const handleStoreAreaCd = (newValue) => {
  nowStoreAreaCd.value = newValue;
};

const languageName0 = ref("");
const languageName1 = ref("");
const languageName2 = ref("");
const languageName3 = ref("");
const languageName4 = ref("");
const userData = store.state.userData;
const groupCd = ref(userData.lngStoreGroup);

const addMainCategory = () => {
  afterCategory.value = true;
  const newMajorCode = Category.value.map((item) => {
    return Number(item.MajorCode);
  });

  const newmajorcode =
    newMajorCode.length == 0
      ? "1"
      : (newMajorCode[newMajorCode.length - 1] + 1).toString();
  newMainCategoryCode.value.push(newmajorcode);
  const newMainCategory = {
    MajorCode: newmajorcode,
    MajorName: "새 카테고리",
    SubCategory: [],
    mainMultilang: [],
    subMultilang: [],
  };
  const languagename0 = {
    TypeCode: "4",
    categoryCode: newmajorcode,
    LanguageID: "0",
    LanguageName: "새 카테고리",
  };
  const languagename1 = {
    TypeCode: "4",
    categoryCode: newmajorcode,
    LanguageID: "1",
    LanguageName: "",
  };
  const languagename2 = {
    TypeCode: "4",
    categoryCode: newmajorcode,
    LanguageID: "2",
    LanguageName: "",
  };
  const languagename3 = {
    TypeCode: "4",
    categoryCode: newmajorcode,
    LanguageID: "3",
    LanguageName: "",
  };
  const languagename4 = {
    TypeCode: "4",
    categoryCode: newmajorcode,
    LanguageID: "4",
    LanguageName: "",
  };
  getMultiLang.value.push(languagename0);
  getMultiLang.value.push(languagename1);
  getMultiLang.value.push(languagename2);
  getMultiLang.value.push(languagename3);
  getMultiLang.value.push(languagename4);
  Category.value.push(newMainCategory);
  languageName0.value = "새 카테고리";
  languageName1.value = "";
  languageName2.value = "";
  languageName3.value = "";
  languageName4.value = "";
  currentMajorCode.value = newmajorcode;
  bringCategory(newmajorcode);
  addsubCategory();
};
const changeMajorName = (event) => {
  let inputdata = event.target.value;
  const changegetMulilang = () => {
    getMultiLang.value.map((item) => {
      if (
        item.categoryCode == currentMajorCode.value &&
        item.TypeCode == "4" &&
        item.LanguageID == "0"
      ) {
        item.LanguageName = inputdata;
      }
    });
  };
  changegetMulilang();
  const changingcategoryname = () => {
    Category.value.filter((item) => {
      if (item.MajorCode == currentMajorCode.value) {
        item.MajorName = inputdata;
      }
    });
  };
  changingcategoryname();
};
const changeMajorName1 = (event) => {
  let inputdata = event.target.value;
  const changegetMulilang = () => {
    getMultiLang.value.map((item) => {
      if (
        item.categoryCode == currentMajorCode.value &&
        item.TypeCode == "4" &&
        item.LanguageID == "1"
      ) {
        item.LanguageName = inputdata;
      }
    });
  };
  changegetMulilang();
};
const changeMajorName2 = (event) => {
  let inputdata = event.target.value;
  const changegetMulilang = () => {
    getMultiLang.value.map((item) => {
      if (
        item.categoryCode == currentMajorCode.value &&
        item.TypeCode == "4" &&
        item.LanguageID == "2"
      ) {
        item.LanguageName = inputdata;
      }
    });
  };
  changegetMulilang();
};
const changeMajorName3 = (event) => {
  let inputdata = event.target.value;
  const changegetMulilang = () => {
    getMultiLang.value.map((item) => {
      if (
        item.categoryCode == currentMajorCode.value &&
        item.TypeCode == "4" &&
        item.LanguageID == "3"
      ) {
        item.LanguageName = inputdata;
      }
    });
  };
  changegetMulilang();
};
const changeMajorName4 = (event) => {
  let inputdata = event.target.value;
  const changegetMulilang = () => {
    getMultiLang.value.map((item) => {
      if (
        item.categoryCode == currentMajorCode.value &&
        item.TypeCode == "4" &&
        item.LanguageID == "4"
      ) {
        item.LanguageName = inputdata;
      }
    });
  };
  changegetMulilang();
};
const deleteSubCategory = async (categoryCode) => {
  const result = await Swal.fire({
    title: "경고",
    text: "서브 카테고리를 삭제하시겠습니까?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "삭제",
    cancelButtonText: "취소",
    allowOutsideClick: false,
  });

  if (result.isConfirmed) {
    try {
      const res = await setSubCategoryDelete(
        groupCd.value,
        nowStoreCd.value,
        nowStoreAreaCd.value,
        currentMajorCode.value,
        categoryCode
      );

      if (res.status === 200) {
        await Swal.fire({
          title: "삭제 성공",
          text: "삭제되었습니다",
          icon: "success",
          confirmButtonText: "확인",
        });

        await searchButton();
        bringCategory(currentMajorCode.value);
      }
    } catch (error) {
      //console.error("삭제 중 오류 발생:", error);
      Swal.fire({
        title: "오류",
        text: "서브 카테고리 삭제 중 오류가 발생했습니다.",
        icon: "error",
        confirmButtonText: "확인",
      });
    }
  }
};

const deleteMainCategory = () => {
  Swal.fire({
    title: "경고",
    text: "메인 카테고리를 삭제하시겠습니까?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "삭제",
    cancelButtonText: "취소",
    allowOutsideClick: false,
  }).then(async (result) => {
    if (result.isConfirmed) {
      const subMultis = getMultiLang.value
        .flatMap((innerArray) => innerArray)
        .filter(
          (items) =>
            items.LanguageID == "0" &&
            currentMajorCode.value == items.categoryCode &&
            items.TypeCode == "4"
        );
      const subCd = subMultis.map((item) => item.categoryCode);

      const res = await setMainCategoryDELETE(
        groupCd.value,
        nowStoreCd.value,
        nowStoreAreaCd.value,
        currentMajorCode.value,
        subCd.join(",")
      );

      if (res.status == 200) {
        Swal.fire({
          title: "삭제 성공",
          text: "삭제되었습니다",
          icon: "success",
          confirmButtonText: "확인",
        });
        searchButton();
      }
    } else {
      return;
    }
  });
};
const deleteAllsubCategory = async () => {
  Swal.fire({
    title: "경고",
    text: "서브 카테고리를 전체 삭제하시겠습니까?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "삭제",
    cancelButtonText: "취소",
    allowOutsideClick: false,
  }).then(async (result) => {
    if (result.isConfirmed) {
      const subMultis = subMultiLang.value
        .flatMap((innerArray) => innerArray)
        .filter((items) => items.LanguageID == "0");
      const subCd = subMultis.map((item) => item.categoryCode);

      const res = await setSubCategoryDelete(
        groupCd.value,
        nowStoreCd.value,
        nowStoreAreaCd.value,
        currentMajorCode.value,
        subCd.join(",")
      ).then(async (result) => {
        if (result.status == 200) {
          Swal.fire({
            title: "전체 삭제 성공",
            text: "삭제되었습니다",
            icon: "success",
            confirmButtonText: "확인",
          }).then(async () => {
            await searchButton().then(() => {
              bringCategory(currentMajorCode.value);
            });
          });
        }
      });
    }
  });
};

/**
 *  조회 함수
 */
const searchButton = async () => {
  subMultiLang.value = [];
  Category.value = [];
  languageName0.value = "";
  languageName1.value = "";
  languageName2.value = "";
  languageName3.value = "";
  languageName4.value = "";
  convertedsubMultiLang.value = [];
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
      text: "지역코드를 선택하세요.",
      icon: "warning",
      showCancelButton: false,
      confirmButtonColor: "#3085d6",
      allowOutsideClick: false,
    });
    return;
  }
  store.state.loading = true;
  try {
    const res = await getCategoryInfo(
      groupCd.value,
      nowStoreCd.value,
      nowStoreAreaCd.value
    );

    Category.value = res.data.MainCategory;
    afterSearch.value = true;
    const res1 = await getMultiLingual(groupCd.value, nowStoreCd.value);

    getMultiLang.value = res1.data.MultiLingual;
  } catch (error) {
    afterSearch.value = false;
  } finally {
    store.state.loading = false; // 로딩 상태 종료
    (() => {
      Category.value.filter((item) => {
        item.SubCategory = item.SubCategory.filter((sub) => sub.SubCode !== "");
      });
    })();
    modified.value = false;
    afterCategory.value = false;
  }
  //comsole.log(Category.value);
};

/***
 *  저장 함수
 */
const saveButton = async () => {
  // if(newMainCategoryCode.value.includes(currentMajorCode.value) && ){

  // }
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 진행해주세요.",
      icon: "warning",
      showCancelButton: false,
      confirmButtonColor: "#3085d6",
      allowOutsideClick: false,
    });
    return;
  }
  if (modified.value == false) {
    Swal.fire({
      title: "경고",
      text: "변경사항이 없습니다.",
      icon: "warning",
      showCancelButton: false,
      confirmButtonColor: "#3085d6",
      allowOutsideClick: false,
    });
    return;
  }
  if (fillsubCategory.value == false) {
    Swal.fire({
      title: "경고",
      text: "서브카테고리(한국어)를 입력해주세요.",
      icon: "warning",
      showCancelButton: false,
      confirmButtonColor: "#3085d6",
      allowOutsideClick: false,
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
      let res;

      if (!newMainCategoryCode.value.includes(currentMajorCode.value)) {
        res = await setMainCategoryUpdate(
          groupCd.value,
          nowStoreCd.value,
          nowStoreAreaCd.value,
          currentMajorCode.value,
          [
            languageName0.value,
            languageName1.value,
            languageName2.value,
            languageName3.value,
            languageName4.value,
          ].join(","),
          ["0", "1", "2", "3", "4"].join(",")
        );
      } else if (newMainCategoryCode.value.includes(currentMajorCode.value)) {
        res = await setMainCategoryINSERT(
          groupCd.value,
          nowStoreCd.value,
          nowStoreAreaCd.value,
          currentMajorCode.value,
          [
            languageName0.value,
            languageName1.value,
            languageName2.value,
            languageName3.value,
            languageName4.value,
          ].join(","),
          ["0", "1", "2", "3", "4"].join(",")
        );
      }

      const subMultis = subMultiLang.value
        .flatMap((innerArray) => innerArray) // 이중 배열을 평평하게 만듭니다.
        .filter((item) => item.Insert === true); // Insert 속성이 true인 요소만 필터링합니다.

      const subCd = subMultis.map((item) => item.categoryCode);
      const subNm = subMultis.map((item) => item.LanguageName);
      const languageNm = subMultis.map((item) => item.LanguageID);

      const subMultis2 = subMultiLang.value
        .flatMap((innerArray) => innerArray) // 이중 배열을 평평하게 만듭니다.
        .filter((item) => item.Insert != true); // Insert 속성이 true인 요소만 필터링합니다.

      const subCd2 = subMultis2.map((item) => item.categoryCode);
      const subNm2 = subMultis2.map((item) => item.LanguageName);
      const languageNm2 = subMultis2.map((item) => item.LanguageID);
      //comsole.log(subCd);
      //comsole.log(subNm);
      //comsole.log(languageNm);
      try {
        const res2 = await setSubCategoryINSERT(
          groupCd.value,
          nowStoreCd.value,
          nowStoreAreaCd.value,
          currentMajorCode.value,
          subCd.join(","),
          subNm.join(","),
          languageNm.join(",")
        );

        const res3 = await setSubCategoryUPDATE(
          groupCd.value,
          nowStoreCd.value,
          nowStoreAreaCd.value,
          currentMajorCode.value,
          subCd2.join(","),
          subNm2.join(","),
          languageNm2.join(",")
        );

        // 이제 res2를 사용하여 상태 확인 가능
        if (res2.status === 200 && res3.status === 200) {
          await searchButton(); // searchMenu()도 await
          bringCategory(currentMajorCode.value);

          Swal.fire({
            title: "저장 성공",
            text: "저장되었습니다.",
            icon: "success",
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            allowOutsideClick: false,
          });
        }
      } catch (error) {
        // 오류 처리
        //console.error("Error occurred:", error);
        Swal.fire({
          title: "저장 실패",
          text: "오류가 발생했습니다.",
          icon: "error",
          showCancelButton: false,
          confirmButtonColor: "#3085d6",
          allowOutsideClick: false,
        });
      } finally {
        newMainCategoryCode.value = [];
        modified.value = false;
      }
    } else {
      return;
    }
  });
};

const convertedsubMultiLang = ref([]);
const subCode3 = ref();
const userInputData = ref([]);
const bringCategory = (value) => {
  afterCategory.value = true;
  if (newMainCategoryCode.value.includes(value)) {
    mainCategoryInsert.value = true;
  } else {
    mainCategoryInsert.value = false;
  }

  currentMajorCode.value = value;
  // //comsole.log(getMultiLang.value);
  // //comsole.log(Category.value);
  Category.value = Category.value.map((categoryItem) => {
    // getMultiLang에서 MajorCode와 일치하는 항목을 찾아 mainMultilang으로 설정
    categoryItem.mainMultilang = getMultiLang.value.filter(
      (item) =>
        item.TypeCode === "4" && item.categoryCode === categoryItem.MajorCode
    );
    categoryItem.subMultilang = getMultiLang.value.filter((item) => {
      const matchedSubCategory = categoryItem.SubCategory.find(
        (sub) => sub.SubCode === item.categoryCode
      );
      return item.TypeCode === "3" && matchedSubCategory;
    });
    return categoryItem;
  });

  selectedButton.value = value;

  languageName0.value = Category.value
    .map((item) => {
      const result = item.mainMultilang.find(
        (item2) => item2.LanguageID === "0" && item2.categoryCode === value
      );
      return result ? result.LanguageName : "";
    })
    .filter((name) => name !== ""); // 빈 값 제거

  languageName1.value = Category.value
    .map((item) => {
      const result = item.mainMultilang.find(
        (item2) => item2.LanguageID === "1" && item2.categoryCode === value
      );
      return result ? result.LanguageName : "";
    })
    .filter((name) => name !== ""); // 빈 값 제거

  languageName2.value = Category.value
    .map((item) => {
      const result = item.mainMultilang.find(
        (item2) => item2.LanguageID === "2" && item2.categoryCode === value
      );
      return result ? result.LanguageName : "";
    })
    .filter((name) => name !== "");

  languageName3.value = Category.value
    .map((item) => {
      const result = item.mainMultilang.find(
        (item2) => item2.LanguageID === "3" && item2.categoryCode === value
      );
      return result ? result.LanguageName : "";
    })
    .filter((name) => name !== "");

  languageName4.value = Category.value
    .map((item) => {
      const result = item.mainMultilang.find(
        (item2) => item2.LanguageID === "4" && item2.categoryCode === value
      );
      return result ? result.LanguageName : "";
    })
    .filter((name) => name !== "");

  const subCodes = Category.value
    .filter((item2) => item2.MajorCode == value)
    .flatMap((item2) => item2.SubCategory.map((item3) => item3.SubCode));
  //comsole.log(subCodes);
  subMultiLang.value = subCodes.map((code) => {
    // 각 code에 대해 필터링하여 해당 categoryCode와 일치하는 subMultilang 항목을 모음
    return Category.value
      .map((item) => {
        return item.subMultilang.filter((item2) => item2.categoryCode === code);
      })
      .flat(); // 각 배열을 평탄화하여 단일 배열로 만듭니다.
  });
};

const addsubCategory = () => {
  fillsubCategory.value = false;
  let maxSubCode = Math.max(
    ...Category.value
      .filter((item) => item.SubCategory && item.SubCategory.length > 0)
      .flatMap((item) => item.SubCategory.map((sub) => Number(sub.SubCode)))
  );

  if (!isFinite(maxSubCode)) {
    maxSubCode = 0; // 원하는 기본값으로 설정
  }
  maxSubCode = (Number(maxSubCode) + 1).toString();

  (() => {
    Category.value.filter((item) => {
      if (item.MajorCode === currentMajorCode.value) {
        item.SubCategory.push({ SubCode: maxSubCode, SubName: "" });
      }
    });
  })();

  const sumarray = [];

  const newsubCategory0 = {
    TypeCode: "3",
    categoryCode: maxSubCode,
    LanguageID: "0",
    LanguageName: "",
    Insert: true,
  };
  const newsubCategory1 = {
    TypeCode: "3",
    categoryCode: maxSubCode,
    LanguageID: "1",
    LanguageName: "",
    Insert: true,
  };
  const newsubCategory2 = {
    TypeCode: "3",
    categoryCode: maxSubCode,
    LanguageID: "2",
    LanguageName: "",
    Insert: true,
  };
  const newsubCategory3 = {
    TypeCode: "3",
    categoryCode: maxSubCode,
    LanguageID: "3",
    LanguageName: "",
    Insert: true,
  };
  const newsubCategory4 = {
    TypeCode: "3",
    categoryCode: maxSubCode,
    LanguageID: "4",
    LanguageName: "",
    Insert: true,
  };

  sumarray.push(newsubCategory0);
  sumarray.push(newsubCategory1);
  sumarray.push(newsubCategory2);
  sumarray.push(newsubCategory3);
  sumarray.push(newsubCategory4);
  getMultiLang.value.push(newsubCategory0);
  getMultiLang.value.push(newsubCategory1);
  getMultiLang.value.push(newsubCategory2);
  getMultiLang.value.push(newsubCategory3);
  getMultiLang.value.push(newsubCategory4);

  subMultiLang.value.push(sumarray);

  //bringCategory(currentMajorCode.value);
};
const changeSubName = (categorycode, event) => {
  let inputdata = event.target.value;
  const changegetMulilang = () => {
    getMultiLang.value.map((item) => {
      if (
        item.categoryCode == categorycode &&
        item.TypeCode == "3" &&
        item.LanguageID == "0"
      ) {
        item.LanguageName = inputdata;
      }
    });
  };
  changegetMulilang();
};
const changeSubName1 = (categorycode, event) => {
  let inputdata = event.target.value;
  const changegetMulilang = () => {
    getMultiLang.value.map((item) => {
      if (
        item.categoryCode == categorycode &&
        item.TypeCode == "3" &&
        item.LanguageID == "1"
      ) {
        item.LanguageName = inputdata;
      }
    });
  };
  changegetMulilang();
};
const changeSubName2 = (categorycode, event) => {
  let inputdata = event.target.value;
  const changegetMulilang = () => {
    getMultiLang.value.map((item) => {
      if (
        item.categoryCode == categorycode &&
        item.TypeCode == "3" &&
        item.LanguageID == "2"
      ) {
        item.LanguageName = inputdata;
      }
    });
  };
  changegetMulilang();
};
const changeSubName3 = (categorycode, event) => {
  let inputdata = event.target.value;
  const changegetMulilang = () => {
    getMultiLang.value.map((item) => {
      if (
        item.categoryCode == categorycode &&
        item.TypeCode == "3" &&
        item.LanguageID == "3"
      ) {
        item.LanguageName = inputdata;
      }
    });
  };
  changegetMulilang();
};
const changeSubName4 = (categorycode, event) => {
  let inputdata = event.target.value;
  const changegetMulilang = () => {
    getMultiLang.value.map((item) => {
      if (
        item.categoryCode == categorycode &&
        item.TypeCode == "3" &&
        item.LanguageID == "4"
      ) {
        item.LanguageName = inputdata;
      }
    });
  };
  changegetMulilang();
};
</script>
