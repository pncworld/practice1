<template>
  <div :id="realgridname" class="h-[100%] w-[100%] realgrid"></div>
</template>

<script setup>
import { getGridInfoList } from "@/api/common";
import { getDynamicGrid2, getDynamicGrid3 } from "@/api/master";
import { getDynamicGrid4 } from "@/api/micrm";
import { getDynamicGrid5, getDynamicGrid6 } from "@/api/mihr";
import { getDynamicGrid } from "@/api/misales";
import {
  excelTitle,
  formatDateTime,
  formatLocalDate,
} from "@/customFunc/customFunc";
import store from "@/store";
import { GridView, LocalDataProvider } from "realgrid";
import { v4 as uuidv4 } from "uuid";
import { nextTick, onMounted, ref, watch } from "vue";
let gridView;
let dataProvider;

/*

  - 리얼그리드.vue 파일 구조 및 사용 방법

  RealGrid2의 개념도와 주요 객체들을 살펴보겠습니다.

    GridView: 눈에 보이는 부분을 담당하는 중요한 객체입니다.
    DataProvider: 데이터를 관리하는 중요한 객체입니다.
    DataField: 데이터 저장을 위한 논리적 장소를 담당하는 객체입니다.
    DataColumn: DataField의 정보를 화면에 표현하기 위한 속성을 담고 있는 객체입니다.
    ItemModel 또는 GridItem: 그리드에 보여지는 행 정보를 담고 있는 모델 객체입니다.
    Controller: 그리드에서 Item을 조작하기 위한 여러 가지 내부적인 객체들을 아우르는 의미의 명칭입니다.

   (출처 : https://docs.realgrid.com/tutorial/introductions-concepts) https://docs.realgrid.com/tutorial/realgrid-column-field-setup
  우리테크의 RealGrid2 는 외부 종속성 없이 TypeScript로 개발된 웹 DataGrid UI 라이브러리로 최신 웹 브라우저에서 직접 사용할 수 있는
  ES5 형식의 순수 JavaScript 파일로 제공합니다. "RealGridJS 1.0"의 Canvas 방식에서 DOM 방식으로 작동 방식이 변경되었지만 상당부분 1.0과 호환성을 가지고 있습니다.

  RealGrid를 사용하려면 RealGrid의 개념을 이해 해야 합니다. 아래 이미지는 RealGrid의 구성을 간략하게 표현한 도식 입니다.
  RealGrid는 효과적인 데이터 관리를 위해 별도의 데이터 셋를 가지고 있고 "DataProvider"라고 합니다. 그리드에 넣을 데이터를 DataProvider에 로드해 사용합니다.
  그리드 데이터 셋에 담을 수 있는 형식은 Json, XML, CSV 와 Javascript Array 형식을 지원합니다.
  RealGrid의 MVC 모델의 장점으로 하나의 데이터 셋에 여러 개의 그리드 뷰를 연결할 수 있습니다

  1구간 에서는 부모(각 페이지) 컴포넌트에서 전달 받는 변수들을 정의
  2구간 에서는 리얼그리드 컴포넌트 내에서 사용하는 변수들을 정의
  3구간 에서는 리얼그리드 정의에 따른 컬럼과 필드 설정 , DB 에서 불러오는 컬럼에 대한 정보를 각각의 양식에 맞게 붙여서 정의를 함.
            그리고 gridView.setColumns(columns); 함수로 컬럼을 설정하고 4구간 주변에서 사전에 별도로 설정할 값을 변수로 받아서 설정을 필요에 따라 해줌.
  4구간 에서는 부모 컴포넌트에서 미리 정의된 변수들로 기존 3구간에서 정의하기 어려운 부분들을 재정의 해줌 .
  5구간 에서는 리얼그리드에서 기본적으로 설정되어야할 값들을 설정 해주는 부분.
  6구간 에서는 리얼그리드 함수에 대한 정의를 커스텀 한 부분이고 각각의 이벤트가 발생할때마다 필요로 하는 설정이나 다시 emit 으로 부모 컴포넌트에 전달하는 역할을 함
  7구간 에서는 동적으로 부모 컴포넌트에서 동적으로 제어하는 변수들의 값들을 감지해서 필요로하는 동작을 해줌 ( 예를 들어 검색 )


  예시)

  gridView.onCellClicked = function (grid, clickData) { // 셀을 클릭할때 발생되는 이벤트
    if (clickData.cellType == "check") { // 해당 셀이 체크박스 타입이면 종료하고
      return;
    }
    if (clickData.cellType === "header") { // 해당 셀이 컬럼부분이면 미리 설정된 행의 인덱스 부분으로 선택하는 행을 옮겨주고
      gridView.setCurrent({ dataRow: selectedindex.value });
    }
    if (clickData.itemIndex == undefined || clickData.itemIndex == -1) { // 그외의 정상적인 행 부분이 아니면 종료시켜줌.
      return;
    }
    var current = gridView.getCurrent(); // 모든 예외처리를 거쳤으면 이제 선택된 행이 있으므로 해당 행의 정보들을 불러와서
    //comsole.log(current);
    if (current.itemIndex !== -1) { // 그 행의 인덱스를 다시 검사해서 정상적인 인덱스면
      emit("selectedIndex", current.dataRow); // 선택한 행의 인덱스를 부모 컴포넌트로 보냄
      emit("selectedIndex2", current.dataRow); // 선택한 행의 인덱스를 부모 컴포넌트로 보냄


      selectedRowData.value = dataProvider.getRows()[clickData.dataRow]; // 그리고 해당 행의 실질적인 정보들을 불러오고

      if (gridView.isCheckedRow(clickData.itemIndex)) { //  해당 행이 체크된 행이면
        if (props.hideCheckBarList == false) {       // 미리 설정된 값에 따라서 체크를 해주거나 안해주는 부분
          grid.checkItem(clickData.itemIndex, false);
        } else {
          if (
            props.hideCheckBarList == true &&
            selectedRowData.value[4] != "0"
          ) {
            grid.checkItem(clickData.itemIndex, false);
          }
        }
      } else {
        if (props.hideCheckBarList == false) {
          grid.checkItem(clickData.itemIndex);
        } else {
          if (
            props.hideCheckBarList == true &&
            selectedRowData.value[4] != "0"
          ) {
            grid.checkItem(clickData.itemIndex);
          }
        }
      }

      selectedRowData.value = dataProvider.getRows()[current.dataRow]; // 해당 행의 정보를 다시 불러와서 ( 이부분은 없어도 될것으로 보임)
      if (selectedRowData.value) {    // 해당행이 undefined 가 아니면 해당 행의 상태값과 인덱스를 붙여서 emit을 통해서 부모 컴포넌트로 보냄 emit("sendRowState", rowState); 이부분은 행의 상태를  ,     emit("clickedRowData", selectedRowData.value); 이부분은 클릭한 행의 데이터 전부를
        const rowState = dataProvider.getRowState(clickData.dataRow);
        if (selectedRowData.value) {
          selectedRowData.value.index = current.dataRow;
          selectedRowData.value.rowState = rowState;
        }
        selectedindex.value = current.dataRow;

        //comsole.log(rowState);
        emit("sendRowState", rowState);

        emit("clickedRowData", selectedRowData.value);
      }
    }
  };



  emit updatedRowData 사용시에는 가급적 불가피한경우가 아니라면 기존 rowData와 교체 하지 말 것. updatedRowData로 수정된 사항을 별도의
  변수로 저장해두고 추후에 그 데이터를 저장하는게 옳다고봄

  사용법
  progname => SQL mstgridInfo 에 저장된 설정값 가져오는 부분
  progid => SQL mstgridInfo 에 저장된 설정값 가져오는 부분
  rowData => 실제 데이터 입력 부분
  showGrid => 변수로 그리드를 보여주거나 안 보여주게 설정
  showCheckBar => 변수로 그리드 내의 체크바를 보여주거나 안 보여주게 설정
  searchWord => 변수로 그리드 내의 데이터에서 검색어로 조회할 수 있게 설정
  searchColId => 검색하려는 필드명 ( 예)strName,SubName) , 로 나눠서 해당 필드들을 함께 조회 가능
  addRow => true false로 값이 변할때마다 행을 추가
  deleteRow =>  true false로 값이 변할때마다 행을 삭제
  deleteRow3 =>


  index 는 dataRow 를 대부분 활용하는게 좋음
  itemindex는 정렬에 따라 가변해서 dataprovider에 정확한 위치를 보장하지 않음.

}

*/

// 1구간
const props = defineProps({
  progname: {
    // DB 에서 불러올 사전에 정의된 컬럼 정보들을 가지고 있는 부분의 프로그램이름
    type: String,
    default: "",
  },
  progid: {
    // DB 에서 불러올 사전에 정의된 컬럼 정보들을 가지고 있는 부분의 프로그램 ID
    type: Number,
    default: 0,
  },
  rowData: {
    // 실제 나타낼 데이터
    type: Array,
    default: () => [],
  },
  showGrid: {
    //  변수로 그리드를 보이게 하거나 안 보이게 하려는 목적이었음 ( 현재는 폐기됨)
    type: Boolean,
    default: false,
  },
  showCheckBar: {
    //  변수로 체크바를 보이게 하거나 안보이게
    type: Boolean,
    default: false,
  },
  searchWord: {
    // 폐기
    type: String,
    default: "",
  },
  renderProgname: {
    //  폐기
    type: String,
    default: "",
  },
  searchColId: {
    // 검색할 검색어 외에 컬럼의 값으로 조회하기 위한 추가적인 컬럼id
    type: String,
    default: "",
  },
  addRow: {
    // 행 추가버튼
    type: Boolean,
    default: false,
  },
  deleteRow: {
    // 행 삭제버튼
    type: Boolean,
    default: false,
  },
  editableColId: {
    // 행 자체에서 데이터를 수정할 컬럼 설정
    type: String,
    default: "",
  },
  changeColid: {
    // 그리드 안에 데이터를 수정할 컬럼 ID
    type: String,
    default: "",
  },
  changeRow: {
    // 그리드 안에 데이터를 수정할 컬럼 인덱스
    type: Number,
    default: "",
  },
  changeValue: {
    // 그리드 안에 데이터를 수정할 컬럼의 값
    type: String,
    default: "",
  },
  rowStateeditable: {
    // 그리드 전체 행의 자체 수정 여부
    type: Boolean,
    default: true,
  },
  addRow2: {
    // 행 추가 버튼
    type: Boolean,
    default: true,
  },
  addrowProp: {
    // 행 추가할때 기본값으로 설정할 컬럼
    type: String,
    default: true,
  },
  addrowDefault: {
    // 행 추가할때 기본값으로 설정할 컬럼의 값
    type: String,
    default: true,
  },
  reload: {
    // 그리드 갱신
    type: Boolean,
    default: false,
  },
  fixedColumn: {
    // 그리드 컬럼의 가로 길이에 대한 고정 여부
    type: Boolean,
    default: false,
  },
  mergeColumns: {
    // 그리드 컬럼 그룹핑 여부
    type: Boolean,
    default: false,
  },
  mergeColumnGroupName: {
    // 그리드 컬럼 상위 그룹 컬럼명
    type: String,
    default: "",
  },
  mergeColumnGroupSubList: {
    // 그리드 컬럼 그룹핑할 컬럼명
    type: String,
    default: "",
  },
  exporttoExcel: {
    // 엑셀 내보내기
    type: Boolean,
    default: false,
  },
  ExcelNm: {
    // 폐기
    type: String,
    default: false,
  },
  deleteAll: {
    // 모든 행 삭제
    type: Boolean,
    default: false,
  },
  commitAll: {
    // 모든 행 커밋
    type: Boolean,
    default: false,
  },
  inputOnlyNumberColumn: {
    // 데이터 입력 숫자로 제한
    type: String,
    default: "",
  },
  inputOnlyNumberColumn2: {
    // 데이터 입력 숫자로 제한
    type: String,
    default: "",
  },
  dragOn: {
    // 고정 컬럼 여부
    type: Boolean,
    default: false,
  },
  notsoftDelete: {
    // 행 삭제시 바로삭제 혹은 행상태 변경 여부
    type: Boolean,
    default: false,
  },
  searchColId2: {
    //  폐기
    type: String,
    default: "",
  },
  searchColValue2: {
    //  폐기
    type: String,
    default: "",
  },
  addRow3: {
    // 행 추가

    type: Boolean,
    default: true,
  },
  selectionStyle: {
    // 셀 클릭시 전체 행을 선택한것처럼 보이게 할건지 아니면 셀만 선택된것처럼 보이게 할건지
    // 숫자로만 오게
    type: String,
    default: "singleRow",
  },
  initFocus: {
    // 셀 선택 초기화
    // 숫자로만 오게
    type: Boolean,
    default: false,
  },
  addRow4: {
    // 행 추가
    // 숫자로만 오게
    type: Boolean,
    default: false,
  },
  addRow5: {
    // 행 추가
    // 숫자로만 오게
    type: Boolean,
    default: false,
  },
  deleteRow2: {
    // 행 삭제
    // 숫자로만 오게
    type: Boolean,
    default: false,
  },
  addField: {
    // 컬럼을 추가하는 역할인데 사실상 폐기
    // 숫자로만 오게
    type: String,
    default: "",
  },
  labelsData: {
    // 데이터 행의 실제 값에 따른 라벨 값
    // 숫자로만 오게
    type: Array,
    default: () => [],
  },
  valuesData: {
    // 데이터 행의 라벨 값에 따른 실제 값
    // 숫자로만 오게
    type: Array,
    default: () => [],
  },
  labelingColumns: {
    // 라벨링할 컬럼 목록
    // 숫자로만 오게
    type: String,
    default: "",
  },
  deleteRow3: {
    // 삭제 버튼
    // 숫자로만 오게
    type: Boolean,
    default: false,
  },
  useCheckboxfordelete: {
    // 체크박스 상태에 따른 행상태 변경
    // 숫자로만 오게
    type: Boolean,
    default: false,
  },
  changeNow: {
    // 세팅된 데이터 값으로 즉시 변경
    type: Boolean,
    default: false,
  },
  changeValue2: {
    // 변경할 데이터의 값
    type: String,
    default: "",
  },
  setNumberformatColumn: {
    // 천단위로 숫자 포맷을 세팅할 컬럼 but 사실상 폐기 (DB에서 관리 가능함)
    type: String,
    default: "",
  },
  setAllCheck: {
    // 모든 행 체크 false
    type: Boolean,
    default: false,
  },
  deleteRow4: {
    // 행 삭제
    type: Boolean,
    default: false,
  },
  deleteRow5: {
    // 행 삭제
    type: Boolean,
    default: false,
  },
  defaultSearchAllValue: {
    // 폐기
    type: Number,
    default: 0,
  },
  initCheckColumn: {
    // 인위적으로 체크할 컬럼
    type: String,
    default: "",
  },
  initCheckValue: {
    // 인위적으로 체크할 행의 값
    type: String,
    default: "",
  },
  initCheckAct: {
    // 인위적으로 체크 시행
    type: Boolean,
    default: false,
  },
  initSelect: {
    // 그리드가 로드될때 선택되는 행의 인덱스 값을 초기화
    type: Boolean,
    default: false,
  },
  setAllCheck2: {
    // 그리드 모든 체크박스 강제체크
    type: Boolean,
    default: false,
  },
  uncheckColumn: {
    // 인위적으로 체크 하지 않을 컬럼
    type: String,
    default: "",
  },
  uncheckValue: {
    // 인위적으로 체크 하지 않을 컬럼의 값
    type: String,
    default: "",
  },
  uncheckAct: {
    // 인위적으로 체크해제 시행
    type: Boolean,
    default: false,
  },
  maintaincheckColumn: {
    // 폐기
    type: String,
    default: "",
  },
  hideRow: {
    // 숨길 행 설정
    type: Number,
    default: 0,
  },
  hideNow: {
    // 설정된 숨길행 숨기기 실행
    type: Boolean,
    default: "",
  },
  changeOriginRow: {
    // 폐기
    type: Number,
    default: "",
  },
  checkBarInactive: {
    // 비활성화 시킬 체크바 인덱스 위치들
    type: String,
    default: "",
  },
  ExceptionCheck: {
    // 인위적으로 체크되는 것에서 제외할 인덱스 값들
    type: String,
    default: "",
  },
  showTooltip: {
    // 툴팁 보이기
    type: Boolean,
    default: false,
  },

  searchPrimaryId: {
    // 폐기
    type: String,
    default: "",
  },
  setStateBar: {
    // 행 상태 보이기 여부
    type: Boolean,
    default: true,
  },
  setFooter: {
    // 그리드 푸터 설정 여부
    type: Boolean,
    default: false,
  },
  setGroupFooter: {
    // 그리드 그룹 푸터 설정 여부
    type: Boolean,
    default: false,
  },
  setFooterExpressions: {
    // 푸터 표현식
    type: Array,
    default: [],
  },
  timeColumns: {
    // 푸터 표현식
    type: Array,
    default: [],
  },
  setFooterColID: {
    //  푸터 표현식을 설정할 컬럼명
    type: Array,
    default: [],
  },
  showOnlyChecked: {
    // 체크된 것만 보이기 여부
    type: Boolean,
    default: false,
  },
  setGroupColumnId: {
    // 그룹핑할 컬럼명
    type: String,
    default: "dtmDate",
  },
  setGroupSumCustomText: {
    //  그룹 푸터에서 임의로 설정할 텍스트
    type: Array,
    default: [],
  },
  setGroupSumCustomColumnId: {
    //  그룹 푸터에서 임의로 설정할 텍스트 컬럼명
    type: Array,
    default: [],
  },
  setGroupCustomLevel: {
    //  그룹 푸터에서 임의로 설정할 텍스트 컬럼의 레벨 설정
    type: String,
    default: "1",
  },

  setGroupSummaryCenterIds: {
    // 폐기
    type: String,
    default: " ",
  },
  hideColumnNow: {
    // 동적으로 숨길 컬럼에 대한 숨김 실행
    type: Boolean,
    default: false,
  },
  hideColumn: {
    // 동적으로 숨길 컬럼명 설정
    type: String,
    default: "",
  },
  setRowGroupSpan: {
    // 셀 병합
    type: String,
    default: "",
  },
  documentTitle: {
    // 내보낼 엑셀파일명 설정
    type: String,
    default: "",
  },
  documentSubTitle: {
    // 내보낼 엑셀 부제목 설정
    type: String,
    default: "",
  },
  hideColumnsId: {
    // 숨길 엑셀 컬럼명들 설정
    type: Array,
    default: [],
  },
  hideColumnsId2: {
    // 숨길 엑셀 컬럼명들 설정
    type: Array,
    default: [],
  },
  setGroupFooterExpressions: {
    // 그룹 푸터에서 나타낼 값
    type: Array,
    default: [],
  },
  setGroupFooterColID: {
    // 그룹 푸터에서 나타낼 값들의 컬럼명
    type: Array,
    default: [],
  },
  setGroupSumCustomLevel: {
    // 그룹 푸터에서 나타낼 값들의 레벨
    type: String,
    default: 1,
  },
  setGroupSumCustomLevel2: {
    // 그룹 푸터에서 나타낼 값들의 레벨2
    type: String,
    default: 1,
  },
  mergeColumns2: {
    // 그룹핑할 컬럼들의 작동 여부
    type: Boolean,
    default: false,
  },
  mergeColumnGroupName2: {
    // 그룹핑된 컬럼들의 상위 컬럼명
    type: Array,
    default: [],
  },
  mergeColumnGroupSubList2: {
    // 그룹핑할 컬럼들
    type: Array,
    default: [[]],
  },
  getJson: {
    // 현재 데이터를 JSON 데이터로 전달할 변수
    type: Boolean,
    default: false,
  },
  suffixColumnPercent: {
    // 컬럼에 % 붙일 컬럼들
    type: Array,
    default: [],
  },
  mergeMask: {
    //
    type: String,
    default: "",
  },

  setRowGroupSpan2: {
    // 셀병합
    type: String,
    default: "",
  },
  setMergeMode: {
    //
    type: Boolean,
    default: true,
  },
  setFooterCustomText: {
    // 푸터에서 임의로 넣을 텍스트 값들
    type: Array,
    default: [],
  },
  setFooterCustomColumnId: {
    // 푸터에서 임의로 넣을 텍스트들이 들어갈 컬럼명들
    type: Array,
    default: [],
  },
  setGroupOrderByColumnId: {
    // 그리드에서 그룹핑을 할때 순서 설정할 컬럼
    type: String,
    default: "",
  },
  setGroupSumCustomText2: {
    // 그룹푸터에서 나타날 텍스트 값들
    type: Array,
    default: [[]],
  },
  setGroupSumCustomText3: {
    // 그룹푸터에서 나타날 텍스트 값들
    type: Array,
    default: [],
  },

  setGroupSumCustomColumnId2: {
    // 그룹푸터에서 나타날 텍스트 값이 있을 컬럼들
    type: Array,
    default: [],
  },
  setGroupSumCustomColumnId3: {
    // 그룹푸터에서 나타날 텍스트 값이 있을 컬럼들
    type: Array,
    default: [],
  },
  setGroupCustomLevel: {
    // 그룹푸터에서 나타날 텍스트 값이 있을 레벨값
    type: String,
    default: 1,
  },
  setRowStyleCalls: {
    // 그룹푸터에서 레벨별로 나타날 색상에 대한 설정
    type: Boolean,
    default: false,
  },
  setRowStyleCallsDefaultCol: {
    // 그룹푸터에서 레벨별로 나타날 색상에 대한 설정
    type: String,
    default: "seqNum",
  },
  setRowStyleCallsDefaultCol2: {
    // 그룹푸터에서 레벨별로 나타날 색상에 대한 설정
    type: String,
    default: "seqNum",
  },
  hardCodeSetRowStyleCalls: {
    // 그룹푸터에서 레벨별로 나타날 색상에 대한 설정
    type: Boolean,
    default: false,
  },
  setRowStyleLevel: {
    // 그룹푸터에서 레벨별로 나타날 색상에 대한 설정
    type: Number,
    default: 1,
  },

  setRowGroupSpan3: {
    //폐기
    type: String,
    default: "",
  },

  customFooterCalculate: {
    // 폐기
    type: String,
    default: "",
  },
  customFooterShowLast: {
    // 폐기
    type: Boolean,
    default: false,
  },
  customStyleColumnID: {
    // 폐기
    type: Array,
    default: [],
  },
  setRowIndicator: {
    // 나타나는 그리드에서 맨 왼쪽 보이는 숫자 나타낼지 여부
    type: Boolean,
    default: true,
  },
  moveFocusbyIndex: {
    // 강제 선택된 행 이동
    type: String,
    default: "",
  },
  deleteCreated: {
    // 추가된 행 삭제 방법 여부
    type: Boolean,
    default: true,
  },
  setDynamicGrid: {
    // 동적 그리드 관련
    type: Boolean,
    default: false,
  },
  setDynamicGrid2: {
    // 동적 그리드 관련
    type: Boolean,
    default: false,
  },
  dynamicStoreCd: {
    // 동적 그리드 관련
    type: String,
    default: "",
  },
  setDynamicGrid3: {
    // 동적 그리드 관련
    type: Boolean,
    default: false,
  },
  searchWord3: {
    // 검색어
    type: String,
    default: "",
  },
  changeNow2: {
    // 그리드 데이터 변경시 재 클릭 이벤트 발생 여부에 따른 실행  (changeNow 와 차이)
    type: Boolean,
    default: false,
  },
  searchColId3: {
    // 검색할 데이터의 컬럼
    type: Array,
    default: [],
  },
  searchValue: {
    // 검색할 데이터의 컬럼의값
    type: Array,
    default: [],
  },
  deleteRow6: {
    // 행 삭제
    type: Boolean,
    default: false,
  },
  suffixColumnJul: {
    // 컬럼에 데이터 뒤에 '줄' 붙이는 방법
    type: Array,
    default: [],
  },
  suffixColumnheng: {
    // 컬럼에 데이터 뒤에 '행' 붙이는 방법
    type: Array,
    default: [],
  },
  searchSpecialCond: {
    // 검색할 데이터의 컬럼조건
    type: Boolean,
    default: true,
  },
  searchSpecialColId: {
    // 검색할 데이터의 컬럼명
    type: Array,
    default: [],
  },
  activeSearchSpecial: {
    // 검색할 데이터의 특정 조건 실행 여부
    type: Boolean,
    default: false,
  },
  searchSpecialCond2: {
    // 검색할 데이터의 특정 조건 실행 여부
    type: String,
    default: `(value = 'false') or (value is null )`,
  },
  setReFocus: {
    // 강제 재클릭 이벤트 발생
    type: Boolean,
    default: false,
  },
  hideCheckBarList: {
    // 체크바 관련 변수
    type: Boolean,
    default: false,
  },
  suffixColumnwon: {
    // 그리드 안에 원 붙일때 사용
    type: Array,
    default: [],
  },
  checkRenderEditable: {
    // 체크바 수정 관련 변수
    type: Boolean,
    default: false,
  },
  dynamicRowHeight: {
    // 행높이
    type: Boolean,
    default: false,
  },
  syncGridHeight: {
    // 행높이
    type: Boolean,
    default: false,
  },
  changeNow3: {
    // 행높이
    type: Boolean,
    default: false,
  },
  getRowChanged: {
    // 행높이
    type: Boolean,
    default: false,
  },
  excludeCheck: {
    // 행높이
    type: Boolean,
    default: false,
  },
  checkonlyone: {
    // 행높이
    type: Boolean,
    default: false,
  },
  checkAll: {
    // 행높이
    type: Boolean,
    default: false,
  },
  checkRowAuto: {
    // 행높이
    type: Boolean,
    default: true,
  },
  headerCheckBar: {
    // 행높이
    type: String,
    default: "",
  },
  useAlternateRowStyle: {
    // 행높이
    type: Boolean,
    default: true,
  },
  TimeArray: {
    // 행높이
    type: Array,
    default: [],
  },
  autoPlusColumn: {
    // 행높이
    type: Boolean,
    default: false,
  },
  mergeColumns3: {
    // 행높이
    type: Boolean,
    default: false,
  },
  mergeColumnGroupSubList3: {
    // 행높이
    type: Array,
    default: [],
  },
  mergeColumnGroupName4: {
    // 행높이
    type: Array,
    default: [],
  },
  mergeColumnGroupName3: {
    // 행높이
    type: Array,
    default: [],
  },
  setDynamicGrid4: {
    // 행높이
    type: Boolean,
    default: false,
  },
  setDynamicGrid4Cond: {
    // 행높이
    type: String,
    default: "0",
  },
  setDynamicGrid5: {
    // 행높이
    type: Boolean,
    default: false,
  },
  setDynamicGrid5Cond: {
    // 행높이
    type: String,
    default: "2025-09-01",
  },
  setDynamicGrid5Cond2: {
    // 행높이
    type: String,
    default: "2025-09-01",
  },
  setDynamicGrid6: {
    // 행높이
    type: Boolean,
    default: false,
  },
  setDynamicGrid6Cond: {
    // 행높이
    type: String,
    default: "9999",
  },
  initCheckRows: {
    // 행높이
    type: Array,
    default: [],
  },
  initCheckRowNow: {
    // 행높이
    type: Boolean,
    default: false,
  },
  disabled: {
    // 행높이
    type: Boolean,
    default: false,
  },
  deleteRow7: {
    // 행높이
    type: Boolean,
    default: false,
  },
  removeInitProp: {
    type: Boolean,
    default: false,
  },
  showCheckRowDataByForce: {
    type: Boolean,
    default: false,
  },
  checkRowAuto2: {
    type: Boolean,
    default: false,
  },
  checkRowAuto2Col: {
    type: String,
    default: "lngCheck",
  },
  AutoCalculateDataMainColId: {
    type: Array,
    default: [],
  },
  AutoCalculateDataSubColId: {
    type: Array,
    default: [],
  },
  CalculateTaxColId: {
    type: String,
    default: "",
  },
  CalculateTaxColId2: {
    type: String,
    default: "",
  },
  CalculateTimeColId: {
    type: String,
    default: "",
  },
  ColCellRedColorColId: {
    type: Array,
    default: [],
  },
  checkOnlyFalse: {
    // 체크박스 해제만 되는 설정
    type: Boolean,
    default: false,
  },
  hideChildHeader: {
    // 체크박스 해제만 되는 설정
    type: Boolean,
    default: false,
  },
  setCellStyleColId: {
    // 체크박스 해제만 되는 설정
    type: Array,
    default: [],
  },
  setCellStyleColId2: {
    // 체크박스 해제만 되는 설정
    type: Array,
    default: [],
  },
  setCellStyleColId3: {
    // HR02_001INS 색상 설정용
    type: Boolean,
    default: false,
  },
   CalculateShortQty : {
    // HR02_001INS 색상 설정용
    type: String,
    default: '',
  },

  exportExcelHiddenColumns: {
    // 엑셀 내보내기시 감춘컬럼 감춰서 export 하기
    type: Array,
    default: [],
  },
  checkedRowData2Col: {
    // 엑셀 내보내기시 감춘컬럼 감춰서 export 하기
    type: String,
    default: "",
  },
  checkAbleExpressionCol: {
    type: String,
    default: "",
  },
  checkAbleExpressionCol2: {
    type: String,
    default: "",
  },
  checkAbleExpressionVal: {
    type: String,
    default: "",
  },
});

// 2구간
const realgridname = ref(); // 동적 ID 설정
const tabInitSetArray = ref([]);
const selectedRowData = ref([]);
const result2 = ref([]);
const deletedIndex = ref();
const addrow4activated = ref(false);
const deleted2activated = ref(false);
const updatedrowData = ref([]);
const selectedindex = ref(-1);
const emit = defineEmits([
  "selcetedrowData",
  "updatedRowData",
  "updatedRowData2",
  "clickedRowData",
  "clickedRowData2",
  "dblclickedRowData",
  "selectedIndex",
  "checkedRowData",
  "checkedRowIndex",
  "getJsonData",
  "sendRowState",
  "deleteRows",
  "realgridName",
  "allStateRows",
  "buttonClicked",
  "clickedButtonCol",
  "checkAllorNot",
  "checkedRowData2",
]);
// 3구간
const funcshowGrid = async () => {
  if (tabInitSetArray.value.length == 0) {
    return;
  }
  if (gridView !== undefined && gridView !== null) {
    dataProvider.clearRows();
    dataProvider.destroy();

    gridView.destroy();
    gridView = null;
    dataProvider = null;

    // 기존 그리드 인스턴스 제거
  }

  dataProvider = new LocalDataProvider();

  // nextTick으로 DOM 업데이트 후 초기화
  //

  const container = document.getElementById(realgridname.value);
  await nextTick();
  if (!container) {
    //console.error(`Invalid grid container element: ${realgridname.value}`);
    return;
  }

  gridView = new GridView(container);
  gridView.setDataSource(dataProvider);

  window.gridView = gridView;

  // 필드 정의
  const fields = tabInitSetArray.value.map((item) => ({
    fieldName: item.strColID,
    dataType:
      props.suffixColumnwon == "lngPrice" && item.strColID == "lngPrice"
        ? "number"
        : item.strColID.includes("checkbox") ||
          item.strDisplay.includes("checkbox") ||
          (item.strColID.includes("lngSupplierID") &&
            props.checkBarInactive == "lngSupplierID")
        ? "boolean"
        : item.strColType == "number" ||
          item.strColType === "float" ||
          item.strColType === "double"
        ? "number"
        : item.strColType == "date"
        ? "datetime"
        : "text",
    datetimeFormat: "yyyy-MM-dd",
    valueExpression:
      props.AutoCalculateDataSubColId[
        props.AutoCalculateDataMainColId.indexOf(item.strColID)
      ],

    //     if (taxType == "01") {
    //       return supply * 0.1;
    //     } else {
    //       return 0;
    //     }
    //   } else {
    //     return values[fieldNames.indexOf(item.strColID)];
    //   }
    // },
    valueCallback: props.CalculateShortQty.includes(item.strColID) ?
    function (prod, dataRow, fieldName, fieldNames, values) {
      let dblResultQty = values[fieldNames.indexOf("dblResultQty")];
      let dblTakeQty  = values[fieldNames.indexOf("dblTakeQty")];
      
      if (dblResultQty > 0)
      {
        return parseInt(dblTakeQty) - parseInt(dblResultQty);
      }
      else
      {
        return parseInt(dblTakeQty) + parseInt(dblResultQty);
      }

    }
    
      : props.CalculateTaxColId2.includes(item.strColID)
      ? function (prod, dataRow, fieldName, fieldNames, values) {
          let unitp = values[fieldNames.indexOf("curUnitPrice")];
          let qty = values[fieldNames.indexOf("dblOrderQty")];

          return Math.floor(unitp * qty);
        }
      : props.CalculateTaxColId.includes(item.strColID)
      ? function (prod, dataRow, fieldName, fieldNames, values) {
          let taxType = values[fieldNames.indexOf("lngTaxType")];
          let supply = values[fieldNames.indexOf("curSupply")];

          if (taxType == "01") {
            return Math.floor(supply * 0.1);
          } else {
            return 0;
          }
        }
      : props.CalculateTimeColId.includes(item.strColID)
      ? function (prod, dataRow, fieldName, fieldNames, values) {
          let stime = values[fieldNames.indexOf("strSTime")];
          let etime = values[fieldNames.indexOf("strETime")];

          let cstime =
            parseInt(etime.split(":")[0]) - parseInt(stime.split(":")[0]);
          let cetime =
            parseInt(etime.split(":")[1]) - parseInt(stime.split(":")[1]);

          if (cetime < 0) {
            cstime -= 1;
            cetime = -cetime;
          }
          return (
            String(cstime).padStart(2, "0") +
            ":" +
            String(cetime).padStart(2, "0")
          );
        }
      : undefined,
  }));
  if (props.removeInitProp == true) {
    fields.push({ fieldName: "deleted", dataType: "boolean" });
    if (props.addField == "new") {
      fields.push({ fieldName: "new", dataType: "boolean" });
    }
  }

  if (props.autoPlusColumn) {
    const labelingcolumn = fields.find((item) => item.fieldName == "strWTime");

    labelingcolumn.valueCallback = function (
      prod,
      dataRow,
      fieldName,
      fieldNames,
      values
    ) {
      let stime = values[fieldNames.indexOf("strSTime")];
      let etime = values[fieldNames.indexOf("strETime")];

      let s1 = Number(stime.split(":")[0]);
      let s2 = Number(stime.split(":")[1]);
      let e1 = Number(etime.split(":")[0]);
      let e2 = Number(etime.split(":")[1]);
      if (isNaN(s1) || isNaN(s2) || isNaN(e1) || isNaN(e2)) {
        return undefined;
      } else {
        let hour = e1 - s1;
        let minute = e2 - s2;

        // 분 음수일 때 보정
        if (minute < 0) {
          hour -= 1;
          minute += 60;
        }

        // 시간/분 앞에 0 붙이기
        const formattedHour = String(hour).padStart(2, "0");
        const formattedMinute = String(minute).padStart(2, "0");

        return `${formattedHour}:${formattedMinute}`;
      }
    };

    ////console.log(labelingcolumn);
  }

  dataProvider.setFields(fields);

  // 컬럼 정의
  const columns = tabInitSetArray.value.map((item, index) => ({
    name: item.strColID,
    fieldName: item.strColID,
    header: {
      text: item.strHdText,
      styleName: `header-style-${realgridname.value}${index}`,
      checkLocation:
        (item.strColID.includes("checkbox") ||
          item.strDisplay.includes("checkbox")) &&
        !props.headerCheckBar.includes(item.strColID)
          ? "left"
          : "none",
    },
    // styleCallback: props.setCellStyleColId.includes(item.strColID)
    //   ? function (grid, dataCell) {
    //       // 시간값에 따라서 배경 색상 지정
    //       var ret = {};
    //       ////console.log(item.strColID);
    //       //  const hour = grid.getValue(dataCell.index.itemIndex, 'strTime').split(':')[0]
    //       //  const minute = grid.getValue(dataCell.index.itemIndex, 'strTime').split(':')[1]
    //       console.log(dataCell.value);
    //       dataCell.value == "1"
    //         ? (ret.style = { backgroundColor: "#ADD8E6" })
    //         : "";

    //       return ret;
    //     }
    //   : function (grid, dataCell) {
    //       // 시간값에 따라서 배경 색상 지정
    //       var ret = {};
    //       ////console.log(item.strColID);
    //       // const 시간대 = grid.getValue(dataCell.index.itemIndex, '시간대')
    //       //09:29
    //       ret.style = { color: "#FF0000" };
    //       return ret;
    //     },
    groupFooter: {
      text: props.setGroupSumCustomText[
        props.setGroupSumCustomColumnId.indexOf(item.strColID)
      ],
      styleName:
        item.strAlign == "center"
          ? "setTextAlignCenter"
          : item.strAlign == "left"
          ? "setTextAlignLeft"
          : "setTextAlignRight",
      expression:
        props.setGroupFooterExpressions[
          props.setGroupFooterColID.indexOf(item.strColID)
        ] == "custom"
          ? ""
          : props.setGroupFooterExpressions[
              props.setGroupFooterColID.indexOf(item.strColID)
            ],
      numberFormat:
        item.strColType == "float"
          ? "#,##0"
          : item.strColType === "double" && item.strDisplay == "double2"
          ? "#,##0.000"
          : item.strColType === "double" && item.strDisplay == "double"
          ? "#,##0.00"
          : item.strColType === "double" && item.strDisplay != "double"
          ? "#,##0.0"
          : "#,##0",
      valueCallback: function (grid, column, groupFooterIndex, group, value) {
        const regex =
          /(sum|avg|max|min|count)\(\s*([^)]+?)\s*\)|([+\-*/]|\b\d+\b)/gi;
        let tokens = [];
        let match;
        if (item.strSubSumtext != "") {
          while ((match = regex.exec(item.strSubSumtext)) !== null) {
            if (match[1]) {
              // 함수 호출 패턴에 매칭된 경우
              tokens.push({
                type: "function",
                func: match[1], // "sum" 또는 "avg"
                field: match[2], // 괄호 안의 필드명 (공백 제거됨)
              });
            } else if (match[3]) {
              // 연산자에 매칭된 경우
              tokens.push({
                type: "operator",
                operator: match[3],
              });
            }
          }
          let returnText = "";
          for (let i = 0; i < tokens.length; i++) {
            if (tokens[i].type == "function") {
              returnText += `grid.getGroupSummary(group,"${tokens[i].field}").${tokens[i].func}`;
            } else {
              returnText += tokens[i].operator;
            }
          }

          return eval(returnText) == "Infinity" ? 0 : eval(returnText);
        } else {
          return value;
        }
      },
      styleCallback: function (grid, item2) {
        let ret = {};

        let defaultGroupNum = 2;
        if (props.setGroupColumnId != []) {
          defaultGroupNum = props.setGroupColumnId.split(",").length;
        }

        if (item.strAlign !== "right") {
          if (defaultGroupNum == 1) {
            if (item2.level == 2) {
              ret.styleName = "skyblue setTextAlignLeft";
            }
          } else if (defaultGroupNum == 2) {
            if (item2.level == 2) {
              ret.styleName = "blue setTextAlignLeft";
            } else if (item2.level == 3) {
              ret.styleName = "skyblue setTextAlignLeft";
            }
          } else if (defaultGroupNum == 3) {
            if (item2.level == 2) {
              ret.styleName = "green setTextAlignLeft";
            } else if (item2.level == 3) {
              ret.styleName = "blue setTextAlignLeft";
            } else if (item2.level == 4) {
              ret.styleName = "skyblue setTextAlignLeft";
            }
          }
          return ret;
        } else {
          if (defaultGroupNum == 1) {
            if (item2.level == 2) {
              ret.styleName = "skyblue";
            }
          } else if (defaultGroupNum == 2) {
            if (item2.level == 2) {
              ret.styleName = "blue";
            } else if (item2.level == 3) {
              ret.styleName = "skyblue";
            }
          } else if (defaultGroupNum == 3) {
            if (item2.level == 2) {
              ret.styleName = "green";
            } else if (item2.level == 3) {
              ret.styleName = "blue ";
            } else if (item2.level == 4) {
              ret.styleName = "skyblue ";
            }
          }
          return ret;
        }
      },
    },
    footer: {
      text: props.setFooterCustomText[
        props.setFooterCustomColumnId.indexOf(item.strColID)
      ],
      styleName: props.setFooterCustomText[
        props.setFooterCustomColumnId.indexOf(item.strColID)
      ]
        ? "setTextAlignCenter"
        : item.strAlign == "center"
        ? "setTextAlignCenter"
        : item.strAlign == "left"
        ? "setTextAlignLeft"
        : "setTextAlignRight",
      expression:
        props.setFooterExpressions[props.setFooterColID.indexOf(item.strColID)],
      numberFormat:
        item.strTotalexpr != ""
          ? item.strTotalexpr
          : item.strColType === "double" && item.strDisplay == "double2"
          ? "#,##0.000"
          : item.strColType === "double" && item.strDisplay == "double"
          ? "#,##0.00"
          : item.strColType === "double" && item.strDisplay != "double"
          ? "#,##0.0"
          : "#,##0",
      suffix: props.suffixColumnPercent.includes(item.strColID) ? "%" : "",
      valueCallback: function (grid, column, footerIndex, columnFooter, value) {
        // "시:분" 문자열 평균 계산
        if (
          props.setFooterExpressions[
            props.setFooterColID.indexOf(item.strColID)
          ] === "avg" &&
          props.timeColumns.includes(item.strColID) // 👉 시간 평균을 계산할 컬럼ID만 지정
        ) {
          const cnt = grid.getItemCount();
          if (cnt === 0) return ""; // 조회 전 초기화 상태 -> 빈칸

          // secondsMode: true이면 MM:SS(분:초) 입력 처리, false이면 HH:MM(시:분)
          const secondsMode =
            props.timeColumnsSeconds &&
            props.timeColumnsSeconds.includes(item.strColID);

          // 총 초(정수) 합계
          let totalSeconds = 0;
          let rowCount = 0;

          for (let i = 0; i < cnt; i++) {
            let raw = grid.getValue(i, item.strColID);
            if (raw === null || raw === undefined) continue;
            let str = String(raw).trim();
            if (str === "") continue;

            // 부호 처리
            let sign = 1;
            if (str.startsWith("-")) {
              sign = -1;
              str = str.substring(1);
            } else if (str.startsWith("+")) {
              str = str.substring(1);
            }

            const parts = str
              .split(":")
              .map((p) => (p === "" ? NaN : Number(p)));

            if (
              parts.length === 3 &&
              !isNaN(parts[0]) &&
              !isNaN(parts[1]) &&
              !isNaN(parts[2])
            ) {
              // HH:MM:SS 형태
              const hh = parts[0],
                mm = parts[1],
                ss = parts[2];
              totalSeconds += sign * (hh * 3600 + mm * 60 + ss);
              rowCount++;
            } else if (
              parts.length === 2 &&
              !isNaN(parts[0]) &&
              !isNaN(parts[1])
            ) {
              if (secondsMode) {
                // MM:SS -> 초 단위
                const mm = parts[0],
                  ss = parts[1];
                totalSeconds += sign * (mm * 60 + ss);
              } else {
                // HH:MM -> 초 단위
                const hh = parts[0],
                  mm = parts[1];
                totalSeconds += sign * (hh * 3600 + mm * 60);
              }
              rowCount++;
            } else {
              // 포맷 이상하면 무시
              continue;
            }
          }

          if (rowCount === 0) return ""; // 계산 대상 없음

          // === 정수 기반 반올림 (부호 고려, 반올림: half-up) ===
          // secondsMode: 평균을 "초 단위"로 반올림
          // minutesMode: 평균을 "분 단위"로 반올림(그 후 HH:MM으로 표현)
          if (secondsMode) {
            // 반올림 기준: 분모 = rowCount
            // round(totalSeconds / rowCount) 안전 구현:
            //   if totalSeconds >= 0: floor((2*totalSeconds + rowCount) / (2*rowCount))
            //   else:                 ceil ((2*totalSeconds - rowCount) / (2*rowCount))
            let roundedSeconds;
            if (totalSeconds >= 0) {
              roundedSeconds = Math.floor(
                (2 * totalSeconds + rowCount) / (2 * rowCount)
              );
            } else {
              roundedSeconds = Math.ceil(
                (2 * totalSeconds - rowCount) / (2 * rowCount)
              );
            }

            if (roundedSeconds === 0) return "00:00"; // 0 -> "00:00" (사인 없음)

            const signStr = roundedSeconds < 0 ? "-" : "+";
            const absSec = Math.abs(roundedSeconds);
            const mm = Math.floor(absSec / 60);
            const ss = absSec % 60;

            return `${signStr}${String(mm).padStart(2, "0")}:${String(
              ss
            ).padStart(2, "0")}`;
          } else {
            // minutesMode: 반올림 대상 단위 = 분 (즉 초를 분으로 나눈 값의 반올림)
            // 안전 정수식:
            //   denom = rowCount * 60
            //   if totalSeconds >=0: floor( (totalSeconds + rowCount*30) / (rowCount*60) )
            //   else:                ceil ( (totalSeconds - rowCount*30) / (rowCount*60) )
            // 위 식은 half-up 기준의 반올림(부호 고려)을 정수 연산으로 수행
            const denom = rowCount * 60;
            let roundedMinutes;
            if (totalSeconds >= 0) {
              roundedMinutes = Math.floor(
                (totalSeconds + rowCount * 30) / denom
              );
            } else {
              roundedMinutes = Math.ceil(
                (totalSeconds - rowCount * 30) / denom
              );
            }

            if (roundedMinutes === 0) return "00:00";

            const signStr = roundedMinutes < 0 ? "-" : "";
            const absMin = Math.abs(roundedMinutes);
            const hh = Math.floor(absMin / 60);
            const mm = absMin % 60;

            return `${signStr}${String(hh).padStart(2, "0")}:${String(
              mm
            ).padStart(2, "0")}`;
          }
        }

        if (
          props.customFooterCalculate != "" &&
          props.customFooterCalculate == item.strColID
        ) {
          if (props.customFooterShowLast == false) {
            let sum = 0;
            let cnt = grid.getItemCount();
            for (let i = 0; i < cnt; i++) {
              let value = grid.getValue(i, "lngOrder");
              if (value == 1) {
                sum += grid.getValue(i, props.customFooterCalculate);
              }
            }
            return sum;
          } else {
            let cnt = grid.getItemCount();
            return grid.getValue(cnt - 1, props.customFooterCalculate);
          }
        }
        const regex =
          /(sum|avg|max|min|count)\(\s*([^)]+?)\s*\)|([+\-*/]|\b\d+\b)/gi;

        let tokens = [];
        let match;

        if (item.strTotalSumtext != "" && item.strTotalSumtext != "N") {
          while ((match = regex.exec(item.strTotalSumtext)) !== null) {
            if (match[1]) {
              // 함수 호출 패턴에 매칭된 경우
              tokens.push({
                type: "function",
                func: match[1], // "sum" 또는 "avg"
                field: match[2], // 괄호 안의 필드명 (공백 제거됨)
              });
            } else if (match[3]) {
              // 연산자에 매칭된 경우
              tokens.push({
                type: "operator",
                operator: match[3],
              });
            }
          }
          let returnText = "";
          for (let i = 0; i < tokens.length; i++) {
            if (tokens[i].type == "function") {
              returnText += `gridView.getSummary("${tokens[i].field}", "${tokens[i].func}")`;
            } else {
              returnText += tokens[i].operator;
            }
          }
          ////comsole.log(returnText)
          return eval(returnText) == "Infinity" ? 0 : eval(returnText);
        } else {
          return value;
        }
      },
    },

    datetimeFormat: item.strMask == "" ? "yyyy-MM-dd" : item.strMask, // sql 에서 mstgridinfo 에서 date  일때 기본값이 있고 정의할 수 있음
    width: item.intHdWidth,
    numberFormat:
      props.suffixColumnwon == "lngPrice" && item.strColID == "lngPrice"
        ? "#,##0"
        : item.strColType == "float"
        ? "#,##0"
        : item.strColType == "double" && item.strDisplay == "double"
        ? "#,##0.00"
        : item.strColType == "double" && item.strDisplay == "double2"
        ? "#,##0.000"
        : "#,##0.0",
    styleName:
      props.dynamicRowHeight == true
        ? "realgrid-pre-wrap"
        : item.strAlign == "left"
        ? "setTextAlignLeft"
        : item.strAlign == "center"
        ? "setTextAlignCenter"
        : "setTextAlignRight",
    // editor: {
    //   type: item.strColType.includes("dropdown")
    //     ? "dropdown"
    //     : item.strDisplay.includes("date")
    //     ? "date"
    //     : "line",
    //   domainOnly: true,
    //   textReadOnly: true,
    //   datetimeFormat: "yyyy-MM-dd",
    //   mask: {
    //     definitions:
    //       item.strColID == "strSTime" ||
    //       item.strColID == "strETime" ||
    //       item.strColID == "strWTime"
    //         ? {
    //             b: "[0-2]",
    //             c: "[0-9]",
    //             d: "[0-5]",
    //             e: "[0-9]",
    //           }
    //         : {},
    //     editMask:
    //       item.strColID == "strSTime" ||
    //       item.strColID == "strETime" ||
    //       item.strColID == "strWTime"
    //         ? "bc:de"
    //         : "",
    //     includedFormat: true,
    //     overWrite: true,
    //     allowEmpty: true,
    //   },
    //   commitOnSelect: true,
    //   inputCharacters:
    //     item.strColID == props.inputOnlyNumberColumn
    //       ? "0123456789"
    //       : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_ㄱ-힣!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~ ",
    // },
    editor: {
      type: item.strColType.includes("dropdown")
        ? "dropdown"
        : item.strDisplay.includes("date")
        ? "date"
        : "line",
      domainOnly: true,
      textReadOnly: true,
      dropDownWhenClick: true,
      datetimeFormat: "yyyy-MM-dd",
      mask:
        item.strColID == "strSTime" ||
        item.strColID == "strETime" ||
        item.strColID == "strWTime"
          ? {
              definitions: {
                b: "[0-2]",
                c: "[0-9]",
                d: "[0-5]",
                e: "[0-9]",
              },
              editMask: "bc:de",
              includedFormat: true,
              overWrite: true,
              allowEmpty: true,
            }
          : null,
      commitOnSelect: true,
      inputCharacters: props.inputOnlyNumberColumn
        .split(",")
        .includes(item.strColID)
        ? "0123456789"
        : item.strColID == props.inputOnlyNumberColumn2
        ? "0123456789."
        : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_ㄱ-힣!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~ ",
    },
    visible: item.intHdWidth !== 0,
    renderer: {
      type:
        item.strColID == "add" ||
        item.strColID == "add1" ||
        item.strColID == "add2"
          ? "button"
          : item.strColID.includes("checkbox") ||
            item.strDisplay.includes("checkbox") ||
            (item.strColID.includes("lngSupplierID") &&
              props.checkBarInactive == "lngSupplierID")
          ? "check"
          : item.strColType.includes("dropdown")
          ? "list"
          : "text",
      editable:
        props.checkRenderEditable == true &&
        (item.strColID.includes("checkbox") ||
          item.strDisplay.includes("checkbox"))
          ? true
          : false, // 체크박스의 렌더러의 기능만 false 되는걸로 말씀주셨고 추후에 문제시 한 번 더 체크해볼것
    },
    buttonVisibility: "always",
    styleCallback: props.checkAbleExpressionCol.includes(item.strColID)
      ? function (grid, dataCell) {
          const blnChk = grid
            .getDataSource()
            .getValue(dataCell.index.dataRow, props.checkAbleExpressionCol2);
          if (blnChk !== props.checkAbleExpressionVal) {
            return {
              renderer: {
                type: "check",
                editable: false,
                readOnlySetDisabled: true,
              },
            };
          }
        }
      : props.setCellStyleColId3 == true
      ? function (grid, dataCell) {
          // 시간값에 따라서 배경 색상 지정

          var ret = {};

          if (dataCell.dataColumn.header.text.includes("토")) {
            ret.style = { backgroundColor: "#ADD8E6" };
          } else if (dataCell.dataColumn.header.text.includes("/일")) {
            ret.style = { backgroundColor: "#FFC0CB" };
          }

          //  const value = grid.getValue(
          //   dataCell.index.itemIndex,
          //   "lngErrorCode"
          // );

          if (
            dataCell.value == "휴무" ||
            (dataCell.value.length == 1 && isNaN(parseInt(dataCell.value)))
          ) {
            ret.style = { backgroundColor: "#D3D3D3" };
          }

          return ret;
        }
      : props.setCellStyleColId2.includes(item.strColID) // 하드코딩
      ? function (grid, dataCell) {
          // 시간값에 따라서 배경 색상 지정
          var ret = {};
          ////console.log(item.strColID);
          const value = grid.getValue(dataCell.index.itemIndex, "lngErrorCode");
          if (
            item.strColID == "strPSTime" &&
            (value == 1 || value == 3 || value == 5 || value == 7)
          ) {
            ret.style = { backgroundColor: "#FF0000" };
          } else if (item.strColID == "strPSTime") {
            ret.style = { backgroundColor: "#8EE0FF" };
          } else if (
            item.strColID == "strPETime" &&
            (value == 1 || value == 3 || value == 5 || value == 7)
          ) {
            ret.style = { backgroundColor: "#FF0000" };
          } else if (item.strColID == "strPETime") {
            ret.style = { backgroundColor: "#FFFFFF" };
          } else if (
            item.strColID == "strPTTime" &&
            (value == 1 || value == 3 || value == 5 || value == 7)
          ) {
            ret.style = { backgroundColor: "#FF0000" };
          } else if (item.strColID == "strPTTime") {
            ret.style = { backgroundColor: "#FFFFFF" };
          } else if (
            item.strColID == "strPWTime" &&
            (value == 1 || value == 3 || value == 5 || value == 7)
          ) {
            ret.style = { backgroundColor: "#FF0000" };
          } else if (item.strColID == "strPWTime") {
            ret.style = { backgroundColor: "#BDFFCF" };
          } else if (
            item.strColID == "strPRTime" &&
            (value == 1 || value == 3 || value == 5 || value == 7)
          ) {
            ret.style = { backgroundColor: "#FF0000" };
          } else if (item.strColID == "strPRTime") {
            ret.style = { backgroundColor: "#FFFFFF" };
          } else if (
            item.strColID == "strWSTime" &&
            (value == 2 || value == 3 || value == 6 || value == 7)
          ) {
            ret.style = { backgroundColor: "#FF0000" };
          } else if (item.strColID == "strWSTime") {
            ret.style = { backgroundColor: "#8EE0FF" };
          } else if (
            item.strColID == "strWETime" &&
            (value == 2 || value == 3 || value == 6 || value == 7)
          ) {
            ret.style = { backgroundColor: "#FF0000" };
          } else if (item.strColID == "strWETime") {
            ret.style = { backgroundColor: "#FFFFFF" };
          } else if (
            item.strColID == "strWTTime" &&
            (value == 2 || value == 3 || value == 6 || value == 7)
          ) {
            ret.style = { backgroundColor: "#FF0000" };
          } else if (item.strColID == "strWTTime") {
            ret.style = { backgroundColor: "#FFFFFF" };
          } else if (
            item.strColID == "strWWTime" &&
            (value == 2 || value == 3 || value == 6 || value == 7)
          ) {
            ret.style = { backgroundColor: "#FF0000" };
          } else if (item.strColID == "strWWTime") {
            ret.style = { backgroundColor: "#BDFFCF" };
          } else if (
            item.strColID == "strWRTime" &&
            (value == 2 || value == 3 || value == 6 || value == 7)
          ) {
            ret.style = { backgroundColor: "#FF0000" };
          } else if (item.strColID == "strWRTime") {
            ret.style = { backgroundColor: "#FFFFFF" };
          } else if (
            item.strColID == "strRSTime" &&
            (value == 4 || value == 5 || value == 6 || value == 7)
          ) {
            ret.style = { backgroundColor: "#FF0000" };
          } else if (item.strColID == "strRSTime") {
            ret.style = { backgroundColor: "#8EE0FF" };
          } else if (
            item.strColID == "strRETime" &&
            (value == 4 || value == 5 || value == 6 || value == 7)
          ) {
            ret.style = { backgroundColor: "#FF0000" };
          } else if (item.strColID == "strRETime") {
            ret.style = { backgroundColor: "#FFFFFF" };
          } else if (
            item.strColID == "strRTTime" &&
            (value == 4 || value == 5 || value == 6 || value == 7)
          ) {
            ret.style = { backgroundColor: "#FF0000" };
          } else if (item.strColID == "strRTTime") {
            ret.style = { backgroundColor: "#FFFFFF" };
          } else if (
            item.strColID == "strRWTime" &&
            (value == 4 || value == 5 || value == 6 || value == 7)
          ) {
            ret.style = { backgroundColor: "#FF0000" };
          } else if (item.strColID == "strRWTime") {
            ret.style = { backgroundColor: "#BDFFCF" };
          } else if (
            item.strColID == "strRRTime" &&
            (value == 4 || value == 5 || value == 6 || value == 7)
          ) {
            ret.style = { backgroundColor: "#FF0000" };
          } else if (item.strColID == "strRRTime") {
            ret.style = { backgroundColor: "#FFFFFF" };
          }
          //  const hour = grid.getValue(dataCell.index.itemIndex, 'strTime').split(':')[0]
          //  const minute = grid.getValue(dataCell.index.itemIndex, 'strTime').split(':')[1]

          return ret;
        }
      : props.setCellStyleColId.includes(item.strColID)
      ? function (grid, dataCell) {
          // 시간값에 따라서 배경 색상 지정
          var ret = {};
          ////console.log(item.strColID);
          //  const hour = grid.getValue(dataCell.index.itemIndex, 'strTime').split(':')[0]
          //  const minute = grid.getValue(dataCell.index.itemIndex, 'strTime').split(':')[1]

          dataCell.value == "1"
            ? (ret.style = { backgroundColor: "#ADD8E6", color: "#ADD8E6" })
            : (ret.style = { backgroundColor: "#FFFFFF", color: "#FFFFFF" });

          return ret;
        }
      : props.ColCellRedColorColId.includes(item.strColID)
      ? function (grid, dataCell) {
          var ret = {};
          ret.style = { color: "#FF0000" };
          return ret;
        }
      : function (grid, dataCell) {
          var ret = {};

          if (
            (dataCell.item.rowState == "created" ||
              dataCell.item.itemState == "appending" ||
              dataCell.item.itemState == "inserting") &&
            props.rowStateeditable
          ) {
            ret.editable = true;
          } else if (props.editableColId.includes(item.strColID)) {
            ret.editable = true;
          } else if (
            props.rowStateeditable == true &&
            dataCell.item.itemState == "normal"
          ) {
            ret.editable = true;
          } else {
            ret.editable = false;
          }

          if (props.checkBarInactive != "") {
            var inActiveColumn = grid.getValue(
              dataCell.index.itemIndex,
              props.checkBarInactive
            );

            if (
              inActiveColumn == "0" &&
              (item.strColID == "checkbox" ||
                item.strDisplay.includes("checkbox"))
            ) {
              ret.style = { opacity: "0.5" };
              ret.renderer = { type: "check", editable: false };
            }
            if (item.strColID == "lngSupplierID") {
              ret.style = { opacity: "0.5" };
              ret.renderer = { type: "check", editable: false };
            }
          }

          return ret;
        },
  }));

  if (props.labelingColumns != "") {
    const lcolumns = props.labelingColumns.split(",");
    const labels = props.labelsData;
    const values = props.valuesData;
    // //comsole.log(lcolumns)
    // //comsole.log(labels)
    // //comsole.log(values)
    for (var i = 0; i < lcolumns.length; i++) {
      const labelingcolumn = columns.find(
        (item) => item.fieldName == lcolumns[i]
      );

      if (labelingcolumn) {
        labelingcolumn.lookupDisplay = true;

        labelingcolumn.values = values[i];
        labelingcolumn.labels = labels[i];
      }
      //comsole.log(labelingcolumn);
    }
  }

  if (props.setNumberformatColumn != "") {
    let formatcolumn = columns.find(
      (item) => item.fieldName == props.setNumberformatColumn
    );
    if (formatcolumn) {
      formatcolumn.numberFormat = "#,##0.00";
    }
  }

  if (props.setRowGroupSpan != "") {
    const mergeColumn = props.setRowGroupSpan.split(",");
    for (var i = 0; i < mergeColumn.length; i++) {
      const rowGroupSpanColumn = columns.find(
        (item) => item.fieldName == mergeColumn[i]
      );
      if (rowGroupSpanColumn) {
        rowGroupSpanColumn.mergeRule = { criteria: "value" };
      }
    }
  }
  if (props.setRowGroupSpan2 != "") {
    const mergeColumn = props.setRowGroupSpan2.split(",");
    const maskColumns = props.mergeMask.split(",");
    for (var i = 0; i < mergeColumn.length; i++) {
      const rowGroupSpanColumn = columns.find(
        (item) => item.fieldName == mergeColumn[i]
      );
      let maskdata = "value";
      if (props.mergeMask != "") {
        const mask = maskColumns.map((item) => item);

        for (let i = 0; i < mask.length; i++) {
          maskdata = "values['" + mask[i] + "']+";
        }
        maskdata = maskdata + "value";
      } else {
        maskdata = "value";
      }

      if (rowGroupSpanColumn) {
        rowGroupSpanColumn.mergeRule = { criteria: maskdata };
      }
    }
  }

  gridView.setColumns(columns);
  // 4구간
  if (props.setRowStyleCalls) {
    gridView.setRowStyleCallback((grid, item, fixed) => {
      if (props.setRowStyleLevel == 1) {
        let Value = grid.getValue(item.index, props.setRowStyleCallsDefaultCol);

        if (props.hardCodeSetRowStyleCalls == false) {
          if (Value) {
            if (
              Value.toString().substring(Value.length - 1) == "2" ||
              Value.substring(Value.length - 1) == "3"
            ) {
              return "blue";
            } else if (Value.substring(Value.length - 1) == "8") {
              return "pink";
            } else if (Value.substring(Value.length - 1) == "9") {
              return "navy";
            }
          }
        } else {
          let Value2 = grid.getValue(
            item.index,
            props.setRowStyleCallsDefaultCol2
          );

          if (Value == "소계" || Value2 == "소계") {
            return "blue";
          } else if (Value == "합계" || Value2 == "합계") {
            return "pink";
          }
        }
      } else if (props.setRowStyleLevel == 2) {
        let ret = {};
        let Value = grid.getValue(item.index, "lngOrder");

        if (Value == 1) {
          return "blue";
        }
      }
    });
  }

  if (props.setGroupFooterExpressions != []) {
    for (let i = 0; i < props.setGroupFooterExpressions.length; i++) {
      if (props.setGroupFooterExpressions[i] != "custom") {
        continue;
      }
      if (gridView.columnByField(props.setGroupFooterColID[i])) {
        gridView.columnByField(
          props.setGroupFooterColID[i]
        ).groupFooter.valueCallback = function (
          grid,
          cell,
          footerIndex,
          footerModel,
          value
        ) {
          if (props.setGroupSumCustomLevel == 1) {
            if (props.setGroupFooterColID[i] == "dtmDate") {
              return formatLocalDate(
                dataProvider.getValue(footerModel.firstItem.dataRow, "dtmDate")
              );
            }
            return dataProvider.getValue(
              footerModel.firstItem.dataRow,
              props.setGroupFooterColID[i]
            );
          } else if (props.setGroupSumCustomLevel == 2) {
            return "";
          }
        };
      }
    }
  }

  for (let i = 0; i < props.setGroupSumCustomColumnId2.length; i++) {
    if (gridView.columnByField(props.setGroupSumCustomColumnId2[i])) {
      gridView.columnByField(
        props.setGroupSumCustomColumnId2[i]
      ).groupFooter.valueCallback = function (
        grid,
        column,
        footerIndex,
        columnFooter,
        value
      ) {
        if (props.setGroupSumCustomText3 != []) {
          if (columnFooter.level == i + 1) {
            return props.setGroupSumCustomText3[i];
          }
        }

        if (props.setGroupCustomLevel == "3") {
          if (columnFooter.level == 2) {
            const a = props.setGroupSumCustomText2[i][0];
            return a;
          } else if (columnFooter.level == 1) {
            const b = props.setGroupSumCustomText2[i][1];
            return b;
          }
        }
        if (props.setGroupCustomLevel == "2") {
          return "매장소계";
        }
        if (props.setGroupColumnId.split(",").length == 1) {
          return "소계";
        }

        if (columnFooter.level == 2) {
          return "소계";
        } else if (columnFooter.level == 1) {
          return "매장소계";
        }
      };
    }
  }

  for (let i = 0; i < props.setGroupSumCustomColumnId3.length; i++) {
    if (gridView.columnByField(props.setGroupSumCustomColumnId3[i])) {
      gridView.columnByField(
        props.setGroupSumCustomColumnId3[i]
      ).groupFooter.valueCallback = function (
        grid,
        cell,
        footerIndex,
        footerModel,
        value
      ) {
        if (footerModel.level == i + 1) {
          if (
            dataProvider.getValue(
              footerModel.firstItem.dataRow,
              props.setGroupSumCustomColumnId3[i]
            ) instanceof Date
          ) {
            return formatLocalDate(
              dataProvider.getValue(
                footerModel.firstItem.dataRow,
                props.setGroupSumCustomColumnId3[i]
              )
            );
          }
          return (
            dataProvider.getValue(
              footerModel.firstItem.dataRow,
              props.setGroupSumCustomColumnId3[i]
            ) + " 소계"
          );
        }
      };
    }
  }

  if (props.mergeColumns == true) {
    const subList = props.mergeColumnGroupSubList.split(","); // subList 분리
    const layout1 = []; // 최종 결과 배열
    let groupItems = null; // 그룹 아이템을 담을 객체

    tabInitSetArray.value.forEach((item, index) => {
      const uniqueColumnName = item.strHdText;
      if (!layout1.some((layout) => layout.column === uniqueColumnName)) {
        if (subList.includes(item.strColID)) {
          // subList에 포함된 값들로 그룹을 만듭니다.
          if (!groupItems) {
            groupItems = {
              name: props.mergeColumnGroupName, // 예시로 "companyGroup" 사용
              direction: "horizontal",
              items: [],
              header: {
                text: props.mergeColumnGroupName,
                styleName: `header-style-0`,
              },
            };
          }
          groupItems.items.push(item.strHdText); // 그룹에 항목 추가
        } else {
          layout1.push({
            column: item.strHdText,
            header: { visible: true, text: item.strHdText },
            visible: item.intHdWidth !== 0,
            width: item.intHdWidth,
          });
        }
        // 완벽한 해결이 아닌 것 같아서 추후에 에러날 가능성 존재
      } else {
        layout1.push({
          column: item.strColID,
          header: { visible: true, text: item.strHdText },
          visible: item.intHdWidth !== 0,
          width: item.intHdWidth,
        });
      }
    });

    // 그룹이 존재하면 layout1에 추가
    if (groupItems) {
      layout1.unshift(groupItems); // layout1의 첫 번째에 그룹 객체를 추가
    }

    gridView.setColumnLayout(layout1);
  }

  function getInnerMostIndex(colID, subList3) {
    for (let i = 0; i < subList3.length; i++) {
      const group2D = subList3[i];
      for (let j = 0; j < group2D.length; j++) {
        const group1D = group2D[j];
        const innerMostIndex = group1D.indexOf(colID);
        if (innerMostIndex !== -1) {
          return innerMostIndex;
        }
      }
    }
    return -1; // 못 찾으면 -1
  }

  if (props.mergeColumns2 == true) {
    const subList = props.mergeColumnGroupSubList2; // [['column1','column2'],['column3','column4']]
    const groupList = props.mergeColumnGroupName2; // ['그룹컬럼1','그룹컬럼2']
    let layout = [];
    tabInitSetArray.value.forEach((item) => {
      if (subList.flat().includes(item.strColID)) {
        const index = subList.findIndex((innerArray) =>
          innerArray.includes(item.strColID)
        );

        if (layout.find((item) => item.name == groupList[index])) {
          const findit = layout.find((item) => item.name == groupList[index]);

          if (findit) {
            findit.items.push(item.strColID);
          }
        } else {
          layout.push({
            name: groupList[index],
            direction: "horizontal",
            hideChildHeaders: props.hideChildHeader,
            items: [item.strColID],
            header: {
              text: groupList[index],
              styleName: `header-style-0`,
            },
          });
          // layout.push(tempgroupList)
        }
      } else {
        layout.push({
          column: item.strColID,
          name: item.strHdText,
          hideChildHeaders: props.hideChildHeader,
          header: { visible: true, text: item.strHdText },
          visible: item.intHdWidth !== 0,
          width: item.intHdWidth,
        });
      }
    });

    gridView.setColumnLayout(layout);
  }

  if (props.mergeColumns3 == true) {
    const subList3 = props.mergeColumnGroupSubList3; // [[['column1','column2'],['column3','column4']]]
    const groupList3 = props.mergeColumnGroupName4; // ['최상위그룹컬럼']
    const groupList2 = props.mergeColumnGroupName3; // [['그룹컬럼1','그룹컬럼2']]

    let layout = [];
    tabInitSetArray.value.forEach((item) => {
      // 1) subList3 전체 1차 그룹 인덱스 찾기
      const groupIndex = subList3.findIndex((group2D) =>
        group2D.some((group1D) => group1D.includes(item.strColID))
      );

      // 2) 만약 그룹에 속한다면, 그 안에서 몇 번째 subgroup인지(innerIndex)
      let innerIndex = -1;
      if (groupIndex !== -1) {
        innerIndex = subList3[groupIndex].findIndex((group1D) =>
          group1D.includes(item.strColID)
        );
      }

      if (groupIndex !== -1) {
        if (
          groupList3[groupIndex] == undefined &&
          groupList2[groupIndex][innerIndex] != undefined
        ) {
          if (
            layout.find(
              (item) => item.name == groupList2[groupIndex][innerIndex]
            )
          ) {
            const target = layout.find(
              (item) => item.name == groupList2[groupIndex][innerIndex]
            );

            target.items.push({
              column: item.strColID,
              width: item.intHdWidth,
            });
          } else if (
            groupList3[groupIndex] != undefined &&
            groupList2[groupIndex][innerIndex] != undefined
          ) {
            const findit = layout.find(
              (item) => item.name == groupList3[groupIndex]
            );
            if (findit == undefined) {
              layout.push({
                name: groupList3[groupIndex],
                direction: "horizontal",
                header: {
                  styleName: `header-style-0`,
                },
                items: [
                  {
                    name: groupList2[groupIndex][innerIndex],
                    direction: "horizontal",
                    header: { styleName: "header-style-0" },
                    items: [{ column: item.strColID, width: item.intHdWidth }],
                  },
                ],
              });
            } else {
              const findit2 = findit.items.find(
                (item) => item.name == groupList2[groupIndex][innerIndex]
              );
              findit2.items.push({
                column: item.strColID,
                width: item.intHdWidth,
              });
            }
          }
        }
      } else {
        layout.push({
          column: item.strColID,

          visible: item.intHdWidth !== 0,
          width: item.intHdWidth,
        });
      }
    });

    gridView.setColumnLayout(layout);
  }
  /* 3단 예시
  [
      {
        column: "checkbox",
        visible: true,
        width: 50,
      },
      {
        column: "strStndName",
        visible: true,
        width: 100,
      },
      {
        column: "strWorkType",
        visible: true,
        width: 100,
      },
      {
        column: "lngOTPayRate",
        visible: true,
        width: 90,
      },
      {
        column: "lngHWPayRate",
        visible: true,
        width: 90,
      },
      {
        name: "야간근무시간",
        direction: "horizontal",
        header: { styleName: "header-style-0" },
        items: [
          { column: "timNWStime", width: 50 },
          { column: "timNWETime", width: 50 },
        ],
      },
      {
        column: "lngWHPayRate",
        visible: true,
        width: 70,
      },
      {
        name: "급여기산일",
        direction: "horizontal",
        header: { styleName: "header-style-0" },
        items: [
          { column: "lngPayAcntS", width: 50 },
          { column: "lngPayAcntE", width: 50 },
        ],
      },
      {
        column: "lngPayDay",
        visible: true,
        width: 50,
      },
      {
        column: "lngEPayDay",
        visible: true,
        width: 80,
      },
      {
        column: "lngPeriod",
        visible: false,
        width: 0,
      },
      {
        column: "lngPeriodCls",
        visible: false,
        width: 0,
      },
      {
        column: "lngWorkType",

        visible: false,
        width: 0,
      },
      {
        column: "lngCode",
        visible: false,
        width: 0,
      },
      {
        name: "탄력근무제 관련",
        direction: "horizontal",
        header: { styleName: "header-style-0" },
        items: [
          {
            name: "기본",
            direction: "horizontal",
            header: { styleName: "header-style-0" },
            items: [
              { column: "strPeriod", width: 50 },
              { column: "dtmApplyDate", width: 50 },
              { column: "timFixWorkHour", width: 50 },
            ],
          },
          {
            name: "연장제한시간",
            direction: "horizontal",
            header: { styleName: "header-style-0" },
            items: [
              { column: "timLimitHourWeek", width: 50 },
              { column: "timLimitHourWeekAvg", width: 50 },
              { column: "timLimitHourDay", width: 50 },
            ],
          },
        ],
      },
    ]
  */

  emit("allStateRows", dataProvider.getAllStateRows());
  // 데이터 추가
  // 5구간
  dataProvider.setRows(props.rowData);
  //
  // 기타 옵션
  gridView.rowIndicator.width = 50;
  gridView.setFooters({ visible: props.setFooter == false ? false : true });
  gridView.setRowIndicator({ visible: props.setRowIndicator });
  gridView.setCheckBar({
    visible: props.showCheckBar,
    exclusive: props.excludeCheck,
  });
  //gridView.displayOptions.fitStyle = "even";
  gridView.sortingOptions.enabled = true;
  gridView.sortingOptions.commitBeforeSorting = true;
  gridView.editOptions.editable =
    props.checkRenderEditable == true ? true : false;
  gridView.editOptions.updatable = true;
  gridView.editOptions.deletable = true;
  gridView.displayOptions.fitStyle =
    props.fixedColumn == false ? "even" : "none";
  gridView.editOptions.commitByCell = true;
  gridView.editOptions.commitByCell = true;
  gridView.editOptions.commitWhenLeave = true;
  gridView.displayOptions.showInnerFocus = false;
  gridView.displayOptions.useAlternateRowStyle = props.useAlternateRowStyle
    ? true
    : false;
  dataProvider.softDeleting = props.notsoftDelete == false ? true : false;
  dataProvider.deleteCreated = props.deleteCreated;
  gridView.filteringOptions.handleVisibility = "hidden";
  //gridView.sortingOptions.enabled = false; // 정렬기능 비활성화
  dataProvider.autoCommit = true; // 자동 커밋 활성화
  dataProvider.commitBeforeDataEdit = true;
  gridView.editOptions.movable = props.dragOn == true ? true : false;
  gridView.displayOptions.selectAndImmediateDrag =
    props.dragOn == true ? true : false;
  gridView.displayOptions.selectionStyle =
    props.dragOn == true ? "block" : props.selectionStyle;
  // props.selectionStyle;deleteRow
  gridView.displayOptions.showTooltip = true;
  gridView.displayOptions.rowHeight = props.dynamicRowHeight == true ? -1 : 1;

  gridView.groupPanel.visible = false;
  gridView.displayOptions.watchDisplayChange = false;
  gridView.filterMode = "explicit";
  gridView.checkBar.fieldName = "checkbox";
  gridView.rowIndicator.draggableSelectedRows = true;
  gridView.displayOptions.syncGridHeight =
    props.syncGridHeight == true ? "always" : "none";
  gridView.disabled = props.disabled;

  if (props.suffixColumnPercent != []) {
    for (let i = 0; i < props.suffixColumnPercent.length; i++) {
      if (gridView.columnByName(props.suffixColumnPercent[i])) {
        gridView.columnByName(props.suffixColumnPercent[i]).suffix = "%";
      }
    }
  }
  if (props.suffixColumnJul != []) {
    for (let i = 0; i < props.suffixColumnJul.length; i++) {
      gridView.columnByName(props.suffixColumnJul[i]).suffix = "줄";
    }
  }
  if (props.suffixColumnheng != []) {
    for (let i = 0; i < props.suffixColumnheng.length; i++) {
      gridView.columnByName(props.suffixColumnheng[i]).suffix = "회";
    }
  }
  if (props.suffixColumnwon == "lngPrice") {
    if (gridView.columnByName(props.suffixColumnwon)) {
      gridView.columnByName(props.suffixColumnwon).suffix = "원";
    }
  }

  if (props.hideColumnNow == true) {
    if (gridView.columnByField(props.hideColumn)) {
      gridView.columnByField(props.hideColumn).visible = false;
    }
  }

  if (props.hideColumnsId != []) {
    for (var i = 0; i < props.hideColumnsId.length; i++) {
      if (gridView.columnByField(props.hideColumnsId[i])) {
        gridView.columnByField(props.hideColumnsId[i]).visible = false;
      }
    }
  }

  watch(
    () => props.hideColumnsId,
    () => {
      if (gridView != null) {
        for (let i = 0; i < gridView.getColumns().length; i++) {
          if (gridView.getColumns()[i].width != 0) {
            gridView.columnByField(
              gridView.getColumns()[i].name
            ).visible = true;
          }
        }
        for (var i = 0; i < props.hideColumnsId.length; i++) {
          if (gridView.columnByField(props.hideColumnsId[i])) {
            gridView.columnByField(props.hideColumnsId[i]).visible = false;
          }
        }
      }
    }
  );

  if (props.setGroupFooter == true) {
    gridView.setRowGroup({
      expandedAdornments: "footer",
      sorting: false,
      collapsedAdornments: "none",
      headerStatement: "",
      expanderVisibility: false,
      mergeMode: props.setMergeMode,
      createFooterCallback: function (grid, group) {
        return true;
      },
    });

    gridView.groupBy(props.setGroupColumnId.split(","));

    if (props.setGroupOrderByColumnId != "") {
      //comsole.log(props.setGroupColumnId);
      if (gridView && gridView.getDataSource().getOrgFieldNames().length != 0) {
        ////console.log(props.setGroupOrderByColumnId.split(","));
        // //console.log(gridView.getDataSource().getOrgFieldNames());
        //gridView.orderBy(["strStore"]);
        gridView.orderBy(props.setGroupOrderByColumnId.split(","));
      }
    }
  }

  if (props.setFooter == true) {
    gridView.setOptions({ summaryMode: "aggregate" });
  }

  if (props.setStateBar == false) {
    gridView.setStateBar({
      visible: false,
    });
  }
  gridView.headerSummaries.visible = false; // 그룹핑 할때 상단 요약값 없애는 설정

  for (let i = dataProvider.getRowCount() - 1; i >= 0; i--) {
    // 역순으로 순회
    const rowData = dataProvider.getJsonRow(i);
    if (rowData.deleted) {
      dataProvider.removeRow(i); // 해당 행 삭제
    }
  }

  if (props.useCheckboxfordelete == true) {
    const alldata = dataProvider.getJsonRows();
    for (var i = 0; i < alldata.length; i++) {
      if (alldata[i].checkbox == false || alldata[i].checkbox == undefined) {
        dataProvider.setRowState(i, "none");
      } else if (alldata[i].checkbox == true) {
        dataProvider.setRowState(i, "deleted");
      }
    }
  }
  // 6구간
  // 이벤트 설정
  gridView.onDataLoadComplated = function (grid) {
    grid.refresh(true);
    grid.resetSize();
  };

  gridView.onCellEdited = function (grid, itemIndex, row, field) {
    gridView.commit();

    if (props.checkRowAuto2 == true) {
      const val = grid.getDataSource().getValue(row, props.checkRowAuto2Col); // 셀 클릭시 checkautoRow  = false 하고 셀 클릭과 내장 체크바가 연동안되게하면서 이 방식으로 체크박스가 체크되었을때만체크되게 설정
      grid.checkRow(row, val);
    }
    if (props.checkonlyone == true) {
      if (field == 0) {
        const bool = dataProvider.getValue(row, field);
        ////console.log(bool);
        if (bool == true) {
          dataProvider.setValue(row, "checkbox2", false);
        }
      } else if (field == 1) {
        const bool = dataProvider.getValue(row, field);
        ////console.log(bool);
        if (bool == true) {
          dataProvider.setValue(row, "checkbox1", false);
        }
      }
    }
    if (props.checkOnlyFalse == true) {
      dataProvider.setValue(row, "Selected", false);
    }

    updatedrowData.value = [...dataProvider.getJsonRows()];
    emit("updatedRowData", updatedrowData.value);
    emit("allStateRows", dataProvider.getAllStateRows());

    if (
      props.checkedRowData2Col != "" &&
      gridView.columnByField(dataProvider.getOrgFieldName(field)).name ==
        props.checkedRowData2Col
    ) {
      const checkedRowData2 = dataProvider.getRows()[row];
      emit("checkedRowData2", checkedRowData2);
    }
  };

  gridView.onItemChecked = function (grid, itemIndex, checked) {
    gridView.setCurrent({ dataRow: itemIndex });

    // dataProvider.beginUpdate();
    // if (gridView.isCheckedRow(itemIndex)) {
    //   grid.checkItem(itemIndex, false);
    // } else {
    //   grid.checkItem(itemIndex);
    // }

    ////console.log(checked);
    var rows = gridView.getCheckedRows();
    ////console.log(rows);
    selectedRowData.value = [];
    for (var i in rows) {
      var data = dataProvider.getJsonRow(rows[i]);
      selectedRowData.value.push(data);
      ////console.log(selectedRowData.value);
    }
    emit("checkedRowData", selectedRowData.value);
    ////console.log(selectedRowData.value);

    emit("checkedRowIndex", rows);
    updatedrowData.value = [...dataProvider.getJsonRows()];
    // dataProvider.endUpdate();
    //selectedRowData.value.index = itemIndex;
  };
  gridView.onItemAllChecked = (grid, checked) => {
    //console.log("전체체크");

    selectedRowData.value = gridView
      .getCheckedItems()
      .map((index) => dataProvider.getRows()[index]);
    emit("selcetedrowData", selectedRowData.value);
    var rows = gridView.getCheckedRows();
    selectedRowData.value = [];
    for (var i in rows) {
      var data = dataProvider.getJsonRow(rows[i]);
      selectedRowData.value.push(data);
    }
    emit("checkedRowData", selectedRowData.value);

    // updatedrowData.value = [...dataProvider.getJsonRows()];
    // emit("updatedRowData", updatedrowData.value);
  };

  dataProvider.onDataChanged = function (provider) {
    gridView.commit();
    updatedrowData.value = [...dataProvider.getJsonRows()];

    // emit("updatedRowData", updatedrowData.value);
    const a = updatedrowData.value.filter((item) => item.checkbox == true);
    // selectedRowData.value = []

    //emit("allStateRows", dataProvider.getAllStateRows());
    //emit("checkedRowData", a);
  };

  gridView.onCellItemClicked = function (grid, clickData) {
    if (clickData.itemIndex == undefined || clickData.itemIndex == -1) {
      return;
    }

    var current = gridView.getCurrent();
    selectedindex.value = current.dataRow;
    selectedRowData.value = dataProvider.getRows()[current.dataRow];
    emit("buttonClicked", selectedRowData.value);
    emit("clickedButtonCol", clickData.fieldName);
    emit("selcetedrowData", selectedRowData.value);
    emit("selectedIndex", clickData.dataRow);
    emit("selectedIndex2", clickData.dataRow);
    emit("allStateRows", dataProvider.getAllStateRows());
  };

  gridView.onSelectionChanged = function (grid) {
    var current = gridView.getCurrent();

    selectedRowData.value = dataProvider.getRows()[current.dataRow];
    if (selectedRowData.value) {
      selectedRowData.value.index = current.dataRow;

      emit("selectedIndex", current.dataRow);
    }
  };

  gridView.onShowTooltip = function (grid, index, value) {
    var column = index.fieldName;
    var itemIndex = index.itemIndex;
    if (props.showTooltip == true) {
      var tooltip = "";
      if (column == "checkbox" && grid.getValue(itemIndex, "lngMenu") == "0") {
        tooltip =
          "해당 결제코드는 할인대상메뉴가 '전체 선택'이므로, 모든 메뉴에 적용되었습니다.";
      }
      return tooltip;
    }
  };

  gridView.onCellClicked = function (grid, clickData) {
    if (clickData.cellType == "check") {
      return;
    }
    if (clickData.cellType === "header") {
      gridView.setCurrent({ dataRow: selectedindex.value });
    }
    if (clickData.itemIndex == undefined || clickData.itemIndex == -1) {
      return;
    }

    var current = gridView.getCurrent();
    ////console.log(current);
    if (current.itemIndex !== -1) {
      emit("selectedIndex", current.dataRow);
      emit("selectedIndex2", current.dataRow);

      selectedRowData.value = dataProvider.getRows()[clickData.dataRow];
      //dataProvider.checkRowStates(false);
      if (props.excludeCheck == true) {
        gridView.checkAll(false); // checkrowstates
      }

      //if(props.cellclickcheck)
      if (props.checkRowAuto == true) {
        // 내장 체크바와 연동할건지 말건지를 결정하는 부분 false하면 셀 클릭시 내장 체크바는 선택안됨
        if (gridView.isCheckedRow(clickData.itemIndex)) {
          if (props.hideCheckBarList == false) {
            grid.checkItem(clickData.itemIndex, false);
          } else {
            if (
              props.hideCheckBarList == true &&
              selectedRowData.value[4] != "0"
            ) {
              grid.checkItem(clickData.itemIndex, false);
            }
          }
        } else {
          if (props.hideCheckBarList == false) {
            grid.checkItem(clickData.itemIndex);
          } else {
            if (
              props.hideCheckBarList == true &&
              selectedRowData.value[4] != "0"
            ) {
              grid.checkItem(clickData.itemIndex);
            }
          }
        }
      }

      // if (props.showCheckRowDataByForce) {
      //   var rows = gridView.getCheckedRows();
      //   ////console.log(rows)
      //   selectedRowData.value = [];
      //   for (var i in rows) {
      //     var data = dataProvider.getJsonRow(rows[i]);
      //     selectedRowData.value.push(data);
      //   }

      //   emit("checkedRowData", selectedRowData.value);
      // }

      // dataProvider.checkRowStates(true);
      selectedRowData.value = dataProvider.getRows()[current.dataRow];
      if (selectedRowData.value) {
        const rowState = dataProvider.getRowState(clickData.dataRow);
        if (selectedRowData.value) {
          selectedRowData.value.index = current.dataRow;
          selectedRowData.value.rowState = rowState;
        }
        selectedindex.value = current.dataRow;

        //comsole.log(rowState);
        emit("sendRowState", rowState);

        emit("clickedRowData", selectedRowData.value);
      }
    }
    emit("clickedButtonCol", clickData.fieldName);
    emit("allStateRows", dataProvider.getAllStateRows());
  };

  gridView.onColumnCheckedChanged = function (grid, col, chk) {
    //console.log("헤더 전체체크");
    var rowCount = dataProvider.getRowCount(); // 전체 행의 개수
    dataProvider.beginUpdate();
    if (props.ExceptionCheck != "") {
      for (var i = 0; i < rowCount; i++) {
        if (grid.getValue(i, props.ExceptionCheck) !== "0") {
          dataProvider.setValue(i, col.fieldName, chk);
        }
      }
    } else {
      if (props.checkAbleExpressionCol == "") {
        for (var i = 0; i < rowCount; i++) {
          dataProvider.setValue(i, col.fieldName, chk);
        }
      } else {
        for (var i = 0; i < rowCount; i++) {
          const getblnCheck = dataProvider.getValue(
            i,
            props.checkAbleExpressionCol2
          );

          if (getblnCheck == props.checkAbleExpressionVal) {
            dataProvider.setValue(i, col.fieldName, chk);
            const index = dataProvider.getDataRowId(i);
            gridView.checkRow(index, chk);
          }
        }
      }
    }
    dataProvider.endUpdate();
    var rows = gridView.getCheckedRows();
    console.log(rows);
    selectedRowData.value = [];
    for (var i in rows) {
      var data = dataProvider.getJsonRow(rows[i]);
      selectedRowData.value.push(data);
    }

    emit("checkedRowData", selectedRowData.value);
    emit("checkedRowIndex", rows);
    updatedrowData.value = [...dataProvider.getJsonRows()];

    emit("updatedRowData", updatedrowData.value);
    emit("allStateRows", dataProvider.getAllStateRows());
    //comsole.log(col.fieldName + "was checked as: " + chk);

    emit("checkAllorNot", chk, col.fieldName);
  };

  gridView.dataDropOptions.callback = function (
    source,
    sourceItems,
    target,
    targetItem
  ) {
    const provider = gridView.getDataSource();
    const sourceStartIndex = sourceItems[0];
    const sourceCount = sourceItems.length;

    const targetIndex =
      targetItem > sourceStartIndex ? targetItem - sourceCount + 1 : targetItem;

    if (sourceCount === 1) {
      provider.moveRow(sourceStartIndex, targetItem);
    } else {
      provider.moveRows(sourceStartIndex, sourceCount, targetIndex);
    }

    updatedrowData.value = [...dataProvider.getJsonRows()];

    emit("updatedRowData", updatedrowData.value);
  };

  gridView.onCellDblClicked = function (grid, clickData) {
    if (clickData.itemIndex == undefined) {
      return;
    }

    selectedRowData.value = dataProvider.getRows()[clickData.itemIndex];
    if (selectedRowData.value) {
      selectedRowData.value.index = clickData.itemIndex;
      emit("dblclickedRowData", selectedRowData.value);
    }
  };
};

// 7구간
watch(
  () => props.changeValue,
  () => {
    dataProvider.setValue(
      props.changeRow,
      props.changeColid,
      props.changeValue
    );

    updatedrowData.value = [...dataProvider.getJsonRows()];

    emit("updatedRowData", updatedrowData.value);
  }
);
watch(
  () => props.changeNow,
  () => {
    dataProvider.beginUpdate();

    if (props.changeRow !== "" && props.changeRow != -1) {
      dataProvider.setValue(
        props.changeRow,
        props.changeColid,
        props.changeValue2
      );
      dataProvider.endUpdate();
      updatedrowData.value = [...dataProvider.getJsonRows()];

      const dataRow = gridView.getCurrent().dataRow;
      selectedRowData.value = dataProvider.getRows()[dataRow];
      emit("clickedRowData", selectedRowData.value);
      emit("updatedRowData", updatedrowData.value);
      emit("updatedRowData2", updatedrowData.value);
      emit("allStateRows", dataProvider.getAllStateRows());
    }
  }
);

watch(
  () => props.changeNow2,
  () => {
    console.log(props.changeNow2);

    if (props.changeRow !== "" && props.changeRow != -1) {
      if (
        dataProvider != null &&
        dataProvider != undefined &&
        dataProvider.getJsonRows().length != 0
      ) {
        dataProvider.setValue(
          props.changeRow,
          props.changeColid,
          props.changeValue2
        );
      }

      updatedrowData.value = [...dataProvider.getJsonRows()];

      const dataRow = gridView.getCurrent().dataRow;
      selectedRowData.value = dataProvider.getRows()[dataRow];
      // emit("updatedRowData", updatedrowData.value);
      emit("allStateRows", dataProvider.getAllStateRows());
      emit("updatedRowData2", updatedrowData.value);
    }
  }
);

watch(
  () => props.changeNow3,
  () => {
    //comsole.log(props.changeRow);
    dataProvider.beginUpdate();
    if (props.changeRow !== "" && props.changeRow != -1) {
      if (
        dataProvider != null &&
        dataProvider != undefined &&
        dataProvider.getJsonRows().length != 0
      ) {
        dataProvider.setValue(
          props.changeRow,
          props.changeColid,
          props.changeValue2
        );
      }
      dataProvider.endUpdate();
      // updatedrowData.value = [...dataProvider.getJsonRows()];

      // const dataRow = gridView.getCurrent().dataRow;
      // selectedRowData.value = dataProvider.getRows()[dataRow];
    }
  }
);

watch(
  () => props.getRowChanged,
  () => {
    emit("allStateRows", dataProvider.getAllStateRows());
    updatedrowData.value = [...dataProvider.getJsonRows()];
    emit("updatedRowData", updatedrowData.value);
  }
);

watch(
  () => props.initCheckRowNow,
  () => {
    gridView.checkAll(false);
    for (let i = 0; i < props.initCheckRows.length; i++) {
      gridView.checkRow(props.initCheckRows[i], true);
    }
  }
);

// onMounted(() => {
//   //comsole.log("asdf");
// });

watch(
  () => [props.searchWord3, props.searchValue, props.searchSpecialCond],
  () => {
    let criteria2 = props.searchColId.split(",");

    let criteria3 = `(value match '${props.searchWord3}')`;

    let criteria4 = props.searchSpecialColId;
    ////console.log(props.searchWord3, props.searchValue, props.searchColId);
    let filter4 = [
      {
        name: "미설정메뉴",
        criteria: props.searchSpecialCond2,
        active: true,
      },
    ];

    if (props.activeSearchSpecial == true) {
      if (props.searchSpecialCond == false) {
        for (let i = 0; i < criteria4.length; i++) {
          if (gridView !== undefined && gridView != null) {
            gridView.setColumnFilters(criteria4[i], filter4);
          }
        }
      } else {
        for (let i = 0; i < criteria4.length; i++) {
          if (gridView !== undefined && gridView != null) {
            gridView.setColumnFilters(criteria4[i], []);
          }
        }
      }
    }
    for (let i = 1; i < criteria2.length; i++) {
      criteria3 +=
        " or (values['" + criteria2[i] + `'] match '${props.searchWord3}')`;
    }
    let filter = [
      {
        name: "검색조건",
        criteria: criteria3,
        active: true,
      },
    ];
    let filter2 = [];
    if (props.searchColId3 != []) {
      filter2.push([
        {
          name: "검색조건0",
          criteria: `(value = '${props.searchValue[0]}')`,
          active: true,
        },
      ]);
      for (let i = 1; i < props.searchColId3.length; i++) {
        filter2.push([
          {
            name: "검색조건" + i,
            criteria: `(value = '${props.searchValue[i]}')`,
            active: true,
          },
        ]);
      }
    }

    if (gridView != undefined) {
      if (props.searchWord3 == "" && props.searchColId3 == []) {
        gridView.setColumnFilters(criteria2[0], []);
      } else {
        if (props.searchWord3 !== "") {
          gridView.setColumnFilters(criteria2[0], filter);
        } else {
          gridView.setColumnFilters(criteria2[0], []);
        }
        for (let i = 0; i < filter2.length; i++) {
          //comsole.log(props.searchValue[i]);
          if (props.searchValue[i] == -1) {
            gridView.setColumnFilters(props.searchColId3[i], []);
          } else {
            gridView.setColumnFilters(props.searchColId3[i], filter2[i]);
          }
        }
      }

      var current = gridView.getCurrent();
      //comsole.log(current);
      if (current.itemIndex !== -1) {
        emit("selectedIndex", current.dataRow);
        emit("selectedIndex2", current.dataRow);
        selectedRowData.value = dataProvider.getRows()[current.dataRow];
        if (selectedRowData.value) {
          const rowState = dataProvider.getRowState(current.dataRow);
          if (selectedRowData.value) {
            selectedRowData.value.index = current.dataRow;
            selectedRowData.value.rowState = rowState;
          }
          selectedindex.value = current.dataRow;

          //comsole.log(rowState);
          emit("sendRowState", rowState);

          emit("clickedRowData", selectedRowData.value);
        }
      }
    }
  }
);

watch(
  () => props.addRow,
  (newVal) => {
    gridView.commit();
    var values = { add: "추가", sort: "매장용" };
    var dataRow = dataProvider.addRow(values);

    emit("selectedIndex2", dataRow);
    // gridView.setCurrent({ dataRow: dataRow });
  }
);

watch(
  () => props.addRow2,
  (newVal) => {
    gridView.commit();
    const properties = props.addrowProp.split(",");
    const value = props.addrowDefault.split(",");
    let values = {};
    for (var i = 0; i < properties.length; i++) {
      values[properties[i]] = value[i];
    }
    var dataRow = dataProvider.addRow(values);
    gridView.setCurrent({ dataRow: dataRow });

    selectedRowData.value = dataProvider.getRows()[dataRow];

    emit("clickedRowData", selectedRowData.value);
    emit("selectedIndex2", dataRow);
  }
);

watch(
  () => props.addRow3,
  (newVal) => {
    gridView.commit();
    var values = { add: true };
    let propertys = props.addrowProp.split(",");
    for (var i = 0; i < propertys.length; i++) {
      values[propertys[i]] = undefined;
    }
    values.new = true;
    var dataRow = dataProvider.addRow(values);
    gridView.setCurrent({ dataRow: dataRow });
    props.rowData.push(values);
    const current = gridView.getCurrent(); // 현재 선택된 행 정보 가져오기
    const selectedRowIndex = current ? current.dataRow : null;
    if (selectedRowIndex !== null) {
      //comsole.log("현재 선택된 인덱스:", selectedRowIndex); // 선택된 행의 인덱스 출력
      selectedindex.value = selectedRowIndex;
    }
    emit("selectedIndex", selectedRowIndex);
    emit("selectedIndex2", current.dataRow);
    //comsole.log(props.rowData);
    // updatedrowData.value = [ ...dataProvider.getJsonRows()]
    // emit('updatedRowData', updatedrowData.value )
  }
);
watch(
  () => props.addRow4,
  (newVal) => {
    gridView.commit();
    var values = { add: true };
    let propertys = props.addrowProp.split(",");
    const value = props.addrowDefault.split(",");
    for (var i = 0; i < propertys.length; i++) {
      values[propertys[i]] = value[i];
    }
    values.new = true;

    emit("sendRowState", "created");
    var dataRow = dataProvider.addRow(values);
    gridView.setCurrent({ dataRow: dataRow });
    const current = gridView.getCurrent();
    emit("allStateRows", dataProvider.getAllStateRows());
    props.rowData.push(values);
    const selectedRowIndex = current ? current.dataRow : null;
    if (selectedRowIndex !== null) {
      //comsole.log("현재 선택된 인덱스:", selectedRowIndex); // 선택된 행의 인덱스 출력
      selectedindex.value = selectedRowIndex;
    }

    emit("selectedIndex", selectedRowIndex);
    emit("selectedIndex2", current.dataRow);
    //comsole.log(props.rowData);
    addrow4activated.value = true;

    selectedRowData.value = dataProvider.getRows()[selectedindex.value];
    selectedRowData.value.index = selectedindex.value;
    // const rowState = dataProvider.getRowState(selectedindex.value)

    emit("clickedRowData", selectedRowData.value);

    // emit('selectedIndex', selectedRowIndex)
    updatedrowData.value = [...dataProvider.getJsonRows()];
    emit("updatedRowData", updatedrowData.value);
  }
);

watch(
  () => props.addRow5,
  (newVal) => {
    gridView.commit();
    var values = { add: true };
    let propertys = props.addrowProp.split(",");
    const value = props.addrowDefault.split(",");

    ////console.log(value);
    for (var i = 0; i < propertys.length; i++) {
      values[propertys[i]] = value[i];
    }
    values.new = true;
    //comsole.log(values);
    emit("sendRowState", "created");
    var dataRow = dataProvider.addRow(values);
    gridView.setCurrent({ dataRow: dataRow });
    const current = gridView.getCurrent();

    const selectedRowIndex = current ? current.dataRow : null;
    if (selectedRowIndex !== null) {
      //comsole.log("현재 선택된 인덱스:", selectedRowIndex); // 선택된 행의 인덱스 출력
      selectedindex.value = selectedRowIndex;
    }

    emit("selectedIndex", selectedRowIndex);
    emit("selectedIndex2", current.dataRow);

    //comsole.log(props.rowData);
    addrow4activated.value = true;

    selectedRowData.value = dataProvider.getRows()[selectedindex.value];
    selectedRowData.value.index = selectedindex.value;
    const rowState = dataProvider.getRowState(selectedindex.value);
    selectedRowData.value.rowState = rowState;

    //emit('clickedRowData', selectedRowData.value);

    emit("selectedIndex", selectedRowIndex);
    updatedrowData.value = [...dataProvider.getJsonRows()];
    emit("updatedRowData2", updatedrowData.value);
  }
);

watch(
  () => props.deleteRow,
  (newVal) => {
    gridView.commit();
    const curr = gridView.getCurrent(); // 현재 선택된 셀 또는 행 정보를 가져옴
    ////console.log(curr.dataRow);
    if (curr.dataRow == -1) {
      return;
    }
    if (curr && curr.dataRow >= 0 && props.rowData[curr.dataRow]) {
      // 현재 데이터 행이 유효한 경우
      props.rowData[curr.dataRow].deleted = true;
      //dataProvider.setValue(curr.dataRow, "deleted", true); // "deleted" 속성을 true로 설정
      dataProvider.removeRow(curr.dataRow);
      gridView.commit();
    } else {
      //comsole.log(curr.dataRow);
      dataProvider.removeRow(curr.dataRow);
    }
    updatedrowData.value = [...dataProvider.getJsonRows()];
    emit("updatedRowData", updatedrowData.value);
    emit("allStateRows", dataProvider.getAllStateRows());
  }
);
watch(
  () => props.deleteRow2,
  (newVal) => {
    gridView.commit();
    const curr = gridView.getCurrent(); // 현재 선택된 셀 또는 행 정보를 가져옴
    if (curr.dataRow == -1) {
      return;
    }
    if (curr && curr.dataRow >= 0) {
      // 현재 데이터 행이 유효한 경우
      props.rowData[curr.dataRow].deleted = true;
      dataProvider.setValue(curr.dataRow, "deleted", true); // "deleted" 속성을 true로 설정
      dataProvider.removeRow(curr.dataRow);
      gridView.commit();
    } else {
      //console.warn("선택된 행이 없습니다.");
    }
    updatedrowData.value = [...dataProvider.getJsonRows()];
    const curr2 = gridView.getCurrent();
    selectedRowData.value = dataProvider.getRows()[curr2.dataRow];
    if (curr2.dataRow > -1) {
      emit("updatedRowData", updatedrowData.value);
      emit("clickedRowData", selectedRowData.value);
    }

    deleted2activated.value = true;
    addrow4activated.value = true;
    deletedIndex.value = curr.dataRow;
  }
);

watch(
  () => props.deleteRow3,
  (newVal) => {
    gridView.commit();
    const curr = gridView.getCurrent(); // gridView 가뭔지  dataProvider 가 뭔지 개념을 설명
    if (curr.dataRow == -1) {
      return;
    }
    const alldata = dataProvider.getJsonRows();
    const checkedIndexes = [];

    alldata.forEach((item, index) => {
      ////console.log(item);
      if (item.checkbox === true) {
        checkedIndexes.push(index); // 체크된 항목의 인덱스를 저장
      }
    });

    for (var i = 0; i < checkedIndexes.length; i++) {
      props.rowData[checkedIndexes[i]].deleted = true;
      dataProvider.setValue(checkedIndexes[i], "deleted", true); // "deleted" 속성을 true로 설정
      dataProvider.removeRow(checkedIndexes[i]);
    }
    updatedrowData.value = [...dataProvider.getJsonRows()];
    emit("updatedRowData", updatedrowData.value);
    deleted2activated.value = true;
    addrow4activated.value = true;
    //deletedIndex.value = curr.dataRow
  }
);

watch(
  () => props.deleteRow4,
  (newVal) => {
    const curr = gridView.getCurrent();
    if (curr.dataRow == -1) {
      return;
    }
    var rows = gridView.getCheckedRows();
    dataProvider.removeRows(rows);
    gridView.checkRows(rows, false);
  }
);

watch(
  () => props.deleteRow5,
  (newVal) => {
    gridView.commit();

    const curr = gridView.getCurrent(); // 현재 선택된 셀 또는 행 정보를 가져옴
    if (curr.dataRow == -1) {
      return;
    }
    if (curr && curr.dataRow >= 0) {
      // 현재 데이터 행이 유효한 경우
      //comsole.log(dataProvider.getRowState(curr.dataRow));
      if (dataProvider.getRowState(curr.dataRow) == "created") {
        dataProvider.removeRow(curr.dataRow);
      } else {
        dataProvider.setRowState(curr.dataRow, "deleted", true);
        dataProvider.removeRow(curr.dataRow);
      }

      gridView.commit();
    } else {
      //console.warn("선택된 행이 없습니다.");
    }

    const curr2 = gridView.getCurrent();
    const currRowState2 = dataProvider.getRowState(curr2.dataRow);
    emit("sendRowState", currRowState2);
    emit("selectedindex", curr2.dataRow);

    let deletedRows = dataProvider.getStateRows("deleted");
    //comsole.log(deletedRows);
    const deleteRowsArr = ref([]);
    for (let i = 0; i < deletedRows.length; i++) {
      deleteRowsArr.value.push(dataProvider.getRows()[deletedRows[i]]);
    }

    emit("deleteRows", deleteRowsArr.value);

    if (curr2.dataRow >= 0) {
      emit("clickedRowData2", Number(curr2.dataRow));
    } else {
      emit("clickedRowData2", Number(0));
    }
  }
);

watch(
  () => props.deleteRow6,
  () => {
    const curr = gridView.getCurrent();
    //console.log(curr.dataRow);
    if (curr.dataRow == -1 || curr.dataRow == undefined) {
      return;
    }
    //comsole.log(curr.dataRow);
    dataProvider.removeRow(curr.dataRow);
    //comsole.log(dataProvider.getAllStateRows());
    emit("allStateRows", dataProvider.getAllStateRows());

    updatedrowData.value = [...dataProvider.getJsonRows()];
    //const curr = gridView.getCurrent();
    const curr2 = gridView.getCurrent();
    //console.log(curr2.dataRow);
    selectedRowData.value = dataProvider.getRows()[curr2.dataRow];
    emit("selectedIndex", curr2.dataRow);
    emit("selectedIndex2", curr2.dataRow);
    ////console.log(curr2);
    if (curr2.dataRow > -1) {
      emit("updatedRowData", updatedrowData.value);
      emit("clickedRowData", selectedRowData.value);

      const currRowState2 = dataProvider.getRowState(curr2.dataRow);
      emit("sendRowState", currRowState2);
    }
  }
);

watch(
  () => props.deleteRow7,
  (newVal) => {
    //console.log(gridView.getCheckedItems());

    const checkedArr = gridView.getCheckedRows();
    //console.log(checkedArr);
    dataProvider.removeRows(checkedArr);

    emit("allStateRows", dataProvider.getAllStateRows());

    if (checkedArr.length != 0) {
      emit("updatedRowData", updatedrowData.value);
    }

    updatedrowData.value = [...dataProvider.getJsonRows()];
    const curr = gridView.getCurrent();
    selectedRowData.value = dataProvider.getRows()[curr.dataRow];
    if (curr.dataRow > -1) {
      emit("updatedRowData", updatedrowData.value);
      emit("clickedRowData", selectedRowData.value);
      const currRowState2 = dataProvider.getRowState(curr.dataRow);
      emit("sendRowState", currRowState2);
    }
    // for (let i = 0; i < checkedArr.length; i++) {
    //   dataProvider.removeRow(checkedArr[i]);
    // }
    // emit("allStateRows", dataProvider.getAllStateRows());

    // if (checkedArr.length != 0) {
    //   emit("updatedRowData", updatedrowData.value);
    // }
    // updatedrowData.value = [...dataProvider.getJsonRows()];
    // const curr = gridView.getCurrent();
    // selectedRowData.value = dataProvider.getRows()[curr.dataRow];
    // if (curr.dataRow > -1) {
    //   emit("updatedRowData", updatedrowData.value);
    //   emit("clickedRowData", selectedRowData.value);
    //   const currRowState2 = dataProvider.getRowState(curr.dataRow);
    //   emit("sendRowState", currRowState2);
    // }

    // gridView.commit();
    // const curr = gridView.getCurrent(); // gridView 가뭔지  dataProvider 가 뭔지 개념을 설명
    // if (curr.dataRow == -1) {
    //   return;
    // }
    // const alldata = dataProvider.getJsonRows();
    // const checkedIndexes = [];

    // alldata.forEach((item, index) => {
    //   ////console.log(item);
    //   if (item.checkbox === true) {
    //     checkedIndexes.push(index); // 체크된 항목의 인덱스를 저장
    //   }
    // });

    //   for (var i = 0; i < checkedIndexes.length; i++) {
    //     props.rowData[checkedIndexes[i]].deleted = true;
    //     dataProvider.setValue(checkedIndexes[i], "deleted", true); // "deleted" 속성을 true로 설정
    //     dataProvider.removeRow(checkedIndexes[i]);
    //   }
    //   updatedrowData.value = [...dataProvider.getJsonRows()];
    //   emit("updatedRowData", updatedrowData.value);
    //   deleted2activated.value = true;
    //   addrow4activated.value = true;
    //   deletedIndex.value = curr.dataRow;
    // }
  }
);

watch(
  () => props.deleteAll,
  (newVal) => {
    gridView.commit();
    const allRows = dataProvider.getJsonRows();

    // Mark all rows as deleted (if needed)
    if (props.notsoftDelete == false) {
      allRows.reverse().forEach((row, index) => {
        dataProvider.setValue(index, "deleted", true); // Optionally mark them as deleted
        dataProvider.removeRow(index);
      });
    } else {
      for (let i = allRows.length - 1; i >= 0; i--) {
        dataProvider.removeRow(i);
      }
    }

    updatedrowData.value = [...dataProvider.getJsonRows()];
    emit("updatedrowData", updatedrowData.value);
  }
);

watch(
  () => props.commitAll,
  (newVal) => {
    if (dataProvider != undefined && dataProvider.getRowCount() > 0) {
      gridView.commit();
    }
  }
);
watch(
  () => props.setAllCheck,
  (newval) => {
    if (gridView != null) {
      gridView.setAllCheck(false);
    }
  }
);
watch(
  () => props.setAllCheck2,
  (newval) => {
    if (gridView != null) {
      gridView.setAllCheck(true);
    }
  }
);
watch(
  () => props.exporttoExcel,
  (newVal) => {
    const documentTitle = excelTitle(
      store.state.minorCategory.find((item) =>
        item.strUrl.includes(props.documentTitle)
      )
    );
    const excelNm = documentTitle.split("-")[2];
    const user = store.state.userData.strChargerName;
    const userID = store.state.userData.loginID;
    const today = formatDateTime(new Date());

    gridView.exportGrid({
      type: "excel",
      target: "local",
      numberCallback: function (index, column, value) {
        if (value === Infinity) {
          return 0;
        } else {
          return value;
        }
      },
      documentTitle: {
        //제목
        message: documentTitle,
        visible: true,
        spaceTop: 1,
        spaceBottom: 0,
        height: 30,
        styleName: "documentStyle",
      },
      documentSubtitle: {
        //부제
        message:
          props.documentSubTitle +
          "\n" +
          "조회시간 : " +
          today +
          "\n" +
          "작성자 : " +
          user +
          "(" +
          userID +
          ")",
        visible: true,
        height: 80,
        styleName: "documentSubtitleStyle",
      },
      fileName: excelNm + ".xlsx",
      showProgress: true,
      progressMessage: "엑셀 Export중입니다.",
      indicator: true,
      header: true,
      footer: true,
      compatibility: true,
      lookupDisplay: true,
      applyDynamicStyles: true,
      hiddenColumns: props.exportExcelHiddenColumns,
      allColumns: props.exportExcelHiddenColumns.length != 0 ? true : false,
    });
  }
);
watch(
  () => props.initFocus,
  (newVal) => {
    setTimeout(() => {
      if (gridView != undefined && gridView != null) {
        gridView.clearCurrent();
        dataProvider.clearRowStates();
      }
    }, 10);
  }
);
watch(
  () => props.initCheckAct,
  (newVal) => {
    //comsole.log(props.initCheckValue);
    //comsole.log(props.initCheckColumn);
    // ////console.log("왓냐?");
    gridView.checkAll(false);
    let itemCount = gridView.getItemCount();
    const checkValues = props.initCheckValue.split(",");
    for (var i = 0; i < itemCount; i++) {
      for (var j = 0; j < checkValues.length; j++) {
        if (gridView.getValue(i, props.initCheckColumn) == checkValues[j]) {
          dataProvider.setValue(i, "checkbox", true);
        }
      }
    }
  }
);

watch(
  () => props.getJson,
  () => {
    const jsonData = dataProvider.getJsonRows();
    emit("getJsonData", jsonData);
  }
);

// watch(() => props.hideColumnsId , ()=>{
//   for(var i=0 ; i < props.hideColumnsId.length ; i++){
//     gridView.columnByField(props.hideColumnsId[i]).visible = false;
//   }
//   //gridView.columnByField(props.hideColumn).visible = false;
// })

watch(
  () => props.uncheckAct,
  (newvalue) => {
    props.uncheckColumn;
    props.uncheckValue;
    const uncheckValues = props.uncheckValue.split(";");
    for (var i = 0; i < uncheckValues.length; i++) {
      const a = dataProvider.searchDataRow({
        fields: [props.uncheckColumn],
        values: [uncheckValues[i]],
      });
      gridView.checkRow(a, false);
    }
  }
);

watch(
  () => props.checkAll,
  () => {
    if (gridView != null) {
      gridView.checkAll(false);
    }
  }
);

watch(
  () => props.hideNow,
  (newValue) => {
    dataProvider.hideRows(props.hideRow);
  }
);
watch(
  () => props.hideColumnNow,
  (newValue) => {
    if (props.hideColumn != "") {
      gridView.columnByField(props.hideColumn).visible = !props.hideColumnNow;
    }
  }
);

watch(
  () => props.moveFocusbyIndex,
  () => {
    //comsole.log(props.moveFocusbyIndex);
    ////comsole.log(gridView.setCurrent({ dataRow: Number(props.moveFocusbyIndex) }))
    if (props.moveFocusbyIndex != -1) {
      gridView.setCurrent({ dataRow: props.moveFocusbyIndex });

      selectedRowData.value = dataProvider.getRows()[props.moveFocusbyIndex];
      if (selectedRowData.value) {
        emit("selectedIndex", props.moveFocusbyIndex);
        // emit('clickedRowData', selectedRowData.value);
      }
    }
  }
);

watch(
  () => props.setReFocus,
  () => {
    const datarow = gridView.getCurrent();
    //comsole.log(datarow);
    selectedRowData.value = dataProvider.getRows()[datarow.dataRow];
    emit("clickedRowData", selectedRowData.value);
  }
);

// 컬럼 색상 설정

watch(
  () => props.TimeArray,
  () => {
    if (gridView.columnByName("workTime")) {
      gridView.columnByName("workTime").styleCallback = (grid, dataCell) => {
        const times = props.TimeArray;
        const timecode = grid.getValue(dataCell.index.itemIndex, "lngtimeCode");
        const isin = times.some(([start, end]) => {
          return Number(timecode) >= start && Number(timecode) < end;
        });
        ////console.log(timecode);
        // ////console.log(isin);
        if (isin) {
          return { styleName: "blue-column" };
        }
        // const name = grid.getValue(dataCell.index.itemIndex, 'KorName')
        // if(name === '박영호'){
        //     return {styleName : "orange-column"}
        // }
      };
    }
  }
);

onMounted(async () => {
  realgridname.value = `realgrid-${props.progname}-${props.progid}-${uuidv4()}`;
  emit("realgridname", realgridname.value);
  try {
    if (props.renderProgname != "") {
      // result2.value = await getRenderingData(props.renderProgname)
    }
    tabInitSetArray.value = [];
    const result = await getGridInfoList(props.progname, props.progid);
    tabInitSetArray.value = result;

    await nextTick();
    if (props.setDynamicGrid == true) {
      const res = await getDynamicGrid(
        store.state.userData.lngStoreGroup,
        result.length
      );
      tabInitSetArray.value.push(...res.data.List);
    }

    if (props.setDynamicGrid2 == true) {
      const res = await getDynamicGrid2(
        store.state.userData.lngStoreGroup,
        result.length
      );

      tabInitSetArray.value.push(...res.data.List);
    }
    if (props.setDynamicGrid4 == true) {
      const res = await getDynamicGrid4(
        store.state.userData.lngStoreGroup,
        props.setDynamicGrid4Cond
      );
      ////console.log(res);
      if (res.data.List.length > 0) {
        tabInitSetArray.value.push(...res.data.List);
      }
    }
    if (props.setDynamicGrid5 == true) {
      const res = await getDynamicGrid5(
        props.setDynamicGrid5Cond,
        props.setDynamicGrid5Cond2
      );

      if (res.data.List.length > 0) {
        tabInitSetArray.value.push(...res.data.List);
      }
    }

    if (props.setDynamicGrid6 == true) {
      const res = await getDynamicGrid6(props.setDynamicGrid6Cond);

      if (res.data.List.length > 0) {
        tabInitSetArray.value.push(...res.data.List);
      }
      console.log(res);
    }

    // 동적 스타일 생성
    let styleContent = "";
    tabInitSetArray.value.forEach((item, index) => {
      styleContent += `
        .header-style-${realgridname.value}${index} {
          background-color: ${item.strHdBkColor} !important;
          color: ${item.strHdColor} !important;
        }
      `;
    });
    document.head.insertAdjacentHTML(
      "beforeend",
      `<style>${styleContent}</style>`
    );
    await nextTick();
    if (tabInitSetArray.value.length != 0) {
      await funcshowGrid();
    }
  } catch (error) {
    //console.error("Failed to fetch data:", error);
  }
});
watch(
  () => props.reload,
  (newValue) => {
    setupGrid();
  }
);

const setupGrid = async () => {
  try {
    if (props.renderProgname !== "") {
      // Uncomment this if needed
      // const result2 = await getRenderingData(props.renderProgname);
    }
    tabInitSetArray.value = [];
    const result = await getGridInfoList(props.progname, props.progid);
    tabInitSetArray.value = result;

    await nextTick();
    if (props.setDynamicGrid == true) {
      const res = await getDynamicGrid(
        store.state.userData.lngStoreGroup,
        result.length
      );
      tabInitSetArray.value.push(...res.data.List);
    }

    if (props.setDynamicGrid2 == true) {
      const res = await getDynamicGrid2(
        store.state.userData.lngStoreGroup,
        result.length
      );

      tabInitSetArray.value.push(...res.data.List);
    }
    if (props.setDynamicGrid3 == true) {
      const res = await getDynamicGrid3(
        store.state.userData.lngStoreGroup,
        props.dynamicStoreCd,
        result.length
      );

      if (res.data.List.length > 0) {
        tabInitSetArray.value.push(...res.data.List);
      }
    }

    if (props.setDynamicGrid4 == true) {
      const res = await getDynamicGrid4(
        store.state.userData.lngStoreGroup,
        props.setDynamicGrid4Cond
      );
      ////console.log(res);
      if (res.data.List.length > 0) {
        tabInitSetArray.value.push(...res.data.List);
      }
    }

    if (props.setDynamicGrid5 == true) {
      const res = await getDynamicGrid5(
        props.setDynamicGrid5Cond,
        props.setDynamicGrid5Cond2
      );

      if (res.data.List.length > 0) {
        tabInitSetArray.value.push(...res.data.List);
      }
    }

    if (props.setDynamicGrid6 == true) {
      const res = await getDynamicGrid6(props.setDynamicGrid6Cond);

      if (res.data.List.length > 0) {
        tabInitSetArray.value.push(...res.data.List);
      }
    }

    // Dynamic style generation
    let styleContent = "";
    tabInitSetArray.value.forEach((item, index) => {
      styleContent += `
        .header-style-${realgridname.value}${index} {
          background-color: ${item.strHdBkColor} !important;
          color: ${item.strHdColor} !important;
        }
      `;
    });
    document.head.insertAdjacentHTML(
      "beforeend",
      `<style>${styleContent}</style>`
    );

    if (tabInitSetArray.value.length != 0) {
      await funcshowGrid();
    }
  } catch (error) {
    //console.error("Failed to fetch data:", error);
  }
};

watch(
  () => props.rowData,
  () => {
    if (props.initSelect == true) {
      selectedindex.value = -1;
    }
    addrow4activated.value = true;
    funcshowGrid().then(() => {
      if (gridView) {
        var rows = gridView.getCheckedRows();
        selectedRowData.value = [];
        for (var i in rows) {
          var data = dataProvider.getJsonRow(rows[i]);
          selectedRowData.value.push(data);
        }
        emit("checkedRowData", selectedRowData.value);
      }

      setTimeout(function () {
        if (selectedindex.value == -1) {
          if (dataProvider) {
            dataProvider.clearRowStates();
            emit("selectedIndex", selectedindex.value);
            return;
          }
        }

        if (selectedindex.value !== "" && selectedindex.value != undefined) {
          if (gridView) {
            gridView.setCurrent({ dataRow: selectedindex.value });
          }
        }

        // const newIndices = props.rowData.reduce((indices, item, index) => {
        //   if (item.new === true) {
        //     indices.push(index);
        //   }
        //   return indices;
        // }, []);
        // dataProvider.setRowStates(newIndices, "created", true);
        addrow4activated.value = false;

        if (gridView !== null && gridView != undefined) {
          if (deleted2activated.value == true) {
            gridView.clearCurrent();
            deleted2activated.value = false;
          } else {
            gridView.clearCurrent();
          }
        }
      }, 80); // 시간으로인한 미적용 이슈있음
    });
  }
);

watch(
  () => props.disabled,
  () => {
    ////console.log("왓지?");
    if (gridView) {
      if (props.disabled == true) {
        gridView.disabled = true;
      } else {
        gridView.disabled = false;
      }
    }
  }
);
watch(
  () => props.showOnlyChecked,
  () => {
    const filteredData = props.rowData.filter((item) => item.checkbox == true);
    dataProvider.setRows(filteredData);
  }
);

watch(
  () => [props.searchWord, props.searchColValue2],
  ([newValue, newValue2]) => {
    const searchColId = props.searchColId.split(",");
    let searchColId2;
    let searchColValues;

    if (props.searchColId2 !== "") {
      searchColId2 = props.searchColId2.split(",");
    }
    if (newValue2 !== "") {
      searchColValues = newValue2.split(",");
    }

    if (searchColId2 == undefined) {
      if (newValue === "") {
        dataProvider.setRows(props.rowData);

        return;
      }
      const filteredData = props.rowData.filter((item) => {
        return searchColId.some((colId) => {
          const value = item[colId] ? item[colId].toString() : "";

          return value
            .toLowerCase()
            .includes(newValue.toString().toLowerCase());
        });
      });
      dataProvider.setRows(filteredData.length ? filteredData : []);
    } else {
      const filteredData = props.rowData.filter((item) => {
        return searchColId2.every((colId, index) => {
          const value = item[colId] != null ? item[colId].toString() : "";
          const searchValue = (searchColValues[index] || "").toString();

          if (searchValue == props.defaultSearchAllValue) {
            return true;
          }

          return value
            .toLowerCase()
            .includes(searchValue.toString().toLowerCase());
        });
      });
      if (props.searchWord == "") {
        dataProvider.setRows(filteredData.length ? filteredData : []);
      } else {
        const filteredData2 = filteredData.filter((item) => {
          return searchColId.some((colId) => {
            const value = item[colId] ? item[colId].toString() : "";

            return value
              .toLowerCase()
              .includes(props.searchWord.toString().toLowerCase());
          });
        });
        dataProvider.setRows(filteredData2.length ? filteredData2 : []);
      }
    }
  }
);
</script>

<style>
.setTextAlignLeft {
  text-align: left !important;
  white-space: pre !important;
}

.setTextAlignRight {
  text-align: right !important;
  white-space: pre !important;
}

.setTextAlignCenter {
  text-align: center !important;
  white-space: pre !important;
}

.documentStyle {
  border: 1px solid blue;
  text-align: center;
  font-size: 28px;
  background-color: rgba(231, 134, 77, 0.3);
}

.documentSubtitleStyle {
  text-align: right;
  font-size: 12px;
  background-color: rgba(231, 134, 77, 0.3);
}

.blue {
  background: rgb(135, 206, 235);
  text-align: right;
}

.navy {
  background: navy;
  color: white;
  text-align: right;
}

.pink {
  background: pink;
  text-align: right;
}

.green {
  background: greenyellow;
  text-align: right;
}

.skyblue {
  background: #d0e9f5;
  text-align: right;
}

.realgrid-pre-wrap {
  white-space: pre-wrap;
  text-align: center;
}

.blue-column {
  background: #007bff !important; /* 밝은 파란색 */
}

.rg-header-sort-descending {
  background: url(data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDE2IDE2OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHN0eWxlIHR5cGU9InRleHQvY3NzIj4uc3Qwe2ZpbGw6I0ZGRkZGRjt9LnN0MXtmaWxsOiNGRkZGRkY7fS5zdDJ7ZmlsbDojRkZGRkZGO30uc3Qze2ZpbGw6I0ZGRkZGRjt9LnN0NHtmaWxsOiNGRkZGRkY7fS5zdDV7ZmlsbDojRkZGRkZGO30uc3Q2e2ZpbGw6I0ZGRkZGRjt9LnN0N3tmaWxsOiNGRkZGRkY7fS5zdDh7ZmlsbDojRkZGRkZGO30uc3Q5e2ZpbGw6I0ZGRkZGRjt9LnN0MTB7ZmlsbDojRkZGRkZGO30uc3QxMXtmaWxsOiNGRkZGRkY7fS5zdDEye2ZpbGw6I0ZGRkZGRjt9PC9zdHlsZT48cG9seWdvbiBjbGFzcz0ic3QxIiBwb2ludHM9IjkuNCw3LjIgOS40LDQuNSA2LjYsNC41IDYuNiw3LjIgMyw3LjIgOCwxMS41IDEzLDcuMiAiLz48L3N2Zz4=)
    no-repeat center 70%;
  font-size: 8px;
  vertical-align: middle;
}
.rg-header-sort-ascending {
  background: url(data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDE2IDE2OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHN0eWxlIHR5cGU9InRleHQvY3NzIj4uc3Qwe2ZpbGw6I0ZGRkZGRjt9LnN0MXtmaWxsOiNGRkZGRkY7fS5zdDJ7ZmlsbDojRkZGRkZGO30uc3Qze2ZpbGw6I0ZGRkZGRjt9LnN0NHtmaWxsOiNGRkZGRkY7fS5zdDV7ZmlsbDojRkZGRkZGO30uc3Q2e2ZpbGw6I0ZGRkZGRjt9LnN0N3tmaWxsOiNGRkZGRkY7fS5zdDh7ZmlsbDojRkZGRkZGO30uc3Q5e2ZpbGw6I0ZGRkZGRjt9LnN0MTB7ZmlsbDojRkZGRkZGO30uc3QxMXtmaWxsOiNGRkZGRkY7fS5zdDEye2ZpbGw6I0ZGRkZGRjt9PC9zdHlsZT48cG9seWdvbiBjbGFzcz0ic3QxIiBwb2ludHM9IjEzLDguOCA4LDQuNSAzLDguOCA2LjYsOC44IDYuNiwxMS41IDkuNCwxMS41IDkuNCw4LjgiIC8+PC9zdmc+)
    no-repeat center 70%;
  font-size: 8px;
  vertical-align: middle;
}
.header-style-0 {
  background-color: #545876;
  color: white;
}
</style>
