import axios from "axios";
import store from "@/store";
import { commonUrl, commonUrl2 } from "./common";

const url = commonUrl;
const url2 = commonUrl2;
// Axios 인스턴스 생성 (기본 설정)
const api = axios.create({
  baseURL: url, // API 기본 URL
  timeout: 30000, // 요청 타임아웃 설정
});
const api2 = axios.create({
  baseURL: url2, // API 기본 URL
  timeout: 30000, // 요청 타임아웃 설정
});

api2.interceptors.request.use(
  (config) => {
    const token = store.state.StoreToken;
    //comsole.log(token);
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
export const getEmployeesData = (groupCd, searchType, searchText) => {
  return api2.post("/MIACCOUNT/ACT09_001RPT.asmx/getEmployeesData", {
    GROUP_CD: groupCd,
    SEARCH_TYPE: searchType,
    SEARCH_TEXT: searchText,
  });
};
export const getEmployeeSummary = (
  groupCd,
  storeAttr,
  storeCd,
  startDate,
  endDate,
  trantype,
  empid,
  lngoption,
  optionValue
) => {
  return api2.post("/MIACCOUNT/ACT09_001RPT.asmx/getEmployeeSummary", {
    GROUP_CD: groupCd,
    STORE_ATTR: storeAttr,
    STORE_CD: storeCd,
    START_DATE: startDate,
    END_DATE: endDate,
    TRAN_TYPE: trantype,
    EMP_ID: empid,
    LNG_OPTION: lngoption,
    OPTION_VALUE: optionValue,
  });
};
export const getEmployeeDetailSummary = (
  groupCd,
  storeAttr,
  storeCd,
  startDate,
  endDate,
  trantype,
  empid,
  lngoption,
  optionValue
) => {
  return api2.post("/MIACCOUNT/ACT09_002RPT.asmx/getEmployeeDetailSummary", {
    GROUP_CD: groupCd,
    STORE_ATTR: storeAttr,
    STORE_CD: storeCd,
    START_DATE: startDate,
    END_DATE: endDate,
    TRAN_TYPE: trantype,
    EMP_ID: empid,
    LNG_OPTION: lngoption,
    OPTION_VALUE: optionValue,
  });
};

export const getAccCodeList = (groupcd) => {
  return api2.post("/MIACCOUNT/ACT04_002RPT.asmx/getAccCodeList", {
    GROUP_CD: groupcd,
  });
};
export const getDWDetail = (groupcd, storecd, startdate, enddate, cond) => {
  return api2.post("/MIACCOUNT/ACT04_002RPT.asmx/getDWDetail", {
    GROUP_CD: groupcd,
    STORE_CD: storecd,
    START_DATE: startdate,
    END_DATE: enddate,
    COND: cond,
  });
};
export const getDWAggDetail = (groupcd, storecd, startdate, enddate) => {
  return api2.post("/MIACCOUNT/ACT04_003RPT.asmx/getDWAggDetail", {
    GROUP_CD: groupcd,
    STORE_CD: storecd,
    START_DATE: startdate,
    END_DATE: enddate,
  });
};
