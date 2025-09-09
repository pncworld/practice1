/*--############################################################################
# Filename : MST01_008INS.vue                                                  
# Description : 마스터관리 > 메뉴 마스터 > 대그룹코드등록                      
  # Date :2025-05-14                                                           
  # Author : 권맑음                     
################################################################################*/
<template>
  <!-- 조회조건 -->
  <div class="flex justify-between items-center w-full overflow-y-hidden">
    <PageName></PageName>
    <div class="flex justify-center mr-9 space-x-2 pr-5">
      <button @click="searchButton" class="button search md:w-auto w-14">
        조회
      </button>

      <button @click="saveButton" class="button save w-auto">저장</button>
      <!-- <button @click="excelButton" class="button excel w-auto">엑셀</button> -->
    </div>
  </div>
  <br />
  <div
    class="flex justify-start space-x-5 bg-gray-200 rounded-lg md:h-16 h-24 items-center">
    <PickStore
      @update:storeCd="handleStoreCd"
      @storeNm="handlestoreNm"
      :hidesub="hidesub"
      :hideAttr="hideAttr"
      @update:ischanged="handleinitAll"
      @update:ischanged2="searchinit"></PickStore>
  </div>
  <div class="z-50"></div>
  <!-- 조회조건 -->
  <!-- 그리드 영역 -->
  <div class="flex justify-center w-[80%] h-[60vh] gap-5 ml-10 mt-5">
    <div class="w-full h-full">
      <div class="flex justify-end gap-2">
        <button class="whitebutton" @click="addRow">추가</button
        ><button class="whitebutton" @click="deleteRow">삭제</button>
      </div>
      <Realgrid
        class="w-full h-full mt-2"
        :progname="'MST01_008INS_VUE'"
        :progid="1"
        :rowData="rowData"
        :showGrid="showGrid"
        :showCheckBar="false"
        :addRow="addbutton"
        @selcetedrowData="selcetedrowData"
        @allStateRows="allStateRows"
        :changeRow="changeRow"
        :deleteRow="deleterow"
        :changeColid="'lngCode'"
        :changeValue="changeValue"
        @updatedRowData="updatedRowData1"
        @clickedRowData="clickedRowData"
        :exporttoExcel="exporttoExcel"
        :ExcelNm="'메뉴 분류 관리'"
        :editableColId="'strName'"
        :commitAll="commitAll"
        :inputOnlyNumberColumn="'lngCode'">
      </Realgrid>
    </div>
    <div class="w-full h-full">
      <div class="flex justify-end gap-2">
        <button class="whitebutton" @click="addRow2">추가</button
        ><button class="whitebutton" @click="deleteRow2">삭제</button>
      </div>
      <Realgrid
        class="w-full h-full mt-2"
        :progname="'MST01_008INS_VUE'"
        :progid="2"
        :rowData="filteredRowData2"
        :showGrid="showGrid"
        :showCheckBar="false"
        :addRow2="addbutton2"
        @allStateRows="allStateRows2"
        :addrowProp="'lngCode,lngMajor'"
        :deleteRow="deleterow2"
        :addrowDefault="addrowDefault"
        @selcetedrowData="selcetedrowData"
        :changeRow="changeRow"
        :changeColid="'strName'"
        :changeValue="changeValue2"
        :inputOnlyNumberColumn="'lngCode'"
        @updatedRowData="updatedRowData"
        @clickedRowData="clickedRowData2"
        :editableColId="'strName'"
        :exporttoExcel="exporttoExcel"
        :ExcelNm="'메뉴 분류 관리'"
        :deleteAll="deleteAll"
        :commitAll="commitAll"></Realgrid>
    </div>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import { getMenuLists, saveMenuManage } from "@/api/master";
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
 *  경고창 호출 라이브러리
 *  */

import Swal from "sweetalert2";
/*
 * 공통 표준  Function
 */

import { onMounted, ref } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";

/**
 * 	화면 Load시 실행 스크립트
 */

const hidesub = ref(true);
const hideAttr = ref(true);
onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  if (store.state.userData.lngCommonMenu == "1") {
    hidesub.value = false;
    hideAttr.value = false;
  } else {
    hidesub.value = true;
    hideAttr.value = true;
  }
});

const nowStoreAreaCd = ref();
const nowStoreCd = ref(0);
/**
 * 선택한 포스 번호 호출 함수
 */

const posNo = ref();
const deleteAll = ref(false);
/**
 *  그리드 검색어 세팅
 */

const searchword1 = ref("");
const MenuGroup = ref("");
const SubMenuGroup = ref("");
const items = ref("");
const forsearchMain = ref("");
const forsearchSub = ref("");
const afterSearch = ref(false);
const clickedStoreNm = ref();
const addrowDefault = ref();
const commitAll = ref(false);
const store = useStore();
const userData = store.state.userData;
const groupCd = ref(userData.lngStoreGroup);
const currentsubNo = ref();

/**
 * 페이지 매장 코드 세팅
 */

const handleStoreCd = async (newValue) => {
  if (newValue == "0" && store.state.userData.lngCommonMenu == "0") {
    afterSearch.value = false;
  }
  nowStoreCd.value = newValue;
  searchButton();
};

/**
 * 페이지 매장명 세팅
 */

const handlestoreNm = (newData) => {
  clickedStoreNm.value = newData;
};

/**
 * 조회 상태 초기화
 */

const searchinit = (newvalue) => {
  afterSearch.value = false;
};

/**
 * 조회 초기화
 */

const handleinitAll = (newvalue) => {
  MenuGroup.value = [];
  SubMenuGroup.value = [];
  items.value = [];
  forsearchMain.value = "0";
  forsearchSub.value = "0";
  afterSearch.value = false;
  searchword1.value = "";
  afterSearch.value = false;
};
const confirmData = ref();
const confirmData2 = ref();
const rowData = ref([]);
const rowData2 = ref([]);
/**
 *  조회 함수
 */

const searchButton = async () => {
  commitAlls();
  items.value = [];
  rowData.value = [];
  rowData2.value = [];
  if (nowStoreCd.value == "0" && store.state.userData.lngCommonMenu == "0") {
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
    if (store.state.userData.lngCommonMenu == "1") {
      nowStoreCd.value = 0;
    }
    let res = await getMenuLists(groupCd.value, nowStoreCd.value);
    rowData.value = res.data.MAINMENU;
    rowData2.value = res.data.SUBMENU;

    confirmData.value = rowData.value;
    confirmData2.value = rowData2.value;
    ////console.log(res);
    //comsole.log(rowData2.value);
  } catch (error) {
    afterSearch.value = false;
  } finally {
    forsaveRowData.value = undefined;

    store.state.loading = false; // 로딩 상태 종료
    filteredRowData2.value = "";
    afterSearch.value = true;
    clickFirst.value = false;
  }
};
const addbutton = ref(false);
/**
 * 추가 버튼 함수
 */

const addRow = () => {
  addbutton.value = !addbutton.value;
};
const addbutton2 = ref(false);
/**
 * 추가 버튼 함수
 */

const addRow2 = () => {
  if (clickFirst.value == false) {
    return;
  }
  //rowData2.value.filter((item) => item.lngMajor == selectedlngCode.value)
  if (updatedrowdata2.value.length > 0) {
    currentsubNo.value = Math.max(
      ...updatedrowdata2.value.map((item) => item.lngCode)
    );
  } else {
    currentsubNo.value = selectedlngCode.value * 100;
  }
  addbutton2.value = !addbutton2.value;
  //comsole.log(currentsubNo.value + 1);
  //comsole.log(filteredRowData2.value);
  addrowDefault.value = (currentsubNo.value + 1).toString() + ",";
  addrowDefault.value += selectedlngCode.value;
  filteredRowData2.value.push({
    lngCode: currentsubNo.value + 1,
    strName: "",
    lngMajor: selectedlngCode.value.toString(),
  });
};
const filteredRowData2 = ref([]);
const selectedlngCode = ref();
const changeRow = ref();
const changeValue = ref("0");
/**
 * 데이터셋 상세정보 셋팅
 */

const clickFirst = ref(false);
const tempMainCode = ref("");
const clickedRowData = (newValue) => {
  //console.log(newValue);
  tempMainCode.value = newValue[0];
  clickFirst.value = true;
  filteredRowData2.value = rowData2.value.filter(
    (item) => item.lngMajor == newValue[0]
  );
  updatedrowdata2.value = filteredRowData2.value;
  selectedlngCode.value = newValue[0];
  changeRow.value = newValue.index;
  //comsole.log(changeRow.value);
};
/**
 * 데이터셋 상세정보 셋팅
 */

const clickedRowData2 = (newValue) => {
  //comsole.log(newValue);
};

/**
 * 입력창 수정 데이터 갱신
 */
const allstaterows2 = ref([]);
const allStateRows2 = (e) => {
  allstaterows2.value = e;
};

const allstaterows = ref([]);
const allStateRows = (e) => {
  allstaterows.value = e;
};
const updatedrowdata2 = ref([]);
const updatedRowData = (newValue) => {
  //comsole.log(newValue);
  //comsole.log(filteredRowData2.value);
  // rowData2.value = rowData2.value.filter(
  //   (item) => Number(item.lngMajor) !== Number(selectedlngCode.value)
  // );

  // for (var i = 0; i < newValue.length; i++) {
  //   rowData2.value.push(newValue[i]);
  // }
  console.log(newValue);
  updatedrowdata2.value = newValue;
  //comsole.log(rowData2.value);
  //comsole.log(newValue.length);
};
const forsaveRowData = ref();
/**
 * 입력창 수정 데이터 갱신
 */

const updatedRowData1 = (newValue) => {
  //comsole.log(newValue);
  const validate = newValue.map((item) => item.lngCode);
  const duplicates = validate.filter(
    (item, index) => validate.indexOf(item) !== index
  );
  //comsole.log(changeValue.value);
  if (duplicates.length > 0) {
    changeValue.value = "0";
    Swal.fire({
      title: "경고",
      text: "중복된 메인분류코드가 존재합니다.",
      icon: "warning",
      confirmButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        changeValue.value = "";
      }
    });
  }
  forsaveRowData.value = newValue;
  //comsole.log(forsaveRowData.value);
};
const deleterow = ref(false);
const deleterow2 = ref(false);
/**
 * 그리드 행 삭제 버튼 함수
 */

const deleteRow2 = () => {
  deleterow2.value = !deleterow2.value;
};

/**
 * 그리드 행 삭제 버튼 함수
 */

const deleteRow = () => {
  deleterow.value = !deleterow.value;
  deleteAlls();
};

/**
 *  저장 버튼 함수
 */

const saveButton = () => {
  commitAlls().then((newvalue) => {
    if (afterSearch.value == false) {
      Swal.fire({
        title: "경고",
        text: "조회를 먼저 진행해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }
    //comsole.log(rowData2.value);
    const length =
      (forsaveRowData.value?.filter(
        (item) =>
          item.strName == "" ||
          item.strName == undefined ||
          item.lngCode == undefined ||
          item.lngCode == "" ||
          isNaN(Number(item.lngCode))
      ).length || 0) +
      (rowData2.value?.filter(
        (item) => item.strName == "" || item.strName == undefined
      ).length || 0);
    if (length > 0) {
      Swal.fire({
        title: "경고",
        text: "입력되지 않은 칸이나 잘못된 값이 포함되어 있습니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }

    if (
      allstaterows2.value.deleted.length == 0 &&
      allstaterows2.value.updated.length == 0 &&
      allstaterows2.value.created.length == 0 &&
      allstaterows.value.deleted.length == 0 &&
      allstaterows.value.updated.length == 0 &&
      allstaterows.value.created.length == 0
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
          //comsole.log(rowData2.value);
          let mainMenulngCode;
          let mainMenuNm;
          let deletedmainMenuCd;
          if (forsaveRowData.value == undefined) {
            mainMenulngCode = rowData.value
              .filter((item) => item.deleted !== true)
              .map((item) => item.lngCode);
            mainMenuNm = rowData.value
              .filter((item) => item.deleted !== true)
              .map((item) => item.strName);
          } else {
            mainMenulngCode = forsaveRowData.value
              .filter((item) => item.deleted !== true)
              .map((item) => item.lngCode);
            mainMenuNm = forsaveRowData.value
              .filter((item) => item.deleted !== true)
              .map((item) => item.strName);
            deletedmainMenuCd = forsaveRowData.value
              .filter((item) => item.deleted == true)
              .map((item) => Number(item.lngCode));
          }
          //comsole.log(forsaveRowData.value);
          //comsole.log(mainMenulngCode);
          //comsole.log(mainMenuNm);

          //comsole.log(deletedmainMenuCd);
          if (deletedmainMenuCd != undefined) {
            rowData2.value = rowData2.value.filter(
              (item) => !deletedmainMenuCd.includes(Number(item.lngMajor))
            );
          }

          console.log(updatedrowdata2.value);
          const subMenulngCode = updatedrowdata2.value
            .filter(
              (item, index) => !allstaterows2.value.deleted.includes(index)
            )
            .map((item) => item.lngCode);
          const subMenuNm = updatedrowdata2.value
            .filter(
              (item, index) => !allstaterows2.value.deleted.includes(index)
            )
            .map((item) => item.strName);
          const subMenuMajorCode = updatedrowdata2.value
            .filter(
              (item, index) => !allstaterows2.value.deleted.includes(index)
            )
            .map((item) => item.lngMajor);
          let res = await saveMenuManage(
            groupCd.value,
            nowStoreCd.value,
            mainMenulngCode.join(","),
            mainMenuNm.join(","),
            subMenulngCode.join(","),
            subMenuNm.join(","),
            subMenuMajorCode.join(","),
            tempMainCode.value
          );
          console.log(res);
          //comsole.log(res);
        } catch (error) {
          //comsole.log(error);
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
  });
};
const exporttoExcel = ref(false);
/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  exporttoExcel.value = !exporttoExcel.value;
};

const deleteAlls = () => {
  deleteAll.value = !deleteAll.value;
};

const commitAlls = () => {
  return new Promise((resolve, reject) => {
    try {
      commitAll.value = !commitAll.value; // 기존 작업
      resolve(commitAll.value); // 성공적으로 토글된 값 반환
    } catch (error) {
      reject(error); // 오류 발생 시 오류 반환
    }
  });
};
</script>

<style></style>
