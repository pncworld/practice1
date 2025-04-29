<template>
  <div>
    <div class="flex justify-center pl-4 pt-4">
      <div class="flex justify-center">
        <h1 class="font-bold text-2xl">기간별 분석</h1>
      </div>
    </div>
    <br /><br />
    <div
      class="flex flex-col space-y-3 bg-gray-200 rounded-lg p-4 h-auto md:h-20 md:flex-row md:justify-between relative">
      <!-- 상단 영역 -->
      <div
        class="flex flex-col md:flex-row md:justify-between items-center w-full relative">
        <div
          class="flex flex-col md:flex-row items-center w-full md:w-auto space-y-2 md:space-y-0 md:space-x-4 relative">
          <div class="flex items-center space-x-2">
            <span class="text-sm font-medium">일자 선택</span>
          </div>
          <DateRangePicker
            @update:dateRange="handleDateRangeUpdate"
            @update:unit="updateunit"
            class="w-full absolute z-50" />
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

    <div
      class="w-full bg-white border border-gray-300 rounded-lg shadow-md"
      v-if="showcontent">
      <!-- 상단 제목 영역 -->
      <div class="flex justify-between p-4 border-b border-gray-300">
        <div
          class="flex-1 text-center font-semibold text-gray-700 border-r border-gray-300">
          최대 매출 {{ currMainnames }}
        </div>
        <div class="flex-1 text-center font-semibold text-gray-700">
          최소 매출 {{ currMainnames }}
        </div>
      </div>

      <!-- 하단 내용 영역 -->
      <div class="p-4 flex w-full">
        <!-- 여기에 하단 내용을 추가하면 됩니다 -->
        <div class="flex-1">
          <p class="text-gray-600 border-r font-bold text-2xl">
            {{ maxsalesDate }} <span v-if="currUnit == 'weekUnit'">월</span>
            {{ maxday }}<span v-if="currUnit == 'weekUnit'">주차</span>
          </p>
          <p class="font-bold">
            {{ parseInt(maxsalesvalue).toLocaleString() }}원
          </p>
        </div>
        <div class="flex-1">
          <p class="text-gray-600 font-bold text-2xl">
            {{ minsalesDate }} <span v-if="currUnit == 'weekUnit'">월</span
            >{{ minday }}<span v-if="currUnit == 'weekUnit'">주차</span>
          </p>
          <p class="font-bold">
            {{ parseInt(minsalesvalue).toLocaleString() }}원
          </p>
        </div>
      </div>
      <div></div>
    </div>
    <div class="w-full bg-white border border-gray-300 rounded-lg shadow-md">
      <div
        class="text-gray-600 border-r font-bold text-xl flex flex-col items-start ml-3 justify-start">
        <div>
          건수합계 :
          <span class="text-xl font-medium">
            {{ parseInt(sumCase).toLocaleString() }} 건</span
          >
        </div>
        <div>
          매출합계 :
          <span class="text-xl font-medium"
            >{{ parseInt(sumSales).toLocaleString() }} 원</span
          >
        </div>
        <div>
          매출평균 :
          <span class="text-xl font-medium"
            >{{ parseInt(avgSales).toLocaleString() }} 원</span
          >
        </div>
      </div>
    </div>

    <div
      class="w-full bg-white border border-gray-300 rounded-lg shadow-md mt-5">
      <div class="flex justify-start font-semibold ml-3 text-xl">상세내역</div>
      <div class="grid grid-cols-3 w-full text-xl">
        <div class="bg-gray-200">
          <span v-if="currUnit == 'dayUnit'">일자</span
          ><span v-if="currUnit == 'weekUnit'">주차</span>
        </div>
        <div class="bg-gray-200">건 수</div>
        <div class="bg-gray-200">실매출액</div>
      </div>
      <div
        v-for="i in result3"
        class="flex text-xl ml-5"
        v-if="currUnit == 'dayUnit'">
        <div class="flex-shrink-0 w-1/3">{{ i.dtmDate.split(" ")[0] }}</div>
        <div class="flex-shrink-0 w-1/3">{{ i.lngRecCnt }}</div>
        <div class="flex-shrink-0 w-1/3">
          {{ parseInt(i.lngActAmt).toLocaleString() }}
        </div>
      </div>
      <div
        v-for="i in result2"
        class="flex text-xl ml-5"
        v-if="currUnit == 'weekUnit'">
        <div class="flex-shrink-0 w-1/3">
          {{ i.month }} 월 {{ i.week }} 주차
        </div>
        <div class="flex-shrink-0 w-1/3">{{ i.lngRecCnt }}</div>
        <div class="flex-shrink-0 w-1/3">
          {{ parseInt(i.lngActAmt).toLocaleString() }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 가져온 날짜의 형식을 고치기 위해서 사용 ( 데이터가 yyyy-mm-dd T ~~~ 이런형태여서 T부터 자름)
import { format } from "date-fns";
// 설치한 라이브러리로 만든 달력을 가져옴 ( 재사용 )

// 뷰에서 제공 하는 기능, computed 반응형 상태를 기반으로 다른 로직을 실행해 결과값을 생성 , ref 반응형 변수 선언
import { ref } from "vue";
// vuex에서 제공하는 중앙 상태관리
import PickStore from "@/components/pickStore.vue";
import { useStore } from "vuex";
// 각 탭 마다 필요한 그리드 설정 속성 불러오기
// alert 창 자동 꾸미기 위한 라이브러리
import { dailySaleReport } from "@/api/misales";
import Swal from "sweetalert2";
import DateRangePicker from "../component/DateRangePicker.vue";

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
const result3 = ref();
const currMainnames = ref("일자");
const currUnit = ref("dayUnit");

const updateunit = (value) => {
  currUnit.value = value;
  if (value == "dayUnit") {
    currMainnames.value = "일자";
  } else if (value == "weekUnit") {
    currMainnames.value = "주차";
  } else if (value == "monthUnit") {
    currMainnames.value = "월";
  }
};
function getWeek(date) {
  const firstDayOfYear = new Date(date.getFullYear(), date.getMonth(), 1); // 1월 1일

  // 첫 번째 주 시작을 일요일로 맞추기 위해 날짜 차이를 계산
  const diffDays = Math.floor((date - firstDayOfYear) / (1000 * 60 * 60 * 24));

  // 첫 주는 1주차로 시작, 이후 일요일 기준으로 계산
  const weekNumber = Math.floor(diffDays / 7) + 1;
  const month = date.getMonth() + 1;
  return { month, weekNumber };
}
const searchButton = () => {
  showcontent.value = true;
  const readsales = async () => {
    if (storeCd.value == undefined) {
      Swal.fire({
        icon: "warning",
        title: "매장을 선택하세요!",
        text: "매장을 선택하지 않으면 진행할 수 없습니다.",
        confirmButtonText: "확인",
        confirmButtonColor: "#3085d6",
      });
      return;
    }
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
    result3.value = response.data.dailySales;
    //console.log(result2.value);
    if (currUnit.value == "dayUnit") {
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
      maxsalesDate.value = maxsales.value.dtmDate.split(" ")[0];
      minsalesvalue.value = minsales.value.lngActAmt;
      maxsalesvalue.value = maxsales.value.lngActAmt;
      const mindate = new Date(minsalesDate.value);
      const maxdate = new Date(maxsalesDate.value);

      const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];

      // 요일 추출
      const minday2 = daysOfWeek[mindate.getDay()];
      const maxday2 = daysOfWeek[maxdate.getDay()];
      minday.value = minday2;
      maxday.value = maxday2;
    } else if (currUnit.value == "weekUnit") {
      result2.value = result2.value.reduce((acc, item, index) => {
        const groupIndex = Math.floor(index / 7);
        const weekNumber = getWeek(new Date(item.dtmDate.split(" ")[0]));
        if (!acc[groupIndex]) {
          acc[groupIndex] = {
            lngActAmt: 0,
            lngCustAmt: 0,
            lngCustCnt: 0,
            lngDiscount: 0,
            lngRecAmt: 0,
            lngRecCnt: 0,
            lngSalAmt: 0,
            lngSupplyAmt: 0,
            lngVAT: 0,
            month: weekNumber.month,
            week: weekNumber.weekNumber,
          };
        }
        acc[groupIndex].lngActAmt += item.lngActAmt;
        acc[groupIndex].lngCustAmt += item.lngCustAmt;
        acc[groupIndex].lngCustCnt += item.lngCustCnt;
        acc[groupIndex].lngDiscount += item.lngDiscount;
        acc[groupIndex].lngRecAmt += item.lngRecAmt;
        acc[groupIndex].lngRecCnt += item.lngRecCnt;
        acc[groupIndex].lngSalAmt += item.lngSalAmt;
        acc[groupIndex].lngSupplyAmt += item.lngSupplyAmt;
        acc[groupIndex].lngVAT += item.lngVAT;
        return acc;
      }, []);
      //console.log(result2.value);
      maxsales.value = result2.value.reduce(
        (max, item) => (item.lngActAmt > max.lngActAmt ? item : max),
        result2.value[0]
      );
      minsales.value = result2.value.reduce(
        (min, item) => (item.lngActAmt < min.lngActAmt ? item : min),
        result2.value[0]
      );
      sumCase.value = result2.value.reduce(
        (sum, item) => sum + item.lngRecCnt,
        0
      );
      sumSales.value = result2.value.reduce(
        (sum, item) => sum + item.lngActAmt,
        0
      );
      avgSales.value =
        result2.value.reduce((sum, item) => sum + item.lngActAmt, 0) /
        result2.value.length;
      minsalesDate.value = minsales.value.month;
      maxsalesDate.value = maxsales.value.month;
      minsalesvalue.value = minsales.value.lngActAmt;
      maxsalesvalue.value = maxsales.value.lngActAmt;
      const minday2 = minsales.value.week;
      const maxday2 = maxsales.value.week;
      minday.value = minday2;
      maxday.value = maxday2;
    } else {
    }
    afterSearch.value = true;
    store.dispatch("convertLoading", false);
  };
  readsales(); // 세팅된 함수 실행
};
// 달력 초기 설정값 지정을 위한 변수 설정
const startDate = ref(format(new Date(), "yyyy-MM-dd"));
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
