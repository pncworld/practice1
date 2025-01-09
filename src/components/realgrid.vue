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
  },
  inputOnlyNumberColumn: {
    type: String,
    default: "",
  }
  ,
  dragOn: {
    type: Boolean,
    default: false,
  }
  ,
  notsoftDelete: {
    type: Boolean,
    default: false,
  }
  ,
  searchColId2: {
    type: String,
    default: '',
  }
  ,
  searchColValue2: { // 숫자로만 오게
    type: String,
    default: '',
  }
  ,
  addRow3: { // 숫자로만 오게
    type: Boolean,
    default: true,
  }
  ,
  selectionStyle: { // 숫자로만 오게
    type: String,
    default: 'block',
  }
  ,
  initFocus: { // 숫자로만 오게
    type: Boolean,
    default: false,
  }
  ,
  addRow4: { // 숫자로만 오게
    type: Boolean,
    default: false,
  }
  ,
  deleteRow2: { // 숫자로만 오게
    type: Boolean,
    default: false,
  }
  ,
  addField: { // 숫자로만 오게
    type: String,
    default: '',
  }
 
});

const realgridname = ref(`realgrid-${props.progname}-${props.progid}-${uuidv4()}`); // 동적 ID 설정
const tabInitSetArray = ref([]);
const selectedRowData = ref([]);
const result2 =ref([]) ;
const deletedIndex =ref() ;
const addrow4activated =ref(false) ;
const deleted2activated =ref(false) ;
const updatedrowData = ref([])
const selectedindex = ref(-1)
const emit = defineEmits(["selcetedrowData" , "updatedRowData" , "clickedRowData" ,"dblclickedRowData" ,"selectedIndex" ]);
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
  if(props.addField == 'new'){
    fields.push({fieldName: "new", dataType: "boolean" })
  }
 


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
    editor: {
    type: 'line', 
    inputCharacters: item.strColID == props.inputOnlyNumberColumn ? '0123456789' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_ㄱ-힣!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~ '
  },
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
  gridView.editOptions.commitByCell = true;
  gridView.editOptions.commitWhenLeave = true;
  dataProvider.softDeleting = (props.notsoftDelete == false ? true : false);
  dataProvider.deleteCreated = true;
  dataProvider.autoCommit = true; // 자동 커밋 활성화
  dataProvider.commitBeforeDataEdit = true
  gridView.editOptions.movable = (props.dragOn == true ? true : false)
  gridView.displayOptions.selectAndImmediateDrag = (props.dragOn == true ? true : false)
  gridView.displayOptions.selectionStyle = props.selectionStyle 

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
  
     gridView.commit();
     updatedrowData.value = [ ...dataProvider.getJsonRows()]
   
     emit('updatedRowData', updatedrowData.value )
     
  };
 

 
  gridView.onCellItemClicked = function (grid, clickData) {
  
  if (clickData.itemIndex == undefined) {
    return ;
  }
  selectedRowData.value= dataProvider.getRows()[clickData.itemIndex];
  emit('selcetedrowData', selectedRowData.value);
  emit('selectedIndex' ,clickData.itemIndex )
}

gridView.onCellClicked = function (grid, clickData) {
 
  if (clickData.itemIndex == undefined) {
    return ;
  }
  selectedRowData.value= dataProvider.getRows()[clickData.itemIndex];
  selectedRowData.value.index = clickData.itemIndex
  emit('clickedRowData', selectedRowData.value);
  emit('selectedIndex' ,clickData.itemIndex )
  selectedindex.value = clickData.itemIndex
   console.log(selectedindex.value)
}

gridView.onColumnCheckedChanged = function (grid, col, chk) {
  
     var rowCount = dataProvider.getRowCount();  // 전체 행의 개수
     console.log(rowCount)
     for (var i = 0; i < rowCount; i++) {
      dataProvider.setValue(i, col.fieldName, chk);  // 
     }
   
     console.log(col.fieldName + "was checked as: " + chk);
};

gridView.dataDropOptions.callback = function (source, sourceItems, target, targetItem) {
    const provider = gridView.getDataSource();
    const sourceStartIndex = sourceItems[0];
    const sourceCount = sourceItems.length;

    const targetIndex = targetItem > sourceStartIndex 
        ? targetItem - sourceCount + 1 
        : targetItem;

    if (sourceCount === 1) {
        provider.moveRow(sourceStartIndex, targetItem);
    } else {
        provider.moveRows(sourceStartIndex, sourceCount, targetIndex);
    }

    updatedrowData.value = [ ...dataProvider.getJsonRows()]

     emit('updatedRowData', updatedrowData.value )
};

gridView.onCellDblClicked = function (grid, clickData) {
  if (clickData.itemIndex == undefined) {
    return ;
  }
  selectedRowData.value= dataProvider.getRows()[clickData.itemIndex];
  selectedRowData.value.index = clickData.itemIndex
  emit('dblclickedRowData', selectedRowData.value);
 
}

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
  var values = {add: '추가' , sort: '매장용'}; 
  var dataRow = dataProvider.addRow(values);
  console.log(dataRow)
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

watch(() => props.addRow3, (newVal) => {
  gridView.commit();
  var values = {add: true }; 
  let propertys = props.addrowProp.split(',')
  for(var i=0 ; i<propertys.length ; i++){
    values[propertys[i]] = undefined
  }
  values.new = true 
  var dataRow = dataProvider.addRow(values);
  gridView.setCurrent({dataRow: dataRow });
  props.rowData.push(values)
  const current = gridView.getCurrent();  // 현재 선택된 행 정보 가져오기
  const selectedRowIndex = current ? current.dataRow : null;
   if (selectedRowIndex !== null) {
    console.log("현재 선택된 인덱스:", selectedRowIndex);  // 선택된 행의 인덱스 출력
    selectedindex.value = selectedRowIndex
  }
  emit('selectedIndex' ,selectedRowIndex )
  console.log(props.rowData)
  // updatedrowData.value = [ ...dataProvider.getJsonRows()]
  // emit('updatedRowData', updatedrowData.value )

});
watch(() => props.addRow4, (newVal) => {
  gridView.commit();
  var values = { add: true }; 
  let propertys = props.addrowProp.split(',')
  const value = props.addrowDefault.split(',')
  for(var i=0 ; i<propertys.length ; i++){
    values[propertys[i]] = value[i]
  }
  values.new = true 
  console.log(values)
  var dataRow = dataProvider.addRow(values);
  gridView.setCurrent({dataRow: dataRow });
  const current = gridView.getCurrent(); 

  props.rowData.push(values)
  const selectedRowIndex = current ? current.dataRow : null;
   if (selectedRowIndex !== null) {
    console.log("현재 선택된 인덱스:", selectedRowIndex);  // 선택된 행의 인덱스 출력
    selectedindex.value = selectedRowIndex
  }
  console.log(selectedRowIndex)
  emit('selectedIndex' ,selectedRowIndex )
  console.log(props.rowData)
  addrow4activated.value = true
  // updatedrowData.value = [ ...dataProvider.getJsonRows()]
  // emit('updatedRowData', updatedrowData.value )

});
watch(() => props.deleteRow, (newVal) => {
    gridView.commit();
    const curr = gridView.getCurrent(); // 현재 선택된 셀 또는 행 정보를 가져옴
    if (curr && curr.dataRow >= 0) {
      // 현재 데이터 행이 유효한 경우
      props.rowData[curr.dataRow].deleted = true ;
      dataProvider.setValue(curr.dataRow, "deleted", true); // "deleted" 속성을 true로 설정
      dataProvider.removeRow(curr.dataRow);
      gridView.commit();
    } else {
      console.warn("선택된 행이 없습니다.");
    }
    updatedrowData.value = [ ...dataProvider.getJsonRows()]
    emit('updatedRowData', updatedrowData.value )
  
});
watch(() => props.deleteRow2, (newVal) => {
    gridView.commit();
    const curr = gridView.getCurrent(); // 현재 선택된 셀 또는 행 정보를 가져옴
    if (curr && curr.dataRow >= 0) {
      // 현재 데이터 행이 유효한 경우
      props.rowData[curr.dataRow].deleted = true ;
      dataProvider.setValue(curr.dataRow, "deleted", true); // "deleted" 속성을 true로 설정
      dataProvider.removeRow(curr.dataRow);
      gridView.commit();
    } else {
      console.warn("선택된 행이 없습니다.");
    }
    updatedrowData.value = [ ...dataProvider.getJsonRows()]
    emit('updatedRowData', updatedrowData.value )
    deleted2activated.value = true
    addrow4activated.value = true
    deletedIndex.value = curr.dataRow
    
});

watch(() => props.deleteAll, (newVal) => {
  gridView.commit();
  const allRows = dataProvider.getJsonRows();

// Mark all rows as deleted (if needed)
  if(props.notsoftDelete == false){
    allRows.reverse().forEach((row, index) => {
      dataProvider.setValue(index, "deleted", true); // Optionally mark them as deleted
      dataProvider.removeRow(index);
  }) 
  
   } else {
    for (let i = allRows.length - 1; i >= 0; i--) {
        dataProvider.removeRow(i);
    }
   }



// Update the row data after deletion
updatedrowData.value = [...dataProvider.getJsonRows()];

// Emit the updated row data
emit('updatedRowData', updatedrowData.value);
});

watch(() => props.commitAll, (newVal) => {

  if(dataProvider != undefined && dataProvider.getRowCount() > 0){
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
watch(() => props.initFocus, (newVal) => {
  setTimeout(() => {
    if(gridView !=undefined && gridView !=null ){
    
    gridView.clearCurrent();
 }
  },150)
 
  
  
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

watch(() => props.rowData, () => {
  console.log(selectedindex.value)
  addrow4activated.value = true
  funcshowGrid().then(() =>{
    setTimeout(function(){
      if(selectedindex.value == -1){
        return;
      }
      if(selectedindex.value !='' && selectedindex.value !=undefined){
    console.log(selectedindex.value)
    gridView.setCurrent({ dataRow : selectedindex.value })


  } else if (selectedindex.value ==0){
    gridView.setCurrent({ dataRow : selectedindex.value })
  }

  if(addrow4activated.value == true){
    console.log(props.rowData)

    const newIndices = props.rowData.reduce((indices, item, index) => {
  if (item.new === true) {
    indices.push(index);
  }
  return indices;
}, []);
    dataProvider.setRowStates(newIndices, 'created', true);
    addrow4activated.value = false
    console.log(dataProvider.getRows(0, -1))
    const current = gridView.getCurrent();
    if(deleted2activated.value == true){
      console.log(current.dataRow)
      gridView.setCurrent({ dataRow : deletedIndex.value -1})
      deleted2activated.value = false
    } else {
      gridView.setCurrent({ dataRow : current.dataRow})
    }
  }
 
    },100) // 시간으로인한 미적용 이슈있음
    
})

  
});

watch(() => [ props.searchWord, props.searchColValue2], ([newValue, newValue2]) => {
  const searchColId = props.searchColId.split(',')
  let searchColId2;
  let searchColValues;

  if(props.searchColId2 !== ''){
     searchColId2 = props.searchColId2.split(',')
  }
  if(newValue2 !== ''){
    searchColValues = newValue2.split(',')
  }
  
  const searchWord = newValue.split(',')


 if(searchColId2 == undefined){
   if (newValue === '') {
    dataProvider.setRows( props.rowData );
    return ;
   };
   const filteredData = props.rowData.filter(
    item => 
  {
     
    return searchColId.some(colId => {
    
      const value = item[colId] ? item[colId].toString() :'';
   
      return value.toLowerCase().includes(newValue.toString().toLowerCase())
    })
  }
  );
  dataProvider.setRows(filteredData.length ? filteredData : []);
 } else {

  const filteredData = props.rowData.filter(
    item => 
  {
     
    return searchColId2.every((colId,index) => {
    
      const value = item[colId] ? item[colId].toString() : '';
      const searchValue = (searchColValues[index] || '').toString();
     
      if ( searchValue === '0') {
       return true;
       }
      return value.toLowerCase().includes(searchValue.toString().toLowerCase())
    })
  }
  );
  if(props.searchWord == '' ){
    dataProvider.setRows(filteredData.length ? filteredData : []);
  } else {
    const filteredData2 = filteredData.filter(
    item => 
    {
     
    return searchColId.some(colId => {
       
      const value = item[colId] ? item[colId].toString() : '';
    
      return value.toLowerCase().includes(props.searchWord.toString().toLowerCase())
    })
  }
  );
  dataProvider.setRows(filteredData2.length ? filteredData2 : []);
  }
  
 }
 
});
</script>

<style scoped>
/* 동적 스타일이 삽입되므로 추가 스타일 정의는 필요 없음 */
</style>
