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
