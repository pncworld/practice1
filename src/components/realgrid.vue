<template>
  <div
    :id="realgridname"
    class="h-[100%] w-[100%] realgrid"
    :tabindex="props.keyDeleteRemovesCurrentRow === true ? 0 : undefined"
    @focusin="onGridContainerFocusIn"></div>
</template>

<script setup>
import { getGridInfoList } from "@/api/common";
import { getDynamicGrid2, getDynamicGrid3 } from "@/api/master";
import { getDynamicGrid4 } from "@/api/micrm";
import { getDynamicGrid5, getDynamicGrid6 } from "@/api/mihr";
import {
  getDynamicGrid,
  getDynamicGrid7,
  getDynamicGrid8,
} from "@/api/misales";
import {
  excelTitle,
  formatDateTime,
  formatDateTime2,
  formatLocalDate,
} from "@/customFunc/customFunc";
import { isKoreanPublicHoliday } from "@/customFunc/koreanHolidays";
import store from "@/store";
import {
  GridView,
  LocalDataProvider,
  LocalTreeDataProvider,
  TreeView,
} from "realgrid";
import { v4 as uuidv4 } from "uuid";
import { nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import {
  rgDestroyRegistryInstance,
  rgGetInstance,
  rgInstanceRegistry,
} from "./realgridInstanceRegistry.js";
let gridView;
let dataProvider;

const rgDestroyInstance = (id, nameRef) => {
  const key = id ?? nameRef?.value;
  if (!key) return;
  const inst = rgGetInstance(key);
  rgDestroyRegistryInstance(key);
  if (gridView === inst?.gridView) {
    gridView = null;
    dataProvider = null;
  }
};

const rgBindActiveInstance = (nameRef) => {
  const inst = rgGetInstance(nameRef?.value);
  gridView = inst?.gridView ?? null;
  dataProvider = inst?.dataProvider ?? null;
  return inst;
};

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
  exporttoExcel2: {
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
  /** 값이 바뀔 때마다 commit 후 updatedRowData emit (부모에서 클릭 시 동기화용) */
  syncRowDataPulse: {
    type: Number,
    default: 0,
  },
  /** 체크바가 바인딩할 행 필드명 (기본 checkbox). 상·하단 그리드 분리 시 각각 다른 값 사용 */
  checkBarFieldName: {
    type: String,
    default: "checkbox",
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
  /** 콤마 구분 컬럼 — 정수·소수·음수(-) 입력 허용, 문자 불가 */
  inputSignedDecimalColumn: {
    type: String,
    default: "",
  },
  /** 콤마 구분 컬럼 — 정수·소수만(음수 불가), 소수 2자리 */
  inputUnsignedDecimalColumn: {
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
  /** opt-in: 비어있지 않으면 그룹 첫 행의 해당 필드값 + setGroupSumCustomText(접미사)로 표시. 예) 홍길동 + 님 소계 */
  setGroupSumCustomNameField: {
    type: String,
    default: "",
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
  /** mergeColumns2 — strColID별 너비 배율 (예: { strDate: 1.1 }) 화면별 opt-in */
  mergeColumnWidthScale2: {
    type: Object,
    default: () => ({}),
  },
  /** 일자 열 기준 토·일·공휴일 셀 스타일 (SLS01 일별매출계획과 동일 톤) — 화면별 opt-in */
  weekdayHolidayStyleColumns: {
    type: Array,
    default: () => [],
  },
  weekdayHolidayDateField: {
    type: String,
    default: "strDate",
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
    // 셀병합시 데이터끼리 통합할지 말지 선택하는
    type: String,
    default: "",
  },

  setRowGroupSpan2: {
    // 셀병합
    type: String,
    default: "",
  },
  setMergeMode: {
    // 셀병합시 데이터끼리 통합할지 말지 선택하는
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
    // 그룹푸터에서 레벨별로 나타날 색상에 대한 설정 ( 하드코딩적으로)
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
  /** Enter 키 시 현재 행을 더블클릭과 동일하게 `dblclickedRowData`로 전달 (자재 조회 팝업 등) */
  enterKeyEmitsDblClicked: {
    type: Boolean,
    default: false,
  },
  /** Delete 키로 현재 행 삭제 후 `updatedRowData` emit (`enterKeyEmitsDblClicked`와 동시 사용 시 Enter 전용 그리드에만 각각 설정) */
  keyDeleteRemovesCurrentRow: {
    type: Boolean,
    default: false,
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
  /** 부모에서 조회 후 넘기는 동적 컬럼(할인그룹 체크박스 등). getGridInfoList 결과 뒤에 병합 */
  extraColumns: {
    type: Array,
    default: () => [],
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
  checkRenderEditable2Col: {
    // 체크바 수정 관련 변수
    type: String,
    default: "",
  },
  dynamicRowHeight: {
    // 동적 행 높이
    type: Boolean,
    default: false,
  },
  dynamicRowHeight2: {
    // 동적 행 높이 2 트리뷰
    type: Boolean,
    default: false,
  },
  syncGridHeight: {
    // 행 높이 동기화
    type: Boolean,
    default: false,
  },
  /** true: rowData 갱신 후 clearCurrent 생략 — 다중 그리드·행 클릭 화면용 */
  skipClearCurrentAfterSetRows: {
    type: Boolean,
    default: false,
  },
  /** true: setRows·레이아웃 동기화 시 refresh 생략 — setColumnLayout 유지용 */
  preserveColumnLayoutOnRefresh: {
    type: Boolean,
    default: false,
  },
  /** true: labelingColumns 콤보 — 편집 시 editor.values/labels 고정 (팝업 등 opt-in) */
  fixLabelingDropdownOnShow: {
    type: Boolean,
    default: false,
  },
  /** setColumnLayout으로 초기·데이터 로드 후 컬럼 레이아웃 고정 (예: 코너명만 표시) */
  forceColumnLayout: {
    type: Array,
    default: () => [],
  },
  changeNow3: {
    // 데이터 변경시 트리거
    type: Boolean,
    default: false,
  },
  getRowChanged: {
    // 변경된 데이터 props에 올리는 변수
    type: Boolean,
    default: false,
  },
  excludeCheck: {
    // 데이터에서 체크할때 체크바에 대한 부분을 같이 동작할지 말지설정
    type: Boolean,
    default: false,
  },
  checkonlyone: {
    // 체크박스 연동 선택
    type: Boolean,
    default: false,
  },
  checkAll: {
    // 전체 체크박스 선택할지 말지
    type: Boolean,
    default: false,
  },
  checkRowAuto: {
    // 내장 체크바 연동할지 말지
    type: Boolean,
    default: true,
  },
  headerCheckBar: {
    // 헤더 체크바 나타낼지 말지
    type: String,
    default: "",
  },
  useAlternateRowStyle: {
    // 그리드 사이트 참조 // 짝수행의 className에 "rg-alternate-row" 추가를 설정한다.
    type: Boolean,
    default: true,
  },
  TimeArray: {
    // 시간 데이터에 따른 컬럼 색상 연동
    type: Array,
    default: [],
  },
  autoPlusColumn: {
    // 시간 관련 변수
    type: Boolean,
    default: false,
  },
  mergeColumns3: {
    // 컬럼 그룹핑 3단
    type: Boolean,
    default: false,
  },
  mergeColumnGroupSubList3: {
    // 컬럼 그룹핑 3단
    type: Array,
    default: [],
  },
  mergeColumnGroupName4: {
    // 컬럼 그룹핑 3단
    type: Array,
    default: [],
  },
  mergeColumnGroupName3: {
    // 컬럼 그룹핑 3단
    type: Array,
    default: [],
  },
  setDynamicGrid4: {
    // 동적 그리드
    type: Boolean,
    default: false,
  },
  setDynamicGrid4Cond: {
    // 동적 그리드 조건
    type: String,
    default: "0",
  },
  setDynamicGrid5: {
    // 동적 그리드
    type: Boolean,
    default: false,
  },
  setDynamicGrid5Cond: {
    // 동적 그리드 조건
    type: String,
    default: "2025-09-01",
  },
  setDynamicGrid5Cond2: {
    // 동적 그리드 조건
    type: String,
    default: "2025-09-01",
  },
  setDynamicGrid6: {
    // 동적 그리드 조건
    type: Boolean,
    default: false,
  },
  setDynamicGrid6Cond: {
    // 동적 그리드 조건
    type: String,
    default: "9999",
  },
  setDynamicGrid7: {
    // 동적 그리드 조건
    type: Boolean,
    default: false,
  },
  setDynamicGrid8: {
    // 동적 그리드
    type: Boolean,
    default: false,
  },
  initCheckRows: {
    // 강제 체크할 컬럼들
    type: Array,
    default: [],
  },
  initCheckRowNow: {
    // 강제 체크
    type: Boolean,
    default: false,
  },
  disabled: {
    // 그리드 비활성화
    type: Boolean,
    default: false,
  },
  deleteRow7: {
    // 행삭제 방법
    type: Boolean,
    default: false,
  },
  removeInitProp: {
    // 그리드에 추가 컬럼 넣을지 말지
    type: Boolean,
    default: false,
  },
  showCheckRowDataByForce: {
    //폐기
    type: Boolean,
    default: false,
  },
  checkRowAuto2: {
    // 셀 클릭시 체크바연동 여부2
    type: Boolean,
    default: false,
  },
  checkRowAuto2Col: {
    // 셀 클릭시 체크바연동 컬럼
    type: String,
    default: "lngCheck",
  },
  /** true: rowData 없을 때 빈 그리드 생성 생략 — 첫 조회 시 한 번만 초기화 (대량 조회 화면용) */
  deferGridUntilData: {
    type: Boolean,
    default: false,
  },
  /** 대량 조회(수천 행) — fitStyle·styleCallback·refresh·푸터 등 렌더 부담 최소화 */
  bulkLoadMode: {
    type: Boolean,
    default: false,
  },
  /** true: mstGridInfo strEdit/strBackColorexp expr:decode 적용 (화면별 opt-in) */
  useMetaEditExpr: {
    type: Boolean,
    default: false,
  },
  AutoCalculateDataMainColId: {
    // 자동 계산할 메인 컬럼명들
    type: Array,
    default: [],
  },
  AutoCalculateDataSubColId: {
    // 자동 계산할 서브 컬럼명들
    type: Array,
    default: [],
  },
  CalculateTaxColId: {
    // 자동 세금 계산 할 컬럼 방법1
    type: String,
    default: "",
  },
  CalculateTaxColId2: {
    // 자동 세금 계산 할 컬럼 방법2
    type: String,
    default: "",
  },
  CalculateTaxColId3: {
    // 자동 세금 계산 할 컬럼 방법2
    type: String,
    default: "",
  },
  CalculateTimeColId: {
    // 자동 시간 계산 컬럼
    type: String,
    default: "",
  },
  ColCellRedColorColId: {
    // 빨간색 색칠 컬럼들
    type: Array,
    default: [],
  },
  /** 값별 글자색 — [{ field, values, color }] */
  cellFontColorByValue: {
    type: Array,
    default: () => [],
  },
  checkOnlyFalse: {
    // 체크박스 해제만 되는 설정
    type: Boolean,
    default: false,
  },
  hideChildHeader: {
    // 컬럼 그룹핑할때 자식 컬럼 없게 설정할때
    type: Boolean,
    default: false,
  },
  setCellStyleColId: {
    // 시간 값에 따른 배경색 설정
    type: Array,
    default: [],
  },
  setCellStyleColId2: {
    // 시간 값에 따른 배경색 설정
    type: Array,
    default: [],
  },
  setCellStyleColId3: {
    // HR02_001INS 색상 설정용
    type: Boolean,
    default: false,
  },
  CalculateShortQty: {
    // 자동 수량 계산
    type: String,
    default: "",
  },
  CalculateSupplyPrice: {
    // 자동 가격 계산
    type: String,
    default: "",
  },
  CalculateVatPrice: {
    // 자동 부가세 계산
    type: String,
    default: "",
  },
  CalculateTotalPrice: {
    // 자동 부가세 계산2
    type: String,
    default: "",
  },

  exportExcelHiddenColumns: {
    // 엑셀 내보내기시 감춘컬럼 감춰서 export 하기
    type: Array,
    default: [],
  },
  exportExcelShowColumns: {
    // 엑셀 내보내기시 감춘컬럼 보여서 export 하기
    type: Array,
    default: [],
  },
  checkedRowData2Col: {
    // 체크시 다른 emit으로 체크 데이터 받기 위한 설정
    type: String,
    default: "",
  },
  /** true면 checkedRowData2 페이로드를 getJsonRow(row) 객체로 전달 (인덱스 배열 의존 제거) */
  emitCheckedRowData2AsJson: {
    type: Boolean,
    default: false,
  },
  checkAbleExpressionCol: {
    // 체크가능한 컬럼
    type: String,
    default: "",
  },
  checkAbleExpressionCol2: {
    // 체크가능한 컬럼2
    type: String,
    default: "",
  },
  checkAbleExpressionVal: {
    // 체크가능한 컬럼의 값
    type: String,
    default: "",
  },
  checkAbleExpressionCol3: {
    // 체크가능한 컬럼3
    type: String,
    default: "",
  },

  checkAbleExpressionVal2: {
    // 체크가능한 컬럼의 값 2
    type: String,
    default: "",
  },
  setTreeView: {
    // 트리뷰 설정
    type: Boolean,
    default: false,
  },
  editableColByCondition: {
    // 조건에 따른 수정 가능 컬럼
    type: Boolean,
    default: false,
  },
  headerColors: {
    // 헤더 적용 스타일 이름
    type: Array,
    default: [],
  },
  cellEditthenCheck: {
    // 셀 변경시 체크
    type: Boolean,
    default: false,
  },
  suppressEdit: {
    // true면 셀 수정·체크바 체크 불가 (잠금 등)
    type: Boolean,
    default: false,
  },
  /** 행 높이(px). 0이면 기존 동작 */
  gridRowHeight: {
    type: Number,
    default: 0,
  },
  /** 헤더 높이(px). 0이면 기존 동작 */
  gridHeaderHeight: {
    type: Number,
    default: 0,
  },
  /** 본문·헤더 폰트(px). 0이면 기존 동작 */
  gridFontSize: {
    type: Number,
    default: 0,
  },
  /** 본문 세로 정렬(near/center/far). 빈 값이면 기존 동작 */
  gridBodyLineAlignment: {
    type: String,
    default: "",
  },
  /** true: 행 포커스 변경(onCurrentChanged) 시 selectedIndex emit */
  emitSelectedOnCurrentChange: {
    type: Boolean,
    default: false,
  },
  /** true: 셀 클릭·포커스 시 rowData 원본을 cellClicked 로 emit (행번호·사이즈와 무관) */
  emitCellClickedRow: {
    type: Boolean,
    default: false,
  },
  /** true: 행 포커스 변경(onCurrentChanged) 시 clickedRowData emit — 콤보/편집 셀 포함 */
  emitClickedRowOnRowChange: {
    type: Boolean,
    default: false,
  },
});

/** onCellClicked — dataRow 를 itemIndex·current 등에서 최대한 복원 */
const rgResolveClickedDataRow = (grid, clickData, current) => {
  if (clickData?.dataRow != null && clickData.dataRow >= 0) {
    return clickData.dataRow;
  }
  if (current?.dataRow != null && current.dataRow >= 0) {
    return current.dataRow;
  }
  const ii = clickData?.itemIndex;
  if (ii != null && ii >= 0 && grid?.getDataRow) {
    try {
      const dr = grid.getDataRow(ii);
      if (dr != null && dr >= 0) {
        return dr;
      }
    } catch (_) {
      void 0;
    }
  }
  const cii = current?.itemIndex;
  if (cii != null && cii >= 0 && grid?.getDataRow) {
    try {
      const dr2 = grid.getDataRow(cii);
      if (dr2 != null && dr2 >= 0) {
        return dr2;
      }
    } catch (_) {
      void 0;
    }
  }
  return -1;
};

/** DataSource.getValue — 필드 미정의 시 fieldIndex -1 런타임 오류 방지 */
const rgSafeDataSourceGetValue = (ds, dataRow, fieldName) => {
  const fn = String(fieldName ?? "").trim();
  if (!ds || !fn || dataRow == null || (typeof dataRow === "number" && dataRow < 0)) {
    return undefined;
  }
  try {
    if (typeof ds.getFieldIndex === "function") {
      const idx = ds.getFieldIndex(fn);
      if (typeof idx === "number" && idx < 0) return undefined;
    }
    return ds.getValue(dataRow, fn);
  } catch {
    return undefined;
  }
};

const RG_WEEKDAY_HOLIDAY_SAT_STYLE = {
  backgroundColor: "#eff6ff",
  color: "#1d4ed8",
  fontWeight: "700",
};

const RG_WEEKDAY_HOLIDAY_SUN_STYLE = {
  backgroundColor: "#fff1f2",
  color: "#b91c1c",
  fontWeight: "700",
};

function rgParseGridRowDate(dateStr) {
  const s = String(dateStr ?? "").trim();
  if (!s || s === "합계") return null;
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 12, 0, 0);
  return Number.isNaN(d.getTime()) ? null : d;
}

function rgResolveWeekdayHolidayCellStyle(grid, dataRow, dateField) {
  const ds = grid?.getDataSource?.();
  if (!ds) return null;
  const raw = rgSafeDataSourceGetValue(ds, dataRow, dateField);
  const d = rgParseGridRowDate(raw);
  if (!d) return null;
  if (isKoreanPublicHoliday(d)) return { ...RG_WEEKDAY_HOLIDAY_SUN_STYLE };
  const dow = d.getDay();
  if (dow === 0) return { ...RG_WEEKDAY_HOLIDAY_SUN_STYLE };
  if (dow === 6) return { ...RG_WEEKDAY_HOLIDAY_SAT_STYLE };
  return null;
}

/** 체크 조건값 — 콤마 구분이면 토큰 단위 일치, 아니면 전체 문자열과만 일치 (`'미확정'.includes('확정')` 오탐 방지) */
const rgCheckAbleValMatches = (valSpec, cellValue) => {
  const raw =
    cellValue === undefined || cellValue === null
      ? ""
      : String(cellValue).trim();
  const spec = String(valSpec ?? "").trim();
  if (!spec) return false;
  if (spec.includes(",")) {
    const parts = spec.split(",").map((s) => s.trim()).filter(Boolean);
    return parts.includes(raw);
  }
  return raw === spec;
};

const rgIsCheckValueTruthy = (v) =>
  v === true ||
  v === 1 ||
  v === "1" ||
  String(v).toLowerCase() === "true";

/** bulkLoadMode — setRows 전 1회 전처리용 잠금 플래그 */
const RG_CHK_LOCKED_FIELD = "_rgChkLocked";

/** mstGridInfo expr:decode(blnChk,0,"checkbox","none") 파싱 */
const parseGridDecodeExpr = (expr) => {
  const s = String(expr ?? "").trim();
  if (!/^expr:decode/i.test(s)) return null;
  const m = s.match(
    /^expr:decode\s*\(\s*([^,]+)\s*,\s*([^,]+)\s*,\s*"([^"]*)"\s*,\s*"([^"]*)"\s*\)\s*$/i
  );
  if (!m) return null;
  return {
    field: m[1].trim(),
    matchVal: m[2].trim().replace(/^['"]|['"]$/g, ""),
    trueResult: m[3].trim(),
    falseResult: m[4].trim(),
  };
};

const rgDecodeExprMatches = (raw, matchVal) => {
  if (raw === undefined || raw === null) return false;
  return String(raw).trim() === String(matchVal).trim() || raw == matchVal;
};

const rgGetGridMetaItem = (colId) =>
  tabInitSetArray.value.find((t) => t.strColID === colId);

const rgGetMetaEditDecodeForCol = (colId) =>
  parseGridDecodeExpr(rgGetGridMetaItem(colId)?.strEdit);

const rgResolveMetaDecodeKind = (decode, raw) => {
  if (!decode) return null;
  if (raw === undefined || raw === null) {
    return decode.falseResult;
  }
  return rgDecodeExprMatches(raw, decode.matchVal)
    ? decode.trueResult
    : decode.falseResult;
};

const rgIsRowLockedByMetaDecode = (source, dataRow, decode, fromRow = false) => {
  if (!decode) return false;
  const raw = fromRow
    ? source[decode.field]
    : source?.getValue?.(dataRow, decode.field);
  const kind = rgResolveMetaDecodeKind(decode, raw);
  return kind === "none" || kind === "";
};

const rgIsMetaEditCheckLocked = (ds, dataRow, colId) => {
  if (props.useMetaEditExpr !== true) return false;
  const decode = rgGetMetaEditDecodeForCol(colId);
  return rgIsRowLockedByMetaDecode(ds, dataRow, decode);
};

const buildMetaEditStyleCallback = (metaItem, rowStateeditable) => {
  const editDec = parseGridDecodeExpr(metaItem?.strEdit);
  const bgDec = parseGridDecodeExpr(metaItem?.strBackColorexp);
  if (!editDec && !bgDec) return null;

  return function (grid, dataCell) {
    const dr = dataCell?.index?.dataRow;
    if (dr == null || (typeof dr === "number" && dr < 0)) {
      return {};
    }
    const ds = grid.getDataSource();
    if (!ds) {
      return {};
    }

    const condField = editDec?.field ?? bgDec?.field;
    const raw = condField ? ds.getValue(dr, condField) : undefined;
    const ret = {};

    if (editDec) {
      const kind = rgResolveMetaDecodeKind(editDec, raw);
      if (kind === "checkbox" || kind === "check") {
        Object.assign(ret, rgCheckStyleEditable);
      } else {
        ret.renderer = { type: "text", editable: false };
      }
    }

    if (bgDec) {
      const color = rgResolveMetaDecodeKind(bgDec, raw);
      if (color && color.toLowerCase() !== "white") {
        ret.style = { backgroundColor: color };
      }
    }

    if (ret.editable === undefined) {
      ret.editable = rowStateeditable;
    }
    return ret;
  };
};

/** 헤더 전체선택 — checkAbleExpression styleCallback 과 동일하게 선택 가능한 행인지 */
const rgIsCheckColumnHeaderSelectable = (dataProvider, dataRow, colFieldName) => {
  if (props.useMetaEditExpr === true) {
    const metaDecode = rgGetMetaEditDecodeForCol(colFieldName);
    if (metaDecode) {
      if (
        dataProvider?.getValue?.(dataRow, RG_CHK_LOCKED_FIELD) === 1
      ) {
        return false;
      }
      return !rgIsRowLockedByMetaDecode(dataProvider, dataRow, metaDecode);
    }
  }

  if (!isCheckAbleExpressionColumn(colFieldName)) {
    return true;
  }

  if (
    (props.bulkLoadMode === true || props.useMetaEditExpr === true) &&
    dataProvider?.getValue?.(dataRow, RG_CHK_LOCKED_FIELD) === 1
  ) {
    return false;
  }

  const fname = String(colFieldName ?? "");
  const c2 = (props.checkAbleExpressionCol2 || "").trim();
  const c3 = (props.checkAbleExpressionCol3 || "").trim();

  if (c3) {
    const v = rgSafeDataSourceGetValue(dataProvider, dataRow, c3);
    if (v === undefined) return true;
    return rgCheckAbleValMatches(props.checkAbleExpressionVal2, v);
  }

  if (!c2) return true;

  const blnChk = rgSafeDataSourceGetValue(dataProvider, dataRow, c2);
  if (blnChk === undefined) return true;

  if (fname === "Selected") {
    return !rgCheckAbleValMatches(props.checkAbleExpressionVal, blnChk);
  }
  if (fname === "cancled") {
    return !rgCheckAbleValMatches(props.checkAbleExpressionVal2, blnChk);
  }

  if (rgCheckAbleValMatches(props.checkAbleExpressionVal, blnChk)) {
    return true;
  }
  return blnChk == props.checkAbleExpressionVal;
};

const rgCollectCheckedRowData = () => {
  const rows = [];
  const rowCount = dataProvider?.getRowCount?.() ?? 0;
  const checkCol =
    props.checkRowAuto2 === true
      ? String(props.checkRowAuto2Col ?? "").trim()
      : "";

  if (checkCol) {
    for (let i = 0; i < rowCount; i++) {
      const v = rgSafeDataSourceGetValue(dataProvider, i, checkCol);
      if (rgIsCheckValueTruthy(v)) {
        rows.push(dataProvider.getJsonRow(i));
      }
    }
    return rows;
  }

  const checkedRows = gridView?.getCheckedRows?.() ?? [];
  for (const ri in checkedRows) {
    rows.push(dataProvider.getJsonRow(checkedRows[ri]));
  }
  return rows;
};

const rgSaveGridViewScrollState = () => ({
  topItem:
    typeof gridView?.getTopItem === "function" ? gridView.getTopItem() : null,
  current: gridView?.getCurrent?.() ?? null,
});

const rgRestoreGridViewScrollState = (saved) => {
  if (!saved || !gridView) return;
  try {
    if (saved.topItem != null && typeof gridView.setTopItem === "function") {
      gridView.setTopItem(saved.topItem);
    }
    if (saved.current?.dataRow >= 0) {
      gridView.setCurrent({
        dataRow: saved.current.dataRow,
        fieldName: saved.current.fieldName,
        column: saved.current.column,
      });
    }
  } catch (_) {
    void 0;
  }
};

/** 헤더 전체선택 — checkRowAuto2 셀 체크 컬럼은 setValue만 (checkRow 반복 시 느림·맨 아래로 스크롤) */
const rgSyncHeaderCheckRow = (rowIndex, checked, bulkCellCheckOnly) => {
  if (!bulkCellCheckOnly) {
    gridView.checkRow(rowIndex, checked);
  }
};

/** checkAbleExpression — 체크 불가(readOnly) 셀 배경 (진한 회색) */
const rgCheckReadonlyDisabledBg = { backgroundColor: "#9a9a9a" };
const rgCheckReadonlyDisabledStyleName = "rg-check-readonly-disabled";

const rgCheckStyleEditable = {
  renderer: { type: "check", editable: true },
};
const rgCheckStyleDisabled = {
  style: rgCheckReadonlyDisabledBg,
  styleName: rgCheckReadonlyDisabledStyleName,
  renderer: { type: "check", editable: false, readOnlySetDisabled: true },
};

/** bulkLoadMode / useMetaEditExpr — setRows 전 1회 잠금 플래그 in-place 설정 */
const preprocessBulkCheckRows = (rows) => {
  if (props.bulkLoadMode !== true && props.useMetaEditExpr !== true) {
    return rows;
  }
  if (!Array.isArray(rows) || rows.length === 0) return rows;

  if (props.useMetaEditExpr === true) {
    let decode = null;
    const checkCols = String(
      props.headerCheckBar ?? props.checkRowAuto2Col ?? ""
    )
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    for (const c of checkCols) {
      const d = rgGetMetaEditDecodeForCol(c);
      if (d) {
        decode = d;
        break;
      }
    }
    if (!decode) {
      for (const t of tabInitSetArray.value) {
        const d = parseGridDecodeExpr(t.strEdit);
        if (d) {
          decode = d;
          break;
        }
      }
    }
    if (decode) {
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if (row == null || typeof row !== "object" || Array.isArray(row)) {
          continue;
        }
        if (rgIsRowLockedByMetaDecode(row, null, decode, true)) {
          row[RG_CHK_LOCKED_FIELD] = 1;
        } else if (row[RG_CHK_LOCKED_FIELD] != null) {
          delete row[RG_CHK_LOCKED_FIELD];
        }
      }
      return rows;
    }
  }

  if (props.bulkLoadMode !== true) return rows;

  const c2 = String(props.checkAbleExpressionCol2 ?? "").trim();
  const val = String(props.checkAbleExpressionVal ?? "").trim();
  const col = String(props.checkAbleExpressionCol ?? "").trim();
  if (!c2 || !col) return rows;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (row == null || typeof row !== "object" || Array.isArray(row)) continue;
    const blnChk = row[c2];
    const locked =
      blnChk !== undefined &&
      blnChk !== null &&
      String(blnChk).trim() !== val &&
      blnChk != val;
    if (locked) {
      row[RG_CHK_LOCKED_FIELD] = 1;
    } else if (row[RG_CHK_LOCKED_FIELD] != null) {
      delete row[RG_CHK_LOCKED_FIELD];
    }
  }
  return rows;
};

const isRgCheckRowLocked = (ds, dataRow) =>
  (props.bulkLoadMode === true || props.useMetaEditExpr === true) &&
  ds?.getValue?.(dataRow, RG_CHK_LOCKED_FIELD) === 1;

/** bulkLoadMode — updatedRowData 미사용 화면에서 전체 getJsonRows 생략 */
const rgEmitUpdatedRowData = () => {
  if (props.bulkLoadMode === true) return;
  updatedrowData.value = [...dataProvider.getJsonRows()];
  emit("updatedRowData", updatedrowData.value);
};

/** 대량 setRows — beginUpdate·푸터 지연·불필요 refresh 생략 */
const applyRowsToProvider = (rows, options = {}) => {
  const { skipFooterDefer = false } = options;
  if (!dataProvider) return;
  const payload = preprocessBulkCheckRows(rows);
  let deferFooter = false;
  if (
    props.bulkLoadMode === true &&
    props.setFooter === true &&
    !skipFooterDefer &&
    gridView
  ) {
    deferFooter = true;
    try {
      gridView.setFooters({ visible: false });
    } catch (_) {}
  }
  try {
    dataProvider.beginUpdate();
    if (props.setTreeView == false) {
      dataProvider.setRows(payload);
    } else {
      dataProvider.setRows(payload, "TreeNum", false, null, "iconField");
    }
  } finally {
    try {
      dataProvider.endUpdate(true);
    } catch (_) {}
  }
  if (deferFooter) {
    requestAnimationFrame(() => {
      try {
        if (props.setFooter === true) {
          gridView?.setOptions?.({ summaryMode: "aggregate" });
        }
        gridView?.setFooters?.({ visible: true });
      } catch (_) {}
    });
  }
};

/** lngCheck 등 — blnChk(조건필드) 값으로 체크 가능 여부 (styleCallback 행마다 호출) */
const rgResolveCheckAbleCellStyle = (ds, dataRow, colId, rowStateeditable) => {
  const c2 = String(props.checkAbleExpressionCol2 ?? "").trim();
  const c3 = String(props.checkAbleExpressionCol3 ?? "").trim();
  const col = String(colId ?? "");

  if (col === "Selected") {
    if (!c2) return { ...rgCheckStyleEditable, editable: true };
    const blnChk = ds.getValue(dataRow, c2);
    if (blnChk === undefined || blnChk === null) {
      return { ...rgCheckStyleEditable, editable: rowStateeditable };
    }
    if (rgCheckAbleValMatches(props.checkAbleExpressionVal, blnChk)) {
      return { ...rgCheckStyleDisabled, editable: rowStateeditable };
    }
    return { ...rgCheckStyleEditable, editable: rowStateeditable };
  }

  if (col === "cancled") {
    if (!c3) return { ...rgCheckStyleEditable, editable: true };
    const blnChk = ds.getValue(dataRow, c3);
    if (blnChk === undefined || blnChk === null) {
      return { ...rgCheckStyleEditable, editable: rowStateeditable };
    }
    if (rgCheckAbleValMatches(props.checkAbleExpressionVal2, blnChk)) {
      return { ...rgCheckStyleDisabled, editable: rowStateeditable };
    }
    return { ...rgCheckStyleEditable, editable: rowStateeditable };
  }

  if (!c2) return { ...rgCheckStyleEditable, editable: rowStateeditable };
  const blnChk = ds.getValue(dataRow, c2);
  if (blnChk === undefined || blnChk === null) {
    return { ...rgCheckStyleEditable, editable: rowStateeditable };
  }
  if (blnChk != props.checkAbleExpressionVal) {
    return { ...rgCheckStyleDisabled, editable: rowStateeditable };
  }
  return { ...rgCheckStyleEditable, editable: rowStateeditable };
};

const isCheckboxGridColumn = (item) =>
  item?.strColID?.includes("checkbox") ||
  item?.strDisplay?.includes("checkbox");

/** extraColumns 등 동적 컬럼 — 기본 그리드 컬럼과 동일한 헤더 색상 상속 */
const withInheritedHeaderStyle = (baseColumns, extraCols) => {
  if (!Array.isArray(extraCols) || extraCols.length === 0) return [];
  const ref =
    baseColumns?.find((c) => c?.strHdBkColor) ?? baseColumns?.[0] ?? {};
  return extraCols.map((c) => ({
    ...c,
    strHdBkColor: c.strHdBkColor ?? ref.strHdBkColor ?? "#FFFFFF",
    strHdColor: c.strHdColor ?? ref.strHdColor ?? "#000000",
  }));
};

/** 콤마 목록 — `cancled,Selected`.includes 로는 부분 문자열 오탐 가능 */
const isCheckAbleExpressionColumn = (strColID) => {
  const raw = String(props.checkAbleExpressionCol ?? "").trim();
  if (!raw) return false;
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .includes(strColID);
};

const headerCheckBarHasCol = (strColID) => {
  const raw = String(props.headerCheckBar ?? "").trim();
  if (!raw) return false;
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .includes(strColID);
};

/** headerCheckBar 지정 시: 해당 컬럼만 헤더 체크. 미지정 시: checkbox 타입 컬럼 */
const resolveHeaderCheckLocation = (item) => {
  const isCheckboxCol =
    item.strColID.includes("checkbox") || item.strDisplay.includes("checkbox");
  const headerCheckSpec = String(props.headerCheckBar ?? "").trim();
  if (headerCheckSpec) {
    return headerCheckBarHasCol(item.strColID) ? "left" : "none";
  }
  return isCheckboxCol ? "left" : "none";
};

const matchesCheckedRowData2Col = (colName) => {
  const raw = String(props.checkedRowData2Col ?? "").trim();
  if (!raw || colName == null || colName === "") return false;
  const norm = String(colName).trim().toLowerCase();
  return raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
    .includes(norm);
};

/** 탭으로 그리드 루트에 들어올 때 RealGrid 캔버스로 포커스 (Delete 행삭제) */
const onGridContainerFocusIn = () => {
  if (props.keyDeleteRemovesCurrentRow !== true) return;
  try {
    gridView?.setFocus?.();
  } catch {
    void 0;
  }
};

// 2구간
const realgridname = ref(); // 동적 ID 설정

const rgBuildHeaderStyleBlock = (item, index) => {
  const fontRule =
    props.gridFontSize > 0
      ? `font-size: ${props.gridFontSize}px !important;`
      : "";
  return `
        .header-style-${realgridname.value}${index} {
          background-color: ${item.strHdBkColor} !important;
          color: ${item.strHdColor} !important;
          text-align: center !important;
          vertical-align: middle !important;
          ${fontRule}
        }
      `;
};

const rgBuildGridFontSizeCss = () => {
  if (props.gridFontSize <= 0 || !realgridname.value) return "";
  const fs = props.gridFontSize;
  const id = realgridname.value;
  return `
    #${id} .rg-data-cell,
    #${id} .rg-body-cell,
    #${id} .rg-header-cell,
    #${id} .rg-header-group-cell,
    #${id} .setTextAlignLeft,
    #${id} .setTextAlignCenter,
    #${id} .setTextAlignRight {
      font-size: ${fs}px !important;
    }
  `;
};

/** mstgridInfo.intHdHeight — props 없을 때 헤더 높이 (프론트 미연동이었음) */
const rgGridInfoHeaderHeight = ref(0);

const rgParseGridInfoHeaderHeight = (items) => {
  let max = 0;
  for (const it of items || []) {
    const h = Number(it?.intHdHeight) || 0;
    if (h > max) {
      max = h;
    }
  }
  return max;
};

const rgEffectiveRowHeight = () =>
  props.gridRowHeight > 0 ? props.gridRowHeight : 0;

const rgEffectiveHeaderHeight = () =>
  props.gridHeaderHeight > 0
    ? props.gridHeaderHeight
    : rgGridInfoHeaderHeight.value;

const rgApplyForceColumnLayout = (gv) => {
  const layout = props.forceColumnLayout;
  if (!gv || !Array.isArray(layout) || layout.length === 0) {
    return;
  }
  try {
    gv.setColumnLayout(layout);
  } catch (_) {
    void 0;
  }
};

/** labelingColumns 드롭다운 — domainOnly:false; fixLabelingDropdownOnShow 시 listCallback으로 목록 고정 */
const rgBuildLabelingDropdownEditor = (valueList, labelList) => {
  const values = valueList.map(String);
  const labels = labelList.map(String);
  if (props.fixLabelingDropdownOnShow) {
    const list = values.map((value, idx) => ({
      value,
      label: labels[idx] ?? value,
    }));
    return {
      type: "list",
      domainOnly: false,
      textReadOnly: true,
      dropDownWhenClick: true,
      commitOnSelect: true,
      dropDownCount: values.length,
      values: [...values],
      labels: [...labels],
      listCallback: function () {
        return {
          value: "value",
          label: "label",
          list,
        };
      },
    };
  }
  return {
    type: "dropdown",
    domainOnly: false,
    textReadOnly: true,
    dropDownWhenClick: true,
    commitOnSelect: true,
    dropDownCount: Math.max(values.length, 3),
    dropDownPosition: "editor",
  };
};

const rgResolveLabelingFieldKey = (index, grid) => {
  if (!index) {
    return "";
  }
  if (index.fieldName) {
    return index.fieldName;
  }
  const colRef = index.column;
  if (typeof colRef === "string") {
    return colRef;
  }
  const fromCol = colRef?.fieldName ?? colRef?.name ?? "";
  if (fromCol) {
    return fromCol;
  }
  if (grid && index.column != null) {
    try {
      const col = grid.getColumn?.(index.column);
      return col?.fieldName ?? col?.name ?? "";
    } catch (_) {
      void 0;
    }
  }
  return "";
};

const rgFindLabelingColumnIndex = (fieldKey) => {
  const lcolumns = props.labelingColumns
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (!fieldKey) {
    return -1;
  }
  let colIdx = lcolumns.indexOf(fieldKey);
  if (colIdx >= 0) {
    return colIdx;
  }
  const lower = String(fieldKey).toLowerCase();
  colIdx = lcolumns.findIndex((col) => col.toLowerCase() === lower);
  return colIdx;
};

const rgApplyLabelingDropdownEditorToGrid = (grid, fieldKey) => {
  const colIdx = rgFindLabelingColumnIndex(fieldKey);
  if (colIdx < 0) {
    return;
  }
  const valueList = props.valuesData[colIdx];
  const labelList = props.labelsData[colIdx];
  if (!valueList?.length || !labelList?.length) {
    return;
  }
  const editor = rgBuildLabelingDropdownEditor(valueList, labelList);
  try {
    grid.setColumnProperty?.(fieldKey, "lookupDisplay", true);
    grid.setColumnProperty?.(fieldKey, "values", valueList);
    grid.setColumnProperty?.(fieldKey, "labels", labelList);
    grid.setColumnProperty?.(fieldKey, "editor", editor);
    if (props.fixLabelingDropdownOnShow) {
      grid.setColumnProperty?.(fieldKey, "editButtonVisibility", "always");
    }
  } catch (_) {
    void 0;
  }
};

const rgBindLabelingDropdownOnShowEditor = (gv) => {
  if (
    !gv ||
    !props.labelingColumns ||
    !props.fixLabelingDropdownOnShow ||
    gv.__rgLabelingDropdownOnShowBound
  ) {
    return;
  }
  gv.__rgLabelingDropdownOnShowBound = true;
  const prevOnShowEditor = gv.onShowEditor;
  gv.onShowEditor = function (grid, index, editProps, attrs) {
    let allow = true;
    if (typeof prevOnShowEditor === "function") {
      const ret = prevOnShowEditor(grid, index, editProps, attrs);
      if (ret === false) {
        return false;
      }
      if (typeof ret === "boolean") {
        allow = ret;
      }
    }
    const fieldKey = rgResolveLabelingFieldKey(index, grid);
    const colIdx = rgFindLabelingColumnIndex(fieldKey);
    if (colIdx >= 0) {
      const valueList = props.valuesData[colIdx];
      const labelList = props.labelsData[colIdx];
      if (valueList?.length && labelList?.length) {
        const editor = rgBuildLabelingDropdownEditor(valueList, labelList);
        Object.assign(editProps, editor);
        rgApplyLabelingDropdownEditorToGrid(grid, fieldKey);
      }
    }
    return allow;
  };
};

/** labelingColumns 드롭다운 — domainOnly:false, values/labels는 컬럼에만 */
const rgReapplyLabelingDropdownEditors = (gv) => {
  if (!gv || !props.labelingColumns) {
    return;
  }
  const lcolumns = props.labelingColumns
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const labels = props.labelsData;
  const values = props.valuesData;
  for (let i = 0; i < lcolumns.length; i++) {
    const field = lcolumns[i];
    const valueList = values[i];
    const labelList = labels[i];
    if (!field || !valueList || !labelList) {
      continue;
    }
    try {
      const gvCol = gv.columnByField(field);
      if (!gvCol) {
        continue;
      }
      gvCol.lookupDisplay = true;
      gvCol.values = valueList;
      gvCol.labels = labelList;
      if (props.fixLabelingDropdownOnShow) {
        gvCol.editButtonVisibility = "always";
      }
      const editor = props.fixLabelingDropdownOnShow
        ? rgBuildLabelingDropdownEditor(valueList, labelList)
        : (() => {
            const editorType =
              gvCol.editor?.type === "list" ? "list" : "dropdown";
            return {
              type: editorType,
              domainOnly: false,
              textReadOnly: true,
              dropDownWhenClick: true,
              commitOnSelect: true,
              dropDownCount: valueList.length,
            };
          })();
      gvCol.editor = editor;
      gv.setColumnProperty?.(field, "lookupDisplay", true);
      gv.setColumnProperty?.(field, "values", valueList);
      gv.setColumnProperty?.(field, "labels", labelList);
      gv.setColumnProperty?.(field, "editor", editor);
      if (props.fixLabelingDropdownOnShow) {
        gv.setColumnProperty?.(field, "editButtonVisibility", "always");
      }
    } catch (_) {
      void 0;
    }
  }
};

/** RealGrid2 — setStyles 미지원 시에도 초기화가 중단되지 않도록 폰트·정렬 적용 */
const rgApplyGridTypographyStyles = (gv) => {
  if (!gv || (props.gridFontSize <= 0 && !props.gridBodyLineAlignment)) {
    return;
  }
  const bodyStyle = {};
  if (props.gridFontSize > 0) {
    bodyStyle.fontSize = String(props.gridFontSize);
  }
  if (props.gridBodyLineAlignment) {
    bodyStyle.lineAlignment = props.gridBodyLineAlignment;
  }
  const styles = { body: bodyStyle };
  if (props.gridFontSize > 0) {
    styles.header = { fontSize: String(props.gridFontSize) };
  }
  if (typeof gv.setStyles === "function") {
    try {
      gv.setStyles(styles);
      return;
    } catch (_) {
      void 0;
    }
  }
  const el = document.getElementById(realgridname.value);
  if (el && props.gridFontSize > 0) {
    el.style.fontSize = `${props.gridFontSize}px`;
  }
};

/** rowHeight·폰트 적용 후 refresh. rowHeight 변경 시 resetSize로 클릭 영역·No열 동기화 */
const rgSyncGridLayout = () => {
  rgBindActiveInstance(realgridname);
  if (!gridView || !isGridInitialized.value) return;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      try {
        const rowH = rgEffectiveRowHeight();
        const hdrH = rgEffectiveHeaderHeight();
        if (rowH > 0) {
          gridView.displayOptions.rowHeight = rowH;
        }
        if (hdrH > 0) {
          gridView.header.height = hdrH;
        }
        if (
          Array.isArray(props.forceColumnLayout) &&
          props.forceColumnLayout.length > 0
        ) {
          rgApplyForceColumnLayout(gridView);
        } else if (!props.preserveColumnLayoutOnRefresh) {
          gridView.refresh(true);
        }
        if (props.syncGridHeight === true || rowH > 0) {
          gridView.resetSize();
        }
      } catch (_) {}
    });
  });
};

const tabInitSetArray = ref([]);
const selectedRowData = ref([]);
const result2 = ref([]);
const deletedIndex = ref();
const addrow4activated = ref(false);
const deleted2activated = ref(false);
const updatedrowData = ref([]);
const selectedindex = ref(-1);
const isGridInitialized = ref(false);
const previousRowDataLength = ref(0);
const emit = defineEmits([
  "selcetedrowData",
  "updatedRowData",
  "updatedRowData2",
  "updatedrowData",
  "clickedRowData",
  "clickedRowData2",
  "cellClicked",
  "dblclickedRowData",
  "selectedIndex",
  "selectedIndex2",
  "selectedindex",
  "checkedRowData",
  "checkedRowIndex",
  "getJsonData",
  "sendRowState",
  "deleteRows",
  "realgridName",
  "realgridname",
  "allStateRows",
  "buttonClicked",
  "clickedButtonCol",
  "checkAllorNot",
  "checkedRowData2",
  "gridReady",
]);
// 3구간
const runFuncshowGrid = async () => {
  if (tabInitSetArray.value.length == 0) {
    return;
  }
  rgGridInfoHeaderHeight.value = rgParseGridInfoHeaderHeight(
    tabInitSetArray.value
  );
  rgDestroyInstance(undefined, realgridname);
  isGridInitialized.value = false;

  if (props.setTreeView == false) {
    dataProvider = new LocalDataProvider();
  } else {
    dataProvider = new LocalTreeDataProvider();
  }

  // nextTick으로 DOM 업데이트 후 초기화
  //
  await nextTick();
  const container = document.getElementById(realgridname.value);
  await nextTick();
  if (!container) {
    //console.error(`Invalid grid container element: ${realgridname.value}`);
    return;
  }

  if (props.setTreeView == false) {
    gridView = new GridView(container);
    gridView.setDataSource(dataProvider);
  } else {
    gridView = new TreeView(container);
    gridView.setDataSource(dataProvider);
  }
  rgInstanceRegistry.set(realgridname.value, { gridView, dataProvider });
  window.gridView = gridView;
  /** 이 runFuncshowGrid 클로저 전용 — 다중 그리드 시 module dataProvider 덮어쓰기 방지 */
  const rgSelfId = realgridname.value;
  const rgLocalDp = () => rgInstanceRegistry.get(rgSelfId)?.dataProvider ?? null;
  const rgLocalGv = () => rgInstanceRegistry.get(rgSelfId)?.gridView ?? null;

  const parseDecimalColumnIds = (propVal) =>
    String(propVal || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  const signedDecimalColumnIds = parseDecimalColumnIds(
    props.inputSignedDecimalColumn
  );
  const unsignedDecimalColumnIds = parseDecimalColumnIds(
    props.inputUnsignedDecimalColumn
  );
  const colIdInDecimalList = (colId, list) => list.includes(colId);
  const isSignedDecimalColumn = (colId) =>
    colIdInDecimalList(colId, signedDecimalColumnIds);
  const isUnsignedDecimalColumn = (colId) =>
    colIdInDecimalList(colId, unsignedDecimalColumnIds);
  const isDecimalInputColumn = (colId) =>
    isSignedDecimalColumn(colId) || isUnsignedDecimalColumn(colId);
  const SIGNED_DECIMAL_MAX_PLACES = 2;
  const signedDecimalNumberFormat = "#,##0.##";
  const isGridNumberMask = (mask) => {
    const m = String(mask ?? "").trim();
    return m !== "" && m !== "@@@@-@@-@@" && /[#0,]/.test(m);
  };
  const resolveGridNumberFormat = (item) => {
    if (isDecimalInputColumn(item.strColID)) return signedDecimalNumberFormat;
    if (props.suffixColumnwon == "lngPrice" && item.strColID == "lngPrice") {
      return "#,##0";
    }
    const mask = String(item.strMask ?? "").trim();
    if (isGridNumberMask(mask)) return mask;
    if (item.strColType == "float") return "#,##0";
    if (item.strColType === "double" && item.strDisplay == "double2") {
      return "#,##0.000";
    }
    if (item.strColType === "double" && item.strDisplay == "double") {
      return "#,##0.00";
    }
    if (item.strColType === "double" && item.strDisplay != "double") {
      return "#,##0.0";
    }
    return "#,##0.0";
  };
  const countMeaningfulDecimalPlaces = (
    v,
    maxPlaces = SIGNED_DECIMAL_MAX_PLACES
  ) => {
    if (v === null || v === undefined || v === "") return 0;
    const s = String(v).trim();
    if (!s.includes(".")) return 0;
    const frac = (s.split(".")[1] || "").replace(/0+$/, "");
    return Math.min(frac.length, maxPlaces);
  };
  const roundSignedDecimal = (v, maxPlaces = SIGNED_DECIMAL_MAX_PLACES) => {
    const n = Number(v);
    if (Number.isNaN(n)) return v;
    const factor = 10 ** maxPlaces;
    return Math.round(n * factor) / factor;
  };
  const getMaxDecimalPlacesInGridColumn = (
    grid,
    colId,
    maxPlaces = SIGNED_DECIMAL_MAX_PLACES
  ) => {
    let max = 0;
    const cnt = grid.getItemCount();
    for (let i = 0; i < cnt; i++) {
      max = Math.max(
        max,
        countMeaningfulDecimalPlaces(grid.getValue(i, colId), maxPlaces)
      );
    }
    return max;
  };
  const formatSignedDecimalSum = (num, decimalPlaces) => {
    const n = Number(num);
    if (Number.isNaN(n)) return num;
    if (decimalPlaces <= 0) {
      return Math.round(n).toLocaleString("ko-KR", {
        maximumFractionDigits: 0,
      });
    }
    const factor = 10 ** decimalPlaces;
    const rounded = Math.round(n * factor) / factor;
    const fixed = rounded.toFixed(decimalPlaces);
    const trimmed = fixed.replace(/(\.\d*?)0+$/, "$1").replace(/\.$/, "");
    const negative = trimmed.startsWith("-");
    const abs = negative ? trimmed.slice(1) : trimmed;
    const [intPart, decPart] = abs.split(".");
    const formattedInt = Number(intPart).toLocaleString("ko-KR");
    let result = formattedInt + (decPart !== undefined ? "." + decPart : "");
    return negative ? "-" + result : result;
  };
  const formatSignedDecimalFooterValue = (grid, colId, rawValue) => {
    const numVal = Number(rawValue);
    if (Number.isNaN(numVal)) return rawValue;
    const maxDec = getMaxDecimalPlacesInGridColumn(grid, colId);
    return formatSignedDecimalSum(numVal, maxDec);
  };

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
        : isDecimalInputColumn(item.strColID) ||
          item.strColType == "number" ||
          item.strDisplay == "number" ||
          isGridNumberMask(item.strMask) ||
          item.strColType === "float" ||
          item.strColType === "double"
        ? "number"
        : String(item.strMask || "").trim() === "@@@@-@@-@@"
        ? "text" // YYYYMMDD 저장, displayCallback으로 표시
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
    valueCallback: props.CalculateShortQty.includes(item.strColID)
      ? function (prod, dataRow, fieldName, fieldNames, values) {
          let dblResultQty = values[fieldNames.indexOf("dblResultQty")];
          let dblTakeQty = values[fieldNames.indexOf("dblTakeQty")];

          if (dblResultQty > 0) {
            return parseInt(dblTakeQty) - parseInt(dblResultQty);
          } else {
            return parseInt(dblTakeQty) + parseInt(dblResultQty);
          }
        }
      : props.CalculateSupplyPrice.includes(item.strColID)
      ? function (prod, dataRow, fieldName, fieldNames, values) {
          let curUnitPrice = values[fieldNames.indexOf("curUnitPrice")];
          let dblCheckQty = values[fieldNames.indexOf("dblCheckQty")];

          let supplyPrice = curUnitPrice * dblCheckQty;

          return supplyPrice;
        }
      : props.CalculateVatPrice.includes(item.strColID)
      ? function (prod, dataRow, fieldName, fieldNames, values) {
          let curUnitPrice = values[fieldNames.indexOf("curUnitPrice")];
          let dblCheckQty = values[fieldNames.indexOf("dblCheckQty")];

          let supplyPrice = curUnitPrice * dblCheckQty;
          let vat = supplyPrice * 0.1; // 예: 부가세

          return vat;
        }
      : props.CalculateTotalPrice.includes(item.strColID)
      ? function (prod, dataRow, fieldName, fieldNames, values) {
          let curUnitPrice = values[fieldNames.indexOf("curUnitPrice")];
          let dblCheckQty = values[fieldNames.indexOf("dblCheckQty")];

          let supplyPrice = curUnitPrice * dblCheckQty;
          let vat = supplyPrice * 0.1; // 예: 부가세
          let total = supplyPrice + vat; // 합계

          return total;
        }
      : props.CalculateTaxColId2.includes(item.strColID)
      ? function (prod, dataRow, fieldName, fieldNames, values) {
          const unitp = Number(values[fieldNames.indexOf("curUnitPrice")] || 0);
          const signedDecimalRaw =
            typeof props.inputSignedDecimalColumn === "string" &&
            String(props.inputSignedDecimalColumn).trim() !== ""
              ? String(props.inputSignedDecimalColumn).split(",")[0].trim()
              : "";
          const primaryRaw =
            typeof props.inputOnlyNumberColumn === "string" &&
            String(props.inputOnlyNumberColumn).trim() !== ""
              ? String(props.inputOnlyNumberColumn).split(",")[0].trim()
              : signedDecimalRaw;
          let qty = 0;
          const primaryIdx =
            primaryRaw !== "" ? fieldNames.indexOf(primaryRaw) : -1;
          if (primaryIdx >= 0) {
            qty = Number(values[primaryIdx] || 0);
          } else {
            const iOrder = fieldNames.indexOf("dblOrderQty");
            const iCheck = fieldNames.indexOf("dblCheckQty");
            if (iOrder >= 0) {
              qty = Number(values[iOrder] || 0);
            } else if (iCheck >= 0) {
              qty = Number(values[iCheck] || 0);
            }
          }
          return Math.floor(unitp * qty);
        }
      : props.CalculateTaxColId.includes(item.strColID)
      ? function (prod, dataRow, fieldName, fieldNames, values) {
          /** 그리드 메타에 lngTaxType 컬럼이 없으면 indexOf 가 -1 — 상단 발주그리드(PUR 등)에서 부가세가 0만 나오는 현상 방지 */
          const ti = fieldNames.indexOf("lngTaxType");
          const si = fieldNames.indexOf("curSupply");
          let taxType = ti >= 0 ? values[ti] : undefined;
          const supply = si >= 0 ? Number(values[si] || 0) : 0;
          if (
            taxType === undefined ||
            taxType === null ||
            taxType === ""
          ) {
            taxType = "01";
          }

          if (taxType == "01") {
            return Math.floor(supply * 0.1);
          } else {
            return 0;
          }
        }
      : props.CalculateTaxColId3.includes(item.strColID)
      ? function (prod, dataRow, fieldName, fieldNames, values) {
          let curSupply = values[fieldNames.indexOf("curSupply")];
          let curTax = values[fieldNames.indexOf("curTax")];

          return Math.floor(curSupply + curTax);
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

  for (const extraField of [
    props.checkAbleExpressionCol2,
    props.checkAbleExpressionCol3,
  ]) {
    const fn = String(extraField ?? "").trim();
    if (!fn || fields.some((f) => f.fieldName === fn)) continue;
    fields.push({ fieldName: fn, dataType: "text" });
  }

  if (
    props.checkBarFieldName &&
    props.checkBarFieldName !== "checkbox" &&
    !fields.some((f) => f.fieldName === props.checkBarFieldName)
  ) {
    fields.push({ fieldName: props.checkBarFieldName, dataType: "boolean" });
  }

  if (
    (props.bulkLoadMode === true || props.useMetaEditExpr === true) &&
    !fields.some((f) => f.fieldName === RG_CHK_LOCKED_FIELD)
  ) {
    fields.push({ fieldName: RG_CHK_LOCKED_FIELD, dataType: "number" });
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

  const rgColWidthScaleMap = props.mergeColumnWidthScale2 || {};
  const rgScaledColumnWidth = (colId, baseWidth) => {
    const scale = rgColWidthScaleMap[colId];
    if (!scale || !baseWidth) {
      return baseWidth;
    }
    return Math.max(1, Math.round(baseWidth * scale));
  };

  // 컬럼 정의
  const columns = tabInitSetArray.value.map((item, index) => ({
    name: item.strColID,
    fieldName: item.strColID,
    header: {
      text: item.strHdText,
      styleName: `header-style-${realgridname.value}${index}`,
      checkLocation: resolveHeaderCheckLocation(item),
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
      text: (() => {
        const customIdx = props.setGroupSumCustomColumnId.indexOf(item.strColID);
        if (customIdx < 0) return undefined;
        // nameField opt-in 시 static text는 비우고 valueCallback으로 동적 표기
        if (props.setGroupSumCustomNameField) return "";
        return props.setGroupSumCustomText[customIdx];
      })(),
      styleName: (() => {
        // 기존 정렬 설정
        const align = item.strAlign == "center"
          ? "setTextAlignCenter"
          : item.strAlign == "left"
          ? "setTextAlignLeft"
          : "setTextAlignRight";
        return align;
      })(),
      expression:
        props.setGroupFooterExpressions[
          props.setGroupFooterColID.indexOf(item.strColID)
        ] == "custom"
          ? ""
          : props.setGroupFooterExpressions[
              props.setGroupFooterColID.indexOf(item.strColID)
            ],
      numberFormat: isDecimalInputColumn(item.strColID)
        ? ""
        : resolveGridNumberFormat(item),
      valueCallback: function (grid, column, groupFooterIndex, group, value) {
        // opt-in: 사원명 + 접미사 (예: 홍길동님 소계)
        const customIdx = props.setGroupSumCustomColumnId.indexOf(item.strColID);
        if (customIdx >= 0 && props.setGroupSumCustomNameField) {
          const suffix = props.setGroupSumCustomText[customIdx] || "";
          try {
            const dataRow =
              group && group.firstItem ? group.firstItem.dataRow : null;
            if (dataRow == null || dataRow < 0) return suffix;
            const name = dataProvider.getValue(
              dataRow,
              props.setGroupSumCustomNameField
            );
            return (name == null ? "" : String(name)) + suffix;
          } catch (e) {
            return suffix;
          }
        }

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

          const evaluated = eval(returnText);
          const safeVal = evaluated == "Infinity" ? 0 : evaluated;
          if (isDecimalInputColumn(item.strColID)) {
            return formatSignedDecimalFooterValue(
              grid,
              item.strColID,
              safeVal
            );
          }
          return safeVal;
        } else {
          return isDecimalInputColumn(item.strColID)
            ? formatSignedDecimalFooterValue(grid, item.strColID, value)
            : value;
        }
      },
      styleCallback: function (grid, item2) {
        let ret = {};

        // count 표현식이 사용되는 컬럼은 가운데 정렬 유지
        const colIndex = props.setGroupFooterColID.indexOf(item.strColID);
        const isCount = colIndex !== -1 && props.setGroupFooterExpressions[colIndex] === "count";
        
        let defaultGroupNum = 2;
        if (props.setGroupColumnId != []) {
          defaultGroupNum = props.setGroupColumnId.split(",").length;
        }

        if (item.strAlign !== "right") {
          // count 컬럼은 가운데 정렬 유지
          if (isCount) {
            if (defaultGroupNum == 1) {
              if (item2.level == 2) {
                ret.styleName = "skyblue setTextAlignCenter";
              }
            } else if (defaultGroupNum == 2) {
              if (item2.level == 2) {
                ret.styleName = "blue setTextAlignCenter";
              } else if (item2.level == 3) {
                ret.styleName = "skyblue setTextAlignCenter";
              }
            } else if (defaultGroupNum == 3) {
              if (item2.level == 2) {
                ret.styleName = "green setTextAlignCenter";
              } else if (item2.level == 3) {
                ret.styleName = "blue setTextAlignCenter";
              } else if (item2.level == 4) {
                ret.styleName = "skyblue setTextAlignCenter";
              }
            }
          } else {
            // 기존 로직 (왼쪽 정렬)
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
      numberFormat: isDecimalInputColumn(item.strColID)
        ? ""
        : item.strTotalexpr != ""
        ? item.strTotalexpr
        : resolveGridNumberFormat(item),
      suffix: props.suffixColumnPercent.includes(item.strColID) ? "%" : "",
      valueCallback: function (grid, column, footerIndex, columnFooter, value) {
        // count 표현식 처리 - 그룹푸터 제외한 실제 데이터 행만 카운트
        if (
          props.setFooterColID.indexOf(item.strColID) !== -1 &&
          props.setFooterExpressions[
            props.setFooterColID.indexOf(item.strColID)
          ] === "count"
        ) {
          // dataProvider.getRowCount()는 그룹푸터를 제외한 실제 데이터 행 수만 반환
          const dataRowCount = dataProvider.getRowCount();
          return dataRowCount;
        }
        
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

        const footerOverrideIdx = props.setFooterColID.indexOf(item.strColID);
        let totalSumtext = item.strTotalSumtext;
        if (
          footerOverrideIdx !== -1 &&
          props.setFooterExpressions[footerOverrideIdx] === "sum"
        ) {
          totalSumtext = `sum(${item.strColID})`;
        }

        if (totalSumtext != "" && totalSumtext != "N") {
          while ((match = regex.exec(totalSumtext)) !== null) {
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

          if (item.strDisplay == "time") {
            let cnt = grid.getItemCount();
            let result = 0;
            let result2 = 0;
            for (var i = 0; i < cnt; i++) {
              let value = grid.getValue(i, item.strColID);

              if (value == "" || value == undefined) {
                value = "00:00";
              }
              result += parseInt(value.split(":")[0]);
              result2 += parseInt(value.split(":")[1]);
            }

            let remain = Math.floor(result2 / 60);
            result += remain;
            result2 = result2 % 60;
            return (
              String(result).padStart(2, "0") +
              ":" +
              String(result2).padStart(2, "0")
            );
          }

          const evaluated = eval(returnText);
          const safeVal = evaluated == "Infinity" ? 0 : evaluated;
          if (isDecimalInputColumn(item.strColID)) {
            return formatSignedDecimalFooterValue(
              grid,
              item.strColID,
              safeVal
            );
          }
          return safeVal;
        } else {
          return isDecimalInputColumn(item.strColID)
            ? formatSignedDecimalFooterValue(grid, item.strColID, value)
            : value;
        }
      },
    },

    datetimeFormat: item.strMask == "" ? "yyyy-MM-dd" : item.strMask, // sql 에서 mstgridinfo 에서 date  일때 기본값이 있고 정의할 수 있음
    // YYYYMMDD 형식 값을 yyyy-MM-dd로 표시 (실제 데이터는 변경하지 않음)
    // mstGridInfo strMask='@@@@-@@-@@' 컬럼만 적용
    ...(String(item.strMask || "").trim() === "@@@@-@@-@@" && {
      displayCallback: function (grid, index, value) {
        if (
          value != null &&
          String(value).length === 8 &&
          /^\d{8}$/.test(String(value))
        ) {
          const s = String(value);
          return s.substr(0, 4) + "-" + s.substr(4, 2) + "-" + s.substr(6, 2);
        }
        return value;
      },
    }),
    width: rgScaledColumnWidth(item.strColID, item.intHdWidth),
    numberFormat: resolveGridNumberFormat(item),
    styleName:
      props.dynamicRowHeight2 == true && item.strAlign == "left"
        ? "setTextAlignLeft"
        : props.dynamicRowHeight == true
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
        : isDecimalInputColumn(item.strColID)
        ? "number"
        : "line",
      domainOnly: true,
      textReadOnly: false,
      dropDownWhenClick: true,
      datetimeFormat: "yyyy-MM-dd",
      mask:
        item.strColID == "strSTime" ||
        item.strColID == "strETime" ||
        item.strColID == "strWTime" ||
        item.strColID == "dtmAttendPlan" ||
        item.strColID == "dtmLeavePlan"
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
          : item.strColType.includes("date")
          ? {
              editMask: "9999-99-99",
              includedFormat: true,
            }
          : null,
      commitOnSelect: true,
      ...(isDecimalInputColumn(item.strColID)
        ? {
            editFormat: signedDecimalNumberFormat,
            ...(isUnsignedDecimalColumn(item.strColID)
              ? { positiveOnly: true }
              : {}),
          }
        : {}),
      inputCharacters: isUnsignedDecimalColumn(item.strColID)
        ? "0123456789."
        : isSignedDecimalColumn(item.strColID)
        ? "0123456789.-"
        : props.inputOnlyNumberColumn
            .split(",")
            .includes(item.strColID)
        ? "0123456789"
        : item.strColID == props.inputOnlyNumberColumn2
        ? "0123456789."
        : "",
    },
    visible: item.intHdWidth !== 0,
    sortable: true,
    renderer: {
      type:
        item.strColID == "add" ||
        item.strColID == "add1" ||
        item.strColID == "add2" ||
        item.strDisplay.includes("button")
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
        item.strColID != props.checkRenderEditable2Col &&
        (item.strColID.includes("checkbox") ||
          item.strDisplay.includes("checkbox"))
          ? true
          : props.checkRenderEditable == true &&
            item.strColID == props.checkRenderEditable2Col
          ? false
          : false, // 체크박스의 렌더러의 기능만 false 되는걸로 말씀주셨고 추후에 문제시 한 번 더 체크해볼것
    },
    buttonVisibility: "always",
    styleCallback:
      props.editableColByCondition == true
        ? // 시간값에 따라서 배경 색상 지정
          function (grid, dataCell) {
            var ret = {};

            if (item.strColID == "dblDemandQty") {
              const dr = dataCell?.index?.dataRow;
              if (dr == null || (typeof dr === "number" && dr < 0)) {
                return ret;
              }
              const ds = grid.getDataSource();
              if (!ds) {
                return ret;
              }
              const val = ds.getValue(dr, "dtmEndDate");
              const val2 = formatDateTime2(new Date());
              const val3 = ds.getValue(dr, "strStatus");

              return {
                editable:
                  new Date(val.replace(" ", "T")) >
                    new Date(val2.slice(0, 16).replace(" ", "T")) &&
                  val3 !== "출고완료",
              };
            }
          }
        : isCheckAbleExpressionColumn(item.strColID) &&
          props.bulkLoadMode !== true
        ? function (grid, dataCell) {
            const dr = dataCell?.index?.dataRow;
            if (dr == null || (typeof dr === "number" && dr < 0)) {
              return {};
            }
            const ds = grid.getDataSource();
            if (!ds) {
              return {};
            }
            return rgResolveCheckAbleCellStyle(
              ds,
              dr,
              item.strColID,
              props.rowStateeditable
            );
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
            const value = grid.getValue(
              dataCell.index.itemIndex,
              "lngErrorCode"
            );
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
        : props.weekdayHolidayStyleColumns.includes(item.strColID)
        ? function (grid, dataCell) {
            const dr = dataCell?.index?.dataRow;
            if (dr == null || (typeof dr === "number" && dr < 0)) {
              return {};
            }
            const styled = rgResolveWeekdayHolidayCellStyle(
              grid,
              dr,
              props.weekdayHolidayDateField
            );
            return styled ? { style: styled } : {};
          }
        : props.ColCellRedColorColId.includes(item.strColID)
        ? function (grid, dataCell) {
            var ret = {};
            ret.style = { color: "#FF0000" };
            return ret;
          }
        : function (grid, dataCell) {
            var ret = {};

            for (const rule of props.cellFontColorByValue ?? []) {
              const field = rule?.field ?? rule?.fieldName;
              if (!field || item.strColID !== field) {
                continue;
              }
              if (rule.whenField) {
                const whenVal = String(
                  grid.getValue(dataCell.index.itemIndex, rule.whenField) ?? ""
                );
                const whenMatches = (
                  rule.whenValues ??
                  rule.whenMatch ??
                  []
                ).map(String);
                if (whenMatches.includes(whenVal)) {
                  ret.style = {
                    ...(ret.style || {}),
                    color: rule.color || "#FF0000",
                  };
                }
                continue;
              }
              const val = String(
                grid.getValue(dataCell.index.itemIndex, field) ?? ""
              );
              const matches = (rule.values ?? rule.match ?? []).map(String);
              if (matches.includes(val)) {
                ret.style = {
                  ...(ret.style || {}),
                  color: rule.color || "#FF0000",
                };
              }
            }

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
            } else if (
              props.checkRenderEditable == true &&
              isCheckboxGridColumn(item)
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

  if (props.bulkLoadMode === true || props.useMetaEditExpr === true) {
    for (const col of columns) {
      const metaItem = rgGetGridMetaItem(col.fieldName);
      if (props.useMetaEditExpr === true && metaItem) {
        const metaCb = buildMetaEditStyleCallback(
          metaItem,
          props.rowStateeditable
        );
        if (metaCb) {
          col.styleCallback = metaCb;
          continue;
        }
      }
      if (props.bulkLoadMode === true) {
        if (isCheckAbleExpressionColumn(col.fieldName)) {
          col.styleCallback = function (grid, dataCell) {
            const dr = dataCell?.index?.dataRow;
            if (dr == null || (typeof dr === "number" && dr < 0)) {
              return {};
            }
            const ds = grid.getDataSource();
            if (!ds) {
              return {};
            }
            if (isRgCheckRowLocked(ds, dr)) {
              return {
                ...rgCheckStyleDisabled,
                editable: props.rowStateeditable,
              };
            }
            return {
              ...rgCheckStyleEditable,
              editable: props.rowStateeditable,
            };
          };
        } else {
          delete col.styleCallback;
        }
      }
    }
  }

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
        if (props.fixLabelingDropdownOnShow) {
          labelingcolumn.editButtonVisibility = "always";
          labelingcolumn.editor = rgBuildLabelingDropdownEditor(
            values[i],
            labels[i]
          );
        } else if (
          labelingcolumn.editor &&
          typeof labelingcolumn.editor === "object"
        ) {
          const editorType =
            labelingcolumn.editor.type === "list" ? "list" : "dropdown";
          labelingcolumn.editor.type = editorType;
          labelingcolumn.editor.domainOnly = false;
          labelingcolumn.editor.textReadOnly = true;
          labelingcolumn.editor.dropDownWhenClick = true;
          labelingcolumn.editor.commitOnSelect = true;
          labelingcolumn.editor.dropDownCount = values[i]?.length ?? 0;
          delete labelingcolumn.editor.values;
          delete labelingcolumn.editor.labels;
          delete labelingcolumn.editor.listCallback;
        }
      }
      //comsole.log(labelingcolumn);
    }
  }

  if (props.setNumberformatColumn != "") {
    const fmtIds = String(props.setNumberformatColumn)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const qtyFmt = "#,##0.00";
    for (const fmtId of fmtIds) {
      const formatcolumn = columns.find((item) => item.fieldName == fmtId);
      if (formatcolumn) {
        formatcolumn.numberFormat = qtyFmt;
      }
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
  rgReapplyLabelingDropdownEditors(gridView);
  rgBindLabelingDropdownOnShowEditor(gridView);
  if (props.setNumberformatColumn != "") {
    const fmtIds = String(props.setNumberformatColumn)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const qtyFmt = "#,##0.00";
    for (const fmtId of fmtIds) {
      try {
        const gvCol = gridView.columnByField(fmtId);
        if (gvCol) gvCol.numberFormat = qtyFmt;
      } catch {
        void 0;
      }
    }
  }
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

          if (Value == "일소계" || Value2 == "일소계") {
            return "rowDailySubtotal";
          } else if (Value == "소계" || Value2 == "소계" || Value2 == "매장 계") {
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
    const widthScaleMap = props.mergeColumnWidthScale2 || {};
    const scaledMergeWidth = (colId, baseWidth) => {
      const scale = widthScaleMap[colId];
      if (!scale || !baseWidth) {
        return baseWidth;
      }
      return Math.max(1, Math.round(baseWidth * scale));
    };
    const mergeLayoutItem = (colId, tabItem) => {
      const scaled = scaledMergeWidth(colId, tabItem.intHdWidth);
      if (scaled !== tabItem.intHdWidth) {
        return { column: colId, width: scaled };
      }
      return colId;
    };
    let layout = [];
    tabInitSetArray.value.forEach((item) => {
      if (subList.flat().includes(item.strColID)) {
        const index = subList.findIndex((innerArray) =>
          innerArray.includes(item.strColID)
        );

        if (layout.find((item) => item.name == groupList[index])) {
          const findit = layout.find((item) => item.name == groupList[index]);

          if (findit) {
            findit.items.push(mergeLayoutItem(item.strColID, item));
          }
        } else {
          layout.push({
            name: groupList[index],
            direction: "horizontal",
            hideChildHeaders: props.hideChildHeader,
            items: [mergeLayoutItem(item.strColID, item)],
            header: {
              text: groupList[index],
              styleName:
                `header-style-` +
                (props.headerColors[index] == undefined ||
                props.headerColors[index] == ""
                  ? "0"
                  : props.headerColors[index]),
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
          width: scaledMergeWidth(item.strColID, item.intHdWidth),
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
    console.log(tabInitSetArray.value);
    tabInitSetArray.value.forEach((item) => {
      // 1) subList3 전체 1차 그룹 인덱스 찾기
      const groupIndex = subList3.findIndex((group2D) =>
        group2D.some((group1D) => group1D.includes(item.strColID))
      );
      console.log(groupIndex);
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
            // } else if (
            //   groupList3[groupIndex] != undefined &&
            //   groupList2[groupIndex][innerIndex] != undefined
            // ) {
            //   console.log(groupList3[groupIndex]);
            //   const findit = layout.find(
            //     (item) => item.name == groupList3[groupIndex]
            //   );
            //   console.log(findit);
            //   if (findit == undefined) {
            //     layout.push({
            //       name: groupList3[groupIndex],
            //       direction: "horizontal",
            //       header: {
            //         styleName: `header-style-0`,
            //       },
            //       items: [
            //         {
            //           name: groupList2[groupIndex][innerIndex],
            //           direction: "horizontal",
            //           header: { styleName: "header-style-0" },
            //           items: [{ column: item.strColID, width: item.intHdWidth }],
            //         },
            //       ],
            //     });

            //     console.log(layout);
            //   } else {
            //     const findit2 = findit.items.find(
            //       (item) => item.name == groupList2[groupIndex][innerIndex]
            //     );
            //     findit2.items.push({
            //       column: item.strColID,
            //       width: item.intHdWidth,
            //     });
            //   }
          }
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

            if (findit2 == undefined) {
              findit.items.push({
                name: groupList2[groupIndex][innerIndex],
                direction: "horizontal",
                header: { styleName: "header-style-0" },
                items: [{ column: item.strColID, width: item.intHdWidth }],
              });
            } else {
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

    console.log(layout);
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

  /** 체크박스 편집 필드명 복구(getOrgFieldName 실패 대비) — onCellEdited에서 사용 */
  const resolveEditedFieldName = (field) => {
    let name = null;
    try {
      name = dataProvider.getOrgFieldName?.(field) ?? null;
    } catch (_) {
      name = null;
    }
    if (name != null && String(name).trim() !== "") return String(name).trim();
    if (typeof field === "number") {
      try {
        const col = gridView.getColumn?.(field);
        if (col?.name) return String(col.name).trim();
      } catch (_) {}
      try {
        const names = dataProvider.getOrgFieldNames?.();
        if (Array.isArray(names) && field >= 0 && field < names.length) {
          return String(names[field]).trim();
        }
      } catch (_) {}
    }
    if (typeof field === "string") return String(field).trim();
    return "";
  };

  emit("allStateRows", dataProvider.getAllStateRows());
  // 데이터 추가
  // 5구간
  applyRowsToProvider(props.rowData, { skipFooterDefer: false });

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
  const suppressLocked = props.suppressEdit === true;
  gridView.editOptions.editable = suppressLocked
    ? false
    : props.checkRenderEditable == true
      ? true
      : false;
  gridView.editOptions.readOnly = suppressLocked;
  gridView.editOptions.checkable = !suppressLocked;
  gridView.editOptions.updatable = true;

  gridView.editOptions.deletable = true;
  gridView.displayOptions.fitStyle =
    props.fixedColumn === true || props.bulkLoadMode === true
      ? "none"
      : "even";
  gridView.editOptions.commitByCell = true;

  gridView.editOptions.commitWhenLeave = true;
  gridView.displayOptions.showInnerFocus = false;
  gridView.displayOptions.useAlternateRowStyle =
    props.bulkLoadMode === true
      ? false
      : props.useAlternateRowStyle
        ? true
        : false;
  dataProvider.softDeleting = props.notsoftDelete == false ? true : false;
  dataProvider.deleteCreated = props.deleteCreated;
  gridView.filteringOptions.handleVisibility = "hidden";
  // gridView.sortingOptions.enabled = false; // 정렬기능 비활성화
  //dataProvider.autoCommit = true; // 자동 커밋 활성화
  dataProvider.commitBeforeDataEdit = true;
  gridView.editOptions.movable = props.dragOn == true ? true : false;
  gridView.displayOptions.selectAndImmediateDrag =
    props.dragOn == true ? true : false;
  gridView.displayOptions.selectionStyle =
    props.dragOn == true ? "block" : props.selectionStyle;
  // props.selectionStyle;deleteRow
  gridView.displayOptions.showTooltip = props.bulkLoadMode !== true;
  if (props.bulkLoadMode === true) {
    gridView.displayOptions.refreshMode = "visibleOnly";
  }
  gridView.displayOptions.rowHeight =
    rgEffectiveRowHeight() > 0
      ? rgEffectiveRowHeight()
      : props.dynamicRowHeight == true && props.setTreeView == false
      ? -1
      : props.dynamicRowHeight2 == true && props.setTreeView == true
      ? -1
      : 1;
  const hdrH = rgEffectiveHeaderHeight();
  if (hdrH > 0) {
    gridView.header.height = hdrH;
  }
  rgApplyGridTypographyStyles(gridView);
  gridView.displayOptions.useFocusClass = false;
  gridView.displayOptions.wheelScrollLines = 1;
  if (props.setTreeView == false) {
    gridView.groupPanel.visible = false;
  } else {
    gridView.treeOptions.iconImagesRoot = "/icon/";
    gridView.treeOptions.iconImages = ["favicon.png", "favicon.png"];
    gridView.treeOptions.defaultIcon = 1;
  }

  gridView.displayOptions.watchDisplayChange = false;
  gridView.filterMode = "explicit";
  gridView.checkBar.fieldName = props.checkBarFieldName || "checkbox";
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

  rgApplyForceColumnLayout(gridView);

  watch(
    () => props.hideColumnsId,
    () => {
      if (gridView != null) {
        if (
          Array.isArray(props.forceColumnLayout) &&
          props.forceColumnLayout.length > 0
        ) {
          rgApplyForceColumnLayout(gridView);
          return;
        }
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

  if (props.setFooter == true && props.bulkLoadMode !== true) {
    gridView.setOptions({ summaryMode: "aggregate" });
  }

  if (props.setStateBar == false) {
    gridView.setStateBar({
      visible: false,
    });
  }
  gridView.headerSummaries.visible = false; // 그룹핑 할때 상단 요약값 없애는 설정

  if (props.bulkLoadMode !== true) {
    for (let i = dataProvider.getRowCount() - 1; i >= 0; i--) {
      const rowData = dataProvider.getJsonRow(i);
      if (rowData != null && rowData.deleted && props.setTreeView == false) {
        dataProvider.removeRow(i);
      }
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
    if (props.bulkLoadMode === true) {
      try {
        grid.resetSize();
      } catch (_) {}
      return;
    }
    if (
      Array.isArray(props.forceColumnLayout) &&
      props.forceColumnLayout.length > 0
    ) {
      rgApplyForceColumnLayout(grid);
      rgReapplyLabelingDropdownEditors(grid);
      rgBindLabelingDropdownOnShowEditor(grid);
      try {
        grid.resetSize();
      } catch (_) {}
      return;
    }
    if (props.preserveColumnLayoutOnRefresh) {
      try {
        grid.resetSize();
      } catch (_) {}
      rgReapplyLabelingDropdownEditors(grid);
      rgBindLabelingDropdownOnShowEditor(grid);
      return;
    }
    grid.refresh(true);
    rgReapplyLabelingDropdownEditors(grid);
    rgBindLabelingDropdownOnShowEditor(grid);
    grid.resetSize();
  };

  gridView.onCellEdited = function (grid, itemIndex, row, field) {
    const editedFieldName = resolveEditedFieldName(field);
    let oldVal;
    if (editedFieldName) {
      try {
        oldVal = dataProvider.getValue(row, editedFieldName);
      } catch (_) {
        oldVal = undefined;
      }
    }

    gridView.commit();

    let newVal;
    if (editedFieldName) {
      try {
        newVal = dataProvider.getValue(row, editedFieldName);
      } catch (_) {
        newVal = undefined;
      }
    }

    if (
      editedFieldName &&
      isDecimalInputColumn(editedFieldName) &&
      newVal !== null &&
      newVal !== undefined &&
      newVal !== ""
    ) {
      let rounded = roundSignedDecimal(newVal);
      if (
        isUnsignedDecimalColumn(editedFieldName) &&
        !Number.isNaN(Number(newVal)) &&
        Number(newVal) < 0
      ) {
        rounded = 0;
      }
      if (!Number.isNaN(Number(newVal))) {
        dataProvider.setValue(row, editedFieldName, rounded);
        newVal = rounded;
      }
    }

    const colEdited = editedFieldName
      ? gridView.columnByField(editedFieldName)
      : null;
    const isCheckCell = colEdited?.renderer?.type === "check";
    if (
      isCheckCell &&
      editedFieldName &&
      (isRgCheckRowLocked(dataProvider, row) ||
        rgIsMetaEditCheckLocked(dataProvider, row, editedFieldName))
    ) {
      try {
        dataProvider.setValue(row, editedFieldName, oldVal);
      } catch (_) {}
      return;
    }
    const checkTruthy = (v) =>
      v === true ||
      v === 1 ||
      v === "1" ||
      String(v).toLowerCase() === "true";
    if (
      isCheckCell &&
      editedFieldName &&
      oldVal !== undefined &&
      newVal !== undefined &&
      oldVal === newVal
    ) {
      newVal = checkTruthy(oldVal) ? false : true;
    }

    if (props.checkRowAuto2 == true && isCheckCell) {
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
    //console.log(field);
    if (props.cellEditthenCheck == true && field == 4) {
      dataProvider.setValue(row, "lngCheck", true);
    }
    if (props.checkOnlyFalse == true) {
      dataProvider.setValue(row, "Selected", false);
    }

    if (props.bulkLoadMode === true) {
      if (isCheckCell) {
        selectedRowData.value = rgCollectCheckedRowData();
        emit("checkedRowData", selectedRowData.value);
      }
    } else {
      updatedrowData.value = [...dataProvider.getJsonRows()];
      emit("updatedRowData", updatedrowData.value);
    }
    emit("allStateRows", dataProvider.getAllStateRows());

    const orgFieldName = editedFieldName;
    if (
      props.checkedRowData2Col &&
      String(props.checkedRowData2Col).trim() !== "" &&
      orgFieldName &&
      matchesCheckedRowData2Col(orgFieldName)
    ) {
      let checkedPayload;
      if (props.emitCheckedRowData2AsJson) {
        const base = dataProvider.getJsonRow(row) || {};
        const v =
          orgFieldName != null && orgFieldName !== ""
            ? dataProvider.getValue(row, orgFieldName)
            : undefined;
        let strC;
        try {
          strC = dataProvider.getValue(row, "strConfirm");
        } catch (_) {
          strC = undefined;
        }
        if (strC === undefined) {
          try {
            strC = dataProvider.getValue(row, "StrConfirm");
          } catch (_) {
            strC = undefined;
          }
        }
        checkedPayload = {
          ...base,
          ...(v !== undefined ? { [orgFieldName]: v } : {}),
          ...(strC !== undefined && strC !== null ? { strConfirm: strC } : {}),
        };
      } else {
        checkedPayload = dataProvider.getRows()[row];
      }
      emit("checkedRowData2", checkedPayload, orgFieldName, row, oldVal, newVal);
    }
  };

  gridView.onItemChecked = function (grid, itemIndex, checked) {
    if (props.bulkLoadMode === true && props.checkRowAuto2 === true) {
      return;
    }
    gridView.setCurrent({ dataRow: grid.getDataRow(itemIndex) });

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
    rgEmitUpdatedRowData();
    emit("allStateRows", dataProvider.getAllStateRows());
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

    rgEmitUpdatedRowData();
    emit("allStateRows", dataProvider.getAllStateRows());
  };

  dataProvider.onDataChanged = function (provider) {
    gridView.commit();
    if (props.bulkLoadMode !== true) {
      updatedrowData.value = [...dataProvider.getJsonRows()];
    }

    // emit("updatedRowData", updatedrowData.value);
    const a = updatedrowData.value.filter((item) => item.checkbox == true);
    // selectedRowData.value = []

    //emit("allStateRows", dataProvider.getAllStateRows());
    //emit("checkedRowData", a);
  };

  gridView.onCellItemClicked = function (grid, clickData) {
    // itemIndex == -1 이어도 dataRow 가 유효하면 계속 진행 (행 높이 불일치 시 발생)
    const ciItemIndex = clickData.itemIndex;
    const ciDataRow = clickData.dataRow;
    if ((ciItemIndex == undefined || ciItemIndex == -1) && (ciDataRow == undefined || ciDataRow < 0)) {
      return;
    }
    // 그룹 소계/푸터/헤더 등 "데이터 행"이 아닌 영역 클릭 시 버튼컬럼 이벤트 emit 금지
    if (ciDataRow == undefined || ciDataRow < 0) {
      return;
    }

    var current = grid.getCurrent();
    // current.dataRow 가 유효하지 않으면 clickData.dataRow 사용
    const effectiveDataRow =
      current.dataRow != null && current.dataRow >= 0 ? current.dataRow : ciDataRow;
    selectedindex.value = effectiveDataRow;
    const dpClick = rgLocalDp();
    if (!dpClick) {
      return;
    }
    if (props.setTreeView == false) {
      selectedRowData.value = dpClick.getRows()[effectiveDataRow];
    } else {
      selectedRowData.value = dpClick.getJsonRow(effectiveDataRow);
    }
    emit("buttonClicked", selectedRowData.value);
    emit("clickedButtonCol", clickData.fieldName);
    emit("selcetedrowData", selectedRowData.value);
    emit("selectedIndex", ciDataRow);
    emit("selectedIndex2", ciDataRow);
    emit("allStateRows", dpClick.getAllStateRows());
  };

  gridView.onSelectionChanged = function (grid) {
    var current = grid.getCurrent();
    const dr = current?.dataRow;
    if (dr == null || dr < 0) {
      return;
    }

    const dpSel = rgLocalDp();
    if (!dpSel) {
      return;
    }

    if (props.setTreeView == false) {
      selectedRowData.value = dpSel.getRows()[dr];
    } else {
      selectedRowData.value = dpSel.getJsonRow(dr);
    }
    if (selectedRowData.value) {
      selectedRowData.value.index = dr;
    }

    emit("selectedIndex", dr);
    emit("selectedIndex2", dr);
  };

  const rgBuildClickedRowPayload = (dataRow) => {
    const dp = rgLocalDp();
    if (!dp || dataRow == null || dataRow < 0) return null;
    let fromJson = null;
    try {
      fromJson = dp.getJsonRow(dataRow);
    } catch (_) {
      fromJson = null;
    }
    if (props.setTreeView == false) {
      const fromProvider = dp.getRows()[dataRow];
      const fromParent =
        Array.isArray(props.rowData) &&
        dataRow >= 0 &&
        dataRow < props.rowData.length
          ? props.rowData[dataRow]
          : null;
      if (fromParent && typeof fromParent === "object") {
        const merged = { ...(fromProvider || fromJson || {}) };
        for (const k of Object.keys(fromParent)) {
          const pv = fromParent[k];
          const mv = merged[k];
          if (
            (mv === undefined || mv === null || mv === "") &&
            pv !== undefined &&
            pv !== null &&
            pv !== ""
          ) {
            merged[k] = pv;
          }
        }
        const payload =
          Object.keys(merged).length > 0 ? merged : { ...fromParent };
        payload.index = dataRow;
        payload.dataRow = dataRow;
        return payload;
      }
      const base = fromProvider ?? fromJson;
      if (base && typeof base === "object") {
        const payload = Array.isArray(base) ? [...base] : { ...base };
        payload.index = dataRow;
        payload.dataRow = dataRow;
        return payload;
      }
      return base;
    }
    const jsonRow = fromJson ?? dp.getJsonRow(dataRow);
    if (jsonRow && typeof jsonRow === "object") {
      return { ...jsonRow, index: dataRow, dataRow };
    }
    return jsonRow;
  };

  /** clickedRowData emit — HEAD 배열 [0],[1] 우선 */
  const rgEmitClickedRowData = (dataRow) => {
    const dp = rgLocalDp();
    if (!dp || dataRow == null || dataRow < 0) {
      return;
    }
    selectedindex.value = dataRow;
    const rowArray = dp.getRows()?.[dataRow];
    const clickPayload = rgBuildClickedRowPayload(dataRow);
    const parentRow =
      Array.isArray(props.rowData) &&
      dataRow >= 0 &&
      dataRow < props.rowData.length
        ? props.rowData[dataRow]
        : null;
    /**
     * clickedRowData 호환성:
     * - 레거시 화면(MST01/PUR03 등)은 e[0], e[1] 형태(배열)를 사용
     * - 배열이 있으면 배열을 우선 emit 하고, 없으면 객체 payload를 emit
     */
    let clickEmit = null;
    if (Array.isArray(rowArray)) {
      clickEmit = rowArray;
    } else if (Array.isArray(parentRow)) {
      clickEmit = parentRow;
    } else {
      clickEmit = clickPayload ?? rowArray ?? parentRow ?? null;
    }
    if (clickEmit != null) {
      emit("clickedRowData", clickEmit);
      emit("selectedIndex", dataRow);
      emit("selectedIndex2", dataRow);
    }
  };

  const rgEmitCellClickedRow = (dataRow, fieldName) => {
    if (!props.emitCellClickedRow || dataRow == null || dataRow < 0) {
      return;
    }
    let row = null;
    if (
      Array.isArray(props.rowData) &&
      dataRow >= 0 &&
      dataRow < props.rowData.length
    ) {
      row = props.rowData[dataRow];
    }
    if (row == null) {
      row = rgBuildClickedRowPayload(dataRow);
    }
    const gv = rgLocalGv();
    if (gv) {
      try {
        const itemIndex = gv.getItemIndex(dataRow);
        if (itemIndex >= 0) {
          const cd = gv.getValue(itemIndex, "lngCornerCD");
          const nm = gv.getValue(itemIndex, "strCornerNM");
          if (cd != null && cd !== "") {
            if (row && typeof row === "object" && !Array.isArray(row)) {
              row = {
                ...row,
                lngCornerCD: row.lngCornerCD ?? row.lngCornerCd ?? cd,
                strCornerNM: row.strCornerNM ?? row.strCornerNm ?? nm,
              };
            } else {
              row = { lngCornerCD: cd, strCornerNM: nm ?? "" };
            }
          }
        }
      } catch (_) {
        void 0;
      }
    }
    const rowArray =
      rgLocalDp() && dataRow >= 0
        ? rgLocalDp().getRows()?.[dataRow]
        : null;
    if (row != null || rowArray != null) {
      emit("cellClicked", {
        dataRow,
        fieldName: fieldName ?? "",
        row: row ?? rowArray,
        rowArray,
      });
    }
  };

  if (
    props.emitSelectedOnCurrentChange === true ||
    props.emitCellClickedRow === true ||
    props.emitClickedRowOnRowChange === true
  ) {
    gridView.onCurrentChanged = function (grid, newIndex) {
      if (newIndex?.cellType === "header") {
        return;
      }
      const dr = newIndex?.dataRow;
      if (dr == null || dr < 0) {
        return;
      }

      if (props.emitClickedRowOnRowChange === true) {
        rgEmitClickedRowData(dr);
      }

      if (props.emitCellClickedRow === true) {
        rgEmitCellClickedRow(dr, newIndex?.fieldName);
      }

      if (props.emitSelectedOnCurrentChange !== true) {
        return;
      }

      selectedindex.value = dr;
      emit("selectedIndex", dr);
      emit("selectedIndex2", dr);

      let rowPayload = null;
      try {
        rowPayload = dataProvider.getJsonRow(dr);
      } catch (_) {
        rowPayload = null;
      }
      const fromParent =
        Array.isArray(props.rowData) &&
        dr >= 0 &&
        dr < props.rowData.length
          ? props.rowData[dr]
          : null;
      if (fromParent && typeof fromParent === "object") {
        const merged = { ...(rowPayload || {}) };
        for (const k of Object.keys(fromParent)) {
          if (
            merged[k] == null ||
            merged[k] === "" ||
            merged[k] === undefined
          ) {
            merged[k] = fromParent[k];
          }
        }
        rowPayload = Object.keys(merged).length > 0 ? merged : { ...fromParent };
      }
      if (rowPayload != null && typeof rowPayload === "object") {
        rowPayload.index = dr;
        rowPayload.dataRow = dr;
      }
    };
  }

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
      grid.setCurrent({ dataRow: selectedindex.value });
      return;
    }

    // 클릭한 셀에 current 고정 → dataRow 확보 (높이 변경·편집 셀 포함)
    if (clickData.itemIndex != null && clickData.itemIndex >= 0) {
      try {
        grid.setCurrent({
          itemIndex: clickData.itemIndex,
          fieldName: clickData.fieldName,
        });
      } catch (_) {
        void 0;
      }
    }

    if (props.emitCellClickedRow) {
      const curForCell = grid.getCurrent();
      const drCell = rgResolveClickedDataRow(grid, clickData, curForCell);
      if (drCell >= 0) {
        rgEmitCellClickedRow(drCell, clickData.fieldName);
      }
    }

    var current = grid.getCurrent();
    const clickedDataRow = rgResolveClickedDataRow(grid, clickData, current);

    if (clickedDataRow >= 0) {
      rgEmitClickedRowData(clickedDataRow);
    }

    // rowHeight·폰트 CSS 불일치 시 itemIndex=-1 이어도 dataRow(getDataRow)로 처리
    if (clickData.itemIndex == undefined || clickData.itemIndex == -1) {
      if (clickedDataRow < 0) {
        return;
      }
    }

    // 그룹 소계/푸터/총계 등 dataRow가 없는 영역에서는 버튼컬럼 클릭 이벤트를 emit하지 않음
    const isDataRow = clickedDataRow >= 0;

    // onCellItemClicked 가 itemIndex=-1 로 안 터질 때 fallback — button renderer 컬럼 클릭 시 buttonClicked emit
    if (isDataRow && clickData.fieldName) {
      try {
        const colDef = grid.columnByName?.(clickData.fieldName);
        if (colDef?.renderer?.type === "button") {
          const dpBtn = rgLocalDp();
          if (dpBtn) {
            const btnRow =
              props.setTreeView == false
                ? dpBtn.getRows()?.[clickedDataRow]
                : dpBtn.getJsonRow(clickedDataRow);
            if (btnRow != null) {
              emit("buttonClicked", btnRow);
              emit("clickedButtonCol", clickData.fieldName);
            }
          }
        }
      } catch (_) {
        void 0;
      }
    }

    ////console.log(current);
    if (current.itemIndex !== -1 || clickedDataRow >= 0) {
      if (isDataRow && clickData.fieldName) {
        emit("clickedButtonCol", clickData.fieldName);
      }
      if (clickedDataRow != null && clickedDataRow >= 0) {
        emit("selectedIndex", clickedDataRow);
        emit("selectedIndex2", clickedDataRow);
      }

      const dpCell = rgLocalDp();
      if (props.setTreeView == false) {
        selectedRowData.value = dpCell?.getRows()?.[clickedDataRow];
      } else {
        selectedRowData.value = dpCell?.getJsonRow(clickedDataRow);
      }
      //dataProvider.checkRowStates(false);
      if (props.excludeCheck == true) {
        grid.checkAll(false);
      }

      //if(props.cellclickcheck)
      if (props.checkRowAuto == true) {
        if (grid.isCheckedRow(clickData.itemIndex)) {
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

      if (props.setTreeView == false) {
        selectedRowData.value = dpCell?.getRows()?.[clickedDataRow];
      } else {
        selectedRowData.value = dpCell?.getJsonRow(clickedDataRow);
      }
      const rowState =
        clickedDataRow >= 0 && dpCell
          ? dpCell.getRowState(clickedDataRow)
          : null;
      if (selectedRowData.value) {
        selectedRowData.value.index = clickedDataRow;
        selectedRowData.value.rowState = rowState;
      }
      selectedindex.value = clickedDataRow;

      emit("sendRowState", rowState);
    }
    const dpAll = rgLocalDp();
    if (dpAll) {
      emit("allStateRows", dpAll.getAllStateRows());
    }
  };

  gridView.onColumnCheckedChanged = function (grid, col, chk) {
    //console.log("헤더 전체체크");
    var rowCount = dataProvider.getRowCount(); // 전체 행의 개수
    const colFieldName = col?.fieldName ?? "";
    const checkCol = String(props.checkRowAuto2Col ?? "").trim();
    const syncCheckRow =
      props.checkRowAuto2 === true && colFieldName === checkCol;
    const bulkCellCheckOnly = syncCheckRow;
    const scrollState = rgSaveGridViewScrollState();

    dataProvider.beginUpdate();
    try {
      if (props.ExceptionCheck != "") {
        for (var i = 0; i < rowCount; i++) {
          if (grid.getValue(i, props.ExceptionCheck) !== "0") {
            dataProvider.setValue(i, colFieldName, chk);
            if (syncCheckRow) {
              rgSyncHeaderCheckRow(i, chk, bulkCellCheckOnly);
            }
          }
        }
      } else if (props.checkAbleExpressionCol == "") {
        for (var i = 0; i < rowCount; i++) {
          dataProvider.setValue(i, colFieldName, chk);
        }
        if (!bulkCellCheckOnly) {
          gridView.setAllCheck(chk);
        }
      } else {
        for (var i = 0; i < rowCount; i++) {
          if (!rgIsCheckColumnHeaderSelectable(dataProvider, i, colFieldName)) {
            continue;
          }
          dataProvider.setValue(i, colFieldName, chk);
          if (syncCheckRow) {
            rgSyncHeaderCheckRow(i, chk, bulkCellCheckOnly);
          }
        }
      }
    } finally {
      dataProvider.endUpdate();
    }

    rgRestoreGridViewScrollState(scrollState);

    selectedRowData.value = rgCollectCheckedRowData();
    let checkedRowIndexes;
    if (syncCheckRow) {
      checkedRowIndexes = [];
      for (let ri = 0; ri < rowCount; ri++) {
        const v = rgSafeDataSourceGetValue(dataProvider, ri, checkCol);
        if (rgIsCheckValueTruthy(v)) {
          checkedRowIndexes.push(ri);
        }
      }
    } else {
      checkedRowIndexes = gridView.getCheckedRows();
    }

    emit("checkedRowData", selectedRowData.value);
    emit("checkedRowIndex", checkedRowIndexes);
    rgEmitUpdatedRowData();
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
    if (clickData.itemIndex == undefined || clickData.itemIndex < 0) {
      return;
    }
    /** 푸터/소계/헤더·CheckBar·No. 영역 또는 동기화 직후 무효 행 */
    if (clickData.dataRow == undefined || clickData.dataRow < 0) {
      return;
    }
    if (
      clickData.cellType === "check" ||
      clickData.cellType === "indicator" ||
      clickData.cellType === "header"
    ) {
      return;
    }

    const current = clickData.dataRow;
    let fromJson = null;
    try {
      fromJson = dataProvider.getJsonRow(current);
    } catch {
      fromJson = null;
    }

    // 단일 클릭(onCellClicked)과 동일: 일반 그리드는 getRows() 배열, 트리만 getJsonRow
    if (props.setTreeView == false) {
      let fromProvider = dataProvider.getRows()[current];
      const fromParent =
        Array.isArray(props.rowData) &&
        current >= 0 &&
        current < props.rowData.length
          ? props.rowData[current]
          : null;
      /** 병합 컬럼 등으로 provider 행에 PK·코드가 빠진 경우 부모 rowData로 보완 */
      if (fromParent && typeof fromParent === "object") {
        const merged = { ...(fromProvider || fromJson || {}) };
        for (const k of Object.keys(fromParent)) {
          const pv = fromParent[k];
          const mv = merged[k];
          if (
            (mv === undefined || mv === null || mv === "") &&
            pv !== undefined &&
            pv !== null &&
            pv !== ""
          ) {
            merged[k] = pv;
          }
        }
        selectedRowData.value =
          Object.keys(merged).length > 0 ? merged : fromParent;
      } else {
        selectedRowData.value = fromProvider ?? fromJson;
      }
    } else {
      selectedRowData.value = fromJson ?? dataProvider.getJsonRow(current);
    }

    const payload =
      selectedRowData.value && typeof selectedRowData.value === "object"
        ? { ...selectedRowData.value }
        : {};
    payload.index = clickData.itemIndex;
    payload.dataRow = current;
    emit("dblclickedRowData", payload);
  };

  if (props.enterKeyEmitsDblClicked === true) {
    gridView.onKeyDown = function (grid, event) {
      if (event.key !== "Enter" && event.keyCode !== 13) {
        return true;
      }
      if (!gridView || !dataProvider) {
        return true;
      }
      const cur = gridView.getCurrent();
      if (
        !cur ||
        cur.dataRow === undefined ||
        cur.dataRow === null ||
        cur.dataRow < 0
      ) {
        return true;
      }
      const dr = cur.dataRow;
      let row;
      if (props.setTreeView == false) {
        let fromProvider = dataProvider.getRows()[dr];
        const fromParent =
          Array.isArray(props.rowData) &&
          dr >= 0 &&
          dr < props.rowData.length
            ? props.rowData[dr]
            : null;
        if (fromParent && typeof fromParent === "object") {
          const merged = { ...(fromProvider || {}) };
          for (const k of Object.keys(fromParent)) {
            const pv = fromParent[k];
            const mv = merged[k];
            if (
              (mv === undefined || mv === null || mv === "") &&
              pv !== undefined &&
              pv !== null &&
              pv !== ""
            ) {
              merged[k] = pv;
            }
          }
          row =
            Object.keys(merged).length > 0 ? merged : fromParent;
        } else {
          row = fromProvider;
        }
      } else {
        row = dataProvider.getJsonRow(dr);
      }
      if (row) {
        row.index = cur.itemIndex;
        row.dataRow = dr;
        emit("dblclickedRowData", row);
      }
      if (event.preventDefault) {
        event.preventDefault();
      }
      return false;
    };
  }

  if (
    props.keyDeleteRemovesCurrentRow === true &&
    props.enterKeyEmitsDblClicked !== true
  ) {
    gridView.onKeyDown = function (grid, event) {
      if (event.key !== "Delete" && event.keyCode !== 46) {
        return true;
      }
      if (!gridView || !dataProvider) {
        return true;
      }
      const cur = gridView.getCurrent();
      if (!cur) {
        return true;
      }
      let dr = cur.dataRow;
      if (
        dr === undefined ||
        dr === null ||
        dr < 0 ||
        (typeof dr === "number" && Number.isNaN(dr))
      ) {
        if (cur.itemIndex != null && cur.itemIndex >= 0) {
          try {
            dr = gridView.getDataRow(cur.itemIndex);
          } catch (_) {
            dr = -1;
          }
        } else {
          dr = -1;
        }
      }
      if (dr < 0) {
        return true;
      }
      try {
        gridView.commit(true);
      } catch (_) {}
      try {
        dataProvider.removeRow(dr);
      } catch (_) {
        return true;
      }
      updatedrowData.value = [...dataProvider.getJsonRows()];
      emit("updatedRowData", updatedrowData.value);
      if (event.preventDefault) {
        event.preventDefault();
      }
      return false;
    };
  }

  // 그리드 초기화 완료 플래그 설정
  isGridInitialized.value = true;
  if (
    props.syncGridHeight === true ||
    props.gridRowHeight > 0 ||
    props.gridHeaderHeight > 0 ||
    props.gridFontSize > 0
  ) {
    rgSyncGridLayout();
  }
  emit("gridReady", realgridname.value);
};

/**
 * onMounted·rowData watch 등에서 funcshowGrid 가 동시에 호출되면
 * 동일 ContainerDiv 에 GridView 가 중복 생성되어 런타임 오류가 난다.
 * 호출을 직렬화해 한 번에 하나의 초기화만 수행한다.
 */
let _funcshowGridSerialById = new Map();
const funcshowGrid = () => {
  const key = realgridname.value;
  if (!key) {
    return Promise.resolve();
  }
  const prev = _funcshowGridSerialById.get(key) ?? Promise.resolve();
  const next = prev
    .then(() => runFuncshowGrid())
    .catch((err) => {
      console.warn("[Realgrid] funcshowGrid", key, err?.message ?? err, err);
    });
  _funcshowGridSerialById.set(key, next);
  return next;
};

/** setRows 후 처리 — selfId 고정 (다중 그리드에서 전역 gridView 참조 오류 방지) */
const rgRunPostSetRowsFinalize = (selfId) => {
  if (!selfId) {
    return;
  }
  setTimeout(function () {
    const inst = rgGetInstance(selfId);
    const gv = inst?.gridView;
    const dp = inst?.dataProvider;

    if (selectedindex.value == -1) {
      if (dp) {
        dp.clearRowStates();
        if (
          gv &&
          Array.isArray(props.forceColumnLayout) &&
          props.forceColumnLayout.length > 0
        ) {
          rgApplyForceColumnLayout(gv);
        }
        emit("selectedIndex", selectedindex.value);
        emit("gridReady", selfId);
        return;
      }
    }

    if (selectedindex.value !== "" && selectedindex.value != undefined) {
      gv?.setCurrent?.({ dataRow: selectedindex.value });
    }

    addrow4activated.value = false;

    if (gv != null && props.skipClearCurrentAfterSetRows !== true) {
      if (deleted2activated.value == true) {
        gv.clearCurrent();
        deleted2activated.value = false;
      } else {
        gv.clearCurrent();
      }
    }
    emit("gridReady", selfId);
    if (
      gv &&
      Array.isArray(props.forceColumnLayout) &&
      props.forceColumnLayout.length > 0
    ) {
      rgApplyForceColumnLayout(gv);
    }
  }, 80);
};

const refreshSuppressEditState = () => {
  if (!gridView || !isGridInitialized.value) return;
  const locked = props.suppressEdit === true;
  gridView.editOptions.editable = locked
    ? false
    : props.checkRenderEditable == true;
  gridView.editOptions.readOnly = locked;
  gridView.editOptions.checkable = !locked;
  gridView.refresh(true);
};

// 7구간
watch(
  () => [props.suppressEdit, props.checkRenderEditable],
  () => refreshSuppressEditState()
);

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

watch(
  () => [props.searchWord3, props.searchValue, props.searchSpecialCond],
  () => {
    let criteria2 = props.searchColId.split(",");

    let searchword3 = props.searchWord3;

    let criteria3 = `(value ilike '%${searchword3}%')`;

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
        " or (values['" + criteria2[i] + `'] ilike '%${searchword3}%')`;
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
      const menuSearchCol = criteria2[0]?.trim?.() ?? "";
      if (props.searchWord3 == "" && props.searchColId3 == []) {
        if (menuSearchCol) {
          gridView.setColumnFilters(menuSearchCol, []);
        }
      } else {
        if (menuSearchCol) {
          if (props.searchWord3 !== "") {
            gridView.setColumnFilters(menuSearchCol, filter);
          } else {
            gridView.setColumnFilters(menuSearchCol, []);
          }
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
        if (props.setTreeView == false) {
          selectedRowData.value = dataProvider.getRows()[current.dataRow];
        } else {
          selectedRowData.value = dataProvider.getJsonRow(current.dataRow);
        }
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
    // props.rowData.push(values);
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
    console.log(checkedArr);
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

    // //gridView.commit();
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
  () => props.syncRowDataPulse,
  () => {
    if (
      gridView == null ||
      dataProvider == null ||
      dataProvider.getRowCount() <= 0
    ) {
      return;
    }
    gridView.commit();
    updatedrowData.value = [...dataProvider.getJsonRows()];
    emit("updatedRowData", updatedrowData.value);
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

    for (let col of props.exportExcelShowColumns) {
      gridView.columnByName(col).width = 100;
    }

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
      showColumns: props.exportExcelShowColumns,
      hiddenColumns: props.exportExcelHiddenColumns,
      allColumns: props.exportExcelHiddenColumns.length != 0 ? true : false,
      done: () => {
        // 다시 원복
        for (let col of props.exportExcelShowColumns) {
          gridView.columnByName(col).width = 0;
        }
      },
    });
  }
);

watch(
  () => props.exporttoExcel2,
  (newVal) => {
    // const documentTitle = excelTitle(
    //   store.state.minorCategory.find((item) =>
    //     item.strUrl.includes(props.documentTitle)
    //   )
    // );
    //const excelNm = documentTitle.split("-")[2];
    // const user = store.state.userData.strChargerName;
    // const userID = store.state.userData.loginID;
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
        message: props.documentTitle,
        visible: true,
        spaceTop: 1,
        spaceBottom: 0,
        height: 30,
        styleName: "documentStyle",
      },
      documentSubtitle: {
        //부제
        message:
          props.documentSubTitle + "\n" + "조회시간 : " + today + "\n" + ")",
        visible: true,
        height: 80,
        styleName: "documentSubtitleStyle",
      },
      fileName: props.documentTitle + ".xlsx",
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
    if (
      props.moveFocusbyIndex == null ||
      props.moveFocusbyIndex === "" ||
      props.moveFocusbyIndex == -1 ||
      props.moveFocusbyIndex === "-1"
    ) {
      return;
    }
    if (!gridView || !dataProvider) {
      return;
    }
    const idx = Number(props.moveFocusbyIndex);
    if (Number.isNaN(idx) || idx < 0) {
      return;
    }
    gridView.setCurrent({ dataRow: idx });

    selectedRowData.value = dataProvider.getRows()[idx];
    if (selectedRowData.value) {
      emit("selectedIndex", idx);
      try {
        gridView.setFocus();
      } catch (_) {}
      // emit('clickedRowData', selectedRowData.value);
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
          return Number(timecode) > start - 0.5 && Number(timecode) < end;
        });

        if (isin) {
          return { styleName: "blue-column" };
        }
      };
    }
  }
);

onMounted(async () => {
  await nextTick();
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

    if (Array.isArray(props.extraColumns) && props.extraColumns.length > 0) {
      tabInitSetArray.value.push(
        ...withInheritedHeaderStyle(result, props.extraColumns)
      );
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

    if (props.setDynamicGrid7 == true) {
      const res = await getDynamicGrid7(store.state.userData.lngStoreGroup);

      if (res.data.List.length > 0) {
        tabInitSetArray.value.push(...res.data.List);
      }
      console.log(res);
    }

    if (props.setDynamicGrid8 == true) {
      const res = await getDynamicGrid8(store.state.userData.lngStoreGroup);

      if (res.data.List.length > 0) {
        tabInitSetArray.value.push(...res.data.List);
      }
      console.log(res);
    }

    // 동적 스타일 생성
    let styleContent = "";
    tabInitSetArray.value.forEach((item, index) => {
      styleContent += rgBuildHeaderStyleBlock(item, index);
    });
    styleContent += rgBuildGridFontSizeCss();
    document.head.insertAdjacentHTML(
      "beforeend",
      `<style>${styleContent}</style>`
    );
    await nextTick();
    if (tabInitSetArray.value.length != 0) {
      const deferEmpty =
        props.deferGridUntilData === true &&
        (!Array.isArray(props.rowData) || props.rowData.length === 0);
      if (!deferEmpty) {
        await funcshowGrid();
      }
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

    if (Array.isArray(props.extraColumns) && props.extraColumns.length > 0) {
      tabInitSetArray.value.push(
        ...withInheritedHeaderStyle(result, props.extraColumns)
      );
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

    if (props.setDynamicGrid7 == true) {
      const res = await getDynamicGrid7(store.state.userData.lngStoreGroup);

      if (res.data.List.length > 0) {
        tabInitSetArray.value.push(...res.data.List);
      }
      console.log(res);
    }

    if (props.setDynamicGrid8 == true) {
      const res = await getDynamicGrid8(store.state.userData.lngStoreGroup);

      if (res.data.List.length > 0) {
        tabInitSetArray.value.push(...res.data.List);
      }
      console.log(res);
    }

    // Dynamic style generation
    let styleContent = "";
    tabInitSetArray.value.forEach((item, index) => {
      styleContent += rgBuildHeaderStyleBlock(item, index);
    });
    styleContent += rgBuildGridFontSizeCss();
    document.head.insertAdjacentHTML(
      "beforeend",
      `<style>${styleContent}</style>`
    );

    if (tabInitSetArray.value.length != 0) {
      const deferEmpty =
        props.deferGridUntilData === true &&
        (!Array.isArray(props.rowData) || props.rowData.length === 0);
      if (!deferEmpty) {
        await funcshowGrid();
      }
    }
  } catch (error) {
    //console.error("Failed to fetch data:", error);
  }
};

onUnmounted(() => {
  rgDestroyInstance(undefined, realgridname);
  isGridInitialized.value = false;
});

watch(
  () => props.rowData,
  (newRowData) => {
    if (props.initSelect == true) {
      selectedindex.value = -1;
    }
    addrow4activated.value = true;
    
    // 미초기화 + 데이터 도착 → funcshowGrid 1회. 이후는 setRows만
    const isInitialLoad =
      !isGridInitialized.value && newRowData && newRowData.length > 0;
    previousRowDataLength.value = newRowData ? newRowData.length : 0;
    
    // 초기 로드이거나 그리드가 초기화되지 않은 경우 funcshowGrid 호출
    // 그 외의 경우 (그리드가 이미 초기화되어 있고 데이터만 업데이트)에는 setRows만 호출
    if (!isInitialLoad && isGridInitialized.value) {
      const selfId = realgridname.value;
      rgBindActiveInstance(realgridname);
      const instSet = rgGetInstance(selfId);
      const gvSet = instSet?.gridView;
      const dpSet = instSet?.dataProvider;
      if (
        gvSet !== undefined &&
        gvSet !== null &&
        dpSet !== undefined &&
        dpSet !== null
      ) {
      // 그리드 재초기화 없이 데이터만 업데이트
      try {
        if (gvSet != null) {
          try {
            gvSet.commit();
          } catch (_) {}
        }
        applyRowsToProvider(props.rowData);

        if (props.bulkLoadMode === true) {
          addrow4activated.value = false;
          return;
        }

        try {
          if (
            Array.isArray(props.forceColumnLayout) &&
            props.forceColumnLayout.length > 0
          ) {
            rgApplyForceColumnLayout(gvSet);
          } else if (!props.preserveColumnLayoutOnRefresh) {
            gvSet?.refresh?.();
          }
          rgReapplyLabelingDropdownEditors(gvSet);
          rgBindLabelingDropdownOnShowEditor(gvSet);
          if (
            props.syncGridHeight === true ||
            props.gridRowHeight > 0 ||
            props.gridHeaderHeight > 0 ||
            props.gridFontSize > 0
          ) {
            rgSyncGridLayout();
          }
        } catch (_) {}
        if (gvSet) {
          var rows = gvSet.getCheckedRows();
          selectedRowData.value = [];
          for (var i in rows) {
            var data = dpSet.getJsonRow(rows[i]);
            selectedRowData.value.push(data);
          }
          emit("checkedRowData", selectedRowData.value);
        }

        rgRunPostSetRowsFinalize(selfId);
      } catch (error) {
        // setRows 실패 시 그리드 재초기화
        console.warn("Failed to update rows, reinitializing grid:", error);
        isGridInitialized.value = false;
        funcshowGrid().then(() => {
          const instRe = rgGetInstance(selfId);
          const gvRe = instRe?.gridView;
          const dpRe = instRe?.dataProvider;
          if (gvRe) {
            var rows = gvRe.getCheckedRows();
            selectedRowData.value = [];
            for (var i in rows) {
              var data = dpRe.getJsonRow(rows[i]);
              selectedRowData.value.push(data);
            }
            emit("checkedRowData", selectedRowData.value);
          }

          rgRunPostSetRowsFinalize(selfId);
        });
      }
      }
    } else {
      const selfIdElse = realgridname.value;
      funcshowGrid().then(() => {
        const instElse = rgGetInstance(selfIdElse);
        const gvElse = instElse?.gridView;
        const dpElse = instElse?.dataProvider;
        if (gvElse) {
          var rows = gvElse.getCheckedRows();
          selectedRowData.value = [];
          for (var i in rows) {
            var data = dpElse.getJsonRow(rows[i]);
            selectedRowData.value.push(data);
          }
          emit("checkedRowData", selectedRowData.value);
        }

        rgRunPostSetRowsFinalize(selfIdElse);
      });
    }
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
.rg-check-readonly-disabled {
  background-color: #9a9a9a !important;
}

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

/* 일소계 행 — 소계(청)·합계(분홍)과 다른 계열(연민트) */
.rowDailySubtotal {
  background: rgb(178, 229, 210);
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
  text-align: center !important;
  vertical-align: middle !important;
}
.header-style-red {
  background-color: #800020;
  color: white;
  text-align: center !important;
  vertical-align: middle !important;
}
.header-style-green {
  background-color: #006400;
  color: white;
  text-align: center !important;
  vertical-align: middle !important;
}

img.rg-tree-icon {
  display: inline !important;
}
</style>
