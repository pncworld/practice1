<template>
  <div :id="realgridname" class="h-[100%] w-[100%]"></div>
</template>

<script setup>
import { getGridInfoList, getRenderingData } from '@/api/common';
import { GridView, LocalDataProvider } from 'realgrid';
import { onMounted, ref, watch, nextTick } from 'vue';
import { v4 as uuidv4 } from 'uuid';
let gridView;
let dataProvider;
/*
  사용법 progname => SQL mstgridInfo 에 저장된 설정값 가져오는 부분
  사용법 progid => SQL mstgridInfo 에 저장된 설정값 가져오는 부분
  rowData => 실제 데이터 입력 부분
  showGrid => 변수로 그리드를 보여주거나 안 보여주게 설정
  showCheckBar => 변수로 그리드 내의 체크바를 보여주거나 안 보여주게 설정
  searchWord => 변수로 그리드 내의 데이터에서 검색어로 조회할 수 있게 설정 
  searchColId => 검색하려는 필드명 ( 예)strName,SubName) , 로 나눠서 해당 필드들을 함께 조회 가능
  addRow => true false로 값이 변할때마다 행을 추가 
  deleteRow =>  true false로 값이 변할때마다 행을 삭제 
*/
const props = defineProps({
  progname: {
    type: String,
    default: "",
  },
  progid: {
    type: Number,
    default: 0,
  },
  rowData: {
    type: Array,
    default: () => [],
  },
  showGrid: {
    type: Boolean,
    default: false,
  },
  showCheckBar: {
    type: Boolean,
    default: false,
  },
  searchWord: {
    type: String,
    default: "",
  },
  renderProgname: {
    type: String,
    default: "",
  },
  searchColId: {
    type: String,
    default: "",
  },
  addRow: {
    type: Boolean,
    default: false,
  },
  deleteRow: {
    type: Boolean,
    default: false,
  },
  editableColId: {
    type: String,
    default: '',
  },
  changeColid: {
    type: String,
    default: '',
  },
  changeRow: {
    type: Number,
    default: '',
  },
  changeValue: {
    type: String,
    default: '',
  },
  rowStateeditable: {
    type: Boolean,
    default: true,
  },
  addRow2: {
    type: Boolean,
    default: true,
  },
  addrowProp: {
    type: String,
    default: true,
  },
  addrowDefault: {
    type: String,
    default: true,
  },
  reload: {
    type: Boolean,
    default: false,
  },
  fixedColumn: {
    type: Boolean,
    default: false,
  },
  mergeColumns: {
    type: Boolean,
    default: false,
  },
  mergeColumnGroupName: {
    type: String,
    default: '',
  },
  mergeColumnGroupSubList: {
    type: String,
    default: '',
  },
  exporttoExcel: {
    type: Boolean,
    default: false,
  },
  ExcelNm: {
    type: String,
    default: false,
  },
  deleteAll: {
    type: Boolean,
    default: false,
  },
  commitAll: {
    type: Boolean,
    default: false,
  }
});

const realgridname = ref(`realgrid-${props.progname}-${props.progid}-${uuidv4()}`); // 동적 ID 설정
const tabInitSetArray = ref([]);
const selectedRowData = ref([]);
const result2 =ref([]) ;
const updatedrowData = ref([])
const emit = defineEmits(["selcetedrowData" , "updatedRowData" , "clickedRowData"]);
const funcshowGrid = async () => {
  // 그리드 초기화
  console.log(gridView)

  if (gridView !=undefined && gridView !=null ) {
    gridView.destroy(); // 기존 그리드 인스턴스 제거
    dataProvider.clearRows();
  }else {

  }

  dataProvider = new LocalDataProvider();
  
  // nextTick으로 DOM 업데이트 후 초기화
  await nextTick();

  const container = document.getElementById(realgridname.value);
  if (!container) {
    console.error(`Invalid grid container element: ${realgridname.value}`);
    return;
  }

  gridView = new GridView(container);
  gridView.setDataSource(dataProvider);

  // 필드 정의
  const fields = tabInitSetArray.value.map(item => ({
    fieldName: item.strColID,
    dataType : item.strColID.includes('checkbox') ? 'boolean' : 'text',
  }));
  fields.push({fieldName: "deleted", dataType: "boolean" })
  dataProvider.setFields(fields);

  // 컬럼 정의
  const columns = tabInitSetArray.value.map((item, index) => ({
    name: item.strHdText,
    fieldName: item.strColID,
    header: {
      text: item.strHdText,
      styleName: `header-style-${index}`,
      checkLocation : item.strColID.includes('checkbox') ? 'left' : 'none'
    },
    width: item.intHdWidth,
    visible: item.intHdWidth !== 0,
    renderer : { type : item.strColID =='add' ? 'button' :  item.strColID.includes('checkbox') ? 'check' : 'text'
     },
    styleCallback: function(grid, dataCell){
      var ret = {}
   
      if((dataCell.item.rowState == 'created' || dataCell.item.itemState == 'appending' || dataCell.item.itemState == 'inserting') && props.rowStateeditable){
        ret.editable = true;
      } else if (item.strColID == props.editableColId ) {
        ret.editable = true
      } else {
        ret.editable = false
      }
 
      return ret;
    }
  }));
 
  gridView.setColumns(columns);

console.log(props.mergeColumns)
if(props.mergeColumns == true ) {

    const subList = props.mergeColumnGroupSubList.split(','); // subList 분리
const layout1 = []; // 최종 결과 배열
let groupItems = null; // 그룹 아이템을 담을 객체

tabInitSetArray.value.forEach((item,index) => {
  const uniqueColumnName = item.strHdText
  if (!layout1.some(layout => layout.column === uniqueColumnName)) {
  if (subList.includes(item.strColID)) {
    // subList에 포함된 값들로 그룹을 만듭니다.
    if (!groupItems) {
      groupItems = {
        name: props.mergeColumnGroupName, // 예시로 "companyGroup" 사용
        direction: "horizontal",
        items: [],
        header: {
          text: props.mergeColumnGroupName,
          styleName: `header-style-0`
        },
      };
    }
    groupItems.items.push(item.strHdText); // 그룹에 항목 추가
  } else {
    layout1.push({    
     column : item.strHdText ,
     header: {visible: true, text: item.strHdText},
     visible: item.intHdWidth !== 0 ,
    width: item.intHdWidth}); 
  }
  // 완벽한 해결이 아닌 것 같아서 추후에 에러날 가능성 존재
  } else {
      layout1.push({    
       column : item.strColID,
       header: {visible: true, text: item.strHdText},
       visible: item.intHdWidth !== 0 ,
       width: item.intHdWidth});
  }


});

// 그룹이 존재하면 layout1에 추가
if (groupItems) {
  layout1.unshift(groupItems); // layout1의 첫 번째에 그룹 객체를 추가
}
console.log(layout1)
gridView.setColumnLayout(layout1)
    
}
  
  // 데이터 추가
  dataProvider.setRows(props.rowData);
  
 
  // 기타 옵션
  gridView.setFooters({ visible: false });
  gridView.setRowIndicator({ visible: true });
  gridView.setCheckBar({ visible: props.showCheckBar });
  gridView.displayOptions.fitStyle = 'even';
  gridView.sortingOptions.enabled = true;
  //gridView.editOptions.editable = false;
  gridView.editOptions.updatable = true;
  gridView.editOptions.deletable = true 
  gridView.displayOptions.fitStyle = props.fixedColumn == false ? 'even' : "none";
  dataProvider.softDeleting = true;
  dataProvider.deleteCreated = true;
  dataProvider.autoCommit = true; // 자동 커밋 활성화

  
  for (let i = dataProvider.getRowCount() - 1; i >= 0; i--) { // 역순으로 순회
  const rowData = dataProvider.getJsonRow(i);
  if (rowData.deleted) {
    dataProvider.removeRow(i); // 해당 행 삭제
  
  }
}

  // 이벤트 설정
  gridView.onCellEdited = () => gridView.commit();
  gridView.onItemChecked = () => {

    selectedRowData.value = gridView.getCheckedItems().map(index => dataProvider.getRows()[index]);
    emit('selcetedrowData', selectedRowData.value);
  };
  gridView.onItemAllChecked = (grid, checked) => {
    selectedRowData.value = gridView.getCheckedItems().map(index => dataProvider.getRows()[index]);
    emit('selcetedrowData', selectedRowData.value);
  };


   dataProvider.onDataChanged = function (provider) {

     updatedrowData.value = [ ...dataProvider.getJsonRows()]

     emit('updatedRowData', updatedrowData.value )


   };



  gridView.onCellItemClicked = function (grid, clickData) {
 
  if (clickData.itemIndex == undefined) {
    return ;
  }
  selectedRowData.value= dataProvider.getRows()[clickData.itemIndex];
  emit('selcetedrowData', selectedRowData.value);
}

gridView.onCellClicked = function (grid, clickData) {
  if (clickData.itemIndex == undefined) {
    return ;
  }
  selectedRowData.value= dataProvider.getRows()[clickData.itemIndex];
  selectedRowData.value.index = clickData.itemIndex
  emit('clickedRowData', selectedRowData.value);
 
}

gridView.onColumnCheckedChanged = function (grid, col, chk) {
     var rowCount = dataProvider.getRowCount();  // 전체 행의 개수
     console.log(rowCount)
     for (var i = 0; i < rowCount; i++) {
      dataProvider.setValue(i, col.fieldName, chk);  // 
     }
   
     console.log(col.fieldName + "was checked as: " + chk);
};

}

watch(() => props.changeValue , () => {
  console.log(props.changeRow)
  console.log(props.changeColid)
  console.log(props.changeValue)
    dataProvider.setValue(props.changeRow, props.changeColid, props.changeValue);

    updatedrowData.value = [ ...dataProvider.getJsonRows()]
     console.log(updatedrowData.value );
     emit('updatedRowData', updatedrowData.value )
})

watch(() => props.addRow, (newVal) => {
  gridView.commit();
  var values = {add: "추가" , sort: '매장용'};
  var dataRow = dataProvider.addRow(values);
  gridView.setCurrent({dataRow: dataRow});
  console.log(dataProvider.getJsonRows())
});


watch(() => props.addRow2, (newVal) => {
  gridView.commit();
  const properties = props.addrowProp.split(',')
  const value = props.addrowDefault.split(',')
  let values = {};
  for(var i= 0 ; i< properties.length ; i++){
    values[properties[i]] = value[i]
  }
  var dataRow = dataProvider.addRow(values);
  gridView.setCurrent({dataRow: dataRow});
  console.log(dataProvider.getJsonRows())
});
watch(() => props.deleteRow, (newVal) => {
    gridView.commit();
    const curr = gridView.getCurrent(); // 현재 선택된 셀 또는 행 정보를 가져옴
    if (curr && curr.dataRow >= 0) {
      // 현재 데이터 행이 유효한 경우
      dataProvider.setValue(curr.dataRow, "deleted", true); // "deleted" 속성을 true로 설정
      dataProvider.removeRow(curr.dataRow);
    } else {
      console.warn("선택된 행이 없습니다.");
    }

    updatedrowData.value = [ ...dataProvider.getJsonRows()]
     emit('updatedRowData', updatedrowData.value )
  
});

watch(() => props.deleteAll, (newVal) => {
  gridView.commit();
  const allRows = dataProvider.getJsonRows();

// Mark all rows as deleted (if needed)
  allRows.forEach((row, index) => {
  dataProvider.setValue(index, "deleted", true); // Optionally mark them as deleted
  dataProvider.removeRow(index);
});


// Update the row data after deletion
updatedrowData.value = [...dataProvider.getJsonRows()];

// Emit the updated row data
emit('updatedRowData', updatedrowData.value);
});

watch(() => props.commitAll, (newVal) => {

  if(dataProvider.getRowCount() > 0){
    gridView.commit();
  }
 
 
});
watch(() => props.exporttoExcel, (newVal) => {
    gridView.exportGrid({
      type: "excel",
      target: "local",
      fileName: props.ExcelNm+".xlsx", 
      showProgress: true,
      progressMessage: "엑셀 Export중입니다.",
      indicator: true,
      header: true,
      footer: true,
      compatibility: true,
    })
  
});


onMounted(async () => {
  try {
    if(props.renderProgname != ''){

     // result2.value = await getRenderingData(props.renderProgname)
    }
    const result = await getGridInfoList(props.progname, props.progid);
    tabInitSetArray.value = result;

    // 동적 스타일 생성
    let styleContent = '';
    tabInitSetArray.value.forEach((item, index) => {
      styleContent += `
        .header-style-${index} {
          background-color: ${item.strHdBkColor} !important;
          color: ${item.strHdColor} !important;
        }
      `;
    });
    document.head.insertAdjacentHTML('beforeend', `<style>${styleContent}</style>`);

    await funcshowGrid();
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
});
watch(() => props.reload , (newValue) => {
  setupGrid()
})

const setupGrid = async () => {
  try {
    if (props.renderProgname !== "") {
      // Uncomment this if needed
      // const result2 = await getRenderingData(props.renderProgname);
    }

    const result = await getGridInfoList(props.progname, props.progid);
    tabInitSetArray.value = result;

    // Dynamic style generation
    let styleContent = "";
    tabInitSetArray.value.forEach((item, index) => {
      styleContent += `
        .header-style-${index} {
          background-color: ${item.strHdBkColor} !important;
          color: ${item.strHdColor} !important;
        }
      `;
    });
    document.head.insertAdjacentHTML("beforeend", `<style>${styleContent}</style>`);

    await funcshowGrid();
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
};
// watch(() => props.showGrid, () => funcshowGrid());
watch(() => props.searchWord, (newValue) => {
  const searchColId2 = props.searchColId.split(',')
  console.log(searchColId2)
  if (newValue === '') {
    dataProvider.setRows( props.rowData );
    return ;
  };
  const filteredData = props.rowData.filter(
    item => 
  {
     
    return searchColId2.some(colId => {
      console.log(item)
      console.log(colId)
      const value = item[colId].toString() || '';
      console.log(value)
      console.log(newValue)
      return value.toLowerCase().includes(newValue.toString().toLowerCase())
    })
  }
  );
  console.log(filteredData)
  dataProvider.setRows(filteredData.length ? filteredData : []);
});
watch(() => props.rowData, () => funcshowGrid());
</script>

<style scoped>
/* 동적 스타일이 삽입되므로 추가 스타일 정의는 필요 없음 */
</style>
