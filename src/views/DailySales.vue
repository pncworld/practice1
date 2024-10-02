<template>
    <div>
      <div class="flex justify-between items-center w-full">
    <h1 class="flex-grow text-center ml-24 text-2xl">일자별 매출 현황</h1>
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
   <br/>
        <div class="flex justify-between items-center">
    <h2 class="flex justify-start w-3/12">
    &nbsp;  &nbsp; &nbsp;<div class="items-center flex">일자</div> &nbsp;  &nbsp;
    <DateRangePicker @update:dateRange="handleDateRangeUpdate" class="w-9/12" />
    </h2> 
    
    <!-- <div><input type="checkbox" id="reportType" value="2" v-model="reportType"><label for="reportType"></label></div> -->
     <PickStore @update:storeGroup="updateGroup" @update:storeType="updateType" @update:storeCd="updateCd"></pickStore>
</div>
<br>
<div class="flex justify-start items-center ml-5 space-x-3"><div class="flex items-center">조회조건 &nbsp;&nbsp;&nbsp;</div>
<input type="checkbox" id="detail" @click="detailView"><label for="detail">상세보기</label></input>
<input type="checkbox" @click="rowGroupEnable($event)" id="cellUnite"><label for="cellUnite">셀병합</label></input>
</div>
&nbsp;
<!-- <div for="condition" class="flex justify-start">
  조회 조건 &nbsp; <input type="checkbox" value="1" id="condition"><label for="condition" >상세보기</label></input>
  &nbsp;&nbsp;<input type="checkbox" value="2" id="condition2"><label for="condition2" >셀병합</label></input>
</div> -->
&nbsp;
        <ag-grid-vue
   :rowData="rowData"
   :columnDefs="colDefs"
   style="width: auto; height:660px"
   class="themeClass ag-theme-quartz"
   enableCharts="true"
   :selection="selection"
   :gridOptions="gridOptions"
   @grid-ready = "onGridReady"
   groupTotalRow="bottom"
 </ag-grid-vue>

    </div>
</template>

<script setup>
import { format } from 'date-fns';
import DateRangePicker from '../components/DateRangePicker.vue';
import { computed, watch, ref } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';
import { AG_GRID_LOCALE_KR } from '@ag-grid-community/locale';
import PickStore from '@/components/pickStore.vue';
import { useTabInfo } from '@/common/api/useTabInfo';
import Swal from 'sweetalert2';
const store = useStore();
const selection = ref({ mode : "cell"});
const userData = store.state.userData; 
const rowData = ref([]);
const storeInfo = ref([]);
const reportType = ref(false);
const reportValue = computed(() => (reportType.value ? '2' : '1'));
const groupCd = ref(userData.lngStoreGroup);
const typeCd = ref();
const storeCd = ref();
const detailViewtf= ref(true);
const afterSearch= ref(false);
const cellUnitedtf= ref(false);
const GridInfo_PROG_ID = "SLS06_004RPT_VUE_TEST";
const GridInfo_GRID_ID = "1";
const { tabInitSetArray } =  useTabInfo(GridInfo_PROG_ID,GridInfo_GRID_ID) ;
const rowGroupEnabled = ref(false);


const updateGroup = (value) => {
  groupCd.value = value;
  
}
const updateType = (value) => {
  typeCd.value = value;
  
}
const updateCd = (value) => {
  storeCd.value = value ;
  
}
const detailView = () => {
  
  detailViewtf.value = !detailViewtf.value ;
  updateColumnVisibility();
 
}
const updateColumnVisibility= () => {
  colDefs.value.forEach(col => {
    if (col.field == 'lngSalAmt' || col.field == 'lngDiscount' || col.field == 'lngVAT' || col.field == 'lngSupplyAmt') {

    col.hide = detailViewtf.value ;
  }
  })
}
const gridOptions = {
    localeText : AG_GRID_LOCALE_KR,
    groupIncludeFooter : true ,
    // groupIncludeTotalFooter : false ,
    // 집계 함수명을 컬럼 헤더에 추가하지 않음
    suppressAggFuncInHeader: true,
    
    getRowStyle : (params) => {
  // 그룹 행인지 확인
  if (params.node.group) {
    // 그룹 행일 경우
    if (params.node.footer) {
      if (params.node.level === 0) {
        return { background: 'rgb(173, 216, 230)', fontWeight: 'bold' }; // 그룹 행에 대한 스타일
      } else {
        return { background: 'rgb(70, 130, 180)', fontWeight: 'bold' }; // 그룹 행에 대한 스타일
      }
      
    } else {
      return { background: 'white', fontWeight: 'bold'  }; // 그룹 행에 대한 스타일
    }
    
  } else {
    // 일반 행일 경우
    const rowIndex = params.node.rowIndex; // 현재 행 인덱스
    const isChildOfGroup = params.node.parent && params.node.parent.group; // 현재 노드가 그룹의 자식인지 확인

    if (isChildOfGroup) {
      // 그룹의 자식 행일 경우
      return rowIndex % 2 === 0 ? { background: '#FAF0E6' } : { background: 'white' }; // 그룹 자식 행의 스타일
    } else {
      // 일반 행에 대한 스타일
      return rowIndex % 2 === 0 ? { background: '#FAF0E6' } : {};
    }
  }
    },
    groupDefaultExpanded: 1,
    suppressGroupRowsSticky: 'group',
    suppressStickyTotalRow: 'group',
    suppressStickyLabel : true,
    rowHeight: 20,
    grandTotalRow: 'bottom',
    groupUseEntireRow: false,
    groupDisplayType : 'groupRows',
    autoGroupColumnDef: {
      headerName: '매장명', // 그룹화된 내용을 표시할 컬럼의 헤더,
      field: '', // 그룹을 나타낼 필드
      cellRenderer: (params) => {
      // if (params.node.footer && params.node.level == 0) {
      // // footer일 경우
      //  return '소계'; 
      // } else
       if (params.node.footer && params.node.level != 0) {
      // 일반 그룹화된 셀에는 원래 값 표시
      return "";
    } else {
      return params.value ;
    }
  },
      field: '', // 그룹을 나타낼 필드
      cellRendererParams: {
      valueGetter: (params) => {
      if (params.node.footer) {
        return '총합계'; 
      } else {
        return ''; // 일반 그룹화된 셀에는 원래 값 표시
      }
     },
     footerValueGetter: (params) => {
          if (params.node.footer) {
            return '총합계'; 
          } else {
            return ''; // 일반 그룹화된 셀에는 원래 값 표시
          }
        }
      },
      suppressCount: false
      },
  }
 // Column Definitions: Defines the columns to be displayed.
 const colDefs = ref([]);
 
 storeInfo.value.push({
  strStoreName : userData.strStoreName
 })
 const excelStyles = [{
              id: 'dateType',
        dataType: 'DateTime'
 }]
 const gridApi = ref(null);

  const rowGroupEnable = (event) => {
    if( !afterSearch.value) {
        alert('조회를 먼저해주세요.');
        event.preventDefault();
        return ;
    }
    //rowGroupEnabled.value = !rowGroupEnabled.value;
    colDefs.value[2].rowGroup = true;
    cellUnitedtf.value = !cellUnitedtf.value;
    gridOptions.groupDisplayType = 'groupRows'
    colDefs.value.forEach(col => {
    if (col.field === 'strStore') {
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


    gridApi?.value.refreshCells({force: true});
    gridApi?.value.refreshCells();
  }
 const onGridReady = (params) => {
    gridApi.value = params.api;
}
  const exportExcel = () => {
    gridApi.value.exportDataAsExcel();
  }
const searchButton = () => {
  const readsales = async() => {
    
    if(storeCd.value == undefined) {
      Swal.fire({
          icon: 'warning',
            title: '매장을 선택하세요!',
              text: '매장을 선택하지 않으면 진행할 수 없습니다.',
                confirmButtonText: '확인',
                  confirmButtonColor: '#3085d6',
      });
      return ;
    }
     store.dispatch("convertLoading",true);
     const response = await axios.post("http://211.238.145.43:3000/usp_AppDailySaleReportTest",{
        P_GROUP_CD : groupCd.value,
        P_STORE_CD : storeCd.value ,
        P_START_DT : startDate.value ,
        P_END_DT : endDate.value ,
        P_REPORT_TYPE : '1',
        P_LANGUAGE : userData.strLanguage
     });

     const result = response.data.recordsets ;
     updateColumn(result);
     afterSearch.value = true;
     store.dispatch("convertLoading",false);
  } 
  readsales();
  const numberFormat = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
  });
  
  const updateColumn = (result) => {
    //스타일 태그로 동적으로 headerclass 생성
    const styleTag = document.createElement("style");
    document.head.appendChild(styleTag);
    let column2 = [] ;
    for (let i = 0; i < tabInitSetArray.value.length; i++) {
     
      const headerclass = 'headerclass' ; 
      const hcolor = tabInitSetArray.value[i].strHdColor ;
      const hbkcolor = tabInitSetArray.value[i].strHdBkColor ;
      styleTag.innerHTML += `.${headerclass} {
          background-color : ${hbkcolor} !important;
          color : ${hcolor} !important ;
      }`
      const column = {
        field : tabInitSetArray.value[i].strColID ,
        headerName : tabInitSetArray.value[i].strHdText ,
        width : tabInitSetArray.value[i].intHdWidth ,
        headerClass: headerclass ,
        editable : tabInitSetArray.value[i].strEdit

      }
      
      if ( tabInitSetArray.value[i].strDisplay == 'number' ) {
        column.aggFunc = 'sum' 
        column.cellRenderer =(params) => {
   
       if (params.node.group && !params.node.footer) {
         return ''; 
      }
    
    return params.value !== undefined ? numberFormat.format(params.value) : '';
   }
      }

      if ( tabInitSetArray.value[i].strColID =='strStore') {
         column.rowGroup = true ;
      }
      if( tabInitSetArray.value[i].strColID =='lngSalAmt' || tabInitSetArray.value[i].strColID =='lngDiscount' || tabInitSetArray.value[i].strColID =='lngVAT' ||
         tabInitSetArray.value[i].strColID == 'lngSupplyAmt') {
          column.hide = true ;
      }
      if (tabInitSetArray.value[i].strDisplay == 'date') {
       
        column.valueGetter = (params) => {
          if ( params.node.footer && params.node.level == 0) {
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

      

      if ( tabInitSetArray.value[i].strColID =='strPhen') {
        column.valueGetter = (params) => {

        const weather = params.data?.strPhen;
              let result = '';
              if (weather =='Clear') {
                result = '맑음'
              } else if (weather =='Snow') {
                  result = '눈'
              }
              return `${result}`; // 날짜와 요일 반환
            }
      }
      if (tabInitSetArray.value[i].strColID == 'dblDistRate' ) {
        column.cellRenderer =  (params) => {
      // Check if it's a group row and not a footer
      if (params.node.group && !params.node.footer) {
      return ''; // Display nothing in the group row
   v }
    // For normal rows, display the actual data or an empty string if data is missing
    return params.value !== undefined ? Math.round(params.value * 10) /10 : '';
      }
    }
      
      column2.push(column);
      
    }
    const columns = [
        {field : 'strStore' , headerName : '매장명' ,headerClass : 'header-center' ,hide: cellUnitedtf.value, width: 150  ,valueGetter: (params) => {
          if(params.node.footer){
            const rowData = params.api.getDisplayedRowAtIndex(0).data;
            return rowData ? rowData.strStore : '총합계';
          } else {
            return params.data ? params.data.strStore : '';
          }
         } ,
        cellRenderer: (params) => {
                // 현재 행의 매장명
                if(rowGroupEnable.value){

                const currentStoreName = params.value;

                // 이전 행의 매장명
                const previousStoreName = params.node.rowIndex > 0 ? params.api.getDisplayedRowAtIndex(params.node.rowIndex - 1).data.strStore : null;

                // 같은 매장명인 경우 빈 문자열 반환
                return currentStoreName === previousStoreName ? '' : currentStoreName;
              } else {
                return params.value;
              }
            }
            , rowGroup: rowGroupEnable.value ,footerValueGetter: (params) => {
                if (params.node.footer) {
                    return `총합계`; // 그룹별 총합계
                }
                return params.value;
            } 
        },
        { headerName : '일자' , field: 'dtmDate' , cellClass:"dateType", width: 120 ,
         valueGetter: (params) => {
          const rowCount     = params.api.getDisplayedRowCount(); // 전체 행 개수
          // const lastRowIndex = rowCount - 1; // 마지막 행의 인덱스
          const soGyeIndex   = rowCount - 2;
          
          const checkbox = document.getElementById("cellUnite");
          if(checkbox.checked){
            if (params.node.rowIndex === soGyeIndex) {
                if(params.node.footer){
                  return '소계'; // 그룹 소계에서만 '소계' 표시
                }
            }
          } 
          const dateString = params.data?.dtmDate;
          if (!dateString) {
            return ''; // dtmDate가 없으면 빈 문자열 반환
          }
          // 날짜 문자열에서 시간 부분을 잘라내고 날짜만 반환
           const date = new Date(dateString);
            const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD 형식으로 변환

        return formattedDate; 
        }},
        { 
        headerName: '요일', 
        field: 'strWeekName', 
        cellClass: "String", width: 100   },
        { headerName : '날씨' , field: 'strPhen' ,cellClass: "String"
          , maxWidth: 100 ,valueGetter: (params) => {
              const weather = params.data?.strPhen;
              let result = '';
              if (weather =='Clear') {
                result = '맑음'
              } else if (weather =='Snow') {
                  result = '눈'
              }
              return `${result}`; // 날짜와 요일 반환
          }  
        },
        // {field : 'lngRecCnt' , headerName : "조수", maxWidth: 100 ,aggFunc :'sum' },
        // {field : 'lngRecAmt' , headerName : "조단가", maxWidth: 100 ,aggFunc :'sum'},
        // {field : 'lngCustCnt' , headerName : "객수", maxWidth: 100 ,aggFunc :'sum'},
        // {field : 'lngCustAmt' , headerName : "객단가", maxWidth: 100 ,aggFunc :'sum'},
        // {field : 'lngSalAmt' , headerName : "총매출액", maxWidth: 120,aggFunc :'sum', hide : detailViewtf.value },
        // {field : 'lngDiscount' , headerName : "할인액", maxWidth: 120 ,aggFunc :'sum', hide : detailViewtf.value},
        // {field : 'lngActAmt' , headerName : "실매출액", maxWidth: 120,aggFunc :'sum' },
        // {field : 'lngVAT' , headerName : "부가세", maxWidth: 120,aggFunc :'sum', hide : detailViewtf.value },
        // {field : 'lngSupplyAmt' , headerName : "순매출액", maxWidth: 120 ,aggFunc :'sum', hide : detailViewtf.value},
        {field : 'lngRecCnt' , headerName : "조수", width: 100 ,aggFunc : 'sum'  ,
        cellRenderer: (params) => {
    // Check if it's a group row and not a footer
    if (params.node.group && !params.node.footer) {
      return ''; // Display nothing in the group row
    }
    // For normal rows, display the actual data or an empty string if data is missing
    return params.value !== undefined ? numberFormat.format(params.value) : '';
  }
        },
        {field : 'lngRecAmt' , headerName : "조단가", width: 100 ,aggFunc :'sum',
        cellRenderer: (params) => {
    // Check if it's a group row and not a footer
    if (params.node.group && !params.node.footer) {
      return ''; // Display nothing in the group row
    }
    // For normal rows, display the actual data or an empty string if data is missing
    return params.value !== undefined ? numberFormat.format(params.value) : '';
  }},
        {field : 'lngCustCnt' , headerName : "객수", width: 100 ,aggFunc :'sum',
        cellRenderer: (params) => {
    // Check if it's a group row and not a footer
    if (params.node.group && !params.node.footer) {
      return ''; // Display nothing in the group row
    }
    // For normal rows, display the actual data or an empty string if data is missing
    return params.value !== undefined ? numberFormat.format(params.value) : '';
  }
        },
        {field : 'lngCustAmt' , headerName : "객단가", width: 100 ,aggFunc :'sum',
        cellRenderer: (params) => {
    // Check if it's a group row and not a footer
    if (params.node.group && !params.node.footer) {
      return ''; // Display nothing in the group row
    }
    // For normal rows, display the actual data or an empty string if data is missing
    return params.value !== undefined ? numberFormat.format(params.value) : '';
  }},
        {field : 'lngSalAmt' , headerName : "총매출액", width: 120,aggFunc :'sum'  ,hide :detailViewtf.value ,
        cellRenderer: (params) => {
    // Check if it's a group row and not a footer
    if (params.node.group && !params.node.footer) {
      return ''; // Display nothing in the group row
    }
    // For normal rows, display the actual data or an empty string if data is missing
    return params.value !== undefined ? numberFormat.format(params.value)  : '';
  }},
        {field : 'lngDiscount' , headerName : "할인액", width: 120  ,aggFunc :'sum',hide :detailViewtf.value ,
        cellRenderer: (params) => {
    // Check if it's a group row and not a footer
    if (params.node.group && !params.node.footer) {
      return ''; // Display nothing in the group row
    }
    // For normal rows, display the actual data or an empty string if data is missing
    return params.value !== undefined ? numberFormat.format(params.value) : '';
  }},
        {field : 'lngActAmt' , headerName : "실매출액", width: 120,aggFunc :'sum' ,  editable: true,
        cellRenderer: (params) => {
    // Check if it's a group row and not a footer
    if (params.node.group && !params.node.footer) {
      return ''; // Display nothing in the group row
    }
    // For normal rows, display the actual data or an empty string if data is missing
    return params.value !== undefined ? numberFormat.format(params.value) : '';
  }},
        {field : 'lngVAT' , headerName : "부가세", width: 120,aggFunc :'sum' ,hide :detailViewtf.value ,
        cellRenderer: (params) => {
    // Check if it's a group row and not a footer
    if (params.node.group && !params.node.footer) {
      return ''; // Display nothing in the group row
    }
    // For normal rows, display the actual data or an empty string if data is missing
    return params.value !== undefined ? numberFormat.format(params.value) : '';
  }},
        {field : 'lngSupplyAmt' , headerName : "순매출액", width: 120 ,aggFunc :'sum',hide :detailViewtf.value ,
        cellRenderer: (params) => {
    // Check if it's a group row and not a footer
    if (params.node.group && !params.node.footer) {
      return ''; // Display nothing in the group row
    }
    // For normal rows, display the actual data or an empty string if data is missing
    return params.value !== undefined ? numberFormat.format(params.value) : '';
  }},
        {field : 'dblDistRate' , headerName : "비율", width: 120 ,aggFunc :'sum' ,
        cellRenderer: (params) => {
    // Check if it's a group row and not a footer
    if (params.node.group && !params.node.footer) {
      return ''; // Display nothing in the group row
    }
    // For normal rows, display the actual data or an empty string if data is missing
    return params.value !== undefined ? Math.round(params.value * 10) /10 : '';
  }
        
        },
       
    ];
    rowData.value = result[0].map(item => ({
      strStoreGroupName : item.strStoreGroupName,
      dtmDate: item.dtmDate,
      strStore : item.strStore,
      strWeekName : item.strWeekName,
      strPhen : item.strPhen,
      lngRecCnt : item.lngRecCnt,
      lngRecAmt : item.lngRecAmt,
      lngCustCnt : item.lngCustCnt,
      lngCustAmt : item.lngCustAmt,
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
const startDate = ref(format(new Date(),'yyyy-MM-dd'));
const endDate = ref(format(new Date(),'yyyy-MM-dd'));

const handleDateRangeUpdate = (newDateRange) => {
  if(newDateRange){
  startDate.value=format(newDateRange[0] ,'yyyy-MM-dd');
  endDate.value =format(newDateRange[1] ,'yyyy-MM-dd');
  } else {
    startDate.value=null;
  endDate.value =null;
  }
  
};
</script>

<style>
.themeClass {
    --ag-foreground-color: rgb(0, 0, 0) !important;
    --ag-background-color: rgb(255, 255, 255);
    /* --ag-header-foreground-color: white !important;
    --ag-header-background-color: rgb(68, 68, 107) !important; */
    --ag-odd-row-background-color: rgb(0, 0, 0, 0.03);
    /* --ag-header-column-resize-handle-color: rgb(255, 255, 255) !important; */
    
    --ag-font-size: 12px !important;
    --ag-font-family: monospace;
    --ag-row-border-style: solid !important;
    --ag-row-border-width: 1px !important;
    --ag-row-border-color: rgb(228, 228, 228) !important;
    --ag-cell-horizontal-border: solid rgb(228, 228, 228) !important;
    /* --ag-row-height : 20px !important ; */
    --ag-cell-horizontal-padding : 5px !important;
}

.ag-group-footer {
    background-color: #C7B299; /* 원하는 배경색 */
    color: white; /* 원하는 글자색 */
}

/* 그룹 총합계의 배경색 및 글자색 변경 */
.ag-total-footer {
    background-color: #B29BC7; /* 원하는 배경색 */
    color: white; /* 원하는 글자색 */
}
/*  오버라이드를 통해서 가운데 헤더 정렬 */
.ag-header-cell-label {
  justify-content: center;
  margin-right : -20px;
}
</style>