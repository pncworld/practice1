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
