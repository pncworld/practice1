<!-- /*--############################################################################
# Filename : CRM22_001INS.vue                                                  
# Description : 고객관리 > 프로모션 관리 > 이벤트 쿠폰 등록                    
# Date :2025-07-04                                                             
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <!-- 조회조건 -->
  <div class="h-full" @click="handleParentClick">
    <div class="flex justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center mr-9 space-x-2 pr-5">
        <button @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <button @click="addButton" class="button new md:w-auto w-14">
          신규
        </button>
        <button @click="saveButton" class="button save w-auto">저장</button>
      </div>
    </div>
    <div class="h-[20vh] w-full">
      <Realgrid
        :progname="'CRM22_001INS_VUE'"
        :progid="1"
        :rowData="rowData"
        :addRow4="addRow"
        :addrowDefault="addrowDefault"
        :addrowProp="addrowProp"
        @buttonClicked="buttonClicked"
        :rowStateeditable="false">
      </Realgrid>
    </div>
    <div
      class="w-full h-6 bg-indigo-400 flex justify-center items-center text-white">
      쿠폰 정보 등록
    </div>
    <div class="grid grid-cols-[2.5fr,5fr,2.5fr,5fr] grid-rows-4 h-[15vh]">
      <div
        class="border-l border-t border-black flex justify-center items-center bg-gray-100">
        쿠폰명
      </div>
      <div
        class="flex justify-start pl-2 items-center border-l border-t border-black">
        <input
          type="text"
          class="border border-black w-[50%]"
          v-model="gridValue" />
      </div>
      <div
        class="border-l border-t border-black flex justify-center items-center bg-gray-100">
        사용기간구분
      </div>
      <div
        class="border-l border-t border-black flex justify-start items-center pl-2 space-x-4">
        <label for="cond"
          ><input
            type="radio"
            id="cond"
            v-model="gridValue2"
            value="1" />유효기간</label
        >
        <label for="cond2"
          ><input
            type="radio"
            id="cond2"
            v-model="gridValue2"
            value="2" />기간설정</label
        >
      </div>
      <div
        class="border-l border-t border-black flex justify-center items-center bg-gray-100">
        유효기간
      </div>
      <div
        class="border-l border-t border-black flex space-x-2 pl-2 items-center">
        <input
          type="date"
          :disabled="!disabled"
          class="border border-black h-[80%]"
          v-model="gridValue3" />
        ~
        <input
          type="date"
          :disabled="!disabled"
          class="border border-black h-[80%]"
          v-model="gridValue4" />
      </div>
      <div
        class="border-l border-t border-black flex justify-center items-center bg-gray-100">
        기간설정
      </div>
      <div class="border-l border-t border-black flex items-center">
        <div class="font-semibold">발급후</div>
        <div class="font-semibold">
          <input
            type="number"
            :disabled="disabled"
            class="border border-black w-[30%]"
            v-model="gridValue5" />Day
        </div>
      </div>
      <div
        class="border-l border-t border-black flex justify-center items-center bg-gray-100">
        중복사용
      </div>
      <div
        class="border-l border-t border-black flex items-center justify-start pl-2">
        <label for="imp"
          ><input
            type="radio"
            name="dupli"
            id="imp"
            value="N"
            v-model="gridValue6" />불가능</label
        >
        <label for="p"
          ><input
            type="radio"
            name="dupli"
            id="p"
            value="Y"
            v-model="gridValue6" />가능</label
        >
      </div>
      <div
        class="border-l border-t border-black flex justify-center items-center bg-gray-100">
        쿠폰분류
      </div>
      <div
        class="border-l border-t border-black flex items-center justify-start pl-2">
        <select name="" id="" class="border border-black" v-model="gridValue7">
          <option :value="i.lngCode" v-for="i in optionList2">
            {{ i.strName }}
          </option>
        </select>
      </div>
      <div
        class="border-l border-t border-black flex justify-center items-center bg-gray-100">
        쿠폰유형
      </div>
      <div
        class="border-l border-t border-b border-black flex items-center justify-start pl-2">
        <select name="" id="" class="border border-black" v-model="gridValue8">
          <option :value="i.strDCode" v-for="i in optionList">
            {{ i.strDName }}
          </option>
        </select>
      </div>
      <div
        class="border-l border-t border-black flex justify-center items-center bg-gray-100">
        쿠폰번호 생성
      </div>
      <div
        class="border-l border-t border-black flex items-center justify-start pl-2 space-x-3">
        <label for="auto"
          ><input
            type="radio"
            name="create"
            id="auto"
            value="1"
            v-model="gridValue9" />자동생성</label
        >
        <label for="manual"
          ><input
            type="radio"
            name="create"
            value="2"
            id="manual"
            v-model="gridValue9" />수동업로드</label
        >
      </div>
    </div>
    <div
      class="w-full h-6 bg-indigo-400 flex justify-center items-center text-white">
      LMS 전송 정보 등록
    </div>
    <div
      class="grid grid-cols-[2.5fr,5fr,2.5fr,5fr] grid-rows-[1fr,5fr] h-[20vh]">
      <div
        class="bg-gray-100 flex justify-center items-center border-l border-t border-black">
        LMS 발송
      </div>
      <div
        class="border-l border-t border-black flex items-center justify-start pl-2 space-x-3">
        <label for="sending"
          ><input
            type="radio"
            name="send"
            id="sending"
            value="Y"
            v-model="gridValue10" />발송</label
        >
        <label for="nsending"
          ><input
            type="radio"
            name="send"
            value="N"
            id="nsending"
            v-model="gridValue10" />발송 안함</label
        >
      </div>
      <div
        class="bg-gray-100 flex justify-center items-center border-l border-t border-black">
        LMS 발송번호
      </div>
      <div
        class="flex border-l border-t border-black space-x-5 pl-2 items-center">
        <select
          name=""
          id=""
          class="border border-black w-[30%] h-[80%]"
          v-model="gridValue11">
          <option :value="i.strSenderNumber" v-for="i in optionList3">
            {{ i.strSenderNumber }}
          </option>
        </select>
      </div>

      <div
        class="bg-gray-100 flex justify-center items-center border-l border-t border-b border-black h-10">
        LMS 제목
      </div>
      <div
        class="flex border-l border-t space-x-5 border-b border-black h-10 items-center pl-2">
        <input
          type="text"
          class="border border-black w-[60%] h-[80%] pl-1"
          :disabled="disabled2"
          v-model="gridValue12" />
      </div>

      <div
        class="bg-gray-100 flex justify-center items-center border-l border-t border-black">
        LMS 메세지
      </div>
      <div class="flex border-l border-t border-black pl-2">
        <textarea
          name=""
          id=""
          :disabled="disabled2"
          class="border border-black w-[80%]"
          v-model="gridValue13"></textarea>
        <div class="flex flex-col space-y-2">
          <div class="text-blue-500">
            *쿠폰 번호는 등록한 LMS 메세지 아래 부분에 표기 됩니다.
          </div>
          <div class="text-blue-500">
            *쿠폰 번호 자동생성시에 문자 발송은 필수사항입니다.
          </div>
        </div>
      </div>
    </div>
    <div
      class="w-full h-6 bg-indigo-400 flex justify-center items-center text-white">
      쿠폰 혜택 정보
    </div>
    <div class="grid grid-rows-2 grid-cols-[2.5fr,5fr,2.5fr,5fr] h-[30vh]">
      <div
        class="bg-gray-100 flex justify-center items-center border-l border-t border-black">
        쿠폰 혜택매장
      </div>
      <div class="flex space-x-5 pl-2 border-l border-t border-black">
        <Realgrid
          :progname="'CRM10_001INS_VUE'"
          :progid="3"
          :setStateBar="false"
          :rowStateeditable="false"
          :rowData="rowData2"></Realgrid>
        <button class="button search" @click="openPopup">조회</button>
      </div>
      <div
        class="w-full bg-gray-100 flex justify-center items-center border-l border-t border-black">
        증정메뉴
      </div>
      <div class="flex space-x-5 pl-2 border-l border-t border-black">
        <Realgrid
          :progname="'CRM22_001INS_VUE'"
          :progid="2"
          :disabled="disabled3"
          :setStateBar="false"
          :rowStateeditable="false"
          :rowData="rowData3"></Realgrid>
        <button class="button search" @click="openPopup2(1)">조회</button>
      </div>
      <div
        class="w-full bg-gray-100 flex justify-center items-center border-l border-t border-black">
        1+1 필수메뉴
      </div>
      <div class="flex space-x-5 pl-2 border-l border-t border-black">
        <Realgrid
          :progname="'CRM22_001INS_VUE'"
          :progid="2"
          :disabled="!disabled3"
          :setStateBar="false"
          :rowStateeditable="false"
          :rowData="rowData4"></Realgrid>
        <button class="button search" @click="openPopup2(2)">조회</button>
      </div>
      <div
        class="w-full bg-gray-100 flex justify-center items-center border-l border-t border-black">
        1+1 증정메뉴
      </div>
      <div class="flex space-x-5 pl-2 border-l border-t border-black">
        <Realgrid
          :progname="'CRM22_001INS_VUE'"
          :progid="2"
          :disabled="!disabled3"
          :setStateBar="false"
          :rowStateeditable="false"
          :rowData="rowData5"></Realgrid>
        <button class="button search" @click="openPopup2(3)">조회</button>
      </div>
    </div>
  </div>
  <div
    v-if="openpop"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div
      class="bg-white rounded-xl p-6 w-full max-w-[30vw] h-[40vh] shadow-xl relative">
      <div class="grid grid-rows-[1fr,9fr] w-full">
        <div class="grid grid-cols-[1fr,5fr,3fr]">
          <div class="flex items-center">매장명:</div>
          <div class="flex items-center">
            <input type="text" class="border w-full" v-model="searchWord" />
          </div>
          <div class="flex space-x-3 items-center">
            <button class="whitebutton" @click="searchStore">조회</button>
            <button class="whitebutton" @click="setStore">적용</button>
            <button class="whitebutton" @click="openpop = false">닫기</button>
          </div>
        </div>
        <div class="h-[30vh] mt-2">
          <Realgrid
            :progname="'CRM22_001INS_VUE'"
            @updatedRowData="updatedRowData"
            :setStateBar="false"
            :rowStateeditable="false"
            :progid="3"
            :rowData="rowData6"></Realgrid>
        </div>
      </div>
    </div>
  </div>

  <div
    v-if="openpop2"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div
      class="bg-white rounded-xl p-6 w-full max-w-[60vw] h-[70vh] shadow-xl relative">
      <div class="grid grid-rows-[1fr,9fr] w-full">
        <div>{{ currName }}</div>
        <div class="grid grid-rows-[1fr,8fr] h-6 w-full">
          <div class="flex space-x-3 items-center justify-end">
            <button class="whitebutton" @click="setMenu(currentPage)">
              메뉴등록
            </button>
            <button class="whitebutton" @click="openpop2 = false">닫기</button>
          </div>

          <div
            class="grid grid-rows-1 grid-cols-[5fr,1fr,5fr] space-x-1 h-[40vh] w-[99%]">
            <div>
              <div class="font-semibold text-lg">메뉴검색</div>
              <div class="grid grid-rows-3 grid-cols-[1fr,3fr] pl-3">
                <div class="text-base">대그룹</div>
                <div>
                  <select
                    name=""
                    id=""
                    class="border border-black w-[50%]"
                    v-model="selectedGroup">
                    <option value="0">전체</option>
                    <option :value="i.lngCode" v-for="i in MenuGroup">
                      {{ i.strName }}
                    </option>
                  </select>
                </div>
                <div class="text-base">서브그룹</div>
                <div>
                  <select
                    name=""
                    id=""
                    class="border border-black w-[50%]"
                    v-model="selectedSubGroup">
                    <option value="0">전체</option>
                    <option :value="i.lngCode" v-for="i in filteredSubGroup">
                      {{ i.strName }}
                    </option>
                  </select>
                </div>
                <div class="text-base">메뉴명</div>
                <div class="flex space-x-3">
                  <input
                    type="number"
                    class="border border-black w-[20%]"
                    v-model="menuCd" /><input
                    type="text"
                    class="border border-black w-[60%]"
                    v-model="menuNm" />
                  <button class="whitebutton" @click="searchMenu(currentPage)">
                    조회
                  </button>
                </div>
              </div>
              <Realgrid
                :progname="'CRM22_001INS_VUE'"
                @updatedRowData="updatedRowData2"
                :setStateBar="false"
                :rowStateeditable="false"
                :progid="4"
                :rowData="rowData6"></Realgrid>
            </div>
            <div class="flex flex-col items-center justify-center space-y-5">
              <div>
                <button class="whitebutton" @click="moveRight">>></button>
              </div>
              <div><button class="whitebutton"><<</button></div>
            </div>
            <div>
              <div class="font-semibold text-lg">메뉴등록</div>
              <div
                class="grid grid-rows-3 grid-cols-[1fr,3fr] pl-3"
                v-if="currentPage !== 2">
                <div class="text-base">본사유형</div>
                <div class="space-x-5x">
                  <label for="pay1"
                    ><input
                      type="radio"
                      name="paymethod"
                      value="1"
                      v-model="payCond"
                      id="pay1" />금액</label
                  >
                  <label for="pay2"
                    ><input
                      type="radio"
                      value="2"
                      v-model="payCond"
                      name="paymethod"
                      id="pay2" />비율</label
                  >
                </div>
                <div class="text-base">본사분담금</div>
                <div class="flex">
                  <input
                    type="number"
                    class="border border-black"
                    v-model="payCond2" />
                  <button class="whitebutton" @click="setHeaderShare">
                    일괄적용
                  </button>
                </div>
              </div>
              <Realgrid
                :class="currentPage == 2 ? 'mt-20' : 'mt-0'"
                :progname="'CRM22_001INS_VUE'"
                @updatedRowData="updatedRowData3"
                @checkedRowIndex="checkedRowIndex"
                :changeRow="changeRow"
                :changeNow2="changeNow2"
                :changeValue2="changeValue2"
                :changeColid="changeColid"
                :hideColumnsId="hideColumnsId"
                :setStateBar="false"
                :rowStateeditable="false"
                :progid="5"
                :rowData="rowData7"></Realgrid>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <br />
  <br />
  <br />
  <!-- 그리드 영역 -->
</template>

<script setup>
import { getCommonList } from "@/api/common";
import { getMenuGroupList } from "@/api/master";
import {
  getCouponGroup,
  getEventCouponDetail,
  getEventCouponEnrollList,
  getMenuList3,
  getSenderList,
  getStoreSearch,
  saveEventCoupon,
} from "@/api/micrm";
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

import { nextTick, onMounted, ref, watch } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";
/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getCommonList(220);
  optionList.value = res.data.List;

  const res2 = await getCouponGroup(store.state.userData.lngStoreGroup);

  optionList2.value = res2.data.List;
  //print()

  const res3 = await getMenuGroupList(store.state.userData.lngStoreGroup, 0, 1);
  ////console.log(res3.data);
  MenuGroup.value = res3.data.List;
  MenuSubGroup.value = res3.data.List2;

  const res4 = await getSenderList(
    store.state.userData.lngStoreGroup,
    store.state.userData.lngPosition
  );

  optionList3.value = res4.data.List;
});

const filteredNum = ref("");
const optionList = ref([]);
const optionList2 = ref([]);
const optionList3 = ref([]);
const MenuGroup = ref([]);
const MenuSubGroup = ref([]);
const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

const rowData2 = ref([]);
const rowData3 = ref([]);
const rowData4 = ref([]);
const rowData5 = ref([]);
const rowData6 = ref([]);
const rowData7 = ref([]);
const rowData8 = ref([]);
const condValue = ref(0);
const store = useStore();
const gridValue = ref("");
const gridValue2 = ref("1");
const gridValue3 = ref("");
const gridValue4 = ref("");
const gridValue5 = ref("");
const gridValue6 = ref("");
const gridValue7 = ref("");
const gridValue8 = ref("0");
const gridValue9 = ref("");
const gridValue10 = ref("Y");
const gridValue11 = ref("1");
const gridValue12 = ref("");
const gridValue13 = ref("");

const datepicker = ref(null);
const closePopUp = ref(false);
const searchWord = ref("");

const payCond = ref("1");
const payCond2 = ref("");
const menuNm = ref("");
const menuCd = ref("");
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
  try {
    store.state.loading = true;
    initGrid();

    const res = await getEventCouponEnrollList(
      store.state.userData.lngStoreGroup
    );

    rowData.value = res.data.List;
    ////console.log(res);
    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    //comsole.log(error);
  } finally {
    store.state.loading = false;
    addRow.value = false;
  }
};

/**
 * 페이지 매장 코드 세팅
 */

/**
 * 그리드 초기화
 */

// const initGrid = () => {
//   if (rowData.value.length > 0) {
//     rowData.value = [];
//   }
// };

//엑셀 버튼 처리 함수

/**
 * 엑셀 내보내기 함수
 */

// 엑셀 추출

/**
 * 엑셀용 매장 세팅 함수
 */
const disabled = ref(true);
const disabled2 = ref(false);
const disabled3 = ref(false);

const clickButton = ref(false);

const currentCouponCode = ref("");

const addOn = ref(false);
const buttonClicked = async (e) => {
  ////console.log(e);
  if (e[0] == " ") {
    ////console.log(tempCouponInfo.value);
    gridValue.value = tempCouponInfo.value.gridValue;
    gridValue2.value = tempCouponInfo.value.gridValue2;
    gridValue3.value = tempCouponInfo.value.gridValue3;
    gridValue4.value = tempCouponInfo.value.gridValue4;
    gridValue5.value = tempCouponInfo.value.gridValue5;
    gridValue6.value = tempCouponInfo.value.gridValue6;
    gridValue7.value = tempCouponInfo.value.gridValue7;
    gridValue8.value = tempCouponInfo.value.gridValue8;
    gridValue9.value = tempCouponInfo.value.gridValue9;
    gridValue10.value = tempCouponInfo.value.gridValue10;
    gridValue11.value = tempCouponInfo.value.gridValue11;
    gridValue12.value = tempCouponInfo.value.gridValue12;
    gridValue13.value = tempCouponInfo.value.gridValue13;

    addOn.value = true;
  } else {
    try {
      const res = await getEventCouponDetail(
        store.state.userData.lngStoreGroup,
        e[0],
        0
      );
      gridValue.value = res.data.List[0].strCouponName;
      gridValue2.value = res.data.List[0].lngApplyType;
      disabled.value = res.data.List[0].lngApplyType == 1 ? true : false;
      gridValue5.value = res.data.List[0].lngTerm;
      gridValue6.value = res.data.List[0].strDuplicateYN;
      gridValue4.value = res.data.List[0].dtmEdate.split(" ")[0];
      gridValue3.value = res.data.List[0].dtmSDate.split(" ")[0];
      gridValue7.value = res.data.List[0].lngCouponGroup;
      gridValue8.value = res.data.List[0].lngServType;

      gridValue9.value = res.data.List[0].lngCouponNoType;
      gridValue10.value = res.data.List[0].strSMSSendYN;
      gridValue11.value = res.data.List[0].strSMSSender;
      gridValue12.value = res.data.List[0].strSMSTitle;
      gridValue13.value = res.data.List[0].strSMSText;
      currentCouponCode.value = res.data.List[0].lngCouponType;
      rowData2.value = res.data.List2;
      rowData3.value = res.data.List3;
      rowData4.value = res.data.List4;
      rowData5.value = res.data.List5;
      ////console.log(res.data);

      clickButton.value = true;
      addOn.value = false;
    } catch (error) {}
  }
};

watch(gridValue, () => {
  if (addOn.value == true) {
    tempCouponInfo.value.gridValue = gridValue.value;
  }
});
watch(gridValue2, () => {
  if (gridValue2.value == 1) {
    disabled.value = true;
  } else {
    disabled.value = false;
  }

  if (addOn.value == true) {
    tempCouponInfo.value.gridValue2 = gridValue2.value;
  }
});

watch(gridValue3, () => {
  if (addOn.value == true) {
    tempCouponInfo.value.gridValue3 = gridValue3.value;
  }
});

watch(gridValue4, () => {
  if (addOn.value == true) {
    tempCouponInfo.value.gridValue4 = gridValue4.value;
  }
});
watch(gridValue5, () => {
  if (addOn.value == true) {
    tempCouponInfo.value.gridValue5 = gridValue5.value;
  }
});

watch(gridValue6, () => {
  if (addOn.value == true) {
    tempCouponInfo.value.gridValue6 = gridValue6.value;
  }
});

watch(gridValue7, () => {
  if (addOn.value == true) {
    tempCouponInfo.value.gridValue7 = gridValue7.value;
  }
});

watch(gridValue9, () => {
  if (addOn.value == true) {
    tempCouponInfo.value.gridValue9 = gridValue9.value;
  }
});

watch(gridValue11, () => {
  ////console.log(optionList3.value);

  const matchedItem = optionList3.value.find(
    (item) => item.strSenderNumber == gridValue11.value
  );

  filteredNum.value = matchedItem ? matchedItem.strQuiesceNumber : "";
});

watch(gridValue12, () => {
  if (addOn.value == true) {
    tempCouponInfo.value.gridValue12 = gridValue12.value;
  }
});
watch(gridValue13, () => {
  if (addOn.value == true) {
    tempCouponInfo.value.gridValue13 = gridValue13.value;
  }
});

watch(gridValue10, () => {
  if (gridValue10.value == "N") {
    disabled2.value = true;
  } else {
    disabled2.value = false;
  }
});

watch(gridValue8, () => {
  ////console.log(gridValue8.value);
  if (gridValue8.value == "0") {
    disabled3.value = true;
  } else {
    disabled3.value = false;
  }

  if (addOn.value == true) {
    tempCouponInfo.value.gridValue8 = gridValue8.value;
  }
});

const openpop = ref(false);
const openpop2 = ref(false);
const openPopup = (e) => {
  if (clickButton.value == false && addOn.value == false) {
    return;
  }
  rowData6.value = [];
  openpop.value = !openpop.value;
  searchStore();
};

const currentPage = ref(1);
const openPopup2 = (e) => {
  if (clickButton.value == false && addOn.value == false) {
    return;
  }
  rowData6.value = [];
  if (e == 1) {
    currName.value = "증정메뉴";

    rowData7.value = rowData3.value;
  } else if (e == 2) {
    currName.value = "1+1 필수메뉴";
    rowData7.value = rowData4.value;
  } else {
    currName.value = "1+1 증정메뉴";
    rowData7.value = rowData5.value;
  }
  currentPage.value = e;

  if (e == 2) {
    hideColumnsId.value.push("lngHeadShare");
  } else {
    hideColumnsId.value = [];
  }

  rowData8.value = [];
  openpop2.value = !openpop2.value;
  //searchStore();
};

const searchStore = async () => {
  try {
    const res = await getStoreSearch(
      store.state.userData.lngStoreGroup,
      0,
      searchWord.value
    );

    rowData6.value = res.data.List;
    rowData6.value = rowData6.value.map((item) => ({
      ...item,
      checkbox: rowData2.value.some(
        (item2) => item2.lngStoreCode == item.lngStoreCode
      ),
    }));
  } catch (error) {}
};

const setStore = () => {
  ////console.log(storeList.value);
  rowData2.value = storeList.value;

  openpop.value = false;
};
const storeList = ref([]);
const updatedRowData = (e) => {
  ////console.log(e);
  storeList.value = e.filter((item) => item.checkbox == true);
};

const moveRightList = ref([]);
const updatedRowData2 = (e) => {
  ////console.log(e);
  moveRightList.value = e.filter((item) => item.checkbox == true);
};
//const moveRightList = ref([]);
const checkedRightList = ref([]);
const updateRowData7 = ref([]);
const updatedRowData3 = (e) => {
  ////console.log(e);
  updateRowData7.value = e;
  checkedRightList.value = e.filter((item) => item.checkbox == true);
};

const checkedRowIndexArr = ref([]);
const checkedRowIndex = (e) => {
  checkedRowIndexArr.value = e;
};

const currName = ref("증정 메뉴");

const selectedGroup = ref("0");
const selectedSubGroup = ref("0");
const filteredSubGroup = ref([]);

watch(selectedGroup, () => {
  if (selectedGroup.value == 0) {
    filteredSubGroup.value = MenuSubGroup.value;
  } else {
    filteredSubGroup.value = MenuSubGroup.value.filter(
      (item) => item.lngMajor == selectedGroup.value
    );
  }
  selectedSubGroup.value = 0;
});

const searchMenu = async (e) => {
  try {
    const res = await getMenuList3(
      store.state.userData.lngStoreGroup,
      selectedGroup.value,
      selectedSubGroup.value,
      menuCd.value,
      menuNm.value
    );

    rowData6.value = res.data.List;

    if (e == 1) {
      rowData7.value = rowData3.value;
    } else if (e == 2) {
      rowData7.value = rowData4.value;
    }
  } catch (error) {}
};

const moveRight = () => {
  //moveRightList.value = rowData7.value.filter(item => item. )
  // ////console.log(rowData7.value);
  // ////console.log(moveRightList.value);
  const filteredRowData = moveRightList.value
    .filter(
      (item) => !rowData7.value.some((item2) => item2.lngCode === item.lngCode)
    )
    .map((item3) => ({
      ...item3,
      checkbox: false,
      lngHeadShare: undefined,
    }));
  rowData7.value = rowData7.value.concat(filteredRowData);
  updateRowData7.value = rowData7.value;
};

const changeRow = ref("");
const changeColid = ref("lngHeadShare");
const changeValue2 = ref("");
const changeNow2 = ref(false);
const setHeaderShare = async () => {
  ////console.log(checkedRightList.value);
  if (payCond2.value == "") {
    return;
  }

  if (checkedRowIndexArr.value.length == 0) {
    return;
  }
  if (payCond.value == 1) {
    for (let i = 0; i < checkedRowIndexArr.value.length; i++) {
      changeRow.value = checkedRowIndexArr.value[i];
      changeValue2.value = payCond2.value;

      changeNow2.value = !changeNow2.value;
      await nextTick();
    }
  } else {
    ////console.log(checkedRightList.value);
    for (let i = 0; i < checkedRowIndexArr.value.length; i++) {
      changeRow.value = checkedRowIndexArr.value[i];
      changeValue2.value =
        updateRowData7.value.filter(
          (item, index) => index == changeRow.value
        )[0].lngPrice *
        (payCond2.value / 100);

      changeNow2.value = !changeNow2.value;
      await nextTick();
    }
  }
};

const setMenu = (e) => {
  // ////console.log(updateRowData7.value);
  if (e == 1 || e == 3) {
    if (
      updateRowData7.value.filter(
        (item) => item.lngHeadShare == "" || item.lngHeadShare == undefined
      ).length > 0
    ) {
      Swal.fire({
        title: "경고",
        text: "본사분담금을 입력해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }
  }

  if (e == 1) {
    rowData3.value = updateRowData7.value;
    openpop2.value = false;
  } else if (e == 2) {
    rowData4.value = updateRowData7.value;
    openpop2.value = false;
  } else {
    rowData5.value = updateRowData7.value;
    openpop2.value = false;
  }

  ////console.log(updateRowData7.value);
};

const hideColumnsId = ref([]);

const saveButton = async () => {
  if (gridValue9.value == "1" && gridValue10.value == "N") {
    Swal.fire({
      title: "경고",
      text: "쿠폰자동 생성시 문자 전송은 필수입니다.",
      icon: "success",
      confirmButtonText: "확인",
    });
    return;
  }

  if (gridValue10.value == "Y" && !gridValue13.value.includes("(광고)")) {
    Swal.fire({
      title: "경고",
      text: "(광고) 라는 단어가 포함되어야합니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (gridValue10.value == "Y" && !gridValue13.value.includes("무료수신거부")) {
    Swal.fire({
      title: "경고",
      text: "무료수신거부 라는 단어가 포함되어야합니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (gridValue10.value == "Y" && filteredNum.value == "") {
    Swal.fire({
      title: "경고",
      text: "LMS 발송번호를 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  if (
    gridValue10.value == "Y" &&
    !gridValue13.value.includes(filteredNum.value)
  ) {
    Swal.fire({
      title: "경고",
      text: "등록된 무료수신거부 번호가 아닙니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  try {
    store.state.loading = true;
    const res = await saveEventCoupon(
      store.state.userData.lngStoreGroup,
      currentCouponCode.value,
      gridValue.value,
      gridValue2.value,
      gridValue5.value,
      gridValue3.value,
      gridValue4.value,
      gridValue6.value,
      gridValue7.value,
      gridValue8.value,
      gridValue9.value,
      gridValue10.value,
      2,
      gridValue12.value,
      gridValue11.value,
      gridValue13.value,
      "",
      store.state.userData.lngSequence,
      rowData3.value
        .map(
          (item) =>
            store.state.userData.lngStoreGroup +
            "+" +
            item.lngCode +
            "+" +
            item.lngHeadShare
        )
        .join("|"),
      rowData4.value.map((item) => item.lngCode).join("|"),
      rowData5.value.map((item) => item.lngCode).join("|"),
      rowData2.value
        .map(
          (item) => store.state.userData.lngStoreGroup + "+" + item.lngStoreCode
        )
        .join("|"),
      rowData3.value.map((item) => item.lngCode).join(";"),
      rowData5.value.map((item) => item.lngCode).join(";")
    );

    ////console.log(res);
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
  } catch (error) {
  } finally {
    store.state.loading = false;
  }
};

const addRow = ref(false);
const addrowProp = ref(
  "lngCouponType,strCouponName,strCouponType,strApplyType,strFrom,strTo,strSMSSendYN,add"
);
const addrowDefault = ref(" , , , , , ,N,수정");

const addButton = () => {
  if (addRow.value == true) {
    return;
  }
  // addRow.value = !addRow.value;
  addOn.value = true;
  initGrid();
};

const initGrid = () => {
  gridValue.value = "";
  gridValue2.value = "1";
  gridValue3.value = "";
  gridValue4.value = "";
  gridValue5.value = "";
  gridValue6.value = "N";
  gridValue7.value = "1";
  gridValue8.value = "0";
  gridValue9.value = "2";
  gridValue10.value = "N";
  gridValue11.value = "1";
  gridValue12.value = "";
  gridValue13.value = "";

  rowData2.value = [];
  rowData3.value = [];
  rowData4.value = [];
  rowData5.value = [];
  rowData6.value = [];
  rowData7.value = [];
};

const tempCouponInfo = ref({
  gridValue: null,
  gridValue2: 1,
  gridValue3: null,
  gridValue4: null,
  gridValue5: null,
  gridValue6: null,
  gridValue7: null,
  gridValue8: 0,
  gridValue9: null,
  gridValue10: "Y",
  gridValue11: "1",
  gridValue12: null,
  gridValue13: null,
});
</script>
