<!-- /*--############################################################################
# Filename : MST56_001INS.vue                                                  
# Description : 마스터관리 > 품절관리 > 품절정보등록.             #
#Date :2025-07-21                                                              #
#Author : 권맑음                     
################################################################################*/ -->
<template>
  <div class="h-full" @click="handleParentClick">
    <div class="flex justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <!-- <div class="flex justify-center mr-9 space-x-2 pr-5">
        <button @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <button @click="excelButton" class="button save w-auto excel">
          엑셀
        </button>
      </div> -->
    </div>

    <div class="grid grid-rows-1 grid-cols-[1fr,1.5fr] w-full h-[70%] gap-2">
      <div>
        <div class="flex justify-between text-lg font-medium">
          <div>◎코너 영업정보 설정</div>
          <div class="space-x-2 flex items-center">
            <button class="whitebutton button primary" @click="searchButton">
              새로고침
            </button>
            <button class="whitebutton button save">저장</button>
          </div>
        </div>
        <Realgrid
          :progname="'MST56_001INS_VUE'"
          :progid="1"
          :rowData="rowData"
          :reload="reload"
          @clickedRowData="clickedRowData"
          :mergeColumns2="true"
          :mergeColumnGroupSubList2="[
            ['lngOpenHour', 'lngOpenMin'],
            ['lngCloseHour', 'lngCloseMin'],
          ]"
          :mergeColumnGroupName2="['영업시작 시간', '영업종료 시간']"
          :labelingColumns="'lngStkType,lngOpenHour,lngOpenMin,lngCloseHour,lngCloseMin'"
          :valuesData="[
            ['1', '2', '3'],
            [
              '0',
              '1',
              '2',
              '3',
              '4',
              '5',
              '6',
              '7',
              '8',
              '9',
              '10',
              '11',
              '12',
              '13',
              '14',
              '15',
              '16',
              '17',
              '18',
              '19',
              '20',
              '21',
              '22',
              '23',
            ],
            ['0', '10', '20', '30', '40', '50'],
            [
              '0',
              '1',
              '2',
              '3',
              '4',
              '5',
              '6',
              '7',
              '8',
              '9',
              '10',
              '11',
              '12',
              '13',
              '14',
              '15',
              '16',
              '17',
              '18',
              '19',
              '20',
              '21',
              '22',
              '23',
            ],
            ['0', '10', '20', '30', '40', '50'],
          ]"
          :labelsData="[
            ['영업중', '영업 준비중', '영업시간 선택'],
            [
              '0',
              '1',
              '2',
              '3',
              '4',
              '5',
              '6',
              '7',
              '8',
              '9',
              '10',
              '11',
              '12',
              '13',
              '14',
              '15',
              '16',
              '17',
              '18',
              '19',
              '20',
              '21',
              '22',
              '23',
            ],
            ['0', '10', '20', '30', '40', '50'],
            [
              '0',
              '1',
              '2',
              '3',
              '4',
              '5',
              '6',
              '7',
              '8',
              '9',
              '10',
              '11',
              '12',
              '13',
              '14',
              '15',
              '16',
              '17',
              '18',
              '19',
              '20',
              '21',
              '22',
              '23',
            ],
            ['0', '10', '20', '30', '40', '50'],
          ]"
          :rowStateeditable="false"
          :editableColId="'lngStkType,lngOpenHour,lngOpenMin,lngCloseHour,lngCloseMin'"
          :exporttoExcel="exportExcel">
        </Realgrid>
      </div>

      <div class="h-[95%]">
        <div class="flex justify-between text-lg font-medium">
          <div>◎메뉴 품절처리</div>
          <div class="space-x-2 flex items-center">
            <button class="whitebutton button search" @click="searchButton2">
              조회
            </button>
            <button class="whitebutton button save">저장</button>
          </div>
        </div>
        <div class="flex justify-start bg-gray-300 rounded-lg h-8 items-center">
          <div class="flex">
            <div>메뉴명</div>
            <input
              type="text"
              class="border border-black ml-2"
              v-model="cond" />
          </div>

          <div class="flex items-center ml-5">
            <div>판매상태</div>
            <select
              name=""
              id=""
              class="border border-black ml-2"
              v-model="cond2"
              @change="searchButton2">
              <option value="9">전체</option>
              <option value="0">판매중</option>
              <option value="1">당일품절</option>
              <option value="2">계속품절</option>
            </select>
          </div>

          <div class="text-red-500 flex justify-end font-bold ml-[40%]">
            {{ clickedCornerNm }}
          </div>
        </div>
        <Realgrid
          :progname="'MST56_001INS_VUE'"
          :progid="2"
          :rowData="rowData2"
          :reload="reload"
          :labelingColumns="'lngStkStsType'"
          :valuesData="[['0', '1', '2']]"
          @buttonClicked="buttonClicked"
          :labelsData="[['판매중', '당일품절', '계속품절']]"
          :rowStateeditable="false"
          :exporttoExcel="exportExcel">
        </Realgrid>
      </div>
    </div>
  </div>

  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    v-if="visible">
    <div class="bg-white p-6 rounded-xl shadow-lg w-[30vw] h-[60vh]">
      <div class="flex justify-between">
        <h2 class="text-xl font-bold mb-4">선택메뉴 품절처리</h2>
        <div class="col-span-2 flex justify-end space-x-5">
          <button class="whitebutton" @click="searchButton3">조회</button>
          <button class="whitebutton" @click="saveButton2">저장</button>
          <button class="whitebutton" @click="closePopUp2">닫기</button>
        </div>
      </div>
      <div class="grid grid-rows-3 grid-cols-1 h-[20%]">
        <div class="text-lg font-bold">{{ clickedCornerNm }}</div>
        <div class="text-lg font-bold text-red-500">{{ clickedMenuNm }}</div>
        <div class="flex items-center space-x-2">
          <div class="text-lg">메뉴명</div>
          <div><input type="text" class="border" v-model="pcond" /></div>

          <div class="text-lg">판매상태</div>
          <div>
            <select name="" id="" class="border" v-model="pcond2">
              <option value="9">전체</option>
              <option value="0">판매중</option>
              <option value="1">당일품절</option>
              <option value="2">계속품절</option>
            </select>
          </div>
        </div>
      </div>
      <div class="h-[60%] w-full">
        <Realgrid
          :progname="'MST56_001INS_POP_VUE'"
          :progid="1"
          :setStateBar="false"
          :labelingColumns="'lngStkStsType'"
          @updatedRowData="updatedRowData3"
          :valuesData="[['0', '1', '2']]"
          :labelsData="[['판매중', '당일품절', '계속품절']]"
          :rowData="rowData3"></Realgrid>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  getMenuConList,
  getSalesInfoByCorner,
  getSoldMenuList,
  saveMenuInfo,
} from "@/api/master";
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

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
});

const reload = ref(false);
const rowData = ref([]);
const rowData2 = ref([]);
const rowData3 = ref([]);
const afterSearch = ref(false);

/**
 * 선택한 매출 시작일자
 */

const cond = ref("");
const cond2 = ref("9");

const pcond = ref("");
const pcond2 = ref("9");
const store = useStore();

const datepicker = ref(null);
const closePopUp = ref(false);
/**
 * 매출 일자 안 라디오박스 닫기 위한 외부 클릭 감지 함수
 */

const handleParentClick = (e) => {
  const datepickerEl = datepicker.value?.$el;
  if (datepickerEl && datepickerEl.contains(e.target)) {
    return;
  }
  closePopUp.value = !closePopUp.value;
};

/**
 *  조회 함수
 */

const searchButton = async () => {
  store.state.loading = true;
  try {
    initGrid();
    //  console.log(store.state.userData);
    const res = await getSalesInfoByCorner(
      store.state.userData.lngStoreGroup,
      store.state.userData.lngPositionType,
      store.state.userData.lngPosition,
      0
    );
    console.log(res);
    rowData.value = res.data.List;

    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    //comsole.log(error);
  } finally {
    store.state.loading = false;
  }
};

const clickedCornerCd = ref(0);
const clickedCornerNm = ref("코너명 클릭");
const clickedMenuNm = ref("");
const clickedRowData = async (e) => {
  clickedCornerCd.value = e[0];
  clickedCornerNm.value = e[1];
  try {
    const res = await getSoldMenuList(
      store.state.userData.lngStoreGroup,
      store.state.userData.lngPosition,
      e[0],
      cond.value,
      cond2.value
    );

    console.log(res);

    rowData2.value = res.data.List;
  } catch (error) {}
};

const searchButton2 = async () => {
  if (clickedCornerCd.value == null || clickedCornerCd.value == undefined) {
    Swal.fire({
      title: "경고",
      text: "코너를 먼저 선택하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  try {
    const res = await getSoldMenuList(
      store.state.userData.lngStoreGroup,
      store.state.userData.lngPosition,
      clickedCornerCd.value,
      cond.value,
      cond2.value
    );

    //console.log(res);

    rowData2.value = res.data.List;
  } catch (error) {}
};

const visible = ref(false);
const clickedMenuCd = ref("");
const buttonClicked = async (e) => {
  console.log(e);
  clickedMenuNm.value = e[2];
  clickedMenuCd.value = e[1];
  visible.value = true;

  try {
    const res = await getMenuConList(
      store.state.userData.lngStoreGroup,
      store.state.userData.lngPosition,
      clickedCornerCd.value,
      clickedMenuCd.value,
      pcond.value,
      pcond2.value
    );

    rowData3.value = res.data.List;
  } catch (error) {}
};

const closePopUp2 = () => {
  clickedCornerCd.value = 0;
  clickedCornerNm.value = "";
  clickedMenuNm.value = "";
  visible.value = false;
};

const updatedrowdata3 = ref([]);
const updatedRowData3 = (e) => {
  updatedrowdata3.value = e;
};
const saveButton2 = async () => {
  try {
    const menucds = updatedrowdata3.value
      .map((item) => item.lngMenuCode)
      .join("\u200b");
    const stss = updatedrowdata3.value
      .map((item) => item.lngStkStsType)
      .join("\u200b");
    const res = await saveMenuInfo(
      store.state.userData.lngStoreGroup,
      store.state.userData.lngPosition,
      menucds,
      stss,
      store.state.userData.lngSequence
    );
    console.log(res);
  } catch (error) {}
};

const searchButton3 = async () => {
  try {
    store.state.loading = true;
    const res = await getMenuConList(
      store.state.userData.lngStoreGroup,
      store.state.userData.lngPosition,
      clickedCornerCd.value,
      clickedMenuCd.value,
      pcond.value,
      pcond2.value
    );

    rowData3.value = res.data.List;
    store.state.loading = false;
  } catch (error) {
  } finally {
    store.state.loading = false;
  }
};
const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
};

//엑셀 버튼 처리 함수
const exportExcel = ref(false);
/**
 * 엑셀 내보내기 함수
 */

// 엑셀 추출
</script>
