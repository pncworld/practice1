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
          class="border border-black h-[80%]"
          v-model="gridValue3" />
        ~
        <input
          type="date"
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
            v-model="gridValue10" />발송</label
        >
        <label for="nsending"
          ><input
            type="radio"
            name="send"
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
          <option value=""></option>
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
          class="border border-black w-[60%]"
          v-model="gridValue13"></textarea>
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
        <Realgrid :progname="'CRM10_001INS_VUE'" :progid="3"></Realgrid>
        <button class="button search">조회</button>
      </div>
      <div
        class="w-full bg-gray-100 flex justify-center items-center border-l border-t border-black">
        증정메뉴
      </div>
      <div class="flex space-x-5 pl-2 border-l border-t border-black">
        <Realgrid :progname="'CRM10_001INS_VUE'" :progid="2"></Realgrid>
        <button class="button search">조회</button>
      </div>
      <div
        class="w-full bg-gray-100 flex justify-center items-center border-l border-t border-black">
        1+1 필수메뉴
      </div>
      <div class="flex space-x-5 pl-2 border-l border-t border-black">
        <Realgrid :progname="'CRM10_001INS_VUE'" :progid="2"></Realgrid>
        <button class="button search">조회</button>
      </div>
      <div
        class="w-full bg-gray-100 flex justify-center items-center border-l border-t border-black">
        1+1 증정메뉴
      </div>
      <div class="flex space-x-5 pl-2 border-l border-t border-black">
        <Realgrid :progname="'CRM10_001INS_VUE'" :progid="2"></Realgrid>
        <button class="button search">조회</button>
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
import {
  getCouponGroup,
  getEventCouponDetail,
  getEventCouponEnrollList,
  getEventCouponList,
  getPromotionList,
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
/**
 *  경고창 호출 라이브러리
 *  */

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

  const res = await getCommonList(220);
  optionList.value = res.data.List;

  const res2 = await getCouponGroup(store.state.userData.lngStoreGroup);

  optionList2.value = res2.data.List;
  //print()
});
const optionList = ref([]);
const optionList2 = ref([]);
const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

const rowData2 = ref([]);
const rowData3 = ref([]);
const rowData4 = ref([]);
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
const gridValue10 = ref("");
const gridValue11 = ref("");
const gridValue12 = ref("");
const gridValue13 = ref("");
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
  try {
    store.state.loading = true;
    initGrid();

    const res = await getEventCouponEnrollList(
      store.state.userData.lngStoreGroup
    );

    rowData.value = res.data.List;
    console.log(res);
    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    //comsole.log(error);
  } finally {
    store.state.loading = false;
  }
};

/**
 * 페이지 매장 코드 세팅
 */

/**
 * 그리드 초기화
 */

const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
};

//엑셀 버튼 처리 함수

/**
 * 엑셀 내보내기 함수
 */

// 엑셀 추출

/**
 * 엑셀용 매장 세팅 함수
 */

const buttonClicked = async (e) => {
  console.log(e);

  try {
    const res = await getEventCouponDetail(
      store.state.userData.lngStoreGroup,
      e[0],
      0
    );
    gridValue.value = res.data.List[0].strCouponName;
    gridValue2.value = res.data.List[0].lngApplyType;
    gridValue5.value = res.data.List[0].lngTerm;
    gridValue6.value = res.data.List[0].strDuplicateYN;
    gridValue4.value = res.data.List[0].dtmEdate.split(" ")[0];
    gridValue3.value = res.data.List[0].dtmSDate.split(" ")[0];
    gridValue7.value = res.data.List[0].lngCouponGroup;
    gridValue9.value = res.data.List[0].lngCouponNoType;
    console.log(res.data);
  } catch (error) {}
};
</script>
