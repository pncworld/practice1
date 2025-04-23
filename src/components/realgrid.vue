<template>
  <div :id="realgridname" class="h-[100%] w-[100%] realgrid"></div>
</template>

<script setup>
import { getGridInfoList } from "@/api/common";
import { getDynamicGrid2, getDynamicGrid3 } from "@/api/master";
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
  사용법 progname => SQL mstgridInfo 에 저장된 설정값 가져오는 부분
  사용법 progid => SQL mstgridInfo 에 저장된 설정값 가져오는 부분
  rowData => 실제 데이터 입력 부분
  showGrid => 변수로 그리드를 보여주거나 안 보여주게 설정
  showCheckBar => 변수로 그리드 내의 체크바를 보여주거나 안 보여주게 설정
  searchWord => 변수로 그리드 내의 데이터에서 검색어로 조회할 수 있게 설정
  searchColId => 검색하려는 필드명 ( 예)strName,SubName) , 로 나눠서 해당 필드들을 함께 조회 가능
  addRow => true false로 값이 변할때마다 행을 추가
  deleteRow =>  true false로 값이 변할때마다 행을 삭제
  사용법 emit updatedRowData 사용시에는 가급적 불가피한경우가 아니라면 기존 rowData와 교체 하지 말 것. updatedRowData로 수정된 사항을 별도의
  변수로 저장해두고 추후에 그 데이터를 저장하는게 옳다고봄



  gridView.columnByName("colName").footer.valueCallback = function(grid, column, footerIndex, columnFooter, value){
    var sum = 0;
    var checkedItems = gridView.getCheckedItems();
    for(var i = 0; i < checkedItems.length; i++){
        sum += grid.getValue(checkedItems[i], "fieldName")
    }

    return sum;
}
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
    default: "",
  },
  changeColid: {
    type: String,
    default: "",
  },
  changeRow: {
    type: Number,
    default: "",
  },
  changeValue: {
    type: String,
    default: "",
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
    default: "",
  },
  mergeColumnGroupSubList: {
    type: String,
    default: "",
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
  },
  dragOn: {
    type: Boolean,
    default: false,
  },
  notsoftDelete: {
    type: Boolean,
    default: false,
  },
  searchColId2: {
    type: String,
    default: "",
  },
  searchColValue2: {
    // 숫자로만 오게
    type: String,
    default: "",
  },
  addRow3: {
    // 숫자로만 오게
    type: Boolean,
    default: true,
  },
  selectionStyle: {
    // 숫자로만 오게
    type: String,
    default: "singleRow",
  },
  initFocus: {
    // 숫자로만 오게
    type: Boolean,
    default: false,
  },
  addRow4: {
    // 숫자로만 오게
    type: Boolean,
    default: false,
  },
  addRow5: {
    // 숫자로만 오게
    type: Boolean,
    default: false,
  },
  deleteRow2: {
    // 숫자로만 오게
    type: Boolean,
    default: false,
  },
  addField: {
    // 숫자로만 오게
    type: String,
    default: "",
  },
  labelsData: {
    // 숫자로만 오게
    type: Array,
    default: () => [],
  },
  valuesData: {
    // 숫자로만 오게
    type: Array,
    default: () => [],
  },
  labelingColumns: {
    // 숫자로만 오게
    type: String,
    default: "",
  },
  deleteRow3: {
    // 숫자로만 오게
    type: Boolean,
    default: false,
  },
  useCheckboxfordelete: {
    // 숫자로만 오게
    type: Boolean,
    default: false,
  },
  changeNow: {
    type: Boolean,
    default: false,
  },
  changeValue2: {
    type: String,
    default: "",
  },
  setNumberformatColumn: {
    type: String,
    default: "",
  },
  setAllCheck: {
    type: Boolean,
    default: false,
  },
  deleteRow4: {
    type: Boolean,
    default: false,
  },
  deleteRow5: {
    type: Boolean,
    default: false,
  },
  defaultSearchAllValue: {
    type: Number,
    default: 0,
  },
  initCheckColumn: {
    type: String,
    default: "",
  },
  initCheckValue: {
    type: String,
    default: "",
  },
  initCheckAct: {
    type: Boolean,
    default: false,
  },
  initSelect: {
    type: Boolean,
    default: false,
  },
  setAllCheck2: {
    type: Boolean,
    default: false,
  },
  uncheckColumn: {
    type: String,
    default: "",
  },
  uncheckValue: {
    type: String,
    default: "",
  },
  uncheckAct: {
    type: Boolean,
    default: false,
  },
  maintaincheckColumn: {
    type: String,
    default: "",
  },
  hideRow: {
    type: Number,
    default: 0,
  },
  hideNow: {
    type: Boolean,
    default: "",
  },
  changeOriginRow: {
    type: Number,
    default: "",
  },
  checkBarInactive: {
    type: String,
    default: "",
  },
  ExceptionCheck: {
    type: String,
    default: "",
  },
  showTooltip: {
    type: Boolean,
    default: false,
  },

  searchPrimaryId: {
    type: String,
    default: "",
  },
  setStateBar: {
    type: Boolean,
    default: true,
  },
  setFooter: {
    type: Boolean,
    default: false,
  },
  setGroupFooter: {
    type: Boolean,
    default: false,
  },
  setFooterExpressions: {
    type: Array,
    default: [],
  },
  setFooterColID: {
    type: Array,
    default: [],
  },
  showOnlyChecked: {
    type: Boolean,
    default: false,
  },
  setGroupColumnId: {
    type: String,
    default: "dtmDate",
  },
  setGroupSumCustomText: {
    type: Array,
    default: [],
  },
  setGroupSumCustomColumnId: {
    type: Array,
    default: [],
  },
  setGroupCustomLevel: {
    type: String,
    default: "1",
  },

  setGroupSummaryCenterIds: {
    type: String,
    default: " ",
  },
  hideColumnNow: {
    type: Boolean,
    default: false,
  },
  hideColumn: {
    type: String,
    default: "",
  },
  setRowGroupSpan: {
    type: String,
    default: "",
  },
  documentTitle: {
    type: String,
    default: "",
  },
  documentSubTitle: {
    type: String,
    default: "",
  },
  hideColumnsId: {
    type: Array,
    default: [],
  },
  setGroupFooterExpressions: {
    type: Array,
    default: [],
  },
  setGroupFooterColID: {
    type: Array,
    default: [],
  },
  setGroupSumCustomLevel: {
    type: String,
    default: 1,
  },
  setGroupSumCustomLevel2: {
    type: String,
    default: 1,
  },
  mergeColumns2: {
    type: Boolean,
    default: false,
  },
  mergeColumnGroupName2: {
    type: Array,
    default: [],
  },
  mergeColumnGroupSubList2: {
    type: Array,
    default: [[]],
  },
  getJson: {
    type: Boolean,
    default: false,
  },
  suffixColumnPercent: {
    type: Array,
    default: [],
  },
  mergeMask: {
    type: String,
    default: "",
  },

  setRowGroupSpan2: {
    type: String,
    default: "",
  },
  setMergeMode: {
    type: Boolean,
    default: true,
  },
  setFooterCustomText: {
    type: Array,
    default: [],
  },
  setFooterCustomColumnId: {
    type: Array,
    default: [],
  },
  setGroupOrderByColumnId: {
    type: String,
    default: "",
  },
  setGroupSumCustomText2: {
    type: Array,
    default: [[]],
  },
  setGroupSumCustomText3: {
    type: Array,
    default: [],
  },

  setGroupSumCustomColumnId2: {
    type: Array,
    default: [],
  },
  setGroupSumCustomColumnId3: {
    type: Array,
    default: [],
  },
  setGroupCustomLevel: {
    type: String,
    default: 1,
  },
  setRowStyleCalls: {
    type: Boolean,
    default: false,
  },
  setRowStyleLevel: {
    type: Number,
    default: 1,
  },

  setRowGroupSpan3: {
    type: String,
    default: "",
  },

  customFooterCalculate: {
    type: String,
    default: "",
  },
  customFooterShowLast: {
    type: Boolean,
    default: false,
  },
  customStyleColumnID: {
    type: Array,
    default: [],
  },
  setRowIndicator: {
    type: Boolean,
    default: true,
  },
  moveFocusbyIndex: {
    type: String,
    default: "",
  },
  deleteCreated: {
    type: Boolean,
    default: true,
  },
  setDynamicGrid: {
    type: Boolean,
    default: false,
  },
  setDynamicGrid2: {
    type: Boolean,
    default: false,
  },
  dynamicStoreCd: {
    type: String,
    default: "",
  },
  setDynamicGrid3: {
    type: Boolean,
    default: false,
  },
  searchWord3: {
    type: String,
    default: "",
  },
  changeNow2: {
    type: Boolean,
    default: false,
  },
  searchColId3: {
    type: Array,
    default: [],
  },
  searchValue: {
    type: Array,
    default: [],
  },
  deleteRow6: {
    type: Boolean,
    default: false,
  },
  suffixColumnJul: {
    type: Array,
    default: [],
  },
  suffixColumnheng: {
    type: Array,
    default: [],
  },
  searchSpecialCond: {
    type: Boolean,
    default: true,
  },
  searchSpecialColId: {
    type: Array,
    default: [],
  },
  activeSearchSpecial: {
    type: Boolean,
    default: false,
  },
});

const realgridname = ref(
  `realgrid-${props.progname}-${props.progid}-${uuidv4()}`
); // 동적 ID 설정
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
  "getJsonData",
  "sendRowState",
  "deleteRows",
  "realgridName",
  "allStateRows",
  "buttonClicked",
]);
const funcshowGrid = async () => {
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
  await nextTick();

  const container = document.getElementById(realgridname.value);

  if (!container) {
    console.error(`Invalid grid container element: ${realgridname.value}`);
    return;
  }

  gridView = new GridView(container);
  gridView.setDataSource(dataProvider);

  // 필드 정의
  const fields = tabInitSetArray.value.map((item) => ({
    fieldName: item.strColID,
    dataType:
      item.strColID.includes("checkbox") ||
      item.strColID.includes("lngSupplierID")
        ? "boolean"
        : item.strColType == "number" ||
          item.strColType === "float" ||
          item.strColType === "double"
        ? "number"
        : item.strColType == "date"
        ? "datetime"
        : "text",
    datetimeFormat: "yyyy-MM-dd",
  }));
  fields.push({ fieldName: "deleted", dataType: "boolean" });
  if (props.addField == "new") {
    fields.push({ fieldName: "new", dataType: "boolean" });
  }

  dataProvider.setFields(fields);

  // 컬럼 정의
  const columns = tabInitSetArray.value.map((item, index) => ({
    name: item.strColID,
    fieldName: item.strColID,
    header: {
      text: item.strHdText,
      styleName: `header-style-${index}`,
      checkLocation: item.strColID.includes("checkbox") ? "left" : "none",
    },
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
        item.strSubSumexpr != ""
          ? item.strSubSumexpr
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
          : item.strColType === "double" && item.strDisplay == "double"
          ? "#,##0.00"
          : item.strColType === "double" && item.strDisplay != "double"
          ? "#,##0.0"
          : "#,##0",
      suffix: props.suffixColumnPercent.includes(item.strColID) ? "%" : "",
      valueCallback: function (grid, column, footerIndex, columnFooter, value) {
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
          //console.log(returnText)
          return eval(returnText) == "Infinity" ? 0 : eval(returnText);
        } else {
          return value;
        }
      },
    },

    datetimeFormat: item.strMask == "" ? "yyyy-MM-dd" : item.strMask, // sql 에서 mstgridinfo 에서 date  일때 기본값이 있고 정의할 수 있음
    width: item.intHdWidth,
    numberFormat:
      item.strColType == "float"
        ? "#,##0"
        : item.strColType == "double" && item.strDisplay == "double"
        ? "#,##0.00"
        : "#,##0.0",
    styleName:
      item.strAlign == "left"
        ? "setTextAlignLeft"
        : item.strAlign == "center"
        ? "setTextAlignCenter"
        : "setTextAlignRight",
    editor: {
      type: item.strColType.includes("dropdown")
        ? "dropdown"
        : item.strDisplay.includes("date")
        ? "date"
        : "line",
      domainOnly: true,
      textReadOnly: true,
      datetimeFormat: "yyyy-MM-dd",

      commitOnSelect: true,
      inputCharacters:
        item.strColID == props.inputOnlyNumberColumn
          ? "0123456789"
          : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_ㄱ-힣!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~ ",
    },
    visible: item.intHdWidth !== 0,
    renderer: {
      type:
        item.strColID == "add"
          ? "button"
          : item.strColID.includes("checkbox") ||
            item.strColID.includes("lngSupplierID")
          ? "check"
          : item.strColType.includes("dropdown")
          ? "list"
          : "text",
    },
    buttonVisibility: "always",
    styleCallback: function (grid, dataCell) {
      var ret = {};

      if (
        (dataCell.item.rowState == "created" ||
          dataCell.item.itemState == "appending" ||
          dataCell.item.itemState == "inserting") &&
        props.rowStateeditable
      ) {
        ret.editable = true;
      } else if (item.strColID == props.editableColId) {
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

        if (inActiveColumn == "0" && item.strColID == "checkbox") {
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
    // console.log(lcolumns)
    // console.log(labels)
    // console.log(values)
    for (var i = 0; i < lcolumns.length; i++) {
      const labelingcolumn = columns.find(
        (item) => item.fieldName == lcolumns[i]
      );

      if (labelingcolumn) {
        labelingcolumn.lookupDisplay = true;

        labelingcolumn.values = values[i];
        labelingcolumn.labels = labels[i];
      }
      console.log(labelingcolumn);
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

  // if (props.setRowGroupSpan3 != '') {
  //   console.log(props.setRowGroupSpan3)
  //   const mergeColumn = props.setRowGroupSpan3.split(',')
  //   const maskColumns = props.mergeMask.split(',')
  //   for (var i = 0; i < maskColumns.length; i++) {
  //     const rowGroupSpanColumn = columns.find(item => item.fieldName == maskColumns[i])
  //     let maskdata = 'value' ;
  //     if(props.mergeMask != ''){
  //       const mask = maskColumns.map(item => item)

  //     for(let j=0 ; j < mask.length ; j++ ){
  //       if(mask[j] == maskColumns[i]){
  //         maskdata = "values['"+mask[j]+"']+"
  //       } else {
  //         maskdata = ''
  //       }

  //     }
  //     maskdata = maskdata+"value"
  //     } else {
  //       maskdata = "value"
  //     }
  //      console.log(maskdata)
  //      if(rowGroupSpanColumn){
  //       rowGroupSpanColumn.mergeRule = { criteria: maskdata}
  //      }

  //   }

  // }

  gridView.setColumns(columns);

  if (props.setRowStyleCalls) {
    gridView.setRowStyleCallback((grid, item, fixed) => {
      if (props.setRowStyleLevel == 1) {
        let Value = grid.getValue(item.index, "seqNum");
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
          header: { visible: true, text: item.strHdText },
          visible: item.intHdWidth !== 0,
          width: item.intHdWidth,
        });
      }
    });

    gridView.setColumnLayout(layout);
  }

  // 데이터 추가

  dataProvider.setRows(props.rowData);

  // 기타 옵션
  gridView.rowIndicator.width = 50;
  gridView.setFooters({ visible: props.setFooter == false ? false : true });
  gridView.setRowIndicator({ visible: props.setRowIndicator });
  gridView.setCheckBar({ visible: props.showCheckBar });
  gridView.displayOptions.fitStyle = "even";
  gridView.sortingOptions.enabled = true;
  //gridView.editOptions.editable = false;
  gridView.editOptions.updatable = true;
  gridView.editOptions.deletable = true;
  gridView.displayOptions.fitStyle =
    props.fixedColumn == false ? "even" : "none";
  gridView.editOptions.commitByCell = true;
  gridView.editOptions.commitWhenLeave = true;
  gridView.displayOptions.showInnerFocus = false;
  dataProvider.softDeleting = props.notsoftDelete == false ? true : false;
  dataProvider.deleteCreated = props.deleteCreated;
  gridView.filteringOptions.handleVisibility = "hidden";
  //gridView.sortingOptions.enabled = false; // 정렬기능 비활성화
  dataProvider.autoCommit = true; // 자동 커밋 활성화
  dataProvider.commitBeforeDataEdit = true;
  gridView.editOptions.movable = props.dragOn == true ? true : false;
  gridView.displayOptions.selectAndImmediateDrag =
    props.dragOn == true ? true : false;
  gridView.displayOptions.selectionStyle = props.selectionStyle;
  gridView.displayOptions.showTooltip = true;
  gridView.groupPanel.visible = false;
  gridView.displayOptions.watchDisplayChange = false;
  gridView.filterMode = "explicit";

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
      console.log(props.setGroupColumnId);
      if (gridView) {
        console.log(props.setGroupOrderByColumnId);
        //gridView.orderBy(props.setGroupOrderByColumnId.split(","));
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
  // 이벤트 설정
  gridView.onDataLoadComplated = function (grid) {
    grid.refresh(true);
    grid.resetSize();
  };

  gridView.onCellEdited = function (grid, itemIndex, row, field) {
    gridView.commit();

    updatedrowData.value = [...dataProvider.getJsonRows()];
    emit("updatedRowData", updatedrowData.value);
  };
  // gridView.onCellItemClicked = function (grid, index, clickData) {
  //   if (clickData.index == undefined || clickData.index == -1) {
  //     return;
  //   }
  //   selectedRowData.value = dataProvider.getRows()[index];
  //   // var current = gridView.getCurrent();
  //   // selectedindex.value = current.dataRow;
  //   // console.log(selectedindex.value);
  //   emit("buttonClicked", selectedRowData.value);
  // };
  gridView.onItemChecked = function (grid, itemIndex, checked) {
    gridView.setCurrent({ dataRow: itemIndex });
    var rows = gridView.getCheckedRows();
    selectedRowData.value = [];
    for (var i in rows) {
      var data = dataProvider.getJsonRow(rows[i]);
      selectedRowData.value.push(data);
    }
    updatedrowData.value = [...dataProvider.getJsonRows()];

    selectedRowData.value.index = itemIndex;
    emit("checkedRowData", selectedRowData.value);
  };
  gridView.onItemAllChecked = (grid, checked) => {
    console.log("전체체크");
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

    emit("updatedRowData", updatedrowData.value);
    const a = updatedrowData.value.filter((item) => item.checkbox == true);
    // selectedRowData.value = []

    emit("allStateRows", dataProvider.getAllStateRows());
    emit("checkedRowData", a);
  };

  gridView.onCellItemClicked = function (grid, clickData) {
    if (clickData.itemIndex == undefined || clickData.itemIndex == -1) {
      return;
    }

    var current = gridView.getCurrent();
    selectedindex.value = current.dataRow;
    selectedRowData.value = dataProvider.getRows()[current.dataRow];
    emit("selcetedrowData", selectedRowData.value);
    emit("selectedIndex", clickData.itemIndex);
    emit("selectedIndex2", clickData.dataRow);
  };

  gridView.onSelectionChanged = function (grid) {
    var current = gridView.getCurrent();

    selectedRowData.value = dataProvider.getRows()[current.dataRow];
    if (selectedRowData.value) {
      selectedRowData.value.index = current.dataRow;
      //emit('clickedRowData', selectedRowData.value);
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
    if (clickData.cellType === "header") {
      gridView.setCurrent({ dataRow: selectedindex.value });
    }
    if (clickData.itemIndex == undefined || clickData.itemIndex == -1) {
      return;
    }
    var current = gridView.getCurrent();
    console.log(current);
    if (current.itemIndex !== -1) {
      emit("selectedIndex", current.dataRow);
      emit("selectedIndex2", current.dataRow);
      selectedRowData.value = dataProvider.getRows()[current.dataRow];
      if (selectedRowData.value) {
        const rowState = dataProvider.getRowState(clickData.dataRow);
        if (selectedRowData.value) {
          selectedRowData.value.index = current.dataRow;
          selectedRowData.value.rowState = rowState;
        }
        selectedindex.value = current.dataRow;

        console.log(rowState);
        emit("sendRowState", rowState);

        emit("clickedRowData", selectedRowData.value);
      }
    }
  };

  gridView.onColumnCheckedChanged = function (grid, col, chk) {
    var rowCount = dataProvider.getRowCount(); // 전체 행의 개수
    if (props.ExceptionCheck != "") {
      for (var i = 0; i < rowCount; i++) {
        if (grid.getValue(i, props.ExceptionCheck) !== "0") {
          dataProvider.setValue(i, col.fieldName, chk);
        }
      }
    } else {
      for (var i = 0; i < rowCount; i++) {
        dataProvider.setValue(i, col.fieldName, chk);
      }
    }

    console.log(col.fieldName + "was checked as: " + chk);
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
    console.log(props.changeRow);
    console.log(props.changeColid);
    console.log(props.changeValue2);
    console.log(dataProvider.getJsonRows());
    if (props.changeRow !== "" && props.changeRow != -1) {
      dataProvider.setValue(
        props.changeRow,
        props.changeColid,
        props.changeValue2
      );

      updatedrowData.value = [...dataProvider.getJsonRows()];

      const dataRow = gridView.getCurrent().dataRow;
      selectedRowData.value = dataProvider.getRows()[dataRow];
      emit("clickedRowData", selectedRowData.value);
      emit("updatedRowData", updatedrowData.value);
      emit("updatedRowData2", updatedrowData.value);
    }
  }
);

watch(
  () => props.changeNow2,
  () => {
    console.log(props.changeRow);
    console.log(props.changeColid);
    console.log(props.changeValue2);
    console.log(dataProvider.getJsonRows());
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
      emit("updatedRowData", updatedrowData.value);
      emit("updatedRowData2", updatedrowData.value);
    }
  }
);

// onMounted(() => {
//   console.log("asdf");
// });

watch(
  () => [props.searchWord3, props.searchValue, props.searchSpecialCond],
  () => {
    let criteria2 = props.searchColId.split(",");

    let criteria3 = `(value match '${props.searchWord3}')`;

    let criteria4 = props.searchSpecialColId;

    let filter4 = [
      {
        name: "미설정메뉴",
        criteria: "(value = 'false') or (value is null ) ",
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
          console.log(props.searchValue[i]);
          if (props.searchValue[i] == -1) {
            gridView.setColumnFilters(props.searchColId3[i], []);
          } else {
            gridView.setColumnFilters(props.searchColId3[i], filter2[i]);
          }
        }
      }

      var current = gridView.getCurrent();
      console.log(current);
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

          console.log(rowState);
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
      console.log("현재 선택된 인덱스:", selectedRowIndex); // 선택된 행의 인덱스 출력
      selectedindex.value = selectedRowIndex;
    }
    emit("selectedIndex", selectedRowIndex);
    emit("selectedIndex2", current.dataRow);
    console.log(props.rowData);
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
    console.log(values);
    emit("sendRowState", "created");
    var dataRow = dataProvider.addRow(values);
    gridView.setCurrent({ dataRow: dataRow });
    const current = gridView.getCurrent();
    emit("allStateRows", dataProvider.getAllStateRows());
    props.rowData.push(values);
    const selectedRowIndex = current ? current.dataRow : null;
    if (selectedRowIndex !== null) {
      console.log("현재 선택된 인덱스:", selectedRowIndex); // 선택된 행의 인덱스 출력
      selectedindex.value = selectedRowIndex;
    }

    emit("selectedIndex", selectedRowIndex);
    emit("selectedIndex2", current.dataRow);
    console.log(props.rowData);
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
    for (var i = 0; i < propertys.length; i++) {
      values[propertys[i]] = value[i];
    }
    values.new = true;
    console.log(values);
    emit("sendRowState", "created");
    var dataRow = dataProvider.addRow(values);
    gridView.setCurrent({ dataRow: dataRow });
    const current = gridView.getCurrent();

    const selectedRowIndex = current ? current.dataRow : null;
    if (selectedRowIndex !== null) {
      console.log("현재 선택된 인덱스:", selectedRowIndex); // 선택된 행의 인덱스 출력
      selectedindex.value = selectedRowIndex;
    }

    emit("selectedIndex", selectedRowIndex);

    console.log(props.rowData);
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
    console.log(curr.dataRow);
    if (curr.dataRow == -1) {
      return;
    }
    if (curr && curr.dataRow >= 0 && props.rowData[curr.dataRow]) {
      // 현재 데이터 행이 유효한 경우
      props.rowData[curr.dataRow].deleted = true;
      dataProvider.setValue(curr.dataRow, "deleted", true); // "deleted" 속성을 true로 설정
      dataProvider.removeRow(curr.dataRow);
      gridView.commit();
    } else {
      console.log(curr.dataRow);
      dataProvider.removeRow(curr.dataRow);
    }
    updatedrowData.value = [...dataProvider.getJsonRows()];
    emit("updatedRowData", updatedrowData.value);
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
      console.warn("선택된 행이 없습니다.");
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
    const curr = gridView.getCurrent();
    if (curr.dataRow == -1) {
      return;
    }
    const alldata = dataProvider.getJsonRows();
    const checkedIndexes = [];

    alldata.forEach((item, index) => {
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
      console.log(dataProvider.getRowState(curr.dataRow));
      if (dataProvider.getRowState(curr.dataRow) == "created") {
        dataProvider.removeRow(curr.dataRow);
      } else {
        dataProvider.setRowState(curr.dataRow, "deleted", true);
        dataProvider.removeRow(curr.dataRow);
      }

      gridView.commit();
    } else {
      console.warn("선택된 행이 없습니다.");
    }

    const curr2 = gridView.getCurrent();
    const currRowState2 = dataProvider.getRowState(curr2.dataRow);
    emit("sendRowState", currRowState2);
    emit("selectedindex", curr2.dataRow);

    let deletedRows = dataProvider.getStateRows("deleted");
    console.log(deletedRows);
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
    if (curr.dataRow == -1 || curr.dataRow == undefined) {
      return;
    }
    console.log(curr.dataRow);
    dataProvider.removeRow(curr.dataRow);
    console.log(dataProvider.getAllStateRows());
    emit("allStateRows", dataProvider.getAllStateRows());
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
    console.log(props.initCheckValue);
    console.log(props.initCheckColumn);
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
    console.log(props.moveFocusbyIndex);
    //console.log(gridView.setCurrent({ dataRow: Number(props.moveFocusbyIndex) }))
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
// watch(() => props.setRowGroupSpan  , () => {
//   if(props.setRowGroupSpan != ''){
//    console.log(props.setRowGroupSpan)
//   const mergeColumn = props.setRowGroupSpan.split(',')
//     for (var i = 0; i < mergeColumn.length; i++) {
//       gridView.columnByName(mergeColumn[i]).mergeRule = {
//         criteria: "value"
//       }
//     }
//   }
// })
onMounted(async () => {
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

    // if (props.setDynamicGrid3 == true) {
    //   console.log(tabInitSetArray.value);
    //   const res = await getDynamicGrid3(
    //     store.state.userData.lngStoreGroup,
    //     props.dynamicStoreCd,
    //     result.length
    //   );
    //   console.log(tabInitSetArray.value);
    //   console.log(res);
    //   tabInitSetArray.value.push(...res.data.List);
    //   console.log(tabInitSetArray.value);
    // }

    // 동적 스타일 생성
    let styleContent = "";
    tabInitSetArray.value.forEach((item, index) => {
      styleContent += `
        .header-style-${index} {
          background-color: ${item.strHdBkColor} !important;
          color: ${item.strHdColor} !important;
        }
      `;
    });
    document.head.insertAdjacentHTML(
      "beforeend",
      `<style>${styleContent}</style>`
    );

    await funcshowGrid();
  } catch (error) {
    console.error("Failed to fetch data:", error);
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
    document.head.insertAdjacentHTML(
      "beforeend",
      `<style>${styleContent}</style>`
    );

    await funcshowGrid();
  } catch (error) {
    console.error("Failed to fetch data:", error);
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
      setTimeout(function () {
        if (selectedindex.value == -1) {
          dataProvider.clearRowStates();
          emit("selectedIndex", selectedindex.value);
          return;
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

// window.onbeforeprint = () => {
//   var gridContainer = document.querySelector('[id^="realgrid"]');
//   var gridBody = document.querySelector("#realgrid .rg-body");
//   window.orgWidth = gridBody.style.width;
//   gridContainer.style.width = "600px";
//   gridView.resetSize();

//   gridBody.style.width = "526px";
//   var gridHeader = document.querySelector("#realgrid .rg-header");
//   gridHeader.style.width = "526px";
//   var gridFooter = document.querySelector("#realgrid .rg-footer");
//   gridFooter.style.width = "526px";
// };

// window.onafterprint = () => {
//   var gridContainer = document.querySelector('[id^="realgrid"]');
//   var gridBody = document.querySelector("#realgrid .rg-body");
//   window.orgWidth = gridBody.style.width;
//   gridContainer.style.width = "100%";
//   gridView.resetSize();

//   gridBody.style.width = "100%";
//   var gridHeader = document.querySelector("#realgrid .rg-header");
//   gridHeader.style.width = "100%";
//   var gridFooter = document.querySelector("#realgrid .rg-footer");
//   gridFooter.style.width = "100%";
// };
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
</style>
