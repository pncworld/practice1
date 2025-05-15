/*--############################################################################
# Filename : MST01_033INS.vue                                                  
# Description : 마스터관리 > 메뉴 마스터 > 메뉴코드등록                        
# Date :2025-05-14                                                             
# Author : 권맑음                     
################################################################################*/
<template>
  <div>
    <div class="flex justify-center pl-4 pt-4">
      <div class="flex justify-center">
        <h1 class="font-bold text-2xl">요일별 분석</h1>
      </div>
    </div>
    <br /><br />
    <div
      class="flex flex-col space-y-3 bg-gray-200 rounded-lg p-4 h-auto md:h-20 md:flex-row md:justify-between">
      <!-- 상단 영역 -->
      <div
        class="flex flex-col md:flex-row md:justify-between items-center w-full">
        <div
          class="flex flex-col md:flex-row items-center w-full md:w-auto space-y-2 md:space-y-0 md:space-x-4">
          <div class="flex items-center space-x-2">
            <span class="text-sm font-medium">일자 선택</span>
          </div>
          <DateRangePicker3
            @update:dateRange="
              (newRange) => {
                handleDateRangeUpdate(newRange);
                searchButton();
              }
            "
            class="w-full z-10" />
        </div>

        <!-- PickStore 버튼 -->
        <div class="flex flex-col justify-center items-center w-full mt-2">
          <span class="flex justify-center">매장 선택</span>
          <PickStore
            @update:storeGroup="updateGroup"
            @update:storeType="updateType"
            @update:storeCd="updateCd"
            class="w-full justify-start items-start flex"
            @change="searchButton" />
        </div>
      </div>
    </div>

    <div class="w-full bg-white border border-gray-300 rounded-lg shadow-md">
      <!-- 상단 제목 영역 -->
      <div class="flex justify-between p-4 border-b border-gray-300">
        <div
          class="flex-1 text-center font-semibold text-gray-700 border-r border-gray-300">
          최대 매출 요일
        </div>
        <div class="flex-1 text-center font-semibold text-gray-700">
          최소 매출 요일
        </div>
      </div>

      <!-- 하단 내용 영역 -->
      <div class="p-4 flex w-full" v-if="showcontent">
        <!-- 여기에 하단 내용을 추가하면 됩니다 -->
        <div class="flex-1">
          <p class="text-gray-600 border-r font-bold text-2xl">
            {{ maxsalesDate }}
          </p>
          <p class="font-bold">
            {{ parseInt(maxsalesvalue).toLocaleString() }}원
          </p>
        </div>
        <div class="flex-1">
          <p class="text-gray-600 font-bold text-2xl">
            {{ minsalesDate }}
          </p>
          <p class="font-bold">
            {{ parseInt(minsalesvalue).toLocaleString() }}원
          </p>
        </div>
      </div>
      <div></div>
    </div>

    <div
      class="w-full bg-white border border-gray-300 rounded-lg shadow-md mt-5"
      v-if="showcontent">
      <div class="flex justify-start font-semibold ml-3 text-xl">상세내역</div>
      <div class="grid grid-cols-4 w-full text-xl">
        <div class="bg-gray-200">요일</div>
        <div class="bg-gray-200">영업일</div>
        <div class="bg-gray-200">건 수</div>
        <div class="bg-gray-200">실 매출액</div>
      </div>
      <div v-for="(i, index) in daysInKorean" class="flex text-xl ml-0">
        <div class="flex-shrink-0 w-1/4">{{ i }}</div>
        <div class="flex-shrink-0 w-1/4">{{ saleDays[index] }}</div>
        <div class="flex-shrink-0 w-1/4">{{ salecases[index] }}</div>
        <div class="flex-shrink-0 w-1/4">{{ realSales[index] }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 가져온 날짜의 형식을 고치기 위해서 사용 ( 데이터가 yyyy-mm-dd T ~~~ 이런형태여서 T부터 자름)
import { format } from "date-fns";
// 설치한 라이브러리로 만든 달력을 가져옴 ( 재사용 )
// 뷰에서 제공 하는 기능, computed 반응형 상태를 기반으로 다른 로직을 실행해 결과값을 생성 , ref 반응형 변수 선언
import { computed, ref } from "vue";
// vuex에서 제공하는 중앙 상태관리
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";
/**
 * 매장 공통 컴포넌트
 */

import PickStore from "@/components/pickStore.vue";
// 각 탭 마다 필요한 그리드 설정 속성 불러오기
import { getGridInfoList } from "@/api/common";
// alert 창 자동 꾸미기 위한 라이브러리
/**
 *  경고창 호출 라이브러리
 *  */

import Swal from "sweetalert2";
import { dailySaleReport } from "@/api/misales";
import DateRangePicker3 from "../component/DateRangePicker3.vue";

const store = useStore();

// vuex에 저장된 로그인된 정보 호출
const userData = store.state.userData;

// 로그인한 사람의 groupCd를 초기화하려는 목적(조회용)
const groupCd = ref(userData.lngStoreGroup);
// 로그인한 사람의 typeCd를 초기화하려는 목적(조회용)
const typeCd = ref();
// 로그인한 사람의 storeCd를 초기화하려는 목적 (조회용)
const storeCd = ref();

const showcontent = ref(false);
// 셀병합 기능을 위한 변수

// 조회 값 설정 함수 선언
const updateGroup = (value) => {
  groupCd.value = value;
};
const updateType = (value) => {
  typeCd.value = value;
};
const updateCd = (value) => {
  storeCd.value = value;
};

const afterSearch = ref(false);

// 조회 함수.
const maxsales = ref();
const minsales = ref();
const minsalesDate = ref();
const maxsalesDate = ref();
const minday = ref();
const maxday = ref();
const minsalesvalue = ref();
const maxsalesvalue = ref();
const sumCase = ref();
const sumSales = ref();
const avgSales = ref();
const result2 = ref();
const saleDays = ref([]);
const salecases = ref([]);
const realSales = ref([]);
const daysInKorean = [
  "일요일",
  "월요일",
  "화요일",
  "수요일",
  "목요일",
  "금요일",
  "토요일",
];
/**
 *  조회 함수
 */

const searchButton = () => {
  //comsole.log("왓냐");

  const readsales = async () => {
    if (storeCd.value == undefined || storeCd.value == "0") {
      return;
    }
    showcontent.value = true;
    store.dispatch("convertLoading", true);
    const response = await dailySaleReport(
      groupCd.value,
      storeCd.value,
      startDate.value,
      endDate.value,
      userData.strLanguage
    );

    const result = response.data.dailySales;
    result2.value = response.data.dailySales;
    maxsales.value = result.reduce(
      (max, item) => (item.lngActAmt > max.lngActAmt ? item : max),
      result[0]
    );
    minsales.value = result.reduce(
      (min, item) => (item.lngActAmt < min.lngActAmt ? item : min),
      result[0]
    );
    sumCase.value = result.reduce((sum, item) => sum + item.lngRecCnt, 0);
    sumSales.value = result.reduce((sum, item) => sum + item.lngActAmt, 0);
    avgSales.value =
      result.reduce((sum, item) => sum + item.lngActAmt, 0) / result.length;
    minsalesDate.value = minsales.value.dtmDate.split(" ")[0];
    let minDay = new Date(minsalesDate.value);
    minDay = minDay.getDay();
    minsalesDate.value = daysInKorean[minDay];
    maxsalesDate.value = maxsales.value.dtmDate.split(" ")[0];
    let maxDay = new Date(maxsalesDate.value);
    maxDay = maxDay.getDay();
    maxsalesDate.value = daysInKorean[maxDay];
    minsalesvalue.value = minsales.value.lngActAmt;
    maxsalesvalue.value = maxsales.value.lngActAmt;

    saleDays.value = result.reduce(
      (acc, item) => {
        const date = item.dtmDate.split(" ")[0];
        let day = new Date(date);
        day = day.getDay();
        acc[day] += 1;
        return acc;
      },
      [0, 0, 0, 0, 0, 0, 0]
    );

    salecases.value = result.reduce(
      (acc, item) => {
        const date = item.dtmDate.split(" ")[0];
        let day = new Date(date);
        day = day.getDay();
        acc[day] += item.lngRecCnt;
        return acc;
      },
      [0, 0, 0, 0, 0, 0, 0]
    );

    realSales.value = result.reduce(
      (acc, item) => {
        const date = item.dtmDate.split(" ")[0];
        let day = new Date(date);
        day = day.getDay();
        acc[day] += item.lngActAmt;
        return acc;
      },
      [0, 0, 0, 0, 0, 0, 0]
    );

    afterSearch.value = true;
    store.dispatch("convertLoading", false);
  };
  readsales(); // 세팅된 함수 실행
};
// 달력 초기 설정값 지정을 위한 변수 설정
/**
 * 선택한 매출 시작일자
 */

const startDate = ref(format(new Date(), "yyyy-MM-dd"));
/**
 * 선택한 매출 종료일자
 */

const endDate = ref(format(new Date(), "yyyy-MM-dd"));

const handleDateRangeUpdate = (newDateRange) => {
  if (newDateRange) {
    startDate.value = format(newDateRange[0], "yyyy-MM-dd");
    endDate.value = format(newDateRange[1], "yyyy-MM-dd");
  } else {
    startDate.value = null;
    endDate.value = null;
  }
};
</script>

<style></style>
