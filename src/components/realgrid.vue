<template>
    <div id="realgrid" class="h-[100%] w-[100%]"></div>
</template>

<script setup>
import { getGridInfoList } from '@/api/common';
import { GridView, LocalDataProvider } from 'realgrid';
import { onMounted, ref, watch } from 'vue';

let gridView;
let dataProvider;
const currentSelectedMenuCode = ref('')

const props = defineProps({
  progname: {
    type: String,
    default: ""
  },
  progid: {
    type: Number,
    default: 0
  },
  rowData : {
    type : Array ,
  
  },
  showGrid : {
    type : Boolean ,
    default : () => []
  },
  showCheckBar : {
    type : Boolean ,
    default : false
  },
  searchWord : {
    type : String ,
    default : ''
  }
});
const GridInfo_PROG_ID = props.progname;
const GridInfo_GRID_ID = props.progid;
  // API 호출 (설정값 호출)
const tabInitSetArray = ref([]);
let styleContent = "";
onMounted(() => {
 
    (async () => {
    try {
     console.log(GridInfo_PROG_ID)
    console.log(GridInfo_GRID_ID)
    console.log("어ㅕㄴ제실행되냐")
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
        funcshowGrid()
    }
    })();
   
  

})

watch(() => props.showGrid, (newValue) => {
        funcshowGrid()
});


const selectedRowData = ref([])
const funcshowGrid = () => {
    
  if (gridView) {
    gridView.destroy();  // 기존 그리드 인스턴스 파괴
  }

  dataProvider = new LocalDataProvider();
  
  // 2. GridView 설정
  gridView = new GridView('realgrid');
  gridView.setDataSource(dataProvider);

  // 3. 필드 정의
  let fields = [];

  for(var i=0 ; i< tabInitSetArray.value.length ; i++) {
    fields.push({ fieldName : tabInitSetArray.value[i].strColID , dataType: 'text'})
  }
  dataProvider.setFields(fields);
  console.log(fields)

  // 4. 컬럼 정의
  let columns = [];

  for(var i=0 ; i< tabInitSetArray.value.length ; i++) {
    columns.push({ name : tabInitSetArray.value[i].strHdText , fieldName : tabInitSetArray.value[i].strColID ,
        header: { text: tabInitSetArray.value[i].strHdText , styleName : `header-style-`+i}
    })
  }
  console.log(columns)
  gridView.setColumns(columns);
  // 5. 샘플 데이터 추가
  dataProvider.setRows(props.rowData);
  gridView.sortMode = 'explicit';
  gridView.filterMode = 'explicit';
  gridView.setFooters({ visible: false})
  gridView.setRowIndicator({
    visible: true
  });
  gridView.setCheckBar({
    visible: props.showCheckBar,
  });
  gridView.displayOptions.fitStyle = "even";
  gridView.sortingOptions.enabled = true;
  
  gridView.commit();
  gridView.onCellEdited = function (grid, itemIndex, row, field) {
    // 데이터가 수정될 때 rows를 갱
    gridView.commit();
  
  // 이후 데이터 갱신 (필요시 rows를 업데이트)
 
  };
  

 
  gridView.onItemChecked = function (grid ,clickData){
    selectedRowData.value = []
    const index = gridView.getCheckedItems();
    for( var i =0 ; i< index.length ; i++ ){
      selectedRowData.value.push(dataProvider.getRows()[index[i]])
    }
   
    emit('selcetedrowData',selectedRowData.value)
  }

}

const emit = defineEmits(["selcetedrowData"])
watch(() => props.searchWord ,(newValue) => {
  console.log(props.rowData)
  console.log(newValue)
  if(newValue =='') {
    return ;
  }
  const newRowData = props.rowData.filter(item => item.strName.includes(newValue)  || item.lngStoreCode.toString().includes(newValue) )
  if ( newRowData.length >=1){
    dataProvider.setRows(newRowData)
  } else {
    dataProvider.setRows({})
  }
 
})

</script>

<style>

</style>