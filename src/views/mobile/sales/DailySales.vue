<template>
  <div>
  
    <div class="flex justify-center pl-4 pt-4">
                 <div class="flex justify-center"><h1 class="font-bold text-2xl">
                  기간별 분석
                 </h1></div>
          </div>
    <br /><br />
    <div class="flex flex-col space-y-3 bg-gray-200 rounded-lg p-4 h-auto md:h-20 md:flex-row md:justify-between">
  <!-- 상단 영역 -->
  <div class="flex flex-col md:flex-row md:justify-between items-center w-full">
    <div class="flex flex-col md:flex-row items-center w-full md:w-auto space-y-2 md:space-y-0 md:space-x-4">
      <div class="flex items-center space-x-2">
        <span class="text-sm font-medium">일자 선택</span>
      </div>
      <DateRangePicker @update:dateRange="handleDateRangeUpdate" class=" w-full z-10"/>
    </div>
    
    <!-- PickStore 버튼 -->
    <div class="flex flex-col justify-center items-center w-full mt-2 ">
      <span class="flex justify-center">매장 선택</span>
      <PickStore 
        @update:storeGroup="updateGroup" 
        @update:storeType="updateType" 
        @update:storeCd="updateCd" 
        class="w-full justify-start items-start flex" 
        @change="searchButton"
      />
    </div>

  </div>
</div>

<div class="w-full bg-white border border-gray-300 rounded-lg shadow-md">
  <!-- 상단 제목 영역 -->
  <div class="flex justify-between p-4 border-b border-gray-300">
    <div class="flex-1 text-center font-semibold text-gray-700 border-r border-gray-300">
      최대 매출 일자
    </div>
    <div class="flex-1 text-center font-semibold text-gray-700">
      최초 매출 일자
    </div>
  </div>

  <!-- 하단 내용 영역 -->
  <div class="p-4 flex w-full" v-if="showcontent">
    <!-- 여기에 하단 내용을 추가하면 됩니다 -->
     <div class="flex-1">
      <p class="text-gray-600 border-r font-bold text-2xl">
      {{  maxsalesDate }} {{ maxday }}
    </p>
    <p class="font-bold">
      {{ parseInt(maxsalesvalue).toLocaleString()}}원
    </p>
     </div>
    <div class="flex-1">
    <p class="text-gray-600 font-bold text-2xl">
      {{  minsalesDate }} {{ minday }}
    </p>
    <p class="font-bold">
      {{ parseInt(minsalesvalue).toLocaleString()}}원
    </p>
  </div>
  </div>
  <div>
  

  </div>
  
</div>
<div class="w-full bg-white border border-gray-300 rounded-lg shadow-md" v-if="showcontent">
     <div class="text-gray-600 border-r font-bold text-xl flex flex-col items-start ml-3 justify-start"> 
      <div>건수합계 : <span class="text-xl font-medium"> {{ parseInt(sumCase).toLocaleString() }} 건</span></div>
      <div>매출합계 : <span class="text-xl font-medium">{{ parseInt(sumSales).toLocaleString() }} 원</span></div>
      <div>매출평균 : <span class="text-xl font-medium">{{ parseInt(avgSales).toLocaleString() }} 원</span></div>
       
    </div> 
   </div>

  <div class="w-full bg-white border border-gray-300 rounded-lg shadow-md mt-5" v-if="showcontent">
    <div class="flex justify-start font-semibold ml-3 text-xl">상세내역</div>
    <div class="grid grid-cols-3 w-full text-xl ">
      <div class="bg-gray-200">일자</div>
      <div class="bg-gray-200">건 수</div>
      <div class="bg-gray-200">실매출액</div>
    </div>
    <div v-for="i in result2" class="flex text-xl  ml-5">
        <div class="flex-shrink-0 w-1/3"> {{i.dtmDate.split(' ')[0]}}</div>
        <div class="flex-shrink-0 w-1/3"> {{i.lngRecCnt}}</div>
        <div class="flex-shrink-0 w-1/3"> {{parseInt(i.lngActAmt).toLocaleString()}}</div>
      </div>
  </div>
    

  </div>
</template>

<script setup>
// 가져온 날짜의 형식을 고치기 위해서 사용 ( 데이터가 yyyy-mm-dd T ~~~ 이런형태여서 T부터 자름)
import { format } from 'date-fns';
// 설치한 라이브러리로 만든 달력을 가져옴 ( 재사용 )
import DateRangePicker from '@/components/DateRangePicker.vue';
// 뷰에서 제공 하는 기능, computed 반응형 상태를 기반으로 다른 로직을 실행해 결과값을 생성 , ref 반응형 변수 선언
import { computed, ref } from 'vue';
// vuex에서 제공하는 중앙 상태관리 
import { useStore } from 'vuex';
// api 호출 함수
import axios from 'axios';
// 그리드 한글화에 필요한 라이브러리
import { AG_GRID_LOCALE_KR } from '@ag-grid-community/locale';
// 로그인한 사용자에 따라 법인명 매장명 등을 선택할 수 있게  만든 공통 컴포넌트 
import PickStore from '@/components/pickStore.vue';
// 각 탭 마다 필요한 그리드 설정 속성 불러오기
import { getGridInfoList} from '@/api/common';
// alert 창 자동 꾸미기 위한 라이브러리
import Swal from 'sweetalert2';
import { dailySaleReport } from '@/api/misales';



const store = useStore();
// 그리드에 다중 선택 혹은 개별 선택 설정 변수
const selection = ref({ mode: "cell" });
// vuex에 저장된 로그인된 정보 호출
const userData = store.state.userData;
// 그리드안에 들어갈 행 데이터 배열 선언 
const rowData = ref([]);
// 로그인한 사람의 groupCd를 초기화하려는 목적(조회용)
const groupCd = ref(userData.lngStoreGroup);
// 로그인한 사람의 typeCd를 초기화하려는 목적(조회용)
const typeCd = ref();
// 로그인한 사람의 storeCd를 초기화하려는 목적 (조회용)
const storeCd = ref();
// 상세보기 기능을 위한 변수
const detailViewtf = ref(true);
// 조회 후를 감지하기 위한 변수
const afterSearch = ref(false);
const showcontent = ref(false);
// 셀병합 기능을 위한 변수
const cellUnitedtf = ref(false);
// 그리드 설정 값을 불러오기 위한 하드코딩
const GridInfo_PROG_ID = "SLS06_004RPT_VUE_TEST";
const GridInfo_GRID_ID = "1";
// API 호출 (설정값 호출)
const tabInitSetArray = ref([]);
(async () => {
    try {
        const result = await getGridInfoList(GridInfo_PROG_ID, GridInfo_GRID_ID);
        tabInitSetArray.value = result; 
    } catch (error) {
        console.error("Failed to fetch data:", error); // 오류 로그 출력
    } finally {
      
    }
})();

// 조회 값 설정 함수 선언
const updateGroup = (value) => {
  groupCd.value = value;

}
const updateType = (value) => {
  typeCd.value = value;

}
const updateCd = (value) => {
  storeCd.value = value;

}
const isMobile = store.state.isMobile;
// 상세보기 눌렀을때 실행하는 함수
const detailView = () => {

  detailViewtf.value = !detailViewtf.value;
  colDefs.value.forEach(col => {
    if (col.field == 'lngSalAmt' || col.field == 'lngDiscount' || col.field == 'lngVAT' || col.field == 'lngSupplyAmt') {

      col.hide = detailViewtf.value;
    }
  })

}


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
const searchButton = () => {
  showcontent.value = true ;
  const readsales = async () => {
    if (storeCd.value == undefined) {
      Swal.fire({
        icon: 'warning',
        title: '매장을 선택하세요!',
        text: '매장을 선택하지 않으면 진행할 수 없습니다.',
        confirmButtonText: '확인',
        confirmButtonColor: '#3085d6',
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
    maxsales.value = result.reduce((max, item) => (item.lngActAmt > max.lngActAmt ? item : max), result[0]);
    minsales.value = result.reduce((min, item) => (item.lngActAmt < min.lngActAmt ? item : min), result[0]);
    sumCase.value = result.reduce((sum, item) => sum + item.lngRecCnt, 0);
    sumSales.value = result.reduce((sum, item) => sum + item.lngActAmt, 0);
    avgSales.value = result.reduce((sum, item) => sum + item.lngActAmt, 0) / result.length;
    minsalesDate.value = minsales.value.dtmDate.split(' ')[0]
    maxsalesDate.value = maxsales.value.dtmDate.split(' ')[0]
    minsalesvalue.value = minsales.value.lngActAmt;
    maxsalesvalue.value = maxsales.value.lngActAmt;
    const mindate = new Date(minsalesDate.value);
    const maxdate = new Date(maxsalesDate.value);

    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

    // 요일 추출
    const minday2 = daysOfWeek[mindate.getDay()];
    const maxday2 = daysOfWeek[maxdate.getDay()];
    minday.value = minday2
    maxday.value = maxday2
    afterSearch.value = true;
    store.dispatch("convertLoading", false);
  }
  readsales(); // 세팅된 함수 실행
  
}
// 달력 초기 설정값 지정을 위한 변수 설정
const startDate = ref(format(new Date(), 'yyyy-MM-dd'));
const endDate = ref(format(new Date(), 'yyyy-MM-dd'));

const handleDateRangeUpdate = (newDateRange) => {
  if (newDateRange) {
    startDate.value = format(newDateRange[0], 'yyyy-MM-dd');
    endDate.value = format(newDateRange[1], 'yyyy-MM-dd');
  } else {
    startDate.value = null;
    endDate.value = null;
  }

};
</script>

<style>
.themeClass {
   width: 100%;
   /* db안에 없는 속성으로 헤더 픽셀 값  설정 */
   /* 그리드의 기본 전경 색상을 설정 */
  --ag-foreground-color: rgb(0, 0, 0) !important;
  /* 그리드의 기본 배경색 */
  --ag-background-color: rgb(255, 255, 255);
   /* 그리드의 헤더 기본 전경색(텍스트 색상) */
  /* --ag-header-foreground-color: white !important;
    그리드의 헤더 기본 배경색 
  --ag-header-background-color: rgb(68, 68, 107) !important; */
  /* 그리드 홀수행 배경색  */
  --ag-odd-row-background-color: rgb(0, 0, 0, 0.03);
    /* 그리드의 헤더에 표시되는 열 크기 조정 핸들의 색상 */
   /* --ag-header-column-resize-handle-color: rgb(255, 255, 255) !important; */

   /* 기본 폰트 사이즈 설정 */
  --ag-font-size: 12px !important;
  /* 폰트 설정 */
  --ag-font-family: monospace;
   /* 행과 행의 경계선 설정 */
  --ag-row-border-style: solid !important;
  --ag-row-border-width: 1px !important;
  --ag-row-border-color: rgb(228, 228, 228) !important;
  /* 열과열 사이의 경계선 설정 */
  --ag-cell-horizontal-border: solid rgb(228, 228, 228) !important;
   /* 행의 높이 설정 */
  /* --ag-row-height : 20px !important ; */
  /* 그리드 셀 내부의 수평 여백(패딩)을 설정 */
  --ag-cell-horizontal-padding: 5px !important;
}

/* .ag-group-footer {
  background-color: #fff5e8 ;
  /* 원하는 배경색 
  color: white;
  /* 원하는 글자색 
} */

/* 그룹 총합계의 배경색 및 글자색 변경 */
.ag-total-footer {
  background-color: #B29BC7;
  /* 원하는 배경색 */
  color: white;
  /* 원하는 글자색 */
}

/*  오버라이드를 통해서 헤더 가운데 정렬 */
.ag-header-cell-label {
  justify-content: center ;
  margin-right: -20px;
} 

.ag-header-cell-comp-wrapper {
  display: flex;
  justify-content: center ;

}
.cell-span {
  background-color: brown;
}
</style>