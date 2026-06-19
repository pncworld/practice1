<template>
  <div class="pur017-rg-host h-full min-h-0 w-full">
    <div ref="hostEl" class="h-full min-h-0 w-full"></div>
  </div>
</template>

<script setup>
import { getGridInfoList } from "@/api/common";
import { excelTitle, formatDateTime } from "@/customFunc/customFunc";
import store from "@/store";
import { GridView, LocalDataProvider } from "realgrid";
import { nextTick, onMounted, onUnmounted, ref, watch } from "vue";

const DEFAULT_HDR_BG = "#545876";
const DEFAULT_HDR_FG = "#FFFFFF";
const DEFAULT_LOCKED_BG = "#A4A4A4";

const props = defineProps({
  progname: { type: String, default: "PUR02_017INS_VUE" },
  progid: { type: [Number, String], default: 1 },
  exporttoExcel: { type: Boolean, default: false },
  documentTitle: { type: String, default: "PUR02_017INS" },
  documentSubTitle: { type: String, default: "" },
});

const emit = defineEmits(["checkedRowData", "dblclickedRowData", "loadComplete"]);

const hostEl = ref(null);

let gridMetaList = [];
let lockedCellBg = DEFAULT_LOCKED_BG;
let checkColId = "lngCheck";
let gridView = null;
let dataProvider = null;
let styleEl = null;
let gridReady = false;
let checkedEmitTimer = null;
let pendingRows = null;

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

const isCheckboxMetaCol = (item) =>
  item?.strColID === "lngCheck" ||
  String(item?.strDisplay ?? "").includes("checkbox") ||
  String(item?.strColID ?? "").includes("checkbox");

const metaAlign = (item) => {
  const a = String(item?.strAlign ?? "left").toLowerCase();
  if (a === "center") return "center";
  if (a === "right") return "right";
  return "left";
};

const QTY_DECIMAL2_COLS = new Set(["dblOrderQty", "dblCheckQty"]);

const metaNumberFormat = (item) => {
  const colId = String(item?.strColID ?? "");
  if (QTY_DECIMAL2_COLS.has(colId)) return "#,##0.00";
  const t = String(item?.strColType ?? "").toLowerCase();
  const d = String(item?.strDisplay ?? "").toLowerCase();
  if (t === "float") return "#,##0.0";
  if (t === "double") {
    if (d === "double2") return "#,##0.000";
    if (d === "double") return "#,##0.00";
    return "#,##0.0";
  }
  if (t === "number") return "#,##0";
  return null;
};

const metaFieldDataType = (item) => {
  if (isCheckboxMetaCol(item)) return "boolean";
  const t = String(item?.strColType ?? "").toLowerCase();
  if (t === "float" || t === "double" || t === "number") return "number";
  return "text";
};

const sortMeta = (list) =>
  [...list].sort(
    (a, b) => Number(a?.lngColNo ?? 0) - Number(b?.lngColNo ?? 0)
  );

const buildFieldsFromMeta = (metaList) => {
  const fields = sortMeta(metaList).map((item) => ({
    fieldName: item.strColID,
    dataType: metaFieldDataType(item),
  }));
  if (!fields.some((f) => f.fieldName === "_purLocked")) {
    fields.push({ fieldName: "_purLocked", dataType: "number" });
  }
  return fields;
};

/** mstGridInfo lngGridID=1 → RealGrid fields/columns (경량, styleCallback는 lngCheck만) */
const buildColumnsFromMeta = (metaList, id) => {
  const h = (i) => `pur017_h_${id}_${i}`;
  const b = (i) => `pur017_b_${id}_${i}`;
  const lockedCls = `pur017_locked_${id}`;

  let css = `.${lockedCls}{background:${lockedCellBg}!important;}\n`;

  const visible = sortMeta(metaList).filter((item) => item.intHdWidth !== 0);

  const columns = visible.map((item, i) => {
    const align = metaAlign(item);
    const hdrBg = String(item.strHdBkColor ?? "").trim() || DEFAULT_HDR_BG;
    const hdrFg = String(item.strHdColor ?? "").trim() || DEFAULT_HDR_FG;
    const isCheck = isCheckboxMetaCol(item);

    css += `.${h(i)}{background:${hdrBg}!important;color:${hdrFg}!important;text-align:center!important;}\n`;
    css += `.${b(i)}{text-align:${align}!important;}\n`;

    const col = {
      name: item.strColID,
      fieldName: item.strColID,
      width: item.intHdWidth || 80,
      header: {
        text: item.strHdText ?? item.strColID,
        styleName: h(i),
        checkLocation: isCheck ? "left" : "none",
      },
      styleName: b(i),
      sortable: !isCheck,
      editable: isCheck,
      readOnly: !isCheck,
    };

    const numFmt = metaNumberFormat(item);
    if (numFmt) {
      col.numberFormat = numFmt;
    }

    if (isCheck) {
      checkColId = item.strColID;
      col.renderer = { type: "check", editable: true };
      col.styleCallback = (grid, dataCell) => {
        const dr = dataCell?.index?.dataRow;
        if (dr == null || dr < 0) return {};
        if (grid.getDataSource()?.getValue(dr, "_purLocked") === 1) {
          return {
            renderer: { type: "check", editable: false, readOnlySetDisabled: true },
            styleName: lockedCls,
          };
        }
        return { renderer: { type: "check", editable: true } };
      };
    } else {
      col.renderer = { type: "text", editable: false };
    }

    return col;
  });

  return { columns, css };
};

/** API 실패 시 fallback — PUR02_017INS_VUE grid 1 기본형 */
const FALLBACK_META = [
  { strColID: "lngCheck", strHdText: "확정선택", intHdWidth: 80, strAlign: "center", strDisplay: "checkbox", strColType: "string" },
  { strColID: "strStoreName", strHdText: "매장명", intHdWidth: 140, strAlign: "left", strColType: "default" },
  { strColID: "strPartName", strHdText: "파트명", intHdWidth: 120, strAlign: "left", strColType: "default" },
  { strColID: "strSupplierName", strHdText: "거래처명", intHdWidth: 140, strAlign: "left", strColType: "default" },
  { strColID: "strOrderNo", strHdText: "전표번호(발주)", intHdWidth: 110, strAlign: "center", strColType: "default" },
  { strColID: "strCheckNo", strHdText: "전표번호(매입)", intHdWidth: 110, strAlign: "center", strColType: "default" },
  { strColID: "dtmOrderDate", strHdText: "발주일", intHdWidth: 80, strAlign: "center", strColType: "default", strMask: "@@@@-@@-@@" },
  { strColID: "dtmExpectedDate", strHdText: "배송(입고)일", intHdWidth: 80, strAlign: "center", strColType: "default", strMask: "@@@@-@@-@@" },
  { strColID: "dtmCheckDate", strHdText: "입고확정일", intHdWidth: 80, strAlign: "center", strColType: "default", strMask: "@@@@-@@-@@" },
  { strColID: "dblOrderQty", strHdText: "발주수량", intHdWidth: 70, strAlign: "right", strColType: "float" },
  { strColID: "dblCheckQty", strHdText: "입고수량", intHdWidth: 70, strAlign: "right", strColType: "float" },
  { strColID: "curSupply", strHdText: "공급가", intHdWidth: 70, strAlign: "right", strColType: "float" },
  { strColID: "curTax", strHdText: "부가세", intHdWidth: 70, strAlign: "right", strColType: "float" },
  { strColID: "curTotal", strHdText: "금액", intHdWidth: 70, strAlign: "right", strColType: "float" },
  { strColID: "blnChk", strHdText: "수정여부", intHdWidth: 0, strColType: "string" },
  { strColID: "lngStoreGroup", intHdWidth: 0, strColType: "string" },
  { strColID: "lngStoreCode", intHdWidth: 0, strColType: "string" },
  { strColID: "lngSupplierID", intHdWidth: 0, strColType: "string" },
  { strColID: "strComments", intHdWidth: 0, strColType: "string" },
  { strColID: "strCheckComments", intHdWidth: 0, strColType: "string" },
  { strColID: "strStoreCheckComments", intHdWidth: 0, strColType: "string" },
  { strColID: "strCheckEmpName", intHdWidth: 0, strColType: "string" },
  { strColID: "strStatus", intHdWidth: 0, strColType: "string" },
  { strColID: "lngPartCode", intHdWidth: 0, strColType: "string" },
];

const applyMetaTheme = (metaList) => {
  const checkMeta = metaList.find((m) => isCheckboxMetaCol(m));
  if (checkMeta?.strColID) {
    checkColId = checkMeta.strColID;
  }
  const bgDec = parseGridDecodeExpr(checkMeta?.strBackColorexp);
  if (bgDec?.falseResult && bgDec.falseResult.toLowerCase() !== "white") {
    lockedCellBg = bgDec.falseResult;
  } else {
    lockedCellBg = DEFAULT_LOCKED_BG;
  }
};

const isRowCheckable = (ds, dr) => ds?.getValue?.(dr, "_purLocked") !== 1;

const scheduleCheckedEmit = () => {
  if (checkedEmitTimer != null) clearTimeout(checkedEmitTimer);
  checkedEmitTimer = setTimeout(() => {
    checkedEmitTimer = null;
    if (!dataProvider) return;
    const out = [];
    const n = dataProvider.getRowCount();
    for (let i = 0; i < n; i++) {
      const v = dataProvider.getValue(i, checkColId);
      if (v === true || v === 1 || v === "1") {
        out.push(dataProvider.getJsonRow(i));
      }
    }
    emit("checkedRowData", out);
  }, 0);
};

const destroyGrid = () => {
  gridReady = false;
  if (gridView) {
    try {
      gridView.destroy();
    } catch (_) {
      void 0;
    }
    gridView = null;
  }
  if (dataProvider) {
    try {
      dataProvider.destroy();
    } catch (_) {
      void 0;
    }
    dataProvider = null;
  }
  if (styleEl?.parentNode) {
    styleEl.parentNode.removeChild(styleEl);
    styleEl = null;
  }
};

const initGrid = () => {
  destroyGrid();
  const el = hostEl.value;
  if (!el) return;

  const meta =
    Array.isArray(gridMetaList) && gridMetaList.length > 0
      ? gridMetaList
      : FALLBACK_META;
  applyMetaTheme(meta);

  const id = Math.random().toString(36).slice(2, 10);
  const { columns, css } = buildColumnsFromMeta(meta, id);
  const fields = buildFieldsFromMeta(meta);

  styleEl = document.createElement("style");
  styleEl.setAttribute("data-pur017-grid", id);
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  dataProvider = new LocalDataProvider();
  dataProvider.setFields(fields);

  gridView = new GridView(el);
  gridView.setDataSource(dataProvider);
  gridView.setColumns(columns);

  gridView.setCheckBar({ visible: false });
  gridView.setRowIndicator({ visible: true, width: 44 });
  gridView.setStateBar({ visible: false });
  gridView.setFooters({ visible: false });
  gridView.setOptions({ summaryMode: "none" });

  gridView.editOptions.editable = true;
  gridView.editOptions.readOnly = false;
  gridView.editOptions.commitByCell = true;
  gridView.editOptions.commitWhenLeave = true;

  gridView.displayOptions.fitStyle = "none";
  gridView.displayOptions.refreshMode = "visibleOnly";
  gridView.displayOptions.useAlternateRowStyle = false;
  gridView.displayOptions.showTooltip = false;
  gridView.displayOptions.selectionStyle = "block";
  gridView.displayOptions.useFocusClass = false;
  gridView.displayOptions.watchDisplayChange = false;
  gridView.displayOptions.columnResizable = true;
  gridView.sortingOptions.enabled = true;
  gridView.sortingOptions.commitBeforeSorting = true;

  gridView.onCellEdited = (_grid, _itemIndex, row, field) => {
    gridView.commit();
    const fieldName = dataProvider.getOrgFieldNames()?.[field];
    if (fieldName !== checkColId) return;
    if (!isRowCheckable(dataProvider, row)) {
      dataProvider.setValue(row, checkColId, false);
    }
    scheduleCheckedEmit();
  };

  gridView.onColumnCheckedChanged = (_grid, col, checked) => {
    if (col?.fieldName !== checkColId) return;
    const n = dataProvider.getRowCount();
    dataProvider.beginUpdate();
    try {
      for (let i = 0; i < n; i++) {
        if (!isRowCheckable(dataProvider, i)) continue;
        dataProvider.setValue(i, checkColId, checked);
      }
    } finally {
      dataProvider.endUpdate(true);
    }
    scheduleCheckedEmit();
  };

  gridView.onCellDblClicked = (_grid, clickData) => {
    if (clickData?.dataRow == null || clickData.dataRow < 0) return;
    try {
      gridView.commit(true);
    } catch (_) {
      try {
        gridView.cancel();
      } catch (_) {
        void 0;
      }
    }
    const row = dataProvider.getJsonRow(clickData.dataRow);
    if (!row) return;
    emit("dblclickedRowData", {
      ...row,
      index: clickData.itemIndex,
      dataRow: clickData.dataRow,
    });
  };

  gridReady = true;

  if (pendingRows != null) {
    const queued = pendingRows;
    pendingRows = null;
    loadRows(queued);
  }
};

const loadRows = (rows) => {
  if (!gridReady || !dataProvider || !gridView) {
    pendingRows = rows;
    return;
  }

  const list = Array.isArray(rows) ? rows : [];

  try {
    dataProvider.beginUpdate();
    dataProvider.setRows(list);
  } finally {
    try {
      dataProvider.endUpdate(true);
    } catch (_) {
      void 0;
    }
  }
  try {
    gridView.refresh(true);
    gridView.resetSize();
  } catch (_) {
    void 0;
  }
  emit("loadComplete", list.length);
};

const clearRows = () => {
  loadRows([]);
};

const exportExcel = () => {
  if (!gridView) return;
  const cat = store.state.minorCategory.find((item) =>
    item.strUrl.includes(props.documentTitle)
  );
  const title = excelTitle(cat);
  const excelNm = title.split("-")[2] ?? props.documentTitle;
  const user = store.state.userData.strChargerName;
  const userID = store.state.userData.loginID;
  const today = formatDateTime(new Date());

  gridView.exportGrid({
    type: "excel",
    target: "local",
    documentTitle: { message: title, visible: true, height: 40 },
    documentSubtitle: {
      message:
        props.documentSubTitle +
        "\n조회시간 : " +
        today +
        "\n작성자 : " +
        user +
        "(" +
        userID +
        ")",
      visible: true,
      height: 80,
    },
    fileName: excelNm + ".xlsx",
    showProgress: true,
    progressMessage: "엑셀 Export중입니다.",
    indicator: true,
    header: true,
    footer: false,
    compatibility: true,
    lookupDisplay: true,
    applyDynamicStyles: true,
  });
};

onMounted(async () => {
  await nextTick();
  try {
    const meta = await getGridInfoList(props.progname, props.progid);
    gridMetaList = Array.isArray(meta) ? meta : [];
  } catch (_) {
    gridMetaList = [];
  }
  initGrid();
});

watch(
  () => props.exporttoExcel,
  () => exportExcel()
);

onUnmounted(() => {
  if (checkedEmitTimer != null) clearTimeout(checkedEmitTimer);
  destroyGrid();
});

defineExpose({ loadRows, clearRows });
</script>
