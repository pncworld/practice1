<template>
  <div>
  
    <div class="flex justify-start pl-4 pt-4">
                 <div class="flex justify-start"><h1 class="font-bold text-sm md:text-2xl w-32 md:w-48">
                  일자별 매출 현황
                 </h1><div class="flex justify-end space-x-2 absolute right-5"><button @click="searchButton" class="button search md:w-auto w-14">조회</button>
                
                  <button @click="exportExcel" class="button excel text-sm  md:w-auto w-14">엑셀</button>
                </div></div>
                  
                 </div>
    <br /><br />
    <div class="flex flex-col justify-between  space-x-5 bg-gray-200 rounded-lg h-20 items-center">
    <div class="flex justify-between items-center space-x-96 w-full">
      <div class="flex justify-between w-auto">
        <div class="items-center ml-5">일자 </div> 
        <DateRangePicker @update:dateRange="handleDateRangeUpdate" class="hidden md:flex" />
        <DateRangePicker @update:dateRange="handleDateRangeUpdate" class="block md:hidden w-5 z-10"/>
        <PickStore @update:storeGroup="updateGroup" @update:storeType="updateType" @update:storeCd="updateCd" class="block md:hidden w-32 absolute right-5"></pickStore>
      </div>
      <div>
      <PickStore @update:storeGroup="updateGroup" @update:storeType="updateType" @update:storeCd="updateCd" class="hidden md:flex"></pickStore>
       
      </div>
    </div>
    <br>
    <div class="flex justify-start items-center ml-5 space-x-3 w-full -mt-5">
      <div class="flex items-center">조회조건 &nbsp;&nbsp;&nbsp;</div>
      <input type="checkbox" id="detail" @click="detailView"><label for="detail">상세보기</label></input>
      <input type="checkbox" @click="rowGroupEnable($event)" id="cellUnite"><label for="cellUnite">셀병합</label></input>
    </div>
    </div>

    
    &nbsp;
    &nbsp;
    <ag-grid-vue :rowData="rowData" :columnDefs="colDefs" style="width: auto; height:660px"
      class="themeClass ag-theme-quartz" enableCharts="true" :selection="selection" :gridOptions="gridOptions"
      @grid-ready="onGridReady" groupTotalRow="bottom" </ag-grid-vue>

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
import { useTabInfo } from '@/api/common';
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
// 셀병합 기능을 위한 변수
const cellUnitedtf = ref(false);
// 그리드 설정 값을 불러오기 위한 하드코딩
const GridInfo_PROG_ID = "SLS06_004RPT_VUE_TEST";
const GridInfo_GRID_ID = "1";
// API 호출 (설정값 호출)
const tabInitSetArray = ref([]);
(async () => {
    try {
        const result = await useTabInfo(GridInfo_PROG_ID, GridInfo_GRID_ID);
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

// 그리드 설정을 위한 속성 설정
const gridOptions = {
  // 한글화
  localeText: AG_GRID_LOCALE_KR,
  // 소계 푸터 설정
  groupIncludeFooter: true,
  // 집계 함수명을 컬럼 헤더에 추가하지 않음
  suppressAggFuncInHeader: true,
  // 행의 스타일 설정
  getRowStyle: (params) => {
    // 그룹 행인지 확인
    if (params.node.group) {
      // 총계 혹은 소계 인지 확인
      if (params.node.footer) {
        if (params.node.level === 0) {
          return { background: 'rgb(173, 216, 230)', fontWeight: 'bold' }; // 소계 행에 대한 스타일
        } else {
          return { background: 'rgb(70, 130, 180)', fontWeight: 'bold' }; // 총계 행에 대한 스타일
        }

      } else {
        return { background: 'white', fontWeight: 'bold' }; // 그룹 행에 대한 스타일
      }

    } else {
      // 일반 행일 경우
      const rowIndex = params.node.rowIndex; // 현재 행 인덱스
      const isChildOfGroup = params.node.parent && params.node.parent.group; // 현재 노드가 그룹의 자식인지 확인

      if (isChildOfGroup) {
        // 그룹의 자식 행일 경우
        return rowIndex % 2 === 0 ? { background: '#FAF0E6' } : { background: 'white' };
      } else {
        // 일반 행에 대한 스타일
        return rowIndex % 2 === 0 ? { background: '#FAF0E6' } : {};
      }
    }
  },
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
  suppressRowTransform : true
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
    if (col.field === 'strStore') {
      // cellRenderer 가 그 보여주는 것을 설정 ( 실제 값은 남아있음.)
      col.cellRenderer = (params) => {
        // cellUnitedtf가 true일 때는 빈 문자열을 반환
        if (cellUnitedtf.value) {
          return ''; // 빈 문자열을 반환하여 셀을 비웁니다.
        } else {
          return params.value; // cellUnitedtf가 false일 경우 원래 값을 반환
        }
      };
    }
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
    const response = await dailySaleReport(
      groupCd.value,
      storeCd.value,
      startDate.value,
      endDate.value,
      userData.strLanguage
    );
    
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

    for (let i = 0; i < tabInitSetArray.value.length ; i++) {
      let TopHeader = tabInitSetArray.value[i].strColID == '' || tabInitSetArray.value[i].strColID == null ;
      const headerclass = `headerclass-${i}`;
      const hcolor = tabInitSetArray.value[i].strHdColor;
      const hbkcolor = tabInitSetArray.value[i].strHdBkColor;
      styleTag.innerHTML += `.${headerclass} {
          background-color : ${hbkcolor} !important;
          color : ${hcolor} !important ;
       
      }`
      
      // 컬럼마다의 값을 할당 밑은 조건에 해당할때 형식이나 값을 지정해줌.
      if (TopHeader) {
        topHeaders = {
        headerName: tabInitSetArray.value[i].strHdText, 
        headerClass : headerclass ,
        children: [] 
        }
        count = tabInitSetArray.value[i].intHdColspan ;
      } else {
       const column = {
        field: tabInitSetArray.value[i].strColID,
        headerName: tabInitSetArray.value[i].strHdText,
        width: tabInitSetArray.value[i].intHdWidth,
        headerClass: headerclass,
        editable : tabInitSetArray.value[i].strEdit === 'true' ? true : false,
        cellStyle : {
          textAlign : tabInitSetArray.value[i].strAlign
        },
        lockPosition : tabInitSetArray.value[i].strHdFix === 'true' ? false : true ,
        flex : isMobile && (tabInitSetArray.value[i].strColID =='dtmDate' || tabInitSetArray.value[i].strColID =='lngActAmt') ? 2 : 1 ,
        hide : isMobile && (tabInitSetArray.value[i].strColID =='strPhen' || tabInitSetArray.value[i].strColID =='strStore' ||tabInitSetArray.value[i].strColID =='strWeekName' )
        // 콤보박스 설정
        // cellEditor: 'agRichSelectCellEditor',
        // cellEditorParams: {
        //     values: ['매장1', '매장2', '매장3', '매장4', '매장5'],
        // }
      }
      if (tabInitSetArray.value[i].strTotalexpr != null && tabInitSetArray.value[i].strTotalexpr.split('(')[0].includes('sum')) {
          column.aggFunc = 'sum'
      } else if (tabInitSetArray.value[i].strTotalexpr != null && tabInitSetArray.value[i].strTotalexpr.includes('/')) {

       
        // 2. '/'을 기준으로 lngActAmt와 lngRecCnt를 나눔
        const divendColumn = tabInitSetArray.value[i].strTotalexpr.split('"')[1]
        const divColumn = tabInitSetArray.value[i].strTotalexpr.split('"')[3]
      
        //결국엔 하드코딩밖에 안됨. // 테이블에 값을 바꾸는 방법 밖에는 없음. ag grid 형식으로 
        // let divendColumn = tabInitSetArray.value[i].strTotalexpr.split('/')[1];
        // let divColumn = tabInitSetArray.value[i].strTotalexpr.split('/')[2];

         column.valueGetter = (params) => {
         
          if( params.node.footer && params.node.level != 0 ) {
            const totalLng2 = params.node.allLeafChildren.reduce((sum, childNode) => {
            return sum + (childNode.data[divendColumn] || 0); // lng2의 합계
           }, 0);

           const totalLng1 = params.node.allLeafChildren.reduce((sum, childNode) => {
            return sum + (childNode.data[divColumn] || 0); // lng1의 합계
          }, 0);
         
          // lng1으로 나누기. totalLng1이 0이 아닐 때만 나누기
             let result = 0 ;
             if(tabInitSetArray.value[i].strSubSumexpr.includes('round')) {
                  const loc = tabInitSetArray.value[i].strSubSumexpr.match(/(\d+)\s*\)/);
                  result = (totalLng2 / totalLng1).toFixed(loc[0]);
             }
            return totalLng1 !== 0 ? result : 0; // 0으로 나눌 경우를 방지
           } else if (params.node.footer && params.node.level == 0 ) {
            if(tabInitSetArray.value[i].strSubSumexpr != '' && tabInitSetArray.value[i].strSubSumexpr != null && tabInitSetArray.value[i].strSubSumexpr.includes('/')) {

              const insideRound = tabInitSetArray.value[i].strSubSumexpr.split('(')[1].split(')')[0]; // 'lngActAmt/lngRecCnt, 0'
             
          // 2. '/'을 기준으로 lngActAmt와 lngRecCnt를 나눔
            const divendColumn = insideRound.split(',')[0].split('/')[0]
            const divColumn = insideRound.split(',')[0].split('/')[1]
             
              const totalLng2 = params.node.allLeafChildren.reduce((sum, childNode) => {
              return sum + (childNode.data[divendColumn] || 0); // lng2의 합계
             }, 0);

              const totalLng1 = params.node.allLeafChildren.reduce((sum, childNode) => {
              return sum + (childNode.data[divColumn] || 0); // lng1의 합계
             }, 0);

        // lng1으로 나누기. totalLng1이 0이 아닐 때만 나누기
               let result = 0 ;
             if(tabInitSetArray.value[i].strSubSumexpr.includes('round')) {
               const loc = tabInitSetArray.value[i].strSubSumexpr.match(/(\d+)\s*\)/);
                result = (totalLng2 / totalLng1 ).toFixed(loc[0]);
             }
            return totalLng1 !== 0 ? result : 0; // 0으로 나눌 경우를 방지
            } else {
              const totalLng2 = params.node.allLeafChildren.reduce((sum, childNode) => {
              return sum + (childNode.data[divendColumn] || 0); // lng2의 합계
           }, 0);

           const totalLng1 = params.node.allLeafChildren.reduce((sum, childNode) => {
            return sum + (childNode.data[divColumn] || 0); // lng1의 합계
          }, 0);

           // lng1으로 나누기. totalLng1이 0이 아닐 때만 나누기
            return totalLng1 !== 0 ? totalLng2 / totalLng1 : 0; // 0으로 나눌 경우를 방지
            }
           
           } 
              return params.data[tabInitSetArray.value[i].strColID] ;
           
            
          
        }
    // 0으로 나누는 것을 방지하기 위한 처리
      
  
}
// if (tabInitSetArray.value[i].intSuppress == '1') {
//   column.cellRenderer = (params) => {
//     const currentRowIndex = params.node.rowIndex;
//     console.log(params.data)
//     const currentValue = params.data[tabInitSetArray.value[i].strColID];

//     if (currentRowIndex === 0) {
//       return currentValue; // 첫 번째 행은 기본값 표시
//     }

//     const previousRowData = params.api.getDisplayedRowAtIndex(currentRowIndex - 1).data || {};
  
//     const previousValue = previousRowData[tabInitSetArray.value[i].strColID];

//     // 중복된 셀은 빈 셀로 표시 (숨기기)
//     if (currentValue === previousValue) {
//       return ''; // 값이 중복되면 빈 셀을 반환
//     }

//     return currentValue;
//   };

//   column.cellStyle = (params) => {
//     if(params.data != undefined) {
//     const currentRowIndex = params.node.rowIndex;
//     const currentValue = params.data[tabInitSetArray.value[i].strColID];
    
//     if (currentRowIndex === 0) {
//       return {}; // 첫 번째 행은 기본 스타일 적용
//     }

//     const previousRowData = params.api.getDisplayedRowAtIndex(currentRowIndex - 1).data || {};
//     const previousValue = previousRowData[tabInitSetArray.value[i].strColID];

//     if (currentValue === previousValue) {
//       // 셀 경계선 없애기
//       return {
//         display: 'none', // 셀 숨기기
//         borderBottom : 'none' ,
//         borderTop : 'none' ,
//       };
//     }

//     return {}; // 기본 스타일
//   };
// }
// }
        
      
      // 금요일 조단가 avg pncoffice랑 다른 부분 수정 
      if (tabInitSetArray.value[i].strDisplay == 'number') {
        
        column.cellRenderer = (params) => {
          if (params.node.group && !params.node.footer) {
            return '';
          }
          return params.value !== undefined ? numberFormat.format(params.value) : '';
        }
      }

      if (tabInitSetArray.value[i].strColID == 'strStore') {
        column.rowGroup = true;
        column.cellRenderer = (params) => {
          // cellUnitedtf가 true일 때는 빈 문자열을 반환
          if (cellUnitedtf.value) {
            return ''; // 빈 문자열을 반환하여 셀을 비웁니다.
          } else {
            return params.value; // cellUnitedtf가 false일 경우 원래 값을 반환
          }
        };
      }
      if (tabInitSetArray.value[i].strColID == 'lngSalAmt' || tabInitSetArray.value[i].strColID == 'lngDiscount' || tabInitSetArray.value[i].strColID == 'lngVAT' ||
        tabInitSetArray.value[i].strColID == 'lngSupplyAmt') {
        column.hide = detailViewtf.value;
      }
      if (tabInitSetArray.value[i].strDisplay == 'date') {

        column.valueGetter = (params) => {
          if (params.node.footer && params.node.level == 0) {
            return tabInitSetArray.value[i].strSubSumtext; // 그룹 소계에서만 '소계' 표시
          } else if (params.node.footer && params.node.level != 0) {
            return '총합계'
          }
          const dateString = params.data?.dtmDate;
          if (!dateString) {
            return ''; // dtmDate가 없으면 빈 문자열 반환
          }
          // 날짜 문자열에서 시간 부분을 잘라내고 날짜만 반환
          const date = new Date(dateString);
          const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD 형식으로 변환
          return formattedDate;
        }
      }


      if (tabInitSetArray.value[i].strColID == 'strPhen') {
          column.valueGetter = (params) => {
          const weather = params.data?.strPhen;
          let result = '';
          if (weather == 'Clear') {
            result = '맑음'
          } else if (weather == 'Snow') {
            result = '눈'
          }
          return `${result}`; // 날짜와 요일 반환
        }
      }
      if (tabInitSetArray.value[i].strColID == 'dblDistRate') {
        column.cellRenderer = (params) => {
          if (params.node.group && !params.node.footer) {
            return ''; 
          }
          return params.value !== undefined ? Math.round(params.value * 10) / 10 : '';
        }
      }
      // column2로 값을 전달해서 이 값으로 rowData와 맞추기 위해서 설정
      
      if ( tabInitSetArray.value[i].intHdColspan == '1' && topHeaders.children.length <= count -1 ) {
        topHeaders.children.push(column);
      } else if ( tabInitSetArray.value[i].intHdColspan != '1' && topHeaders.children && topHeaders.children.length == count ) {
        column2.push(topHeaders);
        count ++; 
        column2.push(column);
      } else {
        column2.push(column);
      }
     
      
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