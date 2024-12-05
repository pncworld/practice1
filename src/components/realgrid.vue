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
});

const realgridname = ref(`realgrid-${props.progname}-${props.progid}-${uuidv4()}`); // 동적 ID 설정
const tabInitSetArray = ref([]);
const selectedRowData = ref([]);
const result2 =ref([]) ;
const emit = defineEmits(["selcetedrowData"]);

const funcshowGrid = async () => {
  // 그리드 초기화
  console.log(gridView)
  if (gridView !=undefined && gridView !=null ) {
    gridView.destroy(); // 기존 그리드 인스턴스 제거
  }else {
    console.log("초기화안되ㅁ?")
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
    dataType: 'text',
  }));
  dataProvider.setFields(fields);

  // 컬럼 정의
  const columns = tabInitSetArray.value.map((item, index) => ({
    name: item.strHdText,
    fieldName: item.strColID,
    header: {
      text: item.strHdText,
      styleName: `header-style-${index}`,
    },
    width: item.intHdWidth,
    lookupDisplay :  result2.value != [] ? true : false,
    values :  result2.value != [] ? result2.value.value : [],
    labels :  result2.value != [] ? result2.value.labels : [],
    visible: item.intHdWidth !== 0,
    renderer : { type : item.strColID =='add' ? 'button' : 'text' }
  }));
  gridView.setColumns(columns);

  // 데이터 추가
  dataProvider.setRows(props.rowData);

  // 기타 옵션
  gridView.setFooters({ visible: false });
  gridView.setRowIndicator({ visible: true });
  gridView.setCheckBar({ visible: props.showCheckBar });
  gridView.displayOptions.fitStyle = 'even';
  gridView.sortingOptions.enabled = true;

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


  gridView.onCellItemClicked = function (grid, clickData) {

  if (clickData.itemIndex == undefined) {
    return ;
  }
  selectedRowData.value= dataProvider.getRows()[clickData.itemIndex];
  emit('selcetedrowData', selectedRowData.value);
}
};

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
      return value.includes(newValue.toString())
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
