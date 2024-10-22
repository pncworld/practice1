<template>
 
    <div class="ag-theme-alpine" style="height: 400px; width: 650px;">
      <div class="flex justify-center">매장명 : <input type="text" placeholder="매장명 입력" class="border border-stone-600" v-model="quickFilterText"  @input="onInput"></div>
      <br>
      <ag-grid-vue
        class="ag-theme-alpine custom-grid"
        :columnDefs="columnDefs"
        :rowData="rowData"
         suppressRowClickSelection='false' rowSelection="multiple" rowMultiSelectWithClick='true'
        :defaultColDef="defaultColDef"
        @grid-ready="onGridReady"
        @selection-changed="onSelectionChanged"
        :quickFilterText="quickFilterText"
        :gridOptions="gridOptions"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, shallowRef, watch } from 'vue';
  import 'ag-grid-community/styles/ag-grid.css';
  import 'ag-grid-community/styles/ag-theme-alpine.css';
  import { AgGridVue } from 'ag-grid-vue3';

  import { useStore } from 'vuex';
  import { AG_GRID_LOCALE_KR } from '@ag-grid-community/locale';
  
  const store = useStore();
  const quickFilterText = ref('');
  const gridOptions = {
  // 한글화
  localeText: AG_GRID_LOCALE_KR,
  }
  let gridApi = shallowRef();
  let gridColumnApi = ref(null);
  
  // 컬럼 정의
  const columnDefs = ref([
    { 
      headerCheckboxSelection: true, // 헤더에 체크박스 추가
      checkboxSelection: true,       // 각 행에 체크박스 추가    
      width : 60 ,
      suppressSizeToFit: true  
    },
    { field: 'lngStoreGroup', headerName: '매장그룹', sortable: true,  width: 90 , getQuickFilterText : (params) => {
      return '';
    },
      cellRenderer : (params) => {
        const currentValue = params.value;

        const matchedItem = store.state.storeGroup.find(item => item.lngStoreGroup == currentValue);
        
        return matchedItem ? matchedItem.strName : ''  ;
      }
    },
    { field: 'strName', headerName: '매장명', sortable: true,  width: 220 , filter:true},
    { field: 'lngStoreAttr', headerName: '직/가맹', sortable: true , width:70 ,  getQuickFilterText : (params) => {
      return '';
    },cellRenderer : (params) => {
        const currentValue = params.value;
     
        const matchedItem = store.state.storeType.find(item => item.lngStoreAttr == currentValue);

        return matchedItem != undefined ? matchedItem.strName : '미지정' ;
      }},
    { field: 'lngTeamCode', headerName: '수퍼바이저팀', sortable: true , width: 100 ,  getQuickFilterText : (params) => {
      return '';
    },cellRenderer : (params) => {
        const currentValue = params.value;

        const matchedItem = store.state.storeTeamCode.find(item => item.lngTeamCode == currentValue);

        return matchedItem ? matchedItem.strTeamName : '' ;
      } },
    { field: 'lngSupervisor', headerName: '수퍼바이저',  getQuickFilterText : (params) => {
      return '';
    },sortable: true, width: 100 ,
       cellRenderer : (params) => {
        const currentValue = params.value;

        const matchedItem = store.state.storeSupervisor.find(item => item.lngSupervisor == currentValue);
        
        return matchedItem ? matchedItem.strName : '' ;
      }
    },
   
  ]);
  
  // 예시 데이터
  const rowData = ref([]);
  rowData.value = store.state.storeCd;
  // 기본 컬럼 설정
  const defaultColDef = ref({
    minWidth: 20,
    resizable: true,
    suppressMenu : true ,

  });



  
  const onGridReady = (params) =>{
    gridApi.value = params.api;

  }
  const onInput =(event) => {
    const inputText = event.target.value;
    quickFilterText.value = inputText;
  }
 

 
  const props = defineProps({
     storeType: String ,
     radioSelect :  Boolean ,
     storeSupervisor : Number ,
  
  })

  const emit = defineEmits(['storeCd','storeName'])


  watch(() => [props.storeType , props.radioSelect , props.storeSupervisor] , ([newStoreType, newRadioSelect, newSupervisor]) => {
    if(newRadioSelect ==false) {
      if (newStoreType == '0') {
        rowData.value = store.state.storeCd
      } else {

      rowData.value = store.state.storeCd.filter( item => item.lngStoreAttr == newStoreType)
    }
    } else {
      if ( newSupervisor =='0') {
        rowData.value = store.state.storeCd
      } else {
      rowData.value = store.state.storeCd.filter( item => item.lngSupervisor == newSupervisor)
    }
    }
    
  }) 

  const onSelectionChanged = (params) => {
    const selectedNodes = params.api.getSelectedNodes();
    const selectedStoreCode = selectedNodes.map(node => node.data.lngStoreCode);
    const selectedstoreName = selectedNodes.map(node => node.data.strName);
    emit('storeCd' , "'"+selectedStoreCode.join(',')+"'"); 
    emit('storeName' ,  selectedNodes.length > 1? selectedstoreName[0] +'외 '+(selectedNodes.length-1)+'건' : selectedstoreName[0]); 
  }

  
  </script>
  
  <style scoped>
  /* AG Grid Alpine 테마 스타일을 사용합니다. */
  .ag-theme-alpine {
    height: 100%;
    width: 100%;
    --ag-row-height : 20px !important ; 
  }
  .ag-header-cell-label {
   justify-content: left !important ;
   margin-right: -5px !important;
 } 
 
  .custom-grid{
    --ag-font-size: 11px !important;
  }
  </style>
  