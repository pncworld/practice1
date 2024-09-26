<template>
    <div>
        
        <h1>매출 취소 현황</h1>
        <h2 class="flex justify-start">날짜를 선택하세요.</h2> <button @click="exportToExcel">엑셀 내보내기</button>
        <DateRangePicker @update:dateRange="handleDateRangeUpdate"></DateRangePicker>

        <ag-grid-vue
   :rowData="rowData"
   :columnDefs="colDefs"
   style="height: 500px; width: auto;"
   class="ag-theme-quartz"
   @grid-ready = "onGridReady"
   enableCharts="true"
   :selection = "selection"
   :gridOptions="gridOptions"
   :statusBar="statusBar"
   :excelStyles="excelStyles"

 >
 </ag-grid-vue>

    </div>
</template>

<script setup>
import { format } from 'date-fns';
import DateRangePicker from '../components/DateRangePicker.vue';
import { ref } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';
import { AG_GRID_LOCALE_KR } from '@ag-grid-community/locale';
const store = useStore();
const selection = ref({mode : "cell"});
const userData = store.state.userData[0]; 
const rowData = ref([]);
const gridApi = ref(null);
const statusBar = ref({
    statusPanels : [
        { statusPanel: 'agTotalAndFilteredRowCountComponent' , headerName: '집계'},
        { statusPanel: 'agTotalRowCountComponent' , headerName: '총 행 수' },
        { statusPanel: 'agFilteredRowCountComponent', headerName: '집계' },
        { statusPanel: 'agSelectedRowCountComponent' , headerName: '집계'},
        { statusPanel: 'agAggregationComponent' , headerName: '집계'}
    ]
})
const onGridReady = (params) => {
    gridApi.value = params.api;
}
const excelStyles = [{
              id: 'dateType',
        dataType: 'DateTime'
 }]
const exportToExcel = () => {
    gridApi.value.exportDataAsExcel();
}
 // Column Definitions: Defines the columns to be displayed.
 const colDefs = ref([]);

 const gridOptions = {
    rowSelection:'multiple',
    localeText : AG_GRID_LOCALE_KR
 }
const handleDateRangeUpdate = (newDateRange) => {
   
  const readsales = async() => {
     const response = await axios.post("https://m.pncoffice.com/USP_AppTotalVoidSales",{
        P_GROUP_CD : userData[0].GROUP_CD ,
        P_STORE_CD : userData[0].STORE_CD ,
        P_START_DT : format(newDateRange[0] , 'yyyy-MM-dd') ,
        P_END_DT : format(newDateRange[1] ,'yyyy-MM-dd')
     });

     const result = response.data.recordsets ;
     updateColumn(result);
  
     
  } 
  readsales();
  
  const updateColumn = (result) => {
    const columns = [
        {field : 'strVoidName' ,headerName : '취소 분류' , headerStyle: { textAlign: 'center' }},
        { headerName : '취소 갯수' , field: 'lngCount' , headerStyle: { textAlign: 'center' }},
        { headerName : '취소 금액' , field: 'lngAmount' , headerStyle: { textAlign: 'center' }},
    ];
    rowData.value = result[0].map(item => ({
        strVoidName: item.strVoidName,
        lngCount: item.lngCount,
        lngAmount: item.lngAmount
    }));
    colDefs.value = columns;

  }
};
</script>