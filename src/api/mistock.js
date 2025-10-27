import axios from "axios";
import { commonUrl, commonUrl2 } from "./common";
import store from "@/store";

const url = commonUrl;
const url2 = commonUrl2;
// Axios 인스턴스 생성 (기본 설정)
const api = axios.create({
  baseURL: url, // API 기본 URL
  timeout: 30000, // 요청 타임아웃 설정
});
const api2 = axios.create({
  baseURL: url2, // API 기본 URL
  timeout: 120000, // 요청 타임아웃 설정
});

api2.interceptors.request.use(
  (config) => {
    const token = store.state.StoreToken;

    config.headers["Authorization"] = `Bearer ${token}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api2.interceptors.response.use(
  (response) => {
    if (response.headers.authorization) {
      let newtoken = response.headers.authorization.substring(7);

      store.state.StoreToken = newtoken;
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status == 401) {
      alert("로그인 시간이 1분 이상 지났습니다. 재로그인 해주세요.");
      store.commit("clearSession");
      router.push("/");
      return new Promise(() => {});
    }
    return new Promise(() => {});
  }
);
export const getStockDetail = (groupCd, code) => {
  return api2.post("/MISTOCK/STKN07_012RPT.asmx/getStockDetail", {
    GROUP_CD: groupCd,
    CODE: code,
  });
};
export const getWorkSheetList = (
  groupCd,
  storeCd,
  cond,
  cond2,
  cond3,
  cond4,
  date
) => {
  return api2.post("/MISTOCK/STKN07_012RPT.asmx/getWorkSheetList", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    COND: cond,
    COND2: cond2,
    COND3: cond3,
    COND4: cond4,
    DATE: date,
  });
};
export const getWorkList = (
  groupCd,
  storeCd,
  cond,
  cond2,
  cond3,
  cond4,
  date,
  cond5,
  cond6
) => {
  return api2.post("/MISTOCK/STKN07_014RPT.asmx/getWorkList", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    COND: cond,
    COND2: cond2,
    COND3: cond3,
    COND4: cond4,
    DATE: date,
    COND5: cond5,
    COND6: cond6,
  });
};

export const getLossMasterList = (groupCd, storeCd, sdate, edate) => {
  return api2.post("/MISTOCK/STKN06_012INS.asmx/getLossMasterList", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    SDATE: sdate,
    EDATE: edate,
  });
};

export const getLossStockDetail = (groupCd, storeCd, loss) => {
  return api2.post("/MISTOCK/STKN06_012INS.asmx/getLossStockDetail", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    LOSSNO: loss,
  });
};

export const getLossStockItemList = (groupCd, storeCd, type, name) => {
  return api2.post("/MISTOCK/STKN06_012INS.asmx/getLossStockItemList", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    TYPE: type,
    NAME: name,
  });
};

export const getLossTypeList = (groupCd, type) => {
  return api2.post("/MISTOCK/STKN06_012INS.asmx/getLossTypeList", {
    GROUP_CD: groupCd,
    TYPE: type,
  });
};

export const saveLossMaster = (
  groupCd,
  storeCd,
  date,
  itemids,
  qtys,
  losscodes,
  seq,
  cond
) => {
  return api2.post("/MISTOCK/STKN06_012INS.asmx/saveLossMaster", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    DATE: date,
    ITEM_IDS: itemids,
    QTYS: qtys,
    LOSS_CD: losscodes,
    SEQ: seq,
    COND: cond,
  });
};

export const getLossStockItemDetailList = (groupCd, storeCd, lossno) => {
  return api2.post("/MISTOCK/STKN06_012INS.asmx/getLossStockItemDetailList", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    LOSS_NO: lossno,
  });
};

export const updateLossMasterDetail = (
  groupCd,
  storeCd,
  lossNo,
  itemids,
  losscodes,
  qtys,
  seq
) => {
  return api2.post("/MISTOCK/STKN06_012INS.asmx/updateLossMasterDetail", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    LOSS_NO: lossNo,
    ITEM_IDS: itemids,
    QTYS: qtys,
    LOSS_CD: losscodes,
    SEQ: seq,
  });
};

export const deleteLossStock = (groupCd, storeCd, lossno) => {
  return api2.post("/MISTOCK/STKN06_012INS.asmx/deleteLossStock", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    LOSS_NO: lossno,
  });
};

export const getLossReportList = (
  groupCd,
  storeCd,
  storeattr,
  sdate,
  edate,
  itemtype,
  groupmaster,
  groupsub,
  unit,
  reporttype
) => {
  return api2.post("/MISTOCK/STKN06_016RPT.asmx/getLossReportList", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    STORE_ATTR: storeattr,
    SDATE: sdate,
    EDATE: edate,
    ITEMTYPE: itemtype,
    GROUPMASTER: groupmaster,
    GROUPSUB: groupsub,
    UNIT: unit,
    REPORTTYPE: reporttype,
  });
};

export const getStockDailyList = (
  groupCd,
  storeCd,
  date,
  unittype,
  showtype
) => {
  return api2.post("/MISTOCK/STKN07_018RPT.asmx/getStockDailyList", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    DATE: date,
    UNIT_TYPE: unittype,
    SHOW_TYPE: showtype,
  });
};

export const getDailyInventoryList = (
  groupCd,
  storeCd,
  category,
  sdate,
  edate,
  opt
) => {
  return api2.post("/MISTOCK/STK07_025RPT.asmx/getDailyInventoryList", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    CATE: category,
    SDATE: sdate,
    EDATE: edate,
    OPT: opt,
  });
};

export const getStockMonthlyInOutList = (
  groupCd,
  storeCd,
  date,
  cond,
  cond2,
  cond3,
  barcode,
  cond4,
  cond5,
  cond6,
  cond7,
  cond8,
  stockid,
  reporttype
) => {
  return api2.post("/MISTOCK/STK08_008RPT.asmx/getStockMonthlyInOutList", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    DATE: date,
    CATE: cond,
    GROUP: cond2,
    GENERIC: cond3,
    BARCODE: barcode,
    UNITTYPE: cond4,
    UNITPRICE: cond5,
    SHOWTYPE: cond6,
    STOCK_ID: cond7,
    STOCK_NM: cond8,
    SUPPLE_ID: stockid,
    REPORT_TYPE: reporttype,
  });
};

export const getMonthCloseList = (groupCd, storeCd, date) => {
  return api2.post("/MISTOCK/STK08_021MAN.asmx/getMonthCloseList", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    DATE: date,
  });
};

export const saveMonthCloseUpdate = (
  groupCd,
  storeCds,
  date,
  checkbln,
  seq
) => {
  return api2.post("/MISTOCK/STK08_021MAN.asmx/saveMonthCloseUpdate", {
    GROUP_CD: groupCd,
    STORE_CDS: storeCds,
    DATE: date,
    CHECKBLNS: checkbln,
    SEQ: seq,
  });
};

export const getMonthCloseList2 = (groupCd, storeCd, date, lang) => {
  return api2.post("/MISTOCK/STK09_003BAT.asmx/getMonthCloseList2", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    DATE: date,
    LANG: lang,
  });
};

export const checkPreMonthCloseStores = (groupCd, storeCd, date) => {
  return api2.post("/MISTOCK/STK09_003BAT.asmx/checkPreMonthCloseStores", {
    GROUP_CD: groupCd,
    STORE_CDS: storeCd,
    DATE: date,
  });
};

export const saveMonthClose = (groupCd, storeCd, date, seq) => {
  return api2.post("/MISTOCK/STK09_003BAT.asmx/saveMonthClose", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    DATE: date,
    SEQ: seq,
  });
};

export const reserveMonthCloseStores = (groupCd, storeCd, date, seq) => {
  return api2.post("/MISTOCK/STK09_003BAT.asmx/reserveMonthCloseStores", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    DATE: date,
    SEQ: seq,
  });
};

export const saveTakeDailyRegister = (
  groupCd,
  storeCd,
  date,
  stockids,
  takeqtys,
  unittype
) => {
  return api2.post("/MISTOCK/STKN07_018RPT.asmx/saveTakeDailyRegister", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    DATE: date,
    STOCK_IDS: stockids,
    TAKEQTYS: takeqtys,
    UNITTYPES: unittype,
  });
};

export const getStockCheckLossByUpdate = (groupCd, storeCd, loss) => {
  return api2.post("/MISTOCK/STKN06_012INS.asmx/getStockCheckLossByUpdate", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    LOSSNO: loss,
  });
};

export const getDiligenceRegistration = (
  groupCd,
  storeCd,
  date,
  lngTakeCycle,
  lngUnitType,
  strShowType,
  lngSupplierID,
  lngGroupID,
  lngCategoryID,
  lngGenericID
) => {
  return api2.post("/MISTOCK/STKN07_013RPT.asmx/getDiligenceRegistration", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    DATE: date,
    TAKE_CYCLE: lngTakeCycle,
    UNIT_TYPE: lngUnitType,
    SHOW_TYPE: strShowType,
    SUPP_ID: lngSupplierID,
    GROUP_ID: lngGroupID,
    CATE_ID: lngCategoryID,
    GEN_ID: lngGenericID,
  });
};

export const getDiligenceRegistration2 = (
  groupCd,
  storeCd,
  date,
  lngTakeCycle,
  lngUnitType,
  strShowType
) => {
  return api2.post("/MISTOCK/STKN07_013RPT.asmx/getDiligenceRegistration2", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    DATE: date,
    TAKE_CYCLE: lngTakeCycle,
    UNIT_TYPE: lngUnitType,
    SHOW_TYPE: strShowType,
  });
};

export const delDiligenceRegistration = (
  groupCd,
  storeCd,
  date,
  stockId,
  closeYn
) => {
  return api2.post("/MISTOCK/STKN07_013RPT.asmx/delDiligenceRegistration", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    DATE: date,
    STOCK_ID: stockId,
    CLOSE_YN: closeYn,
  });
};

export const setDiligenceRegistration = (
  lngTakeCycle,
  groupCd,
  storeCd,
  date,
  stockId,
  dblTakeQty,
  dblShortQty,
  unitType,
  isClose
) => {
  return api2.post("/MISTOCK/STKN07_013RPT.asmx/setDiligenceRegistration", {
    TAKE_CYCLE: lngTakeCycle,
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    DATE: date,
    STOCK_ID: stockId,
    TAKE_QTY: dblTakeQty,
    SHORT_QTY: dblShortQty,
    UNIT_TYPE: unitType,
    CLOSE_YN: isClose,
  });
};
export const getLossMasterPartList = (groupCd, storeCd) => {
  return api2.post("/MISTOCK/STKN06_013INS.asmx/getLossMasterPartList", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
  });
};

export const getLossMasterListbyPart = (
  groupCd,
  storeCd,
  part,
  sdate,
  edate
) => {
  return api2.post("/MISTOCK/STKN06_013INS.asmx/getLossMasterListbyPart", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    PART: part,
    SDATE: sdate,
    EDATE: edate,
  });
};

export const getLossStockDetailbyPart = (groupCd, storeCd, lossno) => {
  return api2.post("/MISTOCK/STKN06_013INS.asmx/getLossStockDetailbyPart", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    LOSS_NO: lossno,
  });
};

export const updateLossMasterDetailbyPart = (
  groupCd,
  storeCd,
  lossNo,
  itemids,
  losscodes,
  qtys,
  seq
) => {
  return api2.post("/MISTOCK/STKN06_013INS.asmx/updateLossMasterDetailbyPart", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    LOSS_NO: lossNo,
    ITEM_IDS: itemids,
    QTYS: qtys,
    LOSS_CD: losscodes,
    SEQ: seq,
  });
};

export const saveLossMasterbyPart = (
  groupCd,
  storeCd,
  date,
  itemids,
  qtys,
  losscodes,
  seq,
  cond,
  part
) => {
  return api2.post("/MISTOCK/STKN06_013INS.asmx/saveLossMasterbyPart", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    DATE: date,
    ITEM_IDS: itemids,
    QTYS: qtys,
    LOSS_CD: losscodes,
    SEQ: seq,
    COND: cond,
    PART: part,
  });
};

export const getTakeWorkSheetListbyPart = (
  groupCd,
  storeCd,
  master,
  slave,
  stocknm,
  slave2,
  takedate,
  partcd,
  checkall
) => {
  return api2.post("/MISTOCK/STKN07_015RPT.asmx/getTakeWorkSheetListbyPart", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    MASTER: master,
    SLAVE: slave,
    STOCKNM: stocknm,
    SLAVE2: slave2,
    TDATE: takedate,
    PARTCD: partcd,
    CHECKALL: checkall,
  });
};

export const getStockTakeCountListbyPart = (
  groupCd,
  storeCd,
  date,
  cycle,
  unittype,
  showtype,
  part
) => {
  return api2.post("/MISTOCK/STKN07_016RPT.asmx/getStockTakeCountListbyPart", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    DATE: date,
    CYCLE: cycle,
    UNITTYPE: unittype,
    SHOWTYPE: showtype,
    PART: part,
  });
};

export const saveStockTakeCountByPart = (
  closetype,
  groupCd,
  storeCd,
  date,
  stockid,
  takeqty,
  unittype,
  partcd
) => {
  return api2.post("/MISTOCK/STKN07_016RPT.asmx/saveStockTakeCountByPart", {
    CLOSETYPE: closetype,
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    DATE: date,
    STOCKID: stockid,
    TAKEQTY: takeqty,
    UNITTYPE: unittype,
    PART: partcd,
  });
};

export const deleteStockTakeByPart = (
  groupCd,
  storeCd,
  date,
  stockid,
  partcd
) => {
  return api2.post("/MISTOCK/STKN07_016RPT.asmx/deleteStockTakeByPart", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    DATE: date,
    STOCKID: stockid,
    PARTCD: partcd,
  });
};

export const getStockResultByPart = (
  groupCd,
  storeCd,
  date,
  takecycle,
  unittype,
  showtype,
  partcd
) => {
  return api2.post("/MISTOCK/STKN07_017RPT.asmx/getStockResultByPart", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    DATE: date,
    TAKECYCLE: takecycle,
    UNITTYPE: unittype,
    SHOWTYPE: showtype,
    PARTCD: partcd,
  });
};

export const getStockMonthlyInOutListByPart = (
  groupCd,
  storeCd,
  part,
  month,
  cate,
  group,
  generic,
  unittype,
  pricetype,
  showtype,
  stockid,
  stocknm,
  supplierid,
  reporttype
) => {
  return api2.post(
    "/MISTOCK/STK08_019RPT.asmx/getStockMonthlyInOutListByPart",
    {
      GROUP_CD: groupCd,
      STORE_CD: storeCd,
      PART: part,
      MONTH: month,
      CATE: cate,
      GROUP: group,
      GENERIC: generic,
      UNITTYPE: unittype,
      PRICETYPE: pricetype,
      SHOWTYPE: showtype,
      STOCKID: stockid,
      STOCKNM: stocknm,
      SUPPLIERID: supplierid,
      REPORTTYPE: reporttype,
    }
  );
};

export const getStockOrderList = (
  groupCd,
  storeCd,
  sdate,
  edate,
  supplierid,
  part,
  lang
) => {
  return api2.post("/MIPUR/PUR03_035INS.asmx/getStockOrderList", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    SDATE: sdate,
    EDATE: edate,
    SUPPLIERID: supplierid,
    PART: part,
    LANG: lang,
  });
};

export const getDemCloseTime = (groupCd, storeCd) => {
  return api2.post("/MISTOCK/STK01_002INS.asmx/getDemCloseTime", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
  });
};

export const getDemandAuditList = (groupCd) => {
  return api2.post("/MISTOCK/STK01_002INS.asmx/getDemandAuditList", {
    GROUP_CD: groupCd,
  });
};

export const saveDemCloseAndAuditList = (
  groupCd,
  storeArea,
  time,
  date,
  storecds,
  permissions
) => {
  return api2.post("/MISTOCK/STK01_002INS.asmx/saveDemCloseAndAuditList", {
    GROUP_CD: groupCd,
    STORE_AREA: storeArea,
    TIME: time,
    DATE: date,
    STORECDS: storecds,
    PERMISSIONS: permissions,
  });
};

export const getDemandStoreList = (groupCd, attr) => {
  return api2.post("/MISTOCK/STK01_011INS.asmx/getDemandStoreList", {
    GROUP_CD: groupCd,
    ATTR: attr,
  });
};
export const getCheckAbility = (groupCd, storeCd) => {
  return api2.post("/MISTOCK/STK01_011INS.asmx/getCheckAbility", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
  });
};

export const getStockDemandList2 = (groupCd, storeCd, lang, sdate, edate) => {
  return api2.post("/MISTOCK/STK01_011INS.asmx/getStockDemandList2", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    LANG: lang,
    SDATE: sdate,
    EDATE: edate,
  });
};

export const getStockDetail2 = (
  groupCd,
  storecd,
  lang,
  demandno,
  demanddate
) => {
  return api2.post("/MISTOCK/STK01_011INS.asmx/getStockDetail2", {
    GROUP_CD: groupCd,
    STORE_CD: storecd,
    LANG: lang,
    DEMANDNO: demandno,
    DEMANDDATE: demanddate,
  });
};

export const updateDemandMaster = (
  groupCd,
  storecd,
  date,
  demandno,
  comment,
  endDate
) => {
  return api2.post("/MISTOCK/STK01_011INS.asmx/updateDemandMaster", {
    GROUP_CD: groupCd,
    STORE_CD: storecd,
    DATE: date,
    DEMANDNO: demandno,
    COMMENT: comment,
    ENDDATE: endDate,
  });
};

export const InsertDemandMasterDetail = (
  groupCd,
  storecd,
  date,
  comments,
  classtype,
  ddate,
  edate,
  stockids,
  qtys,
  userid,
  specialyn,
  char,
  comments2
) => {
  return api2.post("/MISTOCK/STK01_011INS.asmx/InsertDemandMasterDetail", {
    GROUP_CD: groupCd,
    STORE_CD: storecd,
    DATE: date,
    COMMENT: comments,
    CLASSTYPE: classtype,
    DDATE: ddate,
    EDATE: edate,
    STOCKIDS: stockids,
    QTYS: qtys,
    USERID: userid,
    SPECIAL: specialyn,
    CHAR: char,
    COMMENTS: comments2,
  });
};

export const deleteDemandMaster = (
  groupCd,
  storecd,
  demandno,
  date,
  userid
) => {
  return api2.post("/MISTOCK/STK01_011INS.asmx/deleteDemandMaster", {
    GROUP_CD: groupCd,
    STORE_CD: storecd,
    DEMANDNO: demandno,
    DATE: date,
    USERID: userid,
  });
};

export const getOptionStoreList = (groupCd, storecd) => {
  return api2.post("/MISTOCK/STK32_001INS.asmx/getOptionStoreList", {
    GROUP_CD: groupCd,
    STORE_CD: storecd,
  });
};

export const getStockOrderReleaseList = (
  groupCd,
  storecd,
  dstorecd,
  sdate,
  edate,
  mdate,
  status,
  lang
) => {
  return api2.post("/MISTOCK/STK32_001INS.asmx/getStockOrderReleaseList", {
    GROUP_CD: groupCd,
    STORE_CD: storecd,
    DSTORE_CD: dstorecd,
    SDATE: sdate,
    EDATE: edate,
    MDATE: mdate,
    STATUS: status,
    LANG: lang,
  });
};

export const getStockDetail3 = (
  groupCd,
  storecd,
  demandno,
  movedate,
  outstore
) => {
  return api2.post("/MISTOCK/STK32_001INS.asmx/getStockDetail3", {
    GROUP_CD: groupCd,
    STORE_CD: storecd,
    DEMAND_NO: demandno,
    MDATE: movedate,
    MOVEOUTSTORE: outstore,
  });
};

export const saveStockConfirm = (
  groupCd,
  storecd,
  storecd2,
  mdate,
  itemids,
  qtys,
  unitprices,
  cursupplys,
  curtaxes,
  demandnos,
  demandseqs,
  lngsequence,
  comment
) => {
  return api2.post("/MISTOCK/STK32_001INS.asmx/saveStockConfirm", {
    GROUP_CD: groupCd,
    STORE_CD: storecd,
    STORE_CD2: storecd2,
    MDATE: mdate,
    ITEMIDS: itemids,
    QTYS: qtys,
    UNITPRICES: unitprices,
    SUPPLYS: cursupplys,
    CURTAXES: curtaxes,
    DEMANDNOS: demandnos,
    DEMANDSEQS: demandseqs,
    LNGSEQUENCE: lngsequence,
    COMMENTS: comment,
  });
};

export const deleteStockConfirmList = (
  groupCd,
  storecd,
  dstorecd,
  demandno,
  mdate,
  edate,
  userid
) => {
  return api2.post("/MISTOCK/STK32_001INS.asmx/deleteStockConfirmList", {
    GROUP_CD: groupCd,
    STORE_CD: storecd,
    DSTORE_CD: dstorecd,
    DEMANDNO: demandno,
    MDATE: mdate,
    EDATE: edate,
    USERID: userid,
  });
};

export const saveStockConfirmAll = (
  groupCd,
  storecd,
  dstorecd,
  demandno,
  mdate,
  edate,
  userid
) => {
  return api2.post("/MISTOCK/STK32_001INS.asmx/saveStockConfirmAll", {
    GROUP_CD: groupCd,
    STORE_CD: storecd,
    DSTORE_CD: dstorecd,
    DEMANDNO: demandno,
    MDATE: mdate,
    EDATE: edate,
    USERID: userid,
  });
};

export const getShippingInfo = (groupCd) => {
  return api2.post("/MISTOCK/STK05_013RPT.asmx/getShippingInfo", {
    GROUP_CD: groupCd,
  });
};

export const getOrderOutList = (
  groupCd,
  storecd,
  storecd2,
  sdate,
  edate,
  shipcd
) => {
  return api2.post("/MISTOCK/STK05_013RPT.asmx/getOrderOutList", {
    GROUP_CD: groupCd,
    STORE_CD: storecd,
    STORE_CD2: storecd2,
    SDATE: sdate,
    EDATE: edate,
    SHIPCD: shipcd,
  });
};

export const getOutDetailList = (groupCd, storecd, storecd2, moveno) => {
  return api2.post("/MISTOCK/STK05_013RPT.asmx/getOutDetailList", {
    GROUP_CD: groupCd,
    STORE_CD: storecd,
    STORE_CD2: storecd2,
    MOVENO: moveno,
  });
};

export const getOrderStockReturnList = (
  groupCd,
  storecd,
  sdate,
  edate,
  attr,
  storecd2,
  cond,
  cond2,
  cond3,
  cond4,
  cond5,
  cond6,
  lang,
  cond7
) => {
  return api2.post("/MISTOCK/STK05_018RPT.asmx/getOrderStockReturnList", {
    GROUP_CD: groupCd,
    STORE_CD: storecd,
    SDATE: sdate,
    EDATE: edate,
    ATTR: attr,
    STORE_CD2: storecd2,
    COND: cond,
    COND2: cond2,
    COND3: cond3,
    COND4: cond4,
    COND5: cond5,
    COND6: cond6,
    LANG: lang,
    COND7: cond7,
  });
};
