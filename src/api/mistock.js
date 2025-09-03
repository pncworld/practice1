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
