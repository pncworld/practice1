<template>
  <div>
    <div class="flex items-center w-full space-x-10">
      <h1 class="flex-grow text-center ml-72 text-xl">마스터자동다운로드 등록 </h1>
      <div class="flex justify-end space-x-10 pr-16">
        <button class="flex justify-center" @click="searchButton">
          조회
        </button>
        <button class="flex justify-center" @click="saveButton">
          저장
        </button>
        <button class="flex justify-center" @click="deleteButton">
          삭제
        </button>
      </div>
    </div>
    <br />
    <div class="space-x-0 flex justify-start items-center w-full ml-14">
      <div class="items-center w-3/12 justify-start flex whitespace-nowrap">매장 : &nbsp;&nbsp;<select
          class="border border-gray-800 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-48 h-8 text-xs"
          v-model="storeCd" @change="getPosNo">
          <option value="0">전체</option>
          <option v-for="item in stores" :key="item.id" :value="item.lngStoreCode">{{ item.strName }}</option>
        </select>
      </div>
      <div class="items-center w-3/12 whitespace-nowrap">포스번호 : <select
          class="border  border-gray-800 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-48 h-8 text-xs"
          v-model="posNo" @change="getAreaCd">
          <option value="0">전체</option>
          <option v-for="item in posNos" :key="item.id" :value="item.lngCode">{{ item.strName }}</option>
        </select></div>
      <div class="items-center w-3/12 whitespace-nowrap">지역 : <select
          class="border  border-gray-800 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-48 h-8 text-xs"
          v-model="lngAreaCd">
          <option value="0">전체</option>
          <option v-for="item in areaCd" :key="item.id" :value="item.lngCode">{{ item.strName }}</option>
        </select></div>
      <div class="items-center flex space-x-5 w-2/12">
        <div class="whitespace-nowrap">적용일:</div>
        <DateRangePicker2 @update:selectedDate="handleDateRangeUpdate" />
      </div>
    </div>
    <div class="flex justify-start ">
      <div class="flex-grow basis-1/5">
        <ag-grid-vue :rowData="rowData" :columnDefs="colDefs" style="width: auto; height:700px"
          class="themeClass ag-theme-quartz" suppressRowClickSelection='false' rowSelection="multiple"
          rowMultiSelectWithClick='true' :gridOptions="gridOptions" @row-selected="onCellClicked"
          @grid-ready="onGridReady" @cell-clicked="onCellClicked"> </ag-grid-vue>
      </div>
      <div class="flex-grow basis-3/5">
        <ag-grid-vue :rowData="rowData2" :columnDefs="colDefs2" style="width: auto; height:700px"
          class="themeClass ag-theme-quartz" suppressRowClickSelection='false' rowSelection="multiple"
          rowMultiSelectWithClick='true' :gridOptions="gridOptions" @grid-ready="onGridReady2"> </ag-grid-vue>
      </div>
    </div>
  </div>
</template>

<script setup>
// 가져온 날짜의 형식을 고치기 위해서 사용 ( 데이터가 yyyy-mm-dd T ~~~ 이런형태여서 T부터 자름)
import { format } from 'date-fns';
// 설치한 라이브러리로 만든 달력을 가져옴 ( 재사용 )
// 뷰에서 제공 하는 기능, computed 반응형 상태를 기반으로 다른 로직을 실행해 결과값을 생성 , ref 반응형 변수 선언
import { computed, ref } from 'vue';
// vuex에서 제공하는 중앙 상태관리 
import { useStore } from 'vuex';
// api 호출 함수
import axios from 'axios';
// 그리드 한글화에 필요한 라이브러리
//import { AG_GRID_LOCALE_KR } from '@ag-grid-community/locale';
// 로그인한 사용자에 따라 법인명 매장명 등을 선택할 수 있게  만든 공통 컴포넌트 
import PickStore from '@/components/pickStore.vue';
// 각 탭 마다 필요한 그리드 설정 속성 불러오기
import { getGridInfoList } from '@/api/common';
// alert 창 자동 꾸미기 위한 라이브러리
import Swal from 'sweetalert2';
import DateRangePicker2 from '@/components/DateRangePicker2.vue'

import { get_area, get_ins_list1, get_ins_list2, get_pos, master_delete, master_save } from '@/api/master';

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
const storeCd = ref(0);
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
    const result = await getGridInfoList(GridInfo_PROG_ID, GridInfo_GRID_ID);
    tabInitSetArray.value = result;
  } catch (error) {
    console.error("Failed to fetch data:", error); // 오류 로그 출력
  } finally {

  }
})();
const stores = ref([]);
const rowData2 = ref([])
const lngAreaCd = ref(0);

const defaultColDef = ref({
  sortable: false, // 모든 열의 정렬 비활성화
  // 필요한 다른 기본 속성 추가
});
stores.value = store.state.storeCd;
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

// 행이 생성될 컬럼을 설정 (field, headerName 등등)
const colDefs = ref([]);
const colDefs2 = ref([]);

const gridApi = ref(null);
const gridApi2 = ref(null);

const posNos = ref([]);
const getPosNo = async () => {
  store.dispatch("convertLoading", true);
  const response = await get_pos(groupCd.value, storeCd.value);

  const result = response.data.recordsets[0];

  posNos.value = result
  posNo.value = '0'
  lngAreaCd.value = '0'
  store.dispatch("convertLoading", false);
}
const posNo = ref(0);
const areaCd = ref(0);
const getAreaCd = async () => {
  store.dispatch("convertLoading", true);
  const response = await get_area(groupCd.value, storeCd.value, posNo.value);
  const result = response.data.recordsets[0];

  areaCd.value = result
  lngAreaCd.value = '0'
  store.dispatch("convertLoading", false);
}
// 그리드 가 생성될때 gridApi 값으로 해당 값을 저장함.
const onGridReady = (params) => {
  gridApi.value = params.api;
}
const onGridReady2 = (params) => {
  gridApi2.value = params.api;
}
//  저장된 데이터를 엑셀로 내보내기 함수
const exportExcel = () => {
  gridApi.value.exportDataAsExcel();
}

const searchStoreCd = (selectedStoreCd) => {

  storeCd.value = selectedStoreCd;
}
// 조회 함수.
const searchButton = () => {
  const readsales = async () => {
    store.dispatch("convertLoading", true);
    const response = await get_ins_list1('2', '94');

    const response2 = await get_ins_list2(groupCd.value, storeCd.value, lngAreaCd.value, posNo.value, selectedDate.value)

    const result = response.data.recordsets[0];
    const result2 = response2.data.recordsets[0];

    updateColumn(result)
    updateColumn2(result2)
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


    for (let i = 0; i < tabInitSetArray.value.length; i++) {
      const headerclass = `headerclass-${i}`;
      const hcolor = tabInitSetArray.value[i].strHdColor;
      const hbkcolor = tabInitSetArray.value[i].strHdBkColor;
      styleTag.innerHTML += `.${headerclass} {
            background-color : ${hbkcolor} !important;
            color : ${hcolor} !important ;
         
        }`

      // 컬럼마다의 값을 할당 밑은 조건에 해당할때 형식이나 값을 지정해줌.



      const column1 = [{
        headerName: 'No',
        width: 40,
        valueGetter: (params) => params.node.rowIndex + 1, // 1부터 시작하는 순번
        cellStyle: { textAlign: 'center' }, // 가운데 정렬
      }, {
        field: 'lngTableID',
        headerName: '테이블ID',
        width: '100px',
        cellStyle: {
          textAlign: 'right'
        },
      }, {
        field: 'strTitle',
        headerName: '항목',
        width: '180px',
        cellStyle: {
          textAlign: 'left'
        },
      }, {
        field: 'check1',
        headerName: '수신여부',
        width: '100px',
        cellStyle: { display: 'flex', justifyContent: 'center', alignItems: 'center' }, // 가운데 정렬
        checkboxSelection: true,
        cellRenderer: () => '',
        headerCheckboxSelection: true
      }
      ]

      rowData.value = result.map(item => ({
        lngTableID: item.lngTableID,
        strTitle: item.strTitle,
        lngCheck: item.lngCheck,
      }));

      colDefs.value = column1;

    }
  }

  const updateColumn2 = (result) => {
    //스타일 태그로 동적으로 headerclass 생성 ( gridHeaderStyle 을 바로줄 수 있는 방법이 없음.)
    const styleTag = document.createElement("style");
    document.head.appendChild(styleTag);

    for (let i = 0; i < tabInitSetArray.value.length; i++) {
      const headerclass = `headerclass-${i}`;
      const hcolor = tabInitSetArray.value[i].strHdColor;
      const hbkcolor = tabInitSetArray.value[i].strHdBkColor;
      styleTag.innerHTML += `.${headerclass} {
            background-color : ${hbkcolor} !important;
            color : ${hcolor} !important ;
         
        }`

      // 컬럼마다의 값을 할당 밑은 조건에 해당할때 형식이나 값을 지정해줌.



      const column1 = [{
        headerName: 'No',
        width: 40,
        valueGetter: (params) => params.node.rowIndex + 1, // 1부터 시작하는 순번
        cellStyle: { textAlign: 'center' }, // 가운데 정렬
      },
      {
        field: 'check',
        headerName: '수신구분',
        width: '100px',
        checkboxSelection: true,
        cellRenderer: () => '',
        headerCheckboxSelection: true,
        cellStyle: { display: 'flex', justifyContent: 'center', alignItems: 'center' }, // 가운데 정렬

      }
        , {
        field: 'dtmDate',
        headerName: '수신예정일',
        width: '100px',
        cellStyle: {
          textAlign: 'center'
        },
        cellRenderer: (params) => {
          return new Date(params.value).toLocaleDateString('ko-KR').replace(/\.\s/g, '-').replace('.', '').trim()
        }
      }, {
        field: 'lngTableID',
        headerName: '수신코드',
        width: '50px',
        cellStyle: {
          textAlign: 'left'
        },
      },
      {
        field: 'strTableName',
        headerName: '항목',
        width: '130px',
        cellStyle: {
          textAlign: 'left'
        },
      },
      {
        field: 'lngStoreCode',
        headerName: '매장코드',
        width: '90px',
        cellStyle: {
          textAlign: 'center'
        },
      },
      {
        field: 'strStoreName',
        headerName: '매장명',
        width: '130px',
        cellStyle: {
          textAlign: 'left'
        },
      },
      {
        field: 'lngAreaCode',
        headerName: '매장구역',
        width: '100px',
        cellStyle: {
          textAlign: 'center'
        },
      },
      {
        field: 'intPosNO',
        headerName: '포스번호',
        width: '100px',
        cellStyle: {
          textAlign: 'right'
        },
      }
      ]

      rowData2.value = result.map(item => ({
        lngTableID: item.lngTableID,
        lngStoreCode: item.lngStoreCode,
        lngCheck: item.lngCheck,
        dtmDate: item.dtmDate,
        strTableName: item.strTableName,
        strStoreName: item.strStoreName,
        lngAreaCode: item.lngAreaCode,
        intPosNO: item.intPosNO,
      }));

      colDefs2.value = column1;

    }
  }
}
const saveButton = async () => {
  if (!afterSearch.value) {
    Swal.fire("조회부터 시작해주세요")
    return;
  }
  if (gridApi.value.getSelectedRows().length == 0) {
    Swal.fire('체크박스 선택이 안되었습니다.')
    return;
  }

  store.dispatch("convertLoading", true);
  const selectedRows = gridApi.value.getSelectedRows();
  const selectedrows = ref('');
  for (let i = 0; i < selectedRows.length; i++) {
    selectedrows.value += selectedRows[i].lngTableID
    selectedrows.value += ','

  }

  selectedrows.value = selectedrows.value.substring(0, selectedrows.value.length - 1);

  const response = await master_save(groupCd.value, storeCd.value, lngAreaCd.value, posNo.value, selectedrows.value, selectedDate.value)

  store.dispatch("convertLoading", false);
  if (response.status == '200') {
    Swal.fire('저장 되었습니다.')
  }
  searchButton();

}
const deleteButton = async () => {
  if (!afterSearch.value) {
    Swal.fire("조회부터 시작해주세요")
    return;
  }
  if (gridApi2.value.getSelectedRows().length == 0) {
    Swal.fire('체크박스 선택이 안되었습니다.')
    return;
  }

  const selectedRows = gridApi2.value.getSelectedRows();
  const selectedrows = ref('');
  const selectedstoreCd = ref('');
  const selectedAreaCd = ref('');
  const selectedPosNo = ref('');
  for (let i = 0; i < selectedRows.length; i++) {
    selectedrows.value += selectedRows[i].lngTableID
    selectedrows.value += ','
    selectedstoreCd.value += selectedRows[i].lngStoreCode
    selectedstoreCd.value += ','
    selectedAreaCd.value += selectedRows[i].lngAreaCode
    selectedAreaCd.value += ','
    selectedPosNo.value += selectedRows[i].intPosNO
    selectedPosNo.value += ','
  }

  selectedrows.value = selectedrows.value.substring(0, selectedrows.value.length - 1);
  selectedstoreCd.value = selectedstoreCd.value.substring(0, selectedstoreCd.value.length - 1);
  selectedAreaCd.value = selectedAreaCd.value.substring(0, selectedAreaCd.value.length - 1);
  selectedPosNo.value = selectedPosNo.value.substring(0, selectedPosNo.value.length - 1);

  store.dispatch("convertLoading", true);
  const response = await master_delete(groupCd.value, selectedstoreCd.value, selectedAreaCd.value, selectedPosNo.value, selectedrows.value, selectedDate.value
  )
  if (response.status == '200') {
    Swal.fire('삭제 되었습니다.')
  }

  store.dispatch("convertLoading", false);
  searchButton();
}


// 달력 초기 설정값 지정을 위한 변수 설정
const selectedDate = ref(new Date().toLocaleDateString('ko-KR').replace(/\.\s/g, '-').replace('.', '').trim());
const handleDateRangeUpdate = (newDate) => {
  selectedDate.value = newDate.toLocaleDateString('ko-KR').replace(/\.\s/g, '-').replace('.', '').trim();

};
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
  --ag-row-height: 20px !important;
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
  justify-content: center !important;
  margin-right: -20px !important;
}


.cell-span {
  background-color: brown;
}
</style>