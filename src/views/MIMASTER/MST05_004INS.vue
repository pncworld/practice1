<template>
  <div>
    <div id="realgrid" style="width: 100%; height: 400px;"></div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { GridView, LocalDataProvider } from 'realgrid';

let gridView;
let dataProvider;
const rows = ref([]);
const dulpicatedrows = ref()
onMounted(() => {
  // 1. DataProvider 설정
  dataProvider = new LocalDataProvider();
  
  // 2. GridView 설정
  gridView = new GridView('realgrid');
  gridView.setDataSource(dataProvider);

  // 3. 필드 정의
  const fields = [
    { fieldName: 'id', dataType: 'number' },
    { fieldName: 'name', dataType: 'text' },
    { fieldName: 'selected', dataType: 'boolean' }
  ];
  dataProvider.setFields(fields);

  let isAllSelected = false; // 전체 선택 상태를 저장

  // 4. 컬럼 정의
  const columns = [
    { name: 'id', fieldName: 'id', width: 50, header: { text: 'ID' } },
    { name: 'name', fieldName: 'name', width: 150, header: { text: 'Name' } },
    {
      name: 'selected',
      fieldName: 'selected',
      width: 100,
      header: {
        // 이벤트 핸들러를 추가하여 체크박스 클릭 시 전체 선택/해제 처리
        checkLocation: "left"
      },
      renderer: {
        type: "check",
      },
      checked: false,
      editable: false, // 체크박스가 편집 가능하도록 설정
    }
  ];
  gridView.setColumns(columns);

  // 5. 샘플 데이터 추가
  rows.value = [
    { id: 1, name: 'Alice', selected: false },
    { id: 2, name: 'Bob', selected: true },
    { id: 3, name: 'Charlie', selected: false }
  ];
  dulpicatedrows.value = rows.value; 
  dataProvider.setRows(rows.value);

  gridView.setRowIndicator({
    visible: false
  });
  gridView.setCheckBar({
    visible: false,
  });
  gridView.sortingOptions.enabled = true;
  gridView.onColumnCheckedChanged = function (grid, col, chk) {
    grid.commit();
    console.log(col.name + " was checked as: " + chk);
    if (col.name === "selected") {
      isAllSelected = !isAllSelected; // 전체 선택 상태 반전
      const rowCount = dataProvider.getRowCount();

      for (let i = 0; i < rowCount; i++) {
        dataProvider.setValue(i, "selected", isAllSelected);
      }
      gridView.refresh(); // 화면 갱신
    }
  };

  gridView.onCellEdited = function (grid, itemIndex, row, field) {
    // 데이터가 수정될 때 rows를 갱
    gridView.commit();
  
  // 이후 데이터 갱신 (필요시 rows를 업데이트)
    rows.value = dataProvider.getRows();
 
  };
});

watch(rows, (newValue) => {
  console.log(newValue);
});

</script>

<style scoped>
#realgrid {
  border: 1px solid #ccc;
}
</style>
