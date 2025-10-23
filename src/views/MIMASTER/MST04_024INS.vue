<!-- /*--############################################################################
# Filename : MST04_024INS.vue                                                  
# Description : 마스터관리 > 자재 마스터2 > 메뉴 레시피 등록.                
# Date :2025-08-20                                                             
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <!-- 조회 조건 -->
  <div class="h-[80%]">
    <div class="flex justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center mr-10 space-x-2 pr-5">
        <button class="button new" @click="addButton2">신규</button>
        <button @click="saveButton2" class="button save">저장</button>
      </div>
    </div>
    <div
      class="grid grid-rows-2 grid-cols-2 justify-start space-x-5 bg-gray-200 rounded-lg h-24 items-center mt-3">
      <div class="flex ml-12 space-x-5">
        <div class="text-base font-semibold">메뉴코드</div>
        <div>
          <input
            type="text"
            disabled
            v-model="cond"
            class="disabled:bg-white border border-black" />
        </div>
      </div>
      <div class="flex !ml-9 space-x-5">
        <div class="text-base font-semibold">메뉴명</div>
        <div>
          <input
            type="text"
            disabled
            v-model="cond2"
            class="disabled:bg-white border border-black" />
        </div>
      </div>
      <div class="flex !ml-12 space-x-5">
        <div class="text-base font-semibold">적용매장</div>
        <div>
          <select name="" id="" class="w-64" v-model="cond3">
            <option :value="i.lngStoreCode" v-for="i in optionList">
              {{ i.strName }}
            </option>
          </select>
        </div>
      </div>
      <div class="flex space-x-5">
        <div class="text-base font-semibold">적용일자</div>
        <div class="flex space-x-5 items-center">
          <input type="date" v-model="cond4" name="dtmFromDate" />
          <span>~</span>
          <input type="date" v-model="cond5" name="dtmToDate" />
        </div>
      </div>
    </div>
    <!-- 조회 조건 -->
    <!-- 그리드 영역 -->
    <span class="flex mt-5 space-x-5 items-center">
      <div class="ml-10 flex justify-start font-bold text-xl">메뉴</div>
      <div>
        <input
          type="text"
          class="border border-black w-32"
          @input="searchValue" />
      </div>
      <div class="flex space-x-1 !ml-1">
        <div>
          <button class="whitebutton" @click="searchButton2">조회</button>
        </div>
        <div>
          <button class="whitebutton" @click="excelButton2">엑셀</button>
        </div>
      </div>
    </span>
    <div
      class="grid grid-rows-1 grid-cols-[1fr,2fr,3fr] h-[65vh] w-full justify-center mt-2">
      <div class="w-[110%] ml-10 h-full">
        <Realgrid
          :progname="'MST04_024INS_VUE'"
          :progid="1"
          :rowData="rowData"
          :setStateBar="false"
          :searchColId="'lngMenuCode,strMenuName'"
          :searchWord3="searchvalue"
          :exporttoExcel="exportToExcel2"
          :documentTitle="'MST04_024INS'"
          :documentSubTitle="documentSubTitle2"
          @clickedRowData="clickedRowData"
          :rowStateeditable="false">
        </Realgrid>
      </div>
      <!-- 그리드 영역 -->
      <!-- 연동 데이터 영역 -->

      <div class="w-[90%] ml-20 -mt-7 h-full">
        <div class="flex justify-start font-bold text-xl">◎ 메뉴 Master</div>
        <Realgrid
          :progname="'MST04_024INS_VUE'"
          :progid="2"
          :rowData="rowData2"
          :changeNow2="changeNow2"
          :changeRow="changeRow"
          :changeValue2="changeValue1"
          :changeColid="changeColid2"
          @selectedIndex="selectedIndex"
          @updatedRowData="updatedRowData"
          @clickedRowData="clickedRowData2"
          :rowStateeditable="false">
        </Realgrid>
      </div>

      <div
        class="grid grid-rows-[0.4fr,6fr,3fr] grid-cols-1 w-[90%] ml-12 h-full -mt-7">
        <div class="flex justify-between font-bold text-xl">
          <div>◎ 메뉴 Detail</div>
          <div class="flex space-x-5">
            <div>
              <button class="whitebutton" @click="addButton">신규</button>
            </div>
            <div>
              <button class="whitebutton" @click="saveButton">저장</button>
            </div>
            <div>
              <button class="whitebutton" @click="excelButton">엑셀</button>
            </div>
          </div>
        </div>
        <div class="h-full">
          <Realgrid
            :progname="'MST04_024INS_VUE'"
            :progid="3"
            :rowData="rowData3"
            @clickedRowData="clickedRowData3"
            @buttonClicked="buttonClicked"
            @allStateRows="allStateRows"
            @updatedRowData="updatedRowData4"
            :exporttoExcel="exportToExcel"
            :documentTitle="'MST04_024INS'"
            :documentSubTitle="documentSubTitle"
            :inputOnlyNumberColumn2="['dblQuantity']"
            :labelingColumns="'strClassType'"
            :valuesData="[['01', '02', '03']]"
            :labelsData="[['자재', '제품', '제조']]"
            :rowStateeditable="false"
            :editableColId="['dblQuantity']">
          </Realgrid>
        </div>
        <div class="flex mt-2 flex-col">
          <div class="flex">
            <div class="text-base font-semibold">◎메뉴 Detail_Excel Upload</div>
            <div class="text-red-400 font-medium ml-5">
              (Detail 최초 등록시에만 가능)
            </div>
          </div>
          <div class="grid grid-rows-2 grid-cols-[1fr,5fr,2fr] h-20">
            <div
              class="border-l border-t border-black text-center items-center justify-center flex bg-gray-200">
              파일선택(xls)
            </div>
            <div
              class="border-l border-t border-black text-center items-center justify-center flex bg-gray-200">
              <input
                type="text"
                class="border border-black w-[80%] h-[80%] disabled:bg-white"
                v-model="fileNm"
                disabled />
            </div>
            <div
              class="border-l border-t border-black text-center items-center justify-center flex bg-gray-200">
              <button class="whitebutton bg-white" @click="findFile">
                찾기
              </button>
              <input
                type="file"
                hidden
                accept=".xls,.xlsx"
                ref="fileInput"
                @change="handleFileChange" />
            </div>
            <div
              class="border-l border-t border-b border-black text-center items-center justify-center flex bg-gray-200">
              SHEET 선택
            </div>
            <div
              class="border-l border-t border-b border-black text-center items-center justify-center flex bg-gray-200">
              <select
                name=""
                id=""
                class="border border-black w-[80%] h-[80%]"
                @change="changeExcelData">
                <option :value="i.lngCode" v-for="i in SheetList">
                  {{ i.strName }}
                </option>
              </select>
            </div>
            <div
              class="border-l border-t border-b border-black text-center items-center justify-center flex bg-gray-200">
              <button class="whitebutton bg-white" @click="downloadFile">
                샘플 양식다운로드
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    v-if="addRow">
    <!-- 모달 박스 -->
    <div class="bg-white rounded-lg shadow-lg w-[40vw] h-[70vh] p-6">
      <div class="flex justify-between w-full">
        <div><h2 class="text-xl font-semibold mb-4">자재목록</h2></div>
        <div class="flex space-x-5 justify-end">
          <button
            @click="searchButton"
            class="text-gray-500 hover:text-gray-800 whitebutton">
            조회
          </button>
          <button
            @click="applyButton"
            class="text-gray-500 hover:text-gray-800 whitebutton">
            적용
          </button>
          <button
            @click="addRow = false"
            class="text-gray-500 hover:text-gray-800 whitebutton">
            닫기
          </button>
        </div>
      </div>

      <div
        class="grid grid-rows-3 grid-cols-[1fr,2fr] w-[50%] justify-center items-center ml-16 space-x-5">
        <div class="font-semibold text-base ml-12">자재분류</div>
        <div class="flex space-x-2">
          <select
            name=""
            id=""
            class="border border-black w-32"
            v-model="scond1"
            @change="getOptionList">
            <option value="0">전체</option>
            <option value="01">자재분류</option>
            <option value="02">자재그룹</option>
            <option value="03">자재특성</option>
            <option value="04">재고조사주기</option>
          </select>

          <select
            name=""
            id=""
            class="border border-black w-64"
            v-model="scond2">
            <option :value="i.lngDetail" v-for="i in optionList2">
              {{ i.strDetail }}
            </option>
          </select>
        </div>
        <div class="font-semibold text-base mt-2 !ml-12">조회구분</div>
        <div class="flex space-x-2 mt-2">
          <label for="scond"
            ><input
              type="radio"
              id="scond"
              name="scond"
              v-model="scond3"
              value="01" />자재</label
          >
          <label for="scond2"
            ><input
              type="radio"
              id="scond2"
              name="scond"
              v-model="scond3"
              value="02" />제품</label
          >
          <label for="scond3"
            ><input
              type="radio"
              id="scond3"
              name="scond"
              v-model="scond3"
              value="03" />제조</label
          >
        </div>
        <div class="font-semibold text-base mt-2 !ml-12">자재명</div>
        <div class="flex space-x-2 mt-2">
          <input type="text" class="border border-black" v-model="scond4" />
        </div>
      </div>

      <div class="h-[70%] mt-5">
        <Realgrid
          :progname="'MST04_024INS_VUE'"
          :progid="6"
          :setStateBar="false"
          :hideColumnsId="hideColumnsId"
          :rowStateeditable="false"
          @checkedRowData="checkedRowData"
          :labelingColumns="'strClassType'"
          :valuesData="[['01', '02', '03']]"
          :labelsData="[['자재', '제품', '제조']]"
          :rowData="rowData6"></Realgrid>
      </div>
    </div>
    <!-- 모달 내용 -->
  </div>
  <!-- 연동 데이터 영역 -->
</template>

<script setup>
import {
  deleteMenuDetail,
  getMenuList4,
  getMenuMasterList,
  getMenuReceipt,
  getStockItemSearch,
  getStoreForMenuReceipt,
  saveMenuDetails,
  saveNewMenuMaster,
} from "@/api/master";
/**
 * 매장 공통 컴포넌트
 */

/**
 * 	그리드 생성
 */

import Realgrid from "@/components/realgrid.vue";
/**
 *  페이지로그 자동 입력
 *  */

import { formatLocalDate, insertPageLog } from "@/customFunc/customFunc";
/**
 *  경고창 호출 라이브러리
 *  */

import Swal from "sweetalert2";
/*
 * 공통 표준  Function
 */

import { nextTick, onMounted, ref } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";
/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import { getStockDetail } from "@/api/mistock";
import PageName from "@/components/pageName.vue";
import { read, utils } from "xlsx-js-style";
/**
 * 	화면 Load시 실행 스크립트
 */

const optionList = ref([]);
const cond = ref("");
const cond2 = ref("");
const cond3 = ref("0");
const cond4 = ref("");
const cond5 = ref("");
onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  store.state.loading = true;
  try {
    const res = await getStoreForMenuReceipt(
      store.state.userData.lngStoreGroup
    );

    optionList.value = res.data.List;

    const res2 = await getMenuList4(store.state.userData.lngStoreGroup);

    rowData.value = res2.data.List;
    store.state.loading = false;
  } catch (error) {
    console.log(error);
  }
});

const searchButton2 = async () => {
  store.state.loading = true;
  try {
    const res2 = await getMenuList4(store.state.userData.lngStoreGroup);

    rowData.value = res2.data.List;
    store.state.loading = false;
  } catch (error) {
    console.log(error);
  } finally {
    const temp = searchvalue.value;
    searchvalue.value = "";
    setTimeout(() => {
      searchvalue.value = temp;
    }, 100);
  }
};
const rowData = ref([]);
const rowData2 = ref([]);
const rowData3 = ref([]);
const updatedRowData3 = ref([]);
const rowData6 = ref([]);
const groupCd = ref();
const storeCd = ref(0);
const afterSearch = ref(false);
const empCode = ref();
const empName = ref();
const clickStoreCd = ref(0);
const clickStoreNm = ref();
const addNew = ref(true);
const valuesData = ref([]);
const labelsData = ref([]);
/**
 * 추가 버튼 함수
 */

const addRow = ref(false);
const changeNow = ref(false);
const afterSearch3 = ref(false);
const changeValue2 = ref();
const changeColid = ref();
const changeRow = ref();
const gridvalue1 = ref();
const gridvalue2 = ref();
const gridvalue3 = ref();
const gridvalue4 = ref();
const gridvalue5 = ref();
const gridvalue6 = ref();
const gridvalue7 = ref();

/**
 * 수정용 데이터 행 설정
 */

const selectedIndex = (newValue) => {
  changeRow.value = newValue;
};
/**
 *  추가 버튼
 */

const addButton = () => {
  if (afterSearch3.value == false) {
    Swal.fire({
      title: "조회를 먼저 해주세요.",
      confirmButtonText: "확인",
    });
    return;
  }

  addRow.value = !addRow.value;
};
/**
 * 그리드 행 삭제 버튼 함수
 */

const deleteRow = ref(false);
/**
 * 삭제 버튼
 */

const updatedrowdata2 = ref([]);
const updatedRowData = (e) => {
  updatedrowdata2.value = e;
};
const deleteButton = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "조회를 먼저 해주세요.",
      confirmButtonText: "확인",
    });
    return;
  }
  deleteRow.value = !deleteRow.value;
};
const disableCd = ref(false);

const tempgridValue5 = ref();
/**
 * 데이터셋 상세정보 셋팅
 */

const clickedRowData = async (e) => {
  ////console.log(e);
  afterSearch3.value = false;
  cond.value = e[0];
  cond2.value = e[1];

  try {
    const res = await getMenuMasterList(
      store.state.userData.lngStoreGroup,
      0,
      cond.value
    );

    console.log(res);

    rowData2.value = res.data.List;
    if (rowData3.value.length > 0) {
      rowData3.value = [];
    }
  } catch (error) {}
};

const fcond4 = ref("");
const fcond5 = ref("");
const thisFirst = ref(false);
const clickedRowData2 = async (e) => {
  ////console.log(e);

  cond.value = e[0];
  cond2.value = e[1];

  cond4.value =
    e[2].slice(0, 4) + "-" + e[2].slice(4, 6) + "-" + e[2].slice(6, 8);
  cond5.value =
    e[3].slice(0, 4) + "-" + e[3].slice(4, 6) + "-" + e[3].slice(6, 8);

  fcond4.value =
    e[2].slice(0, 4) + "-" + e[2].slice(4, 6) + "-" + e[2].slice(6, 8);
  fcond5.value =
    e[3].slice(0, 4) + "-" + e[3].slice(4, 6) + "-" + e[3].slice(6, 8);
  try {
    const res = await getMenuReceipt(
      store.state.userData.lngStoreGroup,
      0,
      cond.value,
      e[2],
      e[3]
    );

    console.log(res);

    rowData3.value = res.data.List;
    if (rowData3.value.length == 0) {
      thisFirst.value = true;
    } else {
      thisFirst.value = false;
    }
    updatedRowData3.value = res.data.List;
    afterSearch3.value = true;
    newMenu.value = false;
    fileInput.value.value = "";
    fileNm.value = "";
    SheetList.value = [];
    byExcel.value = 0;
  } catch (error) {}
};
/**
 * 페이지 매장 그룹 세팅
 */
const allstaterows = ref([]);
const allStateRows = (e) => {
  allstaterows.value = e.updated;
};

const buttonClicked = async (e) => {
  if (e[7] == "--") {
    rowData3.value = updatedRowData3.value.filter(
      (item) => item.lngItemID !== e[2]
    );
    updatedRowData3.value = rowData3.value;
    return;
  }
  //console.log(e);
  await Swal.fire({
    title: "확인",
    text: "정말로 삭제하시겠습니까?",
    icon: "warning",
    confirmButtonText: "확인",
    cancelButtonText: "취소",
    showCancelButton: true,
  }).then(async (result) => {
    if (result.isConfirmed) {
      const res = await deleteMenuDetail(
        store.state.userData.lngStoreGroup,
        cond.value,
        cond4.value.replaceAll("-", ""),
        cond5.value.replaceAll("-", ""),
        e[2],
        e[0]
      );

      //console.log(res);
    } else {
      return;
    }
  });
  try {
  } catch (error) {
  } finally {
    const res = await getMenuReceipt(
      store.state.userData.lngStoreGroup,
      0,
      cond.value,
      cond4.value.replaceAll("-", ""),
      cond5.value.replaceAll("-", "")
    );

    //console.log(res);

    rowData3.value = res.data.List;
    updatedRowData3.value = res.data.List;
  }
};
/**
 * 페이지 매장 코드 세팅
 */

const updateRow = ref([]);
/**
 * 입력창 수정 데이터 갱신
 */

/**
 * INPUT , SELECT 수정 데이터 갱신
 */

const addrowDefault = ref("");
const storeList = ref([]);
const addrowProp = ref("lngStoreCode,strStoreName");
const store = useStore();
/**
 *  조회 함수
 */

const searchButton = async () => {
  if (scond3.value == "03") {
    hideColumnsId.value = [];
  } else {
    hideColumnsId.value = ["dtmFromDate"];
  }

  try {
    store.state.loading = true;
    const res = await getStockItemSearch(
      store.state.userData.lngStoreGroup,
      scond3.value,
      scond1.value,
      scond2.value,
      scond4.value
    );
    store.state.loading = false;
    console.log(res);

    rowData6.value = res.data.List;
  } catch (error) {}
};
const storeNm = (newValue) => {
  clickStoreNm.value = newValue;
};

/**
 *  저장 버튼 함수
 */

const byExcel = ref(0);
const saveButton = async () => {
  //comsole.log(updateRow.value);
  let filterNew;
  if (byExcel.value == 0) {
    filterNew = updatedRowData3.value.filter(
      (item, index) => item.add == "--" || allstaterows.value.includes(index)
    );
  } else {
    filterNew = updatedRowData3.value;
  }

  if (filterNew.length == 0 && byExcel.value == 0) {
    Swal.fire({
      title: "경고",
      text: "변경사항이 없습니다.",
      icon: "question",
      confirmButtonText: "확인",
    });
    return;
  }
  console.log(filterNew);
  try {
    await Swal.fire({
      title: "확인",
      text: "정말로 저장하시겠습니까?",
      icon: "question",
      confirmButtonText: "확인",
      cancelButtonText: "취소",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const itemids = filterNew.map((item) => item.lngItemID).join("\u200b");
        const dblQuantityS = filterNew
          .map((item) => item.dblQuantity)
          .join("\u200b");
        const strclasstypes = filterNew
          .map((item) => (byExcel.value == 0 ? item.lngClass : "00"))
          .join("\u200b");

        const lngunitids = filterNew
          .map((item) => (item.lngUnitID == undefined ? "0" : item.lngUnitID))
          .join("\u200b");

        const seqids = filterNew
          .map((item) =>
            item.lngProductionSeqID == undefined ? "0" : item.lngProductionSeqID
          )
          .join("\u200b");

        let classtypenms;
        if (byExcel.value == 0) {
          classtypenms = filterNew.map((item) => item.lngClass).join("\u200b");
        } else {
          classtypenms = filterNew
            .map((item) => item.strClassType)
            .join("\u200b");
        }

        const res = await saveMenuDetails(
          store.state.userData.lngStoreGroup,
          0,
          cond.value,
          cond4.value.replaceAll("-", ""),
          cond5.value.replaceAll("-", ""),
          itemids,
          dblQuantityS,
          strclasstypes,
          lngunitids,
          seqids,
          classtypenms,
          "U",
          byExcel.value
        );

        console.log(res);

        if (res.data.RESULT_CD == "00") {
          Swal.fire({
            title: "성공",
            text: "저장하였습니다.",
            icon: "success",
            confirmButtonText: "확인",
          });
        } else {
          Swal.fire({
            title: "실패",
            text: "저장에 실패하였습니다.",
            icon: "error",
            confirmButtonText: "확인",
          });
        }
      } else {
        return;
      }
    });
  } catch (error) {
  } finally {
    const res = await getMenuReceipt(
      store.state.userData.lngStoreGroup,
      0,
      cond.value,
      cond4.value.replaceAll("-", ""),
      cond5.value.replaceAll("-", "")
    );

    //console.log(res);

    rowData3.value = res.data.List;
    updatedRowData3.value = res.data.List;
  }
};

const optionList2 = ref([]);

const scond1 = ref(0);
const scond2 = ref(0);
const scond3 = ref("01");
const scond4 = ref("");
const getOptionList = async (e) => {
  if (e.target.value == 0) {
    scond4.value = 0;
  }

  try {
    const res = await getStockDetail(
      store.state.userData.lngStoreGroup,
      e.target.value
    );

    //console.log(res);

    optionList2.value = res.data.List;

    if (optionList2.value.length > 0) {
      scond4.value = optionList2.value[optionList2.value.length - 1].lngDetail;
    } else {
      scond4.value = 0;
    }
  } catch (error) {}
};

const hideColumnsId = ref(["dtmFromDate"]);

const checkedrowdata = ref([]);
const checkedRowData = (e) => {
  checkedrowdata.value = e;
  //console.log(e);
  //console.log(rowData3.value);
};

const applyButton = () => {
  if (checkedrowdata.value.length == 0) {
    addRow.value = false;
    return;
  }

  // console.log(rowData3.value);
  checkedrowdata.value = checkedrowdata.value.filter(
    (item) =>
      !rowData3.value.some((item2) => item.lngStockID == item2.lngStockID)
  );
  checkedrowdata.value = checkedrowdata.value.map((item) => ({
    ...item,
    lngItemID: item.lngStockID,
    add: "--",
    dblQuantity: 0,
    lngClass: item.strClassType,
  }));
  rowData3.value = rowData3.value.concat(checkedrowdata.value);
  updatedRowData3.value = rowData3.value;
  //addRow.value = false;
};

const updatedRowData4 = (e) => {
  //console.log(e);
  updatedRowData3.value = e;
};

const documentSubTitle = ref("");
const exportToExcel = ref(false);
const excelButton = () => {
  documentSubTitle.value =
    "메뉴코드 :" + cond.value + "\n" + "메뉴명 :" + cond2.value;
  exportToExcel.value = !exportToExcel.value;
};

const documentSubTitle2 = ref("");
const exportToExcel2 = ref(false);
const excelButton2 = () => {
  documentSubTitle2.value =
    "메뉴코드 :" + cond.value + "\n" + "메뉴명 :" + cond2.value;
  exportToExcel2.value = !exportToExcel2.value;
};

const newMenu = ref(false);
const addButton2 = () => {
  if (cond.value == "" || cond.value == undefined) {
    Swal.fire({
      title: "경고",
      text: "메뉴를 먼저 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  cond4.value = formatLocalDate(new Date());
  cond5.value = "9999-12-31";
  newMenu.value = true;
};

const saveButton2 = async () => {
  if (newMenu.value == false && afterSearch3.value == false) {
    Swal.fire({
      title: "경고",
      text: "신규버튼을 먼저 클릭해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  } else if (newMenu.value == false && afterSearch3.value == true) {
    try {
      const res = await saveNewMenuMaster(
        store.state.userData.lngStoreGroup,
        0,
        cond.value,
        cond4.value.replaceAll("-", ""),
        cond5.value.replaceAll("-", ""),

        fcond4.value.replaceAll("-", ""),
        fcond5.value.replaceAll("-", ""),
        "U"
      );
      if (res.data.RESULT_CD == "00") {
        Swal.fire({
          title: "성공",
          text: "저장 완료하였습니다.",
          icon: "success",
          confirmButtonText: "확인",
        });
      } else {
        Swal.fire({
          title: "실패",
          text: "저장에 실패하였습니다.",
          icon: "error",
          confirmButtonText: "확인",
        });
      }
    } catch (error) {}
  } else if (newMenu.value == true) {
    const fdate = parseInt(cond4.value.replaceAll("-", ""));
    const edate = parseInt(cond5.value.replaceAll("-", ""));

    const dlength = rowData2.value.filter(
      (item) =>
        !(
          parseInt(item.dtmFromDate) > edate || parseInt(item.dtmToDate) < fdate
        )
    ).length;

    if (dlength > 0) {
      Swal.fire({
        title: "경고",
        text: "중복되는 적용일자가 존재합니다. 확인해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }

    try {
      const res = await saveNewMenuMaster(
        store.state.userData.lngStoreGroup,
        0,
        cond.value,
        fdate,
        edate,
        "",
        "",
        "I"
      );

      if (res.data.RESULT_CD == "00") {
        Swal.fire({
          title: "성공",
          text: "저장 완료하였습니다.",
          icon: "success",
          confirmButtonText: "확인",
        });
      } else {
        Swal.fire({
          title: "실패",
          text: "저장에 실패하였습니다.",
          icon: "error",
          confirmButtonText: "확인",
        });
      }
      //console.log(res);
    } catch (error) {}
  }

  try {
    const res = await getMenuMasterList(
      store.state.userData.lngStoreGroup,
      0,
      cond.value
    );

    //console.log(res);

    rowData2.value = res.data.List;
  } catch (error) {}
};

const changeNow2 = ref(false);
const changeValue1 = ref("");
const changeColid2 = ref("");
const changeValue = (e) => {
  if (afterSearch3.value == false && newMenu.value == false) {
    Swal.fire({
      title: "경고",
      text: "메뉴 Master 을 먼저 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  const name = e.target.name;
  const value = e.target.value.replaceAll("-", "");
  if (newMenu.value == false) {
    changeColid2.value = name;
    changeValue1.value = value;
    changeNow2.value = !changeNow2.value;
  } else {
  }

  //console.log(e);
};

const searchvalue = ref("");
const searchValue = (e) => {
  searchvalue.value = e.target.value;
  if (rowData2.value.length > 0) {
    rowData2.value = [];
  }

  if (rowData3.value.length > 0) {
    rowData3.value = [];
    updatedRowData3.value = [];
  }
  cond.value = "";
  cond2.value = "";
  cond4.value = "";
  cond5.value = "";
  afterSearch3.value = false;
  newMenu.value = false;
};

const downloadFile = () => {
  const link = document.createElement("a");
  link.href = "/RecipeSample.xls"; // public 폴더 또는 정적 자원 경로
  link.download = "레시피업로드.xls";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const fileInput = ref(null);
const findFile = (e) => {
  if (afterSearch3.value == true && thisFirst.value == true) {
    fileInput.value.click();
  } else {
    Swal.fire({
      title: "경고",
      text: "메뉴 Detail 최초 등록시에만 가능합니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
  }
};

const SheetList = ref([]);
const currentSheet = ref(1);
const currentFile = ref();

const fileNm = ref("");
const handleFileChange = async (e) => {
  console.log(e);
  if (e.target.files.length == 0) {
    return;
  }
  const file = e.target.files[0];
  fileNm.value = file.name;
  ////console.log(file);
  currentFile.value = file;
  currentSheet.value = 1;

  if (file) {
    const arrayBuffer = await file.arrayBuffer();
    // XLSX 라이브러리에서 arrayBuffer 사용 가능
    const workbook = read(arrayBuffer, { type: "array" });

    const sheetLength = workbook.SheetNames.length;

    for (let i = 0; i < sheetLength; i++) {
      SheetList.value.push({ lngCode: i + 1, strName: workbook.SheetNames[i] });
    }

    const result = await readFileWithArrayBuffer(file);
    //console.log(result);
  }
  e.target.value = "";
};

async function readFileWithArrayBuffer(file) {
  const arrayBuffer = await file.arrayBuffer();
  // XLSX 라이브러리에서 arrayBuffer 사용 가능
  const workbook = read(arrayBuffer, { type: "array" });

  const sheetName = workbook.SheetNames[currentSheet.value - 1];
  const sheet = workbook.Sheets[sheetName];
  const jsonData = utils.sheet_to_json(sheet, { header: 1 });

  const header = [
    "lngClass",
    "strClassType",
    "lngItemID",
    "strItemName",
    "lngUnitID",
    "strUnitName",
    "dblQuantity",
  ];

  const rows = jsonData.slice(1); // 실제 데이터 행들

  rowData3.value = rows.map((row) => {
    const obj = {};
    header.forEach((key, i) => {
      obj[key] = row[i];
    });
    return obj;
  });

  rowData3.value = rowData3.value.map((item) => ({
    ...item,
    lngClass:
      item.strClassType == "자재"
        ? "01"
        : item.strClassType == "제품"
        ? "02"
        : "03",
  }));
  updatedRowData3.value = rowData3.value;
  byExcel.value = 1;
  //console.log(rowData3.value);
  return jsonData;
}

const getExcelFiles = () => {
  if (currentFile.value == null || currentFile.value == undefined) {
    return;
  }
  readFileWithArrayBuffer(currentFile.value);
};

const changeExcelData = (e) => {
  currentSheet.value = e.target.value;
  getExcelFiles();
};
</script>

<style scoped></style>
