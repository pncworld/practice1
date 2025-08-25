<!-- /*--############################################################################
# Filename : MST45_043INS.vue                                                  
# Description : 마스터관리 > 자재 마스터2 > 자재별 사용 매장 등록.                    
# Date :2025-08-22                                                           
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <!-- 조회조건 -->
  <div class="flex justify-between items-center w-full overflow-y-hidden">
    <PageName></PageName>
    <div class="flex justify-center mr-9 space-x-2 pr-5">
      <button @click="searchButton" class="button search md:w-auto w-14">
        조회
      </button>

      <button @click="saveButton" class="button save w-auto">저장</button>
      <button @click="excelButton" class="button excel w-auto">엑셀</button>
    </div>
  </div>
  <br />
  <div
    class="grid grid-rows-2 grid-cols-1 bg-gray-200 rounded-lg h-24 items-center">
    <PickStore
      @update:storeCd="handleStoreCd"
      @update:storeType="handleStoreType"
      @update:storeGroup="handleStoreGroup"
      @storeNm="handlestoreNm"
      :defaultStoreNm="'전체'"
      class="!justify-start"
      :defaultStore="true"></PickStore>

    <div class="flex items-center justify-start ml-12 space-x-20">
      <div class="text-base font-semibold flex space-x-5">
        <div class="text-base font-semibold">자재그룹</div>
        <div>
          <input
            type="text"
            disabled
            class="disabled:bg-white border border-black"
            v-model="cond" />
        </div>
      </div>

      <div class="text-base font-semibold flex space-x-5">
        <div class="text-base font-semibold">자재분류</div>
        <div>
          <input
            type="text"
            disabled
            class="disabled:bg-white border border-black"
            v-model="cond2" />
        </div>
      </div>

      <div class="text-base font-semibold flex space-x-5">
        <div class="text-base font-semibold">자재특성</div>
        <div>
          <input
            type="text"
            disabled
            class="disabled:bg-white border border-black"
            v-model="cond3" />
        </div>
      </div>

      <div class="text-base font-semibold flex space-x-5">
        <div class="text-base font-semibold">자재코드/명</div>
        <div class="flex items-center space-x-3">
          <input
            type="text"
            disabled
            class="disabled:bg-white border border-black w-24"
            v-model="cond4" />

          <input
            type="text"
            disabled
            class="disabled:bg-white border border-black"
            v-model="cond5" />

          <button class="whitebutton bg-white" @click="searchStock">
            조회
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- 조회조건 -->
  <!-- 그리드 영역 -->
  <div class="flex justify-center w-[97%] h-[60vh] gap-5 ml-5">
    <Realgrid
      class="w-full h-full mt-2"
      :progname="'MST45_043INS_VUE'"
      :progid="1"
      :rowData="rowData"
      @updatedRowData="updatedRowData"
      @clickedRowData="clickedRowData"
      @allStateRows="allStateRows"
      :exporttoExcel="exporttoExcel"
      :documentTitle="'MST45_043INS'"
      :documentSubTitle="documentSubTitle"
      :rowStateeditable="false"
      :checkRenderEditable="true"
      :selectionStyle="'block'">
    </Realgrid>
  </div>
  <!-- 그리드 영역 -->

  <div
    v-if="openPopUp"
    class="fixed inset-0 bg-black/50 flex items-center justify-center">
    <div class="bg-white p-6 rounded-xl shadow-lg w-[50vw] h-[50vh]">
      <h2 class="text-lg font-bold mb-4">자재 검색</h2>
      <div class="mb-4 flex space-x-5 items-center">
        <div class="font-semibold">자재코드</div>
        <div>
          <input type="text" class="border border-black" v-model="scond" />
        </div>
        <div class="font-semibold">자재명</div>
        <div>
          <input type="text" class="border border-black" v-model="scond2" />
        </div>
        <div class="flex justify-end space-x-3">
          <button
            class="px-4 py-2 rounded-lg whitebutton"
            @click="searchButton2">
            조회
          </button>
          <button
            class="px-4 py-2 rounded-lg whitebutton"
            @click="openPopUp = false">
            닫기
          </button>
        </div>
      </div>
      <div class="h-[80%]">
        <Realgrid
          :progname="'MST45_043INS_VUE'"
          :progid="2"
          :setStateBar="false"
          @dblclickedRowData="dblclickedRowData"
          :rowData="rowData2"></Realgrid>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  getStockItemList2,
  getStockStoreList,
  saveStockCycle2,
  saveStockStore,
} from "@/api/master";
import { getStockDetail } from "@/api/mistock";
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

import { onMounted, ref, resolveDirective } from "vue";
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
  let groupcds = [
    "1640",
    "1737",
    "1751",
    "1777",
    "1871",
    "1894",
    "3100",
    "1782",
    "1814",
    "1954",
    "1260",
    "3183",
  ];

  if (groupcds.includes(store.state.userData.lngStoreGroup)) {
    disabled.value = false;

    const res = await getStockDetail(store.state.userData.lngStoreGroup, "01");

    optionList.value = res.data.List;
  } else {
    disabled.value = true;
  }
  //   if (store.state.userData.lngCommonMenu == "1") {
  //     hidesub.value = false;
  //     hideAttr.value = false;
  //   } else {
  //     hidesub.value = true;
  //     hideAttr.value = true;
  //   }
});
const optionList = ref([]);
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
const afterSearch = ref(false);
const clickedStoreNm = ref();
const addrowDefault = ref();
const commitAll = ref(false);
const store = useStore();
const userData = store.state.userData;
const currentsubNo = ref();

/**
 * 페이지 매장 코드 세팅
 */

const handleStoreCd = async (newValue) => {
  //   if (newValue == "0" && store.state.userData.lngCommonMenu == "0") {
  //     afterSearch.value = false;
  //   }
  nowStoreCd.value = newValue;
  //searchButton();
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

/**
 * 조회 초기화
 */

const allstaterows = ref([]);
const confirmData2 = ref();
const rowData = ref([]);
const rowData2 = ref([]);

const allStateRows = (e) => {
  console.log(e);
  allstaterows.value = e.updated;
};
/**
 *  조회 함수
 */

const searchButton = async () => {
  if (cond4.value == "" || cond4.value == undefined) {
    Swal.fire({
      title: "경고",
      text: "자재코드를 먼저 선택해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }

  try {
    store.state.loading = true;
    const res = await getStockStoreList(
      groupCd.value,
      storeType.value,
      nowStoreCd.value,
      cond4.value
    );
    store.state.loading = false;
    rowData.value = res.data.List;
  } catch (error) {}
};
const addbutton = ref(false);
/**
 * 추가 버튼 함수
 */

const addbutton2 = ref(false);
/**
 * 추가 버튼 함수
 */

const storeType = ref("");
const handleStoreType = (e) => {
  storeType.value = e;
};

const groupCd = ref("");
const handleStoreGroup = (e) => {
  groupCd.value = e;
};
/**
 * 데이터셋 상세정보 셋팅
 */

const clickFirst = ref(false);
const clickedRowData = (newValue) => {};
/**
 * 데이터셋 상세정보 셋팅
 */

/**
 * 입력창 수정 데이터 갱신
 */

const updatedrowdata = ref([]);
/**
 * 입력창 수정 데이터 갱신
 */
const disabled = ref(false);
const updatedRowData = (newValue) => {
  console.log(newValue);
  updatedrowdata.value = newValue;
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

/**
 *  저장 버튼 함수
 */

const saveButton = async () => {
  if (allstaterows.value.length == 0) {
    Swal.fire({
      title: "경고",
      text: "변경된 사항이 없습니다.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }
  try {
    await Swal.fire({
      title: "확인",
      text: "저장하시겠습니까?",
      icon: "question", // 'success', 'error', 'warning', 'info', 'question'
      showCancelButton: true, // 취소 버튼 표시
      confirmButtonText: "확인",
      cancelButtonText: "취소",
    }).then(async (result) => {
      if (result.isConfirmed) {
        store.state.loading = true;
        const storecds = updatedrowdata.value
          .filter((_, index) => allstaterows.value.includes(index))
          .map((item) => item.lngStoreCode)
          .join("\u200b");
        const takecycles = updatedrowdata.value
          .filter((_, index) => allstaterows.value.includes(index))
          .map((item) => (item.lngTakeCycle == true ? 1 : 0))
          .join("\u200b");

        const blnmanages = updatedrowdata.value
          .filter((_, index) => allstaterows.value.includes(index))
          .map((item) => (item.blnManage == true ? 1 : 0))
          .join("\u200b");

        const res = await saveStockStore(
          store.state.userData.lngStoreGroup,
          storecds,
          cond4.value,
          takecycles,
          blnmanages,
          store.state.userData.lngSequence
        );
        store.state.loading = false;
        console.log(res);

        if (res.data.RESULT_CD == "00") {
          Swal.fire({
            title: "성공",
            text: "저장에 성공하였습니다.",
            icon: "success", // 'success', 'error', 'warning', 'info', 'question'

            confirmButtonText: "확인",
          });
        } else {
          Swal.fire({
            title: "실패",
            text: "저장에 실패하였습니다.",
            icon: "error", // 'success', 'error', 'warning', 'info', 'question'

            confirmButtonText: "확인",
          });
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // 취소 눌렀을 때 실행할 코드
        //console.log("취소 버튼 클릭됨");
      }
    });
  } catch (error) {
  } finally {
    searchButton();
  }
};
const exporttoExcel = ref(false);
/**
 * 엑셀 내보내기 함수
 */
const documentSubTitle = ref("");
const excelButton = () => {
  //   const name =
  //     optionList.value.filter((item) => item.lngDetail == cond.value)[0]
  //       ?.strName || "전체";
  documentSubTitle.value =
    "매장명 :" +
    clickedStoreNm.value +
    "\n" +
    "자재코드 : " +
    cond4.value +
    "\n" +
    "자재명 :" +
    cond5.value;

  exporttoExcel.value = !exporttoExcel.value;
};

const scond = ref("");
const scond2 = ref("");
const openPopUp = ref(false);
const searchStock = () => {
  openPopUp.value = true;
};

const searchButton2 = async () => {
  //console.log("안와?");
  try {
    store.state.loading = true;
    const res = await getStockItemList2(
      store.state.userData.lngStoreGroup,
      scond.value,
      scond2.value
    );

    store.state.loading = false;
    rowData2.value = res.data.List;
  } catch (error) {}
};

const cond = ref("");
const cond2 = ref("");
const cond3 = ref("");
const cond4 = ref("");
const cond5 = ref("");
const dblclickedRowData = (e) => {
  // console.log(e);
  cond.value = e[2];
  cond2.value = e[3];
  cond3.value = e[4];
  cond4.value = e[0];
  cond5.value = e[1];
  openPopUp.value = false;
};
</script>

<style></style>
