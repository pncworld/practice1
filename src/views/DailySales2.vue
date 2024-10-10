<template>
    <div>
      <div class="flex justify-between items-center w-full">
        <h1 class="flex-grow text-center ml-24 text-2xl">월별 매출 현황</h1>
        <div class="flex">
          <button class="flex justify-center" @click="searchButton">
            <!-- <img src="../assets/search.png" alt="" class="h-auto" style="width: 30px">조회 -->
            조회
          </button>
          &nbsp; &nbsp; &nbsp;
          <button class="flex justify-center" @click="exportExcel">
            <!-- <img src="../assets/excel.png" alt="" class="h-auto" style="width: 30px">엑셀 내보내기 -->
            엑셀
          </button>
          &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
        </div>
      </div>
      <br />
      <div class="flex justify-between items-center">
        <h2 class="flex justify-start w-3/12">
          &nbsp; &nbsp; &nbsp;<div class="items-center flex">일자</div> &nbsp; &nbsp;
          <DateRangePicker @update:dateRange="handleDateRangeUpdate" class="w-9/12" />
        </h2>
        <PickStore @update:storeGroup="updateGroup" @update:storeType="updateType" @update:storeCd="updateCd"></pickStore>
      </div>
      <br>
      &nbsp;
      &nbsp;
      <ag-grid-vue :rowData="rowData" :columnDefs="colDefs" style="width: auto; height:660px"
        class="themeClass ag-theme-quartz" enableCharts="true" :selection="selection" :gridOptions="gridOptions"
        @grid-ready="onGridReady" :groupTotalRow="bottom" :suppressRowTransform="true"></ag-grid-vue>
  
    </div>
  </template>
  
  <script setup>
  // 가져온 날짜의 형식을 고치기 위해서 사용 ( 데이터가 yyyy-mm-dd T ~~~ 이런형태여서 T부터 자름)
  import { format } from 'date-fns';
  // 설치한 라이브러리로 만든 달력을 가져옴 ( 재사용 )
  import DateRangePicker from '../components/DateRangePicker.vue';
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
  import { useTabInfo } from '@/common/api/useTabInfo';
  // alert 창 자동 꾸미기 위한 라이브러리
  import Swal from 'sweetalert2';
  import { NIL } from 'uuid';
  
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
  // 셀병합 기능을 위한 변수
  const cellUnitedtf = ref(false);
  // 그리드 설정 값을 불러오기 위한 하드코딩
  const GridInfo_PROG_ID = "SLS06_004RPT_VUE_TEST";
  const GridInfo_GRID_ID = "1";
  // API 호출 (설정값 호출)
  const { tabInitSetArray } = useTabInfo(GridInfo_PROG_ID, GridInfo_GRID_ID);
  
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
  // 상세보기 눌렀을때 실행하는 함수
  const detailView = () => {
  
    detailViewtf.value = !detailViewtf.value;
    colDefs.value.forEach(col => {
      if (col.field == 'lngSalAmt' || col.field == 'lngDiscount' || col.field == 'lngVAT' || col.field == 'lngSupplyAmt') {
  
        col.hide = detailViewtf.value;
      }
    })
  
  }
  
  // 그리드 설정을 위한 속성 설정
  const gridOptions = {
    // 한글화
    localeText: AG_GRID_LOCALE_KR,
    // 소계 푸터 설정
    groupIncludeFooter: true,
    // 집계 함수명을 컬럼 헤더에 추가하지 않음
    suppressAggFuncInHeader: true,
    // 행의 스타일 설정
    
    // 그룹 행이 처음에 펼치게 설정
    groupDefaultExpanded: 1,
    // 그룹 행이 화면에 붙여있게 설정 
    suppressGroupRowsSticky: 'group',
    // 총계 행이 화면에 붙여있게 설정
    suppressStickyTotalRow: 'group',
    // 그룹 헤더가 스크롤 시 고정되지 않도록 설정
    suppressStickyLabel: true,
    // 전체 행의 높이 설정
    rowHeight: 20,
    // 최종 총합 행을 그리드의 하단에 표시
    grandTotalRow: 'bottom',
    // 그룹 행이 전체 행을 차지하지 않도록 설정
    groupUseEntireRow: false,
    // rowGroup : true 설정시에 추가로 singleColumn 나타나게 할건지 설정 .
    groupDisplayType: 'groupRows',
    groupSuppressBlankHeader : true ,

  }
  // 행이 생성될 컬럼을 설정 (field, headerName 등등)
  const colDefs = ref([]);
  
  const gridApi = ref(null);
  
  // 셀병합 실행함수 
  const rowGroupEnable = (event) => {
    if (!afterSearch.value) {
      alert('조회를 먼저해주세요.');
      event.preventDefault();
      return;
    }
  
    cellUnitedtf.value = !cellUnitedtf.value;
    colDefs.value.forEach(col => {
     
    });
  
    // 그리드 강제 새로고침 ( 없어도 작동함.)
    // gridApi?.value.refreshCells({force: true});
    // gridApi?.value.refreshCells();
  }
  
  // 그리드 가 생성될때 gridApi 값으로 해당 값을 저장함.
  const onGridReady = (params) => {
    gridApi.value = params.api;
  }
  //  저장된 데이터를 엑셀로 내보내기 함수
  const exportExcel = () => {
    gridApi.value.exportDataAsExcel();
  }
  // 조회 함수.
  const searchButton = () => {
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
      const response = await axios.post("http://211.238.145.43:3000/usp_AppDailySaleReportTest", {
        P_GROUP_CD: groupCd.value,
        P_STORE_CD: storeCd.value,
        P_START_DT: startDate.value,
        P_END_DT: endDate.value,
        P_REPORT_TYPE: '1',
        P_LANGUAGE: userData.strLanguage
      });
  
      const result = response.data.recordsets;
      updateColumn(result);
      afterSearch.value = true;
      store.dispatch("convertLoading", false);
    }
    readsales(); // 세팅된 함수 실행
    // 천단위 마다 쉼표 형식 지정
    const numberFormat = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  
    const updateColumn = (result) => {
      //스타일 태그로 동적으로 headerclass 생성 ( gridHeaderStyle 을 바로줄 수 있는 방법이 없음.)
      const styleTag = document.createElement("style");
      document.head.appendChild(styleTag);
      let column2 = [];
      let topHeaders = {};
      let count = 0 ;
  
      for (let i = 0; i < tabInitSetArray.value.length-1 ; i++) {
        const headerclass = `headerclass-${i}`;
        const hcolor = tabInitSetArray.value[i].strHdColor;
        const hbkcolor = tabInitSetArray.value[i].strHdBkColor;
        styleTag.innerHTML += `.${headerclass} {
            background-color : ${hbkcolor} !important;
            color : ${hcolor} !important ;
         
        }`
        
        // 컬럼마다의 값을 할당 밑은 조건에 해당할때 형식이나 값을 지정해줌.
       
         const column = {
          field: tabInitSetArray.value[i].strColID,
          headerName: tabInitSetArray.value[i].strHdText,
          width: tabInitSetArray.value[i].intHdWidth,
          headerClass: headerclass,
          editable : tabInitSetArray.value[i].strEdit === 'true' ? true : false,
          cellStyle : {
            textAlign : tabInitSetArray.value[i].strAlign ,
            backgroundColor : tabInitSetArray.value[i].strFontStyle != null ? tabInitSetArray.value[i].strFontStyle.split('/')[1] : 'white' ,
            fontSize : tabInitSetArray.value[i].strFontStyle != null ? tabInitSetArray.value[i].strFontStyle.split('/')[0]+'px' : '14px' ,
            fontWeight : tabInitSetArray.value[i].strFontStyle != null ? tabInitSetArray.value[i].strFontStyle.split('/')[2] : 'none' ,
          },
          lockPosition : tabInitSetArray.value[i].strHdFix === 'true' ? false : true ,
          rowSpan : rowSpan 
      }
    
  

    
     
  
  column2.push(column);
}
    
     
     
      rowData.value = result[0].map(item => ({
        strStoreGroupName: item.strStoreGroupName,
        dtmDate: item.dtmDate,
        strStore: item.strStore,
        strWeekName: item.strWeekName,
        strPhen: item.strPhen,
        lngRecCnt: item.lngRecCnt,
        lngRecAmt: item.lngRecAmt,
        lngCustCnt: item.lngCustCnt,
        lngCustAmt: item.lngCustAmt,
        lngSalAmt: item.lngSalAmt,
        lngActAmt: item.lngActAmt,
        lngDiscount: item.lngDiscount,
        lngVAT: item.lngVAT,
        lngSupplyAmt: item.lngSupplyAmt,
        dblDistRate: item.dblDistRate
      }));
  
      colDefs.value = column2;
      
    }
   
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

  const rowSpan = (params) => {
     
      let strstore = params.data ? params.data.strStore : '';
      if (strstore === '브레댄코(강남역점)') {
        return 4 ;
      } else {
        return 1 ;
      }
    }
  </script>
  
  <style>
  .themeClass {
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
    background-color: #c4cdf2;
   }
  </style>