<!-- /*--############################################################################
# Filename : CRM21_002INS.vue                                                  
# Description : 고객관리 > 프로모션 관리 > 멤버십쿠폰 등록         
# Date :2025-09-16                                                             
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <!-- 조회조건 -->
  <div class="h-[90%]" @click="handleParentClick">
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
        :progname="'CRM21_002INS_VUE'"
        :progid="1"
        :rowData="rowData"
        @buttonClicked="buttonClicked"
        :rowStateeditable="false">
      </Realgrid>
    </div>
    <div
      class="grid grid-rows-[1fr,1fr,1fr,1fr,1fr,1fr,1fr,6fr,6fr,6fr] grid-cols-[2fr,5fr,2fr,5fr]">
      <div
        class="flex justify-center items-center text-base font-semibold border-l border-t border-black bg-gray-100">
        쿠폰코드
      </div>
      <div
        class="flex justify-start pl-5 items-center text-base font-semibold border-l border-t border-black">
        <input
          type="text"
          class="border border-black w-64 disabled:bg-gray-200"
          v-model="cond"
          disabled />
      </div>
      <div
        class="flex justify-center items-center text-base font-semibold border-l border-t border-black bg-gray-100">
        쿠폰명
      </div>
      <div
        class="flex justify-start pl-5 items-center text-base font-semibold border-l border-t border-black">
        <input type="text" class="border border-black w-64" v-model="cond2" />
      </div>
      <div
        class="flex justify-center items-center text-base font-semibold border-l border-t border-black bg-gray-100">
        쿠폰분류
      </div>
      <div
        class="flex justify-start pl-5 items-center text-base font-semibold border-l border-t border-black">
        <select name="" id="" class="border border-black w-64" v-model="cond3">
          <option value="0">선택</option>
          <option :value="i.lngCode" v-for="i in optionList2">
            {{ i.strName }}
          </option>
        </select>
      </div>
      <div
        class="flex justify-center items-center text-base font-semibold border-l border-t border-black bg-gray-100">
        쿠폰유형
      </div>
      <div
        class="flex justify-start pl-5 items-center text-base font-semibold border-l border-t border-black">
        <select
          name=""
          id=""
          class="border border-black w-64"
          v-model="cond4"
          @change="setDisable2">
          <option value="0">선택</option>
          <option :value="i.strDCode" v-for="i in optionList">
            {{ i.strDName }}
          </option>
        </select>
      </div>
      <div
        class="flex justify-center items-center text-base font-semibold border-l border-t border-black bg-gray-100">
        사용기간 구분
      </div>
      <div
        class="flex justify-start pl-5 items-center text-base font-semibold border-l border-t border-black space-x-3">
        <label for="cond5"
          ><input
            type="radio"
            v-model="cond5"
            id="cond5"
            name="cond5"
            value="1"
            @change="changeDisable" />유효기간</label
        >
        <label for="cond51"
          ><input
            type="radio"
            v-model="cond5"
            name="cond5"
            id="cond51"
            value="2"
            @change="changeDisable" />기간설정</label
        >
      </div>
      <div
        class="flex justify-center items-center text-base font-semibold border-l border-t border-black bg-gray-100">
        동일영수증 중복사용
      </div>
      <div
        class="flex justify-start pl-5 items-center text-base font-semibold border-l border-t border-black space-x-3">
        <label for=""
          ><input type="radio" v-model="cond6" value="0" />불가능</label
        >
        <label for=""
          ><input type="radio" v-model="cond6" value="1" />가능</label
        >
      </div>
      <div
        class="flex justify-center items-center text-base font-semibold border-l border-t border-black bg-gray-100">
        기간설정
      </div>
      <div
        class="flex justify-start pl-5 items-center text-base font-semibold border-l border-t border-black">
        쿠폰 발행일로 부터
        <input
          type="text"
          class="border border-black w-20 disabled:bg-gray-200"
          v-model="cond7"
          name="cond7"
          @input="onlyNumber"
          :disabled="disabled1" />
        일 후 까지
      </div>

      <div
        class="flex justify-center items-center text-base font-semibold border-l border-t border-black bg-gray-100">
        유효기간
      </div>
      <div
        class="flex justify-start pl-5 items-center text-base font-semibold border-l border-t border-black">
        <input
          type="date"
          class="border border-black disabled:bg-gray-200"
          v-model="cond8"
          max="9999-12-31"
          :disabled="!disabled1" />
        ~
        <input
          type="date"
          class="border border-black disabled:bg-gray-200"
          v-model="cond9"
          max="9999-12-31"
          :disabled="!disabled1" />
      </div>
      <div
        class="flex justify-center items-center text-base font-semibold border-l border-t border-black bg-gray-100">
        할인유형
      </div>
      <div
        class="flex justify-start pl-5 items-center text-base font-semibold border-l border-t border-black space-x-3">
        <label for=""
          ><input
            type="radio"
            v-model="cond10"
            value="0"
            :disabled="disabled2" />금액</label
        >
        <label for=""
          ><input
            type="radio"
            v-model="cond10"
            value="1"
            :disabled="disabled2" />비율</label
        >
      </div>
      <div
        class="flex justify-center items-center text-base font-semibold border-l border-t border-black bg-gray-100">
        할인금액(비율)
      </div>
      <div
        class="flex justify-start pl-5 items-center text-base font-semibold border-l border-t border-black">
        <input
          type="text"
          class="border border-black w-20 disabled:bg-gray-200"
          v-model="cond11"
          @input="onlyNumber"
          :disabled="disabled2" />
      </div>
      <div
        class="flex justify-center items-center text-base font-semibold border-l border-t border-black bg-gray-100">
        SMS 발송
      </div>
      <div
        class="flex justify-start pl-5 items-center text-base font-semibold border-l border-t border-black space-x-3">
        <label for="cond12"
          ><input
            type="radio"
            v-model="cond12"
            id="cond12"
            name="cond12"
            value="N"
            @change="setDisable3" />발송안함</label
        >
        <label for="cond121"
          ><input
            type="radio"
            name="cond12"
            id="cond121"
            v-model="cond12"
            value="Y"
            @change="setDisable3" />발송</label
        >
      </div>
      <div
        class="flex justify-center items-center text-base font-semibold border-l border-t border-black bg-gray-100">
        SMS 유형
      </div>
      <div
        class="flex justify-start pl-5 items-center text-base font-semibold border-l border-t border-black space-x-3">
        <label for="cond13"
          ><input
            type="radio"
            v-model="cond13"
            id="cond13"
            name="cond13"
            class="disabled:bg-gray-200"
            value="1"
            @change="set42byte2"
            :disabled="disabled5" />SMS</label
        >
        <label for="cond131"
          ><input
            type="radio"
            name="cond13"
            id="cond131"
            v-model="cond13"
            @change="set42byte2"
            class="disabled:bg-gray-200"
            value="2"
            :disabled="disabled5" />LMS</label
        >
      </div>
      <div
        class="flex justify-center items-center text-base font-semibold border-l border-t border-black bg-gray-100">
        SMS 제목
      </div>
      <div
        class="flex justify-start pl-5 items-center text-base font-semibold border-l border-t border-black">
        <input
          type="text"
          class="border border-black w-20 disabled:bg-gray-200"
          v-model="cond14"
          :disabled="disabled5" />
      </div>
      <div
        class="flex justify-center items-center text-base font-semibold border-l border-t border-black bg-gray-100">
        SMS 발송번호
      </div>
      <div
        class="flex justify-start pl-5 items-center text-base font-semibold border-l border-t border-black">
        <select name="" id="" class="border border-black w-64" v-model="cond15">
          <option :value="i.strSenderNumber" v-for="i in optionList3">
            {{ i.strSenderNumber }}
          </option>
        </select>
      </div>
      <div
        class="flex justify-center items-center text-base font-semibold border-l border-t border-black bg-gray-100">
        SMS 문구
      </div>
      <div
        class="flex justify-start pl-5 items-center text-base font-semibold border-l border-t border-black">
        <textarea
          name=""
          id=""
          v-model="cond16"
          :disabled="disabled5"
          @input="set42byte"
          class="border border-black h-[80%] w-[80%] disabled:bg-gray-200"></textarea>
        <span class="text-red-400">({{ currentbyteleng }})byte</span>
      </div>
      <div
        class="flex justify-center items-center text-base font-semibold border-l border-t border-black bg-gray-100">
        증정메뉴
      </div>
      <div
        class="flex justify-start pl-5 items-center text-base font-semibold border-l border-t border-black">
        <div class="flex space-x-2 h-full w-full">
          <div class="w-[70%] h-full">
            <Realgrid
              :progid="2"
              :progname="'CRM10_001INS_VUE'"
              :rowData="rowData3"></Realgrid>
          </div>
          <div>
            <button
              class="button search"
              :disabled="disabled3"
              @click="searchButton3(1)">
              조회
            </button>
          </div>
        </div>
      </div>
      <div
        class="flex justify-center items-center text-base font-semibold border-l border-t border-black bg-gray-100">
        1+1 필수메뉴
      </div>
      <div
        class="flex justify-start pl-5 items-center text-base font-semibold border-l border-t border-black">
        <div class="flex flex-col h-full w-full">
          <div class="flex space-x-2 h-full w-full">
            <div class="w-[70%] h-full">
              <Realgrid
                :progid="2"
                :progname="'CRM10_001INS_VUE'"
                :rowData="rowData2"></Realgrid>
            </div>
            <div>
              <button
                class="button search"
                :disabled="disabled4"
                @click="searchButton2">
                조회
              </button>
            </div>
          </div>
          <div class="flex space-x-5">
            <div>할인 및 적립</div>
            <label for=""
              ><input type="radio" value="N" v-model="cond17" />미적용</label
            >
            <label for=""
              ><input type="radio" value="Y" v-model="cond17" />적용</label
            >
          </div>
        </div>
      </div>
      <div
        class="flex justify-center items-center text-base font-semibold border-l border-t border-b border-black bg-gray-100">
        1+1 증정메뉴
      </div>
      <div
        class="flex justify-start pl-5 items-center text-base font-semibold border-l border-t border-b border-black">
        <div class="flex space-x-2 h-full w-full">
          <div class="w-[70%] h-full">
            <Realgrid
              :progid="2"
              :progname="'CRM10_001INS_VUE'"
              :rowData="rowData4"></Realgrid>
          </div>
          <div>
            <button
              class="button search"
              :disabled="disabled4"
              @click="searchButton3(2)">
              조회
            </button>
          </div>
        </div>
      </div>
      <div
        class="flex justify-center items-center text-base font-semibold border-l border-t border-black bg-gray-100">
        유의사항 등록
      </div>
      <div
        class="flex justify-start pl-5 items-center text-base font-semibold border-l border-t border-b border-r border-black">
        <div class="grid grid-rows-6 grid-cols-1 w-full">
          <div>
            <input
              type="text"
              class="border border-black w-[60%]"
              v-model="cond18" />
          </div>
          <div>
            <input
              type="text"
              class="border border-black w-[60%]"
              v-model="cond19" />
          </div>
          <div>
            <input
              type="text"
              class="border border-black w-[60%]"
              v-model="cond20" />
          </div>
          <div>
            <input
              type="text"
              class="border border-black w-[60%]"
              v-model="cond21" />
          </div>
          <div>
            <input
              type="text"
              class="border border-black w-[60%]"
              v-model="cond22" />
          </div>
          <div>
            <input
              type="text"
              class="border border-black w-[60%]"
              v-model="cond23" />
          </div>
        </div>
      </div>
    </div>
  </div>
  <br />

  <div
    v-if="openPopUp2"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <!-- 팝업 컨텐츠 -->
    <div class="bg-white p-6 rounded-2xl shadow-lg w-[60vw] h-[70vh]">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-bold mb-4">메뉴 선택</h2>

        <div class="flex space-x-3">
          <!-- <button
            class="px-4 py-2 bg-blue-500 text-white rounded"
            @click="searchButton2">
            조회
          </button> -->
          <button
            class="px-4 py-2 bg-blue-500 text-white rounded"
            @click="saveButton2">
            저장
          </button>
          <button
            class="px-4 py-2 bg-blue-500 text-white rounded"
            @click="openPopUp2 = false">
            닫기
          </button>
        </div>
      </div>
      <div class="flex flex-col space-y-3">
        <div class="flex space-x-5 items-center ml-3">
          <div class="text-base font-bold">대그룹</div>
          <select
            name=""
            id=""
            class="w-64 border border-black h-8"
            @change="setSubGroup"
            v-model="scond">
            <option value="-1">전체</option>
            <option :value="i.lngCode" v-for="i in optionList4">
              {{ i.strName }}
            </option>
          </select>
        </div>
        <div class="flex space-x-5 items-center">
          <div class="text-base font-bold">서브그룹</div>
          <select
            name=""
            id=""
            class="w-64 border border-black h-8"
            @change="setMenu"
            v-model="scond2">
            <option value="-1">전체</option>
            <option :value="i.lngCode" v-for="i in filteredoptionList2">
              {{ i.strName }}
            </option>
          </select>
        </div>

        <div class="flex space-x-5 items-center ml-3">
          <div class="text-base font-bold">메뉴명</div>
          <input
            type="text"
            class="w-64 border border-black h-8"
            @input="setScond3"
            v-model="scond3" />
        </div>
      </div>
      <div class="h-full mt-2">
        <div class="flex h-[75%] space-x-3">
          <Realgrid
            :progname="'CRM10_001INS_VUE'"
            :progid="5"
            :rowData="srowData"
            :searchColId="'strName'"
            :searchWord3="scond3"
            :searchColId3="['lngMajor', 'lngSubGroup']"
            :searchValue="searchValue"
            :rowStateeditable="false"
            :checkRenderEditable="true"
            :checkRowAuto="false"
            :checkRowAuto2="true"
            :checkRowAuto2Col="'checkbox'"
            @updatedRowData="updatedRowData3"
            :setStateBar="false"></Realgrid>

          <div class="flex space-y-5 flex-col justify-center items-center">
            <button class="whitebutton" @click="sendRight">=></button>
            <button class="whitebutton" @click="sendLeft"><=</button>
          </div>
          <Realgrid
            :progname="'CRM10_001INS_VUE'"
            :progid="5"
            :rowData="srowData2"
            :searchColId="'strName'"
            :searchWord3="searchword"
            :rowStateeditable="false"
            :checkRenderEditable="true"
            :checkRowAuto="false"
            :checkRowAuto2="true"
            :checkRowAuto2Col="'checkbox'"
            @updatedRowData="updatedRowData4"
            :setStateBar="false"></Realgrid>
        </div>
      </div>
    </div>
  </div>

  <div
    v-if="openPopUp3"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <!-- 팝업 컨텐츠 -->
    <div class="bg-white p-6 rounded-2xl shadow-lg w-[60vw] h-[70vh]">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-bold mb-4">메뉴 선택</h2>

        <div class="flex space-x-3">
          <!-- <button
            class="px-4 py-2 bg-blue-500 text-white rounded"
            @click="searchButton2">
            조회
          </button> -->
          <button
            class="px-4 py-2 bg-blue-500 text-white rounded"
            @click="saveButton4">
            저장
          </button>
          <button
            class="px-4 py-2 bg-blue-500 text-white rounded"
            @click="openPopUp3 = false">
            닫기
          </button>
        </div>
      </div>
      <div class="flex flex-col space-y-3">
        <div class="flex space-x-5 items-center ml-3">
          <div class="text-base font-bold">대그룹</div>
          <select
            name=""
            id=""
            class="w-64 border border-black h-8"
            @change="setSubGroup"
            v-model="scond">
            <option value="-1">전체</option>
            <option :value="i.lngCode" v-for="i in optionList4">
              {{ i.strName }}
            </option>
          </select>
        </div>
        <div class="flex space-x-5 items-center">
          <div class="text-base font-bold">서브그룹</div>
          <select
            name=""
            id=""
            class="w-64 border border-black h-8"
            @change="setMenu"
            v-model="scond2">
            <option value="-1">전체</option>
            <option :value="i.lngCode" v-for="i in filteredoptionList2">
              {{ i.strName }}
            </option>
          </select>
        </div>

        <div class="flex space-x-5 items-center ml-3">
          <div class="text-base font-bold">메뉴명</div>
          <input
            type="text"
            class="w-64 border border-black h-8"
            @input="setScond3"
            v-model="scond3" />
        </div>
      </div>
      <div class="h-full mt-2">
        <div class="flex h-[75%] space-x-3">
          <Realgrid
            :progname="'CRM10_001INS_VUE'"
            :progid="5"
            :rowData="srowData3"
            :searchColId="'strName'"
            :searchWord3="scond3"
            :searchColId3="['lngMajor', 'lngSubGroup']"
            :searchValue="searchValue"
            :rowStateeditable="false"
            :checkRenderEditable="true"
            :checkRowAuto="false"
            :checkRowAuto2="true"
            :checkRowAuto2Col="'checkbox'"
            @updatedRowData="updatedRowData5"
            :setStateBar="false"></Realgrid>

          <div class="flex space-y-5 flex-col justify-center items-center">
            <button class="whitebutton" @click="sendRight2">=></button>
            <button class="whitebutton" @click="sendLeft2"><=</button>
          </div>

          <div class="flex flex-col h-[115%] w-[107%] -mt-20 space-y-5">
            <div
              class="grid grid-rows-2 grid-cols-[1fr,3fr] border border-black">
              <div
                class="bg-gray-100 flex justify-center items-center border-r border-b border-black">
                본사유형
              </div>
              <div class="flex space-x-3 items-center border-b border-black">
                <label for="scond4"
                  ><input
                    type="radio"
                    value="0"
                    v-model="scond4"
                    name="scond4"
                    id="scond4" />금액</label
                >
                <label for="scond5"
                  ><input
                    type="radio"
                    value="1"
                    v-model="scond4"
                    name="scond4"
                    id="scond5" />비율</label
                >
              </div>
              <div
                class="bg-gray-100 flex justify-center items-center border-r border-black">
                본사분담금
              </div>
              <div>
                <input
                  type="text"
                  name="scond5"
                  class="border border-black"
                  @input="onlyNumber"
                  v-model="scond5" />
                <button class="whitebutton" @click="setHeadShare">
                  일괄적용
                </button>
              </div>
            </div>

            <Realgrid
              :progname="'CRM21_004INS_VUE'"
              :progid="2"
              :rowData="srowData4"
              :searchColId="'strName'"
              :changeValue2="changeValue2"
              :changeColid="'lngHeadShare'"
              :changeRow="changeRow"
              :changeNow="changeNow"
              :editableColId="'lngHeadShare'"
              :inputOnlyNumberColumn="'lngHeadShare'"
              :searchWord3="searchword"
              :rowStateeditable="false"
              :checkRenderEditable="true"
              :checkRowAuto="false"
              :checkRowAuto2="true"
              :checkRowAuto2Col="'checkbox'"
              @updatedRowData="updatedRowData6"
              :setStateBar="false"></Realgrid>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import { getCommonList } from "@/api/common";
import { getMenuGroupList } from "@/api/master";
import {
  getCouponGroup,
  getCrmMenuList,
  getMemberShipCouponDetail,
  getMemberShipList,
  getOperateStoreList,
  getPromotionList,
  getSenderList,
  saveMemberPromotion,
  saveMemberShipCoupon,
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

import { formatLocalDate, insertPageLog } from "@/customFunc/customFunc";
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

  const res = await getCommonList(145);

  optionList.value = res.data.List;

  const res2 = await getCouponGroup(store.state.userData.lngStoreGroup);

  optionList2.value = res2.data.List;

  const res3 = await getSenderList(
    store.state.userData.lngStoreGroup,
    store.state.userData.lngPosition
  );

  optionList3.value = res3.data.List;

  const res4 = await getMenuGroupList(store.state.userData.lngStoreGroup, 0, 1);

  console.log(res);
  optionList4.value = res4.data.List;
  optionList5.value = res4.data.List2;

  // console.log(res3);

  // const res = await getMenuGroupList(store.state.userData.lngStoreGroup, 0, 1);

  // console.log(res);
  // optionList.value = res.data.List;
  // optionList2.value = res.data.List2;

  // const res2 = await getCouponList(store.state.userData.lngStoreGroup);

  // optionList3.value = res2.data.List;

  // const today = new Date();
  // cond3.value = formatLocalDate(today);
  // cond4.value = formatLocalDate(today);
});

const optionList = ref([]);
const optionList2 = ref([]);
const optionList3 = ref([]);
const optionList4 = ref([]);
const optionList5 = ref([]);
const filteredoptionList2 = ref([]);
const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

const rowData2 = ref([]);
const rowData3 = ref([]);
const rowData4 = ref([]);
const rowData5 = ref([]);
const rowData6 = ref([]);
const rowData7 = ref([]);
const condValue = ref(0);
const store = useStore();

const cond = ref("");
const cond2 = ref("");
const cond3 = ref("0");
const cond4 = ref("0");
const cond5 = ref("1");
const cond6 = ref("1");
const cond7 = ref("");
const cond8 = ref("");
const cond9 = ref("");
const cond10 = ref("1");
const cond11 = ref("");
const cond12 = ref("N");
const cond13 = ref("1");
const cond14 = ref("");
const cond15 = ref("");
const cond16 = ref("");
const cond17 = ref("N");
const cond18 = ref("");
const cond19 = ref("");
const cond20 = ref("");
const cond21 = ref("");
const cond22 = ref("");
const cond23 = ref("");
const cond24 = ref("");

const cond25 = ref("");
const cond26 = ref("");
const cond27 = ref("");
const cond28 = ref("");
const cond111 = ref("");
const cond171 = ref("");
const datepicker = ref(null);
const closePopUp = ref(false);

const changeCond = (e) => {
  cond.value = !cond.value;
};
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
const hideColumnsId = ref([]);
const searchButton = async () => {
  try {
    store.state.loading = true;
    initGrid();

    const res = await getMemberShipList(store.state.userData.lngStoreGroup);

    rowData.value = res.data.List;

    console.log(cond6.value);
    ////console.log(res);
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
  if (rowData2.value.length > 0) {
    rowData2.value = [];
  }
  if (rowData3.value.length > 0) {
    rowData3.value = [];
  }
  if (rowData4.value.length > 0) {
    rowData4.value = [];
  }
  if (rowData5.value.length > 0) {
    rowData5.value = [];
  }
  if (rowData6.value.length > 0) {
    rowData6.value = [];
  }
  if (rowData7.value.length > 0) {
    rowData7.value = [];
  }

  cond.value = "";
  cond2.value = "";
  cond3.value = "0";
  cond4.value = "0";
  cond5.value = "1";
  cond6.value = "1";
  cond7.value = "";
  cond8.value = "";
  cond9.value = "";
  cond10.value = "1";
  cond11.value = "";
  cond12.value = "N";
  cond13.value = "1";
  cond14.value = "";
  cond15.value = "";
  cond16.value = "";
  cond17.value = "N";
  cond18.value = "";
  cond19.value = "";
  cond20.value = "";
  cond21.value = "";
  cond22.value = "";
  cond23.value = "";
  cond24.value = "";
};

const initGrid2 = () => {
  if (rowData2.value.length > 0) {
    rowData2.value = [];
  }
  if (rowData3.value.length > 0) {
    rowData3.value = [];
  }
  if (rowData4.value.length > 0) {
    rowData4.value = [];
  }
  if (rowData5.value.length > 0) {
    rowData5.value = [];
  }
  if (rowData6.value.length > 0) {
    rowData6.value = [];
  }
  if (rowData7.value.length > 0) {
    rowData7.value = [];
  }

  cond.value = "";
  cond2.value = "";
  cond3.value = "0";
  cond4.value = "0";
  cond5.value = "1";
  cond6.value = "1";
  cond7.value = "";
  cond8.value = formatLocalDate(new Date());
  cond9.value = formatLocalDate(new Date());
  cond10.value = "1";
  cond11.value = "";
  cond12.value = "N";
  cond13.value = "1";
  cond14.value = "";

  if (optionList3.value.length > 0) {
    cond15.value = optionList3.value[0].strSenderNumber;
  } else {
    cond15.value = "";
  }

  cond16.value = "";
  cond17.value = "N";
  cond18.value = "";
  cond19.value = "";
  cond20.value = "";
  cond21.value = "";
  cond22.value = "";
  cond23.value = "";
  cond24.value = "";
};

//엑셀 버튼 처리 함수
const exportExcel = ref(false);
/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  documentSubTitle.value = selectedDate.value + "\n" + selectedExcelStore.value;

  //documentSubTitle.value += "\n";
  exportExcel.value = !exportExcel.value;
};

// 엑셀 추출
const documentSubTitle = ref("");
const selectedExcelList = ref("");

const selectedExcelStore = ref("");
/**
 * 엑셀용 매장 세팅 함수
 */

const excelStore = (e) => {
  selectedExcelStore.value = e;
  //comsole.log(e);
};
const excelList = (e) => {
  selectedExcelList.value = e;
  //comsole.log(e);
};
const disabled = ref(true);

const tempPromoCode = ref("");
const buttonClicked = async (e) => {
  console.log(e);
  tempPromoCode.value = e[0];
  currentNew.value = false;
  try {
    const res = await getMemberShipCouponDetail(
      store.state.userData.lngStoreGroup,
      store.state.userData.lngPosition,
      e[0]
    );

    console.log(res);

    cond.value = res.data.List[0].lngCouponId;
    cond2.value = res.data.List[0].strCouponName;
    cond3.value = res.data.List[0].lngCouponGroup;
    cond4.value = res.data.List[0].lngCouponType;
    cond5.value = res.data.List[0].lngApplyType;
    cond6.value = res.data.List[0].lngDuplicate;
    cond7.value = res.data.List[0].lngToTerm;
    cond8.value = res.data.List[0].dtmFromDate.split(" ")[0];
    cond9.value = res.data.List[0].dtmToDate.split(" ")[0];
    cond10.value = res.data.List[0].lngDiscountType;
    cond11.value = res.data.List[0].dblAmountRate;
    cond12.value = res.data.List[0].strSMSSendYN;
    cond13.value = res.data.List[0].strSMSType;
    cond14.value = res.data.List[0].strSMSTitle;
    cond15.value = res.data.List[0].strSMSSender;
    cond16.value = res.data.List[0].strSMSText;
    cond17.value = res.data.List[0].strBenefitYN;

    cond18.value = res.data.List[0].strNotice.split("|")[0];
    cond19.value = res.data.List[0].strNotice.split("|")[1];
    cond20.value = res.data.List[0].strNotice.split("|")[2];
    cond21.value = res.data.List[0].strNotice.split("|")[3];
    cond22.value = res.data.List[0].strNotice.split("|")[4];
    cond23.value = res.data.List[0].strNotice.split("|")[5];
    cond24.value = res.data.List[0].strNotice.split("|")[6];
    rowData2.value = res.data.List3;
    rowData3.value = res.data.List2;
    rowData4.value = res.data.List4;

    if (cond4.value == 3) {
      disabled2.value = false;
      disabled3.value = false;
      disabled4.value = true;
    } else if (cond4.value == 4) {
      disabled2.value = true;
      disabled3.value = false;
      disabled4.value = true;
    } else if (cond4.value == 5) {
      disabled2.value = true;
      disabled3.value = true;
      disabled4.value = true;
    } else if (cond4.value == 6) {
      disabled2.value = true;
      disabled3.value = false;
      disabled4.value = true;
    } else if (cond4.value == 7) {
      disabled2.value = true;
      disabled3.value = false;
      disabled4.value = true;
    } else if (cond4.value == 8) {
      disabled2.value = true;
      disabled3.value = true;
      disabled4.value = false;
    } else {
      disabled2.value = true;
      disabled3.value = true;
      disabled4.value = true;
    }
  } catch (error) {
    console.log(error);
  }
};

const openPopUp = ref(false);
const openPopUp2 = ref(false);
const openStore = (e) => {
  openPopUp.value = true;
  searchButton2(e);
};
const openMenu = (e) => {
  openPopUp2.value = true;
  srowData3.value = [];
  tempCheckedList2.value = [];
  tempCheckedList.value = [];
  searchButton3(e);
};

const srowData = ref([]);
const selectedStore = ref(false);
const selectedMenu = ref(1);
const searchButton2 = async (e) => {
  try {
    updatedrowdata.value = [];
    const res = await getCrmMenuList(store.state.userData.lngStoreGroup, 0);

    console.log(res);
    srowData.value = res.data.List;
    openPopUp2.value = true;
  } catch (error) {}
};

const srowData2 = ref([]);
const srowData3 = ref([]);
const searchButton3 = async (e) => {
  selectedMenu.value = e;
  try {
    updatedrowdata2.value = [];
    const res = await getCrmMenuList(store.state.userData.lngStoreGroup, 0);

    console.log(res);
    srowData3.value = res.data.List;
    openPopUp3.value = true;
  } catch (error) {}
};

const searchword = ref("");
const searchWord = (e) => {
  searchword.value = e.target.value;
};

const saveButton2 = () => {
  // console.log(tempCheckedList2.value);
  rowData2.value = srowData2.value;

  openPopUp2.value = false;
};

const updatedrowdata = ref([]);
const updatedrowdata2 = ref([]);
const updatedRowData2 = (e) => {
  console.log(e);
  updatedrowdata.value = e;
};

const scond = ref("-1");
const scond2 = ref("-1");
const scond3 = ref("");
const setSubGroup = (e) => {
  const value = e.target.value;
  filteredoptionList2.value = optionList5.value.filter(
    (item) => item.lngMajor == value
  );
  scond2.value = "-1";

  scond.value = value;
  searchValue.value = [value, scond2.value];

  //console.log(searchValue.value);
};

const setMenu = (e) => {
  searchValue.value = [scond.value, e.target.value];

  //console.log(searchValue.value);
};

const searchValue = ref(["-1", "-1"]);

const setScond3 = (e) => {
  scond3.value = e.target.value;
};

const tempCheckedList = ref([]);
const tempCheckedList2 = ref([]);
const updatedRowData3 = (e) => {
  tempCheckedList.value = e.filter((item) => item.checkbox == true);
};

const updatedRowData4 = (e) => {
  console.log(e);
  tempCheckedList2.value = e;
};

const sendLeft = () => {
  // srowData3.value = srowData3.value.filter(item => item.checkbox)

  srowData2.value = tempCheckedList2.value.filter(
    (item) => item.checkbox == false
  );
};
const sendRight = () => {
  console.log(tempCheckedList.value);
  srowData2.value = tempCheckedList.value.map((item) => ({
    ...item,
    checkbox: false,
  }));
  tempCheckedList2.value = tempCheckedList.value.map((item) => ({
    ...item,
    checkbox: false,
  }));
};

const setCouponMain = ref(1);

const openPopUp3 = ref(false);
const searchButton4 = (e) => {
  setCouponMain.value = e;

  openPopUp3.value = true;
};

const currentNew = ref(false);
const addButton = () => {
  currentNew.value = true;
  initGrid2();
};

const saveButton = async () => {
  console.log(cond4.value);
  if (cond12.value == "Y" && !cond16.value.includes("(광고)")) {
    Swal.fire({
      title: "경고",
      text: "(광고) 단어 입력은 필수입니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (cond12.value == "Y" && !cond16.value.includes("무료수신거부")) {
    Swal.fire({
      title: "경고",
      text: "무료수신거부 단어 입력은 필수입니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (cond3.value == "0") {
    Swal.fire({
      title: "경고",
      text: "쿠폰분류를 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (cond4.value == "0") {
    Swal.fire({
      title: "경고",
      text: "쿠폰유형를 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (cond2.value == "" || cond2.value == undefined) {
    Swal.fire({
      title: "경고",
      text: "쿠폰명을 입력해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (cond4.value == "3" && rowData3.value.length == 0) {
    Swal.fire({
      title: "경고",
      text: "증정메뉴를 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (cond4.value == "4" && rowData3.value.length == 0) {
    Swal.fire({
      title: "경고",
      text: "증정메뉴를 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  if (cond4.value == "5" && rowData3.value.length == 0) {
    Swal.fire({
      title: "경고",
      text: "증정메뉴를 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  if (cond4.value == "6" && rowData3.value.length == 0) {
    Swal.fire({
      title: "경고",
      text: "증정메뉴를 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (
    cond4.value == "7" &&
    (rowData2.value.length == 0 || rowData4.value.length == 0)
  ) {
    Swal.fire({
      title: "경고",
      text: "1+1 필수메뉴와 1+1 증정메뉴를 등록해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (
    cond4.value == "8" &&
    (rowData2.value.length == 0 || rowData4.value.length == 0)
  ) {
    Swal.fire({
      title: "경고",
      text: " 증정메뉴를 등록해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  const result = optionList3.value.filter((item) =>
    cond16.value.includes(item.strQuiesceNumber)
  );

  if (cond12.value == "Y" && result.length == 0) {
    Swal.fire({
      title: "경고",
      text: "등록된 무료수신거부 번호가 아닙니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  try {
    let notice = "";

    if (cond18.value != "" || cond18.value != undefined) {
      notice += cond18.value + "|";
    }

    if (cond19.value != "" || cond19.value != undefined) {
      notice += cond19.value + "|";
    }
    if (cond20.value != "" || cond20.value != undefined) {
      notice += cond20.value + "|";
    }
    if (cond21.value != "" || cond21.value != undefined) {
      notice += cond21.value + "|";
    }
    if (cond22.value != "" || cond22.value != undefined) {
      notice += cond22.value + "|";
    }
    if (cond23.value != "" || cond23.value != undefined) {
      notice += cond23.value + "|";
    }
    if (cond24.value != "" || cond24.value != undefined) {
      notice += cond24.value + "|";
    }

    const res = await saveMemberShipCoupon(
      currentNew.value == false ? cond.value : 0,
      cond2.value,
      cond4.value,
      cond11.value == "" ? 0 : cond11.value,
      cond5.value,
      cond8.value,
      cond9.value,
      0,
      cond7.value,
      store.state.userData.lngStoreGroup,
      store.state.userData.lngPosition,
      "",
      16,
      99999999,
      cond6.value == "1" ? "Y" : "N",
      cond12.value,
      cond14.value,
      cond15.value,
      cond16.value,
      "",
      "00",
      store.state.userData.lngSequence,
      1,
      cond13.value,
      1,
      0,
      0,
      cond17.value,
      cond17.value == "N" ? 0 : 1,
      cond3.value,
      1,
      notice,
      rowData3.value
        .map(
          (item) =>
            item.lngStoreGroup +
            "+" +
            item.lngStoreCode +
            "+" +
            item.lngCode +
            "+" +
            item.lngHeadShare
        )
        .join("|"),
      rowData2.value
        .map(
          (item) =>
            item.lngStoreGroup + "+" + item.lngStoreCode + "+" + item.lngCode
        )
        .join("|"),
      rowData4.value
        .map(
          (item) =>
            item.lngStoreGroup +
            "+" +
            item.lngStoreCode +
            "+" +
            item.lngCode +
            "+" +
            item.lngHeadShare
        )
        .join("|")
    );
    console.log(res);
    if (res.data.RESULT_CD == "00") {
      await Swal.fire({
        title: "성공",
        text: "멤버쉽 쿠폰이 등록되었습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
    } else {
      await Swal.fire({
        title: "실패",
        text: `멤버쉽 쿠폰이 등록이 실패되었습니다.`,
        icon: "warning",
        confirmButtonText: "확인",
      });
    }
  } catch (error) {}
};

const currentbyteleng = ref("0");
const currentbyteleng2 = ref("0");
const set42byte = (e) => {
  let value = e.target.value;
  let bytelen = getByteLength(value);

  if (cond13.value == "1") {
    while (bytelen > 80) {
      value = value.slice(0, -1);
      bytelen = getByteLength(value);
    }
  } else {
  }
  currentbyteleng.value = bytelen;
  cond16.value = value;
  // e.target.value = value;
};

const set42byte2 = (e) => {
  let value = cond16.value;
  let bytelen = getByteLength(value);

  if (cond13.value == "1") {
    while (bytelen > 80) {
      value = value.slice(0, -1);
      bytelen = getByteLength(value);
    }
  } else {
  }
  currentbyteleng.value = bytelen;
  cond16.value = value;
  // e.target.value = value;
};

function getByteLength(str) {
  let byte = 0;
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    if (code <= 0x007f) byte += 1; // 영문, 숫자, 특수문자
    else if (code <= 0x07ff) byte += 2; // 일부 확장
    else byte += 3; // 한글, 한자 등
  }
  return byte;
}

const onlyNumber = (e) => {
  const value = e.target.value.replace(/[^0-9]/g, "");

  if (e.target.name == "cond7") {
    cond7.value = value;
  } else if (e.target.name == "cond19") {
    cond19.value = value;
  } else if (e.target.name == "cond26") {
    cond26.value = value;
  } else if (e.target.name == "cond27") {
    cond27.value = value;
  } else if (e.target.name == "cond28") {
    cond28.value = value;
  }
};

const disabled1 = ref(true);
const changeDisable = () => {
  disabled1.value = !disabled1.value;
};

const disabled2 = ref(true);
const disabled3 = ref(true);
const disabled4 = ref(true);

const setDisable2 = (e) => {
  console.log(e.target.value);

  if (e.target.value == 3) {
    disabled2.value = false;
    disabled3.value = false;
    disabled4.value = true;
    rowData2.value = [];
    rowData4.value = [];
  } else if (e.target.value == 4) {
    disabled2.value = true;
    disabled3.value = false;
    disabled4.value = true;
    rowData2.value = [];
    rowData4.value = [];
  } else if (e.target.value == 5) {
    disabled2.value = true;
    disabled3.value = true;
    disabled4.value = true;
    rowData2.value = [];
    rowData3.value = [];
    rowData4.value = [];
  } else if (e.target.value == 6) {
    disabled2.value = true;
    disabled3.value = false;
    disabled4.value = true;
    rowData2.value = [];

    rowData4.value = [];
  } else if (e.target.value == 7) {
    disabled2.value = true;
    disabled3.value = false;
    disabled4.value = true;
    rowData2.value = [];

    rowData4.value = [];
  } else if (e.target.value == 8) {
    disabled2.value = true;
    disabled3.value = true;
    disabled4.value = false;

    rowData3.value = [];
  } else {
    disabled2.value = true;
    disabled3.value = false;
    disabled4.value = true;
    rowData2.value = [];

    rowData4.value = [];
  }

  cond4.value = e.target.value;
};

const disabled5 = ref(true);
const setDisable3 = (e) => {
  disabled5.value = !disabled5.value;
};

const tempCheckedList3 = ref([]);
const tempCheckedList4 = ref([]);
const srowData4 = ref([]);
const updatedRowData5 = (e) => {
  tempCheckedList3.value = e.filter((item) => item.checkbox == true);
};
const sendLeft2 = () => {
  srowData4.value = tempCheckedList4.value;
};
const sendRight2 = () => {
  tempCheckedList3.value = tempCheckedList3.value.map((item) => ({
    ...item,
    checkbox: false,
  }));
  srowData4.value = tempCheckedList3.value;
};

const updatedRowData6 = (e) => {
  tempCheckedList4.value = e.filter((item) => item.checkbox == false);
};

const saveButton4 = () => {
  if (selectedMenu.value == 1) {
    rowData3.value = tempCheckedList4.value;
  } else {
    rowData4.value = tempCheckedList4.value;
  }

  console.log(rowData3.value);
  openPopUp3.value = false;
};

const scond4 = ref("0");
const scond5 = ref("0");

const changeValue2 = ref("");
const changeRow = ref("0");
const changeNow = ref(false);
const setHeadShare = async () => {
  if (scond4.value == "0") {
    changeValue2.value = scond5.value;
    for (let i = 0; i < srowData4.value.length; i++) {
      changeRow.value = i;
      changeNow.value = !changeNow.value;

      await nextTick();
    }
  } else {
    for (let i = 0; i < srowData4.value.length; i++) {
      changeValue2.value = (scond5.value / 100) * srowData4.value[i].lngPrice;
      changeRow.value = i;
      changeNow.value = !changeNow.value;

      await nextTick();
    }
  }
};
</script>
