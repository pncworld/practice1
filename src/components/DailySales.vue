<template>
    <div>
        <h1>일자별 매출 조회</h1>
        <h2 class="flex justify-start">날짜를 선택하세요.</h2>
        <DateRangePicker @update:dateRange="handleDateRangeUpdate"></DateRangePicker>

        <ag-grid-vue
   :rowData="rowData"
   :columnDefs="colDefs"
   style="height: 500px; width: auto;"
   class="ag-theme-quartz"
 >
 </ag-grid-vue>
    </div>
</template>

<script setup>
import { format } from 'date-fns';
import DateRangePicker from './DateRangePicker.vue';
import { ref } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';

const store = useStore();

const userData = store.state.userData[0]; 
const rowData = ref([]);

 // Column Definitions: Defines the columns to be displayed.
 const colDefs = ref([]);
const handleDateRangeUpdate = (newDateRange) => {
   
  
  const readsales = async() => {
     const response = await axios.post("https://m.pncoffice.com/USP_AppTotalDailySales",{
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
        {field : 'dtmDate' , headerName : '일자'},
        { headerName : '객수/모수' , field: 'lngCustCnt'},
        {field : 'lngSalAmt' , headerName : "매출액"},
        {field : 'lngActAmt' , headerName : "실매출액"},
        {field : 'lngDiscountAmt' , headerName : "할인액"}
    ];
    rowData.value = result[0].map(item => ({
      dtmDate: item.dtmDate,
      lngCustCnt: `${item.lngCustCnt}/${item.lngRecCnt}`, // 예시로 가정된 필드
      lngSalAmt: item.lngSalAmt,
      lngActAmt: item.lngActAmt,
      lngDiscountAmt: item.lngDiscountAmt
    }));
    colDefs.value = columns;

  }
};
</script>