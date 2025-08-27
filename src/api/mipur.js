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
