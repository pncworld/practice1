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
      <input type="checkbox" @click="cellUnited()" id="cellUnite"><label for="cellUnite">셀병합</label></input>
    </div>
    </div>

    
    &nbsp;
    &nbsp;
   
    <div id="realgrid" style="width: 100%; height: 400px;"></div>
  </div>
</template>

<script setup>

// 가져온 날짜의 형식을 고치기 위해서 사용 ( 데이터가 yyyy-mm-dd T ~~~ 이런형태여서 T부터 자름)
import { format } from 'date-fns';
// 설치한 라이브러리로 만든 달력을 가져옴 ( 재사용 )
import DateRangePicker from '@/components/DateRangePicker.vue';
// 뷰에서 제공 하는 기능, computed 반응형 상태를 기반으로 다른 로직을 실행해 결과값을 생성 , ref 반응형 변수 선언

// vuex에서 제공하는 중앙 상태관리 
import { useStore } from 'vuex';
// api 호출 함수
import axios from 'axios';
// 그리드 한글화에 필요한 라이브러리
import { AG_GRID_LOCALE_KR } from '@ag-grid-community/locale';
// 로그인한 사용자에 따라 법인명 매장명 등을 선택할 수 있게  만든 공통 컴포넌트 
import PickStore from '@/components/pickStore.vue';
// 각 탭 마다 필요한 그리드 설정 속성 불러오기
import { getGridInfoList } from '@/api/common';
// alert 창 자동 꾸미기 위한 라이브러리
import Swal from 'sweetalert2';
import { dailySaleReport } from '@/api/misales';
import { onMounted, ref } from 'vue';
import { GridView, LocalDataProvider } from 'realgrid';


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
let styleContent = "";
const tabInitSetArray = ref([]);
(async () => {
    try {
        const result = await getGridInfoList(GridInfo_PROG_ID, GridInfo_GRID_ID);
        tabInitSetArray.value = result; 

        tabInitSetArray.value.forEach((item, index) => {
       styleContent += `
    .header-style-${index} {
      background-color: ${item.strHdBkColor} !important;
      color: ${item.strHdColor} !important;
    }
  `;
});

    } catch (error) {
        console.error("Failed to fetch data:", error); // 오류 로그 출력
    } finally {
      console.log(tabInitSetArray.value)
      const styleTag = document.createElement("style");
styleTag.appendChild(document.createTextNode(styleContent));
document.head.appendChild(styleTag);
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


const rows = ref([]);
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

//  저장된 데이터를 엑셀로 내보내기 함수
const exportExcel = () => {
  gridApi.value.exportDataAsExcel();
}
// 조회 함수.
const searchButton = () => {
  clickedUnited.value = false
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
    
    rows.value = response.data.dailySales;

    console.log(rows.value)
    afterSearch.value = true;
    fetchDataAndRenderGrid()
    store.dispatch("convertLoading", false);
  }
  readsales(); // 세팅된 함수 실행
  // 천단위 마다 쉼표 형식 지정
}

let gridView;
let dataProvider;
const dulpicatedrows = ref()
const fetchDataAndRenderGrid = () => {
  if (gridView) {
    gridView.destroy();  // 기존 그리드 인스턴스 파괴
  }
  // 1. DataProvider 설정
  dataProvider = new LocalDataProvider();
  
  // 2. GridView 설정
  gridView = new GridView('realgrid');
  gridView.setDataSource(dataProvider);

  // 3. 필드 정의
  const fields = [
    { fieldName: 'strStore', dataType: 'text' },
    { fieldName: 'dtmDate', dataType: 'datetime' , datetimeFormat :"yyyy-MM-dd" },
    { fieldName: 'strWeekName', dataType: 'text' },
    { fieldName: 'strPhen', dataType: 'text' },
    { fieldName: 'lngRecCnt', dataType: 'number' },
    { fieldName: 'lngRecAmt', dataType: 'number' },
    { fieldName: 'lngCustAmt', dataType: 'number' },
    { fieldName: 'lngCustCnt', dataType: 'number' },
    { fieldName: 'lngSalAmt', dataType: 'number' },
    { fieldName: 'lngDiscount', dataType: 'number' },
    { fieldName: 'lngActAmt', dataType: 'number' },
    { fieldName: 'lngVAT', dataType: 'number' },
    { fieldName: 'lngSupplyAmt', dataType: 'number' },
    { fieldName: 'dblDistRate', dataType: 'number' },
  
  ];
  dataProvider.setFields(fields);

  let isAllSelected = false; // 전체 선택 상태를 저장

  // 4. 컬럼 정의
  const columns = [
    { name: '매장명', fieldName: 'strStore', width: tabInitSetArray.value[0].intHdWidth
    , header: { text: '매장명' ,
    styleName : 'header-style-0'
     } },
    { name: '일자', fieldName: 'dtmDate', width: tabInitSetArray.value[1].intHdWidth, header: { text: '일자'  ,
    styleName : 'header-style-1'
    } , datetimeFormat :"yyyy-MM-dd" , groupFooter: {
      text: "소계",
  
    } },
    { name: '요일', fieldName: 'strWeekName', width: tabInitSetArray.value[2].intHdWidth, header: { text: '요일',
    styleName : 'header-style-2' } },
    { name: '날씨', fieldName: 'strPhen', width: tabInitSetArray.value[3].intHdWidth, header: { text: '날씨',
    styleName : 'header-style-3' } },
    { name: '조수', fieldName: 'lngRecCnt', width: tabInitSetArray.value[4].intHdWidth, numberFormat : '#,##0',  header: { text: '조수',
    styleName : 'header-style-4' } ,
    footer: {
      text: "합계",
      expression: "sum",
      numberFormat : '#,##0'
    } , groupFooter: {
      expression: "sum",
      numberFormat: "#,##0",
    }},
    { name: '조단가', fieldName: 'lngRecAmt', width: tabInitSetArray.value[5].intHdWidth, numberFormat : '#,##0', header: { text: '조단가' ,
    styleName : 'header-style-5' },footer: {
      text: "합계",
      expression: "avg",
      numberFormat : '#,###.0'
    } , groupFooter: {
      expression: "avg",
      numberFormat: "#,##0",
    }},
    { name: '객수', fieldName: 'lngCustAmt', width: tabInitSetArray.value[6].intHdWidth, numberFormat : '#,##0', header: { text: '객수' ,
    styleName : 'header-style-6' } ,footer: {
      text: "합계",
      expression: "sum",
      numberFormat : '#,##0'
    } , groupFooter: {
      expression: "sum",
      numberFormat: "#,##0",
    }},
    { name: '객단가', fieldName: 'lngCustCnt', width: tabInitSetArray.value[7].intHdWidth, numberFormat : '#,##0', header: { text: '객단가' ,
    styleName : 'header-style-7' } ,footer: {
      text: "합계",
      expression: "sum",
      numberFormat : '#,##0'
    } , groupFooter: {
      expression: "sum",
      numberFormat: "#,##0",
    } },
    { name: '총매출액', fieldName: 'lngSalAmt', width: tabInitSetArray.value[8].intHdWidth, numberFormat : '#,##0', header: { text: '총매출액' ,
    styleName : 'header-style-8'} ,footer: {
      text: "합계",
      expression: "sum",
      numberFormat : '#,##0'
    } , groupFooter: {
      expression: "sum",
      numberFormat: "#,##0",
    }},
    { name: '할인액', fieldName: 'lngDiscount', width: tabInitSetArray.value[9].intHdWidth, numberFormat : '#,##0', header: { text: '할인액',
    styleName : 'header-style-9' } ,footer: {
      text: "합계",
      expression: "sum",
      numberFormat : '#,##0'
    }, groupFooter: {
      expression: "sum",
      numberFormat: "#,##0",
    }},
    { name: '실매출액', fieldName: 'lngActAmt', width: tabInitSetArray.value[10].intHdWidth, numberFormat : '#,##0', header: { text: '실매출액',
    styleName : 'header-style-10' },footer: {
      text: "합계",
      expression: "sum",
      numberFormat : '#,##0'
    } , groupFooter: {
      expression: "sum",
      numberFormat: "#,##0",
    }},
    { name: '부가세', fieldName: 'lngVAT', width: tabInitSetArray.value[11].intHdWidth,numberFormat : '#,##0', header: { text: '부가세' ,
    styleName : 'header-style-11'},footer: {
      text: "합계",
      expression: "sum",
      numberFormat : '#,##0'
    }, groupFooter: {
      expression: "sum",
      numberFormat: "#,##0",
    } },
    { name: '순매출액', fieldName: 'lngSupplyAmt', width: tabInitSetArray.value[12].intHdWidth, numberFormat : '#,##0', header: { text: '순매출액',
    styleName : 'header-style-12' } ,footer: {
      text: "합계",
      expression: "sum",
      numberFormat : '#,##0'
    } , groupFooter: {
      expression: "sum",
      numberFormat: "#,##0",
    }},
    { name: '비율', fieldName: 'dblDistRate', width: tabInitSetArray.value[13].intHdWidth,numberFormat : '#.0', header: { text: '비율' ,
    styleName : 'header-style-13' } ,footer: {
      text: "합계",
      expression: "sum",
      numberFormat : '#,##0'
    }, groupFooter: {
      expression: "sum",
      numberFormat: "#,##0",
    }},
    
  ];
  gridView.setColumns(columns);
  gridView.groupBy(["strStore"]);
  gridView.setRowGroup({ mergeMode: false , expandedAdornments: "footer" });
  // 5. 샘플 데이터 추가
  dulpicatedrows.value = rows.value; 
  dataProvider.setRows(rows.value);
  gridView.sortMode = 'explicit';
  gridView.filterMode = 'explicit';
  gridView.setRowIndicator({
    visible: false
  });
  gridView.setCheckBar({
    visible: false,
  });
  gridView.displayOptions.fitStyle = "even";
  gridView.sortingOptions.enabled = true;
  

  gridView.onCellEdited = function (grid, itemIndex, row, field) {
    // 데이터가 수정될 때 rows를 갱
    gridView.commit();
  
  // 이후 데이터 갱신 (필요시 rows를 업데이트)
    rows.value = dataProvider.getRows();
 
  };
};
//그룹화된 상위 라벨 없애는 방법?
const clickedUnited = ref(false)
const cellUnited = () => {
  if ( clickedUnited.value == false) {
    gridView.setRowGroup({ mergeMode: true , expandedAdornments: "footer" });
  } else {
    gridView.setRowGroup({ mergeMode: false , expandedAdornments: "footer" });
  }
 clickedUnited.value = !clickedUnited.value
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

</style>