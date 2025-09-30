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
export const getOrderDate = (groupCd, storeCd, cond, cond2) => {
  return api2.post("/MIPUR/PUR03_006INS.asmx/getOrderDate", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    COND: cond,
    COND2: cond2,
  });
};
export const getOrderDataByDate = (groupCd, storeCd, cond) => {
  return api2.post("/MIPUR/PUR03_006INS.asmx/getOrderDataByDate", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    COND: cond,
  });
};
export const getStockItemList3 = (
  groupCd,
  storeCd,
  storeCd2,
  date,
  cond,
  cond2,
  cond3,
  cond4,
  cond5,
  cond6,
  cond7
) => {
  return api2.post("/MIPUR/PUR03_006INS.asmx/getStockItemList3", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    STORE_CD2: storeCd2,
    DATE: date,
    COND: cond,
    COND2: cond2,
    COND3: cond3,
    COND4: cond4,
    COND5: cond5,
    COND6: cond6,
    COND7: cond7,
  });
};

export const saveFavoriteStockItem = (groupCd, storeCd, cond, cond2) => {
  return api2.post("/MIPUR/PUR03_006INS.asmx/saveFavoriteStockItem", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    COND: cond,
    COND2: cond2,
  });
};

export const deleteStockOrderItem = (
  groupCd,
  storeCd,
  orderNo,
  orderSeq,
  stockIds,
  supplierIds,
  cond
) => {
  return api2.post("/MIPUR/PUR03_006INS.asmx/deleteStockOrderItem", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    ORDER_NO: orderNo,
    ORDER_SEQ: orderSeq,
    STOCK_ID: stockIds,
    SUPPLIER_ID: supplierIds,
    COND: cond,
  });
};

export const getSubSequence = (sequence, groupCd, storeCd, cond2) => {
  return api2.post("/MIPUR/PUR03_006INS.asmx/getSubSequence", {
    SUBSEQUENCE: sequence,
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    COND2: cond2,
  });
};

export const saveNewOrderTmp = (
  groupCd,
  storeCd,
  cond,
  cond2,
  stockid,
  exdate,
  orderdate,
  supplierid,
  cond3,
  cond4,
  cond5,
  cond6,
  cond7
) => {
  return api2.post("/MIPUR/PUR03_006INS.asmx/saveNewOrderTmp", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    SEQUENCE: cond,
    SUBSEQUENCE: cond2,
    STOCK_ID: stockid,
    EX_DATE: exdate,
    OR_DATE: orderdate,
    SUPPLIER_ID: supplierid,
    ORDER_QTY: cond3,
    UNIT_PRICE: cond4,
    SUPPLY: cond5,
    TAX: cond6,
    COMMENTS: cond7,
  });
};

export const saveNewOrderTmp2 = (
  groupCd,
  storeCd,
  cond,
  cond2,
  date,
  comments
) => {
  return api2.post("/MIPUR/PUR03_006INS.asmx/saveNewOrderTmp2", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    SEQUENCE: cond,
    SUBSEQUENCE: cond2,
    DATE: date,
    COMMENTS: comments,
  });
};

export const updateOrderTmp = (
  groupCd,
  storeCd,
  orderno,
  orderseq,
  supplierid,
  stockid,
  orderqty,
  supply,
  tax,
  comment1,
  comment2,
  sequence
) => {
  return api2.post("/MIPUR/PUR03_006INS.asmx/updateOrderTmp", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    ORDER_NO: orderno,
    ORDER_SEQ: orderseq,
    SUPPLIERIDS: supplierid,
    STOCK_ID: stockid,
    ORDER_QTY: orderqty,
    SUPPLY: supply,
    TAX: tax,
    COMMENT1: comment1,
    COMMENT2: comment2,
    SEQUENCE: sequence,
  });
};

export const getOrderListByType = (
  groupCd,
  storeattr,
  storeCd,
  sdate,
  edate,
  supplierid,
  cond,
  cond2,
  cond3,
  cond4,
  cond5,
  cond6,
  cond7
) => {
  return api2.post("/MIPUR/PUR01_010RPT.asmx/getOrderListByType", {
    GROUP_CD: groupCd,
    STORE_ATTR: storeattr,
    STORE_CD: storeCd,
    SDATE: sdate,
    EDATE: edate,
    SUPPLIERID: supplierid,
    COND: cond,
    COND2: cond2,
    COND3: cond3,
    COND4: cond4,
    COND5: cond5,
    COND6: cond6,
    COND7: cond7,
  });
};

export const getReturnListByType = (
  groupCd,
  storeCd,
  sdate,
  edate,
  supplierid,
  cond,
  cond2,
  cond3,
  cond4,
  storeattr,
  cond5
) => {
  return api2.post("/MIPUR/PUR03_006RPT.asmx/getReturnListByType", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    SDATE: sdate,
    EDATE: edate,
    SUPPLIERID: supplierid,
    COND: cond,
    COND2: cond2,
    COND3: cond3,
    COND4: cond4,
    STORE_ATTR: storeattr,
    COND5: cond5,
  });
};

export const getCheckReturnReportList = (
  groupCd,
  storeCd,
  sdate,
  edate,
  supplierid,
  cond,
  cond2,
  cond3,
  cond4,
  storeattr,
  cond5,
  cond6
) => {
  return api2.post("/MIPUR/PUR02_014RPT.asmx/getCheckReturnReportList", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    SDATE: sdate,
    EDATE: edate,
    SUPPLIERID: supplierid,
    COND: cond,
    COND2: cond2,
    COND3: cond3,
    COND4: cond4,
    STORE_ATTR: storeattr,
    COND5: cond5,
    PRICETYPE: cond6,
  });
};

export const getPurchaseOrderList = (groupCd, storeCd, sdate, supplierid) => {
  return api2.post("/MIPUR/PUR03_016RPT.asmx/getPurchaseOrderList", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    SDATE: sdate,
    SUPPLIERID: supplierid,
  });
};
export const getOrderInfoDetail = (groupCd, storeCd, orderNo) => {
  return api2.post("/MIPUR/PUR03_016RPT.asmx/getOrderInfoDetail", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    ORDER_NO: orderNo,
  });
};
export const getPurChaseEnrollList = (
  groupCd,
  storeCd,
  lang,
  date1,
  date2,
  supplierid
) => {
  return api2.post("/MIPUR/PUR02_031INS.asmx/getPurChaseEnrollList", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    LANG: lang,
    SDATE: date1,
    EDATE: date2,
    SUPPLIERID: supplierid,
  });
};

export const getStockItemList4 = (
  groupCd,
  storeCd,
  supplierid,
  date,
  master,
  detail,
  name
) => {
  return api2.post("/MIPUR/PUR02_031INS.asmx/getStockItemList4", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    SUPPLIERID: supplierid,
    DATE: date,
    MASTER: master,
    DETAIL: detail,
    NAME: name,
  });
};
export const getStockItemDetail = (groupCd, storeCd, orderNo, supplierid) => {
  return api2.post("/MIPUR/PUR02_031INS.asmx/getStockItemDetail", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    ORDER_NO: orderNo,
    SUPPLIERID: supplierid,
  });
};

export const saveStockMasterDetail = (
  groupCd,
  storeCd,
  storeCd2,
  date,
  supplierids,
  stockids,
  checkqtys,
  unitprices,
  supplys,
  taxs,
  orderNo,
  orderseq,
  type,
  userid,
  comments
) => {
  return api2.post("/MIPUR/PUR02_031INS.asmx/saveStockMasterDetail", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    STORE_CD2: storeCd2,
    DATE: date,
    SUPPLIERIDS: supplierids,
    STOCKIDS: stockids,
    CHECKQTYS: checkqtys,
    UNITPRICES: unitprices,
    SUPPLYS: supplys,
    TAXS: taxs,
    ORDERNO: orderNo,
    ORDERSEQ: orderseq,
    TYPE: type,
    USERID: userid,
    COMMENTS: comments,
  });
};

export const getStockMasterComment = (groupCd, storeCd, checkNo) => {
  return api2.post("/MIPUR/PUR02_031INS.asmx/getStockMasterComment", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    CHECK_NO: checkNo,
  });
};

export const updateCheckMasterDetails = (
  groupCd,
  storeCd,
  storeCd2,
  checknos,
  checkseqs,
  checkqtys,
  unitprices,
  supplys,
  taxs,
  orderNo,
  orderseq,
  type,
  userid,
  comments
) => {
  return api2.post("/MIPUR/PUR02_031INS.asmx/updateCheckMasterDetails", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    STORE_CD2: storeCd2,
    CHECKNOS: checknos,
    CHECKSEQS: checkseqs,
    CHECKQTYS: checkqtys,
    UNITPRICES: unitprices,
    SUPPLYS: supplys,
    TAXS: taxs,
    ORDERNO: orderNo,
    ORDERSEQ: orderseq,
    TYPE: type,
    USERID: userid,
    COMMENTS: comments,
  });
};

export const getCloseDtmDate = (groupCd, storeCd) => {
  return api2.post("/MIPUR/PUR02_031INS.asmx/getCloseDtmDate", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
  });
};
export const deleteCheckDetailMasters = (
  groupCd,
  storeCd,
  checknos,
  userid
) => {
  return api2.post("/MIPUR/PUR02_031INS.asmx/deleteCheckDetailMasters", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    CHECK_NOS: checknos,
    USER_ID: userid,
  });
};

export const getStockOrderCheckList = (
  groupCd,
  storeCd,
  supplierid,
  sdate,
  edate,
  sts
) => {
  return api2.post("/MIPUR/PUR02_015INS.asmx/getStockOrderCheckList", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    SUPPLIER_ID: supplierid,
    SDATE: sdate,
    EDATE: edate,
    STATUS: sts,
  });
};

export const getStockOrderDetails = (
  groupCd,
  storeCd,
  orderno,
  supplierid,
  date,
  lang
) => {
  return api2.post("/MIPUR/PUR02_015INS.asmx/getStockOrderDetails", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    ORDER_NO: orderno,
    SUPPLIER_ID: supplierid,
    DATE: date,

    LANG: lang,
  });
};

export const checkStockCloseDate = (groupCd, storeCd, date) => {
  return api2.post("/MIPUR/PUR02_015INS.asmx/checkStockCloseDate", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    DATE: date,
  });
};

export const saveStockCheckMasterDetail = (
  groupCd,
  storeCd,
  date,
  comments,
  checktype,
  empname,
  checkno,
  checkdate,
  supplierid,
  stockids,
  checkqtys,
  unitprice,
  supply,
  tax,
  ordernos,
  orderseqs,
  userid
) => {
  return api2.post("/MIPUR/PUR02_015INS.asmx/saveStockCheckMasterDetail", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    DATE: date,
    COMMENTS: comments,
    CHECKTYPE: checktype,
    EMPNAME: empname,
    CHECKNO: checkno,
    CHECKDATE: checkdate,
    SUPPLIERID: supplierid,
    STOCKIDS: stockids,
    CHECKQTYS: checkqtys,
    UNITPRICES: unitprice,
    SUPPLYS: supply,
    TAXS: tax,
    ORDERNOS: ordernos,
    ORDERSEQS: orderseqs,
    USERID: userid,
    COMMENTS2: comments,
  });
};

export const cancelStockConfirm = (
  groupCd,
  storeCd,
  cond,
  cond2,
  cond3,
  cond4,
  cond5,
  cond6
) => {
  return api2.post("/MIPUR/PUR02_015INS.asmx/cancelStockConfirm", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    ORDERNO: cond,
    ORDERDATE: cond2,
    CHECKNO: cond3,
    CHECKDATE: cond4,
    SUPPLIERID: cond5,
    USERID: cond6,
  });
};
export const getStockAuditReportList = (
  groupCd,
  storeCd,
  cond,
  cond2,
  cond3,
  cond4,
  cond5,
  cond6
) => {
  return api2.post("/MIPUR/PUR02_016RPT.asmx/getStockAuditReportList", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    SDATE: cond,
    EDATE: cond2,
    SUPPLIERID: cond3,
    COND: cond4,
    COND2: cond5,
    ATTR: cond6,
  });
};
export const getOrderNCheckChitMasterList = (
  groupCd,
  storeCd,
  cond,
  cond2,
  cond3,
  cond4
) => {
  return api2.post("/MIPUR/PUR02_012RPT.asmx/getOrderNCheckChitMasterList", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    SDATE: cond,
    EDATE: cond2,
    SUPPLIERID: cond3,
    COND: cond4,
  });
};

export const getOrderNCheckChitDetailList = (
  groupCd,
  storeCd,
  cond,
  cond2,
  cond3,
  cond4,
  cond5
) => {
  return api2.post("/MIPUR/PUR02_012RPT.asmx/getOrderNCheckChitDetailList", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    SUPPLIER_ID: cond,
    ODATE: cond2,
    CDATE: cond3,
    COND: cond4,
    COND2: cond5,
  });
};

export const getOrderListByType2 = (
  groupCd,
  storeCd,
  sdate,
  edate,
  supplierid,
  cond,
  cond2,
  cond3,
  cond4,
  storeattr,
  cond5,
  cond6,
  cond7
) => {
  return api2.post("/MIPUR/PUR01_009RPT.asmx/getOrderListByType2", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    SDATE: sdate,
    EDATE: edate,
    SUPPLIERID: supplierid,
    MASTER: cond,
    DETAIL: cond2,
    NAME: cond3,
    UNITTYPE: cond4,
    STORE_ATTR: storeattr,
    SEQUENCE: cond5,
    IP: cond6,
    COND5: cond7,
  });
};

export const getStockUnitPriceList = (
  groupCd,
  storeCd,
  supplierid,
  stockid,
  stockname,
  lang
) => {
  return api2.post("/MIPUR/PUR04_001INS.asmx/getStockUnitPriceList", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    SUPPLIER_ID: supplierid,
    STOCK_ID: stockid,
    STOCKNAME: stockname,
    LANG: lang,
  });
};

export const getUnitPriceDetailList = (
  groupCd,
  storeCd,
  supplierid,
  stockid,
  lang
) => {
  return api2.post("/MIPUR/PUR04_001INS.asmx/getUnitPriceDetailList", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    SUPPLIER_ID: supplierid,
    STOCK_ID: stockid,
    LANG: lang,
  });
};

export const saveStockPriceHistory = (
  groupCd,
  storeCd,
  supplierid,
  stockid,
  unitprice,
  date,
  main,
  seq
) => {
  return api2.post("/MIPUR/PUR04_001INS.asmx/saveStockPriceHistory", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    SUPPLIER_ID: supplierid,
    STOCK_ID: stockid,
    UNIT_PRICE: unitprice,
    DATE: date,
    MAIN: main,
    SEQ: seq,
  });
};

export const deleteStockPriceHistory = (
  groupCd,
  storeCd,
  supplierid,
  stockid,
  fdate,
  tdate
) => {
  return api2.post("/MIPUR/PUR04_001INS.asmx/deleteStockPriceHistory", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    SUPPLIER_ID: supplierid,
    STOCK_ID: stockid,
    FDATE: fdate,
    TDATE: tdate,
  });
};

export const getCheckStoreList = (groupCd, storeCd) => {
  return api2.post("/MIPUR/PUR04_001INS.asmx/getCheckStoreList", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
  });
};

export const getReturnChitList = (
  groupCd,
  storeCd,
  jointype,
  teamcode,
  supervisor,
  supplierid,
  sdate,
  edate
) => {
  return api2.post("/MIPUR/PUR03_005INS.asmx/getReturnChitList", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    JOIN_TYPE: jointype,
    TEAM_CD: teamcode,
    SUPER_CD: supervisor,
    SUPPLIER_ID: supplierid,
    SDATE: sdate,
    EDATE: edate,
  });
};

export const getReturnDetailList = (groupCd, storeCd, returnno, returndate) => {
  return api2.post("/MIPUR/PUR03_005INS.asmx/getReturnDetailList", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    RETURN_NO: returnno,
    RETURN_DATE: returndate,
  });
};

export const getStockReturnDetailList = (
  groupCd,
  storeCd,
  jointype,
  teamcode,
  supervisor,
  supplierid,
  stockid,
  stockNm,
  fdate,
  tdate,
  checkno
) => {
  return api2.post("/MIPUR/PUR03_005INS.asmx/getStockReturnDetailList", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    JOIN_TYPE: jointype,
    TEAM_CD: teamcode,
    SUPER_CD: supervisor,
    SUPPLIER_ID: supplierid,
    STOCK_ID: stockid,
    STOCK_NM: stockNm,
    FDATE: fdate,
    TDATE: tdate,
    CHECKNO: checkno,
  });
};

export const getStockCloseDate = (groupCd, storeCd, date) => {
  return api2.post("/MIPUR/PUR03_005INS.asmx/getStockCloseDate", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    DATE: date,
  });
};

export const saveStockReturnMasterDetails = (
  groupCd,
  storeCd,
  supplierid,
  date,
  comments,
  returnno,
  stockids,
  returnqtys,
  unitprices,
  checknos,
  checkseqs,
  userid
) => {
  return api2.post("/MIPUR/PUR03_005INS.asmx/saveStockReturnMasterDetails", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    SUPPLIER_ID: supplierid,
    DATE: date,
    COMMENT: comments,
    RETURN_NO: returnno,
    STOCK_IDS: stockids,
    RETURN_PRICES: returnqtys,
    UNIT_PRICES: unitprices,
    CHECKNOS: checknos,
    CHECKSEQS: checkseqs,
    USER_ID: userid,
  });
};

export const deleteStockReturnChits = (groupCd, storeCd, returnos, userid) => {
  return api2.post("/MIPUR/PUR03_005INS.asmx/deleteStockReturnChits", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    RETURN_NO: returnos,
    USERID: userid,
  });
};

export const copyPurchasePrice = (groupCd, storeCd, storeCds, stockIds) => {
  return api2.post("/MIPUR/PUR04_001INS.asmx/copyPurchasePrice", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    STORE_CDS: storeCds,
    STOCK_IDS: stockIds,
  });
};

export const getStockItemListWithFavorite = (
  groupCd,
  storeCd,
  part,
  div,
  udate
) => {
  return api2.post("/MIPUR/PUR03_035INS.asmx/getStockItemListWithFavorite", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    PART: part,
    DIV: div,
    UDATE: udate,
  });
};

export const saveFavoriteStockItemBypart = (
  groupCd,
  storeCd,
  stockid,
  value,
  part
) => {
  return api2.post("/MIPUR/PUR03_035INS.asmx/saveFavoriteStockItemBypart", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    STOCKID: stockid,
    VALUE: value,
    PART: part,
  });
};

export const getCloseDtmDate2 = (groupCd, storeCd, date, generic) => {
  return api2.post("/MIPUR/PUR03_035INS.asmx/getCloseDtmDate2", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    DATE: date,
    GENERIC: generic,
  });
};

export const saveOrderMasterDetailByPart = (
  groupCd,
  storeCd,
  sdate,
  edate,
  comment,
  sequence,
  interfacediv,
  supplierid,
  stockids,
  qty,
  unitprice,
  supply,
  tax,
  comment2,
  partcd
) => {
  return api2.post("/MIPUR/PUR03_035INS.asmx/saveOrderMasterDetailByPart", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    SDATE: sdate,
    EDATE: edate,
    COMMENT: comment,
    SEQUENCE: sequence,
    INTERFACE: interfacediv,
    SUPPLIERID: supplierid,
    STOCKIDS: stockids,
    QTY: qty,
    UNITPRICE: unitprice,
    SUPPLY: supply,
    TAX: tax,
    COMMENT2: comment2,
    PART: partcd,
  });
};

export const getOrderListPartByType = (
  groupCd,
  storeCd,
  sdate,
  edate,
  supplierid,
  stockmaster,
  detail,
  name,
  unittype,
  part,
  sequence,
  ip,
  stype
) => {
  return api2.post("/MIPUR/PUR03_036RPT.asmx/getOrderListPartByType", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    SDATE: sdate,
    EDATE: edate,
    SUPPLIERID: supplierid,
    STOCKMASTER: stockmaster,
    DETAIL: detail,
    NAME: name,
    UNITTYPE: unittype,
    PART: part,
    SEQUENCE: sequence,
    IP: ip,
    STYPE: stype,
  });
};

export const getPurchaseOrderListByPart = (
  groupCd,
  storeCd,
  part,
  date,
  supplier
) => {
  return api2.post("/MIPUR/PUR03_037RPT.asmx/getPurchaseOrderListByPart", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    PART: part,
    DATE: date,
    SUPPLIER: supplier,
  });
};

export const getStockOrderCheckListByPart = (
  groupCd,
  storeCd,
  part,
  supplier,
  sdate,
  edate,
  status
) => {
  return api2.post("/MIPUR/PUR02_017INS.asmx/getStockOrderCheckListByPart", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    PART: part,
    SUPPLIER: supplier,
    SDATE: sdate,
    EDATE: edate,
    STATUS: status,
  });
};

export const saveStockCheckMasterDetailByPart = (
  groupCd,
  storeCd,
  date,
  comments,
  checktype,
  empname,
  partno,
  supplierid,
  stockid,
  checkqty,
  unitprice,
  supply,
  tax,
  orderno,
  orderseqs,
  userid,
  comments2
) => {
  return api2.post(
    "/MIPUR/PUR02_017INS.asmx/saveStockCheckMasterDetailByPart",
    {
      GROUP_CD: groupCd,
      STORE_CD: storeCd,
      DATE: date,
      COMMENTS: comments,
      CHECKTYPE: checktype,
      EMPNAME: empname,
      PARTNO: partno,
      SUPPLIERID: supplierid,
      STOCKIDS: stockid,
      CHECKQTYS: checkqty,
      UNITPRICES: unitprice,
      SUPPLYS: supply,
      TAXS: tax,
      ORDERNOS: orderno,
      ORDERSEQS: orderseqs,
      USERID: userid,
      COMMENTS2: comments2,
    }
  );
};

export const saveStockCheckedAllByPart = (
  groupCd,
  storeCd,
  part,
  orderno,
  date,
  edate
) => {
  return api2.post("/MIPUR/PUR02_017INS.asmx/saveStockCheckedAllByPart", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    PART: part,
    ORDERNO: orderno,
    DATE: date,
    EDATE: edate,
  });
};

export const getStockMasterListByPart = (
  groupCd,
  storeCd,
  part,
  sdate,
  edate,
  supplier,
  empname
) => {
  return api2.post("/MIPUR/PUR02_018INS.asmx/getStockMasterListByPart", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    PART: part,
    SDATE: sdate,
    EDATE: edate,
    SUPPLIER: supplier,
    ENAME: empname,
  });
};

export const getStockCheckDetail = (
  groupCd,
  storeCd,
  checkno,
  supplierid,
  date,
  lang
) => {
  return api2.post("/MIPUR/PUR02_018INS.asmx/getStockCheckDetail", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    CHECKNO: checkno,
    SUPPLIERID: supplierid,
    DATE: date,
    LANG: lang,
  });
};

export const getOrderConfirmDelivery = (
  groupCd,
  storeCd,
  supplierid,
  date,
) => {
  return api2.post("/MIPUR/PUR01_019INS.asmx/getOrderConfirmDelivery", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    SUPPLIER_ID: supplierid,
    DTM_DATE: date,
  });
};


export const getOrderConfirmDeliveryDetail = (
  groupCd,
  storeCd,
  supplierid,
  orderNo,
  date,
) => {
  return api2.post("/MIPUR/PUR01_019INS.asmx/getOrderConfirmDeliveryDetail", {
    GROUP_CD    : groupCd,
    STORE_CD    : storeCd,
    SUPPLIER_ID : supplierid,
    ORDER_NO    : orderNo,
    DTM_DATE    : date,
  });
};

export const setOrderConfirmDelivery = (
  groupCd,
  storeCd,
  orderNo,
  orderSeq,
  checkQty,
  stockCheckComments
) => {
  return api2.post("/MIPUR/PUR01_019INS.asmx/setOrderConfirmDelivery", {
    GROUP_CD  : groupCd,
    STORE_CD  : storeCd,
    ORDER_NO  : orderNo,
    ORDER_SEQ : orderSeq,
    CHECK_QTY : checkQty,
    STK_COM   : stockCheckComments,
  });
};

export const getOrderUnconfirmedStatus = (
  groupCd,
  storeCd,
  cond,
  cond2,
  cond3,
  cond4,
  cond5,
  cond6
) => {
  return api2.post("/MIPUR/PUR01_026RPT.asmx/getOrderUnconfirmedStatus", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    SDATE: cond,
    EDATE: cond2,
    SUPPLIERID: cond3,
    COND: cond4,
    COND2: cond5,
    ATTR: cond6,
  });
};