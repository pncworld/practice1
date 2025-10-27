/*--############################################################################
# Filename : MST37_071INS.vue                                                  
# Description : 마스터관리 > 메뉴 마스터 > 메뉴 재고 등록                       
# Date :2025-05-26                                                             
# Author : 권맑음                     
################################################################################*/
<template>
  <!-- 조회조건 -->

  <div class="">
    <div class="flex justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>

      <div class="flex justify-center mr-9 space-x-2 pr-5">
        <!-- 
        <button @click="saveButton" class="button save md:w-auto w-14">
          여기서부터 
          저장
        </button> -->
      </div>
    </div>

    <div class="h-full w-full grid grid-rows-1 grid-cols-2">
      <div>
        <div
          class="flex w-[35vw] h-10 ml-10 justify-center items-center border border-black space-x-5">
          <div
            class="bg-gray-200 text-xl font-semibold w-[40%] h-full justify-center items-center text-center pt-1">
            메뉴명 검색
          </div>
          <div class="w-[40%] h-full mr-20">
            <input
              type="text"
              class="border shadow-lg rounded-lg w-[120%] h-full pl-1"
              v-model="searchWord3" />
          </div>
          <div class="w-[20%] pl-9">
            <button
              @click="searchButton"
              class="button search md:w-auto w-14 !h-8">
              조회
            </button>
          </div>
        </div>

        <!-- 조회조건 -->
        <!-- 그리드 영역 -->
        <div class="h-[50vh] w-[81%] ml-10">
          <Realgrid
            :progname="'MST37_071INS_VUE'"
            :progid="1"
            :rowData="rowData"
            :reload="reload"
            :rowStateeditable="false"
            :changeRow="changeRow"
            :changeColid="changeColid"
            :changeNow="changeNow"
            :changeValue2="changeValue"
            @updatedRowData="updatedRowData"
            @selectedIndex="selectedIndex"
            @clickedRowData="clickedRowData">
          </Realgrid>
        </div>
      </div>
      <div>
        <div
          class="grid grid-rows-7 grid-cols-[1fr,3fr] h-[30vw] w-[60vh] border border-black">
          <div
            class="flex justify-center items-center text-xl bg-slate-200 border-b border-b-black">
            매장명
          </div>
          <div class="flex justify-center items-center border-b border-b-black">
            <select
              name=""
              id=""
              class="w-[80%] h-[60%] border border-black"
              v-model="selectedStore">
              <option :value="i.lngStoreCode" v-for="i in rowData2">
                {{ i.strName }}
              </option>
            </select>
          </div>
          <div
            class="flex justify-center items-center text-xl bg-slate-200 border-b border-b-black">
            메뉴코드
          </div>
          <div class="border-b border-b-black flex items-center justify-center">
            <input
              type="text"
              class="w-[80%] h-[60%] border border-black"
              v-model="gridvalue1"
              disabled />
          </div>
          <div
            class="flex justify-center items-center text-xl bg-slate-200 border-b border-b-black">
            메뉴명
          </div>
          <div class="border-b border-b-black flex items-center justify-center">
            <input
              type="text"
              class="w-[80%] h-[60%] border border-black"
              v-model="gridvalue2"
              disabled />
          </div>
          <div></div>
          <div class="flex justify-end items-center border-b border-b-black">
            <button class="button save" @click="saveButton">저장</button>
          </div>
          <div
            class="flex justify-center items-center text-xl bg-slate-200 border-b border-b-black">
            판매수량
          </div>
          <div class="border-b border-b-black flex items-center justify-center">
            <input
              type="number"
              class="w-[80%] h-[60%] border border-black"
              v-model="gridvalue3"
              disabled />
          </div>
          <div
            class="flex justify-center items-center text-xl bg-orange-100 border-b border-b-black">
            <span class="text-red-500 text-2xl">*</span>금일재고 수량
          </div>
          <div
            class="border-b border-b-black flex items-center justify-start pl-12">
            <input
              type="number"
              class="w-[50%] h-[60%] border border-black pl-1"
              @input="setQty1"
              v-model="gridvalue4" />
            <div class="flex ml-10 space-x-10">
              <button class="border w-10 h-10 bg-red-400" @click="minusButton">
                －
              </button>
              <button class="border w-10 h-10 bg-blue-400" @click="plusButton">
                ＋
              </button>
            </div>
          </div>
          <div class="flex justify-center items-center text-xl bg-orange-100">
            <span class="text-red-500 text-2xl">*</span>자동갱신 수량
          </div>
          <div class="flex items-center justify-start pl-12">
            <input
              type="number"
              class="w-[50%] h-[60%] border border-black pl-1"
              @input="setQty2"
              v-model="gridvalue5" />
            <div class="flex ml-10 space-x-10">
              <button class="border w-10 h-10 bg-red-400" @click="minusButton2">
                －
              </button>
              <button class="border w-10 h-10 bg-blue-400" @click="plusButton2">
                ＋
              </button>
            </div>
          </div>
        </div>
        <div class="flex flex-col justify-start items-start">
          <div class="text-red-400">
            ◎'자동갱신 수량'에 입력된 수로 매일 자동 초기화 됩니다.(오전 04시
            초기화)
          </div>
          <div class="text-red-400">
            ◎금일재고 수량이 선점 · 판매 수량보다 작으면 등록할 수 없습니다.
          </div>
          <div class="text-red-400">◎가급적 개점 전 등록을 권장 드립니다.</div>
        </div>
      </div>
    </div>
  </div>

  <!-- 그리드 영역 -->
</template>

<script setup>
import { getStoreList } from "@/api/common";
import { getMenuStock, saveMenuStock } from "@/api/master";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
/**
 * 	매장 단일 선택 컴포넌트
 */
/**
 * 	그리드 생성
 */

import Realgrid from "@/components/realgrid.vue";
/**
 *  페이지로그 자동 입력
 *  */

import { insertPageLog } from "@/customFunc/customFunc";
import Swal from "sweetalert2";
/**
 *  경고창 호출 라이브러리
 *  */

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

const rowData3 = ref([]);
const MenuGroupList = ref([]);
const cond10 = ref(false);

const clicked = ref(false);
const gridvalue1 = ref("");
const gridvalue2 = ref("");
const gridvalue3 = ref("");
const gridvalue4 = ref("");
const gridvalue5 = ref("");

const changeRow = ref();
const selectedIndex = (e) => {
  changeRow.value = e;
};

const changeColid = ref("lngStkQty");
const changeNow = ref(false);
const changeValue = ref("");
const clickedRowData = (e) => {
  ////console.log(e);
  clicked.value = true;
  gridvalue1.value = e[0];
  gridvalue2.value = e[1];
  gridvalue3.value = e[2];
  gridvalue4.value = e[3];
  gridvalue5.value = e[4];
};

const updatedRowData = (e) => {
  updateRowData.value = e;
  // ////console.log(e);
};
onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const userGroup = store.state.storeGroup[0].lngStoreGroup;
  // const res = await getMenuStoreList(userGroup);
  // GroupList.value = res.data.List;
  // reload.value = !reload.value;

  const res2 = await getStoreList(userGroup, 0);
  ////console.log(res2);

  rowData2.value = res2.data.store.sort((a, b) =>
    a.strName.localeCompare(b.strName)
  );

  selectedStore.value = store.state.userData.lngPosition;
  const res = await getMenuStock(
    userGroup,
    selectedStore.value,
    searchWord3.value
  );

  rowData.value = res.data.List;
});

const cond8 = ref("");
const searchWord3 = ref("");
const cond9 = ref(false);
const cond12 = ref("");
const cond11 = ref("");

const excludeCheck = ref(true);
watch(cond9, () => {
  searchSpecialCond.value = !cond9.value;
});

const selectedType = ref(0);

watch(selectedType, () => {
  if (selectedType.value == 0) {
    excludeCheck.value = true;
  } else {
    excludeCheck.value = false;
  }
});
const disableStore = ref(false);
const reload = ref(false);
const rowData = ref([]);
const rowData2 = ref([]);
const afterSearch = ref(false);
const GroupList = ref([]);
const cond = ref(false);
const cond2 = ref("");
const cond3 = ref("0");
const cond4 = ref("0");
const cond5 = ref("0");
const cond6 = ref("");
const cond7 = ref("");
const store = useStore();
const MultiSubList = ref([]);
const selectedSubGroup = ref(0);
const MultiGroupList = ref([]);
const selectedMultiGroup = ref(0);

const searchSpecialCond = ref(false);

const updateRowData = ref([]);

const getRowChanged = ref(false);
const updatedRows = ref([]);

/**
 * 매출 일자 안 라디오박스 닫기 위한 외부 클릭 감지 함수
 */

watch(cond3, () => {
  if (cond3.value == "0") {
    disableStore.value = false;
  } else {
    disableStore.value = true;
  }
  //disableStore.value = cond3.value;
});

const openPopUp = ref(false);

const minusButton = (e) => {
  if (clicked.value == false) {
    return;
  }

  changeColid.value = "lngStkQty";
  changeValue.value = Number(gridvalue4.value) - 1;
  changeNow.value = !changeNow.value;
};

const minusButton2 = (e) => {
  if (clicked.value == false) {
    return;
  }

  changeColid.value = "lngBaseQty";
  changeValue.value = Number(gridvalue5.value) - 1;
  changeNow.value = !changeNow.value;
};
const plusButton = (e) => {
  if (clicked.value == false) {
    return;
  }

  changeColid.value = "lngStkQty";
  changeValue.value = Number(gridvalue4.value) + 1;
  changeNow.value = !changeNow.value;
};

const plusButton2 = (e) => {
  if (clicked.value == false) {
    return;
  }

  changeColid.value = "lngBaseQty";
  changeValue.value = Number(gridvalue5.value) + 1;
  changeNow.value = !changeNow.value;
};
/**
 *  조회 함수
 */

const searchButton = async () => {
  //   if (selectedStore.value == 0) {
  //     Swal.fire({
  //       title: "경고",
  //       text: "매장명을 먼저 선택하세요.",
  //       icon: "warning",
  //       confirmButtonText: "확인",
  //     });
  //     return;
  //   }
  try {
    store.state.loading = true;
    // initGrid();
    reload.value = !reload.value;
    const res = await getMenuStock(
      store.state.userData.lngStoreGroup,
      selectedStore.value,
      searchWord3.value
    );
    ////console.log(res);
    rowData.value = res.data.List;
    updateRowData.value = JSON.parse(JSON.stringify(res.data.List));
    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    //comsole.log(error);
  } finally {
    store.state.loading = false;
  }
};

const saveButton = async (e) => {
  try {
    store.state.loading = true;
    // initGrid();
    // reload.value = !reload.value;
    const uni1 = updateRowData.value.map((item) => item.lngCode);
    const uni2 = updateRowData.value.map((item) => item.lngStkQty);
    const uni3 = updateRowData.value.map((item) => item.lngBaseQty);

    let contain = [];
    for (let i = 0; i < uni1.length; i++) {
      if (i == uni1.length - 1) {
        let str = uni1[i] + "+" + uni2[i] + "+" + uni3[i] + "|";
        contain.push(str);
      } else {
        let str = uni1[i] + "+" + uni2[i] + "+" + uni3[i];
        contain.push(str);
      }
    }
    const res = await saveMenuStock(
      store.state.userData.lngStoreGroup,
      selectedStore.value,
      contain.join("|")
    );
    ////console.log(res);
    store.state.loading = false;

    await Swal.fire({
      title: "성공",
      text: "저장하였습니다.",
      icon: "success",
      confirmButtonText: "확인",
    });
  } catch (error) {
    ////console.log(error);
  } finally {
    store.state.loading = false;
    searchButton();
  }
};

/* 매장 컴포넌트 관련 함수 */
const selectedGroup = ref();
const selectedStores = ref();
const selectedStore = ref(0);
const selectedStoreAttrs = ref();

/**
 * 페이지 매장 코드 세팅
 */

const lngStoreCode = async (e) => {
  initGrid();
  selectedStores.value = e;
  ////console.log(e);
};
const lngStoreGroup = async (e) => {
  //initGrid();
  selectedGroup.value = e;
  ////console.log(e);
};

/**
 * 그리드 초기화
 */

const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
  cond.value = "";
};

watch([selectedSubGroup, selectedMultiGroup, selectedStore], () => {
  initGrid();
});

//엑셀 버튼 처리 함수
const exportExcel = ref(false);
/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  let storeNm;
  if (selectedStore.value == 0) {
    storeNm = "선택";
  } else {
    storeNm = GroupList.value.filter(
      (item) => item.lngStoreCode == selectedStore.value
    )[0].strStoreName;
  }

  let storeGroup;
  if (selectedStore.value == 0) {
    storeGroup = "전체";
  } else {
    storeGroup = MultiGroupList.value.filter(
      (item) => item.lngCode == selectedMultiGroup.value
    )[0].strName;
  }

  let menuSubGroup;
  if (selectedStore.value == 0) {
    menuSubGroup = "전체";
  } else {
    menuSubGroup = MultiSubList.value.filter(
      (item) => item.lngCode == selectedSubGroup.value
    )[0].strName;
  }

  documentSubTitle.value =
    "매장명 : " +
    storeNm +
    "\n" +
    "멀티단가그룹 : " +
    storeGroup +
    "\n" +
    "메뉴서브그룹 : " +
    menuSubGroup;

  //documentSubTitle.value += "\n";
  exportExcel.value = !exportExcel.value;
};

// 엑셀 추출
const documentSubTitle = ref("");
const selectedExcelList = ref("");
const selectedExcelDate = ref("");

const selectedExcelStore = ref("");
/**
 * 엑셀용 매장 세팅 함수
 */

const excelStore = (e) => {
  selectedExcelStore.value = "매장명 : " + e;
  //comsole.log(e);
};
const excelDate = (e) => {
  selectedExcelDate.value = e;
  //comsole.log(e);
};

const setQty1 = (e) => {
  if (changeRow.value == null || changeRow.value == undefined) {
    return;
  }
  gridvalue4.value = e.target.value.replace(/[^0-9]/g, "");

  changeColid.value = "lngStkQty";
  changeValue.value = gridvalue4.value;
  changeNow.value = !changeNow.value;
};
const setQty2 = (e) => {
  if (changeRow.value == null || changeRow.value == undefined) {
    return;
  }
  gridvalue5.value = e.target.value.replace(/[^0-9]/g, "");

  changeColid.value = "lngBaseQty";

  changeValue.value = gridvalue5.value;
  changeNow.value = !changeNow.value;
};
</script>
